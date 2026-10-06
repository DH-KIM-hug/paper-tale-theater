#!/bin/zsh
# 새 동화 9편 그림을 차례로 (tools/gpu_night/ART_PLAN_3.md). 파일럿(jobs_pilot3.json) 확인 뒤에 돌린다.
G=/Users/house_of_4k2b/projects/2026/patjuk-game
cd $G/tools/gpu_night
for t in three_pigs wolf_goats red_hood magic_jar heungbu kongjwi magpie hansel cinderella; do
  echo "=== $t 시작 $(date '+%m-%d %H:%M') ==="
  python3 run_night.py jobs_$t.json
  echo "=== $t 끝 $(date '+%m-%d %H:%M') ==="
done
echo "=== 9편 모두 끝 $(date '+%m-%d %H:%M') ==="
