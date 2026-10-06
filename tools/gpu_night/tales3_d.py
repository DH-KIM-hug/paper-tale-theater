"""새 동화 9편 중: 은혜 갚은 까치 · 요술 항아리"""
from tales3_c import *

# ================= 은혜 갚은 까치 (magpie) =================
SCHOL = ("The scholar (seonbi): a gentle young Korean scholar in picture-book style — a round kind face, a black horsehair hat (gat) "
         "with a strap, a pale-blue long coat (durumagi) with a cream belt, a small book bundle on his back, cream socks and straw shoes. ")
MAGPIE = ("The magpie: a cute round Korean magpie made of flat paper pieces — a glossy black head and back with a soft blue shine, a "
          "clean white belly and shoulder patch, a long black tail, a short black beak, big round white eyes, pink cheek; ")
BABYMAG = ("The baby magpie: a tiny fluffy baby magpie chick made of flat paper pieces — soft grey-and-white down with a few black "
           "tips, a wide pale-orange beak open, big round eyes; ")
SNAKE = ("The snake: a chubby, friendly-faced paper snake made of flat paper pieces — a thick soft round body with big gentle pine-green "
         "and straw-gold diamond patterns, big round eyes, a short rounded blunt tail, NO tongue and NO fangs, more silly than scary; ")
LADY = ("A beautiful lady in a Korean hanbok: a calm face, long black hair in a low bun with a jade pin, a cream jeogori and a deep "
        "indigo skirt, with the tip of a snake's patterned tail just peeking out from under the hem; ")
