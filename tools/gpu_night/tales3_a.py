"""새 동화 9편 중 늑대 3부작: 아기 돼지 삼형제 · 늑대와 일곱 아기 염소 · 빨간 모자 (build_tales3_jobs.py 가 불러 쓴다)"""
from build_tales2_jobs import *

# ---- 늑대 바이블: 3편 공용. 이빨 안 보이게, 길쭉한 회색 종이, 얄밉지만 무섭지 않게 ----
WOLF = ("The wolf: a long, lanky silver-grey wolf made of flat paper pieces — a long narrow snout with a big round dark-blue nose, two "
        "tall pointed ears with pink insides, big round white eyes with dark pupils under sly half-closed lids, a cream muzzle, chest and "
        "belly, thin long legs, a long bushy tail with a darker grey tip, NO teeth showing, a cheeky smirk — funny and sneaky, never scary. ")
OBJ = "OBJECT, not a character: NO face, NO eyes, NO mouth, NO cheeks. "
OBJN = ", face, eyes, mouth, cheeks, character, smiling object"

def p(name, body, **k): return prop(name, body, **k)
def o(name, body, **k): return prop(name, OBJ + body, neg=OBJN + k.pop('neg', ''), **k)
def og(name, body, **k): return gprop(name, OBJ + body, neg=OBJN + k.pop('neg', ''), **k)

# ================= 아기 돼지 삼형제 (three_pigs) =================
PIG = ("a cute round pink piglet made of flat paper pieces — a big round snout with two nostril dots, small folded ears, a little curly "
       "tail, stubby arms and legs, big round eyes, pink cheek circles; ")
