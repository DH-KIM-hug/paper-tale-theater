# 해와 달이 된 오누이 — 시각 재기획 (층층 고개·하늘 나라·라이트박스 3장)

작성 2026-10-23. 근거: CLAUDE.md §7-5-1 "기존 동화도 같은 수준으로 다시 그린다", "빛 상자(라이트박스) 장면 허용". 형식은 `tales/snow_white/VISUAL_PLAN.md`, 참고 그림 정리는 `tales/goldilocks/VISUAL_PLAN.md` §0.

이 문서는 **배경·레이어 소품·라이트박스 실루엣 층**만 다룬다. 인물(엄마·오누이·호랑이·해님·달님)과 누르는 소품(떡 바구니·문·등잔·동아줄·우물)은 바꾸지 않는다. 대사·녹음·조작 그대로. 생성은 확정 뒤.

작업표: `tools/app/gen/jobs_sunmoon.json` 끝에 붙인 14항목(배경 `sm_bg_*_v2` 5 + 레이어 `sm_layer_*` 5 + 라이트박스 `sm_lb_*` 3 + 실루엣 앞층 1).

## 1. 방향과 원칙

- **화려하게 하는 장면**: ① 고개 셋(2~4장, 금빛 → 노을 → 밤의 층층 산) ② 하늘 나라(13장) ③ 초가집 앞(1장 엄마 떠남).
- **라이트박스 3장**(이 동화의 큰 순간): ⑴ 하늘 동아줄(11장) — 달빛이 비치는 밤하늘, 오누이가 줄을 타고 오른다. ⑵ 우물가 큰 나무·나무 아래 호랑이(7·9장) — 보름달 뒤의 큰 나무 실루엣. ⑶ 수수밭(12장) — 지는 해 앞의 수수 실루엣, 호랑이가 떨어진다.
- **바꾸지 않는 장면**: 부잣집 부엌(1장 `kitchen`, 떡 세기), 방 안·문(5·6장 `room2_lamp`·`door2_lamp`, 등잔·문 조작), 뒷마당(8장 `backyard2_night`, 장독 숨기), 우물 속(8장 `wellTop`). 조작이 있는 장면은 배경을 조용히 두고 가장자리 소품만.
- 재료 원칙 그대로(1조각 1색, 무광, 웜 그림자, 소품 얼굴 없음, 원근법 금지). 라이트박스는 층 밝기 차이로만 빛을 표현.
- 광원: 낮·노을 장면 세트 A. 밤 장면 세트 B(오른쪽 위 달). 라이트박스는 뒤의 광원.
- **인물·누르는 대상 주변 비우기**:
  - 고개: 바위(왼쪽, 호랑이가 숨는 자리)와 이정표(오른쪽)는 **기존 `sm_bg_hill_dusk*` 와 같은 자리·크기**. 엄마가 걷는 길(가로 30~75%, 세로 70~100%)은 민무늬 길.
  - 큰 나무: 기둥 가운데·오른쪽 굵은 가지(오누이 자리)·왼쪽 우물·오른쪽 초가는 기존 `sm_bg_tree2_night` 와 같은 자리(코드 `TREE` 표가 원본 픽셀을 참조한다).
  - 하늘 동아줄: 줄·오누이가 오르는 가운데 세로 띠(가로 35~65%)에 구름 실루엣을 두지 않는다. 구름은 양옆.
  - 수수밭: 호랑이가 떨어지는 가운데(가로 30~70%, 세로 20~80%)는 수수 없이 하늘·먼 밭만. 수수는 양옆과 앞 띠.
  - 하늘 나라: 해님·달님 배우(가로 20~80%, 세로 10~60%) 자리는 구름·꽃 없이 민무늬 하늘.

## 2. 색지 목록