MOON = "Colour mood: gentle Korean picture-book night — mid-tone blues, a cream moon, warm amber lantern glow, low saturation. "
magpie = [
    sheet('mg_bg_path', AUTUMN, "Scene: a Korean mountain path in autumn: layered paper hills with maple red, honey and pale gold "
          "leaves, a winding sandy path across the middle, a pale peach sky, a few round clouds. Open path."),
    sheet('mg_bg_bigtree', AUTUMN, "Scene: a LOW-ANGLE view looking up at a huge old pine tree on a mountain: a thick trunk, "
          "branching up to a small magpie's nest of twigs high at the top right, a pale peach sky, golden leaves at the edges. Trunk area clear."),
    sheet('mg_bg_nest', AUTUMN, "Scene: a HIGH-ANGLE view looking straight down into a round magpie's nest of twigs in the middle "
          "of a big pine branch, with a soft lined bowl clear in the middle, pine needles and a pale autumn background around it."),
    sheet('mg_bg_night', MOON, "Scene: a HIGH-ANGLE night view of a dark-blue mountain range from above with a winding path and one "
          "small warm lantern light far away at the upper right, pale moon, stars, soft indigo forests. Path clear.", night=True),
    sheet('mg_bg_porch', MOON, "Scene: the wooden porch (maru) of a lonely Korean thatched house at night: a paper door glowing warm, "
          "a small oil lamp on the floor, a wooden floorboard in front, a pale moonlit yard and a pine tree on the right. Porch clear.", night=True),
    sheet('mg_bg_paperdoor', MOON, "Scene: a CLOSE-UP of a big traditional Korean paper door (hanji window) with a warm amber backlight "
          "filling the whole picture, a wooden lattice frame, a glowing cream paper surface with no shadows yet, a dark wooden frame around it.", night=True),
    sheet('mg_bg_moonnest', MOON, "Scene: a wide view of a pine tree at night with a big round cream moon behind it, a family-sized "
          "branch in the middle for birds, soft blue hills, stars. Branch clear.", night=True),
    sheet('mg_bg_belltower', MOON, "Scene: a LOW-ANGLE view of a mountain temple bell pavilion at night: a huge bronze temple bell "
          "hanging under a tiled roof in the middle, wooden pillars, a big wooden bell hammer log hanging on ropes beside it, a moonlit sky.", night=True),
    sheet('mg_bg_dawn', SUNSET, "Scene: a Korean thatched house yard at dawn: a soft pale pink and gold sunrise glowing over blue "
          "hills, a pine tree, a stone wall, a packed-earth yard. Yard clear."),
    sheet('mg_bg_morning', SPRING, "Scene: a mountain bell pavilion in the morning light seen from below: a big bronze temple bell "
          "under a tiled roof, a pale golden sunrise sky, soft green hills, a small stone path. Open ground under the bell."),
    p('mg_scholar_walk', f"{SCHOL}Walking, side view facing RIGHT, a gentle smile."),
    p('mg_scholar_bow', f"{SCHOL}Front view, lifting his hat slightly in a greeting, smiling."),
    p('mg_scholar_bow_shoot', f"{SCHOL}Side view facing LEFT, pulling back a small wooden bow, aiming up, focused."),
    p('mg_scholar_surprise', f"{SCHOL}Front view, eyes wide, a round 'O' mouth, hands out."),
    p('mg_scholar_water', f"{SCHOL}Kneeling, side view facing LEFT, holding a small gourd dipper of water out to someone, gentle."),
    p('mg_scholar_shadow', "A black paper silhouette of a scholar with a black hat standing, wrapped by thick loops of a patterned "
      "snake body, as a soft dark paper cut shape, no face. Shown whole, simple dark shapes."),
    gprop('mg_lady', f"{LADY}Seated on the porch, front view, a calm hospitable smile."),
    gprop('mg_lady_tail', f"{LADY}Front view, standing, hands folded, with only the tail tip peeking out of the hem."),
    gprop('mg_snake_climb', f"{SNAKE}Climbing up a pine trunk, side view, with a sneaky face."),
    gprop('mg_snake_flee', f"{SNAKE}Slithering away fast, side view facing RIGHT, surprised round eyes, speed lines."),
    gprop('mg_snake_coil', f"{SNAKE}Coiled in a big loop shape, front view, a calm face."),
    gprop('mg_snake_vanish', f"{SNAKE}Slithering up a mountain slope into mist, side view facing RIGHT, getting smaller, calm."),
    p('mg_mag_dad_sit', f"The dad magpie: {MAGPIE}Perched, side view facing LEFT, a proud kind face."),
    p('mg_mag_dad_fly', f"The dad magpie: {MAGPIE}Flying, side view facing RIGHT, wings spread wide, determined."),
    p('mg_mag_dad_tired', f"The dad magpie: {MAGPIE}Lying exhausted on his side with closed eyes and drooping wings, a feather beside, sleepy."),
    p('mg_mag_mom_sit', f"The mom magpie: {MAGPIE}Perched, side view facing LEFT, a gentle face, tiny pink bow on her head."),
    p('mg_mag_mom_fly', f"The mom magpie: {MAGPIE}Flying, side view facing RIGHT, wings spread wide, determined, tiny pink bow on her head."),
    p('mg_mag_mom_tired', f"The mom magpie: {MAGPIE}Lying exhausted on her side with closed eyes and drooping wings, tiny pink bow, sleepy."),
    p('mg_chick', f"{BABYMAG}Sitting, front view, cheeping."),
    p('mg_chick_trio', f"{BABYMAG}Three baby chicks side by side in a row, front view, cheeping with open beaks."),
    p('mg_mag_flock', f"{MAGPIE}A flock of seven magpies flying together in a V-shape, all side view facing RIGHT, wings up."),
    o('mg_bow', "A small wooden Korean bow with a taut cord, side view, simple flat shapes."),
    o('mg_arrow', "One wooden arrow with a feathered tail and a silver arrowhead, horizontal, front view."),
    o('mg_bell', "A huge bronze Korean temple bell with a rounded dome top, vertical carved lines and round lotus bumps, front view."),
    o('mg_lamp', "A small traditional Korean oil lamp (deungjan) with a small flame on a short stand, front view."),
    o('mg_dipper', "A small gourd dipper (bagaji) full of clear blue water, side view."),
    o('mg_hammer', "A big round-ended wooden bell hammer log hanging horizontally from two ropes, side view."),
    cut('mg_cut_arrow', AUTUMN, f"THUNK: an arrow hits a pine tree trunk right beside a startled paper snake climbing up toward a "
        f"nest, snake's eyes wide, big comic speed lines. {SNAKE}"),
    cut('mg_cut_flee', AUTUMN, f"The paper snake slithers away from a pine tree in a hurry with round surprised eyes, the scholar "
        f"in the background lowering his bow. {SNAKE}{SCHOL}"),
    cut('mg_cut_tail', MOON, f"A calm lady sits on a porch, her skirt hem lifted slightly and a snake's patterned tail tip peeking out "
        f"beneath, a lantern glow, subtle comic. {LADY}", night=True),
    cut('mg_cut_shadow', MOON, "Shadow play on a warm glowing paper door: a big snake silhouette coiling around a small scholar silhouette "
        "with a black hat, plain black paper shapes only, no faces, gentle.", night=True),
    cut('mg_cut_flock', MOON, f"A big flock of magpies flying fast across a huge moon toward a mountain temple, motion lines. {MAGPIE}", night=True),
    cut('mg_cut_ring', MOON, f"DONG: magpies strike a big temple bell with their beaks, big round sound waves rippling out in rings "
        f"around the bell. {MAGPIE}", night=True),
    cut('mg_cut_dawn', SUNSET, "A golden dawn sun rising over mountains with a long beam of light on a quiet thatched house, soft "
        "mist, one fallen magpie feather floating down in the foreground, tender."),
    cut('mg_cut_wake', SPRING, f"Little magpies waking up under the temple bell and flying upward into a bright morning sky, a "
        f"scholar waving to them. {MAGPIE}{SCHOL}"),
]

