#!/usr/bin/env python3
"""창작 동화 3편 잠자리 장면(2026-11-01 사용자 결정) 그림 작업표: 구름 공장·나의 빨간 자동차·유니콘을 찾아서.
장면 = 큰 그림 한 장(가로 16:9 · 세로 2:3 따로) + 움직이는 조각. 기존 같은 동화 컷 프롬프트의 STYLE·조명 문단을 그대로 이어 쓰고 MOMENT 만 바꾼다.
  python3 tools/app/gen/mk_jobs_bedtime.py  → jobs_kkultteok/red_car/unicorn.json 에 bed_* job 을 넣거나 고친다"""
import json, os, re
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
J = lambda t: os.path.join(G, f'tools/app/gen/jobs_{t}.json')

def base(t, i):
    return {x['id']: x for x in json.load(open(J(t)))}[i]['prompt']

def scene_prompt(tpl, moment, bg, shape, night_light):
    p = tpl
    p = re.sub(r'Create a (wide 16:9|4:3) comic-panel moment for a picture book[^\n]*', f'Create one {shape} full-screen picture-book illustration (a quiet bedtime scene, not a comic panel), rendered entirely as handcrafted paper art: every element is cut from matte colored cardstock and fine-grain craft paper.', p)
    p = re.sub(r'MOMENT:\n.*?\n\n', 'MOMENT:\n' + moment + '\n\n', p, flags=re.S)
    p = re.sub(r'PANEL BACKGROUND:\n.*?\n\n', 'SCENE:\n' + bg + '\n\n', p, flags=re.S)
    p = p.replace('NO gradients.', 'NO gradients inside paper pieces (the ONLY soft gradients allowed are light: moonlight falling through the window and a faint glow around light sources, as a separate light layer over the paper).')
    p = re.sub(r'LIGHTING:\n.*?\n\n', 'LIGHTING:\n' + night_light + '\n\n', p, flags=re.S)
    p = p.replace('Warm, tactile, whimsical', 'Calm, sleepy, cosy, tactile, whimsical')
    return p + '\nQuiet and calm: no speed lines, no burst strips, no confetti, no motion marks.\n'

NIGHT = ('A calm night interior: the room is dim deep-blue paper night, lit softly by pale cream moonlight from the window (light source at the upper right). '
         'Shadows are short, soft paper-layer shadows falling toward the LOWER LEFT, identical in direction on every piece. Keep faces and the sleeping characters clearly readable, not too dark.')
RICH = ('Make the room rich and colourful with many stacked flat paper layers (12-18 papers): deep-indigo #1F2A56 and midnight navy #141B3D night wall and sky, dusk violet #5B4E8C, '
        'moon cream #F6ECD8, moon gold #F6D27A, a patchwork quilt of persimmon #E8703A, straw gold #D9A94E, sky blue #3E7CB1, pine green #3F6B4F, blush pink #F3A9BE and plum #7B4F8C, '
        'bark-brown #6B4A32 wooden bed and floor, a soft rug — every piece one flat solid colour. '
        'NO stuffed toys, NO dolls, NO teddy bears, NO animal-shaped toys or pictures with faces anywhere in the room: only the named characters have faces.')

jobs = {}
# ── 구름 공장 ──
KT = base('kkultteok', 'cut_hug')
KREF = ['assets/raw/char_gpt/kkultteok/nuna_lookup_v2.png', 'assets/raw/char_gpt/kkultteok/oppa_lookup.png', 'assets/raw/char_gpt/kkultteok/agi_lookup.png', 'assets/raw/char_gpt/kkultteok/dog_lookup.png']
K_M = ('Bedtime in the children\'s bedroom at night. The twins Dahyun and Ihyun and little Eunwoo lie side by side in ONE wide wooden bed under ONE big patchwork quilt pulled up to their chins: '
       'three heads on three pillows, eyes closed in sleepy curves, small peaceful closed-mouth smiles, hair exactly as in their reference sprites (only heads, a little of the shoulders and the quilt show). '
       'The small dog Kkulddeok sleeps curled into a round ball on top of the quilt at the foot of the bed, eyes closed, same colours and markings as its reference. '
       'A big window shows the night sky with ONE large round cream full moon fully visible inside the window with clear empty dark sky around it (NOTHING covers the moon — no cloud, no branch) and a few tiny paper stars. '
       'A pale cream wedge of moonlight falls from the window across the quilt. No other people.')
