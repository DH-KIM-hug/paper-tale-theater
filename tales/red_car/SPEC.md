# 나의 빨간 자동차 — 제작 상세 사양 (SPEC, 2026-10-21)

기획 확정본은 `PLAN.md`(10장, 창작 동화, 맨 아래 "확정 사항"이 최신). 이 문서는 그 기획을 **더 이상 판단 없이 코드로 옮길 수 있게** 장면마다 그림·좌표·크기·방향·조작·대사·효과음·타이밍을 적은 것이다. 참조 구현은 `tales/beauty_beast/beauty_beast.js`(**목업 자리표시**·`mk()`·`put()`·`sprite()`·`bgImage()`·HT 표)와 `tales/magpie/magpie.js`(고르기 `T.choose`·`director`·`vo()`), 그리고 `tales/snow_white/snow_white.js`(구조). 모르는 것이 있으면 그 파일들에서 같은 이름의 코드를 찾아 그대로 따른다.

확정 사항(PLAN 맨 아래)을 이 문서에 반영한 것:
- 이름 **이현이** 그대로. 이현이 목소리 **Sparkles for Kids**(남자아이). 대사에 성별 어휘 없음.
- 교훈은 대사로 말하지 않는다. 9장 "고마워" 없음. 교훈 문장은 부제와 끝 화면 글자(`run()` 반환값)로만 보인다.
- 7장 사이렌 맞추기 **없음** → 넷이 나란히 달리며 소리로 인사하는 자동 장면. 9장 수세기 **없음** → 한 줄 기차 + "맨 앞은 누구?" 고르기 1회.
- 톡 3번: 2장 나비(첫 톡), 8장 고리, 10장 이현이(인사). 배움 놀이 2개: 1장 색 찾기(첫 조작), 9장 순서 묻기. 연타 없음, 줄거리 선택 없음.
- 그림 목록에서 사이렌 반짝 소품(코드 glow 로 대체), 장난감 병원 소품(배경에 포함), 블록 아치 소품(배경에 포함), 불꽃 크기 3단계(한 장을 높이로 줄임), 물줄기 2장(한 장), 자동차 '멈춤' 자세(달리기 그림 그대로)를 뺐다.

## 0. 만들 파일과 순서

| 순서 | 파일 | 만드는 방법 |
|---|---|---|
| 1 | `tools/app/gen/jobs_red_car.json` | **이미 있음**(58장: 스프라이트 40 + 배경 9 + 컷 4 + 키아트 5, 접두어 `rc_`). 그림 생성: `python3 tools/app/gen/run_simple.py red_car <id ...>` 를 `pass` 1 → 2 → 3 순으로(참고 그림이 먼저 있어야 함), 컷(`rc_cut_*`)은 `pass 4`(참고 스프라이트가 다 나온 뒤), 키아트(`key5_*`)는 맨 뒤. 한도에 걸리면 run_simple.py 가 풀리는 시각까지 기다렸다 이어 간다. 받은 그림 점검은 §10. |
| 2 | 후처리 | `~/.venvs/paper-tale/bin/python tools/app/gen/post_tale.py red_car` → `assets/v3w/rc_<id>.webp`(스프라이트는 마젠타 크로마키 → 여백 없이 오림 → 높이 600(폭 900) 안, 배경 1600×902). 끝에 ASP(폭/높이)가 `tales/red_car/ASP.txt` 에 나온다 → 코드 `ASP` 표에 붙인다. **그림이 아직 없어도 코드는 자리표시(§1-1)로 돈다.** |
| 3 | `tales/red_car/index.html` | `tales/beauty_beast/index.html` 그대로 복사, `<title>나의 빨간 자동차</title>`, 마지막 스크립트 `red_car.js`. 합창 로더 한 줄 추가(백설공주 `index.html` 15행과 같은 꼴): `<script>try { if (localStorage.getItem('voice') !== 'tc') document.write('<script src="chorus_el.js"><\/script>'); } catch (e) { /* 합창 없이 */ }</script>` 를 `narration_el*` 로더 **뒤**, `entitlements.js` 앞에 둔다. `chorus_el.js` 가 아직 없어도 404 만 나고 동화는 돈다. |
| 4 | `tales/red_car/narration.js` | Typecast 없음. `/* red_car — Typecast 없음. ElevenLabs(narration_el.js)가 채운다 */\nconst NARRATION_CLIPS = {};\nconst VOICE_LINES = {};` |
| 5 | `tales/red_car/narration_en.js` | `const NARRATION_CLIPS_EN = {}; const VOICE_LINES_EN = {}; const TEXT_EN = {…};` — `TEXT_EN` 은 `voice_script_en.json` 의 `"ui"` 를 그대로 JSON 으로 붙인다(미녀와 야수 `narration_en.js` 와 같은 모양). |
| 6 | `tales/red_car/red_car.js` | 이 문서 §1~§6 대로 새로 쓴다. 그림이 없는 동안은 **자리표시 목업**으로 끝까지 돌아야 한다. |
| 7 | `tales/catalog.js` | §8 의 항목을 `beauty_beast` 항목 뒤에 추가(`making: true`). |
| 8 | 녹음 | `python3 tools/elevenlabs/gen_tale.py red_car --model eleven_v4 --dry`(2026-10-21 확인: 한국어 3,654자, 영어 `--lang en` 5,234자, 건너뛸 줄 0) → `--dry` 빼고 생성 → `audio/el/red_car/*.mp3` + `narration_el.js`, 영어 `audio/el/red_car/en/` + `narration_el_en.js`. 그 뒤 합창 §7-2. 녹음 뒤 `check_new.py` 되풀이 점검(§11). |
| 9 | 썸네일·키아트 | §9 (인물 그림이 다 나온 뒤). |
| 10 | 자동 재생 점검 | §11 체크리스트. |

커밋·푸시는 사용자가 요청할 때만 한다. 다른 동화 파일은 건드리지 않는다. `tales/kkultteok/`(가족 비공개편)의 그림·참고 사진은 **어떤 경로로도 쓰지 않는다**(이름만 같을 뿐 다른 인물).

## 1. 코드 구조 (`red_car.js`, beauty_beast.js 를 거울처럼)

```js
/* 나의 빨간 자동차 — 창작 동화(사용자 원고). 기획: tales/red_car/PLAN.md, 상세: SPEC.md (2026-10-21)
   톡 3번(2장 나비 · 8장 고리 · 10장 이현이), 배움 놀이 2개(1장 빨간 것 찾기 · 9장 맨 앞은 누구), 연타 없음, 줄거리 선택 없음. 교훈 대사 없음.
   두 세계: 사람 세계(1·2·10장)에서 자동차는 손에 쥐는 장난감(S_TOY = .32), 장난감 세상(3~9장)에서는 화면 주인공 크기(scale 1). 3장 머리에서 카메라가 자동차 눈높이로 내려간다(줌).
   크기: 같은 자동차는 자세가 달라도 바퀴 지름이 같다(HT 표). 자동차끼리는 길이 비율 red 1.0 : police 1.1 : tow 1.3 : amb 1.4 : fire 1.6.
   자동차 얼굴은 점 눈 둘뿐. 소품은 얼굴 없음. 사이렌은 효과음이 아니라 배역 목소리 의성어(vo).
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/rc_*.webp (목록 tools/app/gen/jobs_red_car.json) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { /* post_tale.py 출력(tales/red_car/ASP.txt). 그림이 오기 전엔 §2-1 의 시작값 */ };
  const LEN = { red: 150, police: 165, fire: 240, amb: 210, tow: 195 };   // 장난감 세상 길이(px, scale 1) — §2-2
  const HT  = { /* §2-2 */ };
  const NAT = { /* §2-3 */ };
  const FL = 505;                       // 바닥(바퀴·발끝 y)
  const S_TOY = .32;                    // 사람 세계에서 자동차 다섯 대에 공통으로 쓰는 축소 비율(§2-2). 그 밖에 s 를 쓰지 않는다
  const BGS = ['rc_bg_room', 'rc_bg_yard', 'rc_bg_gate', 'rc_bg_road_a', 'rc_bg_road_b', 'rc_bg_road_c', 'rc_bg_road_long', 'rc_bg_road_hill', 'rc_bg_playground'];
  const src = k => AS + k + '.webp';    // 배경·스프라이트 모두 파일 이름 전체(rc_…)로 부른다
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const artOK = {}, bgOK = {};          // preload 결과(그림이 실제로 있는지) — 없으면 자리표시
  function placeholder(T, parent, f, w, h) { … }   // §1-1
  function sprite(T, parent, f, x, y, w, h) { … }  // beauty_beast.js 117~122행 그대로(artSrc → src)
  const BGPH = { … };                   // §1-1 배경 자리표시 표
  function bgImage(T, key) { … }        // beauty_beast.js 124~133행 그대로(bgSrc → src, BGPH 키는 rc_… 전체 이름)
  function mk(T, poses) { … }           // beauty_beast.js 136~158행 그대로 (poses = { 이름: [그림, 높이] }, NAT 는 NAT[f])
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) { … }   // beauty_beast.js 그대로
  const hide, fadeIn, fadeOut, glow     // beauty_beast.js 그대로 (glow = hintGlow 필터 ms 동안)
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);
  const sfx = (T, name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });
  function hitBox(T, a, w = 100, h = 100) { … }    // §5-1 누르는 자리 넓히기
  function blink(a, n = 3) { … }        // §5-2 지붕 등 반짝(사이렌)
  function flutter(bf, ms) { … }        // §5-3 나비 날갯짓
  async function veil(T, change) { … }  // §5-4 같은 장면 안 배경 바꾸기(크림 종이 가림)
  function carCard(T, key, x, y, s) { … } // §5-5 자동차 카드(9장 고르기)
  async function run(T) { … }           // §3 장면 1~10
  Tale.mount({ title: '나의 빨간 자동차', subtitle: '서로 도우면 함께 갈 수 있어요', run: T => run(Tale.api) });
})();
```

`run(T)` 머리 부분:

```js
const { sleep, camSnap, tr } = T;
const GAP = 700, SCENE_END = 1500, DRIVE = 6000, LINE_DRIVE = 9000, SIREN_GAP = 2600;   // §2-7 속도 상수
const say = async text => { await T.say(text); await sleep(GAP); };
const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(삐뽀삐뽀!·톡!…)
const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
const X = (l, p) => (P ? p : l);
const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
AudioFX.preloadSfx(['paper_down', 'paper_up', 'swish', 'whoosh', 'rattle', 'knock', 'sparkle', 'tada', 'step_grass', 'pop', 'thud', 'splash', 'boing']);
/* 그림 파일 미리 받기: 있으면 쓰고(artOK/bgOK), 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 (little_mermaid.js 276~280행 그대로) */
const loads = [];
BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
await Promise.race([Promise.all(loads), sleep(4000)]);
// 배우 (자세 이름: [그림, 높이]) — 높이는 HT[그림]
const kid    = mk(T, { stand: ['rc_child_stand', HT.rc_child_stand], eat: ['rc_child_eat', HT.rc_child_eat], sleep: ['rc_child_sleep', HT.rc_child_sleep], point: ['rc_child_point', HT.rc_child_point],
                       run: ['rc_child_run', HT.rc_child_run], cry: ['rc_child_cry', HT.rc_child_cry], turn: ['rc_child_turn', HT.rc_child_turn], hug: ['rc_child_hug', HT.rc_child_hug] });
const red    = mk(T, { run: ['rc_red_run', HT.rc_red_run], joy: ['rc_red_joy', HT.rc_red_joy], tired: ['rc_red_tired', HT.rc_red_tired], hooked: ['rc_red_hooked', HT.rc_red_hooked] });
const police = mk(T, { run: ['rc_police_run', HT.rc_police_run], joy: ['rc_police_joy', HT.rc_police_joy] });
const fire   = mk(T, { run: ['rc_fire_run', HT.rc_fire_run], spray: ['rc_fire_spray', HT.rc_fire_spray], joy: ['rc_fire_joy', HT.rc_fire_joy] });
const amb    = mk(T, { run: ['rc_amb_run', HT.rc_amb_run], open: ['rc_amb_open', HT.rc_amb_open], joy: ['rc_amb_joy', HT.rc_amb_joy] });
const tow    = mk(T, { run: ['rc_tow_run', HT.rc_tow_run], pull: ['rc_tow_pull', HT.rc_tow_pull], joy: ['rc_tow_joy', HT.rc_tow_joy] });
const thiefA = mk(T, { run: ['rc_thief_a_run', HT.rc_thief_a_run], hands: ['rc_thief_a_hands', HT.rc_thief_a_hands] });
const thiefB = mk(T, { run: ['rc_thief_b_run', HT.rc_thief_b_run], hands: ['rc_thief_b_hands', HT.rc_thief_b_hands] });
const bear   = mk(T, { sit: ['rc_bear_sit', HT.rc_bear_sit], off: ['rc_bear_off', HT.rc_bear_off] });
const rabbit = mk(T, { sit: ['rc_rabbit_sit', HT.rc_rabbit_sit], off: ['rc_rabbit_off', HT.rc_rabbit_off] });
const bfly   = mk(T, { open: ['rc_prop_butterfly_open', HT.rc_prop_butterfly_open], fold: ['rc_prop_butterfly_fold', HT.rc_prop_butterfly_fold] });
const block = prop(T, 'rc_prop_block', HT.rc_prop_block), duck = prop(T, 'rc_prop_duck', HT.rc_prop_duck);
const house = prop(T, 'rc_prop_house', HT.rc_prop_house), flame = prop(T, 'rc_prop_flame', HT.rc_prop_flame), smoke = prop(T, 'rc_prop_smoke', HT.rc_prop_smoke);
const water = prop(T, 'rc_prop_water', HT.rc_prop_water), hook = prop(T, 'rc_prop_hook', HT.rc_prop_hook);
const CARS = [red, police, fire, amb, tow];
const ALL = [kid, ...CARS, thiefA, thiefB, bear, rabbit, bfly, block, duck, house, flame, smoke, water, hook];
ALL.forEach(hide);
T.director({ cast: { child: kid, red, police, fire, amb, tow }, noFace: ['child', 'red', 'police', 'fire', 'amb', 'tow'] });
```

