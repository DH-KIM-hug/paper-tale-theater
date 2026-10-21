# 인어공주 — 제작 명세 (SPEC, 2026-10-20)

기획은 `PLAN.md`(확정), 이 문서는 **코드를 짜는 사람이 더 이상 판단하지 않아도 되게** 적은 제작 세부다. 참조 구현은 `tales/snow_white/snow_white.js`(구조·mk·put·sceneCard 흐름)와 `tales/cinderella/cinderella.js`(HT 표·director·고르기 카드·sparkle). 두 파일의 도우미를 그대로 복사해 쓴다.

- 폴더 `tales/little_mermaid/`, 코드 `little_mermaid.js`, 그림 접두어 **`mer_`** (`assets/v3w/mer_*.webp`), 배경 `assets/v3w/mer_bg_*.webp`
- 그림 작업표 `tools/app/gen/jobs_little_mermaid.json` (99장: 인물·소품 69, 배경 9 + 재생성 배경 12(`bg2_*`·`bg3_*`·`bg4_*`), 컷 4(`mer_cut_*`, §6-12), 키아트 5)
- 대본 `voice_script_el.json`(한국어, ElevenLabs eleven_v4), `voice_script_en.json`(영어). Typecast 판은 없다.
- 교훈(끝 화면 `run()` 반환값): **`'사랑하는 마음으로 양보하면, 그 마음은 좋은 일이 되어 남아요.'`**
- `Tale.mount({ title: '인어공주', subtitle: '사랑하는 마음은 사라지지 않아요', run: T => run(Tale.api) })`
- 장면 11장, 조작 5번: 배움 놀이 2(1번 뜨고 가라앉기 2문제, 8번 바다·땅 가르기 3문제), 재미 톡 2(2번 불꽃, 6번 가마솥), 인사 톡 1(11번). 연타 없음. 첫 조작은 시작 후 약 20초(1번 해설 두 줄 + 질문 한 줄 뒤).
- 목표 길이 7~8분. 대사 60줄 + 합창 2줄. 그림 컷 4장(3·5·7·10번, §6-12) — 컷 위 대사는 기존 줄 재사용, 새 녹음 없음.

### 확정된 판단 (권장대로, 2026-10-20)
1. 언니들 대사 "해가 뜨기 전에 이걸 왕자에게 쓰면 너는 다시 인어가 돼. 그러지 않으면 거품이 되는 거야." 그대로.
2. 할머니 "사람에겐 별처럼 영원히 남는 마음이 있단다." 유지.
3. 7~10번 허밍 효과음 **없음**. 인어공주는 말하지 않고, 7번 왕자의 물음에 머리 위 `…` 종이 구름(`T.pop`) + `doop` 소리만. 마음은 내레이터가 말한다.
4. 막내 짚빛 머리 + 하얀 한지 조끼(조개 브라 없음). 언니들은 머리·꼬리 색이 저마다 다름.

---

## 1. 코드 구조 (snow_white.js 를 본뜬다)

```
/* 인어공주 — 안데르센 원작. 기획 PLAN.md, 명세 SPEC.md ... (머리말 주석: 장면 순서·조작·교훈·그림 출처) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { ... };          // 그림 폭/높이 비율 — post_little_mermaid.py 가 끝에 출력하는 값을 붙여 넣는다 (아직 모름)
  const HT  = { ... };          // 사람·인어 자세별 높이(px). §3 표의 값. 머리 지름이 모두 ≈80px 이 되게 post 뒤에 ±5% 손본다
  const NAT = { ... };          // 그림이 보는 쪽 'left' | 'right' | 'front'. §3 표
  const FL = 528;               // 땅 바닥 (계단·정원·갑판·모래)
  const WATER = 300;            // 2·3·10번 수면선 (배경 그림 53% 높이)
  const WATER11 = 372;          // 11번 수면선 (배경 65%)
  const BGS = ['palace', 'night_sea', 'beach', 'witch', 'steps', 'garden', 'deck', 'dawn_sea', 'morning_sea'];
  const bgSrc = k => AS + 'mer_bg_' + k + '.webp', artSrc = k => AS + 'mer_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };   // 1600×902 배경이 무대 1000×560 을 덮게 (그대로 복사)
  const hOf = f => HT[f] || 200;
  function mk(T, poses) {...}   // cinderella.js 의 mk 그대로 (poses = { 이름: 그림 } 또는 { 이름: [그림, 높이] }, NAT 로 방향)
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) {...}   // 그대로
  hide / fadeIn / fadeOut / glow / bgImage / sfx / popSfx / sparkleSfx / tint / sparkle(cinderella) / sleep0   // 그대로
  // 새 도우미 (§2)
  hit(T, parent, r)  bubblesUp(T, x, y, n)  wobbleWalk(T, a, x, ms)  glints(T, x, y)  rippleAt(T, x, y)
  async function run(T) {
    const { sleep, say, camSnap, tr } = T;   // say 는 엔진 것 그대로 (snow_white 처럼 700ms 쉼을 넣지 않는다 — 대신 장면 끝마다 sleep(300))
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990, X = (l, p) => (P ? p : l), follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    preload(BGS + ASP 전부) 와 Promise.race(4000ms)
    배우·소품 생성 → ALL.forEach(hide)
    T.director({ cast: { mer, granny, prince, lady, witch }, noFace: ['mer', 'granny', 'prince', 'lady', 'witch'] });  // 방향은 장면에서 직접 정한다
    /* ===== 1 ~ 11 ===== */
    ...
    T.finale(); await sleep(1500);
    return '사랑하는 마음으로 양보하면, 그 마음은 좋은 일이 되어 남아요.';
  }
  Tale.mount({ title: '인어공주', subtitle: '사랑하는 마음은 사라지지 않아요', run: T => run(Tale.api) });
})();
```

- `T.say` 는 엔진 것을 쓴다. 문장은 **대본 JSON 의 `text` 와 글자 하나까지 같아야** 클립이 붙는다 (§7).
- 세로 화면(P): 보이는 폭이 약 260px 이므로 모든 장면에 `X(가로, 세로)` 좌표를 둔다. 고르기 선택지는 가로 260 안에 들어오게 둔다(§6-1, §6-8).
- 카메라: 가로는 장면마다 `camSnap(500, 280, 1)` 고정(5번만 1.3배). 세로는 director 가 화자를 잡고, 장면 안 이동은 `follow(x)`.
- 장면 전환은 모두 `await T.sceneCard(tr('이름'), () => { scene(...); put(...); if (P) camSnap(...); }, focus.pos)`. 1번만 `await T.curtain(true)`.
- 효과음은 `sfx(T, '이름', fallback)` (`sounds/sfx/<이름>.mp3`). 없는 이름은 쓰지 않는다 (§8 목록).

### 복사해 올 도우미 목록
| 출처 | 이름 | 용도 |
|---|---|---|
| cinderella.js | `ASP/HT/NAT` 표 방식, `mk`, `prop`, `put`, `hide`, `fadeIn`, `fadeOut`, `glow`, `bgImage`, `sfx`, `popSfx`, `sparkleSfx`, `sparkle(T,x,y,r,n)`, `T.director(...)` 호출 모양, 카드 고르기 `g = T.el('g', {filter:'url(#pp)'})` 패턴 | 전부 |
| snow_white.js | `tint(T, fill, op)`, `sleep0`, 투명 누르기 자리 `T.el('circle', {fill:'#fff', opacity:0})`, 흔들림 `pos.animate([{translate}...], {iterations})` 패턴, `scene()` | 3·10번 밤빛, 2·11번 톡 자리 |

### 새 도우미 (이 동화에서 만든다)
```js
/* 누르기 자리: 작은 소품도 손가락으로 쉽게 누르게 투명 원을 소품 그룹 안에 둔다 (r 은 무대 단위) */
const hit = (T, a, r) => T.el('circle', { cx: 0, cy: -a.h / 2, r, fill: '#fff', opacity: 0 }, a.pos);   // a.pos 의 맨 앞에 두면 그림 뒤, 그래도 누르기는 된다
/* 거품: (x,y) 에서 작은 거품 n 개가 흔들리며 올라가 사라진다 (mer_prop_bubble, 높이 18~34) */
function bubblesUp(T, x, y, n = 5, rise = 160) { for i: const b = prop(T, 'prop_bubble', 18 + (i % 3) * 8); put(T, b, x + (i - n/2) * 14, y);
  b.pos.animate([{ transform: `translate(${x+dx}px,${y}px)`, opacity: 0 }, { opacity: 1, offset: .2 }, { transform: `translate(${x+dx+(i%2?12:-12)}px,${y-rise}px)`, opacity: 0 }], { duration: 1400 + i*120, delay: i*90 }).finished.then(() => b.pos.remove()); }
/* 흔들 걸음: wobble_a / wobble_b 를 300ms 마다 번갈아 보이며 x 까지 걷고, 끝나면 stand */
async function wobbleWalk(T, a, x, ms) { let k = 0; const tm = setInterval(() => a.look(k++ % 2 ? 'wobble_b' : 'wobble_a'), 300); sfx(T, 'step_wood'); await a.move(x, FL, ms, 'linear'); clearInterval(tm); a.look('stand'); }
/* 붉은 금빛 반짝: mer_prop_glint 5개가 (x,y) 에서 퍼졌다 사라진다 (cinderella sparkle 과 같은 궤적, 그림만 다름) */
function glints(T, x, y) { for i in 0..4: const g = prop(T, 'prop_glint', 22 + (i % 2) * 8); put(T, g, x, y); g.pos.animate([...scale .3→1.2→.4, 각도 i/5·2π·반지름 70], { duration: 1300, delay: i*40 }).finished.then(remove) }
/* 잔물결: mer_prop_ripple 이 0.4→1.5 배로 커지며 사라진다 */
function rippleAt(T, x, y) { const r = prop(T, 'prop_ripple', 60); put(T, r, x, y + 30); r.body.animate([{ transform: 'scale(.4)', opacity: 1 }, { transform: 'scale(1.5)', opacity: 0 }], 1500).finished.then(() => hide(r)); }
```

