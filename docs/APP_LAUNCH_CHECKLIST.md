# App Store 심사 신청 전 체크리스트 (톡톡 동화극장)

조사일: 2026-11-06. 읽기 전용 조사 결과입니다. 코드를 실행해 확인한 것만 '끝'으로 적었고, 근거가 없는 것은 '확인 필요'로 표시했습니다. 안드로이드는 출시 후로 미룹니다(iOS 먼저).

## 요약
- **지금 가장 크게 막힌 것은 사용자 일입니다.** Apple 개발자 계정 유료 가입 확인, 유료 앱 계약·은행·세금, App Store Connect에 상품 `com.papertale.theater.unlockall` 만들기가 안 되어 있으면 실제 구매 시험도 심사도 못 합니다.
- **개인정보 처리방침(`privacy.html`)이 낡았습니다.** "어떤 정보도 서버로 보내지 않는다"고 쓰여 있는데, 연결 서버(무작위 ID·진행 기록 저장)가 들어갑니다. 서버 켜기 전에 고쳐야 하고, 심사용 공개 주소와 지원 주소도 필요합니다.
- **서버는 코드·시험(51개 통과)까지 끝, 배포는 안 했습니다.** 앱의 `API_BASE`가 빈 값이라 지금 빌드는 동기화·연결 코드가 꺼져 있습니다. 서버 없이 1.0을 낼지, 서버를 먼저 배포할지 결정이 필요합니다.
- 앱 이름(상표·중복), 스크린샷, 설명문, 연령 등급·개인정보 라벨, AI 그림 심사 노트는 아직 자료가 없습니다.
- 콘텐츠는 카탈로그 34편이 모두 `ready:true`이고 읽어 주기·영어 34편 데이터 검사가 통과합니다. 마무리가 급한 동화는 없습니다.

## 표

상태: 끝 / 일부 / 안 함 / 확인 필요

### 1. 계정·계약
| 항목 | 누가 | 상태 | 근거 | 다음 행동 |
|---|---|---|---|---|
| Apple Developer Program 유료 가입($99/년) | 사용자 | 확인 필요 | Xcode 프로젝트에 `DEVELOPMENT_TEAM = 66DAQSBX4V`가 있음(`ios/App/App.xcodeproj/project.pbxproj:316`). 무료 계정일 수도 있음 | developer.apple.com 계정 화면에서 유료 멤버십 확인 |
| 유료 앱 계약(Paid Applications Agreement)·은행·세금 | 사용자 | 안 함 | 메모 app-store-plan.md "사용자 할 일". 한국 개인이면 사업자 구분·세금 양식도 확인 | App Store Connect > 비즈니스에서 작성. 인앱 구매 판매의 필수 조건 |
| App Store Connect 앱 만들기(번들 ID 등록, 이름 예약) | 사용자 | 안 함 | 번들 ID `com.papertale.theater`(`capacitor.config.json`, pbxproj:325) | 앱 이름 확정 후 만들기. 이름은 App Store에서 겹치면 못 씀 |
| 앱 이름 확정 「톡톡 동화극장」 | 사용자 | 일부 | `capacitor.config.json`·`Info.plist`에 이미 이 이름. 상표(키프리스)·스토어 중복 확인 전(메모) | 키프리스·App Store 검색으로 중복 확인. 부제 "2~5세를 위한 인터랙티브 동화읽기"는 연령 표기가 등급과 맞는지 확인 |
| Google Play 개발자 계정($25) | 사용자 | 안 함 | docs/ANDROID_SETUP.md | **출시 후로 미룸** |

