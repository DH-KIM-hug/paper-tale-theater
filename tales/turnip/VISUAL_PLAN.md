# 커다란 순무 — 시각 재기획 (화려한 다층 텃밭 + 라이트박스)

작성 2026-10-23. CLAUDE.md §7-5-1(기존 동화도 화려한 다층 페이퍼아트, 라이트박스 1~3장면) 적용.

배경·층 소품·라이트박스 배경만 다룬다. 할아버지·할머니·손녀·강아지·고양이·생쥐·순무 그림, 대사·녹음·조작(톡 당기기·고르기)은 그대로. 코드 좌표는 그림이 온 뒤 별도 큐.

작업표: `tools/app/gen/jobs_turnip.json` 끝 15항목(배경 `tn_bg_*_v2` 7 + 라이트박스 `tn_lb_*` 2 + 소품 `tn_layer_*` 6). 출력 `assets/raw/restyle/turnip/` → `post_tale.py turnip`. 참고 그림 분석은 `tales/patjuk/VISUAL_PLAN.md` §0.

무대 ↔ 그림: 그림은 무대 x −40~1040, y −24~585(`bgImage` 1080×608.7). 가로 % = (x + 40) / 1080, 세로 % = (y + 24) / 609.

## 1. 지금 문제와 새 구성

| 장면 | 지금 배경 | 문제 | 새 배경 | 유지(% 명시) | 더하는 층 | 앞·위 소품(가로 자리) | 카메라 |
|---|---|---|---|---|---|---|---|
| 씨 뿌리기·무럭무럭·영차 줄(옆모습 텃밭) | garden | 흙밭 한 장 + 울타리 + 언덕 2겹 + 집. 흙이 화면 절반이라 밋밋 | `tn_bg_garden_v2` | 흙 윗선 세로 58%, 울타리(0~22%, 32~58%), 집(76~93%, 10~32%), 순무 잎(70~100%, 38~62%). **흙밭 가로 10~75% 는 비움**(순무 TX 205·줄 LINE_X 335~683, GROUND 480) | 언덕 4겹, 과수원 줄, 해바라기·접시꽃 화단, 얼굴 없는 허수아비 기둥, 콩 지주, 손수레·물뿌리개, 양배추·당근 줄, 벌통, 새집, 나비 | `tn_layer_grass_front` x 30·y 590 / `tn_layer_sunflowers` x 950·y 470(중간, 울타리 뒤) | 기존 lineCam |
| 마지막 당기기 "쑥!" | garden | 같은 그림 | `tn_lb_garden_dusk` **라이트박스** | v2 와 같은 자리, 흙밭 10~75% 비움 | 해 구멍(40~60%, 10~45%), 언덕 Pale Gold→Deep Plum, 울타리·순무 잎 Night Navy 실루엣, 흙 Clay | 같음 | 기존. 마지막 pullRound 직전 v2 → lb 크로스페이드 |
| 할아버지 혼자 영차(로우앵글) | lowangle | 덩굴·흙 띠·하늘 | `tn_bg_lowangle_v2` | 흙 윗선 80%(bgFront 484), 덩굴 양옆(0~30%, 70~100%), 하늘 가운데(30~70%, 0~55%) 비움 | 잎 3겹·완두 꼬투리·보라 콩꽃, 옆에서 본 해바라기, 토마토, 달팽이집(얼굴 없음) | `tn_layer_bean_vine_top` x 60·y −24 | 기존 |
| 할머니~! (문) | door | 통나무집·호수·노을, 앞 잔디 비어 있음 | `tn_bg_door_v2` | **문(31~38%, 45~65%)** = DOOR 298~371/249~370, 집(5~45%, 10~66%), 잔디(66~100%) | 산 3겹, 노을 띠, 창가 꽃 상자, 장미, 빗물통·장작, 자작나무, 수국, 벤치, 빨랫줄 | `tn_layer_grass_front` x 980·y 590 | 기존 |
| 멍멍! (덤불) | fence | 울타리 가운데가 **빈 크림 벽판**이라 어색 | `tn_bg_fence_v2` | 울타리 위 33%·아래 66%, 잔디(66~100%). 가운데 벽판(37~63%)을 울타리로 잇고, 덤불(코드 x 338~770, y 378~630)이 덮는 아래 가운데는 잔디 | 언덕 4겹, 풍차, 접시꽃·루핀·튤립·장미, 새집, 물뿌리개 | `tn_layer_fence_flowers` x 120·y 430(중간) | 기존(.85 세로) |
| 야옹! (헛간 지붕) | barn | 빨간 헛간 + 잔디 | `tn_bg_barn_v2` | **헛간(33~72%, 10~67%)**, 지붕선(큐폴라 오른쪽 x 42%, y 15% 에서 내려감 — 고양이 655,129 가 앉는 선), 울타리, 잔디(67~100%) | 풍차, 건초 수레, 건초 더미, 호박, 닭장(동물 없음), 사과나무, 깃발줄 | `tn_layer_pumpkins` x 40·y 590 / `tn_layer_bunting` x 500·y −24 | 기존(세로 700) |
| 아주 작은 생쥐 (쥐구멍) | mouse | 풀·흙 둔덕·구멍 | `tn_bg_mouse_v2` | **구멍(45~52%, 63~69%)** = 453~520/360~397, 둔덕(55~75%), 바닥(72~100%) 가운데 비움 | 풀 4겹, 큰 데이지·미나리아재비·초롱꽃·양귀비, 버섯, 도토리, 달팽이집 | `tn_layer_grass_front` x 30·y 590 | 기존 |
| 순무 잔치 | feast | 노을·집·빈 들판 | `tn_bg_feast_v2` | 해(12~33%, 12~40%), 집(62~92%, 25~66%), 들판(66~100%, 가로 10~90% 비움 — 식탁·여섯 명 FX 자리) | 언덕 5겹, 깃발줄, 초롱, 해바라기, 건초 수레·호박, 사과나무 | `tn_layer_bunting` x 500·y −24 / `tn_layer_pumpkins` x 980·y 590 | 기존 |
| 잔치 끝 "다 함께 먹어요" | feast | — | `tn_lb_feast_night` **라이트박스** | v2 와 같은 자리 | 달 구멍(해 자리), 초롱·창 구멍, 언덕 Lilac→Deep Plum, 집·나무 Night Navy, 들판 Wheat | 같음 | 기존. 잔치 마지막 대사에서 v2 → lb 크로스페이드 |

