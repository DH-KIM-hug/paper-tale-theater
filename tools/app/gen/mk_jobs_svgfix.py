#!/usr/bin/env python3
"""SVG(코드 도형) 그림 → 생성 그림 작업표 (2026-10-29 사용자 지시 '코드 SVG 그림 전부 이미지로').
  python3 tools/app/gen/mk_jobs_svgfix.py  → tools/app/gen/jobs_svgfix.json
프롬프트 틀은 jobs_witch_candy.json 의 소품(sprite) 프롬프트를 그대로 쓰고 SUBJECT 만 바꾼다.
refs 는 그 동화의 기존 소품 webp 를 png 로 바꿔 assets/raw/restyle/svgfix/refs/ 에 둔 것(같은 동화 그림체 맞춤)."""
import json, os, glob
from PIL import Image
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
RAW = 'assets/raw/restyle/svgfix'
base = next(x for x in json.load(open(f'{G}/tools/app/gen/jobs_witch_candy.json')) if x['id'] == 'wc_prop_invite')['prompt']
HEAD, rest = base.split('SUBJECT AND POSE:\n', 1)
TAIL = rest[rest.index('\n\nThis is an OBJECT'):]
TAIL_CHAR = rest[rest.index('\n\nIf a reference image'):]
bgj = next(x for x in json.load(open(f'{G}/tools/app/gen/jobs_witch_candy.json')) if x['kind'] == 'bg')
def ref(name):
    src = f'{G}/assets/v3w/{name}.webp'; dst = f'{G}/{RAW}/refs/{name}.png'
    if not os.path.exists(dst): Image.open(src).save(dst)
    return f'{RAW}/refs/{name}.png'
jobs = []
def add(id, subject, refs=(), face=False, size=(600, 600)):
    jobs.append({'id': id, 'kind': 'sprite', 'pass': 1, 'refs': [ref(r) for r in refs], 'size': list(size), 'out': f'{RAW}/{id}.png',
                 'final': f'assets/v3w/{id}.webp', 'prompt': HEAD + 'SUBJECT AND POSE:\n' + subject + (TAIL_CHAR if face else TAIL)})
