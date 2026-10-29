#!/usr/bin/env python3
"""iOS 실행 화면(2732 정사각, 꽉 채움): 크림 #F5EFE9 바탕 가운데 B 세로형 로고를 너비 900px 로.
새 스플래시(engine/splash/scene2.js LAUNCH_LOGO = 900/2732, home.css .splash.v2)의 첫 화면과 같은 크기·자리라 실행 화면 → 웹 첫 화면이 튀지 않는다.
마크는 assets/ui/logo_mark.webp, 글자는 build_splash_letters.py 의 큰 조각(sp2_ko_*)으로 다시 짜서 선명하게.
  ~/.venvs/paper-tale/bin/python tools/brand/build_launch_splash.py"""
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[2]
N, LW = 2732, 900
SIZE, MARK = (561, 464), (138, 28, 401, 299)                       # 로고 B(ko) 크기와 그 안의 마크 상자
PIECES = [('sp2_ko_tok', 25, 357, 99, 436), ('sp2_ko_tok', 107, 357, 180, 436), ('sp2_ko_title', 213, 355, 531, 436)]
k = LW / SIZE[0]
ox, oy = (N - LW) / 2, (N - SIZE[1] * k) / 2
out = Image.new('RGBA', (N, N), (245, 239, 233, 255))
def put(im, l, t, r, b):
    out.alpha_composite(im.resize((round((r - l) * k), round((b - t) * k)), Image.LANCZOS), (round(ox + l * k), round(oy + t * k)))
mark = Image.open(ROOT / 'assets/ui/logo_mark.webp').convert('RGBA'); mark = mark.crop(mark.getchannel('A').getbbox())
put(mark, *MARK)
for name, *box in PIECES: put(Image.open(ROOT / f'assets/v3w/{name}.webp').convert('RGBA'), *box)
out = out.convert('RGB')
for f in ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']:
    out.save(ROOT / 'ios/App/App/Assets.xcassets/Splash.imageset' / f, optimize=True)
print('saved', out.size)
