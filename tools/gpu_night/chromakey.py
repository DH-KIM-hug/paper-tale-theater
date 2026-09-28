#!/usr/bin/env python3
"""테두리 플러드필 (pad<0이면 레이어 모드: 트림·하단 라임 정리 없음) 기반 배경 제거 → 투명 PNG (+트림, 경계 despill).
배경은 이미지 가장자리와 연결된 균일색이라는 가정. 캐릭터 내부 색은 건드리지 않는다.
사용: python3 chromakey.py in.png out.png [pad]"""
import sys
import numpy as np
from PIL import Image, ImageDraw

def key(src, dst, pad=12, thresh=45, nogreen=False):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    work = im.copy()
    sentinel = (255, 0, 255)
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    for s in seeds:
        if work.getpixel(s) != sentinel:
            ImageDraw.floodfill(work, s, sentinel, thresh=thresh)
    arr = np.asarray(work)
    bg = (arr[..., 0] == 255) & (arr[..., 1] == 0) & (arr[..., 2] == 255)

    orig = np.asarray(im).astype(np.uint8)
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # 발밑 그림자 등 라임빛 잔여물 제거 (하단 30% + 라임 특성 한정: 초록 캐릭터 보호)
    r16, g16, b16 = orig[..., 0].astype(int), orig[..., 1].astype(int), orig[..., 2].astype(int)
    limeish = (g16 > r16 + 8) & (g16 > b16 + 35) & (r16 > 105)
    band = np.zeros_like(bg)
    band[int(h * 0.70):, :] = True
    if pad >= 0:  # 레이어(pad<0)는 초록 잎·풀을 지키기 위해 건너뛴다
        alpha[limeish & band] = 0
    # 경계 1px 링: 반투명 + 초록 스필 제거
    n = bg.copy()
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        n |= np.roll(bg, (dy, dx), (0, 1))
    ring = n & ~bg
    alpha[ring] = 140
    if nogreen:
        # 초록이 없는 소품 전용: 배경에 번진 연두 빛·짙은 초록 그림자까지 초록 기운이 강한 픽셀은 모두 지운다
        greenness = g16 - np.maximum(r16, b16)
        alpha[greenness > 22] = 0
        soft = (greenness > 8) & (greenness <= 22)
        alpha[soft] = np.minimum(alpha[soft], 110)
    out = np.dstack([orig, alpha])
    g_cap = np.maximum(orig[..., 0], orig[..., 2])
    out[..., 1] = np.where(ring & (orig[..., 1] > g_cap), g_cap, out[..., 1])

    img = Image.fromarray(out)
    bbox = img.getbbox() if pad >= 0 else None  # pad<0: 레이어 — 트림 없이 무대 위치 유지
    if bbox:
        x0, y0, x1, y1 = bbox
        img = img.crop((max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)))
    img.save(dst)
    a = np.asarray(img)[..., 3]
    print(f'{dst}: {img.size[0]}x{img.size[1]} transparent={100*(a==0).mean():.0f}%')

if __name__ == '__main__':
    key(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 12,
        nogreen='--nogreen' in sys.argv)
