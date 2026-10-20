# 미녀와 야수 — 제작 상세 사양 (SPEC, 2026-10-20)

기획 확정본은 `PLAN.md`(11장, 배움 놀이 3개, 야수 머리 ×1.3, 호칭 '벨', ElevenLabs 녹음). 이 문서는 그 기획을 **더 이상 판단 없이 코드로 옮길 수 있게** 장면마다 그림·좌표·조작·대사·효과음·타이밍을 적은 것이다. 참조 구현은 `tales/snow_white/snow_white.js`(구조·`mk()`·`put()`)와 `tales/cinderella/cinderella.js`(고르기 카드·`director`·HT 표). 모르는 것이 있으면 그 두 파일에서 같은 이름의 코드를 찾아 그대로 따른다.

## 0. 만들 파일과 순서

| 순서 | 파일 | 만드는 방법 |
|---|---|---|
| 1 | `tools/app/gen/jobs_beauty_beast.json` | **이미 있음**(59장). 그림 생성: `python3 tools/app/gen/run_simple.py beauty_beast <id ...>` 를 작업표 순서대로(참고 그림이 먼저 있어야 하므로 `pass` 1 → 2 → 3 → 4 순, 키아트는 맨 뒤). 한도에 걸리면 run_simple.py 가 풀리는 시각까지 기다렸다 이어 간다. |
| 2 | `tools/app/gen/post_beauty_beast.py` | `post_cinderella2.py` 를 복사해 접두어 `cd2_`→`bb_`, 작업표 `jobs_beauty_beast.json`, 시계·발 카드 합성 부분은 지운다. 스프라이트: 마젠타 크로마키(`tools/gpu_night/chromakey.py <src> <dst> 6`) → 여백 없이 오림 → 높이 600(폭 900) 안에 맞춤 → `assets/v3w/bb_<id>.webp`. 배경: 16:9 가운데 자르기 → 1600×902. 끝에 ASP(폭/높이) JSON 을 출력한다 → 코드의 `ASP` 표에 붙인다. |
| 3 | `tales/beauty_beast/index.html` | `tales/cinderella/index.html` 그대로, `<title>미녀와 야수</title>`, 마지막 스크립트 `beauty_beast.js`. (합창 없음) |
| 4 | `tales/beauty_beast/narration.js` | Typecast 녹음이 없으므로 **빈 상수 두 개만** 손으로 쓴다: `/* beauty_beast — Typecast 없음. ElevenLabs(narration_el.js)가 채운다 */\nconst NARRATION_CLIPS = {};\nconst VOICE_LINES = {};` |
| 5 | `tales/beauty_beast/narration_en.js` | `const NARRATION_CLIPS_EN = {}; const VOICE_LINES_EN = {}; const TEXT_EN = {…};` — `TEXT_EN` 은 `voice_script_en.json` 의 `"ui"` 를 그대로 JSON 으로 붙인다(백설공주 `narration_en.js` 와 같은 모양). |
| 6 | `tales/beauty_beast/beauty_beast.js` | 이 문서 §1~§6. |
| 7 | `tales/catalog.js` | §8 의 항목을 `snow_white` 항목 뒤에 추가. `making: true` 라 index.html 과 beauty_beast.js 가 생기면 홈에서 저절로 열린다. |
| 8 | 녹음 | `python3 tools/elevenlabs/gen_tale.py beauty_beast --model eleven_v4` → `audio/el/beauty_beast/*.mp3` + `narration_el.js`; `--lang en` 으로 영어(`audio/el/beauty_beast/en/`, `narration_el_en.js`). 글자 수(태그 포함): 한국어 4,287자, 영어 6,298자. 둘 다 `--dry` 로 먼저 확인(2026-10-20 통과). |
| 9 | 썸네일·키아트 | §9. |
| 10 | 자동 재생 점검 | §11 체크리스트. |

커밋·푸시는 사용자가 요청할 때만 한다. 다른 동화 파일은 건드리지 않는다.

## 1. 코드 구조 (`beauty_beast.js`, snow_white.js 를 거울처럼)

```js
/* 미녀와 야수 — 보몽 판(1756) 원작 그대로. 기획: tales/beauty_beast/PLAN.md, 상세: SPEC.md
   톡 2번(2장 말 출발 · 11장 샘물), 배움 놀이 3개(4장 많고 적음 · 7장 위·아래·옆 · 8장 아침·낮·밤), 연타 없음, 줄거리 선택 없음, 입맞춤 없음.
   사람은 모두 머리 크기가 같다(HT). 야수만 머리 1.3배, 키 1.5배. 그림: assets/v3w/bb_*.webp (목록 tools/app/gen/jobs_beauty_beast.json) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { /* post_beauty_beast.py 출력 붙이기 */ };
  const HT  = { /* §2-2 머리 맞춤 높이 */ };
  const NAT = { /* §2-3 그림이 보는 쪽 */ };
  const FL = 528;                    // 바닥(발끝 y). 배경이 나온 뒤 바닥선과 어긋나면 ±15 안에서 고친다
  const BGS = ['cottage', 'cottage_front', 'snow_forest', 'dining', 'garden', 'room'];
  const bgSrc = k => AS + 'bb_bg_' + k + '.webp', artSrc = k => AS + 'bb_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const hOf = f => HT[f] || 200;
  function mk(T, poses) { … }        // cinderella.js 32~50행 그대로 (poses = { 이름: 그림 } 또는 { 이름: [그림, 높이] })
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) { … }   // cinderella.js 52~57행 그대로
  const hide, fadeIn, fadeOut, glow  // cinderella.js 58~61행 그대로
  function bgImage(T, key) { … }     // 같음
  const sfx = (T, name, fb) => AudioFX.sfx(name) || fb && fb();
  const popSfx, sparkleSfx           // cinderella.js 67~68행 그대로
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);  // snow_white.js 69행
  function sparkle(T, x, y, r, n) { … }   // cinderella.js 73~83행 그대로 (마법 반짝)
  function mirrorFace(T, mx, my, r) { … } // §5-1 (snow_white.js 72~87행을 원형 클립으로)
  function snowfall(T, n = 14) { … }      // §5-3
  function namePlate(T, x, y) { … }       // §5-2
  async function run(T) { … }             // §3 장면 1~11
  Tale.mount({ title: '미녀와 야수', subtitle: '겉모습이 아니라 마음을 봐요', run: T => run(Tale.api) });
})();
```

`run(T)` 머리 부분(cinderella.js 113~143행과 같은 꼴):

```js
const { sleep, camSnap, tr } = T;
const say = async text => { await T.say(text); await sleep(500); };   // 대사 사이 숨 한 번
const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
const X = (l, p) => (P ? p : l);
const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...Object.keys(ASP).map(k => T.preload(artSrc(k)))];
await Promise.race([Promise.all(loads), sleep(4000)]);
// 배우
const belle  = mk(T, { stand: 'belle_stand', broom: 'belle_broom', point: 'belle_point', resolve: 'belle_resolve', sit: 'belle_sit',
                       worry: 'belle_worry', sleep: 'belle_sleep', run: 'belle_run', kneel: 'belle_kneel', joy: 'belle_joy' });
const beast  = mk(T, { stand: 'beast_stand', sit: 'beast_sit', ring: 'beast_ring', lie: 'beast_lie', eyes: 'beast_lie_eyes' });
const prince = mk(T, { stand: 'prince_stand' });
const father = mk(T, { stand: 'father_stand', ride: 'father_ride', eat: 'father_eat', sleep: 'father_sleep', shock: 'father_shock',
                       rose: 'father_rose', bed: 'father_bed', well: 'father_well' });
const sisa = mk(T, { pout: 'sisa_pout', plead: 'sisa_plead', gasp: 'sisa_gasp', joy: 'sisa_joy' });
const sisb = mk(T, { pout: 'sisb_pout', plead: 'sisb_plead', gasp: 'sisb_gasp', joy: 'sisb_joy' });
const horse = prop(T, 'horse_stand', 200);
const bush5 = prop(T, 'prop_bush5', 150), bush2 = prop(T, 'prop_bush2', 150);
const rose = prop(T, 'prop_rose', 50);
const vases = Array.from({ length: 3 }, () => prop(T, 'prop_rose_vase', 70));   // 위·아래·옆
const tableS = prop(T, 'prop_table_small', 110), tableL = prop(T, 'prop_table_long', 170);
const mirror = prop(T, 'prop_mirror', 200), ring = prop(T, 'prop_ring', 22), dream = prop(T, 'prop_dream', 150);
const spring = prop(T, 'prop_spring', 90), shine = prop(T, 'prop_glow', 220), hat = prop(T, 'prop_hat', 34);
const ALL = [belle, beast, prince, father, sisa, sisb, horse, bush5, bush2, rose, ...vases, tableS, tableL, mirror, ring, dream, spring, shine, hat];
ALL.forEach(hide);
T.director({ cast: { belle, beast, father, sisa, sisb, prince }, noFace: ['belle', 'beast', 'father', 'sisa', 'sisb', 'prince'] });
```

