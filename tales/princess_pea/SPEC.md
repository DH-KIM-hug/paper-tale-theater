# 완두콩 공주 — 제작 상세 사양 (SPEC, 2026-10-21)

기획 확정본은 `PLAN.md`(9장, 안데르센 「완두콩 위의 공주」, 맨 아래 "확정 사항"이 최신). 이 문서는 그 기획을 **더 이상 판단 없이 코드로 옮길 수 있게** 장면마다 그림·좌표·크기·방향·조작·대사·효과음·타이밍을 적은 것이다. 참조 구현은 `tales/beauty_beast/beauty_beast.js`(**목업 자리표시**·`mk()`·`put()`·`sprite()`·`bgImage()`·HT 표)와 `tales/snow_white/snow_white.js`(수 세기 `vo('n…')`·`bedsG` 묶음·`T.tap`), `tales/magpie/magpie.js`(고르기 `T.choose`·`director`·`vo()`), 형식은 `tales/red_car/SPEC.md`·`red_car.js`. 모르는 것이 있으면 그 파일들에서 같은 이름의 코드를 찾아 그대로 따른다.

확정 사항(PLAN 맨 아래)과 사용자 규칙(2026-10-21)을 이 문서에 반영한 것:
- **교훈은 대사로 말하지 않는다.** PLAN 9번의 왕자 대사 "느낀 그대로 말해 줘서 고마워요"와 해설 "작은 것 하나도 소중하니까요"는 뺐다(왕자: "진짜 공주님을 드디어 찾았어요!", 해설: "완두콩은 박물관에 갔대요."). 교훈 문장은 부제와 끝 화면 글자(`run()` 반환값)로만 보인다.
- **수 세기 1~20은 목소리로만**(왕비 목소리 extra 클립 `n1`~`n20`). 숫자 말풍선·팝 글자 없음. 이불 스무 장은 세지 않고 자동으로 얹는다(4조각).
- 11~20 둘째 바퀴 유지(톡 한 번 뒤 듣기만). 왕비의 포옹(8번)은 대사 없이 동작만. `position`(위치말) 태그. 녹음은 ElevenLabs 한·영.
- 톡 3번: 1장 배(첫 조작, 시작 뒤 15초 안), 3장 성문, 9장 유리 상자(인사). 배움 놀이 3개: 4장 크기 비교(2문제), 5장 수 세기(톡 2번), 6장 위·아래(2문제). 연타 없음, 줄거리 선택 없음.
- 왕의 대사 "이 밤에 누구지?"는 PLAN 2번에 있었으나 **3번 성문이 열린 직후**로 옮겼다(2번은 바깥 시점이라 왕이 보이지 않는다. 대사·순서는 그대로: 노크 → 문 열림 → 왕이 묻고 → 공주가 답한다).
- 왕비의 3번 대사는 찡긋 자세 전환을 위해 두 줄로 나눴다("어서 들어와 몸을 말리렴." / "진짜 공주인지는… 살짝 알아볼까?").
- **가로 화면에서 엔진 카메라는 y 가 280 으로 고정된다**(`clampCam`, z ≤ 1). PLAN의 "장면 안에서 카메라를 위로 올린다"는 **세트 이동(`rig`)** 으로 구현한다: 침대·탑·사다리·꼭대기의 공주를 한 `<g>` 에 넣고 그 묶음을 아래로 130 내리면 꼭대기가 보인다(§5-1). 세로 화면도 같다.
- 그림 목록에서 지도 두루마리(왕자 한숨 그림에 포함), 등불(왕 그림에 포함), 달·별(밤 배경에 포함), 빗줄기(코드), 꽃잎(코드)을 뺐다. 완두콩은 PLAN 대로 자리마다 크기가 다르다(판자 위 12 · 비교 놀이 22 · 유리 상자 30) — 이것은 PLAN 그림 설계 메모의 확정이라 §4-1 예외로 둔다.

## 0. 만들 파일과 순서

| 순서 | 파일 | 만드는 방법 |
|---|---|---|
| 1 | `tools/app/gen/jobs_princess_pea.json` | **이미 있음**(45장: 스프라이트 35 + 배경 5 + 키아트 5, 접두어 `pp_`). 그림 생성: `python3 tools/app/gen/run_simple.py princess_pea <id ...>` 를 `pass` 1 → 2 → 3 순으로(참고 그림이 먼저 있어야 함), 키아트(`key_*`)는 맨 뒤. 작업표가 이 순서로 정렬되어 있다. 한도에 걸리면 run_simple.py 가 풀리는 시각까지 기다렸다 이어 간다. 받은 그림 점검은 §10. |
| 2 | 후처리 | `~/.venvs/paper-tale/bin/python tools/app/gen/post_tale.py princess_pea` → `assets/v3w/pp_<id>.webp`(스프라이트는 마젠타 크로마키 → 여백 없이 오림 → 높이 600(폭 900) 안, 배경 1600×902). 끝에 ASP(폭/높이)가 `tales/princess_pea/ASP.txt` 에 나온다 → 코드 `ASP` 표에 붙인다(§2-1 의 고정 ASP 네 개는 제외). **그림이 아직 없어도 코드는 자리표시(§1-1)로 돈다.** |
| 3 | `tales/princess_pea/index.html` | `tales/beauty_beast/index.html` 그대로 복사, `<title>완두콩 공주</title>`, 마지막 스크립트 `princess_pea.js`. 합창 로더는 넣지 않는다(합창 없음). |
| 4 | `tales/princess_pea/narration.js` | Typecast 없음. `/* princess_pea — Typecast 없음. ElevenLabs(narration_el.js)가 채운다 */\nconst NARRATION_CLIPS = {};\nconst VOICE_LINES = {};` |
| 5 | `tales/princess_pea/narration_en.js` | `const NARRATION_CLIPS_EN = {}; const VOICE_LINES_EN = {}; const TEXT_EN = {…};` — `TEXT_EN` 은 `voice_script_en.json` 의 `"ui"` 를 그대로 JSON 으로 붙인다(미녀와 야수 `narration_en.js` 와 같은 모양). 영어 모드 화면 글자에 한글이 남으면 안 된다(§11). |
| 6 | `tales/princess_pea/princess_pea.js` | 이 문서 §1~§6 대로 새로 쓴다. 그림이 없는 동안은 **자리표시 목업**으로 끝까지 돌아야 한다. |
| 7 | `tales/catalog.js` | §8 의 항목을 `red_car` 항목 뒤에 추가(`making: true`). |
| 8 | 녹음 | `python3 tools/elevenlabs/gen_tale.py princess_pea --model eleven_v4 --dry`(2026-10-21 대본 기준: 한국어 44줄 + extra 20, 약 1,014자; 영어 `--lang en` 약 2,317자) → `--dry` 빼고 생성 → `audio/el/princess_pea/*.mp3` + `narration_el.js`, 영어 `audio/el/princess_pea/en/` + `narration_el_en.js`. 녹음 뒤 `check_new.py` 되풀이 점검(§11). |
| 9 | 썸네일·키아트 | §9 (인물 그림이 다 나온 뒤). |
| 10 | 자동 재생 점검 | §11 체크리스트. |

커밋·푸시는 사용자가 요청할 때만 한다. 다른 동화 파일은 건드리지 않는다. `tales/kkultteok/` 의 그림·참고 사진은 어떤 경로로도 쓰지 않는다.

## 1. 코드 구조 (`princess_pea.js`, beauty_beast.js 를 거울처럼)

```js
/* 완두콩 공주 — 안데르센 「완두콩 위의 공주」. 기획: tales/princess_pea/PLAN.md, 상세: SPEC.md (2026-10-21)
   톡 3번(1장 배 · 3장 성문 · 9장 유리 상자), 배움 놀이 3개(4장 제일 작은 것·제일 큰 것 · 5장 매트리스 1~20 세기(톡 2번) · 6장 위·아래), 연타 없음, 줄거리 선택 없음. 교훈 대사 없음.
   수 세기는 왕비 목소리 클립(vo('n1'..'n20'))로만, 숫자 글자 없음. 이불 4조각은 세지 않고 자동.
   탑: 매트리스 한 장 = 240×20 종이 조각(금·크림·감 3색 번갈아 20장 = 400px). 침대·탑·사다리·꼭대기 공주는 rig 묶음에 넣고, 꼭대기를 볼 때 rig 를 +130 내린다(엔진 카메라 y 는 고정).
   크기: 사람 넷은 머리 폭이 같다(HT 표, 공주 서기 기준). 소품은 얼굴 없음. 완두콩은 자리마다 크기가 다르다(PLAN 확정: 판자 12 · 비교 22 · 상자 30).
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/pp_*.webp (목록 tools/app/gen/jobs_princess_pea.json) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { /* post_tale.py 출력(tales/princess_pea/ASP.txt). 그림이 오기 전엔 §2-1 의 시작값 */ };
  const FIXED_ASP = { pp_prop_mattress_gold: 12, pp_prop_mattress_cream: 12, pp_prop_mattress_persimmon: 12, pp_prop_duvet: 12.2, pp_prop_bed_board: 8.7 };  // §2-1: 상자를 폭·높이 둘 다 고정(preload 로 덮어쓰지 않음)
  const HT  = { /* §2-2 */ };
  const NAT = { /* §2-3 */ };
  const FL = 505;                       // 바닥(발끝 y)
  const MAT_W = 240, MAT_H = 20, BOARD_TOP = 475, TOP20 = BOARD_TOP - 20 * MAT_H;   // 탑: 판자 윗면 475, 20장 꼭대기 75
  const DUV_STEP = 12, DUV_TOP = TOP20 - 3 * DUV_STEP - HT.pp_prop_duvet;            // 이불 4장 꼭대기 y = 19
  const RIG_UP = 130;                   // 꼭대기를 볼 때 rig 를 내리는 양(§5-1)
  const BGS = ['pp_bg_room_day', 'pp_bg_gate_night', 'pp_bg_guest_day', 'pp_bg_guest_night', 'pp_bg_yard_day'];
  const src = k => AS + k + '.webp';    // 배경·스프라이트 모두 파일 이름 전체(pp_…)로 부른다
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  const artOK = {}, bgOK = {};          // preload 결과(그림이 실제로 있는지) — 없으면 자리표시
  function placeholder(T, parent, f, w, h) { … }   // §1-1
  function sprite(T, parent, f, x, y, w, h) { … }  // beauty_beast.js 117~122행 그대로(artSrc → src)
  const BGPH = { … };                   // §1-1 배경 자리표시 표(키는 pp_… 전체 이름)
  function bgImage(T, key) { … }        // beauty_beast.js 124~133행 그대로(bgSrc → src)
  function mk(T, poses) { … }           // beauty_beast.js 136~158행 그대로 (poses = { 이름: [그림, 높이] }, NAT 는 NAT[f])
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) { … }   // beauty_beast.js 그대로
  const hide, fadeIn, fadeOut, glow     // beauty_beast.js 그대로 (glow = hintGlow 필터 ms 동안)
  const sfx = (T, name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });
  function hitBox(T, a, w = 100, h = 100) { … }    // §5-4 누르는 자리 넓히기
  let rig, rigY = 0;                    // §5-1 세트 묶음
  function newRig(T) { … }  function inRig(a) { … }  function rigTo(T, dy, ms) { … }
  function zone(T, x, y, w, h) { … }    // §5-2 위·아래 구역(연한 종이 띠)
  function rain(T) { … }                // §5-3 빗줄기(코드)
  function petals(T) { … }              // §5-5 꽃잎(코드)
  async function run(T) { … }           // §3 장면 1~9
  Tale.mount({ title: '완두콩 공주', subtitle: '느낀 것을 솔직하게 말하는 마음이 진짜 공주의 마음이에요', run: T => run(Tale.api) });
})();
```

