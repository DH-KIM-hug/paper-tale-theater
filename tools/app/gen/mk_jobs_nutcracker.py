#!/usr/bin/env python3
"""호두까기 인형(nutcracker) 그림 작업표 tools/app/gen/jobs_nutcracker.json 을 만든다 — tales/nutcracker/PLAN.md §3 자세표, §6 무대·컷·라이트박스, §9 그림 목록 그대로(124장).
틀은 mk_jobs_gingerbread.py, mk_jobs_elves_shoemaker.py 와 같다(스타일 문단은 jobs_byeoljubu.json 에서 가져옴).
  python3 tools/app/gen/mk_jobs_nutcracker.py
pass 1: 기준 자세 11장(클라라가 첫 그림, 크기 1.00) / pass 2: 기준 그림을 참고로 넣는 자세·행진 둘째 프레임·말풍선 얼굴 / pass 3: 소품·앞 가림 / pass 4: 배경 / pass 5: 컷 / pass 6: 표지·썸네일·뒷표지
확정(2026-11-27 사용자, 판단 1~5 권장안): 발레 계열 11장, 이름 클라라, 큰 호두에 턱 삐끗 + 파란 손수건, 빈 깔개 슬리퍼, 한 정원의 꽃의 왈츠와 사탕 요정, 9장 눈송이 숲만 라이트박스.
기획 id 는 접두어 없이 적혀 있으므로 모두 nc_ 를 붙인다(`cut_knot` = `nc_cut_knot`, `thumb` = nc_thumb, `key_land` = nc_key_land).
보는 쪽: 기획 §3 자세표의 '보는 쪽' 칸(관객 화면 기준 좌·우·정면)을 프롬프트 DIRECTION 문단과 note 에 그대로 적는다. 정면 자세는 뒤집지 않는다.
파란 매듭(prop_cloth_knot)과 슬리퍼, 상자, 호두는 따로 그린 소품이다. 인물 그림에는 그리지 않는다(코드가 턱·목·손끝에 붙임). 컷과 표지는 한 장 그림이라 함께 그린다.
광원: 인물·소품 그림은 세트 A 문장. 배경·컷은 기획 §6 — 1~4장(잔치 저녁 등불)과 10·11장은 왼쪽 위(A), 5~9장 한밤 거실·숲은 오른쪽 위(B)."""
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
RAW = 'assets/raw/restyle/nutcracker/'

TALE = ('This is the classic Christmas fairy tale THE NUTCRACKER (after E.T.A. Hoffmann, 1816, and the familiar 1892 ballet story), set in a generic old European family home on Christmas Eve: '
        'a warm parlour with a Christmas tree, a low table, an armchair and a basket; at night a toy march and little mice on the floorboards; then a snowy forest bridge and a garden of sugar flowers. '
        'Simple, warm, gentle, kid-friendly. No Disney look, no film look, no costumes of any specific ballet production, no brand characters.')
NIGHT = ('If it is night, it is a READABLE storybook night: mid-tone navy and blue papers with clear shapes, NOT black, NOT murky. Moonlight and snow light are blue-white, never orange.')
NOFX = 'NO magic sparkles, NO glitter, NO glowing trails, NO stars around anyone.'

SKIN = 'skin warm light peach (#F4C9A8), two round shell-pink (#F8D7E0) cheeks'
C = {
 'clara': ('CLARA, a generic little storybook girl of about seven (a made-up character, NOT based on any real child): a chestnut-brown (#7A4B30) BOB haircut whose ends curl INWARD under the chin line, a round face with round cheeks, '
           'a paper-cream (#F6ECD8) long-sleeved blouse, an apricot (#E8AA87) apron, a plum (#7B4F68) knee-length skirt, cream-white (#F4F6FA) stockings, '
           'and low cream (#F6ECD8) house slippers on both feet, ' + SKIN + '. Proportions: 2.5 heads tall (a big round head). Her standing height is the size unit 1.00.'),
 'fritz': ('FRITZ, Clara\'s older brother, a generic storybook boy of about nine (a made-up character): a NARROW chin, STRAIGHT level eyebrows, short dark-brown (#4E3524) CURLS only on the forehead, '
           'a paper-cream shirt, a brick-red (#B5543C) waistcoat, navy (#354866) knee trousers, navy stockings and cocoa (#4E3524) shoes, ' + SKIN + '. 2.5 heads tall, 1.10 times Clara\'s height.'),
 'godfather': ('GODFATHER DROSSELMEYER, a kind generic old clockmaker uncle: a LONG nose, eyes that fold into crescents when he smiles, grey (#A9A39B) hair only at the SIDES of the head (the top is bare skin), '
               'a plum (#7B4F68) long coat with two WIDE pockets, a straw-gold (#D9A94E) waistcoat, a paper-cream cravat, cocoa trousers and shoes, ' + SKIN + '. NO eye patch, NO hat, NO cape. '
               '2.5 heads tall, 1.32 times Clara\'s height.'),
 'doll': ('the NUTCRACKER DOLL, a little wooden toy who comes alive (a living character): a light-wood (#E3C9A0) face with a SQUARE wooden JAW piece (a hinged jaw, like a nutcracker toy), '
          'ONE eyebrow set a little HIGHER than the other, a tall deep-indigo (#1F2A56) hat with a bright BLUE (#2E69A3) HATBAND, a bean-red (#A93B32) jacket with straw-gold (#D9A94E) buttons and belt, '
          'deep-indigo trousers and small black-brown (#3B2A20) boots. His height (without the hat) is only 0.42 of Clara\'s height, about 2.5 heads tall. '
          'NO teeth, NO sword, NO weapon, NO beard; empty wooden hands.'),
 'prince': ('the PRINCE (the nutcracker doll changed into a boy, a living character): the SAME eyebrows as the doll (one eyebrow a little HIGHER than the other) and the same squarish jaw, short black-brown (#3B2A20) hair, '
            'a short bean-red (#A93B32) jacket with straw-gold buttons, deep-indigo (#1F2A56) trousers, black-brown boots, ' + SKIN + '. NO crown, NO sword, NO weapon, NO cape. '
            'The blue knot at his neck is a SEPARATE piece added later: do NOT draw any scarf or knot on his neck. 2.5 heads tall, 1.04 times Clara\'s height.'),
 'fairy': ('the SUGAR PLUM FAIRY, a kind grown-up lady (a ballet character, a person, NOT a winged fairy): a WIDE forehead, thin smiling crescent eyes, dark black-brown (#3B2A20) hair BRAIDED and wound into a round bun, '
           'a plum (#7B4F68) skirt made of layered calyx-shaped petals, a rose (#AE5971) bodice, light-green (#B5D16A) sleeves, rose ballet slippers, ' + SKIN + '. '
           'NO wings, NO wand, NO crown, NO tiara. ' + NOFX + ' 2.5 heads tall, 1.12 times Clara\'s height.'),
 'king': ('the MOUSE KING, a funny small storybook mouse (a living animal): ONE single round head only (exactly one head), a PEAR-shaped body, FOLDED-over ears, a warm taupe (#8C7461) body with a paper-cream belly, '
          'a long thin tail, and a SMALL straw-gold (#D9A94E) crown with three low points on his head. Small round eyes. NO teeth, NO fangs, NO claws, NO sword, NO cape. Cute, NOT scary. '
          'His height (paws on the floor to the top of the head, without the crown) is 0.30 of Clara\'s height.'),
 'grey': ('the GREY MOUSE, a cute little storybook mouse (a living animal): a mauve-grey (#988E91) round body, big ROUND ears with shell-pink insides, a long thin tail. NO clothes, NO crown. NO teeth, NO claws. '
          'Height 0.22 of Clara\'s height.'),
 'brown': ('the BROWN MOUSE, a cute little storybook mouse (a living animal): a warm brown (#775B4C) body, a POINTED nose, a WHITE (#F4F6FA) belly, small ears, a long thin tail. NO clothes, NO crown. NO teeth, NO claws. '
           'Height 0.22 of Clara\'s height (the same size as the grey mouse).'),
 'g_round': ('the ROUND-HAT TOY SOLDIER, a little wooden toy soldier who comes alive: a ROUND domed hat in bean red (#A93B32), OCHRE (#D9A94E) shoulder boards, a deep-indigo (#1F2A56) jacket, light-wood (#E3C9A0) hands, '
             'paper-cream trousers and black-brown boots. EMPTY hands (NO rifle, NO sword, NO drum, NO stick, NO weapon). Height 0.36 of Clara\'s height.'),
 'g_flat': ('the FLAT-HAT TOY SOLDIER, a little wooden toy soldier who comes alive: a FLAT-topped tall hat in deep indigo (#1F2A56), TEAL (#5E9290) shoulder boards, a bean-red (#A93B32) jacket, light-wood (#E3C9A0) hands, '
            'deep-indigo trousers and black-brown boots. EMPTY hands (NO rifle, NO sword, NO drum, NO stick, NO weapon). Height 0.36 of Clara\'s height (exactly as big as the round-hat soldier).'),
}
F = {
 'person': 'FACE: two round eyes (a white disc with an ink #2A2A2A disc), two small eyebrow strips (the eyebrows show the mood), a small nose piece, a curved paper-strip mouth, two round shell-pink cheeks. No eyelashes, no glossy highlights.',
 'doll': 'FACE (a living wooden doll): two round painted eyes (a white disc with an ink disc), two eyebrow strips with ONE set a little higher, two round rose cheek dots, and a SQUARE hinged wooden jaw piece as the mouth; the inside of an open mouth is ONE flat dark piece — NO teeth. No eyelashes, no glossy highlights.',
 'mouse': 'FACE (a living animal): two small round ink eyes, a tiny shell-pink nose, a small curved mouth with NO teeth, short whisker strips. No eyelashes, no glossy highlights.',
 'guard': 'FACE: the little wooden face has NO painted features at all (no eyes, no mouth); it is mostly hidden by the hat brim because the soldier is seen in three-quarter BACK view, so the hat and shoulder boards show first.',
}
FKEY = {'clara': 'person', 'fritz': 'person', 'godfather': 'person', 'prince': 'person', 'fairy': 'person', 'doll': 'doll', 'king': 'mouse', 'grey': 'mouse', 'brown': 'mouse', 'g_round': 'guard', 'g_flat': 'guard'}
MEASURE = {'clara': 'the hair width just above the ears', 'fritz': 'the forehead width', 'godfather': 'the width at the temples', 'prince': 'the width at the temples', 'fairy': 'the width at the temples',
           'doll': 'the width of the wooden jaw', 'king': 'the cheek width below the ears', 'grey': 'the cheek width below the ears', 'brown': 'the cheek width below the ears',
           'g_round': 'the width of the body board (torso)', 'g_flat': 'the width of the body board (torso)'}
