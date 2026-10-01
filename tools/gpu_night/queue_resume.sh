#!/bin/zsh
# 메모리 부족으로 멈춘 뒤 이어서: 해님달님 가족 나머지 5장 → 순무부터 나머지 동화 (이미 만든 그림은 건너뜀)
G=/Users/house_of_4k2b/projects/2026/patjuk-game
cd $G/tools/gpu_night
python3 run_night.py jobs_sm_family_rest.json --redo
echo "=== 해님달님 가족 끝 $(date '+%m-%d %H:%M') ==="
for t in turnip lion_mouse fox_crane goldilocks bremen ant_grasshopper ugly_duckling; do
  echo "=== $t 시작 $(date '+%m-%d %H:%M') ==="
  python3 run_night.py jobs_$t.json
  echo "=== $t 끝 $(date '+%m-%d %H:%M') ==="
done
echo "=== 모두 끝 $(date '+%m-%d %H:%M') ==="