PIG1 = f"The first pig: {PIG}wearing a straw-gold scarf and a small straw hat. "
PIG2 = f"The second pig: {PIG}wearing sky-blue overalls with two round buttons. "
PIG3 = f"The third pig: {PIG}wearing brick-red overalls and a small cream cap, a little bigger than his brothers. "
MAMAPIG = f"Mama pig: {PIG}a plump round pig with a bean-red headscarf, a cream apron and a small basket on her arm. "
PIGS = [('1', PIG1, 'straw'), ('2', PIG2, 'wood'), ('3', PIG3, 'brick')]
three_pigs = [
    # 배경 11 (맨 앞 3장 = 파일럿: 초원·늑대·막내 돼지)
    sheet('tp_bg_meadow', PASTEL, "Scene: a wide green-and-gold meadow with a small cosy cottage with a red roof on the left, a winding "
          "sandy path to the right, soft rolling hills, a few round trees, a pale blue sky with puffy clouds, a big orange flower in the "
          "right foreground. Open meadow in the middle."),
    # (tp_wolf_walk, tp_pig3_base 는 아래 포즈에서)
    sheet('tp_bg_shop', SPRING, "Scene: a sunny crossroads building-material stall seen straight-on: a wooden market stall with a striped "
          "red-and-cream awning, empty wooden shelves and a flat empty counter in the middle, a path in front, a pale sky. Open counter space."),
    sheet('tp_bg_strawlot', PASTEL, "Scene: a sunny yellow-gold wheat field building site: soft golden fields, a flat empty patch of "
          "ground in the middle, a few haystacks far away, pale hills, a pale blue sky."),
    sheet('tp_bg_woodlot', PASTEL, "Scene: a sunny pine-and-birch wood edge building site: slim paper tree trunks in layers, a flat "
          "empty clearing of ground in the middle, a few stumps at the edges, a pale blue sky."),
    sheet('tp_bg_bricklot', SPRING, "Scene: a side view of a sunny hillside building site: a flat empty ground in the middle with a "
          "stack-of-bricks-free space, a red clay path, soft hills, a few round trees, a pale sky."),
    sheet('tp_bg_wolflow', PASTEL, "Scene: a LOW-ANGLE view from the ground looking up: big blades of grass and flowers in the "
          "foreground, tall trees, a big pale sky with soft clouds. Open sky in the upper middle."),
    sheet('tp_bg_field', SPRING, "Scene: a HIGH-ANGLE view looking down on a wide meadow with three empty flat building plots in a row "
          "marked by small stones, a winding path linking them, patches of flowers. Plots clear."),
    sheet('tp_bg_brick_out', PASTEL, "Scene: OUTSIDE the front of a sturdy brick house seen straight-on, only the empty ground and "
          "grass, a stone doorstep, a pale sky and a tall tree on the right. The left half is open grass."),
    sheet('tp_bg_brick_in', INDOOR, "Scene: INSIDE a cosy brick house: a warm brick wall with a round window, a fireplace with a big "
          "empty iron pot hook, a wooden table and a wooden floor, soft warm light. Open floor in the middle."),
    sheet('tp_bg_chimney', INDOOR, "Scene: a VERTICAL cut-away of a brick chimney: a dark brick shaft above, a cosy hearth at the bottom "
          "with a bright warm fire and an iron pot hung over it, a roof with a chimney top in a pale sky at the very top. Shaft clear."),
    sheet('tp_bg_sunset', SUNSET, "Scene: a wide meadow at sunset: a big soft apricot sun low at the left, golden hills, empty "
          "flat ground in the middle for houses, a winding path, a few round trees."),
    # 늑대 7
    p('tp_wolf_walk', f"{WOLF}Walking along, side view facing LEFT, tail swaying, hands behind his back, a slight smirk."),
    p('tp_wolf_sniff', f"{WOLF}Sniffing the air, side view facing LEFT, snout raised, eyes closed, little curly smell lines."),
    p('tp_wolf_blow', f"{WOLF}Front view, taking a deep breath, cheeks puffed out round like balloons, eyes squeezed shut, cheeks round and big."),
    p('tp_wolf_puff', f"{WOLF}Side view facing LEFT, blowing a big breath out, round open mouth, white swirly wind lines out in front."),
    p('tp_wolf_tired', f"{WOLF}Front view, sitting exhausted, tongue out, sweat drops, drooping ears, a bit silly."),
    p('tp_wolf_roof', f"{WOLF}Crawling up on all fours, seen from the side facing LEFT, sneaky determined face."),
    p('tp_wolf_hot', f"{WOLF}Front view, jumping up with a surprised face, mouth a round 'O', eyes wide, bottom steaming with little steam "
      "curls, hands on his bottom."),
    p('tp_wolf_flee', f"{WOLF}Running away fast, side view facing RIGHT, ears flying back, tail up, small dust clouds."),
]
for n, d, mat in PIGS:
    three_pigs += [
        p(f'tp_pig{n}_base', f"{d}Standing, front view, waving with a big smile."),
        p(f'tp_pig{n}_build', f"{d}Working hard, side view facing LEFT, carrying or hammering with a happy focused face."),
        p(f'tp_pig{n}_play', f"{d}Front view, playing music happily, " + {'1': 'blowing a little wooden flute', '2': 'playing a small violin',
          '3': 'beating a small drum'}[n] + "."),
        p(f'tp_pig{n}_flee', f"{d}Running away, side view facing RIGHT, arms swinging, a scared-but-funny face."),
        p(f'tp_pig{n}_joy', f"{d}Front view, jumping with joy, arms up, mouth open in a happy cheer."),
    ]
