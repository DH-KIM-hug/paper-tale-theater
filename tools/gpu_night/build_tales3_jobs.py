#!/usr/bin/env python3
"""새 동화 9편 페이퍼아트 애셋 목록 → jobs_three_pigs.json … jobs_magic_jar.json, jobs_pilot3.json
근거: TALES_PLAN_2.md 각 편의 N-2 장면 구성·N-4 애셋 개요, build_tales2_jobs.py 의 규칙(HEX 금지 · 밝은 밤 · 초록은 마젠타 · 띠 소품 금지).
실제 정의는 tales3_a.py(돼지·염소·빨간 모자) / tales3_b.py(콩쥐·헨젤) / tales3_c.py(신데렐라·흥부) / tales3_d.py(까치·요술 항아리).
순서: 배경 → 주인공·주요 자세 → 조연·소품 → 컷. 돼지 삼형제는 맨 앞 3장이 파일럿(초원 · 늑대 · 막내 돼지)."""
import json, os
from tales3_d import *
import tales3_a, tales3_b, tales3_c, tales3_d

PILOT = ['tp_bg_meadow', 'tp_wolf_walk', 'tp_pig3_base']

def order(jobs):
    head = [j for n in PILOT for j in jobs if j['name'] == n]
    return head + [j for j in jobs if j['name'] not in PILOT]

TALES3 = [('three_pigs', order(three_pigs)), ('wolf_goats', wolf_goats), ('red_hood', red_hood), ('magic_jar', magic_jar),
          ('heungbu', heungbu), ('kongjwi', kongjwi), ('magpie', magpie), ('hansel', hansel), ('cinderella', cinderella)]

if __name__ == '__main__':
    seen, total, mins_all = {}, 0, 0
    for fn in os.listdir(HERE):
        if fn.startswith('jobs_') and fn.endswith('.json') and not fn.startswith(('jobs_pilot3',)):
            try: [seen.setdefault(j['name'], fn) for j in json.load(open(os.path.join(HERE, fn)))]
            except Exception: pass
    for name, jobs in TALES3:
        for j in jobs:
            assert j['name'] not in seen or seen[j['name']] == f'jobs_{name}.json', f"이름 겹침 {j['name']} ({seen[j['name']]})"
            assert '#' not in j['prompt'].replace('#FF00FF', '').replace('#7CFC00', ''), f"HEX 코드: {j['name']}"
            seen[j['name']] = f'jobs_{name}.json'
        json.dump(jobs, open(os.path.join(HERE, f'jobs_{name}.json'), 'w'), ensure_ascii=False, indent=1)
        bg = sum(j['w'] == 1760 and not j['key'] for j in jobs)
        ct = sum(j['w'] == 1024 and j['h'] == 768 for j in jobs)
        pr = len(jobs) - bg - ct
        mins = bg * 17 + (pr + ct) * 10
        print(f"{name:12s} {len(jobs):3d}  (배경 {bg}, 캐릭터·소품 {pr}, 컷 {ct})  약 {mins/60:.1f}시간")
        total += len(jobs); mins_all += mins
    pilot = [j for j in three_pigs if j['name'] in PILOT]
    json.dump(order(pilot), open(os.path.join(HERE, 'jobs_pilot3.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'합계 {total}장, 약 {mins_all/60:.0f}시간 ({mins_all/60/8:.1f}밤)')