---

## 2. 크기 원칙

- **사람과 인어 모두 머리 지름 ≈ 80px** (무대 단위). 서 있는 사람 키 205~212, 인어 똑바로 뜬 자세(꼬리 끝까지) 215~225, 어른(왕·할머니·마녀)은 조금 더 크되 머리는 같다. 자세마다 아래 HT 값으로 시작하고, 그림이 나오면 머리 지름을 재서 ±5% 안에서 HT 를 고친다 (cinderella 의 방식).
- 소품은 제 크기(돌 48, 닻 80, 배 330 …). 배는 왕자가 갑판에 서도 어색하지 않게 크다(폭 약 600).
- 배우의 발끝(인어는 꼬리 끝, 가로로 누운 그림은 그림 아래선)이 `(x, y)` 다.

---

## 3. 배우 표 (그림 이름 = `mer_` 뒤)

| 배우(변수) | 자세 → 그림 | HT | NAT | 장면 |
|---|---|---|---|---|
| `mer` 인어공주 | swim `mer_swim`(기준) | 220 | left | 2, 6 |
| | garden `mer_garden` 정원에 앉아 위를 봄 | 175 | front | 1 |
| | peek `mer_peek` 수면 위 머리·어깨(허리에서 잘림) | 125 | front | 2 |
| | hide `mer_hide` 바위 뒤에서 내다봄(허리에서 잘림) | 140 | right | 4 |
| | hold `mer_hold` 가로로 헤엄, 두 팔 앞으로(머리가 왼쪽) | 150 | left | 3 |
| | worry `mer_worry` 두 손 모음 | 220 | left | 5, 6 |
| | resolve `mer_resolve` 주먹 쥔 결심 | 220 | left | 6 |
| | sit_tail `mer_sit_tail` 계단에 앉음(꼬리) | 190 | front | 7 |
| | stand `mer_stand` 하얀 옷, 맨발 | 205 | front | 7, 8, 10 |
| | wobble_a / wobble_b `mer_wobble_a/_b` 몸이 왼/오른쪽으로 8° 기움 | 205 | front | 7, 8 |
| | dance `mer_dance` | 205 | right | 8 |
| | sad `mer_sad` 손 모은 슬픈 미소 | 205 | front | 9, 10 |
| | shake `mer_shake` 눈 감고 손바닥 내밈(고개 젓기) | 205 | front | 10 |
| | throw `mer_throw` 팔을 앞으로 뻗은 뒤(손은 빈손) | 210 | left | 10 |
| | bubble `mer_bubble` 거품 속 손 흔드는 얼굴 | 230 | front | 10, 11 |
| `sisters` 언니들(한 줄 그림) | long `sisters_long` 긴 머리 다섯 | 225 | front | 1 |
| | short `sisters_short` 짧은 머리, 수면 위 상체, 맏언니 두 손 내밈(맨 왼쪽) | 130 | front | 10 |
| `king` 바다 왕 | `king` | 228 | front | 1 |
| `granny` 할머니 | talk `granny_talk` / hand `granny_hand` | 222 | left | 1, 2, 5 |
| `prince` 왕자 | stand `prince_stand` | 212 | front | 2, 4, 7, 8, 9, 11 |
| | float `prince_float` 물에 뜸, 눈 감음(머리 왼쪽) | 120 | left | 3 |
| | lie `prince_lie` 모래밭에 누움(머리 왼쪽) | 115 | left | 4 |
| | wake `prince_wake` 앉아 깨어남 | 165 | right | 4 |
| | dance `prince_dance` | 212 | left | 8 |
| | sleep `prince_sleep` 앉아 잠듦 | 150 | left | 10 |
| `witch` 바다 마녀 | stand `witch_stand` / hand `witch_hand` | 228 | left | 6 |
| `lady` 이웃 나라 공주(하얀 집 아가씨, 같은 사람) | stand `lady_stand` | 208 | front | 4, 11 |
| | wed `lady_wed` 꽃다발 | 208 | front | 9, 11 |
| | sleep `lady_sleep` 앉아 잠듦 | 150 | right | 10 |
| `gulls[2]` 갈매기 | `gull` | 60 | left | 11 |
| `fish[3]` 물고기 | `fish_a`(감빛) `fish_b`(짚빛) `fish_c`(솔빛) | 36 | left | 1(장식), 8(물고기 카드 = `fish_a`) |

`mk(T, {...})` 호출 예: `const mer = mk(T, { swim: 'mer_swim', garden: 'mer_garden', peek: 'mer_peek', hide: 'mer_hide', hold: 'mer_hold', worry: 'mer_worry', resolve: 'mer_resolve', sit_tail: 'mer_sit_tail', stand: 'mer_stand', wobble_a: 'mer_wobble_a', wobble_b: 'mer_wobble_b', dance: 'mer_dance', sad: 'mer_sad', shake: 'mer_shake', throw: 'mer_throw', bubble: 'mer_bubble' })` — 높이는 `HT` 표에서 `hOf` 가 읽는다.

## 4. 소품 표

| 변수 | 그림 | 높이(px) | 쓰임 |
|---|---|---|---|
| `ship` | lantern `prop_ship_lantern` / tilt `prop_ship_tilt` / flower `prop_ship_flower` (mk 로 세 자세) | 330 (폭 ≈ 600) | 2 / 3 / 10·11. 뱃머리가 **왼쪽**. 발끝 = 선체 아래선. 상수 `SHIP_W = 330 * ASP.prop_ship_lantern`, `DECK_DY = -330 * .42`(갑판 높이, post 뒤 보정), `BOW_DX = -SHIP_W * .30`(뱃머리 자리) |
| `fw[3]` | `prop_fw_a/_b/_c` | 120 | 2번 불꽃 |
| `stone` `wood` `anchor` `bottle` | `prop_stone` `prop_wood` `prop_anchor` `prop_bottle_cork` | 48 / 70(가로) / 80 / 70 | 1번 놀이 |
| `cauldron` | dim `prop_cauldron_dim` / glow `prop_cauldron_glow` | 150 | 6 |
| `potion` | empty `prop_potion_empty` / full `prop_potion_full` | 44 | 6, 7 |
| `shell` | `prop_shell_pearl` | 64 | 6 |
| `items` | `item_shell` `item_starfish` `item_butterfly` `item_bird` `item_rabbit` `item_flower` `item_tree` `item_dog` + 물고기는 `fish_a` | X(96, 76) | 8번 놀이 |
| `dagger` | `prop_dagger` (칼집째, 손잡이 왼쪽) | 30 (폭 ≈ 60) | 10. 칼집에서 나오는 그림은 없다 |
| `glint` | `prop_glint` | 22~30 | 10 (5개) |
| `ripple` | `prop_ripple` | 60 | 10 |
| `bubble` | `prop_bubble` | 18~34 | 1, 2, 6, 10 (bubblesUp) |
| `wind[2]` | `prop_wind` | 90 (폭 ≈ 260) | 11 |
| `rock` | `prop_rock` | 150 | 4 |
| `clouds[2]` | `prop_cloud_dark` | 160 | 3 |
| `wave` | `prop_wave` (잔잔한 수면 띠) | 110, `s = 1100 / (110 * ASP.prop_wave)` 로 무대 폭 덮기 | 2, 10, 11 (맨 앞에 두어 수면 아래 몸을 가린다) |
| `waves[2]` | `prop_wave_big` (폭풍 파도) | 180 | 3 |
| `sun` | `prop_sun` | 120 | 10 |

## 5. 배경 표 (`mer_bg_*`, 1600×902 → BGBOX)

| 키 | 장면 | 빛 | 무대 안 기준선 |
|---|---|---|---|
| `palace` | 1, 2(앞부분), 5 | 좌상 | 모래 바닥선 ≈ y 512 (그림 88%) |
| `night_sea` | 2, 3 | **우상(달)** | 수면선 y 300 (53%) |
| `beach` | 4 | 좌상 | 모래선 y 451 (78%), 인물 발은 y 505~512 |
| `witch` | 6 | 좌상(어둡게 걸러진 빛) | 바닥선 ≈ y 512 |
| `steps` | 7 | 좌상(새벽) | 맨 아래 계단 = 바닥. 인물 발 `FL` (post 뒤 계단 윗선에 맞춰 ±10) |
| `garden` | 8 | 좌상 | 잔디 y 250~, 연못 x 338~662 · y 439~536, 퐁당 지점 `(500, 488)` |
| `deck` | 9 | **우상(달·등불)** | 갑판선 y 402, 인물 발 y 520 |
| `dawn_sea` | 10 | 좌상(새벽, 해는 소품) | 수면선 y 300 |
| `morning_sea` | 11 | 좌상 | 수면선 y 372 |

---

## 6. 장면별 명세

표기: `X(가로, 세로)`. 가로는 1366×1024(iPad) 기준이지만 무대 좌표는 해상도와 무관하다. 모든 `say(...)` 문장은 §7 대본과 같다.

