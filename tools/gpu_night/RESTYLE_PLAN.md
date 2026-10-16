# S2 재생성 계획

전 21편 배경(bg)·컷(cut)을 손으로 오려 겹친 종이 공예 화풍(S2)으로 다시 만든다. 결과 이름은 `<원본>_s2` (assets/v3w/<원본>_s2.webp).

## S2 화풍 블록 (모든 작업 앞에 붙음)

```
Hand-cut layered cardstock paper art in the style of the reference images. Every shape is cut from colored cardstock with crisp clean edges, flat saturated colors with at most two tones per shape, no gradients, no outlines. Three to five depth layers stacked one in front of another (far sky and hills, middle shapes, foreground); each sheet sits slightly above the one behind it and casts a soft realistic drop shadow toward the lower right, light coming from the upper left. Fine paper grain over everything. Sky, hills and tree masses are cut as cloud-shaped scalloped sheets. Rich but uncluttered: two to four meaningful elements only. Objects, buildings and props have NO faces and NO eyes. No text.
```

배경 꼬리말: `Full-bleed picture filling the entire image edge to edge, no round window, no frame, no border. No characters unless described. Keep the lower third open where characters stand; key objects within the central 60% of the width.`

컷 머리말: `One warm picture-book illustration filling the entire image edge to edge, no frame, no border, kid-friendly and never scary. The characters have simple friendly faces (round dot eyes, small smile, pink cheeks); objects and props have no faces or eyes.`

네거티브(배경): `torn edges, painterly, gradient shading, gradient, 3D render, paper sculpture, origami, glossy, photorealistic, photograph, miniature model, text, letters, watermark, faces on objects, eyes on objects, wavy decorative bands, thick white outline, colored shadow, airbrushing, painted texture, felt, corrugated cardboard, perspective, depth of field, round window, frame, border, vignette, people, humans, animals, characters`

네거티브(컷): `torn edges, painterly, gradient shading, gradient, 3D render, paper sculpture, origami, glossy, photorealistic, photograph, miniature model, text, letters, watermark, faces on objects, eyes on objects, wavy decorative bands, thick white outline, colored shadow, airbrushing, painted texture, felt, corrugated cardboard, perspective, depth of field, frame, border, vignette, scary, creepy`

참고 이미지는 최대 2장(기본 keyart_ref_fox + keyart_ref_campfire, 밝은 낮 실내는 campfire 대신 keyart_ref_rabbit_shadow), 긴 변 448px 이하로 줄인 사본(`~/.paper-tale/refs/style_small/`)을 쓴다 — 원본(1080x2102 화면 캡처 등)을 4장 그대로 넣으면 ComfyUI가 샘플링 시작 직후 메모리 부족으로 꺼진다. 4장을 다 넣거나 640px로 넣어도 1760x992 목표에서 메모리가 0까지 떨어지므로 refs ≤ 2, ≤ 448px. 그래도 0 GB가 되면 1장으로. 저장소에는 복사하지 않음. 원본 4장: `/Users/house_of_4k2b/.paper-tale/refs/style/keyart_ref_fox.jpg`, `/Users/house_of_4k2b/.paper-tale/refs/style/keyart_ref_campfire.jpg`, `/Users/house_of_4k2b/.paper-tale/refs/style/keyart_ref_rabbit_shadow.webp`, `/Users/house_of_4k2b/.paper-tale/refs/style/cloud_factory_chimney_ref.jpg`

## 만드는 법