### 2. 결제·서버
| 항목 | 누가 | 상태 | 근거 | 다음 행동 |
|---|---|---|---|---|
| App Store Connect 상품 `com.papertale.theater.unlockall` (비소모성, 4.99달러 티어) | 사용자 | 안 함 | 코드 상품 ID: `entitlements.js:16`, `StorePlugin.swift:6`. 시험 파일 `ios/App/Products.storekit`은 4.99 | 상품 만들고 이름·설명·심사용 스크린샷 넣기. 가격 티어는 실제 표에서 고름 |
| StoreKit 2 플러그인(구매·복원·거래 감시) | 개발 | 끝(코드). 실제 기기 시험은 확인 필요 | `ios/App/App/StorePlugin.swift` | Sandbox 계정으로 실기기 구매·복원·취소 시험. 심사 전 TestFlight에서도 한 번 |
| 부모 확인(구매·복원·외부 링크 앞) | 개발 | 끝(코드) | `home.js:945` `parentCheck(...)` | 구매·복원 화면까지 실제로 거치는지 실기기에서 확인 |
| 구매 복원 버튼 | 개발 | 끝(코드) | `home.js:890` | 앱 안 보호자 영역에서 보이는지 심사 노트에 위치 적기 |
| Cloudflare 서버 배포 | 사용자+개발 | 안 함 | `server/wrangler.toml`의 `account_id` 주석 처리, KV `id`·`preview_id`·`WEB_ORIGINS`가 자리표시자 | `wrangler login` → KV 만들기 → 값 채우기 → `wrangler deploy` (`server/README.md` 배포 절차) |
| 서버 시험 | 개발 | 끝 | `cd server && npx vitest run` → 51개 통과(2026-11-06 확인). README는 44개라고 적혀 있어 숫자만 낡음 | README 숫자 고치기(작은 일) |
| Apple Root CA G3 인증서 | 개발 | 끝 | `server/src/apple_root.js`에 PEM이 들어 있음(2026-10-30 받음) | 지문을 Apple PKI 페이지와 한 번 대조(README 안내) |
| `PAPERTALE_API_BASE` 주입 | 개발 | 안 함 | `entitlements.js:15` 기본값 빈 문자열, 빌드·`index.html`에서 이 값을 넣는 곳을 찾지 못함 | 서버 주소가 나오면 빌드에서 넣는 방법을 정하기(`build_www.sh` 또는 `index.html` 한 줄) |
| 서버 비밀값: `GOOGLE_SERVICE_ACCOUNT_JSON` | 사용자 | 안 함 | `server/README.md` | **안드로이드 때** 필요. iOS 1.0엔 불필요하나 지금 서버 코드가 없을 때 어떻게 동작하는지 확인 필요 |
| 서버 없이 1.0을 내는 경우의 동작 | 개발 | 확인 필요 | `entitlements.js:300` `enabled = !!API_BASE && appMode()` → 서버 없으면 동기화만 꺼짐 | 서버 없이도 구매·무료 로테이션·별 조각이 되는지 실기기에서 확인. 이 경우 연결 코드 화면은 숨기거나 안내가 필요한지 확인 |
| 서버 영수증 검증 실제 시험(Sandbox JWS) | 개발 | 안 함 | 단위 시험만 있음 | 배포 후 Sandbox 구매로 `/v1/receipt/apple` 통과 확인 |
| 신규: 4.99달러 구매에 '창작 동화 아이 이름 바꾸기' | 개발 | 안 함 | 다른 에이전트가 기획 중. **서버 필요** | 기획 확정 후 이 표에 구체 항목 추가. 서버 배포 순서에 영향 |
| **심사 제출 전: 쿠폰 칸 제거 또는 `COUPON_SHA256` 삭제** | 개발+사용자 | 안 함(2026-11-06 개발 실험용으로 넣음) | 앱 `home.js` `couponRow`·`couponApply`(보호자 '정보' 칸), `entitlements.js` `redeemCoupon`, 서버 `POST /v1/coupon`(`server/src/app.js` `couponRedeem`) | 앱 밖에서 받은 코드로 유료 콘텐츠를 여는 것은 App Store 지침 3.1.1 위반 소지. 제출 전 `npx wrangler secret delete COUPON_SHA256`(서버가 404 → 앱은 '지금은 쓸 수 없어요'만 보임), 가능하면 쿠폰 칸 코드도 지운다 |

