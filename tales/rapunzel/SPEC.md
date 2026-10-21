# 라푼젤 — 제작 상세 사양 (SPEC, 2026-10-21)

기획 확정본은 `PLAN.md`(10장, 그림 형제 1857년 판, 맨 아래 "확정 사항" 두 묶음이 최신 사용자 결정). 이 문서는 그 기획을 **더 이상 판단 없이 코드로 옮길 수 있게** 장면마다 그림·좌표·크기·방향·조작·대사·효과음·타이밍을 적은 것이다. 참조 구현은 `tales/beauty_beast/beauty_beast.js`(**목업 자리표시**·`mk()`·`put()`·`sprite()`·`bgImage()`·HT 표·`T.choose` 위·아래·옆 놀이 434~481행)와 `tales/red_car/red_car.js`(`hitBox`·`veil`·`follow`·preload 로 ASP 덮어쓰기), 그리고 `tales/red_car/SPEC.md`(이 문서의 형식). 모르는 것이 있으면 그 파일들에서 같은 이름의 코드를 찾아 그대로 따른다.

PLAN 확정 사항을 이 문서에 반영한 것:
- 고텔은 원작대로 **진짜 마녀**. 마법은 "지팡이 톡 → 종이 별 셋 반짝 → 결과" 로만(탑 세우기·잠그기·들판 이동·마법 바람). 엄하고 투덜거리지만 소리 지르지 않고, 짙은 초록 망토, 뾰족 모자 없음.
- 머리 자르기(8장) 남김: `싹둑!` 한 번, 단발이 된 라푼젤은 놀란 눈만. 피·아픔·울음 없음. 왕자의 실명·가시·방황 몇 해·쌍둥이·입맞춤 없음. 마법 바람이 왕자를 풀숲에 사뿐 내려놓는다.
- 배움 놀이 **둘**: 3장 위·아래 위치말(새·토끼 2문제, `position`), 5장 길고 짧은 리본(제일 긴 것·제일 짧은 것 2문제, `size`). 리본 매듭 세기 없음, 수세기 없음(목소리 수세기도 없음).
- 톡 3번: 2장 라푼젤 풀 뽑기(첫 조작, 시작 뒤 약 25초), 4장 창문 톡(머리 내리기), 10장 손잡기(인사). 연타 없음, 줄거리 선택 없음.
- 청혼은 "저와 함께 성으로 가요", 마지막은 손잡기. 고텔의 마무리는 마지막 자막 한 줄 "마녀 고텔은 텃밭으로 돌아갔어요"(해설이 읽고 글자로도 보인다). 말실수는 "왜 왕자님보다 훨씬 무거워요?" + "뭐라고? 왕자라니!".
- **교훈은 대사로 말하지 않는다.** 부제와 끝 화면 글자(`run()` 반환값)로만 보인다: '포기하지 않으면 다시 만날 수 있어요'.
- 녹음은 ElevenLabs(한국어·영어) 처음부터. Typecast 없음.
- PLAN 그림 목록에서 뺀 것: 빗(장식일 뿐), 가위 소품(고텔 `scissors` 자세 안에 들어 있음), 요람 소품과 아기를 한 장(`rp_prop_cradle_baby`)으로 합침, 바람 곡선·별을 각각 한 장(`rp_prop_wind`·`rp_prop_star`, 코드에서 별 3개 복제), 음표도 한 장(`rp_prop_note`, 코드 복제). 배경의 "숲속 탑"은 **탑을 소품(`rp_prop_tower`)으로 떼어** 숲 배경 2장(낮·해질녘)에 얹는다(3장에서 탑이 솟아야 하고, 4·6·7·9장에서 같은 탑이 보여야 하므로).
- PLAN 의 "고텔 머리 타고 오르기(작게)"의 **(작게)는 축소가 아니다**: 탑이 키의 2.2배라 매달린 사람이 작아 보일 뿐, 그림 높이는 서기와 같은 머리 폭으로 맞춘다(§2-2). 이 동화에서 원근 축소 `s` 는 한 번도 쓰지 않는다.

## 0. 만들 파일과 순서

| 순서 | 파일 | 만드는 방법 |
|---|---|---|
| 1 | `tools/app/gen/jobs_rapunzel.json` | **이미 있음**(56장: 스프라이트 45 + 배경 6 + 키아트 5, 접두어 `rp_`). 그림 생성: `python3 tools/app/gen/run_simple.py rapunzel <id ...>` 를 `pass` 1 → 2 → 3 순으로(참고 그림이 먼저 있어야 함), 키아트(`key5_*`)는 맨 뒤. 한도에 걸리면 run_simple.py 가 풀리는 시각까지 기다렸다 이어 간다. 받은 그림 점검은 §10. |
| 2 | 후처리 | `~/.venvs/paper-tale/bin/python tools/app/gen/post_tale.py rapunzel` → `assets/v3w/rp_<id>.webp`(스프라이트는 마젠타 크로마키 → 여백 없이 오림, 배경 1600×902). 끝에 ASP(폭/높이)가 `tales/rapunzel/ASP.txt` 에 나온다 → 코드 `ASP` 표에 붙인다. **그림이 아직 없어도 코드는 자리표시(§1-1)로 돈다.** |
| 3 | `tales/rapunzel/index.html` | `tales/beauty_beast/index.html` 그대로 복사(합창 로더 없음), `<title>라푼젤</title>`, 마지막 스크립트 `rapunzel.js`. |
| 4 | `tales/rapunzel/narration.js` | `/* rapunzel — Typecast 없음. ElevenLabs(narration_el.js)가 채운다 */\nconst NARRATION_CLIPS = {};\nconst VOICE_LINES = {};` |
| 5 | `tales/rapunzel/narration_en.js` | `const NARRATION_CLIPS_EN = {}; const VOICE_LINES_EN = {}; const TEXT_EN = {…};` — `TEXT_EN` 은 `voice_script_en.json` 의 `"ui"` 를 그대로 JSON 으로 붙인다(미녀와 야수 `narration_en.js` 와 같은 모양). 영어 모드 화면에 한글이 하나도 남지 않아야 한다(장면 이름·팝·고르기 안내·끝 화면 글자 모두 `tr()`). |
| 6 | `tales/rapunzel/rapunzel.js` | 이 문서 §1~§6 대로 새로 쓴다. 그림이 없는 동안은 **자리표시 목업**으로 끝까지 돌아야 한다. |
| 7 | `tales/catalog.js` | §8 의 항목을 `red_car` 항목 뒤에 추가(`making: true`). `position` 태그는 카탈로그에 이미 있다(`hideUnused`). |
| 8 | 녹음 | `python3 tools/elevenlabs/gen_tale.py rapunzel --model eleven_v4 --dry`(2026-10-21 확인: 한국어 4,018자, 영어 `--lang en` 5,840자, 건너뛸 줄 0) → `--dry` 빼고 생성 → `audio/el/rapunzel/*.mp3` + `narration_el.js`, 영어 `audio/el/rapunzel/en/` + `narration_el_en.js`. 녹음 뒤 `check_new.py` 되풀이 점검(§11). 합창 없음. |
| 9 | 썸네일·키아트 | §9 (인물·탑·머리 그림이 다 나온 뒤). |
| 10 | 자동 재생 점검 | §11 체크리스트. |

커밋·푸시는 사용자가 요청할 때만 한다. 다른 동화 파일은 건드리지 않는다. `tales/kkultteok/` 의 그림·참고 사진은 어떤 경로로도 쓰지 않는다.

## 1. 코드 구조 (`rapunzel.js`, beauty_beast.js 를 거울처럼)

```js
/* 라푼젤 — 그림 형제 「라푼젤」(1857) 원작 그대로. 기획: tales/rapunzel/PLAN.md, 상세: SPEC.md (2026-10-21)
   톡 3번(2장 라푼젤 풀 · 4장 창문 · 10장 손잡기), 배움 놀이 2개(3장 위·아래 · 5장 긴 것·짧은 것), 연타 없음, 줄거리 선택 없음, 수세기 없음. 교훈 대사 없음.
   사람은 모두 머리 크기가 같다(2.5등신, HT 는 머리 폭으로 맞춤). 어른은 키만 조금 크다(212~215). 원근 축소 s 없음.
   탑은 소품(rp_prop_tower, 높이 445)이고 숲 배경(낮·해질녘)에 얹는다. 창문 고리·땋은 머리·오르는 사람은 모두 탑 좌표(§2-8)에서 계산한다.
   마법은 "지팡이 톡 → 별 셋 반짝 → 결과". 소품은 얼굴 없음. 피·아픔 없음.
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/rp_*.webp (목록 tools/app/gen/jobs_rapunzel.json) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { /* post_tale.py 출력(tales/rapunzel/ASP.txt). 그림이 오기 전엔 §2-1 의 시작값 */ };
  const HT  = { /* §2-2 */ };
  const NAT = { /* §2-3 */ };
  const FL = 505;                       // 바닥(발끝 y)
  const TOWER_H = 445, WIN_DY = -300, HOOK_DX = 40, BRAID_H = 300;   // §2-8 탑 좌표계
  const BGS = ['rp_bg_cottage', 'rp_bg_garden_night', 'rp_bg_forest_day', 'rp_bg_room', 'rp_bg_forest_dusk', 'rp_bg_field'];
  const src = k => AS + k + '.webp';    // 배경·스프라이트 모두 파일 이름 전체(rp_…)로 부른다
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const artOK = {}, bgOK = {};
  function placeholder(T, parent, f, w, h) { … }   // §1-1
  function sprite(T, parent, f, x, y, w, h) { … }  // beauty_beast.js 117~122행 그대로(artSrc → src)
  const BGPH = { … };                   // §1-1 배경 자리표시 표
  function bgImage(T, key) { … }        // beauty_beast.js 124~133행 그대로(bgSrc → src)
  function mk(T, poses) { … }           // beauty_beast.js 136~158행 그대로 (poses = { 이름: [그림, 높이] })
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  function put(T, a, x, y, { look, to } = {}) { … }   // beauty_beast.js 그대로. s 는 쓰지 않는다
  const hide, fadeIn, fadeOut, glow, wiggleEl, bob, tint, sfx, sparkleSfx   // beauty_beast.js 그대로
  function hitBox(T, a, w, h) { … }     // §5-1
  function magic(T, x, y) { … }         // §5-2 별 셋 반짝(지팡이 마법·고텔 등장)
  async function towerRise(T, tower) { … }        // §5-3 탑이 쑥 솟음
  async function braidDown(T, braid, tx) { … }    // §5-4 머리가 스르르 내려옴 / braidUp
  async function climb(T, who, tx, pops) { … }    // §5-5 머리를 타고 오르기
  async function hum(T, x, y) { … }     // §5-6 허밍 + 음표
  function arrowHint(T, x, dir) { … }   // §5-7 위·아래 화살표 힌트
  async function compare(T, a, b, left) { … }     // §5-8 리본 두 개 나란히 비교
  async function veil(T, change) { … }  // §5-9 같은 장면 안 배경 바꾸기(크림 종이 가림)
  function petals(T, x0, x1) { … }      // §5-10 꽃잎
  async function run(T) { … }           // §3 장면 1~10
  Tale.mount({ title: '라푼젤', subtitle: '포기하지 않으면 다시 만날 수 있어요', run: T => run(Tale.api) });
})();
```

`run(T)` 머리 부분:

