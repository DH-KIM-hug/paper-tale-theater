#!/usr/bin/env python3
"""동화 그림 전체를 사용자 검증 스타일(tools/app/keyart/STYLE_BLOCK_v2.md)로 다시 그린다.
지금 게임 그림(assets/v3w/<이름>.webp)을 참고 이미지로 넣어 같은 인물·자세·방향·구도를 유지하고, 파일 이름과 크기도 그대로 둔다
(→ 게임 코드의 자리·크기가 대부분 그대로 맞는다).

  python3 tools/app/gen/restyle.py build [tale ...]   # tools/app/gen/restyle/jobs_<tale>.json 작업표 만들기
  python3 tools/app/gen/restyle.py run [tale ...]     # Codex(codex exec, image_gen)로 차례로 생성. 한도에 걸리면 풀리는 시각까지 기다렸다 이어 감
  python3 tools/app/gen/restyle.py post <tale>        # 생성본을 오려(인물·소품) 옛 크기에 맞춰 assets/v3w 에 덮어씀 (옛 그림은 assets/raw/old_v3w/)
  python3 tools/app/gen/restyle.py status             # 동화별 진행

상태 파일: tools/app/gen/restyle/status.json  (run 이 갱신: 동화별 done/total, 한도 대기 시각)
원본 생성본: assets/raw/restyle/<tale>/<이름>.png"""
import json, os, re, sys, time, subprocess, datetime, shutil
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
HERE = os.path.join(G, 'tools', 'app', 'gen', 'restyle'); os.makedirs(HERE, exist_ok=True)
V3W = os.path.join(G, 'assets', 'v3w'); RAW = os.path.join(G, 'assets', 'raw', 'restyle'); OLD = os.path.join(G, 'assets', 'raw', 'old_v3w')
STATUS = os.path.join(HERE, 'status.json')
CODEX = os.path.expanduser('~/.npm-global/bin/codex')
PY_PIL = os.path.expanduser('~/.venvs/paper-tale/bin/python')

# 무료 6편 먼저, 그다음 나머지
ORDER = ['rabbit', 'lion_mouse', 'sunmoon', 'turnip', 'goldilocks', 'frog', 'sun_wind', 'fox_crane', 'ant_grasshopper', 'bremen', 'three_pigs',
         'wolf_goats', 'red_hood', 'ugly_duckling', 'magic_jar', 'kongjwi', 'heungbu', 'magpie', 'hansel', 'cinderella']
PREFIX = {'ant_grasshopper': 'ag_', 'bremen': 'br_', 'cinderella': 'cd_', 'fox_crane': 'fc_', 'frog': 'frog_', 'goldilocks': 'gl_', 'hansel': 'hg_',
          'heungbu': 'hb_', 'kongjwi': 'kj_', 'lion_mouse': 'lm_', 'magic_jar': 'mj_', 'magpie': 'mg_', 'rabbit': 'rab_', 'red_hood': 'rh_',
          'sun_wind': 'sw_', 'sunmoon': 'sm_', 'three_pigs': 'tp_', 'turnip': 'tn_', 'ugly_duckling': 'ud_', 'wolf_goats': 'wg_'}
SKIP = re.compile(r'(_old|_bak|_test|_rejected)$')

SB = open(os.path.join(G, 'tools/app/keyart/STYLE_BLOCK_v2.md')).read()
def sec(a, b): i = SB.index(a); return SB[i:SB.index(b, i)].strip()
STYLE, LIGHT = sec('STYLE:', 'LIGHTING:'), sec('LIGHTING:', 'NO list:')
HEAD = 'Hand-cut layered paper art, handcrafted stop-motion paper diorama aesthetic.'
NO = '\n'.join(['NO text.', 'NO photorealism.', 'NO glossy surfaces.', 'NO realistic 3D modeling.', 'NO inflated or rounded forms.', 'NO clay-like volume.',
                'NO gradients.', 'NO painterly rendering.', 'NO airbrushed shading.', 'NO realistic sunlight shadows.', 'NO deep ambient occlusion.',
                'NO thick beveled edges.', 'NO plastic appearance.', 'NO felt or fabric appearance.', 'NO fur-fibre texture.'])
