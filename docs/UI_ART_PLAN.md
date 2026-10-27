# 앱 UI 아이콘·그림 기획 (GPT 생성) — 2026-10-27 초안

> 사용자 지시: "새로 앱 기획하면서 필요한 아이콘들도 다 지피티한테 생성".
> 범위: docs/APP_SCREENS_PLAN.md 의 새 화면 구조에 필요한 **아이콘·UI 그림 전부**를 Codex(image_gen)로 만들 수 있게 목록·스타일 가이드·작업표를 정한다. 생성 실행은 다음 단계(Codex 에이전트).
> 범위 제외(2026-10-27 조정): 퍼즐판 완성 그림 5장(`puzzle_*`)은 퍼즐 구조를 다시 정하는 별도 기획으로 옮겼다. 동화 스티커 31장(`sticker_<id>`)은 작업표에 넣되 **맨 뒤 묶음 6 '퍼즐 기획 확정 뒤 실행'** 으로 둔다. 동화별 캐릭터 스티커 세트(동화당 10장)는 다른 작업이 진행 중이라 뺀다.
> 기준: CLAUDE.md §4·§7, DESIGN_SYSTEM.md §1·§2, tools/app/keyart/STYLE_BLOCK_v2.md, assets/ui/ui.js 의 그림 이름, 사용자 메모(feedback-no-svg-art, home-ui-direction, codex-image-gen).
> 산출물: `tools/app/gen/jobs_ui.json`(작업표 64장), `tools/app/gen/jobs_ui_POST.md`(후처리 순서), 이 문서. 코드는 바꾸지 않았다.

---

## 1. 목록

### 1-1. 생성할 그림 (33 + 스티커 31 = 64)

이름은 코드가 기다리는 그대로(`assets/ui/ui.js` 주석, `home.js` `UIA.has(...)`). `★` 는 코드에 아직 이름이 없어 ui.js·home.js 에 이름을 더해야 하는 것(§5 판단).