three_pigs += [
    p('tp_mama', f"{MAMAPIG}Front view, waving goodbye with a warm smile."),
    o('tp_straw', "A neat bundle of golden straw tied with a cord, side view, soft yellow-gold paper strands."),
    o('tp_wood', "A neat stack of three light-brown wooden planks, side view, with visible wood grain."),
    o('tp_bricks', "A small stack of six red-brown bricks, side view, with cream mortar edges."),
    o('tp_brick1', "ONE single red-brown brick, side view, flat and simple, cream edge lines."),
    o('tp_house_straw', "A small cute straw-roofed hut made of golden straw bundles, front view, a round door and a tiny round window."),
    o('tp_house_straw_ruin', "A scattered pile of golden straw pieces, loose strands and a broken door lying flat, front view."),
    o('tp_house_wood', "A small wooden plank house with a brown roof, front view, a round door and a square window."),
    o('tp_house_wood_ruin', "A scattered pile of broken wooden planks and a loose door and roof, front view."),
    o('tp_house_brick', "A sturdy little red-brick house with a dark roof, a stone chimney, a round blue door and a small window, front view."),
    o('tp_pot', "A big black iron cooking pot with two handles, bubbling with simple white bubbles, side view."),
    o('tp_fan', "A big round paper hand fan with a wooden handle, painted with simple white swirls, front view."),
    o('tp_instruments', "A little wooden flute, a small brown violin with a bow, and a small round drum with two sticks, laid out together."),
    # 컷 8
    cut('tp_cut_strawhat', CUT_MOOD, f"Funny: the wolf stands with a pile of straw landing on his head like a hat, blinking, straw strands "
        f"everywhere. {WOLF}"),
    cut('tp_cut_planks', CUT_MOOD, f"CRASH: a wooden house falls apart into flying planks and boards with yellow starbursts, the wolf's "
        f"cheeks puffed in the corner. {WOLF}"),
    cut('tp_cut_tired', CUT_MOOD, f"The wolf slumped on the ground panting, tongue out, a small brick house standing proud behind him, "
        f"swirly dizzy stars. {WOLF}"),
    cut('tp_cut_crawl', CUT_MOOD, f"The wolf sneaking up a roof toward a chimney, a big moon of pale sky behind, comic tiptoe. {WOLF}"),
    cut('tp_cut_chimney', CUT_MOOD, f"The wolf sliding down a dark brick chimney with his arms up and a surprised round mouth, soot-free, "
        f"speed lines. {WOLF}"),
    cut('tp_cut_splash', CUT_MOOD, f"SPLASH: the wolf's bottom just lands in a big black pot with a round bubbly splash, steam clouds, "
        f"startled face. {WOLF}"),
    cut('tp_cut_launch', CUT_MOOD, f"The wolf shoots up out of a chimney like a rocket, steam trail, a pink glowing bottom, tail on fire "
        f"just a small orange puff, eyes round. {WOLF}"),
    cut('tp_cut_village', SUNSET, f"Three cute little red brick houses in a row at sunset with the three little pigs waving in front. "
        f"{PIG1}{PIG2}{PIG3}"),
]

# ================= 늑대와 일곱 마리 아기 염소 (wolf_goats) =================
KIDG = ("a cute round little goat kid made of flat paper pieces — a soft cream-white body, two tiny round horns, floppy ears with pink "
        "insides, a small beard tuft, little cream hooves, big round eyes, pink cheek circles, a round bell on a ribbon at the neck; ")
KIDS = [('1', 'red', 'the biggest'), ('2', 'orange', 'a little smaller'), ('3', 'golden-yellow', 'medium sized'),
        ('4', 'pink', 'medium sized'), ('5', 'sky-blue', 'a little small'), ('6', 'purple', 'small'), ('7', 'white', 'the tiniest')]
MAMAG = ("Mama goat: a gentle plump cream-white goat made of flat paper pieces — two small curved horns, long floppy ears, a soft beard, "
         "WHITE hooves, a bean-red apron with a cream pocket, a woven basket on her arm, kind eyes, pink cheek circles. ")