jobs['kkultteok'] = [
    dict(id='cf4_bed_wide', kind='scene', aspect='landscape 16:9', refs=KREF, out='assets/raw/cut_gpt/kkultteok/cf4_bed_wide.png',
         prompt=scene_prompt(KT, K_M + ' COMPOSITION (16:9): the bed with the children fills the left and centre; the window with the moon is in the upper RIGHT third; everything important stays inside the frame with a margin.', RICH + ' A small shelf with a toy, curtains of sky blue tied at the sides of the window, a round rug.', '16:9 landscape', NIGHT)),
    dict(id='cf4_bed_tall', kind='scene', aspect='portrait 2:3', refs=KREF + ['assets/raw/cut_gpt/kkultteok/cf4_bed_wide.png'], out='assets/raw/cut_gpt/kkultteok/cf4_bed_tall.png',
         prompt=scene_prompt(KT, K_M + ' COMPOSITION (2:3 portrait): the SAME room as the last reference image, recomposed vertically: the window with the moon in the upper part (centred), the bed with the three children and the dog in the lower half, everything important inside the central 60% of the width.', RICH, '2:3 portrait', NIGHT)),
    dict(id='cf4_baby_sleep', kind='sprite', refs=['assets/raw/char_gpt/kkultteok/baby_white.png'], out='assets/raw/char_gpt/kkultteok/cf4_baby_sleep.png',
         prompt=base('kkultteok', 'baby_white').replace('Beaming smile, floating happily, two tiny paper sparkles beside it.',
            'Sleepy: lying stretched out sideways like a soft little pillow, eyes closed in two calm sleepy curves, a tiny content smile, no sparkles. Same white paper puffs and same face style as the reference image.')),
]
# ── 나의 빨간 자동차 ──
RT = base('red_car', 'rc_cut_hug')
RDIR = 'assets/raw/restyle/red_car/'
RREF = [RDIR + 'rc_child_bed.png', RDIR + 'rc_tow_joy.png', RDIR + 'rc_police_run.png', RDIR + 'rc_fire_run.png', RDIR + 'rc_amb_run.png']
R_M = ('Bedtime in Ihyun\'s bedroom at night (the same room as by day: wooden bed with a sky-blue quilt, pink curtains, a bookshelf, a round teal rug — now at night). '
       'Ihyun sleeps in the bed under the quilt, eyes closed in sleepy curves, a small smile, holding the little red toy car snugly in one hand on top of the quilt (the red car\'s two dot eyes are closed too). '
       'Beside the bed on the floor stands a toy garage made from a shoebox (a plain kraft-brown cardboard box lying on its side with the open side facing us, NO face, no letters), '
       'and inside it the four toy vehicles are parked side by side facing us, nose out, each with eyes closed in sleepy curves: the orange tow truck, the police car, the fire truck and the ambulance. '
       'Every vehicle has ONE small round cream headlight clearly visible at its front. The window shows the night sky with a cream moon and tiny stars. ')
R_V = ('the toy police car: a rounded white body with one wide deep-indigo stripe, cream window strip, small roof light bar (one red, one blue lamp), deep-indigo wheels. '
       'the toy fire truck: long boxy deep-red body with one white stripe, white paper ladder flat on the roof. the toy ambulance: tall boxy white body with a deep red cross. '
       'the toy tow truck: sturdy boxy persimmon-orange body with a bark-brown crane arm. Each vehicle: two dot eyes only (closed sleepy curves here), NO mouth. '
       'Ihyun: a small child about 4 years old, short straight black hair, round cream-skinned face, 2.5 heads tall, exactly as in the reference.')
