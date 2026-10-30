/* 사자와 생쥐 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §14
   낮잠 사자 콧방울 → 생쥐 산책(갈기 미끄럼틀) → 잡혔다 → 하하하 → 크기 비교 3판 → 밤 그물 → 갉아요(10줄 세기) → 등에 타고 달리기.
   3~4세 순화: 사냥꾼은 나오지 않는다(먼 발소리만). 사자는 "꿀꺽 해 버릴까?" 대사만, 표정은 졸린 얼굴. */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32', indigo: '#1F2A56',
    persimmon: '#E8703A', bean: '#A93B32', pink: '#E8A0A0', ink: '#2E241C', sky: '#F2DFA8', snow: '#F4F6FA', amber: '#F2B366',
    lion: '#D9A94E', lionDk: '#C4923F', mane: '#E8703A', maneDk: '#C95F2E',
    mouse: '#A89A8C', mouseDk: '#8C7E72', rope: '#D9B878', ground: '#C9A95E' };
  const NUMS = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];

  /* ================= 페이퍼아트 그림 (assets/v3w/lm_*.webp) =================
     null이거나 파일을 못 불러오면 그 자리는 아래 임시 도형(그레이박스)으로 그린다. 새 그림이 나오면 여기 한 줄만 바꾸면 된다.
     배경은 장면마다 한 장을 무대에 꽉 채워 깐다. 밤 두 장은 그림책 밤처럼 밝게 구웠다(감마).
     비교 판 배경(lm_bg_board)·큰 발(paw_pad + 따로 오린 발가락 paw_toe)·이빨 카드·그루터기 구멍·밤 숲 그물은 그림. 발자국 카드·끊는 밧줄은 코드 그대로. */
  const AS = '../../assets/';
  const BG = {
    /* 2026-10-23 화려한 재기획(VISUAL_PLAN.md): 낮 초원·풀숲은 다층 v2, 밤 숲·사각사각·아침 띠는 라이트박스(lb). 아카시아·공터·달 자리는 원본과 같다 */
    savanna: 'v3w/lm_bg_savanna_v2.webp', grass: 'v3w/lm_bg_grass_v2.webp',
    night_forest: 'v3w/lm_lb_night_forest.webp', night_net: 'v3w/lm_lb_night_net.webp', morning: 'v3w/lm_bg_morning.webp',
    board: 'v3w/lm_bg_board.webp',
    morning_nosun: 'v3w/lm_lb_morning_nosun.webp', // 아침 초원 라이트박스(해 없음, 지평선 띠 Amber Glow) (달리는 띠 이어 붙이기용; 해는 코드가 하늘에 하나만 고정)
  };
  /* 배우·소품·컷 (사자·생쥐는 모두 왼쪽을 본다)
     - lion_sleep: 뜬 눈으로 나와서 감은 눈(‿)으로 고쳐 칠함
     - lion_head_yawn · _laugh: 앉은 몸까지 나온 그림이라 갈기 둘레 원(clipPath)으로 얼굴·갈기만 오려 씀
     - lion_stand: 다시 뽑은 선 사자 (웃는 눈). 갈기 지름을 누운 사자와 같게, 등 위 (52,-121)에 생쥐가 탄다
     - cut_gnaw: 그물을 다 끊은 뒤 '싹둑' 컷으로 새로 넣음 (목소리 없음, 갉는 소리)
     - cut_net2: 다시 뽑은 그물 컷(그물 아래 걱정하는 얼굴). cut_paw4: 사자 몸에 이어진 앞발이 생쥐 꼬리를 누름(예전 paw2·3은 몸과 떨어진 발이라 안 씀)
     - net: 밤 숲 그물(마젠타 키잉, 밧줄색으로) · hole_stump: 그루터기 구멍
     - paw_pad: 발가락 넷 달린 발 그림에서 오른쪽 끝 발가락을 오려 내(paw_toe) 코드가 그 자리에 따로 얹고 통통 튀게 한다
     - print_lion · print_mouse · tooth_lion · tooth_mouse: 얼굴 없는 오린 종이 그림(큰 발자국/작은 발자국, 큰 송곳니/작은 앞니). 비교 판 위에 카드 틀 없이 바로 얹는다 */
  const ART = {
    lion_sleep: 'v3w/lm_lion_sleep.webp', lion_lie_awake: 'v3w/lm_lion_lie_awake.webp',
    lion_pawup: 'v3w/lm_lion_lie_pawup.webp', lion_pawdown: 'v3w/lm_lion_lie_pawdown.webp', // 앞발 들기·누르기 (2026-10-20)
    lion_head_yawn: 'v3w/lm_lion_head_yawn.webp', lion_head_laugh: 'v3w/lm_lion_head_laugh.webp',
    lion_stand: 'v3w/lm_lion_stand.webp',
    mouse_walk: 'v3w/lm_mouse_walk.webp', mouse_pray: 'v3w/lm_mouse_pray.webp', mouse_run: 'v3w/lm_mouse_run.webp', mouse_gnaw: 'v3w/lm_mouse_gnaw.webp',
    cut_paw: 'v3w/lm_cut_paw4.webp', cut_laugh: 'v3w/lm_cut_laugh.webp', cut_net: 'v3w/lm_cut_net2.webp', cut_gnaw: 'v3w/lm_cut_gnaw.webp',
    net: 'v3w/lm_net.webp', hole_stump: 'v3w/lm_hole_stump.webp',
    lion_paw: 'v3w/lm_lion_paw.webp', paw_pad: 'v3w/lm_paw_pad.webp', paw_toe: 'v3w/lm_paw_toe.webp', print_lion: 'v3w/lm_print_lionc.webp', print_mouse: 'v3w/lm_print_mousec.webp',
    tooth_lion: 'v3w/lm_tooth_lionc.webp', tooth_mouse: 'v3w/lm_tooth_mousec.webp',
    rope_v: 'v3w/lm_rope_v.webp', rope_h: 'v3w/lm_rope_h.webp', stick: 'v3w/lm_stick.webp', // 2026-10-29 코드 도형 → 그림
  };
  const artOK = {}, bgOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  /* 그림 한 장: (x,y)가 왼쪽 위인 w×h 상자 */
  let clipSeq = 0;
  function pic(T, g, key, x, y, w, h, { shadow = true, clip = null } = {}) {
    const u = artUrl(key); if (!u) return null;
    const wrap = T.el('g', shadow ? { filter: 'url(#pp)' } : {}, g);
    const im = T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
    if (clip) { // clip = [cx, cy, r] (그림 상자 안 좌표계와 같은 무대 좌표): 원 안만 보인다
      const id = 'lmClip' + (++clipSeq);
      T.el('circle', { cx: clip[0], cy: clip[1], r: clip[2] }, T.el('clipPath', { id }, wrap));
      im.setAttribute('clip-path', `url(#${id})`);
    }
    return wrap;
  }
  /* 그물 밧줄 클로즈업(2026-10-29 코드 선 → 그림): 밧줄 그림을 무늬로 이어 붙인다. 세로 줄 폭 14(x=120+84i 가 무늬 칸 14와 맞물리게 x=1), 가로 줄 폭 10 */
  function ropeNet(T, parent, xs) {
    const defs = T.el('defs', {}, parent);
    const pv = T.el('pattern', { id: 'lmRopeV', x: 1, y: 70, width: 14, height: 136, patternUnits: 'userSpaceOnUse' }, defs);
    T.el('image', { href: artUrl('rope_v'), x: 0, y: -6, width: 14, height: 14 * 900 / 85, preserveAspectRatio: 'none' }, pv); // 끝의 풀린 올은 빼고 가운데만 이어 붙인다
    const ph = T.el('pattern', { id: 'lmRopeH', x: 100, y: 5, width: 112, height: 10, patternUnits: 'userSpaceOnUse' }, defs);
    T.el('image', { href: artUrl('rope_h'), x: -4, y: 0, width: 120, height: 10, preserveAspectRatio: 'none' }, ph);
    const hR = T.el('g', { filter: 'url(#pp)' }, parent);
    [150, 250, 350, 450].forEach(y => T.el('rect', { x: 100, y: y - 5, width: 800, height: 10, fill: 'url(#lmRopeH)' }, hR));
    const ropes = xs.map(x => {
      const g = T.el('g', { filter: 'url(#pp)' }, parent);
      const R = (y, h) => T.el('rect', { x: x - 7, y, width: 14, height: h, fill: 'url(#lmRopeV)' }, g);
      const top = R(70, 426), mid = R(496, 18), bot = R(514, 26);
      top.style.transformBox = 'view-box'; top.style.transformOrigin = `${x}px 70px`;
      return { x, g, top, bot, mid };
    });
    return { hR, ropes };
  }
  /* 생쥐 받침 막대(2026-10-29 코드 네모 → 그림): (mx, my)=생쥐 발끝, 길이 160 나무 막대를 눕혀 깐다 */
  function mouseStick(T, mx, my) { pic(T, T.el('g', { transform: `translate(${mx},${my + 11}) rotate(-90)` }, T.world), 'stick', -160 * 119 / 600 / 2, -80, 160 * 119 / 600, 160); }
  const BG_EDGE = { savanna: ['#8fbabc', '#a78540'], grass: ['#9cc8d0', '#d8a471'], night_forest: ['#292f58', '#2d393a'], night_net: ['#463778', '#272422'], morning: ['#93b8d3', '#a98147'], morning_nosun: ['#fab082', '#81673f'], board: ['#a5c5de', '#d09555'] };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  function bgImage(T, key, parent) {
    const u = bgUrl(key); if (!u) return null;
    const { x, y, w, h } = BGBOX, [top, bot] = BG_EDGE[key];
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, T.bg);
    T.el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, T.bg);
    return T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent || T.bg);
  }
  /* 층 소품(VISUAL_PLAN §1): 배경을 꾸미는 종이 조각, 누름 없음. 중간 층은 T.bg(배우 뒤), 앞 가림 층은 T.fx(배우 위).
     (cx, y) = 가운데·발끝(top 이면 윗변). 자리는 인물 발끝·생쥐 자리를 피해 화면 가장자리에 둔다 */
  const LAYER = { grass_front: 1.205, acacia_branch_top: 1.3283, daisy_giant: .5783, termite_mound: .78, fern_night_front: 1.1667, rocks_front: 1.37 };
  function layer(T, k, cx, y, h, { front = false, flip = false, top = false } = {}) {
    const w = h * LAYER[k], g = T.el('g', { filter: 'url(#pp)', style: 'pointer-events:none' }, front ? T.fx : T.bg);
    if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
    return T.el('image', { href: AS + 'v3w/lm_layer_' + k + '.webp', x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, g);
  }
  /* 누운 사자 그림 (왼쪽을 봄, 발끝 0): 갈기 지름이 두 그림에서 같도록 같은 배율. 갈기 가운데 ≈ 임시 도형 머리 자리(-100, -96) */
  const LIE = {
    lion_sleep: { x: -189.7, y: -177.2, w: 267.8, h: 177.2, head: [-100, -92.6], nose: [-109, -76.5] },
    lion_lie_awake: { x: -189.9, y: -202.9, w: 272.2, h: 202.9, head: [-100, -117.9] },
    lion_pawup: { x: -189.9, y: -202.9, w: 272.2, h: 202.9, head: [-100, -117.9] }, // 눈 뜬 그림과 같은 틀에서 뽑음
    lion_pawdown: { x: -189.9, y: -202.9, w: 272.2, h: 202.9, head: [-100, -117.9] },
  };
  /* 사자 큰 얼굴 (가운데 0,0, 갈기 지름 176 = 임시 도형과 같음) */
  /* 새 그림은 앉은 몸까지 나온 사자라서 갈기 둘레 원(반지름 = 갈기 반지름)으로만 오려 얼굴·갈기만 쓴다. [x, y, w, h, 원 반지름] */
  const HEAD = { lion_head_yawn: [-88.8, -78.5, 216, 241.7, 86.5], lion_head_laugh: [-89, -82.7, 218, 236, 85] };
  /* 생쥐 자세: [키, 발끝 가운데(폭 비율), 폭/높이]. 눈 크기로 머리 크기를 맞춤(빌기·갉기는 원본이 조금 크게 나와 줄임) */
  const MOUSE = { walk: [58, .5, 1.3333], pray: [64, .5, .9356], run: [58, .5, 1.3867], gnaw: [66, .45, .9933] };

  /* ================= 캐릭터 (임시 도형) ================= */
  /* 사자 얼굴: 가운데가 (0,0). 눈·입 표정을 바꿀 수 있다 */
  function drawHead(T, g, { greybox = false } = {}) {
    const { el, paper } = T;
    const H = el('g', {}, g);
    if (!greybox && (artUrl('lion_head_yawn') || artUrl('lion_head_laugh'))) { // 그림: 웃는 눈(happy)이면 웃는 얼굴, 나머지는 졸린 하품 얼굴
      const faces = {};
      Object.entries(HEAD).forEach(([k, [x, y, w, h, r]]) => { const f = pic(T, H, k, x, y, w, h, { clip: [0, 0, r] }); if (f) faces[k] = f; });
      const bub = el('g', { transform: 'translate(12,20)' }, H);
      const bubble = el('circle', { r: 1, fill: C.snow, opacity: .8 }, bub);
      bubble.style.transformBox = 'view-box'; bubble.style.transformOrigin = '0 0'; bubble.style.transform = 'scale(0)';
      const p = { H, bubble, art: true,
        eyes(s) { const want = s === 'happy' && faces.lion_head_laugh ? 'lion_head_laugh' : faces.lion_head_yawn ? 'lion_head_yawn' : 'lion_head_laugh';
          Object.entries(faces).forEach(([k, n]) => { n.style.display = k === want ? '' : 'none'; }); },
        mouth() {} };
      p.eyes('sleepy');
      return p;
    }
    const petals = [];
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; petals.push(['circle', { cx: Math.cos(a) * 62, cy: Math.sin(a) * 62, r: 26, fill: i % 2 ? C.mane : C.maneDk }]); }
    paper(H, [...petals, ['circle', { r: 66, fill: C.mane }]]);
    paper(H, [['circle', { cx: -34, cy: -34, r: 14, fill: C.lion }], ['circle', { cx: 34, cy: -34, r: 14, fill: C.lion }],
      ['circle', { cx: -34, cy: -34, r: 7, fill: C.bark }], ['circle', { cx: 34, cy: -34, r: 7, fill: C.bark }]]);
    paper(H, [['circle', { cy: 4, r: 46, fill: C.lion }]]);
    [-30, 30].forEach(x => el('circle', { cx: x, cy: 16, r: 7, fill: C.pink, opacity: .7 }, H));
    const eyes = {
      open: el('g', {}, H), shut: el('g', {}, H), sleepy: el('g', {}, H), happy: el('g', {}, H),
    };
    [-17, 17].forEach(x => {
      el('circle', { cx: x, cy: -6, r: 7, fill: C.ink }, eyes.open); el('circle', { cx: x + 2, cy: -8, r: 2.4, fill: '#fff' }, eyes.open);
      el('path', { d: `M${x - 9} -6 Q${x} 2 ${x + 9} -6`, stroke: C.ink, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, eyes.shut);
      el('ellipse', { cx: x, cy: -4, rx: 7, ry: 3.5, fill: C.ink }, eyes.sleepy);
      el('path', { d: `M${x - 9} -8 L${x + 9} -8`, stroke: C.lionDk, 'stroke-width': 4, 'stroke-linecap': 'round' }, eyes.sleepy);
      el('path', { d: `M${x - 9} -3 Q${x} -13 ${x + 9} -3`, stroke: C.ink, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, eyes.happy);
    });
    paper(H, [['circle', { cx: -11, cy: 20, r: 14, fill: C.cream }], ['circle', { cx: 11, cy: 20, r: 14, fill: C.cream }]]);
    el('path', { d: 'M-10 6 L10 6 L0 16 Z', fill: C.bark }, H);
    const mouth = { smile: el('path', { d: 'M-8 34 Q0 40 8 34', stroke: C.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, H),
      open: el('ellipse', { cx: 0, cy: 38, rx: 14, ry: 11, fill: C.bean }, H) };
    // 콧방울 (배율로 부풀린다)
    const bub = el('g', { transform: 'translate(12,20)' }, H);
    const bubble = el('circle', { r: 1, fill: C.snow, opacity: .8, stroke: '#cfe0ea', 'stroke-width': .15 }, bub);
    bubble.style.transformBox = 'view-box'; bubble.style.transformOrigin = '0 0'; bubble.style.transform = 'scale(0)';
    const p = {
      H, bubble,
      eyes(s) { Object.entries(eyes).forEach(([k, n]) => n.style.display = k === s ? '' : 'none'); },
      mouth(s) { mouth.smile.style.display = s === 'smile' ? '' : 'none'; mouth.open.style.display = s === 'open' ? '' : 'none'; },
    };
    p.eyes('open'); p.mouth('smile');
    return p;
  }
  /* 누운 사자 (왼쪽을 본다, 발끝 0) */
  function drawLionLie(T, g) {
    const { el, paper } = T;
    if (artUrl('lion_sleep') || artUrl('lion_lie_awake')) {
      // 그림: 눈 감음(shut) = 자는 그림, 나머지 = 눈 뜬 그림. 입은 그림 그대로. 머리·발 움직임은 사자 전체(hg)가 맡는다
      const hg = el('g', {}, g); hg.style.transformBox = 'view-box'; hg.style.transformOrigin = '0px 0px';
      const imgs = {};
      Object.entries(LIE).forEach(([k, b]) => { const f = pic(T, hg, k, b.x, b.y, b.w, b.h); if (f) imgs[k] = f; });
      const S = LIE.lion_sleep;
      const H = el('g', {}, hg); // 누를 자리: 얼굴 둘레
      el('circle', { cx: S.head[0], cy: S.head[1], r: 92, fill: '#fff', opacity: 0 }, H);
      const bub = el('g', { transform: `translate(${S.nose[0]},${S.nose[1]})` }, H);
      const bubble = el('circle', { r: 1, fill: C.snow, opacity: .85, stroke: '#cfe0ea', 'stroke-width': .15 }, bub);
      bubble.style.transformBox = 'view-box'; bubble.style.transformOrigin = '0 0'; bubble.style.transform = 'scale(0)';
      const p = { H, hg, paws: hg, bubble, art: true,
        eyes(s) { const want = imgs[s] ? s : s === 'shut' && imgs.lion_sleep ? 'lion_sleep' : imgs.lion_lie_awake ? 'lion_lie_awake' : 'lion_sleep'; // s = 그림 이름(lion_pawup 등)도 받는다
          Object.entries(imgs).forEach(([k, n]) => { n.style.display = k === want ? '' : 'none'; }); bub.style.display = want === 'lion_sleep' ? '' : 'none'; },
        mouth() {} };
      p.eyes('open');
      return p;
    }
    el('path', { d: 'M140 -30 Q200 -4 236 -14', stroke: C.lion, 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, g);
    paper(g, [['ellipse', { cx: 248, cy: -16, rx: 17, ry: 13, fill: C.maneDk }]]);
    paper(g, [['ellipse', { cx: 120, cy: -12, rx: 38, ry: 15, fill: C.lionDk }], ['ellipse', { cx: 30, cy: -52, rx: 118, ry: 52, fill: C.lion }]]);
    const hg = el('g', { transform: 'translate(-100,-96)' }, g);
    const head = drawHead(T, hg);
    const paws = el('g', {}, g);
    paws.style.transformBox = 'view-box'; paws.style.transformOrigin = '0 0';
    paper(paws, [['ellipse', { cx: -150, cy: -12, rx: 40, ry: 15, fill: C.lion }], ['ellipse', { cx: -108, cy: -10, rx: 36, ry: 14, fill: C.lionDk }]]);
    return { ...head, hg, paws };
  }
  /* 누운 사자 얼굴 위에 하품·웃음 얼굴을 얹는다 (갈기 지름이 같음). set('yawn'|'laugh'|null) */
  function lionFace(T, hg, art) {
    if (!art) return { set() {} };
    const g = T.el('g', { transform: `translate(${LIE.lion_lie_awake.head[0]},${LIE.lion_lie_awake.head[1]})` }, hg);
    const h = drawHead(T, g);
    g.style.display = 'none';
    return { set(k) { if (!k) { g.style.display = 'none'; return; } g.style.display = ''; h.eyes(k === 'laugh' ? 'happy' : 'sleepy'); } };
  }
  /* 선 사자 (왼쪽을 본다, 발끝 0). 등 위 (40,-152) */
  /* 선 사자 그림 (왼쪽을 봄, 발끝 0): 폭 312, 키 241, 갈기 가운데 (-58,-128), 등 위 (52,-121) */
  const STAND = { x: -153, y: -249, w: 273, h: 249, head: [-58, -171], back: [33, -132] };
  function drawLionStand(T, g) {
    const { el, paper } = T;
    if (artUrl('lion_stand')) {
      const hg = el('g', {}, g); hg.style.transformBox = 'view-box'; hg.style.transformOrigin = '0px 0px';
      pic(T, hg, 'lion_stand', STAND.x, STAND.y, STAND.w, STAND.h);
      const H = el('g', {}, hg); el('circle', { cx: STAND.head[0], cy: STAND.head[1], r: 100, fill: '#fff', opacity: 0 }, H);
      el('rect', { x: STAND.x, y: -150, width: STAND.w, height: 150, fill: '#fff', opacity: 0 }, hg); // 누를 자리 (몸)
      return { H, hg, paws: hg, bubble: el('g', {}, g), art: true, back: STAND.back, eyes() {}, mouth() {} };
    }
    el('path', { d: 'M140 -112 Q200 -120 204 -172', stroke: C.lion, 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, g);
    paper(g, [['ellipse', { cx: 204, cy: -182, rx: 14, ry: 17, fill: C.maneDk }]]);
    paper(g, [['rect', { x: 96, y: -92, width: 26, height: 92, rx: 11, fill: C.lionDk }], ['rect', { x: -46, y: -92, width: 26, height: 92, rx: 11, fill: C.lionDk }]]);
    paper(g, [['ellipse', { cx: 30, cy: -104, rx: 118, ry: 50, fill: C.lion }],
      ['rect', { x: 126, y: -92, width: 26, height: 92, rx: 11, fill: C.lion }], ['rect', { x: -80, y: -92, width: 26, height: 92, rx: 11, fill: C.lion }]]);
    const hg = el('g', { transform: 'translate(-100,-150)' }, g);
    return { ...drawHead(T, hg, { greybox: true }), hg }; // 선 사자 그림이 올 때까지 얼굴도 임시 도형으로 (몸과 맞춤)
  }
  /* 생쥐 (왼쪽을 본다, 발끝 0, 키 약 62) */
  function drawMouse(T, g) {
    const { el, paper } = T;
    if (artUrl('mouse_walk')) {
      // 그림: 자세 넷을 겹쳐 두고 하나만 보인다. 예전 부품(teeth·arms·pray)의 opacity를 바꾸던 코드가 그대로 자세를 바꾸도록 같은 꼴로 둔다
      const ears = el('g', {}, g); ears.style.transformBox = 'fill-box'; ears.style.transformOrigin = '50% 100%';
      const looks = {};
      Object.entries(MOUSE).forEach(([k, [h, fx, as]]) => { const w = h * as; const f = pic(T, ears, 'mouse_' + k, -w * fx, -h, w, h); if (f) looks[k] = f; });
      let cur = 'walk';
      const look = k => { cur = looks[k] ? k : 'walk'; Object.entries(looks).forEach(([n, f]) => { f.style.display = n === cur ? '' : 'none'; }); };
      look('walk');
      const sw = k => ({ setAttribute(a, v) { if (a !== 'opacity') return; if (+v) look(k); else if (cur === k) look('walk'); } });
      return { ears, teeth: sw('gnaw'), arms: sw('walk'), pray: sw('pray'), look, art: true };
    }
    el('path', { d: 'M22 -12 Q48 -4 54 -24 Q58 -40 72 -36', stroke: C.pink, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, g);
    paper(g, [['ellipse', { cx: -8, cy: -3, rx: 8, ry: 4, fill: C.pink }], ['ellipse', { cx: 14, cy: -3, rx: 8, ry: 4, fill: C.pink }],
      ['ellipse', { cx: 4, cy: -21, rx: 25, ry: 18, fill: C.mouse }], ['ellipse', { cx: 0, cy: -16, rx: 13, ry: 10, fill: C.cream }]]);
    const ears = el('g', {}, g);
    ears.style.transformBox = 'fill-box'; ears.style.transformOrigin = '50% 100%';
    paper(ears, [['circle', { cx: -32, cy: -52, r: 11, fill: C.mouse }], ['circle', { cx: -8, cy: -54, r: 11, fill: C.mouse }],
      ['circle', { cx: -32, cy: -52, r: 6, fill: C.pink }], ['circle', { cx: -8, cy: -54, r: 6, fill: C.pink }]]);
    paper(g, [['circle', { cx: -20, cy: -36, r: 16, fill: C.mouse }], ['path', { d: 'M-32 -44 L-50 -32 L-30 -24 Z', fill: C.mouse }]]);
    el('circle', { cx: -50, cy: -32, r: 4, fill: C.ink }, g);
    el('circle', { cx: -26, cy: -40, r: 3.4, fill: C.ink }, g);
    el('path', { d: 'M-42 -30 L-58 -36 M-42 -28 L-58 -26', stroke: C.ink, 'stroke-width': 1.2, opacity: .6 }, g);
    const teeth = el('rect', { x: -44, y: -27, width: 7, height: 8, rx: 1, fill: C.snow, stroke: C.ink, 'stroke-width': 1, opacity: 0 }, g);
    const arms = el('ellipse', { cx: -12, cy: -18, rx: 5, ry: 8, fill: C.mouseDk }, g);
    const pray = el('g', { opacity: 0 }, g);
    el('ellipse', { cx: -34, cy: -22, rx: 5, ry: 8, fill: C.mouseDk }, pray); el('ellipse', { cx: -29, cy: -22, rx: 5, ry: 8, fill: C.mouse }, pray);
    return { ears, teeth, arms, pray };
  }

  function mk(T, parent, x, y, draw, scale = 1) {
    let parts;
    const a = T.actor(parent, x, y, g => { parts = draw(T, g); }, { scale });
    a.parts = parts; return a;
  }

  /* ================= 배경 ================= */
  function savannaBG(T, { morning = false } = {}) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, morning ? 'morning' : 'savanna')) { // 그림: 큰 아카시아(나무 그늘 x≈640)까지 그림 속에
      if (!morning) { layer(T, 'termite_mound', 110, 470, 160); layer(T, 'acacia_branch_top', 960, -24, 180, { front: true, top: true }); layer(T, 'rocks_front', 20, 600, 90, { front: true }); }
      return true;
    }
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: morning ? '#F6E2B0' : C.sky }, b);
    el('circle', { cx: morning ? 160 : 860, cy: morning ? 140 : 90, r: 44, fill: morning ? C.amber : '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 380 Q120 300 380 360 Q650 290 1200 370 V600 H-200 Z', fill: '#E3C88A' }]]);
    paper(b, [['rect', { x: -200, y: 430, width: 1400, height: 300, fill: C.ground }]]);
  }
  function acacia(T, parent, x, s = 1) {
    const g = T.el('g', { transform: `translate(${x},0)` }, parent);
    T.paper(g, [['rect', { x: -14 * s, y: 470 - 290 * s, width: 28 * s, height: 290 * s, fill: C.bark }],
      ['ellipse', { cx: 0, cy: 470 - 300 * s, rx: 210 * s, ry: 46 * s, fill: C.pine }], ['ellipse', { cx: 0, cy: 470 - 330 * s, rx: 150 * s, ry: 36 * s, fill: C.leaf }]]);
    return g;
  }
  function tufts(T, parent, xs, y = 470, color = C.leaf) {
    xs.forEach(x => T.paper(parent, [['path', { d: `M${x - 18} ${y} L${x - 8} ${y - 26} L${x} ${y} L${x + 8} ${y - 32} L${x + 18} ${y} Z`, fill: color }]]));
  }
  /* 생쥐 눈높이: 풀이 숲처럼 커 보인다 */
  function grassForestBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'grass')) { // 거인 데이지는 사자 뒤 오른쪽, 앞 풀 포기는 왼쪽 끝 아래(생쥐 발끝 y 500 보다 낮게)
      layer(T, 'daisy_giant', 975, 560, 260); layer(T, 'grass_front', 0, 610, 100, { front: true });
      return true;
    }
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: '#EFE3B8' }, b);
    for (let i = 0; i < 16; i++) {
      const x = -40 + i * 72, h = 330 + (i * 53 % 4) * 45;
      paper(b, [['path', { d: `M${x} 520 Q${x + 12} ${520 - h / 2} ${x + 40} ${520 - h} Q${x + 30} ${520 - h / 2} ${x + 46} 520 Z`, fill: i % 2 ? '#A9BF7E' : '#8FAE6E' }]]);
    }
    paper(b, [['circle', { cx: 150, cy: 150, r: 34, fill: C.snow }], ['circle', { cx: 150, cy: 150, r: 13, fill: C.gold }], ['rect', { x: 147, y: 182, width: 6, height: 320, fill: C.pine }]]);
    paper(b, [['rect', { x: -200, y: 496, width: 1400, height: 200, fill: C.ground }]]);
  }
  function boardBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'board')) return true; // 그림: 크림 판은 무대 x 288~757, y 93~405 (받침 선반 y 410~440)
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.cream }, b);
    paper(b, [['rect', { x: 60, y: 40, width: 880, height: 440, rx: 16, fill: '#EFE0BD' }]]);
    paper(b, [['rect', { x: -200, y: 470, width: 1400, height: 200, fill: '#B98F4A' }]]);
  }
  /* 밤 숲 하이앵글: 위에서 내려다본 땅 */
  function nightHighBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'night_forest')) { layer(T, 'fern_night_front', 0, 610, 100, { front: true }); return true; } // 숲 공터(풀밭)는 무대 y 345~540, 가운데 x≈500. 고사리는 생쥐(120,505) 아래 왼쪽 끝
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: '#223227' }, b);
    paper(b, [['ellipse', { cx: 520, cy: 330, rx: 360, ry: 200, fill: '#34493A' }]]);
    [[40, 40, 120], [960, 60, 140], [-10, 380, 110], [990, 470, 130], [300, -40, 90], [720, 560, 100]].forEach(([x, y, r]) =>
      paper(b, [['circle', { cx: x, cy: y, r, fill: '#172219' }], ['circle', { cx: x - r * .2, cy: y - r * .2, r: r * .6, fill: '#1E3024' }]]));
    [[150, 480], [860, 250], [260, 140]].forEach(([x, y]) => paper(b, [['ellipse', { cx: x, cy: y, rx: 26, ry: 16, fill: '#5A5A52' }]]));
  }
  function nightNetBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'night_net')) { layer(T, 'fern_night_front', 1000, 610, 100, { front: true, flip: true }); return true; }
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.indigo }, b);
    el('circle', { cx: 900, cy: 70, r: 36, fill: C.cream }, b);
    paper(b, [['rect', { x: -200, y: 470, width: 1400, height: 300, fill: '#2B3B2E' }]]);
  }

  /* 화면 고정 세기 판 (카메라 영향 없음) */
  function counter(T, n) {
    const ui = document.getElementById('stage');
    const g = T.el('g', {}, ui);
    T.paper(g, [['rect', { x: 500 - n * 23 - 14, y: 70, width: n * 46 + 28, height: 52, rx: 26, fill: C.cream, stroke: C.gold, 'stroke-width': 4 }]]);
    const dots = [];
    // 세로 화면(양옆이 잘림): 판이 보이는 폭보다 넓으면 가운데를 기준으로 줄인다. 가로는 그대로
    const fit = Math.min(1, (T.viewWidth() - 24) / (n * 46 + 36));
    if (fit < 1) g.setAttribute('transform', `translate(500 70) scale(${fit.toFixed(3)}) translate(-500 -70)`);
    for (let k = 0; k < n; k++) {
      const x = 500 + (k - (n - 1) / 2) * 46;
      const c = T.el('circle', { cx: x, cy: 96, r: 17, fill: '#fff', stroke: C.gold, 'stroke-width': 3 }, g);
      const t = T.el('text', { x, y: 104, 'text-anchor': 'middle', 'font-size': 22, fill: C.cream, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: k + 1, opacity: 0 }, g);
      dots.push([c, t]);
    }
    return {
      fill(k) { const [c, t] = dots[k]; c.setAttribute('fill', C.persimmon); t.setAttribute('opacity', 1);
        c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 360 }); c.style.transformBox = 'fill-box'; c.style.transformOrigin = '50% 50%'; },
      remove() { g.remove(); },
    };
  }

  /* ================= 소리 ================= */
  const roar = (T, vol = .45) => AudioFX.animal('tiger', vol) || (() => { T.tone([220, 140], .8, { type: 'sawtooth', vol: .08 }); T.tone([110, 80], .8, { type: 'triangle', vol: .1 }); })();
  const squeak = (T, f = 1500) => { T.tone([f, f * 1.3], .09, { type: 'sine', vol: .14 }); T.tone([f * 1.1, f * 1.4], .08, { type: 'sine', vol: .12, when: .11 }); };
  const snore = T => T.tone([90, 130], .9, { type: 'triangle', vol: .1 });
  const gnaw = T => AudioFX.sfx('chop', .35) || T.tone([2400, 1800], .06, { type: 'square', vol: .06 });

  /* ================= 이야기 ================= */
  async function run(T) {
    /* 시작 음악 (2026-10-28): 첫 장면 시작에 12초 깔고, 첫 장면 전환에서 끈다. 읽어 주기는 음량 .25 */
    const intro = (() => {
      let h = null, on = true;
      const stop = () => { on = false; try { h && h.stop(.8); h = null; } catch (e) { /* 무시 */ } };
      const go = (delay = 0) => {
        const f = () => { try { if (!on) return; const o = { vol: T.reading() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }; h = AudioFX.ambient('intro_playful', o); if (!h) setTimeout(() => { try { if (on) h = AudioFX.ambient('intro_playful', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
        if (delay) setTimeout(f, delay); else f();
      };
      try { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stop(); return sc0.apply(this, a); }; } catch (e) { /* 무시 */ }
      return { go, stop };
    })();
    const { el, sleep, say, camTo, camWide, camSnap, josa } = T;
    const LION = '사자', MOUSE = '생쥐';
    /* ---------- 효과음 (2026-10-28 SFX 배선): 놀이=만화 효과음, 읽어 주기=조용한 장소 소리만 ---------- */
    try { AudioFX.preloadSfx(['finale_happy', 'intro_playful', 'level_win', 'birds_chirp_1', 'birds_chirp_2', 'crickets_night_1', 'whistle_wobble', 'surprise_sting', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'marimba_6', 'marimba_7', 'marimba_8', 'party_horn']); } catch (e) { /* 소리 없이도 진행 */ }
    /* 클래식 한 토막(2026-10-31 사용자 지시): sounds/sfx/classical_<곡>.mp3 18초, CREDITS.md. 내레이션 동안 엔진이 자동으로 낮춘다(ambient 덕킹). 장면이 바뀌면 이 동화의 배경 소리 정리가 같이 끈다 */
    const classical = n => { try { const o = { vol: T.reading() ? .2 : .27, loop: false, fadeIn: .6, dur: 18 }; if (!AudioFX.ambient('classical_' + n, o)) setTimeout(() => { try { AudioFX.ambient('classical_' + n, o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
    try { AudioFX.preloadSfx(['classical_bach_cello_pizz']); } catch (e) { /* 무시 */ }
    const isRead = () => { try { return !!T.reading(); } catch (e) { return false; } };
    let ambTok = 0; // 장면이 바뀌면 이전 재시도는 버린다
    const amb = (n, vol = .28, dur = 4) => { try { AudioFX.stopAmbient(.4); if (isRead()) { vol = vol * .8; dur = Math.min(dur, 5); } const tok = ++ambTok; if (!AudioFX.ambient(n, { vol, dur })) setTimeout(() => { if (tok === ambTok) { try { AudioFX.ambient(n, { vol, dur }); } catch (e) { /* 무시 */ } } }, 900); } catch (e) { /* 무시 */ } };
    const sfx = (n, v = .9) => { try { if (isRead()) v *= .8; const r = AudioFX.sfx(n, v); if (r === false) console.warn('[sfx] 아직 못 불러옴:', n); return r; } catch (e) { return false; } };
    const short = (n, vol = .6, dur = 2) => { try { if (isRead()) vol *= .8; AudioFX.ambient(n, { vol, loop: false, fadeIn: .05, dur }); } catch (e) { /* 무시 */ } }; // 긴 소리는 앞 몇 초만 (내레이션 밑에서 저절로 낮아지고 사라진다)
    const stopAmb = () => { ambTok++; try { AudioFX.stopAmbient(.5); } catch (e) { /* 무시 */ } };
    /* 맨 끝 축하 음악(2026-10-31 사용자 지시): 팥죽과 같은 픽사베이 녹음 finale_happy(9.5초, sounds/CREDITS.md). 내레이션 동안은 엔진이 자동으로 낮춘다 */
    let finaleEnd = 0;
    const finaleMusic = () => { try { const o = { vol: T.reading() ? .3 : .5, loop: false, fadeIn: .2, dur: 9.5 }; finaleEnd = Date.now() + 9500; if (!AudioFX.ambient('finale_happy', o)) setTimeout(() => { try { AudioFX.ambient('finale_happy', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
    const finaleWait = () => (finaleEnd ? new Promise(r => setTimeout(r, Math.max(0, Math.min(6000, finaleEnd - Date.now() - 600)))) : Promise.resolve());

    /* 그림 미리 불러오기: 첫 장면 그림·생쥐를 기다리고(최대 3초) 나머지는 뒤에서. 못 불러온 그림은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads['bg_' + k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    Object.keys(ART).filter(k => ART[k]).forEach(k => { loads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    await Promise.race([Promise.all([loads.bg_savanna, loads.lion_sleep, loads.lion_lie_awake, loads.mouse_walk, loads.mouse_pray, loads.mouse_run, loads.mouse_gnaw,
      loads.lion_head_yawn, loads.lion_head_laugh].filter(Boolean)), new Promise(r => setTimeout(r, 3000))]);
    const cutArt = (key, o = {}) => artUrl(key) && T.cutImage([{ src: artUrl(key), ...o }], o);

    /* ================= 읽어 주기 (docs/READ_MODE.md): read_script_el.json 의 동사 → 놀이판 그림·연출을 누르기 없이 감싼 얇은 함수 =================
       set 은 놀이판 장면 배경과 사자·생쥐 자리를 깐다. 대본의 savanna 는 처음(낮잠)만 초원 그림이고, 두 번째·세 번째(잡혔다·하하하)는 놀이판처럼 풀숲(생쥐 눈높이)에 사자 앞발이
       생쥐 꼬리를 누른 자리, night_net 은 처음이 밤 숲 하이앵글(그물에 걸림), 두 번째가 그물 클로즈업(갉기)이다. 세기 놀이(숫자 소리·세기 판)는 뺐다. */
    const inst = () => T.readInstant();
    const rPt = () => T.portrait();
    const rvo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };
    const L1 = '사자', M1 = '생쥐';
    let rScene = '', rSav = 0, rNight = 0, rLion = null, rMouse = null, rHead = null, rBreathe = null, rSnore = null, rStruggle = null, rLaugh = null, rScroll = null, rRider = null, rBoard = 0, rRopes = [], rHR = null, rHeadTimer = null, rRopeDone = 0, rSx = 0;
    const rOn = a => a && a.pos && a.pos.isConnected;
    const stopAll = () => {
      [rBreathe, rStruggle, rLaugh].forEach(a => { try { a && a.cancel(); } catch (e) { /* 이미 끝남 */ } });
      rBreathe = rStruggle = rLaugh = null;
      if (rSnore) { clearInterval(rSnore); rSnore = null; }
      if (rHeadTimer) { clearTimeout(rHeadTimer); rHeadTimer = null; }
    };
    const startBreathe = () => { if (rLion && rLion.parts.bubble) rBreathe = rLion.parts.bubble.animate([{ transform: 'scale(3)' }, { transform: 'scale(9)' }], { duration: 1300, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }); };
    const rFollow = (x, dur) => { if (rPt() && !inst()) camTo(x, 280, 1, dur); };
    const POPAT = { R02: { '쭈르륵~': [760, 150] }, R03: { '탁!': [830, 380], '제발요~': [880, 380] }, R04: { '하하하!': [690, 170], '쏙!': [860, 420], '다다다!': [930, 390] }, R08: { '다다다!': [260, 300] } };
    const POPC = { '퐁!': C.indigo, '쭈르륵~': C.bean, '제발요~': C.pine, '쏙!': C.pine, '다다다!': C.bark, '사각!': C.bean, '어흥~': C.persimmon, '어흥!': undefined, '탁!': C.bean };
    const popKey = () => (rScene === 'grass' ? 'R02' : rScene === 'caught' ? 'R03' : rScene === 'savanna' ? 'R01' : rScene === 'morning' ? 'R08' : rScene);
    const newMouse = (x, y, s, face) => { if (rOn(rMouse)) rMouse.pos.remove(); rMouse = mk(T, T.world, x, y, drawMouse, s); rMouse.face(face || 'right'); return rMouse; };
    const R = {
      set(key) {
        stopAll(); T.clear(); camSnap(500, 280, 1);
        rLion = rMouse = rHead = rScroll = rRider = null; rRopes = []; rHR = null; rBoard = 0; rRopeDone = 0; rSx = 0;
        if (key === 'savanna') rSav++;
        if (key === 'night_net') rNight++;
        rScene = key === 'savanna' ? (rSav === 1 ? 'savanna' : 'caught') : key === 'night_net' ? (rNight === 1 ? 'night1' : 'night2') : key;
        if (rScene === 'savanna') {
          const art = savannaBG(T);
          rLion = art ? mk(T, T.world, 620, 410, drawLionLie, 1.3) : null;
          if (!rLion) { acacia(T, T.bg, 640, 1); rLion = mk(T, T.world, 640, 492, drawLionLie, 1.3); }
          rLion.face('right'); rLion.parts.eyes('shut'); startBreathe();
          if (rPt()) camSnap(610, 280, 1);
          rSnore = setInterval(() => snore(T), 2600);
        } else if (rScene === 'grass') {
          grassForestBG(T);
          rLion = mk(T, T.world, 640, 500, drawLionLie, 1.8); rLion.face('right'); rLion.parts.eyes('shut');
          if (rLion.parts.art) rLion.place(520, 500);
          if (rPt()) camSnap(60, 280, 1);
        } else if (rScene === 'caught') {
          grassForestBG(T);
          rMouse = mk(T, T.world, 812, 498, drawMouse, 1.6); rMouse.face('left');
          rLion = mk(T, T.world, 640, 500, drawLionLie, 1.8); rLion.face('right'); rLion.parts.eyes('open');
          if (rLion.parts.art) rLion.place(520, 500);
          rHead = lionFace(T, rLion.parts.hg, rLion.parts.art);
          if (rPt()) camSnap(845, 330, 1);
        } else if (rScene === 'board') {
          boardBG(T);
        } else if (rScene === 'night1') {
          nightHighBG(T);
          rLion = mk(T, T.world, 560, 460, drawLionLie, 1.3); rLion.parts.eyes('open');
          pic(T, T.world, 'net', 262, 88, 453, 384);
        } else if (rScene === 'night2') {
          nightNetBG(T);
          rLion = mk(T, T.world, 560, 520, drawLionLie, 2); rLion.parts.eyes('open');
          const RP = [...Array(10)].map((_, i) => 120 + i * 84);
          ({ hR: rHR, ropes: rRopes } = ropeNet(T, T.world, RP)); // 그림: 밧줄 그림 무늬
          newMouse(RP[0] - 52, 545, 1.5, 'right');
          if (rPt()) camSnap(RP[0], 280, 1);
        } else if (rScene === 'morning') {
          if (bgUrl('morning_nosun')) {
            rScroll = el('g', {}, T.bg); rScroll.style.transformBox = 'view-box';
            bgImage(T, 'morning_nosun', rScroll); T.bg.appendChild(rScroll);
            for (let k = 1; k < 5; k++) {
              const t = el('g', { transform: k % 2 ? `translate(${BGBOX.x * 2 + BGBOX.w * (k + 1)},0) scale(-1,1)` : `translate(${BGBOX.w * k},0)` }, rScroll);
              el('image', { href: bgUrl('morning_nosun'), x: BGBOX.x - 1, y: BGBOX.y, width: BGBOX.w + 2, height: BGBOX.h, preserveAspectRatio: 'none' }, t);
            }
            el('image', { href: AS + 'v3w/lm_sun.webp', x: 300, y: 70, width: 120, height: 120, style: 'pointer-events:none' }, T.bg);
          } else {
            savannaBG(T, { morning: true });
            rScroll = el('g', {}, T.bg); rScroll.style.transformBox = 'view-box';
            for (let k = 0; k < 5; k++) acacia(T, rScroll, 950 + k * 700, .8 + (k % 2) * .15);
            tufts(T, rScroll, [...Array(24)].map((_, k) => 60 + k * 140), 495, C.leaf);
          }
          if (rPt()) camSnap(440, 280, 1);
          rLion = mk(T, T.world, 380, 495, drawLionStand, 1.1); rLion.face('right'); rLion.parts.eyes('happy');
          const bk = rLion.parts.back || [40, -152];
          rRider = mk(T, rLion.body, bk[0], bk[1], drawMouse, 1.1);
        }
      },
      lion(verb, a) {
        if (!rOn(rLion)) return;
        const P = rLion.parts;
        if (verb === 'sleep') { P.eyes('shut'); return; }
        if (verb === 'wake') {
          P.eyes('open');
          if (!inst() && rScene === 'grass') { sfx('surprise_sting', .7); P.eyes('sleepy'); P.mouth('open'); roar(T, .25); setTimeout(() => P.mouth('smile'), 600); }
          return;
        }
        if (verb === 'paw') {
          if (a === 'down') {
            if (inst()) { P.eyes('lion_pawdown'); return; }
            P.eyes('lion_pawup');
            return (async () => { await sleep(700); P.eyes('lion_pawdown'); AudioFX.thud(); T.shake(); })();
          }
          if (a === 'up') {
            if (inst()) { P.eyes('lion_pawup'); return; }
            AudioFX.sfx('creak', .5);
            return (async () => { await T.anim(P.hg, [{ rotate: '0deg' }, { rotate: '3deg' }], { duration: 1000, easing: 'ease-out' }); P.eyes('lion_pawup'); T.anim(P.hg, [{ rotate: '3deg' }, { rotate: '8deg' }], 500); })();
          }
        }
        if (verb === 'yawn') {
          if (rHead) rHead.set('yawn'); roar(T, .2);
          rHeadTimer = setTimeout(() => { if (rHead) rHead.set(null); }, 3200); return;
        }
        if (verb === 'laugh') {
          if (rHeadTimer) { clearTimeout(rHeadTimer); rHeadTimer = null; }
          if (rHead) rHead.set('laugh');
          if (inst()) return;
          roar(T, .15);
          rLaugh = P.hg.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 300, iterations: Infinity });
          return;
        }
        if (verb === 'net') {
          if (rScene === 'night1' && !inst()) rStruggle = rLion.body.animate([{ rotate: '0deg' }, { rotate: '-2deg' }, { rotate: '2deg' }, { rotate: '0deg' }], { duration: 500, iterations: Infinity });
          return;
        }
        if (verb === 'free') {
          return (async () => {
            if (rStruggle) { rStruggle.cancel(); rStruggle = null; }
            const fade = [rHR, ...rRopes.map(r => r.g)].filter(Boolean);
            if (inst()) fade.forEach(n => n.remove());
            else await Promise.all(fade.map(n => T.anim(n, [{ opacity: n.getAttribute('opacity') || 1 }, { opacity: 0 }], 600)));
            rLion.pos.remove();
            rLion = mk(T, T.world, 600, 520, drawLionStand, 1.9); rLion.parts.eyes('happy');
            if (rOn(rMouse)) T.world.appendChild(rMouse.pos);
            if (!inst()) { roar(T, .35); T.pop(660, 120, '어흥~', C.persimmon); T.confetti(); rLion.hop(30, 500); }
          })();
        }
        if (verb === 'run') return;
        console.warn('[read] lion 동사 모름', verb, a);
      },
      mouse(verb, a) {
        if (verb === 'hide') { if (rOn(rMouse)) rMouse.pos.remove(); return; }
        if (verb === 'at') {
          const [x, y] = String(a).split(',').map(Number);
          if (rScene === 'caught') return;   /* 놀이판처럼 사자 앞발 밑(오른쪽)에 꼬리가 깔린 자리 */
          if (rScene === 'grass') { newMouse(x, 500, 1.5, 'right'); if (rPt()) camSnap(x, 280, 1); return; }
          if (rScene === 'night1') {
            newMouse(x, 505, 1.2, 'right');
            if (inst()) return;
            squeak(T);
            camTo(T.portrait() ? 140 : 390, T.portrait() ? 470 : 340, T.portrait() ? 2.4 : 1.3, 1000);
            const perk = rMouse.parts.art ? 'scale(1,1.14)' : 'scale(1.45)';
            return T.anim(rMouse.parts.ears, [{ transform: 'scale(1)' }, { transform: perk }, { transform: 'scale(1)' }, { transform: perk }, { transform: 'scale(1)' }], 900);
          }
          newMouse(x, y, 1.3, 'right'); return;
        }
        if (!rOn(rMouse)) return;
        const m = rMouse;
        if (verb === 'hop') {
          const n = +a;
          if (rScene === 'grass') {
            if (n >= 3) {   /* 풀 사이를 폴짝폴짝 */
              if (inst()) return;
              return (async () => { for (let i = 1; i <= 4; i++) { squeak(T, 1400 + Math.random() * 300); m.hop(40, 380); rFollow(60 + i * 42 + 60, 380); await m.move(60 + i * 42, 500, 380); await sleep(120); } })();
            }
            /* 한 번 더 폴짝: 꼬리 → 등 → 갈기 꼭대기까지 올라간다 */
            const climb = rLion.parts.art ? [[393, 459, 380], [427, 380, 420], [496, 344, 450], [555, 333, 350], [574, 261, 400], [628, 211, 400], [700, 187, 350]]
              : [[232, 488, 380], [372, 376, 500], [568, 302, 500], [690, 250, 400], [815, 170, 450]];
            if (inst()) { const [x, y] = climb[climb.length - 1]; m.place(x, y); return; }
            return (async () => { for (const [x, y, d] of climb) { squeak(T, 1500); m.hop(24, d); rFollow(x, d); await m.move(x, y, d); } })();
          }
          if (inst()) return;
          squeak(T, 1700); m.hop(rScene === 'night1' ? 20 : 24, 300);
          if (rScene === 'night1') return (async () => { await camWide(700); await m.move(300, 520, 900); })();
          return;
        }
        if (verb === 'slide') {
          const slide = rLion.parts.art ? [[831, 265], [850, 341], [915, 500]] : [[925, 250], [975, 360], [880, 500]];
          if (inst()) { m.place(slide[2][0], slide[2][1]); return; }
          short('whistle_wobble', .6, 1.6);
          return (async () => {
            m.body.style.transform = 'rotate(-35deg)';
            T.tone([1400, 500], .9, { type: 'sine', vol: .12 });
            await m.move(slide[0][0], slide[0][1], 260, 'ease-in');
            await m.move(slide[1][0], slide[1][1], 240, 'linear');
            rFollow(760, 500);
            await m.move(slide[2][0], slide[2][1], 320, 'ease-out');
            m.body.style.transform = ''; squeak(T, 1700); m.hop(30);
          })();
        }
        if (verb === 'plead') {
          m.face('right'); m.parts.arms.setAttribute('opacity', 0); m.parts.pray.setAttribute('opacity', 1);
          if (!inst()) { squeak(T, 1600); m.hop(16); }
          return;
        }
        if (verb === 'out') {
          if (rLaugh) { rLaugh.cancel(); rLaugh = null; }
          m.parts.arms.setAttribute('opacity', 1); m.parts.pray.setAttribute('opacity', 0); m.face('right');
          if (inst()) { m.place(960, 498); return; }
          T.tone([600, 1600], .25, { type: 'sine', vol: .14 });
          return m.move(960, 498, 500, 'ease-in');
        }
        if (verb === 'run') {
          if (m.parts.look) m.parts.look('run');
          if (inst()) return;
          squeak(T); return m.move(1250, 498, 700, 'ease-in');
        }
        if (verb === 'gnaw') { if (m.parts.look) m.parts.look('gnaw'); return; }
        if (verb === 'ride') return;
        console.warn('[read] mouse 동사 모름', verb, a);
      },
      bubble(verb) {
        if (verb !== 'pop' || !rOn(rLion)) return;
        if (inst()) return;
        return (async () => {
          if (rBreathe) { rBreathe.cancel(); rBreathe = null; }
          T.tone([200, 600], .9, { type: 'sine', vol: .12 });
          await T.anim(rLion.parts.bubble, [{ transform: 'scale(9)' }, { transform: 'scale(30)' }], { duration: 900, easing: 'ease-out' });
          rLion.parts.bubble.style.transform = 'scale(0)';
          AudioFX.sfx('pop') || T.tone(900, .08);
          await rLion.parts.hg.animate([{ translate: '0 0' }, { translate: '0 -6px' }, { translate: '0 0' }], 400).finished;
          startBreathe();
        })();
      },
      board(verb) {
        const PT = rPt();
        const owner = (RG, who, x, OX) => who === L1
          ? (() => { const g = el('g', { transform: `translate(${x + OX},390) scale(.75)` }, RG); drawHead(T, g).eyes('happy'); return g; })()
          : mk(T, RG, x + OX, 450, drawMouse, 1.3).pos;
        const cardsRound = (draw) => {
          const CW = PT ? 240 : 300, CK = CW / 300, OX = PT ? 95 : 100;
          const RG = el('g', { transform: `translate(522,249) scale(${PT ? .82 : .76}) translate(-500,-260)` }, T.world);
          const CL = PT ? 375 : 345, CR = PT ? 625 : 655;
          const card = (x, drawIn) => {
            const g = el('g', {}, RG);
            const inner = CK < 1 ? el('g', { transform: `translate(${x},260) scale(${CK}) translate(${-x},-260)` }, g) : g;
            drawIn(inner, x, 260); return g;
          };
          const cl = card(CL, draw[L1]), cm = card(CR, draw[M1]);
          owner(RG, L1, CL, OX); owner(RG, M1, CR, OX);
          if (!inst()) { cl.animate([{ translate: '0 0' }, { translate: '0 -14px' }, { translate: '0 0' }], 500); setTimeout(() => cm.animate([{ translate: '0 0' }, { translate: '0 -14px' }, { translate: '0 0' }], 500), 500); }
        };
        if (verb === 'hole') {
          T.world.innerHTML = '';
          const HP = PT, HX = 500, LX = HP ? 300 : 230, SMX = HP ? 690 : 790, KS = HP ? .75 : 1;
          if (!pic(T, T.world, 'hole_stump', HX - 158 * KS, 470 - 257 * KS, 320 * KS, 260 * KS)) T.paper(T.world, [['rect', { x: HX - 70, y: 150, width: 140, height: 320, rx: 10, fill: '#8A6344' }]]);
          if (HP) camSnap(500, 280, .5);
          const bl = mk(T, T.world, LX, 470, drawLionStand, .8); bl.face('right'); bl.parts.eyes('open');
          mk(T, T.world, SMX, 470, drawMouse, 1.4);
          return;
        }
        rBoard++;
        if (verb === 'paw' && rBoard === 1) {   /* 사자 발가락 하나 = 생쥐 한 마리 */
          T.world.innerHTML = '';
          const bigPaw = el('g', {}, T.world);
          let toe;
          const PW = PT ? 215 : 250, PX = 318, PY = PT ? 112 : 100, MX = PT ? 640 : 650, MY = PT ? 352 : 372;
          if (artUrl('paw_pad')) {
            const PH = PW * 459 / 400, k = PW / 400;
            pic(T, bigPaw, 'paw_pad', PX, PY, PW, PH);
            toe = el('g', {}, bigPaw); const id = 'lmToeClip';
            el('polygon', { points: [[305, 70], [400, 70], [400, 258], [338, 258], [296, 190], [302, 125]].map(([x, y]) => `${PX + x * k},${PY + y * k}`).join(' ') }, el('clipPath', { id }, toe));
            const im = pic(T, toe, 'paw_pad', PX, PY, PW, PH, { shadow: false }); im.setAttribute('clip-path', `url(#${id})`);
          } else {
            T.paper(bigPaw, [['ellipse', { cx: 370, cy: 400, rx: 130, ry: 80, fill: C.lion }]]);
            toe = T.paper(bigPaw, [['circle', { cx: 490, cy: 280, r: 40, fill: C.lionDk }]]);
          }
          const m = mk(T, T.world, MX, MY, drawMouse, PT ? 1.1 : 1.3);
          mouseStick(T, MX, MY);
          if (PT) camSnap(500, 280, .75);
          if (!inst()) { toe.style.filter = 'url(#hintGlow)'; toe.animate([{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 700, iterations: 2 }); m.hop(20); squeak(T); }
          return;
        }
        if (PT) camSnap(500, 280, 1);
        T.world.innerHTML = '';
        if (verb === 'paw') return cardsRound({ [L1]: (g, x, y) => pic(T, g, 'print_lion', x - 130, y - 126, 260, 252), [M1]: (g, x, y) => pic(T, g, 'print_mouse', x - 40, y - 33, 80, 66) });
        if (verb === 'tooth') return cardsRound({ [L1]: (g, x, y) => pic(T, g, 'tooth_lion', x - 62, y - 125, 124, 248), [M1]: (g, x, y) => pic(T, g, 'tooth_mouse', x - 50, y - 34, 100, 68) });
        console.warn('[read] board 동사 모름', verb);
      },
      net(verb, n) {
        if (verb !== 'cut') return;
        const to = Math.min(10, +n);
        return (async () => {
          for (let i = rRopeDone; i < to; i++) {
            const r = rRopes[i]; if (!r) continue;
            const x = r.x;
            if (rPt() && !inst()) camTo(x, 280, 1, 220);
            if (i > 0 && !inst()) { squeak(T, 1500); rMouse.hop(20, 220); await rMouse.move(x - 52, 545, 220); }
            else if (inst()) rMouse.place(x - 52, 545);
            if (!inst()) { rMouse.parts.teeth.setAttribute('opacity', 1); gnaw(T); T.tone([2600, 2000], .05, { type: 'square', vol: .05, when: .1 }); setTimeout(() => sfx('marimba_' + Math.min(8, i + 1), .55), 380); }
            r.mid.remove();
            r.bot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
            r.top.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${i % 2 ? 6 : -6}deg)` }], { duration: 400, fill: 'forwards', easing: 'ease-out' });
            r.top.style.opacity = '.45';
            if (!inst()) T.pop(x, 400, i % 2 ? '톡!' : '사각!', C.bean);
            if (rHR) rHR.setAttribute('opacity', 1 - (i + 1) / 12);
            if (i === 2 && !inst()) rLion.parts.paws.animate([{ translate: '0 0' }, { translate: '-10px -40px' }, { translate: '0 0' }], 700);
            if (i === 5 && !inst()) rLion.parts.hg.animate([{ rotate: '0deg' }, { rotate: '-8deg' }, { rotate: '8deg' }, { rotate: '0deg' }], 700);
            if (!inst()) { await sleep(520); rMouse.parts.teeth.setAttribute('opacity', 0); }
          }
          rRopeDone = Math.max(rRopeDone, to);
          if (to >= 10 && !inst()) sfx('level_win', .6);
        })();
      },
      scroll(verb) {
        if (verb !== 'run' || !rScroll) return;
        if (inst()) return;
        return (async () => {
          for (let k = 0; k < 3; k++) {
            const from = rSx; rSx -= 520;
            rScroll.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${rSx}px)` }], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
            rLion.body.animate([{ translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }], 900);
            AudioFX.sfx('step_grass', .5) || T.tone([160, 120], .12);
            await sleep(950);
          }
        })();
      },
      cut(k) {
        const C4 = { paw: ['cut_paw', { sfx: 'thud', hold: 1800 }], laugh: ['cut_laugh', { hold: 2200 }], net: ['cut_net', { hold: 2000 }], gnaw: ['cut_gnaw', { sfx: () => gnaw(T), hold: 1600 }] };
        const c = C4[k]; if (!c) return console.warn('[read] cut 모름', k);
        return cutArt(c[0], c[1]) || Promise.resolve();
      },
      vo(k) { return rvo(k); },
      fx(n) {
        if (n === 'thud') return AudioFX.thud();
        if (n === 'roar') return roar(T, .4);
        if (n === 'squeak') return squeak(T);
        if (n === 'gnaw') return gnaw(T);
        if (n === 'whoosh') return AudioFX.whoosh();
      },
      pop(spec) {
        let [x, y, ...w] = String(spec).split(','); x = +x; y = +y; const t = w.join(',');
        const o = (POPAT[popKey()] || {})[t]; if (o) [x, y] = o;
        if (rPt()) { const c = T.camera, h = T.viewWidth() / 2 / Math.max(c.z, .1) - 60; x = Math.max(c.x - h, Math.min(c.x + h, x)); }
        T.pop(x, y, t, POPC[t]);
      },
      cam(a) { if (a === 'wide') return; const [x, y, z] = String(a).split(',').map(Number); return inst() ? camSnap(x, y, z || 1) : camTo(x, y, z || 1, 700); },
    };
    const READ_ACTS = { set: k => { if (k === 'savanna' && !R.sawSav) { R.sawSav = 1; amb('birds_chirp_1'); } else if (k === 'night_net') amb('crickets_night_1', .25, 4); else if (k === 'morning') amb('birds_chirp_2', .25, 4); else stopAmb(); return R.set(k); }, lion: R.lion, mouse: R.mouse, bubble: R.bubble, board: R.board, net: R.net, scroll: R.scroll, cut: R.cut, vo: R.vo, fx: R.fx, pop: R.pop, cam: R.cam, finale: () => { finaleMusic(); return null; } }; // finale = 끝 음악(2026-10-31)
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) {
      T.director({ cast: { lion: () => rLion, mouse: () => rMouse }, listener: r => (r === 'lion' ? 'mouse' : 'lion'), noFace: ['lion'] });
      if (READ_ACTS && typeof READ_ACTS === 'object') READ_ACTS.classical = n => { try { if (!T.readInstant()) classical(n); } catch (e) { /* 무시 */ } return null; }; // 클래식 읽기 동사 classical:<곡>
      const rr = await T.readPlay(READ_ACTS); await finaleWait(); stopAmb(); return rr; // 끝 음악이 끝날 때까지 기다림(화면을 꺼도 계속)
    }


    /* --- 1. 낮잠 사자 (와이드) --- */
    let lion;
    if (savannaBG(T)) lion = mk(T, T.world, 620, 410, drawLionLie, 1.3); // 그림: 아카시아 그늘(줄기 앞)에 엎드림
    else {
      acacia(T, T.bg, 640, 1);
      el('ellipse', { cx: 640, cy: 486, rx: 250, ry: 24, fill: C.ink, opacity: .16 }, T.bg);
      tufts(T, T.bg, [90, 180, 880, 950], 500);
      lion = mk(T, T.world, 640, 492, drawLionLie, 1.3);
    }
    lion.face('right'); // 낮잠 내내 같은 방향 (2026-10-19: 중간에 왼쪽으로 도는 것처럼 보여서 고정)
    lion.parts.eyes('shut');
    const breathe = lion.parts.bubble.animate([{ transform: 'scale(3)' }, { transform: 'scale(9)' }], { duration: 1300, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
    const snoring = setInterval(() => snore(T), 2600);
    await T.curtain(true);
    amb('birds_chirp_1');
    intro.go(); // 시작 음악 (놀이)
    snore(T);
    await say('나무 그늘에서 사자가 쿨쿨 낮잠을 자요.');
    await sleep(1600); // 콧방울은 저절로 퐁 (2026-10-19: 톡 조작 줄임)
    breathe.cancel();
    T.tone([200, 600], .9, { type: 'sine', vol: .12 });
    await T.anim(lion.parts.bubble, [{ transform: 'scale(9)' }, { transform: 'scale(30)' }], { duration: 900, easing: 'ease-out' });
    lion.parts.bubble.style.transform = 'scale(0)';
    AudioFX.sfx('pop') || T.tone(900, .08);
    T.pop(560, 280, '퐁!', C.indigo);
    await lion.parts.hg.animate([{ translate: '0 0' }, { translate: '0 -6px' }, { translate: '0 0' }], 400).finished;
    await say('콧방울이 퐁! 그래도 사자는 쿨쿨 자요.');
    const breathe2 = lion.parts.bubble.animate([{ transform: 'scale(3)' }, { transform: 'scale(9)' }], { duration: 1300, iterations: Infinity, direction: 'alternate' });

    /* --- 2. 생쥐 산책 (생쥐 눈높이) --- */
    let mouse, head;
    /* 대사 연출: 목소리 주인에게 카메라, 사자와 생쥐가 서로 마주 봄 */
    T.director({
      cast: {
        lion: () => lion,
        mouse: () => mouse,
      },
      listener: r => (r === 'lion' ? 'mouse' : 'lion'),
      noFace: ['lion'], // 엎드린 사자는 장면마다 정한 방향 그대로 (생쥐가 말할 때 왼쪽으로 돌았다가 돌아오던 것)
    });
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); }; // 말풍선 없는 소리 대사
    const cutVo = k => setTimeout(() => vo(k), 380);
    await T.sceneCard('생쥐의 산책', () => {
      breathe2.cancel();
      T.clear(); grassForestBG(T);
      lion = mk(T, T.world, 640, 500, drawLionLie, 1.8); lion.face('right'); lion.parts.eyes('shut');
      if (lion.parts.art) lion.place(520, 500); // 그림 사자는 몸이 짧다 → 미끄럼 뒤 착지 자리가 화면 안에 들도록 왼쪽으로
      mouse = mk(T, T.world, 60, 500, drawMouse, 1.5); mouse.face('right');
      if (T.portrait()) camSnap(60, 280, 1); // 세로 화면(양옆이 잘림): 카메라가 생쥐를 따라간다
    }, lion.parts.H);
    squeak(T);
    classical('bach_cello_pizz'); // 생쥐의 폴짝폴짝 산책: 바흐 첼로 모음곡 1번 쿠랑트(제목에 피치카토라고 적힌 편곡) 18초
    await say('작은 생쥐가 산책을 나왔어요. 풀이 숲처럼 커다래요!');
    let q = Promise.resolve();
    const follow = (x, dur) => { if (T.portrait()) camTo(x, 280, 1, dur); };
    const hopTo = (x, y, dur = 380) => { q = q.then(() => { squeak(T, 1400 + Math.random() * 300); mouse.hop(40, dur); follow(x + 60, dur); return mouse.move(x, y, dur); }); return q; };
    for (let i = 1; i < 4; i++) { hopTo(60 + i * 42, 500); await sleep(450); } // 저절로 폴짝폴짝
    await q;
    // 네 번째 폴짝: 꼬리 → 등 → 갈기 미끄럼틀
    await say('어? 이건 뭐지? 폴짝!');
    // 그림 사자: 등 윗선(그림에서 잰 높이)을 따라 꼬리 → 등 → 갈기 꼭대기
    const climb = lion.parts.art ? [[393, 459, 380], [427, 380, 420], [496, 344, 450], [555, 333, 350], [574, 261, 400], [628, 211, 400], [700, 187, 350]]
      : [[232, 488, 380], [372, 376, 500], [568, 302, 500], [690, 250, 400], [815, 170, 450]];
    for (const [x, y, d] of climb) {
      squeak(T, 1500); mouse.hop(24, d); follow(x, d); await mouse.move(x, y, d);
    }
    await sleep(200);
    mouse.body.style.transform = 'rotate(-35deg)';
    short('whistle_wobble', .6, 1.6);
    T.pop(760, 150, '쭈르륵~', C.bean);
    const slide = lion.parts.art ? [[831, 265], [850, 341], [915, 500]] : [[925, 250], [975, 360], [880, 500]]; // 갈기 앞면을 따라 쭈르륵
    await mouse.move(slide[0][0], slide[0][1], 260, 'ease-in');
    await mouse.move(slide[1][0], slide[1][1], 240, 'linear');
    follow(760, 500);
    await mouse.move(slide[2][0], slide[2][1], 320, 'ease-out');
    mouse.body.style.transform = '';
    squeak(T, 1700); mouse.hop(30);
    await say('와아! 사자 갈기는 커다란 미끄럼틀이었어요. 쭈르륵~ 히히!');
    lion.parts.eyes('sleepy'); lion.parts.mouth('open');
    roar(T, .25);
    await sleep(400);
    lion.parts.mouth('smile');
    sfx('surprise_sting', .7);
    await say('어? 사자가 눈을 떴어요!');

    /* 거대한 발 컷 */
    cutVo('cut_paw');
    await (cutArt('cut_paw', { sfx: 'thud', hold: 1800 }) || T.cut(svg => {
      el('rect', { x: 0, y: 250, width: 400, height: 50, fill: C.ground }, svg);
      T.paper(svg, [['rect', { x: 150, y: -20, width: 120, height: 190, rx: 30, fill: C.lion }], ['ellipse', { cx: 210, cy: 190, rx: 110, ry: 55, fill: C.lion }],
        ...[140, 185, 235, 280].map(x => ['circle', { cx: x, cy: 238, r: 20, fill: C.lionDk }])]);
      el('text', { x: 90, y: 110, 'text-anchor': 'middle', 'font-size': 80, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('탁!') }, svg);
    }, { sfx: 'thud', hold: 1800 }));

    /* --- 3. 잡혔다! (같은 풀숲, 사자 앞발이 생쥐 꼬리를 누른다) --- */
    let pawHit;
    await T.sceneCard('잡혔다!', () => {
      T.clear(); grassForestBG(T);
      // 생쥐는 도망치려는 쪽(오른쪽)을 보고, 꼬리 끝이 사자 오른쪽 앞발(무대 x 737~818) 밑에 깔린다. 사자보다 먼저 깔아 앞발이 꼬리를 덮는다
      mouse = mk(T, T.world, 812, 498, drawMouse, 1.6); mouse.face('left');
      lion = mk(T, T.world, 640, 500, drawLionLie, 1.8); lion.face('right'); lion.parts.eyes('open');
      if (lion.parts.art) lion.place(520, 500);
      head = lionFace(T, lion.parts.hg, lion.parts.art);
      pawHit = T.el('circle', { cx: -129, cy: -25, r: 50, fill: '#fff', opacity: 0 }, lion.parts.hg);
      if (T.portrait()) camSnap(845, 330, 1);
    }, mouse.pos);
    // 사자가 앞발을 번쩍 들었다가 탁! 내려 생쥐 꼬리를 누른다 (2026-10-20: 따로 떨어진 다리 그림 대신 사자 그림 두 장)
    lion.parts.eyes('lion_pawup');
    await sleep(700);
    lion.parts.eyes('lion_pawdown');
    AudioFX.thud(); T.shake(); squeak(T, 1800); mouse.wiggle(10);
    await say('사자가 커다란 앞발로 생쥐 꼬리를 탁! 눌렀어요.');
    head.set('yawn'); roar(T, .2);
    await say('사자가 하품하며 말했어요. "하암~ 한입에 꿀꺽 해 버릴까?"');
    head.set(null);
    await say('생쥐가 말했어요. "살려 주시면 꼭 은혜 갚을게요!"');
    await sleep(500);
    // 부탁할 땐 사자를 돌아보며 두 손을 모은다 (꼬리는 아직 앞발 밑)
    mouse.face('right');
    mouse.parts.arms.setAttribute('opacity', 0); mouse.parts.pray.setAttribute('opacity', 1);
    squeak(T, 1600); mouse.hop(16);
    T.pop(880, 380, '제발요~', C.pine);
    await say('생쥐가 두 손을 모았어요. "제발요, 사자님~"');

    /* --- 4. 하하하 (사자 클로즈업 → 컷) --- */
    await camTo(T.portrait() ? 720 : 610, T.portrait() ? 300 : 320, T.portrait() ? 1.6 : 1.3, 900);
    await say('"네가? 나를 도와준다고?"');
    cutVo('cut_laugh');
    await (cutArt('cut_laugh', { hold: 2200 }) || T.cut(svg => {
      const g = el('g', { transform: 'translate(200,160) scale(1.25)' }, svg);
      const h = drawHead(T, g); h.eyes('happy'); h.mouth('open');
      el('text', { x: 200, y: 290, 'text-anchor': 'middle', 'font-size': 64, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('하하하!') }, svg);
    }, { hold: 2200 }));
    head.set('laugh');
    roar(T, .15);
    const laugh = lion.parts.hg.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 300, iterations: Infinity });
    await camTo(T.portrait() ? 800 : 610, T.portrait() ? 380 : 340, T.portrait() ? 1.4 : 1.3, 900);
    AudioFX.sfx('creak', .5);
    // 사자가 웃느라 몸이 뒤로 젖혀져 앞발이 들린다 (몸 전체를 뒷발 끝을 축으로 돌림)
    await T.anim(lion.parts.hg, [{ rotate: '0deg' }, { rotate: '3deg' }], { duration: 1200, easing: 'ease-out' });
    lion.parts.eyes('lion_pawup'); // 앞발이 들린다
    await say('사자가 웃다가 앞발이 스르르 열렸어요.');
    T.anim(lion.parts.hg, [{ rotate: '3deg' }, { rotate: '8deg' }], 500);
    mouse.parts.arms.setAttribute('opacity', 1); mouse.parts.pray.setAttribute('opacity', 0);
    T.tone([600, 1600], .25, { type: 'sine', vol: .14 });
    T.pop(860, 420, '쏙!', C.pine);
    mouse.face('right'); // 풀려나서 오른쪽으로 쏙
    await mouse.move(960, 498, 500, 'ease-in');
    laugh.cancel();
    await say('생쥐가 쏙 빠져나왔어요. "고맙습니다, 사자님!"');
    squeak(T);
    if (mouse.parts.look) mouse.parts.look('run'); // 쪼르르 달려 나간다
    await mouse.move(1250, 498, 700, 'ease-in');

    /* --- 5. 누가 더 클까? (비교 판) --- */
    await T.sceneCard('누가 더 클까?', () => { T.clear(); camSnap(500, 280, 1); boardBG(T); });
    // 사자 발가락 하나 = 생쥐 한 마리
    const bigPaw = el('g', {}, T.world);
    let toes;
    // 세로 화면(보이는 폭 ≈260): 발을 조금 작게, 생쥐를 가까이, 살짝 물러서서 둘 다 보이게
    const PT = T.portrait(), PW = PT ? 215 : 250, PX = PT ? 318 : 318, PY = PT ? 112 : 100, MX = PT ? 640 : 650, MY = PT ? 352 : 372;
    if (artUrl('paw_pad')) { // 그림: 발가락 넷 달린 큰 발(왼쪽에서 셋째 오른쪽 끝 발가락 = 400×459 그림의 x 292~400, y 70~265)을 그 자리에서 오려 한 번 더 얹어 통통 튀게 한다
      const PH = PW * 459 / 400, k = PW / 400;
      pic(T, bigPaw, 'paw_pad', PX, PY, PW, PH);
      const toeG = el('g', {}, bigPaw), id = 'lmToeClip';
      el('polygon', { points: [[305, 70], [400, 70], [400, 258], [338, 258], [296, 190], [302, 125]].map(([x, y]) => `${PX + x * k},${PY + y * k}`).join(' ') }, el('clipPath', { id }, toeG));
      const im = pic(T, toeG, 'paw_pad', PX, PY, PW, PH, { shadow: false }); im.setAttribute('clip-path', `url(#${id})`);
      toes = [null, null, null, toeG];
    } else {
      T.paper(bigPaw, [['ellipse', { cx: 370, cy: 400, rx: 130, ry: 80, fill: C.lion }]]);
      toes = [[250, 280], [325, 240], [415, 240], [490, 280]].map(([x, y]) => T.paper(bigPaw, [['circle', { cx: x, cy: y, r: 40, fill: C.lionDk }]]));
    }
    mouse = mk(T, T.world, MX, MY, drawMouse, PT ? 1.1 : 1.3);
    mouseStick(T, MX, MY);
    if (PT) camSnap(500, 280, .75);
    await say('사자 발과 생쥐를 나란히 놓아 볼까요?');
    const toe = toes[3]; toe.style.filter = 'url(#hintGlow)';
    toe.animate([{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 700, iterations: 2 });
    mouse.hop(20); squeak(T);
    await say('사자 발가락 하나가 생쥐 한 마리만 해요!');
    toe.style.filter = '';
    bigPaw.remove(); mouse.pos.remove(); T.world.innerHTML = '';

    // 세로 화면(보이는 폭 ≈260 → 물러서도 520): 카드를 좁게(240) 가운데 가까이(500±125) 두어 둘 다 보이게
    const CW = T.portrait() ? 240 : 300, CK = CW / 300;
    // 새 판은 작아서(x 288~757, y 93~405) 한 판 전체(카드 둘·주인)를 한 묶음(RG)으로 줄여 판 안에 넣는다
    let RG = T.world;
    const newRound = () => { RG = el('g', { transform: `translate(522,249) scale(${T.portrait() ? .82 : .76}) translate(-500,-260)` }, T.world); };
    const card = (x, drawIn) => {
      const g = el('g', {}, RG);
      el('rect', { x: x - CW / 2, y: 110, width: CW, height: 300, rx: 24, fill: '#fff', opacity: .001 }, g);
      const inner = CK < 1 ? el('g', { transform: `translate(${x},260) scale(${CK}) translate(${-x},-260)` }, g) : g;
      drawIn(inner, x, 260); return g;
    };
    const lionPrint = (g, x, y) => pic(T, g, 'print_lion', x - 130, y - 126, 260, 252);
    const mousePrint = (g, x, y) => pic(T, g, 'print_mouse', x - 40, y - 33, 80, 66);
    const lionTooth = (g, x, y) => pic(T, g, 'tooth_lion', x - 62, y - 125, 124, 248);
    const mouseTooth = (g, x, y) => pic(T, g, 'tooth_mouse', x - 50, y - 34, 100, 68);
    const OX = T.portrait() ? 95 : 100; // 주인은 카드 오른쪽 아래
    const owner = (who, x) => who === LION
      ? (() => { const g = el('g', { transform: `translate(${x + OX},390) scale(.75)` }, RG); drawHead(T, g).eyes('happy'); return g; })()
      : mk(T, RG, x + OX, 450, drawMouse, 1.3).pos;
    const rounds = [
      { q: '더 큰 발자국은 어느 쪽일까요?', prompt: '더 큰 발자국을 톡 눌러 봐요!', ans: LION, thing: '발자국',
        draw: { [LION]: lionPrint, [MOUSE]: mousePrint }, where: '두 발자국을 잘 봐요. 어느 쪽이 더 커다랗지?' },
      { q: '이번엔 이빨이에요. 더 작은 이빨은 어느 쪽일까요?', prompt: '더 작은 이빨을 톡 눌러 봐요!', ans: MOUSE, thing: '이빨',
        draw: { [LION]: lionTooth, [MOUSE]: mouseTooth }, where: '콩알처럼 조그만 이빨을 찾아봐요!' },
    ];
    for (const r of rounds) {
      const lionLeft = Math.random() < .5, CL = T.portrait() ? 375 : 345, CR = T.portrait() ? 625 : 655;
      newRound();
      const xs = { [LION]: lionLeft ? CL : CR, [MOUSE]: lionLeft ? CR : CL };
      const cards = { [LION]: card(xs[LION], r.draw[LION]), [MOUSE]: card(xs[MOUSE], r.draw[MOUSE]) };
      const other = r.ans === LION ? MOUSE : LION;
      await T.ask(r.q, () => T.choose([{ el: cards[r.ans], ok: true }, { el: cards[other], ok: false }], { prompt: r.prompt, where: r.where,
        who: `${josa(r.ans, '이/가')} 가진 ${josa(r.thing, '이에요/예요')}. 반짝이는 쪽을 눌러 봐요!` }));
      const o1 = owner(LION, xs[LION]), o2 = owner(MOUSE, xs[MOUSE]);
      r.ans === LION ? roar(T, .2) : squeak(T);
      cards[r.ans].animate([{ translate: '0 0' }, { translate: '0 -16px' }, { translate: '0 0' }], 500);
      await say(`맞아요! ${r.ans} ${josa(r.thing, '이에요/예요')}.`);
      if (r.ans === MOUSE) await say('생쥐 이빨은 작지만 아주 튼튼해요. 사각사각 뭐든 갉을 수 있지요.');
      T.world.innerHTML = '';
      o1.remove(); o2.remove();
    }
    // 좁은 구멍: 그루터기 그림(구멍은 밑동 가운데) — 세로 화면은 셋이 다 보이게 조금 모으고 물러선다
    const HP = T.portrait(), HX = 500, LX = HP ? 300 : 230, SMX = HP ? 690 : 790, KS = HP ? .75 : 1; // 세로 화면은 그루터기를 .75배로 줄여 셋이 한 화면(.5배 물러섬)에 든다
    if (!pic(T, T.world, 'hole_stump', HX - 158 * KS, 470 - 257 * KS, 320 * KS, 260 * KS)) { // 새 그루터기: 구멍은 그림 x 158, 밑동 y≈257
      T.paper(T.world, [['rect', { x: HX - 70, y: 150, width: 140, height: 320, rx: 10, fill: '#8A6344' }]]);
      el('path', { d: `M${HX - 30} 470 Q${HX - 30} 420 ${HX} 420 Q${HX + 30} 420 ${HX + 30} 470 Z`, fill: C.ink }, T.world);
    }
    if (HP) camSnap(500, 280, .5);
    const bl = mk(T, T.world, LX, 470, drawLionStand, .8); bl.face('right'); bl.parts.eyes('open');
    const sm = mk(T, T.world, SMX, 470, drawMouse, 1.4);
    await T.ask('좁은 구멍이 있어요. 쏙 들어갈 수 있는 건 누구일까요?', () => T.choose([
      { el: sm.pos, ok: true },
      { el: bl.pos, ok: false, onWrong: async () => {
        await bl.move(LX + 70, 470, 500);
        AudioFX.sfx('bonk') || T.tone([300, 150], .2); T.shake(); T.pop(HX - 70, 250, '쿵!');
        bl.parts.eyes('shut');
        await sleep(700);
        bl.parts.eyes('open');
        await bl.move(LX, 470, 500);
      } },
    ], { prompt: '구멍에 쏙 들어갈 친구를 톡 눌러 봐요!', where: '사자는 너무 커서 코가 쿵! 부딪혀요. 작은 친구는 누구지?',
      who: `${josa(MOUSE, '이/가')} 들어갈 수 있어요. 반짝이는 친구를 눌러 봐요!` }));
    squeak(T);
    await sm.move(HX + 20, 470, 500);
    T.tone([900, 400], .2, { type: 'sine', vol: .12 });
    T.pop(HX, 380, '쏙!', C.pine);
    sm.pos.style.opacity = '0';
    await sleep(600);
    sm.pos.style.opacity = '1'; sm.face('right'); await sm.move(HX + 120, 470, 400); sm.hop(20);
    await say('맞아요! 작은 생쥐는 좁은 구멍도 쏙!');
    await say('크면 큰 대로, 작으면 작은 대로 다 쓸모가 있어요.');

    /* --- 6. 그물 (밤 숲 하이앵글) --- */
    await T.sceneCard('밤 숲', () => {
      amb('crickets_night_1', .25, 4);
      T.clear(); camSnap(500, 280, 1); nightHighBG(T);
      lion = mk(T, T.world, 560, 460, drawLionLie, 1.3); lion.parts.eyes('open');
      if (!pic(T, T.world, 'net', 262, 88, 453, 384)) { // 그물 그림(둥근 지붕꼴)이 사자를 덮는다
        const clip = el('clipPath', { id: 'lmNetClip' }, T.fx);
        el('ellipse', { cx: 570, cy: 330, rx: 270, ry: 150 }, clip);
        const net = el('g', { 'clip-path': 'url(#lmNetClip)', stroke: C.rope, 'stroke-width': 5 }, T.world);
        for (let k = -8; k < 16; k++) {
          el('line', { x1: 200 + k * 50, y1: 150, x2: 200 + k * 50 + 300, y2: 500 }, net);
          el('line', { x1: 200 + k * 50, y1: 150, x2: 200 + k * 50 - 300, y2: 500 }, net);
        }
      }
      mouse = mk(T, T.world, 120, 505, drawMouse, 1.2);
      mouse.face('right');
    });
    lion.parts.mouth('open'); roar(T, .5); T.pop(430, 170, '어흥!');
    const struggle = lion.body.animate([{ rotate: '0deg' }, { rotate: '-2deg' }, { rotate: '2deg' }, { rotate: '0deg' }], { duration: 500, iterations: Infinity });
    await say('밤이 되었어요. 앗, 사자가 그물에 걸렸어요!');
    lion.parts.mouth('smile');
    cutVo('cut_net');
    await (cutArt('cut_net', { hold: 2000 }) || T.cut(svg => {
      const g = el('g', { transform: 'translate(200,150) scale(1.2)' }, svg);
      const h = drawHead(T, g); h.eyes('shut'); h.mouth('open');
      const n = el('g', { stroke: C.rope, 'stroke-width': 5 }, svg);
      for (let k = -4; k < 12; k++) { el('line', { x1: k * 40, y1: 0, x2: k * 40 + 240, y2: 300 }, n); el('line', { x1: k * 40, y1: 0, x2: k * 40 - 240, y2: 300 }, n); }
      el('text', { x: 200, y: 285, 'text-anchor': 'middle', 'font-size': 56, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('버둥버둥') }, svg);
    }, { hold: 2000 }));
    AudioFX.sfx('step_grass', .15);
    await say('사자가 버둥버둥, 그래도 그물이 풀리지 않아요.');
    await camTo(T.portrait() ? 140 : 390, T.portrait() ? 470 : 340, T.portrait() ? 2.4 : 1.3, 1000);
    const perk = mouse.parts.art ? 'scale(1,1.14)' : 'scale(1.45)'; // 그림: 귀만 따로 없어서 몸을 쭉 펴며 쫑긋
    await T.anim(mouse.parts.ears, [{ transform: 'scale(1)' }, { transform: perk }, { transform: 'scale(1)' }, { transform: perk }, { transform: 'scale(1)' }], 900);
    squeak(T);
    await say('쫑긋! 생쥐가 사자 목소리를 들었어요.');
    await say('"사자님, 제가 도와 드릴게요!"');
    await camWide(700);
    mouse.hop(20, 300);
    await mouse.move(300, 520, 900);
    struggle.cancel();

    /* --- 7. 갉아요 (그물 클로즈업, 줄 10개 세기) --- */
    const ROPES = [...Array(10)].map((_, i) => 120 + i * 84);
    let ropes = [], hRopes;
    await T.sceneCard('사각사각', () => {
      T.clear(); nightNetBG(T);
      lion = mk(T, T.world, 560, 520, drawLionLie, 2); lion.parts.eyes('open');
      ({ hR: hRopes, ropes } = ropeNet(T, T.world, ROPES)); // 그림: 밧줄 그림 무늬(세로 10 · 가로 4)
      mouse = mk(T, T.world, ROPES[0] - 52, 545, drawMouse, 1.5); mouse.face('right');
    }, mouse.pos);
    const cnt = counter(T, 10);
    /* 2026-10-28 사용자 결정: 아이가 열 번 톡 눌러 줄을 하나씩 끊고, 누를 때마다 숫자(하나…열)를 소리 내어 센다.
       (연타는 한 번이면 저절로 — §2 — 의 예외: 세기 배움 조작.) 누르는 곳은 지금 끊을 줄 둘레의 큰 투명 판.
       한 줄을 끊고 숫자 소리가 끝날 때까지 판이 닫혀 있어서, 빨리 눌러도 숫자 소리가 겹치지 않는다. */
    const hit = el('g', {}, T.world);
    const hitR = el('rect', { x: -75, y: 240, width: 150, height: 340, fill: 'transparent' }, hit);
    const hitDot = el('rect', { x: -10, y: 495, width: 20, height: 20, fill: 'transparent', 'data-hand': 1 }, hit); // 손가락 힌트는 끊을 자리(줄 아래쪽)
    const aimHit = i => { hitR.setAttribute('x', ROPES[i] - 75); hitDot.setAttribute('x', ROPES[i] - 10); };
    aimHit(0);
    if (T.portrait()) camTo(ROPES[0], 280, 1, 300);
    const cutRope = async i => {
      const x = ROPES[i];
      mouse.parts.teeth.setAttribute('opacity', 1);
      mouse.body.animate([{ rotate: '0deg' }, { rotate: '6deg' }, { rotate: '-3deg' }, { rotate: '6deg' }, { rotate: '0deg' }], { duration: 380 }); // 오물오물 갉기
      gnaw(T); T.tone([2600, 2000], .05, { type: 'square', vol: .05, when: .1 });
      setTimeout(() => sfx('marimba_' + Math.min(8, i + 1), .55), 380); // 줄마다 한 음씩 올라가며 센다
      const r = ropes[i];
      r.mid.remove();
      r.bot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
      r.top.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${i % 2 ? 6 : -6}deg)` }], { duration: 400, fill: 'forwards', easing: 'ease-out' });
      r.top.style.opacity = '.45';
      T.pop(x, 400, i % 2 ? '톡!' : '사각!', C.bean);
      cnt.fill(i);
      const said = Narrator.speak(NUMS[i]).catch(() => { /* 소리 실패는 무시 */ });
      hRopes.setAttribute('opacity', 1 - (i + 1) / 12);
      if (i === 2) { lion.parts.paws.animate([{ translate: '0 0' }, { translate: '-10px -40px' }, { translate: '0 0' }], 700); }
      if (i === 5) { lion.parts.hg.animate([{ rotate: '0deg' }, { rotate: '-8deg' }, { rotate: '8deg' }, { rotate: '0deg' }], 700); }
      await Promise.all([sleep(700), Promise.race([said, sleep(2500)])]); // 숫자 하나를 다 듣고 나서야 다음 줄을 누를 수 있다
      mouse.parts.teeth.setAttribute('opacity', 0);
      if (i < 9) { // 다음 줄로 폴짝 옮겨 가서 기다린다
        const nx = ROPES[i + 1];
        if (T.portrait()) camTo(nx, 280, 1, 220); // 세로 화면: 카메라가 생쥐를 따라 옆으로
        squeak(T, 1500); mouse.hop(20, 220); await mouse.move(nx - 52, 545, 220);
      }
    };
    const NET_PROMPT = '톡톡 눌러서 그물을 갉아요!';
    for (let i = 0; i < 10; i++) {
      aimHit(i);
      if (i === 0) await T.ask('생쥐가 작은 이빨로 그물을 갉아요. 톡톡 눌러서 한 줄씩 끊어 봐요!', () => T.tap(hit, { prompt: NET_PROMPT }));
      else await T.tap(hit, { prompt: NET_PROMPT });
      await cutRope(i);
    }
    hit.remove();
    sfx('level_win', .6); // 열 줄을 다 끊었어요 — 레벨 클리어 소리
    await sleep(500);
    cnt.remove();
    await (cutArt('cut_gnaw', { sfx: () => gnaw(T), hold: 1600 }) || Promise.resolve()); // 싹둑! (그림 컷만)
    await say('하나, 둘, 셋… 열! 그물 줄 열 개를 다 끊었어요!');
    // 사자가 풀려난다
    await Promise.all([hRopes, ...ropes.map(r => r.g)].map(n => T.anim(n, [{ opacity: n.getAttribute('opacity') || 1 }, { opacity: 0 }], 600)));
    lion.pos.remove();
    lion = mk(T, T.world, 600, 520, drawLionStand, 1.9); lion.parts.eyes('happy'); // 2026-10-20 크기 일관성: 바로 앞 누운 사자(2.0)와 머리 크기가 같도록 1.6 → 1.9 (선 사자 머리 약 17% 작아 보이던 것)
    T.world.appendChild(mouse.pos);
    roar(T, .35); T.pop(440, 200, '어흥~', C.persimmon);
    T.confetti();
    await lion.hop(30, 500);
    await say('와아! 사자가 풀려났어요!');
    await say('"고마워, 작은 친구. 작은 이빨이 나를 구해 줬구나!"');
    squeak(T, 1700); mouse.hop(24);
    await say('"제가 은혜 갚는다고 했지요?"');

    /* --- 8. 친구 (초원 아침 와이드) --- */
    let scroll, rider;
    await T.sceneCard('아침 초원', () => {
      amb('birds_chirp_2', .25, 4);
      T.clear();
      if (bgUrl('morning_nosun')) {
        // 그림: 아침 초원을 좌우로 번갈아 뒤집어 이어 붙인 긴 띠(이음매가 거울처럼 맞는다)를 통째로 민다
        scroll = el('g', {}, T.bg); scroll.style.transformBox = 'view-box';
        bgImage(T, 'morning_nosun', scroll); T.bg.appendChild(scroll); // 가장자리 색 띠 위로
        for (let k = 1; k < 5; k++) {
          const t = el('g', { transform: k % 2 ? `translate(${BGBOX.x * 2 + BGBOX.w * (k + 1)},0) scale(-1,1)` : `translate(${BGBOX.w * k},0)` }, scroll);
          el('image', { href: bgUrl('morning_nosun'), x: BGBOX.x - 1, y: BGBOX.y, width: BGBOX.w + 2, height: BGBOX.h, preserveAspectRatio: 'none' }, t); // 양옆 1px 겹쳐 이음매 실선이 안 보이게
        }
        // 해는 띠에서 지워 두고 하나만 하늘에 고정(띠를 이어 붙여도 해가 둘로 늘지 않는다)
        el('image', { href: AS + 'v3w/lm_sun.webp', x: 300, y: 70, width: 120, height: 120, style: 'pointer-events:none' }, T.bg);
      } else {
        savannaBG(T, { morning: true });
        scroll = el('g', {}, T.bg);
        scroll.style.transformBox = 'view-box';
        for (let k = 0; k < 5; k++) acacia(T, scroll, 950 + k * 700, .8 + (k % 2) * .15);
        tufts(T, scroll, [...Array(24)].map((_, k) => 60 + k * 140), 495, C.leaf);
      }
      if (T.portrait()) camSnap(440, 280, 1); // 세로 화면: 앞 장면에서 옮겨 둔 카메라를 사자 쪽으로
      lion = mk(T, T.world, 380, 495, drawLionStand, 1.1); lion.face('right'); lion.parts.eyes('happy');
      const bk = lion.parts.back || [40, -152]; // 그림 사자: 그림 등 윗선
      rider = mk(T, lion.body, bk[0], bk[1], drawMouse, 1.1);
    }, lion.parts.H);
    await say('다음 날 아침, 사자가 생쥐를 등에 태웠어요. "꽉 잡아!"');
    let sx = 0;
    for (let k = 0; k < 3; k++) { // 저절로 다다다 세 번
      {
        const from = sx; sx -= 520;
        scroll.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${sx}px)` }], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
        lion.body.animate([{ translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }], 900);
        AudioFX.sfx('step_grass', .5) || T.tone([160, 120], .12);
        T.pop(260, 300, '다다다!', C.bark);
      }
      await sleep(950);
    }
    await sleep(900);
    await say('바람을 가르며 초원을 달려요! 신난다!');
    T.finale();
    await T.ask('사자랑 생쥐를 톡톡 눌러 봐요. 같이 웃어요!', () => T.tap(rider.pos));
    rider.hop(26, 320); T.pop(250, 250, '찍!', C.pine); vo('hi_mouse');
    await sleep(500);
    await T.tap(lion.pos);
    vo('hi_lion'); lion.parts.mouth('open'); setTimeout(() => lion.parts.mouth('smile'), 500); lion.hop(20, 360); T.pop(640, 190, '어흥~', C.persimmon);
    await sleep(900);
    await say(`그날부터 ${josa(LION, '과/와')} ${josa(MOUSE, '은/는')} 둘도 없는 친구가 되었답니다.`);
    finaleMusic(); await finaleWait(); stopAmb();
    return '작아도 큰 친구를 도울 수 있어요!';
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
    Object.keys(targetsOf).forEach(k => { T[k] = async (...a) => { await T.fitTo(targetsOf[k](a)); [].concat(targetsOf[k](a)).forEach(e => fatten(e)); return api[k](...a); }; });
    T.sceneCard = (label, change, focus) => api.sceneCard(label, () => {
      if (guardCam) { const c = api.camera; if (c.x === guardCam.x && c.y === guardCam.y && c.z === guardCam.z) api.camSnap(500, 280, 1); guardCam = null; }
      change && change();
    }, focus);
    return T;
  }

  /* 누르는 자리 넓히기 (2026-10-22): 화면에서 짧은 변이 84px 보다 작은 대상(g)에 투명 사각을 덧대 84px 이상으로 만든다.
     대상 가운데는 그대로(손가락 힌트 자리 불변). 조작을 열 때마다 지금 화면 배율로 다시 잰다. 클립된 그림 조각은 건드리지 않는다 */
  function fatten(el, min = 84) {
    try {
      if (!el || !(el instanceof SVGGElement) || el.__noFat) return;
      if (el.__fat) { el.__fat.remove(); el.__fat = null; }
      const r = el.getBoundingClientRect(); if (!r.width || !r.height || el.getAttribute('clip-path')) return;
      if (r.width >= min && r.height >= min) return;
      const m = el.getScreenCTM(), bb = el.getBBox(); if (!m || !bb.width || !bb.height) return;
      const sx = Math.hypot(m.a, m.b) || 1, sy = Math.hypot(m.c, m.d) || 1;
      const w = Math.max(bb.width, min / sx), h = Math.max(bb.height, min / sy);
      const rc = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rc.setAttribute('x', bb.x + bb.width / 2 - w / 2); rc.setAttribute('y', bb.y + bb.height / 2 - h / 2);
      rc.setAttribute('width', w); rc.setAttribute('height', h); rc.setAttribute('fill', '#000'); rc.setAttribute('fill-opacity', 0);
      el.insertBefore(rc, el.firstChild); el.__fat = rc;
    } catch (e) { /* 넓히기 실패는 무시 */ }
  }

  Tale.mount({ title: '사자와 생쥐', subtitle: '작은 친구의 큰 힘', read: true, run: T => run(portraitGuard(Tale.api)) });
})();
