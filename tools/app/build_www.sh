#!/bin/bash
# 앱에 넣을 파일만 www/ 로 복사한다 (www/ 는 커밋하지 않음)
set -e
cd "$(dirname "$0")/../.."
rm -rf www && mkdir -p www/assets
cp index.html home.js home.css entitlements.js audio.js narration_tc.js story.js www/
for d in engine tales sounds; do rsync -a --exclude='*.md' --exclude='*.py' --exclude='__pycache__' --exclude='.DS_Store' "$d" www/; done
for d in home icons thumbs thumb ui v3w; do [ -d assets/$d ] && rsync -a --exclude='.DS_Store' assets/$d www/assets/; done
mkdir -p www/audio && rsync -a --exclude='.DS_Store' audio/tc www/audio/
echo "www size: $(du -sh www | cut -f1)"
