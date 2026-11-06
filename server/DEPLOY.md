# 서버 배포 순서 (사용자가 할 일)

앱 1.0부터 서버를 켠다(2026-11-06 결정). 아래를 위에서부터 순서대로 합니다. 모든 명령은 `server/` 폴더에서 실행합니다(`cd server`).
비밀값(키)은 파일에 적지 말고 `wrangler secret put` 으로만 넣습니다.

## 0. 준비
- Cloudflare 가입: https://dash.cloudflare.com/sign-up (무료 요금제로 시작)
- 가입 뒤 대시보드 > Workers & Pages 에 한 번 들어가 `workers.dev` 하위 도메인(내 계정 이름)을 정합니다. 이 이름이 주소에 들어갑니다.
- 처음 한 번: `npm install`

## 1. 로그인
```sh
npx wrangler login      # 브라우저가 열리면 허용
npx wrangler whoami     # 계정 ID 확인
```

## 2. KV 만들기
```sh
npx wrangler kv namespace create ACCOUNTS
npx wrangler kv namespace create ACCOUNTS --preview
```
출력된 `id` 와 `preview_id` 를 `wrangler.toml` 의 자리표시자(`여기에_KV_네임스페이스_ID`, `여기에_미리보기_KV_네임스페이스_ID`)에 넣습니다.

## 3. wrangler.toml 채우기
| 항목 | 값 |
|---|---|
| `account_id` | 주석(`#`)을 풀고 `whoami` 의 계정 ID |
| `[[kv_namespaces]]` `id`, `preview_id` | 2단계 출력 |
| `WEB_ORIGINS` | 웹 공개판 주소(예: `https://깃허브아이디.github.io`). 여러 개면 쉼표. 웹판은 서버를 안 쓰지만 CORS 허용 목록에 자리가 있으니 실제 주소로 바꾸거나 무시해도 됨 |
| `APPLE_BUNDLE_ID`, `PLAY_PACKAGE_NAME` | 기본 `com.papertale.theater` (앱과 같음, 바꾸지 않음) |

iOS 앱 주소(`capacitor://localhost`)는 코드에 이미 허용되어 있어 따로 넣을 필요가 없습니다.

## 4. 비밀값
코드가 읽는 변수와 비밀값 전체 목록입니다(`server/src/app.js` 기준).

| 이름 | 종류 | iOS 1.0 | 비고 |
|---|---|---|---|
| `ACCOUNTS` | KV 바인딩 | 필수 | 2단계 |
| `APPLE_BUNDLE_ID` | 일반 변수(`[vars]`) | 필수(기본값 있음) | `com.papertale.theater` |
| `WEB_ORIGINS` | 일반 변수 | 선택 | 3단계 |
| `APPLE_ROOT_CA_G3_PEM` | 비밀값 | 선택 | `src/apple_root.js` 에 진짜 인증서가 이미 들어 있다(지문 63:34:3A…91:79, 2026-11-06 애플 사이트 파일과 대조). 인증서를 바꿀 때만 비밀값으로 덮어쓴다 |
| `PLAY_PACKAGE_NAME` | 일반 변수 | 안드로이드용 | 기본값 있음 |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 비밀값 | 안드로이드 때 | iOS 1.0 에는 불필요(구글 영수증 엔드포인트만 쓰므로) |

애플 영수증은 비밀 키가 아니라 **애플 공개 루트 인증서**(Apple Root CA G3)로 검증합니다. 코드에 이미 들어 있으므로 아래는 인증서를 바꿀 때만 합니다.
```sh
curl -O https://www.apple.com/certificateauthority/AppleRootCA-G3.cer
openssl x509 -inform der -in AppleRootCA-G3.cer -out AppleRootCA-G3.pem
openssl x509 -in AppleRootCA-G3.pem -noout -fingerprint -sha256   # Apple PKI 페이지(apple.com/certificateauthority)의 지문과 대조
npx wrangler secret put APPLE_ROOT_CA_G3_PEM < AppleRootCA-G3.pem
```
(App Store Connect 의 인앱 구입 키 같은 개인 키는 이 서버가 쓰지 않습니다. 영수증 JWS 의 서명을 애플 체인으로 검증할 뿐입니다.)

안드로이드를 낼 때 추가:
```sh
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON    # 서비스 계정 키 JSON 전체 붙여 넣기
```

