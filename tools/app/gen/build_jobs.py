#!/usr/bin/env python3
"""팥죽·구름 공장 그림 전체 재생성 작업표를 만든다 (사용자 검증 스타일 v2: tools/app/keyart/STYLE_BLOCK_v2.md).
결과: tools/app/gen/jobs_<tale>.json — [{id, kind, out, refs, prompt}]. Codex image_gen 으로 차례로 생성한다.
kind: sprite(마젠타 배경 → chromakey), bg(16:9 풀블리드), cut(16:9 만화 컷), key(키아트, 종이 테두리)"""
import json, os, re
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
SB = open(os.path.join(G, 'tools/app/keyart/STYLE_BLOCK_v2.md')).read()
def sec(a, b):
    i = SB.index(a); j = SB.index(b, i); return SB[i:j].strip()
STYLE = sec('STYLE:', 'LIGHTING:')
LIGHT = sec('LIGHTING:', 'NO list:')
BORDER = SB[SB.index('BORDER / FRAME:'):].strip()
HEAD = 'Hand-cut layered paper art, handcrafted stop-motion paper diorama aesthetic.'
NO_BASE = ['NO text.', 'NO photorealism.', 'NO glossy surfaces.', 'NO realistic 3D modeling.', 'NO inflated or rounded forms.',
           'NO clay-like volume.', 'NO gradients.', 'NO painterly rendering.', 'NO airbrushed shading.', 'NO realistic sunlight shadows.',
           'NO deep ambient occlusion.', 'NO thick beveled edges.', 'NO plastic appearance.', 'NO felt or fabric appearance.', 'NO fur-fibre texture.']
FACE = ('FACE (characters only): a simple cut-paper face — two round dot eyes, a tiny dot nose, a small curved paper-strip mouth, '
        'two round pale-pink paper cheeks. No realistic eyes, no eyelashes, no glossy highlights.')
RAW = 'assets/raw'
HOME = os.path.expanduser('~/.paper-tale/refs/family/')

def sprite(subject, pose, face=True, extra_no=()):
    return '\n\n'.join([HEAD,
        'Create ONE character or object sprite, rendered entirely as handcrafted paper art: a figure assembled from individually cut pieces of matte colored cardstock and fine-grain craft paper.',
        STYLE, ('SUBJECT:\n' + subject + '\nPOSE / ACTION:\n' + pose),
        FACE if face else 'NO face, NO eyes, NO mouth on this object.',
        'FRAMING:\nSquare 1:1 image. The whole figure is visible, centred, filling about 75% of the frame height. Background: a completely flat, uniform, solid magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no props, no border. Nothing else in the image.',
        LIGHT, '\n'.join(NO_BASE + list(extra_no))])

def bg(scene, keep=''):
    return '\n\n'.join([HEAD,
        'Create a wide 16:9 scene, rendered entirely as handcrafted paper art. The whole image should feel like a carefully assembled paper diorama made from individually cut pieces of matte colored cardstock and fine-grain craft paper.',
        STYLE, 'SCENE:\nBuild the scene from layered flat paper sheets, each a flat shape cut from cardstock. ' + scene + ('\n' + keep if keep else ''),
        'The lower third of the frame remains mostly open ground so characters can stand there later. NO people, NO animals, NO characters.',
        'FRAME:\nNo decorative border. The scene fills the entire frame edge to edge; the composition continues naturally beyond all four edges.',
        LIGHT, '\n'.join(['NO people.', 'NO animals.', 'NO faces on objects.'] + NO_BASE)])

def cut(scene, bgdesc):
    return '\n\n'.join([HEAD,
        'Create a wide 16:9 comic-panel moment for a picture book, rendered entirely as handcrafted paper art: every element is cut from matte colored cardstock and fine-grain craft paper.',
        STYLE, 'MOMENT:\n' + scene, 'PANEL BACKGROUND:\n' + bgdesc,
        FACE, 'Match the characters in the reference images exactly (shapes, colors, markings, clothes). Big, clear, readable action for a 3-year-old; one moment only.',
        'FRAME:\nNo border, no speech bubbles, no panel lines; fills the frame edge to edge.', LIGHT, '\n'.join(NO_BASE)])

def key(scene, ratio):
    return '\n\n'.join([HEAD,
        f'Create a {ratio} title illustration (cover art) for a children\'s story app, rendered entirely as handcrafted paper art.',
        STYLE, 'SCENE:\n' + scene, FACE, 'Match the characters in the reference images exactly.',
        'Leave a calm, nearly empty area in the upper third for a title to be placed later (do NOT write any title).',
        BORDER, LIGHT, '\n'.join(NO_BASE)])

