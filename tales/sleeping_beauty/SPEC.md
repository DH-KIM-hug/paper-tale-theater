# 잠자는 숲속의 공주 — 제작 상세 사양 (SPEC, 2026-10-21)

기획 확정본은 `PLAN.md`(11장, 페로 판 전반부, 맨 아래 "확정 사항"이 최신). 이 문서는 그 기획을 **더 이상 판단 없이 코드로 옮길 수 있게** 장면마다 그림·좌표·크기·방향·조작·대사·효과음·타이밍을 적은 것이다. 참조 구현은 `tales/beauty_beast/beauty_beast.js`(**목업 자리표시**·`mk()`·`put()`·`sprite()`·`bgImage()`·HT 표·`T.choose` 호출 모양)와 `tales/red_car/red_car.js`(`hitBox()`·`veil()`·preload 로 ASP 덮어쓰기), 그리고 `tales/snow_white/snow_white.js`(구조). 모르는 것이 있으면 그 파일들에서 같은 이름의 코드를 찾아 그대로 따른다.

확정 사항(PLAN 맨 아래)과 사용자 규칙을 이 문서에 반영한 것:
- 장면 11장 그대로. 결혼식에 요정 여덟 명 + 접시 여덟 개. 늙은 요정 웃는 얼굴 1장.
- 교훈은 **대사로 말하지 않는다**. 교훈 문장은 부제와 끝 화면 글자(`run()` 반환값)로만 보인다.
- 2장 배움 놀이는 **많고 적음**(세기 아님). 세기는 해설 목소리가 작게 따라 셀 뿐(`extra` count1~7) 화면에 숫자·글 말풍선이 없다.
- 톡 3번: 1장 요람(첫 조작, 시작 뒤 약 12초), 9장 가시덤불, 11장 인사. 배움 놀이 3개: 2장 많고 적음(2문제), 6장 길고 짧음(2문제), 10장 위·아래·옆(3문제). 연타 없음, 줄거리 선택 없음, 입맞춤 없음.
- **피 없음**: 7장 바늘 찔림은 손끝의 작은 별빛(코드 `twinkle`) + 팝 '콕!' + 하품 자세로만 보인다. 물레 가락 그림에도 핏방울·액체가 없다.
- 효과음 글자(`T.pop`)는 늘 **인물 머리 위**(`y = 발끝 − 키 − 45`)나 소품 위에 두어 얼굴을 가리지 않는다. 좌표는 §3 에 장면마다 적는다.
- 도망·퇴장·이동하는 인물은 **가는 쪽을 본다**(`to:` 로 지정, NAT 표 §2-3).
- 영어 모드: `TEXT_EN`(`voice_script_en.json` 의 `ui`) 에 장면 이름·팝·안내 문장·제목·부제·끝 글자가 모두 있어 한글이 남지 않는다.
- 이 문서에서 **내가 정한 것**(PLAN 과 다른 점): ① 8장 재우는 차례에서 **말을 뺀다**(침실 안이라 말이 설 자리가 없다. 원작 목록을 줄인 것이므로 사건은 같다). ② 5장 "물레를 들고 나가는 신하들"은 인물 없이 **방 구석의 물레 한 대가 덜컹거리며 밖으로 미끄러져 나간다**로 줄인다. ③ 짝 맞춤 줄·지팡이 빛·손끝 별빛·해·달·꽃잎은 **코드로 그린다**(그림 없음). ④ 탑 배경은 계단과 꼭대기 방 두 장으로 나눈다. ⑤ 막내 요정의 '말하기' 자세는 서기 자세로 대신한다(들썩임만). ⑥ 요정 보라색은 Lavender Dusk(`#8B7BB8`, 달빛·강물 전용) 대신 자두색 `#7A4E86` 을 쓴다.

## 0. 만들 파일과 순서

| 순서 | 파일 | 만드는 방법 |
|---|---|---|
| 1 | `tools/app/gen/jobs_sleeping_beauty.json` | **이미 있음**(97장: 스프라이트 79 + 배경 8 + 컷 5 + 키아트 5, 접두어 `sb_`). 생성: `python3 tools/app/gen/run_simple.py sleeping_beauty <id ...>` 를 `pass` 1(30) → 2(33) → 3(24) 순으로(참고 그림이 먼저 있어야 함), 컷(`sb_cut_*`)은 `pass 4`(참고 스프라이트가 다 나온 뒤), 키아트(`key5_*`)는 맨 뒤. 작업표가 이미 이 순서로 정렬되어 있으므로 `run_simple.py sleeping_beauty $(python3 -c "import json;print(' '.join(j['id'] for j in json.load(open('tools/app/gen/jobs_sleeping_beauty.json'))))")` 처럼 앞에서부터 돌리면 된다. 한도에 걸리면 run_simple.py 가 풀리는 시각까지 기다렸다 이어 간다. 받은 그림 점검은 §10. |
| 2 | 후처리 | `~/.venvs/paper-tale/bin/python tools/app/gen/post_tale.py sleeping_beauty` → `assets/v3w/sb_<id>.webp`(스프라이트는 마젠타 크로마키 → 여백 없이 오림 → 높이 600(폭 900) 안, 배경 1600×902). 끝에 ASP(폭/높이)가 `tales/sleeping_beauty/ASP.txt` 에 나온다 → 코드 `ASP` 표에 붙인다. **그림이 아직 없어도 코드는 자리표시(§1-1)로 돈다.** |
| 3 | `tales/sleeping_beauty/index.html` | `tales/beauty_beast/index.html` 그대로 복사, `<title>잠자는 숲속의 공주</title>`, 마지막 스크립트 `sleeping_beauty.js`. 합창 로더는 넣지 않는다(합창 없음). |
| 4 | `tales/sleeping_beauty/narration.js` | Typecast 없음. `/* sleeping_beauty — Typecast 없음. ElevenLabs(narration_el.js)가 채운다 */\nconst NARRATION_CLIPS = {};\nconst VOICE_LINES = {};` |
| 5 | `tales/sleeping_beauty/narration_en.js` | `const NARRATION_CLIPS_EN = {}; const VOICE_LINES_EN = {}; const TEXT_EN = {…};` — `TEXT_EN` 은 `voice_script_en.json` 의 `"ui"` 를 그대로 JSON 으로 붙인다(미녀와 야수 `narration_en.js` 와 같은 모양). |
| 6 | `tales/sleeping_beauty/sleeping_beauty.js` | 이 문서 §1~§6 대로 새로 쓴다. 그림이 없는 동안은 **자리표시 목업**으로 끝까지 돌아야 한다. |
| 7 | `tales/catalog.js` | §8 의 항목을 `red_car` 항목 뒤에 추가(`making: true`). |
| 8 | 녹음 | `python3 tools/elevenlabs/gen_tale.py sleeping_beauty --model eleven_v4 --dry`(한국어 약 1,560자, 영어 `--lang en` 약 3,420자, 67줄 + extra 7) → `--dry` 빼고 생성 → `audio/el/sleeping_beauty/*.mp3` + `narration_el.js`, 영어 `audio/el/sleeping_beauty/en/` + `narration_el_en.js`. 합창 없음. 녹음 뒤 `check_new.py` 되풀이 점검(§11). |
| 9 | 썸네일·키아트 | §9 (인물 그림이 다 나온 뒤). |
| 10 | 자동 재생 점검 | §11 체크리스트. |

커밋·푸시는 사용자가 요청할 때만 한다. 다른 동화 파일은 건드리지 않는다. `tales/kkultteok/` 의 그림·참고 사진은 어떤 경로로도 쓰지 않는다.

## 1. 코드 구조 (`sleeping_beauty.js`, beauty_beast.js 를 거울처럼)

```js
/* 잠자는 숲속의 공주 — 페로 원작 전반부. 기획: tales/sleeping_beauty/PLAN.md, 상세: SPEC.md (2026-10-21)
   톡 3번(1장 요람 · 9장 가시덤불 · 11장 인사), 배움 놀이 3개(2장 많고 적음 · 6장 길고 짧음 · 10장 위·아래·옆), 연타 없음, 줄거리 선택 없음, 입맞춤 없음, 피 없음. 교훈 대사 없음.
   사람·요정은 모두 머리 크기가 같다(HT, 머리 지름 ≈ 80). 아기도 머리는 같고 몸만 작다. 소품은 얼굴 없음.
   짝 맞춤 줄·지팡이 빛·손끝 별빛·해·달은 코드로 그린다. 세기는 해설이 작게 따라 셀 뿐(vo count1~7) 화면 글자 없음.
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/sb_*.webp (목록 tools/app/gen/jobs_sleeping_beauty.json) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { /* post_tale.py 출력(tales/sleeping_beauty/ASP.txt). 그림이 오기 전엔 §2-1 의 시작값 */ };
  const HT  = { /* §2-2 */ };
  const NAT = { /* §2-3 */ };
  const FL = 528;                       // 바닥(발끝 y)
  const TABLE_Y = 207;                  // 2·3·11장 식탁 윗선(배경 그림 38% 높이 = -24 + 609×.38). 그림이 오면 ±10 맞춘다
  const SLOT = i => 112 + 108 * i;      // 2·3·11장 요정·접시 자리(가로) i = 0..7
  const SLOTP = i => 372 + 32 * i;      // 세로 화면(요정·접시 s = .36)
  const S_ROW = .36;                    // 세로 화면에서 2·11장 줄 전체에 공통으로 쓰는 축소 비율. 그 밖에 s 를 쓰지 않는다
  const BGS = ['sb_bg_room', 'sb_bg_hall', 'sb_bg_stairs', 'sb_bg_tower', 'sb_bg_bedroom', 'sb_bg_outside', 'sb_bg_kitchen', 'sb_bg_chapel'];
  const src = k => AS + k + '.webp';    // 배경·스프라이트 모두 파일 이름 전체(sb_…)로 부른다
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const artOK = {}, bgOK = {};
  function placeholder(T, parent, f, w, h) { … }   // §1-1
  function sprite(T, parent, f, x, y, w, h) { … }  // beauty_beast.js 118~123행 그대로(artSrc → src)
  const BGPH = { … };                   // §1-1 배경 자리표시 표
  function bgImage(T, key) { … }        // beauty_beast.js 133~142행 그대로(bgSrc → src, 키는 sb_… 전체 이름)
  function mk(T, poses) { … }           // beauty_beast.js 145~165행 그대로 (poses = { 이름: [그림, 높이] })
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) { … }   // beauty_beast.js 167~172행 그대로
  const hide, fadeIn, fadeOut, glow, wiggleEl, bob   // beauty_beast.js 173~178행 그대로
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);
  const sfx = (T, name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle', .4) || T.tone([700, 1400], .3, { vol: .15 });
  function hitBox(T, a, w = 100, h = 100) { … }    // red_car.js 와 같다(§5-1)
  function hitRect(T, x, y, w, h) { … }  // §5-2 줄 전체 누르기 자리(2장)
  function strip(T, x, y0, y1) { … }     // §5-3 짝 맞춤 줄(색지 띠)
  function twinkle(T, x, y, color, n = 5, r = 46) { … }   // §5-4 반짝(지팡이 빛·손끝 별빛)
  function sunMoon(T) { … }              // §5-5 해·달 (9장)
  async function veil(T, change) { … }   // red_car.js 와 같다(§5-6)
  async function run(T) { … }            // §3 장면 1~11
  Tale.mount({ title: '잠자는 숲속의 공주', subtitle: '아무도 빼놓지 않아요', run: T => run(Tale.api) });
})();
```

`run(T)` 머리 부분:

```js
const { sleep, camSnap, tr } = T;
const GAP = 600, SCENE_END = 1400, WALK = 2600;            // §2-7
const say = async text => { await T.say(text); await sleep(GAP); };
const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(count1~7)
const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
const X = (l, p) => (P ? p : l);
const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
AudioFX.preloadSfx(['paper_down', 'paper_up', 'paper_tap', 'swish', 'whoosh', 'rattle', 'knock', 'sparkle', 'tada', 'giggle', 'bell', 'door', 'creak', 'step_wood', 'pop', 'doop', 'boing']);
/* 그림 파일 미리 받기: 있으면 쓰고(artOK/bgOK), 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 (red_car.js 와 같다) */
const loads = [];
BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
await Promise.race([Promise.all(loads), sleep(4000)]);
// 배우 (자세 이름: [그림, 높이]) — 높이는 HT[그림]
const h = f => [f, HT[f]];
const pr     = mk(T, { stand: h('sb_pr_stand'), climb: h('sb_pr_climb'), reach: h('sb_pr_reach'), yawn: h('sb_pr_yawn'), lie: h('sb_pr_lie'), wake: h('sb_pr_wake'), wave: h('sb_pr_wave') });
const baby   = mk(T, { sleep: h('sb_pr_baby_sleep'), giggle: h('sb_pr_baby_giggle') });
const king   = mk(T, { joy: h('sb_king_joy'), surprise: h('sb_king_surprise'), command: h('sb_king_command'), worry: h('sb_king_worry') });
const queen  = mk(T, { joy: h('sb_queen_joy'), surprise: h('sb_queen_surprise'), worry: h('sb_queen_worry') });
const FC = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const fairies = FC.map(c => mk(T, { stand: h(`sb_fairy_${c}_stand`), wand: h(`sb_fairy_${c}_wand`) }));   // fairies[0] = 빨강 … [5] = 보라
const young  = mk(T, { stand: h('sb_young_stand'), peek: h('sb_young_peek'), wand: h('sb_young_wand') });
const old    = mk(T, { stand: h('sb_old_stand'), sulk: h('sb_old_sulk'), smile: h('sb_old_smile') });
const granny = mk(T, { spin: h('sb_granny_spin'), startle: h('sb_granny_startle') });
const prince = mk(T, { stand: h('sb_prince_stand'), tiptoe: h('sb_prince_tiptoe'), kneel: h('sb_prince_kneel'), wave: h('sb_prince_wave') });
const grandpa = mk(T, { point: h('sb_grandpa_point') });
const maid   = mk(T, { stand: h('sb_maid_stand'), sleep: h('sb_maid_sleep') });
const guardA = mk(T, { stand: h('sb_guard_a_stand'), sleep: h('sb_guard_a_sleep') });
const guardB = mk(T, { stand: h('sb_guard_b_stand'), sleep: h('sb_guard_b_sleep') });
const cook   = mk(T, { stand: h('sb_cook_stand'), sleep: h('sb_cook_sleep') });
const kid    = mk(T, { stand: h('sb_kid_stand'), sleep: h('sb_kid_sleep') });
const dog    = mk(T, { sleep: h('sb_dog_sleep'), wag: h('sb_dog_wag') });
const bird   = prop(T, 'sb_bird_sleep', HT.sb_bird_sleep);
const cradle = prop(T, 'sb_prop_cradle', HT.sb_prop_cradle);
const plates = Array.from({ length: 8 }, () => prop(T, 'sb_prop_plate', HT.sb_prop_plate));
const door   = mk(T, { closed: h('sb_prop_door_closed'), open: h('sb_prop_door_open') });
const curtain = prop(T, 'sb_prop_curtain', HT.sb_prop_curtain);
const gifts  = ['mirror', 'heart', 'bubble', 'shoes', 'note', 'flute'].map(g => prop(T, `sb_prop_gift_${g}`, HT[`sb_prop_gift_${g}`]));
const wheel  = prop(T, 'sb_prop_wheel', HT.sb_prop_wheel);
const threads = { short: prop(T, 'sb_prop_thread_short', HT.sb_prop_thread_short), mid: prop(T, 'sb_prop_thread_mid', HT.sb_prop_thread_mid), long: prop(T, 'sb_prop_thread_long', HT.sb_prop_thread_long) };
const bed    = prop(T, 'sb_prop_bed', HT.sb_prop_bed);
const candle = mk(T, { lit: h('sb_prop_candle_lit'), out: h('sb_prop_candle_out') });
const bush   = mk(T, { closed: h('sb_prop_bush_closed'), open: h('sb_prop_bush_open') });
const tree   = mk(T, { small: h('sb_prop_tree_small'), big: h('sb_prop_tree_big') });
const table  = prop(T, 'sb_prop_table', HT.sb_prop_table), shelf = prop(T, 'sb_prop_shelf', HT.sb_prop_shelf), bell = prop(T, 'sb_prop_bell', HT.sb_prop_bell);
const ALL = [pr, baby, king, queen, ...fairies, young, old, granny, prince, grandpa, maid, guardA, guardB, cook, kid, dog, bird, cradle, ...plates, door, curtain, ...gifts, wheel, ...Object.values(threads), bed, candle, bush, tree, table, shelf, bell];
ALL.forEach(hide);
T.director({ cast: { king, queen, princess: pr, fred: fairies[0], forange: fairies[1], fyellow: fairies[2], fgreen: fairies[3], fblue: fairies[4], fpurple: fairies[5], young, old, granny, prince, grandpa },
             noFace: ['king', 'queen', 'princess', 'fred', 'forange', 'fyellow', 'fgreen', 'fblue', 'fpurple', 'young', 'old', 'granny', 'prince', 'grandpa'] });
```