| 묶음 | 이름 | 원본 크기 | 보이는 크기 | 용도 | 지금 코드 | 우선 |
|---|---|---|---|---|---|---|
| 1 | `tab_tales` | 512² 투명 | 구멍 88px(폰 80) | 동화 탭(열린 그림책). **기준 아이콘 1** | 임시 구리 점(`.hole .dot`) | 1 |
| 1 | `star_one` ★ | 512² 투명 | 32px(접시 자리)·48px(날아가는 별)·S4 단추 | 종이별 한 개: S3 접시, S7 받기 연출, S4 종이별로 열기, pz-done. **기준 아이콘 2** | `starSvg`(home.js 1063), `STAR_SVG`(906), tale.js 1294 | 1 |
| 1 | `tab_night` | 512² 투명 | 구멍 88px | 잠자리 탭(초승달·별·베개). **기준 아이콘 3** | 임시 점 | 1 |
| 1 | `tab_stickers` | 512² 투명 | 구멍 88px | 스티커북 탭(앨범 + 스티커 둘) | 임시 점 | 1 |
| 1 | `badge_lock` | 256² 투명 | 마개 위 28~50px, S4 큰 자물쇠 | 잠김 딱지 | `BADGE_SVG.lock`, `LOCK_SVG` | 1 |
| 1 | `badge_week` | 256² 투명 | 타일 모서리 34~44px | 이번 주 무료 딱지 (**깃발로 제안**, §5-1) | `BADGE_SVG.week`(별) | 1 |
| 1 | `badge_making` | 256² 투명 | 마개 위 28~50px | 만드는 중 딱지(가위+종이) | `BADGE_SVG.making` | 1 |
| 1 | `star_plate` | 1024×640 투명 | 224×128 | 종이별 접시(S3·S7). 별 자리는 CSS `plate-dots` | 그림 없음(CSS 타원) | 1 |
| 2 | `row_recent` | 256² 투명 | 64px(폰 40~44) | '최근 본'·'최근 들은' 줄 머리(시계) | `ROW_SVG.recent` | 2 |
| 2 | `row_original` | 256² | 64px | '창작 동화' 줄 머리(연필+별) | `#i-original` 심볼 | 2 |
| 2 | `row_princess` | 256² | 64px | '공주' 줄 머리(왕관) | `#i-princess` | 2 |
| 2 | `row_aesop` | 256² | 64px | '동물 이야기' 줄 머리(여우 얼굴) | `#i-aesop` | 2 |
| 2 | `row_korean` | 256² | 64px | '우리나라 옛이야기' 줄 머리(초가) | `#i-korean` | 2 |
| 2 | `row_world` | 256² | 64px | '세계 옛이야기' 줄 머리(성) | `#i-world` | 2 |
| 2 | `row_week` | (복사) | 64px | '이번 주 무료' 줄 머리 = `badge_week` 복사 | `ROW_SVG.week` | 2 |
| 2 | `row_all` | (복사) | 56px | 잠자리 탭 '모든 이야기' 줄 머리 = `tab_tales` 복사 | `ROW_SVG.all` | 2 |
| 3 | `ic_home` ★ | 256² | S5 56px, S7 동그라미 96px(안 54px), S13 | 집(홈으로) | tale.js 1037·1055 인라인 SVG | 3 |
| 3 | `ic_again` ★ | 256² | S7 96px | 한 번 더(둥근 화살표) | tale.js 1056 | 3 |
| 3 | `ic_arrow` ★ | 256² | 72px | 큰 동화 좌우 화살표(왼쪽은 CSS 좌우 반전) | index.html 114·116 | 3 |
| 3 | `ic_close` ★ | 256² | S4 아이용 큰 동그라미·쪽지 닫기 | 닫기 X | `X_SVG`(home.js 908) | 3 |
| 3 | `ic_gear` ★ | 256² | 첫 실행 쪽지·S9 머리(40px 이상) | 보호자 톱니 | `#i-gear`(index.html 76) | 3 |
| 4 | `night_head` | 1024² **불투명** | 둥근 구멍 | 잠자리 탭 머리 그림(밤 장면, 구멍 안만 밤) | 없음 | 4 |
| 4 | `empty_shelf` | 1024² 투명 | 132px 둥근 창 | 동화 탭 빈 상태(빈 선반 + 종이 새) | 없음 | 4 |
| 4 | `empty_night` | 1024² 투명 | 132px | 잠자리 탭 빈 상태(종이 더미 + 가위) | 없음 | 4 |
| 4 | `empty_stickers` | 1024² 투명 | 132px | 스티커북 빈 상태(빈 앨범 + 별 스티커 하나) | 없음 | 4 |
| 5 | `tag_count` … `tag_position` (10) | 256² | 칩 안 `--chip-ic` | 보호자 '동화 찾기' 배우는 것 태그 10개 → `assets/icons/<key>.webp`(`icons.js` 경로가 이미 있음) | index.html `#i-count` 등 10개 심볼 | 5(선택) |
| 6 | `sticker_<id>` ×31 | 512² 투명 | 퍼즐 조각·S7 날아가는 스티커 | 동화 대표 인물 종이 스티커(흰 칼선 없음). refs = assets/v3w 대표 인물 | 임시로 `_tile` 썸네일 둥글게 | **퍼즐 기획 확정 뒤** |

이야기 종류 태그 6개(`all/aesop/korean/world/original/princess`)는 따로 만들지 않고 `row_*` 파일을 `assets/icons/<key>.webp` 로 복사한다(같은 그림이 홈 줄 머리와 보호자 칩에 쓰이므로 한 번만 생성).

### 1-2. 코드 기호로 남기는 것 (14) — 꼭 필요한 경우만

