/* 토끼와 거북이 — 페이퍼아트 그림 버전 (그림이 아직 없는 것은 임시 도형). 기획: TALES_PLAN.md §3
   숲속 동물 관객석(8마리, 언제든 톡 하면 일어나 울음소리) + 두 시점 교차(쌩쌩 토끼 / 엉금엉금 거북이).
   3~4세 순화: 진 토끼를 놀리지 않는다 — 토끼가 먼저 축하하고 다 같이 잔치로 끝난다.
   - 배경: 장면마다 한 장(assets/v3w/rab_bg_*.webp)을 무대 전체에 깐다.
   - 배우: 같은 배우 틀(발끝 = 배우 y) 안에 그림(<image>)을 넣는다. 톡 대상·크기·방향·폴짝은 그대로. */
(() => {
  const C = { cream: '#F6ECD8', gold: '#D9A94E', persimmon: '#E8703A', bean: '#A93B32', bark: '#6B4A32', pine: '#3F6B4F',
    indigo: '#1F2A56', lav: '#8B7BB8', snow: '#F4F6FA', amber: '#F2B366', leaf: '#6E9A5B', ink: '#2E241C', pink: '#E8A0A0',
    sky: '#F2DFA8', grass: '#7c9a58', dirt: '#d9b98a', line: '#cbbfa8' };

  /* ---------- 작은 도우미 ---------- */
  const tween = (ms, fn, ease = t => t) => new Promise(res => {
    const t0 = performance.now();
    const f = now => { const t = Math.min(1, (now - t0) / ms); fn(ease(t)); t < 1 ? requestAnimationFrame(f) : res(); };
    requestAnimationFrame(f);
  });
  const easeOut = t => 1 - (1 - t) * (1 - t);
  const easeInOut = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const show = (n, on) => n.setAttribute('opacity', on ? 1 : 0);

  /* ================= 완성 그림 목록 =================
     null = 쓸 그림이 없어 임시 도형으로 그린다. 새 파일이 나오면 여기 한 줄만 바꾸면 된다.
     거북이·잠자는 토끼는 마젠타 배경으로 다시 뽑은 파일 (tools/gpu_night/jobs_green_redo.json).
     rabbit_sleep: 그림 속 이불은 크림색 천이지만 대사가 '나뭇잎 이불'이라 임시 도형 나뭇잎 이불을 그 위에 그대로 덮는다
     bg_party: 지금 그림은 거의 새까맣고 사람 그림자가 들어가 있어 쓰지 않는다 (다시 뽑을 것) → 임시 도형 배경
     부엉이: aud_owl 그림에 다른 동물 둘이 같이 그려져 있어 owl_post(가방 멘 부엉이)를 관객석에도 쓴다
     메달: rab_medal 위쪽의 엉뚱한 노란 덩어리는 잘라내고 리본+메달만 webp로 만들었다 */
  const ART = {
    bg_village: 'v3w/rab_bg_village.webp', bg_alley: 'v3w/rab_bg_alley.webp', bg_stands: 'v3w/rab_bg_stands.webp', bg_start: 'v3w/rab_bg_start.webp',
    bg_map: 'v3w/rab_bg_map.webp', bg_dash: 'v3w/rab_bg_dash.webp', bg_shade: 'v3w/rab_bg_shade.webp', bg_dream: 'v3w/rab_bg_dream.webp',
    bg_grass_low: 'v3w/rab_bg_grass_low.webp', bg_stream: 'v3w/rab_bg_stream.webp', bg_hill: 'v3w/rab_bg_hill.webp', bg_finish: 'v3w/rab_bg_finish.webp',
    bg_party: null, // 'v3w/rab_bg_party.webp' — 다시 뽑을 것
    rabbit_stand: 'v3w/rab_rabbit_tease.webp', rabbit_run: 'v3w/rab_rabbit_run.webp', rabbit_wake: 'v3w/rab_rabbit_wake.webp', rabbit_congrats: 'v3w/rab_rabbit_congrats.webp',
    rabbit_sleep: 'v3w/rab_rabbit_sleep.webp',
    turtle_walk: 'v3w/rab_turtle_walk.webp', turtle_swim: 'v3w/rab_turtle_swim.webp', turtle_medal: 'v3w/rab_turtle_medal.webp',
    raccoon: 'v3w/rab_raccoon.webp', owl_post: 'v3w/rab_owl_post.webp',
    aud_duck: 'v3w/rab_aud_duck.webp', aud_cow: 'v3w/rab_aud_cow.webp', aud_pig: 'v3w/rab_aud_pig.webp', aud_rooster: 'v3w/rab_aud_rooster.webp',
    aud_sheep: 'v3w/rab_aud_sheep.webp', aud_dog: 'v3w/rab_aud_dog.webp', aud_cat: 'v3w/rab_aud_cat.webp', aud_owl: 'v3w/rab_owl_post.webp',
    carrot_trophy: 'v3w/rab_carrot_trophy.webp', medal: 'v3w/rab_medal.webp',
    cut_wake: 'v3w/rab_cut_wake.webp', cut_dash: 'v3w/rab_cut_dash.webp', cut_photo: 'v3w/rab_cut_photo.webp',
  };
  const A = p => '../../assets/' + p;
  /* 배경 그림 둘레 색 [위, 아래] — 세로 화면에서 물러설 때(줌아웃) 그림 밖을 채운다 */
  const EDGE = { bg_village: ['#009acb', '#3a5c0f'], bg_alley: ['#5cd5fd', '#657f1a'], bg_stands: ['#448775', '#69750d'], bg_start: ['#00aaee', '#795b25'],
    bg_map: ['#66d3fd', '#acc41c'], bg_dash: ['#67dcf5', '#855420'], bg_shade: ['#06c1f9', '#333201'], bg_dream: ['#dfd0b8', '#7d6a30'],
    bg_grass_low: ['#1192aa', '#232101'], bg_stream: ['#71ae23', '#482b0d'], bg_hill: ['#00befd', '#346000'], bg_finish: ['#259ca5', '#635916'] };
  const BGX = { x: -40, y: -22, width: 1080, height: 605, preserveAspectRatio: 'xMidYMid slice' }; // 장면 그림 자리 (무대 1000×560 전체)
  /* 장면 그림 한 장을 무대 전체에 (없으면 false → 임시 도형 배경) */
  function artBG(T, key, parent = T.bg) {
    if (!ART[key]) return false;
    const [top, bot] = EDGE[key] || [C.sky, C.grass];
    T.el('rect', { x: -1200, y: -1200, width: 3400, height: 1480, fill: top }, parent);
    T.el('rect', { x: -1200, y: 280, width: 3400, height: 1600, fill: bot }, parent);
    return T.el('image', { href: A(ART[key]), ...BGX }, parent);
  }
  /* 배경 그림 속 물건(문·돌멩이)을 톡 대상으로: 같은 그림을 그 모양으로 오려 겹친다 → 반짝임(armGlow)이 그 물건에 생긴다 */
  let clipN = 0;
  function artPiece(T, key, shape, parent = T.world) {
    const g = T.el('g', {}, parent), id = 'artClip' + (++clipN);
    const cp = T.el('clipPath', { id }, T.el('defs', {}, g));
    T.el(shape[0], shape[1], cp);
    T.el('image', { href: A(ART[key]), ...BGX, 'clip-path': `url(#${id})` }, g);
    return g;
  }
  /* 배우 그림: 발끝(0,0) 기준 w×h 상자 안에 아래·가운데 맞춤. flip: 그림이 코드가 가정한 쪽(오른쪽)과 반대를 볼 때 */
  function sprite(T, g, key, w, h, { flip = false, dx = 0, dy = 0 } = {}) {
    if (!ART[key]) return null;
    const wrap = T.el('g', { filter: 'url(#pp)', transform: `translate(${dx} ${dy})${flip ? ' scale(-1 1)' : ''}` }, g);
    T.el('image', { href: A(ART[key]), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'xMidYMax meet' }, wrap);
    return wrap;
  }
  /* 그림 컷 (없으면 null → 부른 쪽이 임시 컷) */
  const cutArt = (T, key, sfx, hold, onShow) => (ART[key] ? T.cutImage([{ src: A(ART[key]), sfx, hold }], { hold, onShow }) : null);
  let loops = [];
  const every = (ms, fn) => { const h = setInterval(fn, ms); loops.push(h); return h; };
  const stopLoops = () => { loops.forEach(clearInterval); loops = []; };

  /* ================= 주인공 그림 (오른쪽을 보고 서 있다, 발끝 0,0) ================= */
  function drawRabbit(T, g) {
    const { el, paper } = T;
    const W = { fill: C.snow, stroke: C.line, 'stroke-width': 2 };
    const root = el('g', {}, g);
    const legsStand = paper(root, [['ellipse', { cx: -18, cy: -8, rx: 30, ry: 10, ...W }], ['ellipse', { cx: 24, cy: -7, rx: 16, ry: 8, ...W }]]);
    const legsRun = paper(root, [['ellipse', { cx: -54, cy: -24, rx: 30, ry: 10, transform: 'rotate(-25 -54 -24)', ...W }], ['ellipse', { cx: 50, cy: -18, rx: 18, ry: 8, transform: 'rotate(20 50 -18)', ...W }]]);
    show(legsRun, 0);
    paper(root, [
      ['circle', { cx: -40, cy: -46, r: 13, ...W }],
      ['ellipse', { cx: -4, cy: -50, rx: 38, ry: 42, ...W }],
      ['ellipse', { cx: 12, cy: -44, rx: 18, ry: 26, fill: C.cream }],
      ['ellipse', { cx: 26, cy: -58, rx: 9, ry: 20, transform: 'rotate(-25 26 -58)', ...W }],
    ]);
    const head = el('g', {}, root);
    const ears = paper(head, [
      ['ellipse', { cx: 4, cy: -170, rx: 12, ry: 38, transform: 'rotate(-12 4 -170)', ...W }],
      ['ellipse', { cx: 4, cy: -168, rx: 5, ry: 27, transform: 'rotate(-12 4 -170)', fill: C.pink }],
      ['ellipse', { cx: 32, cy: -168, rx: 12, ry: 38, transform: 'rotate(10 32 -168)', ...W }],
      ['ellipse', { cx: 32, cy: -166, rx: 5, ry: 27, transform: 'rotate(10 32 -168)', fill: C.pink }],
    ]);
    const face = paper(head, [['circle', { cx: 20, cy: -110, r: 32, ...W }], ['circle', { cx: 36, cy: -97, r: 6, fill: C.pink, opacity: .7 }], ['circle', { cx: 51, cy: -106, r: 4.5, fill: C.pink }]]);
    const eyes = {
      open: el('g', {}, face), half: el('g', {}, face), closed: el('g', {}, face), wide: el('g', {}, face),
    };
    el('circle', { cx: 34, cy: -116, r: 5.5, fill: C.ink }, eyes.open); el('circle', { cx: 36, cy: -118, r: 2, fill: '#fff' }, eyes.open);
    el('path', { d: 'M28.5 -116 A5.5 5.5 0 0 0 39.5 -116 Z', fill: C.ink }, eyes.half); el('path', { d: 'M27 -116 H41', stroke: C.ink, 'stroke-width': 2.5 }, eyes.half);
    el('path', { d: 'M28 -117 Q34 -110 40 -117', stroke: C.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, eyes.closed);
    el('circle', { cx: 34, cy: -117, r: 9, fill: '#fff', stroke: C.ink, 'stroke-width': 2 }, eyes.wide); el('circle', { cx: 36, cy: -117, r: 4, fill: C.ink }, eyes.wide);
    const smile = el('path', { d: 'M40 -98 Q45 -92 50 -98', stroke: C.ink, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, face);
    const yawn = el('ellipse', { cx: 45, cy: -95, rx: 5, ry: 7, fill: C.bean }, face);
    const p = {
      root, head, ears, eyes, smile, yawn,
      setEyes(k) { Object.entries(eyes).forEach(([n, e]) => show(e, n === k)); },
      pose(k) { show(legsStand, k !== 'run'); show(legsRun, k === 'run'); root.setAttribute('transform', k === 'run' ? 'rotate(12)' : ''); },
      mouth(k) { show(smile, k !== 'yawn'); show(yawn, k === 'yawn'); },
      sleepy(on) { head.setAttribute('transform', on ? 'rotate(14 20 -90)' : ''); },
      ears(k) { ears.setAttribute('transform', `translate(0 -132) scale(1 ${k}) translate(0 132)`); },
    };
    p.setEyes('open'); p.mouth('smile');
    p.bobEl = root;
    /* 그림: 자세마다 한 장. 코드는 '오른쪽을 본다'고 가정 → 왼쪽을 보는 그림(tease·congrats)은 뒤집어 넣는다.
       그림이 없는 자세(지금은 잠)는 위 임시 도형을 대신 보인다 */
    const artG = el('g', {}, g), imgs = {};
    for (const [k, [key, w, h, o]] of Object.entries(RABBIT_ART)) { const s = sprite(T, artG, key, w, h, o); if (s) imgs[k] = s; }
    if (!Object.keys(imgs).length) return p;
    const st = { pose: 'stand', eyes: 'open', cheer: false };
    const upd = () => {
      const want = st.cheer ? 'congrats' : st.pose === 'run' ? 'run' : st.eyes === 'closed' ? 'sleep' : st.eyes === 'wide' ? 'wake' : 'stand';
      const k = imgs[want] ? want : want === 'sleep' ? null : imgs.stand ? 'stand' : null;
      Object.entries(imgs).forEach(([n, s]) => { s.style.display = n === k ? '' : 'none'; });
      root.style.display = k ? 'none' : '';
    };
    const wrapM = (name, fn) => { const o = p[name]; p[name] = (...a) => { o(...a); fn(...a); upd(); }; };
    wrapM('setEyes', k => { st.eyes = k; });
    wrapM('pose', k => { st.pose = k; st.cheer = false; });
    wrapM('ears', k => artG.setAttribute('transform', `scale(1 ${(1 + (k - 1) * .4).toFixed(3)})`)); // 쭉~: 그림을 위로 늘인다 (발끝 고정)
    p.congrats = on => { st.cheer = on; upd(); };
    p.bobEl = g;
    upd();
    return p;
  }
  /* 토끼 그림 자세: [그림, 상자 폭, 상자 높이, 옵션] — 임시 도형 토끼(키 약 208)에 맞춘 크기 */
  const RABBIT_ART = {
    stand: ['rabbit_stand', 104, 208, { flip: true }], run: ['rabbit_run', 150, 166, { dy: -6 }], wake: ['rabbit_wake', 104, 198],
    congrats: ['rabbit_congrats', 128, 202, { flip: true }], sleep: ['rabbit_sleep', 216, 123],
  };

  function drawTurtle(T, g) {
    const { el, paper } = T;
    const root = el('g', {}, g);
    paper(root, [['path', { d: 'M-58 -22 L-82 -14 L-58 -10 Z', fill: C.leaf }]]);
    const legsA = paper(root, [['ellipse', { cx: -44, cy: -10, rx: 14, ry: 12, fill: C.leaf }], ['ellipse', { cx: 30, cy: -10, rx: 14, ry: 12, fill: C.leaf }]]);
    const legsB = paper(root, [['ellipse', { cx: -26, cy: -10, rx: 14, ry: 12, fill: C.leaf }], ['ellipse', { cx: 48, cy: -10, rx: 14, ry: 12, fill: C.leaf }]]);
    const neck = paper(root, [['rect', { x: 36, y: -52, width: 38, height: 22, rx: 11, fill: C.leaf }]]);
    const headG = paper(root, [
      ['circle', { cx: 86, cy: -48, r: 24, fill: C.leaf }],
      ['circle', { cx: 95, cy: -56, r: 4.8, fill: C.ink }], ['circle', { cx: 96.5, cy: -57.5, r: 1.8, fill: '#fff' }],
      ['circle', { cx: 96, cy: -41, r: 5, fill: C.pink, opacity: .75 }],
      ['path', { d: 'M92 -38 Q100 -32 107 -39', stroke: C.ink, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }],
    ]);
    paper(root, [
      ['ellipse', { cx: 0, cy: -22, rx: 66, ry: 12, fill: '#B98F4A' }],
      ['path', { d: 'M-62 -24 Q-58 -92 0 -94 Q58 -92 62 -24 Z', fill: C.pine }],
      ['path', { d: 'M-16 -76 L16 -76 L26 -56 L16 -36 L-16 -36 L-26 -56 Z', fill: '#5E8A4A' }],
      ['path', { d: 'M-52 -30 Q-50 -60 -34 -66 L-30 -40 Z', fill: '#5E8A4A' }],
      ['path', { d: 'M52 -30 Q50 -60 34 -66 L30 -40 Z', fill: '#5E8A4A' }],
    ]);
    const medal = paper(root, [
      ['path', { d: 'M46 -50 L56 -26 L66 -50', stroke: C.persimmon, 'stroke-width': 6, fill: 'none' }],
      ['circle', { cx: 56, cy: -22, r: 13, fill: C.gold, stroke: '#b98f4a', 'stroke-width': 3 }],
      ['text', { x: 56, y: -16, 'text-anchor': 'middle', 'font-size': 16, fill: C.bean, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '1' }],
    ]);
    show(medal, 0);
    /* 그림(걷기·헤엄·메달) — 걷기·헤엄은 오른쪽을 보고, 메달은 정면. 없으면 위 임시 도형 */
    const artG = el('g', {}, g), imgs = {};
    for (const [k, [key, w, h, o]] of Object.entries(TURTLE_ART)) { const s = sprite(T, artG, key, w, h, o); if (s) imgs[k] = s; }
    const st = { swim: false, medal: false, tilt: 0, step: 0, neck: 1 };
    const upd = () => {
      const want = st.medal ? 'medal' : st.swim ? 'swim' : 'walk';
      const k = imgs[want] ? want : imgs.walk ? 'walk' : null;
      Object.entries(imgs).forEach(([n, s]) => { s.style.display = n === k ? '' : 'none'; });
      root.style.display = k ? 'none' : '';
      artG.setAttribute('transform', `rotate(${st.tilt}) translate(0 ${st.step ? -3 : 0}) scale(${(1 + (st.neck - 1) * .12).toFixed(3)} 1)`);
      show(medal, st.medal && !(k === 'medal'));
    };
    upd();
    return {
      root, medal, bobEl: g,
      step(k) { legsA.setAttribute('transform', `translate(${k ? 8 : -6} ${k ? -4 : 0})`); legsB.setAttribute('transform', `translate(${k ? -6 : 8} ${k ? 0 : -4})`); st.step = k; upd(); },
      neck(k) {
        neck.setAttribute('transform', `translate(36 0) scale(${k} 1) translate(-36 0)`);
        headG.setAttribute('transform', `translate(${38 * (k - 1)} ${-6 * (k - 1)})`);
        st.neck = k; upd();
      },
      tilt(deg) { root.setAttribute('transform', `rotate(${deg})`); st.tilt = deg; upd(); },
      swim(on) { st.swim = on; upd(); },
      wearMedal(on) { st.medal = on; upd(); },
    };
  }
  const TURTLE_ART = { walk: ['turtle_walk', 180, 123, { dx: 12 }], swim: ['turtle_swim', 190, 112, { dx: 12 }], medal: ['turtle_medal', 126, 147] }; // 임시 도형 거북이(폭 약 190)에 맞춘 크기

  /* 너구리 심판 — 그림에는 커다란 북이 함께 있다. 돌려주는 값: 그림 속 북 자리 [cx, cy, r] (발끝 기준) */
  function drawRaccoon(T, g) {
    if (sprite(T, g, 'raccoon', 230, 170)) return [52, -61, 56];
    const { paper } = T;
    paper(g, [
      ['path', { d: 'M-30 -40 Q-80 -50 -84 -100 Q-70 -80 -34 -60 Z', fill: '#7d7a76' }],
      ['rect', { x: -26, y: -24, width: 14, height: 24, rx: 5, fill: C.ink }], ['rect', { x: 12, y: -24, width: 14, height: 24, rx: 5, fill: C.ink }],
      ['ellipse', { cx: 0, cy: -60, rx: 36, ry: 42, fill: '#9a9690' }], ['ellipse', { cx: 0, cy: -52, rx: 22, ry: 28, fill: C.cream }],
      ['path', { d: 'M-24 -140 L-32 -168 L-8 -150 Z M24 -140 L32 -168 L8 -150 Z', fill: '#7d7a76' }],
      ['circle', { cx: 0, cy: -125, r: 32, fill: '#9a9690' }],
      ['path', { d: 'M-30 -130 Q0 -112 30 -130 L28 -118 Q0 -104 -28 -118 Z', fill: C.ink }],
      ['circle', { cx: -12, cy: -123, r: 4, fill: '#fff' }], ['circle', { cx: 12, cy: -123, r: 4, fill: '#fff' }],
      ['ellipse', { cx: 0, cy: -108, rx: 12, ry: 9, fill: C.cream }], ['circle', { cx: 0, cy: -111, r: 4, fill: C.ink }],
      ['rect', { x: -30, y: -100, width: 60, height: 10, fill: C.bean }], // 심판 띠
    ]);
  }

  /* ================= 관객 동물 8마리 ================= */
  const KINDS = ['duck', 'cow', 'pig', 'rooster', 'sheep', 'dog', 'cat', 'owl'];
  const SPEC = {
    duck: { name: '오리', word: '꽥꽥!', body: C.snow, arm: C.snow, leg: C.persimmon },
    cow: { name: '소', word: '음매~', body: C.snow, arm: C.snow, leg: C.ink },
    pig: { name: '돼지', word: '꿀꿀!', body: C.pink, arm: C.pink, leg: '#d98a8a' },
    rooster: { name: '닭', word: '꼬끼오!', body: C.snow, arm: C.snow, leg: C.gold },
    sheep: { name: '양', word: '매애~', body: C.cream, arm: '#4a3a30', leg: '#4a3a30' },
    dog: { name: '강아지', word: '멍멍!', body: '#C8955A', arm: '#C8955A', leg: C.bark },
    cat: { name: '고양이', word: '야옹~', body: C.amber, arm: C.amber, leg: C.amber },
    owl: { name: '부엉이', word: '부엉!', body: C.bark, arm: '#5a3d29', leg: C.gold },
  };
  const CRY = {
    duck: T => [0, .22].forEach(w => { T.tone([640, 430], .13, { type: 'sawtooth', vol: .13, when: w }); T.tone([1280, 860], .13, { type: 'square', vol: .04, when: w }); }),
    cow: T => { T.tone([165, 110], 1, { type: 'sawtooth', vol: .12 }); T.tone([330, 220], 1, { type: 'triangle', vol: .08 }); },
    pig: T => [0, .22].forEach(w => { T.tone([150, 95], .15, { type: 'square', vol: .15, when: w }); T.tone([300, 180], .15, { type: 'sawtooth', vol: .06, when: w }); }),
    rooster: T => { T.tone(520, .12, { type: 'sawtooth', vol: .11 }); T.tone(700, .12, { type: 'sawtooth', vol: .11, when: .14 }); T.tone([900, 990], .36, { type: 'sawtooth', vol: .11, when: .28 }); T.tone([990, 620], .3, { type: 'sawtooth', vol: .11, when: .64 }); },
    sheep: T => { T.tone([520, 430], .12, { type: 'sawtooth', vol: .1 }); for (let i = 0; i < 8; i++) T.tone(i % 2 ? 390 : 430, .08, { type: 'sawtooth', vol: .1, when: .1 + i * .07 }); },
    dog: T => [0, .25].forEach(w => T.tone([560, 260], .14, { type: 'square', vol: .14, when: w })),
    cat: T => { T.tone([480, 820], .25, { type: 'triangle', vol: .2 }); T.tone([820, 420], .4, { type: 'triangle', vol: .2, when: .25 }); },
    owl: T => { T.tone([420, 380], .3, { type: 'sine', vol: .25 }); T.tone([380, 330], .5, { type: 'sine', vol: .25, when: .45 }); },
  };
  const NOTES = [262, 294, 330, 392, 440, 523, 587, 659];
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const PLAY = {
    duck: T => [0, .06, .12].forEach(w => T.tone(1400 + w * 2000, .08, { type: 'triangle', vol: .1, when: w })),
    cow: T => T.tone([130, 60], .45, { type: 'sine', vol: .4 }),
    pig: T => { const n = rnd(NOTES); T.tone(n, .35, { type: 'sine', vol: .25 }); T.tone(n * 4, .08, { type: 'sine', vol: .05 }); },
    rooster: T => { const n = rnd(NOTES); T.tone(n, .18, { type: 'sawtooth', vol: .09 }); T.tone(n * 1.5, .25, { type: 'sawtooth', vol: .09, when: .18 }); },
    sheep: T => T.tone(rnd(NOTES) * 2, .7, { type: 'sine', vol: .18 }),
    dog: T => [0, .12].forEach(w => T.tone([320, 150], .09, { type: 'square', vol: .12, when: w })),
    cat: T => [1568, 1760, 2093].forEach((f, i) => T.tone(f, .15, { type: 'triangle', vol: .07, when: i * .07 })),
    owl: T => T.tone(rnd(NOTES) * 1.5, .5, { type: 'sine', vol: .22 }),
  };

  /* 잔치 악기 (임시 도형) */
  const INS = {
    duck: [['circle', { cx: 36, cy: -46, r: 16, fill: C.gold }], ['circle', { cx: 36, cy: -46, r: 10, fill: C.cream }]],
    cow: [['rect', { x: 20, y: -54, width: 38, height: 30, rx: 4, fill: C.bean }], ['ellipse', { cx: 39, cy: -54, rx: 19, ry: 6, fill: C.cream }]],
    pig: [['rect', { x: 18, y: -44, width: 8, height: 22, fill: C.persimmon }], ['rect', { x: 28, y: -42, width: 8, height: 18, fill: C.gold }], ['rect', { x: 38, y: -40, width: 8, height: 14, fill: C.leaf }], ['rect', { x: 48, y: -38, width: 8, height: 10, fill: C.lav }]],
    rooster: [['path', { d: 'M14 -64 L42 -76 L52 -90 L54 -58 L42 -66 L16 -58 Z', fill: C.gold }]],
    sheep: [['path', { d: 'M28 -30 Q28 -56 40 -58 Q52 -56 52 -30 Z', fill: C.gold }], ['circle', { cx: 40, cy: -28, r: 4, fill: C.bark }]],
    dog: [['rect', { x: 22, y: -48, width: 32, height: 20, rx: 4, fill: C.persimmon }], ['ellipse', { cx: 38, cy: -48, rx: 16, ry: 5, fill: C.cream }]],
    cat: [['path', { d: 'M34 -70 V-40', stroke: C.bean, 'stroke-width': 2 }], ['circle', { cx: 34, cy: -40, r: 7, fill: C.gold }], ['circle', { cx: 44, cy: -48, r: 6, fill: C.gold }], ['circle', { cx: 26, cy: -50, r: 6, fill: C.gold }]],
    owl: [['rect', { x: 6, y: -70, width: 50, height: 9, rx: 4, fill: C.lav, transform: 'rotate(20 6 -70)' }]],
  };
  /* 관객 그림: 손을 번쩍 든 응원 자세 한 장. 앉기/일어서기는 발끝 기준으로 살짝 키워서 (공중에 뜨지 않게) */
  function drawAnimalArt(T, g, k) {
    const { el, paper } = T;
    const legs = el('g', {}, g), up = el('g', {}, g);
    sprite(T, up, 'aud_' + k, k === 'owl' ? 150 : 118, k === 'owl' ? 108 : 118);
    const armsDown = el('g', {}, up), armsUp = el('g', {}, up), shh = el('g', {}, up);
    const bag = k === 'owl' ? el('g', {}, up) : null; // 그림 부엉이는 이미 가방을 멨다
    const instr = paper(up, INS[k], { transform: 'translate(14 4)' }); // 잔치 악기는 임시 도형 그대로 (손 옆)
    show(instr, 0);
    return { legs, up, armsDown, armsUp, shh, bag, instr, art: true };
  }
  function drawAnimal(T, g, k) {
    if (ART['aud_' + k]) return drawAnimalArt(T, g, k);
    const { el, paper } = T, s = SPEC[k];
    const legs = paper(g, [['rect', { x: -18, y: -26, width: 10, height: 26, rx: 4, fill: s.leg }], ['rect', { x: 8, y: -26, width: 10, height: 26, rx: 4, fill: s.leg }]]);
    const up = el('g', {}, g);
    const stroke = [C.snow, C.cream].includes(s.body) ? { stroke: C.line, 'stroke-width': 2 } : {};
    // 몸 뒤쪽 장식
    if (k === 'rooster') paper(up, [['ellipse', { cx: 30, cy: -58, rx: 10, ry: 24, fill: C.pine, transform: 'rotate(25 30 -58)' }], ['ellipse', { cx: -30, cy: -58, rx: 10, ry: 24, fill: C.bean, transform: 'rotate(-25 -30 -58)' }]]);
    if (k === 'cat') paper(up, [['path', { d: 'M24 -14 Q58 -20 50 -60', stroke: C.persimmon, 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }]]);
    const armsDown = paper(up, [['ellipse', { cx: -30, cy: -30, rx: 8, ry: 16, fill: s.arm, ...stroke }], ['ellipse', { cx: 30, cy: -30, rx: 8, ry: 16, fill: s.arm, ...stroke }]]);
    if (k === 'sheep') paper(up, [[-18, -40, 18], [18, -40, 18], [0, -52, 18], [0, -24, 20], [-20, -20, 14], [20, -20, 14]].map(([cx, cy, r]) => ['circle', { cx, cy, r, fill: C.cream, stroke: C.line, 'stroke-width': 2 }]));
    else paper(up, [['ellipse', { cx: 0, cy: -32, rx: 30, ry: 30, fill: s.body, ...stroke }],
      ...(k === 'owl' ? [['ellipse', { cx: 0, cy: -28, rx: 18, ry: 20, fill: '#e9d3b0' }]] : []),
      ...(k === 'cow' ? [['ellipse', { cx: -12, cy: -40, rx: 9, ry: 7, fill: C.bark }], ['ellipse', { cx: 14, cy: -22, rx: 8, ry: 6, fill: C.bark }]] : []),
      ...(k === 'dog' || k === 'cat' ? [['ellipse', { cx: 0, cy: -26, rx: 16, ry: 18, fill: C.cream }]] : []),
    ]);
    const armsUp = paper(up, [['ellipse', { cx: -34, cy: -84, rx: 8, ry: 20, fill: s.arm, transform: 'rotate(-25 -34 -84)', ...stroke }], ['ellipse', { cx: 34, cy: -84, rx: 8, ry: 20, fill: s.arm, transform: 'rotate(25 34 -84)', ...stroke }]]);
    show(armsUp, 0);
    const H = [];
    const eyes = (y = -82, dx = 10) => [['circle', { cx: -dx, cy: y, r: 3.8, fill: C.ink }], ['circle', { cx: dx, cy: y, r: 3.8, fill: C.ink }]];
    switch (k) {
      case 'duck': H.push(['circle', { cx: 0, cy: -76, r: 24, fill: C.snow, stroke: C.line, 'stroke-width': 2 }], ['ellipse', { cx: 0, cy: -67, rx: 15, ry: 6, fill: C.persimmon }], ...eyes(-82, 9)); break;
      case 'cow': H.push(['ellipse', { cx: -31, cy: -84, rx: 12, ry: 7, fill: C.bark }], ['ellipse', { cx: 31, cy: -84, rx: 12, ry: 7, fill: C.bark }],
        ['path', { d: 'M-22 -94 L-18 -112 L-10 -98 Z M22 -94 L18 -112 L10 -98 Z', fill: C.cream, stroke: C.bark, 'stroke-width': 2 }],
        ['circle', { cx: 0, cy: -78, r: 26, fill: C.snow, stroke: C.line, 'stroke-width': 2 }], ['ellipse', { cx: -10, cy: -92, rx: 8, ry: 6, fill: C.bark }],
        ['ellipse', { cx: 0, cy: -63, rx: 18, ry: 11, fill: C.pink }], ['circle', { cx: -6, cy: -63, r: 2.6, fill: C.ink }], ['circle', { cx: 6, cy: -63, r: 2.6, fill: C.ink }], ...eyes(-82, 11)); break;
      case 'pig': H.push(['path', { d: 'M-24 -92 L-20 -110 L-6 -98 Z M24 -92 L20 -110 L6 -98 Z', fill: '#d98a8a' }], ['circle', { cx: 0, cy: -78, r: 26, fill: C.pink }],
        ['ellipse', { cx: 0, cy: -69, rx: 12, ry: 9, fill: '#d98a8a' }], ['circle', { cx: -4, cy: -69, r: 2.4, fill: C.ink }], ['circle', { cx: 4, cy: -69, r: 2.4, fill: C.ink }], ...eyes(-86, 11)); break;
      case 'rooster': H.push(['circle', { cx: -8, cy: -102, r: 7, fill: C.bean }], ['circle', { cx: 0, cy: -106, r: 8, fill: C.bean }], ['circle', { cx: 8, cy: -102, r: 7, fill: C.bean }],
        ['circle', { cx: 0, cy: -78, r: 24, fill: C.snow, stroke: C.line, 'stroke-width': 2 }], ['ellipse', { cx: 0, cy: -60, rx: 5, ry: 8, fill: C.bean }],
        ['path', { d: 'M-7 -76 L0 -64 L7 -76 Z', fill: C.gold }], ...eyes(-84, 9)); break;
      case 'sheep': H.push(['ellipse', { cx: -23, cy: -80, rx: 10, ry: 5, fill: '#4a3a30' }], ['ellipse', { cx: 23, cy: -80, rx: 10, ry: 5, fill: '#4a3a30' }],
        ['ellipse', { cx: 0, cy: -74, rx: 16, ry: 21, fill: '#4a3a30' }],
        ['circle', { cx: -13, cy: -95, r: 11, fill: C.cream }], ['circle', { cx: 0, cy: -100, r: 12, fill: C.cream }], ['circle', { cx: 13, cy: -95, r: 11, fill: C.cream }],
        ['circle', { cx: -6, cy: -78, r: 3.6, fill: '#fff' }], ['circle', { cx: 6, cy: -78, r: 3.6, fill: '#fff' }], ['circle', { cx: -6, cy: -77, r: 1.8, fill: C.ink }], ['circle', { cx: 6, cy: -77, r: 1.8, fill: C.ink }]); break;
      case 'dog': H.push(['circle', { cx: 0, cy: -78, r: 25, fill: '#C8955A' }],
        ['ellipse', { cx: -25, cy: -74, rx: 9, ry: 20, fill: C.bark, transform: 'rotate(15 -25 -74)' }], ['ellipse', { cx: 25, cy: -74, rx: 9, ry: 20, fill: C.bark, transform: 'rotate(-15 25 -74)' }],
        ['ellipse', { cx: 0, cy: -66, rx: 13, ry: 10, fill: C.cream }], ['ellipse', { cx: 0, cy: -71, rx: 5, ry: 4, fill: C.ink }], ...eyes(-84, 10)); break;
      case 'cat': H.push(['path', { d: 'M-24 -88 L-20 -112 L-4 -98 Z M24 -88 L20 -112 L4 -98 Z', fill: C.amber }], ['circle', { cx: 0, cy: -78, r: 25, fill: C.amber }],
        ['path', { d: 'M-6 -100 V-92 M0 -102 V-92 M6 -100 V-92', stroke: C.persimmon, 'stroke-width': 3 }],
        ['path', { d: 'M-4 -71 L4 -71 L0 -66 Z', fill: C.bean }],
        ['path', { d: 'M-8 -68 L-30 -72 M-8 -64 L-30 -62 M8 -68 L30 -72 M8 -64 L30 -62', stroke: C.ink, 'stroke-width': 1.5 }],
        ['ellipse', { cx: -10, cy: -82, rx: 3, ry: 5, fill: C.ink }], ['ellipse', { cx: 10, cy: -82, rx: 3, ry: 5, fill: C.ink }]); break;
      case 'owl': H.push(['path', { d: 'M-24 -90 L-18 -112 L-8 -98 Z M24 -90 L18 -112 L8 -98 Z', fill: C.bark }], ['circle', { cx: 0, cy: -78, r: 26, fill: C.bark }],
        ['circle', { cx: -11, cy: -80, r: 12, fill: '#e9d3b0' }], ['circle', { cx: 11, cy: -80, r: 12, fill: '#e9d3b0' }],
        ['circle', { cx: -11, cy: -80, r: 7, fill: '#fff' }], ['circle', { cx: 11, cy: -80, r: 7, fill: '#fff' }],
        ['circle', { cx: -11, cy: -80, r: 3.6, fill: C.ink }], ['circle', { cx: 11, cy: -80, r: 3.6, fill: C.ink }],
        ['path', { d: 'M-4 -70 L0 -61 L4 -70 Z', fill: C.gold }]); break;
    }
    paper(up, H);
    const shh = paper(up, [['ellipse', { cx: 18, cy: -50, rx: 7, ry: 17, fill: s.arm, transform: 'rotate(-40 18 -50)', ...stroke }], ['rect', { x: -2, y: -72, width: 6, height: 16, rx: 3, fill: C.cream, stroke: C.line }]]);
    show(shh, 0);
    const bag = k === 'owl' ? paper(up, [['path', { d: 'M-24 -60 L24 -20', stroke: C.bark, 'stroke-width': 4 }], ['rect', { x: 8, y: -30, width: 32, height: 24, rx: 5, fill: C.persimmon }], ['rect', { x: 12, y: -38, width: 22, height: 12, fill: C.cream }]]) : null;
    if (bag) show(bag, 0);
    const instr = paper(up, INS[k]);
    show(instr, 0);
    show(legs, 0);
    return { legs, up, armsDown, armsUp, shh, bag, instr };
  }

  function makeAudience(T) {
    const A = {};
    KINDS.forEach(k => {
      let parts;
      const a = T.actor(null, 0, 0, g => { parts = drawAnimal(T, g, k); });
      Object.assign(a, { kind: k, parts, name: SPEC[k].name, word: SPEC[k].word, cheering: false });
      a.stand = () => { parts.up.setAttribute('transform', parts.art ? 'scale(1.12)' : 'translate(0 -22)'); show(parts.legs, 1); show(parts.armsDown, 0); show(parts.armsUp, 1); show(parts.shh, 0); };
      a.sit = () => { parts.up.setAttribute('transform', ''); show(parts.legs, 0); show(parts.armsDown, 1); show(parts.armsUp, 0); };
      a.hush = on => { show(parts.shh, on); show(parts.armsDown, !on); show(parts.armsUp, 0); if (on) T.pop(a.x, a.y - 140 * a.scale, '쉿!', C.indigo); };
      a.cry = () => AudioFX.animal(k) || CRY[k](T); // 실제 녹음 우선, 없으면 합성음
      a.cheer = async (word, keep) => {
        if (a.cheering) return; a.cheering = true;
        a.stand(); a.cry(); a.hop(14, 320);
        if (word !== '') T.pop(a.x, a.y - 150 * a.scale, word || a.word, C.bean);
        await T.sleep(1100);
        if (!keep) a.sit();
        a.cheering = false;
      };
      a.reset = () => { a.sit(); show(parts.shh, 0); show(parts.instr, 0); if (parts.bag) show(parts.bag, 0); a.face('left'); a.cheering = false; };
      // 언제든 톡: 이야기 중에도 일어나 울음소리 (조작 대기 중인 대상이면 엔진에 맡긴다)
      a.pos.classList.add('tap-target');
      a.pos.addEventListener('pointerdown', e => { if (a.pos.classList.contains('armed')) return; e.stopPropagation(); a.cheer(); });
      a.reset();
      A[k] = a;
    });
    return A;
  }

  /* ================= 효과 ================= */
  function speedLines(T, n = 12, dur = 520) {
    for (let i = 0; i < n; i++) {
      const y = 60 + Math.random() * 440, w = 160 + Math.random() * 260;
      const r = T.el('rect', { x: 0, y, width: w, height: 4 + Math.random() * 6, rx: 3, fill: C.snow, opacity: .85 }, T.fx);
      r.animate([{ transform: 'translateX(1100px)' }, { transform: `translateX(${-w - 100}px)` }], { duration: dur + Math.random() * 200, delay: Math.random() * 150, easing: 'linear', fill: 'both' })
        .finished.then(() => r.remove());
    }
  }
  function puff(T, x, y) {
    for (let i = 0; i < 5; i++) {
      const c = T.el('circle', { cx: x, cy: y, r: 10 + Math.random() * 10, fill: C.dirt, opacity: .9 }, T.fx);
      c.animate([{ transform: 'translate(0,0)', opacity: .9 }, { transform: `translate(${-40 - Math.random() * 60}px,${-10 - Math.random() * 30}px)`, opacity: 0 }], { duration: 600, fill: 'forwards' }).finished.then(() => c.remove());
    }
  }
  function floatText(T, x, y, text, color = C.indigo, size = 40) {
    const t = T.el('text', { x, y, 'font-size': size, fill: color, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", stroke: '#fff', 'stroke-width': 5, 'paint-order': 'stroke', text }, T.fx);
    t.animate([{ transform: 'translate(0,0)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'translate(30px,-90px)', opacity: 0 }], { duration: 2000, fill: 'forwards' }).finished.then(() => t.remove());
  }
  function noteShape(T, x, y, color = C.bean) {
    const g = T.el('g', {}, T.fx);
    T.el('ellipse', { cx: x, cy: y, rx: 9, ry: 7, fill: color, transform: `rotate(-20 ${x} ${y})` }, g);
    T.el('path', { d: `M${x + 8} ${y - 2} V${y - 34} Q${x + 18} ${y - 26} ${x + 22} ${y - 18}`, stroke: color, 'stroke-width': 4, fill: 'none' }, g);
    g.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${-20 + Math.random() * 40}px,-80px)`, opacity: 0 }], { duration: 1500, fill: 'forwards' }).finished.then(() => g.remove());
  }
  /* 꾹 누르기 (로컬 도우미): 엔진 hold는 짧게 톡톡 누르면 거의 진행되지 않고, 톡이 계속되면 20초 자동 마무리도 미뤄진다.
     그래서 mash(한 번 누를 때마다 한 칸, 20초 자동 마무리)를 바탕으로, 누르고 있는 동안에는 0.11초마다 한 칸씩 더 나아가게 한다. */
  async function holdOn(T, target, { count = 14, onProgress, prompt } = {}) {
    let holding = false, synth = false, h = null;
    const down = () => { if (synth) return; holding = true; clearInterval(h);
      h = setInterval(() => { if (!holding) return; synth = true; target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); synth = false; }, 110); };
    const up = () => { holding = false; clearInterval(h); };
    target.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    try { await T.mash(target, { count, prompt, onStep: i => onProgress && onProgress(i / count) }); }
    finally { up(); target.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); }
  }
  const footstep = T => T.tone([120, 80], .14, { type: 'sine', vol: .3 });
  const snore = (T, k) => T.tone(k ? [140, 210] : [210, 130], .7, { type: 'sine', vol: .07 });

  /* ================= 경주 지도 막대 (화면 고정, 카메라 영향 없음) ================= */
  function iconRabbit(T, g) {
    T.paper(g, [['ellipse', { cx: -5, cy: -14, rx: 4, ry: 11, fill: C.snow, stroke: C.line }], ['ellipse', { cx: 5, cy: -14, rx: 4, ry: 11, fill: C.snow, stroke: C.line }],
      ['circle', { cx: 0, cy: 2, r: 11, fill: C.snow, stroke: C.line, 'stroke-width': 2 }], ['circle', { cx: 4, cy: 0, r: 2.2, fill: C.ink }], ['circle', { cx: 10, cy: 4, r: 2, fill: C.pink }]]);
  }
  function iconTurtle(T, g) {
    T.paper(g, [['circle', { cx: 16, cy: 2, r: 6, fill: C.leaf }], ['path', { d: 'M-15 7 Q-15 -11 0 -11 Q15 -11 15 7 Z', fill: C.pine }], ['circle', { cx: 18, cy: 0, r: 1.6, fill: C.ink }]]);
  }
  function makeBar(T) {
    document.getElementById('raceBar')?.remove();
    const ui = document.getElementById('stage');
    const g = T.el('g', { id: 'raceBar', 'pointer-events': 'none' }, ui);
    g.style.transition = 'opacity .5s'; g.style.opacity = 0;
    T.paper(g, [['rect', { x: 196, y: 484, width: 608, height: 62, rx: 18, fill: C.cream, stroke: C.gold, 'stroke-width': 4 }]]);
    const X0 = 250, X1 = 750, Y = [502, 529];
    Y.forEach(y => T.el('line', { x1: X0, x2: X1, y1: y, y2: y, stroke: '#e1cfa6', 'stroke-width': 7, 'stroke-linecap': 'round' }, g));
    T.el('rect', { x: X0 - 22, y: 490, width: 5, height: 48, fill: C.bark }, g);
    T.el('path', { d: `M${X0 - 17} 490 L${X0} 497 L${X0 - 17} 504 Z`, fill: C.leaf }, g);
    T.el('rect', { x: X1 + 18, y: 488, width: 5, height: 52, fill: C.bark }, g);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) T.el('rect', { x: X1 + 23 + c * 8, y: 488 + r * 8, width: 8, height: 8, fill: (r + c) % 2 ? C.snow : C.ink }, g);
    const mk = (draw, y) => { const o = T.el('g', {}, g); o.style.transform = `translate(${X0}px,${y}px)`; const inner = T.el('g', {}, o); draw(T, inner); return { o, inner, y }; };
    const rb = mk(iconRabbit, Y[0]), tb = mk(iconTurtle, Y[1]);
    const place = (ic, p, dur) => { ic.o.style.transition = `transform ${dur}ms ease-out`; ic.o.style.transform = `translate(${X0 + (X1 - X0) * p}px,${ic.y}px)`; };
    return {
      show(on) {
        // 세로 화면은 양옆이 잘리니, 보이는 폭 안에 들어오게 막대를 줄인다 (가로는 그대로)
        const k = Math.min(1, (T.viewWidth() - 20) / 620);
        if (k < 1) g.setAttribute('transform', `translate(500 546) scale(${k.toFixed(3)}) translate(-500 -546)`); else g.removeAttribute('transform');
        g.style.opacity = on ? 1 : 0;
      },
      set(r, t, dur = 700) { if (r != null) place(rb, r, dur); if (t != null) place(tb, t, dur); },
      pulse(which) { (which === 'r' ? rb : tb).inner.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.7)' }, { transform: 'scale(1)' }], { duration: 700, iterations: 3 }); },
      remove() { g.remove(); },
    };
  }

  /* ================= 배경 ================= */
  function sky(T, color = C.sky) { T.el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: color }, T.bg); }
  function tree(T, parent, x, y, s = 1, col = C.pine) {
    T.paper(parent, [['rect', { x: x - 12 * s, y: y - 90 * s, width: 24 * s, height: 90 * s, fill: C.bark }],
      ['circle', { cx: x, cy: y - 120 * s, r: 52 * s, fill: col }], ['circle', { cx: x - 36 * s, cy: y - 92 * s, r: 34 * s, fill: col }], ['circle', { cx: x + 38 * s, cy: y - 94 * s, r: 34 * s, fill: col }]]);
  }
  function house(T, parent, x, gy, roof, wall) {
    const g = T.el('g', {}, parent);
    T.paper(g, [['rect', { x: x - 90, y: gy - 150, width: 180, height: 150, fill: wall }],
      ['path', { d: `M${x - 112} ${gy - 142} L${x} ${gy - 238} L${x + 112} ${gy - 142} Z`, fill: roof }],
      ['rect', { x: x + 44, y: gy - 124, width: 32, height: 32, fill: C.amber, stroke: C.bark, 'stroke-width': 4 }]]);
    T.el('rect', { x: x - 42, y: gy - 124, width: 84, height: 124, rx: 12, fill: C.ink }, g);
    const door = T.paper(g, [['rect', { x: x - 42, y: gy - 124, width: 84, height: 124, rx: 12, fill: C.bark }], ['circle', { cx: x + 26, cy: gy - 60, r: 6, fill: C.gold }],
      ['rect', { x: x - 30, y: gy - 110, width: 60, height: 40, rx: 6, fill: '#5a3d29' }]]);
    return { g, door, x };
  }
  function villageBG(T) {
    if (artBG(T, 'bg_village')) return;
    sky(T);
    T.el('circle', { cx: 880, cy: 110, r: 46, fill: '#F6D98A' }, T.bg);
    T.paper(T.bg, [['path', { d: 'M-200 330 Q150 220 420 300 Q700 210 1200 310 V600 H-200 Z', fill: '#b9a25a' }]]);
    T.paper(T.bg, [['rect', { x: -200, y: 380, width: 1400, height: 400, fill: C.grass }]]);
    T.paper(T.bg, [['path', { d: 'M-200 520 Q300 440 520 470 Q800 500 1200 440 V480 Q800 540 520 510 Q300 480 -200 560 Z', fill: C.dirt }]]);
    house(T, T.bg, 120, 400, C.bean, C.cream); house(T, T.bg, 870, 400, C.pine, '#efe0bd');
    tree(T, T.bg, 330, 390, .9); tree(T, T.bg, 640, 385, .8, C.leaf);
  }
  function standsBG(T) {
    if (artBG(T, 'bg_stands')) return;
    sky(T);
    T.paper(T.bg, [['path', { d: 'M-200 240 Q300 170 600 230 Q850 180 1200 220 V600 H-200 Z', fill: '#a9b56a' }]]);
    [80, 260, 740, 930].forEach((x, i) => tree(T, T.bg, x, 240, .8, i % 2 ? C.leaf : C.pine));
    T.paper(T.bg, [['rect', { x: -200, y: 250, width: 1400, height: 400, fill: C.grass }]]);
    // 깃발 줄
    T.el('path', { d: 'M-20 110 Q500 190 1020 110', stroke: C.bark, 'stroke-width': 3, fill: 'none' }, T.bg);
    for (let i = 0; i < 14; i++) { const x = 20 + i * 72, y = 110 + Math.sin(i / 13 * Math.PI) * 58; T.el('path', { d: `M${x - 14} ${y} L${x + 14} ${y} L${x} ${y + 26} Z`, fill: [C.persimmon, C.gold, C.lav, C.leaf][i % 4] }, T.bg); }
    // 관객석 (나무 의자 두 줄)
    [[330, 190], [480, 50]].forEach(([y]) => T.paper(T.bg, [['rect', { x: 40, y, width: 920, height: 18, rx: 6, fill: '#a57b4f' }], ['rect', { x: 40, y: y + 18, width: 920, height: 14, fill: C.bark }],
      ...[80, 320, 560, 800].map(x => ['rect', { x: x + 30, y: y + 32, width: 16, height: 60, fill: C.bark }])]));
  }
  function startBG(T) {
    if (artBG(T, 'bg_start')) return;
    sky(T);
    T.paper(T.bg, [['path', { d: 'M-200 260 Q300 200 600 250 Q850 210 1200 240 V600 H-200 Z', fill: '#a9b56a' }]]);
    [60, 950].forEach(x => tree(T, T.bg, x, 300, .9));
    T.paper(T.bg, [['rect', { x: 120, y: 300, width: 760, height: 20, rx: 6, fill: '#a57b4f' }], ['rect', { x: 120, y: 318, width: 760, height: 14, fill: C.bark }]]);
    T.paper(T.bg, [['rect', { x: -200, y: 340, width: 1400, height: 400, fill: C.grass }], ['rect', { x: -200, y: 420, width: 1400, height: 110, fill: C.dirt }]]);
    [440, 485].forEach(y => T.el('rect', { x: -200, y, width: 1400, height: 4, fill: C.cream, opacity: .8 }, T.bg));
    T.paper(T.bg, [['rect', { x: 150, y: 170, width: 14, height: 300, fill: C.bark }], ['rect', { x: 836, y: 170, width: 14, height: 300, fill: C.bark }],
      ['rect', { x: 140, y: 176, width: 720, height: 50, rx: 10, fill: C.bean }], ['rect', { x: 430, y: 182, width: 140, height: 38, rx: 8, fill: C.cream }],
      ['text', { x: 500, y: 212, 'text-anchor': 'middle', 'font-size': 30, fill: C.bean, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '출발' }]]);
  }

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, paper, sleep, say, actor, camTo, camSnap, camWide } = T;
    const wrap = T.root.querySelector('#stageWrap');
    stopLoops();
    const bar = makeBar(T);
    const aud = makeAudience(T);
    const race = { r: 0, t: 0 };
    const setRace = (r, t, dur) => { if (r != null) race.r = r; if (t != null) race.t = t; bar.set(r, t, dur); };

    let rp, tp;
    const rabbit = actor(null, 0, 0, g => { rp = drawRabbit(T, g); });
    const turtle = actor(null, 0, 0, g => { tp = drawTurtle(T, g); });
    const faceL = a => a.face('right'), faceR = a => a.face('left'); // 그림이 오른쪽을 보고 있어서 뒤집힌 이름
    /* 대사 연출: 목소리 주인에게 카메라가 가고 서로 마주 본다.
       토끼·거북이 그림은 오른쪽을 보고 있으니, 연출에는 face 방향을 뒤집어 넘긴다 */
    const mirror = a => new Proxy(a, { get: (o, k) => (k === 'face' ? d => o.face(d === 'right' ? 'left' : 'right') : o[k]) });
    T.director({
      cast: { rabbit: mirror(rabbit), turtle: mirror(turtle), duck: aud.duck, cow: aud.cow, pig: aud.pig, dog: aud.dog, sheep: aud.sheep },
      listener: r => (r === 'rabbit' ? 'turtle' : r === 'turtle' ? 'rabbit' : null),
      noFace: ['duck', 'cow', 'pig', 'dog', 'sheep'],
    });
    const vo = k => typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k] && AudioFX.voice(VOICE_LINES[k]); // 말풍선 없는 소리 대사
    const put = (a, x, y, s = a.scale, parent = T.world) => { parent.appendChild(a.pos); a.setScale(s); a.place(x, y); return a; };
    const seat = list => list.forEach(([k, x, y, s]) => { const a = aud[k]; a.reset(); put(a, x, y, s); });
    const rabbitReset = () => { rp.pose('stand'); rp.setEyes('open'); rp.mouth('smile'); rp.sleepy(false); rp.ears(1); faceR(rabbit); };
    const turtleReset = () => { tp.step(0); tp.neck(1); tp.tilt(0); tp.swim(false); faceR(turtle); };
    const walk = (ms, gap = 260) => { let k = 0; const h = setInterval(() => { tp.step(k++ % 2); footstep(T); }, gap); setTimeout(() => { clearInterval(h); tp.step(0); }, ms); };
    const scene = (label, fn) => T.sceneCard(label, () => { stopLoops(); T.clear(); camSnap(500, 280, 1); fn(); });
    /* 세로 화면(양옆이 잘림)용: 카메라가 x를 따라가고, 넓게 벌려 선 자리는 가운데로 모은다. 가로 화면에서는 아무 일도 안 한다 */
    const follow = (x, dur = 500) => T.portrait() ? camTo(x, 280, 1, dur) : Promise.resolve();
    const PX = (x, k) => T.portrait() ? Math.round(500 + (x - 500) * k) : x;
    const fitZ = half => T.portrait() ? Math.min(1, T.viewWidth() / 2 / half) : 1;

    /* ===== 1막 — 경주를 열자 ===== */
    /* --- 1. 숲속 마을 아침 --- */
    villageBG(T);
    const gy1 = ART.bg_village ? 500 : 470; // 그림 마을: 앞쪽 풀밭 길
    turtleReset(); rabbitReset();
    put(turtle, PX(200, .7), gy1, 1.25);
    put(rabbit, T.portrait() ? 1060 : 1150, gy1, 1);
    await T.curtain(true);
    walk(2600);
    turtle.move(T.portrait() ? 400 : 330, gy1, 2600, 'linear');
    await say('숲속 마을에 아침이 왔어요.');
    await say('거북이가 엉금엉금 산책해요. 거북이를 톡!');
    await T.tap(turtle.pos, { prompt: '거북이를 톡 눌러 봐요!' });
    turtle.hop(16, 400);
    await tween(300, t => tp.neck(1 + t * .6)); // 인사는 거북이 목소리로 (겹치던 합성음 뺌)
    await say('"안녕! 나는 거북이야."');
    tp.neck(1);
    faceL(rabbit);
    for (let i = 0; i < 3; i++) { AudioFX.boing(); rabbit.hop(60, 380); await rabbit.move(rabbit.x - 150, gy1, 380); }
    await say('깡충깡충 토끼도 왔어요. 토끼를 톡!');
    await T.tap(rabbit.pos, { prompt: '토끼를 톡 눌러 봐요!' });
    AudioFX.boing(); rabbit.hop(50, 400);
    await say('"안녕! 나는 깡충 토끼야!"');
    rabbit.hop(30, 300);
    await say('토끼가 말했어요. "느림보야, 나랑 달리기 할래?"');
    turtle.hop(12, 300);
    await say('거북이가 방긋 웃었어요. "좋아!"');
    await say('"숲속 친구들한테 응원해 달라고 하자!"');

    /* --- 2. 초대장 돌리기 --- */
    let houses;
    const owl = aud.owl;
    await scene('초대장 돌리기', () => {
      if (artBG(T, 'bg_alley')) {
        // 그림 속 동그란 문 네 개: 문 뒤 어두운 구멍 + 문 조각(같은 그림을 오려 겹침) = 톡 대상
        houses = [[213, 283], [408, 283], [603, 283], [795, 283]].map(([x, y]) => {
          T.el('circle', { cx: x, cy: y, r: 27, fill: C.ink }, T.bg);
          const door = artPiece(T, 'bg_alley', ['circle', { cx: x, cy: y, r: 29 }], T.bg);
          return { g: door, door, x, hinge: x - 29, ay: 372, ky: 250 };
        });
      } else {
        sky(T);
        T.paper(T.bg, [['rect', { x: -200, y: 470, width: 1400, height: 300, fill: C.dirt }], ['rect', { x: -200, y: 520, width: 1400, height: 300, fill: C.grass }]]);
        houses = [[130, C.bean, C.cream], [375, C.pine, '#efe0bd'], [625, C.lav, C.snow], [870, C.persimmon, '#efe0bd']].map(([x, r, w]) => house(T, T.bg, x, 470, r, w));
      }
      owl.reset(); owl.stand(); show(owl.parts.bag, 1);
      put(owl, -80, ART.bg_alley ? 250 : 340, .85);
    });
    await say('부엉이 우체부가 초대장을 가져왔어요.');
    const guests = ['duck', 'cow', 'pig', 'dog'];
    for (let i = 0; i < 4; i++) {
      const h = houses[i], k = guests[i], a = aud[k];
      camTo(h.x, h.ay ? 300 : 350, 1.6, 900);
      await owl.move(h.x - 120, h.ay ? 250 : 340, 900);
      await say(i === 0 ? '문을 톡 두드려 봐요. 누가 나올까?' : '이번 집도 문을 톡!');
      await T.tap(h.door, { prompt: '문을 톡 두드려 봐요!' });
      if (!AudioFX.sfx('knock')) { T.tone([200, 130], .08, { type: 'square', vol: .25 }); T.tone([200, 130], .08, { type: 'square', vol: .25, when: .2 }); }
      else setTimeout(() => AudioFX.sfx('knock'), 220);
      T.pop(h.x, h.ky || 380, '똑똑!', C.bark);
      await sleep(700);
      a.cry(); T.anim(h.g, [{ translate: '0 0' }, { translate: '-4px 0' }, { translate: '4px 0' }, { translate: '0 0' }], 400);
      await say(`"${a.word}" 누구 목소리일까요?`);
      await sleep(900);
      AudioFX.pop();
      const hg = h.hinge ?? h.x - 42;
      await tween(400, t => h.door.setAttribute('transform', `translate(${hg} 0) scale(${1 - .8 * t} 1) translate(${-hg} 0)`));
      a.reset(); put(a, h.x, h.ay || 474, h.ay ? .95 : 1);
      a.cheer();
      await say(`${T.josa(a.name, '이었어요/였어요')}!`);
      const env = paper(T.fx, [['rect', { x: -22, y: -15, width: 44, height: 30, rx: 3, fill: C.cream, stroke: C.bark, 'stroke-width': 2 }], ['path', { d: 'M-22 -15 L0 3 L22 -15', stroke: C.bean, 'stroke-width': 3, fill: 'none' }]]);
      await T.anim(env, [{ transform: `translate(${owl.x}px,${owl.y - 60}px)` }, { transform: `translate(${a.x + 30}px,${a.y - 60}px) rotate(360deg)` }], 700);
      AudioFX.ding(); env.remove();
    }
    await camWide(900);
    await say('닭이랑 양이랑 고양이도 초대장을 받았어요!');

    /* --- 3. 관객석 모이기 --- */
    const SEATS = (ART.bg_stands // 그림 관객석: 뒷줄은 긴 의자 위, 앞줄은 앞마당
      ? [['rooster', 165, 332, .95], ['sheep', 315, 332, .95], ['cat', 680, 332, .95], ['owl', 830, 332, .95],
        ['duck', 170, 505, 1.2], ['cow', 390, 505, 1.2], ['pig', 610, 505, 1.2], ['dog', 830, 505, 1.2]]
      : [['rooster', 200, 330, 1.05], ['sheep', 400, 330, 1.05], ['cat', 600, 330, 1.05], ['owl', 800, 330, 1.05],
        ['duck', 170, 480, 1.3], ['cow', 390, 480, 1.3], ['pig', 610, 480, 1.3], ['dog', 830, 480, 1.3]]).map(([k, x, y, s]) => [k, PX(x, .72), y, s]);
    await scene('응원석', () => {
      standsBG(T);
      seat(SEATS.map(([k, x, y, s], i) => [k, i % 2 ? 1150 : -150, y, s]));
      camSnap(500, 280, fitZ(330 * .72 + 80));
    });
    await Promise.all(SEATS.map(async ([k, x, y], i) => { await sleep(i * 180); aud[k].hop(20, 400); await aud[k].move(x, y, 1100); }));
    await say('동물 친구들이 응원하러 모였어요!');
    await say('친구들을 톡 눌러 봐요! 벌떡 일어나 인사해요.');
    await T.free(KINDS.map(k => ({ el: aud[k].pos, onTap: () => aud[k].cheer() })), 15000);
    await say('와, 신나는 응원 소리!');

    /* --- 4. 준비 운동 --- */
    await scene('준비 운동', () => {
      startBG(T);
      seat(ART.bg_start ? [['pig', 150, 405, .55], ['sheep', 245, 405, .55], ['cat', 830, 405, .55]] // 그림: 양옆 덤불 앞
        : [['pig', 260, 318, .55], ['sheep', 420, 318, .55], ['cat', 740, 318, .55]]);
      rabbitReset(); turtleReset();
      put(rabbit, 370, ART.bg_start ? 490 : 478, 1); put(turtle, 560, ART.bg_start ? 492 : 480, 1.3);
    });
    await say('달리기 전에 준비 운동을 해요.');
    const stretchR = async () => { AudioFX.boing(); rabbit.hop(20, 400); await tween(300, t => rp.ears(1 + .35 * t)); T.pop(rabbit.x, 250, '쭉!', C.persimmon); await sleep(500); await tween(300, t => rp.ears(1.35 - .35 * t)); };
    const stretchT = async () => { T.tone([180, 700], .5, { type: 'triangle', vol: .2 }); await tween(500, t => tp.neck(1 + 2.4 * easeOut(t))); T.pop(turtle.x + 200, 340, '쭈욱~', C.pine); await sleep(700); AudioFX.boing(); await tween(300, t => tp.neck(3.4 - 2.4 * t)); };
    for (let i = 0; i < 2; i++) {
      await say(i ? '한 번 더! 토끼를 톡!' : '토끼를 톡! 귀를 쭉~');
      await T.tap(rabbit.pos, { prompt: '토끼를 톡 눌러 봐요!' });
      await stretchR();
      await say(i ? '거북이도 톡!' : '이번엔 거북이를 톡! 목을 쭉~');
      await T.tap(turtle.pos, { prompt: '거북이를 톡 눌러 봐요!' });
      await stretchT();
      if (!i) { aud.pig.cheer('하하!'); vo('laugh_pig'); await say('와, 거북이 목이 쭈욱~ 길어졌어요!'); }
    }

    /* --- 5. 요이~ 땅! --- */
    let drum, drumAt = [730, 300];
    await scene('요이~ 땅!', () => {
      startBG(T);
      seat(ART.bg_start ? [['duck', 120, 405, .55], ['cow', 215, 405, .55], ['dog', 870, 405, .55], ['rooster', 950, 405, .55]]
        : [['duck', 220, 318, .55], ['cow', 380, 318, .55], ['dog', 620, 318, .55], ['rooster', 780, 318, .55]]);
      rabbitReset(); turtleReset();
      put(rabbit, 230, ART.bg_start ? 488 : 470, .95); put(turtle, 440, ART.bg_start ? 490 : 472, 1.2);
      let dr = null;
      const racc = actor(T.world, ART.raccoon ? 745 : 900, ART.raccoon ? 492 : 474, g => { dr = drawRaccoon(T, g); }, { scale: ART.raccoon ? 1 : .95 });
      if (dr) { // 그림 속 북만 오려 겹친 조각이 톡 대상 (반짝임이 북에 생긴다)
        const [cx, cy, r] = [racc.x + dr[0], racc.y + dr[1], dr[2]], id = 'drumClip';
        drum = el('g', {}, T.world); drumAt = [cx, cy - r - 20];
        el('circle', { cx, cy, r }, el('clipPath', { id }, el('defs', {}, drum)));
        sprite(T, el('g', { transform: `translate(${racc.x} ${racc.y})` }, el('g', { 'clip-path': `url(#${id})` }, drum)), 'raccoon', 230, 170);
      } else drum = paper(T.world, [['rect', { x: 668, y: 470, width: 10, height: 10, fill: C.bark }], ['rect', { x: 782, y: 470, width: 10, height: 10, fill: C.bark }],
        ['rect', { x: 660, y: 360, width: 140, height: 112, rx: 12, fill: C.bean }], ['path', { d: 'M660 400 L683 440 L706 400 L729 440 L752 400 L775 440 L800 400', stroke: C.gold, 'stroke-width': 5, fill: 'none' }],
        ['ellipse', { cx: 730, cy: 360, rx: 70, ry: 18, fill: C.cream, stroke: C.bark, 'stroke-width': 3 }]]);
    });
    await say('너구리 심판이 커다란 북을 가져왔어요.');
    await say('준비~ 북을 톡 치면 출발해요!');
    await T.tap(drum, { prompt: '큰 북을 톡 쳐 봐요!' });
    AudioFX.boom(); T.shake(); T.pop(...drumAt, '땅!', C.bean);
    ['duck', 'cow', 'dog', 'rooster'].forEach((k, i) => setTimeout(() => aud[k].cheer(null, true), i * 150));
    rp.pose('run'); AudioFX.whoosh(); speedLines(T, 14, 450); puff(T, rabbit.x - 30, 460);
    camTo(360, 330, 1.12, 250);
    walk(700);
    await Promise.all([rabbit.move(1250, rabbit.y, 450, 'ease-in'), turtle.move(470, turtle.y, 700)]);
    await camWide(400);
    await say('토끼는 쌩~ 거북이는 엉금 한 발!');
    ['duck', 'cow', 'dog', 'rooster'].forEach(k => aud[k].sit());

    // 경주 지도 (내려다보기)
    const PATH = ART.bg_map // 그림 지도 속 점선 길 (출발 깃발 → 돌멩이 → 개울 → 언덕 → 큰 나무 → 결승 깃발)
      ? [[150, 257], [240, 262], [300, 285], [380, 287], [450, 264], [520, 256], [600, 272], [700, 270], [780, 266], [845, 270]]
      : [[110, 450], [250, 400], [390, 430], [520, 330], [640, 280], [760, 330], [870, 230], [910, 150]];
    const segL = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
    const total = segL.reduce((a, b) => a + b, 0);
    const at = f => { let d = f * total; for (let i = 0; i < segL.length; i++) { if (d <= segL[i]) { const u = d / segL[i]; return [PATH[i][0] + (PATH[i + 1][0] - PATH[i][0]) * u, PATH[i][1] + (PATH[i + 1][1] - PATH[i][1]) * u]; } d -= segL[i]; } return PATH[PATH.length - 1]; };
    let tokR, tokT;
    await scene('경주 지도', () => {
      if (!artBG(T, 'bg_map')) {
      sky(T, '#e9d3a8');
      paper(T.bg, [['rect', { x: 60, y: 60, width: 880, height: 440, rx: 20, fill: C.cream, stroke: C.gold, 'stroke-width': 6 }]]);
      T.el('path', { d: 'M' + PATH.map(p => p.join(' ')).join(' L'), stroke: C.dirt, 'stroke-width': 30, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, T.bg);
      T.el('path', { d: 'M' + PATH.map(p => p.join(' ')).join(' L'), stroke: C.cream, 'stroke-width': 3, 'stroke-dasharray': '10 10', fill: 'none' }, T.bg);
      paper(T.bg, [['path', { d: 'M230 385 Q250 355 275 375 Q285 395 230 395 Z', fill: '#9a948a' }]]); // 돌멩이
      paper(T.bg, [['path', { d: 'M300 470 Q380 410 360 380 Q440 420 470 350 L500 360 Q470 440 400 470 Z', fill: '#8BA4C9' }]]); // 개울
      paper(T.bg, [['ellipse', { cx: 640, cy: 300, rx: 110, ry: 60, fill: C.leaf }]]); tree(T, T.bg, 660, 270, .45); // 언덕과 나무
      paper(T.bg, [['rect', { x: 906, y: 90, width: 6, height: 70, fill: C.bark }], ['rect', { x: 912, y: 90, width: 40, height: 26, fill: C.bean }]]);
      paper(T.bg, [['rect', { x: 100, y: 410, width: 6, height: 50, fill: C.bark }], ['rect', { x: 106, y: 410, width: 30, height: 20, fill: C.leaf }]]);
      }
      tokR = el('g', {}, T.world); iconRabbit(T, tokR); tokT = el('g', {}, T.world); iconTurtle(T, tokT);
      const [rx, ry] = at(.08), [tx, ty] = at(.02);
      tokR.style.transform = `translate(${rx}px,${ry - 22}px) scale(2.2)`; tokT.style.transform = `translate(${tx}px,${ty + 18}px) scale(2.2)`;
      setRace(.08, .02, 0); bar.show(true);
      if (ART.bg_map) camSnap(500, T.portrait() ? 270 : 280, fitZ(420)); // 그림 지도: 길이 위쪽에 있다
      else camSnap(500, 280, fitZ(470)); // 세로 화면: 지도 전체가 보이게 물러선다
    });
    const moveTok = (tok, f, dy, ms) => { const [x, y] = at(f); tok.style.transition = `transform ${ms}ms ease-in-out`; tok.style.transform = `translate(${x}px,${y + dy}px) scale(2.2)`; };
    await say('여기는 경주 지도예요. 돌멩이, 개울, 언덕을 지나 깃발까지!');
    moveTok(tokR, .3, -22, 1200); setRace(.3, null, 1200); AudioFX.whoosh();
    await sleep(1300);
    moveTok(tokT, .04, 18, 1200); setRace(null, .04, 1200);
    await say('아래 막대를 보면 누가 앞서는지 알 수 있어요.');

    /* ===== 2막 — 쌩쌩 토끼, 엉금엉금 거북이 ===== */
    /* --- 6. 토끼 시점: 쌩쌩 --- */
    let far, near, bob;
    await scene('쌩쌩 토끼', () => {
      far = el('g', {}, T.bg); far.style.transition = 'transform .7s cubic-bezier(.2,.8,.3,1)';
      near = el('g', {}, T.world); near.style.transition = 'transform .7s cubic-bezier(.2,.8,.3,1)';
      if (ART.bg_dash) { // 그림 숲길을 좌우로 뒤집어 가며 이어 붙여 옆으로 흘려 보낸다 (이음매가 거울처럼 맞는다)
        artBG(T, 'bg_dash', far);
        for (let i = 1; i < 5; i++) T.el('image', { href: A(ART.bg_dash), ...BGX, transform: i % 2 ? `translate(${1080 * i + 1000} 0) scale(-1 1)` : `translate(${1080 * i} 0)` }, far); // 홀수 장은 거울 → 이음매가 맞는다
      } else {
      sky(T, '#F6E3B0');
      for (let i = 0; i < 6; i++) paper(far, [['path', { d: `M${i * 700 - 200} 380 Q${i * 700 + 100} 200 ${i * 700 + 400} 380 Z`, fill: i % 2 ? '#b9a25a' : '#a9b56a' }]]);
      paper(T.bg, [['rect', { x: -300, y: 370, width: 1600, height: 400, fill: C.grass }], ['rect', { x: -300, y: 440, width: 1600, height: 60, fill: C.dirt }]]);
      for (let i = 0; i < 16; i++) paper(near, [['ellipse', { cx: i * 230 + 60, cy: 540, rx: 70, ry: 40, fill: i % 2 ? C.pine : C.leaf }]]);
      for (let i = 0; i < 12; i++) tree(T, near, i * 300 + 150, 420, .6, i % 2 ? C.leaf : C.pine);
      // 언덕 위 나무 그늘 (마지막에 보인다)
      paper(near, [['path', { d: 'M2800 450 Q3150 250 3500 450 Z', fill: C.leaf }]]); tree(T, near, 3150, 330, 1.4);
      }
      rabbitReset(); rp.pose('run');
      put(rabbit, ART.bg_dash ? 330 : 300, ART.bg_dash ? 505 : 468, 1.1);
      camSnap(T.portrait() ? 360 : 470, 300, 1.12);
    });
    bob = rp.bobEl.animate([{ translate: '0 0' }, { translate: '0 -14px' }], { duration: 200, iterations: Infinity, direction: 'alternate' });
    every(900, () => speedLines(T, 5, 420));
    await say('토끼는 쌩쌩 달려요! 옆으로 쓱 밀어 봐요!');
    await T.swipe(wrap, { dir: 'right', count: 3, prompt: '화면을 옆으로 쓱 밀어 봐요!', onStep: i => {
      far.style.transform = `translateX(${(ART.bg_dash ? -700 : -280) * i}px)`; near.style.transform = `translateX(${-900 * i}px)`;
      AudioFX.whoosh(); speedLines(T, 16, 480); rabbit.hop(70, 500); T.pop(rabbit.x + 60, 300, '쌩!', C.persimmon);
      const cx = T.portrait() ? 370 : 490; // 세로 화면은 토끼 쪽으로
      camTo(cx, 300, 1.2, 180).then(() => camTo(cx - 20, 300, 1.12, 300));
      setRace(.3 + .1 * i, null, 700);
    } });
    await sleep(900);
    stopLoops(); bob.cancel(); rp.pose('stand');
    await rabbit.move(ART.bg_dash ? 470 : 430, ART.bg_dash ? 505 : 440, 500);
    await say('금세 언덕 위 나무 그늘까지 왔어요.');
    faceL(rabbit); rp.setEyes('open');
    await say('뒤를 돌아보니… 거북이는 안 보여요!');
    faceR(rabbit); rp.mouth('yawn'); rp.setEyes('half'); // 하품은 토끼 목소리로 (겹치던 합성음 뺌)
    await say('"하암~ 한숨 자고 가도 되겠다~"');

    /* --- 7. 토끼 재우기 --- */
    let blanket, sunG, cloud, dim;
    await scene('나무 그늘', () => {
      const shade = artBG(T, 'bg_shade');
      if (!shade) sky(T, '#F6D9A0');
      // 해님·구름은 임시 도형 (그림 배경에서는 왼쪽 위 하늘 조각에 작게)
      const skyG = shade ? el('g', { transform: 'translate(92 60) scale(.6) translate(-140 -120)' }, T.bg) : T.bg;
      sunG = paper(skyG, [['circle', { cx: 140, cy: 120, r: 58, fill: '#F6C85A' }]]);
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; el('rect', { x: 140 + Math.cos(a) * 72 - 8, y: 120 + Math.sin(a) * 72 - 3, width: 16, height: 6, rx: 3, fill: '#F6C85A', transform: `rotate(${a * 57.3} ${140 + Math.cos(a) * 72} ${120 + Math.sin(a) * 72})` }, sunG); }
      if (!shade) {
        paper(T.bg, [['rect', { x: -300, y: 430, width: 1600, height: 400, fill: C.grass }]]);
        paper(T.bg, [['rect', { x: 640, y: 40, width: 100, height: 440, fill: C.bark }], ['path', { d: 'M720 250 Q820 230 980 250 L980 266 Q820 250 730 272 Z', fill: C.bark }]]);
        paper(T.bg, [['circle', { cx: 700, cy: 20, r: 190, fill: C.pine }], ['circle', { cx: 480, cy: 60, r: 120, fill: C.leaf }], ['circle', { cx: 930, cy: 80, r: 140, fill: C.leaf }]]);
      }
      cloud = paper(skyG, [['circle', { cx: 100, cy: 130, r: 44, fill: '#E7E3F0' }], ['circle', { cx: 150, cy: 105, r: 56, fill: '#E7E3F0' }], ['circle', { cx: 205, cy: 132, r: 42, fill: '#E7E3F0' }], ['rect', { x: 90, y: 128, width: 130, height: 46, rx: 22, fill: '#E7E3F0' }]]);
      cloud.setAttribute('transform', 'translate(-420 0)');
      const o = aud.owl; o.reset(); put(o, ...(shade ? [790, 175, .8] : [870, 252, .95])); // 그림: 큰 나무 가지 끝
      seat(shade ? [['pig', 905, 540, .8], ['sheep', 80, 540, .8]] : [['pig', 900, 556, .8], ['sheep', 70, 556, .8]]);
      rabbitReset(); rp.setEyes('half'); faceL(rabbit);
      put(rabbit, 520, 488, 1.5);
      blanket = el('g', { transform: 'translate(220 470)' }, T.world);
      paper(blanket, [['path', { d: 'M-100 0 Q-40 -70 100 -10 Q40 60 -100 0 Z', fill: C.leaf }], ['path', { d: 'M-100 0 Q0 -10 100 -10 M-40 -4 L-10 -30 M0 -6 L30 -30 M-40 -4 L-10 20 M0 -6 L34 18', stroke: C.pine, 'stroke-width': 4, fill: 'none' }]]);
      dim = el('rect', { x: -300, y: -300, width: 1600, height: 1200, fill: '#2E2440', opacity: 0, 'pointer-events': 'none' }, T.fx);
      if (T.portrait()) camSnap(390, 280, fitZ(290)); // 세로 화면: 이불과 토끼가 함께 보이게
    });
    bar.show(true);
    await say('토끼를 푹 재워 줄까요?');
    await say('먼저 나뭇잎 이불을 톡!');
    await T.tap(blanket, { prompt: '나뭇잎 이불을 톡 눌러 봐요!' });
    AudioFX.slide();
    await tween(900, t => blanket.setAttribute('transform', `translate(${220 + 305 * t} ${470 - 30 * t}) rotate(${-8 * t}) scale(${1 + .3 * t})`), easeInOut);
    rp.mouth('yawn'); T.tone([400, 200], .8, { type: 'sine', vol: .12 });
    await say('포근포근~ 이불을 덮어 줬어요.');
    rp.mouth('smile');
    await say('부엉이를 톡! 자장가를 불러 줘요.');
    await T.tap(aud.owl.pos, { prompt: '나무 위 부엉이를 톡 눌러 봐요!' });
    [392, 330, 392, 330, 294, 262].forEach((f, i) => T.tone(f, .5, { type: 'sine', vol: .22, when: i * .5 }));
    T.pop(aud.owl.x, aud.owl.y - 130, '부엉 부엉~', C.indigo);
    for (let i = 0; i < 5; i++) setTimeout(() => noteShape(T, aud.owl.x - 60 - i * 30, aud.owl.y - 50, C.indigo), i * 450);
    aud.owl.wiggle(10, 1400);
    rp.sleepy(true);
    await say('부엉 부엉~ 토끼 눈이 스르르 감겨요.');
    await say('마지막으로 해님을 톡! 구름이 해를 가려 줘요.');
    await T.tap(sunG, { prompt: '해님을 톡 눌러 봐요!' });
    AudioFX.swish();
    await tween(1200, t => { cloud.setAttribute('transform', `translate(${-420 + 420 * t} 0)`); dim.setAttribute('opacity', .22 * t); }, easeInOut);
    rp.setEyes('closed');
    const zzz = () => every(1000, () => floatText(T, rabbit.x - 60, rabbit.y - 230, 'Z', C.indigo, 34 + Math.random() * 14));
    zzz(); let sk = 0; every(1800, () => snore(T, sk++ % 2));
    await say('토끼가 쿨쿨 잠이 들었어요.');
    aud.owl.hush(true); await sleep(300); aud.pig.hush(true); aud.sheep.hush(true);
    await say('응원하던 친구들도 "쉿!" 조용히~');

    /* --- 8. 토끼의 꿈 --- */
    let carrot, bite, biteAt = [830, 230];
    await scene('토끼의 꿈', () => {
      bar.show(false);
      const dream = artBG(T, 'bg_dream');
      if (dream) { // 그림 시상대 가운데 칸에 '3'이 찍혀 나와서 '1' 판을 덧댄다 (임시 도형)
        paper(T.bg, [['rect', { x: 459, y: 348, width: 78, height: 84, rx: 3, fill: '#F4DDB4' }],
          ['text', { x: 498, y: 410, 'text-anchor': 'middle', 'font-size': 56, fill: C.gold, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '1' }]]);
      } else {
      sky(T, '#E6DDF2');
      for (let i = 0; i < 12; i++) el('circle', { cx: 80 + (i * 83) % 860, cy: 90 + (i * 57) % 300, r: 4, fill: C.gold }, T.bg);
      paper(T.bg, [['rect', { x: -300, y: 470, width: 1600, height: 300, fill: '#CFC6E6' }]]);
      paper(T.bg, [['rect', { x: 180, y: 400, width: 120, height: 70, fill: C.lav }], ['rect', { x: 300, y: 350, width: 200, height: 120, fill: C.gold }], ['rect', { x: 500, y: 420, width: 120, height: 50, fill: C.persimmon }],
        ['text', { x: 400, y: 430, 'text-anchor': 'middle', 'font-size': 60, fill: C.cream, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '1' }]]);
      }
      rabbitReset(); rp.setEyes('open');
      put(rabbit, dream ? 497 : 400, dream ? 342 : 352, dream ? .9 : .95);
      // 거대한 당근 트로피 (한 입 먹으면 마스크로 뜯긴 자리를 만든다)
      if (ART.carrot_trophy) { // 그림: 발끝(790,474) 기준, 마스크도 트로피 자리 좌표로
        carrot = el('g', { transform: 'translate(790 474)' }, T.world);
        const m = el('mask', { id: 'biteMask', maskUnits: 'userSpaceOnUse', x: -300, y: -600, width: 600, height: 700 }, el('defs', {}, carrot));
        el('rect', { x: -300, y: -600, width: 600, height: 700, fill: '#fff' }, m);
        bite = el('g', { opacity: 0 }, m);
        [[74, -330, 28], [66, -300, 20], [78, -358, 18]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#000' }, bite));
        sprite(T, el('g', { mask: 'url(#biteMask)' }, carrot), 'carrot_trophy', 164, 404);
        biteAt = [860, 150];
        return;
      }
      const defs = el('defs', {}, T.world);
      const m = el('mask', { id: 'biteMask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1000, height: 560 }, defs);
      el('rect', { x: 0, y: 0, width: 1000, height: 560, fill: '#fff' }, m);
      bite = el('g', { opacity: 0 }, m);
      [[836, 220, 26], [826, 250, 20], [840, 190, 18]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#000' }, bite));
      carrot = el('g', {}, T.world);
      const cm = el('g', { mask: 'url(#biteMask)' }, carrot);
      paper(cm, [['path', { d: 'M770 160 Q750 100 740 70 M790 160 Q790 90 800 60 M810 160 Q830 100 850 80', stroke: C.leaf, 'stroke-width': 16, fill: 'none', 'stroke-linecap': 'round' }],
        ['path', { d: 'M730 160 Q790 140 850 160 L800 420 Q790 440 780 420 Z', fill: C.persimmon }],
        ['path', { d: 'M750 220 L790 214 M760 280 L800 276 M770 340 L796 338', stroke: '#c45a2b', 'stroke-width': 5 }]]);
      paper(carrot, [['path', { d: 'M720 410 Q790 480 860 410 Z', fill: C.gold }], ['rect', { x: 770, y: 440, width: 40, height: 20, fill: C.gold }], ['rect', { x: 740, y: 458, width: 100, height: 16, rx: 5, fill: '#b98f4a' }]]);
      // 몽글몽글 구름 테두리
      for (let x = 0; x <= 1000; x += 90) { el('circle', { cx: x, cy: 0, r: 60, fill: C.snow }, T.fx); el('circle', { cx: x, cy: 560, r: 60, fill: C.snow }, T.fx); }
      for (let y = 60; y < 560; y += 90) { el('circle', { cx: 0, cy: y, r: 60, fill: C.snow }, T.fx); el('circle', { cx: 1000, cy: y, r: 60, fill: C.snow }, T.fx); }
    });
    AudioFX.bell();
    await say('토끼가 꿈을 꿔요. 꿈속에서 1등을 했어요!');
    await say('상으로 커다란 당근을 받았어요. 당근을 톡!');
    await T.tap(carrot, { prompt: '커다란 당근을 톡 눌러 봐요!' });
    AudioFX.chomp(); show(bite, 1); T.pop(...biteAt, '아삭!', C.persimmon); rabbit.hop(40, 400);
    await say('"아삭! 음~ 맛있다!"');
    let sk2 = 0; every(1800, () => snore(T, sk2++ % 2));
    await say('하지만 진짜 토끼는 나무 아래에서 드르렁 쿨쿨~');

    /* --- 9. 거북이 시점: 돌멩이 --- */
    let rock;
    const low = !!ART.bg_grass_low; // 그림: 길 한가운데 큰 돌멩이 (517,437 둘레)
    const R9 = low ? { y: 500, x0: 130, dx: 36, s: 1.3, top: [517, 392], down: [720, 505], pop: [517, 330] } : { y: 480, x0: 150, dx: 46, s: 1.6, top: [640, 372], down: [790, 480], pop: [700, 290] };
    await scene('엉금엉금 거북이', () => {
      if (low) {
        artBG(T, 'bg_grass_low');
        seat([['dog', 285, 430, .5], ['cat', 745, 430, .5]]);
        rock = artPiece(T, 'bg_grass_low', ['ellipse', { cx: 517, cy: 437, rx: 100, ry: 62 }]);
        turtleReset(); put(turtle, R9.x0, R9.y, R9.s);
        if (T.portrait()) camSnap(300, 280, 1);
        bar.show(true); setRace(race.r, race.t, 0);
        return;
      }
      sky(T);
      paper(T.bg, [['path', { d: 'M-300 340 Q100 300 400 335 Q700 300 1300 330 V800 H-300 Z', fill: '#a9b56a' }]]);
      paper(T.bg, [['rect', { x: -300, y: 350, width: 1600, height: 400, fill: C.grass }]]);
      paper(T.bg, [['ellipse', { cx: 540, cy: 352, rx: 130, ry: 20, fill: '#8fae66' }]]);
      seat([['dog', 480, 352, .5], ['cat', 600, 352, .5]]);
      // 중간 돌멩이
      paper(T.world, [['ellipse', { cx: 300, cy: 420, rx: 26, ry: 14, fill: '#b3aca0' }], ['ellipse', { cx: 520, cy: 400, rx: 18, ry: 10, fill: '#b3aca0' }]]);
      rock = paper(T.world, [['path', { d: 'M580 482 Q570 380 660 350 Q760 330 810 400 Q840 450 820 482 Z', fill: '#9a948a' }], ['path', { d: 'M620 380 Q660 360 700 366', stroke: '#c9c2b6', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }]]);
      turtleReset(); put(turtle, 150, 480, 1.6);
      if (T.portrait()) camSnap(300, 280, 1);
      // 거북이 눈높이 전경: 커다란 풀잎·꽃·조약돌
      for (let i = 0; i < 5; i++) paper(T.fx, [['path', { d: `M${-40 + i * 34} 560 Q${-10 + i * 30} 300 ${30 + i * 26} ${120 + i * 30} Q${30 + i * 34} 330 ${10 + i * 34} 560 Z`, fill: i % 2 ? C.pine : C.leaf }]]);
      for (let i = 0; i < 4; i++) paper(T.fx, [['path', { d: `M${930 + i * 30} 560 Q${940 + i * 20} 320 ${900 + i * 28} ${140 + i * 36} Q${960 + i * 28} 330 ${960 + i * 30} 560 Z`, fill: i % 2 ? C.leaf : C.pine }]]);
      paper(T.fx, [['path', { d: 'M880 560 Q870 360 880 200', stroke: C.pine, 'stroke-width': 10, fill: 'none' }], ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => ['ellipse', { cx: 880 + Math.cos(i * .785) * 40, cy: 190 + Math.sin(i * .785) * 40, rx: 26, ry: 14, fill: C.snow, transform: `rotate(${i * 45} ${880 + Math.cos(i * .785) * 40} ${190 + Math.sin(i * .785) * 40})` }]), ['circle', { cx: 880, cy: 190, r: 22, fill: C.gold }]]);
      paper(T.fx, [['ellipse', { cx: 330, cy: 570, rx: 90, ry: 40, fill: '#8a8478' }], ['ellipse', { cx: 700, cy: 575, rx: 70, ry: 34, fill: '#9a948a' }]]);
      bar.show(true); setRace(race.r, race.t, 0);
    });
    await say('그동안 거북이는? 엉금엉금 걷고 있어요.');
    await say('화면을 톡톡 눌러서 한 발 한 발 걸어요!');
    let st = 0;
    await T.mash(wrap, { count: 6, prompt: '화면을 톡톡 눌러서 엉금엉금!', onStep: i => {
      tp.step(st++ % 2); footstep(T); turtle.move(R9.x0 + i * R9.dx, R9.y, 380); follow(R9.x0 + 100 + i * R9.dx, 380);
      setRace(null, .04 + i * .02, 400);
      if (i === 3) { aud.dog.cheer('힘내!'); vo('cheer_dog'); setTimeout(() => aud.cat.cheer('힘내!'), 300); }
    } });
    await sleep(500); tp.step(0);
    await say('어? 커다란 돌멩이예요! 돌멩이를 톡 해서 넘어가요!');
    await T.tap(rock, { prompt: '돌멩이를 톡 눌러 봐요!' });
    T.pop(...R9.pop, '영차!', C.pine);
    tp.tilt(-22); walk(1800, 200);
    follow(R9.down[0] - 90, 1700);
    await turtle.move(...R9.top, 900);
    tp.tilt(18);
    await turtle.move(...R9.down, 800);
    tp.tilt(0); setRace(null, .2, 600);
    aud.dog.cheer('와아!'); aud.cat.cheer('야옹~');
    await say('영차! 돌멩이를 넘었어요!');

    /* --- 10. 거북이 시점: 개울 --- */
    const fish = [];
    const brook = !!ART.bg_stream; // 그림 개울: 물은 y 430 아래
    const R10 = brook ? { x0: 200, y: 492, fish: [[110, 470], [60, 515], [230, 535]] } : { x0: 160, y: 420, fish: [[90, 360], [40, 470], [200, 490]] };
    await scene('개울', () => {
      if (brook) { artBG(T, 'bg_stream'); seat([['duck', 720, 436, .7]]); } else {
      sky(T);
      paper(T.bg, [['path', { d: 'M-300 250 H130 L90 600 H-300 Z', fill: C.grass }], ['path', { d: 'M1300 250 H880 L930 600 H1300 Z', fill: C.grass }]]);
      paper(T.bg, [['rect', { x: -300, y: 244, width: 1600, height: 400, fill: '#9fb3d9', opacity: .95 }]]);
      el('rect', { x: -300, y: 330, width: 1600, height: 300, fill: '#7f96c7' }, T.bg);
      el('rect', { x: -300, y: 430, width: 1600, height: 200, fill: '#6f86b8' }, T.bg);
      el('path', { d: 'M-300 244 ' + Array.from({ length: 20 }, (_, i) => `Q${-270 + i * 80} 234 ${-220 + i * 80} 244 T${-140 + i * 80} 244`).join(' '), stroke: C.snow, 'stroke-width': 4, fill: 'none' }, T.bg);
      paper(T.bg, [['rect', { x: -300, y: 520, width: 1600, height: 100, fill: '#8a7a60' }], ...[80, 260, 470, 690, 900].map((x, i) => ['ellipse', { cx: x, cy: 522, rx: 30 + i % 2 * 12, ry: 14, fill: '#9a948a' }])]);
      [40, 110, 900, 960].forEach(x => paper(T.bg, [['path', { d: `M${x} 540 Q${x - 10} 380 ${x + 6} 250`, stroke: C.pine, 'stroke-width': 8, fill: 'none' }], ['ellipse', { cx: x + 6, cy: 250, rx: 7, ry: 22, fill: C.bark }]]));
      seat([['duck', 560, 256, .85]]);
      }
      [C.persimmon, C.gold, C.lav].map((c, i) => [c, ...R10.fish[i]]).forEach(([c, x, y]) => {
        const f = actor(T.world, x, y, g => paper(g, [['path', { d: 'M-22 0 L-38 -12 L-38 12 Z', fill: c }], ['ellipse', { cx: 0, cy: 0, rx: 24, ry: 13, fill: c }], ['circle', { cx: 12, cy: -3, r: 3, fill: C.ink }]]), { scale: 1.2 });
        fish.push(f);
      });
      turtleReset(); tp.swim(true); put(turtle, R10.x0, R10.y, 1.35);
      if (T.portrait()) camSnap(270, 280, 1);
      bar.show(true);
    });
    let sw = every(160, () => tp.step(Math.random() < .5 ? 1 : 0));
    await say('앗, 개울이에요! 거북이는 헤엄을 잘 쳐요.');
    await say('옆으로 쓱 밀어서 헤엄쳐요!');
    await T.swipe(wrap, { dir: 'right', count: 3, prompt: '화면을 옆으로 쓱 밀어 봐요!', onStep: i => {
      AudioFX.splash(); turtle.move(R10.x0 + i * 185, R10.y - (i % 2) * (brook ? 16 : 30), 900); follow(R10.x0 + i * 185, 900);
      fish.forEach((f, k) => f.move(f.x + 185, f.y + (k - 1) * 8, 1000));
      for (let b = 0; b < 5; b++) { const c = el('circle', { cx: turtle.x + 60, cy: turtle.y - 40, r: 5 + b * 2, fill: 'none', stroke: C.snow, 'stroke-width': 3 }, T.fx); c.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${b * 10}px,-140px)`, opacity: 0 }], { duration: 1200, delay: b * 120, fill: 'both' }).finished.then(() => c.remove()); }
      setRace(null, .2 + i * .06, 800);
      if (i === 2) { aud.duck.cheer('꽥꽥! 힘내!'); vo('cheer_duck'); }
    } });
    await sleep(1000); clearInterval(sw); tp.step(0);
    await say('물고기랑 같이 개울을 건넜어요!');
    tp.swim(false);

    /* --- 11. 거북이 시점: 언덕 → 분할 화면 --- */
    const slopeY = x => 540 - .336 * (x + 50);
    const hill = !!ART.bg_hill; // 그림 언덕: 거북이는 비탈을 비스듬히 가로질러 오른다
    await scene('언덕', () => {
      if (hill) { artBG(T, 'bg_hill'); seat([['sheep', 885, 540, .95]]); } else {
      sky(T, '#F6D9A0');
      paper(T.bg, [['path', { d: 'M-300 600 L-50 540 L1050 170 L1300 170 V800 H-300 Z', fill: C.leaf }]]);
      for (let i = 0; i < 6; i++) el('path', { d: `M${-50 + i * 190} ${slopeY(-50 + i * 190) + 30} l40 ${-13} l30 40`, stroke: C.pine, 'stroke-width': 5, fill: 'none', opacity: .6 }, T.bg);
      tree(T, T.bg, 960, 205, .7);
      seat([['sheep', 880, 556, .95]]);
      }
      turtleReset(); tp.tilt(-18.6); put(turtle, 190, slopeY(190), 1.3);
      if (T.portrait()) camSnap(290, 280, 1);
      if (!hill) paper(T.fx, [['path', { d: 'M-20 560 Q0 420 30 330 Q40 440 60 560 Z', fill: C.pine }], ['path', { d: 'M40 560 Q70 450 110 400 Q90 480 100 560 Z', fill: C.leaf }]]);
      bar.show(true);
    });
    await say('이번엔 높은 언덕이에요.');
    await say('화면을 꾹 누르고 있으면 영차영차 올라가요!');
    let lastStep = -1, cheered = false;
    const yo = new Set();
    await holdOn(T, wrap, { count: 14, prompt: '화면을 꾹 누르고 있어 봐요!', onProgress: p => {
      const x = 190 + 580 * p; turtle.move(x, slopeY(x), 180, 'linear'); follow(x + 40, 180);
      const s = Math.floor(p * 16); if (s !== lastStep) { lastStep = s; tp.step(s % 2); footstep(T); }
      [.3, .7].forEach(m => { if (p >= m && !yo.has(m)) { yo.add(m); T.pop(x + 60, slopeY(x) - 160, '영차!', C.pine); } });
      if (p > .5 && !cheered) { cheered = true; aud.sheep.cheer('힘내!'); vo('cheer_sheep'); }
      setRace(null, .38 + .17 * p, 100);
    } });
    tp.step(0);
    await say('영차! 언덕 꼭대기에 올라왔어요.');

    await scene('쉿, 살금살금', () => {
      const defs = el('defs', {}, T.world);
      const cp = (id, y, h) => { const c = el('clipPath', { id }, defs); el('rect', { x: 0, y, width: 1000, height: h }, c); };
      cp('splitTop', 0, 276); cp('splitBot', 284, 276);
      const top = el('g', { 'clip-path': 'url(#splitTop)' }, T.world), bot = el('g', { 'clip-path': 'url(#splitBot)' }, T.world);
      if (ART.bg_shade) el('image', { href: A(ART.bg_shade), x: 0, y: 0, width: 1000, height: 280, preserveAspectRatio: 'xMidYMid slice' }, top); // 위: 나무 그늘 그림의 가운데 띠
      else {
        el('rect', { x: 0, y: 0, width: 1000, height: 280, fill: '#F6D9A0' }, top);
        paper(top, [['rect', { x: 0, y: 230, width: 1000, height: 60, fill: C.leaf }], ['rect', { x: 600, y: 0, width: 70, height: 240, fill: C.bark }], ['circle', { cx: 630, cy: -10, r: 150, fill: C.pine }], ['circle', { cx: 440, cy: 10, r: 90, fill: C.leaf }]]);
      }
      rabbitReset(); rp.setEyes('closed'); rp.sleepy(true); faceL(rabbit);
      put(rabbit, 520, 262, .78, top);
      paper(top, [['path', { d: 'M-100 0 Q-40 -70 100 -10 Q40 60 -100 0 Z', fill: C.leaf, transform: 'translate(525 236) rotate(-8) scale(.62)' }]]); // 대사의 '나뭇잎 이불' (그림 속 크림색 이불 위에)
      aud.owl.reset(); put(aud.owl, 790, 262, .7, top);
      if (ART.bg_hill) el('image', { href: A(ART.bg_hill), x: 0, y: 280, width: 1000, height: 280, preserveAspectRatio: 'xMidYMid slice' }, bot); // 아래: 언덕 그림의 가운데 띠
      else {
      el('rect', { x: 0, y: 280, width: 1000, height: 280, fill: C.sky }, bot);
      paper(bot, [['rect', { x: 0, y: 470, width: 1000, height: 100, fill: C.grass }], ['path', { d: 'M0 480 Q250 440 500 470 Q750 500 1000 460 V560 H0 Z', fill: C.leaf }]]);
      }
      if (!ART.bg_hill) [180, 420, 700].forEach(x => paper(bot, [['path', { d: `M${x} 480 Q${x - 6} 420 ${x} 390`, stroke: C.pine, 'stroke-width': 5, fill: 'none' }], ['circle', { cx: x, cy: 388, r: 12, fill: C.amber }]]));
      turtleReset(); put(turtle, 110, 472, 1.05, bot);
      paper(T.world, [['rect', { x: -10, y: 274, width: 1020, height: 12, fill: C.cream, stroke: C.gold, 'stroke-width': 3 }]]);
      bar.show(true);
    });
    const zzz2 = () => every(1100, () => floatText(T, rabbit.x - 40, rabbit.y - 150, 'Z', C.indigo, 28));
    zzz2(); let sk3 = 0; every(1800, () => snore(T, sk3++ % 2));
    aud.owl.hush(true);
    await say('위에는 쿨쿨 자는 토끼, 아래에는 거북이!');
    await say('쉿, 조용히 지나가요~ 살금살금.');
    await follow(250, 700); // 세로 화면: 거북이를 따라간다
    for (let i = 0; i < 5; i++) {
      tp.step(i % 2); T.tone(880 + (i % 2) * 110, .08, { type: 'triangle', vol: .12 });
      follow(110 + (i + 1) * 150, 700);
      await turtle.move(110 + (i + 1) * 150, 472, 700, 'ease-in-out');
      setRace(null, .55 + (i + 1) * .04, 600);
      await sleep(150);
    }
    tp.step(0); bar.pulse('t');
    await say('와, 거북이가 토끼를 앞질렀어요!');

    /* ===== 3막 — 결승선 ===== */
    /* --- 12. 꼬끼오! --- */
    await scene('꼬끼오!', () => {
      sky(T, C.amber);
      el('rect', { x: -300, y: -300, width: 1600, height: 420, fill: '#F6C27A' }, T.bg);
      paper(T.bg, [['circle', { cx: 780, cy: 380, r: 90, fill: C.persimmon }]]);
      paper(T.bg, [['path', { d: 'M-300 380 Q200 320 600 370 Q900 330 1300 370 V800 H-300 Z', fill: '#8a8f4a' }]]);
      paper(T.bg, [['rect', { x: -300, y: 470, width: 1600, height: 20, fill: C.bark }], ['rect', { x: -300, y: 420, width: 1600, height: 16, fill: C.bark }], ...[60, 240, 760, 940].map(x => ['rect', { x, y: 390, width: 22, height: 170, fill: '#5a3d29' }])]);
      paper(T.bg, [['rect', { x: -300, y: 490, width: 1600, height: 100, fill: C.grass }]]);
      seat([['rooster', 500, 474, 2.1]]);
      bar.show(true); setRace(race.r, .9, 0);
    });
    await say('해가 뉘엿뉘엿 지고 있어요.');
    await say('닭을 톡 눌러서 토끼를 깨워 줄까요?');
    await T.tap(aud.rooster.pos, { prompt: '닭을 톡 눌러 봐요!' });
    aud.rooster.stand(); aud.rooster.cry(); aud.rooster.hop(20, 400);
    T.pop(500, 150, '꼬끼오!', C.bean);
    await sleep(1400); aud.rooster.sit();
    vo('wake_rabbit'); // 컷 속 토끼 외침 (말풍선 없음)
    await (cutArt(T, 'cut_wake', 'boing', 2200) || T.cut(svg => {
      const g = el('g', { transform: 'translate(170 330) scale(1.35)' }, svg);
      const p = drawRabbit(T, g); p.setEyes('wide'); p.ears(1.2); p.mouth('yawn');
      el('text', { x: 310, y: 110, 'text-anchor': 'middle', 'font-size': 80, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '앗!' }, svg);
    }, { sfx: 'boing', hold: 2200 }));
    await say('토끼가 벌떡 일어났어요! "앗, 내가 잠들었네!"');
    bar.pulse('t');
    await say('막대를 봐요! 거북이가 결승선 코앞이에요!');

    /* --- 13. 마지막 한 발 --- */
    let tapeTop, tapeBot;
    await scene('마지막 한 발', () => {
      if (artBG(T, 'bg_finish')) { // 그림 결승 문은 멀리 있다 → 관객은 길 양옆, 결승 기둥·테이프는 임시 도형으로 앞에
        seat(KINDS.map((k, i) => [k, [50, 125, 200, 275, 655, 725, 875, 945][i], 408, .5]));
      } else {
      sky(T, '#F6D9A0');
      paper(T.bg, [['rect', { x: -300, y: 250, width: 1600, height: 110, fill: '#a57b4f' }], ['rect', { x: -300, y: 330, width: 1600, height: 14, fill: C.bark }]]);
      paper(T.bg, [['rect', { x: -300, y: 344, width: 1600, height: 400, fill: C.grass }], ['rect', { x: -300, y: 400, width: 1600, height: 110, fill: C.dirt }]]);
      seat(KINDS.map((k, i) => [k, 70 + i * 122, 336, .55]));
      }
      for (let r = 0; r < 6; r++) el('rect', { x: 760 + (r % 2) * 14, y: 400 + r * 18, width: 14, height: 18, fill: C.snow }, T.bg);
      paper(T.world, [['rect', { x: 800, y: 60, width: 18, height: 440, fill: C.bark }]]);
      paper(T.world, [['rect', { x: 818, y: 70, width: 170, height: 64, fill: C.snow }], ...Array.from({ length: 24 }, (_, i) => ['rect', { x: 818 + (i % 8) * 21.25, y: 70 + Math.floor(i / 8) * 21.3, width: 21.25, height: 21.3, fill: (i + Math.floor(i / 8)) % 2 ? C.ink : C.snow }]),
        ['rect', { x: 845, y: 84, width: 116, height: 38, rx: 8, fill: C.cream }], ['text', { x: 903, y: 113, 'text-anchor': 'middle', 'font-size': 30, fill: C.bean, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '결승' }]]);
      turtleReset(); put(turtle, 540, 476, 1.5);
      rabbitReset(); rp.pose('run'); put(rabbit, -200, 472, 1);
      tapeTop = el('rect', { x: 786, y: 376, width: 8, height: 50, fill: C.bean }, T.world);
      tapeBot = el('rect', { x: 786, y: 426, width: 8, height: 50, fill: C.bean }, T.world);
      bar.show(true); setRace(.6, .92, 0);
    });
    KINDS.forEach((k, i) => setTimeout(() => aud[k].cheer(i % 3 ? '' : null, true), i * 120));
    await say('응원하던 친구들이 모두 일어났어요!');
    if (ART.cut_dash) { // 그림 컷 한 장으로: 쌩(첫 효과음) … 쌩(1.8초 뒤 두 번째 효과음)
      let t2;
      await cutArt(T, 'cut_dash', 'whoosh', 3400, () => { t2 = setTimeout(() => { AudioFX.whoosh(); setRace(.8, null, 800); }, 1800); });
      clearTimeout(t2); setRace(.8, null, 800);
    } else {
    await T.cut(svg => {
      for (let i = 0; i < 10; i++) el('rect', { x: 0, y: 30 + i * 26, width: 140 + (i % 3) * 60, height: 6, fill: C.snow }, svg);
      const g = el('g', { transform: 'translate(230 250) rotate(10)' }, svg); const p = drawRabbit(T, g); p.pose('run');
      el('text', { x: 90, y: 90, 'text-anchor': 'middle', 'font-size': 64, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '쌩쌩!' }, svg);
    }, { sfx: 'whoosh', hold: 1800 });
    setRace(.8, null, 800);
    await T.cut(svg => {
      for (let i = 0; i < 12; i++) el('rect', { x: 0, y: 20 + i * 24, width: 200 + (i % 3) * 60, height: 8, fill: C.snow }, svg);
      const g = el('g', { transform: 'translate(230 350) scale(1.6) rotate(10)' }, svg); const p = drawRabbit(T, g); p.pose('run'); p.setEyes('wide');
    }, { sfx: 'whoosh', hold: 1600 });
    }
    await say('토끼가 쌩쌩 달려와요! 거북이는 딱 한 발 남았어요.');
    await say('거북이를 톡! 마지막 한 발!');
    await T.tap(turtle.pos, { prompt: '거북이를 톡 눌러서 마지막 한 발!' });
    walk(1800, 450);
    speedLines(T, 10, 900);
    setTimeout(() => {
      AudioFX.pop(); T.pop(790, 330, '골인!', C.bean);
      tween(500, t => { tapeTop.setAttribute('transform', `rotate(${-70 * t} 790 376)`); tapeBot.setAttribute('transform', `rotate(${70 * t} 790 476)`); });
    }, 1150);
    follow(640, 2000); // 세로 화면: 결승선 쪽으로
    await Promise.all([turtle.move(650, 476, 2000, 'ease-out'), rabbit.move(430, 472, 2100, 'ease-out')]);
    setRace(.95, 1, 500);
    rp.pose('stand');
    await (cutArt(T, 'cut_photo', 'poke', 2600) || T.cut(svg => {
      el('rect', { x: 40, y: 30, width: 320, height: 240, rx: 6, fill: C.snow }, svg);
      el('rect', { x: 56, y: 46, width: 288, height: 190, fill: C.sky }, svg);
      el('rect', { x: 56, y: 190, width: 288, height: 46, fill: C.dirt }, svg);
      el('path', { d: 'M250 60 V236', stroke: C.bean, 'stroke-width': 5, 'stroke-dasharray': '10 6' }, svg);
      const gr = el('g', { transform: 'translate(120 222) scale(.7)' }, svg); drawRabbit(T, gr).pose('run');
      const gt = el('g', { transform: 'translate(170 226) scale(.85)' }, svg); drawTurtle(T, gt);
      el('text', { x: 200, y: 262, 'text-anchor': 'middle', 'font-size': 26, fill: C.bark, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '찰칵!' }, svg);
    }, { sfx: 'poke', hold: 2600 }));
    await say('사진을 보니… 거북이 코끝이 먼저 닿았어요!');
    AudioFX.fanfare && AudioFX.fanfare(); T.confetti();
    turtle.hop(30, 500);
    await say('거북이가 1등이에요!');
    KINDS.forEach(k => aud[k].sit());

    /* --- 14. 시상식 --- */
    let medal, racc;
    await scene('시상식', () => {
      bar.show(false);
      standsBG(T);
      seat(KINDS.map((k, i) => [k, 90 + i * 117, 330, .72]));
      paper(T.world, [['rect', { x: 410, y: 400, width: 180, height: 100, fill: C.gold }], ['text', { x: 500, y: 470, 'text-anchor': 'middle', 'font-size': 56, fill: C.cream, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '1' }]]);
      turtleReset(); put(turtle, 490, 402, 1.25);
      rabbitReset(); put(rabbit, 150, 500, 1);
      racc = actor(T.world, 860, 500, g => drawRaccoon(T, g), { scale: ART.raccoon ? .9 : .95 });
      if (ART.medal) { medal = el('g', { transform: 'translate(730 420)' }, T.world); sprite(T, medal, 'medal', 100, 130, { dy: 56 }); return; } // 그림 메달 (리본 위끝~메달 아래끝이 임시 도형과 같은 자리)
      medal = paper(T.world, [['path', { d: 'M-30 -70 L0 -10 L30 -70', stroke: C.persimmon, 'stroke-width': 12, fill: 'none' }], ['circle', { cx: 0, cy: 10, r: 44, fill: C.gold, stroke: '#b98f4a', 'stroke-width': 6 }],
        ['text', { x: 0, y: 28, 'text-anchor': 'middle', 'font-size': 48, fill: C.bean, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '1' }]], { transform: 'translate(730 420)' });
    });
    await say('시상식이에요! 응원하던 친구들이 파도타기를 해요.');
    for (let w = 0; w < 2; w++) for (const k of KINDS) { const a = aud[k]; a.stand(); T.tone(400 + KINDS.indexOf(k) * 60, .12, { type: 'triangle', vol: .12 }); setTimeout(() => a.sit(), 350); await sleep(140); }
    await sleep(400);
    await say('메달을 톡! 거북이 목에 걸어 줘요.');
    await T.tap(medal, { prompt: '반짝반짝 메달을 톡 눌러 봐요!' });
    AudioFX.jingle();
    await tween(900, t => medal.setAttribute('transform', `translate(${730 + (563 - 730) * t} ${420 + (374 - 420) * t - Math.sin(t * Math.PI) * 120}) scale(${1 - .65 * t})`), easeInOut);
    medal.remove(); tp.wearMedal(true); turtle.hop(24, 400);
    AudioFX.ding(); T.confetti();
    await say('반짝반짝, 금메달이에요!');
    rabbit.hop(10, 300);
    await rabbit.move(330, 500, 1200);
    rp.congrats && rp.congrats(true); // 손을 내밀어 축하하는 그림
    await say('토끼가 다가와 말했어요.');
    await say('"축하해! 다음엔 나도 쉬지 않고 열심히 할게."');
    await Promise.all([rabbit.hop(30, 400), turtle.hop(20, 400)]);
    T.pop(420, 330, '짝짝짝!', C.persimmon);
    await say('거북이도 말했어요. "고마워! 우리 또 같이 달리자!"');
    KINDS.forEach((k, i) => setTimeout(() => aud[k].cheer(i % 3 ? '' : '와아!'), i * 140));
    await sleep(1400);

    /* --- 15. 숲속 잔치 --- */
    await scene('숲속 잔치', () => {
      sky(T, '#1c2550');
      el('circle', { cx: 880, cy: 90, r: 40, fill: C.cream }, T.bg);
      [[90, 60], [230, 120], [420, 70], [600, 130], [760, 50], [960, 170], [40, 200]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 3.5, fill: C.cream }, T.bg));
      paper(T.bg, [['path', { d: 'M-300 330 Q200 280 500 320 Q800 280 1300 320 V800 H-300 Z', fill: '#2a3a4a' }], ['rect', { x: -300, y: 380, width: 1600, height: 400, fill: '#34503f' }]]);
      [[0, 150, 1000, 150, 230], [0, 260, 1000, 260, 330]].forEach(([x1, y1, x2, y2, cy]) => {
        el('path', { d: `M${x1} ${y1} Q500 ${cy} ${x2} ${y2}`, stroke: C.bark, 'stroke-width': 3, fill: 'none' }, T.bg);
        for (let i = 1; i < 10; i++) { const t = i / 10, x = x1 + (x2 - x1) * t, y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
          el('circle', { cx: x, cy: y + 14, r: 22, fill: C.amber, opacity: .25 }, T.bg); paper(T.bg, [['rect', { x: x - 10, y: y, width: 20, height: 28, rx: 9, fill: [C.amber, C.persimmon, C.gold][i % 3] }]]); }
      });
      seat([['rooster', 150, 340, .75], ['sheep', 320, 340, .75], ['cat', 680, 340, .75], ['owl', 850, 340, .75],
        ['duck', 100, 520, .95], ['cow', 260, 520, .95], ['pig', 740, 520, .95], ['dog', 900, 520, .95]].map(([k, x, y, s]) => [k, PX(x, .72), y, s]));
      camSnap(500, 280, fitZ(400 * .72 + 70)); // 세로 화면: 모두 보이게
      KINDS.forEach(k => show(aud[k].parts.instr, 1));
      rabbitReset(); put(rabbit, 420, 480, .95);
      turtleReset(); tp.wearMedal(true); put(turtle, 580, 486, 1.15);
    });
    await say('밤이 되었어요. 숲속 잔치가 열렸어요!');
    await say('친구들을 톡톡 눌러서 신나게 연주해요!');
    let beat = 0;
    every(600, () => { T.tone(beat % 2 ? 196 : 131, .12, { type: 'triangle', vol: .07 }); if (beat++ % 2) turtle.hop(12, 300); else rabbit.hop(18, 300); });
    await T.free([
      ...KINDS.map(k => ({ el: aud[k].pos, onTap: () => { const a = aud[k]; PLAY[k](T); a.hop(24, 320); noteShape(T, a.x + 30, a.y - 120 * a.scale, [C.bean, C.gold, C.persimmon, C.lav][KINDS.indexOf(k) % 4]); } })),
      { el: rabbit.pos, onTap: () => { AudioFX.boing(); rabbit.hop(50, 420); } },
      { el: turtle.pos, onTap: () => { T.tone([200, 300], .3, { type: 'triangle', vol: .2 }); tween(250, t => tp.neck(1 + Math.sin(t * Math.PI) * 1.2)); } },
    ], 30000);
    stopLoops();
    await say('모두 함께 신나는 잔치를 했답니다.');
    await say('천천히 가도 끝까지 하면 해낼 수 있어요!');
    KINDS.forEach(k => show(aud[k].parts.instr, 0));
    bar.remove();
    return '천천히, 꾸준히, 끝까지!';
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

  Tale.mount({ title: '토끼와 거북이', subtitle: '누가 먼저 도착할까?', run: T => run(portraitGuard(Tale.api)) });
})();
