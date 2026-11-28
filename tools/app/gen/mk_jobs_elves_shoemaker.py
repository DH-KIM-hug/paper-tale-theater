#!/usr/bin/env python3
"""구두장이와 요정(elves_shoemaker) 그림 작업표 tools/app/gen/jobs_elves_shoemaker.json 을 만든다 — tales/elves_shoemaker/PLAN.md 그림 목록 그대로.
틀은 mk_jobs_night_before.py 와 같다(스타일 문단은 jobs_byeoljubu.json 에서 가져옴).
  python3 tools/app/gen/mk_jobs_elves_shoemaker.py
pass 1: 기준 자세 7장 / pass 2: 기준 그림을 참고로 넣는 자세·얼굴·둘째 프레임 / pass 3: 소품·앞 가림 / pass 4: 배경 / pass 5: 컷 / pass 6: 표지·썸네일·뒷표지
확정(2026-11-26 추천안): 요정은 다 해진 회색 누더기 한 장·사람 귀, 기도 자세 없음, 같은 자세 다른 표정은 전신 따로, 선물 세트(es_prop_gift_set)는 옷 소품을 코드로 배치해 만들지 않음,
손님 2·3 둘 다, 12장 창밖 발자국 es_prop_footprints 추가, 6장 라이트박스 배경 한 장(검수용)과 보통 밤 배경 둘 다.
2프레임 자세(cut, hammer, sew, clap, sit_sew, sit_hammer)는 기획 id 를 첫 프레임으로, 둘째 프레임을 <id>_b 로 만든다(첫 프레임을 참고, 손만 바뀜).
광원: 인물·소품 그림은 세트 A 문장 그대로. 배경·컷은 장면 세트(낮·아침 A, 저녁·밤 B).
확정(2026-11-27 사용자): 요정 B 는 여자아이 요정(양 갈래 곱슬 머리, 누더기 원피스, 새 옷은 치마). 요정 수는 원작대로 둘. A 는 그대로."""
import json, os, re
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
BJ = {j['id']: j['prompt'] for j in json.load(open(os.path.join(G, 'tools/app/gen/jobs_byeoljubu.json')))}
def cut_at(s, a, b=None): i = s.index(a); return s[i:] if b is None else s[i:s.index(b, i)]
def set_b(t):  # 세트 B: 빛은 오른쪽 위, 그림자는 왼쪽 아래
    return (t.replace('from the upper-left', 'from the upper-right')
             .replace('All cast shadows fall toward the LOWER RIGHT (light source at the upper left)', 'All cast shadows fall toward the LOWER LEFT (light source at the upper right)'))
SP_HEAD = BJ['bj_prop_medicine_bag'][:BJ['bj_prop_medicine_bag'].index('SUBJECT AND POSE:')]
SP_TAIL = cut_at(BJ['bj_prop_medicine_bag'], 'If a reference image is attached')
BG_HEAD = BJ['bj_bg_shore_day'][:BJ['bj_bg_shore_day'].index('SCENE:')]
BG_RICH = cut_at(BJ['bj_bg_shore_day'], 'RICHNESS', 'FRAME:').replace('NO fish, ', '')
CUT_HEAD = BJ['bj_cut_shock'][:BJ['bj_cut_shock'].index('MOMENT:')]
KEY_HEAD = BJ['bj_key_wide'][:BJ['bj_key_wide'].index('FRAME (most important):')]
KEY_TAIL_A = cut_at(BJ['bj_key_wide'], 'LIGHTING:')
LIGHT_A = cut_at(BJ['bj_bg_shore_day'], 'LIGHTING:').replace('NO people.\nNO animals.\n', '')
LIGHT_B = set_b(LIGHT_A)
RAW = 'assets/raw/restyle/elves_shoemaker/'

TALE = ('This is the Grimm fairy tale THE ELVES AND THE SHOEMAKER, set in a small generic old European village shoemaker\'s workshop in snowy winter just before Christmas: '
        'a wooden work table, a three-step shoe shelf, a window, a door, a candle. Simple, warm, gentle, kid-friendly. No Disney look, no film look, no modern objects.')
NIGHT = ('If it is night, it is a READABLE storybook night: mid-tone navy and brown papers with clear shapes, NOT black, NOT murky. Moonlight is cream, never orange; only the candle is warm amber.')

SKIN = 'skin warm light peach (#F4C9A8), two round candy-pink (#E8A0B8) cheeks'
C = {
 'sm': ('the SHOEMAKER, a kind hard-working man of about 50: grey-streaked hair (stone grey #A9A39B mixed with chestnut #8B5A2B pieces) and a short neat grey-brown beard, '
        'a paper-cream (#F6ECD8) shirt with rolled sleeves, a pine-green (#3F6B4F) waistcoat, a saddle-brown (#A0623A) leather apron, slate (#5A554E) trousers, cocoa (#4E3524) shoes, ' + SKIN + '. 2.5 heads tall (a big round head).'),
 'wf': ('the SHOEMAKER\'S WIFE, a warm clever woman of about 50: chestnut (#8B5A2B) hair with a holly-red (#C8303A) headscarf tied at the back of the head, a teal (#2F7F7A) long dress, '
        'a paper-cream (#F6ECD8) apron, cocoa shoes, ' + SKIN + '. 2.5 heads tall.'),
 'ea': ('ELF A, a tiny human-like little man (an elf only as tall as a grown-up\'s knee) with HUMAN ears (round, NOT pointed), short straw-gold (#D9A94E) hair, round cheeks, ' + SKIN + '. '
        'Proportions: 2.5 heads tall like a small child. NOT a pointed-hat elf, NO green pointed cap, NO pointed ears, NOT a Christmas-helper costume, NOT any film or cartoon elf.'),
 'eb': ('ELF B, a tiny human-like little GIRL elf, clearly a girl (as tall as a grown-up\'s knee, EXACTLY as tall as elf A) with HUMAN ears (round, NOT pointed), '
        'curly chestnut (#8B5A2B) hair tied in TWO short bouncy curly bunches (pigtails), one at each side of the head, each tied with a small cherry-red (#E04B3C) ribbon bow, '
        'a few saddle (#A0623A) freckle dots on the nose, a round soft girl\'s face that looks clearly DIFFERENT from elf A (elf A is a boy with short straw-gold hair), ' + SKIN + '. '
        'Proportions: 2.5 heads tall like a small child (a little girl). NOT a pointed-hat elf, NO green pointed cap, NO pointed ears, NOT a Christmas-helper costume, NOT any film or cartoon elf.'),
 'c1': ('CUSTOMER 1, a cheerful gentleman: a long cobalt-blue (#3A6FD8) coat, a cocoa (#4E3524) round hat, a paper-cream scarf, NO glasses, ' + SKIN + '. 2.5 heads tall.'),
 'c2': ('CUSTOMER 2, a friendly lady: a mustard (#D9A94E) shawl over a dusty-rose (#C98A7A) dress, chestnut hair in a bun, ' + SKIN + '. 2.5 heads tall.'),
 'c3': ('CUSTOMER 3, a relaxed old grandfather: a fir-dark (#2F4F3C) long coat, a long snow-white (#F4F6FA) beard, a bark-brown (#6B4A32) walking stick, ' + SKIN + '. 2.5 heads tall.'),
}
OUT = {  # 요정 옷
 'rag': 'He wears a worn dust-grey (#C6BFB4) tunic-dress reaching the knees, with short sleeves, a few patches and a jagged hem, fully covering the body (a plain old work smock, modest and complete); BARE FEET (he looks a little cold).',
 'ea_new': ('He wears his NEW little clothes: a snow-white (#F4F6FA) shirt, a holly-red (#C8303A) little coat, a sunny-yellow (#F2C94E) waistcoat, cobalt-blue (#3A6FD8) trousers, '
            'leaf-green (#6FB94A) and snow-white striped socks, little cocoa (#4E3524) shoes.'),
 'eb_rag': 'She wears a worn dust-grey (#C6BFB4) little DRESS (the same grey cloth as elf A\'s) reaching the knees, with short sleeves, a few patches and a jagged hem, fully covering the body (a plain old smock dress, modest and complete); BARE FEET (she looks a little cold).',
 'eb_new': ('She wears her NEW little clothes: a snow-white (#F4F6FA) blouse, a leaf-green (#6FB94A) little coat, a cherry-red (#E04B3C) waistcoat, a slate-blue (#6C739A) knee-length SKIRT (NOT trousers), '
            'sunny-yellow (#F2C94E) and snow-white striped knee socks, little cocoa (#4E3524) shoes.'),
}
FACE = ('FACE: two round eyes (a white disc with an ink #2A2A2A disc), two small EYEBROW strips (the eyebrows show the mood), a small nose piece, a curved paper-strip mouth, two round candy-pink cheeks. '
        'No eyelashes, no glossy highlights.')
