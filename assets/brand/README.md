# 톡톡 동화극장 — 선택 C2 「무대 위 달」

사용자가 새로 만든 C2를 선택했다. 이전 C 벡터 정리안은 보관하고 실행에서는 C2를 사용한다.

## 선택 원본

- 아이콘: `assets/raw/logo_gpt/logo_C2_icon.png` (1254×1254 RGB). `c2-icon.png`는 이 파일의 바이트 그대로인 보관 사본이다. 그림은 새로 그리거나 보정하지 않았고 전달용 아이콘에서 크기만 변환했다.
- 마크: `assets/raw/logo_gpt/logo_C2_mark.png` (마젠타 바탕 RGB). 원본을 보존하고 내장 image_gen으로 바깥 마젠타만 제거하도록 요청한 파생본을 `c2-mark.png`에 저장했다. 생성 편집 결과이므로 원본과 픽셀 동일한 기계적 크로마키 결과는 아니다. 배경 제거 프롬프트는 `C2_EXTRACTION_PROMPT.md`에 기록했다.

남색 밤무대, 줄에 매달린 크림 달, 빨간 커튼과 금빛 별, 아래 물결 무대 끝을 아이콘과 마크에 공통으로 유지한다.

## 조합 로고

`c2-logo.svg`는 C2 투명 마크 비트맵과 기존 Pretendard 750 기반 윤곽선 글자를 합친 SVG 조합본이다. 심볼을 벡터로 다시 그린 파일이 아니다. 글자는 감빛 `#D9622F` / 남색 `#222B45` 두 줄이며, 독자적으로 그린 글꼴이라고 주장하지 않는다. `c2-logo.png`는 이 조합본의 투명 렌더다.

- 아이콘 사본: `c2-icon.png`
- 투명 파생 마크: `c2-mark.png`
- 조합 원본·렌더: `c2-logo.svg`, `c2-logo.png`
- Android 원형 출력용 SVG·PNG: `c2-icon-round.svg`, `c2-icon-round.png`
- 활성 원본 경로: `identity.json`
- 스플래시 실행용: `assets/v3w/sp_logo_c2_v1.webp`
- 홈 마크: `assets/ui/logo_mark.webp`
- 앱·웹 아이콘: `assets/icons/app-icon-1024.png`, `favicon-{16,32,192,512}.png`, `apple-touch-icon.png`

16·32px는 사용자 선택 원본을 축소한 버전이며, 이전 C 벡터의 단순화 모양을 섞지 않았다. iOS의 1024 아이콘과 Android의 밀도별 일반·원형 런처 PNG도 같은 C2 원본에서 출력한다. 네이티브 앱 자체의 빌드·설치·배포는 하지 않았다.

## 사용·재생성

브랜드 페이지 `docs/brand/index.html`, 비교 페이지 `docs/brand/compare/index.html`. 이전 문 아이콘·책 마크와 C 벡터 시안은 비교·보관용이다.

프로젝트 루트에서 Python(Pillow)·Node(Playwright)·Chrome을 준비한 뒤 실행한다.

```sh
python3 tools/brand/build_c2_lockup.py
node tools/brand/render_c2.cjs
python3 tools/brand/export_identity.py
```

Playwright가 다른 경로에 설치되었다면 `NODE_PATH`를 지정한다. 원본 마크에서 배경을 제거하는 단계는 위 재생성 명령에 포함되지 않는다. `c2-mark.png` 파생본을 사용한다. 글자 윤곽선은 `theatre-wordmark.svg`에 보관하며 글꼴 출처와 사용 조건은 `assets/fonts/Pretendard-LICENSE.txt`를 따른다. 이전 C 벡터 재생성 기록은 `archive/C_IDENTITY.md`에 있다.
