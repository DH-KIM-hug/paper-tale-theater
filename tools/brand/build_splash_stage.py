#!/usr/bin/env python3
"""새 스플래시 무대 층(2026-10-30 사용자 지시: 처음엔 커튼이 닫혀 있다가 열리며 낮 → 밤 하늘 막이 내려와 밤 → 커튼은 로고처럼 묶인 모양까지만).
모두 sp2_stage_hd(1274×1354, 마크 좌표 x0 43.5 y0 30 배율 .33) 와 같은 판 좌표다.
- sp2_curtain_tied : 무대 그림의 묶인 커튼만 오린 것(맨 앞 층, 배우가 그 뒤로 지나감)
- sp2_night_sky    : (위 0~1250행) 무대 그림에서 커튼 자리만 새 밤 그림(sp2_bg_night, 같은 자리로 맞춰 생성됨)으로 메운 밤 하늘(달·별은 로고와 같음)
- sp2_floor        : 금색 물결 + 주황 바닥만(낮·밤 공용, 하늘 막보다 앞). 위 끝 행 FLOOR_TOP 출력
- sp2_day_full     : 낮 하늘(sp2_bg_day)
  ~/.venvs/paper-tale/bin/python tools/brand/build_splash_stage.py"""
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
ROOT = Path(__file__).resolve().parents[2]; RAW = ROOT / 'assets/raw/restyle/splash2'; V = ROOT / 'assets/v3w'
stage = Image.open(V / 'sp2_stage_hd.webp').convert('RGB'); W, H = stage.size
A = np.asarray(stage).astype(int); R, G, B = A[..., 0], A[..., 1], A[..., 2]
def pad(path):   # 생성 그림(1254)을 무대 판(위 100·오른쪽 20 늘림)과 같게
    im = Image.open(path).convert('RGB').resize((1254, 1254), Image.LANCZOS)
    out = Image.new('RGB', (W, H)); out.paste(im, (0, 100))
    out.paste(im.crop((0, 0, 1254, 14)).resize((1254, 102), Image.BICUBIC), (0, 0))
    out.paste(out.crop((1249, 0, 1254, H)).resize((W - 1253, H), Image.BICUBIC), (1253, 0))
    return out
# 1) 묶인 커튼 오른쪽 끝(줄마다)
ys = np.arange(H)[:, None]
cur = ((R > 60) & (G < R * .43) & (B < R * .6)) | ((R > 180) & (G > 120) & (B < 130) & (ys >= 640) & (ys <= 800))
edge = np.zeros(H)
for y in range(H):
    last = miss = 0
    for x in range(800):
        if cur[y, x]: last, miss = x, 0
        else:
            miss += 1
            if miss > 25: break
    edge[y] = last
red = (R > 60) & (G < R * .36) & (B < R * .6)
for y in range(1101, H):   # 아래쪽은 주황 바닥과 섞이므로 위 기울기로 이어 그리고 그 근처 빨강 끝만
    e = 338 + (y - 1100) * .22; lo, hi = int(e - 40), int(e + 40); xs = np.nonzero(red[y, lo:hi])[0]
    edge[y] = lo + xs.max() if len(xs) else e
edge = np.convolve(np.pad(edge, 3, mode='edge'), np.ones(7) / 7, mode='valid')
def poly_mask(e, grow=0, blur=.8):
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([(0, 0)] + [(e[y] + .5 + grow, y) for y in range(H)] + [(0, H)], fill=255)
    return m.filter(ImageFilter.GaussianBlur(blur))
rgba = stage.convert('RGBA'); rgba.putalpha(poly_mask(edge)); r = int(edge.max()) + 3
rgba.crop((0, 0, r, H)).save(V / 'sp2_curtain_tied.webp', 'WEBP', quality=92, method=6)
print('curtain_tied', r, H)
# 2) 밤 하늘: 커튼(과 그 그림자) 자리만 새 밤 그림으로
night = pad(RAW / 'sp2_bg_night.png')
full = Image.composite(night, stage, poly_mask(edge, grow=70, blur=14))

# 3) 바닥: 열마다 금색 물결 윗끝 아래
F = np.asarray(full).astype(int); fr, fg, fb = F[..., 0], F[..., 1], F[..., 2]
gold = (fr > 180) & (fg > 120) & (fb < 130)
top = np.array([880 + np.argmax(gold[880:, x]) if gold[880:, x].any() else H for x in range(W)], float)   # 별(위쪽 금색)은 빼고
top = np.convolve(np.pad(top, 4, mode='edge'), np.ones(9) / 9, mode='valid') - 1
m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([(x + .5, top[x]) for x in range(W)] + [(W, H), (0, H)], fill=255)
fl = full.convert('RGBA'); fl.putalpha(m.filter(ImageFilter.GaussianBlur(.8)))
FT = int(top.min()) - 2; fl.crop((0, FT, W, H)).save(V / 'sp2_floor.webp', 'WEBP', quality=90, method=6)
# 내려오는 밤 하늘 막: 물결 윗끝 아래는 바로 위 남색을 이어 칠해 하늘만 남긴다(바닥 판 뒤로 넉넉히 1250행까지)
sky = F.copy()
for x in range(W):
    y0 = int(top[x]) - 60; src = sky[y0 - 40:y0, x]   # 물결 그림자보다 위에서 가져온다
    sky[y0:, x] = np.tile(src, ((H - y0) // 40 + 1, 1))[:H - y0]
Image.fromarray(sky.astype('uint8')).crop((0, 0, W, 1250)).save(V / 'sp2_night_sky.webp', 'WEBP', quality=90, method=6)
print('FLOOR_TOP', FT, 'mark y', round(30 + FT * .33, 2))
# 4) 낮 하늘
day = np.asarray(pad(RAW / 'sp2_bg_day.png')).copy()
dg = (day[..., 0] > 180) & (day[..., 1] > 120) & (day[..., 2] < 130)   # 낮 그림 자체의 금색 물결은 바닥 판과 높이가 조금 달라 겹쳐 보이므로 하늘로 지운다
for x in range(W):
    col = np.nonzero(dg[850:, x])[0]
    if len(col):
        y0 = 850 + col[0] - 10; src = day[y0 - 40:y0, x]
        day[y0:, x] = np.resize(src[::-1], (H - y0, 3)) if False else np.tile(src, ((H - y0) // 40 + 1, 1))[:H - y0]
Image.fromarray(day).save(V / 'sp2_day_full.webp', 'WEBP', quality=88, method=6)
