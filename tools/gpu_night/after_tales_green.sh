#!/bin/zsh
# 동화 3편 작업이 끝나면: 초록 캐릭터 13장을 마젠타 배경으로 다시 뽑기
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "=== 모두 끝" $G/assets/raw/tales.log 2>/dev/null; do sleep 60; done
cd $G/tools/gpu_night && python3 run_night.py jobs_green_redo.json --redo
echo "=== 초록 캐릭터 다시 뽑기 끝 $(date '+%H:%M') ==="