`T.director` 는 세로 화면에서만 말하는 사람에게 카메라를 붙인다(가로는 무대 전체가 보임). 방향은 장면에서 직접 정하므로 `noFace` 에 전부 넣는다.

## 2. 공통 수치

### 2-1. 무대·바닥·크기
- 무대 1000×560, 바닥 `FL = 528`. 배경 그림은 "아래 1/3 이 빈 땅"이라 발끝이 그 땅 위에 서게 된다. 배경을 받은 뒤 자동 재생 스크린샷에서 발이 벽에 떠 보이거나 땅에 묻히면 FL 을 ±15 안에서 조정한다(모든 장면이 같이 움직이므로 한 값만).
- 사람 서기 높이 기준: **벨 200px**(`hOf` 기본). 어른(아버지·왕자) 212, 언니들 206. 앉기·눕기 자세는 HT 로 머리 크기를 맞춘다(§2-2).
- 야수: 서기 **300px**(벨의 1.5배). 머리는 벨 머리의 약 1.3배가 되도록 그림 자체를 그 비율로 그렸다(프롬프트 HEAD SIZE). 받은 그림에서 재서 어긋나면 H 를 고친다(§2-2 공식).
- 왕자: 사람 기준으로 돌아간다(212). 말(혼자 선 그림) 200, 아버지+말 합친 그림(`father_ride`) 236(말 등 위에 앉은 아버지의 머리가 벨 머리와 같은 크기가 되게 HT 로 맞춘다).
- 소품 높이: 장미 한 송이 50, 꽃병 장미 70, 덤불 150, 작은 탁자 110, 긴 식탁 170, 거울 200, 반지 22, 꿈 풍선 150, 샘 90, 빛 220, 모자 34, 창문 카드 X(170, 96)(신데렐라 시계 카드와 같은 값).

### 2-2. 머리 맞춤(HT) 재는 법 — 사람은 모두 같은 머리 크기
post 가 끝나면 사람 그림마다 머리 높이(정수리~턱, px)와 그림 전체 높이를 잰다(PIL 로 머리 부분 bbox 를 찍거나 미리보기에서 눈대중 ±5%). 벨 서기 그림의 비율을 `hs/Hs`, 자세 그림의 비율을 `hp/Hp` 라 하면

`HT[자세] = 200 × (hs/Hs) ÷ (hp/Hp)`

- 서기 그림끼리는 이 값이 200 근처(어른은 212 근처)가 되어야 한다. 크게 벗어나는(±12% 밖) 그림은 머리가 다르게 그려진 것이므로 그 자세만 다시 생성한다.
- 앉기(`belle_sit`, `beast_sit`, `father_eat`, `father_sleep`)와 눕기(`belle_sleep`, `father_bed`, `beast_lie`, `beast_lie_eyes`)는 그림 높이가 작으므로 HT 가 작게 나온다(신데렐라 `cind_sit: 178`, `cind_cry: 165` 와 같은 식).
- 야수: `HT.beast_stand = 300`, 그 외 야수 자세는 `300 × (hb/Hb) ÷ (hp/Hp)` (hb = 야수 서기 머리). 야수 머리가 벨 머리의 1.3배인지 확인: `300·(hb/Hb) ≈ 1.3 × 200·(hs/Hs)` (±10%). 어긋나면 `HT.beast_stand` 를 그 비율로 바꾼다(키 1.5배보다 머리 1.3배가 우선).
- 확인은 §11 의 머리 크기 스크린샷 점검으로 한다.

### 2-3. 그림이 보는 쪽(NAT) — 뒤집기 규칙
`mk()` 는 `NAT[f]` 가 `'front'` 가 아니고 원하는 쪽과 다르면 좌우로 뒤집는다. 프롬프트대로 그려지면 다음과 같다(받은 그림이 반대로 왔으면 NAT 만 고친다. 그림을 뒤집어 저장하지 않는다).

| 그림 | NAT | 비고 |
|---|---|---|
| belle_point, belle_run, belle_kneel | right | |
| belle_worry | left | 거울(왼쪽)을 본다 |
| belle_sleep, father_bed, beast_lie, beast_lie_eyes | left | 머리가 왼쪽. 침대·눕기 그림은 절대 뒤집지 않는다(`turn` 을 부르지 않음) |
| beast_ring | left | |
| father_ride, horse_stand | right | 말은 오른쪽(도시 쪽)으로 간다 |
| 나머지 전부 | front | 앞모습은 뒤집지 않는다 |

### 2-4. 겹침 순서(z)
`put()` 은 `T.world` 맨 뒤(가장 앞)에 붙인다. 뒤에 있어야 하는 것을 먼저 `put` 한다. 식탁 뒤에 앉은 사람 = 사람 먼저 `put`, 식탁 나중. 덤불 뒤에서 나오는 야수 = `T.world.insertBefore(beast.pos, bush5.pos)`. 꿈 풍선 위의 야수 = 풍선 먼저, 야수 나중.

### 2-5. 세로 화면 규칙
- `P` 일 때 보이는 폭은 약 260(무대 단위). 한 컷에 **둘까지만** 보이게 좌표를 모으고(`X(l, p)` 의 p 값), 세 명 이상은 `camSnap(x)` 중심에서 ±130 밖에 두어 `director` 가 말할 때 데려온다.
- 고르기 카드·덤불·꽃병처럼 **아이가 눌러야 하는 것은 모두 한 화면(±130) 안**에 들어와야 한다. 각 놀이의 P 좌표는 §3 에 적었다.
- 카메라는 `camSnap`/`camTo` 의 y=280, z=1 로 고정(줌 아웃 금지: 배경 아래가 빈다).

### 2-6. 누르는 자리 크기
- 톡·고르기 대상은 화면에서 **짧은 변 60 무대 px 이상**. 꽃병(70×44)과 반지처럼 작은 것은 신데렐라 `hair` 처럼 그룹 안에 투명 원(`fill:'transparent'`, r 48)을 넣어 키운다. 투명 원은 조작이 끝나면 `remove()`.
- 톡 대상은 기다리는 동안 살짝 들썩인다(`pos.animate([{translate:'0 0'},{translate:'0 -5px'},{translate:'0 0'}], {duration: 900, iterations: 3})`, 신데렐라 호박과 같음).

## 3. 장면별 상세

표기: `L(x)` 가로, `P(x)` 세로 좌표. 대사는 §6 표의 `L번호`. 효과음 이름은 `sounds/sfx/` 파일명(§7). 모든 장면은 `await T.sceneCard(tr('이름'), () => { … }, focus.pos)` 로 넘어간다(1장만 `T.curtain(true)`). 책장 넘기기 전환은 엔진 기본.

### 장면 1. 가난해진 가족 (자동, 15초 안)
- 배경 `cottage`. 배치: 아버지 `stand` L330/P400 · 벨 `broom` L560/P520 · 큰언니 `pout` L760/P630 · 작은언니 `pout` L870/P700(둘 다 `FL+4`). P: `camSnap(520, 280, 1)`.
- 순서: `scene('cottage')` → 배치 → `await T.curtain(true)` → **L0** → **L1**(말하는 동안 아버지 `wiggle(4, 600)` 한 번) → 벨 `hop(10, 320)` + **L2** → 언니들 `hop(8, 300)` 둘 동시에 + `T.pop(언니 x 가운데, FL - 230, tr('힝…'))` + `sfx('womp', .4)` → `sleep(300)`.
- 언니들 대사는 없다(2장에서 말한다). 첫 조작이 30초 안에 나오게 하기 위해 이 장면은 대사 3줄뿐이다.

### 장면 2. 장미 한 송이만 (톡 1 — 첫 조작)
- `sceneCard(tr('장미 한 송이'))`, 배경 `cottage_front`. 배치(먼저 put 하는 순서대로): 작은언니 `plead` L200/P330(FL+6) · 큰언니 `plead` L300/P400(FL+4) · 벨 `point` L430/P470, `to:'right'` · 말 `horse` L640/P600, `to:'right'` · 아버지 `stand` L560/P540(말 앞, 오른쪽을 본다 — 앞모습이라 그대로). focus: 말. P: `camSnap(520)`.
- **L3** → 언니들 `hop(12, 360)` 차례로 + **L4**(큰언니·작은언니 두 클립이 이어진다) → 벨 `hop(8, 300)` + **L5** → 아버지 `hop(8, 300)` + **L6** → 아버지가 탄다: `hide(father); hide(horse); put(T, father, X(640, 600), FL, { look: 'ride', to: 'right' })`, `sfx('paper_up')`.
- 말 들썩임(§2-6) → **L7**(안내) → `await T.tap(father.pos, { prompt: '말을 톡 눌러 봐요.' })`.
- 톡 뒤: `AudioFX.sfx('step_grass')` 를 450ms 간격으로 6번(루프, 각 번 `father.hop(6, 420)`), `T.pop(father.x, FL - 260, tr('따각따각'))` 0ms 와 1300ms 두 번, 동시에 `father.move(1150, FL, 2800, 'linear')` 와 **L8**. 벨 `hop(10)`, 언니들 `wiggle(5, 500)`. `hide(father)`.
- 시작 버튼부터 톡까지 목표 30초(§11 로 잰다. 넘으면 L0 를 "옛날에 상인에게 딸이 셋 있었어요. 막내 벨은 마음이 고와서 모두 미녀라고 불렀어요."로 줄여 다시 녹음하지 말고 — 녹음은 그대로 두고 — L1 뒤 `sleep` 을 없애고 1장의 `hop` 들을 대사와 겹쳐 돌린다).

