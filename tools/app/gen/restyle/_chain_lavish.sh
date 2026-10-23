#!/bin/sh
# 2026-10-23 전 동화 화려한 재기획 그림 생성 (토끼 → 1조 → 3조 → 2조 → 공주 → 창작). run_simple 이 한도면 스스로 기다린다.
cd /Users/house_of_4k2b/projects/2026/patjuk-game
R=tools/app/gen/restyle; LOG=$R/lavish.log
while pgrep -f "run_simple.py" >/dev/null; do sleep 60; done
line(){ grep "^$2 " $R/$1 | head -1; }
for spec in "lavish_g1_ids.txt rabbit" "lavish_g1_ids.txt patjuk" "lavish_g1_ids.txt turnip" "lavish_g1_ids.txt frog" "lavish_g1_ids.txt sun_wind" "lavish_g1_ids.txt lion_mouse" "lavish_g1_ids.txt fox_crane" \
  "lavish_g3_ids.txt kongjwi" "lavish_g3_ids.txt heungbu" "lavish_g3_ids.txt hansel" "lavish_g3_ids.txt red_hood" "lavish_g3_ids.txt magic_jar" "lavish_g3_ids.txt magpie" \
  "lavish_g2_ids.txt goldilocks" "lavish_g2_ids.txt sunmoon" "lavish_g2_ids.txt bremen" "lavish_g2_ids.txt three_pigs" "lavish_g2_ids.txt ugly_duckling" "lavish_g2_ids.txt wolf_goats" "lavish_g2_ids.txt ant_grasshopper" \
  "lavish_princess_ids.txt snow_white" "lavish_princess_ids.txt cinderella2" "lavish_princess_ids.txt little_mermaid" "lavish_princess_ids.txt beauty_beast" "lavish_princess_ids.txt rapunzel" "lavish_princess_ids.txt frog_prince" "lavish_princess_ids.txt princess_pea" "lavish_princess_ids.txt sleeping_beauty" \
  "lavish_g3_ids.txt kkultteok" "lavish_g3_ids.txt red_car" "lavish_g3_ids.txt unicorn"; do
  set -- $spec; L=$(line $1 $2); [ -z "$L" ] && continue
  echo "== $(date '+%m-%d %H:%M') $L" >> $LOG
  python3 tools/app/gen/run_simple.py $L >> $LOG 2>&1
  echo "DONE_TALE $2" >> $LOG
done
echo ALLDONE >> $LOG
