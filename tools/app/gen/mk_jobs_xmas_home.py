#!/usr/bin/env python3
"""크리스마스 4편(호두까기 인형·크리스마스 전날 밤·진저브레드맨·구두장이와 요정) 홈 그림 잡 — 2026-11-28.
다른 동화와 같은 두 가지를 만든다(글 틀은 mk_jobs_banner.py · mk_jobs_thumb2.py 와 같다):
  ① 홈 배너(16:9, 꽉 찬 장면, 결말이 드러나지 않는 장면): assets/raw/banner/<id>_banner.png → post_banner.py → assets/banner/<id>.webp
  ② 목록 카드(3:2, 위 38% 비움):                          assets/raw/thumb2/<id>_tile.png  → post_thumb2.py → assets/thumbs/<id>_card.webp
카탈로그에 아직 없던 동화라 기존 mk 스크립트(카탈로그·S 표 기준)로는 안 나와서 따로 만든다.
참고 그림 = 시작 화면 가로 그림(_key_wide) + 동화 장면 인물 그림(assets/v3w, 같은 모습으로). 뒷표지(_back_*)는 결말이라 쓰지 않는다.
구두장이와 요정은 타일·세로 시작 그림에 새 옷 입은 요정(결말)이 있어 참고에서 뺀다. 배너 첫 판은 'barefoot … ONLY ragged cloth' 문구로 안전 필터에 막혀 '헌 회색 작업옷'으로 고쳤다(2026-11-28).
  python3 tools/app/gen/mk_jobs_xmas_home.py && python3 tools/app/gen/run_simple.py xmas_home banner_nutcracker th2_nutcracker ..."""
import json, os, subprocess, sys
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.insert(0, os.path.join(G, 'tools')); from rawpath import raw_exists
tpl = next(j for j in json.load(open(f'{G}/tools/app/gen/jobs_goldilocks.json')) if j['id'] == 'key5_backw')['prompt']

V = 'assets/v3w/'
# id: (배너 장면, 낮/밤, 카드 장면, 참고 그림(인물), 타일을 참고로 쓸지). 참고 그림은 image_gen 한도 5장 이하
S = {
 'nutcracker': (
  'Christmas Eve in a cosy living room beside a decorated Christmas tree: the kind old godfather (bald head with grey side hair, plum-purple long coat, exactly like the reference) bends forward and holds out the wooden nutcracker doll (tall navy-blue top hat, red soldier jacket with gold buttons, navy trousers, black boots) to the girl Clara (brown bob hair, cream blouse, peach apron, mauve skirt), who reaches for it with delight; her brother Fritz (curly brown hair, orange vest, navy trousers) peeks curiously from behind a red armchair. Snowy night outside the window.',
  'night',
  'Clara (brown bob hair, cream blouse, peach apron, mauve skirt) stands smiling beside the wooden nutcracker doll (tall navy-blue top hat, red soldier jacket, navy trousers) in front of a small decorated Christmas tree and a red armchair. The top part is a calm warm living-room wall with one window showing a snowy night.',
  ['nc_clara_receive', 'nc_doll_rest', 'nc_godfather_offer', 'nc_fritz_peek'], False),
 'night_before': (
  'A snowy Christmas Eve night: a cosy stone cottage with a snow-covered roof and a red brick chimney under a big pale full moon. A tiny sleigh pulled by eight tiny reindeer is just landing on the roof, and the small, plump, jolly Santa (white beard, red fur suit with white trim, a toy sack, exactly like the reference) waves from the sleigh. Below, through the open shuttered window, the father in a pale-blue nightshirt and red nightcap looks up in wonder. Stockings hang by the warm fireplace inside the other window. Santa is ARRIVING, not leaving.',
  'night',
  'On a snowy cottage roof beside a red brick chimney, the small plump jolly Santa (white beard, red fur suit with white trim) stands with his toy sack, and his little sleigh with a few tiny reindeer waits beside him. The top part is a calm deep-indigo night sky with a pale full moon at the far right edge and a few tiny stars.',
  ['nb_santa_stand_pack', 'nb_dad_stand', 'nb_deer_stand'], True),
 'gingerbread': (
  'Snowy countryside on Christmas Eve: the gingerbread man (ginger-brown cookie, white icing zigzags on arms and legs, red and green candy buttons, exactly like the reference) runs merrily along a snowy path toward the right, looking back over his shoulder with a cheeky grin, while grandma (white hair bun, blue shawl, purple dress, white apron) and grandpa (yellow knit hat, white beard, green vest, brown trousers) hurry after him with outstretched arms. A red barn and snowy fir trees far behind. NO fox in this picture.',
  'day',
  'The gingerbread man (ginger-brown cookie, white icing zigzags, red and green candy buttons) runs merrily across a snowy field toward the right, looking back with a cheeky grin, while grandma (white bun, blue shawl, purple dress) and grandpa (yellow knit hat, white beard, green vest) chase after him with outstretched arms. NO fox. The top part is a calm pale winter sky with a faint line of snowy hills at the far edges.',
  ['gb_man_run_lookback', 'gb_granny_reach_run', 'gb_grandpa_reach_run'], True),
 'elves_shoemaker': (
  "Inside the small shoemaker's workshop on a snowy winter night lit by one candle on the workbench: two little elf children dressed in simple patched grey work tunics (a boy with messy blond hair and a girl with curly brown hair tied with red ribbons, exactly like the references) sit on the workbench busily stitching and tapping a brown leather shoe, while the shoemaker (grey hair and beard, cream shirt, brown leather apron) and his wife (red headscarf, green dress, cream apron) peek out in surprise from behind a hanging curtain at the side. Shoe shelves on the wall, a window showing a snowy night village. The elves still wear their old patched grey tunics (no new clothes yet).",
  'night',
  'Two little barefoot elves wearing ONLY ragged grey cloth tunics (a boy with messy blond hair and a girl with curly brown hair tied with red ribbons) sit on the shoemaker workbench happily stitching a brown leather shoe beside a lit candle, spools of thread and leather pieces. The elves have NO new clothes. The top part is a calm warm wooden workshop wall with one arched window showing a snowy night.',
  ['es_ea_stand', 'es_eb_stand', 'es_sm_hide_peek', 'es_wf_hide_peek'], False),
}

