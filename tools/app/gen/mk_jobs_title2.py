#!/usr/bin/env python3
"""썸네일 위에 얹는 동화별 콘셉트 레터링(투명 PNG) 시안 잡 — 2026-10-31 사용자: 글자 대신 썸네일만 보고 알 수 있게, 동화마다 다른 레터링.
같은 색지 오리기 재료로 통일하고, 색·모양·작은 장식만 동화마다 다르게. 어떤 그림 위에서도 읽히게 크림 종이 받침을 한 장 둔다.
  python3 tools/app/gen/mk_jobs_title2.py && python3 tools/app/gen/run_simple.py title2 t2_patjuk ..."""
import json, os
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
P = """Use case: logo-brand
Asset type: transparent production Korean story-title lettering for a children's picture-book app (ages 3-4), placed over the top of a colourful paper-art thumbnail picture.
Text verbatim, exactly these Hangul syllables and spaces, no other text: "{title}". Every syllable spelled exactly right, natural Hangul proportions, 받침 kept close to its syllable.
Material: the letters are cut from coloured craft paper and layered like a paper-cut collage: each letter is one flat piece of one colour with a fine paper-fibre texture, and the whole title sits on ONE slightly larger backing piece of cream paper (#FFF6E6) cut around the letters as a soft blob silhouette, so it reads over any picture. Only a soft, short, dark warm shadow (#2E241C) where one paper piece lies on another. No gradients, gloss, 3D bevel, emboss, outlines, glow or white stroke.
Lettering: heavy, chunky, friendly rounded display lettering, extra-bold, bouncy baseline and playful syllable sizes, very legible at small size. NOT calligraphy, NOT thin script.
Concept for this tale: {concept}
Composition: {lines} Title fills the canvas with modest transparent margins. TRUE transparent background outside the cream backing. One final title only, no characters, no frame, no other text."""
J = [
 ('patjuk', '팥죽할멈과 호랑이', 'Korean folk tale on a snowy winter night. Letters in bean red (#A93B32) and deep brown; the word 호랑이 in tiger orange (#E8703A) with a few dark brown tiger-stripe paper slivers laid on its letters; two small cream steam curls rising from the syllable 죽.'),
 ('little_mermaid', '인어공주', 'Under the sea. Letters in sea teal (#2A9D9A) and coral pink (#F08A7E) alternating; three small pale-blue paper bubble circles beside the title and a little teal mermaid-tail fin cut piece curling off the last syllable 주.'),
 ('witch_candy', '사탕 마녀의 핼러윈', 'Cheerful Halloween. Letters alternate pumpkin orange (#F28C28) and witch purple (#7B4F8C); a small black witch hat perched on the syllable 마, and two tiny wrapped-candy paper shapes in lime and pink beside the title.'),
 ('red_hen', '빨간 암탉', 'Farm and golden wheat. Letters in hen red (#C8372D) and straw gold (#D9A94E); a small wheat-ear paper cut stalk leaning on the last syllable 탉, and a tiny red hen comb shape on top of 암.'),
 # 2026-10-31 사용자: 시안 좋음 → 나머지 30편
 ('frog', '황소와 개구리', 'Pond and meadow. 황소 in warm ox brown (#8A5A3C), 개구리 in bright frog green (#5FA34A); a small green lily pad under the last syllable and two tiny water-drop circles.'),
 ('rabbit', '토끼와 거북이', 'Race on a green hill. 토끼 in soft pink (#E98AA0), 거북이 in turtle green (#4E8B4A) with a hexagon shell pattern sliver on 거; a tiny checkered finish-flag piece at the end.'),
 ('sunmoon', '해와 달이 된 오누이', 'Korean night and day sky. 해 in sun orange (#F2A23A), 달 in moon cream-yellow (#F4D97A), the rest in deep indigo (#1F2A56) letters on the cream backing; a small rope piece hanging from the last syllable.'),
 ('sun_wind', '해와 바람', 'Sky contest. 해 in sunny orange (#F2A23A) with a small paper sun-ray ring behind it, 바람 in breezy sky blue (#5DA9D6) with two curling wind-swirl paper strips trailing off.'),
 ('turnip', '커다란 순무', 'Vegetable garden. Letters in turnip white-violet (#8B5CA8) and leaf green (#4E9A44); the syllable 무 is extra big and round like a turnip with three green leaf pieces sprouting on top.'),
 ('lion_mouse', '사자와 생쥐', 'Savanna. 사자 in big golden-mane orange (#E39A2E), large and chunky; 생쥐 small in mouse grey (#8C8C94); a tiny rope-net slice under 사자 and a small mouse-ear pair on 쥐.'),
 ('fox_crane', '여우와 두루미', 'Dinner party. 여우 in fox orange (#E2702F), 두루미 in white-grey with a red crown dot (#D6403A) on 두; a small soup plate piece and a tall slim jar piece at either end.'),
 ('goldilocks', '골디락스와 곰 세 마리', 'Forest cottage. 골디락스 in golden yellow (#E8B23A), 곰 세 마리 in honey bear brown (#8B5A35); three little round bowls of decreasing size beside the title.'),
 ('bremen', '브레멘 음악대', 'Musical parade. Letters in four lively colours (donkey grey #8C8C94, dog brown #9A6A3E, cat orange #E8873A, rooster red #C8372D); two small musical-note paper pieces floating off the end.'),
 ('ant_grasshopper', '개미와 베짱이', 'Summer field into winter. 개미 in ant dark red-brown (#7A3B2A), 베짱이 in grasshopper green (#7DBA3C); a tiny violin piece next to 베 and a small grain seed piece next to 개.'),
 ('ugly_duckling', '미운 아기 오리', 'Lake. Letters in duckling grey (#9A9AA2) and soft yellow (#F2CF4A); a little white swan-neck curve piece rising from the last syllable and two reed leaves.'),
 ('three_pigs', '아기 돼지 삼형제', 'Three little houses. Letters in pig pink (#F09AA6) with darker pink (#D9707F); behind 삼형제 three tiny house pieces in straw, wood and red brick.'),
 ('wolf_goats', '늑대와 일곱 마리 아기 염소', 'Cottage in the woods. 늑대 in wolf grey-blue (#5C6784), the rest in warm cream-white goat letters with soft brown (#B98A5A) edges; seven tiny round goat-bell dots in a row under the title.'),
 ('kongjwi', '콩쥐 팥쥐', 'Korean folk tale. 콩쥐 in soft pea green (#7BAA4E), 팥쥐 in bean red (#A93B32); a small straw-shoe (꽃신) piece beside the title and three tiny bean dots.'),
 ('kkultteok', '구름 공장', 'Dreamy cloud factory. Letters in sky blue (#6FB7E6) and cotton-cloud white on the cream backing; puffy cloud piece behind 구름 and a small gear piece next to 공장.'),
 ('hansel', '헨젤과 그레텔', 'Candy house in the woods. Letters in gingerbread brown (#A8683A) with candy pink (#F08AB0) and mint (#7FCDB8) icing-dot pieces; a tiny lollipop at the end.'),
 ('cinderella', '신데렐라', 'Royal ball. Letters in soft blue gown colour (#7FA6D8) and pumpkin orange (#F08C2E) alternating; a small glass-slipper paper piece (pale blue) at the end and a tiny clock piece.'),
 ('heungbu', '흥부와 놀부', 'Korean folk tale. 흥부 in warm gourd gold (#D9A94E), 놀부 in grumpy dark red (#8E2F2A); a small round gourd (박) piece and a little swallow piece flying off the end.'),
 ('red_hood', '빨간 모자', 'Forest path. Letters in hood red (#C8372D) with forest green (#3F6B4F); a little red hood shape on top of 빨, and a small basket piece at the end.'),
 ('magpie', '은혜 갚은 까치', 'Korean mountain temple. Letters in magpie black (#2B2F3A) and white with a blue-green feather tint (#3E7C8A); a small temple-bell piece and a tiny magpie tail at the end.'),
 ('magic_jar', '요술 항아리', 'Korean folk tale. Letters in earthenware brown (#8A5232) with gold coin (#E3B23C) pieces; a small round jar (항아리) shape with two gold coins popping out beside the title.'),
 ('byeoljubu', '별주부전', 'Under-sea palace. Letters in sea turtle green (#4E8B6A) and coral red (#E06A55); a tiny turtle shell piece and two small bubble circles.'),
 ('snow_white', '백설공주', 'Fairy-tale forest. Letters in deep blue (#2F4E9A), bright red (#D33A35) and yellow (#F2C23A) like the princess dress; a small red apple piece at the end.'),
 ('beauty_beast', '미녀와 야수', 'Castle garden. 미녀 in rose gold-yellow (#E8B23A), 야수 in royal blue (#2F4E9A); a small red rose piece between the words.'),
 ('red_car', '나의 빨간 자동차', 'Toy road adventure. Letters in car red (#D33A35) with a road grey (#5A5E66) piece; a small round tyre piece under 자동차 and a tiny yellow star.'),
 ('unicorn', '유니콘을 찾아서', 'Magical rainbow meadow. Letters in soft rainbow colours (pink, lilac, sky blue, mint, lemon), one colour per syllable; a small golden horn piece on top of 유 and a tiny rainbow arc.'),
 ('princess_pea', '완두콩 공주', 'Stack of mattresses. Letters in pea green (#6FAA3E) and royal pink (#E58AB0); a tiny stack of three colourful mattress strips with one green pea on top beside the title.'),
 ('rapunzel', '라푼젤', 'Tower. Letters in lavender (#9C7CC0) and golden hair yellow (#E8B23A); one long golden braid strip curling down from the last syllable.'),
 ('frog_prince', '개구리 왕자', 'Royal pond. 개구리 in frog green (#5FA34A), 왕자 in royal gold (#E3B23C); a tiny gold crown piece on top of 왕 and a small golden ball.'),
 ('sleeping_beauty', '잠자는 숲속의 공주', 'Enchanted rose forest. Letters in dusky rose (#C9667E) and forest green (#3F6B4F); small rose and thorny vine pieces winding under the title and a tiny moon.'),
]
jobs = []
for t, title, concept in J:
    n = len(title.replace(' ', ''))
    lines = 'Set it on one line.' if n <= 5 else 'Set it on two lines, breaking only at a space, centred.' if ' ' in title else 'Set it on one line.'
    jobs.append({'id': f't2_{t}', 'kind': 'sprite', 'aspect': 'landscape 3:2', 'out': f'assets/raw/title2/{t}_title.png', 'refs': [],
                 'prompt': P.format(title=title, concept=concept, lines=lines)})
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_title2.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