| 것 | 자리 | 이유 |
|---|---|---|
| 보호자 메뉴 항목 아이콘 8(소리·시계·지구·돋보기·별·고리·i·휴지통, `GI` home.js 628) | S9 왼쪽 목록 | 24px 단색 선, `--text-2` 글자 톤과 한 몸. 보호자 전용이라 색 그림이면 오히려 글자 목록에서 튄다. §5-4 에서 사용자 판단 |
| `PLAY_SVG` 재생 삼각형 | S5 알약 글자 앞 0.72em | 글자 크기(16px) 기호. 그림이면 번진다 |
| `BOOK_SVG` 펼친 책 | S5 '읽어 주기' 알약 안 | 위와 같음(20px). 큰 책 그림은 `tab_tales`·`row_all` 이 맡는다 |
| 톱니 둘레 링(`gear-ring`) | 1초 꾹 게이지 | 애니메이션 선. 그림이 아님 |
| 톱니 48px 단추 안 26px | 홈 오른쪽 위 | `ic_gear` 를 넣어 보고 26px 에서 안 읽히면 지금 SVG 유지(§5-3) |
| 손가락 힌트(`hand3.webp`) | 엔진 | 이미 생성 그림 |
| 돌리기 안내 전화기(`#rotateHint`) | 세로 화면 28px | 작은 안내 기호, 1.6초 애니메이션 |
| 자동 재생 작은 표시(`.autobadge`) | S5 모서리 34px | 기획에서 알약 제거 후 남는 작은 표시. 보호자 설정 켤 때만 |
| 홈 배경 물결(`svg.waves` w1~w5·달) | 홈 바탕 | §7-5 "같은 계열 명암의 큰 종이 물결 하나". 종이 색 토큰을 그대로 따라야 하고 창 크기에 맞춰 늘어나므로 코드가 맞다 |
| 종이 마개(`.plug`) | 잠긴·만드는 중 타일 | 바탕 종이와 **같은 색**의 둥근 종이 한 장. 생성하면 크림이 미세하게 달라 이음이 보인다. 딱지(`badge_*`)만 그림 |
| 스티커북 탭 알림 점(구리색) | 탭 구멍 가장자리 | 점 하나(CSS) |
| 파비콘 data-SVG | 브라우저 탭 | 32px. 앱 아이콘은 별도 |
| 쉬는 화면 잠든 인물 | S13 | 기존 `lm_lion_sleep.webp` 재사용(APP_SCREENS_PLAN §6-1) |
| '만세!'·탭 이름 | 글자 | 오린 글자는 폰트·CSS |

스플래시(`engine/splash/`)는 이미 `assets/v3w` 그림만 쓴다(코드 그림 없음).

---

## 2. 스타일 가이드 (아이콘·UI 그림 세트 공통 — 퍼즐·스티커 세트에도 그대로 쓴다)

재료 원칙은 CLAUDE.md §7-1·§7-2 그대로이고, 아래는 **아이콘 세트가 하나로 보이게 하는 추가 규칙**이다. 작업표 프롬프트의 `ICON SET RULES` 단락이 이 내용이다.

