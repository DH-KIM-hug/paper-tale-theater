#!/usr/bin/env python3
"""반대 모습 주인공 그림(G2, tools/app/gen/jobs_look_<tale>.json) 후처리 → assets/v3w/<id>.webp  (G3, docs/NAME_SETUP_V2_PLAN.md §3-6)
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_look.py [tale ...] [--force]
원본과 같은 공정을 그대로 쓴다:
- 자세(sprite): tools/gpu_night/chromakey.py(마젠타, pad 6) → 높이 600 안(넓으면 폭 900) — post_tale.py 와 같다.
  구름 공장(kkultteok) 자세는 원본 cf4_* 처럼 높이 700 안(폭 1050). 원본과 실루엣이 좌우 반대면 뒤집는다(restyle.py post 와 같은 판정).
  rc_childg_bed 는 post_red_car_bed.py 와 같게 마젠타만 지우고 틀 그대로 800×1200.
- 사탕 마녀 변신 컷(wc_cutb_tf_*, 마젠타 큰 인물): 크로마키 → 높이 900 안(폭 1200) — 원본 wc_cut_tf_* 와 같은 모양(RGBA).
- 4:3 컷(kind cut, 1600×1200 작업): post_cuts.py 와 같게 가운데 4:3 → 1200×900.
- 16:9 컷·장면(cf4_cut_*_bg, *_bed*_wide, cf4_bed_wide_bg): 가운데 16:9 → 1600×900, 세로 장면(*_tall): 2:3 → 1024×1536 — post_bed.py 와 같다.
이미 변환한 것(webp 가 원본보다 새것)은 --force 없으면 건너뛴다. 끝에 자세 비율을 tales/<tale>/ASP_look.txt 에 쓴다."""
import json, os, sys, subprocess
import numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))); from rawpath import raw_path  # noqa: E402
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
V3W = os.path.join(G, 'assets', 'v3w')
args = [a for a in sys.argv[1:] if not a.startswith('--')]; FORCE = '--force' in sys.argv
TALES = args or ['unicorn', 'witch_candy', 'red_car', 'kkultteok']
CK = os.path.join(G, 'tools/gpu_night/chromakey.py')
GLOW_FIX = {'wc_cutb_tf_pumpkin'}


def crop_ratio(im, r):
    if im.width / im.height > r: nw = round(im.height * r); return im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
    nh = round(im.width / r); return im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))


def mask(x):
    a = x.convert('RGBA').getchannel('A'); bb = a.getbbox() or (0, 0, 1, 1); return np.asarray(a.crop(bb).resize((96, 96))) > 128


def flip_check(im, old):
    """restyle.py post 와 같은 판정: 옛 그림과 실루엣이 좌우 반대면 뒤집는다"""
    if not old or not os.path.exists(old): return im, False
    mo, mn = mask(Image.open(old)), mask(im)
    s0, s1 = (mo == mn).mean(), (mo == mn[:, ::-1]).mean()
    return (im.transpose(Image.FLIP_LEFT_RIGHT), True) if s1 > s0 + .03 else (im, False)


def bed_frame(src, dst, size):
    """post_red_car_bed.py 와 같은 마젠타 제거(틀은 그대로, 오리지 않음)"""
    im0 = Image.open(src).convert('RGB')
    a = np.asarray(im0).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    hsv = np.asarray(im0.convert('HSV')).astype(float)
    hue, sat, val = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2]
    core = (hue > 283) & (hue < 338) & (sat > .55) & (val > 40)
    lab, n = ndimage.label(core)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(edge))
    near = ndimage.binary_dilation(bg, iterations=2) & ~bg & (hue > 270) & (hue < 345) & (sat > .3)
    alpha = np.full(sat.shape, 255.0); alpha[bg] = 0; alpha[near] = np.clip((.55 - sat[near]) * 255 / .25, 0, 255)
    sp = near | (ndimage.binary_dilation(bg, iterations=1) & ~bg)
    out = a.copy()
    out[..., 0] = np.where(sp & (r > g + 30), np.minimum(r, g + 30), r)
    out[..., 2] = np.where(sp & (b > g + 30), np.minimum(b, g + 30), b)
    Image.fromarray(np.dstack([out, alpha]).astype(np.uint8), 'RGBA').resize(size, Image.LANCZOS).save(dst, quality=88, method=6)