DIR = {
 'L': 'DIRECTION (most important): the figure faces the LEFT side of the picture (the viewer\'s left). The nose, eyes and front of the body point LEFT. NOT facing right, NOT facing the viewer.',
 'R': 'DIRECTION (most important): the figure faces the RIGHT side of the picture (the viewer\'s right). The nose, eyes and front of the body point RIGHT. NOT facing left, NOT facing the viewer.',
 'F': 'DIRECTION (most important): FRONT VIEW, the face turned straight toward the viewer (symmetrical), NOT a side view.',
}
DIR_GUARD = ('DIRECTION (most important): the soldier is turned toward the RIGHT side of the picture (the viewer\'s right) and seen in three-quarter BACK view: we see the back of the hat, the back and one shoulder board, and he steps toward the RIGHT. NOT turned to the left, NOT facing the viewer.')
DIRK = {'L': '좌', 'R': '우', 'F': '정면'}
FRAMING = {
 'sq': 'FRAMING:\nSquare 1:1 image. The whole figure is visible and centred, filling about 80% of the frame. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
 'wide': 'FRAMING:\nLandscape 3:2 image. The whole figure is visible and centred, filling about 85% of the frame width. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
}
NOMAG = ('\nNO magenta, hot-pink or bright purple anywhere inside the subject (plum and rose stay clearly darker and browner than the magenta background).'
         '\nNO white outline, NO sticker border, NO light rim around the figure: the outer edge is the clean cut edge of the paper itself.')

def sp_tail(shape):
    t = SP_TAIL
    t = t.replace(t[t.index('FRAMING:'):t.index('LIGHTING:')], FRAMING[shape] + '\n\n')
    if t.rstrip().endswith('NO magenta or hot-pink anywhere inside the subject.'):
        t = t.rstrip()[:-len('NO magenta or hot-pink anywhere inside the subject.')].rstrip()
    return t + NOMAG

jobs = []
def J(**k): jobs.append(k); return k
def SAME(who): return ('The SAME character as the first reference image. SAME SCALE AS THE REFERENCE: the head, face, eyes and body are exactly the same size as in the reference image '
                       f'(measure by {MEASURE[who]}); only the pose and expression change as described. Keep every colour, piece and marking of the reference exactly. ')

def char(who, pid, pose, d, scenes, ref=None, shape='sq', note='', other=None, extra_refs=(), look=''):
    """d: 보는 쪽 'L'|'R'|'F'(관객 화면 기준). ref: 같은 인물 기준 자세. other=(id, 문장) 또는 목록: 다른 인물을 크기·종이 결 참고로만. look: 보는 대상(note 용)."""
    pid = 'nc_' + pid
    refs, same = [], ''
    if ref: refs.append(RAW + f'nc_{ref}.png'); same = SAME(who)
    for r in extra_refs: refs.append(RAW + f'nc_{r}.png')
    if other:
        for o in (other if isinstance(other, list) else [other]):
            refs.append(RAW + f'nc_{o[0]}.png'); same += o[1] + ' '
    dtxt = DIR_GUARD if who.startswith('g_') else DIR[d]
    p = (SP_HEAD + 'SUBJECT AND POSE:\n' + TALE + '\n' + same + C[who][0].upper() + C[who][1:] + '\nPOSE AND EXPRESSION: ' + pose + '\n' + dtxt +
         '\nHANDS: EMPTY hands unless the pose names an object; never another character, a box, a nut, a cloth or a slipper in the hands (those are separate pieces added later).\n\n'
         + F[FKEY[who]] + ' Objects that are not characters have NO face. ' + NOFX + '\n\n' + sp_tail(shape))
    J(id=pid, kind='sprite', **{'pass': 2 if (ref or extra_refs) else 1}, refs=refs, size=[840, 560] if shape == 'wide' else [600, 600], out=RAW + f'{pid}.png',
      **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), note=f'{scenes}장. 보는 쪽: {DIRK[d]}{"(" + look + ")" if look else ""}. {note}'.strip(), prompt=p)

def face(who, base, mood):
    char(who, f'{who}_face', f'ONLY THE HEAD (and the top of the neck) of this character, cut out on its own, {mood}, looking at the viewer. '
         'The bottom edge is cut cleanly under the chin. No body. This is a speech-bubble face icon.', 'F', 'T.faceArt 말풍선', base, note='말풍선 얼굴(기준 자세 머리 폭·눈썹·입 참고, 뒤집지 않음)')

def frame_b(who, pid, base, change, d, scenes, look=''):
    """행진 둘째 프레임: 기준 차렷 + 첫 프레임을 함께 참고, 몸통 폭·발바닥 위치 고정, 팔만 바뀜"""
    char(who, pid, 'EXACTLY the same position, size, feet placement and body as the SECOND reference image (the first marching frame); this is the SECOND animation frame of the same march. ONLY this changes: ' + change,
         d, scenes, base, extra_refs=[pid[:-1] + 'a'], look=look, note=f'nc_{pid[:-1]}a 의 둘째 프레임(발바닥 높이 고정)')

def prop(pid, desc, scenes, shape='sq', ref=None, note='', pas=3, scale=''):
    pid = 'nc_' + pid
    refs = [RAW + f'nc_{r}.png' for r in ([ref] if isinstance(ref, str) else (ref or []))]
    p = (SP_HEAD + 'SUBJECT AND POSE:\nAn OBJECT (not a character) for the Christmas fairy tale The Nutcracker (an old European family parlour, a snowy forest, a garden of sweets): ' + desc +
         (' ' + scale if scale else (' Draw it in the SAME paper style and at the same scale as the attached reference image.' if ref else '')) +
         ' Shown alone, centred.\n\nThis is an OBJECT, not a character: NO face, NO eyes, NO mouth anywhere on it. ' + NOFX + '\n\n' + sp_tail(shape))
    J(id=pid, kind='sprite', **{'pass': pas}, refs=refs, size=[840, 560] if shape == 'wide' else [600, 600], out=RAW + f'{pid}.png',
      **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), note=f'{scenes}장. {note}'.strip(), prompt=p)

