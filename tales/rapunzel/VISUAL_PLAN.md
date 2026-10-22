# 라푼젤 — 시각 재기획 (아주 화려한 탑 주변 숲과 꽃·탑 방 안·재회 들판)

작성 2026-10-22. 사용자 요청: "공주 동화들도 화려함이 필요한 부분들 아주 화려하게 재기획."

이 문서는 **배경·레이어 소품·연출**만 다룬다. 인물(라푼젤·고텔·왕자·부부·말·새·토끼)과 탑·땋은 머리 소품 그림, 대사, 녹음, 조작(톡 3·배움 2)은 바꾸지 않는다. 줄거리·장면 수(10장)도 그대로다. 코드 좌표는 그림이 온 뒤 SPEC §2-8·§3 에 맞춰 고친다.

방향: 라푼젤의 세계는 **탑 둘레의 숲**이다. 지금 숲 배경은 나무 셋과 풀밭 한 장이라 비어 있다. 숲을 여러 초록의 나무 겹과 들꽃·버섯·나비로 채우고, 해질녘은 하늘 띠 네 장으로 물들이고, 탑 방 안은 공주의 방답게, 마지막 들판은 꽃바다로 만든다. 사람 집(1장 오두막 안)은 수수하게 그대로. 새 배경 `rp_bg_*_v2` 는 지금 배경을 참고 그림으로 넣어 **같은 구도·같은 빈 자리(탑 자리·창 위치·담 높이)** 를 지킨다. 기존 파일은 그대로 둔다.

작업표: `tools/app/gen/jobs_rapunzel.json` 끝에 추가한 15항목(`rp_bg_*_v2` 배경 5 + `rp_layer_*` 소품 10). 코드·그림 생성은 이 문서를 확정한 뒤 한다.

## 1. 지키는 것

- **1조각 1색.** 꽃 한 송이도 꽃잎판·꽃술판 따로. 광택·펄·그라데이션 금지(해질녘 하늘도 띠 네 장이지 그라데이션이 아니다).
- **그림자는 어두운 웜 그림자만.** 해질녘·밤에도 보라 그림자 금지.
- **소품에 얼굴 없음.** 나비·버섯·꽃·해·달·구름에 눈·입 없음(새·토끼 배역만 얼굴).
- **원근법 금지.** 먼 숲은 "작게"가 아니라 "한 층 통째로 밝고 연하게".
- **탑 자리 비우기(가장 중요).** 3·4·6·7·9장의 탑은 소품(`prop_tower`, TX = X(640, 560), 높이 445, 폭 ≈ 110)이고, 창문·새·토끼·머리·오르는 사람이 모두 탑에서 계산된다. 숲 배경은 **x 48~72% 전체와 그 위 하늘(x 40~80%, y < 30%)** 을 비우고, 탑 발치 땅(x 35~80%, y > 70%) 에 꽃·버섯을 두지 않는다. 3장 놀이 대상 새(탑 꼭대기)·토끼(탑 발치 왼쪽) 둘레 ±120 에 배경 나비·꽃 없음.
- **방 안 창 위치 고정.** `room` 의 창(x 673~889, y 128~372, 턱 372)·고리 자리(905, 250)·왼쪽 걸상은 그대로. 창 오른쪽 벽은 민짜 돌(고리가 걸린다).
- **광원 한 방향.** 세트 A(낮 숲·방 안·들판)는 왼쪽 위, 세트 B(밤 텃밭·해질녘 숲)는 오른쪽 위.

## 2. 색지 목록