for tale in TALES:
    jobs = json.load(open(os.path.join(G, f'tools/app/gen/jobs_look_{tale}.json')))
    tmp = os.path.join(G, 'assets', 'raw', 'restyle', 'look_' + tale + '_key'); os.makedirs(tmp, exist_ok=True)
    asp = []
    for j in jobs:
        jid = j['id']; src = raw_path(os.path.join(G, j['out']))
        name = ('cf4_' + jid) if tale == 'kkultteok' and not jid.startswith('cf4_') else jid
        dst = os.path.join(V3W, name + '.webp')
        o = j.get('src') or ''
        o = ('cf4_' + o) if tale == 'kkultteok' and o and not o.startswith('cf4_') else o
        old = os.path.join(V3W, o + '.webp') if o and os.path.exists(os.path.join(V3W, o + '.webp')) else ''
        if not os.path.exists(src): print('없음', jid); continue
        if not FORCE and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            if j['kind'] == 'sprite': asp.append((name, Image.open(dst).size))
            continue
        note = ''
        if j['kind'] == 'sprite' and jid == 'rc_childg_bed':
            bed_frame(src, dst, (800, 1200)); note = '틀 그대로 800x1200'
        elif j['kind'] == 'sprite' or (j['kind'] == 'cut' and jid.startswith('wc_cutb_tf_')):
            k = os.path.join(tmp, jid + '.png')
            subprocess.run([sys.executable, CK, src, k, '6'], check=True, capture_output=True)
            im = Image.open(k).convert('RGBA')
            if jid in GLOW_FIX:   # 마젠타 위에 그린 분홍 빛 번짐(생성 그림의 후광)이 크로마키에 남는 그림: 밝은 분홍빛(빨강 높고 파랑>초록)만 지운다
                a = np.asarray(im).astype(int); r, g_, b = a[..., 0], a[..., 1], a[..., 2]
                al = a[..., 3].astype(float); pink = (r > 190) & (b - g_ > 10)
                al = np.where(pink & (b - g_ > 25), 0, np.where(pink, al * .4, al))
                im = Image.fromarray(np.dstack([a[..., :3], al]).astype(np.uint8), 'RGBA'); bb = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
                if bb: im = im.crop((max(0, bb[0] - 6), max(0, bb[1] - 6), min(im.width, bb[2] + 6), min(im.height, bb[3] + 6)))
                note = 'glow-fix'
            if j['kind'] == 'sprite' and '_lie' not in jid:
                im, fl = flip_check(im, old); note = 'flip' if fl else ''
            bw, bh = (1200, 900) if j['kind'] == 'cut' else ((1050, 700) if tale == 'kkultteok' else (900, 600))
            s = min(bw / im.width, bh / im.height)
            im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
            im.save(dst, quality=88, method=6)
        else:
            im = Image.open(src).convert('RGB')
            wide = jid.endswith('_wide') or jid.endswith('_wide_bg') or jid.startswith('cf4_cut_')
            tall = jid.endswith('_tall') or jid.endswith('_tall_bg')
            if tall: crop_ratio(im, 2 / 3).resize((1024, 1536), Image.LANCZOS).save(dst, quality=86, method=6)
            elif wide: crop_ratio(im, 16 / 9).resize((1600, 900), Image.LANCZOS).save(dst, quality=86, method=6)
            else: crop_ratio(im, 4 / 3).resize((1200, 900), Image.LANCZOS).save(dst, quality=88, method=6)
        sz = Image.open(dst).size
        if j['kind'] == 'sprite': asp.append((name, sz))
        print('ok', name, sz, note, flush=True)
    if asp:
        open(os.path.join(G, 'tales', tale, 'ASP_look.txt'), 'w').write(''.join(f'{n}: {round(w / h, 4)}\n' for n, (w, h) in asp))