# ── 기준 자세 11장(pass 1) ─────────────────
CL = 'clara_wave'
def SCALE_P(who, k): return ('The reference image is a DIFFERENT character (the girl Clara) shown ONLY for paper style and size: draw ' + who + ' NOT like her, with a completely DIFFERENT face, ' + k)
char('clara', CL, 'standing on both feet in three-quarter view, one hand raised at shoulder height WAVING, the other arm relaxed. HAPPY: cheeks lifted in a big smile.', 'R', '1', look='문간의 대부',
     note='기준 자세(키 1.00, 귀 위 머리카락 폭 기준). 첫 그림')
char('fritz', 'fritz_wait', 'standing with both hands clasped BEHIND his back, leaning a little forward, peeking toward a door. EXPECTANT: eyes wide and bright.', 'R', '1', look='문',
     other=(CL, SCALE_P('the boy Fritz', 'his height 1.10 of hers and his head 1.10 times as wide as her head.')), note='기준 자세(1.10, 이마 폭 기준)')
char('godfather', 'godfather_arrive', 'standing, both EMPTY arms held together at waist height, forearms forward and flat as if ready to carry a box from below (the box is NOT drawn). Eyes folded in a warm smile.', 'L', '1', look='문 안의 남매',
     other=(CL, SCALE_P('the old godfather', 'his height 1.32 of hers and his head 1.32 times as wide as her head.')), note='기준 자세(1.32, 관자놀이 폭 기준). 상자는 소품')
char('doll', 'doll_rest', 'standing straight, both arms held close against the sides of the body (as if leaning on a small stand, the stand is NOT drawn). A small smile with the wooden jaw closed.', 'L', '2', look='클라라',
     other=(CL, SCALE_P('the little wooden nutcracker doll', 'his height (without the hat) only 0.42 of her height.')), note='기준 자세(0.42, 나무 턱 폭 기준). 손수건·매듭 없음')
char('prince', 'prince_bow', 'standing on both feet, one hand placed on his chest, bowing a little from the waist. The SAME small smile as the doll.', 'L', '8', look='클라라',
     other=[(CL, SCALE_P('the prince', 'his height 1.04 of hers and his head 1.04 times as wide as her head.')),
            ('doll_rest', 'The second reference image is the nutcracker doll he was changed from: copy ONLY his eyebrows (one higher), the squarish jaw and the red-and-indigo colours; he is a boy now, NOT wooden.')],
     note='기준 자세(1.04, 관자놀이 폭 기준). 목 매듭은 소품')
char('fairy', 'fairy_welcome', 'standing at a garden gate with both arms spread wide open in welcome, feet together. BRIGHT crescent-eyed smile.', 'L', '10', look='두 손님',
     other=(CL, SCALE_P('the Sugar Plum Fairy', 'her height 1.12 of hers and her head 1.12 times as wide as her head.')), note='기준 자세(1.12, 관자놀이 폭 기준). 날개·지팡이·마법 효과 없음')
char('king', 'king_peek', 'low on all four paws, stretching the snout forward as if poking it out of a hole (the hole is NOT drawn), ears up. CURIOUS.', 'L', '6', look='인형',
     other=(CL, SCALE_P('the mouse king', 'his height 0.30 of her height.')), note='기준 자세(0.30, 귀 아래 볼 폭 기준). 머리 하나·작은 왕관')
char('grey', 'mouse_grey_in', 'body held low, head poking forward as if out of a hole (the hole is NOT drawn). CURIOUS round eyes.', 'L', '6', look='왕 너머 인형',
     other=('king_peek', 'The reference image is a DIFFERENT character (the mouse king) shown ONLY for paper style and size: draw a different, plain little mouse with NO crown, his height 0.22 while the king is 0.30.'), note='기준 자세(0.22)')
char('brown', 'mouse_brown_in', 'belly held low to the floor, pointed nose lifted. CURIOUS: the nose tip wrinkled as if sniffing.', 'L', '6', look='왕',
     other=('mouse_grey_in', 'The reference image is a DIFFERENT mouse (the grey mouse) shown ONLY for paper style and size: draw a different brown mouse with a pointed nose and a white belly, EXACTLY the same size.'), note='기준 자세(0.22)')
char('g_round', 'guard_round_stand', 'standing at attention, feet together, arms straight at the sides, back straight; seen in three-quarter BACK view so the round hat and ochre shoulder boards show first.', 'R', '6', look='인형의 신호',
     other=(CL, SCALE_P('a little wooden toy soldier', 'his height only 0.36 of her height.')), note='기준 자세(0.36, 몸통 판 폭 기준). 빈손, 얼굴 무늬 없음')
char('g_flat', 'guard_flat_stand', 'standing at attention, feet together, EMPTY hands held together behind the back, back straight; seen in three-quarter BACK view so the flat hat and teal shoulder boards show first.', 'R', '6', look='인형의 신호',
     other=('guard_round_stand', 'The reference image is a DIFFERENT toy soldier (the round-hat soldier) shown ONLY for paper style and size: a different hat and colours, EXACTLY the same body size.'), note='기준 자세(0.36). 빈손, 얼굴 무늬 없음')

# ── 클라라(17 + 얼굴) ─────────────────────
SL1 = ' One of her feet has NO slipper on it and shows only its cream-white stocking (the slipper is a separate object).'
char('clara', 'clara_receive', 'bending her knees a little and holding out both EMPTY hands together, palms up, as if a box is coming down to her (the box is NOT drawn). EXPECTANT: lips slightly parted.', 'R', '2', CL, look='내려오는 상자')
char('clara', 'clara_laugh', 'standing straight, the fingertips of both hands gathered beside one cheek. LAUGHING: eyes curved into half moons.', 'R', '2', CL, look='뚜껑 아래 인형')
char('clara', 'clara_worry', 'one hand resting on a table edge (the table is NOT drawn), leaning forward and down close to look at something low. WORRIED: inner ends of the eyebrows raised, mouth small.', 'R', '3', CL, look='기운 나무 턱')
char('clara', 'clara_tie', 'kneeling on ONE knee, both hands held forward at chest height with the fingertips pinched together as if tying a small cloth (the cloth is NOT drawn). CONCENTRATING: lips pressed together.', 'R', '4', CL, look='턱 밑의 천')
char('clara', 'clara_kneel_hug', 'kneeling on both knees, both EMPTY arms held forward in a round open circle as if gently holding a small doll against her (the doll is NOT drawn; leave the space inside the arms empty). A small reassuring smile.', 'R', '4', CL, look='팔 사이 인형', note='팔 안은 비움(인형은 따로)')
char('clara', 'clara_yawn', 'SITTING (the chair is NOT drawn; she sits on nothing), covering her mouth with the back of one hand, YAWNING: eyes squeezed into creases, mouth round.', 'F', '4', CL, look='좌판 앞쪽')
char('clara', 'clara_doze', 'SITTING curled forward with a rounded back, her head resting on her folded arms (the chair is NOT drawn), ASLEEP: eyes closed in soft curves; the head is at the RIGHT side of the figure.', 'R', '4', CL, look='머리는 바구니 쪽')
char('clara', 'clara_listen', 'SITTING (the chair is NOT drawn), one hand pressing on an invisible armrest, head tilted with one ear turned to listen. LISTENING: eyes narrowed.', 'L', '5', CL, look='시계')
char('clara', 'clara_amaze', 'SITTING up straight (the chair is NOT drawn), chin lifted, looking UP above her head. AMAZED: eyes and mouth round.', 'F', '5', CL, look='머리 위 가지')
char('clara', 'clara_turn', 'SITTING (the chair is NOT drawn), twisting the waist and head to look DOWN toward the lower right. HOLDING HER BREATH: eyebrows drawn together.', 'R', '5·6', CL, look='바구니에서 인형 앞 깔개로')
char('clara', 'clara_toss', 'SITTING at the front edge of a seat (the chair is NOT drawn), one leg drawn back, one EMPTY hand reaching forward LOW as if it has just let go of something.' + SL1 + ' DETERMINED: mouth closed firmly.', 'R', '7', CL, look='생쥐 앞 빈 깔개', note='슬리퍼는 소품(한 짝은 스타킹 발)')
char('clara', 'clara_meet', 'standing on both feet (both slippers on), the fingertips of one hand touching her OWN neck. Recognising a friend: a WIDE happy smile.', 'R', '8', CL, look='왕자의 목과 눈')
char('clara', 'clara_reach', 'standing, her body facing the LEFT edge of the picture as if about to walk left, but her head turned back over her shoulder toward the RIGHT; one EMPTY arm stretched back toward the right. A trusting smile.', 'R', '9', CL, look='어깨너머 반걸음 뒤 왕자의 손', note='몸은 왼쪽, 얼굴만 오른쪽')
jobs[-1]['prompt'] = jobs[-1]['prompt'].replace(DIR['R'], 'DIRECTION (most important): the BODY points to the LEFT side of the picture, the HEAD is turned back over the shoulder so the face looks to the RIGHT (the viewer\'s right). The back arm reaches to the RIGHT.')
char('clara', 'clara_snow', 'standing, one hand held back behind her (toward the right), the other hand held out in front with the palm open flat and facing up. AMAZED: mouth open in wonder.', 'L', '9', CL, look='난간 위에서 손으로 오는 눈송이')
char('clara', 'clara_clap', 'standing, leaning the upper body forward, both hands clapping together in front of the chest. LAUGHING with a big open mouth.', 'R', '10', CL, look='요정 발끝의 꽃')
char('clara', 'clara_stretch', 'SITTING (the chair is NOT drawn), both arms stretched high above the head in a morning stretch. Just woken: eyes narrowed sleepily, a small smile.', 'F', '11', CL, look='햇살 든 좌판 앞')
char('clara', 'clara_cradle', 'SITTING (the chair is NOT drawn), both EMPTY arms gathered close against her chest in a small cradle as if hugging a little doll (the doll is NOT drawn; leave the space inside the arms empty). A TENDER just-woken smile, looking down.', 'R', '11', CL, look='품 안의 작은 인형', note='팔 안은 비움(인형은 따로)')
face('clara', CL, 'a bright friendly smile')

