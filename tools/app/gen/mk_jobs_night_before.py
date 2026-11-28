#!/usr/bin/env python3
"""크리스마스 전날 밤(night_before) 그림 작업표 tools/app/gen/jobs_night_before.json 을 만든다 — tales/night_before/PLAN.md 그림 목록 그대로.
스타일 문단은 별주부전 작업표(jobs_byeoljubu.json)와 같은 글을 가져다 쓴다(앱 전체 같은 종이 결). mk_jobs_red_hen.py 와 같은 틀.
  python3 tools/app/gen/mk_jobs_night_before.py
pass 1: 기준 자세(인물마다 첫 그림) / pass 2: 기준 그림을 참고로 넣는 자세 / pass 3: 소품 / pass 4: 배경 / pass 5: 컷 / pass 6: 표지·썸네일·뒷표지
pass 9: 조건부(빛 상자 5장 nb_bg_yard_lb — 12장 빛 상자 검수 뒤, 판단 8)
광원: 이 동화는 전 장면 세트 B(밤, 오른쪽 위 달·벽난로 불씨) → 그림자는 왼쪽 아래. 인물 그림 안 조각 그림자도 같은 쪽."""
import json, os
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
BJ = {j['id']: j['prompt'] for j in json.load(open(os.path.join(G, 'tools/app/gen/jobs_byeoljubu.json')))}
def cut_at(s, a, b=None): i = s.index(a); return s[i:] if b is None else s[i:s.index(b, i)]
def set_b(t):  # 세트 B: 빛은 오른쪽 위, 그림자는 왼쪽 아래
    return (t.replace('from the upper-left', 'from the upper-right')
             .replace('All cast shadows fall toward the LOWER RIGHT (light source at the upper left)', 'All cast shadows fall toward the LOWER LEFT (light source at the upper right)'))
SP_HEAD = BJ['bj_prop_medicine_bag'][:BJ['bj_prop_medicine_bag'].index('SUBJECT AND POSE:')]
SP_TAIL = set_b(cut_at(BJ['bj_prop_medicine_bag'], 'If a reference image is attached'))
BG_HEAD = BJ['bj_bg_shore_day'][:BJ['bj_bg_shore_day'].index('SCENE:')]
BG_RICH = cut_at(BJ['bj_bg_shore_day'], 'RICHNESS', 'FRAME:').replace('NO fish, ', '')
CUT_HEAD = BJ['bj_cut_shock'][:BJ['bj_cut_shock'].index('MOMENT:')]
KEY_HEAD = BJ['bj_key_wide'][:BJ['bj_key_wide'].index('FRAME (most important):')]
KEY_TAIL = set_b(cut_at(BJ['bj_key_wide'], 'LIGHTING:'))
LIGHT_NO = set_b(cut_at(BJ['bj_bg_shore_day'], 'LIGHTING:')).replace('NO people.\nNO animals.\n', '')
RAW = 'assets/raw/restyle/night_before/'

TALE = ('This is the classic Christmas poem THE NIGHT BEFORE CHRISTMAS (A Visit from St. Nicholas, Clement C. Moore, 1823), set in a generic early-1800s '
        'country house on a snowy Christmas Eve night: candles, wooden shutters, a stone fireplace, stockings, nightcaps. Simple, warm, gentle, kid-friendly bedtime mood. '
        'No Disney look, no film or advertisement look, no modern objects (no electric lights, no plastic, no Christmas tree).')
NIGHT = ('It is NIGHT but a READABLE storybook night: mid-tone navy and indigo papers with clear shapes, NOT black, NOT murky; snow and moonlight are bright cream-white. '
         'The moonlight is cream, NEVER orange (it must not look like a sunset).')

C = {  # 인물 설명(PLAN 등장인물 표)
 'dad': ('the FATHER (the narrator), a kind generic man of about 35: pyjamas of dusty blue (#7F93B0) top and trousers, the collar and cuffs paper cream (#F6ECD8), '
         'a long floppy pointed NIGHTCAP in bean red (#A93B32) with a round snow-white (#F4F6FA) pompom at its tip, cocoa (#4E3524) hair showing only at the sides by the ears, '
         'bark-brown (#6B4A32) slippers, skin warm light peach (#F4C9A8). He is a GROWN-UP FATHER drawn in the SAME storybook paper style as the other characters of this story (St. Nicholas, the mother, the children): '
         'about 2.5 to 3 heads tall (his head about as big as the mother\'s head), a slightly LONG, slim OVAL face (longer than a child\'s round face), BROAD SHOULDERS, '
         'clearly TALLER than the children, so he clearly reads as an adult. CLEAN-SHAVEN: no moustache, no beard.'),  # 사용자 결정 2026-11-27: 2.5~3등신 같은 그림체, 긴 얼굴·넓은 어깨로 어른, 콧수염 없음
 'santa': ('ST. NICHOLAS exactly as the 1823 poem describes him (NOT a tall modern Santa, NOT a soft-drink advertisement Santa): a SMALL, chubby, plump, jolly old ELF-LIKE man, only 2 heads tall, '
           'with a round little belly. He is dressed ALL IN FUR from his head to his foot: a fur suit, fur trousers and a fur cap in bean red (#A93B32), all fur trims (cap band, cuffs, hem, front edge) in paper cream (#F6ECD8, '
           'a sooty cream, not bright white); three or four small ash-grey (#8B8680) soot patches on the sleeves, hem and cap ("tarnished with ashes and soot"); a cocoa (#4E3524) belt with a straw-gold (#D9A94E) buckle; cocoa boots. '
           'On his back a big kraft (#C9A574) toy sack tied with a straw-gold string, with the tips of toys peeking out of its mouth (a persimmon #E8703A drum, a straw-gold trumpet, a sky-blue #3E7CB1 ball; NO dolls). '
           'NO pipe, NO smoke, NO glasses.'),
 'deer': ('one TINY REINDEER (a small storybook reindeer, NOT Rudolph): body fawn (#C9A574), belly, chin and short tail sand (#E9DCC0), lower legs and hooves cocoa (#4E3524), '
          'ONE pair of small cocoa antlers with two tines each, a small COCOA nose (absolutely NOT a red nose, NOT a glowing nose), shell-pink (#F8D7E0) inside the ears. '
          'NO harness, NO collar, NO bells, NO saddle (the harness is a separate piece added later). Slim legs, cute and light.'),
 'mom': ('the MOTHER, a kind generic woman of about 35: a shell-pink (#F8D7E0) nightgown, a paper-cream (#F6ECD8) KERCHIEF covering her head and tied in a knot under her chin, '
         'one small strand of straw-gold (#D9A94E) hair showing at the forehead, skin warm light peach (#F4C9A8). 2.5 heads tall.'),
 'kid1': ('the OLDER CHILD (about 5 years old, gender neutral, no gendered clothes): leaf-green (#8CBF5A) pyjamas, short cocoa (#4E3524) hair, skin warm light peach (#F4C9A8). Big round head.'),
 'kid2': ('the YOUNGER CHILD (about 4 years old, gender neutral, no gendered clothes): marigold (#F2B134) pyjamas, a round bark-brown (#6B4A32) bob haircut, skin warm light peach (#F4C9A8). Big round head.'),
 'mouse': ('one small HOUSE MOUSE: stone-grey (#A9A39B) body, shell-pink (#F8D7E0) inside the round ears, a thin dust-grey (#C6BFB4) tail, a tiny ink nose.'),
}
F = {  # 얼굴(표정은 자세 문장에서)
 'dad': 'FACE (father): two round eyes (a white disc with an ink #2A2A2A disc) the same style as the other characters, two cocoa EYEBROW strips (the eyebrows show the mood), a small peach (#F7C59F) nose piece, a curved paper-strip mouth, two round shell-pink (#F8D7E0) cheeks. No eyelashes, no glossy highlights.',
 'santa': ('FACE: a broad round peach (#F7C59F) face; two round rose (#E8809A) CHEEKS like roses; a round cherry-red (#C8323A) NOSE like a cherry; a small mouth drawn up like a BOW (a little upward arch); '
           'a round cloud-shaped beard as white as snow (#F4F6FA) under the chin; snow-white eyebrows; two round twinkling eyes (white disc with an ink disc) with ONE tiny honey (#F6D27A) star piece beside one eye; '
           'two shallow dimples (only a soft edge shadow). No eyelashes, no glossy highlights.'),
 'deer': 'FACE (reindeer, a living animal): one round eye seen from the side (a white disc with an ink #2A2A2A disc), a small cocoa nose, a tiny curved mouth. No eyelashes, no glossy highlights.',
 'mom': 'FACE: when asleep, two closed eyes drawn as small downward-curved ink strips; a small smiling paper-strip mouth; two round shell-pink (#F8D7E0) cheeks. No eyelashes, no glossy highlights.',
 'kid1': 'FACE: when asleep, two closed eyes drawn as small downward-curved ink strips; a small smiling paper-strip mouth; two round shell-pink (#F8D7E0) cheeks. No eyelashes, no glossy highlights.',
 'kid2': 'FACE: when asleep, two closed eyes drawn as small downward-curved ink strips; a small paper-strip mouth; two round shell-pink (#F8D7E0) cheeks. No eyelashes, no glossy highlights.',
 'mouse': 'FACE (mouse, a living animal): one closed eye drawn as a small curved ink strip (asleep), a tiny ink nose. No glossy highlights.',
}
FRAMING = {
 'sq': 'FRAMING:\nSquare 1:1 image. The whole figure is visible and centred, filling about 80% of the frame. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
 'wide': 'FRAMING:\nLandscape 3:2 image. The whole figure is visible and centred, filling about 85% of the frame width. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
}
NOMAG = ('\nNO magenta or hot-pink anywhere inside the subject.\nNO white outline, NO sticker border, NO light rim around the figure: the outer edge is the clean cut edge of the paper itself.')