### 2-1. 고개 셋(금빛 → 노을 → 밤, 한 세트) — 20색
| 색지 | HEX | 쓰는 곳 |
|---|---|---|
| Glow Gold | `#F7D77A` | 금빛 하늘(hill0) |
| Peach | `#F4C7A1` | 노을 하늘 아래 띠(hill1) |
| Hot Coral | `#F0624D` | 노을 하늘 가운데(hill1) |
| Magenta Paper | `#C2397A` | 노을 구름(hill1) |
| Deep Indigo | `#1F2A56` | 밤하늘(hill2) |
| Night Violet | `#2B1E4F` | 밤 먼 산(hill2) |
| Mist Lilac | `#D7CCE8` | 가장 먼 산(hill0·1) |
| Lavender Dusk | `#8B7BB8` | 둘째 산 |
| Plum Purple | `#7B4F8C` | 셋째 산 |
| Grape | `#5A2D82` | 넷째 산(신규) |
| Tangerine | `#F28C28` | 소용돌이 단풍 나무 잎 바깥 |
| Persimmon | `#E8703A` | 단풍 잎 가운데 |
| Bean Red | `#A93B32` | 단풍 잎 안쪽 |
| Marigold | `#F5B700` | 은행나무 잎(신규) |
| Pine Green | `#3F6B4F` | 소나무 |
| Deep Teal | `#1F5F5B` | 앞 소나무 |
| Olive | `#7A8F3C` | 억새·풀 띠(신규) |
| Straw Gold | `#D9A94E` | 억새 이삭 |
| Sand | `#E9DCC0` | 길 |
| Stone Grey | `#A9A39B` | 바위(기존 자리) |

### 2-2. 하늘 나라(13장)·초가집(1장) — 16색
| 색지 | HEX | 쓰는 곳 |
|---|---|---|
| Sky Paper | `#A9D3F0` | 하늘 |
| Glow Cream | `#FBF1C8` | 구름 밝은 판 |
| Paper Cream | `#F6ECD8` | 구름 둘째 판, 초가 벽 |
| Baby Blue | `#8FC1E3` | 구름 그림자 판 |
| Mist Lilac | `#D7CCE8` | 먼 산 |
| Spring Green | `#B5D36B` | 들판 |
| Leaf Green | `#8CBF5A` | 언덕 |
| Pine Green | `#3F6B4F` | 나무 |
| Magenta Paper | `#C2397A` | 꽃밭(코스모스) |
| Blossom Pink | `#F2A7B5` | 코스모스 둘째 |
| Marigold | `#F5B700` | 국화 |
| Persimmon | `#E8703A` | 감, 단풍 |
| Bean Red | `#A93B32` | 무지개 띠·감 |
| Sky Blue | `#3E7CB1` | 무지개 띠 |
| Plum Purple | `#7B4F8C` | 무지개 띠 |
| Straw Gold | `#D9A94E` | 초가 지붕 |

### 2-3. 라이트박스(밤하늘·큰 나무·수수밭) — 13색
| 색지 | HEX | 층 |
|---|---|---|
| Glow Cream | `#FBF1C8` | 달 둘레 맨 뒤 빛 판 |
| Moon Ice | `#E8EEF7` | 달(신규) |
| Glow Gold | `#F7D77A` | 수수밭 해 둘레 |
| Glow Amber | `#F5A64B` | 수수밭 지평선 띠 |
| Hot Coral | `#F0624D` | 수수밭 하늘 가운데 |
| Lavender Dusk | `#8B7BB8` | 달빛 구름·먼 산 |
| Plum Purple | `#7B4F8C` | 둘째 산·구름 |
| Grape | `#5A2D82` | 셋째 산 |
| Night Violet | `#2B1E4F` | 중간 실루엣(나무 줄) |
| Silhouette Navy | `#1C2340` | 앞 실루엣(밤)(신규) |
| Silhouette Ink | `#2A2118` | 앞 실루엣(수수밭 노을) |
| Moonlight | `#DDE6F2` | 달빛 받은 땅 띠 |
| Fawn | `#C98B5A` | 수수밭 땅 띠 |

## 3. 장면별 표

