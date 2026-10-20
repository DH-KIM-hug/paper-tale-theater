# 은혜 갚은 까치 — 제작 상세 사양 (SPEC, 2026-10-20 재기획)

기획 확정본은 `PLAN.md`(9장, 톡 3번 + 숫자 알기 1개, 까치는 쓰러져 잠들었다 깨어남, 구렁이 아내 = 여자 목소리, 실제 범종 녹음). 이 문서는 그 기획을 **더 이상 판단 없이 코드로 옮길 수 있게** 장면마다 그림·좌표·방향·조작·대사·효과음·타이밍을 적은 것이다. 참조 구현은 `tales/snow_white/snow_white.js`(구조·`mk()`·`put()`·`vo()`)와 `tales/cinderella/cinderella.js`(고르기 카드·`director`), 그리고 **이전 까치 코드 `tales/magpie/magpie.js`** (배경 배치 `bgImage`/`BG_PLACE`, 둥지 자리)이다. 이전 코드는 전부 새로 쓴다(구조만 참고). 모르는 것이 있으면 그 파일들에서 같은 이름의 코드를 찾아 그대로 따른다.

## 0. 만들 파일과 순서

| 순서 | 파일 | 만드는 방법 |
|---|---|---|
| 1 | `tools/app/gen/jobs_magpie.json` | **이미 있음**(키아트 5 + 새 그림 `mg2_*` 10장). 그림 생성: `python3 tools/app/gen/run_simple.py magpie mg2_lady_greet mg2_prop_arrow mg2_prop_nest_rim mg2_prop_bell mg2_bg_belltower_night`(pass 1) → `python3 tools/app/gen/run_simple.py magpie mg2_scholar_bow_ready mg2_scholar_bow_release mg2_scholar_sit_worry mg2_lady_stern mg2_lady_tail`(pass 2, 참고 그림이 먼저 있어야 함). 한도에 걸리면 run_simple.py 가 풀리는 시각까지 기다렸다 이어 간다. 받은 그림은 네 귀퉁이가 마젠타인지, 소품에 얼굴이 없는지, 여인에 이빨·혀가 없는지 보고 틀린 id 만 지우고 다시 만든다. |
| 2 | 후처리 | `~/.venvs/paper-tale/bin/python tools/app/gen/post_tale.py magpie` → `assets/v3w/mg2_<id>.webp`(스프라이트는 마젠타 크로마키 → 여백 없이 오림 → 높이 600(폭 900) 안, 배경은 1600×902). 끝에 ASP(폭/높이)가 `tales/magpie/ASP.txt` 에 나온다 → 코드 `ASP` 표에 `mg2_` 이름 그대로 붙인다. 기존 `mg_*` 의 ASP 는 §2-1 표의 값을 쓴다. |
| 3 | `tales/magpie/index.html` | 그대로 둔다(이미 `?voice` 로더와 `narration_el*.js` 로드가 있음). |
| 4 | `tales/magpie/narration.js` · `narration_en.js` | Typecast 녹음은 이번 대본과 맞지 않으므로 **빈 상수만** 남긴다: `narration.js` → `/* magpie — Typecast 대본 폐기(2026-10-20 재기획). ElevenLabs(narration_el.js)가 채운다 */\nconst NARRATION_CLIPS = {};\nconst VOICE_LINES = {};`, `narration_en.js` → `const NARRATION_CLIPS_EN = {}; const VOICE_LINES_EN = {}; const TEXT_EN = {…};` — `TEXT_EN` 은 `voice_script_en.json` 의 `"ui"` 를 그대로 붙인다. `voice_script.json`(Typecast 대본)과 `script_draft.txt` 는 지운다. `audio/tc/magpie/` 는 건드리지 않는다. |
| 5 | `tales/magpie/magpie.js` | 이 문서 §1~§6 대로 **새로** 쓴다. |
| 6 | `tales/catalog.js` | §8 대로 기존 `magpie` 항목의 `line`·`en.line`·`skills` 만 고친다. |
| 7 | 소리 | §7-1 범종 녹음 확보(`sounds/sfx/beomjong.mp3`) + `sounds/CREDITS.md` 빈칸 채우기. 녹음이 아직 없어도 `beomjong_synth.mp3`(이미 있음) 로 코드는 돈다. |
| 8 | 녹음 | `python3 tools/elevenlabs/gen_tale.py magpie --model eleven_v4 --dry` 로 글자 수 확인(한국어 4,484자, 영어 `--lang en` 6,223자, 태그 포함) → `--dry` 빼고 생성 → `audio/el/magpie/*.mp3` + `narration_el.js`, 영어 `audio/el/magpie/en/` + `narration_el_en.js`. 예전 클립(`audio/el/magpie/*.mp3`)은 이름이 해시라 겹치지 않는다. 새 대본에 없는 예전 클립은 `gen_tale.py` 가 쓰는 목록에만 안 들어가므로 그대로 두어도 되지만, 정리하려면 `narration_el.js` 에 없는 파일만 지운다. 녹음 뒤 `check_new.py` 로 되풀이 점검(§11). |
| 9 | 썸네일·키아트 | **바꾸지 않는다**(`assets/thumbs/magpie_*.webp` 그대로). |
| 10 | 자동 재생 점검 | §11 체크리스트. |

커밋·푸시는 사용자가 요청할 때만 한다. 다른 동화 파일은 건드리지 않는다.

## 1. 코드 구조 (`magpie.js`, snow_white.js 를 거울처럼)

```js
/* 은혜 갚은 까치 — 한국 전래동화 원작 그대로. 기획: tales/magpie/PLAN.md, 상세: SPEC.md (2026-10-20 재기획)
   톡 3번(2장 활 · 7장 종 · 9장 인사), 숫자 알기 1개(3장, 아기 까치 1~5마리 무작위 + 숫자 카드), 연타 없음, 줄거리 선택 없음.
   구렁이 아내는 여자 목소리. 까치는 죽지 않고 쓰러져 잠들었다 새벽에 깨어난다. 종소리는 실제 범종 녹음(beomjong.mp3, 없으면 beomjong_synth.mp3).
   크기: 자세가 달라도 같은 인물은 같은 크기(HT 표). 부모 까치는 아기의 약 2.1배. 그림: assets/v3w/mg_*.webp + mg2_*.webp (목록 tools/app/gen/jobs_magpie.json) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { /* §2-1 표 + post_tale.py 출력(mg2_*) */ };
  const HT  = { /* §2-2 */ };
  const NAT = { /* §2-3 */ };
  const FL = 505;                       // 바닥(발끝 y). 이전 코드 GROUND 와 같다. 배경과 어긋나면 ±15 안에서 한 값만 고친다
  const BGS = ['mg_bg_path', 'mg_bg_bigtree', 'mg_bg_nest', 'mg_bg_night', 'mg_bg_porch', 'mg_bg_paperdoor', 'mg_bg_moonnest', 'mg2_bg_belltower_night', 'mg_bg_belltower', 'mg_bg_dawn'];
  const CUTS = ['mg_cut_arrow', 'mg_cut_flee', 'mg_cut_flock', 'mg_cut_ring', 'mg_cut_wake'];
  const src = k => AS + k + '.webp';    // 배경·컷·스프라이트 모두 파일 이름 전체(mg_… / mg2_…)로 부른다
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  /* 이전 코드의 BG_PLACE 그대로: 아침 종탑은 그림 속 종을 가운데로, 둥지는 키워서 가운데로 */
  const BG_PLACE = { mg_bg_belltower: { dx: 119, dy: -74 }, mg_bg_nest: { dx: 40, dy: 47, s: 1.25 } };
  function mk(T, poses) { … }           // snow_white.js 26~44행 그대로 (poses = { 이름: [그림, 높이, NAT] }). 'front' 는 뒤집지 않는다
  const prop = (T, f, h, nat = 'front') => mk(T, { a: [f, h, nat] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) { … }   // snow_white.js 48~53행 그대로
  const hide, fadeIn, fadeOut, glow     // snow_white.js 54~59행 그대로
  function bgImage(T, key) { … }        // 이전 magpie.js 41~50행 그대로(거울 이어 붙이기 포함), bgSrc → src
  const sfx = (T, name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const bellSfx = (T, vol = .9) => { (AudioFX.sfx('beomjong', vol) || AudioFX.sfx('beomjong_synth', vol)); T.tone(64, 2.2, { type: 'sine', vol: .22 * vol }); };  // §5-3
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);   // snow_white.js 69행
  function numCard(T, n, x, y, s) { … } // §5-1 숫자 카드(코드로 그림)
  function swingBell(bell) { … }        // §5-2
  function stars(T, n = 10) { … }       // §5-4 (7장 밤하늘, 선택)
  async function run(T) { … }           // §3 장면 1~9
  Tale.mount({ title: '은혜 갚은 까치', subtitle: '은혜를 잊지 않고 갚아요', run: T => run(Tale.api) });
})();
```

`run(T)` 머리 부분:

