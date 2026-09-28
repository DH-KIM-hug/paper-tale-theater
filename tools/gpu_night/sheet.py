#!/usr/bin/env python3
"""아침 검수용 모아보기: 폴더의 png를 이름표와 함께 한 장으로. 사용: sheet.py <폴더> <출력.jpg>"""
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
files = sorted(f for f in glob.glob(os.path.join(src, '*.png')) if '_old' not in f)
if not files:
    sys.exit(0)
W, H, cols = 560, 316, 4
rows = (len(files) + cols - 1) // cols
im = Image.new('RGB', (cols * W, rows * H), (40, 40, 40))
d = ImageDraw.Draw(im)
try:
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 22)
except OSError:
    font = None
for i, f in enumerate(files):
    t = Image.open(f).convert('RGB')
    t.thumbnail((W, H))
    x, y = (i % cols) * W, (i // cols) * H
    im.paste(t, (x + (W - t.width) // 2, y + (H - t.height) // 2))
    d.rectangle([x, y, x + 260, y + 30], fill='black')
    d.text((x + 6, y + 3), os.path.basename(f)[:-4], fill='yellow', font=font)
im.save(out, quality=85)
print(out, len(files))
