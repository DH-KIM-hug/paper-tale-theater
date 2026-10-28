# 톡톡 동화극장 — C 종이 극장 아이덴티티

기존 생성 C안의 방향을 바탕으로 비례·색·조각 수를 직접 정리한 SVG 원본이다. 새 이미지 생성 결과를 추가로 채택하거나 기존 비트맵을 자동 추적하지 않았다. 심볼은 별·언덕·커튼을 공유하는 단일 벡터 구조다. 아이콘에서는 팥색 바탕을 끝까지 채우고, 마크에서는 같은 구조의 바깥을 투명하게 둔다.

## 디자인

- 커튼 상단: 굵은 세 조각. 양옆은 두 번의 큰 굴곡.
- 구리 별: 무대 가운데 크게 배치. 초록 언덕과 함께 아이콘·마크에 모두 유지.
- 팥색 `#A93B32`, 골드 `#D9A94E`, 솔잎 `#3F6B4F`, 구리 `#C98A5B`, 크림 `#F6ECD8`, 조명 앰버 `#F2B366`.
- 글자: 감빛 `#D9622F` / 남색 `#222B45`. 프로젝트 기존 Pretendard Variable 750을 사용해 자간·비례를 정하고 윤곽선으로 변환했다. 독자적으로 그린 한글 글꼴이라고 주장하지 않는다.
- 얕은 레이어 그림자만 사용한다. 내부 밝기 변화는 무대 뒤 조명에만 둔다.
- 16·32px는 종이결·그림자를 없애고 무대 빛을 평면 크림으로, 별을 조금 더 크게 만든 별도 버전이다.

## 원본과 실행 파일

| 역할 | 벡터 원본 | PNG |
|---|---|---|
| 앱 아이콘 | `theatre-icon.svg` | `theatre-icon.png` |
| 앱 안 투명 마크 | `theatre-mark.svg` | `theatre-mark.png` |
| 작은 아이콘 | `theatre-icon-small.svg` | `theatre-icon-small.png` |
| 작은 마크 | `theatre-mark-small.svg` | `theatre-mark-small.png` |
| 세로 조합 로고 | `theatre-logo.svg` | `theatre-logo.png` |
| 글자 조합 | `theatre-wordmark.svg` | `theatre-wordmark.png` |

SVG는 외부 이미지·글꼴을 참조하지 않는다. PNG는 Chrome canvas에서 SVG를 투명 배경으로 렌더했다.

앱 실행 파일은 `assets/v3w/sp_logo_theatre_v1.webp`, `assets/ui/logo_mark.webp`와 `assets/icons/`의 1024·512·192·180·32·16px PNG다. 1024 앱 아이콘은 알파가 없는 RGB 정사각형이며 OS용 둥근 모서리를 미리 넣지 않았다. 16·32px는 소형 벡터에서 각각 렌더 크기를 맞춰 출력한다. 원본과 실행 파일의 비례는 유지한다. iOS의 1024 아이콘과 Android의 각 밀도별 일반·원형 런처 PNG도 같은 원본에서 출력한다. 네이티브 앱 자체 빌드·설치·배포는 하지 않았다.

이전 문 아이콘과 책 마크는 `archive/`에 보관한다. 이전 생성 시안은 `assets/raw/logo_gpt/`에 그대로 남긴다. 비교 페이지의 이전 문 아이콘은 보관본을 참조한다.

## 사용

브랜드 페이지: `docs/brand/index.html`. 비교 페이지: `docs/brand/compare/index.html`.

마크와 워드마크의 비례를 유지하고, 로고 주변에는 마크 폭의 1/4 이상 여백을 둔다. 밝은 배경에서는 남색 글자를 사용한다. 어두운 배경의 전체 로고 버전은 별도 제작 전까지 사용하지 않고 심볼만 쓴다. 홈의 기존 텍스트 제목은 유지하며 옆 마크만 동일한 극장으로 통일한다.

## 재생성

프로젝트 루트에서 Python에 fonttools·brotli·Pillow, Node에 Playwright, Chrome을 준비한 뒤 실행한다.

```sh
python3 tools/brand/build_identity.py
node tools/brand/render_identity.cjs
python3 tools/brand/export_identity.py
```

`NODE_PATH`가 필요한 환경에서는 설치된 Playwright 경로를 지정한다. 글자 원본은 프로젝트의 `assets/fonts/PretendardVariable.woff2`이며 글꼴 사용 조건은 함께 보관한 `assets/fonts/Pretendard-LICENSE.txt`를 따른다. 공식 출처: https://github.com/orioncactus/pretendard/blob/main/LICENSE
