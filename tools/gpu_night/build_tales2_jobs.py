#!/usr/bin/env python3
"""남은 동화 8편 페이퍼아트 애셋 목록 → jobs_sun_wind.json … jobs_ugly_duckling.json
근거: tales/<t>/<t>.js 임시 그림(greybox)의 장면·배우·자세·컷, voice_script.json, TALES_PLAN*.md, DESIGN_SYSTEM.md.
build_tales_jobs.py(개구리·토끼·해님달님)와 같은 방식이되, 그 뒤에 배운 것을 반영한다:
  - 배경(sheet) 프롬프트에 HEX 색 코드를 넣지 않는다 → 채도 높은 하늘(형광 노랑·라임·보라 물)이 나왔다. 색은 말로만.
  - 밤·어두운 장면은 '밝고 잘 읽히는 그림책 밤'을 꼭 요구한다 → 안 그러면 거의 새까맣게 나온다.
  - 가는 '띠' 소품은 요청하지 않는다(색 견본 줄무늬가 나온다) — 코드로 그리거나 배경에서 잘라 쓴다.
  - 한 장면 = 한 장짜리 다층 배경. 배경을 조각 소품으로 쪼개지 않는다. 배경 아래 가운데는 비워 둔다.
  - 초록(연두) 캐릭터·소품은 마젠타 배경(gprop)으로 뽑는다 → 라임 키잉이 초록 몸을 먹는다.
순서: 배경 → 주인공 주요 자세 → 조연·소품 → 컷."""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(HERE, 'style_base.json')))
STYLE, NEG = base['STYLE'], base['NEG']
NEG_BG = NEG + ", torn paper edge, deckled edge, empty flat background, large area of one plain color, text, letters"
KID = ("Cute, round, friendly Korean picture-book characters for 3-4 year olds: big round white paper eyes with dark pupils, "
       "small pink cheek circles, simple rounded shapes, never scary. ")
DEPTH = ("A layered paper-cut diorama scene seen straight-on: the scene is built from SIX to EIGHT flat paper layers one behind "
         "another (far sky, distant hills, middle ground, ground, near foreground), each layer a cut-paper silhouette casting a soft "
         "warm shadow on the layer behind, giving strong depth like a shadow-box. Leave the lower middle of the image open and "
         "uncluttered so characters can stand there. ")

# ---- 색 분위기: 말로만 (HEX 금지) ----
PASTEL = ("Colour mood: soft, muted, gentle picture-book pastels with low saturation — the sky is a pale soft blue fading to a very "
          "light warm cream near the horizon (never saturated yellow, never lime), greens are calm sage and pine greens, water is a "
          "soft muted teal-blue (never purple). ")
INDOOR = ("Colour mood: soft, muted, warm picture-book pastels with low saturation — cream walls, honey and light wood browns, "
          "gentle warm light; never saturated, never dark. ")
BRIGHT_NIGHT = ("IMPORTANT BRIGHTNESS: even though it is a night or dark scene, render it as a BRIGHT, clearly readable picture-book "
                "night — mid-tone blues and warm lamp or moon light lighting everything, all shapes and colours easy to see; "
                "never near-black, never murky. ")
NEG_PASTEL = ", saturated yellow, neon, lime green, purple water, fluorescent, oversaturated"
NEG_NIGHT = ", near black, too dark, underexposed, murky, black image"
NEG_NOBODY = ", people, humans, animals, characters, creatures"


def sheet(name, mood, body, neg='', night=False, nobody=True):
    """화면 가득 한 장짜리 다층 배경 1760×992. mood는 말로 된 색 분위기(HEX 금지)."""
    extra = BRIGHT_NIGHT if night else ''
    return {'name': name, 'w': 1760, 'h': 992, 'cfg': 3.0, 'key': False, 'trim': False,
            'negative': NEG_BG + NEG_PASTEL + (NEG_NIGHT if night else '') + (NEG_NOBODY if nobody else '') + neg,
            'prompt': f"{STYLE} {DEPTH}{body} A FULL-BLEED sheet filling the ENTIRE image edge to edge, no lime green, "
                      f"no characters unless described. {mood}{extra}No text, no watermark."}


def _iso(name, body, magenta, wide, tall, neg):
    w, h = (1760, 992) if wide else (768, 1280) if tall else (1024, 1024)
    if magenta:
        bg, word = "Isolated on a plain solid flat bright MAGENTA (#FF00FF) background, nothing else.", 'magenta'
        neg_bg = ", lime green background, green background, pink tint on the character"
    else:
        bg, word = "Isolated on a plain solid flat lime green (#7CFC00) background, nothing else.", 'lime'
        neg_bg = ''
    no_shadow = (f"The paper pieces cast NO shadow onto the {word} area: no drop shadow, no ground shadow, no backing shape — "
                 f"only tiny shallow shadows between their own stacked pieces. Do NOT paint any glow, halo or colour onto the "
                 f"{word} background; the {word} stays one perfectly flat uniform colour right up to the paper edges. ")
    return {'name': name, 'w': w, 'h': h, 'cfg': 3.0, 'key': True, 'trim': True, 'nogreen': not magenta,
            'negative': NEG_BG + ", glow on background, halo, green shadow, duplicate, two of them, color swatches, colour palette chart, "
                                 "stack of colored strips, sample color bars" + neg_bg + neg,
            'prompt': f"{STYLE} {KID}{body} Shown whole and uncropped, centered. {bg} {no_shadow}No text, no watermark."}


def prop(name, body, wide=False, tall=False, neg=''):
    """라임 배경 단독 요소(초록 없는 캐릭터·소품) → 키잉·트림."""
    return _iso(name, body, False, wide, tall, neg)


def gprop(name, body, wide=False, tall=False, neg=''):
    """초록·연두·노란빛 초록이 들어간 캐릭터·소품 → 마젠타 배경 (jobs_green_redo.json 방식)."""
    return _iso(name, body, True, wide, tall, neg)


def cut(name, mood, body, neg='', night=False):
    """1024×768 만화 액션 컷(화면 가득)."""
    return {'name': name, 'w': 1024, 'h': 768, 'cfg': 3.0, 'key': False, 'trim': False,
            'negative': NEG + ", frame, border, comic panel border, scary, blood, fangs, realistic animal, text, letters"
                        + NEG_PASTEL + (NEG_NIGHT if night else '') + neg,
            'prompt': f"{STYLE} This is one DRAMATIC COMIC ACTION PANEL filling the ENTIRE image edge to edge (full-bleed, no "
                      f"border): bold dynamic composition, big flat paper speed-line strips, kid-friendly and funny, never scary. "
                      f"{KID}{body} {mood}{BRIGHT_NIGHT if night else ''}No text anywhere. Full-bleed illustration, no lime green."}


CUT_MOOD = "Colour mood: soft, warm, gentle picture-book pastels with low saturation. "


# ---- 여러 동화에 나오는 동물: 한 번 정한 생김새(바이블)를 같이 쓴다 ----
# 개·고양이·생쥐 = 순무에서 처음 만드는 '농장 동물 세트'(TALES_PLAN_2 §4-5) → 브레멘·사자와 생쥐·미운 아기 오리가 이어 쓴다.
# 고양이는 금빛 몸이라 라임 배경으로 괜찮다(초록이 없다). 수탉 꼬리깃은 초록 대신 빨강·금·갈색으로 정해 라임으로 뽑는다.
DOG = ("The dog: a cute tan-brown puppy made of flat paper pieces — a round head with a cream muzzle and a black nose, one floppy "
       "dark-brown ear, darker brown legs, a small curled-up tail, a red collar, bright round eyes, pink cheeks. ")