```js
const { sleep, camSnap, tr } = T;
const GAP = 600, SCENE_END = 1200, CUT_HOLD = 4200, STRIKE_GAP = 4500, FAINT_GAP = 2800;   // §2-7 속도 상수
const say = async text => { await T.say(text); await sleep(GAP); };   // 대사 사이 숨 한 번
const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(짹!, 하나!…)
const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
const X = (l, p) => (P ? p : l);
const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
AudioFX.preloadSfx(['beomjong', 'beomjong_synth', 'bonk', 'whoosh', 'creak', 'step_grass', 'step_wood', 'swish', 'paper_up', 'paper_down', 'sparkle', 'tada', 'door', 'thud']);
const loads = [...BGS.map(k => T.preload(src(k))), ...CUTS.map(k => T.preload(src(k))), ...Object.keys(ASP).map(k => T.preload(src(k)))];
await Promise.race([Promise.all(loads), sleep(4000)]);
// 배우
const sch   = mk(T, { walk: ['mg_scholar_walk', HT.walk, 'right'], wonder: ['mg_scholar_bow', HT.wonder, 'front'], surprise: ['mg_scholar_surprise', HT.surprise, 'front'],
                      ready: ['mg2_scholar_bow_ready', HT.ready, 'right'], draw: ['mg_scholar_bow_shoot', HT.draw, 'left'], release: ['mg2_scholar_bow_release', HT.release, 'right'],
                      sit: ['mg2_scholar_sit_worry', HT.sit, 'front'], water: ['mg_scholar_water', HT.water, 'left'] });
const lady  = mk(T, { greet: ['mg2_lady_greet', HT.lady, 'front'], stern: ['mg2_lady_stern', HT.lady, 'front'], tail: ['mg2_lady_tail', HT.lady, 'front'] });
const snake = mk(T, { coil: ['mg_snake_coil', 150, 'front'], flee: ['mg_snake_flee', 110, 'right'] });
const mom   = mk(T, { sit: ['mg_mag_mom_sit', 154, 'left'], fly: ['mg_mag_mom_fly', 197, 'right'], tired: ['mg_mag_mom_tired', 133, 'right'] });
const dad   = mk(T, { sit: ['mg_mag_dad_sit', 150, 'left'], fly: ['mg_mag_dad_fly', 186, 'right'], tired: ['mg_mag_dad_tired', 103, 'right'] });
const friends = [0, 1, 2].map(i => mk(T, { fly: [i % 2 ? 'mg_mag_mom_fly' : 'mg_mag_dad_fly', i % 2 ? 197 : 186, 'right'] }));   // 까치 친구 셋(6장)
const chicks = Array.from({ length: 5 }, () => prop(T, 'mg_chick', 70));
const arrow = prop(T, 'mg2_prop_arrow', 14, 'right');          // 높이 14 → 길이 약 120
const rim   = prop(T, 'mg2_prop_nest_rim', 70);                // 폭 약 300
const bell  = prop(T, 'mg2_prop_bell', 170);
const ALL = [sch, lady, snake, mom, dad, ...friends, ...chicks, arrow, rim, bell];
ALL.forEach(hide);
T.director({ cast: { sch, snake: lady, mom, dad }, noFace: ['sch', 'snake', 'mom', 'dad'] });
```

`T.director` 는 세로 화면에서만 말하는 사람에게 카메라를 붙인다(가로는 무대 전체가 보임). 방향은 장면에서 직접 정하므로 `noFace` 에 전부 넣는다. 구렁이 아내 배역 이름은 대본의 `snake` 이므로 cast 키도 `snake` 다(배우는 `lady`).

## 2. 공통 수치

### 2-1. 그림 비율(ASP, 폭/높이) — 기존 그림은 이 값 그대로
```
mg_scholar_walk .5857, mg_scholar_bow .5881, mg_scholar_surprise .6786, mg_scholar_bow_shoot .7889, mg_scholar_water .9439,
mg_snake_coil 1.0158, mg_snake_flee 1.4415, mg_chick .8076,
mg_mag_mom_sit 1.3506, mg_mag_dad_sit 1.2688, mg_mag_mom_fly 1.2452, mg_mag_dad_fly 1.2044, mg_mag_mom_tired 1.8259, mg_mag_dad_tired 1.8827
```
`mg2_*` 는 post_tale.py 가 출력하는 값을 붙인다.

### 2-2. 높이(HT) — 같은 인물은 자세가 달라도 같은 크기 (CLAUDE.md §4-1)
무대 1000×560, 바닥 `FL = 505`. 높이는 그림 상자가 아니라 **같은 부위의 크기**가 같아지도록 정한다.

**까치(엄마·아빠) — 눈 지름으로 맞춤.** 원본 PNG 에서 흰 눈테 지름을 재면(그림 bbox 높이 대비) 앉기 .100~.103, 날기 .078~.083, 지침 .111~.150 이다. 앉기 150 에서 눈 지름이 화면 15px 이 되도록 나머지를 계산한 값:

| 그림 | HT | 화면 눈 지름 | 비고 |
|---|---|---|---|
| mg_mag_dad_sit | **150** | 15.4 | 기준 |
| mg_mag_mom_sit | **154** | 15.4 | |
| mg_mag_dad_fly | **186** | 15.4 | 이전 코드 84 는 절반 크기였다(잘못) |
| mg_mag_mom_fly | **197** | 15.4 | |
| mg_mag_dad_tired | **103** | 15.4 | 누운 그림이라 상자가 납작함. 이전 코드 56 은 1/3 크기였다(잘못) |
| mg_mag_mom_tired | **133** | 15.4 | 눈을 감아 측정이 불확실(±10). 스크린샷에서 머리 폭을 dad_tired 와 맞춘다 |
| mg_chick(아기) | **70** | 약 5 | 부모 앉기 높이의 0.47배(부모 ≈ 아기의 **2.1배**), 부모 몸길이(앉기 폭 ≈ 205) ≈ 아기 폭(56)의 3.6배 |

**선비 — 얼굴 폭(귀~귀, 갓끈 안쪽)으로 맞춤.** 모든 자세에서 화면 얼굴 폭이 같아야 한다. 시작값: `walk 240, wonder 240, surprise 236, draw(bow_shoot) 232, water 200, ready 240, release 240, sit 170`. 새 그림(ready·release·sit)은 "같은 크기"로 그리라고 했으므로 `walk` 와 같은 240 으로 시작하되(sit 는 앉은 상자라 170), 받은 뒤 얼굴 폭을 재서 `HT[자세] = 240 × (fw_walk/H_walk) ÷ (fw_pose/H_pose)` 로 고친다(fw = 원본 얼굴 폭 px, H = 원본 bbox 높이 px). ±12% 밖이면 그 자세만 다시 생성한다.

**여인** — 세 자세 모두 같은 서 있는 그림(참고 그림으로 묶음)이라 `HT.lady = 232` 하나. 선비(240)보다 조금 작다. 얼굴 폭은 선비와 같아야 한다(두 사람 머리 크기 같음, 2.5등신).

**구렁이** — coil 150(앞모습), flee 110(옆으로 긴 그림). 머리 폭이 같은지 2장 스크린샷에서 확인(flee 머리가 작으면 125 까지 올린다).

**소품** — 화살 높이 14(길이 ≈120, 선비 팔 길이와 비슷), 둥지 앞테 높이 70(폭 ≈300, 배경 둥지 폭과 같게 ±20 조정), 종 높이 170(가로대 포함; 종탑 기둥 사이에 들어가게 ±15 조정), 숫자 카드 100×130(세로 72×94).

**원근 축소는 이 세 곳뿐**(그 밖에 `s` 를 쓰지 않는다): 2장 나무 위의 구렁이·까치(`s: .8`, 나무가 중경), 6장 까치 떼 뒤쪽 세 마리(`s: .9, .9, .85`, ≥.85), 3장 가지 끝 까치 엄마(`s: .9`).

### 2-3. 그림이 보는 쪽(NAT) — 뒤집기 규칙
`mk()` 는 `NAT` 가 `'front'` 가 아니고 원하는 쪽과 다르면 좌우로 뒤집는다. **이전 코드는 전부 `'left'` 로 두어 방향이 틀렸다.** 실제 그림이 보는 쪽:

| 그림 | NAT | 비고 |
|---|---|---|
| mg_scholar_walk | **right** | 얼굴이 오른쪽, 지게가 왼쪽. 오른쪽으로 걸을 때 그대로 |
| mg2_scholar_bow_ready, mg2_scholar_bow_release | right | 프롬프트대로면. 반대로 오면 NAT 만 고친다(그림을 뒤집어 저장하지 않는다) |
| mg_scholar_bow_shoot | **left** | 활이 왼쪽으로 뻗음. 오른쪽(나무)으로 쏠 때 `to:'right'` 로 뒤집는다 |
| mg_scholar_water | **left** | 바가지가 왼쪽. 까치가 왼쪽에 누워 있으면 그대로 |
| mg_scholar_bow(wonder), mg_scholar_surprise, mg2_scholar_sit_worry | front | 안 뒤집음 |
| mg2_lady_* | front | 안 뒤집음 |
| mg_snake_coil | front | |
| mg_snake_flee | **right** | 머리 오른쪽, 속도선 왼쪽. 오른쪽으로 달아날 때 그대로 |
| mg_mag_mom_sit, mg_mag_dad_sit | **left** | 부리 왼쪽 |
| mg_mag_mom_fly, mg_mag_dad_fly | **right** | 머리 오른쪽 |
| mg_mag_mom_tired, mg_mag_dad_tired | **right** | 머리 오른쪽. 누운 그림은 뒤집지 않는다(`turn` 을 부르지 않음) |
| mg_chick | front | |
| mg2_prop_arrow | right | 촉이 오른쪽 |

### 2-4. 겹침 순서(z)
`put()` 은 `T.world` 맨 뒤(가장 앞)에 붙인다. 뒤에 있어야 하는 것을 먼저 `put` 한다. 3장: 아기 까치들 → 둥지 앞테(`rim`) 순(아기 발이 테 뒤에 가려 둥지 안에 있어 보임) → 숫자 카드. 7장: 종 → 까치(까치가 종 앞으로 날아와 부딪힘). 9장: 누운 까치 → 선비(선비가 앞). 2장: 구렁이·까치(나무 위) → 선비 → 화살.

