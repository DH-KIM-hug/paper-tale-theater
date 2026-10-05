/* 커다란 순무 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §4
   할아버지 혼자서는 안 뽑히는 순무. 할머니 → 손녀 → 강아지 → 고양이 → 생쥐까지 차례로 불러 다 함께 "영차!"
   학습: 순서 기억(6단계) · 크기 서열 · 많을수록 힘이 세다 · 작은 힘도 필요하다.
   웃음 컷: 엉덩방아 · 개와 고양이 째려보기 · "너무 작아" · 쑥! 벌렁 도미노 */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32', bean: '#A93B32',
    indigo: '#1F2A56', persimmon: '#E8703A', amber: '#F2B366', snow: '#F4F6FA', ink: '#2E241C', pink: '#E8A0A0',
    skin: '#EDC9A0', soil: '#8A6440', soilDark: '#6E4E32', spring: '#DCE8C8', summer: '#F2DFA8' };

  /* ================= 페이퍼아트 그림 (assets/v3w/tn_*.webp) =================
     null이거나 파일을 못 불러오면 그 자리는 아래 임시 도형(그레이박스)으로 그린다. 새 그림이 나오면 여기 한 줄만 바꾸면 된다.
     배경은 장면마다 한 장을 무대에 꽉 채워 깐다. 순무 앞 흙(soilFront)은 같은 배경 그림을 아래쪽만 오려 앞에 한 번 더 깐다 → 이음매가 없다. */
  const AS = '../../assets/';
  const BG = {
    garden: 'v3w/tn_bg_garden.webp', lowangle: 'v3w/tn_bg_lowangle.webp', door: 'v3w/tn_bg_door.webp', fence: 'v3w/tn_bg_fence.webp',
    barn: 'v3w/tn_bg_barn.webp', mouse: 'v3w/tn_bg_mouse.webp', feast: 'v3w/tn_bg_feast.webp',
  };
  /* 배우·소품·컷 (인물·동물은 모두 왼쪽을 본다)
     - dog_jump: 원래 오른쪽을 봐서 좌우로 뒤집어 저장 · watering_can: 물방울(코드가 그림)을 지우고 주둥이가 순무 쪽(오른쪽)으로 뒤집음
     - sprout: 밑에 깔린 받침 덩어리를 잘라 내고 잎 + 흰 머리만
     - cow · pig: 고르기 배지의 틀린 답. 토끼와 거북이 관객 그림(rab_aud_*)을 같이 쓴다
     - grandpa_sit: 다시 뽑은 엉덩방아 그림 (발 뻗고 앉음, 기준점 = 엉덩이)
     - cut_pop: 다시 뽑은 쑥! 컷(tn_cut_pop2 — 얼굴 없는 순무 하나가 쑥, 여섯이 벌렁). 영~·차~ 두 컷은 코드 컷(순무는 그림)
     - bush(덤불, 마젠타 키잉) · table(잔치 상) · soup_bowl(국 그릇): 코드 도형을 대신하는 그림. 씨앗 그림(tn_seed)은 연두 덩어리로 나와 안 씀 */
  const ART = {
    turnip: 'v3w/tn_turnip.webp', sprout: 'v3w/tn_sprout.webp', pot: 'v3w/tn_pot.webp', watering_can: 'v3w/tn_watering_can.webp',
    seed: 'v3w/tn_seed3.webp', bush: 'v3w/tn_bush.webp', table: 'v3w/tn_table.webp', soup_bowl: 'v3w/tn_soup_bowl.webp',
    grandpa_stand: 'v3w/tn_grandpa_stand.webp', grandpa_pull: 'v3w/tn_grandpa_pull.webp',
    grandpa_sit: 'v3w/tn_grandpa_sit.webp',
    grandma_stand: 'v3w/tn_grandma_stand.webp', grandma_pull: 'v3w/tn_grandma_pull.webp', girl_pull: 'v3w/tn_girl_pull.webp',
    dog_pull: 'v3w/tn_dog_pull.webp', dog_jump: 'v3w/tn_dog_jump.webp', cat_pull: 'v3w/tn_cat_pull.webp', cat_sit: 'v3w/tn_cat_sit.webp',
    mouse_pull: 'v3w/tn_mouse_pull.webp', cow: 'v3w/rab_aud_cow.webp', pig: 'v3w/rab_aud_pig.webp',
    cut_glare: 'v3w/tn_cut_glare.webp', cut_pop: 'v3w/tn_cut_pop2.webp',
  };
  const artOK = {}, bgOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  function origin(n, x, y) { n.style.transformBox = 'view-box'; n.style.transformOrigin = `${x}px ${y}px`; return n; }
  /* 그림 한 장: (x,y)가 왼쪽 위인 w×h 상자 */
  function pic(T, g, key, x, y, w, h, { shadow = true } = {}) {
    const u = artUrl(key); if (!u) return null;
    const wrap = T.el('g', shadow ? { filter: 'url(#pp)' } : {}, g);
    T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
    return wrap;
  }
  /* 인물 자세 그림: [키(배율 1, 무대 단위), 발끝 가운데 x(폭 비율), 폭/높이]. 발끝 가운데가 (0,0).
     한 인물의 자세끼리는 같은 원본 배율(머리 크기)로 맞춰서 자세가 바뀌어도 튀지 않는다.
     (할아버지 당기기만 머리가 조금 커서 .95배, 고양이 앉기는 머리가 커서 머리 크기에 맞춤) */
  const SPR = {
    grandpa_stand: [190, .58, .5022], grandpa_pull: [161, .62, .8238], grandpa_sit: [151, .66, 1.3028], // 모자 크기를 서기 그림에 맞춤, 엉덩이가 기준
    grandma_stand: [172, .43, .5227], grandma_pull: [146, .56, .8],
    girl_pull: [128, .44, .9118],
    dog_pull: [100, .48, .8781], dog_jump: [87, .5, 1.0833],
    cat_pull: [88, .54, 1.3433], cat_sit: [66, .5, 1.15],
    mouse_pull: [50, .49, 1.0063],
  };
  const LOOKS = { grandpa: ['stand', 'pull', 'sit'], grandma: ['stand', 'pull'], girl: ['pull'], dog: ['pull', 'jump'], cat: ['pull', 'sit'], mouse: ['pull'] };
  /* 배경 그림: 무대 1000×560을 덮고 가장자리를 조금 더 덮는다 (그림 비율 1760:992) */
  const BG_EDGE = { garden: ['#b9d7e4', '#281708'], lowangle: ['#aee3fe', '#2e1a0a'], door: ['#accfde', '#535b3b'], fence: ['#a5c7d5', '#788053'],
    barn: ['#b4d2da', '#54674a'], mouse: ['#acd4e5', '#26170c'], feast: ['#feb07b', '#664116'] };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  function bgImage(T, key) {
    const u = bgUrl(key); if (!u) return null;
    const { x, y, w, h } = BGBOX, [top, bot] = BG_EDGE[key];
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, T.bg);
    T.el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, T.bg);
    return T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, T.bg);
  }
  /* 같은 배경 그림을 y0 아래만 오려 world 맨 위에 깐다 (순무·생쥐가 흙 속에 묻혀 보이게). 아래로 넘친 곳은 바닥 색으로 */
  let clipN = 0;
  function bgFront(T, key, y0, { x0 = -1400, x1 = 2400 } = {}) {
    const u = bgUrl(key); if (!u) return null;
    const id = 'tnclip' + (++clipN), g = T.el('g', {}, T.world);
    const cp = T.el('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, g);
    T.el('rect', { x: x0, y: y0, width: x1 - x0, height: 2000 }, cp);
    const inner = T.el('g', { 'clip-path': `url(#${id})` }, g);
    T.el('rect', { x: -1400, y: BGBOX.y + BGBOX.h - 2, width: 3800, height: 2000, fill: BG_EDGE[key][1] }, inner);
    T.el('image', { href: u, x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, inner);
    return g;
  }

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
  const PULL_DEG = [22, 18, 15, 13, 11, 9];
  const GROUND = 480;
  const POSE = {
    stand: () => 'translate(0px,0px) rotate(0deg) scale(1,1)',
    pull: d => `translate(0px,0px) rotate(${d}deg) scale(1,1)`,
    sit: k => ['dog', 'cat', 'mouse'].includes(k) ? 'translate(0px,0px) rotate(8deg) scale(1.05,.8)' : 'translate(0px,0px) rotate(12deg) scale(1,.72)',
    flop: k => ({ dog: 'translate(0px,-70px) rotate(180deg) scale(1,1)', cat: 'translate(0px,-58px) rotate(180deg) scale(1,1)',
      mouse: 'translate(0px,-34px) rotate(180deg) scale(1,1)' })[k] || 'translate(0px,-30px) rotate(80deg) scale(1,1)',
  };

  /* ================= 순무 ================= */
  /* 순무 그림: 알뿌리 폭 220, 보라 윗선이 y=-36 (임시 도형과 같은 자리) → 흙 높이·뽑히는 높이 계산은 그대로 */
  const TURNIP_W = 220 / (.9316 - .0401), TURNIP_H = TURNIP_W / .4868;
  function drawTurnip(T, g) {
    const { paper, el } = T;
    if (artUrl('turnip')) {
      const leaves = el('g', {}, g); origin(leaves, 0, 40); // 흔들기: 알뿌리 가운데쯤을 축으로 통째로
      pic(T, leaves, 'turnip', -.4858 * TURNIP_W, -36 - .5086 * TURNIP_H, TURNIP_W, TURNIP_H);
      el('rect', { x: -130, y: -250, width: 260, height: 290, fill: '#fff', opacity: 0 }, g);
      return leaves;
    }
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
    if (bgImage(T, 'garden')) { // 그림: 봄빛은 그림 위에 곱하기로 얹는 연두 한 겹(여름이 되며 걷힌다), 해님 반짝은 그림 속 해 위의 빛
      const skyR = el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: '#CFE6B8', opacity: season === 'spring' ? .6 : 0 }, b);
      skyR.style.mixBlendMode = 'multiply'; skyR.style.pointerEvents = 'none'; skyR.style.transition = 'opacity .45s';
      const sun = el('circle', { cx: 105, cy: 48, r: 40, fill: '#FFF1B8', opacity: 0 }, b);
      sun.style.transition = 'r .6s';
      return { skyR, sun, art: true };
    }
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
    const art = bgFront(T, 'garden', y - 2); if (art) return art;
    return T.paper(T.world, [['path', { d: `M-300 ${y - 2} Q205 ${y - 16} 700 ${y - 2} L1300 ${y - 2} V900 H-300 Z`, fill: C.soil }],
      ['rect', { x: -300, y: y + 30, width: 1600, height: 6, fill: C.soilDark, opacity: .5 }]]);
  }
  function lowAngleBG(T) {
    const { paper, el } = T;
    if (bgImage(T, 'lowangle')) return true;
    sky(T, '#CFE0E6');
    el('circle', { cx: 860, cy: 90, r: 40, fill: '#F6D98A' }, T.bg);
    [[200, 120], [620, 70]].forEach(([x, y]) => paper(T.bg, [['ellipse', { cx: x, cy: y, rx: 70, ry: 24, fill: C.snow }], ['ellipse', { cx: x + 40, cy: y - 12, rx: 40, ry: 22, fill: C.snow }]]));
    paper(T.bg, [['rect', { x: -300, y: 500, width: 1600, height: 300, fill: C.soil }]]);
  }
  /* 문 그림: 그림 속 문짝(무대 x 325~405, y 255~409, 손잡이가 왼쪽 → 경첩은 오른쪽)을 같은 그림에서 오려 따로 두고,
     뒤에 어두운 문간을 깐다. 열면 문짝이 오른쪽 경첩 쪽으로 접힌다 */
  const DOOR = { x0: 325, x1: 405, y0: 255, y1: 409 };
  function doorBG(T) {
    const { paper, el } = T, b = T.bg;
    if (bgImage(T, 'door')) {
      el('rect', { x: DOOR.x0, y: DOOR.y0, width: DOOR.x1 - DOOR.x0, height: DOOR.y1 - DOOR.y0, fill: '#2E1F16' }, b);
      const id = 'tnclip' + (++clipN), door = el('g', {}, b);
      const cp = el('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, b);
      el('rect', { x: DOOR.x0, y: DOOR.y0, width: DOOR.x1 - DOOR.x0, height: DOOR.y1 - DOOR.y0 }, cp);
      el('image', { href: bgUrl('door'), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none', 'clip-path': `url(#${id})` }, door);
      door.style.transformBox = 'view-box'; door.style.transformOrigin = `${DOOR.x1}px 0px`; door.style.transition = 'transform .6s';
      return door;
    }
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
    if (bgImage(T, 'fence')) return true;
    sky(T, '#D6E6DA');
    paper(b, [['rect', { x: -300, y: 440, width: 1600, height: 400, fill: C.leaf }]]);
    for (let i = 0; i < 9; i++) paper(b, [['path', { d: `M${-20 + i * 130} 520 V190 L${40 + i * 130} 150 L${100 + i * 130} 190 V520 Z`, fill: i % 2 ? C.cream : '#EADBB8' }]]);
    paper(b, [['rect', { x: -300, y: 250, width: 1600, height: 26, fill: C.bark }], ['rect', { x: -300, y: 410, width: 1600, height: 26, fill: C.bark }]]);
  }
  function barnBG(T) {
    const { paper, el } = T, b = T.bg;
    if (bgImage(T, 'barn')) return true;
    sky(T, '#CFE0E6');
    el('circle', { cx: 150, cy: 90, r: 38, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M40 600 L130 300 L870 300 L960 600 Z', fill: C.bean }]]);
    for (let i = 0; i < 7; i++) el('rect', { x: 120 + i * 120, y: 300, width: 8, height: 300, fill: '#8E2F28' }, b);
    paper(b, [['path', { d: 'M80 310 L500 170 L920 310 L880 330 L500 205 L120 330 Z', fill: C.bark }]]);
    paper(b, [['path', { d: 'M360 600 V430 H640 V600 Z', fill: '#5A2A22' }], ['path', { d: 'M360 430 L640 600 M640 430 L360 600', stroke: C.cream, 'stroke-width': 10 }]]);
  }
  function mouseBG(T) {
    const { paper, el } = T, b = T.bg;
    if (bgImage(T, 'mouse')) return true; // 쥐구멍: 무대 (497,460) 둘레
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
    if (bgImage(T, 'feast')) return true;
    sky(T, '#F2B98A');
    el('circle', { cx: 250, cy: 300, r: 80, fill: C.persimmon, opacity: .8 }, b);
    paper(b, [['path', { d: 'M-300 390 Q200 320 500 360 Q800 320 1300 380 V700 H-300 Z', fill: '#7E8E5A' }]]);
    cabin(T, b, 880, 420, .9);
    paper(b, [['rect', { x: -300, y: 440, width: 1600, height: 400, fill: '#B9A25A' }]]);
  }

  /* 화면 고정 배지 (카메라 영향 없음) */
  const BADGE = { girl: ['girl_pull', .9118], dog: ['dog_pull', .8781], cat: ['cat_sit', 1.15], cow: ['cow', 207 / 320], pig: ['pig', 291 / 320] };
  function badge(T, x, y, r, key, s) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, document.getElementById('stage'));
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    const ak = BADGE[key];
    if (ak && artUrl(ak[0])) { // 그림 배지: 원 안 1.4r 상자에 맞춘다
      const [k, as] = ak, box = r * 1.4, w = as > 1 ? box : box * as, h = as > 1 ? box / as : box;
      pic(T, g, k, -w / 2, -h / 2 + 4, w, h);
      return g;
    }
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

    /* 그림 미리 불러오기: 배우·순무·첫 배경을 기다리고(최대 4초) 나머지는 뒤에서. 못 불러온 그림은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads['bg_' + k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    Object.keys(ART).filter(k => ART[k]).forEach(k => { loads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    await Promise.race([Promise.all([loads.bg_garden, loads.turnip, loads.sprout, ...Object.keys(SPR).map(k => loads[k])].filter(Boolean)), sleep(4000)]);

    /* 배우: 안쪽 '자세' 층을 따로 두어 기울기·벌렁을 hop과 겹치지 않게 한다.
       그림이 있으면 자세 그림(서기·당기기·앉기·뛰기)을 겹쳐 두고 look()으로 하나만 보인다. 기울기·찌그러짐은 그대로 코드가 한다 */
    const cast = {};
    CAST.forEach(c => {
      let lean;
      const looks = {};
      const a = actor(T.world, -300, GROUND, g => {
        lean = el('g', {}, g);
        lean.style.transformBox = 'view-box'; lean.style.transformOrigin = '0 0'; lean.style.transition = 'transform .28s ease-out';
        LOOKS[c.key].forEach(l => {
          const k = c.key + '_' + l; if (!artUrl(k)) return;
          const [h, fx, as] = SPR[k], w = h * as;
          looks[l] = pic(T, lean, k, -w * fx, -h, w, h);
          looks[l].style.display = 'none';
        });
        if (!Object.keys(looks).length) DRAW[c.key](T, lean);
      });
      const home = looks.stand ? 'stand' : looks.pull ? 'pull' : null;
      Object.assign(a, c, { lean, art: !!home, home });
      a.pose = tf => { a.lean.style.transform = tf; };
      a.look = l => {
        if (!a.art) return;
        const want = looks[l] ? l : home;
        Object.entries(looks).forEach(([n, p]) => { p.style.display = n === want ? '' : 'none'; });
        a.cur = want; a.h = SPR[c.key + '_' + want][0];
      };
      /* 털썩 앉기: 앉은 그림이 있으면 그 그림(할아버지·고양이), 없으면 지금 그림을 코드로 눌러 앉힌다 */
      a.sitDown = () => { a.before = a.cur; if (looks.sit) { a.look('sit'); a.pose(POSE.stand()); } else a.pose(POSE.sit(c.key)); };
      a.standUp = () => { if (a.cur === 'sit') a.look(a.before); a.pose(POSE.stand()); };
      a.look(home);
      a.pose(POSE.stand());
      cast[c.key] = a;
    });
    const line = CAST.map(c => cast[c.key]);
    const put = (a, x, y = GROUND, s = 1, look) => { T.world.appendChild(a.pos); a.face('left'); a.setScale(s); a.place(x, y); a.look(look || a.home); a.pose(POSE.stand()); a.body.style.transform = ''; };
    /* 대사 연출: 목소리 주인에게 카메라가 가고 화자·청자가 마주 본다 (그림은 모두 왼쪽을 본다 → face('left') = 원래 방향) */
    const onStage = k => cast[k].pos.isConnected && cast[k].x > -40;
    const HEAR = { grandpa: 'grandma', grandma: 'grandpa', girl: 'grandma', dog: 'girl', cat: 'dog', mouse: 'cat' };
    T.director({
      cast,
      listener: (r, last) => r === 'grandma' && onStage('girl') ? 'girl' : r === 'cat' && onStage('mouse') ? 'mouse'
        : onStage(HEAR[r]) ? HEAR[r] : (last !== r ? last : null),
    });
    const voiceLine = (k, delay = 0) => typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k] && setTimeout(() => AudioFX.voice(VOICE_LINES[k]), delay);

    let turnip, leaves, rise = 0;
    turnip = actor(T.world, 0, 0, g => { leaves = drawTurnip(T, g); });
    turnip.pos.id = 'turnip';
    /* 새싹 그림: 순무 배우 안에 겹쳐 두고 무럭무럭 앞부분에만 보인다 (폭 260, 흰 머리 밑이 흙선 조금 아래) */
    const sprout = pic(T, turnip.body, 'sprout', -130, 8 - 260 / (320 / 239), 260, 260 / (320 / 239));
    const showSprout = on => { if (!sprout) return; sprout.style.display = on ? '' : 'none'; leaves.style.display = on ? 'none' : ''; };
    showSprout(false);
    const putTurnip = (x, y, s) => { T.world.appendChild(turnip.pos); turnip.setScale(s); turnip.place(x, y); turnip.body.style.transform = ''; };
    const wobble = () => leaves.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0deg)' }], { duration: 420 });

    /* 옆 모습 텃밭: 순무 + 흙 + 앞에서 n명 */
    const TX = 205;
    function sideView(n) {
      T.clear(); gardenBG(T);
      putTurnip(TX, GROUND - rise, 1);
      soilFront(T);
      for (let i = 0; i < n; i++) { put(line[i], LINE_X[i], GROUND, 1, 'pull'); line[i].pose(POSE.pull(4)); }
      if (T.portrait()) { // 세로 화면(양옆이 잘림): 순무부터 줄 끝까지 보이게 옮기고, 넘치면 살짝 물러선다
        const x0 = TX - 150, x1 = (n ? LINE_X[n - 1] : TX) + 60, half = (x1 - x0) / 2 + 12;
        camSnap((x0 + x1) / 2, 280, Math.min(1, T.viewWidth() / 2 / half));
      } else camSnap(500, 280, 1);
    }
    /* 당기기 한 판: 톡톡톡 ×5, 끝나면 순무가 한 뼘 올라온다 */
    async function pullRound(n, gain, prompt) {
      await T.mash(turnip.pos, { count: 5, prompt, onStep: i => {
        chorus(T, n);
        for (let k = 0; k < n; k++) { const a = line[k]; setTimeout(() => { a.pose(POSE.pull(PULL_DEG[k])); setTimeout(() => a.pose(POSE.pull(4)), 260); }, k * 70); } // 앞사람일수록 더 젖히고, 쉬는 동안에도 뒤로 기대어 붙잡고 있는다
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
      T.fitRow([bOk, bNo]); // 세로 화면: 보이는 폭 안으로
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
    if (!pic(T, seed, 'seed', -21, -28, 42, 56)) T.paper(seed, [['ellipse', { cx: 0, cy: 0, rx: 19, ry: 25, fill: C.bark }], ['ellipse', { cx: -6, cy: -8, rx: 6, ry: 9, fill: '#9C7550' }]]); // 첫 탭 목표라 눈에 띄게 크게
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
      putTurnip(430, GROUND, .3); showSprout(true);
      soilFront(T);
      T.world.appendChild(cast.grandpa.pos);
      camSnap(500, 280, 1);
    }, cast.grandpa.pos);
    await say('파란 싹이 났어요! 톡톡 눌러서 물도 주고 햇볕도 줘요.');
    const can = el('g', { opacity: 0 }, T.fx);
    const canArt = pic(T, can, 'watering_can', -60, -50, 130, 130 / 1.5094); // 주둥이 끝 ≈ (62,-46)
    if (!canArt) T.paper(can, [['rect', { x: -34, y: -24, width: 60, height: 44, rx: 8, fill: C.pine }], ['path', { d: 'M24 -10 L64 -34 L68 -26 L28 0 Z', fill: C.pine }], ['path', { d: 'M-34 -14 Q-60 -4 -34 12', stroke: C.pine, 'stroke-width': 7, fill: 'none' }]]);
    const mix = (a, b, k) => '#' + [0, 2, 4].map(o => Math.round(parseInt(a.substr(1 + o, 2), 16) * (1 - k) + parseInt(b.substr(1 + o, 2), 16) * k).toString(16).padStart(2, '0')).join('');
    await T.mash(turnip.pos, { count: 6, prompt: '순무 싹을 톡톡 눌러 봐요!', onStep: i => {
      const s = .3 + i * (.7 / 6);
      turnip.body.style.transition = 'transform .45s cubic-bezier(.3,1.6,.5,1)';
      turnip.body.style.transform = `scale(${s / .3})`;
      if (bgp.art) bgp.skyR.setAttribute('opacity', (.6 * (1 - i / 6)).toFixed(2)); else bgp.skyR.style.fill = mix(C.spring, C.summer, i / 6);
      if (i === 3 && sprout) { showSprout(false); AudioFX.sfx('pop'); T.pop(430, 300, '쑥쑥!', C.pine); } // 싹 → 순무 잎
      if (i % 2) {
        can.setAttribute('transform', 'translate(330,230) rotate(28)');
        can.animate([{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 900 });
        for (let d = 0; d < 5; d++) {
          const dr = el('ellipse', { cx: (canArt ? 400 : 395) + d * 9, cy: canArt ? 240 : 290, rx: 4, ry: 7, fill: '#6FA8C8' }, T.fx);
          dr.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(150px)', opacity: 0 }], { duration: 600, delay: d * 70 }).finished.then(() => dr.remove());
        }
        AudioFX.sfx('splash', .4) || AudioFX.splash();
      } else {
        if (bgp.art) {
          bgp.sun.setAttribute('r', 40 + i * 5);
          bgp.sun.animate([{ opacity: 0 }, { opacity: .8 }, { opacity: .35 }], { duration: 700, fill: 'forwards' });
        } else {
          bgp.sun.setAttribute('r', 44 + i * 6);
          bgp.sun.animate([{ opacity: 1 }, { opacity: .6 }, { opacity: 1 }], { duration: 500 });
        }
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
      if (!bgFront(T, 'lowangle', 506)) T.paper(T.world, [['rect', { x: -300, y: 498, width: 1600, height: 300, fill: C.soil }]]);
      put(cast.grandpa, 600, 500, .7, 'pull'); // 순무 잎을 꽉 잡은 그림
    }, cast.grandpa.pos);
    await say('할아버지가 순무 잎을 꽉 잡았어요. 톡톡 눌러서 영차!');
    await T.mash(cast.grandpa.pos, { count: 5, prompt: '할아버지를 톡톡 눌러서 영차 영차!', onStep: i => {
      chorus(T, 1); wobble();
      cast.grandpa.pose(POSE.pull(18)); setTimeout(() => cast.grandpa.pose(POSE.stand()), 260);
      T.pop(i % 2 ? 700 : 560, 300, '영차!', C.bean);
    } });
    await sleep(300);
    await say('순무는 꿈쩍도 안 해요.');
    cast.grandpa.sitDown();
    await cast.grandpa.move(680, 500, 350, 'ease-out');
    await T.fitTo([cast.grandpa.pos], { dur: 300 }); // 세로 화면: 엉덩방아 찧은 할아버지가 화면 밖으로 나가지 않게
    thud(T); T.shake(); T.pop(cast.grandpa.x - 90, 340, '쿵!'); // 머리 왼쪽 위 (오른쪽은 세로 화면에서 잘린다)
    const st1 = stars(T, 680, 395); // (킥킥 기계음은 뺐다: 할아버지 "아이코!"와 겹침)
    await say('아이코! 할아버지가 엉덩방아를 찧었어요.');
    st1.remove();

    /* --- 4. 할머니~! (오두막 문 앞 → 텃밭) --- */
    let door;
    // 세로 화면(보이는 폭 ≈260): 문(x 325~405)과 할아버지가 함께 보이게 할아버지를 가까이 두고 살짝 물러선다
    const pt4 = T.portrait(), GPX = pt4 ? 600 : 720, GMX = pt4 ? 490 : 560;
    await T.sceneCard('할머니~!', () => {
      T.clear(); door = doorBG(T);
      put(cast.grandpa, GPX, GROUND, 1.05, 'stand');
      if (pt4) camSnap(480, 280, .72); else camSnap(500, 280, 1);
    }, cast.grandpa.pos);
    await say('혼자서는 안 되겠어요. 할아버지를 톡 눌러서 할머니를 불러요!');
    await T.tap(cast.grandpa.pos, { prompt: '할아버지를 톡! 할머니를 불러요.' });
    cast.grandpa.hop(20);
    T.pop(620, 230, '할머니~!', C.bean); voiceLine('call_grandma');
    await sleep(600);
    AudioFX.sfx('door');
    door.style.transform = 'scaleX(.15)';
    if (bgOK.door !== false && BG.door) {
      // 그림: 문간(발끝 y=409)에 문보다 조금 작게 나타나서, 앞마당으로 달려 나오며 커진다
      put(cast.grandma, (DOOR.x0 + DOOR.x1) / 2, DOOR.y1, .82, 'stand');
      cast.grandma.face('right');
      await sleep(400);
      const g = cast.grandma, from = `translate(${g.x}px,${g.y}px) scale(${-.82},.82)`, to = `translate(${GMX}px,${GROUND}px) scale(-1.05,1.05)`;
      g.pos.removeAttribute('transform');
      await T.anim(g.pos, [{ transform: from }, { transform: to }], { duration: 900, easing: 'ease-in-out' });
      g.pos.style.transform = ''; g.scale = 1.05; g.place(GMX, GROUND);
    } else {
      put(cast.grandma, 330, GROUND, 1.05);
      T.world.insertBefore(cast.grandma.pos, T.world.firstChild);
      await sleep(400);
      await cast.grandma.move(GMX, GROUND, 900);
    }
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
      put(cast.dog, 520, 510, 1.8, 'jump');
      if (artUrl('bush')) pic(T, T.world, 'bush', 310, 345, 480, 480 * 414 / 700); // 덤불 그림(세이지 세 겹): 강아지 머리까지 다 가린다
      else if (bgOK.fence !== false && BG.fence) { // 그림 배경: 덤불도 배경 그림의 세이지 초록 세 겹으로 오린 종이처럼 (뒤 진하게 → 앞 연하게)
        const bushG = T.el('g', {}, T.world);
        T.paper(bushG, [[ 'circle', { cx: 430, cy: 470, r: 92, fill: '#4F6B4C' }], ['circle', { cx: 560, cy: 440, r: 112, fill: '#4F6B4C' }], ['circle', { cx: 680, cy: 478, r: 84, fill: '#4F6B4C' }], ['rect', { x: 338, y: 470, width: 430, height: 160, fill: '#4F6B4C' }]]);
        T.paper(bushG, [['circle', { cx: 400, cy: 510, r: 70, fill: '#6D8A62' }], ['circle', { cx: 500, cy: 486, r: 84, fill: '#6D8A62' }], ['circle', { cx: 620, cy: 492, r: 82, fill: '#6D8A62' }], ['circle', { cx: 715, cy: 520, r: 60, fill: '#6D8A62' }], ['rect', { x: 330, y: 520, width: 445, height: 110, fill: '#6D8A62' }]]);
        T.paper(bushG, [['circle', { cx: 450, cy: 545, r: 52, fill: '#93AB80' }], ['circle', { cx: 548, cy: 530, r: 60, fill: '#93AB80' }], ['circle', { cx: 650, cy: 546, r: 54, fill: '#93AB80' }], ['rect', { x: 398, y: 545, width: 305, height: 90, fill: '#93AB80' }]]);
      } else T.paper(T.world, [['circle', { cx: 440, cy: 470, r: 90, fill: C.pine }], ['circle', { cx: 560, cy: 450, r: 110, fill: C.leaf }], ['circle', { cx: 670, cy: 480, r: 80, fill: C.pine }], ['rect', { x: 300, y: 500, width: 480, height: 80, fill: C.leaf }]]);
      camSnap(500, 280, T.portrait() ? .85 : 1); // 세로 화면: 뛰어나온 강아지가 보이게 살짝 물러선다
    });
    const bush = T.world.lastChild;
    const rustle = () => bush.animate([{ translate: '0 0' }, { translate: '-6px 0' }, { translate: '6px 0' }, { translate: '0 0' }], { duration: 400, iterations: 2 });
    rustle(); bark(T);
    const q6 = '덤불 뒤에서 멍멍! 누구일까요?';
    await say(q6);
    await callChoice('dog', 'cat', { q: q6, okSound: () => bark(T), noSound: () => { meow(T); setTimeout(() => { rustle(); bark(T); }, 900); },
      where: '멍멍 하고 우는 친구는 누굴까? 다시 들어 봐요.', who: '강아지예요! 반짝이는 친구를 눌러 봐요!' });
    T.world.appendChild(cast.dog.pos);
    if (cast.dog.art) cast.dog.face('right'); // 오른쪽으로 뛰어나온다 (세로 화면은 보이는 폭 안에 내려앉게 가까이)
    await cast.dog.move(T.portrait() ? 600 : 680, 300, 400, 'ease-out');
    await cast.dog.move(T.portrait() ? 560 : 840, 540, 400, 'ease-in');
    cast.dog.hop(30);
    await say('강아지가 뛰어나왔어요. "나도 도울게요!"');
    await T.sceneCard(null, () => sideView(4), cast.dog.pos);
    T.pop(560, 330, '꼭!', C.bean);
    await say('강아지가 손녀 치마를 꼭 붙잡았어요. 영차!');
    await pullRound(4, 12, '순무를 톡톡 눌러서 영차!');

    /* --- 7. 야옹! (헛간 지붕 로우앵글) --- */
    await T.sceneCard('야옹!', () => {
      T.clear(); barnBG(T);
      if (bgOK.barn !== false && BG.barn) put(cast.cat, 775, 152, 1.5, 'sit'); // 그림: 헛간 오른쪽 지붕 끝, 환기탑 오른쪽
      else put(cast.cat, 700, 242, 1.9);
      cast.cat.lean.style.filter = 'brightness(.15)';
      camSnap(T.portrait() ? 700 : 500, 280, 1); // 세로 화면(보이는 폭 ≈260): 지붕 끝(x≈775) 고양이가 다 보이게 오른쪽으로
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
    const glare = artUrl('cut_glare') && T.cutImage([{ src: artUrl('cut_glare'), hold: 2200 }], { hold: 2200, onShow: () => voiceLine('cut_glare', 300) });
    await (glare || T.cut(svg => {
      const dogG = T.el('g', { transform: 'translate(70,262) scale(-2.3,2.3)' }, svg); DRAW.dog(T, dogG);
      const catG = T.el('g', { transform: 'translate(350,262) scale(2.5)' }, svg); DRAW.cat(T, catG);
      T.el('path', { d: 'M226 96 L212 116 L230 124 L214 146 L232 154 L218 176', stroke: '#FFD54F', 'stroke-width': 7, fill: 'none', 'stroke-linejoin': 'round' }, svg);
      T.el('text', { x: 200, y: 60, 'text-anchor': 'middle', 'font-size': 56, fill: C.bean, stroke: '#fff', 'stroke-width': 8, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '째릿!' }, svg);
      voiceLine('cut_glare', 300);
    }, { hold: 2200 }));
    await say('"흥!" 그래도 고양이가 강아지 꼬리를 꼭 잡았어요.');
    await pullRound(5, 10, '순무를 톡톡 눌러서 영차!');

    /* --- 8. 아주 작은 생쥐 (생쥐 눈높이) --- */
    for (let k = 0; k < 5; k++) line[k].sitDown();
    await say('휴우, 모두 지쳐서 털썩 주저앉았어요.');
    await T.sceneCard('아주 작은 생쥐', () => {
      T.clear(); mouseBG(T);
      if (bgOK.mouse !== false && BG.mouse) { put(cast.mouse, 497, 500, 2.6); bgFront(T, 'mouse', 466); } // 쥐구멍에서 머리만 빼꼼
      else {
        put(cast.mouse, 520, 540, 3);
        T.paper(T.world, [['path', { d: 'M380 482 Q520 468 660 482 L700 600 L340 600 Z', fill: C.soil }]]);
      }
      camSnap(500, 280, 1);
    });
    squeak(T);
    await say('흙구멍에서 찍찍 소리가 나요. 톡 눌러 봐요!');
    await T.tap(cast.mouse.pos, { prompt: '흙구멍의 생쥐를 톡!' });
    squeak(T);
    T.world.appendChild(cast.mouse.pos);
    await cast.mouse.move(560, 360, 300, 'ease-out');
    await cast.mouse.move(640, 520, 300, 'ease-in');
    T.pop(640, 300, '찍찍!', C.bark); voiceLine('squeak_mouse');
    await say('아주 작은 생쥐가 쪼르르 나왔어요.');
    await T.sceneCard(null, () => { sideView(5); for (let k = 0; k < 5; k++) line[k].sitDown(); }, cast.cat.pos);
    put(cast.mouse, 1060);
    await cast.mouse.move(LINE_X[5], GROUND, 700);
    await say('"너무 작아서 안 될 거야~"');
    giggle(T);
    for (let k = 0; k < 5; k++) setTimeout(() => line[k].hop(16, 300), k * 90);
    T.pop(440, 220, '하하하!', C.persimmon);
    await sleep(800);
    cast.mouse.hop(40);
    await say('"나도 할래요!" 생쥐가 고양이 꼬리를 꼭 잡았어요.');
    for (let k = 0; k < 5; k++) line[k].standUp();
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
      T.el('text', { x: 200, y: 64, 'text-anchor': 'middle', 'font-size': 64, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: word }, svg);
    };
    voiceLine('cut_heave', 150);
    await T.cut(svg => cutTurnip(svg, 230, .6, '영~'), { hold: 1100 });
    await T.cut(svg => cutTurnip(svg, 190, .6, '차~'), { hold: 1100 });
    // 쑥! 은 그림 컷(얼굴 없는 순무가 흙을 튀기며 쑥, 여섯이 벌렁) — 없으면 코드 컷
    await ((artUrl('cut_pop') && T.cutImage([{ src: artUrl('cut_pop'), sfx: 'pow', hold: 2000 }], { hold: 2000 })) || T.cut(svg => cutTurnip(svg, 140, .6, '쑥!'), { hold: 1500, sfx: 'pow' }));
    /* 순무가 날아가고, 생쥐부터 할아버지까지 벌렁 도미노. 세로 화면(보이는 폭 ≈520)에선 줄 바로 왼쪽에 떨어진다 */
    const landX = T.portrait() ? 290 : 60;
    T.world.appendChild(turnip.pos);
    turnip.pos.removeAttribute('transform');
    turnip.pos.animate([
      { transform: `translate(${TX}px,${GROUND - rise - 22}px) rotate(0deg)` },
      { transform: `translate(${landX + 50}px,150px) rotate(-40deg)` },
      { transform: `translate(${landX}px,372px) rotate(-80deg)` },
    ], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
    for (let k = 5; k >= 0; k--) {
      const a = line[k];
      a.pose(POSE.flop(a.key));
      AudioFX.sfx('bonk', .5) || T.tone([300 - k * 20, 120], .2, { type: 'triangle', vol: .15 });
      await sleep(200);
    }
    await sleep(300);
    thud(T); T.shake();
    T.pop(520, 260, '벌렁!', C.persimmon); voiceLine('flop');
    await sleep(900);
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
      // 잔치 상: 그림(낮은 상, 520×162)이면 윗판이 솥 밑(y≈402)에 오게, 없으면 판+다리 도형
      if (!pic(T, T.world, 'table', 365, 398, 270, 270 * 162 / 520)) T.paper(T.world, [['rect', { x: 390, y: 400, width: 220, height: 20, rx: 6, fill: C.bark }], ['rect', { x: 410, y: 420, width: 16, height: 90, fill: C.bark }], ['rect', { x: 574, y: 420, width: 16, height: 90, fill: C.bark }]]);
      pot = artUrl('pot') ? el('g', {}, T.world) : T.paper(T.world, [['path', { d: 'M446 350 H554 Q556 400 500 402 Q444 400 446 350 Z', fill: C.ink }], ['rect', { x: 438, y: 342, width: 124, height: 12, rx: 6, fill: '#4a3a30' }], ['ellipse', { cx: 500, cy: 344, rx: 50, ry: 8, fill: C.snow }]]);
      pic(T, pot, 'pot', 425, 402 - 150 / 1.2526, 150, 150 / 1.2526); // 그림: 순무국 솥 (김은 그림 + 코드)
      el('rect', { x: 420, y: 300, width: 160, height: 110, fill: '#fff', opacity: 0 }, pot);
      // 세로 화면: 자리를 가운데로 조금 모으고, 살짝 물러서서 여섯 명이 다 보이게 (가로는 그대로)
      const fk = T.portrait() ? .78 : 1, fz = T.portrait() ? Math.min(1, T.viewWidth() / 2 / (390 * fk + 75)) : 1;
      seats.forEach((a, i) => { put(a, Math.round(500 + (FX[i] - 500) * fk), 510, SEAT_S[a.key], a.key === 'cat' ? 'sit' : null); if (i < 3) a.face('right'); });
      camSnap(500, 280, fz);
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
      el('text', { x: good.x, y: 510 - good.h * good.scale - 25, 'text-anchor': 'middle', 'font-size': 26, fill: C.bean, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: k + 1 }, tag);
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
      const bowl = T.el('g', {}, T.world);
      if (!pic(T, bowl, 'soup_bowl', -27, -18, 54, 54 * 119 / 200)) T.paper(bowl, [['path', { d: 'M-22 -8 H22 Q20 14 0 15 Q-20 14 -22 -8 Z', fill: C.snow }], ['ellipse', { cx: 0, cy: -8, rx: 22, ry: 5, fill: C.amber }]]);
      const ty = 510 - a.h * a.scale * .55;
      bowl.animate([{ transform: 'translate(500px,330px)' }, { transform: `translate(${(500 + a.x) / 2}px,200px)` }, { transform: `translate(${a.x}px,${ty}px)` }], { duration: 600, easing: 'ease-in-out', fill: 'forwards' });
      dots[i - 1].setAttribute('fill', C.persimmon);
      T.tone(523 + i * 40, .2, { type: 'triangle', vol: .16 });
      setTimeout(() => { a.hop(20, 300); T.pop(a.x, 510 - a.h * a.scale - 90, NUM[i - 1], C.pine); }, 600); // 머리 위 (얼굴을 가리지 않게)
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

  Tale.mount({ title: '커다란 순무', subtitle: '다 함께 영차!', run: T => run(portraitGuard(Tale.api)) });
})();
