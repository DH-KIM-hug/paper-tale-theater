"""새 동화 9편 중 한국·그림 형제 2편: 콩쥐 팥쥐 · 헨젤과 그레텔"""
from tales3_a import *

HANOK = ("Colour mood: soft, warm Korean picture-book pastels with low saturation — warm cream plaster walls, honey-wood beams, "
         "straw-gold thatch, soft sky blue, apricot and rose accents. ")
NIGHTK = ("Colour mood: gentle Korean picture-book night — mid-tone blues, a cream moon, warm amber paper-lantern glow, low saturation. ")

# ================= 콩쥐 팥쥐 (kongjwi) =================
KONG = ("Kongjwi: a kind young Korean girl in picture-book style — a round face, a long braid tied with a red ribbon, big round eyes, "
        "pink cheeks, a pale-yellow jeogori with a cream collar and a cream hanbok skirt, white socks. ")
PAT = ("Patjwi: a spoiled Korean girl in picture-book style — a round face, two buns with a pink ribbon, a smug pout, bean-pink jeogori "
       "with a rose skirt, white socks. ")
STEP = ("Stepmother: a plump Korean woman in picture-book style — a neat bun with a gold hairpin, a smug face with narrowed eyes, an "
        "indigo jeogori and a dark plum skirt. ")
WON = ("The county magistrate (wonnim): a young kind Korean man in picture-book style — a black official hat (samo) with two little wing "
       "flaps, a round friendly face, a thin moustache, a royal-blue official robe with a gold-patterned chest square. ")
FAIRY = ("A heavenly fairy: a graceful Korean fairy in picture-book style — a high bun with a gold hairpin, a soft pink-and-sky-blue "
         "hanbok with long floating ribbon sleeves, a gentle smile, closed eyes. ")
TOAD = ("The toad: a round, chubby lime-green toad made of flat paper pieces — bumpy darker-green spots on its back, a wide smiling "
        "mouth, big round eyes with dark pupils, a pale cream belly, stubby feet. ")
COW = ("The black ox: a big gentle black-and-charcoal ox made of flat paper pieces — a cream muzzle, two small curved horns, big "
       "soft eyes, a soft long tail, cute and calm. ")
SPARROW = ("The sparrow: a small round brown sparrow made of flat paper pieces — a chestnut head, a cream cheek with a black dot, a "
           "small pale-orange beak, a plump cream belly, big round eyes. ")