### 6-1. 바다 밑 궁전과 정원 (배움 놀이 1: 뜨고 가라앉기) — `curtain(true)`
배치: `scene('palace')`
- `king` X(830, 700), 512 · `granny` look talk, X(930, 790), 516, to 'left'
- `sisters` look long, X(500, 430), **300** (물속 중간에 한 줄로 떠 있음)
- `mer` look garden, X(200, 440), 520
- 물고기 셋: `fish[i]` X([120, 640, 760], [300, 560, 600]), [380, 200, 430], 각자 `pos.animate` 로 x ±12 · y ±6 을 3~4초 주기로 느리게 오감(장식)
- `if (P) camSnap(500, 280, 1)`
흐름:
1. `await T.curtain(true)`; `bubblesUp(T, X(520,500), 420, 4)` 장식.
2. `say('깊고 깊은 바다 밑에 인어 나라가 있었어요. 바다 왕님과 할머니, 여섯 공주가 살았지요.')` — 말하는 동안 `sisters.hop(8, 600)`, `king.hop(6, 600)` 한 번씩.
3. `say('막내 인어공주는 조용하고 생각이 많았어요. 정원에는 배에서 떨어진 물건을 모았어요.')` — `glow(mer, 1200)`; 세로면 `T.camTo(440, 280, 1, 600)`.
4. **놀이** `floatSink(['stone', 'wood'], ...)` 그리고 `floatSink(['anchor', 'bottle'], ...)`:
   - 문제 1 선택지 2개가 위에서 내려와 y 150(발끝) 에 떠 있다: `stone` X(300, 440), `wood` X(480, 580). 각 소품 그룹에 `hit(T, a, 62)`. 들어올 때 y 20 → 150, 900ms, `fadeIn`.
   - 문제 1 질문 `say('무거운 것은 가라앉고, 가벼운 것은 떠요. 어느 것이 바다 밑까지 내려올까요?')` (= 첫 조작, 시작 후 약 20초)
   - `await T.choose([{ el: stone.pos, ok: true }, { el: wood.pos, ok: false, onWrong }], { prompt: '무거운 것은 가라앉고, 가벼운 것은 떠요. 어느 것이 바다 밑까지 내려올까요?' })`
   - `onWrong`(나무토막): `wood.pos.animate` 로 y 150 → 80 → 150 (900ms, 둥둥), `T.pop(wood.x, 60, tr('떠요'))`, `await say('나무토막은 가벼워서 둥둥 떠요.')`. (엔진이 두 번째 실수부터 정답을 반짝이게 하므로 추가 힌트 코드는 없다.)
   - 정답: `sfx(T, 'bubbles')`, `bubblesUp(T, stone.x, 150, 5, 120)`, `stone.move(X(240, 470), 500, 2400, 'ease-in')` 를 **기다리며** `T.pop(stone.x, 90, tr('가라앉아요'))`; 닿으면 `sfx(T, 'paper_down', popSfx)`, `glow(stone, 1000)`, `mer.hop(10, 360)`; 동시에 `wood` 는 y -80 까지 떠올라 사라진다(1200ms, 뒤에 hide). `await say('무거운 돌이 가라앉았어요!')`.
   - 문제 2: `anchor` X(300, 440) · `bottle` X(480, 580) 가 같은 식으로 내려온다. `say('이번에는 어느 것이 가라앉을까요?')` → `T.choose(... ok: anchor ..., { prompt: '이번에는 어느 것이 가라앉을까요?' })`. 틀리면 병이 둥둥 + `say('코르크 병은 가벼워서 둥둥 떠요.')`. 맞으면 닻이 `X(300, 520), 505` 로 가라앉고 `say('무거운 닻도 가라앉았어요!')`. 돌·닻은 정원에 남겨 둔다.
5. `await sleep(300)`.
- 세로: 두 선택지는 좌우(440·580)로, 카메라 440~520 사이에 둔다. 손가락 힌트·12초 재안내는 엔진 기본.

### 6-2. 열다섯 살, 바다 위로 (톡 1: 불꽃) — 카드 두 장
**앞부분** `sceneCard('열다섯 살', ..., mer.pos)`: `scene('palace')`; `granny` look hand, X(560, 560), 516, to 'left'; `mer` look swim, X(400, 430), 512, to 'right'; `camSnap(X(480, 500), 330, 1.3)`.
1. `say('언니들은 열다섯 살이 되면 바다 위로 올라갔어요. 드디어 막내 차례예요!')` — `mer.hop(12, 400)`.
2. `say('조심해서 다녀오렴.')` — `granny.wiggle(3, 600)`.
3. `say('네, 할머니. 다녀올게요!')` — 끝나면 `mer.turn('left')`, `sfx(T, 'bubbles')`, `bubblesUp(T, mer.x, mer.y - 60, 6, 220)`, `await mer.move(mer.x + 40, -220, 2000, 'ease-in')`, `hide(mer)`.

**뒷부분** `sceneCard('밤바다', ..., ship.pos)`: `scene('night_sea')`; `ship` look lantern, X(640, 560), WATER + 28; `prince` look stand, `(ship.x + BOW_DX, ship.y + DECK_DY)`, to 'left' (배 **뒤**에 넣지 않고 배 다음에 넣어 앞에 선다); `mer` look peek, X(330, 420), WATER + 12 (허리가 수면 바로 아래); `wave` (500, WATER + 70) 를 **맨 마지막**에 put 해 맨 앞; `if (P) camSnap(460, 280, 1)`.
- 하늘 톡 자리: `const sky = T.el('rect', { x: X(560, 440) - 170, y: 30, width: 340, height: 200, fill: '#fff', opacity: 0 }, T.world)`.
4. `say('커다란 배가 있었어요. 오늘은 왕자님 생일이래요.')` — 등불 느낌으로 `ship.pos.animate` 상하 3px 흔들림(iterations Infinity, 2600ms).
5. `say('하늘을 톡 눌러 봐요.')` → `await T.tap(sky, { prompt: '하늘을 톡 눌러 봐요.' })` → `sky.remove()`.
6. 불꽃(비동기): `fw[0]` (X(560, 440), 110) `sfx(T,'pow')` `T.pop(그 자리+60, 60, tr('펑!'))`, 700ms 뒤 `fw[1]` (X(700, 540), 80) `sfx(T,'boom')`, 700ms 뒤 `fw[2]` (X(430, 360), 140) `sfx(T,'pow')` + `T.pop(..., tr('펑!'))`. 각 불꽃은 `body.animate` scale .2 → 1.15 → 1 (500ms) 뒤 1800ms 에 opacity 0 으로. 동시에 `say('펑! 펑! 불꽃이 하늘에 피었어요.')`, `mer.hop(8, 400)`, `prince.hop(8, 400)`.
7. `glow(prince, 1200)`; `say('저 사람이 왕자님이구나.')` — `mer.wiggle(2, 700)`.
8. `await sleep(300)`.

### 6-3. 폭풍 (자동)
`sceneCard('폭풍', ..., ship.pos)`: `scene('night_sea')`; `tint(T, '#1F2A56', .35)`; `clouds[0]` (X(300, 380), 150), `clouds[1]` (X(760, 620), 120) → put 뒤 `T.bg.appendChild(c.pos)` (배경층); `ship` look tilt, X(620, 560), WATER + 40; `waves[0]` (X(420, 500), WATER + 95), `waves[1]` (X(850, 760), WATER + 105) 맨 앞, 둘 다 `pos.animate` 로 x ±25 · y ±8 (2000ms, infinite, alternate); `if (P) camSnap(520, 280, 1)`.
1. `sfx(T, 'whoosh')`; `say('밤이 깊자 바람이 세졌어요. 배가 기우뚱!')` — 중간에 `T.shake()`, `sfx(T, 'thud')`, `ship.wiggle(4, 900)` 두 번.
2. 왕자 추락: `put(T, prince, ship.x - 120, WATER - 60, { look: 'float' })`, `sfx(T, 'splash_big')`, `T.pop(prince.x, WATER - 110, tr('풍덩!'))`, `await prince.move(ship.x - 150, WATER + 10, 700, 'ease-in')`; `say('왕자님이 바다에 빠졌어요.')`.
3. `put(T, mer, -150, WATER + 12, { look: 'hold', to: 'right' })`; `sfx(T, 'bubbles')`; `Promise.all([ say('내가 도와줄게요!'), mer.move(prince.x - HOLD_DX, WATER + 12, 1400) ])`. `HOLD_DX = mer.w * .45 + prince.w * .5 - 20` (그녀 손끝이 왕자 머리에 닿는 거리, post 뒤 보정). 세로: `follow(prince.x - 60)`.
4. `Promise.all([ say('인어공주는 왕자님의 머리를 물 위로 받쳐 주었어요.'), mer.move(mer.x + 60, mer.y, 2600, 'linear'), prince.move(prince.x + 60, prince.y, 2600, 'linear') ])`; `glow(mer, 1200)`.
5. `await Promise.all([fadeOut(T, mer, 500), fadeOut(T, prince, 500)])`; `await sleep(200)`.

