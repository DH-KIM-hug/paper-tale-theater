# 팥죽할멈과 호랑이 — 시각 재기획 (화려한 다층 페이퍼아트 + 라이트박스)

작성 2026-10-23. 사용자 지시(CLAUDE.md §7-5-1): 기존 동화도 꽃·나무·물결·산을 여러 겹 겹친 화려한 다층 페이퍼아트로 다시 그리고, 큰 순간 1~3장면은 종이 뒤에서 빛이 비치는 **라이트박스** 연출을 섞는다.

이 문서는 **배경·층 소품·라이트박스 배경**만 다룬다. 인물(할멈·호랑이·친구 일곱)과 누르는 소품(문·부뚜막·물독·장작·집·장독)은 바꾸지 않는다. 대사·녹음·조작은 그대로. 코드 좌표는 그림이 온 뒤 이 문서의 자리표로 맞춘다(별도 큐).

작업표: `tools/app/gen/jobs_patjuk.json` 끝 10항목(배경 `pj_bg_*_v2` 3 + 라이트박스 `pj_lb_*` 2 + 층 소품 `pj_layer_*` 5). 생성 ID는 `tools/app/gen/restyle/lavish_g1_ids.txt`. 출력 `assets/raw/restyle/patjuk/` → `post_tale.py patjuk` → `assets/v3w/<id>.webp`.

## 0. 참고 그림에서 배운 것 (assets/raw/refs_visual — 남의 그림, 스타일 참고만, 생성 참고 이미지로 넣지 않음)

| 그림 | 화려함을 만드는 것 |
|---|---|
| lightbox_deer (달밤 사슴과 기둥 집) | 광원이 **종이 뒤**에 있다. 가장 먼 층(하늘·달)이 가장 밝고 앞으로 올수록 어두운 실루엣 6~7겹. 앞 테두리는 나뭇가지 실루엣이 액자처럼 감싼다. 달은 하늘 층에 뚫린 **구멍**이라 가장 밝다 |
| lightbox_whale (숲 속 고래) | 뒤 층 색이 위(파랑·보라)에서 아래(주황)로 바뀌어 깊이가 생긴다. 큰 주인공(고래)은 실루엣에 묻히지 않게 밝은 층 앞에 홀로 둔다. 앞 층 산호·풀은 거의 검은 실루엣 |
| lavish_layers (보라 바탕 소용돌이 나무) | 보색 대비(보라 바탕 ↔ 주황·분홍), 나무 잎이 **소용돌이 모양 색지 4~5겹**, 아래는 층층 물결 띠(파랑 3단)와 꽃 덤불이 빈틈없이 찬다. 한 장면에 15색 이상 |
| city_waves (층층 파도) | 앞 물결 5~6겹이 같은 색 계열 명암으로 겹치고, 뒤로 갈수록 연하다. 해는 지평선 뒤에 반쯤 걸쳐 가장 밝다 |

→ 우리 규칙으로 옮기면: 층은 6~8겹, 먼 층일수록 밝고 연하게, 앞 가림 층은 진하게. 라이트박스는 '뒤 층 = 가장 밝은 색지, 앞으로 올수록 어두운 색지'로만 만들고 조각 안 그라데이션·광택은 금지(CLAUDE.md §7-1). 인물·누르는 대상은 실루엣 층 앞에 원래 색 그대로 둔다.

## 1. 지금 배경의 문제

| 세트 | 파일 | 문제 |
|---|---|---|
| A 팥밭(낮) | scene_a_field | 단풍·억새·팥밭·집이 있어 이미 꽤 화려하다. 다만 앞 가림 층이 없고 언덕이 3겹뿐 |
| B1 부엌(저녁·밤) | scene_b_kitchen | 널판 벽 한 장 + 선반 하나 + 창 하나. 소품(문·부뚜막·물독·장작)은 코드가 놓으므로 빈 곳이 많아 밋밋하다. 밤 장면은 틴트를 걷어낸 같은 그림이라 '깜깜한 밤' 느낌이 약하다 |
| B2 마당(밤) | scene_c_yard_sea | 남색 하늘 + 언덕 2겹 + 바다 띠 + 소나무 하나. 눈 마당이 넓게 비어 허전하다 |