| 색지 | HEX | 쓰는 곳 | 출처 |
|---|---|---|---|
| Sky Paper | `#DCE9F2` | 낮 하늘 | 기존 |
| Paper Cream | `#F6ECD8` | 구름, 달, 오두막 벽, 흰 꽃 | 토큰 |
| Snow White | `#F4F6FA` | 데이지, 버섯 점 | 토큰 |
| Straw Gold | `#D9A94E` | 초가, 바닥, 금 장식 | 토큰 |
| Sunny Yellow | `#F2C94E` | 민들레, 노란 꽃, 달맞이꽃 | 신규 |
| Ember Amber | `#F2B366` | 해질녘 하늘 1, 반딧불 | 토큰 |
| Dusk Peach | `#F7C5A0` | 해질녘 하늘 2 | 신규 |
| Dusk Rose | `#E59AA8` | 해질녘 하늘 3, 분홍 구름 | 신규 |
| Dusk Mauve | `#8B6E9E` | 해질녘 하늘 4(맨 위), 먼 산 | 신규 |
| Far Mountain | `#B99AB0` | 먼 산 연한 겹 | 신규 |
| Persimmon | `#E8703A` | 양귀비, 주황 꽃 | 토큰 |
| Coral | `#E36B5C` | 꽃, 버섯 갓 | 신규 |
| Bean Red | `#A93B32` | 탑 지붕(기존), 빨간 꽃, 버섯 갓 | 토큰 |
| Pink | `#E9A6B4` | 들판 꽃(기존), 꽃잎 | 기존 |
| Candy Pink | `#E8A0B8` | 커튼, 코스모스 | 신규 |
| Lilac | `#B7A6D9` | 연보라 꽃, 먼 숲 | 신규 |
| Plum Purple | `#7B4F8C` | 보라 꽃, 태피스트리, 양탄자 테두리 | 토큰(용도 확장) |
| Sky Blue | `#3E7CB1` | 파란 꽃, 리본, 나비 | 토큰 |
| Baby Blue | `#8FC1E3` | 나비, 창 유리, 물망초 | 신규 |
| Spring Green | `#B5D36B` | 앞 풀잎, 연한 잔디 | 신규 |
| Leaf Green | `#8CBF5A` | 잎, 잔디 | 신규 |
| Meadow Green | `#9DBB7A` | 풀밭(기존) | 기존 |
| Rampion Green | `#6FA55A` | 라푼젤 풀(기존) | 기존 |
| Olive | `#7A8F3C` | 뒤 풀잎, 담쟁이 | 신규 |
| Pine Green | `#3F6B4F` | 나무(기존), 앞 덤불 | 토큰 |
| Dark Pine | `#2F5240` | 해질녘 나무(기존) | 기존 |
| Teal | `#2F8F8A` | 중간 나무 겹 | 신규 |
| Mint Forest | `#A9D4C4` | 먼 숲 실루엣(낮) | 신규 |
| Night Forest | `#2A3A5E` | 먼 숲 실루엣(밤·해질녘) | 신규 |
| Deep Indigo | `#1F2A56` | 밤하늘 | 토큰 |
| Wall Grey | `#8E8A80` | 담(기존) | 기존 |
| Soil | `#4A3626` | 흙(기존) | 기존 |
| Stone Cream | `#D8D2C4` | 탑(기존), 방 벽 | 기존 |
| Room Wall | `#E4DFD3` | 방 벽(기존) | 기존 |
| Bark Brown | `#6B4A32` | 줄기, 창턱, 선반 | 토큰 |
| Kraft | `#C9A574` | 바구니, 밧줄, 창틀 | 신규 |
| Mushroom Cream | `#FBF4E6` | 버섯 대, 양탄자 | 신규(무광) |

(총 37색. 한 장면 10~20색.)

## 3. 화려하게 할 장면과 이유

