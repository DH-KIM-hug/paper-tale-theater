#!/usr/bin/env python3
"""터널북 시작 화면 키아트 합성기.
사용: compose_keyart.py keyart/patjuk.json [--out DIR] [--no-install]
설정 JSON: tale, planes{sky,far,ground}, layouts{wide,tall}. 면 이미지는 GPU 산출물(재생성 없음),
인물은 게임 스프라이트. 결과: assets/thumbs/<tale>_key_wide.webp, <tale>_key_tall.webp (+ --out 에 PNG).
"""
import os, sys, json, argparse
import numpy as np
from PIL import Image, ImageFilter, ImageChops

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SHC = (70, 34, 20)

def ld(p): return Image.open(os.path.join(ROOT, p)).convert('RGBA')
def fit_w(im, w): return im.resize((max(1, int(w)), max(1, int(im.height * w / im.width))), Image.LANCZOS)
def fit_h(im, h): return im.resize((max(1, int(im.width * h / im.height)), max(1, int(h))), Image.LANCZOS)
def despill(im):
    """마젠타 키 잔여색(분홍 테두리)을 회색으로"""
    a = np.asarray(im).astype(np.int16); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = ((r - g) > 28) & ((b - g) > 18) & (b > 90)
    a[..., 0][m] = g[m]; a[..., 2][m] = g[m]
    return Image.fromarray(a.astype(np.uint8), 'RGBA')

def bbox_crop(im):
    b = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    return im.crop(b) if b else im

