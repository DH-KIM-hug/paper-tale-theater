#!/usr/bin/env python3
"""python back_to_webp.py <tale> : assets/raw/keyart_gpt/<tale>_back{w,t}_v5.png -> assets/thumbs/<tale>_back_{wide,tall}.webp"""
import sys, os
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
t = sys.argv[1]
for s, n, size in (('w','wide',(1200,800)),('t','tall',(1000,1150))):
    im = Image.open(f'{G}/assets/raw/keyart_gpt/{t}_back{s}_v5.png').convert('RGB')
    W, H = im.size; tw, th = size; r = max(tw/W, th/H)
    im = im.resize((round(W*r)+1, round(H*r)+1), Image.LANCZOS)
    x, y = (im.width-tw)//2, (im.height-th)//2
    im.crop((x,y,x+tw,y+th)).save(f'{G}/assets/thumbs/{t}_back_{n}.webp', quality=86)
    print(t, n, W, H)
