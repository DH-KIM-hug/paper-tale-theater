#!/usr/bin/env python3
"""빨간 암탉(red_hen) 그림 작업표 tools/app/gen/jobs_red_hen.json 을 만든다 — tales/red_hen/PLAN.md 그림 목록 그대로.
스타일 문단은 별주부전 작업표(jobs_byeoljubu.json)와 같은 글을 그대로 가져다 쓴다(앱 전체 같은 종이 결).
  python3 tools/app/gen/mk_jobs_red_hen.py
pass 1: 기준 자세·소품·배경 / pass 2: 기준 그림을 참고로 넣는 자세·배경 변형 / pass 3: 컷 / pass 5: 표지·끝 그림"""
import json, os
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
BJ = {j['id']: j['prompt'] for j in json.load(open(os.path.join(G, 'tools/app/gen/jobs_byeoljubu.json')))}
def cut_at(s, a, b=None): i = s.index(a); return s[i:] if b is None else s[i:s.index(b, i)]
SP_HEAD = BJ['bj_prop_medicine_bag'][:BJ['bj_prop_medicine_bag'].index('SUBJECT AND POSE:')]
SP_TAIL = cut_at(BJ['bj_prop_medicine_bag'], 'If a reference image is attached')
BG_HEAD = BJ['bj_bg_shore_day'][:BJ['bj_bg_shore_day'].index('SCENE:')]
BG_RICH = cut_at(BJ['bj_bg_shore_day'], 'RICHNESS').replace('NO fish, ', '')
CUT_HEAD = BJ['bj_cut_shock'][:BJ['bj_cut_shock'].index('MOMENT:')]
KEY_HEAD = BJ['bj_key_wide'][:BJ['bj_key_wide'].index('FRAME (most important):')]
KEY_TAIL = cut_at(BJ['bj_key_wide'], 'LIGHTING:')
LIGHT_NO = cut_at(BJ['bj_bg_shore_day'], 'LIGHTING:').replace('NO people.\nNO animals.\n', '')
RAW = 'assets/raw/restyle/red_hen/'

TALE = ('This is the classic folk tale THE LITTLE RED HEN, set on a cheerful generic storybook farm (red barn, wooden fence, wheat field, '
        'windmill, farmhouse kitchen). Simple, warm, kid-friendly; no Disney look, no clothes on the animals except the hen\'s apron and headscarf '
        'and the animals\' collars.')

C = {  # 인물 설명(PLAN 등장인물 표)
 'hen': ('a LITTLE RED HEN (a generic storybook hen): body cherry red (#E04B3C) paper, wings and tail feathers bean red (#A93B32), comb and wattle '
         'persimmon (#E8703A), beak marigold (#F2B134), thin legs and feet tangerine (#F28C28); she wears a paper-cream (#F6ECD8) apron with a small '
         'sky-blue (#3E7CB1) chest pocket and a sky-blue headscarf tied under the comb with three small snow-white (#F4F6FA) dots. Proportions: 2 heads '
         'tall (big round head, round body). Her wing tips work like hands.'),
 'chick': ('a small round baby CHICK: body sunny yellow (#F2C94E), little wings honey (#F6D27A), tiny beak and legs tangerine (#F28C28). '
           'Very round, about 1.3 heads tall. NO ribbon, NO bow, NO clothes.'),
 'cat': ('a lazy CAT: body dust grey (#C6BFB4) with slate (#5A554E) stripes on the back, head and tail; belly, muzzle and paw tips snow white (#F4F6FA); '
         'a shell-pink (#F8D7E0) nose; a sunny-yellow (#F2C94E) collar with a small round marigold (#F2B134) bell. Pointed ears, long tail. NOT orange, NOT black.'),
 'dog': ('a playful DOG: body kraft tan (#C9A574), floppy ears and one patch on the back cocoa (#4E3524), chest paper cream (#F6ECD8), a sky-blue '
         '(#3E7CB1) collar, a round ink (#2A2A2A) nose. Short tail.'),
 'pig': ('a slow sleepy PIG: body blossom pink (#F2A7B5), round snout and the inside of the ears salmon (#F4A27A), two or three small cocoa (#4E3524) '
         'mud spots on the body, a curly tail. NO clothes at all.'),
}
F = {  # 얼굴
 'hen': 'FACE (hen): two round eyes, each a white disc with a smaller ink (#2A2A2A) disc, a small bean-red EYEBROW strip above each eye (eyebrows show the mood), two round shell-pink (#F8D7E0) cheeks; the marigold beak opens a little when she smiles or talks. No eyelashes, no glossy highlights.',
 'chick': 'FACE (chick): two small round ink (#2A2A2A) dot eyes, a tiny tangerine beak, two small shell-pink (#F8D7E0) cheeks. No eyelashes, no glossy highlights.',
 'cat': 'FACE (cat): two round eyes (a white disc with an ink disc; HALF-CLOSED sleepy lids when the pose says sleepy), a tiny shell-pink triangle nose, a small curved paper-strip mouth, two thin slate whisker strips on each side, two shell-pink cheeks. No eyelashes, no glossy highlights.',
 'dog': 'FACE (dog): two round eyes (a white disc with an ink disc), a round ink nose, a small curved mouth (a little coral (#F2795C) tongue when happy), two shell-pink cheeks. No eyelashes, no glossy highlights.',
 'pig': 'FACE (pig): two small round ink dot eyes, a big flat round salmon snout with two cocoa nostril dots, a small curved mouth, two shell-pink cheeks. No eyelashes, no glossy highlights.',
}
FRAMING = {
 'sq': 'FRAMING:\nSquare 1:1 image. The whole figure is visible and centred, filling about 80% of the frame. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
 'wide': 'FRAMING:\nLandscape 3:2 image. The whole figure is visible and centred, filling about 85% of the frame width. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
}
NOMAG = '\nNO magenta or hot-pink anywhere inside the subject.'
# 돼지 몸이 분홍이라 크로마키와 겹치지 않게
NOMAG_PIG = '\nNO magenta anywhere inside the subject (the pig is a soft blossom pink #F2A7B5, clearly different from the magenta background).'

def sp_tail(shape, pig=False):
    t = SP_TAIL
    t = t.replace(t[t.index('FRAMING:'):t.index('LIGHTING:')], FRAMING[shape] + '\n\n')
    if t.rstrip().endswith('NO magenta or hot-pink anywhere inside the subject.'):
        t = t.rstrip()[:-len('NO magenta or hot-pink anywhere inside the subject.')].rstrip()
    return t + (NOMAG_PIG if pig else NOMAG)