KEEP = ('REFERENCE: The attached reference image is the current artwork. REDRAW it in the paper-art style above while keeping EXACTLY the same '
        'subject, pose, gesture, facing direction (left/right), proportions, colours of clothes and markings, and the same composition and placement '
        'of every element. If a character in the reference has a face, keep a simple cut-paper face (round dot eyes, tiny dot nose, small curved paper-strip mouth, '
        'pale-pink round cheeks). If an OBJECT in the reference has no face, do NOT add a face. Do not add or remove any element.')

def kind_of(name):
    if '_bg' in name: return 'bg'
    if '_cut' in name: return 'cut'
    return 'sprite'

def bg_scene(tale, name):
    """PROMPTS_bg_<tale>.md 에서 같은 이름(`name` 또는 접두어 뺀 이름) 장면의 SCENE 단락을 찾는다"""
    p = os.path.join(G, f'tools/app/keyart/PROMPTS_bg_{tale}.md')
    if not os.path.exists(p): return None
    t = open(p).read(); short = re.sub(r'^[a-z]+_bg_?', '', name)
    for key in (name, short):
        m = re.search(r'\(`' + re.escape(key) + r'`[^)]*\)(.*?)(?=\n## |\Z)', t, re.S)
        if m:
            sc = re.search(r'SCENE:\n(.*?)\n\n', m.group(1), re.S)
            return sc.group(1).strip() if sc else None
    return None

def prompt_for(tale, name, size):
    k = kind_of(name); w, h = size
    if k == 'sprite':
        frame = ('FRAMING:\nSquare 1:1 image. The whole figure is visible and centred, filling about 80% of the frame. Background: a completely flat, uniform, solid '
                 'magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.')
        parts = [HEAD, 'Create ONE character or object sprite, rendered entirely as handcrafted paper art: a figure assembled from individually cut pieces of matte colored cardstock and fine-grain craft paper.',
                 STYLE, KEEP, frame, LIGHT, NO]
    elif k == 'bg':
        sc = bg_scene(tale, name)
        parts = [HEAD, 'Create a wide 16:9 scene, rendered entirely as handcrafted paper art, a carefully assembled paper diorama of individually cut matte cardstock pieces.',
                 STYLE, KEEP.replace('subject, pose, gesture, facing direction (left/right), proportions, colours of clothes and markings, and the same ', 'layout: the same '),
                 ('SCENE NOTES:\n' + sc) if sc else '',
                 'Keep the same open ground areas where characters stand. NO people, NO animals, NO characters, NO faces on objects (unless already a painted part of the reference scenery).',
                 'FRAME:\nNo decorative border. The scene fills the entire frame edge to edge.', LIGHT, NO]
    else:
        parts = [HEAD, f'Create a {"wide 16:9" if w >= h else "tall"} comic-panel moment for a picture book, rendered entirely as handcrafted paper art.', STYLE, KEEP,
                 'FRAME:\nNo border, no speech bubbles, no panel lines, no letters; fills the frame edge to edge.', LIGHT, NO]
    return '\n\n'.join(p for p in parts if p)

def used_names(tale):
    pre = PREFIX[tale]
    names = sorted(f[:-5] for f in os.listdir(V3W) if f.startswith(pre) and f.endswith('.webp') and not SKIP.search(f[:-5]))
    return names

def build(tales):
    from PIL import Image
    for t in tales:
        jobs = []
        for n in used_names(t):
            src = os.path.join(OLD, n + '.webp') if os.path.exists(os.path.join(OLD, n + '.webp')) else os.path.join(V3W, n + '.webp')
            size = Image.open(src).size
            jobs.append({'id': n, 'kind': kind_of(n), 'ref': os.path.relpath(src, G), 'size': size,
                         'out': os.path.relpath(os.path.join(RAW, t, n + '.png'), G), 'prompt': prompt_for(t, n, size)})
        json.dump(jobs, open(os.path.join(HERE, f'jobs_{t}.json'), 'w'), ensure_ascii=False, indent=1)
        print(t, len(jobs), '장', {k: sum(j['kind'] == k for j in jobs) for k in ('bg', 'cut', 'sprite')})

# ───────── 새 프롬프트 방식 (2026-10-17 사용자 선택): 옛 그림을 참고로 쓰지 않는다 ─────────
FACE = ('FACE (characters only): a simple cut-paper face — two round dot eyes, a tiny dot nose, a small curved paper-strip mouth, two round pale-pink paper cheeks. '
        'No realistic eyes, no eyelashes, no glossy highlights. Objects that are not characters have NO face.')