### 2-5. 세로 화면 규칙
- `P` 일 때 보이는 폭은 약 260. 한 컷에 **둘까지만** 보이게 좌표를 모으고(`X(l, p)` 의 p 값), 세 명 이상은 `director` 가 말할 때 데려온다.
- **아이가 눌러야 하는 것은 모두 한 화면(±130) 안**: 2장 선비, 3장 카드 셋(`camSnap(540)` 기준 460·540·620), 7장 종(500), 9장 선비.
- 카메라는 `camSnap`/`camTo` 의 y=280, z=1 로 고정(줌 아웃 금지).

### 2-6. 누르는 자리 크기
- 톡·고르기 대상은 화면에서 **짧은 변 60 무대 px 이상**. 숫자 카드(세로 72×94)와 종(폭 ≈120)은 그대로 통과. 톡 대상은 기다리는 동안 살짝 들썩인다(`pos.animate([{translate:'0 0'},{translate:'0 -5px'},{translate:'0 0'}], {duration: 900, iterations: 3})`).

### 2-7. 속도(사용자 지적: 너무 빨리 넘어감)
- `say()` 뒤 `GAP = 600`ms. 장면 끝(다음 `sceneCard` 전) `sleep(SCENE_END = 1200)`.
- 컷 그림 `CUT_HOLD = 4200`ms. 컷은 **그 사건 직후**에만 띄우고, 컷 위에서 그 장면을 말하는 대사를 읽는다: `const c = T.cutImage([{ src: src('mg_cut_…'), sfx: '…', hold: CUT_HOLD }], { hold: CUT_HOLD }); await say(L); await c;` (대사가 홀드보다 길면 컷이 먼저 닫혀도 된다).
- 종 타종 사이 `STRIKE_GAP = 4500`ms(울림이 사라질 때까지), 8장 먼 종소리 사이 `FAINT_GAP = 2800`ms.
- 걷기 등 이동은 7초 안팎으로 느리게. 대사 중 `hop`·`wiggle` 은 한 번만.
- 목표 전체 7.5~9분. §11 에서 잰다.

## 3. 장면별 상세

표기: `L(x)` 가로, `P(x)` 세로 좌표. 대사는 §6 표의 번호. 효과음 이름은 `sounds/sfx/` 파일명(§7). 모든 장면은 `await T.sceneCard(tr('이름'), () => { … }, focus.pos)` 로 넘어간다(1장만 `T.curtain(true)`).

### 장면 1. 산길 (자동, 25초 안)
- `scene('mg_bg_path')`. 선비 `walk` 를 L-120/P-120, `FL`, `to:'right'` 에 둔다(NAT right 라 그대로). `await T.curtain(true)`.
- **L0** → 걷기: `sch.move(X(520, 500), FL, 7000, 'linear')` 와 동시에 `AudioFX.sfx('step_grass', .5)` 를 520ms 마다(루프, 각 번 `sch.hop(5, 480)`), `T.pop(sch.x, FL - 270, tr('저벅저벅'))` 을 0ms 와 3000ms 두 번. 걷는 동안 **L1**. `move` 가 끝날 때까지 기다린다(`await`).
- `sleep(400)` 뒤 오른쪽 밖에서 소리: `vo('caw')`(엄마 "까악!") + `T.pop(X(900, 640), 230, tr('까악!'))`. 선비 `look('surprise')` + `hop(8, 300)`. `sleep(SCENE_END)`.
- 대사는 L0·L1 두 줄뿐이다(첫 조작이 30초 안에 오도록).

### 장면 2. 큰 소나무 (톡 1 — 첫 조작, 활쏘기)
- `sceneCard(tr('큰 소나무'))`, 배경 `mg_bg_bigtree`(나무가 오른쪽, 둥지는 그림 위쪽 약 (700, 40)). 배치(먼저 put 하는 순서): 구렁이 `coil` L790/P640, `FL`, `s:.8`(땅에 있다가 나무를 오른다) · 까치 엄마 `sit` L680/P615, y 120, `s:.8`, `to:'left'`(둥지 옆 가지, 구렁이 쪽을 본다) · 까치 아빠 `fly` L560/P560, y 75, `s:.8`, `to:'right'`(둥지 왼쪽에서 퍼덕) · 선비 `surprise` L440/P470, `FL`. focus: 선비. P: `camSnap(520)`.
- **L2**(엄마가 `hop(10, 300)` 두 번, 아빠 `wiggle(5, 500)`) → 구렁이 오르기: `const climb = snake.move(X(735, 625), 185, 3600, 'ease-in-out')` 와 **L3** 동시 → `await climb`.
- 선비 `look('ready', 'right')` + `sfx('paper_up')` → **L4** → `sleep(500)` → **L5**(안내) → 선비 들썩임(§2-6) → `await T.tap(sch.pos, { prompt: '선비가 활을 꺼냈어요. 선비를 톡 눌러 봐요.' })`.
- **활 동작(톡 뒤, 약 3초)**:
  1. 당기기: `sch.look('draw', 'right')`(bow_shoot 는 NAT left 라 뒤집힌다) + `AudioFX.sfx('creak', .5)`. 떨림: `sch.wiggle(1.5, 400)` 을 세 번 이어서(1,200ms). 숨 한 번 `sleep(300)`.
  2. 쏘기: `sch.look('release', 'right')` + `AudioFX.sfx('whoosh', .8)` + `T.pop(sch.x + 70, FL - 250, tr('쉬익!'))`. 화살: `put(T, arrow, sch.x + 70, FL - 150, { to: 'right' })` → `arrow.move(snake.x - 60, snake.y - 70, 420, 'linear')`(시위에서 구렁이 옆 나무까지 직선, 회전 없음) → 도착 순간 `AudioFX.sfx('thud', .6)` + `T.pop(arrow.x, arrow.y - 40, tr('탁!'))` + `T.shake()` 없음(놀라게 하지 않는다) → `sleep(500)`.
  3. 컷: `cut_arrow`(화살이 구렁이 옆 나무에 꽂힌 그림) `hold: CUT_HOLD` + 그 위에서 **L6**.
  4. 컷이 닫히면 `hide(arrow)`; 구렁이 달아남: `snake.look('flee', 'right'); snake.place(X(700, 640), FL + 8); snake.setScale(1)` → `snake.move(1150, FL + 8, 1800, 'ease-in')` + `AudioFX.sfx('swish', .6)` + `T.pop(760, FL - 130, tr('스르르'))` → `hide(snake)`.
  5. 컷: `cut_flee` `hold: CUT_HOLD` + 그 위에서 **L7**.
- 선비 `look('wonder')`. 까치 엄마·아빠가 선비 곁으로 내려온다: 엄마 `look('sit', 'right')` → `mom.setScale(1); mom.move(X(600, 580), FL - 4, 1200)`(가지에서 땅으로, 선비 오른쪽 땅에 앉아 선비 쪽(왼쪽)을 본다 → `mom.turn('left')`), 아빠 `look('fly','right')` → `dad.setScale(1); dad.move(X(690, 640), FL - 150, 1200)` 뒤 `look('sit', 'left')`, `place(dad.x, FL - 4)`. → **L8**(엄마 클립 뒤 아빠 클립, 각각 `hop(10, 320)`) → `sleep(SCENE_END)`.
- 시작 버튼부터 톡까지 목표 30초(§11). 넘으면 L0 뒤 `sleep` 을 없애고 1장 걷기를 6,000 으로 줄인다(대사는 그대로).

### 장면 3. 둥지 (배움 놀이: 숫자 알기)
- `sceneCard(tr('둥지'))`, 배경 `mg_bg_nest`(`BG_PLACE` 로 1.25배, 둥지 그릇이 무대 가운데 약 (540, 330)). 까치 엄마 `sit` L300/P380, y 300, `s:.9`, `to:'right'`(왼쪽 가지 끝에서 둥지 쪽을 본다 — 아기보다 뚜렷이 크다). focus 없음(`null`). P: `camSnap(540)`.
- 둥지 앞테: 아기들을 put 한 **뒤** `put(T, rim, 540, X(412, 412))` 하되, 아기가 하나도 없을 때 먼저 테를 놓지 않는다(z 순서 §2-4). 받은 배경과 테가 안 맞으면 테 y 를 ±15, 폭(높이 70 → 60~80) 조정.
- 아기 수: `const N = 1 + Math.floor(Math.random() * 5);`(1~5). 자리(발끝 y = 392, 테 뒤):
  - N=1: `[540]` · N=2: `[500, 580]` · N=3: `[470, 540, 610]` · N=4: `[455, 510, 570, 625]` · N=5: `[440, 490, 540, 590, 640]` (세로도 같은 값 — ±100 안이라 `camSnap(540)` 에서 다 보인다). N=1 은 가운데 한 마리가 테 위로 고개를 쏙 내민 모양(y 를 398 로 4px 더 내려 테에 더 가려지게).
