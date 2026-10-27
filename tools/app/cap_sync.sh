#!/bin/bash
# 있는 플랫폼(ios, android)만 동기화한다. 한쪽만 있는 환경에서도 깨지지 않는다.
cd "$(dirname "$0")/../.."
found=0
for p in ios android; do
  if [ -d "$p" ]; then npx cap sync "$p"; found=1; fi
done
[ $found = 1 ] || echo "ios/android 폴더가 없습니다. npx cap add ios|android 를 먼저 실행하세요."
