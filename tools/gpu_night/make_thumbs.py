"""GPU 썸네일을 홈 카드용으로 다듬는다.
- 새 방식(thumb2_<id>.png = 남색 종이, thumb2L_<id>.png = 밝은 종이):
  종이에 뚫린 구멍 둘레로 정사각형으로 자르고(구멍이 가운데, 둘레 여백 18%),
  종이 부분의 색을 홈 화면 종이색(#222B45 / #ECEFF4)으로 맞춘다 → assets/thumbs/<id>.webp, <id>_light.webp
- 예전 방식(thumb_<id>.png, 크림 여백): 새 방식이 없는 동화만 → <id>.webp
목록은 assets/thumbs/thumbs.js 에 THUMBS(예전) / THUMBS2(새, 어두운) / THUMBS2L(새, 밝은)로 적는다."""
import glob, os, json
import numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = os.path.join(ROOT, 'assets', 'raw', 'v3')
OUT = os.path.join(ROOT, 'assets', 'thumbs'); os.makedirs(OUT, exist_ok=True)
SHEET = {'dark': np.array([0x22, 0x2B, 0x45]), 'light': np.array([0xEC, 0xEF, 0xF4])}

def edge_color(a):
    return np.median(np.concatenate([a[:10].reshape(-1, 3), a[-10:].reshape(-1, 3), a[:, :10].reshape(-1, 3), a[:, -10:].reshape(-1, 3)]), axis=0)

def square_around(a, mask, margin):
    ys, xs = np.where(mask); h, w = mask.shape
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    half = max(x1 - x0, y1 - y0) / 2 * margin
    half = min(half, cx, cy, w - cx, h - cy)
    return int(cx - half), int(cy - half), int(cx + half), int(cy + half)

def new_style(src, dst, target):
    a = np.asarray(Image.open(src).convert('RGB')).astype(float)
    bg = edge_color(a)
    dist = np.abs(a - bg).sum(axis=2)
    box = square_around(a, dist > 45, 1.18)
    # 종이 부분만 목표 색으로: 종이색에 가까울수록 많이 옮긴다 (그림자 명암은 유지)
    wgt = np.clip(1 - (dist - 25) / 35, 0, 1)[..., None]
    a = a + wgt * (target - bg)
    im = Image.fromarray(np.clip(a, 0, 255).astype('uint8')).crop(box)
    im.resize((520, 520), Image.LANCZOS).save(dst, quality=85, method=6)

def old_style(src, dst):
    im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
    box = square_around(a, np.abs(a - edge_color(a)).sum(axis=2) > 60, 1.06)
    im.crop(box).resize((480, 480), Image.LANCZOS).save(dst, quality=84, method=6)

T1, T2, T2L = [], [], []
# 같은 동화에 여러 판이 있으면 최신 판(thumb3 > thumb2)을 쓴다. thumb3 = 겹을 2~3개로 줄이고 장면을 크게
def newest(prefixes):
    got = {}
    for pre in prefixes:  # 오래된 판부터 → 최신 판이 덮어씀
        for src in sorted(glob.glob(os.path.join(RAW, pre + '*.png'))):
            got[os.path.basename(src)[len(pre):-4]] = src
    return got
for tid, src in sorted(newest(['thumb2_', 'thumb3_']).items()):
    new_style(src, os.path.join(OUT, tid + '.webp'), SHEET['dark']); T2.append(tid)
for tid, src in sorted(newest(['thumb2L_', 'thumb3L_']).items()):
    new_style(src, os.path.join(OUT, tid + '_light.webp'), SHEET['light']); T2L.append(tid)
for src in sorted(glob.glob(os.path.join(RAW, 'thumb_*.png'))):
    tid = os.path.basename(src)[6:-4]
    if tid in T2: continue
    old_style(src, os.path.join(OUT, tid + '.webp')); T1.append(tid)
open(os.path.join(OUT, 'thumbs.js'), 'w').write(
    '/* make_thumbs.py가 생성. THUMBS: 예전 크림 여백 그림, THUMBS2: 남색 종이 구멍, THUMBS2L: 밝은 종이 구멍(<id>_light.webp) */\n'
    f'window.THUMBS = {json.dumps(T1)};\nwindow.THUMBS2 = {json.dumps(T2)};\nwindow.THUMBS2L = {json.dumps(T2L)};\n')
print('old', T1, 'dark', T2, 'light', T2L)