`T.director` 는 세로 화면에서만 말하는 배역에게 카메라를 붙인다(가로는 무대 전체가 보임). 방향은 장면에서 직접 정하므로 `noFace` 에 전부 넣는다. cast 키는 대본의 배역 키(§6)와 같아야 한다. 시녀·경비병·요리사·꼬마·동물은 목소리가 없어 cast 에 없다.

### 1-1. 자리표시(목업) 규칙 — 그림이 없을 때
`beauty_beast.js` 의 `placeholder()`·`sprite()`·`BGPH`·`bgImage()` 를 그대로 가져와 이 동화의 표로 바꾼다. 자리표시는 **그림과 같은 상자(w×h)** 안에 그리므로 그림이 생기면 코드 변경 없이 바뀐다. 이름표(`.phl`)는 뒤집혀도 글자가 뒤집히지 않게 `a.place` 를 덮어쓴 부분까지 같이 가져온다. 사람은 모두 **머리 지름 = 상자 높이의 .39**(2.5등신) 동그라미 + 몸 직사각으로 그린다(`r = h * .195`, 가로로 누운 상자는 머리를 왼쪽에).

| 그림 | 자리표시 모양 | 색 |
|---|---|---|
| `sb_pr_*` | 동그라미 머리(살구) + 분홍 긴 치마 사다리꼴 + 머리 위 금빛 땋은 머리 띠(왼쪽 어깨로 내려오는 금빛 세로 띠) + 작은 금빛 삼각 관. `lie` 는 가로 상자(머리 왼쪽, 몸 가로). `wake` 는 몸 절반. `baby_*` 는 흰 타원 포대기 + 같은 크기 머리(`r = 상자 폭 × .3`) | 살구 `#F3D9B8`, 치마 `#E7A2B2`, 머리카락 `#D9A94E`, 관 `#D9A94E` |
| `sb_king_*` | 머리 + 빨간 망토 직사각 + 금빛 관 띠 + 갈색 수염 반원 | `#A93B32`, `#D9A94E`, `#6B4A32` |
| `sb_queen_*` | 머리 + 남색 치마 사다리꼴 + 갈색 높은 머리(머리 위 타원) + 금빛 관 띠 | `#1F2A56`, `#6B4A32` |
| `sb_fairy_<색>_*`, `sb_young_*` | 머리 + 그 색 치마 사다리꼴 + 그 색 삼각 모자 + 갈색 세로 막대(지팡이, `wand` 는 머리 위 오른쪽으로 기울임). `young_peek` 은 머리+어깨만(상자 왼쪽) | 빨강 `#A93B32`, 주황 `#E8703A`, 노랑 `#D9A94E`, 초록 `#3F6B4F`, 파랑 `#3E7CB1`, 보라 `#7A4E86`, 하늘 `#9CC7DD` |
| `sb_old_*` | 머리 + 회색 망토 사다리꼴 + 흰 머리 반원 + 갈색 굽은 선(지팡이). `sulk` 는 입을 아래로 굽힌 선, `smile` 은 위로 | 회색 `#A9A39B`, 흰 `#F4F6FA` |
| `sb_granny_*` | 앉은 상자: 머리 + 갈색 몸 + 크림 두건(머리 둘레 띠) + 아래 갈색 걸상 직사각 | `#6B4A32`, `#F6ECD8` |
| `sb_prince_*` | 머리 + 초록 몸 직사각 + 금빛 관 띠. `tiptoe` 는 몸을 8° 기울임, `kneel` 은 몸 절반 높이 | `#3F6B4F`, `#D9A94E` |
| `sb_grandpa_point` | 머리 + 갈색 몸 + 금빛 넓은 모자 타원 + 흰 수염 반원 + 오른쪽으로 뻗은 팔 띠 | `#6B4A32`, `#D9A94E`, `#F4F6FA` |
| `sb_maid_*` `sb_guard_*` `sb_cook_*` `sb_kid_*` | 머리 + 몸 직사각(시녀 남색+크림 앞치마, 경비병 빨강+크림 둥근 투구, 요리사 주황+크림 앞치마+흰 높은 모자, 꼬마 초록+크림 앞치마). `*_sleep` 은 눈을 반달 선으로, 머리를 10° 기울임 | 팔레트 토큰 |
| `sb_dog_*` | 크림 타원 몸 + 갈색 귀 두 조각 + 점 눈(잠은 선) | `#F6ECD8`, `#6B4A32` |
| `sb_bird_sleep` | 금빛 작은 타원 + 주황 부리 삼각 | `#D9A94E`, `#E8703A` |
| `sb_prop_cradle` / `plate` / `door_*` / `curtain` / `wheel` / `thread_*` / `bed` / `candle_*` / `bush_*` / `tree_*` / `table` / `shelf` / `bell` / `gift_*` | 갈색 둥근 상자+아래 호 / 금빛 타원+진한 테 / 갈색 아치(열림은 가운데 어두운 띠) / 빨간 세로 직사각+금빛 띠 / 갈색 원 테+바퀴살 6+왼쪽 위로 기운 회색 막대 / 크림 세로 띠+아래 작은 원(길이는 상자 높이) / 갈색 틀+크림 매트+분홍 띠+위 금빛 천개 띠 / 크림 막대+주황 물방울(꺼짐은 회색 작은 선) / 초록 울퉁불퉁 타원 셋+빨간 점 5(열림은 가운데 세로 빈틈) / 갈색 막대+초록 원(큰 나무는 원 셋) / 갈색 윗판+양끝 다리 / 갈색 긴 판+크림 작은 직사각 2 / 금빛 종 모양 사다리꼴 / 각각 작은 색 도형(거울 금빛 타원, 하트 주황, 말풍선 크림 둥근 사각, 꽃신 초록 타원 2, 음표 파랑 원+막대, 피리 보라 막대) | 팔레트 토큰. **얼굴 없음** |
| 배경 `sb_bg_*` | 평평한 종이 한 장 + 바닥 띠(y 412~) + 요소 2~3개 + 위에 "(그림 자리) 배경: 이름" 글자. room: 벽 `#F6ECD8`·바닥 `#D9A94E`·왼쪽 위 아치 창·오른쪽 위 빨간 띠 / hall: 벽 크림·**식탁 띠(y 207~262, 윗면 `#D9A94E`, 앞면 `#6B4A32`)**·바닥 갈색 / stairs: 벽 `#B8AFA3`·왼쪽 아래→오른쪽 위 계단 직사각 9개 / tower: 벽 `#B8AFA3`·가운데 위 아치 창·바닥 금빛 / bedroom: 벽 크림·오른쪽 위 아치 창·바닥 금빛 / outside: 하늘 `#EEF3F7`·초록 언덕 2·가운데 위 크림 성 실루엣(탑 3)·풀 `#9DBB7A`·길 띠 / kitchen: 벽 크림·왼쪽 갈색 아궁이 아치+주황 불빛·바닥 `#B8AFA3` / chapel: 벽 크림·가운데 위 색유리 아치(빨강·금·초록·파랑 조각)·**식탁 띠(hall 과 같은 y)**·바닥 `#B8AFA3` |

자리표시 이름표 글자: 인물은 `WHO[who] + ' ' + POSE[pose]`(예: "공주 하품", "빨강 요정 지팡이"), 소품은 `PROPN[f]`(예: "금 접시"). 글자는 §6 과 무관(녹음 없음).

## 2. 공통 수치

### 2-1. 그림 비율(ASP, 폭/높이) — 시작값(그림이 오면 post_tale.py 값으로 바꾼다; preload 가 실제 비율로 덮어쓴다)
```
sb_pr_stand .45, sb_pr_climb .60, sb_pr_reach .72, sb_pr_yawn .47, sb_pr_lie 2.1, sb_pr_wake .62, sb_pr_wave .50, sb_pr_baby_sleep .78, sb_pr_baby_giggle .78,
sb_king_joy .72, sb_king_surprise .60, sb_king_command .50, sb_king_worry .46, sb_queen_joy .45, sb_queen_surprise .48, sb_queen_worry .45,
sb_fairy_*_stand .46 (여섯 다 같음), sb_fairy_*_wand .60, sb_young_stand .46, sb_young_peek .75, sb_young_wand .60,
sb_old_stand .50, sb_old_sulk .50, sb_old_smile .52, sb_granny_spin .78, sb_granny_startle .80, sb_prince_stand .47, sb_prince_tiptoe .55, sb_prince_kneel .72, sb_prince_wave .50,
sb_grandpa_point .70, sb_maid_stand .44, sb_maid_sleep .46, sb_guard_a_stand .46, sb_guard_a_sleep .46, sb_guard_b_stand .46, sb_guard_b_sleep .46, sb_cook_stand .58, sb_cook_sleep .58, sb_kid_stand .46, sb_kid_sleep .48,
sb_dog_sleep 1.6, sb_dog_wag 1.35, sb_bird_sleep 1.2,
sb_prop_cradle 1.25, sb_prop_plate 2.6, sb_prop_door_closed .52, sb_prop_door_open .52, sb_prop_curtain .75, sb_prop_wheel 1.15, sb_prop_thread_short .22, sb_prop_thread_mid .13, sb_prop_thread_long .09,
sb_prop_bed 1.45, sb_prop_candle_lit .35, sb_prop_candle_out .33, sb_prop_bush_closed 1.75, sb_prop_bush_open 1.75, sb_prop_tree_small .9, sb_prop_tree_big .8, sb_prop_table 2.1, sb_prop_shelf 3.0, sb_prop_bell .8, sb_prop_gift_* 1.0
```

### 2-2. 높이(HT) — 같은 인물은 자세가 달라도 같은 크기 (CLAUDE.md §4-1)
무대 1000×560, 바닥 `FL = 528`. **사람·요정은 모두 머리 지름 ≈ 80px**(2.5등신). 높이는 그림 상자가 아니라 **같은 부위(얼굴 폭 = 귀~귀)의 크기**가 같아지도록 정한다. 그림이 오면 `HT[자세] = HT[기준] × (fw_기준/H_기준) ÷ (fw_자세/H_자세)`(fw = 원본 PNG 에서 잰 얼굴 폭 px, H = 원본 bbox 높이 px)로 고치고, ±12% 밖이면 그 자세만 다시 생성한다.

