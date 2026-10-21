# 개구리 왕자 — 제작 상세 사양 (SPEC, 2026-10-21)

기획 확정본은 `PLAN.md`(10장, 그림 형제 원작, 맨 아래 "확정 사항"이 최신). 이 문서는 그 기획을 **더 이상 판단 없이 코드로 옮길 수 있게** 장면마다 그림·좌표·크기·방향·조작·대사·효과음·타이밍을 적은 것이다. 참조 구현은 `tales/beauty_beast/beauty_beast.js`(**목업 자리표시**·`mk()`·`put()`·`sprite()`·`bgImage()`·HT 표), `tales/red_car/red_car.js`(`hitBox()`·`glow()`·`vo()`·preload 로 ASP 덮어쓰기), `tales/magpie/magpie.js`(고르기 `T.choose`·`director`), `tales/snow_white/snow_white.js` 355~380행(**세기: 톡 한 번 → 저절로 세기**). 모르는 것이 있으면 그 파일들에서 같은 이름의 코드를 찾아 그대로 따른다. 같은 이름의 다른 동화 `tales/frog/`(황소와 개구리)와 **아무 관련이 없다** — 그쪽 그림·코드를 가져오지 않는다.

확정 사항(PLAN 맨 아래 + 2026-10-21 사용자 규칙)을 이 문서에 반영한 것:
- 교훈은 대사로 말하지 않는다. PLAN 10장의 "약속은 지킬 때 빛나는 거야"는 **뺐다**. 교훈 문장은 부제와 끝 화면 글자(`run()` 반환값 `'한 약속은 지켜요.'`)로만 보인다. 7장 임금님의 "약속은 지켜야 한단다"는 원작 줄거리의 대사라 둔다.
- 배움 놀이 2개: 1장 모양 고르기(첫 조작, 시작 뒤 15초 안), 8장 빵 세기(톡 한 번, 하나·둘·셋은 **공주 목소리로만**, 글 말풍선·숫자 팝 없음). 톡 1번: 10장 손잡기(마지막 인사형 톡). 연타 없음, 줄거리 선택 없음.
- 6장 밀어내기는 손을 내미는 "그만" 자세(`prin_refuse`)뿐이고 개구리에 닿지 않는다. 9장 던지기는 세 그림(공주 던짐 → 개구리 날아감 → 개구리 놀람) 그대로, 벽에 닿지 않고 베개 위에 떨어지며, 아픈 표현(눈물·반창고·별)은 어디에도 없다.
- 왕자 옷에 초록 망토(개구리색) 유지.
- 그림 목록에서 PLAN 의 "모양 세 가지"(코드 종이 도형으로 대체), "물 파문"(코드), "마법 빛"(코드 플래시), "꽃잎"(코드)은 뺐다. "공주 서기"와 "공주 공놀이"는 둘 다 두되 공은 모두 코드 소품(`fp_prop_ball`)이고 손 그림에는 공이 없다. 식탁은 배경이 아니라 소품(`fp_prop_table`)이다(식탁 윗면 y 를 코드가 알아야 하므로).
- 도망·퇴장 인물은 가는 방향을 본다(5장 공주는 왼쪽으로 달리며 왼쪽을 본다, 6장 개구리는 오른쪽으로 들어오며 오른쪽을 본다, 7장 임금님은 오른쪽에서 들어와 왼쪽을 본다).
- 효과음 글자(`T.pop`)는 인물 얼굴을 가리지 않는 자리로 모두 §3 에 적었다(원칙: 머리 꼭대기보다 60 이상 위, 또는 옆으로 80 이상 비킴).

## 0. 만들 파일과 순서

| 순서 | 파일 | 만드는 방법 |
|---|---|---|
| 1 | `tools/app/gen/jobs_frog_prince.json` | **이미 있음**(35장: 스프라이트 22 + 배경 4 + 컷 4 + 키아트 5, 접두어 `fp_`). 그림 생성: `python3 tools/app/gen/run_simple.py frog_prince <id ...>` 를 `pass` 1 → 2 → 3 순으로(참고 그림이 먼저 있어야 함), 컷(`fp_cut_*`)은 `pass 3`(참고 스프라이트가 다 나온 뒤), 키아트(`key_*`)는 맨 뒤. 작업표가 이 순서로 정렬되어 있다. 한도에 걸리면 run_simple.py 가 풀리는 시각까지 기다렸다 이어 간다. 받은 그림 점검은 §10. |
| 2 | 후처리 | `~/.venvs/paper-tale/bin/python tools/app/gen/post_tale.py frog_prince` → `assets/v3w/fp_<id>.webp`(스프라이트는 마젠타 크로마키 → 여백 없이 오림 → 높이 600(폭 900) 안, 배경 1600×902). 끝에 ASP(폭/높이)가 `tales/frog_prince/ASP.txt` 에 나온다 → 코드 `ASP` 표에 붙인다. **그림이 아직 없어도 코드는 자리표시(§1-1)로 돈다.** |
| 3 | `tales/frog_prince/index.html` | `tales/beauty_beast/index.html` 그대로 복사, `<title>개구리 왕자</title>`, 마지막 스크립트 `frog_prince.js`. 합창 로더는 **넣지 않는다**(이 동화에 합창 없음). |
| 4 | `tales/frog_prince/narration.js` | Typecast 없음. `/* frog_prince — Typecast 없음. ElevenLabs(narration_el.js)가 채운다 */\nconst NARRATION_CLIPS = {};\nconst VOICE_LINES = {};` |
| 5 | `tales/frog_prince/narration_en.js` | `const NARRATION_CLIPS_EN = {}; const VOICE_LINES_EN = {}; const TEXT_EN = {…};` — `TEXT_EN` 은 `voice_script_en.json` 의 `"ui"` 를 그대로 JSON 으로 붙인다(미녀와 야수 `narration_en.js` 와 같은 모양). 영어 모드 화면에 한글이 남으면 안 된다(§11). |
| 6 | `tales/frog_prince/frog_prince.js` | 이 문서 §1~§6 대로 새로 쓴다. 그림이 없는 동안은 **자리표시 목업**으로 끝까지 돌아야 한다. |
| 7 | `tales/catalog.js` | §8 의 항목을 `red_car` 항목 뒤에 추가(`making: true`). |
| 8 | 녹음 | `python3 tools/elevenlabs/gen_tale.py frog_prince --model eleven_v4 --dry`(2026-10-21 확인: 한국어 2,841자, 영어 `--lang en` 4,124자, 건너뛸 줄 0) → `--dry` 빼고 생성 → `audio/el/frog_prince/*.mp3` + `narration_el.js`, 영어 `audio/el/frog_prince/en/` + `narration_el_en.js`. 녹음 뒤 `check_new.py` 되풀이 점검(§11). |
| 9 | 썸네일·키아트 | §9 (인물 그림이 다 나온 뒤). |
| 10 | 자동 재생 점검 | §11 체크리스트. |

커밋·푸시는 사용자가 요청할 때만 한다. 다른 동화 파일은 건드리지 않는다. `tales/kkultteok/`(가족 비공개편)의 그림·참고 사진은 **어떤 경로로도 쓰지 않는다**.

## 1. 코드 구조 (`frog_prince.js`, beauty_beast.js 를 거울처럼)

```js
/* 개구리 왕자 — 그림 형제 원작 그대로. 기획: tales/frog_prince/PLAN.md, 상세: SPEC.md (2026-10-21)
   배움 놀이 2개(1장 모양 고르기 · 8장 빵 세기), 톡 1번(10장 손잡기), 연타 없음, 줄거리 선택 없음. 교훈 대사 없음. 입맞춤 없음.
   크기: 사람(공주·임금·왕자)은 머리 크기가 같다(2.5등신, HT 표). 개구리는 공주 키의 0.39(앉은 높이 90), 금공 지름 48(≈ 공주 머리 폭 80 의 0.6).
   던지기: 개구리는 벽에 닿지 않고 베개 위에 떨어진다. 아픈 표현 없음. 소품은 얼굴 없음.
   세기: 하나·둘·셋은 공주 목소리(vo n1~n3)로만, 글 말풍선 없음.
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/fp_*.webp (목록 tools/app/gen/jobs_frog_prince.json) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { /* post_tale.py 출력(tales/frog_prince/ASP.txt). 그림이 오기 전엔 §2-1 의 시작값 */ };
  const HT  = { /* §2-2 */ };
  const NAT = { /* §2-3 */ };
  const FL = 505;                       // 바닥(발끝 y)
  const POND = { x: 660, surf: 420 };   // 2~5장 샘: 가운데 x, 물 윗선 y (받은 배경 fp_bg_pond 를 보고 ±20)
  const DOOR = { x: 130 };              // 6·7장 열린 문의 가운데 x (받은 배경 fp_bg_dining ±20)
  const BED  = { x: 760, top: 390 };    // 9장 침대: 베개 놓는 x, 매트리스 윗선 y (받은 배경 fp_bg_room ±20)
  const TABLE_TOP = FL - 140;           // 8장 식탁 윗면 y = FL - HT.fp_prop_table + 10 (받은 그림의 상판 두께를 보고 ±8)
  const BALL_UP  = [0, -272];           // prin_ball: 들어 올린 두 손 위 공 중심(공주 중심·발끝 기준). 받은 그림의 손 위치로 ±15
  const BALL_RUN = [22, -118];          // prin_run: 품에 안은 공 중심(오른쪽 볼 때). 왼쪽을 볼 때는 x 부호를 뒤집는다
  const HAND_PRIN = [58, -118];         // prin_hand: 내민 손끝(오른쪽 볼 때)
  const HAND_PRINCE = [60, -122];       // prince_hand: 내민 손끝(오른쪽 볼 때; 왼쪽 보면 x = -60)
  const BGS = ['fp_bg_yard', 'fp_bg_pond', 'fp_bg_dining', 'fp_bg_room'];
  const src = k => AS + k + '.webp';    // 배경·스프라이트 모두 파일 이름 전체(fp_…)로 부른다
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const artOK = {}, bgOK = {};          // preload 결과(그림이 실제로 있는지) — 없으면 자리표시
  function placeholder(T, parent, f, w, h) { … }   // §1-1
  function sprite(T, parent, f, x, y, w, h) { … }  // beauty_beast.js 117~122행 그대로(artSrc → src)
  const BGPH = { … };                   // §1-1 배경 자리표시 표
  function bgImage(T, key) { … }        // beauty_beast.js 124~133행 그대로(bgSrc → src, BGPH 키는 fp_… 전체 이름)
  function mk(T, poses) { … }           // beauty_beast.js 136~158행 그대로 (poses = { 이름: [그림, 높이] }, NAT 는 NAT[f])
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) { … }   // beauty_beast.js 그대로
  const hide, fadeIn, fadeOut, glow     // beauty_beast.js 그대로 (glow = hintGlow 필터 ms 동안)
  const sfx = (T, name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });
  function hitBox(T, a, w = 100, h = 100) { … }    // red_car.js 그대로(§5-1)
  function tapSpot(T, x, y, w, h) { … } // §5-2 보이지 않는 톡 자리(10장 손 사이)
  function shape(T, kind, x, y, size) { … }       // §5-3 종이 도형(동그라미·네모·세모)
  function ripple(T, x, y) { … }        // §5-4 물 파문
  function waterClip(T, a, surfY) { … } // §5-5 물 윗선 아래를 감추는 클립
  function arc(a, nx, ny, peak, ms) { … } // §5-6 포물선 이동(던지기·폴짝)
  async function hops(T, a, toX, n, ms) { … }     // §5-7 폴짝폴짝 여러 번
  function flash(T, x, y) { … }         // §5-8 마법 빛(크림 원 + 금별 8개)
  function petals(T) { … }              // §5-9 꽃잎
  async function run(T) { … }           // §3 장면 1~10
  Tale.mount({ title: '개구리 왕자', subtitle: '한 약속은 지켜요', run: T => run(Tale.api) });
})();
```

