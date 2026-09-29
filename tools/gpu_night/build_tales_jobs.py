#!/usr/bin/env python3
"""새 동화 3편 페이퍼아트 애셋 목록 생성 → jobs_frog.json, jobs_rabbit.json, jobs_sunmoon.json
근거: TALES_PLAN.md §1~3, 임시 그림 버전(tales/*)의 장면 구성, DESIGN_SYSTEM.md.
방식은 build_jobs.py와 같다: sheet(화면 가득 불투명 배경) / prop(라임 배경 단독 요소 → 배경 제거·트림 → 코드에서 배치).
캐릭터는 생김새 설명(바이블)을 한 번 정하고 모든 자세에 똑같이 넣어 일관성을 지킨다."""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(HERE, 'style_base.json')))
STYLE, NEG = base['STYLE'], base['NEG']
NEG_BG = NEG + ", torn paper edge, deckled edge, empty flat background, large area of one plain color, text, letters"
NO_SHADOW = ("The paper pieces cast NO shadow onto the lime area: no drop shadow, no ground shadow, no backing shape — "
             "only tiny shallow shadows between their own stacked pieces. Do NOT paint any glow, halo or colour onto the "
             "lime background; the lime stays one perfectly flat uniform colour right up to the paper edges. ")
KID = ("Cute, round, friendly Korean picture-book characters for 3-4 year olds: big round white paper eyes with dark pupils, "
       "small pink cheek circles, simple rounded shapes, never scary. ")


DEPTH = ("A layered paper-cut diorama scene seen straight-on: the scene is built from SIX to EIGHT flat paper layers one behind "
         "another (far sky, distant hills, middle ground, ground, near foreground), each layer a cut-paper silhouette casting a soft "
         "warm shadow on the layer behind, giving strong depth like a shadow-box. Leave the lower middle of the image open and "
         "uncluttered so characters can stand there. ")


def sheet(name, pal, body, neg=''):
    return {'name': name, 'w': 1760, 'h': 992, 'cfg': 3.0, 'key': False, 'trim': False, 'negative': NEG_BG + neg,
            'prompt': f"{STYLE} {pal}{DEPTH}{body} A FULL-BLEED sheet filling the ENTIRE image edge to edge, no lime green, "
                      "no characters unless described. No text, no watermark."}


def prop(name, pal, body, wide=False, tall=False, nogreen=True, neg=''):
    w, h = (1760, 992) if wide else (768, 1280) if tall else (1024, 1024)
    return {'name': name, 'w': w, 'h': h, 'cfg': 3.0, 'key': True, 'trim': True, 'nogreen': nogreen,
            'negative': NEG_BG + ", glow on background, halo, green shadow, duplicate, two of them, color swatches, colour palette chart, stack of colored strips, sample color bars" + neg,
            'prompt': f"{STYLE} {KID}{body} Shown whole and uncropped, centered. "
                      f"Isolated on a plain solid flat lime green (#7CFC00) background, nothing else. {NO_SHADOW}No text, no watermark."}


def cut(name, pal, body, neg=''):
    return {'name': name, 'w': 1024, 'h': 768, 'cfg': 3.0, 'key': False, 'trim': False,
            'negative': NEG + ", frame, border, comic panel border, scary, blood, fangs, realistic animal, text, letters" + neg,
            'prompt': f"{STYLE} This is one DRAMATIC COMIC ACTION PANEL filling the ENTIRE image edge to edge (full-bleed, no "
                      f"border): bold dynamic composition, big flat paper speed-line strips, kid-friendly and funny, never scary. "
                      f"{pal}{KID}{body} No text anywhere. Full-bleed illustration, no lime green."}


