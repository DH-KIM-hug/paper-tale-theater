#!/usr/bin/env python3
"""이름 설정 2판 G1 — 반대 모습 주인공 그림 작업표 4개를 만든다 (docs/NAME_SETUP_V2_PLAN.md §3·§8 G1).
  python3 tools/app/gen/mk_jobs_look.py            # tools/app/gen/jobs_look_{red_car,unicorn,witch_candy,kkultteok}.json
  python3 tools/app/gen/mk_jobs_look.py --table    # 기획서에 붙일 원본↔새 파일 대응 표(markdown)만 출력

원본 작업표(jobs_<tale>.json)의 프롬프트를 그대로 가져와 인물 설명·참고 그림 문장만 바꾼다. 자세·방향·구도 글은 원본 그대로.
- refs 는 기존 생성 그림만 쓴다(실제 아이 사진 ~/.paper-tale/refs/family 는 절대 넣지 않는다).
- 모든 장에 '머리·몸 크기를 기준 그림과 똑같이, 2.5등신' 과 종이 규칙(1조각 1색·광택 없음·어두운 웜 그림자만)을 넣는다.
- 파일 이름: 기획서 §6 — rc_child_X → rc_childg_X(여), uc_kid2_X → uc_kid2b_X(남), wc_kid_X → wc_kidb_X(남),
  구름 공장 nuna_X → nunab_X(첫째 남), oppa_X → oppag_X(둘째 여), agi_X → agig_X(막내 여). 컷·침대도 같은 자리에 b/g.
  구름 공장 함께 그림(컷 2·침대 2)은 아이 없는 배경판 *_bg 4장 + 누운 자세(원래 모습 3 + 반대 모습 3) 6장으로 층 분리(§3-2 (가)).
생성: python3 tools/app/gen/run_simple.py look_<tale> <id ...>  (파일 순서대로 — 뒤 장이 앞 장을 refs 로 쓴다)"""
import json, os, re, sys
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, os.path.join(G, 'tools'))
from rawpath import raw_exists

def load(t): return {j['id']: j for j in json.load(open(os.path.join(G, f'tools/app/gen/jobs_{t}.json')))}

SIZE_KO = '머리·몸 크기를 기준 그림과 똑같이, 2.5등신'
LOOK_RULES = ('LOOK RULES (opposite-look version of the same role): ' + SIZE_KO + ' — the head width (measured by the width of the hair mass) '
              'and the body size are EXACTLY the same as the first reference; the pose, the facing direction (left/right) and the expression are '
              'EXACTLY the same as the original-look reference; only the hair (and the clothes where this text says so) change. '
              'A generic storybook child, NOT any real child. PAPER RULES: every piece is ONE flat matte colour, NO gloss, NO gradient, NO outer '
              'drop shadow around the figure; depth only by narrow dark warm (#2E241C) layer shadows between stacked pieces.')

# ---------- 대명사 바꾸기 (한 인물만 나오는 글에서만 쓴다) ----------
HIM_NEXT = {'and', 'or', 'to', 'at', 'in', 'on', 'as', 'so', 'with', 'from', 'behind', 'toward', 'towards', 'over', 'under', 'is', 'was', 'a', 'an',
            'the', 'but', 'like', 'that', 'while', 'up', 'down', 'into', 'looking', 'beside', 'around', 'near', 'off', 'out', 'through',
            'across', 'for', 'by', 'of', 'if', 'when', 'too', 'again', 'there', 'here', 'now', 'then', 'go', 'going', 'are', 'has', 'have'}
def to_male(s):
    def rep(m):
        w = m.group(0); lw = w.lower()
        if lw == 'she': r = 'he'
        elif lw == 'herself': r = 'himself'
        elif lw == 'hers': r = 'his'
        else:  # her
            nxt = m.string[m.end():m.end() + 40].lstrip()
            nw = re.match(r'[A-Za-z]+', nxt)
            nwl = nw.group(0).lower() if nw else ''
            r = 'him' if (not nw or nwl in HIM_NEXT or nwl.endswith('ly') or not nxt[:1].isalpha()) else 'his'
        if w.isupper(): return r.upper()
        return r.capitalize() if w[0].isupper() else r
    return re.sub(r'\b(She|she|SHE|Her|her|HER|Herself|herself|Hers|hers)\b', rep, s)
def to_female(s):
    def rep(m):
        w = m.group(0); r = {'he': 'she', 'his': 'her', 'him': 'her', 'himself': 'herself'}[w.lower()]
        return r.capitalize() if w[0].isupper() else r
    return re.sub(r'\b(He|he|His|his|Him|him|Himself|himself)\b', rep, s)

def subj_span(p, head='SUBJECT AND POSE:\n'):
    """프롬프트에서 인물 설명 단락(head 다음 ~ 빈 줄)의 (시작, 끝)"""
    a = p.index(head) + len(head); b = p.index('\n\n', a); return a, b
def edit_subj(p, fn, head='SUBJECT AND POSE:\n'):
    a, b = subj_span(p, head); return p[:a] + fn(p[a:b]) + p[b:]
def must(s, old, new, n=1):
    assert old in s, f'문구 없음: {old[:60]!r}'; return s.replace(old, new, n)
def must_re(s, pat, new, flags=re.S):
    assert re.search(pat, s, flags), f'패턴 없음: {pat[:60]!r}'; return re.sub(pat, lambda m: new, s, count=1, flags=flags)
def job(id, kind, pas, refs, out, prompt, size=(600, 600), aspect=None, note=None, src=None):
    j = {'id': id, 'kind': kind, 'pass': pas, 'refs': refs, 'size': list(size) if size else None, 'out': out, 'prompt': prompt}
    if aspect: j['aspect'] = aspect
    if src: j['src'] = src       # 원본(대응) id — 기획서 표·G3 끼우기용
    if note: j['note'] = note
    return j