CAT = ("The cat: a cute golden-yellow cat made of flat paper pieces — three persimmon-orange tabby stripes on its back, pointed ears "
       "with pink insides, a small pink nose, short whiskers, a tall upright tail, bright round eyes, pink cheeks. ")
MOUSE = ("The mouse: a tiny grey-brown mouse made of flat paper pieces — round body with a cream belly, big round ears with pink insides, "
         "a small pointed snout with a black nose tip, tiny pink feet and a long thin curly pink tail, bright round eyes. ")
ROOSTER = ("The rooster: a cute round white rooster made of flat paper pieces — a red comb of three round bumps, a red wattle, a small "
           "golden beak, a cream wing, a fan of tail feathers in red, gold and brown (no green), golden legs, bright round eyes. ")
DUCK = ("The white duck: a cute round white duck made of flat paper pieces — a pale grey wing, a small upturned tail, a flat orange "
        "bill, orange feet, bright round eyes, pink cheeks. ")

# ---- 계절 색 분위기 (말로만) ----
AUTUMN = ("Colour mood: soft, muted autumn picture-book pastels with low saturation — a pale peach and cream sky, gentle honey-gold, "
          "soft orange and warm brown leaves; never saturated, never neon orange. ")
WINTER = ("Colour mood: soft, bright winter picture-book pastels — clean snow white, very pale blue-grey sky and shadows, a few warm "
          "brown touches; bright and gentle, never grey and gloomy. ")
SPRING = ("Colour mood: soft, fresh spring picture-book pastels with low saturation — a pale soft blue sky, calm light sage greens, "
          "gentle pink blossoms; never lime, never saturated. ")
SUNSET = ("Colour mood: soft, warm picture-book sunset pastels with low saturation — a gentle peach and apricot sky fading to cream, "
          "a big soft orange sun, calm olive and sage hills; never saturated, never neon. ")

# ================= 해와 바람 (sun_wind) =================
# 해·바람은 사물 캐릭터라 정면. 나그네도 코드에서 정면으로만 쓴다. 나그네는 초록 티셔츠라 전 자세 마젠타.
SUN = ("The sun: a round friendly paper SUN, front view — a golden disc with a pale buttery centre, twelve rounded triangular rays "
       "alternating soft orange and gold all around, happy closed eyes as upward arcs, pink cheeks, a warm smile. ")
WIND = ("The wind: a cute puffy white paper CLOUD character, front view — five round white puffs with soft blue-grey shadow pieces "
        "underneath, three soft blue-grey wind-streak curls trailing off to the LEFT, round dark eyes with white highlights, pink "
        "cheeks. A playful prankster, never mean. ")
TRAV = ("The traveller: a friendly young Korean man in picture-book style, front view — round face, short dark-brown hair, dot eyes, "
        "pink cheeks; a sage-green T-shirt, brown trousers, dark shoes; ")
HAT = "a round brown hat with a gold band"
COAT = "a long brick-red coat with a darker red collar and four round gold buttons"
sun_wind = [
    sheet('sw_bg_sky', PASTEL, "Scene: high up in the sky above the clouds: a pale soft blue sky with a few small drifting white paper "
          "clouds near the top, and a thick soft floor of layered round cloud banks (white, pale grey-blue, cream) across the bottom "
          "third, like a stage made of clouds."),
    sheet('sw_bg_high', PASTEL, "Scene: a view looking STRAIGHT DOWN from high in the sky onto the countryside: a patchwork of soft "
          "sage, olive and pale gold fields, round pine-tree crowns, one little house seen from above on the right (cream walls, "
          "golden roof), a winding light dirt road running from the bottom centre up to the top, soft white cloud edges in the two "
          "top corners."),
    sheet('sw_bg_field', PASTEL, "Scene: a wide open country road on a calm day: a pale soft sky, a gentle distant olive hill, a grass "
          "band, one round tree left of centre, grass tufts, and a light dirt road running straight across the lower part. Lots of "
          "open sky in the upper left and upper right."),
    sheet('sw_bg_stream', PASTEL, "Scene: a gentle stream bank on a warm day: pale sky, a soft hill, grass with a few small orange "
          "flowers, a soft teal-blue stream across the bottom with white ripple pieces, and ONE flat round grey rock on the bank "
          "left of centre, big enough to sit on."),
    sheet('sw_bg_snow', WINTER, "Scene: a soft snowy day: a very pale blue-grey sky with round paper snowflakes falling, a gentle white "
          "snowy hill across the lower half, two small snow-covered trees at the edges."),
    prop('sw_sun', f"{SUN}"),
    prop('sw_wind', f"{WIND}A cheeky proud smile."),
    prop('sw_wind_blow', f"{WIND}Cheeks puffed up huge and round, lips pursed in a small round O, blowing hard with strong wind-streak "
         "curls, eyes squeezed with effort."),
    prop('sw_wind_tired', f"{WIND}Exhausted and a little deflated: droopy puffs, wrinkly tired eyes, two blue sweat drops, a wobbly "
         "panting mouth."),
    gprop('sw_trav_walk', f"{TRAV}wearing {HAT} and {COAT} hanging OPEN over the T-shirt. Standing, front view, arms down, smiling."),
    gprop('sw_trav_hold', f"{TRAV}NO hat, messy hair. {COAT} pulled tightly SHUT, both arms crossed hugging himself, shivering, "
          "cold face with gritted zigzag teeth. Front view."),
    gprop('sw_trav_fan', f"{TRAV}{COAT} hanging open, fanning his face with {HAT} held up in one hand, sweat drops, round 'o' mouth, "
          "hot. Front view."),
    gprop('sw_trav_shoulder', f"{TRAV}wearing {HAT}, the brick-red coat slung over one shoulder, only the green T-shirt on, a big "
          "happy smile. Front view."),
    gprop('sw_trav_shirt', f"{TRAV}wearing {HAT}, no coat, just the green T-shirt with bare forearms, arms down, smiling. Front view."),
    gprop('sw_trav_sit', f"{TRAV}no coat, sitting (with nothing under him), knees forward, trouser legs rolled up, bare feet dangling "
          "as if dipped in water, relaxed happy smile. Front view."),
    gprop('sw_trav_scarf', f"{TRAV}{COAT} buttoned shut, a warm pine-green knitted scarf around his neck, {HAT}, cosy smile. Front view."),
    gprop('sw_trav_rain', f"{TRAV}wearing a golden-yellow raincoat with its hood up, happy smile, arms down. Front view."),
    prop('sw_hat', f"Just {HAT}, tilted, by itself."),
    prop('sw_coat', f"Just {COAT}, laid flat and open, by itself, sleeves out."),
    prop('sw_cloud_rain', "A small grey-blue rain cloud of round puffs with three blue raindrops falling below it, a sleepy smile."),
    prop('sw_cloud_snow', "A small pale snow cloud of round puffs with three round white snowflakes falling below it, a happy smile."),
    cut('sw_cut_hat', PASTEL, f"WHOOSH! {HAT} flies off the traveller's head and spins away into the sky, big white wind streaks and "
        f"speed lines, the traveller below grabbing at air with a surprised face. {TRAV}{COAT}"),
    cut('sw_cut_hold', PASTEL, f"Close-up: the traveller holds his coat tightly shut with arms crossed, shivering in a strong wind, "
        f"white zigzag shiver lines on both sides, no hat. {TRAV}{COAT}"),
    cut('sw_cut_pant', PASTEL, f"Close-up: the worn-out wind cloud pants, wrinkly and sweating, squashed and deflated, funny. {WIND}"),
    cut('sw_cut_off', "Colour mood: soft, warm picture-book pastels with a gentle warm sunny sky. ",
        f"The traveller happily flings his red coat off into the air under the warm sun, big open-mouth laugh. {TRAV}{COAT}"),
    cut('sw_cut_shake', PASTEL, f"Friends again: the wind cloud and the smiling sun shake hands in the sky, a little warm sparkle "
        f"between them. {WIND}{SUN}"),
]