- 작업 파일: `tools/gpu_night/restyle/jobs_<tale>_s2.json` (`build_restyle_jobs.py used.json`으로 다시 만들 수 있음). 원본 작업의 내용 문장만 재사용, 크기 유지.
- 실행: `tools/gpu_night/restyle/run_queue.sh` (한 번에 한 편씩 순서대로, 이어하기 안전, 로그 `assets/raw/restyle_*.log`).
- 결과 원본: `assets/raw/v3/<name>_s2.png`.
- 꿀떡 배경 13장은 `jobs_cloud_bg2.json`이 만들므로 제외, 컷만 포함.
- 사람 사진 참고(sunmoon 우물 컷, 꿀떡 컷 등)는 쓰지 않고 글 묘사만 쓴다. 강아지 사진을 쓰던 컷(bremen, turnip)도 글 묘사만.
- 사용 여부는 각 동화 JS에서 키 이름으로 찾은 값이라, 일부 컷은 실제로 안 쓰일 수 있다.

## 우선순위와 목록

| 순서 | 동화 | 배경 | 컷 | 합계 |
|---|---|---|---|---|
| 1 | patjuk | 3 | 21 | 24 |
| 2 | kkultteok | 0 | 2 | 2 |
| 3 | rabbit | 13 | 3 | 16 |
| 4 | lion_mouse | 6 | 4 | 10 |
| 5 | sunmoon | 16 | 4 | 20 |
| 6 | turnip | 7 | 2 | 9 |
| 7 | goldilocks | 7 | 2 | 9 |
| 8 | ant_grasshopper | 8 | 3 | 11 |
| 9 | bremen | 10 | 3 | 13 |
| 10 | cinderella | 8 | 7 | 15 |
| 11 | fox_crane | 7 | 4 | 11 |
| 12 | frog | 4 | 5 | 9 |
| 13 | hansel | 9 | 7 | 16 |
| 14 | heungbu | 8 | 10 | 18 |
| 15 | kongjwi | 10 | 7 | 17 |
| 16 | magic_jar | 8 | 8 | 16 |
| 17 | magpie | 10 | 5 | 15 |
| 18 | red_hood | 10 | 7 | 17 |
| 19 | sun_wind | 5 | 5 | 10 |
| 20 | three_pigs | 10 | 2 | 12 |
| 21 | ugly_duckling | 11 | 1 | 12 |
| 22 | wolf_goats | 9 | 8 | 17 |
| | 합계 | 179 | 120 | 299 |

한 장 약 10분 기준 약 50시간 (299장).

### patjuk

컷 21장은 `assets/v2/cut_*.png`(원본 작업 파일 없음)라서 `jobs_patjuk_cuts_s2.json`(build_patjuk_cuts.py)에 내용을 새로 적었다: cut_<id>_s2, cut_<id>_b_s2, cut_wrong_<id>_s2 (id = bam jara ddong songgot jeolgu myeongseok jige; 게임이 쓰는 jara_b2, jeolgu_b2, jige2, wrong_jige2 포함). 배경 3장:

scene_a_field_s2, scene_b_kitchen_s2, scene_c_yard_sea_s2

### kkultteok

cf_cut_hug_s2, cf_cut_rainbow_s2

### rabbit

rab_bg_alley_s2, rab_bg_dream_s2, rab_bg_dusk_s2, rab_bg_finish_s2, rab_bg_grass_low_s2, rab_bg_hill_s2, rab_bg_map_s2, rab_bg_party_s2, rab_bg_shade_s2, rab_bg_stands_s2, rab_bg_start_s2, rab_bg_stream_s2, rab_bg_village_s2, rab_cut_dash_s2, rab_cut_photo_s2, rab_cut_wake_s2

### lion_mouse

lm_bg_board_s2, lm_bg_grass_s2, lm_bg_morning_s2, lm_bg_night_forest_s2, lm_bg_night_net_s2, lm_bg_savanna_s2, lm_cut_gnaw_s2, lm_cut_laugh_s2, lm_cut_net2_s2, lm_cut_paw4_s2

### sunmoon

