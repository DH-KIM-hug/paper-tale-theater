/* 앱 화면 그림 목록 (assets/ui/<이름>.webp). 그림 파일을 넣으면 여기에 이름을 적는다 — 없는 파일은 요청하지 않고, 그 자리는 임시 기호·동화 썸네일로 대신한다.
   (APP_SCREENS_PLAN §6-1, 7단계에서 채운다)
   탭 그림        tab_tales · tab_night · tab_stickers            512² 투명  (선택 = 색, 아닌 것 = 코드 필터로 새김)
   그림 딱지      badge_lock · badge_week · badge_making          256²       (타일의 마개 위 자물쇠 · 이번 주 무료 별 · 만드는 중 가위)
   서가 줄 머리   row_week · row_recent · row_original · row_princess · row_aesop · row_korean · row_world · row_all   256²  (동화 탭 줄 7개 + 잠자리 탭 '모든 이야기')
   스티커·판      sticker_<동화id> ×31                            512²       (동화마다 대표 인물 종이 스티커)
                  puzzle_princess · puzzle_korean · puzzle_aesop · puzzle_world · puzzle_original   1600×900  (판 완성 그림)
   종이별         star_plate                                      1024×640   (접시 그림, 별 자리는 CSS 가 얹는다)
   빈 상태·머리   empty_shelf · empty_night · empty_stickers · night_head   1024² */
window.UI_ART = ['tab_tales', 'tab_night', 'tab_stickers', 'badge_lock', 'badge_week', 'badge_making', 'star_plate', 'row_week', 'row_recent', 'row_original', 'row_princess', 'row_aesop', 'row_korean', 'row_world', 'row_all', 'night_head', 'empty_shelf', 'empty_night', 'empty_stickers'];