1. **조각 수**: 아이콘 하나 = 종이 2~4장(실루엣 바닥판 + 메인 색판 + 디테일 1~2장). 빈 상태·머리 그림 같은 '그림'은 8장까지. 스티커는 4~8장. 조각을 더 얹어 디테일을 만들되 그 이상은 금지.
2. **크기별 단순화**: 보이는 크기가 64px 이하(딱지 28px, 접시 별 32px, 줄 머리 64px)는 가는 선·작은 안쪽 무늬·글자 없이 큰 덩어리 실루엣 하나. 모서리·끝은 둥글린다(3~4세, 뾰족 최소). 256² 원본이라도 "64px 로 줄여도 읽혀야 한다"를 프롬프트에 넣는다.
3. **색**: 기본 팔레트(크림 `#F6ECD8`, 짚금 `#D9A94E`, 감 `#E8703A`, 팥 `#A93B32`, 나무 `#6B4A32`, 솔 `#3F6B4F`, 남 `#1F2A56`, 하늘 `#3E7CB1`, 구리 `#C98A5B`) + 자유(§7-4 해제). 단 **크림 종이 `#F5EFE9` 위에 놓이므로** 크림 한 색만으로 된 물체는 금지(접시는 짚금 테두리, 책은 감색 표지 테두리처럼 대비 조각을 하나 둔다). 1조각 1색, 그라데이션·광택 금지(유니콘 뿔·갈기 띠만 펄 허용).
4. **그림자**: 조각 사이의 얕은 웜 다크 그림자만(왼쪽 위 빛, 오른쪽 아래로 짧게). 실루엣 밖 그림자·접지 그림자·받침 원·흰 테두리·윤곽선·글로우 전부 금지 — 바깥 그림자는 엔진(CSS `drop-shadow`·구멍 음각)이 붙인다.
5. **방향·시점**: 정면 평면, 기울임·원근·3/4 시점 없음. 좌우가 있는 것(화살표)은 **오른쪽**을 기본으로 한 장만 만들고 왼쪽은 CSS 반전.
6. **여백**: 정사각 캔버스에서 물체가 폭의 약 70%(둥근 구멍에 들어가는 탭·빈 상태 그림은 지름 80% 원 안), 가로 접시는 80%. 가장자리에 닿지 않게. 후처리에서 트림하므로 정확한 비율은 크기 맞춤 단계에서 잡는다.
7. **탭 선택/비선택**: 그림은 **한 장만**. 비선택은 코드 필터(`--f-tag` = `duoM-l`, 투명도 .55)로 종이 톤 새김이 되므로, 필터를 거쳐도 실루엣이 읽히게 큰 덩어리로 만든다(얇은 별·가는 손잡이는 새김에서 사라진다).
8. **얼굴**: 사물(책·별·자물쇠·접시·가위·시계·집·성)은 얼굴 없음. 동물·사람 캐릭터(여우 줄 머리, 종이 새, 스티커 인물)만 단순 종이 얼굴(점 눈·점 코·종이띠 입·분홍 볼).
9. **투명 배경**: 마젠타 `#FF00FF` 바탕으로 뽑아 `tools/gpu_night/chromakey.py` 로 오린다. 프롬프트에 "물체 안에 마젠타·핫핑크 없음"을 넣는다. 분홍 볼은 `key_magenta` 판정(min(R,B)−G ≥ 70)에 걸리지 않는 연분홍이어야 한다. 구멍 안을 가득 채우는 장면(`night_head`)만 불투명 full-bleed.
10. **일관성 순서**: 기준 아이콘 3장(`tab_tales`·`star_one`·`tab_night`)을 refs 없이 먼저 뽑고 사용자가 고른 뒤, 나머지는 그 3장을 `refs` 로 넣어 "같은 손이 같은 날 오린" 두께·그림자·단순함을 맞춘다. 기준 3장이 마음에 안 들면 그 3장만 다시 뽑고 나머지는 시작하지 않는다.
11. **금지 목록**(STYLE_BLOCK_v2 NO 목록 + 추가): 글자, 사진, 광택, 3D, 부풀린 형태, 점토, 그라데이션, 회화, 에어브러시, 햇빛 그림자, 깊은 AO, 두꺼운 베벨, 플라스틱, 펠트·천, 흰 테두리·윤곽선, 실루엣 밖 그림자, 물체 안 마젠타.

---

## 3. 묶음 순서 (한도 고려, CLAUDE.md §6 "한 번에 많이 요청하지 않는다")

| 묶음 | 장수 | 내용 | 실행 조건 |
|---|---|---|---|
| **1 핵심** | 8 | 기준 3장(`tab_tales`·`star_one`·`tab_night`, pass 1) → 확인 뒤 `tab_stickers`·`badge_lock`·`badge_week`·`badge_making`·`star_plate`(pass 2) | 지금. 기준 3장을 먼저 뽑고 **사용자 확인** 후 나머지 5장 |
| **2 서가 줄** | 6 | `row_recent`·`row_original`·`row_princess`·`row_aesop`·`row_korean`·`row_world` (+ `row_week`·`row_all` 복사) | 묶음 1 끝난 뒤 1시간 간격 |
| **3 단추** | 5 | `ic_home`·`ic_again`·`ic_arrow`·`ic_close`·`ic_gear` | 묶음 2 뒤 |
| **4 빈 상태·머리** | 4 | `night_head`·`empty_shelf`·`empty_night`·`empty_stickers` | 묶음 3 뒤 |
| **5 보호자 태그(선택)** | 10 | `tag_count` … `tag_position` | 사용자가 보호자 칩에도 그림을 원할 때(§5-4). 아니면 건너뜀 |
| **6 동화 스티커** | 31 | `sticker_<id>` (refs = assets/v3w 대표 인물) | **퍼즐 기획 확정 뒤.** 판별 소속은 작업표 `board` 칸(공주 8·우리나라 6·이솝 6·세계 8·창작 3) |

