#!/usr/bin/env python3
"""나의 빨간 자동차 1장 '잠잘 때도 쌔근': 이현이가 방 배경의 침대에서 자도록 층 그림 3장을 오려 만든다(2026-10-22).
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_red_car_bed.py
- rc_layer_bed_front.webp : 배경 rc_bg_room_v2 에서 침대 파란 이불만 오린 앞 가림 층(배경 픽셀 그대로, 왼쪽 위 = 배경 (X0,Y0))
- rc_child_sleep_bed.webp : rc_child_sleep 에서 바닥 요·베개·주황 이불을 지운 이현이(머리·어깨·팔). 몸은 이불 층이 덮는다
- rc_child_sleep_arm.webp : 같은 그림의 팔(소매~손)만. 이불 층 위에 얹어 자동차를 쥔 손이 보이게 한다
끝에 각 그림의 원본 좌표(오린 자리)를 출력한다. red_car.js 의 BED 상수가 이 값을 쓴다."""
import os
import numpy as np
from PIL import Image
from scipy import ndimage
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
V3W = os.path.join(G, 'assets', 'v3w')
big = lambda m: (lambda l, n: l == (np.argmax(ndimage.sum(m, l, range(1, n + 1))) + 1))(*ndimage.label(m))

def save(rgba, name):
    ys, xs = np.where(rgba[..., 3] > 8)
    x0, y0 = int(xs.min()), int(ys.min())
    out = rgba[y0:ys.max() + 1, x0:xs.max() + 1]
    Image.fromarray(out).save(os.path.join(V3W, name + '.webp'), quality=92, method=6)
    print(f'{name}: off=({x0},{y0}) size={out.shape[1]}x{out.shape[0]}')

# 1. 침대 이불(앞 가림 층)
bg = np.asarray(Image.open(os.path.join(V3W, 'rc_bg_room_v2.webp')).convert('RGB')).astype(int)
r, g, b = bg[..., 0], bg[..., 1], bg[..., 2]
m = (b > r + 35) & (b > 150); m[:, :1250] = False; m[:420] = False
m = ndimage.binary_fill_holes(ndimage.binary_closing(big(m), iterations=3))
al = (ndimage.gaussian_filter(m.astype(float), .8) * 255).clip(0, 255).astype('uint8')
save(np.dstack([bg.astype('uint8'), al]), 'rc_layer_bed_front')

# 2·3. 자는 이현이에서 요·베개·주황 이불 지우기
im = np.asarray(Image.open(os.path.join(V3W, 'rc_child_sleep.webp')).convert('RGBA')).astype(int)
r, g, b, a = [im[..., i] for i in range(4)]
mx = np.maximum(np.maximum(r, g), b); mn = np.minimum(np.minimum(r, g), b); sat = (mx - mn) / np.maximum(mx, 1)
cand = (a > 20) & ((r - g) < 33) & (mx > 120) & (b > 60) & (sat < .33)          # 크림 요·베개(살색은 r-g 가 커서 빠진다)
lab, n = ndimage.label(cand)
ids = {lab[y, x] for x, y in [(80, 300), (600, 420), (860, 420), (40, 200), (450, 425), (360, 140)]} - {0}
mat = ndimage.binary_closing(np.isin(lab, list(ids)), iterations=2)
orange = (a > 20) & (r > 170) & (r - g > 60) & (b < 110) & (g < 170)
orange = ndimage.binary_fill_holes(ndimage.binary_closing(big(orange), iterations=3))
keep = (a > 20) & ~mat & ~orange
keep[:, 400:] = False
keep = ndimage.binary_fill_holes(big(ndimage.binary_opening(keep, iterations=2)))
keep[334:, :210] = False                                                           # 요 아래 그림자 줄
soft = lambda k: np.minimum(a, ndimage.gaussian_filter(k.astype(float), .7) * 255).astype('uint8')
save(np.dstack([im[..., :3].astype('uint8'), soft(keep)]), 'rc_child_sleep_bed')
yy, xx = np.mgrid[:keep.shape[0], :keep.shape[1]]
skin = (r > 220) & (g > 180) & (b > 130) & ((r - g) > 25)
arm = keep & (yy >= 300) & (xx >= 190) & (xx <= 345) & (skin | (xx >= 255))
save(np.dstack([im[..., :3].astype('uint8'), soft(big(arm))]), 'rc_child_sleep_arm')
