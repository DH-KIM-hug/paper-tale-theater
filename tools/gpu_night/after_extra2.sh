#!/bin/zsh
# 자라 컷 → 팥죽할멈 불량 16장 다시 뽑기(종이 더미 받침 문제) → 새 동화 3편
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "=== 추가 작업 끝" $G/assets/raw/extra.log 2>/dev/null; do sleep 60; done
cd $G/tools/gpu_night
echo "=== 다시 뽑기 16장 시작 $(date '+%H:%M') ==="
python3 run_night.py jobs_redo1.json --redo
for t in frog rabbit sunmoon; do
  echo "=== $t 시작 $(date '+%H:%M') ==="
  python3 run_night.py jobs_$t.json
done
echo "=== 모두 끝 $(date '+%H:%M') ==="