| 그림 | HT 시작값 | 비고 |
|---|---|---|
| sb_pr_stand(기준), climb, reach, yawn, wave | **205** | |
| sb_pr_wake | 150 | 앉은 상체(치마 아래 숨음) |
| sb_pr_lie | 105 | 누운 상자(머리 왼쪽). 폭 ≈ 220 |
| sb_pr_baby_sleep, baby_giggle | 120 | 머리 지름은 80 그대로, 포대기 포함 |
| sb_king_* | 215 | 어른은 키만 조금 큼 |
| sb_queen_* | 212 | |
| sb_fairy_<색>_stand ×6, sb_young_stand | 205 | 한 줄 배치용. 여섯 다 같은 키·같은 폭이어야 한다(±5%) |
| sb_fairy_<색>_wand ×6, sb_young_wand | 215 | 지팡이 끝이 머리 위라 상자가 높다. 얼굴 폭으로 맞춘다 |
| sb_young_peek | 110 | 머리+어깨만. 머리 지름 80 이 되게 |
| sb_old_stand, old_sulk | 200 | 조금 굽음 |
| sb_old_smile | 205 | |
| sb_granny_spin | 165 | 걸상째 앉음. 머리 80 |
| sb_granny_startle | 175 | 반쯤 일어남 |
| sb_prince_stand, tiptoe, wave | 212 | |
| sb_prince_kneel | 165 | |
| sb_grandpa_point | 208 | |
| sb_maid_stand, maid_sleep | 210 | 잠든 자세도 서 있으므로 같은 키 |
| sb_guard_a_*, sb_guard_b_* | 215 | |
| sb_cook_* | 212 | |
| sb_kid_* | 195 | 아이: 머리 80, 몸 작음 |
| sb_dog_sleep | **56** | 웅크림. 머리 ≈ 40 |
| sb_dog_wag | 72 | 머리 폭을 sleep 과 맞춤 |
| sb_bird_sleep | **28** | |
| sb_prop_cradle | 150 | 폭 ≈ 190. 아기 자리 `CRADLE_BABY = [0, -72]`(요람 중심·바닥 기준 아기 발끝; 받은 그림의 매트 선에 맞춰 ±10) |
| sb_prop_plate | 26 | 폭 ≈ 68 |
| sb_prop_door_closed, door_open | 300 | |
| sb_prop_curtain | 330 | 폭 ≈ 248 |
| sb_prop_wheel | 150 | 폭 ≈ 172. 가락 끝 `SPINDLE = [-70, -128]`(물레 중심·바닥 기준; 받은 그림에서 가락 끝을 재서 ±12) |
| sb_prop_thread_short / mid / long | 70 / 120 / 176 | 굵기가 같아야 한다: 받은 뒤 `HT = 굵기 기준`으로 다시 잰다(짧은 실 폭 ≈ 15 가 되게 셋을 같은 비율로) |
| sb_prop_bed | 240 | 천개 포함. 폭 ≈ 348. 매트 윗선 `BED_TOP = -95`(침대 중심·바닥 기준; 받은 그림 ±10), 베개 쪽이 왼쪽 |
| sb_prop_candle_lit, candle_out | 90 | |
| sb_prop_bush_closed, bush_open | 300 | 폭 ≈ 525. 열린 틈 가운데 = 중심 x |
| sb_prop_tree_small / tree_big | 110 / 300 | |
| sb_prop_table | 110 | 폭 ≈ 230. 아래 빈 공간 높이 ≈ 90 |
| sb_prop_shelf | 60 | 폭 ≈ 180. 새 자리 = 선반 오른쪽 `(shelf.x + 45, shelf.y - 52)`(판 윗선 ±6) |
| sb_prop_bell | 70 | |
| sb_prop_gift_* | 44 | 4장 선물 그림(코드로 떠오름) |

`s`(축소)는 세로 화면의 2·11장 줄(`S_ROW = .36`, 2·11장 요정 여덟·접시·문·늙은 요정에 공통)에만 쓴다. 그 밖에 원근 축소는 없다.

### 2-3. 그림이 보는 쪽(NAT) — 뒤집기 규칙
`mk()` 는 `NAT` 가 `'front'` 가 아니고 원하는 쪽과 다르면 좌우로 뒤집는다. 이동·퇴장할 때는 `to:` 로 **가는 쪽**을 준다.

| 그림 | NAT | 비고 |
|---|---|---|
| sb_pr_stand, yawn, wake, wave, baby_* | front | 안 뒤집음 |
| sb_pr_climb, sb_pr_reach | **right** | 6장 계단(오른쪽 위로), 7장 가락(오른쪽 물레) |
| sb_pr_lie | left(머리 왼쪽) | 누운 그림은 뒤집지 않는다 |
| sb_king_*, sb_queen_*, sb_fairy_*, sb_young_stand, sb_young_wand, sb_old_smile, sb_prince_stand, sb_prince_wave, sb_maid_*, sb_guard_*, sb_cook_*, sb_kid_* | front | 걸을 때 `to:` 를 줘도 앞모습이라 안 뒤집힘(뒤집지 않는다) |
| sb_young_peek | **left** | 커튼 오른쪽에 숨어 왼쪽으로 내다봄 |
| sb_old_stand, sb_old_sulk | **left** | 문(오른쪽)에서 들어와 왼쪽을 봄. 3·5장 요람 쪽(왼쪽)을 본다 |
| sb_granny_spin, sb_granny_startle | **left** | 할머니는 오른쪽에 앉아 왼쪽(공주·물레)을 본다 |
| sb_grandpa_point | **right** | 덤불(오른쪽)을 가리킴 |
| sb_prince_tiptoe | **right** | 9장 덤불 속으로, 10장 왼쪽에서 들어옴 |
| sb_prince_kneel | **left** | 침대 오른쪽에서 왼쪽(공주)을 봄 |
| sb_dog_sleep, sb_dog_wag, sb_bird_sleep | left | 그대로 |
| 소품 | front | 물레는 가락이 왼쪽 위(NAT left, 안 뒤집음) |

### 2-4. 겹침 순서(z)
`put()` 은 `T.world` 맨 뒤(가장 앞)에 붙인다. 뒤에 있어야 하는 것을 먼저 `put` 한다.
- 1장: 왕·왕비 → 요람 → 아기(요람 안, 맨 앞).
- 2장: 접시 7 → 요정 7(왼쪽부터) → 문 → 늙은 요정(들어올 때 문 앞). 짝 맞춤 줄은 `T.world` 맨 앞(접시·요정 위에 겹쳐도 띠가 보이게).
- 3장: 접시 7 → 왕비·왕 → 막내 요정 → 커튼 → 늙은 요정 → 문. (막내 요정이 커튼 뒤로 숨을 때 커튼이 앞에 있어야 한다.)
- 4장: 요람 → 아기 → 왕·왕비(오른쪽 뒤) → 요정(들어오는 순서대로, 맨 앞) → 선물 그림(맨 앞).
- 5장: 물레(왼쪽 구석) → 요람 → 아기 → 왕·왕비 → 커튼 → 막내 요정 → 늙은 요정(맨 앞).
- 6장: 계단 컷은 공주만. 꼭대기 방: 물레 → 실 셋 → 할머니 → 공주(맨 앞).
- 7장: 꼭대기 방 같음 + 왕·왕비(달려옴, 맨 앞). 침실 컷: 촛대 → 침대 → 공주 누움 → 왕비·왕.
- 8장: 촛대 → 침대 → 공주 누움 → 강아지(바닥 앞) → 시녀·경비병 a·요리사·꼬마·경비병 b(왼쪽부터) → 막내 요정(맨 앞, 걸어 다님). 바깥 컷: 나무 → 덤불(맨 앞).
- 9장: 나무 → 덤불 → 할아버지 → 왕자(맨 앞). 왕자가 덤불 틈으로 들어갈 때는 덤불 **뒤**로 가야 하므로 `T.world.insertBefore(prince.pos, bush.pos)` 뒤 이동.
- 10장: 선반 → 새 → 탁자 → 강아지(탁자 아래, 탁자 **뒤**가 아니라 앞: 탁자 다리 사이는 비어 있으니 앞에 둬도 된다) → 요리사 → 꼬마 → 경비병 b → 왕자(맨 앞).
- 11장: 촛대 → 침대 → 공주(누움→깨어남) → 왕자(무릎) → 시녀·요리사·꼬마·경비병 a(기지개). 예배당 컷: 접시 8 → 요정 8(뒤 줄) → 종 → 왕·왕비 → 공주·왕자(맨 앞).

### 2-5. 세로 화면 규칙
- `P` 일 때 보이는 폭은 약 260. 한 컷에 **둘까지만** 보이게 좌표를 모으고(`X(l, p)` 의 p 값), 셋 이상은 `director`/`follow` 가 말할 때 데려온다.
- **아이가 눌러야 하는 것은 모두 그 순간 화면(카메라 ±130) 안**: 1장 요람(500), 2장 두 줄(`S_ROW` 로 줄 전체가 372~596 에 들어옴), 6장 실 셋(물레 540 둘레 ±60), 9장 덤불(700, 카메라 600), 10장 네 사람·동물(430~665, 카메라 540), 11장 인사(500).
- 카메라 y 는 280, z 는 1 로 고정. 줌 없음.
- 2·11장 줄은 `S_ROW` 로 한 번에 보인다(원근: 멀리 보이는 큰 홀). 그 밖의 장면은 사람 크기를 바꾸지 않는다.

### 2-6. 누르는 자리 크기
- 톡·고르기 대상은 화면에서 **짧은 변 60 무대 px 이상**. 작은 것(실 가닥 폭 15, 새 28, 강아지 56, 접시 줄)은 `hitBox()`(§5-1)·`hitRect()`(§5-2)로 투명 사각을 깔아 넓힌다. `T.tap`/`T.choose` 에는 그 `hit` 요소를 넘긴다.
- 톡 대상은 기다리는 동안 살짝 들썩인다: `bob(a.pos)`(beauty_beast.js 의 `bob`).

### 2-7. 속도 (한 편 7분 이상이 목표)
- `say()` 뒤 `GAP = 600`ms. 장면 끝(다음 `sceneCard` 전) `sleep(SCENE_END = 1400)`.
- 사람이 걷는 이동은 `WALK = 2600`ms 안팎(linear) + 걷는 동안 `a.hop(4, 420)` 반복(`while` + `await hop`). 늙은 요정·할아버지는 `hop(3, 560)`(느리게).
- 전체 목표 7~8.5분. §11 에서 잰다. 7분이 안 되면 `SCENE_END` 를 1900, `GAP` 을 800 으로; 9분을 넘으면 `SCENE_END` 1100(대사는 건드리지 않는다).
- 컷 그림(`cutImage`)은 **5장**(§3 끝 "컷신" 표; `CUT_HOLD = 4200`ms, 컷 위에서 기존 대사 한 줄을 읽는다 — 까치 방식). 컷 홀드는 전체 길이에 약 20초를 더한다.

## 3. 장면별 상세

표기: `L(x)` 가로, `P(x)` 세로 좌표. 대사는 §6 표의 번호. 효과음 이름은 `sounds/sfx/` 파일명(§7). 모든 장면은 `await T.sceneCard(tr('이름'), () => { … }, focus.pos)` 로 넘어간다(1장만 `T.curtain(true)`). 팝 좌표는 모두 머리 위(`FL - HT - 45`)다.

### 장면 1. 기다리던 아기 (톡 1 — 요람, 첫 조작)
- `scene('sb_bg_room')`. 왕 `joy` L360/P395, `FL`; 왕비 `joy` L640/P605, `FL`; 요람 **500**, `FL + 4`; 아기 `sleep` 를 `(cradle.x + CRADLE_BABY[0], cradle.y + CRADLE_BABY[1])`. `hitBox(T, cradle, 230, 180)`. P: `camSnap(500)`. `await T.curtain(true)`.
- **L1** → `sleep(300)` → **L2**(왕, `hop(8, 300)`) → `bob(cradle.pos)` → `await T.tap(cradle.hit)`(안내 문장 없음 — 손가락 힌트만). 시작 버튼부터 톡 가능까지 ≤ 15초(§11).
- 톡 뒤: 요람 흔들림 `cradle.wiggle(5, 700)` 두 번(`await` 연속) + `sfx(T, 'creak', .3)`; 400ms 뒤 아기 `look('giggle')` + `sfx(T, 'giggle', .6)` + `sfx(T, 'bell', .35)` + `T.pop(500, FL - 232, tr('까르르'))` + `T.pop(560, FL - 262, tr('딸랑'), '#D9A94E')`(요람 위 하늘 자리, 왕·왕비 얼굴(y ≈ FL-180) 밖) → **L3** → `sleep(SCENE_END)`.

### 장면 2. 접시 일곱, 요정 여덟 (배움 놀이 1: 많고 적음, 2문제)
- `sceneCard(tr('접시 일곱, 요정 여덟'))`, 배경 `sb_bg_hall`(식탁은 배경 안, 윗선 `TABLE_Y`). 자리: `SX = i => X(SLOT(i), SLOTP(i))`, `RS = X(1, S_ROW)`. 접시 7: `put(T, plates[i], SX(i), TABLE_Y + 2, { s: RS })`(i 0..6, 접시 바닥이 식탁 윗선). 요정 7: `put(T, fairies[i], SX(i), FL, { look: 'stand', s: RS })`(i 0..5) + `put(T, young, SX(6), FL, { look: 'stand', s: RS })`. 문 `closed` L970/P650, `FL`, `s: RS`. focus: young. P: `camSnap(500)`.
- **L4** → 문: `door.look('open')` + `sfx(T, 'door', .5)` → 늙은 요정 `put(T, old, X(1080, 690), FL, { look: 'stand', to: 'left', s: RS })` → `old.move(SX(7), FL, WALK, 'linear')` + `hop(3, 560)` 반복 + `sfx(T, 'step_wood', .3)` 를 650ms 마다 → **L5** 는 이동과 동시에. 도착하면 `door.look('closed')`.
- 누르는 자리 둘(§5-2): `rowPlates = hitRect(T, X(60, 352), TABLE_Y - 40, X(880, 300), 70)`(접시 줄 전체), `rowFairies = hitRect(T, X(60, 352), FL - 215 * RS, X(880, 300), 215 * RS + 10)`(요정 줄 전체). 두 사각은 `T.world` 맨 앞. 세로에서는 두 사각 모두 352~652 라 화면(370~630) 안에 거의 들어온다.
- 짝 맞춤(`matchUp()`): i = 0..6 차례로 `strip(T, SX(i), TABLE_Y + 2 + 10 * RS, FL - 205 * RS - 6)`(접시 아래에서 요정 머리 위까지 세로 띠, §5-3) + `sfx(T, 'paper_tap', .3)` + `vo('count' + (i + 1))`(해설이 작게 "하나~일곱") + `await sleep(520)`. P: 띠를 긋는 동안 `follow(SX(i))` 는 하지 않는다(줄 전체가 보임). 끝나면 늙은 요정(i = 7)만 띠가 없으므로 `glow(old, 1400)` + `old.hop(8, 400)`. `clearStrips()` 는 띠를 `opacity 1→0` 300ms 뒤 `remove()`.
- **Q1**(안내) → `await T.choose([{ el: rowFairies, ok: true }, { el: rowPlates, ok: false, onWrong: async () => { await matchUp(); await say(W1); await clearStrips(); } }], { prompt: Q1 })`.
  - 정답(요정 줄): `AudioFX.ding()`(엔진) → `await matchUp()` → **C1** → 띠는 **남겨 둔 채** Q2 로.
  - 오답(접시 줄): 같은 짝 맞춤을 보여 주고 W1, 띠를 지우고 한 번 더 고르게 한다(엔진이 2회 오답부터 정답 줄을 빛내고 흐린다).
- **Q2** → `await T.choose([{ el: rowPlates, ok: true }, { el: rowFairies, ok: false, onWrong: async () => { await matchUp(); await say(W2); } }], { prompt: Q2 })`(이미 띠가 있으면 `matchUp` 은 그리지 않고 `sleep(600)` 만).
  - 정답: `ding` → 접시 일곱 차례로 `glow(plates[i], 500)` 120ms 간격 + `sparkleSfx(T)` → **C2**.