`run(T)` 머리 부분:

```js
const { sleep, camSnap, tr } = T;
const GAP = 700, SCENE_END = 1500;             // §2-7 속도 상수
const say = async text => { await T.say(text); await sleep(GAP); };
const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(하나·둘·셋)
const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
const X = (l, p) => (P ? p : l);
const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
AudioFX.preloadSfx(['boing', 'splash', 'splash_big', 'bubbles', 'knock', 'door', 'step_grass', 'step_wood', 'paper_up', 'paper_down', 'swish', 'sparkle', 'tada', 'chomp', 'pop']);
/* 그림 파일 미리 받기: 있으면 쓰고(artOK/bgOK), 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 (red_car.js 와 같다) */
const loads = [];
BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
await Promise.race([Promise.all(loads), sleep(4000)]);
// 배우 (자세 이름: [그림, 높이]) — 높이는 HT[그림]
const prin   = mk(T, { stand: ['fp_prin_stand', HT.fp_prin_stand], ball: ['fp_prin_ball', HT.fp_prin_ball], cry: ['fp_prin_cry', HT.fp_prin_cry], run: ['fp_prin_run', HT.fp_prin_run],
                       refuse: ['fp_prin_refuse', HT.fp_prin_refuse], sorry: ['fp_prin_sorry', HT.fp_prin_sorry], sit: ['fp_prin_sit', HT.fp_prin_sit], throw: ['fp_prin_throw', HT.fp_prin_throw], hand: ['fp_prin_hand', HT.fp_prin_hand] });
const frog   = mk(T, { sit: ['fp_frog_sit', HT.fp_frog_sit], ball: ['fp_frog_ball', HT.fp_frog_ball], hop: ['fp_frog_hop', HT.fp_frog_hop], fly: ['fp_frog_fly', HT.fp_frog_fly], surprise: ['fp_frog_surprise', HT.fp_frog_surprise] });
const king   = mk(T, { stand: ['fp_king_stand', HT.fp_king_stand] });
const prince = mk(T, { stand: ['fp_prince_stand', HT.fp_prince_stand], hand: ['fp_prince_hand', HT.fp_prince_hand] });
const ball = prop(T, 'fp_prop_ball', HT.fp_prop_ball), table = prop(T, 'fp_prop_table', HT.fp_prop_table), plate = prop(T, 'fp_prop_plate', HT.fp_prop_plate), pillow = prop(T, 'fp_prop_pillow', HT.fp_prop_pillow);
const breads = [0, 1, 2].map(() => prop(T, 'fp_prop_bread', HT.fp_prop_bread));
const ALL = [prin, frog, king, prince, ball, table, plate, pillow, ...breads];
ALL.forEach(hide);
T.director({ cast: { prin, frog, king, prince }, noFace: ['prin', 'frog', 'king', 'prince'] });
```

`T.director` 는 세로 화면에서만 말하는 배역에게 카메라를 붙인다(가로는 무대 전체가 보임). 방향은 장면에서 직접 정하므로 `noFace` 에 전부 넣는다. cast 키는 대본의 배역 키(`prin`·`frog`·`king`·`prince`)와 같아야 한다(`nar` 는 해설).

### 1-1. 자리표시(목업) 규칙 — 그림이 없을 때
`beauty_beast.js` 의 `placeholder()`·`sprite()`·`BGPH`·`bgImage()` 를 그대로 가져와 이 동화의 표로 바꾼다. 자리표시는 **그림과 같은 상자(w×h)** 안에 그리므로 그림이 생기면 코드 변경 없이 바뀐다. 이름표(`.phl`)는 뒤집혀도 글자가 뒤집히지 않게 `a.place` 를 덮어쓴 부분까지 같이 가져온다.

| 그림 | 자리표시 모양 | 색 |
|---|---|---|
| `fp_prin_*` | 큰 동그라미 머리(상자 폭의 .42, 머리 폭이 전체 높이의 .4 = 2.5등신) + 노란 사다리꼴 치마(아래가 넓음) + 금색 작은 삼각 왕관 3개 + 노란 머리 띠(한쪽 어깨로 내려온 땋은 머리 = 세로 긴 타원). `ball` 은 머리 위 양옆에 크림 타원 손 2개(공 없음), `cry` 는 얼굴 위에 크림 타원 2개(손), `run`·`throw`·`hand` 는 가로로 긴 상자에 팔 타원을 오른쪽으로, `refuse` 는 팔 타원을 왼쪽으로, `sorry` 는 머리를 상자 아래쪽에, `sit` 은 오른쪽에 갈색 의자 사각 | 얼굴 `#F3D9B8`, 머리카락 `#E9C46A`, 드레스 `#F2C94C`, 왕관 `#D9A94E`, 리본 `#A93B32` |
| `fp_frog_*` | 초록 타원 몸 + 위에 흰 원 눈 2개(검정 점) + 연두 배 타원. `ball` 은 몸 앞 아래에 금색 원(지름 = 상자 높이 ×.5), `hop`·`fly` 는 가로 긴 타원(`fly` 는 원), `surprise` 는 눈 원을 1.4배 | 몸 `#3F6B4F`, 배 `#9DBB7A`, 눈 `#F4F6FA`, 공 `#D9A94E` |
| `fp_king_stand` | 공주와 같은 머리 원 + 빨간 긴 사각 옷 + 회색 반원 수염 + 금 왕관 | 옷 `#A93B32`, 수염 `#BDB7AE` |
| `fp_prince_*` | 공주와 같은 머리 원 + 남색 사각 옷 + 뒤에 초록 사각 망토 + 갈색 머리 반원 + 금 왕관. `hand` 는 팔 타원을 오른쪽으로 | 옷 `#1F2A56`, 망토 `#3F6B4F`, 머리 `#6B4A32` |
| `fp_prop_ball` / `fp_prop_table` / `fp_prop_plate` / `fp_prop_bread` / `fp_prop_pillow` | 금색 원(왼쪽 위 크림 초승달) / 금색 긴 사각 + 크림 띠 + 갈색 다리 2 / 크림 납작 타원 + 빨간 테 / 금색 둥근 사각 + 갈색 윗조각 / 크림 둥근 사각 + 분홍 띠 | 팔레트 토큰. **얼굴 없음** |
| 배경 `fp_bg_*` | 평평한 종이 한 장 + 바닥 띠(y 412~) + 요소 2~3개 + 위에 "(그림 자리) 배경: 이름" 글자 | yard: 하늘 `#EEF3F7`·풀 `#9DBB7A`·왼쪽 크림 성(사각 2 + 금색 삼각 지붕)·오른쪽 나무(갈색 사각 + 초록 원) / pond: 하늘 `#EEF3F7`·풀 `#9DBB7A`·가운데 오른쪽 연파랑 타원(cx 660, cy 500, rx 215, ry 90, `#BFD8EE`)·왼쪽 회색 돌 원 3·양옆 위 초록 나무 / dining: 벽 `#F6ECD8`·바닥 `#6B4A32`·왼쪽 열린 문(갈색 사각 + 남색 사각 창)·가운데 위 아치 창(남색)·오른쪽 금색 촛대 / room: 벽 `#F6ECD8`·바닥 `#6B4A32`·오른쪽 침대(갈색 사각 + 크림 매트리스 윗선 y 390 + 빨간 이불 사각)·왼쪽 위 남색 창 + 크림 초승달 |

자리표시 이름표 글자: 인물은 `WHO[who] + ' ' + POSE[pose]`(예: "공주 공놀이", "개구리 날아감"), 소품은 `PROPN[f]`(예: "금공"). `WHO = { prin: '공주', frog: '개구리', king: '임금님', prince: '왕자' }`, `POSE = { stand: '서기', ball: '공놀이', cry: '울음', run: '안고 달림', refuse: '싫어함', sorry: '반성', sit: '식사', throw: '던짐', hand: '손 내밈', hop: '폴짝', fly: '날아감', surprise: '놀람' }`, `PROPN = { fp_prop_ball: '금공', fp_prop_table: '식탁', fp_prop_plate: '접시', fp_prop_bread: '빵', fp_prop_pillow: '베개' }`. 글자는 §6 과 무관(녹음 없음).

## 2. 공통 수치

### 2-1. 그림 비율(ASP, 폭/높이) — 시작값(그림이 오면 post_tale.py 값으로 바꾼다; preload 가 실제 비율로 덮어쓴다)
```
fp_prin_stand .45, fp_prin_ball .60, fp_prin_cry .45, fp_prin_run .62, fp_prin_refuse .62, fp_prin_sorry .48, fp_prin_sit .80, fp_prin_throw .68, fp_prin_hand .66,
fp_king_stand .50, fp_prince_stand .50, fp_prince_hand .66,
fp_frog_sit 1.10, fp_frog_ball 1.05, fp_frog_hop 1.70, fp_frog_fly 1.35, fp_frog_surprise 1.10,
fp_prop_ball 1.0, fp_prop_table 3.7, fp_prop_plate 3.6, fp_prop_bread 1.2, fp_prop_pillow 2.0
```

### 2-2. 높이(HT) — 같은 인물은 자세가 달라도 같은 크기 (CLAUDE.md §4-1)
무대 1000×560, 바닥 `FL = 505`. 높이는 그림 상자가 아니라 **같은 부위의 크기**가 같아지도록 정한다.

**사람(공주·임금·왕자) — 얼굴 폭(귀~귀)으로 맞춤. 세 사람의 머리는 같은 크기(2.5등신, 머리 폭 ≈ 80).**
| 그림 | HT 시작값 | 비고 |
|---|---|---|
| fp_prin_stand (기준) | **230** | 다른 동화 아이 인물(red_car 이현이 230)과 같은 머리 |
| fp_prin_ball | 250 | 팔을 올려 상자가 높다 → 머리는 stand 와 같아야 한다 |
| fp_prin_cry, refuse, throw, hand | 230 | |
| fp_prin_run | 225 | |
| fp_prin_sorry | 215 | 고개 숙여 상자가 낮다 |
| fp_prin_sit | 190 | 의자째 앉은 상자 |
| fp_king_stand | **245** | 공주 머리 폭과 같게 맞춘 뒤 키가 공주의 1.07 |
| fp_prince_stand, fp_prince_hand | **240** | 공주 머리 폭과 같게 맞춘 뒤 키가 공주의 1.04 |

받은 뒤 얼굴 폭을 재서 `HT[자세] = 230 × (fw_stand/H_stand) ÷ (fw_pose/H_pose)` 로 고친다(fw = 원본 PNG 의 얼굴 폭 px, H = 원본 bbox 높이 px). 임금·왕자는 `fw` 를 공주 stand 의 얼굴 폭과 같게 놓고 계산한다. ±12% 밖이면 그 자세만 다시 생성한다.

