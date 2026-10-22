# 여우와 두루미 — 시각 재기획 (화려한 다층 집·연못·잔치 + 라이트박스)

작성 2026-10-23. CLAUDE.md §7-5-1 적용. 배경·층 소품·라이트박스 배경만 다룬다. 여우·두루미·오리·나비·그릇(접시·병·사발·꽃)·냄비·식탁 그림, 대사·녹음·조작(그릇 고르기)은 그대로.

작업표: `tools/app/gen/jobs_fox_crane.json` 끝 14항목(배경 `fc_bg_*_v2` 6 + 라이트박스 `fc_lb_*` 2 + 소품 `fc_layer_*` 6). 출력 `assets/raw/restyle/fox_crane/` → `post_tale.py fox_crane`. 참고 그림 분석은 `tales/patjuk/VISUAL_PLAN.md` §0.

무대 ↔ 그림: `bgImage` x −40~1040, y −24~585. 가로 % = (x + 40) / 1080, 세로 % = (y + 24) / 609.

## 1. 지금 문제와 새 구성

| 장면 | 지금 배경 | 문제 | 새 배경 | 유지(% 명시) | 더하는 층 | 앞·위 소품(가로 자리) | 카메라 |
|---|---|---|---|---|---|---|---|
| 1 숲(여우·두루미 만남) | forest | 나무·호수·풀밭, 요소 적음 | `fc_bg_forest_v2` | 풀밭(58~100%) 가운데 비움, 호수(48~56%), 양옆 큰 나무, 해 | 산 3겹, 전나무, 돛단배, 잎 4겹, 산딸나무(분홍)·마가목(빨간 열매), 수국, 버섯, 통나무, 디기탈리스, 나비 | `fc_layer_fern_front` x 30·y 590 / `fc_layer_flowers_front` x 980·y 590 | 기존 |
| 2 여우의 부엌 | kitchen | 흙벽·선반·창·통·탁자, 벽 가운데 넓게 빔 | `fc_bg_kitchen_v2` | 둥근 창(68~90%, 8~45%), 선반(8~37%, 12~32%), 통·바구니 왼쪽 아래, 탁자(85~100%, 50~78%), 바닥 윗선 75%. **왼쪽 아래 바닥(15~55%, 75~100%) 비움**(냄비 330,545·여우 540,550) | 벽 2겹+징두리 띠, 둘째 선반(항아리 3색·접시), 허브·고추·양파 엮음, 구리 팬 줄, 두루마리 깔개, 빵 바구니, 뻐꾸기시계 모양(얼굴 없음), 장작, 창 밖 3겹 | `fc_layer_herb_bunch` x 560·y −24(위) | 기존(440,400,1.3) |
| 3 납작 접시(부감) | high | 빨간 탁자 하나 + 노란 바닥 | `fc_bg_high_v2` | **탁자(중심 50%, 43%; 지름 38%)** 그대로(접시 코드 497,314) | 나무 널 바닥 3색, 둥근 헝겊 깔개(빨강·보라·노랑·민트 고리), 의자 둘(위에서), 냅킨·숟가락, 데이지 꽃병 | 없음 | 기존 |
| 4 두루미네 집 | pondhouse | 집·연못·잔디 | `fc_bg_pondhouse_v2` | 집(72~94%, 18~52%), 연못(0~50%, 45~70%), 잔디(62~100%) 가운데·문 앞 길 비움(여우 −140→380, 두루미 640), 해 | 산 2겹, 언덕, Honey·Peach 하늘, 물결 3겹, 수련, 부들·붓꽃, 선착장·등불 기둥, 장미·꽃 상자, 굴뚝 연기, 양배추·해바라기 밭, 자작나무, 우편함, 디딤돌 | `fc_layer_reeds_pond` x 90·y 560(중간, 연못 앞) | 기존 |
| 4 두루미네 집 도착(해 질 녘 컷) | pondhouse | — | `fc_lb_pondhouse_dusk` **라이트박스** | v2 와 같은 자리 | 해 구멍(45~65%, 15~45%), 언덕 Pale Gold→Deep Plum, 연못 Pale Gold 반사+Lilac 물결, 집 Night Navy 실루엣+창·문 Honey 구멍, 잔디 Wheat | 같음 | 기존. 두루미가 "놀러 와~" 부르는 대사부터 여우가 걸어가는 동안만 lb(크로스페이드), 긴 병 장면 전에 v2 로 |
| 5 긴 병(두루미 방) | crane_room | 크림 벽·창·탁자, 벽 넓게 빔 | `fc_bg_crane_room_v2` | **탁자(33~67%, 53~58%; 다리 71%)**(병 506,374), 창(4~33%, 7~52%), 기둥, 바닥 윗선 68%. 탁자 위·앞(25~80%, 68~100%) 비움 | 아이보리 패널+그림 레일, 액자 둘(돛단배·물고기 모양), 책장 5색, 매단 화분, 둥근 깔개, 방석, 붓꽃 꽃병, 줄무늬 커튼, 시계 모양(얼굴 없음) | 없음(로우앵글) | 기존 |
| 6 왜 못 먹었을까(분할) | kitchen + crane_room | — | v2 둘을 그대로 분할 | 같음 | — | — | 기존 |
| 7 알맞은 그릇(낮 잔치) | feast_day | 깃발·나무·들판 | `fc_bg_feast_day_v2` | 깃발 줄, 양옆 나무, 호수(55~60%), 해, 들판(62~100%) 비움(식탁·손님 4, PF 440) | 산 3겹, 둘째 깃발, 초롱, 장미 아치, 소풍 바구니·선물 상자, 풍선꽃, 수국·해바라기, 벚나무 | `fc_layer_bunting` x 500·y −24 / `fc_layer_flowers_front` x 30·y 590 | 기존(세로 .72 모음) |
| 8 함께 먹어요(밤 잔치) | feast_night | 초롱·달(이미 화려) | `fc_lb_feast_night` **라이트박스** | 초롱 줄, 달(44~56%, 5~22%), 양옆 나무, 들판(55~100%) 비움 | 달 구멍 Amber Glow, 별 구멍, 초롱 12개 전부 구멍, 언덕 Lilac→Deep Plum, 나무 Night Navy, 들판 Wheat, 반딧불 구멍 10 | `fc_layer_lantern_string` x 500·y −24 | 기존 |

