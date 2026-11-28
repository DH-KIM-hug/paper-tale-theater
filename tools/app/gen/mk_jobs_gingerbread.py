#!/usr/bin/env python3
"""진저브레드맨(gingerbread) 그림 작업표 tools/app/gen/jobs_gingerbread.json 을 만든다 — tales/gingerbread/PLAN.md 그림 목록(§3-2, §7, §8, §10) 그대로.
틀은 mk_jobs_night_before.py 와 같다(스타일 문단은 별주부전 작업표 글).
  python3 tools/app/gen/mk_jobs_gingerbread.py
pass 1: 기준 자세 10장(할머니가 첫 그림) / pass 2: 기준 그림을 참고로 넣는 자세·얼굴 / pass 3: 소품·앞 가림 / pass 4: 배경 / pass 5: 컷 / pass 6: 표지·썸네일·뒷표지
확정(2026-11-26, 추천안): 여우 A안(가장 빨라서 잡음) → 선택 B·C 자세 9장은 만들지 않음. 먹는 장면 1안(이빨 없음, 입 안 Bean Red 한 장). 진저브레드맨 키 0.55·머리 폭 할머니의 0.8. 달리기 2프레임.
광원: 1~8장 세트 A(왼쪽 위), 9~10장 오른쪽 위 낮은 해(세트 B), 11장 창 불빛만. 인물·소품 그림은 세트 A 문장."""
import json, os
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
BJ = {j['id']: j['prompt'] for j in json.load(open(os.path.join(G, 'tools/app/gen/jobs_byeoljubu.json')))}
def cut_at(s, a, b=None): i = s.index(a); return s[i:] if b is None else s[i:s.index(b, i)]
def set_b(t):  # 오른쪽 위 빛, 그림자 왼쪽 아래
    return (t.replace('from the upper-left', 'from the upper-right')
             .replace('All cast shadows fall toward the LOWER RIGHT (light source at the upper left)', 'All cast shadows fall toward the LOWER LEFT (light source at the upper right)'))
SP_HEAD = BJ['bj_prop_medicine_bag'][:BJ['bj_prop_medicine_bag'].index('SUBJECT AND POSE:')]
SP_TAIL = cut_at(BJ['bj_prop_medicine_bag'], 'If a reference image is attached')
BG_HEAD = BJ['bj_bg_shore_day'][:BJ['bj_bg_shore_day'].index('SCENE:')]
BG_RICH = cut_at(BJ['bj_bg_shore_day'], 'RICHNESS', 'FRAME:').replace('NO fish, ', '')
CUT_HEAD = BJ['bj_cut_shock'][:BJ['bj_cut_shock'].index('MOMENT:')]
KEY_HEAD = BJ['bj_key_wide'][:BJ['bj_key_wide'].index('FRAME (most important):')]
KEY_TAIL = cut_at(BJ['bj_key_wide'], 'LIGHTING:')
LIGHT_A = cut_at(BJ['bj_bg_shore_day'], 'LIGHTING:').replace('NO people.\nNO animals.\n', '')
LIGHT_B = set_b(LIGHT_A)
LIGHT_WIN = (LIGHT_A.replace('Use soft, diffuse studio-style lighting from the upper-left', 'Use very soft, low, diffuse lighting (an evening scene lit mainly by one warm house window)')
             .replace('All cast shadows fall toward the LOWER RIGHT (light source at the upper left), short and identical in direction on every piece.', 'Cast shadows are very short and faint, only thin dark warm edges between the paper layers.'))
RAW = 'assets/raw/restyle/gingerbread/'

TALE = ('This is the classic American folk tale THE GINGERBREAD MAN (The Gingerbread Boy, 1875), set on a snowy Christmas Eve in a generic old country village at the edge of a fir forest: '
        'a little cottage kitchen, a red barn, snowy fields, a pasture, a pigpen. Simple, warm, kid-friendly. No Disney look, no film look (NOT the Shrek gingerbread man).')

C = {
 'man': ('the GINGERBREAD MAN, a plump TRADITIONAL gingerbread cookie (a living character): one flat ginger-brown (#B5733A) cookie body with a big ROUND head, a round tummy and SHORT, THICK, rounded arms and legs '
         '(NOT thin spidery limbs); snow-white (#F4F6FA) icing ZIGZAG strips ONLY at the wrists and ankles (like sleeves and trouser hems; NO icing headband, NO icing on the head); '
         'THREE round candy BUTTONS in a vertical row down the tummy: candy red (#D8322E), candy green (#4FA86B), candy red; snow-white sugar SHOES on both feet. '
         'His whole height is only 0.55 of the grandmother\'s height and his head is 0.8 times as wide as her head.'),
 'granny': ('the GRANDMOTHER, a kind generic old woman: snow-white (#F4F6FA) hair in a round bun, a plum-purple (#7B4F8C) dress, a snow-white apron, a sky-blue (#3E7CB1) shawl over her shoulders, '
            'skin warm light peach (#F4C9A8), NO glasses. Proportions: 2.5 heads tall (a big round head).'),
 'grandpa': ('the GRANDFATHER, a kind generic old man: short snow-white (#F4F6FA) hair and a short snow-white beard, a paper-cream (#F6ECD8) shirt, a pine-green (#3F6B4F) vest, bark-brown (#6B4A32) trousers, '
             'skin warm light peach (#F4C9A8). Proportions: 2.5 heads tall, 1.05 times the grandmother\'s height.'),
 'thr_a': ('a THRESHER (farm worker who beats grain), a young man: a cobalt (#3A6FD8) work jacket and trousers, a mustard (#D9A94E) scarf, short cocoa (#4E3524) hair, skin light peach (#F4C9A8). 2.5 heads tall.'),
 'thr_b': ('a THRESHER (farm worker who beats grain), a young woman: a mustard (#D9A94E) long skirt and a cobalt (#3A6FD8) blouse, a cobalt headscarf, a long bark-brown (#6B4A32) braid, skin warm tan (#D9A27E). 2.5 heads tall.'),
 'mow_a': ('a MOWER (farm worker cutting dry reeds), a woman: a bean-red (#A93B32) coat, a teal (#2F8F9D) knitted hat, curly straw-gold (#D9A94E) hair, skin warm light peach (#F1BFA0). 2.5 heads tall.'),
 'mow_b': ('a MOWER (farm worker cutting dry reeds), an older man: a teal (#2F8F9D) coat, a bean-red (#A93B32) flat cap, a cocoa (#4E3524) moustache, skin deep tan (#B9825E). 2.5 heads tall.'),
 'cow': ('a gentle storybook COW: snow-white (#F4F6FA) body with two or three charcoal (#3B3B3B) spots, a blush (#EFB4A8) muzzle, two small straw-gold (#D9A94E) horns, a small straw-gold bell on a bark-brown neck strap, a tufted tail. '
         'Back height 1.1 of the grandmother\'s height, body length 1.7.'),
 'pig': ('a round storybook PIG: blush (#EFB4A8) body, dusty-rose (#C98A7A) inner ears and round snout, a curly tail. NO clothes. Height 0.6 of the grandmother, body length 0.95.'),
 'fox': ('a slim storybook FOX: persimmon (#E8703A) body, paper-cream (#F6ECD8) belly, chest and tail tip, cocoa (#4E3524) paws and nose, a big bushy tail. Standing height 0.75 of the grandmother. '
         'Sly but NOT scary: NO teeth, NO fangs, NO claws.'),
}
F = {
 'man': 'FACE (gingerbread man): two round cocoa (#4E3524) RAISIN eyes, a curved snow-white sugar-icing SMILE strip, two small round shell-pink (#F8D7E0) cheeks; tiny eyebrow strips of white icing may show the mood. No eyelashes, no glossy highlights.',
 'person': 'FACE: two round eyes (a white disc with an ink #2A2A2A disc), two small eyebrow strips (the eyebrows show the mood), a small nose piece, a curved paper-strip mouth, two round shell-pink (#F8D7E0) cheeks. No eyelashes, no glossy highlights.',
 'cow': 'FACE (cow, a living animal): two round eyes (a white disc with an ink disc), two cocoa nostril dots on the blush muzzle, a small curved mouth, shell-pink cheeks. No eyelashes, no glossy highlights.',
 'pig': 'FACE (pig, a living animal): two small round ink dot eyes, a flat round dusty-rose snout with two cocoa nostril dots, a small curved mouth, shell-pink cheeks. No eyelashes, no glossy highlights.',
 'fox': 'FACE (fox, a living animal): two eyes (a white disc with an ink disc, or narrowed sly curved strips when the pose says sly), a cocoa nose tip, a small curved mouth with NO teeth, two shell-pink cheeks. No eyelashes, no glossy highlights.',
}
FKEY = {'man': 'man', 'granny': 'person', 'grandpa': 'person', 'thr_a': 'person', 'thr_b': 'person', 'mow_a': 'person', 'mow_b': 'person', 'cow': 'cow', 'pig': 'pig', 'fox': 'fox'}
FRAMING = {
 'sq': 'FRAMING:\nSquare 1:1 image. The whole figure is visible and centred, filling about 80% of the frame. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
 'wide': 'FRAMING:\nLandscape 3:2 image. The whole figure is visible and centred, filling about 85% of the frame width. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
}
NOMAG = ('\nNO magenta or hot-pink anywhere inside the subject (blush, dusty rose and plum purple stay clearly different from the magenta background).'
         '\nNO white outline, NO sticker border, NO light rim around the figure: the outer edge is the clean cut edge of the paper itself.')