jobs = []
def char(who, pid, pose, scenes, ref=None, shape='sq', note=''):
    same = (f'The SAME {who} as the reference image. SAME SCALE AS THE REFERENCE: the head, face, eyes and body are exactly the same size as in the '
            'reference image (measure by the head width); only the pose and expression change as described. Keep every colour and marking of the reference exactly. ') if ref else ''
    p = (SP_HEAD + 'SUBJECT AND POSE:\n' + TALE + '\n' + same + C[who][0].upper() + C[who][1:] + ' POSE: ' + pose +
         '\nHANDS: nothing in the paws or wing tips unless the pose names an object; never another character in the hands.\n\n' + F[who] + ' Objects that are not characters have NO face.\n\n' +
         sp_tail(shape, who == 'pig'))
    jobs.append({'id': f'hen_{pid}', 'kind': 'sprite', 'pass': 2 if ref else 1, 'refs': [RAW + f'hen_{ref}.png'] if ref else [],
                 'size': [840, 560] if shape == 'wide' else [600, 600], 'out': RAW + f'hen_{pid}.png',
                 **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), 'note': f'{scenes}장. {note}'.strip()})
    jobs[-1]['prompt'] = p

def prop(pid, desc, scenes, shape='sq', ref=None, note=''):
    p = (SP_HEAD + 'SUBJECT AND POSE:\nAn OBJECT (not a character) for the folk tale The Little Red Hen: ' + desc +
         (' Draw it in the SAME paper style and at the same scale as the attached reference object.' if ref else '') +
         ' Shown alone, centred.\n\nThis is an OBJECT, not a character: NO face, NO eyes, NO mouth anywhere on it.\n\n' + sp_tail(shape))
    jobs.append({'id': f'hen_{pid}', 'kind': 'sprite', 'pass': 2 if ref else 1, 'refs': [RAW + f'hen_{r}.png' for r in ([ref] if isinstance(ref, str) else (ref or []))],
                 'size': [840, 560] if shape == 'wide' else [600, 600], 'out': RAW + f'hen_{pid}.png',
                 **({'aspect': 'landscape 3:2'} if shape == 'wide' else {}), 'note': f'{scenes}장. {note}'.strip(), 'prompt': p})