jobs['red_car'] = [
    dict(id='rc_bed_wide', kind='scene', aspect='landscape 16:9', refs=RREF, out=RDIR + 'rc_bed_wide.png',
         prompt=scene_prompt(RT, R_M + R_V + ' COMPOSITION (16:9): the bed with Ihyun on the left-centre, the shoebox garage with the four vehicles on the floor at the right-centre, all four vehicles big and readable, nothing cut off.', RICH, '16:9 landscape', NIGHT)),
    dict(id='rc_bed_tall', kind='scene', aspect='portrait 2:3', refs=RREF[:4] + [RDIR + 'rc_bed_wide.png'], out=RDIR + 'rc_bed_tall.png',
         prompt=scene_prompt(RT, R_M + R_V + ' COMPOSITION (2:3 portrait): the SAME room as the last reference image, recomposed vertically: Ihyun in the bed in the upper-middle part, the shoebox garage with the four vehicles on the floor in the lower part, everything important inside the central 60% of the width.', RICH, '2:3 portrait', NIGHT)),
]
# ── 유니콘을 찾아서 ──
UT = base('unicorn', 'uc_cut2_hug')
UDIR = 'assets/raw/restyle/unicorn/'
UREF = [UDIR + 'uc_kid2_stand.png', UDIR + 'uc_unicorn_stand.png', 'assets/v3w/uc_bg2_moon_night.webp']
U_M = ('Bedtime in Dahyun\'s bedroom at night. Dahyun sleeps in a small wooden bed under a patchwork quilt, head on the pillow, eyes closed in sleepy curves, a small smile; her hair exactly as in the reference sprite, '
       'wearing simple soft blush-pink pyjamas (no crown, the small marigold crown rests on the bedside table). '
       'A big window shows a calm night landscape: deep-indigo sky, a cream full moon, a few tiny stars, and far away on a gentle dark-green hill a SMALL unicorn standing still, facing toward the house '
       '(pearl-banded spiral horn, rainbow mane, same colours as its reference, small because it is far away — about one tenth of the window height). '
       'Leave one clear patch of empty dark sky above the hill (a star will appear there). ')
jobs['unicorn'] = [
    dict(id='uc_bed_wide', kind='scene', aspect='landscape 16:9', refs=UREF, out=UDIR + 'uc_bed_wide.png',
         prompt=scene_prompt(UT, U_M + 'COMPOSITION (16:9): the bed with Dahyun on the left half, the big window on the right half with the hill and the small unicorn clearly visible.', RICH, '16:9 landscape', NIGHT)),
    dict(id='uc_bed_tall', kind='scene', aspect='portrait 2:3', refs=UREF[:2] + [UDIR + 'uc_bed_wide.png'], out=UDIR + 'uc_bed_tall.png',
         prompt=scene_prompt(UT, U_M + 'COMPOSITION (2:3 portrait): the SAME room as the last reference image, recomposed vertically: the window with the hill and the small unicorn in the upper half (centred), Dahyun in the bed in the lower half, everything important inside the central 60% of the width.', RICH, '2:3 portrait', NIGHT)),
]
for t, add in jobs.items():
    # 기존 파일 모양(들여쓰기 섞임)을 건드리지 않게 글자로 덧붙인다: 이미 있는 bed job 은 지우고 끝 ']' 앞에 넣는다
    txt = open(J(t)).read(); cur = json.loads(txt); ids = {j['id'] for j in add}
    for i in ids:   # 이미 넣은 줄(한 줄짜리)은 그 줄만 지운다
        txt = re.sub(r',\n \{"id": "' + i + r'".*\}(?=\n)', '', txt)
    body = ',\n'.join(' ' + json.dumps(j, ensure_ascii=False) for j in add)
    txt = txt.rstrip()[:-1].rstrip() + ',\n' + body + '\n]\n'
    json.loads(txt); open(J(t), 'w').write(txt)
    print(t, [j['id'] for j in add])