jobs = {'patjuk': [], 'kkultteok': []}
def J(tale, id, kind, prompt, refs=(), out=None):
    ext = 'png'
    out = out or f'{RAW}/{"char" if kind=="sprite" else kind}_gpt/{tale}/{id}.{ext}'
    jobs[tale].append({'id': id, 'kind': kind, 'out': out, 'refs': list(refs), 'prompt': prompt})

# ───────── 팥죽 할멈과 호랑이 ─────────
P = f'{RAW}/char_gpt/patjuk/'
GRANNY = 'A small kind Korean grandmother: silver-grey hair in a low bun with a hairpin, warm round face, cream jeogori (short hanbok jacket) with a mustard-brown goreum ribbon, long deep-indigo chima skirt, little white beoseon socks and straw shoes.'
TIGER = 'A chubby, cute, not-scary orange tiger with dark brown stripes, a cream belly and muzzle, round ears, a long striped tail with a dark tip; big round head, stubby legs.'
FR = {
 'bam': ('A roasted chestnut friend: a plump teardrop-shaped chestnut, glossy-free warm brown paper with a pale tan base and a tiny curled stem on top.', 'Sitting upright, cheerful.'),
 'jara': ('A soft-shell turtle (jara) friend: olive-green flat shell made of layered scale pieces, pale green head with a pointy snout, four little legs.', 'Walking to the left, side view, determined.'),
 'ddong': ('A cow-pat (dung) friend: a soft three-tier swirl of warm brown paper, with a tiny pink flower on top.', 'Sitting, playful smile.'),
 'songgot': ('An awl (songgot) friend: a round light-wood handle (the face is on the handle) on a long thin pointed silver-grey paper spike pointing down.', 'Standing on its point, brave little smile.'),
 'jeolgu': ('A stone mortar (jeolgu) friend: a wide grey stone bowl with a wooden pestle resting inside it diagonally.', 'Sitting still, sturdy and proud.'),
 'myeongseok': ('A straw mat (myeongseok) friend: a rolled-up golden straw mat cylinder with woven texture lines, lying on its side.', 'Lying rolled, friendly.'),
 'jige': ('An A-frame carrier (jige) friend: a tall Korean wooden A-frame back-carrier with two long legs, a woven straw support in the middle and two straw shoulder straps; the face is a small wooden plaque near the top.', 'Standing upright.'),
}
for k, (s, p) in FR.items():
    J('patjuk', f'pj_friend_{k}', 'sprite', sprite(s, p))
J('patjuk', 'pj_granny_ladle', 'sprite', sprite(GRANNY, 'Standing, three-quarter view facing right, holding a wooden ladle in front of her, gentle smile.'))
J('patjuk', 'pj_tiger_stand', 'sprite', sprite(TIGER, 'Walking on all fours to the LEFT, side view, head turned slightly to the viewer, sly hungry grin (still cute).'))
PROPS = {
 'pj_prop_door': 'A tall plain dark-brown wooden kitchen door of an old Korean house, vertical planks, an iron ring handle, set in a simple wooden frame. Front view.',
 'pj_prop_hearth': 'A low clay Korean kitchen hearth (buttumak) with two round black iron cauldrons (gamasot) with lids on top, and two arched fire openings at the bottom glowing with flat orange-yellow paper flames. Front view, wide.',
 'pj_prop_muldok': 'A tall dark-brown earthenware water jar (muldok) with an open mouth showing a disc of dark blue water. Front view.',
 'pj_prop_firewood': 'A small neat pile of split firewood logs (round cut ends showing pale rings) with two long sticks leaning on the side. Front view.',
 'pj_prop_house': 'A small Korean thatched-roof cottage (choga) seen from the front: thick golden straw roof, cream walls with wooden posts, a paper-lattice sliding door glowing warm yellow in the middle, a low wooden porch (toenmaru) and a stone foundation. Wide.',
 'pj_prop_jangdok': 'A Korean jar terrace (jangdokdae): three brown earthenware crocks of different sizes with dark lids, standing on a low platform of flat grey stones, light snow on the lids. Wide.',
}
for k, s in PROPS.items():
    J('patjuk', k, 'sprite', sprite(s, 'As described.', face=False))