FRAMING = {
 'sq': 'FRAMING:\nSquare 1:1 image. The whole figure is visible and centred, filling about 80% of the frame. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
 'wide': 'FRAMING:\nLandscape 3:2 image. The whole figure is visible and centred, filling about 85% of the frame width. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
}
NOMAG = ('\nNO magenta, hot-pink or bright purple anywhere inside the subject (candy pink only on the cheeks).\nNO white outline, NO sticker border, NO light rim around the figure: the outer edge is the clean cut edge of the paper itself.')
def she(t):  # 요정 B(여자아이)에게 쓰는 문장: he/his/him → she/her (A 문장은 그대로)
    for a, b in ((r'\bHe\b', 'She'), (r'\bhe\b', 'she'), (r'\bHis\b', 'Her'), (r'\bhis\b', 'her'), (r'\bhim\b', 'her'), (r'\bhimself\b', 'herself')): t = re.sub(a, b, t)
    return t
ELVES2 = 'exactly TWO tiny elves, a boy and a girl (the boy elf A with short straw-gold hair, the girl elf B with curly chestnut pigtails)'

def sp_tail(shape):
    t = SP_TAIL
    t = t.replace(t[t.index('FRAMING:'):t.index('LIGHTING:')], FRAMING[shape] + '\n\n')
    if t.rstrip().endswith('NO magenta or hot-pink anywhere inside the subject.'):
        t = t.rstrip()[:-len('NO magenta or hot-pink anywhere inside the subject.')].rstrip()
    return t + NOMAG

jobs = []
def J(**k): jobs.append(k); return k
SAME = ('The SAME character as the first reference image. SAME SCALE AS THE REFERENCE: the head, face, eyes and body are exactly the same size as in the reference image '
        '(measure by the head width); only the pose and expression change as described. Keep every colour, piece and marking of the reference exactly. ')

def char(who, pid, pose, scenes, ref=None, shape='sq', note='', other=None, outfit=None, extra_refs=()):
    """ref: 같은 인물의 기준(또는 바로 앞) 그림. other=(id, 문장): 다른 인물 그림을 크기·종이 결 참고로만. outfit: 요정 옷('rag'|'new')"""
    refs, same = [], ''
    if ref: refs.append(RAW + f'{ref}.png'); same = SAME
    for r in extra_refs: refs.append(RAW + f'{r}.png')
    if other: refs.append(RAW + f'{other[0]}.png'); same += other[1] + ' '
    desc = C[who][0].upper() + C[who][1:]
    if outfit: desc += ' ' + OUT[('eb_rag' if who == 'eb' else 'rag') if outfit == 'rag' else who + '_new']
    if who == 'eb': pose, same, desc = she(pose), she(same), she(desc)
    p = (SP_HEAD + 'SUBJECT AND POSE:\n' + TALE + '\n' + same + desc + '\nPOSE AND EXPRESSION: ' + pose +
         '\nHANDS: nothing in the hands unless the pose names an object; never another character in the hands.\n\n' + FACE + ' Objects that are not characters have NO face.\n\n' + sp_tail(shape))
    J(id=pid, kind='sprite', **{'pass': 2 if (ref or extra_refs) else 1}, refs=refs, size=[840, 560] if shape == 'wide' else [600, 600], out=RAW + f'{pid}.png',
      **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), note=f'{scenes}장. {note}'.strip(), prompt=p)

def frame_b(pid, change, scenes, outfit=None):
    """2프레임 자세의 둘째 그림: 첫 프레임과 똑같고 손(도구) 위치만 바뀜"""
    who = pid.split('_')[1]
    char(who, pid + '_b', 'EXACTLY the same pose, position, size, clothes and expression as the reference image (this is the SECOND animation frame of the same motion); ONLY this changes: ' + change,
         scenes, pid, outfit=outfit, note=f'{pid} 의 둘째 프레임(2프레임 교차)')

def face(pid, base, who, outfit=None):
    char(who, pid, 'ONLY the HEAD (and the top of the neck) of this character, cut out on its own, front view, a friendly calm smile, looking at the viewer. The bottom edge is cut cleanly under the chin. No body.',
         '말풍선', base, outfit=outfit, note='T.faceArt 말풍선 얼굴(기준 자세 머리)')

def prop(pid, desc, scenes, shape='sq', ref=None, note='', pas=3):
    refs = [RAW + f'{r}.png' for r in ([ref] if isinstance(ref, str) else (ref or []))]
    p = (SP_HEAD + 'SUBJECT AND POSE:\nAn OBJECT (not a character) for the fairy tale The Elves and the Shoemaker (an old village shoemaker\'s workshop): ' + desc +
         (' Draw it in the SAME paper style and at the same scale as the attached reference object.' if ref else '') +
         ' Shown alone, centred.\n\nThis is an OBJECT, not a character: NO face, NO eyes, NO mouth anywhere on it.\n\n' + sp_tail(shape))
    J(id=pid, kind='sprite', **{'pass': pas}, refs=refs, size=[840, 560] if shape == 'wide' else [600, 600], out=RAW + f'{pid}.png',
      **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), note=f'{scenes}장. {note}'.strip(), prompt=p)

# ── 기준 자세 7장(pass 1) ─────────────────────
SM, WF, EA, EB = 'es_sm_stand', 'es_wf_stand', 'es_ea_stand', 'es_eb_stand'
def other_sm(scale): return (SM, f'The reference image is a DIFFERENT character (the shoemaker) shown ONLY for paper style and scale: draw a different person, {scale}')
char('sm', SM, 'standing in three-quarter SIDE VIEW FACING RIGHT, both hands hanging down relaxed, calm plain expression (eyebrows level, small closed mouth), looking RIGHT.', '1·3·12', note='기준 자세: 머리카락 폭 기준, 크기표 1.0')
char('wf', WF, 'standing in three-quarter SIDE VIEW FACING LEFT, both hands resting together on her apron, calm gentle expression, looking LEFT.', '3·12', other=other_sm('with her head (headscarf width) 0.95 times as wide as his head and her height 0.95 of his height.'), note='기준 자세: 머리수건 폭, 0.95')
char('ea', EA, 'standing in three-quarter SIDE VIEW FACING RIGHT, arms at his sides, calmly curious (eyebrows a little raised), looking RIGHT.', '6', outfit='rag',
     other=other_sm('a TINY elf: his whole height only 0.42 of the shoemaker\'s height (up to just above the man\'s knee) and his head 0.55 times as wide as the man\'s head; keep 2.5-heads proportions (do NOT make the head small).'), note='기준 자세: 머리카락 폭, 키 0.42·머리 폭 0.55')
char('eb', EB, 'standing in three-quarter SIDE VIEW FACING RIGHT, arms at his sides, calmly curious, looking RIGHT.', '6', outfit='rag',
     other=(EA, 'The reference image is a DIFFERENT elf (elf A) shown ONLY for paper style and scale: draw a different elf: a GIRL elf with a clearly different face and hair (curly chestnut pigtails with little ribbons), EXACTLY the same height and head size.'), note='기준 자세(A 와 같은 크기)')
for k, sc in (('c1', 'his height 1.05 of the shoemaker\'s height and his head (hat width) as wide as the shoemaker\'s head'), ('c2', 'her height 0.95 of his height and her head 0.95 times as wide as his head'), ('c3', 'his height 0.98 of the shoemaker\'s height and his head as wide as the shoemaker\'s head')):
    pose = {'c1': 'standing at a door in three-quarter SIDE VIEW FACING RIGHT, curious friendly expression, looking RIGHT.',
            'c2': 'standing in three-quarter SIDE VIEW FACING RIGHT, bright friendly smile, looking RIGHT.',
            'c3': 'standing in three-quarter SIDE VIEW FACING RIGHT holding the walking stick in one hand, relaxed smile, looking RIGHT.'}[k]
    char(k, f'es_{k}_stand', pose, '3' if k == 'c1' else '4', other=other_sm(sc + '.'), note='손님 기준 자세')
