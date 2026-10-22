# 해와 바람 — 시각 재기획 (화려한 다층 들길 + 라이트박스 3장)

작성 2026-10-23. CLAUDE.md §7-5-1 적용. 배경·층 소품·라이트박스 배경만 다룬다. 해·바람·나그네·외투·날씨 놀이 카드 그림, 대사·녹음·조작은 그대로.

작업표: `tools/app/gen/jobs_sun_wind.json` 끝 13항목(배경 `sw_bg_*_v2` 4 + 라이트박스 `sw_lb_*` 3 + 소품 `sw_layer_*` 6). 출력 `assets/raw/restyle/sun_wind/` → `post_tale.py sun_wind`. 참고 그림 분석은 `tales/patjuk/VISUAL_PLAN.md` §0.

무대 ↔ 그림: `bgImage` x −40~1040, y −24~585. 가로 % = (x + 40) / 1080, 세로 % = (y + 24) / 609. 1장 하늘은 zoom 1.75·cy 0 으로 위쪽만 크게 본다.

## 1. 지금 문제와 새 구성

| 장면 | 지금 배경 | 문제 | 새 배경 | 유지(% 명시) | 더하는 층 | 앞·위 소품(가로 자리) | 카메라 |
|---|---|---|---|---|---|---|---|
| 1 내기(하늘) | sky | 구름 바다 + 흙 바닥(zoom 으로 숨김) | `sw_lb_sky` **라이트박스** | 위 60% 하늘 비움(해·바람 배우), 구름 바다 42~70%, 양옆 산, 아래 흙 턱 | 하늘 Amber Glow(지평선)→Honey, 구름 띠 6겹 Light Cream→Rose Dusk, 산 Lilac·Twilight 실루엣, 턱 Deep Plum | `sw_layer_cloud_front` x 500·y 590(zoom 1.75 에서 아래 가장자리) | 기존 zoom 1.75 |
| 2 하늘에서 본 길 | high | 길·강·밭 | `sw_bg_high_v2` | **굽은 길 그대로**(위 가운데 46~52% 에서 들어와 x 40%·y 55% 로 왼쪽, x 50%·y 82% 로 돌아와 아래 가운데 — 코드 path 13점), 다리, 돌담, 밭 2, 집(72~92%, 30~55%). 길 양옆 32~60% 비움 | 밭 줄무늬 4색+유채 노랑+라벤더 줄, 과수원, 꽃 들판 점, 연못·연잎, 건초 더미, 빨간 헛간, 강 갈래, 큰 구름 | 없음(부감) | 기존 |
| 3 바람 차례 | field | 나무 하나·길·호수. 바람은 코드 틴트 | `sw_lb_field_wind` **라이트박스** | 나무(0~28%, 5~45%; 밑동 x 8%, y 55%), 길 윗선 72%, 호수 | 하늘 Silver(가장 밝음)+Lead Grey·Slate 구름 띠, 산 Slate→Deep Plum, 나무·울타리 Night Navy 실루엣 **오른쪽으로 휘고** 잎 날림, 길 밝은 회색 | `sw_layer_tree_bent` x 40·y 590 / `sw_layer_grass_front` x 980·y 590(코드 wiggle) | 기존 |
| 5 해님 차례 | field(+warm) | 같은 그림에 앰버 덮개 | `sw_lb_field_sun` **라이트박스** | 같은 자리 | 해 구멍(55~85%, 8~45%)+빛살 12개 구멍, 산 Pale Gold→Velvet Red, 나무·울타리 Night Navy, 길 Wheat | `sw_layer_wheat_front` x 980·y 590 | 기존 |
| 3·5 공용 낮(들길 와이드, 날씨 놀이 바탕) | field | — | `sw_bg_field_v2` | 같은 자리, 길(72~100%) 비움 | 산 2겹, 먼 마을·돛단배, 밭 줄무늬·유채·라벤더, 울타리+들꽃, 이정표, 풍차, 포플러 | `sw_layer_grass_front` x 30·y 590 | 기존 |
| 7 개울가 | stream | 바위·개울·흙 둑 | `sw_bg_stream_v2` | **바위(2~34%, 33~68%; 윗면 36%)**(나그네 seat 215,410·외투 372,352), 개울 흐름, 둑(78~100%) 가로 10~60% 비움 | 산 3겹, 먼 폭포 띠, 물결 띠 3겹+거품, 징검돌, 들꽃·버드나무·다리·진달래 덤불·부들 | `sw_layer_reeds_stream` x 880·y 560(중간) | 기존(세로 330) |
| 8 날씨 놀이(눈) | snow | 눈 언덕·전나무 둘 | `sw_bg_snow_v2` | 전나무(0~15%, 85~100%), 눈밭(60~100%) 가운데 비움 | 언덕 4겹 Ice Blue→Slate, 오두막(창 Honey), 전나무 2겹, 열매 덤불, 울타리, 눈사람 모양(얼굴 없음), 썰매, 자작나무 | `sw_layer_snow_bush` x 30·y 590 | 기존 |

## 2. 색지