```js
const { sleep, camSnap, tr } = T;
const GAP = 800, SCENE_END = 1600, CLIMB = 4500, BRAID = 2200, RISE = 1800, WALK = 3000;   // §2-7 속도 상수
const say = async text => { await T.say(text); await sleep(GAP); };
const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(허밍)
const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
const X = (l, p) => (P ? p : l);
const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
const TX = X(640, 560);                        // 탑의 x (3·4·6·7·9장 공통)
AudioFX.preloadSfx(['paper_down', 'paper_up', 'swish', 'whoosh', 'sparkle', 'tada', 'step_grass', 'pop', 'slide_up', 'slide_down', 'chop', 'knock', 'cork', 'creak']);
/* 그림 파일 미리 받기: 있으면 쓰고(artOK/bgOK), 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 (red_car.js 와 같다) */
const loads = [];
BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
await Promise.race([Promise.all(loads), sleep(4000)]);
// 리본 높이는 길이에서 계산(§2-2): 그림이 와서 ASP 가 바뀌어도 길이 180/120/60 이 유지된다
HT.rp_prop_ribbon_long = 180 / ASP.rp_prop_ribbon_long; HT.rp_prop_ribbon_mid = 120 / ASP.rp_prop_ribbon_mid; HT.rp_prop_ribbon_short = 60 / ASP.rp_prop_ribbon_short;
// 배우 (자세 이름: [그림, 높이])
const rap    = mk(T, { stand: ['rp_rap_stand', HT.rp_rap_stand], window: ['rp_rap_window', HT.rp_rap_window], wrap: ['rp_rap_wrap', HT.rp_rap_wrap], sing: ['rp_rap_sing', HT.rp_rap_sing],
                       surprise: ['rp_rap_surprise', HT.rp_rap_surprise], joy: ['rp_rap_joy', HT.rp_rap_joy],
                       short_shock: ['rp_rap_short_shock', HT.rp_rap_short_shock], short_sing: ['rp_rap_short_sing', HT.rp_rap_short_sing], short_hold: ['rp_rap_short_hold', HT.rp_rap_short_hold] });
const gothel = mk(T, { stand: ['rp_gothel_stand', HT.rp_gothel_stand], point: ['rp_gothel_point', HT.rp_gothel_point], wand: ['rp_gothel_wand', HT.rp_gothel_wand],
                       scissors: ['rp_gothel_scissors', HT.rp_gothel_scissors], cradle: ['rp_gothel_cradle', HT.rp_gothel_cradle], climb: ['rp_gothel_climb', HT.rp_gothel_climb] });
const father = mk(T, { stand: ['rp_father_stand', HT.rp_father_stand], climb: ['rp_father_climb', HT.rp_father_climb], pull: ['rp_father_pull', HT.rp_father_pull], shock: ['rp_father_shock', HT.rp_father_shock] });
const mother = mk(T, { window: ['rp_mother_window', HT.rp_mother_window] });
const prince = mk(T, { stand: ['rp_prince_stand', HT.rp_prince_stand], ride: ['rp_prince_ride', HT.rp_prince_ride], hide: ['rp_prince_hide', HT.rp_prince_hide], climb: ['rp_prince_climb', HT.rp_prince_climb],
                       sad: ['rp_prince_sad', HT.rp_prince_sad], float: ['rp_prince_float', HT.rp_prince_float], hold: ['rp_prince_hold', HT.rp_prince_hold] });
const horse = prop(T, 'rp_horse_stand', HT.rp_horse_stand), bird = prop(T, 'rp_bird', HT.rp_bird), rabbit = prop(T, 'rp_rabbit', HT.rp_rabbit);
const tower = prop(T, 'rp_prop_tower', HT.rp_prop_tower), braid = prop(T, 'rp_prop_braid', HT.rp_prop_braid), braidCut = prop(T, 'rp_prop_braid_cut', HT.rp_prop_braid_cut);
const hook = prop(T, 'rp_prop_hook', HT.rp_prop_hook), silk = prop(T, 'rp_prop_silk', HT.rp_prop_silk), cradle = prop(T, 'rp_prop_cradle_baby', HT.rp_prop_cradle_baby);
const rampion = mk(T, { in: ['rp_prop_rampion', HT.rp_prop_rampion], out: ['rp_prop_rampion_pulled', HT.rp_prop_rampion_pulled] });
const ribbons = { long: prop(T, 'rp_prop_ribbon_long', HT.rp_prop_ribbon_long), mid: prop(T, 'rp_prop_ribbon_mid', HT.rp_prop_ribbon_mid), short: prop(T, 'rp_prop_ribbon_short', HT.rp_prop_ribbon_short) };
const notes = [0, 1, 2].map(() => prop(T, 'rp_prop_note', HT.rp_prop_note)), stars = [0, 1, 2].map(() => prop(T, 'rp_prop_star', HT.rp_prop_star)), wind = prop(T, 'rp_prop_wind', HT.rp_prop_wind);
const ALL = [rap, gothel, father, mother, prince, horse, bird, rabbit, tower, braid, braidCut, hook, silk, cradle, rampion, ...Object.values(ribbons), ...notes, ...stars, wind];
ALL.forEach(hide);
T.director({ cast: { rap, gothel, father, mother, prince }, noFace: ['rap', 'gothel', 'father', 'mother', 'prince'] });
```

`T.director` 는 세로 화면에서만 말하는 배역에게 카메라를 붙인다(가로는 무대 전체가 보임). 방향은 장면에서 직접 정하므로 `noFace` 에 전부 넣는다. cast 키는 대본의 배역 키(`rap`·`gothel`·`father`·`mother`·`prince`)와 같아야 한다.

### 1-1. 자리표시(목업) 규칙 — 그림이 없을 때
`beauty_beast.js` 의 `placeholder()`·`sprite()`·`BGPH`·`bgImage()` 를 그대로 가져와 이 동화의 표로 바꾼다. 자리표시는 **그림과 같은 상자(w×h)** 안에 그리므로 그림이 생기면 코드 변경 없이 바뀐다. 이름표(`.phl`)는 뒤집혀도 글자가 뒤집히지 않게 `a.place` 를 덮어쓴 부분까지 같이 가져온다. 사람 자리표시는 beauty_beast 와 같이 머리 반지름 `r = min(h*.17, w*.5)`(2.5등신).

| 그림 | 자리표시 모양 | 색 |
|---|---|---|
| `rp_rap_*` | 살구 동그라미 머리 + 연두 직사각 원피스 + **금빛 세로 띠**(땋은 머리, 폭 r*.5, 오른쪽 어깨에서 바닥까지) + 띠 위 팥빛 작은 사각 3개. `window`·`wrap` 는 상자가 낮으니 머리 + 몸 윗부분만. `short_*` 는 띠 없이 금빛 반원 머리카락만. `surprise`·`short_shock` 눈을 크게(r*.16), `sing`·`short_sing` 눈을 곡선 2개 + 입 동그라미, `joy` 양팔 위로(사각 2개), `*_hold` 한쪽 팔 가로 사각 | 피부 `#F2D9B8`, 머리 `#D9A94E`, 원피스 `#B9CF7A`, 리본 `#A93B32` |
| `rp_gothel_*` | 짙은 초록 긴 직사각 망토 + 살구 머리 + 회색 동그라미(틀어 올린 머리, 머리 위) + 갈색 세로 막대(지팡이, 오른쪽). `point` 왼쪽 가로 팔 사각, `wand` 막대를 머리 위로, `scissors` 회색 X 두 선(가위), `cradle` 얼굴 없이 회색 동그라미만(뒷모습) + 아래 갈색 사각(요람), `climb` 양팔 위로 | 망토 `#3F6B4F`, 머리 `#9A9A9A`, 지팡이 `#6B4A32` |
| `rp_father_*` | 갈색 직사각 + 살구 머리 + 납작 갈색 모자(가로 사각). `climb`·`pull` 은 상자가 낮으니 몸을 가로로, `shock` 눈 크게 | `#6B4A32` |
| `rp_mother_window` | 크림 직사각 + 금빛 앞치마 사각 + 살구 머리 + 갈색 반원 머리 | `#F6ECD8`, `#D9A94E` |
| `rp_prince_*` | 팥빛 직사각 망토 + 살구 머리 + 금빛 지그재그(관, 사각 3개). `ride` 는 말 타원 + 위에 앉은 왕자(beauty_beast `father_ride` 와 같은 꼴), `hide` 몸 낮게, `sad` 눈 곡선 아래로, `float` 몸을 띄우고 망토 사각을 옆으로, `hold` 한쪽 팔 가로 사각 | `#A93B32`, 관 `#D9A94E` |
| `rp_horse_stand` | 갈색 타원 + 다리 4 + 머리 타원(오른쪽) | `#8A5A38` |
| `rp_bird` / `rp_rabbit` | 주황 동그라미 + 노란 삼각 부리 / 크림 타원 + 귀 사각 2 (각각 점 눈 1) | `#E8703A` / `#F6ECD8` |
| `rp_prop_tower` | 회색 긴 직사각 + 팥빛 삼각 지붕 + 꼭대기 근처 작은 아치 창(크림) + 창 오른쪽 작은 검정 J(고리) | `#D8D2C4`, `#A93B32` |
| `rp_prop_braid` / `rp_prop_braid_cut` | 금빛 세로 직사각(폭 = 상자 폭) + 팥빛 작은 사각 4개 / 금빛 세로 직사각 2개 나란히(고리에 두 가닥) | `#D9A94E`, `#A93B32` |
| `rp_prop_hook` / `rp_prop_silk` / `rp_prop_cradle_baby` / `rp_prop_rampion` / `rp_prop_rampion_pulled` / `rp_prop_ribbon_*` / `rp_prop_note` / `rp_prop_petal` / `rp_prop_star` / `rp_prop_wind` | 검정 J 선 / 연파랑 타원 / 갈색 사각 + 크림 동그라미(아기 얼굴, 눈 곡선 2) / 초록 동그라미 5개 + 갈색 반원 / 초록 동그라미 5개 + 크림 세로 선(뿌리) / 팥빛 가로 직사각(상자 폭 그대로) / 크림 동그라미 + 세로 선 / 분홍 타원 / 크림 마름모 / 크림 굵은 곡선 | 팔레트 토큰. **얼굴 없음**(요람의 아기 얼굴만 예외) |
| 배경 `rp_bg_*` | 평평한 종이 한 장 + 바닥 띠(y 412~) + 요소 2~3개 + 위에 "(그림 자리) 배경: 이름" 글자 | cottage: 벽 `#F6ECD8`·바닥 `#D9A94E`·오른쪽 창 사각(안에 초록 띠) / garden_night: 하늘 `#1F2A56`·흙 `#4A3626`·왼쪽 회색 담 사각·달 원 / forest_day: 하늘 `#DCE9F2`·풀 `#9DBB7A`·양 끝 초록 삼각 나무 / room: 벽 `#E4DFD3`·바닥 `#D9A94E`·오른쪽 위 아치 창(연파랑) / forest_dusk: 하늘 `#F2B366`·풀 `#7FA06A`·양 끝 짙은 초록 나무·오른쪽 위 해 / field: 하늘 `#DCE9F2`·풀 `#9DBB7A`·오른쪽 작은 집(크림 사각 + 금빛 삼각) |

자리표시 이름표 글자: 인물은 `WHO[who] + ' ' + POSE[pose]`(예: "라푼젤 창가", "고텔 지팡이"), 소품은 `PROPN[f]`(예: "땋은 머리"). 글자는 §6 과 무관(녹음 없음).

## 2. 공통 수치

### 2-1. 그림 비율(ASP, 폭/높이) — 시작값(그림이 오면 post_tale.py 값으로 바꾼다; preload 가 실제 비율로 덮어쓴다)
```
rp_rap_stand .48, rp_rap_window .70, rp_rap_wrap .72, rp_rap_sing .46, rp_rap_surprise .50, rp_rap_joy .60, rp_rap_short_shock .46, rp_rap_short_sing .44, rp_rap_short_hold .62,
rp_gothel_stand .50, rp_gothel_point .68, rp_gothel_wand .55, rp_gothel_scissors .55, rp_gothel_cradle .52, rp_gothel_climb .42,
rp_father_stand .46, rp_father_climb .95, rp_father_pull .95, rp_father_shock .55, rp_mother_window .46,
rp_prince_stand .48, rp_prince_ride 1.05, rp_prince_hide .85, rp_prince_climb .42, rp_prince_sad .50, rp_prince_float .62, rp_prince_hold .62,
rp_horse_stand 1.25, rp_bird 1.05, rp_rabbit .80,
rp_prop_tower .36, rp_prop_braid .13, rp_prop_braid_cut .45, rp_prop_hook .75, rp_prop_silk 1.1, rp_prop_cradle_baby 1.25, rp_prop_rampion 1.0, rp_prop_rampion_pulled .85,
rp_prop_ribbon_long 8.0, rp_prop_ribbon_mid 5.4, rp_prop_ribbon_short 2.7, rp_prop_note .62, rp_prop_petal .62, rp_prop_star 1.0, rp_prop_wind 1.9
```

### 2-2. 높이(HT) — 같은 인물·소품은 자세가 달라도 같은 크기 (CLAUDE.md §4-1)
무대 1000×560, 바닥 `FL = 505`. 높이는 그림 상자가 아니라 **같은 부위의 크기**가 같아지도록 정한다.

**사람 — 머리 폭(머리카락 바깥 폭)으로 맞춤.** 라푼젤 서기 `rp_rap_stand` 가 기준 **200**(벨 서기와 같은 머리 크기). 받은 뒤 각 자세의 머리 폭을 재서 `HT[자세] = 200 × (hw_stand/H_stand) ÷ (hw_pose/H_pose)` 로 고친다(hw = 원본 PNG 머리 폭 px, H = 원본 bbox 높이 px). ±12% 밖이면 그 자세만 다시 생성한다. 어른은 같은 머리 폭에 키만 212~215.

| 그림 | HT 시작값 | 비고 |
|---|---|---|
| rp_rap_stand, sing, surprise, short_shock, short_sing, short_hold | **200** | 기준. `sing`·`stand` 는 땋은 머리 끝 코일이 발 옆 바닥에 있어 상자가 조금 넓다 |
| rp_rap_joy | 212 | 양팔 위 |
| rp_rap_window, rp_rap_wrap | **120** | 허리까지 반신. 머리 폭이 서기와 같아야 한다(가장 중요한 크기 점검) |
| rp_gothel_stand, point, scissors, cradle | **215** | 어른 |
| rp_gothel_wand | 240 | 지팡이를 머리 위로 들어 상자가 높다 |
| rp_gothel_climb, rp_prince_climb | 235 | 양팔 위 |
| rp_father_stand | **212** | |
| rp_father_climb | 190 | 옆으로 담을 넘는 자세 |
| rp_father_pull | 150 | 웅크림 |
| rp_father_shock | 222 | 모자가 떠서 상자가 높다 |
| rp_mother_window | **212** | |
| rp_prince_stand, hold | **212** | |
| rp_prince_ride | 300 | 말 포함 한 장(말 높이 230 과 왕자 머리 폭이 둘 다 맞아야 함) |
| rp_prince_hide | 150 | 웅크림 |
| rp_prince_sad | 205 | 고개 숙임 |
| rp_prince_float | 220 | 망토가 떠서 상자가 높다 |

