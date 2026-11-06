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

## 이름 바꾸기 (2026-11-06, 기획 docs/NAME_CHANGE_PLAN.md)
창작 동화의 아이·강아지 이름을 보호자가 바꾸면, 이름이 든 대사를 서버가 ElevenLabs 로 줄 하나씩 새로 녹음해 mp3 로 돌려준다. **서버는 이름을 저장하지도 로그에 쓰지도 않는다**(요청 처리 중 메모리에만). KV 에는 숫자·동화 id·실행 id 만 둔다.

### 자리와 템플릿
- 자리 4개(네 편 공통): `A` 다현(여자아이), `B` 이현(남자아이), `C` 은우(막내), `D` 꿀떡(강아지, 원문 '꿀떡이' = 꿀떡 + 이). 영어 원래 이름 Dahyun·Ihyun·Eunwoo·Kkulddeok.
- 템플릿 문법: `{A}` 이름 그대로, `{A:X/Y}` 끝 글자 받침이 있으면 이름+X·없으면 이름+Y(예 `{A:이가/가}` → 다현이가·서아가, `{D:아/야}` → 콩아·초코야), ㄹ 받침 + `으로/로` 는 '로', `{A_en}` 영어 이름. 한글이 아닌 끝 글자는 받침 없음. 빠진 자리는 원래 이름.
- 함수: `engine/name_form.js`(앱, `window.NameForm`)와 `server/src/name_form.js`(서버) — `fill(tpl, names)`, `hasBatchim(name)`, `valid(name, lang)`, `slotsIn(tpl)`, `ORIGINAL`.
- 템플릿 원본: `server/src/name_lines.js` (`tools/elevenlabs/build_name_lines.py` 가 녹음 대본에서 만든다. 녹음 값은 지금 클립 이름(md5)과 대조해 확인한 것 그대로). 녹음을 다시 하면 다시 만들고 `version` 이 바뀐다.
- `names`: `{ A, B, C, D, A_en, B_en, C_en, D_en }` 중 아무거나. 한국어는 완성형 한글 1~4자, 영어는 영문자 1~12자. 빈 글·없는 자리는 원래 이름. 다른 키가 있으면 `bad_request`.

### 횟수
- 생성(run) 1회 = 이름 한 벌 전체. 전체 구매(`owned`)에 1회 포함, 그 뒤는 0.99 이용권(`com.papertale.theater.rename`, 소모성) 1장당 1회. `credits = (owned ? 1 : 0) + tickets − used`.
- 새 창작 동화 보충(`backfill`): 이용권 없이 동화당 1회. 조건: owned, 생성을 한 번 이상 함, 그 동화가 `covered` 에 없음. 이름이 같은지는 확인하지 않는다(이름·지문 저장 안 함).
- 진행 중인 실행은 계정당 하나. 새 실행(보충 포함)을 만들면 옛 실행 id 는 `run_invalid` 가 된다. 실행은 48시간 유효.
- 실행 안에서 한 줄·한 언어는 2번까지 만들 수 있다(실패한 요청은 세지 않음) → 실행당 상한 = 줄 수 × 언어 수 × 2.
- 미리 듣기: 계정당 하루(UTC) 10회, 생성 횟수·covered 와 별개.
- 서버 전체 하루 상한: 실행을 만들 때 그 실행의 줄 수만큼, 미리 듣기마다 1씩 잡는다. `NAME_DAILY_LINE_CAP`(기본 30000)를 넘으면 `busy`.

