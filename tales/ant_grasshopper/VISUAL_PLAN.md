# 개미와 베짱이 — 시각 재기획 (사계절 층층 들판·겨울밤 라이트박스 2장)

작성 2026-10-23. 근거: CLAUDE.md §7-5-1(2026-10-23 사용자 지시). 형식은 `tales/snow_white/VISUAL_PLAN.md`, 참고 그림 요소는 `tales/goldilocks/VISUAL_PLAN.md` §0.

이 문서는 **배경·레이어 소품·라이트박스 실루엣 층**만 다룬다. 개미·베짱이·벌레 친구 그림, 옷 고르기 카드, 곡식·도토리 소품은 바꾸지 않는다. 대사·녹음·조작 그대로. 생성은 확정 뒤.

작업표: `tools/app/gen/jobs_ant_grasshopper.json` 끝에 붙인 12항목(배경 `ag_bg_*_v2` 4 + 레이어 `ag_layer_*` 5 + 라이트박스 `ag_lb_*` 2 + 실루엣 앞층 1).

## 1. 방향과 원칙

- 이 동화의 강점은 **사계절**이다. 계절마다 색지 묶음을 완전히 바꾸고, 같은 구도(개미집 오른쪽, 언덕 가운데, 큰 나무 왼쪽)를 유지해 "같은 들판이 계절 따라 변한다"가 보이게 한다.
- **화려하게 하는 장면**: ① 여름 들판(1장 먹이 나르기, 3장 소나기 — 같은 그림에 코드 비) ② 풀잎 무대(2장) ③ 가을(4장) ④ 봄(9장).
- **라이트박스 2장**: ⑴ 첫눈(5장) — 눈 내리는 보랏빛 겨울 저녁, 베짱이가 혼자 떤다. ⑵ 겨울 음악회(8장) — 개미집 안 등불 빛, 흙 실루엣.
- **바꾸지 않는 장면**: 개미집 문(6장 똑똑 `door`, 문 두드리기 조작·눈 코드)과 창고(7장 창고 가득 `cellar`, 곡식 세기)는 그대로. 개미 눈높이(`ant_eye`)는 쓰는 장면이 짧아 그대로.
- 재료 원칙 그대로. 광원 세트 A(낮). 라이트박스는 뒤의 광원.
- **인물·누르는 대상 주변 비우기**:
  - 들판(여름·가을·봄): 개미집(기존 그림 오른쪽, 가로 ≈ 78~95%, 세로 ≈ 45~75%)과 개미집 문 자리는 **기존과 같은 자리·크기**. 개미가 곡식을 나르는 길(가로 10~80%, 세로 72~100%)은 민무늬 풀밭.
  - 풀잎 무대: 큰 잎(가로 25~75%, 세로 55~80%) 자리 그대로. 잎 위 베짱이(x 500, y 470) 둘레 비움.
  - 첫눈: 멀리 보이는 구멍(코드 `hole: [655,150]`)은 같은 자리. 베짱이가 걷는 눈밭(세로 60~100%) 비움.
  - 겨울 음악회(창고 안): 곡식 방(왼쪽)·도토리 방(오른쪽) 자리 그대로. 가운데 통로(가로 30~70%)에 개미들과 베짱이가 선다.

## 2. 색지 목록

### 2-1. 여름(1·3장) — 15색
Sky Paper `#A9D3F0` 하늘 · Paper Cream `#F6ECD8` 구름 · Sunny Yellow `#F2C94E` 해 · Mist Lilac `#D7CCE8` 먼 산 · Sky Blue `#3E7CB1` 둘째 산 · Pale Sage `#BFD3B4` 먼 나무 줄 · Lime `#C8D94A` 밝은 언덕 · Spring Green `#B5D36B` 들판(비움) · Leaf Green `#8CBF5A` 중간 언덕 · Pine Green `#3F6B4F` 큰 나무 잎 바깥 · Teal `#2F8F8A` 큰 나무 잎 가운데 · Olive `#7A8F3C` 풀 포기 · Marigold `#F5B700` 해바라기 · Hot Coral `#F0624D` 양귀비 · Bark Brown `#6B4A32` 줄기·개미집(기존 색).