# ── 공용 ──
add('cm_dizzy_stars', 'An OBJECT: THREE small chunky five-point paper stars in straw gold (#D9A94E), lemon (#F6E27F) and persimmon (#E8703A), arranged in a gentle flat arc like a little crown of "dizzy" stars, touching nothing, evenly spaced. Each star is one flat piece with softly rounded points.')
add('cm_note', 'An OBJECT: ONE chunky MUSIC NOTE (a single eighth note: round filled head, straight stem, one small flag) cut from one piece of deep-indigo (#1F2A56) paper with a tiny cream (#F6ECD8) highlight dot on the head. Shown alone, upright.')
add('cm_badge_plate', 'An OBJECT: an EMPTY round paper badge: a cream (#F6ECD8) disc mounted on a slightly larger straw-gold (#D9A94E) disc so a gold rim shows all around. The cream centre is completely plain and empty (a number or picture is placed on it later). 2 pieces, flat front view.')
add('cm_drop', 'An OBJECT: ONE paper WATER DROP (teardrop shape, pointed top, round bottom) cut from sky-blue (#3E7CB1) paper with one small pale-blue (#A9CBE6) highlight piece on its upper left. 2 pieces.')
add('cm_chain', 'An OBJECT: a short vertical CHAIN of five chunky oval links cut from straw-gold (#D9A94E) paper, hanging straight down, each link a flat paper ring overlapping the next. Long and narrow.', size=(300, 900))
# ── 동화별 ──
T = []
add('sm_tiger_shadow', 'An OBJECT: the dark SHADOW SILHOUETTE of a tiger standing on its hind legs and leaning forward with one paw raised, as it would appear cast on a paper sliding door: ONE single flat piece of very dark warm brown (#3A2A22) paper, no inner details, no face, no stripes, only the outline shape (ears, paw, tail).', ['sm_oil'])
add('sm_oil_stream', 'An OBJECT: a long, narrow, wavy vertical STREAM of sesame oil running down, cut from glossless amber-gold (#D9A94E) paper with a slightly lighter (#F2C46D) inner strip, ending in two small round drops at the bottom. Tall and thin.', ['sm_oil'], size=(300, 900))
add('sm_axe_mark', 'An OBJECT: ONLY a small axe NOTCH shape on its own, NOT a tree, NOT a trunk, NO bark around it: a single sideways V-shaped wedge (like a "<" opening to the right) cut from pale raw-wood (#E9CFA0) paper with a thin dark brown (#6B4A32) inner shadow strip along the inside of the V. It will be pasted onto a tree trunk later. Small and simple, 2 pieces only.', [])
add('rab_finish_band', 'An OBJECT: a long horizontal FINISH-LINE BANNER strip with a checkerboard of black (#2A2A2A) and cream (#F6ECD8) squares in two rows, cut from paper, with rounded ends. Long and narrow.', ['rab_finish_post'], size=(900, 300))
add('rab_tape', 'An OBJECT: a long straight horizontal red (#C8402E) paper FINISH TAPE ribbon, slightly wavy, with a thin darker red edge strip. Long and narrow.', ['rab_finish_post'], size=(900, 200))
add('rab_tape_broken', 'An OBJECT: the same red (#C8402E) paper finish tape SNAPPED in the middle: two separate pieces of ribbon fluttering apart to the left and right with torn ends, a small gap between them.', ['rab_finish_post'], size=(900, 300))
add('rab_hole', 'An OBJECT: a dark round burrow HOLE opening in grass: a deep warm-brown (#3A2A22) oval with a thin bark-brown (#6B4A32) rim and a few pine-green (#3F6B4F) grass blades along its top edge. Flat front view.', ['rab_finish_post'])
add('ud_ice', 'An OBJECT: a flat slab of frozen pond ICE seen slightly from the front: a pale ice-blue (#CFE6F2) top surface piece with a few soft white (#F4F6FA) streak pieces, on top of a thinner deeper-blue (#8DB8D6) edge strip showing its thickness. Wide and low.', ['ud_layer_lilypads_front'], size=(900, 400))
add('ud_ice_chip', 'An OBJECT: ONE small chunk of broken ICE: an irregular angular pale ice-blue (#CFE6F2) piece with one white (#F4F6FA) facet piece. Small.', ['ud_layer_lilypads_front'])
add('ud_ice_cracks', 'An OBJECT: a CRACK pattern for ice: thin jagged white (#F4F6FA) paper strips radiating from one centre point like a star-shaped crack, 6 branches, some forking. Only the crack strips, nothing else.', ['ud_layer_lilypads_front'])
add('ud_egg_crack', 'An OBJECT: a single zig-zag CRACK line cut from dark warm brown (#6B4A32) paper, horizontal, about six sharp zig-zags, thin but clearly visible. Only the crack strip.', ['ud_layer_lilypads_front'], size=(900, 300))
add('ud_purr_waves', 'An OBJECT: three short curved SOUND WAVE arcs side by side, cut from copper (#C98A5B) paper, like ")))" showing a soft purring sound. 3 pieces.', ['ud_layer_lilypads_front'])
add('br_eyes', 'Two glowing round EYES in the dark, cut from paper: two lemon-yellow (#F6E27F) ovals side by side, each with a black (#1A1A1A) vertical slit pupil, on NOTHING else (no face, no head). Slightly spooky but cute.', [], face=True)
add('hg_crumb', 'An OBJECT: ONE small BREAD CRUMB piece: an irregular rounded golden-tan (#D9A35E) paper chunk with a lighter cream (#F2D9A8) inner piece. Small.', ['hg_layer_candy_cane'])
add('hg_candy_round', 'An OBJECT: ONE round wrapped SWEET (candy) with twisted wrapper ends on both sides: a bean-red (#A93B32) round centre with a cream (#F6ECD8) swirl strip, pink (#E9A0A8) wrapper ends. 3 to 4 pieces.', ['hg_layer_candy_cane'])
add('hg_candy_tri', 'An OBJECT: ONE triangular candy (like a gumdrop triangle) cut from lime-green (#8BC34A) paper with a cream (#F6ECD8) sugar strip along its base. 2 pieces.', ['hg_layer_candy_cane'])
add('hg_key_circle', 'An OBJECT: an old KEY whose bow (handle) is a big ROUND ring: straw-gold (#D9A94E) paper, a straight shaft and two simple teeth at the end. Horizontal.', ['hg_layer_candy_cane'], size=(900, 400))
add('hg_key_square', 'An OBJECT: an old KEY whose bow (handle) is a big SQUARE ring with rounded corners: straw-gold (#D9A94E) paper, a straight shaft and two simple teeth at the end. Horizontal.', ['hg_layer_candy_cane'], size=(900, 400))
add('hg_key_star', 'An OBJECT: an old KEY whose bow (handle) is a big five-point STAR shape: straw-gold (#D9A94E) paper, a straight shaft and two simple teeth at the end. Horizontal.', ['hg_layer_candy_cane'], size=(900, 400))
add('hg_lock', 'An OBJECT: a chunky old PADLOCK: a bark-brown (#6B4A32) rounded lock body with a thick dark grey (#5C5C66) U-shaped shackle on top and a small straw-gold (#D9A94E) keyhole plate. 3 to 4 pieces.', ['hg_layer_candy_cane'])
add('hg_witch_hat', 'An OBJECT: a witch\'s pointed HAT flying through the air, tilted: a deep plum (#4A2F5A) cone with a bent tip and a wide brim, a bark-brown (#6B4A32) band. 3 pieces.', ['hg_layer_candy_cane'])
add('gl_steam', 'An OBJECT: three soft wavy vertical STEAM curls rising side by side, cut from white (#F4F6FA) paper, each an S-shaped narrow strip. 3 pieces.', ['gl_bg_forest_v2'])
add('gl_ice', 'An OBJECT: four small chunky ICE cubes in a loose cluster, pale ice-blue (#CFE6F2) with a white (#F4F6FA) highlight piece each.', ['gl_bg_forest_v2'])
add('gl_cushion', 'An OBJECT: a round plump-looking but FLAT paper CUSHION seen from the front: a persimmon (#E8703A) wide oval with a straw-gold (#D9A94E) button dot in the centre and four tiny corner tassels. 3 pieces.', ['gl_bg_forest_v2'])
add('tn_seed_hole', 'An OBJECT: a small dug HOLE in soil for planting a seed: a dark brown (#4A3222) oval hole with a lighter bark-brown (#6B4A32) rim of loose soil pieces around it. Flat front-ish view.', ['tn2_bg_field'] if os.path.exists(f'{G}/assets/v3w/tn2_bg_field.webp') else [])
add('kj_card_happy', 'A square paper FEELING CARD: a sunny lemon-yellow (#F6E27F) rounded-square card with a big simple HAPPY face cut from paper on it: two round black dot eyes, a wide smiling bark-brown (#6B4A32) curved mouth strip, two pink (#F2A7A0) cheek dots. The face is the card\'s picture (a drawn emoji-like face, allowed here).', [], face=True)
add('kj_card_sad', 'A square paper FEELING CARD: a soft sky-blue (#A9CBE6) rounded-square card with a big simple SAD face cut from paper on it: two round black dot eyes, a downturned bark-brown (#6B4A32) curved mouth strip, one small blue (#3E7CB1) teardrop under one eye. The face is the card\'s picture (allowed here).', [], face=True)
add('pj_bandage', 'An OBJECT: ONE cross-shaped pair of sticking PLASTERS (adhesive bandages) forming an X: two cream-beige (#F2D9B8) rounded strips each with a small darker pad in the middle. 2 to 3 pieces.')
add('pj_bump', 'An OBJECT: a round swollen BUMP (lump) as on a cartoon head after a bonk: a pink (#E9A0A8) dome-shaped half circle with a lighter (#F6C6CC) highlight piece. Flat. 2 pieces.')
add('pj_scratch', 'An OBJECT: three short parallel diagonal SCRATCH marks cut from red (#C8402E) paper strips. 3 pieces.')
add('pj_splash', 'An OBJECT: a big round water SPLASH bursting upward: sky-blue (#3E7CB1) and pale-blue (#A9CBE6) layered crown-shaped splash with several round droplets flying up. 4 to 6 pieces.')
add('lm_rope_v', 'An OBJECT: ONE straight vertical piece of twisted ROPE: a narrow straw (#C9A56B) paper strip with diagonal darker (#9C7A44) twist pieces along it. Tall and thin.', ['lm_net'], size=(200, 900))
add('lm_rope_h', 'An OBJECT: ONE straight horizontal piece of twisted ROPE: a narrow straw (#C9A56B) paper strip with diagonal darker (#9C7A44) twist pieces along it. Long and thin.', ['lm_net'], size=(900, 200))
add('lm_stick', 'An OBJECT: a short straight wooden STICK post: a bark-brown (#6B4A32) narrow rectangle with a lighter (#8A6446) strip. Vertical.', ['lm_net'], size=(200, 600))
add('fp_shape_circle', 'An OBJECT: a flat GOLDEN CIRCLE cut from straw-gold (#D9A94E) paper with a smaller lemon (#F6E27F) circle on top. 2 pieces.', ['fp_layer_lilies_front'] if os.path.exists(f'{G}/assets/v3w/fp_layer_lilies_front.webp') else [])
add('fp_shape_square', 'An OBJECT: a flat GOLDEN SQUARE with slightly rounded corners cut from straw-gold (#D9A94E) paper with a smaller lemon (#F6E27F) square on top. 2 pieces.')
add('fp_shape_triangle', 'An OBJECT: a flat GOLDEN TRIANGLE with slightly rounded corners cut from straw-gold (#D9A94E) paper with a smaller lemon (#F6E27F) triangle on top. 2 pieces.')
add('tp_chip_straw', 'An OBJECT: a small loose bundle of a few STRAW stalks flying apart, straw-gold (#D9A94E) thin strips. Small.', ['tp_strawnf'])
add('tp_chip_wood', 'An OBJECT: two small broken WOODEN PLANK pieces flying, bark-brown (#8A6446) with a lighter strip. Small.', ['tp_woodnf'])
add('tp_chip_brick', 'An OBJECT: ONE small red BRICK chunk, brick red (#B5523B) with a pale mortar (#E9DCC0) edge strip. Small.', ['tp_bricksnf'])
add('wg_paw', 'One WHITE paper PAW (a wolf\'s front paw dusted with flour) poking in from the side: a white (#F4F6FA) rounded paw with four toe pads in light grey (#C9CED6). No face.', ['wg_bg_inside_door'])
add('bb_nameplate', 'An OBJECT: an EMPTY paper door NAMEPLATE: a rounded rectangle of cream (#F6ECD8) paper mounted on a slightly larger deep rose (#8E3B4F) rounded rectangle, two small straw-gold (#D9A94E) rivet dots. The cream centre is empty (text is placed on it later). Wide.', [], size=(900, 400))
add('cd_clock_full', 'A big round CLOCK FACE made of paper for a palace tower: a cream (#F6ECD8) round face mounted on a straw-gold (#D9A94E) rim, with ALL TWELVE numerals 1 to 12 cut from deep-indigo (#1F2A56) paper placed around the edge in the correct clock positions. NO hands (they are added separately). Clear, chunky numerals.', ['cd2_clock'], size=(800, 800))
add('sn_window_dark', 'An OBJECT: a dark ROOM seen through an open window: a rectangle of deep warm-brown (#3A2A22) darkness with the faint silhouette shapes of a small table and a chair in slightly lighter brown (#4E3A2E). Flat.', [], size=(600, 800))
add('mer_pearl', 'An OBJECT: ONE round PEARL: a pale cream-white (#F4EEE6) disc with a smaller white (#FFFFFF) highlight piece on its upper left. Flat paper, NO gloss. 2 pieces.', ['mer_prop_shell_pearl'])
add('fc_mouth_butterfly_straw', 'An OBJECT: a butterfly\'s long curled drinking STRAW (proboscis): a thin dark (#3A2A22) paper strip curled into a spiral at its end. Thin and simple.', ['fc_mouth_butterfly'])
add('mg2_card', 'An OBJECT: an EMPTY paper NUMBER CARD: a cream (#F6ECD8) rounded rectangle mounted on a slightly larger straw-gold (#D9A94E) rounded rectangle; the cream centre is empty (a number is placed on it later). Upright.', [], size=(500, 700))
add('rp_sill', 'An OBJECT: a long horizontal stone WINDOW SILL ledge: a grey-beige (#B9A992) rectangle with a lighter (#D6C9B3) top strip. Long and narrow.', [], size=(900, 200))
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_svgfix.json', 'w'), ensure_ascii=False, indent=1)
# 배경 2장: 만화 컷 바탕(엔진 cut(), 4:3 위에 글자·그림이 얹힘), 브레멘 캄캄한 집 안(darkRoomBG)
bp = bgj['prompt']; i = bp.index('SCENE') if 'SCENE' in bp else None
def addbg(id, scene, aspect, size):
    jobs.append({'id': id, 'kind': 'bg', 'pass': 1, 'refs': [], 'size': list(size), 'out': f'{RAW}/{id}.png', 'final': f'assets/v3w/{id}.webp', 'aspect': aspect,
                 'prompt': HEAD.replace('Create ONE character or object sprite, rendered entirely as handcrafted paper art: a figure assembled from individually cut pieces of matte colored cardstock and fine-grain craft paper.',
                                        'Create ONE full-bleed background picture, rendered entirely as handcrafted paper art, assembled from individually cut pieces of matte colored cardstock.')
                           + 'SCENE:\n' + scene + '\n\nFRAMING:\nFull bleed, the paper fills the entire frame edge to edge, no border, no characters, no text.' + TAIL[TAIL.index('\n\nLIGHTING'):]})
addbg('cm_cut_bg', 'A comic-book "action panel" BURST background made of paper: a deep-indigo (#1F2A56) base sheet with 14 long straight alternating persimmon (#E8703A) and straw-gold (#D9A94E) paper rays radiating from the exact centre to the edges, like a sunburst. The centre area is plain (pictures and words are placed there later).', 'landscape 4:3', (1200, 900))
addbg('br_bg_darkroom', 'The INSIDE of a dark farmhouse kitchen at night, seen straight on, all in very dark paper silhouettes: a deep blue-black (#141A2E) back wall, a slightly lighter (#232B45) wooden door on the left, a brick hearth (fireplace) in the centre with only a few faint dim ember-orange (#8A3E1E) coals, a heap of straw on the right, and a ceiling beam across the top. Very dark and quiet, cosy not scary; nothing is lit.', 'landscape 16:9', (1600, 902))
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_svgfix.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