**동물·소품**
| 그림 | HT | 비고 |
|---|---|---|
| rp_horse_stand | **230** | 말 머리 높이 ≈ 사람 머리 1.5배(PLAN 비율) |
| rp_bird | **40** | 지붕 위, 톡 대상(hitBox 90×90) |
| rp_rabbit | **56** | 탑 아래, 톡 대상(hitBox 90×90) |
| rp_prop_tower | **445** | 탑 꼭대기 y = FL−445 = 60. 키의 2.2배 |
| rp_prop_braid | **300** (= BRAID_H) | 고리(FL−300)에서 바닥(FL)까지. 폭은 ASP 에 따르되 **36~48** 이어야 한다(그림의 폭이 높이의 1/6 보다 넓으면 다시 생성) |
| rp_prop_braid_cut | **110** | 고리에 두 가닥으로 걸린 모습. 가닥 굵기가 `rp_prop_braid` 폭(≈40)과 같아야 한다(±20%) |
| rp_prop_hook | **24** | |
| rp_prop_silk | **40** | |
| rp_prop_cradle_baby | **90** | |
| rp_prop_rampion | **70** | 톡 대상(hitBox 100×100) |
| rp_prop_rampion_pulled | 86 | 잎 크기를 `rampion` 과 같게(뿌리만큼 상자가 높다) |
| rp_prop_ribbon_long / mid / short | 길이 **180 / 120 / 60** 에서 계산: `HT = 길이 / ASP` | 굵기(= HT)가 셋 다 ≈22 로 같아야 한다. ±25% 밖이면 그 리본만 다시 생성 |
| rp_prop_note | **34** | 3개 복제 |
| rp_prop_petal | **18** | 12개 복제 |
| rp_prop_star | **28** | 3개 복제 |
| rp_prop_wind | **70** (폭 ≈130) | |

**원근 축소 없음.** `put()` 에 `s` 를 넘기지 않는다. 탑 위 창문의 라푼젤(반신)과 땅의 고텔은 같은 깊이 평면이라 머리 폭이 같아야 한다.

### 2-3. 그림이 보는 쪽(NAT) — 뒤집기 규칙
`mk()` 는 `NAT` 가 `'front'` 가 아니고 원하는 쪽과 다르면 좌우로 뒤집는다. 반대로 오면 NAT 만 고친다(그림을 뒤집어 저장하지 않는다).

| 그림 | NAT | 비고 |
|---|---|---|
| rp_rap_stand, window, wrap, sing, surprise, joy, short_shock, short_sing | front | 안 뒤집음 |
| rp_rap_short_hold | **left** | 왼팔을 왼쪽으로 뻗음. 10장에서 왼쪽의 왕자를 본다 |
| rp_gothel_stand, climb | front | |
| rp_gothel_point | **left** | 왼팔로 왼쪽을 가리킴. 2장은 왼쪽의 아버지를(안 뒤집음), 9장은 오른쪽의 왕자를(뒤집음) |
| rp_gothel_wand | right | 3·8·9장 모두 오른쪽을 보고 지팡이를 든다 |
| rp_gothel_scissors | **left** | 가위 날이 왼쪽. 8장은 오른쪽의 라푼젤을 향해 뒤집는다 |
| rp_gothel_cradle | right | 뒷모습, 오른쪽으로 걸어 나간다(가는 방향) |
| rp_father_stand, shock | front | |
| rp_father_climb, pull | right | 담을 오른쪽으로 넘고, 오른쪽의 풀을 뽑는다 |
| rp_mother_window | right | 오른쪽 창밖을 본다 |
| rp_prince_stand, climb, float | front | |
| rp_prince_ride, hide, hold | right | 말은 오른쪽으로 달린다. hold 는 오른쪽의 라푼젤을 본다 |
| rp_prince_sad | **left** | 9장 왼쪽으로 떠난다(가는 방향). 10장은 오른쪽으로 걸어오므로 뒤집는다 |
| rp_horse_stand | right | |
| rp_bird, rp_rabbit | left | 탑 쪽(왼쪽 = 탑 안쪽)을 본다. 새는 탑 오른쪽 지붕에 있으므로 뒤집지 않는다 |
| rp_prop_wind | right | 왼쪽에서 오른쪽으로 분다. 9장 고텔(왼쪽) → 창문(오른쪽) |
| 나머지 소품 | front | |

### 2-4. 겹침 순서(z)
`put()` 은 `T.world` 맨 뒤(가장 앞)에 붙인다. 뒤에 있어야 하는 것을 먼저 `put` 한다.
- 1장: 아버지 → 어머니.
- 2장: 라푼젤 풀 → 아버지 → 고텔 → 별 셋. 요람 컷: 요람 → 고텔(요람을 들면 요람 prop 을 hide).
- 3·4·6·7·9장(탑 밖): **왕자(탑을 한 바퀴 돌 때만, 탑 뒤)** → 탑 → 라푼젤 창가(반신) → 창틀 가림판(§5-4) → 고리 → 땋은 머리(또는 잘린 머리) → 오르는 사람(머리 앞) → 토끼 → 새 → 고텔·왕자(땅) → 말 → 별·바람.
- 5·7·8·9장(탑 안): 고리 → 잘린 머리 → 리본 셋 → 비단실 → 라푼젤 → 고텔·왕자 → 음표·별·바람.
- 10장: 라푼젤 → 왕자 → 꽃잎(맨 앞).

### 2-5. 세로 화면 규칙
- `P` 일 때 보이는 폭은 약 260. 탑 장면은 모두 `camSnap(520)`(보이는 x 390~650)에 탑 `TX = 560` 을 두어 창문·고리·땋은 머리·땅의 사람이 한 화면에 들어온다. 탑은 높이 445 라 세로 화면에서도 위아래가 다 보인다.
- **아이가 눌러야 하는 것은 모두 한 화면(±130) 안**: 2장 라푼젤 풀(P 470, 카메라 470), 3장 새(566)·토끼(475) (카메라 520), 4장 창문(560, 카메라 520), 5장 리본 셋(왼쪽 끝 250, 긴 것 오른쪽 끝 430; 카메라 400), 10장 손잡기 자리(526, 카메라 560).
- 카메라 y 는 280, z 는 1 로 고정. 줌 없음. 9장 왕자가 왼쪽으로 떠날 때만 `follow(prince.x)`.
- 말하는 배역에게는 `director` 가 카메라를 붙인다.

### 2-6. 누르는 자리 크기
- 톡·고르기 대상은 화면에서 **짧은 변 60 무대 px 이상**. 작은 것(새 40, 토끼 56, 리본 굵기 22, 고리 없음)은 `hitBox()`(§5-1)로 투명 사각을 뒤에 깔아 넓힌다: 새·토끼 90×90, 라푼젤 풀 100×100, 창문(라푼젤 반신 120) 150×150, 리본 `길이+24 × 56`, 10장 손잡기 자리 120×120(두 사람 사이 빈 곳에 보이지 않는 사각 `midHit`). `T.tap`/`T.choose` 에는 그 `hit` 그룹(`a.pos`)을 넘긴다.
- 톡 대상은 기다리는 동안 살짝 들썩인다: `bob(a.pos)`(beauty_beast.js 와 같은 900ms ×3).

### 2-7. 속도 (한 편 7분 이상이 목표)
- `say()` 뒤 `GAP = 800`ms. 장면 끝(다음 `sceneCard` 전) `sleep(SCENE_END = 1600)`.
- 머리 내려오기 `BRAID = 2200`, 오르기 `CLIMB = 4500`, 탑 솟기 `RISE = 1800`, 사람 걷기 `WALK = 3000`(약 300px), 걸을 때 `hop(4, 520)` 반복(`while` + `await hop`).
- 대사 중 `hop`·`wiggle` 은 한 번만. 컷 그림(`cutImage`)은 이 동화에 없다.
- 전체 목표 7~8.5분. §11 에서 잰다. 7분이 안 되면 `SCENE_END` 를 2000, `CLIMB` 를 5500 으로; 9분을 넘으면 `SCENE_END` 1200, `CLIMB` 3800(대사는 건드리지 않는다).

### 2-8. 탑 좌표계 (3·4·6·7·9장 공통)
탑 소품을 `put(T, tower, TX, FL)` 로 두면(높이 445) 아래가 모두 탑에서 계산된다. 받은 탑 그림을 보고 **창문 턱의 실제 y 와 고리의 실제 x** 를 재서 `WIN_DY`·`HOOK_DX` 를 고친다(±15).

| 이름 | 값 | 뜻 |
|---|---|---|
| `TX` | `X(640, 560)` | 탑 가운데 x |
| `WIN_DY` | **−300** | 창문 턱 y = FL + WIN_DY = 205. 라푼젤 반신(`window`·`wrap`)의 바닥(허리)을 여기에 둔다: `put(T, rap, TX, FL + WIN_DY + 4, { look: 'window' })` |
| 창틀 가림판 | `T.paper(T.world, [['rect', { x: -40, y: -8, width: 80, height: 12, rx: 2, fill: '#6B4A32' }]], { transform: 'translate(TX, FL+WIN_DY+6)' })` | 반신 그림의 허리 절단선을 가리는 갈색 창턱 한 조각. 라푼젤 **뒤에 put 하지 말고 뒤에(앞에 보이게)** 만든다 |
| `HOOK_DX` | **+40** | 고리 x = TX + 40, 고리 y = FL + WIN_DY − 4(턱 바로 위). `put(T, hook, TX + HOOK_DX, FL + WIN_DY − 4)` |
| `BRAID_H` | **300** | 땋은 머리: `put(T, braid, TX + HOOK_DX, FL)` — 바닥이 FL, 꼭대기가 고리(FL−300). 폭 36~48 |
| 오르는 사람 | x = `TX + HOOK_DX + 2`, y FL → `FL + WIN_DY + 60` | 머리 앞(z), 두 주먹이 머리 띠 위에 오도록. 도착하면 창문 안으로 사라진다(`fadeOut`) |
| 새 | `put(T, bird, TX + 6, FL − TOWER_H + 16)` | 지붕 꼭대기(y 76). 받은 그림의 지붕 끝에 맞춰 ±10 |
| 토끼 | `put(T, rabbit, TX − 85, FL)` | 탑 발치 왼쪽 |
| 땅의 사람 | 고텔·왕자 `X(TX − 170, TX − 110)` | 탑 왼쪽에 선다. 오를 때 `move(TX + HOOK_DX + 2, FL, 900)` 로 머리 밑으로 간다 |
| 팝 자리 | 창문 왼쪽 `(TX − 160, 140)`, 머리 옆 `(TX − 130, 330)`, 오르기 `(TX + 165, 380)`, 탑 솟기 `(TX − 150, 200)` | 얼굴(창문 y 85~205, 땅 사람 머리 y 290~375)을 가리지 않는 자리 |

## 3. 장면별 상세

표기: `L(x)` 가로, `P(x)` 세로 좌표. 대사는 §6 표의 번호. 효과음 이름은 `sounds/sfx/` 파일명(§7). 모든 장면은 `await T.sceneCard(tr('이름'), () => { … }, focus.pos)` 로 넘어간다(1장만 `T.curtain(true)`). 사람이 걸을 때는 항상 §2-7 의 `hop(4, 520)` 반복을 같이 돌린다. 팝 글자는 모두 §2-8·각 장면에 적은 자리에만 둔다(얼굴 위 금지).

### 장면 1. 담 너머 텃밭 (자동)
- `scene('rp_bg_cottage')`. 아버지 `stand` L420/P330, `FL`. 어머니 `window` L600/P470, `FL`, `to: 'right'`(창밖을 본다; 배경 창은 x 600~880). P: `camSnap(420)`. `await T.curtain(true)`.
- **L0** → **L1**(이 대사 중 `T.pop(760, 120, tr('반짝!'))` 한 번 — 창 너머 텃밭이 마법 텃밭임을 반짝 하나로) → 어머니 `hop(6, 400)` → **L2**(어머니) → 아버지 `hop(8, 300)` → **L3**(아버지) → `sleep(SCENE_END)`.

### 장면 2. 라푼젤 풀 (톡 1 — 첫 조작, 시작 뒤 약 25초)
- `sceneCard(tr('라푼젤 풀'))`, 배경 `rp_bg_garden_night`(담이 왼쪽 1/3, 담 꼭대기 y ≈ 220). 라푼젤 풀 `rampion.look('in')` L470/P470, `FL` + `hitBox(T, rampion, 100, 100)`. 아버지 `climb` L230/P230, **y 235**(담 꼭대기에 걸터앉음; 받은 배경의 담 높이에 ±15), `to: 'right'`. focus: 라푼젤 풀. P: `camSnap(470)`.
- **L4** 와 동시에 담 넘기: `sleep(600)` → 아버지 `move(X(380, 380), FL, 900, 'ease-in')` + `AudioFX.sfx('paper_down', .4)` → `look('pull', 'right')`(두 손이 풀에 닿도록 x 는 풀 − 70; 받은 그림의 손끝 ±15) → `bob(rampion.pos)` → `await T.tap(rampion.hit)`(안내 문장 없음 — 손가락 힌트만). 시작 버튼부터 여기까지 ≤ 28초(§11).
- 톡 뒤: `rampion.look('out')` + `rampion.move(rampion.x, FL - 60, 350, 'ease-out')`(쏙 뽑혀 올라옴) + `AudioFX.sfx('cork', .5)` + `T.pop(rampion.x + 60, FL - 150, tr('쏙!'))` → 풀이 아버지 손으로: `rampion.move(father.x + 60, FL - 70, 400)`(pull 자세의 손끝 `HAND_PULL = [+60, -70]`, ±15) → `sleep(300)` → 고텔 등장: `magic(T, X(640, 540), FL - 120)`(§5-2) 와 동시에 `put(T, gothel, X(640, 540), FL, { look: 'point' })`(안 뒤집음: 왼쪽의 아버지를 가리킴) + `fadeIn(gothel, 300)` → **L5**(고텔) → 아버지 `look('shock')` + `hop(12, 300)` + 풀은 아버지 발 앞 바닥에 `rampion.move(father.x + 40, FL, 300)` → **L6**(아버지) → 고텔 `look('stand')` + `wiggle(3, 600)` → **L7**(고텔) → 아버지 `look('stand')` → **L8**(아버지, 작게) → `sleep(400)`.
- 요람 컷(같은 장면, `veil`): `await veil(T, () => { T.clear(); bgImage(T, 'rp_bg_cottage'); camSnap(X(500, 470), 280, 1); put(T, cradle, X(470, 430), FL); put(T, gothel, 1150, FL, { look: 'stand' }); })` → **L9** 와 동시에: 0ms 고텔 `move(X(600, 540), FL, 2200, 'ease-out')` + hop 반복; **2,600ms** `hide(cradle)` + 고텔 `look('cradle', 'right')` + `AudioFX.sfx('paper_up', .4)`; **3,200ms** 고텔 `move(1150, FL, WALK, 'linear')`(뒷모습, 오른쪽으로 걸어 나감 = 가는 방향) + hop. 구현: `const t = (async () => { … })(); await say(L9); await t;` → `sleep(SCENE_END)`.
- 부부가 우는 모습은 그리지 않는다(PLAN).

