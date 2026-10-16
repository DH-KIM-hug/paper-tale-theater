#!/usr/bin/env python3
"""S2 재생성 작업 파일 생성기: 동화별 배경·컷 → tools/gpu_night/restyle/jobs_<tale>_s2.json
원본 작업(tools/gpu_night/jobs_*.json)의 '내용' 문장만 가져와 S2 화풍 블록을 앞에 붙인다."""
import json, glob, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
GN = os.path.dirname(HERE)
GAME = os.path.dirname(os.path.dirname(GN))
STYLE_OLD = json.load(open(os.path.join(GN, 'style_base.json')))['STYLE']
# 참고 이미지: 원본을 줄인 사본(~/.paper-tale/refs/style_small). 원본(큰 세로 화면)을 4장 다 넣으면 ComfyUI가 메모리 부족으로 꺼진다.
REFS = ['/Users/house_of_4k2b/.paper-tale/refs/style_small/' + f for f in
        ['keyart_ref_fox.jpg', 'keyart_ref_campfire.jpg', 'keyart_ref_rabbit_shadow.jpg', 'cloud_factory_chimney_ref.jpg']]

FOX, CAMP, RABBIT = REFS[0], REFS[1], REFS[2]
BRIGHT_INTERIOR = ('kitchen', 'room', 'hall', 'parlor', 'hearth', 'bed', 'table', 'inside', 'living', 'cottage', 'morning', 'feast_day', 'barn', 'shop', 'mill')


def refs_for(name):
    """참고 이미지는 1장 (메모리: 2장이어도 ComfyUI가 43GB를 쓰며 스왑으로 장당 100분): 기본 여우, 밝은 낮 실내는 토끼 그림자"""
    n = name.lower()
    if any(k in n for k in BRIGHT_INTERIOR) and not any(k in n for k in ('night', 'lamp', 'dusk')):
        return [RABBIT]
    return [FOX]


S2 = ("Hand-cut layered cardstock paper art in the style of the reference images. Every shape is cut from colored cardstock "
      "with crisp clean edges, flat saturated colors with at most two tones per shape, no gradients, no outlines. "
      "Three to five depth layers stacked one in front of another (far sky and hills, middle shapes, foreground); each sheet sits slightly above the one behind it "
      "and casts a soft realistic drop shadow toward the lower right, light coming from the upper left. Fine paper grain over everything. "
      "Sky, hills and tree masses are cut as cloud-shaped scalloped sheets. Rich but uncluttered: two to four meaningful elements only. "
      "Objects, buildings and props have NO faces and NO eyes. No text.")
BG_TAIL = ("Full-bleed picture filling the entire image edge to edge, no round window, no frame, no border. No characters unless described. "
           "The picture runs all the way to all four edges: no white margin, no white background, no box, no cut-away stage; the sky sheets reach the top edge and the ground sheets reach the bottom edge, the scene fills the whole canvas. Keep the lower third open where characters stand; key objects within the central 60% of the width.")
CUT_HEAD = ("One warm picture-book illustration filling the entire image edge to edge, no frame, no border, kid-friendly and never scary. "
            "The characters have simple friendly faces (round dot eyes, small smile, pink cheeks); objects and props have no faces or eyes. ")
NEG_BASE = ("torn edges, painterly, gradient shading, gradient, 3D render, paper sculpture, origami, glossy, photorealistic, photograph, miniature model, "
            "text, letters, watermark, faces on objects, eyes on objects, wavy decorative bands, thick white outline, colored shadow, airbrushing, "
            "painted texture, felt, corrugated cardboard, perspective, depth of field")
NEG_BG = NEG_BASE + ", white background, white margin, diorama box, shadow box frame, stage, round window, frame, border, vignette, people, humans, animals, characters"
NEG_CUT = NEG_BASE + ", frame, border, vignette, scary, creepy"

PREFIX = {'patjuk': None, 'kkultteok': 'cf', 'rabbit': 'rab', 'lion_mouse': 'lm', 'sunmoon': 'sm', 'turnip': 'tn', 'goldilocks': 'gl',
          'ant_grasshopper': 'ag', 'bremen': 'br', 'cinderella': 'cd', 'fox_crane': 'fc', 'frog': 'frog', 'hansel': 'hg', 'heungbu': 'hb',
          'kongjwi': 'kj', 'magic_jar': 'mj', 'magpie': 'mg', 'red_hood': 'rh', 'sun_wind': 'sw', 'three_pigs': 'tp',
          'ugly_duckling': 'ud', 'wolf_goats': 'wg'}
