"""새 동화 9편 중: 신데렐라 · 흥부와 놀부"""
from tales3_b import *

# ================= 신데렐라 (cinderella) =================
CIND = ("Cinderella: a gentle young girl in picture-book style — a round face, golden hair in a soft low bun with a cream ribbon, big "
        "round eyes, pink cheeks; ")
CIND_RAG = CIND + "wearing a patched grey-brown work dress, a cream apron smudged with grey ash, brown shoes. "
CIND_GOWN = (CIND + "wearing a sparkling sky-blue ball gown with a wide round skirt, layered cream ruffles and silver stars, long white "
             "gloves, light-blue glass slippers. ")
SIS = ("a haughty stepsister in picture-book style — a round face with a pout, an elaborate tall curled hairdo, a frilly ")
SIS1 = f"The first stepsister: {SIS}rose-pink gown with big puffed sleeves, a bigger rounder figure, big round feet. "
SIS2 = f"The second stepsister: {SIS}butter-yellow gown with a big collar, a tall thin figure, long narrow feet. "
STEPM = ("The stepmother: a stern tall woman in picture-book style — a tall dark-plum updo, narrowed eyes, a dark plum gown with a "
         "high collar, a folded fan. ")
FAIRYG = ("The fairy godmother: a plump kind old fairy in picture-book style — a white bun, round glasses, a lavender cloak with "
          "silver stars, a little pair of paper wings, a gold wand with a star tip, a warm smile. ")
PRINCE = ("The prince: a young kind prince in picture-book style — a round face, short chestnut hair, a small gold crown, a royal-blue "
          "coat with gold buttons and a short red cape, white tights, brown boots. ")
FOOT = ("The valet (shiboen): a polite valet in picture-book style — a round face, a white curled wig, a cream-and-gold livery with a "
        "red sash, white gloves, holding a small cushion. ")
HORSE = ("a graceful white horse made of flat paper pieces — a pale cream mane and tail in soft curls, a long gentle face, big round "
         "eyes, little pink nostrils, slim legs, tiny gold hooves, gold harness; ")
LIZ = ("The lizard: a small lime-green lizard made of flat paper pieces — a long curling tail, round eyes, a happy smile, little "
       "toes; ")
COACHMAN = ("The coachman: a chubby cheerful coachman in picture-book style — a round face, a curly grey moustache, a black top hat, "
            "a dark-brown coat with gold buttons, white gloves, holding reins. ")
