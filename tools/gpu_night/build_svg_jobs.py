#!/usr/bin/env python3
"""SVG 임시 그림(greybox) 남은 것 → 페이퍼아트 작업 목록 jobs_svg.json (우선순위 순).
근거: SVG_AUDIT.md (12편 코드 읽기 + 화면 캡처 2026-10-03).
- 도우미(sheet·prop·gprop·cut)·STYLE·색 분위기·캐릭터 바이블은 build_tales2_jobs.py 를 그대로 가져다 쓴다.
  (build_tales_jobs.py 는 가져오면 jobs_frog/rabbit/sunmoon.json 을 다시 써 버리므로, 개구리·토끼·해님달님 바이블은 글자 그대로 옮겨 적었다.)
- 사물(OBJECT)에는 캐릭터 얼굴 문구(KID)를 넣지 않는다 → "This is an OBJECT … NO face" + negative 에 얼굴·눈.
- 초록·연두가 들어간 대상, 그리고 그물처럼 구멍이 많은 대상은 마젠타 배경(gprop) — 마젠타 키잉은 색으로 지워서 막힌 구멍도 빠진다.
- 배경 프롬프트에 HEX 없음. 밤 장면은 밝은 낮처럼 뽑고 게임이 어둡게 만든다.
- 소품은 1024×1024 (길쭉한 768×1280 은 자주 시간 초과). 넓은 것만 1760×992.
실행: python3 build_svg_jobs.py  → jobs_svg.json + 검사 결과 출력."""
import glob, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.dont_write_bytecode = True  # __pycache__ 를 남기지 않는다
import build_tales2_jobs as T2  # noqa: E402  (main 가드가 있어 가져오기만 해서는 파일을 쓰지 않는다)

STYLE, NEG, KID = T2.STYLE, T2.NEG, T2.KID
sheet, cut, PASTEL, INDOOR, SUNSET, SPRING, AUTUMN, WINTER = T2.sheet, T2.cut, T2.PASTEL, T2.INDOOR, T2.SUNSET, T2.SPRING, T2.AUTUMN, T2.WINTER

OBJ = "This is an OBJECT, not a character: it has NO face, NO eyes, NO mouth, NO cheeks. "
NEG_FACE = ", face, eyes, mouth, cheeks, smiling face on the object, cartoon face, googly eyes"
FACE_PHRASE = "big round white paper eyes"  # KID 문구의 고유 조각 — 사물에 들어가면 안 된다


def char(name, body, magenta=False, wide=False, neg=''):
    """캐릭터(얼굴 있음): build_tales2_jobs 의 prop/gprop 그대로."""
    return (T2.gprop if magenta else T2.prop)(name, body, wide=wide, neg=neg)


def obj(name, body, magenta=False, wide=False, neg=''):
    """사물: 같은 도우미로 만든 뒤 KID 얼굴 문구를 OBJECT 문구로 바꾸고 negative 에 얼굴을 넣는다."""
    j = char(name, body, magenta, wide, neg)
    assert KID in j['prompt']
    j['prompt'] = j['prompt'].replace(KID, OBJ)
    j['negative'] += NEG_FACE
    j['object'] = True
    return j


def part(name, body, phrase, magenta=False, neg=''):
    """몸의 한 부분(눈 하나 등): 얼굴 문구 없이, 따로 정한 한 줄로."""
    j = char(name, body, magenta, False, neg)
    j['prompt'] = j['prompt'].replace(KID, phrase)
    j['object'] = True
    return j


def full(name, mood, body, w=1024, h=1024, neg=''):
    """키잉 없는 화면 가득 한 장(구멍 속·우물 속처럼 코드가 모양대로 오려 쓰는 면). 다층 디오라마 문구는 넣지 않는다."""
    return {'name': name, 'w': w, 'h': h, 'cfg': 3.0, 'key': False, 'trim': False,
            'negative': T2.NEG_BG + T2.NEG_PASTEL + neg,
            'prompt': f"{STYLE} {body} A FULL-BLEED sheet filling the ENTIRE image edge to edge, no lime green, no border. "
                      f"{mood}No text, no watermark."}


