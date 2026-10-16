#!/usr/bin/env python3
"""터널북 시작 화면 키아트 합성기.
사용: compose_keyart.py keyart/patjuk.json [--out DIR] [--no-install]
설정 JSON: tale, planes{sky,far,ground}, layouts{wide,tall}. 면 이미지는 GPU 산출물(재생성 없음),
인물은 게임 스프라이트. 결과: assets/thumbs/<tale>_key_wide.webp, <tale>_key_tall.webp (+ --out 에 PNG).
"""
import os, sys, json, argparse
import numpy as np
from PIL import Image, ImageFilter, ImageChops

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SHC = (70, 34, 20)

def ld(p): return Image.open(os.path.join(ROOT, p)).convert('RGBA')
def fit_w(im, w): return im.resize((max(1, int(w)), max(1, int(im.height * w / im.width))), Image.LANCZOS)
def fit_h(im, h): return im.resize((max(1, int(im.width * h / im.height)), max(1, int(h))), Image.LANCZOS)
def despill(im):
    """마젠타 키 잔여색(분홍 테두리)을 회색으로"""
    a = np.asarray(im).astype(np.int16); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = ((r - g) > 28) & ((b - g) > 18) & (b > 90)
    a[..., 0][m] = g[m]; a[..., 2][m] = g[m]
    return Image.fromarray(a.astype(np.uint8), 'RGBA')

def bbox_crop(im):
    b = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    return im.crop(b) if b else im

