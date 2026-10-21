#!/bin/sh
# 새 동화 컷 그림 큐: 동화마다 순서대로 생성 → 4:3 후처리. 한도에 걸리면 run_simple 이 기다렸다 이어 간다.
cd "$(dirname "$0")/../../.."
for t in beauty_beast little_mermaid snow_white frog_prince princess_pea rapunzel red_car sleeping_beauty; do
  ids=$(python3 - "$t" <<'PY'
import json,os,sys
t=sys.argv[1]
for j in json.load(open(f'tools/app/gen/jobs_{t}.json')):
    if j.get('kind')=='cut' and not os.path.exists(f"assets/v3w/{j['id']}.webp"): print(j['id'])
PY
)
  [ -z "$ids" ] && continue
  echo "== $t $(echo $ids | wc -w)장" >> tools/app/gen/restyle/cut_queue.log
  python3 tools/app/gen/run_simple.py $t $ids >> tools/app/gen/restyle/cut_queue.log 2>&1
  $HOME/.venvs/paper-tale/bin/python tools/app/gen/post_cuts.py $t >> tools/app/gen/restyle/cut_queue.log 2>&1
done
echo DONE >> tools/app/gen/restyle/cut_queue.log