for j in jobs: j['pass'] = 1

# ── 구두장이(22 + 둘째 프레임 2 + 얼굴) ────────
S = lambda pid, pose, sc, shape='sq', note='', ref=SM, **k: char('sm', pid, pose, sc, ref, shape=shape, note=note, **k)
S('es_sm_sigh', 'standing, holding ONE flat saddle-brown (#A0623A) leather sheet in both hands, looking DOWN at it, WORRIED (eyebrows tilted down, mouth a small downward curve). NOT crying.', '1', note='가죽 포함, 뒤집기 금지')
S('es_sm_cut', 'SITTING on a low stool (the stool is NOT drawn; he sits on nothing), bent over, cutting a saddle-brown leather piece with big stone-grey scissors held in his RIGHT hand, scissors blades OPEN, looking DOWN, CONCENTRATING (mouth pressed shut).', '1·3·5', note='가위 포함, 첫 프레임(벌림)')
frame_b('es_sm_cut', 'the scissors blades are now CLOSED (snipped shut).', '1·3·5')
S('es_sm_yawn', 'FRONT VIEW, standing, one hand covering a big yawn, the other arm stretching, SLEEPY (eyes half closed).', '1', note='정면')
S('es_sm_sleep', 'LYING ASLEEP on his back seen from the side, his HEAD at the LEFT end on a snow-white pillow, a teal (#2F7F7A) and paper-cream quilt covering him to the chest, one arm on top of the quilt, PEACEFUL face (eyes closed strips, small smile).', '1', shape='wide', note='머리 왼쪽, 돌려 세우지 않음')
S('es_sm_sit_ready', 'SITTING on an invisible stool, side view facing RIGHT, rolling up one shirt sleeve, ready to work, calm expression, looking RIGHT.', '2')
S('es_sm_surprised', 'FRONT VIEW, standing, both hands spread open, body leaning back, SURPRISED (eyes big round, mouth a round O, eyebrows high).', '2', note='정면')
S('es_sm_inspect', 'standing, three-quarter view, holding ONE finished chestnut-brown (#8B5A2B) shoe with cocoa sole and tiny paper-cream stitch dots up close to his eyes, looking DOWN at it, CURIOUS (one eyebrow raised).', '2', note='구두 포함')
S('es_sm_admire', 'FRONT VIEW, hugging a finished pair of chestnut-brown shoes to his chest with both arms, ADMIRING (eyes sparkling, big open smile).', '2', note='구두 포함')
S('es_sm_greet', 'standing, side view facing LEFT, one hand held out in welcome toward the left, BRIGHT smile, looking LEFT.', '3·4', note='문 쪽 손님')
S('es_sm_coins', 'standing, three-quarter view, holding out one open palm with three straw-gold (#D9A94E) gold coins on it, looking DOWN at them, HAPPY (mouth open in joy).', '3', note='금화 포함(수 세기 아님)')
S('es_sm_point_shelf', 'standing, side view facing RIGHT, one arm pointing UP to the upper right, head tilted, WONDERING (head tilt, eyebrows raised).', '4', note='짝 찾기 안내 자세')
S('es_sm_hold_pair', 'FRONT VIEW, holding up a matched pair of shoes, one shoe in each hand (one red shoe with a white ribbon in each hand: a left shoe and a right shoe), HAPPY smile.', '4', note='구두 포함(짝 찾기 정답 뒤 코드로 바꿔도 됨)')
S('es_sm_talk', 'standing, side view facing LEFT, one hand raised as he speaks, THOUGHTFUL curious eyes, mouth open talking, looking LEFT.', '5·9', note='아내 쪽')
S('es_sm_hide_peek', 'peeking out from behind hanging clothes at his LEFT: only his face (half of it) and one hand at the left side are visible; the rest of the body is cut off STRAIGHT and VERTICALLY where the hanging clothes would cover him (the clothes are NOT drawn). Looking LEFT, SURPRISED (eye big).', '6', note='옷걸이는 앞 가림 소품과 겹침')
S('es_sm_hide_peek_glad', 'EXACTLY the same peeking pose and crop as the reference peeking image; ONLY the face changes: MOVED and touched (eyes shining, a soft smile).', '10·11', ref='es_sm_hide_peek', extra_refs=(SM,), note='같은 자세 다른 표정(얼굴만 바뀜)')
S('es_sm_resolve', 'standing, side view facing LEFT, one fist raised in front of his chest saying "Yes, let\'s!", DETERMINED (eyebrows up, big smile), looking LEFT.', '7', note='아내 쪽')
S('es_sm_cut_small', 'SITTING on an invisible stool, bent over, cutting a SMALL saddle-brown leather piece with small scissors, looking DOWN, CONCENTRATING (tongue peeking out a little).', '8')
S('es_sm_hammer', 'SITTING on an invisible stool, three-quarter view, holding a tiny shoe on a small wooden shoe last on his lap with one hand and a small hammer (slate head, chestnut handle) RAISED UP in the other hand, looking DOWN, concentrating.', '8', note='망치 포함, 첫 프레임(올림)')
frame_b('es_sm_hammer', 'the hammer is now DOWN, striking the tiny shoe on the last.', '8')
S('es_sm_show_tiny', 'FRONT VIEW, holding up a TINY pair of cocoa shoes on his fingertips (very small, an elf\'s size), PROUD (smiling eyes).', '8')
S('es_sm_place_gift', 'standing, side view facing LEFT, bending at the waist, both hands reaching DOWN to the left as if gently placing something on a table (the hands are EMPTY), KIND expression, looking DOWN.', '9', note='놓는 선물은 코드')
S('es_sm_wave_side', 'standing, side view facing LEFT, one hand waving toward the left, BEAMING smile, looking LEFT.', '11', note='문은 왼쪽')
S('es_sm_wave', 'FRONT VIEW, standing, one hand waving high, BEAMING smile, looking at the viewer.', '12', note='인사 톡 뒤')
face('es_sm_face', SM, 'sm')

