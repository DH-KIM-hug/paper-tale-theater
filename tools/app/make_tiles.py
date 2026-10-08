"""홈 카드용 사각 종이 썸네일(assets/thumbs/<id>_tile.webp)을 만든다. 겹은 셋뿐: 색 종이 판 / 큰 언덕 한 장 / 인물(그림자).
  /Users/house_of_4k2b/.venvs/paper-tale/bin/python tools/app/make_tiles.py [id ...]
인물 = assets/v3w 의 게임 그림을 그대로 크게 쓴다. 배경은 납작한 색 면 둘."""
import os, sys, json
from PIL import Image, ImageDraw, ImageFilter, ImageChops
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
V3W = os.path.join(ROOT, 'assets', 'v3w'); OUT = os.path.join(ROOT, 'assets', 'thumbs')
W, H, R = 720, 540, 46
def hx(s): return tuple(int(s[i:i + 2], 16) for i in (1, 3, 5))

# id: (판 색, 언덕 색, 해·달(색, 가운데x, 가운데y, 반지름 — 화면 비율), [(그림, 가운데x, 높이 비율, 뒤집기)], 땅 높이 비율)
SPEC = {
 'patjuk':   ('#26325A', '#B9573A', ('#F6ECD8', .80, .22, .09), [('tiger_stand', .5, .72, 0)], .80),
 'frog':     ('#7FB7A4', '#4F8F6B', ('#F6ECD8', .22, .22, .08), [('frog_ox_stand', .62, .58, 0), ('frog_mom', .28, .56, 0)], .80),
 'rabbit':   ('#9CCB86', '#5E9A4F', ('#FFE08A', .84, .20, .09), [('rab_turtle_walk', .30, .34, 0), ('rab_rabbit_run', .66, .64, 0)], .78),
 'sunmoon':  ('#2E2F63', '#6E5DA8', ('#F6ECD8', .50, .26, .13), [('sm_moon_boy2', .27, .62, 0), ('sm_sun_girl2', .73, .62, 0)], .82),
 'sun_wind': ('#8FCBF0', '#6CA86A', ('#FFD35A', .80, .24, .12), [('sw_trav_walk', .40, .80, 0), ('sw_wind', .76, .30, 1)], .84),
 'turnip':   ('#F3D9A0', '#8B5E3C', None, [('tn_turnip', .34, .86, 0), ('tn_grandpa_stand', .74, .56, 0)], .82),
 'lion_mouse': ('#F2B35E', '#9A6A3C', ('#FFF1C8', .20, .22, .10), [('lm_lion_stand', .46, .82, 0), ('lm_mouse_walk', .86, .22, 1)], .84),
 'fox_crane': ('#7FB79A', '#C9824E', None, [('fc_fox_stand', .32, .62, 0), ('fc_crane_sad', .74, .84, 1)], .84),
 'goldilocks': ('#F2C9A0', '#7BA36B', ('#FFF1C8', .80, .22, .09), [('gl_goldi_walk', .34, .84, 0), ('gl_bear_baby', .72, .70, 0)], .84),
 'bremen':   ('#24305C', '#4B6A8A', ('#F6ECD8', .78, .24, .10), [('br_donkey', .26, .80, 0), ('br_dog_sing5', .55, .54, 0), ('br_cat_sing', .76, .34, 0), ('br_rooster', .90, .42, 0)], .84),
 'ant_grasshopper': ('#F2D06B', '#5E9A4F', ('#FFF6D8', .82, .20, .10), [('ag_ant_stand', .30, .66, 0), ('ag_hopper_play', .72, .70, 1)], .84),
 'ugly_duckling': ('#9CC8E6', '#5E8FB4', ('#FFF6D8', .84, .20, .08), [('ud_young', .30, .56, 0), ('ud_swan', .70, .80, 0)], .84),
 'three_pigs': ('#F3C6B0', '#8BB06A', ('#FFF1C8', .82, .20, .09), [('tp_pig1_base', .22, .66, 0), ('tp_pig2_base', .50, .70, 0), ('tp_pig3_base', .78, .74, 0)], .86),
 'wolf_goats': ('#AFC8A0', '#6B8E5B', ('#F6ECD8', .20, .22, .09), [('wg_kid1_joy', .26, .56, 0), ('wg_mama_warn', .58, .78, 0), ('wg_wolf_knock', .86, .62, 1)], .86),
 'red_hood': ('#E8A596', '#5E8F5B', ('#FFF1C8', .82, .20, .09), [('rh_hood_walk', .36, .86, 0), ('rh_wolf_peek', .78, .62, 1)], .86),
}