- `clearStrips()` → **L6** 과 동시에 늙은 요정에게 조명: `tint(T, '#2E241C', 0)` 을 `T.world` 맨 앞에 두고 늙은 요정 자리에 둥근 구멍을 뚫는 대신 간단히 **늙은 요정만 `glow(old, 2000)` + 다른 일곱 요정·접시 `opacity .45`(400ms)** → `sleep(SCENE_END)`.
- 어느 쪽을 눌러도 다음 장면은 같다. 숫자 카드·숫자 글자는 화면에 넣지 않는다.

### 장면 3. 잊힌 요정 (자동)
- `sceneCard(tr('잊힌 요정'))`, 배경 `sb_bg_hall`. 접시 7 을 `SLOT(0..6)`(가로·세로 같은 좌표, `s: 1`) 에 그대로(세로에서는 왼쪽 접시가 화면 밖이어도 된다). 왕비 `surprise` L300/P430, `FL`, `to:'right'`; 왕 `surprise` L420/P510, `FL`, `to:'right'`; 막내 요정 `stand` L580/P590, `FL`; 커튼 L760/P700, `FL`(높이 330, 윗단이 식탁 윗선 위로 솟는다 — 그대로 둔다); 늙은 요정 `sulk` L870/P760, `FL`, `to:'left'`; 문 `closed` L985/P870, `FL`. 여섯 요정은 이 장면에 없다(줄 저쪽에 있는 것으로 둔다). focus: old. P: `camSnap(620)`.
- **L7** → **L8**(늙은 요정, `wiggle(2, 700)` 한 번, 팝 없음) → **L9**(왕, `hop(6, 300)`) → **L10**(막내 요정) 과 동시에 커튼 뒤로: `young.move(curtain.x + 10, FL, 900, 'ease-in')`(커튼이 앞이라 가려진다) → 도착하면 `young.look('peek', 'left')` + `young.place(curtain.x - curtain.w / 2 - 25, FL)`(머리만 커튼 왼쪽으로 내다봄, `PEEK_DX = -(curtain.w / 2 + 25)`) → `sleep(SCENE_END)`.

### 장면 4. 여섯 가지 선물 (자동)
- `sceneCard(tr('여섯 가지 선물'))`, 배경 `sb_bg_room`. 요람 500, `FL + 4`; 아기 `sleep` 요람 안; 왕 `joy` L720/P660, `FL`; 왕비 `joy` L820/P740, `FL`. 선물 자리 `GIFT_X = X(400, 410)`(요람 왼쪽, 요정이 오른쪽을 보고 선다 — 앞모습이라 뒤집지 않음). focus: cradle. P: `camSnap(470)`.
- i = 0..5 차례로(`for`):
  1. `put(T, fairies[i], X(-80, 250), FL, { look: 'stand' })` → `move(GIFT_X, FL, 1800, 'linear')` + `hop(4, 420)` 반복 + `step_wood` .25.
  2. `fairies[i].look('wand')` → `twinkle(T, fairies[i].x + WAND_TIP[0], FL + WAND_TIP[1], COLOR[i])`(§5-4, `WAND_TIP = [+58, -222]`: 요정 발끝 기준 지팡이 끝, 받은 그림 ±12) + `sparkleSfx(T)` → 선물 그림: `put(T, gifts[i], 500, FL - 120)` `fadeIn(300)` → `gifts[i].move(500, FL - 236, 1600, 'ease-out')` + 끝에 `fadeOut(T, gifts[i], 400)`(아기 머리 위를 지나 올라가 사라진다. 팝 없음 — 선물 이름은 말로만).
  3. **L11~L16**(i 번째 요정, 이동 끝난 뒤 읽는다; 선물 그림이 올라가는 동안 말한다).
  4. `fairies[i].look('stand')` → 대기 자리로: `move(X(50 + 70 * i, -200), FL, 900, 'ease-out')`(가로: 왼쪽에 겹쳐 서 있음 50~400 — 여섯째는 `GIFT_X` 에 그대로 두지 말고 400 으로; 세로: 화면 밖 왼쪽으로 나간다).
- **L17** + 아기 `hop(3, 500)` 두 번 → `sleep(SCENE_END)`.

### 장면 5. 백 년 잠 (자동)
- `sceneCard(tr('백 년 잠'))`, 배경 `sb_bg_room`. 물레 **L150/P330**, `FL`(방 왼쪽 구석); 요람 500, `FL + 4`; 아기 `sleep`; 왕 `worry` L700/P650, `FL`; 왕비 `worry` L800/P720, `FL`; 커튼 L900/P790, `FL`; 막내 요정 `peek` 를 `(curtain.x + PEEK_DX, FL)`(커튼 왼쪽으로 머리만); 늙은 요정 `sulk` L380/P420, `FL`, `to:'right'`(요람을 본다 — NAT left 라 뒤집힘). focus: old. P: `camSnap(540)`.
- **L18**(늙은 요정, `wiggle(2, 800)` 한 번. 번개·어두운 틴트 없음) → 막내 요정 나옴: `young.look('stand')` + `young.place(curtain.x + PEEK_DX, FL)` → `move(X(620, 600), FL, 1200, 'ease-out')` + `hop(4, 420)` → `young.look('wand')` + `twinkle(T, young.x + WAND_TIP[0], FL + WAND_TIP[1], '#9CC7DD')` + `sparkleSfx(T)` → **L19**(막내 요정) → `young.look('stand')`.
- **L20**(왕 `look('command')`, `hop(8, 300)`) → 물레 퇴장: `wheel.wiggle(3, 500)` + `sfx(T, 'rattle', .4)` + `T.pop(wheel.x, FL - 195, tr('덜컹'), '#6B4A32')` → `wheel.move(X(-250, 100), FL, 1800, 'ease-in')` + `rattle` 한 번 더(900ms) → `hide(wheel)` → **L21** → 왕 `look('worry')` → `sleep(SCENE_END)`.

### 장면 6. 탑 꼭대기 물레 (배움 놀이 2: 길고 짧음, 2문제)
- 컷 A(계단): `sceneCard(tr('탑 꼭대기 물레'))`, 배경 `sb_bg_stairs`. 공주 `climb` L140/P140, `FL`, `to:'right'`. P: `camSnap(300)`.
- **L22** → **L23** 과 동시에 계단 오르기: `STEPS = [[320, 452], [500, 376], [680, 300], [860, 224]]`(배경 계단 윗선을 따라 올라가는 발끝 좌표; 받은 배경의 계단에 맞춰 ±16) 를 차례로 `pr.move(x, y, 900, 'linear')` + 매 이동마다 `hop(6, 300)` 두 번 + `step_wood` .3. P: 매 이동 `follow(x, 900)`. L23 이 끝나고 이동도 끝나면 `sleep(400)`.
- 컷 B(꼭대기 방, 같은 장면 안): `await veil(T, () => { T.clear(); bgImage(T, 'sb_bg_tower'); camSnap(X(500, 520), 280, 1); 할머니 spin L640/P640, FL, to:'left'; 물레 L540/P540, FL; 실 셋; 공주 stand L380/P400, FL; })`.
  - 실 셋: `order = ['short', 'mid', 'long'].sort(() => Math.random() - .5)`(매번 무작위) → `TX = [wheel.x - 52, wheel.x, wheel.x + 52]`, 윗끝 `TY = FL - 150`(물레 윗선; 받은 그림 ±10) → `put(T, threads[order[k]], TX[k], TY + HT[그 실])`(발끝 = 실 아래 끝) + `hitBox(T, threads[k], 60, HT + 24)`.
- **L24**(공주) → **L25**(할머니, `wiggle(2, 600)`) → **Q3**(안내) → `await T.choose(order.map((k, i) => ({ el: threads[k].hit, ok: k === 'long', onWrong: async () => { await wiggleEl(T, threads[k].pos); await showPair(k, 'long'); await say(k === 'short' ? W3a : W3b); } })), { prompt: Q3 })`.
  - `showPair(k, target)`: 두 실을 **나란히 세워 길이를 보여 준다** — 고른 실과 정답 실을 복제하지 않고, 두 실 `pos` 를 `translate` 로 잠깐 가운데(`wheel.x ± 20`)로 모았다가(600ms) 제자리로 돌린다(600ms). `sfx(T, 'swish', .3)`.
  - 정답: `ding` → `glow(threads.long, 1200)` + 긴 실이 살짝 **펴진다**: `threads.long.body.animate([{transform:'scaleY(1)'},{transform:'scaleY(1.08)'},{transform:'scaleY(1)'}], 700)` + `sparkleSfx(T)` + `T.pop(threads.long.x, TY - 40, tr('반짝!'))`(물레 위 공중, 할머니 얼굴 밖) → **C3**.
- **Q4** → `await T.choose(order.map((k, i) => ({ el: threads[k].hit, ok: k === 'short', onWrong: async () => { await wiggleEl(T, threads[k].pos); await showPair(k, 'short'); await say(k === 'long' ? W4a : W4b); } })), { prompt: Q4 })` → 정답: `glow(threads.short, 1200)` + `sparkleSfx` + 팝 '반짝!' → **C4** → `sleep(SCENE_END)`.

### 장면 7. 콕, 스르르 (자동)
- `sceneCard(tr('콕, 스르르'))`, 배경 `sb_bg_tower`, 6장 컷 B 배치 그대로(실 셋도 그대로, hitBox 없음). focus: pr. P: `camSnap(520)`.
- **L26**(공주, `hop(8, 300)`) → `pr.look('reach', 'right')` → `pr.move(wheel.x + SPINDLE[0] - 74, FL, 700, 'ease-out')`(손끝이 가락 끝에 닿는 자리: `REACH_TIP = [+74, -118]` 공주 발끝 기준 손끝, 받은 그림 ±10) → `sleep(250)` → **콕**: `twinkle(T, pr.x + REACH_TIP[0], FL + REACH_TIP[1], '#F6ECD8', 4, 26)`(작은 크림 별빛) + `sfx(T, 'sparkle', .3)` + `T.pop(pr.x, FL - 250, tr('콕!'))`(공주 머리 위) → `sleep(500)`.
- `pr.look('yawn')` + `T.pop(pr.x + 60, FL - 250, tr('하암'), '#8A7A60')` → **L27**(공주) → 할머니 `look('startle')` + `hop(6, 300)` → **L28**(할머니) → 왕·왕비 달려옴: `put(T, king, X(-80, 300), FL, { look: 'worry' })`, `put(T, queen, X(-160, 240), FL, { look: 'worry' })` → `king.move(X(240, 420), FL, 1400, 'linear')`, `queen.move(X(140, 330), FL, 1400, 'linear')` + 둘 다 `hop(6, 320)` 반복 + `step_wood` .35 → `sleep(300)`.
- 침실 컷(같은 장면 안): `await veil(T, () => { T.clear(); bgImage(T, 'sb_bg_bedroom'); camSnap(500, 280, 1); 촛대 lit L240/P380, FL; 침대 500, FL + 6; 공주 lie (bed.x - 8, bed.y + BED_TOP) (머리 베개 쪽=왼쪽); 왕비 worry L700/P640, FL; 왕 worry L800/P720, FL; })`.
- **L29**(왕비, `wiggle(2, 700)`) → `sleep(SCENE_END)`.

### 장면 8. 모두 잠들어요 (자동)
- `sceneCard(tr('모두 잠들어요'))`, 배경 `sb_bg_bedroom`. 촛대 `lit` L240/P380, `FL`; 침대 500, `FL + 6`; 공주 `lie`; 강아지 `wag` L600/P560, `FL`(아직 깨어 있음); 시녀 `stand` L660/P640, 경비병 a `stand` L740/P720, 요리사 `stand` L820/P800, 꼬마 `stand` L890/P870, 경비병 b `stand` L960/P940(모두 `FL`); 막내 요정 `wand` L430/P470, `FL`. 말은 없다(§머리말 ①). focus: young. P: `camSnap(470)`.
- **L30**(막내 요정, `hop(6, 300)`) → 재우기(차례 고정: 강아지 → 시녀 → 경비병 a → 요리사 → 꼬마 → 경비병 b): 각 차례마다 `young.move(대상.x - 70, FL, 700, 'linear')` + `hop(4, 420)` → P: `follow(대상.x - 30, 700)` → `twinkle(T, young.x + WAND_TIP[0], FL + WAND_TIP[1], '#9CC7DD', 4, 30)` + `sfx(T, 'doop', .35)` → 대상 `look('sleep')` + `T.pop(대상.x, FL - 대상.h - 45, tr('쿨쿨'), '#1F2A56')` + `T.tone([320, 220], .3, { type: 'sine', vol: .08 })` → `sleep(650)`. 팝은 머리 위(얼굴 밖).
- **L31** 과 동시에: 0ms `candle.look('out')` + `sfx(T, 'blow', .4)` + `tint(T, '#1F2A56', 0)` 을 만들어 opacity 0→.22 1,200ms; **1,800ms** 바깥 컷: `await veil(T, () => { T.clear(); bgImage(T, 'sb_bg_outside'); camSnap(X(500, 600), 280, 1); 나무 small L880/P860, FL; 덤불 closed L700/P700, FL; })` → 덤불이 자란다: `bush.body.animate([{ transform: 'scale(.12)' }, { transform: 'scale(1)' }], { duration: 2400, easing: 'ease-out', fill: 'forwards' })`(body 의 원점이 발끝이라 바닥에서 솟는다) + `sfx(T, 'whoosh', .35)` + `T.pop(700, FL - 345, tr('스르륵'), '#3F6B4F')`(덤불 위 공중) → 애니메이션이 끝나면 `bush.body.style.transform = ''` → L31 이 끝나면 `sleep(SCENE_END)`.

