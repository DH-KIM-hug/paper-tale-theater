# 팥죽할멈과 호랑이

3~4세 유아용 전래동화 인터랙티브 웹 게임. 친구 7명(알밤→자라→쇠똥→송곳→절구→멍석→지게)을 원작 순서대로 눌러 호랑이를 물리친다.

## 실행

```bash
cd patjuk-game
python3 -m http.server 8765
# 브라우저에서 http://localhost:8765 열기
```

의존성·빌드 없음. `index.html`을 브라우저로 바로 열어도 동작한다(소리 포함).

## 규칙

- 인트로에서 친구들이 순서대로 찾아와 숨는 장면이 힌트다 (건너뛰기 가능).
- 순서가 맞으면 해당 친구가 호랑이를 혼내주는 애니메이션이 이어진다.
- 게임오버·목숨 없음. 틀리면 짧은 헛수고 연출 뒤 도와준다:
  - 1번째 실수: 장소 힌트 ("호랑이는 물독 앞에 있어요. 물독 속에 누가 숨었지?")
  - 2번째부터: 정답 카드가 반짝이며 들썩이고, 무대의 친구도 뛰며 이름을 알려준다
- 각 단계 내레이션이 다음 친구를 암시한다 (예: "호랑이가 아궁이 앞에 앉았어요" → 알밤).
- 대사 건너뛰기는 무대를 1초 길게 누를 때만 (아이의 톡톡 탭으로 힌트가 끊기지 않게).

## 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 마크업 + SVG 무대·캐릭터 (외부 이미지 없음) |
| `style.css` | 레이아웃, 카드 UI, keyframe 애니메이션 |
| `story.js` | 대사·친구 정의 등 이야기 데이터 |
| `audio.js` | 내레이션 재생(사전 녹음 mp3 → 브라우저 TTS → 말풍선 순 폴백) + Web Audio 합성 효과음 |
| `narration.js` | 대사 텍스트 → `audio/*.mp3` 매핑 매니페스트 |
| `audio/` | 신경망 TTS(edge-tts, ko-KR-SunHiNeural)로 사전 녹음한 내레이션 38개 |
| `game.js` | 상태머신, 장면 시퀀서, 정답/오답 연출 |

개발 확인용: `index.html#stage` 로 열면 타이틀 없이 무대가 바로 표시된다 (`#stage-zoom`은 줌 구도 확인).

## 내레이션 재녹음

`story.js`의 대사를 바꾸면 다시 생성해야 한다:

```bash
python3 -m venv venv && venv/bin/pip install edge-tts
# 대사 추출 → lines.json (story.js의 INTRO/PROMPTS/LINES/FRIENDS 전체)
# edge_tts.Communicate(text, 'ko-KR-SunHiNeural', rate='-10%').save(...) 로
# audio/nXX.mp3 생성 후 narration.js 매니페스트 갱신
```

매니페스트에 없는 대사는 자동으로 브라우저 TTS로 폴백되므로, 재녹음 전에도 게임은 동작한다.