### 장면 3. 눈보라 속 궁전 (자동, 두 컷)
- 컷 A: `sceneCard(tr('눈보라 속 궁전'))`, 배경 `snow_forest`(밤·우상단 광원). `snowfall(T)`(§5-3) 를 켠다. 아버지 `ride` 를 L-150/P-150 에 두고 `to:'right'`. `sfx('blow_long', .4)`. **L9** 와 동시에 `father.move(X(480, 500), FL, 3200, 'linear')` + 600ms 마다 `hop(5, 400)`. 끝나면 `sleep(300)`, **L10**(말하는 동안 아버지 `hop(8)` 한 번: 불빛을 본다).
- 컷 B: `sceneCard(tr('궁전의 저녁상'))` 은 쓰지 않는다 — 같은 장면 안에서 **배경만** 바꾼다: `T.clear(); bgImage(T, 'dining'); camSnap(500, 280, 1)` 를 `await T.anim(페이드)` 없이 바로. (장면 카드 이름 수를 11장에 맞춘다.) 배치: 아버지 `eat` L560/P520 먼저, 긴 식탁 `tableL` L560/P520(FL+4) 나중(아버지가 식탁 뒤). 촛불은 식탁 그림에 있음.
- **L11**(두 마디: 부르는 소리 → 감사) → `sfx('chomp')` + `father.hop(8, 300)` + `T.pop(father.x, FL - 250, tr('냠냠!'))` 두 번(700ms 간격) → `fadeOut(father, 400)`; `hide(tableL)` 하지 말고 그대로 두고 아버지 `sleep`(안락의자째 그림) 를 L300/P420 에 `fadeIn` → `tint(T, '#1F2A56', .25)` 를 1000ms 로 서서히(`anim` opacity 0→.25) → `T.pop(father.x, FL - 230, tr('쿨쿨'))` + **L12** → `sleep(400)`.

### 장면 4. 장미 정원 (배움 놀이 1: 많고 적음, 2문제)
- `sceneCard(tr('장미 정원'))`, 배경 `garden`(낮). 배치: 덤불5 L330/P440, 덤불2 L690/P590, 둘 다 `FL - 10`; P 는 `s: .65`. 아버지 `stand` L880/P760(`to:'left'`). P: `camSnap(515)`.
- **L13** → 덤불 둘 `hop(8, 360)` 차례로.
- 문제 1(많음): **L14**(안내) → `await T.choose([{ el: bush5.pos, ok: true }, { el: bush2.pos, ok: false, onWrong: async () => { await bush2.wiggle(8, 360); await say('그 덤불은 장미가 두 송이예요. 적어요.'); } }], { prompt: '장미가 많은 덤불은 어느 쪽일까요?' })` → `glow(bush5, 1200); bush5.hop(14, 400); sparkleSfx(T); T.pop(bush5.x, FL - 190, tr('반짝!'))` → **L17**.
- 자리 바꾸기: `await Promise.all([bush5.move(bush2 자리, FL - 10, 900), bush2.move(bush5 자리, FL - 10, 900)])` + `sfx('swish')`.
- 문제 2(적음): **L18**(안내) → `choose` 에서 `ok` 는 bush2, 오답 bush5 의 `onWrong` 은 `wiggle` + **L16**("그 덤불은 장미가 다섯 송이예요. 많아요.") → 맞으면 `glow(bush2)`, `hop`, `sparkleSfx`, '반짝!' → **L19**.
- 엔진 규칙: 두 번째 틀리면 정답 덤불이 노랗게 빛나고 들썩인다(`choose` 기본). 틀린 횟수에 상관없이 넘어간다(게임오버 없음).
- 장미 꺾기(자동): 아버지가 덤불5(자리 바꾼 뒤 L690/P590 쪽) 옆으로 `move(bush5.x + 110, FL, 1200)`(P 는 `follow(bush5.x)`), **L20** 말하는 동안 장미 `rose` 를 `put(T, rose, bush5.x + 30, FL - 120)` → `rose.move(father.x - 28, FL - 108, 700)` → `hide(rose); father.look('rose')` + `sfx('pop')` + `T.pop(father.x, FL - 240, tr('톡!'))` → `sleep(500)`.

### 장면 5. 야수 (자동)
- `sceneCard(tr('야수'))`, 배경 `garden`. 배치: 덤불5 L330/P380(FL-10, P `s:.8`), 아버지 `rose` L700/P640, `to:'left'`(앞모습이라 그대로), 야수 `stand` 를 L430/P440 에 `y = FL + 40`, `opacity 0` 으로 두고 `T.world.insertBefore(beast.pos, bush5.pos)`(덤불 뒤). P: `camSnap(520)`.
- **L21**(말하는 동안): `beast.pos.animate([{opacity:0},{opacity:1}], {duration:1400, fill:'forwards'})` + `beast.move(beast.x, FL, 1400, 'ease-out')`, 0ms 와 700ms 에 `sfx('thud', .45)` + `T.pop(beast.x, FL - 330, tr('쿵'))`(두 번째는 x+40). 흔들림(`T.shake`) 없음.
- **L22** → 모자 떨어짐: `put(T, hat, father.x, FL - 212 + 12); father.look('shock'); hat.pos.animate([{translate:'0 0', rotate:'0deg'},{translate:'40px 200px', rotate:'70deg'}], {duration: 600, easing:'ease-in', fill:'forwards'})` + `sfx('paper_down')` + `T.pop(father.x + 40, FL - 40, tr('툭!'))` → **L23**(아버지 `wiggle(4, 500)`).
- **L24**(야수의 긴 대사: 큰 목소리지만 으르렁대지 않음, 화면 흔들림·효과음 없음. 말하는 동안 야수 `hop(6, 500)` 한 번만) → `sleep(500)`.

### 장면 6. 벨의 결심 (자동)
- `sceneCard(tr('벨의 결심'))`, 배경 `cottage`. 배치: 아버지 `rose` L380/P420 · 벨 `resolve` L560/P540 · 큰언니 `gasp` L740/P640(FL+4) · 작은언니 `gasp` L850/P710(FL+8). P: `camSnap(520)`.
- **L25** → 아버지 `wiggle(3, 600)` + **L26** → 벨 `hop(10, 320)` + **L27** → 아버지 `hop(8, 300)` + **L28** → 벨 `hop(12, 340)` + **L29** → `sleep(400)`.

### 장면 7. 궁전의 손님 (배움 놀이 2: 위·아래·옆, 3문제)
- 컷 A: `sceneCard(tr('궁전의 손님'))`, 배경 `garden`(왼쪽 끝 궁전 문 앞). 야수 `stand` L300/P380. 아버지 `stand` 와 벨 `stand` 를 L1100/P1000 에 두고 **L30** 과 함께 `father.move(X(650, 620), FL, 1800)`, `belle.move(X(520, 520), FL, 1800)`(동시, P 는 `follow(500, 1800)`). 둘 다 앞모습(야수 쪽은 왼쪽이지만 뒤집지 않음).
- 야수 `hop(6, 500)` + **L31** → 벨 `hop(8, 300)` + **L32** → **L33** → `sleep(400)`.
- 컷 B: `sceneCard(tr('벨의 방'))`, 배경 `room`. 배치: 작은 탁자 `tableS` L500/P470(FL). 꽃병 셋(`vases[0]`=위, `[1]`=아래, `[2]`=옆): 위 `(tableS.x, FL - 110 + 2)`(탁자 윗면 위), 아래 `(tableS.x, FL - 4)`(탁자 다리 사이, `s: .85`), 옆 `(tableS.x + 140 (P: +125), FL)`. z: 아래 꽃병 → 탁자 → 위 꽃병 → 옆 꽃병 순으로 put(아래 꽃병이 탁자 다리 사이로 보이게 탁자가 그 앞). 벨 `stand` L230/P330. 문패 `namePlate(T, X(800, 560), 240)`(§5-2). P: `camSnap(500)`.
- **L34**(말하는 동안 문패 `glow` 1500ms, 꽃병 셋 차례로 `hop(8, 300)`).
- 문제 순서 `['on','under','beside'].sort(() => Math.random() - .5)`. 문제마다: 안내 **L35/L36/L37** → `choose` 옵션은 꽃병 셋(각각 투명 원 r 48 추가, §2-6), 정답은 그 위치의 꽃병. 오답 `onWrong`: 그 꽃병 `wiggle(8, 360)` 뒤 그 꽃병의 자리 설명 **L38/L39/L40**(눌린 꽃병의 자리). 맞으면 `glow(정답, 1200); hop(14, 400); sparkleSfx; '반짝!'` → **L41/L42/L43** → `sleep(300)`.
- 프롬프트(12초 재안내)는 각 안내 문장 그대로. 세 문제가 끝나면 투명 원 제거, `sleep(400)`.

