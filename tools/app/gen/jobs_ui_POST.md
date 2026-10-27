# jobs_ui.json 실행·후처리 순서 (앱 UI 아이콘) — 2026-10-27

기획: docs/UI_ART_PLAN.md. 작업표: tools/app/gen/jobs_ui.json (64장, `batch` 1~6).

## 1. 생성 (묶음별, 한 번에 많이 요청하지 않는다)

```
# 묶음 1 기준 3장 먼저 → 사용자 확인 → 나머지 5장
python3 tools/app/gen/run_simple.py ui tab_tales star_one tab_night
python3 tools/app/gen/run_simple.py ui tab_stickers badge_lock badge_week badge_making star_plate
# 묶음 2~4 는 1시간 간격
python3 tools/app/gen/run_simple.py ui row_recent row_original row_princess row_aesop row_korean row_world
python3 tools/app/gen/run_simple.py ui ic_home ic_again ic_arrow ic_close ic_gear
python3 tools/app/gen/run_simple.py ui night_head empty_shelf empty_night empty_stickers
# 묶음 5(선택) tag_* 10장, 묶음 6 sticker_* 31장은 퍼즐 기획 확정 뒤
```

- `run_simple.py` 는 `jobs_ui.json` 의 `aspect` 를 그대로 쓴다(접시만 `landscape 3:2`, 나머지 `square 1:1`). `restyle.py` 는 kind 가 `sprite` 가 아니면 16:9 로 잡으므로 이 작업표에는 쓰지 않는다.
- pass 2 그림의 `refs`(`assets/raw/ui_gpt/tab_tales.png` 등)는 묶음 1 결과가 있어야 붙는다. 없으면 run_simple 이 refs 없이 보내므로 **묶음 1 을 끝내고 확인한 뒤** 다음 묶음을 돌린다.
- 결과: `assets/raw/ui_gpt/<id>.png` (보통 1024², 접시 1536×1024). 이미 있으면 건너뛴다(다시 뽑으려면 png 를 지운다).

## 2. 후처리 (그림마다)

1. **마젠타 키**: `~/.venvs/paper-tale/bin/python tools/gpu_night/chromakey.py assets/raw/ui_gpt/<id>.png <작업>/<id>_k.png 6`
   - 마젠타 배경은 자동 판정(왼쪽 위 픽셀). 트림 여백 6px.
   - `night_head`(kind `ui`, 불투명)는 키를 하지 않는다.
   - 오린 뒤 가장자리에 분홍 번짐이 남으면 프롬프트의 "NO magenta inside" 가 안 지켜진 것 → 다시 뽑는다.
2. **크기 맞춤**: `size` 로 맞춘다(PIL, LANCZOS, 투명 유지).
   - 정사각 아이콘(탭·딱지·줄 머리·단추·태그·스티커·빈 상태): 트림된 그림을 정사각 캔버스 가운데에 `contain` 으로 넣는다. 물체가 캔버스 폭의 **약 80%**(탭·빈 상태는 둥근 구멍에 들어가므로 **72%**, 지름 80% 원 안)가 되게 여백을 둔다. 같은 종류끼리(딱지 3장, 줄 머리 6장, 단추 5장) 물체 높이가 비슷해야 하므로 한 번에 나란히 놓고 비교한다(CLAUDE.md §4-1 크기 일관성).
   - `star_plate`: 1536×1024 → 키·트림 → 1024×640 캔버스 가운데(폭 90%).
   - `night_head`: 1024² 로 리사이즈만.
3. **webp**: `assets/ui/<id>.webp` (투명은 `quality=88, method=6`; `night_head` 는 86). 태그 10장은 `assets/icons/<key>.webp`(`tag_` 접두어를 뗀다).
4. **복사**: `row_week.webp` ← `badge_week.webp`, `row_all.webp` ← `tab_tales.webp`. 보호자 칩용 `assets/icons/{aesop,korean,world,original,princess}.webp` ← `row_*.webp`, `assets/icons/all.webp` ← `tab_tales.webp`.
5. **등록**: `assets/ui/ui.js` 의 `window.UI_ART = [...]` 에 이름을 넣는다(없는 이름은 코드가 요청하지 않는다). 태그는 `assets/icons/icons.js` 의 `window.ICONS` 에 key 를 넣는다. 코드에 아직 이름이 없는 `star_one`·`ic_home`·`ic_again`·`ic_arrow`·`ic_close`·`ic_gear` 는 home.js·tale.js 의 SVG 상수 자리에 `UIA.has()` 분기를 더해야 한다(UI_ART_PLAN §5-2, 코드 작업은 다음 단계).
6. **캐시**: `index.html` 의 `?v=` 를 올린다(메모 feedback-cache-version).
7. **확인**: 헤드리스 캡처 3종(1366×1024, 1024×1366, 390×844)에서 탭 선택/비선택(필터 새김) 양쪽, 딱지 28px, 접시 별 32px 이 읽히는지 본다. 비선택 탭에서 실루엣이 사라지면 그 탭 그림만 더 큰 덩어리로 다시 뽑는다.

이 단계용 스크립트(`post_ui.py`)는 아직 없다. `post_tale.py` 의 sprite 처리(chromakey → 리사이즈 → webp)를 본떠 다음 단계에서 만든다.
