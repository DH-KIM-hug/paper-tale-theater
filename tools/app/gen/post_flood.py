#!/usr/bin/env python3
"""공주 v2 그림 후처리: 테두리와 이어진 마젠타만 지운다(보라·라벤더 조각 보호).
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_flood.py <tale> <id> [id ...] [--sat=.55]
- 원본: assets/raw/restyle/<tale>/<id>.png → assets/v3w/<id>.webp
- 배경(id 에 _bg_): 16:9 가운데 자르기 → 1600×902 (post_tale.py 와 같음)
- 그림: 마젠타 색상(283~338°)·채도 > .55 덩어리 중 테두리와 이어진 것 + 평균 채도 > .62 인 속 구멍만 배경.
  그 배경에서 2px 안쪽의 마젠타 기운 픽셀만 부드럽게(경계 앤티에일리어스), 나머지 조각은 색이 보라여도 불투명.
  여백 6px 남기고 오림 → 높이 600(넓으면 폭 900) 안에 맞춤. 끝에 이름: 폭/높이 를 출력한다."""
import os, sys
import numpy as np
from PIL import Image
from scipy import ndimage
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
SAT = float(next((a.split('=')[1] for a in sys.argv if a.startswith('--sat=')), .55))   # 보라 옷처럼 채도 높은 보라 조각이 있으면 --sat=.7
tale = args[0]; ids = args[1:]
V3W = os.path.join(G, 'assets', 'v3w')

def key(src):
    im0 = Image.open(src).convert('RGB')
    a = np.asarray(im0).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    hsv = np.asarray(im0.convert('HSV')).astype(float)
    hue, sat, val = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2]
    mag = (hue > 283) & (hue < 338)                  # 마젠타 색상 띠(그늘진 바탕은 붉은 쪽으로 기운다)
    core = mag & (sat > SAT) & (val > 40)           # 보라·라벤더 색지는 채도 ≤ .5 라 여기 안 든다
    lab, n = ndimage.label(core)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    keep = np.zeros(n + 1, bool)
    for i in edge: keep[i] = True
    if n:   # 테두리와 안 이어진 속 구멍(풀잎 사이 등)은 아주 진한 마젠타 덩어리일 때만
        idx = np.arange(1, n + 1)
        mean = ndimage.mean(sat, lab, index=idx); size = ndimage.sum(np.ones_like(sat), lab, index=idx)
        keep[1:] |= (mean > SAT + .07) & (size >= 8)
    bg = keep[lab]
    near = ndimage.binary_dilation(bg, iterations=2) & ~bg & (hue > 270) & (hue < 345) & (sat > 0.3)
    alpha = np.full(sat.shape, 255.0)
    alpha[bg] = 0
    alpha[near] = np.clip((SAT - sat[near]) * 255 / 0.25, 0, 255)
    out = a.copy()
    sp = near | (ndimage.binary_dilation(bg, iterations=1) & ~bg)
    out[..., 0] = np.where(sp & (r > g + 30), np.minimum(r, g + 30), r)
    out[..., 2] = np.where(sp & (b > g + 30), np.minimum(b, g + 30), b)
    im = Image.fromarray(np.dstack([out, alpha]).astype(np.uint8), 'RGBA')
    x0, y0, x1, y1 = im.getbbox(); w, h = im.size; p = 6
    return im.crop((max(0, x0 - p), max(0, y0 - p), min(w, x1 + p), min(h, y1 + p)))

for i in ids:
    src = os.path.join(G, 'assets', 'raw', 'restyle', tale, i + '.png'); dst = os.path.join(V3W, i + '.webp')
    if '_bg_' in i:
        im = Image.open(src).convert('RGB'); rr = 16 / 9
        if im.width / im.height > rr: nw = round(im.height * rr); im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
        else: nh = round(im.width / rr); im = im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))
        im.resize((1600, 902), Image.LANCZOS).save(dst, quality=86, method=6); print('bg', i); continue
    im = key(src); s = min(900 / im.width, 600 / im.height)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    im.save(dst, quality=88, method=6)
    print(f'{i.split("_", 1)[1]}: {round(im.width / im.height, 4)}')
