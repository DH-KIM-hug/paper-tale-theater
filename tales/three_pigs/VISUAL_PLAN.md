# 아기 돼지 삼형제 — 시각 재기획 (꽃 들판·세 집터 층층·라이트박스 3장)

작성 2026-10-23. 근거: CLAUDE.md §7-5-1(2026-10-23 사용자 지시). 형식은 `tales/snow_white/VISUAL_PLAN.md`, 참고 그림 요소는 `tales/goldilocks/VISUAL_PLAN.md` §0.

이 문서는 **배경·레이어 소품·라이트박스 실루엣 층**만 다룬다. 돼지 셋·엄마·늑대 그림, 집 소품(`tp_house_*`, 짓는 단계 `tp2_*`), 재료 더미, 부채는 바꾸지 않는다. 대사·녹음·조작(재료 고르기·톡 짓기·후~) 그대로. 생성은 확정 뒤.

작업표: `tools/app/gen/jobs_three_pigs.json` 끝에 붙인 14항목(배경 `tp_bg_*_v2` 5 + 레이어 `tp_layer_*` 5 + 라이트박스 `tp_lb_*` 3 + 실루엣 앞층 1).

## 1. 방향과 원칙

- **화려하게 하는 장면**: ① 들판(1장 누구일까요) ② 세 집터(3~5장 짓기·6~7장 후~, 같은 배경 재사용) ③ 어느 집으로?(8장 `field`).
- **라이트박스 3장**: ⑴ 쿵쿵쿵(10장 `brick_out`) — 해 질 녘, 벽돌 집 실루엣과 빛나는 창·문, 늑대가 두드린다. ⑵ 보글보글(11장 `chimney`) — 벽난로 불빛이 광원, 부엌 실루엣. ⑶ 벽돌 마을(12장 `sunset`) — 지는 해 앞 마을 실루엣, 돼지 셋은 보통 색.
- **바꾸지 않는 장면**: 무엇으로 지을까?(2장 `shop`, 재료 고르기 — 배경 조용)와 벽돌 집 안(9장 `brick_in`). 가장자리 소품만.
- 집은 **소품**(`tp_house_*`)이라 배경에 집을 그리지 않는다. 집터 배경은 집·더미가 놓이는 자리(코드 `hx=700`, `pileX=385`, 바닥 `GROUND=480`; 세로는 `hx=640`, `y=420`)를 민무늬로 비운다.
- 재료 원칙 그대로. 낮 세트 A. 라이트박스는 뒤의 광원.
- **인물·누르는 대상 주변 비우기**:
  - 집터 셋: 그림 가로 25~95%, 세로 55~100% 는 민무늬 땅(집·더미·돼지·늑대). 화려함은 **위쪽 40% 와 왼쪽 0~20%** 에만(먼 산·나무·꽃 띠).
  - 쿵쿵쿵(10장): 벽돌 집은 **배경 그림 안**에 있다(`brick_outv2`). 문·창·굴뚝 자리 그대로(refs). 늑대가 서는 왼쪽(가로 0~45%, 세로 60~100%) 비움.
  - 보글보글(11장): 벽난로·냄비 자리 그대로(refs). 늑대가 떨어지는 굴뚝 세로 띠(가로 40~60%) 비움.
  - 벽돌 마을(12장): 돼지 셋이 서는 가로 15~85%, 세로 60~95% 비움.

## 2. 색지 목록

### 2-1. 들판·어느 집으로?(1·8장) — 18색
Sky Paper `#A9D3F0` 하늘 · Paper Cream `#F6ECD8` 구름 · Sunny Yellow `#F2C94E` 해·민들레 · Mist Lilac `#D7CCE8` 먼 산 · Lavender Dusk `#8B7BB8` 둘째 산 · Sky Blue `#3E7CB1` 셋째 산·호수 · Pale Sage `#BFD3B4` 먼 나무 줄 · Lime `#C8D94A` 밝은 언덕 · Spring Green `#B5D36B` 들판(비움) · Leaf Green `#8CBF5A` 중간 언덕 · Pine Green `#3F6B4F` 나무 · Tangerine `#F28C28` 소용돌이 나무 잎 바깥 · Hot Coral `#F0624D` 잎 가운데 · Magenta Paper `#C2397A` 잎 안쪽·꽃 · Blossom Pink `#F2A7B5` 벚꽃·코스모스 · Bean Red `#A93B32` 양귀비·지붕 · Plum Purple `#7B4F8C` 보라 들꽃 · Sand `#E9DCC0` 길.