| # | 장면 | 배경(지금) | 지금 문제 | 새 배경 / 층 구성(먼→앞) | 카메라 |
|---|---|---|---|---|---|
| 1 | 부잣집 부엌 | `kitchen` | 바꾸지 않음(떡 세기) | 소품: 매단 마늘·고추 끈 위 모서리 | 기존 |
| 1' | 초가집(엄마 떠남) | `cottage` | 노란 하늘 한 장, 산 2겹 | `sm_bg_cottage_v2`: 초가·문·마루 자리 그대로(refs). 뒤에 층층 산 4겹(Mist Lilac→Grape), 감나무를 소용돌이 잎 3색(주황·감·빨강)으로 크게, 마당 가장자리 국화·코스모스 덤불 | 눈높이 |
| 2 | 첫째 고개 | `hill_dusk_gold` | 산 3겹·바위·이정표. 땅이 평평한 모래 한 장 | `sm_bg_hill_gold_v2`: 바위·이정표 자리 그대로. 산 5겹(Mist Lilac→Grape, 같은 능선 모양을 명도 단계로), 양옆 단풍·은행 소용돌이 나무, 억새 띠 | 눈높이 → 호랑이 1.6배(기존) |
| 3 | 둘째 고개 | `hill_dusk` | 같음 | `sm_bg_hill_dusk_v2`: 같은 구성, 하늘 Hot Coral·Peach·Magenta 구름 | 같음 |
| 4 | 셋째 고개 | `hill_dusk_night` | 같음 | `sm_bg_hill_night_v2`: 같은 구성, 하늘 Deep Indigo, 산 Night Violet 계열, 달(Moon Ice) 오른쪽 위 | 같음 |
| 5~6 | 똑똑똑·문틈·창호지 | `room2_lamp`·`door2_lamp` | 바꾸지 않음 | — | 기존 |
| 7 | 우물가 큰 나무 | `tree2_night` | 이미 달밤. 나무가 밝은 크림 잎이라 빛 상자 느낌이 약함 | **라이트박스** `sm_lb_tree_moon`(§4-2) | 기존 |
| 8 | 뒷마당·우물 속 | `backyard2_night`·`wellTop` | 바꾸지 않음(장독·우물 조작) | — | 기존 |
| 9 | 나무 아래 호랑이 | `tree2_night` | 7장과 같음 | `sm_lb_tree_moon` 재사용 | 기존 |
| 11 | 하늘 동아줄 | `sky` | 이미 구름·빛줄기. 빛이 "그린 것"이라 뒤 광원 느낌이 없음 | **라이트박스** `sm_lb_sky_rope`(§4-1) | 기존(세트가 위로 흐름) |
| 12 | 수수밭 | `sorghum_dusk` | 수수가 가운데까지 차서 호랑이가 묻힘 | **라이트박스** `sm_lb_sorghum`(§4-3) | 기존 |
| 13 | 해와 달 | `heaven`→`heaven_night` | 노란 하늘·초록 들판 두 장. 밋밋 | `sm_bg_heaven_v2`(낮): 층층 구름 3겹(Glow Cream·Paper Cream·Baby Blue), 작은 무지개 띠(오른쪽 아래, 4색), 들판에 꽃밭 띠(코스모스·국화), 먼 산 Mist Lilac. 밤은 코드 남색 장막 그대로(판단 1) | 기존 |

## 4. 라이트박스 장면

### 4-1. 하늘 동아줄 (`sm_lb_sky_rope`, 11장)
- 뒤층(빛): Glow Cream 달 둘레 큰 판(가로 50%, 세로 15% 중심) → Moon Ice 달 → Lavender Dusk 하늘(실은 맨 뒤 종이) 위에 별 조각(Glow Cream 작은 별 12).
- 중간층: Plum Purple 큰 구름 3덩어리 양옆(가로 0~30%, 70~100%), Grape 둘째 구름.
- 앞층: Night Violet 먼 산 능선 → Silhouette Navy 소나무 실루엣 줄(세로 70~100%, 아래 띠). 땅(세로 85~100%) Moonlight 띠.
- **가운데 세로 띠(가로 35~65%)는 비운다** — 동아줄과 오누이가 오른다. 세트가 위로 흐르는 장면이라 배경은 고정(기존 코드), 줄·구름·오누이만 움직인다.
- 코드: 기존 빛줄기 대신 달 둘레 `glow` 숨 쉬기, 별 깜빡 6개.

