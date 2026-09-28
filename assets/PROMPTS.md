# Qwen 이미지 생성 가이드 — 팥죽할멈과 호랑이 에셋

SVG 한계를 넘기 위해 배경·캐릭터를 AI 생성 이미지로 교체하기 위한 프롬프트 모음.
생성한 파일을 `assets/raw/` 에 아래 파일명으로 저장해 주면, 배경 제거·정렬·게임 통합은 코드에서 처리한다.

## 공통 스타일 (모든 프롬프트 끝에 붙이기)

```
layered paper-cut art, handmade papercraft diorama, cut cardstock with visible
paper thickness and soft drop shadows between layers, subtle paper grain texture,
Korean folk-tale picture book style, night indigo / lavender / warm amber palette,
soft glowing backlight, highly detailed, no text, no watermark
```

캐릭터는 추가로: `isolated on plain solid lime green background (#00FF00), full body, single character`
(배경키 제거를 코드로 하기 위함. Qwen 앱의 배경제거 기능을 쓸 수 있으면 투명 PNG가 더 좋음)

## 배경 레이어 (가로 16:9 또는 2000×1120)

| 파일명 | 프롬프트 핵심 |
|---|---|
| `sky.png` | winter night sky with a huge glowing full moon on the upper right, halo of warm light, scattered paper-cut stars, farthest lavender mountain ridge silhouette backlit by moonlight, gentle snowfall |
| `mid.png` | two overlapping indigo paper mountain ridges with pine tree silhouettes, light seeping from behind each ridge edge, bumpy scalloped paper clouds floating, (하늘 부분은 비워달라고: upper half empty/transparent) |
| `house.png` | cross-section of a traditional Korean thatched cottage (초가집) at night: on the LEFT an earthen fireplace (아궁이) with a big black iron cauldron and glowing fire, next to it a dark clay water jar (물독), warm cream interior wall with a small folk painting frame, hanging gourds and an oil lamp shelf, on the RIGHT a glowing paper lattice door (창호문), beyond it a small yard with onggi jars, a low stone wall (돌담), a stylized Korean folk-art pine tree with orange foliage, and a small blue river at the far right edge — wide 무대 배치 유지가 중요 |
| `fg.png` | foreground framing elements only: rust-coral bare branches reaching in from top corners, three overlapping rounded paper mounds along the bottom (rust, deep teal, dark plum), big soft snowflakes, center completely empty |
| `frame.png` | ornate aperture frame made of 4 concentric wavy hand-cut paper rings (cream, dusty rose, deep teal, ink black) around a large empty rectangular window, plum-blossom branch and paper snowflake decorations resting on the rings, center completely empty/transparent |
| `curtain-l.png` / `curtain-r.png` | left/right half of a red puppet-theater curtain, deep folds with highlights, gold fringe at the bottom edge, paper-cut texture |
| `valance.png` | theater valance: three swagged red drapes across the top with gold trim and tassels, paper-cut style, below is empty |

## 캐릭터 (정사각 1024, 전신, 좌측을 바라보는 옆모습 권장)

| 파일명 | 프롬프트 핵심 |
|---|---|
| `tiger.png` | big round friendly Korean folk-tale tiger (까치호랑이 느낌), orange with dark stripes, cream belly, cute mischievous face, side view facing LEFT, standing on four legs |
| `granny.png` | tiny cute Korean grandmother in hanbok (white jeogori, dusty blue chima), grey hair bun, warm smile, holding a wooden porridge ladle |
| `bam.png` | cute chestnut character with a happy face, tiny sprout on top |
| `jara.png` | cute soft-shell turtle character, green shell, friendly face, side view |
| `ddong.png` | cute cow-dung pile character with a sheepish smile and a tiny flower on top (아이들 눈높이의 귀여운 응가 캐릭터) |
| `songgot.png` | cute awl character: round wooden handle with a face, shiny needle point below |
| `jeolgu.png` | cute stone mortar character with a wooden pestle, friendly face |
| `myeongseok.png` | cute rolled straw mat character, woven texture, spiral end, sleepy smile |
| `jige.png` | cute Korean A-frame wooden carrier (지게) character with straw pad, cheerful face |
| `rolled.png` | the tiger rolled up inside a straw mat, only dizzy face and feet sticking out, comical |

## 생성 팁

- 한 번에 4장씩 뽑아 가장 스타일이 일치하는 것을 고르고, 이후 프롬프트에 "same style as previous" 유지.
- 배경 레이어는 색만 맞으면 되므로 관대하게, 캐릭터는 표정·방향(왼쪽 보기)이 중요.
- DashScope API 키가 있으면 알려주면 생성부터 자동화 가능.
