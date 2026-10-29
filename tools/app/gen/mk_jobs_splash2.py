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
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_splash2.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
