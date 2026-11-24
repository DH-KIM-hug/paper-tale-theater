#!/usr/bin/env python3
"""반대 모습 표지 그림 원본(assets/raw/look_cover/<id>.png) → 앱용 webp (jobs_look_cover.json 의 app 경로, 원래 그림과 같은 크기).
  ~/.venvs/paper-tale/bin/python -I tools/app/gen/post_look_cover.py [id ...]
비율이 다르면 가운데를 기준으로 꽉 채워 자른다. 원래 그림에 투명(구름 공장 타일 모서리)이 있으면 원래 알파를 그대로 씌운다."""
import json, os, sys
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))
jobs = json.load(open(os.path.join(G, 'tools/app/gen/jobs_look_cover.json')))
want = set(sys.argv[1:])
for j in jobs:
    if want and j['id'] not in want: continue
    raw = os.path.join(G, j['out'])
    if not os.path.exists(raw): print('없음', j['id']); continue
    src = Image.open(os.path.join(G, j['src']))
    tw, th = j['size']; im = Image.open(raw).convert('RGB'); W, H = im.size; r = max(tw / W, th / H)
    im = im.resize((round(W * r) + 1, round(H * r) + 1), Image.LANCZOS)
    x, y = (im.width - tw) // 2, (im.height - th) // 2
    im = im.crop((x, y, x + tw, y + th))
    if src.mode == 'RGBA' and src.getchannel('A').getextrema()[0] < 255:
        im = im.convert('RGBA'); im.putalpha(src.getchannel('A'))
    out = os.path.join(G, j['app']); im.save(out, quality=86)
    print(j['id'], (W, H), '→', (tw, th), os.path.relpath(out, G), os.path.getsize(out) // 1024, 'KB')
