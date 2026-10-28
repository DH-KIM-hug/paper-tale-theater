#!/usr/bin/env python3
"""퍼즐 조각 후처리 — 모양 조각 직소 (2026-10-28 사용자 결정, docs/PUZZLE_PLAN.md 맨 앞 절).
판(board) 그림은 한 장의 이어진 파노라마(동화 3편씩 1536×1024, assets/raw/puzzle_gpt/pano_<판>_<k>.png, 왼→오로 이어 붙임)다.
판 전체를 빈틈없이 조각으로 나누고, 모든 조각이 따로 떨어진다(빈 판 = 조각 자리 윤곽만 있는 판, 다 모으면 그림 한 장).
  · 물건 조각: 동화마다 2개, 겉모양이 그 동화의 물건·인물 모양(구름·강아지·자동차·유니콘 …). 얼굴이 잘려도 된다.
  · 자투리 조각: 물건 조각 사이를 모양 없는 큰 조각들로 나눈 것(매끈하게 굽은 경계).
  · 모든 조각은 한 장의 조각 번호 지도에서 나오므로 이웃 조각과 경계가 정확히 맞는다.
동화 1편 = 판의 한 칸(가로 512). 조각마다 무게중심이 든 칸의 동화에 속하고, 위·아래 묶음으로 나뉜다.
받는 순서: 처음 완주 = bot 묶음(아래, 주인공 모양 조각 + 둘레 자투리) · 두 번째 완주 = top 묶음(위, 하늘·소품 모양 조각 + 둘레 자투리).

  ~/.venvs/paper-tale/bin/python tools/app/gen/post_puzzle.py original            # 판 하나 (조각 그림 + 배치 정보)
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_puzzle.py                     # 모든 판 (파노라마 없는 판은 배치 정보에서 빈 칸)
  --preview <폴더>   미리보기 png 를 그 폴더에(기본 assets/raw/puzzle_gpt/)
  --seamsrc          이음매 작업표의 참고 그림만 다시 만든다(판 그림을 새로 뽑은 뒤 → run_simple.py pzseam … → 이 도구)

입력  tools/app/gen/puzzle_shapes.json   동화마다 {"top": 모양, "bot": 모양}. 모양 = 스프라이트 경로(알파 윤곽을 둥글게 다듬어 틀로 쓴다)
        또는 {"src": 경로, "flip": true|false, "cx": 칸 안 x, "cy": 판 y, "w": 가로} (cx·cy·w 를 빼면 칸 안에 가장 크게 자동 배치)
출력  assets/ui/pz_<동화id>_<top|bot>_<n>.webp   투명 조각 그림(n = 묶음 안 번호, 0 = 물건 조각)
      assets/ui/puzzle_layout.json   판별 동화 순서 · 동화마다 {top: [조각…], bot: [조각…]}, 조각 = {file|null, x, y, w, h, path, obj}
                                     (판 좌표 px, 칸 512, path = 상자 기준 SVG 경로, obj = 물건 모양 조각)
"""
import glob, json, os, sys
import cv2
import numpy as np
from PIL import Image, ImageFilter

