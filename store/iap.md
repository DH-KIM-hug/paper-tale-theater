# 인앱 구입 상품 (App Store Connect > 앱 > 수익화 > 인앱 구입)

작성일 2026-11-06, 2026-11-07 갱신(이름 설정 2판 반영: docs/NAME_SETUP_V2_PLAN.md, home.js `namesHTML` 주변). 가격은 '가격 등급(Price Point)'에서 **USD** 기준 점을 고르면 나머지 나라는 Apple이 환산합니다. 한국 원화 금액은 고른 뒤 화면에서 확인하세요(확인 필요).

## 0. 이름 기능 2판에서 상품 뜻이 달라진 점 (먼저 읽기)
| 항목 | 옛 문구(2026-11-06 초안) | 지금 앱이 실제로 하는 일 |
|---|---|---|
| 4.99 전체 구매에 들어 있는 것 | "우리 아이 이름 1회" | **아이 이름 변경권 1장**(2026-11-24 최종 결정). 변경권과 작동이 똑같다: 1장 = 4편의 이름과 주인공 모습(여자아이/남자아이)을 한 번에 정하거나 바꾸는 48시간 실행 1번. 구름 공장은 아이 셋과 강아지 이름, 모습 조합. 동화마다 첫 설정 무료는 없앴다 |
| 1.99 소모성 상품(2026-11-22 0.99→1.99) | "이름 바꾸기 1회 / One name change" (한 번 더 바꾼다) | **아이 이름 변경권 1장 = 4편을 모두 한 번에 정하거나 다시 바꾸는 48시간 실행 1번**(동화별 1장이 아님). 이름뿐 아니라 모습도 바꿈. 2026-11-22 A안: 모든 동화 열기를 사지 않은 사람도 산다 |
| 서버가 세는 것 | 사용 횟수 | `tickets`(남은 변경권 장수), `eligible`(변경권을 사거나 받은 적 있음), `covered`(실행 대상이던 동화 id). 옛 `first[]` 는 읽기만 하고 새로 늘리지 않는다 |
→ "이름 바꾸기 1회"는 **오해를 부르는 이름**입니다(한 번 = 이름 한 번?, 동화 한 편?). 아래 표시 이름으로 바꾸고, 시험 파일 `ios/App/Products.storekit` 도 같이 맞추세요(§5).

## 0-1. 2026-11-24 사용자 결정 (가격 표시, 실패 문구, 두 상품 따로)
- 가격은 StoreKit `displayPrice` 그대로 보인다(한국: 모든 동화 열기 5,500원, 아이 이름 변경권 2,200원). 앱 안 달러 기본값($4.99, $1.99)은 없앴다. 가격을 못 받으면 단추는 이름만, 설명에 '가격 불러오는 중' / 'Loading price…'. 구매를 누르면 상품을 다시 불러 보고, 그래도 없으면 '지금은 스토어에서 상품을 불러오지 못했습니다.' 문구.
- 구매 실패는 이유별 문구(no-product, cancelled, pending, 그 밖은 '구매 복원'을 눌러 달라는 문구). 이름 변경권도 같다.
- 보호자 메뉴 > 이용권, 잠긴 동화의 '동화 열기, 구매' 칸 두 곳에서 '모든 동화 열기'와 '아이 이름 변경권'을 모두 산다(변경권 단추는 이름 서버가 켜졌을 때만).
- **최종(2026-11-24): '모든 동화 열기'에 든 이름 혜택은 아이 이름 변경권과 작동 원리가 똑같다.** 구매하면 서버가 그 계정에 변경권 1장을 넣는다(server/src/app.js `applyReceipt`, KV `bonus:<원 거래 해시>` 표시). 같은 원 거래(original transaction id)로는 한 번만: 복원, 재확인, 같은 애플 계정의 다른 기기, 연결 코드 합치기, 계정 삭제 뒤 새 계정에서도 다시 주지 않는다. 동화마다 첫 설정 무료(`first[]`)는 없앴다. 구매자든 아니든 이름 설정은 모두 변경권 1장으로 네 편을 한 번에 정하는 같은 흐름이다. 화면 문구 '모든 동화와 앞으로 나올 동화가 열립니다. 아이 이름 변경권 1장 포함.' / 'Unlocks every tale, new ones too. Includes 1 Child Name Change Pass.' (같은 날 앞서 '첫 설정 포함'으로 되돌렸던 결정을 이것으로 바꿈.) App Store Connect 상품 설명 '아이이름 변경권 1회 포함'은 이 규칙과 맞으므로 그대로 둔다.
- 받기(2026-11-24, 푸시 알림 없음): 앱으로 돌아오거나 '우리 아이 이름'에 들어오면 살아 있는 48시간 실행의 남은 줄을 저절로 이어 받는다. 받는 동안 '다 받을 때까지 이 화면을 켜 두세요. 약 n분 걸립니다.' 안내와 화면 켜 두기(Wake Lock, 없으면 넘어감), 다 받으면 앱 안 토스트 '녹음이 다 됐습니다. 동화에서 들어 보세요.'와 효과음.
- 이용권 화면에서 두 상품은 줄과 설명을 따로 둔다. 하단의 '어른 확인을 한 번 더 합니다' 안내 문구는 뺐다.

