#!/bin/zsh
# 2026-11-27 아빠 기준 다시 그리기: 후보 3장 → 아빠 말고 남은 배경·컷·뒷표지 (키아트는 새 아빠 자세 뒤)
cd ~/projects/2026/patjuk-game
python3 -u tools/app/gen/run_simple.py night_before_dadcand nb_dad_stand_c1 nb_dad_stand_c2 nb_dad_stand_c3
python3 -u tools/app/gen/run_simple.py night_before nb_bg_parents nb_bg_parents_open nb_bg_yard nb_bg_sky nb_bg_sky_lb nb_cut_window_moon nb_cut_fly_up nb_cut_chimney nb_cut_santa_face nb_cut_moon_sleigh nb_bg_back
echo CHAIN_DONE
