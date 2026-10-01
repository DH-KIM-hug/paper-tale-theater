/* 해와 달이 된 오누이 (햇님 달님) — 배경·배우·소품·컷은 페이퍼아트 그림(아래 BG·ART 표), 그림이 없는 것만 임시 도형(그레이박스). 기획: TALES_PLAN.md §1 (3막 15장면)
   원작대로 엄마는 호랑이에게 잡아먹힌다(사용자 결정, 2026-09-29). 단, 먹는 장면은 보여주지 않고
   어둠 속 "어흥!" → 까만 화면 "꿀꺽…" 컷과 내레이션으로만 처리한다.
   호랑이는 헌 줄이 끊어져 수수밭에 엉덩방아 → 혹 달고 산으로 도망. 눈은 늘 동그랗고 순하다. */
(() => {
  const C = { cream: '#F6ECD8', gold: '#D9A94E', persimmon: '#E8703A', bean: '#A93B32', bark: '#6B4A32', pine: '#3F6B4F',
    indigo: '#1F2A56', lav: '#8B7BB8', snow: '#F4F6FA', amber: '#F2B366', ink: '#2E241C', pink: '#E8A0A0', skin: '#F3D2B0',
    stripe: '#4A2F1E', hair: '#3D2B1F', leaf: '#6E9A5B', stone: '#9A9186', night: '#16204a' };

  /* ================= 배경 그림 (페이퍼아트 한 장) =================
     장면마다 한 장(assets/v3w/sm_bg_*.webp)을 무대에 꽉 채워 깐다. 깊이는 그림 속 종이 층이 맡고 무대는 2D.
     값이 null이거나 파일을 못 불러오면 그 장면은 아래 그레이박스 도형으로 그린다.
     - 거의 까맣게 나온 넷은 낮 그림으로 다시 뽑아 밤으로 구웠다 (아래 tree · wellTop · door).
       sm_bg_hill_night_day(셋째 고개)는 쓰지 않는다: 바위가 작아 호랑이가 숨지 못하고, 세 고개가 같은 그림(hill0~2)이라 셋째만 바뀌면 어색하다
     - hill0 / hill2는 sm_bg_hill_dusk를 색 보정해 구운 것(금빛 / 밤). 세 고개 모두 그 그림 속 바위를 호랑이 가림막으로 쓴다(HILL_ROCK).
     - room · backyard는 원본이 너무 어두워 밝기를 끌어올려 구웠다 (원본: assets/raw/v3). */
  const AS = '../../assets/';
  const BG = {
    cottage: 'v3w/sm_bg_cottage.webp',
    kitchen: 'v3w/sm_bg_kitchen.webp',
    hill0: 'v3w/sm_bg_hill_dusk_gold.webp',
    hill1: 'v3w/sm_bg_hill_dusk.webp',
    hill2: 'v3w/sm_bg_hill_dusk_night.webp',
    room: 'v3w/sm_bg_room.webp',
    backyard: 'v3w/sm_bg_backyard.webp',
    sky: 'v3w/sm_bg_sky.webp',               // 구름 사이로 빛이 드는 밤하늘 (무대 뒤에 고정, 줄·구름·오누이만 위로 흐른다)
    sorghum: 'v3w/sm_bg_sorghum_dusk.webp',  // 수수밭 — 원본은 한낮이라 해 질 녘 보랏빛으로 구움 (줄이 끊어진 건 밤)
    heaven: 'v3w/sm_bg_heaven.webp', heavenNight: 'v3w/sm_bg_heaven_night.webp', // 밤 = 같은 그림을 푸른 밤으로 구운 것 (톡 하면 서서히 바뀜)         // 하늘 나라 — 그림 속 해·달은 지웠다 (해님·달님은 오누이 배우). 밤은 코드의 남색 장막
    /* 까맣게 나와 다시 뽑은 낮 그림(assets/raw/v3/*_day.png)을 밤으로 구운 것 (conv: 스크래치 bake_night.py).
       하늘은 푸른 밤, 종이 물건은 달빛 받은 연보라·크림 — 가장 어두운 곳도 남색(#24285a 쯤)까지만 */
    tree: 'v3w/sm_bg_well_tree_night.webp',   // 우물가 큰 나무 (왼쪽에 그림 끝 330px를 거울로 이어 붙임)
    wellTop: 'v3w/sm_bg_well_top_night.webp', // 우물 속 (위에서 본 돌 우물)
    door: 'v3w/sm_bg_window_panel.webp',      // 창호지 문 한 짝 (등잔불 색) → 여러 짝 이어 붙여 문·벽을 만든다
  };
  /* ================= 배우·소품·컷 그림 (페이퍼아트, assets/v3w/sm_*.webp) =================
     null = 쓸 그림이 없어 임시 도형(그레이박스)으로 그린다. 새 파일이 나오면 여기 한 줄만 바꾸면 된다.
     - 엄마·오누이는 가족 사진을 바탕으로 다시 뽑은 새 모습 (2026-10-01): 엄마(분홍 저고리·회색 바지), 오빠(바가지 머리·파란 저고리),
       동생(양갈래·분홍 치마). 이전 모습 그림은 하나도 쓰지 않는다.
     - 오누이 나무 오르기(kids_climb): 오빠 위·동생 아래 한 장 (오빠 배우에, 동생 배우는 숨김). 아래 나무 그루터기는 지웠다
       → 나무 기둥과 하늘 동아줄을 그대로 잡는다 (CLIMB: 동생이 안고 있던 기둥 자리가 발끝 x=0)
     - 얼굴(boy_face·girl_face): sm_boy·sm_girl에서 머리만 오린 것 — 우물 그림자, 끝 장면 처음(오빠 해·동생 달)
     - 끝 장면: 바꾼 뒤 해님 = sun_girl(해 앞의 동생), 달님 = moon_boy(보름달 앞의 오빠)
     - 참기름 병(oil): 병에 붙어 나온 얼굴(눈·볼)을 지운 것. 동아줄 두 개는 줄 아래 붙어 나온 얼굴 덩어리를 잘라낸 것
     - 다시 뽑은 것: lamp_on / lamp_off(등잔: 얼굴 지우고, 불꽃만 지운 끈 등잔을 따로) · 동아줄 두 개(종이 공예판, 아래 얼굴 덩어리 잘라냄)
     - 못 써서 그레이박스로 두는 것:
       basket(떡에 얼굴, 떡 개수도 5개로 고정 — 엄마 바구니 그림으로 충분) ·
       cut_eye(두 번 다 호랑이 이마에 세 번째 눈) */
  const ART = {
    mom_wave: 'v3w/sm_mom_wave.webp', mom_basket: 'v3w/sm_mom_basket.webp',
    boy: 'v3w/sm_boy.webp', girl: 'v3w/sm_girl.webp', kids_hug: 'v3w/sm_kids_hug.webp',
    kids_climb: 'v3w/sm_kids_climb.webp',
    boy_face: 'v3w/sm_boy_face.webp', girl_face: 'v3w/sm_girl_face.webp',
    tiger: 'v3w/sm_tiger.webp', tiger_full: 'v3w/sm_tiger_full.webp', tiger_scarf: 'v3w/sm_tiger_scarf.webp',
    tiger_axe: 'v3w/sm_tiger_axe.webp', tiger_slip: 'v3w/sm_tiger_slip.webp', tiger_bump: 'v3w/sm_tiger_bump.webp',
    rope_good: 'v3w/sm_rope_good.webp', rope_bad: 'v3w/sm_rope_bad.webp', oil: 'v3w/sm_oil.webp',
    kids_rope: null, // 새 모습으로 다시 뽑는 중 → 그동안 줄 오르기도 kids_climb
    sun_girl: 'v3w/sm_sun_girl.webp', moon_boy: 'v3w/sm_moon_boy.webp', lamp_on: 'v3w/sm_lamp_on.webp', lamp_off: 'v3w/sm_lamp_off.webp',
    basket: null,
    cut_well: 'v3w/sm_cut_well.webp', cut_snap: 'v3w/sm_cut_snap.webp', cut_eye: null,
  };
  const artOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  /* 배우 그림: 발끝(0,0) 기준 w×h 상자 안에 아래·가운데 맞춤. flip: 그림이 코드가 가정한 쪽(왼쪽)과 반대를 볼 때
     (엔진 face('right')가 좌우를 뒤집으므로, 뒤집지 않은 그림 = 왼쪽을 본다) */
  function sprite(T, g, key, w, h, { flip = false, dx = 0, dy = 0 } = {}) {
    const u = artUrl(key); if (!u) return null;
    const wrap = T.el('g', { filter: 'url(#pp)', transform: `translate(${dx} ${dy})${flip ? ' scale(-1 1)' : ''}` }, g);
    T.el('image', { href: u, x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'xMidYMax meet' }, wrap);
    return wrap;
  }
  /* 여러 자세 그림을 한 배우 안에 겹쳐 두고 하나만 보인다. 없는 자세는 기본(첫 자세)으로. 그림이 하나도 없으면 null */
  function poseArt(T, g, defs) {
    const imgs = {};
    let first = null;
    for (const [k, [key, w, h, o]] of Object.entries(defs)) { const s = sprite(T, g, key, w, h, o); if (s) { imgs[k] = s; first = first || k; } }
    if (!first) return null;
    const pa = { cur: first, has: k => !!imgs[k], el: k => imgs[k] };
    pa.set = k => { if (!imgs[k]) k = first; pa.cur = k; Object.entries(imgs).forEach(([n, s]) => { s.style.display = n === k ? '' : 'none'; }); };
    pa.set(first);
    return pa;
  }
  /* 그림 컷 (없으면 null → 부른 쪽이 임시 컷) */
  const cutArt = (T, key, sfx, hold, onShow) => (artUrl(key) ? T.cutImage([{ src: artUrl(key), sfx, hold }], { hold, onShow }) : null);
  /* 동아줄 그림: 줄 끝 한 장(아래)을 그대로 두고, 그 위는 같은 그림의 윗부분(꼬임 주기만큼)을 하늘 끝까지 이어 붙인다.
     ROPE: [그림 폭, 높이, 이어 붙일 윗부분 높이(px, 꼬임 주기의 배수)] */
  const ROPE = { rope_good: [63, 594, 490], rope_bad: [71, 434, 300] };
  let ropeN = 0;
  function ropeArt(T, p, key, cx, bottom, k, top = -3400) {
    const u = artUrl(key); if (!u) return null;
    const [iw, ih, tile] = ROPE[key], w = iw * k, h = ih * k, th = tile * k, y0 = bottom - h;
    const id = 'smRope' + (++ropeN);
    const pat = T.el('pattern', { id, patternUnits: 'userSpaceOnUse', x: cx - w / 2, y: y0, width: w, height: th }, T.el('defs', {}, p));
    T.el('image', { href: u, x: 0, y: 0, width: w, height: h, preserveAspectRatio: 'none' }, pat);
    const g = T.el('g', { filter: 'url(#pp)' }, p);
    T.el('rect', { x: cx - w / 2, y: top, width: w, height: y0 - top + 1, fill: `url(#${id})` }, g);
    T.el('image', { href: u, x: cx - w / 2, y: y0, width: w, height: h, preserveAspectRatio: 'none' }, g);
    return g;
  }
  /* 크기 (무대 단위, 배우 scale 1): 자세가 바뀌어도 머리 크기가 튀지 않게 그림마다 맞춘 값 */
  const SZ = {
    mom_wave: [125, 240], mom_basket: [114, 240],
    boy: [71, 150], girl: [89, 158], kids_hug: [116, 146], kids_climb: [83, 223], kids_rope: [158, 283],
    tiger: [150, 235], tiger_full: [192, 230], tiger_scarf: [179, 225], tiger_axe: [159, 240], tiger_slip: [218, 225], tiger_bump: [176, 205],
  };
  /* 나무 오르기 그림: 지운 기둥 가운데가 그림 폭의 어디였는지 (conv 결과) → 발끝 x=0이 기둥(줄) 가운데 */
  const CLIMB = { kids_climb: .345 };
  const ROPE_GAP = 128; // 줄·나무를 오를 때 동생 발끝이 오빠 발끝보다 이만큼 아래 (둘이 한 장인 그림은 이만큼 내려 단다)
  const climbDx = k => SZ[k][0] * (.5 - CLIMB[k]);
  const bgOK = {};
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  /* 무대 꽉 채우기: 1000×560을 덮고 가장자리를 조금 더 덮는다 (그림 비율 1760:992 그대로) */
  const FULL = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const place = (T, p, u, box, attrs = {}) =>
    T.el('image', { href: u, x: box.x, y: box.y, width: box.w, height: box.h, preserveAspectRatio: 'none', ...attrs }, p);
  function bgImage(T, p, k, { flip = false, back = '#1a120c' } = {}) {
    const u = bgUrl(k); if (!u) return null;
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: back }, p);
    const g = T.el('g', flip ? { transform: 'matrix(-1,0,0,1,1000,0)' } : {}, p);
    place(T, g, u, FULL);
    return g;
  }
  /* 같은 그림을 한 번 더, 모양(poly: 원본 1760×992 픽셀 좌표)대로 오려서 배우 앞에 둔다 = 그림 속 바위·장독 뒤에 숨기 */
  let clipN = 0;
  function bgCutout(T, p, u, box, poly, attrs = {}) {
    const id = 'smCut' + (++clipN), k = box.w / 1760;
    const cp = T.el('clipPath', { id }, p);
    T.el('polygon', { points: poly.map(([x, y]) => `${(box.x + x * k).toFixed(1)},${(box.y + y * k).toFixed(1)}`).join(' ') }, cp);
    const g = T.el('g', attrs, p);
    place(T, g, u, box, { 'clip-path': `url(#${id})` });
    return g;
  }
  /* 고개 그림(sm_bg_hill_dusk, 좌우 뒤집어 쓴다) 속 큰 바위 + 그 아래 땅 (원본 픽셀) */
  /* 창호지 문 짝 그림(BG.door, 325×720)을 옆으로 이어 붙여 문·벽을 만든다.
     xs: 짝의 왼쪽 끝 x들, k: 배율(무대 단위/px), y0: 위끝. flipAt: 이 x 이상은 좌우로 뒤집어(문살 기둥이 가운데 틈 쪽으로) */
  const PANEL = [325, 720];
  function panelWall(T, p, { k = 560 / 720, y0 = 0, x0 = -400, x1 = 1400, gapAt = null, gap = 20, back = '#5b4a5c' } = {}) {
    const u = bgUrl('door'); if (!u) return null;
    const w = PANEL[0] * k, h = PANEL[1] * k;
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: back }, p);
    const put = (x, flip) => place(T, T.el('g', flip ? { transform: `matrix(-1,0,0,1,${2 * x + w},0)` } : {}, p), u, { x, y: y0, w, h });
    if (gapAt == null) { for (let x = x0; x < x1; x += w) put(x, false); return w; }
    for (let x = gapAt - gap / 2 - w; x > x0 - w; x -= w) put(x, false);            // 틈 왼쪽: 기둥이 오른쪽(틈 쪽)
    for (let x = gapAt + gap / 2; x < x1; x += w) put(x, true);                      // 틈 오른쪽: 뒤집어 기둥이 왼쪽
    return w;
  }
  /* 우물가 나무 그림(BG.tree, 2090×992 — 왼쪽 330px는 이어 붙인 여백) 속 자리 (원본 픽셀) */
  const TREE_PX = { trunk: [665, 665], canopyL: [555, 215], moon: [530, 90] }; // 나무 밑동(기둥 가운데·땅), 왼쪽 잎 덩어리 윗면, 달빛
  function treeArt(T, p, s, [px, py], [ax, ay]) {
    const u = bgUrl('tree'); if (!u) return null;
    const x = ax - px * s, y = ay - py * s;
    T.el('rect', { x: -1400, y: -1400, width: 5600, height: 3400, fill: '#34427f' }, p);   // 그림 밖: 위 하늘색
    T.el('rect', { x: -1400, y: y + 900 * s, width: 5600, height: 3400, fill: '#5d648a' }, p); // 아래 땅색
    place(T, p, u, { x, y, w: 2090 * s, h: 992 * s });
    T.el('rect', { x: -1400, y: -1400, width: 5600, height: 5600, fill: '#1c2660', opacity: .24 }, p); // 가까이 볼 때 흰 잎이 눈처럼 보이지 않게 밤빛을 한 겹 더
    return { at: ([qx, qy]) => [x + qx * s, y + qy * s] };
  }
  const HILL_ROCK = [[332, 918], [393, 846], [465, 739], [543, 696], [734, 711], [806, 786], [825, 840], [798, 905], [798, 1060], [332, 1060]];

  /* ================= 작은 도우미 ================= */
  const origin = (n, x, y) => { n.style.transformBox = 'view-box'; n.style.transformOrigin = `${x}px ${y}px`; return n; };
  /* 세로·가로로 긴 세트를 움직이는 로컬 카메라 (엔진 camTo는 0..560 상자에 묶여 있어서) */
  function mkView(T, parent) {
    const g = T.el('g', {}, parent);
    origin(g, 0, 0);
    const tf = (cx, cy, z) => `translate(500px,280px) scale(${z}) translate(${-cx}px,${-cy}px)`;
    let cur = tf(500, 280, 1);
    g.style.transform = cur;
    g.to = async (cx, cy, z = 1, dur = 800) => {
      const to = tf(cx, cy, z);
      if (dur) await T.anim(g, [{ transform: cur }, { transform: to }], { duration: dur, easing: 'cubic-bezier(.35,0,.25,1)' });
      g.style.transform = to; cur = to;
    };
    return g;
  }
  const waveArm = (T, arm) => T.anim(arm, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-150deg)' }, { transform: 'rotate(-115deg)' },
    { transform: 'rotate(-150deg)' }, { transform: 'rotate(-115deg)' }, { transform: 'rotate(0deg)' }], 1100);
  const tremble = a => a.body.animate([{ translate: '0 0' }, { translate: '3px 0' }, { translate: '-3px 0' }], { duration: 110, iterations: Infinity });

  /* 소리 (동화 전용) */
  const momVoice = T => [659, 784, 880, 784, 659].forEach((f, i) => T.tone(f, .26, { type: 'sine', vol: .16, when: i * .17 }));
  const tigerVoice = T => { T.tone([130, 92], .5, { type: 'sawtooth', vol: .13 }); T.tone([170, 110], .4, { type: 'square', vol: .06, when: .35 }); T.tone([140, 88], .6, { type: 'sawtooth', vol: .13, when: .62 }); };
  const giggle = T => [880, 1046, 880, 1175, 988, 1318].forEach((f, i) => T.tone([f, f * 1.12], .08, { type: 'triangle', vol: .15, when: i * .1 }));
  const creak = T => AudioFX.sfx('creak') || (() => { T.tone([230, 160], .5, { type: 'sawtooth', vol: .08 }); T.tone([170, 250], .45, { type: 'sawtooth', vol: .06, when: .45 }); })();
  const kok = T => AudioFX.sfx('chop') || (() => { T.tone([1300, 800], .06, { type: 'square', vol: .12 }); T.tone([500, 300], .08, { type: 'triangle', vol: .12, when: .04 }); })();
  const yeongcha = (T, i) => T.tone([300 + i * 50, 520 + i * 50], .18, { type: 'triangle', vol: .16 });
  /* 말풍선 없는 소리 대사 (컷신 속 외침): narration.js의 VOICE_LINES */
  const cutVoice = (k, delay = 300) => typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k] && setTimeout(() => AudioFX.voice(VOICE_LINES[k]), delay);

  /* ================= 캐릭터 (임시 도형) ================= */
  function drawCake(T, p, x, y, s = 1) {
    return T.paper(p, [['rect', { x: x - 12 * s, y: y - 8 * s, width: 24 * s, height: 16 * s, rx: 7 * s, fill: C.snow }],
      ['circle', { cx: x, cy: y - 1 * s, r: 3.5 * s, fill: C.pink }]]);
  }
  const cakeSpot = i => [-30 + 15 * i, -30 - (i % 2) * 9];

  function drawMom(T, g0, { basket = false } = {}) {
    const { el, paper } = T, P = {};
    const g = el('g', {}, g0); // 임시 도형 (그림이 있으면 숨긴다)
    paper(g, [
      ['path', { d: 'M-42 -112 L42 -112 L64 0 L-64 0 Z', fill: C.lav }],
      ['rect', { x: -54, y: -152, width: 18, height: 58, rx: 9, fill: C.cream }],
      ['circle', { cx: -45, cy: -94, r: 9, fill: C.skin }],
      ['rect', { x: -40, y: -158, width: 80, height: 54, rx: 16, fill: C.cream }],
      ['path', { d: 'M-2 -142 L-22 -118 M-2 -142 L12 -112', stroke: C.bean, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }],
    ]);
    P.head = origin(el('g', {}, g), 0, -156);
    paper(P.head, [
      ['circle', { cx: 0, cy: -186, r: 32, fill: C.skin }],
      ['path', { d: 'M-33 -188 Q-32 -224 0 -224 Q32 -224 33 -188 Q20 -206 0 -206 Q-20 -206 -33 -188 Z', fill: C.hair }],
      ['circle', { cx: 30, cy: -210, r: 11, fill: C.hair }],
      ['circle', { cx: -11, cy: -186, r: 3.8, fill: C.ink }], ['circle', { cx: 11, cy: -186, r: 3.8, fill: C.ink }],
      ['circle', { cx: -19, cy: -175, r: 5.5, fill: C.pink, opacity: .85 }], ['circle', { cx: 19, cy: -175, r: 5.5, fill: C.pink, opacity: .85 }],
    ]);
    P.mouth = el('path', { d: 'M-8 -172 Q0 -166 8 -172', stroke: C.ink, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, P.head);
    P.smile = () => P.mouth.setAttribute('d', 'M-11 -174 Q0 -160 11 -174');
    P.scarf = paper(P.head, [['path', { d: 'M-37 -192 Q0 -240 37 -192 L39 -182 Q0 -218 -39 -182 Z', fill: C.snow }], ['path', { d: 'M32 -192 L54 -170 L40 -166 Z', fill: C.snow }]]);
    P.basket = el('g', { transform: 'translate(62,-96)', opacity: basket ? 1 : 0 }, g);
    el('rect', { x: -72, y: -84, width: 144, height: 116, fill: 'transparent' }, P.basket); // 누르기 쉬운 넓은 자리
    paper(P.basket, [['path', { d: 'M-40 -26 Q0 -84 40 -26', stroke: C.bark, 'stroke-width': 6, fill: 'none' }]]);
    P.cakes = [0, 1, 2, 3, 4].map(i => { const [x, y] = cakeSpot(i); const c = drawCake(T, P.basket, x, y); c.setAttribute('opacity', 0); return c; });
    paper(P.basket, [['path', { d: 'M-46 -28 H46 L36 12 H-36 Z', fill: C.gold }], ['path', { d: 'M-40 -14 H40 M-38 -2 H38', stroke: '#B88A3A', 'stroke-width': 3 }]]);
    P.setCakes = n => P.cakes.forEach((c, i) => c.setAttribute('opacity', i < n ? 1 : 0));
    P.arm = origin(paper(g, [['rect', { x: 36, y: -152, width: 18, height: 58, rx: 9, fill: C.cream }], ['circle', { cx: 45, cy: -94, r: 9, fill: C.skin }]]), 45, -146);
    /* 그림: 손 흔드는 엄마(정면) / 떡 바구니 든 엄마(그림은 오른쪽을 봄 → 뒤집어 넣는다).
       바구니 그림에는 떡이 늘 담겨 있어서 떡 칸(setCakes)은 임시 도형에서만 보인다 */
    P.art = poseArt(T, g0, { wave: ['mom_wave', ...SZ.mom_wave], basket: ['mom_basket', ...SZ.mom_basket, { flip: true }] });
    P.basketAt = [62, -96]; // 떡이 날아가 닿는 바구니 자리 (발끝 기준)
    P.holdBasket = on => { P.basket.setAttribute('opacity', on ? 1 : 0); if (P.art) P.art.set(on ? 'basket' : 'wave'); };
    if (P.art) {
      g.style.display = 'none';
      P.basketAt = [-SZ.mom_basket[0] * (.75 - .5), -SZ.mom_basket[1] * (1 - .60)]; // 그림 속 바구니 가운데 (뒤집힌 그림)
      P.arm = el('g', {}, g0); // 팔 흔들기는 그림에 없음 → 빈 그룹 (wave()가 몸을 살랑)
      P.holdBasket(basket);
    }
    return P;
  }
  /* 손 흔들기: 임시 도형은 팔을 돌리고, 그림은 몸을 살랑 */
  const wave = (T, a) => (a.P.art ? a.wiggle(5, 900) : waveArm(T, a.P.arm));

  function drawKid(T, g0, girl) {
    const { el, paper } = T, P = {};
    const g = el('g', {}, g0); // 임시 도형 (그림이 있으면 숨긴다)
    const top = girl ? C.pink : C.gold;
    if (girl) paper(g, [['path', { d: 'M-30 -66 L30 -66 L40 0 L-40 0 Z', fill: C.lav }]]);
    else paper(g, [['rect', { x: -26, y: -54, width: 22, height: 54, rx: 8, fill: C.cream }], ['rect', { x: 4, y: -54, width: 22, height: 54, rx: 8, fill: C.cream }],
      ['ellipse', { cx: -15, cy: -3, rx: 14, ry: 6, fill: C.bark }], ['ellipse', { cx: 15, cy: -3, rx: 14, ry: 6, fill: C.bark }]]);
    paper(g, [['rect', { x: -30, y: -98, width: 60, height: 48, rx: 14, fill: top }], ['rect', { x: -42, y: -94, width: 14, height: 42, rx: 7, fill: top }],
      ['circle', { cx: -35, cy: -52, r: 7, fill: C.skin }]]);
    P.head = origin(el('g', {}, g), 0, -98);
    drawKidFace(T, P.head, girl, 0, -126, 1);
    P.arm = origin(paper(g, [['rect', { x: 28, y: -94, width: 14, height: 42, rx: 7, fill: top }], ['circle', { cx: 35, cy: -52, r: 7, fill: C.skin }]]), 35, -90);
    /* 그림: 서서 손 흔들기(정면) / 나무·줄 오르기 / 꼭 껴안기(오빠 배우에 둘이 함께 — 그동안 동생 배우는 숨긴다) */
    const k = girl ? 'girl' : 'boy';
    const defs = { stand: [k, ...SZ[k]] };
    if (!girl) {
      defs.climb = ['kids_climb', ...SZ.kids_climb, { dx: climbDx('kids_climb'), dy: ROPE_GAP }];
      defs.hug = ['kids_hug', ...SZ.kids_hug, { dx: -55 }];
      // 줄 오르기: 둘이 한 장 (오빠 배우에). 그림 아래끝 = 동생 발끝 (오빠 발끝보다 ROPE_GAP 아래), 줄 가운데가 x=0
      defs.rope = ['kids_rope', ...SZ.kids_rope, { dx: SZ.kids_rope[0] * (.5 - .486), dy: ROPE_GAP }];
    }
    P.art = poseArt(T, g0, defs);
    P.pose = pk => {
      if (!P.art) return;
      if (pk === 'rope' && !artUrl('kids_rope')) pk = 'climb'; // 둘이 함께 오르는 그림이 없으면 따로따로 오르기 자세
      if (girl && (pk === 'hug' || pk === 'rope' || (pk === 'climb' && artUrl('kids_climb')))) { g0.style.visibility = 'hidden'; return; }
      g0.style.visibility = '';
      P.art.set(pk);
    };
    if (P.art) { g.style.display = 'none'; P.arm = el('g', {}, g0); }
    return P;
  }
  /* 얼굴만 (해·달 얼굴, 우물 그림자에도 쓴다) */
  function drawKidFace(T, p, girl, cx, cy, s) {
    const f = T.el('g', { transform: `translate(${cx},${cy}) scale(${s})` }, p);
    /* 그림 얼굴 (서 있는 그림에서 머리만 오린 것): 얼굴 가운데가 (0,0) 쯤 오게 */
    const fu = artUrl(girl ? 'girl_face' : 'boy_face');
    if (fu) {
      const [w, h, y] = girl ? [96, 64, -44] : [73, 74, -49];
      T.el('image', { href: fu, x: -w / 2, y, width: w, height: h, filter: 'url(#pp)' }, f);
      return f;
    }
    const shapes = [
      ['circle', { cx: 0, cy: 0, r: 30, fill: C.skin }],
      ['path', { d: 'M-31 -2 Q-30 -34 0 -34 Q30 -34 31 -2 Q16 -18 0 -16 Q-16 -18 -31 -2 Z', fill: C.hair }],
      ['circle', { cx: -10, cy: 0, r: 3.8, fill: C.ink }], ['circle', { cx: 10, cy: 0, r: 3.8, fill: C.ink }],
      ['circle', { cx: -18, cy: 10, r: 5, fill: C.pink, opacity: .85 }], ['circle', { cx: 18, cy: 10, r: 5, fill: C.pink, opacity: .85 }],
      ['path', { d: 'M-7 13 Q0 19 7 13', stroke: C.ink, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }],
    ];
    if (girl) shapes.splice(2, 0, ['circle', { cx: -32, cy: 4, r: 10, fill: C.hair }], ['circle', { cx: 32, cy: 4, r: 10, fill: C.hair }],
      ['rect', { x: -38, y: 12, width: 12, height: 6, rx: 3, fill: C.bean }], ['rect', { x: 26, y: 12, width: 12, height: 6, rx: 3, fill: C.bean }]);
    else shapes.splice(2, 0, ['circle', { cx: 0, cy: -36, r: 8, fill: C.hair }]);
    T.paper(f, shapes);
    return f;
  }

  /* 호랑이: 감빛 통통한 아기 호랑이, 짙은 갈색 줄무늬 조각, 크림 주둥이, 동그란 큰 눈, 분홍 볼 */
  function drawTiger(T, g0) {
    const { el, paper } = T, P = {};
    const g = el('g', {}, g0); // 임시 도형 (그림이 있으면 숨긴다)
    P.tail = paper(g, [['path', { d: 'M48 -40 Q110 -40 104 -100 Q100 -128 118 -140', stroke: C.persimmon, 'stroke-width': 16, fill: 'none', 'stroke-linecap': 'round' }],
      ['circle', { cx: 118, cy: -140, r: 10, fill: C.stripe }]]);
    paper(g, [['ellipse', { cx: -30, cy: -14, rx: 25, ry: 16, fill: C.persimmon }], ['ellipse', { cx: 30, cy: -14, rx: 25, ry: 16, fill: C.persimmon }]]);
    P.torso = origin(paper(g, [
      ['ellipse', { cx: 0, cy: -72, rx: 58, ry: 64, fill: C.persimmon }],
      ['ellipse', { cx: 0, cy: -64, rx: 36, ry: 44, fill: C.cream }],
      ...[[-1, -92], [1, -92], [-1, -58], [1, -58]].map(([s, y]) => ['path', { d: `M${s * 58} ${y} L${s * 38} ${y + 6} L${s * 56} ${y + 14} Z`, fill: C.stripe }]),
    ]), 0, -10);
    P.torso.style.transition = 'transform .5s cubic-bezier(.3,1.7,.5,1)';
    P.setBelly = n => { P.torso.style.transform = `scale(${1 + .17 * n},${1 + .07 * n})`; };
    P.axe = origin(el('g', { opacity: 0 }, g), 56, -80);
    paper(P.axe, [['rect', { x: 50, y: -176, width: 12, height: 104, rx: 5, fill: C.bark }], ['path', { d: 'M62 -176 L96 -186 Q104 -160 96 -136 L62 -146 Z', fill: '#B9B4AC' }]]);
    paper(g, [['ellipse', { cx: -54, cy: -88, rx: 15, ry: 23, fill: C.persimmon }], ['ellipse', { cx: 54, cy: -88, rx: 15, ry: 23, fill: C.persimmon }]]);
    P.head = origin(el('g', {}, g), 0, -120);
    paper(P.head, [
      ['circle', { cx: -44, cy: -214, r: 19, fill: C.persimmon }], ['circle', { cx: -44, cy: -214, r: 9, fill: C.pink }],
      ['circle', { cx: 44, cy: -214, r: 19, fill: C.persimmon }], ['circle', { cx: 44, cy: -214, r: 9, fill: C.pink }],
      ['ellipse', { cx: 0, cy: -168, rx: 66, ry: 58, fill: C.persimmon }],
      ['path', { d: 'M-14 -225 L0 -198 L14 -225 Z', fill: C.stripe }],
      ['path', { d: 'M-66 -178 L-44 -171 L-66 -162 Z', fill: C.stripe }], ['path', { d: 'M66 -178 L44 -171 L66 -162 Z', fill: C.stripe }],
      ['ellipse', { cx: 0, cy: -144, rx: 36, ry: 24, fill: C.cream }],
      ['circle', { cx: -24, cy: -180, r: 16, fill: '#fff' }], ['circle', { cx: 24, cy: -180, r: 16, fill: '#fff' }],
      ['circle', { cx: -24, cy: -179, r: 10, fill: C.ink }], ['circle', { cx: 24, cy: -179, r: 10, fill: C.ink }],
      ['circle', { cx: -20, cy: -183, r: 3.8, fill: '#fff' }], ['circle', { cx: 28, cy: -183, r: 3.8, fill: '#fff' }],
      ['path', { d: 'M-9 -156 Q0 -147 9 -156 Q0 -162 -9 -156 Z', fill: C.stripe }],
      ['circle', { cx: -42, cy: -150, r: 9, fill: C.pink, opacity: .9 }], ['circle', { cx: 42, cy: -150, r: 9, fill: C.pink, opacity: .9 }],
    ]);
    P.mouth = el('path', { d: 'M-12 -140 Q-6 -133 0 -140 Q6 -133 12 -140', stroke: C.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, P.head);
    P.oMouth = () => P.mouth.setAttribute('d', 'M-7 -138 A7 8 0 1 0 7 -138 A7 8 0 1 0 -7 -138');
    P.scarf = paper(P.head, [['path', { d: 'M-64 -196 Q0 -262 64 -196 L66 -182 Q0 -230 -66 -182 Z', fill: C.snow }], ['path', { d: 'M56 -190 L86 -164 L66 -158 Z', fill: C.snow }]]);
    P.scarf.setAttribute('opacity', 0);
    P.bump = paper(P.head, [['circle', { cx: 16, cy: -226, r: 15, fill: '#F2A07A' }], ['path', { d: 'M8 -232 Q16 -240 24 -232', stroke: '#fff', 'stroke-width': 3, fill: 'none' }]]);
    P.bump.setAttribute('opacity', 0);
    /* 차림·자세: 코드가 호랑이 모습을 바꾸는 자리(엄마 옷 입기·도끼·미끄러짐·혹)에서 그림도 바뀐다.
       wear(k[, on]): 'scarf' | 'axe' | 'bump' — 임시 도형은 조각을 보이고, 그림은 자세를 고른다 */
    const st = { scarf: 0, axe: 0, bump: 0, slip: 0, belly: 1 };
    P.art = poseArt(T, g0, {
      stand: ['tiger', ...SZ.tiger], full: ['tiger_full', ...SZ.tiger_full], scarf: ['tiger_scarf', ...SZ.tiger_scarf],
      axe: ['tiger_axe', ...SZ.tiger_axe, { flip: true }], slip: ['tiger_slip', ...SZ.tiger_slip], bump: ['tiger_bump', ...SZ.tiger_bump],
    });
    const upd = () => {
      if (!P.art) return;
      const k = st.bump ? 'bump' : st.slip ? 'slip' : st.axe ? 'axe' : st.scarf ? 'scarf' : st.belly >= 3.3 ? 'full' : 'stand';
      P.art.set(k);
      // 떡을 먹을수록 선 그림을 옆으로 조금씩 불린다 (다 먹으면 배 볼록 그림으로)
      const e = P.art.el('stand');
      if (e) e.style.transform = k === 'stand' ? `scaleX(${(1 + .06 * (st.belly - 1)).toFixed(3)})` : '';
    };
    const part = { scarf: P.scarf, axe: P.axe, bump: P.bump };
    P.wear = (k, on = true) => { st[k] = on ? 1 : 0; part[k].setAttribute('opacity', on ? 1 : 0); upd(); };
    P.slip = on => { st.slip = on ? 1 : 0; upd(); };
    const setBelly0 = P.setBelly;
    P.setBelly = n => { setBelly0(n); st.belly = n; upd(); };
    /* 도끼 찍기: 임시 도형은 도끼를 휘두르고, 그림은 몸째 살짝 */
    P.chop = () => (P.art ? T.anim(P.art.el(P.art.cur), [{ rotate: '0deg' }, { rotate: '-7deg' }, { rotate: '0deg' }], 360)
      : T.anim(P.axe, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-40deg)' }, { transform: 'rotate(0deg)' }], 360));
    if (P.art) { g.style.display = 'none'; upd(); }
    return P;
  }
  const mk = (T, p, x, y, draw, s = 1, opt) => { let P; const a = T.actor(p, x, y, g => { P = draw(T, g, opt); }, { scale: s }); a.P = P; return a; };
  const mkMom = (T, p, x, y, s, opt) => mk(T, p, x, y, drawMom, s, opt);
  const mkBoy = (T, p, x, y, s = 1) => mk(T, p, x, y, drawKid, s, false);
  const mkGirl = (T, p, x, y, s = .9) => mk(T, p, x, y, drawKid, s, true);
  const TIGERS = []; // 대사 연출용: 장면마다 새로 만든 호랑이 배우 (가장 최근에 무대에 있는 호랑이가 말한다)
  const mkTiger = (T, p, x, y, s = 1) => { const a = mk(T, p, x, y, drawTiger, s); TIGERS.push(a); return a; };

  function drawHouse(T, p, x, y, s = 1) {
    const g = T.el('g', { transform: `translate(${x},${y}) scale(${s})` }, p);
    T.paper(g, [
      ['rect', { x: -190, y: -20, width: 380, height: 26, fill: C.stone }],
      ['rect', { x: -160, y: -180, width: 320, height: 162, fill: '#EAD9B4' }],
      ...[-160, -8, 146].map(x0 => ['rect', { x: x0, y: -180, width: 14, height: 162, fill: C.bark }]),
      ['rect', { x: -125, y: -150, width: 84, height: 130, fill: C.cream, stroke: C.bark, 'stroke-width': 5 }],
      ['path', { d: 'M-83 -150 V-20 M-125 -108 H-41 M-125 -64 H-41', stroke: C.bark, 'stroke-width': 3 }],
      ['rect', { x: 36, y: -142, width: 84, height: 70, fill: C.cream, stroke: C.bark, 'stroke-width': 5 }],
      ['path', { d: 'M-222 -168 Q-200 -292 0 -302 Q200 -292 222 -168 Q0 -148 -222 -168 Z', fill: C.gold }],
      ['path', { d: 'M-150 -252 Q0 -278 150 -252 M-190 -210 Q0 -232 190 -210', stroke: '#B88A3A', 'stroke-width': 6, fill: 'none' }],
    ]);
    return g;
  }

  /* 화면 고정 배지 (카메라 영향 없음) */
  function badge(T, x, y, r, drawIcon) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, document.getElementById('stage'));
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    drawIcon(g);
    g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
    return g;
  }

  /* ================= 배경 ================= */
  function sky(T, p, fill, extra = {}) { return T.el('rect', { x: -1400, y: -1400, width: 5600, height: 3400, fill, ...extra }, p); }
  function stars(T, p, list, r = 4) { list.forEach(([x, y]) => T.el('circle', { cx: x, cy: y, r, fill: C.cream, opacity: .9 }, p)); }
  function houseBG(T) {
    const { paper } = T, b = T.bg;
    if (bgImage(T, b, 'cottage', { back: '#5a3a14' })) return; // 초가집·울타리·감나무가 다 그림에 있다
    sky(T, b, '#F2E3B8');
    T.el('circle', { cx: 140, cy: 110, r: 50, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-300 330 Q60 170 330 290 Q620 150 1300 300 V700 H-300 Z', fill: '#8FAE82' }]]);
    paper(b, [['path', { d: 'M-300 400 Q300 330 1300 390 V900 H-300 Z', fill: C.leaf }]]);
    paper(b, [['rect', { x: -300, y: 470, width: 1600, height: 500, fill: '#C9A86A' }]]);
    for (let i = 0; i < 7; i++) paper(b, [['rect', { x: 20 + i * 26, y: 380, width: 12, height: 100, rx: 5, fill: C.bark }]]);
    paper(b, [['rect', { x: 10, y: 405, width: 190, height: 10, fill: C.bark }]]);
    drawHouse(T, b, 690, 490, 1);
  }
  function kitchenBG(T) {
    const { paper, el } = T, b = T.bg;
    if (bgImage(T, b, 'kitchen', { back: '#1e1700' })) return true; // 가마솥·부뚜막·상이 그림에 있다
    sky(T, b, '#E9D3A8');
    for (let i = 0; i < 6; i++) paper(b, [['rect', { x: -40 + i * 200, y: -20, width: 26, height: 420, fill: C.bark }]]);
    paper(b, [['rect', { x: -300, y: 60, width: 1600, height: 22, fill: C.bark }]]);
    paper(b, [['rect', { x: -300, y: 400, width: 1600, height: 500, fill: '#B98F4A' }]]);
    paper(b, [['path', { d: 'M820 400 V250 Q820 220 850 220 H990 Q1020 220 1020 250 V400 Z', fill: '#A0634A' }],
      ['ellipse', { cx: 920, cy: 222, rx: 96, ry: 26, fill: C.ink }], ['rect', { x: 900, y: 186, width: 40, height: 16, rx: 6, fill: C.ink }]]);
    [[880, 150], [930, 110], [900, 70]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 22, fill: C.cream, opacity: .7 }, b));
    paper(b, [['ellipse', { cx: 690, cy: 420, rx: 190, ry: 40, fill: C.bark }], ['rect', { x: 560, y: 420, width: 24, height: 90, fill: C.bark }],
      ['rect', { x: 800, y: 420, width: 24, height: 90, fill: C.bark }], ['ellipse', { cx: 690, cy: 410, rx: 190, ry: 36, fill: '#8A6040' }]]);
  }
  const HILL = [{ sky: '#F2C98A', far: '#C9A36A', near: '#A88A52', road: '#E6CFA0' }, { sky: '#E8906A', far: '#B06A5A', near: '#8C6048', road: '#D9B48A' },
    { sky: '#4A4A80', far: '#34386A', near: '#3E4466', road: '#8C88A8' }];
  /* 고개 그림: 좌우를 뒤집어 바위를 오른쪽(호랑이 자리)에 둔다. 길·팻말·바위가 다 그림에 있다.
     돌려주는 rock은 그림 속 바위를 오려 배우 앞에 둔 가림막 (호랑이가 그 뒤에서 불쑥) */
  function hillArt(T, n) {
    const b = T.bg, k = 'hill' + n;
    if (!bgImage(T, b, k, { flip: true, back: n === 2 ? '#0b0d1c' : '#1a0f06' })) return null;
    if (n === 2) { T.el('circle', { cx: 150, cy: 70, r: 34, fill: C.cream, opacity: .92 }, b); stars(T, b, [[300, 40], [460, 90], [600, 30], [840, 60], [960, 110], [60, 140]], 3.5); }
    return bgCutout(T, T.world, bgUrl(k), FULL, HILL_ROCK, { transform: 'matrix(-1,0,0,1,1000,0)' });
  }
  function hillBG(T, n) {
    const { paper, el } = T, b = T.bg, h = HILL[n];
    sky(T, b, h.sky);
    if (n < 2) el('circle', { cx: 150 + n * 40, cy: 150 + n * 110, r: 56, fill: n ? '#F2B366' : '#F6D98A' }, b);
    else { el('circle', { cx: 150, cy: 100, r: 36, fill: C.cream }, b); stars(T, b, [[300, 60], [420, 130], [560, 50], [860, 90], [960, 170], [60, 220]]); }
    paper(b, [['path', { d: 'M-300 330 Q150 120 480 280 Q760 140 1300 310 V700 H-300 Z', fill: h.far }]]);
    paper(b, [['path', { d: 'M-300 420 Q300 300 1300 400 V900 H-300 Z', fill: h.near }]]);
    paper(b, [['path', { d: 'M-300 540 Q200 470 560 490 Q860 505 1300 470 V600 Q860 560 560 560 Q200 560 -300 610 Z', fill: h.road }]]);
    [[40, 420], [960, 420]].forEach(([x, y]) => paper(b, [['rect', { x: x - 8, y: y - 20, width: 16, height: 40, fill: C.bark }], ['path', { d: `M${x - 50} ${y - 16} L${x} ${y - 150} L${x + 50} ${y - 16} Z`, fill: n === 2 ? '#2E4A3C' : C.pine }]]));
    paper(b, [['rect', { x: 165, y: 380, width: 10, height: 90, fill: C.bark }], ['rect', { x: 115, y: 380, width: 110, height: 44, rx: 6, fill: C.cream, stroke: C.bark, 'stroke-width': 4 }],
      ['text', { x: 170, y: 411, 'text-anchor': 'middle', 'font-size': 24, fill: C.bark, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: ['첫째 고개', '둘째 고개', '셋째 고개'][n] }]]);
  }
  function drawRock(T, p) { return T.paper(p, [['path', { d: 'M700 760 L702 470 Q695 368 800 352 Q920 344 936 440 L938 760 Z', fill: '#8A8278' }], ['path', { d: 'M740 400 Q800 380 860 392', stroke: '#A8A094', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }]]); }
  function roomBG(T) {
    const { paper } = T, b = T.bg;
    if (bgImage(T, b, 'room', { back: '#191417' })) return; // 불 켜진 방·창호지 문이 그림에 있다
    sky(T, b, '#C9A77A');
    paper(b, [['rect', { x: -300, y: 430, width: 1600, height: 500, fill: '#D9A060' }], ['rect', { x: -300, y: 424, width: 1600, height: 12, fill: C.bark }]]);
    paper(b, [['rect', { x: 250, y: 90, width: 250, height: 190, fill: C.night, stroke: C.bark, 'stroke-width': 10 }],
      ['circle', { cx: 440, cy: 140, r: 24, fill: C.cream }], ['path', { d: 'M375 90 V280 M250 185 H500', stroke: C.bark, 'stroke-width': 6 }]]);
  }
  function doorBG(T) {
    const { paper, el } = T, b = T.bg;
    if (panelWall(T, b, { x0: -400 + 500 % (PANEL[0] * 560 / 720) })) return true; // 그림: 창호지 문 여러 짝 (등잔불에 비친 방 벽)
    sky(T, b, '#C9A77A');
    paper(b, [['rect', { x: -300, y: 470, width: 1600, height: 500, fill: '#D9A060' }]]);
    paper(b, [['rect', { x: 500, y: 60, width: 380, height: 420, fill: C.cream, stroke: C.bark, 'stroke-width': 14 }]]);
    for (let i = 1; i < 4; i++) el('rect', { x: 500 + i * 95 - 3, y: 60, width: 6, height: 420, fill: C.bark }, b);
    for (let i = 1; i < 5; i++) el('rect', { x: 500, y: 60 + i * 84 - 3, width: 380, height: 6, fill: C.bark }, b);
    el('rect', { x: 687, y: 60, width: 8, height: 420, fill: C.bark }, b);
  }

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, camTo, camWide, camSnap } = T;
    const stageWrap = T.root.querySelector('#stageWrap');

    /* 배경 그림 미리 불러오기: 첫 장면 그림만 기다리고(최대 2.5초) 나머지는 뒤에서. 없는 파일은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads[k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    const artLoads = {};
    Object.keys(ART).filter(k => ART[k]).forEach(k => { artLoads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    // 첫 장면 배우(엄마·오누이) 그림도 함께 기다린다 — 못 불러온 그림은 그레이박스로
    await Promise.race([Promise.all([loads.cottage, artLoads.mom_wave, artLoads.boy, artLoads.girl].filter(Boolean)), sleep(2500)]);

    /* ====== 1막 — 떡 고개 ====== */
    /* --- 1. 오막살이 아침 --- */
    houseBG(T);
    const mom = mkMom(T, T.world, 610, 500, 1, { basket: false });
    const PT = T.portrait(); // 세로 화면(양옆이 잘림)이면 인물을 가운데 쪽으로
    let boy = mkBoy(T, T.world, PT ? 330 : 250, 510), girl = mkGirl(T, T.world, PT ? 425 : 355, 510);
    /* 대사 연출: 목소리 주인에게 카메라가 가고 화자·청자가 마주 본다.
       mkView(뒷마당·나무·하늘) 안의 배우는 좌표계가 달라서 빼고, T.world에 바로 있는 배우만 잡는다 */
    TIGERS.length = 0;
    const onWorld = a => (a && a.pos.parentNode === T.world ? a : null);
    const tigerNow = () => onWorld([...TIGERS].reverse().find(a => a.pos.isConnected));
    T.director({
      cast: { mom: () => onWorld(mom), boy: () => onWorld(boy), girl: () => onWorld(girl), tiger: tigerNow },
      listener: r => r === 'tiger' ? (onWorld(mom) ? 'mom' : 'boy') : r === 'mom' ? 'boy' : tigerNow() ? 'tiger' : r === 'boy' ? 'girl' : 'boy',
    });
    await T.curtain(true);
    await say('옛날 옛날 산골 오막살이에 엄마와 오누이가 살았어요.');
    await say('엄마가 일하러 가요. 오누이를 톡 눌러서 인사해요!');
    for (const k of [boy, girl]) {
      await T.tap(k.pos, { prompt: '오빠랑 동생을 톡 눌러서 "다녀오세요!" 해 봐요!' });
      AudioFX.pop(); k.hop(26); wave(T, k); T.pop(k.x, k.y - 200, '안녕!', C.pine);
      await sleep(500);
    }
    wave(T, mom);
    await say('엄마가 말했어요. "문 꼭 잠그고 엄마 기다려라~"');
    mom.face('right');
    await mom.move(1180, 500, 1800);

    /* --- 2. 떡 받아 오기 (부잣집 부엌) ---
       세 고개 수 놀이(2지선다): 첫째 1~5개, 둘째 1~10개, 셋째 = 남은 떡(1~5개). 부엌에서는 그 합계만큼 받는다 */
    const NUMS = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
    const CNT = ['한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열']; // "개" 앞에서는 한·두·세·네 (하나 개 ✕)
    const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const ASKS = [rint(1, 5), rint(1, 10), rint(1, 5)];
    const TOTAL = ASKS[0] + ASKS[1] + ASKS[2];
    let plateCakes = [];
    await T.sceneCard('부잣집 부엌', () => {
      T.clear();
      // 그림 부엌: 상 위의 그림 떡 접시를 이 접시가 덮는다 (떡이 줄면 그림 떡도 안 보이게)
      const [dx, dy, ry] = kitchenBG(T) ? [-45, -148, 34] : [0, 0, 26];
      T.world.appendChild(mom.pos); mom.setScale(1.4); mom.place(PT && mom.P.art ? 350 : 290, 545); mom.face('right'); mom.P.holdBasket(!mom.P.art); mom.P.setCakes(0); // 그림: 첫 떡이 닿으면 바구니를 든다
      const plate = el('g', { id: 'plate' }, T.world);
      el('rect', { x: 560 + dx, y: 300 + dy, width: 260, height: 140, fill: 'transparent' }, plate);
      T.paper(plate, [['ellipse', { cx: 690 + dx, cy: 400 + dy, rx: 110, ry, fill: C.snow, stroke: C.gold, 'stroke-width': 5 }]]);
      plateCakes = [[630, 394], [690, 396], [750, 394], [660, 370], [720, 370]].map(([x, y]) => ({ x: x + dx, y: y + dy, g: drawCake(T, plate, x + dx, y + dy, 1.8) }));
    });
    await say('엄마는 부잣집에서 하루 종일 부지런히 일했어요.');
    await say('"수고했어요. 떡 가져가요!" 떡을 톡톡 눌러서 바구니에 담아요!');
    const toBasket = i => {
      const [bx, by] = mom.P.art ? [0, -12] : cakeSpot(i), [ax, ay] = mom.P.basketAt;
      return [mom.x + mom.flip * (ax + bx) * mom.scale, mom.y + (ay + by) * mom.scale];
    };
    const fly = async (x0, y0, x1, y1, s = 1.4, dur = 600) => {
      const g = el('g', {}, T.fx); drawCake(T, g, 0, 0, s);
      const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 140;
      await T.anim(g, [{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${mx}px,${my}px) rotate(180deg)` }, { transform: `translate(${x1}px,${y1}px) rotate(360deg)` }], { duration: dur, easing: 'ease-in-out' });
      g.remove();
    };
    let inBasket = 0;
    const showBasket = () => mom.P.setCakes(Math.min(5, Math.ceil(inBasket * 5 / TOTAL))); // 바구니 그림은 5칸 — 비율로 보여준다
    await T.mash(T.world.querySelector('#plate'), { count: 5, prompt: '떡을 톡톡 눌러서 바구니에 담아요!', onStep: i => {
      const c = plateCakes[5 - i]; c.g.setAttribute('opacity', 0);
      const [x1, y1] = toBasket(i - 1);
      T.tone(500 + i * 90, .15, { type: 'triangle', vol: .18 });
      fly(c.x, c.y, x1, y1, 1.8, 450).then(() => { inBasket = Math.round(TOTAL * i / 5); showBasket(); mom.P.holdBasket(true); AudioFX.pop(); });
      T.pop(c.x, c.y - 90, '영차!', C.bean);
    } });
    await sleep(700);
    mom.P.smile();
    await say('떡을 바구니 가득 받았어요! "우리 아이들이 좋아하겠다!" 엄마는 서둘러 집으로 떠났어요.');

    /* 접시 고르기(2지선다): 화면 고정 접시 두 개. 떡 n개를 5개씩 줄 맞춰 놓고 아래에 숫자 */
    function cakePlate(n, x, y) {
      const g = el('g', { transform: `translate(${x},${y})` }, document.getElementById('stage'));
      T.paper(g, [['rect', { x: -150, y: -105, width: 300, height: 210, rx: 26, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }],
                  ['ellipse', { cx: 0, cy: 8, rx: 128, ry: 70, fill: '#B9844F', stroke: C.bark, 'stroke-width': 5 }]]); // 나무 쟁반: 흰 떡이 잘 보이게
      for (let k = 0; k < n; k++) {
        const row = Math.floor(k / 5), col = k % 5, inRow = Math.min(5, n - row * 5);
        drawCake(T, g, (col - (inRow - 1) / 2) * 48, (n > 5 ? -16 : 2) + row * 38, 1.55);
      }
      el('text', { y: 92, 'text-anchor': 'middle', 'font-size': 34, fill: C.bean, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: String(n) }, g);
      return g;
    }
    /* 호랑이 말풍선: 떡 그림 n개 + 숫자 (숫자를 몰라도 그림으로 맞출 수 있게) */
    function askBubble(n) {
      const g = el('g', {}, document.getElementById('stage'));
      const cols = Math.min(5, n), rows = Math.ceil(n / 5), w = cols * 44 + 120, h = 60 + rows * 34;
      T.paper(g, [['rect', { x: 500 - w / 2, y: 18, width: w, height: h, rx: 22, fill: C.cream, stroke: C.gold, 'stroke-width': 6 }]]);
      for (let k = 0; k < n; k++) drawCake(T, g, 500 - w / 2 + 48 + (k % 5) * 44, 50 + Math.floor(k / 5) * 34, 1.45);
      el('text', { x: 500 + w / 2 - 38, y: 18 + h / 2 + 15, 'text-anchor': 'middle', 'font-size': 42, fill: C.bean, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: String(n) }, g);
      return g;
    }
    /* 오답 개수: 정답과 1~3 차이, 범위 안 */
    const decoy = (n, max) => { const opts = [n - 1, n + 1, n - 2, n + 2, n + 3].filter(v => v >= 1 && v <= max && v !== n); return opts[Math.floor(Math.random() * Math.min(opts.length, 2))]; };
    async function pickPlate(n, max, where) {
      const okLeft = Math.random() < .5;
      const good = cakePlate(n, okLeft ? 250 : 750, 400), bad = cakePlate(decoy(n, max), okLeft ? 750 : 250, 400);
      T.fitRow([good, bad]); // 세로 화면: 보이는 폭 안으로
      await T.choose([{ el: good, ok: true }, { el: bad, ok: false }], { prompt: '떡 접시를 골라 톡 눌러요!',
        where, who: '반짝이는 접시예요! 톡 눌러 봐요!' });
      AudioFX.ding();
      await T.anim(good, [{ scale: '1' }, { scale: '1.12' }, { scale: '1' }], 360);
      good.remove(); bad.remove();
    }

    /* --- 3·4. 첫째·둘째·셋째 고개: 호랑이가 달라는 만큼 떡 접시 고르기 --- */
    const tiger = mkTiger(T, T.world, 700, 610);
    tiger.pos.remove(); // 미리 만들어만 두고, 고개 장면이 열릴 때(아래 sceneCard 안에서) 무대에 올린다 — 부엌에 호랑이가 비치지 않게
    let rock, given = 0, TX = 820, hideY = 610;
    for (let n = 0; n < 3; n++) {
      await T.sceneCard(['첫째 고개', '둘째 고개', '셋째 고개'][n], () => {
        T.clear(); camSnap(500, 280, 1);
        rock = null;
        if (bgUrl('hill' + n)) {
          // 그림 속 바위(무대 x 540~830, 꼭대기 y≈405) 뒤: 귀 끝까지 숨도록 조금 더 아래에서 기다린다
          TX = 664; hideY = 662;
          T.world.appendChild(tiger.pos); tiger.place(TX, hideY);
          rock = hillArt(T, n);
        }
        if (!rock) {
          hillBG(T, n);
          TX = T.portrait() ? 690 : 820; hideY = 610; // 세로 화면: 호랑이가 보이는 폭 안에서 불쑥
          T.world.appendChild(tiger.pos); tiger.place(TX, hideY);
          rock = drawRock(T, T.world);
          if (TX !== 820) rock.setAttribute('transform', `translate(${TX - 820} 0)`);
        }
        T.world.appendChild(mom.pos); mom.setScale(1); mom.place(-120, 500); mom.face('right');
      });
      if (n === 0) await say('해가 뉘엿뉘엿 지고 있어요. 엄마가 첫째 고개를 넘어요.');
      else if (n === 1) await say('하늘이 붉어졌어요. 엄마가 둘째 고개를 넘어요.');
      else await say('깜깜한 밤이 되었어요. 엄마가 셋째 고개를 넘어요.');
      await mom.move(T.portrait() ? 370 : 300, 500, 1500);
      await sleep(300);
      AudioFX.boing(); T.pop(TX, 250, n ? '또 왔어!' : '불쑥!', C.bean);
      await tiger.move(TX, 480, 380, 'ease-out');
      await sleep(250);
      T.world.appendChild(tiger.pos); AudioFX.boing();
      await Promise.all([tiger.move(T.portrait() ? 610 : 630, 500, 500), tiger.hop(50, 500)]);
      await camTo(630, 330, 1.6, 600); // (기계음 으르렁은 뺐다: 호랑이 목소리 "어흥!"과 겹침)
      const ask = ASKS[n];
      if (n < 2) {
        await say(`"어흥! 떡 ${CNT[ask - 1]} 개 주면 안 잡아먹지!"`);
        await camWide(600);
        const bub = askBubble(ask);
        await say(`호랑이가 떡 ${CNT[ask - 1]} 개를 달래요. 어느 접시를 줄까요?`);
        await pickPlate(ask, n === 0 ? 5 : 10, '호랑이 말풍선의 떡이랑 똑같이 생긴 접시를 골라요!');
        bub.remove();
      } else {
        await say('"어흥! 남은 떡 몽땅 주면 안 잡아먹지!"');
        await camWide(600);
        // 바구니에 남은 떡을 보여주고, 나머지는 몇 개인지 고른다
        const ui = document.getElementById('stage');
        const left = el('g', {}, ui);
        const w = Math.min(5, ask) * 50 + 80;
        T.paper(left, [['path', { d: `M${500 - w / 2} 40 H${500 + w / 2} L${500 + w / 2 - 24} 150 H${500 - w / 2 + 24} Z`, fill: '#C9975E', stroke: C.bark, 'stroke-width': 5 }]]);
        for (let k = 0; k < ask; k++) drawCake(T, left, 500 - (Math.min(5, ask) - 1) * 25 + (k % 5) * 50, 78 + Math.floor(k / 5) * 40, 1.5);
        await say('바구니에 남은 떡은 몇 개일까요? 세어 보고 접시를 골라요!');
        await pickPlate(ask, 5, '바구니에 남은 떡이랑 똑같은 개수의 접시를 골라요!');
        left.remove();
      }
      // 고른 만큼 호랑이에게 날아간다
      for (let k = 0; k < ask; k++) {
        const [x0, y0] = toBasket(Math.max(0, Math.min(4, Math.ceil((TOTAL - given) * 5 / TOTAL) - 1)));
        given++; inBasket = TOTAL - given; showBasket();
        T.pop(tiger.x - 60, tiger.y - 300, NUMS[k], C.bean);
        await fly(x0, y0, tiger.x, tiger.y - 140, 1.4, 360);
        AudioFX.chomp();
        tiger.P.setBelly(1 + (given / TOTAL) * 2.4);
        tiger.wiggle(4, 220);
      }
      AudioFX.gulp && AudioFX.gulp();
      await say([`호랑이는 떡 ${CNT[ASKS[0] - 1]} 개를 꿀꺽! 배가 볼록해졌어요.`, `떡 ${CNT[ASKS[1] - 1]} 개를 또 꿀꺽! 배가 더 볼록해졌어요.`, '남은 떡을 몽땅 꿀꺽! 배가 빵빵해졌어요!'][n]);
      if (n < 2) { AudioFX.whoosh(); tiger.face('right'); await Promise.all([tiger.move(1250, 500, 900, 'ease-in'), tiger.hop(30, 450)]); tiger.face('left'); mom.face('right'); await mom.move(1180, 500, 1400); }
    }

    /* --- 5. 떡이 떨어지자 (원작: 엄마를 잡아먹는다 — 화면에는 보여주지 않는다) --- */
    await say('떡이 다 떨어지자 호랑이가 말했어요. "떡이 없으면 너를 잡아먹어야지!"');
    T.shake(); // 기계음 으르렁 대신 컷의 호랑이 목소리 "어흥!"
    await T.cut(svg => {
      el('rect', { width: 400, height: 300, fill: '#0b0a1a' }, svg);
      el('circle', { cx: 320, cy: 70, r: 34, fill: C.cream, opacity: .8 }, svg);
      const g = el('g', { transform: 'translate(200,300) scale(1.5)', opacity: .92 }, svg);
      drawTiger(T, g);
      el('rect', { width: 400, height: 300, fill: '#0b0a1a', opacity: .55 }, svg);
      el('text', { x: 200, y: 60, 'text-anchor': 'middle', 'font-size': 52, fill: C.persimmon, stroke: '#fff', 'stroke-width': 7, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '어흥!' }, svg);
      cutVoice('cut_roar');
    }, { sfx: 'boom', hold: 2400 });
    mom.pos.remove();
    AudioFX.gulp && AudioFX.gulp();
    await T.cut(svg => {
      el('rect', { width: 400, height: 300, fill: '#0b0a1a' }, svg);
      el('text', { x: 200, y: 165, 'text-anchor': 'middle', 'font-size': 56, fill: C.cream, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '꿀꺽…' }, svg);
    }, { hold: 2200 });
    await say('호랑이는 엄마를 꿀꺽 잡아먹고 말았어요.');
    tiger.P.wear('scarf');
    await T.cut(svg => {
      const g = el('g', { transform: 'translate(200,290) scale(1)' }, svg);
      const P = drawTiger(T, g); P.wear('scarf'); P.setBelly(2.5);
      el('text', { x: 200, y: 44, 'text-anchor': 'middle', 'font-size': 30, fill: C.bean, stroke: '#fff', 'stroke-width': 6, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '엄마 흉내 내야지~' }, svg);
      cutVoice('cut_mimic', 450);
    }, { sfx: 'whoosh', hold: 2600 });
    await say('호랑이는 엄마 옷을 입고, 오누이가 기다리는 집으로 갔어요.');
    tiger.face('right');
    await tiger.move(1250, 480, 1500, 'ease-in');
    tiger.face('left');

    /* ====== 2막 — 문 앞의 호랑이 ====== */
    /* --- 6. 엄마 기다리기 (등잔) --- */
    let dark, lamp, flame, glow;
    await T.sceneCard('오누이의 밤', () => {
      T.clear(); roomBG(T);
      T.world.appendChild(boy.pos); boy.setScale(1.05); boy.place(340, 520);
      T.world.appendChild(girl.pos); girl.setScale(.95); girl.place(450, 520);
      glow = el('circle', { cx: 760, cy: 380, r: 320, fill: C.amber, opacity: 0 }, T.fx);
      dark = el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: '#0B1030', opacity: .72 }, T.fx);
      lamp = el('g', {}, T.fx);
      el('rect', { x: 680, y: 290, width: 160, height: 250, fill: 'transparent' }, lamp);
      if (sprite(T, el('g', { transform: 'translate(760 522)' }, lamp), 'lamp_off', 151, 230)) {
        // 그림 등잔: 끈 등잔 위에 불 켠 등잔(같은 틀)을 겹쳐 두고, 켜면 보인다
        flame = el('g', {}, lamp); sprite(T, el('g', { transform: 'translate(760 522)' }, flame), 'lamp_on', 151, 230);
      } else {
        T.paper(lamp, [['rect', { x: 750, y: 380, width: 20, height: 130, fill: C.bark }], ['ellipse', { cx: 760, cy: 510, rx: 50, ry: 14, fill: C.bark }],
          ['ellipse', { cx: 760, cy: 378, rx: 40, ry: 12, fill: C.gold }]]);
        flame = T.paper(lamp, [['path', { d: 'M760 300 Q788 340 760 370 Q732 340 760 300 Z', fill: C.amber }], ['path', { d: 'M760 326 Q772 346 760 362 Q748 346 760 326 Z', fill: C.cream }]]);
      }
      flame.setAttribute('opacity', 0);
    });
    await say('캄캄한 밤이 되었어요. 엄마는 아직 안 오셨어요.');
    await say('등잔을 톡 눌러서 불을 켜 줄까요?');
    await T.tap(lamp, { prompt: '등잔을 톡 눌러서 불을 켜요!' });
    AudioFX.ding(); flame.setAttribute('opacity', 1);
    T.anim(dark, [{ opacity: .72 }, { opacity: .1 }], 900); T.anim(glow, [{ opacity: 0 }, { opacity: .22 }], 900);
    await sleep(900);
    await say('반짝! 방이 환해졌어요. 오누이는 창밖을 보며 엄마를 기다렸어요.');

    /* --- 7. 문 앞 ① 목소리 --- */
    await T.sceneCard('똑똑똑', () => {
      T.clear(); doorBG(T);
      const sil = el('g', { opacity: .3 }, T.bg);
      [['ellipse', { cx: 690, cy: 400, rx: 80, ry: 80 }], ['ellipse', { cx: 690, cy: 270, rx: 72, ry: 62 }], ['circle', { cx: 638, cy: 212, r: 20 }], ['circle', { cx: 742, cy: 212, r: 20 }], ['path', { d: 'M760 420 Q830 420 822 350 Q818 320 838 310', stroke: C.stripe, 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }]].forEach(([t, a]) => el(t, { fill: C.stripe, ...a }, sil));
      el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: C.amber, opacity: .12 }, T.fx);
      T.world.appendChild(boy.pos); boy.place(PT ? 330 : 210, 540);
      T.world.appendChild(girl.pos); girl.place(PT ? 430 : 320, 540);
    });
    AudioFX.thud(); await sleep(250); AudioFX.thud(); // (기계음 호랑이 소리는 뺐다: 호랑이 목소리와 겹침)
    [0, 260, 520].forEach(t => setTimeout(() => AudioFX.sfx('knock'), t));
    await say('똑똑똑. "얘들아~ 엄마 왔다. 문 열어라~" 걸걸한 목소리예요.');
    await say('엄마 목소리는 어땠지? 두 소리를 들어 봐요.');
    const soft = badge(T, 140, 250, 80, g => {
      el('path', { d: 'M-46 4 Q-34 -18 -22 4 T2 4 T26 4 T50 4', stroke: C.lav, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }, g);
      el('circle', { cx: 14, cy: -34, r: 9, fill: C.pink }, g); el('rect', { x: 19, y: -64, width: 5, height: 32, fill: C.pink }, g);
      el('circle', { cx: -22, cy: 38, r: 7, fill: C.pink }, g);
    });
    const rough = badge(T, 860, 250, 80, g => {
      el('path', { d: 'M-48 10 L-32 -20 L-16 16 L0 -26 L16 18 L32 -22 L48 8', stroke: C.bark, 'stroke-width': 11, fill: 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
      el('path', { d: 'M-30 36 L-18 26 L-6 38 L6 26 L18 38 L30 26', stroke: C.stripe, 'stroke-width': 6, fill: 'none' }, g);
    });
    T.fitRow([soft, rough]); // 세로 화면: 보이는 폭 안으로
    const hear = (b, fn) => { fn(T); b.animate([{ scale: 1 }, { scale: 1.15 }, { scale: 1 }], { duration: 700 }); };
    soft.addEventListener('pointerdown', () => momVoice(T)); rough.addEventListener('pointerdown', () => tigerVoice(T));
    hear(soft, momVoice); await say('이건 부드러운 소리.');
    hear(rough, tigerVoice); await say('이건 걸걸한 소리.');
    await say('진짜 엄마 목소리는 어느 쪽일까요?');
    await T.choose([{ el: soft, ok: true },
      { el: rough, ok: false, onWrong: async () => { await say('"어흥~" 이건 걸걸한 목소리예요!'); } }],
    { prompt: '진짜 엄마 목소리를 톡 골라 봐요!', where: '엄마 목소리는 노래처럼 부드러웠어요.', who: '반짝이는 쪽이 엄마 목소리예요!' });
    soft.remove(); rough.remove();
    await say('맞아요! 엄마 목소리는 부드러워요. 그런데 문밖 목소리는 걸걸했지요?');
    await say('오빠가 말했어요. "우리 엄마 목소리가 아니에요! 손을 보여 주세요!"');

    /* --- 8. 문 앞 ② 손 --- */
    await T.sceneCard('문틈으로 쑥', () => {
      T.clear();
      // 그림: 창호지 문 두 짝이 가운데(x 500)에서 만나고 그 틈이 살짝 벌어져 있다 (조금 가까이: 배율 1)
      if (panelWall(T, T.bg, { k: 1, y0: -80, gapAt: 500 })) { el('rect', { x: 490, y: -300, width: 20, height: 1200, fill: '#1c1830' }, T.bg); return; }
      sky(T, T.bg, '#C9A77A');
      T.paper(T.bg, [['rect', { x: -300, y: -300, width: 790, height: 1200, fill: C.cream }], ['rect', { x: 510, y: -300, width: 790, height: 1200, fill: C.cream }]]);
      for (let i = -2; i < 7; i++) { el('rect', { x: -300, y: i * 110, width: 790, height: 7, fill: C.bark }, T.bg); el('rect', { x: 510, y: i * 110, width: 790, height: 7, fill: C.bark }, T.bg); }
      el('rect', { x: 490, y: -300, width: 20, height: 1200, fill: C.ink }, T.bg);
      el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: C.amber, opacity: .12 }, T.fx);
    });
    await say('진짜 엄마 손은 뭘까요? 잘 보고 골라 봐요!');
    const handMom = badge(T, 190, 320, 112, g => {
      T.paper(g, [['ellipse', { cx: 0, cy: 22, rx: 38, ry: 42, fill: C.skin }],
        ...[-27, -9, 9, 27].map((x, i) => ['rect', { x: x - 7, y: -58 + Math.abs(i - 1.5) * 8, width: 14, height: 60, rx: 7, fill: C.skin }]),
        ['rect', { x: 30, y: -2, width: 13, height: 44, rx: 6.5, fill: C.skin, transform: 'rotate(-35 36 20)' }]]);
      [[-12, 20], [10, 34], [-4, 44], [16, 8], [-22, -30]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 4, fill: '#fff' }, g));
    });
    const handStripe = badge(T, 500, 320, 112, g => {
      T.paper(g, [['path', { d: 'M-60 10 L-66 0 L-58 -8 L-62 -20 L-50 -26 L-50 -40 L-36 -40 L-30 -54 L-16 -46 L0 -58 L14 -46 L30 -54 L36 -40 L50 -40 L50 -26 L62 -20 L58 -8 L66 0 L60 10 L62 30 Q50 72 0 74 Q-50 72 -62 30 Z', fill: C.persimmon }]]);
      [[-34, -34], [-12, -44], [12, -44], [34, -34]].forEach(([x, y]) => el('ellipse', { cx: x, cy: y, rx: 14, ry: 16, fill: C.persimmon, stroke: C.stripe, 'stroke-width': 3 }, g));
      ['M-50 0 L-20 8 L-48 18 Z', 'M50 0 L20 8 L48 18 Z', 'M-40 40 L-12 44 L-36 54 Z', 'M40 40 L12 44 L36 54 Z', 'M-8 -10 L0 16 L8 -10 Z'].forEach(d => el('path', { d, fill: C.stripe }, g));
    });
    const handFlour = badge(T, 810, 320, 112, g => {
      T.paper(g, [['ellipse', { cx: 0, cy: 18, rx: 58, ry: 54, fill: C.snow, stroke: '#CFC8BA', 'stroke-width': 3 }]]);
      [[-36, -34], [-12, -46], [12, -46], [36, -34]].forEach(([x, y]) => {
        el('ellipse', { cx: x, cy: y, rx: 15, ry: 17, fill: C.snow, stroke: '#CFC8BA', 'stroke-width': 3 }, g);
        el('path', { d: `M${x - 6} ${y - 14} L${x} ${y - 42} L${x + 6} ${y - 14} Z`, fill: C.ink }, g);
      });
      el('ellipse', { cx: 0, cy: 24, rx: 24, ry: 18, fill: C.pink }, g);
      [[40, 44], [-44, 40]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 7, fill: C.persimmon }, g));
    });
    T.fitRow([handMom, handStripe, handFlour]); // 세로 화면: 보이는 폭 안으로
    await T.choose([{ el: handMom, ok: true },
      { el: handStripe, ok: false, onWrong: async () => { await T.anim(handStripe, [{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], 500); await say('"어? 털이 복슬복슬… 줄무늬도 있네!"'); } },
      { el: handFlour, ok: false, onWrong: async () => { await T.anim(handFlour, [{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], 500); await say('"어? 하얗긴 한데… 뾰족한 발톱이 있네!"'); } }],
    { prompt: '진짜 엄마 손을 톡 골라 봐요!', where: '엄마 손은 손가락이 길쭉하고 떡가루가 묻어 있어요.', who: '반짝이는 손이 엄마 손이에요!' });
    handMom.remove(); handStripe.remove(); handFlour.remove();
    await say('맞아요! 엄마 손은 부드럽고 떡가루가 묻어 있지요.');
    const paw = el('g', { transform: 'translate(500,320)' }, T.world);
    T.paper(paw, [['ellipse', { cx: 0, cy: 10, rx: 70, ry: 62, fill: C.snow }], ['ellipse', { cx: 0, cy: 20, rx: 28, ry: 20, fill: C.pink }]]);
    [-40, -14, 14, 40].forEach(x => { el('ellipse', { cx: x, cy: -44, rx: 16, ry: 18, fill: C.snow, stroke: '#CFC8BA', 'stroke-width': 3 }, paw); el('path', { d: `M${x - 6} -58 L${x} -86 L${x + 6} -58 Z`, fill: C.ink }, paw); });
    [[46, 50], [-50, 44], [0, 64]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 8, fill: C.persimmon }, paw));
    AudioFX.slide();
    await T.anim(paw, [{ transform: 'translate(500px,320px) scale(.1)' }, { transform: 'translate(500px,320px) scale(1.2)' }], { duration: 600, easing: 'cubic-bezier(.3,1.6,.5,1)' });
    paw.setAttribute('transform', 'translate(500,320) scale(1.2)'); paw.style.transform = '';
    await say('그런데 문틈으로 들어온 손은… 하얀 밀가루 사이로 발톱이 쏙! 엄마 손이 아니에요!');

    /* --- 9. 문 앞 ③ 창호지 들여다보기 --- */
    let peekCircle, rim, eye, spot;
    await T.sceneCard('창호지 구멍', () => {
      T.clear();
      // 그림: 창호지 문에 바짝 다가간 모습 (배율 1.25, 문 한 짝 가운데가 구멍 자리 x 500)
      if (!panelWall(T, T.bg, { k: 1.25, y0: -210, x0: 500 - 1.25 * 150 - 3 * 1.25 * 325 })) {
        sky(T, T.bg, C.cream);
        for (let i = -6; i < 14; i++) el('rect', { x: -300 + i * 150, y: -300, width: 9, height: 1200, fill: C.bark }, T.bg);
        for (let i = -3; i < 8; i++) el('rect', { x: -300, y: i * 150 + 40, width: 1600, height: 9, fill: C.bark }, T.bg);
        el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: C.amber, opacity: .12 }, T.bg);
      }
      const cp = el('clipPath', { id: 'peekHole' }, T.world);
      peekCircle = el('circle', { cx: 500, cy: 300, r: 0 }, cp);
      const inside = el('g', { 'clip-path': 'url(#peekHole)' }, T.world);
      el('rect', { x: 0, y: 0, width: 1000, height: 600, fill: C.persimmon }, inside);
      ['M180 60 L260 120 L170 150 Z', 'M820 60 L740 120 L830 150 Z', 'M150 380 L270 420 L160 470 Z', 'M850 380 L730 420 L840 470 Z', 'M470 30 L500 110 L530 30 Z'].forEach(d => el('path', { d, fill: C.stripe }, inside));
      el('circle', { cx: 230, cy: 520, r: 50, fill: C.pink, opacity: .9 }, inside);
      eye = origin(el('g', {}, inside), 500, 300);
      el('ellipse', { cx: 500, cy: 300, rx: 190, ry: 180, fill: '#fff' }, eye);
      el('circle', { cx: 500, cy: 310, r: 110, fill: C.ink }, eye);
      el('circle', { cx: 548, cy: 256, r: 34, fill: '#fff' }, eye);
      el('circle', { cx: 458, cy: 358, r: 14, fill: '#fff' }, eye);
      rim = el('circle', { cx: 500, cy: 300, r: 0, fill: 'none', stroke: '#E9DCC0', 'stroke-width': 18, 'stroke-dasharray': '10 6' }, T.world);
      spot = el('g', {}, T.world);
      el('rect', { x: 330, y: 170, width: 340, height: 260, fill: 'transparent' }, spot);
      el('circle', { cx: 500, cy: 300, r: 16, fill: C.bark, opacity: .35 }, spot);
    });
    await say('문밖에 누가 있는지 보고 싶어요. 창호지를 손가락으로 콕 뚫어 볼까요?');
    await T.tap(spot, { prompt: '창호지를 톡 눌러서 콕 뚫어 봐요!' });
    AudioFX.poke(); T.pop(620, 180, '콕!', C.bean); spot.remove();
    for (let r = 10; r <= 250; r += 12) { peekCircle.setAttribute('r', r); rim.setAttribute('r', r); await sleep(16); }
    await sleep(400);
    for (let k = 0; k < 2; k++) { await T.anim(eye, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.08)' }, { transform: 'scaleY(1)' }], 320); await sleep(150); }
    T.pop(820, 120, '깜빡깜빡', C.pine);
    await say('구멍 너머에 커다랗고 동그란 눈이 깜빡깜빡! 호랑이예요!');
    await say('오빠가 속삭였어요. "쉿, 뒷문으로 살금살금 도망가자!"');

    /* --- 10. 뒷마당 도망 --- */
    let yard, hideJar, bigJar, prowl;
    /* 뒷마당 그림(장독대 → 빨랫줄 → 우물 → 큰 나무)을 뒷마당 긴 세트 안에 1.75배로 깐다.
       그림 왼쪽 바깥(x<520)은 그레이박스 집 뒷문 자리. 좌표: 장독(숨는 곳) x≈575~795, 그림 끝 x=2270 */
    const YARD = bgUrl('backyard') ? { x: 520, y: -186, w: 1750, h: 1750 * 992 / 1760 } : null;
    const YJ = YARD ? { run1: 150, hide: [720, 660], out: [930, 850], run2: 250, prowl: [100, T.portrait() ? 760 : 840] }
      : { run1: 320, hide: [1110, 1050], out: [1330, 1250], run2: 330, prowl: [520, 900] };
    /* 맨 앞 큰 장독 (원본 픽셀): 뚜껑 → 어깨 → 몸통 → 밑동. 가림막은 밑동 아래 땅까지 */
    const JAR = [[97, 452], [228, 452], [240, 488], [272, 508], [274, 530], [262, 540], [276, 595], [268, 650], [240, 705]];
    const JAR_L = [[102, 705], [70, 650], [52, 595], [66, 540], [68, 530], [70, 508], [86, 488]];
    const yardCam = nb => {
      const x = T.portrait() ? nb + 40 : Math.max(500, nb + 180);
      return YARD ? Math.min(x, YARD.x + YARD.w - T.viewWidth() / 2) : x;
    };
    await T.sceneCard('뒷마당', () => {
      T.clear(); camSnap(500, 280, 1);
      yard = mkView(T, T.world);
      if (YARD) {
        // 그림 바깥 (왼쪽: 집 뒷문 자리, 오른쪽: 넓은 화면 여유) — 그림 가장자리 색에 맞춘 단색 띠
        sky(T, yard, '#03237a');
        T.el('path', { d: 'M-800 200 Q-420 120 -60 170 Q260 110 640 185 V700 H-800 Z', fill: '#1b2f78' }, yard);
        T.el('path', { d: 'M-800 280 Q-300 240 200 270 Q450 250 640 280 V700 H-800 Z', fill: '#0f1c4e' }, yard);
        T.el('rect', { x: -800, y: 360, width: 1400, height: 600, fill: '#3a1c06' }, yard);
        T.el('rect', { x: -800, y: 468, width: 1400, height: 500, fill: '#b36a06' }, yard);
        T.el('rect', { x: 2200, y: 150, width: 1400, height: 800, fill: '#1c0f06' }, yard);
        T.el('rect', { x: 2200, y: 420, width: 1400, height: 520, fill: '#d98601' }, yard);
        place(T, yard, bgUrl('backyard'), YARD);
        drawHouse(T, yard, 0, 470, 1);
        boy = mkBoy(T, yard, 230, 520, 1); girl = mkGirl(T, yard, 140, 520, .92);
        // 그림 속 장독을 오려 배우 앞에: 가림막(밑동 아래 땅까지) + 누르는 장독(장독 모양만, 반짝임 테두리용)
        const jars = el('g', {}, yard);
        bigJar = bgCutout(T, jars, bgUrl('backyard'), YARD, [...JAR, [240, 1040], [102, 1040], ...JAR_L]);
        hideJar = el('g', {}, jars);
        bgCutout(T, hideJar, bgUrl('backyard'), YARD, [...JAR, ...JAR_L]);
        if (T.portrait()) yard.to(330, 280, 1, 0); // 세로 화면: 오누이가 보이게 마당 왼쪽부터
        return;
      }
      sky(T, yard, C.indigo);
      el('circle', { cx: 900, cy: 90, r: 40, fill: C.cream }, yard);
      stars(T, yard, [[200, 60], [600, 120], [1300, 70], [1700, 140], [2100, 50], [2600, 110], [3000, 80]]);
      T.paper(yard, [['rect', { x: -800, y: 330, width: 4400, height: 100, fill: '#6E6680' }]]);
      T.paper(yard, [['rect', { x: -800, y: 420, width: 4400, height: 800, fill: '#5E6A58' }]]);
      drawHouse(T, yard, 0, 470, 1);
      T.paper(yard, [['rect', { x: 2010, y: 420, width: 220, height: 110, rx: 12, fill: C.stone }], ['ellipse', { cx: 2120, cy: 420, rx: 110, ry: 24, fill: '#2E3A6E', stroke: '#B0A89C', 'stroke-width': 10 }],
        ['rect', { x: 2020, y: 300, width: 12, height: 130, fill: C.bark }], ['rect', { x: 2208, y: 300, width: 12, height: 130, fill: C.bark }], ['rect', { x: 2000, y: 292, width: 240, height: 16, fill: C.bark }]]);
      T.paper(yard, [['rect', { x: 1430, y: 250, width: 10, height: 240, fill: C.bark }], ['rect', { x: 1800, y: 250, width: 10, height: 240, fill: C.bark }],
        ['path', { d: 'M1435 262 Q1620 300 1805 262', stroke: C.cream, 'stroke-width': 3, fill: 'none' }],
        ['rect', { x: 1480, y: 270, width: 90, height: 100, fill: C.snow }], ['rect', { x: 1600, y: 280, width: 80, height: 70, fill: C.lav }], ['rect', { x: 1700, y: 272, width: 70, height: 90, fill: C.gold }]]);
      T.paper(yard, [['rect', { x: 2530, y: -200, width: 90, height: 720, fill: C.bark }], ['circle', { cx: 2575, cy: -150, r: 200, fill: C.pine }], ['circle', { cx: 2440, cy: -20, r: 120, fill: '#35604A' }], ['circle', { cx: 2710, cy: -40, r: 130, fill: '#35604A' }]]);
      boy = mkBoy(T, yard, 230, 520, 1); girl = mkGirl(T, yard, 140, 520, .92);
      const jars = el('g', {}, yard);
      T.paper(jars, [['rect', { x: 880, y: 500, width: 420, height: 34, rx: 8, fill: C.stone }]]);
      const jar = (x, h, w) => T.paper(jars, [['path', { d: `M${x - w * .35} 510 Q${x - w * .62} ${510 - h * .5} ${x - w * .32} ${510 - h} L${x + w * .32} ${510 - h} Q${x + w * .62} ${510 - h * .5} ${x + w * .35} 510 Z`, fill: '#7A4028' }],
        ['rect', { x: x - w * .36, y: 500 - h, width: w * .72, height: 18, rx: 8, fill: '#5A2E1C' }]]);
      jar(950, 140, 150); jar(1210, 130, 140);
      hideJar = el('g', {}, jars);
      bigJar = jar(1080, 200, 190); hideJar.appendChild(bigJar);
      if (T.portrait()) yard.to(330, 280, 1, 0); // 세로 화면: 오누이가 보이게 마당 왼쪽부터
    });
    await say('오누이는 뒷문으로 살금살금 나왔어요. 화면을 쓱 밀어서 달려요!');
    const run2 = async (dx, dur = 560) => {
      const nb = boy.x + dx, ng = girl.x + dx;
      AudioFX.whoosh();
      await Promise.all([boy.move(nb, 520, dur), girl.move(ng, 520, dur), boy.hop(24, dur), girl.hop(24, dur), yard.to(yardCam(nb), 280, 1, dur)]);
    };
    await T.swipe(stageWrap, { dir: 'right', count: 2, prompt: '화면을 옆으로 쓱 밀어서 달려요!', onStep: () => run2(YJ.run1) });
    await sleep(700);
    await say('앗, 호랑이가 오는 소리! 커다란 장독을 톡 눌러서 숨어요!');
    await T.tap(hideJar, { prompt: '커다란 장독을 톡 눌러서 숨어요!' });
    AudioFX.slide();
    const jarsG = hideJar.parentNode;
    yard.insertBefore(boy.pos, jarsG); yard.insertBefore(girl.pos, jarsG);
    await Promise.all([boy.move(YJ.hide[0], 510, 500), girl.move(YJ.hide[1], 510, 500)]);
    prowl = mkTiger(T, yard, YJ.prowl[0], 530, 1);
    prowl.P.wear('scarf'); prowl.P.setBelly(2.4); prowl.face('right');
    await prowl.move(YJ.prowl[1], 530, 1400);
    prowl.face('left'); await sleep(350); prowl.face('right'); await sleep(350); prowl.face('left');
    T.pop(500, 170, '두리번두리번', C.bean);
    await say('"얘들아~ 어디 갔니?" 호랑이는 두리번두리번하다가 집 쪽으로 돌아갔어요.');
    await prowl.move(YJ.prowl[0] - 120, 530, 1300);
    prowl.pos.remove();
    await Promise.all([boy.move(YJ.out[0], 520, 500), girl.move(YJ.out[1], 520, 500)]);
    await say('휴~ 이제 우물가 큰 나무로 달려가요! 쓱쓱!');
    await T.swipe(stageWrap, { dir: 'right', count: 3, prompt: '화면을 옆으로 쓱 밀어서 달려요!', onStep: () => run2(YJ.run2) });
    await sleep(700);

    /* ====== 3막 — 하늘 동아줄 ====== */
    /* --- 11. 나무 오르기 + 우물 속 오누이? --- */
    let tree, well;
    /* 나무 꼭대기 오누이 자리: 그림 나무면 왼쪽 잎 덩어리 위 (무대 x 358~546, y ≈ -199) */
    const TOP = bgUrl('tree') ? { b: [520, -196], g: [420, -196] } : { b: [540, -140], g: [440, -140] };
    const buildTree = (kidsUp) => {
      T.clear(); camSnap(500, 280, 1);
      tree = mkView(T, T.world);
      /* 그림 나무: 나무 밑동(기둥 가운데)이 x 640·땅 y 570, 배율 1.71 → 왼쪽 잎 덩어리 윗면이 오누이가 앉는 자리(TOP) */
      const ta = treeArt(T, tree, 1.71, TREE_PX.trunk, [640, 570]);
      if (ta) {
        const [mx, my] = ta.at(TREE_PX.moon); el('circle', { cx: mx, cy: my, r: 40, fill: C.cream, opacity: .95 }, tree);
        well = el('g', {}, tree); // 우물은 그림 속에
        boy = mkBoy(T, tree, kidsUp ? TOP.b[0] : 610, kidsUp ? TOP.b[1] : 560, 1);
        girl = mkGirl(T, tree, kidsUp ? TOP.g[0] : 560, kidsUp ? TOP.g[1] : 560, .92);
        return;
      }
      sky(T, tree, C.indigo);
      el('circle', { cx: 120, cy: -200, r: 46, fill: C.cream }, tree);
      stars(T, tree, [[40, -500], [300, -250], [880, -520], [1000, -220], [-200, -100], [1250, -400], [-300, -560], [850, 40], [200, 80]]);
      T.paper(tree, [['path', { d: 'M-900 420 Q-300 300 400 380 Q1100 300 1900 420 V1400 H-900 Z', fill: '#3A4A5E' }]]);
      T.paper(tree, [['rect', { x: -900, y: 500, width: 2800, height: 900, fill: '#4E5A48' }]]);
      T.paper(tree, [['circle', { cx: 640, cy: -350, r: 230, fill: '#35604A' }], ['circle', { cx: 430, cy: -260, r: 150, fill: C.pine }], ['circle', { cx: 850, cy: -240, r: 160, fill: C.pine }]]);
      T.paper(tree, [['path', { d: 'M598 570 L612 -320 L668 -320 L684 570 Z', fill: C.bark }], ['path', { d: 'M620 -140 L360 -152 Q350 -140 362 -126 L620 -110 Z', fill: C.bark }]]);
      well = el('g', {}, tree);
      T.paper(well, [['rect', { x: 170, y: 460, width: 200, height: 110, rx: 12, fill: C.stone }], ['ellipse', { cx: 270, cy: 462, rx: 100, ry: 22, fill: '#2E3A6E', stroke: '#B0A89C', 'stroke-width': 10 }],
        ['rect', { x: 180, y: 330, width: 12, height: 140, fill: C.bark }], ['rect', { x: 348, y: 330, width: 12, height: 140, fill: C.bark }], ['rect', { x: 160, y: 322, width: 220, height: 16, fill: C.bark }]]);
      boy = mkBoy(T, tree, kidsUp ? TOP.b[0] : 610, kidsUp ? TOP.b[1] : 560, 1);
      girl = mkGirl(T, tree, kidsUp ? TOP.g[0] : 560, kidsUp ? TOP.g[1] : 560, .92);
    };
    await T.sceneCard('우물가 큰 나무', () => buildTree(false));
    await say('우물가에 커다란 나무가 있어요. 톡톡 눌러서 영차영차 올라가요!');
    await T.mash(stageWrap, { count: 5, prompt: '화면을 톡톡 눌러서 나무를 올라가요!', onStep: i => {
      yeongcha(T, i);
      // 그림: 오르는 동안은 나무 오르기 자세로 기둥(x 640)을 꼭 잡고, 동생은 오빠 발밑에 붙어서. 꼭대기에서 다시 선다
      const climbArt = boy.P.art && i < 5;
      boy.P.pose(climbArt ? 'climb' : 'stand'); girl.P.pose(climbArt ? 'climb' : 'stand');
      const by = i === 5 ? TOP.b[1] : 560 - i * 140, gy = i === 5 ? TOP.g[1] : by + (climbArt ? ROPE_GAP : 80);
      boy.move(i === 5 ? TOP.b[0] : climbArt ? 640 : 610, by, 420); girl.move(i === 5 ? TOP.g[0] : climbArt ? 640 : 560, gy, 420); // 656: 손이 기둥을 감싸게 기둥(640)보다 조금 오른쪽
      boy.hop(10, 420); girl.hop(10, 420);
      tree.to(560, Math.min(280, by - 60), 1, 420);
      T.pop(i % 2 ? 300 : 760, 200, '영차!', C.pine);
    } });
    await sleep(600);
    await say('오누이는 나무 꼭대기까지 올라갔어요!');
    await tree.to(560, 90, .58, 1400);
    const tg = mkTiger(T, tree, -300, 560, 1.1);
    tg.P.wear('scarf'); tg.P.setBelly(2.4); tg.face('right');
    await tg.move(420, 560, 1500);
    await say('호랑이가 뒷마당에 왔어요. "옳지! 우물 속에 숨었구나!"');

    let refl, bucket, tHead;
    await T.sceneCard('우물 속을 보니', () => {
      T.clear(); camSnap(500, 280, 1);
      /* 그림: 위에서 본 돌 우물. 물은 그림 속 안쪽 타원(무대 가운데 ≈ 517,413)에 맞춰 옮기고 타원으로 오린다.
         물 속 오누이 얼굴·톡 자리는 물 그룹 안의 원래 좌표(가운데 500,290) 그대로 */
      const art = bgImage(T, T.bg, 'wellTop', { back: '#25367f' });
      if (!art) {
        sky(T, T.bg, '#5E6A58');
        T.paper(T.bg, [['circle', { cx: 500, cy: 290, r: 260, fill: C.stone }], ['circle', { cx: 500, cy: 290, r: 205, fill: '#5E574F' }]]);
      }
      const cp = el('clipPath', { id: 'wellWater' }, T.world);
      if (art) el('ellipse', { cx: 500, cy: 290, rx: 292, ry: 146 }, cp); else el('circle', { cx: 500, cy: 290, r: 190 }, cp);
      const water = el('g', { 'clip-path': 'url(#wellWater)', transform: art ? 'translate(17 123)' : '' }, T.world);
      el('rect', { x: art ? 180 : 300, y: 90, width: art ? 640 : 400, height: 400, fill: '#2E3A6E' }, water);
      el('circle', { cx: 500, cy: 290, r: 150, fill: C.lav, opacity: .45 }, water);
      [[380, 170, 90], [620, 180, 80], [500, 130, 70]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: C.pine, opacity: .75 }, water));
      stars(T, water, [[400, 360], [600, 390], [540, 420]]);
      refl = origin(el('g', {}, water), 500, 290);
      el('rect', { x: 380, y: 200, width: 240, height: 170, fill: 'transparent' }, refl);
      drawKidFace(T, refl, false, 450, 290, 1.5); drawKidFace(T, refl, true, 560, 296, 1.4);
      bucket = el('g', {}, T.world);
      T.paper(bucket, [['path', { d: 'M0 -600 V-30', stroke: '#C9B48A', 'stroke-width': 5, fill: 'none' }], ['path', { d: 'M-34 -30 H34 L26 20 H-26 Z', fill: C.bark }], ['path', { d: 'M-30 -30 Q0 -64 30 -30', stroke: C.ink, 'stroke-width': 4, fill: 'none' }]]);
      bucket.setAttribute('transform', 'translate(700,-120)');
      const t = mkTiger(T, T.world, 820, 800, 1.5);
      t.P.wear('scarf');
      tHead = t;
    });
    await say('호랑이가 우물 속을 들여다봤어요. 우물 물에 오누이 얼굴이 비쳤거든요!');
    await say('"두레박으로 건져야지~" 영차!');
    await T.anim(bucket, [{ transform: 'translate(700px,-120px)' }, { transform: 'translate(600px,420px)' }], { duration: 700, easing: 'ease-in' });
    bucket.setAttribute('transform', 'translate(600,420)'); bucket.style.transform = '';
    AudioFX.splash(); T.pop(700, 400, '첨벙!', C.indigo);
    refl.animate([{ scale: 1 }, { scale: '1.08 .9' }, { scale: '.94 1.06' }, { scale: 1 }], { duration: 700 });
    await say('첨벙! 두레박에는 물만 가득. 우물 속 오누이 얼굴을 톡 눌러 봐요!');
    await T.tap(refl, { prompt: '우물에 비친 오누이 얼굴을 톡!' });
    giggle(T); T.pop(500, 120, '킥킥!', C.bean);
    await T.anim(refl, [{ rotate: '0deg' }, { rotate: '-6deg' }, { rotate: '6deg' }, { rotate: '-4deg' }, { rotate: '0deg' }], 700);
    // 그림 컷: 우물을 들여다보는 호랑이 + 나무 위에서 킥킥 웃는 오누이 (그림이 없으면 건너뛴다)
    await cutArt(T, 'cut_well', null, 2400, () => setTimeout(() => giggle(T), 300));
    await say('나무 위에서 오누이가 그만 킥킥 웃고 말았어요.');
    tHead.hop(30);
    await say('"어? 위에서 웃음소리가?" 호랑이가 고개를 번쩍 들었어요.');

    /* --- 12. 참기름과 도끼 --- */
    let bottle, oil;
    await T.sceneCard('나무 아래 호랑이', () => {
      buildTree(true);
      tree.to(560, 90, .58, 0);
      tiger.pos.remove();
      const t = mkTiger(T, tree, 760, 560, 1.1);
      t.P.wear('scarf'); t.P.setBelly(2.4);
      T.world.__t = t;
      oil = el('rect', { x: 606, y: 560, width: 70, height: 0, fill: C.amber, opacity: .75 }, tree);
      tree.insertBefore(oil, t.pos);
      bottle = el('g', {}, tree);
      el('rect', { x: 860, y: 330, width: 170, height: 240, fill: 'transparent' }, bottle);
      if (sprite(T, el('g', { transform: 'translate(945 564)' }, bottle), 'oil', 127, 210)) {
        // 그림 병 (얼굴 지운 자리)에 이름표
        T.paper(bottle, [['rect', { x: 907, y: 486, width: 76, height: 36, rx: 6, fill: C.cream }],
          ['text', { x: 945, y: 512, 'text-anchor': 'middle', 'font-size': 21, fill: C.bark, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '참기름' }]]);
      } else T.paper(bottle, [['path', { d: 'M905 560 Q890 470 930 440 V390 H960 V440 Q1000 470 985 560 Z', fill: '#E0B560' }], ['rect', { x: 924, y: 368, width: 42, height: 26, rx: 6, fill: C.bark }],
        ['rect', { x: 905, y: 470, width: 80, height: 40, rx: 6, fill: C.cream }],
        ['text', { x: 945, y: 499, 'text-anchor': 'middle', 'font-size': 22, fill: C.bark, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '참기름' }]]);
      origin(bottle, 945, 470);
    });
    const tt = T.world.__t;
    await say('호랑이가 올려다보며 물었어요. "얘들아, 거기 어떻게 올라갔니?"');
    await say('오빠가 꾀를 냈어요. "참기름 바르고 올라왔지!"');
    await tree.to(700, 300, .85, 900);
    await say('참기름 병을 톡 눌러서 나무에 발라 줘요!');
    await T.tap(bottle, { prompt: '참기름 병을 톡!' });
    await T.anim(bottle, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-60deg)' }], 400);
    bottle.style.transform = 'rotate(-60deg)';
    AudioFX.slide();
    for (let hgt = 0; hgt <= 520; hgt += 26) { oil.setAttribute('y', 560 - hgt); oil.setAttribute('height', hgt); await sleep(16); }
    T.pop(640, 110, '주르륵', C.gold);
    await sleep(400);
    for (let k = 0; k < 2; k++) {
      tt.P.slip(true); // 그림: 기어오르다 미끄러지는 내내 허우적 자세 (앉은 수건 그림이 떠 있지 않게)
      await tt.move(640, 380, 700);
      AudioFX.slide(); T.pop(760, 180 + k * 30, k ? '쭈르륵!' : '미끌!', C.bean);
      await tt.move(640, 560, 380, 'ease-in');
      AudioFX.thud(); tt.wiggle(10, 300);
      await sleep(250); tt.P.slip(false);
    }
    await say('미끌 쭈르륵! 호랑이는 자꾸자꾸 미끄러졌어요.');
    await tree.to(500, -200, 1, 900);
    await say('그때 동생이 깔깔 웃으며 말해 버렸어요. "도끼로 콕콕 찍고 올라왔지~"');
    await say('오빠가 "쉿!" 했지만… 벌써 들어 버렸어요!');

    // 분할 화면: 위 떠는 오누이 / 아래 도끼로 오르는 호랑이
    const split = el('g', {}, T.fx);
    const cpT = el('clipPath', { id: 'splitTop' }, split); el('rect', { x: -1400, y: -1400, width: 3800, height: 1676 }, cpT);
    const cpB = el('clipPath', { id: 'splitBot' }, split); el('rect', { x: -1400, y: 284, width: 3800, height: 1600 }, cpB);
    const top = el('g', { 'clip-path': 'url(#splitTop)' }, split), bot = el('g', { 'clip-path': 'url(#splitBot)' }, split);
    // 그림: 위 = 잎 덩어리 위의 오누이 (배율 2.2), 아래 = 나무 기둥 (배율 2.4, 기둥 가운데 x 500)
    if (!treeArt(T, top, 2.2, TREE_PX.canopyL, [500, 262])) {
      sky(T, top, C.indigo); stars(T, top, [[120, 60], [880, 80], [300, 30], [760, 200]]);
      T.paper(top, [['circle', { cx: 500, cy: 40, r: 200, fill: '#35604A' }], ['circle', { cx: 250, cy: 90, r: 120, fill: C.pine }], ['circle', { cx: 760, cy: 100, r: 130, fill: C.pine }],
        ['path', { d: 'M180 250 H820 V282 H180 Z', fill: C.bark }]]);
    }
    const sb = mkBoy(T, top, 560, 256, .95), sg = mkGirl(T, top, 440, 256, .88);
    sb.P.pose('hug'); sg.P.pose('hug'); // 그림: 둘이 꼭 껴안은 한 장 (오빠 배우에)
    const tr1 = tremble(sb), tr2 = tremble(sg);
    if (!treeArt(T, bot, 2.4, [665, 450], [500, 480])) {
      sky(T, bot, '#2A3558');
      T.paper(bot, [['rect', { x: 430, y: 280, width: 140, height: 400, fill: C.bark }]]);
    }
    const notches = el('g', {}, bot);
    for (let k = 0; k < 14; k++) el('path', { d: `M440 ${160 + k * 40} L470 ${172 + k * 40}`, stroke: '#4A3222', 'stroke-width': 6, 'stroke-linecap': 'round' }, notches);
    const st = mkTiger(T, bot, 470, 580, .9);
    st.P.wear('scarf'); st.P.setBelly(2.4); st.P.wear('axe');
    el('rect', { x: -1400, y: 274, width: 3800, height: 12, fill: C.gold }, split);
    Narrator.speak('호랑이가 도끼로 콕콕 찍으며 올라와요! 오누이는 덜덜 떨었어요.');
    let ny = 0;
    for (let k = 0; k < 7; k++) {
      kok(T); T.pop(640, 360, '콕!', C.bean);
      st.P.chop();
      st.hop(12, 360);
      ny += 40; T.anim(notches, [{ transform: `translateY(${ny - 40}px)` }, { transform: `translateY(${ny}px)` }], 360);
      await sleep(640);
    }
    tr1.cancel(); tr2.cancel();
    split.remove();
    tt.P.wear('axe');
    tt.place(640, 240);
    await tree.to(560, 90, .58, 900);
    boy.P.pose('hug'); girl.P.pose('hug');
    const tr3 = tremble(boy), tr4 = tremble(girl);
    await say('호랑이가 점점 가까이 올라와요. 오누이는 두 손을 모았어요.');
    await say('"하늘님, 튼튼한 동아줄을 내려 주세요!"');
    tr3.cancel(); tr4.cancel();
    boy.P.pose('stand'); girl.P.pose('stand');

    /* --- 13. 하늘 동아줄: 줄 고르기 + 구름 뚫고 오르기 --- */
    let skyV, ropeGood, ropeBad;
    const BANDS = ['#1F2A56', '#2E3A6E', '#44478A', '#6A5E9E', '#9A82B0', '#D9A98A', '#F2C98A', '#F6DFA0'];
    await T.sceneCard('하늘 동아줄', () => {
      T.clear(); camSnap(500, 280, 1);
      skyV = mkView(T, T.world);
      // 하늘 그림이 있으면 무대 뒤(bg)에 고정해 깔고, 줄·구름·오누이만 위로 흘러간다 (색 띠·별 대신)
      if (!bgImage(T, T.bg, 'sky', { back: C.indigo })) {
        BANDS.forEach((c, i) => el('rect', { x: -1400, y: 700 - i * 450 - (i === BANDS.length - 1 ? 2000 : 0), width: 3800, height: i === 0 ? 1400 : 450 + (i === BANDS.length - 1 ? 2000 : 0), fill: c }, skyV));
        stars(T, skyV, [[80, 60], [900, 120], [200, -300], [760, -500], [60, -800], [940, -900], [400, -1100], [700, 250]]);
      }
      [[-60, -2640, 260], [1060, -2640, 260]].forEach(([x, y, r]) => el('circle', { cx: x, cy: y, r, fill: C.amber, opacity: .5 }, skyV));
      el('circle', { cx: 500, cy: -2720, r: 300, fill: '#FBE7B0', opacity: .8 }, skyV);
      // 나무 꼭대기 (출발 자리): 하늘 그림이면 앞 장면 그림 나무처럼 달빛 받은 연보라 잎
      const [lf1, lf2, br] = bgUrl('sky') ? ['#8E93C4', '#7C82B6', '#4E4868'] : ['#35604A', C.pine, C.bark];
      T.paper(skyV, [['circle', { cx: 500, cy: 720, r: 300, fill: lf1 }], ['circle', { cx: 200, cy: 640, r: 160, fill: lf2 }], ['circle', { cx: 820, cy: 650, r: 170, fill: lf2 }],
        ['path', { d: 'M150 500 H850 V530 H150 Z', fill: br }]]);
      // 구름 6겹 (뒤쪽)
      for (let k = 0; k < 6; k++) {
        const y = 255 - k * 450;
        // 하늘 그림이 있으면 구름도 그림 속 구름 빛깔(크림·연보라)의 종이 구름 (둥근 윗면 + 납작한 아랫면 + 종이 그림자)
        [[-120, 0], [140, -20], [660, -10], [900, 10], [1120, -20]].forEach(([x, dy], j) => {
          if (!bgUrl('sky')) { el('ellipse', { cx: x, cy: y + dy, rx: 140, ry: 46, fill: j % 2 ? C.snow : '#DCD6EA', opacity: .95 }, skyV); return; }
          const cy = y + dy, f = (j + k) % 2 ? '#F1E4C6' : '#CDBFD9';
          T.paper(skyV, [['path', { d: `M${x - 150} ${cy + 26} Q${x - 150} ${cy - 6} ${x - 112} ${cy - 4} Q${x - 96} ${cy - 44} ${x - 46} ${cy - 30} Q${x - 10} ${cy - 66} ${x + 40} ${cy - 36} Q${x + 92} ${cy - 50} ${x + 112} ${cy - 10} Q${x + 150} ${cy - 8} ${x + 152} ${cy + 26} Z`, fill: f }]]);
        });
      }
      ropeGood = el('g', {}, skyV);
      el('rect', { x: 250, y: -200, width: 150, height: 700, fill: 'transparent' }, ropeGood);
      if (!ropeArt(T, ropeGood, 'rope_good', 325, 484, .59)) {
        T.paper(ropeGood, [['path', { d: 'M325 -3400 V470', stroke: C.gold, 'stroke-width': 26, fill: 'none' }], ['ellipse', { cx: 325, cy: 470, rx: 26, ry: 18, fill: C.gold }]]);
        el('path', { d: 'M325 -3400 V460', stroke: '#B88A3A', 'stroke-width': 26, 'stroke-dasharray': '6 18', fill: 'none' }, ropeGood);
      }
      [[292, 300], [360, 200], [300, 90], [355, 380]].forEach(([x, y]) => el('path', { d: `M${x} ${y - 14} L${x + 4} ${y - 4} L${x + 14} ${y} L${x + 4} ${y + 4} L${x} ${y + 14} L${x - 4} ${y + 4} L${x - 14} ${y} L${x - 4} ${y - 4} Z`, fill: '#FFF3C4' }, ropeGood));
      ropeBad = el('g', {}, skyV);
      el('rect', { x: 600, y: -200, width: 150, height: 700, fill: 'transparent' }, ropeBad);
      if (!ropeArt(T, ropeBad, 'rope_bad', 675, 478, .35)) T.paper(ropeBad, [['path', { d: 'M675 -3400 V200 Q690 260 668 320 Q690 380 675 440', stroke: '#9A8466', 'stroke-width': 8, fill: 'none', 'stroke-dasharray': '40 7' }],
        ['path', { d: 'M675 440 L660 470 M675 440 L676 474 M675 440 L692 468 M671 250 L650 244 M680 330 L700 324', stroke: '#9A8466', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }],
        ['rect', { x: 664, y: 120, width: 22, height: 26, rx: 4, fill: '#7A6A52' }]]);
      boy = mkBoy(T, skyV, 470, 510, 1); girl = mkGirl(T, skyV, 560, 510, .92);
      ropeGood.style.transform = 'translateY(-900px)'; ropeBad.style.transform = 'translateY(-900px)';
      ropeBad.style.transformBox = 'fill-box'; ropeBad.style.transformOrigin = '50% 100%'; // 삐걱 흔들림이 줄 아래끝 기준으로 (멀리 휘청이지 않게)
    });
    AudioFX.bell();
    await Promise.all([T.anim(ropeGood, [{ transform: 'translateY(-900px)' }, { transform: 'translateY(0)' }], { duration: 1500, easing: 'ease-out' }),
      T.anim(ropeBad, [{ transform: 'translateY(-900px)' }, { transform: 'translateY(0)' }], { duration: 1700, easing: 'ease-out' })]);
    await say('하늘에서 줄이 두 개 내려왔어요! 어떤 줄을 잡을까요?');
    await T.choose([{ el: ropeGood, ok: true },
      { el: ropeBad, ok: false, onWrong: async () => {
        creak(T); await T.anim(ropeBad, [{ rotate: '0deg' }, { rotate: '2deg' }, { rotate: '-2deg' }, { rotate: '0deg' }], 600);
        ropeGood.style.filter = 'url(#hintGlow)';
        await say('삐걱… 이 줄은 낡았어!');
      } }],
    { prompt: '굵고 반짝이는 튼튼한 줄을 톡 골라요!', where: '굵고 반짝반짝 튼튼한 줄을 찾아봐요!', who: '반짝이는 굵은 줄이 튼튼한 동아줄이에요!' });
    AudioFX.jingle();
    T.anim(ropeBad, [{ transform: 'translateY(0)' }, { transform: 'translateY(-1400px)' }], { duration: 1200, easing: 'ease-in' }).then(() => ropeBad.remove());
    await say('맞아요! 굵고 반짝이는 새 동아줄이에요.');
    // 그림: 줄 오르기 자세로 동아줄(x 325)을 꼭 잡는다 (동생은 오빠 발밑에)
    const RX = boy.P.art ? 325 : 360, GAP = boy.P.art ? ROPE_GAP : 140;
    await Promise.all([boy.move(RX, 330, 600), girl.move(RX, 330 + GAP, 600)]);
    boy.P.pose('rope'); girl.P.pose('rope'); // 줄에 닿으면 줄 오르기 그림으로
    await say('줄을 꼭 잡고, 화면을 위로 쓱쓱 밀어서 올라가요!');
    let step = 0;
    await T.swipe(stageWrap, { dir: 'up', count: 6, prompt: '화면을 위로 쓱 밀어서 올라가요!', onStep: () => {
      step++;
      const by = 330 - step * 450;
      AudioFX.whoosh(); yeongcha(T, step);
      boy.move(RX, by, 650); girl.move(RX, by + GAP, 650);
      skyV.to(500, by + 30, 1, 650);
      if (step === 3) Narrator.speak('구름을 뚫고 쑥쑥!');
    } });
    await sleep(900);
    AudioFX.fanfare();
    await say('구름을 여섯 겹이나 뚫고, 오누이는 하늘 나라에 닿았어요!');

    /* --- 14. 뚝! (컷 3장 + 수수밭) --- */
    await say('호랑이도 하늘에 빌었어요. 그랬더니 낡은 줄이 스르르 내려왔어요.');
    const cutText = (svg, t, s = 40) => el('text', { x: 200, y: 50, 'text-anchor': 'middle', 'font-size': s, fill: C.bean, stroke: '#fff', 'stroke-width': 7, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: t }, svg);
    await T.cut(svg => {
      if (!ropeArt(T, svg, 'rope_bad', 200, 150, .3, -20)) el('path', { d: 'M200 0 V120 Q210 150 196 180', stroke: '#9A8466', 'stroke-width': 7, fill: 'none', 'stroke-dasharray': '30 6' }, svg);
      const g = el('g', { transform: 'translate(200,300) scale(.85)' }, svg); const P = drawTiger(T, g); P.wear('scarf'); P.setBelly(2.4);
      cutText(svg, '삐걱… 삐걱…', 34);
      cutVoice('cut_creak', 500);
    }, { hold: 2200 });
    creak(T);
    await (cutArt(T, 'cut_snap', 'pow', 2200, () => cutVoice('cut_snap', 250)) || T.cut(svg => {
      el('path', { d: 'M200 0 V90 L190 100 M205 100 L212 92', stroke: '#9A8466', 'stroke-width': 7, fill: 'none' }, svg);
      const g = el('g', { transform: 'translate(200,320) scale(.85) rotate(12)' }, svg); const P = drawTiger(T, g); P.wear('scarf'); P.oMouth(); P.setBelly(2.4);
      cutText(svg, '뚝!', 64);
      cutVoice('cut_snap', 250);
    }, { sfx: 'pow', hold: 2200 }));
    await T.cut(svg => {
      for (let i = 0; i < 9; i++) el('path', { d: `M${20 + i * 45} 300 V${170 + (i % 3) * 16}`, stroke: C.pine, 'stroke-width': 6 }, svg);
      for (let i = 0; i < 9; i++) el('ellipse', { cx: 20 + i * 45, cy: 164 + (i % 3) * 16, rx: 12, ry: 22, fill: '#C98A3A' }, svg);
      const g = el('g', { transform: 'translate(200,300) scale(.8)' }, svg); const P = drawTiger(T, g); P.wear('bump'); P.oMouth(); P.setBelly(2.4);
      cutText(svg, '쿵! 엉덩방아', 44);
      cutVoice('cut_bump', 350);
    }, { sfx: 'thud', hold: 2400 });
    let sorg;
    await T.sceneCard('수수밭', () => {
      T.clear(); camSnap(500, 280, 1);
      const sorgArt = bgImage(T, T.bg, 'sorghum', { back: '#301a25' });
      if (!sorgArt) {
        sky(T, T.bg, '#8B7BB8');
        T.paper(T.bg, [['path', { d: 'M-300 360 Q200 200 600 300 Q850 180 1300 280 V700 H-300 Z', fill: '#4E5A70' }]]);
        T.paper(T.bg, [['rect', { x: -300, y: 470, width: 1600, height: 500, fill: '#7A6A48' }]]);
      }
      sorg = mkTiger(T, T.world, 500, 540, 1.2);
      sorg.P.wear('bump'); sorg.P.setBelly(1.5); sorg.P.oMouth();
      const front = el('g', {}, T.world);
      for (let i = -3; i < 16 && !sorgArt; i++) { // 그림 수수밭이면 앞줄 수수도 그림에 있다
        if (i >= 5 && i <= 9) continue;
        const x = -60 + i * 72, h = 300 + (i % 3) * 40;
        T.paper(front, [['path', { d: `M${x} 600 V${560 - h}`, stroke: C.pine, 'stroke-width': 7 }], ['path', { d: `M${x} ${520 - h / 2} Q${x + 40} ${500 - h / 2} ${x + 56} ${530 - h / 2}`, stroke: C.leaf, 'stroke-width': 8, fill: 'none' }],
          ['ellipse', { cx: x, cy: 540 - h, rx: 16, ry: 32, fill: '#C98A3A' }]]);
      }
    });
    const stars3 = el('g', {}, T.fx);
    for (let k = 0; k < 3; k++) el('path', { d: 'M0 -12 L4 -4 12 -4 5 2 8 12 0 6 -8 12 -5 2 -12 -4 -4 -4 Z', fill: '#FFD54F', transform: `rotate(${k * 120}) translate(46 0)` }, stars3);
    stars3.animate([{ transform: 'translate(500px,245px) rotate(0)' }, { transform: 'translate(500px,245px) rotate(360deg)' }], { duration: 1200, iterations: 3 });
    await say('"아이코 내 엉덩이! 아이코 내 머리!" 호랑이 머리에 동그란 혹이 났어요.');
    stars3.remove();
    sorg.face('right');
    AudioFX.whoosh();
    await Promise.all([sorg.move(1250, 380, 1800, 'ease-in'), T.anim(sorg.body, [{ transform: 'scale(1)' }, { transform: 'scale(.5)' }], 1800)]);
    await say('호랑이는 혹을 달고 산속으로 줄행랑! 다시는 오지 않았대요.');

    /* --- 15. 해와 달 (자유 놀이) --- */
    let skyRect, nightVeil = null, starG, sunKid, moonKid, beam, isDay = false;
    const OX = T.portrait() ? [345, 655] : [260, 740]; // 세로 화면: 해님·달님을 보이는 폭 안으로
    const drawOrb = (girlFace) => (T2, g) => {
      const P = {};
      P.sun = T.el('g', {}, g);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; T.el('path', { d: `M${Math.cos(a - .12) * 84} ${Math.sin(a - .12) * 84} L${Math.cos(a) * 120} ${Math.sin(a) * 120} L${Math.cos(a + .12) * 84} ${Math.sin(a + .12) * 84} Z`, fill: C.amber }, P.sun); }
      T.paper(P.sun, [['circle', { r: 86, fill: C.gold }]]);
      P.moon = T.el('g', {}, g);
      T.paper(P.moon, [['circle', { r: 86, fill: C.snow }], ['circle', { cx: -50, cy: -40, r: 12, fill: '#DCD6EA' }], ['circle', { cx: 52, cy: 44, r: 9, fill: '#DCD6EA' }]]);
      T.el('rect', { x: -120, y: -120, width: 240, height: 240, fill: 'transparent' }, g);
      const face = drawKidFace(T, g, girlFace, 0, 8, 1.6);
      // 그림 해님(동생 얼굴이 든 해): 동생이 해가 되면 이 한 장만 (그림 속 얼굴을 쓰니 얼굴 조각은 숨긴다)
      // 그림 달님(보름달 앞에 선 오빠): 오빠가 달이 되면 이 한 장만. 둘 다 얼굴·몸이 그림에 있어 얼굴 조각은 숨긴다
      const sunArt = girlFace ? sprite(T, g, 'sun_girl', 276, 270, { dy: 135 }) : null;
      const moonArt = girlFace ? null : sprite(T, g, 'moon_boy', 178, 310, { dy: 155 });
      P.set = s => {
        const art = s ? sunArt : moonArt;
        P.sun.setAttribute('opacity', s && !art ? 1 : 0); P.moon.setAttribute('opacity', !s && !art ? 1 : 0);
        face.style.display = art ? 'none' : '';
        if (sunArt) sunArt.style.display = s ? '' : 'none';
        if (moonArt) moonArt.style.display = s ? 'none' : '';
      };
      return P;
    };
    await T.sceneCard('해와 달', () => {
      T.clear(); camSnap(500, 280, 1);
      if (bgImage(T, T.bg, 'heaven', { back: C.indigo })) {
        // 하늘 그림(낮) 위에 밤 장막: 밤이면 남색으로 덮고 별을 띄운다
        // 밤 그림이 있으면 그 그림을 위에 겹쳐 두고 투명도로 낮↔밤 (없으면 남색 장막)
        const nu = bgUrl('heavenNight');
        nightVeil = nu ? place(T, T.bg, nu, FULL) : el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: C.night, opacity: .62 }, T.bg);
        nightVeil.__full = !!nu;
        nightVeil.style.transition = 'opacity 1s';
      } else {
        skyRect = sky(T, T.bg, C.indigo); skyRect.style.transition = 'fill 1s';
      }
      starG = el('g', {}, T.bg); stars(T, starG, [[80, 60], [420, 90], [560, 40], [640, 250], [930, 300], [60, 300], [360, 260]]);
      starG.style.transition = 'opacity 1s';
      if (!nightVeil) {
        T.paper(T.bg, [['path', { d: 'M-300 400 Q200 320 600 380 Q850 320 1300 380 V900 H-300 Z', fill: C.pine }]]);
        T.paper(T.bg, [['rect', { x: -300, y: 480, width: 1600, height: 500, fill: C.leaf }]]);
        drawHouse(T, T.bg, 800, 500, .6);
      }
      sunKid = mk(T, T.world, OX[0], 170, drawOrb(false), .9);   // 오빠 (처음엔 해)
      moonKid = mk(T, T.world, OX[1], 170, drawOrb(true), .9);   // 동생 (처음엔 달)
      sunKid.P.set(true); moonKid.P.set(false);
      boy = sunKid; girl = moonKid; // 대사 연출: 해·달이 된 오누이가 말한다
    });
    T.confetti(); AudioFX.bell();
    await Promise.all([sunKid.hop(20), moonKid.hop(20)]);
    await say('하늘 나라에 간 오빠는 해님이, 동생은 달님이 되었어요.');
    await say('동생이 말했어요. "오빠, 나는 밤이 무서워요."');
    await say('"그럼 우리 바꾸자!"');
    AudioFX.swish();
    await Promise.all([sunKid.move(OX[1], 170, 1000), moonKid.move(OX[0], 170, 1000)]);
    sunKid.P.set(false); moonKid.P.set(true);
    const girlSun = moonKid, boyMoon = sunKid;
    const setSky = day => {
      isDay = day;
      if (nightVeil) nightVeil.style.opacity = day ? 0 : nightVeil.__full ? 1 : .62; else skyRect.style.fill = day ? '#F2DFA8' : C.indigo;
      starG.style.opacity = day ? 0 : 1;
      girlSun.body.style.opacity = day ? 1 : .7; boyMoon.body.style.opacity = day ? .7 : 1;
    };
    setSky(true);
    await say('그래서 동생은 해님, 오빠는 달님이 되었답니다.');
    await say('해님이나 달님을 톡 눌러 봐요! 낮이 되고, 밤이 돼요.');
    await T.free([
      { el: girlSun.pos, onTap: () => { setSky(true); AudioFX.jingle(); girlSun.hop(24); } },
      { el: boyMoon.pos, onTap: () => { setSky(false); AudioFX.bell(); boyMoon.hop(24); } },
    ], 18000);
    setSky(true);
    await say('해님 달님은 오늘도 하늘에서 우리를 환하게 비춰 준답니다.');
    return '해님 달님이 늘 우리를 비춰 줘요!';
  }

  /* ================= 세로 화면 도우미 (이 동화 안에서만) =================
     세로 화면은 무대 양옆이 잘린다(보이는 폭 = T.viewWidth(), 폰에서 약 430).
     조작을 기다리기 전에 누를 대상(카메라 안의 그림)이 화면 밖이면 카메라를 옆으로 옮기고,
     그래도 다 안 들어가면 살짝 물러서서(줌아웃) 모두 보이게 한다.
     장면이 바뀌면 이 도우미가 옮긴 카메라는 제자리로 돌려놓는다.
     가로 화면(보이는 폭 1000)에서는 아무것도 하지 않는다. */
  function portraitGuard(api) {
    const T = Object.create(api);
    const portrait = () => api.viewWidth() < 990;
    let guardCam = null;
    const inCam = n => n && n.closest && n.closest('#cam');
    function worldBox(nodes) {
      const w = document.getElementById('stageWrap').getBoundingClientRect();
      const s = w.height / 560, c = api.camera; // 세로(slice): 무대 높이 560이 화면 높이에 맞는다
      const wx = px => c.x + ((px - w.left - w.width / 2) / s) / c.z, wy = py => c.y + ((py - w.top - w.height / 2) / s) / c.z;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      nodes.forEach(n => {
        const r = n.getBoundingClientRect(); if (!r.width && !r.height) return;
        x0 = Math.min(x0, wx(r.left)); x1 = Math.max(x1, wx(r.right)); y0 = Math.min(y0, wy(r.top)); y1 = Math.max(y1, wy(r.bottom));
      });
      return x0 < x1 ? { x0, x1, y0, y1 } : null;
    }
    T.portrait = portrait;
    /* 화면 고정 UI(#stage에 바로 붙은 카드·배지)를 보이는 폭 안에 한 줄로 다시 놓는다.
       gs: translate(x,y)로 놓인 그룹들. 원래 왼쪽→오른쪽 순서를 지키고, 넘치면 함께 줄인다. 세로 화면에서만 */
    T.fitRow = (gs, { gap = 16, margin = 12 } = {}) => {
      if (!portrait()) return;
      const vw = api.viewWidth();
      const at = g => (g.getAttribute('transform') || '').match(/translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/) || [0, 0, 0];
      const items = gs.map(g => { const m = at(g), b = g.getBBox(); return { g, x: +m[1], y: +m[2], b }; }).sort((p, q) => p.x - q.x);
      const total = items.reduce((s, it) => s + it.b.width, 0) + gap * (items.length - 1);
      const k = Math.min(1, (vw - 2 * margin) / total);
      let x = 500 - total * k / 2;
      items.forEach(it => {
        const cx = x + it.b.width * k / 2 - (it.b.x + it.b.width / 2) * k;
        // 자리·크기는 바깥 틀(wrap)이 맡는다 → 카드 자신의 톡 커지는(scale) 애니메이션은 카드 가운데 기준 그대로
        const wrap = it.g._fitWrap || T.el('g', {}, it.g.parentNode);
        if (!it.g._fitWrap) { it.g.parentNode.insertBefore(wrap, it.g); wrap.appendChild(it.g); it.g._fitWrap = wrap; const rm = it.g.remove.bind(it.g); it.g.remove = () => { rm(); wrap.remove(); }; }
        wrap.setAttribute('transform', `translate(${cx.toFixed(1)},${it.y}) scale(${k.toFixed(3)})`);
        it.g.setAttribute('transform', 'translate(0,0)');
        it.g._x = cx; x += (it.b.width + gap) * k;
      });
    };
    /* nodes가 모두 보이게 카메라를 옮긴다 (세로 화면에서만) */
    T.fitTo = async (nodes, { dur = 600, pad = 22, minZ = .5 } = {}) => {
      if (!portrait()) return;
      nodes = [].concat(nodes).filter(inCam); if (!nodes.length) return;
      const b = worldBox(nodes); if (!b) return;
      const vw = api.viewWidth(), c = api.camera, vert = c.z > 1.001; // z ≤ 1이면 세로는 늘 무대 전체가 보인다
      const hx = vw / 2 / c.z, hy = 280 / c.z;
      if (b.x0 - pad >= c.x - hx && b.x1 + pad <= c.x + hx && (!vert || (b.y0 - pad >= c.y - hy && b.y1 + pad <= c.y + hy))) return;
      const z = Math.max(minZ, Math.min(c.z, vw / 2 / ((b.x1 - b.x0) / 2 + pad), vert ? 280 / ((b.y1 - b.y0) / 2 + pad) : 9));
      const nx = vw / 2 / z, ny = 280 / z;
      const x = Math.min(Math.max(c.x, b.x1 + pad - nx), b.x0 - pad + nx);
      const y = Math.min(Math.max(c.y, b.y1 + pad - ny), b.y0 - pad + ny);
      await api.camTo(x, y, z, dur);
      guardCam = api.camera;
    };
    const targetsOf = { tap: a => a[0], mash: a => a[0], swipe: a => a[0], hold: a => a[0], choose: a => a[0].map(o => o.el), free: a => a[0].map(t => t.el) };
    Object.keys(targetsOf).forEach(k => { T[k] = async (...a) => { await T.fitTo(targetsOf[k](a)); return api[k](...a); }; });
    T.sceneCard = (label, change, focus) => api.sceneCard(label, () => {
      if (guardCam) { const c = api.camera; if (c.x === guardCam.x && c.y === guardCam.y && c.z === guardCam.z) api.camSnap(500, 280, 1); guardCam = null; }
      change && change();
    }, focus);
    return T;
  }

  Tale.mount({ title: '해와 달이 된 오누이', subtitle: '햇님 달님', run: T => run(portraitGuard(Tale.api)) });
})();