| 장면 | 왜 | 어떻게 |
|---|---|---|
| 3·4 문 없는 탑 — 낮 숲 | 탑이 솟는 장면이자 놀이 2개. 지금 숲은 나무 셋뿐 | 먼 층 연한 숲 실루엣·먼 산, 중간 층 나무 5그루(초록 4색 겹), 덤불에 들꽃 6색, 버섯, 담쟁이, 나비. 앞 가림 큰 나무·꽃 덤불. 탑 자리와 새·토끼 둘레는 비움 |
| 6·7·9 노랫소리 — 해질녘 숲 | 왕자가 노래를 듣는 저녁, 왕자가 오르는 저녁, 빈 탑의 저녁. 세 장면이 같은 배경이라 가장 많이 보인다 | 하늘 띠 4장(앰버 → 복숭아 → 장미 → 연보라), 먼 산 3겹, 숲 실루엣 2겹, 중간 나무 어두운 초록 2색, 반딧불(코드). 앞 가림 나무 뒤에 왕자가 숨는다(6장) |
| 5·7B·8A·9B 탑 방 안 | 공주의 방. 노래·리본 놀이·싹둑·바람의 무대 | 태피스트리, 커튼, 창턱 화분, 선반(책·촛대), 종이 별 모빌, 둥근 양탄자. 창 위치·고리 벽·걸상 고정, 리본 자리(바닥 왼쪽) 민짜 |
| 8B·10 노래를 따라서 — 들판 | 재회. 마지막 인사 톡(손잡기)과 꽃잎·confetti | 꽃바다: 꽃 7색 언덕 띠 3겹, 먼 산과 아주 작은 성(왕자의 성), 나비, 앞 가림 꽃 묶음 양 모서리, 중간 꽃 띠. 왕자가 걷는 길 띠는 비움 |
| 2 라푼젤 풀 — 밤 텃밭 | "마법 텃밭"의 반짝. 지금은 담·흙·풀 줄 | 담에 달맞이꽃 덩굴(연노랑), 별 많이, 달빛 띠, 먼 숲 실루엣, 라푼젤 풀 3줄(연두 2톤), 반딧불(코드). 담 높이·아버지 자리·풀 자리 그대로 |

바꾸지 않는 장면: 1·2B 오두막 안(`cottage`) — 사람 집은 수수하게.

## 4. 장면별 표

좌표는 가로 기준 무대 px(세로는 `X(l, p)`), 바닥 `FL`, 탑 `TX = X(640, 560)`.

