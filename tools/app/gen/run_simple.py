#!/usr/bin/env python3
"""tools/app/gen/jobs_<tale>.json 의 지정 id 들을 codex exec(image_gen)로 하나씩 생성 (참고 이미지 refs 지원). 이미 있으면 건너뜀.
  python3 tools/app/gen/run_simple.py kkultteok id1 id2 ..."""
import json, os, sys, subprocess
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
CODEX = os.path.expanduser('~/.npm-global/bin/codex')
tale, ids = sys.argv[1], sys.argv[2:]
jobs = {j['id']: j for j in json.load(open(os.path.join(G, f'tools/app/gen/jobs_{tale}.json')))}
for i in ids:
    j = jobs[i]; out = os.path.join(G, j['out'])
    if os.path.exists(out): print('skip', i); continue
    os.makedirs(os.path.dirname(out), exist_ok=True)
    pf = os.path.join(G, 'tools/app/gen/restyle', f'_p_{i}.txt'); open(pf, 'w').write(j['prompt'])
    asp = 'square 1:1' if j['kind'] == 'sprite' else 'landscape 16:9'
    refs = ' '.join(r if r.startswith('/') else os.path.join(G, r) for r in j.get('refs', []))
    inst = (f"Use your image generation tool (image_gen.imagegen) to create ONE image, {asp}. Read the full prompt from {pf} and pass it VERBATIM. "
            + (f"Pass these reference images in referenced_image_paths (read-only): {refs} . " if refs else '')
            + f"Save (copy) the generated image to {out} . No other file changes, no installs, no git. Reply only SAVED or FAILED <reason>.")
    r = subprocess.run([CODEX, 'exec', '-s', 'workspace-write', '--skip-git-repo-check', '-C', G, inst], capture_output=True, text=True, timeout=900)
    print(i, 'ok' if os.path.exists(out) else 'FAIL ' + (r.stdout + r.stderr)[-300:], flush=True)
    os.remove(pf)