def sp_tail(shape):
    t = SP_TAIL
    t = t.replace(t[t.index('FRAMING:'):t.index('LIGHTING:')], FRAMING[shape] + '\n\n')
    if t.rstrip().endswith('NO magenta or hot-pink anywhere inside the subject.'):
        t = t.rstrip()[:-len('NO magenta or hot-pink anywhere inside the subject.')].rstrip()
    return t + NOMAG

jobs = []
def J(**k): jobs.append(k); return k

def char(who, pid, pose, scenes, ref=None, shape='sq', note='', other=None):
    """ref: 같은 인물의 기준 그림 id. other=(id, 문장): 다른 인물 그림을 '크기·종이 결 참고'로만 넣을 때"""
    refs, same = [], ''
    if ref:
        refs.append(RAW + f'{ref}.png')
        same = ('The SAME character as the reference image. SAME SCALE AS THE REFERENCE: the head, face, eyes and body are exactly the same size as in the '
                'reference image (measure by the head width); only the pose and expression change as described. Keep every colour, piece and marking of the reference exactly. ')
    if other:
        refs.append(RAW + f'{other[0]}.png')
        same += other[1] + ' '
    p = (SP_HEAD + 'SUBJECT AND POSE:\n' + TALE + '\n' + same + C[who][0].upper() + C[who][1:] + '\nPOSE AND EXPRESSION: ' + pose +
         '\nHANDS: nothing in the hands unless the pose names an object; never another character in the hands.\n\n' + F[who] + ' Objects that are not characters have NO face.\n\n' + sp_tail(shape))
    J(id=pid, kind='sprite', **{'pass': 2 if ref else 1}, refs=refs, size=[840, 560] if shape == 'wide' else [600, 600], out=RAW + f'{pid}.png',
      **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), note=f'{scenes}장. {note}'.strip(), prompt=p)

def prop(pid, desc, scenes, shape='sq', ref=None, note='', pas=3):
    refs = [RAW + f'{r}.png' for r in ([ref] if isinstance(ref, str) else (ref or []))]
    p = (SP_HEAD + 'SUBJECT AND POSE:\nAn OBJECT (not a character) for the Christmas poem The Night Before Christmas (an early-1800s house): ' + desc +
         (' Draw it in the SAME paper style and at the same scale as the attached reference object.' if ref else '') +
         ' Shown alone, centred.\n\nThis is an OBJECT, not a character: NO face, NO eyes, NO mouth anywhere on it.\n\n' + sp_tail(shape))
    J(id=pid, kind='sprite', **{'pass': pas}, refs=refs, size=[840, 560] if shape == 'wide' else [600, 600], out=RAW + f'{pid}.png',
      **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), note=f'{scenes}장. {note}'.strip(), prompt=p)

# ── 인물: 아빠(15) ─────────────────────────────
DAD = 'nb_dad_stand'
char('dad', DAD, 'standing calmly in three-quarter SIDE VIEW FACING LEFT, both arms hanging down relaxed, eyebrows level, a small gentle smile, looking LEFT.', '측정·12', note='기준 자세: 머리 폭(모자 제외, 귀에서 귀) 기준, 크기표 1.0')
_d = jobs[-1]  # 2026-11-27 사용자 결정: v1(아이 같음)·c2(4.5등신) 탈락 → d3(그림체 맞음) 채택 뒤 "콧수염 빼 줘" → d3 를 참고로 콧수염만 없앰
_d['refs'] = [RAW + '_rej/nb_dad_stand_v3_d3_moustache.png', RAW + 'nb_mom_sleep.png', RAW + 'nb_santa_stand_pack.png']
_d['prompt'] = _d['prompt'].replace('SUBJECT AND POSE:\n', 'SUBJECT AND POSE:\nREFERENCE IMAGE (1) is this father: draw the SAME character, SAME pose, SAME size, SAME face shape, hair, outfit and nightcap, '
  'but CLEAN-SHAVEN: remove the moustache completely (no moustache, no beard, plain skin under the nose). (2) the mother and (3) St. Nicholas show the drawing style of this story.\n', 1)
