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

def edge_light(im, px=2, mix=.55):
    """면 가장자리 안쪽 px 두께를 밝은 종이색으로 (잘린 종이 단면)"""
    a = im.getchannel('A'); er = a.filter(ImageFilter.MinFilter(2 * px + 1))
    ring = ImageChops.subtract(a, er).point(lambda v: 255 if v > 40 else 0)
    cr = Image.new('RGBA', im.size, (255, 243, 220, 255))
    lit = Image.blend(im, cr, mix); lit.putalpha(a)
    out = im.copy(); out.paste(lit, (0, 0), ring); return out

def sheet_drop(cv, im, xy, shadow):
    drop(cv, edge_light(im), xy, *shadow)

def maple(size, col, rot=0, seed=1):
    import math, random
    rng = random.Random(seed); S = int(size); c = S / 2
    pts = []
    tips = 5
    for k in range(tips):
        ang = math.radians(-90 + k * 72 + rng.uniform(-6, 6)); rr = 1.0 if k != 0 else 1.0
        if k in (1, 4): rr = .88
        if k in (2, 3): rr = .72
        for da, rv in ((-24, .46), (-9, .70 * rr), (0, rr), (9, .70 * rr)):
            a2 = ang + math.radians(da); pts.append((c + math.cos(a2) * rv * c * .95, c + math.sin(a2) * rv * c * .95))
        a3 = ang + math.radians(36); pts.append((c + math.cos(a3) * .40 * c, c + math.sin(a3) * .40 * c))
    m = Image.new('L', (S * 2, S * 2), 0); from PIL import ImageDraw
    d = ImageDraw.Draw(m); d.polygon([(x * 2, y * 2) for x, y in pts], fill=255)
    d.line([(c * 2, c * 2), (c * 2, (c + c * .98) * 2)], fill=255, width=max(6, S // 22))
    m = m.resize((S, S), Image.LANCZOS)
    im = Image.new('RGBA', (S, S), tuple(col) + (255,)); im.putalpha(m)
    vein = Image.new('L', (S * 2, S * 2), 0); vd = ImageDraw.Draw(vein)
    for k in range(tips):
        ang = math.radians(-90 + k * 72); vd.line([(c * 2, c * 2), (c * 2 + math.cos(ang) * c * 1.3, c * 2 + math.sin(ang) * c * 1.3)], fill=255, width=3)
    vein = vein.resize((S, S), Image.LANCZOS).point(lambda v: int(v * .30))
    dk = Image.new('RGBA', (S, S), (60, 20, 10, 255)); dk.putalpha(ImageChops.multiply(vein, m))
    im.alpha_composite(dk)
    im = apply_grain(im, 5, seed); im.putalpha(m)
    return im.rotate(rot, resample=Image.BICUBIC, expand=True)

def blade(h, w, col, rot=0, seed=1):
    from PIL import ImageDraw
    m = Image.new('L', (w * 2, h * 2), 0)
    ImageDraw.Draw(m).polygon([(0, h * 2), (w * 2, h * 2), (w * 1.35, h * .45), (w * .8, 0)], fill=255)
    m = m.resize((w, h), Image.LANCZOS)
    im = Image.new('RGBA', (w, h), tuple(col) + (255,)); im.putalpha(m)
    im = apply_grain(im, 5, seed); im.putalpha(m)
    return im.rotate(rot, resample=Image.BICUBIC, expand=True)

def place_leaf(cv, L, W, H, shadow=((6, 11), 8, .42)):
    sz = H * L['s']
    im = maple(sz, L['col'], L.get('rot', 0), L.get('seed', 1)) if L.get('kind', 'maple') == 'maple' else blade(int(sz), int(sz * L.get('aspect', .28)), L['col'], L.get('rot', 0), L.get('seed', 1))
    drop(cv, edge_light(im, 1, .35), (W * L['x'] - im.width / 2, H * L['y'] - im.height / 2), *shadow)

def torn_poly(W, H, box, n, seed, rough, extra=0):
    rng = np.random.default_rng(seed)
    x0, y0, x1, y1 = [box[0] * W, box[1] * H, box[2] * W, box[3] * H]
    cx, cy, a, b = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2
    N = 1800; t = np.linspace(0, 2 * np.pi, N, endpoint=False)
    co, si = np.cos(t), np.sin(t)
    px = np.sign(co) * np.abs(co) ** (2 / n); py = np.sign(si) * np.abs(si) ** (2 / n)
    coarse = sum(rng.uniform(.4, 1) * np.sin(k * t + rng.uniform(0, 6.28)) / k for k in range(2, 9)) * rough
    walk = np.cumsum(rng.normal(0, 1, N)); walk -= np.linspace(walk[0], walk[-1], N); 
    k = np.ones(25) / 25; walk = np.convolve(np.r_[walk[-24:], walk, walk[:24]], k, 'same')[24:-24]
    fine = rng.normal(0, 1, N); fine = np.convolve(np.r_[fine[-4:], fine, fine[:4]], np.ones(5) / 5, 'same')[4:-4]
    jit = coarse * min(a, b) * .035 + walk / max(1, np.abs(walk).max()) * 10 + fine * 2.4 + extra
    ex = px * a + co * jit; ey = py * b + si * jit
    return [(cx + ex[i], cy + ey[i]) for i in range(N)]

def front_sheet(cv, F, W, H):
    from PIL import ImageDraw
    sheetc = solid_rgba((W, H), tuple(F['color']), 7)
    hole = Image.new('L', (W * 2, H * 2), 0)
    ImageDraw.Draw(hole).polygon([(x * 2, y * 2) for x, y in torn_poly(W, H, F['hole'], F.get('n', 4), F.get('seed', 5), F.get('rough', 1.0))], fill=255)
    hole = hole.resize((W, H), Image.LANCZOS)
    rim = Image.new('L', (W * 2, H * 2), 0)
    ImageDraw.Draw(rim).polygon([(x * 2, y * 2) for x, y in torn_poly(W, H, F['hole'], F.get('n', 4), F.get('seed', 5), F.get('rough', 1.0), extra=5.5)], fill=255)
    rim = rim.resize((W, H), Image.LANCZOS)
    alpha = ImageChops.invert(rim)
    front = sheetc.copy(); front.putalpha(alpha)
    # 찢긴 종이 속살(연한 띠): 구멍 가장자리 바깥 3~6px
    core = Image.new('RGBA', (W, H), (246, 226, 188, 255)); ring = ImageChops.subtract(rim, hole)
    am = ImageChops.invert(hole)
    # 장면 위로 앞 종이가 드리우는 그림자
    sh = ImageChops.offset(am, 9, 16).filter(ImageFilter.GaussianBlur(15)).point(lambda v: int(v * .45))
    cv.paste(Image.new('RGBA', (W, H), SHC + (255,)), (0, 0), sh)
    ct = ImageChops.offset(am, 2, 4).filter(ImageFilter.GaussianBlur(1.6)).point(lambda v: int(v * .45))
    cv.paste(Image.new('RGBA', (W, H), SHC + (255,)), (0, 0), ct)
    cv.paste(core, (0, 0), ring)
    cv.alpha_composite(front)
    return cv

def solid_rgba(size, col, seed): return apply_grain(Image.new('RGBA', size, tuple(col) + (255,)), 6, seed)

def sky_tint(im, top, bot):
    a = np.asarray(im.convert('RGB')).astype(np.float32); h = a.shape[0]
    t = np.linspace(0, 1, h)[:, None, None] ** .85
    g = (np.array(top, np.float32) * (1 - t) + np.array(bot, np.float32) * t) / 255.0
    return Image.fromarray((a * g).clip(0, 255).astype(np.uint8)).convert('RGBA')

def strip_plane(cv, S, W, H):
    from PIL import ImageDraw
    rng = np.random.default_rng(S.get('seed', 3)); xs = np.arange(W + 1)
    y = H * S['y'] + sum(rng.uniform(.5, 1) * 14 * np.sin(xs / W * 6.28 * f + rng.uniform(0, 6.28)) for f in (.8, 1.7, 3.1))
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([(0, H)] + [(int(x), float(y[x])) for x in xs] + [(W, H)], fill=255)
    im = solid_rgba((W, H), S['color'], 11); im.putalpha(m)
    sheet_drop(cv, im, (0, 0), ((6, 14), 13, .42))

def compose(cfg, kind):
    L = cfg['layouts'][kind]; W, H = L['size']; P = cfg['planes']
    sky = ld(P['sky']); m = 22; sky = sky.crop((m, m, sky.width - m, sky.height - m))
    sc = max(W / sky.width, H / sky.height); s2 = sky.resize((int(sky.width * sc) + 1, int(sky.height * sc) + 1), Image.LANCZOS)
    ox = int((s2.width - W) * L['sky_x']); oy = int((s2.height - H) * L.get('sky_y', 0))
    cv = s2.crop((ox, oy, ox + W, oy + H)).convert('RGBA')
    if 'sky_tint' in cfg: cv = sky_tint(cv, *cfg['sky_tint'])
    PS = ((8, 15), 14, .42)
    def sheet(name, spec):
        im = despill(bbox_crop(ld(P[name]))); im = im.crop((8, 0, im.width - 8, im.height - 44)); im = fit_w(im, W * spec['w'])
        im = extend_down(im, int(H - H * spec['y']) + 12)
        x = -int((im.width - W) * spec['x']); sheet_drop(cv, im, (x, int(H * spec['y'])), PS)
    sheet('far', L['far'])
    for s in L.get('behind', []):
        im = sprite_img(s, W, H); drop(cv, im, (W * s['x'] - im.width / 2, H * s['foot'] - im.height), (5, 10), 8, .4, 1)
    sheet('ground', L['ground'])
    for s in L['sprites']:
        im = sprite_img(s, W, H); drop(cv, im, (W * s['x'] - im.width / 2, H * s['foot'] - im.height), (6, 12), 9, .42, 1)
    if 'strip' in L:
        strip_plane(cv, L['strip'], W, H)
        for lf in L['strip'].get('leaves', []): place_leaf(cv, lf, W, H)
    if 'front' in L:
        front_sheet(cv, L['front'], W, H)
        for lf in L['front'].get('leaves', []): place_leaf(cv, lf, W, H)
    for lf in L.get('fg_leaves', []): place_leaf(cv, lf, W, H, ((8, 15), 11, .45))
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