BOILER = [r'Cute, round, friendly[^.]*never scary\.', r'A single flat paper cut-out[^\n]*$', r'Shown whole[^\n]*$', r'A FULL-BLEED sheet[^\n]*$',
          r'A layered paper-cut diorama scene seen straight-on:[^.]*\.[^.]*shadow-box\.', r'Leave the lower middle[^.]*\.', r'Colour mood:[^\n]*$', r'No text, no watermark\.?']
def old_prompts():
    """옛 GPU 작업표들(tools/gpu_night/**/jobs_*.json)에서 이름 → 설명. 나중에 만든 파일이 앞의 것을 덮는다"""
    import glob
    files = sorted(glob.glob(os.path.join(G, 'tools/gpu_night/jobs_*.json')) + glob.glob(os.path.join(G, 'tools/gpu_night/*/jobs_*.json')), key=os.path.getmtime)
    out = {}
    for f in files:
        try: d = json.load(open(f))
        except Exception: continue
        for j in (d if isinstance(d, list) else d.get('jobs', [])):
            if isinstance(j, dict) and j.get('name') and j.get('prompt'):
                p = j['prompt']; i = p.find('never colored.'); t = p[i + 14:] if i > 0 else p
                t = re.sub(r'Palette:[^.]*\.(\s*[A-Z][^.]{0,60}\.)?', '', t)
                for b in BOILER: t = re.sub(b, '', t, flags=re.M | re.S)
                t = re.sub(r'\s+', ' ', t).strip()
                m = re.search(r'Scene:\s*(.*)', t)
                out[j['name']] = (m.group(1) if m else t).strip()
    return out
def char_key(tale, name):
    """같은 인물끼리 묶는 열쇠: 접두어 뒤 첫 낱말 (rab_rabbit_run → rabbit, frog_mom_dizzy → mom)"""
    rest = name[len(PREFIX[tale]):]
    rest = re.sub(r'nf$', '', rest)
    toks = re.split(r'_', rest)
    # 묶음용 앞말(관객 aud, 아이콘, 악기 ins, 카드, 입 mouth 등)이면 둘째 낱말까지 봐야 서로 다른 인물·물건이 섞이지 않는다
    if len(toks) > 1 and (len(toks[0]) <= 3 or toks[0] in ('icon', 'card', 'mouth', 'plate', 'bed', 'chair', 'kkul', 'lamp', 'store', 'gourd2', 'print', 'prop', 'item', 'face', 'bowl', 'cup')):
        return toks[0] + '_' + re.sub(r'\d+$', '', toks[1])
    return toks[0]
def bg_section(tale, name):
    """PROMPTS_bg_<tale>.md 에서 이 배경의 전체 프롬프트(코드 블록)를 찾는다"""
    p = os.path.join(G, f'tools/app/keyart/PROMPTS_bg_{tale}.md')
    if not os.path.exists(p): return None
    t = open(p).read(); short = re.sub(r'^[a-z]+_bg_?', '', name); short2 = re.sub(r'(nf|\d+|_v\d)$', '', short)
    for key in (name, short, short2):
        m = re.search(r'\(`' + re.escape(key) + r'`[^)]*\)(.*?)(?=\n## |\Z)', t, re.S)
        if m:
            b = re.search(r'```\n(.*?)```', m.group(1), re.S)
            if b: return b.group(1).strip()
    return None
def new_prompt(tale, name, kind, desc, size):
    w, h = size
    if kind == 'bg':
        sec_ = bg_section(tale, name)
        if sec_: return sec_
        return '\n\n'.join([HEAD, 'Create a wide 16:9 scene, rendered entirely as handcrafted paper art, a carefully assembled paper diorama of individually cut matte cardstock pieces.', STYLE,
                            'SCENE:\nBuild the scene from layered flat paper sheets, each a flat shape cut from cardstock. ' + desc + '\nThe lower third of the frame remains mostly open ground so characters can stand there later. NO people, NO animals, NO characters.',
                            'FRAME:\nNo decorative border. The scene fills the entire frame edge to edge.', LIGHT, '\n'.join(['NO people.', 'NO animals.', 'NO faces on objects.']) + '\n' + NO])
    if kind == 'cut':
        return '\n\n'.join([HEAD, f'Create a {"wide 16:9" if w >= h else "tall"} comic-panel moment for a picture book, rendered entirely as handcrafted paper art: every element is cut from matte colored cardstock and fine-grain craft paper.',
                            STYLE, 'MOMENT:\n' + desc, FACE, 'If reference images are attached, they show the characters: match their shapes, colours, clothes and markings exactly.',
                            'FRAME:\nNo border, no speech bubbles, no panel lines, no letters; fills the frame edge to edge. The panel background is the scene itself (sky, ground, burst strips) — NEVER a plain magenta or chroma-key background.', LIGHT, NO])
    return '\n\n'.join([HEAD, 'Create ONE character or object sprite, rendered entirely as handcrafted paper art: a figure assembled from individually cut pieces of matte colored cardstock and fine-grain craft paper.',
                        STYLE, 'SUBJECT AND POSE:\n' + desc, FACE, 'If a reference image is attached, it shows how this character (or this family of objects) is drawn in this exact style: keep the same drawing style, body shapes, face and proportions; take the COLOURS, clothes, markings and POSE from the SUBJECT text above when it says so.',
                        'FRAMING:\nSquare 1:1 image. The whole figure is visible and centred, filling about 80% of the frame. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.',
                        LIGHT, NO])