# ── 인물: 암탉 ────────────────────────────────
char('hen', 'hen_stand', 'standing calmly in SIDE VIEW FACING LEFT, wings folded at her sides, a friendly small smile, looking left.', '1·3·8', note='기준 자세: 머리 폭(볏 제외) 기준, 크기표 1.0')
H = 'hen_stand'
char('hen', 'hen_hold_sack', 'three-quarter view, holding up a small kraft (#C9A574) seed sack with BOTH wing tips (the wing tips touch the sack), the sack open at the top showing small straw-gold seeds, looking DOWN at the sack, curious.', '1·2', H)
char('hen', 'hen_sad', 'facing the viewer, a little glum: eyebrows tilted down, wings hanging low, beak closed, looking DOWN. NOT crying, no tears.', '1', H)
char('hen', 'hen_determined', 'FRONT VIEW, cheerful and determined: eyebrows UP, one wing raised high like saying "I will do it myself!", beak open in a smile.', '1·3·4·5', H)
char('hen', 'hen_sow', 'SIDE VIEW FACING LEFT, bending forward, scattering a few straw-gold seeds from one wing tip toward the ground, looking DOWN.', '2', H)
char('hen', 'hen_water', 'SIDE VIEW FACING LEFT, tipping a lagoon (#4FB3C9) watering can held in both wing tips, a short aqua (#7FD8D3) water stream of three flat paper strips pouring down at the left, looking DOWN.', '2', H, note='물뿌리개 포함')
char('hen', 'hen_look_up', 'three-quarter view facing left, head tilted far back looking UP, wings slightly open in wonder, beak open "oh!".', '2·4', H)
char('hen', 'hen_cut', 'SIDE VIEW FACING LEFT, holding a small round paper sickle (stone grey #A9A39B blade, bark brown #6B4A32 handle, no shine) low in one wing tip as if cutting wheat stalks, looking DOWN, calm.', '3', H, note='낫 포함, 날 번쩍임 없음')
char('hen', 'hen_carry', 'SIDE VIEW walking to the RIGHT, carrying a straw-gold wheat bundle tied with a bean-red string balanced ON HER HEAD with both wing tips holding it, mid-step, looking RIGHT.', '4', H, shape='wide', note='밀단 포함')
char('hen', 'hen_ask', 'SIDE VIEW FACING LEFT, one wing stretched out toward the left, palm-up like asking "please give me that", beak open, eyebrows friendly, looking LEFT.', '5·9', H)
char('hen', 'hen_knead', 'three-quarter view, both wing tips pressed down in front of her as if kneading dough on a table (no bowl drawn), looking DOWN, happy.', '5·9', H, note='그릇은 소품')
char('hen', 'hen_butter', 'three-quarter view, holding a small honey-yellow (#F6D27A) butter piece in one wing tip, spreading it downward, looking DOWN.', '5', H, note='버터 포함')
char('hen', 'hen_sit_wait', 'SIDE VIEW FACING RIGHT, sitting down (body low, legs tucked), wings folded, waiting patiently, looking RIGHT.', '6', H)
char('hen', 'hen_bread', 'FRONT VIEW, holding a snow-white plate with a golden loaf of bread (straw gold #D9A94E crust, pearl cream #FBF3D5 slashes) with BOTH wing tips in front of her apron, proud smile.', '6·8', H, note='빵 접시 포함')
char('hen', 'hen_speak_calm', 'SIDE VIEW FACING RIGHT, both wings folded neatly on her apron, standing tall, speaking calmly and kindly (beak a little open, eyebrows level). NOT angry.', '7', H)
char('hen', 'hen_eat', 'three-quarter view, one wing tip raised to her beak as if taking a bite (the wing tip is EMPTY; the food is added later), eyes happily closed, chewing.', '7·10', H, note='먹는 음식은 코드로 붙임')
char('hen', 'hen_happy', 'FRONT VIEW, both wings spread wide open, big happy smile, a little hop.', '8·9', H)
char('hen', 'hen_point', 'SIDE VIEW FACING LEFT, one wing tip pointing DOWN and forward to the ground in front of her, looking DOWN, explaining kindly.', '8', H)
char('hen', 'hen_place', 'SIDE VIEW FACING RIGHT, leaning forward with both wing tips reaching DOWN to the right as if gently placing something on a plate (the wing tips are EMPTY), looking DOWN.', '9', H, note='얹는 재료는 코드로')
char('hen', 'hen_pour', 'SIDE VIEW FACING RIGHT, tipping a lagoon (#4FB3C9) milk bottle with a snow-white milk stream (flat paper strips) pouring down at the right, looking DOWN.', '10', H, note='우유병 포함')
char('hen', 'hen_wave', 'FRONT VIEW, one wing waving high above her head, big smile, eyes happy.', '10', H)
# ── 병아리 ──
char('chick', 'chick_stand', 'standing in SIDE VIEW FACING LEFT, tiny wings at the sides, looking left.', '전 장면', note='기준 자세: 머리 폭, 크기표 0.35. 리본은 hen_prop_bow_* 를 코드로 얹음')
char('chick', 'chick_look_up', 'three-quarter view, head tilted back looking UP, beak open in wonder.', '2·6', 'chick_stand')
char('chick', 'chick_hop', 'FRONT VIEW, hopping in the air with both tiny wings up, beak open "peep!".', '2·9·10', 'chick_stand')
char('chick', 'chick_carry', 'SIDE VIEW walking to the RIGHT, both tiny wings raised to its head as if balancing something on top (nothing on the head), looking RIGHT.', '5·9', 'chick_stand', note='머리 위 재료는 코드로')
char('chick', 'chick_eat', 'SIDE VIEW FACING LEFT, bending down pecking at crumbs, eyes closed happily.', '7·10', 'chick_stand')
# ── 고양이 ──
char('cat', 'cat_sit', 'sitting in SIDE VIEW FACING LEFT, tail curled around the paws, sleepy half-closed eyes, looking left.', '1·4·8', note='기준 자세: 머리 폭, 크기표 앉기 0.7')
char('cat', 'cat_lie_fence', 'lying stretched out flat on its belly, side view, front paws dangling down, tail hanging, eyes CLOSED, lazy and relaxed (no fence drawn; the fence is placed under it later).', '1', 'cat_sit', shape='wide', note='울타리는 배경')
char('cat', 'cat_yawn', 'sitting, FRONT VIEW, a big wide yawn (mouth open in a round O, eyes squeezed shut), one paw raised to the mouth.', '1', 'cat_sit')
char('cat', 'cat_peek', 'ONLY the head and the two front paws, as if peeking over the top of a fence or a window sill: the bottom edge is cut STRAIGHT across under the chin and paws. Facing RIGHT, eyes open, curious.', '3·5·7', 'cat_sit', note='울타리·창 뒤에서 얼굴만. 창에서는 뒤집음')
char('cat', 'cat_sniff', 'standing on all fours, head and nose lifted up to the UPPER LEFT, sniffing a nice smell, eyes closed dreamily.', '6', 'cat_sit', shape='wide')
char('cat', 'cat_raise', 'sitting, facing LEFT, one front paw raised high "me!", eyes wide open, eager.', '7', 'cat_sit')
char('cat', 'cat_run', 'running happily on its hind legs in SIDE VIEW to the RIGHT, both front paws held out forward together as if carrying a small thing (the paws are EMPTY), eyes wide awake and bright, smiling.', '8', 'cat_sit', note='재료(치즈·꿀)는 코드로 앞발에. 뒤집기 가능')
char('cat', 'cat_stand_help', 'standing on its hind legs, front paws resting on an invisible table edge in front, looking DOWN, interested, eyes open.', '9', 'cat_sit')
char('cat', 'cat_eat', 'sitting, front paws raised to its mouth as if eating (the paws are EMPTY), eyes happily closed.', '10', 'cat_sit', note='음식은 코드로')
# ── 개 ──
char('dog', 'dog_sit', 'sitting in SIDE VIEW FACING LEFT, ears hanging, looking left, friendly.', '1·4·8', note='기준 자세: 머리 폭, 크기표 앉기 0.85')
char('dog', 'dog_lie', 'lying on its belly in SIDE VIEW FACING LEFT, chin resting on the crossed front paws, eyes looking DOWN, bored and lazy.', '1', 'dog_sit', shape='wide')
char('dog', 'dog_peek', 'ONLY the head and the two front paws, as if peeking over the top of a fence or a window sill: the bottom edge is cut STRAIGHT across under the chin and paws. Facing RIGHT, ears up a little, curious.', '3·5·7', 'dog_sit')
char('dog', 'dog_sniff', 'standing on all fours, nose lifted up to the UPPER LEFT, sniffing, tail up, tongue out a little.', '6', 'dog_sit', shape='wide')
char('dog', 'dog_raise', 'sitting, facing LEFT, one front paw raised high "me!", tongue out, eager.', '7', 'dog_sit')
char('dog', 'dog_run', 'running happily on its hind legs in SIDE VIEW to the RIGHT, both front paws held out forward together as if carrying a small thing (the paws are EMPTY), ears flying, smiling.', '8', 'dog_sit', note='재료(토마토·딸기)는 코드로')
char('dog', 'dog_stand_help', 'standing on its hind legs, front paws resting on an invisible table edge in front, looking DOWN, interested.', '9', 'dog_sit')
char('dog', 'dog_eat', 'sitting, front paws raised to its mouth as if eating (the paws are EMPTY), eyes happily closed.', '10', 'dog_sit')
# ── 돼지 ──
char('pig', 'pig_stand', 'standing on all fours in SIDE VIEW FACING LEFT, looking left, calm and slow.', '4·8', shape='wide', note='기준 자세: 머리 폭, 크기표 0.85(길이 1.2)')
char('pig', 'pig_mud', 'sitting back on its bottom like a person sitting, FRONT VIEW, front legs resting on the belly, eyes looking UP and away dreamily (no mud drawn; the puddle is in the background).', '1', 'pig_stand')
char('pig', 'pig_peek', 'ONLY the head and the two front trotters, as if peeking over the top of a fence or a window sill: the bottom edge is cut STRAIGHT across under the chin and trotters. Facing RIGHT, curious.', '3·5·7', 'pig_stand')
char('pig', 'pig_sniff', 'standing on all fours, snout lifted up to the UPPER LEFT, sniffing, eyes closed dreamily.', '6', 'pig_stand', shape='wide')
char('pig', 'pig_raise', 'sitting back on its bottom, facing LEFT, one front trotter raised high "me too!", eager.', '7', 'pig_stand')
char('pig', 'pig_run', 'trotting happily on its hind legs in SIDE VIEW to the RIGHT, both front trotters held out forward together as if carrying a small thing (EMPTY), smiling.', '8', 'pig_stand', note='재료(상추·옥수수·바나나)는 코드로')
char('pig', 'pig_stand_help', 'standing on its hind legs, front trotters resting on an invisible table edge in front, looking DOWN, interested.', '9', 'pig_stand')
char('pig', 'pig_eat', 'sitting back on its bottom, front trotters raised to its mouth as if eating (EMPTY), eyes happily closed.', '10', 'pig_stand')