# ================= 커다란 순무 (turnip) =================
# 코드는 모두 왼쪽을 보는 측면. 당기기·주저앉기·벌러덩은 코드가 회전으로 만든다 → '당기기' 한 장이 기본.
FARM = PASTEL
GRANDPA = ("Grandpa: a kind old Russian-style grandpa in picture-book style, side view facing LEFT — a big round white beard, a rosy "
           "nose, a dot eye, pink cheek, a brown flat cap, a pine-green long tunic with a gold belt, brown trousers, dark boots. ")
GRANDMA = ("Grandma: a cheerful old grandma, side view facing LEFT — a red headscarf tied with a little knot tail at the back, a "
           "persimmon-orange dress with a cream apron, a white blouse, a smiling mouth, pink cheek. ")
GIRL = ("The granddaughter: a small girl, side view facing LEFT — brown hair in a round bun, a bean-red dress, red shoes, pink cheek, "
        "smiling. ")
TURNIP = ("The turnip: a big round white turnip with a soft reddish-purple top band, a short cream taproot, and five tall sage and "
          "pine-green leaves with vein pieces fanning out on top. ")
PULL = ("Pulling hard: leaning back away from the left, both arms reaching forward to the LEFT as if gripping someone in front, "
        "feet planted, determined 'heave-ho' face.")
turnip = [
    sheet('tn_bg_garden', FARM, "Scene: a side view of a country vegetable garden: pale soft sky with a small sun at upper left, a "
          "gentle green hill, a small log cabin with a red roof far away on the right, a low brown picket fence on the far left, "
          "brown soil with furrow rows across the bottom. Open space across the middle."),
    sheet('tn_bg_lowangle', FARM, "Scene: a very low view from the soil looking up: a big pale soft blue sky with two small clouds and "
          "a small sun at upper right, a band of brown garden soil along the bottom."),
    sheet('tn_bg_door', FARM, "Scene: the front of a cosy log cabin seen straight-on, filling the left two thirds: stacked log wall, a "
          "red roof, a warm window, and a closed wooden door just left of centre; soft grass ground and an open yard on the right."),
    sheet('tn_bg_fence', FARM, "Scene: a tall cream-and-beige wooden picket fence with brown rails running across the middle, pale sky "
          "above, soft grass ground in front."),
    sheet('tn_bg_barn', FARM, "Scene: a big friendly red barn seen straight-on with plank lines, a brown pitched roof with a flat ridge "
          "on the right side (room for a cat to sit), a dark door with a cream X brace, pale sky with a small sun at upper left, grass."),
    sheet('tn_bg_mouse', FARM, "Scene: a mouse's-eye view: a wall of giant grass blades in two soft greens behind, big soil clods at "
          "the left and right, and a small round dark mouse hole with a little soil mound in the ground at the centre."),
    sheet('tn_bg_feast', SUNSET, "Scene: a garden at sunset: a big soft orange setting sun low on the left, a gentle olive hill, the "
          "little log cabin with a warm window on the right, straw-coloured ground. Open space in the middle for a table."),
    gprop('tn_turnip', f"{TURNIP}The whole turnip, upright, leaves up, big and proud."),
    gprop('tn_sprout', "A small young turnip sprout: two round sage-green seed leaves and one small pine-green leaf on a short stem, "
          "a tiny white turnip top peeking out."),
    gprop('tn_grandpa_stand', f"{GRANDPA}Standing, arms at his sides, friendly smile."),
    gprop('tn_grandpa_pull', f"{GRANDPA}{PULL}"),
    gprop('tn_grandpa_sit', f"{GRANDPA}Fallen back on his bottom with his legs out in front, a surprised dizzy face, cap askew."),
    prop('tn_grandma_stand', f"{GRANDMA}Standing, arms at her sides, happy."),
    prop('tn_grandma_pull', f"{GRANDMA}{PULL}"),
    prop('tn_girl_pull', f"{GIRL}{PULL}"),
    prop('tn_dog_pull', f"{DOG}Side view facing LEFT, standing on its hind legs, {PULL}"),
    prop('tn_dog_jump', f"{DOG}Side view facing RIGHT, leaping happily through the air, ears flying, tongue out."),
    prop('tn_cat_pull', f"{CAT}Side view facing LEFT, standing on its hind legs, {PULL}"),
    prop('tn_cat_sit', f"{CAT}Sitting neatly, side view facing LEFT, tail curled around, content closed-arc eyes."),
    prop('tn_mouse_pull', f"{MOUSE}Side view facing LEFT, standing up on its hind legs, {PULL}"),
    prop('tn_pot', "A big round dark iron cooking pot with a white brothy rim of turnip soup and soft steam curls rising."),
    gprop('tn_watering_can', "A pine-green watering can with a long spout and a round handle, tilted, a few blue water drops."),
    cut('tn_cut_glare', FARM, f"Face to face: the dog on the left and the cat on the right glare at each other with puffed cheeks, a "
        f"funny yellow lightning zigzag between their eyes. {DOG}{CAT}"),
    cut('tn_cut_pop', FARM, f"POP! The giant turnip bursts out of the soil into the air with flying soil clods and a big paper "
        f"starburst, everyone behind it tumbling backwards in a happy heap. {TURNIP}"),
]

# ================= 사자와 생쥐 (lion_mouse) =================
SAVANNA = ("Colour mood: soft, muted, warm picture-book savanna — a pale soft cream-blue sky, gentle honey and sandy tan ground, "
           "calm sage-green grass and acacia leaves, low saturation (never saturated yellow, never orange sky). ")
LION = ("The lion: a big, soft, cuddly lion made of flat paper pieces — warm honey-gold body, a big round mane of rounded persimmon-orange "
        "petal-shaped paper pieces all around its face, round ears, a cream muzzle with a small brown nose, pink cheeks, a long tail "
        "with a dark tuft. Gentle and sleepy-looking, never scary, no teeth showing. ")
