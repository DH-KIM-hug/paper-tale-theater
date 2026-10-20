#!/usr/bin/env python3
"""신데렐라(새 기획, cd2_) 그림 후처리: assets/raw/restyle/cinderella2/*.png → assets/v3w/cd2_*.webp
  ~/.venvs/paper-tale/bin/python tools/app/gen/post_cinderella2.py [id ...]
- 그림(sprite): 마젠타 크로마키 → 사방 여백 없이 오림 → 높이 600(넓으면 폭 900) 안에 맞춤
- 배경(bg): 16:9 가운데 자르기 → 1600×902
- 합성: 시계 카드 3장(cd2_card_12/3/6 = 빈 시계 + 바늘 그림을 돌려 얹음), 발 카드 3장(cd2_foot 을 눕혀 크기만 다르게)
- 끝에 그림 폭/높이 비율을 출력한다 (cinderella.js 의 ASP)"""
import json, os, sys, subprocess
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
V3W = os.path.join(G, 'assets', 'v3w'); TMP = os.path.join(G, 'assets', 'raw', 'restyle', 'cinderella2_key')
jobs = json.load(open(os.path.join(G, 'tools/app/gen/jobs_cinderella2.json')))
only = set(sys.argv[1:]); os.makedirs(TMP, exist_ok=True)

def keyed(j):
    k = os.path.join(TMP, j['id'] + '.png')
    subprocess.run([sys.executable, os.path.join(G, 'tools/gpu_night/chromakey.py'), os.path.join(G, j['out']), k, '6'], check=True, capture_output=True)
    return Image.open(k).convert('RGBA')

for j in jobs:
    src = os.path.join(G, j['out'])
    if not os.path.exists(src) or (only and j['id'] not in only): continue
    dst = os.path.join(V3W, j['id'] + '.webp')
    if j['kind'] == 'sprite':
        im = keyed(j)
        s = min(900 / im.width, 600 / im.height)
        im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS).save(dst, quality=88, method=6)
    else:
        im = Image.open(src).convert('RGB'); r = 16 / 9
        if im.width / im.height > r: nw = round(im.height * r); im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
        else: nh = round(im.width / r); im = im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))
        im.resize((1600, 902), Image.LANCZOS).save(dst, quality=86, method=6)
    print('ok', j['id'])

def load(n):
    p = os.path.join(V3W, n + '.webp')
    return Image.open(p).convert('RGBA') if os.path.exists(p) else None

# 시계 카드: 빈 시계 가운데에 바늘 그림을 바닥 끝(구멍)이 가운데에 오도록 돌려 얹는다
face, hh, mm = load('cd2_card_face'), load('cd2_clock_hour'), load('cd2_clock_min')
if face and hh and mm:
    S = 520
    f = face.resize((S, round(S * face.height / face.width)), Image.LANCZOS); cx, cy = f.width / 2, f.height / 2
    def put_hand(c, img, length, deg):
        """바늘 그림(위를 가리킴, 바닥 끝에 둥근 구멍)을 구멍이 시계 가운데에 오게 deg 만큼(시계 방향) 돌려 얹는다"""
        h = img.resize((max(1, round(img.width * length / img.height)), round(length)), Image.LANCZOS)
        R = h.height; cv = Image.new('RGBA', (2 * R, 2 * R))
        piv = h.height - h.width * .5                       # 그림 위끝에서 구멍까지
        cv.paste(h, (round(R - h.width / 2), round(R - piv)))
        cv = cv.rotate(-deg, resample=Image.BICUBIC)
        c.alpha_composite(cv, (round(cx - R), round(cy - R)))
    for name, hd in (('12', 0), ('3', 90), ('6', 180)):
        c = f.copy()
        put_hand(c, hh, S * .27, hd); put_hand(c, mm, S * .38, 0)
        c.save(os.path.join(V3W, f'cd2_card_{name}.webp'), quality=88, method=6); print('card', name)

# 발 카드: 발을 눕혀(발가락이 오른쪽) 같은 크기 판에 큰 발·더 큰 발·작은 발
foot = load('cd2_foot')
if foot:
    ft = foot.rotate(-90, expand=True)
    W, H = 600, 300
    for name, L in (('big', 470), ('bigger', 560), ('small', 340)):
        im = ft.resize((L, round(L * ft.height / ft.width)), Image.LANCZOS)
        c = Image.new('RGBA', (W, H)); c.alpha_composite(im, ((W - im.width) // 2, (H - im.height) // 2))
        c.save(os.path.join(V3W, f'cd2_foot_{name}.webp'), quality=88, method=6); print('foot', name)

asp = {}
for fn in sorted(os.listdir(V3W)):
    if fn.startswith('cd2_') and not fn.startswith('cd2_bg_'):
        im = Image.open(os.path.join(V3W, fn)); asp[fn[4:-5]] = round(im.width / im.height, 4)
print(json.dumps(asp))