### 3. 앱 빌드·설정
| 항목 | 누가 | 상태 | 근거 | 다음 행동 |
|---|---|---|---|---|
| 번들 ID | 개발 | 끝 | `com.papertale.theater` — capacitor.config, pbxproj, 서버 `wrangler.toml`이 같음 | 없음 |
| 버전·빌드 번호 | 개발 | 끝 | `MARKETING_VERSION = 1.0`, `CURRENT_PROJECT_VERSION = 1` | TestFlight 올릴 때마다 빌드 번호 올리기 |
| 앱 아이콘 1024 | 개발 | 일부 | `AppIcon-512@2x.png` 1024×1024, 단일 아이콘 1장 | 투명 배경·모서리가 없는지 확인(App Store는 알파 채널을 거부). 최종 로고가 맞는지 사용자 확인 |
| 실행 화면(LaunchScreen) | 개발 | 끝(파일) | `Splash.imageset` 2732×2732 3장, `LaunchScreen.storyboard` | 아이패드·아이폰 세로·가로에서 잘림 없는지 실기기 확인 |
| `Info.plist` `UIRequiredDeviceCapabilities`가 `armv7` | 개발 | 확인 필요 | `Info.plist:56` | Capacitor 기본값이라 보통 통과하지만, 업로드 때 경고가 나면 `arm64`로 바꾸기 |
| 수출 규정 `ITSAppUsesNonExemptEncryption = false` | 개발 | 끝 | `Info.plist` | 없음 |
| 개인정보 매니페스트 `PrivacyInfo.xcprivacy` | 개발 | 확인 필요 | 앱 폴더에서 못 찾음(`find ios -name PrivacyInfo*`는 앱 자체 파일 없음). Capacitor·SPM 패키지 쪽 매니페스트는 확인 못 함 | 보관 후 Xcode에서 Archive > Privacy Report로 확인. 앱이 쓰는 UserDefaults·파일 시간 등 '필수 사유 API'가 있으면 앱 매니페스트 추가 |
| 최소 iOS 15.0, 기기 아이폰+아이패드 | 개발 | 끝 | pbxproj:318, 329 | 아이패드 가로·세로, 아이폰 세로 모두 지원 선언됨. 아이폰 가로 화면은 시험 확인 필요 |
| 백그라운드 오디오(`UIBackgroundModes: audio`) | 개발 | 끝(선언) | `Info.plist`, `BedtimeAudioPlugin.swift` | 심사 노트에 이유 한 줄(잠자리 읽어 주기를 화면 끄고 듣기) |
| 앱 용량 | 개발 | 일부 | `www` 610MB(`du -sh`), 녹음 64kbps 유지 결정(메모 app-bundle-size) | App Store 앱 크기 한도 안이지만 셀룰러 다운로드 경고(200MB 초과)가 뜸. 동화별 내려받기는 출시 후로 미룬다고 결정됨 |
| `build_www.sh` 후 `npx cap copy ios` | 개발 | 규칙 | 메모 app-bundle-size.md. 지금 `ios/App/App/public` 611MB로 최신 | **Archive 전에 매번** `npm run build:www` → `npx cap copy ios` (또는 `npm run sync`). 안 하면 옛 묶음이 들어감 |
| 릴리스 빌드·Archive·TestFlight 업로드 | 사용자(Xcode) | 안 함 | 확인한 기록 없음 | Release로 Archive → TestFlight 업로드 → 내부 테스트 |
| 실기기 시험(아이패드·아이폰) | 사용자+개발 | 확인 필요 | 스티커 무대 계획서 "아직 안 한 것: 실제 아이패드 사파리 손맛·성능 확인"(`docs/STICKER_STAGE_PLAN.md:364`) | 아이패드 실기기에서 첫 실행·홈·동화 2~3편·잠자리(화면 끄기)·내 무대·구매 흐름 |
| 저장소가 깨끗한지(미커밋 파일) | 개발 | 확인 필요 | `git status`에 115개 변경. 사용 중일 수 있는 새 그림이 미커밋(`assets/v3w/uc_cut_*.webp`, `uc_sheep_mom.webp`, `sp_logo_*.webp` 등) | 앱 묶음에 들어가는 것인지 확인 후 커밋 정리. 다른 세션 작업과 섞이지 않게 사용자가 결정 |

