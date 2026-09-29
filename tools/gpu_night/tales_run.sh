#!/bin/zsh
# 새 동화 3편 애셋 (황소와 개구리 → 토끼와 거북이 → 햇님 달님)
G=/Users/house_of_4k2b/projects/2026/patjuk-game
cd $G/tools/gpu_night
for t in frog rabbit sunmoon; do
  echo "=== $t 시작 $(date '+%H:%M') ==="
  python3 run_night.py jobs_$t.json
done
echo "=== 모두 끝 $(date '+%H:%M') ==="