실행: `python3 tools/app/gen/run_simple.py ui <id…>`(작업표 `jobs_ui.json` 을 읽고 `aspect` 필드를 그대로 쓴다. `restyle.py` 의 자동 aspect 는 kind 가 `sprite` 가 아니면 16:9 로 잡으므로 쓰지 않는다). 한도에 걸리면 run_simple 이 풀리는 시각까지 기다렸다 다시 시도한다. 결과는 `assets/raw/ui_gpt/<id>.png`.

---

## 4. 작업표 형식 (`tools/app/gen/jobs_ui.json`)

| 항목 | 값 |
|---|---|
| `id` | 그림 이름(= 최종 webp 이름, 태그는 `tag_<key>`) |
| `kind` | `icon`(투명, 마젠타) / `ui`(불투명 장면) / `sticker`(투명, 인물 refs) |
| `pass` | 1 = 기준 아이콘(refs 없음), 2 = 기준 참고, 3 = 스티커(인물 refs) |
| `refs` | pass 2: `assets/raw/ui_gpt/tab_tales.png`·`star_one.png`(탭·빈 상태는 `tab_night.png` 까지 3장). pass 3: `assets/v3w/<대표 인물>.webp` |
| `size` | 최종 크기(후처리 리사이즈 목표) |
| `out` | `assets/raw/ui_gpt/<id>.png` |
| `prompt` | STYLE_BLOCK_v2(STYLE·CRITICAL·LIGHTING·OVERALL·NO) 그대로 + ICON SET RULES + SUBJECT + FRAMING(마젠타) |
| `aspect` | `square 1:1`(접시만 `landscape 3:2`) — run_simple 이 읽는다 |
| `batch` / `final` / `note` / `board` | 묶음 번호 / 최종 webp 경로 / 메모 / (스티커) 퍼즐판 — 실행기는 무시한다 |

스티커 refs(대표 인물, 모두 존재 확인): 팥죽 `pj3_tiger_stand`+`pj3_granny_ladle`, 황소와 개구리 `frog_mom`+`frog_baby_awake`, 토끼와 거북이 `rab_rabbit_run`+`rab_turtle_walk`, 해와 달 `sm_kids_hug`, 해와 바람 `sw_trav_walk`, 순무 `tn2_grandpa_stand`+`tn2_mouse_stand`, 사자와 생쥐 `lm_lion_stand`+`lm_mouse_walk`, 여우와 두루미 `fc_fox_stand`+`fc_crane_body`+`fc_crane_head`, 골디락스 `gl_goldi_walk`+`gl_bear_baby`, 브레멘 `br_donkey`+`br_dog_sing`+`br_cat_sing`+`br_rooster_sing`, 개미와 베짱이 `ag_ant_stand`+`ag_hopper_carry`, 미운 아기 오리 `ud_swan`+`ud_baby_happy`, 삼형제 `tp_pig1~3_base`, 일곱 염소 `wg_mama_basket`+`wg_kid1_base`, 콩쥐 `kj_kong_shoes`, 구름 공장 `cf4_baby_up`+`cf4_cloud_one`(§5-5), 헨젤 `hg_hans_walk`+`hg_gret_walk`, 신데렐라 `cd2_cind_stand`, 흥부 `hb_heung_glad`+`hb_swallow_fly`, 빨간 모자 `rh_hood_walk`, 까치 `mg_mag_mom_sit`+`mg_scholar_walk`, 요술 항아리 `mj_farmer_amaze`+`mj_jarnf`, 백설 `sw_snow_stand`+`sw_dwarf_smile`, 인어 `mer_mer_stand`, 미녀와 야수 `bb_belle_stand`+`bb_beast_stand`, 빨간 자동차 `rc_child_stand`+`rc_red_joy`, 유니콘 `uc_unicorn_stand`+`uc_kid_stand`, 완두콩 `pp_princess_stand`, 라푼젤 `rp_rap_stand`, 개구리 왕자 `fp_prin_stand`+`fp_frog_sit`, 잠자는 숲속 `sb_pr_stand`.