char('dad', 'nb_dad_sleep', 'LYING ASLEEP ON HIS BACK in bed seen from the side, his HEAD at the RIGHT end resting on a paper-cream pillow, the nightcap still on; a plum-purple (#7B4F8C) quilt with a straw-gold band covers him up to the chest, one arm resting on top of the quilt. SLEEPY face: eyes closed (downward curved strips), mouth a little open, relaxed eyebrows. Face turned up toward the ceiling. NO BED FRAME: do NOT draw the bed, headboard, footboard or bed legs (the bed is in the background picture); draw ONLY the figure with the pillow and the quilt, the bottom edge of the quilt cut straight.', '3', DAD, shape='wide', note='머리 오른쪽(창 쪽). 침대 틀은 배경, 이불·베개 포함')
char('dad', 'nb_dad_wake', 'SITTING BOLT UPRIGHT in bed, side view facing RIGHT: his legs still under a plum-purple (#7B4F8C) quilt with a straw-gold band, one hand throwing the quilt back, the nightcap pompom flying up. STARTLED face: eyes big round discs, eyebrows raised high, mouth a small round "o". Looking RIGHT. NO BED FRAME: do NOT draw the bed, headboard, footboard or bed legs (the bed is in the background picture); draw ONLY the figure with the pillow and the quilt, the bottom edge of the quilt cut straight.', '3', DAD, shape='wide', note='소리 난 창(오른쪽)을 봄')
char('dad', 'nb_dad_dash', 'DASHING to the RIGHT: body leaning far forward, one arm swung back and one forward, one slipper flying off his foot behind him, the nightcap streaming back. CURIOUS face: one eyebrow raised, mouth closed and a little open. Looking RIGHT. (A running-lean pose, not a walking pose; both feet close to the ground.)', '4', DAD, note='GSAP 로 미끄러지듯 창가로. 걷기 그림 없음')
char('dad', 'nb_dad_open_window', 'seen from BEHIND at a slight angle (three-quarter back view, only a quarter of his face visible at the right), both arms raised and spread wide, palms pushing outward as if throwing open two shutters in front of him (the shutters are NOT drawn), the nightcap hanging down his back. Effort: mouth pressed shut (only a sliver visible).', '4', DAD, note='톡 뒤 1초. 덧문은 소품')
# 2026-11-28 사용자 결정: 4장 창턱이 손보다 높아(무대 단위 약 80) 벽에 기댄 것처럼 보였다 → 까치발로 서서 턱 높이 창턱에 두 손을 얹는 자세로 다시 그림(배경 창은 3·4장 두 배경·덧문·창틀 소품이 같이 바뀌어야 해서 그대로). 옛 v1 은 _rej/
char('dad', 'nb_dad_look_out', 'SIDE VIEW FACING RIGHT, standing UPRIGHT and tall on his TIPTOES (both heels lifted off the ground, toes down), his back straight, NOT bending forward. Both forearms raised in front of his chest with the elbows bent and pointing down, both hands resting flat side by side on an invisible HIGH window sill at the height of his CHIN (the hands are at the level of his chin and mouth, the tops of the hands level and flat as if lying on a shelf), peeking out over the sill to the RIGHT. The long nightcap hangs down his back. WIDE-EYED face: eyes big and round, eyebrows high, mouth a small open "o".', '4·5', DAD, note='창 안쪽에서 밖을 봄(까치발, 턱 높이 창턱)')
char('dad', 'nb_dad_window_face', 'ONLY his head, shoulders and both hands, seen from OUTSIDE as if looking out of a window: the bottom edge is cut STRAIGHT across at the chest, both hands resting on that straight bottom edge (a window sill). Three-quarter view facing RIGHT. AMAZED AND HAPPY face: eyes sparkling, eyebrows up, mouth open in a big smile. NO window frame drawn.', '5·6·7', DAD, note='창틀은 배경. 머리 폭 1.0 그대로')
char('dad', 'nb_dad_window_up', 'ONLY his head, shoulders and both hands, the bottom edge cut STRAIGHT across at the chest with both hands on that straight edge (a window sill); his head TILTED BACK looking UP to the UPPER RIGHT (toward the roof). CURIOUS face: eyebrows raised, mouth a small round "o". NO window frame drawn.', '7', DAD, note='발굽 소리를 듣는 순간')
char('dad', 'nb_dad_turn', 'FRONT VIEW, caught in the middle of turning around: shoulders twisted, one foot lifted a little off the floor, arms loose. CURIOUS face looking toward the viewer: one eyebrow raised.', '8', DAD, note='정면. 8장 앞부분 한 번만, 뒤집지 않음')
char('dad', 'nb_dad_startled', 'SIDE VIEW FACING RIGHT, both arms pulled in close to his chest, hands up near his chin, stepping one foot BACK. BREATH-HOLDING surprise (NOT fear): eyes very big and round, mouth pressed shut with puffed-out cheeks, eyebrows high. Looking RIGHT.', '8', DAD)
char('dad', 'nb_dad_peek', 'peeking out from behind an invisible door frame at the LEFT: only the RIGHT half of his body is visible (the left half is cut off STRAIGHT and VERTICALLY where the door frame would be), one hand curled around that straight vertical edge, leaning to look RIGHT. HUSHED face: eyes wide open, mouth small, eyebrows level.', '9', DAD, note='문틀은 배경. 산타를 엿봄')
char('dad', 'nb_dad_giggle', 'SIDE VIEW FACING RIGHT, one hand covering his mouth, shoulders hunched up, body bending slightly forward, trying not to laugh out loud. Face: eyes squeezed shut in laughing arcs, eyebrows raised, round cheeks pushed up above the covering hand.', '9·10', DAD, note='어깨 흔들림은 GSAP')
char('dad', 'nb_dad_relieved', 'SIDE VIEW FACING RIGHT, standing straight, both hands pressed softly on his chest. COSY RELIEVED face: eyes happy half-moon arcs, relaxed eyebrows, a big warm smile. Looking RIGHT.', '10·11', DAD)
char('dad', 'nb_dad_watch_up', 'SIDE VIEW FACING RIGHT, one hand resting on an invisible window sill at waist height, his head tilted back looking UP to the UPPER RIGHT at the sky. JOYFUL face: sparkling eyes, mouth open in a smile.', '11·12', DAD)
char('dad', 'nb_dad_wave', 'SIDE VIEW FACING RIGHT, one hand waving high above his head, the other hand resting on an invisible window sill at waist height, looking UP to the UPPER RIGHT. JOYFUL face with a bigger open mouth, calling goodbye.', '12', DAD, note='인사 톡의 답')

# ── 산타(14) ─────────────────────────────────
SAN = 'nb_santa_stand_pack'
DAD_SCALE = ('The reference image is a DIFFERENT character (the father) shown ONLY for paper style and scale: draw St. Nicholas NOT like him, but with his FACE as wide as '
             'the father\'s head and his whole height only 0.7 of the father\'s height (small, round and short).')
char('santa', SAN, 'standing in three-quarter SIDE VIEW FACING LEFT, the toy sack on his back, one hand holding the sack string at his shoulder, the other hand on his round belly. MERRY face: bow-shaped smile, rosy cheeks, twinkling eyes. Looking LEFT.', '9',
     note='기준 자세: 얼굴 폭(수염 제외) = 아빠 머리 폭, 키 0.7', other=('_rej/nb_dad_stand_v1_kidlike', DAD_SCALE))
jobs[-1]['pass'] = 1
char('santa', 'nb_santa_drive', 'STANDING (as if standing in a sleigh, the sleigh is NOT drawn; the picture ends at his knees with a STRAIGHT bottom edge), one hand holding reins that end at the left edge of the picture, the other hand thrown up high, calling out loud. SHOUTING face: mouth wide open, eyebrows up. Facing and looking LEFT.', '5·6·7', SAN, note='썰매는 소품. 무릎 아래 곧게 잘림')
char('santa', 'nb_santa_whistle', 'STANDING (in a sleigh that is NOT drawn; the picture ends at his knees with a STRAIGHT bottom edge), two fingers put to his lips whistling, the other hand on his hip. CHEERFUL face: one eye squeezed shut, lips pursed. Facing LEFT.', '6·12', SAN, note='12장은 뒤집어 오른쪽')
char('santa', 'nb_santa_bound_down', 'FRONT VIEW, in mid-air dropping straight down (as if sliding down a chimney): knees bent up, both arms raised straight above his head, the toy sack on his back, a few ash-grey soot flecks around him. EXCITED face: eyes squeezed shut, mouth wide open laughing.', '8', SAN, note='정면, 8장 굴뚝 속 한 장면만')
char('santa', 'nb_santa_land', 'CROUCHING after landing, three-quarter view facing LEFT: knees bent low, one hand flat on the floor, the toy sack on his back, a little puff of ash-grey soot at his feet. GRIN: one corner of the mouth up, eyes open and bright. Looking LEFT.', '8', SAN)
char('santa', 'nb_santa_show_pack', 'standing half turned away so the big toy sack on his back is clearly shown, his hands UNTYING the sack string at its mouth, the toy tips (drum, trumpet, ball) peeking out; his head turned back to look LEFT. MERRY face.', '9', SAN, note='"장난감 장수" 줄')
char('santa', 'nb_santa_laugh', 'standing, three-quarter view facing LEFT, both hands on his round belly, head tipped back, laughing out loud. BIG LAUGH face: eyes closed in happy arcs, mouth wide open, cheeks pushed up. Looking up to the UPPER LEFT.', '9', SAN, note='배 출렁은 GSAP 눌림')
char('santa', 'nb_santa_wink', 'standing, three-quarter view facing LEFT, head tilted a little, one hand on his hip, the sack on his back. WINK: ONE eye closed (a curved strip), the other eye open, one corner of the bow mouth up, one eyebrow raised. Looking LEFT.', '10', SAN)
char('santa', 'nb_santa_fill', 'SIDE VIEW FACING RIGHT, bending forward, one hand reaching out to the RIGHT at chest height holding a small sky-blue gift box with a red ribbon, as if putting it into the top of a stocking (the stocking is NOT drawn); his open toy sack is on the floor at his feet behind him. CONCENTRATING face: lips pursed, eyes looking DOWN to the right.', '10', SAN, note='손끝이 양말 입구에 닿게 코드로 위치')
char('santa', 'nb_santa_done', 'SIDE VIEW FACING RIGHT, standing up straight, both hands on his hips, the toy sack back on his back. SATISFIED face: eyes happy half-moon arcs, a big smile. Looking RIGHT.', '10', SAN)
char('santa', 'nb_santa_finger_nose', 'standing, three-quarter view facing LEFT, laying one finger beside his nose, giving a little nod, the sack on his back. PLAYFUL SMILE: one eyebrow raised, bow-shaped smile. Looking LEFT.', '11', SAN, note='끄덕은 GSAP')
char('santa', 'nb_santa_rise', 'FRONT VIEW, body straight and slim, both arms held close to his sides, head tilted up looking UP, as if rising up a chimney; the sack on his back. HAPPY face: eyes closed, gentle smile.', '11', SAN, note='위로 이동')
char('santa', 'nb_santa_jump_sleigh', 'SIDE VIEW FACING RIGHT, springing up in mid-air with one foot stretched forward as if stepping onto the edge of a sleigh (the sleigh is NOT drawn), arms swinging, the sack on his back. EXCITED face: mouth open laughing. Looking RIGHT.', '12', SAN)
char('santa', 'nb_santa_sleigh_wave', 'SITTING (as if sitting in a sleigh that is NOT drawn; the picture ends at his lap with a STRAIGHT bottom edge), his BODY facing RIGHT with one hand holding reins that end at the right edge, his HEAD TURNED BACK over his shoulder to look LEFT, the other arm waving high. WARM CALLING face: mouth wide open, eyes happy arcs.', '12', SAN, note='몸은 오른쪽으로 가고 얼굴은 집(왼쪽)을 봄. 뒤집기 금지')

