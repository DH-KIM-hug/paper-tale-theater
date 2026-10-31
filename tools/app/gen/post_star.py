#!/usr/bin/env python3
"""별 조각 그림(assets/raw/ui/<src>.png, 투명) → assets/ui/star_one.webp 512².
별의 외접원 중심을 그림 한가운데에 둔다(앱이 가운데에서 꼭지 다섯 조각으로 자르기 때문). 2026-10-31
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_star.py star_v3a"""
import sys, os
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
im = Image.open(f'{G}/assets/raw/ui/{sys.argv[1]}.png').convert('RGBA')
x0, y0, x1, y1 = im.getchannel('A').point(lambda a: 255 if a > 40 else 0).getbbox()
import numpy as np
A = (np.asarray(im.getchannel('A')) > 40)
ys, xs = np.nonzero(A)
cx, cy = xs.mean(), ys.mean()              # 별 면적의 무게중심 = 다섯 꼭지의 가운데(그림이 정오각별보다 길쭉해도)
h = max(cx - x0, x1 - cx, cy - y0, y1 - cy) * 1.03
sq = im.crop((round(cx - h), round(cy - h), round(cx + h), round(cy + h))).resize((512, 512), Image.LANCZOS)
sq.save(f'{G}/assets/ui/star_one.webp', 'WEBP', quality=90, method=6)
print('bbox', (x0, y0, x1, y1), 'center', (round(cx), round(cy)), 'half', round(h))