`T.director` 는 세로 화면에서만 말하는 배역에게 카메라를 붙인다(가로는 무대 전체가 보임). 방향은 장면에서 직접 정하므로 `noFace` 에 전부 넣는다. cast 키는 대본의 배역 키(`child`·`red`·`police`·`fire`·`amb`·`tow`)와 같아야 한다.

### 1-1. 자리표시(목업) 규칙 — 그림이 없을 때
`beauty_beast.js` 의 `placeholder()`·`sprite()`·`BGPH`·`bgImage()` 를 그대로 가져와 이 동화의 표로 바꾼다. 자리표시는 **그림과 같은 상자(w×h)** 안에 그리므로 그림이 생기면 코드 변경 없이 바뀐다. 이름표(`.phl`)는 뒤집혀도 글자가 뒤집히지 않게 `a.place` 를 덮어쓴 부분까지 같이 가져온다.

| 그림 | 자리표시 모양 | 색 |
|---|---|---|
| `rc_child_*` | 큰 동그라미 머리(상자 폭의 .42, 머리 폭이 전체 높이의 .4 = 2.5등신) + 노란 직사각 몸 + 파란 반바지 두 조각 + 검은 머리 반원. `sleep` 은 누운 상자라 머리를 왼쪽에, 몸을 오른쪽에 가로로 | 머리 `#F3D9B8`, 머리카락 `#2E241C`, 티셔츠 `#D9A94E`, 반바지 `#1F2A56` |
| `rc_red_*` `rc_police_*` `rc_fire_*` `rc_amb_*` `rc_tow_*` | 둥근 직사각 몸(상자 폭 ×.96, 높이 ×.62, 아래에서 .3 띄움) + 창 띠(크림, 앞쪽 .4) + 바퀴 원 2개(지름 = 상자 높이 ×.34, x = 폭 ×.22 와 ×.78) + **점 눈 2개**(검정 r 3, 앞창 위에 나란히). 소방차는 지붕에 흰 사다리 띠, 구급차는 빨간 십자, 경찰차는 지붕 등 두 점(빨강·남색), 견인차는 뒤쪽 위로 올라간 갈색 팔 띠. `joy` 는 눈 대신 작은 별 2개, `tired` 는 눈을 반달 선으로, `hooked` 는 몸을 -18° 돌림 | red `#A93B32`, police `#F4F6FA`(남색 띠), fire `#A93B32`(흰 띠), amb `#F4F6FA`(빨간 십자), tow `#E8703A`; 바퀴 `#1F2A56` |
| `rc_thief_*` | 작은 줄무늬 직사각 + 동그라미 머리 + 검은 눈가리개 띠(눈 2점은 크림) | a 줄무늬 `#1F2A56`, b `#6B4A32` |
| `rc_bear_*` `rc_rabbit_*` | 동그라미 머리+타원 몸, 점 눈 2개 | 곰 `#6B4A32`, 토끼 `#F6ECD8`(귀 2개) |
| `rc_prop_block` / `rc_prop_duck` / `rc_prop_butterfly_*` / `rc_prop_house` / `rc_prop_flame` / `rc_prop_smoke` / `rc_prop_water` / `rc_prop_hook` | 남색 정사각 / 노란 타원+주황 부리 / 노란 날개 두 타원 / 노랑 사각+주황 삼각 지붕 / 주황 물방울 / 회색 구름 / 연파랑 호 / 회색 J 선 | 팔레트 토큰. **얼굴 없음** |
| 배경 `rc_bg_*` | 평평한 종이 한 장(하늘색) + 바닥 띠(y 412~) + 요소 2~3개 + 위에 "(그림 자리) 배경: 이름" 글자 | room: 벽 `#F6ECD8`·바닥 `#D9A94E`·창 사각 / yard: 하늘 `#EEF3F7`·풀 `#9DBB7A`·꽃 원 2 / gate: 풀 왼쪽 1/3 + 블록 길(노랑·크림 체크 사각 8개) + 아치(남색 기둥 2 + 빨간 반원) / road_a·b·c·long·hill: 블록 길 + 나무(갈색 사각+초록 원) / road_c 는 오른쪽에 흰 건물+빨간 십자 / hill 은 오른쪽에 계단 사각 4개 / playground: 모래 `#E9DCC0` + 미끄럼틀(노란 사각+주황 사선) |

자리표시 이름표 글자: 인물은 `WHO[who] + ' ' + POSE[pose]`(예: "이현이 달리기", "소방차 물 뿌리기"), 소품은 `PROPN[f]`(예: "파란 블록"). 글자는 §6 과 무관(녹음 없음).

## 2. 공통 수치

### 2-1. 그림 비율(ASP, 폭/높이) — 시작값(그림이 오면 post_tale.py 값으로 바꾼다; preload 가 실제 비율로 덮어쓴다)
```
rc_child_stand .45, rc_child_eat .80, rc_child_sleep 1.90, rc_child_point .55, rc_child_run .62, rc_child_cry .45, rc_child_turn .50, rc_child_hug .55,
rc_red_run 1.58, rc_red_joy 1.58, rc_red_tired 1.62, rc_red_hooked 1.45,
rc_police_run 1.74, rc_police_joy 1.74, rc_fire_run 1.80, rc_fire_spray 1.95, rc_fire_joy 1.80, rc_amb_run 1.69, rc_amb_open 1.69, rc_amb_joy 1.69,
rc_tow_run 1.55, rc_tow_pull 1.55, rc_tow_joy 1.55,
rc_thief_a_run .70, rc_thief_a_hands .62, rc_thief_b_run .70, rc_thief_b_hands .62, rc_bear_sit .95, rc_bear_off .80, rc_rabbit_sit .80, rc_rabbit_off .62,
rc_prop_block 1.0, rc_prop_duck 1.15, rc_prop_butterfly_open 1.45, rc_prop_butterfly_fold .95, rc_prop_house .95, rc_prop_flame .62, rc_prop_smoke 1.15, rc_prop_water 1.75, rc_prop_hook .55
```

### 2-2. 높이(HT) — 같은 인물·자동차는 자세가 달라도 같은 크기 (CLAUDE.md §4-1)
무대 1000×560, 바닥 `FL = 505`. 높이는 그림 상자가 아니라 **같은 부위의 크기**가 같아지도록 정한다.

**자동차(장난감 세상, scale 1) — 길이와 바퀴 지름으로 맞춤.**
- 기준 자세(`*_run`)의 높이는 길이에서 계산한다: `HT[rc_red_run] = LEN.red / ASP.rc_red_run` (150/1.58 ≈ 95), police 165/1.74 ≈ 95, fire 240/1.80 ≈ 133, amb 210/1.69 ≈ 124, tow 195/1.55 ≈ 126. 코드에서는 상수가 아니라 **식**으로 쓴다(ASP 가 preload 로 바뀌어도 길이가 유지되게): `HT.rc_red_run = LEN.red / ASP.rc_red_run` 를 preload 뒤에 계산한다.
- 같은 자동차의 다른 자세(`joy`·`tired`·`hooked`·`spray`·`open`·`pull`)는 **바퀴 지름이 기준 자세와 같게**: `HT[자세] = HT[run] × (wd_run/H_run) ÷ (wd_pose/H_pose)` (wd = 원본 PNG 에서 잰 바퀴 지름 px, H = 원본 bbox 높이 px). 그림이 오기 전 시작값은 `HT[자세] = HT[run]`(같은 크기로 그리라고 했으므로), `rc_red_hooked` 만 `HT.rc_red_run × 1.18`(앞이 들려 상자가 높다). 받은 뒤 바퀴를 재서 고친다. ±12% 밖이면 그 자세만 다시 생성한다.
- **2026-10-21 그림이 온 뒤 잰 값(결정)**: 바퀴 지름(폭 대비)을 재니 빨간 차 33.5 · 경찰차 36 · 소방차 44 · 구급차 44 · 견인차 42.6 px(길이 150/165/240/210/195 기준)라 큰 차 셋이 +27~31% 였다. 큰 차 바퀴가 +20% 안(≈40px)에 들도록 `LEN` 을 소방 218 · 구급 191 · 견인 183 으로 줄였다(길이비 1 : 1.1 : 1.45 : 1.27 : 1.22). 줄 서기 좌표는 `chain()` 으로 길이에서 계산한다. 사람 세계 축소 `S_TOY` 는 .32 → .42(자동차가 너무 작아 보여서), 3장 줌 배율은 1/S_TOY 로 계산한다. 도둑 높이 57 → 76, 나비 44 → 60.
- 자동차 다섯 대의 바퀴 지름은 프롬프트에서 같게 했으므로 화면에서도 비슷해야 한다(기준 ≈ 32px). 길이 비율(1.0 : 1.1 : 1.6 : 1.4 : 1.3)이 우선이고, 바퀴가 ±20% 넘게 다르면 그 자동차의 기준 그림을 다시 생성한다.
- **사람 세계(1·2·10장)에서는 다섯 대 모두 `s: S_TOY = .32`** 로 둔다(빨간 자동차 길이 48 ≈ 이현이 머리 폭 80 의 0.6, PLAN 비율). 사람 세계 안에서는 바꾸지 않는다. 장난감 세상(3~9장)은 전부 `s: 1`. **그 밖에 `s` 를 쓰지 않는다**(원근 축소 없음).

**이현이 — 얼굴 폭(귀~귀)으로 맞춤.** 시작값 `rc_child_stand 230`, `point 230`, `run 225`, `cry 230`, `turn 230`, `hug 240`(발이 떠서 상자가 높다), `eat 180`(의자째 앉은 상자), `sleep 115`(누운 상자). 받은 뒤 얼굴 폭을 재서 `HT[자세] = 230 × (fw_stand/H_stand) ÷ (fw_pose/H_pose)` 로 고친다. 머리 크기는 다른 동화의 사람 인물(2.5등신)과 같다.

**단역·소품**
| 그림 | HT | 비고 |
|---|---|---|
| rc_thief_a_run, rc_thief_b_run | **57** | 빨간 자동차 높이(95)의 0.6 |
| rc_thief_a_hands, rc_thief_b_hands | 57 (손 들어 상자가 높으면 머리 폭을 run 과 맞춰 ±8) | |
| rc_bear_sit, rc_rabbit_sit | **56** | 창 안에 앉은 크기 |
| rc_bear_off, rc_rabbit_off | 60 (머리 폭을 sit 과 맞춤) | 자동차 높이 95 의 0.6 ≈ 57 |
| rc_prop_butterfly_open | **44** | 사람 세계에서 이현이 손바닥 크기 |
| rc_prop_butterfly_fold | 몸통 길이를 open 과 같게(시작 44) | |
| rc_prop_block | **42** | 1장 고르기 보기 |
| rc_prop_duck | **46** | 1장 고르기 보기 |
| rc_prop_house | **170** | 5장 블록 집 |
| rc_prop_flame | **90** → 50 (작아짐) | 불꽃 한 장을 높이만 줄인다(§3 장면 5) |
| rc_prop_smoke | **40** | |
| rc_prop_water | **60** (폭 ≈105) | |
| rc_prop_hook | **70** | 8장 톡 대상(§5-1 로 누르는 자리 90×90) |

**카메라 줌(3장)**: `T.camTo(300, 470, 3.1, 3000)` — 사람 세계의 빨간 자동차(길이 48)가 3.1배로 보여 ≈149 가 되어 장난감 세상 크기(150)와 같아진다. 이것이 "작아지는 게 아니라 가까이 간다"의 구현이다(PLAN 판단 4).

### 2-3. 그림이 보는 쪽(NAT) — 뒤집기 규칙
`mk()` 는 `NAT` 가 `'front'` 가 아니고 원하는 쪽과 다르면 좌우로 뒤집는다.