- **L9** 와 동시에 아기들 등장: i 번째마다 `put(T, chicks[i], spots[N][i], 392)` + `fadeIn(260)` + `chicks[i].hop(14, 260)` + `vo('chirp')` + `T.pop(x, 392 - 110, tr('짹!'))` 뒤 `sleep(700)`. (수를 세어 주지 않는다 — 아이가 센다.) 전부 나온 뒤 `put(T, rim, …)`, `sleep(600)`.
- 숫자 카드: `const others = [1,2,3,4,5].filter(k => k !== N).sort(() => Math.random() - .5).slice(0, 2); const kinds = [N, ...others].sort(() => Math.random() - .5);` → `cards = kinds.map((n, i) => numCard(T, n, cardX[i], cardY, X(1, .72)))`(§5-1), `cardX = X([340, 540, 740], [460, 540, 620])`, `cardY = X(470, 455)`. 카드는 `animate([{opacity:0, translate:'0 20px'},{opacity:1, translate:'0 0'}], {duration: 450, delay: i*150, fill:'backwards'})` 로 차례로 뜬다.
- **L10**(안내) → `await T.choose(cards.map(c => ({ el: c.g, ok: c.n === N, onWrong: async () => { await wiggleEl(c.g); await say(W[c.n]); await countChicks(); } })), { prompt: '아기 까치가 몇 마리일까요? 맞는 숫자를 골라요.' })`.
  - `W = {1:'그건 1이에요. 다시 세어 볼까요?', 2:'그건 2예요. 다시 세어 볼까요?', 3:'그건 3이에요. 다시 세어 볼까요?', 4:'그건 4예요. 다시 세어 볼까요?', 5:'그건 5예요. 다시 세어 볼까요?'}` (§6 W1~W5 와 글자 하나까지 같다).
  - `countChicks()`: i = 0..N-1 마다 `chicks[i].hop(16, 320)` + `glow(chicks[i], 700)` + `AudioFX.popStep(i + 1)` + `T.pop(chicks[i].x, 392 - 110, tr(['하나!','둘!','셋!','넷!','다섯!'][i]))` + `const u = vo('n' + (i + 1)); await (u || sleep(650)); await sleep(350);`.
  - `wiggleEl` 은 엔진 `choose` 가 `onWrong` 없을 때 쓰는 흔들림과 같은 것(cinderella.js 와 같이 로컬에 복사).
- 정답: `glow(cards[정답].g, 1200)`(카드는 actor 가 아니라 `g.style.filter = 'url(#hintGlow)'` 직접) + `sparkleSfx(T)` + `T.pop(card.x, cardY - 90, tr('반짝!'))` → `await countChicks()` → **C[N]**("맞아요! 세 마리예요.") → 카드 셋 `opacity 1→0` 400ms 뒤 `remove()`.
- **L11**(아기들 모두 `hop(12, 300)`) → 까치 엄마 `hop(10, 320)`(말은 없음) → **L12** → `sleep(SCENE_END)`. N 은 6장·9장에서 다시 쓰므로 변수로 남긴다.

### 장면 4. 깊은 밤 (자동, 두 컷)
- 컷 A: `sceneCard(tr('깊은 밤'))`, 배경 `mg_bg_night`(그림 오른쪽 아래 길 끝에 작은 불빛 ≈ (790, 300)). 선비 `walk` L300/P420, `FL`, `to:'right'`. **L13** 과 동시에 `sch.move(X(560, 560), FL, 6000, 'linear')` + `step_grass` 520ms 루프(음량 .35, 밤이라 작게) + `hop(5, 480)`, P 는 `follow(540, 6000)`. → **L14**(두 마디: 걱정 → 발견; 뒤 마디에 `T.pop(790, 290, tr('반짝!'))` + `sparkleSfx`) → `sch.hop(8, 300)` → 불빛 쪽으로 조금 더 `sch.move(X(700, 640), FL, 2000, 'linear')`(P `follow(620)`) → `sleep(400)`.
- 컷 B: 같은 장면 안에서 **배경만** 바꾼다: `T.clear(); bgImage(T, 'mg_bg_porch'); camSnap(500, 280, 1)`. 배치: 선비 `wonder` L380/P430, `FL` · 여인 `greet` L640/P590, `FL`, `opacity 0`(문 앞). `AudioFX.sfx('door', .6)` → `fadeIn(lady, 900)` 과 **L15** → **L16**(여인: 말하는 동안 `lady.hop(4, 700)` 한 번만, 낮고 느린 목소리) → **L17**(선비 `hop(8, 300)`) → `tint(T, '#1F2A56', 0)` 를 만들어 `anim` 으로 opacity 0→.3 1,500ms + **L18** + `T.pop(sch.x, FL - 260, tr('쿨쿨'))` → `sleep(SCENE_END)`.

### 장면 5. 외딴집 (자동 — 정체)
- `sceneCard(tr('외딴집'))`, 배경 `mg_bg_paperdoor`(방 안, 창호문 가운데) + `tint(T, '#1F2A56', .35)`. 배치: 선비 `sit` L380/P440, `FL` · 여인 `stern` L640/P590, `FL`, `opacity 0`. P: `camSnap(510)`.
- **L19**(선비 `wiggle(3, 500)`) → `fadeIn(lady, 1200)`(천천히) → **L20**(두 마디: 앞 마디 뒤 `pause` 자리에서 `lady.look('tail')` + `AudioFX.sfx('pop', .5)` + `T.pop(lady.x + 60, FL - 40, tr('!'), '#A93B32')` — 꼬리가 치마 밑에서 나온다; 선비 `look('surprise')`).
- 여인은 이 장면 끝까지 `tail` 그림을 유지한다. **L21** → **L22**(여인 `hop(3, 800)` 한 번, 화면 흔들림·효과음 없음) → 선비 `look('sit')` + **L23**(`wiggle(3, 500)`) → **L24** → **L25**(끝에 `T.pop(lady.x, FL - 250, tr('후후…'), '#1F2A56')`) → **L26**(선비, 작게) → `sleep(SCENE_END)`.

### 장면 6. 달밤의 까치 (자동 — 날아감)
- `sceneCard(tr('달밤의 까치'))`, 배경 `mg_bg_moonnest`(왼쪽 큰 소나무, 오른쪽 위 달). 배치: 아빠 `sit` L300/P400, y `FL - 160`, `to:'right'` · 엄마 `sit` L470/P540, y `FL - 160`, `to:'left'`(가지 위에서 마주 봄) · 아기들 N 마리를 L[560 + i*52]/P[600 + i*44], y `FL - 150`(둥지 자리) — 배경의 둥지 위치가 다르면 가지 높이에 맞춰 y 를 ±30 조정. focus: 아빠. P: `camSnap(420)`.
- **L27** → **L28**(엄마 `hop(10, 320)`) → **L29**(아빠 `hop(12, 320)`) → **L30**(엄마가 아기들 쪽을 본다 `turn('right')`, 아기들 `vo('chirp2')` + `T.pop(아기 가운데 x, FL - 260, tr('짹짹!'))`).
- 날아오름: `hide(mom); hide(dad)`; 떼 다섯 마리(엄마·아빠 `fly` + friends 3, **모두 NAT right 그대로, 오른쪽으로**): i = 0..4, 배우 `[dad, mom, friends[0], friends[1], friends[2]]`, 크기 `[1, 1, .9, .9, .85]`, 시작 `x = -150 - i*130`, `y = 150 + (i % 2) * 70 + (i > 1 ? 50 : 0)`, `put(..., { look: 'fly', to: 'right', s })` → 동시에 `move(1150, y - 40, 3200 + i*200, 'linear')` + 날갯짓 `hop(8, 380)` 루프 + `AudioFX.sfx('whoosh', .3)` 한 번. **L31** 과 동시에 시작. 새 한 마리는 화면 높이의 약 1/3(186~197)이다 — 작게 보이면 잘못이다.
- 컷: `cut_flock` `hold: CUT_HOLD` + 그 위에서 **L32**. 끝나면 떼 전부 `hide`, `sleep(SCENE_END)`.

### 장면 7. 종탑 (톡 2 — 종, 한 번 톡 뒤 세 번 자동)
- `sceneCard(tr('종탑'))`, 배경 **`mg2_bg_belltower_night`**(종이 없는 빈 정자, 달). `stars(T)` 선택. 종: `put(T, bell, 500, 385)`(종 아랫단 y 385, 종 가운데 ≈ (500, 300); 받은 배경의 정자 가로대 위치에 맞춰 x ±20, y ±25 조정) + `swingBell` 준비(§5-2). 까치: 아빠 `fly` L250/P330, y 300, `to:'right'` · 엄마 `fly` L750/P670, y 300, `to:'left'`(뒤집음) — 둘 다 종을 향한다. focus: 종. P: `camSnap(500)`.
- **L33**(길게, 고요) → **L34**(아빠 `hop(10, 320)`) → 종 들썩임(§2-6) → **L35**(안내) → `await T.tap(bell.pos, { prompt: '종을 톡 눌러 봐요.' })`.
- **타종 세 번(자동)** — `strike(k)`:
  - k=1 아빠(왼쪽에서), k=2 엄마(오른쪽에서), k=3 둘이 함께. 부딪히는 자리 `hitL = 500 - 58`, `hitR = 500 + 58`, y 300. 물러나는 자리 `backL = X(330, 400)`, `backR = X(670, 600)`.
  1. 다가감: `b.move(hit, 300, 340, 'ease-in')` + `AudioFX.sfx('whoosh', .4)`.
  2. **꽁!**: 도착 즉시 `AudioFX.sfx('bonk', .7)` + `T.pop(hit, 232, tr('꽁!'))` + `swingBell(bell)` + `bellSfx(T, .9)`(실제 범종 소리 + 64Hz 저음 2.2초) + `T.shake()` + 250ms 뒤 `T.pop(500, 165, tr('댕—'), '#1F2A56')`.
  3. 물러남: `b.move(back, 300, 520, 'ease-out')` + `b.wiggle(6, 520)`(머리가 띵).
  4. 울림 위에서 해설: 타종 600ms 뒤 **L36/L37/L38** 를 읽는다(각각 "댕—." 으로 시작하므로 종소리와 겹쳐도 된다). 대사가 끝나도 **타종 시각 + `STRIKE_GAP`(4,500ms) 가 될 때까지** 기다린다(`const t0 = performance.now(); … await sleep(Math.max(0, STRIKE_GAP - (performance.now() - t0)))`).
  - k=3 은 1·3 을 두 새에 `Promise.all` 로 동시에, 효과음은 한 번만.