# ================= 요술 항아리 (magic_jar) =================
FARMER = ("The farmer: a kind poor Korean farmer in picture-book style — a round friendly face, a straw hat, a patched cream "
          "jeogori with a rope belt, baggy trousers rolled at the knees, bare feet, a gentle smile. ")
FWIFE = ("The farmer's wife: a kind plump Korean woman in picture-book style — a neat bun with a wooden pin, rosy cheeks, a cream "
         "jeogori and a faded blue skirt, a bright smile. ")
RICH = ("The greedy rich man: a plump Korean man in picture-book style — a round very smug face with a thin moustache, a black gat "
        "hat, a shiny gold-brocade wine-red coat with a red belt, a big belly, white socks. ")
RFATHER = ("The rich man's old father: a small frail old Korean grandpa in picture-book style — a round face, a long white beard, a "
           "white topknot, a pale grey durumagi coat with a cream belt, round glasses, a long thin wooden cane. ")
JAR = ("a big round brown Korean earthenware jar (hangari) with a wide mouth, a dark glaze shine, a cream band round the neck and a "
       "soft golden glow at the opening")
magic_jar = [
    sheet('mj_bg_field', HANOK, "Scene: a wide Korean farm field behind a small thatched cottage on the left: rows of brown earth with "
          "small green sprouts, a stone wall, a persimmon tree, a pale blue sky. Field clear in the middle."),
    sheet('mj_bg_pit', HANOK, "Scene: a HIGH-ANGLE view looking straight down at a freshly dug round hole in the brown earth with "
          "a round clay lid peeking out, soil piles around, small stones, grass on the edges. Hole area clear."),
    sheet('mj_bg_yard', HANOK, "Scene: a small farmhouse yard seen straight-on: a thatched house with a porch at the left, a "
          "wooden gate at the right, a packed-earth yard in the middle, a hanging gourd, a pale sky. Yard clear."),
    sheet('mj_bg_jarfront', HANOK, "Scene: a CLOSE-UP wooden porch floor with a wide empty flat area in the middle to place a jar, a "
          "warm honey wooden wall behind with a paper door at the right, soft light. Floor clear."),
    sheet('mj_bg_village', HANOK, "Scene: a village lane seen straight-on with FIVE thatched houses in a row, each with its own "
          "small yard gate, a path across the front, small trees between them, a pale blue sky. Gates clear."),
    sheet('mj_bg_richgate', HANOK, "Scene: a LOW-ANGLE view looking up at a rich man's grand gate: a huge tile-roofed gate with "
          "thick pillars, two stone lion statues, a stone step, a tiled wall at each side, a pale sky."),
    sheet('mj_bg_hall', INDOOR, "Scene: a rich man's big wooden hall (daecheong) seen straight-on: a wide honey-wood floor, a "
          "folding screen at the back painted with pine trees, a pair of lanterns, a low table at the left. Floor clear."),
    sheet('mj_bg_hallwide', INDOOR, "Scene: the same grand wooden hall seen from further away: a very wide honey-wood floor, tall "
          "pillars, a folding screen, hanging lanterns, big open space in the middle for a crowd. Floor clear."),
    sheet('mj_bg_feast', SUNSET, "Scene: a village yard at sunset for a feast: a thatched house at the left, red and cream paper "
          "lanterns hanging at the top, long low tables, a warm golden sky, a wide clear yard in the middle."),
    p('mj_farmer_hoe', f"{FARMER}Hoeing, side view facing LEFT, holding a hoe over one shoulder, bending down, happy."),
    p('mj_farmer_pull', f"{FARMER}Pulling something up with both hands, side view facing LEFT, leaning back, effort face."),
    p('mj_farmer_amaze', f"{FARMER}Front view, eyes huge round, a round open mouth, both hands up in the air."),
    p('mj_farmer_count', f"{FARMER}Front view, pointing a finger down, counting, a happy focused smile."),
    p('mj_farmer_share', f"{FARMER}Front view, holding out a sack of rice with both arms, a generous smile."),
    p('mj_farmer_feast', f"{FARMER}Front view, laughing with arms spread wide, joyful."),
    p('mj_fwife', f"{FWIFE}Standing, front view, clapping her hands joyfully."),
    p('mj_fwife_share', f"{FWIFE}Front view, holding a small bowl of rice out to someone, kind smile."),
    p('mj_rich_shout', f"{RICH}Front view, pointing a finger angrily, mouth open wide, a very smug scolding face."),
    p('mj_rich_grab', f"{RICH}Side view facing LEFT, hugging a big jar with both arms and carrying it away, greedy grin."),
    p('mj_rich_gold', f"{RICH}Front view, dropping a gold nugget into something with both hands, greedy sparkle eyes."),
    p('mj_rich_pinned', f"{RICH}Front view, buried to his chest in a big pile of gold nuggets, flailing his arms, helpless, sweating."),
    p('mj_rich_hurry', f"{RICH}Front view, hurrying with a big tray of food in his hands, sweating, flustered face."),
    p('mj_father_peek', f"{RFATHER}Side view facing LEFT, bending forward over something, peering in, curious."),
    p('mj_father_fall', f"{RFATHER}Front view, flailing mid-air upside-down, falling headfirst, cane flying, a surprised face."),
    p('mj_father_fightA', f"{RFATHER}Front view, pointing at himself with a thumb, puffed chest, a stubborn face, mouth open."),
    p('mj_father_fightB', f"{RFATHER}Front view, glaring and wagging a finger sideways, a cranky face, mouth open."),
    og('mj_jar', f"{JAR}, front view, empty, no face."),
    o('mj_jar_cracked', f"{JAR} CRACKED apart into five big pieces lying on the ground, front view."),
    o('mj_hoe', "A farmer's wooden-handled iron hoe with a curved blade, side view, simple flat shapes."),
    o('mj_coin', "One round gold Korean coin (yeopjeon) with a square hole in the middle, front view, flat."),
    o('mj_rice', "A woven rice sack with a rope tie, front view, plump."),
    o('mj_gold', "A pile of shiny gold nuggets, front view, flat simple paper."),
    o('mj_apple', "One shiny round red apple with a short brown stem and a small leaf, front view."),
    o('mj_table', "A Korean small round table (soban) with a bowl of rice, a bowl of soup, and side dishes, front view."),
    cut('mj_cut_clink', HANOK, "CLINK: a hoe strikes something hard in the soil with a starburst, a farmer's eyes wide, a bit of "
        "golden glow from the ground, comic."),
    cut('mj_cut_twohoes', HANOK, f"Surprise: a farmer sits stunned, staring at a big jar with TWO identical hoes standing in it, one "
        f"popping out with a golden sparkle. {FARMER}"),
    cut('mj_cut_coins', HANOK, "A big jar overflowing with a shower of gold coins pouring out, a farmer counting with round eyes "
        "beside it, golden glow, joyful."),
    cut('mj_cut_buried', INDOOR, f"A rich man buried under a huge mountain of gold nuggets in a hall, only his arms and hat sticking "
        f"out, comic flail. {RICH}"),
    cut('mj_cut_plop', HANOK, f"PLOP: a small old man falls headfirst into a big jar with only his two feet and cane sticking out, "
        f"a rich man watching with an open mouth. {RFATHER}{RICH}"),
    cut('mj_cut_eight', INDOOR, f"Eight identical small old men with white beards and canes crowded together in a big wooden hall, "
        f"all arguing and pointing at themselves, a rich man in the middle. {RFATHER}{RICH}"),
    cut('mj_cut_smash', INDOOR, f"CRASH: a big brown jar breaks into pieces on a hall floor with a big starburst, eight old men "
        f"startled, funny. {JAR}"),
    cut('mj_cut_hungry', INDOOR, f"Eight identical small old men sitting at a long table shouting hungrily with bowls up, a rich "
        f"man running with trays, comic. {RFATHER}{RICH}"),
]
