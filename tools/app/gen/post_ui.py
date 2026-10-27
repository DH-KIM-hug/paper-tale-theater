#!/usr/bin/env python3
"""앱 UI 그림 후처리 (tools/app/gen/jobs_ui_POST.md §2): 마젠타 키 → 정사각/접시 캔버스에 contain → webp(assets/ui/<id>.webp).
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_ui.py id1 id2 ...
ui.js 등록과 ?v= 올리기는 손으로 한다(코드가 이름을 기다리는 그림만 등록)."""
import json, os, sys, tempfile
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, os.path.join(G, 'tools/gpu_night'))
from chromakey import key_magenta

jobs = {j['id']: j for j in json.load(open(os.path.join(G, 'tools/app/gen/jobs_ui.json')))}
FILL = {'tab_': .72, 'empty_': .72, 'night_head': .96}   # 둥근 구멍에 들어가는 그림은 지름 80% 원 안(72%), night_head 는 둥근 밤 장면이라 마젠타 모서리만 지운다
for i in sys.argv[1:]:
    j = jobs[i]; src = os.path.join(G, j['out']); dst = os.path.join(G, j['final'])
    W, H = j['size']
    with tempfile.TemporaryDirectory() as td:
        k = os.path.join(td, 'k.png'); key_magenta(src, k, 6)
        im = Image.open(k).convert('RGBA')
    im = im.crop(im.getbbox())
    fill = .9 if W != H else next((v for p, v in FILL.items() if i.startswith(p)), .8)
    s = min(W * fill / im.width, H * fill / im.height)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    c = Image.new('RGBA', (W, H), (0, 0, 0, 0)); c.paste(im, ((W - im.width) // 2, (H - im.height) // 2), im)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    c.save(dst, 'WEBP', quality=88, method=6)
    print(i, '->', j['final'], c.size)