### 6-4. 모래밭 (자동)
`sceneCard('모래밭', ..., prince.pos)`: `scene('beach')`; `mer` look hide, X(280, 400), 530, to 'right' (먼저 put); `rock` X(300, 420), 522 (mer 다음에 put → 바위가 앞); `prince` look lie, X(560, 560), 512; `if (P) camSnap(500, 280, 1)`.
1. `say('인어공주는 왕자님을 모래밭에 눕히고, 바위 뒤에 숨었어요.')` — `mer.pos.animate` 로 y 3px 들썩임 3회.
2. `put(T, lady, 1100, 510, { look: 'stand', to: 'left' })`; `sfx(T, 'step_grass')`; `await lady.move(X(720, 660), 510, 1800)`; 세로 `follow(600)`.
3. `lady.hop(8, 360)`; `say('어머, 괜찮으세요?')`.
4. `prince.look('wake', 'right')`; `sfx(T, 'sparkle', popSfx)`; `glow(prince, 1000)`; `say('왕자님은 아가씨에게 웃어 주었어요. 인어공주는 보지 못했지요.')`.
5. `mer.hop(6, 400)`; `say('왕자님이 깨어났어요. 다행이에요.')`.
6. `await T.anim(mer.pos, [{ translate: '0 0', opacity: 1 }, { translate: '0 40px', opacity: 0 }], 600)`; `hide(mer)`; `prince.look('stand', 'right')`; `sfx(T, 'step_grass')`; `await Promise.all([prince.move(1150, 510, 1800), lady.move(1180, 510, 1800)])`; `hide(prince); hide(lady)`; `await sleep(200)`.

### 6-5. 할머니의 이야기 (자동)
`sceneCard('할머니의 이야기', ..., granny.pos)`: `scene('palace')`; `granny` look talk, X(590, 580), 516, to 'left'; `mer` look worry, X(400, 430), 514, to 'right'; `camSnap(X(490, 500), 330, 1.3)` (방 느낌으로 당김).
1. `say('할머니, 사람은 어떻게 살아요?')` — `mer.hop(6, 400)`.
2. `granny.look('hand')`; `say('사람은 땅 위에서 살고, 우리는 바다에서 살지. 사람에겐 별처럼 영원히 남는 마음이 있단다.')` — 말하는 동안 `bubblesUp(T, granny.x - 40, granny.y - 200, 3, 120)` 한 번.
3. `granny.look('talk')`; `mer.look('resolve', 'right')`; `say('나도 왕자님 곁에서 그런 마음을 갖고 싶어요.')`.
4. `await sleep(300)`.

### 6-6. 바다 마녀 (톡 2: 가마솥)
`sceneCard('바다 마녀', ..., cauldron.pos)`: `scene('witch')`; `witch` look stand, X(680, 600), 522, to 'left'; `cauldron` look dim, X(500, 480), 530; `shell` X(590, 560), 540 (가마솥 다음에 put); `mer` 는 아직 밖 (-150); `if (P) camSnap(500, 280, 1)`.
1. `put(T, mer, -150, 520, { look: 'swim', to: 'right' })`; `sfx(T, 'bubbles')`; `Promise.all([ say('인어공주는 소용돌이 너머 바다 마녀를 찾아갔어요.'), mer.move(X(290, 380), 520, 1800) ])`; `mer.look('worry', 'right')`.
2. `witch.look('hand')`; `say('다리를 갖고 싶다고? 좋아. 대신 네 고운 목소리를 다오.')`.
3. `witch.look('stand')`; `say('다리는 조금 흔들흔들할 거야. 그리고 왕자가 다른 사람과 결혼하면, 너는 바다 거품이 된단다.')`.
4. `mer.look('resolve', 'right')`; `mer.hop(8, 400)`; `say('그래도 갈래요.')`.
5. `cauldron.pos.animate` 상하 5px (900ms × 3); `say('가마솥을 톡 눌러 봐요.')`; `await T.tap(cauldron.pos, { prompt: '가마솥을 톡 눌러 봐요.' })`.
6. 톡 뒤(자동): `cauldron.look('glow')`; `sfx(T, 'bubbles')`; `T.pop(cauldron.x, cauldron.y - 200, tr('보글보글'))`; `sparkle(T, cauldron.x, cauldron.y - 120, 110, 12)`; `put(T, potion, cauldron.x + 44, cauldron.y - 150, { look: 'empty' })`, `fadeIn(potion, 400)`; 600ms 뒤 `potion.look('full')`, `glow(potion, 1000)`, `sfx(T, 'sparkle')`.
7. 목소리 진주: `const pearl = T.el('circle', { cx: 0, cy: 0, r: 8, fill: '#F6ECD8', stroke: '#F2B366', 'stroke-width': 2 }, T.world)`; 시작점 `mx = mer.x + mer.w * .28, my = mer.y - mer.h * .70` (입); `T.anim(pearl, [{ transform: translate(mx,my) }, { transform: translate(mx + 90, my - 120) }], { duration: 500, easing: 'ease-out' })` 뒤 `T.anim(pearl, [..., { transform: translate(shell.x, shell.y - 30) }], { duration: 700, easing: 'ease-in' })`; `sfx(T, 'sparkle')`; `pearl.remove()`; `glow(shell, 1200)`; `mer.look('worry', 'right')`; `mer.wiggle(2, 600)`.
8. `say('마녀가 목소리를 진주처럼 가져갔어요. 이제 인어공주는 말을 할 수 없어요.')`.
9. 약병을 받는다: `await potion.move(mer.x + 36, mer.y - 120, 700)`; `hide(potion)`; `await sleep(300)`.
→ **이 뒤 10번 끝까지 `mer` 의 `say` 는 없다.**

### 6-7. 다리가 생겼어요 (자동)
`sceneCard('다리가 생겼어요', ..., mer.pos)`: `scene('steps')`; `mer` look sit_tail, X(420, 470), FL; `potion` look full, (mer.x + 34, mer.y - 118); `if (P) camSnap(500, 280, 1)`.
1. `say('새벽, 궁전 계단에서 인어공주는 약을 마셨어요.')` — 중간에 `await potion.move(mer.x + 22, mer.y - 150, 500)`, `sfx(T, 'gulp', popSfx)`, `T.pop(mer.x + 40, mer.y - 230, tr('꿀꺽!'))`, `hide(potion)`.
2. `sfx(T, 'sparkle')`; `sparkle(T, mer.x, mer.y - 100, 130, 16)`; `await T.anim(mer.pos, [{ opacity: 1 }, { opacity: .1 }], 400)`; `mer.look('stand')`; `mer.pos.style.opacity = ''`; `fadeIn(mer, 500)`; `glow(mer, 1400)`.
3. `Promise.all([ say('꼬리가 사라지고 다리가 생겼어요! 걸음은 흔들흔들.'), (async () => { await sleep(1800); T.pop(mer.x, mer.y - 250, tr('흔들흔들')); await wobbleWalk(T, mer, X(500, 500), 1800); })() ])`.
4. `put(T, prince, 1100, FL, { look: 'stand', to: 'left' })`; `sfx(T, 'step_wood')`; `await prince.move(X(660, 640), FL, 1500)`; 세로 `follow(570)`.
5. `say('누구세요? 어디서 왔어요?')` — `prince.hop(8, 360)`.
6. `sfx(T, 'doop')`; `T.pop(mer.x, mer.y - mer.h - 30, tr('…'))`; `mer.wiggle(3, 500)`; `say('인어공주는 말을 못 해요. 그저 웃었지요.')` — `mer.hop(6, 400)`.
7. `say('우리 궁전에서 지내요.')` — `prince.hop(10, 360)`.
8. `prince.turn('right')`; `Promise.all([prince.move(1150, FL, 1600), wobbleWalk(T, mer, 1150, 2000)])`; `hide(prince); hide(mer)`; `await sleep(200)`.

### 6-8. 왕자와 함께 (배움 놀이 2: 바다·땅 가르기)
`sceneCard('궁전 정원', ..., prince.pos)`: `scene('garden')`; `prince` look stand, X(170, 330), FL, to 'right'; `mer` look stand, X(840, 690), FL, to 'left'; `if (P) { camSnap(500, 280, 1); }`.
1. `say('정원에 바다 친구가 섞였네. 바다에 사는 친구를 찾아봐요.')` — `prince.hop(8, 360)`. 세로에서는 이 줄 뒤 `prince.pos.style.opacity = '.35'; mer.pos.style.opacity = '.35'` (cinderella 시계 카드와 같은 처리), 가로는 그대로.
2. 세 문제, 순서 고정, 선택지 순서는 무작위:
   `ROUNDS = [ { ok: 'fish', opts: ['fish', 'butterfly', 'rabbit'] }, { ok: 'shell', opts: ['shell', 'flower', 'bird'] }, { ok: 'starfish', opts: ['starfish', 'tree', 'dog'] } ]`
   그림: `fish → 'fish_a'`, 나머지 `'item_' + 이름`. 자리 `IX = X([330, 500, 670], [416, 500, 584])`, `IY = 330`(발끝), 높이 `IH = X(96, 76)`, 각 그룹에 `hit(T, a, X(66, 52))`. 들어올 때 `fadeIn` + y 300 → 330 (400ms, 120ms 간격).
   한국어 이름·대사:
   | 이름 | 맞을 때 | 틀릴 때 |
   |---|---|---|
   | fish | `물고기는 바다에 살아요!` | — |
   | shell | `조개는 바다에 살아요!` | — |
   | starfish | `불가사리는 바다에 살아요!` | — |
   | butterfly | — | `나비는 하늘을 날아요. 땅 친구예요.` |
   | rabbit | — | `토끼는 땅에서 뛰어요. 땅 친구예요.` |
   | flower | — | `꽃은 땅에서 피어요. 땅 친구예요.` |
   | bird | — | `새는 하늘을 날아요. 땅 친구예요.` |
   | tree | — | `나무는 땅에서 자라요. 땅 친구예요.` |
   | dog | — | `강아지는 땅에서 뛰어요. 땅 친구예요.` |
   라운드마다: `say('바다에 사는 친구는 누구일까요?')` → `await T.choose(opts.map(o => ({ el: o.a.pos, ok: o.name === ok, onWrong: async () => { await o.a.wiggle(8, 360); await say(WRONG[o.name]); } })), { prompt: '바다에 사는 친구는 누구일까요?' })`. 두 번 틀리면 엔진이 정답을 반짝이고 나머지를 흐리게 한다(추가 코드 없음).
   정답 뒤: `sparkle(T, a.x, a.y - IH / 2, 70, 8)`; `await a.move(500, 488, 700, 'ease-in')`; `sfx(T, 'splash')`; `T.pop(500, 430, tr('퐁당!'))`; `await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], 300)`; `hide(a)`; 나머지 둘 `fadeOut(T, ·, 300)`; `await say(RIGHT[ok])`; `await sleep(300)`.
