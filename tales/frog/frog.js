/* 황소와 개구리 — 페이퍼아트 그림 버전 (그림이 아직 없는 것은 임시 도형). 기획: TALES_PLAN.md §2
   "누가 더 커?" 비교 놀이 → 엄마 개구리 부풀리기 → 뻥! 풍선처럼 날아다니다 퐁당 → 폴짝 대회 → 밤 연못 합창.
   3~4세 순화: 개구리는 터져 다치지 않는다 — 공기가 빠지며 날아다니다 원래 크기로 돌아온다.
   - 배경: 장면마다 한 장(assets/v3w/frog_bg_*.webp)을 무대 전체에 깐다. 깊이감은 그림 속 종이 층이 맡는다.
   - 배우: 같은 배우 틀(발끝 = 배우 y) 안에 그림(<image>)을 넣는다. 톡 대상·크기·방향·폴짝은 그대로. */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', lily: '#5E8A4A', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32',
    indigo: '#1F2A56', lav: '#8B7BB8', persimmon: '#E8703A', pink: '#E8A0A0', ink: '#2E241C', sky: '#F2DFA8', snow: '#F4F6FA' };

  /* ================= 완성 그림 목록 =================
     null = 쓸 그림이 없어 임시 도형으로 그린다. 새 파일이 나오면 여기 한 줄만 바꾸면 된다.
     초록 캐릭터는 마젠타 배경으로 다시 뽑은 파일 (tools/gpu_night/jobs_green_redo.json).
     lilypad: 다시 뽑은 연잎에 붙어 나온 눈·볼을 지우고(assets/v3/frog_lilypad.png) 연꽃만 남겼다
     baby_sleep: 그림은 눈을 뜨고 있어서, 그 위에 감은 눈꺼풀(임시 도형)을 덧댄다 (BABY_LIDS) */
  const ART = {
    bg_pond: 'v3w/frog_bg_pond.webp', bg_meadow: 'v3w/frog_bg_meadow.webp', bg_chart: 'v3w/frog_bg_chart.webp',
    bg_night: 'v3w/frog_bg_pond_night.webp',
    mom: 'v3w/frog_mom.webp', mom_flying: 'v3w/frog_mom_flying.webp', mom_puffed: 'v3w/frog_mom_puffed.webp', mom_dizzy: 'v3w/frog_mom_dizzy.webp',
    baby_sleep: 'v3w/frog_baby_sleep_shut2.webp', baby_awake: 'v3w/frog_baby_awake2.webp', baby_cover: 'v3w/frog_baby_cover.webp', // 2026-10-04: 눈 감은 아기 그림(코 방울) — 눈꺼풀 덧그림(BABY_LIDS)은 예전 그림(frog_baby_sleep)일 때만
    /* 2026-10-04 코드 도형을 대신하는 새 그림 (jobs_svg.json): 삼촌 개구리(밤 합창), 퀴즈 배지 6종.
       꼬리·발굽·뿔은 황소 전체가 그려져 나와서 그 부위만 오렸다 (스크래치 g1/conv_g1.py) */
    uncle: 'v3w/frog_uncle.webp',
    icon_tail: 'v3w/frog_icon_tail.webp', icon_tree: 'v3w/frog_icon_tree.webp', icon_hoof: 'v3w/frog_icon_hoof.webp',
    icon_rock: 'v3w/frog_icon_rock.webp', icon_horn: 'v3w/frog_icon_horn.webp', icon_branch: 'v3w/frog_icon_branch.webp',
    tadpole: 'v3w/frog_tadpole.webp',
    lilypad: 'v3w/frog_lilypad.webp', // 위에서 본 둥근 연잎(480×354) — 물 위에 누운 모양으로 납작하게 눌러 깐다 (padAt)
    ox_stand: 'v3w/frog_ox_stand.webp', ox_kneel: 'v3w/frog_ox_kneel.webp', ox_jumpfail: 'v3w/frog_ox_jumpfail.webp',
    duck: 'v3w/frog_duck.webp', sheep: 'v3w/frog_sheep.webp',
    cut_monster: 'v3w/frog_cut_monster.webp', cut_pop: 'v3w/frog_cut_pop.webp', cut_fly: 'v3w/frog_cut_fly.webp',
    cut_splash: 'v3w/frog_cut_splash.webp', cut_jump: 'v3w/frog_cut_jump.webp',
  };
  const A = p => '../../assets/' + p;
  /* 배경 그림 둘레 색 [위, 아래] — 세로 화면에서 물러설 때(줌아웃) 그림 밖을 채운다 */
  const EDGE = { bg_pond: ['#9acbe3', '#414e3f'], bg_meadow: ['#9fcbd9', '#18270e'], bg_chart: ['#fcecaf', '#637055'], bg_night: ['#000111', '#000b23'] };
  /* 장면 그림 한 장을 무대 전체에 (없으면 false → 임시 도형 배경) */
  function artBG(T, key, parent = T.bg) {
    if (!ART[key]) return false;
    const [top, bot] = EDGE[key] || ['#F2DFA8', '#7c9a58'];
    T.el('rect', { x: -1200, y: -1200, width: 3400, height: 1480, fill: top }, parent);
    T.el('rect', { x: -1200, y: 280, width: 3400, height: 1600, fill: bot }, parent);
    return T.el('image', { href: A(ART[key]), x: -40, y: -22, width: 1080, height: 605, preserveAspectRatio: 'xMidYMid slice' }, parent);
  }
  /* 배우 그림: 발끝(0,0) 기준 w×h 상자 안에 아래·가운데 맞춤. flip: 그림이 코드가 가정한 쪽과 반대를 볼 때 */
  function sprite(T, g, key, w, h, { flip = false, dx = 0 } = {}) {
    if (!ART[key]) return null;
    const wrap = T.el('g', { filter: 'url(#pp)', transform: `translate(${dx} 0)${flip ? ' scale(-1 1)' : ''}` }, g);
    T.el('image', { href: A(ART[key]), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'xMidYMax meet' }, wrap);
    return wrap;
  }
  /* 여러 자세 그림을 한 배우 안에 겹쳐 두고 하나만 보인다. 없는 자세를 부르면 기본(첫 자세)으로 */
  function poseArt(T, g, defs) {
    const imgs = {};
    let first = null;
    for (const [k, [key, w, h, o]] of Object.entries(defs)) { const s = sprite(T, g, key, w, h, o); if (s) { imgs[k] = s; first = first || k; } }
    const set = k => { if (!imgs[k]) k = first; Object.entries(imgs).forEach(([n, s]) => { s.style.display = n === k ? '' : 'none'; }); };
    if (first) set(first);
    return first ? { set, has: k => !!imgs[k] } : null;
  }
  /* 그림 컷 (없으면 false → 부른 쪽이 임시 컷) */
  const cutArt = (T, list, hold = 2600) => {
    const l = list.filter(([k]) => ART[k]).map(([k, sfx, h]) => ({ src: A(ART[k]), sfx, hold: h || hold }));
    return l.length ? T.cutImage(l, { hold }) : null;
  };

  /* ================= 그림 도우미 (임시 도형) ================= */
  function drawFrog(T, g, { color = C.pine, sleepy = false } = {}) {
    const { el, paper } = T;
    const layers = paper(g, [
      ['ellipse', { cx: -26, cy: -8, rx: 16, ry: 8, fill: color }], ['ellipse', { cx: 26, cy: -8, rx: 16, ry: 8, fill: color }],
      ['ellipse', { cx: 0, cy: -32, rx: 40, ry: 30, fill: color }],
    ]);
    const inner = el('ellipse', { cx: 0, cy: -26, rx: 26, ry: 18, fill: C.cream }, layers); // 배판 (부풀면 벌어지는 안쪽 층)
    const eyes = el('g', {}, layers);
    [-17, 17].forEach(x => {
      el('circle', { cx: x, cy: -60, r: 12, fill: color }, eyes);
      el('circle', { cx: x, cy: -61, r: 9, fill: '#fff' }, eyes);
    });
    const pupils = el('g', {}, eyes);
    [-17, 17].forEach(x => el('circle', { cx: x, cy: -60, r: 4.5, fill: C.ink }, pupils));
    const lids = el('g', { opacity: sleepy ? 1 : 0 }, eyes);
    [-17, 17].forEach(x => el('path', { d: `M${x - 9} -61 Q${x} -54 ${x + 9} -61`, stroke: C.ink, 'stroke-width': 3, fill: color }, lids));
    [-26, 26].forEach(x => el('circle', { cx: x, cy: -38, r: 5, fill: C.pink, opacity: .8 }, layers));
    const mouth = el('path', { d: 'M-12 -40 Q0 -32 12 -40', stroke: C.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, layers);
    const hands = el('g', { opacity: 0 }, layers); // 눈 가리기
    [-17, 17].forEach(x => el('ellipse', { cx: x, cy: -60, rx: 13, ry: 9, fill: color, stroke: '#2f5a3f', 'stroke-width': 2 }, hands));
    return { inner, lids, mouth, hands, pupils };
  }
  /* 아기 개구리: 자는·깬·눈 가린 그림. 코드가 쓰는 parts(lids·hands)의 opacity를 자세 바꾸기로 이어 준다.
     자는 그림은 눈을 뜨고 있어 감은 눈꺼풀을 덧댄다 */
  const BABY_LIDS = [[-18.4, -57], [13.4, -57]]; // frog_baby_sleep 상자(78×67) 안 눈 자리
  function drawBaby(T, g) {
    const shut = /sleep_shut/.test(ART.baby_sleep || ''); // 눈 감은 그림이면 눈꺼풀 덧그림이 필요 없다 (머리 크기를 깬 그림에 맞춘 상자 69×76)
    const p = poseArt(T, g, { awake: ['baby_awake', 69, 76], sleep: ['baby_sleep', ...(shut ? [69, 76] : [78, 67])], cover: ['baby_cover', 71, 73] });
    if (!p) return drawFrog(T, g, { color: C.leaf, sleepy: true });
    const st = { lids: 1, hands: 0 };
    const upd = () => p.set(st.hands ? 'cover' : st.lids ? 'sleep' : 'awake');
    const lidG = T.el('g', {}, g);
    if (!shut) BABY_LIDS.forEach(([x, y]) => {
      T.el('circle', { cx: x, cy: y, r: 9.6, fill: '#C2D05E' }, lidG);
      T.el('path', { d: `M${x - 6} ${y} Q${x} ${y + 5} ${x + 6} ${y}`, stroke: C.ink, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }, lidG);
    });
    const knob = k => ({ setAttribute(a, v) { st[k] = +v; upd(); lidG.style.display = !st.hands && st.lids ? '' : 'none'; } });
    const parts = { lids: knob('lids'), hands: knob('hands') };
    upd();
    return parts;
  }
  /* 엄마 개구리: 그림(기본·날기·부푼·어지러운)이 있으면 그림, 없으면 임시 도형. 그림은 정면이라 돌려세우지 않는다 */
  function drawMom(T, g) {
    // 상자 크기 = 원본 그림 크기 × 같은 배율 (자세를 바꿔도 몸 크기가 튀지 않게)
    const p = poseArt(T, g, { base: ['mom', 76, 94], flying: ['mom_flying', 80, 63], puffed: ['mom_puffed', 97, 93], dizzy: ['mom_dizzy', 74, 87] });
    if (p) return p;
    drawFrog(T, g);
    return { set() {}, has: () => false };
  }
  /* 황소 (왼쪽을 본다, 발끝 0,0). 자세: stand · kneel · jumpfail. 크기는 임시 도형 황소(높이 약 300)에 맞춤 */
  function drawOx(T, g, { dotted = false, pose = 'stand' } = {}) {
    const { paper, el } = T;
    if (!dotted) {
      const p = poseArt(T, g, { stand: ['ox_stand', 440, 300, { dx: -20 }], kneel: ['ox_kneel', 444, 244, { dx: -20 }], jumpfail: ['ox_jumpfail', 426, 314, { dx: -20 }] });
      if (p) { p.set(pose); return p; }
    }
    if (dotted) {
      el('path', { d: 'M-150 0 V-80 M150 0 V-80 M-110 0 V-80 M110 0 V-80 M-160 -80 Q-160 -230 0 -230 Q160 -230 160 -80 Z M-165 -190 Q-230 -200 -235 -150 Q-230 -110 -170 -120 M-215 -205 Q-225 -240 -200 -250',
        fill: 'rgba(107,74,50,.12)', stroke: C.bark, 'stroke-width': 5, 'stroke-dasharray': '14 10' }, g);
      return {};
    }
    paper(g, [
      ['rect', { x: -150, y: -80, width: 26, height: 80, rx: 8, fill: '#5a3d29' }], ['rect', { x: 124, y: -80, width: 26, height: 80, rx: 8, fill: '#5a3d29' }],
      ['rect', { x: -110, y: -80, width: 26, height: 80, rx: 8, fill: C.bark }], ['rect', { x: 84, y: -80, width: 26, height: 80, rx: 8, fill: C.bark }],
      ...[-150, -110, 84, 124].map(x => ['rect', { x: x - 2, y: -22, width: 30, height: 22, rx: 6, fill: C.ink }]), // 발굽
      ['rect', { x: -160, y: -230, width: 320, height: 160, rx: 70, fill: C.bark }],
      ['ellipse', { cx: 40, cy: -170, rx: 50, ry: 34, fill: '#8a6344' }],
      ['path', { d: 'M155 -190 Q200 -150 186 -90', stroke: '#5a3d29', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }],
      ['ellipse', { cx: 186, cy: -84, rx: 12, ry: 16, fill: C.ink }],
      ['rect', { x: -250, y: -250, width: 110, height: 120, rx: 46, fill: C.bark }],
      ['path', { d: 'M-230 -245 Q-270 -290 -240 -300 M-160 -245 Q-120 -290 -150 -300', stroke: C.cream, 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }],
      ['ellipse', { cx: -238, cy: -150, rx: 34, ry: 24, fill: '#c9a07a' }],
      ['circle', { cx: -250, cy: -150, r: 4, fill: C.ink }], ['circle', { cx: -226, cy: -150, r: 4, fill: C.ink }],
      ['circle', { cx: -225, cy: -205, r: 8, fill: '#fff' }], ['circle', { cx: -227, cy: -205, r: 4, fill: C.ink }],
    ]);
    return { set() {}, has: () => false };
  }
  /* 황소 들여다보기 창: 무대의 황소(ox_stand, 발끝 at)와 똑같은 그림·자리를 창 안에서 크게 비춘다.
     PEEK: 부위별 [무대 좌표 가운데 x, y, 확대 배율] — 황소 그림 811×560이 발끝 기준 440×300 상자(dx -20)에 들어간 자리로 잰 값 */
  const PEEK = { tail: [703, 385, 3.2], hoof: [440, 488, 3.0], horn: [440, 252, 3.6] };
  function oxPeek(T, at) {
    const { el } = T, pt = () => T.viewWidth() < 990;
    const g = el('g', {}, T.world);
    // 창 밖: 같은 풀밭을 종이로 덮고 살짝 어둡게
    grassCover(T, g);
    el('rect', { x: -1200, y: -1200, width: 3400, height: 2960, fill: '#1c1a14', opacity: .45 }, g);
    const id = 'peekClip';
    const cp = el('clipPath', { id }, el('defs', {}, g));
    const hole = el('circle', { cx: 500, cy: 262, r: 210 }, cp);
    const win = el('g', { 'clip-path': `url(#${id})` }, g);
    const zoom = el('g', { opacity: 0 }, win); // 첫 문제 전에는 창을 비워 둔다 (황소 전체가 먼저 보이지 않게)
    grassCover(T, zoom);
    const ox = el('g', { transform: `translate(${at[0]} ${at[1]})` }, zoom);
    drawOx(T, ox);
    const ring = el('circle', { cx: 500, cy: 262, r: 210, fill: 'none', stroke: C.cream, 'stroke-width': 14, filter: 'url(#pp)' }, g);
    const place = () => { const r = pt() ? Math.min(170, T.viewWidth() / 2 - 16) : 210, cy = pt() ? 205 : 262;
      [hole, ring].forEach(n => { n.setAttribute('r', r); n.setAttribute('cy', cy); }); return [r, cy]; };
    return {
      async show(part, swap) {
        if (swap) { AudioFX.swish(); await T.anim(zoom, [{ opacity: 1 }, { opacity: 0 }], 250); }
        const [r, cy] = place(), [x, y, z0] = PEEK[part], z = z0 * r / 210;
        zoom.setAttribute('transform', `translate(500 ${cy}) scale(${z.toFixed(3)}) translate(${-x} ${-y})`);
        zoom.removeAttribute('opacity'); await T.anim(zoom, [{ opacity: 0 }, { opacity: 1 }], 300);
      },
      async hide() { await T.anim(g, [{ opacity: 1 }, { opacity: 0 }], 900); g.remove(); },
    };
  }
  /* 풀밭 그림을 다른 그룹 안에 한 번 더 (들여다보기 창 안·밖) */
  function grassCover(T, parent) { if (!artBG(T, 'bg_meadow', parent)) T.el('rect', { x: -1200, y: -1200, width: 3400, height: 2960, fill: '#7c9a58' }, parent); }
  const ANIMALS = {
    tadpole: { name: '올챙이', h: 36, draw: (T, g) => sprite(T, g, 'tadpole', 76, 43) || T.paper(g, [['path', { d: 'M18 -18 Q50 -30 60 -10 Q50 -2 18 -14', fill: '#2f4a3a' }], ['circle', { cx: 0, cy: -18, r: 18, fill: '#2f4a3a' }], ['circle', { cx: -6, cy: -22, r: 4, fill: '#fff' }]]) },
    frog: { name: '개구리', h: 72, draw: (T, g) => sprite(T, g, 'mom', 64, 80) || drawFrog(T, g) },
    duck: { name: '오리', h: 118, draw: (T, g) => sprite(T, g, 'duck', 116, 122) || T.paper(g, [['ellipse', { cx: 0, cy: -40, rx: 46, ry: 34, fill: C.snow }], ['circle', { cx: -30, cy: -92, r: 26, fill: C.snow }], ['path', { d: 'M-54 -92 L-80 -86 L-54 -80 Z', fill: C.persimmon }], ['circle', { cx: -36, cy: -98, r: 4, fill: C.ink }], ['rect', { x: -12, y: -8, width: 8, height: 10, fill: C.persimmon }], ['rect', { x: 8, y: -8, width: 8, height: 10, fill: C.persimmon }]]) },
    sheep: { name: '양', h: 150, draw: (T, g) => sprite(T, g, 'sheep', 190, 152) || T.paper(g, [['rect', { x: -44, y: -50, width: 14, height: 50, fill: C.ink }], ['rect', { x: 30, y: -50, width: 14, height: 50, fill: C.ink }], ['ellipse', { cx: 0, cy: -80, rx: 70, ry: 46, fill: C.cream }], ['circle', { cx: -40, cy: -110, r: 26, fill: C.cream }], ['circle', { cx: 30, cy: -112, r: 24, fill: C.cream }], ['ellipse', { cx: -70, cy: -104, rx: 22, ry: 28, fill: '#4a3a30' }], ['circle', { cx: -76, cy: -110, r: 4, fill: '#fff' }]]) },
    ox: { name: '황소', h: 300, draw: (T, g) => drawOx(T, g) },
  };

  /* ================= 배경 ================= */
  /* 세로 화면은 무대 양옆이 잘린다(보이는 폭 = T.viewWidth()) → 연잎을 가운데로 모아 준다. 가로는 k = 1 */
  const squeeze = T => Math.min(1, (T.viewWidth() / 2 - 60) / 250);
  /* 그림 속 연잎 자리 (발끝). 낮·밤 모두 한 줄에 다섯 장.
     START: 폴짝 대회 출발 자리 — 그림에 앞줄 연잎이 없어 임시 도형 연잎을 깐다 */
  const PADS = { day: [[218, 336], [362, 336], [508, 336], [655, 334], [790, 337]], night: [[160, 398], [343, 406], [513, 408], [673, 416], [833, 421]] };
  const START = [150, 452];
  /* 연잎: 그림(위에서 본 둥근 연잎)을 물 위에 누운 모양으로 납작하게 (발끝 x,y가 연잎 가운데). 그림이 없으면 임시 도형 */
  const padAt = (T, x, y, rx = 96) => (ART.lilypad ? T.el('image', { href: A(ART.lilypad), x: x - rx * 1.1, y: y - rx * .36, width: rx * 2.2, height: rx * .8, preserveAspectRatio: 'none', filter: 'url(#pp)' }, T.world) : null)
    || T.paper(T.world, [['ellipse', { cx: x, cy: y + 4, rx, ry: rx * .23, fill: C.lily }], ['path', { d: `M${x} ${y + 4} L${x + rx * .69} ${y - 8} L${x + rx * .76} ${y + 7} Z`, fill: '#6f9a9c' }]]);
  function pondBG(T, night = false, k = squeeze(T)) {
    if (artBG(T, night ? 'bg_night' : 'bg_pond')) return PADS[night ? 'night' : 'day'].map(p => [...p]); // 그림 속 연잎은 움직일 수 없다 — 세로 화면은 도우미가 카메라로 맞춘다
    const { el, paper } = T, b = T.bg;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: night ? '#16204a' : C.sky }, b);
    if (night) {
      el('circle', { cx: 820, cy: 100, r: 44, fill: C.cream }, b);
      [[120, 80], [300, 50], [520, 110], [680, 60], [930, 150]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 4, fill: C.cream }, b));
    } else el('circle', { cx: 150, cy: 100, r: 46, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 330 Q150 230 420 310 Q700 220 1200 320 V600 H-200 Z', fill: night ? '#2a355f' : '#b9a25a' }]]);
    paper(b, [['rect', { x: -200, y: 360, width: 1400, height: 400, fill: night ? '#243048' : '#7c9a58' }]]);
    paper(b, [['ellipse', { cx: 500, cy: 470, rx: 470, ry: 110, fill: night ? C.indigo : '#4f6f9a' }], ['ellipse', { cx: 500, cy: 470, rx: 400, ry: 80, fill: night ? '#2d3a6e' : C.lav }]]);
    return [[250, 470], [370, 492], [500, 468], [630, 492], [750, 470]].map(([x, y]) => {
      x = Math.round(500 + (x - 500) * k);
      const rx = Math.round(58 * Math.max(k, .7));
      paper(T.bg, [['ellipse', { cx: x, cy: y, rx, ry: 18, fill: C.lily }], ['path', { d: `M${x} ${y} L${x + rx * .69} ${y - 10} L${x + rx * .76} ${y + 4} Z`, fill: night ? '#243048' : C.lav }]]);
      return [x, y - 6];
    });
  }
  function grassBG(T) {
    if (artBG(T, 'bg_meadow')) return;
    const { el, paper } = T;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.sky }, T.bg);
    paper(T.bg, [['rect', { x: -200, y: 440, width: 1400, height: 300, fill: '#7c9a58' }]]);
    for (let i = 0; i < 14; i++) {
      const x = -60 + i * 80, h = 240 + (i % 3) * 60;
      paper(T.bg, [['path', { d: `M${x} 560 Q${x + 14} ${560 - h / 2} ${x + 36} ${560 - h} Q${x + 30} ${560 - h / 2} ${x + 40} 560 Z`, fill: i % 2 ? C.leaf : C.pine }]]);
    }
    paper(T.bg, [['circle', { cx: 640, cy: 250, r: 26, fill: '#F6D98A' }], ['rect', { x: 637, y: 270, width: 6, height: 190, fill: C.pine }]]);
    paper(T.bg, [['ellipse', { cx: 300, cy: 300, rx: 12, ry: 10, fill: C.bean || '#A93B32' }], ['circle', { cx: 290, cy: 297, r: 3, fill: C.ink }]]); // 무당벌레
  }
  function chartBG(T) {
    if (artBG(T, 'bg_chart')) return 486; // 기린 키재기 앞 풀밭 윗면
    const { el, paper } = T;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.cream }, T.bg);
    paper(T.bg, [['rect', { x: 200, y: 40, width: 600, height: 440, rx: 12, fill: '#efe0bd' }]]);
    for (let i = 0; i < 9; i++) el('rect', { x: 220, y: 450 - i * 48, width: i % 2 ? 40 : 70, height: 6, fill: C.gold }, T.bg);
    paper(T.bg, [['rect', { x: -200, y: 470, width: 1400, height: 200, fill: '#b98f4a' }]]);
  }

  /* 화면 고정 UI (카메라 영향 없음): 골라요 배지 */
  function badge(T, x, y, drawIcon) {
    const ui = document.getElementById('stage');
    const g = T.el('g', { transform: `translate(${x},${y})` }, ui);
    T.paper(g, [['circle', { r: 70, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    drawIcon(g);
    return g;
  }
  /* 배지 속 그림: 그림이 있으면 그림(크림 원 안 100×100), 없으면 코드 도형 */
  const iconArt = (T, g, k) => ART['icon_' + k] && T.el('image', { href: A(ART['icon_' + k]), x: -50, y: -50, width: 100, height: 100, preserveAspectRatio: 'xMidYMid meet', filter: 'url(#pp)' }, g);
  const ICONS = {
    tail: (T, g) => T.el('path', { d: 'M-30 -40 Q20 -20 0 20 Q-10 40 10 44', stroke: C.bark, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, g) && T.el('ellipse', { cx: 12, cy: 46, rx: 12, ry: 16, fill: C.ink }, g),
    tree: (T, g) => T.el('rect', { x: -8, y: -6, width: 16, height: 50, fill: C.bark }, g) && T.el('circle', { cy: -24, r: 32, fill: C.pine }, g),
    hoof: (T, g) => T.el('path', { d: 'M-34 30 V-10 Q-34 -40 0 -40 Q34 -40 34 -10 V30 H10 V0 H-10 V30 Z', fill: C.ink }, g),
    rock: (T, g) => T.el('path', { d: 'M-44 30 Q-50 -20 -10 -34 Q40 -44 46 0 Q50 30 -44 30 Z', fill: '#8a8a8a' }, g),
    horn: (T, g) => T.el('path', { d: 'M-30 36 Q-40 -30 30 -40 Q-10 -20 -8 36 Z', fill: C.cream, stroke: C.bark, 'stroke-width': 4 }, g),
    branch: (T, g) => T.el('path', { d: 'M0 44 V-10 M0 10 L-30 -30 M0 -4 L28 -36', stroke: C.bark, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, g),
  };

  const moo = T => AudioFX.animal('cow') || (() => { T.tone([150, 105], .9, { type: 'sawtooth', vol: .12 }); T.tone([300, 210], .9, { type: 'triangle', vol: .08 }); })();
  const croak = (T, f = 330) => AudioFX.animal('frog', .7) || (() => { T.tone([f, f * .8], .12, { type: 'square', vol: .12 }); T.tone([f * .9, f * .7], .12, { type: 'square', vol: .1, when: .14 }); })();

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, actor, camTo, camWide, camSnap } = T;

    /* --- 1. 연못의 아침: 아기 개구리 깨우기 --- */
    let pads = pondBG(T);
    let momArt;
    const mom = actor(T.world, pads[2][0], pads[2][1], g => { momArt = drawMom(T, g); }, { scale: 1.2 });
    mom.parts = null;
    const babyS = ART.bg_pond ? .8 : .6; // 그림 연잎이 커서 아기(임시 도형)도 조금 크게
    const babies = [0, 1, 3].map(i => {
      let parts;
      const a = actor(T.world, pads[i === 3 ? 4 : i][0], pads[i === 3 ? 4 : i][1], g => { parts = drawBaby(T, g); }, { scale: babyS });
      a.parts = parts; return a;
    });
    /* 대사 연출: 목소리 주인에게 카메라가 가고 서로 마주 본다. 개구리는 정면 그림이라 돌려세우지 않는다 */
    let oxActor = null, oxArt = null;
    T.director({
      cast: { mom, baby: babies[0], babyb: babies[1], babyc: babies[2], ox: () => oxActor },
      listener: r => (r === 'mom' ? 'baby' : 'mom'),
      noFace: ['mom', 'baby', 'babyb', 'babyc'],
    });
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); }; // 말풍선 없는 소리 대사
    await T.curtain(true);
    await say('연못에 아침이 왔어요. 아기 개구리들이 아직 쿨쿨 자고 있네요.');
    await say('아기 개구리들을 톡 눌러서 깨워 줄까요?');
    for (const [bi, b] of babies.entries()) {
      await T.tap(b.pos, { prompt: '자고 있는 아기 개구리를 톡 눌러 봐요!' });
      b.parts.lids.setAttribute('opacity', 0); b.hop(40); T.pop(b.x, b.y - 80, '개굴!', C.pine); AudioFX.animalNote('frog', [1.19, 1.0, 1.33][bi], .85) || croak(T, 420); // 깨울 때는 개구리 울음 효과음
      await sleep(300);
    }
    await say('엄마 개구리가 말했어요. "얘들아, 멀리 가면 안 된다~"');

    /* --- 2. 풀밭 모험 --- */
    await T.sceneCard('풀밭', () => {
      T.clear(); grassBG(T);
      babies.forEach((b, i) => { T.world.appendChild(b.pos); b.setScale(.9); b.place(120 + i * 70, 500); });
    }, babies[1].pos);
    if (T.portrait()) camSnap(babies[1].x, 280, 1);
    await say('아기 개구리들이 몰래 풀밭으로 나왔어요. 톡톡 눌러서 폴짝폴짝 가 볼까요?');
    await T.mash(T.root.querySelector('#stageWrap'), { count: 5, prompt: '화면을 톡톡 눌러서 폴짝폴짝!',
      onStep: i => { babies.forEach((b, k) => { setTimeout(() => { croak(T, 380 + k * 40); b.move(b.x + 110, 500, 420); b.hop(50, 420); }, k * 90); });
        if (T.portrait()) camTo(babies[1].x + 110, 280, 1, 500); } }); // 세로 화면: 카메라가 아기들을 따라간다 (가로는 그대로)
    await sleep(500);

    /* --- 3. 이건 뭐지? (부분만 보이는 황소 퀴즈) ---
       무대 위 그 황소(같은 그림 ox_stand, 같은 자리)를 동그란 들여다보기 창으로 크게 비춘다 → 세 문제가 모두 한 황소.
       창 밖은 같은 풀밭을 어둡게 덮어 그 부위만 보인다. (예전 따로 뽑은 확대 그림 frog_q_* 는 황소가 저마다 달라 쓰지 않는다) */
    const OX_AT = [520, ART.ox_stand ? 522 : 540];
    let peek = null;
    await T.sceneCard('커다란 무언가', () => {
      T.clear(); grassBG(T);
      actor(T.world, ...OX_AT, g => drawOx(T, g), { scale: 1 });
      peek = oxPeek(T, OX_AT);
      camSnap(500, 280, 1);
    }, babies[1].pos);
    await say('어? 눈앞에 커다란 무언가가 있어요!');
    const quiz = [
      { part: 'tail', q: '이건 뭘까요? 꼬리일까요, 나무일까요?', ok: 'tail', no: 'tree', okName: '꼬리' },
      { part: 'hoof', q: '이번엔 뭘까요? 발굽일까요, 돌멩이일까요?', ok: 'hoof', no: 'rock', okName: '발굽' },
      { part: 'horn', q: '이건 뭘까요? 뿔일까요, 나뭇가지일까요?', ok: 'horn', no: 'branch', okName: '뿔' },
    ];
    for (const [qi, r] of quiz.entries()) {
      await peek.show(r.part, qi > 0);
      const left = Math.random() < .5;
      // 세로 화면은 무대 양옆이 잘리므로, 실제로 보이는 폭 안쪽 끝에 배지를 둔다 (창 아래 줄)
      const vw = T.viewWidth ? T.viewWidth() : 1000, pt = vw < 990;
      const L = pt ? 500 - Math.min(vw / 2 - 75, 115) : 500 - vw / 2 + 85, R = 1000 - L, by = pt ? 462 : 300;
      const bOk = badge(T, left ? L : R, by, g => iconArt(T, g, r.ok) || ICONS[r.ok](T, g));
      const bNo = badge(T, left ? R : L, by, g => iconArt(T, g, r.no) || ICONS[r.no](T, g));
      await say(r.q);
      await T.choose([{ el: bOk, ok: true }, { el: bNo, ok: false }], { prompt: r.q,
        where: '가운데 그림이랑 똑같이 생긴 쪽을 골라 봐요!', who: `${T.josa(r.okName, '이에요/예요')}! 반짝이는 걸 눌러 봐요!` });
      bOk.remove(); bNo.remove();
      await say(`맞아요, ${T.josa(r.okName, '이에요/예요')}!`);
    }
    await peek.hide();
    await camTo(500, 280, 1, 1600);
    T.shake(); moo(T); // 음매~는 황소 효과음으로
    await say('커다란 황소였어요! 아기 개구리들은 깜짝 놀라 도망쳤어요.');

    /* --- 4. 엄마! 괴물이에요! --- */
    await T.sceneCard('연못', () => {
      T.clear(); pads = pondBG(T);
      T.world.appendChild(mom.pos); mom.place(pads[2][0], pads[2][1]);
      babies.forEach((b, i) => { T.world.appendChild(b.pos); b.setScale(babyS); b.place(pads[[0, 1, 4][i]][0], pads[[0, 1, 4][i]][1]); });
    });
    babies.forEach(b => b.hop(30));
    await cutArt(T, [['cut_monster', 'surprise']], 3000); // 그림 컷: 아기들이 본 '괴물' (대사와 겹치면 연출 카메라가 못 돌아온다 → 따로)
    await say('"엄마! 산처럼 커다란 괴물을 봤어요!"');
    await say('엄마 개구리가 말했어요. "흥, 얼마나 컸는데?"');

    /* --- 5. 누가 더 커요? (비교 놀이) --- */
    let floor = 470;
    await T.sceneCard('키재기', () => { T.clear(); floor = chartBG(T) || 470; }, mom.pos);
    await say('누가 더 큰지 키를 재 볼까요?');
    const pairs = [['tadpole', 'frog'], ['frog', 'duck'], ['duck', 'sheep'], ['sheep', 'ox']];
    for (const [small, big] of pairs) {
      // 세로 화면: 둘을 가운데로 모으고, 황소 차례엔 살짝 물러서서(줌아웃) 둘 다 보이게
      const vw = T.viewWidth(), pt = vw < 990;
      const zc = pt && big === 'ox' ? Math.min(1, vw / 680) : 1, d = pt ? Math.min(160, vw / 2 / zc - 95) : 160;
      if (pt) camSnap(500, 280, zc);
      const bigLeft = Math.random() < .5;
      const mk = (k, x) => {
        const s = k === 'ox' ? .62 : 1; // 황소는 무대에 들어오게 줄여서
        const a = actor(T.world, x, floor, g => ANIMALS[k].draw(T, g), { scale: s });
        a.key = k; return a;
      };
      const A = mk(bigLeft ? big : small, 500 - d), B = mk(bigLeft ? small : big, 500 + d);
      const bigA = bigLeft ? A : B, smallA = bigLeft ? B : A;
      await say(`${T.josa(ANIMALS[A.key].name, '이랑/랑')} ${ANIMALS[B.key].name}, 누가 더 커요?`);
      await T.choose([
        { el: bigA.pos, ok: true },
        { el: smallA.pos, ok: false, onWrong: async () => {
          // 틀리면 등을 맞대고 나란히 서서 차이를 보여준다
          const ax = A.x, bx = B.x;
          await Promise.all([A.move(470, floor, 500), B.move(560, floor, 500)]);
          await sleep(900);
          await Promise.all([A.move(ax, floor, 500), B.move(bx, floor, 500)]);
        } },
      ], { prompt: '누가 더 커요? 큰 친구를 눌러 봐요!',
        where: '둘이 나란히 섰어요. 머리가 더 높은 친구는 누구지?', who: `${T.josa(ANIMALS[big].name, '이/가')} 더 커요! 반짝이는 친구를 눌러 봐요!` });
      // 이긴 친구의 소리 (오리는 꽥, 양은 매애 — 개구리 울음이 아니라)
      ({ ox: () => moo(T), frog: () => croak(T, 500), duck: () => AudioFX.animal('duck', .7), sheep: () => AudioFX.animal('sheep', .7) }[big] || (() => {}))();
      await bigA.hop(24);
      await say(`맞아요! ${T.josa(ANIMALS[big].name, '이/가')} 더 커요!`);
      A.pos.remove(); B.pos.remove();
    }
    camSnap(500, 280, 1);

    /* --- 6. 엄마 개구리 부풀리기 --- */
    await T.sceneCard('연못가', () => {
      T.clear(); pondBG(T);
      actor(T.world, 520, 500, g => drawOx(T, g, { dotted: true }), { scale: 1.15 });
      if (ART.bg_pond) padAt(T, 520, 500); // 그림 연못: 엄마는 물 위 연잎에 (연잎 그림이 없으면 임시 도형 연잎)
      T.world.appendChild(mom.pos); mom.place(520, 500);
      const k = squeeze(T);
      const spots = ART.bg_pond ? [PADS.day[0], PADS.day[1], PADS.day[4]] : [150, 230, 860].map(x => [Math.round(500 + (x - 500) * k), 500]);
      babies.forEach((b, i) => { T.world.appendChild(b.pos); b.place(...spots[i]); });
    });
    await say('"흥, 나도 황소만큼 클 수 있어!" 엄마 개구리가 숨을 크게 들이마셨어요.');
    await say('엄마 개구리를 톡톡 눌러서 부풀려 볼까요?');
    const SIZES = [1, 1.35, 1.7, 2.05, 2.4, 2.75, 3.1, 3.4, 3.65];
    const cheer = { 2: '"아직 황소가 더 커요!"', 5: '"와, 양만큼 커졌다! 그래도 황소가 더 커요!"' };
    await T.mash(mom.pos, { count: 8, prompt: '엄마 개구리를 톡톡 눌러 봐요!', onStep: i => {
      T.tone([200 + i * 40, 420 + i * 40], .25, { type: 'sine', vol: .18 });
      mom.body.style.transition = 'transform .35s cubic-bezier(.3,1.6,.5,1)';
      mom.body.style.transform = `scale(${SIZES[i] * 1.08}, ${SIZES[i]})`;
      if (cheer[i]) Narrator.speak(cheer[i]);
      if (i >= 5) momArt.set('puffed'); // 부푼 그림이 있으면 (없으면 기본 그림을 키운 채로)
    } });
    await sleep(500);

    /* --- 7. 부들부들 --- */
    const shiver = mom.body.animate([{ translate: '0 0' }, { translate: '4px 0' }, { translate: '-4px 0' }], { duration: 120, iterations: Infinity });
    babies.forEach(b => b.parts.hands.setAttribute('opacity', 1));
    await say('엄마 개구리가 부들부들 떨려요. 어어… 한 번 더 누르면 어떻게 될까?');
    await Promise.race([T.tap(mom.pos), sleep(8000)]);
    shiver.cancel();

    /* --- 8. 뻥! → 풍선처럼 날아다니다 퐁당 --- */
    vo('cut_pop'); // 컷 속 엄마 개구리 비명 (말풍선 없음)
    await (cutArt(T, [['cut_pop', 'boom'], ['cut_fly', 'whoosh', 2000]]) || T.cut(svg => {
      T.el('circle', { cx: 200, cy: 150, r: 110, fill: C.pine }, svg);
      T.el('ellipse', { cx: 200, cy: 170, rx: 70, ry: 50, fill: C.cream }, svg);
      T.el('text', { x: 200, y: 175, 'text-anchor': 'middle', 'font-size': 90, fill: '#A93B32', stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('뻥!') }, svg);
    }, { sfx: 'boom' }));
    babies.forEach(b => b.parts.hands.setAttribute('opacity', 0));
    momArt.set('flying');
    mom.body.style.transition = 'transform 3s linear';
    mom.body.style.transform = 'scale(1.6)';
    // 세로 화면: 살짝 물러서고, 보이는 폭 안에서만 날아다닌다 (가로는 fz = fk = 1)
    const fz = T.portrait() ? .72 : 1; if (fz < 1) camSnap(500, 280, fz);
    const fk = Math.min(1, (T.viewWidth() / 2 / fz - 150) / 320), FX = x => Math.round(500 + (x - 500) * fk); // 세로 화면: 보이는 폭 안에서만 날아다닌다
    const fly = mom.pos.animate([
      { transform: `translate(${FX(520)}px,500px)` }, { transform: `translate(${FX(760)}px,220px) rotate(40deg)` }, { transform: `translate(${FX(300)}px,160px) rotate(-30deg)` },
      { transform: `translate(${FX(820)}px,380px) rotate(60deg)` }, { transform: `translate(${FX(200)}px,330px) rotate(-50deg)` }, { transform: `translate(${FX(520)}px,200px)` },
    ], { duration: 3600, iterations: Infinity, easing: 'ease-in-out' });
    mom.pos.removeAttribute('transform');
    const whoosh = setInterval(() => T.tone([900, 300], .35, { type: 'sawtooth', vol: .06 }), 500);
    await say('푸슈슈슉~ 엄마 개구리가 풍선처럼 날아다녀요! 톡 눌러서 잡아 줘요!');
    await T.tap(mom.pos, { prompt: '날아다니는 엄마 개구리를 톡!' });
    clearInterval(whoosh); fly.cancel();
    if (fz < 1) camSnap(500, 280, 1);
    mom.body.style.transition = ''; mom.body.style.transform = '';
    mom.place(500, 468); momArt.set('dizzy');
    await (cutArt(T, [['cut_splash', 'splash', 2200]]) || AudioFX.splash());
    T.pop(500, 400, '퐁당!', C.indigo);
    const stars = el('g', { transform: 'translate(500,370)' }, T.fx);
    for (let k = 0; k < 3; k++) el('path', { d: 'M0 -10 L3 -3 10 -3 4 2 6 10 0 5 -6 10 -4 2 -10 -3 -3 -3 Z', fill: '#FFD54F', transform: `rotate(${k * 120}) translate(28 0)` }, stars);
    stars.animate([{ transform: 'translate(500px,370px) rotate(0)' }, { transform: 'translate(500px,370px) rotate(360deg)' }], { duration: 1200, iterations: 3 });
    [0, .15, .3].forEach(w => T.tone([700, 500], .12, { type: 'triangle', vol: .14, when: w }));
    await say('엄마 개구리는 원래 크기로 돌아왔어요. 어지러워도 깔깔깔 웃었답니다.');
    stars.remove();

    /* --- 9. 폴짝 대회 --- */
    await T.sceneCard('폴짝 대회', () => {
      T.clear(); pads = pondBG(T, false, 1); // 경주는 넓게 — 세로 화면은 카메라가 따라간다
      momArt.set('base');
      if (ART.bg_pond) padAt(T, ...START, 70);
      T.world.appendChild(mom.pos); mom.place(...(ART.bg_pond ? START : [120, 480]));
      if (T.portrait()) camSnap(mom.x, 280, 1);
      // 그림 연못: 황소는 오른쪽 앞 얕은 물에 서 있다 (몸을 낮추고 말한다)
      oxActor = actor(T.world, ART.bg_pond ? 850 : 900, ART.bg_pond ? 546 : 520, g => { oxArt = drawOx(T, g, { pose: 'kneel' }); }, { scale: .55 });
    }, mom.pos);
    const ox = oxActor.pos;
    moo(T);
    await say('황소가 몸을 낮추고 다정하게 말했어요. "크지 않아도 괜찮아. 너는 폴짝 뛰기 선수잖아!"');
    let pi = 0;
    await T.mash(mom.pos, { count: 5, prompt: '엄마 개구리를 톡 눌러서 폴짝!', onStep: () => {
      const [x, y] = pads[pi++]; croak(T, 360 + pi * 30);
      mom.pos.animate([{ transform: `translate(${mom.x}px,${mom.y}px) scale(1.2)` }, { transform: `translate(${(mom.x + x) / 2}px,${y - 120}px) scale(1.2)` }, { transform: `translate(${x}px,${y}px) scale(1.2)` }], { duration: 420, easing: 'ease-out' });
      mom.place(x, y); if (T.portrait()) camTo(x, 280, 1, 420);
    } });
    await sleep(500);
    oxArt.set('stand');
    await say('황소도 따라 뛰어 볼까요? 하나, 둘…');
    if (T.portrait()) await camTo(oxActor.x, 280, 1, 700); // 세로 화면: 황소 쪽으로
    oxArt.set('jumpfail');
    await T.anim(ox, [{ translate: '0 0' }, { translate: '0 -14px' }, { translate: '0 0' }], 400);
    AudioFX.thud(); T.shake(); T.pop(oxActor.x, oxActor.y - 190, '쿵!'); vo('ox_thud');
    oxArt.set('stand');
    await say('쿵! 황소는 폴짝 뛰지 못했어요. 누가 더 멀리 뛸까요? 개구리!');
    await cutArt(T, [['cut_jump', 'boing', 3000]]);

    /* --- 10. 밤 연못 합창 --- */
    await T.sceneCard('밤 연못', () => {
      T.clear(); pads = pondBG(T, true); if (T.portrait()) camSnap(500, 280, 1);
      T.world.appendChild(mom.pos); mom.place(pads[2][0], pads[2][1]);
      [0, 1, 3].forEach((p, i) => { const b = babies[i]; T.world.appendChild(b.pos); b.place(pads[p][0], pads[p][1]); });
      const x = actor(T.world, pads[4][0], pads[4][1], g => sprite(T, g, 'uncle', 110, 108) || drawFrog(T, g, { color: '#58805a' }), { scale: 1.05 }); // 삼촌 (엄마보다는 작고 아기들보다 크게) 개구리 그림 (진초록·나비넥타이)
      x.pos.id = 'uncleFrog';
      T.world.__uncle = x;
    }, mom.pos);
    const choir = [babies[0], babies[1], mom, babies[2], T.world.__uncle];
    /* 〈반짝반짝 작은 별〉을 개구리 울음소리로 부른다 (프랑스 전래 곡, 모차르트 변주곡으로 유명 — 작곡가 사후 70년이 지난 공개 곡).
       개굴 녹음은 '미'(E4)로 보고 음 높이만 비례해서 바꾼다. 아기들과 엄마가 번갈아 부르고, 삼촌은 낮은 받침음 */
    const frogs = choir.slice(0, 4), uncle = choir[4];
    const croakNote = (n, d = .4) => { const r = Math.pow(2, (T.semi(n) - 4) / 12); AudioFX.animalNote('frog', r, .75, 0, Math.min(d, .5)) || T.tone(T.hz(n), Math.min(d, .5), { type: 'triangle', vol: .22 }); };
    const bass = () => { AudioFX.animalNote('frog', .55, .6, 0, .6) || T.tone(130, .5, { type: 'triangle', vol: .2 }); uncle.hop(14, 300); };
    const TWINKLE = T.parseSong('C4:1 C4:1 G4:1 G4:1 A4:1 A4:1 G4:2 F4:1 F4:1 E4:1 E4:1 D4:1 D4:1 C4:2');
    const BAR = [0, 7]; // 받침음이 들어가는 음 번호
    const voice = (n, d, i) => { croakNote(n, d); if (BAR.includes(i)) bass(); };
    T.finale();
    await say('밤이 되었어요. 나비넥타이를 맨 삼촌 개구리가 놀러 왔어요. 개구리 가족이 노래를 불러요. 먼저 들어 봐요!');
    await T.playMelody(TWINKLE, { beat: .5, voice, onNote: i => frogs[i % 4].hop(22, 300) });
    await sleep(500);
    await say('이번에는 개구리를 톡톡 눌러서 같이 불러요!');
    await T.followMelody(TWINKLE, { beat: .5, targetFor: i => frogs[i % 4].pos, voice, onNote: i => frogs[i % 4].hop(26, 300), others: [{ el: uncle.pos, onTap: bass }] });
    await sleep(400);
    await say('잘했어요! 이제 마음대로 노래해 봐요!');
    const RATE = [1.0, 1.189, .794, 1.335, .6]; // 자유 놀이: 도·미·솔·라(+삼촌 낮은 소리)에 어울리게
    const sing = i => AudioFX.animalNote('frog', RATE[i], .75, 0, .4) || T.tone(330 * RATE[i], .34, { type: 'triangle', vol: .22 });
    await T.free(choir.map((f, i) => ({ el: f.pos, onTap: () => { sing(i); f.hop(22, 300); } })), 12000);
    /* 끝: 온 가족이 한 번 더 함께 */
    T.playMelody(TWINKLE, { beat: .5, voice, onNote: () => choir.forEach(f => f.hop(18, 300)) });
    await sleep(7200);
    await say('개굴개굴~ 노래가 잦아들고, 개구리 가족은 쿨쿨 잠이 들었답니다.');
    return '개구리는 개구리대로 멋져요!';
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

  Tale.mount({ title: '황소와 개구리', subtitle: '누가 더 클까?', run: T => run(portraitGuard(Tale.api)) });
})();
