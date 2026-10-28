# 톡톡 동화극장 — 로고 스플래시

앱과 미리보기가 같은 `engine/splash/scene.js`를 사용하는 실시간 Three.js 스플래시다. 현재 마지막 화면은 **C2 무대 위 달 심볼 + 한글 워드마크를 결합한 독립 로고**만 표시한다. 기존 붓 레터링과 임시 책 아이콘은 사용하지 않는다.

- [앱 시작 화면](http://localhost:8879/?splash=1)
- [타임라인 미리보기](http://localhost:8879/docs/intro-three/)
- [로고·사용 안내·다운로드](http://localhost:8879/docs/brand/)

루트에서 `python3 -m http.server 8879`로 실행한다. Three.js와 모든 실행 애셋은 로컬 파일이다.

## 연출 — 7.4초

| 시간 | 장면 |
|---|---|
| 0–1.4초 | 하나의 종이 잔디 무대와 나무·수풀이 짧게 내려앉음 |
| 0.9–2.6초 | 토끼가 들어와 거북이와 마주 봄 |
| 2.45–2.95초 | 토끼·거북이가 양옆 수풀 쪽으로 퇴장하고 나무가 빠짐. 잔디·수풀은 유지 |
| 2.95–3.7초 | 성은 고정된 배경 위치에서 드러나고, 작은 공주들이 서로 다른 시점에 좌우에서 입장 |
| 3.7–4.45초 | 약간씩 다른 크기·깊이의 인물이 멈춰 인사. 발밑 접촉 그림자 유지 |
| 4.45–5.1초 | 하단의 작은 무대로 정리되고 토끼·거북이가 양옆에 먼저 자리 잡음 |
| 5.15–5.95초 | 정리된 무대 위에 로고가 드러나 함께 보임 |
| 5.95–6.55초 | 동화 애셋만 사라지고 로고가 중앙으로 이동·확대 |
| 6.55–7.4초 | 로고 단독 유지 후 앱 홈으로 전환 |

로고는 사용자가 선택한 C2 ‘무대 위 달’ 마크와 한글 워드마크 조합이다. 남색 밤무대·매달린 달·빨간 커튼·금빛 별을 아이콘과 홈 마크에도 함께 사용한다. 한글은 사용자 제공 Pretendard 880/800 조합 PNG를 사용한다.

- 조합 SVG: `assets/brand/c2-logo-B-vertical-light.png`
- 투명 PNG: `assets/brand/c2-logo-B-vertical-light.png`
- 앱 실행용: `assets/v3w/sp_logo_c2_b_light_v1.webp`
- 선택 원본·배경 제거·재생성 기록: `assets/brand/README.md`

UV 좌표로 거의 투명한 바깥 여백을 제외한다. 정지 첫 화면과 움직임 줄이기 모드도 동일한 새 로고를 사용한다. 영문 설정은 Toki Toki Tale 영문 B-light 이미지(`assets/v3w/sp_logo_c2_en_b_light_v1.webp`)를 표시하고 한국어 로고를 다운로드하지 않는다.

## 앱 연결과 수명 관리

- 앱 모드의 세션 첫 진입에만 재생하며 일반 웹은 홈으로 바로 열린다. `?splash=1`은 강제 미리보기다.
- 화면 탭 또는 Enter·Space·Escape로 바로 건너뛴다. 소리는 없다.
- 움직임 줄이기는 Three.js를 다운로드하지 않고 정지 로고만 잠깐 표시한다.
- 모듈·애셋 실패, WebGL 컨텍스트 손실, 백그라운드 전환 시 홈으로 이동한다.
- 종료 시 타이머·이벤트·텍스처·형상·재질·렌더러를 해제한다.
- `npm run build:www`로 앱용 산출물에 반영한다. 네이티브 동기화·배포는 별도다.

## 렌더 준비와 애셋

재생 전에 텍스처 업로드·`compileAsync`·대표 장면 렌더·GPU fence를 완료한다. 초기 준비 중에도 건너뛰기가 가능하다. 렌더 크기는 최대 180만 픽셀, GPU 사본의 긴 변은 일반 컷아웃 768px·성 1024px·잔디와 로고 1536px로 제한한다.

- 공용 장면: `engine/splash/scene.js`
- 재생·접근성·정지 대체·해제: `engine/splash/start.js`
- 투명 여백 좌표: `engine/splash/art.js`
- 로컬 Three.js 0.180.0과 MIT 라이선스: `engine/splash/vendor/`
- 새 잔디 원본과 생성 기록: `assets/splash/sp_ground_meadow_v1.png`, `assets/splash/PROMPTS.md`
- 새 성 원본과 생성 기록: `assets/splash/sp_castle_v1.png`, `assets/splash/CASTLE_PROMPT.md`

이전 로고 시안은 원본 파일로만 보관한다. 실행에서는 불필요한 해·구름·꽃 장식을 다운로드하지 않는다. 기존 애셋의 사용 조건은 프로젝트 `COPYRIGHT.md`를 따른다.

## 검증과 참고 영상

`NODE_PATH=/tmp/patjuk-intro-render/node_modules node tools/dev/check_splash.cjs`로 건너뛰기·실제 재생 시간·세션 재진입·준비 중 종료·실패 대체·움직임 줄이기·일반 웹·영문·세로 화면·재생 중 새 셰이더/텍스처 발생 여부를 확인한다. Playwright와 Chrome이 필요하다.

`render.cjs`는 같은 장면의 222프레임을 1440×900, 30fps, 7.4초 무음 `opening-three.mp4`로 저장한다. Playwright·Chrome·ffmpeg가 필요하다. 앱은 이 동영상 파일을 다운로드하지 않는다.