### 장면 3. 문 없는 탑 (배움 놀이 1: 위·아래)
- `sceneCard(tr('문 없는 탑'))`, 배경 `rp_bg_forest_day`(가운데·가운데 오른쪽이 비어 있음). 탑은 **아직 없다**. 고텔 `wand` L470/P450, `FL`, `to: 'right'`. focus: 고텔. P: `camSnap(520)`.
- **L10** 과 동시에: 이 대사의 "톡" 즈음(시작 2,000ms) 고텔 `hop(6, 300)` + `AudioFX.sfx('knock', .5)` + `T.pop(gothel.x + 70, FL - 260, tr('톡'))` + `magic(T, TX, FL - 40)`.
- 탑 솟기: `put(T, tower, TX, FL)` → `await towerRise(T, tower)`(§5-3, `RISE` 1,800ms, `slide_up`, `T.pop(TX - 150, 200, tr('쑥!'))`) 를 **L11** 과 동시에 시작한다(`Promise.all([towerRise, say(L11)])`). 탑이 다 솟은 뒤(1,800ms) 창가에 라푼젤: `put(T, rap, TX, FL + WIN_DY + 4, { look: 'window' })` + 창틀 가림판(§2-8) + `put(T, hook, …)` + `fadeIn(rap, 400)`; 지붕에 새 `put(T, bird, TX + 6, FL - TOWER_H + 16)` + `fadeIn`; 발치에 토끼 `put(T, rabbit, TX - 85, FL)` + `fadeIn`. z 순서는 §2-4.
- **L12**(고텔) — "잠겨라" 즈음(시작 600ms) `magic(T, TX, FL - 40)` + `AudioFX.sfx('knock', .4)` 한 번 더 → 고텔 `look('stand')`.
- **L13**(해설) 과 동시에 새 `hop(6, 300)`(0ms) → 토끼 `hop(6, 300)`(1,800ms).
- 놀이(순서 고정: 위 → 아래. 두 보기는 새·토끼 둘뿐): `hitBox(T, bird, 90, 90)`, `hitBox(T, rabbit, 90, 90)`.
  - **Q1**(안내) → `await T.choose([{ el: bird.hit, ok: true }, { el: rabbit.hit, ok: false, onWrong: async () => { await rabbit.wiggle(8, 360); await say(W1); await arrowHint(T, TX + 110, 'up'); } }], { prompt: Q1 })` → 정답: `glow(bird, 1200)` + `bird.hop(14, 400)` + `sparkleSfx(T)` + `T.pop(TX + 120, 60, tr('반짝!'))` → **C1**.
  - **Q2** → `await T.choose([{ el: rabbit.hit, ok: true }, { el: bird.hit, ok: false, onWrong: async () => { await bird.wiggle(8, 360); await say(W2); await arrowHint(T, TX + 110, 'down'); } }], { prompt: Q2 })` → 정답: `glow(rabbit, 1200)` + `rabbit.hop(14, 400)` + `sparkleSfx(T)` + `T.pop(TX - 160, FL - 110, tr('반짝!'))` → **C2**.
  - 2회 오답부터 정답이 빛나며 들썩이고 나머지는 흐려진다(엔진). 12초 무입력이면 `prompt` 재안내(엔진). W1·W2·Q1·Q2 는 §6 과 글자 하나까지 같다.
- `sleep(SCENE_END)`. 고텔·탑·라푼젤·새·토끼는 그대로 4장으로 간다(4장은 같은 무대를 다시 만든다).

### 장면 4. 머리를 내려요 (톡 2 — 창문)
- `sceneCard(tr('머리를 내려요'))`, 배경 `rp_bg_forest_day`. `put` 순서(§2-4): 탑 → 라푼젤 `window` → 창틀 가림판 → 고리 → 토끼 → 새 → 고텔 `stand` L470/P450, `FL`. focus: 라푼젤. P: `camSnap(520)`.
- 고텔 `hop(6, 400)` → **L14**(고텔) → `hitBox(T, rap, 150, 150)` + `bob(rap.pos)` → `await T.tap(rap.hit)`(안내 문장 없음, 손가락 힌트가 창문의 라푼젤 위에 뜬다).
- 톡 뒤: 라푼젤 `look('wrap')` + `AudioFX.sfx('paper_tap', .4)` → `sleep(400)` → `braidDown(T, braid, TX)`(§5-4: `slide_down` + `T.pop(TX - 130, 330, tr('스르르~'))`) 를 **L15** 와 동시에 → 라푼젤 `look('window')`.
- 고텔이 머리 밑으로: `gothel.move(TX + HOOK_DX + 2, FL, 900, 'ease-in-out')` → `gothel.look('climb')` → `climb(T, gothel, TX, true)`(§5-5: `CLIMB` 4,500ms, `영차, 영차` 팝 2번) 를 **L16** 과 동시에(`Promise.all`) → 고텔이 창문 안으로 사라지면 `braidUp(T, braid)`(1,200ms) → 라푼젤 `hop(6, 300)`(손 흔듦 대신) → `sleep(SCENE_END)`.

### 장면 5. 탑 안의 노래 (배움 놀이 2: 긴 것·짧은 것)
- `sceneCard(tr('탑 안의 노래'))`, 배경 `rp_bg_room`(창문 x 673~889, y 128~372, 턱 y 372; 걸상 왼쪽). 고리 `put(T, hook, X(905, 905), 250)`(창 오른쪽 벽, 8장과 같은 자리). 라푼젤 `sing` L760/P520, `FL`(창 앞). 리본 셋: 바닥에 **왼쪽 끝을 맞춰** 세로로 늘어놓는다 — 자리 셋 `ys = [436, 494, 552]`(바닥 y, 리본 굵기 22 이므로 가운데는 425·483·541) 에 `['long', 'mid', 'short'].sort(() => Math.random() - .5)` 순으로, 왼쪽 끝 `LEFT = X(150, 250)`, `put(T, r, LEFT + len/2, y)`(len = 180/120/60; 배우 x 는 가운데) + `hitBox(T, r, len + 24, 56)`. focus: 라푼젤. P: `camSnap(400)`.
- **L17** → `await hum(T, rap.x - 150, FL - 300)`(§5-6: 허밍 클립 + 음표 셋 + `T.pop(rap.x - 150, FL - 300, tr('라라라~'))`) → 라푼젤 `hop(6, 400)` → **L18**(라푼젤).
- **L19** 와 동시에 리본 셋이 차례로 `hop(6, 300)`(0 / 500 / 1,000ms).
- **Q3**(안내) → `await T.choose(['long','mid','short'].map(k => ({ el: ribbons[k].hit, ok: k === 'long', onWrong: async () => { await ribbons[k].wiggle(8, 360); await say(k === 'mid' ? W3m : W3s); await compare(T, ribbons[k], ribbons.long, LEFT); } })), { prompt: Q3 })` → 정답: `glow(ribbons.long, 1200)` + `sparkleSfx(T)` + `T.pop(LEFT + 200, 395, tr('반짝!'))` → **C3** → 긴 리본이 머리끝으로: `ribbons.long.move(rap.x + TIE[0], FL + TIE[1], 700, 'ease-in-out')`(`sing` 자세의 발 옆 머리 코일 `TIE = [+38, -14]`, 받은 그림 ±15) + `AudioFX.sfx('swish', .3)` → `ribbons.long.hit` 제거(`a.pos.style.pointerEvents = 'none'`).
- **Q4**(안내, 보기는 중간·짧은 것 둘) → `await T.choose([{ el: ribbons.short.hit, ok: true }, { el: ribbons.mid.hit, ok: false, onWrong: async () => { await ribbons.mid.wiggle(8, 360); await say(W4m); await compare(T, ribbons.mid, ribbons.short, LEFT); } }], { prompt: Q4 })` → 정답: `glow(ribbons.short, 1200)` + `sparkleSfx(T)` + `T.pop(LEFT + 100, 395, tr('반짝!'))` → **C4** → 짧은 리본도 머리끝으로: `move(rap.x + TIE[0] + 26, FL + TIE[1] - 10, 700)` → 중간 리본은 바닥에 그대로.
- **L20** 과 동시에 음표 둘 `notesUp(T, rap.x - 40, FL - 230)`(허밍 클립 없이 음표만) → `sleep(SCENE_END)`.

### 장면 6. 노랫소리 (자동)
- `sceneCard(tr('노랫소리'))`, 배경 `rp_bg_forest_dusk`. `put` 순서: 탑 → 라푼젤 `window` → 창틀 가림판 → 고리 → 토끼 없음·새 없음(6장부터 동물 없음). 왕자 `ride`(말 포함 한 장) 왼쪽 밖 L-200/P-200, `FL`, `to: 'right'`. focus: 탑 창문(rap.pos). P: `camSnap(480)`.
- **L21** 과 동시에 말 들어옴: `prince.move(X(260, 360), FL, 3500, 'linear')` + `hop(3, 520)` 반복 + `AudioFX.sfx('step_grass', .3)` 1,000ms 마다.
- `await hum(T, TX - 160, 140)`(창문 왼쪽에 음표·`라라라~`) → 왕자 `hop(6, 400)` → **L22**(왕자).
- 내리기: `hide(prince)` → `put(T, horse, X(260, 360), FL)` → **왕자를 탑보다 먼저 put 해야 탑 뒤로 지나간다**: `T.world.insertBefore(prince.pos, tower.pos)` 한 뒤 `put` 대신 `prince.look('stand'); prince.place(X(330, 420), FL); prince.pos.style.display = ''`(put 은 맨 앞에 붙이므로 쓰지 않는다) → 한 바퀴: `prince.move(TX + 130, FL, 1800, 'ease-in-out')`(탑 뒤로 사라짐) → `sleep(300)` → `prince.move(X(330, 420), FL, 1800)` + hop 반복, **L23** 은 이 이동과 동시에.
- **L24** 와 동시에: 고텔 `put(T, gothel, -100, FL, { look: 'stand' })` → `move(X(470, 440), FL, WALK, 'linear')` + hop; 왕자는 `T.world.appendChild(prince.pos)`(다시 앞으로) → `look('hide', 'right')` + `move(X(120, 350), FL, 1200)`(왼쪽 나무 뒤; 세로는 350 — 고텔 440 왼쪽) .
- 고텔 `hop(6, 400)` → **L14**(고텔, 4장과 같은 클립) → 라푼젤 `look('wrap')` → `braidDown(T, braid, TX)`(팝 `스르르~` 포함, 대사 없음) → 라푼젤 `look('window')` → 고텔 `move(TX + HOOK_DX + 2, FL, 900)` → `look('climb')` → `await climb(T, gothel, TX, true)` → `braidUp` → 왕자 `hop(8, 300)` → **L25**(왕자) → `sleep(SCENE_END)`.

### 장면 7. 왕자가 올라와요 (자동)
- `sceneCard(tr('왕자가 올라와요'))`, 배경 `rp_bg_forest_dusk`. 탑 → 라푼젤 `window` → 가림판 → 고리 → 왕자 `stand` L470/P440, `FL`. focus: 왕자. P: `camSnap(520)`.
- **L26** → 왕자 `hop(6, 400)` → **L27**(왕자) → 라푼젤 `look('wrap')` → `braidDown(T, braid, TX)` → 라푼젤 `look('window')` → 왕자 `move(TX + HOOK_DX + 2, FL, 900)` → `look('climb')` → `await climb(T, prince, TX, true)` → `braidUp`.
- 탑 안으로(`veil`): `await veil(T, () => { T.clear(); bgImage(T, 'rp_bg_room'); camSnap(X(500, 480), 280, 1); put(T, hook, X(905, 905), 250); put(T, rap, X(760, 520), FL, { look: 'surprise' }); put(T, prince, X(760, 520) + 10, FL, { look: 'stand' }); prince.pos.style.opacity = 0; })` → 왕자가 창으로 들어옴: `fadeIn(prince, 400)` + `prince.move(X(600, 440), FL, 1200, 'ease-out')` + `AudioFX.sfx('paper_down', .4)` → 비단실 `put(T, silk, prince.x + 70, FL)` + `fadeIn`.
- 라푼젤 `hop(10, 300)` → **L28**(라푼젤) → 왕자 `wiggle(3, 600)` → **L29**(왕자) → 라푼젤 `look('joy')` + `hop(12, 320)` → **L30**(라푼젤) → 라푼젤 `look('stand')` → **L31**(이 대사 중 비단실이 둘 더 생긴다: `silk2`·`silk3` 를 `prop` 으로 만들어 `prince.x + 100`, `prince.x + 130` 에 `fadeIn` 1,200ms·2,400ms — 저녁마다 가져왔음을 보여 준다) → `sleep(SCENE_END)`.