| # | 장면 | 새 배경(먼 층 → 중간 층 → 앞 층) | 중간 층 소품(인물 뒤) | 앞 가림 층 소품(맨 앞) | 비우는 자리 | 색지 | 카메라 | 연출(코드) |
|---|---|---|---|---|---|---|---|---|
| 1·2B | 오두막 안 | `rp_bg_cottage` 그대로 | — | — | — | — | 기존 | 없음 |
| 2 | 밤 텃밭 | `rp_bg_garden_night_v2`(refs: garden_night, 세트 B, 담 왼쪽 1/3·담 꼭대기 40%·풀 줄 62%·앞 땅 비움 그대로). **먼 층**: Deep Indigo 하늘, 별 5 → 22(Cream·Sunny Yellow), 달 그대로, 먼 숲 실루엣 띠(Night Forest). **중간 층**: 담(Wall Grey) 그대로 + 담 위에서 늘어지는 달맞이꽃 덩굴(Olive 줄기·Sunny Yellow 꽃 7, **담 왼쪽 끝 x < 15% 만**), 라푼젤 풀 줄 2 → 3(Rampion Green·Leaf Green 교대), 달빛 띠(Cream 얇은 띠, 흙 위). **앞 층(배경 안)**: 앞 흙 Soil 2톤 | 없음 | 없음 | 아버지가 담에 앉는 자리(230, 235)와 넘어오는 길, 라푼젤 풀(470, FL)·고텔(640) — 앞 땅 전체와 담 가운데~오른쪽 민짜 | Deep Indigo, Paper Cream, Sunny Yellow, Night Forest, Wall Grey, Olive, Rampion Green, Leaf Green, Soil, `#3A2A1E`(Soil 어두운 톤) (10) | 기존 | 반딧불: `T.bg` 에 Ember Amber 원 r 3~4 개 6 → 느리게 깜빡(opacity .2↔.9, 2~3초), 풀 줄 위 y 300~360 에만. 톡 뒤 `magic` 반짝은 기존 |
| 3·4 | 문 없는 탑 — 낮 숲 | `rp_bg_forest_day_v2`(refs: forest_day, 세트 A, 양옆 나무·가운데 비움·풀밭 아래 1/3 그대로). **먼 층**: Sky Paper 하늘, 구름 2, 먼 산 Lilac, 먼 숲 실루엣 띠(Mint Forest, 꼭대기 둥근 나무 줄). **중간 층**: 왼쪽 나무 3그루(Pine·Teal·Leaf 겹, 줄기 Bark), 오른쪽 나무 2그루, 나무 발치 덤불(Olive·Leaf) 속 들꽃(Sunny Yellow·Pink·Snow White·Lilac·Persimmon·Sky Blue 작은 꽃 20), 버섯 묶음(Coral 갓·Snow White 점·Mushroom Cream 대) 왼쪽 발치, 왼쪽 줄기에 담쟁이, 나비 2(Baby Blue·Sunny Yellow) **왼쪽 위 x < 30%**. **앞 층(배경 안)**: 앞 풀잎 띠 Spring Green(양옆만) | 들꽃 묶음 `wildflowers_mid` x 150, y FL − 20(고텔 470 왼쪽) · 같은 것 x 960, y FL − 20 | 큰 나무 `tree_front` x 40, y 580 · 꽃 덤불 `bush_flower_front` x 975, y 585 · 버섯 `mushrooms` x 110, y 585 | **탑 자리 x 48~72% + 위 하늘 x 40~80% y < 30%**, 탑 발치 땅 x 35~80% y > 70%, 새(TX+6, 76)·토끼(TX−85, FL) 둘레 ±120, 고텔(470) | Sky Paper, Paper Cream, Lilac, Mint Forest, Pine, Teal, Leaf, Olive, Spring, Meadow, Bark, Sunny Yellow, Pink, Snow White, Persimmon, Sky Blue, Baby Blue, Coral, Mushroom Cream (19) | 기존(세로 camSnap 520) | 나비 `butterfly` 2개를 코드로 x 150~300·y 120~200 에서 천천히 8자(6초, 반복), 탑 쪽으로 가지 않음. 탑 솟기 `towerRise`·놀이 반짝은 기존 |
| 5·7B·8A·9B | 탑 방 안 | `rp_bg_room_v2`(refs: room, 세트 A, **창 x 673~889·y 128~372·턱 372 그대로**, 걸상 왼쪽 그대로). **먼 층**: 창 밖 숲·먼 산(낮). **중간 층**: 둥근 돌벽 Stone Cream + 창 양옆 Candy Pink 커튼(벽 위에만, 창 안·창 오른쪽 벽 x > 56% 는 민짜 — 고리 자리), 왼쪽 위 태피스트리(Plum 바탕 + Straw Gold 별·마름모), 왼쪽 벽 선반(책 3권 Bean Red·Sky Blue·Straw Gold, 촛대 불 없음), 천장에서 늘어진 종이 별 모빌(Sunny Yellow·Cream 별 5, 왼쪽 위 모서리). **앞 층(배경 안)**: 바닥 Straw Gold 널 + 가운데 둥근 양탄자(Mushroom Cream 한 색, Plum 테두리 띠 1, x 25~65%·아래 22%) | 창턱 화분 `flower_pot` x 690, y 372(창 왼쪽 끝 턱 위, 라푼젤 760 뒤) | 없음 | 리본 자리(x 150~330, y 436~552)는 양탄자 위 — 양탄자에 무늬 없음(리본 색과 대비). 라푼젤(760)·고텔(560)·왕자(600~760)·비단실(830~890, FL)·고리(905, 250)·잘린 머리(905, 360) 둘레 | Room Wall, Stone Cream, Straw Gold, Mushroom Cream, Plum, Candy Pink, Bean Red, Sky Blue, Sunny Yellow, Paper Cream, Bark Brown, Kraft, Baby Blue, Leaf, Lilac (15) | 기존(세로 camSnap 400/480/520) | 없음(허밍·음표·반짝·가위·바람 기존) |
| 6·7·9 | 해질녘 숲 | `rp_bg_forest_dusk_v2`(refs: forest_dusk, 세트 B, 해 오른쪽 위·양옆 나무·가운데 비움 그대로). **먼 층**: 하늘 띠 4장(아래부터 Ember Amber → Dusk Peach → Dusk Rose → Dusk Mauve), 해 Cream, 먼 산 3겹(Far Mountain → Dusk Mauve → Night Forest), 숲 실루엣 띠 2겹(Night Forest 어둡게·밝게). **중간 층**: 왼쪽 나무 3그루(Dark Pine·Pine 겹), 오른쪽 2그루, 덤불 속 들꽃은 3색만 어둡게(Persimmon·Pink·Cream 작은 꽃 10), 왼쪽 줄기 담쟁이. **앞 층(배경 안)**: 앞 풀잎 띠 Olive(양옆만) | 탑 담쟁이 `tower_ivy` x TX − 70, y FL(탑 발치 왼쪽만; 머리 TX+40 피함) · 들꽃 묶음 `wildflowers_mid` x 960, y FL − 20 | 큰 나무 `tree_front` x 70, y 580(6장: 왕자가 X(120, 350) 뒤에 숨는 나무) · 꽃 덤불 `bush_flower_front` x 975, y 585 | 3·4장과 같은 탑 자리·발치. 말 들어오는 길(x −200 → 260, FL), 왕자 한 바퀴(탑 뒤로 TX+130), 고텔 길(−100 → 470), 9장 왕자 떠나는 길(→ −150) | Ember Amber, Dusk Peach, Dusk Rose, Dusk Mauve, Far Mountain, Night Forest, Paper Cream, Dark Pine, Pine, Olive, Meadow(어둡게 `#7FA06A` 기존), Bark, Persimmon, Pink, Lilac (15) | 기존(세로 camSnap 480/520, 9장 follow 300) | 반딧불 8(`T.bg`, Ember Amber r 3, 나무 발치 y 380~470 양옆만, 2~3초 깜빡). 7·9장도 같은 반딧불. 음표·오르기·바람은 기존 |
| 8B·10 | 노래를 따라서 — 들판 | `rp_bg_field_v2`(refs: field, 세트 A, 오두막 x 68~90%·언덕선 그대로). **먼 층**: Sky Paper 하늘, 구름 3, 먼 산 2겹(Lilac·Baby Blue) + 왼쪽 먼 산 위 아주 작은 성 실루엣(Stone Cream, 탑 둘 — 왕자의 성), 먼 숲 띠 Mint Forest. **중간 층**: 언덕 3겹(Spring Green → Meadow → Leaf) 각 겹에 꽃 띠(Pink·Sunny Yellow·Snow White·Persimmon·Lilac·Sky Blue·Coral 작은 꽃 60+), 오두막 그대로 + 문 옆 꽃 덤불, 나비 2 왼쪽 위. **앞 층(배경 안)**: 앞 풀잎 띠 Spring Green + 큰 꽃 몇 송이(**양 아래 모서리만**) | 꽃 띠 `flower_band_mid` x 300, y FL − 25 · 같은 것 x 760, y FL − 25(인물 뒤, 발치) | 꽃 묶음 `flowers_front_a` x 60, y 585 · 꽃 묶음 `flowers_front_b` x 945, y 585 | 왕자가 걷는 길(x −120 → 572, FL)과 두 사람 자리(572·640), 손잡기 톡 사각(x 546~666, y FL−170~FL−50), 8B 고텔(400)·라푼젤(560) — **길 띠(y FL−40~FL+10, x 0~70%)에는 큰 꽃 없음**, 꽃 띠 소품은 인물 뒤 | Sky Paper, Paper Cream, Lilac, Baby Blue, Mint Forest, Stone Cream, Spring, Meadow, Leaf, Pink, Sunny Yellow, Snow White, Persimmon, Sky Blue, Coral, Straw Gold, Bark Brown (17) | 기존(세로 camSnap 480/560) | 나비 `butterfly` 2개 코드 8자(왼쪽 위). 손잡기 뒤 `petals` 꽃잎 8 → 16장 + confetti 기존 |

