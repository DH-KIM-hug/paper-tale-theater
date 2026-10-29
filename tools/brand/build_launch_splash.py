#!/usr/bin/env python3
"""새 스플래시 첫 화면 = 커튼이 다 닫힌 로고(2026-10-30 사용자 지시 '처음엔 다 닫혀 있다가 열림').
- assets/v3w/sp2_logo_closed_{ko,en}.webp : 정지 첫 화면(home.js·start.js, 3D 첫 장면과 같은 그림). B 세로형 로고에서 마크 자리만
  닫힌 커튼(sp2_curtain 을 scene2.js 와 같은 자리 x 40~520, y 30~480 마크 픽셀로 늘림)을 아치로 오려 넣은 것. 글자는 큰 글자 조각.
- iOS 실행 화면(2732 정사각, 꽉 채움): 크림 #F5EFE9 가운데 같은 그림을 너비 900px 로(scene2.js LAUNCH_LOGO = 900/2732).
  ~/.venvs/paper-tale/bin/python tools/brand/build_launch_splash.py"""
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[2]; V = ROOT / 'assets/v3w'
MARK_BOX = (14, 6, 462, 469)   # logo_mark.webp 알파 상자(마크 픽셀)
LOCKUP = {
    'ko': ((561, 464), (138, 28, 401, 299), [('sp2_ko_tok', 25, 357, 99, 436), ('sp2_ko_tok', 107, 357, 180, 436), ('sp2_ko_title', 213, 355, 531, 436)]),
    'en': ((1024, 805), (289, 59, 735, 520), [('sp2_en_toki', 133, 620, 363, 708), ('sp2_en_toki', 394, 620, 623, 708), ('sp2_en_tale', 665, 626, 890, 708)]),
}
def closed_mark(S=4):   # 마크 공간 512·S 크기의 닫힌 커튼 아치
    mark = Image.open(ROOT / 'assets/ui/logo_mark.webp').convert('RGBA').resize((512 * S, 512 * S), Image.LANCZOS)
    cur = Image.open(V / 'sp2_curtain.webp').convert('RGBA').resize((480 * S, 450 * S), Image.LANCZOS)
    c = Image.new('RGBA', (512 * S, 512 * S)); c.alpha_composite(cur, (40 * S, 30 * S))
    out = Image.new('RGBA', c.size); out.paste(c, (0, 0), mark.getchannel('A')); return out
CM = closed_mark()
def lockup(lang, width):   # 너비 width px 로 그린 닫힌 로고(투명 바탕)
    (lw, lh), mb, pieces = LOCKUP[lang]; k = width / lw
    out = Image.new('RGBA', (width, round(lh * k)))
    s = (mb[2] - mb[0]) * k / (MARK_BOX[2] - MARK_BOX[0])   # 출력 px / 마크 픽셀
    m = CM.crop([v * 4 for v in MARK_BOX]).resize((round((MARK_BOX[2] - MARK_BOX[0]) * s), round((MARK_BOX[3] - MARK_BOX[1]) * s)), Image.LANCZOS)
    out.alpha_composite(m, (round(mb[0] * k), round(mb[1] * k)))
    for name, l, t, r, b in pieces:
        out.alpha_composite(Image.open(V / f'{name}.webp').convert('RGBA').resize((round((r - l) * k), round((b - t) * k)), Image.LANCZOS), (round(l * k), round(t * k)))
    return out
for lang, w in [('ko', 1122), ('en', 1024)]:
    lockup(lang, w).save(V / f'sp2_logo_closed_{lang}.webp', 'WEBP', quality=92, method=6)
N, LW = 2732, 900
img = lockup('ko', LW); bg = Image.new('RGBA', (N, N), (245, 239, 233, 255))
bg.alpha_composite(img, ((N - img.width) // 2, (N - img.height) // 2)); bg = bg.convert('RGB')
for f in ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']:
    bg.save(ROOT / 'ios/App/App/Assets.xcassets/Splash.imageset' / f, optimize=True)
print('ok')