# ── 프리츠(7 + 얼굴) ──────────────────────
FR = 'fritz_wait'
char('fritz', 'fritz_nudge', 'standing, one elbow lifted a little out to the side, head turned to his little sister. GLAD: eyebrows raised.', 'L', '1', FR, look='클라라')
char('fritz', 'fritz_peek', 'leaning the upper body forward to peek DOWN into something low in front of him (not drawn). CURIOUS: eyes wide.', 'L', '2', FR, look='열린 상자')
char('fritz', 'fritz_show', 'standing, one hand held out with the palm open and turned UP as if showing something small on it (the nut is NOT drawn; the palm is empty). PROUD smile.', 'L', '3', FR, look='인형 너머 클라라', note='호두는 소품')
char('fritz', 'fritz_press', 'standing, one EMPTY hand lowered with the fingertips pressing DOWN on something low in front of him (not drawn). EXCITED eyes.', 'L', '3', FR, look='인형 입의 호두')
char('fritz', 'fritz_flinch', 'pulling both hands back toward his chest with the fingers spread open. STARTLED: mouth frozen in a small "o".', 'F', '3', FR, look='굴러오는 호두')
char('fritz', 'fritz_sorry', 'standing with the shoulders lowered, hands hanging together in front, head tipped a little. SORRY: eyebrows drooping, a small sad mouth.', 'L', '3', FR, look='클라라')
char('fritz', 'fritz_listen', 'standing still, both hands folded together in front, head bowed a little, listening quietly. RELIEVED: his worried lips relaxing.', 'L', '4', FR, look='인형에게 말하는 클라라')
face('fritz', FR, 'a cheerful grin')

# ── 대부(5 + 얼굴) ────────────────────────
GF = 'godfather_arrive'
char('godfather', 'godfather_nod', 'standing, both EMPTY arms kept at the same waist height as the reference (ready under an invisible box), nodding the head in a greeting. Mouth open in a glad hello.', 'L', '1', GF, look='손 흔드는 클라라')
char('godfather', 'godfather_offer', 'bending ONE knee and lowering both EMPTY arms forward and down to table height, as if setting a box down (not drawn). A KIND smile.', 'L', '2', GF, look='클라라의 두 손')
char('godfather', 'godfather_pause', 'standing, both hands drawn back to the waist, waiting. PLAYFUL: eyebrows raised, a little secret smile.', 'F', '2', GF, look='탁자 가운데 뚜껑')
char('godfather', 'godfather_point', 'standing, one hand held out with the open palm and fingers pointing DOWN and forward at something low (not drawn). A gentle teaching look.', 'L', '2', GF, look='인형의 네모난 턱')
char('godfather', 'godfather_smile', 'standing one step back, both hands clasped behind his back. A spreading warm smile, eyes folded.', 'L', '2', GF, look='인형에게 인사하는 클라라')
face('godfather', GF, 'a warm folded-eye smile')

# ── 호두까기 인형(9 + 얼굴) ─────────────────
DL = 'doll_rest'
NOKNOT = ' NO cloth or knot on the jaw (a separate piece added later).'
char('doll', 'doll_open', 'leaning back a little (as if against a small stand, NOT drawn), the square wooden JAW opened DOWN wide like a nutcracker toy; the inside of the mouth is ONE flat dark piece, NO teeth.', 'R', '3', DL, look='프리츠 손끝의 호두')
char('doll', 'doll_loose', 'leaning a little to one side, shoulders tilted; the square wooden jaw piece hangs slightly CROOKED to one side (the toy hinge came loose; he is NOT hurt, no damage marks). A lopsided mouth, calm eyes.', 'L', '3·4', DL, look='머리는 클라라 쪽')
char('doll', 'doll_tucked', 'LYING on his side, arms held against the body, resting peacefully; the HEAD is at the LEFT end and the boots at the right end. Eyes softly lowered.' + NOKNOT, 'L', '4', DL, shape='wide', look='머리는 의자 쪽')
char('doll', 'doll_rise', 'pushing himself up with both hands pressing on an invisible edge (a basket rim, NOT drawn), the upper body rising. One eye WINKING, the other open.' + NOKNOT, 'L', '5', DL, look='의자의 클라라')
char('doll', 'doll_lead', 'standing with the feet together, one elbow lifted as if calling a line to follow, the EMPTY hand raised at head height. BRAVE: eyebrows firm.' + NOKNOT, 'L', '6', DL, look='뒤따르는 병정')
char('doll', 'doll_brace', 'standing with both arms held close to the body, his back leaning against something behind him (a chair leg, NOT drawn), watchful. ALERT: eyes watching carefully.' + NOKNOT, 'R', '6·7', DL, look='좁아진 깔개')
char('doll', 'doll_relax', 'standing, the stiff shoulders loosened, both hands lowered. RELIEVED: eyes softened.' + NOKNOT, 'R', '7', DL, look='비어 가는 마루')
char('doll', 'doll_thanks', 'standing on both feet, one hand placed on his chest, bowing the head. A relieved, thankful smile.' + NOKNOT, 'L', '8', DL, look='클라라')
char('doll', 'doll_nestle', 'leaning back at a slant, both arms folded over the chest, as if resting against someone\'s chest (nobody is drawn); the HEAD is tilted to the LEFT. A calm little wooden smile in the morning.' + NOKNOT, 'L', '11', DL, look='머리는 클라라 품 쪽', note='11장 크기 = 2장 원래 크기')
face('doll', DL, 'a small friendly wooden smile with the jaw closed')

# ── 왕자(9 + 얼굴) ────────────────────────
PR = 'prince_bow'
char('prince', 'prince_knot', 'standing, chin lifted, the fingertips of one hand touching the SIDE of his own neck (the knot there is NOT drawn). GLAD: one eyebrow raised.', 'L', '8', PR, look='매듭을 알아본 클라라')
char('prince', 'prince_invite', 'standing, one arm opened out to the side, making room next to him. EXPECTANT: waiting for an answer.', 'L', '8', PR, look='클라라')
char('prince', 'prince_guide', 'standing, one EMPTY hand held out forward with the palm turned UP, offering his hand. Reassuring smiling eyes.', 'L', '9', PR, look='돌아보는 클라라')
char('prince', 'prince_follow_flake', 'standing, one arm kept low and forward at the same height as before (holding an invisible hand), the head lifted to look UP. AMAZED: eyes wide.', 'F', '9', PR, look='난간 위로 떠오른 눈송이')
char('prince', 'prince_cross', 'standing with both feet side by side, one arm held forward at a child\'s hand height (holding an invisible hand). An easy smile.', 'L', '9', PR, look='다리 건너편')
char('prince', 'prince_gate', 'standing, one arm raised HIGH and pointing forward at a gate. PROUD shining eyes.', 'R', '10', PR, look='웨이퍼 문')
char('prince', 'prince_guest', 'standing, both hands folded together in front, bowing the head politely. A polite smile.', 'R', '10', PR, look='인사하는 요정')
char('prince', 'prince_listen', 'standing, leaning one ear and shoulder toward a friend beside him, listening. A spreading smile at the sound of clapping.', 'L', '10', PR, look='클라라')
char('prince', 'prince_petal', 'hands lowered, knees bent a little, looking DOWN at a flower low in front of him (not drawn). Calm smiling eyes.', 'R', '10', PR, look='마지막 꽃잎')
face('prince', PR, 'a gentle smile with one eyebrow a little higher')