## 1. 모든 동화 열기 (비소모성)

| 칸 | 값 |
|---|---|
| 참조 이름 (내부용) | Unlock All Tales |
| 제품 ID | `com.papertale.theater.unlockall` (코드: entitlements.js `PRODUCT_ID`, StorePlugin.swift, ios/App/Products.storekit) |
| 종류 | 비소모성 (Non-Consumable) |
| 가격 | USD 4.99 (가격 점 4.99) |
| 가족 공유 | **켜기 (2026-11-22 사용자 결정, App Store Connect 에서 켬 — 되돌릴 수 없음).** 11-13 '끄기' 결정을 바꿈. 가족 구성원은 각자 다른 원 거래 번호를 받아 서버의 영수증당 계정 5개 제한에 걸리지 않음(Apple 포럼 답변 기준, 샌드박스 가족 그룹으로 확인 권장). `Products.storekit` 도 `familyShareable: true` |
| 판매 가능 국가 | 앱과 같게 (사용자가 정함) |
| **홍보용 구입(Promoted IAP)** | 켜면 App Store 페이지에서 바로 살 수 있습니다. 켤지는 사용자 결정(기본값: 끔). Kids 앱이라 끔을 추천 |

표시 이름·설명 (언어별로 입력, 이름 30자·설명 45자 이내)

| 언어 | 표시 이름 | 글자 수 | 설명 | 글자 수 |
|---|---|---|---|---|
| 한국어 | 모든 동화 열기(아이이름 변경권 1회 포함) | 24 | 앱의 모든 동화(향후 추가되는 동화 포함)를 볼 수 있고 창작동화 아이이름 변경권 1회 제공됩니다 | 54 |
| English (U.S.) | All tales + 1 name change | 25 | All tales (incl. future ones) + one child-name change | 53 |

설명의 '아이이름 변경권 1회'는 2026-11-24 최종 규칙(구매 = 변경권 1장, 원 거래마다 한 번)과 같다.
표시 이름은 앱 안 단추 문구('모든 동화 열기 $4.99' / 'Unlock all $4.99')와 맞췄습니다. 초안의 '전체 동화 열기'는 앱 문구와 달라 바꿨습니다. 설명 문구는 심사 노트·스토어 설명과 같은 뜻입니다.

## 2. 아이 이름 변경권 (소모성)