| 그림 | NAT | 비고 |
|---|---|---|
| rc_child_stand, cry, turn, hug | front | 안 뒤집음 |
| rc_child_eat, run, point | **right** | 프롬프트대로면. 반대로 오면 NAT 만 고친다(그림을 뒤집어 저장하지 않는다) |
| rc_child_sleep | right(머리 왼쪽) | 누운 그림은 뒤집지 않는다(`turn` 을 부르지 않음) |
| rc_red_*, rc_police_*, rc_fire_*, rc_amb_*, rc_tow_* | **right** | 모든 자동차는 오른쪽을 보고 달린다. 이 동화에서는 자동차를 **한 번도 뒤집지 않는다**(왼쪽으로 가는 장면 없음) |
| rc_thief_a_run, rc_thief_b_run | right | 오른쪽으로 달아남 |
| rc_thief_*_hands, rc_bear_*, rc_rabbit_* | front | |
| rc_prop_duck, rc_prop_water, rc_prop_hook | right | 오리 부리·물줄기·고리 입이 오른쪽 |
| 나머지 소품 | front | |

### 2-4. 겹침 순서(z)
`put()` 은 `T.world` 맨 뒤(가장 앞)에 붙인다. 뒤에 있어야 하는 것을 먼저 `put` 한다.
- 1장: 이현이 → 장난감 셋(바닥 앞쪽) → 손에 얹은 자동차는 이현이 **뒤에** 보이면 안 되므로 자동차를 마지막에 put.
- 2장: 이현이 → 자동차(손) → 나비(맨 앞).
- 4장: 도둑 둘 → 경찰차 → 빨간 자동차.
- 5장: 블록 집 → 불꽃 → 연기 → 소방차 → 물줄기(소방차 앞) → 경찰차 → 빨간 자동차.
- 6장: **구급차** → 인형 둘(앉기, 창 위에 얹음 — 창이 불투명이라 인형이 앞) → 내린 인형(`off`, 다시 put) → 경찰차·빨간·소방차.
- 7·9장: 뒤에서 앞 순서 = 구급차 → 소방차 → 경찰차 → 빨간 자동차 → 견인차(앞차가 앞). 고리는 견인차 뒤·빨간 자동차 앞.
- 8장: 셋(구급차·소방차·경찰차) → 빨간 자동차 → 견인차(앞 차선, `y = FL + 14`) → 고리(맨 앞).
- 10장: 이현이 → 자동차 다섯(앞). 안을 때는 자동차를 이현이 앞에 둔다(품에 안은 모양).

### 2-5. 세로 화면 규칙
- `P` 일 때 보이는 폭은 약 260. 한 컷에 **둘까지만** 보이게 좌표를 모으고(`X(l, p)` 의 p 값), 세 명 이상은 `director`/`follow` 가 말할 때 데려온다.
- **아이가 눌러야 하는 것은 모두 한 화면(±130) 안**: 1장 장난감 셋(`camSnap(560)` 기준 470·560·650), 2장 나비(640), 8장 고리(카메라 696, `follow(696)` 뒤), 9장 카드 다섯(2줄, §5-5), 10장 이현이(560).
- 카메라 y 는 280, z 는 1 로 고정. **예외는 3장 줌 하나**(§2-2).
- 7·9장의 한 줄은 세로에서 다 보이지 않는다. 달리는 동안 `follow(앞차.x)` 로 앞을 보여 주고, 사이렌 인사는 소리 내는 차로 `follow` 한다.

### 2-6. 누르는 자리 크기
- 톡·고르기 대상은 화면에서 **짧은 변 60 무대 px 이상**. 작은 것(1장 장난감 48~46, 2장 나비 44, 8장 고리 70)은 `hitBox()`(§5-1)로 투명 사각을 뒤에 깔아 100×100(고리 90×90)으로 넓힌다. `T.tap`/`T.choose` 에는 그 `hit` 그룹(`a.pos`)을 넘긴다. 10장 이현이(230)는 그대로.
- 톡 대상은 기다리는 동안 살짝 들썩인다: `a.pos.animate([{translate:'0 0'},{translate:'0 -5px'},{translate:'0 0'}], {duration: 900, iterations: 3})`.

### 2-7. 속도 (한 편 7분 이상이 목표)
- `say()` 뒤 `GAP = 700`ms. 장면 끝(다음 `sceneCard` 전) `sleep(SCENE_END = 1500)`.
- 자동차 들어오기·나가기는 `DRIVE = 6000`ms 안팎(linear), 한 줄 기차 이동 `LINE_DRIVE = 9000`ms. 7장 사이렌 인사 사이 `SIREN_GAP = 2600`ms.
- 달리는 동안 바퀴 대신 몸이 들썩인다: `a.hop(3, 460)` 을 이동 시간 동안 반복(`while` + `await hop`). 모든 이동 장면 공통.
- 대사 중 `hop`·`wiggle` 은 한 번만. 컷 그림(`cutImage`)은 **4장**(§3 끝 "컷신" 표; `CUT_HOLD = 4200`ms, 컷 위에서 기존 대사 한 줄을 읽는다 — 까치 방식).
- 전체 목표 7~8.5분. §11 에서 잰다. 7분이 안 되면 `SCENE_END` 를 2000, `DRIVE` 를 7200 으로; 9분을 넘으면 `SCENE_END` 1200, `DRIVE` 5000(대사는 건드리지 않는다).

## 3. 장면별 상세

표기: `L(x)` 가로, `P(x)` 세로 좌표. 대사는 §6 표의 번호. 효과음 이름은 `sounds/sfx/` 파일명(§7). 모든 장면은 `await T.sceneCard(tr('이름'), () => { … }, focus.pos)` 로 넘어간다(1장만 `T.curtain(true)`). 자동차가 달릴 때는 항상 §2-7 의 `hop(3, 460)` 반복을 같이 돌린다.

### 장면 1. 언제나 함께 (배움 놀이 1: 빨간 것 찾기 — 첫 조작, 시작 뒤 15초 안)
- `scene('rc_bg_room')`. 이현이 `stand` L300/P420, `FL`, `to:'right'`(앞모습이라 안 뒤집힘). 장난감 셋을 바닥 앞쪽에: 자리 `spots = X([480, 600, 720], [470, 560, 650])`, y `FL + 6`. **순서는 매번 무작위**: `const kinds = ['red', 'block', 'duck'].sort(() => Math.random() - .5)` → `red` 는 `put(T, red, x, FL + 6, { look: 'run', s: S_TOY })`, `block`/`duck` 은 `put(T, block|duck, x, FL + 6)`. 각 장난감에 `hitBox(T, a, 100, 100)`. P: `camSnap(560)`. `await T.curtain(true)`.
- **L0** → `sleep(300)` → **L1**(안내) → `await T.choose(opts, { prompt: '빨간 것은 어디 있을까요? 찾아봐요.' })`:
  - `opts = kinds.map(k => ({ el: hitOf(k), ok: k === 'red', onWrong: async () => { await wiggleEl(hitOf(k)); await say(k === 'block' ? W_block : W_duck); } }))` — `W_block`·`W_duck` 는 §6 과 글자 하나까지 같다. `wiggleEl` 은 엔진 `choose` 의 흔들림과 같은 것(magpie.js 와 같이 로컬에 복사).
  - 2회 오답부터 정답(빨간 자동차)이 빛나며 들썩이고 나머지는 흐려진다(엔진). 정답 위치를 먼저 알려 주지 않는다.
- 정답: `AudioFX.ding()`(엔진) → `glow(red, 1200)` + `sparkleSfx(T)` + `T.pop(red.x, FL - 60, tr('반짝!'))` → **C1** → 블록·오리 `fadeOut(400)` → 자동차가 손으로: `red.move(kid.x + 42, FL - 92, 700, 'ease-out')`(손 기준점 `HAND.stand = [+42, -92]`, 받은 그림에서 쥔 손 위치를 보고 ±15 조정) + `AudioFX.sfx('paper_up', .5)` → `kid.hop(10, 320)`.
- **L2**(한 줄에 두 컷): `say(L2)` 와 동시에 타이머: 0ms `kid.look('eat', 'right')`, 자동차를 `HAND.eat = [+38, -98]` 에 `place`, `T.pop(kid.x + 80, FL - 230, tr('냠냠'))`; **2,400ms** 뒤 `kid.look('sleep')`, `kid.place(X(330, 450), FL)`, 자동차를 `HAND.sleep = [+60, -30]` 에, `tint(T, '#1F2A56', 0)` 을 만들어 `anim` 으로 opacity 0→.22 900ms, `T.pop(kid.x + 40, FL - 150, tr('쌔근'), '#1F2A56')`. 구현: `const t = (async () => { …0ms…; await sleep(2400); …sleep 컷… })(); await say(L2); await t;`.
- `sleep(SCENE_END)`. 시작 버튼부터 고르기 안내 L1 끝까지 ≤ 15초(§11).

### 장면 2. 나비다! (톡 1 — 나비, 첫 톡)
- `sceneCard(tr('나비다!'))`, 배경 `rc_bg_yard`. 틴트 없음. 이현이 `stand` L380/P480, `FL`; 자동차 `run` `s: S_TOY` 를 `HAND.stand` 에(이현이 **뒤에** put 하지 말고 뒤에 put = 앞에 보임). 나비 `open` L700/P640, y **300**(공중), `hitBox(T, bfly, 100, 100)`, `flutter(bfly)` 시작(§5-3). focus: 나비. P: `camSnap(560)`.
- **L3** → 이현이 `look('point', 'right')` + `hop(8, 300)` → **L4**(이현이) → 나비 들썩임(§2-6) → `await T.tap(bfly.hit)`(안내 문장 없음 — 손가락 힌트만).
- 톡 뒤: `AudioFX.sfx('swish', .4)` + `T.pop(bfly.x, bfly.y - 50, tr('팔랑팔랑'))` + 나비 `move(1150, 120, 2800, 'ease-in')`(flutter 계속). 동시에 이현이 `look('run', 'right')` → `kid.move(X(640, 600), FL, 1800, 'linear')`; 달리기 시작 **500ms** 뒤 자동차 떨어짐: 자동차를 이현이 손에서 떼어 `red.move(kid.x + 20, FL + 6, 500, 'ease-in')`(현재 손 위치에서 바닥으로) + `AudioFX.sfx('paper_down', .5)` + `vo('tok')` + `T.pop(red.x, FL - 40, tr('톡!'))`. 이동이 끝나면 `hide(bfly)`.
- **L5** → 이현이 `look('stand')` → 두리번: `kid.face('left'); await sleep(350); kid.face('right'); await sleep(350); kid.face('left')`(앞모습이라 실제로는 뒤집히지 않으니 `kid.wiggle(5, 500)` 두 번으로 대신한다) + `T.pop(kid.x, FL - 260, tr('두리번'))` → **L6** → 이현이 `look('cry')` + `T.pop(kid.x - 40, FL - 220, tr('잉잉'), '#1F2A56')` → **L7**(이현이) → `sleep(SCENE_END)`.
- 빨간 자동차는 L6 뒤에도 **풀밭 그 자리(이현이 뒤쪽 바닥)** 에 그대로 있다(아이는 보이지만 이현이는 못 본 것으로 둔다).

### 장면 3. 장난감 세상으로 붕붕! (자동 — 카메라 줌 → 장난감 세상)
- 컷 A: `sceneCard(tr('장난감 세상으로 붕붕!'))`, 배경 `rc_bg_yard`(2장과 같은 풀밭). 이현이 없음. 자동차 `run` `s: S_TOY` 를 **L300/P300**, `FL + 6` 에. `camSnap(500, 280, 1)`.
- **L8** 과 동시에 줌: `T.camTo(300, 470, 3.1, 3000)`(§2-2; 자동차가 화면에서 ≈149 길이로 커진다) → L8 이 끝나면 `sleep(600)`.
- 컷 B(같은 장면 안, 배경만): `await veil(T, () => { T.clear(); bgImage(T, 'rc_bg_gate'); camSnap(500, 280, 1); put(T, red, X(200, 380), FL, { look: 'run', s: 1 }); })`(§5-4: 크림 종이가 350ms 덮고 350ms 걷힌다). 이제 자동차는 장난감 세상 크기.
- **L9**(빨간 자동차, `hop(6, 300)` 한 번) + `vo('vroom')` 는 쓰지 않는다(L9 에 부릉부릉이 들어 있음) → 출발: `red.move(1150, FL, DRIVE, 'linear')` + hop 반복 + `AudioFX.sfx('rattle', .25)` 를 1,200ms 마다(장난감이 굴러가는 소리) + 아치(배경 속 ≈ x 700) 를 지날 때(이동 시작 약 2,700ms) `T.pop(700, 250, tr('부릉부릉!'))`. P: `follow(red.x)` 대신 카메라를 `camTo(700, 280, 1, 2500)` 로 아치에 둔다. `await` 이동 → `sleep(SCENE_END)`.