무대 1000×560 ↔ 그림 1600×902: 그림은 무대 x −40~1040, y −22~583 에 깔린다. 그림 가로 % = (무대 x + 40) / 1080, 세로 % = (무대 y + 22) / 605.

## 2. 색지 (장면별)

- **A 팥밭 v2 (20색)**: Wheat `#E4C877`, Mustard `#D9A531`, Honey `#F6B84B`, Pale Gold `#EBD08A`, Light Cream `#F3E9C8`, Maple Red `#C8322B`, Persimmon `#E8703A`, Tangerine `#F28C28`, Rust `#B5552E`, Bean Red `#A93B32`, Olive `#7A8F3C`, Moss `#6E8B3D`, Fern `#5E8C5A`, Bark Brown `#6B4A32`, Cocoa `#4E3524`, Sand `#E9DCC0`, Paper Cream `#F6ECD8`, Straw Gold `#D9A94E`, Stone Grey `#A9A39B`, Sunny Yellow `#F2C94E`
- **B1 부엌 v2 (17색)**: Cocoa, Bark Brown, Ink Dark `#1A1410`, Clay `#B8794F`, Honey, Kraft `#C9A574`, Straw Gold, Pale Gold, Bean Red, Paper Cream, Sky Paper `#A9D3F0`, Moonlight `#DDE6F2`, Deep Indigo `#1F2A56`, Snow White `#F4F6FA`, Charcoal `#3A3632`, Ember Amber `#F2B366`, Olive
- **B1 밤 라이트박스 (11색)**: Amber Glow `#FFD27A`(가장 밝은 뒤 층), Honey, Ember Amber, Night Navy `#141C3A`, Ink Dark, Cocoa, Charcoal, Pale Gold, Moonlight, Snow White, Clay
- **B2 마당 v2 (18색)**: Night Navy, Deep Indigo, Twilight Violet `#4A3F7A`, Slate Blue `#5A6E8C`, Moonlight, Snow White, Snow Shadow `#DDE4EE`, Ice Blue `#CFE3F2`, Paper Cream, Pale Gold, Stone Grey, Charcoal, Pine Green `#3F6B4F`, Deep Teal `#1F5F5B`, Bark Brown, Cocoa, Bean Red, Lavender Dusk `#8B7BB8`
- **B2 달빛 라이트박스 (12색)**: Amber Glow, Moonlight, Lilac `#B9A3D6`, Slate Blue, Lagoon `#4FB3C9`, Twilight Violet, Deep Plum `#3B2A5C`, Night Navy, Ink Dark, Snow Shadow, Ice Blue, Silver `#D5DAE0`

신규 색지(이번 g1 공통): Night Navy, Ink Dark, Amber Glow, Honey, Wheat, Mustard, Rust, Tangerine, Maple Red, Clay, Charcoal, Twilight Violet, Deep Plum, Slate Blue, Lilac, Lagoon, Silver, Ice Blue, Snow Shadow. 1조각 1색·무광·웜 그림자만 그대로.

## 3. 장면별 새 구성

