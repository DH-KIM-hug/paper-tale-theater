#!/bin/zsh
# 해님달님 본 그림(2c)이 끝나면 새까맣던 밤 배경 4장을 낮 그림으로 다시 (밤 색은 코드에서 입힌다) + 개구리 퀴즈 확대 3장·연잎
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "2c. 해님달님 끝" $G/assets/raw/queue_v4.log 2>/dev/null; do sleep 60; done
cd $G/tools/gpu_night && python3 run_night.py jobs_sm_day.json --redo  # 퀴즈·연잎은 이미 있던 이름이라 다시 뽑기 (예전 것은 _old로 보관)
echo "=== 해님달님 낮 배경 끝 $(date '+%H:%M') ==="