def grain(size, amp=7, seed=1):
    rng = np.random.default_rng(int(seed)); w, h = size
    n = rng.normal(0, 1, (h, w)).astype(np.float32)
    n = np.asarray(Image.fromarray(((n * 40) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.7))).astype(np.float32) - 128
    f = rng.normal(0, 1, (h // 8 + 1, w)).astype(np.float32)
    f = np.asarray(Image.fromarray(((f * 40) + 128).clip(0, 255).astype(np.uint8)).resize((w, h + 8), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.2)))[:h].astype(np.float32) - 128
    return (n * .35 + f * .45) * amp / 40.0

def apply_grain(im, amp=7, seed=1):
    a = np.asarray(im.convert('RGB')).astype(np.float32)
    g = grain(im.size, amp, seed)[..., None]
    return Image.fromarray((a + g * 2).clip(0, 255).astype(np.uint8)).convert('RGBA')

def paste_clip(c, im, xy):
    x, y = xy; W, H = c.size
    sx = max(0, -x); sy = max(0, -y); ex = min(im.width, W - x); ey = min(im.height, H - y)
    if ex > sx and ey > sy: c.alpha_composite(im.crop((sx, sy, ex, ey)), (x + sx, y + sy))

def drop(canvas, sprite, xy, off=(4, 8), blur=5, op=.5, thick=0):
    """스프라이트/면을 캔버스에 놓고 뒤 면에 부드러운 평행 그림자를 떨어뜨림"""
    x, y = int(xy[0]), int(xy[1]); a = sprite.getchannel('A')
    pad = int(blur * 3 + max(abs(off[0]), abs(off[1])) + thick + 4)
    lay = Image.new('RGBA', (sprite.width + 2 * pad, sprite.height + 2 * pad), (0, 0, 0, 0))
    am = Image.new('L', lay.size, 0); am.paste(a, (pad, pad))
    sh = ImageChops.offset(am, off[0], off[1]).filter(ImageFilter.GaussianBlur(blur)).point(lambda v: int(v * op))
    ct = ImageChops.offset(am, max(1, off[0] // 3), max(1, off[1] // 3)).filter(ImageFilter.GaussianBlur(1.2)).point(lambda v: int(v * op * .7))
    sh = ImageChops.lighter(sh, ct)
    lay.paste(Image.new('RGBA', lay.size, SHC + (255,)), (0, 0), sh)
    if thick:
        dk = Image.eval(sprite.convert('RGB'), lambda v: int(v * .72)).convert('RGBA'); dk.putalpha(a)
        for t in range(thick, 0, -1): lay.alpha_composite(dk, (pad + int(t * .5), pad + t))
    lay.alpha_composite(sprite, (pad, pad))
    paste_clip(canvas, lay, (x - pad, y - pad))

def extend_down(im, h):
    if im.height >= h: return im
    row = np.asarray(im.convert('RGB').crop((0, im.height - 6, im.width, im.height))).reshape(-1, 3)
    c = tuple(int(v) for v in np.median(row, axis=0))
    out = Image.new('RGBA', (im.width, h), (0, 0, 0, 0)); out.alpha_composite(im, (0, 0))
    out.alpha_composite(apply_grain(Image.new('RGBA', (im.width, h - im.height), c + (255,)), 5, 9), (0, im.height)); return out

def sprite_img(s, W, H):
    im = bbox_crop(ld(s['file']))
    if s.get('flip'): im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return fit_h(im, H * s['h']) if 'h' in s else fit_w(im, W * s['w'])

def band(cv, frac, strength):
    w, h = cv.size; b0 = int(h * (1 - frac)); y0 = b0 - h * .10
    t = np.clip((np.arange(h) - y0) / (h - y0), 0, 1) ** 1.2 * strength
    a = np.repeat(t[:, None], w, 1)
    ov = Image.new('RGBA', (w, h), (40, 18, 16, 255)); ov.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
    out = cv.copy(); out.alpha_composite(ov); return out

def compose(cfg, kind):
    L = cfg['layouts'][kind]; W, H = L['size']; P = cfg['planes']
    sky = ld(P['sky']); m = 22; sky = sky.crop((m, m, sky.width - m, sky.height - m))
    sc = max(W / sky.width, H / sky.height); s2 = sky.resize((int(sky.width * sc) + 1, int(sky.height * sc) + 1), Image.LANCZOS)
    ox = int((s2.width - W) * L['sky_x']); oy = int((s2.height - H) * L.get('sky_y', 0))
    cv = s2.crop((ox, oy, ox + W, oy + H)).convert('RGBA')
    def sheet(name, spec, shadow):
        im = despill(bbox_crop(ld(P[name]))); im = im.crop((8, 0, im.width - 8, im.height - 44)); im = fit_w(im, W * spec['w'])
        im = extend_down(im, int(H - H * spec['y']) + 12)
        x = -int((im.width - W) * spec['x']); drop(cv, im, (x, int(H * spec['y'])), *shadow)
    sheet('far', L['far'], ((5, 11), 7, .5))
    for s in L.get('behind', []):
        im = sprite_img(s, W, H); drop(cv, im, (W * s['x'] - im.width / 2, H * s['foot'] - im.height), (3, 6), 4, .5, 1)
    sheet('ground', L['ground'], ((6, 13), 8, .55))
    for s in L['sprites']:
        im = sprite_img(s, W, H); drop(cv, im, (W * s['x'] - im.width / 2, H * s['foot'] - im.height), (4, 8), 5, .5, 1)
    cv = apply_grain(cv, 6, 4)
    return band(cv, L['band'], L.get('band_strength', .45))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('config'); ap.add_argument('--out'); ap.add_argument('--no-install', action='store_true')
    a = ap.parse_args(); cfg = json.load(open(a.config))
    for kind in ('wide', 'tall'):
        im = compose(cfg, kind).convert('RGB')
        if a.out: os.makedirs(a.out, exist_ok=True); im.save(os.path.join(a.out, '%s_key_%s.png' % (cfg['tale'], kind)))
        if not a.no_install: im.save(os.path.join(ROOT, 'assets/thumbs/%s_key_%s.webp' % (cfg['tale'], kind)), quality=90, method=6)
        print(kind, im.size)

if __name__ == '__main__': main()