### 장면 8. 저녁마다 (배움 놀이 3: 아침·낮·밤 3장)
- `sceneCard(tr('저녁마다'))`, 배경 `dining`(밤·촛불). 배치: 벨 `sit` L440/P450 먼저 put, 야수 `sit` L700/P600 먼저 put, 긴 식탁 `tableL` L570/P525(FL+4) 나중(둘 다 식탁 뒤). 야수는 식탁 뒤에서도 머리가 크게 보인다. P: `camSnap(520)`.
- **L44** → 야수 `hop(6, 500)` + **L45** → 벨 `hop(8, 300)` + **L46** → **L47**(야수 `wiggle(3, 600)`) → **L48**.
- 카드 세 장: 신데렐라 시계 카드 코드(cinderella.js 368~377행)를 그대로 쓰되 그림은 `card_morning / card_noon / card_night`, `cardS = X(170, 96)`, `cardY = X(380, 360)`, `cardX = X([250, 500, 750], [396, 500, 604])`, 순서 무작위. 벨·야수 `pos.style.opacity = '.35'`. P: `camSnap(500, 250, 1)`.
- **L49**(안내) → 1단계 `choose`(정답 morning; 오답 noon `onWrong` = `wiggleEl` 뒤 **L50**, 오답 night = **L51**) → 정답 카드 `glow` + 하늘빛: `tint` 한 장을 `T.bg` 맨 위에 만들어 두고 색을 `#F2B366`, opacity 0→.22→0 (1200ms) → **L52**("맞아요, 아침! 아침 다음은?").
- 2단계: 아침 카드는 `style.opacity='.35'` 로 흐리게 두고 옵션에서 뺀다. `choose`(정답 noon; 오답 night = **L53**) → `glow` + 하늘빛 `#F6ECD8` 0→.3→0 → **L54**("맞아요, 낮! 낮 다음은?").
- 3단계: 남은 밤 카드 하나는 `await T.tap(nightCard.g, { prompt: '창밖은 아침, 낮, 밤으로 바뀌어요. 아침부터 차례로 눌러 봐요.' })` 로 받는다(고르기 아님). 1·2단계 `choose` 의 `prompt` 도 같은 L49 문장(녹음이 있는 문장만 prompt 로 쓴다). → `glow` + 하늘빛 `#1F2A56` 0→.35 로 올리고 **그대로 둔다**(밤) → **L55**.
- 카드 셋 `opacity 1→0` 400ms 뒤 `remove()`, 벨·야수 opacity 되돌림, `sleep(400)`.

### 장면 9. 거울과 반지 (자동)
- `sceneCard(tr('거울과 반지'))`, 배경 `room` + `tint(T, '#1F2A56', .35)`(밤). 배치: 거울 `mirror` L300/P380(FL) · 벨 `worry` L470/P500(`to:'left'`) · 야수 `ring` L700/P650(`to:'left'`) · 작은 탁자 `tableS` L880/P800. `mf = mirrorFace(T, mirror.x, FL - 200 * .6, 58)`(§5-1). P: `camSnap(520)`.
- **L56**(말하는 동안 `sfx('sparkle'); mf.show()` — 거울 속에 침대에 누운 아버지가 떠오른다) → 벨 `wiggle(3, 500)` + **L57** → 야수 `hop(6, 500)` + **L58** → 반지: `put(T, ring, beast.x - beast.w * .38, FL - beast.h * .42)`(야수 발 위; 그림을 보고 손끝 좌표를 맞춘다), `fadeIn(ring)`, **L59** 말하는 동안 `ring.move(belle.x + 22, FL - 100, 900)` + `glow(ring, 1200)` + `sparkleSfx` → `mf.hide()` → **L60** → `hide(ring)`(벨이 가진 것으로 침) → `sleep(400)`.

### 장면 10. 집에서 늦어진 날들 (자동)
- `sceneCard(tr('집에서'))`, 배경 `cottage`. 배치: 아버지 `well` L330/P400 · 벨 `stand` L520/P520 · 큰언니 `plead` L700/P640(FL+4) · 작은언니 `plead` L800/P720(FL+8). P: `camSnap(520)`.
- **L61** → 아버지 `hop(10, 320)` + **L62** → 언니들 `hop(10, 340)` 차례로 + **L63**(두 클립) → 벨 `wiggle(3, 500)` + **L64**.
- 해가 뜨고 짐(**L65** 과 동시에, 약 5초): `T.bg` 에 `circle r 28 fill '#F2B366'` 를 만들고 `animate` 로 `translate(120px,170px) → (500px,50px) → (880px,170px)` 를 1300ms 씩 3번(`iterations: 3`), 사이사이 `tint '#1F2A56'` opacity 0→.35→0 를 같은 주기로 3번(밤이 세 번 지나감). 세 번째 끝에 tint 를 .35 로 고정(밤). 가족 셋 `fadeOut(400)`, 벨 `fadeOut` 뒤 `put(T, belle, X(520, 500), FL + 6, { look: 'sleep' })`(침대째 그림) `fadeIn`, `T.pop(belle.x - 60, FL - 150, tr('새근새근'))`. 작은 탁자 `tableS` 를 L720/P610 에 `fadeIn`.
- 꿈: `put(T, dream, belle.x + X(170, 110), FL - 250)` `fadeIn(600)`, 그 위에 `put(T, beast, dream.x, dream.y - 45, { look: 'lie', s: .38 })` `fadeIn(600)`(풍선 안, 클립 없음 — 풍선 h150·w≈200 안에 들어가는 크기). `sfx('xylo_down', .5)`.
- **L66**(벨이 깬다: `hide(dream); hide(beast); put(T, belle, X(560, 520), FL, { look: 'worry', to: 'right' })`, `fadeIn`) → 반지: `put(T, ring, belle.x + 22, FL - 100)` `fadeIn` → `ring.move(tableS.x, FL - 110 + 4, 900)` + `sparkle(T, tableS.x, FL - 120, 60, 8)` → 벨 다시 `sleep` 그림(`put` + `fadeIn`) + **L67** → `sleep(600)`.

### 장면 11. 샘가의 야수 (톡 2 — 마지막 인사형 톡)
- `sceneCard(tr('샘가의 야수'))`, 배경 `garden`(낮). 배치: 덤불5 L780/P700(FL-10) · 야수 `lie` L720/P640(FL, 머리 왼쪽, 덤불 앞) · 샘 `spring` L520/P460(FL+10) · 벨 `run` L-120/P-120(`to:'right'`). P: `camSnap(500)`.
- **L68**(동시에 `belle.move(X(430, 400), FL, 2000, 'ease-out')` + `sfx('step_grass')` 2번, P 는 `follow(460)`) → `belle.look('kneel', 'right')` + **L69**.
- 샘 들썩임(§2-6) → **L70**(안내) → `await T.tap(spring.pos, { prompt: '샘물을 톡 눌러 봐요.' })`.
- 톡 뒤: 물방울 5개(§5-4) 벨의 손(`belle.x + 40, FL - 85`)에서 야수 얼굴(`beast.x - beast.w * .3, FL - 60`)로, `sfx('splash', .5)`, `T.pop(beast.x - 60, FL - 170, tr('똑똑!'))` → 700ms 뒤 `beast.look('eyes')` + `glow(beast, 1000)` + `sfx('sparkle')` → **L71** → 벨 `hop(8, 300)` + **L72**.
- 변신: `put(T, shine, beast.x - 40, FL - 10)` 를 `T.world.insertBefore(shine.pos, beast.pos)`, `fadeIn(500)`, `shine.body.animate(scale .9↔1.08, 1400ms, Infinity)` + `AudioFX.sting('magic')`(없으면 `sparkleSfx`) + `sparkle(T, beast.x - 40, FL - 120, 160, 18)` → `await T.anim(beast.pos, [{opacity:1},{opacity:0}], 500); hide(beast)` → `put(T, prince, X(680, 600), FL, { look: 'stand' })` `fadeIn(500)`, `glow(prince, 1400)` → **L73** → `belle.look('joy')` 벨을 `put(T, belle, X(480, 450), FL, { look: 'joy' })` → 왕자 `hop(8)` + **L74** → **L75** → `fadeOut(shine, 600)`.
- 가족: 아버지 `well` L-100/P-100, 큰언니 `joy`, 작은언니 `joy` 를 왼쪽 밖에 두고 **L76** 과 함께 `father.move(X(160, 300), FL, 1600)`, `sisa.move(X(260, 350), FL + 4, 1800)`, `sisb.move(X(340, 395), FL + 8, 2000)`(P: `T.camTo(430, 280, 1, 1200)` 뒤 **L77** 전에 `T.camTo(520, 280, 1, 800)`).
- **L77** → `T.confetti(); sfx('tada', () => sparkleSfx(T));` 모두 `hop(16~20, 460)` → **L78**(교훈) → `T.finale(); await sleep(1500); return '겉모습이 아니라 마음을 봐요.';`
- 이 동화의 **마지막 인사형 톡은 샘물 톡**이다. 끝에 따로 인사 톡을 두지 않는다(PLAN 조작 요약: 톡 2번).