# ---- 옮겨 적은 바이블 (build_tales_jobs.py · jobs_sm_tigerdress.json 과 같은 글자) ----
MOMFROG = ("Mother frog: a chubby round pine-green frog made of flat paper pieces, cream belly patch, two big bulging eyes on top of "
           "her head, tiny pink cheeks, a small leaf-shaped bow on her head. ")
BABYFROG = "Baby frog: a small light leaf-green frog with a cream belly patch, big bulging eyes on top, pink cheeks. "
OX = ("The ox: a big gentle Korean brown ox (hwangso) of flat bark-brown paper pieces, cream curved horns, lighter muzzle, kind round "
      "eyes, a small tail tuft. ")
TIGER = ("The tiger: a chubby persimmon-orange tiger made of flat paper pieces with dark-brown stripe pieces, cream muzzle and belly, "
         "big round eyes, pink cheeks, round ears — funny and clumsy, never scary, no fangs. ")
TIGER_DRESS = ("Dressed up in the MOTHER'S CLOTHES to pretend to be her: a soft pastel-pink hanbok jeogori jacket with a dark-rose "
               "goreum ribbon, squeezed over its round belly and a bit too small, and a charcoal-grey wide skirt; its striped tail "
               "peeks out under the skirt, no headscarf. ")
# 해와 바람·순무·사자·여우·골디·브레멘·개미·오리 바이블은 T2 에서 그대로
WIND, GOLDI, LION, TURNIP = T2.WIND, T2.GOLDI, T2.LION, T2.TURNIP
GRANDPA, GRANDMA, TNGIRL, DOG, CAT, MOUSE = T2.GRANDPA, T2.GRANDMA, T2.GIRL, T2.DOG, T2.CAT, T2.MOUSE
ANT, HOPPER, UGLY, YOUNG, SWAN = T2.ANT, T2.HOPPER, T2.UGLY, T2.YOUNG, T2.SWAN
NIGHT_LATER = "Render it as a bright, clear daytime picture; the game darkens and tints it into night later. "
NO_TEXT = "Leave every panel and plaque completely blank — no letters, no numbers, no writing of any kind. "

# 우선순위: 1 = 화면 가득·오래 보임·탭 목표 … 5 = 작거나 잠깐
P = {}


def add(prio, job):
    P[job['name']] = prio
    return job