# 옛 작업표에 설명이 없던 그림: 새로 쓴 설명 (옛 그림은 참고로 넣지 않는다)
GOLDI = 'Goldilocks: a little girl with curly golden-yellow hair and a red bow, a red dress with a cream apron and cream collar, brown shoes.'
TRAV = 'The traveller: a boy with messy brown hair, a long red coat with gold buttons, a green shirt and brown trousers.'
DESC_EXTRA = {
 'ag_card_autumn': 'A season picture card: a rounded-rectangle frame of warm gold cardstock with a plain cream strip at the bottom; inside the frame an AUTUMN landscape — two round orange and brown trees, falling leaves, golden grass, a pale peach sky with a small sun.',
 'ag_card_spring': 'A season picture card: a rounded-rectangle frame of warm gold cardstock with a plain cream strip at the bottom; inside the frame a SPRING landscape — a tree covered in pink blossoms, fresh green hills, small flowers, a pale blue sky.',
 'ag_card_summer': 'A season picture card: a rounded-rectangle frame of warm gold cardstock with a plain cream strip at the bottom; inside the frame a SUMMER landscape — two big round dark-green trees, green hills, a bright blue sky with a small sun.',
 'ag_card_winter': 'A season picture card: a rounded-rectangle frame of warm gold cardstock with a plain cream strip at the bottom; inside the frame a WINTER landscape — white snowy hills, bare twigs, falling snow, a pale grey sky.',
 'ag_hopper_hat': 'A knitted winter beanie hat: cream knit body with vertical rib lines, a dark purple folded band, a round cream pompom on top, slightly tilted.',
 'ag_store10': 'A wooden food storage board for ants: a dark brown wooden frame with TEN empty square compartments in two columns and five rows, and a small blank wooden label plaque on top.',
 'fc_crane_body': 'The crane BODY ONLY (no neck, no head): a round white body, black tail feathers at the right, two thin black legs; the body faces LEFT and the neck would attach at the upper left.',
 'fc_crane_head': 'The crane NECK AND HEAD ONLY: a long curved black neck, a white face with a red cap, a long thin yellow beak pointing LEFT.',
 'fc_mouth_butterfly': 'A close-up of a butterfly face, front view: a brown body, two curly antennae, round eyes, small smile, big orange wings behind.',
 'fc_mouth_crane': 'A close-up of a crane head, side view facing LEFT: black neck, white face, red cap, a very long thin yellow beak pointing left.',
 'fc_mouth_duck': 'A close-up of a white duck head, three-quarter view facing LEFT, with a flat orange bill pointing left.',
 'fc_mouth_fox': 'A close-up of an orange fox head facing LEFT, eyes closed happily, a pink tongue licking out of its mouth.',
 'fc_plate_empty': 'A wide, flat, shallow cream plate with a gold rim, seen slightly from above (an oval).',
 'fc_plate_soup': 'Only a flat oval of warm orange soup (the soup surface that sits inside a flat plate), no plate.',
 'gl_bed_big_blanket': 'A big flat sage-green blanket for papa bear\'s bed: a rectangle with a folded-over top band.',
 'gl_bed_mid_blanket': 'A medium orange quilted blanket for mama bear\'s bed: a rectangle with rows of round quilted bumps and a folded top band.',
 'gl_bed_small_blanket': 'A small narrow yellow blanket with red horizontal stripes for baby bear\'s bed.',
 'gl_bowl_empty': 'An EMPTY cream porridge bowl with one red band around it, seen slightly from above so the empty inside shows.',
 'gl_chair_small_back': 'The BACKREST piece only of baby bear\'s small wooden chair: a yellow rounded rectangle with two short posts below it.',
 'gl_chair_small_legL': 'The LEFT LEG piece only of baby bear\'s small yellow wooden chair: one straight leg with a short crossbar to the right.',
 'gl_chair_small_legR': 'The RIGHT LEG piece only of baby bear\'s small yellow wooden chair: one straight leg with a short crossbar to the left.',
 'gl_chair_small_seat': 'The SEAT piece only of baby bear\'s small yellow wooden chair: a flat yellow seat slab with two small tabs on top.',
 'gl_goldi_lie': GOLDI + ' Standing straight and still, front view, hands folded in front of her apron, eyes open, calm smile (this picture is laid down in a bed by the game).',
 'gl_goldi_lie_sleep': GOLDI + ' Standing straight and still, front view, hands folded in front of her apron, eyes CLOSED asleep, peaceful (this picture is laid down in a bed by the game).',
 'gl_goldi_pick': GOLDI + ' Bending forward facing RIGHT, one hand reaching down to pick something up, curious face.',
 'gl_goldi_side': GOLDI + ' Lying on her side horizontally, head on the LEFT, feet on the right, eyes open.',
 'gl_goldi_side_sleep': GOLDI + ' Lying on her side horizontally, head on the LEFT, feet on the right, eyes CLOSED asleep.',
 'gl_goldi_walk_empty': GOLDI + ' Walking toward the viewer, empty hands swinging, happy.',
 'hb_gourd2_closed': 'A big whole pale-cream bottle gourd (bak) with a short brown stem and a curly tendril on top.',
 'hb_gourd2_open': 'The same big pale-cream gourd split into two halves lying side by side, showing the cream inside and a few seeds.',
 'hb_gourd2_vine': 'A gourd vine growing upward: a thin brown winding stem with big rounded sage-green leaves and a few small white flowers.',
 'lm_cut_paw4': 'A big friendly golden lion with an orange mane lying relaxed in the savanna grass, a tiny grey mouse standing beside its front paw, acacia trees and golden grass behind.',
 'lm_sun': 'A plain flat pale-cream sun disc (a circle of paper), no face.',
 'sw_shirt': 'A plain green short-sleeved shirt laid flat, front view.',
 'sw_trav_walk_nohat': TRAV + ' Standing facing the viewer, shivering with cold, teeth clenched, no hat.',
 'sm_boy_face': 'A close-up of a little boy\'s face only (round head, no body): black bowl haircut with bangs, big happy open smile, front view.',
 'sm_cut_roar_night': 'A friendly orange tiger roaring loudly on a mountain path at night under a big pale full moon, dark blue layered hills, flat paper speed-line strips behind it (funny, not scary).',
 'sm_girl_face': 'A close-up of a little girl\'s face only (round head, no body): brown hair in two pigtails with bangs, gentle smile, front view.',
 'sm_kkul_green': 'One dome-shaped Korean rice cake (half sphere) of pastel green, with a slightly darker thin layer at its base. No face.',
 'sm_kkul_pink': 'One dome-shaped Korean rice cake (half sphere) of pastel pink, with a slightly darker thin layer at its base. No face.',
 'sm_kkul_purple': 'One dome-shaped Korean rice cake (half sphere) of pastel lavender, with a slightly darker thin layer at its base. No face.',
 'sm_kkul_white': 'One dome-shaped Korean rice cake (half sphere) of creamy white, with a slightly darker thin layer at its base. No face.',
 'sm_kkul_yellow': 'One dome-shaped Korean rice cake (half sphere) of pastel yellow, with a slightly darker thin layer at its base. No face.',
 'sm_lamp_flame': 'A single flame: an orange teardrop-shaped flame with a cream inner flame. It is an OBJECT: NO face, NO eyes, NO mouth, NO cheeks.',
 'sm_lamp_off': 'A small Korean clay oil lamp bowl with a lid on a simple wooden stand with four legs, unlit.',
 'sm_lamp_on': 'The same small Korean clay oil lamp on its wooden stand, with a small orange flame burning on top.',
}
# 다른 동화의 강아지도 구름 공장 꿀떡이처럼 (생김새 설명 + 꿀떡이 새 그림을 참고로)
KKUL = ('The dog looks EXACTLY like Kkulddeok in the reference image: a small cheerful dog, white coat with light tan patches on both floppy ears and a few faint tan spots '
        'on the back, dark nose, a blue harness with white buckles.')