## 4. 배움 놀이 규칙 요약 (엔진 `T.choose`)
- 정답 위치를 먼저 알려 주지 않는다. 12초 무입력이면 `prompt` 문장을 다시 읽는다. 1회 오답 → `onWrong`(흔들림 + 자리/수 설명). 2회 오답부터 정답이 노랗게 빛나며 들썩이고 나머지는 흐려진다(엔진). 정답을 누르면 `AudioFX.ding()`.
- 오답 설명 뒤 바로 다시 고를 수 있다(엔진 `locked` 해제). 게임오버 없음.
- 세 놀이 모두 줄거리와 무관하다(장미 꺾기·방 구경·식사 장면 사이에 끼운 배움).
- 4장: 2문제(많음 → 적음), 자리를 바꿔 위치로 외우지 못하게 한다. 7장: 3문제 무작위 순서. 8장: 차례 누르기(1단계 3지선다, 2단계 2지선다, 3단계는 톡).

## 5. 코드로 그리는 것 (그림 없이)

### 5-1. 거울 속 아버지 `mirrorFace(T, mx, my, r)`
snow_white.js 72~87행을 복사하되 타원 대신 원(`circle r`), 그림은 `father_bed`(침대째 누운 그림)를 폭 `r * 1.7` 로 넣고 중심 `(mx, my + r * .15)`. 은빛 파문 `ring` 은 `circle r + 4, stroke '#DCE3EE'`. `show()` 는 파문 3번 + 1600ms 페이드인, `hide()` 는 700ms 페이드아웃. `my` 는 거울 그림의 유리 중심에 맞춘다(거울 h200 기준 `FL - 120` 근처, 받은 그림을 보고 ±15 조정).

### 5-2. 문패 `namePlate(T, x, y)`
```js
const g = T.paper(T.world, [['rect', { x: -72, y: -26, width: 144, height: 52, rx: 9, fill: '#F6ECD8' }],
                            ['rect', { x: -64, y: -18, width: 128, height: 36, rx: 6, fill: 'none', stroke: '#6B4A32', 'stroke-width': 3 }]], { transform: `translate(${x},${y})` });
T.el('text', { x: 0, y: 9, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 800, fill: '#A93B32',
  'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: tr('벨의 방') }, g);
return { g, glow: ms => { g.style.filter = 'url(#hintGlow)'; setTimeout(() => { g.style.filter = ''; }, ms); } };
```
영어 모드는 `tr('벨의 방')` → "Belle's Room"(`ui`). 글자가 판을 넘으면 `font-size` 20.

### 5-3. 눈 `snowfall(T, n = 14)`
snow_white.js 꽃잎(533~538행)과 같은 방식. `T.world` 에 `circle r 4~7 fill '#F4F6FA' opacity .9` 를 x = 40 + i·70, y = -30 에 만들고 `animate([{transform:'translate(0,0)'},{transform:'translate(-40px,640px)'}], {duration: 5200 + (i % 4) * 900, delay: i * 180, iterations: Infinity, easing: 'linear'})`. 장면이 바뀌면 `T.clear()` 가 지운다.

### 5-4. 물방울 (11장)
`circle r 5 fill '#BFD8EE'` 5개를 벨의 손 위치에 만들고 i·90ms 지연으로 `animate` translate → 야수 얼굴 위치(중간 키프레임 y -40 으로 포물선), 520ms `ease-in`, 끝나면 `remove()`.

### 5-5. 해와 밤 (10장)
§3 장면 10 참고. 해 원은 `T.bg` 에(인물 뒤), tint 도 `T.bg`. 세 번 지난 뒤 밤 tint .35 유지.

## 6. 대사 전체 (voice_script_el.json 과 글자 하나까지 같다)
- `say()` 에 넘기는 한국어 문장은 아래 표의 문장과 **정확히** 같아야 녹음이 붙는다(한 글자라도 다르면 Typecast 클립이 없으므로 기계음도 없이 조용히 넘어간다 → §11 의 `_audio.json` 으로 빠짐을 잡는다).
- 배역 이름: nar(해설) belle beast father sisa(큰언니) sisb(작은언니) prince. 왕자는 야수와 같은 목소리(George)를 일부러 쓴다(변신한 같은 사람).
- 한 줄에 두 배역(L4, L63)은 말풍선 한 줄에 클립 두 개가 이어진다(엔진 지원).
- 목소리: nar Huelyn · belle Yun · beast/prince George · father Namchun · sisa Chaemong · sisb Laura. 모델 eleven_v4. settings 는 JSON 참조.
- 톡 안내 줄(L7, L70)과 고르기 안내 줄은 `say()` 로 읽은 뒤 같은 문장을 `prompt` 로 넘긴다(12초 재안내).