### 장면 4. 경찰차 형아 (자동)
- `sceneCard(tr('경찰차 형아'))`, 배경 `rc_bg_road_a`. 배치(put 순서): 도둑 A `run` L520/P560, `FL` · 도둑 B `run` L580/P620, `FL` · 경찰차 `run` L300/P400, `FL`. 빨간 자동차는 아직 밖(L-120). focus: 경찰차. P: `camSnap(520)`.
- **L10** 과 동시에: `vo('siren_police')` + `blink(police)`(§5-2) + `T.pop(police.x, FL - 150, tr('삐뽀삐뽀!'))`; 추격: 도둑 둘 `move(+300, FL, 3200, 'linear')` + 각 `hop(8, 300)` 반복, 경찰차 `move(+300, FL, 3200, 'linear')` + hop 반복(세 배우 `Promise.all`). P: `follow(620, 3200)`.
- **L11**(경찰차) → 도둑 둘 `look('hands')` + `hop(12, 320)` + `AudioFX.sfx('boing', .4)`(잡혔다) → **L12**(이 대사 중 `T.pop(police.x, FL - 150, tr('씽씽!'))` 한 번).
- 빨간 자동차 등장: `put(T, red, -120, FL, { look: 'run' })` → `red.move(X(430, 380), FL, 2500, 'ease-out')` + hop 반복 + `rattle` .25 → **L13**(빨간) → **L14**(빨간, `hop(8, 300)`) → **L15**(경찰차 `look('joy')` 한 번, `hop(8, 300)`) → **L16** 과 동시에 둘이 오른쪽으로 나감: 경찰차 먼저 `move(1200, FL, DRIVE, 'linear')`, 400ms 뒤 빨간 자동차 `look('run')` + `move(1200, FL, DRIVE, 'linear')`(둘 다 hop 반복) → 도둑은 손 든 채 그 자리 → `await` 이동 → `sleep(SCENE_END)`.

### 장면 5. 소방차 이모 (자동 — 불 끄기)
- `sceneCard(tr('소방차 이모'))`, 배경 `rc_bg_road_b`(오른쪽 1/3 에 빈 터). 배치(put 순서): 블록 집 `house` **L800/P700**, `FL - 30`(터 위; 받은 배경의 터 높이에 맞춰 ±20) · 불꽃 `flame` `(house.x - 12, house.y - 158)` 높이 90(지붕 꼭대기; ±15 조정) + 불꽃 흔들림 `flame.wiggle(4, 600)` 반복 · 소방차 `spray` **L520/P470**, `FL`(호스가 집을 향함) · 물줄기 `water` 를 소방차 호스 끝 `NOZ = [+118, -92]` 에서 오른쪽으로: `put(T, water, fire.x + 118 + 52, FL - 92 + 20)`(폭 ≈105 의 왼쪽 끝이 호스 끝; ±15 조정) + 물 흔들림(§5-6). 빨간·경찰차는 밖. focus: 소방차. P: `camSnap(560)`.
- **L17** 과 동시에 `vo('siren_fire')` + `blink(fire)` + `T.pop(fire.x, FL - 190, tr('위이잉!'))`.
- **L18**(소방차, `hop(6, 300)`) → **L19** 와 동시에 불이 꺼진다: L19 시작 0ms `AudioFX.sfx('splash', .35)` + `T.pop(flame.x, flame.y - 110, tr('쉭쉭!'))`; **1,500ms** 불꽃 높이 90 → 50(`flame.body.animate([{scale:1},{scale:.56}], {duration: 600, fill:'forwards'})` 로 줄인다 — 그림 교체 없이 한 장을 줄이는 것은 불이 작아지는 사건이라 허용) + `splash` 한 번 더; **3,200ms** `fadeOut(T, flame, 400)` → `put(T, smoke, flame.x, flame.y - 10)` `fadeIn(400)` + 연기 위로: `smoke.move(smoke.x + 10, smoke.y - 60, 2400, 'ease-out')` 와 `opacity 1→0`(`anim(smoke.pos, …, 2400)`) → `hide(smoke)`; 물줄기는 불꽃이 사라질 때 `hide(water)`, 소방차 `look('run')`.
- 경찰차·빨간 자동차 등장(왼쪽에서): 경찰차 `put(-200)` → `move(X(150, 300), FL, 2800, 'ease-out')`, 300ms 뒤 빨간 자동차 `put(-120)` → `move(X(330, 440), FL, 2800, 'ease-out')`(둘 다 hop 반복 + `rattle`). P: `follow(440)`.
- **L20**(빨간, `hop(8, 300)`) → **L21**(소방차 `look('joy')`, `hop(8, 300)`) → **L22** 와 동시에 셋이 나감: 경찰차 → 400ms 뒤 빨간 → 400ms 뒤 소방차 `look('run')`, 모두 `move(1250, FL, DRIVE, 'linear')` + hop → `await` → `sleep(SCENE_END)`.

### 장면 6. 구급차 삼촌 (자동 — 인형 내려 주기)
- `sceneCard(tr('구급차 삼촌'))`, 배경 `rc_bg_road_c`(오른쪽에 병원, 문이 건물 왼쪽 모서리 ≈ x 760). 구급차 `run` 은 왼쪽 밖 L-250/P-250 에서 시작. 인형 둘 `sit` 을 구급차 창 자리에: `WIN = [[-30, -62], [+8, -62]]`(구급차 중심·바닥 기준 오프셋, 받은 그림의 큰 옆창 위치에 맞춰 ±15). 창 그림은 불투명 크림이라 **구급차를 먼저 put 하고 인형을 나중에(앞에) put** 한다. 인형 높이 56 은 창 안에 들어가는 크기이고, 인형이 창 밖으로 삐져 보이면 y 를 +8 한다. focus: 구급차. P: `camSnap(600)`.
- **L23** 과 동시에 구급차 들어옴: `amb.move(X(620, 600), FL, DRIVE, 'linear')` + hop 반복 + `rattle`; 인형 둘도 같은 시간·같은 easing 으로 `move(amb.x목표 + WIN[i][0], FL + WIN[i][1], DRIVE, 'linear')`(`Promise.all`); 이동 시작 800ms 뒤 `vo('siren_amb')` + `blink(amb)` + `T.pop(amb.x, FL - 170, tr('삐용삐용!'))`. P: `follow(600, DRIVE)`.
- **L24** → 구급차 `look('open')` + `AudioFX.sfx('door', .5)` → 인형 둘 `look('off')` 로 바꾸고 땅으로: `bear.move(X(700, 680), FL, 900, 'ease-in')`, `rabbit.move(X(745, 725), FL, 900, 'ease-in')` + `paper_down` .4 + 각 `hop(10, 320)` → `sleep(500)`.
- 셋 등장: 경찰차 `put(-250)` → `move(X(120, 300), FL, 2800)`, 300ms 뒤 빨간 `put(-130)` → `move(X(300, 440), FL, 2800)`, 300ms 뒤 소방차 `put(-400)` → `move(X(-60, 100), FL, 2800)`(소방차는 가로에서 반쯤 보이고 세로에선 밖 — 셋 다 두는 것이 목적) + hop + `rattle`. P: `follow(500)`.
- **L25**(빨간, `hop(8, 300)`) → **L26**(구급차 `look('joy')`, `hop(8, 300)`) → **L27** 과 동시에 넷이 나감: 경찰차 → 빨간 → 소방차 → 구급차(`look('run')`) 400ms 간격, 모두 `move(1300, FL, DRIVE, 'linear')` + hop. 인형 둘은 병원 앞에 남아 `hop(8, 320)` 한 번(손 흔듦 대신). `await` → `sleep(SCENE_END)`.

### 장면 7. 나란히 달려요 (자동 — 소리로 인사, 사이렌 맞추기 없음)
- `sceneCard(tr('나란히 달려요'))`, 배경 `rc_bg_road_long`. 넷이 왼쪽 밖에서 한 줄로 들어와 멈춘다. put 순서(뒤→앞): 구급차 → 소방차 → 경찰차 → 빨간 자동차. 시작 x: 빨간 -100, 경찰차 -290, 소방차 -520, 구급차 -780(모두 `FL`). 도착 x(가로): 빨간 **845**, 경찰차 **658**, 소방차 **426**, 구급차 **171**(간격 30, 길이표에서 계산). 세로도 같은 값(카메라가 따라감). 이동 `LINE_DRIVE` linear + hop 반복 + `rattle` .3 을 1,200ms 마다. P: `follow(845, LINE_DRIVE)`.
- **L28** 은 이동과 동시에 읽는다. 이동이 끝나면 `sleep(400)`.
- 소리 인사(자동, 차례 고정 — 경찰차 → 소방차 → 구급차 → 빨간 자동차): 각 차례마다 `follow(차.x)` → `vo('siren_police' | 'siren_fire' | 'siren_amb' | 'vroom')` + `blink(차)` + `차.hop(10, 320)` + `T.pop(차.x, FL - 차.h - 40, tr('삐뽀삐뽀!' | '위이잉!' | '삐용삐용!' | '부릉부릉!'))` → `await (u || sleep(1200))` 뒤 `sleep(SIREN_GAP - 1200)`(= 다음 차례까지 2,600ms). 빨간 자동차는 지붕 등이 없으므로 `blink` 대신 `glow(red, 700)`.
- **L29**(빨간, `hop(8, 300)`) → 넷이 그대로 오른쪽으로 나감: 빨간 → 경찰차 → 소방차 → 구급차 300ms 간격, `move(x + 1300, FL, DRIVE, 'linear')` + hop. P: `follow(845)`. `await` → `sleep(SCENE_END)`.

### 장면 8. 에구구, 지쳤어요 (톡 2 — 고리)
- `sceneCard(tr('에구구, 지쳤어요'))`, 배경 `rc_bg_road_hill`(길은 평평, 언덕은 배경). put 순서: 구급차 `run` L-49/P-49 · 소방차 L191/P191 · 경찰차 L413/P413 · 빨간 자동차 `run` **L600/P600**(모두 `FL`, 간격 20; 구급차는 가로에서 앞부분만 보인다). focus: 빨간 자동차. P: `camSnap(600)`.
- 들어오기는 짧게: 넷을 각각 x-260 에서 시작해 위 자리까지 `move(…, FL, 3000, 'ease-out')` + hop + `rattle` → **L30** 은 이동과 동시에. 이동이 끝나는 순간(L30 의 "툭" 즈음) `AudioFX.sfx('thud', .4)` + `T.pop(red.x, FL - 140, tr('툭'), '#1F2A56')` → 빨간 자동차 `look('tired')` + `wiggle(3, 500)` 한 번.
- **L31**(빨간, 작게) → **L32** → 뒤의 셋이 걱정: 경찰차·소방차·구급차 `wiggle(2, 700)` 한 번씩(300ms 간격).
- **L33** 과 동시에 견인차 등장(**왼쪽 멀리서, 앞 차선으로**): `put(T, tow, -300, FL + 14, { look: 'run' })` → `tow.move(X(792, 792), FL + 14, 7000, 'linear')`(빨간 자동차 앞, 중심 간격 192 = 75 + 20 + 97) + hop(4, 460) 반복 + `AudioFX.sfx('rattle', .45)` 를 900ms 마다 + `T.pop(tow.x, FL - 150, tr('덜컹덜컹'))` 를 0ms 와 3,500ms 두 번. 견인차는 뒤의 셋 **앞**(z)으로 지나간다. P: `follow(792, 7000)` — 세로에서는 빨간 자동차(600)와 견인차(792)가 192 떨어져 둘 다 ±130 안에 들어오지 않으므로 카메라를 **696** 에 둔다(`follow(696)`; 빨간 자동차 뒤쪽 끝과 견인차 앞쪽 끝이 조금 잘려도 된다).
- 도착 → **L34**(견인차, `hop(8, 300)`) → **L35** → 고리 내밀기: `tow.look('pull')` + `AudioFX.sfx('creak', .4)`; 고리 prop 을 사슬 끝에: `put(T, hook, tow.x + TIP_PULL[0], FL + 14 + TIP_PULL[1])`, `TIP_PULL = [-104, -58]`(견인차 중심·바닥 기준, 받은 그림의 사슬 끝 ±15) + `hitBox(T, hook, 90, 90)` → 고리 들썩임(§2-6) → `await T.tap(hook.hit)`(안내 문장 없음, 손가락 힌트만).
- 톡 뒤: 고리가 빨간 자동차 앞 범퍼로: `hook.move(red.x + BUMPER[0], FL + BUMPER[1], 450, 'ease-in')`, `BUMPER = [+66, -34]`(빨간 자동차 중심·바닥 기준 앞 범퍼 ±10) → 도착 `AudioFX.sfx('knock', .6)` + `vo('chalkak')` + `T.pop(hook.x, hook.y - 60, tr('찰칵!'))` + `T.shake()` 없음 → 빨간 자동차 `look('hooked')`(앞이 들림; `hooked` 그림은 상자가 높으니 바닥 y 그대로) + `glow(red, 600)` → **L36** → **L37**(견인차) 과 동시에 끌기: 견인차·고리·빨간 자동차 셋을 `move(x + 60, 같은 y, 2200, 'ease-in-out')`(`Promise.all`) + `T.pop(tow.x, FL - 160, tr('영차!'))` 를 0ms 와 1,100ms → `sleep(SCENE_END)`.