### 장면 9. 백 년 뒤 (톡 2 — 가시덤불)
- `sceneCard(tr('백 년 뒤'))`, 배경 `sb_bg_outside`. 나무 `small` L880/P860, `FL`; 덤불 `closed` **L700/P700**, `FL`, `hitBox(T, bush, 540, 320)`. 할아버지·왕자는 아직 없음. focus: bush. P: `camSnap(600)`.
- **L32** 와 동시에 해·달(§5-5): `sunMoon(T)` 가 해 → 달 → 해 → 달 → 해 다섯 번 하늘을 가로지른다(각 1,100ms, 밤은 `tint '#1F2A56'` .25 를 켰다 끈다). 세 번째(해) 지날 때 `tree.look('big')` + `tree.hop(6, 400)` + `sfx(T, 'pop', .3)`. L32 가 끝나면 해·달을 지운다.
- 할아버지 `put(T, grandpa, X(-100, 280), FL, { look: 'point', to: 'right' })` → `move(X(220, 390), FL, WALK, 'linear')` + `hop(3, 560)`; 300ms 뒤 왕자 `put(T, prince, X(-200, 200), FL, { look: 'tiptoe', to: 'right' })` → `move(X(340, 480), FL, WALK, 'linear')` + `hop(4, 420)` → 도착하면 `prince.look('stand')`. `step_grass` .3 을 700ms 마다.
- **L33**(할아버지, `hop(4, 400)`) → **L34**(왕자, `hop(8, 300)`) → `bob(bush.pos)` → `await T.tap(bush.hit)`(안내 문장 없음, 손가락 힌트만).
- 톡 뒤: `bush.wiggle(2, 500)` → `bush.look('open')` + `sfx(T, 'swish', .45)` + `T.pop(700, FL - 345, tr('스르륵'), '#3F6B4F')` → **L35** 와 동시에 왕자가 들어간다: `prince.look('tiptoe', 'right')` → `T.world.insertBefore(prince.pos, bush.pos)`(덤불 뒤로) → `prince.move(700, FL, 2200, 'linear')` + `hop(4, 420)` + `step_grass` → 도착하면 `fadeOut(T, prince, 500)`(성 안으로) → `sleep(SCENE_END)`.

### 장면 10. 잠든 궁전 (배움 놀이 3: 위·아래·옆, 3문제)
- `sceneCard(tr('잠든 궁전'))`, 배경 `sb_bg_kitchen`. 선반 **L760/P470**, y **150**(벽 위쪽; `prop` 의 y 는 선반 판 아래선); 새 `sleep` `(shelf.x + 45, shelf.y - 52)`(판 위), `hitBox(T, bird, 90, 90)`; 탁자 **L300/P430**, `FL`; 강아지 `sleep` `(table.x, FL)`(탁자 아래 빈 공간, 탁자보다 뒤에 put 하지 말고 앞에), `hitBox(T, dog, 120, 100)`; 요리사 `sleep` L560/P525, `FL`; 꼬마 `sleep` **L640/P585**, `FL`(요리사 바로 옆, 간격 80), `hitBox(T, kid, 110, 210)`; 경비병 b `sleep` L880/P665, `FL`, `hitBox(T, guardB, 120, 230)`; 왕자 `tiptoe` 는 왼쪽 밖 L-80/P300 에서 L150/P395 로 `move(…, FL, 2000, 'linear')` + `hop(4, 420)` + `step_wood` .2. focus: cook. P: `camSnap(540)`(네 대상 430~665 가 410~670 안).
- **L36**(왕자, 이동 뒤) + `T.pop(prince.x, FL - 257, tr('쉿'), '#1F2A56')` → **L37**.
- 보기 넷: `opts = { dog: dog.hit, bird: bird.hit, kid: kid.hit, guard: guardB.hit }`. 세 문제 차례로(순서 고정):
  1. **Q5** → `await T.choose([{ el: opts.dog, ok: true }, ...['bird','kid','guard'].map(k => ({ el: opts[k], ok: false, onWrong: async () => { await wiggleEl(T, 그 배우.pos); await say(W5); } }))], { prompt: Q5 })` → 정답: `ding` → `glow(dog, 1200)` + `sparkleSfx` + `T.pop(dog.x, FL - 150, tr('반짝!'))`(탁자 위 공중) → **C5**.
  2. **Q6** → 같은 모양, 정답 `bird`, 오답 W6 → `glow(bird, 1200)` + 팝 `(bird.x, bird.y - 80)` → **C6**.
  3. **Q7** → 정답 `kid`, 오답 W7 → `glow(kid, 1200)` + 팝 `(kid.x, FL - 240)` → **C7**.
  - 이미 맞힌 대상도 보기로 남지만 오답 처리(W 로 다시 안내)된다. 2회 오답부터 정답이 빛난다(엔진).
- `sleep(SCENE_END)`.

### 장면 11. 깨어나요 (톡 3 — 인사)
- `sceneCard(tr('깨어나요'))`, 배경 `sb_bg_bedroom`. 촛대 `lit` L240/P380, `FL`; 침대 500, `FL + 6`; 공주 `lie`; 왕자 `kneel` **L660/P610**, `FL`, `to:'left'`(침대 오른쪽에서 공주를 봄); 뒤쪽 벽 앞에 시녀 `sleep` L120/P330, 요리사 `sleep` L860/P720, 꼬마 `sleep` L940/P800(모두 `FL`). focus: pr. P: `camSnap(540)`.
- **L38** 과 동시에: 1,200ms 뒤 `twinkle(T, bed.x, bed.y + BED_TOP - 60, '#F2B366', 6, 60)` + `sparkleSfx` → 공주 `look('wake')` + `pr.place(bed.x - 20, bed.y + BED_TOP + 8)`(앉은 상체가 매트 위) + `hop(5, 400)`.
- **L39**(공주) → **L40**(왕자 `look('stand')`, `hop(6, 300)`) → **L41** 과 동시에 시녀·요리사·꼬마 `look('stand')` + 각 `hop(10, 360)`(200ms 간격) + `sfx(T, 'boing', .3)` + 팝 없음(기지개는 동작만).
- 예배당 컷(같은 장면 안): `await veil(T, () => { T.clear(); bgImage(T, 'sb_bg_chapel'); camSnap(500, 280, 1); 접시 8: put(plates[i], SX(i), TABLE_Y + 2, {s: RS}) i 0..7; 요정 8 뒤 줄: fairies[0..5] stand, young stand, old smile 를 SX(i), FL - 70, {s: RS}(식탁 앞 한 줄, 7번째 막내·8번째 늙은 요정); 종 bell (500, 118)(가운데 위 창 아래); 왕 joy L150/P300, 왕비 joy L850/P700, FL; 공주 wave L460/P462, 왕자 wave L540/P538, FL(맨 앞); })`. 세로에서는 뒤 줄이 `S_ROW` 로 작게, 앞의 공주·왕자는 `s: 1`(원근).
- **L42** 와 동시에 `sfx(T, 'bell', .5)` + `bell.wiggle(12, 900)` 두 번 + `T.pop(500, 60, tr('딸랑'), '#D9A94E')`; "접시도 여덟 개" 즈음(L42 시작 4,200ms) 접시 여덟 차례로 `glow(plates[i], 400)` 100ms 간격.
- **L43**(늙은 요정, `hop(6, 400)`) → 인사 톡: `hitRect(T, 0, 80, 1000, 480)` 로 **화면 전체**를 누르는 자리로 두고 `bob(pr.pos)` → `await T.tap(allHit)`(안내 문장 없음).
- 톡 뒤: 공주·왕자 `look('wave')` + 모두(`fairies`, young, old, king, queen, pr, prince) `hop(10, 400)` 120ms 간격 + `T.confetti()`(꽃잎 대신 엔진 종이 조각) + `sfx(T, 'tada', .5) || sparkleSfx(T)` → **L44** → `T.finale(); await sleep(1500); return '아무도 빼놓지 않아요. 잊힌 사람의 마음은 아프답니다.';`
- 이 동화의 마지막 인사형 톡은 이것이다.

### 컷신 (그림 컷) — CLAUDE.md §5-2, 까치(`tales/magpie`)·신데렐라 방식 (2026-10-21 추가)
- 컷 **5장**. 컷은 그 사건 **직후**에만 띄우고, 컷 위에서 그 장면의 **기존 대사 한 줄**을 읽는다: `const c = T.cutImage([{ src: src('sb_cut_…'), sfx: '…', hold: CUT_HOLD }], { hold: CUT_HOLD }); await say(L); await c;` (`CUT_HOLD = 4200`ms; 대사가 홀드보다 길면 컷이 먼저 닫혀도 된다; 톡하면 바로 넘어간다 — 엔진 `cutImage`, `engine/tale.js` 619행). 컷 패널은 엔진이 4:3 흰 테두리 종이로 보여 주므로 그림도 4:3 으로 만든다.
- 그림: `assets/v3w/sb_cut_<이름>.webp`(1200×900). 작업표 `jobs_sleeping_beauty.json` 의 `kind: "cut"` 항목 **5장**(`pass 4`, 참고 그림 `refs` 는 그 컷에 나오는 인물의 스프라이트 — 스프라이트가 모두 나온 뒤에 만든다). 후처리: `post_tale.py` 는 sprite/bg 만 다루므로 컷은 `post_cinderella2.py` 처럼 4:3 가운데 자르기 → 1200×900 webp 로 따로 변환한다(그림·코드 작업은 뒤의 큐에서; 이 문서는 기획만).
- 규칙: 한 장면에 한 컷, 이웃한 장면에 연달아 두지 않는다. 컷 안 인물은 스프라이트와 같은 얼굴 규칙(점 눈·점 코·띠 입·분홍 볼), 소품은 얼굴 없음, 피·눈물·아픔 없음. 컷 위 대사는 모두 §6 에 **이미 있는 줄**이라 새 녹음이 없다(영어는 `voice_script_en.json` 의 같은 줄, `TEXT_EN` 추가 없음). 컷이 닫힌 뒤 무대는 그 장면의 다음 단계부터 이어진다(컷이 대신한 애니메이션은 생략해도 된다).

| 컷 id | 장면 | 앞 장면 → 뒤 장면 | 보여 줄 순간 | 그림 구도(얼굴 규칙 포함) | 컷 위 대사(한국어 / 영어) | 컷 동안 음성 | 효과음 | refs |
|---|---|---|---|---|---|---|---|---|
| `sb_cut_eighth` | 2 접시 일곱, 요정 여덟 | 1 기다리던 아기 → 3 잊힌 요정 | 큰 사건: 잔치에 여덟 번째 요정(잊힌 요정)이 문을 열고 들어오는 순간 | 큰 홀. 긴 식탁 위 금 접시 일곱, 그 뒤 한 줄로 선 요정 일곱이 모두 오른쪽을 돌아보며 둥근 입(놀람). 오른쪽 끝 열린 아치문으로 지팡이를 짚은 잿빛 늙은 요정이 작게 들어온다(무섭지 않게, 부드러운 얼굴). 요정 머리 크기 모두 같음. | **L5** 그런데 저기, 요정이 한 명 더 왔어요! / But look, over there! One more fairy has come! | 있음 — 컷 음성 필요: L5 | `door` | sb_fairy_red_stand · sb_old_stand · sb_prop_plate · sb_prop_door_open |
| `sb_cut_blessing` | 5 백 년 잠 | 4 여섯 가지 선물 → 6 탑 꼭대기 물레 | 막내 요정이 저주를 되돌리는 순간("백 년이 지나면 깨어날 거예요") — 밝고 희망찬 쪽을 컷으로 잡는다 | 가운데 갈색 요람 속 잠든 아기, 그 옆 하늘색 막내 요정이 지팡이를 높이 들고 지팡이 끝에서 하늘색 종이 별과 큰 크림 별이 터진다. 왼쪽 끝 잿빛 늙은 요정은 토라져 등을 반쯤 돌리고 지팡이를 짚는다(무섭지 않음). 오른쪽에 크림 커튼. | **L19** 영영이 아니에요. 백 년이 지나면 깨어날 거예요. 그리고 왕자님이 올 거예요. / Not never. After a hundred years she will wake up. And a prince will come. | 있음 — 컷 음성 필요: L19 | `sparkle` | sb_young_wand · sb_old_sulk · sb_prop_cradle · sb_pr_baby_sleep |
| `sb_cut_prick` | 7 콕, 스르르 | 6 탑 꼭대기 물레 → 8 모두 잠들어요 | 큰 사건: 공주가 물레 가락 끝에 손가락을 대는 순간(콕 — 피 없음, 손끝의 작은 별빛만) | 탑 꼭대기 방. 공주가 오른쪽 물레의 가락 끝으로 손가락 하나를 내밀고, 손끝에 작은 크림 별 넷(핏방울·액체 없음). 눈은 벌써 반쯤 감기고 부드러운 졸린 웃음. 오른쪽 걸상의 할머니는 두 손을 들고 깜짝(둥근 입). | **L27** 아야… 졸려요… / Ouch... I'm so sleepy... | 있음 — 컷 음성 필요: L27 | `sparkle` | sb_pr_reach · sb_granny_startle · sb_prop_wheel |
| `sb_cut_hedge` | 9 백 년 뒤 | 8 모두 잠들어요 → 10 잠든 궁전 | 가시덤불이 왕자에게만 길을 열어 주는 순간(톡 뒤) | 초록 가시덤불이 가운데서 커튼처럼 양쪽으로 갈라져 길이 나고 분홍 꽃잎이 몇 장 날린다. 초록 옷 왕자가 틈으로 들어가는 뒷모습 반측면(한 손 들고 발끝 걸음). 멀리 뒤에 크림 성(금 지붕). 왼쪽에 큰 금색 모자 할아버지가 작게 서서 가리킨다. 낮(세트 A). | **L35** 가시덤불이 왕자님에게만 길을 열어 주었어요. / The thorn hedge opened a path, just for the prince. | 있음 — 컷 음성 필요: L35 | `swish` | sb_prince_tiptoe · sb_prop_bush_open · sb_grandpa_point |
| `sb_cut_wake` | 11 깨어나요 | 10 잠든 궁전 → (끝: 예배당 컷·인사) | 결말: 백 년이 차서 공주가 스스로 눈을 뜨는 순간 | 침실. 천개 침대에서 공주가 상체를 일으켜 앉아 눈을 크게 뜨고 밝게 웃는다(땋은 머리 어깨 위, 두 손은 크림 이불 위). 머리 위에 앰버 종이 별이 부드럽게 터진다. 오른쪽 침대 옆에 왕자가 무릎을 꿇고 공주를 보며 환히 웃는다. 왼쪽에 켜진 촛대. | **L38** 바로 그때, 백 년이 꽉 찼어요. 공주님이 스스로 눈을 떴어요. / Just then, the hundred years were up. The princess opened her eyes all by herself. | 있음 — 컷 음성 필요: L38 | `sparkle` | sb_pr_wake · sb_prince_kneel · sb_prop_bed |

컷 음성 필요(모두 §6 의 기존 줄, 새 줄 없음): L5, L19, L27, L35, L38.