| 세트 | 새 배경 | 유지(프롬프트에 % 로 명시) | 먼 층 | 중간 층 | 앞 가림 층(소품) | 카메라 |
|---|---|---|---|---|---|---|
| A 팥밭 | `pj_bg_field_v2` | 집(가로 78~95%, 세로 38~60%), 돌담·울타리(세로 50~60%), 팥 이랑(60~80%), 앞 모래 띠(80~100%) 비움 | 단풍 언덕 5겹, 금빛 해+크림 테, 구름 2겹, 기러기 떼 | 단풍나무 줄, 억새, 팥 덤불 잎 3색, 왼쪽 위 단풍 가지 | `pj_layer_pampas_front` x 40·y 590 / `pj_layer_maple_branch` x 960·y −22(위) | 기존(인트로 300,400,1.3 줌) |
| B1 부엌(저녁) | `pj_bg_kitchen_v2` | 창(45~75%, 5~40%), 선반(0~37%, 2~20%), 바닥선 58%. **빈 곳**: 왼쪽 아래(0~45%, 55~100%) 부뚜막·물독·장작 자리, 오른쪽(78~100%, 35~95%) 문 자리 | 널판 2겹, 창 밖 3겹(달빛 하늘·눈 담·가지) | 대들보·기둥, 둘째 선반(놋그릇·무쇠 주전자·청화 사발), 마늘·고추·옥수수 엮음, 짚 멍석, 바구니·빗자루 | `pj_layer_garlic_bunch` x 560·y −22(위, 창 왼쪽) | 기존 |
| B1 부엌(깜깜한 밤) | `pj_lb_kitchen_night` **라이트박스** | v2 와 같은 자리 | 창이 가장 밝은 Amber Glow 구멍(가지 실루엣), 왼쪽 아래 벽·바닥 틈에 Amber Glow(아궁이 자리 뒤 빛) | 벽 Night Navy, 대들보 Ink Dark, 엮음·그릇은 Cocoa·Charcoal 실루엣 | 같음 | 기존. `daylight` 0 으로 떨어질 때 v2 → lb 크로스페이드 1.2초 |
| B2 마당(밤) | `pj_bg_yard_v2` | 초승달(15~25%, 4~20%), 언덕(30~45%), 바다 띠(55~100%, 42~50%), 소나무(85~100%), 돌담·사립문(40~100%, 50~65%), 눈 마당(60~100%). **빈 곳**: 왼쪽 45% 언덕 아래(집 자리), 마당 가운데 | 별 3크기, 언덕 2겹 추가(Slate·Twilight), 먼 섬, 달빛 파도 띠 | 눈 쌓인 감나무 줄(감 몇 개), 눈 덤불 Ice Blue·Snow Shadow, 둘째 소나무 | `pj_layer_snow_pine_front` x 1000·y −22 / `pj_layer_snow_bush_front` x 30·y 590 | 기존 |
| B2 마당(달빛) | `pj_lb_yard_moon` **라이트박스** | v2 와 같은 자리 | 하늘 Moonlight(가장 밝음), 달은 구멍→Amber Glow, 언덕 Lilac→Slate→Twilight | 감나무·덤불·소나무·돌담은 Deep Plum·Night Navy 실루엣, 눈 마당 Snow Shadow(담보다 밝게) | 같음 | 기존. 호랑이가 마당으로 도망치는 5번째 친구 장면(절구 뒤)부터 lb 사용 |

소품 높이(무대 px, 시작값·그림 오면 같은 부위 재서 조정): 억새 260, 단풍 가지 200(폭 400), 마늘 엮음 150, 눈 소나무 가지 220(폭 330), 눈 덤불 120(폭 190). 세로 화면은 가운데 430 만 보이므로 앞 소품은 x < 285 또는 > 715 에만.

## 4. 라이트박스 장면 (2장)

1. **깜깜한 밤 부엌** `pj_lb_kitchen_night` — 호랑이가 문을 벌컥 여는 큰 순간. 광원은 창 뒤(달빛)와 아궁이 뒤(앰버) 둘. 부뚜막 소품(코드)은 왼쪽 아래 Amber Glow 틈 앞에 원래 색으로 놓이므로 아궁이 불이 뒤에서 비치는 듯 보인다. 할멈·호랑이·친구들은 원래 색 그대로.
2. **달빛 마당** `pj_lb_yard_moon` — 호랑이가 마당으로 도망쳐 지게에 실려 바다로 가는 결말. 달 구멍이 가장 밝고 눈 마당은 Snow Shadow 라 집·장독·인물이 실루엣에 묻히지 않는다.