TABLES = {}; made = set()   # made: 이 스크립트가 만드는 표에서 앞서 생성되는 그림(다른 표 포함 — 사탕 마녀는 유니콘 남자아이판을 쓴다)
def finish(t, jobs):
    """refs 가 모두 있는지(앞서 만드는 것 포함) 검사하고 저장"""
    bad = []
    for j in jobs:
        for r in j['refs']:
            if '.paper-tale' in r or '/refs/family' in r or r.endswith('.jpg'): bad.append((j['id'], r, '사진 금지'))
            elif not (raw_exists(os.path.join(G, r)) or r in made): bad.append((j['id'], r, '없음'))
        made.add(j['out'])
        for k in ('Dahyun', 'Ihyun', 'Eunwoo'):
            if k in j['prompt']: bad.append((j['id'], k, '이름 남음'))
    assert not bad, bad
    p = os.path.join(G, f'tools/app/gen/jobs_look_{t}.json')
    json.dump(jobs, open(p, 'w'), ensure_ascii=False, indent=1)
    TABLES[t] = [(j.get('src') or '-', j['id'], j['pass'], j['kind'], ', '.join(os.path.basename(r).rsplit('.', 1)[0] for r in j['refs'])) for j in jobs]
    print(t, len(jobs), '장', {k: sum(j['kind'] == k for j in jobs) for k in ('sprite', 'cut', 'scene')})

# ====================================================================================
# 1. 나의 빨간 자동차 — 여자아이판(g). 옷 그대로(노란 티셔츠·파란 반바지), 머리만: 짧은 단발 + 머리핀 1 (§3-5)
# ====================================================================================
def red_car():
    O = load('red_car'); R = 'assets/raw/restyle/red_car/'
    OLD = 'Ihyun, a small child about 4 years old with a gender-neutral look: short straight black hair, a round cream-skinned face,'
    GIRL = ('The GIRL version of this story\'s child (a generic storybook girl, NOT any real child, with a face of her own — not the same face as '
            'any other child in this app): a chin-length straight black BOB with straight bangs cut just above the eyebrows, and ONE small '
            'blush-pink (#F3A9BE) flat paper bow hairpin on the LEFT side of the hair (one matte piece, no gloss), a round cream-skinned face,')
    OLD_REF = ('SAME SCALE AS THE REFERENCE SPRITE: the head, hair and body are exactly the same size and proportions as the child in the '
               'reference image (2.5 heads tall); only the pose changes.')
    REF2 = ('Two reference images: the FIRST shows the GIRL version standing (copy her bob hair, bow hairpin, face, clothes and head size '
            'exactly); the SECOND shows the ORIGINAL boy version of the same role in the exact POSE to copy — copy the pose, facing direction, '
            'hands and expression from it, NOT the hair. SAME SCALE AS THE FIRST REFERENCE (' + SIZE_KO + '): measure by the width of the hair '
            'mass; only the pose and expression change as described. ' + LOOK_RULES)
    REF1 = ('The reference image shows the ORIGINAL boy version of this role in this exact pose: keep the pose, facing direction, hands, body '
            'size, clothes and head size exactly, and draw the GIRL described here (bob hair with the bow hairpin, a face of her own). This is '
            'the REFERENCE POSE for the girl: every other girl picture keeps this exact head and body size. ' + LOOK_RULES)
    jobs = []
    for pose in ['stand', 'eat', 'sleep', 'point', 'run', 'cry', 'turn', 'hug']:
        o = O[f'rc_child_{pose}']; nid = f'rc_childg_{pose}'
        def fix(s):
            s = must(s, OLD, GIRL).replace('Ihyun', 'the girl')
            return s + ' ' + REF1 if pose == 'stand' else must(s, OLD_REF, REF2)
        p = edit_subj(o['prompt'], fix)
        refs = [R + 'rc_child_stand.png'] if pose == 'stand' else [R + 'rc_childg_stand.png', R + f'rc_child_{pose}.png']
        jobs.append(job(nid, 'sprite', 1 if pose == 'stand' else 2, refs, R + nid + '.png', p, o['size'], o.get('aspect'), src=o['id'],
                        note='여자아이판: 옷 그대로, 머리만 단발+머리핀. 기준 자세 rc_childg_stand' if pose == 'stand' else None))
    # 침대 1장(장면 안 침대 자리 덮개)
    o = O['rc_child_bed']; p = o['prompt']
    p = must(p, 'Now Ihyun is IN this bed, sleeping: Ihyun is a small child about 4 years old with a gender-neutral look, short straight black hair, '
             'a round cream-skinned face, a plain mustard-YELLOW short-sleeve t-shirt (reference images 2 and 3 show exactly how Ihyun is drawn).',
             'Now the GIRL is IN this bed, sleeping: she is a small child about 4 years old, a chin-length straight black bob with straight bangs '
             'and ONE small blush-pink (#F3A9BE) flat paper bow hairpin on the left side of the hair, a round cream-skinned face, a plain '
             'mustard-YELLOW short-sleeve t-shirt (reference images 2 and 3 show exactly how the girl is drawn).')
    p = p.replace("Ihyun's", "the girl's").replace('Ihyun', 'the girl')
    p = must(p, 'Draw ONLY the bed', 'Reference image 5 is the ORIGINAL boy version of this exact picture: copy its bed, pillow, blanket, body '
             'bump, arm, toy car, head position and framing EXACTLY; only the child\'s hair (bob + hairpin) and face change. ' + LOOK_RULES + '\nDraw ONLY the bed')
    jobs.append(job('rc_childg_bed', 'sprite', 3, [R + 'rc_ref_bed_crop.png', R + 'rc_childg_stand.png', R + 'rc_childg_sleep.png', R + 'rc_red_run.png',
                                                    R + 'rc_child_bed.png'], R + 'rc_childg_bed.png', p, o['size'], o.get('aspect'), src='rc_child_bed',
                    note='post_red_car_bed.py 와 같은 틀(마젠타 밖 오리지 않음)'))
    # 끝 장면 침대 2장
    for k, refs, pas in (('wide', [R + 'rc_childg_bed.png', R + 'rc_tow_joy.png', R + 'rc_police_run.png', R + 'rc_fire_run.png', R + 'rc_amb_run.png', R + 'rc_bed_wide.png'], 4),
                         ('tall', [R + 'rc_childg_bed.png', R + 'rc_tow_joy.png', R + 'rc_police_run.png', R + 'rc_fire_run.png', R + 'rc_bedg_wide.png', R + 'rc_bed_tall.png'], 5)):
        o = O[f'rc_bed_{k}']; p = o['prompt']
        p = must(p, "Ihyun's bedroom", "the girl's bedroom").replace('Ihyun sleeps', 'The girl sleeps')
        p = must(p, 'Ihyun: a small child about 4 years old, short straight black hair, round cream-skinned face, 2.5 heads tall, exactly as in the reference.',
                 'The girl: a small child about 4 years old, a chin-length straight black bob with straight bangs and ONE small blush-pink (#F3A9BE) '
                 'paper bow hairpin on the left side, round cream-skinned face, 2.5 heads tall, exactly as in the first reference image.')
        p = p.replace("Ihyun's", "the girl's").replace('Ihyun', 'the girl')
        p = must(p, '\n\nSCENE:', ' The LAST reference image is the ORIGINAL version of this exact picture (with the boy): keep the same room, bed, '
                 'window, moon, shoebox garage and the four vehicles in exactly the same places and sizes (the program reads fixed positions from '
                 'this picture); only the child changes (girl: bob hair + hairpin). ' + LOOK_RULES + '\n\nSCENE:')
        jobs.append(job(f'rc_bedg_{k}', 'scene', pas, refs, R + f'rc_bedg_{k}.png', p, None, o['aspect'], src=o['id'], note='post_bed.py 방식(16:9 1600×900 / 2:3 1024×1536)'))
    finish('red_car', jobs)