# ── 순록(5) ─────────────────────────────────
DEER = 'nb_deer_stand'
char('deer', DEER, 'standing on all four legs in SIDE VIEW FACING LEFT, head raised proudly, a tiny snow-white puff of breath piece in front of the nose. SPIRITED: eye bright and clear.', '5·6', shape='wide', note='기준 자세: 몸통 길이(가슴~엉덩이), 크기표 0.42(뿔 끝)')
char('deer', 'nb_deer_prance', 'rearing up on its hind legs with both front legs lifted and bent, SIDE VIEW FACING LEFT, ears up. EXCITED: eye sparkling.', '6', DEER, note='이름 불린 마리만')
char('deer', 'nb_deer_run', 'RUNNING on the ground in SIDE VIEW FACING LEFT: front legs stretched forward and hind legs stretched back, body low and long. SPIRITED.', '6·7', DEER, shape='wide')
char('deer', 'nb_deer_fly', 'FLYING in the air, SIDE VIEW heading to the UPPER LEFT: all four legs stretched out front and back, body tilted up a little, head forward. FOCUSED: eye narrowed. NO wings.', '7·12', DEER, shape='wide', note='12장은 뒤집어 오른쪽 위')
char('deer', 'nb_deer_roof', 'standing on all four legs, SIDE VIEW FACING LEFT, one front hoof lifted as if tapping and pawing the ground, ears pointed forward. EAGER: eye bright.', '7', DEER, shape='wide', note='지붕 경사 -12도는 코드')

# ── 엄마·아이·생쥐 ───────────────────────────
char('mom', 'nb_mom_sleep', 'LYING ASLEEP ON HER BACK in bed seen from the side, her HEAD at the RIGHT end on a paper-cream pillow, wearing the kerchief; a plum-purple (#7B4F8C) quilt with a straw-gold band covers her up to the chest. COSY face: eyes closed, a small smile. Face turned up toward the ceiling. NO BED FRAME: do NOT draw the bed, headboard, footboard or bed legs (the bed is in the background picture); draw ONLY the figure with the pillow and the quilt, the bottom edge of the quilt cut straight.', '3', shape='wide',
     note='엄마 기준(머리 폭 = 아빠와 같음). 옛 v1 아빠를 크기 참고로 그림', other=('_rej/nb_dad_stand_v1_kidlike', 'The reference image is a DIFFERENT character (the father) shown ONLY for paper style and scale: draw a different person (the mother), with her head exactly as big as his head.'))
jobs[-1]['pass'] = 1
char('kid1', 'nb_kid1_sleep', 'LYING ASLEEP tucked snugly under a blossom-pink (#F2A7B5) quilt in bed seen from the side, the HEAD at the RIGHT end on a paper-cream pillow, only the head and shoulders above the quilt. COSY face: eyes closed, small smile, pink cheeks. Face turned up toward the ceiling. NO BED FRAME: do NOT draw the bed, headboard, footboard or bed legs (the bed is in the background picture); draw ONLY the figure with the pillow and the quilt, the bottom edge of the quilt cut straight.', '2', shape='wide',
     note='아이 1 기준(머리 폭 = 아빠의 0.85). 옛 v1 아빠를 크기 참고로 그림', other=('_rej/nb_dad_stand_v1_kidlike', 'The reference image is a DIFFERENT character (the father) shown ONLY for paper style and scale: draw a small child, with the child\'s head 0.85 times as wide as his head.'))
jobs[-1]['pass'] = 1
char('kid2', 'nb_kid2_sleep', 'LYING ASLEEP tucked under a leaf-green (#8CBF5A) quilt in bed seen from the side, the HEAD at the LEFT end on a paper-cream pillow, one arm resting outside the quilt. COSY face: eyes closed, mouth a little open, pink cheeks. Face turned up toward the ceiling. NO BED FRAME: do NOT draw the bed, headboard, footboard or bed legs (the bed is in the background picture); draw ONLY the figure with the pillow and the quilt, the bottom edge of the quilt cut straight.', '2', shape='wide',
     note='아이 2 기준(아이 1과 같은 크기)', other=('nb_kid1_sleep', 'The reference image is a DIFFERENT child (the older sibling) shown ONLY for paper style and scale: draw a different child with exactly the same head size.'))
jobs[-1]['pass'] = 1
char('kid1', 'nb_kid1_smile', 'EXACTLY the same lying pose, quilt, pillow and position as the reference (head at the RIGHT); ONLY the face changes: dreaming of sweets, a BIGGER sweet smile and rosier cheeks, eyes still closed.', '2', 'nb_kid1_sleep', shape='wide', note='얼굴만 바뀜(엔진에 얼굴 판 교체 기능이 없어 전신 한 장, 판단 7)')
char('kid2', 'nb_kid2_smile', 'EXACTLY the same lying pose, quilt, pillow and position as the reference (head at the LEFT, one arm outside); ONLY the face changes: dreaming of sweets, lips pursed as if smacking them, eyes still closed.', '2', 'nb_kid2_sleep', shape='wide', note='얼굴만 바뀜(판단 7)')
char('mouse', 'nb_mouse_sleep', 'curled up in a ball asleep, SIDE VIEW with its head at the LEFT, the tail wrapped around its body. Eye closed.', '1·8~11', note='생쥐 기준, 크기표 0.1')
jobs[-1]['pass'] = 1

# ── 소품(얼굴 없음) ──────────────────────────
prop('nb_prop_sleigh', 'a MINIATURE SLEIGH seen from the side, front (the curled runner tip) at the LEFT: body bean red (#A93B32) with a straw-gold (#D9A94E) band along the top edge, straw-gold curled runners, cocoa (#4E3524) inside; at the back a kraft (#C9A574) toy bundle with the tips of a sky-blue, a marigold (#F2B134) and a blossom-pink (#F2A7B5) gift box showing. The seat is EMPTY (no person). Small and light, like a toy sleigh.', '5·6·7·12', shape='wide', note='0.35×0.9. 12장 뒤집음')
STOCK = {'red': 'bean red (#A93B32)', 'green': 'pine green (#3F6B4F)', 'blue': 'sky blue (#3E7CB1)', 'yellow': 'marigold (#F2B134)'}
for k, hx in STOCK.items():
    prop(f'nb_prop_stocking_{k}', f'one EMPTY Christmas stocking hanging straight down (toe pointing to the RIGHT), made of {hx} paper with a snow-white (#F4F6FA) cuff at the top and a small loop. Flat and thin (empty).', '1·8~11',
         ref=None if k == 'red' else 'nb_prop_stocking_red', note='양말 0.3')
for k, hx in STOCK.items():
    prop(f'nb_prop_stocking_{k}_full', f'the SAME {hx} Christmas stocking with snow-white cuff as the reference, now FULL and plump with presents: the ends of a ribbon and the corner of a small gift box peek out of the top.', '10·11', ref=f'nb_prop_stocking_{k}', note='쏙 뒤 바꿈')
