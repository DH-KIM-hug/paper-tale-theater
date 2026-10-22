# 사자와 생쥐 — 시각 재기획 (화려한 다층 초원 + 라이트박스 3장)

작성 2026-10-23. CLAUDE.md §7-5-1 적용. 배경·층 소품·라이트박스 배경만 다룬다. 사자·생쥐·그물·발·이빨 카드·비교 판(`lm_bg_board`) 그림, 대사·녹음·조작은 그대로. `lm_bg_lowangle` 은 코드에서 쓰지 않으므로 다시 그리지 않는다.

작업표: `tools/app/gen/jobs_lion_mouse.json` 끝 11항목(배경 `lm_bg_*_v2` 2 + 라이트박스 `lm_lb_*` 3 + 소품 `lm_layer_*` 6). 출력 `assets/raw/restyle/lion_mouse/` → `post_tale.py lion_mouse`. 참고 그림 분석은 `tales/patjuk/VISUAL_PLAN.md` §0.

무대 ↔ 그림: `BGBOX` x −40~1040, y −24~585. 가로 % = (x + 40) / 1080, 세로 % = (y + 24) / 609.

## 1. 지금 문제와 새 구성

| 장면 | 지금 배경 | 문제 | 새 배경 | 유지(% 명시) | 더하는 층 | 앞·위 소품(가로 자리) | 카메라 |
|---|---|---|---|---|---|---|---|
| 1 생쥐의 산책 (생쥐 눈높이) | grass | 풀·데이지·길 | `lm_bg_grass_v2` | 길 윗선 70%, 길 가운데(25~75%, 72~100%) 비움(사자 520,500·생쥐 60→), 양옆 풀(0~40%, 60~100%), 왼쪽 위 데이지, 오른쪽 위 아카시아 | 모래 언덕 2겹, 풀 4겹, 큰 꽃(데이지·미나리아재비·알로에·엉겅퀴), 씨앗 머리, 도토리, 무당벌레·딱정벌레(얼굴 없음), 이끼 낀 가지 | `lm_layer_grass_front` x 30·y 590 / `lm_layer_daisy_giant` x 960·y 560(중간) | 기존(세로 생쥐 따라감 — 앞 소품은 왼쪽 끝만) |
| 2 잡혔다! | savanna | 아카시아 하나 + 모래 땅 | `lm_bg_savanna_v2` | **아카시아(밑동 x 66%, y 70%; 수관 36~92%, 15~40%)**, 땅(70~100%) 가로 30~85% 비움, 왼쪽 먼 아카시아 둘, 해 | 언덕 5겹 Peach→Olive, 먼 보라 산, 수관 4겹+꼬투리, 둘째 아카시아·우산가시나무, 흰개미 탑, 바오밥 실루엣, 마른 풀 띠, 알로에 | `lm_layer_termite_mound` x 110·y 470(중간) / `lm_layer_acacia_branch_top` x 980·y −24 / `lm_layer_rocks_front` x 30·y 590 | 기존 |
| 3 누가 더 클까 | board | — | **바꾸지 않음**(비교 판 좌표 288~757/93~405) | — | — | — | — |
| 4 밤 숲 | night_forest | 달·산·공터 | `lm_lb_night_forest` **라이트박스** | 달(32~42%, 8~25%), 가운데 산, **공터(10~90%, 57~90%) 비움**(사자 560,460·그물 262~715/88~472·생쥐 120,505), 양옆 큰 나무 | 달 구멍 Amber Glow, 별 구멍, 구름 Lilac, 산 Lavender→Twilight, 전나무·덤불 Deep Plum, 큰 나무 Night Navy, 공터 Pale Sage, 반딧불 구멍 15 | `lm_layer_fern_night_front` x 30·y 590 | 기존 |
| 5 사각사각 | night_net | 달·아카시아·풀밭 | `lm_lb_night_net` **라이트박스** | 달(70~82%, 5~25%), 아카시아 왼쪽·작은 아카시아 오른쪽, 풀밭(60~100%) 가운데 비움 | 달 구멍, 별 구멍, 언덕 Lilac→Deep Plum, 아카시아 Night Navy, 풀밭 Pale Sage | `lm_layer_fern_night_front` x 980·y 590(뒤집어) | 기존 |
| 6 아침 초원 (가로로 흐르는 긴 띠) | morning_nosun | 띠를 거울로 이어 붙이므로 그림 양끝이 같은 높이여야 함 | `lm_lb_morning_nosun` **라이트박스, 해 없음** | 아카시아(밑동 x 80%, y 70%), 왼쪽 먼 아카시아, 땅(70~100%) 비움. **양끝 지평선 높이 같게, 끝에 걸치는 물체 없게** | 지평선 띠(35~50%) Amber Glow → Honey → Peach 하늘, 언덕 Pale Gold→Deep Plum 물결, 아카시아·덤불 Night Navy, 땅 Wheat. 해는 코드(`lm_sun`)가 하나만 고정 | 없음(스크롤) | 기존 |

## 2. 색지