**개구리 — 두 눈 바깥 폭(눈~눈)으로 맞춤.** 개구리는 공주 키의 **0.39**(앉은 높이 90). 자세가 바뀌어도 눈 폭이 같아야 한다.
| 그림 | HT 시작값 | 비고 |
|---|---|---|
| fp_frog_sit (기준) | **90** | 앉은 높이. 4·6·7·8장 |
| fp_frog_ball | 96 | 입 앞의 공이 상자를 조금 키운다. 공 지름이 화면에서 ≈48(소품 공과 같게) 인지 같이 본다 |
| fp_frog_hop | 78 | 가로로 긴 상자(뛰는 자세) |
| fp_frog_fly | 84 | 둥글게 만 상자 |
| fp_frog_surprise | 92 | 눈이 커져 상자가 조금 높다 |

받은 뒤 `HT[자세] = 90 × (ew_sit/H_sit) ÷ (ew_pose/H_pose)`(ew = 두 눈 바깥 폭).

**소품**
| 그림 | HT | 비고 |
|---|---|---|
| fp_prop_ball | **48** | 지름. 공주 머리 폭 80 의 0.6. 개구리 입의 공(`fp_frog_ball` 안)도 화면에서 ≈48 이어야 한다 |
| fp_prop_table | **150** | 폭 ≈ 555. 윗면 `TABLE_TOP = FL - 140` |
| fp_prop_plate | **40** | 폭 ≈ 144. 8장 톡 대상(§5-1 로 200×100) |
| fp_prop_bread | **34** | 폭 ≈ 41 |
| fp_prop_pillow | **70** | 폭 ≈ 140 |

**그 밖에 `s` 를 쓰지 않는다**(원근 축소 없음). 모든 장면의 인물은 `s: 1`.

### 2-3. 그림이 보는 쪽(NAT) — 뒤집기 규칙
`mk()` 는 `NAT` 가 `'front'` 가 아니고 원하는 쪽과 다르면 좌우로 뒤집는다.

| 그림 | NAT | 비고 |
|---|---|---|
| fp_prin_stand, ball, cry, sorry | front | 안 뒤집음 |
| fp_prin_run, throw, hand | **right** | 프롬프트대로면. 반대로 오면 NAT 만 고친다(그림을 뒤집어 저장하지 않는다) |
| fp_prin_refuse, fp_prin_sit | **left** | 왼쪽(문·개구리 쪽)을 본다 |
| fp_king_stand | front | 살짝 왼쪽을 향한 앞모습. 뒤집지 않는다 |
| fp_prince_stand | front | |
| fp_prince_hand | **right** | 10장에서 왼쪽을 보게 뒤집어 쓴다(`look('hand', 'left')`) |
| fp_frog_sit, ball, surprise | front | |
| fp_frog_hop, fp_frog_fly | **right** | 6장 들어옴·9장 날아감 모두 오른쪽으로 |
| 소품 전부 | front | |

뒤집어 쓰는 그림: `prin_run`(5장, 왼쪽으로 달림), `prince_hand`(10장). 나머지는 그린 방향 그대로.

### 2-4. 겹침 순서(z)
`put()` 은 `T.world` 맨 뒤(가장 앞)에 붙인다. 뒤에 있어야 하는 것을 먼저 `put` 한다.
- 1장: 공주 → 도형 셋 → 금공(맨 앞, 손 위).
- 2·3장: 공주 → 금공.
- 4·5장: 공주 → 개구리(물 클립 래퍼 안, §5-5) → 금공(5장, 개구리 앞).
- 6장: 식탁 → 공주 → 개구리(문 앞, 맨 앞).
- 7장: 식탁 → 개구리 → 공주 → 임금님(오른쪽, 맨 앞).
- 8장: 식탁 → 접시 → 빵 셋 → 개구리(식탁 위) → 공주(의자째, 식탁 오른쪽 끝 앞).
- 9장: 베개 → 공주 → 개구리(맨 앞) → 왕자(개구리를 숨긴 뒤 put).
- 10장: 금공(풀밭) → 공주 → 왕자 → 톡 자리(`tapSpot`, 맨 앞).

### 2-5. 세로 화면 규칙
- `P` 일 때 보이는 폭은 약 260. 한 컷에 **둘까지만** 보이게 좌표를 모으고(`X(l, p)` 의 p 값), 세 명(7장)은 `director` 가 말할 때 데려온다.
- **아이가 눌러야 하는 것은 모두 한 화면(±130) 안**: 1장 도형 셋(`camSnap(560)` 기준 470·560·650), 8장 접시(`camSnap(500)`, 접시 500), 10장 손 사이(`camSnap(530)`, 톡 자리 ≈ 509).
- 카메라 y 는 280, z 는 1 로 고정. 줌 없음. 2장 공이 떨어질 때와 9장 개구리가 날아갈 때만 `camTo` 로 x 를 따라간다.

### 2-6. 누르는 자리 크기
- 톡·고르기 대상은 화면에서 **짧은 변 60 무대 px 이상**. 도형 70 은 `hitBox()` 로 100×100, 접시(높이 40)는 200×100, 10장 손 사이는 `tapSpot()` 120×120. `T.tap`/`T.choose` 에는 그 `hit` 그룹을 넘긴다.
- 톡 대상은 기다리는 동안 살짝 들썩인다: `a.pos.animate([{translate:'0 0'},{translate:'0 -5px'},{translate:'0 0'}], {duration: 900, iterations: 3})`.

### 2-7. 속도 (한 편 7분 이상이 목표)
- `say()` 뒤 `GAP = 700`ms. 장면 끝(다음 `sceneCard` 전) `sleep(SCENE_END = 1500)`.
- 걷기·달리기는 ±400px 에 1,500~2,600ms(linear). 폴짝은 한 번 420ms, 포물선 던지기 1,100ms.
- 대사 중 `hop`·`wiggle` 은 한 번만. 컷 그림(`cutImage`)은 **4장**(§3 끝 "컷신" 표; `CUT_HOLD = 4200`ms, 컷 위에서 기존 대사 한 줄을 읽는다 — 까치 방식).
- 전체 목표 7~8.5분. §11 에서 잰다. 7분이 안 되면 `SCENE_END` 를 2200, `GAP` 을 900 으로; 9분을 넘으면 `SCENE_END` 1200(대사는 건드리지 않는다).

## 3. 장면별 상세

표기: `L(x)` 가로, `P(x)` 세로 좌표. 대사는 §6 표의 번호. 효과음 이름은 `sounds/sfx/` 파일명(§7). 모든 장면은 `await T.sceneCard(tr('이름'), () => { … }, focus.pos)` 로 넘어간다(1장만 `T.curtain(true)`). 좌표는 중심 x·발끝(바닥) y.

### 장면 1. 성 뜰 (배움 놀이 1: 금공 모양 고르기 — 첫 조작, 시작 뒤 15초 안)
- `scene('fp_bg_yard')`. 공주 `ball` L300/P420, `FL`, `to:'right'`(앞모습이라 안 뒤집힘). 금공을 손 위에: `put(T, ball, prin.x + BALL_UP[0], FL + BALL_UP[1] + 24)`(소품은 발끝 y 기준이라 지름 반 만큼 내려 중심을 맞춘다) → 통통: `ball.pos.animate([{translate:'0 0'},{translate:'0 -40px'},{translate:'0 0'}], {duration: 900, iterations: Infinity, easing: 'ease-in-out'})`. 도형 셋을 풀밭에: `const kinds = ['circle', 'square', 'triangle'].sort(() => Math.random() - .5)`(**순서는 매번 무작위**), 자리 `spots = X([470, 600, 730], [470, 560, 650])`, `shape(T, kind, x, FL - 36, 70)`(§5-3, 세 도형 **모두 같은 금색** `#D9A94E` — 색이 아니라 모양으로 고르게), 각 `hitBox(T, s, 100, 100)`. P: `camSnap(560)`. `await T.curtain(true)`.
- **L0** → `sleep(300)` → **L1**(안내) → `await T.choose(opts, { prompt: '금공은 어떤 모양일까요? 골라 봐요.' })`:
  - `opts = kinds.map(k => ({ el: hitOf(k), ok: k === 'circle', onWrong: async () => { await wiggleEl(hitOf(k)); await say(k === 'square' ? W_sq : W_tri); } }))` — `W_sq`·`W_tri` 는 §6 과 글자 하나까지 같다. `wiggleEl` 은 엔진 `choose` 의 흔들림과 같은 것(magpie.js 와 같이 로컬에 복사).
  - 2회 오답부터 정답(동그라미)이 빛나며 들썩이고 나머지는 흐려진다(엔진). 정답 위치를 먼저 알려 주지 않는다.
- 정답: `AudioFX.ding()`(엔진) → 동그라미 `glow` 1,200 + `sparkleSfx(T)` + `T.pop(circle.x, FL - 150, tr('반짝!'))` → **C1** → 도형 셋 `fadeOut(400)` → 공이 크게 세 번 튄다: `for (3) { ball.hop(90, 700); AudioFX.sfx('boing', .3); await sleep(700); }` + 첫 번째에 `T.pop(prin.x + 120, FL - 300, tr('통통!'))`(공 오른쪽 위, 얼굴 밖) → **L2**(공주, `hop(10, 320)`) → `sleep(SCENE_END)`.
- 시작 버튼부터 고르기 안내 L1 끝까지 ≤ 15초(§11).

### 장면 2. 샘가 (자동 — 공이 높이 튀어 샘으로)
- `sceneCard(tr('샘가'))`, 배경 `fp_bg_pond`. 공주 `ball` L380/P430, `FL`. 금공을 손 위(1장과 같은 식, 통통 애니메이션). focus: 공주. P: `camSnap(520)`.
- **L3** → 공이 두 번 크게 튄다(`hop(90, 700)` + `boing` .3, 두 번째에 `T.pop(prin.x + 120, FL - 300, tr('통통!'))`) → **L4** 와 동시에 타이머: 0ms 통통 애니메이션 `cancel`, `ball.move(prin.x + 40, 60, 900, 'ease-out')`(아주 높이) + `swish` .3; **900ms** `ball.move(POND.x, POND.surf - 24, 1100, 'ease-in')`(샘 쪽으로 떨어짐, 공 아래가 물 윗선에 닿음) + P: `T.camTo(POND.x - 60, 280, 1, 1100)`; **1,400ms** 공주 `look('stand')` + `wiggle(5, 500)`. 구현: `const t = (async () => { … })(); await say(L4); await t;` → `sleep(600)` → `sleep(SCENE_END)`.

### 장면 3. 풍덩 (자동 — 공이 가라앉고 공주가 운다)
- `sceneCard(tr('풍덩'))`, 배경 `fp_bg_pond`. 공주 `stand` L380/P430, `FL`. 금공 `(POND.x, POND.surf - 24)`. focus: 금공. P: `camSnap(520)`.
- **L5** 와 동시에: 0ms `AudioFX.sfx('splash_big', .5)` + `T.pop(POND.x, POND.surf - 130, tr('풍덩!'), '#1F2A56')` + `ripple(T, POND.x, POND.surf + 6)`(§5-4) + 공이 가라앉음: `ball.move(POND.x, POND.surf + 90, 1400, 'ease-in')` 과 동시에 `ball.pos.animate([{opacity: 1}, {opacity: 0}], {duration: 1400, fill: 'forwards'})` → 끝나면 `hide(ball)`, `ball.pos.style.opacity = ''`.
- L5 끝 → 공주 `look('cry')` + `T.pop(prin.x - 90, FL - 270, tr('엉엉'), '#1F2A56')`(머리 왼쪽 위, 얼굴 밖) → **L6**(공주) → `sleep(SCENE_END)`.