- 낮 들길·부감(20~21색): Sky Paper `#A9D3F0`, Light Cream `#F3E9C8`, Sunny Yellow `#F2C94E`, Slate Blue `#5A6E8C`, Lavender Dusk `#8B7BB8`, Pale Sage `#BFD3B4`, Spring Green `#B5D36B`, Leaf Green `#8CBF5A`, Olive `#7A8F3C`, Pine Green `#3F6B4F`, Lilac `#B9A3D6`, Sand `#E9DCC0`, Lagoon `#4FB3C9`, Moonlight `#DDE6F2`, Bark Brown `#6B4A32`, Paper Cream `#F6ECD8`, Kraft `#C9A574`, Coral `#E36B5C`, Snow White `#F4F6FA`, Stone Grey `#A9A39B`, Bean Red, Straw Gold, Sky Blue
- 개울(23색): 위 + Deep Teal, Fern, Powder Blue `#BFE0F2`, Sea Teal `#2A7A8C`, Clay, Persimmon, Candy Pink
- 눈(16색): Ice Blue `#CFE3F2`, Powder Blue, Snow White, Snow Shadow `#DDE4EE`, Silver `#D5DAE0`, Slate Blue, Pine, Deep Teal, Bark Brown, Birch White `#EDE9DF`, Honey, Bean Red, Persimmon, Kraft, Stone Grey, Paper Cream
- 라이트박스 하늘(11색): Amber Glow `#FFD27A`, Honey `#F6B84B`, Light Cream, Pale Gold, Peach `#F4C7A1`, Dusk Orange `#F09A5B`, Rose Dusk `#E7A4A0`, Lilac, Twilight Violet `#4A3F7A`, Deep Plum `#3B2A5C`, Night Navy `#141C3A`
- 라이트박스 바람(9색): Silver, Lead Grey `#7A8794`, Slate Blue, Snow Shadow, Twilight Violet, Deep Plum, Night Navy, Ink Dark `#1A1410`, Stone Grey
- 라이트박스 해(11색): Amber Glow, Honey, Pale Gold, Dusk Orange, Tangerine `#F28C28`, Rust `#B5552E`, Velvet Red `#8E2F3A`, Deep Plum, Night Navy, Ink Dark, Wheat `#E4C877`

## 3. 라이트박스 장면 (3장)

1. **내기(하늘)** `sw_lb_sky` — 해와 바람이 떠 있는 하늘. 지평선 Amber Glow 가 가장 밝고 구름 바다 6겹이 앞으로 올수록 분홍·주황으로 어두워진다. 해 모양은 그리지 않는다(배우). 위 60% 는 비워 해·바람이 선다.
2. **바람 차례** `sw_lb_field_wind` — 광원은 구름 뒤 은빛. 나무·울타리 실루엣이 오른쪽으로 휘고 잎이 날아간다(앞 `tree_bent` 소품도 코드 wiggle). 길은 밝은 회색이라 나그네(원래 색)가 또렷.
3. **해님 차례** `sw_lb_field_sun` — 해 구멍 + 빛살 12개 구멍(하늘 층을 오린 곧은 띠, 그라데이션 아님). 산 5겹 금→자주. 나그네가 외투를 벗는 큰 순간.

기존 코드의 `tintLayer`(SKY.grey·warm·hot 틴트)는 lb 그림 위에서는 끈다(lb 자체가 날씨). 날씨 놀이(8장)는 `field_v2` + 틴트 + 눈은 `snow_v2` 교체 그대로.

소품 높이(무대 px, 시작값): 구름 띠 120(폭 ≈1000), 풀 포기 90(폭 130), 휜 나무 300(폭 450), 개울 갈대 180, 눈 덤불 120(폭 190), 밀 포기 200.

## 4. 새로 그릴 그림 (13장)

라이트박스 3: `sw_lb_sky`(← sky.png, pass 1), `sw_lb_field_wind`·`sw_lb_field_sun`(pass 2 ← field_v2 + 원본). 배경 4: `sw_bg_high_v2`(← high.png, 길 유지), `sw_bg_field_v2`, `sw_bg_stream_v2`, `sw_bg_snow_v2`. 소품 6: `sw_layer_cloud_front`(가로 띠), `grass_front`, `tree_bent`, `reeds_stream`, `snow_bush`, `wheat_front`.

받은 뒤 점검: ① 부감 길이 코드 13점과 맞는지(반투명 겹침, ±2%) — 어긋나면 기존 high 유지 ② 개울 바위 윗면 y 36% 인지(외투 자리) ③ 라이트박스 3장에 그라데이션·빛살 그림 없음(해 빛살은 오린 띠) ④ 하늘 lb 위 60% 비움 ⑤ 소품 얼굴 없음(눈사람 모양 포함).

## 5. 코드 작업 (별도 큐)

- `sun_wind.js` `BG` 에 `_v2`·`_lb` 키 추가, `BG_EDGE` 재측정. `fieldBG(opts)` 에 `lb: 'wind'|'sun'` 옵션으로 lb 그림을 깔고 틴트를 끈다. `skyBG`·`streamBG`·`playBG` 에 소품 `put`.
- 바람 차례: `tree_bent` wiggle 반복, 해님 차례: `warm` 덮개 대신 lb.

## 6. 판단이 필요한 부분

1. **부감 길(high_v2)**: 코드 path 좌표가 그림 길에 묶여 있어 위험. 추천: 생성해 겹쳐 보고 ±2% 넘으면 기존 그림 유지(토끼 지도와 같은 판단).
2. **바람 차례를 라이트박스로**: 바람 장면은 어두운 회색 하늘이라 lb 효과(뒤 은빛)가 약할 수 있다. 추천: 해님 차례와 대비되게 두되, 사진이 칙칙하면 field_v2 + 기존 틴트로 돌아간다.

## 7. 확정 사항

- 인물·소품 그림, 대사·녹음·조작은 바꾸지 않는다. 나무·길·바위·전나무 자리는 원본과 같은 % 로 유지.
- 작업표 13항목은 `jobs_sun_wind.json` 끝에 붙였고 기존 33항목은 그대로.
