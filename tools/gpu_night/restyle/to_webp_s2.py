#!/usr/bin/env python3
"""assets/raw/v3/<name>.png -> assets/v3w/<name>.webp (배경은 가로 1600, 컷은 그대로 1024x768, RGB, quality 86)
사용: to_webp_s2.py name [name ...]"""
import sys, os
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
for n in sys.argv[1:]:
    im = Image.open(f'{G}/assets/raw/v3/{n}.png').convert('RGB')
    if '_cut_' not in n and im.width > 1600:
        im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
    im.save(f'{G}/assets/v3w/{n}.webp', quality=80, method=6)
    print(n, im.size)
