#!/bin/zsh
# 동화 그림 대기열(queue_resume)이 "모두 끝"나면 SVG 남은 것 바꿀 그림(jobs_svg.json, 102장)을 뽑는다.
# 중간에 꺼져도 다시 돌면 이미 만든 그림은 건너뛴다. 실행: nohup tools/gpu_night/svg_after.sh >/dev/null 2>&1 &
G=/Users/house_of_4k2b/projects/2026/patjuk-game
until grep -q "=== 모두 끝" $G/assets/raw/queue_resume.log 2>/dev/null; do sleep 120; done
cd $G/tools/gpu_night
for i in 1 2 3; do python3 run_night.py jobs_svg.json >> $G/assets/raw/svg.log 2>&1; done   # 시간 초과로 빠진 것까지 두어 번 더
echo "=== SVG 그림 끝 $(date '+%m-%d %H:%M') ===" >> $G/assets/raw/svg.log