J('patjuk', 'scene_b_kitchen', 'bg', bg('A cozy old Korean farmhouse kitchen on a winter-solstice evening, seen straight on. Dark brown plank back wall, a small paper-lattice window high in the center-right glowing pale blue with a snowy night outside, one simple wooden shelf high on the upper-left with a few hanging meju blocks, a woven sieve and a dried gourd. Honey-colored packed-earth floor. Warm amber light from the left.',
   'IMPORTANT EMPTY ZONES (story props are placed there later, so draw NOTHING there but plain wall and floor): the whole lower-left (x 0–45%, y 55–100%), and the right edge where a door will stand (x 78–100%, y 35–95%). No hearth, no cauldrons, no jars, no firewood, no door drawn.'), out=f'{RAW}/bg_gpt/patjuk/scene_b_kitchen_v3.png')
J('patjuk', 'scene_c_yard_sea', 'bg', bg('A Korean farmhouse yard on a cold clear winter night, straight on: deep indigo paper sky with a pale paper crescent moon and a few paper stars, two low dark-blue hill sheets, a strip of slate-blue sea with tiny pale wave lines on the right horizon, one layered paper pine tree on the right, a short low stone wall segment with a small brushwood gate in the middle-right, frosty pale-white snowy yard in front.',
   'IMPORTANT: NO house, NO cottage, NO building, NO roof, NO jars or crocks ANYWHERE in the image (the house and jars are separate pieces placed later). The left 45% of the frame below the hills (x 0–45%, y 40–100%) is open snowy yard only.'), out=f'{RAW}/bg_gpt/patjuk/scene_c_yard_sea_v4.png')
# 2단계: 기본 그림을 참고로
G0, T0 = P + 'pj_granny_ladle.png', P + 'pj_tiger_stand.png'
J('patjuk', 'pj_granny_hoe', 'sprite', sprite(GRANNY + ' Same character as the reference image.', 'Standing, three-quarter view facing right, holding a small Korean hoe (homi-style garden hoe with wooden handle) in both hands, ready to work in the field.'), [G0])
TP = {'pj_tiger_fallen': 'Fallen on its back with legs in the air, dizzy swirl eyes.', 'pj_tiger_flat': 'Lying flat on its belly, stretched out, exhausted, eyes half closed.',
      'pj_tiger_bow': 'Sitting and bowing its head politely with both front paws on the ground, a band-aid cross on its forehead and cheek, sorry little smile.',
      'pj_tiger_eyehurt': 'Standing upright on hind legs, one front paw covering one eye, the other eye squeezed, wincing (cute).',
      'pj_tiger_rolled': 'Only the tiger\'s head pokes out of one end of a rolled golden straw mat cylinder lying on its side (the mat from the second reference), dizzy swirl eyes.'}
for k, p in TP.items():
    J('patjuk', k, 'sprite', sprite(TIGER + ' Same character as the reference image.', p), [T0] + ([P + 'pj_friend_myeongseok.png'] if k == 'pj_tiger_rolled' else []))
BURST = 'Dramatic radiating comic burst made of alternating long flat paper strips in deep navy, orange and warm sand, radiating from the point of impact; a few small paper stars.'
NIGHTK = 'A dark old Korean kitchen at night'
NIGHTY = 'A snowy Korean yard at night by the sea'
CUTS = {
 'bam': ('The chestnut friend shoots out of the glowing hearth fire like a little cannonball and pops the tiger right on the eye. Tiger startled, eye wide.', BURST, ['bam']),
 'bam_b': ('The tiger covers its hurt eye with both paws, tears flying, a little star circling its head; the chestnut friend peeks from the bottom right corner looking satisfied.', 'Plain deep navy paper background with a few radiating strips.', ['bam']),
 'ddong': ('The tiger slips on the cow-pat friend on the floor and flies backwards, legs in the air.', BURST, ['ddong']),
 'ddong_b': ('The tiger lies on the kitchen floor with dizzy swirl eyes and a halo of little stars; the cow-pat friend sits nearby.', 'Warm orange kitchen floor and a dark doorway, a few radiating strips.', ['ddong']),
 'jara': ('The tiger leans into the big water jar to wash its eye, and the soft-shell turtle friend bites its nose; water splashes.', BURST + ' The water jar in the foreground.', ['jara']),
 'jara_b': ('The tiger cries big paper tears with the turtle friend still clamped on its nose, holding its face.', BURST, ['jara']),
 'songgot': ('The awl friend pokes up from the floor right into the sitting tiger\'s bottom; the tiger jumps into the air in surprise.', BURST, ['songgot']),
 'songgot_b': ('The tiger in mid-air, high above the floor, arms out, shocked face; the small awl friend below.', BURST, ['songgot']),
 'jeolgu': ('The heavy stone mortar friend drops from above the doorway right onto the tiger\'s head: BONK.', BURST + ' A glowing lattice door behind.', ['jeolgu']),
 'jeolgu_b': ('The tiger sits dazed with a small bump on its head and a ring of tiny stars; the mortar friend has rolled off beside it.', 'Plain deep navy paper with a few radiating strips; a doorway on the right.', ['jeolgu']),
 'myeongseok': ('The straw mat friend rolls the tiger up inside it across the snowy yard; only the tiger\'s head pokes out.', BURST + ' Snowy ground.', ['myeongseok']),
 'myeongseok_b': ('The tiger is fully rolled inside the straw mat lying in the snow, only its crying face showing at one end.', 'Snowy yard at night, pale violet snow, a few stars.', ['myeongseok']),
 'jige': ('The A-frame carrier friend carries the rolled straw mat (with the tiger inside) down to the sea at night under a full moon.', 'Night seashore: navy sky, big pale moon, layered paper waves, sand.', ['jige', 'myeongseok']),
 'jige_b': ('The tiger splashes and flails in the cold sea at night, paper water drops flying; a big pale moon.', 'Night sea with layered navy and white wave strips.', []),
}
for f in FR:
    CUTS['wrong_' + f] = (f'The tiger laughs mockingly, holding its belly, one foot lifted; the {f} friend stands nearby looking a little embarrassed but determined (the tiger was not tricked this time).', 'Plain deep navy paper background, a warm sand floor strip, a few sparkles.', [f])