## 4. 배움 놀이 규칙 요약 (엔진 `T.choose`)
- **2장 많고 적음**: 보기는 줄 둘(요정 줄·접시 줄, 개별 요정·접시가 아니다). ① 더 많은 쪽 = 요정 줄, ② 더 적은 쪽 = 접시 줄. 짝 맞춤 띠(코드)로 "요정 한 명은 접시가 없다"를 눈으로 보이고, 세기는 `vo('count1'~'count7')` 로 해설이 작게 따라 셀 뿐 아이에게 세라고 하지 않는다. 12초 무입력이면 `prompt` 를 다시 읽는다. 2회 오답부터 정답 줄이 빛나고 나머지는 흐려진다(엔진). 어느 쪽을 눌러도 3장은 같다.
- **6장 길고 짧음**: 보기 실 셋(자리 무작위). ③ 제일 긴 실, ④ 제일 짧은 실. 오답이면 고른 실과 정답 실을 잠깐 나란히 세워 길이를 보여 준다(`showPair`).
- **10장 위·아래·옆**: 보기 넷(강아지·새·꼬마·경비병, 자리 고정). ⑤ 탁자 아래 강아지, ⑥ 선반 위 새, ⑦ 요리사 옆 꼬마. 오답이면 흔들림 + 그 문제의 W 한 줄.
- 오답 설명 뒤 바로 다시 고를 수 있다. 게임오버 없음. 셋 다 줄거리와 무관하다. 자동 재생(`auto_play`)에서는 엔진이 정답을 대신 누른다.

## 5. 코드로 그리는 것 (그림 없이)

### 5-1. 누르는 자리 넓히기 `hitBox(T, a, w, h)`
red_car.js 와 같다: 배우 `a.pos` 의 **맨 앞 자식으로** 투명 사각(`fill: '#000', 'fill-opacity': 0`, x `-w/2`, y `-h`)을 넣고(`a.pos.insertBefore(rect, a.body)`), `a.hit = a.pos`. `fill: none` 은 pointer-events 를 안 받으니 쓰지 않는다.

### 5-2. 줄 전체 누르기 자리 `hitRect(T, x, y, w, h)`
`T.el('rect', { x, y, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, T.world)` 를 돌려준다(맨 앞). 2장의 접시 줄·요정 줄, 11장 인사(화면 전체)에 쓴다. `T.choose` 의 `el` 에 그대로 넘기면 손가락 힌트는 사각 가운데를 가리킨다.

### 5-3. 짝 맞춤 줄 `strip(T, x, y0, y1)`
색지 띠 한 장: `T.paper(T.world, [['rect', { x: -5, y: 0, width: 10, height: y1 - y0, rx: 5, fill: '#E8703A' }]], { transform: `translate(${x},${y0})`, filter: 'url(#pp)' })` → 위에서 아래로 자라는 애니메이션 `g.animate([{ transform: `translate(${x}px,${y0}px) scaleY(0)` }, { transform: `translate(${x}px,${y0}px) scaleY(1)` }], { duration: 350, easing: 'ease-out', fill: 'forwards' })`(`transform-origin` 은 기본 0 0 이라 위끝 고정). 만든 띠는 `strips[]` 에 모아 `clearStrips()` 가 지운다. 숫자·글자 없음.

### 5-4. 반짝 `twinkle(T, x, y, color, n = 5, r = 46)`
작은 네 꼭짓점 별 n 개(`T.paper` 로 path `M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2Z`, fill = color, `filter: 'url(#pp)'`)를 (x, y) 에 만들고 각각 각도 `i / n × 2π` 방향으로 `r` 만큼 퍼지며 `scale .4 → 1.2 → .3`, `opacity 1 → 0` 900ms(`delay i × 40`) 뒤 `remove()`. 쓰는 곳: 4장 지팡이 빛(요정 색 `COLOR = ['#A93B32', '#E8703A', '#D9A94E', '#3F6B4F', '#3E7CB1', '#7A4E86']`), 5·8장 막내 요정(`#9CC7DD`), 7장 손끝(`#F6ECD8`, n 4, r 26 — 작고 조용히), 11장 깨어남(`#F2B366`).

### 5-5. 해·달 `sunMoon(T)` (9장)
해: `T.paper(T.world, [['circle', { r: 34, fill: '#F2B366' }]], { filter: 'url(#pp)' })`; 달: `['path', { d: 'M0,-30 A30,30 0 1,1 0,30 A22,22 0 1,0 0,-30Z', fill: '#F6ECD8' }]`. 한 번 지나가기: `g.animate([{ transform: 'translate(-60px,250px)' }, { transform: 'translate(500px,70px)', offset: .5 }, { transform: 'translate(1060px,250px)' }], { duration: 1100, easing: 'linear' })` 뒤 `remove()`. 달이 뜰 때 `tint(T, '#1F2A56', 0)` 를 0→.25(300ms), 질 때 .25→0(300ms). 해·달·틴트는 `T.world`/`T.bg` 에 두되 덤불·나무보다 **뒤**(`T.world.insertBefore(g, T.world.firstChild)`). 다섯 번(해·달·해·달·해) 연속, 세 번째에 나무가 커진다(§3 장면 9).

### 5-6. 같은 장면 안 배경 바꾸기 `veil(T, change)`
red_car.js 와 같다: 크림 종이 `rect`(x -60, y -40, 1120×660, fill `#F5EFE9`, opacity 0) → 0→1 **350ms** → `change()` → 1→0 **350ms** → `remove()`. 6장 A→B, 7장 탑→침실, 8장 침실→바깥, 11장 침실→예배당에서 쓴다. 효과음 `paper_turn` 은 넣지 않는다.

### 5-7. 밤 틴트
`tint(T, '#1F2A56', 0)` → opacity 0→.22(8장 촛불 꺼짐, 1,200ms), 9장 달이 뜰 때 .25. 유채색(보라·남색 그림자) 금지 규칙은 그림자 얘기이고, 밤 틴트는 Deep Indigo 를 낮은 투명도로 덮는 기존 방식(미녀와 야수 1장)이라 그대로 쓴다.

## 6. 대사 전체 (voice_script_el.json 과 글자 하나까지 같다)
- `say()` 에 넘기는 한국어 문장은 아래 표와 **정확히** 같아야 녹음이 붙는다(한 글자라도 다르면 클립이 없어 조용히 넘어간다 → §11 `_audio.json` 으로 잡는다).
- 배역 키(목소리): nar(해설, **Huelyn**) king(왕, Namchun) queen(왕비, Bella) princess(공주, Annie) fred(빨강 요정, Lily) forange(주황, Sarah) fyellow(노랑, Laura) fgreen(초록, Jessica) fblue(파랑, Chaemong) fpurple(보라, Busan SS) young(막내 요정, Yun) old(잊힌 요정, Haemi) granny(물레 할머니, MJay) prince(왕자, Eric) grandpa(할아버지, Bongpal). 열다섯 배역이 모두 다른 목소리다. 시녀·경비병·요리사·꼬마·동물은 목소리 없음.
- 톡 안내 문장은 없다(1·9·11장 톡은 손가락 힌트만). 고르기 안내(Q1~Q7)는 `say()` 로 읽은 뒤 같은 문장을 `prompt` 로 넘긴다(12초 재안내).
- 말풍선 없는 소리(`extra`, `vo(key)`): `count1`~`count7`(하나·둘·셋·넷·다섯·여섯·일곱, 해설이 아주 작게) — 2장 짝 맞춤 띠를 그을 때 한 개씩. 화면에 숫자는 없다.

| # | 장면 | 배역 | 한국어 (`say()`에 넘기는 문장 그대로) | 영어 | 쓰임 |
|---|---|---|---|---|---|
| L1 | 1 | 해설 | 왕과 왕비는 오래오래 아기를 기다렸어요. 드디어 예쁜 공주님이 태어났어요! | The king and queen waited a long, long time for a baby. At last, a lovely little princess was born! |  |
| L2 | 1 | 왕 | 온 나라 사람들을 불러 잔치를 열자! | Let's invite the whole kingdom and hold a feast! |  |
| L3 | 1 | 해설 | 아기는 까르르 웃었어요. | The baby giggled, tee-hee! | 요람 톡 뒤 |
| L4 | 2 | 해설 | 요정 일곱 명을 아기의 대모로 모셨어요. 금 접시도 일곱 개 놓았지요. | Seven fairies were invited to be the baby's godmothers. Seven golden plates were set out for them. |  |
| L5 | 2 | 해설 | 그런데 저기, 요정이 한 명 더 왔어요! | But look, over there! One more fairy has come! | 문 열림·늙은 요정 입장 |
| Q1 | 2 | 해설 | 요정과 금 접시, 어느 쪽이 더 많아요? 더 많은 쪽을 톡 눌러요. | Fairies or golden plates, which are there more of? Tap the side that has more. | 고르기 안내 ①(prompt) |
| W1 | 2 | 해설 | 접시 하나에 요정 한 명… 어, 요정이 남았어요. 요정이 더 많아요. 다시 골라 봐요. | One plate for one fairy... oh, a fairy is left over. There are more fairies. Try again. | ① 오답(접시 줄) |
| C1 | 2 | 해설 | 맞아요. 요정이 더 많아요. 요정 한 명은 접시가 없네요. | That's right. There are more fairies. One fairy has no plate. | ① 정답 |
| Q2 | 2 | 해설 | 그럼 더 적은 쪽은 어느 쪽일까요? 더 적은 쪽을 톡 눌러요. | Then which side has fewer? Tap the side that has fewer. | 고르기 안내 ②(prompt) |
| W2 | 2 | 해설 | 요정은 더 많은 쪽이에요. 더 적은 쪽을 찾아봐요. | The fairies are the side with more. Find the side with fewer. | ② 오답(요정 줄) |
| C2 | 2 | 해설 | 맞아요. 접시가 더 적어요. 일곱 개뿐이에요. | That's right. There are fewer plates. Only seven. | ② 정답 |
| L6 | 2 | 해설 | 접시가 없는 요정은 누구일까요? | Which fairy has no plate? | 이음새(늙은 요정에게 조명) |
| L7 | 3 | 해설 | 탑에 너무 오래 살아서 모두가 잊어버린 요정이었어요. | It was the fairy who had lived in a tower so long that everyone had forgotten her. |  |
| L8 | 3 | 잊힌 요정 | 내 접시는 없구나… 나만 빼놓다니. | There is no plate for me... They left me out. |  |
| L9 | 3 | 왕 | 어이쿠, 깜빡했어요. 미안해요. | Oh dear, I forgot. I'm sorry. |  |
| L10 | 3 | 막내 요정 | 나는 맨 나중에 말할래. | I'll speak last. | 커튼 뒤로 |
| L11 | 4 | 빨강 요정 | 예쁜 얼굴을 줄게. | I give you a pretty face. |  |
| L12 | 4 | 주황 요정 | 상냥한 마음을 줄게. | I give you a kind heart. |  |
| L13 | 4 | 노랑 요정 | 고운 말씨를 줄게. | I give you sweet words. |  |
| L14 | 4 | 초록 요정 | 사뿐사뿐 춤을 줄게. | I give you light, graceful dancing. |  |
| L15 | 4 | 파랑 요정 | 꾀꼬리 같은 노래를 줄게. | I give you a song like a songbird. |  |
| L16 | 4 | 보라 요정 | 피리 솜씨를 줄게. | I give you the gift of playing the flute. |  |
| L17 | 4 | 해설 | 아기는 쌔근쌔근 웃었어요. | The baby smiled softly in her sleep. |  |
| L18 | 5 | 잊힌 요정 | 열여섯 살이 되면 물레 바늘에 찔려 영영 깨어나지 않는 깊은 잠에 빠질 거야. | When she turns sixteen, she will prick her finger on a spindle and fall into a deep sleep from which she will never wake. |  |
| L19 | 5 | 막내 요정 | 영영이 아니에요. 백 년이 지나면 깨어날 거예요. 그리고 왕자님이 올 거예요. | Not never. After a hundred years she will wake up. And a prince will come. | 커튼에서 나옴 |
| L20 | 5 | 왕 | 온 나라의 물레를 모두 치워라! | Take away every spindle in the whole kingdom! |  |
| L21 | 5 | 해설 | 물레는 모두 사라졌어요. | Every spindle was gone. | 물레 퇴장 뒤 |
| L22 | 6 | 해설 | 공주님이 열여섯 살이 되던 날, 왕과 왕비는 멀리 나들이를 갔어요. | On the day the princess turned sixteen, the king and queen went away on a journey. |  |
| L23 | 6 | 해설 | 공주님은 성 구석구석을 돌아다니다 탑 꼭대기까지 올라갔어요. | The princess wandered all around the castle, and climbed up to the very top of the tower. | 계단 오르기 위 |
| L24 | 6 | 공주 | 할머니, 뭐 하세요? | Grandma, what are you doing? |  |
| L25 | 6 | 물레 할머니 | 실을 잣고 있단다. 물레를 치우라는 말은 못 들었거든. | I'm spinning thread, dear. Nobody told me the spindles had to go. |  |
| Q3 | 6 | 해설 | 할머니가 실을 잣고 있어요. 제일 긴 실은 어느 것일까요? 톡 눌러요. | Grandma is spinning thread. Which thread is the longest? Tap it. | 고르기 안내 ③(prompt) |
| W3a | 6 | 해설 | 그 실은 제일 짧아요. 제일 긴 실을 찾아봐요. | That thread is the shortest. Find the longest one. | ③ 오답(짧은 실) |
| W3b | 6 | 해설 | 그 실보다 더 긴 실이 있어요. 다시 찾아봐요. | There is a thread longer than that one. Look again. | ③ 오답(중간 실) |
| C3 | 6 | 해설 | 맞아요. 이 실이 제일 길어요. | That's right. This thread is the longest. | ③ 정답 |
| Q4 | 6 | 해설 | 그럼 제일 짧은 실은 어느 것일까요? 톡 눌러요. | Then which thread is the shortest? Tap it. | 고르기 안내 ④(prompt) |
| W4a | 6 | 해설 | 그 실은 제일 길어요. 제일 짧은 실을 찾아봐요. | That thread is the longest. Find the shortest one. | ④ 오답(긴 실) |
| W4b | 6 | 해설 | 그 실보다 더 짧은 실이 있어요. 다시 찾아봐요. | There is a thread shorter than that one. Look again. | ④ 오답(중간 실) |
| C4 | 6 | 해설 | 맞아요. 이 실이 제일 짧아요. | That's right. This thread is the shortest. | ④ 정답 |
| L26 | 7 | 공주 | 저도 해 볼래요! | Let me try too! |  |
| L27 | 7 | 공주 | 아야… 졸려요… | Ouch... I'm so sleepy... | 콕 뒤 |
| L28 | 7 | 물레 할머니 | 어머나, 큰일 났네! 누구 없어요? | Oh my, oh dear! Is anybody there? |  |
| L29 | 7 | 왕비 | 우리 아가, 막내 요정 말대로 백 년을 자는구나. | My darling, just as the youngest fairy said, you will sleep a hundred years. | 침실 컷 |
| L30 | 8 | 막내 요정 | 공주님이 혼자 깨면 외로울 거야. 모두 함께 자요. | The princess would be lonely waking up alone. Let's all sleep together. |  |
| L31 | 8 | 해설 | 촛불도 잠들고, 성 둘레에는 가시덤불이 높이높이 자랐어요. | The candles went to sleep too, and all around the castle, a thorn hedge grew higher and higher. | 촛불·덤불 위 |
| L32 | 9 | 해설 | 백 년이 흘렀어요. 낮과 밤이 몇 번이나 지났을까요. | A hundred years went by. How many days and nights passed? | 해·달 위 |
| L33 | 9 | 할아버지 | 저 안에 공주님이 백 년째 자고 있대요. | They say a princess has been sleeping in there for a hundred years. |  |
| L34 | 9 | 왕자 | 제가 가 볼게요. | I'll go and see. |  |
| L35 | 9 | 해설 | 가시덤불이 왕자님에게만 길을 열어 주었어요. | The thorn hedge opened a path, just for the prince. | 덤불 톡 뒤 |
| L36 | 10 | 왕자 | 쉿, 다들 자고 있어요. | Shh, everyone is sleeping. |  |
| L37 | 10 | 해설 | 왕자님은 발소리를 죽이고 걸었어요. | The prince walked on tiptoe, as quietly as he could. |  |
| Q5 | 10 | 해설 | 모두 쿨쿨 자요. 탁자 아래에서 자는 강아지를 찾아봐요. | Everyone is fast asleep. Find the puppy sleeping under the table. | 고르기 안내 ⑤(prompt) |
| W5 | 10 | 해설 | 거긴 아니에요. 탁자 아래를 봐요. | Not there. Look under the table. | ⑤ 오답 |
| C5 | 10 | 해설 | 맞아요. 강아지가 탁자 아래에서 자요. | That's right. The puppy is sleeping under the table. | ⑤ 정답 |
| Q6 | 10 | 해설 | 선반 위에서 자는 새를 찾아봐요. | Find the bird sleeping on the shelf. | 고르기 안내 ⑥(prompt) |
| W6 | 10 | 해설 | 거긴 아니에요. 선반 위를 봐요. | Not there. Look on the shelf. | ⑥ 오답 |
| C6 | 10 | 해설 | 맞아요. 새가 선반 위에서 자요. | That's right. The bird is sleeping on the shelf. | ⑥ 정답 |
| Q7 | 10 | 해설 | 요리사 옆에서 자는 꼬마를 찾아봐요. | Find the little boy sleeping next to the cook. | 고르기 안내 ⑦(prompt) |
| W7 | 10 | 해설 | 거긴 아니에요. 요리사 옆을 봐요. | Not there. Look next to the cook. | ⑦ 오답 |
| C7 | 10 | 해설 | 맞아요. 꼬마 요리사가 요리사 옆에서 자요. | That's right. The little cook is sleeping next to the cook. | ⑦ 정답 |
| L38 | 11 | 해설 | 바로 그때, 백 년이 꽉 찼어요. 공주님이 스스로 눈을 떴어요. | Just then, the hundred years were up. The princess opened her eyes all by herself. |  |
| L39 | 11 | 공주 | 왕자님이세요? 오래 기다렸어요. | Is that you, Prince? I've waited so long. |  |
| L40 | 11 | 왕자 | 안녕하세요, 공주님. | Hello, Princess. |  |
| L41 | 11 | 해설 | 성 안의 모두가 기지개를 켰어요. | Everyone in the castle stretched and woke up. |  |
| L42 | 11 | 해설 | 그날 저녁 예배당에서 결혼식을 올렸지요. 이번에는 요정 여덟 명을 모두 불렀어요. 접시도 여덟 개! | That evening they were married in the chapel. This time, all eight fairies were invited. And eight plates, too! | 예배당 컷 |
| L43 | 11 | 잊힌 요정 | 나도 불러 줘서 고마워. | Thank you for inviting me too. |  |
| L44 | 11 | 해설 | 모두 손을 흔들며 인사했어요. 안녕! | Everyone waved and said goodbye. Bye-bye! | 인사 톡 뒤 |