### 4-2. 우물가 큰 나무 달밤 (`sm_lb_tree_moon`, 7·9장)
- 뒤층(빛): Glow Cream 보름달 둘레 판(그림 가로 ≈ 88%, 세로 ≈ 12%, 기존 달 자리) → Moon Ice 달 → Lavender Dusk 하늘.
- 중간층: Plum Purple → Grape 먼 산 2겹, Night Violet 먼 나무 줄.
- **큰 나무**: 기둥·굵은 오른쪽 가지·잎 덩어리를 **기존 `sm_bg_tree2_night` 와 같은 자리·크기**(refs; 코드 `TREE` 표가 원본 픽셀을 가리킨다). 나무는 Silhouette Navy 한 장 실루엣, 잎 덩어리는 Night Violet 둥근 조각들(가지 사이로 달빛 판이 비친다). 오누이는 보통 색 그림이라 어두운 가지 위에서 또렷하다.
- 왼쪽 우물·오른쪽 초가: 자리 그대로. 우물은 Stone Grey 돌 + Silhouette Navy 지붕(중간 밝기 — 호랑이가 우물을 들여다보는 자리). 초가 창은 Ember Amber 빛 판.
- 땅(세로 75~100%): Moonlight 띠(달빛 받은 마당). 호랑이(주황)가 서는 곳이라 밝게.
- 코드: 달 `glow`, 반딧불 8(양옆·위만), 초가 창 `glow`.

### 4-3. 수수밭 노을 (`sm_lb_sorghum`, 12장)
- 뒤층(빛): Glow Gold 해 둘레 → Glow Amber 지평선 띠 → Hot Coral 하늘 → Magenta Paper 구름 띠. 해는 Glow Cream 원(가로 50%, 세로 45%).
- 중간층: Plum Purple → Grape 먼 산, Night Violet 먼 수수밭 띠(세로 60~72%).
- 앞층: Silhouette Ink 수수 실루엣(이삭 머리 + 잎)이 **양옆(가로 0~28%, 72~100%)과 앞 띠(세로 88~100%)** 에만. 가운데는 비워 호랑이가 떨어지는 길. 땅 Fawn 띠.
- 코드: 해 `glow`, 호랑이 떨어질 때 `shake`, 수수 흔들림은 소품 `sm_layer_sorghum_front` 로.

## 5. 레이어 소품

| 소품 | 내용 | 높이 | 자리(가로 / 세로 P) | 층 | 장면 |
|---|---|---|---|---|---|
| `sm_layer_pampas_front` | 억새 묶음(Olive 잎 + Straw Gold 이삭) | 130 | x 40, y 590 · x 980(뒤집어) | 앞 | 2·3·4 |
| `sm_layer_maple_branch` | 소용돌이 단풍 가지(주황·감·빨강 3색) | 180 | x 940 / 700, y −24 · x 60(뒤집어) | 앞(위) | 1'·2·3 — `rotate` ±1°(8초) |
| `sm_layer_chrysanthemum_mid` | 국화·코스모스 띠(폭 ≈1000, 자홍·분홍·노랑·흰) | 80 | x 500, y 552 | 중간(맨 뒤 소품) | 1'·13 |
| `sm_layer_cloud_front` | Plum Purple 구름 한 덩어리(얼굴 없음) | 120 | x 120·880, y 80~160 | 앞 | 11 — 위로 흐름(기존 구름 코드와 같은 속도) |
| `sm_layer_sorghum_front` | Silhouette Ink 수수 묶음(이삭 3) | 160 | x 60, y 600 · x 950(뒤집어) | 앞(맨 앞) | 12 — 호랑이 떨어질 때 `wiggle(4,500)` |
| `sm_layer_sil_pine` | Silhouette Navy 소나무 가지 실루엣(위 모서리) | 200 | x 60, y −24 · x 940(뒤집어) | 앞(맨 앞) | 7·9·11 라이트박스 — `rotate` ±1°(9초) |

z 순서: `chrysanthemum_mid` → 배우 → `pampas`·`maple`·`cloud`·`sorghum`·`sil_pine`(맨 앞). 세로 화면은 x < 285 / > 715 만.

