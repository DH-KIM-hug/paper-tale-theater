# 황소와 개구리 — 시각 재기획 (화려한 연못·풀밭 + 라이트박스)

작성 2026-10-23. CLAUDE.md §7-5-1 적용. 배경·층 소품·라이트박스 배경만 다룬다. 개구리 가족·황소·오리·양·올챙이·기린 키재기 표·연잎 소품 그림, 대사·녹음·조작은 그대로.

작업표: `tools/app/gen/jobs_frog.json` 끝 11항목(배경 `frog_bg_*_v2` 3 + 라이트박스 `frog_lb_*` 2 + 소품 `frog_layer_*` 6). 출력 `assets/raw/restyle/frog/` → `post_tale.py frog`. 참고 그림 분석은 `tales/patjuk/VISUAL_PLAN.md` §0.

무대 ↔ 그림: `BGX` x −40~1040, y −22~583. 가로 % = (x + 40) / 1080, 세로 % = (y + 22) / 605.

## 1. 지금 문제와 새 구성

| 장면 | 지금 배경 | 문제 | 새 배경 | 유지(% 명시) | 더하는 층 | 앞·위 소품(가로 자리) | 카메라 |
|---|---|---|---|---|---|---|---|
| 1 풀밭 · 2 커다란 무언가 · 6 폴짝 대회(출발) | meadow | 풀·민들레·꽃 몇 송이, 가운데 비어 있음 | `frog_bg_meadow_v2` | 풀밭 바닥(62~100%) **가운데 25~75% 비움**(아기 개구리 y 490, 황소), 양옆 풀(0~25%, 75~100%), 언덕선 48%, 왼쪽 위 민들레 | 산 2겹, 먼 숲, 먼 꽃 띠, 큰 들꽃(데이지·미나리아재비·양귀비·초롱꽃·클로버), 현삼, 나비, 달팽이집·무당벌레(얼굴 없음), 이끼 돌 | `frog_layer_grass_front` x 30·y 590 / `frog_layer_wildflowers_mid` x 500·y 400(중간, 언덕선 아래) | 기존 |
| 2 커다란 무언가(황소 등장 순간) | meadow | — | `frog_lb_meadow_sun` **라이트박스** | v2 와 같은 자리 | 해 구멍(55~85%, 5~40%), 산 Pale Gold→Velvet Red, 양옆 풀·꽃 Deep Plum·Night Navy 실루엣, 바닥 Wheat | 같음 | 기존. 황소가 들어오는 순간 v2 → lb 크로스페이드, 황소가 멈추면 다시 v2 |
| 3 연못 · 5 연못가 · 6 폴짝 대회 | pond | 연잎 5장 + 물 한 장 + 갈대 | `frog_bg_pond_v2` | **연잎 5장 중심 x 19.4·34.5·49.7·64.9·80.2%, y 57%**(PADS.day 170~826, y 324), 수면선 44%, 양 아래 모서리 흙 둑 | 언덕 3겹, 물결 띠 3겹(Lagoon·Sky Blue·Sea Teal)+크림 물마루, 수련 2송이(연잎 옆), 잠자리, 붓꽃, 이끼 통나무, 오리집 기둥(동물 없음) | `frog_layer_reeds_front` x 30·y 590 / `frog_layer_lily_front` x 985·y 590 / `frog_layer_dragonfly` x 880·y 160(코드 flutter) | 기존(세로는 squeeze 카메라) |
| 4 키재기 | chart | 크림 벽 + 기린 표 | `frog_bg_chart_v2` | **기린(42~60%, 5~80%), 자 띠(49~52%)**, 바닥 윗선 80%(floor 486), 자 앞 띠(35~65%, 60~100%) 비움 | 아이보리 패널 2겹·금 몰딩, 벽 구름, 창, 꽃 덤불, 화분 해바라기, 물뿌리개, 튤립, 블록 탑, 새집 | `frog_layer_fern_front` x 30·y 590 | 기존 |
| 7 밤 연못 | pond_night | 남색 하늘·달·연잎 | `frog_lb_pond_night` **라이트박스** | **연잎 5장 중심 x 25.6·39.2·52.2·65.7·79.0%, y 54%**(PADS.night), 수면선 42%, 앞 모래 둑(70~100%) | 달 구멍(15~28%, 5~22%) Amber Glow, 반딧불 구멍 20개, 언덕 Lilac→Deep Plum, 물 Lagoon 어둡게+달빛 파문, 연잎 Pale Sage(물보다 밝게), 갈대 Night Navy | `frog_layer_reeds_front` x 30·y 590(코드 tint 어둡게) | 기존 |

## 2. 색지

