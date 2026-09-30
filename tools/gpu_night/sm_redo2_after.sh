#!/bin/zsh
# 해님달님 낮 배경 등이 끝나면, 이상하게 나온 해님달님 그림 7장 다시 (8편과 번갈아 돈다)
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "해님달님 낮 배경 등 끝" $G/assets/raw/queue_after_sm.log 2>/dev/null; do sleep 60; done
cd $G/tools/gpu_night && python3 run_night.py jobs_sm_redo2.json --redo
echo "=== 해님달님 다시 뽑기 2 끝 $(date '+%m-%d %H:%M') ==="