## 6. 새로 그릴 그림 (14장, `jobs_sunmoon.json` 끝)

| 구분 | id | 내용 | refs |
|---|---|---|---|
| 배경 | `sm_bg_cottage_v2` | 초가집 앞, 집·문 자리 그대로 | `sm_bg_cottage` |
| 배경 | `sm_bg_hill_gold_v2` | 첫째 고개 금빛, 바위·이정표 자리 그대로 | `sm_bg_hill_dusk_gold` |
| 배경 | `sm_bg_hill_dusk_v2` | 둘째 고개 노을(같은 구도) | `sm_bg_hill_dusk`, `sm_bg_hill_gold_v2` |
| 배경 | `sm_bg_hill_night_v2` | 셋째 고개 밤(같은 구도) | `sm_bg_hill_dusk_night`, `sm_bg_hill_gold_v2` |
| 배경 | `sm_bg_heaven_v2` | 하늘 나라(구름 3겹·무지개·꽃밭) | `sm_bg_heaven` |
| 라이트박스 | `sm_lb_sky_rope` | §4-1 | `sm_bg_sky` |
| 라이트박스 | `sm_lb_tree_moon` | §4-2, 나무·우물·초가 자리 그대로 | `sm_bg_tree2_night` |
| 라이트박스 | `sm_lb_sorghum` | §4-3 | `sm_bg_sorghum_dusk` |
| 소품 | `sm_layer_pampas_front` / `sm_layer_maple_branch` / `sm_layer_chrysanthemum_mid` / `sm_layer_cloud_front` / `sm_layer_sorghum_front` | §5 | — |
| 실루엣 | `sm_layer_sil_pine` | §5 | — |

- 고개 셋은 `hill_gold_v2` 를 먼저 받아 둘째·셋째의 refs 로 넣는다(pass 2) — 바위·이정표·길이 세 장에서 같은 자리에 있어야 호랑이 숨기 코드가 그대로다.
- 받은 뒤 점검: ① 고개 셋의 바위·이정표·길 위치가 서로·기존과 같은지(겹쳐 보기 ±2%) ② 큰 나무 라이트박스의 기둥·가지·우물·초가가 `TREE` 표 픽셀과 맞는지 ③ 동아줄 가운데 띠·수수밭 가운데·하늘 나라 위쪽이 비었는지 ④ 라이트박스 조각 안 그라데이션 없음, 땅 띠가 실루엣보다 밝은지 ⑤ 소품 얼굴 없음.

## 7. 판단이 필요한 부분

1. **하늘 나라 밤**: 지금은 `heaven_night`(같은 그림을 밤으로 구움)을 톡 하면 서서히 바꾼다. v2 는 낮 한 장만 그리고 밤은 코드 남색 장막(이미 있음)으로 처리하는 것을 추천. 밤 그림이 꼭 필요하면 `sm_bg_heaven_v2` 를 밤으로 구워 `sm_bg_heaven_night_v2` 로(생성 아님, 후처리).
2. **큰 나무를 실루엣으로**: 기존 그림은 크림색 잎의 밝은 나무다. 실루엣으로 바꾸면 오누이(작은 배우)가 가지 위에서 더 또렷해지지만, 호랑이가 나무를 오르는 장면(9장)에서 주황 호랑이가 Silhouette Navy 기둥 위에서는 잘 보이고 Night Violet 잎 앞에서는 살짝 묻힐 수 있다. 추천: 잎 덩어리를 Grape(한 단계 밝게)로.
3. **수수밭 수수 색**: 원작 분위기(수숫대가 호랑이 피로 붉어진다)는 쓰지 않는다. 수수는 실루엣이고 이삭 색은 넣지 않는다(아이에게 거친 장면 줄이기, 기획 원칙 §1).

## 8. 확정 사항

- 인물·누르는 소품·대사·녹음·조작은 바꾸지 않는다. 떡 세기·방·문·뒷마당·우물 속 배경은 그대로.
- 작업표 14장은 `jobs_sunmoon.json` 끝에 붙였고 기존 항목은 바꾸지 않았다.