kongjwi = [
    sheet('kj_bg_yard', HANOK, "Scene: a thatched-roof Korean farmhouse yard seen straight-on: a wooden porch (maru) with a paper-door "
          "room at the right, a low stone wall, a big crock row (jangdok) at the far left, a persimmon tree, a packed-earth yard. Open yard in the middle."),
    sheet('kj_bg_field', HANOK, "Scene: a HIGH-ANGLE view looking down on a rocky dry field: rough soil in rows scattered with round grey "
          "stones, a few tufts of grass, a pale rim of grass around the edge. Soil clear."),
    sheet('kj_bg_gate', HANOK, "Scene: the front gate of a Korean farmhouse seen straight-on: a wide wooden gate with a tiled roof, a "
          "stone wall at both sides, a dirt road in front, pine trees and a pale blue sky."),
    sheet('kj_bg_jar', HANOK, "Scene: a SIDE CUT-AWAY of a big brown Korean earthenware crock (hangari) beside a wooden bucket: the "
          "crock cut open showing a hollow inside with a round hole at the bottom, a dry yard around. Big and simple."),
    sheet('kj_bg_jarbottom', HANOK, "Scene: a LOW-ANGLE view from inside the bottom of a big brown earthenware crock looking up: "
          "curved brown walls, a small round hole in the floor in the centre bottom, a round bright sky circle at the top."),
    sheet('kj_bg_mat', HANOK, "Scene: a HIGH-ANGLE view looking straight down at a big woven straw mat (meongseok) on the ground, "
          "plain woven pattern filling the whole image, a ring of packed earth at the edges. Mat clear."),
    sheet('kj_bg_loom', HANOK, "Scene: inside a Korean room: warm honey wood floor, a paper-screen sliding door at the left with a "
          "lantern glow, a wooden folding screen at the right, a plain floor with a clear space in the middle for a loom."),
    sheet('kj_bg_stream', HANOK, "Scene: a side view of a clear stream with a row of five flat round stepping stones in the middle, "
          "banks with bushes, willow trees at the top, a pale blue sky."),
    sheet('kj_bg_feast', HANOK, "Scene: a Korean feast yard seen straight-on: a big hall behind with a tiled roof and open doors, "
          "paper lanterns hanging at the top, a wooden table at the left, a wide empty packed-earth yard in front."),
    sheet('kj_bg_wedding', NIGHTK, "Scene: a Korean wedding yard at night seen straight-on: red-and-blue paper lanterns (cheongsachorong) "
          "hanging along the top, a tiled hall behind, a round cream moon, a wide clear yard.", night=True),
    p('kj_kong_sweep', f"{KONG}Sweeping with a straw broom, side view facing LEFT, calm happy face."),
    p('kj_kong_hoe', f"{KONG}Hoeing the ground with a wooden hoe, side view facing LEFT, bending down, determined."),
    p('kj_kong_bruise', f"{KONG}Front view, holding a broken wooden hoe in two pieces, a small round blue bruise on her forehead, "
      "sad-funny eyes, a tiny bump."),
    p('kj_kong_pour', f"{KONG}Pouring water from a wooden bucket, side view facing LEFT, bending forward."),
    p('kj_kong_wet', f"{KONG}Front view, drenched, wet clothes sticking, water drops flying, surprised round mouth, bare wet feet."),
    p('kj_kong_loom', f"{KONG}Seated at a loom, side view facing LEFT, hands pushing the weaving beam, gentle focus."),
    p('kj_kong_shoes', f"{KONG}Front view, wearing a rose-and-cream embroidered flower shoe (kkotsin), looking down at it with joy, "
      "wearing a pretty cream hanbok skirt and a pale-yellow jeogori."),
    p('kj_kong_bride', f"{KONG}Dressed as a bride: a red-and-gold wedding hanbok with a tall jokduri crown and a long ribbon, front view, "
      "a gentle smile."),
    p('kj_pat_eat', f"{PAT}Sitting and munching a white rice cake, front view, cheeks puffed."),
    p('kj_pat_dressed', f"{PAT}Front view, dressed up very fancy, hands on hips, chin up, proud."),
    p('kj_pat_shy', f"{PAT}Front view, both hands covering her face in embarrassment, red ears."),
    p('kj_step_order', f"{STEP}Front view, pointing a finger to give orders with a stern pout."),
    p('kj_step_dressed', f"{STEP}Front view, dressed in fancy plum and gold hanbok, fan in hand, proud."),
    p('kj_step_shy', f"{STEP}Front view, hiding her face behind a round paper fan, embarrassed."),
    p('kj_won_stand', f"{WON}Standing, front view, kind smile."),
    p('kj_won_shoe', f"{WON}Front view, holding up one embroidered flower shoe in his hand, looking curious."),
    p('kj_fairy_float', f"{FAIRY}Floating gently with ribbons trailing, front view, hands open in welcome."),
    p('kj_fairy_give', f"{FAIRY}Front view, holding out a folded hanbok and a pair of flower shoes with both hands."),
    gprop('kj_toad_idle', f"{TOAD}Sitting, front view, a happy smile."),
    gprop('kj_toad_plug', f"{TOAD}Squashed round and flat, sitting tight on a round hole, front view, puffed cheeks, determined."),
    p('kj_ox_walk', f"{COW}Walking, side view facing LEFT, pulling a wooden plough harness, calm."),
    p('kj_ox_stand', f"{COW}Standing, front view, gentle smile, little hearts of cheer."),
    p('kj_sparrow_flock', f"{SPARROW}A flock of five sparrows flying in a loose group together, side view facing LEFT, wings up and down."),
    p('kj_sparrow_one', f"{SPARROW}One sparrow perched, side view facing LEFT, singing happily."),
    # 소품
    o('kj_hangari', "A big brown Korean earthenware crock with a round belly, wide mouth and a dark glaze shine, a clearly round "
      "hole at the very bottom, front view."),
    o('kj_pail', "A round wooden water pail with a rope handle, front view, full of clear blue water."),
    o('kj_bean', "One round shiny yellow soybean, flat simple oval-round paper, front view."),
    o('kj_redbean', "One round shiny deep-red small bean (pat), flat simple oval-round paper, front view."),
    o('kj_basket_y', "A round woven basket painted bright yellow with a flat top opening, front view, empty."),
    o('kj_basket_r', "A round woven basket painted bright red with a flat top opening, front view, empty."),
    o('kj_loom', "A Korean wooden hand loom (baetl) with threads and a half-woven cream cloth, side view, simple shapes."),
    o('kj_shoe_plum', "ONE rose-pink embroidered Korean flower shoe (kkotsin) with a clear round plum blossom pattern, side view, pointed toe."),
    o('kj_shoe_butterfly', "ONE rose-pink embroidered Korean flower shoe (kkotsin) with a clear pair-of-butterflies pattern, side view, pointed toe."),
    o('kj_shoe_peony', "ONE rose-pink embroidered Korean flower shoe (kkotsin) with a clear big peony flower pattern, side view, pointed toe."),
    o('kj_drum', "A round Korean janggu hourglass drum with red cords, side view."),
    o('kj_buk', "A round Korean buk barrel drum with a red-and-gold rim, front view."),
    o('kj_gong', "A round golden Korean kkwaenggwari gong with a wooden stick, front view."),
    o('kj_ricecake', "A little plate with three white round rice cakes dusted with sesame, front view."),
    o('kj_hoe_broken', "A wooden hoe broken into two pieces lying flat, front view."),
    # 컷 8
    cut('kj_cut_hoe', HANOK, f"SNAP: a wooden hoe breaks in two with a yellow starburst while a girl falls over comically, rocky field. {KONG}"),
    cut('kj_cut_ox', HANOK, f"A big black ox gently descends from a pale blue sky on a soft cloud to plough a rocky field. {COW}"),
    cut('kj_cut_wet', HANOK, f"Water pours straight through a hole at the bottom of a big crock onto a girl's feet, big splashes, "
        f"her surprised face. {KONG}"),
    cut('kj_cut_toad', HANOK, f"A big round green toad sits on a round hole and puffs up to plug it, the crock fills with blue "
        f"water, a girl cheering. {TOAD}{KONG}"),
    cut('kj_cut_sparrows', HANOK, f"A big flock of cute brown sparrows swoops down onto a woven mat sorting yellow and red beans "
        f"into two baskets, joyful. {SPARROW}"),
    cut('kj_cut_fairy', HANOK, f"A heavenly fairy with floating ribbon sleeves appears in a soft glow in a Korean room beside a "
        f"loom, a girl looking up with joy. {FAIRY}{KONG}"),
    cut('kj_cut_splash', HANOK, f"A little flower shoe falls PLOP into a stream with ripples while a girl on the stepping stones "
        f"looks back surprised. {KONG}"),
    cut('kj_cut_shy', HANOK, f"A fancy mother and daughter in Korean dress hide their faces behind a paper fan and hands, "
        f"embarrassed, in a feast yard. {PAT}{STEP}"),
]

