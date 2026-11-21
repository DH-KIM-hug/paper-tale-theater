# 인앱 구입 상품 (App Store Connect > 앱 > 수익화 > 인앱 구입)

작성일 2026-11-06, 2026-11-07 갱신(이름 설정 2판 반영: docs/NAME_SETUP_V2_PLAN.md, home.js `namesHTML` 주변). 가격은 '가격 등급(Price Point)'에서 **USD** 기준 점을 고르면 나머지 나라는 Apple이 환산합니다. 한국 원화 금액은 고른 뒤 화면에서 확인하세요(확인 필요).

## 0. 이름 기능 2판에서 상품 뜻이 달라진 점 (먼저 읽기)
| 항목 | 옛 문구(2026-11-06 초안) | 지금 앱이 실제로 하는 일 |
|---|---|---|
| 4.99 전체 구매에 들어 있는 것 | "우리 아이 이름 1회" | **창작 동화 4편 각각의 첫 설정**(이름 + 주인공 모습 여자아이/남자아이)이 동화마다 한 번씩 포함. 구름 공장은 아이 셋·강아지 이름과 모습 조합 |
| 0.99 소모성 상품 | "이름 바꾸기 1회 / One name change" (한 번 더 바꾼다) | **이용권 1장 = 첫 설정을 이미 쓴 뒤 4편을 모두 한 번에 다시 바꾸는 48시간 실행 1번**(동화별 1장이 아님). 이름뿐 아니라 모습도 바꿈 |
| 서버가 세는 것 | 사용 횟수 | `first[]`(첫 설정을 쓴 동화)와 `tickets`(남은 이용권 장수) |
→ "이름 바꾸기 1회"는 **오해를 부르는 이름**입니다(한 번 = 이름 한 번?, 동화 한 편?). 아래 표시 이름으로 바꾸고, 시험 파일 `ios/App/Products.storekit` 도 같이 맞추세요(§5).

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
| 한국어 | 모든 동화 열기 | 8 | 모든 동화와 동화마다 이름·모습 첫 설정 | 22 |
| English (U.S.) | Unlock all tales | 16 | All tales + first name setup for each tale | 42 |

표시 이름은 앱 안 단추 문구('모든 동화 열기 $4.99' / 'Unlock all $4.99')와 맞췄습니다. 초안의 '전체 동화 열기'는 앱 문구와 달라 바꿨습니다. 설명 문구는 심사 노트·스토어 설명과 같은 뜻입니다.

## 2. 이름 다시 바꾸기 이용권 (소모성)

| 칸 | 값 |
|---|---|
| 참조 이름 (내부용) | Change Names Again Pass |
| 제품 ID | `com.papertale.theater.rename` (코드: entitlements.js `RENAME_ID`, server/src/apple.js `RENAME_PRODUCT_ID`. 제품 ID 는 바꾸지 않음) |
| 종류 | 소모성 (Consumable) |
| 가격 | USD 0.99 (가격 점 0.99) |
| 구매 조건 | 앱이 **모든 동화 열기를 산 기기**에서만 쓸 수 있고, 서버도 영수증마다 unlockall 소유를 다시 확인합니다. 단추('다시 바꾸기 (이용권 $0.99)')는 이름 설정 목록에서 **첫 설정을 한 편이라도 쓴 뒤**, 또는 첫 설정을 마친 동화 화면에 나옵니다. 누르면 어른 확인 → 결제 → 곧바로 48시간 실행 시작 |
| 한 장으로 하는 일 | 창작 동화 4편(구름 공장·나의 빨간 자동차·유니콘을 찾아서·사탕 마녀의 핼러윈) 모두의 이름과 주인공 모습을 48시간 안에 다시 바꿈. 동화마다 1장이 아님 |
| **홍보용 구입(Promoted IAP)** | **끄기**(결정). App Store 상품 페이지에서 바로 살 수 없게 둠 |
| 가족 공유 | 소모성은 불가 |

| 언어 | 표시 이름 | 글자 수 | 설명 | 글자 수 |
|---|---|---|---|---|
| 한국어 | 이름 다시 바꾸기 이용권 | 13 | 창작 동화 4편의 이름·모습을 한 번에 다시 바꿔요 | 28 |
| English (U.S.) | Change Names Again Pass | 23 | Names & looks in all 4 original tales, again | 44 |

(앱 안 문구는 '다시 바꾸기 이용권'이라 표시 이름도 이 말을 포함합니다. 짧게 쓰고 싶으면 한국어 '다시 바꾸기 이용권'(10자)도 됩니다.)

## 3. 심사용 스크린샷 (상품마다 1장 필수, 640×920 이상)
Apple은 상품마다 '앱 안에서 이 상품을 사는 화면'을 보려고 합니다. 광고용이 아니라 심사 확인용이라 아이 캐릭터 스티커·창작 동화가 안 보이게만 하면 됩니다. (이름 설정 화면은 창작 동화 썸네일이 카드에 보입니다. 심사용 캡처에서는 문제 없지만 스토어 공개 스크린샷에는 쓰지 않습니다.)