for k, (m, b, fr) in CUTS.items():
    J('patjuk', 'cut_' + k, 'cut', cut(m, b), [T0] + [P + f'pj_friend_{x}.png' for x in fr])
J('patjuk', 'key_tall', 'key', key('The kind grandmother stirring a big pot of red bean porridge (patjuk) in front of her thatched cottage on a snowy winter-solstice night, steam rising; the cute orange tiger peeking from behind a pine tree; her little helper friends (chestnut, soft-shell turtle, cow-pat, awl, stone mortar, straw mat, A-frame carrier) lined up proudly in the snowy yard in front.', 'tall 3:4 portrait'), [G0, T0] + [P + f'pj_friend_{x}.png' for x in ('bam', 'jara', 'jeolgu')], out=f'{RAW}/keyart_gpt/patjuk_tall_v3.png')
J('patjuk', 'key_wide', 'key', key('Wide view: the kind grandmother stirring a big pot of red bean porridge in front of her thatched cottage on a snowy winter-solstice night, steam rising; the cute orange tiger peeking from behind a pine tree on the right; her helper friends (chestnut, soft-shell turtle, cow-pat, awl, stone mortar, straw mat, A-frame carrier) lined up proudly across the snowy yard.', 'wide 16:9'), [G0, T0] + [P + f'pj_friend_{x}.png' for x in ('myeongseok', 'jige', 'ddong')], out=f'{RAW}/keyart_gpt/patjuk_wide_v3.png')