# ── 아내(17 + 둘째 프레임 2 + 얼굴) ────────────
W = lambda pid, pose, sc, shape='sq', note='', ref=WF, **k: char('wf', pid, pose, sc, ref, shape=shape, note=note, **k)
W('es_wf_worry', 'standing, side view facing RIGHT, both hands clasped together, WORRIED (eyebrows tilted down), looking RIGHT.', '1')
W('es_wf_sleep', 'LYING ASLEEP on her back seen from the side, her HEAD at the LEFT end on a snow-white pillow, a teal and paper-cream quilt covering her to the chest, PEACEFUL face (eyes closed), headscarf on.', '1', shape='wide', note='머리 왼쪽')
W('es_wf_surprised', 'FRONT VIEW, standing, one hand over her mouth, SURPRISED (eyes big round, eyebrows high).', '2')
W('es_wf_clap', 'FRONT VIEW, standing, both hands held APART ready to clap, HAPPY big smile.', '3·4', note='첫 프레임(벌림)')
frame_b('es_wf_clap', 'both hands are now TOGETHER in a clap in front of her chest.', '3·4')
W('es_wf_suggest', 'standing, side view facing RIGHT, one hand raised with a finger up as she suggests an idea, PLAYFUL (one eye winking), looking RIGHT.', '5')
W('es_wf_light_candle', 'standing, side view facing RIGHT, bending a little, holding a long paper-cream match with a tiny ember-amber (#F2B366) flame toward the lower right, looking DOWN to the right, CONCENTRATING.', '5·9', note='성냥 포함')
W('es_wf_shh', 'standing, side view facing LEFT, one finger on her lips "shh", a PLAYFUL smile, looking LEFT.', '5·6', note='남편에게')
W('es_wf_hide_peek', 'peeking out from behind hanging clothes at her LEFT: only half of her face and the headscarf are visible at the left; the rest of the body is cut off STRAIGHT and VERTICALLY where the hanging clothes would cover her (the clothes are NOT drawn). Looking LEFT, SURPRISED (eye big).', '6')
W('es_wf_hide_peek_glad', 'EXACTLY the same peeking pose and crop as the reference peeking image; ONLY the face changes: MOVED and touched (eyes shining, a soft smile).', '10·11', ref='es_wf_hide_peek', extra_refs=(WF,), note='같은 자세 다른 표정')
W('es_wf_explain', 'standing, side view facing RIGHT, both arms open as she explains, KIND but FIRM expression, mouth open talking, looking RIGHT.', '7', note='남편 쪽')
W('es_wf_hold_cloth', 'FRONT VIEW, holding a folded roll of holly-red (#C8303A) cloth against her chest with both arms, HAPPY.', '7')
W('es_wf_sew', 'SITTING on an invisible stool, three-quarter view, sewing a small snow-white cloth on her lap, her needle hand RAISED UP pulling a sunny-yellow thread, looking DOWN, concentrating.', '8', note='바늘·실 포함, 첫 프레임(들기)')
frame_b('es_wf_sew', 'the needle hand is now DOWN close to the cloth, pushing the needle in.', '8')
W('es_wf_knit', 'SITTING on an invisible stool, three-quarter view, knitting with two brass (#B8893A) knitting needles and a leaf-green yarn ball on her lap, CONTENT (eyes closed in a smile, humming).', '8')
W('es_wf_hold_shirt', 'FRONT VIEW, holding up a TINY snow-white shirt (an elf\'s size) spread out between both hands, HAPPY.', '8', note='크기 고르기 정답 뒤')
W('es_wf_place_gift', 'standing, side view facing LEFT, bending, both hands reaching DOWN to the left as if laying things neatly on a table (the hands are EMPTY), KIND expression, looking DOWN.', '9')
W('es_wf_wave_side', 'standing, side view facing LEFT, one hand waving toward the left, BEAMING smile, looking LEFT.', '11')
W('es_wf_wave', 'FRONT VIEW, standing, one hand waving high, BEAMING smile.', '12')
face('es_wf_face', WF, 'wf')

# ── 요정 A·B(각 17 + 둘째 프레임 2 + 얼굴) ─────
ELF = [  # (뒷이름, 자세, 장면, 옷, 모양, 참고 기준, 비고)
 ('run', 'RUNNING to the RIGHT, arms swung back, one foot off the ground, EXCITED (mouth open, laughing).', '6·10', 'rag', 'sq', None, '뒤집어 왼쪽 가능'),
 ('hop_table', 'in mid-air hopping UP to the RIGHT, knees bent, arms up, EXCITED.', '6', 'rag', 'sq', None, ''),
 ('sit_sew', 'SITTING cross-legged, three-quarter view, sewing a saddle-brown leather shoe piece on his lap with a needle, the needle hand RAISED HIGH pulling a paper-cream thread, looking DOWN, concentrating (tongue peeking out).', '6', 'rag', 'sq', None, '바늘·실 포함, 첫 프레임'),
 ('sit_hammer', 'SITTING cross-legged, three-quarter view, holding a tiny hammer (slate head, chestnut handle) RAISED over a shoe on his lap, looking DOWN, concentrating (eyebrows knitted).', '6', 'rag', 'sq', None, '망치 포함, 첫 프레임'),
 ('hold_shoe_up', 'standing, holding ONE finished chestnut-brown grown-up shoe UP over his head with both hands (the shoe is big for him: about as long as his body is wide), SATISFIED big smile, looking UP.', '6', 'rag', 'sq', None, '구두 포함'),
 ('stand_puzzled', 'standing, scratching his head with one hand, PUZZLED (mouth pushed to one side), looking DOWN.', '10', 'rag', 'sq', None, '"가죽이 없네?"'),
 ('look_side', None, '10', 'rag', 'sq', None, 'A 오른쪽, B 왼쪽(마주 봄)'),
 ('surprised', 'FRONT VIEW, both hands over his mouth, SURPRISED (eyes big round).', '10', 'rag', 'sq', None, '정면'),
 ('joy_jump', 'FRONT VIEW, jumping up with both arms raised high, OVERJOYED (eyes closed in a laughing smile).', '10', 'rag', 'sq', None, '감정 고르기 정답 뒤'),
 ('dress', None, '10', 'rag', 'sq', None, '누더기 그대로 새 옷 들어 올림. 코드: 반짝 한 번 뒤 dressed_stand 로 교체'),
 ('dressed_stand', 'standing in three-quarter SIDE VIEW FACING RIGHT, chin up, PROUD of his new clothes, looking RIGHT.', '10·11', 'new', 'sq', None, '새 옷 기준(머리 폭 = _stand)'),
 ('dressed_smooth', 'standing, holding both front edges of his new waistcoat and smoothing it down, CONTENT smile, looking DOWN at his clothes.', '10', 'new', 'sq', 'dressed', ''),
 ('dressed_sing', 'FRONT VIEW, both arms spread wide, singing with his mouth wide open, EXCITED.', '10', 'new', 'sq', 'dressed', '노래 구절'),
 ('dressed_dance', 'FRONT VIEW, dancing with one foot lifted and both arms out, EXCITED (one eye winking).', '11', 'new', 'sq', 'dressed', ''),
 ('dressed_jump_chair', 'in mid-air leaping to the RIGHT with legs spread wide as if jumping over a chair (the chair is NOT drawn), PLAYFUL grin.', '11', 'new', 'wide', 'dressed', '의자 소품 위를 지남'),
 ('dressed_run_out', 'RUNNING to the LEFT (body facing left) while turning his head back to look RIGHT over his shoulder, one hand waving back, BEAMING smile.', '11', 'new', 'sq', 'dressed', '몸 왼쪽, 얼굴 오른쪽. 뒤집기 금지'),
 ('dressed_wave_back', 'standing, turned to face RIGHT, waving with BOTH hands, BEAMING smile, looking RIGHT.', '11', 'new', 'sq', 'dressed', '마지막 모습'),
]
LOOK = {'ea': 'standing, body turned to the RIGHT toward his friend, pointing to the RIGHT with one finger, SURPRISED (eyes big), looking RIGHT.',
        'eb': 'standing, body turned to the LEFT toward her friend, pointing to the LEFT with one finger, SURPRISED (eyes big), looking LEFT.'}
DRESS = {  # 2026-11-27: 갈아입는 순간은 그리지 않음(검열·속옷 차림). 누더기를 그대로 입고 새 옷을 앞에 들어 올림. 앱은 반짝 한 번 뒤 dressed_stand 로 교체
 'ea': 'standing, three-quarter view, STILL WEARING his old grey tunic-dress, holding his NEW clothes UP in front of him with both hands to show them (a folded holly-red (#C8303A) little coat on top of a sunny-yellow (#F2C94E) waistcoat and cobalt-blue (#3A6FD8) trousers, held flat like a small bundle in front of his chest), OVERJOYED big smile, looking at the new clothes.',
 'eb': 'standing, three-quarter view, STILL WEARING her old grey dress, holding her NEW clothes UP in front of her with both hands to show them (a folded leaf-green (#6FB94A) little coat on top of a cherry-red (#E04B3C) waistcoat and a slate-blue (#6C739A) skirt, held flat like a small bundle in front of her chest), OVERJOYED big smile, looking at the new clothes.',
}
FRAME2 = {'sit_sew': 'the needle hand is now DOWN close to the shoe, pushing the needle in.', 'sit_hammer': 'the hammer is now DOWN, striking the shoe.'}
for who, base in (('ea', EA), ('eb', EB)):
    for suf, pose, sc, outfit, shape, rb, note in ELF:
        pid = f'es_{who}_{suf}'
        ref = base if rb is None else f'es_{who}_dressed_stand'
        if suf == 'dress': pose = DRESS[who]
        char(who, pid, pose or LOOK[who], sc, ref, shape=shape, outfit=outfit, note=note, extra_refs=(base,) if rb else ())
        if suf in FRAME2: frame_b(pid, FRAME2[suf], sc, outfit='rag')
    face(f'es_{who}_face', base, who, outfit='rag')