wolf_goats = [
    sheet('wg_bg_kitchen', INDOOR, "Scene: a cosy farmhouse kitchen seen straight-on: a cream plaster wall, a window at the left with "
          "a sunny meadow outside, a stove with a kettle on the right, a hanging row of pots, a tall grandfather clock against the "
          "back wall, a warm wooden floor. Open floor in the middle."),
    sheet('wg_bg_house', INDOOR, "Scene: the WHOLE room of a farmhouse shown at once: a grandfather clock on the left, a big bed with a "
          "quilt, a table with a tablecloth, a cupboard high on the wall, a curtained window, a laundry basket, a stove. Floor clear in the middle."),
    sheet('wg_bg_door', PASTEL, "Scene: the FRONT of a farmhouse seen straight-on, a big round-topped wooden door with a black latch in "
          "the middle, a stone step, flowers on both sides, a pale sky above the thatched roof."),
    sheet('wg_bg_inside_door', INDOOR, "Scene: INSIDE looking at the back of the farmhouse front door: a round-topped wooden door "
          "with a big latch, a small round peek window at its top, a warm wall on both sides, a warm wooden floor. Open floor."),
    sheet('wg_bg_window', PASTEL, "Scene: a CLOSE-UP of a window sill from outside: a wooden window frame with white shutters and "
          "a flat empty wooden sill, flowers below, a warm lit room inside the window glass."),
    sheet('wg_bg_messy', INDOOR, "Scene: the same cosy farmhouse room but messy and EMPTY: a toppled stool, a rumpled quilt on the floor, "
          "a spilled basket, a stove, a grandfather clock at left, a warm floor. No animals."),
    sheet('wg_bg_tree', SUNSET, "Scene: a low-angle view of a peaceful meadow under a big old tree with a wide leafy canopy casting "
          "soft shade, long grass in the foreground, a pale peach sky, distant hills. Open shade at the lower middle."),
    sheet('wg_bg_shadow', INDOOR, "Scene: a SHADOW-PLAY screen: a big glowing cream-white paper screen filling the whole frame, lit "
          "from behind with warm amber light, a soft darker brown wooden frame at the edges, a wooden table edge at the bottom."),
    sheet('wg_bg_well', PASTEL, "Scene: a meadow with a round stone well with a little wooden roof on the right, flowers in the grass, "
          "a fence, hills, a pale blue sky. Open grass on the left and middle."),
    sheet('wg_bg_wellTop', PASTEL, "Scene: a HIGH-ANGLE view looking straight down at a round stone well with a dark water circle in "
          "the middle, surrounded by soft green grass and flowers, a wide empty ring of grass around it."),
]
for n, c, size in KIDS:
    d = f"Kid {n}: {KIDG.replace('a round bell on a ribbon', 'a round ' + c + ' bell on a ribbon')}{size} of the seven. "
    wolf_goats += [
        p(f'wg_kid{n}_base', f"{d}Standing, front view, smiling."),
        p(f'wg_kid{n}_joy', f"{d}Jumping happily with all four hooves off the ground, mouth open in a cheer."),
    ]