## 5. 새 그림 목록 (jobs_rapunzel.json 추가분 15장)

배경(16:9, 1600×902, refs = 기존 배경으로 구도 유지) 5장:

| id | 장면 | refs | 빛 | pass |
|---|---|---|---|---|
| `rp_bg_garden_night_v2` | 2 | `assets/v3w/rp_bg_garden_night.webp` | B | 1 |
| `rp_bg_forest_day_v2` | 3·4 | `assets/v3w/rp_bg_forest_day.webp` | A | 1 |
| `rp_bg_room_v2` | 5·7B·8A·9B | `assets/v3w/rp_bg_room.webp` | A | 1 |
| `rp_bg_forest_dusk_v2` | 6·7·9 | `assets/v3w/rp_bg_forest_dusk.webp` | B | 1 |
| `rp_bg_field_v2` | 8B·10 | `assets/v3w/rp_bg_field.webp` | A | 1 |

소품(마젠타 배경, 얼굴 없음) 10장:

| id | 내용 | 층 | 높이(화면) | 틀 | pass / refs |
|---|---|---|---|---|---|
| `rp_layer_tree_front` | 큰 나무 한 그루(둥근 잎 3겹 Pine·Teal·Leaf, 굵은 줄기, 발치 풀) | 앞 | 520 | 2:3 | 1 |
| `rp_layer_bush_flower_front` | 꽃 덤불(Olive·Leaf 잎 + 분홍·노랑·흰 꽃 6) | 앞 | 120 | 3:2 | 1 |
| `rp_layer_wildflowers_mid` | 들꽃 묶음(6색 작은 꽃 7 + 풀잎) | 중간 | 110 | 3:2 | 1 |
| `rp_layer_mushrooms` | 버섯 3개 묶음(Coral 갓 + 흰 점 + 크림 대) | 앞 | 70 | 1:1 | 1 |
| `rp_layer_butterfly` | 나비 1마리(Baby Blue 날개 + Sky Blue 무늬 점, 눈 없음) | 코드 | 34 | 1:1 | 1 |
| `rp_layer_tower_ivy` | 탑 발치 담쟁이(Olive 덩굴 + Leaf 잎 + Pink 꽃 4, 왼쪽으로 퍼짐) | 중간 | 170 | 3:2 | 2 ← prop_tower(크기 비율) |
| `rp_layer_flower_pot` | 창턱 화분(테라코타 + 분홍 꽃 3) | 중간 | 50 | 1:1 | 1 |
| `rp_layer_flowers_front_a` | 큰 꽃 묶음 a(코스모스·양귀비·데이지 + 풀) | 앞 | 120 | 3:2 | 1 |
| `rp_layer_flowers_front_b` | 큰 꽃 묶음 b(물망초·노란 꽃·연보라 꽃, 같은 크기) | 앞 | 120 | 3:2 | 2 ← flowers_front_a |
| `rp_layer_flower_band_mid` | 꽃 띠(작은 꽃 12 + 풀, 가로로 긴 띠) | 중간 | 90(폭 ≈ 480) | 3:2 | 2 ← flowers_front_a |