### 장면 8. 싹둑 (자동)
- `sceneCard(tr('싹둑'))`, 배경 `rp_bg_room`(낮). 고리 `(905, 250)` → 고텔 `stand` L560/P440, `FL` → 라푼젤 `stand` L760/P540, `FL`. focus: 라푼젤. P: `camSnap(520)`.
- **L32** → 라푼젤 `hop(6, 400)` → **L33**(라푼젤) → 고텔 `hop(10, 300)` + `wiggle(4, 500)` → **L34**(고텔).
- 자르기: 고텔 `move(rap.x - 80, FL, 700, 'ease-in-out')` → `look('scissors', 'right')`(뒤집혀 가위 날이 오른쪽의 라푼젤을 향함) → `sleep(400)` → `AudioFX.sfx('chop', .6)` + `T.pop(gothel.x - 60, 250, tr('싹둑!'))` + 라푼젤 `look('short_shock')`(같은 순간) + `rap.hop(8, 300)` → 잘린 머리: `put(T, braidCut, gothel.x + 40, FL - 60)`(가위 손 근처, 받은 그림 ±15) + `fadeIn(braidCut, 200)` → `braidCut.move(905, 250 + 110, 800, 'ease-in-out')`(고리에 걸림; 바닥 y = 고리 y + HT 110) + `AudioFX.sfx('paper_up', .4)` → 고텔 `look('wand', 'right')`.
- **L35** 와 동시에: 1,800ms(“지팡이를 톡” 즈음) `AudioFX.sfx('knock', .5)` + `magic(T, gothel.x + 40, FL - 260)` + `T.pop(gothel.x - 70, 230, tr('톡'))`; 2,600ms `await veil(T, () => { T.clear(); bgImage(T, 'rp_bg_field'); camSnap(X(500, 480), 280, 1); put(T, gothel, X(400, 400), FL, { look: 'stand' }); put(T, rap, X(560, 520), FL, { look: 'short_shock' }); })` + 도착 반짝 `magic(T, X(480, 460), FL - 200)`. 구현: `const t = (async () => { await sleep(1800); …; await sleep(800); await veil(…); magic(…); })(); await say(L35); await t;`.
- 라푼젤 `wiggle(3, 600)` 한 번(놀란 눈, 울지 않음) → `sleep(SCENE_END)`. 고텔이 라푼젤을 두고 가는 모습은 그리지 않는다.

### 장면 9. 빈 탑 (자동)
- `sceneCard(tr('빈 탑'))`, 배경 `rp_bg_forest_dusk`. 탑 → 가림판 없음(라푼젤 없음) → 고리 → 잘린 머리 `put(T, braidCut, TX + HOOK_DX, FL + WIN_DY - 4 + 110)`(고리에 걸려 있음) → 왕자 `stand` L470/P440, `FL`. focus: 왕자. P: `camSnap(520)`.
- **L36** → 왕자 `hop(6, 400)` → **L27**(왕자, 7장과 같은 클립) → **L37** 과 동시에: `fadeOut(T, braidCut, 300)` → `braidDown(T, braid, TX)`(팝 `스르르~`) → 왕자 `move(TX + HOOK_DX + 2, FL, 900)` → `look('climb')` → `await climb(T, prince, TX, false)`(팝 없이) → `braidUp`.
- 탑 안으로(`veil`): `await veil(T, () => { T.clear(); bgImage(T, 'rp_bg_room'); camSnap(X(500, 520), 280, 1); put(T, hook, X(905, 905), 250); put(T, braidCut, X(905, 905), 250 + 110); put(T, gothel, X(560, 440), FL, { look: 'point', to: 'right' }); put(T, prince, X(760, 540), FL, { look: 'stand' }); })` → 왕자 `hop(8, 300)` → **L38**(고텔) → 고텔 `look('wand', 'right')` + `AudioFX.sfx('knock', .5)` + `magic(T, gothel.x + 40, FL - 260)` → 바람: `put(T, wind, gothel.x + 90, FL - 200)` + `fadeIn(wind, 200)` → `wind.move(prince.x, FL - 230, 900, 'ease-in')` + `AudioFX.sfx('whoosh', .5)` + `T.pop(gothel.x - 80, 240, tr('휘익~'))` → 왕자 `look('float')` + `prince.move(prince.x, FL - 90, 600, 'ease-out')` → `prince.move(1100, FL - 140, 900, 'ease-in')`(창문 밖으로) + `hide(wind)`.
- 밖으로(`veil`): `await veil(T, () => { T.clear(); bgImage(T, 'rp_bg_forest_dusk'); camSnap(X(500, 520), 280, 1); put(T, tower, TX, FL); put(T, hook, …); put(T, prince, TX + HOOK_DX, FL + WIN_DY - 40, { look: 'float' }); })` → **L39** 와 동시에 사뿐 내려오기: `prince.move(X(TX - 150, TX - 110), FL, 2600, 'ease-out')` + `prince.wiggle(3, 900)` 둘 + `T.pop(TX - 170, 300, tr('휘익~'))` 0ms, `T.pop(prince.x - 110, FL - 60, tr('사뿐'))` 2,400ms → `AudioFX.sfx('paper_down', .3)` → 왕자 `look('sad')`(NAT left, 안 뒤집음 — 왼쪽으로 떠날 것이므로 왼쪽을 본다).
- **L40**(왕자, 작게) → **L41** 과 동시에 떠남: `prince.move(-150, FL, 6000, 'linear')` + `hop(3, 560)` 반복 + `step_grass` .25 를 1,100ms 마다. P: `follow(300, 6000)`. `await` 이동 → `sleep(SCENE_END)`. 계절 바뀜 컷 없음(PLAN).

### 장면 10. 노래를 따라서 (톡 3 — 마지막 인사: 손잡기)
- `sceneCard(tr('노래를 따라서'))`, 배경 `rp_bg_field`(오두막 오른쪽 x 694~932). 라푼젤 `short_sing` L640/P560, `FL`. 왕자 `sad` 왼쪽 밖 L-120/P-120, `FL`, **`to: 'right'`**(오른쪽으로 걸어오므로 뒤집는다). focus: 라푼젤. P: `camSnap(560)`.
- **L42** 와 동시에 왕자가 걸어 들어옴: `prince.move(X(330, 420), FL, WALK, 'linear')` + hop 반복.
- `await hum(T, rap.x - 150, FL - 300)`(음표 + `라라라~`) → 왕자 `look('stand')` + `hop(12, 320)` → **L43**(왕자) → 왕자가 다가감: `prince.move(X(572, 492), FL, 2200, 'ease-in-out')` + hop 반복(라푼젤 640 과 68 떨어져 손끝이 닿는 거리) → 라푼젤 `look('short_shock')` → `hop(10, 300)` → **L44**(라푼젤) → **L45**(왕자).
- 손잡기 톡: 두 사람 사이 빈 곳에 보이지 않는 사각 `midHit = T.el('rect', { x: X(606, 526) - 60, y: FL - 170, width: 120, height: 120, fill: '#000', 'fill-opacity': 0 }, T.world)` → `bob(midHit)` → `await T.tap(midHit)`(안내 문장 없음, 손가락 힌트만).
- 톡 뒤: `midHit.remove()` → 라푼젤 `look('short_hold', 'left')` + 왕자 `look('hold', 'right')`(손끝이 닿도록 라푼젤 `HOLD_R = [-34, -110]`, 왕자 `HOLD_P = [+34, -112]` — 받은 그림의 손끝 위치를 보고 두 사람의 x 간격을 ±10 고친다) + `AudioFX.sfx('pop', .4)` → `petals(T, X(480, 400), X(800, 680))`(§5-10) + `T.confetti()` + (`AudioFX.sfx('tada') || sparkleSfx(T)`) → 둘이 `hop(14, 400)` 두 번 → **L46** → **L47**(해설; 마지막 자막 — `say()` 가 글자도 보여 준다) → `T.finale(); await sleep(1500); return '포기하지 않으면 다시 만날 수 있어요.';`
- 이 동화의 마지막 인사형 톡은 이 손잡기다. 입맞춤·결혼식 없음.

## 4. 배움 놀이 규칙 요약 (엔진 `T.choose`)
- **3장 위·아래**: 보기 둘(지붕 위의 새, 탑 아래의 토끼), 순서 고정(위 → 아래), 정답 1개씩. 12초 무입력이면 `prompt`(Q1/Q2)를 다시 읽는다. 1회 오답 → `onWrong`(흔들림 + W1/W2 + 화살표 힌트 §5-7). 2회 오답부터 정답이 노랗게 빛나며 들썩이고 나머지는 흐려진다(엔진). 정답을 누르면 `AudioFX.ding()` → 반짝 → C1/C2.
- **5장 긴 것·짧은 것**: Q3 보기 셋(긴·중간·짧은, 자리 무작위, 왼쪽 끝 정렬), 정답 긴 것. Q4 보기 둘(중간·짧은), 정답 짧은 것. 1회 오답 → 흔들림 + W 대사 + 두 리본 나란히 비교(§5-8). 2회 오답부터 정답이 빛난다. 정답 → ding → 반짝 → C3/C4 → 리본이 머리끝으로.
- 오답 설명 뒤 바로 다시 고를 수 있다. 게임오버 없음. 둘 다 줄거리와 무관하다. 자동 재생(`auto_play`)에서는 엔진이 정답을 대신 누른다.

## 5. 코드로 그리는 것 (그림 없이)

### 5-1. 누르는 자리 넓히기 `hitBox(T, a, w, h)`
배우 `a.pos` 의 **맨 앞 자식으로** 투명 사각을 넣고(`T.el('rect', { x: -w/2, y: -a.h/2 - h/2, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, a.pos)` — `a.pos.insertBefore(rect, a.body)` 로 그림 뒤에; 사각의 세로 가운데가 그림 가운데), `a.hit = a.pos` 를 둔다. `fill-opacity: 0` 이어도 pointer-events 는 받는다(`fill: none` 은 안 받는다). 손가락 힌트는 `getBoundingClientRect` 를 쓰므로 사각 가운데를 가리킨다. 창문의 라푼젤(반신 120)은 150×150 이라 창문 전체가 눌린다.

### 5-2. 마법 반짝 `magic(T, x, y)`
`stars[0..2]` 를 `(x - 36, y + 10)`, `(x, y - 30)`, `(x + 36, y + 10)` 에 `put` 하고(별 소품, 높이 28) 각각 `pos.animate([{ opacity: 0, transform: 'translate(…) scale(.3)' }, { opacity: 1, transform: 'translate(…) scale(1.2)', offset: .4 }, { opacity: 0, transform: 'translate(…) scale(.5)' }], { duration: 900, delay: i * 90 })` 뒤 `hide`. `sparkleSfx(T)` 한 번. 번개·불꽃·보라색 없음. 고텔 등장(2장), 탑 세우기·잠그기(3장), 들판 이동(8장), 마법 바람(9장)에서 쓴다.

### 5-3. 탑이 쑥 솟음 `towerRise(T, tower)`
`tower.body.style.transformBox = 'fill-box'; tower.body.style.transformOrigin = '50% 100%'`(발치 기준) → `await T.anim(tower.body, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1.04)', offset: .85 }, { transform: 'scaleY(1)' }], { duration: RISE, easing: 'ease-out' })` + `AudioFX.sfx('slide_up', .5)` + `T.pop(TX - 150, 200, tr('쑥!'))` 600ms 뒤. 끝나면 `tower.body.style.transform = ''`.

### 5-4. 머리가 스르르 `braidDown(T, braid, tx)` / `braidUp(T, braid)`
`put(T, braid, tx + HOOK_DX, FL)`(바닥 FL, 꼭대기 고리) → `braid.body.style.transformBox = 'fill-box'; braid.body.style.transformOrigin = '50% 0%'`(**꼭대기 기준**) → `await T.anim(braid.body, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: BRAID, easing: 'ease-out' })` + `AudioFX.sfx('slide_down', .5)` + `T.pop(tx - 130, 330, tr('스르르~'))`. `braidUp` 은 반대로 1,200ms `ease-in` + `swish` .3 뒤 `hide(braid)`, `transform = ''`. 고리는 땋은 머리보다 먼저 put(뒤에 있음), 오르는 사람은 뒤에 put(앞에 보임).

### 5-5. 머리를 타고 오르기 `climb(T, who, tx, pops)`
`who.look('climb')`(앞모습, 안 뒤집음) → `who.place(tx + HOOK_DX + 2, FL)` → `const sway = (async () => { while (climbing) await who.wiggle(3, 700); })()` + `await who.move(tx + HOOK_DX + 2, FL + WIN_DY + 60, CLIMB, 'linear')` + `pops` 면 `T.pop(tx + 165, 380, tr('영차, 영차'))` 를 0ms·2,200ms + `AudioFX.sfx('creak', .25)` 를 1,500ms 마다 → 도착 `climbing = false` → `fadeOut(T, who, 400)`(창문 안으로). 매달린 사람의 크기는 땅에 섰을 때와 같다(HT 는 머리 폭 기준).