lion_mouse = [
    sheet('lm_bg_savanna', SAVANNA, "Scene: a warm savanna afternoon: rolling tan hills, a soft round sun at upper right, ONE big flat-topped "
          "acacia tree at centre-right with a wide umbrella canopy casting cool shade on the ground below it, grass tufts at both edges."),
    sheet('lm_bg_grass', SAVANNA, "Scene: a mouse's-eye view of tall grass that looks like a forest: many huge blades of grass in two soft "
          "greens towering up at both sides and behind, one tall white daisy with a gold centre at upper left, a strip of soft earth "
          "along the bottom. Plenty of open space across the middle."),
    sheet('lm_bg_lowangle', SAVANNA, "Scene: a very low worm's-eye view from the ground: tall pointed grass blades rising up at both edges, "
          "a big pale sky filling most of the image, a narrow strip of earth at the very bottom."),
    sheet('lm_bg_night_forest', "Colour mood: gentle picture-book night — mid-tone teal-blue and soft sage greens, moonlit, low saturation. ",
          "Scene: a TOP-DOWN view looking straight down onto a forest clearing at night: round bush clumps and tree crowns around the "
          "edges, a lighter soft-green grassy oval clearing in the middle, three grey stones.", night=True),
    sheet('lm_bg_night_net', "Colour mood: gentle picture-book night — mid-tone blues, soft sage greens, a cream moon, low saturation. ",
          "Scene: a quiet savanna at night: a blue sky with a round cream moon at upper right and a few paper stars, dark soft rolling "
          "hills, a grassy ground band across the lower third.", night=True),
    sheet('lm_bg_morning', SAVANNA, "Scene: a very wide sunny morning savanna for a happy run: a soft round morning sun at upper left, "
          "several flat-topped acacia trees spread far apart along distant hills, grass tufts, a light open ground across the bottom."),
    prop('lm_lion_sleep', f"{LION}Lying down asleep on its belly, side view facing LEFT, front paws stretched forward, eyes closed as "
         "peaceful arcs, tail curled behind, a calm sleepy smile.", wide=True),
    prop('lm_lion_lie_awake', f"{LION}Lying down on its belly, side view facing LEFT, front paws forward, eyes wide open and worried, "
         "mouth open calling for help, not scary.", wide=True),
    prop('lm_lion_head_yawn', f"{LION}Only the big HEAD and mane, front view, half-closed sleepy eyes, mouth open in a huge round YAWN "
         "(pink inside, no teeth)."),
    prop('lm_lion_head_laugh', f"{LION}Only the big HEAD and mane, front view, eyes squeezed shut as happy upward arcs, mouth wide open "
         "laughing out loud (pink inside, no teeth)."),
    prop('lm_lion_stand', f"{LION}Standing on four legs, side view facing LEFT, tail raised, happy eyes as upward arcs, a big friendly smile, "
         "flat broad back."),
    prop('lm_lion_paw', f"{LION}Only one GIANT front PAW and leg coming straight down from above, like a big honey-gold column ending in "
         "a round paw with four dark-brown toe pads, seen from the side.", tall=True),
    prop('lm_mouse_walk', f"{MOUSE}Walking on all fours, side view facing LEFT, curious happy face, tail curling up."),
    prop('lm_mouse_pray', f"{MOUSE}Standing on its hind legs, side view facing LEFT, both tiny front paws pressed together begging "
         "'please', big pleading eyes, ears drooping a little."),
    prop('lm_mouse_run', f"{MOUSE}Running away fast, side view facing LEFT, legs stretched out, ears back, tail streaming behind."),
    prop('lm_mouse_gnaw', f"{MOUSE}Sitting up, side view facing LEFT, holding a thick straw-coloured rope end in both paws and gnawing it "
         "with two white front teeth showing, determined face, a few tiny rope bits flying."),
    cut('lm_cut_paw', SAVANNA, f"THUD! A gigantic lion paw slams down onto the grass right beside a tiny startled mouse, who jumps in the "
        f"air with ears straight up; big paper dust puffs. {LION}{MOUSE}"),
    cut('lm_cut_laugh', SAVANNA, f"A close-up of the big lion's head laughing out loud, eyes squeezed shut, mouth wide open, while a tiny "
        f"mouse stands bravely on the grass in front of it. {LION}{MOUSE}"),
    cut('lm_cut_net', "Colour mood: gentle picture-book night — mid-tone blues, a cream moon, low saturation. ",
        f"The lion is tangled in a big straw-coloured rope net at night, wriggling and calling for help, funny worried face, "
        f"not hurt. {LION}", night=True),
    cut('lm_cut_gnaw', "Colour mood: gentle picture-book night — mid-tone blues, a cream moon, low saturation. ",
        f"Close-up: the brave little mouse gnaws through a thick rope of the net with its two front teeth, SNAP — the rope splits "
        f"with a little paper starburst, the lion's hopeful eye peeking behind. {MOUSE}{LION}", night=True),
]

# ================= 여우와 두루미 (fox_crane) =================
FOREST = PASTEL
FOX = ("The fox: a cute persimmon-orange fox made of flat paper pieces — a cream chest and cream-tipped big bushy tail, pointed ears "
       "with dark insides, a long pointed snout with a black nose tip, black socks on its four legs, bright round eyes, pink cheeks. ")
CRANE = ("The crane: a cute Korean red-crowned crane made of flat paper pieces — a round snow-white body, black tail plumes, a long "
         "black S-curved neck, a white head with a small red crown patch on top, a long pointed golden beak, two thin black legs, "
         "bright round eyes. ")
fox_crane = [
    sheet('fc_bg_forest', FOREST, "Scene: a sunny forest edge: layered rounded pine trees in soft sage and pine greens, gentle hills, "
          "a small soft sun at upper right, a dirt path across the front, a few tiny orange flowers."),
    sheet('fc_bg_kitchen', INDOOR, "Scene: inside the fox's cosy burrow kitchen: a rounded arched earthen wall in warm light browns, a round "
          "window with a cross frame at upper right, a wooden shelf with four little clay jars at upper left, bunches of herbs hanging "
          "from the ceiling, a wooden floor. An open floor space at centre for a big pot."),
    sheet('fc_bg_high', INDOOR, "Scene: a HIGH-ANGLE view looking down onto a warm wooden plank floor with a big round soft-red rug "
          "with a gold ring pattern, and a round wooden table standing in the middle of the rug, its top empty."),
    sheet('fc_bg_pondhouse', FOREST, "Scene: the crane's home by a pond: a soft teal-blue pond on the left with cattail reeds, a small "
          "cream cottage with a golden roof, a brown round-topped door and a round window on the right, gentle hills and sky."),
    sheet('fc_bg_crane_room', INDOOR, "Scene: a LOW-ANGLE view inside the crane's tall cream-walled room: wooden ceiling beams high above, a "
          "window on the left showing a pond outside, a warm wooden floor, a small empty wooden table at centre-right."),
    sheet('fc_bg_feast_day', FOREST, "Scene: an outdoor picnic feast in a sunny meadow: a string of triangular paper bunting flags in soft "
          "red, gold and sage green across the top, gentle hills, trees at both sides, grass along the bottom. No table."),
    sheet('fc_bg_feast_night', "Colour mood: gentle picture-book evening — mid-tone blues, a cream moon, warm amber lantern light, soft "
          "sage hills, low saturation. ", "Scene: the same meadow picnic in the evening: a blue sky with a round cream moon and paper "
          "stars, a string of warm glowing amber paper lanterns across the top, soft hills, grass along the bottom. No table.", night=True),
    prop('fc_fox_stand', f"{FOX}Standing on four legs, side view facing LEFT, tail up, a big friendly grin."),
    prop('fc_fox_lick', f"{FOX}Standing on four legs, side view facing LEFT, head bent low, a long pink tongue out licking, happy eyes "
         "closed as arcs."),
    gprop('fc_fox_stuck', f"{FOX}Side view facing LEFT, reared up on its hind legs with front legs kicking, its long snout jammed into the "
         "narrow neck of a tall green gourd bottle, funny surprised eyes, tail wagging.", tall=True),
    prop('fc_fox_sorry', f"{FOX}Sitting, side view facing LEFT, head bowed, pink blushing cheeks, ears drooped, a shy sorry smile."),
    prop('fc_crane_stand', f"{CRANE}Standing tall, side view facing LEFT, happy smile.", tall=True),
    prop('fc_crane_peck', f"{CRANE}Standing, side view facing LEFT, neck bent far down so the beak points straight down at the ground, "
         "puzzled eyes.", tall=True),
    prop('fc_crane_sad', f"{CRANE}Standing, side view facing LEFT, head drooping, sad little eyes.", tall=True),
    prop('fc_crane_sorry', f"{CRANE}Standing, side view facing LEFT, head gently bowed, one wing held forward kindly, soft shy smile.", tall=True),
    prop('fc_duck', f"{DUCK}Standing, side view facing LEFT, happy."),
    prop('fc_butterfly', "A cute butterfly seen from the front with wings open: persimmon-orange upper wings and golden lower wings "
         "with cream dots, a small dark body, two curly antennae, a tiny smiling face."),
    prop('fc_pot', "A big round dark iron soup pot on little amber paper flames, full of warm amber soup with bubbles, a wooden spoon "
         "sticking out."),
    prop('fc_plate', "A very WIDE, very FLAT round cream plate like a tray with a thin gold rim, holding a thin layer of warm amber "
         "soup, seen slightly from the front.", wide=True),
    gprop('fc_bottle', "A tall, long-necked green gourd bottle: a round fat belly, a second smaller bulb above it, a very long narrow "
          "neck, a gold lip at the top and a soft red band tied around the neck.", tall=True),
    gprop('fc_bowl', "A wide, deep red bowl with a gold stripe, filled with pale green pond-weed soup, for a duck."),
    gprop('fc_flower', "A single persimmon-orange five-petal flower with a gold centre on a green stem with two leaves."),
    cut('fc_cut_peck', CUT_MOOD, f"Close-up: the crane's long golden beak clatters TAP-TAP on a very flat plate of soup — it cannot scoop "
        f"any up, funny frustrated eyes. {CRANE}"),
    cut('fc_cut_lick', CUT_MOOD, f"Close-up front view: the fox happily licks a flat plate clean with a big pink tongue, eyes closed with "
        f"delight. {FOX}"),
    cut('fc_cut_stuck', CUT_MOOD, f"POP-stuck! The fox's long snout is jammed in the narrow neck of a tall green gourd bottle, legs "
        f"kicking in the air, funny shocked eyes, speed lines. {FOX}"),
    cut('fc_cut_sorry', CUT_MOOD, f"Close-up: the fox's orange paw and the crane's white wing meet in a warm handshake, two small red "
        f"paper hearts above them, happy faces at the edges. {FOX}{CRANE}"),
]