`run(T)` 머리 부분:

```js
const { sleep, camSnap, tr } = T;
const GAP = 700, SCENE_END = 1500, SAIL = 4200, COUNT_A = 720, COUNT_B = 680, CLIMB = 3200;   // §2-7 속도 상수
const say = async text => { await T.say(text); await sleep(GAP); };
const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(수 세기 n1~n20)
const scene = key => { T.clear(); bgImage(T, key); newRig(T); camSnap(500, 280, 1); };
const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
const X = (l, p) => (P ? p : l);
const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
const TX = X(560, 520);                        // 탑(침대) 가운데 x — 4·5·6·7·8장 공통
AudioFX.preloadSfx(['paper_down', 'paper_up', 'swish', 'whoosh', 'knock', 'creak', 'boom', 'sparkle', 'tada', 'step_wood', 'poke', 'splash', 'bubbles']);
/* 그림 파일 미리 받기: 있으면 쓰고(artOK/bgOK), 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 — FIXED_ASP 에 있는 그림은 덮어쓰지 않는다 */
const loads = [];
BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && !FIXED_ASP[k] && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
await Promise.race([Promise.all(loads), sleep(4000)]);
Object.assign(ASP, FIXED_ASP);
// 배우 (자세 이름: [그림, 높이]) — 높이는 HT[그림]
const pea    = mk(T, { stand: ['pp_princess_stand', HT.pp_princess_stand], wet: ['pp_princess_wet', HT.pp_princess_wet], climb: ['pp_princess_climb', HT.pp_princess_climb],
                       lie_a: ['pp_princess_lie_a', HT.pp_princess_lie_a], lie_b: ['pp_princess_lie_b', HT.pp_princess_lie_b], sleepy: ['pp_princess_sleepy', HT.pp_princess_sleepy],
                       honest: ['pp_princess_honest', HT.pp_princess_honest], hold: ['pp_princess_hold', HT.pp_princess_hold], wave: ['pp_princess_wave', HT.pp_princess_wave] });
const prince = mk(T, { sigh: ['pp_prince_sigh', HT.pp_prince_sigh], stand: ['pp_prince_stand', HT.pp_prince_stand], surprise: ['pp_prince_surprise', HT.pp_prince_surprise],
                       joy: ['pp_prince_joy', HT.pp_prince_joy], hold: ['pp_prince_hold', HT.pp_prince_hold] });
const queen  = mk(T, { smile: ['pp_queen_smile', HT.pp_queen_smile], wink: ['pp_queen_wink', HT.pp_queen_wink], place: ['pp_queen_place', HT.pp_queen_place],
                       lift: ['pp_queen_lift', HT.pp_queen_lift], hug: ['pp_queen_hug', HT.pp_queen_hug] });
const king   = mk(T, { lantern: ['pp_king_lantern', HT.pp_king_lantern] });
const MATF = ['pp_prop_mattress_gold', 'pp_prop_mattress_cream', 'pp_prop_mattress_persimmon'];
const mats  = Array.from({ length: 20 }, (_, i) => prop(T, MATF[i % 3], MAT_H));     // 20장(금·크림·감 번갈아)
const pile  = Array.from({ length: 5 }, (_, i) => prop(T, MATF[i % 3], MAT_H));      // 5장 더미(5장 장면)
const duvs  = Array.from({ length: 4 }, () => prop(T, 'pp_prop_duvet', HT.pp_prop_duvet));
const peaB = prop(T, 'pp_prop_pea', 12), peaC = prop(T, 'pp_prop_pea', 22), peaM = prop(T, 'pp_prop_pea', 30);   // 판자 위·비교 놀이·유리 상자
const matC = prop(T, 'pp_prop_mattress_gold', MAT_H), pillow = prop(T, 'pp_prop_pillow', HT.pp_prop_pillow);        // 4장 비교 보기
const board = prop(T, 'pp_prop_bed_board', HT.pp_prop_bed_board), ladder = prop(T, 'pp_prop_ladder', HT.pp_prop_ladder);
const boat = prop(T, 'pp_prop_boat', HT.pp_prop_boat), lands = prop(T, 'pp_prop_far_lands', HT.pp_prop_far_lands);
const cloudA = prop(T, 'pp_prop_cloud', HT.pp_prop_cloud), cloudB = prop(T, 'pp_prop_cloud', HT.pp_prop_cloud), bolt = prop(T, 'pp_prop_lightning', HT.pp_prop_lightning);
const doorC = prop(T, 'pp_prop_door_closed', HT.pp_prop_door_closed), doorO = prop(T, 'pp_prop_door_open', HT.pp_prop_door_open), kase = prop(T, 'pp_prop_case', HT.pp_prop_case);
const ALL = [pea, prince, queen, king, ...mats, ...pile, ...duvs, peaB, peaC, peaM, matC, pillow, board, ladder, boat, lands, cloudA, cloudB, bolt, doorC, doorO, kase];
ALL.forEach(hide);
T.director({ cast: { pea, prince, queen, king }, noFace: ['pea', 'prince', 'queen', 'king'] });
```

`T.director` 는 세로 화면에서만 말하는 배역에게 카메라를 붙인다(가로는 무대 전체가 보임). 방향은 장면에서 직접 정하므로 `noFace` 에 전부 넣는다. cast 키는 대본의 배역 키(`pea`·`prince`·`queen`·`king`)와 같아야 한다. 주의: `T.clear()` 는 `T.world` 를 비우므로 `scene()` 마다 `newRig(T)` 로 rig 를 새로 만든다. `scene()` 안에서 다시 `put` 하는 배우는 `hide` 상태라도 상관없다.

### 1-1. 자리표시(목업) 규칙 — 그림이 없을 때
`beauty_beast.js` 의 `placeholder()`·`sprite()`·`BGPH`·`bgImage()` 를 그대로 가져와 이 동화의 표로 바꾼다. 자리표시는 **그림과 같은 상자(w×h)** 안에 그리므로 그림이 생기면 코드 변경 없이 바뀐다. 이름표(`.phl`)는 뒤집혀도 글자가 뒤집히지 않게 `a.place` 를 덮어쓴 부분까지 같이 가져온다.

| 그림 | 자리표시 모양 | 색 |
|---|---|---|
| `pp_princess_*` | 큰 동그라미 머리(머리 폭이 전체 높이의 .4 = 2.5등신) + 크림 사다리꼴 치마 몸 + 허리 초록 띠 + 연갈색 머리 반원(묶음은 위에 작은 원). `wet` 은 머리 반원을 어깨까지 길게 + 파란 점 3개. `lie_a`·`lie_b` 는 누운 상자라 머리를 왼쪽에, 몸을 오른쪽에 가로로(`lie_b` 는 눈 없음). `climb`·`hold` 는 점 눈을 보는 쪽(§2-3 NAT)으로 치우침. `sleepy` 는 눈을 반달 선, `honest` 는 눈 r 을 1.4배, `wave` 는 머리 옆에 작은 손 원 | 머리 `#F2D9B8`, 머리카락 `#8a6a48`, 치마 `#F6ECD8`, 띠 `#3F6B4F` |
| `pp_prince_*` | 동그라미 머리 + 남색 직사각 몸 + 머리 위 금색 세모 셋(관). `sigh` 는 눈썹 사선 + 손 옆 작은 크림 두루마리, `surprise` 는 입 O, `joy` 는 팔 위로(크림 선 2), `hold` 는 한쪽으로 뻗은 팔 선 | 몸 `#1F2A56`, 머리카락 `#3a2a1c`, 관 `#D9A94E` |
| `pp_queen_*` | 동그라미 머리 + 팥색 둥근 몸(조금 넓고 낮음) + 흰 머리 반원 + 머리 위 작은 흰 원(틀어 올림) + 안경(얇은 원 2). `wink` 는 한쪽 눈 호선, `place` 는 몸을 15° 기울임, `lift` 는 팔 선 둘 위로, `hug` 는 팔 선 둘 양옆으로 | 몸 `#A93B32`, 머리 `#F4F6FA` |
| `pp_king_lantern` | 동그라미 머리 + 갈색 직사각 몸 + 흰 수염 반원 + 금색 관 + 손 옆 앰버 사각(등불) | 몸 `#6B4A32`, 등불 `#F2B366` |
| `pp_prop_pea` | 초록 원 + 왼쪽 위 작은 연초록 원 | `#3F6B4F`, `#5c8b6a`. **얼굴 없음** |
| `pp_prop_mattress_*` / `pp_prop_duvet` | 둥근 가로 직사각(상자 전체) / 흰 가로 직사각 + 아래 물결 | 금 `#D9A94E` · 크림 `#F6ECD8` · 감 `#E8703A` / `#F4F6FA` |
| `pp_prop_pillow` / `pp_prop_bed_board` / `pp_prop_ladder` | 크림 둥근 직사각 + 초록 띠 / 갈색 판 + 다리 2 + 왼쪽 머리판 / 세로 선 2 + 가로 선 7 | `#F6ECD8` / `#6B4A32` / `#6B4A32` |
| `pp_prop_boat` / `pp_prop_far_lands` / `pp_prop_cloud` / `pp_prop_lightning` | 갈색 호 + 크림 삼각 돛 / 연보라 성 실루엣 2 + 작은 세로 타원 3 / 남색 둥근 구름 / 앰버 지그재그 선 | 팔레트 토큰. **얼굴 없음** |
| `pp_prop_door_closed` / `pp_prop_door_open` / `pp_prop_case` | 갈색 아치 + 가운데 세로선 / 양 끝 좁은 갈색 판 둘(가운데 비움) / 갈색 받침 + 연회색 테두리 사각(속 비움) | `#6B4A32` / `#DCE3EA` |
| 배경 `pp_bg_*` | 평평한 종이 한 장 + 바닥 띠(y 412~) + 요소 2~3개 + 위에 "(그림 자리) 배경: 이름" 글자 | room_day: 벽 `#F6ECD8`·바닥 `#D9A94E`·오른쪽 창 아치(x 554~954, y 49~353, 위 하늘 `#BFD8EE`·아래 바다 `#8B7BB8`, 수평선 y 250) / gate_night: 하늘 `#1F2A56`·벽 `#55607F`·바닥 `#3a3f55`·문 자리 앰버 사각(x 617~783, y 205~505) / guest_day: 벽 `#F6ECD8`·바닥 `#6B4A32`·왼쪽 위 창 사각 / guest_night: 벽 `#2B3263`·바닥 `#3a2a1c`·왼쪽 위 창 + 달 원 / yard_day: 하늘 `#BFD8EE`·성벽 띠 `#F6ECD8`·잔디 `#3F6B4F` |

자리표시 이름표 글자: 인물은 `WHO[who] + ' ' + POSE[pose]`(예: "공주 비 맞음", "왕비 찡긋"), 소품은 `PROPN[f]`(예: "완두콩"). 글자는 §6 과 무관(녹음 없음).

## 2. 공통 수치

