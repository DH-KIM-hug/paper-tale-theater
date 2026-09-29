#!/bin/bash
# 대사가 바뀌면: 모든 동화의 녹음을 다시 맞춘다 (바뀐 문장만 새로 생성, 안 쓰는 클립은 지움).
#   tools/typecast/update_all.sh            # 전부
#   tools/typecast/update_all.sh frog rabbit # 몇 편만
# 대사 원본: 팥죽 = story.js(+gen_patjuk.py의 EXTRA), 나머지 = tales/<tale>/voice_script.json
# 동화 JS의 말풍선 문장을 고쳤다면 voice_script.json의 같은 문장도 함께 고쳐야 한다 (글자 하나까지 같아야 녹음이 나온다).
set -e
cd "$(dirname "$0")/../.."
TALES="$*"
[ -z "$TALES" ] && TALES="patjuk $(ls tales/*/voice_script.json | cut -d/ -f2 | tr '\n' ' ')"
for t in $TALES; do
  if [ "$t" = patjuk ]; then python3 tools/typecast/gen_patjuk.py | tail -1
  else python3 tools/typecast/gen_tale.py "$t" | tail -1; fi
done
curl -s -H "X-API-KEY: $(cat ~/.config/typecast/key)" https://api.typecast.ai/v1/users/me/subscription | python3 -c "import json,sys;c=json.load(sys.stdin)['credits'];print(f\"이번 달 사용: {c['used_credits']:,} / {c['plan_credits']:,}자\")"
