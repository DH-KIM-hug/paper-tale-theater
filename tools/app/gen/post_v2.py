#!/usr/bin/env python3
"""화려하게 다시 그리기(v2) 그림 후처리: jobs_<tale>.json 의 그림 PNG → assets/v3w/<id>.webp
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_v2.py <jobs이름> id [id ...]
- sprite: 마젠타 배경 지우기. 마젠타와 그 그림자(G < 0.3·min(R,B))만 지우고(테두리와 이어진 것 + 닫힌 구멍 40px 이상),
  그 둘레 2px 만 부드럽게 한다. 보라·라벤더 조각(G/min(R,B) 0.6 이상)은 반투명이 되지 않는다.
  → 여백 6px 남기고 오림 → 높이 600(넓으면 폭 900) 안에 맞춤
- bg: 16:9 가운데 자르기 → 1600×902
- key(컷 4:3): 가운데 4:3 → 1200×900
- 끝에 sprite 폭/높이 비율을 출력(코드 ASP 표용)"""
import json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
V3W = os.path.join(G, 'assets', 'v3w')
tale, only = sys.argv[1], set(sys.argv[2:])
jobs = json.load(open(os.path.join(G, f'tools/app/gen/jobs_{tale}.json')))

def key_edge(src):
    a = np.asarray(Image.open(src).convert('RGB')).astype(int)
    lo = np.minimum(a[..., 0], a[..., 2]).astype(float); g = a[..., 1]
    ratio = g / np.maximum(lo, 1)          # 마젠타·마젠타 그림자: 초록이 빨강·파랑의 30% 아래
    core = (lo >= 40) & (ratio < 0.3)       # 보라(#7B4F8C 0.64)·라벤더(#8B7BB8 0.88)·로열퍼플(0.64)은 들지 않는다
    lab, n = ndimage.label(core)
    keep = np.zeros(n + 1, bool)
    for i in set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}: keep[i] = True
    if n:  # 닫힌 구멍(샹들리에 팔 사이 등): 40px 이상 덩어리
        keep[1:] |= ndimage.sum(core, lab, np.arange(1, n + 1)) >= 40
    bg = keep[lab]
    ring = ndimage.binary_dilation(bg, iterations=2) & ~bg
    alpha = np.full(g.shape, 255.0); alpha[bg] = 0
    r = ring & (ratio < 0.6) & (lo >= 40)   # 경계 섞인 점: 0.3→투명, 0.6→불투명
    alpha[r] = np.clip((ratio[r] - 0.3) * 255 / 0.3, 0, 255)
    out = a.copy()
    out[..., 0] = np.where(r, np.minimum(a[..., 0], g + 30), a[..., 0])
    out[..., 2] = np.where(r, np.minimum(a[..., 2], g + 30), a[..., 2])
    img = Image.fromarray(np.dstack([out, alpha]).astype(np.uint8))
    bb = img.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    if bb:
        w, h = img.size; p = 6
        img = img.crop((max(0, bb[0] - p), max(0, bb[1] - p), min(w, bb[2] + p), min(h, bb[3] + p)))
    return img

def crop(im, r):
    if im.width / im.height > r: nw = round(im.height * r); return im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
    nh = round(im.width / r); return im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))

asp = []
for j in jobs:
    if j['id'] not in only: continue
    src = os.path.join(G, j['out']); dst = os.path.join(V3W, j['id'] + '.webp')
    if not os.path.exists(src): print('없음', j['id']); continue
    if j['kind'] == 'sprite':
        im = key_edge(src); s = min(900 / im.width, 600 / im.height)
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        im.save(dst, quality=88, method=6); asp.append((j['id'], round(im.width / im.height, 4)))
    elif j['kind'] == 'bg':
        crop(Image.open(src).convert('RGB'), 16 / 9).resize((1600, 902), Image.LANCZOS).save(dst, quality=86, method=6)
    else:
        crop(Image.open(src).convert('RGB'), 4 / 3).resize((1200, 900), Image.LANCZOS).save(dst, quality=88, method=6)
    print('ok', j['id'], flush=True)
for i, v in asp: print(f'{i}: {v}')
