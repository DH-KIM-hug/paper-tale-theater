#!/bin/bash
# 앱에 넣을 파일만 www/ 로 복사한다 (www/ 는 커밋하지 않음)
set -e
cd "$(dirname "$0")/../.."
rm -rf www && mkdir -p www/assets
cp index.html bedtime.html bedtime.js home_narration_el.js home.js home.css stage.js stage.css entitlements.js audio.js narration_tc.js story.js privacy.html www/   # privacy.html = 보호자 영역 '정보'의 앱 안 문서
sed -i '' '/<script src="review.js/d' www/index.html   # 검수용 review.js(?review=1 전용)는 앱에 넣지 않는다 (2026-11-02 출시 점검)
# 개발용: 원고 초안·ASP 표(*.txt)·sed 백업(*-e)·맞춤 확인 페이지(_*.html)·꿀떡이 원고(source/)·녹음 생성 입력(voice_script*.json)·안 읽는 표(sfx_types.json, tiles.json, 백설공주 narration_tc.js, 옛 썸네일 patjuk.png)는 넣지 않는다 (2026-11-02 출시 점검)
for d in engine tales sounds; do rsync -a --exclude='*.md' --exclude='*.py' --exclude='__pycache__' --exclude='.DS_Store' --exclude='*.txt' --exclude='*-e' --exclude='_*.html' --exclude='tales/kkultteok/source' --exclude='kkultteok/source' --exclude='voice_script*.json' --exclude='sfx_types.json' --exclude='snow_white/narration_tc.js' "$d" www/; done
# v3w 그림은 코드가 한 번도 부르지 않는 것(옛 자세·옛 배경·시험 그림)을 뺀다 (2026-11-04 용량 줄이기). 목록 기준은 tools/app/unused_v3w.mjs (규칙 설명은 그 파일 머리). 원본 assets/v3w 는 그대로
node tools/app/unused_v3w.mjs > www/.v3w_raw && sed 's#^#/v3w/#' www/.v3w_raw > www/.v3w_exclude
for d in fonts home icons thumbs thumb ui v3w stickers banner stage; do   # stage = 스티커북 내 무대 배경(2026-11-06). banner = 홈 맨 위 추천 배너(2026-11-02 출시 점검: 빠져 있어 앱 홈 배너가 404)
   [ -d assets/$d ] && rsync -a --exclude='.DS_Store' --exclude='*_raw.png' --exclude='thumb/patjuk.png' --exclude='tiles.json' $([ "$d" = v3w ] && echo --exclude-from=www/.v3w_exclude) assets/$d www/assets/; done
rm -f www/.v3w_exclude www/.v3w_raw
# 이름 바꾸기(2026-11-06, docs/NAME_CHANGE_PLAN.md): engine/name_form.js(받침 함수)·engine/names.js(기기 파일 덮어쓰기·보호자 화면 도우미)는 위 engine 복사와 아래 engine/*.js 줄이기에 함께 들어간다. 빠지면 앱에서 이름 바꾸기가 조용히 꺼지므로 확인한다. 녹음 파일은 기기(Filesystem Directory.Data/names)에만 생기고 www 에는 없다
for f in engine/name_form.js engine/names.js; do [ -f "www/$f" ] || { echo "빠짐: www/$f"; exit 1; }; done
cp sounds/CREDITS.md www/sounds/CREDITS.txt   # 앱에는 *.md 를 넣지 않으므로 .txt 로 복사: 보호자 영역 '정보' > 그림·소리 출처가 읽는다
# 녹음: el = 기본 목소리(ElevenLabs), tc = Typecast(el 에 없는 줄만), bremen = 브레멘 음악대 소리
mkdir -p www/audio && node tools/app/used_audio.mjs > www/.audio_list && rsync -a --files-from=www/.audio_list audio/ www/audio/ && rm www/.audio_list && python3 tools/app/shrink_audio.py www/audio   # 64kbps 모노로 다시 압축(원본 128~320k, ~/.paper-tale/cache/audio64 에 보관). 녹음은 실제로 쓰는 것만(2026-11-02): ElevenLabs 에 덮인 Typecast 클립·오디션·옛 곡은 빠진다. 목록 기준은 tools/app/used_audio.mjs
# 영어 녹음은 위 shrink_audio 가 0.9배로 미리 늘려 두었다 → 앱의 audio.js 는 재생할 때 늘리지 않는다
sed -i '' 's/const EN_PRESLOWED = false;/const EN_PRESLOWED = true;/' www/audio.js && grep -q 'const EN_PRESLOWED = true;' www/audio.js
# 연결 서버 주소 넣기(2026-11-06): 환경 변수 PAPERTALE_API_BASE 가 있으면 그 값, 없으면 tools/app/server.env. 비어 있으면 동기화 꺼짐 그대로(웹 공개판은 이 스크립트를 쓰지 않으므로 항상 꺼짐). 최소화 전에 넣는다
API_BASE_VAL="${PAPERTALE_API_BASE:-$(grep -E '^PAPERTALE_API_BASE=' tools/app/server.env 2>/dev/null | head -1 | cut -d= -f2- | tr -d ' \r"'"'"'')}"
API_BASE_VAL="${API_BASE_VAL%/}"
if [ -n "$API_BASE_VAL" ]; then
  echo "$API_BASE_VAL" | grep -Eq '^https://[A-Za-z0-9._-]+(:[0-9]+)?(/[A-Za-z0-9._-]*)*$' || { echo "서버 주소 형식이 이상합니다(https://... 만 가능): $API_BASE_VAL"; exit 1; }
  sed -i '' "s#window.PAPERTALE_API_BASE) || '';#window.PAPERTALE_API_BASE) || '$API_BASE_VAL';#" www/entitlements.js && grep -q "|| '$API_BASE_VAL';" www/entitlements.js
  echo "서버 주소: $API_BASE_VAL"
else
  echo "서버 주소 없음: 동기화 꺼진 빌드"
fi
# 코드 줄이기(2026-11-02 출시 점검: 첫 화면·동화 시작 때 읽는 양). 맨 위 이름(전역)은 esbuild 가 그대로 둔다.
# 녹음 맵·대본(narration*.js, read_narration*.js, chorus*.js, home_narration_el.js, story.js)은 다른 코드가 글자로 읽어 고쳐 쓰므로 그대로 둔다
MIN=$(ls www/audio.js www/home.js www/stage.js www/bedtime.js www/entitlements.js www/tales/catalog.js www/tales/stickers.js www/engine/*.js www/engine/splash/*.js; for d in www/tales/*/; do t=$(basename "$d"); [ -f "$d$t.js" ] && echo "$d$t.js"; done)
for f in $MIN; do node_modules/.bin/esbuild "$f" --minify --target=safari15 --allow-overwrite --outfile="$f" --log-level=error; done
echo "www size: $(du -sh www | cut -f1)"