G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
RAW = os.path.join(G, 'assets/raw/puzzle_gpt')
UI = os.path.join(G, 'assets/ui')
S = 512                             # 칸(동화 한 편) 가로
PER = 3                             # 파노라마 한 장 = 동화 3편
PW, PH = S * PER, S * 2
SPLIT = 430                         # 위 묶음 / 아래 묶음을 가르는 높이(자투리 조각의 무게중심 기준)
GAP = 14                            # 물건 조각과 판 가장자리 사이 최소 여백(그 사이는 자투리 조각이 된다)
SPILL = 56                          # 물건 조각이 이웃 칸으로 넘어갈 수 있는 폭(이웃 물건 조각과는 겹치지 않는다)
BOX = {'top': (GAP, GAP, S - GAP, SPLIT + 80), 'bot': (GAP // 2, SPLIT - 50, S - GAP // 2, PH - GAP)}   # 칸 안에서 물건 조각이 놓일 수 있는 범위 (x0,y0,x1,y1)
FILL_STEP = 320                     # 자투리 조각 크기(씨앗 간격 px)
SEAM_IN, SEAM_OUT = 60, 460         # 이음매 붙이기(tools/app/gen/jobs_pzseam.json): 이어 그린 그림은 이음매 양쪽 60px 안은 반드시, 460px 밖은 쓰지 않는다. 그 사이에서 두 그림이 가장 닮은 세로 길을 따라 바꾼다

ORDER = {                           # 판별 동화 순서 (docs/PUZZLE_PLAN.md 배치표, 끝에만 추가한다)
    'princess': ['cinderella', 'snow_white', 'little_mermaid', 'beauty_beast', 'princess_pea', 'rapunzel', 'frog_prince', 'sleeping_beauty'],
    'korean':   ['patjuk', 'sunmoon', 'kongjwi', 'heungbu', 'magpie', 'magic_jar'],
    'aesop':    ['frog', 'rabbit', 'sun_wind', 'lion_mouse', 'fox_crane', 'ant_grasshopper'],
    'world':    ['turnip', 'goldilocks', 'bremen', 'ugly_duckling', 'three_pigs', 'wolf_goats', 'hansel', 'red_hood'],
    'original': ['kkultteok', 'red_car', 'unicorn'],
}
SHAPES = json.load(open(os.path.join(G, 'tools/app/gen/puzzle_shapes.json')))

def fnv(t):
    h = 2166136261
    for ch in t.encode(): h = ((h ^ ch) * 16777619) & 0xFFFFFFFF
    return h

def cutter(src, flip=False, R=600):
    """스프라이트 알파 → 아이 손에 맞는 둥근 틀(가는 다리·뿔 끝·털 결은 메우고 굴린다). 윤곽 점들(긴 변 1로 정규화), (가로, 세로) 비"""
    a = np.asarray(Image.open(os.path.join(G, src)).convert('RGBA'))[:, :, 3]
    ys, xs = np.nonzero(a > 40); a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    if flip: a = a[:, ::-1]
    s = R / max(a.shape); a = cv2.resize(np.ascontiguousarray(a), (round(a.shape[1] * s), round(a.shape[0] * s)), interpolation=cv2.INTER_AREA)
    m = np.pad((a > 60).astype(np.uint8) * 255, 70)
    k = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
    m = cv2.dilate(m, k(9)); m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k(34)); m = cv2.morphologyEx(m, cv2.MORPH_OPEN, k(20))
    m = (cv2.GaussianBlur(m, (0, 0), 15) > 127).astype(np.uint8) * 255
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = cv2.approxPolyDP(max(cs, key=cv2.contourArea), 1.2, True)[:, 0, :].astype(float)
    c -= c.min(0); L = c.max(0).max()
    return c / L, c.max(0) / L

def place(spec, col, part, avoid, ncol):
    """물건 틀을 판 좌표 다각형으로. cx·cy·w 를 주면 그대로, 아니면 칸 안(이웃 칸으로 SPILL 까지)에서 이미 놓인 조각(avoid, 1/4 해상도)과
    겹치지 않는 가장 큰 크기·칸 가운데에 가까운 위치·좌우 뒤집기를 고른다"""
    if isinstance(spec, str): spec = {'src': spec}
    Q = 4
    def raster(poly):
        m = np.zeros((PH // Q, ncol * S // Q + 1), np.uint8)
        cv2.fillPoly(m, [np.round(np.array(poly) / Q).astype(np.int32)], 1); return m
    if 'w' in spec:
        pts, (ew, eh) = cutter(spec['src'], spec.get('flip', False)); sc = spec['w'] / ew
        poly = [(col * S + spec['cx'] + (px - ew / 2) * sc, spec['cy'] + (py - eh / 2) * sc) for px, py in pts]
        return poly, raster(poly)
    x0, y0, x1, y1 = BOX[part]; x0 = max(GAP, x0 + col * S - SPILL); x1 = min(ncol * S - GAP, x1 + col * S + SPILL)
    best = None
    for flip in ((False, True) if spec.get('flip') is None else (spec['flip'],)):
        pts, (ew, eh) = cutter(spec['src'], flip)
        fit = min((x1 - x0) / ew, (y1 - y0) / eh)
        for k in (1.0, .92, .84, .76, .68, .6):
            sc = fit * k; w, h = ew * sc, eh * sc
            for cx in np.arange(x0 + w / 2, x1 - w / 2 + 1, 12) if x1 - x0 > w else [(x0 + x1) / 2]:
                for cy in np.arange(y0 + h / 2, y1 - h / 2 + 1, 12) if y1 - y0 > h else [(y0 + y1) / 2]:
                    poly = [(cx + (px - ew / 2) * sc, cy + (py - eh / 2) * sc) for px, py in pts]
                    m = raster(poly)
                    if (cv2.dilate(m, np.ones((5, 5), np.uint8)) & avoid).any(): continue
                    score = k - abs(cx - (col + .5) * S) / 4000
                    if best is None or score > best[0]: best = (score, poly, m)
            if best and best[0] >= k - .2: break                        # 이 크기에서 자리를 찾았으면 더 작게 볼 필요 없다
    return best[1], best[2]

def partition(obj_lab, board, step=FILL_STEP):
    """조각 번호 지도: 물건 조각 자리는 그 번호 그대로, 나머지는 모양 없는 큰 조각들로 나눈다.
    흔든 격자 씨앗의 보로노이(낮은 주파수 잡음으로 공간을 휘어 경계를 크게 굽힘) → 끊긴 덩어리·작은 조각은 이웃에 붙임 →
    조각마다 마스크를 흐려 가장 진한 쪽을 고르면 경계가 매끈한 곡선이 된다. 돌려주는 지도에서 물건 = 1..K, 자투리 = K+1.."""
    H, W = obj_lab.shape; K = int(obj_lab.max()); rnd = np.random.default_rng(fnv(board + ':fill'))
    seeds = [(x + rnd.uniform(-.35, .35) * step, y + rnd.uniform(-.35, .35) * step)
             for y in np.arange(step / 2, H, step * .9) for x in np.arange(step / 2 + (step / 2 if int(y // (step * .9)) % 2 else 0), W, step)]
    Q = 2; h, w = H // Q, W // Q
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    noise = [cv2.GaussianBlur(rnd.standard_normal((h, w)).astype(np.float32), (0, 0), 40) for _ in range(2)]
    noise = [n / (np.abs(n).max() + 1e-6) * 64 / Q for n in noise]
    xw, yw = xx + noise[0], yy + noise[1]
    best = np.full((h, w), 1e9, np.float32); lab = np.zeros((h, w), np.int32)
    for i, (sx, sy) in enumerate(seeds):
        d = (xw - sx / Q) ** 2 + (yw - sy / Q) ** 2; m = d < best; best[m] = d[m]; lab[m] = i + 1
    o = cv2.resize(obj_lab, (w, h), interpolation=cv2.INTER_NEAREST) > 0; lab[o] = 0
    out = np.zeros_like(lab); nid = 0
    for i in range(1, len(seeds) + 1):
        n, cc = cv2.connectedComponents((lab == i).astype(np.uint8))
        for c in range(1, n): nid += 1; out[cc == c] = nid
    for _ in range(3):
        for c in range(1, nid + 1):
            m = out == c; a = m.sum()
            if 0 < a < (step / Q) ** 2 * .3:
                ring = cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool) & ~m & (out > 0)
                if ring.any(): out[m] = np.bincount(out[ring]).argmax()
    ids = [c for c in range(1, nid + 1) if (out == c).any()]
    soft = np.stack([cv2.GaussianBlur(cv2.resize((out == c).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR), (0, 0), 14) for c in ids])
    full = np.where(obj_lab > 0, obj_lab, K + 1 + np.argmax(soft, 0)).astype(np.int32); del soft
    for _ in range(2):                                                   # 흐림으로 떨어져 나온 작은 부스러기는 가장 많이 닿은 이웃으로
        for c in range(K + 1, K + 1 + len(ids)):
            n, cc, st, _ = cv2.connectedComponentsWithStats((full == c).astype(np.uint8))
            if n <= 2: continue
            keep = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
            for j in range(1, n):
                if j == keep: continue
                m = cc == j; ring = cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool) & ~m
                full[m] = np.bincount(full[ring]).argmax()
    return full

def seam_mask(orig, sm):
    """이음매 붙이기 마스크(1 = 이어 그린 그림). 이음매 왼쪽·오른쪽 띠(SEAM_IN~SEAM_OUT)에서 두 그림의 색 차이가 가장 작은 세로 길(행마다 한 칸까지만 옆으로)을
    동적 계획법으로 찾아 그 안쪽만 이어 그린 그림을 쓴다. 직선으로 섞으면 어긋난 나무·집이 반투명하게 겹쳐 보이기 때문이다. 경계는 4px 만 부드럽게"""
    H, Wd = orig.shape[:2]; c = Wd // 2
    diff = cv2.GaussianBlur(np.abs(orig - sm).sum(2), (0, 0), 3)
    def path(x0, x1):
        cost = diff[:, x0:x1].copy(); n = x1 - x0; back = np.zeros((H, n), np.int8)
        for y in range(1, H):
            prev = cost[y - 1]; cand = np.stack([np.r_[np.inf, prev[:-1]], prev, np.r_[prev[1:], np.inf]])
            j = cand.argmin(0); back[y] = j - 1; cost[y] += cand[j, np.arange(n)]
        xs = np.zeros(H, int); xs[-1] = cost[-1].argmin()
        for y in range(H - 1, 0, -1): xs[y - 1] = xs[y] + back[y, xs[y]]
        return xs + x0
    L, R = path(c - SEAM_OUT, c - SEAM_IN), path(c + SEAM_IN, c + SEAM_OUT)
    xx = np.arange(Wd)[None, :]
    m = ((xx >= L[:, None]) & (xx <= R[:, None])).astype(np.float32)
    return cv2.GaussianBlur(m, (0, 0), 2)

def load_pano(board, k):
    p = os.path.join(RAW, f'pano_{board}_{k}.png')
    return Image.open(p).convert('RGB').resize((PW, PH), Image.LANCZOS) if os.path.exists(p) else None

def run(board, preview_dir, make_images=True):
    tales = ORDER[board]; n = len(tales); nb = (n + PER - 1) // PER
    panos = [load_pano(board, k) for k in range(1, nb + 1)] if make_images else [None] * nb
    rec = {'tales': tales, 'cols': n, 'pieces': {t: {'col': i, 'top': [], 'bot': []} for i, t in enumerate(tales)}}
    if not any(p is not None for p in panos): return rec
    W = n * S
    big = Image.new('RGB', (PW * nb, PH), (233, 223, 211))
    for k, p in enumerate(panos):
        if p is not None: big.paste(p, (k * PW, 0))
    big = np.asarray(big).astype(np.float32)
    for k in range(1, nb):                                               # 그림과 그림 사이 이음매: 이어 그린 그림(seam_<판>_<k>.png)의 가운데를 붙인다
        sp = os.path.join(RAW, f'seam_{board}_{k}.png')
        if not os.path.exists(sp) or panos[k - 1] is None or panos[k] is None: continue
        sm = np.asarray(Image.open(sp).convert('RGB').resize((PW, PH), Image.LANCZOS)).astype(np.float32)
        x0 = k * PW - PW // 2
        a = seam_mask(big[:, x0:x0 + PW], sm)[..., None]
        big[:, x0:x0 + PW] = big[:, x0:x0 + PW] * (1 - a) + sm * a
    big = np.clip(big, 0, 255).astype(np.uint8)[:, :W]
    avoid = np.zeros((PH // 4, W // 4 + 1), np.uint8); objs = []          # 물건 조각: 주인공(아래)을 판 전체에 먼저, 위 조각은 겹치지 않게
    for part in ('bot', 'top'):
        for i, tid in enumerate(tales):
            sh = SHAPES.get(tid)
            if not sh or part not in sh: continue
            poly, m = place(sh[part], i, part, avoid, n); avoid |= m; objs.append((i, part, poly))
    obj_lab = np.zeros((PH, W), np.int32)
    for j, (_, _, poly) in enumerate(objs): cv2.fillPoly(obj_lab, [np.round(np.array(poly)).astype(np.int32)], j + 1)
    lab = partition(obj_lab, board)
    for tid in tales:                                                    # 이 판 동화의 옛 조각 그림은 지운다(조각 수가 바뀔 수 있다)
        for f in glob.glob(os.path.join(UI, f'pz_{tid}_top*.webp')) + glob.glob(os.path.join(UI, f'pz_{tid}_bot*.webp')): os.remove(f)
    made = []
    for c in range(1, int(lab.max()) + 1):
        m = (lab == c).astype(np.uint8)
        if not m.any(): continue
        ys, xs = np.nonzero(m); bx, by, bx1, by1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
        if c <= len(objs): col, part, _ = objs[c - 1]; isobj = True
        else:
            col = min(n - 1, int(xs.mean() // S)); part = 'top' if ys.mean() < SPLIT else 'bot'; isobj = False
        tid = tales[col]; grp = rec['pieces'][tid][part]
        cs, _ = cv2.findContours(m[by:by1, bx:bx1].copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        poly = cv2.approxPolyDP(max(cs, key=cv2.contourArea), .8, True)[:, 0, :]
        path = 'M' + ' L'.join(f'{x} {y}' for x, y in poly) + 'Z'
        a = Image.fromarray(m[by:by1, bx:bx1] * 255).filter(ImageFilter.GaussianBlur(.6))
        im = Image.fromarray(big[by:by1, bx:bx1]).convert('RGBA'); im.putalpha(a)
        e = {'file': None, 'x': int(bx), 'y': int(by), 'w': int(bx1 - bx), 'h': int(by1 - by), 'path': path, 'obj': isobj}
        if isobj: grp.insert(0, e)
        else: grp.append(e)
        made.append((e, im, col, part))
    for tid in tales:
        for part in ('top', 'bot'):
            for k, e in enumerate(rec['pieces'][tid][part]):
                e['file'] = f'pz_{tid}_{part}_{k}.webp'
    for e, im, _, _ in made: im.save(os.path.join(UI, e['file']), 'WEBP', quality=90, alpha_quality=100, method=6)
    print(f'{board}: 물건 조각 {len(objs)} · 자투리 조각 {len(made) - len(objs)}')
    os.makedirs(preview_dir, exist_ok=True)
    def board_img(got):                                                  # 빈 자리(눌린 판) 위에 받은 조각을 끼운 모습
        cv = Image.new('RGBA', (W + 80, PH + 80), (245, 239, 233, 255))
        for e, im, c, part in made:
            a = im.getchannel('A')
            hole = Image.new('RGBA', im.size, (221, 208, 192, 255)); hole.putalpha(a)
            cv.alpha_composite(hole, (40 + e['x'], 40 + e['y']))
            inv = a.point(lambda v: 255 - v).filter(ImageFilter.GaussianBlur(4))
            sh = Image.new('L', im.size, 0); sh.paste(inv, (3, 5))
            sh = Image.fromarray((np.asarray(sh, float) * np.asarray(a, float) / 255 * .5).astype(np.uint8))
            cv.alpha_composite(Image.merge('RGBA', (*[Image.new('L', im.size, v) for v in (46, 36, 28)], sh)), (40 + e['x'], 40 + e['y']))
        for e, im, c, part in made:
            if (c, part) in got:
                shd = Image.new('RGBA', im.size, (46, 36, 28, 0)); shd.putalpha(im.getchannel('A').point(lambda v: int(v * .4)).filter(ImageFilter.GaussianBlur(2)))
                cv.alpha_composite(shd, (40 + e['x'] + 1, 40 + e['y'] + 2)); cv.alpha_composite(im, (40 + e['x'], 40 + e['y']))
        return cv.convert('RGB')
    allg = {(c, p) for _, _, c, p in made}
    for nm, got in (('', allg), ('_half', {(c, p) for c, p in allg if (c + (p == 'bot')) % 2 == 0}), ('_empty', set())):
        out = os.path.join(preview_dir, f'preview_{board}{nm}.png'); board_img(got).save(out); print('미리보기 ->', out)
    gap = 40                                                            # 조각을 조금씩 벌려 놓은 그림(조각 모양 확인용)
    cp = Image.new('RGBA', (W * 13 // 10 + 80, PH * 13 // 10 + 80), (245, 239, 233, 255))
    for e, im, _, _ in made:
        cx, cy = e['x'] + e['w'] / 2, e['y'] + e['h'] / 2
        cp.alpha_composite(im, (int(40 + cx * 1.3 - e['w'] / 2), int(40 + cy * 1.3 - e['h'] / 2)))
    out2 = os.path.join(preview_dir, f'preview_{board}_apart.png'); cp.convert('RGB').save(out2); print('조각 벌림 ->', out2)
    return rec

def seam_sources():
    """이음매 작업표(jobs_pzseam.json)의 참고 그림 seamsrc_<판>_<k>.png = 앞 그림 오른쪽 반 + 다음 그림 왼쪽 반"""
    for j in json.load(open(os.path.join(G, 'tools/app/gen/jobs_pzseam.json'))):
        _, b, k = j['id'].split('_', 2); k = int(k)
        A, B = load_pano(b, k), load_pano(b, k + 1)
        if A is None or B is None: continue
        c = Image.new('RGB', (PW, PH)); c.paste(A.crop((PW // 2, 0, PW, PH)), (0, 0)); c.paste(B.crop((0, 0, PW // 2, PH)), (PW // 2, 0))
        c.save(os.path.join(G, j['src'])); print('이음매 참고 ->', j['src'])

def main():
    args = sys.argv[1:]; prev = RAW
    if '--seamsrc' in args: return seam_sources()
    if '--preview' in args:
        i = args.index('--preview'); prev = os.path.abspath(args[i + 1]); del args[i:i + 2]
    boards = args or list(ORDER)
    lp = os.path.join(UI, 'puzzle_layout.json')
    old = json.load(open(lp)) if os.path.exists(lp) else {}
    out = {'cell': S, 'boards': {}}
    for b in ORDER:
        if b in boards: out['boards'][b] = run(b, prev)
        elif b in old.get('boards', {}) and isinstance(next(iter(old['boards'][b]['pieces'].values()), {}).get('top'), list): out['boards'][b] = old['boards'][b]
        else: out['boards'][b] = run(b, prev, make_images=False)
    json.dump(out, open(lp, 'w'), ensure_ascii=False, separators=(',', ':'))
    print('배치 정보 ->', lp)

if __name__ == '__main__':
    main()