- 컷: `cut_ring`(두 까치가 종을 치는 그림) `hold: CUT_HOLD` + 그 위에서 **L39**.
- 쓰러짐: 컷이 닫히면 두 새를 `look('tired')` 로 바꾸고(누운 그림, 뒤집지 않음 — mom_tired·dad_tired 둘 다 머리 오른쪽) `put(T, dad, X(430, 440), 480, { look: 'tired' }); put(T, mom, X(560, 560), 480, { look: 'tired' })` 를 **위에서 내려앉게**: 먼저 y 300 에 `opacity 0` 으로 두고 `fadeIn(900)` + `move(x, 480, 1600, 'ease-in')`(돌계단 위, 480 은 배경 계단 높이에 맞춰 ±20). `AudioFX.sfx('paper_down', .4)`. 흔들림 없음. **L40**(아주 느리게) → `T.pop` 없음 → `sleep(2500)`(가장 긴 멈춤) → `sleep(SCENE_END)`.

### 장면 8. 새벽 (자동 — 여인이 떠남)
- `sceneCard(tr('새벽'))`, 배경 `mg_bg_paperdoor` + `tint(T, '#1F2A56', .28)`(틴트 요소를 변수로 들고 있는다). 배치: 선비 `sit` L380/P440 · 여인 `stern` L640/P590. P: `camSnap(510)`.
- **L41** → 먼 종소리 세 번: k=1..3 마다 `bellSfx(T, .32)` + `T.pop(X(880, 640), 150, tr('댕—'), '#1F2A56')` + **여인이 움찔**: `lady.wiggle(4, 450)` 뒤 `lady.move(lady.x + 14, FL, 260)`(한 걸음 물러섬, k 마다 누적) + `lady.hop(5, 300)`; 선비는 `look('surprise')` 로 고개를 든다(k=1 때만). 다음 종까지 `sleep(FAINT_GAP)`.
- **L42**(여인, 작게 세며) → **L43**(한숨) → 변신: `await fadeOut(T, lady, 700)` → `put(T, snake, lady.x, FL, { look: 'coil' })` `fadeIn(700)` + `sparkleSfx(T)` 작게(.4) → `sleep(700)` → `snake.look('flee', 'right'); snake.place(snake.x, FL + 8)` → `snake.move(1150, FL + 8, 2200, 'ease-in')` + `AudioFX.sfx('swish', .5)` + `T.pop(snake.x + 40, FL - 130, tr('스르르'))` — 이 이동과 동시에 **L44**. 끝나면 `hide(snake)`.
- 새벽빛: 틴트 opacity .28 → 0 을 2,000ms 로(`anim`). → **L45**(선비 `hop(10, 320)`) → `sleep(SCENE_END)`.

### 장면 9. 아침 (톡 3 — 마지막 인사)
- 컷 A: `sceneCard(tr('아침'))`, 배경 `mg_bg_dawn`(해 뜨는 마당). 선비 `walk` L-120/P-120, `to:'right'`. **L46** 과 동시에 `sch.move(1150, FL, 4200, 'linear')` + `step_grass` 420ms 루프(빠른 걸음) + `hop(7, 380)`, P `follow(500)` 은 하지 않고 지나가게 둔다. `sleep(300)`.
- 컷 B: 같은 장면 안에서 배경만 **`mg_bg_belltower`**(아침·종이 그려진 배경, `BG_PLACE` 로 종이 가운데) 로 바꾼다. 배치(순서대로): 아빠 `tired` L440/P450, y 480 · 엄마 `tired` L520/P520, y 480(7장과 같은 자리·같은 크기) · 선비 `walk` L1100/P1000, `to:'left'`(뒤집음) → **L47** 과 동시에 `sch.move(X(640, 620), FL, 2600, 'ease-out')`(P `follow(560)`) → 선비 `look('surprise')` → **L48**(작게) → `sch.look('water')`(NAT left 그대로: 바가지가 왼쪽의 까치를 향한다) + `AudioFX.sfx('splash', .35)` + 물방울 4개(§5-5, 바가지 끝 `(sch.x - 95, FL - 95)` 에서 엄마 머리 `(mom.x + 40, 480 - 30)` 로) + `T.pop(mom.x, 480 - 150, tr('똑똑!'))` — 이 동안 **L49**.
- 깨어남: `glow(mom, 1000); glow(dad, 1000)` + `sparkleSfx(T)` → 두 새 `hop(10, 420)` → **L50**(엄마) → **L51**(아빠). (누운 그림을 그대로 둔다 — 아직 지쳐 있다.)
- 아기들: N 마리를 L[300 + i*52]/P[392 + i*44], y 455(까치 뒤 계단)에 `fadeIn(400)` + `hop(12, 400)` 차례로(120ms 간격) + `vo('chirp2')`, **L52** 와 동시에. 그 뒤 컷 `cut_wake`(아기 까치들과 선비가 종탑에서 만나는 아침 그림) `hold: CUT_HOLD` + 그 위에서 **L53**(아기들). 컷이 닫히면 원래 화면.
- 선비 들썩임(§2-6) → **L54**(안내) → `await T.tap(sch.pos, { prompt: '선비를 톡 눌러 봐요.' })` → `T.confetti(); AudioFX.sfx('tada') || sparkleSfx(T);` 선비 `hop(30, 480)`, 아기들 `hop(18, 460)`, 누운 까치 둘 `hop(8, 460)`(작게) → **L55** → **L56**(교훈) → `T.finale(); await sleep(1500); return '은혜를 잊지 않고 갚아요.';`
- 이 동화의 마지막 인사형 톡은 이 선비 톡이다.

## 4. 배움 놀이 규칙 요약 (엔진 `T.choose`)
- 정답 위치를 먼저 알려 주지 않는다. 12초 무입력이면 `prompt`(L10) 를 다시 읽는다. 1회 오답 → `onWrong`(카드 흔들림 + "그건 3이에요. 다시 세어 볼까요?" + 아기를 하나씩 세어 줌). 2회 오답부터 정답 카드가 노랗게 빛나며 들썩이고 나머지는 흐려진다(엔진). 정답을 누르면 `AudioFX.ding()` → 세기 → "맞아요! 세 마리예요."
- 오답 설명 뒤 바로 다시 고를 수 있다. 게임오버 없음. 줄거리와 무관하다.
- 아기 수 N 은 매번 1~5 무작위, 카드는 정답 + 1~5 중 다른 두 수(서로 다름), 순서 무작위.

## 5. 코드로 그리는 것 (그림 없이)

### 5-1. 숫자 카드 `numCard(T, n, x, y, s = 1)`
```js
const w = 100 * s, h = 130 * s;
const g = T.paper(T.world, [['rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10 * s, fill: '#F6ECD8' }],
                            ['rect', { x: -w / 2 + 8 * s, y: -h / 2 + 8 * s, width: w - 16 * s, height: h - 16 * s, rx: 6 * s, fill: 'none', stroke: '#6B4A32', 'stroke-width': 3 * s }]],
                  { transform: `translate(${x},${y})`, filter: 'url(#pp)' });
T.el('text', { x: 0, y: 30 * s, 'text-anchor': 'middle', 'font-size': 86 * s, 'font-weight': 800, fill: '#A93B32',
  'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: String(n) }, g);
return { n, g, x, y };
```
숫자는 **아라비아 숫자**(1~5) 하나만 크게. 영어 모드도 같다(숫자는 번역하지 않는다). 그림 생성으로 만들지 않는다(숫자 모양이 틀어지기 때문).

### 5-2. 종 흔들림 `swingBell(bell)`
종은 꼭대기 고리에서 매달려 흔들린다. `bell.body.style.transformOrigin = '0 -170px'`(그림 높이 170 → 꼭대기)을 7장 시작에 한 번 둔다. 타종마다
```js
bell.body.animate([{ rotate: '0deg' }, { rotate: '5deg', offset: .12 }, { rotate: '-4deg', offset: .4 }, { rotate: '2.5deg', offset: .65 }, { rotate: '-1deg', offset: .85 }, { rotate: '0deg' }], { duration: 2600, easing: 'ease-in-out' });
```
세로 화면에서도 같다. 아침 종탑(9장)은 배경 속 그려진 종이므로 흔들지 않는다.

### 5-3. 종소리 `bellSfx(T, vol)`
`AudioFX.sfx('beomjong', vol)` 가 `false`(파일 없음)면 `AudioFX.sfx('beomjong_synth', vol)`. 거기에 `T.tone(64, 2.2, { type: 'sine', vol: .22 * vol })` 를 겹쳐 낮은 울림을 더한다(실제 녹음이 있으면 이 tone 음량을 .1 로 줄인다). 8장 먼 종소리는 `vol = .32`.

### 5-4. 별 `stars(T, n = 10)` (7장, 선택)
`T.bg` 에 `circle r 2~3 fill '#F6ECD8' opacity .8` 을 x = 60 + i*95, y = 40 + (i % 3) * 30 에 두고 `animate` opacity .4↔.9 2,400ms(+i*300 지연) 무한. 배경 그림에 별이 이미 충분하면 넣지 않는다.

### 5-5. 물방울 (9장)
`circle r 5 fill '#BFD8EE'` 4개를 바가지 끝에서 만들고 i·110ms 지연으로 `animate` translate → 엄마 머리 위(중간 키프레임 y −30 포물선), 480ms `ease-in`, 끝나면 `remove()`.