# ── 소품(얼굴 없음) ──
prop('prop_seed_sack', 'a small kraft (#C9A574) cloth seed sack, its top open and folded down, showing many small straw-gold (#D9A94E) wheat seeds inside, a bark-brown string.', '1·2', note='2장 누르는 대상, 높이 0.5')
prop('prop_sun', 'a round sun: a marigold (#F2B134) disc on a slightly larger honey (#F6D27A) disc, with eight short honey paper rays.', '2')
prop('prop_sprout', 'one tiny wheat sprout: two or three thin spring-green (#B5D36B) blades coming out of a small taupe (#8C7461) soil mound.', '2', note='0.3')
prop('prop_wheat_young', 'one young wheat plant: a tuft of leaf-green (#8CBF5A) blades and one small green ear on top, standing upright on a small taupe soil mound.', '2', note='0.7')
prop('prop_wheat_gold', 'one tall ripe wheat plant: a straight straw-gold (#D9A94E) stalk with two long leaves and a big ear of wheat on top made of many small honey (#F6D27A) and wheat-gold (#E8C36A) grain pieces with fine whiskers, on a small taupe soil mound. Tall and narrow.', '2·3', note='1.3')
prop('prop_wheat_cut', 'a few cut ripe wheat stalks lying flat on their side, straw gold and honey with their ears to the left.', '3', shape='wide')
prop('prop_wheat_bundle', 'a bundle of ripe wheat stalks standing upright, tied in the middle with a bean-red (#A93B32) string, the ears fanning out on top.', '3·4', note='0.9')
prop('prop_watering_can', 'a lagoon (#4FB3C9) watering can with a long spout to the left and a round handle on top.', '2·8')
prop('prop_flour_bin', 'a kraft (#C9A574) wooden bin full of snow-white (#F4F6FA) flour, with a stream of flour pouring into it from above made of three overlapping flat snow-white and pearl-cream paper strips.', '4')
prop('prop_flour_bin_empty', 'an empty kraft (#C9A574) wooden bin.', '4', ref='prop_flour_bin')
prop('prop_mill_sails', 'the four sails of a windmill seen from the front: four long bark-brown (#6B4A32) wooden frames crossing at a round centre, each with a paper-cream (#F6ECD8) cloth sail panel. Perfectly symmetric (it will be rotated by code).', '4', note='코드 회전')
prop('prop_shelf', 'a wide wooden kitchen shelf board in bark brown (#6B4A32) with a kraft top edge and two small brackets under it, seen from the front, empty.', '5', shape='wide')
ING = [
 ('flour', 'a small sand (#E9DCC0) flour sack with a sky-blue (#3E7CB1) label patch (no letters) and a little snow-white flour spilling at its open top'),
 ('water', 'a lagoon (#4FB3C9) water jug with an aqua (#7FD8D3) water level and a handle'),
 ('butter', 'a honey-yellow (#F6D27A) block of butter on a small snow-white (#F4F6FA) dish'),
 ('tomato', 'one round cherry-red (#E04B3C) tomato with a small pine-green (#3F6B4F) star-shaped stem on top'),
 ('cheese', 'one wedge of sunny-yellow (#F2C94E) cheese with three round honey (#F6D27A) holes'),
 ('lettuce', 'one ruffled lettuce leaf in leaf green (#8CBF5A) with spring-green (#B5D36B) inner layer'),
 ('egg', 'one whole white egg (snow white #F4F6FA) next to a half boiled egg showing a round marigold (#F2B134) yolk on pearl cream'),
 ('milk', 'a lagoon (#4FB3C9) milk bottle with snow-white milk inside and a paper-cream lid'),
 ('corn', 'one ear of corn: honey-yellow (#F6D27A) kernels in rows, with two leaf-green husk leaves peeled back'),
 ('strawberry', 'one big cherry-red (#E04B3C) strawberry with small honey seed dots and a leaf-green leafy cap'),
 ('banana', 'one curved sunny-yellow (#F2C94E) banana with a small cocoa tip'),
 ('honey', 'a small round honey jar: a honey (#F6D27A) jar with a marigold (#F2B134) honey drip at the rim and a kraft lid tied with a string'),
]
for k, d in ING:
    prop(f'prop_ing_{k}', d + '.', '5·8·9·10', ref=None if k == 'flour' else 'prop_ing_flour', note='재료 한 칸 0.3(칸 0.4). 같은 크기 느낌으로')
prop('prop_bowl_flour', 'a wide lagoon (#4FB3C9) mixing bowl seen from the side, filled with a mound of snow-white flour.', '5')
prop('prop_bowl_dough', 'the SAME lagoon mixing bowl with a round soft pearl-cream (#FBF3D5) ball of dough on top.', '5·9', ref='prop_bowl_flour')
prop('prop_tin', 'an empty slate (#5A554E) rectangular bread tin seen from the side.', '5')
prop('prop_oven_closed', 'an old farmhouse oven: a slate (#5A554E) iron box with a round-topped door and a small dark window in the door, a marigold (#F2B134) handle, four short legs, a short chimney pipe. Door CLOSED, cold.', '5·9', note='1.3')
prop('prop_oven_open', 'the SAME farmhouse oven with the door OPEN downward, inside glowing ember amber (#F2B366) and persimmon (#E8703A), a golden loaf of bread on the rack inside.', '6', ref='prop_oven_closed')
prop('prop_bread', 'one round golden loaf of bread: straw gold (#D9A94E) crust with three pearl-cream (#FBF3D5) slash marks on top.', '6·7·8', note='0.45')
prop('prop_bread_slice', 'one slice of bread seen from the side lying flat: a thin straw-gold crust edge around a pearl-cream (#FBF3D5) inside.', '9', shape='wide')
prop('prop_plate', 'a flat snow-white (#F4F6FA) plate seen from the side with a thin sky-blue rim line.', '7·9·10', shape='wide')
prop('prop_smell', 'three wavy curling smell lines made of thin paper-cream (#F6ECD8) paper strips rising upward side by side.', '6')
prop('prop_window_frame', 'a big farmhouse kitchen window frame seen from the front: a wide paper-cream (#F6ECD8) wooden frame with a straight sill at the bottom, the window opening EMPTY (cut out, nothing inside, the opening is magenta like the background), two small sky-blue curtains tied at the sides.', '5·6·7', shape='wide', note='창 안은 비움(창밖 친구들·하늘은 코드)')
for k, d in [('lettuce', 'a ruffled leaf-green lettuce leaf lying flat (seen from the side, as a thin wavy layer)'),
             ('tomato', 'three round cherry-red tomato slices lying flat side by side (seen from the side, as a thin layer)'),
             ('cheese', 'a flat square sunny-yellow cheese slice with a corner drooping (seen from the side, as a thin layer)'),
             ('egg', 'three round boiled egg slices lying flat side by side, white rings with marigold yolks (seen from the side, as a thin layer)')]:
    prop(f'prop_layer_{k}', d + ', the width of a slice of bread.', '9·10', shape='wide', ref='prop_bread_slice', note='샌드위치 층')
