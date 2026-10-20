#!/usr/bin/env python3
"""아기 돼지 집 짓는 단계 그림(tp2_*)을 완성 그림(tp_house_*)과 같은 상자·같은 바닥선으로 맞춰 assets/v3w/tp2_*.webp 로 저장한다.
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_tp2.py [id ...]"""
import os, sys, subprocess, numpy as np
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
RAW = os.path.join(G, 'assets/raw/restyle/three_pigs'); TMP = os.path.join(G, 'assets/raw/three_pigs_key'); os.makedirs(TMP, exist_ok=True)
def keyed(name):
    k = os.path.join(TMP, name + '_full.png')
    subprocess.run([sys.executable, os.path.join(G, 'tools/gpu_night/chromakey.py'), os.path.join(RAW, name + '.png'), k, '-1'], check=True, capture_output=True)
    return Image.open(k).convert('RGBA')
def bbox(im, th=40): return Image.fromarray((np.array(im)[..., 3] > th).astype(np.uint8) * 255).getbbox()
ids = sys.argv[1:] or [f'tp2_{h}_s{i}' for h in ('straw', 'wood', 'brick') for i in (1, 2, 3)]
for i in ids:
    h = i.split('_')[1]; fin = Image.open(os.path.join(G, f'assets/v3w/tp_house_{h}.webp'))
    full = keyed(f'tp_house_{h}'); fb = bbox(full); box = (fb[0] - 6, fb[1] - 6, fb[2] + 6, fb[3] + 6)  # 완성 그림이 만들어질 때와 같은 여백
    st = keyed(i); sb = bbox(st)
    # 같은 화면이면 그대로 자르면 맞는다. 바닥 y 와 가로 가운데가 어긋나면 바닥·가운데를 완성 그림에 맞춘다
    dy = fb[3] - sb[3]; dx = ((fb[0] + fb[2]) - (sb[0] + sb[2])) // 2
    print(i, 'bbox', sb, '완성', fb, 'dy', dy, 'dx', dx)
    canvas = Image.new('RGBA', full.size, (0, 0, 0, 0)); canvas.alpha_composite(st, (dx, dy))
    crop = canvas.crop(box).resize(fin.size, Image.LANCZOS)
    crop.save(os.path.join(G, f'assets/v3w/{i}.webp'), quality=88, method=6)
    a = bbox(crop); b = bbox(fin.convert('RGBA')); print('  결과 bbox', a, '완성 bbox', b)
