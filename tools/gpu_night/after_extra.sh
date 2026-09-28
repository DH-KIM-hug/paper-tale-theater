#!/bin/zsh
# 자라 컷 작업이 끝나면 새 동화 3편 애셋을 차례로 생성 (황소와 개구리 → 토끼와 거북이 → 햇님 달님)
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "=== 추가 작업 끝" $G/assets/raw/extra.log 2>/dev/null; do sleep 60; done
cd $G/tools/gpu_night
for t in frog rabbit sunmoon; do
  echo "=== $t 시작 $(date '+%H:%M') ==="
  python3 run_night.py jobs_$t.json
done
echo "=== 동화 3편 모두 끝 $(date '+%H:%M') ==="