# ================= 황소와 개구리 =================
P_POND = "Palette: pine green #3F6B4F, leaf green #6E9A5B, lily-pad green, lavender pond #8B7BB8, pale gold sky #F2DFA8, cream #F6ECD8, bark brown ox #6B4A32. Bright friendly pond. "
P_POND_NIGHT = "Palette: deep indigo night #1F2A56, lavender pond, pine green frogs, cream moon #F6ECD8, amber firefly dots. "
MOMFROG = "Mother frog: a chubby round pine-green frog made of flat paper pieces, cream belly patch, two big bulging eyes on top of her head, tiny pink cheeks, a small leaf-shaped bow on her head. "
BABY = "Baby frog: a small light leaf-green frog with a cream belly patch, big bulging eyes on top, pink cheeks. "
OX = "The ox: a big gentle Korean brown ox (hwangso) of flat bark-brown paper pieces, cream curved horns, lighter muzzle, kind round eyes, a small tail tuft. "
frog = [
    sheet('frog_bg_pond', P_POND, "Scene: a sunny morning pond seen straight-on: pale gold sky with a round paper sun, soft rolling hills, a wide lavender pond across the lower half with five round lily pads floating in a gentle row, cattails and reeds at both edges. No frogs."),
    sheet('frog_bg_meadow', P_POND, "Scene: a frog's-eye-level view of a meadow: HUGE blades of paper grass towering in the foreground at both sides, a dandelion, a ladybug on a blade, a snail, the sky far above. No frogs, no ox."),
    sheet('frog_bg_chart', P_POND, "Scene: a friendly height-chart wall made of cream paper with big colourful paper tick marks and a wooden floor strip, like a growth chart in a kindergarten, straight-on. No animals, no numbers."),
    sheet('frog_bg_pond_night', P_POND_NIGHT, "Scene: the same pond at night: indigo sky with a round cream moon and paper stars, dark hills, the lavender pond with five round lily pads in a row, a few amber fireflies. No frogs."),
    sheet('frog_q_tail', P_POND, f"Scene: an EXTREME close-up of only the TAIL of a big brown ox filling the frame — a long bark-brown paper tail with a dark tuft at its end, grass at the bottom. {OX}"),
    sheet('frog_q_hoof', P_POND, f"Scene: an EXTREME close-up of only the FRONT LEGS and dark split HOOVES of a big brown ox standing in grass, filling the frame. {OX}"),
    sheet('frog_q_horn', P_POND, f"Scene: an EXTREME close-up of only the HEAD TOP and two cream curved HORNS of a big brown ox against the sky, filling the frame. {OX}"),
    prop('frog_mom', P_POND, f"{MOMFROG}Sitting upright facing the viewer, proud little smile.", nogreen=False),
    prop('frog_mom_puffed', P_POND, f"{MOMFROG}Puffed up like a huge round balloon, cheeks bursting, eyes squeezed tight, trying very hard, her paper layers slightly spread apart.", nogreen=False),
    prop('frog_mom_flying', P_POND, f"{MOMFROG}Deflating like a balloon and zooming through the air sideways with little puffs of air trailing behind, surprised funny face.", nogreen=False),
    prop('frog_mom_dizzy', P_POND, f"{MOMFROG}Back to normal size, sitting dizzy with swirly eyes and three little paper stars circling her head, laughing.", nogreen=False),
    prop('frog_baby_sleep', P_POND, f"{BABY}Curled up asleep with closed eyes and a small 'z' shape made of paper.", nogreen=False),
    prop('frog_baby_awake', P_POND, f"{BABY}Awake and jumping happily with arms up.", nogreen=False),
    prop('frog_baby_cover', P_POND, f"{BABY}Covering both eyes with its front hands, peeking nervously.", nogreen=False),
    prop('frog_ox_stand', P_POND, f"{OX}Pure side profile facing LEFT, standing calmly on four legs."),
    prop('frog_ox_kneel', P_POND, f"{OX}Lying down / kneeling gently with front legs folded, lowering its head kindly toward something small, facing LEFT."),
    prop('frog_ox_jumpfail', P_POND, f"{OX}Trying clumsily to jump, all four hooves barely off the ground, funny strained face, facing LEFT."),
    prop('frog_tadpole', P_POND, "A cute little dark-green tadpole with a round head, big eyes and a curly tail, swimming sideways.", nogreen=False),
    prop('frog_duck', P_POND, "A cute white duck with an orange bill and orange feet, standing, side view facing LEFT."),
    prop('frog_sheep', P_POND, "A cute fluffy cream sheep with a dark face and legs made of scalloped paper wool, standing, side view facing LEFT."),
    prop('frog_lilypad', P_POND, "One round green lily pad with a V-notch and a small pink lotus flower, seen from a low angle, flat.", nogreen=False),
    cut('frog_cut_monster', P_POND, f"Three tiny baby frogs in the grass look UP in shock at a gigantic ox towering over them — only its huge legs and belly fit in the frame. {BABY}{OX}"),
    cut('frog_cut_pop', P_POND, f"The mother frog, puffed up enormous like a balloon, POPS with a giant paper starburst — a burst of air and confetti paper bits, funny not hurt. {MOMFROG}"),
    cut('frog_cut_fly', P_POND, f"The mother frog zooms zig-zag over the pond like a deflating balloon, speed lines, baby frogs cheering below. {MOMFROG}{BABY}"),
    cut('frog_cut_splash', P_POND, f"PLOP! The mother frog lands in the lavender pond with a big round paper splash, back to her normal size, dizzy and laughing. {MOMFROG}"),
    cut('frog_cut_jump', P_POND, f"The mother frog leaps a spectacular long jump across the lily pads while the gentle ox watches amazed. {MOMFROG}{OX}"),
]

