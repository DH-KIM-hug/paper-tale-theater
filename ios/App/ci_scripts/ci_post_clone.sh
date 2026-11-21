#!/bin/bash
# Xcode Cloud: 깃허브에서 받은 직후 실행. node_modules·www·public 은 깃에 없으므로 여기서 만든다.
# 서버 주소는 Xcode Cloud 워크플로 환경 변수 PAPERTALE_API_BASE 로 넣는다(tools/app/server.env 는 깃에 없음).
set -eo pipefail
cd "$CI_PRIMARY_REPOSITORY_PATH"

command -v node >/dev/null || brew install node
command -v ffmpeg >/dev/null || brew install ffmpeg
command -v python3 >/dev/null || brew install python

npm ci
bash tools/app/build_www.sh
npx cap copy ios