# ================= 골디락스와 곰 세 마리 (goldilocks) =================
# 코드는 모두 정면. 곰·그릇·의자·침대 크기비 1 : 0.72 : 0.5 는 코드가 배율로 맞춘다(그림은 따로따로).
CABIN = INDOOR
GOLDI = ("Goldilocks: a small girl, front view — a golden bob of hair with side curls and three curly bumps on top, a red bow at the "
         "top right, round face, pink cheeks, a bean-red dress with a cream apron bib, red sleeves, brown shoes. ")
BEAR = ("a cute round teddy-like bear made of flat paper pieces, front view — round ears with light inner ears, a round head with a "
        "light muzzle and a black nose, a big round body with a light belly, stubby arms and legs, bright round eyes, pink cheeks; ")
DAD = f"Papa bear: {BEAR}dark chocolate-brown fur, a red bow tie. "
MOM = f"Mama bear: {BEAR}medium brown fur, an orange apron, a pink flower with a gold centre by one ear. "
BABY = f"Baby bear: {BEAR}light honey-brown fur, a sage-green scarf with a hanging end. "
goldilocks = [
    sheet('gl_bg_kitchen', CABIN, "Scene: inside the bears' cosy log-cabin kitchen: a wall of horizontal logs, a window at upper right "
          "with a soft sun outside, a dark iron stove with a warm fire, a stovepipe and a black pot on the left, a wall shelf with three "
          "plates in big, medium and small sizes, a warm wooden plank floor. Open floor space in the middle."),
    sheet('gl_bg_forest', PASTEL, "Scene: a sunny forest path: soft sage and pine-green trees in layers, a small sun at upper left, a "
          "tiny far-away log cabin with a red roof and a lit window on the right, a light sandy path across the meadow, a big red "
          "mushroom with cream spots in the left foreground and a tall orange flower in the right foreground."),
    sheet('gl_bg_door', PASTEL, "Scene: a LOW-ANGLE view up at the front of the bears' log cabin: the log wall rising high, a HUGE "
          "arched dark wooden door in the centre with a gold knob, a stone step, grass at the bottom, a pale sky above the roof."),
    sheet('gl_bg_table', CABIN, "Scene: a HIGH-ANGLE view looking straight down at a big warm wooden table top with plank lines filling "
          "the whole image. The table is completely empty."),
    sheet('gl_bg_living', CABIN, "Scene: the bears' living room: a log wall, a window in the centre, a framed picture on the right "
          "showing three round bear faces in big, medium and small sizes, a warm plank floor with a soft red oval rug. No furniture "
          "in the middle."),
    sheet('gl_bg_bed_top', CABIN, "Scene: a TOP-DOWN view looking straight down at a warm wooden plank bedroom floor with a soft "
          "sage-green oval rug in the middle. No furniture."),
    sheet('gl_bg_bed_side', CABIN, "Scene: a cosy bedroom seen straight-on: a log wall, a window at the far left, a warm plank floor. "
          "Open floor across the middle and right."),
    prop('gl_goldi_walk', f"{GOLDI}Walking happily, front view, holding a small bouquet of orange, pink and amber flowers."),
    prop('gl_goldi_tongue', f"{GOLDI}Front view, eyes squeezed shut, mouth open with a little red tongue out — 'too hot!', little "
         "steam curls."),
    prop('gl_goldi_sit', f"{GOLDI}Sitting (on nothing), front view, legs dangling and swinging, cheerful smile."),
    prop('gl_goldi_sleep', f"{GOLDI}Lying down asleep on her back, seen from the side, eyes closed as peaceful arcs, a small smile.",
         wide=True),
    prop('gl_goldi_surprised', f"{GOLDI}Front view, jumping with surprise, big wide round eyes, round 'O' mouth, hands up."),
    prop('gl_goldi_sorry', f"{GOLDI}Front view, hands together, head slightly bowed, sad eyebrows, a small shy 'I'm sorry' frown."),
    prop('gl_bear_dad', f"{DAD}Standing, friendly smile."),
    prop('gl_bear_mom', f"{MOM}Standing, gentle smile."),
    gprop('gl_bear_baby', f"{BABY}Standing, happy smile."),
    gprop('gl_bear_baby_cry', f"{BABY}Standing, crying — eyes squeezed shut, mouth open, two big blue tear drops."),
    prop('gl_bowl', "One round cream porridge bowl with a red band and a small brown foot, full of warm porridge with soft steam "
         "curls, side view."),
    prop('gl_chair_big', "A big sturdy dark-brown wooden chair with a tall back, front view, empty."),
    prop('gl_chair_mid', "A medium light-brown wooden chair with a puffy soft orange cushion with amber buttons, front view, empty."),
    prop('gl_chair_small', "A small honey-coloured wooden chair with a short back, front view, empty."),
    gprop('gl_bed_big', "A big dark-wood bed seen straight from ABOVE, with a flat hard sage-green blanket folded back at the top to "
          "show a cream sheet and a white pillow."),
    prop('gl_bed_mid', "A medium light-wood bed seen straight from ABOVE, with a puffy soft orange blanket with round amber bumps and "
         "a white pillow."),
    prop('gl_bed_small', "A small honey-wood bed seen straight from ABOVE, with a golden quilt with red stripes and a small white pillow."),
    cut('gl_cut_hot', CUT_MOOD, f"Close-up: Goldilocks tastes the porridge — 'too hot!' — eyes squeezed shut, tongue out, big steam "
        f"curls. {GOLDI}"),
    cut('gl_cut_cold', CUT_MOOD, f"Close-up: Goldilocks tastes the porridge — 'too cold!' — shivering, gritted teeth, blue shiver lines "
        f"on both sides, little ice cubes in her spoon. {GOLDI}"),
    cut('gl_cut_crack', CUT_MOOD, "CRACK! A small honey-coloured wooden chair breaks apart in mid-air, its back, legs and seat flying "
        "outward with funny yellow crack zigzags and a paper starburst."),
    cut('gl_cut_eyes', CUT_MOOD, f"Surprise! Goldilocks on the left and the three bears on the right in big, medium and small sizes stare "
        f"at each other with huge round eyes and round 'O' mouths. {GOLDI}{DAD}{MOM}{BABY}"),
]

