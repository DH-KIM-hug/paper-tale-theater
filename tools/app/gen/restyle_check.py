#!/usr/bin/env python3
"""재생성 그림 검사 + 모아 보기: python restyle_check.py <tale> <out.jpg>
인물인데 마젠타 배경이 아님 / 배경·컷인데 마젠타 → 지움 대상으로 출력"""
import json, os, sys
from PIL import Image, ImageDraw
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
tale, out = sys.argv[1], sys.argv[2]
jobs = json.load(open(os.path.join(G, f'tools/app/gen/restyle/jobs_{tale}.json')))
bad = []
for j in jobs:
    p = os.path.join(G, j['out'])
    if not os.path.exists(p): continue
    im = Image.open(p).convert('RGB'); w, h = im.size
    mag = sum(1 for r, g, b in [im.getpixel(q) for q in [(3, 3), (w - 4, 3), (3, h - 4), (w - 4, h - 4)]] if r > 180 and b > 180 and g < 110)
    if (j['kind'] == 'sprite' and mag < 3) or (j['kind'] != 'sprite' and mag >= 2): bad.append(j['id'])
print('BAD', ' '.join(bad))
items = [j for j in jobs if os.path.exists(os.path.join(G, j['out']))]
cell = 150; cols = 10; rows = (len(items) + cols - 1) // cols
W = Image.new('RGB', (cols * cell, rows * (cell + 14)), 'white'); d = ImageDraw.Draw(W)
for i, j in enumerate(items):
    im = Image.open(os.path.join(G, j['out'])).convert('RGB'); im.thumbnail((cell - 6, cell - 6))
    x, y = (i % cols) * cell, (i // cols) * (cell + 14); W.paste(im, (x + 3, y + 3)); d.text((x + 3, y + cell - 2), j['id'][:24], fill='black')
W.save(out, quality=78)