`run()` 반환 문구(끝 화면)는 `'아무도 빼놓지 않아요. 잊힌 사람의 마음은 아프답니다.'`(`ui` 에 영어 있음). 부제 `'아무도 빼놓지 않아요'`. 교훈은 **대사로 읽지 않는다**.

## 7. 효과음 (sounds/sfx/<이름>.mp3, `AudioFX.sfx(name, vol)`)

| 장면 | 순간 | 이름 | 비고 |
|---|---|---|---|
| 1 | 요람 흔들림 | `creak` (.3) | |
| 1 | 아기 웃음 | `giggle` (.6) + `bell` (.35) | 팝 '까르르' '딸랑' |
| 2 | 문 열림 | `door` (.5) | |
| 2·4·6·7·9·10 | 걷기 | `step_wood` (.2~.35) / 9장 `step_grass` (.3) | 650~700ms 마다 |
| 2 | 짝 맞춤 띠 | `paper_tap` (.3) + `vo('countN')` | 띠 하나마다 |
| 2·6·10·11 | 정답 | `sparkle` (.4, 없으면 tone 700→1400) | 팝 '반짝!' + 엔진 `ding` |
| 4·5·8·11 | 지팡이 빛·별빛 | `sparkle` (.4) / 8장 `doop` (.35) | 7장 손끝은 `sparkle` .3 |
| 5 | 물레 퇴장 | `rattle` (.4) ×2 | 팝 '덜컹' |
| 6 | 두 실 나란히 | `swish` (.3) | |
| 7 | 콕 | `sparkle` (.3) | 팝 '콕!' '하암'. **피·울음 없음** |
| 8 | 쿨쿨 | `T.tone([320,220], .3)` | 팝 '쿨쿨' ×6 |
| 8 | 촛불 꺼짐 | `blow` (.4) | |
| 8 | 덤불 자람 | `whoosh` (.35) | 팝 '스르륵' |
| 9 | 나무 커짐 | `pop` (.3) | |
| 9 | 덤불 열림 | `swish` (.45) | 팝 '스르륵' |
| 10 | 쉿 | (없음) | 팝 '쉿' |
| 11 | 기지개 | `boing` (.3) | |
| 11 | 종 | `bell` (.5) | 팝 '딸랑' |
| 11 | 끝 | `tada` (.5) + `T.confetti()` | |
| 전환 | 책장 넘기기 | 엔진 기본 | |
| 톡·고르기 | 누름/정답/오답 | 엔진 `AudioFX.tap/ding/miss` | |

`creak`·`giggle`·`bell`·`door`·`step_wood`·`step_grass`·`paper_tap`·`sparkle`·`doop`·`rattle`·`swish`·`blow`·`whoosh`·`pop`·`boing`·`tada` 는 모두 `sounds/sfx/` 에 있다(2026-10-21 확인). 그래도 `sfx(T, name, vol, fb)` 의 `fb` 로 `T.tone` 대체음을 둔다(`doop` → `T.tone([520, 380], .12, { vol: .12 })`, `bell` → `T.tone([1320, 1760], .25, { type: 'sine', vol: .12 })`).

## 8. 카탈로그 항목 (`tales/catalog.js`, `red_car` 항목 뒤)
```js
  { id: 'sleeping_beauty', title: '잠자는 숲속의 공주', origin: 'world', also: ['princess'], skills: ['size', 'position', 'heart'], ready: false, making: true,
    line: '요정 줄과 접시 줄 중 더 많은 쪽, 제일 긴 실과 짧은 실, 탁자 아래·선반 위·요리사 옆. 잊힌 요정의 마음을 만나고, 아무도 빼놓지 않아요.',
    en: { title: 'The Sleeping Beauty', line: 'More or fewer, longest and shortest, under the table, on the shelf, next to the cook. Meet the forgotten fairy, and leave no one out.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.gd}"/>
      <rect x="30" y="62" width="100" height="26" rx="6" fill="${c.bk}"/><rect x="36" y="54" width="88" height="14" rx="5" fill="${c.sn}"/><rect x="36" y="44" width="30" height="12" rx="4" fill="${c.cr}"/>
      <circle cx="52" cy="48" r="13" fill="${c.sk}"/><path d="M39 46 a13 13 0 0 1 26 0 v3 q-6 -7 -13 -6 q-7 -1 -13 6z" fill="${c.gd}"/><path d="M64 48 q8 6 6 18" stroke="${c.gd}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M48 52 q2 1.5 4 0 M56 52 q-2 1.5 -4 0" stroke="${c.ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M50 56 q2 1.5 4 0" stroke="${c.rd}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <rect x="72" y="56" width="52" height="12" rx="3" fill="${c.ck}"/>
      <circle cx="136" cy="60" r="14" fill="none" stroke="${c.bk}" stroke-width="4"/>${[0, 60, 120].map(a => `<path d="M136 46 v28" stroke="${c.bk}" stroke-width="2.5" transform="rotate(${a} 136 60)"/>`).join('')}<path d="M126 48 l-10 -14" stroke="${c.gy}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="22" cy="30" r="7" fill="${c.rd}"/><circle cx="14" cy="42" r="5" fill="${c.rd}"/><path d="M10 50 q10 -22 24 -28" stroke="${c.pn}" stroke-width="3" fill="none"/></g>` },