3. 놀이 뒤: 세로면 opacity 복구; `prince.look('stand')`; `say('바다에서 온 아이 같아요. 내 귀여운 동생처럼 지내요.')` — `prince.hop(8, 360)`, `mer.hop(6, 360)`.
4. 춤: `put(T, mer, X(440, 440), FL, { look: 'dance', to: 'right' })`; `put(T, prince, X(570, 570), FL, { look: 'dance', to: 'left' })`; `sfx(T, 'giggle_xylo')`; `Promise.all([ say('인어공주는 흔들흔들해도 왕자님과 함께 춤추었어요.'), (async () => { for 2회: 둘 다 x-30 (600ms) 뒤 x+30 (600ms); 첫 회 뒤 `T.pop(mer.x, FL - 250, tr('흔들흔들'))` })() ])`.
5. `await sleep(300)`.

### 6-9. 왕자의 결혼 (자동)
`sceneCard('왕자의 결혼', ..., prince.pos)`: `scene('deck')`; `prince` look stand, X(470, 470), 520, to 'right'; `lady` look wed, X(610, 590), 520, to 'left'; `mer` look sad, X(230, 350), 522, to 'right'; `if (P) camSnap(500, 280, 1)`.
1. `sfx(T, 'bell')` 두 번(600ms 간격); `prince.hop(10, 360)`; `say('당신이 모래밭에서 저를 구해 준 분이군요!')` — `lady.hop(8, 360)`.
2. 세로 `follow(400)`; `say('왕자님은 이웃 나라 공주님과 결혼했어요. 인어공주는 말없이 웃었어요. 마음은 아팠지요.')` — 말하는 동안 `mer.wiggle(2, 900)` 한 번, 끝에 `glow(mer, 1000)`.
3. `await sleep(400)`.

### 6-10. 언니들의 단검 (자동, 조작 없음)
`sceneCard('새벽 바다', ..., sisters.pos)`: `scene('dawn_sea')`; `sun` (820, WATER + 130) → put 뒤 `T.bg.appendChild(sun.pos)` (배 뒤); `ship` look flower, **720**, WATER + 28 (가로·세로 같은 자리, 세로는 카메라로 따라감); `prince` look sleep, (ship.x + 40, ship.y + DECK_DY), to 'left'; `lady` look sleep, (ship.x + 150, ship.y + DECK_DY), to 'right'; `mer` look sad, (ship.x + BOW_DX, ship.y + DECK_DY), to 'left'; `sisters` look short, **250**, WATER + 90, `opacity 0`; `wave` (500, WATER + 75) 맨 앞; `if (P) camSnap(300, 280, 1)`.
1. `sfx(T, 'bubbles')`; `fadeIn(sisters, 900)`; `Promise.all([ say('새벽, 배 옆에 언니들이 올라왔어요. 긴 머리가 짧아졌어요.'), sisters.move(250, WATER + 10, 1200, 'ease-out') ])`.
2. `put(T, dagger, sisters.x - sisters.w * .36, WATER - 40)`; `fadeIn(dagger, 300)`; `sisters.hop(8, 400)`; `say('마녀에게 머리카락을 주고 이 단검을 받았어.')` (합창 클립).
3. `sisters.wiggle(2, 800)`; `say('해가 뜨기 전에 이걸 왕자에게 쓰면 너는 다시 인어가 돼. 그러지 않으면 거품이 되는 거야.')` (합창 클립).
4. 세로 `follow(560)`; `sfx(T, 'swish')`; `await dagger.move(mer.x, mer.y - mer.h * .38, 900)` (손 모은 자리).
5. `Promise.all([ say('인어공주는 잠든 왕자님과 공주님을 보았어요. 그리고 고개를 저었지요.'), (async () => { follow(ship.x); glow(prince, 1400); glow(lady, 1400); await sleep(2200); follow(560); mer.look('shake'); await mer.wiggle(4, 700); await mer.wiggle(4, 700); })() ])`.
6. 던지기: `mer.look('throw', 'left')`; `sfx(T, 'whoosh')`; `const SP = [430, WATER + 40]`; `await dagger.move(mer.x - 120, mer.y - 260, 450, 'ease-out')`; `await dagger.move(SP[0], SP[1], 650, 'ease-in')`; `hide(dagger)`; `sfx(T, 'splash')`; `T.pop(SP[0], WATER - 50, tr('풍덩!'))`; `rippleAt(T, SP[0], WATER + 20)`; `glints(T, SP[0], WATER + 10)`.
7. 해돋이(비동기): `sun.move(820, WATER - 40, 2500, 'ease-out')`; `const warm = tint(T, '#F2B366', 0)` 를 `T.anim(warm, [{ opacity: 0 }, { opacity: .18 }], 2500)`; `sfx(T, 'sparkle')`. 동시에 `say('인어공주는 단검을 칼집째 바다에 던졌어요. 물결이 붉은 금빛으로 반짝였어요. 해가 떠올랐어요.')`; `mer.look('sad', 'left')`.
8. 거품: `const mx = mer.x, my = mer.y`; `await fadeOut(T, mer, 500)`; `put(T, mer, mx, my, { look: 'bubble', s: .6 })`; `fadeIn(mer, 600)`; `sfx(T, 'slide_up')`; `bubblesUp(T, mx, my - 80, 8, 260)`; `sparkle(T, mx, my - 110, 120, 12)`; `Promise.all([ say('인어공주는 반짝이는 거품이 되어 하늘로 둥실 올라갔어요.'), mer.move(mx + 40, 90, 3200, 'ease-in-out') ])` — 올라가는 동안 `mer.setScale` 은 .6 고정, `T.pop(mx + 40, 230, tr('둥실'))` 한 번; 끝에 `fadeOut(T, sisters, 800)`, `fadeOut(T, mer, 600)`.
9. `await sleep(300)`.

### 6-11. 바닷바람이 되어 (톡 3: 인사)
`sceneCard('바닷바람', ..., mer.pos)`: `scene('morning_sea')`; `ship` look flower, X(640, 600), WATER11 + 28; `prince` look stand, (ship.x - SHIP_W * .10, ship.y + DECK_DY), to 'left'; `lady` look wed, (ship.x + 60, ship.y + DECK_DY), to 'left'; `wave` (500, WATER11 + 75) 맨 앞(배·사람 뒤에 둔다 — 배는 수면 위이므로 wave 는 선체 아래만 가린다); `mer` look bubble, X(300, 380), 300, s 1 (거품 가운데 ≈ y 185); `gulls[0]` (X(150, 250), 120), `gulls[1]` (X(820, 560), 90) — `pos.animate` 로 x ±30 · y ±10 (4000ms, infinite, alternate); `if (P) camSnap(460, 280, 1)`.
1. `say('인어공주는 부드러운 바닷바람이 되었어요. 길 잃은 배의 돛을 밀어 주고, 더운 날엔 시원한 바람을 보내지요.')` — `mer.pos.animate` 상하 6px (1600ms, infinite).
2. `say('거품 빛을 톡 눌러 인사해요.')`; `await T.tap(mer.pos, { prompt: '거품 빛을 톡 눌러 인사해요.' })`.
3. 톡 뒤(자동): `sfx(T, 'blow_long', () => sfx(T, 'whoosh'))`; `wind[0]` (mer.x + 70, 220) → `(ship.x + 150, 200)` 1400ms, `wind[1]` (mer.x + 50, 300) → `(ship.x + 120, 280)` 1600ms (둘 다 fadeIn 300 → 끝에 fadeOut); `T.pop(mer.x + 130, 170, tr('휘잉~'))`; `ship.body.animate` scale 1 → 1.05 → 1 (900ms) + `ship.hop(10, 600)` + `ship.move(ship.x - 60, ship.y, 1800)`; `prince.hop(10, 460)`, `lady.hop(10, 460)`, `gulls.forEach(g => g.hop(16, 500))`; `glow(mer, 1400)`; `mer.hop(14, 500)`; `T.confetti()`; `sfx(T, 'tada', sparkleSfx)`.
4. `say('사랑하는 마음은 사라지지 않아요. 안녕, 또 만나요!')` (인어공주 목소리가 돌아온다).
5. `say('사랑하는 마음으로 양보하면, 그 마음은 좋은 일이 되어 남아요.')`.
6. `T.finale(); await sleep(1500); return '사랑하는 마음으로 양보하면, 그 마음은 좋은 일이 되어 남아요.';`

