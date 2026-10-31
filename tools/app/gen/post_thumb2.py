#!/usr/bin/env python3
"""홈 카드 새 썸네일 + 동화별 레터링(2026-10-31 사용자: 썸네일만 보고 알 수 있게)
  assets/raw/thumb2/<id>_tile.png (3:2)  -> assets/thumbs/<id>_card.webp 720×540 (가운데 4:3)
  assets/raw/title2/<id>_title.png (투명) -> assets/thumbs/<id>_lt.webp (글자 둘레 여백을 잘라 너비 640 이하)
  둘 다 있는 동화만 assets/thumbs/cards.js 의 window.CARDS 에 올린다. 옛 _tile 은 퍼즐 조각·미리보기가 쓰므로 그대로 둔다.
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_thumb2.py"""
import glob, json, os
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
cards = []
for p in sorted(glob.glob(f'{G}/assets/raw/thumb2/*_tile.png')):
    t = os.path.basename(p)[:-len('_tile.png')]
    lp = f'{G}/assets/raw/title2/{t}_title.png'
    if not os.path.exists(lp): continue
    im = Image.open(p).convert('RGB'); w, h = im.size; nw = round(h * 4 / 3)
    im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h)).resize((720, 540), Image.LANCZOS).save(f'{G}/assets/thumbs/{t}_card.webp', 'WEBP', quality=84, method=6)
    L = Image.open(lp).convert('RGBA'); L = L.crop(L.getchannel('A').point(lambda a: 255 if a > 20 else 0).getbbox())
    if L.width > 640: L = L.resize((640, round(L.height * 640 / L.width)), Image.LANCZOS)
    L.save(f'{G}/assets/thumbs/{t}_lt.webp', 'WEBP', quality=88, method=6)
    cards.append(t)
open(f'{G}/assets/thumbs/cards.js', 'w').write('/* tools/app/gen/post_thumb2.py 가 만든다: 새 카드 썸네일(<id>_card.webp)과 레터링(<id>_lt.webp)이 있는 동화 */\nwindow.CARDS = ' + json.dumps(cards) + ';\n')
print(len(cards), 'cards')