def shadow(im, dx=0, dy=10, blur=12, op=.30):
    a = im.getchannel('A').filter(ImageFilter.GaussianBlur(blur)); a = a.point(lambda v: int(v * op))
    s = Image.new('RGBA', im.size, (20, 24, 50, 0)); s.putalpha(a)
    out = Image.new('RGBA', (im.width + 2 * abs(dx) + 4 * blur, im.height + dy + 4 * blur), (0, 0, 0, 0))
    return s, out

def tile(tid):
    pan, hill, orb, chars, ground = SPEC[tid]
    img = Image.new('RGBA', (W, H), hx(pan) + (255,))
    d = ImageDraw.Draw(img)
    # 언덕: 가장자리까지 번지는 큰 곡선 한 장
    gy = int(H * ground)
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
    ld.ellipse((-W * .35, gy - H * .14, W * 1.35, H * 1.5), fill=hx(hill) + (255,))
    sh = lay.getchannel('A').filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * .22))
    shl = Image.new('RGBA', (W, H), (20, 24, 50, 0)); shl.putalpha(ImageChops.offset(sh, 0, -6))
    img.alpha_composite(shl); img.alpha_composite(lay)
    if orb:
        col, ox, oy, orad = orb; r = int(W * orad)
        o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(o).ellipse((ox * W - r, oy * H - r, ox * W + r, oy * H + r), fill=hx(col) + (255,))
        img.alpha_composite(o)
    base = int(H * (ground + .09))   # 인물 발 밑
    for fn, cx, hh, flip in chars:
        c = Image.open(os.path.join(V3W, fn + '.webp')).convert('RGBA')
        bb = c.getchannel('A').getbbox(); c = c.crop(bb)
        h = int(H * hh); w = int(c.width * h / c.height)
        if w > W * .62: w = int(W * .62); h = int(c.height * w / c.width)
        c = c.resize((w, h), Image.LANCZOS)
        if flip: c = c.transpose(Image.FLIP_LEFT_RIGHT)
        x = int(cx * W - w / 2); y = base - h
        a = c.getchannel('A').filter(ImageFilter.GaussianBlur(9)).point(lambda v: int(v * .34))
        s = Image.new('RGBA', c.size, (20, 24, 50, 0)); s.putalpha(a)
        img.alpha_composite(s, (x + 4, y + 12) if x + 4 >= 0 and y + 12 >= 0 else (max(x, 0), max(y, 0)))
        img.alpha_composite(c, (x, y)) if x >= 0 and y >= 0 else img.paste(c, (x, y), c)
    mask = Image.new('L', (W, H), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, W - 1, H - 1), R, fill=255)
    img.putalpha(ImageChops.multiply(img.getchannel('A'), mask))
    img.save(os.path.join(OUT, tid + '_tile.webp'), quality=88, method=6)

ids = sys.argv[1:] or list(SPEC)
for t in ids:
    tile(t); print('ok', t)
open(os.path.join(OUT, 'tiles.js'), 'w').write('/* tools/app/make_tiles.py 가 생성: 사각 종이 썸네일(<id>_tile.webp)이 있는 동화 */\nwindow.TILES = ' + json.dumps(sorted(SPEC)) + ';\n')
