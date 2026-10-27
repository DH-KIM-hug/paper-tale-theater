# 연결 서버

종이 동화극장 앱의 기기 연결·구매 확인 서버입니다. Cloudflare Workers + KV로 동작하며 API 규칙은 `../docs/SYNC_API.md`, 정책은 `../docs/MONETIZATION.md`에 있습니다.

개인을 식별하는 정보는 받지도 저장하지도 않습니다. IP와 User-Agent는 읽지 않고, 로그에 token을 남기지 않습니다.

## 구성
| 파일 | 하는 일 |
|---|---|
| `src/index.js` | Workers 진입점(default 하나만). 실제 로직은 `src/app.js`: 라우터, 인증, 연결 코드, 속도 제한, 영수증 반영, 계정 삭제, CORS |
| `src/state.js` | state 검증과 합치기(합집합·최솟값, `owned`는 클라이언트 값 무시) |
| `src/apple.js` | 애플 StoreKit 2 JWS 검증(Web Crypto, x5c 체인 → Apple Root CA G3) |
| `src/apple_root.js` | Apple Root CA G3 인증서 상수(자리표시자, 아래 참고) |
| `src/google.js` | 구글 Play 검증(서비스 계정 JWT → `purchases.products.get` → `acknowledge`) |
| `test/` | vitest 시험 44개 |

## 로컬 실행과 시험
```sh
cd server
npm install
npx vitest run        # 시험
npx wrangler dev      # 로컬 서버(KV는 로컬 시뮬레이터). wrangler 로그인 불필요
```
`wrangler dev`에서 영수증 엔드포인트를 쓰려면 `server/.dev.vars` 파일에 비밀값을 적습니다(커밋하지 않기).
```
GOOGLE_SERVICE_ACCOUNT_JSON={"client_email":"...","private_key":"..."}
APPLE_ROOT_CA_G3_PEM="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
```

## 배포 절차
1. Cloudflare 계정에 로그인: `npx wrangler login`
2. KV 만들기
   ```sh
   npx wrangler kv namespace create ACCOUNTS
   npx wrangler kv namespace create ACCOUNTS --preview
   ```
   출력된 `id`, `preview_id`를 `wrangler.toml`의 자리표시자에 넣습니다.
3. `wrangler.toml`의 `account_id`(주석 해제 후 `npx wrangler whoami`로 확인), `WEB_ORIGINS`(웹 공개 주소)를 채웁니다.
4. 비밀값 넣기
   ```sh
   npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON   # 서비스 계정 키 JSON 전체를 붙여 넣기
   npx wrangler secret put APPLE_ROOT_CA_G3_PEM          # 선택: apple_root.js 상수를 채웠다면 생략
   ```
5. 배포: `npx wrangler deploy` → 나온 주소(`https://paper-tale-sync.<계정>.workers.dev`)를 앱 `entitlements.js`의 `API_BASE`에 넣습니다.
6. 확인: `curl -X POST <주소>/v1/account -d '{}'` 이 201과 accountId를 돌려주면 됩니다.

## 사용자가 채워야 할 값
| 값 | 어디에 | 얻는 곳 |
|---|---|---|
| Cloudflare 계정 ID | `wrangler.toml` `account_id` | `wrangler whoami` |
| KV 네임스페이스 ID(실제·미리보기) | `wrangler.toml` | `wrangler kv namespace create` |
| 웹 공개 주소 | `wrangler.toml` `WEB_ORIGINS` | GitHub Pages 주소(쉼표로 여러 개 가능) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 비밀값 | Google Cloud 서비스 계정 키(JSON). Play Console > 설정 > API 액세스에서 그 계정에 앱 재무 데이터·주문 관리 권한을 부여 |
| Apple Root CA G3 PEM | `src/apple_root.js` 상수 또는 비밀값 `APPLE_ROOT_CA_G3_PEM` | 아래 |
| 번들/패키지 ID 확인 | `wrangler.toml` `[vars]` | 기본값 `com.papertale.theater`, 상품 ID는 코드에 `com.papertale.theater.unlockall` 고정 |

### Apple Root CA G3 받기
확실하지 않은 인증서 값을 코드에 넣지 않으려고 자리표시자로 두었습니다. 채우기 전에는 `/v1/receipt/apple`이 500을 돌려줍니다.
```sh
curl -O https://www.apple.com/certificateauthority/AppleRootCA-G3.cer
openssl x509 -inform der -in AppleRootCA-G3.cer -out AppleRootCA-G3.pem
openssl x509 -in AppleRootCA-G3.pem -noout -fingerprint -sha256   # Apple PKI 페이지의 지문과 대조
```
나온 PEM을 `src/apple_root.js`의 문자열에 붙여 넣거나 `wrangler secret put APPLE_ROOT_CA_G3_PEM`으로 넣습니다.

## 동작 메모
- KV 구조: `acct:<id>`(token 해시들·state·영수증 해시), `link:<코드>`(10분), `receipt:<해시>`(연결된 계정 최대 5), `rl:...`(속도 제한 카운터, TTL).
- KV는 원자적이지 않아 속도 제한과 1회용 코드는 거의 동시에 보낸 요청에서 한두 번 새어 나갈 수 있습니다. 어린이 앱 규모에서는 허용 범위입니다.
- 계정 생성(`POST /v1/account`)은 IP를 저장하지 않기 때문에 서버에서 제한하지 않습니다. 남용이 보이면 Cloudflare 대시보드의 속도 제한 규칙(WAF)으로 막으세요.
- 애플 검증은 영수증 인증서에 애플 전용 OID(영수증 리프 `1.2.840.113635.100.6.11.1`, 중간 `1.2.840.113635.100.6.2.1`)가 있는지도 확인합니다. 애플 루트는 개발자 인증서도 발급하므로 이 확인이 없으면 다른 개발자가 서명한 JWS가 통과할 수 있습니다.