### 장면 9. 기차처럼 한 줄로 (배움 놀이 2: 맨 앞은 누구?)
- `sceneCard(tr('기차처럼 한 줄로'))`, 배경 `rc_bg_road_long`. put 순서(뒤→앞): 구급차 → 소방차 → 경찰차 → 빨간 자동차(`hooked`) → 견인차(`pull`) → 고리(빨간 자동차 범퍼에). 시작 x(왼쪽 밖): 견인차 -100, 빨간 -282, 경찰차 -449, 소방차 -661, 구급차 -896(`FL`; 견인차도 이 장면부터는 `FL`). 도착 x(가로·세로 같음): 견인차 **905**, 빨간 **723**, 경찰차 **556**, 소방차 **344**, 구급차 **109**(간격 10). 고리는 빨간 자동차와 같이 움직인다(`red.x + BUMPER[0]`). 이동 `LINE_DRIVE` linear + hop 반복 + `rattle` .3 를 1,000ms 마다 + `T.pop(tow.x, FL - 160, tr('칙칙폭폭!'))` 를 시작 2,000ms·5,000ms. P: `follow(905, LINE_DRIVE)`.
- **L38** 은 이동과 동시에. 이동이 끝나면 `sleep(400)`.
- 카드: `const order = ['tow', 'red', 'police', 'fire', 'amb'].sort(() => Math.random() - .5)` → `cards = order.map((k, i) => carCard(T, k, CX[i], CY[i], X(1, .54)))`(§5-5). 가로: `CX = [200, 350, 500, 650, 800]`, `CY = 150`(한 줄, 한 줄 기차 위 하늘 자리). 세로(`camSnap(500)`): 1줄 `[413, 500, 587]` y 110, 2줄 `[456, 544]` y 180. 카드는 `animate([{opacity:0, translate:'0 20px'},{opacity:1, translate:'0 0'}], {duration: 450, delay: i*120, fill:'backwards'})` 로 차례로 뜬다.
- **L39**(안내) → `await T.choose(cards.map(c => ({ el: c.g, ok: c.key === 'tow', onWrong: async () => { await wiggleEl(c.g); await say(W[c.key]); } })), { prompt: '맨 앞에서 끌어 주는 건 누구일까요? 골라 봐요.' })` — `W = { red: W_red, police: W_police, fire: W_fire, amb: W_amb }`(§6 과 글자 하나까지 같다). 오답 뒤 해당 자동차가 `hop(10, 320)` 한 번(어느 차인지 보여 준다). 2회 오답부터 정답 카드가 빛나고 나머지는 흐려진다(엔진).
- 정답: `glow` 는 카드(`c.g.style.filter = 'url(#hintGlow)'` 1,200ms) + 견인차 `look('joy')` + `glow(tow, 1200)` + `sparkleSfx(T)` + `T.pop(tow.x, FL - 170, tr('반짝!'))` → **C2** → 카드 다섯 `opacity 1→0` 400ms 뒤 `remove()` → 견인차 `look('pull')`.
- **L40** 과 동시에 한 줄이 오른쪽으로 나간다: 다섯 대(+고리) `move(x + 1100, FL, LINE_DRIVE, 'linear')` + hop + `rattle` + `T.pop(tow.x + 40, FL - 170, tr('칙칙폭폭!'))` 0ms, `T.pop(red.x, FL - 140, tr('붕붕붕!'))` 1,800ms. P: `follow(905)`. `await` → `sleep(SCENE_END)`.

### 장면 10. 이현이야, 안녕! (톡 3 — 마지막 인사)
- `sceneCard(tr('이현이야, 안녕!'))`, 배경 `rc_bg_playground`. 이현이 `stand` **L640/P600**, `FL`(앞모습). 다섯 대는 **사람 세계 크기 `s: S_TOY`** 로 왼쪽 밖에서 한 줄로 들어온다(견인차 `run` 으로 되돌림, 빨간 자동차 `run`, 고리 없음): put 순서 구급차 → 소방차 → 경찰차 → 빨간 → 견인차. 시작 x: 견인차 -60, 빨간 -105, 경찰차 -145, 소방차 -190, 구급차 -240. 도착 x: 견인차 **500**, 빨간 **455**, 경찰차 **415**, 소방차 **370**, 구급차 **320**(가로). 세로: 이현이 600, 도착 x = `[545, 505, 467, 425, 377]`. `FL + 6`. 이동 5,000ms linear + hop(2, 460) 반복 + `rattle` .25. focus: 이현이. P: `camSnap(560)`.
- **L41** 은 이동과 동시에. 이동 2,000ms 뒤 이현이 `look('turn')` + `hop(8, 300)`.
- **L42**(이현이) → **L43**(이현이, `hop(8, 300)`) → 이현이 들썩임(§2-6) → `await T.tap(kid.pos)`(안내 문장 없음, 손가락 힌트만).
- 톡 뒤: 이현이 `look('hug')`; 다섯 대를 품으로(이현이 **앞**에 다시 put 해 앞에 보이게, `s: S_TOY` 유지): 목표 오프셋(이현이 중심·바닥 기준) 견인차 `[-18, -118]`, 빨간 `[+14, -126]`, 경찰차 `[-24, -104]`, 소방차 `[+10, -98]`, 구급차 `[+26, -112]` → 각 `move(kid.x + dx, FL + dy, 600, 'ease-out')`(`Promise.all`) + `AudioFX.sfx('paper_up', .5)`; 모두 `look('joy')` → `T.confetti(); AudioFX.sfx('tada') || sparkleSfx(T);` → 펄쩍펄쩍: 이현이 `hop(30, 480)` 세 번 연속(자동차는 이현이 `body` 에 붙어 있지 않으므로 같은 타이밍으로 다섯 대도 `hop(30, 480)`) → **L44** → **L45** → 합창 **CH**: `await say('부릉부릉, 빵빵!')`(§7-2 의 합창 파일이 `NARRATION_CLIPS['부릉부릉, 빵빵!']` 에 들어 있어 `say` 로 튼다; 없으면 `vo('cheer')` 로 다섯 클립이 차례로 나오므로 §11 에서 합창이 있는지 확인) + `T.pop(kid.x - 90, FL - 250, tr('빵빵!'))` + `T.pop(kid.x + 90, FL - 250, tr('부릉부릉!'))` → `T.finale(); await sleep(1500); return '서로 도우면 함께 갈 수 있어요.';`
- 이 동화의 마지막 인사형 톡은 이 이현이 톡이다.

### 컷신 (그림 컷) — CLAUDE.md §5-2, 까치(`tales/magpie`)·신데렐라 방식 (2026-10-21 추가)
- 컷 **4장**. 컷은 그 사건 **직후**에만 띄우고, 컷 위에서 그 장면의 **기존 대사 한 줄**을 읽는다: `const c = T.cutImage([{ src: src('rc_cut_…'), sfx: '…', hold: CUT_HOLD }], { hold: CUT_HOLD }); await say(L); await c;` (`CUT_HOLD = 4200`ms; 대사가 홀드보다 길면 컷이 먼저 닫혀도 된다; 톡하면 바로 넘어간다 — 엔진 `cutImage`, `engine/tale.js` 619행). 컷 패널은 엔진이 4:3 흰 테두리 종이로 보여 주므로 그림도 4:3 으로 만든다.
- 그림: `assets/v3w/rc_cut_<이름>.webp`(1200×900). 작업표 `jobs_red_car.json` 의 `kind: "cut"` 항목 **4장**(`pass 4`, 참고 그림 `refs` 는 그 컷에 나오는 인물의 스프라이트 — 스프라이트가 모두 나온 뒤에 만든다). 후처리: `post_tale.py` 는 sprite/bg 만 다루므로 컷은 `post_cinderella2.py` 처럼 4:3 가운데 자르기 → 1200×900 webp 로 따로 변환한다(그림·코드 작업은 뒤의 큐에서; 이 문서는 기획만).
- 규칙: 한 장면에 한 컷, 이웃한 장면에 연달아 두지 않는다. 컷 안 인물은 스프라이트와 같은 얼굴 규칙(점 눈·점 코·띠 입·분홍 볼), 소품은 얼굴 없음, 피·눈물·아픔 없음. 컷 위 대사는 모두 §6 에 **이미 있는 줄**이라 새 녹음이 없다(영어는 `voice_script_en.json` 의 같은 줄, `TEXT_EN` 추가 없음). 컷이 닫힌 뒤 무대는 그 장면의 다음 단계부터 이어진다(컷이 대신한 애니메이션은 생략해도 된다).

| 컷 id | 장면 | 앞 장면 → 뒤 장면 | 보여 줄 순간 | 그림 구도(얼굴 규칙 포함) | 컷 위 대사(한국어 / 영어) | 컷 동안 음성 | 효과음 | refs |
|---|---|---|---|---|---|---|---|---|
| `rc_cut_drop` | 2 나비다! | 1 언제나 함께 → 3 장난감 세상으로 붕붕! | 큰 사건: 나비를 쫓다가 빨간 자동차를 풀밭에 떨어뜨리는 순간(나비 톡 뒤) | 햇살 마당. 이현이가 오른쪽으로 달리며 두 팔을 오른쪽 위 노란 나비에게 뻗고 나비만 본다(활짝 웃음). 뒤쪽 왼쪽 아래 풀 속으로 빨간 장난감 자동차가 굴러 떨어져 반쯤 숨는다(짧은 띠 셋의 "톡" 터짐). 자동차는 점 눈 둘뿐. 아무도 못 본다. | **L5** 노느라 그만 빨간 자동차를 톡, 놓고 말았어요. / Ihyun was so busy playing that the red car slipped out, plop, onto the grass. | 있음 — 컷 음성 필요: L5 | `paper_down` | rc_child_run · rc_red_run · rc_prop_butterfly_open |
| `rc_cut_fire` | 5 소방차 이모 | 4 경찰차 형아 → 6 구급차 삼촌 | 소방차가 블록 집의 작은 불을 물줄기로 끄는 순간 | 장난감 세상 블록 길. 소방차가 호스에서 큰 연파랑 물줄기 호를 오른쪽 블록 집으로 뿜고, 지붕의 작은 감빛·금빛 불꽃이 줄어들며 회색 연기 한 뭉치. 왼쪽에서 빨간 자동차와 경찰차가 점 눈을 크게 뜨고 본다. 장난감 불이라 무섭지 않게. | **L19** 소방차가 블록으로 만든 장난감 집에 난 불을 쉭쉭 끄고 있었어요. / A fire truck was spraying water, whoosh whoosh, on a fire at a little block house. | 있음 — 컷 음성 필요: L19 | `splash` | rc_fire_spray · rc_prop_house · rc_red_run · rc_police_run |
| `rc_cut_hook` | 8 에구구, 지쳤어요 | 7 나란히 달려요 → 9 기차처럼 한 줄로 | 큰 사건: 견인차의 고리가 지친 빨간 자동차 범퍼에 찰칵 걸리는 순간(고리 톡 뒤) | 언덕 길. 오른쪽을 보는 주황 견인차가 팔을 뒤로 내려 회색 고리를 뒤쪽 빨간 자동차 앞 범퍼에 막 걸었다(고리 옆에 "찰칵" 띠 터짐). 빨간 자동차 앞부분이 살짝 들리고 점 눈이 다시 반짝. 뒤에 경찰차·소방차·구급차가 한 줄로 지켜본다. 모두 점 눈 둘뿐. | **L36** 견인차가 튼튼한 고리로 빨간 자동차를 찰칵! 걸어 주었어요. / The tow truck hooked its strong hook onto the red car. Click! | 있음 — 컷 음성 필요: L36 | `knock` | rc_tow_pull · rc_red_hooked · rc_prop_hook |
| `rc_cut_hug` | 10 이현이야, 안녕! | 9 기차처럼 한 줄로 → (끝: 합창·끝 화면) | 결말: 이현이가 돌아온 자동차 다섯 대를 모두 품에 안고 펄쩍 기뻐하는 순간(이현이 톡 뒤) | 놀이터(모래·미끄럼틀). 이현이가 두 팔로 작은 장난감 자동차 다섯 대(빨간·경찰·소방·구급·견인, 손바닥 크기)를 가슴에 안고 눈을 꼭 감고 활짝 웃는다. 공중에 작은 종이 색종이 조각. 자동차는 모두 점 눈 둘뿐. | **L44** 이현이는 소중한 보물 자동차들을 모두 품에 안고 펄쩍펄쩍 기뻐했답니다. / Ihyun hugged all the precious toy cars and jumped for joy. | 있음 — 컷 음성 필요: L44 | `paper_up` | rc_child_hug · rc_red_joy · rc_tow_joy · rc_fire_joy |

컷 음성 필요(모두 §6 의 기존 줄, 새 줄 없음): L5, L19, L36, L44.

