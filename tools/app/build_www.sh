#!/bin/bash
# 앱에 넣을 파일만 www/ 로 복사한다 (www/ 는 커밋하지 않음)
set -e
cd "$(dirname "$0")/../.."
rm -rf www && mkdir -p www/assets
cp index.html bedtime.html bedtime.js home_narration_el.js home.js home.css entitlements.js audio.js narration_tc.js story.js privacy.html www/   # privacy.html = 보호자 영역 '정보'의 앱 안 문서
sed -i '' '/<script src="review.js/d' www/index.html   # 검수용 review.js(?review=1 전용)는 앱에 넣지 않는다 (2026-11-02 출시 점검)
# 개발용: 원고 초안·ASP 표(*.txt)·sed 백업(*-e)·맞춤 확인 페이지(_*.html)·꿀떡이 원고(source/)는 넣지 않는다 (2026-11-02 출시 점검)
for d in engine tales sounds; do rsync -a --exclude='*.md' --exclude='*.py' --exclude='__pycache__' --exclude='.DS_Store' --exclude='*.txt' --exclude='*-e' --exclude='_*.html' --exclude='tales/kkultteok/source' --exclude='kkultteok/source' "$d" www/; done
for d in fonts home icons thumbs thumb ui v3w stickers banner; do   # banner = 홈 맨 위 추천 배너(2026-11-02 출시 점검: 빠져 있어 앱 홈 배너가 404)
   [ -d assets/$d ] && rsync -a --exclude='.DS_Store' --exclude='*_raw.png' assets/$d www/assets/; done
cp sounds/CREDITS.md www/sounds/CREDITS.txt   # 앱에는 *.md 를 넣지 않으므로 .txt 로 복사: 보호자 영역 '정보' > 그림·소리 출처가 읽는다
# 녹음: el = 기본 목소리(ElevenLabs, 동화 페이지가 narration_el.js 로 먼저 읽는다), tc = Typecast(el 에 없는 줄), bremen = 브레멘 음악대 소리
# 넣지 않는 것: 목소리 오디션·샘플 페이지(el/audition, el/samples), 다듬기 기록(polished.json), 브레멘 wav 원본과 쓰지 않는 옛 곡(finale_march.mp3, jacques_round.mp3) — 2026-11-02 출시 점검
mkdir -p www/audio && for d in el tc bremen; do rsync -a --exclude='.DS_Store' --exclude='el/audition' --exclude='el/samples' --exclude='polished.json' --exclude='*.wav' --exclude='bremen/finale_march.mp3' --exclude='bremen/jacques_round.mp3' audio/$d www/audio/; done
echo "www size: $(du -sh www | cut -f1)"
