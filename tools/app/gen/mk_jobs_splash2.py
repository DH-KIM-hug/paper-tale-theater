#!/usr/bin/env python3
"""새 스플래시(로고 안으로 들어갔다 나오기, 2026-10-29) 그림 작업표 → tools/app/gen/jobs_splash2.json
  python3 tools/app/gen/mk_jobs_splash2.py
  python3 tools/app/gen/run_simple.py splash2 sp2_curtain
  JOBS=splash2 ~/.venvs/paper-tale/bin/python tools/app/gen/post_svgfix.py
프롬프트 틀은 jobs_svgfix.json 소품 틀(SUBJECT만 바꿈). 참고 그림은 앱 아이콘(같은 커튼 종이)."""
import json, os
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
RAW = 'assets/raw/restyle/splash2'
base = next(x for x in json.load(open(f'{G}/tools/app/gen/jobs_svgfix.json')) if x['id'] == 'cm_chain')['prompt']
HEAD, rest = base.split('SUBJECT AND POSE:\n', 1)
TAIL = rest[rest.index('\n\nThis is an OBJECT'):].replace(
    'Square 1:1 image. The whole figure is visible and centred, filling about 80% of the frame.',
    'Tall portrait image. The whole object is visible and centred, filling about 92% of the frame height.')
jobs = [{
    'id': 'sp2_curtain', 'kind': 'sprite', 'aspect': 'portrait 2:3', 'refs': ['assets/brand/c2-icon.png'], 'size': [600, 1300],
    'out': f'{RAW}/sp2_curtain.png', 'final': 'assets/v3w/sp2_curtain.webp',
    'prompt': HEAD + 'SUBJECT AND POSE:\n' + (
        'An OBJECT: the LEFT half of a CLOSED theatre stage CURTAIN, hanging perfectly straight down, NOT tied back, NO tie-back band, NO rope, NO rod, NO valance. '
        'It is a tall panel made of 5 long vertical overlapping paper strips in the SAME reds as the curtain in the reference icon: tomato red (#E0563B), '
        'scarlet (#C8402E), deep bean red (#A93B32), alternating, each strip one flat colour, like soft vertical folds. '
        'The top edge is straight and flat. The bottom edge is straight with very gently rounded strip ends. The left edge is straight. '
        'The right edge (where it meets the other half) is a gently wavy vertical line. Tall and narrow, about twice as tall as wide.') + TAIL,
}, {
    'id': 'sp2_stage_hd', 'kind': 'bg', 'aspect': 'square 1:1', 'refs': ['assets/raw/restyle/splash2/refs/mark_ref.png'], 'size': [1536, 1536],
    'out': f'{RAW}/sp2_stage_hd.png', 'final': 'assets/v3w/sp2_stage_hd.webp',
    'prompt': ('The reference image is our app logo: a paper-art night theatre stage seen through an arched window. '
        'Recreate THE SAME PICTURE as a high-resolution, sharp, square image, as faithfully as possible: the SAME composition and proportions, '
        'the same red layered paper curtain on the left with its straw-gold tie-back band at the same height, the same cream paper moon hanging on a gold string '
        'from the top edge with the same soft warm glow, the same four gold paper stars in the same positions and sizes, the same navy paper sky, '
        'the same straw-gold scalloped stage edge and the same orange stage floor below it. '
        'Fill the WHOLE square: do NOT draw the arch shape, NO cream background, NO border, NO rounded corners, NO frame. '
        'The navy sky continues into the top corners, the curtain continues straight up to the top edge, the orange floor reaches the bottom edge and the side edges. '
        'Keep everything at the same place relative to each other; only extend the picture outward so the arch area is fully covered with a little margin. '
        'Matte hand-cut cardstock paper with visible fine paper fibres, flat single-colour pieces, short soft warm shadows under each cut edge. '
        'NO text, NO gloss, NO gradients inside paper pieces (only the moon glow), NO faces.'),
}]

# 2026-10-30 사용자 지시: 처음엔 커튼이 다 닫혀 있다가 열리며 낮 무대 → 해가 올라가고 달이 내려와 밤 → 커튼은 로고처럼 묶인 모양까지만 닫힘.
# 무대 배경은 커튼 없이(커튼은 따로 움직임), 해·달은 줄에 매달린 따로 된 소품.
STAGE_REF = 'assets/raw/restyle/splash2/sp2_stage_hd.png'
COMMON_BG = ('Fill the WHOLE square: NO arch shape, NO border, NO frame, NO curtain anywhere (the red curtain of the reference is REMOVED; '
    'the sky simply continues where it was). The straw-gold scalloped stage edge and the orange stage floor stay at EXACTLY the same height, size and shape as in the reference '
    'and now continue across the FULL width to both side edges. '
    'Matte hand-cut cardstock paper with visible fine paper fibres, flat single-colour pieces, short soft warm shadows under each cut edge. NO text, NO gloss, NO gradients, NO faces.')
jobs.append({'id': 'sp2_bg_night', 'kind': 'bg', 'aspect': 'square 1:1', 'refs': [STAGE_REF], 'size': [1536, 1536],
    'out': f'{RAW}/sp2_bg_night.png', 'final': 'assets/v3w/sp2_bg_night.webp',
    'prompt': ('The reference image is our paper-art night theatre stage. Recreate THE SAME stage, same framing and scale, as a high-resolution square image, '
        'but WITHOUT the moon and WITHOUT its string (the moon is added later as a separate piece): only the navy paper night sky (#1F2A56) with the same small gold paper stars '
        'in the same places, plus two more small stars on the left side. ' + COMMON_BG)})
jobs.append({'id': 'sp2_bg_day', 'kind': 'bg', 'aspect': 'square 1:1', 'refs': [STAGE_REF], 'size': [1536, 1536],
    'out': f'{RAW}/sp2_bg_day.png', 'final': 'assets/v3w/sp2_bg_day.webp',
    'prompt': ('The reference image is our paper-art night theatre stage. Recreate THE SAME stage, same framing and scale, as a high-resolution square image, but in DAYTIME: '
        'the sky is a soft light sky-blue paper (#9FD3EA) with three small simple white paper clouds (#F4F6FA) in the upper half, NO stars, NO moon, NO sun, NO string. ' + COMMON_BG)})
def prop(id, subject):
    jobs.append({'id': id, 'kind': 'sprite', 'aspect': 'portrait 2:3', 'refs': [STAGE_REF], 'size': [500, 1100],
        'out': f'{RAW}/{id}.png', 'final': f'assets/v3w/{id}.webp', 'prompt': HEAD + 'SUBJECT AND POSE:\n' + subject + TAIL})
prop('sp2_moon', 'An OBJECT: a theatre stage prop MOON: a round cream paper full-moon disc (#F6E7C1), exactly like the moon in the reference image, hanging from ONE long thin straight '
     'straw-gold (#D9A94E) paper string that goes straight up from the top of the disc to the very top edge of the image. The string is about 1.4 times as long as the disc diameter. NO glow, NO face, NO stars.')
prop('sp2_sun', 'An OBJECT: a theatre stage prop SUN: a round warm yellow paper disc (#F7C548) with a ring of short chunky triangular paper rays in orange (#F29F3D) around it, '
     'hanging from ONE long thin straight straw-gold (#D9A94E) paper string that goes straight up from the top of the rays to the very top edge of the image. '
     'The string is about 1.2 times as long as the sun diameter. NO face, NO eyes, NO mouth, NO glow.')
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_splash2.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