| # | 장면 | 배역 | 한국어 (`say()`에 넘기는 문장 그대로) | 영어 | 쓰임 |
|---|---|---|---|---|---|
| L0 | 1 | 해설 | 옛날에 상인에게 딸이 셋 있었어요. 막내 벨은 마음이 고와서 모두 '미녀'라고 불렀어요. | Once upon a time, a merchant had three daughters. The youngest, Belle, was so kind-hearted that everyone called her Beauty. |  |
| L1 | 1 | 해설 | 어느 날 배들이 가라앉아, 가족은 시골 작은 집으로 갔어요. | One day his ships sank, and the family moved to a small cottage in the countryside. |  |
| L2 | 1 | 벨 | 괜찮아요, 제가 집안일을 할게요. | It's all right. I will do the housework. |  |
| L3 | 2 | 해설 | 배 한 척이 돌아왔대요! 아버지가 도시로 떠나요. | One of the ships came back! Father is leaving for the city. |  |
| L4 | 2 | 큰언니+작은언니 | 비단옷이요! 반지랑 리본도요! | A silk dress for me! And rings and ribbons too! |  |
| L5 | 2 | 벨 | 저는 장미 한 송이면 돼요. | A single rose is all I need. |  |
| L6 | 2 | 아버지 | 그래, 다녀오마. | All right. I will be back soon. |  |
| L7 | 2 | 해설 | 말을 톡 눌러 봐요. | Tap the horse. | 톡 안내 |
| L8 | 2 | 해설 | 따각따각, 아버지가 도시로 떠났어요. | Clip-clop, clip-clop. Father rode off to the city. |  |
| L9 | 3 | 해설 | 그런데 배의 짐은 남의 것이 되어, 아버지는 빈손으로 돌아오다 눈보라에 길을 잃었어요. | But the ship's goods now belonged to someone else. Father came home empty-handed and lost his way in a snowstorm. |  |
| L10 | 3 | 해설 | 멀리 불빛! 커다란 궁전에 아무도 없고, 따뜻한 저녁상만 차려져 있었어요. | A light far away! In a huge palace there was no one at all, only a warm supper laid out on the table. |  |
| L11 | 3 | 아버지 | 누구 계세요? …고맙게 먹겠습니다. | Is anyone here? ... Thank you, I will gladly eat. |  |
| L12 | 3 | 해설 | 아버지는 배불리 먹고, 푹신한 의자에서 잠이 들었어요. | Father ate his fill and fell asleep in a soft armchair. |  |
| L13 | 4 | 해설 | 아침이 되자 눈 속에 장미가 활짝 피어 있었어요! | In the morning, roses were blooming in the snow! |  |
| L14 | 4 | 해설 | 장미가 많은 덤불은 어느 쪽일까요? | Which bush has MORE roses? | 고르기 1 안내 |
| L15 | 4 | 해설 | 그 덤불은 장미가 두 송이예요. 적어요. | That bush has two roses. That is fewer. | 오답(2송이 덤불) |
| L16 | 4 | 해설 | 그 덤불은 장미가 다섯 송이예요. 많아요. | That bush has five roses. That is more. | 오답(5송이 덤불) |
| L17 | 4 | 해설 | 맞아요, 다섯 송이! 장미가 많아요. | That's right, five roses! That bush has more. |  |
| L18 | 4 | 해설 | 자리를 바꿨어요. 장미가 적은 덤불은 어느 쪽일까요? | They switched places! Which bush has FEWER roses? | 고르기 2 안내 |
| L19 | 4 | 해설 | 맞아요, 두 송이! 장미가 적어요. | That's right, two roses! That bush has fewer. |  |
| L20 | 4 | 아버지 | 벨에게 줄 장미 한 송이만. | Just one rose, for Belle. |  |
| L21 | 5 | 해설 | 그때 덤불 뒤에서 커다란 야수가 천천히 나왔어요. | Then, from behind the bush, a huge Beast slowly came out. |  |
| L22 | 5 | 야수 | 내 장미를 꺾었구나. 재워 주고 먹여 줬는데. | You picked my rose. After I gave you a bed and a meal. |  |
| L23 | 5 | 아버지 | 죄송해요, 나리. 막내딸이 부탁한 거예요. | I am sorry, my lord. My youngest daughter asked for it. |  |
| L24 | 5 | 야수 | 나리가 아니라 야수라고 불러라. 장미를 꺾었으니 벌을 받아야 해. 네가 돌아오든지, 딸 하나가 스스로 오든지. | Do not call me lord. Call me Beast. You picked my rose, so you must be punished. Either you come back, or one of your daughters comes here of her own free will. |  |
| L25 | 6 | 해설 | 아버지는 장미를 들고 집으로 돌아왔어요. | Father came home holding the rose. |  |
| L26 | 6 | 아버지 | 야수가… 딸 하나를 보내라고 했단다. | The Beast... said one of my daughters must go to him. |  |
| L27 | 6 | 벨 | 제 장미 때문이에요. 제가 갈게요. | It is because of my rose. I will go. |  |
| L28 | 6 | 아버지 | 안 된다, 벨. | No, Belle. |  |
| L29 | 6 | 벨 | 괜찮아요. 제가 가고 싶어요. | It's all right. I want to go. |  |
| L30 | 7 | 해설 | 아버지는 벨을 궁전까지 데려다주었어요. | Father brought Belle all the way to the palace. |  |
| L31 | 7 | 야수 | 스스로 온 거니? | Did you come here of your own free will? |  |
| L32 | 7 | 벨 | 네. | Yes. |  |
| L33 | 7 | 야수 | 착하구나. 아버지는 내일 아침 집으로 가거라. | You are a good girl. Your father shall go home tomorrow morning. |  |
| L34 | 7 | 해설 | 방 문에 '벨의 방'이라고 쓰여 있어요. 책도 많고, 장미도 있어요. | On the door it says 'Belle's Room'. There are lots of books, and roses too. |  |
| L35 | 7 | 해설 | 탁자 위에 있는 장미를 찾아봐요. | Find the rose ON the table. | 고르기 안내(위) |
| L36 | 7 | 해설 | 탁자 아래에 있는 장미를 찾아봐요. | Find the rose UNDER the table. | 고르기 안내(아래) |
| L37 | 7 | 해설 | 탁자 옆에 있는 장미를 찾아봐요. | Find the rose BESIDE the table. | 고르기 안내(옆) |
| L38 | 7 | 해설 | 그건 탁자 위예요. | That one is on the table. | 오답 |
| L39 | 7 | 해설 | 그건 탁자 아래예요. | That one is under the table. | 오답 |
| L40 | 7 | 해설 | 그건 탁자 옆이에요. | That one is beside the table. | 오답 |
| L41 | 7 | 해설 | 맞아요, 탁자 위! | That's right, on the table! |  |
| L42 | 7 | 해설 | 맞아요, 탁자 아래! | That's right, under the table! |  |
| L43 | 7 | 해설 | 맞아요, 탁자 옆! | That's right, beside the table! |  |
| L44 | 8 | 해설 | 저녁마다 야수가 찾아왔어요. | Every evening, the Beast came to see her. |  |
| L45 | 8 | 야수 | 벨, 잘 지냈니? 나와 결혼해 줄래? | Belle, how are you? Will you marry me? |  |
| L46 | 8 | 벨 | 아니요, 야수님. 하지만 친구로 좋아해요. | No, Beast. But I like you very much as a friend. |  |
| L47 | 8 | 야수 | 그럼 내일 저녁에 또 올게. | Then I will come again tomorrow evening. |  |
| L48 | 8 | 해설 | 벨은 날마다 친절하게 대답했고, 둘은 친구가 되었어요. | Belle answered kindly every day, and the two became friends. |  |
| L49 | 8 | 해설 | 창밖은 아침, 낮, 밤으로 바뀌어요. 아침부터 차례로 눌러 봐요. | Outside the window it turns morning, day, and night. Tap them in order, starting with morning. | 고르기 안내 |
| L50 | 8 | 해설 | 그건 낮이에요. 아침은 어디일까요? | That is daytime. Where is the morning? | 오답 |
| L51 | 8 | 해설 | 그건 밤이에요. 아침은 어디일까요? | That is night. Where is the morning? | 오답 |
| L52 | 8 | 해설 | 맞아요, 아침! 아침 다음은? | That's right, morning! What comes after morning? |  |
| L53 | 8 | 해설 | 그건 밤이에요. 아침 다음은? | That is night. What comes after morning? | 오답 |
| L54 | 8 | 해설 | 맞아요, 낮! 낮 다음은? | That's right, daytime! What comes after daytime? |  |
| L55 | 8 | 해설 | 맞아요, 밤! 아침, 낮, 밤. 하루가 이렇게 지나가요. | That's right, night! Morning, day, night. That is how a day goes by. |  |
| L56 | 9 | 해설 | 어느 날, 벨은 거울로 집을 보았어요. | One day, Belle looked at her home through the magic mirror. |  |
| L57 | 9 | 벨 | 아버지가 아파요… | Father is ill... |  |
| L58 | 9 | 야수 | 다녀와요. 하지만 일주일 뒤엔 꼭 돌아와요. 안 오면 나는 너무 슬플 거예요. | Go to him. But come back in one week, without fail. If you do not, I will be so very sad. |  |
| L59 | 9 | 야수 | 자기 전에 이 반지를 탁자에 놓으면, 아침에 여기로 돌아와요. | Put this ring on the table before you sleep, and in the morning you will be back here. |  |
| L60 | 9 | 벨 | 꼭 돌아올게요, 약속해요. | I will come back. I promise. |  |
| L61 | 10 | 해설 | 다음 날 아침, 벨은 집에 와 있었어요. | The next morning, Belle was home. |  |
| L62 | 10 | 아버지 | 네 덕분에 다 나았다. | Thanks to you, I am all better. |  |
| L63 | 10 | 큰언니+작은언니 | 조금만 더 있다 가. 응? 조금만 더. | Stay just a little longer. Please? Just a little. |  |
| L64 | 10 | 벨 | 그럴까… | Maybe I could... |  |
| L65 | 10 | 해설 | 해가 뜨고 지고, 일주일이 훌쩍 지났어요. 어느 밤, 벨은 꿈을 꾸었어요. | The sun rose and set, and a whole week slipped by. One night, Belle had a dream. |  |
| L66 | 10 | 벨 | 야수님! 약속을 어겼어요. 돌아가야 해요. | Beast! I broke my promise. I must go back. |  |
| L67 | 10 | 해설 | 벨은 반지를 탁자에 놓고 다시 잠이 들었어요. | Belle put the ring on the table and fell asleep again. |  |
| L68 | 11 | 해설 | 아침이 되자 벨은 궁전 정원에 있었어요. 야수는 샘가에 힘없이 누워 있었어요. | In the morning, Belle was in the palace garden. The Beast lay by the spring, weak and still. |  |
| L69 | 11 | 벨 | 야수님, 일어나요! | Beast, wake up! |  |
| L70 | 11 | 해설 | 샘물을 톡 눌러 봐요. | Tap the spring water. | 톡 안내(마지막 톡) |
| L71 | 11 | 야수 | 벨… 돌아왔구나. | Belle... you came back. |  |
| L72 | 11 | 벨 | 사랑해요, 야수님. 제 남편이 되어 주세요. | I love you, Beast. Please be my husband. |  |
| L73 | 11 | 해설 | 그러자 반짝! 야수가 멋진 왕자님으로 변했어요. | And then, a flash of light! The Beast turned into a handsome prince. |  |
| L74 | 11 | 왕자 | 고마워요, 벨. 겉모습만 보지 않고 내 마음을 봐 줬어요. | Thank you, Belle. You did not judge me by my looks. You saw my heart. |  |
| L75 | 11 | 왕자 | 요정이 건 마법이 이제 풀렸어요. | The fairy's spell is broken at last. |  |
| L76 | 11 | 해설 | 아버지와 언니들도 달려왔어요. | Father and her sisters came running too. |  |
| L77 | 11 | 해설 | 모두 함께 궁전에서 행복하게 살았어요. | And they all lived happily together in the palace. |  |
| L78 | 11 | 해설 | 겉모습이 아니라 마음을 봐요. | Look at the heart, not the looks. | 교훈 (run() 반환 문구와 같다) |

