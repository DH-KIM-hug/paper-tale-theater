# C2 마크 배경 제거 파생본

도구: 내장 image_gen 편집. CLI/API는 사용하지 않았다.
입력: `assets/raw/logo_gpt/logo_C2_mark.png`.
출력: `assets/brand/c2-mark.png`.
아이콘 원본은 생성 편집하지 않았다. 마크는 배경 제거를 요청한 생성 편집 결과이며 원본 픽셀과 완전히 동일한 기계적 크로마키라고 주장하지 않는다.

```text
Use case: background-extraction. Edit target: the attached existing finished C2 logo mark. Remove ONLY the solid magenta/pink chroma-key background OUTSIDE the arched paper emblem, making that outside area truly transparent. Preserve the emblem exactly: navy paper night sky, round suspended cream moon and its hanging string, four gold stars, red curtain at left with gold tie, orange/gold stage edge at bottom, all existing textures, shapes, positions, lighting, colors and proportions. Do NOT redesign, redraw, simplify, relight, recolor, move or add any element. Keep the navy arch as a single opaque backdrop INSIDE the emblem. Keep its clean rounded top and flat bottom silhouette. Remove magenta edge spill, do not remove red curtain pixels. Output the original complete emblem as an RGBA PNG on actual transparent background, no shadow outside the silhouette, no new text.
```