규칙: 층마다 밝기가 다른 것만 허용, 조각 안 그라데이션·광택·빛살 그림 금지(프롬프트 LIGHTING 블록에 명시). 앞 실루엣 층이 문·집·장독·인물을 가리지 않게 빈 곳을 같은 % 로 유지.

## 5. 새로 그릴 그림 (10장)

| 구분 | id | 내용 | pass / refs |
|---|---|---|---|
| 배경 | `pj_bg_field_v2` | 가을 팥밭, 언덕 5겹·단풍 가지 | 1 ← scene_a_field.png |
| 배경 | `pj_bg_kitchen_v2` | 부엌, 선반 2단·엮음·멍석, 빈 곳 유지 | 1 ← scene_b_kitchen_v3.png |
| 라이트박스 | `pj_lb_kitchen_night` | 창·아궁이 뒤 빛, 실루엣 부엌 | 2 ← kitchen_v2 + 원본 |
| 배경 | `pj_bg_yard_v2` | 겨울 밤 마당, 감나무·눈 덤불·별 | 1 ← scene_c_yard_sea_v4.png |
| 라이트박스 | `pj_lb_yard_moon` | 달 구멍, 실루엣 언덕·담 | 2 ← yard_v2 + 원본 |
| 소품 | `pj_layer_pampas_front` / `pj_layer_maple_branch` / `pj_layer_garlic_bunch` / `pj_layer_snow_pine_front` / `pj_layer_snow_bush_front` | 앞·위 가림 층 (얼굴 없음) | 1 |

받은 뒤 점검: ① 부엌 빈 곳(왼쪽 아래·오른쪽 문 자리)에 물건이 없는지 ② 마당 왼쪽 45% 가 비었는지(집 자리) ③ 라이트박스 두 장에 그라데이션·빛살·광택이 없고 층별 단색인지 ④ 소품에 얼굴 없음 ⑤ 집·창·달 위치가 원본 ±2% 인지(반투명 겹침).

## 6. 코드 작업 (이 문서 확정 뒤, 별도 큐)

- `patjuk.js` `SCENE_IMG` 를 `pj_bg_field_v2`·`pj_bg_kitchen_v2`·`pj_bg_yard_v2` 로, 밤 부엌·달빛 마당은 `SCENE_LB` 로 추가해 `daylight` 와 같은 자리에서 크로스페이드. `setScene` 에 층 소품 `put`(중간 → 배우 → 앞).
- 아궁이 불 타원(`pj-fire`)·김은 그대로.

## 7. 판단이 필요한 부분

1. **팥밭 v2 를 넣을지**: 지금 팥밭이 이미 화려해 v2 는 언덕 5겹·앞 억새·단풍 가지만 더한다. 생성이 집·이랑 자리를 흔들면 기존 그림 + 소품 2개만 쓴다. 추천: 생성해 보고 겹쳐 비교.
2. **깜깜한 밤 부엌을 라이트박스로 바꿀지**: 밤 부엌은 세기 놀이(친구 순서)가 있는 긴 장면이라 너무 어두우면 친구 카드가 묻힐 수 있다. 추천: 벽은 Night Navy 까지만(검정 아님), 바닥은 Clay 로 밝게.
3. **마당 라이트박스를 언제부터 쓸지**: 친구들이 마당으로 들어오는 인트로부터 쓰면 달빛만으로 7명이 보여야 한다. 추천: 인트로는 v2, 호랑이가 도망치는 뒷부분부터 lb.

## 8. 확정 사항

- 인물·누르는 소품·대사·녹음·조작은 바꾸지 않는다. 빈 곳(문·부뚜막·집·장독 자리)은 원본과 같은 % 로 유지.
- 작업표 10항목은 `jobs_patjuk.json` 끝에 붙였고 기존 항목은 바꾸지 않았다. 생성은 메인 체인이 돌린다.