### 6-12. 컷신 (그림 컷) — CLAUDE.md §5-2, 까치(`tales/magpie`)·신데렐라 방식 (2026-10-21 추가)
- 컷 **4장**(3·5·7·10번). 컷은 그 사건 **직후**에만 띄우고, 컷 위에서 그 장면의 **기존 대사 한 줄**을 읽는다: `const c = T.cutImage([{ src: artSrc('cut_…'), sfx: '…', hold: CUT_HOLD }], { hold: CUT_HOLD }); await say(L); await c;` (`CUT_HOLD = 4200`ms; 대사가 홀드보다 길면 컷이 먼저 닫혀도 된다; 톡하면 바로 넘어간다 — 엔진 `cutImage`, `engine/tale.js` 619행). 컷 패널은 엔진이 4:3 흰 테두리 종이로 보여 주므로 그림도 4:3 으로 만든다. 코드(`little_mermaid.js`)·그림 생성은 뒤의 큐에서 한다(이 문서는 기획만).
- 그림: `assets/v3w/mer_cut_<이름>.webp`(1200×900). 작업표 `jobs_little_mermaid.json` 의 `kind: "cut"` 항목 **4장**(`pass 3`, 참고 그림 `refs` 는 그 컷에 나오는 인물·소품 스프라이트 — 스프라이트가 모두 나온 뒤에 만든다). 후처리: `post_little_mermaid.py` 는 sprite/bg 만 다루므로 컷은 `post_cinderella2.py` 처럼 4:3 가운데 자르기 → 1200×900 webp 로 따로 변환한다.
- 규칙: 한 장면에 한 컷, 이웃한 장면에 연달아 두지 않는다(3·5·7·10). 컷 안 인물은 스프라이트와 같은 얼굴 규칙(점 눈·점 코·띠 입·분홍 볼), 소품(배·파도·구름·약병·단검·별)은 얼굴 없음, 피·눈물·아픔 없음. 단검은 **칼집째**(손잡이와 칼집만, 칼날 없음 — 10번 무대와 같다). 컷 위 대사는 모두 §7 대본에 **이미 있는 줄**이라 새 녹음이 없다(영어는 `voice_script_en.json` 의 같은 줄, `ui` 추가 없음). 컷이 닫힌 뒤 무대는 그 장면의 다음 단계부터 이어진다(컷이 대신한 애니메이션은 생략해도 된다).
- 시선(§5-1): 컷마다 누가 누구를 보는지 구도 칸에 적었다. 3번은 인어공주가 왕자(왼쪽 아래)를, 5번은 둘이 마주 보고, 7번은 자기 발을 내려다보고, 10번은 왼쪽(단검·바다)을 본다 — 한쪽만 보는 컷이 연달아 오지 않는다.

| 컷 id | 장면 | 앞 장면 → 뒤 장면 | 보여 줄 순간 | 그림 구도(얼굴 규칙·시선 포함) | 컷 위 대사(한국어 / 영어) | 컷 동안 음성 | 효과음 | refs |
|---|---|---|---|---|---|---|---|---|
| `mer_cut_rescue` | 3 폭풍 | 2 밤바다 → 4 모래밭 | 큰 사건: 폭풍 속에서 인어공주가 바다에 빠진 왕자의 머리를 물 위로 받치는 순간(6-3 의 3 `mer.move` 가 끝난 직후; 4 의 느린 나란히 이동은 생략해도 된다) | 밤 폭풍(세트 B, 달 오른쪽 위). 가운데 인어공주가 가로로 헤엄치며 두 팔을 앞으로 뻗어 눈 감은 왕자의 머리를 받친다(왕자는 편안한 얼굴, 왕관 그대로, 다치지 않음). 양옆에 크림 거품 모자의 큰 남색 파도, 오른쪽 위에 15° 기운 배와 먹구름 둘, 그 사이 작은 달. 속도선 띠로 바람. 인어공주는 용감한 얼굴(눈 뜨고 입은 작은 일자). 시선: 인어공주 → 왕자. | 인어공주는 왕자님의 머리를 물 위로 받쳐 주었어요. / The little mermaid held the prince's head above the water. | 있음(nar, 기존 클립) | `whoosh` | mer_mer_hold · mer_prince_float · mer_prop_ship_tilt · mer_prop_wave_big |
| `mer_cut_star` | 5 할머니의 이야기 | 4 모래밭 → 6 바다 마녀 | 마음이 정해지는 순간: 할머니가 "별처럼 영원히 남는 마음"을 이야기하고 막내가 올려다보는 순간(6-5 의 1 뒤, 2 의 대사를 컷 위에서 읽는다) | 바다 밑 궁전 정원(세트 A). 오른쪽 할머니가 왼쪽을 보며 한 손을 들어 이야기하고(따뜻한 미소), 왼쪽 막내(꼬리)가 오른쪽 할머니 쪽을 보며 두 손을 가슴에 모으고 눈을 크게 뜨고 올려다본다(입 작게 벌림). 위쪽 물 너머에 크림 종이 별들이 흩어져 빛나고(별처럼 남는 마음), 왼쪽 위에서 빛줄기 셋, 작은 거품 몇 개. 조용한 컷(속도선 대신 빛줄기). 시선: 막내 ↔ 할머니. | 사람은 땅 위에서 살고, 우리는 바다에서 살지. 사람에겐 별처럼 영원히 남는 마음이 있단다. / People live on the land, and we live in the sea. But people have a heart that lasts forever, like a star. | 있음(granny, 기존 클립; 홀드보다 길어 컷이 먼저 닫힌다) | `sparkle` | mer_granny_hand · mer_mer_worry |
| `mer_cut_legs` | 7 다리가 생겼어요 | 6 바다 마녀 → 8 궁전 정원 | 변신: 약을 마신 뒤 꼬리가 사라지고 다리가 생겨 첫걸음이 흔들리는 순간(6-7 의 2 반짝·`mer.look('stand')` 직후; 컷 뒤 3 의 '흔들흔들' 팝 + `wobbleWalk` 를 이어 간다) | 새벽 궁전 계단(세트 A). 하얀 한지 옷에 맨발의 막내가 맨 아래 계단에서 몸이 8° 기운 첫걸음, 한 발 들고 두 팔을 벌려 균형, 놀랐지만 기쁜 얼굴로 **자기 발을 내려다본다**. 다리 둘레에 크림·짚빛 반짝 별 터짐(꼬리 없음, 바닥에 비늘 없음, 아프지 않음). 옆 계단에 빈 약병(코르크). 짧은 속도선 셋. 뒤에 크림 기둥 둘, 왼쪽 끝 연청록 바다 띠. 왕자 없음. 시선: 막내 → 자기 발. | 꼬리가 사라지고 다리가 생겼어요! 걸음은 흔들흔들. / Her tail was gone and she had legs! Her steps went wobble, wobble. | 있음(nar, 기존 클립) | `sparkle` | mer_mer_wobble_a · mer_prop_potion_empty |
| `mer_cut_throw` | 10 새벽 바다 | 9 왕자의 결혼 → 11 바닷바람 | 결말 전 큰 선택: 인어공주가 단검을 칼집째 바다에 던지는 순간(6-10 의 6 던지기·'풍덩!' 직후; 7 의 해돋이·`warm` tint 는 컷이 닫힌 뒤 대사 없이 2500ms 돌리고 8 거품으로 간다) | 해 뜨기 직전 바다(세트 A, 왼쪽 위 빛). 오른쪽에 꽃 장식 배의 뱃머리(왼쪽 향함, 뱃머리 화환), 그 갑판에 하얀 옷 막내가 왼쪽을 보고 한 팔을 앞으로 뻗어 **빈손**(막 던짐). 공중 가운데 **칼집째** 단검(손잡이+칼집만, 칼날 없음)이 종이 호를 그리며 날고, 떨어질 물 위에 팥빛·짚빛 반짝 셋과 크림 파문 하나. 왼쪽 아래 짧은 머리 언니 다섯이 수면 위로 상체를 내밀고 막내를 올려다본다(걱정스럽지만 눈물 없음, 입 다묾). 왼쪽 수평선에 짚빛 반원 해와 크림 빛줄기. 막내는 차분하고 후련한 작은 미소(슬프지 않음). 잠든 왕자·공주는 넣지 않는다. 시선: 막내 → 날아가는 단검·바다, 언니들 → 막내. | 인어공주는 단검을 칼집째 바다에 던졌어요. 물결이 붉은 금빛으로 반짝였어요. 해가 떠올랐어요. / The little mermaid threw the dagger, still in its sheath, into the sea. The waves sparkled red and gold. The sun rose. | 있음(nar, 기존 클립; 홀드보다 길어 컷이 먼저 닫힌다) | `splash` | mer_mer_throw · mer_prop_dagger · mer_sisters_short · mer_prop_ship_flower |

컷 음성 필요(모두 §7 대본의 기존 줄, 새 줄 없음): 3번 nar "인어공주는 왕자님의 머리를…", 5번 granny "사람은 땅 위에서 살고…", 7번 nar "꼬리가 사라지고…", 10번 nar "인어공주는 단검을 칼집째…". 컷을 두지 않은 장면: 1·2(놀이·톡 장면, 3과 이웃), 4(3과 이웃), 6(7과 이웃: 목소리 진주는 무대 애니메이션으로 충분), 8·9(8은 7과, 9는 10과 이웃), 11(10과 이웃, 인사 톡).

---

## 7. 녹음 (ElevenLabs, 처음부터)