# ================= 브레멘 음악대 (bremen) =================
# 동물은 모두 왼쪽을 보는 측면. 탑 쌓기는 코드가 각 동물의 서 있는 그림을 쌓는다(탑 한 장 그림은 만들지 않는다).
# 캄캄한 방(darkRoomBG)은 실루엣+빛나는 눈 연출이라 코드 그림을 그대로 둔다.
DONKEY = ("The donkey: a cute gentle grey donkey made of flat paper pieces — a lighter grey belly, two long upright ears, a long snout "
          "with a pale muzzle, black hooves, a thin tail with a dark tuft, bright round eyes, pink cheeks. ")
ROBBER = ("a funny round robber in picture-book style, front view — a round belly in a striped shirt with two cream stripes, black "
          "trousers, a red bandana with a knot, a thick black moustache, pink cheeks; silly, never scary")
NIGHT = "Colour mood: gentle picture-book night — mid-tone blues, a cream moon, warm amber window light, soft sage hills, low saturation. "
bremen = [
    sheet('br_bg_mill', PASTEL, "Scene: a sunny old mill: a grey stone mill with a red roof, a dark door and a warm window on the right, "
          "a brown wooden water wheel at the far right beside a small stream, a gentle green hill, soft clouds, a flat light ground "
          "with a round grey millstone on the left."),
    sheet('br_bg_road', PASTEL, "Scene: a country road: pale sky with soft clouds, a gentle green hill, a round tree at each side, a "
          "meadow and a light sandy road across the front, and ONE big round leafy bush on the right."),
    sheet('br_bg_wall', PASTEL, "Scene: a LOW-ANGLE view of a long grey brick garden wall rising toward the right with a brown top edge, "
          "a soft blue sky with clouds above, grass at the bottom. The top of the wall on the right is empty, room for a cat to sit."),
    sheet('br_bg_roof', "Colour mood: soft, warm picture-book pastels with a gentle cream-yellow sky, low saturation. ",
          "Scene: a cream farmhouse with a brown and gold gable roof, a warm window and a dark door, seen straight-on on the right; the "
          "roof ridge is empty (room for a rooster); a soft sun, light ground."),
    sheet('br_bg_meadow', PASTEL, "Scene: a roadside meadow for a band rehearsal: pale sky, a soft sun at the right, a gentle hill, "
          "grass dotted with small orange and cream flowers. Wide open space across the middle."),
    sheet('br_bg_forest_night', NIGHT, "Scene: a HIGH-ANGLE view down onto a forest at night: round tree crowns in blue-green seen "
          "from above, a light winding path through the middle, and at the top right a warm amber glow from a far-away lit window "
          "between the trees.", night=True),
    sheet('br_bg_house_low', NIGHT, "Scene: a LOW-ANGLE view up the wooden plank wall of a house at night: a round cream moon at upper "
          "left, and ONE high window on the right glowing warm amber (empty inside). Grass at the bottom.", night=True),
    sheet('br_bg_house_pov', CABIN, "Scene: looking in through a window: a warm lamp-lit room with tan plank walls and an orange arched "
          "doorway on the right, a long wooden table across the lower middle holding a small pile of gold coins, a plate of food and "
          "a plate of red and orange fruit. A dark wooden window frame with a centre bar frames the whole view. No people.",
          nobody=True),
    sheet('br_bg_house_wide', NIGHT, "Scene: a brown wooden house in the forest at night, seen straight-on: a dark roof, a door on the "
          "left, a warm glowing amber window on the right, dark round trees and a hill behind, a cream moon and stars.", night=True),
    sheet('br_bg_morning', PASTEL, "Scene: a happy morning home: a warm tan house with a brown roof, a dark door and a warm window in "
          "the centre, a round tree on the left, a straw pile in the yard on the left, a small stone oven with a little fire on the "
          "right, a soft sun and clouds, light ground. The roof ridge is empty."),
    prop('br_donkey', f"{DONKEY}Standing, side view facing LEFT, gentle smile."),
    prop('br_donkey_sing', f"{DONKEY}Standing, side view facing LEFT, head up, mouth wide open braying a song 'hee-haw', happy eyes."),
    prop('br_donkey_sleep', f"{DONKEY}Lying down asleep with legs folded, side view facing LEFT, eyes closed as arcs."),
    prop('br_dog_tired', f"{DOG}Standing, side view facing LEFT, tired and panting with a pink tongue hanging out, droopy eyes."),
    prop('br_dog_sing', f"{DOG}Standing, side view facing LEFT, head up, mouth open barking a song 'woof', happy eyes."),
    prop('br_cat_sad', f"{CAT}Sitting, side view facing LEFT, sad droopy whiskers, head tilted down, tail low."),
    prop('br_cat_sing', f"{CAT}Standing, side view facing LEFT, head up, mouth open singing 'meow', happy eyes, tail up."),
    prop('br_rooster', f"{ROOSTER}Standing, side view facing LEFT, proud."),
    prop('br_rooster_sing', f"{ROOSTER}Side view facing LEFT, wings flapping out, beak wide open crowing 'cock-a-doodle-doo'."),
    prop('br_miller', "The miller: a kind round man in picture-book style, side view facing LEFT — a white floury cap, a cream smock "
         "with a tan apron, brown trousers, a dot eye, a smile, pink cheek. Standing."),
    prop('br_robber_red', f"A {ROBBER}, wearing a red striped shirt. Laughing and counting coins."),
    prop('br_robber_brown', f"A {ROBBER}, wearing a brown striped shirt. Laughing, hands on his belly."),
    gprop('br_robber_green', f"A {ROBBER}, wearing a green striped shirt. Tiptoeing sneakily."),
    prop('br_owl', "A cute round brown owl with ear tufts, big cream eye discs with dark pupils, a small golden beak, perched, front view."),
    cut('br_cut_crash', NIGHT, f"CRASH! The donkey, the dog, the cat and the rooster tumble in through a window in a funny heap, big "
        f"paper glass-shard shapes and a starburst, warm lamp light. {DONKEY}{DOG}{CAT}{ROOSTER}", night=True),
    cut('br_cut_monster', NIGHT, f"Three silly robbers in red, green and brown striped shirts run away in a panic across dark grass, "
        f"mouths wide open, hats flying, funny fright spikes above their heads. A {ROBBER}.", night=True),
    cut('br_cut_ghost', NIGHT, "A funny thought-cloud: the scared robber imagines silly harmless paper 'monsters' — a floppy ghost "
        "with glowing cat eyes, a clumsy giant, a grumpy judge shouting from a roof — all round and goofy, never scary.", night=True),
]