# ── 손님 ─────────────────────────────────
for k, items in {
 'c1': [('admire', 'standing, three-quarter view, holding ONE chestnut-brown shoe up close to his eyes, ADMIRING (eyes sparkling), looking DOWN at it.'),
        ('pay', 'standing, side view facing RIGHT, holding out a saddle-brown coin pouch toward the right, HAPPY.'),
        ('leave', 'turning away to walk LEFT, hugging a kraft shoe box tied with a bean-red string, SATISFIED smile, looking LEFT.')],
 'c2': [('admire', 'standing, three-quarter view, holding up ONE shoe and admiring it, ADMIRING, looking DOWN at it.'),
        ('pay', 'standing, side view facing RIGHT, holding out one straw-gold coin toward the right, HAPPY.')],
 'c3': [('admire', 'standing, three-quarter view, holding ONE shoe up and nodding, ADMIRING (beard lifting with his smile), looking DOWN at it; the walking stick in his other hand.'),
        ('pay', 'standing, side view facing RIGHT, holding out one straw-gold coin toward the right, HAPPY; the walking stick in his other hand.')],
}.items():
    for suf, pose in items: char(k, f'es_{k}_{suf}', pose, '3' if k == 'c1' else '4', f'es_{k}_stand')
for k in ('c1', 'c2', 'c3'): face(f'es_{k}_face', f'es_{k}_stand', k)

# ── 소품(얼굴 없음) ──────────────────────────
prop('es_prop_table', 'a long wooden shoemaker\'s WORK TABLE seen from the front: a chestnut (#8B5A2B) top board with a cocoa (#4E3524) front edge and four sturdy legs, EMPTY top.', '전 장면', shape='wide', note='높이 0.6, 길이 1.6')
prop('es_prop_stool', 'a small round wooden STOOL with three legs, chestnut (#8B5A2B) seat, cocoa legs, seen from the side.', '1·2·3·5·8', ref='es_prop_table')
prop('es_prop_chair', 'a wooden CHAIR with a straight back, seen from the side, chestnut (#8B5A2B) with cocoa rails.', '11', ref='es_prop_table')
prop('es_prop_bench', 'a long low wooden BENCH seen from the front, cocoa (#4E3524) top and four legs.', '11', shape='wide', ref='es_prop_table')
prop('es_prop_bed', 'a simple wooden double BED frame seen from the side (head end at the LEFT) with two snow-white pillows on the left end, NO quilt, NO people.', '1', shape='wide', note='이불은 따로')
prop('es_prop_blanket', 'a wide flat QUILT lying straight as seen from the side (a long low shape), teal (#2F7F7A) with a paper-cream (#F6ECD8) border band.', '1', shape='wide', ref='es_prop_bed', note='인물 앞에 겹침')
prop('es_prop_leather_sheet', 'ONE flat sheet of saddle-brown (#A0623A) LEATHER with slightly irregular rounded edges, lying flat seen from above.', '1', note='누르는 대상 아님')
prop('es_prop_leather_cut_1', 'leather pieces cut out for ONE pair of shoes: two saddle-brown (#A0623A) shoe-upper shapes and two cocoa sole shapes, laid neatly side by side.', '1·6', shape='wide', ref='es_prop_leather_sheet')
prop('es_prop_leather_cut_many', 'a neat stack of many cut saddle-brown and chestnut leather shoe pieces for several pairs, piled in two small stacks.', '3·4·5', shape='wide', ref='es_prop_leather_sheet')
prop('es_prop_leather_small', 'a few SMALL saddle-brown leather pieces cut for a TINY pair of shoes (an elf\'s size).', '8', ref='es_prop_leather_sheet')
prop('es_prop_shoe_brown', 'ONE finished grown-up SHOE (a RIGHT shoe, toe pointing to the RIGHT) seen from the side: chestnut (#8B5A2B) leather, cocoa (#4E3524) sole, a row of tiny paper-cream stitch dots, perfectly made.', '2·3·6·7', note='0.22. 왼발은 뒤집음')
prop('es_prop_pair_brown', 'a finished PAIR of grown-up chestnut-brown shoes standing neatly side by side, seen from the side, cocoa soles and tiny paper-cream stitch dots.', '2·6·7·컷', shape='wide', ref='es_prop_shoe_brown')
for k, d in [('red', 'cherry-red (#E04B3C) leather with a small snow-white ribbon bow'), ('blue', 'cobalt-blue (#3A6FD8) leather with one round straw-gold button'),
             ('green', 'pine-green (#3F6B4F) leather with paper-cream laces'), ('boot', 'chestnut (#8B5A2B) leather, a short ankle BOOT')]:
    prop(f'es_prop_shoe_{k}', f'ONE grown-up shoe (a RIGHT shoe, toe to the RIGHT) seen from the side: {d}, cocoa sole.', '4·12', ref='es_prop_shoe_brown', note='짝 찾기 선택지(같은 크기)')
prop('es_prop_shelf', 'a wooden SHOE SHELF with three shelves, seen from the front, chestnut (#8B5A2B) boards with cocoa sides, all shelves EMPTY.', '4·12', note='세로 좌표 따로')
prop('es_prop_shoe_box', 'a kraft (#C9A574) cardboard SHOE BOX with its lid on, tied with a bean-red (#A93B32) string bow.', '3')
prop('es_prop_coin_pouch', 'a small round saddle-brown (#A0623A) leather COIN POUCH tied at the top with a straw-gold string.', '3·4')
prop('es_prop_coins', 'three round straw-gold (#D9A94E) GOLD COINS lying in a small loose group.', '3', note='장식, 수 세기 아님')
prop('es_prop_candle_off', 'one UNLIT paper-cream (#F6ECD8) candle in a brass (#B8893A) candlestick with a round dish and a ring handle; a tiny cocoa wick, NO flame.', '1·5·9·12', note='톡 대상(누르기 판은 코드)')
prop('es_prop_candle_on', 'the SAME candle and brass candlestick as the reference, now LIT: a flame made of a pearl-cream (#FBF3D5) inner piece and an ember-amber (#F2B366) outer piece (flat paper pieces, no glow drawn).', '1·5·6·9·10·11', ref='es_prop_candle_off', note='빛 층은 코드')
prop('es_prop_match', 'one long paper-cream wooden MATCH with a tiny ember-amber flame at its tip.', '5·9', shape='wide')
for k, t in [('9', 'NINE o\'clock'), ('12', 'TWELVE o\'clock (both hands pointing straight up)'), ('day', 'TEN o\'clock')]:
    prop(f'es_prop_clock_{k}', f'a round wooden WALL CLOCK: a chestnut frame, a paper-cream face with twelve small cocoa dot marks (NO numbers), cocoa hands showing {t}.', {'9': '1·5·9', '12': '6·10·11', 'day': '2·3·4·7·8·12'}[k],
         ref=None if k == '9' else 'es_prop_clock_9', note='시계 0.35')
prop('es_prop_hammer', 'a small shoemaker\'s HAMMER lying sideways: a slate (#5A554E) head and a chestnut (#8B5A2B) handle.', '8', shape='wide', note='톡 대상(누르기 판은 코드)')
prop('es_prop_needle_thread', 'a stone-grey sewing NEEDLE with a paper-cream thread trailing from it, next to a small round sunny-yellow (#F2C94E) thread ball.', '6·7·8', shape='wide')
prop('es_prop_knitting', 'two brass (#B8893A) KNITTING needles crossed in a small leaf-green (#6FB94A) yarn ball with a short knitted strip.', '7·8')
prop('es_prop_scissors', 'big stone-grey shoemaker\'s SCISSORS with cocoa round handles, lying flat, blades slightly open (matte, no shine).', '1·3·5', shape='wide')
prop('es_prop_shoe_last', 'a wooden SHOE LAST (a foot-shaped chestnut wooden form) for a grown-up shoe, seen from the side, toe to the right.', '8', shape='wide')
prop('es_prop_shoe_last_small', 'a SMALL wooden shoe last (an elf\'s foot size, 0.4 of a grown-up last), seen from the side.', '8', ref='es_prop_shoe_last')
prop('es_prop_cloth_white', 'a folded roll of snow-white (#F4F6FA) CLOTH (fabric bolt) seen from the side.', '7', shape='wide')
prop('es_prop_cloth_red', 'a folded roll of holly-red (#C8303A) cloth, the same size as the reference.', '7', shape='wide', ref='es_prop_cloth_white')
for k, sz in [('l', 'LARGE (a grown-up size)'), ('m', 'MEDIUM (a child size)'), ('s', 'SMALL (a tiny elf size)')]:
    prop(f'es_prop_shirt_{k}', f'one plain snow-white (#F4F6FA) SHIRT laid flat seen from the front, {sz}.', '8', ref=None if k == 'l' else 'es_prop_shirt_l', note={'l': '0.55', 'm': '0.38', 's': '0.22'}[k] + ' — 크기만 다름, 코드에서 비율대로')