### 장면 4. 개구리의 약속 (자동)
- `sceneCard(tr('개구리의 약속'))`, 배경 `fp_bg_pond`. 공주 `cry` L380/P430, `FL`. 개구리: `waterClip(T, frog, POND.surf + 4)`(§5-5, 물 윗선 아래는 보이지 않음) → `put(T, frog, POND.x - 60, POND.surf + 95, { look: 'sit' })`(완전히 물속 → 안 보임). focus: 공주. P: `camSnap(520)`(공주 430 · 개구리 600 모두 안).
- **L7** 과 동시에 개구리가 올라옴: `frog.move(POND.x - 60, POND.surf + 36, 900, 'ease-out')`(머리와 눈이 물 위로) + `AudioFX.sfx('bubbles', .4)` + `T.pop(POND.x + 70, POND.surf - 90, tr('뽀글뽀글'), '#1F2A56')`(개구리 오른쪽 위).
- **L8**(개구리, `hop(6, 300)`) → 공주 `look('stand')` → **L9**(공주) → **L10**(개구리, `hop(6, 300)` 한 번) → **L11**(공주, `hop(14, 360)`) → `sleep(SCENE_END)`.

### 장면 5. 공을 찾았어요 (자동 — 공주가 공만 들고 달아남)
- `sceneCard(tr('공을 찾았어요'))`, 배경 `fp_bg_pond`. 공주 `stand` L380/P430, `FL`. 개구리 물 클립 안 `(POND.x - 60, POND.surf + 36)` `sit`(4장과 같은 자리). focus: 개구리. P: `camSnap(520)`.
- **L12** 와 동시에 타이머: 0ms 개구리 잠수 `frog.move(POND.x - 60, POND.surf + 95, 500, 'ease-in')` + `splash` .4 + `T.pop(POND.x + 60, POND.surf - 110, tr('풍덩!'), '#1F2A56')`; **1,600ms** `frog.look('ball')` + `frog.move(POND.x - 60, POND.surf + 10, 900, 'ease-out')`(공을 문 채 몸이 거의 다 보이게) + `bubbles` .4.
- **L13**(공주, `hop(14, 360)`) → 공 건네기: `frog.look('sit')`; `put(T, ball, frog.x, frog.y - 52)`(개구리 입 앞, 래퍼 밖 `T.world`) → `ball.move(prin.x + BALL_RUN[0], FL + BALL_RUN[1] + 24, 700, 'ease-out')` + `paper_up` .5 → 공주 `look('run', 'left')`(**왼쪽을 보며** 왼쪽으로 달아남: 그림은 오른쪽 보기라 뒤집힘) → 공 위치를 왼쪽 보기로 다시 `place(prin.x - BALL_RUN[0], FL + BALL_RUN[1] + 24)`.
- **L14** 와 동시에 달아남: `Promise.all([prin.move(-200, FL, 2600, 'ease-in'), ball.move(-200 - BALL_RUN[0], FL + BALL_RUN[1] + 24, 2600, 'ease-in')])` + 달리는 동안 `prin.hop(6, 400)` 반복 + `step_grass` .4 를 400ms 마다 + 0ms `T.pop(prin.x + 110, FL - 250, tr('쌩!'))`(공주 뒤쪽 위, 얼굴 밖). P: `T.camTo(300, 280, 1, 1500)`. → `hide(prin); hide(ball)`.
- **L15**(개구리, `wiggle(4, 500)`) → `sleep(SCENE_END)`.

### 장면 6. 문 앞의 개구리 (자동 — 개구리가 따라오고 공주가 밀어냄)
- `sceneCard(tr('문 앞의 개구리'))`, 배경 `fp_bg_dining`(왼쪽에 열린 문, 식탁 없음). 식탁 `put(T, table, X(560, 560), FL)`. 공주 `stand` L420/P430, `FL`, `to:'left'`. 개구리는 아직 밖. focus: 공주. P: `camSnap(310)`(개구리 190 · 공주 430 모두 안).
- **L16** 과 동시에 타이머: **2,000ms** `AudioFX.sfx('knock', .5)` 두 번(300ms 간격) + `T.pop(DOOR.x + 40, 150, tr('똑똑!'), '#6B4A32')`(문 위쪽, 인물 없음).
- L16 끝 → 개구리 들어옴: `put(T, frog, -60, FL, { look: 'hop', to: 'right' })` → `await hops(T, frog, DOOR.x + 60, 3, 420)`(§5-7: 세 번 폴짝, 첫 번째에 `T.pop(frog.x + 20, FL - 130, tr('폴짝'))`) → `frog.look('sit')`.
- **L17**(개구리, `hop(8, 300)`) → 공주 `look('refuse', 'left')` + `prin.move(prin.x + 40, FL, 500, 'ease-out')`(한 걸음 물러섬, 개구리와 190 이상 떨어져 손이 닿지 않는다) → **L18**(공주) → 개구리 `wiggle(4, 500)`(놀람) → `sleep(SCENE_END)`.

### 장면 7. 아버지의 말씀 (자동)
- `sceneCard(tr('아버지의 말씀'))`, 배경 `fp_bg_dining`. 식탁 L560/P560 `FL`. 개구리 `sit` `(DOOR.x + 60, FL)`. 공주 `refuse` L460/P440, `FL`, `to:'left'`. 임금님 `stand` 는 오른쪽 밖 `(1100, FL)`. focus: 공주. P: `camSnap(460)`.
- **L19** 와 동시에 임금님 등장: `king.move(X(680, 640), FL, 2200, 'ease-out')` + `king.hop(4, 440)` 반복 + `step_wood` .4 를 500ms 마다. P: `follow(560, 2200)`.
- **L20**(임금님) → 공주 `look('sorry')` → **L21**(공주) → **L22**(임금님, `hop(6, 300)` 한 번) → **L23**(공주) → **L24** 와 동시에: 공주 `look('stand')` + 개구리가 식탁으로: `frog.look('hop', 'right')` → `hops(T, frog, 330, 2, 420)` → `arc(frog, 390, TABLE_TOP, 110, 600)`(§5-6, 식탁 위로 올라감) + `boing` .25 → `frog.look('sit')`. → `sleep(SCENE_END)`.

### 장면 8. 같이 먹어요 (배움 놀이 2: 빵 세기 — 톡 한 번, 하나·둘·셋은 목소리로만)
- `sceneCard(tr('같이 먹어요'))`, 배경 `fp_bg_dining`. put 순서: 식탁 `X(500, 500)`, `FL` → 접시 `(table.x, TABLE_TOP + 8)` → 빵 셋 `(table.x - 44, TABLE_TOP - 10)`, `(table.x, TABLE_TOP - 10)`, `(table.x + 44, TABLE_TOP - 10)`(접시 안에 올라앉게; 받은 그림에서 접시 테두리와 빵 바닥을 보고 ±6) → 개구리 `sit` `(table.x - 170, TABLE_TOP)` → 공주 `sit`(의자째) `(table.x + 300, FL)`, `to:'left'`(식탁 오른쪽 끝 앞에 겹쳐 앉은 모양). `hitBox(T, plate, 200, 100)`. focus: 접시. P: `camSnap(500)`(접시 500 이 가운데; 공주는 말할 때 `director` 가 데려온다).
- **L25**(공주) → **L26**(안내) → 접시 들썩임(§2-6) → `await T.tap(plate.hit, { prompt: '접시에 빵이 몇 개일까요? 접시를 톡 눌러 봐요.' })`.
- 세기(자동, **글자 없음**): `for (let i = 0; i < 3; i++) { AudioFX.countBeat && AudioFX.countBeat(i + 1); AudioFX.sfx('pop', .4); vo('n' + (i + 1)); glow(breads[i], 800); breads[i].hop(14, 360); await sleep(950); }` — `T.pop` 숫자 글자를 **넣지 않는다**(사용자 규칙). P: 카메라는 접시에 둔 채.
- **L27**(공주, `hop(8, 300)`) → 나눠 먹기: `breads[0].move(frog.x + 6, TABLE_TOP - 34, 500, 'ease-in')` → `AudioFX.sfx('chomp', .5)` + `fadeOut(T, breads[0], 300)` + `frog.hop(10, 320)` + `T.pop(frog.x, TABLE_TOP - 150, tr('냠냠'))`(개구리 머리 위); 400ms 뒤 `breads[1].move(prin.x - 60, FL - 150, 500, 'ease-in')` → `chomp` .5 + `fadeOut` + `prin.hop(8, 300)`. 세 번째 빵은 접시에 남긴다.
- **L28**(개구리, `wiggle(4, 500)`) → `sleep(SCENE_END)`.

### 장면 9. 베개 위로 폴짝 (자동 — 던지기 → 베개 → 번쩍 → 왕자)
- `sceneCard(tr('베개 위로 폴짝'))`, 배경 `fp_bg_room`(오른쪽 침대, 베개 없음). 베개 `put(T, pillow, BED.x, BED.top + 4)`(매트리스 위; 받은 배경 ±20). 공주 `stand` L360/P400, `FL`, `to:'right'`. 개구리는 왼쪽 밖. focus: 공주. P: `camSnap(520)`.
- **L29** 와 동시에 개구리 들어옴: `put(T, frog, -60, FL, { look: 'hop', to: 'right' })` → `hops(T, frog, 480, 4, 420)` → `frog.look('sit')`(공주 발 옆, 오른쪽). P: 카메라 그대로.
- **L30**(개구리, `hop(6, 300)`) → 공주 `look('throw', 'right')` → **L31**(공주).
- 던지기(**L32** 와 동시에 시작): 0ms `AudioFX.sfx('swish', .5)` + `T.pop(prin.x + 30, FL - 310, tr('휙!'))`(머리 위 80, 얼굴 밖) + `frog.look('fly', 'right')` + `await arc(frog, BED.x, BED.top - 62, 170, 1100)`(§5-6: 포물선으로 베개 위에 내려앉음; 벽에 닿지 않는다 — x 가 BED.x 를 넘지 않는다) + P: `T.camTo(BED.x - 80, 280, 1, 1100)`; 착지: `AudioFX.sfx('paper_down', .4)` + `frog.look('surprise')` + `T.pop(BED.x, BED.top - 200, tr('포옥'), '#1F2A56')`(개구리 위 100) + 베개 눌림 `pillow.body.animate([{transform:'scaleY(1)'},{transform:'scaleY(.85)'},{transform:'scaleY(1)'}], {duration: 400})`. `await say(L32)` 가 끝나면 `sleep(500)`.
- 번쩍: `sparkleSfx(T)` + `T.pop(BED.x, BED.top - 240, tr('팡!'), '#D9A94E')` + `flash(T, BED.x, BED.top - 100)`(§5-8); **350ms** 뒤 `hide(frog)` → `put(T, prince, BED.x - 40, FL, { look: 'stand' })` + `fadeIn(prince, 400)` + `glow(prince, 1200)`. (왕자는 침대 앞 바닥에 선다. 베개는 그대로.)
- **L33**(왕자) → 공주 `look('stand')` + `hop(14, 360)` → **L34**(공주) → `sleep(SCENE_END)`.

