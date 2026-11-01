#!/usr/bin/env python3
"""tools/app/gen/jobs_<tale>.json 의 지정 id 들을 codex exec(image_gen)로 하나씩 생성 (참고 이미지 refs 지원). 이미 있으면 건너뜀.
  python3 tools/app/gen/run_simple.py kkultteok id1 id2 ..."""
import json, os, sys, subprocess, time, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from restyle import LIMIT_RE, wait_until
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
CODEX = os.path.expanduser('~/.npm-global/bin/codex')
tale, ids = sys.argv[1], sys.argv[2:]
jobs = {j['id']: j for j in json.load(open(os.path.join(G, f'tools/app/gen/jobs_{tale}.json')))}
for i in ids:
    j = jobs[i]; out = os.path.join(G, j['out'])
    if os.path.exists(out): print('skip', i); continue
    os.makedirs(os.path.dirname(out), exist_ok=True)
    pf = os.path.join(G, 'tools/app/gen/restyle', f'_p_{i}.txt'); open(pf, 'w').write(j['prompt'])
    asp = j.get('aspect') or ('square 1:1' if j['kind'] == 'sprite' else 'landscape 16:9')
    refs = ' '.join(r if r.startswith('/') else os.path.join(G, r) for r in j.get('refs', []))
    inst = (f"Use your image generation tool (image_gen.imagegen) to create ONE image, {asp}. Read the full prompt from {pf} and pass it VERBATIM. "
            + (f"Pass these reference images in referenced_image_paths (read-only): {refs} . " if refs else '')
            + f"Save (copy) the generated image to {out} . No other file changes, no installs, no git. Reply only SAVED or FAILED <reason>.")
    for attempt in range(200):  # 한도에 걸리면 풀리는 시각까지 기다렸다 같은 그림을 다시
        # 시간 초과면 codex 프로세스 묶음째 끈다 — subprocess.run(timeout) 은 node 껍데기만 죽이고 안쪽 codex 가 고아로 남아
        # 다음 그림들의 자리를 막았다(2026-11-01: 2시간 동안 한 장도 안 나옴). 끝나지 않은 그림은 FAIL 로 넘어가고 다음 id 를 그린다
        pr = subprocess.Popen([CODEX, 'exec', '-s', 'workspace-write', '--skip-git-repo-check', '-C', G, inst], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, start_new_session=True)
        try: so, se = pr.communicate(timeout=900)
        except subprocess.TimeoutExpired:
            try: os.killpg(pr.pid, 15)
            except Exception: pass
            so, se = pr.communicate(); so = (so or '') + ' TIMEOUT'
        txt = (so or '') + (se or '')
        if os.path.exists(out) or not LIMIT_RE.search(txt): break
        until = wait_until(txt); print(f'{datetime.datetime.now():%H:%M} 한도 → {until:%m-%d %H:%M} 까지 대기', flush=True)
        time.sleep(min(60 * 60, max(60, (until - datetime.datetime.now()).total_seconds())))  # 1시간마다 다시 시도
    print(i, 'ok' if os.path.exists(out) else 'FAIL ' + txt[-300:], flush=True)
    os.remove(pf)