# ================= 토끼와 거북이 =================
P_FOREST = "Palette: leaf green #6E9A5B, pine green #3F6B4F, pale gold sky #F2DFA8, cream #F6ECD8, straw gold #D9A94E, persimmon #E8703A, bark brown #6B4A32, sky blue stream. Cheerful sunny forest village. "
P_PARTY = "Palette: deep indigo night #1F2A56, warm amber lanterns #F2B366, bean red #A93B32, straw gold, cream. Festive night. "
RABBIT = "The rabbit: a white paper rabbit with long ears with pink insides, a round fluffy tail, a small red scarf. "
TURTLE = "The turtle: a green paper turtle with a big round shell of hexagon paper plates in olive and leaf green, a friendly face, a tiny straw-gold headband. "
ANIMAL = "a cheering audience animal standing up on its hind legs with both arms raised, happy open mouth"
rabbit = [
    sheet('rab_bg_village', P_FOREST, "Scene: a morning forest village: two small round-roofed animal houses, round paper trees, a winding dirt path across the front, straight-on. No animals."),
    sheet('rab_bg_alley', P_FOREST, "Scene: a lane of four small animal houses side by side with colourful paper roofs (red, green, lavender, orange) and round doors, straight-on, wide. No animals."),
    sheet('rab_bg_stands', P_FOREST, "Scene: a small outdoor race stand: two long wooden benches in rows, strings of colourful paper bunting flags above, trees behind. No animals."),
    sheet('rab_bg_start', P_FOREST, "Scene: a race START line: a red paper banner arch over a light dirt racetrack with white lane lines, trees and hills behind. No animals, no text on the banner."),
    sheet('rab_bg_map', P_FOREST, "Scene: a top-down illustrated paper race-course map: a winding dotted path from a start flag past a rock, a blue stream, a green hill and a big tree to a checkered finish flag. No text."),
    sheet('rab_bg_dash', P_FOREST, "Scene: a very wide side-scrolling forest path for a fast dash: layers of round paper trees and bushes, dirt path along the bottom, horizontal paper speed-line strips. No animals.", ),
    sheet('rab_bg_shade', P_FOREST, "Scene: a big shady tree on a hilltop with a wide round canopy and a thick trunk, cool shade underneath, a warm afternoon sun in the sky. No animals."),
    sheet('rab_bg_dream', P_FOREST, "Scene: a dreamy cloud-bordered paper scene in soft lavender and pale gold: a winner's podium with 1-2-3 blocks, little paper stars floating. No animals, no numbers."),
    sheet('rab_bg_grass_low', P_FOREST, "Scene: a very low turtle's-eye-level view: huge blades of grass and a giant daisy in the foreground, a big grey rock ahead on the path, pebbles. No animals."),
    sheet('rab_bg_stream', P_FOREST, "Scene: a cross-section of a gentle stream: above the waterline the grassy banks and reeds, below the waterline blue layered water with pebbles and water plants. No animals."),
    sheet('rab_bg_hill', P_FOREST, "Scene: a low-angle view up a steep green grassy hill with a few flowers, the hilltop against the sky. No animals."),
    sheet('rab_bg_finish', P_FOREST, "Scene: a race FINISH line from a low angle: a checkered paper flag arch, a red ribbon tape stretched across the track, bunting flags. No animals, no text."),
    sheet('rab_bg_party', P_PARTY, "Scene: a festive forest party at night: strings of glowing amber paper lanterns between trees, a small wooden stage, stars. No animals."),
    prop('rab_rabbit_run', P_FOREST, f"{RABBIT}Running super fast, side view facing RIGHT, ears flying back, feet off the ground."),
    prop('rab_rabbit_tease', P_FOREST, f"{RABBIT}Standing with hands on hips, cheeky teasing grin, side view facing LEFT."),
    prop('rab_rabbit_sleep', P_FOREST, f"{RABBIT}Fast asleep lying on its side under a leaf blanket, eyes closed, peaceful smile."),
    prop('rab_rabbit_wake', P_FOREST, f"{RABBIT}Jumping up startled, eyes wide, ears straight up, surprised face."),
    prop('rab_rabbit_congrats', P_FOREST, f"{RABBIT}Holding out one paw for a friendly handshake, warm smile, side view facing LEFT."),
    prop('rab_turtle_walk', P_FOREST, f"{TURTLE}Walking steadily, side view facing RIGHT, one front foot stepping forward, determined smile."),
    prop('rab_turtle_swim', P_FOREST, f"{TURTLE}Swimming happily with flippers spread, side view facing RIGHT."),
    prop('rab_turtle_medal', P_FOREST, f"{TURTLE}Standing proudly wearing a shiny gold paper medal on a red ribbon, big happy smile, facing the viewer."),
    prop('rab_raccoon', P_FOREST, "A cute raccoon referee with a striped tail and a little whistle, standing beside a big round drum with a red rim."),
    prop('rab_owl_post', P_FOREST, "A cute brown owl postman with a small satchel of envelopes, flying with wings spread."),
    *[prop(f'rab_aud_{k}', P_FOREST, f"A cute {d}, {ANIMAL}.") for k, d in [
        ('duck', 'white duck with an orange bill'), ('cow', 'white cow with black spots'), ('pig', 'pink pig'),
        ('rooster', 'white rooster with a red comb'), ('sheep', 'fluffy cream sheep'), ('dog', 'brown puppy with floppy ears'),
        ('cat', 'orange tabby cat'), ('owl', 'brown owl')]],
    prop('rab_carrot_trophy', P_FOREST, "A giant orange carrot standing in a golden trophy cup, with green leafy top."),
    prop('rab_medal', P_FOREST, "A shiny gold paper medal with a star on a red ribbon."),
    cut('rab_cut_wake', P_FOREST, f"The rabbit jolts awake with a start as a rooster crows loudly, eyes popping wide, ears straight up. {RABBIT}"),
    cut('rab_cut_dash', P_FOREST, f"The rabbit dashes at full speed toward the finish with dramatic speed lines and flying dust. {RABBIT}"),
    cut('rab_cut_photo', P_FOREST, f"A photo-finish snapshot: the turtle's nose touches the finish ribbon just before the rabbit arrives, flash burst. {TURTLE}{RABBIT}"),
]

