#!/bin/bash
# S2 재생성 대기열: 동화별 작업 파일을 우선순위대로 하나씩 실행 (실행기 1개만). 이어하기 안전(이미 만든 장은 run_night.py가 건너뜀).
# 사용: nohup tools/gpu_night/restyle/run_queue.sh > /dev/null 2>&1 &
HERE="$(cd "$(dirname "$0")" && pwd)"
GAME="$(cd "$HERE/../../.." && pwd)"
LOG="$GAME/assets/raw/restyle_queue.log"
LOCK="$GAME/assets/raw/restyle_queue.lock"
mkdir -p "$GAME/assets/raw"
if [ -f "$LOCK" ] && kill -0 "$(cat "$LOCK" 2>/dev/null)" 2>/dev/null; then echo "이미 실행 중 (pid $(cat "$LOCK"))" >&2; exit 1; fi
echo $$ > "$LOCK"
trap 'rm -f "$LOCK"' EXIT
TALES="patjuk kkultteok rabbit lion_mouse sunmoon turnip goldilocks ant_grasshopper bremen cinderella fox_crane frog hansel heungbu kongjwi magic_jar magpie red_hood sun_wind three_pigs ugly_duckling wolf_goats"
cd "$GAME"
for t in $TALES; do
  J="$HERE/jobs_${t}_s2.json"
  [ -f "$J" ] || continue
  # 같은 동화를 최대 5번: 이미 만든 장은 건너뛰므로 ComfyUI가 꺼졌다 켜져도 빠진 장만 이어서 만든다
  for try in 1 2 3 4 5; do
    until curl -sf -m 5 http://127.0.0.1:8188/queue >/dev/null 2>&1; do sleep 60; done   # ComfyUI가 뜰 때까지 기다림
    echo "[$(date +%H:%M:%S)] 시작 $t (시도 $try)" >> "$LOG"
    python3 "$GAME/tools/gpu_night/run_night.py" "$J" >> "$GAME/assets/raw/restyle_${t}.log" 2>&1
    rc=$?
    echo "[$(date +%H:%M:%S)] 끝 $t (종료코드 $rc)" >> "$LOG"
    [ $rc -eq 0 ] && break
    sleep 30
  done
done
echo "[$(date +%H:%M:%S)] 전체 끝" >> "$LOG"
