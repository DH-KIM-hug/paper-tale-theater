#!/usr/bin/env python3
"""크리스마스 4편 제목 레터링 → 앱 파일 (mk_jobs_title_xmas.py 의 짝). 변환 규칙은 post_thumb2.py(_lt)·post_banner.py(_title)와 똑같다.
목록 파일(assets/thumbs/cards.js, assets/banner/banners.js)은 건드리지 않는다 — 홈 등록은 중심 세션이 한다
(등록할 때는 post_thumb2.py·post_banner.py 를 그대로 다시 돌리면 이 파일들이 목록에 들어간다. 단 post_thumb2 는 assets/raw/thumb2/<id>_tile.png 가 있어야 CARDS 에 올린다).
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_title_xmas.py"""
import os, sys
from PIL import Image
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))); from rawpath import raw_path, raw_exists
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
for t in ['nutcracker', 'night_before', 'gingerbread', 'elves_shoemaker']:
    for en in ('', '_en'):
        p = f'{G}/assets/raw/title2/{t}_title{en}.png'          # 색지 레터링 → assets/thumbs/<id>_lt(_en).webp (post_thumb2.py 규칙)
        if raw_exists(p):
            L = Image.open(raw_path(p)).convert('RGBA'); L = L.crop(L.getchannel('A').point(lambda a: 255 if a > 20 else 0).getbbox())
            if L.width > 640: L = L.resize((640, round(L.height * 640 / L.width)), Image.LANCZOS)
            L.save(f'{G}/assets/thumbs/{t}_lt{en}.webp', 'WEBP', quality=88, method=6); print('lt', t, en, L.size)
        p = f'{G}/assets/raw/title/{t}_title{en}.png'            # 흰 레터링 → assets/banner/<id>_title(_en).webp (post_banner.py 규칙)
        if raw_exists(p):
            im = Image.open(raw_path(p)).convert('RGBA'); im = im.crop(im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox())
            if im.height > 240: im = im.resize((round(im.width * 240 / im.height), 240), Image.LANCZOS)
            im.save(f'{G}/assets/banner/{t}_title{en}.webp', quality=90); print('title', t, en, im.size)