GIFT = {'a': 'sky blue (#3E7CB1) with a bean-red ribbon', 'b': 'blossom pink (#F2A7B5) with a snow-white ribbon', 'c': 'leaf green (#8CBF5A) with a bean-red ribbon', 'd': 'sunny yellow (#F2C94E) with a snow-white ribbon'}
for k, d in GIFT.items():
    prop(f'nb_prop_gift_{k}', f'one small square gift box in {d} tied in a cross with a little bow on top, seen from the front.', '10', ref=None if k == 'a' else 'nb_prop_gift_a', note='0.12~0.15')
prop('nb_prop_shutter_l', 'ONE tall wooden window SHUTTER (the LEFT one of a pair) in bark brown (#6B4A32): a tall rectangle of vertical planks with two cocoa (#4E3524) crossbars and two small hinges on its LEFT edge, CLOSED, seen from the front.', '3·4', note='덧문 묶음이 누르는 대상')
prop('nb_prop_shutter_r', 'the mirror twin of the reference shutter: the RIGHT one of the pair, hinges on its RIGHT edge, same size and colours.', '3·4', ref='nb_prop_shutter_l')
prop('nb_prop_sash', 'the lower sliding SASH of an old window: a paper-cream (#F6ECD8) wooden frame with four small panes, the panes EMPTY (cut out, magenta like the background).', '4', note='창틀이 쓱 올라감')
prop('nb_prop_dream_bubble', 'a round DREAM CLOUD bubble of paper cream (#F6ECD8) with two small round cream dots trailing down at the lower left (no letters); inside it four round wrapped SWEETS (lilac #B59BD6, shell pink #F8D7E0, mint #CFE6DA, sunny yellow #F2C94E) each with twisted wrapper ends, arranged in a ring.', '2', shape='wide', note='글자 없음. 사탕 빙글은 코드')
CARD = 'a portrait paper-cream (#F6ECD8) card with rounded corners and NO border line, NO letters; in its centre a picture of '
prop('nb_prop_card_cherry', CARD + 'two round cherry-red (#C8323A) cherries on thin stems with one pine-green (#3F6B4F) leaf.', '9', note='누르는 대상, 120×140')
prop('nb_prop_card_snowball', CARD + 'one round snowball made of snow-white (#F4F6FA) paper with an ice-blue (#CFE0F2) shadow piece at its bottom.', '9', ref='nb_prop_card_cherry')
prop('nb_prop_card_jelly', CARD + 'a sky-blue (#3E7CB1) bowl full of wobbly marigold (#F2B134) jelly.', '9', ref='nb_prop_card_cherry', note='오답 카드, 출렁')
for k in ('cherry', 'snowball', 'jelly')[1:]:
    jj = next(j for j in jobs if j['id'] == f'nb_prop_card_{k}')
    jj['prompt'] = jj['prompt'].replace('SUBJECT AND POSE:\n', 'SUBJECT AND POSE:\nThe CARD itself MUST be drawn: a cream portrait card exactly like the card in the reference image, with the small picture INSIDE it. Do NOT copy the cherries.\n', 1)
for k, w in [('roof', 'a long low horizontal'), ('yard', 'a wide horizontal'), ('wall', 'a tall upright')]:
    prop(f'nb_prop_marker_{k}', f'a small position MARKER: {w} rounded patch of honey (#F6D27A) paper with three tiny honey star pieces on it. Simple, flat.', '7', shape='wide' if k != 'wall' else 'sq', ref=None if k == 'roof' else 'nb_prop_marker_roof', note='누름판 표식(누름판 자체는 코드)')
for k, w in [('sock', 'a wide horizontal'), ('shelf', 'a long thin horizontal'), ('floor', 'a wide low horizontal')]:
    prop(f'nb_prop_marker_{k}', f'a small position MARKER: {w} rounded patch of honey (#F6D27A) paper with three tiny honey star pieces on it. Simple, flat.', '10', shape='wide', ref='nb_prop_marker_roof', note='누름판 표식')
prop('nb_prop_ash_cloud', 'three small puffy soot CLOUDS of ash-grey (#8B8680) paper with a few darker soot (#3A3430) flecks, in a loose row.', '8·11', shape='wide', note='1초 뒤 사라짐')
prop('nb_prop_leaves', 'four dry autumn LEAVES flying in a gust, flat cut paper in bark brown (#6B4A32) and persimmon (#E8703A), scattered loosely.', '7', shape='wide', note='날아오름 연출')
prop('nb_prop_snow_puff', 'a small burst of powdery SNOW: many little round snow-white (#F4F6FA) paper dots in a loose fan shape.', '7')
prop('nb_prop_holly', 'one short HOLLY sprig lying sideways: four pointed pine-green (#3F6B4F) holly leaves and a cluster of three round cherry-red (#C8323A) berries.', '1·8~11', shape='wide', note='선반 위 계절감(트리 없음, 판단 5)')
prop('nb_prop_candle', 'one UNLIT white candle (paper cream #F6ECD8) in a small straw-gold (#D9A94E) candlestick holder with a ring handle; the wick is a tiny cocoa strip, NO flame.', '3')
prop('nb_prop_lamb_toy', 'a small soft toy LAMB made of fluffy-looking snow-white (#F4F6FA) cut paper shapes lying on its side, with cocoa little legs; it is a toy object, so NO face, NO eyes, NO mouth.', '2', note='얼굴 없음(인형은 소품)')
HARN = [('red', 'bean red (#A93B32)'), ('green', 'pine green (#3F6B4F)'), ('blue', 'sky blue (#3E7CB1)'), ('marigold', 'marigold (#F2B134)'),
        ('plum', 'plum purple (#7B4F8C)'), ('persimmon', 'persimmon (#E8703A)'), ('lagoon', 'lagoon (#4FB3C9)'), ('pink', 'blossom pink (#F2A7B5)')]
for i, (k, hx) in enumerate(HARN):
    prop(f'nb_prop_harness_{k}', f'a reindeer HARNESS piece ONLY (no animal): a curved {hx} chest strap band, like a wide flat collar seen from the side, with one round straw-gold (#D9A94E) sleigh BELL hanging from it. Shaped to sit across the chest of the standing reindeer in the reference image (the same size and angle as its chest), but DO NOT draw the reindeer.',
         '5·6·7·12', ref=['nb_deer_stand'] if i == 0 else ['nb_deer_stand', 'nb_prop_harness_red'], note='서기용 8장 먼저(판단 12). 뒤 순록 몸 위에 얹음')

# ── 배경(16:9) ──────────────────────────────
COMMON = ('Light: set B (night) — the moon at the UPPER RIGHT, and indoors the fireplace embers at the right; all cast shadows fall to the LOWER LEFT. '
          'Characters, stockings, props and pressable items are separate sprites added later. NO people, NO Santa, NO reindeer, NO mouse, NO animals.')
def bg(pid, scene, papers, layout, ref=None, note='', pas=4):
    p = (BG_HEAD + 'SCENE:\n' + TALE + '\n' + NIGHT + '\n' + scene + ' ' + COMMON + ' SCENE PAPERS: ' + papers + '\n' + layout + '\n' + BG_RICH +
         '\nFRAME:\nNo decorative border. The scene fills the entire frame edge to edge.\n\n' + LIGHT_NO)
    J(id=pid, kind='bg', **{'pass': pas}, refs=[RAW + f'{r}.png' for r in ([ref] if isinstance(ref, str) else (ref or []))], size=[1600, 902], out=RAW + f'{pid}.png', note=note, prompt=p)
LIV_P = ('wallpaper olive sage #9BA88A with a small repeating pale sage #B9C4A8 cut-paper leaf motif; floor bark brown #6B4A32 planks; rug bean red #A93B32 with a straw-gold #D9A94E band; '
         'fireplace of stone grey #A9A39B and dust grey #C6BFB4 stones, the inside coal #2A2A2A with a few glowing embers ember amber #F2B366 and persimmon #E8703A (NO flames); mantel shelf cocoa #4E3524; '
         'window night deep indigo #1F2A56 with snow-white #F4F6FA snowflakes; wall clock paper cream #F6ECD8 with hands near twelve; armchair back plum purple #7B4F8C; mouse hole cocoa.')