### 2-1. 그림 비율(ASP, 폭/높이) — 시작값(그림이 오면 post_tale.py 값으로 바꾼다; preload 가 실제 비율로 덮어쓴다)
```
pp_princess_stand .45, pp_princess_wet .50, pp_princess_climb .55, pp_princess_lie_a 1.86, pp_princess_lie_b 1.86, pp_princess_sleepy .48, pp_princess_honest .45, pp_princess_hold .62, pp_princess_wave .52,
pp_prince_sigh .48, pp_prince_stand .45, pp_prince_surprise .55, pp_prince_joy .60, pp_prince_hold .62,
pp_queen_smile .55, pp_queen_wink .55, pp_queen_place .70, pp_queen_lift .60, pp_queen_hug .80,
pp_king_lantern .60,
pp_prop_pea 1.0, pp_prop_pillow 2.0, pp_prop_ladder .20, pp_prop_boat 1.1, pp_prop_far_lands 9.0, pp_prop_cloud 2.0, pp_prop_lightning .35,
pp_prop_door_closed .55, pp_prop_door_open 1.4, pp_prop_case .5
고정(FIXED_ASP, preload 로 덮어쓰지 않음): pp_prop_mattress_gold 12, pp_prop_mattress_cream 12, pp_prop_mattress_persimmon 12, pp_prop_duvet 12.2, pp_prop_bed_board 8.7
```
고정 ASP 는 상자를 **폭·높이 둘 다** 정하기 위한 것이다(`sprite()` 가 `preserveAspectRatio: 'none'` 이라 그림이 상자에 맞춰진다). 매트리스는 프롬프트에서 10:1 로 그리게 했으므로 12:1 상자에 넣어도 눌림이 거의 없다. 받은 그림의 실제 비율이 8 보다 작으면(너무 두꺼움) 그 매트리스만 다시 생성한다.

### 2-2. 높이(HT) — 같은 인물·소품은 자세가 달라도 같은 크기 (CLAUDE.md §4-1)
무대 1000×560, 바닥 `FL = 505`. 높이는 그림 상자가 아니라 **같은 부위의 크기**가 같아지도록 정한다.

**사람 넷 — 얼굴 폭(귀~귀)으로 맞춤.** 머리 크기는 다른 동화의 사람 인물(2.5등신)과 같다.
- 공주(기준 `pp_princess_stand`) **240**. 다른 자세 시작값: `wet` 240, `sleepy` 240, `honest` 240, `wave` 250(팔이 올라가 상자가 높다), `hold` 240, `climb` 245(무릎을 들어 상자가 조금 높다), `lie_a`·`lie_b` **129**(누운 상자: 폭 240 = 키, 129 = 240/1.86). 받은 뒤 얼굴 폭을 재서 `HT[자세] = 240 × (fw_stand/H_stand) ÷ (fw_pose/H_pose)` 로 고친다(누운 그림은 머리 지름으로). ±12% 밖이면 그 자세만 다시 생성한다.
- 왕자 **240**(`sigh`·`stand`·`hold` 240, `surprise` 245, `joy` 255). 받은 뒤 얼굴 폭을 공주 `stand` 와 같게 맞춘다(사람끼리 머리 크기 같음).
- 늙은 왕비 **225**(`smile`·`wink` 225, `place` 200(허리를 굽혀 상자가 낮다), `lift` 250(팔 위), `hug` 225). 늙은 왕 **225**. 받은 뒤 얼굴 폭을 공주 `stand` 와 같게 맞춘다(키만 작고 머리는 같다).

**소품**
| 그림 | HT | 폭(참고) | 비고 |
|---|---|---|---|
| pp_prop_mattress_gold/cream/persimmon | **20** (`MAT_H`) | 240 (`MAT_W`, 고정 ASP 12) | 20장 = 400px = 화면 높이의 7할. 4장 비교 보기도 같은 20 |
| pp_prop_duvet | **20** | 244 (고정 ASP 12.2) | 4장을 12px 간격으로 겹침 → 더미 높이 56 |
| pp_prop_pillow | **40** | 80 | 매트리스 폭의 1/3, 완두콩(22)보다 분명히 큼 |
| pp_prop_pea | 12 / 22 / 30 | | 판자 위(`peaB`) / 비교 놀이(`peaC`, hitBox 100) / 유리 상자(`peaM`) — PLAN 확정 예외 |
| pp_prop_bed_board | **30** | 261 (고정 ASP 8.7) | 윗면 y = 475 (`BOARD_TOP`). 매트리스보다 조금 넓다 |
| pp_prop_ladder | **470** | ≈94 | 바닥 505 → 꼭대기 35(이불 꼭대기 19 근처) |
| pp_prop_boat | **44** | ≈48 | 창 속 바다(원근으로 작게) |
| pp_prop_far_lands | **44** | ≈396 | 창 속 수평선(원근) |
| pp_prop_cloud | **70** | 140 | 2개(둘째는 뒤집음) |
| pp_prop_lightning | **160** | 56 | 한 번 번쩍 |
| pp_prop_door_closed | **300** | 165 | 2·3장 톡 대상(hitBox 180×300 — 그대로 충분) |
| pp_prop_door_open | 300 | ≈420 | 양쪽으로 젖혀진 두 문짝, 가운데는 비어 있다(열린 문은 같은 자리에 놓는다) |
| pp_prop_case | **150** | 75 | 9장 톡 대상(hitBox 100×150). 완두콩은 상자 안 `(case.x, case.y - 95)` ±15 |

### 2-3. 그림이 보는 쪽(NAT) — 뒤집기 규칙
`mk()` 는 `NAT` 가 `'front'` 가 아니고 원하는 쪽과 다르면 좌우로 뒤집는다.

| 그림 | NAT | 비고 |
|---|---|---|
| pp_princess_stand, wet, sleepy, honest, wave | front | 안 뒤집음 |
| pp_princess_climb | **left** | 사다리(탑 오른쪽)를 잡고 탑 쪽(왼쪽)을 본다. 안 뒤집음 |
| pp_princess_lie_a, lie_b | left(머리 왼쪽) | 누운 그림은 뒤집지 않는다(`turn` 을 부르지 않음) |
| pp_princess_hold | **right** | 9장에서 `to:'left'` 로 **뒤집어** 왕자 쪽을 본다 |
| pp_prince_sigh, stand, surprise, joy | front | |
| pp_prince_hold | **right** | 9장에서 오른쪽(공주)을 본다. 안 뒤집음 |
| pp_queen_smile, wink, lift, hug | front | |
| pp_queen_place | **right** | 4장에서 침대(오른쪽)를 향해 굽힌다. 안 뒤집음 |
| pp_king_lantern | front | |
| pp_prop_boat | **right** | 1장 갈 때 오른쪽, **돌아올 때 `turn('left')` 로 뒤집어** 가는 방향을 본다 |
| 나머지 소품 | front | 구름 B 만 `turn('right')` 로 뒤집어 모양을 다르게(NAT 를 `left` 로 둔다) |

### 2-4. 겹침 순서(z)
`put()` 은 `T.world` 맨 뒤(가장 앞)에 붙인다. 뒤에 있어야 하는 것을 먼저 `put` 한다. rig 안도 `inRig()` 순서가 z 순서다.
- 1장: 먼 나라 띠 → 배 → 왕비 → 왕자(앞).
- 2장: 구름 둘 → 닫힌 문 → 번개 → 빗줄기(맨 앞).
- 3장: 열린 문짝 → 왕비(문 안쪽, 뒤) → 왕(문 안쪽) → 닫힌 문(톡 전까지) → 공주(밖, 앞) → 빗줄기(맨 앞).
- 4장: 침대 판자 → 왕비 → 비교 보기 셋(매트리스·베개·완두콩) → 판자 위 완두콩(`peaB`, 맨 앞).
- 5장: rig(판자 → 매트리스 1~20 → 이불 1~4 → `peaB`) → 더미 5장(rig 밖) → 왕비(rig 밖, 앞). **`peaB` 는 매트리스보다 앞**이라 1장이 얹혀도 아래쪽에 살짝 보인다.
- 6장: rig(판자 → 매트리스 → 이불 → `peaB` → 사다리 → 공주(오를 때·누울 때)) → 구역 띠 둘(rig 안, 맨 앞) → 왕비(rig 밖).
- 7장: rig(판자 → 매트리스 → 이불 → `peaB` → 사다리 → 공주 `lie_a/lie_b`).
- 8장: rig(판자 → 매트리스 → 이불 → `peaB` → 사다리) → 왕비 → 왕자 → 공주(사다리 앞).
- 9장: 유리 상자 → 상자 속 완두콩 → 왕자 → 공주 → 꽃잎(fx 층).

### 2-5. 세로 화면 규칙
- `P` 일 때 보이는 폭은 약 260. 한 컷에 **둘까지만** 보이게 좌표를 모으고(`X(l, p)` 의 p 값), 셋 이상은 `director`/`follow` 가 말할 때 데려온다.
- **아이가 눌러야 하는 것은 모두 한 화면(±130) 안**: 1장 배(창 속 x 600~900 → `camSnap(770)`, 배가 지나가도 톡은 출발 전 한 자리), 3장 문(700, `camSnap(630)` 에서 공주 560 과 같이 보임), 4장 비교 보기 셋(세로는 **세로 한 줄**: x 500, y 350·420·505 — §3 장면 4), 5장 침대 구역(`TX`=520, `camSnap(520)`), 6장 위·아래 띠(`TX` 중심, 폭 250 → 395~645, `camSnap(520)`), 9장 유리 상자(660, `camSnap(560)`).
- 카메라 y 는 280, z 는 1 로 고정. 줌 없음. 탑 꼭대기는 카메라가 아니라 **rig 이동**(§5-1)으로 보인다(가로·세로 같은 코드).
- 탑(폭 240)은 세로 보이는 폭(260) 안에 들어간다. 탑 옆의 왕비·더미는 세로에서 반쯤 잘려도 된다(말할 때 director 가 데려온다).

### 2-6. 누르는 자리 크기
- 톡·고르기 대상은 화면에서 **짧은 변 60 무대 px 이상**. 작은 것(배 44, 비교 완두콩 22)은 `hitBox()`(§5-4)로 투명 사각을 뒤에 깔아 100×100 으로 넓힌다. 문(165×300)·유리 상자(75×150 → hitBox 100×150)·침대 구역(250×250)·위아래 띠(250×190, 250×175)는 그대로 충분하다. `T.tap`/`T.choose` 에는 그 `hit` 그룹(`a.pos` 또는 구역 rect)을 넘긴다.
- 톡 대상은 기다리는 동안 살짝 들썩인다: `a.pos.animate([{translate:'0 0'},{translate:'0 -5px'},{translate:'0 0'}], {duration: 900, iterations: 3})`. 침대 구역(5장)은 대신 맨 위 매트리스(더미 꼭대기)가 들썩인다.

### 2-7. 속도 (한 편 7분 이상이 목표)
- `say()` 뒤 `GAP = 700`ms. 장면 끝(다음 `sceneCard` 전) `sleep(SCENE_END = 1500)`.
- 배 항해 편도 `SAIL = 4200`ms(linear), 매트리스 세기 간격 `COUNT_A = 720`(1~10)·`COUNT_B = 680`(11~20), 사다리 오르기 `CLIMB = 3200`.
- 대사 중 `hop`·`wiggle` 은 한 번만. 컷 그림(`cutImage`)은 이 동화에 없다.
- 전체 목표 7~8.5분. §11 에서 잰다. 7분이 안 되면 `SCENE_END` 를 2200, `GAP` 을 900, `SAIL` 을 5000 으로; 9분을 넘으면 `SCENE_END` 1200, `COUNT_A/B` 620/580(대사는 건드리지 않는다).