- 파일: `voice_script_el.json`(한국어 60줄 + extra ch1·ch2), `voice_script_en.json`(같은 줄의 영어 + `ui`). 모양은 백설공주·골디락스와 같다 (`segs = [배역, 글, 감정프리셋, 연기 지시]`). `scene` 키는 참고용(생성기는 무시).
- 배역·목소리: nar=Annie, mer=Luna, granny=Huelyn, prince=Sunjun, witch=Matilda(지시로 부드럽게), lady=Haemi, 언니 sisa Ailra · sisb Sena · sisc Laura · sisd Bella · sise Leejin. 바다 왕은 대사 없음. 수 세기 클립 없음.
- **목소리 없는 장면**: 6번 가마솥 톡 뒤부터 10번 끝까지 `mer` 줄이 없다. 7번 "누구세요?" 뒤에는 `…` pop + `doop` 소리만. 그녀의 마음은 nar 줄("그저 웃었지요", "말없이 웃었어요. 마음은 아팠지요", "고개를 저었지요")이 말한다. 허밍 클립은 만들지 않는다. 11번에서 `mer` 한 줄로 목소리가 돌아온다.
- **합창(언니들)**: `extra.ch1`, `extra.ch2` 에 같은 문장 × 다섯 배역. `tales/snow_white/mix_chorus_el.py` 를 `tales/little_mermaid/mix_chorus_el.py` 로 복사해 고친다: `HERE` 경로, `DELAY_MS = [0, 70, 30, 110, 50]`, `spec = json.load(open(HERE/'voice_script_el.json'))['chorus']`(이 동화는 Typecast `voice_script.json` 이 없다), 출력 경로 `audio/el/little_mermaid/chorus(/en)`, `chorus_el.js` 머리 주석. 섞인 파일이 `NARRATION_CLIPS["마녀에게 …"]`, `NARRATION_CLIPS["해가 뜨기 전에 …"]` 가 된다.
- 순서:
  1. `python3 tools/elevenlabs/gen_tale.py little_mermaid --model eleven_v4 --dry` (글자 수 확인, 약 1,900자 + 합창 450자)
  2. `touch /tmp/lm_marker; python3 tools/elevenlabs/gen_tale.py little_mermaid --model eleven_v4` → `narration_el.js`
  3. `python3 tools/elevenlabs/gen_tale.py little_mermaid --model eleven_v4 --lang en` → `narration_el_en.js` (약 4,300자)
  4. `python3 tales/little_mermaid/mix_chorus_el.py` → `chorus_el.js`
  5. `~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py little_mermaid /tmp/lm_marker` 와 `... en` — `<<<` 표시(되풀이)가 있으면 그 줄만 `--redo` 대신 `trim_line.py` 로 꼬리를 자르거나 지시 태그를 바꿔 다시 만든다.
- 뼈대 파일(처음 한 번 손으로 만든다):
  - `narration.js`: `/* little_mermaid — Typecast 판 없음. 녹음은 narration_el.js(ElevenLabs) */ const NARRATION_CLIPS = {}; const VOICE_LINES = {};`
  - `narration_en.js`: `const NARRATION_CLIPS_EN = {}; const VOICE_LINES_EN = {}; const TEXT_EN = {...voice_script_en.json 의 ui 그대로...};` — 한 줄 생성: `python3 -c "import json;u=json.load(open('tales/little_mermaid/voice_script_en.json'))['ui'];open('tales/little_mermaid/narration_en.js','w').write('/* little_mermaid — 영어 글자 (녹음은 narration_el_en.js) */\nconst NARRATION_CLIPS_EN = {};\nconst VOICE_LINES_EN = {};\nconst TEXT_EN = '+json.dumps(u,ensure_ascii=False,indent=1)+';\n')"`
  - `index.html`: 백설공주 것을 복사하되 `<title>인어공주</title>`, `chorus.js` 줄은 빼고 `chorus_el.js` 줄만 남긴다(`localStorage.voice !== 'tc'` 조건 그대로), 마지막 `<script src="little_mermaid.js">`.
- `ui`(화면 글자 번역)에 들어 있는 것: 제목·부제, 장면 이름 11개, pop 글자(`펑!` `풍덩!` `퐁당!` `보글보글` `꿀꺽!` `흔들흔들` `…` `휘잉~` `둥실` `가라앉아요` `떠요`), `끝!`. 코드에서 새 pop 글자를 쓰면 `ui` 에도 넣는다.

## 8. 효과음 (`sounds/sfx/`, 있는 것만)
`bubbles`(물속 이동·가라앉기·거품), `splash`(퐁당·단검), `splash_big`(왕자 추락), `pow` `boom`(불꽃), `sparkle`(마법·진주·변신), `whoosh`(폭풍·던지기), `thud`(배 기우뚱), `paper_down`(물건이 바닥에), `gulp`(약), `doop`(`…`), `step_grass`(모래밭 걷기), `step_wood`(계단·갑판), `swish`(단검 건넴), `bell`(결혼), `giggle_xylo`(춤), `slide_up`(거품 상승), `blow_long`→없으면 `whoosh`(바람), `tada`(끝), `pop`(popSfx). 엔진: `AudioFX.ding/miss`(고르기), `page_turn`(전환).

## 9. 홈·시작 화면·끝 화면

### 카탈로그 (`tales/catalog.js`, 백설공주 뒤에 추가)
```js
  { id: 'little_mermaid', title: '인어공주', origin: 'world', also: ['princess'], skills: ['size', 'sort', 'heart'], ready: false, making: true,
    line: '무거운 건 가라앉고 가벼운 건 떠요. 바다 친구와 땅 친구를 가르고, 인어공주의 다정한 양보를 만나요.',
    en: { title: 'The Little Mermaid', line: 'Heavy things sink and light things float. Sort sea friends from land friends, and meet the little mermaid\'s gentle gift of love.' },
    art: `<rect width="160" height="110" fill="#2F6F6A"/>
      <g class="pc"><rect y="92" width="160" height="18" fill="${c.sk}"/>
      <circle cx="22" cy="90" r="9" fill="${c.ps}"/><circle cx="138" cy="88" r="11" fill="${c.rd}"/>
      <circle cx="120" cy="24" r="4" fill="${c.cr}"/><circle cx="130" cy="14" r="2.5" fill="${c.cr}"/><circle cx="112" cy="38" r="2.5" fill="${c.cr}"/>
      <path d="M70 62 q-18 14 -26 30 l14 -2 l2 10 q14 -16 22 -34z" fill="#7FBFB5"/><path d="M62 72 q6 4 12 0 M58 80 q6 4 12 0" stroke="#4F9A90" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M66 44 h20 l4 20 h-28z" fill="${c.cr}"/>
      <circle cx="76" cy="34" r="14" fill="${c.sk}"/>
      <path d="M62 32 a14 14 0 0 1 28 0 v4 q-2 -6 -8 -8 q-6 2 -12 0 q-6 2 -8 8z" fill="${c.gd}"/><path d="M88 34 q10 14 4 32 q-4 -8 -8 -12z" fill="${c.gd}"/>
      ${eye(71, 36, 1.5)}${eye(80, 36, 1.5)}<path d="M73 42 q3 2 6 0" stroke="${c.rd}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M86 50 q14 -10 20 -24" stroke="${c.sk}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M118 44 v16 m-8 -6 q8 10 16 0 m-8 -22 a3 3 0 1 0 0.1 0" stroke="${c.dk}" stroke-width="3" fill="none" stroke-linecap="round"/></g>` },
```
`skills` 는 PLAN 확정대로 `size`(뜨고 가라앉기 = 무겁고 가벼움), `sort`, `heart`. `position` 은 넣지 않는다.

### 키아트 → 썸네일 (키아트 5장이 나온 뒤)
- `assets/raw/keyart_gpt/little_mermaid_wide_v5.png` → `assets/thumbs/little_mermaid_key_wide.webp` (1672×941), `_tall_v5.png` → `_key_tall.webp` (1086×1448), `_tile_v5.png` → `_tile.webp` (720×540). 가운데 자르기 + LANCZOS, quality 86 (back_to_webp.py 와 같은 방식).
- `python tools/app/gen/back_to_webp.py little_mermaid` → `_back_wide.webp`, `_back_tall.webp`.
- `assets/thumbs/thumbs.js`: `THUMBSKEY` 에 `"little_mermaid"` 추가, `THUMBSKEYLIGHT` 에 `"little_mermaid": "#f5efe9"`, `BACKACCENT` 에 `"little_mermaid": "#2F6F6A"` (끝 화면 리본 = 깊은 청록). `tools/gpu_night/make_thumbs.py` 의 `BACKACCENT` 사전에도 같은 값을 넣는다(다음 재생성 때 지워지지 않게). `_light.webp` 는 만들지 않는다(백설공주와 같음).

## 10. 그림 생성·후처리 절차