### 5-6. 허밍 `hum(T, x, y)` + 음표 `notesUp(T, x, y)`
`const u = vo('hum')`(라푼젤 목소리의 extra.hum "라라라, 라라라~", 말풍선 없음) → `notesUp(T, x, y)` + `T.pop(x, y, tr('라라라~'))` → `await (u || T.playMelody(T.parseSong('G4 A4 B4 A4 G4:2 E4 G4:2'), { beat: .4 }))`(클립이 없으면 엔진 멜로디). `notesUp`: `notes[i]` 를 `(x + 30 + i * 26, y + 20)` 에 `put` 하고 `move(x + 30 + i * 26 + (i % 2 ? 18 : -14), y - 110, 1800, 'ease-out')` + `pos.animate(opacity 1→0, 1800)` 을 `i * 350`ms 간격, 끝나면 `hide`. 녹음 클립이 노래가 아니라 말로 들리면 §11 에서 `vo('hum')` 대신 엔진 멜로디만 쓰기로 바꾼다(코드 한 줄: `const u = null`).

### 5-7. 위·아래 화살표 힌트 `arrowHint(T, x, dir)`
크림 종이 화살표 `T.paper(T.fx, [['path', { d: 'M0 -22 L18 0 L7 0 L7 22 L-7 22 L-7 0 L-18 0 Z', fill: '#F6ECD8', stroke: '#6B4A32', 'stroke-width': 2 }]], { transform: 'translate(x, y0)', filter: 'url(#pp)' })` 를 `dir === 'up'` 이면 y0 330 → 110 으로, `'down'` 이면 (path 를 `scale(1,-1)` 로 뒤집어) 110 → 330 으로 900ms `ease-in-out` 이동하며 opacity 1 → 0, 끝나면 `remove()`. 오답 설명(W1/W2) 뒤에 한 번. 손가락이 "위/아래로 움직이며 다시 알려 준다"(PLAN)의 구현이다.

### 5-8. 리본 비교 `compare(T, wrong, right, left)`
두 리본을 벽의 빈 자리로 올려 **왼쪽 끝을 맞춰** 위아래로 놓는다: `right.move(left + right.w/2, 300, 500)`, `wrong.move(left + wrong.w/2, 336, 500)`(`Promise.all`) → `sleep(1000)` → 각자 원래 자리로 500ms(`x0, y0` 를 미리 저장). 이동 중 `T.choose` 가 눌리지 않게 두 리본 `pointerEvents = 'none'` 했다가 되돌린다.

### 5-9. 같은 장면 안 배경 바꾸기 `veil(T, change)`
`T.fx` 레이어에 크림 종이 `rect`(x -60, y -40, 1120×660, fill `#F5EFE9`, opacity 0) → `anim` opacity 0→1 **350ms** → `change()` → `anim` 1→0 **350ms** → `remove()`. 2장(요람), 7장(탑 안), 8장(들판), 9장(탑 안·밖)에서 쓴다. 효과음 없음(장면 전환이 아니다).

### 5-10. 꽃잎 `petals(T, x0, x1)`
`rp_prop_petal` 을 12개 `prop` 으로 만들어(높이 18) `x = x0 + Math.random() * (x1 - x0)`, `y = -20` 에 `put` → 각 `move(x + (Math.random() * 60 - 30), FL + 10, 2500 + Math.random() * 1000, 'ease-in')` + `wiggle(12, 700)` 반복, `i * 150`ms 간격, 끝나면 `hide`. 얼굴 없음.

## 6. 대사 전체 (voice_script_el.json 과 글자 하나까지 같다)
- `say()` 에 넘기는 한국어 문장은 아래 표와 **정확히** 같아야 녹음이 붙는다(한 글자라도 다르면 클립이 없어 조용히 넘어간다 → §11 `_audio.json` 으로 잡는다).
- 배역 키: nar(해설, **Annie**) rap(라푼젤, **Sora**) gothel(마녀 고텔, **Matilda**) father(아버지, Namchun) mother(어머니, Bella) prince(왕자, **Klamon**). 아기·새·토끼·말은 목소리 없음. 배정 근거는 `voice_script_el.json` 의 `notes`.
- 톡 안내 문장은 없다(2·4·10장 톡은 손가락 힌트만). 고르기 안내(Q1~Q4)는 `say()` 로 읽은 뒤 같은 문장을 `prompt` 로 넘긴다(12초 재안내).
- 말풍선 없는 소리(`extra`, `vo(key)`): `hum`(라라라, 라라라~ — 라푼젤, 5·6·10장).
- L14(고텔 부르기)는 4·6장, L27(왕자 부르기)는 7·9장에서 **같은 문장을 두 번** 쓴다(클립 하나).

| # | 장면 | 배역 | 한국어 (`say()`에 넘기는 문장 그대로) | 영어 | 쓰임 |
|---|---|---|---|---|---|
| L0 | 1 | 해설 | 옛날에 아기를 기다리는 부부가 살았어요. 아기가 곧 올 거예요. | Once upon a time, there lived a husband and wife who were waiting for a baby. The baby was coming soon. |  |
| L1 | 1 | 해설 | 담 너머 텃밭은 마녀 고텔의 마법 텃밭이라 아무도 들어가지 못했어요. | Beyond the wall was the magic garden of the witch Gothel, and no one was allowed in. |  |
| L2 | 1 | 어머니 | 저 라푼젤 풀이 너무너무 먹고 싶어요. | Oh, I want to eat that rampion so, so much. |  |
| L3 | 1 | 아버지 | 내가 가져올게요. | I'll go and get some for you. |  |
| L4 | 2 | 해설 | 밤이 되자, 아버지는 살금살금 담을 넘었어요. | When night came, the father quietly climbed over the wall. | 담 넘기 위(첫 톡 전) |
| L5 | 2 | 마녀 고텔 | 누구냐! 내 풀을 뽑다니! | Who's there! Pulling up my rampion! | 풀 톡 뒤 |
| L6 | 2 | 아버지 | 아, 아내가 너무너무 먹고 싶어 해서요. | Oh! My wife wanted it so, so much. |  |
| L7 | 2 | 마녀 고텔 | 내 풀을 가져가도 좋다. 대신 아기가 태어나면 내가 키우마. | You may take my rampion. But when the baby is born, I shall raise it. |  |
| L8 | 2 | 아버지 | 네… 알겠어요. | Yes... all right. |  |
| L9 | 2 | 해설 | 아기가 태어났어요. 마녀 고텔은 아기를 데려가 라푼젤이라고 이름 짓고 정성껏 키웠어요. | The baby was born. The witch Gothel took her away, named her Rapunzel, and raised her with care. | 요람 컷 위 |
| L10 | 3 | 해설 | 라푼젤이 열두 살이 되자, 마녀는 지팡이를 톡 두드렸어요. | When Rapunzel turned twelve, the witch tapped her stick on the ground. | 지팡이 톡 |
| L11 | 3 | 해설 | 숲속에 문도 계단도 없는 높은 탑이 쑥 솟았어요. 창문은 꼭대기에 하나뿐이에요. | Up rose a tall tower in the forest, with no door and no stairs. There was only one window, right at the top. | 탑 솟기 위 |
| L12 | 3 | 마녀 고텔 | 자, 잠겨라. 밖은 위험하단다. 여기가 제일 안전해. | Now, lock tight. The outside is dangerous. This is the safest place. | 잠그기 반짝 |
| L13 | 3 | 해설 | 지붕 위에는 새 한 마리, 탑 아래에는 토끼 한 마리가 있어요. | On top of the roof sits a bird, and down below the tower sits a rabbit. | 놀이 준비 |
| Q1 | 3 | 해설 | 탑 위에 있는 새를 톡, 눌러 봐요. | Tap the bird on top of the tower. | 고르기 안내(위) |
| W1 | 3 | 해설 | 그건 탑 아래에 있는 토끼예요. 위를 봐요. | That's the rabbit below the tower. Look up. | 오답(토끼) |
| C1 | 3 | 해설 | 맞아요, 탑 위에 새! | That's right, the bird on top! | 정답 |
| Q2 | 3 | 해설 | 이번엔 탑 아래에 있는 토끼를 톡, 눌러 봐요. | Now tap the rabbit below the tower. | 고르기 안내(아래) |
| W2 | 3 | 해설 | 그건 탑 위에 있는 새예요. 아래를 봐요. | That's the bird on top of the tower. Look down. | 오답(새) |
| C2 | 3 | 해설 | 맞아요, 탑 아래에 토끼! | That's right, the rabbit below! | 정답 |
| L14 | 4 | 마녀 고텔 | 라푼젤, 라푼젤, 머리를 내려 줘! | Rapunzel, Rapunzel, let down your hair! | 4·6장 두 번 씀 |
| L15 | 4 | 해설 | 스르르~ 금빛 머리가 탑 아래까지 닿았어요. | Swish... the golden hair slid all the way down to the foot of the tower. | 창문 톡 뒤 |
| L16 | 4 | 해설 | 고텔은 머리를 잡고 천천히 올라가요. | Gothel took hold of the hair and slowly climbed up. | 오르기 위 |
| L17 | 5 | 해설 | 라푼젤은 혼자 있을 때면 창가에서 노래를 불렀어요. | Whenever Rapunzel was alone, she sang at the window. | 허밍 앞 |
| L18 | 5 | 라푼젤 | 내 노래가 숲 끝까지 닿았으면. | I wish my song could reach the end of the forest. |  |
| L19 | 5 | 해설 | 바닥에 리본 세 개가 있어요. 길이가 다 달라요. | There are three ribbons on the floor. They are all different lengths. | 놀이 준비 |
| Q3 | 5 | 해설 | 라푼젤 머리를 묶을 제일 긴 리본을 찾아봐요. | Find the longest ribbon to tie Rapunzel's hair. | 고르기 안내(긴 것) |
| W3m | 5 | 해설 | 그건 중간 리본이에요. 더 긴 리본이 있어요. | That's the middle ribbon. There's a longer one. | 오답(중간) |
| W3s | 5 | 해설 | 그건 제일 짧은 리본이에요. 더 긴 리본이 있어요. | That's the shortest ribbon. There's a longer one. | 오답(짧은 것) |
| C3 | 5 | 해설 | 맞아요, 제일 긴 리본! | That's right, the longest ribbon! | 정답 |
| Q4 | 5 | 해설 | 그럼 제일 짧은 리본은 어디 있을까요? | Now, where is the shortest ribbon? | 고르기 안내(짧은 것) |
| W4m | 5 | 해설 | 그건 중간 리본이에요. 더 짧은 리본이 있어요. | That's the middle ribbon. There's a shorter one. | 오답(중간) |
| C4 | 5 | 해설 | 맞아요, 제일 짧은 리본! | That's right, the shortest ribbon! | 정답 |
| L20 | 5 | 해설 | 라푼젤은 리본을 묶은 머리를 창가에 늘어뜨리고 또 노래했어요. | Rapunzel let her ribboned hair hang at the window and sang again. |  |
| L21 | 6 | 해설 | 어느 해질녘, 숲을 지나던 왕자가 노랫소리를 들었어요. | One evening at sunset, a prince riding through the forest heard the singing. | 말 타고 등장 위 |
| L22 | 6 | 왕자 | 어디서 이렇게 고운 노래가 들리지? | Where is that lovely song coming from? |  |
| L23 | 6 | 해설 | 왕자는 탑을 한 바퀴 돌았지만 문이 없었어요. | The prince walked all the way around the tower, but there was no door. | 탑 돌기 위 |
| L24 | 6 | 해설 | 그때 마녀 고텔이 왔어요. 왕자는 나무 뒤에 숨었어요. | Just then the witch Gothel came. The prince hid behind a tree. | 숨기 |
| L25 | 6 | 왕자 | 아, 저렇게 올라가는구나! | Ah, so that's how you get up there! |  |
| L26 | 7 | 해설 | 다음 날 저녁, 왕자는 탑 아래에서 외쳤어요. | The next evening, the prince called out from the foot of the tower. |  |
| L27 | 7 | 왕자 | 라푼젤, 라푼젤, 머리를 내려 줘요! | Rapunzel, Rapunzel, let down your hair! | 7·9장 두 번 씀 |
| L28 | 7 | 라푼젤 | 어머, 할머니가 아니네? | Oh my, you're not Grandmother? |  |
| L29 | 7 | 왕자 | 놀라게 해서 미안해요. 노래가 너무 고와서 왔어요. 저와 함께 성으로 가요. | I'm sorry I startled you. Your song was so lovely that I came. Come with me to my castle. |  |
| L30 | 7 | 라푼젤 | 좋아요. 비단실을 가져오면 사다리를 엮을게요. | All right. If you bring me silk thread, I'll weave a ladder. |  |
| L31 | 7 | 해설 | 그날부터 왕자는 저녁마다 비단실을 가져왔어요. | From that day on, the prince brought silk thread every evening. |  |
| L32 | 8 | 해설 | 어느 날, 라푼젤이 무심코 말했어요. | One day, Rapunzel said without thinking, |  |
| L33 | 8 | 라푼젤 | 할머니, 할머니는 왜 왕자님보다 훨씬 무거워요? | Grandmother, why are you so much heavier than the prince? | 말실수 |
| L34 | 8 | 마녀 고텔 | 뭐라고? 왕자라니! | What? A prince! |  |
| L35 | 8 | 해설 | 마녀는 가위 한 번으로 라푼젤의 머리를 자르고, 지팡이를 톡 두드려 먼 들판의 작은 오두막으로 데려갔어요. | With one snip of her scissors the witch cut off Rapunzel's hair, then tapped her stick and took her away to a little cottage in a faraway meadow. | 싹둑 뒤·들판 컷 위 |
| L36 | 9 | 해설 | 그날 저녁, 왕자는 아무것도 모르고 탑에 왔어요. | That evening, the prince came to the tower, knowing nothing. |  |
| L37 | 9 | 해설 | 마녀는 잘린 머리를 고리에 걸어 내려 주었어요. | The witch hung the cut-off braid on the hook and let it down. | 잘린 머리 내리기 위 |
| L38 | 9 | 마녀 고텔 | 라푼젤은 여기 없다. 다시는 못 볼 거다. 자, 내려가라. | Rapunzel is not here. You will never see her again. Now, down you go. |  |
| L39 | 9 | 해설 | 휘익~ 마법 바람이 왕자를 탑 아래 풀숲에 사뿐 내려놓았어요. | Whoosh... a magic wind set the prince gently down in the grass below the tower. | 마법 바람 위 |
| L40 | 9 | 왕자 | 라푼젤… 어디로 갔을까. | Rapunzel... where could she be? |  |
| L41 | 9 | 해설 | 왕자는 슬픈 얼굴로 숲을 걷고 또 걸었어요. | The prince walked and walked through the forest with a sad face. | 숲 걷기 위 |
| L42 | 10 | 해설 | 그때, 바람을 타고 노랫소리가 들려왔어요. | Then, carried on the wind, came the sound of singing. | 허밍 앞 |
| L43 | 10 | 왕자 | 이 노래는… 라푼젤! | That song... Rapunzel! |  |
| L44 | 10 | 라푼젤 | 왕자님! 찾아와 줬군요. | Prince! You came and found me. |  |
| L45 | 10 | 왕자 | 포기하지 않길 잘했어요. 이제 함께 가요. | I'm glad I never gave up. Let's go together now. | 손잡기 톡 앞 |
| L46 | 10 | 해설 | 두 사람은 손을 꼭 잡고 성으로 떠났어요. | The two held hands tightly and set off for the castle. | 손잡기 톡 뒤 |
| L47 | 10 | 해설 | 마녀 고텔은 텃밭으로 돌아갔어요. | And the witch Gothel went back to her garden. | 마지막 자막 |
| hum | 5·6·10 | 라푼젤 | 라라라, 라라라~ | La la la, la la la~ | extra.hum → `vo('hum')`, 말풍선 없음 |