## 7. 효과음 (sounds/sfx/<이름>.mp3, `AudioFX.sfx(name, vol)`)

| 장면 | 순간 | 이름 | 비고 |
|---|---|---|---|
| 1 | 언니들 뾰로통 | `womp` (.4) | 팝 '힝…' |
| 2 | 아버지가 말에 탐 | `paper_up` | |
| 2 | 말 출발 | `step_grass` ×6 (450ms) | 팝 '따각따각' 2번 |
| 3 | 눈보라 | `blow_long` (.4) | 눈 내림과 함께 |
| 3 | 식사 | `chomp` ×2 | 팝 '냠냠!' |
| 3 | 잠듦 | (없음) | 팝 '쿨쿨' |
| 4 | 정답 | `sparkle` (없으면 tone 700→1400) | 팝 '반짝!' + 엔진 `ding` |
| 4 | 자리 바꾸기 | `swish` | |
| 4 | 장미 꺾기 | `pop` | 팝 '톡!' |
| 5 | 야수 등장 | `thud` (.45) ×2 | 팝 '쿵' ×2, `T.shake` 금지 |
| 5 | 모자 떨어짐 | `paper_down` | 팝 '툭!' |
| 7·8 | 정답 | `sparkle` | 팝 '반짝!' |
| 9 | 거울 | `sparkle` | 파문과 함께 |
| 9·10 | 반지 | `sparkle` (`sparkle()` 함수가 울림) | |
| 10 | 꿈 | `xylo_down` (.5) | |
| 11 | 달려옴 | `step_grass` ×2 | |
| 11 | 물 뿌림 | `splash` (.5) | 팝 '똑똑!' |
| 11 | 눈 뜸 | `sparkle` | |
| 11 | 변신 | `AudioFX.sting('magic')` → 없으면 `sparkle` | |
| 11 | 끝 | `tada` + `T.confetti()` | |
| 전환 | 책장 넘기기 | 엔진 기본 (`page_turn`) | |
| 톡·고르기 | 누름/정답/오답 | 엔진 `AudioFX.tap/ding/miss` | |

말(馬)·거울·반지·촛불에는 목소리나 얼굴이 없다. 말 울음 녹음은 없으므로 넣지 않는다(동물 소리 폴더에 horse 없음).

## 8. 카탈로그 항목 (`tales/catalog.js`, `snow_white` 항목 바로 뒤)

```js
  { id: 'beauty_beast', title: '미녀와 야수', origin: 'world', also: ['princess'], skills: ['size', 'position', 'order'], ready: false, making: true,
    line: '장미가 많은 덤불과 적은 덤불, 탁자 위·아래·옆, 아침·낮·밤. 겉모습이 아니라 마음을 봐요.',
    en: { title: 'Beauty and the Beast', line: 'More or fewer roses, on, under and beside the table, morning, noon and night. Look at the heart, not the looks.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.sn}"/><rect y="60" width="160" height="10" fill="${c.gy}"/>
      <circle cx="108" cy="38" r="9" fill="${c.bk}"/><circle cx="136" cy="38" r="9" fill="${c.bk}"/>
      <rect x="96" y="52" width="52" height="40" rx="18" fill="${c.bk}"/><rect x="108" y="66" width="28" height="26" rx="8" fill="${c.ind}"/>
      <circle cx="122" cy="46" r="20" fill="${c.bk}"/><ellipse cx="122" cy="54" rx="9" ry="6" fill="${c.sk}"/>${eye(115, 44, 2.6)}${eye(129, 44, 2.6)}
      <path d="M36 92 L42 60 Q52 54 62 60 L68 92Z" fill="${c.pn}"/><rect x="46" y="70" width="12" height="22" fill="${c.cr}"/>
      <circle cx="52" cy="48" r="12" fill="${c.bk}"/><circle cx="52" cy="51" r="9" fill="${c.sk}"/><circle cx="62" cy="40" r="3" fill="${c.gd}"/>${eye(49, 51, 1.4)}${eye(55, 51, 1.4)}
      <path d="M78 92 v-22" stroke="${c.pn}" stroke-width="2.5"/><circle cx="78" cy="64" r="7" fill="${c.rd}"/><circle cx="78" cy="64" r="3" fill="#C8524A"/></g>` },
```
- `skills` 는 최대 3개라 `heart` 는 달지 않는다(확정). `position` 칩은 `hideUnused` 라 이 항목이 생기면 홈에 칩이 나타난다.
- 썸네일 `art` 는 `_tile.webp`(§9)가 생기면 홈에서 타일이 우선한다(`TILES`).

## 9. 썸네일·키아트 (그림이 다 나온 뒤)

| 결과 파일 | 원본 | 만드는 법 |
|---|---|---|
| `assets/thumbs/beauty_beast_key_wide.webp` (1672×941) | `assets/raw/keyart_gpt/beauty_beast_wide_v5.png` | PIL: RGB 변환 → 16:9 가운데 자르기 → 1672×941 리사이즈 → webp quality 86 (`back_to_webp.py` 와 같은 식) |
| `…_key_tall.webp` (1086×1448) | `…_tall_v5.png` | 3:4 가운데 자르기 → 1086×1448 |
| `…_tile.webp` (720×540) | `…_tile_v5.png` | 4:3 가운데 자르기 → 720×540. `tools/app/make_tiles.py` 는 쓰지 않는다(그 스크립트는 합성 타일용). `assets/thumbs/tiles.js` 의 `TILES` 에 `'beauty_beast'` 추가 |
| `…_back_wide.webp` (1200×800) · `…_back_tall.webp` (1000×1150) | `…_backw_v5.png` · `…_backt_v5.png` | `~/.venvs/paper-tale/bin/python tools/app/gen/back_to_webp.py beauty_beast` |
| `assets/thumbs/thumbs.js` | — | `THUMBSKEY` 에 `"beauty_beast"` 추가, `THUMBSKEYLIGHT["beauty_beast"] = "#f5efe9"`, `BACKACCENT["beauty_beast"] = "#A93B32"`(끝 화면 리본: Bean Red). `make_thumbs.py` 를 돌리면 KEYS 는 자동이지만 BACKACCENT 는 그 파일의 표(75행)에도 넣어야 다음 실행에서 안 사라진다. |

키아트 참고 그림은 작업표의 `refs`(벨 서기·야수 서기·장미·덤불 / 끝 화면은 벨 기쁨·왕자·아버지 기운·언니들 기쁨)라 **인물 스프라이트가 모두 나온 뒤** 맨 마지막에 생성한다.

## 10. 그림 목록 (작업표 `jobs_beauty_beast.json` 59장과 같다)

| 구분 | id (`assets/v3w/bb_<id>.webp`) | 설명·방향 | 작업표 크기 | 장면 |
|---|---|---|---|---|
| 인물·벨 | belle_stand (기준) | 앞모습, 손 내림 | 600² | 7, 10, 11 |
| | belle_broom / point(→) / resolve / sit(의자째) / worry(←) / sleep(침대째, 머리 왼쪽) / run(→) / kneel(→) / joy | | 600² (sleep 780×420) | 1 / 2 / 6 / 8 / 9·10 / 10 / 11 / 11 / 11 |
| 인물·야수 | beast_stand (기준, 벨 참고 머리 1.3배) | 앞모습, 송곳니·발톱 없음 | 600² | 5, 7 |
| | beast_sit(의자째) / ring(←, 반지 내밈) / lie(눈 감음, 머리 왼쪽) / lie_eyes(눈 뜸) | | 600² / 600² / 840×480 / 840×480 | 8 / 9 / 10·11 / 11 |
| 인물·왕자 | prince_stand | 남색 망토, 작은 관, 큰 눈 | 600² | 11 |
| 인물·아버지 | father_stand (기준) | 모자 | 600² | 2, 4, 7 |
| | father_ride(말과 한 그림, →) / eat(의자째, 모자 없음) / sleep(안락의자째) / shock(모자 없음) / rose(장미 쥠) / bed(침대째) / well(손 흔듦) | | 600² (bed 780×420) | 2·3 / 3 / 3 / 5 / 4·5·6 / 9(거울 속) / 10·11 |
| 인물·언니 | sisa_pout (기준) · sisb_pout (기준) | 자주 옷·높은 머리 / 연두 옷·곱슬 | 600² | 1 |
| | sisa/sisb × plead · gasp · joy | | 600² | 2·10 / 6 / 11 |
| 동물 | horse_stand (→) | 갈색 말, 보따리 | 600² | 2 |
| 소품 | prop_rose / prop_rose_vase(×3 배치) / prop_bush5 / prop_bush2 | 얼굴 없음 | 300×480 / 300×480 / 600×480 / 600×480 | 4 / 7 / 4·5·11 / 4 |
| | prop_table_small / prop_table_long(촛불 포함) | | 600×420 / 1020×420 | 7·9·10 / 3·8 |
| | card_morning / card_noon / card_night | 창틀 카드 3장 | 500² | 8 |
| | prop_mirror / prop_ring / prop_dream / prop_spring / prop_glow / prop_hat | | 480×600 / 300² / 720×540 / 720×360 / 600² / 360×240 | 9 / 9·10 / 10 / 11 / 11 / 5 |
| 배경 | bg_cottage / bg_cottage_front / bg_snow_forest(밤, 우상단) / bg_dining(밤, 우상단) / bg_garden(왼쪽 끝 궁전 문) / bg_room(오른쪽 문, 빈 문패) | 1600×902 | | 1·6·10 / 2 / 3 / 3·8 / 4·5·7·11 / 7·9 |
| 키 | key5_wide · key5_tall · key5_tile · key5_backw · key5_backt | 시작 화면·홈 카드·끝 화면 | 16:9 · 3:4 · 4:3 · 3:2 · 4:5 | — |

생성 순서(참고 그림 의존): `pass 1` belle_stand, horse_stand → `pass 2` beast_stand, father_stand, sisa_pout, sisb_pout, prince_stand, prop_rose_vase, prop_bush5, card_noon, card_night → `pass 3` 나머지 자세, prop_bush2 → `pass 4` beast_lie_eyes → 키아트. 작업표는 이미 이 순서로 정렬되어 있으므로 `run_simple.py beauty_beast $(python3 -c "import json;print(' '.join(j['id'] for j in json.load(open('tools/app/gen/jobs_beauty_beast.json'))))")` 처럼 앞에서부터 돌리면 된다. 받은 그림은 `restyle_check.py` 방식(네 귀퉁이가 마젠타인지)으로 검사하고, 얼굴이 들어간 소품·송곳니가 생긴 야수·머리 크기가 다른 사람은 그 id 만 지우고 다시 만든다.

## 11. 테스트 체크리스트 (코드가 끝난 뒤, 커밋 전)

준비
- [ ] 저장소 뿌리에서 `python3 -m http.server 8791` (다른 에이전트와 겹치지 않게 8791).
- [ ] 헤드리스 크롬 전용 포트: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9341 --user-data-dir=/tmp/bb_chrome --window-size=1366,1024 about:blank &` (CDP 9341).
- [ ] 자동 재생 스크립트: `assets/raw/_work/autoplay.mjs`(스크린샷) · `assets/raw/_work/autoplay_audio.mjs`(스크린샷 + 재생된 클립 기록 `<prefix>_audio.json`). 사용: `CDP=9341 node assets/raw/_work/autoplay_audio.mjs http://127.0.0.1:8791/tales/beauty_beast/index.html 1366 1024 /tmp/bb_l 600 8`. 손가락 힌트가 뜨면 손끝을 눌러 주고, 고르기는 무작위로 눌러 오답 경로도 지나간다.