### 2-2. 가을(4장) — 15색
Peach `#F4C7A1` 하늘 · Glow Gold `#F7D77A` 해 둘레 · Sunny Yellow `#F2C94E` 해 · Dusk Rose `#D98A9E` 먼 산 · Plum Purple `#7B4F8C` 둘째 산 · Grape `#5A2D82` 셋째 산 · Tangerine `#F28C28` 소용돌이 단풍 바깥 · Persimmon `#E8703A` 단풍 가운데 · Bean Red `#A93B32` 단풍 안쪽 · Marigold `#F5B700` 은행 · Straw Gold `#D9A94E` 마른 풀 언덕 · Fawn `#C98B5A` 땅 · Olive `#7A8F3C` 풀 포기 · Bark Brown `#6B4A32` 줄기·개미집 · Magenta Paper `#C2397A` 국화.

### 2-3. 봄(9장) — 15색
Sky Paper `#A9D3F0` 하늘 · Paper Cream `#F6ECD8` 구름 · Mist Lilac `#D7CCE8` 먼 산 · Lavender Dusk `#8B7BB8` 둘째 산 · Lime `#C8D94A` 밝은 언덕 · Spring Green `#B5D36B` 들판 · Leaf Green `#8CBF5A` 중간 언덕 · Blossom Pink `#F2A7B5` 벚꽃 바깥 · Candy Pink `#E8A0B8` 벚꽃 가운데 · Magenta Paper `#C2397A` 벚꽃 안쪽 · Bean Red `#A93B32` 튤립 · Sunny Yellow `#F2C94E` 튤립·민들레 · Sky Blue `#3E7CB1` 파란 들꽃 · Snow White `#F4F6FA` 데이지 · Bark Brown `#6B4A32` 줄기·개미집.

### 2-4. 풀잎 무대(2장) — 12색
Sky Paper 하늘 · Mist Lilac 먼 산 · Pine Green `#3F6B4F` 큰 풀잎 · Deep Teal `#1F5F5B` 뒤 풀잎 · Lime `#C8D94A` 무대 잎(기존 자리) · Leaf Green `#8CBF5A` 클로버 · Hot Coral `#F0624D` 양귀비 · Marigold `#F5B700` 민들레 · Blossom Pink `#F2A7B5` 코스모스 · Plum Purple `#7B4F8C` 보라 들꽃 · Fawn `#C98B5A` 흙 · Stone Grey `#A9A39B` 돌.

### 2-5. 라이트박스(첫눈 저녁·창고 안 등불) — 12색
| 색지 | HEX | 층 |
|---|---|---|
| Glow Cream | `#FBF1C8` | 등불 둘레 맨 뒤 빛 판(창고), 달 둘레(첫눈) |
| Glow Gold | `#F7D77A` | 둘째 빛 판 |
| Glow Amber | `#F5A64B` | 셋째 빛 판(창고 벽에 비친 빛) |
| Moon Ice | `#E8EEF7` | 달, 눈 |
| Moonlight | `#DDE6F2` | 눈밭 띠(베짱이가 서는 곳) |
| Mist Lilac | `#D7CCE8` | 겨울 하늘(맨 뒤 종이) |
| Lavender Dusk | `#8B7BB8` | 먼 눈 언덕 |
| Plum Purple | `#7B4F8C` | 둘째 언덕 |
| Night Violet | `#2B1E4F` | 겨울 나무 실루엣 |
| Silhouette Plum | `#3A2A4A` | 앞 마른 풀 실루엣 |
| Silhouette Ink | `#2A2118` | 창고 흙 벽 실루엣, 뿌리 |
| Cocoa | `#4E3524` | 창고 둘째 흙 층(한 단계 밝게) |

## 3. 장면별 표

