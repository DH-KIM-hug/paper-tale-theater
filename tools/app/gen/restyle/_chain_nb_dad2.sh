#!/bin/zsh
# 2026-11-27: 배경·컷 체인(_chain_nb_dad.sh)이 끝나면 새 아빠 기준(d3)으로 아빠 자세 14장 → 키아트·썸네일 3장
cd ~/projects/2026/patjuk-game
while pgrep -f _chain_nb_dad.sh >/dev/null; do sleep 30; done
python3 -u tools/app/gen/run_simple.py night_before nb_dad_sleep nb_dad_wake nb_dad_dash nb_dad_open_window nb_dad_look_out nb_dad_window_face nb_dad_window_up nb_dad_turn nb_dad_startled nb_dad_peek nb_dad_giggle nb_dad_relieved nb_dad_watch_up nb_dad_wave nb_key_land nb_key_port nb_thumb
echo CHAIN2_DONE