# ───────── 구름 공장 ─────────
K = f'{RAW}/char_gpt/kkultteok/'
KIDS = {
 'nuna': ('Dahyun, a 4-year-old girl (twin sister of Ihyun, SAME HEIGHT as him): shoulder-length dark hair with straight bangs; a matching long-sleeve top and long pants set with wide horizontal bands of pink-red, warm yellow, sky blue and green, small prints of red cherries, orange carrots and little white bunny heads; dark green collar and cuffs; white sneakers with a pink accent. No letters on clothes.', [K + 'nuna_lookup_v2.png', HOME + 'nuna.jpg']),
 'oppa': ('Ihyun, a 4-year-old boy (twin brother of Dahyun, SAME HEIGHT as her): dark bowl-cut hair; sky-blue long-sleeve top and pants with yellow trim and a print of little bees and red honey pots; blue sneakers. No letters on clothes.', [K + 'oppa_lookup.png', HOME + 'oppa.jpg']),
 'agi': ('Eunwoo, a 1–2-year-old toddler (much smaller than the twins, about two-thirds their height): short dark bob with bangs; white long-sleeve blouse with a big mustard-yellow sailor collar and a tiny line-drawing print, pale yellow shorts; barefoot.', [K + 'agi_lookup.png', HOME + 'agi.jpg']),
}
KP = {
 'nuna': {'walk': 'Walking to the right, side-three-quarter view, arms swinging.', 'run': 'Running to the right happily, one leg up.', 'wave': 'Standing facing right, one hand waving high, big smile.',
          'blow': 'Standing facing right, cheeks puffed, blowing air out (whoo) with lips rounded, hands on knees.', 'hug': 'Arms open wide in a hugging pose, facing right, eyes closed, squeezed smile.',
          'jump': 'Jumping with both feet off the ground, arms up, delighted.', 'back': 'Seen from behind, walking away, slightly turning.', 'whisper': 'Facing right, one hand cupped beside her mouth, whispering, eyes wide.'},
 'oppa': {'lookup': 'Standing, three-quarter view facing right, looking up at the sky with a curious smile (same height as his twin).', 'walk': 'Walking to the right, arms swinging.', 'run': 'Running to the right, leaning forward.',
          'reach': 'Standing facing right, one hand stretched forward with the palm open, touching something small and cold, surprised little "oh" mouth.',
          'press': 'Standing facing right, both arms stretched up and forward pushing down hard on something above chest height (a lever), effort face.',
          'hug': 'Arms open wide in a hugging pose, facing left, eyes closed.', 'jump': 'Jumping with both feet off the ground, splash pose, arms out.', 'back': 'Seen from behind, walking away.'},
 'agi': {'walk': 'Toddling to the right, arms out for balance.', 'run': 'Running clumsily to the right, laughing.', 'press': 'Standing facing right, one arm stretched forward pressing with the index finger, determined face.',
         'pet': 'Standing facing right, one arm stretched forward at shoulder height with the open palm gently patting the empty air in front of her (the thing she pets is added later), tender smile. ONLY the child: NO animal, NO dog, NO cloud, NO object in front of her.', 'wave': 'Standing facing right, waving with one hand, open-mouth smile.',
         'hug': 'Arms open wide, facing left, eyes closed, happy.', 'jump': 'Jumping with both feet, splashing pose, the highest jump, ecstatic.', 'back': 'Seen from behind walking away.',
         'lookback': 'Walking to the LEFT but turning the head back over the shoulder toward the viewer, waving goodbye.'},
}
for who, poses in KP.items():
    desc, refs = KIDS[who]
    for pose, p in poses.items():
        J('kkultteok', f'{who}_{pose}', 'sprite', sprite(desc + ' Same child as the reference images.', p), refs)
DOG = 'Kkulddeok, a small cheerful dog: white coat with light tan patches on both floppy ears and a few faint tan spots on the back, dark nose, a blue harness with white buckles. Coat made of flat paper pieces, no fur fibres.'
DREF = [K + 'dog_lookup.png', HOME + 'dog_side.jpg']
for pose, p in {'sniff': 'Side view facing right, nose down to the ground sniffing, tail up.', 'run': 'Running to the right, ears flapping, all four legs stretched.', 'wag': 'Standing facing right, tail wagging fast (motion lines as tiny paper strips), happy open mouth.',
                'sneeze': 'Sitting facing right, eyes squeezed shut mid-sneeze (achoo), head jerked forward.', 'lick': 'Standing on hind legs facing right, tongue out licking upward.',
                'bark': 'Standing facing right, head raised to the sky, mouth open barking.', 'nose': 'Side view facing right, low, pushing its nose forward into a narrow gap, tail up curiously.'}.items():
    J('kkultteok', f'dog_{pose}', 'sprite', sprite(DOG + ' Same dog as the reference images.', p), DREF)
NOFACE = ['NO face, NO eyes on clouds.']
for k, s in {'cloud_white': 'A cloud built from three stacked layers of hand-cut paper: a soft blue-grey back layer, a pale cream middle layer and a bright white top layer, each cut with a slightly different scalloped edge and offset a few millimetres so every layer edge shows, with narrow soft paper-layer shadows between them; fine visible paper fibres, crisp cut edges, completely flat (no puffy 3D shading). A big fluffy white paper cloud made of several overlapping round cardstock puffs in cloud white and very pale grey.',
             'cloud_rabbit': 'A cloud built from three stacked layers of hand-cut paper: a soft blue-grey back layer, a pale cream middle layer and a bright white top layer, each cut with a slightly different scalloped edge and offset a few millimetres so every layer edge shows, with narrow soft paper-layer shadows between them; fine visible paper fibres, crisp cut edges, completely flat (no puffy 3D shading). A white paper cloud shaped like a sitting rabbit (two tall ears), made of round white cardstock puffs.',
             'cloud_whale': 'A cloud built from three stacked layers of hand-cut paper: a soft blue-grey back layer, a pale cream middle layer and a bright white top layer, each cut with a slightly different scalloped edge and offset a few millimetres so every layer edge shows, with narrow soft paper-layer shadows between them; fine visible paper fibres, crisp cut edges, completely flat (no puffy 3D shading). A white paper cloud shaped like a whale with a small spout, made of round white cardstock puffs.',
             'cloud_dog': 'A cloud built from three stacked layers of hand-cut paper: a soft blue-grey back layer, a pale cream middle layer and a bright white top layer, each cut with a slightly different scalloped edge and offset a few millimetres so every layer edge shows, with narrow soft paper-layer shadows between them; fine visible paper fibres, crisp cut edges, completely flat (no puffy 3D shading). A white paper cloud shaped like a small dog with floppy ears and a curled tail, made of round white cardstock puffs.',
             'cloud_fish': 'A cloud built from three stacked layers of hand-cut paper: a soft blue-grey back layer, a pale cream middle layer and a bright white top layer, each cut with a slightly different scalloped edge and offset a few millimetres so every layer edge shows, with narrow soft paper-layer shadows between them; fine visible paper fibres, crisp cut edges, completely flat (no puffy 3D shading). A white paper cloud shaped like a plump fish with a forked tail fin, made of round white cardstock puffs.',
             'cloud_car': 'A cloud built from three stacked layers of hand-cut paper: a soft blue-grey back layer, a pale cream middle layer and a bright white top layer, each cut with a slightly different scalloped edge and offset a few millimetres so every layer edge shows, with narrow soft paper-layer shadows between them; fine visible paper fibres, crisp cut edges, completely flat (no puffy 3D shading). A white paper cloud shaped like a small rounded toy car with two round cloud wheels, made of round white cardstock puffs.'}.items():
    J('kkultteok', k, 'sprite', sprite(s, 'Floating, front view.', face=False, extra_no=NOFACE))