KKUL_REF = 'assets/raw/char_gpt/kkultteok/dog_lookup.png'
def is_dog(name): return bool(re.search(r'(^|_)dog(\d|_|$)', name[name.index('_') + 1:] if '_' in name else name))

def build2(tales):
    from PIL import Image
    OP = old_prompts()
    for t in tales:
        names = used_names(t); jobs = []; groups = {}
        for n in names:
            if kind_of(n) == 'sprite': groups.setdefault(char_key(t, n), []).append(n)
        # 기본 그림: 서 있기·걷기 같은 보통 자세를 먼저 (헤엄·잠 같은 특별한 자세가 기본이 되면 다른 자세가 모두 그 모양을 따라간다)
        pref = lambda x: (0 if re.search(r'(stand|idle|base|front|walk)', x) else 1 if not re.search(r'(swim|sleep|lie|fall|cry|run|dizzy|hurt|flat)', x) else 2, len(x), x)
        base = {k: sorted(v, key=pref)[0] for k, v in groups.items()}
        main = [base[k] for k, v in sorted(groups.items(), key=lambda kv: -len(kv[1]))[:3]]
        for n in names:
            src = os.path.join(OLD, n + '.webp') if os.path.exists(os.path.join(OLD, n + '.webp')) else os.path.join(V3W, n + '.webp')
            size = Image.open(src).size; k = kind_of(n); desc = DESC_EXTRA.get(n) or OP.get(n) or OP.get(re.sub(r'(nf|2|v2)$', '', n))
            out = os.path.relpath(os.path.join(RAW, t, n + '.png'), G)
            if not desc and not (k == 'bg' and bg_section(t, n)):
                jobs.append({'id': n, 'kind': k, 'pass': 1, 'refs': [os.path.relpath(src, G)], 'size': size, 'out': out, 'prompt': prompt_for(t, n, size), 'mode': 'ref'}); continue
            refs, ps = [], 1
            if k == 'sprite' and base.get(char_key(t, n)) != n:
                refs, ps = [os.path.relpath(os.path.join(RAW, t, base[char_key(t, n)] + '.png'), G)], 2
            if k == 'cut':  # 컷 설명에 나오는 인물의 기본 그림만 참고로 (없으면 가장 많이 나오는 인물 둘)
                low = (desc or '').lower() + ' ' + n.lower()
                hit = [base[ck] for ck in base if len(ck) > 2 and re.search(r'\b' + re.escape(ck) + r's?\b', low) and ck not in ('ins', 'icon', 'aud', 'finish', 'prop', 'item', 'ui')][:3] or main[:2]
                refs, ps = [os.path.relpath(os.path.join(RAW, t, b + '.png'), G) for b in hit], 2
            if is_dog(n) and k == 'sprite':  # 강아지 = 꿀떡이
                desc = KKUL + ' ' + re.sub(r'(?i)\bthe dog:[^.]*\.', '', desc or ''); refs = [KKUL_REF] + refs
            elif k == 'cut' and re.search(r'\bdog\b|puppy', (desc or ''), re.I):
                desc = (desc or '') + ' ' + KKUL; refs = refs + [KKUL_REF]
            jobs.append({'id': n, 'kind': k, 'pass': ps, 'refs': refs, 'size': size, 'out': out, 'prompt': new_prompt(t, n, k, desc or '', size), 'mode': 'new'})
        json.dump(jobs, open(os.path.join(HERE, f'jobs_{t}.json'), 'w'), ensure_ascii=False, indent=1)
        print(t, len(jobs), '장', '새 설명', sum(j['mode'] == 'new' for j in jobs), '참고 방식', sum(j['mode'] == 'ref' for j in jobs), '2단계', sum(j['pass'] == 2 for j in jobs))