ROYAL = "Colour mood: soft, elegant picture-book pastels with low saturation — cream, powder blue, rose, gold touches, lavender. "
cinderella = [
    sheet('cd_bg_kitchen', INDOOR, "Scene: a grey cosy kitchen with a big stone hearth with embers and a pot at the left, a high "
          "window with a pale light, hanging pots, a dusty brick floor with soot patches, a broom leaning on the wall. Open floor in the middle."),
    sheet('cd_bg_stairs', INDOOR, "Scene: a LOW-ANGLE view from the bottom of a wide wooden staircase looking up to a landing with a "
          "curtain and a tall framed mirror, a wooden banister, a warm plank floor at the bottom. Open stairs."),
    sheet('cd_bg_hearth', INDOOR + " Dim, warm and tender. ", "Scene: a CLOSE-UP of a small hearth with a gentle orange ember glow "
          "in the middle, a stone fireplace, a small three-legged stool at the left, soot-dusted floor, soft shadows on a dark wall. Hearth clear."),
    sheet('cd_bg_garden', NIGHT, "Scene: a moonlit garden with a big round cream moon in a soft blue sky, a stone path, "
          "an arch of rose bushes, a small shed on the right, a garden bed in the middle, stars. Open path in the middle.", night=True),
    sheet('cd_bg_trap', NIGHT, "Scene: a CLOSE-UP of a garden shed floor at night with a small wooden mousetrap cage at "
          "the left, hay on the floor, a warm lantern glow at the top-right, wooden walls, a pale moonlit window.", night=True),
    sheet('cd_bg_road', NIGHT, "Scene: a SIDE VIEW of a moonlit country road: a big round cream moon, a far-away palace "
          "with lit golden windows on a hill at the right, soft rolling fields, silhouettes of trees, a flat road across the bottom.", night=True),
    sheet('cd_bg_hall', ROYAL, "Scene: a LOW-ANGLE view of a palace ballroom: a huge crystal chandelier with golden candles in the top "
          "centre, tall arched windows, cream columns, a glossy cream marble floor with a gold pattern, red curtains. Floor clear."),
    sheet('cd_bg_tower', NIGHT, "Scene: a LOW-ANGLE view looking up at a palace clock tower: a big round white clock "
          "face with gold hands pointing at twelve and a big gold bell above it, the tower in cream stone, a night sky with stars.", night=True),
    sheet('cd_bg_stairs_high', ROYAL, "Scene: a HIGH-ANGLE view looking down a wide palace staircase with a red carpet running down "
          "the middle, a gold banister, a courtyard at the bottom, soft moonlight. Carpet clear."),
    sheet('cd_bg_parlor', INDOOR, "Scene: a stepmother's elegant parlour: a cream wall with a framed painting, a pink velvet sofa on the "
          "left, a round table, a big window, a floral rug, a warm floor. Open floor in the middle."),
    sheet('cd_bg_palacegarden', SPRING, "Scene: a sunny palace garden: a white marble fountain at the left, flower beds, a trimmed "
          "round-tree hedge, a gold-tipped gate, a pale blue sky, a wide path. Open path."),
    p('cd_cind_sweep', f"{CIND_RAG}Sweeping with a broom, side view facing LEFT, a calm gentle smile."),
    p('cd_cind_cry', f"{CIND_RAG}Sitting on a stool, front view, hands over her face, a little tear drop, sad."),
    p('cd_cind_surprise', f"{CIND_RAG}Front view, standing with hands up, eyes wide, a round open mouth."),
    p('cd_cind_old', f"{CIND_RAG}Standing, front view, hands folded in front, a gentle small smile."),
    p('cd_cind_gown', f"{CIND_GOWN}Standing, front view, twirling slightly, joyful."),
    p('cd_cind_coach', f"{CIND_GOWN}Sitting side view facing RIGHT, waving out, delighted. Show only the girl sitting on nothing."),
    p('cd_cind_dance', f"{CIND_GOWN}Dancing, front view, one arm out, skirt swirling wide, happy closed eyes."),
    p('cd_cind_run', f"{CIND_GOWN}Running down, side view facing RIGHT, holding up her skirt, one glass slipper missing, looking back."),
    p('cd_cind_joy', f"{CIND_RAG}Front view, jumping with joy, arms up, a big smile."),
    p('cd_sis1_pose', f"{SIS1}Standing, front view, chin up, smug, hand on hip."),
    p('cd_sis1_ribbon', f"{SIS1}Front view, wearing a HUGE pink bow on her head covering most of her face, only her eyes peeking out."),
    p('cd_sis1_foot', f"{SIS1}Sitting on a chair, front view, struggling, a big round foot jammed in a small shoe, grimacing, little sweat drops."),
    p('cd_sis2_pose', f"{SIS2}Standing, front view, chin up, snooty, hand on hip."),
    p('cd_sis2_ribbon', f"{SIS2}Front view, wearing a HUGE yellow bow on her head covering most of her face, only her eyes peeking out."),
    p('cd_sis2_foot', f"{SIS2}Sitting on a chair, front view, struggling, a long narrow foot barely in a short shoe, grimacing, sweat drops."),
    p('cd_sis_sorry', f"Two stepsisters together: {SIS1}{SIS2}Front view, hands together, bowing heads in apology, shy sorry faces."),
    p('cd_step_pose', f"{STEPM}Standing, front view, one hand on hip giving orders."),
    p('cd_step_wave', f"{STEPM}Front view, stiffly waving a fan, looking away."),
    p('cd_fairy_pop', f"{FAIRYG}Appearing in a sparkle burst, front view, arms open, kind smile."),
    p('cd_fairy_wave', f"{FAIRYG}Front view, waving the wand with a small round star burst, a mischievous warm face."),
    p('cd_fairy_warn', f"{FAIRYG}Front view, one finger raised, a gentle serious face, as if warning about midnight."),
    p('cd_prince_stand', f"{PRINCE}Standing, front view, a gentle smile."),
    p('cd_prince_dance', f"{PRINCE}Dancing, front view, one hand out toward a partner, kind eyes, joyful."),
    p('cd_prince_slipper', f"{PRINCE}Front view, holding one tiny sky-blue glass slipper in his hands, looking at it curiously."),
    p('cd_footman', f"{FOOT}Standing, front view, holding a small cushion with a sky-blue glass slipper on top."),
    p('cd_mouse', f"{MOUSE}Sitting, front view, a small sweet smile, tiny paws together."),
    p('cd_mouse_run', f"{MOUSE}Running, side view facing LEFT, cheerful."),
    p('cd_horse', f"The white horse: {HORSE}Standing, side view facing RIGHT, pulling forward, happy."),
    p('cd_horse_run', f"The white horse: {HORSE}Galloping, side view facing RIGHT, mane flowing, all legs off the ground."),
    gprop('cd_lizard', f"{LIZ}Sitting upright, front view, smiling."),
    p('cd_coachman', f"{COACHMAN}Sitting on a seat, front view, holding the reins, proud smile. Show only the man sitting on nothing."),
    og('cd_pumpkin', "One big round plump orange pumpkin with soft vertical ribs, a short curly brown stem and a small green leaf, front view."),
    og('cd_eggplant', "One long glossy purple eggplant with a green cap, front view."),
    og('cd_carrot', "One big orange carrot with a green feathery top, front view."),
    og('cd_apple', "One big round red apple with a brown stem and a leaf, front view."),
    og('cd_melon', "One big oval watermelon with dark and light green stripes, front view."),
    o('cd_coach', "A golden fairy-tale carriage shaped like a round pumpkin — a plump orange-gold round cabin with gold ribs, a "
      "curly gold roof knob, two big round gold wheels, a little window, side view facing RIGHT."),
    o('cd_slipper', "One glass slipper in pale sky-blue paper with white highlight pieces and a tiny silver star, side view, pointed toe, "
      "NOT transparent."),
    o('cd_wand', "A gold fairy wand with a bright five-point star tip and a small bow, diagonal, front view."),
    o('cd_trap', "A small wooden mousetrap cage with thin vertical bars and a little round door, empty, side view."),
    o('cd_foot_big', "A big wide round pale foot in a white sock, front view, flat paper, chunky toes."),
    o('cd_foot_long', "A long narrow pale foot in a white sock, front view, flat paper, slim toes."),
    o('cd_foot_just', "A neat medium pale foot in a white sock, front view, flat paper, just a normal slim size."),
    cut('cd_cut_bow', ROYAL, f"Funny: a stepsister with a HUGE pink ribbon bow covering her whole face, only her two round eyes peek "
        f"out, Cinderella laughing quietly. {SIS1}{CIND_RAG}"),
    cut('cd_cut_fairy', ROYAL, f"A kind fairy godmother appears in a swirl of golden sparkles beside a hearth, a girl in a patched dress "
        f"looking up with wide eyes. {FAIRYG}{CIND_RAG}"),
    cut('cd_cut_coach', ROYAL, f"POP! A big orange pumpkin turns into a golden round carriage in a sparkling burst with stars, a "
        f"garden at night. {FAIRYG}"),
    cut('cd_cut_horses', ROYAL, f"POOF: four little mice turn into four white horses in a ring of stars, a fairy waving her wand. "
        f"{FAIRYG}{HORSE}"),
    cut('cd_cut_dress', ROYAL, f"A girl is twirling as her patched dress becomes a sparkling sky-blue ball gown, sparkles rising "
        f"from her feet, glass slippers appearing. {CIND_GOWN}"),
    cut('cd_cut_slipper', NIGHT, f"Slow motion: a girl runs down palace stairs and one sky-blue glass slipper slips "
        f"off and tumbles in the air, a clock striking twelve. {CIND_GOWN}", night=True),
    cut('cd_cut_pumpkin', NIGHT, "A golden carriage turning back into a pumpkin with four mice scattering and a "
        "lizard hopping away in a field at night, soft sparkles fading.", night=True),
    cut('cd_cut_foot', INDOOR, f"A stepsister sits on a chair, her big round foot stuck in a tiny glass slipper, grunting, a valet "
        f"holding the cushion, comic strain lines. {SIS1}{FOOT}"),
]

