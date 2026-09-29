#!/usr/bin/env python3
"""테두리 플러드필 (pad<0이면 레이어 모드: 트림·하단 라임 정리 없음) 기반 배경 제거 → 투명 PNG (+트림, 경계 despill).
배경은 이미지 가장자리와 연결된 균일색이라는 가정. 캐릭터 내부 색은 건드리지 않는다.
사용: python3 chromakey.py in.png out.png [pad]"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def key_magenta(src, dst, pad=12):
    """마젠타 배경(초록 캐릭터용): 색 자체로 판정한다. 마젠타 정도 = min(R,B) - G.
    종이 질감·얼룩이 있어도 지워지고, 초록·분홍 볼은 남는다."""
    im = Image.open(src).convert('RGB')
    a = np.asarray(im).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.minimum(r, b) - g
    alpha = np.clip((70 - m) * 255 / 40, 0, 255)  # m>=70 완전 투명, m<=30 불투명, 사이는 부드럽게
    # 가장자리 마젠타 번짐 빼기: 빨강·파랑을 초록 쪽으로 당긴다
    spill = (m > 10) & (alpha > 0)
    out = a.copy()
    out[..., 0] = np.where(spill, np.minimum(r, g + 30), r)
    out[..., 2] = np.where(spill, np.minimum(b, g + 30), b)
    img = Image.fromarray(np.dstack([out, alpha]).astype(np.uint8))
    a_img = img.getchannel('A').point(lambda v: 255 if v > 200 else v)
    img.putalpha(a_img.filter(ImageFilter.MedianFilter(3)))
    bbox = img.getbbox()
    if bbox and pad >= 0:
        w, h = img.size; x0, y0, x1, y1 = bbox
        img = img.crop((max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)))
    img.save(dst)
    al = np.asarray(img)[..., 3]
    print(f'{dst}: {img.size[0]}x{img.size[1]} transparent={100*(al==0).mean():.0f}% (magenta)')


def key(src, dst, pad=12, thresh=45, nogreen=False):
    _c = Image.open(src).convert('RGB').getpixel((2, 2))
    if _c[0] > 180 and _c[2] > 180 and _c[1] < 110:
        return key_magenta(src, dst, pad)
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
    # 배경색이 마젠타면(초록 캐릭터용) 초록 정리 단계는 모두 건너뛴다
    cr, cg, cb = im.getpixel((2, 2))
    magenta_bg = cr > 180 and cb > 180 and cg < 110
    alpha = np.where(bg, 0, 255).astype(np.uint8)
    # 발밑 그림자 등 라임빛 잔여물 제거 (하단 30% + 라임 특성 한정: 초록 캐릭터 보호)
    r16, g16, b16 = orig[..., 0].astype(int), orig[..., 1].astype(int), orig[..., 2].astype(int)
    limeish = (g16 > r16 + 8) & (g16 > b16 + 35) & (r16 > 105)
    band = np.zeros_like(bg)
    band[int(h * 0.70):, :] = True
    if pad >= 0 and not magenta_bg:  # 레이어(pad<0)·마젠타 배경은 초록을 지키기 위해 건너뛴다
        alpha[limeish & band] = 0
    # 경계 1px 링: 반투명 + 초록 스필 제거
    n = bg.copy()
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        n |= np.roll(bg, (dy, dx), (0, 1))
    ring = n & ~bg
    alpha[ring] = 140
    if nogreen and not magenta_bg:
        # 초록이 없는 소품 전용: 배경에 번진 연두 빛·짙은 초록 그림자까지 초록 기운이 강한 픽셀은 모두 지운다
        greenness = g16 - np.maximum(r16, b16)
        alpha[greenness > 22] = 0
        soft = (greenness > 8) & (greenness <= 22)
        alpha[soft] = np.minimum(alpha[soft], 110)
    out = np.dstack([orig, alpha])
    g_cap = np.maximum(orig[..., 0], orig[..., 2])
    if magenta_bg:  # 가장자리 마젠타 번짐: 빨강·파랑을 초록 수준으로 낮춘다
        rb_cap = np.maximum(orig[..., 1], 60)
        out[..., 0] = np.where(ring & (orig[..., 0] > rb_cap + 40), rb_cap, out[..., 0])
        out[..., 2] = np.where(ring & (orig[..., 2] > rb_cap + 40), rb_cap, out[..., 2])
    else:
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