sm_bg_backyard_s2, sm_bg_backyard2_night_s2, sm_bg_cottage_s2, sm_bg_door2_lamp_s2, sm_bg_heaven_s2, sm_bg_heaven_night_s2, sm_bg_hill_dusk_s2, sm_bg_hill_dusk_gold_s2, sm_bg_hill_dusk_night_s2, sm_bg_kitchen_s2, sm_bg_room_s2, sm_bg_room2_lamp_s2, sm_bg_sky_s2, sm_bg_sorghum_dusk_s2, sm_bg_tree2_night_s2, sm_bg_well_top_night_s2, sm_cut_bump2_s2, sm_cut_roar_night_s2, sm_cut_snap_s2, sm_cut_well2_s2

### turnip

tn_bg_barn_s2, tn_bg_door_s2, tn_bg_feast_s2, tn_bg_fence_s2, tn_bg_garden_s2, tn_bg_lowangle_s2, tn_bg_mouse_s2, tn_cut_glare5_s2, tn_cut_pop2nf_s2

### goldilocks

gl_bg_bed_side_s2, gl_bg_bed_top_s2, gl_bg_door_s2, gl_bg_forest_s2, gl_bg_kitchen_s2, gl_bg_living_s2, gl_bg_table_s2, gl_cut_eyes2_s2, gl_cut_hot_s2

### ant_grasshopper

ag_bg_ant_eye_s2, ag_bg_autumn3_s2, ag_bg_cellar_s2, ag_bg_door_s2, ag_bg_leafstage_s2, ag_bg_spring_s2, ag_bg_summer_s2, ag_bg_winter_high_s2, ag_cut_door_s2, ag_cut_shiver_s2, ag_cut_sneeze_s2

### bremen

br_bg_forest_night_s2, br_bg_house_low_s2, br_bg_house_pov_s2, br_bg_house_wide_s2, br_bg_meadow_s2, br_bg_mill_s2, br_bg_morning_s2, br_bg_road_s2, br_bg_roof_s2, br_bg_wall_s2, br_cut_crash5_s2, br_cut_ghost3_s2, br_cut_monster_s2

### cinderella

cd_bg_garden_s2, cd_bg_hall_s2, cd_bg_hearth_s2, cd_bg_kitchen_s2, cd_bg_palacegarden_s2, cd_bg_parlor_s2, cd_bg_stairs_high_s2, cd_bg_terrace_s2, cd_cut_bow_s2, cd_cut_dress_s2, cd_cut_fairy_s2, cd_cut_foot_s2, cd_cut_horses_s2, cd_cut_pumpkin_s2, cd_cut_slipper_s2

### fox_crane

fc_bg_crane_room_s2, fc_bg_feast_day_s2, fc_bg_feast_night_s2, fc_bg_forest_s2, fc_bg_high_s2, fc_bg_kitchen_s2, fc_bg_pondhouse_s2, fc_cut_lick_s2, fc_cut_peck_s2, fc_cut_sorry_s2, fc_cut_stuck_s2

### frog

frog_bg_chart_s2, frog_bg_meadow_s2, frog_bg_pond_s2, frog_bg_pond_night_s2, frog_cut_fly_s2, frog_cut_jump_s2, frog_cut_monster_s2, frog_cut_pop_s2, frog_cut_splash_s2

### hansel

hg_bg_cage_s2, hg_bg_cottage_s2, hg_bg_glade_s2, hg_bg_ground_s2, hg_bg_house_s2, hg_bg_oven_s2, hg_bg_river_s2, hg_bg_roof_s2, hg_bg_trail_s2, hg_cut_bird_s2, hg_cut_duck_s2, hg_cut_eat_s2, hg_cut_hug_s2, hg_cut_pop_s2, hg_cut_slam_s2, hg_cut_witch_s2

### heungbu

hb_bg_eaves_s2, hb_bg_giwa_s2, hb_bg_nol_eaves_s2, hb_bg_nolkitchen_s2, hb_bg_nolyard_s2, hb_bg_sky_autumn_s2, hb_bg_sky_spring_s2, hb_bg_yard_s2, hb_cut_bandage2_s2, hb_cut_collapse_s2, hb_cut_dokkaebi_s2, hb_cut_fall_s2, hb_cut_house2_s2, hb_cut_mud2_s2, hb_cut_rice_s2, hb_cut_rice_pour2_s2, hb_cut_seedback_s2, hb_cut_south_s2