### 2-2. 세 집터(3~7장) — 한 집터 12색씩
- **짚 집터**(`strawlot_v2`): Sky Paper · Paper Cream · Sunny Yellow 해 · Mist Lilac · Lavender Dusk · Marigold `#F5B700` 밀밭 먼 띠 · Straw Gold `#D9A94E` 밀밭 · Pale Gold `#EBD08A` 밀 이삭 밝은 판 · Olive `#7A8F3C` 풀 · Hot Coral 양귀비 · Sand 땅(비움) · Bark Brown 울타리.
- **나무 집터**(`woodlot_v2`): Sky Paper · Paper Cream · Mist Lilac · Sky Blue 먼 산 · Pale Sage · Pine Green 전나무 · Deep Teal `#1F5F5B` 앞 전나무 · Teal `#2F8F8A` 둥근 나무 · Fern `#5E8C5A` 고사리 · Bean Red 버섯 · Sand 땅(비움) · Bark Brown 그루터기.
- **벽돌 집터**(`bricklot_v2`): Sky Paper · Paper Cream · Mist Lilac · Lavender Dusk · Blossom Pink 벚꽃 · Candy Pink `#E8A0B8` · Magenta Paper · Leaf Green 언덕 · Bean Red 벽돌 가마·벽돌 더미(기존 자리) · Persimmon `#E8703A` 점토 언덕 · Fawn `#C98B5A` 땅(비움) · Stone Grey `#A9A39B` 돌.

### 2-3. 라이트박스(쿵쿵쿵 해 질 녘·벽난로·마을 노을) — 13색
| 색지 | HEX | 층 |
|---|---|---|
| Glow Cream | `#FBF1C8` | 해 둘레 맨 뒤, 창문 빛 가운데, 벽난로 불 가운데 |
| Glow Gold | `#F7D77A` | 둘째 빛 판 |
| Glow Amber | `#F5A64B` | 셋째 빛 판, 불꽃 바깥 |
| Hot Coral | `#F0624D` | 노을 하늘 가운데 |
| Magenta Paper | `#C2397A` | 노을 구름 띠 |
| Dusk Rose | `#D98A9E` | 먼 산 |
| Plum Purple | `#7B4F8C` | 둘째 산 |
| Grape | `#5A2D82` | 셋째 산, 먼 마을 |
| Night Violet | `#2B1E4F` | 중간 실루엣(나무·마을 지붕) |
| Silhouette Ink | `#2A2118` | 앞 실루엣(집 벽·굴뚝·벽난로 틀·가지) |
| Bean Red | `#A93B32` | 벽돌 집 벽(실루엣보다 한 단계 밝게, 벽돌 집임을 보이게) |
| Fawn | `#C98B5A` | 땅 띠(인물이 서는 곳) |
| Cocoa | `#4E3524` | 부엌 바닥·벽(중간 밝기) |

## 3. 장면별 표

| # | 장면 | 배경(지금) | 지금 문제 | 새 배경 / 층 구성(먼→앞) | 카메라 |
|---|---|---|---|---|---|
| 1 | 누구일까요(들판) | `meadow` | 언덕 한 장·꽃 2송이 | `tp_bg_meadow_v2`: 가운데 비움. 산 3겹·먼 마을·호수, 양옆 소용돌이 나무, 꽃밭 띠(양귀비·코스모스·보라·민들레) 양옆·앞 | 눈높이(세로 .62배 넓게) |
| 2 | 무엇으로 지을까? | `shop` | 바꾸지 않음(고르기) | 소품: `tp_layer_cherry_branch` 위 모서리 | 기존 300 |
| 3·6 | 첫째의 짚 집 / 후~ | `strawlot` | 밀밭 한 장 | `tp_bg_strawlot_v2`: 땅 비움. 산 2겹, 밀밭 3단(Marigold→Straw Gold→Pale Gold 이삭 줄), 왼쪽 울타리·양귀비 | 기존 |
| 4·7 | 둘째의 나무 집 / 후~ | `woodlot` | 전나무 숲. 좋은 편 | `tp_bg_woodlot_v2`: 땅 비움. 산 2겹, 전나무 2색(Pine·Deep Teal) 줄, 둥근 Teal 나무, 왼쪽 그루터기·버섯·고사리 | 기존 |
| 5 | 셋째의 벽돌 집 | `bricklot` | 점토 땅·벽돌 더미. 보통 | `tp_bg_bricklot_v2`: 땅 비움. 산 2겹, 벚꽃 3색 소용돌이 양쪽, 왼쪽 벽돌 가마(둥근 가마, 얼굴 없음)와 벽돌 더미(기존 자리), 점토 언덕 | 기존 |
| 8 | 어느 집으로? | `field` | 집터 셋이 보이는 들판 | `tp_bg_field_v2`: 세 집터 자리 그대로(refs). 둘레 꽃밭·벚꽃·산 3겹 | 기존 |
| 9 | 벽돌 집 안 | `brick_in` | 바꾸지 않음 | 없음 | 기존 450 |
| 10 | 쿵쿵쿵! | `brick_outv2` | 낮 집 한 채. 긴장감 없음 | **라이트박스** `tp_lb_brick_dusk`(§4-1) | 기존 450 |
| 11 | 보글보글 | `chimney` | 벽난로 부엌. 보통 | **라이트박스** `tp_lb_hearth`(§4-2) | 기존 |
| 12 | 벽돌 마을 | `sunset` | 노을 마을. 좋은 편이나 평평 | **라이트박스** `tp_lb_village_sunset`(§4-3) | 기존(세로 .55배) |