def sp_tail(shape):
    t = SP_TAIL
    t = t.replace(t[t.index('FRAMING:'):t.index('LIGHTING:')], FRAMING[shape] + '\n\n')
    if t.rstrip().endswith('NO magenta or hot-pink anywhere inside the subject.'):
        t = t.rstrip()[:-len('NO magenta or hot-pink anywhere inside the subject.')].rstrip()
    return t + NOMAG

jobs = []
def J(**k): jobs.append(k); return k
SAME = ('The SAME character as the reference image. SAME SCALE AS THE REFERENCE: the head, face, eyes and body are exactly the same size as in the '
        'reference image (measure by the head width); only the pose and expression change as described. Keep every colour, piece and marking of the reference exactly. ')
FACE_ONLY = ('EXACTLY the same character, pose, size and position as the reference image; ONLY the face expression changes as described (edit the face only). ')

def char(who, pid, pose, scenes, ref=None, shape='sq', note='', other=None, face_only=False, pas=None):
    refs, same = [], ''
    if ref: refs.append(RAW + f'{ref}.png'); same = FACE_ONLY if face_only else SAME
    if other:
        for o in (other if isinstance(other, list) else [other]):
            refs.append(RAW + f'{o[0]}.png'); same += o[1] + ' '
    p = (SP_HEAD + 'SUBJECT AND POSE:\n' + TALE + '\n' + same + C[who][0].upper() + C[who][1:] + '\nPOSE AND EXPRESSION: ' + pose +
         '\nHANDS: nothing in the hands unless the pose names an object; never another character in the hands.\n\n' + F[FKEY[who]] + ' Objects that are not characters have NO face.\n\n' + sp_tail(shape))
    J(id=pid, kind='sprite', **{'pass': pas or (2 if ref else 1)}, refs=refs, size=[840, 560] if shape == 'wide' else [600, 600], out=RAW + f'{pid}.png',
      **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), note=f'{scenes}장. {note}'.strip(), prompt=p)

def face(who, pid, base, mood):
    char(who, pid, f'ONLY THE HEAD (and the top of the neck), front view, centred, {mood}. The bottom edge is cut cleanly under the chin. This is a speech-bubble face icon.', 'T.faceArt', base, note='말풍선 얼굴(기준 자세 참고, 머리만)')

def prop(pid, desc, scenes, shape='sq', ref=None, note='', pas=3):
    refs = [RAW + f'{r}.png' for r in ([ref] if isinstance(ref, str) else (ref or []))]
    p = (SP_HEAD + 'SUBJECT AND POSE:\nAn OBJECT (not a character) for the folk tale The Gingerbread Man (a snowy old country village at Christmas): ' + desc +
         (' Draw it in the SAME paper style and at the same scale as the attached reference image.' if ref else '') +
         ' Shown alone, centred.\n\nThis is an OBJECT, not a character: NO face, NO eyes, NO mouth anywhere on it.\n\n' + sp_tail(shape))
    J(id=pid, kind='sprite', **{'pass': pas}, refs=refs, size=[840, 560] if shape == 'wide' else [600, 600], out=RAW + f'{pid}.png',
      **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), note=f'{scenes}장. {note}'.strip(), prompt=p)

# ── 기준 자세 10장(pass 1) ─────────────────
GR = 'gb_granny_stand_r'
SCALE_P = lambda who: ('The reference image is a DIFFERENT character (the grandmother) shown ONLY for paper style and head size: draw ' + who + ' NOT like her and with a different face, with the head exactly as big as her head.')
SCALE_X = lambda txt: ('The reference image is a DIFFERENT character (the grandmother) shown ONLY for paper style and scale: ' + txt)
char('granny', GR, 'standing in three-quarter SIDE VIEW FACING RIGHT, both hands resting on her apron, a kind gentle smile, looking RIGHT.', '1·3', note='기준 자세(머리 폭 = 1). 첫 그림. Plum Purple 원피스: 크로마키 뒤 가장자리 확인(판단 11)')
char('man', 'gb_man_stand_front', 'standing in FRONT VIEW, both arms held a little out from the body, legs apart, a big happy smile.', '2·썸네일', note='기준 자세(머리 폭 = 할머니의 0.8, 키 0.55)',
     other=(GR, SCALE_X('draw the gingerbread man only 0.55 of her height, his head 0.8 times as wide as her head.')))
char('grandpa', 'gb_grandpa_stand_l', 'standing in three-quarter SIDE VIEW FACING LEFT, one hand on his hip, a relaxed easy smile, looking LEFT. No hat.', '1', note='기준 자세', other=(GR, SCALE_P('the grandfather')))
char('thr_a', 'gb_thresher_a_stand_l', 'standing in three-quarter SIDE VIEW FACING LEFT, holding a wooden FLAIL upright beside him (a long bark-brown #6B4A32 handle with a short kraft #C9A574 swinging stick tied at its top), calm face, looking LEFT.', '5', note='기준 자세, 도리깨 포함', other=(GR, SCALE_P('this young man')))
char('thr_b', 'gb_thresher_b_stand_l', 'standing in three-quarter SIDE VIEW FACING LEFT, holding a wooden FLAIL upright beside her (a long bark-brown handle with a short kraft swinging stick tied at its top), calm face, looking LEFT.', '5', note='기준 자세(a 와 다른 얼굴)',
     other=[('gb_thresher_a_stand_l', 'The reference image is a DIFFERENT person (her co-worker) shown ONLY for paper style and head size: give her a DIFFERENT face, hair, skin tone and clothes, same head size.')])
