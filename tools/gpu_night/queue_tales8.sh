#!/bin/zsh
# 해님달님까지(queue_v4.sh) 끝나면 나머지 8편 동화 그림을 차례로 (tools/gpu_night/ART_PLAN_2.md)
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "=== 모두 끝" $G/assets/raw/queue_v4.log 2>/dev/null; do sleep 60; done
cd $G/tools/gpu_night
for t in sun_wind turnip lion_mouse fox_crane goldilocks bremen ant_grasshopper ugly_duckling; do
  echo "=== $t 시작 $(date '+%m-%d %H:%M') ==="
  python3 run_night.py jobs_$t.json
  echo "=== $t 끝 $(date '+%m-%d %H:%M') ==="
done
echo "=== 8편 모두 끝 $(date '+%m-%d %H:%M') ==="