# ================= 헨젤과 그레텔 (hansel) =================
HANS = ("Hansel: a small German-style boy in picture-book style — a round face, short golden-brown hair, big round eyes, pink cheeks, a "
        "cream shirt, a sky-blue vest, brown short trousers with suspenders, brown boots. ")
GRET = ("Gretel: a small German-style girl in picture-book style — a round face, two golden-brown braids with red ribbons, big round "
        "eyes, pink cheeks, a cream blouse, a bean-red dress with a white apron, brown boots. ")
DADH = ("Father: a kind sturdy woodcutter in picture-book style — a round face, a brown beard, a brown felt hat, a rust-orange vest "
        "over a cream shirt, brown trousers, boots. ")
WITCH = ("The witch: a funny old granny witch in picture-book style — a very long curved nose with a wart, a pointed purple hat "
         "with a patched brim, a rose-pink shawl over a plum dress, a bent back, round glasses, big kind-silly eyes, a gentle goofy "
         "smile, never scary. ")
BIRD = ("a small round blue-grey bird made of flat paper pieces — a cream belly, a small orange beak, big round eyes, pink cheek; ")
CAND = "Colour mood: soft, sweet pastel candy-land picture-book colours with low saturation — peach, cream, rose, butter yellow, pale mint. "
hansel = [
    sheet('hg_bg_cottage', PASTEL, "Scene: a small woodcutter's cottage at the edge of a big forest: a thatched roof with a chimney, a "
          "round-topped door, a woodpile, a fence, tall paper trees in layers behind, a path in front, a pale sky. Open path in the middle."),
    sheet('hg_bg_trail', AUTUMN, "Scene: a side-on forest path: slim paper trunks in layers, big ferns, a winding pale path through "
          "the middle, golden light, a pale sky. Open path."),
    sheet('hg_bg_glade', AUTUMN, "Scene: a wide forest clearing: a flat mossy ground in the middle, tall trees in a ring, a few big "
          "tree stumps, soft pale light from above, a pale peach sky. Open ground."),
    sheet('hg_bg_ground', AUTUMN, "Scene: a HIGH-ANGLE view looking straight down at a forest floor: fallen leaves in cream, "
          "honey and brown, small stones, a few ferns, moss. Floor clear in the middle."),
    sheet('hg_bg_giant', AUTUMN, "Scene: a LOW-ANGLE view from the ground looking up at giant tree trunks in a forest, big roots, "
          "dappled pale light between the leaves, a fork in the path near the bottom. Open path at the bottom."),
    sheet('hg_bg_house', CAND, "Scene: a LOW-ANGLE view looking up at a fairy-tale gingerbread house: walls of cookie bricks, a "
          "roof of big frosted tiles, windows of clear sugar, a chocolate chimney, a lollipop fence, cotton candy bushes. Door clear."),
    sheet('hg_bg_roof', CAND, "Scene: a CLOSE-UP front view of a gingerbread house roof: a wide sloped roof of rows of cream-frosted "
          "tiles with a few empty round DOTS where candies are missing, a chocolate chimney at the top. Roof rows clear."),
    sheet('hg_bg_inside', INDOOR, "Scene: inside a witch's cottage: a round table piled with sweets, a fireplace with a big pot, "
          "shelves with jars, hanging herbs, a tall window, a warm plank floor. Open floor."),
    sheet('hg_bg_cage', INDOOR + " Dim and warm. ", "Scene: a dim corner of a witch's cottage, close-up of a black iron bird cage "
          "with an open front on the left, a wooden floor, a small candle, a shelf behind. Cage door area clear."),
    sheet('hg_bg_oven', INDOOR, "Scene: a witch's kitchen with a big black iron oven with a flat open door in the middle, "
          "glowing orange inside, a stack of firewood beside it, shelves, a brick floor. Open floor in front of the oven."),
    sheet('hg_bg_river', SPRING, "Scene: a side view of a wide calm river: a pale blue water band with soft ripples across the "
          "middle, grassy banks on the left and right, reeds, a far pale forest, a pale sky. Water clear in the middle."),
    p('hg_hans_walk', f"{HANS}Walking, side view facing RIGHT, hand in pocket, a calm determined face."),
    p('hg_hans_crumb', f"{HANS}Dropping a bread crumb on the ground, side view facing RIGHT, bending slightly, one hand out."),
    p('hg_hans_doze', f"{HANS}Sitting against a tree, front view, dozing, eyes closed as arcs, a little 'zzz'."),
    p('hg_hans_eat', f"{HANS}Front view, happily biting a cookie, cheeks full."),
    p('hg_hans_cage', f"{HANS}Sitting inside a black iron bird cage, front view, holding the bars with both hands, a hopeful face."),
    p('hg_hans_joy', f"{HANS}Front view, jumping with joy with both arms up."),
    p('hg_gret_walk', f"{GRET}Walking, side view facing RIGHT, holding a small bundle, calm."),
    p('hg_gret_doze', f"{GRET}Sitting against a tree, front view, dozing, eyes closed as arcs, a little 'zzz'."),
    p('hg_gret_eat', f"{GRET}Front view, nibbling on a piece of a roof tile, cheeks full, happy."),
    p('hg_gret_clever', f"{GRET}Front view, one finger raised near her head, eyes bright, a clever little grin."),
    p('hg_gret_push', f"{GRET}Pushing with both hands out in front, side view facing RIGHT, determined round-eyed face."),
    p('hg_gret_key', f"{GRET}Front view, holding up a small star-shaped key, bright smile."),
    p('hg_gret_duck', f"{GRET}Sitting on top, side view facing RIGHT, riding, hands holding on, happy, legs dangling. Show only "
      "the girl sitting on nothing."),
    p('hg_witch_beckon', f"{WITCH}Front view, waving a bent finger to beckon, a welcoming smile."),
    p('hg_witch_grope', f"{WITCH}Seen from behind, reaching one arm out, bending forward, squinting, feeling for something."),
    p('hg_witch_oven', f"{WITCH}Leaning forward to peer into an oven, side view facing LEFT, long nose first, curious."),
    p('hg_witch_fly', f"{WITCH}Flying away on a broom, side view facing RIGHT, comically surprised, hat flying, a small puff of smoke."),
    p('hg_witch_laugh', f"{WITCH}Front view, laughing with her hands on her round belly, her nose wiggling."),
    p('hg_father', f"{DADH}Front view, holding his arms open wide for a hug, a big happy smile."),
    p('hg_father_wood', f"{DADH}Walking, side view facing RIGHT, an axe over his shoulder, a gentle calm face."),
    p('hg_bird_peck', f"A small round blue-grey bird made of flat paper pieces, side view facing LEFT, pecking at the ground."),
    p('hg_bird_crumb', f"A small round blue-grey bird made of flat paper pieces, side view facing LEFT, holding a crumb in its beak, "
      "a surprised eye looking sideways."),
    p('hg_duck_ride', f"{DUCK}Swimming, side view facing RIGHT, back flat, calm and friendly."),
    p('hg_duck_ride2', f"{DUCK}Swimming, side view facing RIGHT, wings slightly raised, happy."),
    o('hg_crumb', "A small round lump of cream bread crumb, flat simple paper, front view."),
    o('hg_cookiewall', "A tile of gingerbread house wall made of brown cookie bricks with white icing lines, front view, flat."),
    o('hg_door', "A big round-topped chocolate-brown door with cream icing swirls and a round candy knob, front view."),
    o('hg_cage', "A black iron bird cage with an open door on the front, side view, empty."),
    o('hg_key_circle', "A small gold key with a ROUND head, front view, flat simple shape."),
    o('hg_key_square', "A small gold key with a SQUARE head, front view, flat simple shape."),
    o('hg_key_star', "A small gold key with a STAR-shaped head, front view, flat simple shape."),
    o('hg_lock', "A big gold padlock with a star-shaped keyhole in the centre, front view."),
    o('hg_gems', "A little brown cloth pouch with a rope tie, spilled open with sparkling coloured jewels, front view."),
    o('hg_stick', "One thin brown dry twig stick with a few knots, lying flat, front view."),
    o('hg_broom', "A witch's twig broom with a straw brush, seen from the side, flat."),
    o('hg_candies', "A neat flat sheet of SIX candies in two rows of three: red round, yellow round, blue round, red triangle, "
      "yellow triangle, blue triangle, each shiny, with clear space between them."),
    cut('hg_cut_bird', AUTUMN, f"Funny: a little blue-grey bird with a bread crumb in its beak looks sideways with a surprised "
        f"'cheep?' on the forest floor, a trail of crumbs behind. {BIRD}"),
    cut('hg_cut_eat', CAND, f"A boy and a girl munching gingerbread house walls with big happy 'crunch' lines, crumbs flying. {HANS}{GRET}"),
    cut('hg_cut_witch', CAND, f"A funny granny witch with a long nose appearing at a candy house door, hand beckoning, a table of sweets "
        f"behind. {WITCH}"),
    cut('hg_cut_stick', INDOOR, f"A witch squinting and holding a thin dry stick and mistaking it for a boy's finger, a boy's hand "
        f"hiding behind in a cage, funny. {WITCH}{HANS}"),
    cut('hg_cut_slam', INDOOR, f"BANG: a big black iron oven door slams shut with a starburst while a small girl stands proudly, "
        f"a witch's pointed hat flying. {GRET}"),
    cut('hg_cut_pop', "Colour mood: soft sunset picture-book warmth. ", f"POP: a funny witch on a broom shoots out of a candy house "
        f"chimney in a puff of smoke far into a sunset sky. {WITCH}"),
    cut('hg_cut_duck', SPRING, f"A white duck carries a boy and a girl across a wide calm river, ripples behind them. {DUCK}{HANS}{GRET}"),
    cut('hg_cut_hug', SUNSET, f"A father hugs a boy and a girl tightly in front of a small cottage at sunset, a little pouch of jewels "
        f"at their feet. {DADH}{HANS}{GRET}"),
]