prop('prop_sandwich_piece', 'one triangle piece of a sandwich seen from the side, showing the layers: bread, lettuce, tomato, cheese, egg, bread.', '10·뒷표지')
# 피자
prop('prop_pizza_dough', 'a round flat pizza base (pearl cream #FBF3D5 dough with a slightly raised straw-gold rim) seen from slightly above as a flat disc.', '8·9', shape='wide')
prop('prop_pizza_layer_sauce', 'a round flat disc of cherry-red tomato sauce, a little smaller than a pizza base, with a few cut tomato slices on it (seen from slightly above).', '9', shape='wide', ref='prop_pizza_dough', note='도우 위에 겹침')
prop('prop_pizza_layer_cheese', 'many sunny-yellow cheese pieces scattered in a round area, a little smaller than a pizza base (seen from slightly above), the background between the pieces is magenta.', '9', shape='wide', ref='prop_pizza_dough')
prop('prop_pizza_layer_corn', 'many small honey-yellow corn kernels scattered in a round area, a little smaller than a pizza base (seen from slightly above), the background between them is magenta.', '9', shape='wide', ref='prop_pizza_dough')
prop('prop_pizza_whole', 'a whole baked pizza: golden crust, tomato, melted sunny-yellow cheese and honey corn on top, cut into six slices, seen from slightly above.', '9·10', shape='wide', ref='prop_pizza_dough')
prop('prop_pizza_slice', 'one triangle slice of pizza with tomato, cheese and corn, golden crust edge.', '10', ref='prop_pizza_whole')
# 팬케이크
prop('prop_fry_pan', 'a slate (#5A554E) frying pan seen from the side with a long bark-brown handle to the right.', '9', shape='wide')
prop('prop_pancake_stack', 'a stack of three round fluffy pancakes seen from the side: straw-gold (#D9A94E) tops and pearl-cream edges, on a snow-white plate.', '9', ref='prop_plate')
prop('prop_pancake_layer_strawberry', 'a few sliced cherry-red strawberry pieces sitting in a row as a thin layer (seen from the side), the width of a pancake.', '9', shape='wide', ref='prop_pancake_stack')
prop('prop_pancake_layer_banana', 'a few round sunny-yellow banana slices sitting in a row as a thin layer (seen from the side), the width of a pancake.', '9', shape='wide', ref='prop_pancake_stack')
prop('prop_pancake_layer_honey', 'honey drizzle: a flat honey-yellow (#F6D27A) paper shape like honey poured over the top of a pancake stack, dripping down at both sides in three drips (seen from the side), the width of a pancake.', '9', shape='wide', ref='prop_pancake_stack')
prop('prop_pancake_piece', 'one small stack of two pancake wedges with a strawberry slice and honey on top, on nothing.', '10', ref='prop_pancake_stack')
# 카드·얼굴 카드·꼬리표·리본
CARD = 'a portrait paper-cream (#F6ECD8) card with rounded corners and NO border line, NO letters; in its centre a small picture of '
for k, d in [('seed', 'a kraft seed sack with wheat seeds'), ('wheat', 'one ripe golden wheat plant'), ('flour', 'a sand flour sack with a blue label'),
             ('bread', 'a round golden loaf of bread'), ('pizza', 'a round flat pizza base with a golden rim'), ('pancake', 'a stack of three golden pancakes')]:
    prop(f'prop_card_{k}', CARD + d + '.', '8', ref=None if k == 'seed' else 'prop_card_seed', note='순서 카드 0.6')
prop('prop_card_slot', 'an empty portrait card-sized rectangle of plain sand (#E9DCC0) paper with rounded corners, slightly recessed, nothing on it.', '8', ref='prop_card_seed')
prop('prop_face_sad', CARD.replace('NO letters; in its centre a small picture of ', 'NO letters; on it a simple drawn face of the red hen (cherry red head, persimmon comb, marigold beak, sky-blue headscarf) looking GLUM: eyebrows tilted down, beak closed. ').rstrip(' of'),
     '1', note='얼굴 카드(그림 속 그림이라 얼굴 있음)')
jobs[-1]['prompt'] = jobs[-1]['prompt'].replace('NO face, NO eyes, NO mouth anywhere on it.', 'The card shows a drawn hen face (a picture on a card); the card itself has no face.')
prop('prop_face_happy', 'a portrait paper-cream (#F6ECD8) card with rounded corners and NO border line, NO letters; on it a simple drawn face of the red hen (same as the reference card) SMILING happily: eyebrows up, beak open.', '1', ref='prop_face_sad', note='얼굴 카드')
jobs[-1]['prompt'] = jobs[-1]['prompt'].replace('NO face, NO eyes, NO mouth anywhere on it.', 'The card shows a drawn hen face (a picture on a card); the card itself has no face.')
prop('prop_tag', 'a blank paper-cream (#F6ECD8) luggage tag shape (a wide rectangle with cut corners on the left and a small round hole) with NO letters, NO string.', '낱말 전부', shape='wide', note='글자는 코드')
for k, hx in [('red', 'cherry red (#E04B3C)'), ('blue', 'sky blue (#3E7CB1)'), ('green', 'leaf green (#8CBF5A)')]:
    prop(f'prop_bow_{k}', f'one tiny ribbon bow in {hx} paper.', '전 장면', note='병아리 머리 리본(코드로 얹음)')
