# 연결 서버 API (v1)

정책은 `docs/MONETIZATION.md`. 서버는 `server/`(Cloudflare Workers + KV). 앱(JS)과 서버가 이 문서의 규칙을 그대로 따른다. 개인을 식별하는 정보는 받지도 저장하지도 않는다. IP는 저장하지 않고, 속도 제한은 KV의 짧은 TTL 카운터로만 한다.

## 데이터 모델 (state)
모든 필드는 **합칠 때 충돌이 없는 방식**(합집합·최솟값)이라 기기 간 순서가 상관없다.

```json
{
  "firstRun": "2026-10-27",                    // YYYY-MM-DD(기기 날짜). 합치면 더 이른 날짜
  "earned": { "2026-10-27": "rabbit" },        // 종이별 획득 기록: 날짜 → 완주한 동화 id. 하루 1개. 합치면 날짜별 합집합(같은 날짜 충돌 시 id 사전순 앞의 것)
  "starUnlocked": ["goldilocks"],             // 종이별 5개로 연 동화 id. 합집합
  "stickers": ["rabbit", "patjuk"],           // 퍼즐 아래 조각: 놀이로 처음 끝까지 한 동화 id(읽어 주기 제외). 합집합
  "stickers2": ["rabbit"],                    // 퍼즐 위 조각: 아래 조각이 있는 동화를 놀이로 두 번째 끝까지 한 동화 id. 합집합
  "cast": ["rabbit.rab_x", "patjuk.tiger_stand"],  // 캐릭터 스티커: "<동화id>.<k>". 놀이 완주마다 그 동화 세트의 다음 한 장. 합집합
  "waitUnlocked": ["hansel"],                  // 기다무로 연 동화 id(최대 2: 7일 뒤 1, 14일 뒤 1). 합집합 후 앞에서 2개만 유지
  "owned": false                               // 전체 구매. 영수증 검증으로만 true 가 된다. 한번 true 면 계속 true
}
```
- `cast` 항목은 `^[a-z0-9_]{1,40}\.[a-z0-9_]{1,40}$` (앞 = 동화 id, 뒤 = `tales/stickers.js` 의 k). 놀이 완주 때만 쌓인다(하루 제한 없음, 읽어 주기·자동 재생 제외). 옛 기록에 필드가 없어도 빈 목록으로 본다.
- 종이별 잔액 = `Object.keys(earned).length - 5 * starUnlocked.length` (앱이 계산, 서버는 음수가 되는 상태를 거부하지 않고 그대로 합친다).
- `stickers2` 는 `stickers` 와 같은 형식·합집합이다. 완주 횟수는 따로 세지 않고, 클라이언트가 '아래 조각이 이미 있으면 위 조각'으로 판정해 넣는다(2026-10-27). 옛 기록에 필드가 없어도 빈 목록으로 본다.
- `earned`·`stickers`·`stickers2` 는 **놀이 모드 완주**에서만 쌓인다. 읽어 주기(잠자리)와 자동 재생 완주는 넣지 않는다(2026-10-27 사용자 결정).
- `owned` 는 클라이언트가 PUT 으로 true 를 보내도 서버는 **무시**한다(영수증 엔드포인트만 올린다).
- 동화 id 는 `tales/catalog.js` 의 id. 서버는 `^[a-z0-9_]{1,40}$` 만 허용하고 필드별 개수 상한을 둔다(earned ≤ 400, starUnlocked ≤ 100, stickers ≤ 200, stickers2 ≤ 200, cast ≤ 400, waitUnlocked ≤ 2). 상한을 넘는 합집합은 사전순 앞에서 자른다.

## 인증
- 계정 = 무작위 `accountId`(UUID v4) + 무작위 `token`(32바이트 base64url). 서버는 token 의 SHA-256 해시만 저장한다.
- 이후 요청은 `Authorization: Bearer <accountId>.<token>`.

## 엔드포인트
공통: JSON, UTF-8, CORS 허용(Capacitor `capacitor://localhost`, `https://localhost`, 웹 공개 주소). 오류는 `{ "error": "코드" }` + HTTP 상태.

| 메서드·경로 | 인증 | 요청 | 응답 |
|---|---|---|---|
| `POST /v1/account` | 없음 | `{}` | 201 `{ accountId, token, state }` |
| `GET /v1/state` | 필요 | - | `{ state }` |
| `PUT /v1/state` | 필요 | `{ state }` (클라이언트의 로컬 state) | 서버 state 와 합친 `{ state }` |
| `POST /v1/link/create` | 필요 | `{}` | `{ code, expiresAt }` — 8자리 코드(혼동 문자 제외 `ABCDEFGHJKMNPQRSTUVWXYZ23456789`), 10분 유효, 1회용 |
| `POST /v1/link/redeem` | 필요(요청 기기의 현재 계정) | `{ code }` | `{ accountId, token, state }` — 코드를 만든 계정의 새 token. 요청 기기의 기존 계정 state 는 대상 계정에 합쳐지고 기존 계정은 삭제된다 |
| `POST /v1/receipt/apple` | 필요 | `{ signedTransaction }` (StoreKit 2 JWS) | `{ owned, state }` |
| `POST /v1/receipt/google` | 필요 | `{ purchaseToken, productId }` | `{ owned, state }` |
| `DELETE /v1/account` | 필요 | - | 204 — 계정과 연결된 모든 기록 삭제 |

오류 코드: `unauthorized`(401), `bad_request`(400), `code_invalid`(404, 없음·만료·이미 씀), `code_self`(409, 자기 계정의 코드), `rate_limited`(429), `receipt_invalid`(422), `server_error`(500).
- 코드 입력은 계정당 분당 5회, 코드 생성은 시간당 10회로 제한한다.
- 상품 ID: `com.papertale.theater.unlockall` (애플·구글 동일).

## 영수증 검증
- 애플: `signedTransaction` JWS 의 x5c 인증서 체인을 Apple Root CA G3 까지 검증하고, `bundleId == com.papertale.theater`, `productId`, `revocationDate` 없음, `environment`(Production/Sandbox)를 확인한다. 서버 API 호출은 필요 없다(JWS 자체 검증).
- 구글: Google Play Developer API `purchases.products.get`(서비스 계정)으로 `purchaseState == 0` 확인 후 `acknowledge` 호출. 서비스 계정 키는 Worker 비밀값.
- 같은 영수증을 다른 계정이 쓰는 것은 허용한다(복원·연결 때문에). 한 영수증에 연결 가능한 계정 수 상한은 5.

## 앱 쪽 규칙
- 앱 모드에서 첫 실행 때 `POST /v1/account` 를 시도하고 실패하면 오프라인 모드로 계속한다(서버 없이도 모든 기능이 동작해야 한다). 이후 앱이 켜질 때와 종이별·잠금 해제가 일어날 때 `PUT /v1/state` 로 동기화한다(디바운스 5초, 실패는 조용히 재시도).
- 로컬 저장 키: `sync_account`(accountId, token), `sync_state`(state), `sync_dirty`.
- 서버 주소는 `engine/config` 대신 `entitlements.js` 의 `API_BASE` 한 곳. 빌드 시 바꿀 수 있게 한다.
- 연결 화면(코드 만들기·코드 입력)은 부모 확인 뒤에만 열린다.