## 4. 배움 놀이 규칙 요약 (엔진 `T.choose`)
- **1장 색 찾기**: 보기 셋(빨간 자동차·파란 블록·노란 오리), 자리 무작위, 정답 1개. 12초 무입력이면 `prompt`(L1) 를 다시 읽는다. 1회 오답 → `onWrong`(흔들림 + W_block/W_duck). 2회 오답부터 정답이 노랗게 빛나며 들썩이고 나머지는 흐려진다(엔진). 정답을 누르면 `AudioFX.ding()` → 반짝 → C1.
- **9장 맨 앞은 누구?**: 카드 다섯(견인차·빨간·경찰차·소방차·구급차), 순서 무작위, 정답 견인차. 1회 오답 → 흔들림 + 그 차 이름(W_*) + 그 차가 한 번 들썩. 2회 오답부터 정답 카드가 빛난다. 정답 → ding → 견인차 반짝 → C2.
- 오답 설명 뒤 바로 다시 고를 수 있다. 게임오버 없음. 둘 다 줄거리와 무관하다. 자동 재생(`auto_play`)에서는 엔진이 정답을 대신 누른다.

## 5. 코드로 그리는 것 (그림 없이)

### 5-1. 누르는 자리 넓히기 `hitBox(T, a, w, h)`
배우 `a.pos` 의 **맨 앞 자식으로** 투명 사각을 넣고(`T.el('rect', { x: -w/2, y: -h, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, a.pos)` — `a.pos.insertBefore(rect, a.body)` 로 그림 뒤에), `a.hit = a.pos` 를 둔다. `fill-opacity: 0` 이어도 pointer-events 는 받는다(`fill: none` 은 안 받는다). 톡·고르기에는 `a.hit` 을 넘긴다. 손가락 힌트는 `getBoundingClientRect` 를 쓰므로 자연히 사각 가운데를 가리킨다.

### 5-2. 지붕 등 반짝 `blink(a, n = 3)`
사이렌 소품 없이 필터로: `a.body.style.filter = 'url(#hintGlow)'` 를 220ms 켜고 220ms 끄기를 n 번(`setTimeout` 사슬 또는 `for` + `await sleep`). 빨간 자동차(등 없음)는 `glow(red, 700)`.

### 5-3. 나비 날갯짓 `flutter(bf)`
`bf.look('open')`/`bf.look('fold')` 를 **260ms** 마다 번갈아(`setInterval`). 두 그림의 몸통 길이가 같아야 하므로 HT 는 §2-2. 나비가 `hide` 되면 `clearInterval`. 날아갈 때 위아래 출렁임: `bf.body.animate([{translate:'0 0'},{translate:'0 -12px'},{translate:'0 0'}], {duration: 700, iterations: Infinity})`.

### 5-4. 같은 장면 안 배경 바꾸기 `veil(T, change)`
`T.fx` 레이어(없으면 `T.world` 맨 앞)에 크림 종이 `rect`(x -60, y -40, 1120×660, fill `#F5EFE9`, opacity 0) → `anim` opacity 0→1 **350ms** → `change()` → `anim` 1→0 **350ms** → `remove()`. 3장 A→B 에서 한 번 쓴다. 효과음 `paper_turn` 은 넣지 않는다(장면 전환이 아니라 "가까이 간다"이므로).

### 5-5. 자동차 카드 `carCard(T, key, x, y, s = 1)` (9장 고르기)
```js
const w = 150 * s, h = 112 * s, f = { tow: 'rc_tow_run', red: 'rc_red_run', police: 'rc_police_run', fire: 'rc_fire_run', amb: 'rc_amb_run' }[key];
const g = T.paper(T.world, [['rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10 * s, fill: '#F6ECD8' }],
                            ['rect', { x: -w / 2 + 7 * s, y: -h / 2 + 7 * s, width: w - 14 * s, height: h - 14 * s, rx: 6 * s, fill: 'none', stroke: '#6B4A32', 'stroke-width': 3 * s }]],
                  { transform: `translate(${x},${y})`, filter: 'url(#pp)' });
const iw = w * .8, ih = iw / ASP[f];      // 카드 안 그림은 폭 80%, 비율 유지 (그림이 없으면 sprite() 가 자리표시를 그린다)
sprite(T, g, f, -iw / 2, -ih / 2, iw, ih);
return { key, g, x, y };
```
카드 안 그림은 **카드 UI 의 작은 그림**이지 무대의 자동차가 아니다(§4-1 과 무관, 숫자 카드와 같은 취급). 다섯 카드의 그림 폭이 같으므로 긴 차(소방차)는 낮게, 짧은 차는 높게 보인다 — 그대로 둔다. 영어 모드도 같다. 세로 `s = .54` → 81×60(§2-6 통과).

### 5-6. 물 흔들림 (5장)
`water.body.animate([{translate:'0 0', opacity:1},{translate:'0 -6px', opacity:.7},{translate:'0 0', opacity:1}], {duration: 360, iterations: Infinity})`. 불이 꺼지면 `hide(water)`.

### 5-7. 밤 틴트 (1장 잠)
`tint(T, '#1F2A56', 0)` → `anim` opacity 0→.22 900ms. 장면이 끝나면 `T.clear()` 가 지운다.

## 6. 대사 전체 (voice_script_el.json 과 글자 하나까지 같다)
- `say()` 에 넘기는 한국어 문장은 아래 표와 **정확히** 같아야 녹음이 붙는다(한 글자라도 다르면 클립이 없어 조용히 넘어간다 → §11 `_audio.json` 으로 잡는다).
- 배역 키: nar(해설, Lily) child(이현이, **Sparkles for Kids**) red(빨간 자동차, Munni) police(경찰차 형아, Eric) fire(소방차 이모, Bella) amb(구급차 삼촌, Namchun) tow(견인차, Roger). 도둑·인형·나비는 목소리 없음.
- 톡 안내 문장은 없다(2·8·10장 톡은 손가락 힌트만). 고르기 안내(L1, L39)는 `say()` 로 읽은 뒤 같은 문장을 `prompt` 로 넘긴다(12초 재안내).
- 말풍선 없는 소리(`extra`, `vo(key)`): `siren_police`(삐뽀삐뽀!, 경찰차) · `siren_fire`(위이잉!, 소방차) · `siren_amb`(삐용삐용!, 구급차) · `vroom`(부릉부릉!, 빨간) · `tok`(톡!, 해설) · `chalkak`(찰칵!, 해설) · `cheer`(부릉부릉, 빵빵! × 다섯 목소리 → 합창 §7-2).

| # | 장면 | 배역 | 한국어 (`say()`에 넘기는 문장 그대로) | 영어 | 쓰임 |
|---|---|---|---|---|---|
| L0 | 1 | 해설 | 이현이는 빨간 자동차를 참 좋아했어요. | Ihyun loved the little red car very much. |  |
| L1 | 1 | 해설 | 빨간 것은 어디 있을까요? 찾아봐요. | Where is the red one? Find it! | 고르기 안내(첫 조작) |
| W_block | 1 | 해설 | 그건 파란 블록이에요. 빨간 것을 찾아봐요. | That's the blue block. Find the red one. | 오답(블록) |
| W_duck | 1 | 해설 | 그건 노란 오리예요. 빨간 것을 찾아봐요. | That's the yellow duck. Find the red one. | 오답(오리) |
| C1 | 1 | 해설 | 맞아요, 빨간 자동차! | That's right, the red car! | 정답 |
| L2 | 1 | 해설 | 밥 먹을 때도 냠냠, 잠잘 때도 쌔근, 언제나 손에 꼭 쥐고 있었지요. | Munch munch at mealtime, snore snore at bedtime, the red car was always in Ihyun's hand. | 밥·잠 2컷 위 |
| L3 | 2 | 해설 | 그러던 어느 날, 밖에서 놀고 있었어요. | Then one day, Ihyun was playing outside. |  |
| L4 | 2 | 이현이 | 어! 나비다! | Oh! A butterfly! |  |
| L5 | 2 | 해설 | 노느라 그만 빨간 자동차를 톡, 놓고 말았어요. | Ihyun was so busy playing that the red car slipped out, plop, onto the grass. | 나비 톡 뒤 |
| L6 | 2 | 해설 | 정신을 차려 보니… 어라? 빨간 자동차가 보이지 않아요! | And then... huh? The red car was nowhere to be seen! |  |
| L7 | 2 | 이현이 | 잉잉, 내 빨간 자동차 어디 갔지? | Boo-hoo, where did my red car go? |  |
| L8 | 3 | 해설 | 홀로 남은 빨간 자동차는 이현이를 찾기로 했어요. 용기 있게 출발! | The little red car, all alone, decided to go and find Ihyun. Off it went, brave and bold! | 줌 위 |
| L9 | 3 | 빨간 자동차 | 부릉부릉! 이현이를 찾아 장난감 세상으로 가자! | Vroom vroom! Let's go to Toy Land and find Ihyun! |  |
| L10 | 4 | 해설 | 조금 가다 보니, 삐뽀삐뽀 우렁찬 소리가 들렸어요. | A little way down the road, there came a loud wee-woo, wee-woo! |  |
| L11 | 4 | 경찰차 형아 | 게 멈춰라! | Stop right there! |  |
| L12 | 4 | 해설 | 경찰차 장난감이 도둑 장난감들을 쫓아 씽씽 달리고 있었어요. | A toy police car was zooming after some toy robbers. |  |
| L13 | 4 | 빨간 자동차 | 어? 너는 이현이가 잃어버렸던 경찰차 형아?! | Huh? You're the police car Ihyun lost! Big brother police car! |  |
| L14 | 4 | 빨간 자동차 | 우리 같이 이현이한테 가자! | Let's go find Ihyun together! |  |
| L15 | 4 | 경찰차 형아 | 좋아! 도둑을 다 잡았으니 같이 가자! | Sure! I've caught all the robbers, so let's go together! |  |
| L16 | 4 | 해설 | 경찰차 형아가 앞장섰어요. | Big brother police car led the way. |  |
| L17 | 5 | 해설 | 가다 보니 이번엔 위이잉, 소리가 났어요. | A little farther on, there came a wee-ooo sound. |  |
| L18 | 5 | 소방차 이모 | 조심하세요! 불을 끕니다! | Stand back! I'm putting out the fire! |  |
| L19 | 5 | 해설 | 소방차가 블록으로 만든 장난감 집에 난 불을 쉭쉭 끄고 있었어요. | A fire truck was spraying water, whoosh whoosh, on a fire at a little block house. | 물 뿌리기·불꽃 줄어듦 위 |
| L20 | 5 | 빨간 자동차 | 어? 소방차 이모! 우리 같이 이현이 만나러 가요! | Oh? Auntie fire truck! Come with us to find Ihyun! |  |
| L21 | 5 | 소방차 이모 | 그래그래! 불을 다 껐으니 같이 가자! | Of course! The fire is out, so let's go together! |  |
| L22 | 5 | 해설 | 소방차 이모도 신나게 함께했어요. | Auntie fire truck happily joined the group. |  |
| L23 | 6 | 해설 | 셋이서 길을 가다 보니 삐용삐용, 바쁜 소리가 들렸어요. | As the three drove on, there came a busy nee-naw, nee-naw! |  |
| L24 | 6 | 해설 | 구급차 삼촌이 아픈 인형들을 태우고 병원으로 가고 있었지요. | Uncle ambulance was taking some sick dolls to the hospital. |  |
| L25 | 6 | 빨간 자동차 | 구급차 삼촌! 우리랑 같이 이현이한테 가요! | Uncle ambulance! Come with us to find Ihyun! |  |
| L26 | 6 | 구급차 삼촌 | 오냐오냐, 아픈 친구들을 다 데려다주었으니 이제 이현이에게 가자! | All right, all right! I've brought the sick friends to the hospital, so now let's go to Ihyun! |  |
| L27 | 6 | 해설 | 구급차 삼촌도 든든하게 따라나섰어요. | Uncle ambulance came along too, strong and steady. |  |
| L28 | 7 | 해설 | 넷이서 나란히 달려요. 친구들이 소리로 인사했어요. | The four friends drove side by side. They said hello with their sounds. | 달리기 위 |
| L29 | 7 | 빨간 자동차 | 자, 다 같이 이현이한테 가자! | Come on, everyone, let's go to Ihyun! | 추가 연결 대사 |
| L30 | 8 | 해설 | 하지만 너무 오래 달린 빨간 자동차는 그만 툭, 멈춰 서고 말았어요. | But the little red car had driven for so long that it stopped with a clunk. |  |
| L31 | 8 | 빨간 자동차 | 아이고, 힘들어. 더는 못 가겠어… | Oh dear, I'm so tired. I can't go any farther... |  |
| L32 | 8 | 해설 | 바퀴가 무거워 꼼짝할 수가 없었지요. | Its wheels felt so heavy it couldn't move at all. |  |
| L33 | 8 | 해설 | 그때, 저 멀리서 덜컹덜컹 든든한 소리가 들렸어요. | Just then, from far away, came a sturdy clatter, clatter sound. | 견인차 등장 |
| L34 | 8 | 견인차 | 걱정 마! 내가 도와줄게! | Don't worry! I'll help you! |  |
| L35 | 8 | 해설 | 바로 이현이가 전에 잃어버렸던 주황색 견인차였어요! | It was the orange tow truck Ihyun had lost long ago! |  |
| L36 | 8 | 해설 | 견인차가 튼튼한 고리로 빨간 자동차를 찰칵! 걸어 주었어요. | The tow truck hooked its strong hook onto the red car. Click! | 고리 톡 뒤 |
| L37 | 8 | 견인차 | 영차, 영차! | Heave-ho, heave-ho! | 끌기 |
| L38 | 9 | 해설 | 견인차가 빨간 자동차를 앞에서 끌고, 그 뒤로 경찰차, 소방차, 구급차가 든든하게 따랐어요. | The tow truck pulled the red car from the front, and behind them came the police car, the fire truck and the ambulance. | 한 줄 달리기 위 |
| L39 | 9 | 해설 | 맨 앞에서 끌어 주는 건 누구일까요? 골라 봐요. | Who is pulling at the very front? Pick one! | 고르기 안내 |
| W_red | 9 | 해설 | 그건 빨간 자동차예요. 맨 앞을 다시 봐요. | That's the red car. Look at the very front again. | 오답 |
| W_police | 9 | 해설 | 그건 경찰차 형아예요. 맨 앞을 다시 봐요. | That's big brother police car. Look at the very front again. | 오답 |
| W_fire | 9 | 해설 | 그건 소방차 이모예요. 맨 앞을 다시 봐요. | That's auntie fire truck. Look at the very front again. | 오답 |
| W_amb | 9 | 해설 | 그건 구급차 삼촌이에요. 맨 앞을 다시 봐요. | That's uncle ambulance. Look at the very front again. | 오답 |
| C2 | 9 | 해설 | 맞아요, 견인차! | That's right, the tow truck! | 정답 |
| L40 | 9 | 해설 | 긴 기차처럼 한 줄로 칙칙폭폭, 붕붕붕! | Like a long train, all in a row: chugga-chugga, vroom vroom vroom! | 한 줄 퇴장 위 |
| L41 | 10 | 해설 | 마침내 놀이터에 있는 이현이를 만났어요! | At last, they found Ihyun at the playground! |  |
| L42 | 10 | 이현이 | 와아! 내 빨간 자동차다! | Wow! My red car! |  |
| L43 | 10 | 이현이 | 경찰차랑 소방차, 구급차랑 견인차도 다 여기 있네! | And the police car, the fire truck, the ambulance and the tow truck are all here too! |  |
| L44 | 10 | 해설 | 이현이는 소중한 보물 자동차들을 모두 품에 안고 펄쩍펄쩍 기뻐했답니다. | Ihyun hugged all the precious toy cars and jumped for joy. | 이현이 톡 뒤 |
| L45 | 10 | 해설 | 이제 모두 함께 집으로 출발! | Now let's all go home together! |  |
| CH | 10 | 다섯 자동차 합창 | 부릉부릉, 빵빵! | Vroom vroom, beep beep! | extra.cheer 5목소리 → mix_chorus_el.py |