char('mow_a', 'gb_mower_a_stand_l', 'standing in three-quarter SIDE VIEW FACING LEFT, holding a small round paper SICKLE (a curved stone-grey #9AA79A blade, a bark-brown handle, no shine) low in one hand, calm face, looking LEFT.', '6', note='기준 자세, 낫 포함', other=(GR, SCALE_P('this woman')))
char('mow_b', 'gb_mower_b_stand_l', 'standing in three-quarter SIDE VIEW FACING LEFT, holding a small round paper SICKLE (a curved stone-grey blade, a bark-brown handle, no shine) low in one hand, calm face, looking LEFT.', '6', note='기준 자세(a 와 다른 얼굴)',
     other=[('gb_mower_a_stand_l', 'The reference image is a DIFFERENT person (his co-worker) shown ONLY for paper style and head size: give him a DIFFERENT face, hair, skin tone and clothes, same head size.')])
char('cow', 'gb_cow_stand_l', 'standing on all four legs in SIDE VIEW FACING LEFT, eyes half closed, calm and easy-going.', '7', shape='wide', note='기준 자세(등 높이 1.10, 길이 1.70)', other=(GR, SCALE_X('the cow\'s back is 1.1 of her height and its body 1.7 of her height long.')))
char('pig', 'gb_pig_stand_l', 'standing on all four legs in SIDE VIEW FACING LEFT, calm.', '8', shape='wide', note='기준 자세(키 0.60)', other=(GR, SCALE_X('the pig is 0.6 of her height and 0.95 of her height long.')))
char('fox', 'gb_fox_stand_l', 'standing on all four legs in SIDE VIEW FACING LEFT, tail curving up, a sly little smile (mouth closed), looking LEFT.', '9·10', shape='wide', note='기준 자세(서기 0.75)', other=(GR, SCALE_X('the fox standing is 0.75 of her height.')))

# ── 진저브레드맨(17) ───────────────────────
M = 'gb_man_stand_front'
char('man', 'gb_man_dough', 'NOT YET DECORATED raw cookie DOUGH lying flat on its back seen from above, arms and legs spread out: the plain ginger-brown cookie shape ONLY, with NO face at all (no eyes, no mouth, no cheeks), NO buttons, NO icing, NO shoes.', '1·2', M, note='꾸미기 전. 얼굴·단추 없음(사물 상태)')
jobs[-1]['prompt'] = jobs[-1]['prompt'].replace(F['man'] + ' ', 'NO FACE on this undecorated dough. ').replace(SAME, 'The reference image shows the finished gingerbread man: draw the SAME cookie shape and SAME SIZE (same head width), but as plain undecorated dough: remove the face, buttons, icing and shoes. ')
char('man', 'gb_man_dough_face', 'the SAME undecorated dough lying flat seen from above, arms and legs spread out, with ONLY the snow-white sugar SMILE strip added on the face (NO eyes yet, NO buttons, NO icing, NO shoes).', '2', 'gb_man_dough', note='입만 붙은 상태(눈·단추·신발은 조각 소품)')
jobs[-1]['prompt'] = jobs[-1]['prompt'].replace(F['man'] + ' ', 'The face has ONLY the sugar smile strip, no eyes. ')
char('man', 'gb_man_jump_out', 'FRONT VIEW, leaping in mid-air with both arms thrown up high and legs spread apart. EXCITED: big open-mouth smile, sparkling eyes.', '3', M)
char('man', 'gb_man_run_a', 'RUNNING to the RIGHT in side view, frame 1: the front leg stretched forward, the back leg behind, arms swung back. SMUG face: one icing eyebrow raised, grinning. Looking RIGHT.', '3~8', M, note='달리기 1(2프레임 확정)')
char('man', 'gb_man_run_b', 'RUNNING to the RIGHT in side view, frame 2: legs crossing under the body, arms swung forward. The SAME smug grin as the first running frame. Looking RIGHT.', '4~8', M, note='달리기 2(판단 8 확정, 0.16초 교차)')
char('man', 'gb_man_run_lookback', 'RUNNING with his body to the RIGHT but his HEAD TURNED BACK to look LEFT over his shoulder, one hand cupped at his mouth calling out. TEASING: tip of a little tongue out, eyes narrowed in a laugh.', '4·6·8', M, note='뒤집기 금지')
char('man', 'gb_man_taunt_stand', 'standing still, turned to face LEFT, both hands on his hips, chest puffed out, chin up. BOASTFUL grin.', '5·7·9', M)
char('man', 'gb_man_wave_back', 'RUNNING with his body to the RIGHT, head turned back to the LEFT, one hand waving behind him. CHEERFUL face.', '5·7', M)
char('man', 'gb_man_skid', 'skidding to a sudden stop facing RIGHT: both feet sliding forward, arms flung back. STARTLED: eyes round, mouth a round "O".', '9', M)
char('man', 'gb_man_point_fox', 'standing facing RIGHT, one arm pointing straight to the RIGHT. CURIOUS face.', '9', M)
char('man', 'gb_man_run_worried', 'RUNNING with his body to the RIGHT, head turned back to the LEFT, both arms spread wide. WORRIED: eyebrows tilted down, small wavy mouth. NOT smiling.', '10', M)
char('man', 'gb_man_caught_front', 'FRONT VIEW, stopped dead with arms and legs spread wide. SURPRISED: mouth a round "O", one small snow-white sweat drop piece beside the head.', '10', M)
face('man', 'gb_man_face', M, 'a happy smile')
char('man', 'gb_man_cheer_front', 'FRONT VIEW, hopping up with both arms raised high. EXCITED big smile.', '4~8', M, note='정답 반응')
char('man', 'gb_man_look_down_tray', 'SITTING UP on a flat surface (the tray is not drawn), legs stretched out in front, looking DOWN at his own candy buttons. CURIOUS face.', '2', M, note='선택')
char('man', 'gb_man_stand_r', 'standing in SIDE VIEW FACING RIGHT, arms at the sides, a small smile, looking RIGHT.', '2·3', M)

# ── 할머니(12) ─────────────────────────────
char('granny', 'gb_granny_sad_window', 'standing in SIDE VIEW FACING LEFT, one hand at her chin, looking LEFT out of a window (not drawn). A little LONELY: eyebrows tilted down slightly, a small soft smile.', '1', GR)
char('granny', 'gb_granny_knead', 'bending forward over an invisible table, both hands on a straw-gold (#D9A94E) ROLLING PIN rolling dough (the dough and table are NOT drawn), looking DOWN. FOCUSED: mouth closed in a small smile.', '1', GR, note='밀대 포함')
char('granny', 'gb_granny_cutter', 'bending forward, both hands pressing a stone-grey (#A9A39B) gingerbread-man-shaped COOKIE CUTTER down onto an invisible table, looking DOWN. HAPPY face. The cutter has NO face.', '1', GR, note='쿠키 틀 포함(얼굴 없음)')
char('granny', 'gb_granny_decorate', 'leaning forward, one hand reaching DOWN and forward as if placing a small piece on a tray below (the hand is EMPTY), looking DOWN. KIND, mouth a little open.', '2', GR)
char('granny', 'gb_granny_point_tray', 'leaning a little forward, one finger pointing DOWN at a tray below (not drawn), eyebrows raised in a friendly QUESTION, looking DOWN.', '2', GR)
char('granny', 'gb_granny_oven_open', 'SIDE VIEW FACING RIGHT, bending a little, one hand reaching forward and DOWN to the right as if gripping an oven door handle (the oven is not drawn), looking DOWN to the RIGHT. EXPECTANT smile.', '3', GR)
char('granny', 'gb_granny_shocked', 'FRONT VIEW, both hands thrown up high, leaning back a little. SHOCKED: eyes big round discs, mouth a round "O".', '3', GR)
char('granny', 'gb_granny_reach_run', 'hurrying to the RIGHT in side view, both arms stretched forward reaching, the sky-blue shawl flying behind, both feet low near the ground (a reaching pose, not a one-foot hop). FLUSTERED: eyebrows raised, mouth open.', '4~8', GR)
char('granny', 'gb_granny_pant', 'SIDE VIEW FACING RIGHT, bent over with both hands on her knees, the shawl slipping off one shoulder. PANTING: eyes closed, mouth open, one small sweat drop piece.', '4·11', GR)
char('granny', 'gb_granny_stand_l_sad', 'standing in SIDE VIEW FACING LEFT, hands clasped in front. A WISTFUL soft smile, eyebrows tilted down a little.', '11', GR)
face('granny', 'gb_granny_face', GR, 'a gentle smile')