# ====================================================================================
# 2. 유니콘을 찾아서 — 남자아이판(b). 옷은 꼬마 왕자(§3-5·7-5 확정): 같은 금색 왕관, 흰 셔츠 + 하늘색 반바지 + 짧은 코발트 망토(별 2), 짧은 머리
# ====================================================================================
BOY_FACE = ('short dark-brown hair in a neat boy\'s cut — a short fringe over the forehead, hair above the ears, NOT a bob — pale cream skin, '
            'a simple cut-paper face')
PRINCE = ('He wears a storybook LITTLE PRINCE outfit made of flat paper pieces: a snow-white (#F4F6FA) short-sleeve shirt, sky-blue (#A9D6F5) '
          'shorts ending above the knees, a short cobalt-blue (#3A6FD8) cape hanging from the shoulders to the waist with two small lemon-yellow '
          '(#F6E27F) flat paper star pieces on it (matte, no sparkle), a small marigold (#F2B134) paper crown with three points sitting on top of '
          'the hair (the SAME crown as the girl version), short white socks and small bean-red (#A93B32) shoes. NO pink anywhere. 2.5 heads tall '
          '(big round head, small body), the same head size as the children in this app\'s other stories. Every piece is matte cardstock: NO '
          'glitter, NO foil, NO pearl, NO gradient.')