## 2. 색지

- 숲·잔치 낮(24~25색): Sky Paper `#A9D3F0`, Honey `#F6B84B`, Light Cream `#F3E9C8`, Sunny Yellow `#F2C94E`, Slate Blue `#5A6E8C`, Lavender Dusk `#8B7BB8`, Pale Sage `#BFD3B4`, Deep Teal `#1F5F5B`, Pine Green `#3F6B4F`, Olive `#7A8F3C`, Leaf Green `#8CBF5A`, Spring Green `#B5D36B`, Fern `#5E8C5A`, Moss `#6E8B3D`, Bark Brown `#6B4A32`, Moonlight `#DDE6F2`, Lagoon `#4FB3C9`, Blossom Pink `#F2A7B5`, Bean Red `#A93B32`, Paper Cream `#F6ECD8`, Lilac `#B9A3D6`, Baby Blue `#8FC1E3`, Persimmon `#E8703A`, Snow White `#F4F6FA`, Stone Grey `#A9A39B`, Teal, Candy Pink, Coral `#E36B5C`, Sky Blue, Kraft, Pale Gold
- 부엌(20색): Clay `#B8794F`, Fawn `#C98B5A`, Kraft `#C9A574`, Bark Brown, Cocoa `#4E3524`, Paper Cream, Ivory `#EFE3CC`, Bean Red, Sky Blue `#3E7CB1`, Pale Gold `#EBD08A`, Straw Gold `#D9A94E`, Persimmon, Rust `#B5552E`, Plum Purple `#7B4F8C`, Sunny Yellow, Leaf Green, Pine Green, Sky Paper, Mint `#7FC8B4`, Stone Grey
- 부감 탁자(14색): Bean Red, Pale Gold, Kraft, Fawn, Straw Gold, Mustard `#D9A531`, Bark Brown, Cocoa, Plum Purple, Sunny Yellow, Mint, Paper Cream, Snow White, Leaf Green
- 두루미 방(19색): Paper Cream, Ivory, Pale Gold, Kraft, Bark Brown, Straw Gold, Fawn, Mint, Candy Pink `#E8A0B8`, Sky Blue, Baby Blue, Snow White, Bean Red, Pine Green, Plum Purple, Sunny Yellow, Fern, Leaf Green, Lagoon
- 연못 집(26색): 숲 색 + Peach `#F4C7A1`, Powder Blue `#BFE0F2`, Sea Teal `#2A7A8C`, Birch White `#EDE9DF`, Mint
- 라이트박스 노을(13색): Amber Glow `#FFD27A`, Honey, Dusk Orange `#F09A5B`, Rose Dusk `#E7A4A0`, Pale Gold, Tangerine `#F28C28`, Rust, Velvet Red `#8E2F3A`, Deep Plum `#3B2A5C`, Night Navy `#141C3A`, Ink Dark `#1A1410`, Lilac, Wheat `#E4C877`
- 라이트박스 밤(10색): Amber Glow, Honey, Twilight Violet `#4A3F7A`, Lilac, Lavender Dusk, Deep Plum, Night Navy, Ink Dark, Moonlight, Wheat