# ── 할아버지(11) ───────────────────────────
GP = 'gb_grandpa_stand_l'
CAP = ' Outdoors he wears a straw-gold (#D9A94E) knitted woolly hat.'
char('grandpa', 'gb_grandpa_chair', 'SITTING in a chair (the chair is NOT drawn; he sits on nothing), three-quarter view facing LEFT, holding a small paper-cream teacup in one hand. COMFORTABLE smile.', '1', GP, note='흔들의자는 소품')
char('grandpa', 'gb_grandpa_sniff', 'standing, nose lifted UP, one hand beside his nose, sniffing a nice smell. EXPECTANT: eyes closed, smiling.', '3', GP)
char('grandpa', 'gb_grandpa_point_r', 'standing SIDE VIEW FACING RIGHT, one arm stretched straight out pointing RIGHT. SURPRISED: mouth open.', '3', GP)
char('grandpa', 'gb_grandpa_reach_run', 'hurrying to the RIGHT in side view, one arm reaching forward, the other hand holding his hat on his head, both feet low near the ground. FLUSTERED.' + CAP, '4~8', GP)
char('grandpa', 'gb_grandpa_pant', 'stopped, SIDE VIEW FACING RIGHT, holding his straw-gold knitted hat in one hand and wiping his forehead with the other. PANTING: mouth open, a sweat drop piece.', '11', GP)
char('grandpa', 'gb_grandpa_shrug_l', 'standing SIDE VIEW FACING LEFT, both palms open, shoulders raised in a shrug. A resigned chuckle (eyes closed, smiling).' + CAP, '11', GP)
char('grandpa', 'gb_grandpa_stand_r', 'standing in SIDE VIEW FACING RIGHT, arms at the sides, a smile, looking RIGHT. No hat.', '2', GP)
char('grandpa', 'gb_grandpa_laugh_front', 'FRONT VIEW, one hand on his belly, head tipped back, laughing heartily (eyes closed, mouth wide open). No hat.', '2', GP)
char('grandpa', 'gb_grandpa_arm_granny', 'standing SIDE VIEW FACING LEFT, one arm held out to his side and curved as if around someone\'s shoulders (the hand ends in EMPTY space, nobody is drawn). TENDER smile.' + CAP, '11', GP, note='손끝은 빈 공간, 할머니는 따로')
face('grandpa', 'gb_grandpa_face', GP, 'a warm smile')

# ── 탈곡·풀 베는 사람(각 5 + 얼굴) ─────────────
for w, base, k in (('thr_a', 'gb_thresher_a_stand_l', 'thresher_a'), ('thr_b', 'gb_thresher_b_stand_l', 'thresher_b')):
    char(w, f'gb_{k}_work', 'swinging the wooden flail DOWN to beat grain on the floor (mid-swing, the swinging stick near the ground), looking DOWN. FOCUSED.', '5', base)
    char(w, f'gb_{k}_look_r', 'holding the flail still, head lifted looking RIGHT, SIDE VIEW FACING RIGHT. SURPRISED: eyebrows up.', '5', base)
    char(w, f'gb_{k}_reach_run', 'running to the RIGHT with EMPTY hands (the flail was thrown away), both arms reaching forward, both feet low near the ground. EAGER: a big grin.', '5~8', base)
    char(w, f'gb_{k}_pant', 'stopped, SIDE VIEW FACING RIGHT, bent over at the waist, hands on knees, empty-handed. PANTING: mouth open.', '11', base)
face('thr_a', 'gb_thresher_face', 'gb_thresher_a_stand_l', 'a cheerful smile')
for w, base, k in (('mow_a', 'gb_mower_a_stand_l', 'mower_a'), ('mow_b', 'gb_mower_b_stand_l', 'mower_b')):
    char(w, f'gb_{k}_work', 'bending at the waist cutting dry reeds with the sickle (the blade tip low at the ground, the reeds are NOT drawn), looking DOWN. FOCUSED.', '6', base)
    char(w, f'gb_{k}_look_r', 'sickle lowered in one hand, the other hand shading the eyes, SIDE VIEW FACING RIGHT looking RIGHT. SURPRISED.', '6', base)
    char(w, f'gb_{k}_reach_run', 'running to the RIGHT with EMPTY hands (the sickle was put down), arms reaching forward, both feet low near the ground. CHEERFUL grin.', '6~8', base)
    char(w, f'gb_{k}_pant', 'stopped, SIDE VIEW FACING RIGHT, hands on knees, empty-handed. PANTING: mouth open.', '11', base)
face('mow_a', 'gb_mower_face', 'gb_mower_a_stand_l', 'a cheerful smile')

# ── 소·돼지·여우 ───────────────────────────
CW, PG, FX = 'gb_cow_stand_l', 'gb_pig_stand_l', 'gb_fox_stand_l'
char('cow', 'gb_cow_graze', 'head lowered to the LEFT eating hay (the hay is not drawn), SIDE VIEW. MUNCHING: mouth pushed to one side.', '7', CW, shape='wide')
char('cow', 'gb_cow_look_r', 'head raised and turned to look RIGHT, ears up, body still side view. CURIOUS: eyes wide.', '7', CW, shape='wide')
char('cow', 'gb_cow_run', 'running to the RIGHT in side view, front and back legs spread, tail up. EAGER: mouth open "moo".', '7·8', CW, shape='wide')
char('cow', 'gb_cow_pant', 'stopped, SIDE VIEW FACING RIGHT, legs spread, tongue out. TIRED.', '11', CW, shape='wide')
face('cow', 'gb_cow_face', CW, 'a calm easy smile')
char('pig', 'gb_pig_peek_fence', 'standing up on its hind legs with both front trotters resting on an invisible fence top in front of it (the fence is NOT drawn), facing RIGHT. EXCITED: eyes sparkling.', '8', PG)
char('pig', 'gb_pig_jump_over', 'leaping in mid-air to the RIGHT, legs tucked, ears flying. EXCITED.', '8', PG, shape='wide')
char('pig', 'gb_pig_run', 'running to the RIGHT in side view, ears flying back. EAGER: mouth open.', '8', PG, shape='wide')
char('pig', 'gb_pig_pant', 'sitting down on its bottom, facing RIGHT, tongue out. TIRED.', '11', PG)
face('pig', 'gb_pig_face', PG, 'a happy oinking smile')
char('fox', 'gb_fox_lie', 'lying down on its side, chin resting on its front paws, SIDE VIEW FACING LEFT. LAZY: eyes half closed, a tiny smile.', '9', FX, shape='wide', note='누움 높이 0.45, 길이 1.30')
char('fox', 'gb_fox_ear_up', 'the SAME lying pose, one ear pricked up and eyes open. INTERESTED: eyebrows raised. Facing LEFT.', '9', FX, shape='wide')
char('fox', 'gb_fox_stretch', 'getting up and STRETCHING: front legs stretched far forward to the LEFT, back end up, tail high. SLY: eyes narrowed, grin (mouth closed, no teeth).', '9', FX, shape='wide')
char('fox', 'gb_fox_run', 'running FAST to the RIGHT, body low and long, tail straight out. FOCUSED: eyes narrowed.', '10', FX, shape='wide')
char('fox', 'gb_fox_block_front', 'FRONT VIEW, sitting squarely, tail raised behind. SLY grin with the mouth CLOSED (no teeth).', '10', FX)
char('fox', 'gb_fox_mouth_open', 'SIDE VIEW FACING LEFT, mouth opened WIDE in a cartoon "chomp" (the inside of the mouth is ONE flat bean-red #A93B32 piece, absolutely NO teeth, NO fangs, NO tongue detail). Funny, NOT scary.', '10', FX, note='눈가루 직전 0.4초, 이빨 없음(판단 1 1안)')
char('fox', 'gb_fox_lick', 'sitting, facing LEFT, one front paw patting its round tummy, licking its lips. SATISFIED: eyes closed.', '10', FX)
char('fox', 'gb_fox_walk_away', 'seen from BEHIND walking away to the RIGHT into the distance, tail swishing; NO face visible.', '11', FX, shape='wide')
face('fox', 'gb_fox_face', FX, 'a sly smile with the mouth closed')

