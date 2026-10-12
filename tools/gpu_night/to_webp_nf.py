#!/usr/bin/env python3
"""assets/v3/<name>nf.png -> assets/v3w/<name>nf.webp (사물: 긴 변 700px RGBA, 컷: 그대로 RGB)"""
import sys, os
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
for n in sys.argv[1:]:
    im = Image.open(f'{G}/assets/v3/{n}.png')
    if '_cut_' in n or '_bg_' in n:
        im = im.convert('RGB')
        if im.width > 1600:
            im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
    elif max(im.size) > 700:
        s = 700 / max(im.size); im = im.resize((round(im.width*s), round(im.height*s)), Image.LANCZOS)
    im.save(f'{G}/assets/v3w/{n}.webp', quality=86, method=6)
    print(n, im.size)