wolf_goats += [
    p('wg_mama_basket', f"{MAMAG}Standing, front view, holding the basket, smiling."),
    p('wg_mama_warn', f"{MAMAG}Front view, one hoof raised, a firm kind face, as if saying 'be careful'."),
    p('wg_mama_surprise', f"{MAMAG}Front view, hooves up near her cheeks, wide eyes, round mouth."),
    p('wg_mama_scissors', f"{MAMAG}Front view, holding a big pair of paper scissors up in one hoof, a determined look."),
    p('wg_mama_dance', f"{MAMAG}Front view, dancing happily on her back legs, arms out, a big smile."),
    p('wg_wolf_knock', f"{WOLF}Front view, standing at a door and knocking with one paw, polite sneaky grin."),
    p('wg_wolf_chalk', f"{WOLF}Front view, chewing a big white stick of chalk, eyes squeezed shut, chalk dust, funny face."),
    p('wg_wolf_flour', f"{WOLF}Front view, holding up one paw dusted white with flour, about to sneeze, eyes squinting, white flour puffs."),
    p('wg_wolf_belly', f"{WOLF}Lying asleep on his back under a tree, side view, a very big round belly, a tiny 'zzz' puffing, snoring."),
    p('wg_wolf_heavy', f"{WOLF}Walking unsteadily on wobbly legs, side view facing LEFT, a huge round heavy belly dragging, dazed face."),
    p('wg_wolf_splash', f"{WOLF}Falling, front view, arms and legs flailing, a startled round mouth, big splashes."),
    p('wg_wolf_flee', f"{WOLF}Running away fast with a wet dripping coat, side view facing RIGHT, splashes flying off, ears flat."),
    o('wg_clock', "A tall wooden grandfather clock with a round white clock face, a swinging gold pendulum and a small door at the "
      "bottom, front view, door closed."),
    o('wg_clock_open', "A tall wooden grandfather clock with a round white clock face, the small door at the bottom OPEN showing "
      "a dark empty space inside, front view."),
    o('wg_quilt', "A thick soft quilted blanket with patches in cream and peach, loosely bunched, front view."),
    o('wg_laundry', "A round woven laundry basket with a few cream cloths peeking out, front view."),
    o('wg_chalk', "A big white stick of chalk, slightly crumbly, lying flat, front view."),
    o('wg_flour', "A round cream flour sack tied at the top with a rope, white powder puffing out, front view."),
    o('wg_scissors', "A big pair of paper scissors with orange handles, open, front view, simple flat shapes."),
    o('wg_stone', "One smooth round grey stone, front view, plain flat paper circle with a slight shade."),
    o('wg_needle', "A big silver sewing needle with a loop of red thread, simple flat shape."),
    # 컷 9
    cut('wg_cut_chalk', CUT_MOOD, f"The wolf crunching a huge stick of white chalk, chalk dust flying, a high squeaky 'ah-ah' face, "
        f"funny. {WOLF}"),
    cut('wg_cut_voice', CUT_MOOD, f"Inside a room looking at a closed round-topped door with seven little goat kids' ears peeking "
        f"around corners, a long dark paw shadow under the door. {KIDG}"),
    cut('wg_cut_flour', CUT_MOOD, f"A-CHOO: the wolf's paw is white with flour and he sneezes with a big white puff of flour all over "
        f"his face. {WOLF}"),
    cut('wg_cut_dark', "Colour mood: soft, bright night picture-book blues, never black. ", "A round-topped wooden door swinging open "
        "into a warm dark room, a big sleepy-looking shadow of a tall pointed-ear wolf with a round belly bulging, everything simple "
        "paper silhouettes, no faces.", night=True),
    cut('wg_cut_belly', SUNSET, f"A wolf silhouette on a meadow at dusk with a big round bulging belly, walking away slowly, a pale "
        f"moon, no teeth, calm. {WOLF}", night=False),
    cut('wg_cut_pop', CUT_MOOD, "POP! A little cream-white goat kid with a red bell leaps into the air out of a glowing paper screen "
        "with a round star burst, arms spread, joy."),
    cut('wg_cut_stitch', "Colour mood: soft warm amber glow behind a white paper screen, black paper cut silhouettes. ",
        "Shadow play on a white screen: the silhouette of Mama goat with a big needle sewing a round belly of a sleeping wolf with "
        "stitch lines, six little stones beside, charming and gentle, no gore."),
    cut('wg_cut_splash', CUT_MOOD, f"SPLASH: the wolf falls into a round stone well with a huge round water splash, his tail in "
        f"the air, a funny surprised face. {WOLF}"),
    cut('wg_cut_dance', SUNSET, f"A joyful circle dance around a stone well at sunset: Mama goat and seven little goat kids with "
        f"coloured bells holding hooves in a circle. {MAMAG}{KIDG}"),
]

# ================= 빨간 모자 (red_hood) =================
RED = ("Little Red Riding Hood: a small girl in picture-book style — a round face, brown hair in two short pigtails, big round eyes, "
       "pink cheeks, a bright poppy-red hooded cape with a cream trim and a gold clasp, a cream blouse, a bean-brown skirt, red shoes. ")
GRAN = ("Grandma: a kind plump old grandma in picture-book style — a white bun, round glasses, closed smiling eyes, a lavender "
        "nightgown with a cream shawl, rosy cheeks. ")
MAMA2 = ("Mama: a young kind mama in picture-book style — brown hair in a low bun, a persimmon-orange dress with a cream apron, rosy "
         "cheeks. ")
HUNT = ("The hunter: a jolly big hunter in picture-book style — a round friendly face, a brown beard, a tall brown felt hat with a "
        "red feather, a brown vest, a belted jacket, boots. ")
GRANWOLF = (f"{WOLF}Disguised as grandma: wearing a cream nightcap and a lavender nightgown with round glasses on his long snout, "
            "his pointed ears poking out of the cap. ")