# ── 소품(얼굴 없음) ────────────────────────
prop('gb_prop_table', 'a wooden kitchen TABLE seen from the front: a warm sand (#E9DCC0) top board and bark-brown (#6B4A32) legs, nothing on top.', '1·2', shape='wide', note='0.45(폭 1.6)')
prop('gb_prop_rolling_pin', 'a straw-gold (#D9A94E) wooden ROLLING PIN lying sideways.', '1', shape='wide', note='폭 0.45')
prop('gb_prop_flour_tin', 'a snow-white (#F4F6FA) FLOUR TIN with a sky-blue (#3E7CB1) band around it and a little flour heaped at the open top.', '1')
prop('gb_prop_cutter', 'a stone-grey (#A9A39B) metal COOKIE CUTTER in the outline shape of a little gingerbread figure (just the thin outline rim, empty inside). NO face.', '1', note='얼굴 없음')
prop('gb_prop_tray', 'a flat slate (#6C739A) BAKING TRAY seen from slightly above, empty.', '1·2·3', shape='wide', note='폭 0.75 = 진저브레드맨 키 × 1.3')
prop('gb_prop_dish_raisin', 'a small round paper-cream dish holding five round cocoa (#4E3524) RAISINS.', '2', note='0.12')
prop('gb_prop_dish_candy', 'a small round paper-cream dish holding four round CANDIES: two candy red (#D8322E) and two candy green (#4FA86B).', '2', ref='gb_prop_dish_raisin')
prop('gb_prop_dish_sugar', 'a small round paper-cream dish holding a few snow-white (#F4F6FA) SUGAR icing pieces.', '2', ref='gb_prop_dish_raisin')
DP = 'Exactly the scale of the cookie dough in the reference image (so it fits on it). '
prop('gb_prop_piece_eyes', DP + 'TWO round cocoa (#4E3524) RAISIN eyes side by side, as one small piece pair.', '2', ref='gb_man_dough', note='반죽과 같은 축척')
prop('gb_prop_piece_buttons', DP + 'THREE round candy BUTTONS in a vertical row: candy red (#D8322E), candy green (#4FA86B), candy red.', '2', ref='gb_man_dough', note='빨강·초록·빨강')
prop('gb_prop_piece_shoes', DP + 'TWO small snow-white (#F4F6FA) sugar-icing SHOES side by side.', '2', ref='gb_man_dough')
prop('gb_prop_piece_smile', DP + 'ONE curved snow-white sugar-icing SMILE strip.', '2', ref='gb_man_dough', note='할머니 데모')
prop('gb_prop_rocking_chair', 'a bark-brown (#6B4A32) wooden ROCKING CHAIR seen from the side, facing LEFT, empty.', '1', note='0.7')
prop('gb_prop_oven_closed', 'an old cottage OVEN: a slate (#6C739A) iron box with a round-topped door CLOSED, a small dark window in the door, a straw-gold (#D9A94E) handle, short legs. The window is dark (the glow is added by code).', '1·3', note='1.2, 문 손잡이가 톡 대상')
prop('gb_prop_oven_open', 'the SAME oven with the door swung OPEN downward, inside persimmon (#E8703A), an EMPTY slate tray on the rack.', '3', ref='gb_prop_oven_closed')
prop('gb_prop_oven_glow', 'a soft round warm LIGHT GLOW patch for an oven window: an ember-amber (#F2B366) centre fading to honey (#F6D27A) at the rim (a light layer; this one piece may fade softly).', '3', note='빛 층. 코드 빛 층으로 대신할 수 있음')
prop('gb_prop_smell', 'three wavy curling SMELL lines made of thin paper-cream (#F6ECD8) paper strips rising upward side by side.', '3', note='0.7')
prop('gb_prop_wreath_door', 'a round Christmas WREATH of pine-green (#3F6B4F) fir pieces with a holly-red (#C8303A) bow at the bottom.', '4·5', note='0.35')
prop('gb_prop_flail_thrown', 'a wooden FLAIL lying flat on the ground: a long bark-brown handle and a short kraft (#C9A574) swinging stick tied at one end.', '5', shape='wide', note='폭 0.9')
prop('gb_prop_scythe_down', 'a small round paper SICKLE lying on the ground: a curved stone-grey (#9AA79A) blade (no shine) and a bark-brown handle.', '6', shape='wide', note='폭 0.45')
prop('gb_prop_haybale', 'a tied HAY BALE: honey (#F6D27A) and straw-gold straw, a bean-red (#A93B32) string, a snow-white cap of snow on top.', '5·6·7', note='0.5')
prop('gb_prop_haystack_snow', 'a big round HAYSTACK of straw-gold (#D9A94E) and wheat (#E8C878) straw with a thick snow-white (#F4F6FA) cap.', '5·7', note='1.4')
prop('gb_prop_fence_gate', 'an OPEN wooden FENCE GATE in bark brown (#6B4A32) with snow caps on the posts, swung open.', '7', shape='wide', note='0.7')
prop('gb_prop_pigpen_fence', 'ONE section of a wooden PIGPEN FENCE: two kraft (#C9A574) and bark-brown rails between two posts, snow caps on the posts.', '8', shape='wide', note='0.6(폭 1.2)')
prop('gb_prop_fox_tree', 'a tall bare winter TREE: a bark-brown (#6B4A32) trunk and cocoa branches with snow-white snow along the top of the branches, NO leaves.', '9·10', note='2.8')
prop('gb_prop_sign_choice', 'a round dotted RING made of small honey (#F6D27A) paper dashes, empty in the middle (magenta inside).', '2·7·8', note='고르기 고리. 코드 고리로 대신할 수 있음')
prop('gb_fg_garland_l', 'a hanging fir GARLAND for the upper-left corner: pine-green and leaf-green (#6FB94A) fir pieces with a holly-red (#C8303A) ribbon bow.', '1·2·3', shape='wide', note='앞 가림')
prop('gb_fg_chair_back', 'the BACK of a wooden kitchen chair seen from behind (bark brown, three slats), for the lower-right corner.', '1·3', note='앞 가림')
prop('gb_fg_snowbank', 'a long low SNOW BANK strip: snow-white (#F4F6FA) and ice-blue (#DCEBF5) rounded drifts, much wider than tall.', '4·6·8', shape='wide', note='앞 가림, 폭 3.0')
prop('gb_fg_fir_branch_r', 'a fir BRANCH reaching in from the upper right: pine-green and fir-dark (#2F4F3C) needles with snow-white snow on top.', '4', shape='wide', note='앞 가림')
prop('gb_fg_fir_branch_l', 'a DARK fir BRANCH reaching in from the upper left: fir-dark (#2F4F3C) and dusk-indigo (#4A5280) needle pieces with a little snow.', '9·10', shape='wide', note='앞 가림')
prop('gb_fg_haybale', 'a tied HAY BALE with a snow cap, for the lower-right corner: honey and straw-gold straw, bean-red string.', '5', ref='gb_prop_haybale', note='앞 가림')
prop('gb_fg_reeds', 'a bundle of tall dry REEDS: wheat (#E8C878), straw-gold and kraft blades with a little snow.', '6', note='앞 가림')
prop('gb_fg_fence_post', 'one wooden FENCE POST in bark brown with a snow-white snow cap and a short rail stub.', '7', note='앞 가림')
prop('gb_fg_fir_sil', 'a long strip of DARK fir-tree TOPS silhouettes in ink (#2E241C) and fir dark (#2F4F3C), much wider than tall.', '11', shape='wide', note='앞 가림(양옆에만)')