## 3. 장면별 상세

표기: `L(x)` 가로, `P(x)` 세로 좌표. 대사는 §6 표의 번호. 효과음 이름은 `sounds/sfx/` 파일명(§7). 모든 장면은 `await T.sceneCard(tr('이름'), () => { … }, focus.pos)` 로 넘어간다(1장만 `T.curtain(true)`). 팝(`T.pop`) 자리는 **인물의 머리·몸 상자 밖**에 둔다(표의 좌표가 그 자리다).

### 장면 1. 진짜 공주를 찾아서 (톡 1 — 배, 첫 조작: 시작 뒤 15초 안)
- `scene('pp_bg_room_day')`. 창 영역(배경 속): x 554~954, y 49~353, 수평선 y ≈ 250 (받은 배경을 보고 ±20 조정). 먼 나라 띠 `lands` 를 창 속 수평선에: `put(T, lands, 754, 262)`(바닥 y 262, 높이 44). 배 `boat` `put(T, boat, 600, 300, { to: 'right' })` + `hitBox(T, boat, 100, 100)` + 출렁임 `boat.body.animate([{translate:'0 0'},{translate:'0 -4px'},{translate:'0 0'}], {duration: 900, iterations: Infinity})`. 왕비 `smile` L410/P330, `FL`; 왕자 `sigh` L300/P420, `FL`(왕비 다음에 put → 앞). P: `camSnap(770)`(창 속 배가 가운데). `await T.curtain(true)`.
- **L1** → **L2**(안내) → `await T.tap(boat.hit, { prompt: '배를 톡 눌러 봐요.' })`.
- 톡 뒤: `AudioFX.sfx('swish', .35)` + `T.pop(754, 200, tr('출렁출렁'))`(창 속 하늘, 인물 없음) → 항해: `boat.move(900, 300, SAIL, 'linear')` 와 동시에 **L3**(`say`) — `const t = boat.move(…); await say(L3); await t;` → `sleep(500)` → 돌아오기: `boat.turn('left')`(뒤집어 가는 방향을 본다) → `boat.move(600, 300, SAIL, 'linear')` + 1,500ms 뒤 `T.pop(754, 200, tr('출렁출렁'))` 한 번 더 → 도착 `sleep(300)`.
- 왕자 한숨: `prince.wiggle(3, 500)` + `T.pop(prince.x - 95, FL - 250, tr('휴우'), '#1F2A56')`(머리 왼쪽 위, 왕비는 오른쪽이라 안 겹침) → **L4**(왕자) → `sleep(SCENE_END)`. 시작 버튼부터 L2 끝까지 ≤ 15초(§11).

### 장면 2. 폭풍우 밤 (자동)
- `sceneCard(tr('폭풍우 밤'))`, 배경 `pp_bg_gate_night`. 구름 `cloudA` `put(T, cloudA, 250, 110)`(바닥 y 110, 높이 70), `cloudB` `put(T, cloudB, 820, 95, { to: 'right' })`(뒤집음). 닫힌 문 `doorC` `put(T, doorC, 700, FL)`(배경의 앰버 문 자리 x 617~783, y 205~505 를 덮는다; ±10 조정). 번개 `bolt` `put(T, bolt, 480, 190)` 뒤 `bolt.pos.style.opacity = 0`. 빗줄기 `rain(T)` 시작(§5-3). 구름 흔들림: `cloudA.body.animate([{translate:'0 0'},{translate:'6px 0'},{translate:'0 0'}], {duration: 2400, iterations: Infinity})`(cloudB 는 `-6px`). focus: 문. P: `camSnap(700)`.
- **L5** 와 동시에 타이머: 1,200ms `bolt` 번쩍 — `bolt.pos.animate([{opacity:0},{opacity:1, offset:.15},{opacity:1, offset:.5},{opacity:0}], {duration: 450})` + `AudioFX.sfx('boom', .35)` + `T.pop(480, 60, tr('번쩍'), '#D9A94E')` + `T.shake()`; 2,000ms `T.pop(250, 40, tr('우르릉'), '#1F2A56')`(구름 위, 인물 없음). 구현: `const t = (async () => { await sleep(1200); …; await sleep(800); … })(); await say(L5); await t;`.
- `sleep(600)` → 노크: `doorC.wiggle(4, 300)` + `AudioFX.sfx('knock', .6)` + `T.pop(700, 150, tr('똑똑'))`(문 위) → 900ms 뒤 한 번 더(팝 x 740) → **L6** → `sleep(SCENE_END)`.

### 장면 3. 문 앞의 아가씨 (톡 2 — 성문)
- `sceneCard(tr('문 앞의 아가씨'))`, 같은 배경 `pp_bg_gate_night`. put 순서: 열린 문짝 `doorO` `put(T, doorO, 700, FL)` 뒤 `hide(doorO)`(톡 뒤에 보임) → 왕비 `smile` `put(T, queen, 745, FL)` → 왕 `lantern` `put(T, king, 700, FL)` → 둘 다 `hide`(문 안쪽이라 톡 전엔 보이지 않음) → 닫힌 문 `doorC` `put(T, doorC, 700, FL)` → 공주 `wet` L500/P560, `FL`, `to:'right'`(앞모습이라 안 뒤집힘; 문 쪽에 선다) → 물방울 팝은 아래 → `rain(T)`. 구름 둘은 이 장면에도 같은 자리(2장과 같이 put). focus: 문. P: `camSnap(630)`(공주 560·문 700 이 같이 보임).
- 물 뚝뚝: `T.pop(pea.x - 85, FL - 40, tr('뚝뚝'), '#1F2A56')`(공주 발 왼쪽, 몸 밖) → **L7**(안내) → 문 들썩임(§2-6) → `await T.tap(doorC.pos, { prompt: '성문을 톡 눌러 봐요.' })`.
- 톡 뒤: `AudioFX.sfx('creak', .5)` + `T.pop(700, 150, tr('끼익'))` → `fadeOut(T, doorC, 300)` 와 동시에 `doorO.pos.style.display = ''` + `fadeIn(T, doorO, 300)`, 왕·왕비 `fadeIn` 400ms(왕이 앞) + `glow(king, 1200)`(등불 빛) → **L8**(왕) → 공주 `hop(10, 320)` → **L9**(공주) → 왕비 `wiggle(3, 400)` → **L10**(왕비) → `queen.look('wink')` + `T.pop(queen.x + 70, FL - 250, tr('찡긋'))`(왕비 머리 오른쪽 위; 왕은 왼쪽) → **L11**(왕비) → 빗줄기 `fadeOut` 600ms → `sleep(SCENE_END)`.

### 장면 4. 왕비의 완두콩 (배움 놀이 1: 제일 작은 것 · 제일 큰 것)
- `sceneCard(tr('왕비의 완두콩'))`, 배경 `pp_bg_guest_day`. 침대 판자 `board` `put(T, board, X(820, 760), FL)` → `inRig(board)`(이 장면은 rig 0 고정). 왕비 `place` `put(T, queen, X(690, 620), FL)`(NAT right, 침대를 향해 굽힘). 비교 보기 셋 — **가로**: 매트리스 `matC` `put(T, matC, 180, FL)`, 베개 `pillow` `put(T, pillow, 360, FL)`, 완두콩 `peaC` `put(T, peaC, 470, FL)`; **세로**(x 500 세로 한 줄, 벽에 붙여 보여 주는 진열): `peaC` (500, 350), `pillow` (500, 420), `matC` (500, FL). 각각 `hitBox(T, a, 100, 100)`(매트리스는 `hitBox(T, matC, 250, 80)`). P: `camSnap(500)`. focus: `peaC`.
- **L12** → **L13**(안내) → `await T.choose([ { el: peaC.hit, ok: true }, { el: pillow.hit, ok: false, onWrong: async () => { await pillow.wiggle(8, 360); await say(W13a); } }, { el: matC.hit, ok: false, onWrong: async () => { await matC.wiggle(8, 360); await say(W13b); } } ], { prompt: '셋 중에서 제일 작은 것은 뭘까요? 눌러 봐요.' })` — `W13a`·`W13b` 는 §6 과 글자 하나까지 같다. 2회 오답부터 정답이 빛나고 나머지는 흐려진다(엔진).
- 정답: `AudioFX.ding()`(엔진) → `glow(peaC, 1200)` + `peaC.hop(14, 400)` + `sparkleSfx(T)` + `T.pop(peaC.x, peaC.y - 70, tr('반짝!'))` → **C13** → `sleep(400)`.
- **L14**(안내) → `await T.choose([ { el: matC.hit, ok: true }, { el: peaC.hit, ok: false, onWrong: … say(W14a) }, { el: pillow.hit, ok: false, onWrong: … say(W14b) } ], { prompt: '그럼 제일 큰 것은 뭘까요? 눌러 봐요.' })` → 정답: `glow(matC, 1200)` + `matC.hop(10, 400)` + `sparkleSfx(T)` + `T.pop(matC.x, matC.y - 60, tr('반짝!'))` → **C14**.
- 완두콩 놓기: `follow(X(700, 700))` → **L15**(왕비) 와 동시에 타이머 0ms: `peaC.move(queen.x + 60, FL - 120, 600, 'ease-in')`(왕비 손끝 `[+60, -120]` ±15) → 600ms `hide(peaC)` → 900ms `put(T, peaB, board.x - 60, BOARD_TOP + 4)` → `inRig(peaB)` + `fadeIn(T, peaB, 250)` + `AudioFX.sfx('poke', .4)` + `T.pop(board.x - 60, BOARD_TOP - 50, tr('톡'))`(판자 위, 왕비 머리는 x 620~690 쪽이라 안 겹침). `await say(L15); await t;` → 베개·매트리스 `fadeOut(400)` → `queen.look('wink')` → `sleep(SCENE_END)`.