PRINCE_SHORT = 'the little prince outfit (white shirt, sky-blue shorts, short cobalt cape with two yellow stars, small marigold crown, bean-red shoes)'
def unicorn():
    O = load('unicorn'); R = 'assets/raw/restyle/unicorn/'
    BOY = ('A small BOY (a generic storybook character, NOT any real child; the SAME boy appears in this app\'s Halloween story, so this is his '
           'face): ' + BOY_FACE + '. ' + PRINCE)
    END = r'(?:only the pose(?: and expression)? changes?(?: as described)?\.|\(measure by the (?:head width|width of the hair mass)\)\.)'
    def refs_text(n):
        return {2: 'Two reference images: the FIRST shows the BOY in his little prince outfit standing (copy his hair, face, clothes, crown, cape and head '
                   'size exactly); the SECOND shows the ORIGINAL girl version (princess dress) of the same role in the exact POSE to copy — copy the pose, '
                   'facing direction, hands and expression from it, NOT the hair, NOT the dress.',
                3: 'Three reference images: the FIRST shows the BOY in his little prince outfit standing (copy his hair, face, clothes, crown, cape and '
                   'head size exactly); the SECOND shows the same boy walking in side view facing the RIGHT (copy the side-view body); the THIRD shows '
                   'the ORIGINAL girl version (princess dress) of the same role in the exact POSE to copy — copy the pose, facing direction and expression '
                   'from it, NOT the hair, NOT the dress.',
                4: 'Four reference images: the FIRST shows the BOY in his little prince outfit standing (copy his hair, face, clothes, crown, cape and '
                   'head size exactly); the SECOND shows the same boy walking in side view; the THIRD shows him from the side with his head bowed; the '
                   'FOURTH shows the ORIGINAL girl version (princess dress) of the same role in the exact POSE to copy — copy the pose, facing direction '
                   'and expression from it, NOT the hair, NOT the dress.'}[n] + \
               ' SAME SCALE AS THE FIRST REFERENCE (' + SIZE_KO + '): the head, face, eyes and body are exactly the same size (measure by the width of ' \
               'the hair mass); only the pose and expression change as described. ' + LOOK_RULES
    STAND = ('The reference image shows the ORIGINAL girl version (princess dress) of this role in this exact pose: keep the pose, body size and head '
             'size exactly, but draw the BOY described here — replace the bob with the boy\'s short hair, give him a face of his own (a different child '
             'from the girl), and replace the dress with the little prince outfit. This is the REFERENCE POSE for the boy: every other boy picture keeps '
             'this exact head and body size. ' + LOOK_RULES)
    jobs = []
    poses = {'stand': ([R + 'uc_kid_stand.png'], 1), 'walk': (None, 2), 'sad': (None, 2), 'tired': (None, 2), 'turn': (None, 2), 'hug': (None, 2), 'wave': (None, 2),
             'turn3': ([R + 'uc_kid2b_stand.png', R + 'uc_kid2b_walk.png', R + 'uc_kid2_turn3.png'], 3),
             'turn4': ([R + 'uc_kid2b_stand.png', R + 'uc_kid2b_walk.png', R + 'uc_kid2b_tired.png', R + 'uc_kid2_turn4.png'], 3)}
    for pose, (refs, pas) in poses.items():
        o = O[f'uc_kid2_{pose}']; nid = f'uc_kid2b_{pose}'
        if refs is None: refs = [R + 'uc_kid2b_stand.png', R + f'uc_kid2_{pose}.png']
        if pose == 'stand': refs = [R + 'uc_kid2_stand.png']
        GIRL_BITS = [('we see the back of the dress, the bow and the crown', 'we see the back of the cape, the shirt collar and the crown'),
                     ('(the dress, bow and shoes point LEFT', '(the cape, shorts and shoes point LEFT'),
                     ('One hand rests on her skirt', 'One hand rests on his shorts'),
                     ('her back, the back of her dress, the bow tied at the BACK of her waist', 'his back, the back of his short cape over his white shirt, his sky-blue shorts'),
                     ('the BACK of her brown bob hair (a big rounded brown paper hair shape covering the back of her head)',
                      'the BACK of his short brown hair (a rounded brown paper hair shape covering the back of his head, cut short at the neck)')]
        def fix(s):
            s = must_re(s, r'^A small child named Dahyun.*?NO gradient on the dress\.', BOY)
            for a, b in GIRL_BITS: s = s.replace(a, b)
            if pose == 'stand': s = must_re(s, r'This is the REFERENCE POSE for Dahyun:.*$', STAND)
            else: s = must_re(s, r'(?:Two|One|Three) reference images?.*?' + END, refs_text(len(refs)))
            return to_male(s.replace('Dahyun', 'the boy'))
        p = edit_subj(o['prompt'], fix)
        jobs.append(job(nid, 'sprite', pas, refs, R + nid + '.png', p, o['size'], o.get('aspect'), src=o['id'],
                        note='남자아이판 기준 자세(꼬마 왕자 옷). 사탕 마녀 남자아이판도 이 얼굴을 쓴다' if pose == 'stand' else None))
    DRESS = ('The child Dahyun wears her soft blush-pink (#F3A9BE, NOT hot pink) paper princess dress with the rose bodice and the small marigold '
             'crown exactly as in her reference sprite.')
    CUTNOTE = ('The child is the BOY of this story: ' + BOY_FACE + ', wearing ' + PRINCE_SHORT + ' exactly as in his reference sprite. The LAST reference '
               'image is the ORIGINAL version of this exact panel with the girl: keep the SAME composition, placement, sizes, background, speed strips and '
               'every other character exactly; only the child changes to the boy (short hair, prince outfit). ' + LOOK_RULES)
    cuts = {'sheep_jump': [R + 'uc_sheep_jump.png', R + 'uc_kid2b_stand.png', R + 'uc_prop_cloud.png', R + 'uc_cut2_sheep_jump.png'],
            'thorns': [R + 'uc_deer_hurt.png', R + 'uc_kid2b_stand.png', R + 'uc_prop_thorn.png', R + 'uc_cut2_thorns.png'],
            'turn': [R + 'uc_kid2b_turn.png', R + 'uc_unicorn_stand.png', R + 'uc_cut2_turn.png'],
            'hug': [R + 'uc_kid2b_hug.png', R + 'uc_unicorn_stand.png', R + 'uc_cut2_hug.png']}
    for c, refs in cuts.items():
        o = O[f'uc_cut2_{c}']; nid = f'uc_cut2b_{c}'; p = must(o['prompt'], DRESS, CUTNOTE)
        p = p.replace('the child (bucket hat, overalls)', 'the boy (crown, white shirt, sky-blue shorts, short cobalt cape)')
        assert 'Dahyun' not in p
        jobs.append(job(nid, 'cut', 4, refs, R + nid + '.png', p, o['size'], o['aspect'], src=o['id'], note='post_cuts.py 4:3'))
    for k, refs, pas in (('wide', [R + 'uc_kid2b_stand.png', R + 'uc_unicorn_stand.png', 'assets/v3w/uc_bg2_moon_night.webp', R + 'uc_bed_wide.png'], 5),
                         ('tall', [R + 'uc_kid2b_stand.png', R + 'uc_unicorn_stand.png', R + 'uc_bedb_wide.png', R + 'uc_bed_tall.png'], 6)):
        o = O[f'uc_bed_{k}']; p = o['prompt']
        p = must(p, "Dahyun's bedroom", "the boy's bedroom").replace('Dahyun sleeps', 'The boy (the same boy as the first reference sprite) sleeps')
        p = must(p, 'her hair exactly as in the reference sprite, wearing simple soft blush-pink pyjamas (no crown, the small marigold crown rests on the bedside table)',
                 'his short dark-brown hair and face exactly as in the first reference sprite, wearing simple soft sky-blue (#A9D6F5) pyjamas (no crown, '
                 'no cape; the small marigold crown rests on the bedside table)')
        p = p.replace('the bed with Dahyun', 'the bed with the boy').replace('Dahyun in the bed', 'the boy in the bed'); assert 'Dahyun' not in p
        p = must(p, '\n\nSCENE:', ' The LAST reference image is the ORIGINAL version of this exact picture (with the girl): keep the same room, bed, '
                 'window, hill, small unicorn, moon and the empty patch of sky in exactly the same places and sizes (the program reads fixed positions '
                 'from this picture); only the child changes (boy: short hair, sky-blue pyjamas). ' + LOOK_RULES + '\n\nSCENE:')
        jobs.append(job(f'uc_bedb_{k}', 'scene', pas, refs, R + f'uc_bedb_{k}.png', p, None, o['aspect'], src=o['id'], note='post_bed.py 방식'))
    finish('unicorn', jobs)

