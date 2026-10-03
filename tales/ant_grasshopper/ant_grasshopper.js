/* 개미와 베짱이 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §12 (10장면, 약 8분)
   여름 내내 톡톡톡 먹이를 나른 개미와 노래만 부른 베짱이. 겨울에 창고가 가득하니 친구들을 초대해 겨울 음악회를 연다.
   학습: 사계절 이름·순서 · 계절에 맞는 옷 · 많다/적다(창고 칸) · 미리 준비하기 · 나누기.
   순화: 원작 대사("겨울엔 춤이나 추렴")는 남기되, 아기 개미가 "그래도 추워 보여요" → 아이가 문을 활짝 연다.
   베짱이는 벌받지 않고 음악회 악사가 되고, 봄엔 함께 일한다.
   웃음 컷: 흠뻑 젖은 베짱이 "에취!" · 겨울에 수영복 · 가을에 두꺼운 외투(땀 뻘뻘). */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32', bean: '#A93B32',
    indigo: '#1F2A56', persimmon: '#E8703A', amber: '#F2B366', snow: '#F4F6FA', ink: '#2E241C', pink: '#E8A0A0',
    ant: '#A93B32', antDk: '#6E2620', hop: '#7FA64E', hopDk: '#4F7A34', hopBelly: '#CBDB92',
    soil: '#8A6440', soilDk: '#5E4330', room: '#C79A62', grass: '#7c9a58', rain: '#7F93A6' };
  const SKY = { summer: '#CFE3EE', autumn: '#F4D29A', winter: '#DCE3EA', spring: '#E4EFD2', rain: '#9FB0BE' };
  const GROUND = { summer: '#7c9a58', autumn: '#C8873E', winter: '#F4F6FA', spring: '#9CC07A' };
  const SEASON_KO = { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' };
  const NUM = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const origin = (n, x, y) => { n.style.transformBox = 'view-box'; n.style.transformOrigin = `${x}px ${y}px`; return n; };

  /* ================= 페이퍼아트 그림 (assets/v3w/ag_*.webp) =================
     null이거나 파일을 못 불러오면 그 자리는 아래 임시 도형(그레이박스)으로 그린다. 새 그림이 나오면 여기 한 줄만 바꾸면 된다.
     배경은 장면마다 한 장을 무대에 꽉 채워 깐다. 계절 들판 셋(여름·가을·봄)은 같은 자리(개미집 오른쪽)에 계절만 바뀐다.
     소나기는 여름 들판 위에 곱하기(multiply) 회색 한 겹 + 해를 가리는 먹구름(코드). 겨울 들판은 하이앵글 눈밭 그림. */
  const AS = '../../assets/';
  const BG = {
    summer: 'v3w/ag_bg_summer.webp', autumn: 'v3w/ag_bg_autumn.webp', spring: 'v3w/ag_bg_spring.webp',
    ant_eye: 'v3w/ag_bg_ant_eye.webp', leafstage: 'v3w/ag_bg_leafstage.webp', winter_high: 'v3w/ag_bg_winter_high.webp',
    door: 'v3w/ag_bg_door.webp', cellar: 'v3w/ag_bg_cellar.webp', // cellar: 어두운 흙을 조금 밝혀 구움, 곡식·도토리 방은 그림 속에 이미 가득
  };
  /* 배우·소품·컷 (인물·곤충은 모두 왼쪽을 본다)
     - 개미: 서기 · 나르기(밀 이삭) · 조끼 · 겨울(목도리+털모자) · 아기. 틀린 옷(반팔·외투·튜브)과 땀은 서기 그림 위 코드 덧그림
     - 베짱이: 연주 · 흠뻑(소나기 뒤) · 덜덜(문 앞) · 겨울옷(창고) · 나르기(봄). hopper_hat = 겨울옷 그림에서 털모자만 오린 것 (음악회 연주 자세에 씌움)
     - snail: 눈자루 끝 눈 + 얼굴 눈 = 눈이 넷 → 얼굴의 두 눈을 몸 색으로 지움
     - 컷 3장은 코드 컷 틀(400×300) 안에 그림을 깔고 의성어 글자(에취!·오들오들·활짝!)는 코드가 얹는다
     - 못 써서 그레이박스로 두는 것: acorns(도토리 여섯 개 더미가 아니라 도토리 모자를 쓴 탑 모양 덩어리 하나) → 코드 도토리 */
  const ART = {
    ant_stand: 'v3w/ag_ant_stand.webp', ant_carry: 'v3w/ag_ant_carry.webp', ant_vest: 'v3w/ag_ant_vest.webp',
    ant_winter: 'v3w/ag_ant_winter.webp', ant_baby: 'v3w/ag_ant_baby.webp',
    hopper_play: 'v3w/ag_hopper_play.webp', hopper_wet: 'v3w/ag_hopper_wet.webp', hopper_shiver: 'v3w/ag_hopper_shiver.webp',
    hopper_winter: 'v3w/ag_hopper_winter.webp', hopper_carry: 'v3w/ag_hopper_carry.webp', hopper_hat: 'v3w/ag_hopper_hat.webp',
    ladybug: 'v3w/ag_ladybug.webp', snail: 'v3w/ag_snail.webp', pillbug: 'v3w/ag_pillbug.webp', firefly: 'v3w/ag_firefly.webp',
    leaf_umbrella: 'v3w/ag_leaf_umbrella.webp', acorns: null,
    cut_sneeze: 'v3w/ag_cut_sneeze.webp', cut_shiver: 'v3w/ag_cut_shiver.webp', cut_door: 'v3w/ag_cut_door.webp',
  };
  const artOK = {}, bgOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  /* 자세 그림: [폭, 높이, 발끝 가운데 x(폭 비율), 발끝 y(높이 비율)] — 발끝 가운데가 (0,0).
     한 배우의 자세끼리는 눈 크기와 몸 높이를 반반 맞춰서 자세가 바뀌어도 머리 크기가 튀지 않는다 */
  const SPR = {
    ant_stand: [137.1, 124.2, .523, .974], ant_carry: [101.9, 191.4, .599, .982], ant_vest: [127.7, 141, .461, .977],
    ant_winter: [146.5, 159.7, .621, .979], ant_baby: [148.6, 123.6, .526, .977],
    hopper_play: [221.6, 224.1, .534, .979], hopper_wet: [236.1, 171.9, .545, .976], hopper_shiver: [187.2, 205.5, .545, .98],
    hopper_winter: [254.1, 183.7, .46, .976], hopper_carry: [192.5, 212, .476, .98],
    ladybug: [105.3, 67.8, .523, .972], snail: [105.9, 82, .557, .973], pillbug: [96.9, 53.7, .51, .966], firefly: [84.7, 74.2, .692, .968],
  };
  function pic(T, g, key, x, y, w, h, { shadow = true } = {}) {
    const u = artUrl(key); if (!u) return null;
    const wrap = T.el('g', shadow ? { filter: 'url(#pp)' } : {}, g);
    T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
    return wrap;
  }
  const sprite = (T, g, key) => { const s = SPR[key]; return s ? pic(T, g, key, -s[2] * s[0], -s[3] * s[1], s[0], s[1]) : null; };
  /* 배경 그림: 무대 1000×560을 덮고 가장자리를 조금 더 덮는다 (그림 비율 1760:992). dx·dy: 그림을 통째로 옮긴다 */
  const BG_EDGE = { summer: ['#a8d3eb', '#4a6345'], autumn: ['#fbc9a3', '#6b3209'], spring: ['#b5e6fb', '#62753d'], ant_eye: ['#95becc', '#20230e'],
    leafstage: ['#a5cbd9', '#232011'], winter_high: ['#d0dfee', '#e4ecf7'], door: ['#d4e7fc', '#e3ecfa'], cellar: ['#cad9dd', '#341f0d'] };
  function bgImage(T, key, { dx = 0, dy = 0 } = {}) {
    const u = bgUrl(key); if (!u) return null;
    const w = 1080, h = w * 992 / 1760, x = -40 + dx, y = -24 + dy;
    const [top, bot] = BG_EDGE[key];
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, T.bg);
    T.el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, T.bg);
    return T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, T.bg);
  }

  /* ================= 소리 ================= */
  const SND = {
    violin(T, f) { T.tone(f, .5, { type: 'sawtooth', vol: .05 }); T.tone(f * 2, .45, { type: 'triangle', vol: .06 }); T.tone(f * 1.005, .5, { type: 'triangle', vol: .08 }); },
    tune(T) { [523, 659, 784, 659, 880].forEach((f, i) => { T.tone(f, .3, { type: 'triangle', vol: .09, when: i * .16 }); T.tone(f, .3, { type: 'sawtooth', vol: .03, when: i * .16 }); }); },
    yeongcha(T, n = 3) { for (let i = 0; i < n; i++) T.tone([700 + i * 90, 560 + i * 80], .22, { type: 'triangle', vol: .06, when: i * .03 }); },
    roll(T) { for (let i = 0; i < 5; i++) T.tone([260 - i * 12, 200], .08, { type: 'triangle', vol: .1, when: i * .1 }); },
    shiver(T) { [0, .08, .16, .24].forEach((w, i) => T.tone(i % 2 ? 520 : 600, .06, { type: 'square', vol: .05, when: w })); },
    sneeze(T) { T.tone([500, 900], .25, { type: 'sine', vol: .12 }); T.tone([1200, 300], .2, { type: 'sawtooth', vol: .1, when: .3 }); },
    sparkle(T) { [1047, 1319, 1568, 2093].forEach((f, i) => T.tone(f, .16, { type: 'triangle', vol: .1, when: i * .07 })); },
    step(T) { AudioFX.sfx('step_grass', .3) || T.tone([300, 200], .08, { type: 'sine', vol: .08 }); },
    snowStep(T) { AudioFX.sfx('step_grass', .25) || T.tone([220, 160], .1, { type: 'triangle', vol: .08 }); },
    knock(T) { AudioFX.sfx('knock') || [0, .2].forEach(w => T.tone([180, 90], .12, { type: 'square', vol: .12, when: w })); },
    creak(T) { AudioFX.sfx('creak') || T.tone([220, 330], .6, { type: 'sawtooth', vol: .05 }); },
    door(T) { AudioFX.sfx('door') || AudioFX.thud(); },
    drip(T) { T.tone([1400, 600], .12, { type: 'sine', vol: .08 }); },
    squeak(T, f = 1500) { T.tone([f, f * 1.25], .09, { type: 'sine', vol: .12 }); },
  };
  const PENTA = [392, 440, 523, 587, 659, 784, 880];

  /* ================= 캐릭터 (모두 왼쪽을 본다. 발끝 = 0,0) ================= */
  /* 개미 (키 ~140). 옷은 조각을 얹었다 뺐다 한다 */
  /* 그림 개미: 자세 그림을 겹쳐 두고 antLook()이 하나만 보인다. 코드가 opacity로 켜고 끄던 조각(조끼·목도리·모자·팔·짐)은
     빈 자리로 두고, 틀린 옷(반팔·외투·튜브)과 땀만 서기 그림 몸(머리 -36,-60 · 가슴 0,-40 · 배 37,-45) 위에 덧그린다 */
  function drawAntArt(T, g, { baby = false } = {}) {
    const { el, paper } = T;
    const p = { looks: {}, baby, _wear: [], _carry: false };
    (baby ? ['ant_baby'] : ['ant_stand', 'ant_carry', 'ant_vest', 'ant_winter']).forEach(k => { const s = sprite(T, g, k); if (s) { s.style.display = 'none'; p.looks[k] = s; } });
    const part = (shapes) => { const q = paper(g, shapes); q.setAttribute('opacity', 0); return q; };
    const none = () => el('g', { opacity: 0 }, g);
    p.tee = part([['path', { d: 'M-15 -56 L13 -56 L24 -46 L17 -39 L14 -42 L14 -25 L-14 -25 L-14 -42 L-17 -39 L-24 -46 Z', fill: C.cream }], ['rect', { x: -14, y: -38, width: 28, height: 5, fill: C.persimmon }]]);
    p.coat = part([['path', { d: 'M-20 -58 Q14 -76 58 -62 Q72 -44 62 -22 L-18 -20 Q-24 -40 -20 -58 Z', fill: C.pine }], ['path', { d: 'M-20 -58 L-4 -62 L-10 -44 Z', fill: '#2f5a3f' }],
      ...[-50, -38, -26].map(y => ['circle', { cx: -8, cy: y, r: 3.2, fill: C.gold }])]);
    p.ring = part([['ellipse', { cx: 16, cy: -36, rx: 40, ry: 12, fill: C.persimmon }], ['rect', { x: -6, y: -48, width: 9, height: 24, fill: C.cream }], ['rect', { x: 32, y: -48, width: 9, height: 24, fill: C.cream }]]);
    p.vest = none(); p.scarf = none(); p.hat = none(); p.armDown = none(); p.armUp = none(); p.load = none();
    p.mouth = el('path', { d: '', opacity: 0 }, g);
    p.sweat = el('g', { opacity: 0 }, g);
    [[-66, -96], [-14, -104]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q-5 8 0 12 q5 -4 0 -12 Z`, fill: '#9FC6DE' }, p.sweat));
    antLook(p);
    return p;
  }
  function antLook(p) {
    if (!p.looks) return;
    const w = p._wear, k = p.baby ? 'ant_baby' : p._carry ? 'ant_carry' : w.includes('vest') ? 'ant_vest' : (w.includes('scarf') || w.includes('hat')) ? 'ant_winter' : 'ant_stand';
    const show = p.looks[k] ? k : Object.keys(p.looks)[0];
    Object.entries(p.looks).forEach(([kk, s]) => { s.style.display = kk === show ? '' : 'none'; });
  }
  function drawAnt(T, g, { color = C.ant, baby = false } = {}) {
    if (artUrl(baby ? 'ant_baby' : 'ant_stand')) return drawAntArt(T, g, { baby });
    const { el, paper } = T;
    const p = {};
    paper(g, [
      ['path', { d: 'M-2 -40 L-12 -4', stroke: C.antDk, 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }],
      ['path', { d: 'M10 -40 L16 -4', stroke: C.antDk, 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }],
      ['ellipse', { cx: -14, cy: -4, rx: 9, ry: 5, fill: C.antDk }], ['ellipse', { cx: 18, cy: -4, rx: 9, ry: 5, fill: C.antDk }],
      ['ellipse', { cx: 20, cy: -46, rx: 22, ry: 20, fill: color }],
      ['ellipse', { cx: 0, cy: -62, rx: 13, ry: 16, fill: color }],
      ['circle', { cx: -8, cy: -94, r: 21, fill: color }],
    ]);
    el('path', { d: 'M-16 -110 Q-26 -134 -38 -130 M-4 -113 Q0 -140 -12 -144', stroke: color, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
    el('circle', { cx: -38, cy: -130, r: 5, fill: color }, g); el('circle', { cx: -12, cy: -144, r: 5, fill: color }, g);
    el('circle', { cx: -18, cy: -98, r: 7, fill: '#fff' }, g); el('circle', { cx: -20, cy: -98, r: 3.5, fill: C.ink }, g);
    el('circle', { cx: -22, cy: -84, r: 4.5, fill: C.pink, opacity: .85 }, g);
    p.mouth = el('path', { d: 'M-28 -82 Q-22 -76 -15 -81', stroke: C.ink, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, g);
    // 옷 (기본은 숨김)
    const part = (shapes) => { const q = paper(g, shapes); q.setAttribute('opacity', 0); return q; };
    p.tee = part([['path', { d: 'M-14 -76 L14 -76 L24 -66 L16 -60 L14 -46 L-14 -46 L-16 -60 L-24 -66 Z', fill: C.cream }], ['rect', { x: -14, y: -62, width: 28, height: 5, fill: C.persimmon }]]);
    p.vest = part([['path', { d: 'M-15 -76 L-3 -76 L0 -60 L3 -76 L15 -76 L17 -44 L-17 -44 Z', fill: C.gold }], ['circle', { cx: -6, cy: -54, r: 2.5, fill: C.bark }], ['circle', { cx: 6, cy: -54, r: 2.5, fill: C.bark }]]);
    p.coat = part([['path', { d: 'M-18 -78 L18 -78 L44 -30 L44 -16 L-20 -16 Z', fill: C.pine }], ['path', { d: 'M-18 -78 L-4 -78 L-10 -62 Z', fill: '#2f5a3f' }],
      ...[-64, -48, -32].map(y => ['circle', { cx: -8, cy: y, r: 3, fill: C.gold }])]);
    p.scarf = part([['rect', { x: -18, y: -80, width: 34, height: 10, rx: 5, fill: C.persimmon }], ['rect', { x: 4, y: -76, width: 10, height: 26, rx: 3, fill: C.persimmon }], ['rect', { x: 4, y: -58, width: 10, height: 4, fill: C.cream }]]);
    p.hat = part([['path', { d: 'M-30 -104 Q-28 -134 -6 -134 Q16 -132 14 -104 Z', fill: C.cream }], ['rect', { x: -32, y: -108, width: 48, height: 9, rx: 4, fill: C.bean }], ['circle', { cx: -6, cy: -138, r: 8, fill: C.bean }]]);
    p.ring = part([['ellipse', { cx: 6, cy: -40, rx: 34, ry: 12, fill: C.persimmon }], ['rect', { x: -10, y: -52, width: 8, height: 24, fill: C.cream }], ['rect', { x: 22, y: -52, width: 8, height: 24, fill: C.cream }]]);
    p.sweat = el('g', { opacity: 0 }, g);
    [[-34, -106], [10, -118]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q-5 8 0 12 q5 -4 0 -12 Z`, fill: '#9FC6DE' }, p.sweat));
    // 팔: 내림 / 짐 들기
    p.armDown = el('path', { d: 'M-4 -66 L-24 -52', stroke: color, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    p.armUp = el('path', { d: 'M-4 -70 L-20 -112 M6 -70 L6 -114', stroke: color, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none', opacity: 0 }, g);
    p.load = paper(g, [['ellipse', { cx: -6, cy: -124, rx: 20, ry: 11, fill: C.gold }], ['ellipse', { cx: -12, cy: -127, rx: 6, ry: 3, fill: '#EBC878' }]]);
    p.load.setAttribute('opacity', 0);
    return p;
  }
  function carry(p, on) { p.load.setAttribute('opacity', on ? 1 : 0); p.armUp.setAttribute('opacity', on ? 1 : 0); p.armDown.setAttribute('opacity', on ? 0 : 1); p._carry = on; antLook(p); }
  function wear(p, list = []) { ['tee', 'vest', 'coat', 'scarf', 'hat', 'ring'].forEach(k => p[k].setAttribute('opacity', list.includes(k) ? 1 : 0)); p._wear = list; antLook(p); }

  /* 베짱이 (키 ~220, 더듬이 포함) */
  /* 그림 베짱이: 자세 = 모드(play·arms·carry) + 젖음 + 겨울옷 으로 고른다 (hopLook). arms(빈손)는 떨기 그림 */
  const HOP_HAT = [-66, -224, 62, 62.3, -8]; // 연주 그림 머리 위 털모자 상자 [x, y, w, h, 기울기]
  function drawHopperArt(T, g) {
    const { el } = T;
    const p = { looks: {}, mode: 'play', wet: false, warm: false };
    ['hopper_play', 'hopper_wet', 'hopper_shiver', 'hopper_winter', 'hopper_carry'].forEach(k => { const s = sprite(T, g, k); if (s) { s.style.display = 'none'; p.looks[k] = s; } });
    const [hx, hy, hw, hh, hr] = HOP_HAT;
    const hg = el('g', { transform: `rotate(${hr} ${hx + hw / 2} ${hy + hh})` }, g);
    p.artHat = pic(T, hg, 'hopper_hat', hx, hy, hw, hh); if (p.artHat) p.artHat.style.display = 'none';
    const none = () => el('g', { opacity: 0 }, g);
    p.violin = none(); p.bow = el('g', {}, p.violin); p.arms = none(); p.armUp = none(); p.load = none(); p.drops = none(); p.scarf = none(); p.hat = none();
    p.ant = el('path', { d: '', opacity: 0 }, g); p.mouth = el('path', { d: '', opacity: 0 }, g);
    hopLook(p);
    return p;
  }
  function hopLook(p) {
    if (!p.looks) return;
    const m = p.mode, k = m === 'carry' ? 'carry' : p.warm ? (m === 'play' ? 'play' : 'winter') : p.wet ? 'wet' : m === 'play' ? 'play' : 'shiver';
    const show = p.looks['hopper_' + k] ? 'hopper_' + k : Object.keys(p.looks)[0];
    Object.entries(p.looks).forEach(([kk, s]) => { s.style.display = kk === show ? '' : 'none'; });
    if (p.artHat) p.artHat.style.display = p.warm && show === 'hopper_play' ? '' : 'none';
  }
  const ANT_UP = 'M-8 -156 Q-6 -204 34 -216 M-20 -154 Q-36 -202 -6 -224', ANT_DROOP = 'M-8 -156 Q10 -170 30 -150 M-20 -154 Q-40 -160 -50 -140';
  function hopWet(p, on) { p.drops.setAttribute('opacity', on ? 1 : 0); p.ant.setAttribute('d', on ? ANT_DROOP : ANT_UP); p.wet = on; hopLook(p); }
  function hopWarm(p, on) { p.scarf.setAttribute('opacity', on ? 1 : 0); p.hat.setAttribute('opacity', on ? 1 : 0); p.warm = on; hopLook(p); }
  function drawHopper(T, g) {
    if (artUrl('hopper_play')) return drawHopperArt(T, g);
    const { el, paper } = T;
    const p = {};
    paper(g, [
      ['path', { d: 'M12 -44 Q44 -118 62 -104 Q56 -66 24 -32 Z', fill: C.hopDk }],
      ['path', { d: 'M58 -102 L66 -4', stroke: C.hopDk, 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none' }],
      ['path', { d: 'M-6 -40 L-12 -4 M6 -40 L8 -4', stroke: C.hopDk, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }],
      ['path', { d: 'M18 -120 Q44 -80 30 -32 Q16 -70 10 -114 Z', fill: C.pine }],
      ['ellipse', { cx: 4, cy: -78, rx: 22, ry: 42, fill: C.hop }],
      ['ellipse', { cx: -8, cy: -74, rx: 11, ry: 30, fill: C.hopBelly }],
      ['ellipse', { cx: -10, cy: -136, rx: 25, ry: 22, fill: C.hop }],
    ]);
    p.ant = el('path', { d: 'M-8 -156 Q-6 -204 34 -216 M-20 -154 Q-36 -202 -6 -224', stroke: C.hop, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
    el('circle', { cx: -22, cy: -142, r: 10, fill: '#fff' }, g); el('circle', { cx: -25, cy: -142, r: 5, fill: C.ink }, g);
    el('circle', { cx: -28, cy: -124, r: 5, fill: C.pink, opacity: .85 }, g);
    p.mouth = el('path', { d: 'M-34 -122 Q-26 -114 -17 -121', stroke: C.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g);
    p.scarf = paper(g, [['rect', { x: -26, y: -118, width: 44, height: 12, rx: 6, fill: C.persimmon }], ['rect', { x: 6, y: -112, width: 12, height: 32, rx: 4, fill: C.persimmon }]]);
    p.hat = paper(g, [['path', { d: 'M-34 -150 Q-30 -178 -8 -178 Q14 -176 14 -150 Z', fill: C.cream }], ['rect', { x: -36, y: -154, width: 52, height: 10, rx: 5, fill: C.bean }], ['circle', { cx: -10, cy: -182, r: 9, fill: C.bean }]]);
    p.scarf.setAttribute('opacity', 0); p.hat.setAttribute('opacity', 0);
    // 바이올린 + 활
    p.violin = el('g', {}, g);
    paper(p.violin, [['ellipse', { cx: -36, cy: -92, rx: 15, ry: 22, fill: C.bark, transform: 'rotate(-35 -36 -92)' }], ['ellipse', { cx: -36, cy: -92, rx: 6, ry: 9, fill: C.gold, transform: 'rotate(-35 -36 -92)' }]]);
    el('path', { d: 'M-30 -104 L-12 -128', stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, p.violin);
    el('path', { d: 'M-4 -96 L-30 -100', stroke: C.hop, 'stroke-width': 6, 'stroke-linecap': 'round' }, p.violin);
    p.bow = el('g', {}, p.violin); origin(p.bow, -40, -90);
    el('path', { d: 'M-70 -110 L-6 -72', stroke: C.cream, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, p.bow);
    el('path', { d: 'M4 -90 L-40 -88', stroke: C.hop, 'stroke-width': 6, 'stroke-linecap': 'round' }, p.bow);
    // 팔 (바이올린 없을 때)
    p.arms = el('path', { d: 'M-4 -98 L-28 -80 M4 -94 L-14 -70', stroke: C.hop, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none', opacity: 0 }, g);
    p.armUp = el('path', { d: 'M-4 -98 L-18 -150 M8 -96 L10 -150', stroke: C.hop, 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none', opacity: 0 }, g);
    p.load = paper(g, [['ellipse', { cx: -4, cy: -168, rx: 30, ry: 14, fill: C.gold }], ['ellipse', { cx: -12, cy: -172, rx: 9, ry: 4, fill: '#EBC878' }]]);
    p.load.setAttribute('opacity', 0);
    p.drops = el('g', { opacity: 0 }, g);
    [[-44, -150], [18, -170], [30, -90], [-30, -60], [44, -60]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q-6 10 0 15 q6 -5 0 -15 Z`, fill: '#9FC6DE' }, p.drops));
    return p;
  }
  function hopperMode(p, mode) { // 'play' | 'arms' | 'carry'
    p.violin.setAttribute('opacity', mode === 'play' ? 1 : 0);
    p.arms.setAttribute('opacity', mode === 'arms' ? 1 : 0);
    p.armUp.setAttribute('opacity', mode === 'carry' ? 1 : 0);
    p.load.setAttribute('opacity', mode === 'carry' ? 1 : 0);
    p.mode = mode; hopLook(p);
  }
  function bowing(p) { return p.bow.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(0deg)' }], { duration: 700, iterations: Infinity, easing: 'ease-in-out' }); }

  /* 초대 친구 4 */
  const FRIENDS = [
    { key: 'ladybug', name: '무당벌레', s: 1.4, draw(T, g) {
      T.paper(g, [['path', { d: 'M-24 -8 L-28 0 M0 -8 L0 0 M24 -8 L28 0', stroke: C.ink, 'stroke-width': 4, fill: 'none' }],
        ['path', { d: 'M-30 -8 Q-30 -62 8 -62 Q42 -60 42 -8 Z', fill: C.bean }], ['path', { d: 'M8 -62 L8 -8', stroke: C.ink, 'stroke-width': 3 }],
        ...[[-10, -40], [24, -44], [-14, -20], [28, -20], [8, -30]].map(([x, y]) => ['circle', { cx: x, cy: y, r: 6, fill: C.ink }]),
        ['circle', { cx: -34, cy: -22, r: 16, fill: C.ink }]]);
      T.el('circle', { cx: -40, cy: -26, r: 5, fill: '#fff' }, g); T.el('circle', { cx: -41, cy: -26, r: 2.4, fill: C.ink }, g);
    } },
    { key: 'snail', name: '달팽이', s: 1.1, draw(T, g) {
      T.paper(g, [['path', { d: 'M-58 0 Q-66 -36 -50 -44 Q-40 -46 -34 -30 L40 -6 L46 0 Z', fill: '#D9B98A' }],
        ['circle', { cx: 8, cy: -46, r: 38, fill: C.gold }], ['circle', { cx: 12, cy: -46, r: 25, fill: '#C28B3A' }], ['circle', { cx: 16, cy: -46, r: 12, fill: C.gold }]]);
      T.el('path', { d: 'M-52 -42 L-60 -70 M-44 -44 L-44 -72', stroke: '#D9B98A', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      T.el('circle', { cx: -60, cy: -72, r: 5, fill: C.ink }, g); T.el('circle', { cx: -44, cy: -74, r: 5, fill: C.ink }, g);
      T.el('path', { d: 'M-60 -20 Q-54 -15 -48 -20', stroke: C.ink, 'stroke-width': 2.5, fill: 'none' }, g);
    } },
    { key: 'pillbug', name: '쥐며느리', s: 1.4, draw(T, g) {
      T.paper(g, [['path', { d: 'M-40 -4 L-44 0 M-20 -4 L-22 0 M0 -4 L0 0 M20 -4 L22 0', stroke: C.ink, 'stroke-width': 3, fill: 'none' }],
        ['path', { d: 'M-44 -6 Q-44 -50 0 -50 Q40 -50 42 -6 Z', fill: '#8E8A86' }],
        ...[-24, -8, 8, 24].map(x => ['rect', { x, y: -48, width: 5, height: 42, fill: '#6E6A66' }]),
        ['circle', { cx: -42, cy: -18, r: 13, fill: '#6E6A66' }]]);
      T.el('path', { d: 'M-50 -26 Q-62 -44 -70 -40', stroke: '#6E6A66', 'stroke-width': 3, fill: 'none' }, g);
      T.el('circle', { cx: -46, cy: -22, r: 4, fill: '#fff' }, g); T.el('circle', { cx: -47, cy: -22, r: 2, fill: C.ink }, g);
    } },
    { key: 'firefly', name: '반딧불이', s: 1.3, draw(T, g) {
      const glow = T.el('circle', { cx: 28, cy: -30, r: 26, fill: C.amber, opacity: .45 }, g);
      glow.animate([{ opacity: .25 }, { opacity: .7 }], { duration: 800, iterations: Infinity, direction: 'alternate' });
      T.paper(g, [['path', { d: 'M-10 -30 L-14 0 M6 -30 L8 0', stroke: C.ink, 'stroke-width': 3, fill: 'none' }],
        ['ellipse', { cx: 0, cy: -34, rx: 26, ry: 14, fill: '#4a3a30' }], ['circle', { cx: 28, cy: -30, r: 12, fill: '#FFE08A' }],
        ['ellipse', { cx: 4, cy: -54, rx: 18, ry: 10, fill: C.cream, opacity: .9 }], ['circle', { cx: -26, cy: -38, r: 13, fill: C.ink }]]);
      T.el('path', { d: 'M-30 -48 Q-36 -64 -46 -62', stroke: C.ink, 'stroke-width': 3, fill: 'none' }, g);
      T.el('circle', { cx: -32, cy: -40, r: 4.5, fill: '#fff' }, g); T.el('circle', { cx: -33, cy: -40, r: 2.2, fill: C.ink }, g);
    } },
  ];

  /* 손님 그림: 발끝 가운데 (0,0). 반딧불이 불빛은 그림 속 꼬리 자리에서 깜빡인다 */
  const FIREFLY_TAIL = [8.5, -11.5];
  function friendArt(T, g, key) {
    if (!artUrl(key)) return false;
    if (key === 'firefly') {
      const glow = T.el('circle', { cx: FIREFLY_TAIL[0], cy: FIREFLY_TAIL[1], r: 22, fill: C.amber, opacity: .45 }, g);
      glow.animate([{ opacity: .2 }, { opacity: .75 }], { duration: 800, iterations: Infinity, direction: 'alternate' });
    }
    sprite(T, g, key);
    return true;
  }
  FRIENDS.forEach(f => { const d = f.draw; f.draw = (T, g) => { if (!friendArt(T, g, f.key)) d(T, g); }; });

  function mk(T, parent, x, y, draw, scale = 1) {
    let parts;
    const a = T.actor(parent, x, y, g => { parts = draw(T, g); }, { scale });
    a.p = parts || {};
    return a;
  }
  const ant = (T, parent, x, y, s = 1, opts) => mk(T, parent, x, y, (T2, g) => drawAnt(T2, g, opts), s);

  /* ================= 배경 ================= */
  function tree(T, x, y, s, season) {
    const g = T.el('g', { transform: `translate(${x},${y}) scale(${s})` }, T.bg);
    T.paper(g, [['rect', { x: -12, y: -150, width: 24, height: 150, fill: C.bark }]]);
    if (season === 'winter') {
      T.el('path', { d: 'M0 -120 L-44 -180 M0 -100 L40 -170 M-20 -150 L-30 -196 M20 -140 L26 -200', stroke: C.bark, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }, g);
      T.paper(g, [['ellipse', { cx: -40, cy: -182, rx: 14, ry: 5, fill: C.snow }], ['ellipse', { cx: 38, cy: -172, rx: 14, ry: 5, fill: C.snow }]]);
      return g;
    }
    const col = { summer: [C.pine, C.leaf], autumn: [C.persimmon, C.gold], spring: ['#8DBA6A', '#F2C4C4'] }[season];
    T.paper(g, [['circle', { cx: -34, cy: -170, r: 56, fill: col[0] }], ['circle', { cx: 34, cy: -176, r: 54, fill: col[0] }], ['circle', { cx: 0, cy: -214, r: 58, fill: col[0] }]]);
    const dots = season === 'spring' ? 9 : season === 'autumn' ? 7 : 0;
    for (let i = 0; i < dots; i++) T.el('circle', { cx: -60 + (i * 37) % 120, cy: -230 + (i * 23) % 100, r: 9, fill: col[1] }, g);
    return g;
  }
  function mound(T, x, y, season, parent = T.bg) {
    T.paper(parent, [['path', { d: `M${x - 130} ${y + 6} Q${x - 70} ${y - 96} ${x} ${y - 100} Q${x + 70} ${y - 96} ${x + 130} ${y + 6} Z`, fill: C.soil }],
      ['path', { d: `M${x - 26} ${y + 4} Q${x - 26} ${y - 44} ${x} ${y - 44} Q${x + 26} ${y - 44} ${x + 26} ${y + 4} Z`, fill: C.ink }]]);
    if (season === 'winter') T.paper(parent, [['path', { d: `M${x - 88} ${y - 58} Q${x} ${y - 124} ${x + 88} ${y - 58} Q${x} ${y - 84} ${x - 88} ${y - 58} Z`, fill: C.snow }]]);
  }
  /* 들판 4계절: 같은 구도 (나무 둘 · 언덕 · 개미집) */
  const FIELD_DOOR = { summer: [915, 342], autumn: [912, 388], spring: [886, 358] }; // 그림 속 개미집 문 (무대 좌표)
  function fieldBG(T, season, { sky } = {}) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, season)) {
      if (sky) { // 소나기: 그림 속 해를 먹구름으로 가리고 회색 한 겹을 곱한다
        paper(b, [['ellipse', { cx: 70, cy: 46, rx: 120, ry: 52, fill: '#8C98A4' }]]);
        const t = el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: '#8A9AAD', opacity: .55 }, b);
        t.style.mixBlendMode = 'multiply'; t.style.pointerEvents = 'none';
      }
      return { skyR: null, sun: null, door: FIELD_DOOR[season], art: true };
    }
    const skyR = el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: sky || SKY[season] }, b);
    let sun = null;
    if (season !== 'winter') sun = el('circle', { cx: 120, cy: 90, r: 44, fill: '#F6D98A' }, b);
    if (season === 'summer' || season === 'spring') [[380, 90, 1], [700, 70, 1.3]].forEach(([x, y, s]) =>
      paper(b, [['ellipse', { cx: x, cy: y, rx: 70 * s, ry: 26 * s, fill: '#fff' }], ['circle', { cx: x - 20 * s, cy: y - 18 * s, r: 30 * s, fill: '#fff' }], ['circle', { cx: x + 22 * s, cy: y - 14 * s, r: 24 * s, fill: '#fff' }]]));
    const hill = { summer: '#9DB86E', autumn: '#D9A05A', winter: '#E6EAF2', spring: '#B7D48E' }[season];
    paper(b, [['path', { d: 'M-300 360 Q100 250 460 330 Q760 260 1300 340 V700 H-300 Z', fill: hill }]]);
    tree(T, 170, 440, 1, season); tree(T, 560, 400, .7, season);
    paper(b, [['rect', { x: -300, y: 430, width: 1600, height: 400, fill: GROUND[season] }]]);
    mound(T, 840, 470, season);
    if (season === 'summer') [80, 300, 470, 660].forEach(x => paper(b, [['path', { d: `M${x} 500 L${x + 6} 468 L${x + 12} 500 Z M${x + 14} 500 L${x + 24} 474 L${x + 26} 500 Z`, fill: C.pine }]]));
    if (season === 'spring') [90, 280, 420, 640, 960].forEach((x, i) => { paper(b, [['path', { d: `M${x} 500 Q${x - 10} 484 ${x - 14} 476 M${x} 500 Q${x + 10} 484 ${x + 14} 476`, stroke: C.pine, 'stroke-width': 5, fill: 'none' }]]); if (i % 2 === 0) el('circle', { cx: x, cy: 470, r: 8, fill: C.pink }, b); });
    if (season === 'autumn') [70, 260, 420, 700].forEach((x, i) => el('ellipse', { cx: x, cy: 505 + (i % 2) * 20, rx: 12, ry: 6, fill: i % 2 ? C.persimmon : C.bean, transform: `rotate(${i * 30} ${x} 505)` }, b));
    return { skyR, sun, door: [840, 466] };
  }
  /* 개미 눈높이: 풀잎이 나무만 하다. 오른쪽에 창고 입구와 단면(칸 10개) */
  function antEyeBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'ant_eye')) return storeBox(T, -10, -110, [712, 432]); // 그림: 창고 단면은 개미집 왼쪽 위(문 위)에
    el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: SKY.summer }, b);
    el('circle', { cx: 520, cy: 70, r: 50, fill: '#F6D98A' }, b);
    [[40, 420, C.leaf], [120, 540, C.pine], [330, 470, C.leaf], [440, 380, C.pine], [590, 520, C.leaf]].forEach(([x, h, c]) =>
      paper(b, [['path', { d: `M${x} 500 Q${x + 30} ${500 - h / 2} ${x + 80} ${500 - h} Q${x + 50} ${500 - h / 2} ${x + 60} 500 Z`, fill: c }]]));
    paper(b, [['rect', { x: -300, y: 490, width: 1600, height: 300, fill: '#8A9A5A' }]]);
    paper(b, [['ellipse', { cx: 180, cy: 500, rx: 60, ry: 26, fill: '#A59C8E' }]]);
    // 개미집 (크게) — 세로 화면에서도 창고 단면이 보이도록 가운데 가까이
    paper(b, [['path', { d: 'M470 500 Q510 220 700 214 Q900 214 1060 500 Z', fill: C.soil }],
      ['path', { d: 'M740 500 Q740 420 790 420 Q840 420 840 500 Z', fill: C.ink }]]);
    return storeBox(T, 0, 0, [790, 496]);
  }
  /* 창고 단면 (칸 10개). ox·oy만큼 옮겨 그린다 */
  function storeBox(T, ox, oy, door) {
    const { el, paper } = T, b = T.bg;
    const box = el('g', {}, b);
    paper(box, [['rect', { x: 530 + ox, y: 256 + oy, width: 180, height: 214, rx: 16, fill: C.soilDk }]]);
    el('text', { x: 620 + ox, y: 244 + oy, 'text-anchor': 'middle', 'font-size': 26, fill: C.cream, stroke: C.bark, 'stroke-width': 6, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '창고' }, box);
    const slots = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) {
      const x = 580 + c * 80 + ox, y = 440 - r * 40 + oy;
      el('rect', { x: x - 34, y: y - 16, width: 68, height: 32, rx: 8, fill: C.room, opacity: .55 }, box);
      const grain = T.paper(box, [['ellipse', { cx: x, cy: y, rx: 26, ry: 12, fill: C.gold }], ['ellipse', { cx: x - 8, cy: y - 3, rx: 8, ry: 3, fill: '#EBC878' }]]);
      grain.setAttribute('opacity', 0); origin(grain, x, y);
      slots.push(grain);
    }
    return { slots, door, pop: [620 + ox, 190 + oy] };
  }
  /* 풀잎 무대 로우앵글: 커다란 잎 위에 베짱이, 양옆에 꽃 */
  function leafStageBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'leafstage')) return true;
    el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: SKY.summer }, b);
    el('circle', { cx: 860, cy: 80, r: 60, fill: '#F6D98A' }, b);
    [[-40, 30], [60, 80], [940, 60], [1030, 20]].forEach(([x, top]) =>
      paper(b, [['path', { d: `M${x} 600 Q${x + (x < 500 ? 60 : -60)} 300 ${x + (x < 500 ? 130 : -130)} ${top} L${x + (x < 500 ? 150 : -150)} ${top + 30} Q${x + (x < 500 ? 90 : -90)} 320 ${x + 50} 600 Z`, fill: x % 2 ? C.pine : C.leaf }]]));
    paper(b, [['path', { d: 'M150 470 Q500 380 860 470 Q500 560 150 470 Z', fill: C.leaf }], ['path', { d: 'M180 470 Q500 460 830 470', stroke: C.pine, 'stroke-width': 5, fill: 'none' }],
      ['rect', { x: 490, y: 480, width: 18, height: 120, fill: C.pine }]]);
  }
  function flower(T, parent, x, y, col) {
    const g = T.el('g', {}, parent);
    T.paper(g, [['rect', { x: x - 5, y, width: 10, height: 560 - y, fill: C.pine }], ...[0, 72, 144, 216, 288].map(a => ['ellipse', { cx: x + Math.cos(a * Math.PI / 180) * 30, cy: y + Math.sin(a * Math.PI / 180) * 30, rx: 22, ry: 22, fill: col }]),
      ['circle', { cx: x, cy: y, r: 20, fill: C.gold }]]);
    return g;
  }
  /* 겨울 들판 하이앵글: 땅이 화면을 채우고, 지평선은 위쪽에 */
  function winterHighBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'winter_high')) return { hole: [655, 150], far: true }; // 그림: 구멍이 멀리(위쪽) → 걸어가며 작아진다
    el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: SKY.winter }, b);
    paper(b, [['rect', { x: -300, y: 90, width: 1600, height: 700, fill: C.snow }]]);
    [80, 200, 330, 620, 780, 930].forEach((x, i) => { const g = T.el('g', { transform: `translate(${x},${96}) scale(.32)` }, b); T.paper(g, [['rect', { x: -10, y: -150, width: 20, height: 150, fill: C.bark }]]); T.el('path', { d: 'M0 -110 L-40 -170 M0 -90 L40 -160', stroke: C.bark, 'stroke-width': 8, fill: 'none' }, g); });
    [[120, 260], [260, 380], [900, 250], [860, 480]].forEach(([x, y]) => paper(b, [['path', { d: `M${x} ${y} L${x - 6} ${y - 28} M${x} ${y} L${x + 8} ${y - 24} M${x} ${y} L${x} ${y - 34}`, stroke: '#A08E74', 'stroke-width': 4, fill: 'none' }]]));
    // 개미집 구멍 (위에서 본 모양)
    paper(b, [['ellipse', { cx: 640, cy: 330, rx: 110, ry: 46, fill: '#D9DDE6' }], ['ellipse', { cx: 640, cy: 330, rx: 56, ry: 22, fill: C.ink }]]);
    for (let i = 0; i < 8; i++) el('ellipse', { cx: 560 + i * 10, cy: 420 - i * 11, rx: 6, ry: 3, fill: '#C9D0DC' }, b);
    return { hole: [640, 330] };
  }
  /* 창고 문 로우앵글: 개미 시점이라 베짱이가 커 보인다 */
  /* 그림: 흙둑 아치 문간(무대 x 140~300, 아래 445). 세로 화면에선 그림을 오른쪽으로 200 옮겨 문간이 보이게 한다.
     문짝은 문간 모양 그대로 코드 종이(왼쪽 경첩), 불빛은 문간 위에 screen으로 */
  function doorBG(T) {
    const { el, paper } = T, b = T.bg;
    const DX = narrow() ? 200 : 0;
    if (bgImage(T, 'door', { dx: DX })) {
      const arch = `M${140 + DX} 446 V368 Q${140 + DX} 298 ${220 + DX} 298 Q${300 + DX} 298 ${300 + DX} 368 V446 Z`;
      const glow = el('path', { d: arch, fill: '#FFD58A', opacity: .15 }, b); glow.style.mixBlendMode = 'screen';
      const door = el('g', {}, T.world); origin(door, 140 + DX, 0);
      paper(door, [['path', { d: arch, fill: '#8E6440' }],
        ...[180, 220, 260].map(x => ['rect', { x: x + DX - 3, y: x === 220 ? 300 : 308, width: 6, height: x === 220 ? 145 : 137, fill: C.bark }]),
        ['circle', { cx: 284 + DX, cy: 380, r: 8, fill: C.gold }]]);
      return { door, glow, art: true, hopX: narrow() ? 640 : 520, hostX: 230 + DX, babyX: 175 + DX, y: 452, hopY: 474, knock: [300 + DX, 280], spark: [220 + DX, 370] };
    }
    el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: SKY.winter }, b);
    paper(b, [['path', { d: 'M-300 600 L-300 40 Q300 -20 660 200 Q720 300 720 600 Z', fill: C.soil }],
      ['path', { d: 'M-300 60 Q300 0 640 190 Q520 150 -300 120 Z', fill: C.snow }]]);
    paper(b, [['rect', { x: -300, y: 470, width: 1600, height: 300, fill: C.snow }]]);
    // 문틀 + 안쪽 불빛
    paper(b, [['path', { d: 'M300 480 V300 Q300 220 400 220 Q500 220 500 300 V480 Z', fill: C.bark }]]);
    const glow = el('path', { d: 'M316 480 V304 Q316 236 400 236 Q484 236 484 304 V480 Z', fill: C.amber }, b);
    const door = el('g', {}, T.world); origin(door, 316, 0);
    paper(door, [['path', { d: 'M316 480 V304 Q316 236 400 236 Q484 236 484 304 V480 Z', fill: '#8E6440' }],
      ['rect', { x: 356, y: 250, width: 6, height: 228, fill: C.bark }], ['rect', { x: 416, y: 240, width: 6, height: 238, fill: C.bark }],
      ['circle', { cx: 464, cy: 370, r: 9, fill: C.gold }]]);
    return { door, glow, hopX: narrow() ? 626 : 650, hostX: 400, babyX: narrow() ? 352 : 335, y: 486, hopY: 500, knock: [510, 300], spark: [400, 360] };
  }
  /* 창고 단면: 위는 눈 덮인 땅, 아래로 방 셋 (곡식 방 · 큰 방 · 도토리 방) */
  /* 그림: 120 아래로 옮겨 깐다 → 위는 하늘·눈(눈 위 y 140), 굴은 x 475로 내려가 큰 방 바닥 y 520. 곡식·도토리 더미는 그림 속에 있다 */
  function cellarBG(T, { full = true } = {}) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'cellar', { dy: 120 })) {
      const light = el('ellipse', { cx: 495, cy: 410, rx: 200, ry: 115, fill: '#6B4E1E', opacity: 0 }, b);
      light.style.mixBlendMode = 'screen';
      // 그림: 큰 방이 좁아 두 줄 — 뒤(개미 가족·베짱이 y 512), 앞(손님 넷 y 548, 큰 방 앞 흙바닥)
      return { art: true, light, door: [475, 140], snowY: 140, shaftX: 475, shaftY: 400, antY: 512, hopY: 514, seatY: [548, 550, 550, 548], cam: [495, 440] };
    }
    el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: SKY.winter }, b);
    paper(b, [['rect', { x: -300, y: 196, width: 1600, height: 700, fill: C.soil }], ['rect', { x: -300, y: 186, width: 1600, height: 22, rx: 8, fill: C.snow }]]);
    // 굴
    paper(b, [['path', { d: 'M500 196 Q470 260 500 330 M500 330 Q360 300 220 300 M500 330 Q650 300 800 300', stroke: C.soilDk, 'stroke-width': 44, fill: 'none', 'stroke-linecap': 'round' }]]);
    el('ellipse', { cx: 500, cy: 198, rx: 32, ry: 10, fill: C.ink }, b);
    // 방
    const rooms = { grain: [200, 300, 130, 62], hall: [500, 430, 230, 96], acorn: [820, 300, 130, 62] };
    Object.values(rooms).forEach(([x, y, rx, ry]) => paper(b, [['ellipse', { cx: x, cy: y, rx: rx + 12, ry: ry + 10, fill: C.soilDk }], ['ellipse', { cx: x, cy: y, rx, ry, fill: C.room }]]));
    const light = el('ellipse', { cx: 500, cy: 430, rx: 230, ry: 96, fill: C.amber, opacity: .35 }, b);
    if (full) {
      // 곡식 방: 가득
      for (let r = 0; r < 3; r++) for (let k = 0; k < 7 - r * 2; k++) paper(b, [['ellipse', { cx: 200 + (k - (6 - r * 2) / 2) * 30, cy: 344 - r * 22, rx: 16, ry: 9, fill: C.gold }]]);
      // 도토리 방: 가득
      for (let r = 0; r < 3; r++) for (let k = 0; k < 6 - r * 2; k++) acornShape(T, b, 820 + (k - (5 - r * 2) / 2) * 34, 346 - r * 28, .9);
    }
    return { rooms, light, door: [500, 196], snowY: 192, shaftX: 500, shaftY: 320, antY: 472, hopY: 506, seatY: [522, 522, 524, 510], cam: [500, 430] };
  }
  function acornShape(T, parent, x, y, s = 1) {
    const g = T.el('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
    T.paper(g, [['ellipse', { cx: 0, cy: 0, rx: 13, ry: 16, fill: '#B27A3A' }], ['path', { d: 'M-15 -6 Q0 -22 15 -6 Z', fill: C.bark }], ['rect', { x: -2, y: -20, width: 4, height: 7, fill: C.bark }]]);
    return g;
  }

  /* ================= 효과 ================= */
  /* 비·눈·낙엽: 계속 내린다. shelter=[x0,x1,y] 이면 그 폭에선 잎 우산 위에서 멈춘다 */
  function precip(T, kind, n = 36, shelter = null) {
    const g = T.el('g', {}, T.fx), anims = [];
    for (let i = 0; i < n; i++) {
      const x = rnd(-40, 1040), dur = kind === 'rain' ? rnd(600, 900) : kind === 'snow' ? rnd(4000, 7000) : rnd(3500, 5500);
      let yEnd = 580;
      if (shelter && x > shelter[0] && x < shelter[1]) yEnd = shelter[2];
      let d;
      if (kind === 'rain') d = T.el('path', { d: `M${x} -40 l-6 26`, stroke: C.rain, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
      else if (kind === 'snow') d = T.el('circle', { cx: x, cy: -20, r: rnd(4, 8), fill: '#fff', stroke: '#C9D0DC', 'stroke-width': 1 }, g);
      else d = T.el('ellipse', { cx: x, cy: -20, rx: 11, ry: 6, fill: [C.persimmon, C.gold, C.bean][i % 3] }, g);
      const dx = kind === 'rain' ? -30 : rnd(-60, 60);
      anims.push(d.animate(kind === 'rain' ? [{ transform: 'translate(0,0)' }, { transform: `translate(${dx}px,${yEnd + 40}px)` }]
        : [{ transform: 'translate(0,0) rotate(0deg)' }, { transform: `translate(${dx / 2}px,${(yEnd + 20) / 2}px) rotate(180deg)` }, { transform: `translate(${dx}px,${yEnd + 20}px) rotate(360deg)` }],
      { duration: dur, delay: -rnd(0, dur), iterations: Infinity, easing: 'linear' }));
      if (kind === 'leaf') d.style.transformBox = 'fill-box', d.style.transformOrigin = '50% 50%';
    }
    return { stop() { anims.forEach(a => a.cancel()); g.remove(); } };
  }
  function notes(T, x, y) {
    const n = T.el('text', { x, y, 'text-anchor': 'middle', 'font-size': 42, fill: C.indigo, stroke: '#fff', 'stroke-width': 5, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: Math.random() < .5 ? '♪' : '♫' }, T.fx);
    n.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${rnd(-40, 40)}px,-90px)`, opacity: 0 }], { duration: 1100, easing: 'ease-out' }).finished.then(() => n.remove());
  }
  function sparkles(T, x, y, r = 90, n = 6) {
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      const s = T.el('path', { d: 'M0 -12 L3 -3 12 0 3 3 0 12 -3 3 -12 0 -3 -3 Z', fill: '#FFD54F', transform: `translate(${x},${y})` }, T.fx);
      s.animate([{ transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 1 }, { transform: `translate(${x + Math.cos(a) * r}px,${y + Math.sin(a) * r}px) scale(1)`, opacity: 0 }], { duration: 800, easing: 'ease-out' }).finished.then(() => s.remove());
    }
  }

  /* ================= 화면 고정 UI (카메라 영향 없음) ================= */
  const stageUI = () => document.getElementById('stage');
  /* 세로 화면에선 엔진이 무대 양옆을 자른다(slice) → 보이는 가로 범위를 구해 화면 고정 UI를 그 안에 놓는다 */
  function visX() {
    const st = stageUI(), r = st.getBoundingClientRect();
    if (!(st.getAttribute('preserveAspectRatio') || '').includes('slice') || !r.width) return [0, 1000];
    const k = Math.max(r.width / 1000, r.height / 560), w = r.width / k;
    return w >= 1000 ? [0, 1000] : [500 - w / 2, 500 + w / 2];
  }
  const narrow = () => { const [a, b] = visX(); return b - a < 900; };
  /* 세로(좁은) 화면용 가로 줄: n개를 보이는 폭 안에 고르게. 크기 배율도 함께 */
  function rowFit(n, unit) {
    const [a, b] = visX(), m = 14, w = b - a - m * 2, s = Math.min(1, w / (n * unit));
    return { s, xs: Array.from({ length: n }, (_, i) => a + m + w * (i + .5) / n) };
  }
  const shuffle = arr => arr.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
  function badge(T, x, y, drawIcon, r = 78, sc = 1) {
    const g = T.el('g', { transform: `translate(${x},${y}) scale(${sc})` }, stageUI());
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    drawIcon(T, g);
    return g;
  }
  const CLOTH = {
    tee: (T, g) => T.paper(g, [['path', { d: 'M-30 -40 L30 -40 L56 -14 L38 0 L32 -8 L32 44 L-32 44 L-32 -8 L-38 0 L-56 -14 Z', fill: '#fff' }], ['rect', { x: -32, y: 0, width: 64, height: 10, fill: C.persimmon }]]),
    vest: (T, g) => T.paper(g, [['path', { d: 'M-34 -44 L-10 -44 L0 -10 L10 -44 L34 -44 L38 46 L-38 46 Z', fill: C.gold }], ...[0, 18, 34].map(y => ['circle', { cx: -10, cy: y, r: 4, fill: C.bark }])]),
    coat: (T, g) => T.paper(g, [['path', { d: 'M-30 -50 L30 -50 L54 -24 L44 -10 L40 -18 L42 56 L-42 56 L-40 -18 L-44 -10 L-54 -24 Z', fill: C.pine }], ['path', { d: 'M-30 -50 L0 -20 L30 -50 L14 -50 L0 -36 L-14 -50 Z', fill: '#2f5a3f' }],
      ...[-8, 12, 32].map(y => ['circle', { cx: 0, cy: y, r: 5, fill: C.gold }])]),
    warm: (T, g) => T.paper(g, [['path', { d: 'M-40 -8 Q-40 -54 0 -54 Q40 -54 40 -8 Z', fill: C.cream }], ['rect', { x: -44, y: -14, width: 88, height: 14, rx: 6, fill: C.bean }], ['circle', { cx: 0, cy: -58, r: 11, fill: C.bean }],
      ['rect', { x: -48, y: 14, width: 96, height: 18, rx: 9, fill: C.persimmon }], ['rect', { x: 18, y: 20, width: 18, height: 40, rx: 5, fill: C.persimmon }], ['rect', { x: 18, y: 50, width: 18, height: 6, fill: C.cream }]]),
    swim: (T, g) => T.paper(g, [['circle', { r: 50, fill: C.persimmon }], ['circle', { r: 24, fill: C.cream }], ['rect', { x: -8, y: -52, width: 16, height: 30, fill: C.cream }], ['rect', { x: -8, y: 22, width: 16, height: 30, fill: C.cream }],
      ['rect', { x: -52, y: -8, width: 30, height: 16, fill: C.cream }], ['rect', { x: 22, y: -8, width: 30, height: 16, fill: C.cream }]]),
  };
  /* 옷 고르기 배지 3개: 가로는 오른쪽 줄, 세로는 위쪽 줄 (자리는 섞는다) */
  function choiceBadges(T, icons, y) {
    if (narrow()) { const f = rowFit(3, 170); const xs = shuffle(f.xs); return icons.map((d, i) => badge(T, xs[i], 92, d, 78, f.s)); }
    const xs = shuffle([520, 720, 900]);
    return icons.map((d, i) => badge(T, xs[i], y, d));
  }
  /* 세기 판: 동그라미 n개, 하나씩 찬다 */
  function counter(T, n, y = 508, cx = 500, narrowY = 96) {
    if (narrow()) { y = narrowY; cx = 500; }
    const g = T.el('g', {}, stageUI());
    T.paper(g, [['rect', { x: cx - n * 30 - 18, y: y - 34, width: n * 60 + 36, height: 68, rx: 34, fill: C.cream, stroke: C.gold, 'stroke-width': 5 }]]);
    const dots = [];
    for (let k = 0; k < n; k++) {
      const x = cx + (k - (n - 1) / 2) * 60;
      const c = T.el('circle', { cx: x, cy: y, r: 22, fill: '#fff', stroke: C.gold, 'stroke-width': 4 }, g);
      origin(c, x, y);
      const t = T.el('text', { x, y: y + 10, 'text-anchor': 'middle', 'font-size': 28, fill: C.cream, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: k + 1, opacity: 0 }, g);
      dots.push([c, t]);
    }
    return {
      fill(k) { const [c, t] = dots[k]; c.setAttribute('fill', C.persimmon); t.setAttribute('opacity', 1); c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 380 }); },
      remove() { g.remove(); },
    };
  }
  /* 계절 카드 (배경 축소 대신 작은 그림) */
  function seasonCard(T, x, y, season, sc = 1) {
    const g = T.el('g', { transform: `translate(${x},${y}) scale(${sc})` }, stageUI());
    T.paper(g, [['rect', { x: -92, y: -78, width: 184, height: 156, rx: 14, fill: C.cream, stroke: C.gold, 'stroke-width': 6 }]]);
    const inner = T.el('g', {}, g);
    T.el('rect', { x: -80, y: -66, width: 160, height: 104, rx: 8, fill: SKY[season] }, inner);
    T.el('rect', { x: -80, y: 8, width: 160, height: 30, fill: GROUND[season] }, inner);
    if (season === 'summer') { T.el('circle', { cx: 0, cy: -24, r: 26, fill: '#F6D98A' }, inner); T.el('path', { d: 'M-40 -24 H-32 M32 -24 H40 M0 -64 V-56', stroke: C.persimmon, 'stroke-width': 5 }, inner); }
    if (season === 'spring') { T.el('path', { d: 'M0 10 V-20 M0 -8 Q-24 -30 -30 -14 Q-20 -2 0 -8 M0 -16 Q24 -38 30 -22 Q20 -10 0 -16', stroke: C.pine, 'stroke-width': 5, fill: '#8DBA6A' }, inner); T.el('circle', { cx: -44, cy: 0, r: 10, fill: C.pink }, inner); T.el('circle', { cx: 44, cy: 4, r: 10, fill: C.pink }, inner); }
    if (season === 'autumn') [[-30, -30, 30], [10, -10, -20], [36, -40, 60], [-6, -44, 0]].forEach(([cx, cy, r]) => T.el('ellipse', { cx, cy, rx: 16, ry: 9, fill: r > 20 ? C.persimmon : C.bean, transform: `rotate(${r} ${cx} ${cy})` }, inner));
    if (season === 'winter') [[-40, -40], [0, -20], [36, -46], [-20, -2], [44, 0]].forEach(([cx, cy]) => T.el('circle', { cx, cy, r: 8, fill: '#fff', stroke: '#C9D0DC', 'stroke-width': 2 }, inner));
    T.el('text', { x: 0, y: 66, 'text-anchor': 'middle', 'font-size': 26, fill: C.bark, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: SEASON_KO[season] }, g);
    const check = T.el('g', { opacity: 0 }, g);
    T.el('circle', { cx: 70, cy: -62, r: 24, fill: C.pine, stroke: '#fff', 'stroke-width': 4 }, check);
    const num = T.el('text', { x: 70, y: -52, 'text-anchor': 'middle', 'font-size': 28, fill: '#fff', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '' }, check);
    return { g, check, num };
  }

  /* 컷 그림 도우미 */
  const cutText = (T, svg, x, y, text, size = 72) => T.el('text', { x, y, 'text-anchor': 'middle', 'font-size': size, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text }, svg);

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, camTo, camSnap, josa } = T;
    const HOP = '베짱이';

    /* 그림 미리 불러오기: 배우와 첫 배경을 기다리고(최대 4초) 나머지는 뒤에서. 못 불러온 그림은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads['bg_' + k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    Object.keys(ART).filter(k => ART[k]).forEach(k => { loads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    await Promise.race([Promise.all([loads.bg_summer, ...Object.keys(SPR).map(k => loads[k]), loads.hopper_hat].filter(Boolean)), sleep(4000)]);
    /* 그림 컷: 컷 틀(400×300)에 그림을 깔고 글자는 코드가. 그림이 없으면 draw(임시 그림) */
    const cutPic = (key, draw) => svg => { const u = artUrl(key); if (u) el('image', { href: u, x: 0, y: 0, width: 400, height: 300, preserveAspectRatio: 'xMidYMid slice' }, svg); return draw(svg, !!u); };

    /* --- 1. 여름 들판 (와이드) --- */
    fieldBG(T, 'summer');
    const line = el('g', {}, T.world);
    const ants = [540, 605, 670].map((x, i) => { const a = ant(T, line, x, 492, .58); a.face('right'); carry(a.p, true); return a; });
    const marchAnim = ants.map((a, i) => a.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 500, delay: i * 120, iterations: Infinity }));
    let hop = mk(T, T.world, 360, 494, drawHopper, .95);
    hop.face('right');
    hopperMode(hop.p, 'play');

    /* 대사 연출: 목소리 주인에게 카메라가 가고, 말하는 쪽과 듣는 쪽이 서로 마주 본다.
       개미들은 장면마다 새로 만들어지므로 함수로 (아직 없거나 무대에 없으면 건너뜀) */
    const ref = f => () => { try { return f(); } catch (e) { return null; } };
    const onStage = (...fs) => fs.map(f => ref(f)()).find(a => a && a.pos.isConnected) || null;
    const vo = k => typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k] && setTimeout(() => AudioFX.voice(VOICE_LINES[k]), 380);
    T.director({
      cast: {
        hop: () => hop,
        ant: ref(() => host), baby: ref(() => baby), // 옷 고르는 개미(lead)도 같은 목소리지만, 그림판과 겹치지 않게 카메라는 동화가 잡은 그대로
        ants: () => onStage(() => workers[0], () => passers[1], () => ants[0]),
      },
      listener: (r, last) => r !== 'hop' ? 'hop' : last && last !== 'hop' && last !== 'card' ? last : onStage(() => host) ? 'ant' : 'ants',
    });
    await T.curtain(true);
    await say('여름이에요. 개미들이 줄지어 먹이를 날라요. 개미를 톡 눌러 봐요!');
    await T.tap(line, { prompt: '줄지어 가는 개미들을 톡!' });
    SND.yeongcha(T, 3); ants.forEach((a, i) => setTimeout(() => a.hop(18, 300), i * 90));
    T.pop(605, 330, '영차!', C.bean);
    await sleep(700);
    await say('이번엔 베짱이를 톡 눌러 봐요!');
    await T.tap(hop.pos, { prompt: '초록 베짱이를 톡!' });
    SND.tune(T); const bw = bowing(hop.p); notes(T, 310, 280); notes(T, 370, 260);
    T.pop(360, 230, '띠리링~', C.pine);
    await sleep(900); // 연주가 끝나고 베짱이가 말한다 (목소리와 겹치지 않게)
    await say('"여름은 신나! 띠리링~" 베짱이는 노래를 불러요.');
    bw.cancel(); marchAnim.forEach(m => m.cancel());

    /* --- 2. 먹이 나르기 (개미 눈높이) --- */
    let E;
    await T.sceneCard('먹이 나르기', () => {
      T.clear(); E = antEyeBG(T);
    }, ants[1].pos);
    const pile = el('g', {}, T.world);
    const PX = narrow() ? 332 : 300; // 세로: 곡식 더미 왼쪽이 잘리지 않게
    T.paper(pile, [[0, 0], [60, 0], [120, 0], [30, -24], [90, -24], [60, -48]].map(([dx, dy]) => ['ellipse', { cx: PX + dx, cy: 478 + dy, rx: 32, ry: 16, fill: C.gold }]));
    const boss = ant(T, T.world, 190, 496, 1.05); boss.face('right');
    await say('개미 눈으로 보면 풀잎이 나무처럼 커다래요!');
    await say('곡식을 톡톡 눌러서 창고로 날라 줘요!');
    let stored = 0;
    await T.mash(pile, { count: 10, prompt: '노란 곡식을 톡톡 눌러 봐요!', onStep: i => {
      const a = ant(T, T.world, PX + 140, 496, .9); a.face('right'); carry(a.p, true);
      SND.yeongcha(T, 2);
      a.move(E.door[0], E.door[1], 1500, 'linear').then(() => a.pos.remove());
      a.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 320, iterations: 4 });
      setTimeout(() => {
        const s = E.slots[stored++]; if (!s) return;
        s.setAttribute('opacity', 1); s.animate([{ transform: 'scale(.2)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 400 });
        T.tone(520 + stored * 40, .15, { type: 'triangle', vol: .12 });
        T.pop(E.pop[0], E.pop[1], NUM[stored - 1] + '!', C.pine);
      }, 1250);
    } });
    await sleep(1600);
    await say('창고 칸이 가득 찼어요! 하나부터 열까지, 열 칸!');

    /* --- 3. 베짱이 연주 (풀잎 무대 로우앵글) --- */
    let fl;
    const leafArt = !!(bgUrl('leafstage') && artUrl('hopper_play'));
    const FLX = narrow() ? [348, 652] : leafArt ? [290, 730] : [335, 668]; // 세로: 오른쪽 꽃이 잘리지 않게. 그림 베짱이는 바이올린이 길어 꽃을 더 벌린다
    await T.sceneCard('풀잎 무대', () => {
      T.clear(); leafStageBG(T);
      fl = [flower(T, T.world, FLX[0], 250, C.pink), flower(T, T.world, FLX[1], 250, C.persimmon)];
      T.world.appendChild(hop.pos); hop.face('right'); hop.setScale(leafArt ? 1.2 : 1.45); hop.place(500, 470); hopperMode(hop.p, 'play');
    }, pile);
    SND.tune(T);
    await sleep(900);
    await say('"같이 놀자~ 띠리링!" 베짱이가 노래해요.');
    await say('베짱이랑 꽃을 톡톡 눌러서 같이 연주해 봐요!');
    let ni = 0;
    await T.free([
      { el: hop.pos, onTap: () => { SND.violin(T, PENTA[ni++ % PENTA.length]); notes(T, 460, 200); hop.p.bow.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-16deg)' }, { transform: 'rotate(0deg)' }], 400); } },
      { el: fl[0], onTap: () => { SND.violin(T, 330); notes(T, FLX[0], 190); T.anim(fl[0], [{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], 300); } },
      { el: fl[1], onTap: () => { SND.violin(T, 988); notes(T, FLX[1], 190); T.anim(fl[1], [{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], 300); } },
    ], 10000);
    const passers = [0, 1, 2].map(i => { const a = ant(T, T.world, -60 - i * 90, 532, .62); a.face('right'); carry(a.p, true); return a; });
    passers.forEach(a => a.move(a.x + 520, 532, 3200, 'linear'));
    await say('지나가던 개미들이 말했어요. "우린 겨울 준비해야 해!"');
    await say('"겨울은 아직 멀었는걸~" 베짱이는 또 노래했어요.');

    /* --- 4. 소나기 (들판 와이드 비) --- */
    let rain, leafU;
    const LY = 438; // 잎 끝(누름 영역)이 무대 아래로 잘리지 않게 (세로·가로 모두)
    const shelterAnts = [];
    await T.sceneCard('소나기', () => {
      T.clear();
      const F = fieldBG(T, 'summer', { sky: SKY.rain });
      if (F.sun) F.sun.remove();
      T.paper(T.bg, [['ellipse', { cx: 300, cy: 70, rx: 220, ry: 60, fill: '#8C98A4' }], ['ellipse', { cx: 720, cy: 60, rx: 260, ry: 64, fill: '#7E8B97' }]]);
      T.world.appendChild(hop.pos); hop.setScale(.95); hop.place(narrow() ? 372 : 330, 494); hop.face('right'); hopperMode(hop.p, 'play'); // 세로: 젖는 베짱이가 잘리지 않게
      [545, 605, 665].forEach(x => { const a = ant(T, T.world, x, 494, .62); a.face('left'); shelterAnts.push(a); });
      leafU = el('g', {}, T.world);
      if (artUrl('leaf_umbrella')) { // 그림 잎 우산: 잎 가운데 아래(0,0), 폭 300, 줄기는 아래로
        pic(T, leafU, 'leaf_umbrella', -154, -151, 309.8, 298.8);
      } else T.paper(leafU, [['path', { d: 'M-150 0 Q0 -90 150 0 Q0 -30 -150 0 Z', fill: C.leaf }], ['path', { d: 'M-140 -2 Q0 -60 140 -2', stroke: C.pine, 'stroke-width': 5, fill: 'none' }], ['rect', { x: -4, y: -40, width: 8, height: 120, fill: C.pine }]]);
      leafU.setAttribute('transform', `translate(455,${LY}) scale(.75) rotate(-40)`);
      rain = precip(T, 'rain', 44);
    }, hop.pos);
    AudioFX.sfx('splash', .25);
    await say('앗, 소나기가 와요! 후두둑 후두둑!');
    shelterAnts.forEach(a => { a.p.mouth.setAttribute('d', 'M-26 -80 Q-21 -86 -15 -80'); a.body.animate([{ translate: '0 0' }, { translate: '3px 0' }, { translate: '-3px 0' }], { duration: 160, iterations: 6 }); });
    await say('큰 잎을 꾹 눌러서 개미들 우산을 펼쳐 줘요!');
    await T.hold(leafU, { ms: 1600, prompt: '초록 잎을 꾹 눌러 봐요!', onProgress: p => {
      const x = 455 + p * 150, y = LY - (LY - 330) * p, s = .75 + p * .45, r = -40 + p * 40;
      leafU.setAttribute('transform', `translate(${x},${y}) scale(${s}) rotate(${r})`);
    } });
    leafU.setAttribute('transform', 'translate(605,330) scale(1.2)');
    rain.stop(); rain = precip(T, 'rain', 44, [430, 780, 300]);
    SND.sparkle(T); T.pop(605, 250, '펼쳐라!', C.pine);
    shelterAnts.forEach(a => { a.p.mouth.setAttribute('d', 'M-28 -82 Q-22 -76 -15 -81'); a.hop(14); });
    await say('잎 우산 아래 개미들은 뽀송뽀송해요.');
    hopWet(hop.p, true);
    SND.drip(T);
    await sleep(500);
    const sneezed = vo('cut_sneeze');
    await T.cut(cutPic('cut_sneeze', (svg, art) => {
      if (art) return cutText(T, svg, 268, 80, '에취!', 84);
      T.paper(svg, [['ellipse', { cx: 200, cy: 190, rx: 90, ry: 80, fill: C.hop }], ['circle', { cx: 170, cy: 170, r: 16, fill: '#fff' }], ['circle', { cx: 165, cy: 170, r: 8, fill: C.ink }]]);
      [[110, 110], [260, 120], [290, 200], [120, 230]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q-10 16 0 24 q10 -8 0 -24 Z`, fill: '#9FC6DE' }, svg));
      el('ellipse', { cx: 150, cy: 225, rx: 14, ry: 10, fill: C.ink }, svg);
      cutText(T, svg, 200, 90, '에취!', 84);
    }), { hold: 2000 });
    if (!sneezed) SND.sneeze(T); // 목소리 재채기가 있으면 합성음은 생략
    hop.hop(24);
    await say('베짱이는 혼자 흠뻑 젖었어요. 에취! 그래도 "괜찮아~" 하고 웃었어요.');
    rain.stop();

    /* --- 5. 가을 (낙엽 들판) --- */
    let leaves, acorns, AF;
    const lead = ant(T, T.world, 0, 0, 1.1);
    await T.sceneCard('가을', () => {
      T.clear(); AF = fieldBG(T, 'autumn');
      acorns = el('g', {}, T.world);
      [[0, 0], [34, 0], [68, 0], [17, -28], [51, -28], [34, -56]].forEach(([dx, dy]) => acornShape(T, acorns, 450 + dx * 1.4, 474 + dy * 1.4, 2));
      T.world.appendChild(lead.pos); lead.place(330, 496); lead.face('right'); wear(lead.p, []); carry(lead.p, false);
      leaves = precip(T, 'leaf', 22);
    }, lead.pos);
    AudioFX.whoosh();
    await say('가을이 왔어요. 나뭇잎이 알록달록 휘날려요.');
    await say('도토리를 톡톡 눌러서 창고로 데굴데굴 굴려요!');
    let rolled = 0;
    await T.mash(acorns, { count: 6, prompt: '도토리를 톡톡 눌러 봐요!', onStep: i => {
      const last = acorns.lastElementChild; if (last) last.remove();
      const a = acornShape(T, T.world, 0, 0, 1.4);
      SND.roll(T);
      a.animate([{ transform: 'translate(520px,474px) rotate(0deg) scale(2)' }, { transform: `translate(${AF.door[0]}px,${AF.door[1]}px) rotate(720deg) scale(${AF.art ? .7 : 1.1})` }], { duration: 1100, easing: 'ease-in', fill: 'forwards' }).finished.then(() => a.remove());
      rolled++;
      T.pop(620, 360, rolled % 2 ? '데굴!' : '데굴데굴~', C.bark);
    } });
    await sleep(900);
    await say('창고가 도토리로 더 가득해졌어요!');
    // 가을 옷 고르기
    await camTo(narrow() ? lead.x : 440, 380, 1.6, 700);
    await say('바람이 선선해요. 가을엔 무엇을 입을까?');
    const [bTee, bVest, bCoat] = choiceBadges(T, [CLOTH.tee, CLOTH.vest, CLOTH.coat], 250);
    const tryOn = async (list, fx, line) => {
      wear(lead.p, list); fx && fx(true);
      await say(line);
      wear(lead.p, []); fx && fx(false);
    };
    await T.choose([
      { el: bVest, ok: true },
      { el: bTee, ok: false, onWrong: () => tryOn(['tee'], on => { if (on) { SND.shiver(T); lead.body.animate([{ translate: '0 0' }, { translate: '3px 0' }, { translate: '-3px 0' }], { duration: 120, iterations: 8 }); } }, '반팔은 으슬으슬~ 조금 추워요.') },
      { el: bCoat, ok: false, onWrong: () => tryOn(['coat'], on => lead.p.sweat.setAttribute('opacity', on ? 1 : 0), '두꺼운 외투는 아이 더워~ 땀이 뻘뻘!') },
    ], { prompt: '가을엔 무엇을 입을까? 옷을 골라 봐요!', where: '너무 얇지도, 너무 두껍지도 않은 옷!', who: `${josa('조끼', '이에요/예요')}! 반짝이는 걸 눌러 봐요!` });
    [bTee, bVest, bCoat].forEach(b => b.remove());
    wear(lead.p, ['vest']); lead.hop(24); sparkles(T, lead.x, lead.y - 80);
    await say('맞아요! 선선한 가을엔 조끼를 입어요.');
    leaves.stop();
    await camTo(500, 280, 1, 600);

    /* --- 6. 첫눈 (눈 들판 하이앵글) --- */
    let snow, W;
    const crew = [];
    await T.cut(svg => {
      el('rect', { width: 400, height: 300, fill: SKY.winter }, svg);
      for (let i = 0; i < 26; i++) el('circle', { cx: rnd(10, 390), cy: rnd(10, 290), r: rnd(5, 12), fill: '#fff', stroke: '#C9D0DC', 'stroke-width': 1.5 }, svg);
      T.paper(svg, [['path', { d: 'M200 90 V210 M148 120 L252 180 M148 180 L252 120', stroke: '#fff', 'stroke-width': 14, 'stroke-linecap': 'round' }]]);
      cutText(T, svg, 200, 280, '펑펑!', 60);
    }, { hold: 2000 });
    await T.sceneCard('첫눈', () => {
      T.clear(); W = winterHighBG(T);
      T.world.appendChild(lead.pos); lead.place(narrow() ? 350 : 330, 470); lead.setScale(1.05); lead.face('right'); wear(lead.p, []);
      (artUrl('ant_stand') ? [470, 590] : [440, 510]).forEach(x => { const a = ant(T, T.world, x, 440, .8); a.face('right'); crew.push(a); }); // 그림 개미는 옆으로 길어 간격을 벌린다
      snow = precip(T, 'snow', 40);
    }, lead.pos);
    SND.shiver(T);
    await say('하얀 눈이 펑펑! 겨울이 왔어요. 호호, 추워라.');
    await say('겨울엔 무엇을 입을까?');
    const [bWarm, bTee2, bSwim] = choiceBadges(T, [CLOTH.warm, CLOTH.tee, CLOTH.swim], 190);
    await T.choose([
      { el: bWarm, ok: true },
      { el: bTee2, ok: false, onWrong: () => tryOn(['tee'], on => { if (on) { SND.shiver(T); lead.body.animate([{ translate: '0 0' }, { translate: '4px 0' }, { translate: '-4px 0' }], { duration: 110, iterations: 10 }); } }, '반팔은 오들오들~ 너무 추워요!') },
      { el: bSwim, ok: false, onWrong: () => tryOn(['ring'], on => { if (on) { SND.shiver(T); lead.hop(40); T.pop(lead.x, lead.y - 190, '앗, 차가워!', C.indigo); } }, '하하, 수영복은 여름에 입어요~ 앗, 차가워!') },
    ], { prompt: '겨울엔 무엇을 입을까? 옷을 골라 봐요!', where: '눈이 오면 머리랑 목을 따뜻하게!', who: '목도리와 털모자예요! 반짝이는 걸 눌러 봐요!' });
    [bWarm, bTee2, bSwim].forEach(b => b.remove());
    wear(lead.p, ['scarf', 'hat']); crew.forEach(a => wear(a.p, ['scarf', 'hat']));
    lead.hop(24); sparkles(T, lead.x, lead.y - 90);
    await say('맞아요! 목도리와 털모자를 쓰니 따뜻해요.');
    await say('개미들은 따뜻한 창고로 쏙 들어갔어요.');
    for (const a of [...crew, lead]) {
      SND.snowStep(T);
      a.move(W.hole[0], W.hole[1] + 10, W.far ? 1600 : 1100).then(() => a.pos.remove());
      a.body.animate(W.far ? [{ opacity: 1, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(.5)', offset: .8 }, { opacity: 0, transform: 'scale(.4)' }] // 그림: 먼 구멍으로 갈수록 작게
        : [{ opacity: 1 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: W.far ? 1600 : 1100, fill: 'forwards' });
      await sleep(300);
    }
    await sleep(1000);
    lead.body.getAnimations().forEach(x => x.cancel());
    crew.forEach(a => a.body.getAnimations().forEach(x => x.cancel()));

    /* --- 7. 똑똑 베짱이 (창고 문 로우앵글) --- */
    let D, baby;
    vo('cut_shiver');
    await T.cut(cutPic('cut_shiver', (svg, art) => {
      if (art) return cutText(T, svg, 290, 62, '오들오들', 56);
      el('rect', { width: 400, height: 300, fill: SKY.winter }, svg);
      for (let i = 0; i < 20; i++) el('circle', { cx: rnd(10, 390), cy: rnd(10, 290), r: rnd(4, 9), fill: '#fff' }, svg);
      T.paper(svg, [['ellipse', { cx: 200, cy: 190, rx: 80, ry: 90, fill: C.hop }], ['ellipse', { cx: 200, cy: 210, rx: 40, ry: 60, fill: C.hopBelly }], ['circle', { cx: 176, cy: 150, r: 14, fill: '#fff' }], ['circle', { cx: 173, cy: 152, r: 7, fill: C.ink }]]);
      el('path', { d: 'M120 120 l-14 -8 M120 150 l-18 0 M280 120 l14 -8 M280 150 l18 0', stroke: C.indigo, 'stroke-width': 5, 'stroke-linecap': 'round' }, svg);
      cutText(T, svg, 200, 70, '오들오들', 56);
    }), { hold: 2000, sfx: null });
    await T.sceneCard('똑똑', () => {
      T.clear(); D = doorBG(T);
      T.world.appendChild(hop.pos); hop.setScale(D.art ? 1.45 : 1.75); hop.place(D.hopX, D.hopY); hop.face('left'); hopperMode(hop.p, 'arms');
      hopWet(hop.p, false);
      snow = precip(T, 'snow', 30);
    }, hop.pos);
    const shiverA = hop.body.animate([{ translate: '0 0' }, { translate: '4px 0' }, { translate: '-4px 0' }], { duration: 130, iterations: Infinity });
    SND.shiver(T);
    await say('눈 오는 날, 베짱이가 오들오들 떨며 창고 문을 두드렸어요.');
    SND.knock(T); T.pop(D.knock[0], D.knock[1], '똑똑!', C.bark);
    await sleep(700);
    SND.creak(T);
    await T.anim(D.door, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.45)' }], 700);
    const host = ant(T, T.world, D.hostX, D.y, .95); host.face('right'); wear(host.p, ['scarf']);
    baby = ant(T, T.world, D.babyX, D.y, .62, { baby: true }); baby.face('right');
    host.pos.parentNode.insertBefore(host.pos, hop.pos);
    await say('"개미야, 먹을 것 좀 나눠 줄 수 있니?"');
    await say('개미가 물었어요. "여름엔 뭘 했니?"');
    await say('"노래했지. 띠리링~"');
    await say('"그럼 겨울엔 춤이나 추렴!"');
    SND.creak(T);
    await T.anim(D.door, [{ transform: 'scaleX(.45)' }, { transform: 'scaleX(.85)' }], 900);
    baby.hop(20);
    await say('그때 아기 개미가 말했어요. "그래도 추워 보여요."');
    await say('문을 톡 눌러서 활짝 열어 줄까요?');
    await T.tap(D.door, { prompt: '창고 문을 톡!' });
    SND.door(T);
    await T.anim(D.door, [{ transform: 'scaleX(.85)' }, { transform: 'scaleX(.06)' }], { duration: 500, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    D.glow.animate([{ opacity: .6 }, { opacity: 1 }], { duration: 600, iterations: 3, direction: 'alternate' });
    SND.sparkle(T); sparkles(T, D.spark[0], D.spark[1], 140, 8);
    await T.cut(cutPic('cut_door', (svg, art) => {
      if (art) return cutText(T, svg, 300, 286, '활짝!', 64);
      el('rect', { width: 400, height: 300, fill: '#5E4330' }, svg);
      T.paper(svg, [['path', { d: 'M110 300 V130 Q110 50 200 50 Q290 50 290 130 V300 Z', fill: C.amber }], ['path', { d: 'M110 300 V130 Q110 50 130 55 V300 Z', fill: '#8E6440' }]]);
      cutText(T, svg, 200, 190, '활짝!', 80);
    }), { hold: 1800 });
    shiverA.cancel();
    host.hop(20);
    await say('"어서 들어와요! 같이 겨울을 나요."');
    hop.hop(30);
    await say('"고마워요! 대신 내가 멋진 음악을 들려줄게요!"');
    snow.stop();

    /* --- 8. 창고 가득 (창고 단면) --- */
    let K;
    const guests = [];
    const home = [];
    await T.sceneCard('창고 가득', () => {
      T.clear(); K = cellarBG(T);
      // 개미 가족 + 베짱이는 큰 방에
      T.world.appendChild(hop.pos); hop.setScale(K.art ? .62 : .72); hop.place(500, K.hopY); hop.face('left'); hopperMode(hop.p, 'arms');
      hopWarm(hop.p, true);
      (K.art ? [[362, .55], [418, .45], [628, .55]] : [[380, .62], [440, .5], [600, .62]]).forEach(([x, s], i) => { const a = ant(T, T.world, x, K.antY, s); a.face(x < 500 ? 'right' : 'left'); wear(a.p, i === 1 ? [] : ['scarf']); home.push(a); });
      T.world.appendChild(hop.pos);
      // 바깥 눈밭에서 기다리는 친구들
      FRIENDS.forEach((f, i) => { const a = mk(T, T.world, 760 + i * (artUrl(f.key) ? 96 : 72), K.snowY, f.draw, f.s * .8); a.f = f; guests.push(a); });
    }, hop.pos);
    await say('창고 안이 곡식이랑 도토리로 가득해요! 여름부터 미리 모은 덕분이에요.');
    await say('베짱이에게 목도리와 털모자도 나눠 줬어요.');
    await say('먹을 게 이렇게 많으니 친구들도 불러요! 문 앞에 온 친구를 톡 눌러요.');
    const cnt = counter(T, FRIENDS.length, 470, 150, K.art ? 36 : 96); // 그림: 손님이 눈 위(y 140)에서 기다려서 세로 화면 세기 판을 더 위로
    const seats = (narrow() ? [352, 418, 590, 648] : K.art ? [345, 425, 575, 655] : [335, 410, 595, 665]).map((x, i) => [x, K.seatY[i]]); // 세로: 음악회 확대에서도 다 보이게
    for (let i = 0; i < guests.length; i++) {
      const g = guests[i];
      SND.step(T); await g.move(630, K.snowY, 700);
      await T.tap(g.pos, { prompt: `${josa(g.f.name, '을/를')} 톡 눌러서 불러 줘요!` });
      SND.squeak(T, 1200 + i * 150);
      await g.move(K.shaftX, K.snowY + 8, 500);
      await g.move(K.shaftX, K.shaftY, 450, 'ease-in');
      await g.move(seats[i][0], seats[i][1], 500);
      g.face(seats[i][0] < 500 ? 'right' : 'left'); g.setScale(g.f.s * (K.art ? .58 : .62));
      cnt.fill(i); T.tone(523 + i * 110, .2, { type: 'triangle', vol: .14 });
      T.pop(500, 300, NUM[i] + '!', C.persimmon);
      await say(`${NUM[i]}! ${josa(g.f.name, '이/가')} 왔어요.`);
    }
    await say('친구가 넷이나 왔어요! 먹을 게 많아서 모두 나눠 먹을 수 있어요.');
    cnt.remove();

    /* --- 9. 겨울 음악회 (큰 방 확대, 반딧불 조명) --- */
    await T.sceneCard('겨울 음악회', () => {
      camSnap(K.cam[0], K.cam[1], narrow() ? 1.1 : 2.1);
      hopperMode(hop.p, 'play');
      K.light.setAttribute('opacity', .55);
      for (let i = 0; i < 7; i++) {
        const x = 330 + i * 56, y = 368 + (i % 2) * 14;
        const l = el('circle', { cx: x, cy: y, r: 5, fill: '#FFE08A' }, T.fx);
        l.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 600 + i * 90, iterations: Infinity, direction: 'alternate' });
      }
    }, hop.pos);
    SND.tune(T);
    await say('반딧불이가 불을 밝히고, 겨울 음악회가 시작됐어요!');
    await say('베짱이랑 친구들을 톡톡 눌러 봐요. 음악에 맞춰 춤을 춰요!');
    let mi = 0;
    const dancers = [...home, ...guests];
    await T.free([
      { el: hop.pos, onTap: () => { SND.violin(T, PENTA[mi++ % PENTA.length]); notes(T, 470, 360); hop.p.bow.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-16deg)' }, { transform: 'rotate(0deg)' }], 400); } },
      ...dancers.map((a, i) => ({ el: a.pos, onTap: () => { T.tone(PENTA[(i + 2) % PENTA.length] * 2, .2, { type: 'triangle', vol: .14 }); a.hop(20, 360); a.wiggle(10, 360); } })),
    ], 15000);
    SND.tune(T);
    dancers.forEach((a, i) => setTimeout(() => a.hop(16, 360), i * 80));
    await say('띠리링~ 짝짝짝! 겨울이 하나도 춥지 않았어요.');

    /* --- 10. 봄 (새싹 들판 와이드) --- */
    const workers = [];
    await T.sceneCard('봄', () => {
      T.clear(); camSnap(narrow() ? 380 : 500, 280, 1); fieldBG(T, 'spring'); // 세로: 베짱이와 일개미가 함께 보이게
      T.world.appendChild(hop.pos); hop.setScale(.9); hop.place(300, 494); hop.face('right'); hopperMode(hop.p, 'carry');
      hopWarm(hop.p, false);
      (artUrl('ant_carry') ? [420, 485, 550] : [400, 460, 520]).forEach(x => { const a = ant(T, T.world, x, 494, .6); a.face('right'); carry(a.p, true); workers.push(a); });
    }, hop.pos);
    AudioFX.animal('rooster', .3);
    await say('따뜻한 봄이 왔어요. 새싹이 쏙쏙!');
    await say('이번엔 베짱이도 함께 날라요. 베짱이를 톡톡 눌러서 영차!');
    await T.mash(hop.pos, { count: 4, prompt: '베짱이를 톡톡 눌러서 영차 영차!', onStep: i => {
      SND.yeongcha(T, 4); SND.step(T);
      const dx = 80;
      if (narrow()) camTo(hop.x + dx + 80, 280, 1, 420); // 세로: 걸어가는 베짱이를 카메라가 따라간다
      hop.move(hop.x + dx, 494, 420); hop.hop(16, 420);
      workers.forEach((a, k) => setTimeout(() => { a.move(a.x + dx, 494, 420); a.hop(12, 420); }, k * 70));
      T.pop(hop.x + 40, 240, '영차!', C.bean);
    } });
    await sleep(600);
    await say('"영차! 여름엔 노래하고, 일도 함께 할래요!"');

    // 끝 놀이: 계절 카드 순서대로
    await camTo(500, 280, 1, 400);
    const veil = el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: C.cream, opacity: .55 }, T.fx);
    const order = ['spring', 'summer', 'autumn', 'winter'];
    let spots;
    if (narrow()) { const [a, b] = visX(), w = b - a, sc = Math.min(.9, (w - 40) / 2 / 190); spots = [[500 - w / 4 + 4, 160], [500 + w / 4 - 4, 160], [500 - w / 4 + 4, 390], [500 + w / 4 - 4, 390]].map(([x, y]) => [x, y, sc]); }
    else spots = [140, 380, 620, 860].map(x => [x, 330, 1]);
    spots = shuffle(spots);
    const cards = order.map((s, i) => ({ s, ...seasonCard(T, spots[i][0], spots[i][1], s, spots[i][2]) }));
    await say('계절 카드를 봄, 여름, 가을, 겨울 순서대로 톡 눌러 봐요!');
    const left = [...cards];
    for (let k = 0; k < order.length; k++) {
      const want = cards[k];
      const name = SEASON_KO[want.s];
      if (left.length === 1) { // 마지막 한 장
        await T.tap(want.g, { prompt: `${name} 카드를 톡!` });
      } else {
        await T.choose(left.map(c => ({ el: c.g, ok: c === want, onWrong: c === want ? null : async () => {
          await T.anim(c.g, [{ translate: '0 0' }, { translate: '0 -26px' }, { translate: '0 0' }], 420);
          want.g.style.filter = 'url(#hintGlow)';
          await say('"나는 다음이야~"');
        } })), { prompt: `${josa(name, '은/는')} 어디 있을까? ${name} 카드를 톡!`, where: `이번엔 ${name}! 반짝이는 카드예요.`, who: `${name} 카드를 눌러 봐요!` });
      }
      want.g.style.filter = '';
      left.splice(left.indexOf(want), 1);
      want.check.setAttribute('opacity', 1); want.num.textContent = k + 1;
      T.anim(want.g, [{ translate: '0 0' }, { translate: '0 -20px' }, { translate: '0 0' }], 380);
      T.tone(523 + k * 131, .25, { type: 'triangle', vol: .16 });
      await say(`${k + 1}번, ${name}!`);
    }
    SND.sparkle(T); T.confetti(); AudioFX.fanfare && AudioFX.fanfare();
    await say('봄, 여름, 가을, 겨울! 계절은 빙글빙글 돌아요.');
    cards.forEach(c => c.g.remove()); veil.remove();
    workers.forEach((a, i) => setTimeout(() => a.hop(20), i * 90)); hop.hop(26);
    await say('미리 준비하고 함께 나누니, 겨울도 따뜻했답니다.');
    return '미리 준비하고, 함께 나누면 모두 따뜻해요!';
  }

  Tale.mount({ title: '개미와 베짱이', subtitle: '사계절 이야기', run: T => run(Tale.api) });
})();
