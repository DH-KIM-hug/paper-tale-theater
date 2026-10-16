# 해님과 바람 배경 프롬프트 (가로 풀블리드, 5장)

## 사용법
1. ChatGPT 이미지 생성에서 프롬프트를 그대로 붙여넣고 크기는 **16:9 (1600x900)** 로 고릅니다.
2. 마음에 드는 한 장을 `assets/raw/bg_gpt/sun_wind/<이름>.png` 로 저장합니다(채팅으로 보내 주셔도 됩니다). 다시 뽑으면 `_v2`, `_v3`.
3. 둥근 창, 흰 종이판, 테두리 없이 화면 끝까지 꽉 채웁니다. 인물·동물·얼굴·글자는 넣지 않습니다. 아래쪽 3분의 1은 비워 두고(등장인물 자리), 중요한 물건은 가운데 60% 안에 둡니다.
4. 승인된 기준 화풍은 `assets/raw/bg_gpt/patjuk/scene_a_field.png` 입니다. 같은 종이 질감·색 층·그림자로 맞춥니다.

## 1. 구름 위 하늘 (`sky`)

파일명: `assets/raw/bg_gpt/sun_wind/sky.png`
코드가 얹는 것: 해님과 바람이 마주 선 높은 하늘. 구름은 그림 속 종이라 코드가 따로 흘리지 않음.

```
Hand-cut layered paper art, stop-motion paper diorama style (like Margaret Scrinkl). Full-bleed 16:9 landscape, edge to edge, no frame, no border, no round window, no white sheet. High sky above a sea of clouds: a pale blue sky sheet fading to soft yellow at the horizon, a sea of rounded scalloped white-gray paper clouds filling the bottom half in layered rows, a few small white paper clouds with shadows floating in the upper sky, soft green hills peeking at the far left and right edges. Flat layered paper sheets, crisp cut edges, max two tones per shape, fine paper grain, soft drop shadows from the upper-left, 4-6 depth layers. Lower third is open ground where characters will stand, no props there; key objects within the central 60% of the width. No people, no animals, no faces on objects, no text. Negative: round window, white sheet, frame, border, vignette, torn edges, painterly, gradients, 3D render, glossy, photoreal, text, characters, faces on objects.
```

## 2. 높은 곳에서 본 들길 (`high`)

파일명: `assets/raw/bg_gpt/sun_wind/high.png`
코드가 얹는 것: 높은 시점(위에서 내려다봄). 구불구불한 모랫길이 아래에서 위로 가운데를 지나가고, 나그네는 길 위를 걸어감.

```
Hand-cut layered paper art, stop-motion paper diorama style (like Margaret Scrinkl). Full-bleed 16:9 landscape, edge to edge, no frame, no border, no round window, no white sheet. High bird's-eye view looking straight down at a green countryside: a winding beige dirt path running from bottom center up to top center, sage-green flat fields on both sides, a few round scalloped bushes, one small cream house with a golden roof at right, white paper clouds at the upper corners. Flat layered paper sheets, crisp cut edges, max two tones per shape, fine paper grain, soft drop shadows from the upper-left, 4-6 depth layers. Lower third is open ground where characters will stand, no props there; key objects within the central 60% of the width. No people, no animals, no faces on objects, no text. Negative: round window, white sheet, frame, border, vignette, torn edges, painterly, gradients, 3D render, glossy, photoreal, text, characters, faces on objects.
```

## 3. 들길 (`field`)

파일명: `assets/raw/bg_gpt/sun_wind/field.png`
코드가 얹는 것: 나그네가 서는 모랫길. 왼쪽에 둥근 나무 한 그루, 멀리 강과 언덕, 따뜻한 하늘빛 층. 눈 오는 날은 snow로 바꿔 끼움.

```
Hand-cut layered paper art, stop-motion paper diorama style (like Margaret Scrinkl). Full-bleed 16:9 landscape, edge to edge, no frame, no border, no round window, no white sheet. Countryside road: a pale blue sky fading to soft yellow, a long soft brown hill ridge, a strip of blue river and flat meadow bands in the middle distance, one round scalloped-leaf tree at left, grass tufts and dark green furrowed bushes at the lower left and right corners, a wide empty sandy road center foreground. Flat layered paper sheets, crisp cut edges, max two tones per shape, fine paper grain, soft drop shadows from the upper-left, 4-6 depth layers. Lower third is open ground where characters will stand, no props there; key objects within the central 60% of the width. No people, no animals, no faces on objects, no text. Negative: round window, white sheet, frame, border, vignette, torn edges, painterly, gradients, 3D render, glossy, photoreal, text, characters, faces on objects.
```

## 4. 개울가 (`stream`)

파일명: `assets/raw/bg_gpt/sun_wind/stream.png`
코드가 얹는 것: 왼쪽에 회색 바위(윗면 y≈300), 오른쪽 풀밭에 외투를 개어 둠. 앞에 개울.

```
Hand-cut layered paper art, stop-motion paper diorama style (like Margaret Scrinkl). Full-bleed 16:9 landscape, edge to edge, no frame, no border, no round window, no white sheet. Quiet brookside: layered green scalloped hills rising on both sides under a soft yellow-blue sky, a big smooth gray boulder at left on the bank, orange paper flowers and tall grass at both edges, a wide teal stream in front with pale white ripple shapes, brown muddy bank edge. Flat layered paper sheets, crisp cut edges, max two tones per shape, fine paper grain, soft drop shadows from the upper-left, 4-6 depth layers. Lower third is open ground where characters will stand, no props there; key objects within the central 60% of the width. No people, no animals, no faces on objects, no text. Negative: round window, white sheet, frame, border, vignette, torn edges, painterly, gradients, 3D render, glossy, photoreal, text, characters, faces on objects.
```

## 5. 눈 오는 날 (`snow`)

파일명: `assets/raw/bg_gpt/sun_wind/snow.png`
코드가 얹는 것: 나그네가 서는 흰 눈 언덕. 소나무는 양쪽 가장자리, 눈송이는 하늘에 흩날림.

```
Hand-cut layered paper art, stop-motion paper diorama style (like Margaret Scrinkl). Full-bleed 16:9 landscape, edge to edge, no frame, no border, no round window, no white sheet. Snowy day: a very pale ice-blue sky sheet with scattered round white paper snowflakes with soft shadows, layered pale blue-white hills behind, a smooth white snow hill sheet filling the lower half, two snow-laden pine trees with brown trunks at far left and far right edges. Cold, bright, mostly white and ice blue. Flat layered paper sheets, crisp cut edges, max two tones per shape, fine paper grain, soft drop shadows from the upper-left, 4-6 depth layers. Lower third is open snowy ground where characters will stand, no props there; key objects within the central 60% of the width. No people, no animals, no faces on objects, no text. Negative: round window, white sheet, frame, border, vignette, torn edges, painterly, gradients, 3D render, glossy, photoreal, text, characters, faces on objects.
```