prop('prop_table_long', 'a long wooden outdoor table seen from the front: bark-brown (#6B4A32) legs and a tablecloth of paper-cream and sky-blue checks hanging over the front edge, nothing on top.', '10', shape='wide', note='폭 2.4')
prop('prop_cup', 'one small pearl-cream (#FBF3D5) cup with a handle, filled with snow-white milk.', '10')
prop('prop_table_kitchen', 'a wooden kitchen table seen from the front: kraft (#C9A574) top edge and bark-brown legs, nothing on top.', '5·7·9', shape='wide', note='부엌 탁자(배경과 분리해 앞에 둠)')
# 앞 가림
prop('fg_flower_bush', 'a low flower bush for the lower-left corner of a picture: pine-green and leaf-green leaves with blossom-pink (#F2A7B5), sunny-yellow and coral (#F2795C) flowers.', '1·8·10', shape='wide')
prop('fg_grass_tuft', 'a tuft of tall grass blades in spring green (#B5D36B), leaf green and fern (#5E8C5A).', '1·2·4')
prop('fg_wheat_ears', 'two tall ripe wheat stalks crossing, straw gold and honey ears.', '3')
prop('fg_pot_plant', 'a sky-blue (#3E7CB1) pot with a leafy leaf-green plant and two coral flowers.', '5·6·7·9')
prop('fg_hanging_pans', 'a kitchen rail with two hanging cocoa (#4E3524) pans and a wooden spoon, hanging down from the top.', '5·6')

# ── 배경 ──
COMMON = ('Sun at the upper left (set A light). Characters, props and pressable items are separate sprites added later. '
          'NO hen, NO chicks, NO cat, NO dog, NO pig, NO animals, NO people.')
def bg(pid, scene, papers, layout, ref=None, note=''):
    p = BG_HEAD + 'SCENE:\n' + TALE + '\n' + scene + ' ' + COMMON + ' SCENE PAPERS: ' + papers + '\n' + layout + '\n' + BG_RICH
    p = p.replace(cut_at(p, 'LIGHTING:'), LIGHT_NO)
    jobs.append({'id': f'hen_{pid}', 'kind': 'bg', 'pass': 2 if ref else 1, 'refs': [RAW + f'hen_{ref}.png'] if ref else [], 'size': [1600, 902],
                 'out': RAW + f'hen_{pid}.png', 'note': note, 'prompt': p})
YARD_P = ('sky pale sky #CDE6F7, sky paper #A9D3F0, clouds paper cream #F6ECD8; sun marigold #F2B134, honey #F6D27A; far hills mist mint #CFE6DA, fern #5E8C5A; '
          'barn bean red #A93B32, roof bark brown #6B4A32, door cocoa #4E3524, window frames paper cream; fence kraft #C9A574; tree trunk bark brown, leaves pine green #3F6B4F, leaf green #8CBF5A; '
          'grass spring green #B5D36B; soil taupe #8C7461; mud puddle cocoa; flowers blossom pink #F2A7B5, sunny yellow #F2C94E, coral #F2795C.')
bg('bg_yard', 'Scenes 1 and 10, a bright farm yard in the morning, seen wide at eye level.', YARD_P,
   'Planes back to front: (1) the sky with a few cut-paper clouds and the sun disc at the upper left; (2) two far rolling hills (mist mint behind fern) with a row of small far trees; '
   '(3) a RED BARN at the LEFT (x 0-24%) with a cocoa door and cream window frames; a low wooden FENCE running across the middle (y 48-58%) from x 22% to 70%; a BIG round TREE at the RIGHT (x 74-100%) '
   'with its trunk and a wide leafy crown; a small round cocoa MUD PUDDLE on the ground at the lower right (x 70-88%, y 80-92%); (4) the yard: plain spring-green grass from y 58% down, a few flowers and grass tufts ONLY at the far left and right bottom corners. '
   'The CENTRE yard (x 24-74%, y 58-100%) stays PLAIN grass.', note='1·10장 농장 마당')
bg('bg_yard_morning', 'Scene 8, the SAME farm yard as the reference image on the NEXT MORNING: keep the layout (barn at the left, fence across the middle, big tree at the right, mud puddle, plain centre) EXACTLY as in the reference; change the sky to soft morning bands of peach #F7C59F, apricot #F4A261 and honey #F6D27A with paper-cream clouds and a rising honey sun at the left.',
   YARD_P + ' Plus peach #F7C59F, apricot #F4A261.', 'The CENTRE yard (x 20-80%, y 50-100%) stays PLAIN grass (cards are placed there later).', ref='bg_yard', note='8장 다음 날 아침(pass 2)')
FIELD_P = ('sky pale sky #CDE6F7, sky paper #A9D3F0, clouds paper cream; far hills mist mint #CFE6DA, fern #5E8C5A; barn corner bean red #A93B32; fence kraft #C9A574; '
           'furrows taupe #8C7461 and cocoa #4E3524; grass spring green #B5D36B, leaf green #8CBF5A.')
bg('bg_field', 'Scene 2, an empty ploughed field next to the barn, seen from the side at eye level.', FIELD_P,
   'Planes back to front: (1) a wide sky (big, the top half) with clouds; (2) far hills (mist mint, fern); (3) the corner of the red barn at the far LEFT edge (x 0-12%); '
   '(4) the FIELD: three long horizontal soil FURROW bands (taupe and cocoa, alternating) across the lower half (y 55-90%), EMPTY (no plants; the wheat is added later as sprites); a grass strip at the very bottom. '
   'A fence post and grass tuft only at the lower right corner. The furrows in the centre stay plain.', note='2장 빈 밭(밀은 소품)')
bg('bg_field_gold', 'Scene 3, the SAME field as the reference image when the wheat is ripe: keep the layout EXACTLY (barn corner at the left, furrows, sky), make the sky pale sky #CDE6F7 and add a low wooden kraft FENCE along the LEFT side (x 4-30%, y 45-60%) behind which three animals will peek later.',
   FIELD_P + ' Plus straw gold #D9A94E, honey #F6D27A.', 'The furrows stay EMPTY (the golden wheat plants are added later as sprites). The centre stays plain.', ref='bg_field', note='3장 황금 밀밭(pass 2)')
