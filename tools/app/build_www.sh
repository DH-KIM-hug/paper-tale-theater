#!/bin/bash
# 앱에 넣을 파일만 www/ 로 복사한다 (www/ 는 커밋하지 않음)
set -e
cd "$(dirname "$0")/../.."
rm -rf www && mkdir -p www/assets
cp index.html bedtime.html bedtime.js home_narration_el.js review.js home.js home.css entitlements.js audio.js narration_tc.js story.js privacy.html www/   # privacy.html = 보호자 영역 '정보'의 앱 안 문서
for d in engine tales sounds; do rsync -a --exclude='*.md' --exclude='*.py' --exclude='__pycache__' --exclude='.DS_Store' "$d" www/; done
for d in fonts home icons thumbs thumb ui v3w stickers; do [ -d assets/$d ] && rsync -a --exclude='.DS_Store' assets/$d www/assets/; done
cp sounds/CREDITS.md www/sounds/CREDITS.txt   # 앱에는 *.md 를 넣지 않으므로 .txt 로 복사: 보호자 영역 '정보' > 그림·소리 출처가 읽는다
# 녹음: el = 기본 목소리(ElevenLabs, 동화 페이지가 narration_el.js 로 먼저 읽는다), tc = Typecast(el 에 없는 줄), bremen = 브레멘 음악대 소리
mkdir -p www/audio && for d in el tc bremen; do rsync -a --exclude='.DS_Store' audio/$d www/audio/; done
echo "www size: $(du -sh www | cut -f1)"