| # | 장면 | 배경(지금) | 지금 문제 | 새 배경 / 층 구성(먼→앞) | 카메라 |
|---|---|---|---|---|---|
| 1 | 먹이 나르기 | `summer` | 언덕 2겹·나무 2그루. 구도는 좋음 | `ag_bg_summer_v2`: 개미집 자리 그대로. 산 2겹 + 먼 나무 줄, 언덕 3단(Lime→Spring→Leaf), 왼쪽 큰 나무를 2색 잎 덩어리로 크게, 양옆 해바라기·양귀비 띠 | 눈높이, 기존 |
| 2 | 풀잎 무대 | `leafstage` | 흙·풀잎. 무대 느낌 약함 | `ag_bg_leafstage_v2`: 무대 잎 자리 그대로. 뒤에 키 큰 풀잎 5~6장(Pine·Deep Teal 두 색이 번갈아), 양옆 들꽃 덤불(양귀비·민들레·코스모스·보라), 앞 클로버 띠 | 눈높이 가까이(기존 1.2배) |
| 3 | 소나기 | `summer` + 코드 비·먹구름 | 1장과 같음 | `ag_bg_summer_v2` 재사용(코드 먹구름·비 그대로) | 기존 |
| 4 | 가을 | `autumn3` | 주황 하늘·언덕. 좋은 편 | `ag_bg_autumn_v2`: 개미집 자리 그대로. Peach 하늘 + 해, 산 3겹(Dusk Rose→Grape), 소용돌이 단풍 나무 2그루(3색), 은행 나무, 낙엽 띠 양옆, 국화 | 기존 → 1.6배 |
| 5 | 첫눈 | `winter_high` | 눈밭 한 장. 허전 | **라이트박스** `ag_lb_snow_dusk`(§4-1) | 기존 |
| 6 | 똑똑 | `door` | 바꾸지 않음(문 조작·눈) | 소품: `ag_layer_snow_branch` 위 모서리 | 기존 |
| 7 | 창고 가득 | `cellar` | 바꾸지 않음(곡식 세기) | 없음 | 기존 2.1배 |
| 8 | 겨울 음악회 | `cellar` | 세기 뒤 같은 그림 | **라이트박스** `ag_lb_cellar_lamp`(§4-2) | 기존 2.1배 |
| 9 | 봄 | `spring` | 벚꽃 2그루·언덕. 좋은 편 | `ag_bg_spring_v2`: 개미집 자리 그대로. 산 2겹, 벚꽃 나무 2그루를 3색 소용돌이 잎으로, 튤립·민들레·데이지 띠 양옆, 앞 띠 꽃 | 기존(세로 380) |

## 4. 라이트박스 장면

### 4-1. 첫눈 저녁 (`ag_lb_snow_dusk`, 5장)
- 이야기: 베짱이가 눈 내리는 들판에서 떨며 개미집을 찾아간다. 멀리 구멍(코드 `hole: [655,150]`, 그림 가로 ≈ 64%, 세로 ≈ 29%)이 보인다 — **같은 자리**에 Glow Amber 작은 빛 판(개미집 문 불빛)을 둔다.
- 뒤층(빛): Mist Lilac 하늘(맨 뒤 종이) → Glow Cream 달 둘레 판(가로 20%, 세로 15%) → Moon Ice 달. 눈송이는 코드(기존 `precip`).
- 중간층: Lavender Dusk → Plum Purple 눈 언덕 2겹(둥근 능선, Moon Ice 눈 띠가 능선 위에 얹힘), Night Violet 겨울 나무 실루엣 줄(가지만, 잎 없음).
- 앞층: Silhouette Plum 마른 풀·억새 실루엣 양옆(가로 0~15%, 85~100%).
- 땅(세로 60~100%): Moonlight 눈밭 띠. 베짱이(초록)가 보랏빛 눈밭에서 또렷하다.
- 코드: 눈 `precip` 그대로, 달 `glow`, 멀리 구멍 빛 `glow` 작게.

### 4-2. 창고 안 등불 음악회 (`ag_lb_cellar_lamp`, 8장)
- 이야기: 겨울, 개미집 안에서 베짱이가 연주하고 개미들이 듣는다.
- 뒤층(빛): 통로 가운데 위 등불(Glow Cream 가운데 → Glow Gold → Glow Amber 3겹 동심원, 가로 50%, 세로 20%)이 광원. 등불 틀은 Silhouette Ink.
- 중간층: 흙 벽은 Cocoa 한 장(등불 빛을 받은 쪽), 곡식 방(왼쪽)·도토리 방(오른쪽)은 **기존 `ag_bg_cellar` 와 같은 자리**에 둥근 구멍 — 곡식(Straw Gold)·도토리(Bark Brown)는 기존처럼 가득.
- 앞층: Silhouette Ink 흙 테두리(위·양옆, 뿌리 실루엣이 위에서 내려옴). 아래 땅(세로 75~100%)은 Fawn 통로 — 개미들과 베짱이가 서는 곳, 실루엣 아님.
- 코드: 등불 `glow` 숨 쉬기, 음표 `floaty` 기존, 카메라 2.1배 그대로(세로 1.1배).

## 5. 레이어 소품