LIV_L = ('Planes back to front: (1) the olive-sage wallpaper wall with a small night WINDOW at the LEFT (x 6-22%, y 12-45%) showing deep indigo night and falling snowflakes, and a round wall CLOCK high in the middle (x 46%, y 10%); '
         '(2) a big STONE FIREPLACE at the RIGHT (x 58-90%, y 22-82%) with a cocoa MANTEL SHELF across its top (y 22-27%) — the shelf top and the space under the mantel stay EMPTY (stockings and a holly sprig are separate sprites hung there later); '
         'inside the fireplace opening only a few glowing embers, no flames; a small dark round MOUSE HOLE at the foot of the wall just LEFT of the fireplace (x 52%, y 80%); '
         '(3) bark-brown plank floor from y 82% down, a bean-red rug with a straw-gold band in front of the fireplace; (4) front edge: the back of a plum-purple armchair peeking in at the LOWER LEFT corner only. '
         'The area in front of the fireplace (x 50-92%, y 55-100%) stays PLAIN (Santa stands there later). A plain wall area at the far left (x 0-12%, y 40-82%) where a door frame stands.')
bg('nb_bg_living', 'Scenes 1, 9 and 10: the quiet LIVING ROOM on Christmas Eve, seen at eye level, wide.', LIV_P, LIV_L, note='1·9·10장 거실. 양말·생쥐·호랑가시는 소품')
bg('nb_bg_living_tall', 'Scenes 8 and 11: the SAME living room as the reference image, but the whole room drawn smaller in the LOWER 62% of the picture so that ABOVE the ceiling we see a CUTAWAY of the CHIMNEY: '
   'a tall straight vertical flue (a soot #3A3430 and coal #2A2A2A shaft framed by brick-red #8E3B2F brick edges in section) rising from the top of the fireplace at the right (x 62-80%) up through the ceiling and the roof to the top edge of the picture. '
   'The flue inside stays PLAIN dark so Santa can slide down it later; a sliver of night sky with a star at the very top of the flue.', LIV_P + ' Plus soot #3A3430, brick red #8E3B2F, roof slate #3E4756.',
   'Keep the furniture placement EXACTLY as in the reference (window left, clock middle, fireplace right, mouse hole, rug, armchair corner). The flue is as wide as about one third of the fireplace.', ref='nb_bg_living', note='8·11장 굴뚝 단면판(pass 4b)')
bg('nb_bg_kids', 'Scene 2: the CHILDREN\'S BEDROOM, seen at eye level, close.', 'wallpaper dusty blue #7F93B0 with small paper-cream #F6ECD8 star cut-outs; floor bark brown #6B4A32; rug mint #CFE6DA; two bed frames cocoa #4E3524; pillows paper cream; sheets snow white #F4F6FA; '
   'small window deep indigo #1F2A56 with snow; a little night lamp ember amber #F2B366 glowing softly on a small cocoa table; toy box corner sky blue #3E7CB1.',
   'Planes back to front: (1) the dusty-blue star wall with a small night window high in the CENTRE (x 42-58%, y 8-32%) with snowflakes; (2) TWO small BEDS, one at the LEFT (x 4-44%) and one at the RIGHT (x 56-96%), their pillows at the INNER ends (near the centre), '
   'each bed an EMPTY bed frame with a flat snow-white sheet (the children and their quilts are separate sprites added later); a small cocoa table between them with the night lamp; (3) floor with a mint rug; (4) a sky-blue toy box corner at the LOWER LEFT edge. '
   'The space ABOVE both beds (y 10-45%) stays PLAIN wall (dream bubbles are placed there later).', note='2장 아이 방. 침대 틀 포함, 아이·이불은 소품')
bg('nb_bg_parents', 'Scenes 3 and 4: the PARENTS\' BEDROOM, seen at eye level, wide.', 'wallpaper mauve #8C6A7A with a dusty rose #D8A79A cut-paper pattern; floor bark brown #6B4A32; rug deep indigo #1F2A56 with a straw-gold #D9A94E band; big bed frame cocoa #4E3524; pillows paper cream #F6ECD8; '
   'window frame paper cream; wardrobe cocoa; bedside table cocoa; curtain edge dusty rose.',
   'Planes back to front: (1) the mauve wall; a tall WINDOW OPENING on the RIGHT wall (x 68-90%, y 14-62%) with a paper-cream frame — its inside is filled with plain dark bark-brown (#6B4A32) as if covered (wooden shutters are separate sprites placed over it later); '
   '(2) ONE big BED in the CENTRE (x 22-70%, y 52-88%) seen from the side, headboard at the RIGHT end, an EMPTY bed frame with a plain sheet (the parents and their quilt are separate sprites); a small bedside table at the right of the bed (x 70-76%) left EMPTY (a candle sprite goes on it); a cocoa wardrobe at the far LEFT (x 0-16%); '
   '(3) the floor and a deep-indigo rug; (4) a dusty-rose curtain edge hanging at the UPPER RIGHT corner. The space between the bed and the window stays plain.', note='3·4장 부모 방(덧문은 소품)')
bg('nb_bg_parents_open', 'Scene 4 after the shutters are thrown open: the SAME parents\' bedroom as the reference image, EXACTLY the same layout, but the window opening on the right now shows the OUTSIDE: a big pearl-cream #FBF3D5 moon high in the window, '
   'deep indigo #1F2A56 and midnight blue #27336B night sky, a snow-white #F4F6FA snowy yard with moon-snow #E6EEF8 shaded snow, and a row of far deep-pine #2F4F3C fir trees. '
   'A soft square of cream MOONLIGHT falls from the window onto the floor toward the left (a light layer that fades with distance from the window — light gradient allowed ONLY for this moonlight; paper pieces stay one flat colour).',
   'mauve #8C6A7A, dusty rose #D8A79A, bark brown #6B4A32, cocoa #4E3524, paper cream #F6ECD8, deep indigo #1F2A56, midnight blue #27336B, pearl cream #FBF3D5, snow white #F4F6FA, moon snow #E6EEF8, deep pine #2F4F3C.',
   'Keep everything else EXACTLY as in the reference.', ref='nb_bg_parents', note='4장 열린 창(pass 4b)')
YARD_P = ('sky in three bands abyss navy #0F1F3D (top), deep indigo #1F2A56, midnight blue #27336B (lowest, lightest); moon pearl cream #FBF3D5; stars honey #F6D27A; far hills dusk violet #4A4F8C; fir trees deep pine #2F4F3C and fir dark #223B2E with snow-white caps; '
          'snowy yard snow white #F4F6FA, moon snow #E6EEF8, shadow snow ice blue #CFE0F2; house wall paper cream #F6ECD8; roof roof slate #3E4756 with thick snow; chimney brick red #8E3B2F; one window glowing ember amber #F2B366; front porch bark brown #6B4A32; fence dust grey #C6BFB4 with snow.')
bg('nb_bg_yard', 'Scenes 5, 6 and 7: OUTSIDE the house on a bright moonlit snowy night, seen wide from the side.', YARD_P,
   'Planes back to front: (1) the night sky bands, a big round pearl-cream MOON at the UPPER RIGHT (x 80%, y 14%) with a soft cream glow ring (light layer), a few honey stars; (2) far dusk-violet hills with a row of small dark fir trees along the horizon (y 50-58%); '
   '(3) a BIG two-storey HOUSE at the LEFT (x 0-34%) seen from the side: paper-cream wall, a steep snow-covered slate ROOF whose ridge reaches high up (y 12%), a brick-red CHIMNEY on the roof, a first-floor WINDOW (x 18-30%, y 42-60%) glowing ember amber with its inside left EMPTY plain amber (the father is placed in it later), a porch below; a low snowy fence running right from the house; '
   '(4) the snowy YARD: two gentle snow drifts (snow white and moon snow) filling the bottom from y 62% down. The yard from x 34% to 95% and y 55-100% stays PLAIN snow (the sleigh and eight reindeer are placed there later). The long snowy roof slope (x 4-32%, y 12-30%) stays plain for the reindeer. '
   'A dark fir branch silhouette ONLY at the very lower-left corner.', note='5·6·7장 마당(지붕·굴뚝 포함)')