### 장면 10. 약속을 지켜요 (톡 1 — 손잡기, 마지막 인사형 톡)
- `sceneCard(tr('약속을 지켜요'))`, 배경 `fp_bg_yard`. 금공 풀밭에 `put(T, ball, 510, FL + 2)`. 공주 `stand` L400/P440, `FL`, `to:'right'`. 왕자 `stand` L620/P620, `FL`, `to:'left'`(앞모습이라 안 뒤집힘). focus: 공주. P: `camSnap(530)`(공주 440 · 왕자 620 모두 안).
- **L35** → **L36**(왕자) → 둘이 손을 내민다: `prin.look('hand', 'right')`, `prince.look('hand', 'left')`(뒤집힘), `prince.move(prin.x + HAND_PRIN[0] + 22 + HAND_PRINCE[0], FL, 500, 'ease-out')`(= 공주 손끝과 왕자 손끝 사이 **22px**; 가로 x ≈ 540, 세로 ≈ 580) → 톡 자리: `const spot = tapSpot(T, prin.x + HAND_PRIN[0] + 11, FL + HAND_PRIN[1], 120, 120)`(§5-2, 두 손 사이 가운데) → 들썩임(§2-6, `spot`) → `await T.tap(spot)`(안내 문장 없음 — 손가락 힌트만).
- 톡 뒤: `spot.remove()` → `prince.move(prince.x - 24, FL, 400, 'ease-out')`(손끝이 2px 겹친다 = 손잡음) + `sparkleSfx(T)` + `T.pop(prin.x + HAND_PRIN[0] + 11, FL - 300, tr('반짝!'))`(두 사람 머리 위 70) → 둘이 `hop(16, 360)` 두 번(같은 타이밍) → `petals(T)`(§5-9).
- **L37**(공주) → **L38** 과 동시에 공 주고받기: `ball.move(prince.x + 30, FL - 110, 600, 'ease-out')` → `boing` .3 → `ball.move(prin.x - 30, FL - 110, 600)` → `boing` .3 → `ball.move(510, FL + 2, 600)` → `T.finale(); AudioFX.sfx('tada') || sparkleSfx(T); await sleep(1500); return '한 약속은 지켜요.';`
- 이 동화의 마지막 인사형 톡은 이 손잡기 톡이다.

### 컷신 (그림 컷) — CLAUDE.md §5-2, 까치(`tales/magpie`)·신데렐라 방식 (2026-10-21 추가)
- 컷 **4장**. 컷은 그 사건 **직후**에만 띄우고, 컷 위에서 그 장면의 **기존 대사 한 줄**을 읽는다: `const c = T.cutImage([{ src: src('fp_cut_…'), sfx: '…', hold: CUT_HOLD }], { hold: CUT_HOLD }); await say(L); await c;` (`CUT_HOLD = 4200`ms; 대사가 홀드보다 길면 컷이 먼저 닫혀도 된다; 톡하면 바로 넘어간다 — 엔진 `cutImage`, `engine/tale.js` 619행). 컷 패널은 엔진이 4:3 흰 테두리 종이로 보여 주므로 그림도 4:3 으로 만든다.
- 그림: `assets/v3w/fp_cut_<이름>.webp`(1200×900). 작업표 `jobs_frog_prince.json` 의 `kind: "cut"` 항목 **4장**(`pass 3`, 참고 그림 `refs` 는 그 컷에 나오는 인물의 스프라이트 — 스프라이트가 모두 나온 뒤에 만든다). 후처리: `post_tale.py` 는 sprite/bg 만 다루므로 컷은 `post_cinderella2.py` 처럼 4:3 가운데 자르기 → 1200×900 webp 로 따로 변환한다(그림·코드 작업은 뒤의 큐에서; 이 문서는 기획만).
- 규칙: 한 장면에 한 컷, 이웃한 장면에 연달아 두지 않는다. 컷 안 인물은 스프라이트와 같은 얼굴 규칙(점 눈·점 코·띠 입·분홍 볼), 소품은 얼굴 없음, 피·눈물·아픔 없음. 컷 위 대사는 모두 §6 에 **이미 있는 줄**이라 새 녹음이 없다(영어는 `voice_script_en.json` 의 같은 줄, `TEXT_EN` 추가 없음). 컷이 닫힌 뒤 무대는 그 장면의 다음 단계부터 이어진다(컷이 대신한 애니메이션은 생략해도 된다).

| 컷 id | 장면 | 앞 장면 → 뒤 장면 | 보여 줄 순간 | 그림 구도(얼굴 규칙 포함) | 컷 위 대사(한국어 / 영어) | 컷 동안 음성 | 효과음 | refs |
|---|---|---|---|---|---|---|---|---|
| `fp_cut_splash` | 3 풍덩 | 2 샘가(공이 높이 튀어 샘으로) → 4 개구리의 약속(개구리 등장) | 큰 사건: 금공이 샘에 풍덩 빠지는 순간(공이 물에 반쯤 잠기고 물방울·파문이 크게 튄다) | 샘이 화면 오른쪽 아래 절반, 가운데에 공과 큰 종이 물보라. 공주는 왼쪽 샘가에서 두 손을 볼에 대고 둥근 입(놀람), 얼굴은 점 눈·점 코·띠 입. 낮(세트 A). | **L5** 공이 샘 속으로 풍덩! 금공이 깊은 물속으로 가라앉았어요. / Splash! The ball fell into the spring and sank deep down into the water. | 있음 — 컷 음성 필요: L5 | `splash_big` | fp_prin_stand · fp_prop_ball |
| `fp_cut_ball` | 5 공을 찾았어요 | 4 개구리의 약속 → 6 문 앞의 개구리 | 개구리가 물속에서 금공을 물고 솟아오르는 순간 | 개구리가 화면 가운데에서 물 위로 솟아 입에 금공을 물고 있다(눈 크고 자랑스러운 얼굴, 공 지름은 개구리 눈 폭쯤). 물방울이 둥글게 튄다. 공주는 왼쪽 샘가에서 두 손을 모으고 기뻐한다. | **L12** 개구리는 풍덩 물속으로 들어가 금공을 물고 올라왔어요. / The frog dived into the water, splash, and came back up with the golden ball in his mouth. | 있음 — 컷 음성 필요: L12 | `bubbles` | fp_frog_sit · fp_prin_stand · fp_prop_ball |
| `fp_cut_king` | 7 아버지의 말씀 | 6 문 앞의 개구리(공주가 밀어냄) → 8 같이 먹어요 | 임금님이 들어와 공주와 문 앞의 작은 개구리를 보는 순간(이야기가 바뀌는 자리) | 오른쪽에서 들어온 임금님이 손가락 하나를 들고 공주를 본다(부드러운 얼굴, 화내지 않음). 가운데 공주는 고개를 숙이고 두 손을 모은다. 왼쪽 열린 문 앞에 개구리가 작게 앉아 둘을 올려다본다. 식당, 저녁(세트 B 분위기). | **L19** 그 모습을 본 임금님이 공주에게 물었어요. / The king saw this and asked the princess. | 있음 — 컷 음성 필요: L19 | `없음` | fp_king_stand · fp_prin_stand · fp_frog_sit |
| `fp_cut_prince` | 9 베개 위로 폴짝 | 8 같이 먹어요 → 10 약속을 지켜요 | 변신: 번쩍 빛 속에서 개구리가 왕자로 바뀌는 순간 | 침대 앞 가운데에 큰 크림색 빛 조각과 금별이 터지고 그 안에 초록 망토 왕자가 서서 웃는다. 발치에 작은 초록 반짝 점 몇 개(개구리였음을 알리는 흔적, 개구리 몸은 없음). 왼쪽의 공주는 눈을 크게 뜨고 두 손을 볼에 댄다. 밤 방(세트 B). | **L33** 고마워요. 나는 마법에 걸린 왕자였어요. 약속을 지켜 줘서 마법이 풀렸어요. / Thank you. I was a prince under a spell. Because you kept your promise, the spell is broken. | 있음 — 컷 음성 필요: L33 | `sparkle` | fp_prince_stand · fp_prin_stand |

컷 음성 필요(모두 §6 의 기존 줄, 새 줄 없음): L5, L12, L19, L33.

## 4. 배움 놀이 규칙 요약 (엔진 `T.choose` · `T.tap`)
- **1장 모양 고르기**: 보기 셋(동그라미·네모·세모, 모두 같은 금색), 자리 무작위, 정답 1개(동그라미). 12초 무입력이면 `prompt`(L1) 를 다시 읽는다. 1회 오답 → `onWrong`(흔들림 + W_sq/W_tri). 2회 오답부터 정답이 노랗게 빛나며 들썩이고 나머지는 흐려진다(엔진). 정답을 누르면 `AudioFX.ding()` → 반짝 → C1.
- **8장 빵 세기**: 접시 톡 한 번 → 하나·둘·셋이 저절로(공주 목소리 `vo('n1'..'n3')`, 빵이 차례로 빛나며 들썩). 숫자 글자·말풍선 없음. 12초 무입력이면 L26 재안내. 자동 재생(`auto_play`)에서는 엔진이 대신 누른다.
- 둘 다 줄거리와 무관하다. 게임오버 없음.

## 5. 코드로 그리는 것 (그림 없이)

### 5-1. 누르는 자리 넓히기 `hitBox(T, a, w, h)`
red_car.js 그대로: 배우 `a.pos` 의 **맨 앞 자식으로** 투명 사각을 넣고(`T.el('rect', { x: -w/2, y: -h, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, a.pos)` — `a.pos.insertBefore(rect, a.body)` 로 그림 뒤에), `a.hit = a.pos` 를 둔다. `fill-opacity: 0` 이어도 pointer-events 는 받는다(`fill: none` 은 안 받는다). 도형(§5-3)은 `{ pos, body }` 모양을 같게 만들어 그대로 쓴다.

### 5-2. 보이지 않는 톡 자리 `tapSpot(T, x, y, w, h)`
`T.el('g', { transform: `translate(${x},${y})` }, T.world)` 안에 `rect { x: -w/2, y: -h/2, width: w, height: h, fill: '#000', 'fill-opacity': 0 }`. 반환은 그 `g`(`T.tap(g)` 에 넘긴다; 손가락 힌트는 `getBoundingClientRect` 로 사각 가운데를 가리킨다). 10장 손 사이에 한 번 쓴다.

### 5-3. 종이 도형 `shape(T, kind, x, y, size)` (1장 고르기 보기)
```js
const g = T.el('g', { transform: `translate(${x},${y})` }, T.world), body = T.el('g', { filter: 'url(#pp)' }, g), s = size / 2, F = '#D9A94E';
if (kind === 'circle') T.el('circle', { cx: 0, cy: 0, r: s, fill: F }, body);
else if (kind === 'square') T.el('rect', { x: -s, y: -s, width: size, height: size, rx: 4, fill: F }, body);
else T.el('path', { d: `M0 ${-s} L${s} ${s} L${-s} ${s} Z`, fill: F }, body);
return { pos: g, body, x, y, kind };
```
세 도형은 **같은 색·같은 크기(70)** 이고 그림자는 `#pp` 필터만. 얼굴 없음. 자리표시 모드와 그림 모드에서 똑같다(그림 아님).

