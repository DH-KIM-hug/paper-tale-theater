#!/usr/bin/env python3
"""밤샘 GPU 작업 목록(jobs_night1.json) 생성.

배경 레이어는 모두 '무대 전체 한 장'(1760x992)으로 만든다. 이미지 한 장이 무대 좌표
x -150~1150, y -80~680 을 덮는다고 보고 위치를 퍼센트로 지시한다
(가로 % = (x+150)/13, 세로 % = (y+80)/7.6, 바닥선 y=520 → 79%).
비워 둘 곳은 라임색 → chromakey로 투명 처리(트림 없음, 위치 유지).
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

def bg(name, pal, body, opaque=False, extra_neg=''):
    tail = ("A FULL-BLEED sheet filling the ENTIRE image edge to edge with NO lime green anywhere. " if opaque
            else LIME + NO_OUTSIDE_SHADOW)
    return {'name': name, 'w': 1760, 'h': 992, 'cfg': 3.0, 'key': not opaque, 'trim': False,
            'negative': NEG_BG + extra_neg,
            'prompt': f"{STYLE} {pal}{BACKLIT}{body} {tail}No text, no watermark."}

TIGER = ("The tiger is a cute chubby Korean folk-tale tiger cub made of flat paper pieces: persimmon-orange body with "
         "separate dark-brown stripe pieces, cream muzzle and belly patch, BIG round white paper eyes with dark pupils, "
         "small pink cheek circles, small rounded ears, a thick striped tail — never scary, no fangs, no claws. ")
NEG_CHAR = NEG + ", scary, realistic tiger, fangs, claws, blood, human, person, two tigers, duplicate tiger, text"

def tiger(name, pose):
    return {'name': name, 'w': 1024, 'h': 1024, 'cfg': 3.0, 'key': True, 'trim': True, 'negative': NEG_CHAR,
            'prompt': (f"{STYLE} Palette: persimmon #E8703A, bark brown #6B4A32, paper cream #F6ECD8, pink cheeks. "
                       f"{TIGER}{pose} Exactly ONE tiger, whole body visible, centered. "
                       f"Isolated on a plain solid lime green (#7CFC00) background, nothing else. {NO_OUTSIDE_SHADOW}"
                       "No text, no watermark.")}

jobs = []

# ---------- 시범 3장 (씬3 하늘 · 씬3 집 · 지게 컷) ----------
jobs.append(bg('c3_sky', PAL_NIGHT,
    "Scene: a clear winter night sky over a Korean seaside village. The sky is built from flat paper pieces of rich MEDIUM "
    "indigo blue (never black). A SMALL round layered paper full moon (two stacked cream circles, about 9 percent of the image "
    "width) sits at 79 percent width and 20 percent height, surrounded by THREE concentric flat paper halo rings stepping "
    "from pale cream to soft lavender to indigo. Seven or eight small cut-paper star shapes scattered in the upper half. "
    "The lower 40 percent of the sky is a slightly lighter indigo paper band.", opaque=True,
    extra_neg=", big moon, cropped moon, black sky, gradient sky, sunset"))
jobs.append(bg('c3_house', PAL_NIGHT,
    "Scene layer: ONE complete traditional Korean thatched-roof farmhouse (choga) seen straight from the front, standing "
    "between 13 and 36 percent of the image width, its ground line at 79 percent height, the straw roof ridge at about "
    "37 percent height and the eaves at about 49 percent height. Thick rounded straw roof made of big scalloped straw-gold "
    "paper layers with a thin snow cap, cream clay walls, dark wooden posts, a low wooden porch (toenmaru) along the front, "
    "a paper-latticed door and one window glowing warm amber from inside. The door faces the yard to the right. "
    "The whole house is fully visible, not cropped.",
    extra_neg=", two houses, cropped house, modern house, tiled roof"))
jobs.append({'name': 'cut_jige', 'w': 1024, 'h': 768, 'cfg': 3.0, 'key': False, 'trim': False,
    'negative': NEG_CHAR + ", frame, border, comic panel border, standalone tiger, tiger sitting outside the mat, tiger standing, tiger body visible, empty mat, two rolls",
    'prompt': (f"{STYLE} This is one DRAMATIC COMIC ACTION PANEL filling the ENTIRE image edge to edge (full-bleed, no border): "
               "bold diagonal composition, big flat paper speed-line strips, kid-friendly and funny, never scary. "
               "Palette: deep indigo night, snow white, lavender sea, persimmon orange, straw gold, cream moon. "
               "A cute wooden A-frame carrier (jige) with a smiling face and little arms marches along a snowy dirt path toward "
               "the moonlit sea. On its back it carries ONE big straw mat ROLLED UP TIGHTLY into a thick cylinder and tied with "
               "straw rope; the tiger is COMPLETELY WRAPPED INSIDE the rolled mat — ONLY the tiger's round orange face with big "
               "worried eyes and two small ears peeks out of one end of the roll, and the striped tail tip dangles out of the "
               "other end. No other part of the tiger is visible and there is NO second tiger anywhere. Ahead, layered paper "
               "waves of the sea and a big cream paper moon. No text anywhere. Full-bleed illustration, no lime green.")})

# ---------- 씬3: 마당~바다 (나머지 8장) ----------
jobs += [
  bg('c3_far', PAL_NIGHT,
     "Scene layer: on the LEFT half, two overlapping ranges of snowy moonlit mountains — a lavender back range and an indigo "
     "front range with sharp peaks, each with one inner parallel ridge-line paper strip, small snow caps and a few flat "
     "snow-laden fir silhouettes; mountain tops between 38 and 50 percent height, the range ends around 55 percent width. "
     "On the RIGHT half there are NO mountains: a straight flat sea horizon at 60 percent height. Everything is anchored to "
     "the bottom; below 60 percent the layer is filled with dark indigo paper."),
  bg('c3_sea_far', PAL_NIGHT,
     "Scene layer: the FAR SEA on the right side only, from 55 percent to 100 percent width, between 58 and 72 percent height: "
     "three long horizontal rows of big loose scalloped paper wave strips in indigo and lavender, and ONE narrow golden "
     "moonlight path of stacked cream-gold paper slivers running from the horizon toward the viewer at 79 percent width. "
     "No mountains, no land in this layer."),
  bg('c3_village', PAL_NIGHT,
     "Scene layer: a distant Korean village on the LEFT between 0 and 45 percent width: three or four small thatched-roof "
     "houses in flat dark indigo-brown paper silhouettes with tiny amber window dots, and a soft row of pine tree silhouettes "
     "behind them. Their bases sit on a flat paper hill line at 66 percent height; nothing above 45 percent height; "
     "the right half is empty."),
  bg('c3_yard', PAL_NIGHT,
     "Scene layer: the front yard ground of a farmhouse: a flat packed-earth paper ground in warm bark brown with a thin "
     "wavy snow layer on top, spanning from 0 to 62 percent width, its top edge at about 74 percent height and filling down "
     "to the bottom of the image. On the far left, a small raised stone platform with three brown clay sauce jars (jangdokdae) "
     "wearing snow caps; at 55 percent width one small straw haystack. The CENTER between 30 and 52 percent width is left "
     "as clear open ground."),
  bg('c3_wall', PAL_NIGHT,
     "Scene layer: a short traditional Korean stone-and-earth wall (doldam) with a small dark roof-tile cap and a thin snow "
     "line, standing between 58 and 67 percent width, from 67 to 79 percent height, with an OPEN brushwood gate (sarip-mun) "
     "swung open at its right end. Nothing else."),
  bg('c3_road', PAL_NIGHT,
     "Scene layer: a narrow winding dirt path of flat light-brown paper with snowy edges, starting at the open gate at 66 "
     "percent width and 79 percent height, curving gently down and to the right as an S-shape, and ending on a small pale sand "
     "beach at 72 to 82 percent width near the bottom of the image. A few flat pebbles along the path."),
  bg('c3_sea', PAL_NIGHT,
     "Scene layer: the NEAR SEA on the right side, from 60 to 100 percent width, from 66 percent height down to the bottom: "
     "three to four big layered rows of scalloped paper waves stepping from indigo to lavender with white paper foam strips on "
     "the crests, two rounded dark paper rocks at the shore, and a pale sand beach edge where the path arrives. Around 83 "
     "percent width and 74 percent height the water is calm and open (a splash will be added there)."),
  bg('c3_fg', PAL_NIGHT,
     "Scene layer (nearest foreground frame): in the TOP-LEFT corner a bare persimmon tree branch with two orange persimmons "
     "and snow, reaching in from the left edge down to about 30 percent height; in the BOTTOM-RIGHT corner three tall reed "
     "stalks rising from the bottom edge; along the very bottom edge a thin strip of snow bank below 94 percent height. "
     "The whole middle of the image (from 15 to 85 percent width, 30 to 94 percent height) stays completely empty."),
]

# ---------- 씬2: 부엌 (5장) ----------
jobs += [
  bg('b3_kitchen_back', PAL_KITCHEN,
     "Scene: the BACK WALL of a traditional Korean earthen kitchen (buoak) at night, straight-on. Upper wall is cream clay "
     "paper, a warm ochre baseboard band (gutdori) runs from 66 to 79 percent height. Near the top center-right, between 59 "
     "and 70 percent width and 29 to 41 percent height, a small wooden-lattice window (salchang) with deep indigo moonlit sky "
     "behind the bars. On the right, between 76 and 83 percent width and from 50 to 79 percent height, a dark wooden door "
     "frame built into the wall with a closed plank door. Warm amber firelight glows on the LEFT part of the wall. "
     "Below 79 percent height a dark packed-earth floor strip.", opaque=True,
     extra_neg=", modern kitchen, tiles, chimney, big window, fireplace"),
  bg('b3_beams', PAL_KITCHEN,
     "Scene layer: the ceiling structure: one thick horizontal wooden main beam (daedeulbo) across the full width between 14 "
     "and 20 percent height, five or six flat rafter strips above it, and TWO long wooden hanging shelves (sirung) made of two "
     "poles each, spanning from 17 to 48 percent width at 36 and 45 percent height, hung by ropes from the beam. On the "
     "shelves hang or rest: a block of fermented soybean (meju) tied with straw rope, a round woven bamboo sieve (chaeban), "
     "two dried gourd dippers (bagaji), and a pair of straw sandals (jipsin)."),
  bg('b3_hearth', PAL_KITCHEN,
     "Scene layer: a BIG traditional Korean earthen stove (budumak) on the LEFT, from 14 to 37 percent width, its flat top at "
     "54 percent height and its base at 79 percent height: wide clay-brown platform built from straight flat paper blocks, "
     "TWO black iron cauldrons (gamasot) with domed lids sunk into the top, TWO dark arched fire mouths (agungi) at the front "
     "with warm amber embers glowing inside. Low Korean stove, NOT a fireplace, NO chimney.",
     extra_neg=", fireplace, chimney, western stove, flames leaping out"),
  bg('b3_floor', PAL_KITCHEN,
     "Scene layer: the kitchen dirt floor: a flat dark packed-earth paper band from 77 percent height to the bottom, with a "
     "slightly lighter front step edge (bongdang) at 88 percent height, one clear narrow CRACK in the floor at 50 percent "
     "width, and a few flat scattered straw bits. Nothing above 77 percent height."),
  bg('b3_fg', PAL_KITCHEN,
     "Scene layer (nearest foreground frame): a thick dark wooden post running the full height along the LEFT edge (0 to 8 "
     "percent width) and another along the RIGHT edge (92 to 100 percent width), and a dark eave band with a straw fringe "
     "across the very top (0 to 12 percent height). The whole middle stays completely empty."),
]

# ---------- 씬1: 가을 팥밭 (7장) ----------
jobs += [
  bg('a3_sky', PAL_DAY,
     "Scene: a warm autumn afternoon sky. A round layered paper sun (three stacked circles) at 21 percent width and 18 percent "
     "height, surrounded by THREE concentric flat paper halo rings stepping from cream to pale gold to apricot; the rest of "
     "the sky is built from a few large flat paper pieces in pale gold and cream, lighter near the sun.", opaque=True,
     extra_neg=", torn strips, horizontal bands, gradient sky, night, moon"),
  bg('a3_cloud', PAL_DAY,
     "Scene layer: two or three Korean folk-painting (minhwa) style clouds made of scalloped cream paper swirls with a pale "
     "gold inner layer, floating between 12 and 35 percent height, one at 45 percent width and one at 75 percent width, and "
     "a small V-shaped line of four flat paper wild geese silhouettes at 62 percent width and 14 percent height."),
  bg('a3_far', PAL_DAY,
     "Scene layer: three overlapping ranges of distant autumn mountains across the full width — pale ochre back range, "
     "golden ochre middle, rust-brown front — each with ONE inner parallel ridge-line paper strip (minhwa style); tops "
     "between 40 and 52 percent height; filled down to the bottom of the image."),
  bg('a3_mid', PAL_DAY,
     "Scene layer: a closer rolling rust-brown hill across the full width with its top between 50 and 58 percent height, two "
     "tall slim poplar trees at 18 and 24 percent width, a clump of three pine silhouettes at 88 percent width, and a tiny "
     "village of two small thatched-roof houses at 70 to 80 percent width on the hill. A light narrow footpath strip comes "
     "down the hill on the right from 85 percent width. Filled down to the bottom."),
  bg('a3_field_far', PAL_DAY,
     "Scene layer: distant bean-field furrows: four long horizontal curved paper furrow bands in alternating warm browns, "
     "getting thinner toward the back, between 60 and 72 percent height, with tiny red-podded bean plant dots on them. "
     "Filled down to the bottom with brown earth."),
  bg('a3_field', PAL_DAY,
     "Scene layer: the MAIN red-bean field (patbat) where the actors stand: two wide brown furrow ridges with the front ridge "
     "top exactly at 79 percent height, filled down to the bottom. Rows of red bean plants made of green paper leaves and "
     "clusters of RED bean pods stand on the furrows, kept LOW (short) between 30 and 73 percent width and taller at the "
     "sides. On the far left at 8 percent width a small woven straw basket on the field edge."),
  bg('a3_fg', PAL_DAY,
     "Scene layer (nearest foreground frame): in the TOP-LEFT corner a persimmon tree branch with bright orange persimmons "
     "and a few autumn leaves reaching in from the left edge down to about 28 percent height; at the BOTTOM-RIGHT and "
     "BOTTOM-LEFT corners a few silver pampas grass (eoksae) plumes rising from the bottom edge; a thin dark earth strip "
     "along the very bottom below 93 percent height. The whole middle stays completely empty."),
]

# ---------- 극장 장치 (3장) ----------
jobs += [
  bg('t3_hall', PAL_THEATER,
     "Scene: the INSIDE of a small cozy old paper puppet theater hall seen from the audience seats, straight-on: warm dark "
     "wood-brown walls with tall bean-red pilasters trimmed in gold, a row of small round paper lanterns glowing amber along "
     "the ceiling, and a big rectangular dark stage opening in the CENTER (from 18 to 82 percent width, 16 to 80 percent "
     "height) that is plain very dark brown (the stage will be placed there). No curtains, no audience, no people.",
     opaque=True, extra_neg=", audience, people, curtain, stage props"),
  bg('t3_audience', PAL_THEATER,
     "Scene layer: the backs of the heads of a cheerful audience of children and little animals sitting in THREE rows, seen "
     "from behind, as flat dark silhouettes only in three warm browns (back row lightest): rabbit ears, bear ears, cat ears, "
     "children with hair buns and bobbed hair, a few little raised hands. The rows fill the BOTTOM 45 percent of the image; "
     "everything above 55 percent height is empty."),
  {'name': 't3_plaque', 'w': 1024, 'h': 512, 'cfg': 3.0, 'key': True, 'trim': True, 'negative': NEG + ", text, letters, writing, calligraphy",
   'prompt': (f"{STYLE} {PAL_THEATER}A blank hanging title plaque for a puppet theater: a wide rectangular bean-red lacquer "
              "board with a straw-gold frame and small gold corner ornaments, hung from two gold cords rising to the top edge. "
              "The board face is EMPTY with no writing (a title will be added later). "
              f"Isolated on a plain solid lime green (#7CFC00) background. {NO_OUTSIDE_SHADOW}No text, no watermark.")},
]

# ---------- 호랑이: 무대용 그림체 통일 + 자세 (7장) ----------
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