jobs = [
    # ===================== 1순위: 화면을 크게 차지하는 것 =====================
    add(1, sheet('rab_bg_dusk', SUNSET, "Scene: the race course at sunset, straight-on: a big soft orange setting sun low on the right, "
                 "gentle olive and sage hills, a long low wooden rail fence (two rails, a few posts) running across the middle, a strip "
                 "of grass across the bottom. Keep the lower middle open and uncluttered — a rooster stands there.")),
    add(1, obj('sm_sun_plain', "A plain round paper SUN, front view: a golden disc with a slightly paler golden middle and twelve "
               "pointed amber-orange triangular rays evenly all around. The middle of the disc is completely EMPTY and plain (a face "
               "picture is placed on it later).")),
    add(1, obj('sm_moon_plain', "A plain round paper full MOON, front view: an off-white cream disc with two or three soft pale lilac "
               "round crater pieces near the edge, the middle completely EMPTY and plain (a face picture is placed on it later).")),
    add(1, full('sm_peek_fur', PASTEL, "An EXTREME close-up of a cute paper tiger's cheek and forehead fur filling the whole picture: "
                "flat persimmon-orange paper with five bold dark-brown rounded stripe pieces coming in from the edges, a cream muzzle "
                "piece entering at the bottom edge, and ONE round soft pink cheek circle at the lower left. The centre is plain orange "
                "fur with NO eye (an eye piece is added on top later). Funny and soft, never scary.",
                neg=", eye, eyes, pupil, nose, mouth, teeth, scary")),
    add(1, part('sm_peek_eye', "One huge round friendly cartoon tiger EYE on its own: a big white oval paper piece, a large round "
                "black pupil piece, and two small white round highlight pieces on the pupil; a thin warm-brown lid piece along the top.",
                "This is a single cartoon EYE piece by itself, not a whole face: no mouth, no nose, no cheeks, no second eye. ",
                neg=", mouth, nose, cheeks, second eye, face, eyebrows, scary")),
    add(1, obj('sm_treetop', "The leafy TOP of a big tree seen from slightly above, wide: one big round cluster of soft lavender-blue "
               "moonlit paper leaf clumps in the middle and two smaller clumps at the left and right, layered in two lavender-blue tones, "
               "with one thick dark plum-brown horizontal branch lying straight across the upper part where two children can stand.",
               wide=True)),
    add(1, obj('gl_bed_side_small', "A small honey-wood baby bear's bed seen from the SIDE, front view: a taller rounded wooden post at "
               "the LEFT end (headboard) and a shorter post at the right end (footboard), a cream mattress on a wooden frame, and one "
               "white pillow at the left end. No blanket, nobody in it.")),
    add(1, obj('gl_bed_side_blanket', "Just a soft mustard-gold quilt seen from the side, draped as if over a sleeping child: a gentle "
               "rounded hump on top, a straight bottom edge, two thin bean-red stripes across it, by itself.")),
    add(1, obj('gl_bowl_top', "One round cream porridge bowl seen straight from ABOVE: a cream rim ring with a thin red band, full of "
               "smooth pale-gold porridge, a small grey spoon resting in it with its handle reaching out to the right.")),
    add(1, obj('gl_bowl_top_empty', "One round cream porridge bowl seen straight from ABOVE, EMPTY and licked clean: a cream rim ring "
               "with a thin red band, the inside plain light cream, a small grey spoon lying in it with its handle to the right.")),
    add(1, obj('fc_feast_table', "A long low banquet table seen straight from the front, very wide: a deep bean-red tablecloth hanging "
               "down the front with one gold trim band along it, a cream wooden table top edge above it. Nothing on the table.",
               wide=True)),
    add(1, obj('lm_lion_chest', "The big round furry CHEST and belly of a lion seen from the ground looking up, filling a wide frame: "
               "warm honey-gold body with a lighter cream belly patch in the middle and a scalloped fringe of rounded persimmon-orange "
               "mane petals along the top edge. Only the chest — no head, no legs.", wide=True, neg=", head, legs, paws")),
    add(1, obj('tn_bush', "A big, wide, round garden bush made of three layered paper leaf clumps: dark sage at the back, mid sage in "
               "the middle, light sage in front, round lumpy tops and a flat bottom edge.", magenta=True, wide=True)),
    add(1, char('frog_uncle', f"Same paper style and family look as the mother frog — {MOMFROG}This one is UNCLE frog: a BIGGER, older frog in a deeper dark green, with a cream belly patch, "
                "two big bulging eyes on top of his head, pink cheeks, a small brown bow tie instead of the leaf bow, sitting front view "
                "on his bottom, singing with his mouth wide open in a round O.", magenta=True)),

    # ===================== 2순위: 장면의 중심 소품·선택 카드·코드 컷 =====================
    add(2, full('sm_well_water', PASTEL, "Looking straight DOWN onto the calm water surface inside a round stone well: smooth soft "
                "teal-blue water, one big soft pale round reflection in the middle, and dark sage leafy branch reflections around the "
                "rim. " + NIGHT_LATER)),
    add(2, cut('gl_cut_skirt', T2.CUT_MOOD, f"Uh-oh! Close-up at a wooden cabin window: Goldilocks is climbing out, and the hem of her "
               f"red dress is snagged on a grey nail in the window frame; she looks back over her shoulder with a surprised 'oops' "
               f"face, soft blue sky and treetops outside. {GOLDI}")),
    add(2, obj('gl_table_front', "The front edge of a long plain wooden kitchen table seen straight-on, very wide: a warm honey-brown "
               "table top with a lighter front lip, and two thick legs at the far ends. Nothing on it.", wide=True)),
    add(2, obj('gl_table', "A plain small wooden cabin side table, front view: warm brown top board and two thick straight legs.")),
    add(2, obj('rab_finish_post', "A race FINISH post: one tall brown wooden pole with a black-and-white checkered paper banner flying "
               "from its top, and a blank cream plaque in the middle of the banner. " + NO_TEXT, neg=", letters, numbers, text")),
    add(2, obj('rab_podium', "A winner's podium: one sturdy golden-yellow block with a cream top edge and a blank cream panel on its "
               "front. " + NO_TEXT, neg=", letters, numbers, text, trophy, person")),
    add(2, obj('rab_leaf_blanket', "One big soft green leaf used as a blanket: a wide oval leaf in leaf green, pointed at the right end, "
               "with darker pine-green vein strips.", magenta=True)),
    add(2, obj('tn_table', "A low wooden Korean-style feast table, front view: a wide warm-brown top board and two short sturdy legs, "
               "nothing on it.")),
    add(2, obj('lm_net', "A big draped rope NET seen from the front, dome-shaped like a blanket thrown over something big: tan rope "
               "strips crossing in a wide diamond mesh, a thicker rope edge along the bottom, the holes between the ropes open.",
               magenta=True, wide=True)),
    add(2, obj('lm_hole_stump', "A tall old tree stump with a tiny dark arched mouse hole at its base, front view: brown bark paper "
               "layers, a pale ring top, a small grass tuft at one side.")),
    add(2, char('ag_ant_tee', f"{ANT}Standing, wearing a white T-shirt with one persimmon-orange stripe, shivering with cold, blue "
                "shiver marks, sad cold face.")),
    add(2, char('ag_ant_coat', f"{ANT}Standing, wearing a huge heavy pine-green winter coat with gold buttons, far too hot, big sweat "
                "drops, red face, tongue out.", magenta=True)),
    add(2, char('ag_ant_ring', f"{ANT}Standing, wearing a persimmon-orange swim ring with cream stripes around its waist, a surprised "
                "silly face.")),
    add(2, obj('ag_icon_tee', "A small white T-shirt with one persimmon-orange stripe across the chest, laid flat, front view.")),
    add(2, obj('ag_icon_vest', "A small golden-yellow vest with two brown buttons, laid flat, front view.")),
    add(2, obj('ag_icon_coat', "A small heavy pine-green winter coat with gold buttons and darker green lapels, laid flat, front view.",
               magenta=True)),
    add(2, obj('ag_icon_warm', "A warm winter set: a cream knit hat with a bean-red band and a round pompom, and a persimmon-orange "
               "scarf with cream tips lying below it.")),
    add(2, obj('ag_icon_swim', "A persimmon-orange swim ring with four cream stripes, front view.")),
    add(2, obj('ag_flower_pink', "One big flower on a long stem: five round soft pink petals around a golden centre, a long pine-green "
               "stem with one leaf, the whole flower standing upright.", magenta=True)),
    add(2, obj('ag_flower_orange', "One big flower on a long stem: five round persimmon-orange petals around a golden centre, a long "
               "pine-green stem with one leaf, the whole flower standing upright.", magenta=True)),
    add(2, char('ag_hopper_winter_play', f"{HOPPER}Standing upright on its hind legs, wearing a persimmon-orange scarf and a cream knit "
                "hat with a bean-red band, playing a small brown violin with a gold centre tucked under its chin and drawing a cream bow, "
                "happy closed eyes.", magenta=True)),
    add(2, char('ud_face_happy', f"Only the round HEAD of the grey duckling, FRONT view, filling the frame: {UGLY}Here seen from the "
                "front: a round grey face, the little three-point dark grey tuft on top, a small orange bill in the middle; very HAPPY — "
                "eyes curved shut like smiles, pink cheeks, bill open in a smile.")),
    add(2, char('ud_face_sad', f"Only the round HEAD of the grey duckling, FRONT view, filling the frame: {UGLY}Here seen from the "
                "front: a round grey face, the three-point tuft on top, a small orange bill; very SAD — eyebrows slanting down at the "
                "outer ends, one big blue tear, bill turned down.")),
    add(2, char('ud_face_scared', f"Only the round HEAD of the grey duckling, FRONT view, filling the frame: {UGLY}Here seen from the "
                "front: a round grey face, the three-point tuft on top, a small orange bill; very SCARED — big white eyes with tiny "
                "pupils, bill open in a small o, one blue sweat drop.")),
    add(2, char('ud_face_angry', f"Only the round HEAD of the grey duckling, FRONT view, filling the frame: {UGLY}Here seen from the "
                "front: a round grey face, the three-point tuft on top, a small orange bill; grumpy ANGRY in a funny way — V-shaped "
                "eyebrows, red cheeks, a flat pressed bill. Not scary.")),
    add(2, char('ud_face_swan_happy', f"Only the round HEAD of the swan, FRONT view, filling the frame: {SWAN}Here seen from the front: "
                "a round snow-white face, an orange bill with a dark base in the middle; very HAPPY — eyes curved shut like smiles, pink "
                "cheeks, a smile.")),
    add(2, char('ud_face_swan_sad', f"Only the round HEAD of the swan, FRONT view, filling the frame: {SWAN}Here seen from the front: "
                "a round snow-white face, an orange bill with a dark base; SAD — eyebrows slanting down at the outer ends, one blue tear.")),
    add(2, char('ud_face_swan_scared', f"Only the round HEAD of the swan, FRONT view, filling the frame: {SWAN}Here seen from the "
                "front: a round snow-white face, an orange bill with a dark base; SCARED — big white eyes with tiny pupils, a blue sweat "
                "drop.")),
    add(2, char('ud_face_swan_angry', f"Only the round HEAD of the swan, FRONT view, filling the frame: {SWAN}Here seen from the front: "
                "a round snow-white face, an orange bill with a dark base; funny grumpy ANGRY — V-shaped eyebrows, red cheeks. Not "
                "scary.")),
    add(2, obj('ud_reed', "One single tall reed: a long olive-green blade standing upright with one side leaf curving out, topped by a "
               "brown cattail head.", magenta=True)),
    add(2, obj('ud_reed_clump', "A clump of broad curved reed leaves fanning upward from one point at the bottom, in olive green and "
               "darker olive, about six leaves.", magenta=True)),

    # ===================== 3순위: 중간 크기 소품·아이콘 =====================
    add(3, obj('sm_basket_empty', "An EMPTY round woven bamboo basket seen from the front, tan and light brown weave pieces, a wide open "
               "top with nothing inside.", neg=", rice cakes, food, tteok")),
    add(3, obj('sm_cloud_cream', "One flat-bottomed puffy paper cloud with a lumpy rounded top of four bumps, soft warm cream colour with "
               "one slightly darker cream under-piece.")),
    add(3, obj('sm_cloud_lilac', "One flat-bottomed puffy paper cloud with a lumpy rounded top of four bumps, soft pale lilac colour "
               "with one slightly darker lilac under-piece.")),
    add(3, obj('sm_icon_ear', "One paper-cut EAR, side view: a soft pink ear shape with a bean-red inner curve piece, and two lavender "
               "sound-wave arcs on its right side.", neg=", head, face")),
    add(3, cut('sm_cut_bump', SUNSET, f"THUMP! In a tall golden sorghum field at sunset, the tiger in the mother's clothes has slipped and "
               f"landed on its bottom, a big bump on its head and little stars circling, 'ouch' face, sorghum stalks bending around it. "
               f"{TIGER}{TIGER_DRESS}", neg=", mother, woman, person")),
    add(3, obj('tn_soup_bowl', "One white bowl full of golden turnip soup, side view, slightly tilted so the soup top shows.")),
    add(3, obj('tn_seed', "One single brown seed, teardrop shape, with a small lighter brown highlight piece.")),
    add(3, obj('lm_paw_pad', "A big golden lion FOREPAW seen from below, by itself: a large round cream-ochre main pad on a honey-gold "
               "paw, with NO toe pads (the toes are added separately).", neg=", toes, toe pads, claws")),
    add(3, obj('lm_paw_toe', "One single round darker ochre lion toe pad, by itself, a soft rounded oval.")),
    add(3, obj('gl_bear_paw', "A small honey-brown bear PAW and forearm reaching up from the bottom, with a cream palm pad and three "
               "small cream toe pads.", neg=", claws")),
    add(3, obj('rab_sun_small', "A plain round paper SUN: a warm golden-yellow disc with eight short rounded rays.")),
    add(3, obj('rab_cloud_small', "One soft puffy paper cloud of three round bumps on a flat bottom, pale lavender-grey.")),
    add(3, char('rab_fish_orange', "A small cute persimmon-orange fish swimming to the RIGHT, side view: oval body, a triangle tail "
                "fin, a small fin on top, one dot eye.")),
    add(3, char('rab_fish_gold', "A small cute golden-yellow fish swimming to the RIGHT, side view: oval body, a triangle tail fin, a "
                "small fin on top, one dot eye.")),
    add(3, char('rab_fish_lavender', "A small cute lavender fish swimming to the RIGHT, side view: oval body, a triangle tail fin, a "
                "small fin on top, one dot eye.")),
    add(3, obj('frog_icon_tail', f"Just the TAIL of the ox, by itself: a long curved bark-brown tail with a dark tuft at the end. {OX}",
               neg=", whole ox, head")),
    add(3, obj('frog_icon_hoof', f"Just one front LEG of the ox with a dark split HOOF, by itself, standing. {OX}",
               neg=", whole ox, head")),
    add(3, obj('frog_icon_horn', f"Just one cream curved HORN of the ox, by itself. {OX}", neg=", whole ox, head")),
    add(3, obj('frog_icon_tree', "A small round tree: a brown trunk and one big round pine-green crown.", magenta=True)),
    add(3, obj('frog_icon_rock', "One lumpy round grey rock with a lighter grey highlight piece.")),
    add(3, obj('frog_icon_branch', "One bare brown forked twig branch with two small side twigs.")),
    add(3, obj('ag_grain_pile', "A neat little pyramid pile of six plump golden wheat grains with light highlight pieces.")),
    add(3, obj('ag_grain', "One single plump golden wheat grain lying on its side, with a light highlight piece.")),
    add(3, obj('ag_acorn', "One shiny brown acorn with a darker textured cap and a little stem.")),
    add(3, obj('ag_door_leaf', "A small arched wooden plank door, front view: warm brown boards with two darker plank lines and a round "
               "gold knob on the right.")),
    add(3, obj('ag_cloud_storm', "One wide flat puffy storm cloud of layered rounded lobes in soft blue-grey and darker blue-grey.")),
    add(3, obj('ud_icon_summer', "A golden-orange paper SUN with eight short rounded rays.")),
    add(3, obj('ud_icon_autumn', "One persimmon-orange maple leaf with a brown stem.")),
    add(3, obj('ud_icon_winter', "One pale-blue six-armed paper snowflake.")),
    add(3, obj('ud_icon_spring', "One pink five-petal flower with a golden centre on a short green stem with one leaf.", magenta=True)),
    add(3, obj('ud_eggshell', "One jagged half of a cracked cream eggshell, cup side up, with a zig-zag broken top edge.")),
    add(3, obj('ud_basket', "A low woven straw basket in honey gold with a brown rim, front view, empty.")),
    add(3, obj('ud_egg_nest', "One big cream egg resting on a small round golden straw nest pad.")),

    # ===================== 4순위: 작거나 짧게 보이는 것 · 다시 뽑기 =====================
    add(4, char('frog_baby_sleep_shut', f"{BABYFROG}Sitting, fast asleep with both eyes CLOSED as curved lines, a peaceful smile, a tiny "
                "bubble at its mouth.", magenta=True)),
    add(4, cut('sw_cut_pant2', "Colour mood: soft, warm picture-book pastels with a plain pale soft blue sky. ",
               f"Close-up of the worn-out wind cloud, exhausted after blowing: deflated wrinkly puffs, droopy tired eyes, cheeks sagging, "
               f"tongue out panting, two blue sweat drops, NOT smiling. Plain sky behind, nothing on the ground. {WIND}",
               neg=", smiling, happy, ground, grass, people, trousers")),
    add(4, cut('tn_cut_pop2', T2.FARM, f"POP! ONE big turnip bursts out of the soil with clods flying in a paper starburst, and the whole "
               f"chain of pullers tumbles backward in a heap: grandpa, grandma, the granddaughter, the dog, the cat and the mouse, all "
               f"laughing. The turnip is a VEGETABLE with NO face. {TURNIP}{GRANDPA}{GRANDMA}{TNGIRL}{DOG}{CAT}{MOUSE}",
               neg=", face on the turnip, eyes on the turnip, many turnips, several turnips")),
    add(4, char('ud_young_happy', f"{YOUNG}Standing, very happy: eyes curved shut like smiles, beak open in a smile, wings slightly "
                "raised.")),
    add(4, char('ud_icon_swim', f"{UGLY}Floating happily on soft blue paper water waves, a small smile.")),
    add(3, sheet('lm_bg_board', T2.SAVANNA, "Scene: a soft savanna 'classroom': one very big EMPTY cream paper board fills the "
                 "middle of the picture like a wide panel, standing on a warm wooden plank floor strip along the bottom, with a few "
                 "acacia tree tops and pale sky peeking out around its edges. The board itself is completely plain and blank — cards are "
                 "placed on it later. " + NO_TEXT, neg=", letters, numbers, chalk drawings, writing")),
    add(4, obj('br_drum', "A small round drum, front view: a bean-red drum body with a cream top and gold zigzag cord.")),
    add(4, obj('br_horn', "A small golden horn (trumpet) with a round flared bell, side view, mouthpiece on the left.")),
    add(4, obj('br_fiddle', "A small brown fiddle with a dark neck and a cream bow lying beside it.")),
    add(4, obj('br_bell', "A small golden dome-shaped hand bell with a brown wooden handle on top.")),
    add(3, obj('rab_ins_tambourine', "A golden tambourine with a cream centre and small gold jingles around the rim.")),
    add(3, obj('rab_ins_drum', "A small red drum with a cream top, front view.")),
    add(3, obj('rab_ins_xylophone', "A small toy xylophone of four bars in persimmon, gold, sky blue and cream on a brown frame, with "
               "one little mallet. No green.")),
    add(3, obj('rab_ins_horn', "A small golden horn with a flared bell, side view.")),
    add(3, obj('rab_ins_bell', "A small golden hand bell with a brown handle.")),
    add(3, obj('rab_ins_snare', "A small persimmon-orange snare drum with a cream top and two drumsticks crossed above it.")),
    add(3, obj('rab_ins_jingle', "Three small golden jingle bells tied on a short red string.")),
    add(3, obj('rab_ins_flute', "A small lavender flute lying sideways with a few round holes.")),

    # ===================== 5순위: 잠깐 지나가는 것 =====================
    add(5, obj('rab_envelope', "A small cream paper envelope with a bean-red triangular flap and a tiny red round seal.")),
    add(5, obj('fc_invite', "A cream paper envelope with a gold-edged triangular flap and a round red wax seal in the middle.")),
    add(5, cut('sm_cut_roar', SUNSET, f"ROAR! On a mountain path, the big tiger rears up with paws raised and a huge open-mouth roar, a "
               f"funny over-the-top pose, a round moon rising behind the hills. {TIGER}" + NIGHT_LATER, neg=", mother, woman, person")),
    add(5, obj('gl_hammer', "A small wooden mallet: a brown handle and a grey head.")),
    add(3, part('lm_tooth_lion', "One big curved ivory lion fang, by itself, rounded tip.", "This is a single TOOTH by itself, not a "
                "face: no eyes, no mouth, no cheeks. ", neg=NEG_FACE)),
    add(3, part('lm_tooth_mouse', "A pair of tiny rounded orange-ivory mouse front teeth side by side, by themselves.", "These are "
                "TEETH by themselves, not a face: no eyes, no mouth, no cheeks. ", neg=NEG_FACE)),
]

