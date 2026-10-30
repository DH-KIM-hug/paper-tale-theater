#!/usr/bin/env python3
"""홈 맨 위 배너 그림(16:9, 꽉 찬 장면) 잡을 jobs_banner.json 에 만든다 — 2026-10-30 사용자: 홈 배너를 좌우 꽉 채운 그림으로.
뒷표지(결말)는 미리보기에 쓰면 안 되므로 새로 그린다. 첫 장면일 필요는 없지만 결말이 드러나면 안 된다(사용자 2026-10-30). 글자는 넣지 않는다(제목 레터링은 따로 얹는다).
참고 그림 = 동화 타일 + 시작 화면 세로 그림(둘 다 지금 앱 그림).
  python3 tools/app/gen/mk_jobs_banner.py && python3 tools/app/gen/run_simple.py banner banner_patjuk ..."""
import json, os, re, subprocess
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
tpl = next(j for j in json.load(open(f'{G}/tools/app/gen/jobs_goldilocks.json')) if j['id'] == 'key5_backw')['prompt']

# 이야기 첫머리(결말·큰 사건 없이 주인공 소개). 빛 방향은 낮 = 왼쪽 위, 밤 = 오른쪽 위
S = {
 'ant_grasshopper': ('Summer meadow: a neat line of busy little ants carries grains toward their anthill, while the grasshopper lies relaxed on a big leaf playing his little violin.', 'day'),
 'beauty_beast': ('Belle sits reading a book beside a rose bush in her village garden; far away on a green hill stands a tall mysterious castle.', 'day'),
 'bremen': ('The old donkey sets off happily down a country road with a little bundle, passing a wooden signpost; the dog, the cat and the rooster peek out along the road, curious.', 'day'),
 'byeoljubu': ('The turtle (jara) pokes its head up from the blue sea at the sandy shore, looking at the rabbit who hops happily in a green seaside forest.', 'day'),
 'cinderella': ('Cinderella in her plain work dress sweeps the floor beside the kitchen hearth, smiling; little birds sit on the window sill.', 'day'),
 'fox_crane': ('The fox stands at the door of his cosy little house, bowing politely to invite the crane, who arrives on her long legs.', 'day'),
 'frog': ('Little baby frogs sit on lily pads in a calm pond, looking up in wonder at a big friendly ox grazing on the grassy bank.', 'day'),
 'frog_prince': ('The princess plays with her golden ball beside an old stone well in the royal garden; a small green frog peeks up from the edge of the well.', 'day'),
 'goldilocks': ('Goldilocks walks along a forest path and finds a little cottage among the trees, peeking curiously toward its round door.', 'day'),
 'hansel': ('Hansel and Gretel walk hand in hand into a deep green forest, Hansel quietly dropping little white pebbles on the path.', 'day'),
 'heungbu': ('Kind Heungbu gently cares for a little swallow with a hurt leg in front of his small straw-roofed house.', 'day'),
 'kkultteok': ('The children and their little dog look up excitedly at a fluffy cloud factory floating in a bright sky.', 'day'),
 'kongjwi': ('Kongjwi in her simple hanbok pours water into a big clay jar in the courtyard, while a kind toad sits beside the jar to help.', 'day'),
 'lion_mouse': ('The big lion naps peacefully under a shady tree on the savanna, while a tiny mouse scurries through the grass nearby.', 'day'),
 'little_mermaid': ('The little mermaid swims under the sea among coral and fish friends, looking up toward the bright surface far above.', 'day'),
 'magic_jar': ('A hardworking farmer digs in his field and finds an old round clay jar in the soil, looking at it curiously.', 'day'),
 'magpie': ('A young scholar walks along a mountain path with his bundle; a magpie family sits in a pine tree beside the path.', 'day'),
 'patjuk': ('Grandma weeds her red bean field beside her straw-roofed house; a big orange tiger peeks out curiously from behind a rock.', 'day'),
 'princess_pea': ('On a rainy evening the princess stands at the castle gate, knocking, while the queen opens the door holding a lantern.', 'night'),
 'rabbit': ('The rabbit and the turtle stand side by side at the starting line of a race, animal friends watching from the grassy hill.', 'day'),
 'rapunzel': ('Rapunzel leans out of the window at the top of her tall stone tower in the forest, her very long golden braid hanging down.', 'day'),
 'red_car': ('The child happily plays with a little red car in a sunny yard, other toy cars waiting nearby.', 'day'),
 'red_hood': ('Little Red Riding Hood sets off down the forest path with a basket, her mother waving goodbye from the cottage door.', 'day'),
 'sleeping_beauty': ('The king and queen celebrate their baby princess in a cradle in the bright castle hall, kind fairies arriving with gifts.', 'day'),
 'snow_white': ('Snow White walks through a flowering forest and finds a tiny cottage with seven little beds visible through the open door.', 'day'),
 'sun_wind': ('High in the sky the sun and the wind look down together at a traveller walking along a country road in his coat.', 'day'),
 'sunmoon': ('At dusk a brother and sister wait at the door of their little thatched house for their mother, a big moon rising over the mountains.', 'night'),
 'three_pigs': ('The three little pigs set off from home with little bundles, waving goodbye to their mother, three paths spreading ahead of them.', 'day'),
 'turnip': ('Grandpa stands amazed in his vegetable garden beside giant turnip leaves sprouting from the ground.', 'day'),
 'ugly_duckling': ('Mother duck sits by the pond watching her eggs hatch; little yellow ducklings and one big grey duckling look around.', 'day'),
 'unicorn': ('The little girl sets off into a magical forest with a map, looking for the unicorn; a rainbow glimmers between the trees.', 'day'),
 'witch_candy': ('On Halloween night the friendly witch and the little girl stand by a big cauldron among glowing pumpkin lanterns, ready to make candy, the black cat beside them.', 'night'),
 'wolf_goats': ('Mother goat leaves the little house with a basket, waving goodbye, while her seven little kids wave back from the doorway.', 'day'),
}
COMP = ("A landscape 16:9 home-screen banner picture that fills the WHOLE canvas edge to edge: a full-bleed rectangular paper diorama scene "
        "(no cream sheet, no window, no border, no frame, no ornaments around it). Only 3 or 4 flat paper depth planes. It shows an inviting moment from the story "
        "that does NOT reveal how the story ends (no ending, no resolution, no reward, no final happy reunion): {scene} Keep the main characters large and inside the CENTRAL area of the picture, well away from every edge "
        "(the picture will be cropped a little on all sides). Keep the LOWER-LEFT third and the LOWER-RIGHT corner calm and simple (plain ground or grass, "
        "no faces, no important objects) because a title and a button will be placed there. Keep the background very simple with one or two elements, "
        "no tiny details; faces clearly visible.")