- 초원 낮(20색): Sky Paper `#A9D3F0`, Mist Mint `#CFE6DA`, Light Cream `#F3E9C8`, Sunny Yellow `#F2C94E`, Peach `#F4C7A1`, Pale Gold `#EBD08A`, Sand `#E9DCC0`, Wheat `#E4C877`, Straw Gold `#D9A94E`, Olive `#7A8F3C`, Moss `#6E8B3D`, Leaf Green `#8CBF5A`, Pine Green `#3F6B4F`, Lavender Dusk `#8B7BB8`, Bark Brown `#6B4A32`, Cocoa `#4E3524`, Clay `#B8794F`, Rust `#B5552E`, Coral `#E36B5C`, Stone Grey `#A9A39B`
- 생쥐 눈높이(20색): 위 + Fern, Snow White, Lilac `#B9A3D6`, Kraft, Bean Red, Mist Mint
- 라이트박스 밤(10색): Amber Glow `#FFD27A`, Twilight Violet `#4A3F7A`, Lilac, Lavender Dusk, Deep Plum `#3B2A5C`, Night Navy `#141C3A`, Ink Dark `#1A1410`, Moonlight `#DDE6F2`, Pale Sage `#BFD3B4`, Stone Grey
- 라이트박스 새벽(11색): Amber Glow, Honey `#F6B84B`, Peach, Pale Gold, Tangerine `#F28C28`, Rust, Velvet Red `#8E2F3A`, Deep Plum, Night Navy, Ink Dark, Wheat

## 3. 라이트박스 장면 (3장)

1. **밤 숲** `lm_lb_night_forest` — 사자가 그물에 걸린 큰 순간. lightbox_deer 처럼 양옆 큰 나무가 액자 실루엣, 달이 구멍. 공터는 Pale Sage 라 사자·그물(원래 색)이 또렷. 반딧불은 구멍 15개(코드 점 없이도 빛남).
2. **사각사각** `lm_lb_night_net` — 생쥐가 밧줄을 끊는 장면. 풀밭 Pale Sage, 아카시아 실루엣.
3. **아침 초원** `lm_lb_morning_nosun` — 둘이 함께 달리는 결말. 지평선 띠 전체가 Amber Glow 라 띠를 이어 붙여도 해가 둘로 늘지 않는다(해는 코드가 하나). 끝 장면이 가장 밝은 그림이 되어 밤 → 아침 대비가 선다.

소품 높이(무대 px, 시작값): 풀 포기 110(폭 140), 아카시아 가지 180(폭 360), 거인 데이지 260, 흰개미 탑 160, 밤 고사리 110(폭 150), 바위 더미 90(폭 150).

## 4. 새로 그릴 그림 (11장)

배경 2: `lm_bg_savanna_v2`(← savanna.png), `lm_bg_grass_v2`(← grass.png). 라이트박스 3(모두 pass 1, 원본 refs): `lm_lb_night_forest`(← night_forest.png), `lm_lb_night_net`(← night_net.png), `lm_lb_morning_nosun`(← morning.png). 소품 6: `lm_layer_grass_front`, `acacia_branch_top`, `daisy_giant`, `termite_mound`, `fern_night_front`, `rocks_front`.

받은 뒤 점검: ① 아카시아 밑동(66%/70%)·공터(10~90%, 57~90%)·달 자리가 원본 ±2% 인지 ② 아침 lb 양끝 지평선 높이가 같고 끝에 걸친 물체가 없는지, **해가 없는지** (있으면 재생성) ③ 라이트박스 3장에 그라데이션·빛살 없음 ④ 소품 얼굴 없음(무당벌레·딱정벌레 포함) ⑤ 사자 등 미끄럼 좌표(`climb`)는 사자 그림 기준이라 배경과 무관.

## 5. 코드 작업 (별도 큐)

- `lion_mouse.js` `BG` 에 `_v2`·`_lb` 키, `BG_EDGE` 재측정. `morning_nosun` → `lm_lb_morning_nosun` 교체(스크롤·거울 이어 붙이기 그대로). `grassForestBG`·`savannaBG`·`nightHighBG`·`nightNetBG` 에 소품 `put`.

## 6. 판단이 필요한 부분

1. **아침 초원 전체를 라이트박스로**: 결말 달리기(밝고 신나는 장면)가 실루엣 땅이 되면 어두워 보일 수 있다. 땅은 Wheat(밝음)·덤불만 Night Navy 로 적었다. 추천: 생성 결과가 칙칙하면 낮 `savanna_v2` 를 nosun 으로 다시 만들어 쓴다.
2. **비교 판·lowangle 안 바꿈**: 비교 판은 학습 화면이라 조용해야 하고, lowangle 은 코드에서 안 쓴다. 추천: 그대로.

## 7. 확정 사항

- 사자·생쥐·그물·카드 그림, 대사·녹음·조작은 바꾸지 않는다. 아카시아·공터·달 자리는 원본과 같은 % 로 유지.
- 작업표 11항목은 `jobs_lion_mouse.json` 끝에 붙였고 기존 7항목은 그대로.