### 장면 5. 매트리스 스무 장 (배움 놀이 2: 수 세기 1~20, 톡 2번)
- `sceneCard(tr('매트리스 스무 장'))`, 배경 `pp_bg_guest_day`. rig 0. `put(T, board, TX, FL)` → `inRig(board)`; `put(T, peaB, TX - 60, BOARD_TOP + 4)` 는 매트리스를 다 올린 뒤가 아니라 **지금** put 하되 z 를 앞에 두려면 매트리스를 올릴 때마다 `rig.appendChild(peaB.pos)` 로 다시 앞에 붙인다(간단히 세기 루프 끝마다 한 줄). 더미 `pile[k]` `put(T, pile[k], PILE_X, FL - k * MAT_H)` k=0..4, `PILE_X = X(850, 700)`(세로는 화면 밖, 조각이 밖에서 날아온다). 왕비 `lift` `put(T, queen, X(350, 400), FL)`. 침대 구역 `bedHit = T.el('rect', { x: TX - 125, y: BOARD_TOP - 230, width: 250, height: 260, fill: '#000', 'fill-opacity': 0 }, rig)`(톡 대상, 가운데 y ≈ 375). focus: `board`. P: `camSnap(TX)`.
- **L16**(왕비, 안내) → 더미 꼭대기 `pile[4]` 들썩임(§2-6) → `await T.tap(bedHit, { prompt: '완두콩 위에 매트리스를 쌓아 볼까? 몇 장일까요? 톡 눌러 봐요.' })`.
- 첫 바퀴(1~10): `for (let i = 0; i < 10; i++) { const m = mats[i]; put(T, m, PILE_X, FL - 100); inRig(m); rig.appendChild(peaB.pos); m.move(TX, BOARD_TOP - i * MAT_H, 450, 'ease-out'); AudioFX.sfx('paper_down', .35); vo('n' + (i + 1)); await sleep(COUNT_A); }` — **숫자 글자(팝·말풍선) 없음**, 소리만. `AudioFX.countBeat` 는 쓰지 않는다(목소리와 겹침).
- **L17**(왕비, 안내) → `pile[4]` 들썩임 → `await T.tap(bedHit, { prompt: '열! 아직 더 있어요. 한 번 더 톡!' })`.
- 둘째 바퀴(11~20): 같은 루프 `i = 10..19`, 간격 `COUNT_B`, `vo('n' + (i + 1))`; `i >= 15` 이면 날리기 전에 `hide(pile[19 - i])`(더미가 줄어 마지막엔 빈다).
- **L18**(왕비) → 이불: `for (let j = 0; j < 4; j++) { const d = duvs[j]; put(T, d, TX, -80); inRig(d); d.move(TX, TOP20 - j * DUV_STEP, 500, 'ease-in'); AudioFX.sfx('swish', .3); await sleep(550); }` → `rig.appendChild(peaB.pos)` → **L19** 와 동시에 `T.pop(TX, 150, tr('푹신푹신'))`(탑 가운데, 인물 없음) + 이불 넷 `hop(6, 400)` → `sleep(SCENE_END)`.
- 탑 꼭대기(이불 위) y = `DUV_TOP` = 19, 가로·세로 모두 화면 안(위 19px). rig 는 이 장면에서 움직이지 않는다.

### 장면 6. 위? 아래? (배움 놀이 3: 위·아래 위치말, 2문제)
- `sceneCard(tr('위? 아래?'))`, 배경 `pp_bg_guest_day`. rig 0 에 탑 전체를 다시 세운다(헬퍼 `buildTower(T)`: `board`(TX, FL) → `mats[i]`(TX, BOARD_TOP - i*MAT_H) 20장 → `duvs[j]`(TX, TOP20 - j*DUV_STEP) → `peaB`(TX - 60, BOARD_TOP + 4), 모두 `inRig`). 사다리 `ladder` `put(T, ladder, TX + 125, FL)` → `inRig`. 공주 `stand` `put(T, pea, X(TX + 180, TX + 160), FL)` → `inRig`(사다리 발치 오른쪽; 세로는 화면 밖 가장자리라 말할 때 director 가 데려온다). 왕비 `smile` `put(T, queen, X(330, 400), FL)`(rig 밖). 구역: `zTop = zone(T, TX - 125, 0, 250, 190)`, `zBot = zone(T, TX - 125, 330, 250, 175)`(§5-2, rig 안, 처음 opacity 0). focus: `board`. P: `camSnap(TX)`.
- **L20**(안내) 와 동시에 구역 둘 `fadeIn` 400ms → `await T.choose([ { el: zBot, ok: true }, { el: zTop, ok: false, onWrong: async () => { await wiggleEl(zTop); await say(W20); } } ], { prompt: '완두콩은 어디 있을까요? 탑의 위? 아래?' })` — `wiggleEl` 은 엔진 `choose` 의 흔들림과 같은 것(magpie.js 와 같이 로컬에 복사). 2회 오답부터 정답 구역이 빛난다(엔진).
- 정답: `glow(peaB, 1500)` + `peaB.hop(10, 360)` + `sparkleSfx(T)` + `T.pop(TX, 420, tr('반짝!'))`(탑 아래쪽, 인물 없음) → **C20**.
- **L21**(안내) → `await T.choose([ { el: zTop, ok: true }, { el: zBot, ok: false, onWrong: … say(W21) } ], { prompt: '공주님은 어디서 잘까요? 위? 아래?' })` → 정답: `zTop.style.filter = 'url(#hintGlow)'` 1,200ms + `sparkleSfx(T)` + `T.pop(TX, 110, tr('반짝!'))` → **C21** → 구역 둘 `fadeOut` 300ms 뒤 `remove()`.
- **L22**(왕비) → 오르기: `pea.look('climb', 'left')`; `pea.place(TX + 125, FL)`(사다리 앞, 같은 x) → `follow(TX + 40)` → `Promise.all([ pea.move(TX + 125, TOP20, CLIMB, 'linear'), rigTo(T, RIG_UP, CLIMB) ])` + 오르는 동안 500ms 마다 `AudioFX.sfx('step_wood', .3)`(while + sleep). 끝나면 공주가 꼭대기 옆(화면 y 75+130=205)에 있다.
- 눕기: `pea.look('lie_a')`; `pea.place(TX, DUV_TOP)`(머리 왼쪽, 상자 폭 240 = 이불 폭) + `AudioFX.sfx('paper_down', .3)` → **L23**(공주) → `sleep(SCENE_END)`. (rig 는 +130 인 채 장면이 끝난다.)

### 장면 7. 잠 못 든 밤 (자동)
- `sceneCard(tr('잠 못 든 밤'))`, 배경 `pp_bg_guest_night`. `buildTower(T)` + 사다리 + 공주 `lie_a` `(TX, DUV_TOP)` → `inRig` → **rig 를 바로 +130 에 놓는다**(`rigTo(T, RIG_UP, 0)`: 전환 중이라 애니메이션 없이 스냅). focus: 공주. P: `camSnap(TX)`.
- 뒤척임: `toss = setInterval(() => pea.look(pea.cur === 'lie_a' ? 'lie_b' : 'lie_a'), 900)` 시작 + `T.pop(X(TX - 180, TX - 60), 36, tr('뒤척뒤척'), '#1F2A56')`(공주 상자 y 22~151 위쪽 밖) → **L24** → 2,700ms 뒤 팝 한 번 더(x 같은 자리) → `clearInterval(toss)`; `pea.look('lie_a')`.
- **L25**(공주) 와 동시에 타이머: 0ms `rigTo(T, 0, 1500)`(아래로 내려가 판자가 보임) → 1,600ms `glow(peaB, 1600)` + `peaB.hop(8, 400)` + `AudioFX.sfx('poke', .3)` → 2,600ms `AudioFX.sfx('poke', .3)` 한 번 더 → `await say(L25); await t;` → `sleep(800)` → `rigTo(T, RIG_UP, 1000)` → 뒤척임 2번(`look('lie_b')` 700ms → `look('lie_a')`) → `sleep(SCENE_END)`.

### 장면 8. 아침 인사 (자동)
- `sceneCard(tr('아침 인사'))`, 배경 `pp_bg_guest_day`. rig 0. `buildTower(T)` + 사다리(공주는 꼭대기에 없다). 왕비 `smile` L290/P400, 왕자 `stand` L400/P500, 공주 `sleepy` L720/P620(사다리 발치 앞, rig 밖, 모두 `FL`). 세로에서는 왕비·왕자가 탑 앞에 겹쳐 선다(z 앞, 허용). focus: 공주. P: `camSnap(520)`.
- **L26** 과 동시에 공주 `wiggle(3, 500)` + `T.pop(pea.x, FL - 290, tr('하암'), '#1F2A56')`(머리 위, 상자 밖) → **L27**(왕비) → `pea.look('honest')` + `pea.hop(8, 300)` → **L28**(공주) → `prince.look('surprise')` + `prince.hop(10, 320)` → **L29**(왕비) 와 동시에 포옹(대사 없음): L29 끝난 뒤 `queen.look('hug')` → `queen.move(pea.x - 85, FL, 700, 'ease-out')` + `AudioFX.sfx('paper_up', .4)` → 도착 `T.pop(queen.x - 95, FL - 240, tr('꼬옥'))`(왕비 머리 왼쪽 위) + 왕비·공주 `hop(10, 360)` 같이 → `prince.look('joy')` + `prince.hop(12, 360)` → `sleep(SCENE_END)`.

### 장면 9. 진짜 공주 (톡 3 — 유리 상자, 마지막 인사)
- `sceneCard(tr('진짜 공주'))`, 배경 `pp_bg_yard_day`. put 순서: 유리 상자 `kase` `put(T, kase, X(800, 660), FL)` + `hitBox(T, kase, 100, 150)` → 상자 속 완두콩 `peaM` `put(T, peaM, kase.x, kase.y - 95)`(받은 상자 그림의 유리 가운데 ±15) → 왕자 `hold` `put(T, prince, X(430, 450), FL, { to: 'right' })` → 공주 `hold` `put(T, pea, X(520, 540), FL, { to: 'left' })`(뒤집어 왕자를 본다; 손끝이 x ≈ 482·468 에서 겹친다 — 받은 그림의 손 위치로 ±10 조정해 **손이 닿게**). focus: 유리 상자. P: `camSnap(560)`.
- **L30** → 둘 `hop(8, 320)` 같이 → **L31**(왕자) → `petals(T)` 시작(§5-5) → **L32** → **L33**(안내) → 상자 들썩임(§2-6) → `await T.tap(kase.hit, { prompt: '유리 상자를 톡 눌러 봐요.' })`.
- 톡 뒤: `glow(peaM, 1500)` + `peaM.hop(10, 360)` + `sparkleSfx(T)` + `T.pop(kase.x, kase.y - 190, tr('반짝!'))`(상자 위) → 둘 `look('wave')`(공주 `wave` 는 앞모습, `turn` 불필요) + `hop(12, 360)` → **L34** 와 동시에 `T.confetti(); AudioFX.sfx('tada') || sparkleSfx(T);` + `T.pop(X(475, 495), FL - 290, tr('안녕!'))`(두 사람 머리 사이 위) → `T.finale(); await sleep(1500); return '느낀 것을 솔직하게 말하는 마음이 진짜 공주의 마음이에요.';`
- 이 동화의 마지막 인사형 톡은 이 유리 상자 톡이다.

## 4. 배움 놀이 규칙 요약 (엔진 `T.choose`·`T.tap`)
- **4장 크기 비교**: 보기 셋(완두콩 22·베개 40·매트리스 20×240), 자리는 고정(가로 한 줄·세로 세로 한 줄), 정답 1개씩 두 문제(제일 작은 것 → 완두콩, 제일 큰 것 → 매트리스). 12초 무입력이면 `prompt` 를 다시 읽는다. 1회 오답 → `onWrong`(흔들림 + W 대사). 2회 오답부터 정답이 노랗게 빛나며 들썩이고 나머지는 흐려진다(엔진). 정답을 누르면 `AudioFX.ding()` → 반짝 → C 대사.
- **5장 수 세기**: 톡 2번(1~10, 11~20), 톡 뒤는 자동. 숫자는 왕비 목소리 `vo('n1')`~`vo('n20')` 만, 글자 없음. 5초 무입력 손가락 힌트(침대 구역 가운데), 12초 재안내(엔진 기본).
- **6장 위·아래**: 구역 둘(위 띠·아래 띠), 정답 1개씩 두 문제(완두콩 → 아래, 공주 → 위). 1회 오답 → 흔들림 + W 대사(정답 쪽을 말로 알려 준다). 2회 오답부터 정답 구역이 빛난다(엔진, PLAN 의 "손가락 힌트가 정답 쪽을 가리킨다"는 이 빛남으로 구현). 답이 틀려도 줄거리는 바뀌지 않는다.
- 오답 설명 뒤 바로 다시 고를 수 있다. 게임오버 없음. 셋 다 줄거리와 무관하다. 자동 재생(`auto_play`)에서는 엔진이 정답을 대신 누른다.