def load_status():
    try: return json.load(open(STATUS))
    except Exception: return {}
def save_status(s): json.dump(s, open(STATUS, 'w'), ensure_ascii=False, indent=1)

LIMIT_RE = re.compile(r'(usage limit|rate limit|limit reached|too many requests|quota|try again (?:at|in))', re.I)
def wait_until(text):
    """한도 메시지에서 풀리는 시각을 읽는다. 못 읽으면 30분 뒤"""
    now = datetime.datetime.now()
    m = re.search(r'resets_at\\?"?:\s*(\d{10})', text)  # 429 응답 JSON 의 resets_at (유닉스 초)
    if m: return datetime.datetime.fromtimestamp(int(m.group(1))) + datetime.timedelta(minutes=2)
    m = re.search(r'try again in\s+(?:(\d+)\s*(?:days?|d))?\s*(?:(\d+)\s*(?:hours?|h))?\s*(?:(\d+)\s*(?:minutes?|min|m))?', text, re.I)
    if m and any(m.groups()):
        d, h, mi = (int(x or 0) for x in m.groups()); return now + datetime.timedelta(days=d, hours=h, minutes=mi + 2)
    m = re.search(r'try again at\s+([^\n.]+)', text, re.I)
    if m:
        s = m.group(1).strip()
        for fmt in ('%I:%M %p', '%H:%M', '%b %d, %Y %I:%M %p', '%B %d, %Y %I:%M %p', '%b %d %I:%M %p', '%Y-%m-%d %H:%M'):
            try:
                tt = datetime.datetime.strptime(re.sub(r'(st|nd|rd|th),', ',', s)[:len(datetime.datetime.now().strftime(fmt)) + 6].strip(), fmt)
                if tt.year == 1900: tt = tt.replace(year=now.year, month=now.month, day=now.day)
                if tt < now: tt += datetime.timedelta(days=1)
                return tt + datetime.timedelta(minutes=2)
            except Exception: pass
    return now + datetime.timedelta(minutes=30)