# ── 배경(16:9) ────────────────────────────
COMMON = ('Characters, animals, props and pressable items are separate sprites added later. NO people, NO gingerbread man, NO animals, NO creatures.')
def bg(pid, scene, light, papers, layout, ref=None, note='', pas=4, LIGHT=LIGHT_A):
    p = (BG_HEAD + 'SCENE:\n' + TALE + '\n' + scene + ' ' + light + ' ' + COMMON + ' SCENE PAPERS: ' + papers + '\n' + layout + '\n' + BG_RICH +
         '\nFRAME:\nNo decorative border. The scene fills the entire frame edge to edge.\n\n' + LIGHT)
    J(id=pid, kind='bg', **{'pass': pas}, refs=[RAW + f'{r}.png' for r in ([ref] if isinstance(ref, str) else (ref or []))], size=[1600, 902], out=RAW + f'{pid}.png', note=note, prompt=p)
LA = 'Light: set A — a pale winter daylight from the window / sun at the UPPER LEFT; shadows to the LOWER RIGHT.'
OUT_P = ('sky pale sky #C9DCEA and mist blue #D9E4EE; snow snow white #F4F6FA and ice blue #DCEBF5; path mist blue; far village roofs slate blue #6C739A and dusk indigo #4A5280 with snow caps; '
         'fir trees fir dark #2F4F3C and pine green #3F6B4F with snow on the branches; fences bark brown #6B4A32.')
bg('gb_bg_kitchen', 'Scenes 1, 2, 3: a cosy cottage KITCHEN on Christmas Eve day, seen at eye level, wide.', LA,
   'wall fir dark #2F4F3C with a paper cream #F6ECD8 horizontal band; window view pale sky #C9DCEA, snow white #F4F6FA, two snowy pine green #3F6B4F fir trees; on the window frame a leaf green #6FB94A fir sprig with a holly red #C8303A ribbon; '
   'shelf kraft #C9A574 with three jars (kraft ginger, snow-white sugar, cocoa #4E3524 raisins); fireplace bricks clay #B5654A and dusty rose #C98A7A with small ember amber #F2B366 paper flames (a small soft glow); floor bark brown #6B4A32 boards; round rug bean red #A93B32.',
   'Planes back to front: (1) the dark green wall with a cream band; a WINDOW at the LEFT (x 6-26%, y 12-50%) showing falling snow and two snowy firs, a fir sprig and red ribbon on its frame; a two-tier SHELF with three jars at the upper middle (x 34-56%, y 10-26%); '
   '(2) a small brick FIREPLACE at the right-middle (x 58-72%, y 30-75%) with tiny paper flames; the OVEN SPOT at the far RIGHT (x 72-95%, y 35-90%) stays EMPTY plain wall and floor (the oven is a separate sprite); '
   '(3) the plank floor from y 75% down with a round bean-red rug; NO table drawn (the table is a sprite), the space above the table area (x 30-70%, y 55-80%) stays plain. Small decorations only at the very top edge and the far left bottom corner.', note='1·2·3장 부엌. 오븐·탁자는 소품')
bg('gb_bg_yard_snow', 'Scene 4: in front of the little cottage, a snowy yard and a snowy lane on a cloudy winter day, seen wide at eye level.', LA,
   OUT_P + ' house wall paper cream #F6ECD8 and warm sand #E9DCC0; door holly red #C8303A, open, inside glowing ember amber #F2B366 (a soft light layer); a wreath pine green and holly red over the door; roof clay #B5654A with snow.',
   'Planes back to front: (1) the sky in two bands (pale sky above mist blue); (2) two rows of far village roof silhouettes with snow caps; (3) the COTTAGE at the LEFT third (x 0-30%) with the red door OPEN and warm amber light inside, a wreath above the door, snow on the roof; a snowy wooden fence; three snowy fir trees at the middle-back; '
   '(4) snowy ground in two tones and a mist-blue LANE band running from the door to the right edge (y 70-100%), the lane stays PLAIN.', note='4장 집 앞 눈길')
bg('gb_bg_barn', 'Scene 5: a big RED BARN by the snowy lane, seen wide at eye level.', LA,
   OUT_P + ' barn bean red #A93B32 walls, bark brown door frame, the inside cocoa #4E3524 darkness with straw gold #D9A94E and wheat #E8C878 grain heaps; a small pine-green wreath with a holly-red bow on the door; haystack straw gold and honey #F6D27A with snow.',
   'Planes back to front: (1) the same sky bands; (2) far ice-blue hills; (3) the RED BARN filling the LEFT two thirds (x 0-62%) with a snowy roof and a BIG OPEN DOOR (x 18-48%, y 38-82%) showing the dark inside with grain heaps — the floor area inside the door stays PLAIN (two threshers are placed there later); a snowy haystack beside the door; '
   '(4) snowy ground and the mist-blue lane band along the bottom running to the right, PLAIN.', note='5장 헛간. 문 안 사람 자리 비움')
bg('gb_bg_field', 'Scene 6: a wide SNOWY FIELD, low horizon and a big sky, seen far and wide.', LA,
   OUT_P + ' horizon ice blue; far hills ice blue and mist blue; far fir row slate blue #6C739A; dry reeds wheat #E8C878, straw gold #D9A94E and kraft #C9A574 with snow; two tied hay bales honey with bean-red string.',
   'Planes back to front: (1) the sky in three bands (pale sky, mist blue, ice blue at the horizon), big; (2) two layers of far low hills and a far slate-blue fir row along the horizon (y 55-62%); (3) a band of tall DRY REEDS along the LEFT edge (x 0-22%) with snow on them, two tied hay bales at the far right; '
   '(4) the snowy field and the mist-blue lane band. The CENTRE (x 22-90%, y 55-100%) stays PLAIN snow.', note='6장 들판, 왼쪽 갈대 띠')
bg('gb_bg_pasture', 'Scene 7: a snowy PASTURE behind a wooden fence along the lane, seen at eye level.', LA,
   OUT_P + ' a far cowshed bean red #A93B32 with a snowy roof; fence bark brown with snow caps on every post; haystack straw gold and honey.',
   'Planes back to front: (1) the sky bands; (2) far hills and a small red cowshed far back at the right; (3) a snowy pasture with a long wooden FENCE running across the lower third (y 62-74%), snow caps on each post; a mist-blue shaded snow strip behind the fence at the left (contrast for a white cow); '
   '(4) the lane band at the bottom. The pasture area at the LEFT (x 15-45%, y 35-72%) stays PLAIN (the cow and its hay are placed there later).', note='7장 목초지, 소 자리 비움')