# ================= 개미와 베짱이 (ant_grasshopper) =================
# 계절 들판 3장은 '같은 구도'로(TALES_PLAN_2 §12-4): 문장 FIELD_LAYOUT를 똑같이 넣고 계절만 바꾼다. 소나기는 여름 들판에 코드로 어둡게.
# 베짱이는 초록 → 전부 마젠타. 개미 틀린 옷(티셔츠·코트·튜브)은 코드 덧그림으로 둔다.
FIELD_LAYOUT = ("Scene: a wide field, the SAME fixed layout every season: a small sun at upper left, gentle rolling hills, one big "
                "round-canopy tree on the left and one small round tree just right of centre, a brown soil ant-mound with a small dark "
                "door on the far right, open ground across the lower middle, grass tufts. ")
ANT = ("The ant: a cute round ant made of flat paper pieces, side view facing LEFT — three round bean-red body segments (big round head, "
       "small middle, round bottom), darker red legs, two antennae with round tips, a big white eye with a dark pupil, pink cheek, "
       "a smile. ")
HOPPER = ("The grasshopper: a cute friendly grasshopper made of flat paper pieces, side view facing LEFT — a leaf-green body with a "
          "pale yellow-green belly, a big darker-green folded hind leg, a pine-green folded wing, a round green head with a big "
          "white eye, pink cheek, a smile, two long curving antennae. ")
ag = [
    sheet('ag_bg_summer', PASTEL, f"{FIELD_LAYOUT}Summer: full soft sage-green trees and grass, two puffy clouds."),
    sheet('ag_bg_autumn', AUTUMN, f"{FIELD_LAYOUT}Autumn: trees with soft orange and gold leaves, an orange-brown field, fallen leaves "
          "scattered on the ground."),
    sheet('ag_bg_spring', SPRING, f"{FIELD_LAYOUT}Spring: trees with light green leaves and pink blossoms, little sprouts and small pink "
          "flowers on the ground."),
    sheet('ag_bg_ant_eye', PASTEL, "Scene: an ant's-eye view: grass blades as tall as trees at the left and centre, a grey pebble on "
          "the left, and a HUGE brown soil ant-mound on the right with a small dark arched door at its base; a soft sun in the sky."),
    sheet('ag_bg_leafstage', PASTEL, "Scene: a low-angle view of a leaf stage: tall grass blades leaning in at both edges, and one big "
          "flat broad sage-green leaf lying horizontally across the lower middle like a little stage, with its stem; a soft sun at "
          "upper right."),
    sheet('ag_bg_winter_high', WINTER, "Scene: a HIGH-ANGLE view over a snowy field: snow fills most of the image, a far horizon near "
          "the top with six tiny bare trees, dry grass sprigs poking through the snow, and a small round ant-hole seen from above "
          "right of centre, round snowflakes falling."),
    sheet('ag_bg_door', WINTER, "Scene: a low-angle view in the snow: a huge brown soil bank with a thick snow cap fills the left half, "
          "with a big arched doorway in it glowing warm amber inside; snowy ground; pale winter sky on the right; snow falling."),
    sheet('ag_bg_cellar', CABIN, "Scene: a cosy CUTAWAY of the ants' underground home: a thin strip of pale winter sky and snow at the "
          "top, warm brown soil below with a tunnel from a hole at the top centre branching to three round rooms — a room piled with "
          "golden grain on the left, a big warm lamp-lit hall in the centre (empty floor), a room piled with acorns on the right."),
    prop('ag_ant_carry', f"{ANT}Walking, holding one big golden grain of wheat up over its head with both arms, cheerful."),
    prop('ag_ant_stand', f"{ANT}Standing, arms down, friendly smile."),
    prop('ag_ant_vest', f"{ANT}Standing, wearing a small golden vest with two brown buttons, happy."),
    prop('ag_ant_winter', f"{ANT}Standing, wearing a persimmon-orange scarf with a cream tip and a cream knit hat with a bean-red band "
         "and pompom, cosy happy smile."),
    prop('ag_ant_baby', f"{ANT}A small baby ant with a bigger head, standing, big curious eyes, sweet smile."),
    gprop('ag_hopper_play', f"{HOPPER}Standing upright on its hind legs, playing a small brown violin with a gold centre tucked under "
          "its chin, drawing a cream bow, happy closed eyes."),
    gprop('ag_hopper_wet', f"{HOPPER}Standing, soaking wet with blue water drops all over, droopy antennae, sad wet face, holding "
          "a small brown violin."),
    gprop('ag_hopper_shiver', f"{HOPPER}Standing, hugging itself with both arms, shivering with cold, sad eyes, blue shiver marks."),
    gprop('ag_hopper_winter', f"{HOPPER}Standing, wearing a persimmon-orange scarf and a cream knit hat with a bean-red band, warm "
          "happy smile."),
    gprop('ag_hopper_carry', f"{HOPPER}Walking, holding one big golden grain of wheat up over its head with both arms, cheerful."),
    prop('ag_ladybug', "A cute round ladybug: a red dome with five black spots, a black head, bright eyes, a smile, side view facing LEFT."),
    prop('ag_snail', "A cute snail: a soft tan body with two eye stalks and a golden spiral shell, a smile, side view facing LEFT."),
    prop('ag_pillbug', "A cute pillbug: a grey segmented dome with pale stripes, small antennae, bright eyes, a smile, side view facing LEFT."),
    prop('ag_firefly', "A cute firefly: a dark-brown body, a cream wing, a round glowing yellow tail, bright eyes, a smile, side view "
         "facing LEFT."),
    gprop('ag_leaf_umbrella', "One big broad sage-green leaf held up like an umbrella by its curved stem, underside view, vein pieces."),
    prop('ag_acorns', "A neat pyramid of six shiny brown acorns with textured caps."),
    cut('ag_cut_sneeze', PASTEL, f"ACHOO! Close-up of the soaked grasshopper sneezing, water drops flying everywhere, funny. {HOPPER}"),
    cut('ag_cut_shiver', WINTER, f"Close-up: the grasshopper shivers in the falling snow, hugging itself, blue shiver lines on both "
        f"sides, sad but cute. {HOPPER}"),
    cut('ag_cut_door', CUT_MOOD, f"The ants' round wooden door swings wide open and warm golden light pours out onto the snow, a "
        f"friendly ant waving the grasshopper in. {ANT}{HOPPER}"),
]

# ================= 미운 아기 오리 (ugly_duckling) =================
# 주인공은 알 → 아기 → 청소년 → 백조. 감정 얼굴은 크게 과장(§16-5). 모두 왼쪽을 보는 측면.
# 다른 동화에서 쓰는 그림을 그대로 쓴다: 고양이 = tn_cat_sit, 수탉 = br_rooster, 엄마·흰 오리 = fc_duck (같은 바이블).
UGLY = ("The grey duckling: a cute round fluffy grey duckling made of flat paper pieces, side view facing LEFT — a darker grey wing "
        "and tail, a little three-point tuft on its head, a small dark beak, orange feet, a big round eye, pink cheek; a bit scruffy "
        "but lovable. ")
