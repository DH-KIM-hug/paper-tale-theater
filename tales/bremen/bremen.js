/* 브레멘 음악대 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §10
   늙어서 내보내진 당나귀 · 강아지 · 고양이 · 닭이 음악대를 만든다.
   소리로 친구 알아맞히기 → 소리 순서 따라 하기 → 큰 동물부터 탑 쌓기 → 합창으로 도둑 쫓기.
   학습: 소리 변별 · 쌓는 순서(크고 무거운 것이 아래) · 소리 패턴 2~3개 · 함께라면 해낼 수 있다.
   웃음 컷: 헉헉 지친 강아지 · 납작 고양이 · 와장창! · 도둑 혼비백산 · 도둑의 과장 보고 */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32', bean: '#A93B32',
    indigo: '#1F2A56', persimmon: '#E8703A', amber: '#F2B366', snow: '#F4F6FA', ink: '#2E241C', pink: '#E8A0A0',
    skin: '#EDC9A0', grey: '#9A938C', greyD: '#6F6760', greyL: '#D8CFC4', night: '#141A36', line: '#B8A888' };

  /* ================= 인물 (모두 왼쪽을 본다. 발끝 = 0,0) ================= */
  const hit = (T, g, x, y, w, h) => T.el('rect', { x, y, width: w, height: h, fill: '#fff', opacity: 0 }, g);
  const DRAW = {
    donkey(T, g) {
      const { paper, el } = T, p = {};
      paper(g, [
        ['path', { d: 'M62 -98 Q84 -84 78 -48', stroke: C.greyD, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }],
        ['ellipse', { cx: 78, cy: -44, rx: 7, ry: 11, fill: C.ink }],
        ...[-40, -22, 28, 46].map(x => ['rect', { x: x - 6, y: -66, width: 13, height: 66, rx: 5, fill: C.grey }]),
        ...[-40, -22, 28, 46].map(x => ['rect', { x: x - 7, y: -9, width: 15, height: 9, rx: 3, fill: C.ink }]),
        ['ellipse', { cx: 8, cy: -84, rx: 62, ry: 30, fill: C.grey }],
        ['ellipse', { cx: 8, cy: -70, rx: 44, ry: 14, fill: C.greyL }],
        ['path', { d: 'M-26 -100 L-52 -156 L-76 -146 L-50 -84 Z', fill: C.grey }],
        ['path', { d: 'M-28 -104 L-54 -160 L-46 -164 L-20 -108 Z', fill: C.greyD }],
      ]);
      p.head = el('g', {}, g);
      p.head.style.transformBox = 'view-box'; p.head.style.transformOrigin = '-60px -140px'; p.head.style.transition = 'transform .4s';
      paper(p.head, [
        ['ellipse', { cx: -68, cy: -186, rx: 7, ry: 26, fill: C.grey, transform: 'rotate(-12 -68 -186)' }],
        ['ellipse', { cx: -54, cy: -184, rx: 7, ry: 26, fill: C.greyD, transform: 'rotate(14 -54 -184)' }],
        ['ellipse', { cx: -80, cy: -146, rx: 34, ry: 19, fill: C.grey, transform: 'rotate(-28 -80 -146)' }],
        ['ellipse', { cx: -104, cy: -130, rx: 15, ry: 13, fill: C.greyL }],
      ]);
      el('circle', { cx: -80, cy: -154, r: 4, fill: C.ink }, p.head);
      el('circle', { cx: -110, cy: -132, r: 2.4, fill: C.ink }, p.head);
      p.mouth = el('ellipse', { cx: -104, cy: -120, rx: 6, ry: 0.1, fill: C.ink }, p.head);
      hit(T, g, -120, -210, 210, 210);
      return p;
    },
    dog(T, g) {
      const { paper, el } = T, p = {};
      paper(g, [
        ...[-30, -14, 16, 32].map(x => ['rect', { x: x - 5, y: -28, width: 11, height: 28, rx: 4, fill: '#9C6A3E' }]),
        ['path', { d: 'M40 -48 Q58 -64 56 -86', stroke: '#B07A4A', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }],
        ['ellipse', { cx: 4, cy: -40, rx: 42, ry: 21, fill: '#B07A4A' }],
        ['circle', { cx: -36, cy: -62, r: 21, fill: '#B07A4A' }],
        ['ellipse', { cx: -54, cy: -56, rx: 14, ry: 10, fill: '#D9B48A' }],
      ]);
      p.ear = paper(g, [['ellipse', { cx: -26, cy: -66, rx: 8, ry: 17, fill: C.bark, transform: 'rotate(18 -26 -66)' }]]);
      el('circle', { cx: -66, cy: -59, r: 4.5, fill: C.ink }, g);
      el('circle', { cx: -42, cy: -70, r: 3.5, fill: C.ink }, g);
      el('rect', { x: -28, y: -50, width: 14, height: 6, rx: 3, fill: C.bean }, g);
      p.tongue = el('ellipse', { cx: -58, cy: -44, rx: 5, ry: 9, fill: C.pink, opacity: 0 }, g);
      hit(T, g, -64, -96, 128, 96);
      return p;
    },
    cat(T, g) {
      const { paper, el } = T, p = {};
      paper(g, [
        ...[-20, -6, 16, 28].map(x => ['rect', { x: x - 4, y: -22, width: 9, height: 22, rx: 4, fill: '#C8913E' }]),
        ['path', { d: 'M30 -34 Q52 -40 46 -82', stroke: C.gold, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }],
        ['ellipse', { cx: 6, cy: -32, rx: 32, ry: 17, fill: C.gold }],
        ['path', { d: 'M-40 -60 L-36 -80 L-24 -64 Z M-18 -64 L-10 -80 L-6 -58 Z', fill: C.gold }],
        ['circle', { cx: -24, cy: -50, r: 18, fill: C.gold }],
      ]);
      [-2, 10, 22].forEach(x => el('rect', { x, y: -46, width: 5, height: 14, rx: 2, fill: C.persimmon }, g));
      el('circle', { cx: -32, cy: -54, r: 3.2, fill: C.ink }, g); el('circle', { cx: -18, cy: -54, r: 3.2, fill: C.ink }, g);
      el('circle', { cx: -27, cy: -45, r: 2.5, fill: C.pink }, g);
      p.whUp = el('path', { d: 'M-34 -44 L-52 -48 M-34 -41 L-52 -38', stroke: C.ink, 'stroke-width': 1.8 }, g);
      p.whDown = el('path', { d: 'M-34 -44 L-48 -34 M-34 -41 L-44 -28', stroke: C.ink, 'stroke-width': 1.8, opacity: 0 }, g);
      hit(T, g, -52, -86, 104, 86);
      return p;
    },
    rooster(T, g) {
      const { paper, el } = T, p = {};
      paper(g, [
        ['path', { d: 'M-6 -26 L-8 0 M8 -26 L10 0 M-8 0 L-18 0 M10 0 L0 0', stroke: C.gold, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }],
        ['ellipse', { cx: 36, cy: -70, rx: 10, ry: 28, fill: C.pine, transform: 'rotate(28 36 -70)' }],
        ['ellipse', { cx: 30, cy: -76, rx: 9, ry: 26, fill: C.bean, transform: 'rotate(10 30 -76)' }],
        ['ellipse', { cx: 40, cy: -58, rx: 8, ry: 22, fill: C.bark, transform: 'rotate(50 40 -58)' }],
        ['ellipse', { cx: 4, cy: -42, rx: 30, ry: 22, fill: C.snow }],
        ['circle', { cx: -20, cy: -68, r: 16, fill: C.snow }],
        ['circle', { cx: -26, cy: -86, r: 6, fill: C.bean }], ['circle', { cx: -18, cy: -89, r: 7, fill: C.bean }], ['circle', { cx: -10, cy: -85, r: 6, fill: C.bean }],
        ['path', { d: 'M-34 -74 L-48 -68 L-34 -62 Z', fill: C.gold }],
        ['ellipse', { cx: -31, cy: -55, rx: 4, ry: 7, fill: C.bean }],
      ]);
      p.wing = paper(g, [['ellipse', { cx: 10, cy: -44, rx: 18, ry: 12, fill: C.cream }]]);
      p.wing.style.transformBox = 'view-box'; p.wing.style.transformOrigin = '0px -46px';
      el('circle', { cx: -24, cy: -71, r: 3, fill: C.ink }, g);
      hit(T, g, -50, -100, 100, 100);
      return p;
    },
    miller(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['rect', { x: -18, y: -60, width: 14, height: 60, rx: 5, fill: C.bark }], ['rect', { x: 4, y: -60, width: 14, height: 60, rx: 5, fill: C.bark }],
        ['rect', { x: -30, y: -132, width: 60, height: 80, rx: 20, fill: C.cream }],
        ['rect', { x: -22, y: -110, width: 44, height: 56, rx: 8, fill: '#C9B48A' }],
        ['circle', { cx: 0, cy: -154, r: 25, fill: C.skin }],
        ['path', { d: 'M-26 -160 Q0 -196 26 -160 Z', fill: C.snow }],
      ]);
      el('circle', { cx: -12, cy: -154, r: 3.5, fill: C.ink }, g);
      el('path', { d: 'M-20 -140 Q-12 -134 -4 -140', stroke: C.ink, 'stroke-width': 2.5, fill: 'none' }, g);
      el('circle', { cx: -24, cy: -146, r: 5, fill: '#D99A7A' }, g);
    },
    robber(T, g, shirt = C.pine) {
      const { paper, el } = T, p = {};
      paper(g, [
        ['rect', { x: -18, y: -52, width: 15, height: 52, rx: 5, fill: C.ink }], ['rect', { x: 3, y: -52, width: 15, height: 52, rx: 5, fill: C.ink }],
        ['ellipse', { cx: 0, cy: -84, rx: 36, ry: 42, fill: shirt }],
        ['rect', { x: -34, y: -98, width: 68, height: 8, fill: C.cream }], ['rect', { x: -36, y: -78, width: 72, height: 8, fill: C.cream }],
        ['circle', { cx: 0, cy: -136, r: 24, fill: C.skin }],
        ['path', { d: 'M-25 -142 Q0 -170 25 -142 L25 -138 L-25 -138 Z', fill: C.bean }],
        ['path', { d: 'M22 -146 L40 -156 L36 -140 Z', fill: C.bean }],
      ]);
      p.eyes = el('g', {}, g);
      el('circle', { cx: -10, cy: -136, r: 3.4, fill: C.ink }, p.eyes); el('circle', { cx: 8, cy: -136, r: 3.4, fill: C.ink }, p.eyes);
      el('path', { d: 'M-16 -124 Q-8 -130 0 -124 Q8 -130 16 -124', stroke: C.ink, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
      p.mouth = el('ellipse', { cx: 0, cy: -116, rx: 6, ry: 2, fill: C.ink }, g);
      el('circle', { cx: -18, cy: -128, r: 4, fill: '#D99A7A' }, g);
      hit(T, g, -40, -170, 80, 170);
      return p;
    },
    owl(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['ellipse', { cx: 0, cy: -34, rx: 26, ry: 32, fill: C.bark }],
        ['path', { d: 'M-22 -58 L-18 -78 L-8 -62 Z M22 -58 L18 -78 L8 -62 Z', fill: C.bark }],
        ['circle', { cx: -10, cy: -48, r: 10, fill: '#e9d3b0' }], ['circle', { cx: 10, cy: -48, r: 10, fill: '#e9d3b0' }],
      ]);
      el('circle', { cx: -10, cy: -48, r: 4, fill: C.ink }, g); el('circle', { cx: 10, cy: -48, r: 4, fill: C.ink }, g);
      el('path', { d: 'M-4 -40 L0 -32 L4 -40 Z', fill: C.gold }, g);
    },
  };
  const FRIENDS = [
    { key: 'donkey', name: '당나귀', word: '히힝~' },
    { key: 'dog', name: '강아지', word: '멍멍!' },
    { key: 'cat', name: '고양이', word: '야옹~' },
    { key: 'rooster', name: '닭', word: '꼬끼오!' },
  ];
  /* 탑 쌓기: 등 위(다음 친구가 설 자리)의 발 기준 위치 */
  const BACK = { donkey: [8, -112], dog: [4, -58], cat: [6, -46], rooster: [0, -60] };
  /* 머리(눈) 위치 — 어둠 속 눈 반짝이 */
  const EYE = { donkey: [-82, -152], dog: [-52, -64], cat: [-25, -54], rooster: [-22, -71] };
  const POSE = {
    stand: 'translate(0px,0px) rotate(0deg) scale(1,1)',
    flat: 'translate(0px,0px) rotate(0deg) scale(1.25,.32)',
    sad: 'translate(0px,0px) rotate(6deg) scale(1,.94)',
    sleep: 'translate(0px,0px) rotate(0deg) scale(1.08,.8)',
  };

  /* ================= 소리 ================= */
  function makeSounds(T) {
    const { tone } = T;
    /* 당나귀 "이히힝~": 실제 녹음(donkey)이 생기면 그것을, 없으면 합성 — 떨리며 내려가는 울음 + 끝의 "힝" */
    const bray = (v = .9) => {
      if (AudioFX.animal('donkey', v)) return;
      const k = Math.min(1.4, v + .3);
      tone([620, 980], .16, { type: 'sawtooth', vol: .09 * k });
      for (let i = 0; i < 9; i++) {
        const f = 1150 - i * 55 + (i % 2 ? 90 : -40);
        tone([f, f - 70], .07, { type: 'sawtooth', vol: .1 * k, when: .16 + i * .065 });
        tone([f * 1.5, (f - 70) * 1.5], .07, { type: 'square', vol: .025 * k, when: .16 + i * .065 });
      }
      tone([520, 300], .34, { type: 'sawtooth', vol: .11 * k, when: .78 });
      tone([260, 150], .34, { type: 'square', vol: .05 * k, when: .78 });
    };
    const CRY = {
      donkey: bray,
      dog: (v = .9) => AudioFX.animal('dog', v) || [0, .25].forEach(w => tone([560, 260], .14, { type: 'square', vol: .14 * v, when: w })),
      cat: (v = .9) => AudioFX.animal('cat', v) || (tone([480, 820], .25, { type: 'triangle', vol: .2 * v }), tone([820, 420], .4, { type: 'triangle', vol: .2 * v, when: .25 })),
      rooster: (v = .9) => AudioFX.animal('rooster', v) || (tone(520, .12, { type: 'sawtooth', vol: .11 * v }), tone(700, .12, { type: 'sawtooth', vol: .11 * v, when: .14 }),
        tone([900, 990], .36, { type: 'sawtooth', vol: .11 * v, when: .28 }), tone([990, 620], .3, { type: 'sawtooth', vol: .11 * v, when: .64 })),
      owl: (v = .8) => AudioFX.animal('owl', v) || (tone([420, 380], .3, { type: 'sine', vol: .25 }), tone([380, 330], .5, { type: 'sine', vol: .25, when: .45 })),
    };
    return {
      CRY,
      giggle: () => [0, .12, .24, .36].forEach((w, i) => tone([620 - i * 40, 520 - i * 40], .1, { type: 'triangle', vol: .12, when: w })),
      thud: () => AudioFX.sfx('thud') || tone([120, 60], .25, { type: 'sine', vol: .25 }),
      boom: () => AudioFX.sfx('boom') || (tone([200, 40], .6, { type: 'sawtooth', vol: .2 }), tone([90, 30], .7, { type: 'square', vol: .12 })),
      jingle: () => [0, .08, .16].forEach((w, i) => tone(1800 + i * 300, .08, { type: 'triangle', vol: .08, when: w })),
      step: () => AudioFX.sfx('step_grass', .35) || tone([180, 120], .06, { type: 'sine', vol: .1 }),
      chord: base => [1, 1.25, 1.5].forEach((m, i) => tone(base * m, .45, { type: 'triangle', vol: .09, when: i * .05 })),
    };
  }

  /* ================= 배경 ================= */
  function sky(T, fill) { return T.el('rect', { x: -400, y: -400, width: 1800, height: 1400, fill }, T.bg); }
  function cloud(T, x, y, s = 1) {
    T.paper(T.bg, [['ellipse', { cx: x, cy: y, rx: 70 * s, ry: 22 * s, fill: C.snow }], ['ellipse', { cx: x + 30 * s, cy: y - 14 * s, rx: 40 * s, ry: 22 * s, fill: C.snow }]]);
  }
  function tree(T, p, x, y, s = 1, fill = C.pine) {
    T.paper(p, [['rect', { x: x - 10 * s, y: y - 90 * s, width: 20 * s, height: 90 * s, fill: C.bark }],
      ['circle', { cx: x, cy: y - 120 * s, r: 52 * s, fill }], ['circle', { cx: x - 34 * s, cy: y - 90 * s, r: 34 * s, fill }], ['circle', { cx: x + 34 * s, cy: y - 92 * s, r: 36 * s, fill }]]);
  }
  function millBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#CFE0E6'); el('circle', { cx: 130, cy: 92, r: 40, fill: '#F6D98A' }, b); cloud(T, 360, 90); cloud(T, 760, 70, .8);
    paper(b, [['path', { d: 'M-300 380 Q200 300 520 350 Q800 300 1300 360 V700 H-300 Z', fill: '#8FAE82' }]]);
    // 방앗간: 돌벽 + 지붕 + 물레방아
    paper(b, [['rect', { x: 560, y: 210, width: 280, height: 270, fill: '#B8AFA2' }], ['path', { d: 'M530 216 L700 110 L870 216 Z', fill: C.bean }],
      ['rect', { x: 660, y: 360, width: 80, height: 120, fill: '#4E3524' }], ['rect', { x: 600, y: 260, width: 50, height: 44, fill: C.amber }]]);
    for (let i = 0; i < 5; i++) el('rect', { x: 560, y: 250 + i * 46, width: 280, height: 4, fill: '#968D80' }, b);
    const wheel = el('g', { transform: 'translate(880,380)' }, b);
    const spin = el('g', {}, wheel);
    paper(spin, [['circle', { r: 86, fill: C.bark }], ['circle', { r: 64, fill: '#B8AFA2' }], ['circle', { r: 16, fill: C.bark }],
      ...[0, 45, 90, 135].map(a => ['rect', { x: -90, y: -6, width: 180, height: 12, fill: C.bark, transform: `rotate(${a})` }])]);
    spin.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 9000, iterations: Infinity });
    paper(b, [['rect', { x: -300, y: 470, width: 1600, height: 400, fill: '#B9A25A' }]]);
    paper(b, [['rect', { x: 780, y: 462, width: 520, height: 30, fill: '#6FA8C8' }]]);
  }
  function roadBG(T) {
    const { paper } = T, b = T.bg;
    sky(T, '#D6E6DA'); cloud(T, 240, 100); cloud(T, 820, 80, .7);
    paper(b, [['path', { d: 'M-300 360 Q250 290 560 340 Q820 300 1300 350 V700 H-300 Z', fill: '#9DB98C' }]]);
    tree(T, b, 110, 380, .8); tree(T, b, 930, 360, .7, C.leaf);
    paper(b, [['rect', { x: -300, y: 430, width: 1600, height: 400, fill: C.leaf }]]);
    paper(b, [['path', { d: 'M-300 470 Q300 450 1300 480 V540 Q300 510 -300 540 Z', fill: '#D9C38E' }]]);
  }
  function bush(T, x, y, s = 1) {
    return T.paper(T.world, [['circle', { cx: x - 70 * s, cy: y - 30 * s, r: 62 * s, fill: C.pine }], ['circle', { cx: x + 10 * s, cy: y - 60 * s, r: 80 * s, fill: C.leaf }],
      ['circle', { cx: x + 90 * s, cy: y - 26 * s, r: 58 * s, fill: C.pine }], ['rect', { x: x - 140 * s, y: y - 30 * s, width: 290 * s, height: 40 * s, fill: C.leaf }]]);
  }
  function wallBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#CFE0E6'); cloud(T, 200, 90); cloud(T, 560, 60, .8);
    // 로우앵글: 담장이 위로 치솟아 보인다 (윗선이 오른쪽으로 갈수록 높아짐)
    paper(b, [['path', { d: 'M380 560 L380 300 L1300 230 L1300 560 Z', fill: '#B8AFA2' }]]);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 9; c++) {
      const x = 390 + c * 90 + (r % 2 ? 45 : 0), y0 = 300 - (x - 380) * .076 + 8 + r * 44;
      if (x < 1000) el('rect', { x, y: y0, width: 80, height: 36, rx: 8, fill: r % 2 ? '#A69D91' : '#C4BBAF' }, b);
    }
    paper(b, [['path', { d: 'M370 306 L1300 234 L1300 252 L370 322 Z', fill: C.bark }]]);
    paper(b, [['rect', { x: -300, y: 540, width: 1600, height: 300, fill: C.leaf }]]);
  }
  function roofBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#F2DFA8'); el('circle', { cx: 150, cy: 100, r: 50, fill: '#F6D98A' }, b);
    paper(b, [['rect', { x: 330, y: 250, width: 640, height: 320, fill: C.cream }]]);
    paper(b, [['path', { d: 'M290 270 L650 160 L1010 270 L1010 300 L650 196 L290 300 Z', fill: C.bark }]]);
    paper(b, [['path', { d: 'M300 262 L650 150 L1000 262 L650 180 Z', fill: C.gold }]]);
    paper(b, [['rect', { x: 420, y: 330, width: 90, height: 80, fill: C.amber }], ['rect', { x: 760, y: 360, width: 100, height: 200, fill: '#4E3524' }]]);
    paper(b, [['rect', { x: -300, y: 540, width: 1600, height: 300, fill: '#B9A25A' }]]);
  }
  function meadowBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#D6E6DA'); el('circle', { cx: 860, cy: 96, r: 42, fill: '#F6D98A' }, b); cloud(T, 300, 110, .9);
    paper(b, [['path', { d: 'M-300 380 Q300 300 600 360 Q850 320 1300 360 V700 H-300 Z', fill: '#9DB98C' }]]);
    paper(b, [['rect', { x: -300, y: 440, width: 1600, height: 400, fill: C.leaf }]]);
    for (let i = 0; i < 12; i++) paper(b, [['circle', { cx: 40 + i * 85, cy: 520 + (i % 3) * 12, r: 8, fill: i % 2 ? C.persimmon : C.cream }]]);
  }
  function forestBG(T) {
    const { paper, el } = T, b = T.bg;
    // 하이앵글: 땅이 화면을 거의 채운다. 나무는 위에서 본 동그란 머리
    sky(T, '#2B3A2E');
    const path = paper(b, [['path', { d: 'M-300 430 Q200 360 500 420 Q800 480 1300 400 L1300 500 Q800 560 500 500 Q200 440 -300 520 Z', fill: '#7A6444' }]]);
    const trees = el('g', {}, b);
    for (let i = 0; i < 14; i++) {
      const x = -60 + i * 120, top = i % 2 ? 150 : 290;
      paper(trees, [['circle', { cx: x, cy: top, r: 70 + (i % 3) * 10, fill: i % 3 ? '#27402F' : C.pine }], ['circle', { cx: x + 20, cy: top - 16, r: 36, fill: '#35573F' }]]);
      if (i % 3 === 0) paper(trees, [['circle', { cx: x + 40, cy: 590, r: 70, fill: '#27402F' }]]);
    }
    el('rect', { x: -400, y: -400, width: 1800, height: 1400, fill: C.indigo, opacity: .45 }, b);
    return { trees, path };
  }
  function houseLowBG(T, dx = 0, dy = 0) {
    const { paper, el } = T, b = T.bg;
    sky(T, C.indigo);
    el('circle', { cx: 160, cy: 80, r: 34, fill: C.cream }, b);
    // 로우앵글 벽: 아래가 넓고 위로 좁아진다. 창문은 높이
    paper(b, [['path', { d: 'M-60 560 L60 40 L1060 20 L1100 560 Z', fill: '#8C6E4E' }]]);
    for (let i = 0; i < 6; i++) el('rect', { x: -40, y: 80 + i * 80, width: 1100, height: 6, fill: '#6E5238' }, b);
    paper(b, [['path', { d: 'M40 44 L1070 16 L1070 -80 L40 -80 Z', fill: C.bark }]]);
    const win = paper(b, [['rect', { x: 596, y: 96, width: 208, height: 164, fill: C.bark }], ['rect', { x: 610, y: 110, width: 180, height: 136, fill: C.amber }],
      ['rect', { x: 696, y: 110, width: 8, height: 136, fill: C.bark }], ['rect', { x: 610, y: 172, width: 180, height: 8, fill: C.bark }]], { transform: `translate(${dx},${dy})` });
    // 창 안 도둑 그림자 셋
    [650, 700, 750].forEach((x, i) => paper(win, [['circle', { cx: x, cy: 214 - (i % 2) * 8, r: 16, fill: '#8a5a32' }], ['ellipse', { cx: x, cy: 250, rx: 20, ry: 26, fill: '#8a5a32' }]]));
    paper(b, [['rect', { x: -300, y: 500, width: 1600, height: 300, fill: '#3E5A3A' }]]);
    return win;
  }
  function housePOV(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#C9A06A');
    paper(b, [['rect', { x: -100, y: -100, width: 1200, height: 420, fill: '#D8B98A' }]]);
    for (let i = 0; i < 8; i++) el('rect', { x: -100 + i * 150, y: -100, width: 8, height: 420, fill: '#B8986A' }, b);
    paper(b, [['rect', { x: 780, y: 110, width: 120, height: 150, fill: C.bark }], ['path', { d: 'M800 260 Q840 200 880 260 Z', fill: C.persimmon }]]);
    paper(b, [['rect', { x: -100, y: 300, width: 1200, height: 400, fill: '#8C6E4E' }]]);
  }
  function povFrame(T, m = 70) {
    // 창틀: 탑 꼭대기 닭의 눈으로 창 안을 본다
    T.paper(T.fx, [['path', { d: `M-300 -300 H1300 V860 H-300 Z M${m} 50 V520 H${1000 - m} V50 Z`, fill: C.bark, 'fill-rule': 'evenodd' }],
      ['rect', { x: 494, y: 40, width: 12, height: 490, fill: C.bark }], ['rect', { x: m - 10, y: 510, width: 1020 - 2 * m, height: 30, fill: '#4E3524' }]]);
  }
  function houseWideBG(T) {
    const { paper, el } = T, b = T.bg;
    sky(T, C.indigo);
    el('circle', { cx: 150, cy: 90, r: 36, fill: C.cream }, b);
    for (let i = 0; i < 20; i++) el('circle', { cx: (i * 173) % 1000, cy: 30 + (i * 47) % 160, r: 2.5, fill: C.cream }, b);
    paper(b, [['path', { d: 'M-300 400 Q200 330 520 380 Q800 330 1300 390 V700 H-300 Z', fill: '#2E4A38' }]]);
    tree(T, b, 90, 470, 1.1, '#27402F'); tree(T, b, 930, 470, 1.2, '#27402F');
    paper(b, [['rect', { x: 280, y: 220, width: 470, height: 270, fill: '#8C6E4E' }], ['path', { d: 'M250 228 L515 110 L780 228 Z', fill: C.bark }]]);
    const door = paper(b, [['rect', { x: 340, y: 360, width: 80, height: 130, fill: '#4E3524' }], ['circle', { cx: 408, cy: 426, r: 5, fill: C.gold }]]);
    door.style.transformBox = 'view-box'; door.style.transformOrigin = '340px 0px'; door.style.transition = 'transform .4s';
    paper(b, [['rect', { x: 340, y: 360, width: 80, height: 130, fill: '#1A120C' }]]);
    b.appendChild(door);
    const win = paper(b, [['rect', { x: 540, y: 250, width: 150, height: 110, fill: C.bark }], ['rect', { x: 550, y: 260, width: 130, height: 90, fill: C.amber }],
      ['rect', { x: 611, y: 260, width: 8, height: 90, fill: C.bark }]]);
    paper(b, [['rect', { x: -300, y: 488, width: 1600, height: 300, fill: '#3E5A3A' }]]);
    return { door, win };
  }
  function darkRoomBG(T, sx = {}) {
    const tr = (k, x0) => ({ transform: `translate(${(sx[k] ?? x0) - x0},0)` });
    const { paper, el } = T, b = T.bg;
    sky(T, C.night);
    paper(b, [['rect', { x: -300, y: 470, width: 1600, height: 300, fill: '#0E1228' }]]);
    // 아궁이 · 문 · 짚더미 · 들보 (희미한 윤곽)
    paper(b, [['path', { d: 'M100 480 V360 Q180 300 260 360 V480 Z', fill: '#262A44' }], ['path', { d: 'M130 480 V400 Q180 360 230 400 V480 Z', fill: '#0A0C1C' }]], tr('cat', 180));
    paper(b, [['rect', { x: 400, y: 300, width: 110, height: 180, fill: '#20243D' }]], tr('dog', 470));
    paper(b, [['ellipse', { cx: 680, cy: 480, rx: 120, ry: 40, fill: '#2E2A30' }]], tr('donkey', 690));
    paper(b, [['rect', { x: -300, y: 120, width: 1600, height: 22, fill: '#262A44' }]]);
    paper(b, [['rect', { x: 960, y: 290, width: 90, height: 190, fill: '#2A3150' }]]);
  }
  function morningBG(T, strawX = 180, ovenX = 860) {
    const { paper, el } = T, b = T.bg;
    sky(T, '#F2DFA8'); el('circle', { cx: 880, cy: 90, r: 50, fill: '#F6D98A' }, b); cloud(T, 250, 80, .9);
    paper(b, [['path', { d: 'M-300 380 Q200 320 520 360 Q800 320 1300 370 V700 H-300 Z', fill: '#9DB98C' }]]);
    tree(T, b, 60, 450, .9, C.pine);
    paper(b, [['rect', { x: 330, y: 240, width: 430, height: 240, fill: '#C9A87A' }], ['path', { d: 'M300 248 L545 140 L790 248 Z', fill: C.bark }]]);
    paper(b, [['rect', { x: 420, y: 350, width: 80, height: 130, fill: '#4E3524' }], ['rect', { x: 580, y: 290, width: 120, height: 80, fill: C.amber }]]);
    paper(b, [['rect', { x: -300, y: 470, width: 1600, height: 400, fill: '#B9A25A' }]]);
    // 마당 짚더미, 아궁이
    paper(b, [['ellipse', { cx: strawX, cy: 480, rx: 110, ry: 36, fill: C.gold }]]);
    paper(b, [['path', { d: 'M800 480 V410 Q860 370 920 410 V480 Z', fill: '#A69D91' }], ['path', { d: 'M830 480 V440 Q860 420 890 440 V480 Z', fill: C.persimmon }]], { transform: `translate(${ovenX - 860},0)` });
  }

  /* 세로 화면은 무대 양옆이 잘린다(엔진 slice) → 보이는 너비를 재서 장면마다 배치를 고른다 */
  function visW() {
    const s = document.getElementById('stage'), w = document.getElementById('stageWrap');
    if (!s || !w || !/slice/.test(s.getAttribute('preserveAspectRatio') || '')) return 1000;
    return Math.min(1000, 560 * w.clientWidth / Math.max(1, w.clientHeight));
  }
  const narrow = () => visW() < 760;
  const L = (land, port) => narrow() ? port : land;
  const clampX = (x, m = 80) => { const h = visW() / 2; return Math.min(500 + h - m, Math.max(500 - h + m, x)); };

  /* 화면 고정 배지 (카메라 영향 없음): 골라요 그림판 */
  const BADGE = { dog: [10, 30, 1.25], cat: [4, 36, 1.4], rooster: [0, 40, 1.2], donkey: [20, 46, .62] };
  function badge(T, x, y, r, key) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, document.getElementById('stage'));
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    const [dx, dy, s] = BADGE[key], k = r / 86;
    const inner = T.el('g', { transform: `translate(${dx * k},${(dy + 20) * k}) scale(${s * k})` }, g);
    DRAW[key](T, inner);
    return g;
  }
  function note(T, x, y, fill = C.bean) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, T.fx);
    T.el('ellipse', { cx: 0, cy: 0, rx: 9, ry: 7, fill, transform: 'rotate(-20)' }, g);
    T.el('rect', { x: 6, y: -34, width: 4, height: 34, fill }, g);
    T.el('path', { d: 'M10 -34 Q24 -26 20 -12', stroke: fill, 'stroke-width': 4, fill: 'none' }, g);
    g.animate([{ transform: `translate(${x}px,${y}px)`, opacity: 1 }, { transform: `translate(${x + 30}px,${y - 90}px)`, opacity: 0 }], { duration: 1400, fill: 'forwards' })
      .finished.then(() => g.remove());
  }
  function stars(T, x, y) {
    const g = T.el('g', {}, T.fx);
    for (let k = 0; k < 3; k++) T.el('path', { d: 'M0 -10 L3 -3 10 -3 4 2 6 10 0 5 -6 10 -4 2 -10 -3 -3 -3 Z', fill: '#FFD54F', transform: `rotate(${k * 120}) translate(26 0)` }, g);
    g.animate([{ transform: `translate(${x}px,${y}px) rotate(0deg)` }, { transform: `translate(${x}px,${y}px) rotate(360deg)` }], { duration: 1100, iterations: Infinity });
    return g;
  }

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, actor, camTo, camWide, camSnap, josa } = T;
    const S = makeSounds(T);
    const pop0 = T.pop; T = { ...T, pop: (x, y, w, c) => pop0(clampX(x, 60 + [...w].length * 12), y, w, c) };

    /* 배우: 안쪽 '자세' 층(lean)을 따로 두어 납작·시무룩을 hop과 겹치지 않게 한다 */
    const mk = (key, extra) => {
      let lean, parts;
      const a = actor(T.world, -400, 500, g => {
        lean = el('g', {}, g);
        lean.style.transformBox = 'view-box'; lean.style.transformOrigin = '0 0'; lean.style.transition = 'transform .28s ease-out, filter .6s';
        parts = DRAW[key](T, lean, extra);
      });
      Object.assign(a, { key, lean, parts });
      a.pose = tf => { a.lean.style.transform = tf; };
      a.pose(POSE.stand);
      return a;
    };
    const cast = {};
    FRIENDS.forEach(f => { cast[f.key] = mk(f.key); Object.assign(cast[f.key], f); });
    cast.donkey.cry = v => { S.CRY.donkey(v); const m = cast.donkey.parts.mouth; m.setAttribute('ry', 7); setTimeout(() => m.setAttribute('ry', .1), 900); };
    ['dog', 'cat', 'rooster'].forEach(k => { cast[k].cry = v => S.CRY[k](v); });
    const band = FRIENDS.map(f => cast[f.key]);
    const put = (a, x, y, s = 1, dir = 'left') => {
      T.world.appendChild(a.pos); a.face(dir); a.setScale(s); a.place(x, y); a.pose(POSE.stand);
      a.body.style.transform = ''; a.lean.style.filter = ''; a.pos.style.opacity = ''; a.home = { x, y };
    };
    const sing = (a, big) => { a.cry(big ? 1 : .9); a.hop(18, 360); T.pop(a.x, a.y - 150 * a.scale - (a.key === 'donkey' ? 60 : 0) * a.scale, a.word, C.bean); };
    async function walk(a, x, y = a.y, dur = 1200, faceBack = true) {
      a.face(x > a.x ? 'right' : 'left');
      const bob = a.lean.animate([{ translate: '0 0' }, { translate: '0 -8px' }, { translate: '0 0' }], { duration: 320, iterations: Math.ceil(dur / 320) });
      await a.move(x, y, dur, 'linear');
      bob.cancel();
      if (faceBack) a.face('left');
    }
    const flap = r => { const w = r.parts.wing; return w.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-50deg)' }, { transform: 'rotate(0deg)' }], { duration: 220, iterations: 5 }); };

    /* 골라요: 소리를 듣고 그림판 셋 중에서 */
    async function soundChoice(okKey, q, hidden) {
      const keys = ['dog', 'cat', 'rooster'].sort(() => Math.random() - .5);
      const sp = Math.min(270, (visW() - 30) / 3), r = Math.min(86, sp * .44);
      const bs = keys.map((k, i) => ({ k, b: badge(T, 500 + (i - 1) * sp, 300, r, k) }));
      const name = cast[okKey].name;
      await T.choose(bs.map(({ k, b }) => ({
        el: b, ok: k === okKey,
        onWrong: async () => {
          cast[k].cry(); await T.anim(b, [{ translate: '0 0' }, { translate: '-10px 0' }, { translate: '10px 0' }, { translate: '0 0' }], 400);
          await sleep(700); hidden();
        },
      })), { prompt: q, where: `${cast[okKey].word.replace(/[!~]/g, '')} 하고 우는 친구는 누굴까? 다시 들어 봐요.`, who: `${josa(name, '이에요/예요')}! 반짝이는 친구를 눌러 봐요!` });
      cast[okKey].cry();
      const ok = bs.find(x => x.k === okKey).b;
      await T.anim(ok, [{ translate: '0 0' }, { translate: '0 -24px' }, { translate: '0 0' }], 420);
      bs.forEach(x => x.b.remove());
    }

    /* ---------- 1. 방앗간 당나귀 (와이드) ---------- */
    millBG(T);
    const miller = mk('miller');
    const stone = T.paper(T.world, [['ellipse', { cx: 250, cy: 470, rx: 90, ry: 26, fill: '#8A8378' }], ['rect', { x: 160, y: 430, width: 180, height: 40, fill: '#A69D91' }], ['ellipse', { cx: 250, cy: 430, rx: 90, ry: 26, fill: '#B8AFA2' }],
      ['rect', { x: 244, y: 380, width: 12, height: 52, fill: C.bark }], ['rect', { x: 250, y: 376, width: 160, height: 10, fill: C.bark }]]);
    const DX = L(470, 430);
    put(cast.donkey, DX, 505, 1.1, 'right');
    put(miller, L(720, 650), 500, 1.05);
    camSnap(DX, 330, 1.25);
    await T.curtain(true);
    await say('옛날 옛날, 방앗간에 늙은 당나귀가 살았어요.');
    await say('당나귀를 톡 눌러 봐요!');
    await T.tap(cast.donkey.pos, { prompt: '당나귀를 톡!' });
    cast.donkey.cry(); cast.donkey.hop(20); T.pop(DX + 40, 220, '히힝~', C.bean);
    await sleep(900);
    await camWide(700);
    await say('당나귀는 오랫동안 무거운 곡식 자루를 날랐어요. 이제는 힘이 없어요.');
    await say('주인: "이제 일을 못 하겠구나. 너를 내보내야겠다."');
    cast.donkey.pose(POSE.sad); cast.donkey.parts.head.style.transform = 'rotate(-14deg)';
    await sleep(500);
    cast.donkey.parts.head.style.transform = ''; cast.donkey.pose(POSE.stand);
    cast.donkey.cry(); cast.donkey.hop(30);
    await say('당나귀: "괜찮아! 브레멘에 가서 음악가가 될 거야!"');
    await walk(cast.donkey, 1120, 505, 1800, false);

    /* ---------- 2. 덤불 뒤 누구? ① 강아지 (시골길 와이드) ---------- */
    let bsh;
    await T.sceneCard('덤불 뒤에 누구?', () => {
      T.clear(); roadBG(T);
      put(cast.dog, L(740, 640), 500, 1.2);
      bsh = bush(T, L(740, 640), 505, L(1.1, .75));
      put(cast.donkey, L(240, 370), 505, 1, 'right');
      camSnap(500, 280, 1);
    }, cast.donkey.pos);
    const rustle = () => bsh.animate([{ translate: '0 0' }, { translate: '-6px 0' }, { translate: '6px 0' }, { translate: '0 0' }], { duration: 400, iterations: 2 });
    await say('당나귀가 길을 가는데, 덤불이 흔들흔들.');
    rustle(); cast.dog.cry();
    const q2 = '덤불 뒤에서 멍멍! 누구일까요?';
    await say(q2);
    await soundChoice('dog', q2, () => { rustle(); cast.dog.cry(); });
    T.world.appendChild(cast.dog.pos);
    const DOGX = L(560, 545);
    await cast.dog.move(DOGX, 505, 700, 'ease-out');
    cast.dog.parts.tongue.setAttribute('opacity', 1);
    const pant = setInterval(() => cast.dog.parts.tongue.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4px)' }, { transform: 'translateY(0)' }], { duration: 300, iterations: 2 }), 700);
    T.pop(DOGX, 330, '헉헉!', C.persimmon);
    await say('강아지가 헉헉, 혀를 쭉 내밀었어요.');
    await say('강아지: "늙어서 사냥을 못 한다고 내보내졌어요."');
    clearInterval(pant); cast.dog.parts.tongue.setAttribute('opacity', 0);
    await say('당나귀: "그럼 우리 같이 브레멘에 가서 음악가가 되자!"');
    cast.dog.cry(); cast.dog.hop(34); T.pop(DOGX, 330, '좋아!', C.pine);
    await sleep(700);

    /* ---------- 3. 담장 위 누구? ② 고양이 (로우앵글) ---------- */
    await T.sceneCard('담장 위에 누구?', () => {
      T.clear(); wallBG(T);
      put(cast.cat, L(720, 610), L(270, 279), 1.6);
      cast.cat.lean.style.filter = 'brightness(.12)';
      put(cast.donkey, L(150, 330), 550, L(1.05, .9), 'right'); put(cast.dog, L(300, 450), 550, 1.15, 'right');
      camSnap(500, 280, 1);
    }, cast.dog.pos);
    cast.cat.cry();
    const q3 = '담장 위에서 야옹~ 누구일까요?';
    await say(q3);
    await soundChoice('cat', q3, () => cast.cat.cry());
    cast.cat.lean.style.filter = '';
    cast.cat.parts.whUp.setAttribute('opacity', 0); cast.cat.parts.whDown.setAttribute('opacity', 1);
    cast.cat.pose(POSE.sad);
    await sleep(500);
    await say('수염이 축 처진 고양이예요. "쥐를 못 잡는다고 내보내졌어."');
    await say('강아지: "우리랑 같이 가자! 브레멘에서 노래하자!"');
    cast.cat.parts.whUp.setAttribute('opacity', 1); cast.cat.parts.whDown.setAttribute('opacity', 0); cast.cat.pose(POSE.stand);
    await cast.cat.move(L(600, 590), 180, 350, 'ease-out');
    await cast.cat.move(L(450, 565), 550, 400, 'ease-in');
    cast.cat.setScale(L(1.3, 1.1)); cast.cat.cry(); T.pop(L(450, 565), 380, '폴짝!', C.persimmon);
    await sleep(600);

    /* ---------- 4. 지붕 위 누구? ③ 닭 (농가 지붕 로우앵글) ---------- */
    await T.sceneCard('지붕 위에 누구?', () => {
      T.clear(); roofBG(T);
      put(cast.rooster, L(650, 560), L(172, 184), 1.5);
      cast.rooster.lean.style.filter = 'brightness(.12)';
      put(cast.donkey, L(140, 320), 550, L(1.05, .9), 'right'); put(cast.dog, L(290, 450), 550, L(1.15, 1), 'right'); put(cast.cat, L(390, 545), 550, L(1.3, 1.05), 'right');
      camSnap(500, 280, 1);
    }, cast.cat.pos);
    cast.rooster.cry();
    const q4 = '지붕 위에서 꼬끼오! 누구일까요?';
    await say(q4);
    await soundChoice('rooster', q4, () => cast.rooster.cry());
    cast.rooster.lean.style.filter = '';
    flap(cast.rooster);
    T.pop(L(650, 560), 60, '푸드덕!', C.persimmon);
    await cast.rooster.move(L(600, 620), 120, 300, 'ease-out');
    flap(cast.rooster);
    await cast.rooster.move(L(530, 640), 550, 700, 'ease-in');
    cast.rooster.setScale(L(1.3, 1.05));
    await say('닭: "이제 나는 필요 없대. 꼬끼오…"');
    await say('당나귀: "우리랑 음악대 하자! 네 목소리 최고야!"');
    band.forEach((a, i) => setTimeout(() => sing(a), i * 250));
    await sleep(1400);
    await say('당나귀, 강아지, 고양이, 닭. 네 친구가 모였어요!');

    /* ---------- 5. 음악대 연습 (길가 풀밭 와이드) ---------- */
    const SPOT = L({ donkey: [200, 1.05], dog: [420, 1.2], cat: [590, 1.3], rooster: [770, 1.3] },
      { donkey: [390, .75], dog: [496, .85], cat: [592, 1], rooster: [668, .95] });
    await T.sceneCard('음악대 연습', () => {
      T.clear(); meadowBG(T);
      band.forEach(a => put(a, SPOT[a.key][0], 500, SPOT[a.key][1]));
      camSnap(500, 280, 1);
    }, cast.dog.pos);
    await say('길가 풀밭에서 노래 연습을 해요. 당나귀가 먼저 들려줄게요. 잘 듣고 똑같이 톡톡!');
    const PATTERNS = [['dog', 'cat'], ['donkey', 'dog', 'rooster'], ['cat', 'rooster', 'donkey']];
    const ui = el('g', {}, document.getElementById('stage'));
    let laughed = false;
    for (let r = 0; r < PATTERNS.length; r++) {
      const pat = PATTERNS[r];
      ui.innerHTML = '';
      const icons = pat.map((k, i) => {
        const x = 500 + (i - (pat.length - 1) / 2) * 96;
        const b = badge(T, x, 142, 40, k); ui.appendChild(b); b.style.opacity = '.25';
        return b;
      });
      if (r > 0) await say(r === 1 ? '이번엔 세 개! 잘 들어 봐요.' : '마지막 노래예요. 잘 들어 봐요.');
      for (let i = 0; i < pat.length; i++) {
        const a = cast[pat[i]];
        icons[i].style.opacity = '1';
        sing(a); await sleep(1100);
      }
      for (const b of icons) b.style.opacity = '.45';
      await say('이제 똑같이 톡톡!');
      for (let i = 0; i < pat.length; i++) {
        const good = cast[pat[i]];
        await T.choose(band.map(a => ({ el: a.pos, ok: a === good, onWrong: async () => {
          sing(a);
          await sleep(500);
          if (!laughed) { laughed = true; S.giggle(); await say('하하, 새 노래가 됐네! 한 번 더!'); }
          good.pos.style.filter = 'url(#hintGlow)';
          good.pos.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
        } })), { prompt: `${i === 0 ? '처음은' : '다음은'} 누구 소리였지?`, who: `${josa(good.name, '이에요/예요')}! 반짝이는 친구를 눌러 봐요!` });
        good.pos.style.filter = '';
        sing(good, true);
        icons[i].style.opacity = '1';
        T.anim(icons[i], [{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], 300);
        await sleep(700);
      }
      S.chord(392 + r * 60);
      band.forEach((a, i) => setTimeout(() => a.hop(16, 320), i * 100));
      await say(['멍멍, 야옹! 잘했어요!', '히힝, 멍멍, 꼬끼오! 멋진 노래예요!', '야옹, 꼬끼오, 히힝! 최고의 음악대예요!'][r]);
    }
    ui.remove();

    /* ---------- 6. 밤 숲 (하이앵글) ---------- */
    let fb;
    const FX0 = L({ donkey: 120, dog: 300, cat: 420, rooster: 530 }, { donkey: 330, dog: 450, cat: 535, rooster: 612 });
    const FS = L(1, .85), OWX = L(860, 650), GX = L(0, -240);
    const owl = mk('owl');
    await T.sceneCard('캄캄한 숲', () => {
      T.clear(); fb = forestBG(T);
      band.forEach(a => { put(a, FX0[a.key], 470, (a.key === 'donkey' ? .85 : 1) * FS, 'right'); a.lean.style.filter = 'brightness(.8)'; });
      put(owl, OWX, 150, 1.1);
      camSnap(500, 280, 1);
    }, cast.dog.pos);
    S.CRY.owl();
    T.pop(OWX, 60, '부엉~', C.cream);
    await say('해가 지고 캄캄한 숲이 되었어요. 부엉이가 부엉부엉.');
    await say('숲을 지나가요. 옆으로 쓱 밀어 줘요!');
    const area = el('rect', { x: 0, y: 0, width: 1000, height: 560, fill: '#fff', opacity: 0 }, T.world);
    let tx = 0;
    await T.swipe(area, { dir: 'right', count: 3, prompt: '옆으로 쓱! 숲을 지나가요.', onStep: i => {
      tx -= 170;
      fb.trees.animate([{ transform: `translateX(${tx + 170}px)` }, { transform: `translateX(${tx}px)` }], { duration: 700, fill: 'forwards', easing: 'ease-in-out' });
      owl.pos.animate([{ translate: `${tx + 170}px 0` }, { translate: `${tx}px 0` }], { duration: 700, fill: 'forwards', easing: 'ease-in-out' });
      band.forEach(a => a.lean.animate([{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 350, iterations: 2 }));
      S.step();
      T.pop(500, 200, ['쓱!', '쓱쓱!', '쓱쓱쓱!'][i - 1], C.cream);
    } });
    area.remove();
    await say('닭이 나무 꼭대기로 푸드덕 올라갔어요.');
    flap(cast.rooster);
    await cast.rooster.move(L(620, 560), 150, 700, 'ease-out');
    const glow = el('g', { transform: `translate(${GX},0)` }, T.bg);
    el('circle', { cx: 900, cy: 120, r: 60, fill: C.amber, opacity: .35 }, glow);
    el('rect', { x: 876, y: 100, width: 48, height: 40, fill: C.amber }, glow);
    glow.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: 'forwards' });
    cast.rooster.face('right');
    cast.rooster.cry(); T.pop(L(700, 560), 70, '불빛이다!', C.persimmon);
    await say('닭: "저기 불빛이 보여요! 집이 있어요!"');

    /* ---------- 7. 창문 탑 쌓기 (로우앵글 · 메인) ---------- */
    const TX = L(700, 590), TG = L(500, 470), TS = L(1, .85), WY = L(500, 548), WS = L(1, .7);
    const ORDER = ['donkey', 'dog', 'cat', 'rooster'];
    const WAIT_W = { donkey: 200, dog: 125, cat: 100, rooster: 95 };
    await T.sceneCard('탑 쌓기', () => {
      T.clear(); houseLowBG(T, TX - 700, TG - 500 + L(0, 50));
      const keys = ORDER.slice().sort(() => Math.random() - .5);
      let x = L(40, 500 - visW() / 2 + 8);
      keys.forEach(k => { const w = WAIT_W[k] * WS; put(cast[k], x + w * .55, WY, WS); x += w; });
      camSnap(500, 280, 1);
    }, cast.dog.pos);
    await say('불빛이 새어 나오는 창문이에요. 그런데 너무 높아서 아무도 안 닿아요.');
    cast.donkey.hop(24); await sleep(250); cast.dog.hop(30); await sleep(250); cast.cat.hop(30); await sleep(250); cast.rooster.hop(34);
    T.pop(TX, 300, '영차!', C.cream);
    await say('서로 등에 올라서 탑을 쌓아요! 크고 무거운 친구가 맨 아래예요.');
    const stacked = [];
    let top = { x: TX, y: TG };
    const tower = () => stacked.forEach((a, i) => setTimeout(() => a.lean.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(0deg)' }], { duration: 500, iterations: 2 }), i * 60));
    async function climb(a, x, y, s = TS) {
      T.world.appendChild(a.pos);
      a.face('left'); a.setScale(s);
      await a.move((a.x + x) / 2, Math.min(a.y, y) - 70, 320, 'ease-out');
      await a.move(x, y, 260, 'ease-in');
      S.thud();
    }
    for (let k = 0; k < 4; k++) {
      const good = cast[ORDER[k]];
      const waiting = band.filter(a => !stacked.includes(a));
      const prev = stacked[k - 1];
      const q = k === 0 ? '누가 맨 아래에 설까요?' : k === 3 ? '맨 꼭대기는 누구?' : `${prev.name} 등에는 누가 올라갈까요?`;
      if (k > 0) await say(q);
      let wrongOnce = false;
      await T.choose(waiting.map(a => ({ el: a.pos, ok: a === good, onWrong: async () => {
        const home = { ...a.home };
        if (k === 0) {
          // 작은 친구가 맨 아래에 서면 당나귀가 올라와서… 납작! (웃음 컷)
          await climb(a, TX, TG);
          const d = cast.donkey, dh = { ...d.home };
          await climb(d, TX + 6, TG - 26 * TS);
          T.world.appendChild(a.pos); a.pose(POSE.flat); S.thud(); T.shake(); T.pop(TX, 330, '납작!', C.persimmon);
          const st = stars(T, TX - 30, TG - 60 * TS);
          S.giggle();
          await sleep(900);
          await climb(d, dh.x, dh.y, WS); st.remove();
          a.pose(POSE.stand); a.hop(30);
          await climb(a, home.x, home.y, WS);
          await say(`${a.name}: "아이고, 무거워! 나는 위로 갈래~"`);
        } else {
          await climb(a, top.x, top.y);
          tower(); T.pop(TX, top.y - 120, '흔들흔들!', C.persimmon); AudioFX.sfx('creak', .6);
          await sleep(1000);
          await climb(a, home.x, home.y, WS);
          if (!wrongOnce) await say('흔들흔들! 더 크고 무거운 친구가 먼저예요.');
        }
        wrongOnce = true;
        a.place(home.x, home.y); a.home = home;
        good.pos.style.filter = 'url(#hintGlow)';
        good.pos.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
      } })), { prompt: q, who: `${josa(good.name, '이에요/예요')}! 반짝이는 친구를 눌러 봐요!` });
      good.pos.style.filter = '';
      await climb(good, top.x, top.y);
      stacked.push(good);
      good.cry(.7);
      const [bx, by] = BACK[good.key];
      top = { x: top.x + bx * TS, y: top.y + by * TS };
      T.tone(392 + k * 98, .25, { type: 'triangle', vol: .16 });
      if (k === 0) await say('당나귀가 맨 아래! 튼튼해요.');
    }
    tower();
    await say('당나귀, 강아지, 고양이, 닭! 닭이 창문에 닿았어요!');
    await camTo(TX, L(180, 200), 1.6, 900);

    /* ---------- 8. 창문 안 (닭의 시점) ---------- */
    const rb = [C.pine, C.bean, C.bark].map(c => mk('robber', c));
    let coins;
    await T.sceneCard('창문 안', () => {
      T.clear(); housePOV(T);
      L([[280, 1.25], [500, 1.35], [720, 1.25]], [[372, 1.1], [500, 1.2], [628, 1.1]]).forEach(([x, s], i) => put(rb[i], x, 470, s, i === 0 ? 'right' : 'left'));
      T.paper(T.world, [['rect', { x: 120, y: 380, width: 760, height: 26, rx: 6, fill: C.bark }], ['rect', { x: 150, y: 406, width: 700, height: 120, fill: '#5A3D29' }]]);
      coins = el('g', {}, T.world);
      for (let i = 0; i < 9; i++) T.paper(coins, [['ellipse', { cx: 420 + (i % 5) * 36 - (i > 4 ? -18 : 0), cy: 372 - (i > 4 ? 12 : 0), rx: 16, ry: 8, fill: C.gold }]]);
      const pl = L(0, 110);
      T.paper(T.world, [['ellipse', { cx: 230 + pl, cy: 372, rx: 60, ry: 14, fill: C.cream }], ['ellipse', { cx: 230 + pl, cy: 362, rx: 34, ry: 16, fill: C.amber }],
        ['ellipse', { cx: 760 - pl, cy: 372, rx: 60, ry: 14, fill: C.cream }], ['circle', { cx: 745 - pl, cy: 360, r: 14, fill: C.bean }], ['circle', { cx: 772 - pl, cy: 358, r: 14, fill: C.persimmon }]]);
      povFrame(T, L(70, 500 - visW() / 2 + 22));
      camSnap(500, 280, 1);
    }, cast.rooster.pos);
    const countC = setInterval(() => { S.jingle(); rb.forEach((r, i) => setTimeout(() => r.hop(10, 260), i * 90)); }, 900);
    await say('창문 안을 들여다보니, 도둑 셋이 금화를 세며 맛있는 걸 먹고 있어요.');
    T.pop(500, 170, '하하하!', C.bean);
    await say('도둑: "금화가 잔뜩이다! 하하하!"');
    clearInterval(countC);
    await say('닭: "우리 음악을 크게 들려주자!"');

    /* ---------- 9. 음악 대폭발 (창문 와이드 → 컷) ---------- */
    let hw;
    const WT = { x: 615, y: 488, s: .72 };
    await T.sceneCard('음악 대폭발', () => {
      T.clear(); hw = houseWideBG(T);
      let p = { x: WT.x, y: WT.y };
      band.forEach(a => { put(a, p.x, p.y, WT.s); p = { x: p.x + BACK[a.key][0] * WT.s, y: p.y + BACK[a.key][1] * WT.s }; });
      camSnap(500, 280, 1);
    });
    const hitT = el('rect', { x: 530, y: 220, width: 170, height: 270, fill: '#fff', opacity: 0 }, T.world);
    await say('다 같이 목청껏! 톡톡톡 눌러서 노래해요!');
    const WORDS = ['히힝!', '멍멍!', '야옹!', '꼬끼오!'];
    await T.mash(hitT, { count: 8, prompt: '탑을 톡톡톡! 더 크게 노래해요!', onStep: i => {
      const v = Math.min(1, .35 + i * .09);
      band.forEach((a, k) => setTimeout(() => { a.cry(v); a.lean.animate([{ translate: '0 0' }, { translate: `0 ${-6 - i * 1.5}px` }, { translate: '0 0' }], { duration: 260 }); }, k * 45));
      T.pop(i % 2 ? 800 : 430, 200 - (i % 3) * 30, WORDS[(i - 1) % 4], C.bean);
      for (let n = 0; n < 1 + Math.floor(i / 3); n++) note(T, 560 + Math.random() * 120, 240, [C.bean, C.gold, C.cream][n % 3]);
      if (i >= 5) T.shake();
    } });
    hitT.remove();
    S.boom();
    await T.cut(svg => {
      T.el('rect', { x: 110, y: 70, width: 180, height: 150, fill: C.amber }, svg);
      [[110, 70, 170, 120], [290, 70, 230, 150], [110, 220, 180, 150], [290, 220, 220, 120]].forEach(([x1, y1, x2, y2]) => T.el('path', { d: `M${x1} ${y1} L${x2} ${y2} L${(x1 + x2) / 2 + 14} ${(y1 + y2) / 2 - 10} Z`, fill: C.snow }, svg));
      const g1 = T.el('g', { transform: 'translate(200,270) rotate(-18) scale(.9)' }, svg); DRAW.donkey(T, g1);
      const g2 = T.el('g', { transform: 'translate(110,150) rotate(20) scale(1.1)' }, svg); DRAW.dog(T, g2);
      const g3 = T.el('g', { transform: 'translate(300,130) rotate(-30) scale(1.2)' }, svg); DRAW.cat(T, g3);
      const g4 = T.el('g', { transform: 'translate(220,90) rotate(15) scale(1.1)' }, svg); DRAW.rooster(T, g4);
      T.el('text', { x: 200, y: 60, 'text-anchor': 'middle', 'font-size': 60, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: '와장창!' }, svg);
    }, { hold: 2000 });
    // 탑째로 창문 안으로 쏙
    band.slice().reverse().forEach((a, i) => setTimeout(() => {
      a.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
    }, i * 80));
    hw.win.firstChild.nextSibling.setAttribute('fill', '#FFE39A');
    await sleep(700);
    band.forEach(a => { a.pos.getAnimations().forEach(x => x.cancel()); a.pos.style.opacity = '0'; });
    AudioFX.sfx('door');
    hw.door.style.transform = 'scaleX(.1)';
    rb.forEach((r, i) => { put(r, 380, 488, .72, 'left'); r.pos.style.opacity = '0'; });
    T.pop(560, 150, '괴물이다!', C.bean);
    for (let i = 0; i < 3; i++) {
      const r = rb[i]; r.pos.style.opacity = '';
      r.parts.mouth.setAttribute('ry', 8);
      walk(r, -120, 488, 1100, false);
      r.hop(40, 400);
      await sleep(350);
    }
    await sleep(900);
    await T.cut(svg => {
      T.el('rect', { x: 0, y: 230, width: 400, height: 70, fill: '#3E5A3A' }, svg);
      [[90, 260, C.pine, -12], [200, 250, C.bean, 8], [310, 262, C.bark, -6]].forEach(([x, y, c, r]) => {
        const g = T.el('g', { transform: `translate(${x},${y}) rotate(${r}) scale(1.05)` }, svg); const p = DRAW.robber(T, g, c); p.mouth.setAttribute('ry', 9);
        T.el('path', { d: 'M-26 -176 L-10 -196 M0 -180 L0 -204 M26 -176 L10 -196', stroke: C.cream, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      });
      T.el('text', { x: 200, y: 58, 'text-anchor': 'middle', 'font-size': 50, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: '으악, 괴물이다!' }, svg);
    }, { hold: 2200 });
    S.giggle();
    await say('도둑들은 "괴물이다!" 하고 숲으로 후다닥 달아났어요.');
    await say('네 친구는 남은 음식을 냠냠 먹고, 불을 끄고 잠이 들었어요.');

    /* ---------- 10. 도둑의 정찰 (캄캄한 집 안, 눈만 보임) ---------- */
    const SPOTS = L([['cat', 180, 478, 1.3], ['dog', 470, 478, 1.25], ['donkey', 690, 486, .95], ['rooster', 860, 120, 1.2]],
      [['cat', 320, 478, 1.1], ['dog', 440, 478, 1.05], ['donkey', 590, 486, .8], ['rooster', 665, 120, 1.1]]);
    const STOPS = L([300, 380, 590, 800, 1150], [385, 520, 680, 700, 1150]);
    const thief = rb[0];
    await T.sceneCard('캄캄한 밤', () => {
      T.clear(); darkRoomBG(T, Object.fromEntries(SPOTS.map(([k, x]) => [k, x])));
      SPOTS.forEach(([k, x, y, s]) => { put(cast[k], x, y, s, k === 'rooster' ? 'left' : 'right'); cast[k].lean.style.filter = 'brightness(.14)'; cast[k].pose(POSE.sleep); });
      put(thief, 1100, 486, 1, 'left');
      thief.lean.style.filter = 'brightness(.6)'; thief.parts.mouth.setAttribute('ry', 2);
      camSnap(500, 280, 1);
    });
    await say('한밤중, 도둑 하나가 살금살금 돌아왔어요. 쉿!');
    const REACT = {
      cat: { q: '아궁이 안에서 뭔가 반짝! 톡 눌러 봐요.', pop: '야옹! 할퀴!', say: '도둑: "앗, 따가워! 불씨인 줄 알았는데!"' },
      dog: { q: '문 앞에 또 반짝! 톡 눌러 봐요.', pop: '멍멍!', say: '도둑: "아얏! 다리를 콕 찔렸어!"' },
      donkey: { q: '짚더미에도 반짝! 톡 눌러 봐요.', pop: '히힝! 뻥!', say: '도둑: "으악! 누가 쿵 찼어!"' },
      rooster: { q: '저 위 들보에서도 반짝! 톡 눌러 봐요.', pop: '꼬끼오!', say: '도둑: "살려 줘~!"' },
    };
    await walk(thief, STOPS[0], 486, 1800, false);
    for (const [si, [k]] of SPOTS.entries()) {
      const a = cast[k], [ex, ey] = EYE[k], s = a.scale * (a.flip === -1 ? -1 : 1);
      const eyes = el('g', { transform: `translate(${a.x + ex * s},${a.y + ey * a.scale})` }, T.world);
      el('circle', { r: 56, fill: '#fff', opacity: 0 }, eyes);
      [-9, 9].forEach(dx => el('ellipse', { cx: dx, cy: 0, rx: 6, ry: 8, fill: '#FFE066' }, eyes));
      eyes.animate([{ opacity: .2 }, { opacity: 1 }], { duration: 500, fill: 'forwards' });
      T.tone(1400, .1, { type: 'sine', vol: .08 });
      const R = REACT[k];
      await say(R.q);
      await T.tap(eyes, { prompt: R.q });
      eyes.remove();
      a.lean.style.filter = 'brightness(1)'; a.pose(POSE.stand);
      a.cry(1); a.hop(24);
      T.pop(a.x, Math.max(120, a.y - 150 * a.scale), R.pop, C.bean);
      thief.parts.mouth.setAttribute('ry', 8);
      thief.hop(50, 420); T.shake();
      await sleep(700);
      await say(R.say);
      a.lean.style.filter = 'brightness(.14)'; a.pose(POSE.sleep);
      thief.parts.mouth.setAttribute('ry', 2);
      await walk(thief, STOPS[si + 1], 486, k === 'rooster' ? 900 : 700, false);
    }

    /* 도둑의 과장 보고 (숲 속 와이드) */
    await T.sceneCard(null, () => {
      T.clear(); const f = forestBG(T);
      put(rb[1], L(400, 370), 470, 1.1, 'right'); put(rb[2], L(520, 460), 470, 1.1, 'right');
      put(thief, 1100, 470, 1.1, 'left'); thief.lean.style.filter = '';
      camSnap(500, 280, 1);
    });
    await walk(thief, L(700, 610), 470, 900, false);
    thief.parts.mouth.setAttribute('ry', 8);
    await say('도둑: "그 집엔 귀신이 할퀴고, 누가 다리를 콕 찌르고, 거인이 쿵 차고, 지붕에선 재판관이 도둑 잡아라! 소리쳤어!"');
    rb.forEach(r => { r.parts.mouth.setAttribute('ry', 9); r.hop(40, 380); });
    T.pop(500, 200, '으악!', C.bean);
    await sleep(400);
    rb.forEach((r, i) => walk(r, -200 - i * 60, 470, 1400, false));
    await sleep(1200);
    await T.cut(svg => {
      const cells = [['cat', 0, 0, '귀신?', 1.25], ['dog', 200, 0, '콕?', 1.2], ['donkey', 0, 150, '거인?', .6], ['rooster', 200, 150, '재판관?', 1.2]];
      T.el('rect', { x: 0, y: 0, width: 400, height: 300, fill: C.cream }, svg);
      T.el('path', { d: 'M200 0 V300 M0 150 H400', stroke: C.bark, 'stroke-width': 6 }, svg);
      cells.forEach(([k, x, y, w, s]) => {
        const g = T.el('g', { transform: `translate(${x + 84},${y + 140}) scale(${s})` }, svg); DRAW[k](T, g);
        T.el('text', { x: x + 160, y: y + 38, 'text-anchor': 'middle', 'font-size': 28, fill: C.bean, stroke: '#fff', 'stroke-width': 6, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: w }, svg);
      });
    }, { hold: 3000 });
    S.giggle();
    await say('사실은 고양이, 강아지, 당나귀, 닭이었는데 말이에요! 도둑들은 다시는 오지 않았어요.');

    /* ---------- 11. 우리 집 (아침 와이드 · 자유 합주) ---------- */
    const HOME = L({ donkey: [190, 486, 1], dog: [520, 486, 1.15], cat: [860, 410, 1.1], rooster: [470, 176, 1.1] },
      { donkey: [385, 486, .85], dog: [505, 486, 1], cat: [648, 410, 1], rooster: [470, 176, 1.1] });
    const hx = k => HOME[k][0];
    const INST = { donkey: 'drum', dog: 'horn', cat: 'fiddle', rooster: 'bell' };
    await T.sceneCard('우리 집', () => {
      T.clear(); morningBG(T, hx('donkey') - 10, hx('cat'));
      band.forEach(a => put(a, ...HOME[a.key]));
      // 악기 소품
      const dX = hx('donkey') + 60, gX = hx('dog') + 50, cX = hx('cat') + 60;
      T.paper(T.world, [['rect', { x: dX, y: 440, width: 44, height: 40, rx: 6, fill: C.bean }], ['ellipse', { cx: dX + 22, cy: 440, rx: 22, ry: 8, fill: C.cream }]]);
      T.paper(T.world, [['path', { d: `M${gX} 470 L${gX + 40} 450 L${gX + 40} 490 Z`, fill: C.gold }]]);
      T.paper(T.world, [['ellipse', { cx: cX, cy: 400, rx: 10, ry: 18, fill: C.bark }], ['rect', { x: cX - 3, y: 360, width: 5, height: 30, fill: C.ink }]]);
      T.paper(T.world, [['path', { d: 'M500 158 Q512 130 524 158 Z', fill: C.gold }]]);
      camSnap(500, 280, 1);
    });
    AudioFX.sfx('bell', .4);
    await say('아침이 밝았어요. 네 친구는 이 집이 참 좋았어요.');
    await say('"브레멘은 못 갔지만, 여기가 우리 집이야!"');
    await say('당나귀는 마당 짚더미, 강아지는 문 앞, 고양이는 아궁이, 닭은 지붕 위. 톡톡 눌러서 마음껏 연주해요!');
    const PLAY = {
      donkey: () => AudioFX.sfx('drum', .8) || T.tone([160, 90], .25, { type: 'sine', vol: .3 }),
      dog: () => [0, .15].forEach(w => T.tone(523, .14, { type: 'square', vol: .08, when: w })),
      cat: () => T.tone([660, 880], .5, { type: 'sawtooth', vol: .07 }),
      rooster: () => AudioFX.sfx('bell', .5) || T.tone(1320, .5, { type: 'sine', vol: .12 }),
    };
    await T.free(band.map(a => ({ el: a.pos, onTap: () => {
      a.cry(.8); setTimeout(PLAY[a.key], 250); a.hop(20, 340);
      T.pop(a.x + (a.key === 'donkey' ? 40 : 0), Math.max(90, a.y - (a.key === 'donkey' ? 250 : 130) * a.scale), a.word, C.bean);
      note(T, a.x + 20, a.y - 90 * a.scale, [C.bean, C.pine, C.persimmon][Math.floor(Math.random() * 3)]);
    } })), 30000);
    band.forEach((a, i) => setTimeout(() => { a.cry(.6); a.hop(24, 380); }, i * 200));
    T.confetti(); S.chord(523);
    await say('함께라서 행복한 브레멘 음악대였답니다.');
    return '나이 들어도, 작아도, 함께라면 해낼 수 있어요!';
  }

  Tale.mount({ title: '브레멘 음악대', subtitle: '네 친구의 신나는 합창', run: () => run(Tale.api) });
})();
