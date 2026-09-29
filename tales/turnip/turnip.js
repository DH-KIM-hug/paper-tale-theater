/* 커다란 순무 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §4
   할아버지 혼자서는 안 뽑히는 순무. 할머니 → 손녀 → 강아지 → 고양이 → 생쥐까지 차례로 불러 다 함께 "영차!"
   학습: 순서 기억(6단계) · 크기 서열 · 많을수록 힘이 세다 · 작은 힘도 필요하다.
   웃음 컷: 엉덩방아 · 개와 고양이 째려보기 · "너무 작아" · 쑥! 벌렁 도미노 */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32', bean: '#A93B32',
    indigo: '#1F2A56', persimmon: '#E8703A', amber: '#F2B366', snow: '#F4F6FA', ink: '#2E241C', pink: '#E8A0A0',
    skin: '#EDC9A0', soil: '#8A6440', soilDark: '#6E4E32', spring: '#DCE8C8', summer: '#F2DFA8' };

  /* ================= 인물 (모두 왼쪽을 본다. 발끝 = 0,0) ================= */
  const DRAW = {
    grandpa(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['rect', { x: -18, y: -62, width: 14, height: 62, rx: 5, fill: C.bark }], ['rect', { x: 4, y: -62, width: 14, height: 62, rx: 5, fill: C.bark }],
        ['rect', { x: -22, y: -10, width: 20, height: 10, rx: 4, fill: C.ink }], ['rect', { x: 0, y: -10, width: 20, height: 10, rx: 4, fill: C.ink }],
        ['rect', { x: -30, y: -134, width: 60, height: 80, rx: 20, fill: C.pine }],
        ['rect', { x: -30, y: -72, width: 60, height: 8, fill: C.gold }],
        ['circle', { cx: 0, cy: -156, r: 26, fill: C.skin }],
        ['ellipse', { cx: -6, cy: -138, rx: 20, ry: 16, fill: C.snow }],
        ['path', { d: 'M-28 -164 Q0 -196 28 -164 Z', fill: C.bark }], ['rect', { x: -34, y: -168, width: 64, height: 7, rx: 3, fill: C.bark }],
      ]);
      el('circle', { cx: -13, cy: -156, r: 3.5, fill: C.ink }, g);
      el('circle', { cx: -26, cy: -150, r: 6, fill: '#D99A7A' }, g);
      el('path', { d: 'M-6 -118 L-56 -104', stroke: C.pine, 'stroke-width': 17, 'stroke-linecap': 'round' }, g);
      el('circle', { cx: -60, cy: -103, r: 9, fill: C.skin }, g);
    },
    grandma(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['rect', { x: -14, y: -24, width: 10, height: 24, fill: C.bark }], ['rect', { x: 4, y: -24, width: 10, height: 24, fill: C.bark }],
        ['path', { d: 'M-24 -96 L24 -96 L38 -18 L-38 -18 Z', fill: C.persimmon }],
        ['path', { d: 'M-18 -80 L10 -80 L14 -26 L-22 -26 Z', fill: C.cream }],
        ['rect', { x: -24, y: -124, width: 48, height: 36, rx: 14, fill: C.snow }],
        ['circle', { cx: 0, cy: -142, r: 23, fill: C.skin }],
        ['path', { d: 'M-26 -140 A26 26 0 0 1 26 -140 L34 -118 L20 -128 L-24 -134 Z', fill: C.bean }],
      ]);
      el('circle', { cx: -11, cy: -142, r: 3.5, fill: C.ink }, g);
      el('path', { d: 'M-16 -130 Q-10 -125 -4 -130', stroke: C.ink, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, g);
      el('circle', { cx: -4, cy: -134, r: 4, fill: C.pink, opacity: .8 }, g);
      el('path', { d: 'M-4 -110 L-48 -98', stroke: C.snow, 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
      el('circle', { cx: -52, cy: -97, r: 8, fill: C.skin }, g);
    },
    girl(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['rect', { x: -12, y: -26, width: 9, height: 26, fill: C.skin }], ['rect', { x: 3, y: -26, width: 9, height: 26, fill: C.skin }],
        ['rect', { x: -14, y: -6, width: 12, height: 6, rx: 3, fill: C.bean }], ['rect', { x: 2, y: -6, width: 12, height: 6, rx: 3, fill: C.bean }],
        ['path', { d: 'M-12 -78 L12 -78 L28 -22 L-28 -22 Z', fill: C.bean }],
        ['circle', { cx: 18, cy: -96, r: 10, fill: '#5A3D29' }],
        ['circle', { cx: 0, cy: -96, r: 20, fill: C.skin }],
        ['path', { d: 'M-20 -98 A20 20 0 0 1 20 -98 L20 -90 Q4 -106 -16 -96 Z', fill: '#5A3D29' }],
      ]);
      el('circle', { cx: -9, cy: -96, r: 3.2, fill: C.ink }, g);
      el('circle', { cx: -4, cy: -88, r: 4, fill: C.pink, opacity: .8 }, g);
      el('path', { d: 'M-2 -70 L-36 -60', stroke: C.bean, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
      el('circle', { cx: -39, cy: -59, r: 6.5, fill: C.skin }, g);
    },
    dog(T, g) {
      const { paper, el } = T;
      paper(g, [
        ...[-30, -14, 16, 32].map(x => ['rect', { x: x - 5, y: -28, width: 11, height: 28, rx: 4, fill: '#9C6A3E' }]),
        ['path', { d: 'M40 -48 Q58 -64 56 -86', stroke: '#B07A4A', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }],
        ['ellipse', { cx: 4, cy: -40, rx: 42, ry: 21, fill: '#B07A4A' }],
        ['circle', { cx: -36, cy: -62, r: 21, fill: '#B07A4A' }],
        ['ellipse', { cx: -54, cy: -56, rx: 14, ry: 10, fill: '#D9B48A' }],
        ['ellipse', { cx: -26, cy: -66, rx: 8, ry: 17, fill: C.bark, transform: 'rotate(18 -26 -66)' }],
      ]);
      el('circle', { cx: -66, cy: -59, r: 4.5, fill: C.ink }, g);
      el('circle', { cx: -42, cy: -70, r: 3.5, fill: C.ink }, g);
      el('rect', { x: -28, y: -50, width: 14, height: 6, rx: 3, fill: C.bean }, g);
    },
    cat(T, g) {
      const { paper, el } = T;
      paper(g, [
        ...[-20, -6, 16, 28].map(x => ['rect', { x: x - 4, y: -22, width: 9, height: 22, rx: 4, fill: '#C8913E' }]),
        ['path', { d: 'M30 -34 Q52 -40 46 -82', stroke: C.gold, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }],
        ['ellipse', { cx: 6, cy: -32, rx: 32, ry: 17, fill: C.gold }],
        ['path', { d: 'M-40 -60 L-36 -80 L-24 -64 Z M-18 -64 L-10 -80 L-6 -58 Z', fill: C.gold }],
        ['circle', { cx: -24, cy: -50, r: 18, fill: C.gold }],
      ]);
      [-2, 10, 22].forEach(x => el('rect', { x, y: -46, width: 5, height: 14, rx: 2, fill: C.persimmon }, g));
      const eyes = el('g', {}, g);
      el('circle', { cx: -32, cy: -54, r: 3.2, fill: C.ink }, eyes); el('circle', { cx: -18, cy: -54, r: 3.2, fill: C.ink }, eyes);
      el('circle', { cx: -27, cy: -45, r: 2.5, fill: C.pink }, g);
      el('path', { d: 'M-34 -44 L-50 -46 M-34 -41 L-50 -38', stroke: C.ink, 'stroke-width': 1.5 }, g);
    },
    mouse(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['path', { d: 'M20 -10 Q36 0 46 -16', stroke: C.pink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }],
        ['ellipse', { cx: 4, cy: -15, rx: 20, ry: 14, fill: '#9A938C' }],
        ['circle', { cx: -14, cy: -22, r: 11, fill: '#9A938C' }],
        ['circle', { cx: -8, cy: -35, r: 9, fill: '#9A938C' }],
      ]);
      el('circle', { cx: -8, cy: -35, r: 5, fill: C.pink }, g);
      el('circle', { cx: -26, cy: -21, r: 3, fill: C.pink }, g);
      el('circle', { cx: -17, cy: -25, r: 2.4, fill: C.ink }, g);
      [-2, 8].forEach(x => el('rect', { x, y: -4, width: 5, height: 4, rx: 2, fill: C.pink }, g));
    },
    cow(T, g) {
      T.paper(g, [
        ['rect', { x: -40, y: -46, width: 14, height: 46, fill: C.cream }], ['rect', { x: 26, y: -46, width: 14, height: 46, fill: C.cream }],
        ['rect', { x: -50, y: -100, width: 100, height: 64, rx: 26, fill: C.cream }],
        ['circle', { cx: 10, cy: -80, r: 16, fill: C.ink }],
        ['rect', { x: -78, y: -122, width: 42, height: 50, rx: 18, fill: C.cream }],
        ['ellipse', { cx: -58, cy: -80, rx: 18, ry: 12, fill: C.pink }],
        ['path', { d: 'M-74 -120 L-80 -134 M-42 -120 L-36 -134', stroke: C.gold, 'stroke-width': 6, 'stroke-linecap': 'round' }],
      ]);
      T.el('circle', { cx: -66, cy: -104, r: 3.5, fill: C.ink }, g);
    },
    pig(T, g) {
      T.paper(g, [
        ...[-30, -12, 12, 30].map(x => ['rect', { x: x - 5, y: -24, width: 11, height: 24, rx: 4, fill: '#E39A95' }]),
        ['ellipse', { cx: 0, cy: -44, rx: 44, ry: 28, fill: C.pink }],
        ['circle', { cx: -36, cy: -56, r: 22, fill: C.pink }],
        ['path', { d: 'M-44 -76 L-40 -90 L-30 -76 Z', fill: '#E39A95' }],
        ['ellipse', { cx: -56, cy: -52, rx: 9, ry: 11, fill: '#E39A95' }],
      ]);
      T.el('circle', { cx: -44, cy: -62, r: 3.2, fill: C.ink }, g);
    },
  };
  const CAST = [
    { key: 'grandpa', name: '할아버지', h: 184 },
    { key: 'grandma', name: '할머니', h: 168 },
    { key: 'girl', name: '손녀', h: 120 },
    { key: 'dog', name: '강아지', h: 86 },
    { key: 'cat', name: '고양이', h: 82 },
    { key: 'mouse', name: '생쥐', h: 44 },
  ];
  const LINE_X = [330, 422, 502, 584, 668, 734];
  const GROUND = 480;
  const POSE = {
    stand: () => 'translate(0px,0px) rotate(0deg) scale(1,1)',
    pull: d => `translate(0px,0px) rotate(${d}deg) scale(1,1)`,
    sit: k => ['dog', 'cat', 'mouse'].includes(k) ? 'translate(0px,0px) rotate(8deg) scale(1.05,.8)' : 'translate(0px,0px) rotate(12deg) scale(1,.72)',
    flop: k => ({ dog: 'translate(0px,-70px) rotate(180deg) scale(1,1)', cat: 'translate(0px,-58px) rotate(180deg) scale(1,1)',
      mouse: 'translate(0px,-34px) rotate(180deg) scale(1,1)' })[k] || 'translate(0px,-30px) rotate(80deg) scale(1,1)',
  };

  /* ================= 순무 ================= */
  function drawTurnip(T, g) {
    const { paper, el } = T;
    paper(g, [
      ['path', { d: 'M-8 140 Q0 190 6 210 Q10 180 8 140 Z', fill: C.cream }],
      ['ellipse', { cx: 0, cy: 60, rx: 110, ry: 95, fill: C.snow }],
      ['path', { d: 'M-104 34 Q-100 -34 0 -36 Q100 -34 104 34 Q60 10 0 12 Q-60 10 -104 34 Z', fill: C.bean }],
    ]);
    const leaves = el('g', {}, g);
    [[-42, 170, C.pine], [-20, 200, C.leaf], [0, 214, C.pine], [20, 196, C.leaf], [42, 172, C.pine]].forEach(([a, L, f]) =>
      paper(leaves, [['path', { d: `M0 -30 Q-44 ${-30 - L * .55} 0 ${-30 - L} Q44 ${-30 - L * .55} 0 -30 Z`, fill: f, transform: `rotate(${a} 0 -30)` }],
        ['path', { d: `M0 -30 L0 ${-30 - L * .8}`, stroke: '#2f5a3f', 'stroke-width': 3, transform: `rotate(${a} 0 -30)` }]]));
    el('rect', { x: -130, y: -250, width: 260, height: 290, fill: '#fff', opacity: 0 }, g); // 누르기 쉬운 넓은 자리
    leaves.style.transformBox = 'view-box'; leaves.style.transformOrigin = '0 -30px';
    return leaves;
  }

  /* ================= 배경 ================= */
  function sky(T, fill) { const r = T.el('rect', { x: -400, y: -400, width: 1800, height: 1400, fill }, T.bg); r.style.transition = 'fill 1.2s'; return r; }
  function cabin(T, p, x, y, s = 1) {
    const g = T.el('g', { transform: `translate(${x},${y}) scale(${s})` }, p);
    T.paper(g, [
      ['rect', { x: -80, y: -100, width: 160, height: 100, fill: C.bark }],
      ['path', { d: 'M-100 -96 L0 -170 L100 -96 Z', fill: C.bean }],
      ['rect', { x: -60, y: -76, width: 36, height: 30, fill: C.amber }], ['rect', { x: 14, y: -64, width: 34, height: 64, fill: '#4E3524' }],
    ]);
    for (let i = 1; i < 5; i++) T.el('rect', { x: -80, y: -100 + i * 20, width: 160, height: 3, fill: '#4E3524' }, g);
    return g;
  }
  function gardenBG(T, { season = 'summer', far = true } = {}) {
    const { paper, el } = T, b = T.bg;
    const skyR = sky(T, season === 'spring' ? C.spring : C.summer);
    const sun = el('circle', { cx: 150, cy: 105, r: 44, fill: '#F6D98A' }, b);
    sun.style.transition = 'r .6s, fill .6s';
    paper(b, [['path', { d: 'M-300 400 Q150 290 460 370 Q760 300 1300 380 V700 H-300 Z', fill: '#8FAE82' }]]);
    if (far) cabin(T, b, 890, 420, .8);
    for (let i = 0; i < 9; i++) paper(b, [['rect', { x: 20 + i * 30, y: 360, width: 12, height: 80, rx: 5, fill: C.bark }]]);
    paper(b, [['rect', { x: 10, y: 380, width: 270, height: 10, fill: C.bark }]]);
    paper(b, [['rect', { x: -300, y: 430, width: 1600, height: 400, fill: C.soil }]]);
    for (let i = 0; i < 3; i++) el('rect', { x: -300, y: 448 + i * 22, width: 1600, height: 6, fill: C.soilDark, opacity: .5 }, b);
    return { skyR, sun };
  }
  function soilFront(T, y = GROUND) {
    return T.paper(T.world, [['path', { d: `M-300 ${y - 2} Q205 ${y - 16} 700 ${y - 2} L1300 ${y - 2} V900 H-300 Z`, fill: C.soil }],
      ['rect', { x: -300, y: y + 30, width: 1600, height: 6, fill: C.soilDark, opacity: .5 }]]);
  }
  function lowAngleBG(T) {
    const { paper, el } = T;
    sky(T, '#CFE0E6');
    el('circle', { cx: 860, cy: 90, r: 40, fill: '#F6D98A' }, T.bg);
    [[200, 120], [620, 70]].forEach(([x, y]) => paper(T.bg, [['ellipse', { cx: x, cy: y, rx: 70, ry: 24, fill: C.snow }], ['ellipse', { cx: x + 40, cy: y - 12, rx: 40, ry: 22, fill: C.snow }]]));
    paper(T.bg, [['rect', { x: -300, y: 500, width: 1600, height: 300, fill: C.soil }]]);
  }
  function doorBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, C.summer);
    paper(b, [['rect', { x: -300, y: 470, width: 1600, height: 300, fill: '#B9A25A' }]]);
    paper(b, [['rect', { x: 60, y: 120, width: 560, height: 360, fill: C.bark }], ['path', { d: 'M20 130 L340 -20 L660 130 Z', fill: C.bean }]]);
    for (let i = 1; i < 9; i++) paper(b, [['rect', { x: 50, y: 120 + i * 40, width: 580, height: 12, rx: 6, fill: '#5A3D29' }]]);
    paper(b, [['rect', { x: 110, y: 200, width: 90, height: 80, fill: C.amber }], ['rect', { x: 110, y: 236, width: 90, height: 6, fill: C.bark }]]);
    paper(b, [['rect', { x: 266, y: 270, width: 128, height: 210, fill: '#2E1F16' }]]);
    const door = paper(b, [['rect', { x: 266, y: 270, width: 128, height: 210, fill: '#4E3524' }], ['circle', { cx: 372, cy: 380, r: 7, fill: C.gold }]]);
    door.style.transformBox = 'view-box'; door.style.transformOrigin = '266px 0px'; door.style.transition = 'transform .6s';
    return door;
  }
  function fenceBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#D6E6DA');
    paper(b, [['rect', { x: -300, y: 440, width: 1600, height: 400, fill: C.leaf }]]);
    for (let i = 0; i < 9; i++) paper(b, [['path', { d: `M${-20 + i * 130} 520 V190 L${40 + i * 130} 150 L${100 + i * 130} 190 V520 Z`, fill: i % 2 ? C.cream : '#EADBB8' }]]);
    paper(b, [['rect', { x: -300, y: 250, width: 1600, height: 26, fill: C.bark }], ['rect', { x: -300, y: 410, width: 1600, height: 26, fill: C.bark }]]);
  }
  function barnBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#CFE0E6');
    el('circle', { cx: 150, cy: 90, r: 38, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M40 600 L130 300 L870 300 L960 600 Z', fill: C.bean }]]);
    for (let i = 0; i < 7; i++) el('rect', { x: 120 + i * 120, y: 300, width: 8, height: 300, fill: '#8E2F28' }, b);
    paper(b, [['path', { d: 'M80 310 L500 170 L920 310 L880 330 L500 205 L120 330 Z', fill: C.bark }]]);
    paper(b, [['path', { d: 'M360 600 V430 H640 V600 Z', fill: '#5A2A22' }], ['path', { d: 'M360 430 L640 600 M640 430 L360 600', stroke: C.cream, 'stroke-width': 10 }]]);
  }
  function mouseBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, C.summer);
    for (let i = 0; i < 16; i++) {
      const x = -40 + i * 70, h = 240 + (i % 3) * 70;
      paper(b, [['path', { d: `M${x} 470 Q${x + 12} ${470 - h / 2} ${x + 34} ${470 - h} Q${x + 28} ${470 - h / 2} ${x + 40} 470 Z`, fill: i % 2 ? C.leaf : C.pine }]]);
    }
    paper(b, [['rect', { x: -300, y: 440, width: 1600, height: 400, fill: C.soil }]]);
    paper(b, [['ellipse', { cx: 170, cy: 440, rx: 150, ry: 90, fill: C.soilDark }], ['ellipse', { cx: 150, cy: 420, rx: 110, ry: 60, fill: '#9C7550' }]]);
    paper(b, [['ellipse', { cx: 880, cy: 450, rx: 130, ry: 80, fill: C.soilDark }], ['ellipse', { cx: 900, cy: 430, rx: 90, ry: 50, fill: '#9C7550' }]]);
    paper(b, [['ellipse', { cx: 520, cy: 470, rx: 110, ry: 34, fill: '#2E1F16' }]]);
  }
  function feastBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#F2B98A');
    el('circle', { cx: 250, cy: 300, r: 80, fill: C.persimmon, opacity: .8 }, b);
    paper(b, [['path', { d: 'M-300 390 Q200 320 500 360 Q800 320 1300 380 V700 H-300 Z', fill: '#7E8E5A' }]]);
    cabin(T, b, 880, 420, .9);
    paper(b, [['rect', { x: -300, y: 440, width: 1600, height: 400, fill: '#B9A25A' }]]);
  }

  /* 화면 고정 배지 (카메라 영향 없음) */
  function badge(T, x, y, r, key, s) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, document.getElementById('stage'));
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    const inner = T.el('g', { transform: `translate(${key === 'dog' || key === 'cat' || key === 'pig' ? 6 : 12},${r * .62}) scale(${s})` }, g);
    DRAW[key](T, inner);
    return g;
  }
  function stars(T, x, y) {
    const g = T.el('g', {}, T.fx);
    for (let k = 0; k < 3; k++) T.el('path', { d: 'M0 -10 L3 -3 10 -3 4 2 6 10 0 5 -6 10 -4 2 -10 -3 -3 -3 Z', fill: '#FFD54F', transform: `rotate(${k * 120}) translate(26 0)` }, g);
    g.animate([{ transform: `translate(${x}px,${y}px) rotate(0deg)` }, { transform: `translate(${x}px,${y}px) rotate(360deg)` }], { duration: 1100, iterations: Infinity });
    return g;
  }

  /* ================= 소리 ================= */
  const bark = (T, v) => AudioFX.animal('dog', v) || (T.tone([520, 380], .12, { type: 'square', vol: .12 }), T.tone([540, 400], .12, { type: 'square', vol: .12, when: .2 }));
  const meow = (T, v) => AudioFX.animal('cat', v) || T.tone([700, 900], .5, { type: 'sine', vol: .14 });
  const moo = T => AudioFX.animal('cow') || T.tone([150, 105], .9, { type: 'sawtooth', vol: .12 });
  const oink = T => AudioFX.animal('pig') || T.tone([260, 200], .25, { type: 'square', vol: .1 });
  const squeak = T => { T.tone([1800, 2400], .08, { type: 'sine', vol: .12 }); T.tone([1900, 2500], .08, { type: 'sine', vol: .12, when: .14 }); };
  const giggle = T => [0, .12, .24, .36].forEach((w, i) => T.tone([620 - i * 40, 520 - i * 40], .1, { type: 'triangle', vol: .12, when: w }));
  /* "영차" 합창: 당기는 인원수만큼 목소리가 겹친다 */
  const chorus = (T, n) => { for (let i = 0; i < n; i++) T.tone([200 + i * 55, 160 + i * 45], .32, { type: 'triangle', vol: .07, when: i * .025 }); AudioFX.sfx('step_grass', .25); };
  const thud = T => AudioFX.sfx('thud') || T.tone([120, 60], .25, { type: 'sine', vol: .25 });

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, actor, camTo, camWide, camSnap, josa } = T;

    /* 배우: 안쪽 '자세' 층을 따로 두어 기울기·벌렁을 hop과 겹치지 않게 한다 */
    const cast = {};
    CAST.forEach(c => {
      let lean;
      const a = actor(T.world, -300, GROUND, g => {
        lean = el('g', {}, g);
        lean.style.transformBox = 'view-box'; lean.style.transformOrigin = '0 0'; lean.style.transition = 'transform .28s ease-out';
        DRAW[c.key](T, lean);
      });
      Object.assign(a, c, { lean });
      a.pose = tf => { a.lean.style.transform = tf; };
      a.pose(POSE.stand());
      cast[c.key] = a;
    });
    const line = CAST.map(c => cast[c.key]);
    const put = (a, x, y = GROUND, s = 1) => { T.world.appendChild(a.pos); a.face('left'); a.setScale(s); a.place(x, y); a.pose(POSE.stand()); a.body.style.transform = ''; };

    let turnip, leaves, rise = 0;
    turnip = actor(T.world, 0, 0, g => { leaves = drawTurnip(T, g); });
    turnip.pos.id = 'turnip';
    const putTurnip = (x, y, s) => { T.world.appendChild(turnip.pos); turnip.setScale(s); turnip.place(x, y); turnip.body.style.transform = ''; };
    const wobble = () => leaves.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0deg)' }], { duration: 420 });

    /* 옆 모습 텃밭: 순무 + 흙 + 앞에서 n명 */
    const TX = 205;
    function sideView(n) {
      T.clear(); gardenBG(T);
      putTurnip(TX, GROUND - rise, 1);
      soilFront(T);
      for (let i = 0; i < n; i++) put(line[i], LINE_X[i]);
      camSnap(500, 280, 1);
    }
    /* 당기기 한 판: 톡톡톡 ×5, 끝나면 순무가 한 뼘 올라온다 */
    async function pullRound(n, gain, prompt) {
      await T.mash(turnip.pos, { count: 5, prompt, onStep: i => {
        chorus(T, n);
        for (let k = 0; k < n; k++) { const a = line[k]; setTimeout(() => { a.pose(POSE.pull(16)); setTimeout(() => a.pose(POSE.stand()), 260); }, k * 40); }
        wobble();
        T.pop(i % 2 ? 640 : 360, 180, '영차!', C.bean);
      } });
      await sleep(400);
      rise += gain;
      await turnip.move(TX, GROUND - rise, 500, 'cubic-bezier(.3,1.6,.5,1)');
    }
    async function callChoice(okKey, noKey, { q, where, who, okSound, noSound }) {
      const left = Math.random() < .5;
      const sc = { girl: 1.25, cow: .72, dog: 1.2, cat: 1.25, pig: 1.2 };
      const bOk = badge(T, left ? 250 : 750, 320, 92, okKey, sc[okKey]);
      const bNo = badge(T, left ? 750 : 250, 320, 92, noKey, sc[noKey]);
      await T.choose([
        { el: bOk, ok: true },
        { el: bNo, ok: false, onWrong: async () => { noSound && noSound(); await T.anim(bNo, [{ translate: '0 0' }, { translate: '-10px 0' }, { translate: '10px 0' }, { translate: '0 0' }], 400); } },
      ], { prompt: q, where, who });
      okSound && okSound();
      await T.anim(bOk, [{ translate: '0 0' }, { translate: '0 -24px' }, { translate: '0 0' }], 420);
      bOk.remove(); bNo.remove();
    }

    /* --- 1. 씨 뿌리기 (텃밭 봄) --- */
    let bgp = gardenBG(T, { season: 'spring' });
    put(cast.grandpa, 560);
    const hole = el('ellipse', { cx: 430, cy: 470, rx: 40, ry: 12, fill: '#3E2A1A' }, T.world);
    const seed = el('g', {}, T.world);
    el('circle', { cx: 0, cy: 0, r: 46, fill: '#fff', opacity: 0 }, seed);
    T.paper(seed, [['ellipse', { cx: 0, cy: 0, rx: 13, ry: 17, fill: C.bark }], ['ellipse', { cx: -4, cy: -5, rx: 4, ry: 6, fill: '#9C7550' }]]);
    seed.setAttribute('transform', 'translate(496,378)');
    camSnap(500, 360, 1.5);
    await T.curtain(true);
    await say('봄이 왔어요. 할아버지가 텃밭에 구멍을 팠어요.');
    await say('"순무야, 크게 자라라." 씨앗을 톡 눌러 봐요!');
    await T.tap(seed, { prompt: '씨앗을 톡 눌러 봐요!' });
    await T.anim(seed, [{ transform: 'translate(496px,378px)' }, { transform: 'translate(462px,330px)' }, { transform: 'translate(430px,468px) scale(.6)' }], { duration: 600, easing: 'ease-in' });
    seed.remove();
    AudioFX.sfx('pop'); T.pop(430, 400, '쏙!', C.pine);
    hole.setAttribute('fill', C.soilDark);
    await say('씨앗이 흙 속으로 쏙 들어갔어요.');

    /* --- 2. 무럭무럭 (봄 → 여름) --- */
    await T.sceneCard('무럭무럭', () => {
      hole.remove();
      putTurnip(430, GROUND, .3);
      soilFront(T);
      T.world.appendChild(cast.grandpa.pos);
      camSnap(500, 280, 1);
    }, cast.grandpa.pos);
    await say('파란 싹이 났어요! 톡톡 눌러서 물도 주고 햇볕도 줘요.');
    const can = el('g', { opacity: 0 }, T.fx);
    T.paper(can, [['rect', { x: -34, y: -24, width: 60, height: 44, rx: 8, fill: C.pine }], ['path', { d: 'M24 -10 L64 -34 L68 -26 L28 0 Z', fill: C.pine }], ['path', { d: 'M-34 -14 Q-60 -4 -34 12', stroke: C.pine, 'stroke-width': 7, fill: 'none' }]]);
    const mix = (a, b, k) => '#' + [0, 2, 4].map(o => Math.round(parseInt(a.substr(1 + o, 2), 16) * (1 - k) + parseInt(b.substr(1 + o, 2), 16) * k).toString(16).padStart(2, '0')).join('');
    await T.mash(turnip.pos, { count: 6, prompt: '순무 싹을 톡톡 눌러 봐요!', onStep: i => {
      const s = .3 + i * (.7 / 6);
      turnip.body.style.transition = 'transform .45s cubic-bezier(.3,1.6,.5,1)';
      turnip.body.style.transform = `scale(${s / .3})`;
      bgp.skyR.style.fill = mix(C.spring, C.summer, i / 6);
      if (i % 2) {
        can.setAttribute('transform', 'translate(330,230) rotate(28)');
        can.animate([{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 900 });
        for (let d = 0; d < 5; d++) {
          const dr = el('ellipse', { cx: 395 + d * 9, cy: 290, rx: 4, ry: 7, fill: '#6FA8C8' }, T.fx);
          dr.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(150px)', opacity: 0 }], { duration: 600, delay: d * 70 }).finished.then(() => dr.remove());
        }
        AudioFX.sfx('splash', .4) || AudioFX.splash();
      } else {
        bgp.sun.setAttribute('r', 44 + i * 6);
        bgp.sun.animate([{ opacity: 1 }, { opacity: .6 }, { opacity: 1 }], { duration: 500 });
        T.tone([520, 780], .3, { type: 'sine', vol: .12 });
        T.pop(150, 200, '반짝!', C.persimmon);
      }
    } });
    await sleep(600);
    turnip.body.style.transition = ''; turnip.body.style.transform = ''; turnip.setScale(1);
    await say('여름이 되었어요. 순무 잎이 할아버지 키만큼 자랐어요!');

    /* --- 3. 영차! 혼자서 (순무 로우앵글) --- */
    await T.sceneCard('영차!', () => {
      T.clear(); lowAngleBG(T);
      putTurnip(420, 470, 1.6);
      T.paper(T.world, [['rect', { x: -300, y: 498, width: 1600, height: 300, fill: C.soil }]]);
      put(cast.grandpa, 600, 500, .7);
    }, cast.grandpa.pos);
    await say('할아버지가 순무 잎을 꽉 잡았어요. 톡톡 눌러서 영차!');
    await T.mash(cast.grandpa.pos, { count: 5, prompt: '할아버지를 톡톡 눌러서 영차 영차!', onStep: i => {
      chorus(T, 1); wobble();
      cast.grandpa.pose(POSE.pull(18)); setTimeout(() => cast.grandpa.pose(POSE.stand()), 260);
      T.pop(i % 2 ? 700 : 560, 300, '영차!', C.bean);
    } });
    await sleep(300);
    await say('순무는 꿈쩍도 안 해요.');
    cast.grandpa.pose(POSE.sit('grandpa'));
    await cast.grandpa.move(680, 500, 350, 'ease-out');
    thud(T); T.shake(); T.pop(800, 300, '쿵!');
    const st1 = stars(T, 680, 395);
    giggle(T);
    await say('아이코! 할아버지가 엉덩방아를 찧었어요.');
    st1.remove();

    /* --- 4. 할머니~! (오두막 문 앞 → 텃밭) --- */
    let door;
    await T.sceneCard('할머니~!', () => {
      T.clear(); door = doorBG(T);
      put(cast.grandpa, 720, GROUND, 1.05);
      camSnap(500, 280, 1);
    }, cast.grandpa.pos);
    await say('혼자서는 안 되겠어요. 할아버지를 톡 눌러서 할머니를 불러요!');
    await T.tap(cast.grandpa.pos, { prompt: '할아버지를 톡! 할머니를 불러요.' });
    cast.grandpa.hop(20);
    T.pop(620, 230, '할머니~!', C.bean);
    await sleep(600);
    AudioFX.sfx('door');
    door.style.transform = 'scaleX(.15)';
    put(cast.grandma, 330, GROUND, 1.05);
    T.world.insertBefore(cast.grandma.pos, T.world.firstChild);
    await sleep(400);
    await cast.grandma.move(560, GROUND, 900);
    await say('할머니가 달려왔어요. "같이 해 봐요!"');
    await T.sceneCard(null, () => sideView(2), cast.grandma.pos);
    await say('할머니가 할아버지 허리를 잡고, 톡톡톡 영차!');
    await pullRound(2, 12, '순무를 톡톡 눌러서 영차!');
    await say('순무가 한 뼘 올라왔어요! 그래도 안 뽑혀요.');

    /* --- 5. 손녀 (텃밭 옆 모습, 줄이 길어짐) --- */
    await T.sceneCard('손녀', () => sideView(2), cast.grandma.pos);
    const q5 = '할머니가 누구를 부를까요?';
    await say(q5);
    await callChoice('girl', 'cow', { q: q5, okSound: () => T.tone([660, 880], .2, { type: 'triangle', vol: .14 }), noSound: () => moo(T),
      where: '음매~ 소는 풀을 먹고 있대요. 사람 친구를 먼저 불러요!', who: '손녀예요! 반짝이는 친구를 눌러 봐요!' });
    put(cast.girl, 1080);
    await cast.girl.move(LINE_X[2], GROUND, 900);
    await say('"손녀야~!" 손녀가 할머니 허리를 잡았어요. 영차!');
    await pullRound(3, 12, '순무를 톡톡 눌러서 영차!');
    await say('조금 더 올라왔어요! 누가 더 도와줄까요?');

    /* --- 6. 멍멍! (울타리 너머 강아지 눈높이) --- */
    await T.sceneCard('멍멍!', () => {
      T.clear(); fenceBG(T);
      put(cast.dog, 520, 510, 1.8);
      T.paper(T.world, [['circle', { cx: 440, cy: 470, r: 90, fill: C.pine }], ['circle', { cx: 560, cy: 450, r: 110, fill: C.leaf }], ['circle', { cx: 670, cy: 480, r: 80, fill: C.pine }], ['rect', { x: 300, y: 500, width: 480, height: 80, fill: C.leaf }]]);
      camSnap(500, 280, 1);
    });
    const bush = T.world.lastChild;
    const rustle = () => bush.animate([{ translate: '0 0' }, { translate: '-6px 0' }, { translate: '6px 0' }, { translate: '0 0' }], { duration: 400, iterations: 2 });
    rustle(); bark(T);
    const q6 = '덤불 뒤에서 멍멍! 누구일까요?';
    await say(q6);
    await callChoice('dog', 'cat', { q: q6, okSound: () => bark(T), noSound: () => { meow(T); setTimeout(() => { rustle(); bark(T); }, 900); },
      where: '멍멍 하고 우는 친구는 누굴까? 다시 들어 봐요.', who: '강아지예요! 반짝이는 친구를 눌러 봐요!' });
    T.world.appendChild(cast.dog.pos);
    await cast.dog.move(680, 300, 400, 'ease-out');
    await cast.dog.move(840, 540, 400, 'ease-in');
    cast.dog.hop(30);
    await say('강아지가 뛰어나왔어요. "나도 도울게요!"');
    await T.sceneCard(null, () => sideView(4), cast.dog.pos);
    T.pop(560, 330, '앙!', C.bean);
    await say('강아지가 손녀 치마를 앙 물었어요. 영차!');
    await pullRound(4, 12, '순무를 톡톡 눌러서 영차!');

    /* --- 7. 야옹! (헛간 지붕 로우앵글) --- */
    await T.sceneCard('야옹!', () => {
      T.clear(); barnBG(T);
      put(cast.cat, 700, 242, 1.9);
      cast.cat.lean.style.filter = 'brightness(.15)';
      camSnap(500, 280, 1);
    });
    meow(T);
    const q7 = '헛간 지붕에서 야옹! 누구일까요?';
    await say(q7);
    await callChoice('cat', 'pig', { q: q7, okSound: () => meow(T), noSound: () => { oink(T); setTimeout(() => meow(T), 900); },
      where: '야옹 하고 우는 친구는 누굴까? 다시 들어 봐요.', who: '고양이예요! 반짝이는 친구를 눌러 봐요!' });
    cast.cat.lean.style.transition = 'transform .28s ease-out, filter .6s';
    cast.cat.lean.style.filter = '';
    await cast.cat.hop(40);
    await say('고양이가 지붕에서 폴짝 내려왔어요.');
    cast.cat.lean.style.transition = 'transform .28s ease-out';
    await T.sceneCard(null, () => sideView(5), cast.cat.pos);
    await say('어? 강아지랑 고양이가 서로 째려봐요.');
    await T.cut(svg => {
      const dogG = T.el('g', { transform: 'translate(70,262) scale(-2.3,2.3)' }, svg); DRAW.dog(T, dogG);
      const catG = T.el('g', { transform: 'translate(350,262) scale(2.5)' }, svg); DRAW.cat(T, catG);
      T.el('path', { d: 'M226 96 L212 116 L230 124 L214 146 L232 154 L218 176', stroke: '#FFD54F', 'stroke-width': 7, fill: 'none', 'stroke-linejoin': 'round' }, svg);
      T.el('text', { x: 200, y: 60, 'text-anchor': 'middle', 'font-size': 56, fill: C.bean, stroke: '#fff', 'stroke-width': 8, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: '째릿!' }, svg);
    }, { hold: 2200 });
    giggle(T);
    await say('"흥!" 그래도 고양이가 강아지 꼬리를 꼭 잡았어요.');
    await pullRound(5, 10, '순무를 톡톡 눌러서 영차!');

    /* --- 8. 아주 작은 생쥐 (생쥐 눈높이) --- */
    for (let k = 0; k < 5; k++) line[k].pose(POSE.sit(line[k].key));
    await say('휴우, 모두 지쳐서 털썩 주저앉았어요.');
    await T.sceneCard('아주 작은 생쥐', () => {
      T.clear(); mouseBG(T);
      put(cast.mouse, 520, 540, 3);
      T.paper(T.world, [['path', { d: 'M380 482 Q520 468 660 482 L700 600 L340 600 Z', fill: C.soil }]]);
      camSnap(500, 280, 1);
    });
    squeak(T);
    await say('흙구멍에서 찍찍 소리가 나요. 톡 눌러 봐요!');
    await T.tap(cast.mouse.pos, { prompt: '흙구멍의 생쥐를 톡!' });
    squeak(T);
    T.world.appendChild(cast.mouse.pos);
    await cast.mouse.move(560, 360, 300, 'ease-out');
    await cast.mouse.move(640, 520, 300, 'ease-in');
    T.pop(640, 300, '찍찍!', C.bark);
    await say('아주 작은 생쥐가 쪼르르 나왔어요.');
    await T.sceneCard(null, () => { sideView(5); for (let k = 0; k < 5; k++) line[k].pose(POSE.sit(line[k].key)); }, cast.cat.pos);
    put(cast.mouse, 1060);
    await cast.mouse.move(LINE_X[5], GROUND, 700);
    await say('"너무 작아서 안 될 거야~"');
    giggle(T);
    for (let k = 0; k < 5; k++) setTimeout(() => line[k].hop(16, 300), k * 90);
    T.pop(440, 220, '하하하!', C.persimmon);
    await sleep(800);
    squeak(T); cast.mouse.hop(40);
    await say('"나도 할래요!" 생쥐가 고양이 꼬리를 꼭 잡았어요.');
    for (let k = 0; k < 5; k++) line[k].pose(POSE.stand());
    await sleep(400);

    /* --- 9. 쑥! (다 함께 꾹) --- */
    await say('이번엔 여섯이 다 함께! 순무를 꾹 눌러요. 영~차!');
    let lastBeat = 0;
    await T.hold(turnip.pos, { ms: 3000, prompt: '순무를 꾹 누르고 있어요. 영~차!', onProgress: p => {
      line.forEach(a => a.pose(POSE.pull(6 + p * 20)));
      turnip.place(TX, GROUND - rise - p * 22);
      const beat = Math.floor(p * 4);
      if (beat > lastBeat) { lastBeat = beat; chorus(T, 6); wobble(); T.pop(460, 170, beat % 2 ? '영~' : '차!', C.bean); }
    } });
    const cutTurnip = (svg, y, s, word) => {
      T.el('rect', { x: 0, y: 220, width: 400, height: 80, fill: C.soil }, svg);
      const tg = T.el('g', { transform: `translate(200,${y}) scale(${s})` }, svg); drawTurnip(T, tg);
      T.el('rect', { x: 0, y: 236, width: 400, height: 64, fill: C.soil, opacity: y > 180 ? 1 : 0 }, svg);
      T.el('text', { x: 200, y: 64, 'text-anchor': 'middle', 'font-size': 64, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: word }, svg);
    };
    await T.cut(svg => cutTurnip(svg, 230, .6, '영~'), { hold: 1100 });
    await T.cut(svg => cutTurnip(svg, 190, .6, '차~'), { hold: 1100 });
    await T.cut(svg => cutTurnip(svg, 140, .6, '쑥!'), { hold: 1500, sfx: 'pow' });
    /* 순무가 날아가고, 생쥐부터 할아버지까지 벌렁 도미노 */
    T.world.appendChild(turnip.pos);
    turnip.pos.removeAttribute('transform');
    turnip.pos.animate([
      { transform: `translate(${TX}px,${GROUND - rise - 22}px) rotate(0deg)` },
      { transform: `translate(110px,150px) rotate(-40deg)` },
      { transform: `translate(60px,372px) rotate(-80deg)` },
    ], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
    for (let k = 5; k >= 0; k--) {
      const a = line[k];
      a.pose(POSE.flop(a.key));
      AudioFX.sfx('bonk', .5) || T.tone([300 - k * 20, 120], .2, { type: 'triangle', vol: .15 });
      await sleep(200);
    }
    await sleep(300);
    thud(T); T.shake();
    T.pop(520, 260, '벌렁!', C.persimmon);
    await sleep(900);
    giggle(T);
    await say('쑥! 커다란 순무가 뽑혔어요! 모두 벌렁 넘어졌어요.');
    T.confetti();
    for (let k = 0; k < 6; k++) setTimeout(() => { line[k].pose(POSE.stand()); line[k].hop(26, 380); }, k * 110);
    await sleep(900);
    await say('작은 생쥐까지 모두 힘을 모았더니 뽑혔어요!');

    /* --- 10. 순무 잔치 (노을 식탁) --- */
    const FX = [110, 220, 330, 670, 780, 890];
    const SEAT_S = { grandpa: 1, grandma: 1, girl: 1.1, dog: 1.1, cat: 1.2, mouse: 1.5 };
    const seats = line.slice().sort(() => Math.random() - .5);
    let pot;
    await T.sceneCard('순무 잔치', () => {
      T.clear(); feastBG(T);
      T.paper(T.world, [['rect', { x: 390, y: 400, width: 220, height: 20, rx: 6, fill: C.bark }], ['rect', { x: 410, y: 420, width: 16, height: 90, fill: C.bark }], ['rect', { x: 574, y: 420, width: 16, height: 90, fill: C.bark }]]);
      pot = T.paper(T.world, [['path', { d: 'M446 350 H554 Q556 400 500 402 Q444 400 446 350 Z', fill: C.ink }], ['rect', { x: 438, y: 342, width: 124, height: 12, rx: 6, fill: '#4a3a30' }], ['ellipse', { cx: 500, cy: 344, rx: 50, ry: 8, fill: C.snow }]]);
      el('rect', { x: 420, y: 300, width: 160, height: 110, fill: '#fff', opacity: 0 }, pot);
      seats.forEach((a, i) => { put(a, FX[i], 510, SEAT_S[a.key]); if (i < 3) a.face('right'); });
      camSnap(500, 280, 1);
    });
    const steam = setInterval(() => { const s = el('circle', { cx: 480 + Math.random() * 40, cy: 330, r: 8, fill: C.snow, opacity: .7 }, T.fx); s.animate([{ transform: 'translateY(0)', opacity: .7 }, { transform: 'translateY(-60px)', opacity: 0 }], { duration: 1400 }).finished.then(() => s.remove()); }, 400);
    await say('맛있는 순무국을 끓였어요.');
    await say('누가 먼저 순무를 잡았지? 차례대로 톡 눌러 봐요!');
    /* 차례대로 톡 (order): 틀리면 "나는 다음이야~" 하고 다음 차례가 반짝인다 */
    const done = new Set();
    for (let k = 0; k < 6; k++) {
      const good = line[k];
      const q = k === 0 ? '맨 처음은 누구였지?' : `${josa(line[k - 1].name, '이/가')} 잡은 다음은 누구?`;
      if (k > 0) await say(q);
      const opts = line.filter(a => !done.has(a)).map(a => ({ el: a.pos, ok: a === good, onWrong: async () => {
        a.hop(24, 360);
        await say(`${a.name}: "나는 다음이야~"`);
        good.pos.style.filter = 'url(#hintGlow)';
        good.pos.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
      } }));
      await T.choose(opts, { prompt: q, who: `${josa(good.name, '이에요/예요')}! 반짝이는 친구를 눌러 봐요!` });
      done.add(good);
      good.pos.style.filter = '';
      good.hop(30, 400);
      const tag = T.paper(T.fx, [['circle', { cx: good.x, cy: 510 - good.h * good.scale - 34, r: 22, fill: C.cream, stroke: C.gold, 'stroke-width': 4 }]]);
      el('text', { x: good.x, y: 510 - good.h * good.scale - 25, 'text-anchor': 'middle', 'font-size': 26, fill: C.bean, 'font-family': 'Jua, sans-serif', text: k + 1 }, tag);
      T.tone(392 + k * 60, .25, { type: 'triangle', vol: .16 });
    }
    await say('와! 할아버지, 할머니, 손녀, 강아지, 고양이, 생쥐! 차례를 다 기억했어요.');
    [...T.fx.children].forEach(n => n.remove());

    /* 한 그릇씩 톡 나눠 주기 (counter: 여섯 그릇 · 여섯 명) */
    const ui = el('g', {}, document.getElementById('stage'));
    const dots = [0, 1, 2, 3, 4, 5].map(i => el('circle', { cx: 380 + i * 48, cy: 118, r: 17, fill: C.cream, stroke: C.gold, 'stroke-width': 5 }, ui));
    const NUM = ['하나', '둘', '셋', '넷', '다섯', '여섯'];
    await say('순무국을 한 그릇씩 나눠 줘요. 냄비를 톡 눌러요!');
    await T.mash(pot, { count: 6, prompt: '냄비를 톡 눌러서 한 그릇씩!', onStep: i => {
      const a = line[i - 1];
      const bowl = T.paper(T.world, [['path', { d: 'M-22 -8 H22 Q20 14 0 15 Q-20 14 -22 -8 Z', fill: C.snow }], ['ellipse', { cx: 0, cy: -8, rx: 22, ry: 5, fill: C.amber }]]);
      const ty = 510 - a.h * a.scale * .55;
      bowl.animate([{ transform: 'translate(500px,330px)' }, { transform: `translate(${(500 + a.x) / 2}px,200px)` }, { transform: `translate(${a.x}px,${ty}px)` }], { duration: 600, easing: 'ease-in-out', fill: 'forwards' });
      dots[i - 1].setAttribute('fill', C.persimmon);
      T.tone(523 + i * 40, .2, { type: 'triangle', vol: .16 });
      setTimeout(() => { a.hop(20, 300); T.pop(a.x, ty - 70, NUM[i - 1], C.pine); }, 600);
    } });
    await sleep(1200);
    await say('여섯 그릇, 여섯 명! 딱 맞아요.');
    line.forEach((a, i) => setTimeout(() => { a.hop(18, 320); T.tone(440 + i * 30, .12, { type: 'triangle', vol: .1 }); }, i * 150));
    T.pop(500, 230, '냠냠!', C.persimmon);
    T.confetti(); AudioFX.sfx('bell', .5);
    await say('모두 함께 맛있게 먹었답니다.');
    clearInterval(steam); ui.remove();
    return '작은 힘도 모이면 커다란 힘이 돼요!';
  }

  Tale.mount({ title: '커다란 순무', subtitle: '다 함께 영차!', run: T => run(Tale.api) });
})();
