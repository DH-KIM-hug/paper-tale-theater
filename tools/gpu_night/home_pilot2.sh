#!/bin/zsh
# 배경 벽이 끝나면 예전 시범(무대 틀)을 멈추고 썸네일 2장 + 아이콘 1장 시범
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "\[home_wall\] 완료" $G/assets/raw/home_pilot.log 2>/dev/null; do sleep 20; done
pkill -f "run_night.py jobs_home_pilot.json"; sleep 3
python3 - <<'PY'
import json, urllib.request
q = json.load(urllib.request.urlopen('http://127.0.0.1:8188/queue'))
ids = [it[1] for it in q.get('queue_pending', []) if 'home_stage_frame' in json.dumps(it[2])]
if ids:
    urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:8188/queue', json.dumps({'delete': ids}).encode(), {'Content-Type': 'application/json'}))
print('removed pending', ids)
PY
cd $G/tools/gpu_night
python3 run_night.py jobs_thumb_pilot.json
python3 run_night.py jobs_icon_pilot.json
echo "=== 홈 시범 끝 ==="
