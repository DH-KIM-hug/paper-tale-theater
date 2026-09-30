#!/bin/zsh
# 초록 캐릭터가 끝나면(동화 그림 단계 안에서) 색이 거슬린 배경 3장 다시: 개구리 연못·풀밭, 토끼 잔치
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "2a. 초록 캐릭터 끝" $G/assets/raw/queue_0930.log 2>/dev/null; do sleep 60; done
cd $G/tools/gpu_night && python3 run_night.py jobs_bg_redo.json --redo
echo "=== 배경 다시 뽑기 끝 $(date '+%H:%M') ==="