저장 `assets/raw/restyle/rapunzel/<id>.png` → `post_tale.py rapunzel` → `assets/v3w/<id>.webp`.

생성 순서: pass 1(배경 5 + 소품 7) → pass 2(소품 3; `rp_prop_tower.png` 은 이미 있고 `flowers_front_a` 는 pass 1 에서 나온다).

받은 뒤 점검: 숲 배경 두 장의 **탑 자리(x 48~72%)·그 위 하늘이 비어 있는지**(겹쳐 보기 — 비어 있지 않으면 다시 생성), room_v2 의 창 위치·크기가 기존과 같은지(겹쳐 보기 ±2%), 창 오른쪽 벽이 민짜인지, 양탄자에 무늬가 없는지, 들판의 길 띠가 비어 있는지, 소품 얼굴 없음(나비·버섯), 같은 소품 두 장(flowers a/b)이 같은 크기인지.

## 6. 코드 작업 (이 문서 확정 뒤, 뒤의 큐)

- `rapunzel.js`: `BGS` 를 `_v2` 다섯으로 바꾸고 `rp_bg_cottage` 는 그대로(목업 `shapes` 표도 v2 이름으로). `ASP`·`HT` 에 `layer_*` 10개 추가, post 뒤 측정.
- `put` 순서: 중간 소품 → 탑 → 라푼젤·고리·머리 → 사람 → 앞 소품. 6장 왕자 숨기: 왕자를 `tree_front` 보다 먼저 put(나무 뒤에 보이게).
- 반딧불·나비 함수: `fireflies(T, spots)`·`butterflies(T, n, box)` (장면이 바뀌면 `T.clear()` 가 지운다).
- 세로 화면(P): 앞 가림 소품은 보이는 폭 밖이어도 된다. 10장 세로는 왕자 길이 좁으니 `flower_band_mid` 는 x 760 하나만.
- 테스트: 자동 재생으로 2·3·5·6·10장 사진. 탑·창·새·토끼·리본·손잡기 자리가 배경과 또렷한지, 6장 왕자가 나무 뒤에 반쯤 보이는지.

