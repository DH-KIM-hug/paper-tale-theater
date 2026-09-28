#!/bin/zsh
# 1일차 밤: 이미지 40장(이어하기) → 새 대사 16줄 녹음. 로그: assets/raw/night1.log
G=/Users/house_of_4k2b/projects/2026/patjuk-game
cd $G/tools/gpu_night
echo "=== 이미지 시작 $(date '+%H:%M') ==="
python3 run_night.py jobs_night1.json
echo "=== 음성 시작 $(date '+%H:%M') ==="
cd /Users/house_of_4k2b/orca/projects/GPT-SoVITS
.venv/bin/python $G/tools/gpu_night/sovits_gen.py $G/tools/gpu_night/lines_night1.json $G/audio_new v3_
echo "=== 모두 끝 $(date '+%H:%M') ==="