## 5. 배포
```sh
npx wrangler deploy
```
출력의 주소 `https://paper-tale-sync.<내계정>.workers.dev` 를 적어 둡니다.

## 6. 주소 확인
```sh
curl -i -X POST https://paper-tale-sync.<내계정>.workers.dev/v1/account -H 'content-type: application/json' -d '{}'
```
`201` 과 `accountId`, `token` 이 나오면 됩니다. (시험으로 만든 계정은 그대로 둬도 되고, 지우려면 받은 token 으로 `DELETE /v1/account`.)

## 7. 앱 빌드에 주소 넣기
`tools/app/server.env` 의 `PAPERTALE_API_BASE=` 뒤에 주소를 적습니다(끝에 `/` 없이, https 만).
```
PAPERTALE_API_BASE=https://paper-tale-sync.<내계정>.workers.dev
```
그 뒤 앱 묶음을 만들고 iOS 로 복사합니다.
```sh
cd ..                         # 저장소 맨 위
bash tools/app/build_www.sh   # "서버 주소: ..." 가 출력되는지 확인
npx cap copy ios
```
환경 변수로 잠깐 바꿀 수도 있습니다: `PAPERTALE_API_BASE=https://... bash tools/app/build_www.sh`.
웹(GitHub Pages) 공개판은 `build_www.sh` 를 쓰지 않으므로 계속 서버 없이 동작합니다.

## 8. 배포 뒤 확인
- 실기기 앱을 처음 켜면 계정이 만들어지는지(Cloudflare 대시보드 > KV 에 `acct:` 키 생김).
- Sandbox 구매 한 번으로 `/v1/receipt/apple` 이 통과하는지, 복원이 되는지.
- 연결 코드: 두 기기에서 만들기와 입력.
- 로그 보기: `npx wrangler tail` (token 은 로그에 남지 않게 되어 있음).

## 유료 요금제로 올리는 시점
무료 Workers 의 KV 쓰기는 **하루 1,000번**이 한도입니다. 이 서버는 기기가 동기화할 때(PUT /v1/state), 계정을 만들 때, 연결 코드·속도 제한 카운터를 쓸 때 KV 에 씁니다. 사용자가 늘면 하루 한도를 넘어 쓰기가 실패합니다.
- **정식 출시(공개) 전에** Workers Paid(월 5달러)로 올립니다. 대시보드 > Workers & Pages > Plans. 유료는 KV 쓰기 월 100만 건이 포함됩니다.
- 시험·심사 기간(기기 몇 대)은 무료로 충분합니다. 단 심사 중 한도에 걸리면 동기화가 실패할 수 있으니(앱은 서버 없이도 계속 동작) 심사 제출 때 올려 두는 편이 안전합니다.
- 올린 뒤 대시보드 > Workers > 사용량에서 요청 수와 KV 쓰기를 가끔 봅니다.

## 문제가 생기면
- 앱이 서버 없이 동작해야 하므로, 서버가 죽어도 구매·읽기는 되고 동기화·연결 코드만 멈춥니다.
- 주소를 바꿔야 하면 `server.env` 만 고쳐 다시 빌드합니다.


## 삭제 요청 처리 (운영자)
사용자가 메일로 '기기 번호'(앱 보호자 영역 > 정보, 계정 ID 앞 8자리)를 보내오면:
```sh
cd server
node tools/delete_by_prefix.mjs 1a2b3c4d          # 찾은 키 목록만 보여 줌(dry-run, 기본)
node tools/delete_by_prefix.mjs 1a2b3c4d --yes    # 확인한 뒤 실제로 지움
```
계정, 그 계정의 영수증 기록(다른 계정과 공유하면 이 계정만 뺌), 연결 코드, 속도 제한 카운터를 지웁니다. 8자리가 여러 계정에 걸리면 아무것도 지우지 않고 알려 줍니다. 원격 KV 기준이며(기본, `--local` 로 로컬), 지운 뒤 사용자에게 처리했다고 회신합니다.

## 배포 기록
- 2026-11-06: workers.dev 하위 이름 `papertale`(API로 등록), KV ACCOUNTS 실제·미리보기 생성, 배포 주소 `https://paper-tale-sync.papertale.workers.dev`, tools/app/server.env 에 넣음.
