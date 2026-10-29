#!/usr/bin/env python3
"""jobs_svgfix.json 후처리: sprite = 마젠타 키 → 오림 → size 상자 안에 맞춤, bg = 비율 가운데 자르기 → size. 결과 assets/v3w/<id>.webp
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_svgfix.py [id ...]"""
import json, os, sys, tempfile
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, os.path.join(G, 'tools/gpu_night'))
from chromakey import key_magenta
only = set(sys.argv[1:])
for j in json.load(open(os.path.join(G, f"tools/app/gen/jobs_{os.environ.get('JOBS', 'svgfix')}.json"))):
    if only and j['id'] not in only: continue
    src = os.path.join(G, j['out']); dst = os.path.join(G, j['final']); W, H = j['size']
    if not os.path.exists(src): print('없음', j['id']); continue
    if j['kind'] == 'sprite':
        with tempfile.TemporaryDirectory() as td:
            k = os.path.join(td, 'k.png'); key_magenta(src, k, 6); im = Image.open(k).convert('RGBA')
        im = im.crop(im.getbbox()); s = min(W / im.width, H / im.height)
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    else:
        im = Image.open(src).convert('RGB'); r = W / H
        if im.width / im.height > r: nw = round(im.height * r); im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
        else: nh = round(im.width / r); im = im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))
        im = im.resize((W, H), Image.LANCZOS)
    im.save(dst, 'WEBP', quality=88, method=6); print(j['id'], im.size)