# ================= 흥부와 놀부 (heungbu) =================
HEUNG = ("Heungbu: a kind poor Korean man in picture-book style — a round friendly face, a topknot with a tiny cloth tie, a gentle "
         "smile, a patched cream hanbok jeogori and baggy trousers, worn straw shoes. ")
NOL = ("Nolbu: a greedy Korean man in picture-book style — a round rather big face, a thin curled moustache, a smug scheming smile, a "
       "fancy gold-brocade rose-pink hanbok with a black gat hat, plump belly, white socks. ")
HWIFE = ("Heungbu's wife: a kind thin Korean woman in picture-book style — her hair in a bun with a wooden pin, rosy cheeks, a "
         "patched cream jeogori and a faded blue skirt. ")
NWIFE = ("Nolbu's wife: a plump scolding Korean woman in picture-book style — a tight bun with a gold pin, pinched eyebrows, a "
         "plum-purple jeogori and a wide dark-blue skirt, holding a big rice paddle. ")
SWALLOW = ("The swallow: a small round swallow made of flat paper pieces — a glossy dark-blue back and head, a pale cream belly, a "
           "persimmon-orange throat patch, a forked tail, a small black beak, big round eyes, pink cheek; ")
BABYSW = ("The baby swallow: a tiny round fluffy swallow chick made of flat paper pieces — soft cream-grey down, a big wide-open "
          "pale-orange beak, big round eyes, tiny stubby wings; ")