bg('bg_mill', 'Scene 4, a windmill on a green hill, seen from far away (no perspective, just stacked flat layers).',
   'sky sky paper #A9D3F0, pale sky #CDE6F7, clouds paper cream; hills spring green #B5D36B, leaf green #8CBF5A, fern #5E8C5A; windmill body stone grey #A9A39B, dust grey #C6BFB4, roof bean red #A93B32, door cocoa #4E3524; path sand #E9DCC0, taupe #8C7461; flowers blossom pink #F2A7B5, sunny yellow #F2C94E; tiny far barn bean red.',
   'Planes back to front: (1) sky and clouds; (2) far hills with a TINY red barn far away at the right; (3) a big green HILL at the UPPER LEFT with a stone-grey WINDMILL tower standing on top (x 12-34%, y 8-55%) — the tower body, a bean-red cap roof and a cocoa door at its foot, but NO sails (the sails are a separate sprite placed on the round hub at the top of the tower; draw only a small round hub); '
   '(4) a sand PATH winding from the windmill door down to the lower right; grass at the bottom with flowers ONLY at the bottom-right corner. The path and the centre (x 30-80%, y 55-100%) stay plain.', note='4장 풍차(날개는 소품)')
KIT_P = ('wall paper cream #F6ECD8, cream deep #EBDFC8; tile band sky blue #3E7CB1, powder blue #BFE0F2; wood bark brown #6B4A32, kraft #C9A574; floor taupe #8C7461, sand #E9DCC0; '
         'window sky pale sky #CDE6F7, grass spring green #B5D36B; pot rail cocoa #4E3524; flower coral #F2795C, leaf green #8CBF5A.')
bg('bg_kitchen', 'Scenes 5, 6, 7 and 9, a cosy farmhouse kitchen, seen at eye level, close.', KIT_P,
   'Planes back to front: (1) a cream WALL with a sky-blue and powder-blue checked TILE band across the middle (y 44-52%); (2) a big WINDOW at the UPPER RIGHT (x 60-92%, y 8-44%) showing pale sky and a green yard outside; '
   '(3) a plain empty wall area at the LEFT (x 4-36%, y 15-55%) where a shelf is placed later; an empty floor area at the RIGHT (x 70-96%) where an oven is placed later; (4) a taupe and sand plank FLOOR from y 72% down. '
   'NO table, NO shelf, NO oven, NO bowls drawn (all separate sprites). Small decorations (a wall clock, a plate rack) only at the very top edge.', note='5·6·7·9장 부엌')
bg('bg_kitchen_lb', 'Scene 6, the SAME kitchen as the reference image in the late afternoon: keep the layout EXACTLY; the wall one step darker (cream deep #EBDFC8), the window sky apricot #F4A261 and dusty apricot #E9B98A, and a soft warm ember-amber (#F2B366) glow of light spreading from the empty oven area at the right (light gradient allowed ONLY for this glow; paper pieces stay one flat colour).',
   KIT_P + ' Plus apricot #F4A261, ember amber #F2B366, pearl cream #FBF3D5.', 'Keep the same empty areas for the shelf, table and oven.', ref='bg_kitchen', note='6장 빛 상자 후보(pass 2) — 인물 합성 검수 통과 시만')

# ── 컷(4:3) ──
FC = ' '.join(F.values())
def cut(pid, moment, panel, refs, scene):
    p = (CUT_HEAD + 'MOMENT:\nOne picture-book moment filling the ENTIRE image edge to edge (full-bleed, no border), kid-friendly and warm. ' + moment +
         ' Every character keeps exactly the head size, body proportions, colours and markings of its reference sprite; only the pose and expression change. Objects, props, plants and backgrounds have NO face. ' + TALE +
         '\n\nPANEL BACKGROUND:\n' + panel + ' — every piece one flat solid colour, no gradient (except a soft light glow where the moment says so).\n\n' + FC +
         '\n\nIf reference images are attached, they show the characters: match their shapes, colours, clothes and markings exactly.\n\nFRAME:\nNo border, no speech bubbles, no panel lines, no letters; fills the frame edge to edge. The panel background is the scene itself — NEVER a plain magenta or chroma-key background.\n\n' + LIGHT_NO)
    jobs.append({'id': f'hen_{pid}', 'kind': 'cut', 'pass': 3, 'refs': [RAW + f'hen_{r}.png' for r in refs], 'size': [1600, 1200], 'aspect': 'landscape 4:3',
                 'out': RAW + f'hen_{pid}.png', 'note': scene, 'prompt': p})
cut('cut_grow', 'Tall ripe golden wheat stands higher than the red hen; the hen holds a lagoon watering can and looks UP at the wheat ears in wonder; three little chicks peek out between the wheat stalks looking up. The sun at the upper right.',
    'a pale-sky and honey sky, many straw-gold, honey and wheat-gold stalks and ears in layers, a spring-green strip at the bottom', ['hen_water', 'chick_look_up', 'prop_wheat_gold'], '2장')
cut('cut_mill', 'At the door of the windmill, snow-white flour pours down in three flat paper strips into a kraft bin; the red hen holds the bin and looks DOWN at the flour, delighted. The big windmill sails cross the top edge of the panel.',
    'stone-grey windmill wall, bark-brown and cream sails at the top, sky paper blue, a sand path', ['hen_happy', 'prop_flour_bin', 'prop_mill_sails'], '4장')
cut('cut_oven', 'The oven door is wide open and a golden loaf of bread sits inside; a warm ember-amber light glow from the oven lights up the faces of the red hen and three chicks who look DOWN at the bread in front of them, smiling; three cream smell lines curl upward (the light glow is a soft light layer; every paper piece stays one colour).',
    'slate oven, ember amber #F2B366 and persimmon #E8703A inside the oven, a cream deep kitchen wall, a sky-blue tile band', ['hen_bread', 'chick_look_up', 'prop_oven_open'], '6장')
cut('cut_eat', 'At the kitchen table the red hen and three chicks happily eat the bread (eyes closed, chewing); in a big window at the RIGHT, the cat, the dog and the pig rest their chins on the sill side by side and quietly watch, a little sheepish (no tears, no frowns). The friends look LEFT at the bread.',
    'a cream kitchen wall, a kraft table, a big cream window frame at the right with an apricot evening sky behind the three friends', ['hen_eat', 'chick_eat', 'cat_peek', 'dog_peek', 'pig_peek'], '7장')