### 4. 심사 자료
| 항목 | 누가 | 상태 | 근거 | 다음 행동 |
|---|---|---|---|---|
| 스크린샷: 아이패드 13인치(2064×2752 세로 또는 2752×2064 가로) | 개발+사용자 | 안 함 | 저장소에서 스토어용 스크린샷 폴더를 못 찾음 | 시뮬레이터/실기기로 홈·동화 장면·내 무대·잠자리 5~8장. **아이 캐릭터 스티커가 든 장면은 홍보에 쓰지 않기로 한 결정(STICKER_STAGE_PLAN §1-7)과 CLAUDE.md §1 확인** |
| 스크린샷: 아이폰 6.9인치(1320×2868) 등 | 개발+사용자 | 안 함 | 같음 | 아이폰 앱 지원을 선언했으므로 필요. Apple의 현재 요구 크기는 업로드 화면에서 확인 필요 |
| 앱 미리보기 영상(선택) | 사용자 | 안 함 | 3D 광고 영상은 `~/Movies/paper-tale-promo/ad3d`(저장소 밖) | 선택. 앱 화면 녹화여야 함(스토어 규정) |
| 설명문·키워드·부제·홍보 문구(한국어, 영어는 선택) | 사용자+개발 | 안 함 | 초안 파일 없음 | 방향: "밤에는 잠자리 동화, 낮에는 학습 동화"(app-positioning.md). 학습 주장은 실제 조작만, 가격·출시일 확정 전 적지 않기 |
| 개인정보 처리방침 공개 주소 | 개발+사용자 | 일부 | `privacy.html` 있음. 공개 주소 후보 `https://dh-kim-hug.github.io/paper-tale-theater/privacy.html`(README:5). 앱 안에서도 열림(`home.js:957`) | 위 주소가 실제로 열리는지 확인하고 App Store Connect에 입력 |
| **처리방침 내용 갱신** | 개발 | 안 함 | `privacy.html`: "개발자나 다른 곳으로 전송되지 않습니다", "인터넷 없이 작동", 구매 여부도 기기에만, 시행일 2026-10-09. 서버 문서와 어긋남(`docs/MONETIZATION.md` §5가 이미 갱신 필요라고 적음) | 무작위 ID·진행 기록·구매 검증 결과가 연결 서버에 저장됨, 개인 식별 정보 없음, 삭제 방법(`DELETE /v1/account`)을 한·영으로 추가. 만 3~4세 문구는 앱 연령과 맞추기 |
| 지원(Support) URL·연락 방법 | 사용자 | 안 함 | 처리방침 문의 항목이 "GitHub 이슈"뿐 | 전용 이메일 또는 지원 페이지 만들기. Apple은 지원 URL 필수 |
| 개인정보 라벨(App Privacy) | 사용자 | 안 함 | 서버를 켜면 '식별자(무작위 ID)·사용 데이터(진행 기록)' 항목이 생김 | 서버를 켜는 경우: 수집함, 사용자와 연결 안 됨, 추적 안 함으로 신중히 답하기(확인 필요). 서버 없이 내면 '수집 안 함' |
| 연령 등급 설문 | 사용자 | 안 함 | 계획: 5세 이하 | 폭력·공포 질문에 정직히 답하기(원작 갈등 장면 순화는 기획서에 기록되어 있음) |
| 어린이 카테고리(Kids) 신청 및 연령대(5세 이하) | 사용자 | 안 함 | app-store-plan.md | App Store Connect에서 선택. 아래 5번 규칙 충족 필요 |
| 가격·판매 국가 | 사용자 | 안 함 | 4.99달러 확정 | 국가별 가격과 한국 원화 티어 확인 |
| AI 그림·음성 심사 노트 | 개발+사용자 | 안 함 | README:109~110, `COPYRIGHT.md:18`에 출처 문구는 있음. 심사 노트 문서는 없음 | "그림은 OpenAI 이미지 생성, 음성은 ElevenLabs·Typecast 상업 요금제, 효과음은 상업 가능 라이선스, 실제 아이 얼굴·사진 없음"을 심사 노트에 적기 |
| 심사용 데모 안내(심사 노트) | 개발 | 안 함 | 없음 | 적을 것: 로그인 없음, 보호자 영역 위치(톱니)와 부모 확인이 산수 문제인 점, 구매·복원 위치, 무료 4편+창작 동화, 영어 전환 방법, 잠자리 탭, 서버가 꺼져 있어도 오프라인으로 동작 |
| 저작권 문구·크레딧 화면 | 개발 | 끝 | `sounds/CREDITS.md`(CC BY-SA 없음 확인), 앱 안 크레딧 `home.js:860` | 없음 |

