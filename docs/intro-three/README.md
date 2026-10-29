# 톡톡 동화극장 — 로고 스플래시

앱과 미리보기가 같은 `engine/splash/scene.js`를 사용하는 실시간 Three.js 스플래시다. 「로고 안으로 들어갔다 나오기」: 로고의 아치 창 안으로 다가가 짧은 무대를 보고, 다시 같은 로고로 돌아온다.

- [앱 시작 화면](http://localhost:8879/?splash=1)
- [타임라인 미리보기](http://localhost:8879/docs/intro-three/)
- [로고·사용 안내·다운로드](http://localhost:8879/docs/brand/)

루트에서 `python3 -m http.server 8879`로 실행한다. Three.js와 모든 실행 애셋은 로컬 파일이다.

## 연출 — 6.35초

| 시간 | 장면 |
|---|---|
| 0–0.35초 | 로고(C2 무대 위 달 + 글자). 정지 첫 화면·iOS 실행 화면과 같은 크기·자리 |
| 0.35–1.05초 | 글자 판이 차례로 눕고 아치 창 안으로 다가간다 |
| 1–1.45초 | 달·별 그린 밤 하늘 막이 걷혀 올라가고, 줄에 매달린 해가 내려온다(아침) |
| 1.3–3.2초 | 들판·나무가 팝업처럼 일어서고 토끼·거북이가 지나간다 → 성이 일어서고 공주 셋이 들어온다 |
| 3.3–3.85초 | 해가 올라가고 밤 하늘 막이 다시 내려온다 |
| 4–4.35초 | 공주들은 옆으로 나가고 소품이 접혀 눕는다 |
| 4.45–5.15초 | 뒤로 빠져 처음과 같은 로고 |
| 5–5.62초 | 글자 '톡'·'톡'·'동화극장'이 차례로 일어선다 |
| 5.9–6.35초 | 아치가 홈 로고 마크 자리로 날아가며 홈이 드러난다 |

- 커튼은 로고처럼 왼쪽에 묶인 채 늘 맨 앞 층이다. 무대와 배우는 그 뒤에서 움직인다.
- 사라지는 것은 투명해지지 않고 걸어 나가거나 종이가 눕듯 접힌다. 로고 마크 그림 ↔ 무대 층은 확대·축소가 움직이는 동안 넘긴다.
- 효과음 24개(`CUES`, `sounds/sfx`). 일반 웹은 첫 접속 자동 재생이 막히면 소리 없이 지나간다.

## 앱 연결과 수명 관리

- 첫 화면에는 늘 재생한다: 앱을 켤 때, 웹 접속, 새로고침. 동화·잠자리 화면에서 홈으로 돌아올 때(링크·뒤로 가기)만 건너뛴다. `?splash=1`은 강제 미리보기, `?splash=0`은 끔이다.
- 화면 탭 또는 Enter·Space·Escape로 바로 건너뛴다.
- 움직임 줄이기는 Three.js를 다운로드하지 않고 정지 로고만 잠깐 표시한다.
- 모듈·애셋 실패, WebGL 컨텍스트 손실, 백그라운드 전환 시 홈으로 이동한다.
- 종료 시 타이머·이벤트·소리·텍스처·형상·재질·렌더러를 해제한다.
- `npm run build:www`로 앱용 산출물에 반영한다. iOS 실행 화면·웹뷰 바탕색은 `npm run sync` 뒤 Xcode 빌드에 들어간다.

## 파일

- 장면·효과음: `engine/splash/scene.js`, 재생·접근성·날아가기·해제: `engine/splash/start.js`
- 아치 윤곽·로고 자리표: `engine/splash/art2.js`, 그림 투명 여백: `engine/splash/art.js`
- 무대 층(낮 하늘·밤 하늘 막·바닥·묶인 커튼): `tools/brand/build_splash_stage.py`
- 큰 글자 조각: `tools/brand/build_splash_letters.py`, iOS 실행 화면: `tools/brand/build_launch_splash.py`
- 생성 그림 작업표: `tools/app/gen/mk_jobs_splash2.py`
- 로컬 Three.js 0.180.0과 MIT 라이선스: `engine/splash/vendor/`

## 검증과 참고 영상

`NODE_PATH=/tmp/patjuk-intro-render/node_modules node tools/dev/check_splash.cjs`로 건너뛰기·실제 재생 시간·새로고침 재생·동화에서 돌아오면 건너뜀·준비 중 종료·실패 대체·움직임 줄이기·일반 웹·영문·세로 화면·재생 중 새 셰이더/텍스처 발생 여부를 확인한다. Playwright와 Chrome이 필요하다.

`render.cjs`는 같은 장면을 1440×900, 30fps, 6.35초 무음 `opening-three.mp4`로 저장한다. Playwright·Chrome·ffmpeg가 필요하다. 앱은 이 동영상 파일을 다운로드하지 않는다.
