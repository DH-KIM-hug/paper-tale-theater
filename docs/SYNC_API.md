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
  "shiny": ["patjuk.tiger_stand"],             // 반짝 스티커: 별 하나(조각 5개)로 반짝이게 만든 cast 항목. 합집합 (2026-10-31)
  "waitUnlocked": ["hansel"],                  // 기다무로 연 동화 id(최대 2: 7일 뒤 1, 14일 뒤 1). 합집합 후 앞에서 2개만 유지
  "owned": false                               // 전체 구매. 영수증 검증으로만 true 가 된다. 한번 true 면 계속 true
}
```
- `cast` 항목은 `^[a-z0-9_]{1,40}\.[a-z0-9_]{1,40}$` (앞 = 동화 id, 뒤 = `tales/stickers.js` 의 k). 놀이 완주 때만 쌓인다(하루 제한 없음, 읽어 주기·자동 재생 제외). 옛 기록에 필드가 없어도 빈 목록으로 본다.
- 별 조각 잔액 = `Object.keys(earned).length - 5 * (starUnlocked.length + shiny.length)` (앱이 계산, 서버는 음수가 되는 상태를 거부하지 않고 그대로 합친다). `shiny` 는 `cast` 와 같은 모양, 상한 100.
- `stickers2` 는 `stickers` 와 같은 형식·합집합이다. 완주 횟수는 따로 세지 않고, 클라이언트가 '아래 조각이 이미 있으면 위 조각'으로 판정해 넣는다(2026-10-27). 옛 기록에 필드가 없어도 빈 목록으로 본다.
- `earned`·`stickers`·`stickers2` 는 **놀이 모드 완주**에서만 쌓인다. 읽어 주기(잠자리)와 자동 재생 완주는 넣지 않는다(2026-10-27 사용자 결정).
- `owned` 는 클라이언트가 PUT 으로 true 를 보내도 서버는 **무시**한다(영수증 엔드포인트만 올린다).
- 동화 id 는 `tales/catalog.js` 의 id. 서버는 `^[a-z0-9_]{1,40}$` 만 허용하고 필드별 개수 상한을 둔다(earned ≤ 400, starUnlocked ≤ 100, stickers ≤ 200, stickers2 ≤ 200, cast ≤ 400, shiny ≤ 100, waitUnlocked ≤ 2). 상한을 넘는 합집합은 사전순 앞에서 자른다.

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
| `POST /v1/coupon` | 필요 | `{ code }` | `{ owned, state }` — 개발 실험용 쿠폰. 맞으면 4.99 구매와 같은 `state.owned:true`(이름 바꾸기 `owned`·크레딧도 구매자와 같음), 계정 기록에 `ownedVia:'coupon'`. 비밀값 `COUPON_SHA256` 이 없으면 404 `not_found`(꺼짐), 틀리면 400 `bad_coupon` |
| `DELETE /v1/account` | 필요 | - | 204 — 계정과 연결된 모든 기록 삭제 |

오류 코드: `unauthorized`(401), `bad_request`(400), `code_invalid`(404, 없음·만료·이미 씀), `code_self`(409, 자기 계정의 코드), `rate_limited`(429), `receipt_invalid`(422), `server_error`(500).
- 코드 입력은 계정당 분당 5회, 코드 생성은 시간당 10회로 제한한다.
- 쿠폰: 입력을 앞뒤 공백 제거·소문자로 바꾼 뒤 SHA-256 hex 를 `COUPON_SHA256`(소문자 hex, 쉼표로 여러 개)과 상수 시간 비교한다. 쿠폰 원문은 저장·로그하지 않는다. 계정당 10분에 5회(맞든 틀리든 센다). 심사 제출 전 `wrangler secret delete COUPON_SHA256` 로 끈다(App Store 지침 3.1.1).
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

## 이름 바꾸기 (2026-11-06, 기획 docs/NAME_CHANGE_PLAN.md · 2판 2026-11-07 docs/NAME_SETUP_V2_PLAN.md)
창작 동화의 아이·강아지 이름을 보호자가 바꾸면, 이름이 든 대사를 서버가 ElevenLabs 로 줄 하나씩 새로 녹음해 mp3 로 돌려준다. **서버는 이름을 저장하지도 로그에 쓰지도 않는다**(요청 처리 중 메모리에만). KV 에는 숫자·동화 id·실행 id 만 둔다.

### 자리와 템플릿
- 자리 4개(네 편 공통): `A` 다현(여자아이), `B` 이현(남자아이), `C` 은우(막내), `D` 꿀떡(강아지, 원문 '꿀떡이' = 꿀떡 + 이). 영어 원래 이름 Dahyun·Ihyun·Eunwoo·Kkulddeok.
- **주인공 모습(look, 2판)**: 동화마다 따로 정하는 아이의 모습. `'b'` 남자아이 / `'g'` 여자아이. 요청에 `look: { A?, B?, C? }`(D 강아지는 모습 없음)로 보내고 서버는 저장하지 않는다. 빠진 자리는 원래 모습(`originalLook` = A `g`, B `b`, C `g`). `b`·`g` 가 아닌 값·다른 자리는 400 `look_invalid`.
- 템플릿 문법: `{A}` 이름 그대로, `{A:X/Y}` 끝 글자 받침이 있으면 이름+X·없으면 이름+Y(예 `{A:이가/가}` → 다현이가·서아가, `{D:아/야}` → 콩아·초코야), ㄹ 받침 + `으로/로` 는 '로', `{A_en}` 영어 이름. 한글이 아닌 끝 글자는 받침 없음. 빠진 자리는 원래 이름.
- 모습 문법(2판): `{A_g:he/she}` — 자리 A 의 모습으로 고른다(앞 = 남자아이 b, 뒤 = 여자아이 g). 영어 대명사용(`{A_g:his/her}`, `{A_g:himself/herself}`, 문장 앞은 `{A_g:He/She}`). 한국어 템플릿에는 성별 단어가 없어 쓰지 않는다. 호칭 `{A>B:형/오빠/누나/언니}`(A 가 B 를 부를 때, 값 순서 = A남·B남 / A여·B남 / A남·B여 / A여·B여)도 정의돼 있으나 지금 대사에는 없다.
- 함수: `engine/name_form.js`(앱, `window.NameForm`)와 `server/src/name_form.js`(서버) — `fill(tpl, names, look)`, `hasBatchim(name)`, `valid(name, lang)`, `validLook(look)`, `slotsIn(tpl)`(`_g`·호칭은 `A_g` 로 나온다), `ORIGINAL`, `ORIGINAL_LOOK`.
- 템플릿 원본: `server/src/name_lines.js` (`tools/elevenlabs/build_name_lines.py` 가 녹음 대본에서 만든다. 녹음 값은 지금 클립 이름(md5)과 대조해 확인한 것 그대로). 녹음을 다시 하면 다시 만들고 `version` 이 바뀐다.
- `names`: `{ A, B, C, D, A_en, B_en, C_en, D_en }` 중 아무거나. 한국어는 완성형 한글 1~4자, 영어는 영문자 1~12자. 빈 글·없는 자리는 원래 이름. 다른 키가 있으면 `bad_request`.

### 횟수
- **첫 설정(kind `first`)**: 전체 구매(`owned`)에 **동화마다 1번씩** 포함. `POST /v1/name/run { tale }` 이 그 동화를 `first` 에 넣는다(실행을 만들 때 쓴다 — 줄 받기가 실패해도 돌려주지 않는다). 이름이든 주인공 모습이든 한 번의 설정으로 센다(모습만 바꾸기는 따로 없음). 새 동화가 추가되면 그 동화의 첫 설정이 새로 생긴다(보충 규칙 없음).
- **이용권(kind `ticket`)**: 0.99 이용권(`com.papertale.theater.rename`, 소모성) **1장 = 네 편 + home 을 48시간 한 번에** 다시. `POST /v1/name/run { ticket: true }` 이 `tickets` 를 1 줄인다. `tickets` 는 **남은 장수**다(영수증이 +1).
- 이미 도는 이용권 실행(48시간)이 있으면 `{ ticket: true }`·`{ tale }` 는 그 실행을 `resumed: true` 로 이어 주고 이용권도 첫 설정도 쓰지 않는다. 첫 설정이 이미 쓰인 동화의 `{ tale }` 는 그 동화의 첫 설정 실행이 살아 있으면 이어 주고, 아니면 402 `no_credit`.
- 진행 중인 실행은 계정당 하나. 첫 설정 실행이 도는 중에 다른 동화의 첫 설정을 하면 **같은 실행 id 에 동화를 보탠다**(앞 동화의 줄 받기가 끊기지 않음, 만료는 다시 48시간). 그 밖의 새 실행은 옛 실행 id 를 `run_invalid` 로 만든다. 실행은 48시간 유효.
- 옛 기록(1판의 `used`·`covered`)은 서버가 읽을 때 옮긴다: 생성을 한 번이라도 했으면 `first = covered`(이미 받은 동화는 첫 설정을 쓴 것), 이용권은 산 누계에서 포함분 1회를 뺀 쓴 횟수를 뺀 남은 장수. 안 했으면 모든 동화가 무료 첫 설정. 다음 기록 때 옛 필드는 없어진다.
- 실행 안에서 한 줄·한 언어는 2번까지 만들 수 있다(실패한 요청은 세지 않음) → 실행당 상한 = 줄 수 × 언어 수 × 2.
- 미리 듣기: 계정당 하루(UTC) 10회, 첫 설정·이용권과 별개.
- 서버 전체 하루 상한: 실행을 만들 때 그 실행의 줄 수(동화 줄 합)만큼, 미리 듣기마다 1씩 잡는다. `NAME_DAILY_LINE_CAP`(기본 30000)를 넘으면 `busy`.

| 메서드·경로 | 조건 | 요청 | 응답 |
|---|---|---|---|
| `GET /v1/name/catalog` | 인증만(구매 불필요) | - | `{ version, slots: {A:{ko,en},B,C,D}, originalLook: {A:'g',B:'b',C:'b'}, tales: { <taleId>: { lines: [ { id, key, keyEn, tpl, en, tplEn, mode, seg, segEn, langs, g } ] } } }` |
| `GET /v1/name/quota` | 인증 | - | `{ owned, first: [taleId], firstLeft: [taleId], tickets, activeRun: { runId, tales, kind, expiresAt } \| null, previewsLeftToday }` |
| `POST /v1/name/run` | owned | `{ tale: "<taleId>" }` | `{ runId, tales: [taleId] (witch_candy 는 + 'home'), kind: 'first', expiresAt }` — 무료 첫 설정(동화마다 1번) |
| `POST /v1/name/run` | owned + tickets ≥ 1 | `{ ticket: true }` | `{ runId, tales: [kkultteok, red_car, unicorn, witch_candy, home], kind: 'ticket', expiresAt }` — 이용권 1장 소모. 도는 중이면 `resumed: true` 로 같은 실행 |
| `POST /v1/name/line` | 실행 범위 안 | `{ runId, tale, id, lang: "ko"\|"en", names, look? }` | `audio/mpeg` 바이트, 헤더 `X-Name-Version` |
| `POST /v1/name/line` | owned | `{ preview: true, tale, id, lang, names, look? }` | 미리 듣기 mp3 |
| `POST /v1/name/check` | 인증 | `{ names, look? }` | `{ ok, errors: { A: "banned"\|"invalid", look: "invalid", … } }` — 형식·금칙어(`server/src/banned_names.js`), 저장 없음 |
| `POST /v1/receipt/apple` | 인증 | 이용권 JWS | 이용권이면 `{ owned, state, quota }` (같은 계정이 같은 거래를 다시 보내면 `duplicate: true` 로 횟수 그대로) |
| `POST /v1/receipt/google` | 인증 | `{ purchaseToken, productId: "com.papertale.theater.rename" }` | 같음(앱이 구매를 consume 한다) |

- 카탈로그 줄: `key` = 녹음 맵 열쇠(한국어 원문, `NARRATION_CLIPS[key]`·`NARRATION_CLIPS_EN[keyEn]`). `keyEn` 은 동화에서는 `key` 와 같고, `home`(스티커 이름 3줄)만 영어 글(`NARRATION_CLIPS_EN` 이 영어 글을 열쇠로 쓴다). `tpl`·`tplEn` 은 화면 글 템플릿, `en` 은 영어 원문.
- `mode`: `both`(놀이·읽어 주기 같은 클립) / `play` / `read` / `home`. 놀이와 읽어 주기에서 같은 열쇠가 다른 클립을 쓰는 줄은 없다(2026-11-06 확인).
- `seg`·`segEn`: 녹음 맵 값이 클립 배열(여러 배역이 이어 읽는 줄)이면 이름이 든 조각의 번호, 한 클립이면 `null`. 받은 mp3 는 그 번호 자리만 바꾼다(지금 구름 공장 5줄).
- `langs`: 그 언어 녹음에 이름이 들어 있는 언어. 영어에만 이름·대명사가 있는 줄이 있다(한국어 원문은 이름·성별 단어를 생략, `langs: ['en']`). 없는 언어로 `line` 을 부르면 `bad_request`.
- `g`(2판): 주인공 모습(look)에 따라 결과가 달라지는 자리 목록(예 `['A']`). 영어 `{A_g:…}` 대명사가 든 줄, 또는 모습별 목소리가 실제로 다른 줄. 비면 모습과 무관. 모습만 바뀐 앱은 `g` 가 있는 줄을 다시 받는다(실행 안에서만 만들 수 있다).
- 모습별 목소리(2판): 이름이 든 아이 대사(구름 공장 첫째 nuna=A·둘째 oppa=B·막내 agi=C 배역 줄)는 `look` 으로 그 아이의 모습에 맞는 목소리 id 로 만든다. 표는 `tools/elevenlabs/build_name_lines.py` 의 `LOOK_VOICE` 한 곳(지금은 모두 원래 목소리 — 목소리 id 를 정하면 표만 바꾸고 다시 만든다). 줄 데이터에는 `look: { slot, voices: { b, g } }` 로 들어가며, 앱에는 내보내지 않는다.
- 영어에서 영어 이름을 비우면 원래 녹음과 같은 발음 표기(예: 빨간 자동차의 `Ee-hyun`)로 만든다.
- 이용권 영수증: owned 가 아니면 403 `not_owned`. 거래 하나(애플 `transactionId`, 구글 `purchaseToken`)는 한 계정에 한 번만 인정하고, KV 에는 해시만 둔다(`rename:<sha256>`). 다른 계정이 같은 거래를 쓰면 `receipt_invalid`. 계정을 지워도 '쓴 거래' 표시는 남는다.
- 연결 코드로 계정을 합치면 `tickets` 는 더하고 `first` 는 합집합, 진행 중인 실행은 남는 계정 것을 쓴다.
- 오류: `not_owned`(403), `no_credit`(402, 첫 설정을 이미 쓴 동화·이용권 0장), `look_invalid`(400, look 값이 `b`·`g` 가 아님), `name_invalid`·`name_banned`(400), `run_invalid`(404 없음·바뀜·범위 밖 / 410 만료), `quota_exceeded`(429, 미리 듣기·줄 한도), `tts_failed`(502), `busy`(503). 이름 기능 요청 본문은 1KB 까지.
- ElevenLabs 호출: `POST https://api.elevenlabs.io/v1/text-to-speech/<voice>?output_format=mp3_44100_128&enable_logging=false`, 본문 `{ text, model_id, voice_settings }`(녹음 스크립트 gen_tale.py 와 같은 값). 요금제가 `enable_logging=false`(zero retention)를 거절하면 그 옵션만 빼고 다시 보낸다. 키는 Worker 비밀값 `ELEVENLABS_API_KEY`.
- 서버 녹음은 다듬기(polish.py: EQ·압축·-16 LUFS)를 거치지 않은 원본이다. 앱이 기기에서 맞춘다(기획 §5).
- KV 쓰기: 실행 만들기 2번(전체 하루 상한 + 계정 기록), 줄 하나마다 1번(줄 카운터 `nl:<runId>:…`, 실행 만료 뒤 사라짐), 미리 듣기마다 2번. 이름 줄을 받을 때는 계정 기록을 쓰지 않는다. 동화 한 편 첫 설정은 그 동화 줄 수만큼, 이용권 실행(네 편 한국어만 130줄)은 약 135번, 한·영 모두면 약 270번이다.