`run()` 반환 문구(끝 화면)는 `'서로 도우면 함께 갈 수 있어요.'`(부제와 같다, `ui` 에 영어 있음). 교훈은 **대사로 읽지 않는다**.

## 7. 효과음 (sounds/sfx/<이름>.mp3, `AudioFX.sfx(name, vol)`)

| 장면 | 순간 | 이름 | 비고 |
|---|---|---|---|
| 1 | 정답 | `sparkle` (없으면 tone 700→1400) | 팝 '반짝!' + 엔진 `ding` |
| 1 | 자동차를 손에 | `paper_up` (.5) | |
| 1 | 밥·잠 | (없음) | 팝 '냠냠' '쌔근' |
| 2 | 나비 날아감 | `swish` (.4) | 팝 '팔랑팔랑' |
| 2 | 자동차 떨어짐 | `paper_down` (.5) + `vo('tok')` | 팝 '톡!' |
| 2 | 울기 | (없음) | 팝 '두리번' '잉잉' |
| 3~10 | 자동차 달리기 | `rattle` (.25~.45, 900~1,200ms 마다) | 장난감 굴러가는 소리. 팝 '부릉부릉!' '덜컹덜컹' '칙칙폭폭!' '붕붕붕!' |
| 4·5·6·7 | 사이렌 | `vo('siren_police' / 'siren_fire' / 'siren_amb')` + `blink` | 팝 '삐뽀삐뽀!' '위이잉!' '삐용삐용!'. **효과음 사이렌 없음**(배역 목소리로 통일) |
| 4 | 도둑 손 들기 | `boing` (.4) | 팝 '씽씽!'(추격) |
| 5 | 물 뿌리기 | `splash` (.35) ×2 | 팝 '쉭쉭!' |
| 6 | 문 열림 | `door` (.5) | |
| 6 | 인형 내림 | `paper_down` (.4) | |
| 8 | 멈춤 | `thud` (.4) | 팝 '툭' |
| 8 | 팔 내리기 | `creak` (.4) | |
| 8 | 찰칵 | `knock` (.6) + `vo('chalkak')` | 팝 '찰칵!'. 화면 흔들림 없음 |
| 8 | 끌기 | (없음) | 팝 '영차!' ×2 |
| 9 | 정답 | `sparkle` | 팝 '반짝!' + 엔진 `ding` |
| 10 | 안기 | `paper_up` (.5) | |
| 10 | 끝 | `tada` + `T.confetti()` | 합창 '부릉부릉, 빵빵!' |
| 전환 | 책장 넘기기 | 엔진 기본 | |
| 톡·고르기 | 누름/정답/오답 | 엔진 `AudioFX.tap/ding/miss` | |

### 7-1. 효과음이 없을 때
`rattle`·`boing`·`knock`·`creak`·`door`·`thud`·`splash` 는 모두 `sounds/sfx/` 에 이미 있다. 그래도 `sfx(T, name, vol, fb)` 의 `fb` 로 `T.tone` 대체음을 둔다(`rattle` → `T.tone([180, 120], .08, { type: 'square', vol: .08 })`, `knock` → `T.tone([900, 400], .1, { vol: .2 })`).

### 7-2. 합창 "부릉부릉, 빵빵!" (`tales/red_car/mix_chorus_el.py`)
`tales/snow_white/mix_chorus_el.py` 를 복사해 고친다: `HERE = tales/red_car`, `DELAY_MS = [0, 70, 30, 120, 50]`(다섯), `spec` 은 `voice_script_el.json` 의 `"chorus"`(`{"cheer": "부릉부릉, 빵빵!"}`), `en_spec` 은 `voice_script_en.json` 의 `"extra"`, 출력 `audio/el/red_car/chorus/*.mp3`·`chorus/en/*.mp3` + `tales/red_car/chorus_el.js`(헤더 주석의 동화 이름만 바꿈). 실행 순서: `gen_tale.py red_car --model eleven_v4`(한국어) → `--lang en` → `python3 tales/red_car/mix_chorus_el.py`. 결과 `chorus_el.js` 는 `NARRATION_CLIPS['부릉부릉, 빵빵!']` 를 채우고 `VOICE_LINES.cheer` 를 지운다(다섯 클립을 따로 받지 않게). `index.html` 로더는 §0-3.

## 8. 카탈로그 항목 (`tales/catalog.js`, `beauty_beast` 항목 뒤)
```js
  { id: 'red_car', title: '나의 빨간 자동차', origin: 'original', skills: ['spot', 'order', 'heart'], ready: false, making: true,
    line: '빨간 것을 찾고, 맨 앞에서 끌어 주는 자동차를 골라요. 잃어버린 빨간 자동차가 경찰차, 소방차, 구급차, 견인차와 한 줄로 이현이에게 돌아와요.',
    en: { title: 'My Red Car', line: 'Find the red one and pick the car that pulls at the front. A lost red car comes home to Ihyun in a row with a police car, a fire truck, an ambulance and a tow truck.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.gd}"/>${[0, 40, 80, 120].map(x => `<rect x="${x + 20}" y="84" width="20" height="26" fill="${c.sn}"/>`).join('')}
      <rect x="34" y="40" width="92" height="44" rx="16" fill="${c.rd}"/><rect x="60" y="30" width="46" height="22" rx="8" fill="${c.rd}"/>
      <rect x="66" y="34" width="34" height="14" rx="4" fill="${c.cr}"/>${eye(90, 41, 2)}${eye(96, 41, 2)}
      <circle cx="56" cy="86" r="11" fill="${c.ind}"/><circle cx="104" cy="86" r="11" fill="${c.ind}"/><circle cx="56" cy="86" r="4" fill="${c.cr}"/><circle cx="104" cy="86" r="4" fill="${c.cr}"/>
      <ellipse cx="136" cy="22" rx="9" ry="6" fill="${c.gd}" transform="rotate(-20 136 22)"/><ellipse cx="146" cy="26" rx="8" ry="5" fill="${c.gd}" transform="rotate(20 146 26)"/></g>` },