bg('nb_bg_yard_lb', 'Scene 5 LIGHT-BOX version: the SAME yard as the reference image with exactly the same layout, but lit like a paper light box: the moon becomes a glowing pearl-cream light disc behind the paper layers, the sky bands one step darker, the far fir row and hills turn into dark fir-dark #223B2E silhouettes, and the snowy yard is the brightest lit sheet. '
   'The moonlight is cream, NEVER orange.', YARD_P, 'Keep the house window glowing amber and the yard centre plain.', ref='nb_bg_yard', note='5장 빛 상자판(선택). 12장 빛 상자 검수 뒤 결정(판단 8)', pas=9)
SKY_P = ('sky abyss navy #0F1F3D, deep indigo #1F2A56, midnight blue #27336B, a dusk violet #4A4F8C ring around the moon; a HUGE moon pearl cream #FBF3D5; stars honey #F6D27A; far roofs and firs silhouettes fir dark #223B2E, deep pine #2F4F3C; '
         'our roof roof slate #3E4756 with snow white #F4F6FA; chimney brick red #8E3B2F; window glow ember amber #F2B366; snowflakes snow white.')
bg('nb_bg_sky', 'Scene 12: high up at ROOF LEVEL on Christmas Eve night, looking across the sky, wide.', SKY_P,
   'Planes back to front: (1) the night sky bands; a HUGE round pearl-cream MOON at the UPPER RIGHT (centre x 74%, y 34%, its diameter about 45% of the picture height) with a dusk-violet ring and a soft cream glow (light layer); honey stars; '
   '(2) a band of far snowy rooftops and fir-tree tops along the bottom quarter (y 76-100%), simple flat silhouettes; (3) OUR house roof with thick snow and the brick-red chimney at the LOWER LEFT (x 0-30%, y 58-100%), one small glowing amber window under the roof edge (x 8-20%, y 80-92%) left EMPTY plain amber (the father is placed in it later); '
   '(4) one dark fir branch silhouette at the very lower-left corner. The diagonal path from the lower left to the moon (x 25-95%, y 20-75%) stays PLAIN sky (the sleigh flies there).', note='12장 지붕 높이 하늘')
bg('nb_bg_sky_lb', 'Scene 12 LIGHT-BOX version: the SAME sky as the reference image with exactly the same layout, lit like a paper light box: the huge moon is a glowing pearl-cream light disc BEHIND the paper layers, rings of dusk violet, midnight blue, deep indigo and abyss navy getting darker outward, '
   'the far rooftops, firs and our roof become dark fir-dark #223B2E SILHOUETTES (only our window glows ember amber). The moonlight is cream, NEVER orange.', SKY_P,
   'Keep the diagonal sleigh path plain. Silhouettes stay in the bottom quarter and the lower-left corner only.', ref='nb_bg_sky', note='12장 빛 상자판(주). 색지 썰매 합성 검수 통과 시에만(판단 8)')
bg('nb_bg_back', 'BACK COVER (the ending page): one flat sheet of kraft paper #EBDFC8 with fine grain; on it, low in the middle, four simple Christmas STOCKING SILHOUETTES hanging in a row from a thin mantel line, cut from slightly darker kraft #C9A574 paper, and a few tiny snow-white star dots above. '
   'Very simple and calm, lots of empty kraft paper (text is placed there later).', 'kraft #EBDFC8, kraft dark #C9A574, snow white #F4F6FA.', 'Only 2 flat layers. Nothing else.', note='뒷표지(미리보기에 쓰지 않음)', pas=6)
jobs[-1]['prompt'] = jobs[-1]['prompt'].replace(NIGHT + '\n', '').replace(BG_RICH, '')

# ── 컷(4:3) ─────────────────────────────────
# 2026-11-28 다시 그림(검수): 옛 컷은 원작과 어긋났다(거실에 순록·침대, 잠든 아이들이 깨어 창밖을 봄) + 컷 속 아빠가 무대 아빠와 다름(콧수염·흰 모자).
# 다섯 장 모두 무대 아빠 기준 그림(nb_dad_stand)을 참고로 넣고, 아빠 생김새 문장(C['dad'])과 '아이들·엄마는 자는 중이라 안 보임'을 프롬프트에 적는다.
FC = ' '.join(F[k] for k in ('dad', 'santa', 'deer'))
DADC = ('THE FATHER (when he appears) must look EXACTLY like the father reference sprite: ' + C['dad'] +
        ' He wears the long floppy BEAN-RED nightcap with a snow-white pompom (NOT a cream or white cap) and dusty-blue pyjamas; he has NO moustache and NO beard. ')
ASLEEP = ('The children and the mother are ASLEEP in their beds in other rooms and are NOT shown: NO children, NO mother, NO other faces at any window. ')
def cut(pid, moment, panel, refs, scene):
    p = (CUT_HEAD + 'MOMENT:\nOne picture-book moment filling the ENTIRE image edge to edge (full-bleed, no border), kid-friendly, gentle and warm. ' + moment +
         ' Every character keeps exactly the head size, body proportions, colours and markings of its reference sprite; only the pose and expression change. Size relation: St. Nicholas is only 0.7 of the father\'s height; a reindeer up to its antler tips is 0.6 of St. Nicholas\'s height. '
         + DADC + ASLEEP +
         'Objects, props, the moon, the sleigh and backgrounds have NO face. ' + TALE + ' ' + NIGHT +
         '\n\nPANEL BACKGROUND:\n' + panel + ' — every piece one flat solid colour, no gradient (except a soft light glow where the moment says so).\n\n' + FC +
         '\n\nIf reference images are attached, they show the characters: match their shapes, colours, clothes and markings exactly.\n\nFRAME:\nNo border, no speech bubbles, no panel lines, no letters; fills the frame edge to edge. The panel background is the scene itself — NEVER a plain magenta or chroma-key background.\n\n' + LIGHT_NO)
    J(id=pid, kind='cut', **{'pass': 5}, refs=[RAW + f'{r}.png' for r in refs], size=[1600, 1200], aspect='landscape 4:3', out=RAW + f'{pid}.png', note=scene, prompt=p)
cut('nb_cut_window_moon', 'Inside the parents\' dark bedroom, seen from just behind the father: exactly ONE person, the FATHER, stands at the LEFT in three-quarter BACK view, both hands on the sill of a window he has just thrown open, looking OUT and to the RIGHT at the moonlit yard (only the side of his amazed face shows: eyebrows up, mouth open). The two bark-brown wooden shutters are flung open and the paper-cream window frame forms the front paper sheet with a cut-out window; through it, the whole snowy yard under a big pearl-cream moon at the upper right, the new-fallen snow shining bright cream-white like midday, far dark fir trees. NO sleigh, NO reindeer, NO St. Nicholas yet (an empty, expectant moonlit yard). NO bed in the picture.',
    'deep indigo #1F2A56 and midnight blue #27336B sky, pearl cream #FBF3D5 moon with a soft glow, snow white #F4F6FA and moon snow #E6EEF8 snow, deep pine #2F4F3C firs, bark brown #6B4A32 shutters, paper cream #F6ECD8 frame, mauve #8C6A7A bedroom wall', ['nb_dad_stand', 'nb_dad_look_out', 'nb_dad_window_face'], '4장 끝')
cut('nb_cut_fly_up', 'OUTSIDE the house at night. At the LEFT the house wall and, at the UPPER LEFT, its snowy roof corner with the chimney. In ONE small lit window low on that wall the FATHER leans out: only his head, shoulders and both hands on the sill, his head tilted back looking UP to the RIGHT at the flying team (curious, mouth a small round "o"). From the lower right, exactly EIGHT tiny reindeer (two by two in four rows, no red noses, each with a differently coloured harness strap and a gold bell) fly UP in a curve toward the roof corner at the upper left, pulling a miniature bean-red sleigh with a toy bundle at the back; ONE small chubby St. Nicholas stands in the sleigh holding the reins and calling out; four dry brown and persimmon leaves fly up with them. The snowy yard below. Exactly ONE window has a face (the father); every other window is dark and empty.',
    'abyss navy #0F1F3D to midnight blue #27336B sky, pearl cream moon at the upper right, snow white yard, roof slate #3E4756 roof with snow, paper cream #F6ECD8 house wall, ember amber #F2B366 window light', ['nb_dad_window_up', 'nb_dad_stand', 'nb_deer_fly', 'nb_santa_drive', 'nb_prop_sleigh'], '7장')