2026-11-22 사용자 결정: 표시 이름을 '이름 다시 바꾸기 이용권 / Change Names Again Pass'에서 **'아이 이름 변경권 / Child Name Change Pass'** 로, 가격을 0.99에서 **1.99달러**로 바꿈(제품 ID 그대로). 이유: 한·영 4편 전체 생성 원가가 약 1.00달러(실측)로 0.99의 순수익(약 0.84)보다 큼.

| 칸 | 값 |
|---|---|
| 참조 이름 (내부용) | Child Name Change Pass |
| 제품 ID | `com.papertale.theater.rename` (코드: entitlements.js `RENAME_ID`, server/src/apple.js `RENAME_PRODUCT_ID`. 제품 ID 는 바꾸지 않음) |
| 종류 | 소모성 (Consumable) |
| 가격 | USD 1.99 (가격 점 1.99) |
| 구매 조건 | **누구나** 삽니다(2026-11-22 A안, 모든 동화 열기 소유 불필요). 서버는 거래 ID 를 한 번만 받고, 변경권은 전체 구매(owned)를 열지 않습니다. 단추(2026-11-24 하나의 흐름, 구매 여부와 상관없음): 이름을 넣은 동화가 아직 없으면 '이름 정하기', 있으면 '다시 바꾸기'. 남은 변경권이 있으면 '(변경권 1장 씀)', 없으면 '(변경권 가격)'. 0장이면 어른 확인 → 결제 → 곧바로 48시간 실행 시작. 모든 동화 열기를 산 사람은 구매에 든 1장이 남아 있어 처음에는 '이름 정하기 (변경권 1장 씀)'이 보인다. 동화마다 무료 첫 설정은 없다 |
| 한 장으로 하는 일 | 창작 동화 4편(구름 공장·나의 빨간 자동차·유니콘을 찾아서·사탕 마녀의 핼러윈) 모두의 이름과 주인공 모습을 48시간 안에 정하거나 다시 바꿈. 동화마다 1장이 아님 |
| **홍보용 구입(Promoted IAP)** | **끄기**(결정). App Store 상품 페이지에서 바로 살 수 없게 둠 |
| 가족 공유 | 소모성은 불가 |

| 언어 | 표시 이름 | 글자 수 | 설명 | 글자 수 |
|---|---|---|---|---|
| 한국어 | 아이 이름 변경권 | 9 | 창작 동화 4편의 아이 이름·모습을 한 번에 정하거나 바꿔요 | 33 |
| English (U.S.) | Child Name Change Pass | 22 | Set or change names & looks in all 4 original tales | 51 |

(앱 안 단추는 짧게 '변경권', 안내 글은 '아이 이름 변경권' / 'Child Name Change Pass'. 글자 수는 2026-11-22 스크립트로 셈.)

## 3. 심사용 스크린샷 (상품마다 1장 필수, 640×920 이상)
Apple은 상품마다 '앱 안에서 이 상품을 사는 화면'을 보려고 합니다. 광고용이 아니라 심사 확인용이라 아이 캐릭터 스티커·창작 동화가 안 보이게만 하면 됩니다. (이름 설정 화면은 창작 동화 썸네일이 카드에 보입니다. 심사용 캡처에서는 문제 없지만 스토어 공개 스크린샷에는 쓰지 않습니다.)

- **unlockall**: 홈 오른쪽 위 톱니를 1초 꾹 → 보호자 화면 → 이용권 칸의 '모든 동화 열기' 단추가 보이는 화면. 이 폴더에 `screenshots/raw/*_10_iap_unlock.png` (아이패드·아이폰, 한국어)를 넣어 두었습니다(자동 캡처, 모의 구매 화면 아님. 실제 결제 시트는 TestFlight Sandbox 에서 직접 찍는 것이 가장 확실).
- **rename**: 2026-11-22 A안부터 구매 단추는 모든 동화 열기를 **안 산** 기기에도 보입니다. 보호자 화면 → '우리 아이 이름' → (어른 확인) → 목록 아래 '이름 정하기 (변경권 $1.99)' 단추가 보이는 화면을 자동 캡처로 다시 만들었습니다(2026-11-22 새 이름·가격으로 다시 찍음): `screenshots/raw/ipad_ko_11_iap_rename.png`·`screenshots/raw/phone_ko_11_iap_rename.png` (앱 코드는 그대로, 기기 기록 주입 + 서버 응답 흉내로 '모든 동화 열기 미소유 + 전에 이용권으로 네 편을 정해 둠' 상태 — 아이 이름이 안 보이게 이름 칸은 일반 이름 '하늘' 등). 실제 결제 시트는 TestFlight Sandbox 에서 찍어도 됩니다.