ORDER = list(PREFIX)
# 원본 작업 이름이 웹피 이름과 다른 것: webp -> (원본 작업 이름, 추가 분위기 문장)
ALIAS = {
    'lm_cut_paw4': ('lm_cut_paw4a', ''),
    'sm_bg_backyard2_night': ('sm_bg_backyard2', 'It is night: deep blue sky with a pale moon and stars, warm lamp glow.'),
    'sm_bg_door2_lamp': ('sm_bg_door2', 'Night: a warm yellow lamp glows in the window, deep blue sky.'),
    'sm_bg_heaven_night': ('sm_bg_heaven', 'Night sky in heaven: deep blue with a pale moon and stars.'),
    'sm_bg_hill_dusk_gold': ('sm_bg_hill_dusk', 'Golden sunset light, warm amber sky.'),
    'sm_bg_hill_dusk_night': ('sm_bg_hill_dusk', 'It is night: deep blue sky, a pale moon and stars.'),
    'sm_bg_room2_lamp': ('sm_bg_room2', 'Night: a warm oil lamp glows in the room.'),
    'sm_bg_sorghum_dusk': ('sm_bg_sorghum', 'Dusk: orange-pink sky.'),
    'sm_bg_tree2_night': ('sm_bg_tree2', 'It is night: deep blue sky, a pale moon and stars.'),
    'sm_bg_well_top_night': ('sm_bg_well_top', 'It is night: deep blue sky, a pale moon and stars.'),
    'sm_cut_roar_night': ('sm_cut_roar', 'It is night, deep blue sky with a pale moon.'),
}
# 내용 문장을 직접 고친 것 (원본 문장에 '틀 기둥·앞 단' 같은 말이 있어 상자 모양 디오라마로 나온 경우)
OVERRIDE = {
    'scene_b_kitchen': ("the inside of a traditional Korean earthen kitchen at night seen straight on, the back clay wall filling the whole picture edge to edge: "
                        "a small wooden lattice window with moonlit indigo sky on the upper left, a thick dark ceiling beam across the very top edge, "
                        "two hanging shelves with cream meju blocks, a woven sieve and a gourd dipper on the right wall, a dark packed-earth floor filling the whole bottom third. "
                        "The left floor near the wall is open for a stove; the right wall has open space for a door. No stove, no door, no people."),
}
OVERRIDE['scene_c_yard_sea'] = (
    "a snowy winter night by the sea, one wide landscape that fills the whole picture from the top edge to the bottom edge: "
    "a deep indigo night sky with a small full moon with halo rings and stars across the top; snowy mountains and a small Korean village with tiny amber windows in the middle left; "
    "a short stone wall with an open brushwood gate at the left-center; in the bottom half a big snowy farmyard of packed brown earth on the left, a winding sandy path going down to the shore, "
    "and the moonlit sea with layered scalloped waves and a golden moon path on the right. The left third of the ground is open for a house to be placed.")
EXCLUDE = set()  # 이미 다른 실행기가 만드는 것 (kkultteok 배경)


def load_jobs():
    jobs = {}
    for f in sorted(glob.glob(os.path.join(GN, 'jobs_*.json')), key=os.path.getmtime):
        try:
            d = json.load(open(f))
        except Exception:
            continue
        for j in d:
            if isinstance(j, dict) and 'prompt' in j and 'name' in j:
                jobs[j['name']] = j
    return jobs


def cut_at(s, marks):
    k = len(s)
    for m in marks:
        i = s.find(m)
        if 0 <= i < k:
            k = i
    return s[:k].strip()


def bg_content(p):
    if 'Scene:' in p:
        s = p.split('Scene:')[-1]
    else:
        s = p[len(STYLE_OLD):] if p.startswith(STYLE_OLD[:100]) else p
    s = cut_at(s, ['A FULL-BLEED', 'FULL-BLEED', 'Colour mood', 'Color mood', ' No text', 'No characters', 'No lime'])
    return s


def cut_content(p):
    m = 'simple rounded shapes, never scary.'
    s = p.split(m, 1)[1] if m in p else p
    s = re.sub(r'Reference photos?:.*?(?=(CLOTHING|The |A |One ))', '', s, flags=re.S) if 'Reference photo' in s else s
    s = cut_at(s, ['Colour mood', 'Color mood', 'No text anywhere', 'Full-bleed illustration', 'No lime'])
    s = re.sub(r'designed from the reference photo\s*[—-]\s*', '', s)
    s = re.sub(r'[^.]*\b(?:reference photo|first reference|second reference)[^.]*\.', '', s)
    return s.strip()


def main():
    used = json.load(open(sys.argv[1]))  # {tale: [webp stems]}
    jobs = load_jobs()
    report = {}
    for tale in ORDER:
        names = used[tale]
        items = []
        for n in names:
            if tale == 'kkultteok' and '_bg_' in n:
                continue
            items.append(n)
        out = []
        for n in items:
            src, extra = ALIAS.get(n, (n, ''))
            j = jobs.get(src)
            if not j:
                print('MISSING job', tale, n, file=sys.stderr)
                continue
            is_cut = '_cut_' in n
            body = OVERRIDE.get(n) or (cut_content if is_cut else bg_content)(j['prompt'])
            if extra:
                body += ' ' + extra
            if is_cut:
                prompt = S2 + ' ' + CUT_HEAD + body
            else:
                prompt = S2 + ' Scene: ' + body + ' ' + BG_TAIL
            out.append({'name': n + '_s2', 'w': j['w'], 'h': j['h'], 'cfg': 3.0, 'key': False, 'refs': refs_for(n) if is_cut else [],
                        'negative': NEG_CUT if is_cut else NEG_BG, 'prompt': prompt})
        json.dump(out, open(os.path.join(HERE, f'jobs_{tale}_s2.json'), 'w'), ensure_ascii=False, indent=1)
        report[tale] = (sum(1 for o in out if '_cut_' not in o['name']), sum(1 for o in out if '_cut_' in o['name']))
    json.dump(report, open(os.path.join(HERE, 'counts.json'), 'w'))
    for t, (b, c) in report.items():
        print(t, b, c)
    print('total', sum(b for b, c in report.values()), sum(c for b, c in report.values()))


if __name__ == '__main__':
    main()