## 2. 색지

- 텃밭·울타리·헛간·문(낮): Sky Paper `#A9D3F0`, Light Cream `#F3E9C8`, Sunny Yellow `#F2C94E`, Pale Sage `#BFD3B4`, Spring Green `#B5D36B`, Leaf Green `#8CBF5A`, Olive `#7A8F3C`, Pine Green `#3F6B4F`, Fern `#5E8C5A`, Mint `#7FC8B4`, Bark Brown `#6B4A32`, Cocoa `#4E3524`, Clay `#B8794F`, Kraft `#C9A574`, Straw Gold `#D9A94E`, Bean Red `#A93B32`, Maple Red `#C8322B`, Candy Pink `#E8A0B8`, Coral `#E36B5C`, Lilac `#B9A3D6`, Plum Purple `#7B4F8C`, Stone Grey `#A9A39B`, Snow White `#F4F6FA`, Persimmon `#E8703A`, Birch White `#EDE9DF` (장면당 17~23색)
- 잔치(노을): Dusk Orange `#F09A5B`, Honey `#F6B84B`, Peach `#F4C7A1`, Rose Dusk `#E7A4A0`, Pale Gold `#EBD08A`, Tangerine `#F28C28`, Wheat `#E4C877`, Olive, Moss `#6E8B3D`, Pine, Deep Teal `#1F5F5B`, Ember Amber, Teal `#2F8F8A` 등 21색
- 라이트박스: Amber Glow `#FFD27A`(가장 밝은 뒤 층), Honey, Dusk Orange, Pale Gold, Tangerine, Rust `#B5552E`, Velvet Red `#8E2F3A`, Twilight Violet `#4A3F7A`, Lilac, Lavender Dusk, Deep Plum `#3B2A5C`, Night Navy `#141C3A`, Ink Dark `#1A1410`, Clay / Wheat(앞 땅)