### 5. 어린이 앱 규칙 (Kids 카테고리)
| 항목 | 누가 | 상태 | 근거 | 다음 행동 |
|---|---|---|---|---|
| 구매·복원·외부 링크 앞 부모 확인 | 개발 | 끝(코드) | `home.js` `parentCheck` | 실기기에서 우회가 안 되는지 확인 |
| 광고·외부 분석 SDK 없음 | 개발 | 끝(확인) | `package.json` 의존성: Capacitor만. 안드로이드 문서도 SDK 없음 | 없음. 서버 도입 후에도 분석 도구를 넣지 않기 |
| 앱 안 외부 링크 | 개발 | 확인 필요 | `home.js`·`bedtime.js`·`index.html`에서 http 링크 검색 결과 외부 이동 코드를 못 찾음(정밀 점검은 안 함) | 처리방침 페이지 안 링크(GitHub 이슈)가 앱 안에서 누르면 외부로 나가는지 확인. 나가면 제거하거나 부모 확인 뒤로 |
| 서버와의 통신 | 개발 | 일부 | 연결 서버는 무작위 ID·진행 기록만 저장 (`docs/SYNC_API.md`). IP·User-Agent를 읽지 않음 | 서버 켤 때 처리방침·개인정보 라벨과 맞추기. 연결은 선택 사항이고 부모 확인 뒤에만 열림(문서 기준, 실기기 확인 필요) |
| 아이 이름·사진 참고 그림이 든 창작 동화 4편 공개 | 사용자 | 결정됨 | CLAUDE.md §1 예외(2026-10-27·28) | 심사에서 문제 될 가능성은 낮지만, 스크린샷·홍보물에는 쓰지 않기. 이름 바꾸기 기능이 4.99달러 구매에 들어갈 예정 |
| 연령 등급·카테고리와 부제의 일치 | 사용자 | 확인 필요 | 부제 "2~5세" vs 등급 5세 이하 | 설명문의 연령 표현을 등급과 맞추기 |

### 6. 콘텐츠 마무리
| 항목 | 누가 | 상태 | 근거 | 다음 행동 |
|---|---|---|---|---|
| `ready:false` 동화 | - | 끝(없음) | `tales/catalog.js`에서 `ready: false` 검색 결과 0건. 34편 모두 `ready: true` | 옛 메모의 "골디락스는 ready:false"는 낡음. 골디락스는 지금 `ready: true`(`catalog.js:150`) |
| `making:true` 동화 | 개발 | 확인 필요 | 위 검색은 `ready`만 봄 | 카탈로그에서 `making` 플래그가 남은 동화가 없는지 한 번 더 보기 |
| 읽어 주기·영어 데이터 | 개발 | 끝 | `node tools/app/check_app_data.mjs` → "통과: 34편 중 읽어 주기 34편, 영어 34편" | 없음 |
| 녹음 빠진 문장 | 개발 | 확인 필요 | 위 검사는 데이터 존재만 확인. 최근 새 문장(내 무대 안내 15줄)은 한·영 녹음 완료(커밋 e164b409) | 새 문장 추가 때마다 `check_app_data.mjs` 돌리기. "녹음 없는 말은 말하지 않음" 원칙(TTS 금지) 유지 |
| 점검 문서가 남긴 수정 | 개발 | 확인 필요 | 수정 중인 `tales/*/AUDIT.md` 8개, `COUNTING_AUDIT.md`, `HOME_UI_AUDIT.md`가 미커밋 | 점검에서 나온 '고칠 것' 중 출시 전 필수가 있는지 사용자가 선별 |
| 스티커 무대 1판 마무리 | 개발 | 일부 | `docs/STICKER_STAGE_PLAN.md:364` "아이 캐릭터 kid 표시, 실제 아이패드 손맛·성능 확인" 안 함 | 성능 확인은 출시 전, kid 표시는 이름 바꾸기 기능과 함께 |
| 퍼즐판 그림 | 개발 | 확인 필요 | `docs/PUZZLE_PLAN.md`에 시범/본 작업 구분 있음. 현재 생성 완료 범위를 이번에 확인하지 못함 | 앱에서 퍼즐판이 임시(썸네일 마스크)로 보이는 곳이 없는지 확인 |

### 7. 법·출처
| 항목 | 누가 | 상태 | 근거 | 다음 행동 |
|---|---|---|---|---|
| 그림 상업 이용(OpenAI 생성) | 사용자 | 결정됨 | 메모 license-commercial.md (2026-10-30), README:109 | OpenAI 약관 현재판을 출시 때 한 번 더 확인(확인 필요) |
| 음성 상업 이용(ElevenLabs·Typecast) | 사용자 | 일부 | README:110, COPYRIGHT.md:18. 옛 메모에는 "Typecast 요금제 상업 허용 확인"이 출시 전 할 일이었음. 이후 "다 상업 가능"으로 결정 | 사용 중인 요금제 영수증·약관 캡처를 보관. ElevenLabs 요금제가 상업 이용 가능한 플랜인지 확인 |
| 효과음·음악 출처 | 개발 | 끝 | `sounds/CREDITS.md`: CC BY·CC BY-SA 없음(2026-11-02 교체) | 없음. 새 소리를 넣을 때 NC 금지 |
| 원작 저작권 | 개발 | 끝(문서) | 전래·이솝·그림 형제·안데르센 등 공개 도메인 기반. 창작 4편은 자작 | 현대 번안본을 따르지 않았는지 줄거리 비교는 확인 필요 |
| 상표: 앱 이름 | 사용자 | 안 함 | 위 1번 | 키프리스 검색 |
| 개인정보 법(한국 개인정보보호법·아동 개인정보) | 사용자 | 확인 필요 | 서버가 무작위 ID를 저장함 | 개인 식별 정보가 없다는 판단이 맞는지 처리방침 작성 때 점검. 필요하면 전문가 확인 |

