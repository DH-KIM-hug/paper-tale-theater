#!/bin/zsh
# 한 번에 하나씩: 구름 공장 구름(run_simple)이 끝나면 동화 재생성 하나만 이어서 돌린다
cd /Users/house_of_4k2b/projects/2026/patjuk-game
while pgrep -f "run_simple.py kkultteok" >/dev/null; do sleep 30; done
echo "$(date '+%H:%M') 구름 끝 → 동화 재생성 시작" >> tools/app/gen/restyle/runner.out
exec python3 -u tools/app/gen/restyle.py run >> tools/app/gen/restyle/runner.out 2>&1