for k, sz in [('l', 'LARGE'), ('m', 'MEDIUM'), ('s', 'SMALL (tiny elf size)')]:
    prop(f'es_prop_sock_{k}', f'one knitted SOCK laid flat seen from the side, leaf-green (#6FB94A) with snow-white stripes, {sz}.', '8', ref=None if k == 'l' else 'es_prop_sock_l', note={'l': '0.35', 'm': '0.24', 's': '0.12'}[k])
for pid, d in [('es_prop_coat_red', 'a TINY holly-red (#C8303A) little COAT laid flat seen from the front'), ('es_prop_coat_green', 'a TINY leaf-green (#6FB94A) little COAT laid flat seen from the front'),
               ('es_prop_vest_yellow', 'a TINY sunny-yellow (#F2C94E) WAISTCOAT laid flat'), ('es_prop_vest_red', 'a TINY cherry-red (#E04B3C) WAISTCOAT laid flat'),
               ('es_prop_trousers_blue', 'a TINY pair of cobalt-blue (#3A6FD8) TROUSERS laid flat'), ('es_prop_trousers_slate', 'a TINY slate-blue (#6C739A) knee-length SKIRT laid flat (a little girl elf\'s skirt, NOT trousers)')]:
    prop(pid, d + ' (an elf\'s size, as small as the small shirt).', '8·9', ref='es_prop_shirt_s', note='선물 세트는 이 옷 소품을 코드로 배치(판단 12)' + (', id 는 그대로 두고 그림은 요정 B 치마(2026-11-27)' if pid == 'es_prop_trousers_slate' else ''))
prop('es_prop_tiny_pair', 'a TINY pair of little cocoa (#4E3524) shoes standing side by side (an elf\'s size, 0.4 of a grown-up shoe).', '8·9', ref='es_prop_shoe_brown')
prop('es_prop_rags', 'TWO old worn-out dust-grey (#C6BFB4) RAGS (one tattered tiny tunic and one tattered tiny rag dress) lying crumpled on the floor side by side.', '10·11', shape='wide')
CARD = 'a portrait paper-cream (#F6ECD8) card with rounded corners and NO border line, NO letters; on it a simple drawn face of ELF A (round face, short straw-gold hair, human ears) '
prop('es_prop_face_happy', CARD + 'SMILING BIG and happily (eyes closed in laughing arcs, open smile).', '10', ref='es_ea_stand', note='배움 카드(그림 속 얼굴)')
prop('es_prop_face_sad', CARD + 'CRYING sadly (eyebrows tilted down, mouth turned down, one sky-paper #A9D3F0 tear drop).', '10', ref=['es_prop_face_happy', 'es_ea_stand'], note='배움 카드')
for pid in ('es_prop_face_happy', 'es_prop_face_sad'):
    jj = next(j for j in jobs if j['id'] == pid)
    jj['prompt'] = jj['prompt'].replace('NO face, NO eyes, NO mouth anywhere on it.', 'The card shows a drawn elf face (a picture on a card); the card itself has no face.').replace(
        'Draw it in the SAME paper style and at the same scale as the attached reference object.', 'The reference images show elf A (and the first card): draw the CARD, with the elf face picture inside it; do NOT draw the elf\'s body.')
prop('es_prop_door_open', 'an OPEN wooden DOOR seen from the front inside the room: a cocoa (#4E3524) door frame, the cocoa plank door swung open to the LEFT, and through the doorway a snowy NIGHT outside: midnight-navy (#141B3D) sky, a moon-cream (#FBF3D5) moon, snow-white snow, and a tiny far house window glowing ember amber.', '6·10·11', note='밤판')
prop('es_prop_door_day', 'the SAME open door as the reference, but through the doorway a snowy DAY street: sky-paper (#A9D3F0) sky, snow-white and ice-blue (#DCEBF5) snow, the tip of a fir-dark (#2F4F3C) fir tree.', '3', ref='es_prop_door_open', note='3장 낮판(기획 "낮판 따로 `_day`")')
prop('es_prop_wreath', 'a round Christmas DOOR WREATH of fir-dark (#2F4F3C) fir sprigs with a holly-red (#C8303A) ribbon bow at the bottom and three small round straw-gold bells.', '5·9·12')
prop('es_prop_fir_branch', 'a fir BRANCH for a window sill lying sideways: fir-dark (#2F4F3C) needles, two cocoa pine cones and a few holly-red berries.', '5·9·12', shape='wide')
prop('es_prop_sparkle', 'four small flat straw-gold (#D9A94E) and honey (#F6D27A) STAR sparkle pieces scattered loosely.', '10', note='작게')
prop('es_prop_footprints', 'two little rows of TINY footprints in snow seen from slightly above, side by side, wandering off to the right: each print a small ice-blue (#DCEBF5) oval dent on a flat snow-white (#F4F6FA) strip of snow.', '12', shape='wide', note='창밖 눈 위 요정 발자국(판단 16)')
# 앞 가림
prop('es_fg_coat_rack', 'a tall wooden COAT RACK standing upright with TWO long coats hanging from it (one slate #5A554E, one bean red #A93B32), with a narrow gap between the two coats (someone can peek through).', '5·6·9·10·11', note='숨는 곳(앞 가림)')
prop('es_fg_lasts_hanging', 'a string hanging from the top with THREE wooden shoe lasts (chestnut foot-shaped forms) dangling from it, for the upper-left corner of a picture.', '1~11', shape='wide', note='왼쪽 위 앞 가림')
prop('es_fg_fir_garland', 'a long horizontal fir GARLAND hanging from the top edge: fir-dark and pine-green sprigs with holly-red ribbons and a few straw-gold bells.', '12', shape='wide', note='위쪽 앞 가림')

# ── 배경(16:9): 구둣방 한 방, 시간대별 ───────────
COMMON = ('Characters, the table, the stool, the shelf, the candle, shoes, the coat rack and pressable items are separate sprites added later. NO people, NO elves, NO animals.')
ROOM = ('LAYOUT (keep this EXACT layout in every version): a small shoemaker\'s workshop seen at eye level, wide. A wooden DOOR on the LEFT wall (x 2-16%, y 30-82%); a WINDOW high on the back wall (x 26-44%, y 12-42%); '
        'an EMPTY back-wall spot for a round clock (x 60-68%, y 10-22%) left plain; an EMPTY back-wall area for a shoe shelf at the right (x 72-90%, y 22-70%) left plain; the right end of the room (x 86-100%) plain wall. '
        'The back wall is warm sand (#E9DCC0) on top with a bark-brown (#6B4A32) wainscot board band below (y 62-78%); the floor is kraft (#C9A574) planks with taupe (#8C7461) gaps from y 78% down. '
        'The CENTRE (x 30-80%, y 50-100%) stays PLAIN (the work table and characters are placed there later). Richness only at the edges: wall hooks with a few hanging tools, a small framed paper picture, plank details.')
def bg(pid, scene, papers, light, ref=None, note='', pas=4, night=False):
    p = (BG_HEAD + 'SCENE:\n' + TALE + '\n' + (NIGHT + '\n' if night else '') + scene + ' ' + COMMON + ' SCENE PAPERS: ' + papers + '\n' + ROOM + '\n' + BG_RICH +
         '\nFRAME:\nNo decorative border. The scene fills the entire frame edge to edge.\n\n' + light)
    if ref: p = p.replace('SCENE:\n', 'SCENE:\nThe SAME workshop as the reference image: keep the walls, door, window, empty spots and floor EXACTLY in the same places; change only the time of day, colours and light as described.\n', 1)
    J(id=pid, kind='bg', **{'pass': pas}, refs=[RAW + f'{ref}.png'] if ref else [], size=[1600, 902], out=RAW + f'{pid}.png', note=note, prompt=p)