## 4. 심사 메모 (상품 칸 'Review Notes' 에 붙임)
```
Unlock all tales is a one-time purchase. It is reached only through the parent area: hold the gear icon (top right of Home) for 1 second, open "Access", and tap the purchase button; a parental gate (a multiplication question, correct answer held for 1.5 seconds) appears first. Restore Purchases is next to it. No account or login is needed. The purchase also includes one Child Name Change Pass (granted once per original transaction by our server).
Child Name Change Pass (consumable, $1.99) lets a parent set or redo the name and hero look of all four original tales at once, within 48 hours. Anyone can buy it, with or without Unlock All, from grown-up menu > Child's name (behind the parental gate). The server accepts each transaction ID once. Unused passes are recorded on the server account because consumables cannot be restored.
```
한국어: 일회성 전체 해제입니다. 홈 오른쪽 위 톱니를 1초 꾹 눌러 보호자 화면의 '이용권'에서 구매하며, 먼저 부모 확인(곱셈 문제 정답을 1.5초 꾹)이 나옵니다. 구매 복원이 옆에 있고 계정·로그인은 없습니다. 이 구매에는 아이 이름 변경권 1장이 들어 있습니다(서버가 원 거래마다 한 번 넣음). 아이 이름 변경권(1.99달러)은 모든 동화 열기를 사지 않아도 누구나 보호자 메뉴 '우리 아이 이름'(부모 확인 뒤)에서 살 수 있고, 한 장으로 4편을 48시간 안에 모두 정하거나 다시 바꿉니다. 서버는 거래 ID를 한 번만 받으며, 소모성은 복원이 안 되어 안 쓴 변경권은 서버 계정에 기록합니다.

## 5. Products.storekit 을 맞춰야 할 곳 (rename 은 2026-11-22 아래 값으로 고침: displayPrice 1.99)
`ios/App/Products.storekit` 은 로컬 시험용 파일이라 App Store Connect 와 따로입니다. 표시 문구가 다르면 시험 화면과 실제 화면이 달라지므로 다음처럼 고치길 권합니다.
| 위치 | 지금 값 | 권장 값 |
|---|---|---|
| unlockall `localizations[ko].displayName` | 모든 동화 열기 | 그대로 |
| unlockall `localizations[ko].description` | 모든 동화를 한 번에 열어요 | 앱의 모든 동화(향후 추가되는 동화 포함)를 볼 수 있고 창작동화 아이이름 변경권 1회 제공됩니다 |
| unlockall `localizations[en_US].description` | Unlock every tale, once | All tales (incl. future ones) + one child-name change |
| unlockall `familyShareable` | true | App Store Connect 에서 정한 값과 같게(§1 가족 공유) |
| rename `localizations[ko].displayName` | 이름 바꾸기 1회 | 아이 이름 변경권 |
| rename `localizations[ko].description` | 우리 아이 이름을 한 번 더 바꿔요 | 창작 동화 4편의 아이 이름·모습을 한 번에 정하거나 바꿔요 |
| rename `localizations[en_US].displayName` | One name change | Child Name Change Pass |
| rename `localizations[en_US].description` | Change your child's name once more | Set or change names & looks in all 4 original tales |
| `referenceName` | Unlock all / Rename | Unlock all / Child Name Change Pass(내부용) |