```
태그: `size`(많고 적음 + 길고 짧음)·`position`(위·아래·옆)·`heart`(잊힌 요정). `count` 는 달지 않는다(PLAN 확정). 홈 카드 그림은 코드 SVG(크림 바탕, 금빛 바닥 띠, 침대에 누운 금빛 땋은 머리 공주, 오른쪽 물레, 왼쪽 위 장미 덩굴).

## 9. 썸네일·키아트 (인물 그림이 다 나온 뒤)

| 결과 파일 | 원본 | 만드는 법 |
|---|---|---|
| `assets/thumbs/sleeping_beauty_key_wide.webp` (1672×941) | `assets/raw/keyart_gpt/sleeping_beauty_wide_v5.png` | PIL: RGB → 16:9 가운데 자르기 → 1672×941 → webp quality 86 (`back_to_webp.py` 와 같은 식) |
| `…_key_tall.webp` (1086×1448) | `…_tall_v5.png` | 3:4 가운데 자르기 → 1086×1448 |
| `…_tile.webp` (720×540) | `…_tile_v5.png` | 4:3 가운데 자르기 → 720×540. `assets/thumbs/tiles.js` 의 `TILES` 에 `'sleeping_beauty'` 추가 |
| `…_back_wide.webp` (1200×800) · `…_back_tall.webp` (1000×1150) | `…_backw_v5.png` · `…_backt_v5.png` | `~/.venvs/paper-tale/bin/python tools/app/gen/back_to_webp.py sleeping_beauty` |
| `assets/thumbs/thumbs.js` | — | `THUMBSKEY` 에 `"sleeping_beauty"`, `THUMBSKEYLIGHT["sleeping_beauty"] = "#f5efe9"`, `BACKACCENT["sleeping_beauty"] = "#D9A94E"`(끝 화면 리본: Straw Gold). |

키아트 창 모양은 **둥근 탑 창(원)** 이고, 테두리 장식은 장미 덩굴 두 가닥뿐(§7-5: 소품 금지, 같은 계열 장식 최소). 창 안은 침대에 잠든 공주 + 물레(피 없음, 눈 감음). 끝 화면 뒷표지는 예배당에서 손 흔드는 공주·왕자와 웃는 늙은 요정·막내 요정, 뒤에 접시 여덟. 참고 그림은 작업표의 `refs`(pr_stand·prince_stand·fairy_red_stand·old_sulk / 끝 화면은 pr_wave·prince_wave·old_smile·young_stand)라 **인물 스프라이트가 모두 나온 뒤** 맨 마지막에 생성한다. 썸네일(타일)은 공주를 크게, 겹 3개.

## 10. 그림 목록 (작업표 `jobs_sleeping_beauty.json` 97장과 같다)

모든 인물은 **머리 지름이 같다**(2.5등신). 자세 그림은 기준 그림을 `refs` 로 넣고 프롬프트에 "SAME SCALE AS THE REFERENCE SPRITE(머리·몸 크기를 기준 그림과 똑같이)"가 들어 있다(§4-1). 소품은 얼굴 없음(`This is an OBJECT … NO face`). 잠든 자세는 눈을 감은 선 두 개, 눈물·아픔 없음. 물레 가락은 깨끗한 끝(핏방울·액체·반짝 없음).

| 구분 | id (`assets/v3w/sb_<id>.webp`) | 설명·방향 | 작업표 크기 | pass | 장면 |
|---|---|---|---|---|---|
| 인물·공주 | pr_stand (기준, 모든 사람 머리 크기의 기준) | 앞모습, 금빛 땋은 머리, 분홍 드레스 | 600² | 1 | 6, 11 |
| | pr_baby_sleep / pr_baby_giggle | 흰 포대기, 머리는 어른과 같은 크기 | 480² | 2 | 1·4·5 / 1 |
| | pr_climb(→) / pr_reach(→, 손끝 빈손) / pr_yawn / pr_lie(누움, 머리 왼쪽, 840×480) / pr_wake(앉은 상체) / pr_wave | | 600² (lie 840×480) | 2 | 6 / 7 / 7 / 7·8·11 / 11 / 11 |
| 인물·왕 | king_joy (기준) / king_surprise / king_command / king_worry | 수염, 금관, 빨간 망토 | 600² | 2 / 3 | 1·4·11 / 3 / 5 / 5·7 |
| 인물·왕비 | queen_joy (기준) / queen_surprise / queen_worry | 높은 갈색 머리, 남색 드레스 | 600² | 2 / 3 | 1·4·11 / 3 / 5·7 |
| 인물·요정 여섯 | fairy_{red,orange,yellow,green,blue,purple}_stand (기준, 같은 키·같은 폭) / _wand(지팡이 들어 올림) | 날개 없음, 옷 색·머리 모양이 저마다 다름 | 600² | 2 / 3 | 2·11 / 4 |
| 인물·막내 요정 | young_stand (기준) / young_peek(머리만, 커튼 왼쪽으로) / young_wand | 하늘색 | 600² | 2 / 3 / 3 | 2·3·5·8·11 / 3·5 / 5·8 |
| 인물·잊힌 요정 | old_stand (기준, 무표정, ←) / old_sulk(삐죽, ←) / old_smile(웃음, 앞) | 흰 머리, 회색 망토, 굽은 지팡이. 무섭지 않음 | 600² | 2 / 3 / 3 | 2 / 3·5 / 11 |
| 인물·물레 할머니 | granny_spin (기준, 걸상째 앉음, ←, 물레 없음) / granny_startle | 두건, 갈색 옷 | 600² | 2 / 3 | 6·7 / 7 |
| 인물·왕자 | prince_stand (기준) / prince_tiptoe(→) / prince_kneel(←) / prince_wave | 초록 옷, 작은 관 | 600² | 2 / 3 | 9·11 / 9·10 / 11 / 11 |
| 인물·할아버지 | grandpa_point(→) | 밀짚모자, 지팡이 | 600² | 2 | 9 |
| 단역 | maid_stand·maid_sleep / guard_a_stand·guard_a_sleep / guard_b_stand·guard_b_sleep(수염 없음, 금빛 깃) / cook_stand·cook_sleep / kid_stand·kid_sleep | 서 있는 모습과 서서 잠든 모습(눈 감은 선) | 600² | 2 / 3 | 8·11 / 8 / 8·10 / 8·10·11 / 8·10·11 |
| 동물 | dog_sleep (기준, 웅크림, 머리 왼쪽) / dog_wag(←) | 크림 강아지, 갈색 귀 | 480² | 1 / 2 | 8·10 / 8 |
| | bird_sleep(←) | 금빛 작은 새 | 480² | 1 | 10 |
| 소품 | prop_cradle / prop_plate(1장, 7·8개 배치는 코드) / prop_door_closed → prop_door_open / prop_curtain / prop_wheel(가락 왼쪽 위, 깨끗한 끝) / prop_thread_short → _mid·_long(같은 굵기) / prop_bed(천개, 베개 왼쪽, 매트 비어 있음) / prop_candle_lit → _out / prop_bush_closed → _open(가운데 틈) / prop_tree_small → _big / prop_table(아래 비어 있음) / prop_shelf(오른쪽 비어 있음) / prop_bell / prop_gift_{mirror,heart,bubble,shoes,note,flute} | 얼굴 없음 | 600² / 480² / 480×600 / 480×600 / 600² / 480×600 / 840×480 / 480×600 / 840×480 / 480×600 / 840×480 / 840×480 / 480² / 480² | 1 (→ 짝은 2) | 1·4·5 / 2·3·11 / 2·3 / 3·5 / 5·6·7 / 6·7 / 7·8·11 / 7·8·11 / 8·9 / 8·9 / 10 / 10 / 11 / 4 |
| 배경 | bg_room / bg_hall(식탁 윗선 38%) / bg_stairs / bg_tower / bg_bedroom / bg_outside(성 실루엣, 덤불 자리 비움) / bg_kitchen(아궁이) / bg_chapel(색유리 창, 식탁 윗선 38%) | 평평한 종이 한 장 + 요소 2~3개, 낮(세트 A, 왼쪽 위 해) | 1600×902 | 1 | 1·4·5 / 2·3 / 6 / 6·7 / 7·8·11 / 8·9 / 10 / 11 |
| 컷 | cut_eighth / cut_blessing / cut_prick / cut_hedge / cut_wake | 그림 컷 5장(§3 끝 컷신 표: 2·5·7·9·11장). refs 는 그 컷에 나오는 인물 스프라이트. 4:3, 얼굴 규칙 같음, 소품 얼굴 없음 | 1600×1200(4:3) | 4 | 2 / 5 / 7 / 9 / 11 |
| 키 | key5_wide · key5_tall · key5_tile · key5_backw · key5_backt | 시작 화면(둥근 탑 창)·홈 카드·끝 화면(예배당 인사) | 16:9 · 3:4 · 4:3 · 3:2 · 4:5 | — | — |

생성 순서: `pass 1`(30: pr_stand, dog_sleep, bird_sleep, 소품 19, 배경 8) → `pass 2`(33: 공주 자세 8, 왕·왕비·요정 여섯·막내·늙은 요정·할머니·왕자·할아버지·시녀·경비병 둘·요리사·꼬마 기준 자세 17, dog_wag, 짝 소품 6) → `pass 3`(24: 나머지 자세) → `pass 4`(컷 5: cut_eighth, cut_blessing, cut_prick, cut_hedge, cut_wake) → 키아트 5. 작업표가 이 순서로 정렬되어 있다.

받은 그림 점검(틀린 id 만 지우고 다시 만든다): 네 귀퉁이가 마젠타인지(`restyle_check.py` 방식) · 사람 자세의 **얼굴 폭이 기준과 ±12% 안**인지(여섯 요정 서기는 서로 ±5%) · 요정에 **날개가 없는지** · 늙은 요정이 무섭지 않은지(검은 옷·날카로운 눈이면 다시) · 공주 `reach` 손에 아무것도 없고 `yawn` 에 눈물이 없는지 · 물레 가락 끝에 핏방울·반짝이 없는지 · 실 셋의 굵기가 같고 길이만 다른지 · 소품에 얼굴이 없는지 · 잠든 자세의 키가 서 있을 때와 같은지 · 그림이 보는 쪽이 NAT 표와 같은지(반대면 그림을 뒤집어 저장하지 말고 NAT 만 고친다) · 배경 hall·chapel 의 식탁 윗선이 38% 근처인지(아니면 `TABLE_Y` 를 그 높이로).

## 11. 테스트 체크리스트 (코드가 끝난 뒤, 커밋 전)

준비
- [ ] 저장소 뿌리에서 `python3 -m http.server 8795`(다른 에이전트와 겹치지 않게 8795).
- [ ] 헤드리스 크롬: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9345 --user-data-dir=/tmp/sb_chrome --window-size=1366,1024 about:blank &`.
- [ ] 자동 재생: `CDP=9345 node assets/raw/_work/autoplay_audio.mjs http://127.0.0.1:8795/tales/sleeping_beauty/index.html 1366 1024 /tmp/sb_l 600 8` (스크린샷 + `_audio.json`). 6장 실 자리가 무작위이므로 **두 번 이상** 돌린다. 그림이 없는 동안은 자리표시로 끝까지 돌아야 한다(목업 통과 기준).

가로 1366×1024
- [ ] 끝까지 자동 재생되고 `errors` 에 예외가 없다(그림 404 는 자리표시 모드에서 정상).
- [ ] 첫 조작(1장 요람 톡)이 **시작 버튼 뒤 15초 안**에 가능하다(`_audio.json` 의 L2 끝 ≤ 14s). 넘으면 L1 뒤 `sleep(300)` 을 없앤다.
- [ ] 전체 길이 7~8.5분. 7분이 안 되면 §2-7 대로 늘린다.
- [ ] **크기**: 1·4·5장 아기 머리와 11장 공주 머리, 왕·왕비·요정·왕자·할머니·시녀·경비병·요리사·꼬마의 머리 지름이 모두 ≈80 으로 같은지(스크린샷을 나란히 놓고 잰다). 공주 자세 7장(stand·climb·reach·yawn·lie·wake·wave)의 얼굴 폭이 같은지. 여섯 요정 서기의 키가 같은지. 잠든 자세와 선 자세의 키가 같은지. 틀리면 `HT`(§2-2).
- [ ] **방향**: 2장 늙은 요정이 문(오른쪽)에서 들어와 왼쪽을 본다. 6장 공주가 오른쪽 위로 오르고 7장에 오른쪽(물레)으로 손을 뻗는다. 7장 왕·왕비가 왼쪽에서 달려온다. 9장 할아버지가 오른쪽(덤불)을 가리키고 왕자가 오른쪽으로 들어간다. 10장 왕자가 왼쪽에서 들어온다. 11장 왕자가 침대 오른쪽에서 왼쪽을 보고 무릎 꿇는다.
- [ ] **많고 적음**: 접시 일곱이 식탁 윗선(`TABLE_Y`)에 놓이고 요정 여덟이 그 아래 한 줄로 선다(접시 하나 아래 요정 한 명). 짝 맞춤 띠 일곱이 접시 아래에서 요정 머리 위까지 그어지고 `_audio.json` 에 `count1~7` 클립이 차례로 찍힌다. 늙은 요정만 띠가 없고 빛난다. 오답 때 W1/W2, 두 번째 오답부터 정답 줄이 빛난다. 숫자·글자 없음.
- [ ] **길고 짧음**: 실 셋의 자리가 돌 때마다 다르고 굵기가 같다. 오답 때 두 실이 나란히 모였다가 돌아가고 W 대사, 정답 때 반짝 + C 대사.
- [ ] **위·아래·옆**: 강아지가 탁자 아래 빈 공간에, 새가 선반 판 위에, 꼬마가 요리사 바로 옆에 있다. 세 문제가 차례로 나오고 오답 때 그 문제의 W 한 줄.
- [ ] **콕**: 손끝 별빛은 작고 크림색, 팝 '콕!'·'하암'이 공주 머리 위에 뜬다. 피·눈물·아픈 얼굴이 없다.
- [ ] **팝 자리**: 모든 팝이 인물 얼굴을 가리지 않는다(머리 위 45 이상). 8장 '쿨쿨' 여섯이 각자 머리 위.
- [ ] **덤불**: 8장 끝에 바닥에서 솟고, 9장 톡 뒤 가운데가 벌어지며 왕자가 덤불 **뒤**로 들어가 사라진다. 해·달이 다섯 번 지나가고 세 번째에 나무가 커진다.
- [ ] **끝**: 예배당에 접시 여덟·요정 여덟(늙은 요정 웃는 얼굴)이 보이고, 인사 톡 뒤 모두 들썩이며 종이 조각, 끝 화면에 '아무도 빼놓지 않아요. 잊힌 사람의 마음은 아프답니다.' 와 리본(`?endpreview=1`).
- [ ] **컷 5장**이 그 사건 직후에만 뜨고(2장 `sb_cut_eighth`, 5장 `sb_cut_blessing`, 7장 `sb_cut_prick`, 9장 `sb_cut_hedge`, 11장 `sb_cut_wake`) 각 컷 위에서 맞는 대사(L5·L19·L27·L35·L38)가 들린다. 이웃한 장면에 컷이 연달아 없다. 컷 안 인물 얼굴이 점 눈·띠 입이고 소품에 얼굴이 없다.
- [ ] 누르는 자리: `.tap-target.armed` 의 `getBoundingClientRect()` 짧은 변이 **화면 60px 이상**(요람·두 줄·실 셋·덤불·네 사람·동물·화면 전체).

세로 390×844 (`node … 390 844 /tmp/sb_p 600 8`)
- [ ] 모든 조작 대상이 그 순간 화면 안에 있다(1장 요람 500, 2장 두 줄 352~652 전체, 6장 실 480~600, 9장 덤불(카메라 600), 10장 넷 430~665(카메라 540), 11장 화면 전체). 화면 밖이면 §3 의 P 좌표·`camSnap`·`follow` 를 고친다.
- [ ] 2·11장 줄이 `S_ROW` 로 한 화면에 들어오고(요정 여덟 + 접시), 접시가 식탁 윗선에 있다. 6장 계단 오르기와 8장 재우기에서 카메라가 공주·막내 요정을 따라간다.
- [ ] 말하는 배역에게 카메라가 붙고(`director`), 내레이션에서 원래 화면으로 돌아온다. 카메라가 배경 밖을 보이지 않는다.

소리
- [ ] `_audio.json` 에서 **같은 클립이 연달아 두 번** 기록되지 않는다(이중 재생).
- [ ] NAR 줄 수 = 그 경로에서 지나간 대사 수(기본 경로 51줄 + count 7 + 오답 수). 빠진 줄은 `say()` 문장을 §6 과 글자 단위로 맞춘다(대본을 고치지 말고 코드를 고친다).
- [ ] 영어: `localStorage.lang = 'en'` 으로 한 번 더 돌려 `narration_el_en.js` 클립과 `TEXT_EN` 장면 이름·팝·안내 문장이 나온다. 화면에 한글이 남지 않는다(끝 화면 글자·부제 포함).
- [ ] 녹음 받아쓰기 점검: 녹음 전 `touch /tmp/sb_marker`, 녹음 뒤 `~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py sleeping_beauty /tmp/sb_marker ko` 와 `… en`. `<<<`(되풀이) 클립은 **그 mp3 만 지우고** `gen_tale.py` 를 다시 돌린다(`--redo` 금지). 영어 v4 는 반드시 본다.
- [ ] count1~7 클립이 아주 작고 짧게 들리고 웃음·말이 섞이지 않았다. 늙은 요정(Haemi) L8·L18 이 무섭지 않고 섭섭하게 들린다. 공주(Annie) L27 에 울음이 없다.
- [ ] 8장 L31 안에서 촛불 꺼짐 → 바깥 컷 → 덤불 자람이 끝난다(길면 L31 을 기다린 뒤 `sleep` 을 줄인다). 9장 L32 안에서 해·달 다섯 번이 끝난다.

마무리
- [ ] 홈(`index.html`)에서 '잠자는 숲속의 공주' 카드가 만드는 중으로 보이고 `line` 이 §8 문구다.
- [ ] `git status` 에 다른 동화 파일 변경이 없다. 커밋은 사용자가 요청할 때.

## 12. 판단이 필요한 부분 (남긴 것)
1. **세로 화면의 2·11장 줄 축소(`S_ROW = .36`)**: 요정 여덟·접시를 한 화면에 두려면 이 정도로 줄여야 한다(폰에서 요정 키 ≈ 110px). 아이패드 세로(보이는 폭 ≈ 420)에서는 `.55` 가 보기 좋으므로, 코드에서 `S_ROW = T.viewWidth() < 300 ? .36 : .55`, `SLOTP` 간격도 `32 → 50` 으로 바꾸는 것을 권장한다. 사용자가 폰 세로를 보지 않겠다고 하면 `.55` 하나로 둔다.
2. 그 밖에 없음(모두 이 문서에서 확정).