BASE_P = 'wall warm sand #E9DCC0, paper cream #F6ECD8, wainscot bark brown #6B4A32, floor kraft #C9A574 and taupe #8C7461, door cocoa #4E3524, window frame paper cream'
bg('es_bg_shop_evening', 'Scenes 1, 5 and 9: EVENING in the workshop. Light: set B — the candle on the table (placed later at the right of the centre) is the light; all cast shadows fall to the LOWER LEFT. Through the window: a deep indigo (#1F2A56) evening sky with falling snow and two rows of snowy far rooftops (slate blue #6C739A, dusk indigo #4A5280) with snow-white snow caps.',
   BASE_P + ', window sky deep indigo #1F2A56, far roofs slate blue #6C739A and dusk indigo #4A5280, snow snow white #F4F6FA.', LIGHT_B, note='1·5·9장 저녁(기준 배경, pass 4)', night=True)
bg('es_bg_shop_morning', 'Scenes 2 and 7: MORNING. Light: set A — sunlight from the window at the upper LEFT; all cast shadows fall to the LOWER RIGHT. Through the window: an ice-blue (#DCEBF5) and sky-paper (#A9D3F0) morning sky over snowy snow-white rooftops; a soft slanted beam of honey (#F6D27A) SUNLIGHT falls from the window down toward the lower right (a light layer that fades with distance — light gradient allowed ONLY for this sunbeam; paper pieces stay one flat colour).',
   BASE_P + ', window sky ice blue #DCEBF5 and sky paper #A9D3F0, snow snow white #F4F6FA, sunbeam honey #F6D27A.', LIGHT_A, ref='es_bg_shop_evening', note='2·7장 아침(pass 4, ← evening)')
bg('es_bg_shop_day', 'Scenes 3, 4 and 8: bright DAYTIME. Light: set A — daylight from the window at the upper LEFT; all cast shadows fall to the LOWER RIGHT. Through the window: a sky-paper (#A9D3F0) sky, snowy rooftops and the tip of a far fir-dark (#2F4F3C) fir tree.',
   BASE_P + ', window sky paper #A9D3F0, snow white #F4F6FA, ice blue #DCEBF5, fir dark #2F4F3C.', LIGHT_A, ref='es_bg_shop_evening', note='3·4·8장 낮(pass 4, ← evening)')
bg('es_bg_shop_night_lb', 'Scene 6 LIGHT-BOX version: MIDNIGHT, lit like a paper light box by ONE candle that will stand on the table in the centre: the walls one step darker, dusk brown (#3B2A20), the floor cocoa (#4E3524); through the window a midnight-navy (#141B3D) sky with a moon-cream (#FBF3D5) moon piece and mist-blue (#D9E4EE) snowy rooftops. '
   'In the CENTRE above the table area a soft warm glow of candle light spreads across the back wall and the floor (pearl cream #FBF3D5 at the centre, then honey #F6D27A, then ember amber #F2B366 rings, fading with distance — light gradient allowed ONLY for this candle glow, it must spread over the wall and floor, NOT be a floating disc). '
   'The far edges are darker; the door at the left and the right end of the room are almost in shadow (dark but readable shapes). Light: set B; shadows fall to the LOWER LEFT. The moonlight is cream, never orange; the amber stays only inside the candle glow.',
   'dusk brown #3B2A20, cocoa #4E3524, midnight navy #141B3D, moon cream #FBF3D5, mist blue #D9E4EE, pearl cream #FBF3D5, honey #F6D27A, ember amber #F2B366, persimmon #E8703A (glow edge), ink #2E241C.', LIGHT_B, ref='es_bg_shop_evening', note='6장 라이트박스(검수용, 판단 5)', night=True)
bg('es_bg_shop_night', 'Scenes 10 and 11: an ordinary MIDNIGHT (the candle light is added later by code): the walls umber (#5A4433), the floor cocoa, through the window a midnight-navy (#141B3D) sky with a small moon-cream moon and mist-blue snowy rooftops. Light: set B; shadows fall to the LOWER LEFT.',
   'umber #5A4433, cocoa #4E3524, bark brown #6B4A32, midnight navy #141B3D, moon cream #FBF3D5, mist blue #D9E4EE, snow white #F4F6FA.', LIGHT_B, ref='es_bg_shop_evening', note='10·11장 보통 밤(6장 대체 가능)', night=True)
bg('es_bg_shop_xmas', 'Scene 12: CHRISTMAS MORNING. Light: set A — morning light from the window at the upper LEFT; shadows fall to the LOWER RIGHT. Through the window: a peach (#F7C59F) and apricot (#F4A261) sunrise sky over snow-white snowy rooftops; a soft honey light layer just inside the window. '
   'Festive: a fir-dark (#2F4F3C) fir garland with holly-red (#C8303A) ribbons along the top of the back wall, a straw-gold (#D9A94E) ribbon on the window frame.',
   BASE_P + ', peach #F7C59F, apricot #F4A261, honey #F6D27A, fir dark #2F4F3C, holly red #C8303A, straw gold #D9A94E, snow white #F4F6FA.', LIGHT_A, ref='es_bg_shop_morning', note='12장 크리스마스 아침(pass 4, ← morning)')
# 뒷표지
J(id='es_bg_back', kind='bg', **{'pass': 6}, refs=[], size=[1600, 902], out=RAW + 'es_bg_back.png', note='뒷표지(미리보기에 쓰지 않음). 기획 §9-3 "뒷표지 실루엣"',
  prompt=BG_HEAD + 'SCENE:\nBACK COVER (the ending page): one flat sheet of kraft paper #EBDFC8 with fine grain; on it, low in the middle, two tiny dancing ELF SILHOUETTES, a boy and a girl (the girl with two little pigtails and a skirt; arms up, one leg lifted, human ears, no pointed hats) and a tiny pair of shoes beside them, '
         'cut from slightly darker kraft #C9A574 paper, and a few tiny snow-white star dots above. Very simple and calm, lots of empty kraft paper (text is placed there later). Only 2 flat layers. Nothing else.\n\nFRAME:\nNo decorative border. The scene fills the entire frame edge to edge.\n\n' + LIGHT_A)

# ── 컷(4:3) ─────────────────────────────────
FC = FACE + ' Elves have HUMAN ears (round), NO pointed hats.'
def cut(pid, moment, panel, refs, scene, light):
    p = (CUT_HEAD + 'MOMENT:\nOne picture-book moment filling the ENTIRE image edge to edge (full-bleed, no border), kid-friendly, gentle and warm. ' + moment +
         ' Every character keeps exactly the head size, body proportions, colours and clothes of its reference sprite; only the pose and expression change. Size relation: an elf is only 0.42 of the shoemaker\'s height. '
         'Objects, props, shoes and backgrounds have NO face. ' + TALE + ' ' + NIGHT +
         '\n\nPANEL BACKGROUND:\n' + panel + ' — every piece one flat solid colour, no gradient (except a soft light glow where the moment says so).\n\n' + FC +
         '\n\nIf reference images are attached, they show the characters: match their shapes, colours, clothes and markings exactly.\n\nFRAME:\nNo border, no speech bubbles, no panel lines, no letters; fills the frame edge to edge. The panel background is the scene itself — NEVER a plain magenta or chroma-key background.\n\n' + light)
    J(id=pid, kind='cut', **{'pass': 5}, refs=[RAW + f'{r}.png' for r in refs], size=[1600, 1200], aspect='landscape 4:3', out=RAW + f'{pid}.png', note=scene, prompt=p)
cut('es_cut_morning_pair', 'Morning sunlight slants in from a window at the upper left onto a wooden work table; on the table a finished pair of chestnut-brown shoes stands neatly side by side, tiny cream stitch dots showing perfect work. Behind the table ONE shoemaker spreads both hands, surprised, looking DOWN at the shoes; in the doorway behind, ONE wife puts a hand over her mouth, looking at her husband. Exactly two people, no elves.',
    'warm sand wall, kraft floor, chestnut table, a honey sunbeam (soft light layer) from the upper left', ['es_sm_surprised', 'es_wf_surprised', 'es_prop_pair_brown'], '2장', LIGHT_A)