# ── 사탕 요정(5 + 얼굴) ─────────────────────
FA = 'fairy_welcome'
char('fairy', 'fairy_curtsy', 'spreading the petal skirt with both hands and bending the knees in a welcoming CURTSY. A warm smile, cheeks lifted.', 'L', '10', FA, look='인사하는 왕자')
char('fairy', 'fairy_bud', 'standing on tiptoe with the feet together, both arms curved down and in front as if shaping a flower bud. Lips gently pursed in anticipation.', 'F', '10', FA, look='발끝 앞 봉오리')
char('fairy', 'fairy_turn', 'turning in a dance, one arm stretched HIGH, the body turning toward the right. JOYFUL: eyes wide open.', 'R', '10', FA, look='막 펴진 꽃잎')
char('fairy', 'fairy_listen', 'stopped from turning, one hand raised to her ear, listening. A bright smile at the clapping.', 'L', '10', FA, look='클라라')
char('fairy', 'fairy_finish', 'both arms lowered and gathered in a round curve in front, a quiet final bow of the dance. A calm closed-mouth smile.', 'F', '10', FA, look='접히는 마지막 꽃잎')
face('fairy', FA, 'a warm crescent-eyed smile')

# ── 생쥐 왕(4 + 얼굴)·회색·밤색 생쥐 ─────────────
KG, GM, BM = 'king_peek', 'mouse_grey_in', 'mouse_brown_in'
char('king', 'king_call', 'standing up on the hind legs, both front paws spread open in a greeting. A big open-mouth smile (NO teeth).', 'L', '6', KG, look='인형과 병정')
char('king', 'king_beckon', 'standing, the body turned so the head looks back over the shoulder, one front paw raised waving "come on". One eye winking.', 'R', '6', KG, look='뒤따르는 두 생쥐')
char('king', 'king_startle', 'both front paws pulled together at the chest, the body shrinking back. STARTLED: round eyes, round mouth (NO teeth).', 'L', '7', KG, look='깔개에 떨어진 슬리퍼')
char('king', 'king_turn', 'on all four paws, turning the body around toward the exit, front paws stepping to the right. Calling out in surprise (mouth open, NO teeth).', 'R', '7', KG, look='벽구멍')
face('king', KG, 'a cheerful open-mouth smile with NO teeth, the small crown on top')
char('grey', 'mouse_grey_ear', 'sitting up tall, the round ears tilted toward someone. Eyes shining at being called.', 'L', '6', GM, look='앞발 든 왕')
char('grey', 'mouse_grey_jump', 'front paws tucked in, the back arched up in a little jump of surprise. STARTLED: eyes wide.', 'L', '7', GM, look='슬리퍼가 닿은 곳')
char('grey', 'mouse_grey_out', 'turning toward the exit, ears laid back, hind legs gathered ready to scurry. Mouth shut tight.', 'R', '7', GM, look='벽구멍')
char('brown', 'mouse_brown_sniff', 'front paws spread on the floor, sniffing the floor with the pointed nose. Eyes narrowed.', 'F', '6', BM, look='코밑의 깔개')
char('brown', 'mouse_brown_freeze', 'frozen on all four paws, the tail curled around, ears straight up. STARTLED face.', 'L', '7', BM, look='소리가 난 자리')
char('brown', 'mouse_brown_out', 'turned around toward the exit, belly held low to the floor, ready to scurry. Eyebrows raised, tense.', 'R', '7', BM, look='회색 생쥐 뒤 출구')

# ── 병정 둘(행진 2프레임씩) ───────────────────
GRS, GFS = 'guard_round_stand', 'guard_flat_stand'
char('g_round', 'guard_round_march_a', 'MARCHING frame 1: both feet flat on the floor, the LEFT arm swung forward and the right arm back, shoulders lifted proudly; three-quarter BACK view.', 'R', '6', GRS, look='인형 뒤 행진 자리', note='행진 첫 박')
frame_b('g_round', 'guard_round_march_b', GRS, 'the RIGHT arm is swung forward and the left arm back (the feet stay exactly where they are, flat on the floor). Back held straight.', 'R', '6', look='인형 뒤 행진 자리')
char('g_flat', 'guard_flat_march_a', 'MARCHING frame 1: both feet flat on the floor, the RIGHT arm raised to chest height, shoulders held upright; three-quarter BACK view.', 'R', '6', GFS, look='둥근 모자 병정 옆', note='행진 첫 박')
frame_b('g_flat', 'guard_flat_march_b', GFS, 'the LEFT arm is raised and the right arm lowered (the feet stay exactly where they are, flat on the floor); the flat hat tilts very slightly with the beat.', 'R', '6', look='둥근 모자 병정 옆')

# ── 소품 18장(얼굴 없음) ─────────────────────
SC = lambda t: 'The reference image shows a character only for SCALE (do NOT draw the character): ' + t
prop('prop_box', 'a gift BOX without its lid, seen from the front: a bean-red (#A93B32) box with a straw-gold (#D9A94E) ribbon band down the front, the open top showing a dark plum inside edge. Empty.', '1·2', shape='wide', ref=CL,
     scale=SC('the box is 0.56 of the girl\'s height wide.'), note='너비 0.56. 뚜껑과 같은 너비')
prop('prop_lid', 'the LID of the same gift box: a flat bean-red lid with a straw-gold ribbon bow on top, seen from the front, the same width as the box.', '1·2', shape='wide', ref='prop_box', note='상자와 같은 너비')
prop('prop_door', 'a tall wooden parlour DOOR leaf (one door panel only, no frame): bark-brown (#6B4A32) with two cocoa (#4E3524) inset panels and a small straw-gold knob, seen straight from the front.', '1', note='문틀 안에서 열림(문틀은 배경)')
prop('prop_stand', 'a small wooden DOLL STAND: a flat kraft (#C9A574) base with a slanted back board to lean a little toy against, seen in side-front view. Empty.', '2~4', ref=DL, scale=SC('the stand fits a doll of that size leaning on it.'), note='인형 받침')
prop('prop_cloth_knot', 'a small bright BLUE (#2E69A3) cloth wrapped as a band around the bottom of a toy jaw (the jaw is NOT drawn, the band is open in the middle) with a neat KNOT and two short tails at one side, ONE flat piece.', '4~11', ref=DL,
     scale=SC('the band fits exactly around the wooden jaw of that doll (same width as the jaw).'), note='턱 감싼 천+매듭 한 조각. 4~7·11 인형 턱, 8~10 왕자 목 옆')
prop('prop_snow_branch', 'a thin bare winter BRANCH lying sideways with a little snow-white snow on top: bark-brown (#886650) twig pieces, a small flat spot in the middle where a snowflake can rest.', '9', shape='wide', note='다리 아래 눈송이 받침')
prop('prop_nut', 'ONE big round brown WALNUT in its shell: a cocoa-brown (#845A41) walnut with a few pressed groove lines.', '3', ref=DL, scale=SC('the walnut is a little too big for that doll\'s mouth (its diameter about 0.12 of a girl of 1.00, so about a third of the doll\'s height).'), note='지름 0.12')
prop('prop_cloth_blue', 'a small square handkerchief folded once into a soft triangle, lying flat: bright BLUE (#2E69A3), seen from the front.', '4', note='노랑과 같은 접힘·치수. 모자띠와 같은 #2E69A3')
prop('prop_cloth_yellow', 'the SAME folded handkerchief but YELLOW (#E9C04D): EXACTLY the same shape, fold and size as the reference.', '4', ref='prop_cloth_blue', note='파랑과 같은 접힘·치수')
prop('prop_chair', 'a cosy ARMCHAIR seen in three-quarter front view facing RIGHT: plum-brown (#80604D) wood frame, a dusty rose (#C48776) cushion and back, round armrests, empty.', '4~8·11', ref=CL,
     scale=SC('the seat is at 0.38 of the girl\'s height, so she can sit on it.'), note='좌판 0.38. 밤·아침 같은 가구')
