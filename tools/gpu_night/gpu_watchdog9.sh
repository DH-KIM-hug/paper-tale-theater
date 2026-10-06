#!/bin/zsh
# 새 동화 9편 큐 감시: 2분마다 queue_tales9.sh 가 살아 있는지 보고, 멈춰 있으면 이어서 다시 시작(이미 만든 그림은 건너뜀). 실행: nohup tools/gpu_night/gpu_watchdog9.sh >/dev/null 2>&1 &
# 대기열이 "9편 모두 끝"에 닿으면 감시도 끝낸다.
G=/Users/house_of_4k2b/projects/2026/patjuk-game
LOG=$G/assets/raw/queue_tales9.log
WLOG=$G/assets/raw/gpu_watchdog9.log
while true; do
  if grep -q "=== 9편 모두 끝" $LOG 2>/dev/null; then echo "$(date '+%m-%d %H:%M') 모두 끝 — 감시 종료" >> $WLOG; exit 0; fi
  if ! pgrep -f "queue_tales9.sh" >/dev/null; then
    echo "$(date '+%m-%d %H:%M') 대기열이 멈춰 있음 → 다시 시작" >> $WLOG
    pkill -f "run_night.py" 2>/dev/null
    python3 -c "
import json, urllib.request
q = json.load(urllib.request.urlopen('http://127.0.0.1:8188/queue'))
d=[it[1] for it in q['queue_pending']]
d and urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:8188/queue', json.dumps({'delete':d}).encode(), {'Content-Type':'application/json'}))
q['queue_running'] and urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:8188/interrupt', b'{}', {'Content-Type':'application/json'}))
" 2>/dev/null
    nohup $G/tools/gpu_night/queue_tales9.sh >> $LOG 2>&1 &
  fi
  sleep 120
done