규칙 그대로: 1조각 1색, 무광, 어두운 웜 그림자만, 소품 얼굴 없음(허수아비·풍차·달팽이집도 얼굴 없음), 원근법 금지.

## 3. 라이트박스 장면 (2장)

1. **마지막 당기기 "쑥!"** `tn_lb_garden_dusk` — 이야기의 큰 순간. 큰 해가 하늘 층의 구멍(가장 밝음), 언덕이 물결처럼 5겹 어두워지고 울타리·순무 잎은 Night Navy 실루엣. 인물 줄과 순무는 원래 색이라 실루엣 앞에서 또렷하다. 흙은 Clay(울타리보다 밝음).
2. **잔치 밤** `tn_lb_feast_night` — 달·초롱·창이 구멍. 들판은 Wheat 라 여섯 명과 식탁이 묻히지 않는다.

소품 높이(무대 px, 시작값): 풀 포기 90(폭 130), 해바라기 셋 260, 울타리 꽃 150(폭 230), 콩 덩굴 240, 호박 더미 110(폭 180), 깃발줄 80(폭 ≈900). 세로 화면 앞 소품은 x < 285 또는 > 715.

## 4. 새로 그릴 그림 (15장)

배경 7(각 원본 PNG refs): `tn_bg_garden_v2`, `lowangle_v2`, `door_v2`, `fence_v2`, `barn_v2`, `mouse_v2`, `feast_v2`. 라이트박스 2(pass 2 ← v2 + 원본): `tn_lb_garden_dusk`, `tn_lb_feast_night`. 소품 6: `tn_layer_grass_front`, `sunflowers`, `fence_flowers`, `bean_vine_top`, `pumpkins`, `bunting`(가로 띠).

받은 뒤 점검: ① 문(31~38%, 45~65%)·헛간 지붕선·쥐구멍(45~52%, 63~69%)·흙 윗선 58% 가 원본 ±2% 인지(반투명 겹침) ② 텃밭 흙 가로 10~75% 가 비었는지 ③ 울타리 v2 가운데 벽판이 울타리로 이어졌는지 ④ 라이트박스에 그라데이션·빛살 없음 ⑤ 소품 얼굴 없음.

## 5. 코드 작업 (별도 큐)

- `turnip.js` `BG` 를 `_v2` 로, `bgFront('garden'·'lowangle'·'mouse')` 오려 붙이는 y 가 그대로 맞는지 사진으로 확인(흙 윗선·둔덕이 같은 자리여야 함). `sideView`·`fenceBG`·`barnBG`·`mouseBG`·`feastBG` 에 소품 `put`.
- 마지막 pullRound 전·잔치 끝에 lb 크로스페이드(`T.bg` 두 번째 image, 1.2초).

## 6. 판단이 필요한 부분

1. **울타리 가운데 빈 벽판**: 원래 의도가 '덤불이 가릴 자리'인지 불명. v2 는 울타리를 잇고 덤불(코드)이 그 앞을 가린다. 추천: 잇는다.
2. **마지막 당기기 라이트박스**: 당기는 톡 장면이 어두워지면 순무(누르는 대상)가 잘 보이는지가 관건. 순무는 원래 색이고 흙은 Clay 라 대비가 나지만, 실제 사진으로 보고 너무 어두우면 lb 를 '쑥!' 뒤 환호 컷에만 쓴다.

## 7. 확정 사항

- 인물·순무·소품 그림, 대사·녹음·조작은 바꾸지 않는다. 문·헛간·쥐구멍·흙선은 원본과 같은 % 로 유지.
- 작업표 15항목은 `jobs_turnip.json` 끝에 붙였고 기존 항목은 그대로.
