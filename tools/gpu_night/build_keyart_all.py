#!/usr/bin/env python3
"""전 동화 시작 화면용 풀블리드 키아트 작업 목록 (신데렐라 wide_a/tall_a 문장 틀 그대로)"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
base = json.load(open(os.path.join(HERE, 'jobs_keyart_cinderella.json')))
W = next(x for x in base if x['name'] == 'cd_key_wide_a')
T = next(x for x in base if x['name'] == 'cd_key_tall_a')
NEG = W['negative'] + ', faces on objects, text, white margin'

# id: (silhouette, palette outer->centre, scene, wide composition, tall composition, band colour)
TALES = {
 'patjuk': ('a round black cauldron pot with a tiger head peeking out', 'pale cream to warm orange to deep crimson-red',
   'a grandmother in a hanji-roofed Korean kitchen yard in autumn, a big black porridge cauldron with a friendly tiger peeking over its rim, red bean porridge steaming, a mortar, a straw mat and a sack of red beans in front',
   'the kitchen yard spreads wide with the grandmother at the right, the cauldron with the tiger at the center-left, autumn maple leaves scattered',
   'the thatched kitchen roof high at the top, the grandmother in the middle, the cauldron with the tiger below', 'deep brown-maroon'),
 'rabbit': ('a round rabbit head with two tall ears', 'pale mint to leaf green to deep forest green',
   'a green hill with a winding path, a white rabbit napping under a tree, a slow turtle plodding along the path, a checkered finish flag at the top of the hill, small flowers in front',
   'the hill spreads wide with the winding path from left to right and the finish flag at the top right, the sleeping rabbit at the left',
   'the finish flag high at the top, the winding path climbing through the middle, the sleeping rabbit and the turtle below', 'deep forest green'),
 'sunmoon': ('a big crescent moon', 'pale lavender to violet to deep midnight indigo',
   'a starry night sky with a crescent moon and a golden sun, a long golden rope hanging down with a brother and sister climbing it, a small thatched village below',
   'the crescent moon at the top right, the rope dropping from the top center with two children climbing, the village roofs spread along the lower left',
   'the moon and stars high at the top, the long rope hanging through the middle with two children climbing, the thatched village below', 'deep midnight indigo'),
 'three_pigs': ('a house with a pitched roof', 'pale butter yellow to terracotta orange to deep brick red',
   'three little pigs in front of a straw house, a wooden stick house and a sturdy red brick house in a row, a grey wolf peeking from behind the brick house, a few loose bricks in front',
   'the three houses stand in a row across the frame from straw at the left to brick at the right, the pigs in front, the wolf at the far right',
   'the brick house high at the top, the stick and straw houses in the middle, the three pigs below', 'deep brick-brown'),
 'wolf_goats': ('a tall grandfather clock', 'pale tan to walnut brown to deep chocolate brown',
   'a cozy wooden room with a tall grandfather clock, six little white kid goats hiding, one little kid goat inside the clock case, a mother goat with a basket at the door, a grey wolf peeking at the window',
   'the tall clock at the center, kid goats peeking out on both sides, the mother goat at the right with a basket, the window at the left',
   'the clock face high at the top, the kid goats hiding in the middle, the mother goat with her basket below', 'deep chocolate brown'),
 'red_hood': ('a pointed red riding hood', 'pale leaf green to mid green to deep forest green',
   'a deep forest with a winding path, a little girl in a red hood carrying a basket, a small cottage in the distance, a grey wolf peeking from behind a tree, wildflowers along the path',
   'the forest spreads wide with the cottage at the right, the winding path crossing the frame, the girl at the left and the wolf peeking from the right trees',
   'the cottage high at the top, the winding path through the middle, the girl in the red hood and wildflowers below', 'deep forest green'),
 'lion_mouse': ('a big round lion mane with spiky edges', 'pale sunny yellow to amber orange to deep golden brown',
   'the African savanna with an acacia tree, a big friendly lion tangled in a rope net, a tiny grey mouse nibbling the rope, golden grass in front',
   'the savanna spreads wide with the acacia at the right, the lion in the net at the center, the little mouse at the left front',
   'the acacia tree high at the top, the lion in the net in the middle, the tiny mouse nibbling the rope below', 'deep golden-brown'),
 'turnip': ('a round white turnip with big leafy green top', 'pale lilac to violet to deep plum purple',
   'a vegetable garden with a huge white turnip, a grandfather, grandmother, girl, a puppy, a cat and a tiny mouse all pulling it together in a line, a wooden fence behind',
   'the huge turnip at the center with everyone pulling in a line to the right, the fence behind',
   'the big leafy turnip top high at the top, the pulling line of grandfather, grandmother, girl, puppy, cat and mouse through the middle, soil below', 'deep plum-brown'),
 'frog': ('a round green frog head with big eyes', 'pale aqua to teal green to deep pond green',
   'a pond with lily pads and cattails, a little green frog puffing up its belly, a big brown ox standing on the bank behind it, small frogs and water drops',
   'the pond spreads wide with the ox at the upper right on the bank, the puffed-up frog at the center on a lily pad, small frogs at the left',
   'the ox high at the top on the bank, the cattails in the middle, the puffed-up frog on a lily pad below', 'deep pond teal'),
 'sun_wind': ('a smiling round sun with rays', 'pale sky blue to cobalt blue to deep ocean blue',
   'a country road across rolling hills, a traveler in a brown coat, a smiling sun at the upper right and a puffing cloud wind at the left blowing swirls toward him',
   'the road runs across the frame, the sun at the top right, the wind cloud at the top left, the traveler at the center',
   'the sun high at the top, the wind swirls in the middle, the traveler on the road below', 'deep ocean blue'),
 'fox_crane': ('a tall tapered bottle with a crane neck', 'pale peach to teal to deep petrol blue',
   'a small wooden table with a flat plate and a tall narrow bottle, an orange fox and a white crane with a long beak facing each other, a fox tail and a few reeds',
   'the table spreads across the frame with the fox at the left and the crane at the right, the tall bottle in the middle',
   'the crane with its long neck high at the top, the table in the middle, the fox and the plate below', 'deep petrol blue'),
 'goldilocks': ('a round bear head with two round ears', 'pale honey cream to caramel brown to deep chocolate brown',
   'a cozy wooden cottage room with three bowls of porridge of different sizes on a table, three chairs, a little golden-haired girl peeking, a wooden spoon',
   'the cottage room spreads wide with the three bowls on the table at the center, three chairs at the right, the girl at the left',
   'the three bowls high on the table at the top, the three chairs in the middle, the girl and the bears below', 'deep chocolate brown'),
 'bremen': ('a rounded stack silhouette of a donkey, a dog, a cat and a rooster', 'pale periwinkle to royal blue to deep midnight navy',
   'a night forest with a small cottage with a lit window, a donkey with a dog on its back, a cat on the dog and a rooster on top, musical notes',
   'the animal stack at the center-left, the lit cottage window at the right, trees on both sides, musical notes floating',
   'the rooster high at the top, the cat, dog and donkey stacked through the middle, the cottage and trees below', 'deep midnight navy'),
 'ant_grasshopper': ('a pointed green leaf', 'pale lime to leaf green to deep olive green and orange autumn',
   'a split scene, a summer meadow at the left with a grasshopper playing a violin, an autumn orange side at the right with a line of ants carrying grain into an anthill',
   'the summer meadow with the grasshopper at the left and the line of ants marching to the anthill at the right',
   'the grasshopper with the violin high at the top, the line of ants in the middle, the anthill below', 'deep olive green'),
 'ugly_duckling': ('a smooth white swan egg', 'pale sky blue to azure to deep lake blue',
   'a calm lake with reeds, a family of white swans, a little grey duckling in the water, floating white feathers',
   'the lake spreads wide with the swans at the right and the little grey duckling at the center-left, reeds at the edges',
   'the swans high at the top, the reeds in the middle, the little grey duckling on the water below', 'deep lake blue'),
 'magic_jar': ('a round clay jar', 'pale sky green to emerald to deep teal',
   'a green farm field with a boy hoeing, a clay jar full of gold coins and rice, a wooden spoon, a pair of straw shoes, golden coins spilling out',
   'the field spreads wide with the boy at the left, the jar with coins at the center-right, rolling hills behind',
   'the hills and sky at the top, the boy in the middle, the jar spilling golden coins below', 'deep teal green'),
 'kongjwi': ('a Korean flower shoe', 'pale apricot to burnt orange to deep brown',
   'a traditional Korean hanok courtyard with a girl in a pink hanbok, a big black ox, a toad, a pair of flower shoes, flying birds',
   'the hanok spreads wide with the girl at the center, the ox at the right, the toad at the left front, birds at the top right',
   'the hanok roof high at the top, the girl in the middle, the ox, the toad and the flower shoes below', 'deep brown'),
 'heungbu': ('a round gourd with a leafy vine', 'pale lime to olive to deep forest green and golden',
   'a thatched-roof house with a huge gourd, a swallow flying with a gourd seed, golden coins spilling from the gourd, a vine of leaves',
   'the thatched house at the center-left, the huge gourd at the right with coins spilling, the swallow at the top left',
   'the swallow high at the top, the thatched house in the middle, the huge gourd and spilling coins below', 'deep forest green'),
 'magpie': ('a magpie bird silhouette', 'pale gold to sepia brown to deep misty green',
   'a misty mountain landscape with a pine tree, a hanok pavilion, a magpie in flight, a hanbok traveler, a bronze bell hanging',
   'the misty mountains spread wide with the pavilion at the right, the magpie flying at the top center, the traveler at the left',
   'the magpie high at the top, the misty mountains and pavilion in the middle, the traveler and the bell below', 'deep misty green'),
 'hansel': ('a gingerbread house with a pitched roof', 'pale pink to caramel brown to deep forest green',
   'a candy house in a dark forest, a brother and sister holding hands, cookies, lollipops and candy canes, white pebbles on the path',
   'the candy house at the center-right, the two children at the left on a path of white pebbles, forest trees behind',
   'the candy house roof high at the top, the forest in the middle, the two children and candies below', 'deep forest green'),
}
OUT = []
for tid, (sil, pal, scene, cw, ct, band) in TALES.items():
    for v, src, comp, bq in (('wide', W, cw, 'QUARTER'), ('tall', T, ct, 'THIRD')):
        p = src['prompt']
        a = p.index('FOUR or FIVE THICK'); b = p.index('The deepest centre layer')
        head = p[:a]
        ring = ('FOUR or FIVE THICK torn-paper rings in the shape of %s step inward from the frame edges — the outer rings are so large that they extend beyond and are cropped by the edges of the frame, colours stepping from %s toward the centre, each ring a clearly visible WIDE band casting a soft shadow on the next, strong obvious depth like layered paper waves. ' % (sil, pal))
        c = p.index('Composition is ')
        mid = 'The deepest centre layer, filling at least 70 percent of the whole picture, is a detailed layered paper-cut diorama of the key scene: %s. ' % scene
        orient = 'landscape' if v == 'wide' else 'portrait'
        tail = ('Composition is %s: %s. The BOTTOM %s of the frame is a calm soft low-contrast band of %s paper with only gentle texture and no detail, where a title can be placed. Elegant, harmonious, soft light from the top left. Cute Korean picture-book style for 3-4 year olds, never scary. No text.' % (orient, comp, bq, band))
        j = {k: v2 for k, v2 in src.items() if k not in ('prompt', 'negative', 'name')}
        j = {'name': f'{tid}_key_{v}_a', **j, 'negative': NEG, 'prompt': head + ring + mid + tail}
        OUT.append(j)
json.dump(OUT, open(os.path.join(HERE, 'jobs_keyart_all.json'), 'w'), ensure_ascii=False, indent=1)
print(len(OUT))
