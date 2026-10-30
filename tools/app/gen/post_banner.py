#!/usr/bin/env python3
"""홈 배너 그림·제목 레터링을 앱 파일로 (2026-10-30 홈 UI 2판).
  assets/raw/banner/<id>_banner.png (16:9) -> assets/banner/<id>.webp (1600×900)
  assets/raw/title/<id>_title.png (투명)  -> assets/banner/<id>_title.webp (글자 둘레 투명 여백을 잘라 높이 240 이하)
  assets/raw/title/<id>_title_en.png      -> assets/banner/<id>_title_en.webp (영어 레터링, 2026-10-31)
  assets/banner/banners.js 에 있는 것 목록(window.BANNERS · window.TITLES)을 쓴다 — 홈이 없는 그림을 부르지 않게.
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_banner.py"""
import glob, json, os
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = f'{G}/assets/banner'
os.makedirs(OUT, exist_ok=True)

def newer(src, dst): return not os.path.exists(dst) or os.path.getmtime(src) > os.path.getmtime(dst)

banners, titles, titles_en = [], [], []
for p in sorted(glob.glob(f'{G}/assets/raw/banner/*_banner.png')):
    t = os.path.basename(p)[:-len('_banner.png')]
    dst = f'{OUT}/{t}.webp'
    if newer(p, dst):
        im = Image.open(p).convert('RGB')
        W, H = im.size; tw, th = 1600, 900; r = max(tw / W, th / H)
        im = im.resize((round(W * r) + 1, round(H * r) + 1), Image.LANCZOS)
        x, y = (im.width - tw) // 2, (im.height - th) // 2
        im.crop((x, y, x + tw, y + th)).save(dst, quality=82)
        print('banner', t)
    banners.append(t)
for p in sorted(glob.glob(f'{G}/assets/raw/title/*_title.png')) + sorted(glob.glob(f'{G}/assets/raw/title/*_title_en.png')):
    en = p.endswith('_title_en.png')
    t = os.path.basename(p)[:-len('_title_en.png' if en else '_title.png')]
    dst = f'{OUT}/{t}_title{"_en" if en else ""}.webp'
    if newer(p, dst):
        im = Image.open(p).convert('RGBA')
        box = im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        im = im.crop(box)
        if im.height > 240: im = im.resize((round(im.width * 240 / im.height), 240), Image.LANCZOS)
        im.save(dst, quality=90)
        print('title', t, im.size)
    (titles_en if en else titles).append(t)
open(f'{OUT}/banners.js', 'w').write('/* tools/app/gen/post_banner.py 가 만든다 — 홈 배너 그림·제목 레터링이 있는 동화 */\n'
                                     f'window.BANNERS = {json.dumps(banners)};\nwindow.TITLES = {json.dumps(titles)};\nwindow.TITLES_EN = {json.dumps(titles_en)};\n')
print(len(banners), 'banners,', len(titles), 'titles,', len(titles_en), 'en titles')