## 5. 코드로 그리는 것 (그림 없이)

### 5-1. 세트 묶음 `rig` — 탑 꼭대기 보기
`newRig(T)`: `rig = T.el('g', {}, T.world); rigY = 0;`. `inRig(a)`: `rig.appendChild(a.pos)`(put 뒤에 부른다; z 는 append 순서). `rigTo(T, dy, ms)`: `const from = rigY; rigY = dy; return ms ? T.anim(rig, [{ transform: \`translate(0,${from}px)\` }, { transform: \`translate(0,${dy}px)\` }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' }) : (rig.style.transform = \`translate(0,${dy}px)\`, Promise.resolve());` — `fill: 'forwards'` 뒤 `rig.style.transform` 도 같이 써 두면 다음 anim 이 이어진다. 배우의 `a.x/a.y` 는 rig 좌표(이동 전 값)이고 director 는 x 만 쓰므로 세로 카메라에 영향이 없다. `RIG_UP = 130`: 이불 꼭대기(19)와 누운 공주 상자 위(19 − 129 = −110)가 화면 20 아래로 들어오고, 판자(475~505)는 605~635 로 화면 밖에 숨는다.

### 5-2. 위·아래 구역 `zone(T, x, y, w, h)`
`T.el('rect', { x, y, width: w, height: h, rx: 14, fill: '#F6ECD8', opacity: 0 }, rig)` → 질문 때 `anim` opacity 0→.22(연한 종이 띠로 보여 "여기"를 알린다) → 정답 뒤 0 → `remove()`. 투명(opacity 0)이어도 `fill` 이 있어 pointer-events 를 받고, `hintGlow` 필터도 띠에 보인다. 두 띠 사이(y 190~330)는 비워 "위·아래"가 분명하다.

### 5-3. 빗줄기 `rain(T)` (2·3장)
`T.fx` 층(없으면 `T.world` 맨 앞)에 `g` 를 만들고 가는 선 28개(`line`, stroke `#BFD8EE`, width 2, opacity .55, 길이 34, 기울기 −12°)를 x −40~1040 에 무작위, y 0~560 무작위로 둔 뒤 `g.animate([{translate:'0 -80px'},{translate:'0 80px'}], {duration: 700, iterations: Infinity})`(선 전체가 아래로 흐르는 느낌; 위아래 여유 선을 둬 끊김이 안 보이게 y 범위를 −80~640 으로). 장면이 끝나면 `T.clear()` 가 지운다. 3장 끝에서 `fadeOut`.

### 5-4. 누르는 자리 넓히기 `hitBox(T, a, w, h)`
배우 `a.pos` 의 **맨 앞 자식으로** 투명 사각을 넣고(`T.el('rect', { x: -w/2, y: -h, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, a.pos)` — `a.pos.insertBefore(rect, a.body)` 로 그림 뒤에), `a.hit = a.pos` 를 둔다. `fill-opacity: 0` 이어도 pointer-events 는 받는다(`fill: none` 은 안 받는다). 톡·고르기에는 `a.hit` 을 넘긴다. 손가락 힌트는 `getBoundingClientRect` 를 쓰므로 자연히 사각 가운데를 가리킨다.

### 5-5. 꽃잎 `petals(T)` (9장)
`T.fx` 층에 작은 타원 10개(`ellipse` rx 7 ry 4, fill 번갈아 `#E8703A`·`#A93B32`·`#F6ECD8`, `filter: 'url(#pp)'`)를 x 300~900 무작위에 두고 각각 `animate([{translate:'0 -30px', rotate:'0deg'},{translate:'${±40}px 600px', rotate:'${±200}deg'}], {duration: 6000 + i*500, iterations: Infinity, delay: i*400})`. 끝 화면까지 계속 흐른다(엔진 `clear` 가 지운다).

## 6. 대사 전체 (voice_script_el.json 과 글자 하나까지 같다)
- `say()` 에 넘기는 한국어 문장은 아래 표와 **정확히** 같아야 녹음이 붙는다(한 글자라도 다르면 클립이 없어 조용히 넘어간다 → §11 `_audio.json` 으로 잡는다).
- 배역 키: nar(해설, **Lily**) pea(공주, **Yoojin Kim** — 백설·신데렐라·인어공주의 Luna, 벨의 Yun 과 다름) prince(왕자, **Klamon**) queen(늙은 왕비, **Huelyn**) king(늙은 왕, **Namchun**). 한 편 안에서 다섯 목소리가 모두 다르다.
- 톡 안내(L2·L7·L33)와 고르기 안내(L13·L14·L20·L21)·세기 안내(L16·L17)는 `say()` 로 읽은 뒤 같은 문장을 `prompt` 로 넘긴다(12초 재안내).
- 말풍선 없는 소리(`extra`, `vo(key)`): `n1`~`n20`(하나!~스물!, **왕비** 목소리). 화면 글자 없음. 합창·의성어 extra 없음.

| # | 장면 | 배역 | 한국어 (`say()`에 넘기는 문장 그대로) | 영어 | 쓰임 |
|---|---|---|---|---|---|
| L1 | 1 | 해설 | 옛날에 진짜 공주와 결혼하고 싶은 왕자가 있었어요. | Once upon a time, there was a prince who wanted to marry a true princess. |  |
| L2 | 1 | 해설 | 배를 톡 눌러 봐요. | Tap the boat. | 톡 안내(첫 조작) |
| L3 | 1 | 해설 | 왕자는 배를 타고 온 세상을 돌아다녔어요. | The prince sailed all around the world on his boat. | 항해 위 |
| L4 | 1 | 왕자 | 온 세상을 다 가 봤지만, 진짜 공주인지 알 수 없었어요. | I went all around the world, but I could never tell if a princess was a true princess. | 돌아온 뒤 |
| L5 | 2 | 해설 | 그날 밤, 비가 쏟아지고 천둥이 우르릉! | That night, the rain poured down and the thunder went rumble, rumble! | 폭풍 위 |
| L6 | 2 | 해설 | 누가 성문을 똑똑, 두드려요. | Someone was knocking at the castle gate. Knock, knock. | 노크 뒤 |
| L7 | 3 | 해설 | 성문을 톡 눌러 봐요. | Tap the gate. | 톡 안내 |
| L8 | 3 | 왕 | 이 밤에 누구지? | Who could it be at this hour? | 문 열린 뒤 |
| L9 | 3 | 공주 | 비를 맞았지만 괜찮아요. 저는 진짜 공주예요! | I got caught in the rain, but I'm all right. I am a true princess! |  |
| L10 | 3 | 왕비 | 어서 들어와 몸을 말리렴. | Come in, dear, and dry yourself off. |  |
| L11 | 3 | 왕비 | 진짜 공주인지는… 살짝 알아볼까? | A true princess, hmm? Let's find out... just a little. | 찡긋 |
| L12 | 4 | 해설 | 왕비님은 손님방에 완두콩 한 알, 베개, 매트리스 한 장을 가져왔어요. | The queen brought one pea, a pillow and a mattress into the guest room. |  |
| L13 | 4 | 해설 | 셋 중에서 제일 작은 것은 뭘까요? 눌러 봐요. | Which of the three is the smallest? Tap it. | 고르기 안내 1 |
| W13a | 4 | 해설 | 그건 베개예요. 더 작은 걸 찾아봐요. | That's the pillow. Look for something smaller. | 오답(베개) |
| W13b | 4 | 해설 | 그건 매트리스예요. 더 작은 걸 찾아봐요. | That's the mattress. Look for something smaller. | 오답(매트리스) |
| C13 | 4 | 해설 | 맞아요, 완두콩이 제일 작아요! | That's right, the pea is the smallest! | 정답 |
| L14 | 4 | 해설 | 그럼 제일 큰 것은 뭘까요? 눌러 봐요. | Then which one is the biggest? Tap it. | 고르기 안내 2 |
| W14a | 4 | 해설 | 그건 완두콩이에요. 더 큰 걸 찾아봐요. | That's the pea. Look for something bigger. | 오답(완두콩) |
| W14b | 4 | 해설 | 그건 베개예요. 더 큰 걸 찾아봐요. | That's the pillow. Look for something bigger. | 오답(베개) |
| C14 | 4 | 해설 | 맞아요, 매트리스가 제일 커요! | That's right, the mattress is the biggest! | 정답 |
| L15 | 4 | 왕비 | 요 조그만 완두콩 한 알을 침대 판자에 톡. 아무도 못 본 척! | This tiny little pea goes on the bed board, tap. Nobody saw a thing! | 완두콩 놓기 |
| L16 | 5 | 왕비 | 완두콩 위에 매트리스를 쌓아 볼까? 몇 장일까요? 톡 눌러 봐요. | Shall we pile mattresses on top of the pea? How many will there be? Tap! | 톡 안내(세기 1) |
| n1~n20 | 5 | 왕비 | 하나! 둘! 셋! 넷! 다섯! 여섯! 일곱! 여덟! 아홉! 열! 열하나! 열둘! 열셋! 열넷! 열다섯! 열여섯! 열일곱! 열여덟! 열아홉! 스물! | One! … Twenty! | extra, 글자 없음 |
| L17 | 5 | 왕비 | 열! 아직 더 있어요. 한 번 더 톡! | Ten! And there are still more. Tap once more! | 톡 안내(세기 2) |
| L18 | 5 | 왕비 | 스물! 매트리스가 스무 장이에요. | Twenty! That makes twenty mattresses. |  |
| L19 | 5 | 해설 | 이불도 스무 장, 푹신푹신! | And twenty feather quilts on top, soft and fluffy! | 이불 위 |
| L20 | 6 | 해설 | 완두콩은 어디 있을까요? 탑의 위? 아래? | Where is the pea? At the top of the tower, or at the bottom? | 고르기 안내 3 |
| W20 | 6 | 해설 | 거긴 탑의 위예요. 완두콩은 맨 아래에 있어요. 아래를 눌러 봐요. | That's the top of the tower. The pea is at the very bottom. Tap the bottom. | 오답(위) |
| C20 | 6 | 해설 | 맞아요! 완두콩은 맨 아래에 있어요. | That's right! The pea is at the very bottom. | 정답 |
| L21 | 6 | 해설 | 공주님은 어디서 잘까요? 위? 아래? | Where will the princess sleep? At the top, or at the bottom? | 고르기 안내 4 |
| W21 | 6 | 해설 | 거긴 탑의 아래예요. 공주님은 맨 위에서 자요. 위를 눌러 봐요. | That's the bottom of the tower. The princess sleeps at the very top. Tap the top. | 오답(아래) |
| C21 | 6 | 해설 | 맞아요! 공주님은 맨 위에서 자요. | That's right! The princess sleeps at the very top. | 정답 |
| L22 | 6 | 왕비 | 완두콩은 맨 아래, 공주님은 맨 위에서 자요. | The pea at the very bottom, and the princess at the very top. | 사다리 오르기 전 |
| L23 | 6 | 공주 | 와, 높다! 잘 자요. | Wow, it's so high! Good night. | 꼭대기 |
| L24 | 7 | 해설 | 밤이 깊었는데… 공주는 이리 뒤척, 저리 뒤척. | Late into the night... the princess tossed this way, and turned that way. | 뒤척임 위 |
| L25 | 7 | 공주 | 뭔가 딱딱한 게 있는 것 같아… | I think there's something hard in here... | 완두콩 비춤 |
| L26 | 8 | 해설 | 아침이 되었어요. 공주가 사다리를 내려왔어요. | Morning came. The princess climbed down the ladder. |  |
| L27 | 8 | 왕비 | 잘 잤니? | Did you sleep well? |  |
| L28 | 8 | 공주 | 아니요, 솔직히 한숨도 못 잤어요. 뭔가 딱딱한 게 있어서 몸이 뻐근하고 졸려요. | No. To be honest, I didn't sleep a wink. Something hard was in the bed, and now I'm stiff and sleepy. | 솔직히 말함 |
| L29 | 8 | 왕비 | 매트리스 스무 장 아래 완두콩을 느끼다니! 진짜 공주로구나! | She felt the pea through twenty mattresses! She is a true princess! | 안아 줌(대사 없음, 동작만) |
| L30 | 9 | 해설 | 왕자와 공주는 손을 꼭 잡았어요. | The prince and the princess held hands tight. |  |
| L31 | 9 | 왕자 | 진짜 공주님을 드디어 찾았어요! | At last, I have found a true princess! |  |
| L32 | 9 | 해설 | 완두콩은 박물관에 갔대요. | And the pea was sent to a museum. |  |
| L33 | 9 | 해설 | 유리 상자를 톡 눌러 봐요. | Tap the glass case. | 톡 안내(인사) |
| L34 | 9 | 해설 | 안녕! | Bye-bye! | 마지막 |