- **unlockall**: 홈 오른쪽 위 톱니를 1초 꾹 → 보호자 화면 → 이용권 칸의 '모든 동화 열기' 단추가 보이는 화면. 이 폴더에 `screenshots/raw/*_10_iap_unlock.png` (아이패드·아이폰, 한국어)를 넣어 두었습니다(자동 캡처, 모의 구매 화면 아님. 실제 결제 시트는 TestFlight Sandbox 에서 직접 찍는 것이 가장 확실).
- **rename**: 구매 단추는 unlockall 소유 기기에서만 보입니다. 샌드박스에서 unlockall 을 산 뒤 보호자 화면 → '우리 아이 이름' → (어른 확인) → 동화 한 편 첫 설정을 끝낸 뒤 목록 아래 '다시 바꾸기 (이용권 $0.99)' 단추가 보이는 화면을 자동 캡처로 만들었습니다: `screenshots/raw/ipad_ko_11_iap_rename.png`·`screenshots/raw/phone_ko_11_iap_rename.png` (앱 코드는 그대로, 기기 기록 주입 + 서버 응답 흉내로 '모든 동화 열기 소유 + 네 편 첫 설정 끝남' 상태, 이름 칸은 일반 이름 '하늘' 등). 실제 결제 시트는 TestFlight Sandbox 에서 찍어도 됩니다.

## 4. 심사 메모 (상품 칸 'Review Notes' 에 붙임)
```
Unlock all tales is a one-time purchase. It is reached only through the parent area: hold the gear icon (top right of Home) for 1 second, open "Access", and tap the purchase button; a parental gate (a multiplication question, correct answer held for 1.5 seconds) appears first. Restore Purchases is next to it. No account or login is needed. The purchase also includes a first name-and-look setup for each of the four original tales.
Change Names Again Pass (consumable) lets a parent redo the name and hero look of all four original tales at once, within 48 hours, after the included first setups are used. It is sold only on a device that already owns Unlock All, from grown-up menu > Child's name (behind the parental gate). The server re-checks ownership of Unlock All from the receipt and accepts each transaction ID once. Unused passes are recorded on the server account because consumables cannot be restored.
```
한국어: 일회성 전체 해제입니다. 홈 오른쪽 위 톱니를 1초 꾹 눌러 보호자 화면의 '이용권'에서 구매하며, 먼저 부모 확인(곱셈 문제 정답을 1.5초 꾹)이 나옵니다. 구매 복원이 옆에 있고 계정·로그인은 없습니다. 이 구매에는 창작 동화 4편 각각의 이름·모습 첫 설정이 포함됩니다. 이름 다시 바꾸기 이용권은 첫 설정을 쓴 뒤 보호자 메뉴 '우리 아이 이름'(부모 확인 뒤)에서만 살 수 있고, 한 장으로 4편을 48시간 안에 모두 다시 바꿉니다. 서버가 영수증으로 소유를 다시 확인하고 거래 ID를 한 번만 받으며, 소모성은 복원이 안 되어 안 쓴 이용권은 서버 계정에 기록합니다.

## 5. Products.storekit 을 맞춰야 할 곳 (이번 작업에서는 수정하지 않음)
`ios/App/Products.storekit` 은 로컬 시험용 파일이라 App Store Connect 와 따로입니다. 표시 문구가 다르면 시험 화면과 실제 화면이 달라지므로 다음처럼 고치길 권합니다.
| 위치 | 지금 값 | 권장 값 |
|---|---|---|
| unlockall `localizations[ko].displayName` | 모든 동화 열기 | 그대로 |
| unlockall `localizations[ko].description` | 모든 동화를 한 번에 열어요 | 모든 동화와 동화마다 이름·모습 첫 설정 |
| unlockall `localizations[en_US].description` | Unlock every tale, once | All tales + first name setup for each tale |
| unlockall `familyShareable` | true | App Store Connect 에서 정한 값과 같게(§1 가족 공유) |
| rename `localizations[ko].displayName` | 이름 바꾸기 1회 | 이름 다시 바꾸기 이용권 |
| rename `localizations[ko].description` | 우리 아이 이름을 한 번 더 바꿔요 | 창작 동화 4편의 이름·모습을 한 번에 다시 바꿔요 |
| rename `localizations[en_US].displayName` | One name change | Change Names Again Pass |
| rename `localizations[en_US].description` | Change your child's name once more | Names & looks in all 4 original tales, again |
| `referenceName` | Unlock all / Rename | 그대로 써도 됨(내부용) |

## 6. 사용자가 직접 할 것
- Paid Applications Agreement·은행·세금 작성(없으면 상품이 '승인 대기'에서 안 풀립니다).
- 두 상품을 만들고 각 언어 표시 이름·설명, 가격, 스크린샷 넣기. 상품 상태가 '제출 준비 완료'가 되어야 앱 버전에 붙일 수 있습니다.
- 소모성 상품은 구매 복원이 안 되므로 '안 쓴 이용권'은 서버 계정에 기록된다는 점을 심사 노트에 적어 두었습니다(review_notes.md).