def grain(size, amp=7, seed=1):
    rng = np.random.default_rng(int(seed)); w, h = size
    n = rng.normal(0, 1, (h, w)).astype(np.float32)
    n = np.asarray(Image.fromarray(((n * 40) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.7))).astype(np.float32) - 128
    f = rng.normal(0, 1, (h // 8 + 1, w)).astype(np.float32)
    f = np.asarray(Image.fromarray(((f * 40) + 128).clip(0, 255).astype(np.uint8)).resize((w, h + 8), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.2)))[:h].astype(np.float32) - 128
    return (n * .35 + f * .45) * amp / 40.0

def apply_grain(im, amp=7, seed=1):
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    g = grain(im.size, amp, seed)[..., None]
    return Image.fromarray((a + g * 2).clip(0, 255).astype(np.uint8)).convert('RGBA')

def paste_clip(c, im, xy):
    x, y = xy; W, H = c.size
    sx = max(0, -x); sy = max(0, -y); ex = min(im.width, W - x); ey = min(im.height, H - y)
    if ex > sx and ey > sy: c.alpha_composite(im.crop((sx, sy, ex, ey)), (x + sx, y + sy))

def drop(canvas, sprite, xy, off=(4, 8), blur=5, op=.5, thick=0):
    """스프라이트/면을 캔버스에 놓고 뒤 면에 부드러운 평행 그림자를 떨어뜨림"""
    x, y = int(xy[0]), int(xy[1]); a = sprite.getchannel('A')
    pad = int(blur * 3 + max(abs(off[0]), abs(off[1])) + thick + 4)
    lay = Image.new('RGBA', (sprite.width + 2 * pad, sprite.height + 2 * pad), (0, 0, 0, 0))
    am = Image.new('L', lay.size, 0); am.paste(a, (pad, pad))
    sh = ImageChops.offset(am, off[0], off[1]).filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * op))
    ct = ImageChops.offset(am, max(1, off[0] // 3), max(1, off[1] // 3)).filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: int(v * op * .7))
    sh = ImageChops.lighter(sh, ct)
    lay.paste(Image.new('RGBA', lay.size, SHC + (255,)), (0, 0), sh)
    if thick:
        dk = Image.eval(sprite.convert('RGB'), lambda v: int(v * .72)).convert('RGBA'); dk.putalpha(a)
        for t in range(thick, 0, -1): lay.alpha_composite(dk, (pad + int(t * .5), pad + t))
    lay.alpha_composite(sprite, (pad, pad))
    paste_clip(canvas, lay, (x - pad, y - pad))

def extend_down(im, h):
    if im.height >= h: return im
    row = np.asarray(im.convert('RGB').crop((0, im.height - 6, im.width, im.height))).reshape(-1, 3)
    c = tuple(int(v) for v in np.median(row, axis=0))
    out = Image.new('RGBA', (im.width, h), (0, 0, 0, 0)); out.alpha_composite(im, (0, 0))
    out.alpha_composite(apply_grain(Image.new('RGBA', (im.width, h - im.height), c + (255,)), 5, 9), (0, im.height)); return out

def sprite_img(s, W, H):
    im = bbox_crop(ld(s['file']))
    if s.get('flip'): im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return fit_h(im, H * s['h']) if 'h' in s else fit_w(im, W * s['w'])

def band(cv, frac, strength):
    w, h = cv.size; b0 = int(h * (1 - frac)); y0 = b0 - h * .10
    t = np.clip((np.arange(h) - y0) / (h - y0), 0, 1) ** 1.2 * strength
    a = np.repeat(t[:, None], w, 1)
    ov = Image.new('RGBA', (w, h), (40, 18, 16, 255)); ov.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
    out = cv.copy(); out.alpha_composite(ov); return out

def edge_light(im, px=2, mix=.55):
    """면 가장자리 안쪽 px 두께를 밝은 종이색으로 (잘린 종이 단면)"""
    a = im.getchannel('A'); er = a.filter(ImageFilter.MinFilter(2 * px + 1))
    ring = ImageChops.subtract(a, er).point(lambda v: 255 if v > 40 else 0)
    cr = Image.new('RGBA', im.size, (255, 243, 220, 255))
    lit = Image.blend(im, cr, mix); lit.putalpha(a)
    out = im.copy(); out.paste(lit, (0, 0), ring); return out

def sheet_drop(cv, im, xy, shadow):
    drop(cv, edge_light(im), xy, *shadow)

def maple(size, col, rot=0, seed=1):
    import math, random
    rng = random.Random(seed); S = int(size); c = S / 2
    pts = []
    tips = 5
    for k in range(tips):
        ang = math.radians(-90 + k * 72 + rng.uniform(-6, 6)); rr = 1.0 if k != 0 else 1.0
        if k in (1, 4): rr = .88
        if k in (2, 3): rr = .72
        for da, rv in ((-24, .46), (-9, .70 * rr), (0, rr), (9, .70 * rr)):
            a2 = ang + math.radians(da); pts.append((c + math.cos(a2) * rv * c * .95, c + math.sin(a2) * rv * c * .95))
        a3 = ang + math.radians(36); pts.append((c + math.cos(a3) * .40 * c, c + math.sin(a3) * .40 * c))
    m = Image.new('L', (S * 2, S * 2), 0); from PIL import ImageDraw
    d = ImageDraw.Draw(m); d.polygon([(x * 2, y * 2) for x, y in pts], fill=255)
    d.line([(c * 2, c * 2), (c * 2, (c + c * .98) * 2)], fill=255, width=max(6, S // 22))
    m = m.resize((S, S), Image.LANCZOS)
    im = Image.new('RGBA', (S, S), tuple(col) + (255,)); im.putalpha(m)
    vein = Image.new('L', (S * 2, S * 2), 0); vd = ImageDraw.Draw(vein)
    for k in range(tips):
        ang = math.radians(-90 + k * 72); vd.line([(c * 2, c * 2), (c * 2 + math.cos(ang) * c * 1.3, c * 2 + math.sin(ang) * c * 1.3)], fill=255, width=3)
    vein = vein.resize((S, S), Image.LANCZOS).point(lambda v: int(v * .30))
    dk = Image.new('RGBA', (S, S), (60, 20, 10, 255)); dk.putalpha(ImageChops.multiply(vein, m))
    im.alpha_composite(dk)
    im = apply_grain(im, 5, seed); im.putalpha(m)
    return im.rotate(rot, resample=Image.BICUBIC, expand=True)

def blade(h, w, col, rot=0, seed=1):
    from PIL import ImageDraw
    m = Image.new('L', (w * 2, h * 2), 0)
    ImageDraw.Draw(m).polygon([(0, h * 2), (w * 2, h * 2), (w * 1.35, h * .45), (w * .8, 0)], fill=255)
    m = m.resize((w, h), Image.LANCZOS)
    im = Image.new('RGBA', (w, h), tuple(col) + (255,)); im.putalpha(m)
    im = apply_grain(im, 5, seed); im.putalpha(m)
    return im.rotate(rot, resample=Image.BICUBIC, expand=True)

def place_leaf(cv, L, W, H, shadow=((6, 11), 8, .42)):
    sz = H * L['s']
    im = maple(sz, L['col'], L.get('rot', 0), L.get('seed', 1)) if L.get('kind', 'maple') == 'maple' else blade(int(sz), int(sz * L.get('aspect', .28)), L['col'], L.get('rot', 0), L.get('seed', 1))
    drop(cv, edge_light(im, 1, .35), (W * L['x'] - im.width / 2, H * L['y'] - im.height / 2), *shadow)

def torn_poly(W, H, box, n, seed, rough, extra=0):
    rng = np.random.default_rng(seed)
    x0, y0, x1, y1 = [box[0] * W, box[1] * H, box[2] * W, box[3] * H]
    cx, cy, a, b = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2
    N = 1800; t = np.linspace(0, 2 * np.pi, N, endpoint=False)
    co, si = np.cos(t), np.sin(t)
    px = np.sign(co) * np.abs(co) ** (2 / n); py = np.sign(si) * np.abs(si) ** (2 / n)
    coarse = sum(rng.uniform(.4, 1) * np.sin(k * t + rng.uniform(0, 6.28)) / k for k in range(2, 9)) * rough
    walk = np.cumsum(rng.normal(0, 1, N)); walk -= np.linspace(walk[0], walk[-1], N); 
    k = np.ones(25) / 25; walk = np.convolve(np.r_[walk[-24:], walk, walk[:24]], k, 'same')[24:-24]
    fine = rng.normal(0, 1, N); fine = np.convolve(np.r_[fine[-4:], fine, fine[:4]], np.ones(5) / 5, 'same')[4:-4]
    jit = coarse * min(a, b) * .035 + walk / max(1, np.abs(walk).max()) * 10 + fine * 2.4 + extra
    ex = px * a + co * jit; ey = py * b + si * jit
    return [(cx + ex[i], cy + ey[i]) for i in range(N)]

def front_sheet(cv, F, W, H):
    from PIL import ImageDraw
    sheetc = solid_rgba((W, H), tuple(F['color']), 7)
    hole = Image.new('L', (W * 2, H * 2), 0)
    ImageDraw.Draw(hole).polygon([(x * 2, y * 2) for x, y in torn_poly(W, H, F['hole'], F.get('n', 4), F.get('seed', 5), F.get('rough', 1.0))], fill=255)
    hole = hole.resize((W, H), Image.LANCZOS)
    rim = Image.new('L', (W * 2, H * 2), 0)
    ImageDraw.Draw(rim).polygon([(x * 2, y * 2) for x, y in torn_poly(W, H, F['hole'], F.get('n', 4), F.get('seed', 5), F.get('rough', 1.0), extra=5.5)], fill=255)
    rim = rim.resize((W, H), Image.LANCZOS)
    alpha = ImageChops.invert(rim)
    front = sheetc.copy(); front.putalpha(alpha)
    # 찢긴 종이 속살(연한 띠): 구멍 가장자리 바깥 3~6px
    core = Image.new('RGBA', (W, H), (246, 226, 188, 255)); ring = ImageChops.subtract(rim, hole)
    am = ImageChops.invert(hole)
    # 장면 위로 앞 종이가 드리우는 그림자
    sh = ImageChops.offset(am, 9, 16).filter(ImageFilter.GaussianBlur(15)).point(lambda v: int(v * .45))
    cv.paste(Image.new('RGBA', (W, H), SHC + (255,)), (0, 0), sh)
    ct = ImageChops.offset(am, 2, 4).filter(ImageFilter.GaussianBlur(1.6)).point(lambda v: int(v * .45))
    cv.paste(Image.new('RGBA', (W, H), SHC + (255,)), (0, 0), ct)
    cv.paste(core, (0, 0), ring)
    cv.alpha_composite(front)
    return cv

def solid_rgba(size, col, seed): return apply_grain(Image.new('RGBA', size, tuple(col) + (255,)), 6, seed)

def sky_tint(im, top, bot):
    a = np.asarray(im.convert('RGB')).astype(np.float32); h = a.shape[0]
    t = np.linspace(0, 1, h)[:, None, None] ** .85
    g = (np.array(top, np.float32) * (1 - t) + np.array(bot, np.float32) * t) / 255.0
    return Image.fromarray((a * g).clip(0, 255).astype(np.uint8)).convert('RGBA')

def strip_plane(cv, S, W, H):
    from PIL import ImageDraw
    rng = np.random.default_rng(S.get('seed', 3)); xs = np.arange(W + 1)
    y = H * S['y'] + sum(rng.uniform(.5, 1) * 14 * np.sin(xs / W * 6.28 * f + rng.uniform(0, 6.28)) for f in (.8, 1.7, 3.1))
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([(0, H)] + [(int(x), float(y[x])) for x in xs] + [(W, H)], fill=255)
    im = solid_rgba((W, H), S['color'], 11); im.putalpha(m)
    sheet_drop(cv, im, (0, 0), ((6, 14), 13, .42))

def compose(cfg, kind):
    L = cfg['layouts'][kind]; W, H = L['size']; P = cfg['planes']
    sky = ld(P['sky']); m = 22; sky = sky.crop((m, m, sky.width - m, sky.height - m))
    sc = max(W / sky.width, H / sky.height); s2 = sky.resize((int(sky.width * sc) + 1, int(sky.height * sc) + 1), Image.LANCZOS)
    ox = int((s2.width - W) * L['sky_x']); oy = int((s2.height - H) * L.get('sky_y', 0))
    cv = s2.crop((ox, oy, ox + W, oy + H)).convert('RGBA')
    if 'sky_tint' in cfg: cv = sky_tint(cv, *cfg['sky_tint'])
    PS = ((8, 15), 14, .42)
    def sheet(name, spec):
        im = despill(bbox_crop(ld(P[name]))); im = im.crop((8, 0, im.width - 8, im.height - 44)); im = fit_w(im, W * spec['w'])
        im = extend_down(im, int(H - H * spec['y']) + 12)
        x = -int((im.width - W) * spec['x']); sheet_drop(cv, im, (x, int(H * spec['y'])), PS)
    sheet('far', L['far'])
    for s in L.get('behind', []):
        im = sprite_img(s, W, H); drop(cv, im, (W * s['x'] - im.width / 2, H * s['foot'] - im.height), (5, 10), 8, .4, 1)
    sheet('ground', L['ground'])
    for s in L['sprites']:
        im = sprite_img(s, W, H); drop(cv, im, (W * s['x'] - im.width / 2, H * s['foot'] - im.height), (6, 12), 9, .42, 1)
    if 'strip' in L:
        strip_plane(cv, L['strip'], W, H)
        for lf in L['strip'].get('leaves', []): place_leaf(cv, lf, W, H)
    if 'fg' in L:   # GPU 전경 조각(큰 단풍잎·풀잎), 키 완료 PNG
        F = L['fg']; im = bbox_crop(despill(ld(P['fg']))); im = fit_w(im, W * F['w'])
        drop(cv, edge_light(im, 1, .3), (W * F['x'] - im.width / 2, H * F['bottom'] - im.height), (8, 15), 11, .45)
    if 'frame' in L:   # GPU 앞판(찢은 종이 창), 키 완료 PNG
        F = L['frame']; im = despill(ld(F['file'])); ins = F.get('inset', 40)
        im = im.crop((ins, ins, im.width - ins, im.height - ins)); sc = max(W / im.width, H / im.height) * F.get('scale', 1.2)
        im = im.resize((int(im.width * sc), int(im.height * sc)), Image.LANCZOS)
        x = int((W - im.width) * F.get('x', .5)); y = int((H - im.height) * F.get('y', .5))
        am = Image.new('L', (W, H), 0); am.paste(im.getchannel('A'), (x, y))
        sh = ImageChops.offset(am, 9, 16).filter(ImageFilter.GaussianBlur(15)).point(lambda v: int(v * .45))
        cv.paste(Image.new('RGBA', (W, H), SHC + (255,)), (0, 0), sh)
        paste_clip(cv, im, (x, y))
    if 'front' in L:
        front_sheet(cv, L['front'], W, H)
        for lf in L['front'].get('leaves', []): place_leaf(cv, lf, W, H)
    for lf in L.get('fg_leaves', []): place_leaf(cv, lf, W, H, ((8, 15), 11, .45))
    cv = apply_grain(cv, 6, 4)
    return band(cv, L['band'], L.get('band_strength', .45))


# ---------- 화환 방식 (mode: wreath): 질감 있는 앞 종이 + 둥근 구멍 + GPU 화환 + 안쪽 장면 + 스프라이트 ----------
def linen(size, col, seed=1, weave=3.2):
    """린넨 결 카드스톡: 가로세로 가는 실결 + 낮은 주파수 얼룩 + 잔 알갱이"""
    W, H = size; rng = np.random.default_rng(seed)
    rows = rng.normal(0, 1, H).astype(np.float32); cols = rng.normal(0, 1, W).astype(np.float32)
    k = np.ones(2) / 2; rows = np.convolve(rows, k, 'same'); cols = np.convolve(cols, k, 'same')
    lo = rng.normal(0, 1, (H // 24 + 2, W // 24 + 2)).astype(np.float32)
    lo = np.asarray(Image.fromarray(((lo * 40) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)).astype(np.float32) - 128
    fine = rng.normal(0, 1, (H, W)).astype(np.float32)
    n = rows[:, None] * weave + cols[None, :] * weave + lo * .012 + fine * 1.4
    a = np.array(col, np.float32)[None, None, :] + n[..., None]
    return Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert('RGBA')

def wreath_hole(alpha, W, H, shrink=9):
    """화환 윤곽(가운데 채움)에서 앞 종이의 구멍 마스크를 만든다: 화환 가장자리가 구멍 밑에 살짝 들어가도록 안쪽으로 줄임"""
    from PIL import ImageDraw
    q = 4; sm = alpha.resize((W // q, H // q), Image.BILINEAR).point(lambda v: 255 if v > 60 else 0)
    sm = sm.filter(ImageFilter.MaxFilter(9))
    fl = sm.copy(); ImageDraw.floodfill(fl, (0, 0), 128)
    sil = fl.point(lambda v: 255 if v != 128 else 0)
    sil = sil.filter(ImageFilter.MinFilter(shrink)).filter(ImageFilter.GaussianBlur(2.2)).point(lambda v: 255 if v > 128 else 0)
    return sil.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(4)).point(lambda v: 255 if v > 128 else int(v * 2)).filter(ImageFilter.GaussianBlur(1))

def compose_wreath(cfg, kind, variant):
    global SHC
    SHC = tuple(cfg.get('shadow_color', [52, 58, 82]))   # 살짝 푸르스름한 회색 그림자 (검정 아님)
    L = cfg['layouts'][kind]; W, H = L['size']; P = cfg['planes']
    off = (max(2, round(.008 * W)), max(3, round(.011 * W))); blur = round(1.4 * off[1]); op = .38   # 왼위 빛: 오른아래로 W의 1~1.5%
    ins = ld(P['inside_' + kind]); sc = max(W / ins.width, H / ins.height)
    ins = ins.resize((int(ins.width * sc) + 1, int(ins.height * sc) + 1), Image.LANCZOS)
    ix = int((ins.width - W) * L.get('inside_x', .5)); iy = int((ins.height - H) * L.get('inside_y', .5))
    cv = ins.crop((ix, iy, ix + W, iy + H)).convert('RGBA')
    for s in L['sprites']:
        im = sprite_img(s, W, H); drop(cv, im, (W * s['x'] - im.width / 2, H * s['foot'] - im.height), off, blur, op, 1)
    wr = despill(ld(P['wreath_' + kind]))
    sc = max(W / wr.width, H / wr.height) * L.get('wreath_scale', 1.0)
    wr = wr.resize((int(wr.width * sc), int(wr.height * sc)), Image.LANCZOS)
    wx = int((W - wr.width) * L.get('wreath_x', .5)); wy = int((H - wr.height) * L.get('wreath_y', .5))
    wcan = Image.new('RGBA', (W, H), (0, 0, 0, 0)); paste_clip(wcan, wr, (wx, wy))
    am = wcan.getchannel('A')
    def shadow_of(alpha, o, bl, opa):
        sh = ImageChops.offset(alpha, o[0], o[1]).filter(ImageFilter.GaussianBlur(bl)).point(lambda v: int(v * opa))
        return sh
    cv.paste(Image.new('RGBA', (W, H), SHC + (255,)), (0, 0), shadow_of(am, off, blur, op))
    cv.alpha_composite(edge_light(wcan, 1, .25))
    hole = wreath_hole(am, W, H, L.get('hole_shrink', 9))
    wt = cfg.get('weave', {}).get(variant, 3.2)
    sheet = linen((W, H), cfg['sheets'][variant], 7, wt); sheet.putalpha(ImageChops.invert(hole))
    sh_a = sheet.getchannel('A')
    # 구멍이 안쪽 장면에 드리우는 그림자: 왼위 안쪽에 어두운 초승달, 오른아래로 옅어짐 (구멍 가장자리 따라 폭 W의 약 10%)
    d = int(.065 * W)
    inner = shadow_of(sh_a, (d, int(d * .95)), int(.035 * W), .62)
    inner = ImageChops.lighter(inner, shadow_of(sh_a, (max(3, d // 7), max(4, d // 6)), max(4, d // 12), .55))
    cv.paste(Image.new('RGBA', (W, H), SHC + (255,)), (0, 0), inner)
    cv.alpha_composite(edge_light(sheet, 2, .30))
    # 화환이 구멍 가장자리 위로 넘쳐 앞 종이 위에 놓이는 부분(아래쪽)
    sp = L.get('spill_from_y')
    if sp is not None:
        mk = Image.new('L', (W, H), 0); mk.paste(255, (0, int(H * sp), W, H))
        spill = wcan.copy(); spill.putalpha(ImageChops.multiply(wcan.getchannel('A'), ImageChops.multiply(mk, ImageChops.invert(hole.filter(ImageFilter.GaussianBlur(0))).point(lambda v: 255))))
        # 구멍 안쪽(이미 그려진 부분)과 겹쳐도 같은 그림이라 문제 없다. 앞 종이 위 그림자 추가
        cv.paste(Image.new('RGBA', (W, H), SHC + (255,)), (0, 0), ImageChops.multiply(shadow_of(spill.getchannel('A'), off, blur, op), ImageChops.invert(hole)))
        cv.alpha_composite(spill)
    cv = apply_grain(cv, 4, 4)
    return band(cv, L['band'], L.get('band_strength', .5)) if L.get('band') else cv


# ---------- 판 방식 (mode: plate): 사용자가 만든 한 장짜리 GPT 판 + 게임 스프라이트 합성 ----------
def paper_color(plate):
    a = np.asarray(plate.convert('RGB').crop((0, 0, plate.width, 18))).reshape(-1, 3)
    return tuple(int(v) for v in np.median(a, axis=0))

def compose_plate(cfg, kind):
    global SHC
    SHC = tuple(cfg.get('shadow_color', [52, 58, 82]))        # 푸르스름한 회색 (검정 아님), 왼위 빛
    L = cfg['layouts'][kind]; W, H = L['size']
    plate = Image.open(os.path.join(ROOT, cfg['plate'][kind] if isinstance(cfg['plate'], dict) else cfg['plate'])).convert('RGBA')
    paper = paper_color(plate); cfg['_paper'] = paper
    pl = L['plate']
    pw = int(W * pl['w']) if 'w' in pl else int(plate.width * H * pl['h'] / plate.height)
    ph = int(plate.height * pw / plate.width); plate = plate.resize((pw, ph), Image.LANCZOS)
    # 가장자리를 종이색으로 풀어 바깥 종이와 이음매 없이
    fade = int(pw * .04); m = np.ones((ph, pw), np.float32)
    ramp = np.clip(np.arange(pw) / fade, 0, 1); ramp = np.minimum(ramp, ramp[::-1]); m *= ramp[None, :]
    rampy = np.clip(np.arange(ph) / fade, 0, 1); rampy = np.minimum(rampy, rampy[::-1]); m *= rampy[:, None]
    plate.putalpha(Image.fromarray((m * 255).astype(np.uint8)))
    cv = linen((W, H), paper, 5, .7)
    x0 = int((W - pw) * pl.get('x', .5)); y0 = int(pl.get('y', 0) * H)
    cv.alpha_composite(plate, (x0, y0)) if x0 >= 0 and y0 >= 0 else paste_clip(cv, plate, (x0, y0))
    off = (max(2, round(.011 * pw)), max(3, round(.015 * pw))); blur = round(1.5 * off[1])
    for s in L['sprites']:
        im = sprite_img(dict(s, **({'h': s['h'] * ph / H} if 'h' in s else {}), **({'w': s['w'] * pw / W} if 'w' in s else {})), W, H)
        cx = x0 + pw * s['x']; fy = y0 + ph * s['foot']
        drop(cv, im, (cx - im.width / 2, fy - im.height), off, blur, .40, 1)
    return apply_grain(cv, 1.5, 4)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('config'); ap.add_argument('--out'); ap.add_argument('--no-install', action='store_true')
    a = ap.parse_args(); cfg = json.load(open(a.config))
    for kind in ('wide', 'tall'):
        if cfg.get('mode') == 'plate':
            im = compose_plate(cfg, kind).convert('RGB')
            if a.out: os.makedirs(a.out, exist_ok=True); im.save(os.path.join(a.out, '%s_key_%s.png' % (cfg['tale'], kind)))
            if not a.no_install: im.save(os.path.join(ROOT, 'assets/thumbs/%s_key_%s.webp' % (cfg['tale'], kind)), quality=90, method=6)
            print(kind, im.size, 'paper', '#%02x%02x%02x' % cfg['_paper']); continue
        if cfg.get('mode') == 'wreath':
            for v in cfg['sheets']:
                im = compose_wreath(cfg, kind, v).convert('RGB')
                if a.out: os.makedirs(a.out, exist_ok=True); im.save(os.path.join(a.out, '%s_key_%s_%s.png' % (cfg['tale'], kind, v)))
                if not a.no_install and v == cfg.get('install', next(iter(cfg['sheets']))): im.save(os.path.join(ROOT, 'assets/thumbs/%s_key_%s.webp' % (cfg['tale'], kind)), quality=90, method=6)
            print(kind, 'wreath variants', list(cfg['sheets'])); continue
        im = compose(cfg, kind).convert('RGB')
        if a.out: os.makedirs(a.out, exist_ok=True); im.save(os.path.join(a.out, '%s_key_%s.png' % (cfg['tale'], kind)))
        if not a.no_install: im.save(os.path.join(ROOT, 'assets/thumbs/%s_key_%s.webp' % (cfg['tale'], kind)), quality=90, method=6)
        print(kind, im.size)

if __name__ == '__main__': main()
