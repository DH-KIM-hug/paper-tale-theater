# 인앱 구입 상품 (App Store Connect > 앱 > 수익화 > 인앱 구입)

작성일 2026-11-06. 가격은 '가격 등급(Price Point)'에서 **USD** 기준 점을 고르면 나머지 나라는 Apple이 환산합니다. 한국 원화 금액은 고른 뒤 화면에서 확인하세요(확인 필요).

## 1. 전체 동화 열기 (비소모성)

| 칸 | 값 |
|---|---|
| 참조 이름 (내부용) | Unlock All Tales |
| 제품 ID | `com.papertale.theater.unlockall` (코드: entitlements.js `PRODUCT_ID`, StorePlugin.swift, ios/App/Products.storekit) |
| 종류 | 비소모성 (Non-Consumable) |
| 가격 | USD 4.99 (가격 점 4.99) |
| 가족 공유 | 끄기 추천(켜면 되돌릴 수 없음). 사용자 결정 |
| 판매 가능 국가 | 앱과 같게 (사용자가 정함) |
| **홍보용 구입(Promoted IAP)** | 결정된 것은 `rename` 끄기뿐입니다. 이 상품은 켜면 App Store 페이지에서 바로 살 수 있습니다. 켤지는 사용자 결정(기본값: 끔) |

표시 이름·설명 (언어별로 입력, 이름 30자·설명 45자 이내)

| 언어 | 표시 이름 | 글자 수 | 설명 | 글자 수 |
|---|---|---|---|---|
| 한국어 | 전체 동화 열기 | 8 | 모든 동화와 우리 아이 이름 1회 | 18 |
| English (U.S.) | Unlock All Tales | 16 | All tales + 1 child name change | 31 |

## 2. 이름 바꾸기권 (소모성)

| 칸 | 값 |
|---|---|
| 참조 이름 (내부용) | Name Change Pass |
| 제품 ID | `com.papertale.theater.rename` (코드: server/src/apple.js `RENAME_PRODUCT_ID`) |
| 종류 | 소모성 (Consumable) |
| 가격 | USD 0.99 (가격 점 0.99) |
| 구매 조건 | 앱이 **전체 동화 열기를 산 기기에서만** 버튼을 보여 주고, 서버도 영수증마다 unlockall 소유를 다시 확인합니다 |
| **홍보용 구입(Promoted IAP)** | **끄기**(결정). App Store 상품 페이지에서 바로 살 수 없게 둠 |
| 가족 공유 | 소모성은 불가 |

| 언어 | 표시 이름 | 글자 수 | 설명 | 글자 수 |
|---|---|---|---|---|
| 한국어 | 이름 바꾸기권 | 7 | 창작 동화의 아이 이름을 다시 바꿔요 | 20 |
| English (U.S.) | Name Change Pass | 16 | Change the child's name again | 29 |

## 3. 심사용 스크린샷 (상품마다 1장 필수, 640×920 이상)
Apple은 상품마다 '앱 안에서 이 상품을 사는 화면'을 보려고 합니다. 광고용이 아니라 심사 확인용이라 아이 캐릭터 스티커·창작 동화가 안 보이게만 하면 됩니다.

- **unlockall**: 홈 오른쪽 위 톱니를 1초 꾹 → 보호자 화면 → 이용권 칸의 '전체 구매' 단추가 보이는 화면. 이 폴더에 `screenshots/raw/*_10_iap_unlock.png` (아이패드·아이폰, 한국어)를 넣어 두었습니다(자동 캡처, 모의 구매 화면 아님. 실제 결제 시트는 TestFlight Sandbox 에서 직접 찍는 것이 가장 확실).
- **rename**: 구매 단추는 unlockall 소유 기기에서 이름 설정 칸에만 보입니다. 이 화면은 샌드박스에서 unlockall 을 산 뒤 보호자 화면 → '우리 아이 이름' → (이름을 이미 정한 뒤) '이름 바꾸기권 사기' 화면을 **TestFlight 빌드에서 직접 캡처**해야 합니다. 자동 캡처는 구매 상태를 만들 수 없어 못 만들었습니다(앱 코드 수정 금지 조건).

## 4. 심사 메모 (상품 칸 'Review Notes' 에 붙임)
```
This is a one-time unlock. It is reached only through the parent area: hold the gear icon (top right of Home) for 1 second, then solve the multiplication question by holding the right answer for 1.5 seconds. Purchase and Restore Purchases are both in that area. No account or login is needed.
Name Change Pass (consumable) is shown only on a device that already owns Unlock All, after a parent has set a child name once. The server re-checks ownership of Unlock All from the receipt and accepts each transaction ID once.
```
한국어: 일회성 전체 해제입니다. 홈 오른쪽 위 톱니를 1초 꾹 눌러 보호자 화면에 들어가 곱셈 문제(정답을 1.5초 꾹)를 풀면 구매와 구매 복원이 있습니다. 계정·로그인은 없습니다. 이름 바꾸기권은 전체 해제를 산 기기에서 보호자가 이름을 한 번 정한 뒤에만 보이며, 서버가 영수증으로 소유를 다시 확인하고 거래 ID를 한 번만 받습니다.

## 5. 사용자가 직접 할 것
- Paid Applications Agreement·은행·세금 작성(없으면 상품이 '승인 대기'에서 안 풀립니다).
- 두 상품을 만들고 각 언어 표시 이름·설명, 가격, 스크린샷 넣기. 상품 상태가 '제출 준비 완료'가 되어야 앱 버전에 붙일 수 있습니다.
- 소모성 상품은 구매 복원이 안 되므로 '안 쓴 이용권'은 서버 계정에 기록된다는 점을 심사 노트에 적어 두었습니다(review_notes.md).