prop('prop_basket', 'an oval woven BASKET with low sides seen from the front: straw-gold (#D9A94E) and kraft (#C9A574) woven strips, a small folded paper-cream blanket inside, empty.', '4~8·11', shape='wide', ref=DL,
     scale=SC('the basket\'s inside length is just long enough for that doll lying down.'), note='안쪽 길이 0.52')
prop('prop_slipper', 'ONE low rounded house SLIPPER, cream (#F6ECD8) with a soft round toe and a low opening, seen from the side.', '7·8', ref=CL, scale=SC('the slipper fits that girl\'s foot (length 0.28 of her height).'), note='길이 0.28')
prop('prop_tree', 'a TALL Christmas TREE (a tall upright image): layered pine-green (#3F6B4F) and sage (#70966B) fir tiers with straw-gold (#D9A94E) paper ornaments, a few small bean-red balls and little ember-amber (#F2B366) paper lights, a straw-gold star on top, a bark-brown trunk. The ornaments and lights have NO faces.', '1·4~8·11',
     note='늘어날 때 윗가지가 드러나는 세로 원본. 얼굴 없음')
jobs[-1]['prompt'] = jobs[-1]['prompt'].replace('Square 1:1 image. The whole figure is visible and centred, filling about 80% of the frame.', 'Square 1:1 image. The whole tall tree is visible and centred, filling about 90% of the frame height.')
prop('prop_bridge', 'a small wooden footBRIDGE seen straight from the side: a flat bark-brown (#886650) deck board with a low railing on top (height 0.40 of a girl) and short posts, a little snow on the railing, a gentle flat arch underneath.', '9', shape='wide', note='상판과 난간 포함. 위·아래 눈송이 사이를 가름')
prop('prop_flake', 'ONE big six-pointed SNOWFLAKE cut from snow-white (#F4F6FA) paper with a few small cut holes, flat.', '9', note='같은 그림 두 번 배치')
prop('prop_wafer_gate', 'ONE side of a gate made of stacked WAFER biscuits: a tall pillar and a half-arch of wafer squares in honey (#E9C04D) and caramel (#C48776) with a pressed grid pattern, topped by a small rose (#AE5971) candy.', '10', note='한쪽씩 같은 판 배치')
prop('prop_flower_open', 'ONE SUGAR FLOWER fully OPEN: five rounded petals of pale pink (#E9C5BA) around a honey (#E9C04D) centre, on a short mint (#A3CABB) stem with two leaves.', '10')
prop('prop_flower_bud', 'the SAME sugar flower CLOSED as a bud: the petals folded up tight into a round pale-pink bud on the same mint stem with two leaves.', '10', ref='prop_flower_open', note='핀 꽃과 같은 줄기·크기')

# ── 앞 가림 5장 ──────────────────────────────
prop('fg_pine', 'a fir BRANCH reaching in from a top corner: pine-green (#3F6B4F) and sage (#70966B) needle pieces with one straw-gold ornament (no face).', '1·5·8', shape='wide', note='앞 가림(양끝)')
prop('fg_table', 'the hanging EDGE of a tablecloth: a long strip of bean-red (#A93B32) cloth with a scalloped straw-gold (#D9A94E) border, much wider than tall.', '2~4', shape='wide', note='앞 가림(오른끝 탁자보)')
prop('fg_floor', 'a long low strip of FLOORBOARD edge: bark-brown (#80604D) and cocoa (#775B4C) board ends, much wider than tall.', '6·7', shape='wide', note='앞 가림(마루 테)')
prop('fg_snow', 'a DARK fir BRANCH reaching in from a side: deep green (#355951) and blue-green (#638578) needle pieces with snow-white snow along the top.', '9', shape='wide', note='앞 가림(양끝 짙은 가지)')
prop('fg_petals', 'a cluster of big CALYX petals for a lower corner: plum (#7B4F68), rose (#AE5971) and mint (#A3CABB) petal shapes overlapping.', '10', shape='wide', note='앞 가림(꽃받침). 가운데 누름판·손 가리지 않게 모서리용')

# ── 배경 9장(16:9) ───────────────────────────
COMMON = ('Characters, the tree, the door leaf, the box, the chair, the basket, the bridge, the gate, flowers, snowflakes and pressable items are separate sprites added later. NO people, NO dolls, NO soldiers, NO mice, NO animals.')
def bg(pid, scene, papers, layout, light, ref=None, note='', pas=4, night=False):
    pid = 'nc_' + pid
    p = (BG_HEAD + 'SCENE:\n' + TALE + '\n' + (NIGHT + '\n' if night else '') + scene + ' ' + COMMON + ' SCENE PAPERS: ' + papers + '\n' + layout + '\n' + BG_RICH +
         '\nFRAME:\nNo decorative border. The scene fills the entire frame edge to edge. Flat layered planes only: NO vanishing-point perspective, NO tilted floor.\n\n' + light)
    refs = [RAW + f'nc_{r}.png' for r in ([ref] if isinstance(ref, str) else (ref or []))]
    if refs: p = p.replace('SCENE:\n', 'SCENE:\nThe SAME home (same wall paper, window, floor and paper style) as the reference image; follow the layout described below.\n', 1)
    J(id=pid, kind='bg', **{'pass': pas}, refs=refs, size=[1600, 902], out=RAW + f'{pid}.png', note=note, prompt=p)
LA = 'Light: set A — warm lamp and window light from the UPPER LEFT; shadows to the LOWER RIGHT.'
LB = 'Light: set B — moonlight from the UPPER RIGHT; shadows to the LOWER LEFT.'
bg('bg_party', 'Scene 1: the family PARLOUR on Christmas Eve evening, a party, seen at eye level, wide. ' + LA,
   'wall paper cream #F6ECD8 and a warm taupe #CFB6A0 wainscot; floor bark brown #6B4A32; window frame paper cream with a deep slate #354866 evening sky and snow; a pine green #3F6B4F and sage #70966B garland, bean red #A93B32 ribbons, straw gold #D9A94E stars; a warm ember amber #F2B366 wall lamp glow; plum #7B4F68 curtain; apricot #E8AA87 rug.',
   'Planes back to front: (1) the cream wall with a taupe wainscot band; a WINDOW at the upper RIGHT (x 60-76%, y 10-40%) with plum curtains and snow outside; a small lamp at the upper left with a soft warm glow; '
   '(2) an EMPTY DOOR FRAME at the far RIGHT (x 80-97%, y 22-86%) with a dark slate opening (the door leaf is a separate sprite); the TREE SPOT at the LEFT (x 6-32%, y 8-86%) stays plain wall and floor (the tree is a sprite); '
   '(3) the plank floor from y 82% down with an apricot rug in the middle. The centre (x 32-80%, y 40-100%) stays PLAIN (the children and the godfather stand there).', LIGHT_A, note='1장 잔치 거실. 트리·문짝은 소품, 문틀은 배경')
bg('bg_table', 'Scenes 2, 3 and 4 (first half): a close view of the LOW TABLE in the same parlour, seen at hand height. ' + LA,
   'wall #F6ECD8 and taupe #C9AE91; fir sprigs pine green #3F6B4F with bean red #A93B32 berries; table top chestnut #845A41 with an edge band; straw gold #D9A94E; plum #7B4F68 and apricot #E8AA87 small details; ember amber #F2B366 lamp light.',
   'Planes back to front: (1) the plain cream wall with two FIR SPRIGS and red ribbons hung high at the left and right; (2) a long low wooden TABLE across the lower part (table top line at y 64%, the table front from y 64% to 100%); '
   'the TABLE TOP (x 20-80%, y 50-66%) and the wall above it (x 25-75%, y 14-50%) stay PLAIN (the stand, the box, the doll and two cloths are placed there later; leave the space above the lid empty).', LIGHT_A, ref='bg_party', note='2~4장 손높이 탁자')
bg('bg_chair_evening', 'Scene 4 (end): the same parlour in the evening, seen at the height of a chair seat. ' + LA,
   'wall #F6ECD8 and taupe #D7C4AC; floor bark brown #6B4A32 and chestnut #845A41; sage #8D9D80 and teal grey #54747A rug; plum #7B4F68 curtain; ember amber lamp glow.',
   'Planes back to front: (1) the wall with a window at the upper middle (x 40-58%, y 8-36%); (2) the CHAIR SPOT at the LEFT (x 8-40%, y 30-95%) and the BASKET SPOT at the RIGHT (x 60-90%, y 66-95%) stay plain; '
   'between them (x 40-60%, y 70-100%) an empty floor patch where a child can kneel; (3) the plank floor with a sage rug from y 78%. Simple and calm.', LIGHT_A, ref='bg_party', note='4장 끝 의자 높이. 11장 아침도 이 구도')