red_hood = [
    sheet('rh_bg_kitchen', INDOOR, "Scene: a cosy farmhouse kitchen seen straight-on: a window at the right with a sunny garden, a "
          "wooden table with a cloth in the middle, a stove on the left, a shelf with jars, a warm plank floor. Table top flat and clear."),
    sheet('rh_bg_door', PASTEL, "Scene: a country cottage front seen straight-on at the left edge with an open wooden door, a garden "
          "path leading out to the right and a tall forest edge far away, flowers and a fence, a pale sky. Open path in the middle."),
    sheet('rh_bg_trail', PASTEL, "Scene: an eye-level view of a forest trail: slim paper trunks in layers, big ferns in the left and "
          "right foreground, a winding sandy path in the middle, dappled soft sunlight, a pale sky."),
    sheet('rh_bg_tree', PASTEL, "Scene: a sunny forest bend: one big old tree with a thick trunk and a hollow on the right, ferns "
          "and flowers, a path on the left, soft pine greens in layers, a pale sky."),
    sheet('rh_bg_flowers', SPRING, "Scene: a HIGH-ANGLE view looking down on a big sunny flower meadow, a wide soft grass floor "
          "dotted with many RED, YELLOW and BLUE round-petal flowers in clear groups, a tiny path at the bottom, trees at the top edge."),
    sheet('rh_bg_shortcut', PASTEL, "Scene: a forest shortcut at the bottom of a split screen: a narrow dirt track through thick paper "
          "bushes and roots going toward the right, trees in layers, a pale sky in the far top. Open track."),
    sheet('rh_bg_cottage', PASTEL, "Scene: a LOW-ANGLE view looking up at a little forest cottage door: a round-topped brown wooden "
          "door in the centre, a stone step, a tiny window, a thatched roof, ferns at the bottom, a pale sky."),
    sheet('rh_bg_bed', INDOOR, "Scene: a CLOSE-UP of a grandma's bed: a big wooden headboard, a round-edged quilt in lavender and "
          "cream, a big pillow, a wall at the back with a big EMPTY wooden picture frame on the right, a wooden night table at the left."),
    sheet('rh_bg_room', INDOOR, "Scene: grandma's whole cottage bedroom seen straight-on: a tall wooden wardrobe at the left, a bed at "
          "the right, a window in the middle, a warm plank floor, a lavender rug. Open floor in the middle."),
    sheet('rh_bg_table', SUNSET, "Scene: grandma's cottage at afternoon tea time seen straight-on: a table with a cloth in the "
          "middle, a window with a sunset glow, a shelf of jars on the wall, a warm plank floor. Table top clear."),
    p('rh_hood_walk', f"{RED}Walking happily, side view facing RIGHT, humming, swinging a woven basket."),
    p('rh_hood_walk2', f"{RED}Walking, side view facing RIGHT, the OTHER leg forward, basket swinging the other way, humming."),
    p('rh_hood_pick', f"{RED}Bending down to pick a flower, side view facing LEFT, one small flower in her hand, a basket beside her."),
    p('rh_hood_knock', f"{RED}Seen from behind, standing and knocking on a door with one fist raised."),
    p('rh_hood_wonder', f"{RED}Front view, head tilted to one side, one finger on her chin, curious eyes."),
    p('rh_hood_surprise', f"{RED}Front view, hands up near her cheeks, eyes big, mouth a round 'O'."),
    p('rh_hood_hide', f"{RED}Peeking out from behind a door, only her head and hood and one hand visible, finger on her lips."),
    p('rh_hood_joy', f"{RED}Front view, jumping with joy, arms up, a big smile."),
    p('rh_wolf_peek', f"{WOLF}Peeking out from behind a tree trunk, only his face and one ear visible, sneaky smile."),
    p('rh_wolf_whisper', f"{WOLF}Side view facing LEFT, bending low, one paw to the side of his mouth as if whispering a secret."),
    p('rh_wolf_run', f"{WOLF}Running fast on all fours, side view facing RIGHT, speed lines, determined sly face."),
    p('rh_wolf_granny', f"{GRANWOLF}Sitting up in bed under a quilt, front view, a sweet fake smile. Show only from the waist up."),
    p('rh_wolf_jump', f"{GRANWOLF}Jumping up out of bed with arms up, a surprised mad face, the quilt flying."),
    p('rh_wolf_sleep', f"{GRANWOLF}Lying asleep in the bed, side view, a big round belly under the quilt, snoring."),
    p('rh_wolf_hiccup', f"{WOLF}Front view, holding his belly and bouncing, hiccupping with a round 'O' mouth, a small 'hic' star."),
    p('rh_wolf_flee', f"{WOLF}Running away fast, side view facing RIGHT, his granny nightcap flying off, ears flat."),
    p('rh_granny_home', f"{GRAN}Sitting in an armchair with a book, front view, smiling."),
    p('rh_granny_pop', f"{GRAN}Front view, popping up with arms up in a happy cheer, a round 'pop' star behind her."),
    p('rh_granny_tea', f"{GRAN}Front view, pouring tea from a teapot into a teacup, kind smile."),
    p('rh_mama', f"{MAMA2}Front view, holding a woven basket out, a gentle smile."),
    p('rh_hunter_walk', f"{HUNT}Walking, side view facing LEFT, a cheerful smile."),
    p('rh_hunter_tickle', f"{HUNT}Front view, wiggling his fingers to tickle, a big grin, leaning forward."),
    p('rh_hunter_laugh', f"{HUNT}Front view, laughing out loud with his belly shaking, hands on his hips."),
    o('rh_basket', "A round woven basket with a red-and-white checked cloth cover and a curved handle, front view."),
    o('rh_bread', "A big round golden loaf of bread with a few scored lines, front view."),
    o('rh_milk', "A tall cream-white milk bottle with a round red cap, front view."),
    o('rh_apple', "One shiny round red apple with a short brown stem and a small leaf, front view."),
    o('rh_flower_red', "One big red round-petal flower with a gold centre and a short stem with two leaves, front view."),
    og('rh_flower_yellow', "One big yellow round-petal flower with a brown centre and a short stem with two leaves, front view."),
    og('rh_flower_blue', "One big sky-blue round-petal flower with a gold centre and a short stem with two leaves, front view."),
    o('rh_vase_red', "A round red ceramic vase with a short neck and a cream band, front view, empty."),
    o('rh_vase_yellow', "A round yellow ceramic vase with a short neck and a cream band, front view, empty."),
    o('rh_vase_blue', "A round sky-blue ceramic vase with a short neck and a cream band, front view, empty."),
    o('rh_frame', "A big wooden picture frame holding a simple painted portrait of a kind old grandma with a white bun, round "
      "glasses and a lavender dress, normal-sized ears and eyes, front view."),
    o('rh_wardrobe', "A tall wooden wardrobe with two arched doors and little gold knobs, front view, doors closed."),
    cut('rh_cut_tail', CUT_MOOD, f"A forest trail where a long bushy grey tail just peeks out behind a tree trunk while a small girl "
        f"in a red hood walks happily by, unaware. {RED}"),
    cut('rh_cut_whisper', CUT_MOOD, f"The wolf whispers sneakily to the girl in the red hood beside a tree, a little cloud of "
        f"thought flowers above her head. {WOLF}{RED}"),
    cut('rh_cut_dash', CUT_MOOD, f"The wolf dashing along a forest shortcut with huge speed lines, a little cloud of dust, a tiny cottage "
        f"far away. {WOLF}"),
    cut('rh_cut_gulp', "Colour mood: soft, bright night picture-book blues, never black. ", f"A round-topped cottage door closes "
        "with a gentle thump, a warm window glow, a long pointed-ear wolf silhouette in the window, no faces, paper silhouettes.",
        night=True),
    cut('rh_cut_granwolf', CUT_MOOD, f"{GRANWOLF}Smiling sweetly from a bed with a quilt, a pair of round glasses sliding down his "
        "snout, comic."),
    cut('rh_cut_jumpup', CUT_MOOD, f"The wolf jumps up out of bed suddenly with the quilt flying and a small girl in a red hood "
        f"hopping off to the left toward a wardrobe. {GRANWOLF}{RED}"),
    cut('rh_cut_hiccup', CUT_MOOD, f"HIC! The wolf bounces from a hiccup while a hunter tickles his belly, and a little grandma "
        f"pops out from his open round mouth with a star burst. {WOLF}{HUNT}{GRAN}"),
]