| 메서드·경로 | 조건 | 요청 | 응답 |
|---|---|---|---|
| `GET /v1/name/catalog` | 인증만(구매 불필요) | - | `{ version, slots: {A:{ko,en},B,C,D}, tales: { <taleId>: { lines: [ { id, key, keyEn, tpl, en, tplEn, mode, seg, segEn, langs } ] } } }` |
| `GET /v1/name/quota` | 인증 | - | `{ owned, credits, tickets, covered: [taleId], activeRun: { runId, tales, expiresAt } \| null, previewsLeftToday }` |
| `POST /v1/name/run` | owned | `{}` | `{ runId, tales: [kkultteok, red_car, unicorn, witch_candy, home], expiresAt }` — credits 1 소모 |
| `POST /v1/name/run` | owned + 위 보충 조건 | `{ backfill: "<taleId>" }` | `{ runId, tales: [taleId], expiresAt }` — 무료 |
| `POST /v1/name/line` | 실행 범위 안 | `{ runId, tale, id, lang: "ko"\|"en", names }` | `audio/mpeg` 바이트, 헤더 `X-Name-Version`. 성공하면 그 동화를 `covered` 에 넣는다 |
| `POST /v1/name/line` | owned | `{ preview: true, tale, id, lang, names }` | 미리 듣기 mp3 |
| `POST /v1/name/check` | 인증 | `{ names }` | `{ ok, errors: { A: "banned"\|"invalid", … } }` — 형식·금칙어(`server/src/banned_names.js`), 저장 없음 |
| `POST /v1/receipt/apple` | 인증 | 이용권 JWS | 이용권이면 `{ owned, state, quota }` (같은 계정이 같은 거래를 다시 보내면 `duplicate: true` 로 횟수 그대로) |
| `POST /v1/receipt/google` | 인증 | `{ purchaseToken, productId: "com.papertale.theater.rename" }` | 같음(앱이 구매를 consume 한다) |

- 카탈로그 줄: `key` = 녹음 맵 열쇠(한국어 원문, `NARRATION_CLIPS[key]`·`NARRATION_CLIPS_EN[keyEn]`). `keyEn` 은 동화에서는 `key` 와 같고, `home`(스티커 이름 3줄)만 영어 글(`NARRATION_CLIPS_EN` 이 영어 글을 열쇠로 쓴다). `tpl`·`tplEn` 은 화면 글 템플릿, `en` 은 영어 원문.
- `mode`: `both`(놀이·읽어 주기 같은 클립) / `play` / `read` / `home`. 놀이와 읽어 주기에서 같은 열쇠가 다른 클립을 쓰는 줄은 없다(2026-11-06 확인).
- `seg`·`segEn`: 녹음 맵 값이 클립 배열(여러 배역이 이어 읽는 줄)이면 이름이 든 조각의 번호, 한 클립이면 `null`. 받은 mp3 는 그 번호 자리만 바꾼다(지금 구름 공장 5줄).
- `langs`: 그 언어 녹음에 이름이 들어 있는 언어. 영어에만 이름이 있는 줄이 4개 있다(한국어 원문은 이름을 생략). 없는 언어로 `line` 을 부르면 `bad_request`.
- 영어에서 영어 이름을 비우면 원래 녹음과 같은 발음 표기(예: 빨간 자동차의 `Ee-hyun`)로 만든다.
- 이용권 영수증: owned 가 아니면 403 `not_owned`. 거래 하나(애플 `transactionId`, 구글 `purchaseToken`)는 한 계정에 한 번만 인정하고, KV 에는 해시만 둔다(`rename:<sha256>`). 다른 계정이 같은 거래를 쓰면 `receipt_invalid`. 계정을 지워도 '쓴 거래' 표시는 남는다.
- 연결 코드로 계정을 합치면 `used`·`tickets` 는 더하고 `covered` 는 합집합, 진행 중인 실행은 남는 계정 것을 쓴다.
- 오류: `not_owned`(403), `no_credit`(402, 보충 조건이 안 맞을 때도), `name_invalid`·`name_banned`(400), `run_invalid`(404 없음·바뀜·범위 밖 / 410 만료), `quota_exceeded`(429, 미리 듣기·줄 한도), `tts_failed`(502), `busy`(503). 이름 기능 요청 본문은 1KB 까지.
- ElevenLabs 호출: `POST https://api.elevenlabs.io/v1/text-to-speech/<voice>?output_format=mp3_44100_128&enable_logging=false`, 본문 `{ text, model_id, voice_settings }`(녹음 스크립트 gen_tale.py 와 같은 값). 요금제가 `enable_logging=false`(zero retention)를 거절하면 그 옵션만 빼고 다시 보낸다. 키는 Worker 비밀값 `ELEVENLABS_API_KEY`.
- 서버 녹음은 다듬기(polish.py: EQ·압축·-16 LUFS)를 거치지 않은 원본이다. 앱이 기기에서 맞춘다(기획 §5).
- KV 쓰기: 실행 만들기 2번, 줄 하나마다 1번(줄 카운터 `nl:<runId>:…`, 실행 만료 뒤 사라짐), 동화가 처음 covered 에 들 때 1번, 미리 듣기마다 2번. 한 벌 전체(한국어만 130줄)는 약 140번, 한·영 모두면 약 270번이다.