def job_refs(job):
    return [r for r in (job.get('refs') or ([job['ref']] if job.get('ref') else [])) if os.path.exists(os.path.join(G, r))]

def gen_one(job, log):
    out = os.path.join(G, job['out']); os.makedirs(os.path.dirname(out), exist_ok=True)
    aspect = 'square 1:1' if job['kind'] == 'sprite' else ('landscape 16:9' if job['size'][0] >= job['size'][1] else 'portrait 3:4')
    pf = os.path.join(HERE, f"_prompt_{job['id']}.txt"); open(pf, 'w').write(job['prompt'])  # 작업마다 따로 (실행기 둘이 같은 파일을 덮어쓰던 것)
    inst = (f"Use your image generation tool (image_gen.imagegen) to create ONE image, {aspect}. Read the full prompt from the file {pf} and pass it VERBATIM. "
            + (f"Pass these reference images in referenced_image_paths (read-only): {' '.join(os.path.join(G, r) for r in job_refs(job))} . " if job_refs(job) else '')
            + f"Save (copy) the generated image to {out} . "
            "Do not modify any other file, do not install anything, do not run git. Reply with only: SAVED <path> <width>x<height>, or FAILED <reason verbatim>.")
    try:
        r = subprocess.run([CODEX, 'exec', '-s', 'workspace-write', '--skip-git-repo-check', '-C', G, inst], capture_output=True, text=True, timeout=900)
        txt = (r.stdout or '') + '\n' + (r.stderr or '')
    except subprocess.TimeoutExpired:
        txt = 'TIMEOUT (codex exec 15분 무응답)'  # 실행기가 멈추지 않게 실패 한 번으로
    open(log, 'a').write(f"\n===== {datetime.datetime.now():%m-%d %H:%M} {job['id']}\n{txt[-1500:]}\n")
    try: os.remove(pf)
    except OSError: pass
    if os.path.exists(out): return 'ok', txt
    if LIMIT_RE.search(txt): return 'limit', txt
    return 'fail', txt

