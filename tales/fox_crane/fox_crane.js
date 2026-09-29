/* 여우와 두루미 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §15
   여우는 납작 접시에, 두루미는 목이 긴 병에 음식을 낸다 → 서로 못 먹는다 → 왜 그랬을까? → 입 모양에 맞는 그릇 고르기 → 함께 먹는 잔치.
   순화: 원작처럼 골탕으로 끝내지 않고, 마지막에 서로 사과하고 각자 맞는 그릇으로 함께 먹는다. */
(() => {
  const C = { cream: '#F6ECD8', gold: '#D9A94E', persimmon: '#E8703A', bean: '#A93B32', bark: '#6B4A32', pine: '#3F6B4F',
    indigo: '#1F2A56', lav: '#8B7BB8', snow: '#F4F6FA', amber: '#F2B366', leaf: '#6E9A5B', ink: '#2E241C', pink: '#E8A0A0',
    sky: '#F2DFA8', grass: '#7c9a58', dirt: '#d9b98a', fox2: '#C85A2A', wood: '#b98f4a', water: '#4f6f9a', wall: '#E9D9B5' };

  /* ---------- 작은 도우미 ---------- */
  const rotO = (n, x, y) => { n.style.transformBox = 'view-box'; n.style.transformOrigin = `${x}px ${y}px`; return n; };
  const hit = (T, g, x, y, w, h) => T.el('rect', { x, y, width: w, height: h, fill: 'transparent' }, g);
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  /* 실제 효과음 → 없으면 합성음 */
  const sfx = (T, name, fb, vol) => AudioFX.sfx(name, vol) || (fb ? fb() : (AudioFX[name] && AudioFX[name]()));
  const peckSnd = T => sfx(T, 'knock', () => T.tone([1800, 1400], .06, { type: 'square', vol: .14 }), .6);
  const lickSnd = T => { T.tone([500, 700], .1, { type: 'sine', vol: .18 }); T.tone([500, 750], .1, { type: 'sine', vol: .18, when: .16 }); };
  const sipSnd = T => { T.tone([900, 1300], .08, { type: 'sine', vol: .16 }); T.tone([900, 1400], .08, { type: 'sine', vol: .16, when: .14 }); };
  const bubbleSnd = T => T.tone([300 + Math.random() * 200, 700], .09, { type: 'sine', vol: .16 });
  const craneCall = T => { T.tone([700, 1000], .18, { type: 'triangle', vol: .14 }); T.tone([1000, 800], .2, { type: 'triangle', vol: .12, when: .2 }); };

  /* 머리(부리·주둥이) 끝이 target(월드 좌표)을 향하도록 돌리는 각도(로컬, deg) */
  function aim(a, pivot, tip, [tx, ty]) {
    const w = ([x, y]) => [a.x + a.flip * a.scale * x, a.y + a.scale * y];
    const [px, py] = w(pivot), [qx, qy] = w(tip);
    let d = (Math.atan2(ty - py, tx - px) - Math.atan2(qy - py, qx - px)) * 180 / Math.PI;
    while (d > 180) d -= 360; while (d < -180) d += 360;
    return d * a.flip;
  }

  /* ================= 인물 (모두 왼쪽을 보고 선다, 발끝 0,0) ================= */
  const FOX_PIV = [-40, -75], FOX_TIP = [-132, -94];
  function drawFox(T, g) {
    const { el, paper } = T;
    const all = rotO(el('g', {}, g), -130, -94);
    const tail = rotO(el('g', {}, all), 38, -60);
    paper(tail, [
      ['path', { d: 'M36 -52 Q104 -46 118 -104 Q124 -134 100 -146 Q92 -96 34 -76 Z', fill: C.persimmon }],
      ['path', { d: 'M100 -146 Q124 -134 118 -104 Q108 -120 92 -124 Z', fill: C.cream }],
    ]);
    const legs = rotO(el('g', {}, all), 0, -44);
    paper(legs, [-40, -18, 12, 34].map(x => ['rect', { x, y: -42, width: 13, height: 42, rx: 6, fill: C.fox2 }]));
    paper(legs, [-40, -18, 12, 34].map(x => ['rect', { x: x - 1, y: -9, width: 15, height: 9, rx: 4, fill: C.ink }]));
    paper(all, [['ellipse', { cx: 0, cy: -58, rx: 56, ry: 30, fill: C.persimmon }], ['ellipse', { cx: -24, cy: -50, rx: 26, ry: 15, fill: C.cream }]]);
    const head = rotO(el('g', {}, all), ...FOX_PIV);
    paper(head, [
      ['path', { d: 'M-80 -116 L-74 -164 L-50 -126 Z', fill: C.persimmon }],
      ['path', { d: 'M-50 -124 L-34 -166 L-20 -118 Z', fill: C.persimmon }],
      ['path', { d: 'M-74 -124 L-72 -150 L-60 -128 Z', fill: C.ink }],
      ['path', { d: 'M-44 -126 L-35 -152 L-28 -122 Z', fill: C.ink }],
      ['circle', { cx: -55, cy: -100, r: 33, fill: C.persimmon }],
      ['path', { d: 'M-74 -114 L-132 -94 L-74 -76 Z', fill: C.persimmon }],
      ['path', { d: 'M-90 -90 L-132 -94 L-82 -78 Q-60 -68 -38 -84 Z', fill: C.cream }],
    ]);
    const tongue = el('ellipse', { cx: -116, cy: -80, rx: 12, ry: 6, fill: C.pink, opacity: 0 }, head);
    el('circle', { cx: -131, cy: -94, r: 7, fill: C.ink }, head);
    el('circle', { cx: -64, cy: -106, r: 5, fill: C.ink }, head);
    const blush = el('g', { opacity: 0 }, head);
    el('ellipse', { cx: -60, cy: -86, rx: 10, ry: 5, fill: C.pink }, blush);
    hit(T, g, -140, -170, 270, 170);
    return { all, head, tongue, legs, tail, blush };
  }
  const CRANE_PIV = [-25, -135], CRANE_TIP = [-112, -220];
  function drawCrane(T, g) {
    const { el, paper } = T;
    const all = el('g', {}, g);
    paper(all, [['path', { d: 'M-8 -106 V0 M-22 0 H4 M14 -106 V0 M2 0 H28', stroke: C.ink, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }]]);
    paper(all, [
      ['path', { d: 'M46 -142 Q102 -140 108 -94 Q86 -110 48 -110 Z', fill: C.ink }],
      ['ellipse', { cx: 12, cy: -126, rx: 54, ry: 30, fill: C.snow }],
      ['path', { d: 'M-12 -130 Q30 -150 62 -124', stroke: '#c9ccd4', 'stroke-width': 4, fill: 'none' }],
    ]);
    const head = rotO(el('g', {}, all), ...CRANE_PIV);
    paper(head, [
      ['path', { d: 'M-25 -135 Q-44 -180 -30 -220', stroke: C.ink, 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }],
      ['circle', { cx: -30, cy: -226, r: 17, fill: C.snow }],
      ['circle', { cx: -27, cy: -240, r: 8, fill: C.bean }],
      ['path', { d: 'M-44 -232 L-114 -220 L-44 -217 Z', fill: C.gold }],
    ]);
    el('circle', { cx: -36, cy: -229, r: 3.5, fill: C.ink }, head);
    hit(T, head, -120, -250, 110, 120);
    return { all, head };
  }
  function drawDuck(T, g) {
    const { el, paper } = T;
    paper(g, [
      ['rect', { x: -14, y: -14, width: 9, height: 14, fill: C.persimmon }], ['rect', { x: 8, y: -14, width: 9, height: 14, fill: C.persimmon }],
      ['path', { d: 'M40 -62 L74 -78 L62 -44 Z', fill: C.snow }],
      ['ellipse', { cx: 6, cy: -46, rx: 52, ry: 34, fill: C.snow }],
      ['path', { d: 'M-4 -54 Q26 -68 44 -42 Q14 -30 -4 -54 Z', fill: '#dfe3ea' }],
      ['circle', { cx: -30, cy: -98, r: 28, fill: C.snow }],
    ]);
    const head = rotO(el('g', {}, g), -20, -80);
    paper(head, [['path', { d: 'M-50 -104 Q-104 -108 -108 -92 Q-104 -78 -50 -86 Z', fill: C.persimmon }]]);
    el('circle', { cx: -36, cy: -106, r: 4.5, fill: C.ink }, head);
    hit(T, g, -110, -130, 190, 130);
    return { head };
  }
  function drawButterfly(T, g) {
    const { el, paper } = T;
    const wings = rotO(el('g', {}, g), 0, -88);
    paper(wings, [
      ['ellipse', { cx: -26, cy: -108, rx: 28, ry: 32, fill: C.persimmon, transform: 'rotate(-20 -26 -108)' }],
      ['ellipse', { cx: 26, cy: -108, rx: 28, ry: 32, fill: C.persimmon, transform: 'rotate(20 26 -108)' }],
      ['ellipse', { cx: -22, cy: -66, rx: 19, ry: 17, fill: C.gold }],
      ['ellipse', { cx: 22, cy: -66, rx: 19, ry: 17, fill: C.gold }],
    ]);
    [[-28, -112], [28, -112], [-22, -66], [22, -66]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 6, fill: C.cream }, wings));
    paper(g, [['ellipse', { cx: 0, cy: -86, rx: 7, ry: 30, fill: C.ink }], ['circle', { cx: 0, cy: -120, r: 10, fill: C.ink }]]);
    el('path', { d: 'M-4 -128 Q-14 -150 -22 -150 M4 -128 Q14 -150 22 -150', stroke: C.ink, 'stroke-width': 3, fill: 'none' }, g);
    el('path', { d: 'M-6 -114 Q-24 -114 -26 -100 Q-26 -88 -16 -88 Q-8 -88 -10 -96', stroke: C.bark, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, g);
    wings.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.55)' }, { transform: 'scaleX(1)' }], { duration: 520, iterations: Infinity });
    hit(T, g, -60, -155, 120, 120);
    return { wings };
  }
  const GUESTS = {
    crane: { name: '두루미', draw: drawCrane, scale: 1.05 },
    fox: { name: '여우', draw: drawFox, scale: 1.05 },
    duck: { name: '오리', draw: drawDuck, scale: 1.25 },
    butterfly: { name: '나비', draw: drawButterfly, scale: 1.3 },
  };
  function guest(T, parent, key, x, y, scale) {
    let parts;
    const a = T.actor(parent, x, y, g => { parts = GUESTS[key].draw(T, g); }, { scale: scale || GUESTS[key].scale });
    a.parts = parts; a.key = key; return a;
  }

  /* ================= 그릇·소품 (발끝 0,0) ================= */
  const DISH = {
    plate: { name: '납작 접시', top: -12, draw(T, g) {
      T.paper(g, [['ellipse', { cx: 0, cy: -10, rx: 90, ry: 14, fill: C.cream, stroke: C.gold, 'stroke-width': 4 }], ['ellipse', { cx: 0, cy: -12, rx: 66, ry: 7, fill: C.amber }]]);
      hit(T, g, -95, -80, 190, 90);
    } },
    bottle: { name: '긴 병', top: -184, draw(T, g) {
      T.paper(g, [
        ['ellipse', { cx: 0, cy: -40, rx: 40, ry: 40, fill: C.pine }], ['circle', { cx: 0, cy: -96, r: 24, fill: C.pine }],
        ['rect', { x: -8, y: -178, width: 16, height: 66, fill: C.pine }], ['rect', { x: -13, y: -186, width: 26, height: 9, rx: 3, fill: C.gold }],
        ['rect', { x: -11, y: -124, width: 22, height: 7, rx: 3, fill: C.bean }],
      ]);
      T.el('path', { d: 'M-24 -56 Q-28 -32 -14 -14', stroke: C.leaf, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
      hit(T, g, -50, -190, 100, 190);
    } },
    bowl: { name: '넓은 그릇', top: -50, draw(T, g) {
      T.paper(g, [
        ['path', { d: 'M-74 -54 Q-70 0 0 0 Q70 0 74 -54 Z', fill: C.bean }],
        ['ellipse', { cx: 0, cy: -54, rx: 74, ry: 12, fill: '#7d2b25' }], ['ellipse', { cx: 0, cy: -52, rx: 64, ry: 8, fill: C.leaf }],
        ['path', { d: 'M-66 -30 Q0 -14 66 -30', stroke: C.gold, 'stroke-width': 4, fill: 'none' }],
      ]);
      hit(T, g, -80, -100, 160, 100);
    } },
    flower: { name: '꽃', top: -112, draw(T, g) {
      T.paper(g, [
        ['path', { d: 'M0 0 Q-6 -50 0 -98', stroke: C.pine, 'stroke-width': 7, fill: 'none' }],
        ['ellipse', { cx: -16, cy: -40, rx: 16, ry: 7, fill: C.leaf, transform: 'rotate(-30 -16 -40)' }],
        ['ellipse', { cx: 16, cy: -58, rx: 16, ry: 7, fill: C.leaf, transform: 'rotate(30 16 -58)' }],
        ...[0, 72, 144, 216, 288].map(d => ['circle', { cx: Math.cos(d * Math.PI / 180) * 19, cy: -112 + Math.sin(d * Math.PI / 180) * 19, r: 17, fill: C.persimmon }]),
        ['circle', { cx: 0, cy: -112, r: 12, fill: C.gold }],
      ]);
      hit(T, g, -45, -150, 90, 150);
    } },
  };
  function dish(T, parent, key, x, y, scale = 1) {
    const a = T.actor(parent, x, y, g => DISH[key].draw(T, g), { scale });
    a.key = key; return a;
  }
  function drawPot(T, g) {
    const { el, paper } = T;
    paper(g, [['path', { d: 'M-66 0 Q-56 -34 -34 -12 Q-22 -44 0 -14 Q22 -48 34 -12 Q56 -34 66 0 Z', fill: C.amber }]]);
    const spoon = rotO(el('g', {}, g), 0, -120);
    paper(spoon, [['rect', { x: -7, y: -236, width: 14, height: 124, rx: 7, fill: C.bark }], ['ellipse', { cx: 0, cy: -118, rx: 16, ry: 8, fill: C.bark }]]);
    paper(g, [
      ['path', { d: 'M-90 -112 Q-98 -22 -60 -18 H60 Q98 -22 90 -112 Z', fill: '#3a2a22' }],
      ['rect', { x: -102, y: -126, width: 204, height: 16, rx: 8, fill: C.ink }],
      ['ellipse', { cx: 0, cy: -122, rx: 84, ry: 6, fill: C.amber }],
    ]);
    const bubbles = el('g', {}, g);
    hit(T, g, -110, -240, 220, 240);
    return { spoon, bubbles };
  }
  function drawInvite(T, g) {
    T.paper(g, [
      ['rect', { x: -44, y: -60, width: 88, height: 60, rx: 5, fill: C.cream, stroke: C.gold, 'stroke-width': 3 }],
      ['path', { d: 'M-44 -60 L0 -26 L44 -60', stroke: C.gold, 'stroke-width': 3, fill: 'none' }],
      ['circle', { cx: 0, cy: -26, r: 9, fill: C.bean }],
    ]);
    hit(T, g, -55, -70, 110, 80);
  }
  function lantern(T, parent, x, y) {
    const { el, paper } = T;
    el('line', { x1: x, y1: -20, x2: x, y2: y - 30, stroke: C.bark, 'stroke-width': 3 }, parent);
    const glow = el('circle', { cx: x, cy: y, r: 62, fill: C.amber, opacity: .22 }, parent);
    glow.animate([{ opacity: .14 }, { opacity: .32 }, { opacity: .14 }], { duration: 1800 + Math.random() * 800, iterations: Infinity });
    paper(parent, [
      ['ellipse', { cx: x, cy: y, rx: 26, ry: 32, fill: C.amber }],
      ['rect', { x: x - 16, y: y - 38, width: 32, height: 9, rx: 3, fill: C.bean }], ['rect', { x: x - 16, y: y + 29, width: 32, height: 9, rx: 3, fill: C.bean }],
      ['path', { d: `M${x} ${y + 38} V${y + 60}`, stroke: C.bean, 'stroke-width': 4 }],
    ]);
  }

  /* ================= 배경 (장면마다 통판 1장) ================= */
  const sky = (T, fill) => T.el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill }, T.bg);
  function forestBG(T) {
    const { el, paper } = T, b = T.bg;
    sky(T, C.sky);
    el('circle', { cx: 840, cy: 90, r: 44, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 330 Q200 230 500 300 Q800 220 1200 310 V600 H-200 Z', fill: '#b9a25a' }]]);
    for (let i = 0; i < 9; i++) {
      const x = -30 + i * 130 + (i % 2) * 30, s = 1 + (i % 3) * .18;
      paper(b, [
        ['rect', { x: x - 9, y: 420 - 60 * s, width: 18, height: 60 * s, fill: C.bark }],
        ['path', { d: `M${x - 60 * s} ${420 - 50 * s} L${x} ${420 - 190 * s} L${x + 60 * s} ${420 - 50 * s} Z`, fill: i % 2 ? C.pine : C.leaf }],
      ]);
    }
    paper(b, [['rect', { x: -200, y: 420, width: 1400, height: 400, fill: C.grass }]]);
    paper(b, [['ellipse', { cx: 500, cy: 492, rx: 620, ry: 42, fill: C.dirt }]]);
    [[80, 450], [930, 455], [160, 540], [860, 545]].forEach(([x, y]) => paper(b, [['circle', { cx: x, cy: y, r: 9, fill: C.persimmon }], ['circle', { cx: x, cy: y, r: 4, fill: C.gold }]]));
  }
  function kitchenBG(T) {
    const { el, paper } = T, b = T.bg;
    sky(T, '#3a2519');
    paper(b, [['path', { d: 'M40 600 V210 Q40 30 500 30 Q960 30 960 210 V600 Z', fill: '#8a6344' }]]);
    el('circle', { cx: 790, cy: 170, r: 62, fill: C.sky }, b);
    el('circle', { cx: 790, cy: 170, r: 62, fill: 'none', stroke: C.bark, 'stroke-width': 10 }, b);
    el('path', { d: 'M728 170 H852 M790 108 V232', stroke: C.bark, 'stroke-width': 6 }, b);
    paper(b, [['rect', { x: 110, y: 190, width: 250, height: 12, fill: C.bark }]]);
    [[140, C.gold, 30], [190, C.bean, 40], [250, C.cream, 34], [310, C.pine, 44]].forEach(([x, f, h]) => paper(b, [['rect', { x: x - 16, y: 190 - h, width: 32, height: h, rx: 8, fill: f }]]));
    [[190, 70], [230, 60], [270, 76]].forEach(([x, h]) => paper(b, [['path', { d: `M${x} 40 V${40 + h}`, stroke: C.leaf, 'stroke-width': 10, 'stroke-linecap': 'round' }]]));
    paper(b, [['rect', { x: -200, y: 470, width: 1400, height: 300, fill: C.bark }]]);
  }
  function highBG(T) {
    const { el, paper } = T, b = T.bg;
    sky(T, C.wood);
    for (let i = -2; i < 14; i++) el('path', { d: `M${i * 90} -20 L${i * 90 + 60} 600`, stroke: '#a67c3d', 'stroke-width': 5 }, b);
    paper(b, [['ellipse', { cx: 500, cy: 440, rx: 440, ry: 160, fill: C.bean }], ['ellipse', { cx: 500, cy: 440, rx: 410, ry: 140, fill: 'none', stroke: C.gold, 'stroke-width': 6 }]]);
  }
  function highTable(T, parent) {
    const { el, paper } = T;
    const g = el('g', {}, parent);
    paper(g, [['ellipse', { cx: 500, cy: 470, rx: 250, ry: 92, fill: '#8a6344' }], ['ellipse', { cx: 500, cy: 456, rx: 250, ry: 92, fill: '#C9A26A' }]]);
    paper(g, [['ellipse', { cx: 500, cy: 450, rx: 150, ry: 45, fill: C.cream, stroke: C.gold, 'stroke-width': 5 }]]);
    const soup = el('ellipse', { cx: 500, cy: 450, rx: 118, ry: 32, fill: C.amber }, g);
    rotO(soup, 500, 450);
    return { soup };
  }
  function pondHouseBG(T) {
    const { el, paper } = T, b = T.bg;
    sky(T, C.sky);
    el('circle', { cx: 150, cy: 90, r: 40, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 320 Q250 250 520 300 Q780 240 1200 300 V600 H-200 Z', fill: '#b9a25a' }]]);
    paper(b, [['rect', { x: -200, y: 420, width: 1400, height: 400, fill: C.grass }]]);
    paper(b, [['ellipse', { cx: 230, cy: 446, rx: 260, ry: 28, fill: C.water }], ['ellipse', { cx: 230, cy: 446, rx: 220, ry: 18, fill: C.lav }]]);
    for (let i = 0; i < 7; i++) {
      const x = 470 + i * 14;
      paper(b, [['path', { d: `M${x} 480 Q${x - 4} 420 ${x + 2} ${380 - (i % 3) * 20}`, stroke: C.pine, 'stroke-width': 5, fill: 'none' }], ['ellipse', { cx: x + 2, cy: 392 - (i % 3) * 20, rx: 5, ry: 14, fill: C.bark }]]);
    }
    paper(b, [
      ['rect', { x: 740, y: 300, width: 210, height: 160, fill: C.cream }],
      ['path', { d: 'M710 310 Q845 190 980 310 Z', fill: C.gold }],
      ['rect', { x: 820, y: 360, width: 56, height: 100, rx: 26, fill: C.bark }],
      ['circle', { cx: 775, cy: 360, r: 18, fill: C.sky, stroke: C.bark, 'stroke-width': 5 }],
    ]);
  }
  function lowBG(T) {
    const { el, paper } = T, b = T.bg;
    sky(T, C.wall);
    paper(b, [['path', { d: 'M-200 -200 H1200 V150 H-200 Z', fill: '#C9A26A' }]]);
    for (let i = -4; i <= 4; i++) el('path', { d: `M${500 + i * 150} 150 L${500 + i * 70} -40`, stroke: C.bark, 'stroke-width': 16 }, b);
    el('rect', { x: -200, y: 140, width: 1400, height: 14, fill: C.bark }, b);
    paper(b, [['rect', { x: 110, y: 200, width: 170, height: 150, rx: 10, fill: C.sky }]]);
    el('ellipse', { cx: 195, cy: 330, rx: 70, ry: 14, fill: C.water }, b);
    el('path', { d: 'M110 275 H280 M195 200 V350', stroke: C.bark, 'stroke-width': 7 }, b);
    el('rect', { x: 110, y: 200, width: 170, height: 150, rx: 10, fill: 'none', stroke: C.bark, 'stroke-width': 10 }, b);
    paper(b, [['rect', { x: -200, y: 500, width: 1400, height: 300, fill: '#8a6344' }]]);
  }
  function lowTable(T, parent) {
    T.paper(parent, [
      ['rect', { x: 480, y: 440, width: 14, height: 62, fill: C.bark }], ['rect', { x: 626, y: 440, width: 14, height: 62, fill: C.bark }],
      ['rect', { x: 450, y: 424, width: 220, height: 20, rx: 8, fill: '#C9A26A' }],
    ]);
  }
  function splitBG(T) {
    const { el, paper } = T, b = T.bg;
    sky(T, C.cream);
    paper(b, [['rect', { x: -200, y: -200, width: 620, height: 1000, fill: '#8a6344' }], ['rect', { x: -200, y: 480, width: 620, height: 300, fill: C.bark }]]);
    paper(b, [['rect', { x: 580, y: -200, width: 620, height: 1000, fill: C.wall }], ['rect', { x: 580, y: 480, width: 620, height: 300, fill: C.wood }]]);
    el('circle', { cx: 120, cy: 110, r: 40, fill: C.sky, stroke: C.ink, 'stroke-width': 6 }, b);
    el('rect', { x: 860, y: 70, width: 90, height: 80, rx: 8, fill: C.sky, stroke: C.bark, 'stroke-width': 6 }, b);
    el('rect', { x: 420, y: -200, width: 160, height: 1000, fill: C.cream }, b);
    el('path', { d: 'M420 -200 V800 M580 -200 V800', stroke: C.gold, 'stroke-width': 8 }, b);
  }
  function feastBG(T, night) {
    const { el, paper } = T, b = T.bg;
    sky(T, night ? C.indigo : C.sky);
    if (night) {
      el('circle', { cx: 880, cy: 70, r: 34, fill: C.cream }, b);
      [[90, 60], [260, 40], [520, 30], [700, 55], [960, 150]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 3.5, fill: C.cream }, b));
    } else el('circle', { cx: 860, cy: 80, r: 40, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 300 Q200 220 520 280 Q800 220 1200 290 V600 H-200 Z', fill: night ? '#2a355f' : '#b9a25a' }]]);
    paper(b, [['rect', { x: -200, y: 380, width: 1400, height: 400, fill: night ? '#2f4a3a' : C.grass }]]);
    if (!night) {
      el('path', { d: 'M-20 60 Q500 140 1020 60', stroke: C.bark, 'stroke-width': 3, fill: 'none' }, b);
      for (let i = 0; i < 12; i++) {
        const x = 20 + i * 84, y = 60 + Math.sin((i + .5) / 12 * Math.PI) * 60;
        paper(b, [['path', { d: `M${x - 22} ${y - 6} L${x + 22} ${y - 6} L${x} ${y + 34} Z`, fill: [C.bean, C.gold, C.pine][i % 3] }]]);
      }
    }
  }
  function feastTable(T, parent) {
    T.paper(parent, [
      ['rect', { x: 30, y: 394, width: 940, height: 20, rx: 6, fill: C.wall }],
      ['rect', { x: 40, y: 412, width: 920, height: 96, fill: C.bean }],
      ['path', { d: 'M40 426 H960', stroke: C.gold, 'stroke-width': 6 }],
    ]);
  }

  /* 화면 고정 동그라미 카드 (카메라 영향 없음) — 골라요 배지, 입 모양 확대 카드 */
  function badge(T, x, y, drawIcon, r = 70, magnifier = false) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, document.getElementById('stage'));
    if (magnifier) T.paper(g, [['rect', { x: r * .62, y: r * .62, width: 22, height: 70, rx: 10, fill: C.bark, transform: `rotate(-45 ${r * .62} ${r * .62})` }]]);
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    drawIcon(g);
    g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    return g;
  }
  const ICON = {
    plate: (T, g) => T.paper(g, [['ellipse', { cx: 0, cy: 8, rx: 52, ry: 11, fill: C.cream, stroke: C.gold, 'stroke-width': 3 }], ['ellipse', { cx: 0, cy: 6, rx: 38, ry: 5, fill: C.amber }]]),
    bottle: (T, g) => { const s = T.el('g', { transform: 'translate(0,50) scale(.55)' }, g); DISH.bottle.draw(T, s); },
  };
  const MOUTH = {
    crane: (T, g) => T.paper(g, [['circle', { cx: 34, cy: -6, r: 24, fill: C.snow }], ['circle', { cx: 38, cy: -26, r: 10, fill: C.bean }],
      ['path', { d: 'M16 -14 L-62 2 L16 6 Z', fill: C.gold }], ['circle', { cx: 28, cy: -8, r: 4, fill: C.ink }], ['path', { d: 'M40 16 Q44 40 36 60', stroke: C.ink, 'stroke-width': 14, fill: 'none' }]]),
    fox: (T, g) => T.paper(g, [['circle', { cx: 26, cy: -8, r: 36, fill: C.persimmon }], ['path', { d: 'M4 -26 L-48 -4 L4 16 Z', fill: C.persimmon }],
      ['circle', { cx: -46, cy: -4, r: 7, fill: C.ink }], ['circle', { cx: 18, cy: -18, r: 5, fill: C.ink }], ['ellipse', { cx: -24, cy: 18, rx: 20, ry: 10, fill: C.pink }]]),
    duck: (T, g) => T.paper(g, [['circle', { cx: 30, cy: -12, r: 30, fill: C.snow }], ['path', { d: 'M14 -20 Q-56 -26 -60 -4 Q-56 18 14 8 Z', fill: C.persimmon }], ['circle', { cx: 26, cy: -22, r: 5, fill: C.ink }]]),
    butterfly: (T, g) => T.paper(g, [['circle', { cx: 24, cy: -36, r: 18, fill: C.ink }], ['circle', { cx: 18, cy: -40, r: 4, fill: C.cream }],
      ['path', { d: 'M16 -22 Q-14 -6 -14 22 Q-14 48 12 48 Q34 48 34 30 Q34 16 20 18', stroke: C.bark, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }]]),
  };

  /* ================= 먹기 연출 ================= */
  async function eat(T, g, d) {
    if (g.key === 'crane') {
      const deg = aim(g, CRANE_PIV, CRANE_TIP, [d.x, d.y + DISH[d.key].top * d.scale + 14]);
      await T.anim(g.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${deg}deg)` }, { transform: `rotate(${deg * .85}deg)` }, { transform: `rotate(${deg}deg)` }, { transform: 'rotate(0deg)' }], 900);
      sipSnd(T); T.pop(g.x, g.y - 290 * g.scale, '쪽쪽', C.pine);
    } else if (g.key === 'fox') {
      const deg = aim(g, FOX_PIV, FOX_TIP, [d.x, d.y - 10]);
      g.parts.tongue.setAttribute('opacity', 1);
      await T.anim(g.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${deg}deg)` }, { transform: `rotate(${deg * .8}deg)` }, { transform: `rotate(${deg}deg)` }, { transform: 'rotate(0deg)' }], 900);
      g.parts.tongue.setAttribute('opacity', 0);
      lickSnd(T); T.pop(g.x, g.y - 200 * g.scale, '핥핥', C.bean);
    } else if (g.key === 'duck') {
      AudioFX.animal('duck', .6) || T.tone([500, 380], .15, { type: 'square', vol: .12 });
      await T.anim(g.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${-30 * g.flip}deg)` }, { transform: 'rotate(0deg)' }, { transform: `rotate(${-30 * g.flip}deg)` }, { transform: 'rotate(0deg)' }], 800);
      T.pop(g.x, g.y - 170 * g.scale, '냠냠', C.pine);
    } else {
      const x0 = g.x, y0 = g.y;
      await g.move(d.x, d.y - 40, 500);
      sipSnd(T); T.pop(d.x, d.y - 200, '쪽!', C.bean);
      await T.sleep(300);
      await g.move(x0, y0, 500);
    }
  }

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, actor, camTo, camSnap, josa } = T;
    let fox, crane;

    /* --- 1. 초대장 (숲길 와이드) --- */
    forestBG(T);
    fox = guest(T, T.world, 'fox', 300, 480, 1.1); fox.face('right');
    crane = guest(T, T.world, 'crane', 740, 480, 1.1);
    const inv = actor(T.world, 520, 440, g => drawInvite(T, g), { scale: 1.3 });
    await T.curtain(true);
    await say('숲속에 여우랑 두루미가 살았어요.');
    await say('여우가 초대장을 가져왔어요. 초대장을 톡 눌러 봐요!');
    await T.tap(inv.pos, { prompt: '초대장을 톡 눌러서 두루미에게 줘요!' });
    sfx(T, 'whoosh');
    await inv.move(650, 400, 700);
    sfx(T, 'ding');
    craneCall(T);
    await crane.hop(80, 600);
    T.pop(740, 180, '폴짝!', C.pine);
    await crane.hop(60, 500);
    await say('"와, 고마워!" 두루미가 긴 다리로 폴짝 뛰었어요.');

    /* --- 2. 여우의 부엌 (중간샷) --- */
    let pot;
    await T.sceneCard('여우의 부엌', () => {
      T.clear(); kitchenBG(T);
      fox = guest(T, T.world, 'fox', 360, 470, 1.2); fox.face('right');
      let pp; pot = actor(T.world, 580, 470, g => { pp = drawPot(T, g); }, { scale: 1.05 }); pot.parts = pp;
      camSnap(480, 340, 1.3);
    }, fox.pos);
    await say('여우가 맛있는 수프를 끓여요.');
    await say('냄비를 톡톡 눌러서 저어 볼까요?');
    await T.mash(pot.pos, { count: 5, prompt: '냄비를 톡톡 눌러서 휘휘 저어요!', onStep: i => {
      pot.parts.spoon.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-22deg)' }, { transform: 'rotate(22deg)' }, { transform: 'rotate(0deg)' }], { duration: 420 });
      for (let k = 0; k < 2; k++) {
        const b = el('circle', { cx: -60 + Math.random() * 120, cy: -126, r: 8 + Math.random() * 6, fill: C.cream, opacity: .9 }, pot.parts.bubbles);
        b.animate([{ transform: 'translateY(0)', opacity: .9 }, { transform: 'translateY(-60px)', opacity: 0 }], { duration: 900, delay: k * 150, fill: 'forwards' });
        setTimeout(() => b.remove(), 1200);
      }
      bubbleSnd(T);
      if (i % 2) T.pop(600, 280, '보글', C.bean);
    } });
    await sleep(400);
    AudioFX.laugh();
    await fox.wiggle(8, 500);
    await say('여우가 킥킥 웃어요. "납작 접시에 담아야지~"');

    /* --- 3. 납작 접시 (하이앵글) --- */
    let tbl;
    await T.sceneCard('납작 접시', () => {
      T.clear(); camSnap(500, 280, 1); highBG(T);
      fox = guest(T, T.world, 'fox', 190, 440, 1.1); fox.face('right');
      crane = guest(T, T.world, 'crane', 730, 450, 1.2);
      tbl = highTable(T, T.world);
    }, fox.pos);
    await say('두루미가 놀러 왔어요. 그런데 접시가 아주 납작해요!');
    await say('두루미 부리를 톡 눌러서 먹게 해 줘요!');
    const words = ['콕!', '딱!', '딱딱!'];
    for (let i = 0; i < 3; i++) {
      await T.tap(crane.parts.head, { prompt: '두루미 부리를 톡 눌러 봐요!' });
      const deg = aim(crane, CRANE_PIV, CRANE_TIP, [640, 418]);
      await T.anim(crane.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${deg}deg)` }], 260);
      peckSnd(T); T.pop(640, 330, words[i], C.bean);
      await sleep(260);
      await T.anim(crane.parts.head, [{ transform: `rotate(${deg}deg)` }, { transform: 'rotate(0deg)' }], 320);
    }
    await T.cut(svg => {
      el('ellipse', { cx: 200, cy: 258, rx: 170, ry: 26, fill: C.cream, stroke: C.gold, 'stroke-width': 6 }, svg);
      el('ellipse', { cx: 200, cy: 256, rx: 130, ry: 14, fill: C.amber }, svg);
      el('path', { d: 'M290 70 L150 236 L306 104 Z', fill: C.gold }, svg);
      el('circle', { cx: 320, cy: 80, r: 44, fill: C.snow }, svg);
      el('circle', { cx: 330, cy: 44, r: 18, fill: C.bean }, svg);
      el('circle', { cx: 306, cy: 78, r: 6, fill: C.ink }, svg);
      el('text', { x: 110, y: 120, 'text-anchor': 'middle', 'font-size': 64, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: '딱딱!' }, svg);
    }, { sfx: 'poke' });
    await say('어머나, 부리 끝만 딱딱 닿아요. 수프를 먹을 수가 없어요.');
    await fox.move(235, 440, 500);
    fox.parts.tongue.setAttribute('opacity', 1);
    const fdeg = aim(fox, FOX_PIV, FOX_TIP, [390, 440]);
    fox.parts.head.style.transform = `rotate(${fdeg}deg)`;
    const licking = fox.parts.head.animate([{ transform: `rotate(${fdeg}deg)` }, { transform: `rotate(${fdeg * .7}deg)` }, { transform: `rotate(${fdeg}deg)` }], { duration: 420, iterations: Infinity });
    const lickT = setInterval(() => { lickSnd(T); T.pop(330, 300, '핥핥', C.bean); }, 900);
    lickSnd(T); T.pop(330, 300, '핥핥', C.bean);
    await T.anim(tbl.soup, [{ transform: 'scale(1)' }, { transform: 'scale(0)' }], 2400);
    clearInterval(lickT); licking.cancel();
    fox.parts.head.style.transform = ''; fox.parts.tongue.setAttribute('opacity', 0);
    await T.cut(svg => {
      el('ellipse', { cx: 200, cy: 262, rx: 170, ry: 24, fill: C.cream, stroke: C.gold, 'stroke-width': 6 }, svg);
      el('path', { d: 'M110 70 L150 20 L170 80 Z M230 80 L250 20 L290 70 Z', fill: C.persimmon }, svg);
      el('circle', { cx: 200, cy: 130, r: 90, fill: C.persimmon }, svg);
      el('path', { d: 'M140 150 Q200 210 260 150 Q200 190 140 150 Z', fill: C.cream }, svg);
      el('circle', { cx: 165, cy: 110, r: 9, fill: C.ink }, svg); el('circle', { cx: 235, cy: 110, r: 9, fill: C.ink }, svg);
      el('circle', { cx: 200, cy: 150, r: 12, fill: C.ink }, svg);
      el('ellipse', { cx: 200, cy: 222, rx: 30, ry: 36, fill: C.pink }, svg);
      el('text', { x: 330, y: 80, 'text-anchor': 'middle', 'font-size': 56, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: '핥핥!' }, svg);
    }, { hold: 2200 });
    crane.parts.head.style.transform = 'rotate(-18deg)';
    T.tone([500, 300], .5, { type: 'sine', vol: .14 });
    T.pop(740, 120, '꼬르륵', C.indigo);
    await say('여우는 혀로 핥핥, 다 먹었어요. 두루미는 배가 꼬르륵, 속상했어요.');

    /* --- 4. 두루미 초대 (연못가 집 와이드) --- */
    await T.sceneCard('두루미네 집', () => {
      T.clear(); pondHouseBG(T);
      crane = guest(T, T.world, 'crane', 640, 500, 1.1);
      fox = guest(T, T.world, 'fox', -140, 510, 1.1); fox.face('right');
    }, crane.pos);
    craneCall(T);
    await say('며칠 뒤, 이번엔 두루미가 여우를 불렀어요.');
    await say('"여우야, 우리 집에도 놀러 와~"');
    const steps = setInterval(() => sfx(T, 'step_grass', () => T.tone([220, 160], .08, { type: 'triangle', vol: .1 }), .5), 380);
    await fox.move(380, 510, 1800);
    clearInterval(steps);
    await fox.hop(40);
    await say('여우가 신이 났어요. "좋아! 맛있는 거 먹어야지!"');

    /* --- 5. 긴 병 (로우앵글) --- */
    let bottle;
    await T.sceneCard('긴 병', () => {
      T.clear(); lowBG(T);
      fox = guest(T, T.world, 'fox', 300, 500, 1.0); fox.face('right');
      crane = guest(T, T.world, 'crane', 730, 500, 1.5);
      lowTable(T, T.world);
      bottle = dish(T, T.world, 'bottle', 560, 432, 1.3);
    }, fox.pos);
    await say('와, 병이 탑처럼 높아요! 목이 아주 길어요.');
    await say('여우 코를 톡 눌러서 먹게 해 줘요!');
    const mouth = [560, bottle.y + DISH.bottle.top * 1.3];
    // 1: 킁킁
    await T.tap(fox.parts.head, { prompt: '여우 코를 톡 눌러 봐요!' });
    await fox.move(360, 500, 400);
    await fox.wiggle(5, 400);
    T.tone([1200, 900], .08, { type: 'sine', vol: .1 }); T.pop(470, 360, '킁킁', C.bark);
    await sleep(400);
    // 2: 영차
    await T.tap(fox.parts.head, { prompt: '여우 코를 한 번 더 톡!' });
    await T.anim(fox.body, [{ transform: 'scale(1,1)' }, { transform: 'scale(.95,1.15)' }, { transform: 'scale(.95,1.15)' }, { transform: 'scale(1,1)' }], 800);
    T.pop(360, 250, '영차!', C.pine);
    await sleep(300);
    // 3: 폴짝 → 코가 쏙
    await T.tap(fox.parts.head, { prompt: '여우 코를 톡! 폴짝 뛰어 봐요!' });
    const sx = mouth[0] - 130 * fox.scale, sy = mouth[1] + 8 + 94 * fox.scale;
    sfx(T, 'whoosh');
    await Promise.all([
      fox.move(sx - 30, sy - 70, 380, 'ease-out'),
      T.anim(fox.parts.all, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-35deg)' }], 380),
    ]);
    await fox.move(sx, sy, 200, 'ease-in');
    sfx(T, 'pop'); T.shake();
    const kick = fox.parts.legs.animate([{ transform: 'rotate(-14deg)' }, { transform: 'rotate(14deg)' }], { duration: 180, iterations: Infinity, direction: 'alternate' });
    const wag = fox.parts.tail.animate([{ transform: 'rotate(-16deg)' }, { transform: 'rotate(16deg)' }], { duration: 260, iterations: Infinity, direction: 'alternate' });
    await T.cut(svg => {
      el('rect', { x: 170, y: 150, width: 60, height: 150, fill: C.pine }, svg);
      el('rect', { x: 158, y: 138, width: 84, height: 22, rx: 6, fill: C.gold }, svg);
      el('path', { d: 'M40 20 L110 0 L215 150 L185 160 Z', fill: C.persimmon }, svg);
      el('circle', { cx: 70, cy: 30, r: 60, fill: C.persimmon }, svg);
      el('circle', { cx: 80, cy: 20, r: 8, fill: C.ink }, svg);
      el('text', { x: 310, y: 110, 'text-anchor': 'middle', 'font-size': 80, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: '쏙!' }, svg);
    }, { hold: 2200 });
    await say('어머나! 여우 코가 병에 쏙 끼었어요!');
    await sleep(600);
    kick.cancel(); wag.cancel();
    sfx(T, 'pop'); T.pop(mouth[0], mouth[1] - 40, '뿅!', C.bean);
    fox.parts.all.style.transform = '';
    await fox.move(330, 380, 360, 'ease-out');
    await fox.move(300, 500, 320, 'ease-in');
    sfx(T, 'thud'); T.shake();
    fox.body.style.transform = 'scale(1.08,.86)';
    T.pop(300, 380, '쿵!', C.bark);
    const stars = el('g', {}, T.fx);
    for (let k = 0; k < 3; k++) el('path', { d: 'M0 -10 L3 -3 10 -3 4 2 6 10 0 5 -6 10 -4 2 -10 -3 -3 -3 Z', fill: '#FFD54F', transform: `rotate(${k * 120}) translate(34 0)` }, stars);
    stars.animate([{ transform: 'translate(250px,320px) rotate(0)' }, { transform: 'translate(250px,320px) rotate(360deg)' }], { duration: 1100, iterations: 3 });
    [0, .15, .3].forEach(w => T.tone([700, 500], .12, { type: 'triangle', vol: .14, when: w }));
    await say('뿅! 코가 빠졌어요. 엉덩방아 쿵!');
    stars.remove();
    const cdeg = aim(crane, CRANE_PIV, CRANE_TIP, [mouth[0], mouth[1] + 20]);
    for (let k = 0; k < 2; k++) {
      await T.anim(crane.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${cdeg}deg)` }], 300);
      sipSnd(T); T.pop(760, 110, '쪽쪽', C.pine);
      await sleep(350);
      await T.anim(crane.parts.head, [{ transform: `rotate(${cdeg}deg)` }, { transform: 'rotate(0deg)' }], 300);
    }
    fox.body.style.transform = '';
    fox.parts.head.style.transform = 'rotate(-15deg)';
    T.tone([500, 300], .5, { type: 'sine', vol: .14 });
    await say('두루미는 긴 부리로 쪽쪽 먹었어요. 여우는 배가 꼬르륵, 속상했어요.');

    /* --- 6. 왜 못 먹었을까? (분할 화면) --- */
    let plateL, bottleR;
    await T.sceneCard('왜 못 먹었을까?', () => {
      T.clear(); splitBG(T);
      crane = guest(T, T.world, 'crane', 150, 480, .95); crane.face('right');
      plateL = dish(T, T.world, 'plate', 300, 480, .9);
      fox = guest(T, T.world, 'fox', 870, 480, 1.0);
      bottleR = dish(T, T.world, 'bottle', 700, 480, .95);
      crane.parts.head.style.transform = 'rotate(15deg)';
      fox.parts.head.style.transform = 'rotate(-15deg)';
    }, fox.pos);
    await say('둘 다 못 먹었어요. 왜 그랬을까요?');
    const qs = [
      { who: crane, q: '두루미는 부리가 길쭉해요. 어떤 그릇이 좋을까요?', ok: 'bottle', no: 'plate',
        where: '길쭉한 부리가 쏙 들어가는 그릇을 찾아봐요!', old: () => plateL, at: [280, 480] },
      { who: fox, q: '여우는 입이 짧아요. 혀로 핥아 먹어요. 어떤 그릇이 좋을까요?', ok: 'plate', no: 'bottle',
        where: '혀로 핥기 좋은 납작한 그릇을 찾아봐요!', old: () => bottleR, at: [720, 480] },
    ];
    for (const r of qs) {
      const up = Math.random() < .5;
      const bOk = badge(T, 500, up ? 160 : 380, g => ICON[r.ok](T, g));
      const bNo = badge(T, 500, up ? 380 : 160, g => ICON[r.no](T, g));
      await say(r.q);
      await T.choose([{ el: bOk, ok: true }, { el: bNo, ok: false }], { prompt: r.q, where: r.where,
        who: `${josa(DISH[r.ok].name, '이에요/예요')}! 반짝이는 걸 눌러 봐요!` });
      bOk.remove(); bNo.remove();
      const o = r.old(); await T.anim(o.pos, [{ opacity: 1 }, { opacity: 0 }], 300); o.pos.remove();
      const nd = dish(T, T.world, r.ok, r.at[0], r.at[1], r.ok === 'bottle' ? .95 : .9);
      nd.pos.animate([{ opacity: 0 }, { opacity: 1 }], 300);
      sfx(T, 'pop');
      r.who.parts.head.style.transform = '';
      await eat(T, r.who, nd);
      await r.who.hop(30);
      await say(`맞아요! ${josa(GUESTS[r.who.key].name, '은/는')} ${josa(DISH[r.ok].name, '이/가')} 좋아요.`);
    }

    /* --- 7. 알맞은 그릇 (잔치 식탁 정면, 메인) --- */
    let gL, tL, dL;
    await T.sceneCard('알맞은 그릇', () => {
      T.clear(); feastBG(T, false);
      gL = el('g', {}, T.world); tL = el('g', {}, T.world); dL = el('g', {}, T.world);
      feastTable(T, tL);
    }, fox.pos);
    await say('여우랑 두루미가 함께 잔치를 열었어요. 손님들도 와요!');
    await say('입 모양을 잘 보고, 알맞은 그릇을 골라 줘요!');
    const ROUNDS = [
      { key: 'crane', ok: 'bottle', opts: ['bottle', 'plate', 'bowl'], q: '두루미는 부리가 길쭉해요. 어떤 그릇이 좋을까요?', where: '길쭉한 부리가 쏙 들어가는 걸 찾아봐요!' },
      { key: 'fox', ok: 'plate', opts: ['plate', 'bottle', 'flower'], q: '여우는 입이 짧아요. 어떤 그릇이 좋을까요?', where: '혀로 핥기 좋은 납작한 걸 찾아봐요!' },
      { key: 'duck', ok: 'bowl', opts: ['bowl', 'bottle', 'flower'], q: '오리는 부리가 넓적해요. 어떤 그릇이 좋을까요?', where: '넓적한 부리로 푹 떠먹기 좋은 걸 찾아봐요!' },
      { key: 'butterfly', ok: 'flower', opts: ['flower', 'plate', 'bowl'], q: '나비는 입이 빨대 같아요. 무엇이 좋을까요?', where: '빨대 입으로 쪽 빨아 먹는 걸 찾아봐요!' },
    ];
    const SLOTS = [440, 630, 820];
    for (const r of ROUNDS) {
      const gy = r.key === 'butterfly' ? 350 : 400;
      const g = guest(T, gL, r.key, 1150, gy);
      const name = GUESTS[r.key].name;
      const walk = setInterval(() => sfx(T, 'step_grass', () => T.tone([220, 160], .08, { type: 'triangle', vol: .1 }), .4), 400);
      await g.move(190, gy, 1500);
      clearInterval(walk);
      g.face('right');
      if (r.key === 'duck') AudioFX.animal('duck', .6); else if (r.key === 'crane') craneCall(T);
      await g.hop(24);
      await say(`${josa(name, '이/가')} 왔어요!`);
      const card = badge(T, 500, 118, gg => MOUTH[r.key](T, gg), 84, true);
      sfx(T, 'ding');
      const opts = shuffle(r.opts).map((k, i) => dish(T, dL, k, SLOTS[i], 404, 1));
      await say(r.q);
      const res = await T.choose(opts.map(d => ({ el: d.pos, ok: d.key === r.ok, onWrong: async () => {
        await Promise.all([T.anim(d.pos, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 400), g.wiggle(10, 400)]);
      } })), { prompt: r.q, where: r.where, who: `${josa(DISH[r.ok].name, '이에요/예요')}! 반짝이는 걸 눌러 봐요!` });
      const good = opts.find(d => d.key === r.ok);
      await Promise.all(opts.filter(d => d !== good).map(d => T.anim(d.pos, [{ opacity: 1 }, { opacity: 0 }], 300)));
      opts.filter(d => d !== good).forEach(d => d.pos.remove());
      await good.move(320, 404, 600);
      await eat(T, g, good);
      await say(`맞아요! ${josa(name, '은/는')} ${josa(DISH[r.ok].name, '이/가')} 좋아요.`);
      card.remove();
      g.face('right');
      await Promise.all([g.move(1150, gy, 1200), good.move(1280, 404, 1200)]);
      g.pos.remove(); good.pos.remove();
    }

    /* --- 8. 함께 먹어요 (잔치 와이드, 등불) --- */
    const party = {};
    const plates = {};
    await T.sceneCard('함께 먹어요', () => {
      T.clear(); feastBG(T, true);
      [150, 390, 610, 850].forEach(x => lantern(T, T.bg, x, 110));
      gL = el('g', {}, T.world); tL = el('g', {}, T.world); dL = el('g', {}, T.world);
      party.duck = guest(T, gL, 'duck', 85, 400, 1.2); party.duck.face('right');
      party.fox = guest(T, gL, 'fox', 385, 400, 1.1); party.fox.face('right');
      party.crane = guest(T, gL, 'crane', 725, 400, 1.1);
      party.butterfly = guest(T, gL, 'butterfly', 915, 340, 1.3);
      feastTable(T, tL);
      plates.duck = dish(T, dL, 'bowl', 180, 404, .9);
      plates.fox = dish(T, dL, 'plate', 505, 404, .9);
      plates.crane = dish(T, dL, 'bottle', 612, 404, .95);
      plates.butterfly = dish(T, dL, 'flower', 840, 404, 1);
    });
    await say('등불이 반짝, 모두 모여 잔치를 해요.');
    party.fox.parts.blush.setAttribute('opacity', 1);
    party.fox.parts.head.style.transform = 'rotate(-18deg)';
    await say('여우가 말했어요. "두루미야, 미안해."');
    party.fox.parts.head.style.transform = '';
    party.crane.parts.head.style.transform = 'rotate(-14deg)';
    await say('두루미도 말했어요. "여우야, 나도 미안해."');
    party.crane.parts.head.style.transform = '';
    await T.cut(svg => {
      el('rect', { x: -10, y: 130, width: 200, height: 56, rx: 28, fill: C.persimmon }, svg);
      el('circle', { cx: 190, cy: 158, r: 36, fill: C.persimmon }, svg);
      el('path', { d: 'M410 120 Q300 130 216 150 Q300 200 410 196 Z', fill: C.snow }, svg);
      el('path', { d: 'M410 150 Q340 160 300 176', stroke: C.ink, 'stroke-width': 6, fill: 'none' }, svg);
      [[120, 70], [280, 70]].forEach(([x, y]) => el('path', { d: `M${x} ${y + 14} C${x - 30} ${y - 10} ${x - 10} ${y - 30} ${x} ${y - 12} C${x + 10} ${y - 30} ${x + 30} ${y - 10} ${x} ${y + 14} Z`, fill: C.bean }, svg));
      el('text', { x: 200, y: 262, 'text-anchor': 'middle', 'font-size': 60, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: '미안해!' }, svg);
    }, { sfx: 'ding', hold: 2600 });
    party.fox.parts.blush.setAttribute('opacity', 0);
    await Promise.all([party.fox.hop(30), party.crane.hop(30)]);
    await say('"괜찮아!" 둘은 다시 사이좋은 친구가 되었어요.');
    await say('친구들을 톡톡 눌러 봐요. 냠냠 맛있게 먹어요!');
    const busyEat = {};
    await T.free(Object.keys(party).map(k => ({ el: party[k].pos, onTap: async () => {
      if (busyEat[k]) return; busyEat[k] = true;
      await eat(T, party[k], plates[k]); busyEat[k] = false;
    } })), 15000);
    T.confetti(); AudioFX.fanfare && AudioFX.fanfare();
    await say('배부르게 먹고, 모두 행복하게 웃었답니다.');
    return '친구 입장이 되어 보면 모두 즐거워요!';
  }

  Tale.mount({ title: '여우와 두루미', subtitle: '누구에게 어떤 그릇이 좋을까?', run: T => run(Tale.api) });
})();
