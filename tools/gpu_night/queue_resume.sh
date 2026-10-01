#!/bin/zsh
# 이어서 돌리기 (몇 번을 다시 시작해도 안전): 해님달님 가족 중 아직 새로 안 뽑은 것 → 순무부터 나머지 동화 (이미 만든 그림은 건너뜀)
G=/Users/house_of_4k2b/projects/2026/patjuk-game
cd $G/tools/gpu_night
# 2026-10-01 10:00 이후에 다시 뽑은 가족 그림은 건너뛴다
python3 - <<'PY'
import json, os, datetime
cut = datetime.datetime(2026, 10, 1, 10, 0).timestamp()
raw = '/Users/house_of_4k2b/projects/2026/patjuk-game/assets/raw/v3/'
d = [j for j in json.load(open('jobs_sm_family.json')) if not (os.path.exists(raw + j['name'] + '.png') and os.path.getmtime(raw + j['name'] + '.png') > cut)]
json.dump(d, open('/tmp/sm_family_todo.json', 'w'), ensure_ascii=False)
print('가족 남은 것:', [j['name'] for j in d])
PY
[ "$(python3 -c "import json;print(len(json.load(open('/tmp/sm_family_todo.json'))))")" != 0 ] && python3 run_night.py /tmp/sm_family_todo.json --redo
echo "=== 해님달님 가족 끝 $(date '+%m-%d %H:%M') ==="
for t in turnip lion_mouse fox_crane goldilocks bremen ant_grasshopper ugly_duckling; do
  echo "=== $t 시작 $(date '+%m-%d %H:%M') ==="
  python3 run_night.py jobs_$t.json
  echo "=== $t 끝 $(date '+%m-%d %H:%M') ==="
done
echo "=== 모두 끝 $(date '+%m-%d %H:%M') ==="