## 7. 판단 필요

1. **들판의 '왕자의 성' 실루엣**: 10장 마지막 자막이 "성으로 떠났어요"라 먼 산 위에 아주 작은 성을 넣었다. 원작엔 성의 위치 묘사가 없어 더한 것이다. 거절하면 field_v2 작업표 SCENE 문장에서 castle 한 줄만 지운다.
2. **탑 방 안 커튼·태피스트리의 색(Candy Pink·Plum)**: 공주 방답게 분홍·보라를 썼다(10-22 색 제한 해제). 고텔이 가둔 탑이 너무 아늑해 보인다고 보면 커튼은 Paper Cream, 태피스트리는 Sky Blue·Straw Gold 로 바꾼다(작업표 색 목록만 수정).

## 8. 확정 사항

- 인물·탑·머리 그림, 대사·녹음, 조작은 바꾸지 않는다. 오두막 안 배경은 그대로.
- 새 배경 `*_v2` 5장, 기존 파일은 참고 구도로 쓰고 남긴다. 탑 자리·창 위치·담 높이·길 띠는 기존 수치 그대로.
- 1조각 1색·광택 금지·소품 얼굴 없음·원근법 금지·광원 한 방향은 그대로.

## 결정 (2026-10-22)

- **판단 1 (들판 성 실루엣)**: **넣지 않는다.** `rp_bg_field_v2` 프롬프트에서 먼 산 위 성 문장과 Stone Cream 색 항목을 지웠다(생성 전). §3·§6 표의 '아주 작은 성' 문구는 무효. 먼 층은 하늘·구름·먼 산 2겹·먼 숲 띠.
- **판단 2 (탑 방 색)**: 갇힌 탑이므로 **차분하게** 바꾼다. Paper Cream·Sky Blue·Straw Gold 계열: 커튼 Paper Cream, 태피스트리 Sky Blue 바탕 + Straw Gold 별·마름모, 양탄자 테두리 Sky Blue, 책 Sky Blue·Paper Cream·Straw Gold, 별 모빌 Straw Gold·Cream. `rp_bg_room_v2` 프롬프트와 색지 목록(Candy Pink·Plum·Bean Red·Sunny Yellow·Lilac 삭제, 분홍·보라·붉은색 금지 문구 추가)을 고쳤다(생성 전). 표 속 Candy Pink 커튼·Plum 태피스트리 문구는 무효.