### kongjwi

kj_bg_feast_s2, kj_bg_field_s2, kj_bg_gate_s2, kj_bg_jar_s2, kj_bg_jarbottom_s2, kj_bg_loom_s2, kj_bg_mat_s2, kj_bg_stream_s2, kj_bg_wedding_s2, kj_bg_yard_s2, kj_cut_fairy_s2, kj_cut_ox_s2, kj_cut_shy_s2, kj_cut_sparrows_s2, kj_cut_splash_s2, kj_cut_toad_s2, kj_cut_wet_s2

### magic_jar

mj_bg_feast_s2, mj_bg_field_s2, mj_bg_hall_s2, mj_bg_hallwide_s2, mj_bg_jarfront_s2, mj_bg_pit_s2, mj_bg_richgate_s2, mj_bg_village_s2, mj_cut_buried_s2, mj_cut_clink_s2, mj_cut_coins_s2, mj_cut_eight_s2, mj_cut_hungry_s2, mj_cut_plop_s2, mj_cut_smash_s2, mj_cut_twohoes_s2

### magpie

mg_bg_belltower_s2, mg_bg_bigtree_s2, mg_bg_dawn_s2, mg_bg_moonnest_s2, mg_bg_morning_s2, mg_bg_nest_s2, mg_bg_night_s2, mg_bg_paperdoor_s2, mg_bg_path_s2, mg_bg_porch_s2, mg_cut_flee_s2, mg_cut_flock_s2, mg_cut_ring_s2, mg_cut_tail_s2, mg_cut_wake_s2

### red_hood

rh_bg_bed_s2, rh_bg_cottage_s2, rh_bg_door_s2, rh_bg_flowers_s2, rh_bg_kitchen_s2, rh_bg_room_s2, rh_bg_shortcut_s2, rh_bg_table_s2, rh_bg_trail_s2, rh_bg_tree_s2, rh_cut_dash_s2, rh_cut_granwolf_s2, rh_cut_gulp_s2, rh_cut_hiccup_s2, rh_cut_jumpup_s2, rh_cut_tail_s2, rh_cut_whisper_s2

### sun_wind

sw_bg_field_s2, sw_bg_high_s2, sw_bg_sky_s2, sw_bg_snow_s2, sw_bg_stream_s2, sw_cut_hat_s2, sw_cut_hold_s2, sw_cut_off_s2, sw_cut_pant2_s2, sw_cut_shake_s2

### three_pigs

tp_bg_brick_in_s2, tp_bg_brick_outv2_s2, tp_bg_bricklot_s2, tp_bg_chimney_s2, tp_bg_field_s2, tp_bg_meadow_s2, tp_bg_shop_s2, tp_bg_strawlot_s2, tp_bg_sunset_s2, tp_bg_woodlot_s2, tp_cut_chimney_s2, tp_cut_splashnf_s2

### ugly_duckling

ud_bg_autumn_s2, ud_bg_cabin_s2, ud_bg_nest2_s2, ud_bg_pond_s2, ud_bg_reeds_s2, ud_bg_reflect_s2, ud_bg_spring_s2, ud_bg_swamp_s2, ud_bg_swamp_high_s2, ud_bg_winter_s2, ud_bg_yard_s2, ud_cut_hatch_s2

### wolf_goats

wg_bg_door_s2, wg_bg_house_s2, wg_bg_inside_door_s2, wg_bg_kitchen_s2, wg_bg_messy_s2, wg_bg_shadow_s2, wg_bg_tree_s2, wg_bg_well_s2, wg_bg_window_s2, wg_cut_belly_s2, wg_cut_chalk_s2, wg_cut_dance_s2, wg_cut_dark_s2, wg_cut_flour_s2, wg_cut_pop_s2, wg_cut_splash_s2, wg_cut_stitch_s2