## 6. 대사 전체 (voice_script_el.json 과 글자 하나까지 같다)
- `say()` 에 넘기는 한국어 문장은 아래 표와 **정확히** 같아야 녹음이 붙는다(한 글자라도 다르면 클립이 없어 조용히 넘어간다 → §11 `_audio.json` 으로 잡는다).
- 배역: nar(해설, Huelyn) sch(선비, Eric) snake(구렁이 아내, **Matilda — 여자**) mom(까치 엄마, Bella) dad(까치 아빠, Namchun) chick(아기 까치들, Peanut). 구렁이(수컷)·친구 까치·종·화살은 목소리 없음.
- L8 은 한 줄에 두 배역(엄마 → 아빠)이라 클립 두 개가 이어진다(엔진 지원).
- 톡 안내(L5, L35, L54)와 고르기 안내(L10)는 `say()` 로 읽은 뒤 같은 문장을 `prompt` 로 넘긴다(12초 재안내).
- 말풍선 없는 소리(`extra`): `n1`~`n5`(하나!~다섯!, 해설) · `chirp`(짹!) · `chirp2`(짹짹!) · `caw`(까악!, 엄마). `vo(key)` 로 튼다.

| # | 장면 | 배역 | 한국어 (`say()`에 넘기는 문장 그대로) | 영어 | 쓰임 |
|---|---|---|---|---|---|
| L0 | 1 | 해설 | 옛날 옛날, 마음씨 고운 선비가 과거를 보러 먼 길을 떠났어요. | Once upon a time, a kind young scholar set off on a long journey to take the royal exam. |  |
| L1 | 1 | 해설 | 저벅저벅. 산 넘고 물 건너, 선비는 깊은 산속으로 들어갔어요. | Step, step. Over hills and across streams, the scholar walked deep into the mountains. |  |
| L2 | 2 | 까치 엄마 | 까악, 까악! 도와주세요! | Caw, caw! Please help us! |  |
| L3 | 2 | 해설 | 큰 소나무 위 둥지에 아기 까치들이 있어요. 그런데 구렁이가 스르르 올라가고 있어요! | High in the big pine tree was a nest of baby magpies. And a big snake was slithering up toward it! |  |
| L4 | 2 | 선비 | 안 돼! 내가 아기 까치들을 지켜 줄게. | Oh no! I will keep the baby magpies safe. |  |
| L5 | 2 | 해설 | 선비가 활을 꺼냈어요. 선비를 톡 눌러 봐요. | The scholar took out his bow. Tap the scholar. | 톡 안내(첫 조작) |
| L6 | 2 | 해설 | 쉬익, 탁! 화살이 구렁이 바로 옆 나무에 꽂혔어요. | Whoosh, thunk! The arrow struck the tree right beside the snake. | 컷 arrow 위 |
| L7 | 2 | 해설 | 깜짝 놀란 구렁이는 스르르 숲으로 달아났어요. | The startled snake slithered away into the forest. | 컷 flee 위 |
| L8 | 2 | 까치 엄마+아빠 | 고맙습니다, 선비님! 이 은혜는 꼭 갚을게요. | Thank you, kind scholar! We will repay your kindness, we promise. | 엄마+아빠 두 클립 |
| L9 | 3 | 해설 | 둥지 안에서 아기 까치들이 고개를 쏙 내밀었어요. | The baby magpies popped their heads up out of the nest. |  |
| L10 | 3 | 해설 | 아기 까치가 몇 마리일까요? 맞는 숫자를 골라요. | How many baby magpies are there? Pick the right number. | 고르기 안내 |
| W1 | 3 | 해설 | 그건 1이에요. 다시 세어 볼까요? | That card says one. Let's count again. | 오답(카드 1) |
| W2 | 3 | 해설 | 그건 2예요. 다시 세어 볼까요? | That card says two. Let's count again. | 오답(카드 2) |
| W3 | 3 | 해설 | 그건 3이에요. 다시 세어 볼까요? | That card says three. Let's count again. | 오답(카드 3) |
| W4 | 3 | 해설 | 그건 4예요. 다시 세어 볼까요? | That card says four. Let's count again. | 오답(카드 4) |
| W5 | 3 | 해설 | 그건 5예요. 다시 세어 볼까요? | That card says five. Let's count again. | 오답(카드 5) |
| C1 | 3 | 해설 | 맞아요! 한 마리예요. | That's right! One baby magpie. | 정답(1) |
| C2 | 3 | 해설 | 맞아요! 두 마리예요. | That's right! Two baby magpies. | 정답(2) |
| C3 | 3 | 해설 | 맞아요! 세 마리예요. | That's right! Three baby magpies. | 정답(3) |
| C4 | 3 | 해설 | 맞아요! 네 마리예요. | That's right! Four baby magpies. | 정답(4) |
| C5 | 3 | 해설 | 맞아요! 다섯 마리예요. | That's right! Five baby magpies. | 정답(5) |
| L11 | 3 | 아기 까치들 | 짹짹! 선비님, 고맙습니다! | Chirp chirp! Thank you, scholar! |  |
| L12 | 3 | 해설 | 선비는 빙긋 웃으며 다시 길을 떠났어요. | The scholar smiled and went on his way. |  |
| L13 | 4 | 해설 | 어느새 해가 지고, 산길은 캄캄해졌어요. | Soon the sun went down, and the mountain path grew dark. |  |
| L14 | 4 | 선비 | 오늘 밤은 어디서 자지? …어, 저기 불빛이! | Where will I sleep tonight? ...Oh, a light over there! |  |
| L15 | 4 | 해설 | 깊은 산속 외딴집에서 한 여인이 나왔어요. | A woman came out of a lonely house deep in the mountains. |  |
| L16 | 4 | 구렁이 아내 | 어서 오세요, 나그네님. 하룻밤 쉬어 가세요. | Welcome, traveler. Come in and rest for the night. |  |
| L17 | 4 | 선비 | 고맙습니다. 하룻밤만 신세 질게요. | Thank you. Just for one night, if I may. |  |
| L18 | 4 | 해설 | 선비는 따뜻한 방에서 금세 잠이 들었어요. | In the warm room, the scholar soon fell asleep. |  |
| L19 | 5 | 해설 | 한밤중, 선비는 으스스한 기운에 눈을 떴어요. | In the middle of the night, the scholar woke with a shiver. |  |
| L20 | 5 | 해설 | 문 앞에 그 여인이 서 있었어요. 그런데… 치마 밑으로 꼬리가 삐죽! | The woman was standing by the door. But... a tail was peeking out from under her skirt! |  |
| L21 | 5 | 구렁이 아내 | 나는 낮에 네가 활로 쫓아낸, 그 구렁이의 아내다. | I am the wife of the snake you chased away with your arrow today. |  |
| L22 | 5 | 구렁이 아내 | 내 남편을 놀라게 한 벌로, 너를 이대로 보내 줄 수는 없어. | You frightened my husband. I cannot let you go just like that. |  |
| L23 | 5 | 선비 | 저는 그저 아기 까치들을 지키려 했을 뿐이에요. 제발 보내 주세요. | I only wanted to protect the baby magpies. Please, let me go. |  |
| L24 | 5 | 구렁이 아내 | 좋아. 새벽이 오기 전에 저 산 위 절의 종이 세 번 울리면, 너를 놓아주마. | Very well. If the temple bell on the mountain rings three times before dawn, I will let you go. |  |
| L25 | 5 | 구렁이 아내 | 하지만 이 깊은 밤에, 누가 종을 치겠니? 후후… | But in the deep of night, who would ring the bell? Hmm hmm... |  |
| L26 | 5 | 선비 | 종소리… 종이 울려야 해. 어떡하지… | The bell... the bell has to ring. What can I do... |  |
| L27 | 6 | 해설 | 그때, 큰 소나무 둥지의 까치 가족은 잠들지 못하고 있었어요. | Meanwhile, in the nest in the big pine tree, the magpie family could not sleep. |  |
| L28 | 6 | 까치 엄마 | 여보, 선비님이 큰일 났어요! 외딴집의 구렁이 아내가… | Dear, the scholar is in danger! The snake's wife at the lonely house... |  |
| L29 | 6 | 까치 아빠 | 종! 절의 종을 울리면 돼요. 우리가 날아가요! | The bell! We just have to ring the temple bell. Let's fly! |  |
| L30 | 6 | 까치 엄마 | 아기들아, 둥지에서 꼭 기다리렴. | Little ones, wait right here in the nest. |  |
| L31 | 6 | 해설 | 까치 엄마 아빠와 숲속 까치 친구들이 밤하늘로 날아올랐어요. | Mama and Papa Magpie and their magpie friends rose into the night sky. |  |
| L32 | 6 | 해설 | 달빛을 가르며, 산 위 절을 향해 쌩쌩! | Through the moonlight, swish, swish, toward the temple on the mountain! | 컷 flock 위 |
| L33 | 7 | 해설 | 절은 고요했어요. 커다란 종이 달빛 아래 걸려 있었어요. | The temple was silent. A great bell hung in the moonlight. |  |
| L34 | 7 | 까치 아빠 | 종을 쳐야 해. 우리 머리로, 온 힘을 다해! | We must strike the bell. With our heads, with all our might! |  |
| L35 | 7 | 해설 | 종을 톡 눌러 봐요. | Tap the bell. | 톡 안내 |
| L36 | 7 | 해설 | 댕—. 깊고 큰 종소리가 산을 넘어 퍼져 갔어요. | Dong... The deep, great sound of the bell rolled over the mountains. | 1번째 타종 울림 위 |
| L37 | 7 | 해설 | 댕—. 두 번째 종소리. | Dong... The second ring. | 2번째 |
| L38 | 7 | 해설 | 댕—. 세 번째 종소리가 울렸어요. | Dong... The third ring sounded. | 3번째 |
| L39 | 7 | 해설 | 까치들은 온 힘을 다해 종을 울렸어요. | The magpies had rung the bell with all their might. | 컷 ring 위 |
| L40 | 7 | 해설 | 그리고 힘이 다 빠진 까치들은, 종 아래에 스르르 쓰러져 잠이 들었어요. | And then, with no strength left, the magpies sank down beneath the bell and fell asleep. |  |
| L41 | 8 | 해설 | 멀리서 종소리가 들려왔어요. | From far away came the sound of the bell. |  |
| L42 | 8 | 구렁이 아내 | 종이… 울렸어. 하나, 둘, 셋. | The bell... it rang. One, two, three. |  |
| L43 | 8 | 구렁이 아내 | 약속은 약속. 너를 놓아주마. | A promise is a promise. I will let you go. |  |
| L44 | 8 | 해설 | 여인은 스르르 구렁이로 변하더니, 새벽 숲으로 사라졌어요. | The woman turned back into a snake and slipped away into the dawn forest. |  |
| L45 | 8 | 선비 | 종소리… 누가 종을 울렸을까? 가 봐야겠어! | The bell... who could have rung it? I must go and see! |  |
| L46 | 9 | 해설 | 선비는 산 위 절로 달려갔어요. | The scholar ran up to the temple on the mountain. |  |
| L47 | 9 | 해설 | 종 아래에, 까치 엄마 아빠가 눈을 감은 채 누워 있었어요. | Beneath the bell, Mama and Papa Magpie lay with their eyes closed. |  |
| L48 | 9 | 선비 | 까치야… 너희였구나. 나를 구하려고… | Magpies... it was you. You did this to save me... |  |
| L49 | 9 | 해설 | 선비는 까치들을 품에 안고, 시원한 물을 한 모금씩 먹여 주었어요. | The scholar held the magpies gently and gave them each a sip of cool water. |  |
| L50 | 9 | 까치 엄마 | 선비님… 무사하셨군요. | Scholar... you are safe. |  |
| L51 | 9 | 까치 아빠 | 은혜를 갚았으니, 이제 됐어요. | We have repaid your kindness. That is enough. |  |
| L52 | 9 | 해설 | 그때 아기 까치들이 짹짹 울며 날아왔어요. | Just then, the baby magpies came flying, chirping all the way. |  |
| L53 | 9 | 아기 까치들 | 엄마! 아빠! | Mama! Papa! | 컷 wake 위 |
| L54 | 9 | 해설 | 선비를 톡 눌러 봐요. | Tap the scholar. | 톡 안내(마지막 인사) |
| L55 | 9 | 선비 | 고마워, 까치들아. 너희 마음, 평생 잊지 않을게. | Thank you, magpies. I will never forget what you did for me. |  |
| L56 | 9 | 해설 | 은혜를 잊지 않고 갚는 마음은, 이렇게 따뜻해요. | A heart that remembers kindness and gives it back is as warm as this. | 교훈 |