bg('bg_parlor_night', 'Scenes 5 and 8: the same parlour at MIDNIGHT, seen at eye level. ' + LB,
   'wall deep indigo #1F2A56 and slate #354866; window frame #637598 with ice #BCD3DF moonlight and snow white #F4F6FA snow; floor plum brown #80604D; tree shadows pine #315C52 and #648678; small bean red #A93B32, blue #2E69A3 and straw gold #D9A94E accents.',
   'Planes back to front: (1) the navy wall; a round WALL CLOCK high at the LEFT (x 6-18%, y 8-30%) with only two clock hands and dot numbers (NO face, NO eyes, NO mouth on the clock); a tall navy window at the upper middle with moonlight; '
   '(2) the TREE SPOT at the right-middle (x 52-80%, y 0-80%) stays plain (the tall tree is a sprite and grows up); the CHAIR SPOT at the left-centre (x 20-48%, y 40-96%) and the BASKET SPOT at the lower right (x 62-88%, y 72-96%) stay plain; '
   '(3) the plank floor from y 82%. Leave the space above the basket empty.', LIGHT_B, ref='bg_party', night=True, note='5·8장 한밤 거실 눈높이. 시계는 바늘만')
bg('bg_floor_night', 'Scenes 6 and 7: the parlour FLOOR at midnight, seen from low near the floorboards, a separate wide set. ' + LB,
   'wall deep indigo #1F2A56 and slate #354866; baseboard #637598; floor kraft #BCA790 and plum brown #80604D boards; a rug pine #315C52 with bean red #A93B32 and teal #5E9290 stripes; dark mouse hole; straw gold #D9A94E small accents.',
   'Planes back to front: (1) the lower navy wall with a baseboard band (y 44-56%); a round-topped MOUSE HOLE in the baseboard at the RIGHT (x 80-92%, y 40-58%), wide enough for a mouse king; '
   '(2) the floorboards from y 56% down and a striped RUG in the CENTRE (x 34-74%, y 66-90%) that stays clearly visible; the CHAIR SPOT at the LEFT (x 4-30%, y 0-90%) stays plain, with enough plain wall above it for a child sitting on the chair (her face up to y 10%); '
   '(3) nothing in the centre: the space between the left and the hole stays open (the doll, soldiers and mice are placed there later). The whole slipper path and the exit stay inside the frame.', LIGHT_B, ref='bg_parlor_night', night=True, note='6·7장 마루 높이. 오른쪽 벽구멍, 가운데 깔개')
SNOW_P = 'sky deep indigo #1F2A56 and #374D6B; far trees grey blue #617B96 and #95B0C5; mid trees deep green #355951 and blue-green #638578; snow pale #CCDCE5 and snow white #F4F6FA; trunks #886650 and #BDA18A; tiny bean red #A93B32 and blue #2E69A3 berries.'
SNOW_L = ('Planes back to front: (1) a night sky seen as if through a window cut between trees; (2) three overlapping rows of snowy fir trees, the far row pale grey-blue, then blue-green, then deep green; '
          '(3) a soft snowy ground band; the BRIDGE SPOT in the CENTRE (x 22-80%, y 30-92%) stays PLAIN single-colour snow and sky (the bridge, the snowflakes and the two friends are placed there later; behind the upper and lower snowflake spots at x 40-52%, y 34-48% and y 68-80% it is one flat colour). '
          'Side view, flat planes, NO perspective.')
bg('bg_snow', 'Scene 9: the SNOWFLAKE FOREST at night, an ordinary layered forest (no light-box glow), seen from the side. A small moon-cream (#F4F6FA) moon piece at the UPPER RIGHT between the trees. ' + LB, SNOW_P, SNOW_L, LIGHT_B, night=True, note='9장 보통 숲(라이트박스 대체용)')
bg('bg_snow_lb', 'Scene 9 LIGHT-BOX version (the ONLY light-box scene of this tale): the SAME snowy forest with the same layout as the reference image, lit like a paper light box: at the UPPER RIGHT, BEHIND a round moon hole cut between the trees, a blue-white light (#F4F6FA to #CCDCE5) shines and spreads softly across the sky paper (a light layer behind the paper that fades with distance — light gradient allowed ONLY for this light; every paper piece stays one flat colour). '
   'The tree rows become silhouettes from far to near: ash blue, pine blue-green, then deep dark green. The light is FIXED behind the trees, NOT a floating disc. The snow stays the same colour everywhere. The front (lower part) is dimmer so the two friends stand in the weaker light. Moonlight is blue-white, NEVER orange. ' + LB,
   SNOW_P, 'Keep the plain BRIDGE SPOT in the centre and the flat single colour behind both snowflake spots EXACTLY as in the reference.', LIGHT_B, ref='bg_snow', night=True, note='9장 라이트박스(판단 5). 인물 합성 검수 통과 시에만, 아니면 nc_bg_snow')
bg('bg_sweets', 'Scene 10: the LAND OF SWEETS, a sugar-flower garden inside a wafer gate, seen at eye level. Light: set A from the UPPER LEFT; shadows to the LOWER RIGHT.',
   'sky light mint #A3CABB and cream #F6ECD8; far hills pale pink #E9C5BA and lilac #D3B6D6; wafer pillars honey #E9C04D and caramel #C48776 with chestnut #87523E; candy rose #AE5971 and bean red #A93B32; leaves #638578; small blue #2E69A3 candies.',
   'Planes back to front: (1) a light mint sky with soft cream clouds; (2) far rolling hills of pale pink and lilac, and two tall WAFER PILLARS at the far left and far right edges; '
   '(3) a garden ground band with low sugar hedges at the far back; the GATE SPOT at the left (x 6-30%) and the GARDEN in the centre and right (x 30-94%, y 50-100%) stay PLAIN (the gate halves, the flowers, the guests and the fairy are placed there later). '
   'Keep pink pieces low and away from the centre (they must not overlap a plum skirt).', LIGHT_A, note='10장 과자 나라 정원(웨이퍼 문·꽃은 소품)')
bg('bg_morning', 'Scene 11: GOOD MORNING — the same parlour as the reference at chair-seat height (the SAME layout as the reference: the same window, the same chair spot and basket spot), now in winter MORNING light. Light: set A — morning sun from the window at the UPPER LEFT; shadows to the LOWER RIGHT. '
   'Through the window: a pale blue #ADC9D1 morning sky and snow-white #F4F6FA snowy roofs; a soft honey #E9C04D morning light layer just inside the window (a light layer that fades with distance).',
   'wall #F6ECD8 and #E4CAA4; honey #E9C04D sunlight; sky #ADC9D1; snow #F4F6FA; sage #8D9D80; pine #3F6B4F; chestnut #845A41; apricot #E8AA87; plum #7B4F68; bean red #A93B32; blue #2E69A3.',
   'Keep the chair spot (left) and the basket spot (right) plain EXACTLY as in the reference; a small part of the tree spot at the far right edge stays plain too.', LIGHT_A, ref='bg_chair_evening', note='11장 아침 거실(4장 의자 구도와 같음)')
# 뒷표지(pass 6)
J(id='nc_bg_back', kind='bg', **{'pass': 6}, refs=[], size=[1600, 902], out=RAW + 'nc_bg_back.png', note='뒷표지(미리보기에 쓰지 않음). 크래프트 위 의자와 바구니 실루엣',
  prompt=BG_HEAD + 'SCENE:\nBACK COVER (the ending page): one flat sheet of kraft paper #EBDFC8 with fine grain; on it, low in the middle, ONE simple ARMCHAIR silhouette and ONE small BASKET silhouette beside it, '
         'cut from slightly darker kraft #C9A574 paper, and a few tiny snow-white snowflake dots above. NO people, NO doll. Very simple and calm, lots of empty kraft paper (text is placed there later). Only 2 flat layers. Nothing else.\n\nFRAME:\nNo decorative border. The scene fills the entire frame edge to edge.\n\n' + LIGHT_A)