### 5-4. 물 파문 `ripple(T, x, y)` (3장)
`T.fx`(없으면 `T.world`)에 타원 3개를 250ms 간격으로: 각 `ellipse { cx: x, cy: y, rx: 20, ry: 7, fill: 'none', stroke: '#F4F6FA', 'stroke-width': 3 }` → `animate([{transform:'scale(1)', opacity: .9},{transform:'scale(4.5)', opacity: 0}], {duration: 1200, easing: 'ease-out', fill: 'forwards'})`(`transform-origin` 을 `${x}px ${y}px` 로) → 끝나면 `remove()`.

### 5-5. 물 윗선 클립 `waterClip(T, a, surfY)` (4·5장)
`<defs>` 에 `clipPath#fpWater` 하나(`rect { x: -200, y: -200, width: 1400, height: surfY + 200 }`, 무대 좌표) → 래퍼 `const wc = T.el('g', { 'clip-path': 'url(#fpWater)' }, T.world); wc.appendChild(a.pos)`. 래퍼 안에서 `a.move`·`a.place` 를 써도 물 윗선 아래는 보이지 않는다. 같은 장면 안에서 `put()` 을 다시 부르면 `T.world` 맨 뒤로 옮겨 가 클립이 풀리므로, 4·5장에서는 개구리에 `put()` 을 **한 번만**(래퍼에 넣기 전에) 부르고 그 뒤는 `look`·`move` 만 쓴다. 5장 끝에 래퍼에서 꺼낼 필요는 없다(장면 전환 `T.clear()` 가 지운다).

### 5-6. 포물선 이동 `arc(a, nx, ny, peak, ms)` (7장 식탁 위로, 9장 던지기)
`a.move(nx, ny, ms, 'linear')` 와 동시에 `a.body.animate([{transform:'translateY(0)'},{transform:`translateY(${-peak}px)`, offset: .5},{transform:'translateY(0)'}], {duration: ms, easing: 'ease-in-out'})` → 둘 다 `await`. 9장은 `peak 170`, 도착 x 가 `BED.x` 를 넘지 않는다(벽·헤드보드에 닿지 않음).

### 5-7. 폴짝폴짝 `hops(T, a, toX, n, ms)` (6·7·9장 개구리)
`const step = (toX - a.x) / n; for (i < n) { AudioFX.sfx('boing', .25); await arc(a, a.x + step, a.y, 40, ms); await sleep(120); }`. 첫 번째 폴짝에 `T.pop(a.x + 20, a.y - 130, tr('폴짝'))` 은 부르는 쪽(6장만)에서.

### 5-8. 마법 빛 `flash(T, x, y)` (9장)
`T.fx` 에 크림 원 `circle { cx: x, cy: y, r: 10, fill: '#F6ECD8' }` → `animate([{r: 10, opacity: .95},{r: 420, opacity: 0}], 700)`(`r` 애니메이션이 안 되는 브라우저를 위해 `transform: scale(1→42)` 로) + 금별 8개(`path` 별 모양, `#D9A94E`, 반지름 14)를 x,y 에서 8방향으로 `translate(0 0 → 방향×160px)` + `opacity 1→0` 900ms → 모두 `remove()`. 화면 전체 틴트는 쓰지 않는다(아이가 놀라지 않게 밝기만 살짝).

### 5-9. 꽃잎 `petals(T)` (10장)
`T.fx` 에 분홍 타원 14개(`ellipse rx 7 ry 4, fill '#F2C4C4'`)를 x 300~760 무작위, y -30 에서 시작 → 각각 `animate([{transform:'translate(0,0) rotate(0)'},{transform:`translate(${±30}px, 560px) rotate(${±180}deg)`}], {duration: 2600 + 무작위 900, delay: i×120, easing: 'linear', fill: 'forwards'})` → 끝나면 `remove()`. `T.confetti()` 는 쓰지 않는다(종이 꽃잎으로 통일).

## 6. 대사 전체 (voice_script_el.json 과 글자 하나까지 같다)
- `say()` 에 넘기는 한국어 문장은 아래 표와 **정확히** 같아야 녹음이 붙는다(한 글자라도 다르면 클립이 없어 조용히 넘어간다 → §11 `_audio.json` 으로 잡는다).
- 배역 키: nar(해설, **Huelyn**) prin(공주, **Annie**) frog(개구리, **Will** — 느리고 살짝 쉰 개구리 말투는 연기 지시로만) king(임금님, **Namchun**) prince(왕자, **Eric** — 개구리와 다른 목소리로 마법이 풀린 것을 알린다). 한 편 안에서 목소리 겹침 없음.
- 톡 안내 문장은 10장에 없다(손가락 힌트만). 고르기 안내(L1)·세기 안내(L26)는 `say()` 로 읽은 뒤 같은 문장을 `prompt` 로 넘긴다(12초 재안내).
- 말풍선 없는 소리(`extra`, `vo(key)`): `n1`(하나!) · `n2`(둘!) · `n3`(셋!) — 모두 공주 목소리.

| # | 장면 | 배역 | 한국어 (`say()`에 넘기는 문장 그대로) | 영어 | 쓰임 |
|---|---|---|---|---|---|
| L0 | 1 | 해설 | 옛날 어느 성에 금빛 공을 가장 좋아하는 공주가 살았어요. | Once upon a time, in a castle, there lived a princess who loved her golden ball more than anything. |  |
| L1 | 1 | 해설 | 금공은 어떤 모양일까요? 골라 봐요. | What shape is the golden ball? Pick one! | 고르기 안내(첫 조작) |
| W_sq | 1 | 해설 | 그건 네모예요. 금공 모양을 다시 찾아봐요. | That's a square. Find the shape of the golden ball again. | 오답(네모) |
| W_tri | 1 | 해설 | 그건 세모예요. 금공 모양을 다시 찾아봐요. | That's a triangle. Find the shape of the golden ball again. | 오답(세모) |
| C1 | 1 | 해설 | 맞아요, 동그라미! 금공은 동글동글 동그라미예요. | That's right, a circle! The golden ball is round like a circle. | 정답 |
| L2 | 1 | 공주 | 통통통! 내 금공은 세상에서 제일 예뻐. | Bounce, bounce! My golden ball is the prettiest in the whole world. |  |
| L3 | 2 | 해설 | 어느 날, 공주는 숲속 샘가에서 공놀이를 했어요. | One day, the princess played with her ball beside a spring in the forest. |  |
| L4 | 2 | 해설 | 공이 높이, 더 높이… 어머나! | The ball went up high, and higher... oh my! | 공 날아감 위 |
| L5 | 3 | 해설 | 공이 샘 속으로 풍덩! 금공이 깊은 물속으로 가라앉았어요. | Splash! The ball fell into the spring and sank deep down into the water. | 파문·가라앉음 위 |
| L6 | 3 | 공주 | 엉엉, 내 금공… 내 금공이 사라졌어. | Boo-hoo, my golden ball... my golden ball is gone. |  |
| L7 | 4 | 해설 | 그때 샘물 위로 초록 개구리가 고개를 내밀었어요. | Just then, a green frog poked his head up out of the water. | 개구리 올라옴 위 |
| L8 | 4 | 개구리 | 공주님, 왜 울어요? | Princess, why are you crying? |  |
| L9 | 4 | 공주 | 내 금공이 샘에 빠졌어. 흑흑. | My golden ball fell into the spring. Sniff, sniff. |  |
| L10 | 4 | 개구리 | 내가 공을 찾아 줄게. 대신 나랑 친구가 되고, 같이 먹고, 한 침대에서 자 줄래? | I'll get your ball for you. But in return, will you be my friend, eat with me, and let me sleep in your bed? |  |
| L11 | 4 | 공주 | 좋아, 약속할게! | Okay, I promise! |  |
| L12 | 5 | 해설 | 개구리는 풍덩 물속으로 들어가 금공을 물고 올라왔어요. | The frog dived into the water, splash, and came back up with the golden ball in his mouth. | 잠수·공 물고 올라옴 위 |
| L13 | 5 | 공주 | 내 공이다! | My ball! |  |
| L14 | 5 | 해설 | 공주는 공을 받아 안고 성으로 쌩 달려갔어요. | The princess grabbed the ball and ran straight home to the castle. | 달아남 위 |
| L15 | 5 | 개구리 | 기다려, 약속했잖아! | Wait! You promised! |  |
| L16 | 6 | 해설 | 저녁 식사 때, 문 밖에서 폴짝폴짝 소리가 났어요. 똑똑! | At supper time, there came a hop, hop sound outside the door. Knock, knock! | 똑똑 효과음 위 |
| L17 | 6 | 개구리 | 공주님, 약속했잖아요. 문 좀 열어 줘요. | Princess, you promised. Please open the door. |  |
| L18 | 6 | 공주 | 싫어! 저리 가! | No! Go away! |  |
| L19 | 7 | 해설 | 그 모습을 본 임금님이 공주에게 물었어요. | The king saw this and asked the princess. | 임금님 등장 위 |
| L20 | 7 | 임금님 | 공주야, 무슨 약속을 했느냐? | My princess, what did you promise? |  |
| L21 | 7 | 공주 | 개구리가 금공을 찾아 주면… 친구가 되겠다고 했어요. | I said that if the frog found my golden ball... I would be his friend. |  |
| L22 | 7 | 임금님 | 약속은 지켜야 한단다. 도와준 친구에게는 더욱 그렇지. | A promise must be kept. Even more so to a friend who helped you. | 원작 대사(교훈 설교 아님) |
| L23 | 7 | 공주 | …알겠어요, 아버지. | ...Yes, Father. |  |
| L24 | 7 | 해설 | 공주는 개구리를 식탁으로 데려갔어요. | The princess brought the frog to the table. | 개구리 식탁 위로 |
| L25 | 8 | 공주 | 약속했으니까 같이 먹자. | I promised, so let's eat together. |  |
| L26 | 8 | 해설 | 접시에 빵이 몇 개일까요? 접시를 톡 눌러 봐요. | How many buns are on the plate? Tap the plate! | 세기 안내 |
| n1~n3 | 8 | 공주 | 하나! / 둘! / 셋! | One! / Two! / Three! | `extra`, 말풍선 없음 |
| L27 | 8 | 공주 | 빵이 세 개! 너 하나, 나 하나, 남은 하나는 나눠 먹자. | Three buns! One for you, one for me, and we'll share the last one. |  |
| L28 | 8 | 개구리 | 냠냠, 맛있다! | Yum yum, delicious! |  |
| L29 | 9 | 해설 | 밤이 되자 개구리가 공주의 방까지 따라왔어요. | When night came, the frog followed the princess all the way to her room. | 개구리 들어옴 위 |
| L30 | 9 | 개구리 | 공주님, 같은 침대에서 자기로 했잖아요. | Princess, you said I could sleep in your bed. |  |
| L31 | 9 | 공주 | 으, 이제 그만! | Ugh, that's enough! |  |
| L32 | 9 | 해설 | 공주는 개구리를 침대 쪽으로 휙 던졌어요. 개구리는 푹신한 베개 위에 포옥! | The princess tossed the frog toward the bed. Plop! He landed softly on the fluffy pillow! | 던지기 위 |
| L33 | 9 | 왕자 | 고마워요. 나는 마법에 걸린 왕자였어요. 약속을 지켜 줘서 마법이 풀렸어요. | Thank you. I was a prince under a spell. Because you kept your promise, the spell is broken. |  |
| L34 | 9 | 공주 | 어머, 개구리가… 왕자님이었구나! | Oh my, the frog... was a prince! |  |
| L35 | 10 | 해설 | 다음 날, 공주와 왕자는 성 뜰에서 함께 놀았어요. | The next day, the princess and the prince played together in the castle garden. |  |
| L36 | 10 | 왕자 | 이제 우리는 진짜 친구예요. | Now we are true friends. | 손잡기 톡 전 |
| L37 | 10 | 공주 | 응! 우리 같이 공놀이하자! | Yes! Let's play ball together! | 톡 뒤 |
| L38 | 10 | 해설 | 둘은 금공을 주고받으며 오래오래 사이좋게 지냈답니다. | And the two of them tossed the golden ball back and forth and were the best of friends for a long, long time. | 공 주고받기 위 |