## 6. 사용자가 직접 할 것
- Paid Applications Agreement·은행·세금 작성(없으면 상품이 '승인 대기'에서 안 풀립니다).
- 두 상품을 만들고 각 언어 표시 이름·설명, 가격, 스크린샷 넣기. 상품 상태가 '제출 준비 완료'가 되어야 앱 버전에 붙일 수 있습니다.
- 소모성 상품은 구매 복원이 안 되므로 '안 쓴 이용권'은 서버 계정에 기록된다는 점을 심사 노트에 적어 두었습니다(review_notes.md).

## 새 창작 동화가 추가될 때 (2026-11-24 사용자 결정, 2026-11-22 안을 바꿈)
- 자격: '모든 동화 열기'를 산 사람, 그리고 아이 이름 변경권을 한 번이라도 산(또는 구매에 든 1장을 받은) 사람. 서버 계정 기록 `name.eligible`(변경권을 사거나 받으면 참, 옛 기록은 남은 장수나 거래 해시로 판별)과 구매 `owned` 로 본다.
- 혜택: **새로 추가된 창작 동화에만** 이름과 모습을 넣는 무료 설정 1번. 출시 네 편(구름 공장, 나의 빨간 자동차, 유니콘을 찾아서, 사탕 마녀의 핼러윈)을 다시 바꾸려면 변경권이 필요하다.
- 서버: 출시 네 편은 `LAUNCH_TALES`(server/src/name.js). name_lines.js 에 이 목록 밖의 동화가 들어오면 '새 동화'다. 자격이 있고 `name.covered`(실행을 만들 때 대상이던 동화 id)에 그 동화가 없으면 `POST /v1/name/run { tale: 새 동화 }` 가 그 동화 하나만 대상인 실행(kind `new`, 48시간)을 변경권 없이 만든다. 한 번 만들면 covered 에 들어가 다시는 무료가 아니다. 변경권 실행은 그때의 모든 동화를 covered 에 넣으므로, 새 동화가 나온 뒤 변경권을 쓰면 그 동화도 덮인 것으로 친다. 연결 코드로 합치면 eligible 은 OR, covered 는 합집합. `GET /v1/name/quota` 의 `newFree` 에 받을 수 있는 새 동화 목록이 나온다(지금은 빈 목록). 시험: server/test/name_newtale.test.js(가짜 다섯 번째 동화).
- 앱: 새 동화가 Names.TALES 에 들어오면 그 동화 화면이 편집 상태가 되고 '새 동화 이름 넣기 (무료)' 표시가 나온다(home.js `nmNewFree`, `nmNewFreeTag`). '이렇게 완성'은 지금 흐름 그대로 서버에 `{ tale }` 을 보낸다.
- 서버에 남는 것은 동화 id 와 참거짓뿐이고 이름은 여전히 저장하지 않는다(개인정보 처리방침의 '녹음한 동화 표시'와 같은 범위라 문구는 그대로).
- 계정 없이 재설치한 경우(기기 연결 안 함)는 서버가 알 수 없으므로 의견 메일로 개별 처리.

## 이름 녹음 방식·재사용 (2026-11-22 사용자 결정·검토)
- 녹음은 **문장 전체를 다시 녹음**하는 지금 방식 유지. 이름 조각만 갈아끼우기(시험: 이름 조각 a는 대부분 실패, 이름 앞뒤 구 b는 간간이 성공)와 대본에서 이름 줄 줄이기는 하지 않는다.
- 동명이인 녹음 재사용(줄+이름+모습+언어 단위 보관, 이름은 해시, 계정과 연결 안 함, Cloudflare R2): **출시 뒤 업데이트 후보.** 하려면 처리방침·개인정보 라벨·심사 노트의 '서버는 이름을 저장하지 않음' 문구와 보호자 동의 문구를 함께 바꿔야 한다. 1.0은 저장 안 함 그대로.