# ====================================================================================
# 3. 사탕 마녀의 핼러윈 — 남자아이판(b). 옷(꼬마 마법사) 그대로, 머리만 짧게. 유니콘 남자아이와 같은 얼굴(§3-4). 변신 13·컷 13 은 원본 그림을 refs 로
# ====================================================================================
def witch_candy():
    O = load('witch_candy'); R = 'assets/raw/restyle/witch_candy/'; U = 'assets/raw/restyle/unicorn/'
    OLD = ('A small child named Dahyun (a generic storybook character, NOT any real child): short dark-brown bob hair, pale cream skin, a simple '
           'cut-paper face, 2.5 heads tall (big round head, small body), the same head size as the children in this app\'s other stories. She wears a LITTLE WIZARD outfit')
    BOY = ('A small BOY (a generic storybook character, NOT any real child; the SAME boy as the little prince in this app\'s unicorn story — same face, '
           'same hair): ' + BOY_FACE + ', 2.5 heads tall (big round head, small body), the same head size as the children in this app\'s other stories. '
           'He wears a LITTLE WIZARD outfit')
    TUNIC_OLD = 'a plain warm-sand (#E9DCC0) tunic dress under the cape ending above the knees'
    TUNIC = 'a plain warm-sand (#E9DCC0) wizard tunic (the same loose knee-length garment as in the reference) under the cape ending above the knees'
    REF_OLD = r'The reference image shows Dahyun in her little wizard outfit.*?only the pose and expression change as described\.'
    SCALE = (' SAME SCALE AS THE FIRST REFERENCE (' + SIZE_KO + '): the head, face, eyes and body are exactly the same size (measure by the width of the '
             'hat and hair); only the pose and expression change as described. ' + LOOK_RULES)
    REF2 = ('Two reference images: the FIRST shows the BOY in this little wizard outfit standing (copy his clothes, hat, cape, head size, face and hair '
            'exactly); the SECOND shows the ORIGINAL girl version of this story\'s child in the exact POSE to copy — copy the pose, facing direction, hands, '
            'expression and (for a transformation) every added piece from it, NOT the hair.' + SCALE)
    REF_BAT = ('Three reference images: the FIRST shows the BOY in this little wizard outfit standing (copy his clothes, hat, cape, head size, face and '
               'hair exactly); the SECOND shows the same boy as a bat with the wings UP (copy it exactly, only the wings move); the THIRD shows the ORIGINAL '
               'girl version with the wings DOWN, the exact pose to copy.' + SCALE)
    REF_CUT = ('Three reference images: the FIRST shows the BOY in this wizard outfit standing (copy his clothes, hat, cape, head size, face and hair '
               'exactly); the SECOND shows the sparkle FRAME this picture will be placed into by code (do NOT draw it); the THIRD is the ORIGINAL girl '
               'version of this exact transformation picture — copy its pose, added pieces, sparkle pieces, size and framing EXACTLY; only the hair '
               '(boy\'s short cut) and face change.' + SCALE)
    STAND_OLD = r'The reference image shows the SAME character Dahyun in a different outfit \(a princess dress\).*?this exact head size and body size\.'
    STAND = ('Two reference images: the FIRST shows the SAME boy as a little prince in this app\'s other story — copy his head size, face, eyes, hair and '
             'body proportions EXACTLY, but replace the clothes with the little wizard outfit described here; the SECOND shows the ORIGINAL girl version of '
             'this story\'s child in this wizard outfit in the exact pose to copy — copy the outfit, pose, hands and facing direction from it, NOT the hair, '
             'NOT the face. This is the REFERENCE POSE for the boy in this story: every other boy picture keeps this exact head and body size. ' + LOOK_RULES)
    jobs = []
    def fix_sprite(s, ref):
        s = must(s, OLD, BOY); s = must(s, TUNIC_OLD, TUNIC)
        s = must_re(s, STAND_OLD, STAND) if ref is STAND else must_re(s, REF_OLD, ref)
        return to_male(s.replace('Dahyun', 'the boy'))
    for pose in ['stand', 'walk', 'yuck', 'reach', 'point', 'yum', 'ghost']:
        o = O[f'wc_kid_{pose}']; nid = f'wc_kidb_{pose}'
        refs = [U + 'uc_kid2b_stand.png', R + 'wc_kid_stand.png'] if pose == 'stand' else [R + 'wc_kidb_stand.png', R + f'wc_kid_{pose}.png']
        p = edit_subj(o['prompt'], lambda s: fix_sprite(s, STAND if pose == 'stand' else REF2))
        jobs.append(job(nid, 'sprite', 1 if pose == 'stand' else 2, refs, R + nid + '.png', p, o['size'], o.get('aspect'), src=o['id'],
                        note=('기준 자세. 머리 폭 = 1. 유니콘 남자아이판(uc_kid2b_stand)을 먼저 만들어야 한다' if pose == 'stand' else o.get('note'))))
    for tf in ['strawberry', 'strawberry_ball', 'duck', 'fish', 'frog_jump', 'frog_sit', 'pumpkin', 'bat_up', 'bat_down', 'choco', 'choco_flat', 'kiwi', 'croc']:
        o = O[f'wc_kid_tf_{tf}']; nid = f'wc_kidb_tf_{tf}'
        refs = [R + 'wc_kidb_stand.png', R + 'wc_kidb_tf_bat_up.png', R + 'wc_kid_tf_bat_down.png'] if tf == 'bat_down' else [R + 'wc_kidb_stand.png', R + f'wc_kid_tf_{tf}.png']
        p = edit_subj(o['prompt'], lambda s: fix_sprite(s, REF_BAT if tf == 'bat_down' else REF2))
        jobs.append(job(nid, 'sprite', 3 if tf == 'bat_down' else 2, refs, R + nid + '.png', p, o['size'], o.get('aspect'), src=o['id'],
                        note='변신: 머리 폭 1 그대로(PLAN §3-1). ' + (o.get('note') or '')))
    for c in ['strawberry', 'duck', 'fish', 'frog', 'pumpkin', 'bat', 'choco', 'ghost', 'kiwi', 'croc']:
        o = O[f'wc_cut_tf_{c}']; nid = f'wc_cutb_tf_{c}'
        p = edit_subj(o['prompt'], lambda s: fix_sprite(s, REF_CUT))
        jobs.append(job(nid, 'cut', 3, [R + 'wc_kidb_stand.png', R + 'wc_cut_tf_frame.png', R + f'wc_cut_tf_{c}.png'], R + nid + '.png', p, o['size'], o['aspect'],
                        src=o['id'], note='변신 컷 인물 큰 그림(마젠타). wc_cut_tf_frame 가운데에 코드로 끼움(틀은 아이 없음, 그대로 씀)'))
    BIGNOTE = (' The child is the BOY of this story (' + BOY_FACE + ') in the same wizard outfit. The LAST reference image is the ORIGINAL version of this '
               'exact panel with the girl: keep the SAME composition, placement, sizes, background, lights and every other character (witch, cat, rabbit, '
               'bear, fox) exactly; only the child changes to the boy (short dark-brown hair, a face of his own). ' + LOOK_RULES)
    for c in ['gather', 'parade', 'all_transform']:
        o = O[f'wc_cut_{c}']; nid = f'wc_cutb_{c}'; p = o['prompt']
        p = p.replace('the child Dahyun and her three friends', 'the boy and his three friends').replace('the child Dahyun in her wizard outfit', 'the boy in his wizard outfit').replace('the child Dahyun', 'the boy')
        p = must(p, 'The child Dahyun wears her little wizard outfit exactly as in her reference sprite', 'The boy wears his little wizard outfit exactly as in his reference sprite')
        p = p.replace('leaf cap on her hat, her dress cherry red', 'leaf cap on his hat, his tunic cherry red')
        p = must(p, 'only the pose and expression change. \n\nPANEL BACKGROUND', 'only the pose and expression change.' + BIGNOTE + '\n\nPANEL BACKGROUND')
        assert 'Dahyun' not in p
        jobs.append(job(nid, 'cut', 3, [R + 'wc_kidb_stand.png', R + 'wc_witch_stand.png', R + '_ref_friends_sheet.png', R + f'wc_cut_{c}.png'], R + nid + '.png', p,
                        o['size'], o['aspect'], src=o['id'], note='post_cuts.py 4:3'))
    finish('witch_candy', jobs)