# ── 컷 4장(4:3) ──────────────────────────────
FC = F['person'] + ' ' + F['doll'] + ' ' + F['mouse']
def cut(pid, moment, panel, refs, scene, light, night=False):
    pid = 'nc_' + pid
    p = (CUT_HEAD + 'MOMENT:\nOne picture-book moment filling the ENTIRE image edge to edge (full-bleed, no border), kid-friendly, gentle and warm. ' + moment +
         ' Every character keeps exactly the head size, body proportions, colours and clothes of its reference sprite; only the pose and expression change. Size relation: the doll is 0.42 of Clara\'s height, the prince 1.04, the fairy 1.12, the mouse king 0.30, the small mice 0.22. '
         'Objects, props and backgrounds have NO face. ' + NOFX + ' NO sword, NO weapon, NO fighting. ' + TALE + (' ' + NIGHT if night else '') +
         '\n\nPANEL BACKGROUND:\n' + panel + ' — every piece one flat solid colour, no gradient (except a soft light glow where the moment says so).\n\n' + FC +
         '\n\nIf reference images are attached, they show the characters: match their shapes, colours, clothes and markings exactly.\n\nFRAME:\nNo border, no speech bubbles, no panel lines, no letters; fills the frame edge to edge. Keep the main subjects inside the CENTRE so a tall crop still works. The panel background is the scene itself — NEVER a plain magenta or chroma-key background.\n\n' + light)
    J(id=pid, kind='cut', **{'pass': 5}, refs=[RAW + f'nc_{r}.png' for r in refs], size=[1600, 1200], aspect='landscape 4:3', out=RAW + f'{pid}.png', note=scene, prompt=p)
cut('cut_knot', 'Close up: exactly ONE small wooden nutcracker doll, his WHOLE body visible, standing; a bright BLUE (#2E69A3) cloth wrapped under his square wooden jaw and tied in a neat knot at one side, matching the blue band on his hat. From the LEFT edge come ONLY the two hands and fingertips of exactly ONE girl (Clara, cream sleeves), just letting go of the knot. The doll smiles a little. Nobody else.',
    'cream #F6ECD8 wall, chestnut #845A41 table top, a warm ember amber lamp light from the upper left', ['doll_loose', 'clara_tie', 'prop_cloth_knot'], '4장 매듭 뒤 3초', LIGHT_A)
cut('cut_slipper', 'Low on the night floorboards: ONE cream house slipper lies whole and flat on the LEFT side of a striped rug; at the right, exactly THREE mice — ONE mouse king (one single head, a small gold crown), ONE grey mouse and ONE brown mouse — all startled, their ears all turned to the RIGHT as they spin around toward the right. Cute and funny, NOT scary, NO teeth. No people, no doll.',
    'deep indigo #1F2A56 wall, slate #354866 baseboard, kraft #BCA790 floorboards, pine #315C52 rug with bean red and teal stripes', ['king_startle', 'mouse_grey_jump', 'mouse_brown_freeze', 'prop_slipper'], '7장 착지 직후 2초', LIGHT_B, night=True)
cut('cut_prince', 'In the midnight parlour: at the LEFT exactly ONE girl (Clara, wearing both slippers) with a hand at her own neck, smiling in surprise; at the RIGHT exactly ONE prince (the doll changed into a boy) bowing with one hand on his chest, a bright BLUE (#2E69A3) cloth knot tied at the side of his neck. A few red paper jacket-hem pieces settle around his boots. Exactly two characters; the doll is NOT drawn again.',
    'deep indigo #1F2A56 wall, slate #354866, moonlit window #637598, fir pine #315C52, plum-brown floor #80604D', ['clara_meet', 'prince_bow', 'prop_cloth_knot'], '8장 "고마워" 다음 3초', LIGHT_B, night=True)
cut('cut_garden', 'In the sugar-flower garden: at the LEFT exactly TWO guests, Clara and the prince (blue knot at his neck), smiling side faces looking RIGHT; at the RIGHT exactly ONE Sugar Plum Fairy (no wings, no wand) dancing on tiptoe among big OPEN pale-pink sugar flowers. Exactly three characters. No magic effects.',
    'light mint #A3CABB sky, pale pink #E9C5BA and lilac #D3B6D6 hills, honey #E9C04D wafer pillar at the edge, mint #638578 leaves', ['clara_clap', 'prince_listen', 'fairy_turn', 'prop_flower_open'], '10장 "꽃도 춤을 추네!" 뒤 4초', LIGHT_A)

# ── 표지·썸네일(pass 6) ─────────────────────
def key(pid, frame, scene, refs, out, aspect):
    pid = 'nc_' + pid
    p = KEY_HEAD + frame + '\n\nSCENE INSIDE THE WINDOW:\n' + TALE + '\n' + scene + '\n\n' + FC + ' ' + NOFX + '\n\nMatch the characters in the reference images exactly (same shapes, colours, clothes, markings).\n\n' + KEY_TAIL
    if 'WINDOW' not in frame: p = p.replace('SCENE INSIDE THE WINDOW:', 'SCENE:')
    J(id=pid, kind='key', **{'pass': 6}, refs=[RAW + f'nc_{r}.png' for r in refs], out=out, aspect=aspect, prompt=p)
WIN = ('FRAME (most important):\nThe whole {asp} canvas is ONE flat sheet of warm cream cardstock (#f5efe9) with fine paper grain. A large window is cut out of it in the shape of {shape}. It is centred horizontally, {pos}. '
       'The scene is seen THROUGH this window, built from 3 or 4 layered paper depth planes behind the sheet; '
       'the window edge shows the sheet thickness with a soft inner shadow along the top and inner edges and a light cut edge at the bottom. {rest} '
       'Around the rim, two small flat paper fir sprigs with red berries overlap the edge at the upper-left and upper-right. Nothing else on the cream sheet.')
key('key_land', WIN.format(asp='wide 16:9', shape='a WALNUT seen from the side (a wide rounded oval with a small point at the top)', pos='its top at about 4% of the height and its height about 74% of the canvas HEIGHT',
                           rest='The lower 22% of the canvas below the window and both side areas are plain empty cream paper (a title is placed there later).'),
    'A warm Christmas Eve parlour with a tall Christmas tree in the back; at the LEFT, BIG and clear, Clara smiles with both hands held out; at the RIGHT an OPEN gift box (bean red with a gold ribbon, the lid lifted aside) and inside it the little wooden nutcracker doll with his blue hatband, smiling at her. Rich colours only at the edges and far back.',
    [CL, 'doll_rest', 'prop_box', 'prop_lid'], 'assets/raw/keyart_gpt/nutcracker_wide_v1.png', 'landscape 16:9')
key('key_port', WIN.format(asp='portrait 3:4', shape='a tall ARCHED WINDOW (a rectangle with a round top)', pos='its top at about 5% of the height, its width about 80% of the canvas width',
                           rest='The lower 20% of the canvas below the window is plain empty cream paper (a title is placed there later).'),
    'Stacked from top to bottom (a DIFFERENT composition, not a crop): fir branches with gold ornaments at the top; in the middle Clara\'s face BIG and smiling, looking down; at the bottom a LOW open gift box with the little nutcracker doll peeking out, his blue hatband clear.',
    ['clara_face', 'doll_rest', 'prop_box'], 'assets/raw/keyart_gpt/nutcracker_tall_v1.png', 'portrait 3:4')
key('thumb', 'COMPOSITION (most important):\nA landscape 4:3 thumbnail tile, a full-bleed rectangular paper diorama picture (no cream sheet, no window, no border, no frame). Only 2 or 3 flat paper depth planes.',
    'The little wooden nutcracker doll BIG in the centre-left (his face large and clear, the bright blue #2E69A3 hatband very visible), smiling; one layer of fir branches with gold ornaments and a warm cream parlour wall behind.',
    ['doll_rest'], 'assets/raw/keyart_gpt/nutcracker_tile_v1.png', 'landscape 4:3')

for j in jobs: assert len(j['refs']) <= 5, j['id']
assert len({j['id'] for j in jobs}) == len(jobs)
ids = [j['id'] for j in jobs]
for j in jobs:  # 참고 그림은 작업표 안에서 먼저 나와야 한다
    for r in j['refs']:
        rid = os.path.splitext(os.path.basename(r))[0]
        assert rid in ids and ids.index(rid) < ids.index(j['id']), (j['id'], rid)
BAN = ('barefoot', 'bare feet', 'bare foot', 'naked', 'undress', 'torn ', 'ragged', 'rags', 'blood', 'seven heads')
for j in jobs:  # 검열에 걸렸던 표현이 프롬프트에 없게
    low = j['prompt'].lower()
    assert not any(b in low for b in BAN), (j['id'], [b for b in BAN if b in low])
json.dump(jobs, open(os.path.join(G, 'tools/app/gen/jobs_nutcracker.json'), 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(jobs), sorted(Counter((j['kind'], j['pass']) for j in jobs).items()))
