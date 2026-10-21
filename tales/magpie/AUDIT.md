# 은혜 갚은 까치 점검표

## 방향 점검 (2026-10-21)

확인 방법: `tales/magpie/magpie.js`의 move·look·turn·put·hop 호출을 읽고, `assets/v3w/mg_*.webp`, `mg2_*.webp` 그림을 PNG로 바꿔 본 결과다(그림 파일 확인, 화면 촬영은 하지 않음).

| 장면 | 인물 | 이동 방향 | 그림 방향 | 판정 | 근거·고친 것 |
|---|---|---|---|---|---|
| 산길, 선비 걸어감 (210행) | 선비 | 오른쪽 (-120→520) | 기본 오른쪽 `mg_scholar_walk` (얼굴·발 오른쪽) | 정상 | 그림 파일 확인 |
| 큰 소나무, 뱀 기어오름 (231행) | 뱀 | 위·왼쪽 (790→735) | 정면 `snake_coil` | 정상 | 정면 |
| 엄마 자리 옮김 (255행) | 엄마 | 왼쪽 (650→600) | 기본 왼쪽 `mag_mom_sit` (`turn('left')`) | 정상 | 왼쪽을 보고 감 |
| 아빠 날아와 앉음 (257행) | 아빠 | 오른쪽 (540→690) | 기본 오른쪽 `mag_dad_fly` (부리 오른쪽) | 정상 | 그림 파일 확인 |
| 뱀 도망 (251행) | 뱀 | 오른쪽 (700→1150) | 기본 오른쪽 `mg_snake_flee` (머리 오른쪽) | 정상 | 그림 파일 확인 |
| 선비 걸어감 (316~321행) | 선비 | 오른쪽 (300→560→700) | 기본 오른쪽 | 정상 | 그림 파일 확인 |
| 까치 떼 날아감 (370~374행) | 아빠·엄마·친구 3마리 | 오른쪽 (-150→1150) | 기본 오른쪽 `fly` | 정상 | 날개 그림 기본 오른쪽, 오른쪽으로 감 |
| 종 치기, 아빠 날아감 (402행) | 아빠 | 오른쪽 (250→442) | 오른쪽 (`fly`, `to:'right'`) | 정상 | 종 쪽으로 감 |
| 종 치고 물러남 (405행) | 아빠 | 왼쪽 (442→330) | 오른쪽을 본 채 (뒤집기 없음) | 거꾸로 | 그림 파일 확인: 부리 오른쪽. 몸이 종을 향한 채 왼쪽으로 물러남(뒷걸음). 402·405행 사이에 방향 전환이 없음 |
| 종 치기, 엄마 날아감 (402행) | 엄마 | 왼쪽 (750→558) | 왼쪽 (`turn('left')`로 뒤집음) | 정상 | 뒤집은 상태로 종 쪽으로 감 |
| 종 치고 물러남 (405행) | 엄마 | 오른쪽 (558→670) | 왼쪽을 본 채 (뒤집기 유지) | 거꾸로 | 같은 원인. 물러날 때 방향이 반대 |
| 지쳐 내려앉음 (414행) | 아빠·엄마 | 아래 (수직) | 지친 자세 | 정상 | 이동 방향 없음 |
| 새벽, 뱀 도망 (443행) | 뱀 | 오른쪽 (→1150) | 기본 오른쪽 `flee` | 정상 | `turn('right')` 후 오른쪽 |
| 아침, 선비 걸어감 (w9, 455행) | 선비 | 오른쪽 (-120→1150) | 기본 오른쪽 | 정상 | 그림 파일 확인 |
| 아침, 선비 다가옴 (w9b, 462행) | 선비 | 왼쪽 (1100→720) | 기본 오른쪽, `walk` `to:'left'`로 뒤집음 | 정상 | 뒤집은 상태로 왼쪽을 봄 |
| 신부(여인) 몸 흔듦 (431행) | 여인 | 오른쪽 (+14) | 정면 `lady` | 정상 | 정면, 14px 미세 이동 |