# ====================================================================================
# 4. 구름 공장 — 첫째 남(nunab)·둘째 여(oppag)·막내 여(agig) + 함께 그림 층 분리: 배경판 4 + 누운 자세 6
# ====================================================================================
KK = {  # 인물: (원본 접두어, 새 접두어, 원본 설명 시작 문구, 새 설명, 기준 자세 id, 대명사 함수)
 'nuna': ('nuna', 'nunab',
          'Dahyun, a 4-year-old girl (twin sister of Ihyun, SAME HEIGHT as him): shoulder-length dark hair with straight bangs;',
          'The FIRST child as a BOY (a generic storybook boy, NOT any real child; a face of his own, not the same face as the second child), 4 years old '
          '(twin of the second child, SAME HEIGHT): short dark hair in a neat short crop with a small fringe — short at the sides so the ears show, clearly '
          'different from the second child\'s heavier bowl cut;', 'nuna_lookup_v2', to_male),
 'oppa': ('oppa', 'oppag',
          'Ihyun, a 4-year-old boy (twin brother of Dahyun, SAME HEIGHT as her): dark bowl-cut hair;',
          'The SECOND child as a GIRL (a generic storybook girl, NOT any real child; a face of her own, not the same face as the first child), 4 years old '
          '(twin of the first child, SAME HEIGHT): a chin-length dark BOB with straight bangs — clearly SHORTER than the first child\'s shoulder-length '
          'hair — and ONE small sky-blue (#3E7CB1) flat paper hair clip on the LEFT side;', 'oppa_lookup', to_female),
 'agi': ('agi', 'agig',
         'Eunwoo, a 1–2-year-old toddler (much smaller than the twins, about two-thirds their height): short dark bob with bangs;',
         'The YOUNGEST child as a toddler GIRL, 1–2 years old (a generic storybook toddler, NOT any real child; a face of her own), much smaller than the '
         'twins (about two-thirds their height): a round chin-length dark bob with straight bangs and two tiny wispy side tufts, and ONE small blush-pink '
         '(#F3A9BE) flat paper bow hair clip above the LEFT ear;', 'agi_lookup', to_female)}
KK_POSES = {'nuna': ['lookup', 'back', 'blow', 'clap', 'crouch', 'eek', 'hug', 'jump', 'point', 'run', 'splash', 'tiptoe', 'walk', 'wave', 'whisper'],
            'oppa': ['lookup', 'back', 'clap', 'crouch', 'eek', 'hug', 'jump', 'point', 'press', 'reach', 'run', 'splash', 'tiptoe', 'walk'],
            'agi': ['lookup', 'back', 'clap', 'crouch', 'eek', 'hug', 'jump', 'lookback', 'lookup', 'pet', 'point', 'press', 'run', 'splash', 'tiptoe', 'walk', 'wave']}