`run()` 반환 문구(끝 화면)는 `'한 약속은 지켜요.'`(부제와 같다, `ui` 에 영어 있음). 교훈은 **대사로 읽지 않는다**.

## 7. 효과음 (sounds/sfx/<이름>.mp3, `AudioFX.sfx(name, vol)`) 과 팝 글자 자리

| 장면 | 순간 | 이름 | 팝 글자(자리) |
|---|---|---|---|
| 1 | 정답 | `sparkle` (없으면 tone 700→1400) + 엔진 `ding` | '반짝!' 동그라미 위 150 |
| 1·2 | 공 튀기 | `boing` (.3) ×3 / ×2 | '통통!' 공주 오른쪽 위(x+120, FL-300) |
| 2 | 공 날아감 | `swish` (.3) | (없음) |
| 3 | 풍덩 | `splash_big` (.5) | '풍덩!' 샘 위(POND.x, surf-130), 남색 |
| 3 | 울기 | (없음) | '엉엉' 공주 왼쪽 위(x-90, FL-270), 남색 |
| 4 | 개구리 올라옴 | `bubbles` (.4) | '뽀글뽀글' 개구리 오른쪽 위, 남색 |
| 5 | 잠수 / 올라옴 | `splash` (.4) / `bubbles` (.4) | '풍덩!' (POND.x+60, surf-110), 남색 |
| 5 | 공 건네기 | `paper_up` (.5) | (없음) |
| 5 | 달아남 | `step_grass` (.4, 400ms 마다) | '쌩!' 공주 뒤쪽 위(x+110, FL-250) |
| 6 | 똑똑 | `knock` (.5) ×2 | '똑똑!' 문 위(DOOR.x+40, 150), 갈색 |
| 6·7·9 | 폴짝 | `boing` (.25, 폴짝마다) | '폴짝' 첫 폴짝 때만(6장), 개구리 위 130 |
| 7 | 임금님 걸음 | `step_wood` (.4, 500ms 마다) | (없음) |
| 8 | 세기 박자 | 엔진 `countBeat` + `pop` (.4) + `vo('n1'..'n3')` | **없음**(목소리만) |
| 8 | 냠냠 | `chomp` (.5) ×2 | '냠냠' 개구리 위(TABLE_TOP-150) |
| 9 | 던지기 | `swish` (.5) | '휙!' 공주 머리 위 80(x+30, FL-310) |
| 9 | 베개 착지 | `paper_down` (.4) | '포옥' 개구리 위 100(BED.x, top-200), 남색 |
| 9 | 번쩍 | `sparkle` | '팡!' (BED.x, top-240), 금색 |
| 10 | 손잡기 | `sparkle` | '반짝!' 두 사람 머리 위(FL-300) |
| 10 | 공 주고받기 | `boing` (.3) ×2 | (없음) |
| 10 | 끝 | `tada` (없으면 sparkle) + 꽃잎(코드) | |
| 전환 | 책장 넘기기 | 엔진 기본 | |
| 톡·고르기 | 누름/정답/오답 | 엔진 `AudioFX.tap/ding/miss` | |

### 7-1. 효과음이 없을 때
`boing`·`splash`·`splash_big`·`bubbles`·`knock`·`chomp`·`pop`·`step_grass`·`step_wood`·`paper_up`·`paper_down`·`swish`·`sparkle`·`tada` 는 모두 `sounds/sfx/` 에 이미 있다. 그래도 `sfx(T, name, vol, fb)` 의 `fb` 로 `T.tone` 대체음을 둔다(`boing` → `T.tone([300, 600], .12, { vol: .15 })`, `knock` → `T.tone([900, 400], .1, { vol: .2 })`).

## 8. 카탈로그 항목 (`tales/catalog.js`, `red_car` 항목 뒤)
```js
  { id: 'frog_prince', title: '개구리 왕자', origin: 'world', also: ['princess'], skills: ['shape', 'count', 'heart'], ready: false, making: true,
    line: '금공 모양을 고르고 접시의 빵을 세어요. 금공을 찾아 준 개구리와 한 약속을 공주가 지키고, 개구리는 왕자가 돼요.',
    en: { title: 'The Frog Prince', line: 'Pick the shape of the golden ball and count the buns on the plate. The princess keeps her promise to the frog who found her ball, and the frog becomes a prince.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><ellipse cx="80" cy="96" rx="90" ry="22" fill="#BFD8EE"/>
      <ellipse cx="80" cy="74" rx="34" ry="24" fill="${c.pn}"/><circle cx="66" cy="52" r="11" fill="${c.sn}"/><circle cx="94" cy="52" r="11" fill="${c.sn}"/>${eye(66, 53, 4)}${eye(94, 53, 4)}
      <path d="M62 80 Q80 90 98 80" stroke="#2E241C" stroke-width="3" fill="none"/>
      <circle cx="128" cy="34" r="16" fill="${c.gd}"/><path d="M116 28 Q120 22 126 22" stroke="${c.cr}" stroke-width="3" fill="none"/></g>` },
```
태그: `shape`(1장 모양 고르기)·`count`(8장 빵 세기)·`heart`(약속). `origin: 'world'` + `also: ['princess']`(catalog.js 머리 주석의 공주 동화 규칙). 홈 카드 그림은 코드 SVG(크림 바탕, 연파랑 샘 타원, 큰 초록 개구리 + 흰 눈·점 눈, 오른쪽 위 금공). `c.pn` 이 없으면 `'#3F6B4F'` 를 직접 쓴다.

## 9. 썸네일·키아트 (인물 그림이 다 나온 뒤)

| 결과 파일 | 원본 | 만드는 법 |
|---|---|---|
| `assets/thumbs/frog_prince_key_wide.webp` (1672×941) | `assets/raw/keyart_gpt/frog_prince_wide_v5.png` | PIL: RGB → 16:9 가운데 자르기 → 1672×941 → webp quality 86 (`back_to_webp.py` 와 같은 식) |
| `…_key_tall.webp` (1086×1448) | `…_tall_v5.png` | 3:4 가운데 자르기 → 1086×1448 |
| `…_tile.webp` (720×540) | `…_tile_v5.png` | 4:3 가운데 자르기 → 720×540. `assets/thumbs/tiles.js` 의 `TILES` 에 `'frog_prince'` 추가 |
| `…_back_wide.webp` (1200×800) · `…_back_tall.webp` (1000×1150) | `…_backw_v5.png` · `…_backt_v5.png` | `~/.venvs/paper-tale/bin/python tools/app/gen/back_to_webp.py frog_prince` |
| `assets/thumbs/thumbs.js` | — | `THUMBSKEY` 에 `"frog_prince"`, `THUMBSKEYLIGHT["frog_prince"] = "#f5efe9"`, `BACKACCENT["frog_prince"] = "#3F6B4F"`(끝 화면 리본: Pine Green, 개구리·망토색). |

키아트 창 모양은 **금공(원)** 이고, 테두리 장식은 연잎 두 장과 작은 금공 하나뿐(§7-5: 소품 금지, 같은 계열 장식 최소). 참고 그림은 작업표의 `refs`(prin_stand·frog_sit·prop_ball / 끝 화면은 prin_hand·prince_hand·prop_ball)라 **인물 스프라이트가 모두 나온 뒤** 맨 마지막에 생성한다. 썸네일(타일)은 공주를 크게(70%), 개구리는 오른쪽 아래 작게, 겹 3개. 끝 화면 뒷표지는 성 뜰에서 공주와 왕자가 손잡은 그림(개구리 없음).

## 10. 그림 목록 (작업표 `jobs_frog_prince.json` 35장과 같다)

사람 세 명은 **같은 머리 크기**(공주 기준 그림을 `refs` 로 넣고 "SAME head size as the princess in the reference image"), 자세 그림은 기준 그림을 `refs` 로 넣고 "SAME SCALE AS THE REFERENCE SPRITE(머리·몸 크기를 기준 그림과 똑같이)"가 들어 있다(§4-1). 사람은 점 눈·점 코·종이 띠 입·분홍 볼, 개구리는 큰 흰 눈 + 점 눈동자 + 띠 입, 소품은 얼굴 없음. 던지기 관련 그림(`frog_fly`·`frog_surprise`)은 "NOT hurt, no tears, no pain lines" 가 프롬프트에 있다.

| 구분 | id (`assets/v3w/<id>.webp`) | 설명·방향 | 작업표 크기 | pass | 장면 |
|---|---|---|---|---|---|
| 인물·공주 | fp_prin_stand (기준) | 앞모습, 금발 땋은 머리·작은 왕관·노란 드레스, 빈손 | 600² | 1 | 3, 4, 5, 6, 9, 10 |
| | fp_prin_ball / cry / run(→) / refuse(←) / sorry / sit(←, 의자째) / throw(→) / hand(→) | 두 손 위로(공 없음) / 두 손으로 얼굴 가림 / 공 안고 달림(공 없음) / 손 내밀어 "그만" / 고개 숙임 / 의자에 앉아 웃음 / 던진 직후 빈손 / 손 내밂 | 600² | 2 | 1·2 / 3·4 / 5 / 6·7 / 7 / 8 / 9 / 10 |
| 인물·개구리 | fp_frog_sit (기준) | 앞모습 앉음, 초록, 큰 흰 눈 | 480² | 1 | 4, 5, 6, 7, 8, 9 |
| | fp_frog_ball / hop(→) / fly(→) / surprise | 공을 입에 묾(공 포함) / 옆모습 폴짝 / 둥글게 말고 날아감(놀란 눈, 다치지 않음) / 놀란 눈 'o' 입 | 480² / 840×480 / 840×480 / 480² | 2 | 5 / 6·7·9 / 9 / 9 |
| 인물·임금님 | fp_king_stand | 회색 수염, 작은 왕관, 빨간 옷, 손가락 들어 타이름, 살짝 왼쪽 향한 앞모습 | 600² | 2 | 7 |
| 인물·왕자 | fp_prince_stand / fp_prince_hand(→) | 갈색 머리, 왕관, 남색 옷, 초록 망토 / 손 내밂 | 600² | 2 / 3 | 9·10 / 10 |
| 소품 | fp_prop_ball | 금공(크림 초승달 조각) | 480² | 1 | 1~3, 5, 10 |
| | fp_prop_table / fp_prop_plate / fp_prop_bread / fp_prop_pillow | 긴 식탁 옆모습(빈 상판) / 빈 접시 / 빵 하나(3개 인스턴스) / 베개 | 840×480 / 840×480 / 480² / 840×480 | 1 | 6·7·8 / 8 / 8 / 9 |
| 배경 | fp_bg_yard / fp_bg_pond / fp_bg_dining / fp_bg_room | 성 뜰(왼쪽 성·오른쪽 나무, 낮 세트 A) / 숲속 샘(가운데 오른쪽 샘·왼쪽 돌, 낮) / 성 식당(왼쪽 열린 문·가운데 창·오른쪽 촛대, 저녁 세트 B, 식탁 없음) / 공주 방(오른쪽 침대 베개 없음·왼쪽 위 창·촛불, 밤 세트 B) | 1600×902 | 1 | 1·10 / 2~5 / 6~8 / 9 |
| 컷 | cut_splash / cut_ball / cut_king / cut_prince | 그림 컷 4장(§3 끝 컷신 표: 3·5·7·9장). refs 는 그 컷에 나오는 인물 스프라이트. 4:3, 얼굴 규칙 같음, 소품 얼굴 없음 | 1600×1200(4:3) | 3 | 3 / 5 / 7 / 9 |
| 키 | key_wide · key_tall · key_tile · key_backw · key_backt | 시작 화면(금공 모양 창)·홈 카드·끝 화면(손잡은 공주와 왕자) | 16:9 · 3:4 · 4:3 · 3:2 · 4:5 | — | — |

코드로 그리는 것(그림 아님): 도형 셋(1장), 물 파문(3장), 마법 빛(9장), 꽃잎(10장), 톡 자리(10장).

생성 순서: `pass 1`(기준 그림 11: prin_stand, frog_sit, 소품 5, 배경 4) → `pass 2`(14: 공주 자세 8, king_stand, prince_stand, 개구리 자세 4) → `pass 3`(1: prince_hand) → `pass 3`(컷 4: cut_splash, cut_ball, cut_king, cut_prince) → 키아트 5. 작업표가 이 순서로 정렬되어 있으므로 `run_simple.py frog_prince $(python3 -c "import json;print(' '.join(j['id'] for j in json.load(open('tools/app/gen/jobs_frog_prince.json'))))")` 처럼 앞에서부터 돌리면 된다.

받은 그림 점검(틀린 id 만 지우고 다시 만든다): 네 귀퉁이가 마젠타인지(`restyle_check.py` 방식) · 공주 `ball`·`run`·`throw` 손에 **공이 없는지**(있으면 다시) · `frog_ball` 에는 공이 **있는지** · `prin_refuse`·`prin_sit` 이 왼쪽, `prin_run`·`prin_throw`·`prin_hand`·`prince_hand`·`frog_hop`·`frog_fly` 가 오른쪽을 보는지(반대면 그림을 뒤집어 저장하지 말고 NAT 만 고친다) · `frog_fly`·`frog_surprise` 에 눈물·반창고·별·땀이 없는지 · 소품(공·식탁·접시·빵·베개)에 얼굴이 없는지 · 식탁 위에 접시·음식·의자가 없는지 · 배경 dining 에 식탁이 없고 room 에 베개가 없는지 · 공주 자세의 얼굴 폭이 stand 와 ±12% 안인지, 임금·왕자의 얼굴 폭이 공주와 ±12% 안인지 · 개구리 자세의 눈 폭이 sit 과 ±12% 안인지 · `frog_ball` 의 공 지름이 `prop_ball`(48) 과 ±15% 안인지.

## 11. 테스트 체크리스트 (코드가 끝난 뒤, 커밋 전)

준비
- [ ] 저장소 뿌리에서 `python3 -m http.server 8795`(다른 에이전트와 겹치지 않게 8795).
- [ ] 헤드리스 크롬: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9345 --user-data-dir=/tmp/fp_chrome --window-size=1366,1024 about:blank &`.
- [ ] 자동 재생: `CDP=9345 node assets/raw/_work/autoplay_audio.mjs http://127.0.0.1:8795/tales/frog_prince/index.html 1366 1024 /tmp/fp_l 600 8` (스크린샷 + `_audio.json`). 1장 보기 순서가 무작위이므로 **두 번 이상** 돌린다. 그림이 없는 동안은 자리표시로 끝까지 돌아야 한다(목업 통과 기준).