COMP = ("A landscape 16:9 home-screen banner picture that fills the WHOLE canvas edge to edge: a full-bleed rectangular paper diorama scene "
        "(no cream sheet, no window, no border, no frame, no ornaments around it). Only 3 or 4 flat paper depth planes. It shows an inviting moment from the story "
        "that does NOT reveal how the story ends (no ending, no resolution, no reward, no final happy reunion): {scene} Keep the main characters large and inside the CENTRAL area of the picture, well away from every edge "
        "(the picture will be cropped a little on all sides). Keep the LOWER-LEFT third and the LOWER-RIGHT corner calm and simple (plain ground, floor or snow, "
        "no faces, no important objects) because a title and a button will be placed there. Keep the background very simple with one or two elements, "
        "no tiny details; faces clearly visible.")
a, b = tpl.split('COMPOSITION (most important):\n', 1)
b = b.split('\n\n', 1)[1]

P = """Use case: children's picture-book app home-screen card thumbnail (ages 3-4), layered paper-cut collage art.
Reference images: pictures and character sprites from the tale "{title}". Keep the SAME characters with the SAME designs, colours, outfits, faces and paper-art style, and the same setting and palette. Characters are layered coloured-paper cut pieces with faces; props have no faces.
Scene: {scene}
Primary request: compose a fresh 3:2 picture with clear empty space at the top for a title lettering that will be added later:
- The TOP 38% of the picture is calm, simple background only (sky, wall, night sky, etc. that belongs to the scene): no faces, no heads, no characters, no busy objects, no text there. A moon, a few soft clouds or a distant hill line at the far edges are fine.
- The characters stand in the LOWER 62%, large and clearly visible, heads below the 40% line, faces turned toward the viewer, friendly expressions.
- Keep every character and important object inside the central 88% of the width (the sides will be cropped to 4:3).
- It must NOT reveal how the story ends.
Style: flat matte coloured paper, one colour per piece, fine paper-fibre texture, soft short dark warm shadows between layers only; no gloss, no gradients inside pieces, no outlines, no photo textures. No text, no letters, no logos, no frame, no border."""
TITLE = {'nutcracker': '호두까기 인형', 'night_before': '크리스마스 전날 밤', 'gingerbread': '진저브레드맨', 'elves_shoemaker': '구두장이와 요정'}

os.makedirs(f'{G}/assets/raw/banner/refs', exist_ok=True)
def png_ref(src, dst):
    if not raw_exists(f'{G}/{dst}'):
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{G}/{src}', f'{G}/{dst}'], check=True)
    return dst

jobs = []
for t, (scene, tod, card, chars, use_tile) in S.items():
    refs = [png_ref(f'assets/thumbs/{t}_key_wide.webp', f'assets/raw/banner/refs/{t}_key_wide.png')]
    if use_tile: refs.append(png_ref(f'assets/thumbs/{t}_tile.webp', f'assets/raw/banner/refs/{t}_tile.png'))
    refs += [png_ref(f'{V}{c}.webp', f'assets/raw/banner/refs/{c}.png') for c in chars]
    pr = a + 'COMPOSITION (most important):\n' + COMP.format(scene=scene) + '\n\n' + b
    pr = pr.replace('from the upper-left (warm sunset daylight)', 'from the upper-left (soft winter daylight)' if tod == 'day' else 'from the upper-right (soft moonlight with a warm lamp and candle glow)')
    pr = pr.replace('Match the characters in the reference images exactly', 'Match the characters (same hair colour, clothes, faces, head size) and the paper-art style of the reference images exactly')
    jobs.append({'id': f'banner_{t}', 'kind': 'key', 'aspect': 'landscape 16:9', 'out': f'assets/raw/banner/{t}_banner.png', 'refs': refs, 'prompt': pr})
    jobs.append({'id': f'th2_{t}', 'kind': 'bg', 'aspect': 'landscape 3:2', 'out': f'assets/raw/thumb2/{t}_tile.png', 'refs': refs,
                 'prompt': P.format(title=TITLE[t], scene=card)})
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_xmas_home.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
