#!/bin/zsh
# 1) 해님달님 낮 배경 4장 + 얼굴 없는 연잎 + 토끼 1등 컷  2) 나머지 8편 동화 그림
G=/Users/house_of_4k2b/projects/2026/patjuk-game
cd $G/tools/gpu_night
python3 run_night.py jobs_sm_day.json --redo
echo "=== 해님달님 낮 배경 등 끝 $(date '+%m-%d %H:%M') ==="
for t in sun_wind turnip lion_mouse fox_crane goldilocks bremen ant_grasshopper ugly_duckling; do
  echo "=== $t 시작 $(date '+%m-%d %H:%M') ==="
  python3 run_night.py jobs_$t.json
  echo "=== $t 끝 $(date '+%m-%d %H:%M') ==="
done
echo "=== 8편 모두 끝 $(date '+%m-%d %H:%M') ==="
