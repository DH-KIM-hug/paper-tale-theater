#!/usr/bin/env python3
"""홈 배너 위에 얹는 동화 제목 레터링(투명 PNG) 잡을 jobs_title.json 에 만든다 — 2026-10-30 사용자: 동화 이름을 다 레터링으로.
그림에 글자를 굽지 않고 따로 얹는다(기기마다 배너를 다르게 자르고, 영어 모드가 있어서). 글꼴 느낌은 실제 로고(assets/v3w/sp_logo_c2_b_light_v1.webp: 굵고 반듯한 기하 고딕)와 한 식구로 — 붓 레터링 아님(사용자 지적 2026-10-30).
  python3 tools/app/gen/mk_jobs_title.py && python3 tools/app/gen/run_simple.py title title_patjuk ..."""
import json, os, re
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
src = open(f'{G}/tales/catalog.js', encoding='utf-8').read()
T = re.findall(r"\{ id: '(\w+)', title: '([^']+)'", src)

P = """Use case: logo-brand
Asset type: transparent production Korean hand-lettered story title for a children's picture-book app, placed in white over a colourful paper-art banner picture.
Text verbatim, exactly these Hangul syllables and spaces, no other text: "{title}".
Primary request: a title lettering in the SAME family as the app's logo wordmark "톡톡 동화극장": a heavy, chunky, geometric Korean display lettering — extra-bold even-weight strokes with no thick/thin modulation, straight horizontal and vertical stems, slightly softened square corners, compact sturdy syllable blocks, tight but clear spacing. Friendly and modern like a children's app logo, NOT brush, NOT calligraphy, NOT handwritten. Give it a little picture-book charm through proportions only (slightly playful syllable sizes and a lively baseline), never through decorations. {lines}
Colour: solid warm white (#FFFCF5) only, one flat colour. Every syllable clear and spelled correctly, with natural Hangul proportions; don't split 받침 far from the body.
Style: flat solid shapes, crisp finished edges, open counters, bold enough to read at small size over a picture. No grunge. No floating dots, decorations, icons, sparkles, characters or frames. No 3D, bevel, emboss, shadows, gradients, outlines or puffiness.
Composition: left-aligned title that fills the canvas with modest transparent margins. TRUE transparent background and transparent counters. One final title only."""

jobs = []
for t, title in T:
    n = len(title.replace(' ', ''))
    lines = ('Set it on one line.' if n <= 6 else
             'Set it on two left-aligned lines, breaking only at a space, the first line slightly larger.')
    jobs.append({'id': f'title_{t}', 'kind': 'sprite', 'aspect': 'landscape 3:2', 'out': f'assets/raw/title/{t}_title.png', 'refs': [],
                 'prompt': P.format(title=title, lines=lines)})
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_title.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