DARK = 'A dark rain cloud character made of layered slate-grey and navy paper puffs. It is just a cloud with a face: NO arms, NO hands, NO legs, NO feet. It floats in the air.'
BABY = 'A small baby dark rain cloud character: one round fluffy body of layered slate-grey paper puffs, about half the size of a grown dark cloud. It is just a cloud with a face: NO arms, NO hands, NO legs, NO feet.'
DK = {'dark_drink': (DARK + ' Big and round-bellied.', 'Sipping water through a coral paper straw held in its mouth, cheeks full, round and puffed up, content.'),
      'dark_march': (DARK, 'Floating along to the right, bobbing happily, cheerful. No rain drops.'),
      'dark_bump': (DARK, 'Bumping sideways, surprised O mouth, a few tiny paper stars.'),
      'baby_huddle': (BABY, 'Curled up small and low, looking down, sad, a tiny paper tear.'),
      'baby_wide': (BABY, 'Eyes big and round with surprise and hope, a tiny hopeful smile.'),
      'baby_up': (BABY, 'Shooting upward happily, determined smile, a few short paper motion strips below it.'),
      'baby_sorry': (BABY, 'Sheepish embarrassed smile, tilted a little, one small paper sweat drop beside it.'),
      'baby_white': (BABY.replace('slate-grey', 'pure cloud-white') + ' It has turned completely white and light.', 'Beaming smile, floating happily, two tiny paper sparkles beside it.')}
for k, (s, p) in DK.items():
    J('kkultteok', k, 'sprite', sprite(s, p), [])
for k, s in {'prop_drop': 'A single water drop cut from pale sky-blue cardstock with a small white highlight strip.',
             'prop_sprout': 'A tiny green sprout with two round leaves popping out of a small mound of brown soil.',
             'prop_bud': 'A green stem with leaves and a closed coral flower bud.',
             'prop_flower': 'A green stem with leaves and a fully open coral-pink flower with a yellow center.',
             'prop_berry_green': 'A small strawberry plant with leaves and one unripe pale green strawberry.',
             'prop_berry_red': 'A small strawberry plant with leaves and one ripe bright red strawberry with yellow seeds.',
             'prop_chimney_far': 'A small distant round pale-mint factory chimney on top of a small green hill, a tiny white cloud puff at its top.'}.items():
    J('kkultteok', k, 'sprite', sprite(s, 'As described, front view.', face=False))