### 8. 출시 후로 미룰 것
| 항목 | 상태 | 근거 |
|---|---|---|
| 안드로이드 출시(Play 계정, 서명, AAB, Play Billing 실빌드) | 미룸 | `docs/ANDROID_SETUP.md`: 이 컴퓨터엔 JDK·SDK가 없어 빌드 미확인 |
| 동화별 내려받기(첫 설치 용량 약 100MB로) | 미룸 | 메모 app-bundle-size.md |
| 추가 슬롯 0.99달러, 선물, 복구용 이메일 | 미룸 | `docs/MONETIZATION.md` §3 |
| 보호자가 아이 이름 바꾸기 | 출시 전/후는 사용자 결정. 다른 에이전트가 기획 중 | CLAUDE.md §1 예외 |
| 내 무대 사진 저장·공유, 서버 동기화 | 2판 | `docs/STICKER_STAGE_PLAN.md:232, 236` |
| 앱 미리보기 영상, 다크 모드 | 미룸 | CLAUDE.md §7-5 "다크 모드는 맨 나중" |
| 저장소 기록 정리(.git 2.7GB → 0.85GB 강제 푸시) | 승인됨, 다른 세션이 끝난 뒤 | 메모 app-bundle-size.md |

## 추천 순서
1. **(사용자) Apple 개발자 계정 유료 가입 확인 + 유료 앱 계약·은행·세금 작성.** 심사 시간이 가장 오래 걸릴 수 있어 먼저 시작합니다.
2. **(사용자) 앱 이름 확정**: 키프리스·App Store 중복 확인. 그 뒤 App Store Connect에서 앱 만들기.
3. **(사용자) 1.0에 서버를 넣을지 결정.** 서버를 넣으면 4번, 안 넣으면 건너뛰고 처리방침·개인정보 라벨은 '서버 없음' 기준으로 씁니다. (이름 바꾸기 기능이 서버를 쓰면 결정에 영향이 큽니다.)
4. **(사용자+개발) Cloudflare 배포**: `wrangler login` → KV → `wrangler.toml` 값 → `wrangler deploy` → 나온 주소를 앱에 주입 → `curl`로 201 확인.
5. **(사용자) App Store Connect 상품 `com.papertale.theater.unlockall` 만들기**(비소모성, 4.99달러 티어).
6. **(개발) 개인정보 처리방침 갱신**(한·영), 공개 주소 확인, 지원 주소 정하기.
7. **(개발) 빌드**: `npm run build:www` → `npx cap copy ios` → Release Archive → TestFlight 업로드. 아이콘 알파 채널, 개인정보 매니페스트 리포트, `armv7` 경고 확인.
8. **(사용자+개발) 아이패드·아이폰 실기기 시험**: Sandbox 구매·복원·부모 확인·잠자리 화면 끄기·스티커 무대 성능·서버 켠 경우 영수증 검증과 연결 코드.
9. **(개발) 심사 자료 만들기**: 스크린샷(아이패드 13인치, 아이폰 6.9인치 등), 설명문, 키워드, 심사 노트(데모 안내·AI 그림 노트·백그라운드 오디오 이유).
10. **(사용자) 개인정보 라벨, 연령 등급, 어린이 카테고리, 가격 입력** 후 심사 신청. 신청 직전 쿠폰 칸 제거 또는 `wrangler secret delete COUPON_SHA256`(지침 3.1.1).
11. 심사 통과 뒤 안드로이드, 동화별 내려받기, 아이 이름 바꾸기 후속 작업.

## 확인할 때 쓴 명령
- `cd server && npx vitest run` (51개 통과)
- `node tools/app/check_app_data.mjs` (34편 통과)
- `grep -n "ready" tales/catalog.js` (ready:false 0건)
- `du -sh www ios/App/App/public` (610M, 611M)