`run()` 반환 문구(끝 화면)는 `'포기하지 않으면 다시 만날 수 있어요.'`(부제와 같다, `ui` 에 영어 있음). 교훈은 **대사로 읽지 않는다**.

## 7. 효과음 (sounds/sfx/<이름>.mp3, `AudioFX.sfx(name, vol)`)

| 장면 | 순간 | 이름 | 비고 |
|---|---|---|---|
| 1 | 마법 텃밭 | (없음) | 팝 '반짝!' 한 번 |
| 2 | 담 넘기 착지 | `paper_down` (.4) | |
| 2 | 풀 뽑힘 | `cork` (.5) | 팝 '쏙!' |
| 2 | 고텔 등장 | `sparkle`(magic) | 별 셋 |
| 2 | 요람 들기 | `paper_up` (.4) | |
| 3 | 지팡이 톡 | `knock` (.5) + magic | 팝 '톡' |
| 3 | 탑 솟기 | `slide_up` (.5) | 팝 '쑥!' |
| 3 | 잠그기 | `knock` (.4) + magic | |
| 3·5 | 정답 | `sparkle` (없으면 tone 700→1400) | 팝 '반짝!' + 엔진 `ding` |
| 4·6·7·9 | 머리 내려옴 | `slide_down` (.5) | 팝 '스르르~' |
| 4·6·7 | 오르기 | `creak` (.25) 1,500ms 마다 | 팝 '영차, 영차' ×2 (9장은 팝 없음) |
| 4·6·7·9 | 머리 올라감 | `swish` (.3) | |
| 4 | 창문 톡 뒤 | `paper_tap` (.4) | |
| 5·6·10 | 허밍 | `vo('hum')` (없으면 `playMelody`) | 팝 '라라라~' + 음표 셋 |
| 5 | 리본 묶기 | `swish` (.3) | |
| 6 | 말 걷기 | `step_grass` (.3) 1,000ms 마다 | |
| 7 | 창으로 들어옴 | `paper_down` (.4) | |
| 8 | 싹둑 | `chop` (.6) | 팝 '싹둑!' |
| 8 | 잘린 머리 걸기 | `paper_up` (.4) | |
| 8·9 | 지팡이 | `knock` (.5) + magic | 팝 '톡'(8장) |
| 9 | 마법 바람 | `whoosh` (.5) | 팝 '휘익~' ×2, '사뿐' |
| 9 | 착지·걷기 | `paper_down` (.3), `step_grass` (.25) | |
| 10 | 손잡기 | `pop` (.4) → `tada` + `T.confetti()` | 꽃잎 |
| 전환 | 책장 넘기기 | 엔진 기본 | |
| 톡·고르기 | 누름/정답/오답 | 엔진 `AudioFX.tap/ding/miss` | |

### 7-1. 효과음이 없을 때
`cork`·`slide_up`·`slide_down`·`chop`·`knock`·`creak`·`whoosh`·`swish`·`paper_*`·`step_grass`·`sparkle`·`tada`·`pop` 은 모두 `sounds/sfx/` 에 이미 있다. 그래도 `sfx(T, name, vol, fb)` 의 `fb` 로 `T.tone` 대체음을 둔다(`chop` → `T.tone([900, 300], .12, { type: 'square', vol: .18 })`, `slide_down` → `T.tone([900, 300], .5, { vol: .1 })`).

## 8. 카탈로그 항목 (`tales/catalog.js`, `red_car` 항목 뒤)
```js
  { id: 'rapunzel', title: '라푼젤', origin: 'world', also: ['princess'], skills: ['size', 'position', 'heart'], ready: false, making: true,
    line: '탑 위에 있는 새와 탑 아래에 있는 토끼, 제일 긴 리본과 제일 짧은 리본을 찾아요. 머리를 내려 주는 라푼젤이 노래로 왕자를 다시 만나요.',
    en: { title: 'Rapunzel', line: 'Find the bird on top of the tower and the rabbit below, the longest ribbon and the shortest. Rapunzel lets down her hair and finds the prince again through her song.' },
    art: `<rect width="160" height="110" fill="#DCE9F2"/>
      <g class="pc"><rect y="88" width="160" height="22" fill="${c.lf}"/>
      <rect x="66" y="30" width="40" height="60" fill="#D8D2C4"/><path d="M60 30 L86 8 L112 30Z" fill="${c.rd}"/>
      <rect x="78" y="38" width="16" height="18" rx="8" fill="${c.cr}"/>
      <circle cx="86" cy="48" r="7" fill="${c.sk}"/><path d="M79 46 a7 7 0 0 1 14 0 v3 q-7 -5 -14 0z" fill="${c.gd}"/>${eye(84, 49, 1.2)}${eye(88, 49, 1.2)}
      <path d="M94 50 q6 10 2 40" stroke="${c.gd}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="96" cy="62" r="2" fill="${c.rd}"/><circle cx="96" cy="78" r="2" fill="${c.rd}"/>
      <path d="M18 88 L30 56 L42 88Z" fill="${c.pn}"/><path d="M118 88 L130 60 L142 88Z" fill="${c.pn}"/></g>` },
```
태그: `size`(긴 것·짧은 것)·`position`(위·아래)·`heart`. `origin: 'world'`, `also: ['princess']`(공주 동화 묶음). 홈 카드 그림은 코드 SVG(하늘 바탕 `#DCE9F2`, 풀 띠 `c.lf`, 가운데 탑 + 창가의 라푼젤 머리 + 금빛 땋은 머리 `c.gd`, 양옆 나무 `c.pn`). 토큰은 `catalog.js` 의 `_C`(cr·gd·ps·rd·bk·pn·ind·sn·am·ink·lf·sk) 만 쓴다.

## 9. 썸네일·키아트 (인물·탑·머리 그림이 다 나온 뒤)

| 결과 파일 | 원본 | 만드는 법 |
|---|---|---|
| `assets/thumbs/rapunzel_key_wide.webp` (1672×941) | `assets/raw/keyart_gpt/rapunzel_wide_v5.png` | PIL: RGB → 16:9 가운데 자르기 → 1672×941 → webp quality 86 (`back_to_webp.py` 와 같은 식) |
| `…_key_tall.webp` (1086×1448) | `…_tall_v5.png` | 3:4 가운데 자르기 → 1086×1448 |
| `…_tile.webp` (720×540) | `…_tile_v5.png` | 4:3 가운데 자르기 → 720×540. `assets/thumbs/tiles.js` 의 `TILES` 에 `'rapunzel'` 추가 |
| `…_back_wide.webp` (1200×800) · `…_back_tall.webp` (1000×1150) | `…_backw_v5.png` · `…_backt_v5.png` | `~/.venvs/paper-tale/bin/python tools/app/gen/back_to_webp.py rapunzel` |
| `assets/thumbs/thumbs.js` | — | `THUMBSKEY` 에 `"rapunzel"`, `THUMBSKEYLIGHT["rapunzel"] = "#f5efe9"`, `BACKACCENT["rapunzel"] = "#D9A94E"`(끝 화면 리본: Straw Gold, 금빛 머리). `make_thumbs.py` 의 표에도 BACKACCENT 를 넣는다. |

키아트 창 모양은 **탑의 아치 창문**(둥근 머리의 세로 직사각)이고, 테두리 장식은 팥빛 리본 둘과 크림 별 셋뿐(§7-5: 소품 금지, 같은 계열 장식 최소). 창 안은 탑과 창가의 라푼젤, 탑 벽을 타고 땅까지 내려온 금빛 땋은 머리(마녀·왕자 없음). 참고 그림은 작업표의 `refs`(rap_window·prop_tower·prop_braid·gothel_stand / 끝 화면은 rap_short_hold·prince_hold·prop_petal)라 **인물·탑·머리 스프라이트가 모두 나온 뒤** 맨 마지막에 생성한다. 썸네일(타일)은 창가의 라푼젤을 크게, 겹 3개. 끝 화면 뒷표지는 들판에서 손잡은 단발 라푼젤과 왕자 + 꽃잎.

## 10. 그림 목록 (작업표 `jobs_rapunzel.json` 56장과 같다)

사람은 모두 **라푼젤 서기를 기준으로 같은 머리 크기(2.5등신)**. 자세 그림은 기준 그림을 `refs` 로 넣고 프롬프트에 "SAME SCALE AS THE REFERENCE SPRITE(머리·얼굴·몸 크기를 기준 그림과 똑같이)", 어른 기준 그림에는 "HEAD SIZE: 기준 소녀와 같은 머리 크기, 키만 1/10 크게"가 들어 있다(§4-1). 소품은 얼굴 없음(요람 속 아기 얼굴만 예외). 피·상처·무서운 요소 없음(작업표 생성 스크립트가 검사).