KREF = [K + 'nuna_lookup_v2.png', K + 'oppa_lookup.png', K + 'agi_lookup.png', K + 'dog_lookup.png']
J('kkultteok', 'cut_hug', 'cut', cut('Lightning flashes in a dark sky: the twins Dahyun and Ihyun and little Eunwoo hug each other tightly with eyes squeezed shut, while the small dog Kkulddeok in front wags its tail happily, the brightest thing in the panel.', 'Dark navy paper sky with one bright yellow paper lightning zigzag and short rain strips.'), KREF)
J('kkultteok', 'cut_rainbow', 'cut', cut('A huge seven-colour paper rainbow fills the sky; beside it a small baby cloud that has turned pure white beams happily; below, the wet twins and little Eunwoo look up amazed ("wow"), the dog sniffs the wet ground.', 'Bright fresh sky and soft green hills after rain.'), KREF)
J('kkultteok', 'key_tall', 'key', key('The twins Dahyun and Ihyun, little Eunwoo and their dog Kkulddeok stand on a green hill looking up at a tall round pale-mint chimney puffing round white paper clouds into a bright blue sky; one tiny baby dark-grey cloud peeks from behind a white cloud.', 'tall 3:4 portrait'), KREF, out=f'{RAW}/keyart_gpt/kkultteok_tall_v3.png')
J('kkultteok', 'key_wide', 'key', key('Wide view: the twins Dahyun and Ihyun, little Eunwoo and their dog Kkulddeok on a green hill on the left looking up at a tall round pale-mint chimney on the right puffing round white paper clouds into a bright blue sky; one tiny baby dark-grey cloud peeks from behind a white cloud.', 'wide 16:9'), KREF, out=f'{RAW}/keyart_gpt/kkultteok_wide_v3.png')

# 할멈 자세 더 (2026-10-17): 모두 왼쪽을 보게 (게임은 왼쪽을 보는 그림을 기준으로 뒤집는다)
for k, ps in {'stir': 'Standing, three-quarter view facing LEFT, stirring a big pot with a long wooden paddle held in both hands (the pot is NOT drawn, only the paddle), content smile.',
              'offer': 'Standing, three-quarter view facing LEFT, holding out a small brown bowl of red bean porridge with both hands, kind smile.',
              'scared': 'Standing, facing LEFT, leaning back, both hands raised near her cheeks in fright, wide round eyes, small open mouth, knees a little bent.',
              'cry': 'Standing, facing LEFT, head down, wiping tears with the back of one hand, big paper tear drops, sad.',
              'cheer': 'Standing, facing LEFT, both arms raised high in joy, eyes closed in a big smile, one foot lifted.'}.items():
    J('patjuk', f'pj_granny_{k}', 'sprite', sprite(GRANNY + ' Same character as the reference image (but facing LEFT).', ps), [G0])

# 아이 자세 더 (2026-10-17): 장면마다 다른 몸짓
MORE = {'point': 'Standing facing right, one arm stretched out pointing up and forward at something exciting, mouth open in wonder.',
        'tiptoe': 'Tiptoeing to the right very quietly, knees bent, one finger on the lips (shh), sneaky curious face.',
        'crouch': 'Crouching low facing right, hands on knees, looking closely at something small on the ground, delighted.',
        'clap': 'Standing facing the viewer, clapping hands together above the chest, eyes closed in a big happy smile.',
        'eek': 'Standing, startled, both hands on the cheeks, shoulders up, eyes squeezed shut, small open mouth (a little scared by thunder).',
        'splash': 'Jumping with both feet into a puddle, little flat paper water drops splashing up around the feet, arms out, laughing. Yellow rain boots on the feet.'}
for who in ('nuna', 'oppa', 'agi'):
    desc, refs = KIDS[who]
    for pose, ptxt in MORE.items():
        J('kkultteok', f'{who}_{pose}', 'sprite', sprite(desc + ' Same child as the reference images.', ptxt), refs)
J('kkultteok', 'ui_bubble', 'sprite', sprite('A sound-effect bubble for a picture book made of paper: a wide rounded cloud-shaped badge with soft scalloped edges (about 1.5 times wider than tall), cut from warm cream cardstock, mounted on a slightly larger second layer of pale apricot paper peeking out around the edge, with a narrow soft paper-layer shadow between the layers. Completely empty inside: NO text, NO letters, NO symbols, NO face.', 'Flat, front view, centred, filling about 80% of the frame width.', face=False), [], out=f'{RAW}/char_gpt/ui/ui_bubble.png')

# 구름 여러 모양 (2026-10-17): 겹이 하나·둘인 것도, 먹구름도 서로 다르게
ONE = 'Hand-cut paper cloud, simple and flat. '
for k, d in {'cloud_one': 'A single layer of white cardstock cut into a soft, lumpy cloud shape with three round bumps. Just ONE layer, no other layers behind it.',
             'cloud_two': 'Two layers: a white cloud shape with four bumps over a slightly larger pale blue-grey layer peeking out at the bottom edge.',
             'cloud_long': 'A long, low, flat cloud (about three times wider than tall) cut from two layers of cream and white paper.',
             'cloud_small': 'A small round puff cloud cut from a single layer of white paper, slightly tilted.'}.items():
    J('kkultteok', k, 'sprite', sprite(ONE + d, 'Floating, front view.', face=False, extra_no=NOFACE))