# 우선순위 순으로 (같은 순위 안에서는 적은 순서)
order = {j['name']: i for i, j in enumerate(jobs)}
jobs.sort(key=lambda j: (P[j['name']], order[j['name']]))


# ---------------------------- 검사 ----------------------------
def validate(jobs):
    errs = []
    names = [j['name'] for j in jobs]
    dup = {n for n in names if names.count(n) > 1}
    if dup: errs.append(f'중복 이름: {sorted(dup)}')
    # 기존 파일·다른 작업 목록과 겹치지 않는지
    root = os.path.dirname(os.path.dirname(HERE))
    existing = set()
    for d in ('assets/v3', 'assets/v3w', 'assets/raw/v3'):
        for f in glob.glob(os.path.join(root, d, '*')):
            existing.add(os.path.basename(f).split('.')[0])
    for f in glob.glob(os.path.join(HERE, 'jobs_*.json')):
        if os.path.basename(f) == 'jobs_svg.json': continue
        try: existing |= {j['name'] for j in json.load(open(f))}
        except Exception: pass
    clash = sorted(set(names) & existing)
    if clash: errs.append(f'기존 이름과 겹침: {clash}')
    prefixes = ('pj_', 'frog_', 'rab_', 'sm_', 'sw_', 'tn_', 'lm_', 'fc_', 'gl_', 'br_', 'ag_', 'ud_')
    bad = [n for n in names if not n.startswith(prefixes)]
    if bad: errs.append(f'접두어 틀림: {bad}')
    green = re.compile(r'\b(green|sage|olive)\b', re.I)  # 'leaf' 는 색이 아니다 (연보라 잎·단풍잎)
    for j in jobs:
        p = j['prompt']
        if j.get('object') and FACE_PHRASE in p: errs.append(f"{j['name']}: 사물에 얼굴 문구")
        if j.get('object') and 'face' not in j['negative']: errs.append(f"{j['name']}: 사물 negative 에 face 없음")
        if j['key']:
            magenta = 'MAGENTA' in p
            body = p.replace(STYLE, '')
            body = re.sub(r'Isolated on a plain solid flat .*', '', body)  # 배경 문장 이후는 공통 문구
            body = re.sub(r'\b(no|never) green\b', '', body, flags=re.I)
            if green.search(body) and not magenta: errs.append(f"{j['name']}: 초록인데 라임 배경")
            if magenta and j.get('nogreen'): errs.append(f"{j['name']}: 마젠타인데 nogreen")
        else:
            if j['w'] == 1760 and re.search(r'#[0-9A-Fa-f]{6}', p.replace(STYLE, '')): errs.append(f"{j['name']}: 배경에 HEX")
        if (j['w'], j['h']) == (768, 1280): errs.append(f"{j['name']}: 길쭉한 768×1280 (시간 초과 위험)")
    return errs


if __name__ == '__main__':
    out = os.path.join(HERE, 'jobs_svg.json')
    clean = [{k: v for k, v in j.items() if k != 'object'} for j in jobs]
    errs = validate(jobs)
    json.dump(clean, open(out, 'w'), ensure_ascii=False, indent=1)
    json.load(open(out))  # 다시 읽어 파싱 확인
    by = {}
    for j in jobs:
        t = j['name'].split('_')[0]
        k = 'bg' if (j['w'] == 1760 and not j['key']) else 'cut' if (j['w'], j['h']) == (1024, 768) else 'wide' if j['w'] == 1760 else 'prop'
        by.setdefault(t, {}).setdefault(k, 0); by[t][k] += 1
    mins = 0
    for j in jobs:
        mins += 30 if j['w'] == 1760 else 17.5
    for t, d in by.items(): print(f'{t:5s} {sum(d.values()):3d} {d}')
    print(f'합계 {len(jobs)}장, 마젠타 {sum("MAGENTA" in j["prompt"] for j in jobs)}장, 예상 약 {mins/60:.1f}시간')
    print('검사:', '통과' if not errs else '\n  ' + '\n  '.join(errs))
    sys.exit(1 if errs else 0)