## 3. 라이트박스 장면 (2장)

1. **함께 먹어요(밤 잔치)** `fc_lb_feast_night` — 결말. 초롱 12개가 전부 구멍이라 lightbox_deer 의 창 느낌, 달·별도 구멍. 들판은 Wheat 라 손님 넷과 그릇(원래 색)이 또렷. 기존 코드 `lantern()` 은 lb 그림에 초롱이 있으니 쓰지 않는다.
2. **두루미네 집 해 질 녘** `fc_lb_pondhouse_dusk` — 여우가 두루미 집으로 걸어가는 짧은 컷. 해 구멍, 연못이 Pale Gold 로 하늘을 비추고 집 창·문이 Honey 구멍. 긴 병 장면 전에 v2 낮 그림으로 돌아온다.

소품 높이(무대 px, 시작값): 꽃 덤불 100(폭 160), 허브 엮음 140, 초롱 줄 90(폭 ≈900), 연못 갈대 170, 깃발줄 80(폭 ≈900), 고사리 110(폭 150). 세로 화면 앞 소품은 x < 285 또는 > 715; 잔치 세로(.72 모음)에서는 위 띠(깃발·초롱)만.

## 4. 새로 그릴 그림 (14장)

배경 6(각 원본 PNG refs, pass 1): `fc_bg_forest_v2`, `kitchen_v2`, `high_v2`, `pondhouse_v2`, `crane_room_v2`, `feast_day_v2`. 라이트박스 2: `fc_lb_feast_night`(← feast_night.png, pass 1), `fc_lb_pondhouse_dusk`(pass 2 ← pondhouse_v2 + 원본). 소품 6: `fc_layer_flowers_front`, `herb_bunch`, `lantern_string`(가로 띠), `reeds_pond`, `bunting`(가로 띠), `fern_front`.

받은 뒤 점검: ① 부감 탁자(중심 50%/43%, 지름 38%)·두루미 방 탁자(33~67%, 53~58%)·부엌 창·연못 집 위치가 원본 ±2% 인지(그릇이 탁자 위에 놓여야 함) ② 부엌 왼쪽 아래 바닥·잔치 들판이 비었는지 ③ 라이트박스에 그라데이션·빛살 없음 ④ 시계·뻐꾸기시계·돛단배 액자에 얼굴 없음 ⑤ 분할 화면(6장)에서 부엌 v2·방 v2 의 창 쪽이 각각 왼쪽·오른쪽에 오는지.

## 5. 코드 작업 (별도 큐)

- `fox_crane.js` `BG` 에 `_v2`·`_lb` 키, `BG_EDGE` 재측정. `feastBG(night)` 에서 lb 사용 시 `lantern()` 생략. 두루미 집 도착 컷 크로스페이드. 각 BG 함수에 소품 `put`.

## 6. 판단이 필요한 부분

1. **두루미 집 해 질 녘 라이트박스**: 이야기상 꼭 필요한 큰 순간은 아니다(큰 순간은 납작 접시·긴 병·함께 먹어요). 추천: 생성은 해 두고 코드에서 쓸지 사진 보고 결정; 빼면 1장 줄어든다.
2. **부감 탁자 v2**: 접시 좌표(497,314)가 탁자에 묶여 있다. 추천: 겹쳐 보고 ±2% 넘으면 기존 유지.

## 7. 확정 사항

- 인물·그릇·냄비·식탁 그림, 대사·녹음·조작은 바꾸지 않는다. 탁자·창·집·연못 자리는 원본과 같은 % 로 유지.
- 작업표 14항목은 `jobs_fox_crane.json` 끝에 붙였고 기존 5항목(키아트)은 그대로.