bg('gb_bg_pigpen_hill', 'Scene 8: a little PIGPEN at the left and a snowy HILL LANE climbing to the right, seen at eye level then far.', LA,
   OUT_P + ' pigpen kraft #C9A574 and bark brown fence, a tiny pig house with a snowy roof.',
   'Planes back to front: (1) the sky bands; (2) far hills and a fir row; (3) a small wooden PIGPEN with a tiny snow-roofed hut at the LEFT (x 0-24%); (4) a wide mist-blue LANE band climbing in a gentle line from the LOWER LEFT to the UPPER RIGHT across the snowy hill — the lane stays PLAIN and long (a long line of chasers is placed on it later).', note='8장 돼지 우리 + 언덕길')
bg('gb_bg_forest_edge', 'Scenes 9 and 10: the EDGE OF THE FIR FOREST in the late afternoon, seen at eye level.', 'Light: a LOW SETTING SUN at the UPPER RIGHT; shadows to the LOWER LEFT. The peach and apricot sky bands near the horizon are a soft light (allowed to fade gently).',
   'sky mist blue #D9E4EE (top), peach #F7C59F, apricot #F2A65A (horizon); a low honey #F6D27A sun disc; far fir rows slate blue #6C739A and dusk indigo #4A5280; fir dark #2F4F3C; a big tree bark brown #6B4A32 and cocoa #4E3524; snow snow white #F4F6FA and evening shade snow lavender dusk #8B7BB8.',
   'Planes back to front: (1) the sky bands with the low honey sun at the upper right (x 82%, y 30%); (2) two rows of far fir silhouettes (slate blue behind dusk indigo); (3) a BIG bare snowy TREE at the RIGHT third (x 68-94%) — the ground under it (x 62-98%, y 62-92%) stays PLAIN snow (the fox lies there later); '
   '(4) snowy ground in two tones (snow white and lavender-dusk shade). The centre-left (x 10-62%, y 55-100%) stays PLAIN.', note='9·10장 숲가 저녁', LIGHT=LIGHT_B)
EV_P = ('sky deep indigo #1F2A56 (top), twilight blue #2E3F7A, lavender dusk #8B7BB8 (horizon); a few moon-cream #FBF3D5 star holes; far fir silhouettes dusk indigo #4A5280, fir dark #2F4F3C, ink #2E241C; hill snow ice blue #DCEBF5 with lavender-dusk shade; '
        'small house wall paper cream #F6ECD8, roof clay #B5654A with snow; window ember amber #F2B366 (light layer).')
bg('gb_bg_evening_hill', 'Scene 11: a snowy HILL at the edge of the forest in the EVENING, seen far and wide. A readable storybook evening: mid-tone blues, not black.', 'Light: only the warm window of the little house; almost no shadows.', EV_P,
   'Planes back to front: (1) the sky in three bands with a few star holes; (2) two layers of far fir silhouettes, the nearer darker; (3) a gentle snowy hill across the middle; a SMALL HOUSE at the LOWER LEFT (x 6-22%, y 58-80%) with a snowy roof and ONE window left DARK (the glow is added by code); the dark forest at the RIGHT edge (x 84-100%); '
   '(4) the snowy foreground. The hill centre (x 22-84%, y 55-95%) stays PLAIN snow.', note='11장 저녁 언덕(창은 어둡게, 코드 빛 층)', LIGHT=LIGHT_WIN)
bg('gb_bg_evening_hill_lb', 'Scene 11 LIGHT-BOX version: the SAME evening hill as the reference image with exactly the same layout, lit like a paper light box: the sky one step darker, the house window now a bright glowing ember-amber light behind the paper with a soft amber ring around it, '
   'the far fir rows and the forest as dark ink and fir-dark silhouettes. Keep the hill centre plain snow (characters seen from behind are placed there and must stay visible).', 'Light: only the glowing window.', EV_P,
   'Keep everything else EXACTLY as in the reference.', ref='gb_bg_evening_hill', note='11장 라이트박스(판단 10). 인물 합성 검수 통과 시에만', LIGHT=LIGHT_WIN)
bg('gb_bg_back', 'BACK COVER (the ending page): one flat sheet of kraft paper #EBDFC8 with fine grain; on it, low in the middle, ONE simple gingerbread-man SILHOUETTE cut from slightly darker kraft #C9A574 paper and a few small snow-white snowflake dots. '
   'Very simple and calm, lots of empty kraft paper (text is placed there later).', '', 'kraft #EBDFC8, kraft dark #C9A574, snow white #F4F6FA.', 'Only 2 flat layers. Nothing else.', note='뒷표지(미리보기에 쓰지 않음)', pas=6)
jobs[-1]['prompt'] = jobs[-1]['prompt'].replace(BG_RICH, '')

# ── 컷(4:3) ───────────────────────────────
FC = F['man'] + ' ' + F['person'] + ' ' + F['fox']
def cut(pid, moment, panel, refs, scene, LIGHT=LIGHT_A):
    p = (CUT_HEAD + 'MOMENT:\nOne picture-book moment filling the ENTIRE image edge to edge (full-bleed, no border), kid-friendly and warm. ' + moment +
         ' Every character keeps exactly the head size, body proportions, colours and markings of its reference sprite; only the pose and expression change. Size relation: the gingerbread man is 0.55 of the grandmother\'s height. '
         'Objects, props and backgrounds have NO face. ' + TALE +
         '\n\nPANEL BACKGROUND:\n' + panel + ' — every piece one flat solid colour, no gradient (except a soft light glow where the moment says so).\n\n' + FC +
         '\n\nIf reference images are attached, they show the characters: match their shapes, colours, clothes and markings exactly.\n\nFRAME:\nNo border, no speech bubbles, no panel lines, no letters; fills the frame edge to edge. The panel background is the scene itself — NEVER a plain magenta or chroma-key background.\n\n' + LIGHT)
    J(id=pid, kind='cut', **{'pass': 5}, refs=[RAW + f'{r}.png' for r in refs], size=[1600, 1200], aspect='landscape 4:3', out=RAW + f'{pid}.png', note=scene, prompt=p)
cut('gb_cut_decorate', 'Seen from ABOVE: exactly ONE finished gingerbread man lying on a slate baking tray, looking up at the viewer with raisin eyes and a sugar smile, three candy buttons (red, green, red), sugar shoes. Around the tray: flour marks, two loose raisins and three small dishes; only the FINGERTIPS of the grandmother and grandfather at the tray edges (no faces of them).',
    'warm sand #E9DCC0 table top, slate #6C739A tray, snow-white flour', ['gb_man_stand_front', 'gb_prop_tray', 'gb_prop_dish_raisin'], '2장 끝')
cut('gb_cut_oven_jump', 'Exactly ONE gingerbread man LEAPS out of an open oven door with both arms thrown wide, a warm amber glow behind him (a soft light layer), three cream smell lines; at the LEFT the grandmother\'s shocked face with both hands raised, behind her the grandfather pointing. Exactly three characters.',
    'slate #6C739A oven, persimmon #E8703A oven inside, ember amber #F2B366 glow, fir dark #2F4F3C kitchen wall', ['gb_man_jump_out', 'gb_granny_shocked', 'gb_grandpa_point_r', 'gb_prop_oven_open'], '3장')
