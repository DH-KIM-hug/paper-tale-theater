#!/usr/bin/env python3
"""크리스마스 4편(호두까기 인형·크리스마스 전날 밤·진저브레드맨·구두장이와 요정) 제목 레터링 잡 — 2026-11-28.
다른 동화와 똑같은 두 가지를 만든다(글 틀은 기존 작업표의 빨간 암탉 항목에서 제목·콘셉트·줄 나눔만 바꿔 그대로 쓴다):
  ① 동화별 색지 레터링(카드·시작 화면): assets/raw/title2/<id>_title(_en).png → post: assets/thumbs/<id>_lt(_en).webp  (mk_jobs_title2.py 와 같은 글)
  ② 홈 배너 흰 레터링: assets/raw/title/<id>_title(_en).png → post: assets/banner/<id>_title(_en).webp            (mk_jobs_title.py 와 같은 글)
카탈로그(tales/catalog.js)에 아직 없는 동화라 기존 mk 스크립트로는 안 나와서 따로 만든다. 제목은 각 PLAN.md·index.html 의 공식 제목.
  python3 tools/app/gen/mk_jobs_title_xmas.py && python3 tools/app/gen/run_simple.py title_xmas <id> ..."""
import json, os
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
def job(f, i): return [j for j in json.load(open(f'{G}/tools/app/gen/{f}')) if j['id'] == i][0]
T1, T1E, T2, T2E = job('jobs_title.json', 'title_red_hen'), job('jobs_title_en.json', 'title_en_red_hen'), job('jobs_title2.json', 't2_red_hen'), job('jobs_title2_en.json', 't2en_red_hen')
RH_CONCEPT = 'Farm and golden wheat. Letters in hen red (#C8372D) and straw gold (#D9A94E); a small wheat-ear paper cut stalk leaning on the last syllable 탉, and a tiny red hen comb shape on top of 암.'

def sub(p, pairs):
    for a, b in pairs:
        assert p.count(a) == 1, (a, p.count(a)); p = p.replace(a, b)
    return p

# (id, 한국어 제목, 영어 제목, 색지 레터링 콘셉트)
X = [
 ('nutcracker', '호두까기 인형', 'The Nutcracker',
  'Christmas toy-soldier ballet. Letters alternate nutcracker-soldier red (#C8372D) and royal navy (#2F3E7A), with a few thin gold (#E3B23C) trim slivers laid across some letters like a soldier jacket braid; a tiny tall black soldier hat with a gold band perched on the syllable 호, and one small brown walnut piece at the end.'),
 ('night_before', '크리스마스 전날 밤', 'The Night Before Christmas',
  'Snowy Christmas Eve night. 크리스마스 in Santa red (#A93B32) and pine green (#3F6B4F) alternating, 전날 밤 in deep night indigo (#1F2A56); a small pearl-cream (#FBF3D5) full-moon circle behind the last syllable 밤, a tiny red Christmas stocking with a white cuff hanging from the line, and three small snow-white snowflake pieces.'),
 ('gingerbread', '진저브레드맨', 'The Gingerbread Man',
  'Fresh-baked Christmas cookie. Letters in ginger brown (#B5733A) and darker cocoa brown (#7A4A2A) alternating, with thin snow-white icing ZIGZAG strips laid across a few letters; two small round candy buttons (candy red #D8322E and candy green #4FA86B) beside the title and a tiny fir sprig with a red ribbon.'),
 ('elves_shoemaker', '구두장이와 요정', 'The Elves and the Shoemaker',
  'Cosy shoemaker workshop at night. 구두장이 in warm shoe-leather brown (#8A5232), 와 small in cream-brown, 요정 in elf leaf green (#4E9A44) and cherry red (#C8372D); a tiny red pointed elf cap on the syllable 요, and one small red shoe piece with a cream bow at the end.'),
]
jobs = []
for t, ko, en, concept in X:
    n = len(ko.replace(' ', ''))
    # ① 색지 레터링(mk_jobs_title2.py 와 같은 줄 나눔 규칙)
    l2 = 'Set it on one line.' if n <= 5 else 'Set it on two lines, breaking only at a space, centred.' if ' ' in ko else 'Set it on one line.'
    jobs.append({'id': f't2_{t}', 'kind': 'sprite', 'aspect': 'landscape 3:2', 'out': f'assets/raw/title2/{t}_title.png', 'refs': [],
                 'prompt': sub(T2['prompt'], [('"빨간 암탉"', f'"{ko}"'), (RH_CONCEPT, concept), ('Set it on one line.', l2)])})
    l2e = 'Set it on one line.' if len(en) <= 14 else 'Set it on two lines, breaking only between words, centred and balanced.' if len(en) <= 30 else 'Set it on two or three lines, breaking only between words, centred.'
    jobs.append({'id': f't2en_{t}', 'kind': 'sprite', 'aspect': 'landscape 3:2', 'out': f'assets/raw/title2/{t}_title_en.png', 'refs': [f'assets/raw/title2/{t}_title.png'],
                 'prompt': sub(T2E['prompt'], [('"The Little Red Hen"', f'"{en}"'), (RH_CONCEPT, concept), ('Set it on two lines, breaking only between words, centred and balanced.', l2e)])})
    # ② 홈 배너 흰 레터링(mk_jobs_title.py 와 같은 줄 나눔 규칙)
    l1 = 'Set it on one line.' if n <= 6 else 'Set it on two left-aligned lines, breaking only at a space, the first line slightly larger.'
    jobs.append({'id': f'title_{t}', 'kind': 'sprite', 'aspect': 'landscape 3:2', 'out': f'assets/raw/title/{t}_title.png', 'refs': [],
                 'prompt': sub(T1['prompt'], [('"빨간 암탉"', f'"{ko}"'), ('Set it on one line.', l1)])})
    l1e = 'Set it on one line.' if len(en) <= 14 else 'Set it on two left-aligned lines, breaking only between words, balanced in length.' if len(en) <= 30 else 'Set it on two or three left-aligned lines, breaking only between words.'
    jobs.append({'id': f'title_en_{t}', 'kind': 'sprite', 'aspect': 'landscape 3:2', 'out': f'assets/raw/title/{t}_title_en.png', 'refs': [],
                 'prompt': sub(T1E['prompt'], [('"The Little Red Hen"', f'"{en}"'), ('Set it on two left-aligned lines, breaking only between words, balanced in length.', l1e)])})
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_title_xmas.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