`run()` 반환 문구(끝 화면)는 `'은혜를 잊지 않고 갚아요.'`(부제와 같다, `ui` 에 영어 있음).

## 7. 효과음 (sounds/sfx/<이름>.mp3, `AudioFX.sfx(name, vol)`)

| 장면 | 순간 | 이름 | 비고 |
|---|---|---|---|
| 1·4·9 | 걷기 | `step_grass` ×루프 (1장 .5, 4장 .35, 9장 .5) | 팝 '저벅저벅' |
| 1 | 까치 소리 | `vo('caw')` | 팝 '까악!' |
| 2 | 활 들기 | `paper_up` | |
| 2 | 시위 당김 | `creak` (.5) | 떨림 `wiggle` 3번 |
| 2 | 쏘기 | `whoosh` (.8) | 팝 '쉬익!' |
| 2 | 화살 꽂힘 | `thud` (.6) | 팝 '탁!', 흔들림 없음 |
| 2·8 | 구렁이 달아남 | `swish` (.6 / .5) | 팝 '스르르' |
| 3 | 아기 등장 | `vo('chirp')` | 팝 '짹!' |
| 3 | 세기 | `AudioFX.popStep(i)` + `vo('n1'~'n5')` | 팝 '하나!'… |
| 3 | 정답 | `sparkle` (없으면 tone 700→1400) | 팝 '반짝!' + 엔진 `ding` |
| 4 | 문 | `door` (.6) | |
| 4 | 불빛 | `sparkle` | 팝 '반짝!' |
| 4 | 잠듦 | (없음) | 팝 '쿨쿨' |
| 5 | 꼬리 | `pop` (.5) | 팝 '!' |
| 6 | 날아오름 | `whoosh` (.3) | 팝 '짹짹!'(아기들, `vo('chirp2')`) |
| 7 | 다가감 | `whoosh` (.4) | |
| 7 | 머리로 꽁 | `bonk` (.7) | 팝 '꽁!' |
| 7 | **종소리** | **`beomjong` (.9)** → 없으면 `beomjong_synth` (.9), + `T.tone(64Hz)` | 팝 '댕—', `T.shake()` 한 번 |
| 7 | 쓰러짐 | `paper_down` (.4) | |
| 8 | 먼 종소리 ×3 | `beomjong` (.32) → 없으면 `beomjong_synth` | 팝 '댕—' |
| 8 | 변신 | `sparkle` (.4) | |
| 9 | 물 | `splash` (.35) | 팝 '똑똑!' |
| 9 | 깨어남 | `sparkle` | |
| 9 | 끝 | `tada` + `T.confetti()` | |
| 전환 | 책장 넘기기 | 엔진 기본 | |
| 톡·고르기 | 누름/정답/오답 | 엔진 `AudioFX.tap/ding/miss` | |

### 7-1. 실제 범종 녹음 구하기 (`sounds/sfx/beomjong.mp3`) — 코딩 에이전트가 한다
사용자 요구: 일반 `bell.mp3` 가 아니라 **실제 한국 범종(성덕대왕신종·보신각종 같은) 한 번 타종 녹음**. 2026-10-20 기획 시점에 Wikimedia Commons 를 "Korean temple bell / Bosingak / Beomjong / Seongdeok / 범종 / 보신각 / Buddhist bell" 로 검색했으나 한국 범종 녹음은 **없었다**(일본 범종 `Bonsyou5599.ogg` 하나뿐이며, 이것은 30초 내내 같은 음량의 잔향 녹음이라 '한 번 타종 후 감쇠' 로 자를 수 없어 쓰지 않는다). 그래서 지금은 합성 임시음 `beomjong_synth.mp3`(6초, 코드가 자동으로 대비) 를 두었다.

절차(순서대로 시도, 하나 구해지면 멈춤):
1. **국립경주박물관 — 성덕대왕신종 타음 녹음**: `https://gyeongju.museum.go.kr` 에서 "성덕대왕신종 소리"/"타음 조사" 자료(박물관은 신종 타음 녹음을 공개해 왔다). 페이지에 **공공누리 제1유형**(출처 표시, 상업 이용 가능) 표시가 있는 파일만 쓴다. 다운로드 링크는 브라우저로 확인(JS 페이지라 curl 로는 안 보였다).
2. **공공누리 포털** `https://www.kogl.or.kr` 검색 "범종", "보신각", "타종", "성덕대왕신종" — 1유형(또는 2유형: 상업 이용 가능, 변경 금지면 자르기 불가라 1유형만) 음원.
3. **Freesound.org** 검색 "korean temple bell", "temple bell korea", "bonsho", "buddhist temple bell single strike" — 라이선스 **CC0** 우선, CC BY 가능(출처 표시), CC BY-NC 는 앱 유료 판매라 **불가**. 다운로드는 로그인이 필요하므로 사용자 계정으로 받는다.
4. **Wikimedia Commons** 재검색(새로 올라왔는지): `https://commons.wikimedia.org/w/index.php?search=korean+temple+bell+filetype%3Aaudio`.
5. 못 구하면 사용자에게 "범종 녹음이 공개 자료에 없어 합성 임시음을 쓴다. 직접 녹음본이 있으면 `sounds/sfx/beomjong.mp3` 자리에 넣어 달라"고 알린다.

받은 뒤 자르기(한 번 타종 4~6초, 자연 감쇠, 정규화):
```sh
# 1) 타종 시각 찾기: 0.1초 RMS 가 6dB 이상 뛰는 곳이 타종 시작(t0)
ffmpeg -v error -i <원본> -ac 1 -ar 8000 -f s16le - | python3 -c "import sys,struct,math; d=sys.stdin.buffer.read(); n=len(d)//2; s=struct.unpack('<%dh'%n,d); w=800; p=-99
for i in range(0,n-w,w):
  r=math.sqrt(sum(x*x for x in s[i:i+w])/w); db=20*math.log10(max(r,1)/32768)
  if db-p>6: print('onset %.1fs %.1fdB'%(i/8000,db))
  p=db"
# 2) 타종 0.05초 전부터 6초, 끝 0.8초 페이드, 라우드니스 -16 LUFS, 피크 -1.5dB, mp3 q3
ffmpeg -y -ss <t0-0.05> -t 6 -i <원본> -af "afade=t=out:st=5.2:d=0.8,loudnorm=I=-16:TP=-1.5" -ac 1 -codec:a libmp3lame -q:a 3 sounds/sfx/beomjong.mp3
# 3) (선택) 세 번 타종판: 같은 클립을 4.5초 간격으로 겹친다
ffmpeg -y -i sounds/sfx/beomjong.mp3 -i sounds/sfx/beomjong.mp3 -i sounds/sfx/beomjong.mp3 -filter_complex "[1]adelay=4500|4500[b];[2]adelay=9000|9000[c];[0][b][c]amix=inputs=3:normalize=0,alimiter=limit=0.9" -codec:a libmp3lame -q:a 3 sounds/sfx/beomjong3.mp3
```
확인: `ffprobe -show_entries format=duration` 로 5~6.5초, 들어서 타격음 뒤 잔향이 끝까지 자연스럽게 사라지는지. 그 뒤 `sounds/CREDITS.md` 의 "범종" 표 `sfx/beomjong.mp3` 줄에 원본·만든 이·라이선스·출처 URL 을 채운다(이미 빈 줄이 있다). 코드는 바꿀 것이 없다(`bellSfx` 가 `beomjong` 을 먼저 찾는다). 세 번 타종판(`beomjong3`)은 코드에서 쓰지 않는다(타종마다 까치 동작과 맞춰야 하므로 한 번짜리를 세 번 튼다).