cut('cut_sandwich', 'A BIG sandwich in the middle seen from the side showing its layers (bread, green lettuce, red tomato, yellow cheese, egg slices, bread); around it the red hen, the three chicks, the cat, the dog and the pig all stand and look DOWN at it happily.',
    'a cream kitchen wall, a sky-blue tile band, a kraft table top', ['hen_happy', 'chick_hop', 'cat_stand_help', 'dog_stand_help', 'pig_stand_help', 'prop_sandwich_piece'], '9장 샌드위치판')
cut('cut_pizza', 'A BIG round baked pizza (golden crust, tomato, melted sunny-yellow cheese, honey corn, cut in six) on the table in the middle; around it the red hen, the three chicks, the cat, the dog and the pig all look DOWN at it happily; the oven at the side.',
    'a cream kitchen wall, a sky-blue tile band, a kraft table top, the slate oven at one side', ['hen_happy', 'chick_hop', 'cat_stand_help', 'dog_stand_help', 'pig_stand_help', 'prop_pizza_whole'], '9장 피자판')
cut('cut_pancake', 'A tall stack of golden pancakes with strawberries and banana slices on top and honey dripping down, in the middle on a white plate; around it the red hen, the three chicks, the cat, the dog and the pig all look DOWN at it happily.',
    'a cream kitchen wall, a sky-blue tile band, a kraft table top', ['hen_happy', 'chick_hop', 'cat_stand_help', 'dog_stand_help', 'pig_stand_help', 'prop_pancake_stack'], '9장 팬케이크판')

# ── 표지·끝 그림 ──
def key(pid, frame, scene, refs, out, aspect):
    p = KEY_HEAD + frame + '\n\nSCENE INSIDE THE WINDOW:\n' + scene + '\n\n' + FC + '\n\nMatch the characters in the reference images exactly (same shapes, colours, clothes, markings).\n\n' + KEY_TAIL
    if 'WINDOW' not in frame: p = p.replace('SCENE INSIDE THE WINDOW:', 'SCENE:')
    jobs.append({'id': f'hen_{pid}', 'kind': 'key', 'pass': 5, 'refs': [RAW + f'hen_{r}.png' for r in refs], 'out': out, 'aspect': aspect, 'prompt': p})
WIN = ('FRAME (most important):\nThe whole {asp} canvas is ONE flat sheet of warm cream cardstock (#f5efe9) with fine paper grain. A large window is cut out of it in the shape of a '
       'ROUND LOAF OF BREAD seen from the side (a wide dome with a flat bottom). It is centred horizontally, {pos}. The scene is seen THROUGH this window, built from 3 or 4 layered paper depth planes behind the sheet; '
       'the window edge shows the sheet thickness with a soft inner shadow along the top and inner edges and a light cut edge at the bottom. {rest} '
       'Around the rim, two small flat paper wheat ears overlap the edge at the upper-left and upper-right. Nothing else on the cream sheet.')
key('key_wide', WIN.format(asp='wide 16:9', pos='its flat bottom at about 78% of the height and its height about 70% of the canvas HEIGHT, its width about 1.6 times its height',
                           rest='The lower 22% of the canvas below the window and both side areas are plain empty cream paper (a title is placed there later).'),
    'A golden wheat field on a sunny day, a red barn and a windmill far behind. In the middle, BIG and clearly visible: the red hen in her cream apron and blue headscarf holding a golden loaf of bread proudly, three little yellow chicks at her feet; behind a low fence at the right, the grey striped cat, the tan dog and the pink pig peek over, curious. Richly colourful small paper pieces only at the edges and far back.',
    ['hen_stand', 'hen_bread', 'chick_stand', 'cat_peek', 'dog_peek', 'pig_peek'], 'assets/raw/keyart_gpt/red_hen_wide_v1.png', 'landscape 16:9')
key('key_tall', WIN.format(asp='portrait 3:4', pos='its flat bottom at about 80% of the height, its width about 86% of the canvas width',
                           rest='The lower 20% of the canvas below the window is plain empty cream paper (a title is placed there later).'),
    'Stacked from top to bottom: a windmill on a green hill and a pale sky at the top; in the middle, BIG: the red hen holding a golden loaf of bread; at the bottom, three little yellow chicks among golden wheat ears. Rich colours only at the edges.',
    ['hen_bread', 'chick_stand', 'prop_mill_sails'], 'assets/raw/keyart_gpt/red_hen_tall_v1.png', 'portrait 3:4')
key('key_tile', 'COMPOSITION (most important):\nA landscape 4:3 thumbnail tile, a full-bleed rectangular paper diorama picture (no cream sheet, no window, no border, no frame). Only 2 or 3 flat paper depth planes.',
    'The red hen BIG in the centre-left (her face large and clear) holding a golden loaf of bread, one ripe wheat ear crossing at the right, a pale-sky and spring-green background.',
    ['hen_bread'], 'assets/raw/keyart_gpt/red_hen_tile_v1.png', 'landscape 4:3')
key('back_wide', "COMPOSITION (most important):\nA landscape 3:2 picture. The 'after the story' ending illustration, a full-bleed rectangular paper diorama picture (no cream sheet, no window, no border, no frame). Only 3 or 4 flat paper depth planes.",
    'Under the big tree in the farm yard, at a long table with a blue-checked cloth, the red hen, the three chicks, the cat, the dog and the pig all eat and smile together, cups of milk on the table. Rich colours only at the edges and far back. All faces clearly visible.',
    ['hen_wave', 'chick_hop', 'cat_eat', 'dog_eat', 'pig_eat', 'prop_table_long'], 'assets/raw/keyart_gpt/red_hen_backw_v1.png', 'landscape 3:2')
key('back_tall', "COMPOSITION (most important):\nA portrait 2:3 picture. The 'after the story' ending illustration, a full-bleed rectangular paper diorama picture (no cream sheet, no window, no border, no frame). Only 3 or 4 flat paper depth planes.",
    'Stacked from top to bottom: the leafy crown of the big tree and a peach morning sky; in the middle the red hen waving with the three chicks; at the bottom the cat, the dog and the pig side by side holding pieces of food, smiling. All faces clearly visible.',
    ['hen_wave', 'chick_hop', 'cat_eat', 'dog_eat', 'pig_eat'], 'assets/raw/keyart_gpt/red_hen_backt_v1.png', 'portrait 2:3')

json.dump(jobs, open(os.path.join(G, 'tools/app/gen/jobs_red_hen.json'), 'w'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(jobs), Counter((j['kind'], j['pass']) for j in jobs))
