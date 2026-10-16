#!/usr/bin/env python3
"""팥죽 동화 만화 컷 21장(assets/v2/cut_*.png)의 S2 작업 파일. 원래 작업 파일이 없는 컷이 많아 내용을 직접 적는다."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'build_restyle_jobs.py')).read().split('def load_jobs')[0]
ns = {'__file__': __file__}
exec(src, ns)
S2, CUT_HEAD, NEG_CUT, REFS = ns['S2'], ns['CUT_HEAD'], ns['NEG_CUT'], ns['REFS']
TIGER = ("The tiger is a cute chubby Korean folk-tale tiger cub: flat persimmon-orange paper body with separate dark-brown stripe pieces, cream muzzle and belly patch, "
         "big round white paper eyes with dark pupils, small pink cheek circles, small rounded ears, funny and clumsy, never scary, no blood, no fangs. ")
NOFACE = "The prop has NO face and NO eyes. "
BURST = "Behind everything a bold flat burst of orange and gold speed-line strips on a deep indigo night sky. "
LAUGH = ("The tiger stands laughing out loud with his eyes squeezed shut, one paw over his mouth and the other on his round belly, little flat paper sparkle and shake marks around him "
         "because the friend missed. Plain deep navy night background, flat ground floor. ")
C = {
 'bam': BURST + "A roasted brown chestnut shoots out of a brick hearth with a bright fire on the left and flies straight at the tiger's eye on the right, a yellow motion streak behind it; the tiger is startled, eyes wide, mouth a small 'O', a flat star-shaped impact burst. " + NOFACE + TIGER,
 'bam_b': BURST + "The tiger covers one eye with his paw, tears flying, little paper stars circling above his head; a small plain brown chestnut lies on the floor in the corner. " + NOFACE + TIGER,
 'jara': BURST + "The tiger has pushed his face into a big brown earthen water jar full of water and a green turtle bites his nose, big flat paper water splashes all around, tiger's eyes wide. " + NOFACE + TIGER,
 'jara_b2': BURST + "Close view: the tiger is crying with big tears, a green turtle hangs from his nose by its mouth, the brown earthen jar below with splashes. " + NOFACE + TIGER,
 'ddong': BURST + "The tiger slips on a plain brown cow-dung pile on the ground and flies backward with his legs kicking up, a star-shaped burst behind him. " + NOFACE + TIGER,
 'ddong_b': "The tiger lies flat on his back on a wooden yard floor with spiral dizzy eyes, little paper stars and a swirl ring circling above his head, orange and gold burst strips on indigo behind. " + TIGER,
 'songgot': BURST + "The tiger sits down hard on a sharp awl (a small steel needle in a round wooden handle) standing point-up on the floor, his bottom just touching the tip, a star-shaped poke burst under him, eyes wide. " + NOFACE + TIGER,
 'songgot_b': BURST + "The tiger leaps up from the floor with both paws holding his bottom, eyes and mouth wide open in surprise, the awl lying small on the floor below. " + NOFACE + TIGER,
 'jeolgu': BURST + "A big grey stone mortar drops onto the tiger's head with a BONK, a golden impact burst, the tiger's eyes spiral-dizzy, a lit paper window behind. " + NOFACE + TIGER,
 'jeolgu_b2': "The tiger sits dazed on a wooden porch floor with spiral eyes, a small round bump on his head and tiny stars circling, a grey stone mortar tipped over beside him, a lit paper door behind, burst strips on indigo. " + NOFACE + TIGER,
 'myeongseok': "The tiger is being rolled up in a golden woven straw mat (meongseok) that rolls over a snowy yard, only his head and paws poking out at one end, eyes wide, small flat stars, snowy ground and a distant snowy Korean village under a night sky. " + NOFACE + TIGER,
 'myeongseok_b': "The straw mat is rolled up like a long tube on the snow; the tiger's face pokes out of the end of the roll, crying with big tears, stars in the indigo sky, snowy ground. " + NOFACE + TIGER,
 'jige2': "Deep indigo night sky, a big cream full moon, a dark brown earthen shore, a moonlit indigo sea with cream foam; no snow anywhere. At the shore a jige (a traditional Korean A-frame wooden back-carrier made of two long straight wooden poles leaning together in an A shape joined by crossbars, with a small woven straw rack) tips forward and flings a rolled-up straw mat into the sea. The tiger is rolled up inside the straw mat: only his head pokes out of one end of the roll, eyes wide, mouth open in a funny 'Aaah!'. A big flat paper water-splash bursts up where the roll hits the waves. The jige has no wheels, no box body and no legs. " + NOFACE + TIGER,
 'jige_b': "The tiger is splashing in the moonlit indigo sea, both paws up flailing, eyes wide and surprised, big flat paper water splashes, a big cream full moon in the night sky, orange and gold burst strips behind. " + TIGER,
 'wrong_bam': LAUGH + "On the right a round earthen hearth with a small plain unroasted chestnut resting in it. " + NOFACE + TIGER,
 'wrong_jara': LAUGH + "On the right a big brown earthen jar with a small green turtle peeking out harmlessly over the rim. " + TIGER,
 'wrong_ddong': LAUGH + "On the ground in front, a plain brown cow-dung pile the friend left behind, with the tiger hopping beside it. " + NOFACE + TIGER,
 'wrong_songgot': LAUGH + "On the left an awl (small steel needle in a round wooden handle) lying on the ground. " + NOFACE + TIGER,
 'wrong_jeolgu': LAUGH + "On the right a grey stone mortar with a small wooden pestle on the ground, a few little stones around. " + NOFACE + TIGER,
 'wrong_myeongseok': LAUGH + "On the right a loose flat woven straw mat lying on a snowy ground, not rolled. " + NOFACE + TIGER,
 'wrong_jige2': LAUGH + "On the right the empty jige (a traditional Korean A-frame wooden back-carrier of two long straight poles leaning together in an A shape with crossbars and a small woven straw rack) stands tilted, as if it just missed. The jige has no wheels, no box body and no legs. " + NOFACE + TIGER,
}
out = [{'name': 'cut_' + k + '_s2', 'w': 1024, 'h': 768, 'cfg': 3.0, 'key': False, 'refs': REFS, 'negative': NEG_CUT,
        'prompt': S2 + ' ' + CUT_HEAD + v + ' Full-bleed illustration, no text.'} for k, v in C.items()]
json.dump(out, open(os.path.join(HERE, 'jobs_patjuk_cuts_s2.json'), 'w'), ensure_ascii=False, indent=1)
print(len(out))