# ================= 해와 달이 된 오누이 =================
P_VILLAGE = "Palette: straw gold #D9A94E, cream #F6ECD8, bark brown #6B4A32, pine green #3F6B4F, persimmon #E8703A, bean red #A93B32, lavender #8B7BB8. Old Korean mountain village. "
P_NIGHT = "Palette: deep indigo #1F2A56, midnight navy, cream moon #F6ECD8, amber lamp light #F2B366, bark brown, straw gold. Quiet Korean night. "
MOM = "The mother: a gentle Korean mother in a cream jeogori and lavender chima, hair in a low bun, a white headscarf. "
BOY = "The older brother: a small Korean boy in a straw-gold jeogori and cream pants, round face, short hair tied in a small topknot. "
GIRL = "The little sister: a small Korean girl in a pink jeogori and lavender skirt, two short braids. "
TIGER = ("The tiger: a chubby persimmon-orange tiger made of flat paper pieces with dark-brown stripe pieces, cream muzzle and belly, "
         "big round eyes, pink cheeks, round ears — funny and clumsy, never scary, no fangs. ")
sunmoon = [
    sheet('sm_bg_cottage', P_VILLAGE, "Scene: a small thatched-roof Korean cottage (choga) in a mountain village on a bright morning, a brushwood fence, persimmon tree. No people."),
    sheet('sm_bg_kitchen', P_VILLAGE, "Scene: a rich family's big traditional kitchen: iron cauldrons on a clay stove, wooden shelves, a low table with a plate of white rice cakes (tteok). No people."),
    sheet('sm_bg_hill_dusk', "Palette: apricot sunset, bean red, lavender, straw gold, pine green. ", "Scene: a mountain pass path at sunset with a big grey rock beside the path and a small wooden signpost, layered mountains behind. No people."),
    sheet('sm_bg_hill_night', P_NIGHT, "Scene: the same mountain pass at night under a moon, a big grey rock beside the path, dark layered mountains. No people."),
    sheet('sm_bg_room', P_NIGHT, "Scene: inside a small Korean room at night seen from the siblings' side: a paper sliding door (changho-ji lattice) in the center, a small oil lamp on a stand, warm amber light, wooden floor. No people."),
    sheet('sm_bg_window', P_NIGHT, "Scene: an EXTREME close-up of a paper lattice window (changho-ji) with wooden grid and cream hanji paper, lit from behind by moonlight. No people."),
    sheet('sm_bg_backyard', P_NIGHT, "Scene: a very wide Korean backyard at night: a row of big brown clay sauce jars (jangdok), a laundry line, a stone well and a tall tree at the far right, moonlight. No people."),
    sheet('sm_bg_well_tree', P_NIGHT, "Scene: a tall old tree beside a round stone well at night, the tree trunk rising high with a thick branch at the top, moon and stars. No people."),
    sheet('sm_bg_well_top', P_NIGHT, "Scene: a top-down view INTO a round stone well: dark water at the bottom reflecting the moon and a tree branch. No people."),
    sheet('sm_bg_sky', "Palette: deep indigo at the bottom rising to pale gold and cream at the top, lavender clouds. ", "Scene: a tall sky with five or six layers of fluffy paper clouds rising upward toward a warm golden light at the top. No people."),
    sheet('sm_bg_sorghum', P_VILLAGE, "Scene: a field of tall red sorghum (susu) stalks with heavy red grain heads at dawn. No people."),
    sheet('sm_bg_heaven', "Palette: pale gold day sky, cream, sky blue, soft white clouds, green hills below. ", "Scene: a wide peaceful sky above a small mountain village far below, open space in the upper left and upper right for a sun and a moon. No people."),
    prop('sm_mom_basket', P_VILLAGE, f"{MOM}Walking with a basket of rice cakes on her arm, side view facing RIGHT, kind smile."),
    prop('sm_mom_wave', P_VILLAGE, f"{MOM}Waving goodbye with one hand, facing the viewer."),
    prop('sm_boy', P_VILLAGE, f"{BOY}Standing and waving, facing the viewer."),
    prop('sm_girl', P_VILLAGE, f"{GIRL}Standing and waving, facing the viewer."),
    prop('sm_kids_hug', P_NIGHT, f"{BOY}{GIRL}The two siblings hugging each other and trembling with worried faces."),
    prop('sm_kids_climb', P_NIGHT, f"{BOY}{GIRL}The two siblings climbing a tree trunk one above the other, determined faces.", tall=True),
    prop('sm_kids_rope', "Palette: gold, cream, straw gold, lavender. ", f"{BOY}{GIRL}The two siblings holding tight to a thick shining golden rope, rising up, happy faces.", tall=True),
    prop('sm_tiger', P_VILLAGE, f"{TIGER}Standing on hind legs, side view facing LEFT, sly grin, paw raised: 'give me a rice cake!'"),
    prop('sm_tiger_full', P_VILLAGE, f"{TIGER}Sitting with a hugely round full belly after eating rice cakes, licking its lips, facing LEFT."),
    prop('sm_tiger_scarf', P_NIGHT, f"{TIGER}Wearing a white headscarf tied under its chin to pretend to be a mother, silly sneaky face, facing LEFT."),
    prop('sm_tiger_axe', P_NIGHT, f"{TIGER}Climbing up a tree trunk holding a small axe, side view, puffing with effort.", tall=True),
    prop('sm_tiger_slip', P_NIGHT, f"{TIGER}Sliding down helplessly, arms flailing, 'whoa!' face, slippery oil drops."),
    prop('sm_tiger_bump', P_VILLAGE, f"{TIGER}Sitting on its bottom with a big bump on its head and little stars circling, rubbing its bottom, 'ouch' face."),
    prop('sm_sun_girl', "Palette: bright gold, amber, persimmon, cream. ", f"A bright round paper SUN with scalloped rays and the smiling face of a little girl in the middle. {GIRL}"),
    prop('sm_moon_boy', "Palette: cream, pale lavender, silver white, indigo. ", f"A glowing round paper full MOON with a soft halo and the calm smiling face of a little boy in the middle. {BOY}"),
    prop('sm_rope_good', "Palette: shining gold, straw gold, cream. ", "A thick, shining, brand-new golden braided rope hanging straight down from above.", tall=True),
    prop('sm_rope_bad', "Palette: faded grey-brown, dull straw. ", "A thin, frayed, rotten old rope with loose fibres, hanging down from above.", tall=True),
    prop('sm_basket', P_VILLAGE, "A round woven bamboo basket filled with five white rice cakes (tteok)."),
    prop('sm_oil', P_NIGHT, "A small clay bottle of sesame oil with a cloth stopper and a golden drop."),
    prop('sm_lamp', P_NIGHT, "A small traditional Korean oil lamp (deungjan) on a wooden stand with a warm amber flame."),
    cut('sm_cut_eye', P_NIGHT, f"Through a small poked hole in a paper window, one ROUND big friendly tiger eye with a highlight fills the view, cartoon style, not scary. {TIGER}"),
    cut('sm_cut_well', P_NIGHT, f"The tiger peers into a stone well, fooled by the siblings' reflection in the water, while the siblings giggle up in the tree. {TIGER}{BOY}{GIRL}"),
    cut('sm_cut_snap', "Palette: deep indigo, straw gold, persimmon, cream. ", f"The rotten rope snaps with a big paper starburst 'snap' shape as the tiger starts to fall, funny shocked face. {TIGER}"),
]

for name, jobs in [('frog', frog), ('rabbit', rabbit), ('sunmoon', sunmoon)]:
    json.dump(jobs, open(os.path.join(HERE, f'jobs_{name}.json'), 'w'), ensure_ascii=False, indent=1)
    print(name, len(jobs))
