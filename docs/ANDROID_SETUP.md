# 안드로이드 출시 준비 (2차 출시 — iOS 먼저)

상태: `android/` 폴더와 Play Billing 플러그인 초안까지 만들었다. 이 컴퓨터에는 JDK·Android SDK가 없어서 `./gradlew assembleDebug` 빌드는 **확인하지 못했다.** 첫 빌드에서 오류가 나면 이 문서 아래 "확인할 곳"부터 본다.

## 구성
- 앱 ID `com.papertale.theater`, 이름 "톡톡 동화극장", 최소 SDK 24, 대상 SDK 36.
- 권한은 `INTERNET` 하나(연결 서버용). 광고·분석 SDK 없음. `allowBackup=false`.
- 상태바 숨김(전체 화면), 가로·세로 모두 허용, 아이콘은 iOS `AppIcon-512@2x.png`를 줄여 쓴 일반 아이콘(적응형 아이콘은 아직 없음), 시작 화면은 크림 단색 `#F5EFE9`.
- 결제 플러그인: `android/app/src/main/java/com/papertale/theater/StorePlugin.java` (JS 이름 `Store`), `MainActivity`에서 등록. Play Billing Library 8.0.0, 상품 `com.papertale.theater.unlockall`(INAPP, 비소모성).
- 동기화: `npm run sync`는 `www` 복사 후 있는 플랫폼(ios, android)만 `cap sync` 한다.

## JS 인터페이스 (iOS와 같은 이름)
`Capacitor.Plugins.Store`
| 메서드 | 반환 |
|---|---|
| `getPrice()` | `{ price: "₩…" }` (상품 못 찾으면 `{}`) |
| `isOwned()` | `{ owned, productId, purchaseToken?, acknowledged? }` |
| `purchase()` | 같은 모양 + `reason`: `cancelled` `pending` `no-product` `unavailable` `error` |
| `restore()` | `isOwned()`와 같음 |
| 이벤트 `ownedChanged` | 앱 밖에서 구매가 갱신될 때 `isOwned` 모양 |
iOS는 `purchaseToken` 대신 `signedTransaction`(JWS)을 준다. JS는 둘 중 있는 것을 서버로 보낸다(`/v1/receipt/apple` 또는 `/v1/receipt/google` `{ purchaseToken, productId }`).

## acknowledge 규칙 (중요)
- 앱은 acknowledge 하지 않는다. 서버가 영수증 검증 뒤 acknowledge 한다.
- **구매 후 3일 안에 acknowledge 되지 않으면 Google이 자동 환불한다.**
- 서버 전송에 실패하면(오프라인 등) `isOwned()`/`restore()`가 `acknowledged:false`인 `purchaseToken`을 계속 돌려준다. JS는 앱을 켤 때마다 `isOwned()`를 호출해 `acknowledged === false`면 서버에 다시 보내야 한다. 서버가 acknowledge 하면 다음부터 `acknowledged:true`.

## 사용자가 해야 할 일 (순서대로)
1. **Android Studio 설치** (JDK 17 포함). SDK Platform 36, Build-Tools 설치.
2. 터미널에서 `npm install` → `npm run sync` → Android Studio로 `android/` 열기 → 에뮬레이터에서 실행. 또는 `cd android && ./gradlew assembleDebug`.
3. **Google Play Console 개발자 계정** 등록($25 1회, 본인 확인).
4. 앱 만들기: 이름, 기본 언어 한국어, "앱", "무료", 가족용 대상 연령 선택.
5. **앱 서명**: Play 앱 서명 사용(권장). 업로드 키를 만든다 — `keytool -genkey -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000`. 키 파일과 비밀번호는 저장소에 넣지 않는다. `android/app/build.gradle`에 release signingConfig를 연결한다.
6. `versionCode`/`versionName`을 올리고 `./gradlew bundleRelease`로 **AAB**를 만든다.
7. 내부 테스트 트랙에 AAB 업로드, 테스터 계정(라이선스 테스터) 등록.
8. **상품 등록**: 앱 내 상품 → 상품 ID `com.papertale.theater.unlockall`, 일회성(비소모성), 가격 4.99달러(국가별 가격 확인). 활성화.
9. **서버용 서비스 계정**: Google Cloud에서 서비스 계정을 만들고 Play Console → API 접근에서 연결, "주문 및 구독 관리" 권한. 키(JSON)는 Worker 비밀값으로 둔다. (다른 에이전트의 서버 작업과 맞춘다.)
10. 스토어 등록정보(스크린샷 폰·7인치·10인치 태블릿, 설명, 개인정보처리방침 주소 `privacy.html`), 콘텐츠 등급 설문, 데이터 보안 양식 작성.
11. 신규 개인 개발자 계정은 **비공개 테스트 12명 이상, 14일** 조건이 있을 수 있다(Play Console 안내 확인).

## Google Play 가족용(Families) 정책 체크
- [ ] 대상 연령에 5세 이하를 선택하고 "가족용 프로그램"에 참여한다.
- [ ] 광고 SDK 없음 (광고 ID 권한 `AD_ID` 도 넣지 않음 — 매니페스트에 없는지 확인).
- [ ] 분석·크래시 보고 등 외부 SDK 없음. 연결 서버는 무작위 ID와 진행 기록만 저장.
- [ ] 개인 식별 정보 수집 없음(이름·이메일·전화·위치 없음). 데이터 보안 양식에 그대로 기재.
- [ ] 개인정보처리방침이 앱 안과 스토어 양쪽에서 열린다(`privacy.html`, 연결 코드 기능 문구 포함).
- [ ] 결제·외부 링크·복원 앞에 부모 확인(산수)이 있다.
- [ ] 앱 안에서 다른 앱 설치 유도나 외부 사이트 링크 없음(있다면 부모 확인 뒤에만).
- [ ] 결제는 Google Play 결제만 사용(앱 안 외부 결제 안내 금지).
- [ ] 콘텐츠 등급 설문에 폭력·공포 없음으로 정직하게 답한다(원작 갈등 장면 순화 내용 확인).
- [ ] AI 생성 그림·음성 사용 공개 요구가 있으면 심사 노트에 적는다.
- [ ] 대상 SDK는 Play가 요구하는 최신 수준(현재 36)을 유지한다.
- [ ] 불필요한 권한 없음: `INTERNET`만.

## 확인할 곳 (빌드를 못 해 본 부분)
- `billing:8.0.0` 최신 안정판 여부와 API(`enablePendingPurchases(PendingPurchasesParams)`, `queryPurchasesAsync(params, (result, list))`)를 첫 빌드 때 확인.
- `styles.xml`의 `windowFullscreen`·`windowLayoutInDisplayCutoutMode`가 Capacitor 테마 교체 뒤에도 유지되는지 실기기에서 확인(상태바가 보이면 `StatusBar` 설정 또는 `WindowInsetsController`로 숨김 추가).
- 적응형 아이콘이 필요하면 전경/배경 분리 그림을 만든다.