a, b = tpl.split('COMPOSITION (most important):\n', 1)
b = b.split('\n\n', 1)[1]

os.makedirs(f'{G}/assets/raw/banner/refs', exist_ok=True)
jobs = []
for t, (scene, tod) in S.items():
    tile = f'assets/raw/banner/refs/{t}_tile.png'
    if not os.path.exists(f'{G}/{tile}'):
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{G}/assets/thumbs/{t}_tile.webp', f'{G}/{tile}'], check=True)
    tall = f'assets/raw/banner/refs/{t}_key_tall.png'   # 지금 시작 화면 그림(옛 restyle 인물 그림은 머리색 등이 달라서 쓰지 않는다)
    if not os.path.exists(f'{G}/{tall}'):
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{G}/assets/thumbs/{t}_key_tall.webp', f'{G}/{tall}'], check=True)
    refs = [tile, tall]
    pr = a + 'COMPOSITION (most important):\n' + COMP.format(scene=scene) + '\n\n' + b
    pr = pr.replace('from the upper-left (warm sunset daylight)', 'from the upper-left (warm daylight)' if tod == 'day' else 'from the upper-right (soft moonlight with a warm lantern glow)')
    pr = pr.replace('Match the characters in the reference images exactly', 'Match the characters (same hair colour, clothes, faces) and the paper-art style of the reference images exactly')
    jobs.append({'id': f'banner_{t}', 'kind': 'key', 'aspect': 'landscape 16:9', 'out': f'assets/raw/banner/{t}_banner.png', 'refs': refs, 'prompt': pr})
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_banner.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
