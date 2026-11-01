#!/usr/bin/env python3
"""잠자리 장면(mk_jobs_bedtime.py) 그림 후처리: 장면(scene) PNG → assets/v3w/<id>.webp (가로 16:9 1600×900 · 세로 2:3 1024×1536),
움직이는 조각(sprite) → 마젠타 크로마키 후 높이 600 안.   ~/.venvs/paper-tale/bin/python tools/app/gen/post_bed.py"""
import json, os, sys, subprocess
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
V3W = os.path.join(G, 'assets', 'v3w')
for t in ('kkultteok', 'red_car', 'unicorn'):
    for j in json.load(open(os.path.join(G, f'tools/app/gen/jobs_{t}.json'))):
        if not j['id'].endswith(('bed_wide', 'bed_tall', 'baby_sleep')): continue
        src = os.path.join(G, j['out']); dst = os.path.join(V3W, j['id'] + '.webp')
        if not os.path.exists(src) or (os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src)): continue
        if j['kind'] == 'sprite':
            k = os.path.join(G, 'assets/raw/restyle', j['id'] + '_key.png')
            subprocess.run([sys.executable, os.path.join(G, 'tools/gpu_night/chromakey.py'), src, k, '6'], check=True, capture_output=True)
            im = Image.open(k).convert('RGBA'); s = min(900 / im.width, 600 / im.height)
            im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS).save(dst, quality=88, method=6)
            print('ok', j['id'], im.size, 'ar', round(im.width / im.height, 4)); continue
        im = Image.open(src).convert('RGB'); r, size = (16 / 9, (1600, 900)) if j['id'].endswith('wide') else (2 / 3, (1024, 1536))
        if im.width / im.height > r: nw = round(im.height * r); im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
        else: nh = round(im.width / r); im = im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))
        im.resize(size, Image.LANCZOS).save(dst, quality=86, method=6); print('ok', j['id'])