cut('es_cut_elves_work', 'At midnight ONE candle lights a work table in the middle (a soft warm glow spreading over the table and the wall, not a floating disc); ' + ELVES2 + ', in dust-grey rags sit face to face on the table: one holds a needle high, the other brings a little hammer down on a shoe. Around them it is dark; at the right edge, behind hanging coats, the shoemaker and his wife peek with only their eyes and the tops of their faces showing (four eyes), looking LEFT at the elves. Exactly two elves.',
    'dusk brown #3B2A20 wall, cocoa table edge, pearl cream, honey and ember amber candle glow, dark ink #2E241C coat silhouettes at the right', ['es_ea_sit_sew', 'es_eb_sit_hammer', 'es_sm_hide_peek', 'es_wf_hide_peek'], '6장', LIGHT_B)
cut('es_cut_elves_dressed', 'On the work table, ' + ELVES2 + ', in their NEW clothes (boy elf A: white shirt, holly-red coat, yellow waistcoat, blue trousers; girl elf B: white blouse, green coat, red waistcoat, slate-blue skirt; both striped socks, little cocoa shoes) spread their arms and sing with joy, looking UP; at their feet the two old grey rags lie crumpled; around them a few floating thread bits and small straw-gold star sparkle pieces. Exactly two elves, no people.',
    'umber #5A4433 night wall, chestnut table, a warm candle glow behind them (soft light layer)', ['es_ea_dressed_sing', 'es_eb_dressed_sing', 'es_prop_rags'], '10장 끝', LIGHT_B)
cut('es_cut_dance_out', 'Seen from inside the workshop through the open door: outside, a snowy midnight-navy night with a cream moon; ' + ELVES2 + ', in new clothes skip away along the snowy path toward the upper right, small and seen from behind, arms up, one leg lifted (both the same size); inside the doorway at the lower front, the shoemaker and his wife stand shoulder to shoulder, seen from BEHIND, waving. Exactly two elves and two people.',
    'cocoa door frame, midnight navy #141B3D sky, moon cream #FBF3D5 moon, snow white path, a far house window glowing ember amber', ['es_ea_dressed_dance', 'es_eb_dressed_dance', 'es_sm_wave_side', 'es_wf_wave_side'], '11장 끝', LIGHT_B)

# ── 표지·썸네일 ─────────────────────────────
def key(pid, frame, scene, refs, out, aspect, light_b=False):
    p = KEY_HEAD + frame + '\n\nSCENE INSIDE THE WINDOW:\n' + TALE + ' ' + NIGHT + '\n' + scene + '\n\n' + FC + '\n\nMatch the characters in the reference images exactly (same shapes, colours, clothes, markings).\n\n' + (set_b(KEY_TAIL_A) if light_b else KEY_TAIL_A)
    if 'WINDOW' not in frame: p = p.replace('SCENE INSIDE THE WINDOW:', 'SCENE:')
    J(id=pid, kind='key', **{'pass': 6}, refs=[RAW + f'{r}.png' for r in refs], out=out, aspect=aspect, prompt=p)
WIN = ('FRAME (most important):\nThe whole {asp} canvas is ONE flat sheet of warm cream cardstock (#f5efe9) with fine paper grain. A large window is cut out of it in the shape of a '
       'SHOE seen from the side (a rounded toe at the right, a low heel at the left, a flat bottom). It is centred horizontally, {pos}. The scene is seen THROUGH this window, built from 3 or 4 layered paper depth planes behind the sheet; '
       'the window edge shows the sheet thickness with a soft inner shadow along the top and inner edges and a light cut edge at the bottom. {rest} '
       'Around the rim, two small flat paper fir sprigs with red berries overlap the edge at the upper-left and upper-right. Nothing else on the cream sheet.')
key('es_key_land', WIN.format(asp='wide 16:9', pos='its flat bottom at about 78% of the height and its height about 70% of the canvas HEIGHT, its width about 1.8 times its height',
                              rest='The lower 22% of the canvas below the window and both side areas are plain empty cream paper (a title is placed there later).'),
    'At midnight a single candle glows on the work table; ' + ELVES2 + ', in grey rags sew and hammer a shoe on the table, BIG and clear; at the right, behind hanging coats, the shoemaker and his wife peek. Rich colours only at the edges and far back.',
    ['es_ea_sit_sew', 'es_eb_sit_hammer', 'es_sm_hide_peek', 'es_wf_hide_peek'], 'assets/raw/keyart_gpt/elves_shoemaker_wide_v1.png', 'landscape 16:9', light_b=True)
key('es_key_port', WIN.replace('SHOE seen from the side (a rounded toe at the right, a low heel at the left, a flat bottom)', 'tall ARCHED WINDOW (a rectangle with a round top)').format(
        asp='portrait 3:4', pos='its bottom at about 80% of the height, its width about 86% of the canvas width', rest='The lower 20% of the canvas below the window is plain empty cream paper (a title is placed there later).'),
    'Stacked from top to bottom (a DIFFERENT composition, not a crop): at the top a window with a cream moon and falling snow; in the middle ' + ELVES2 + ', in their new colourful clothes jumping for joy on the work table, BIG; at the bottom a tiny pair of shoes and tiny folded clothes.',
    ['es_ea_joy_jump', 'es_eb_dressed_dance', 'es_prop_tiny_pair'], 'assets/raw/keyart_gpt/elves_shoemaker_tall_v1.png', 'portrait 3:4', light_b=True)
key('es_thumb', 'COMPOSITION (most important):\nA landscape 4:3 thumbnail tile, a full-bleed rectangular paper diorama picture (no cream sheet, no window, no border, no frame). Only 2 or 3 flat paper depth planes.',
    # 2026-11-28 사용자 결정: 타일은 퍼즐 조각·잠자리 표지에 쓰여 결말(새 옷)을 보이면 안 된다 → 밤에 헌 작업옷으로 구두를 만드는 장면. '맨발·누더기' 문구는 안전 필터에 막혀 '헌 회색 작업옷'으로 쓴다. 옛 v1 은 assets/raw/keyart_gpt/_rej/
    'At midnight on the shoemaker\'s work table, ' + ELVES2 + ', both wearing their simple old patched grey work tunics (NOT new clothes, no colourful clothes), sit BIG in the centre (faces large and clear, happy and busy): the boy taps a chestnut-brown shoe with a tiny hammer, the girl stitches it with needle and thread. One candle glows warm amber on the table beside them; leather pieces and a spool of thread lie nearby; a dark navy window with falling snow and a warm umber wall behind. It must NOT show the ending (no new clothes, no gifts).',
    ['es_ea_sit_hammer', 'es_eb_sit_sew', 'es_prop_shoe_brown'], 'assets/raw/keyart_gpt/elves_shoemaker_tile_v2.png', 'landscape 4:3', light_b=True)

for who in ('ea', 'eb'):  # 새 옷 기준: 얼굴·머리·몸은 그대로, 옷만 새 옷
    jj = next(j for j in jobs if j['id'] == f'es_{who}_dressed_stand')
    jj['prompt'] = jj['prompt'].replace('Keep every colour, piece and marking of the reference exactly.', 'Keep the face, hair, skin and body exactly; ONLY the clothes change: the grey rag is gone and ' + ('she' if who == 'eb' else 'he') + ' wears the NEW clothes described below.')
for j in jobs: assert len(j['refs']) <= 5, j['id']
assert len({j['id'] for j in jobs}) == len(jobs)
ids = [j['id'] for j in jobs]
for j in jobs:  # 참고 그림은 작업표 안에서 먼저 나와야 한다
    for r in j['refs']:
        rid = os.path.splitext(os.path.basename(r))[0]
        assert rid in ids and ids.index(rid) < ids.index(j['id']), (j['id'], rid)
json.dump(jobs, open(os.path.join(G, 'tools/app/gen/jobs_elves_shoemaker.json'), 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(jobs), sorted(Counter((j['kind'], j['pass']) for j in jobs).items()))
