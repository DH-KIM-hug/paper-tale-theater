#!/usr/bin/env python3
"""그림 컷(kind:'cut', 4:3) 후처리 공통: 지정한 동화의 컷 PNG → 가운데 4:3 자르기 → 1200×900 → assets/v3w/<id>.webp
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_cuts.py <tale> [id ...]   (id 생략 시 그 동화의 컷 전부, 있는 것만)"""
import json, os, sys
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
tale, ids = sys.argv[1], sys.argv[2:]
jobs = [j for j in json.load(open(os.path.join(G, f'tools/app/gen/jobs_{tale}.json'))) if j.get('kind') == 'cut']
for j in jobs:
    if ids and j['id'] not in ids: continue
    src = os.path.join(G, j['out'])
    if not os.path.exists(src): print('없음', j['id']); continue
    im = Image.open(src).convert('RGB')
    w, h = im.size
    if w / h > 4 / 3: nw = int(h * 4 / 3); im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else: nh = int(w * 3 / 4); im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((1200, 900), Image.LANCZOS)
    dst = os.path.join(G, 'assets', 'v3w', j['id'] + '.webp')
    im.save(dst, quality=88, method=6); print('ok', j['id'])