- 연못(21색): Sky Paper `#A9D3F0`, Light Cream `#F3E9C8`, Sunny Yellow `#F2C94E`, Pale Sage `#BFD3B4`, Spring Green `#B5D36B`, Leaf Green `#8CBF5A`, Olive `#7A8F3C`, Pine Green `#3F6B4F`, Deep Teal `#1F5F5B`, Lagoon `#4FB3C9`, Sky Blue `#3E7CB1`, Sea Teal `#2A7A8C`, Powder Blue `#BFE0F2`, Bark Brown `#6B4A32`, Clay `#B8794F`, Stone Grey `#A9A39B`, Snow White `#F4F6FA`, Blossom Pink `#F2A7B5`, Plum Purple `#7B4F8C`, Kraft `#C9A574`, Moss `#6E8B3D`
- 풀밭(20색): 위 초록 5색 + Slate Blue `#5A6E8C`, Lavender Dusk `#8B7BB8`, Fern `#5E8C5A`, Pale Gold `#EBD08A`, Coral `#E36B5C`, Lilac `#B9A3D6`, Bean Red `#A93B32`, Kraft, Stone Grey, Moss
- 키재기(21색): Paper Cream, Ivory `#EFE3CC`, Pale Gold, Fawn `#C98B5A`, Cocoa, Sky Blue, Coral, Lilac, Bean Red, Lagoon 등
- 라이트박스 밤(12색): Amber Glow `#FFD27A`, Twilight Violet `#4A3F7A`, Lilac, Lavender Dusk, Deep Plum `#3B2A5C`, Night Navy `#141C3A`, Ink Dark `#1A1410`, Moonlight `#DDE6F2`, Lagoon, Sea Teal, Pale Sage, Wheat `#E4C877`
- 라이트박스 해(11색): Amber Glow, Honey `#F6B84B`, Dusk Orange `#F09A5B`, Pale Gold, Tangerine `#F28C28`, Rust `#B5552E`, Velvet Red `#8E2F3A`, Deep Plum, Night Navy, Ink Dark, Wheat

## 3. 라이트박스 장면 (2장)

1. **밤 연못** `frog_lb_pond_night` — lightbox_whale 처럼 달이 가장 밝은 구멍, 반딧불은 덤불 층의 작은 구멍. 연잎은 Pale Sage 로 물보다 밝아 개구리(원래 색)가 연잎 위에 또렷하다. 코드의 반딧불 점은 그대로 겹쳐도 됨.
2. **커다란 무언가** `frog_lb_meadow_sun` — 황소가 나타나는 큰 순간. 해 구멍 뒤 빛, 거인 풀·꽃이 실루엣. 황소·개구리는 원래 색. 크로스페이드로 잠깐(황소 등장 ~ 대사 한 줄)만 쓰고 v2 로 돌아온다.

소품 높이(무대 px, 시작값): 갈대 230, 앞 수련 140(폭 220), 풀 포기 100(폭 130), 잠자리 50(폭 65), 들꽃 띠 90(폭 ≈1000), 고사리 110(폭 150). 폴짝 대회(세로 카메라 따라감)에는 앞 소품 없음.

## 4. 새로 그릴 그림 (11장)

배경 3: `frog_bg_pond_v2`(← pond.png), `frog_bg_meadow_v2`(← meadow.png), `frog_bg_chart_v2`(← chart.png). 라이트박스 2: `frog_lb_pond_night`(← pond_night.png, pass 1), `frog_lb_meadow_sun`(pass 2 ← meadow_v2 + 원본). 소품 6: `frog_layer_reeds_front`, `lily_front`, `grass_front`, `dragonfly`(얼굴 없음), `wildflowers_mid`(가로 띠), `fern_front`.

받은 뒤 점검: ① 연잎 5장 중심이 낮·밤 각각 원본 ±1.5% 인지(개구리가 연잎 위에 서야 함 — 가장 중요) ② 기린·자 띠가 같은 자리인지 ③ 풀밭 가운데 25~75% 비었는지 ④ 라이트박스에 그라데이션·빛살 없음 ⑤ 잠자리·달팽이집·무당벌레에 얼굴 없음.

## 5. 코드 작업 (별도 큐)

- `frog.js` `ART` bg 키를 `_v2`/`_lb` 로, `EDGE` 색 재측정, `PADS` 는 그림이 같은 자리면 그대로. `pondBG`·`grassBG`·`chartBG` 에 소품 `put`, `flutter(dragonfly)`.
- 황소 등장 크로스페이드(2장), 밤 연못은 lb 로 교체.

## 6. 판단이 필요한 부분

1. **연잎 자리**: 생성이 연잎을 조금만 옮겨도 개구리가 물에 선다. 추천: 겹쳐 보고 ±1.5% 넘으면 재생성, 두 번 어긋나면 기존 연못 유지.
2. **황소 등장 라이트박스**: 잠깐 어두워졌다 돌아오는 연출이 3~4세에게 놀랄 수 있다. 추천: 크로스페이드 1.5초로 부드럽게, 효과음은 기존 쿵 소리만.

## 7. 확정 사항

- 인물·동물·소품 그림, 대사·녹음·조작은 바꾸지 않는다. 연잎·기린·바닥선은 원본과 같은 % 로 유지.
- 작업표 11항목은 `jobs_frog.json` 끝에 붙였고 기존 항목은 그대로.