## 4. 라이트박스 장면

### 4-1. 벽돌 집 앞 해 질 녘 (`tp_lb_brick_dusk`, 10장)
- 집·문·창·굴뚝은 **기존 `tp_bg_brick_outv2` 와 같은 자리·크기**(refs). 집 벽은 Bean Red 한 장(실루엣보다 밝아 "벽돌 집"이 보임), 지붕·굴뚝 Silhouette Ink, 창·문 틈은 Glow Gold·Glow Amber 빛 판(안에 돼지 셋이 있다는 신호).
- 뒤층(빛): Glow Cream 해 둘레(가로 20%, 세로 25%) → Glow Gold → Glow Amber → Hot Coral 하늘 → Magenta 구름 띠.
- 중간층: Dusk Rose → Plum Purple 산, Night Violet 둥근 나무 줄(집 뒤 오른쪽 큰 나무 자리 그대로).
- 앞층: Silhouette Ink 덤불(오른쪽 가장자리만). 늑대가 서는 왼쪽 땅(세로 60~100%) Fawn 띠.
- 코드: 창 `glow` 2, 늑대 "후~" 때 `shake`, 집은 흔들리지 않음(튼튼함).

### 4-2. 벽난로 불빛 (`tp_lb_hearth`, 11장)
- 벽난로·냄비·굴뚝 자리 그대로(refs). 광원은 **벽난로 불**: Glow Cream 가운데 → Glow Gold → Glow Amber 불꽃 3겹(각 한 장, 불꽃 모양). 냄비는 Silhouette Ink 실루엣(불 앞), 벽난로 틀 Silhouette Ink.
- 벽: Cocoa 한 장(불빛 받은 중간 밝기), 벽 위 선반·주전자·국자 Silhouette Ink 실루엣, 매단 허브 실루엣.
- 바닥(세로 75~100%): Fawn — 돼지 셋이 서는 곳. 굴뚝 세로 띠(가로 40~60%, 세로 0~55%)는 비움(늑대 떨어짐).
- 코드: 불꽃 `glow` 깜빡(0.6초 불규칙), 냄비 김 종이 조각 3(기존 보글 코드), 늑대 떨어질 때 `flash`.

### 4-3. 벽돌 마을 노을 (`tp_lb_village_sunset`, 12장)
- 뒤층(빛): Glow Cream 큰 해 둘레(가로 50%, 세로 30%) → Glow Gold → Glow Amber → Hot Coral 하늘 → Magenta 구름 띠 2.
- 중간층: Dusk Rose → Plum Purple → Grape 산 3겹, Night Violet 마을 실루엣(지붕·굴뚝·종탑, 가로 55~100%, 세로 40~62%)에 창문 Glow Amber 점 8.
- 앞층: Silhouette Ink 사이프러스 나무 2(가로 0~10%, 90~100%), 앞 띠 들풀 실루엣(세로 92~100%).
- 땅(세로 62~92%): Fawn 띠 — 돼지 셋(분홍)이 또렷. 
- 코드: 해 `glow`, 창문 점 깜빡 4, `T.finale()` 꽃가루 기존.

## 5. 레이어 소품