---

## 5. 판단이 필요한 부분

| # | 물음 | 선택지 | 권장 | 이유 |
|---|---|---|---|---|
| 1 | '이번 주 무료' 딱지 모양 | (가) 별(APP_SCREENS_PLAN §3 S1·지금 SVG) (나) **깃발**(작업표) | **(나)** | 종이별(`star_one`)이 보상인데 무료 딱지도 별이면 아이가 "별을 받았다"로 오해한다. 별을 고집하면 `badge_week` SUBJECT 만 바꾸면 된다 |
| 2 | 코드에 이름이 없는 그림 5+1(`star_one`·`ic_home`·`ic_again`·`ic_arrow`·`ic_close`·`ic_gear`) | (가) ui.js·home.js·tale.js 에 `UIA.has()` 분기 추가 (나) 지금 SVG 유지 | **(가)** | 사용자 지시가 '다'. 코드 수정은 이 문서 범위 밖이라 다음 단계에서 Sonnet 에게 맡긴다 |
| 3 | 톱니 48px 단추 안 26px 에 `ic_gear` 를 쓸지 | (가) 그림 (나) 지금 SVG(단색 `--gear`) 유지, 첫 실행 쪽지·S9 머리에만 그림 | **(나)** 로 시작, 그림 넣어 보고 결정 | 26px 종이 그림은 톱니 이가 뭉개진다. 색도 `currentColor` 로 못 바꾼다 |
| 4 | 보호자 영역 아이콘 18(메뉴 8 + 태그 10) | (가) 메뉴 8 은 코드, 태그 10 은 생성(묶음 5) (나) 모두 코드 (다) 모두 생성 | **(가)** | 메뉴 8 은 24px 단색 글자 톤. 태그 칩은 아이콘 자리(`icons.js`)가 이미 그림용이고 '그림으로 알아본다'는 설계였다 |
| 5 | 구름 공장(`kkultteok`) 스티커 인물 | (가) 아기 비구름(작업표) (나) 삼남매·꿀떡이 | **(가)** | CLAUDE.md §1 "실제 아이·가족 캐릭터는 공개 콘텐츠에 쓰지 않는다", 메모 family-tale(노출 금지). 스티커는 홈에 늘 보이므로 구름 캐릭터로 |
| 6 | `row_week`=`badge_week`, `row_all`=`tab_tales` 복사 | 복사 / 따로 생성 | **복사** | 같은 뜻 같은 그림. 한도 2장 절약 |
| 7 | 종이 마개(`.plug`) | CSS 유지 / 생성 | **CSS 유지** | 바탕 종이와 같은 색이어야 이음이 없다. §1-2 |
| 8 | 묶음 5(태그 10)를 지금 할지 | 지금 / 보호자 영역 S9 구현 뒤 | **S9 구현 뒤** | 칩 크기(`--chip-ic`)가 S9 에서 바뀔 수 있다 |
| 9 | 스티커 31 의 '한 장에 여러 인물' | 작업표대로(2~4명 묶음 12편) / 한 편 한 명 | 작업표대로 | 퍼즐 조각에서 "누구 동화"가 바로 보이려면 짝(사자+생쥐, 여우+두루미)이 낫다. 퍼즐 기획에서 조각 모양이 정해지면 다시 본다 |

---

## 확정 사항 (이 문서 기준, 사용자 확인 전)

- 생성 33장(묶음 1~5) + 스티커 31장(묶음 6, 퍼즐 기획 뒤). 코드 기호 유지 14항목(§1-2).
- 기준 아이콘 3장(열린 책·종이별·달과 베개)을 먼저 뽑고 사용자 확인 뒤 나머지를 그 3장 참고로 생성.
- 모든 아이콘은 마젠타 배경 → chromakey → 크기 맞춤 → `assets/ui/<이름>.webp` → `ui.js` `UI_ART` 등록(순서는 `tools/app/gen/jobs_ui_POST.md`).
- 탭 비선택은 코드 필터 새김이므로 탭 그림은 한 장.
- 퍼즐판 완성 그림 5장은 이 기획에서 뺐다(별도 퍼즐 기획).
