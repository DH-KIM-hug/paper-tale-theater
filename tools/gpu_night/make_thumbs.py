"""GPU로 만든 동화 썸네일(assets/raw/v3/thumb_<id>.png)을 홈 카드용으로 다듬는다.
크림색 여백을 잘라 액자가 꽉 차게 정사각형으로 맞추고 → assets/thumbs/<id>.webp (480px)
그리고 준비된 목록을 assets/thumbs/thumbs.js 에 적는다 (home.js가 읽음)."""
import glob, os, json
import numpy as np
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'assets', 'thumbs'); os.makedirs(OUT, exist_ok=True)
ids = []
for src in sorted(glob.glob(os.path.join(ROOT, 'assets', 'raw', 'v3', 'thumb_*.png'))):
    tid = os.path.basename(src)[6:-4]
    im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(int)
    h, w, _ = a.shape
    bg = np.median(np.concatenate([a[:8].reshape(-1, 3), a[-8:].reshape(-1, 3), a[:, :8].reshape(-1, 3), a[:, -8:].reshape(-1, 3)]), axis=0)
    diff = np.abs(a - bg).sum(axis=2) > 60
    ys, xs = np.where(diff)
    if len(xs):
        x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        half = max(x1 - x0, y1 - y0) / 2 * 1.06   # 액자 둘레에 여백 조금
        half = min(half, cx, cy, w - cx, h - cy, w / 2)
        im = im.crop((int(cx - half), int(cy - half), int(cx + half), int(cy + half)))
    im.resize((480, 480), Image.LANCZOS).save(os.path.join(OUT, tid + '.webp'), quality=84, method=6)
    ids.append(tid)
open(os.path.join(OUT, 'thumbs.js'), 'w').write('/* make_thumbs.py가 생성: 새 썸네일이 준비된 동화 */\nwindow.THUMBS = ' + json.dumps(ids) + ';\n')
print(ids)