- 거꾸로 두 건은 종 치기 장면(402~405행) 물러나기다. 몸을 종 쪽에 둔 채 뒤로 빠진다.
- 수정 제안: 405행 `back` 이동 직전에 물러나는 쪽을 보게 한다. 예: `strike` 안, `const back = ...` 줄 앞에 `mv.forEach(([b, , bk]) => b.turn(bk < b.x ? 'left' : 'right'));` 를 넣는다. 물러날 때 한 번 몸을 돌리는 연출이 생긴다. 다른 방법으로 종 칠 때 뒤로 날아가는 대신 제자리에서 몸을 돌려 다시 날아가게 하는 것도 가능(사용자 판단).
- 정지 자세(앉기, 지친 자세)는 방향 이동이 없어 정상으로 본다.
- 인물로 뱀과 까치 부모·친구를 넣었다. 화살과 종은 소품이라 뺐다.

재점검 불필요: 아니오 (종 치기 장면 아빠·엄마의 물러남 2건이 거꾸로 판정이라 수정 후 재확인 필요)

## 방향 화면 재확인 (2026-10-21)

자동 재생(1초 간격, 전용 Chrome 9471)으로 종 치는 장면을 찍었다. 물러나는 순간은 사진 한 장(흐림)만 잡혔다.

| 장면 | 인물 | 화면 판정 | 근거 (사진 파일) |
|---|---|---|---|
| 종 치고 물러남 (405행) | 아빠 | 확인 불가 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/v2_magpie/s_254.jpg`: 두 마리가 흐리게 움직이는 한 장뿐. 부리 방향을 확정하기 어렵다 |
| 종 치고 물러남 (405행) | 엄마 | 확인 불가 | 같은 사진 `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/v2_magpie/s_254.jpg`. 이후 `s_255`~`s_264`에서는 두 마리가 종 아래 바닥에 내려앉은 상태 |

- 결론: 종 치고 물러나는 순간이 1초 간격 사진으로 충분히 잡히지 않아 화면 판정은 보류. 기존 코드·그림 판정(거꾸로 2건)은 화면으로 확정되지 않았다.
- 재점검 필요: 종 치는 순간을 0.2초 간격 등으로 다시 촬영한다.

## 효과음 글자 (2026-10-21)

가로(1366x1024) 자동 재생으로 장면마다 효과음 글자(pop)가 뜰 때 사진을 찍어, 말풍선이 인물·얼굴·손·중요한 소품을 가리는지 확인했다. 사진은 스크래치패드에만 두었다.

| 장면 | 글자 | 가림 여부 | 수정 여부 | 비고 |
|---|---|---|---|---|
| 1-2 저벅저벅 (숲 길) | 저벅저벅 | 아니오 | 아니오 | 화면 왼쪽 가장자리에 잘림(가림 아님) |
| 3 활 쏘기 | 쉬익! 탁! | 아니오 | 아니오 |  |
| 6 장면 가장자리 | 짹! | 아니오 | 아니오 |  |
| 10-12 아가씨 쿨쿨 | 쿨쿨 / ! | 예 (!) | 예 (! 재확인 보류) | ! 말풍선이 아가씨 치마·소매 가림 → 오른쪽 (x+120) |
| 13 후후 (아가씨) | 후후… | 예 | 예 (재확인 됨) | 아가씨 머리 위 → 위로 올림 (FL -330) |
| 14 짹짹 | 짹짹! | 아니오 | 아니오 |  |

- 결과: 수정 여부 "예 (재확인 됨)"은 고친 뒤 같은 장면을 다시 찍어 가려지지 않는 것을 확인한 것. "재확인 보류"는 고쳤지만 다시 찍은 사진에서 그 장면이 나오지 않았거나 촬영이 중간에 멈춘 것이다.
- 가림 "가장자리"는 말풍선이 인물이나 소품의 가장자리에만 걸친 것으로, 가림으로 세지 않았다. 컷신 카드에 글자가 덮여 보이지 않는 것은 장면 구조라 손대지 않았다.


## 전체 점검 (2026-10-21)

확인 방법: 가로 1366x1024 자동 재생(`assets/raw/_work/autoplay.mjs`, 전용 Chrome 9641)을 두 번 돌렸다. 한국어 run은 `?n=5`(아기 까치 5마리, 가장 어려운 경우)로 끝 화면까지 217장(3초 간격)을 찍었고, 영어 run은 `?n=3`, localStorage lang=en으로 찍었다. 영어 run은 중간에 같은 Chrome 탭을 다른 작업(kkultteok)이 바꿔 버려 장면 6까지만 사진으로 확인했다. 장면 7~9 영어 화면과 끝 화면 영어는 코드(TEXT_EN·NARRATION_CLIPS_EN, 엔진 ENGINE_EN)로만 확인했다. 사진 경로는 모두 `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/`.

### 가장 먼저 고칠 3곳

1. **종 치고 물러날 때 부모가 종을 본 채 뒷걸음** (장면 7, 405행). 화면에서 확인됨: `ko5_82.jpg`에서 물러난 아빠가 여전히 부리를 종 쪽(오른쪽)으로 두었다. 물러나기 직전에 몸을 돌리는 한 줄을 넣는다(위 "방향 점검" 제안과 같음).
2. **선비가 잠드는 장면인데 서 있음** (장면 4 대문 앞, 대사 "선비는 따뜻한 방에서 금세 잠이 들었어요"). `ko5_44.jpg`에서 선비는 서서 팔을 든 채 "쿨쿨" 말풍선만 떠 있다. 앉기(`sch.look('sit')`) 또는 누운 자세로 바꾼다.
3. **구렁이가 옆으로 누운 자세로 나무를 오름** (장면 2, 231~237행). 똬리를 푼 채 올라가는 것은 맞지만, 쓰는 그림(`mg_snake_flee`)이 가로로 길어서 나무를 기어 오르는 모습이 아니라 옆으로 미끄러지는 것처럼 보인다(`ko5_07.jpg`, `ko5_09.jpg`). 세로로 감아 오르는 그림이나 기울인 그림으로 바꾼다.

### 장면별 표

| 장면 | 항목 | 판정 | 근거 사진 | 고치는 제안 |
|---|---|---|---|---|
| 1 산길 | 대사·글자(한국어) | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_02.jpg` | 없음 |
| 1 산길 | 대사·글자(영어) | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/en3_03.jpg` | 없음 |
| 1 산길 | 첫 톡(활)까지 시간 | 어색 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_12.jpg` | 활 톡 캡션이 시작 후 약 36~40초에 뜸. 30초 기준 초과. 1장 걷기(7초)를 줄이거나 L1 뒤 대사 간격을 줄임 |
| 1 산길 | 크기·방향 | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_02.jpg` | 없음 |
| 1 산길 | 효과음 "저벅저벅" | 확인 보류 | (사진 없음) | 자동 재생 사진에 잡히지 않음. 앞선 기록에서 가림 없음 |
| 2 큰 소나무 | 대사 (L2~L5) | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_06.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_07.jpg` | 없음 |
| 2 큰 소나무 | 톡1(활) 힌트 | 정상(코드) | tale.js tap(): 5초 손가락, 12초 재안내 | 자동 재생이라 손가락은 사진에 안 잡힘 |
| 2 큰 소나무 | 구렁이 오르는 몸 모양 | 어색 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_07.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_09.jpg` | 옆으로 누운 가로 그림으로 올라감. 세로 그림이나 기울인 그림으로 교체 |
| 2 큰 소나무 | 구렁이 크기(오르기 전후) | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_06.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_12.jpg` | 같은 폭 약 165px(화면) 유지 |
| 2 큰 소나무 | 선비·부모 방향 | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_10.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_12.jpg` | 선비는 오른쪽으로 조준, 부모는 가지에서 구렁이 쪽 |
| 2 큰 소나무 | 컷 arrow | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_14.jpg` | 화살이 구렁이 옆 나무에 꽂힘 |
| 2 큰 소나무 | 컷 flee | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_16.jpg` | 없음 |
| 2 큰 소나무 | 복귀 | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_19.jpg` | 놀란 선비 뒤 부모가 날아와 앉음 |
| 3 둥지 | 숫자 고르기 흐름(정답) | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_22.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_24.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_29.jpg` | 정답 5 글로우, 정답 뒤 "맞아요! 다섯 마리예요" |
| 3 둥지 | 오답 흐름 | 확인 보류 | (코드) choose() | 흔들림→"그건 N이에요"→자동 세기→재선택, 두 번 틀리면 정답 글로우. 자동 재생이 오답을 고르지 않아 미관측 |
| 3 둥지 | 5초 손가락 힌트 | 판단 | (코드) choose() | 고르기는 손가락 힌트 없이 12초 재안내만 함. CLAUDE §2 기본(5초 손가락)과 다름. 의도 확인 필요 |
| 3 둥지 | 효과음 글자 가림 | 어색 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_24.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_26.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_28.jpg` | "하나!"가 1번 새끼 머리, "다섯!"이 5번 새끼를 가림. 말풍선을 새끼 머리 위로 40px 더 올리거나 가운데 위에 한 번만 띄움 |
| 3 둥지 | 정답 카드 "반짝!" | 어색(경미) | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_24.jpg` | 카드 윗변을 가림. 말풍선 y를 cardY-90에서 -130으로 |
| 3 둥지 | 새끼 크기 | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_28.jpg` | 한 마리 88 일정 |
| 3 둥지 | 대사 "짹짹! 선비님, 고맙습니다!" | 판단 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_30.jpg` | 둥지 장면에 선비가 없음. 대사 대상이 보이지 않음. 그림 또는 대사 조정 |
| 4 깊은 밤 | 선비 걸음·등불 | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_36.jpg` | 없음 |
| 4 대문 앞 | 대사 "잠이 들었어요" (L18) | 어색 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_44.jpg` | 선비가 서 있음. 잠든 자세(앉기·눕기)로 바꾸거나 대사를 앞 장면에 맞춤 |
| 4 대문 앞 | 영어 대사 | 정상(코드) | (코드) TEXT_EN, NARRATION_CLIPS_EN | 한글 없음 |
| 5 외딴집 | 효과음 "!" | 어색(경미) | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_49.jpg` | 말풍선이 여인 치마 오른쪽 가장자리를 가림. y를 FL-40에서 FL-100으로 올림 |
| 5 외딴집 | 여인 "굳은 얼굴" | 판단 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_48.jpg` | 눈을 감은 얼굴이라 굳은 표정이 약함. 눈을 뜬 얼굴 확인 |
| 5 외딴집 | 꼬리 등장 | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_56.jpg` | 치마 밑 꼬리 보임 |
| 5 외딴집 | 대사 (L21~L26) | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_52.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_56.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/en3_60.jpg` | 영어 "I am the wife of the snake you chased away..." 정상 |
| 6 달밤 | 부모·새끼 방향 | 판단 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/en3_80.jpg` | 부모는 오른쪽(새끼 쪽)을 보고, 새끼 세 마리도 오른쪽을 봄. 부모 쪽을 보게 할지 결정 |
| 6 달밤 | 날아가는 무리 위쪽 잘림 | 어색(경미) | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_70.jpg` | 맨 앞 까치 날개가 화면 위 끝에서 잘림. 날아가는 y를 150에서 190으로 |
| 6 달밤 | 친구 까치 크기 | 어색(경미) | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_70.jpg` | 친구 까치가 0.85~0.9배. 같은 무리는 한 크기 유지(CLAUDE 4-1). 멀리 보이게 한 것이 아니면 1.0으로 |
| 6 달밤 | 컷 flock | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_72.jpg` | "달빛을 가르며, 산 위 절을 향해" 장면과 맞음 |
| 7 종탑 | 종 치기 방향(접근) | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_76.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_79.jpg` | 두 까치 모두 종을 향해 날아감 |
| 7 종탑 | 종 치고 물러남 방향 | 어색(거꾸로 확인) | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_82.jpg` | 물러난 뒤에도 부리가 종 쪽을 봄. 물러나기 직전에 turn() 한 줄 추가 |
| 7 종탑 | 효과음 "댕—" | 어색(경미) | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_79.jpg` | 말풍선이 종걸이와 날개 위를 덮음. y를 165에서 120으로 |
| 7 종탑 | 컷 ring | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_86.jpg` | 오른쪽 까치 날개 끝이 컷 밖으로 잘림(경미) |
| 7 종탑 | 쓰러짐 | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_90.jpg` | 없음 |
| 8 새벽 | 대사 "약속은 약속" | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_97.jpg` | 없음 |
| 8 새벽 | 구렁이 변신·도망 | 확인 보류 | (사진 없음) | 자동 재생 사진에 안 잡힘. 코드상 fadeOut, coil, flee 순서 |
| 8 새벽 | 효과음 "댕—" | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_93.jpg` | 말풍선이 인물 밖에 뜸 |
| 9 아침 | 종탑 아침 배경 아래 띠 | 어색 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_109.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_119.jpg` | 배경 아래쪽 약 20px에 밝은 빈 띠가 보임. BG_PLACE(mg_bg_belltower)의 dy를 조정하거나 배경을 키움 |
| 9 아침 | 새끼가 엄마 머리를 가림 | 어색 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_113.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_116.jpg` | 다섯 마리 새끼가 엄마 머리 앞에 겹침. 새끼를 엄마 왼쪽 아래로 옮기거나 간격을 줄임 |
| 9 아침 | 컷 wake | 어색 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_115.jpg` | 어른 까치 떼가 날아가는 그림인데 대사는 새끼의 "엄마! 아빠!". 새끼가 부모에게 뛰어가는 그림으로 바꾸거나 대사를 조정 |
| 9 아침 | 부모 깨어남 | 판단 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_116.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_120.jpg` | 부모가 끝까지 누운 채 대사를 함. 일어나는 자세로 바꿀지 결정 |
| 9 아침 | 톡3(선비 인사) | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_116.jpg` | "선비를 톡 눌러 봐요" 캡션 정상 |
| 끝 | 뒷면 그림 404 | 정상(대체) | 로그: `/assets/thumbs/magpie_back_wide.webp` 404 1회 | 404 뒤 magpie_key_wide로 대체되어 표지는 보임. 뒷면 파일은 jobs_magpie.json의 key5_backw/backt 항목(파일명은 magpie_back_wide, magpie_back_tall)이며 아직 없음 |
| 끝 | 끝 글자 | 정상 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_122.jpg` | "끝!"(영어는 엔진 ENGINE_EN에서 "The End!") |
| 끝 | "끝내기" 버튼 | 판단 | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_121.jpg` | finale 후 1.5초 동안 "끝내기" 알약이 보였다가 끝 화면으로 넘어감. 다른 동화와 같은 엔진 동작 |
| 전체 | 영어 음성 | 정상 | (코드) 67줄 전부 EN 클립, 고유 파일 152개 모두 존재 | 한국어 음성으로 넘어가는 경로 없음 |
| 전체 | 영어 글자 | 정상(장면 1~6 사진, 7~9 코드) | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/en3_03.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/en3_12.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/en3_60.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/en3_80.jpg` | 영어 글자에 한글 없음(TEXT_EN 전부, 팝 글자 포함) |
| 전체 | 분량 | 어색(짧음) | `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_121.jpg`, `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad/magpie_chk/ko5_122.jpg` | 자동 재생으로 끝 화면까지 약 6분 10초(3초 간격 217장 중 122장째). 사람이 누르면 6분 30초~7분 예상. 목표 7~10분의 아래쪽. 장면 사이 쉼(SCENE_END 2초)을 늘리거나 장면 한 곳을 더할지 결정 |

재점검 필요: 예 (장면 7 물러남 방향, 장면 4 잠 자세, 장면 2 오르는 그림을 고친 뒤 같은 장면을 다시 찍는다. 영어 run은 장면 7~9와 끝 화면을 다시 찍는다).
