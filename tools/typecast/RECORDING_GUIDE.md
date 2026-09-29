# 동화 녹음 가이드 (Typecast)

팥죽할멈(`tales/patjuk`)에 먼저 적용한 방식을 다른 동화에도 똑같이 적용한다.

## 무엇을 만드나
1. `tales/<tale>/voice_script.json`: 이 동화에서 말하는 **모든 문장**과 배역 나누기, 배역별 목소리.
2. `python3 tools/typecast/gen_tale.py <tale>` 실행. 결과물:
   - `audio/tc/<tale>/*.mp3`
   - `tales/<tale>/narration.js` (`NARRATION_CLIPS` + `VOICE_LINES`)
   - 이미 만든 클립은 건너뛰고, 안 쓰는 클립은 지운다.
   - 먼저 `--dry`로 글자 수를 확인한다.
3. `tales/<tale>/index.html`에서 `../../audio.js` **앞에** `<script src="narration.js"></script>`를 넣는다.
4. 동화 JS에 `T.director({...})` 한 번 (아래 참고).
5. (선택) 컷신이나 우스운 장면에 말풍선 없는 소리 대사를 넣는다: `AudioFX.voice(VOICE_LINES.key)`.

## 문장 모으기: 빠짐없이
- `NARRATION_CLIPS`의 키는 `Narrator.speak(text)`에 들어가는 문자열과 **글자 하나까지 같아야** 한다.
  - 다르면 브라우저 기계음으로 나온다. 목소리가 섞이면 실패다.
- 문장이 들어오는 곳:
  - `T.say(...)`
  - `T.choose/tap/mash/swipe/hold/free`의 prompt, help(`where`, `who`) 문자열 (엔진이 12초 뒤 다시 말해 줄 때도 `Narrator.speak`를 쓴다)
  - 엔진 `engine/tale.js` 안의 고정 문장도 확인한다.
- **동적 문장**(템플릿 문자열, `T.josa`, 무작위 숫자, 무작위 선택)은 나올 수 있는 경우를 **모두** 펼쳐서 넣는다.
  - 예: 해님달님 떡 개수 1~10.
  - 경우의 수가 너무 많으면 동화 코드의 문장을 몇 조각의 고정 문장으로 나눠 `say`를 여러 번 부르도록 바꿔도 된다. 뜻과 재미는 유지한다.
- **검증 필수:** 헤드리스 크롬으로 동화를 끝까지 자동 플레이하면서 `Narrator.speak`에 들어온 문장 중 `NARRATION_CLIPS`에 없는 것을 기록한다. 0개여야 한다.
  - 여러 번(무작위 분기 포함) 돌린다.
  - 정적 분석(grep)도 같이 한다.

## 배역과 목소리
- **고정:**
  - 내레이터 `nar` = 연화 `tc_600697fd8a8ea9b977284703`
  - 할머니 역 = 순이 `tc_60ad0841061ee28740ec2e1c`
  - 호랑이 = 학철 `tc_63a3d9d14b235ddd6541a78e`
- **사물, 작은 동물, 아이:** 아기 같은 어린이 목소리 (`age: child`, 한국 이름 목소리 우선).
  - 팥죽에서 쓴 목소리: 옥지 `tc_699d27b557c86e3f4249c051`, 우니 `tc_69c1f8e4f8842d80fbe7fa4f`, 호빈이 `tc_5ffda49bcba8f6d3d46fc447`, 채린이 `tc_5ffda44bcba8f6d3d46fc41f`, 하준 `tc_60db308484130840f23e6ca0`, 수아 `tc_6699eb5749dfac016c29445c`, 준우 `tc_6a98d65b0402016f616a7ac3`
- **그 밖의 배역:** API로 찾고 확인한 뒤 고른다.
  - 찾기: `GET https://api.typecast.ai/v1/voices/recommendations?query=...`
  - 확인: `GET /v3/voices/{id}` (나이, 성별, `ssfm-v30` 지원)
  - 헤더: `X-API-KEY: $(cat ~/.config/typecast/key)`와 `User-Agent: typecast-direct/1 curl typecast-integration/1 (source=api-docs; generated_by=claude-code)`
  - 한 동화 안에서 주요 배역끼리 목소리가 겹치지 않게 한다.
  - 한국어 발음이 자연스러운 한국 이름 목소리를 우선한다.
  - 큰 동물(황소, 사자, 곰 아빠)은 굵은 목소리, 작은 동물(생쥐, 아기 오리)은 어린이 목소리.
- **배역 이름**은 영어 소문자만 쓴다. 클립 파일 이름에서 배역을 읽기 때문이다 (`mom`, `ox`, `babybear`).
- **나누기:** 따옴표 안 대사는 그 인물, 나머지는 `nar`.
- **감정:** 기본은 `smart`(앞뒤 문맥으로 알아서). 확실할 때만 `happy/sad/angry/whisper/toneup/tonedown`.
- **키와 크레딧:**
  - API 키는 `~/.config/typecast/key`에만 둔다. 절대 파일에 적거나 커밋하지 않는다.
  - Lite 플랜, 월 200,000자. 동시 요청은 5개까지이니 병렬로 여러 개 돌리지 않는다.

## 대사 연출 `T.director` (engine/tale.js에 이미 있음)
```js
T.director({
  cast: { mom: momActor, ox: () => currentOx },   // 배역 → actor (장면마다 새로 만들면 함수로)
  listener: (role, last) => role === 'mom' ? 'baby' : 'mom',  // 누구에게 말하나
  noFace: ['sun'],                                // 뒤집으면 이상한 배우 (정면 그림, 글자가 있는 그림 등)
});
```
- 배역 대사가 나오면 화자와 청자가 서로 마주 보고, 카메라가 둘을 잡는다(멀면 화자만). 내레이션이 나오면 원래 화면으로 돌아간다.
- `actor.face('right')`는 flip -1이다. 이 동화의 그림이 원래 어느 쪽을 보는지 확인한다.
  - 반대로 그려졌거나 뒤집으면 어색한 배우는 `noFace`에 넣는다.
  - 스크린숏으로 한 번 확인한다.
- 동화가 `T.camTo`로 카메라를 직접 움직이는 동안에는 연출이 끼어들지 않는다.

## 테스트 환경
- 저장소를 스크래치 폴더에 복사해서 테스트한다. 자기만의 폴더와 자기만의 포트(예: 88xx)를 쓴다.
  - 스크래치: `/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-patjuk-game/19dce74d-2160-44c0-a318-63a9c8c15039/scratchpad`
- 캡처 스크립트 예시: 스크래치의 `pj2cap.mjs`, `dirdriver.js`, `taledriver.js`.
  - 크롬: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new --remote-debugging-port=<고유포트>`
  - 크롬은 시작 후 5초 기다린다.
- ComfyUI 포트 8188은 절대 건드리지 않는다. 다른 크롬이나 파이썬 프로세스도 죽이지 않는다.

## 지킬 것
- **다른 에이전트가 동시에 같은 동화 JS를 고치고 있을 수 있다** (세로 화면 점검).
  - 동화 JS 수정은 꼭 필요한 곳만, 작게 한다: director 블록, 동적 문장 쪼개기, 컷 소리 대사.
  - Edit 전에 다시 읽고, 남의 변경을 되돌리지 않는다.
- `engine/`, `audio.js`, 다른 동화 폴더, 팥죽은 고치지 않는다. 엔진 수정이 필요하면 보고만 한다.
- git commit이나 push를 하지 않는다. 커밋은 메인 세션이 한다.
