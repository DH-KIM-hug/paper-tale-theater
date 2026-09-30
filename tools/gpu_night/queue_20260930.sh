#!/bin/zsh
# 2026-09-30 사용자가 정한 순서: 라이트 모드 썸네일 → 동화 그림 → 다크 모드 썸네일
# 썸네일이 끝날 때마다 홈용으로 다듬어(make_thumbs.py) 바로 올린다.
G=/Users/house_of_4k2b/projects/2026/patjuk-game
PY=/Users/house_of_4k2b/.venvs/paper-tale/bin/python
cd $G/tools/gpu_night
publish() {
  cd $G && $PY tools/gpu_night/make_thumbs.py && git add assets/thumbs && \
  git -c user.name=DH-KIM-hug -c user.email=258762612+DH-KIM-hug@users.noreply.github.com commit -q -m "$1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01TGgx6k6hUQMHacUcyCA6Jo" && git push -q; cd $G/tools/gpu_night
}
echo "=== 1. 라이트 썸네일 시작 $(date '+%H:%M') ==="
# 한 장씩 뽑고 바로 올린다 (홈에서 하나씩 바뀌어 보이게)
for n in $(python3 -c "import json;print(' '.join(j['name'] for j in json.load(open('jobs_thumb3L.json'))))"); do
  [ -f $G/assets/raw/v3/$n.png ] && continue
  python3 -c "import json;json.dump([j for j in json.load(open('jobs_thumb3L.json')) if j['name']=='$n'],open('/tmp/one_job.json','w'))"
  python3 run_night.py /tmp/one_job.json && publish "라이트 모드 썸네일: ${n#thumb3L_}"
done
echo "=== 2. 동화 그림 시작 $(date '+%H:%M') ==="
# 초록 캐릭터(개구리·거북이) 마젠타 배경으로 다시 → 개구리·토끼 그림 교체를 먼저 끝낼 수 있게
python3 run_night.py jobs_green_redo.json --redo
echo "=== 2a. 초록 캐릭터 끝 $(date '+%H:%M') ==="
for t in sunmoon; do python3 run_night.py jobs_$t.json; done
echo "=== 2b. 해님달님 끝 $(date '+%H:%M') ==="
echo "=== 3. 다크 썸네일 시작 $(date '+%H:%M') ==="
python3 run_night.py jobs_thumb3D.json && publish "다크 모드 썸네일 21편"
echo "=== 모두 끝 $(date '+%H:%M') ==="