가로 1366×1024
- [ ] 끝까지 자동 재생되고 `errors` 에 404·예외가 없다(그림 경로·`ASP` 이름 오타).
- [ ] 첫 조작(2장 말 톡)의 손 힌트가 **시작 버튼 뒤 30초 안**에 보인다(`_audio.json` 의 L7 '말을 톡 눌러 봐요' 시각 ≤ 28s). 넘으면 §3 장면 2 의 지시대로 줄인다.
- [ ] 전체 길이 7~10분(`_audio.json` 마지막 클립 시각 + 끝 화면). 10분을 넘으면 `say` 뒤 `sleep(500)` 을 350 으로, 7분이 안 되면 장면 사이 `sleep` 을 늘린다(대사는 건드리지 않는다).
- [ ] 머리 크기: 1장(아버지·벨·언니들), 7장 A(야수·벨·아버지), 11장(왕자·벨·가족) 스크린샷에서 사람 머리 폭이 ±10% 안에 같고, 야수 머리는 벨의 1.2~1.4배, 야수 키는 벨의 약 1.5배. 틀리면 `HT`(§2-2).
- [ ] 방향: 2장 말·아버지가 오른쪽(길 쪽)을 보고 오른쪽으로 나간다. 3장 눈길도 오른쪽으로 간다. 9장 벨은 거울(왼쪽)을 본다. 11장 벨은 오른쪽(야수)으로 달린다. 침대·눕기 그림이 뒤집히지 않았다.
- [ ] 겹침: 3·8장 사람이 식탁 **뒤**에 있다(접시가 몸을 가림). 5장 야수가 덤불 뒤에서 올라온다. 7장 B 아래 꽃병이 탁자 다리 사이에 보이고 탁자가 그 앞. 10장 꿈 풍선 위에 작은 야수가 풍선 안에 들어간다. 11장 빛이 야수/왕자 뒤.
- [ ] 누르는 자리: `.tap-target.armed` 요소의 `getBoundingClientRect()` 짧은 변이 **화면 60px 이상**(꽃병·카드·덤불·말·샘). 작으면 투명 원 r 을 키운다.
- [ ] 고르기: 4장 2문제·7장 3문제·8장 3단계가 모두 지나가고, 오답 때 흔들림 + 설명 대사가 나오며 두 번째 오답부터 정답이 빛난다. 8장 2단계에서 아침 카드는 흐리고 눌러도 반응이 없다. 3단계는 톡.
- [ ] 문패 글자 '벨의 방' 이 판 안에 들어간다. 영어 모드 "Belle's Room" 도.
- [ ] 끝 화면: 교훈 문구가 `run()` 반환값으로 들어가고(화면에는 숨김), 끝 그림(`_back_wide`)과 리본 색(`BACKACCENT`)이 보인다(`?endpreview=1`).

세로 390×844 (`node … 390 844 /tmp/bb_p 600 8`)
- [ ] 모든 조작 대상이 그 순간 화면 안에 있다(4장 덤불 둘, 7장 꽃병 셋, 8장 카드 셋, 2장 말, 11장 샘). 화면 밖이면 §3 의 P 좌표·`camSnap` 을 고친다.
- [ ] 말하는 사람에게 카메라가 붙고(`director`), 내레이션에서 원래 화면으로 돌아온다. 카메라가 배경 밖(위·아래 빈 곳)을 보이지 않는다.
- [ ] 1장 언니들, 11장 가족처럼 화면 밖에 둔 인물이 대사 때 보인다.

소리
- [ ] `_audio.json` 에서 **같은 클립이 연달아 두 번** 기록되지 않는다(이중 재생). 있으면 `say` 를 두 번 부르는 자리(`Promise.all` 안의 `say` 와 밖의 `say`)를 찾는다.
- [ ] `_audio.json` 의 NAR 줄 수 = 그 경로에서 지나간 대사 수. `say()` 문장이 대본과 달라 클립이 빠지면 그 줄이 기록되지 않는다 → 문장을 대본(§6)과 글자 단위로 맞춘다(대본을 고치지 말고 코드를 고친다).
- [ ] 영어: 홈에서 영어로 바꾼 상태(`localStorage.lang = 'en'`; 자동 재생 스크립트로는 `Page.navigate` 전에 `Runtime.evaluate` 로 `localStorage.setItem('lang','en')` 을 넣은 사본을 쓴다)로 한 번 더 돌려 `narration_el_en.js` 클립과 `TEXT_EN` 장면 이름·팝 글자가 나온다.
- [ ] 녹음 받아쓰기 점검: 녹음 전 `touch /tmp/bb_marker`, 녹음 뒤 `~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py beauty_beast /tmp/bb_marker ko` 와 `… en`. `<<<` 표시(같은 말 되풀이)가 난 클립은 **그 mp3 파일만 지우고** `gen_tale.py` 를 다시 돌린다(없는 클립만 다시 만든다; `--redo` 는 전부 다시 만드니 쓰지 않는다). 영어 v4 는 되풀이 버릇이 있으니 영어는 반드시 본다.
- [ ] 야수 목소리가 으르렁대지 않는다(5장 L24). 크게 들리면 `settings.beast.style` 을 .3 으로 낮춰 그 줄만 다시 만든다.

마무리
- [ ] 홈(`index.html`)에서 카드가 보이고(making 자동 열림), 배우는 것 '위치말' 칩이 나타난다.
- [ ] `git status` 에 다른 동화 파일 변경이 없다. 커밋은 사용자가 요청할 때.