가로 1366×1024
- [ ] 끝까지 자동 재생되고 `errors` 에 예외가 없다(그림 404 는 자리표시 모드에서 정상).
- [ ] 첫 조작(1장 고르기)의 안내 L1 이 **시작 버튼 뒤 15초 안**에 끝난다(`_audio.json` 의 L1 시각 ≤ 14s). 넘으면 L0 뒤 `sleep(300)` 을 없앤다.
- [ ] 전체 길이 7~8.5분(`_audio.json` 마지막 클립 시각 + 끝 화면). 7분이 안 되면 §2-7 대로 `SCENE_END`·`GAP` 을 늘린다.
- [ ] **크기**: 공주 자세 9장의 얼굴 폭이 같다(1·3·5·6·7·8·9·10장 스크린샷을 나란히). 임금님(7장)·왕자(9·10장)의 머리가 공주와 같은 크기이고 키만 1.04~1.07배. 개구리 5자세의 눈 폭이 같다(4·5·6·9장). 금공이 1·2·3·5·10장에서 모두 지름 48 이고 5장 개구리 입의 공과 같다. 틀리면 `HT`(§2-2).
- [ ] **방향**: 5장 공주가 **왼쪽을 보며** 왼쪽으로 달린다. 6·9장 개구리가 오른쪽을 보며 오른쪽으로 폴짝인다. 7장 임금님이 오른쪽에서 들어와 왼쪽(공주)을 향한다. 6장 공주 손이 개구리 쪽(왼쪽)을 향하고 개구리에 닿지 않는다(190 이상 떨어짐). 10장 두 손끝이 톡 전엔 22px 떨어지고 톡 뒤 겹친다.
- [ ] **모양 고르기**: 세 도형이 같은 금색·같은 크기이고 자리가 돌 때마다 다르다. 오답 때 흔들림 + W 대사, 두 번째 오답부터 정답이 빛난다. 정답 뒤 공이 세 번 튄다.
- [ ] **샘**: 2장 공이 위로 갔다가 샘 윗선에 떨어지고, 3장 파문이 퍼지며 공이 사라진다. 4장 개구리가 물 윗선 아래는 보이지 않은 채 올라온다(클립). 5장 잠수 → 공을 물고 올라옴 → 공이 공주 품으로.
- [ ] **빵 세기**: 접시 톡 뒤 빵이 차례로 빛나며 들썩이고 `_audio.json` 에 `prin_` 클립 셋(하나·둘·셋)이 나온다. 화면에 **숫자 글자가 없다**. 빵 두 개가 사라지고 하나가 남는다.
- [ ] **던지기**: 개구리가 포물선으로 날아 베개 위(x = BED.x)에 내려앉고 벽·헤드보드에 닿지 않는다. 놀란 얼굴만 있고 아픈 표현이 없다. 번쩍 뒤 개구리가 사라지고 왕자가 침대 앞에 선다. 베개는 그대로.
- [ ] **끝**: 손잡기 톡 뒤 반짝 + 꽃잎, 공 주고받기 두 번, 끝 화면에 '한 약속은 지켜요.' 와 리본(`?endpreview=1`).
- [ ] 팝 글자가 인물 얼굴을 가리지 않는다(§7 자리: 1·2장 '통통!', 3장 '엉엉', 9장 '휙!'·'포옥'·'팡!', 10장 '반짝!').
- [ ] **컷 4장**이 그 사건 직후에만 뜨고(3장 `fp_cut_splash`, 5장 `fp_cut_ball`, 7장 `fp_cut_king`, 9장 `fp_cut_prince`) 각 컷 위에서 맞는 대사(L5·L12·L19·L33)가 들린다. 이웃한 장면에 컷이 연달아 없다. 컷 안 인물 얼굴이 점 눈·띠 입이고 소품에 얼굴이 없다.
- [ ] 누르는 자리: `.tap-target.armed` 의 `getBoundingClientRect()` 짧은 변이 **화면 60px 이상**(도형 셋·접시는 hitBox, 10장 톡 자리 120).

세로 390×844 (`node … 390 844 /tmp/fp_p 600 8`)
- [ ] 모든 조작 대상이 그 순간 화면 안에 있다(1장 도형 셋 470~650, 8장 접시 500, 10장 톡 자리 ≈ 509). 화면 밖이면 §3 의 P 좌표·`camSnap`·`follow` 를 고친다.
- [ ] 2장 공이 떨어질 때와 9장 개구리가 날아갈 때 카메라가 따라간다. 7장 세 명(개구리·공주·임금님)은 말하는 배역에게 카메라가 붙고(`director`), 내레이션에서 원래 화면으로 돌아온다. 카메라가 배경 밖을 보이지 않는다.

소리
- [ ] `_audio.json` 에서 **같은 클립이 연달아 두 번** 기록되지 않는다(이중 재생).
- [ ] NAR 줄 수 = 그 경로에서 지나간 대사 수(기본 경로 39줄 + 오답 수; `extra` 셋은 따로). 빠진 줄은 `say()` 문장을 §6 과 글자 단위로 맞춘다(대본을 고치지 말고 코드를 고친다).
- [ ] 영어: `localStorage.lang = 'en'` 으로 한 번 더 돌려 `narration_el_en.js` 클립과 `TEXT_EN` 장면 이름·팝 글자·안내가 나오고 **화면에 한글이 없다**(장면 카드·팝·끝 화면·부제 모두).
- [ ] 녹음 받아쓰기 점검: 녹음 전 `touch /tmp/fp_marker`, 녹음 뒤 `~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py frog_prince /tmp/fp_marker ko` 와 `… en`. `<<<`(되풀이) 클립은 **그 mp3 만 지우고** `gen_tale.py` 를 다시 돌린다(`--redo` 금지). 영어 v4 는 반드시 본다.
- [ ] 개구리(Will) 클립이 느리고 살짝 쉰 목소리로 들리되 웃음·말이 섞이지 않았다. 공주(Annie) 한국어 발음이 어색한 줄은 `settings.prin.stability` 를 .55 로 올려 그 줄만 다시.
- [ ] 2장 L4 와 공 날아가기, 3장 L5 와 파문, 9장 L32 와 던지기가 같이 끝난다(길면 애니메이션 시간을 늘리지 말고 뒤에 `sleep` 을 둔다).

마무리
- [ ] 홈(`index.html`)에서 '개구리 왕자' 카드가 만드는 중으로 보이고 `line` 이 §8 문구다. 공주 필터(`princess`)에 잡힌다.
- [ ] `git status` 에 다른 동화 파일 변경이 없다. `tales/frog/`(황소와 개구리)·`tales/kkultteok/` 은 손대지 않았다. 커밋은 사용자가 요청할 때.

## 12. 남은 판단
없음. (좌표 중 `POND`·`DOOR`·`BED`·`TABLE_TOP`·`BALL_UP`·`HAND_*` 는 받은 그림을 보고 ±20 안에서 맞추는 값이지 판단이 아니다.)
