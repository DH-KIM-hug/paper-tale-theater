#!/usr/bin/env python3
"""밤샘 GPU 작업 목록(jobs_night1.json) 생성.

레이어는 합치지 않고 하나씩 따로 뽑는다 (사용자 지시). 시범 결과 모델이 '그림 안의 지정 위치'를
지키지 못해서(가운데에 크게 그림), 위치는 그림 안에서 정하지 않고 코드(SVG)에서 배치한다.
- sheet: 화면을 꽉 채우는 불투명 배경 (하늘·뒷벽·공연장) 1760x992
- prop:  라임 배경 위 단독 요소 → 라임 제거 + 트림 → 코드에서 x/y/크기 지정
  넓은 띠(산맥·바다·땅)는 1760x992, 나머지는 1024x1024.
- nogreen: 초록이 없는 소품은 배경에 번진 연두 빛·초록 그림자까지 지운다.
근거: BACKGROUND_PLAN.md, STAGE_REVIEW.md §6, DESIGN_SYSTEM.md
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(HERE, 'style_base.json')))
STYLE, NEG = base['STYLE'], base['NEG']

BACKLIT = ("Backlit lightbox paper diorama: soft warm light glows from BEHIND the edges of each paper layer, "
           "deeper layers are lighter, like the paper-cut lightbox art of Hari & Deepti. ")
NEG_BG = NEG + (", torn paper edge, deckled edge, ragged tear, empty flat background, "
                "large area of one plain color, people, person, text")
LIME = ("Every area NOT described above is plain solid flat lime green (#7CFC00) with nothing in it — "
        "no shadow, no texture, no gradient on the lime. ")
NO_OUTSIDE_SHADOW = ("The paper pieces cast NO shadow onto the lime area: no drop shadow, no ground shadow, "
                     "no backing shape — only tiny shallow shadows between their own stacked pieces. ")

PAL_NIGHT = "Palette: deep indigo #1F2A56, midnight navy #16204a, lavender dusk #8B7BB8 (sea and moonlit ridges ONLY), snow white #F4F6FA, paper cream #F6ECD8, straw gold #D9A94E, ember amber #F2B366, bark brown #6B4A32. Cold winter moonlit night mood with warm amber window lights. "
PAL_KITCHEN = "Palette: paper cream #F6ECD8 clay wall, warm ochre, bark brown #6B4A32 wood, deep shadow brown #2E241C, ember amber #F2B366 fire light, straw gold #D9A94E. Dark winter night kitchen lit warmly by the hearth fire. "
PAL_DAY = "Palette: paper cream #F6ECD8, pale gold #F2DFA8, straw gold #D9A94E, apricot #F2B98A, persimmon #E8703A, bean red #A93B32, bark brown #6B4A32, pine green #3F6B4F. Warm golden autumn afternoon, backlit by a low sun at the upper left. "
PAL_THEATER = "Palette: bean red #A93B32, straw gold #D9A94E, warm dark wood brown #2B1712, bark brown #6B4A32, paper cream #F6ECD8, ember amber #F2B366. A cozy old paper puppet theater. "

NO_GLOW = ("Do NOT paint any glow, halo, light spill, shadow or color onto the lime background; the lime stays one "
           "perfectly flat uniform color right up to the paper edges. ")


def sheet(name, pal, body, extra_neg=''):
    """화면을 꽉 채우는 불투명 배경."""
    return {'name': name, 'w': 1760, 'h': 992, 'cfg': 3.0, 'key': False, 'trim': False,
            'negative': NEG_BG + extra_neg,
            'prompt': f"{STYLE} {pal}{BACKLIT}{body} A FULL-BLEED sheet filling the ENTIRE image edge to edge with NO lime green anywhere. No text, no watermark."}


def prop(name, pal, body, wide=False, nogreen=True, extra_neg=''):
    """라임 배경 위 단독 요소. 위치·크기는 코드에서 정한다."""
    w, h = (1760, 992) if wide else (1024, 1024)
    return {'name': name, 'w': w, 'h': h, 'cfg': 3.0, 'key': True, 'trim': True, 'nogreen': nogreen,
            'negative': NEG_BG + ", glow on background, halo, light spill, green shadow, color swatches, colour palette chart, stack of colored strips, sample color bars" + extra_neg,
            'prompt': (f"{STYLE} {body} The element is shown whole and uncropped, centered, straight-on. "
                       f"Isolated on a plain solid flat lime green (#7CFC00) background, nothing else. {NO_OUTSIDE_SHADOW}{NO_GLOW}"
                       "No text, no watermark.")}

TIGER = ("The tiger is a cute chubby Korean folk-tale tiger cub made of flat paper pieces: persimmon-orange body with "
         "separate dark-brown stripe pieces, cream muzzle and belly patch, BIG round white paper eyes with dark pupils, "
         "small pink cheek circles, small rounded ears, a thick striped tail — never scary, no fangs, no claws. ")
NEG_CHAR = NEG + ", scary, realistic tiger, fangs, claws, blood, human, person, two tigers, duplicate tiger, text"

def tiger(name, pose):
    return {'name': name, 'w': 1024, 'h': 1024, 'cfg': 3.0, 'key': True, 'trim': True, 'nogreen': True, 'negative': NEG_CHAR,
            'prompt': (f"{STYLE} "
                       f"{TIGER}{pose} Exactly ONE tiger, whole body visible, centered. "
                       f"Isolated on a plain solid lime green (#7CFC00) background, nothing else. {NO_OUTSIDE_SHADOW}{NO_GLOW}"
                       "No text, no watermark.")}

jobs = []

# ===== 씬3: 달밤 시골집 마당 → 담 → 길 → 바다 (12장, 초가집·지게컷은 시범에서 합격) =====
jobs += [
  sheet('c3_sky', PAL_NIGHT,
        "Scene: ONLY a clear winter night sky and nothing else. Rich MEDIUM indigo blue flat paper pieces (never black). A SMALL "
        "round layered paper full moon (two stacked cream circles, about 9 percent of the image width) placed in the UPPER RIGHT "
        "area, surrounded by THREE concentric flat paper halo rings stepping from pale cream to soft lavender to indigo. Seven "
        "or eight small cut-paper stars scattered across the sky. The sky continues all the way down to the bottom edge.",
        extra_neg=", houses, village, buildings, roofs, land, ground, mountains, hills, sea, water, horizon, trees, moon in the center, big moon"),
  prop('c3_far', PAL_NIGHT,
       "A wide range of snowy moonlit mountains: a lavender back range and an indigo front range with sharp peaks, each with one "
       "inner parallel ridge-line paper strip, small snow caps and a few flat dark-indigo snow-laden fir silhouettes (not green). "
       "Flat bottom edge.", wide=True, extra_neg=", sea, houses, moon, sky"),
  prop('c3_sea_far', PAL_NIGHT,
       "A long thin horizontal band of FAR SEA: three rows of loose scalloped paper wave strips in indigo and lavender, and one "
       "narrow golden moonlight path of stacked cream-gold slivers crossing the band vertically near its right third. "
       "Straight flat top edge (the horizon).", wide=True, extra_neg=", mountains, land, moon, sky, boats"),
  prop('c3_village', PAL_NIGHT,
       "A small distant Korean village: three or four small thatched-roof houses as flat dark indigo-brown paper silhouettes with "
       "tiny warm amber window dots, and a soft row of dark indigo pine tree silhouettes behind them, sitting on a gentle flat "
       "paper hill line.", wide=True),
  prop('c3_yard', PAL_NIGHT,
       "A wide flat strip of farmyard ground: packed earth in warm bark brown made of two or three flat paper bands, with a thin "
       "wavy snow layer on top and a few flat pebbles. A plain horizontal strip, wider than tall.", wide=True,
       extra_neg=", house, wall, trees, jars"),
  prop('c3_jangdok', PAL_NIGHT,
       "A small traditional Korean sauce-jar terrace (jangdokdae): a low raised platform of flat grey stones with three round "
       "brown clay jars of different sizes with lids, each wearing a little snow cap."),
  prop('c3_wall', PAL_NIGHT,
       "A short traditional Korean stone-and-earth wall (doldam) with a small dark roof-tile cap and a thin snow line, and an "
       "OPEN woven brushwood gate (sarip-mun) swung open at its right end.", extra_neg=", house, long wall"),
  prop('c3_road', PAL_NIGHT,
       "A narrow winding dirt footpath of flat light-brown paper with snowy edges and a few flat pebbles, curving gently as an "
       "S-shape from the upper left to the lower right and ending in a small pale sand beach.", extra_neg=", sea, house"),
  prop('c3_sea', PAL_NIGHT,
       "The NEAR SEA at a sandy shore: three to four big layered rows of scalloped paper waves stepping from indigo to lavender "
       "with white paper foam strips on the crests, two rounded dark paper rocks, and a pale sand beach edge along the left.",
       wide=True, extra_neg=", mountains, moon, sky, boats"),
  prop('c3_fg_branch', PAL_NIGHT,
       "A bare persimmon tree branch reaching in from the left, with two bright orange persimmons and small snow caps on the twigs."),
  prop('c3_fg_reeds', PAL_NIGHT,
       "Three tall slender reed stalks with feathery straw-gold plumes and a little snow at their base, standing upright."),
]

# ===== 씬2: 부엌 (9장) =====
jobs += [
  sheet('b3_kitchen_back', PAL_KITCHEN,
        "Scene: ONLY the plain back wall of a traditional Korean earthen kitchen (buoak) at night, straight-on: large calm cream "
        "clay-paper wall panels between a few flat wooden posts, a warm ochre baseboard band (gutdori) across the lower part, "
        "and a dark packed-earth floor strip at the very bottom. Warm amber firelight glows on the LEFT part of the wall and it "
        "gets darker to the right. No window, no door, no objects.",
        extra_neg=", window, door, shelves, pots, stove, objects, modern kitchen, tiles, chimney"),
  prop('b3_window', PAL_KITCHEN,
       "A small traditional Korean kitchen lattice window (salchang): a rectangular dark wooden frame with vertical wooden bars, "
       "deep indigo moonlit night sky with two tiny stars seen through the bars.", nogreen=True),
  prop('b3_door', PAL_KITCHEN,
       "A traditional Korean kitchen door: a tall dark wooden door frame with a closed wooden plank door, a small iron ring "
       "handle, and a plain wooden lintel shelf across the top of the frame.", extra_neg=", house, wall"),
  prop('b3_beam', PAL_KITCHEN,
       "A long thick horizontal wooden ceiling beam (daedeulbo) with five flat rafter ends above it, seen straight-on, much wider "
       "than tall.", wide=True),
  prop('b3_shelf', PAL_KITCHEN,
       "An empty traditional Korean hanging shelf (sirung): two long parallel wooden poles hung from above by two ropes each, "
       "much wider than tall.", wide=True, extra_neg=", objects on shelf, pots"),
  prop('b3_hearth', PAL_KITCHEN,
       "A BIG traditional Korean earthen stove (budumak): a wide clay-brown platform built from straight flat paper blocks, TWO "
       "black iron cauldrons (gamasot) with domed lids sunk into the flat top, TWO dark arched fire mouths (agungi) at the front "
       "with warm amber embers glowing inside. Low Korean stove, NOT a fireplace, NO chimney.",
       extra_neg=", fireplace, chimney, western stove, flames leaping out"),
  prop('b3_floor', PAL_KITCHEN,
       "A wide flat strip of dark packed-earth kitchen floor with a slightly lighter front step edge (bongdang), one clear narrow "
       "crack in the middle of the floor, and a few flat scattered straw bits. A plain horizontal strip, much wider than tall.",
       wide=True),
  prop('b3_fg_post', PAL_KITCHEN,
       "One thick tall dark wooden house post (kitchen pillar) seen straight-on, with a simple stone base, much taller than wide."),
  prop('b3_fg_eave', PAL_KITCHEN,
       "A long dark wooden eave band with a hanging straw-thatch fringe along its bottom edge, seen from inside, much wider than tall.",
       wide=True),
]

# ===== 씬1: 가을 팥밭 (10장) =====
jobs += [
  sheet('a3_sky', PAL_DAY,
        "Scene: ONLY a warm autumn afternoon sky and nothing else. A round layered paper sun (three stacked circles) in the UPPER "
        "LEFT area, surrounded by THREE concentric flat paper halo rings stepping from cream to pale gold to apricot; the rest of "
        "the sky is built from a few large flat paper pieces in pale gold and cream, lighter near the sun. The sky continues all "
        "the way down to the bottom edge.",
        extra_neg=", land, ground, mountains, hills, field, trees, houses, clouds, birds, torn strips, night, moon"),
  prop('a3_cloud1', PAL_DAY,
       "One Korean folk-painting (minhwa) style cloud made of scalloped cream paper swirls with a pale gold inner layer, wider than tall."),
  prop('a3_cloud2', PAL_DAY,
       "One smaller Korean folk-painting (minhwa) style cloud of cream paper swirls with a pale apricot inner layer, a different shape."),
  prop('a3_geese', PAL_DAY,
       "A V-shaped line of four flat dark-brown paper wild geese silhouettes flying to the left."),
  prop('a3_far', PAL_DAY,
       "Three overlapping ranges of distant autumn mountains — pale ochre back range, golden ochre middle, rust-brown front — each "
       "with ONE inner parallel ridge-line paper strip in Korean minhwa style. Flat bottom edge.", wide=True,
       extra_neg=", sky, sun, trees, houses"),
  prop('a3_mid', PAL_DAY,
       "A closer rolling rust-brown autumn hill with two tall slim poplar trees near its left end, a clump of three pine trees "
       "near its right end, a tiny village of two small thatched-roof houses on the hill, and a light narrow footpath coming "
       "down on the right. Flat bottom edge.", wide=True, nogreen=False),
  prop('a3_field_far', PAL_DAY,
       "A wide strip of distant red-bean field: four long horizontal curved furrow bands in alternating warm browns, thinner "
       "toward the top, dotted with tiny red bean pods. Much wider than tall.", wide=True),
  prop('a3_field', PAL_DAY,
       "A wide strip of the MAIN red-bean field (patbat): two wide brown furrow ridges with rows of low red bean plants made of "
       "green paper leaves and clusters of RED bean pods; the plants are short in the middle and a bit taller at both ends, and "
       "a small woven straw basket sits at the far left end. Much wider than tall.", wide=True, nogreen=False),
  prop('a3_fg_branch', PAL_DAY,
       "A persimmon tree branch reaching in from the left with bright orange persimmons and a few red and orange autumn leaves.",
       nogreen=False),
  prop('a3_fg_grass', PAL_DAY,
       "A clump of four or five silver-white pampas grass (eoksae) plumes on thin straw-gold stems, standing upright."),
]

# ===== 극장 장치 (3장) =====
jobs += [
  sheet('t3_hall', PAL_THEATER,
        "Scene: the INSIDE of a small cozy old paper puppet theater hall seen from the audience, straight-on: warm dark wood-brown "
        "walls with tall bean-red pilasters trimmed in gold on both sides, a row of small round paper lanterns glowing amber "
        "along the ceiling, and a big plain very dark brown rectangular stage opening filling the CENTER of the image. No "
        "curtains, no audience, no people.", extra_neg=", audience, people, curtain, stage props"),
  prop('t3_audience', PAL_THEATER,
       "The backs of the heads of a cheerful audience of children and little animals sitting in THREE rows, seen from behind, "
       "as flat dark silhouettes in three warm browns (back row lightest): rabbit ears, bear ears, cat ears, children with hair "
       "buns and bobbed hair, a few little raised hands. Much wider than tall.", wide=True),
  prop('t3_plaque', PAL_THEATER,
       "A blank hanging title plaque for a puppet theater: a wide rectangular bean-red lacquer board with a straw-gold frame and "
       "small gold corner ornaments, hung from two gold cords rising from its top corners. The board face is EMPTY with no "
       "writing.", extra_neg=", letters, writing, calligraphy"),
]

# ===== 호랑이: 만화 컷 그림체로 통일한 무대용 자세 (7장) =====
jobs += [
  tiger('tiger_stand', "Pure side profile facing LEFT, standing on four legs, walking pose, friendly."),
  tiger('tiger_fallen', "Slipped and fallen flat on its BACK with all four legs up in the air, belly up, dizzy swirly eyes, lying horizontally, side view with head to the LEFT."),
  tiger('tiger_flat', "Lying flat on its belly stretched out long and exhausted, chin on the ground, legs splayed, dazed eyes, lying horizontally, side view facing LEFT."),
  tiger('tiger_dizzy', "Sitting on its bottom, dazed with a bump on its head and a ring of little paper stars circling above the head, side view facing LEFT."),
  tiger('tiger_eyehurt', "Standing on hind legs, covering one eye with a front paw, the other eye squinting, 'ouch' expression, side view facing LEFT."),
  tiger('tiger_handhurt', "Standing, shaking one front paw in the air after being bitten, tears in its eyes, side view facing LEFT."),
  tiger('tiger_bow', "Politely bowing forward at the end of a play, wearing two small cream paper bandages (one on the head, one on the cheek), sheepish smile, side view facing LEFT."),
]

json.dump(jobs, open(os.path.join(HERE, 'jobs_night1.json'), 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs:', ', '.join(j['name'] for j in jobs))
