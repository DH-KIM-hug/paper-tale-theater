#!/usr/bin/env python3
"""새 스플래시용 큰 글자 조각: 승인된 B 세로형 로고(PNG)의 글자 자리를 재서, 같은 Pretendard 880/800 글자를 K배 크기로 그려 그 자리에 맞춘다.
  ~/.venvs/paper-tale/bin/python tools/brand/build_splash_letters.py   (fonttools·brotli·Pillow 필요)
결과: assets/v3w/sp2_{ko_tok,ko_title,en_toki,en_tale}.webp 와 자리표(로고 PNG 픽셀 좌표) 출력."""
import json, tempfile
from pathlib import Path
from PIL import Image, ImageFont, ImageDraw
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
ROOT = Path(__file__).resolve().parents[2]
TMP = Path(tempfile.mkdtemp())
FONT = {}
for w in (880, 800):
    p = TMP / f'p{w}.ttf'
    f = instantiateVariableFont(TTFont(ROOT / 'assets/fonts/PretendardVariable.woff2'), {'wght': w}, inplace=False)
    f.flavor = None; f.save(p); FONT[w] = ImageFont.truetype(str(p), 800)
def glyph(ch, w, color):
    im = Image.new('RGBA', (1200, 1200)); ImageDraw.Draw(im).text((100, 100), ch, font=FONT[w], fill=color)
    return im.crop(im.getbbox())
# (로고 PNG, 배율, 조각 이름, [(글자, 굵기, 색, 열 시작, 열 끝)])
SPEC = [
    ('assets/brand/c2-logo-B-vertical-light.png', 4, (350, 440), [
        ('sp2_ko_tok', [('톡', 880, '#D9622F', 25, 99)]),
        ('sp2_ko_tok2', [('톡', 880, '#D9622F', 107, 180)]),
        ('sp2_ko_title', [('동', 800, '#222B45', 213, 286), ('화', 800, '#222B45', 293, 368), ('극', 800, '#222B45', 376, 449), ('장', 800, '#222B45', 455, 531)])]),
    ('assets/brand/c2-logo-en-B-vertical-light.png', 2.5, (615, 712), [
        ('sp2_en_toki', [(c, 880, '#D9622F', a, b) for c, a, b in [('T', 133, 202), ('o', 207, 269), ('k', 277, 337), ('i', 342, 363)]]),
        ('sp2_en_toki2', [(c, 880, '#D9622F', a, b) for c, a, b in [('T', 394, 463), ('o', 468, 530), ('k', 538, 598), ('i', 602, 623)]]),
        ('sp2_en_tale', [(c, 800, '#222B45', a, b) for c, a, b in [('T', 665, 733), ('a', 738, 794), ('l', 804, 823), ('e', 832, 890)]])]),
]
layout = {}
for src, K, (y0, y1), pieces in SPEC:
    logo = Image.open(ROOT / src).convert('RGBA'); A = logo.getchannel('A')
    layout[src] = {'size': logo.size, 'mark': list(A.crop((0, 0, logo.width, y0)).getbbox()), 'pieces': {}}
    for name, chars in pieces:
        boxes = []
        for ch, w, color, a, b in chars:
            l, t, r, bt = A.crop((a, y0, b, y1)).getbbox(); boxes.append((a + l, y0 + t, a + r, y0 + bt))
        L, T, R, B = min(x[0] for x in boxes), min(x[1] for x in boxes), max(x[2] for x in boxes), max(x[3] for x in boxes)
        out = Image.new('RGBA', (round((R - L) * K), round((B - T) * K)))
        for (ch, w, color, a, b), (l, t, r, bt) in zip(chars, boxes):
            g = glyph(ch, w, color); size = (round((r - l) * K), round((bt - t) * K))
            print(name, ch, 'ratio', round(g.width / g.height / ((r - l) / (bt - t)), 3))
            out.alpha_composite(g.resize(size, Image.LANCZOS), (round((l - L) * K), round((t - T) * K)))
        layout[src]['pieces'][name] = [L, T, R, B]
        if not name.endswith('2'): out.save(ROOT / f'assets/v3w/{name}.webp', 'WEBP', quality=92, method=6)
print(json.dumps(layout, ensure_ascii=False))