LOOKUP_POSE = {'nuna': 'Standing, three-quarter view facing right, looking up at the sky with a curious smile (same height as the twin).',
               'oppa': 'Standing, three-quarter view facing right, looking up at the sky with a curious smile (same height as the twin).',
               'agi': 'Standing, three-quarter view facing right, looking up at the sky with a curious open-mouth smile, arms a little out.'}
LIE_POSE = ('SLEEPING TUCKED IN BED — a separate figure that the program lays over a bedtime picture (the second reference image shows that bedtime '
            'picture: do NOT draw its room, bed, pillows or quilt; it only shows how the children lie). The child is seen from the front, the head upright '
            'and facing the viewer, tilted a tiny bit to one side, eyes closed in two calm sleepy curves, a small peaceful closed-mouth smile, pink cheeks; '
            'the neck and the shoulders of the pajama top show; both arms rest on top of ONE straight horizontal folded sheet strip of paper cream (#F6ECD8) '
            'that runs across the chest, the two small hands lying relaxed on the strip. The strip is about 1.6 times wider than the head; its bottom edge '
            'is cut PERFECTLY STRAIGHT and horizontal and NOTHING is drawn below it (the quilt of the bed picture continues there). NO pillow, NO bed, NO '
            'quilt, NO blanket pattern, NO other object. Head and face the same size as the first reference (measure by the hair width); the figure is '
            'centred and the strip\'s bottom edge is the bottom of the figure.')
