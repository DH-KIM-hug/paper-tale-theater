#!/usr/bin/env python3
"""반대 모습 표지 그림 작업표 (2026-11-24 사용자 결정): 홈 카드·타일·배너·책 표지(_key_*)·끝 화면(_back_*)을
주인공 모습에 맞춘 그림으로. tools/app/gen/jobs_look_cover.json 을 만든다.
  python3 tools/app/gen/mk_jobs_look_cover.py
  python3 tools/app/gen/run_simple.py look_cover <id ...>
  python3 tools/app/gen/post_look_cover.py            # 원본 → 앱용 webp(원래 그림과 같은 크기·폴더)

- 유니콘·사탕 마녀(A 남자아이판)·빨간 자동차(B 여자아이판): 원래 그림을 참고 1로, 반대 모습 자세 그림을 참고 2·3으로 넣어 아이만 바꾼다.
- 구름 공장: 아이 셋을 지운 배경판(_base). 아이는 앱이 자세 그림을 얹어 합성한다(engine/names.js COVER_KIDS).
- refs 는 앱 그림만(실제 아이 사진 금지). 제목 글씨는 따로 겹치는 층(_lt, _title)이라 그림에 글자를 넣지 않는다."""
import json, os, sys
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from restyle import STYLE, LIGHT, NO, HEAD

RAW = 'assets/raw/look_cover'
SPOTS = {  # 자리 → (앱 파일, 생성 비율)
    'card': ('assets/thumbs/{t}_card.webp', 'landscape 4:3'),
    'tile': ('assets/thumbs/{t}_tile.webp', 'landscape 4:3'),
    'banner': ('assets/banner/{t}.webp', 'landscape 16:9'),
    'key_wide': ('assets/thumbs/{t}_key_wide.webp', 'landscape 16:9'),
    'key_tall': ('assets/thumbs/{t}_key_tall.webp', 'portrait 3:4'),
    'back_wide': ('assets/thumbs/{t}_back_wide.webp', 'landscape 3:2'),
    'back_tall': ('assets/thumbs/{t}_back_tall.webp', 'portrait 4:5 (nearly square, slightly taller than wide)'),
}
KID = {
    'unicorn': ('the little girl (brown bob hair, small gold crown, pink puffy-sleeve dress with yellow stars, red shoes)',
                'a little BOY: short dark-brown boy\'s haircut with a short fringe (NOT a bob), the same small gold crown, a snow-white short-sleeve shirt, '
                'sky-blue shorts, a short cobalt-blue cape with yellow stars and a gold clasp, white socks, red shoes — exactly as in references 2 and 3',
                'Ab'),
    'witch_candy': ('the little girl witch (brown bob hair under a purple star witch hat, purple cape with an orange bow, cream dress, orange-striped stockings, red shoes)',
                    'a little BOY witch: short brown boy\'s haircut (NOT a bob, no hair below the ears) under the same purple star witch hat, the same purple cape '
                    'with the orange bow, the same cream tunic, orange-striped stockings and red shoes — exactly as in references 2 and 3',
                    'Ab'),
    'red_car': ('the little boy (short hair)',
                'a little GIRL: black bob hair with a straight fringe and a small pink bow on one side, the same simple cut-paper face style — exactly as in references 2 and 3; '
                'keep the same clothes colours as the boy in reference 1 (only the hair and face change)',
                'Bg'),
}
REFS = {  # (동화, 자리) → 아이 참고 그림 둘
    'unicorn': {'card': ['uc_kid2b_wave', 'uc_kid2b_stand'], 'tile': ['uc_kid2b_wave', 'uc_kid2b_stand'], 'banner': ['uc_kid2b_walk', 'uc_kid2b_stand'],
                'key_wide': ['uc_cut2b_hug', 'uc_kid2b_hug'], 'key_tall': ['uc_cut2b_hug', 'uc_kid2b_hug'],
                'back_wide': ['uc_kid2b_walk', 'uc_kid2b_wave'], 'back_tall': ['uc_kid2b_walk', 'uc_kid2b_wave']},
    'witch_candy': {'card': ['wc_kidb_stand', 'wc_kidb_yum'], 'tile': ['wc_kidb_stand', 'wc_kidb_yum'], 'banner': ['wc_kidb_reach', 'wc_kidb_stand'],
                    'key_wide': ['wc_kidb_reach', 'wc_kidb_stand'], 'key_tall': ['wc_kidb_reach', 'wc_kidb_stand'],
                    'back_wide': ['wc_cutb_parade', 'wc_kidb_stand'], 'back_tall': ['wc_cutb_parade', 'wc_kidb_stand']},
    'red_car': {'banner': ['rc_childg_stand', 'rc_childg_point'], 'back_wide': ['rc_childg_hug', 'rc_childg_run'], 'back_tall': ['rc_childg_hug', 'rc_childg_run']},
}
SPOT_LIST = {'unicorn': list(SPOTS), 'witch_candy': list(SPOTS), 'red_car': ['banner', 'back_wide', 'back_tall'], 'kkultteok': list(SPOTS)}

