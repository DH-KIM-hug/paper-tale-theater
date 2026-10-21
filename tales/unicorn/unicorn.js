/* 유니콘을 찾아서 — 창작 동화. 기획: tales/unicorn/PLAN.md (2026-10-22), 그림 작업표: tools/app/gen/jobs_unicorn.json
   조작 4번: 1장 색 찾기(고르기 1회) · 2장 구름 톡 · 4장 가시 세기(톡 1회 → 목소리만 하나·둘·셋) · 10장 유니콘 인사 톡. 연타 없음, 줄거리 선택 없음. 교훈 대사 없음(끝 글자만).
   시선(PLAN 장면표): 1 아이→구름(앞모습 위 보기) · 2 양→아이 · 3 아이→양 · 4 사슴→아이 · 5 아이→사슴 뿔 · 6 말→간식 · 7 말→아이 · 8 아이→땅(왼쪽으로 걸음) · 9 아이 뒤돌아봄(유니콘 뒷모습) · 10 유니콘→아이(정면).
   그림이 보는 쪽(NAT): 양·사슴·말·유니콘(서기)은 왼쪽, 아이 걷기·슬픔·지침은 오른쪽, 아이 서기·안기는 앞모습, 아이 돌아봄은 뒷모습(고개를 오른쪽 어깨 너머로), 유니콘 뒷모습은 오른쪽 위로 걸어가는 뒷모습.
   그래서 아이는 왼쪽, 동물은 오른쪽에 두고 서로 마주 본다. 도망·이동하는 인물은 가는 쪽을 본다(뒤집기).
   시안(목업) 모드: 그림 파일이 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다. 파일(assets/v3w/uc_*.webp)이 생기면 코드를 고치지 않아도 그림으로 바뀐다
   (ASP 는 preload 가 실제 비율로 덮어쓴다; HT 는 같은 부위 폭으로 다시 잰다 — 아래 '그림 도착 뒤 맞출 것').
   세로(390x844): 보이는 폭이 약 260 이라 장면 전체를 PS 배로 줄여(원근) 한 화면에 담는다. 월드와 효과 층에 같은 변환을 건다(setView).
   그림 도착 뒤 맞출 것: ① HT(자세별 같은 머리·몸 폭) ② 사슴 가시 자리 THORN(다리 위 좌표) ③ 사슴·말 입·간식 자리 ④ 아이 손과 양 손 높이(3장 손잡기) ⑤ 바닥 FL(배경 바닥선) ⑥ 힌트 위치 ⑦ NAT(실제 보는 쪽) */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = {
    uc_kid_stand: 0.6017, uc_unicorn_stand: 1.0233, uc_sheep_cry: 1.0883, uc_deer_hurt: 1.1233,
    uc_horse_hungry: 1.3617, uc_prop_block_red: 1.0233, uc_prop_cloud: 2.2785, uc_prop_thorn: 0.4233,
    uc_prop_thorn_bush: 1.355, uc_prop_waterfall: 0.5067, uc_prop_rainbow: 1.7274, uc_prop_basket: 1.0367,
    uc_prop_horn_bands: 5.0, uc_kid_walk: 0.6067, uc_kid_sad: 0.5817, uc_kid_tired: 0.585,
    uc_kid_turn: 0.5717, uc_kid_hug: 0.66, uc_unicorn_back: 0.75, uc_hint_tail: 0.79,
    uc_hint_silhouette: 1.0083, uc_hint_tree_gap: 0.1883, uc_hint_spray_eye: 1.1167, uc_hint_horn_tip: 0.365,
    uc_sheep_jump: 1.2683, uc_sheep_happy: 1.09, uc_deer_relief: 0.7933, uc_horse_happy: 1.2433,
    uc_prop_block_yellow: 1.0233, uc_prop_block_blue: 1.015,
  };
  /* 높이(px, scale 1). 인물·동물은 같은 부위 폭으로 맞춘다: 아이 머리 폭 기준 / 양·사슴·말·유니콘 몸통 폭 기준.
     기획 비율: 유니콘 = 말 = 조랑말(아이 어깨 높이 이상, 서면 뿔까지 아이의 1.2배), 양은 유니콘 키의 절반(등이 아이 허리), 사슴은 유니콘과 비슷한 크기.
     그림이 오면 자세마다 같은 부위 폭을 재서 다시 맞춘다 (지금은 자리표시용 값) */
  const HT = {
    uc_kid_stand: 230, uc_kid_walk: 239, uc_kid_sad: 234, uc_kid_tired: 237, uc_kid_turn: 241, uc_kid_hug: 230,   /* 모자 챙 폭을 서기와 같게 잰 값(2026-10-22) */
    uc_unicorn_stand: 270, uc_unicorn_back: 272, uc_horse_hungry: 212, uc_horse_happy: 233,                       /* 말은 유니콘과 몸길이 같게(폭 286 : 277) */
    uc_sheep_cry: 148, uc_sheep_jump: 125, uc_sheep_happy: 148,                                                    /* 같은 털뭉치 폭, 서면 등이 아이 허리 */
    uc_deer_hurt: 221, uc_deer_relief: 250,
    uc_prop_block_red: 56, uc_prop_block_yellow: 56, uc_prop_block_blue: 56, uc_prop_cloud: 120, uc_prop_thorn: 54, uc_prop_thorn_bush: 100,
    uc_prop_waterfall: 300, uc_prop_rainbow: 200, uc_prop_basket: 66, uc_prop_horn_bands: 40,
    uc_hint_tail: 90, uc_hint_silhouette: 150, uc_hint_tree_gap: 260, uc_hint_spray_eye: 70, uc_hint_horn_tip: 110,
  };
  /* 그림이 보는 쪽 (PLAN §5-1 표; 실제 그림을 눈으로 본 뒤 고친다) */
  const NAT = {
    uc_kid_walk: 'right', uc_kid_sad: 'right', uc_kid_tired: 'right', uc_kid_turn: 'right', uc_kid_stand: 'front', uc_kid_hug: 'front',
    uc_unicorn_stand: 'left', uc_unicorn_back: 'right', uc_sheep_cry: 'left', uc_sheep_jump: 'left', uc_sheep_happy: 'left',
    uc_deer_hurt: 'left', uc_deer_relief: 'left', uc_horse_hungry: 'left', uc_horse_happy: 'left', uc_hint_silhouette: 'left',
  };
  const FL = 490;                       // 바닥(발끝 y)
  const BGS = ['uc_bg_hill', 'uc_bg_cloudland', 'uc_bg_night_forest', 'uc_bg_waterfall', 'uc_bg_dusk_road', 'uc_bg_moon_night'];
  const CUTS = ['uc_cut_sheep_jump', 'uc_cut_thorns', 'uc_cut_turn', 'uc_cut_hug'];
  const src = k => AS + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  const artOK = {}, bgOK = {};          // preload 결과(그림이 실제로 있는지) — 없으면 자리표시
  const CREAM = '#F6ECD8', INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";
  const RAIN = ['#A93B32', '#E8703A', '#D9A94E', '#3F6B4F', '#3E7CB1', '#1F2A56', '#7B4F8C'];

  /* ================= 자리표시(그림이 없을 때) ================= */
  const NAMES = {
    uc_kid_stand: '아이 서기', uc_kid_walk: '아이 걷기', uc_kid_sad: '아이 아쉬움', uc_kid_tired: '아이 지침', uc_kid_turn: '아이 돌아봄', uc_kid_hug: '아이 안기',
    uc_unicorn_stand: '유니콘', uc_unicorn_back: '유니콘 뒷모습', uc_sheep_cry: '양 울음', uc_sheep_jump: '양 뛰기', uc_sheep_happy: '양 웃음',
    uc_deer_hurt: '사슴 아픔', uc_deer_relief: '사슴 웃음', uc_horse_hungry: '말 배고픔', uc_horse_happy: '말 웃음',
    uc_prop_block_red: '빨간 조각', uc_prop_block_yellow: '노란 조각', uc_prop_block_blue: '파란 조각', uc_prop_cloud: '구름 섬', uc_prop_thorn: '가시', uc_prop_thorn_bush: '가시 덤불',
    uc_prop_waterfall: '폭포', uc_prop_rainbow: '무지개', uc_prop_basket: '간식 바구니', uc_prop_horn_bands: '무지개 띠',
    uc_hint_tail: '(힌트) 꼬리', uc_hint_silhouette: '(힌트) 구름 실루엣', uc_hint_tree_gap: '(힌트) 나무 틈', uc_hint_spray_eye: '(힌트) 물보라 눈', uc_hint_horn_tip: '(힌트) 뿔 끝',
  };
  function placeholder(T, parent, f, w, h) {
    const g = T.el('g', {}, parent);
    const R = (x, y, ww, hh, rx, fill, extra = {}) => T.el('rect', { x, y, width: ww, height: hh, rx, fill, ...extra }, g);
    const C = (cx, cy, r, fill) => T.el('circle', { cx, cy, r, fill }, g);
    const E = (cx, cy, rx, ry, fill) => T.el('ellipse', { cx, cy, rx, ry, fill }, g);
    const Pth = (d, fill, extra = {}) => T.el('path', { d, fill, ...extra }, g);
    const label = (txt, cx, cy, fill = INK, fs) => {
      const t = T.el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': fs || Math.max(10, Math.min(16, h * .07)), 'font-weight': 700, fill, 'font-family': FONT, text: T.tr(txt) }, g);
      t.classList.add('phl'); t.dataset.cx = cx; t.dataset.cy = cy; t.setAttribute('transform', `translate(${cx},${cy})`);
    };
    const nm = NAMES[f] || f;
    const kid = /^uc_kid_(.+)$/.exec(f);
    if (kid) {
      const pose = kid[1], r = Math.min(h * .2, w * .22);
      R(w / 2 - r * 1.2, 2 * r - 4, r * 2.4, h * .38, 10, '#D9A94E');
      R(w / 2 - r * 1.1, 2 * r + h * .34, r * 1.0, h - (2 * r + h * .34), 4, '#6B4A32'); R(w / 2 + r * .1, 2 * r + h * .34, r * 1.0, h - (2 * r + h * .34), 4, '#6B4A32');
      if (pose === 'hug') [-1, 1].forEach(s => R(w / 2 + s * (w * .3) - 5, 2 * r - 2, 10, h * .3, 5, '#F3D9B8', { transform: `rotate(${s * 70} ${w / 2 + s * r * 1.1} ${2 * r})` }));
      C(w / 2, r + 2, r, '#F3D9B8'); Pth(`M${w / 2 - r} ${r + 2} Q${w / 2} ${-r * .5} ${w / 2 + r} ${r + 2}Z`, '#6B4A32');
      const dx = pose === 'stand' || pose === 'hug' || pose === 'turn' ? 0 : r * .25;
      [-1, 1].forEach(s => C(w / 2 + s * r * .35 + dx, r + 4, 2.6, INK));
      label(nm, w / 2, 2 * r + h * .2, INK, Math.max(10, Math.min(14, w / 4)));
      return g;
    }
    if (/^uc_(unicorn|horse|deer|sheep)_/.test(f)) {
      const who = f.split('_')[1], lying = f === 'uc_deer_hurt', back = f === 'uc_unicorn_back';
      const col = { unicorn: '#F4F6FA', horse: '#8A5A38', deer: '#6B4A32', sheep: '#F4F6FA' }[who];
      const bh = h * (lying ? .5 : who === 'sheep' ? .5 : .38), by = h - bh - (lying ? 0 : h * .22);
      E(w * .55, by + bh / 2, w * .34, bh / 2, col);
      if (!lying) [.3, .42, .62, .74].forEach(k => R(w * k, by + bh * .6, Math.max(4, w * .035), h - by - bh * .6, 2, who === 'sheep' ? '#6B4A32' : INK));
      const hx = back ? w * .6 : w * .2, hy = lying ? h * .45 : who === 'sheep' ? by : h * .22;
      C(hx, hy, Math.max(12, h * (who === 'sheep' ? .14 : .1)), who === 'sheep' ? CREAM : col);
      if (who === 'unicorn') { Pth(`M${hx - 4} ${hy - h * .1} L${hx + 4} ${hy - h * .1} L${hx} ${hy - h * .26}Z`, CREAM); RAIN.forEach((c, i) => R(hx + 8 + i * 5, hy - h * .08, 5, h * .26, 1, c)); }
      if (who === 'deer') { Pth(`M${hx + 4} ${hy - h * .08} l-6 ${-h * .1} m6 ${h * .1} l8 ${-h * .1}`, 'none', { stroke: '#6B4A32', 'stroke-width': 3 }); }
      if (who === 'horse') C(hx + 16, hy - 6, 6, '#3E7CB1');
      if (!back) C(hx - 5, hy - 2, 2.4, INK);
      label(nm, w * .55, by + bh / 2 + 4, who === 'horse' || who === 'deer' ? CREAM : INK, Math.max(10, Math.min(15, h * .06)));
      return g;
    }
    switch (f) {
      case 'uc_prop_block_red': case 'uc_prop_block_yellow': case 'uc_prop_block_blue':
        R(0, h * .12, w, h * .88, 5, f.endsWith('red') ? '#A93B32' : f.endsWith('yellow') ? '#D9A94E' : '#3E7CB1'); R(0, 0, w, h * .14, 3, 'rgba(46,36,28,.25)'); label(nm, w / 2, h * .66, CREAM, 10); break;
      case 'uc_prop_cloud': E(w / 2, h * .62, w * .48, h * .36, '#F4F6FA'); E(w * .35, h * .4, w * .2, h * .26, '#F4F6FA'); E(w * .62, h * .34, w * .24, h * .3, '#F4F6FA'); label(nm, w / 2, h * .7, INK, 13); break;
      case 'uc_prop_thorn': Pth(`M${w * .15} ${h} L${w / 2} 0 L${w * .85} ${h}Z`, '#6B4A32'); break;
      case 'uc_prop_thorn_bush': E(w / 2, h * .6, w * .46, h * .38, '#3F6B4F'); E(w * .32, h * .5, w * .26, h * .3, '#3F6B4F'); label(nm, w / 2, h * .66, CREAM, 12); break;
      case 'uc_prop_waterfall': [0, 1, 2].forEach(i => R(w * (.1 + i * .3), 0, w * .22, h * (.9 - i * .06), 4, '#F4F6FA')); label(nm, w / 2, h * .5, INK, 13); break;
      case 'uc_prop_rainbow': RAIN.forEach((c, i) => Pth(`M${w * .04 + i * 10} ${h} A${w * .46 - i * 10} ${h * .96 - i * 10} 0 0 1 ${w * .96 - i * 10} ${h}`, 'none', { stroke: c, 'stroke-width': 10 })); break;
      case 'uc_prop_basket': Pth(`M${w * .1} ${h * .5} L${w * .9} ${h * .5} L${w * .78} ${h} L${w * .22} ${h}Z`, '#D9A94E'); [.3, .5, .7].forEach(k => C(w * k, h * .42, w * .09, k === .5 ? '#A93B32' : '#E8703A')); label(nm, w / 2, h * .78, INK, 10); break;
      case 'uc_prop_horn_bands': RAIN.forEach((c, i) => R(w * (.04 + i * .135), h * .2, w * .1, h * .6, 3, c)); break;
      case 'uc_hint_tail': RAIN.forEach((c, i) => R(w * (.08 + i * .12), h * .1, w * .09, h * .8, 2, c)); break;
      case 'uc_hint_silhouette': E(w * .5, h * .55, w * .4, h * .28, CREAM); C(w * .14, h * .3, h * .12, CREAM); Pth(`M${w * .1} ${h * .2} L${w * .14} 0 L${w * .18} ${h * .2}Z`, CREAM); break;
      case 'uc_hint_tree_gap': R(w * .3, 0, w * .4, h, 2, '#F4F6FA'); RAIN.slice(0, 3).forEach((c, i) => R(w * (.34 + i * .1), 0, w * .08, h * .2, 1, c)); break;
      case 'uc_hint_spray_eye': [[.3, .6, .18], [.6, .5, .22], [.5, .8, .14]].forEach(([x, y, r]) => C(w * x, h * y, w * r, '#F4F6FA')); C(w * .55, h * .5, w * .13, '#1F2A56'); C(w * .59, h * .46, w * .035, '#F4F6FA'); break;
      case 'uc_hint_horn_tip': Pth(`M${w * .3} ${h} L${w * .5} ${h * .15} L${w * .7} ${h}Z`, CREAM); Pth(`M${w * .5} 0 L${w * .56} ${h * .1} L${w * .66} ${h * .14} L${w * .56} ${h * .2} L${w * .5} ${h * .3} L${w * .44} ${h * .2} L${w * .34} ${h * .14} L${w * .44} ${h * .1}Z`, '#D9A94E'); break;
      default: R(0, 0, w, h, Math.min(w, h) * .2, '#D9A94E'); label(nm, w / 2, h / 2, INK, 13);
    }
    return g;
  }
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    const g = placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
    return g.parentNode;
  }
  const BGPH = {
    uc_bg_hill: { sky: '#F6ECD8', gnd: '#3F6B4F', name: '집 앞 언덕', shapes: () => [['circle', { cx: 150, cy: 120, r: 46, fill: '#D9A94E' }], ['rect', { x: 100, y: 330, width: 120, height: 90, fill: '#F6ECD8' }], ['ellipse', { cx: 780, cy: 130, rx: 90, ry: 34, fill: '#F4F6FA' }]] },
    uc_bg_cloudland: { sky: '#F6ECD8', gnd: '#F4F6FA', name: '구름 나라', shapes: () => [['circle', { cx: 150, cy: 100, r: 40, fill: '#D9A94E' }], ['ellipse', { cx: 520, cy: 160, rx: 80, ry: 30, fill: '#F4F6FA' }], ['ellipse', { cx: 840, cy: 230, rx: 70, ry: 26, fill: '#F4F6FA' }]] },
    uc_bg_night_forest: { sky: '#1F2A56', gnd: '#3F6B4F', name: '별빛 숲', shapes: () => [...[80, 240, 640, 820].map(x => ['rect', { x, y: 190, width: 36, height: 230, fill: '#3F6B4F' }]), ...[160, 520, 900].map(x => ['circle', { cx: x, cy: 380, r: 8, fill: '#F2B366' }])] },
    uc_bg_waterfall: { sky: '#F6ECD8', gnd: '#3F6B4F', name: '무지개 폭포', shapes: () => [['rect', { x: 640, y: 40, width: 380, height: 380, fill: '#7A8B74' }], ['ellipse', { cx: 840, cy: 470, rx: 150, ry: 36, fill: '#F4F6FA' }]] },
    uc_bg_dusk_road: { sky: '#F2B366', gnd: '#6B4A32', name: '빈 길', shapes: () => [['rect', { x: -40, y: 330, width: 1080, height: 80, fill: '#1F2A56' }], ['rect', { x: 80, y: 200, width: 24, height: 220, fill: '#2E241C' }]] },
    uc_bg_moon_night: { sky: '#1F2A56', gnd: '#6B4A32', name: '달밤', shapes: () => [['circle', { cx: 820, cy: 120, r: 60, fill: '#F6ECD8' }], ...[60, 200, 360, 560, 900].map(x => ['circle', { cx: x, cy: 380, r: 40, fill: '#3F6B4F' }])] },
  };
  function bgImage(T, key) {
    if (bgOK[key]) return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const d = BGPH[key], g = T.el('g', {}, T.bg);
    T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: d.sky }, g);
    T.el('rect', { x: BGBOX.x, y: 412, width: BGBOX.w, height: 200, fill: d.gnd }, g);
    d.shapes().forEach(([t, a]) => T.el(t, a, g));
    T.el('text', { x: 500, y: 52, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: '#6B4A32', 'font-family': FONT, opacity: .85, text: '(그림 자리) 배경: ' + d.name }, g);
    return g;
  }

  /* ================= 배우·소품 ================= */
  /* poses = { 이름: [그림, 높이] }. a.look(자세, 방향) — 그림이 보는 쪽이 다르면 뒤집는다(앞모습은 뒤집지 않는다). 기본 방향은 오른쪽 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, [f, h]]) => {
        const w = h * (ASP[f] || 1), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
      });
    });
    a.want = 'right';
    const place0 = a.place;      // 자리표시의 글자는 뒤집히지 않게 거꾸로 되돌린다
    a.place = (nx, ny) => { place0(nx, ny); a.pos.querySelectorAll('.phl').forEach(t => t.setAttribute('transform', `translate(${t.dataset.cx},${t.dataset.cy}) scale(${a.flip},1)`)); };
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.w = looks[k].w; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const prop = (T, f, h) => mk(T, { a: [f, h || HT[f]] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to || 'right'); else a.turn(to || 'right');
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = ''; a.body.style.opacity = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 600) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  const wiggleEl = (T, n) => T.anim(n, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360);
  const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
  const sfx = (name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });
  const hopLoop = async (a, ms, h = 4) => { const end = Date.now() + ms; while (Date.now() < end - 400) await a.hop(h, 460); };
  const drive = (a, x, y, ms, ease = 'linear', h = 4) => Promise.all([a.move(x, y, ms, ease), hopLoop(a, ms, h)]);
  const stepSfx = (vol = .22, every = 700) => { const one = () => sfx('step_grass', vol); one(); const id = setInterval(one, every); return () => clearInterval(id); };
  /* 누르는 자리 넓히기: 화면 크기 w×h 투명 사각을 그림 뒤에 깐다 (세로에서는 PS 배 줄어드는 만큼 키운다) */
  function hitBox(T, a, w = 100, h = 100) {
    const lw = w / a.scale, lh = h / a.scale;
    const r = T.el('rect', { x: -lw / 2, y: -lh, width: lw, height: lh, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.body); a.hit = a.pos; a.hitRect = r;
    return a;
  }
  const unhit = a => { if (a.hitRect) { a.hitRect.remove(); a.hitRect = null; } a.hit = null; };

  const S = {
    L0: "언덕 위에 작은 아이가 서 있어요. 하늘을 올려다보고 있어요.",
    L1: "진짜 유니콘을 만나고 싶어요.",
    L2: "여기 색깔 조각이 세 개 있어요. 빨간 조각을 톡, 눌러 봐요.",
    C1: "맞았어요! 빨간색이에요.",
    L3: "아이는 구름 나라로 올라가 보기로 했어요.",
    L4: "구름 섬에 양 한 마리가 혼자 앉아 있어요.",
    L5: "훌쩍… 집에 어떻게 가지…",
    L6: "양이 앉은 구름을 톡, 눌러 봐요.",
    L7: "양이 폴짝 뛰어내렸어요!",
    L8: "같이 가자!",
    L9: "아이와 양은 손을 잡고 구름 길을 걸었어요.",
    L10: "고마워! 이제 집이 보여!",
    L11: "양은 집으로 돌아갔어요. 유니콘은 아직 보이지 않아요.",
    L12: "밤이 되자, 아이는 별빛 숲으로 들어갔어요.",
    L13: "아야, 아야…",
    L14: "사슴 다리에 가시가 박혔어요. 가시를 톡, 눌러 봐요. 살살 빼 줄게요.",
    L15: "가시 세 개를 모두 뺐어요!",
    L16: "고마워! 이제 하나도 안 아파.",
    L17: "아이는 사슴의 작은 뿔을 가만히 보았어요.",
    L18: "유니콘은… 아니구나.",
    L19: "폭포 위에 무지개가 떠 있어요. 말 한 마리가 서 있어요.",
    L20: "꼬르륵…",
    L21: "말은 아이의 간식 바구니를 보고 있어요.",
    L22: "자, 같이 먹자.",
    L23: "말은 간식을 냠냠 맛있게 먹었어요.",
    L24: "고마워! 정말 맛있었어.",
    L25: "너도… 유니콘은 아니구나.",
    L26: "해가 지고, 길은 텅 비었어요.",
    L27: "진짜 유니콘은… 없나 봐.",
    L28: "아이는 땅만 보며 터벅터벅 걸었어요.",
    L29: "그때, 뒤에서 작은 소리가 났어요.",
    L30: "아이가 천천히 뒤를 돌아보았어요.",
    L31: "달빛 아래, 하얀 유니콘이 서 있었어요.",
    L32: "나는 계속 여기 있었어.",
    L33: "네가 친절한 걸 다 보고 있었어.",
    L34: "유니콘…!",
    L35: "유니콘을 톡, 눌러서 인사해요.",
    L36: "아이는 유니콘을 꼭 안았어요.",
  };

  async function run(T) {
    const { sleep, camSnap, tr } = T;
    T.cardSpeed(.6);
    /* 쉼(7분 이상으로 맞추는 값): 대사 사이 GAP, 장면 끝 SCENE_END, 조용한 걸음 */
    const GAP = 3200, SCENE_END = 7500;
    const say = async text => { await T.say(text); await sleep(GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };
    const voWait = async k => { const p = vo(k); if (p) await Promise.race([p, sleep(4000)]); };
    const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
    const X = (l, p) => (P ? p : l);
    let VX = { lx: 500, ps: 1 };
    /* 장면 시작: 세로에서는 월드·효과 층을 ps 배로 줄여 landscape 좌표 lx 가 화면 가운데에 오게 한다 */
    const setView = (lx, ps = .75) => {
      T.fx.style.pointerEvents = 'none';
      VX = { lx, ps };
      const t = P ? `translate(500 ${FL}) scale(${ps}) translate(${-lx} ${-FL})` : '';
      [T.world, T.fx].forEach(g => (t ? g.setAttribute('transform', t) : g.removeAttribute('transform')));
      camSnap(500, 280, 1);
    };
    const scene = (key, lx, ps) => { T.clear(); bgImage(T, key); setView(lx, ps); };
    const follow = (x, ms = 800) => (P ? T.camTo(500 + (x - VX.lx) * VX.ps, 280, 1, ms) : Promise.resolve());
    const H = n => (P ? n / VX.ps : n);               // 화면 크기를 지키는 누르는 자리
    AudioFX.preloadSfx(['paper_down', 'paper_up', 'swish', 'whoosh', 'knock', 'sparkle', 'tada', 'step_grass', 'pop', 'boing', 'ding']);
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    CUTS.forEach(k => T.preload(src(k)));
    await Promise.race([Promise.all(loads), sleep(4000)]);
    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, ['uc_' + who + '_' + p, HT['uc_' + who + '_' + p]]]));
    const kid = mk(T, pz('kid', ['stand', 'walk', 'sad', 'tired', 'turn', 'hug']));
    const uni = mk(T, pz('unicorn', ['stand', 'back']));
    const sheep = mk(T, pz('sheep', ['cry', 'jump', 'happy']));
    const deer = mk(T, pz('deer', ['hurt', 'relief']));
    const horse = mk(T, pz('horse', ['hungry', 'happy']));
    const blocks = { red: prop(T, 'uc_prop_block_red'), yellow: prop(T, 'uc_prop_block_yellow'), blue: prop(T, 'uc_prop_block_blue') };
    const cloud = prop(T, 'uc_prop_cloud'), bush = prop(T, 'uc_prop_thorn_bush'), fall = prop(T, 'uc_prop_waterfall'), rainbow = prop(T, 'uc_prop_rainbow');
    const basket = prop(T, 'uc_prop_basket'), bands = prop(T, 'uc_prop_horn_bands');
    const thorns = [0, 1, 2].map(() => prop(T, 'uc_prop_thorn'));
    const hTail = prop(T, 'uc_hint_tail'), hSil = prop(T, 'uc_hint_silhouette'), hTree = prop(T, 'uc_hint_tree_gap'), hEye = prop(T, 'uc_hint_spray_eye'), hTip = prop(T, 'uc_hint_horn_tip');
    const ALL = [kid, uni, sheep, deer, horse, ...Object.values(blocks), cloud, bush, fall, rainbow, basket, bands, ...thorns, hTail, hSil, hTree, hEye, hTip];
    ALL.forEach(hide);
    T.director(null);
    /* 숨은 유니콘 힌트: 점진 노출 (PLAN 표) — 아주 옅게 시작해서 10장에 완전히 나온다 */
    const hint = (a, x, y, op) => { put(T, a, x, y); a.body.style.opacity = op; return a; };
    /* 사슴 다리의 가시 자리(사슴 가운데 x·바닥 y 기준 오프셋, 누운 사슴 그림 도착 뒤 다시 잰다) */
    const THORN = [[-52, -42], [-72, -35], [-92, -28]];
    const POPY = a => FL - a.h - 30;      // 말풍선 글자: 머리 위쪽 (인물 얼굴을 가리지 않는다)

    /* ===== 1. 설렘 (배움 놀이: 색 찾기 — 첫 조작) ===== */
    scene('uc_bg_hill', 400);
    put(T, kid, 300, FL, { look: 'stand' });
    hint(hTail, X(870, 520), 185, .1);
    const kinds = ['red', 'yellow', 'blue'].sort(() => Math.random() - .5), spots = X([430, 560, 690], [380, 450, 520]);
    kinds.forEach((k, i) => { put(T, blocks[k], spots[i], FL + 4); hitBox(T, blocks[k], H(P ? 62 : 100), H(P ? 70 : 100)); });
    await T.curtain(true);
    await say(S.L0);
    await sleep(300);
    await say(S.L1);
    Object.values(blocks).forEach(a => bob(a.pos));
    await T.ask(S.L2, () => T.choose(kinds.map(k => ({
      el: blocks[k].hit, ok: k === 'red',
      onWrong: async () => { await wiggleEl(T, blocks[k].hit); await voWait('retry'); },
    })), { prompt: S.L2 }));
    glow(blocks.red, 1200); sparkleSfx(T); T.pop(blocks.red.x, FL - 90, tr('반짝!'));
    await say(S.C1);
    Object.values(blocks).forEach(unhit);
    kinds.forEach(k => { if (k !== 'red') fadeOut(T, blocks[k], 400); });
    await sleep(500);
    fadeOut(T, blocks.red, 400);
    kid.hop(10, 320);
    await say(S.L3);
    await sleep(SCENE_END);

    /* ===== 2. 구름 나라 (재미 톡 1: 구름) ===== */
    await T.sceneCard(tr('구름 나라'), () => {
      scene('uc_bg_cloudland', 470, .7);
      hint(hSil, X(830, 520), 230, .2);
      put(T, cloud, X(640, 550), FL + 30, { look: 'a' });
      put(T, sheep, cloud.x, FL + 30 - HT.uc_prop_cloud + 18, { look: 'cry', to: 'left' });
      put(T, kid, X(260, 345), FL, { look: 'walk', to: 'right' });
    }, kid.pos);
    await say(S.L4);
    T.pop(sheep.x, POPY(sheep) - 90, tr('훌쩍…'), '#3E7CB1');
    await say(S.L5);
    hitBox(T, cloud, H(P ? 180 : 260), H(P ? 140 : 160));
    bob(cloud.pos);
    await T.ask(S.L6, () => T.tap(cloud.hit, { prompt: S.L6 }));
    unhit(cloud); AudioFX.sfx('boing', .5);
    await T.cutImage([{ src: src('uc_cut_sheep_jump'), hold: 3600 }]);
    sheep.look('jump', 'left'); sfx('whoosh', .4);
    const land = kid.x + 150;
    const sayJump = say(S.L7);
    await Promise.all([sheep.move(land, FL, 900, 'ease-in'), sleep(0)]);
    sheep.look('happy', 'left'); sheep.hop(14, 380); T.pop(land, FL - 200, tr('폴짝!'));
    kid.look('walk', 'right'); kid.hop(10, 320);
    await sayJump;
    await sleep(SCENE_END);

    /* ===== 3. 길 찾기 ===== */
    await T.sceneCard(tr('길 찾기'), () => {
      scene('uc_bg_cloudland', 480, .7);
      hint(hSil, X(880, 520), 215, .2);
      put(T, kid, X(150, 330), FL, { look: 'walk', to: 'right' });
      put(T, sheep, kid.x + 150, FL, { look: 'happy', to: 'left' });
    }, kid.pos);
    await say(S.L8);
    kid.hop(10, 300);
    sheep.turn('right');                                  // 둘 다 가는 쪽(오른쪽)을 본다 — 양이 앞서고 손을 잡는다
    const endX = X(700, 560), stop3 = stepSfx(.2, 750);
    const l9 = say(S.L9);
    follow(endX - 40, 16000);
    await Promise.all([drive(kid, endX - 150, FL, 16000, 'linear', 5), drive(sheep, endX, FL, 16000, 'linear', 5), l9]);
    stop3();
    sheep.turn('left'); sheep.hop(18, 400); sparkleSfx(T);
    await say(S.L10);
    sheep.turn('right'); sheep.look('happy', 'right');
    const l11 = say(S.L11), stop3b = stepSfx(.2, 600);
    await Promise.all([drive(sheep, X(1100, endX + 220), FL, 6000, 'ease-in', 6), l11]);
    stop3b(); hide(sheep);
    await sleep(SCENE_END);

    /* ===== 4. 별빛 숲 (배움 놀이 2: 세기 — 톡 1회, 목소리만) ===== */
    await T.sceneCard(tr('별빛 숲'), () => {
      scene('uc_bg_night_forest', 590, .65);
      put(T, bush, X(840, 745), FL - 6, { look: 'a' });
      put(T, deer, X(690, 650), FL, { look: 'hurt', to: 'left' });
      put(T, kid, X(110, 330), FL, { look: 'walk', to: 'right' });
    }, kid.pos);
    const l12 = say(S.L12), stop4 = stepSfx(.18, 800);
    await Promise.all([drive(kid, X(400, 455), FL, 8000, 'ease-out', 4), l12]);
    stop4();
    await say(S.L13);
    deer.hop(4, 500);
    thorns.forEach((t, i) => { put(T, t, deer.x + THORN[i][0], FL + THORN[i][1], { look: 'a' }); fadeIn(t, 500); });
    hitBox(T, thorns[0], H(P ? 100 : 110), H(P ? 90 : 100));
    bob(thorns[0].pos);
    await T.ask(S.L14, () => T.tap(thorns[0].hit, { prompt: S.L14 }));
    unhit(thorns[0]);
    await T.cutImage([{ src: src('uc_cut_thorns'), hold: 3600 }]);
    for (let i = 0; i < 3; i++) {                          // 하나 · 둘 · 셋 (목소리만, 화면 숫자 글자 없음)
      deer.wiggle(3, 300);
      const t = thorns[i], tx = t.x, ty = t.y;
      sfx('pop', .5);
      const v = voWait('n' + (i + 1));
      await T.anim(t.pos, [{ transform: `translate(${tx}px,${ty}px)`, opacity: 1 }, { transform: `translate(${tx - 30}px,${ty - 80}px)`, opacity: 0 }], 650);
      hide(t); await v; await sleep(500);
    }
    sparkleSfx(T);
    await say(S.L15);
    deer.look('relief', 'left'); deer.hop(10, 400);
    await say(S.L16);
    await sleep(SCENE_END);

    /* ===== 5. 사슴의 뿔 · 아쉬움 ===== */
    await T.sceneCard(tr('사슴의 뿔'), () => {
      scene('uc_bg_night_forest', 590, .65);
      put(T, bush, X(840, 745), FL - 6, { look: 'a' });
      put(T, deer, X(690, 650), FL, { look: 'relief', to: 'left' });
      put(T, kid, X(400, 455), FL, { look: 'sad', to: 'right' });
    }, kid.pos);
    await say(S.L17);
    await sleep(2500);
    await say(S.L18);
    await sleep(SCENE_END);

    /* ===== 6. 무지개 폭포 ===== */
    await T.sceneCard(tr('무지개 폭포'), () => {
      scene('uc_bg_waterfall', 420, .55);
      hint(hTree, X(50, 150), FL - 8, .4);
      put(T, rainbow, X(800, 800), FL - 60, { look: 'a' });
      put(T, fall, X(880, 880), FL - 48, { look: 'a' });
      put(T, horse, X(470, 450), FL, { look: 'hungry', to: 'left' });
      put(T, kid, X(60, 150), FL, { look: 'walk', to: 'right' });
      put(T, basket, kid.x + 85, FL, { look: 'a' }); basket.pos.style.display = 'none';
    }, kid.pos);
    const stop6 = stepSfx(.18, 800);
    await Promise.all([drive(kid, X(230, 250), FL, 3500, 'ease-out', 4)]);
    stop6();
    put(T, basket, kid.x + 85, FL, { look: 'a' }); fadeIn(basket, 400);
    const l19 = say(S.L19);
    follow(840, 1600); setTimeout(() => follow(420, 1600), 3200);
    await l19;
    horse.hop(6, 500); T.pop(horse.x - 20, POPY(horse) - 40, tr('꼬르륵…'));
    await say(S.L20);
    await say(S.L21);
    await sleep(SCENE_END);

    /* ===== 7. 간식 나누기 ===== */
    await T.sceneCard(tr('간식 나누기'), () => {
      scene('uc_bg_waterfall', 420, .55);
      hint(hEye, X(800, 800), FL - 22, .6);
      put(T, rainbow, X(800, 800), FL - 60, { look: 'a' });
      put(T, fall, X(880, 880), FL - 48, { look: 'a' });
      put(T, horse, X(470, 450), FL, { look: 'hungry', to: 'left' });
      put(T, kid, X(230, 250), FL, { look: 'walk', to: 'right' });
      put(T, basket, kid.x + 85, FL, { look: 'a' });
    }, kid.pos);
    kid.hop(10, 320);
    await say(S.L22);
    sfx('paper_up', .5);
    await basket.move(horse.x - 160, FL, 1400, 'ease-in-out');
    horse.look('happy', 'left');
    const l23 = say(S.L23);
    T.pop(horse.x - 10, POPY(horse) - 50, tr('냠냠')); sfx('pop', .4);
    for (let i = 0; i < 3; i++) await horse.hop(8, 520);
    fadeOut(T, basket, 600);
    await l23;
    await say(S.L24);
    kid.look('sad', 'right');
    await say(S.L25);
    follow(840, 1400);
    await sleep(4500);
    follow(420, 1200);
    await sleep(SCENE_END);

    /* ===== 8. 빈 길 (조용히) ===== */
    await T.sceneCard(tr('빈 길'), () => {
      scene('uc_bg_dusk_road', 500);
      put(T, kid, X(760, 640), FL, { look: 'tired', to: 'left' });     // 아이는 땅을 보며 왼쪽으로 걷는다 (뒤돌아보지 않음)
    }, kid.pos);
    await sleep(5000);
    await say(S.L26);
    await sleep(1500);
    await say(S.L27);
    await sleep(2000);
    const l28 = say(S.L28), stop8 = stepSfx(.15, 1000);
    follow(X(430, 380), 22000);
    await Promise.all([drive(kid, X(430, 380), FL, 22000, 'linear', 2), l28]);
    stop8();
    await sleep(SCENE_END + 1500);

    /* ===== 9. 사박사박 ===== */
    await T.sceneCard(tr('사박사박'), () => {
      scene('uc_bg_moon_night', 540);
      put(T, kid, X(640, 600), FL, { look: 'tired', to: 'left' });
    }, kid.pos);
    const l29 = say(S.L29), stop9 = stepSfx(.15, 1000);
    follow(X(430, 440), 4500);
    await Promise.all([drive(kid, X(500, 490), FL, 4500, 'linear', 2), l29]);
    stop9();
    hint(hTip, X(800, 650), 330, .85);
    fadeIn(hTip, 1200);
    await sleep(600);
    for (let i = 0; i < 3; i++) { vo('steps'); T.pop(X(830, 560), FL - 345, tr('사박, 사박')); await sleep(3600); }
    await T.cutImage([{ src: src('uc_cut_turn'), hold: 3600 }]);
    kid.look('turn', 'right'); kid.hop(6, 400);                       // 뒤를 돌아본다 (고개를 오른쪽 어깨 너머로)
    const l30 = say(S.L30);
    fadeOut(T, hTip, 900);
    put(T, uni, X(830, 640), FL - 30, { look: 'back', to: 'right', s: .85 }); fadeIn(uni, 1600); glow(uni, 1800);
    await l30;
    await sleep(4500);
    await sleep(SCENE_END);

    /* ===== 10. 진짜 유니콘 (인사 톡) ===== */
    await T.sceneCard(tr('진짜 유니콘'), () => {
      scene('uc_bg_moon_night', 560, .6);
      put(T, kid, X(420, 430), FL, { look: 'stand' });
      put(T, uni, X(720, 650), FL, { look: 'stand', to: 'left' }); uni.pos.style.opacity = 0;
    }, uni.pos);
    uni.pos.style.opacity = ''; fadeIn(uni, 1400); glow(uni, 1500);
    await sleep(2500);
    await say(S.L31);
    await say(S.L32);
    await say(S.L33);
    kid.hop(18, 420); sfx('tada', .4);
    await say(S.L34);
    hitBox(T, uni, H(P ? 190 : 260), H(P ? 230 : 300));
    bob(uni.pos);
    await T.ask(S.L35, () => T.tap(uni.hit, { prompt: S.L35 }));
    unhit(uni);
    glow(uni, 1400); sparkleSfx(T);
    put(T, bands, uni.x - 95, FL - HT.uc_unicorn_stand - 34, { look: 'a' }); fadeIn(bands, 500);
    T.pop(uni.x + 40, FL - HT.uc_unicorn_stand - 100, tr('반짝!'), '#D9A94E');
    await sleep(3000);
    await T.anim(bands.pos, [{ opacity: 1 }, { opacity: 0 }], 600); hide(bands);
    await T.cutImage([{ src: src('uc_cut_hug'), hold: 4200 }]);
    kid.look('hug'); T.world.appendChild(kid.pos);
    sfx('paper_up', .5);
    await kid.move(uni.x - 135, FL, 900, 'ease-out');
    T.confetti(); sfx('tada') || sparkleSfx(T);
    for (let i = 0; i < 2; i++) await Promise.all([kid.hop(22, 480), uni.hop(14, 480)]);
    await say(S.L36);
    await sleep(5000);
    T.finale(); await sleep(1500);
    return '너도 누군가에게 친절하면, 너만의 유니콘을 만날 수 있어.';
  }

  Tale.mount({ title: '유니콘을 찾아서', subtitle: '', run: T => run(Tale.api) });
})();