| 소품 | 내용 | 높이 | 자리(가로 / 세로 P) | 층 | 장면 |
|---|---|---|---|---|---|
| `ag_layer_grass_front` | Deep Teal·Pine 풀잎 큰 묶음(5~6장) | 130 | x 40, y 590 · x 980(뒤집어) | 앞(맨 앞) | 1·2·3·9 |
| `ag_layer_sunflowers_mid` | 해바라기 3 + 양귀비 2 묶음 | 110 | x 130 / 290, y 556 · x 900 / 720(뒤집어) | 중간(인물 뒤) | 1·3 |
| `ag_layer_leafpile_front` | 낙엽 더미(주황·감·빨강·노랑 잎 8~10장) | 70 | x 60, y 590 · x 960 | 앞 | 4 |
| `ag_layer_tulips_mid` | 튤립 띠(빨강·노랑·분홍, 폭 ≈1000) | 80 | x 500, y 552 | 중간(맨 뒤 소품) | 9 |
| `ag_layer_snow_branch` | 눈 쌓인 마른 가지(Bark Brown + Moon Ice 눈 판) | 180 | x 60, y −24 · x 940(뒤집어) | 앞(위) | 5·6 |
| `ag_layer_sil_roots` | Silhouette Ink 뿌리·흙 테두리(위에서 내려오는 뿌리) | 220 | x 60, y −24 · x 940(뒤집어) | 앞(맨 앞) | 8 라이트박스 |

z 순서: `tulips_mid`·`sunflowers_mid` → 배우 → `grass_front`·`leafpile`·`snow_branch`·`sil_roots`(맨 앞). 세로 화면 x < 285 / > 715. 개미가 곡식을 나르는 길에는 앞 소품 없음.

## 6. 새로 그릴 그림 (12장, `jobs_ant_grasshopper.json` 끝)

| 구분 | id | 내용 | refs |
|---|---|---|---|
| 배경 | `ag_bg_summer_v2` | 여름 들판, 개미집 자리 그대로 | `ag_bg_summer` |
| 배경 | `ag_bg_autumn_v2` | 가을 들판, 같은 구도 | `ag_bg_autumn3`, `ag_bg_summer_v2` |
| 배경 | `ag_bg_spring_v2` | 봄 들판, 같은 구도 | `ag_bg_spring`, `ag_bg_summer_v2` |
| 배경 | `ag_bg_leafstage_v2` | 풀잎 무대, 잎 자리 그대로 | `ag_bg_leafstage` |
| 라이트박스 | `ag_lb_snow_dusk` | §4-1, 구멍 자리 그대로 | `ag_bg_winter_high` |
| 라이트박스 | `ag_lb_cellar_lamp` | §4-2, 곡식·도토리 방 자리 그대로 | `ag_bg_cellar` |
| 소품 | `ag_layer_grass_front` / `ag_layer_sunflowers_mid` / `ag_layer_leafpile_front` / `ag_layer_tulips_mid` / `ag_layer_snow_branch` | §5 | — |
| 실루엣 | `ag_layer_sil_roots` | §5 | — |

- 여름 v2 를 먼저 받아 가을·봄의 refs 로 넣는다(pass 2) — 개미집·언덕·나무 자리가 세 계절에서 같아야 "같은 들판"이 된다.
- 받은 뒤 점검: ① 세 계절의 개미집·언덕·나무 자리가 같은지(겹쳐 보기 ±2%) ② 개미 길(세로 72~100%)·무대 잎 둘레·통로가 비었는지 ③ 라이트박스 등불 동심원 3겹이 각각 단색인지, 눈밭 띠가 실루엣보다 밝은지 ④ 소품 얼굴 없음(해바라기 가운데에 눈 없음) ⑤ 광택·보라 그림자 없음.

## 7. 판단이 필요한 부분

1. **겨울 음악회를 라이트박스로**: 7장(창고 가득, 곡식 세기)과 8장이 같은 `cellar` 를 쓴다. 8장만 `ag_lb_cellar_lamp` 로 바꾸면 "세기 끝 → 등불 켜짐"으로 장면이 넘어가 자연스럽지만, 곡식·도토리 방 자리가 1~2% 어긋나면 세기 뒤 곡식 소품(`ag_store10`) 자리가 튄다. 추천: 쓰되 겹쳐 보고 어긋나면 7장 그림에 코드 `tint` + 등불 `glow` 만 입힌다.
2. **풀잎 무대 색 수**: 베짱이 연주 장면은 조작이 없어 화려해도 된다. 그러나 2장은 1장 바로 뒤라 12색까지만.

## 8. 확정 사항

- 인물·카드·곡식 소품·대사·녹음·조작 그대로. 똑똑(문)·창고 가득(세기) 배경 그대로.
- 작업표 12장은 `jobs_ant_grasshopper.json` 끝에 붙였고 기존 항목은 바꾸지 않았다.