def ref_png(path):
    """앱 webp → 참고용 png (assets/raw/look_cover/_refs/)"""
    from PIL import Image
    d = os.path.join(G, RAW, '_refs'); os.makedirs(d, exist_ok=True)
    out = os.path.join(d, os.path.basename(path)[:-5] + '.png')
    if not os.path.exists(out):
        im = Image.open(os.path.join(G, path))
        if im.mode == 'RGBA':  # 투명 자세 그림은 연회색 바탕에
            bg = Image.new('RGBA', im.size, (225, 225, 225, 255)); bg.alpha_composite(im); im = bg
        im.convert('RGB').save(out)
    return os.path.relpath(out, G)

PAPER = ('PAPER RULES: every paper piece is ONE flat matte colour, NO gloss, NO gradient inside a piece, NO outlines, NO white borders; '
         'depth only by narrow dark warm (#2E241C) shadows between stacked paper layers. NO text, NO letters, NO title, NO watermark.')

def swap_prompt(t, spot):
    old, new, _ = KID[t]
    return '\n\n'.join([
        HEAD,
        'EDIT TASK — redraw reference image 1 almost exactly. Reference 1 is the finished artwork. Keep EXACTLY the same framing, composition, '
        'background, frame or paper border (if any), every animal, character, object and decoration in the same position, size, pose and colours, '
        'and the same empty areas.',
        f'THE ONLY CHANGE: replace {old} with {new}. The child keeps EXACTLY the same position, pose, gesture, facing direction (left/right), '
        'expression, and the same size in the picture (same head width, same height, 2.5-head proportions; 머리·몸 크기를 기준 그림과 똑같이). '
        'Hands touch the same things as in reference 1. A generic storybook child, NOT any real child.',
        STYLE, PAPER, LIGHT, NO])

def base_prompt(spot):
    return '\n\n'.join([
        HEAD,
        'EDIT TASK — redraw reference image 1 almost exactly, but WITHOUT the three children. Keep EXACTLY the same framing, composition, '
        'background, frame or paper border (if any), the dog (same position, size, pose, colours, blue harness), and every object and decoration.',
        'REMOVE all three children completely (no bodies, no hands, no hair, no shadows of them). Where they stood, continue the background '
        'naturally (sky, clouds, hills, grass, flowers) as flat cut paper, leaving open ground where children could stand. '
        'Do not add any new character, animal or object. If a child was overlapping the dog, complete the dog\'s hidden parts simply.',
        STYLE, PAPER, LIGHT, NO])

jobs = []
for t, spots in SPOT_LIST.items():
    for spot in spots:
        app, asp = SPOTS[spot]; app = app.format(t=t)
        from PIL import Image
        size = Image.open(os.path.join(G, app)).size
        base = os.path.basename(app)[:-5]
        if t == 'kkultteok':
            nid = f'{base}_base'; refs = [ref_png(app)]; pr = base_prompt(spot)
        else:
            nid = f'{base}_{KID[t][2]}'
            refs = [ref_png(app)] + [ref_png(f'assets/v3w/{r}.webp') for r in REFS[t][spot]]
            pr = swap_prompt(t, spot)
        for r in refs: assert '.paper-tale' not in r and '/refs/family' not in r
        jobs.append({'id': nid, 'kind': 'cover', 'refs': refs, 'size': list(size), 'aspect': asp, 'src': app,
                     'app': os.path.join(os.path.dirname(app), nid + '.webp'), 'out': f'{RAW}/{nid}.png', 'prompt': pr})
json.dump(jobs, open(os.path.join(G, 'tools/app/gen/jobs_look_cover.json'), 'w'), ensure_ascii=False, indent=1)
for j in jobs: print(j['id'], j['size'], j['app'])