def run(tales):
    log = os.path.join(HERE, 'run.log')
    for t in tales:
        jp = os.path.join(HERE, f'jobs_{t}.json')
        if not os.path.exists(jp): build([t])
        jobs = json.load(open(jp)); fails = {}
        while True:
            todo = [j for j in jobs if not os.path.exists(os.path.join(G, j['out'])) and fails.get(j['id'], 0) < 3]
            todo.sort(key=lambda j: j.get('pass', 1))  # 인물 기본 그림(1단계) 먼저, 그다음 그 그림을 참고하는 자세·컷
            st = load_status(); st[t] = {'done': len(jobs) - len([j for j in jobs if not os.path.exists(os.path.join(G, j['out']))]), 'total': len(jobs), 'state': 'running'}; save_status(st)
            if not todo: break
            j = todo[0]
            res, txt = gen_one(j, log)
            if res == 'limit':
                until = wait_until(txt); st = load_status(); st['_wait_until'] = until.strftime('%Y-%m-%d %H:%M'); st.setdefault(t, {})['state'] = 'waiting-limit'; save_status(st)
                print(f'{datetime.datetime.now():%H:%M} 한도 → {until:%m-%d %H:%M} 까지 대기', flush=True)
                time.sleep(min(60 * 60, max(60, (until - datetime.datetime.now()).total_seconds())))  # 안내보다 일찍 풀릴 수 있어 1시간마다 다시 시도
                st = load_status(); st.pop('_wait_until', None); save_status(st)
            elif res == 'fail':
                fails[j['id']] = fails.get(j['id'], 0) + 1; print('실패', j['id'], fails[j['id']], flush=True); time.sleep(20)
            else:
                print(f'{datetime.datetime.now():%H:%M} ok {t}/{j["id"]}', flush=True)
        st = load_status(); st.setdefault(t, {})['state'] = 'generated'; st[t]['failed'] = [k for k, v in fails.items() if v >= 3]; save_status(st)
        print('동화 완료', t, flush=True)

def post(tale):
    """생성본 → assets/v3w (옛 크기 그대로, 옛 그림은 old_v3w 로)"""
    jobs = json.load(open(os.path.join(HERE, f'jobs_{tale}.json'))); os.makedirs(OLD, exist_ok=True)
    tmp = os.path.join(RAW, tale + '_key'); os.makedirs(tmp, exist_ok=True)
    code = r'''
import sys, json
from PIL import Image
src, dst, kind, w, h = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5])
im = Image.open(src)
if kind == 'sprite':
    im = im.convert('RGBA')
    # 방향 맞추기: 옛 그림과 실루엣이 좌우 반대면 뒤집는다 (게임 코드가 그림이 보는 쪽을 가정한다)
    old = sys.argv[6] if len(sys.argv) > 6 else ''
    if old:
        import os
        if os.path.exists(old):
            def mask(x):
                a = x.convert('RGBA').getchannel('A'); bb = a.getbbox() or (0, 0, 1, 1); return a.crop(bb).resize((96, 96))
            mo, mn = mask(Image.open(old)), mask(im)
            def sim(a, b):
                pa, pb = list(a.getdata()), list(b.getdata()); return sum(1 for x, y in zip(pa, pb) if (x > 128) == (y > 128)) / len(pa)
            if sim(mo, mn.transpose(Image.FLIP_LEFT_RIGHT)) > sim(mo, mn) + .03: im = im.transpose(Image.FLIP_LEFT_RIGHT); print('flip', dst)
    s = min(w / im.width, h / im.height); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
else:
    im = im.convert('RGB'); r = w / h
    if abs(im.width / im.height - r) > .01:  # 옛 비율에 맞춰 가운데를 자른다
        if im.width / im.height > r: nw = round(im.height * r); im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
        else: nh = round(im.width / r); im = im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))
    im = im.resize((w, h), Image.LANCZOS)
im.save(dst, quality=88 if kind == 'sprite' else 86, method=6)
'''
    n = 0
    for j in jobs:
        src = os.path.join(G, j['out'])
        if not os.path.exists(src): continue
        name = j['id']; v = os.path.join(V3W, name + '.webp'); o = os.path.join(OLD, name + '.webp')
        if not os.path.exists(o) and os.path.exists(v): shutil.copy2(v, o)
        if j['kind'] == 'sprite':
            k = os.path.join(tmp, name + '.png')
            subprocess.run([PY_PIL, os.path.join(G, 'tools/gpu_night/chromakey.py'), src, k, '6'], check=True, capture_output=True)
            src = k
        r = subprocess.run([PY_PIL, '-c', code, src, v, j['kind'], str(j['size'][0]), str(j['size'][1]), o], check=True, capture_output=True, text=True)
        if r.stdout.strip(): print(r.stdout.strip())
        n += 1
    st = load_status(); st.setdefault(tale, {})['state'] = 'posted'; save_status(st)
    print(tale, '적용', n, '장')

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'; args = sys.argv[2:]
    if cmd == 'build': build(args or ORDER)
    elif cmd == 'build2': build2(args or ORDER)
    elif cmd == 'run': run(args or ORDER)
    elif cmd == 'post': post(args[0])
    else: print(json.dumps(load_status(), ensure_ascii=False, indent=1))
