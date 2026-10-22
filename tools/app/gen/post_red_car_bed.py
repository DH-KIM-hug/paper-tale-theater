#!/usr/bin/env python3
"""나의 빨간 자동차 1장 '잠잘 때도 쌔근': 침대에서 자는 이현이 전용 그림 후처리(2026-10-22 3차).
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_red_car_bed.py
- 원본: assets/raw/restyle/red_car/rc_child_bed.png (jobs_red_car.json 'rc_child_bed', 1024×1536)
  배경 rc_bg_room_v2 의 침대 자리(배경 픽셀 x 1200~1600, y 250~850, 참고 그림 rc_ref_bed_crop.png)를 같은 틀로 다시 그린 그림이다.
  침대·베개·파란 이불·이현이·쥔 빨간 자동차가 한 장에 있고, 침대 밖은 마젠타.
- 결과: assets/v3w/rc_child_bed.webp — 마젠타만 지우고 틀(가로세로 비율·자리)은 그대로 둔다(오리지 않음).
  red_car.js 는 이 그림을 배경 침대 자리(BED_BOX)에 그대로 덮는다.
  (1·2차의 '배경 이불 오려 끼우기' 조각 그림은 쓰지 않는다)"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
src = os.path.join(G, 'assets', 'raw', 'restyle', 'red_car', 'rc_child_bed.png')
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
im = Image.fromarray(np.dstack([out, alpha]).astype(np.uint8), 'RGBA').resize((800, 1200), Image.LANCZOS)
im.save(os.path.join(G, 'assets', 'v3w', 'rc_child_bed.webp'), quality=88, method=6)
print('rc_child_bed: 800x1200 (배경 x1200 y250 w400 h600 자리)')