| 구분 | id (`assets/v3w/rp_<id>.webp`) | 설명·방향 | 작업표 크기 | pass | 장면 |
|---|---|---|---|---|---|
| 인물·라푼젤 | rap_stand (기준) | 앞모습, 긴 땋은 머리가 오른쪽 어깨에서 발 옆 바닥 코일까지, 연두 원피스 | 600² | 1 | — (기준·키아트) |
| | rap_window(반신, 손 흔듦) / rap_wrap(반신, 머리 감기) | 허리에서 잘린 반신. 창문용 | 600² | 2 | 3·4·6·7·9 / 4·6·7 |
| | rap_sing(눈 감고 허밍) / rap_surprise / rap_joy | 긴 머리 | 600² | 2 | 5 / 7 / 7 |
| | rap_short_shock / rap_short_sing / rap_short_hold(←, 왼팔 뻗음) | 단발 3자세 | 600² | 2 | 8 / 10 / 10 |
| 인물·고텔 | gothel_stand (기준, 지팡이) | 회색 틀어 올린 머리, 짙은 초록 망토, 엄한 얼굴, 모자 없음 | 600² | 2 | 2·4·6·8 |
| | gothel_point(←) / wand(→) / scissors(←, 가위 들고) / cradle(→, 뒷모습 요람) / climb(양팔 위, 밧줄 없음) | | 600² | 3 | 2·9 / 3·8·9 / 8 / 2 / 4·6 |
| 인물·아버지 | father_stand (기준) / climb(→) / pull(→, 웅크림, 손 빈) / shock | 갈색 옷, 납작 모자 | 600² | 2 / 3 / 3 / 3 | 1·2 / 2 / 2 / 2 |
| 인물·어머니 | mother_window(→, 두 손 모음) | 크림 옷, 앞치마 | 600² | 2 | 1 |
| 인물·왕자 | prince_stand (기준) | 팥빛 망토, 작은 금관(푸른 옷 아님) | 600² | 2 | 6·7·9·10 |
| | prince_ride(→, 말 포함 한 장) / hide(→) / climb / sad(←) / float / hold(→, 오른팔 뻗음) | ride 는 prince_stand + horse_stand 둘을 refs | 600² | 3 | 6 / 6 / 7·9 / 9·10 / 9 / 10 |
| 동물 | horse_stand(→) / bird(←) / rabbit(←) | 점 눈 하나, 말하지 않음 | 600² / 480² / 480² | 1 | 6 / 3·4 / 3·4 |
| 소품 | prop_rampion / prop_rampion_pulled | 심긴 것 / 뽑힌 것(뿌리) | 480² | 1 / 2 | 2 |
| | prop_braid(세로, 폭 = 높이의 1/8) / prop_braid_cut(고리에 두 가닥) | 금빛 땋은 머리 + 팥빛 리본 4개 | 480×600 | 1 / 2 | 4·6·7·9 / 8·9 |
| | prop_hook / prop_silk / prop_cradle_baby(아기 얼굴만) | | 300² / 300² / 480² | 1 | 3~9 / 7 / 2 |
| | prop_ribbon_long(가로, 굵기 = 길이의 1/8) / mid(2/3) / short(1/3) | 같은 색·굵기, 길이만 3:2:1, 매듭 없음 | 840×480 | 1 / 2 / 2 | 5 |
| | prop_note / prop_petal / prop_star / prop_wind(→) | 코드에서 복제(음표 3·꽃잎 12·별 3) | 300² / 300² / 300² / 840×480 | 1 | 5·6·10 / 10 / 2·3·8·9 / 9 |
| | prop_tower(세로, 꼭대기 창 하나 + 오른쪽 고리, 문 없음) | 높이 445 로 씀 | 480×600 | 1 | 3·4·6·7·9 |
| 배경 | bg_cottage(낮, 오른쪽 창 너머 담·텃밭) / bg_garden_night(밤, 왼쪽 담, 달 오른쪽 위) / bg_forest_day(낮, 가운데 비움) / bg_room(탑 안, 오른쪽 위 아치 창) / bg_forest_dusk(해질녘, 가운데 비움) / bg_field(들판, 오른쪽 오두막) | 평평한 종이 한 장 + 요소 2~3개. 세트 A(낮, 왼쪽 위 광원): cottage·forest_day·room·field, 세트 B(밤·해질녘, 오른쪽 위 광원): garden_night·forest_dusk | 1600×902 | 1 | 1·2 / 2 / 3·4 / 5·7·8·9 / 6·7·9 / 8·10 |
| 키 | key5_wide · key5_tall · key5_tile · key5_backw · key5_backt | 시작 화면(아치 창)·홈 카드·끝 화면(손잡기) | 16:9 · 3:4 · 4:3 · 3:2 · 4:5 | — | — |

생성 순서: `pass 1`(21: rap_stand, horse_stand, bird, rabbit, 소품 11, 배경 6) → `pass 2`(16: 라푼젤 자세 8, gothel/father/mother/prince 기준 4, rampion_pulled, braid_cut, ribbon_mid, ribbon_short) → `pass 3`(14: 고텔 자세 5, 아버지 자세 3, 왕자 자세 6) → 키아트 5. 작업표가 이 순서로 정렬되어 있으므로 `run_simple.py rapunzel $(python3 -c "import json;print(' '.join(j['id'] for j in json.load(open('tools/app/gen/jobs_rapunzel.json'))))")` 처럼 앞에서부터 돌리면 된다.

받은 그림 점검(틀린 id 만 지우고 다시 만든다): 네 귀퉁이가 마젠타인지(`restyle_check.py` 방식) · 사람 자세의 **머리 폭이 기준(rap_stand)과 ±12% 안**인지(특히 반신 window·wrap) · 고텔에 뾰족 모자·보라·검정·이빨이 없는지 · 왕자 옷이 팥빛(푸른색 아님)인지 · 매달린 자세(climb)의 손에 밧줄·머리카락이 **없는지** · 고텔 뒷모습(cradle)에 얼굴·아기가 없는지 · 소품(탑·머리·고리·비단실·리본·음표·꽃잎·별·바람·풀)에 얼굴이 없는지 · 탑에 문·계단이 없고 창이 하나뿐인지, 고리가 창 오른쪽에 있는지 · 땋은 머리의 폭이 높이의 1/6 보다 좁은지 · 리본 셋의 굵기가 같고 길이가 3:2:1(±15%)인지 · 그림이 보는 쪽이 §2-3 과 같은지(반대면 NAT 만 고친다) · 피·상처·눈물이 없는지.

## 11. 테스트 체크리스트 (코드가 끝난 뒤, 커밋 전)

준비
- [ ] 저장소 뿌리에서 `python3 -m http.server 8795`(다른 에이전트와 겹치지 않게 8795).
- [ ] 헤드리스 크롬: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9345 --user-data-dir=/tmp/rp_chrome --window-size=1366,1024 about:blank &`.
- [ ] 자동 재생: `CDP=9345 node assets/raw/_work/autoplay_audio.mjs http://127.0.0.1:8795/tales/rapunzel/index.html 1366 1024 /tmp/rp_l 600 8` (스크린샷 + `_audio.json`). 5장 리본 자리가 무작위이므로 **두 번 이상** 돌린다. 그림이 없는 동안은 자리표시로 끝까지 돌아야 한다(목업 통과 기준).

가로 1366×1024
- [ ] 끝까지 자동 재생되고 `errors` 에 예외가 없다(그림 404 는 자리표시 모드에서 정상).
- [ ] 첫 조작(2장 풀 톡)의 손가락 힌트가 **시작 버튼 뒤 28초 안**에 뜬다(`_audio.json` 의 L4 시각 + 1.5s ≤ 28s). 넘으면 L1 뒤 어머니 `hop` 과 1장 `SCENE_END` 를 줄인다.
- [ ] 전체 길이 7~8.5분(`_audio.json` 마지막 클립 시각 + 끝 화면). 7분이 안 되면 §2-7 대로 `SCENE_END`·`CLIMB` 를 늘린다.
- [ ] **크기**: 3·4장에서 창가의 라푼젤(반신)과 땅의 고텔 머리 폭이 같은지; 4장 고텔 서기 → 매달리기 머리 폭이 같은지; 7장 왕자 서기 → 매달리기 → 탑 안 서기; 8장 라푼젤 긴 머리 → 단발 머리 폭; 10장 둘의 머리 폭. 땋은 머리 폭 36~48, 잘린 머리 가닥 굵기 같음. 리본 셋 굵기 같고 길이 180/120/60. 틀리면 `HT`(§2-2).
- [ ] **탑 좌표**: 라푼젤 반신의 허리가 창턱에 닿고 가림판이 절단선을 가린다; 고리가 창 오른쪽; 땋은 머리 꼭대기가 고리, 바닥이 땅; 오르는 사람의 주먹이 머리 띠 위에 있고 머리 앞에 보인다; 새가 지붕 끝, 토끼가 발치. 틀리면 `WIN_DY`·`HOOK_DX`(§2-8).
- [ ] **방향**: 아버지가 담을 오른쪽으로 넘고 오른쪽 풀을 뽑는다; 고텔 뒷모습이 오른쪽으로 걸어 나간다; 2장 고텔이 왼쪽 아버지를 가리키고 9장은 오른쪽 왕자를 가리킨다; 8장 가위 날이 라푼젤을 향한다; 9장 왕자가 **왼쪽을 보며 왼쪽으로** 떠나고 10장은 오른쪽을 보며 걸어온다; 10장 라푼젤이 왼쪽(왕자)을, 왕자가 오른쪽(라푼젤)을 보며 손끝이 닿는다.
- [ ] **위·아래**: Q1 오답 때 토끼 흔들림 + W1 + 화살표가 위로, Q2 오답 때 새 흔들림 + W2 + 화살표가 아래로. 두 번째 오답부터 정답이 빛난다. 정답 뒤 반짝 + C1/C2.
- [ ] **긴 것·짧은 것**: 리본 셋의 왼쪽 끝이 맞춰져 있고 자리가 돌 때마다 다르다; 오답 때 두 리본이 벽으로 올라가 나란히 비교되고 제자리로 돌아온다; 정답 리본이 라푼젤 발 옆 머리 코일로 간다; Q4 는 보기 둘.
- [ ] **마법**: 고텔 등장·탑·잠그기·들판 이동·바람에서 별 셋이 반짝이고 번개·불·보라색이 없다. 탑이 발치에서 위로 자라고(`scaleY`) 땋은 머리는 **고리에서 아래로** 자란다.
- [ ] **싹둑**: 가위 효과음 한 번, 팝 '싹둑!' 이 얼굴을 가리지 않고(y 250), 라푼젤이 바로 단발·놀란 눈, 잘린 머리가 고리로 간다. 피·눈물 없음.
- [ ] **마법 바람**: 바람 소품이 고텔에서 창문으로 날아가고 왕자가 떠서 창 밖으로 나간 뒤, 밖에서 창문에서 풀숲으로 사뿐 내려온다. 떨어지거나 다치는 느낌이 없다.
- [ ] **손잡기**: 손가락 힌트가 두 사람 사이에 뜨고, 톡 뒤 두 자세의 손끝이 닿으며 꽃잎·색종이, 끝 화면에 '포기하지 않으면 다시 만날 수 있어요.' 와 리본(`?endpreview=1`).
- [ ] **팝 자리**: 모든 팝 글자가 인물 얼굴 위에 겹치지 않는다(스크린샷으로 확인: 창문의 라푼젤, 땅의 고텔·왕자, 8장 두 사람).
- [ ] 누르는 자리: `.tap-target.armed` 의 `getBoundingClientRect()` 짧은 변이 **화면 60px 이상**(풀·새·토끼·창문·리본·손잡기 자리 모두 hitBox).

세로 390×844 (`node … 390 844 /tmp/rp_p 600 8`)
- [ ] 모든 조작 대상이 그 순간 화면 안에 있다(2장 풀 470, 3장 새 566·토끼 475, 4장 창문 560, 5장 리본 250~430, 10장 손잡기 526). 화면 밖이면 §3 의 P 좌표·`camSnap` 을 고친다.
- [ ] 탑 장면에서 창문·고리·땋은 머리·땅의 사람이 한 화면에 들어온다. 9장 왕자가 떠날 때 카메라가 따라간다.
- [ ] 말하는 배역에게 카메라가 붙고(`director`), 내레이션에서 원래 화면으로 돌아온다. 카메라가 배경 밖을 보이지 않는다.

소리
- [ ] `_audio.json` 에서 **같은 클립이 연달아 두 번** 기록되지 않는다(이중 재생). L14·L27 이 두 장면에서 한 번씩 나온다.
- [ ] NAR 줄 수 = 그 경로에서 지나간 대사 수(기본 경로 51줄 + `hum` 3회 + 오답 수). 빠진 줄은 `say()` 문장을 §6 과 글자 단위로 맞춘다(대본을 고치지 말고 코드를 고친다).
- [ ] 영어: `localStorage.lang = 'en'` 으로 한 번 더 돌려 `narration_el_en.js` 클립과 `TEXT_EN` 장면 이름·팝 글자·고르기 안내·끝 화면 글자가 나오고 **한글이 하나도 보이지 않는다**.
- [ ] 녹음 받아쓰기 점검: 녹음 전 `touch /tmp/rp_marker`, 녹음 뒤 `~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py rapunzel /tmp/rp_marker ko` 와 `… en`. `<<<`(되풀이) 클립은 **그 mp3 만 지우고** `gen_tale.py` 를 다시 돌린다(`--redo` 금지). 영어 v4 는 반드시 본다.
- [ ] `hum` 클립(라라라, 라라라~)이 노래처럼 들리는지. 말처럼 읽히면 그 mp3 만 지우고 연기 지시를 `[sing a simple lullaby melody on la, humming]` 으로 바꿔 다시; 그래도 안 되면 §5-6 의 엔진 멜로디만 쓴다.
- [ ] 고텔(Matilda) 클립이 소리 지르거나 무섭게 들리지 않는지(L5·L34). 그러면 그 줄만 `settings.gothel.stability` .65 로 다시. 헨젤 마녀와 구별이 안 되면 `notes` 의 대안(Wisdom)으로 전체 재녹음.
- [ ] 라푼젤(Sora) 한국어 발음이 어색한 줄은 `settings.rap.stability` .5 로 그 줄만 다시. 전체가 밋밋하면 `notes` 의 대안(Yoojin).
- [ ] 2장 L9 와 요람 컷(2,600ms 들기 → 3,200ms 나감)이 같이 끝난다. 3장 L11 과 탑 솟기, 4장 L16 과 오르기, 8장 L35 와 들판 컷, 9장 L39 와 내려오기, L41 과 떠나기가 같이 끝난다(길면 이동 시간을 늘린다).

마무리
- [ ] 홈(`index.html`)에서 '라푼젤' 카드가 만드는 중으로 보이고 `line` 이 §8 문구, 공주 묶음·위치말 칩에 들어간다.
- [ ] `git status` 에 다른 동화 파일 변경이 없다. `tales/kkultteok/` 은 손대지 않았다. 커밋은 사용자가 요청할 때.

## 12. 남긴 판단
없음. 녹음을 들은 뒤 바꿀 수 있는 것(라푼젤 Sora → Yoojin, 고텔 Matilda → Wisdom, 허밍 클립 → 엔진 멜로디)은 모두 대안까지 §6·§11 에 적어 두었고, 그림을 받은 뒤 재는 값(HT·WIN_DY·HOOK_DX·손끝 오프셋)은 모두 시작값과 허용 범위를 적어 두었다.