YOUNG = ("The young bird: a gangly pale-grey young swan made of flat paper pieces, side view facing LEFT — a long upright neck, a "
         "darker grey wing and tail, a pale belly, black feet, a brownish beak, a big round eye, pink cheek. ")
SWAN = ("The swan: a beautiful snow-white swan made of flat paper pieces, side view facing LEFT — a long graceful S-curved neck, a "
        "small round head, an orange beak with a dark base, soft pale blue-grey wing pieces, a big round kind eye, pink cheek. ")
ud = [
    sheet('ud_bg_nest', PASTEL, "Scene: a HIGH-ANGLE view down onto grass by a pond in summer: a corner of soft teal pond at the top "
          "right, small white and yellow flowers, and a big oval straw nest in the centre with a brown rim, golden straw and an empty "
          "light inner bowl."),
    sheet('ud_bg_pond', PASTEL, "Scene: a side view of a summer pond: pale sky with a small sun at upper left and two clouds, a soft "
          "green far bank, a wide soft teal-blue water band across the lower half with pale ripple pieces, reeds with cattails at both "
          "edges."),
    sheet('ud_bg_yard', PASTEL, "Scene: a farm yard: a red barn with a brown roof and dark door on the left, a cream picket fence across "
          "the middle, a light tan dirt yard in front, grass tufts, a soft sun at upper right."),
    sheet('ud_bg_reeds', PASTEL, "Scene: a duck's-eye view deep in a reed bed: many tall reeds with brown cattails filling the "
          "background, a pale sky above, a brown muddy ground. Open space at the lower middle."),
    sheet('ud_bg_swamp', "Colour mood: soft, muted picture-book pastels — a pale grey-green sky, calm sage and pine greens, soft "
          "blue-grey water, low saturation, gentle not gloomy. ", "Scene: a wide quiet marsh: two flat clouds, a sage far bank, calm "
          "blue-grey water with ripple lines, reeds at both edges, two round lily pads."),
    sheet('ud_bg_swamp_high', "Colour mood: soft, muted picture-book pastels — calm sage greens and soft blue-grey water, low "
          "saturation. ", "Scene: a HIGH-ANGLE view straight down onto marsh water: soft blue-grey water with pale ripple ovals filling "
          "the image, four round reed clumps in the corners, a small green grassy islet in the centre."),
    sheet('ud_bg_autumn', AUTUMN, "Scene: a LOW-ANGLE autumn view with a big open sky: a pale peach sky with a soft pale sun at upper "
          "right and two wispy clouds, orange and gold trees at both edges, brown ground and a small pond strip at the bottom. Lots "
          "of empty sky in the upper middle."),
    sheet('ud_bg_winter', WINTER, "Scene: a HIGH-ANGLE view of a frozen lake in winter: snow all around, four snowy bushes in the "
          "corners, a large pale-blue frozen lake oval in the middle with a few crack lines, round snowflakes falling."),
    sheet('ud_bg_cabin', CABIN, "Scene: inside a cosy old cottage in winter: a brown plank wall, a small window at upper left showing a "
          "soft blue snowy evening outside, a black iron stove on the right with a warm amber fire and glow, a soft red oval rug in "
          "the middle of a warm wooden floor. Bright and warm, not dark."),
    sheet('ud_bg_spring', SPRING, "Scene: a spring lake: a pale soft sky with a small sun at upper left, a gentle green hill, a "
          "pink-blossom tree on the right, a wide soft blue lake across the lower middle, small pink, white and yellow flowers "
          "around it."),
    sheet('ud_bg_reflect', SPRING, "Scene: a HIGH-ANGLE view down onto a calm soft blue lake: the water fills most of the image with "
          "pale ripple ovals, a green grassy bank with small flowers across the top edge."),
    prop('ud_egg', "One big cream egg with four tan speckles, standing upright."),
    prop('ud_baby', f"{UGLY}Standing, a small hopeful smile."),
    prop('ud_baby_sad', f"{UGLY}Standing, very sad: eyebrows slanting down at the outer ends, one big blue tear, head down, little "
         "shoulders squashed."),
    prop('ud_baby_scared', f"{UGLY}Crouching and trembling, very scared: huge white eyes with tiny pupils, raised eyebrows, a small "
         "round open beak, a sweat drop."),
    prop('ud_baby_happy', f"{UGLY}Standing, very happy: eyes as closed upward arcs, open smiling beak, pink cheeks, wings a little out."),
    prop('ud_young', f"{YOUNG}Standing, calm and curious, neck up."),
    prop('ud_young_sad', f"{YOUNG}Standing with its wing wrapped around itself, shivering with cold, sad drooping eyes, blue shiver marks."),
    prop('ud_young_wings', f"{YOUNG}Standing, both wings raised and spread wide, very happy closed-arc eyes, open smiling beak."),
    prop('ud_swan', f"{SWAN}Standing tall and happy, gentle smile."),
    prop('ud_swan_fly', f"{SWAN}Flying with its long neck stretched straight out ahead and wide wings spread, side view facing LEFT.",
         wide=True),
    prop('ud_duckling', "A cute round yellow duckling, side view facing LEFT — a sunny yellow body, a slightly darker yellow wing, an "
         "orange beak and orange feet, a big round eye, pink cheek, cheeping happily."),
    prop('ud_hen', "A cute round tan hen, side view facing LEFT — a darker brown wing and tail, a red comb of three bumps, a red "
         "wattle, a golden beak and legs, a big round eye, pink cheek."),
    prop('ud_goose', "A cute grey-brown wild goose, side view facing LEFT — a long black neck, a black head with a white cheek patch, a "
         "black beak, a big round eye, a friendly smile."),
    prop('ud_grandma', "A kind old grandma, side view facing LEFT — a bean-red headscarf, a white shawl, a persimmon-orange dress with "
         "a cream apron, closed smiling eyes, pink cheek. Standing."),
    gprop('ud_farmer', "A kind old farmer, side view facing LEFT — a wide straw-gold hat with a bean-red band, a white beard, a rosy "
          "nose, closed smiling eyes, a pine-green coat with a gold belt, brown trousers, black boots. Standing, one arm reaching "
          "forward and down to help."),
    cut('ud_cut_hatch', PASTEL, f"CRACK! The big cream egg bursts open with a paper starburst, and the scruffy grey duckling pops out "
        f"with a piece of eggshell on its head, blinking. {UGLY}"),
    cut('ud_cut_reflect', SPRING, f"The young bird looks down into the calm water and sees its reflection: a beautiful white swan. "
        f"Surprised happy face, soft ripples. {YOUNG}{SWAN}"),
]

TALES = [('sun_wind', sun_wind), ('turnip', turnip), ('lion_mouse', lion_mouse), ('fox_crane', fox_crane),
         ('goldilocks', goldilocks), ('bremen', bremen), ('ant_grasshopper', ag), ('ugly_duckling', ud)]

if __name__ == '__main__':
    total = 0
    for name, jobs in TALES:
        json.dump(jobs, open(os.path.join(HERE, f'jobs_{name}.json'), 'w'), ensure_ascii=False, indent=1)
        kinds = {'bg': sum(j['w'] == 1760 and not j['key'] for j in jobs), 'cut': sum(j['w'] == 1024 and j['h'] == 768 for j in jobs)}
        kinds['prop'] = len(jobs) - kinds['bg'] - kinds['cut']
        print(f"{name:16s} {len(jobs):3d}  (배경 {kinds['bg']}, 캐릭터·소품 {kinds['prop']}, 컷 {kinds['cut']})")
        total += len(jobs)
    print('합계', total)