# 2026-11-28 다시 그림(검수): 옛 컷은 줄이 무대와 반대(진저브레드맨이 맨 뒤 왼쪽 아래)였고 일꾼이 밀짚모자를 써 무대 인물과 달랐다.
# 참고 그림은 5장 한도라 인물들을 한 장에 모은 참고판(_refsheet_*, 앱 그림 v3w 에서 모음)을 넣고, 인물마다 모자·머리를 글로 적는다.
CAST = ('The chasers must look EXACTLY like their reference sprites (same clothes, colours, hats and hair): '
        'the GRANDMOTHER: snow-white hair in a round bun and NO hat, a sky-blue shawl, a plum-purple dress, a snow-white apron; '
        'the GRANDFATHER: a straw-gold knitted bobble hat, short snow-white hair and beard, a cream shirt, a pine-green vest, bark-brown trousers; '
        'MOWER 1, a woman: a teal knitted bobble hat and teal scarf, curly straw-gold hair, a bean-red dress with a white apron; '
        'MOWER 2, an older man: a bean-red flat cap, a cocoa moustache, a long teal coat; '
        'THRESHER 1, a young man: NO hat, short cocoa hair, a cobalt jacket and trousers, a mustard scarf; '
        'THRESHER 2, a young woman: a cobalt headscarf, a long bark-brown braid, a cobalt blouse, a long mustard skirt. '
        'NOBODY wears a straw hat, sun hat or cowboy hat. ')
cut('gb_cut_chase_line', 'A LONG LINE running along a snowy hill lane that rises from the LOWER LEFT to the UPPER RIGHT, EVERYONE running toward the UPPER RIGHT (all bodies and faces point to the RIGHT). At the very FRONT, at the UPPER RIGHT end of the line, exactly ONE gingerbread man runs to the RIGHT with his head turned back over his shoulder to look LEFT at the chasers, the tip of his tongue out, teasing. Behind him, going DOWN the lane toward the lower left, in this exact order: ONE pig, ONE cow, the TWO MOWERS, the TWO THRESHERS, the GRANDFATHER, and LAST, at the LOWER LEFT end, the GRANDMOTHER. Exactly NINE characters, none repeated, all the same scale as their sprites (the gingerbread man is the smallest). ' + CAST,
    'pale sky #C9DCEA and mist blue #D9E4EE sky, a far fir row, snow white #F4F6FA hill, mist-blue lane, a snow bank in front', ['gb_man_run_lookback', '_refsheet_animals_run', '_refsheet_workers_run', '_refsheet_elders_run'], '8장 끝')
cut('gb_cut_fox_stretch', 'Under a big snowy bare tree, ONE fox stretches, eyes narrowed slyly, looking LEFT (mouth closed, no teeth); at the LEFT, smaller, exactly ONE gingerbread man stands with hands on hips boasting, looking RIGHT at the fox. A low peach setting sun behind (a soft light band).',
    'mist blue #D9E4EE, peach #F7C59F and apricot #F2A65A sky bands, honey sun, slate blue and dusk indigo fir rows, snow white and lavender dusk #8B7BB8 snow', ['gb_fox_stretch', 'gb_man_taunt_stand'], '9장 끝', LIGHT=LIGHT_B)
cut('gb_cut_snow_evening', 'A deep-blue snowy evening: a little house on a hill at the UPPER LEFT with ONE warm amber window glowing (a soft light layer); small figures seen FROM BEHIND walking up the snowy path toward the house at the upper LEFT (so they move to the LEFT): the grandmother and grandfather side by side, his arm around her shoulders, then the two threshers, the two mowers, ONE cow and ONE pig — in their own colours, NOT silhouettes, small, no faces visible. Their hats and hair seen from behind must match the reference sprites: the grandmother a white hair bun and NO hat, the grandfather a straw-gold knitted bobble hat, mower 1 a teal knitted bobble hat, mower 2 a bean-red flat cap, thresher 1 bare short cocoa hair, thresher 2 a cobalt headscarf with a long braid. Falling snowflakes; dark fir branches in front at the sides. NO gingerbread man, NO fox. ' + CAST,
    'deep indigo #1F2A56, twilight blue #2E3F7A, lavender dusk #8B7BB8 sky, ice blue #DCEBF5 snow, ember amber #F2B366 window, ink #2E241C fir branches', ['_refsheet_elders_stand', '_refsheet_workers_stand', '_refsheet_animals_stand'], '11장 끝', LIGHT=LIGHT_WIN)

# ── 표지·썸네일 ───────────────────────────
def key(pid, frame, scene, refs, out, aspect):
    p = KEY_HEAD + frame + '\n\nSCENE INSIDE THE WINDOW:\n' + TALE + '\n' + scene + '\n\n' + FC + '\n\nMatch the characters in the reference images exactly (same shapes, colours, clothes, markings).\n\n' + KEY_TAIL
    if 'WINDOW' not in frame: p = p.replace('SCENE INSIDE THE WINDOW:', 'SCENE:')
    J(id=pid, kind='key', **{'pass': 6}, refs=[RAW + f'{r}.png' for r in refs], out=out, aspect=aspect, prompt=p)
WIN = ('FRAME (most important):\nThe whole {asp} canvas is ONE flat sheet of warm cream cardstock (#f5efe9) with fine paper grain. A large window is cut out of it in the shape of a '
       'plump GINGERBREAD-MAN cookie outline (round head, short round arms and legs). It is centred horizontally, {pos}. The scene is seen THROUGH this window, built from 3 or 4 layered paper depth planes behind the sheet; '
       'the window edge shows the sheet thickness with a soft inner shadow along the top and inner edges and a light cut edge at the bottom. {rest} '
       'Around the rim, two small flat paper fir sprigs with red ribbons overlap the edge at the upper-left and upper-right. Nothing else on the cream sheet.')
key('gb_key_land', WIN.format(asp='wide 16:9', pos='its top at about 4% of the height and its height about 74% of the canvas HEIGHT',
                              rest='The lower 22% of the canvas below the window and both side areas are plain empty cream paper (a title is placed there later).'),
    'A snowy hill lane under a wide pale sky; from the left a long line of chasers (grandmother, grandfather, threshers, mowers, cow, pig) runs to the right; at the front, BIG and clear, ONE gingerbread man looks back laughing. Rich colours at the edges and far back.',
    ['gb_man_run_lookback', 'gb_granny_reach_run', 'gb_cow_run', 'gb_pig_run'], 'assets/raw/keyart_gpt/gingerbread_wide_v1.png', 'landscape 16:9')
key('gb_key_port', WIN.format(asp='portrait 3:4', pos='its top at about 5% of the height, its width about 80% of the canvas width',
                              rest='The lower 20% of the canvas below the window is plain empty cream paper (a title is placed there later).'),
    'Stacked from top to bottom (a DIFFERENT composition, not a crop): snowy fir branches at the top; in the middle ONE gingerbread man BIG with both arms spread; at the bottom a row of the chasers\' faces (grandmother, grandfather, cow, pig) peeking up.',
    ['gb_man_jump_out', 'gb_granny_face', 'gb_grandpa_face', 'gb_cow_face', 'gb_pig_face'], 'assets/raw/keyart_gpt/gingerbread_tall_v1.png', 'portrait 3:4')
key('gb_thumb', 'COMPOSITION (most important):\nA landscape 4:3 thumbnail tile, a full-bleed rectangular paper diorama picture (no cream sheet, no window, no border, no frame). Only 2 or 3 flat paper depth planes.',
    'ONE gingerbread man BIG in the centre-left (his face large and clear) running and smiling, one snow bank layer and one snowy fir branch layer, a pale winter sky.',
    ['gb_man_run_a'], 'assets/raw/keyart_gpt/gingerbread_tile_v1.png', 'landscape 4:3')

for j in jobs: assert len(j['refs']) <= 5, j['id']
assert len({j['id'] for j in jobs}) == len(jobs)
json.dump(jobs, open(os.path.join(G, 'tools/app/gen/jobs_gingerbread.json'), 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(jobs), sorted(Counter((j['kind'], j['pass']) for j in jobs).items()))