`run()` 반환 문구(끝 화면)는 `'느낀 것을 솔직하게 말하는 마음이 진짜 공주의 마음이에요.'`(부제와 같다, `ui` 에 영어 있음). 교훈은 **대사로 읽지 않는다**. 영어 모드의 장면 이름·팝 글자·안내 문장은 모두 `TEXT_EN`(`voice_script_en.json` 의 `ui`) 에 있다 — 한글이 남으면 안 된다.

## 7. 효과음 (sounds/sfx/<이름>.mp3, `AudioFX.sfx(name, vol)`)

| 장면 | 순간 | 이름 | 팝 글자(자리는 §3) |
|---|---|---|---|
| 1 | 배 출발·귀환 | `swish` (.35) | '출렁출렁' ×2(창 속 하늘) |
| 1 | 왕자 한숨 | (없음) | '휴우'(왕자 머리 왼쪽 위) |
| 2 | 번개 | `boom` (.35) + `T.shake()` | '번쩍'(번개 위), '우르릉'(구름 위) |
| 2 | 노크 | `knock` (.6) ×2 | '똑똑' ×2(문 위) |
| 3 | 물방울 | (없음) | '뚝뚝'(공주 발 왼쪽) |
| 3 | 문 열림 | `creak` (.5) | '끼익'(문 위) |
| 3 | 왕비 찡긋 | (없음) | '찡긋'(왕비 머리 오른쪽 위) |
| 4·6·9 | 정답 | `sparkle` (없으면 tone 700→1400) + 엔진 `ding` | '반짝!'(보기 위·탑 아래·탑 위·상자 위) |
| 4 | 완두콩 놓기 | `poke` (.4) | '톡'(판자 위) |
| 5 | 매트리스 한 장 | `paper_down` (.35) ×20 | (숫자 글자 **없음**, 왕비 목소리만) |
| 5 | 이불 | `swish` (.3) ×4 | '푹신푹신'(탑 가운데) |
| 6 | 사다리 | `step_wood` (.3) 500ms 마다 | |
| 6 | 눕기 | `paper_down` (.3) | |
| 7 | 뒤척임 | (없음) | '뒤척뒤척' ×2(공주 위쪽 밖) |
| 7 | 완두콩 비춤 | `poke` (.3) ×2 | |
| 8 | 하품 | (없음) | '하암'(공주 머리 위) |
| 8 | 포옹 | `paper_up` (.4) | '꼬옥'(왕비 머리 왼쪽 위) |
| 9 | 끝 | `tada` + `T.confetti()` | '안녕!'(두 사람 머리 사이 위) |
| 전환 | 책장 넘기기 | 엔진 기본 | |
| 톡·고르기 | 누름/정답/오답 | 엔진 `AudioFX.tap/ding/miss` | |

### 7-1. 효과음이 없을 때
`knock`·`creak`·`boom`·`poke`·`step_wood`·`swish`·`paper_down`·`paper_up`·`sparkle`·`tada` 는 모두 `sounds/sfx/` 에 이미 있다. 그래도 `sfx(T, name, vol, fb)` 의 `fb` 로 `T.tone` 대체음을 둔다(`knock` → `T.tone([900, 400], .1, { vol: .2 })`, `boom` → `T.tone([120, 60], .4, { type: 'square', vol: .12 })`, `poke` → `T.tone([600, 900], .06, { vol: .15 })`).

## 8. 카탈로그 항목 (`tales/catalog.js`, `red_car` 항목 뒤)
```js
  { id: 'princess_pea', title: '완두콩 공주', origin: 'world', also: ['princess'], skills: ['count', 'size', 'position'], ready: false, making: true,
    line: '제일 작은 것과 제일 큰 것을 고르고, 매트리스 스무 장을 세고, 위와 아래를 찾아요. 비에 젖은 아가씨가 완두콩 한 알로 진짜 공주임을 보여요.',
    en: { title: 'The Princess and the Pea', line: 'Pick the smallest and the biggest, count twenty mattresses and find top and bottom. A rain-soaked girl shows she is a true princess with a single pea.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="92" width="160" height="18" fill="${c.bk}"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="86" y="${86 - i * 9}" width="66" height="8" rx="2" fill="${[c.gd, c.cr, c.ps][i % 3]}"/>`).join('')}
      <path d="M84 12 h70 q3 0 3 3 v3 q-18 -6 -35 0 q-17 -6 -38 0 v-3 q0 -3 3 -3z" fill="${c.sn}"/>
      <circle cx="92" cy="90" r="3" fill="${c.pn}"/>
      <path d="M26 92 L32 58 Q42 52 52 58 L58 92Z" fill="${c.cr}"/><rect x="30" y="68" width="24" height="4" fill="${c.pn}"/>
      <circle cx="42" cy="44" r="13" fill="#8a6a48"/><circle cx="42" cy="47" r="10" fill="${c.sk}"/><circle cx="42" cy="31" r="4" fill="#8a6a48"/>${eye(38, 47, 1.5)}${eye(46, 47, 1.5)}
      <path d="M39 52 q3 2 6 0" stroke="${c.rd}" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>` },
```
태그: PLAN 대로 `count`·`size`·`position`(최대 3개 규칙 때문에 heart 는 달지 않는다). `position` 은 `hideUnused` 태그이지만 미녀와 야수가 이미 쓰고 있다. 홈 카드 그림은 코드 SVG(크림 바탕, 오른쪽 줄무늬 탑 + 흰 이불 + 초록 완두콩, 왼쪽에 큰 공주).

## 9. 썸네일·키아트 (인물 그림이 다 나온 뒤)

| 결과 파일 | 원본 | 만드는 법 |
|---|---|---|
| `assets/thumbs/princess_pea_key_wide.webp` (1672×941) | `assets/raw/keyart_gpt/princess_pea_wide_v1.png` | PIL: RGB → 16:9 가운데 자르기 → 1672×941 → webp quality 86 (`back_to_webp.py` 와 같은 식) |
| `…_key_tall.webp` (1086×1448) | `…_tall_v1.png` | 3:4 가운데 자르기 → 1086×1448 |
| `…_tile.webp` (720×540) | `…_tile_v1.png` | 4:3 가운데 자르기 → 720×540. `assets/thumbs/tiles.js` 의 `TILES` 에 `'princess_pea'` 추가 |
| `…_back_wide.webp` (1200×800) · `…_back_tall.webp` (1000×1150) | `…_backw_v1.png` · `…_backt_v1.png` | `~/.venvs/paper-tale/bin/python tools/app/gen/back_to_webp.py princess_pea` |
| `assets/thumbs/thumbs.js` | — | `THUMBSKEY` 에 `"princess_pea"`, `THUMBSKEYLIGHT["princess_pea"] = "#f5efe9"`, `BACKACCENT["princess_pea"] = "#3F6B4F"`(끝 화면 리본: Pine Green, 완두콩 색). `make_thumbs.py` 의 표(75행)에도 BACKACCENT 를 넣는다. |

키아트 창 모양은 **둥근 완두콩(원)** 이고, 테두리 장식은 짧은 매트리스 띠 둘(금·감)과 작은 완두콩 하나뿐(§7-5: 소품 금지, 같은 계열 장식 최소). 창 안은 손님방의 줄무늬 탑과 큰 공주, 뒤에서 내다보는 왕비. 참고 그림은 작업표의 `refs`(princess_stand·queen_smile·mattress_gold·prop_pea / 끝 화면은 prince_hold·princess_hold·prop_case·prop_pea)라 **인물 그림이 모두 나온 뒤** 맨 마지막에 생성한다. 썸네일(타일)은 PLAN 대로 공주를 크게, 겹 3개(벽·탑·공주).

## 10. 그림 목록 (작업표 `jobs_princess_pea.json` 45장과 같다)

사람 넷은 **머리 크기가 같다**(공주 서기가 기준). 자세 그림은 기준 그림을 `refs` 로 넣고 프롬프트에 "SAME SCALE AS THE REFERENCE SPRITE(머리·몸 크기를 기준 그림과 똑같이)"가 들어 있다(§4-1). 왕자·왕비·왕의 기준 그림도 공주 서기를 `refs` 로 받아 머리 크기를 맞춘다. 사람 얼굴은 점 눈·점 코·종이 띠 입·볼, 소품은 **얼굴 없음**(`This is an OBJECT … NO face`). 손에는 다른 인물이 없고, 손잡기 그림은 각자 빈손을 뻗은 모습이다(코드가 두 손끝을 붙인다).