### 7-2. 타종 때 소리 겹침
한 번 타종 = `bonk`(0ms) → `beomjong`(0ms, 같은 순간) → `T.tone(64Hz, 2.2초)` → 해설 L36~38(+600ms). 다음 타종은 4,500ms 뒤. 실제 녹음이 6초면 앞 타종의 꼬리와 다음 타종이 1.5초 겹치는데 실제 종도 그렇게 들리므로 괜찮다.

## 8. 카탈로그 항목 (`tales/catalog.js`, 기존 `magpie` 항목 수정)
```js
  { id: 'magpie', title: '은혜 갚은 까치', origin: 'korean', skills: ['count', 'sound', 'heart'], ready: false, making: true,
    line: '둥지의 아기 까치는 몇 마리? 숫자를 골라요. 밤에 종을 울려 은혜를 갚는 까치 이야기.',
    en: { title: 'The Grateful Magpie', line: 'How many baby magpies are in the nest? Pick the number. At night the magpies ring the bell to repay a kindness.' },
    art: `…(그대로)…` },
```
`skills` 에 'number' 칩은 없으므로 숫자 알기는 `count` 로 단다. `art`·`ready`·`making` 은 그대로.

## 9. 썸네일·키아트
바꾸지 않는다. `assets/thumbs/magpie_key_wide.webp`, `_key_tall.webp`, `_tile.webp`, `_light.webp` 그대로. `jobs_magpie.json` 의 `key5_*` 항목도 그대로 둔다(다시 만들지 않는다).

## 10. 그림 목록 (PLAN.md 와 같다)
재사용 28장(`mg_*`)과 새 그림 10장(`mg2_*`)의 표는 `PLAN.md` "그림 목록" 을 그대로 쓴다. 새 그림 생성 순서는 §0-1. 받은 그림 점검: 네 귀퉁이 마젠타, 소품(화살·둥지 테·종)에 얼굴 없음, 여인에 이빨·혀·붉은 눈 없음, 선비 새 자세의 얼굴 폭이 `mg_scholar_walk` 와 ±12% 안(§2-2), 활 방향(ready·release 는 오른쪽, 아니면 NAT 만 고침).

## 11. 테스트 체크리스트 (코드가 끝난 뒤, 커밋 전)

준비
- [ ] 저장소 뿌리에서 `python3 -m http.server 8793`(다른 에이전트와 겹치지 않게 8793).
- [ ] 헤드리스 크롬: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9343 --user-data-dir=/tmp/mg_chrome --window-size=1366,1024 about:blank &`.
- [ ] 자동 재생: `CDP=9343 node assets/raw/_work/autoplay_audio.mjs http://127.0.0.1:8793/tales/magpie/index.html 1366 1024 /tmp/mg_l 600 8` (스크린샷 + `_audio.json`). 손가락 힌트가 뜨면 손끝을 눌러 주고, 고르기는 무작위로 눌러 오답 경로도 지나간다. N 이 무작위이므로 **세 번 이상** 돌려 N=1 과 N=5 를 한 번씩은 본다(필요하면 `?n=1` 같은 임시 쿼리로 N 을 고정하는 코드를 넣고 끝나면 지운다).

가로 1366×1024
- [ ] 끝까지 자동 재생되고 `errors` 에 404·예외가 없다(`mg2_` 경로, `ASP` 이름).
- [ ] 첫 조작(2장 활 톡)의 손 힌트가 **시작 버튼 뒤 30초 안**에 보인다(`_audio.json` 의 L5 시각 ≤ 28s). 넘으면 §3 장면 2 의 지시대로 줄인다.
- [ ] 전체 길이 7.5~9분(`_audio.json` 마지막 클립 시각 + 끝 화면). 10분을 넘으면 `CUT_HOLD` 를 3,600, `SCENE_END` 를 900 으로; 7분이 안 되면 `SCENE_END` 를 1,600 으로(대사는 건드리지 않는다).
- [ ] **크기**: 2장(까치 엄마·아빠 vs 아기 없음), 3장(가지 끝 엄마 vs 아기 N 마리 — 엄마 키가 아기의 2배 이상), 6장(떼 다섯 — 새 한 마리가 화면 높이의 약 1/3, 작은 새 없음), 7장(날기 → 지침 — 눈 지름·머리 폭이 같다), 9장(누운 까치 vs 아기들) 스크린샷을 나란히 놓고 같은 부위 크기를 비교한다. 틀리면 `HT`(§2-2).
- [ ] **방향**: 1장 선비가 오른쪽을 보며 오른쪽으로 걷는다. 2장 선비 활이 오른쪽(나무)을 향하고 화살이 오른쪽으로 날아가며, 구렁이는 오른쪽으로 달아난다. 2장 가지 위 엄마가 구렁이 쪽을 본다. 6장 떼가 오른쪽으로 난다. 7장 아빠는 왼쪽에서 오른쪽으로, 엄마는 오른쪽에서 왼쪽으로 종에 부딪힌다. 8장 구렁이가 오른쪽(문밖)으로 나간다. 9장 선비가 왼쪽으로 걸어 들어와 왼쪽의 까치에게 바가지를 내민다. 누운 그림(tired)이 뒤집히지 않았다.
- [ ] **활 동작**: 톡 뒤 준비 → 당김(떨림 1.2초) → 쏘기 → 화살이 직선으로 날아가 구렁이 옆에 멈춤 → 컷 순서가 보인다. 화살이 구렁이 몸에 닿지 않는다.
- [ ] **숫자 놀이**: 아기가 N 마리 보이고(테 뒤에 발이 가려짐), 카드 세 수가 서로 다르며 정답이 들어 있다. 오답 때 흔들림 + W 대사 + 하나씩 세기, 두 번째 오답부터 정답 카드가 빛난다. 정답 때 세기 + C 대사. N=1 때 한 마리가 가운데에 있다.
- [ ] **종**: 톡 한 번 뒤 세 번 타종이 저절로, 타종 사이 4.5초, 종이 흔들리고(§5-2) `_audio.json`/콘솔에 `beomjong`(또는 `beomjong_synth`) 재생이 세 번 + 8장에 세 번(작게) 기록된다. 타종 때 화면 흔들림은 한 번(`shake`)뿐.
- [ ] **컷 5장**이 그 사건 직후에만 뜨고 각 컷 위에서 맞는 대사(L6·L7·L32·L39·L53)가 들린다.
- [ ] 누르는 자리: `.tap-target.armed` 의 `getBoundingClientRect()` 짧은 변이 **화면 60px 이상**(선비·카드·종).
- [ ] 끝 화면: 교훈 문구가 `run()` 반환값으로 들어가고, 기존 끝 그림·리본이 보인다(`?endpreview=1`).

세로 390×844 (`node … 390 844 /tmp/mg_p 600 8`)
- [ ] 모든 조작 대상이 그 순간 화면 안에 있다(2장 선비, 3장 카드 셋, 7장 종, 9장 선비). 화면 밖이면 §3 의 P 좌표·`camSnap` 을 고친다.
- [ ] 3장 아기 N=5 가 모두 보인다(440~640). 6장 떼가 화면을 지나간다. 7장 양쪽에서 오는 까치가 보인다(`backL/backR` 의 P 값).
- [ ] 말하는 사람에게 카메라가 붙고(`director`), 내레이션에서 원래 화면으로 돌아온다. 카메라가 배경 밖을 보이지 않는다.

소리
- [ ] `_audio.json` 에서 **같은 클립이 연달아 두 번** 기록되지 않는다(이중 재생).
- [ ] NAR 줄 수 = 그 경로에서 지나간 대사 수. 빠진 줄은 `say()` 문장을 §6 과 글자 단위로 맞춘다(대본을 고치지 말고 코드를 고친다).
- [ ] 영어: `localStorage.lang = 'en'` 으로 한 번 더 돌려 `narration_el_en.js` 클립과 `TEXT_EN` 장면 이름·팝 글자가 나온다. 숫자 카드는 영어에서도 숫자다.
- [ ] 녹음 받아쓰기 점검: 녹음 전 `touch /tmp/mg_marker`, 녹음 뒤 `~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py magpie /tmp/mg_marker ko` 와 `… en`. `<<<`(되풀이) 클립은 **그 mp3 만 지우고** `gen_tale.py` 를 다시 돌린다(`--redo` 금지). 영어 v4 는 반드시 본다.
- [ ] **구렁이 아내가 여자 목소리**로, 낮고 느리게 들린다(L16·L21~L25·L42·L43). 해설과 구별이 안 되면 `voices.snake` 를 Haemi 로 바꿔 snake 줄만 다시 만든다. 소리치면 `settings.snake.style` 을 .2 로.
- [ ] 1장 L1 과 걷기가 같이 끝난다(걷기가 먼저 끝나면 7,000 을 늘린다).

마무리
- [ ] 홈(`index.html`)에서 카드가 보이고 `line` 이 새 문구다.
- [ ] `git status` 에 다른 동화 파일 변경이 없다. 커밋은 사용자가 요청할 때.