DOKK = ("The dokkaebi: a funny friendly Korean goblin made of flat paper pieces — a round blue-grey face with ONE short horn on top, a "
        "big silly toothy-free grin, round eyes, messy bushy hair, a tiger-striped orange-and-black loincloth skirt, a big round-head "
        "club, round belly, bare feet, cute and goofy, never scary. ")
heungbu = [
    sheet('hb_bg_hut', HANOK, "Scene: a crooked tiny thatched hut with a patched roof and a sagging wooden porch seen straight-on, "
          "a small swallow's nest of mud and straw under the eaves at the top right, a bare tree at the left, a worn dirt yard, a pale sky. Yard clear."),
    sheet('hb_bg_nolkitchen', HANOK, "Scene: a Korean farmhouse kitchen door seen straight-on: a big open wooden kitchen doorway with "
          "a rice pot on a stove in the dark behind, a tiled eave above, a stone step, a warm yard, pots lined at the side. Doorway area open."),
    sheet('hb_bg_eaves', HANOK, "Scene: a LOW-ANGLE view looking up from the yard at the thatched eaves of a hut with a small swallow's "
          "nest under the eaves in the centre top, a pale blue sky and a few clouds, a bare branch at the side. Open sky."),
    sheet('hb_bg_palm', HANOK, "Scene: a CLOSE-UP of a wide open palm of a hand, a pale warm paper skin with soft lines, filling the "
          "lower two-thirds, a blurry soft yard in the background, a pale sky. Palm clear."),
    sheet('hb_bg_sky_autumn', AUTUMN, "Scene: a wide empty autumn sky: a pale peach and apricot sky with soft round clouds, a few "
          "golden leaves floating, faint distant hills along the bottom, a small sun at the upper left."),
    sheet('hb_bg_sky_spring', SPRING, "Scene: a wide empty spring sky: a pale sky blue with soft round white clouds, a few flower "
          "petals floating, faint distant green hills along the bottom, a small sun at the upper left."),
    sheet('hb_bg_roof', HANOK, "Scene: a SIDE VIEW of a thatched farmhouse with a curved straw roof at the left, a long bare patch "
          "of ground at the right for a vine, a stone wall, a pale sky, a small tree. Right area clear."),
    sheet('hb_bg_yard', HANOK, "Scene: a Korean farmyard seen straight-on: a thatched hut at the left with a porch, a stone wall, a "
          "tall bare patch of packed earth in the middle, a persimmon tree, a pale sky. Yard clear."),
    sheet('hb_bg_nol_eaves', HANOK, "Scene: the roof eaves of a grand tiled Korean house seen straight-on: a gray-tiled curved roof "
          "with a swallow's nest under the eaves at the top right, a rich wooden porch, a stone-edged yard, a pale sky. Yard clear."),
    sheet('hb_bg_nolyard', HANOK, "Scene: a wealthy man's big tiled-roof Korean yard seen straight-on: a big gate behind, stone steps, "
          "a wide packed-earth yard in the middle, pots and jars at the edge. Yard clear."),
    sheet('hb_bg_manor', SUNSET, "Scene: a grand tiled Korean house at sunset: a big tile-roofed hall, a wide open gate at the front, "
          "a stone path, a persimmon tree, a golden sunset sky, a wide clear yard in the front."),
    p('hb_heung_hello', f"{HEUNG}Standing, front view, waving hello with a big gentle smile."),
    p('hb_heung_rice', f"{HEUNG}Front view, picking a grain of rice from his cheek and eating it, sticky rice grains on both cheeks, happy."),
    p('hb_heung_catch', f"{HEUNG}Front view, both hands cupped open in front to catch something, kind concerned face."),
    p('hb_heung_wrap', f"{HEUNG}Front view, holding a small hurt swallow in one hand and wrapping a cloth with the other, gentle focus."),
    p('hb_heung_plant', f"{HEUNG}Bending down side view facing LEFT, planting a tiny seed in the soil, happy."),
    p('hb_heung_saw', f"{HEUNG}Side view facing LEFT, pulling a long hand saw, one foot forward, a cheery singing face, mouth open."),
    p('hb_heung_glad', f"{HEUNG}Front view, arms open wide, a very happy welcoming face."),
    p('hb_nol_proud', f"{NOL}Standing, front view, chin high, arms crossed, smug."),
    p('hb_nol_shake', f"{NOL}Reaching up with both hands, side view facing LEFT, shaking something, a stubborn greedy face."),
    p('hb_nol_wrap', f"{NOL}Front view, sloppily winding a long cloth around a swallow's leg, clumsy and rushed face."),
    p('hb_nol_saw', f"{NOL}Side view facing LEFT, pulling a long hand saw greedily, sweating, excited."),
    p('hb_nol_ouch', f"{NOL}Front view, jumping with both hands on his bottom, eyes squeezed shut, mouth wide, little stars on his bottom."),
    p('hb_nol_mud', f"{NOL}Front view, sitting, covered in thick dripping brown muddy water, only his eyes visible, shocked. The water is "
      "plain brown mud."),
    p('hb_nol_shy', f"{NOL}Front view, head bowed, hands together, embarrassed and sorry, red ears."),
    p('hb_hwife', f"{HWIFE}Standing, front view, a kind smile, carrying a small bowl."),
    p('hb_hwife_joy', f"{HWIFE}Front view, hands clasped to her cheeks, tears of joy, a wide smile."),
    p('hb_nwife', f"{NWIFE}Front view, raising the big rice paddle, a scolding face."),
    p('hb_nwife_smile', f"{NWIFE}Front view, hiding the paddle behind her, a fake sweet smile."),
    p('hb_swallow_fly', f"{SWALLOW}Flying, side view facing RIGHT, wings spread, forked tail trailing."),
    p('hb_swallow_hurt', f"{SWALLOW}Sitting on one palm, front view, one leg tucked, hurting, sad eyes."),
    p('hb_swallow_band', f"{SWALLOW}Sitting, front view, one leg wrapped in a cream cloth with a small red ribbon bow, a happy chirping beak."),
    p('hb_swallow_seed', f"{SWALLOW}Flying, side view facing LEFT, carrying a small gold seed in its beak."),
    p('hb_chicks', f"{BABYSW}Three baby swallows side by side in a mud nest, all with wide open beaks, cheeping, front view."),
    p('hb_chick_fall', f"{BABYSW}Falling, front view, tumbling in the air with tiny wings flapping, a worried face."),
    p('hb_dokkaebi', f"{DOKK}Standing, front view, holding the club on his shoulder, a goofy grin."),
    p('hb_dokkaebi_hit', f"{DOKK}Side view facing LEFT, swinging the club down with a big grin, a round 'bonk' star."),
    gprop('hb_gourd', "A big round pale-green and cream bottle gourd (bak) with a short curly vine, side view, plump and smooth.", ),
    o('hb_gourd_open', "A big gourd split in two halves showing a pale cream empty inside, side view, flat simple shapes."),
    o('hb_rice', "A big woven rice sack with a rope tie, white rice pouring out of the top in a waterfall, front view."),
    o('hb_treasure', "A pile of shiny gold coins, silver bars and sparkling red-and-blue jewels, front view, flat simple paper."),
    o('hb_saw', "A long wooden-handled hand saw with a curved silver blade, side view, flat simple shapes."),
    o('hb_paddle', "A big wooden rice paddle (jumeok) with a few rice grains stuck on it, front view."),
    o('hb_splint_good', "One long straight thin light-brown twig, a perfect little splint, front view."),
    o('hb_splint_curvy', "One long curvy winding brown twig with two bends, front view."),
    o('hb_splint_log', "One thick short rough brown log, front view."),
    o('hb_cloth', "A cream cloth bandage strip with a small red ribbon, loosely curled, front view."),
    o('hb_seed', "One big shiny gold seed with a small leaf, front view."),
    og('hb_vine', "A tall curly green gourd vine with heart-shaped leaves and tiny white flowers, front view, one clear plant."),
    cut('hb_cut_rice', HANOK, f"SMACK: a woman swings a rice paddle and a man's cheek is covered in rice grains, he cheerfully pops "
        f"one in his mouth, funny stars. {HEUNG}{NWIFE}"),
    cut('hb_cut_fall', HANOK, f"A baby swallow tumbles down out of a mud nest under thatched eaves, a worried kind man below with "
        f"open hands. {BABYSW}{HEUNG}"),
    cut('hb_cut_bandage', HANOK, f"A kind man tying a little ribbon bow on a swallow's leg bandage, the swallow chirping gratefully, "
        f"close-up. {HEUNG}{SWALLOW}"),
    cut('hb_cut_south', AUTUMN, f"A small swallow flying off alone across a big round warm sunset toward faraway hills, feathers "
        f"floating, gentle. {SWALLOW}"),
    cut('hb_cut_seedback', SPRING, f"A swallow flies back in spring with a gold seed in its beak, a kind man looks up with a joyful face. "
        f"{SWALLOW}{HEUNG}"),
    cut('hb_cut_rice_pour', HANOK, "A big gourd splits open and white rice pours out in a huge waterfall of rice grains, sparkling, "
        "a kind man and woman amazed with open arms."),
    cut('hb_cut_house', HANOK, "Little builders made of paper pop out of a gourd and quickly build a big tiled-roof house with hammers "
        "and boards, a big starburst, joyful."),
    cut('hb_cut_dokkaebi', HANOK, f"Funny: a group of three goofy friendly goblins with one horn each and big clubs bonking a "
        f"startled man's bottom with round stars, from a split gourd. {DOKK}{NOL}"),
    cut('hb_cut_mud', HANOK, f"Brown muddy water pours out of a split gourd like a waterfall on top of a startled man with a hat "
        f"flying, big funny splashes. {NOL}"),
    cut('hb_cut_collapse', HANOK, f"A grand tiled house tilting and falling in pieces with clouds of dust, a startled man and "
        f"woman at the side. {NOL}{NWIFE}"),
]