```
태그: 사이렌·세기 놀이가 빠졌으므로 PLAN 의 `count`·`sound` 대신 **`spot`(색 찾기)·`order`(맨 앞)·`heart`(협력)**. `origin: 'original'` 은 구름 공장과 같은 값(창작). 홈 카드 그림은 코드 SVG(크림 바탕, 블록 길 띠, 큰 빨간 자동차 + 점 눈, 오른쪽 위 노란 나비).

## 9. 썸네일·키아트 (인물 그림이 다 나온 뒤)

| 결과 파일 | 원본 | 만드는 법 |
|---|---|---|
| `assets/thumbs/red_car_key_wide.webp` (1672×941) | `assets/raw/keyart_gpt/red_car_wide_v5.png` | PIL: RGB → 16:9 가운데 자르기 → 1672×941 → webp quality 86 (`back_to_webp.py` 와 같은 식) |
| `…_key_tall.webp` (1086×1448) | `…_tall_v5.png` | 3:4 가운데 자르기 → 1086×1448 |
| `…_tile.webp` (720×540) | `…_tile_v5.png` | 4:3 가운데 자르기 → 720×540. `assets/thumbs/tiles.js` 의 `TILES` 에 `'red_car'` 추가 |
| `…_back_wide.webp` (1200×800) · `…_back_tall.webp` (1000×1150) | `…_backw_v5.png` · `…_backt_v5.png` | `~/.venvs/paper-tale/bin/python tools/app/gen/back_to_webp.py red_car` |
| `assets/thumbs/thumbs.js` | — | `THUMBSKEY` 에 `"red_car"`, `THUMBSKEYLIGHT["red_car"] = "#f5efe9"`, `BACKACCENT["red_car"] = "#A93B32"`(끝 화면 리본: Bean Red). `make_thumbs.py` 의 표(75행)에도 BACKACCENT 를 넣는다. |

키아트 창 모양은 **둥근 바퀴(원)** 이고, 테두리 장식은 작은 블록 서너 개와 노란 나비 하나뿐(§7-5: 소품 금지, 같은 계열 장식 최소). 참고 그림은 작업표의 `refs`(child_stand·red_run·police_run·tow_run / 끝 화면은 child_hug·red_joy·fire_joy·amb_joy)라 **인물·자동차 스프라이트가 모두 나온 뒤** 맨 마지막에 생성한다. 썸네일(타일)은 PLAN 대로 자동차를 크게, 겹 3개.

## 10. 그림 목록 (작업표 `jobs_red_car.json` 58장과 같다)

모든 자동차는 **옆모습, 오른쪽을 보고 달리는 방향**. 자세 그림은 기준 그림을 `refs` 로 넣고 프롬프트에 "SAME SCALE AS THE REFERENCE SPRITE(머리·몸·바퀴 크기를 기준 그림과 똑같이)"가 들어 있다(§4-1). 자동차 얼굴은 점 눈 둘뿐(`FACE OF THIS TOY VEHICLE` 단락), 단역은 점 눈만, 소품은 얼굴 없음.

| 구분 | id (`assets/v3w/rc_<id>.webp`) | 설명·방향 | 작업표 크기 | pass | 장면 |
|---|---|---|---|---|---|
| 인물·이현이 | child_stand (기준) | 앞모습, 빈손 쥐기(자동차는 코드로 손에) | 600² | 1 | 1, 2, 10 |
| | child_eat(→, 의자·식탁 끝째) / sleep(누움, 머리 왼쪽, 780×420) / point(→) / run(→) / cry / turn / hug(발 뜸, 팔 둥글게 빈 품) | | 600² | 2 | 1 / 1 / 2 / 2 / 2 / 10 / 10 |
| 인물·빨간 자동차 | red_run (기준, 길이 1.0) | 점 눈 둘, 입 없음 | 840×480 | 1 | 3~9, (1·2·10 은 S_TOY) |
| | red_joy(별눈) / tired(반달눈·땀·앞으로 기욺) / hooked(앞 들림, 고리 없음) | | 840×480 | 2 | 10 / 8 / 8·9 |
| 인물·경찰차 | police_run (기준, 1.1) / police_joy | 흰 바탕 남색 띠, 지붕 등 빨강·파랑 | 840×480 | 2 / 3 | 4~10 |
| 인물·소방차 | fire_run (기준, 1.6·키 1.4) / fire_spray(호스 →, 물 없음) / fire_joy | 빨간 몸 흰 띠, 흰 사다리 | 840×480 | 2 / 3 / 3 | 5~10 |
| 인물·구급차 | amb_run (기준, 1.4·키 1.3, 옆창 비어 있음) / amb_open(문 열림) / amb_joy | 흰 바탕 빨간 십자 | 840×480 | 2 / 3 / 3 | 6~10 |
| 인물·견인차 | tow_run (기준, 1.3·키 1.1, 팔 올림, 사슬 끝 고리 없음) / tow_pull(팔 뒤로 내림) / tow_joy | 주황 몸, 갈색 팔 | 840×480 | 2 / 3 / 3 | 8~10 |
| 단역 | thief_a_run(→) · thief_a_hands / thief_b_run(→) · thief_b_hands | 줄무늬 블록 인형(a 남색, b 갈색), 눈가리개, 점 눈 | 480×600 | 1·2 / 2·3 | 4 |
| 단역 | bear_sit · bear_off / rabbit_sit · rabbit_off | 반창고 곰, 수건 토끼, 점 눈만 | 480² | 1 / 2 | 6 |
| 소품 | prop_block / prop_duck(→, 눈 없음) | 1장 보기, 얼굴 없음 | 480² | 1 | 1 |
| | prop_butterfly_open / prop_butterfly_fold | 노란 나비 2장, 얼굴 없음 | 480² | 1 / 2 | 2 |
| | prop_house / prop_flame / prop_smoke / prop_water(→) | 블록 집, 불꽃 1장(높이로 줄임), 연기, 물줄기 | 600² / 480×600 / 480² / 840×480 | 1 | 5 |
| | prop_hook | 고리+사슬 2링크(톡 대상) | 480×600 | 3 | 8, 9 |
| 배경 | bg_room / bg_yard / bg_gate(아치 포함) / bg_road_a / bg_road_b(빈 터) / bg_road_c(병원 포함) / bg_road_long / bg_road_hill / bg_playground(미끄럼틀 포함) | 평평한 종이 한 장 + 요소 2~3개, 낮(세트 A, 왼쪽 위 해) | 1600×902 | 1 | 1 / 2·3 / 3 / 4 / 5 / 6 / 7·9 / 8 / 10 |
| 컷 | cut_drop / cut_fire / cut_hook / cut_hug | 그림 컷 4장(§3 끝 컷신 표: 2·5·8·10장). refs 는 그 컷에 나오는 인물 스프라이트. 4:3, 얼굴 규칙 같음, 소품 얼굴 없음 | 1600×1200(4:3) | 4 | 2 / 5 / 8 / 10 |
| 키 | key5_wide · key5_tall · key5_tile · key5_backw · key5_backt | 시작 화면(바퀴 모양 창)·홈 카드·끝 화면(품에 안은 다섯 대) | 16:9 · 3:4 · 4:3 · 3:2 · 4:5 | — | — |

생성 순서: `pass 1`(기준 그림 21: child_stand, red_run, 소품 8, thief_a_run, bear_sit, rabbit_sit, 배경 9) → `pass 2`(19: 이현이 자세 7, 빨간 자세 3, police/fire/amb/tow_run, thief_b_run, thief_a_hands, bear_off, rabbit_off, butterfly_fold) → `pass 3`(9: police_joy, fire_spray, fire_joy, amb_open, amb_joy, tow_pull, tow_joy, thief_b_hands, prop_hook) → `pass 4`(컷 4: cut_drop, cut_fire, cut_hook, cut_hug) → 키아트 5. 작업표가 이 순서로 정렬되어 있으므로 `run_simple.py red_car $(python3 -c "import json;print(' '.join(j['id'] for j in json.load(open('tools/app/gen/jobs_red_car.json'))))")` 처럼 앞에서부터 돌리면 된다.

받은 그림 점검(틀린 id 만 지우고 다시 만든다): 네 귀퉁이가 마젠타인지(`restyle_check.py` 방식) · 자동차에 **입·코·볼·눈썹이 없고 점 눈 둘뿐**인지 · 자동차가 **오른쪽**을 보는지(반대면 그림을 뒤집어 저장하지 말고 NAT 만 고친다 — 단, 이 동화는 자동차를 안 뒤집으므로 결국 다시 만드는 편이 낫다) · 소품(블록·오리·나비·집·불꽃·연기·물·고리)에 얼굴이 없는지 · 견인차 사슬 끝에 고리가 **없는지**(있으면 다시) · 이현이 손에 아무것도 없는지, 옷에 글자가 없는지 · 같은 자동차 자세의 바퀴 지름이 기준과 ±12% 안인지 · 다섯 대의 바퀴 지름이 서로 ±20% 안인지 · 이현이 자세의 얼굴 폭이 stand 와 ±12% 안인지.

## 11. 테스트 체크리스트 (코드가 끝난 뒤, 커밋 전)

준비
- [ ] 저장소 뿌리에서 `python3 -m http.server 8794`(다른 에이전트와 겹치지 않게 8794).
- [ ] 헤드리스 크롬: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9344 --user-data-dir=/tmp/rc_chrome --window-size=1366,1024 about:blank &`.
- [ ] 자동 재생: `CDP=9344 node assets/raw/_work/autoplay_audio.mjs http://127.0.0.1:8794/tales/red_car/index.html 1366 1024 /tmp/rc_l 600 8` (스크린샷 + `_audio.json`). 1장·9장 보기 순서가 무작위이므로 **두 번 이상** 돌린다. 그림이 없는 동안은 자리표시로 끝까지 돌아야 한다(목업 통과 기준).

가로 1366×1024
- [ ] 끝까지 자동 재생되고 `errors` 에 예외가 없다(그림 404 는 자리표시 모드에서 정상, `chorus_el.js` 404 는 합창 전까지 정상).
- [ ] 첫 조작(1장 고르기)의 안내 L1 이 **시작 버튼 뒤 15초 안**에 끝난다(`_audio.json` 의 L1 시각 ≤ 14s). 넘으면 L0 뒤 `sleep(300)` 을 없앤다.
- [ ] 전체 길이 7~8.5분(`_audio.json` 마지막 클립 시각 + 끝 화면). 7분이 안 되면 §2-7 대로 `SCENE_END`·`DRIVE` 를 늘린다.
- [ ] **크기**: 3장 A(사람 세계 자동차, 길이 ≈48) → 줌 끝(화면에서 ≈149) → B(장난감 세상 150) 스크린샷 셋을 나란히 놓고 자동차가 같은 크기로 이어지는지. 4~9장에서 다섯 대의 길이 비율(150:165:240:210:195)과 바퀴 지름이 같은지. 8장 빨간 자동차 run → tired → hooked 바퀴 지름이 같은지. 1·2·10장 자동차가 모두 S_TOY(빨간 ≈48)인지. 이현이 자세 8장의 얼굴 폭이 같은지. 틀리면 `HT`(§2-2).
- [ ] **방향**: 모든 자동차가 오른쪽을 보고 오른쪽으로 달린다(뒤집힘 없음). 2장 이현이가 오른쪽(나비 쪽)으로 달린다. 5장 호스와 물줄기가 오른쪽 집을 향한다. 8장 견인차가 왼쪽에서 와서 빨간 자동차 **앞**에 서고, 팔을 **뒤(왼쪽)** 로 내려 고리가 빨간 자동차 앞 범퍼에 닿는다.
- [ ] **색 찾기**: 보기 셋의 자리가 돌 때마다 다르고, 오답 때 흔들림 + W 대사, 두 번째 오답부터 정답이 빛난다. 정답 뒤 자동차가 손으로 올라가고 밥 → 잠 두 컷이 L2 안에서 바뀐다.
- [ ] **나비 톡**: 손가락 힌트가 나비 위(투명 사각 가운데)에 뜬다. 톡 뒤 나비가 날아가고 이현이가 달리며 자동차가 바닥에 떨어진다(`톡!` 팝 + `vo('tok')`).
- [ ] **줌**: 3장 L8 동안 카메라가 자동차에 3.1배로 다가가고, 크림 가림 뒤 장난감 세상에서 자동차가 scale 1 로 아치를 지난다. 프레임(`#frame.out`)이 줌 동안 빠졌다가 돌아온다.
- [ ] **사이렌**: 4·5·6장 등장 때와 7장 인사 때 같은 `vo` 클립이 나오고(`_audio.json` 에 `police_`·`fire_`·`amb_` 클립), 그때 그 차만 `blink` 한다. 효과음 사이렌은 없다.
- [ ] **불 끄기**: 물줄기가 호스 끝에서 불꽃까지 닿고, L19 안에서 불꽃이 작아졌다가 연기 한 줄로 사라진다. 블록 집은 그대로.
- [ ] **고리 톡**: 손가락 힌트가 고리(사슬 끝)에 뜨고, 톡 뒤 고리가 범퍼로 가서 `찰칵!`, 빨간 자동차 앞이 들리고, 셋(견인차·고리·빨간)이 같이 60 움직인다.
- [ ] **맨 앞은 누구?**: 카드 다섯이 한 줄 위에 뜨고 순서가 무작위, 오답 때 그 차가 들썩이며 W 대사, 정답 때 견인차 반짝 + C2. 카드 그림이 자리표시여도 이름표로 구별된다.
- [ ] **끝**: 이현이 톡 뒤 다섯 대가 품 안(이현이 앞)에 모이고, 펄쩍 세 번, 합창 한 번(`_audio.json` 에 `chorus/ch_…` 한 클립; 없으면 다섯 클립이 차례로 — 합창 전 상태). 끝 화면에 '서로 도우면 함께 갈 수 있어요.' 와 리본(`?endpreview=1`).
- [ ] **컷 4장**이 그 사건 직후에만 뜨고(2장 `rc_cut_drop`, 5장 `rc_cut_fire`, 8장 `rc_cut_hook`, 10장 `rc_cut_hug`) 각 컷 위에서 맞는 대사(L5·L19·L36·L44)가 들린다. 이웃한 장면에 컷이 연달아 없다. 컷 안 인물 얼굴이 점 눈·띠 입이고 소품에 얼굴이 없다.
- [ ] 누르는 자리: `.tap-target.armed` 의 `getBoundingClientRect()` 짧은 변이 **화면 60px 이상**(장난감 셋·나비·고리는 hitBox, 카드, 이현이).

세로 390×844 (`node … 390 844 /tmp/rc_p 600 8`)
- [ ] 모든 조작 대상이 그 순간 화면 안에 있다(1장 장난감 셋 470~650, 2장 나비 640, 8장 고리(카메라 696), 9장 카드 2줄 413~587, 10장 이현이 600). 화면 밖이면 §3 의 P 좌표·`camSnap`·`follow` 를 고친다.
- [ ] 7·9장 한 줄이 달릴 때 카메라가 앞차를 따라가고, 7장 인사 때 소리 내는 차로 옮겨 간다. 3장 줌이 세로에서도 자동차를 가운데 둔다(clampCam 안).
- [ ] 말하는 배역에게 카메라가 붙고(`director`), 내레이션에서 원래 화면으로 돌아온다. 카메라가 배경 밖을 보이지 않는다.

소리
- [ ] `_audio.json` 에서 **같은 클립이 연달아 두 번** 기록되지 않는다(이중 재생).
- [ ] NAR 줄 수 = 그 경로에서 지나간 대사 수(기본 경로 50줄 + 오답 수). 빠진 줄은 `say()` 문장을 §6 과 글자 단위로 맞춘다(대본을 고치지 말고 코드를 고친다).
- [ ] 영어: `localStorage.lang = 'en'` 으로 한 번 더 돌려 `narration_el_en.js` 클립과 `TEXT_EN` 장면 이름·팝 글자가 나온다. 카드 그림은 영어에서도 같다.
- [ ] 녹음 받아쓰기 점검: 녹음 전 `touch /tmp/rc_marker`, 녹음 뒤 `~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py red_car /tmp/rc_marker ko` 와 `… en`. `<<<`(되풀이) 클립은 **그 mp3 만 지우고** `gen_tale.py` 를 다시 돌린다(`--redo` 금지). 영어 v4 는 반드시 본다.
- [ ] 사이렌 클립(`siren_*`)이 목소리로 낸 의성어로 들리고 웃음·말이 섞이지 않았다. 섞이면 그 클립만 지우고 다시 만든다. 이현이(Sparkles) 한국어 발음이 어색한 줄(L4·L7·L42·L43)은 `settings.child.stability` 를 .55 로 올려 그 줄만 다시.
- [ ] 1장 L2 와 두 컷(밥 2,400ms 뒤 잠)이 같이 끝난다. 7장 L28·9장 L38 이 이동 안에 끝난다(길면 이동 시간을 늘린다).

마무리
- [ ] 홈(`index.html`)에서 '나의 빨간 자동차' 카드가 만드는 중으로 보이고 `line` 이 §8 문구다.
- [ ] `git status` 에 다른 동화 파일 변경이 없다. `tales/kkultteok/` 은 손대지 않았다. 커밋은 사용자가 요청할 때.
