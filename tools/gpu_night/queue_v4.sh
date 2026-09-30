#!/bin/zsh
# 순서(사용자): 라이트 썸네일(v4, 동화 컨셉 모양) → 동화 그림(초록 캐릭터 → 색 거슬린 배경 → 해님달님) → 다크 썸네일(v4)
G=/Users/house_of_4k2b/projects/2026/patjuk-game
PY=/Users/house_of_4k2b/.venvs/paper-tale/bin/python
cd $G/tools/gpu_night
publish() {
  cd $G && $PY tools/gpu_night/make_thumbs.py >/dev/null && git add assets/thumbs && \
  git -c user.name=DH-KIM-hug -c user.email=258762612+DH-KIM-hug@users.noreply.github.com commit -q -m "$1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01TGgx6k6hUQMHacUcyCA6Jo" && git push -q; cd $G/tools/gpu_night
}
one() {  # $1 = 작업 파일, $2 = 이름 → 한 장만 뽑는다
  python3 -c "import json,sys;json.dump([j for j in json.load(open('$1')) if j['name']=='$2'],open('/tmp/one_job.json','w'))"
  python3 run_night.py /tmp/one_job.json
}
echo "=== 1. 라이트 썸네일 v4 시작 $(date '+%H:%M') ==="
for n in $(python3 -c "import json;print(' '.join(j['name'] for j in json.load(open('jobs_thumb4L.json'))))"); do
  one jobs_thumb4L.json $n && publish "라이트 모드 썸네일(동화 컨셉 모양): ${n#thumb4L_}"
done
echo "=== 2. 동화 그림 시작 $(date '+%H:%M') ==="
python3 run_night.py jobs_green_redo.json --redo
echo "=== 2a. 초록 캐릭터 끝 $(date '+%H:%M') ==="
python3 run_night.py jobs_bg_redo.json --redo
echo "=== 2b. 배경 다시 뽑기 끝 $(date '+%H:%M') ==="
python3 run_night.py jobs_sunmoon.json
echo "=== 2c. 해님달님 끝 $(date '+%H:%M') ==="
echo "=== 3. 다크 썸네일 v4 시작 $(date '+%H:%M') ==="
for n in $(python3 -c "import json;print(' '.join(j['name'] for j in json.load(open('jobs_thumb4D.json'))))"); do
  one jobs_thumb4D.json $n && publish "다크 모드 썸네일(동화 컨셉 모양): ${n#thumb4_}"
done
echo "=== 모두 끝 $(date '+%H:%M') ==="
