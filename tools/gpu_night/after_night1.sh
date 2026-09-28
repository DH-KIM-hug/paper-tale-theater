#!/bin/zsh
# 1일차 밤 작업(night1.sh)이 끝나면 이어서 추가 작업을 돈다: 자라 컷 2장(입을 무는 그림)
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "=== 모두 끝" $G/assets/raw/night1.log 2>/dev/null; do sleep 60; done
echo "=== 추가 작업 시작 $(date '+%H:%M') ==="
cd $G/tools/gpu_night && python3 run_night.py jobs_extra.json --redo
echo "=== 추가 작업 끝 $(date '+%H:%M') ==="