| 소품 | 내용 | 높이 | 자리(가로 / 세로 P) | 층 | 장면 |
|---|---|---|---|---|---|
| `tp_layer_wheat_front` | 밀 이삭 묶음(Straw Gold·Pale Gold) | 120 | x 40, y 590 · x 980(뒤집어) | 앞(맨 앞) | 3·6 |
| `tp_layer_fern_front` | Deep Teal 고사리 + 버섯 묶음 | 120 | x 40, y 590 · x 980(뒤집어) | 앞 | 4·7 |
| `tp_layer_poppies_mid` | 양귀비·코스모스·보라 들꽃 띠(폭 ≈1000) | 80 | x 500, y 552 | 중간(맨 뒤 소품) | 1·8 |
| `tp_layer_cherry_branch` | 벚꽃 가지(3색 소용돌이 잎) | 180 | x 940 / 700, y −24 · x 60(뒤집어) | 앞(위) | 2·5·8 — `rotate` ±1°(8초) |
| `tp_layer_flowerbush_front` | 꽃 덤불(5색) | 110 | x 40, y 590 · x 980 | 앞 | 1·8 |
| `tp_layer_sil_cypress` | Silhouette Ink 사이프러스·덤불 실루엣(옆 가장자리) | 300 | x 20, y 590 · x 980(뒤집어) | 앞(맨 앞) | 10·12 라이트박스 |

z 순서: `poppies_mid` → 배우·집 소품 → 앞 소품(맨 앞). 집터 장면(3~7)의 앞 소품은 **왼쪽(x 40)만** — 오른쪽은 집(x 700, 폭 ≈ 400)이 가장자리까지 온다. 세로 화면은 집터 카메라가 `hx` 로 이동하므로 앞 소품 없음.

## 6. 새로 그릴 그림 (14장, `jobs_three_pigs.json` 끝)

| 구분 | id | 내용 | refs |
|---|---|---|---|
| 배경 | `tp_bg_meadow_v2` | 들판, 가운데 비움 | `tp_bg_meadow` |
| 배경 | `tp_bg_strawlot_v2` | 짚 집터, 땅 비움 | `tp_bg_strawlot` |
| 배경 | `tp_bg_woodlot_v2` | 나무 집터, 땅 비움 | `tp_bg_woodlot` |
| 배경 | `tp_bg_bricklot_v2` | 벽돌 집터, 땅·벽돌 더미 자리 그대로 | `tp_bg_bricklot` |
| 배경 | `tp_bg_field_v2` | 어느 집으로?, 세 집터 자리 그대로 | `tp_bg_field` |
| 라이트박스 | `tp_lb_brick_dusk` | §4-1, 집·문·창 자리 그대로 | `tp_bg_brick_outv2` |
| 라이트박스 | `tp_lb_hearth` | §4-2, 벽난로·냄비 자리 그대로 | `tp_bg_chimney` |
| 라이트박스 | `tp_lb_village_sunset` | §4-3 | `tp_bg_sunset` |
| 소품 | `tp_layer_wheat_front` / `tp_layer_fern_front` / `tp_layer_poppies_mid` / `tp_layer_cherry_branch` / `tp_layer_flowerbush_front` | §5 | — |
| 실루엣 | `tp_layer_sil_cypress` | §5 | — |

받은 뒤 점검: ① 집터 땅(가로 25~95%, 세로 55~100%)이 비었는지(집 소품·더미·돼지 자리) ② 벽돌 집(10장)·벽난로(11장)·세 집터(8장) 자리가 기존과 같은지(겹쳐 보기 ±2%) ③ 라이트박스 빛 판·불꽃 3겹이 각각 단색인지, 땅 띠가 실루엣보다 밝은지 ④ 소품 얼굴 없음(가마·냄비) ⑤ 광택·보라 그림자 없음.

## 7. 판단이 필요한 부분

1. **쿵쿵쿵을 해 질 녘으로**: 원작에 시간은 없다. 벽돌 집 안의 돼지들이 창에서 빛나고, 늑대가 어두운 바깥에 있는 대비가 "튼튼한 집" 교훈을 돕는다. 낮이 낫다면 `brick_outv2` 에 소품만.
2. **벽난로 라이트박스의 늑대**: 늑대(회색)가 Cocoa 벽 앞에서 떨어진다. 묻히면 늑대 뒤에 코드 `glow`(.25) 또는 벽을 Fawn 으로 한 단계 밝게.
3. **집터 셋 세로 화면**: 집터 카메라가 `hx=640` 으로 이동하므로 왼쪽 화려한 층(가로 0~20%)이 세로에서는 보이지 않는다. 세로용 별도 그림은 만들지 않는다(아이패드 우선).

## 8. 확정 사항

- 인물·집 소품·재료·부채·대사·녹음·조작 그대로. 무엇으로 지을까?·벽돌 집 안 배경 그대로.
- 작업표 14장은 `jobs_three_pigs.json` 끝에 붙였고 기존 항목은 바꾸지 않았다.
