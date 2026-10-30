#!/usr/bin/env python3
"""완두콩 공주 매트리스 2판(2026-10-31 사용자: 매트리스 디자인 이상해 — 단추·갈색 테두리 막대 → 둥글고 폭신한 무늬 매트리스).
얇은 12:1 매트리스는 한 장씩 그리면 5:1 로 나와서, 여섯 장을 한 그림(jobs_pp_mat2 pp_mat2_sheet)에 그려 줄마다 잘라 쓴다.
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_pp_mat2.py  → assets/v3w/pp_prop_mattress_<색>.webp (900×75, 코드 FIXED_ASP 12)"""
import os
import numpy as np
from PIL import Image
from scipy import ndimage
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
SRC = f'{G}/assets/raw/restyle/princess_pea/pp_mat2_sheet.png'
ORDER = ['rose', 'mint', 'gold', 'lilac', 'persimmon', 'cream']   # 그림 위에서 아래 차례

a = np.asarray(Image.open(SRC).convert('RGB')).astype(int)
lo = np.minimum(a[..., 0], a[..., 2]).astype(float); g = a[..., 1]
ratio = g / np.maximum(lo, 1)
bg = (lo >= 40) & (ratio < 0.3)            # 마젠타와 그 그림자 (post_v2.key_edge 와 같은 기준)
ring = ndimage.binary_dilation(bg, iterations=2) & ~bg
alpha = np.full(g.shape, 255.0); alpha[bg] = 0
r = ring & (ratio < 0.6) & (lo >= 40)
alpha[r] = np.clip((ratio[r] - 0.3) * 255 / 0.3, 0, 255)
out = a.copy()
out[..., 0] = np.where(r, np.minimum(a[..., 0], g + 30), a[..., 0])
out[..., 2] = np.where(r, np.minimum(a[..., 2], g + 30), a[..., 2])
img = Image.fromarray(np.dstack([out, alpha]).astype(np.uint8))

rows = (alpha > 128).sum(1) > a.shape[1] * .05
lab, n = ndimage.label(rows)
bands = [np.where(lab == i)[0] for i in range(1, n + 1)]
bands = [b for b in bands if len(b) > 20]
assert len(bands) == 6, f'줄 {len(bands)}개'
for name, b in zip(ORDER, bands):
    piece = img.crop((0, max(0, b[0] - 3), img.width, min(img.height, b[-1] + 4)))
    bb = piece.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    piece = piece.crop(bb).resize((900, 75), Image.LANCZOS)
    piece.save(f'{G}/assets/v3w/pp_prop_mattress_{name}.webp', quality=88)
    print(name, bb[2] - bb[0], bb[3] - bb[1], round((bb[2] - bb[0]) / (bb[3] - bb[1]), 2))