for k, (d, p) in {'dark_drink2': ('A TALL, tower-shaped dark rain cloud character, two layers of slate-blue and charcoal paper, cheeky expression. It is just a cloud with a face: NO arms, NO hands, NO legs, NO feet.', 'Sipping water through a coral paper straw held in its mouth, eyes closed happily.'),
                  'dark_drink3': ('A small, wide and flat dark rain cloud character, a single layer of dark grey paper with a lighter grey edge strip, sleepy expression. It is just a cloud with a face: NO arms, NO hands, NO legs, NO feet.', 'Slurping water through a coral paper straw held in its mouth, cheeks puffed.'),
                  'dark_march2': ('A TALL, tower-shaped dark rain cloud character, two layers of slate-blue and charcoal paper. It is just a cloud with a face: NO arms, NO hands, NO legs, NO feet.', 'Floating along to the right, proud little smile.'),
                  'dark_march3': ('A small, wide and flat dark rain cloud character, a single layer of dark grey paper with a lighter grey edge strip. It is just a cloud with a face: NO arms, NO hands, NO legs, NO feet.', 'Floating along to the right, humming happily, eyes closed.')}.items():
    J('kkultteok', k, 'sprite', sprite(d, p), [])

# ───────── 시작 화면: 크림 종이판에 둥근 창 (종이 테두리) ─────────
def keyround(scene, ratio, rim):
    if ratio == 'wide':
        frame = ('The whole wide 16:9 canvas is ONE flat sheet of warm cream cardstock (#f5efe9) with fine paper grain. A large perfect circle window is cut out of it, '
                 'centered horizontally, its top at about 4% of the height and its diameter about 74% of the canvas HEIGHT. The scene is seen THROUGH this round hole, '
                 'built from layered paper behind the sheet; the hole edge shows the sheet thickness with a soft inner shadow. The lower 22% of the canvas below the circle and '
                 'both side areas are plain empty cream paper with nothing on them (a title is placed there later).')
    else:
        frame = ('The whole tall 3:4 canvas is ONE flat sheet of warm cream cardstock (#f5efe9) with fine paper grain. A large perfect circle window is cut out of it, '
                 'centered horizontally, its top at about 6% of the height and its diameter about 62% of the canvas WIDTH. The scene is seen THROUGH this round hole, '
                 'built from layered paper behind the sheet; the hole edge shows the sheet thickness with a soft inner shadow. Everything below the circle (the lower 40% '
                 'of the canvas) and the side margins are plain empty cream paper with nothing on them (a title is placed there later).')
    return '\n\n'.join([HEAD, 'Create a title illustration for a children\'s story app, rendered entirely as handcrafted paper art.', STYLE,
        'FRAME (most important):\n' + frame + '\nAround the rim of the circle, a few layered paper ornaments overlap the edge at the upper-left and upper-right and one at the bottom: ' + rim + ' Nothing else on the cream sheet.',
        'SCENE INSIDE THE CIRCLE:\n' + scene, FACE, 'Match the characters in the reference images exactly. Characters may slightly overlap the lower rim of the circle.',
        LIGHT, '\n'.join(NO_BASE + ['NO title, NO letters anywhere.'])])
PJK = 'The kind grandmother stirring a big black pot of red bean porridge on a snowy winter-solstice night in front of her thatched cottage, steam rising; the cute orange tiger peeking from behind a snowy pine; the chestnut, soft-shell turtle and stone mortar friends peeking in at the bottom.'
for r in ('tall', 'wide'):
    J('patjuk', f'keyr_{r}', 'key', keyround(PJK, r, 'red maple leaves, plum blossoms and small snowy pine sprigs cut from paper.'), [G0, T0, P + 'pj_friend_bam.png', P + 'pj_friend_jara.png'], out=f'{RAW}/keyart_gpt/patjuk_{r}_round.png')
KFK = 'The twins Dahyun and Ihyun, little Eunwoo and their dog Kkulddeok on a green hill looking up at a tall round pale-mint chimney puffing round white paper clouds into a bright blue sky; one tiny baby dark-grey cloud peeks from behind a white cloud.'
for r in ('tall', 'wide'):
    J('kkultteok', f'keyr_{r}', 'key', keyround(KFK, r, 'fresh green paper leaves, small white paper clouds and two tiny coral flowers.'), KREF, out=f'{RAW}/keyart_gpt/kkultteok_{r}_round.png')

for t, js in jobs.items():
    p = os.path.join(G, f'tools/app/gen/jobs_{t}.json')
    json.dump(js, open(p, 'w'), ensure_ascii=False, indent=1)
    print(t, len(js), 'jobs ->', p)