def kkultteok():
    O = load('kkultteok'); C = 'assets/raw/char_gpt/kkultteok/'; T = 'assets/raw/cut_gpt/kkultteok/'
    jobs = []
    def subj_fix(s, who, refs_text):
        _, _, old, new, _, pron = KK[who]
        s = must(s, old, new); s = must(s, 'Same child as the reference images.', refs_text)
        return pron(s.replace('Dahyun', 'the first child').replace('Ihyun', 'the second child').replace('Eunwoo', 'the youngest child'))
    def pose_fix(s, who):
        return KK[who][5](s)
    def sprite_prompt(template, who, refs_text, pose_text=None):
        p = edit_subj(template, lambda s: subj_fix(s, who, refs_text), 'SUBJECT:\n')
        a, b = subj_span(p, 'POSE / ACTION:\n'); p = p[:a] + (pose_text if pose_text else pose_fix(p[a:b], who)) + p[b:]
        return p
    # 4-1. 자세 45장 (반대 모습)
    for who in ('nuna', 'oppa', 'agi'):
        opre, npre, _, _, base, _ = KK[who]
        tmpl = O[f'{opre}_walk']['prompt']  # 같은 인물의 원본 프롬프트 틀
        REF1 = ('The reference image shows the ORIGINAL look of this child in this exact pose: keep the pose, facing direction, clothes, body size and head '
                'size exactly; only the hair and the face change to the child described here. This is the REFERENCE POSE for this look: every other picture '
                'of this look keeps this exact head and body size. ' + LOOK_RULES)
        REF2 = ('Two reference images: the FIRST shows this child (the new look) standing and looking up — copy the hair (and the hair clip, if any), face, clothes, head size '
                'and body size exactly; the SECOND shows the ORIGINAL look of the same child in the exact POSE to copy — copy the pose, facing direction, hands '
                'and expression from it, NOT the hair. SAME SCALE AS THE FIRST REFERENCE (' + SIZE_KO + '): measure by the width of the hair mass. ' + LOOK_RULES)
        for pose in dict.fromkeys(KK_POSES[who]):
            nid = f'{npre}_{pose}'
            if pose == 'lookup':
                p = sprite_prompt(tmpl, who, REF1, LOOKUP_POSE[who]); refs = [C + base + '.png']; pas = 1
            else:
                p = sprite_prompt(O[f'{opre}_{pose}']['prompt'], who, REF2); refs = [C + f'{npre}_lookup.png', C + f'{opre}_{pose}.png']; pas = 2
            jobs.append(job(nid, 'sprite', pas, refs, C + nid + '.png', p, (600, 600), None, src=f'{opre}_{pose}',
                            note=('기준 자세(원본 cf4_%s_lookup 에 해당). 머리 폭으로 HT 다시 잼' % opre) if pose == 'lookup' else None))
    # 4-2. 누운 자세 6장 (원래 모습 3 + 반대 모습 3) — 침대 배경판 위에 코드로 얹는다
    for who in ('nuna', 'oppa', 'agi'):
        opre, npre, old, new, base, pron = KK[who]
        tmpl = O[f'{opre}_walk']['prompt']
        LIE_REF = ('Two reference images: the FIRST shows this child standing and looking up — copy the hair, face, clothes (pajama top), head size and body '
                   'size exactly; the SECOND is the bedtime picture this figure will be laid into (for the lying position and the sheet only). ' + LOOK_RULES)
        # 원래 모습
        p = edit_subj(tmpl, lambda s: must(s, 'Same child as the reference images.', LIE_REF), 'SUBJECT:\n')
        a, b = subj_span(p, 'POSE / ACTION:\n'); p = p[:a] + LIE_POSE + p[b:]
        p = p.replace('Dahyun, a 4-year-old girl (twin sister of Ihyun, SAME HEIGHT as him):', 'The FIRST child in the ORIGINAL look (a 4-year-old girl, twin of the second child, SAME HEIGHT; exactly as in the first reference):')
        p = p.replace('Ihyun, a 4-year-old boy (twin brother of Dahyun, SAME HEIGHT as her):', 'The SECOND child in the ORIGINAL look (a 4-year-old boy, twin of the first child, SAME HEIGHT; exactly as in the first reference):')
        p = p.replace('Eunwoo, a 1–2-year-old toddler', 'The YOUNGEST child in the ORIGINAL look (exactly as in the first reference), a 1–2-year-old toddler')
        p = p.replace('(opposite-look version of the same role)', '(same role, original look)')
        jobs.append(job(f'{opre}_lie', 'sprite', 1, [C + base + '.png', T + 'cf4_bed_wide.png'], C + f'{opre}_lie.png', p, (600, 600), None, src='cf4_bed_wide(원래 모습 아이)',
                        note='누운 자세(원래 모습). 침대 배경판 cf4_bed_*_bg 위에 코드로 얹음'))
        # 반대 모습
        p = sprite_prompt(tmpl, who, LIE_REF, LIE_POSE)
        jobs.append(job(f'{npre}_lie', 'sprite', 2, [C + f'{npre}_lookup.png', T + 'cf4_bed_wide.png'], C + f'{npre}_lie.png', p, (600, 600), None, src='cf4_bed_wide(반대 모습 아이)',
                        note='누운 자세(반대 모습)'))
    # 4-3. 배경판 4장 (아이 없음; 강아지·아기 구름은 그대로)
    def moment(p, new):
        a = p.index('MOMENT:\n') + 8; b = p.index('\n\n', a); return p[:a] + new + p[b:]
    PLATE = ('BACKGROUND PLATE — the three children are added later by the program as separate paper figures, so this picture has NO children. '
             'The LAST reference image is the original picture to copy. ')
    KEEP = (' Everything else is copied EXACTLY from that reference picture: the same layout, the same framing, the same sizes, the same colours and the '
            'same position of every piece, so the new picture can replace the old one one-to-one. No people, no child, no face anywhere except the '
            'characters named here. PAPER RULES: every piece ONE flat matte colour, NO gloss, NO gradient, only narrow dark warm (#2E241C) layer shadows.')
    jobs.append(job('cf4_cut_hug_bg', 'cut', 1, [C + 'dog_lookup.png', T + 'cut_hug.png'], T + 'cf4_cut_hug_bg.png',
                    moment(O['cut_hug']['prompt'], PLATE + 'Redraw the reference panel: the same stormy dark-navy paper sky, the same bright yellow lightning '
                           'zigzag and short rain strips, the same house with the lit window at the left, the same hedge, fence and puddled ground — but WITHOUT '
                           'the three children: the centre-left ground where they stood is EMPTY (plain puddled ground, nothing standing there). Keep the small '
                           'dog Kkulddeok at the right exactly as in the reference (same place, size, pose, colours and markings), wagging its tail.' + KEEP),
                    (1600, 900), 'landscape 16:9', src='cf4_cut_hug', note='컷 배경판(아이 없음). 아이 셋은 *_hug 자세를 코드로 얹음. 16:9 그대로(원본 1600×900)'))
    jobs.append(job('cf4_cut_rainbow_bg', 'cut', 1, [C + 'dog_lookup.png', C + 'baby_white.png', T + 'cut_rainbow.png'], T + 'cf4_cut_rainbow_bg.png',
                    moment(O['cut_rainbow']['prompt'], PLATE + 'Redraw the reference panel: the same bright sky, the same huge seven-colour paper rainbow, the '
                           'same soft green hills, bushes, fence, flowers and muddy puddled ground, and the same small pure-white baby cloud beaming at the upper '
                           'right (the baby cloud keeps its happy face: it is a character) — but WITHOUT the three children: the centre-left ground where they '
                           'stood is EMPTY. Keep the dog sniffing the wet ground at the right exactly as in the reference.' + KEEP),
                    (1600, 900), 'landscape 16:9', src='cf4_cut_rainbow', note='컷 배경판(아이 없음). 아이 셋은 *_back(뒷모습) 자세를 코드로 얹음'))
    BEDPLATE = (PLATE + 'Redraw the reference bedtime picture: the same room, the same wide wooden bed, the same THREE pillows side by side at the head of the '
                'bed (pink, blue, purple), the same big patchwork quilt with ONE straight paper-cream (#F6ECD8) folded sheet edge running horizontally across '
                'the whole bed just below the pillows, the same lamp, shelf, curtains, plant and rug, the same window with the full moon in EXACTLY the same '
                'place (NOTHING covers the moon) and the same pale cream wedge of moonlight — but the bed is EMPTY: nobody lies in it, the three pillows are '
                'plain and uncovered, no heads, no faces, no arms, no bumps under the quilt. The small dog Kkulddeok still sleeps curled into a ball on the '
                'quilt at the foot of the bed exactly as in the reference.' + KEEP)
    COMP = {'wide': ' COMPOSITION (16:9): exactly as the last reference image.',
            'tall': ' COMPOSITION (2:3 portrait): exactly as the last reference image (the portrait version); the second reference is the finished landscape plate of the same empty room — same quilt, sheet edge and pillows.'}
    for k, refs in (('wide', [C + 'dog_lookup.png', T + 'cf4_bed_wide.png']), ('tall', [C + 'dog_lookup.png', T + 'cf4_bed_wide_bg.png', T + 'cf4_bed_tall.png'])):
        o = O[f'cf4_bed_{k}']
        jobs.append(job(f'cf4_bed_{k}_bg', 'scene', 1 if k == 'wide' else 2, refs, T + f'cf4_bed_{k}_bg.png', moment(o['prompt'], BEDPLATE + COMP[k]), None, o['aspect'],
                        src=f'cf4_bed_{k}', note='침대 배경판(아이 없음). 누운 자세 *_lie 를 베개 자리에 코드로 얹음. post_bed.py 방식'))
    finish('kkultteok', jobs)

def table_md():
    out = []
    for t, rows in TABLES.items():
        out.append(f'\n**{t}** ({len(rows)}장)\n\n| 원본 | 새 파일(id = assets/v3w/<id>.webp) | pass | kind | refs |\n|---|---|---|---|---|')
        out += [f'| `{a}` | `{b}` | {c} | {d} | {e} |' for a, b, c, d, e in rows]
    return '\n'.join(out)

if __name__ == '__main__':
    red_car(); unicorn(); witch_candy(); kkultteok()
    if '--table' in sys.argv: print(table_md())