1. `jobs_little_mermaid.json` 은 `pass` 순서가 이미 참고 그림 순서다. 1단계(`pass: 1`, 참고 없음)를 먼저: `python3 tools/app/gen/run_simple.py little_mermaid mer_mer_swim mer_fish_a mer_prop_ship_lantern mer_prop_cauldron_dim mer_prop_potion_empty mer_prop_fw_a mer_prop_wave ...`(1단계 전부). 한도에 걸리면 run_simple 이 풀리는 시각까지 기다린다. **한 번에 많이 요청하지 않는다**(CLAUDE.md §6).
2. `mer_mer_swim` 이 마음에 들어야 2단계를 돌린다(머리 크기·한지 조끼·납작 꼬리 확인). 틀리면 그 한 장만 지우고 다시.
3. 2단계: 나머지 `pass: 2` 인물·소품, 그다음 배경 9장, 그다음 **컷 4장**(`pass: 3`, `mer_cut_rescue`·`mer_cut_star`·`mer_cut_legs`·`mer_cut_throw` — refs 인 `mer_mer_hold`·`mer_prince_float`·`mer_prop_ship_tilt`·`mer_prop_wave_big`·`mer_granny_hand`·`mer_mer_worry`·`mer_mer_wobble_a`·`mer_prop_potion_empty`·`mer_mer_throw`·`mer_prop_dagger`·`mer_sisters_short`·`mer_prop_ship_flower` 가 있어야 한다; §6-12), 맨 끝 키아트 5장(`key5_*`는 `mer_mer_swim`·`mer_mer_stand`·`mer_prince_stand`·`mer_lady_wed`·`mer_prop_ship_flower`·`mer_mer_bubble` 이 있어야 한다). 작업표에서 컷은 배경 뒤·키아트 앞에 있다(`bg2_*`·`bg3_*`·`bg4_*` 재생성 배경은 키아트 뒤에 따로 붙어 있다).
4. 후처리: `tools/app/gen/post_cinderella2.py` 를 `post_little_mermaid.py` 로 복사해 고친다 — 작업표 `jobs_little_mermaid.json`, 임시 폴더 `assets/raw/restyle/little_mermaid_key`, 그림은 `tools/gpu_night/chromakey.py` 로 마젠타를 빼고 `j['size']` 상자 안에 맞춰 `assets/v3w/<id>.webp`, 배경은 16:9 가운데 자르기 → 1600×902, 컷(`kind: 'cut'`)은 크로마키 없이 4:3 가운데 자르기 → 1200×900 `assets/v3w/mer_cut_<이름>.webp`, 키아트(`kind: 'key'`)는 건너뛴다(§9). 합성 단계는 없다(시계·발 카드 코드 삭제). 끝에 **ASP 를 출력**해 `little_mermaid.js` 의 `ASP` 에 붙인다(컷은 ASP 에 넣지 않는다 — `cutImage` 가 그대로 띄운다). ASP·HT·NAT 의 키는 작업표 id 에서 앞의 `mer_` 를 뗀 이름이다 (`mer_mer_swim` → `mer_swim`, `mer_prop_ship_lantern` → `prop_ship_lantern`; `artSrc(k) = AS + 'mer_' + k + '.webp'`).
5. 머리 지름 재기: `mer_mer_swim`·`mer_mer_stand`·`mer_prince_stand`·`mer_lady_stand`·`mer_witch_stand`·`mer_granny_talk`·`mer_king`·`mer_sisters_long` 을 HT 높이로 놓았을 때 머리 지름이 모두 80±4 가 되게 HT 를 손본다. 다른 자세(앉기·눕기·상체)는 그 인물의 머리 지름에 맞춘다.
6. 그림 점검표: 사물(돌·닻·병·가마솥·배·단검·구름·파도)에 얼굴이 없는지, 단검에 칼날이 없는지, 마녀가 무섭지 않은지, 왕자 float/lie 가 다치지 않은 편안한 얼굴인지, 조개 브라가 아닌지. 컷 4장은 더해서: 4:3 풀블리드(테두리·글자·말풍선 없음, 마젠타 없음)인지, 인물 머리 크기가 스프라이트와 같은지(막내와 할머니·언니들·왕자 머리 같음), `mer_cut_legs` 에 꼬리·비늘이 없는지, `mer_cut_throw` 의 단검이 칼집째이고 언니들이 울지 않는지, 시선이 §6-12 표와 같은지. 어긋나면 그 한 장만 다시 뽑는다.

---

## 11. 테스트 점검표

### 준비
- 서버(저장소 뿌리에서, 자기 포트): `python3 -m http.server 8871 --bind 127.0.0.1` (다른 에이전트와 겹치지 않게 88xx 중 빈 것).
- 크롬(한 번에 하나, 새 프로필): `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless=new --remote-debugging-port=9341 --user-data-dir=<scratchpad>/chrome_lm about:blank &` 뒤 5초 대기.
- 가로: `CDP=9341 node assets/raw/_work/autoplay.mjs http://127.0.0.1:8871/tales/little_mermaid/index.html 1366 1024 <scratchpad>/lm_land 600 6`
- 세로: 같은 명령에 `390 844 <scratchpad>/lm_port`.
- 소리 로그: `autoplay_audio.mjs` 로 한 번 더 (`<prefix>_audio.json` 에 NAR/VOICE 시각과 파일 이름).
- 영어: 시작 전에 `localStorage.setItem('lang','en')` 을 넣은 뒤(autoplay 의 첫 `Runtime.evaluate` 앞에 한 줄 추가하거나 `?lang=en` 처리가 있으면 그것) 같은 두 크기.
- 포트 8188(GPU)과 내가 띄우지 않은 프로세스는 건드리지 않는다.

### 확인할 것 (스크린샷 + 로그)
1. **오류 0**: autoplay 출력의 `errors` 가 404·JS 예외 없이 비어 있다. 특히 `mer_*.webp` 404, `audio/el/little_mermaid/*` 404.
2. **머리 크기**: 1번(왕·할머니·언니들·막내), 4번(왕자·아가씨·막내), 6번(마녀·막내), 10번(언니들·막내·잠든 둘)에서 머리 지름이 같아 보인다(스크린샷에서 픽셀로 재서 ±5%).
3. **방향**: 2번 왕자는 뱃머리(왼쪽)를 보고 막내는 배를 본다. 3번 막내 손이 왕자 머리에 닿는다(HOLD_DX). 4번 막내는 바위 **뒤**, 아가씨는 왕자를 본다. 5·6번 막내와 할머니/마녀가 마주 본다. 7번 왕자가 막내를 본다. 10번 막내는 언니들 쪽(왼쪽)으로 던지고 단검이 배가 아닌 바다에 떨어진다. 11번 바람이 막내에서 돛으로 간다.
4. **겹침 순서**: 2·10·11번 `wave` 가 맨 앞(수면 아래 몸·선체 아래를 가림), 3번 구름은 배경층, 10번 해는 배 뒤, 4번 바위가 막내 앞, 8번 카드가 연못 위.
5. **누르기 자리 크기**: 1번 돌·나무·닻·병(hit r 62), 2번 하늘 rect, 6번 가마솥, 8번 카드(hit r 66/52), 11번 거품 — 세로 390 폭에서 화면 픽셀 ≥ 44 이고 잘리지 않는다. 세로에서 1번 두 선택지(440·580)와 8번 세 카드(416·500·584)가 모두 보인다.
6. **고르기 흐름**: 틀린 답에서 설명 줄이 나오고 다시 누를 수 있다. 두 번 틀리면 정답이 반짝이고 나머지가 흐려진다. 정답 뒤 다음 문제로 넘어간다. 5초 무입력 손가락(톡), 12초 재안내(톡·고르기) — `autoplay.mjs` 는 손이 보이면 눌러 주므로 로그에서 12초 재안내가 한 번도 안 나와도 정상.
7. **두 번 재생 없음**: `_audio.json` 에서 같은 파일이 연달아 두 번 나오지 않는다(같은 질문 클립이 문제마다 한 번씩 나오는 것은 정상: 8번 `바다에 사는 친구는 누구일까요?` 3번). 합창 두 줄은 `chorus/ch_*.mp3` 하나씩만 울리고 `sisa_*`… 개별 클립은 울리지 않는다.
8. **녹음 빠짐 0**: `say` 에 쓴 모든 문장이 `narration_el.js`(와 `_en`) 에 있다. 확인 스크립트: `little_mermaid.js` 에서 `say('…')` 문자열을 전부 뽑아 `voice_script_el.json` 의 `text` 집합과 비교(차집합 0). 브라우저 TTS 로 떨어지는 줄이 없어야 한다.
9. **ElevenLabs 되풀이 점검**: `check_new.py little_mermaid <marker>` 와 `… en` 결과에 `<<<` 가 없다. 있으면 §7-5.
10. **첫 조작 ≤ 30초**: `_audio.json` 에서 `무거운 것은 가라앉고…` 클립 시작 시각 ≤ 25초(시작 버튼 기준). 넘으면 1번 해설 두 줄 사이 `sleep` 을 줄인다.
11. **길이**: 자동 재생 끝(끝 화면 등장)이 6분 30초 ~ 8분 30초. 넘치면 장면 끝 `sleep(300)` 과 이동 시간을 줄이고, 모자라면 늘리지 않는다(대사는 고정).
12. **세로 카메라**: 모든 장면에서 화자가 화면 안에 있다(director). 10번에서 언니들 → 막내 → 잠든 둘 → 막내 순으로 따라간다.
13. **그림 규칙**: 사물 얼굴 없음, 단검 칼날 없음, 마녀 미소, 막내는 7번부터 하얀 옷·맨발, 10번 언니들 짧은 머리.
14. **시작·끝 화면**: 시작 화면 키아트(가로·세로) 가 뜨고 `THUMBSKEYLIGHT` 로 흰 종이 모드, 끝 화면 `_back_*` 그림 + 청록 리본, 홈 카드(SVG)와 `_tile.webp` 가 보인다. 홈에서 `공주 동화` 칩으로 잡힌다.
15. **영어 모드**: 장면 이름·pop·말풍선이 영어, 합창 영어 파일이 `chorus/en/` 에서 울린다.
16. **컷**(코드가 붙은 뒤): 3·5·7·10번에서 컷이 한 번씩 뜨고(사진으로 확인), 컷 위에서 §6-12 표의 줄이 울리며 `_audio.json` 에 그 클립이 **한 번만** 기록된다(컷 위와 무대에서 두 번 읽지 않는다). 컷이 없는 장면에 컷이 뜨지 않고, 이웃한 두 장면에 연달아 뜨지 않는다. 톡하면 바로 넘어간다.