| 구분 | id (`assets/v3w/pp_<id>.webp`) | 설명·방향 | 작업표 크기 | pass | 장면 |
|---|---|---|---|---|---|
| 인물·공주 | princess_stand (기준) | 묶은 연갈색 머리, 연두 드레스(크림+초록 띠), 씩씩한 앞모습, 빈손 | 600² | 1 | 6·(키) |
| | princess_wet / climb(←, 빈손 사다리 잡기) / lie_a(누움, 머리 왼쪽, 눈 감음) / lie_b(누움, 돌아누워 등) / sleepy(하품) / honest(손 가슴) / hold(→, 빈손 뻗음) / wave | | 600² / 600² / 780×420 / 780×420 / 600² / 600² / 600² / 600² | 2 | 3 / 6 / 6·7 / 7 / 8 / 8 / 9 / 9 |
| 인물·왕자 | prince_sigh (왕자 기준, 두루마리 든 한숨) | 남색 옷, 작은 금관, 처진 눈썹. refs 공주 서기(머리 크기) | 600² | 2 | 1 |
| | prince_stand / surprise / joy / hold(→) | refs prince_sigh | 600² | 3 | 8 / 8 / 8 / 9 |
| 인물·왕비 | queen_smile (왕비 기준, 웃음) | 틀어 올린 흰 머리, 팥색 옷, 둥근 안경. refs 공주 서기 | 600² | 2 | 1·3·6·8 |
| | queen_wink / place(→, 허리 굽혀 빈 손끝) / lift(두 팔 위, 빈손) / hug(두 팔 벌림) | refs queen_smile | 600² | 3 | 3·4 / 4 / 5 / 8 |
| 인물·왕 | king_lantern | 흰 수염, 갈색 가운, 등불(얼굴 없음) 든 앞모습. refs 공주 서기 | 600² | 2 | 3 |
| 소품 | prop_pea | 초록 원 2조각, 얼굴 없음 | 480² | 1 | 4~9 |
| | prop_mattress_gold(기준) / cream / persimmon | 옆에서 본 아주 길고 얇은 직사각(10:1), 1조각 1색 | 1600×902 | 1 / 2 / 2 | 4~8 |
| | prop_duvet / prop_pillow / prop_bed_board / prop_ladder | 흰 물결 이불(12:1) / 크림 베개+초록 띠 / 갈색 판·다리·머리판(8:1) / 세로 2+가로 7(1:5) | 1600×902 / 480² / 1600×902 / 480×600 | 1 | 5~8 / 4 / 4~8 / 6~8 |
| | prop_boat(→) / prop_far_lands / prop_cloud / prop_lightning | 돛 하나 배 / 먼 성 2+공주 실루엣 3(얼굴 없음, 9:1) / 남색 구름 / 앰버 지그재그 | 480² / 1600×902 / 840×480 / 480×600 | 1 | 1 / 1 / 2·3 / 2 |
| | prop_door_closed(기준) / prop_door_open | 닫힌 아치 문 / 양쪽으로 젖혀진 문짝 둘(가운데 비움) | 480×600 | 1 / 2 | 2·3 / 3 |
| | prop_case | 받침대 + 빈 유리 상자(완두콩은 코드) | 480×600 | 1 | 9 |
| 배경 | bg_room_day(오른쪽 큰 창: 하늘·바다) / bg_gate_night(앰버 문 자리, 비·구름 없음) / bg_guest_day(왼쪽 창·탁자, 가운데 비움) / bg_guest_night(같은 방, 달) / bg_yard_day(성벽·잔디) | 평평한 종이 한 장 + 요소 2~3개 | 1600×902 | 1 | 1 / 2·3 / 4·5·6·8 / 7 / 9 |
| 키 | key_wide · key_tall · key_tile · key_backw · key_backt | 시작 화면(완두콩 모양 창)·홈 카드·끝 화면(손잡은 둘 + 유리 상자) | 16:9 · 3:4 · 4:3 · 3:2 · 4:5 | — | — |

생성 순서: `pass 1`(18: princess_stand, 소품 12, 배경 5) → `pass 2`(14: 공주 자세 8, prince_sigh, queen_smile, king_lantern, mattress_cream·persimmon, door_open) → `pass 3`(8: 왕자 4, 왕비 4) → 키아트 5. 작업표가 이 순서로 정렬되어 있으므로 `run_simple.py princess_pea $(python3 -c "import json;print(' '.join(j['id'] for j in json.load(open('tools/app/gen/jobs_princess_pea.json'))))")` 처럼 앞에서부터 돌리면 된다.

받은 그림 점검(틀린 id 만 지우고 다시 만든다): 네 귀퉁이가 마젠타인지(`restyle_check.py` 방식) · 사람 넷의 **얼굴 폭이 공주 서기와 ±12% 안**인지(왕·왕비는 키만 작아야 한다) · 소품(완두콩·매트리스·이불·베개·판자·사다리·배·먼 나라·구름·번개·문·상자)에 **얼굴이 없는지** · 매트리스 셋이 같은 모양·같은 비율(8:1 이상 가늘게)인지 · `princess_climb` 이 왼쪽을 보고 사다리가 **없는지**, `hold` 둘이 오른쪽을 보고 손이 비었는지 · `queen_place`·`queen_lift` 손에 아무것도 없는지 · `door_open` 가운데가 비어 있는지(마젠타) · `far_lands` 실루엣에 얼굴·이목구비가 없는지 · `king_lantern` 의 등불에 얼굴이 없는지 · 공주 `wet` 이 울지 않는지(씩씩한 웃음) · 배경에 사람·동물·비·문짝이 없는지.

## 11. 테스트 체크리스트 (코드가 끝난 뒤, 커밋 전)

준비
- [ ] 저장소 뿌리에서 `python3 -m http.server 8795`(다른 에이전트와 겹치지 않게 8795).
- [ ] 헤드리스 크롬: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9345 --user-data-dir=/tmp/pp_chrome --window-size=1366,1024 about:blank &`.
- [ ] 자동 재생: `CDP=9345 node assets/raw/_work/autoplay_audio.mjs http://127.0.0.1:8795/tales/princess_pea/index.html 1366 1024 /tmp/pp_l 600 8` (스크린샷 + `_audio.json`). 그림이 없는 동안은 자리표시로 끝까지 돌아야 한다(목업 통과 기준).

가로 1366×1024
- [ ] 끝까지 자동 재생되고 `errors` 에 예외가 없다(그림 404 는 자리표시 모드에서 정상).
- [ ] 첫 조작(1장 배 톡)의 안내 L2 가 **시작 버튼 뒤 15초 안**에 끝난다(`_audio.json` 의 L2 시각 ≤ 14s).
- [ ] 전체 길이 7~8.5분(`_audio.json` 마지막 클립 시각 + 끝 화면). 7분이 안 되면 §2-7 대로 늘린다.
- [ ] **크기**: 공주 9자세·왕자 5자세·왕비 5자세의 얼굴 폭이 같고, 왕·왕비 머리가 공주와 같은지(4·8장 스크린샷을 나란히). 매트리스 20장이 모두 240×20 이고 탑 높이가 400(475→75)인지. 완두콩이 판자 12 · 비교 22 · 상자 30 인지. 틀리면 `HT`(§2-2).
- [ ] **탑과 rig**: 5장 이불 꼭대기(y 19)가 화면 안에 보이고, 6장 사다리 오르기 동안 rig 가 +130 내려가 공주가 꼭대기에 누운 모습이 다 보이는지(머리 위 여유 ≥ 15px). 7장 시작이 꼭대기(rig +130), L25 때 아래로 내려가 완두콩이 빛나고 다시 올라오는지. 8장은 rig 0.
- [ ] **방향**: 1장 배가 갈 때 오른쪽, 올 때 왼쪽을 본다. 3장 공주가 문 쪽에 선다. 4장 왕비가 침대(오른쪽)를 향해 굽히고 손끝에서 완두콩이 판자로 간다. 6장 공주가 사다리에서 탑 쪽(왼쪽)을 보고 오른다. 9장 왕자(→)·공주(←)의 손이 닿는다.
- [ ] **크기 비교**: 두 문제 모두 오답 때 흔들림 + W 대사, 두 번째 오답부터 정답이 빛난다. 정답 뒤 반짝 + C 대사. L15 안에서 완두콩이 손끝 → 판자로 옮겨지고 '톡' 팝이 뜬다.
- [ ] **수 세기**: 톡 2번에 매트리스가 10장 + 10장 날아와 쌓이고, `_audio.json` 에 `n1`~`n20` 클립이 **차례로 한 번씩**(왕비 목소리) 있다. 화면에 숫자 글자가 **없다**. 더미가 16번째부터 줄어 20번째에 빈다. 이불 4장이 자동으로 얹히고 '푹신푹신' 팝.
- [ ] **위·아래**: 띠 둘이 질문 때만 보이고(opacity .22), 아래 → 완두콩 반짝, 위 → 띠 반짝. 오답 때 W 대사. 정답 뒤 띠가 사라진다.
- [ ] **톡**: 배·문·유리 상자에 손가락 힌트가 뜨고(배·상자는 hitBox 가운데), 톡 뒤 각각 항해·문 열림·반짝 + 손 흔들기. 끝 화면에 '느낀 것을 솔직하게 말하는 마음이 진짜 공주의 마음이에요.' 와 리본(`?endpreview=1`).
- [ ] **팝 자리**: 모든 팝 글자가 인물의 머리·몸 상자를 가리지 않는다(스크린샷에서 확인: 휴우·찡긋·꼬옥·하암·안녕!).
- [ ] 누르는 자리: `.tap-target.armed` 의 `getBoundingClientRect()` 짧은 변이 **화면 60px 이상**(배·비교 완두콩은 hitBox, 문·침대 구역·띠·상자).

세로 390×844 (`node … 390 844 /tmp/pp_p 600 8`)
- [ ] 모든 조작 대상이 그 순간 화면 안에 있다(1장 배 600~900 의 출발 자리, 3장 문 700, 4장 세로 한 줄 셋(x 500), 5장 침대 구역(520), 6장 띠 둘(395~645), 9장 상자 660). 화면 밖이면 §3 의 P 좌표·`camSnap`·`follow` 를 고친다.
- [ ] 탑(폭 240)이 세로 화면(폭 260)에 통째로 들어간다. 6장 오르기 동안 `follow(TX + 40)` 로 사다리와 공주가 보인다.
- [ ] 말하는 배역에게 카메라가 붙고(`director`), 내레이션에서 원래 화면으로 돌아온다. 카메라가 배경 밖을 보이지 않는다.

소리
- [ ] `_audio.json` 에서 **같은 클립이 연달아 두 번** 기록되지 않는다(이중 재생).
- [ ] NAR 줄 수 = 그 경로에서 지나간 대사 수(기본 경로 34줄 + extra 20 + 오답 수). 빠진 줄은 `say()` 문장을 §6 과 글자 단위로 맞춘다(대본을 고치지 말고 코드를 고친다).
- [ ] 영어: `localStorage.lang = 'en'` 으로 한 번 더 돌려 `narration_el_en.js` 클립과 `TEXT_EN` 장면 이름·팝 글자·안내 문장이 나오고 **한글이 하나도 남지 않는다**. 영어 숫자 클립 `One!`~`Twenty!` 도 왕비 목소리.
- [ ] 녹음 받아쓰기 점검: 녹음 전 `touch /tmp/pp_marker`, 녹음 뒤 `~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py princess_pea /tmp/pp_marker ko` 와 `… en`. `<<<`(되풀이) 클립은 **그 mp3 만 지우고** `gen_tale.py` 를 다시 돌린다(`--redo` 금지). 영어 v4 는 반드시 본다.
- [ ] 숫자 클립 스무 개가 한 단어씩 또렷하고 길이가 1.2초 안인지(길면 그 클립만 지우고 다시). 공주(Yoojin) 한국어 발음이 어색한 줄(L9·L28)은 `settings.pea.stability` 를 .55 로 올려 그 줄만 다시.
- [ ] 1장 L3 가 항해 편도(4.2초) 안에 끝난다(길면 `SAIL` 을 늘린다). 7장 L25 와 rig 내려가기·완두콩 비춤이 같이 끝난다.

마무리
- [ ] 홈(`index.html`)에서 '완두콩 공주' 카드가 만드는 중으로 보이고 `line` 이 §8 문구, 배우는 것 칩에 '위치말'이 보인다.
- [ ] `git status` 에 다른 동화 파일 변경이 없다. `tales/kkultteok/` 은 손대지 않았다. 커밋은 사용자가 요청할 때.

## 12. 남은 판단 (사용자)
1. **4장 세로 화면의 비교 보기 배치**: 세로에서는 완두콩·베개·매트리스를 x 500 세로 한 줄(벽에 붙인 진열처럼 y 350·420·505)로 둔다(가로는 바닥 한 줄). 바닥에 한 줄로 두면 260 폭에 들어가지 않아서다. 다른 배치를 원하면 §3 장면 4 의 세로 좌표만 바꾸면 된다.
(그 밖의 판단은 모두 이 문서에서 확정했다.)