cut('nb_cut_chimney', 'Inside the LIVING ROOM at night, shown as a CUTAWAY: the stone fireplace with its chimney opened up like a doll\'s house so the narrow soot-dark flue is visible above it. Inside the flue ONE small chubby St. Nicholas drops down with a bound, knees bent, arms up, eyes squeezed shut laughing, the toy sack on his back, little ash-grey soot puffs around him; below, the fireplace opening with a warm amber ember glow (a soft light layer) and FOUR empty stockings (red, green, blue, yellow) hanging in a row from the mantel. At the LEFT, in a doorway, the FATHER (whole figure, standing, the same scale as his reference) has just turned around and stares at the chimney, both hands raised to his chest, eyes wide, mouth a small "o", looking RIGHT. Exactly TWO characters: St. Nicholas and the father. This is the LIVING ROOM: NO bed, NO quilt, NO pillow, NO reindeer or other animals inside the house, NO sleigh.',
    'olive sage #9BA88A wallpaper, stone grey #9A9590 fireplace stones, soot #3A3430 and coal #2A2A2A flue, brick red #8E3B2F chimney bricks, ash grey #8B8680 soot, ember amber #F2B366 glow, bark brown #6B4A32 floor and door frame, bean red #A93B32 rug', ['nb_santa_bound_down', 'nb_dad_startled', 'nb_dad_stand', 'nb_prop_stocking_red'], '8장')
cut('nb_cut_santa_face', 'A CLOSE-UP in the living room: ONE St. Nicholas\'s face and shoulders fill the RIGHT two-thirds, three-quarter view looking slightly LEFT: twinkling eyes with a tiny honey star, merry dimples, rose cheeks like roses, a round cherry-red nose like a cherry, a small bow-shaped smile, a round beard as white as snow, the bean-red fur cap with its sooty cream fur band, the toy sack strap on his shoulder. At the far LEFT edge, the FATHER peeks out from behind a bark-brown door frame: only his head, one shoulder and one hand are visible, the hand over his mouth trying not to giggle, eyes crinkled with laughter, looking RIGHT at St. Nicholas; his head is drawn about the same size as St. Nicholas\'s head (both close to the viewer). Exactly TWO characters. NO pipe, NO smoke.',
    'the olive-sage #9BA88A living-room wall, bark brown #6B4A32 door frame, a hint of the stone-grey fireplace and the amber ember glow behind St. Nicholas', ['nb_santa_stand_pack', 'nb_dad_peek', 'nb_dad_giggle', 'nb_dad_stand'], '9장')
cut('nb_cut_moon_sleigh', 'Across a HUGE pearl-cream full moon, the miniature sleigh and exactly EIGHT tiny reindeer fly to the RIGHT as a classic dark SILHOUETTE (fir-dark #223B2E cut paper silhouettes, allowed for this one cut), ONE small St. Nicholas in the sleigh waving back. Below at the LOWER LEFT: the snowy roof and chimney of the house as dark silhouettes, with ONE warm lit window (a soft amber light layer) in which the FATHER, in his own colours (NOT a silhouette), leans out waving up to the RIGHT: only his head, shoulders and one waving arm, a happy smile. Far snowy rooftops as dark silhouettes, a few snow-white snowflakes. Exactly ONE lit window and ONE face in it (the father).',
    'abyss navy #0F1F3D, deep indigo #1F2A56, midnight blue #27336B sky rings, dusk violet #4A4F8C ring, pearl cream #FBF3D5 huge moon glowing softly, fir dark #223B2E silhouettes, ember amber #F2B366 window light', ['nb_dad_wave', 'nb_dad_window_face', 'nb_dad_stand', 'nb_deer_fly', 'nb_prop_sleigh'], '12장')

# ── 표지·썸네일 ─────────────────────────────
FCK = FC
def key(pid, frame, scene, refs, out, aspect):
    p = KEY_HEAD + frame + '\n\nSCENE INSIDE THE WINDOW:\n' + TALE + ' ' + NIGHT + '\n' + scene + '\n\n' + FCK + '\n\nMatch the characters in the reference images exactly (same shapes, colours, clothes, markings).\n\n' + KEY_TAIL
    if 'WINDOW' not in frame: p = p.replace('SCENE INSIDE THE WINDOW:', 'SCENE:')
    J(id=pid, kind='key', **{'pass': 6}, refs=[RAW + f'{r}.png' for r in refs], out=out, aspect=aspect, prompt=p)
WIN = ('FRAME (most important):\nThe whole {asp} canvas is ONE flat sheet of warm cream cardstock (#f5efe9) with fine paper grain. A large window is cut out of it in the shape of a '
       'ROUND FULL MOON (a circle). It is centred horizontally, {pos}. The scene is seen THROUGH this window, built from 3 or 4 layered paper depth planes behind the sheet; '
       'the window edge shows the sheet thickness with a soft inner shadow along the top and inner edges and a light cut edge at the bottom. {rest} '
       'Around the rim, two small flat paper holly sprigs with red berries overlap the edge at the upper-left and upper-right. Nothing else on the cream sheet.')
key('nb_key_land', WIN.format(asp='wide 16:9', pos='its top at about 4% of the height and its diameter about 74% of the canvas HEIGHT',
                              rest='The lower 22% of the canvas below the window and both side areas are plain empty cream paper (a title is placed there later).'),
    'A big pearl-cream moon fills the back; across it flies the miniature bean-red sleigh with eight tiny reindeer (no red noses) and small chubby St. Nicholas waving; below, a snowy roof with a brick-red chimney and one glowing amber window in which the father in his red nightcap looks up and smiles. BIG and clear characters; rich colours at the edges and far back.',
    ['nb_santa_sleigh_wave', 'nb_deer_fly', 'nb_prop_sleigh', 'nb_dad_window_up'], 'assets/raw/keyart_gpt/night_before_wide_v1.png', 'landscape 16:9')
key('nb_key_port', WIN.format(asp='portrait 3:4', pos='its top at about 5% of the height, its diameter about 86% of the canvas width',
                              rest='The lower 20% of the canvas below the window is plain empty cream paper (a title is placed there later).'),
    'Stacked from top to bottom (a DIFFERENT composition, not a crop): at the top the sleigh and the eight tiny reindeer flying over a huge moon; in the middle a snowy roof and chimney; at the bottom, seen through a cosy window, four colourful stockings (red, green, blue, yellow) hanging at a stone fireplace with glowing embers.',
    ['nb_deer_fly', 'nb_prop_sleigh', 'nb_prop_stocking_red'], 'assets/raw/keyart_gpt/night_before_tall_v1.png', 'portrait 3:4')
key('nb_thumb', 'COMPOSITION (most important):\nA landscape 4:3 thumbnail tile, a full-bleed rectangular paper diorama picture (no cream sheet, no window, no border, no frame). Only 2 or 3 flat paper depth planes.',
    'On a snowy roof under a big moon: small chubby St. Nicholas BIG in the centre-left (his face large and clear), the bean-red sleigh beside him and just three tiny reindeer at the right. A deep-indigo night sky.',
    ['nb_santa_stand_pack', 'nb_deer_stand', 'nb_prop_sleigh'], 'assets/raw/keyart_gpt/night_before_tile_v1.png', 'landscape 4:3')

# 그림 도구는 참고 그림을 5장까지만 받는다
jobs.sort(key=lambda j: (j['pass'], j['id'] == DAD))  # 안정 정렬: 아빠 기준은 1단계 끝(엄마·산타를 참고)
for j in jobs: assert len(j['refs']) <= 5, j['id']
assert len({j['id'] for j in jobs}) == len(jobs)
json.dump(jobs, open(os.path.join(G, 'tools/app/gen/jobs_night_before.json'), 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(jobs), sorted(Counter((j['kind'], j['pass']) for j in jobs).items()))
