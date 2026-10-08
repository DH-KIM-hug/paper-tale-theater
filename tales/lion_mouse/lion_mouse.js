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
    savanna: 'v3w/lm_bg_savanna.webp', grass: 'v3w/lm_bg_grass.webp',
    night_forest: 'v3w/lm_bg_night_forest.webp', night_net: 'v3w/lm_bg_night_net.webp', morning: 'v3w/lm_bg_morning.webp',
    board: 'v3w/lm_bg_board.webp',
  };
  /* 배우·소품·컷 (사자·생쥐는 모두 왼쪽을 본다)
     - lion_sleep: 뜬 눈으로 나와서 감은 눈(‿)으로 고쳐 칠함
     - lion_head_yawn · _laugh: 앉은 몸까지 나와서 갈기 테두리 안(얼굴·갈기)만 오림
     - lion_stand: 다시 뽑은 선 사자 (웃는 눈). 갈기 지름을 누운 사자와 같게, 등 위 (52,-121)에 생쥐가 탄다
     - cut_gnaw: 그물을 다 끊은 뒤 '싹둑' 컷으로 새로 넣음 (목소리 없음, 갉는 소리)
     - cut_net2: 다시 뽑은 그물 컷(그물 아래 걱정하는 얼굴). cut_paw4: 사자 몸에 이어진 앞발이 생쥐 꼬리를 누름(예전 paw2·3은 몸과 떨어진 발이라 안 씀)
     - net: 밤 숲 그물(마젠타 키잉, 밧줄색으로) · hole_stump: 그루터기 구멍
     - paw_pad: 발가락 넷 달린 발 그림에서 오른쪽 끝 발가락을 오려 내(paw_toe) 코드가 그 자리에 따로 얹고 통통 튀게 한다
     - print_lion · print_mouse · tooth_lion · tooth_mouse: 얼굴 없는 오린 종이 그림(큰 발자국/작은 발자국, 큰 송곳니/작은 앞니). 비교 판 위에 카드 틀 없이 바로 얹는다 */
  const ART = {
    lion_sleep: 'v3w/lm_lion_sleep.webp', lion_lie_awake: 'v3w/lm_lion_lie_awake.webp',
    lion_head_yawn: 'v3w/lm_lion_head_yawn.webp', lion_head_laugh: 'v3w/lm_lion_head_laugh.webp',
    lion_stand: 'v3w/lm_lion_stand.webp',
    mouse_walk: 'v3w/lm_mouse_walk.webp', mouse_pray: 'v3w/lm_mouse_pray.webp', mouse_run: 'v3w/lm_mouse_run.webp', mouse_gnaw: 'v3w/lm_mouse_gnaw.webp',
    cut_paw: 'v3w/lm_cut_paw4.webp', cut_laugh: 'v3w/lm_cut_laugh.webp', cut_net: 'v3w/lm_cut_net2.webp', cut_gnaw: 'v3w/lm_cut_gnaw.webp',
    net: 'v3w/lm_net.webp', hole_stump: 'v3w/lm_hole_stump.webp',
    paw_pad: 'v3w/lm_paw_pad.webp', paw_toe: 'v3w/lm_paw_toe.webp', print_lion: 'v3w/lm_print_lionc.webp', print_mouse: 'v3w/lm_print_mousec.webp',
    tooth_lion: 'v3w/lm_tooth_lionc.webp', tooth_mouse: 'v3w/lm_tooth_mousec.webp',
  };
  const artOK = {}, bgOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  /* 그림 한 장: (x,y)가 왼쪽 위인 w×h 상자 */
  function pic(T, g, key, x, y, w, h, { shadow = true } = {}) {
    const u = artUrl(key); if (!u) return null;
    const wrap = T.el('g', shadow ? { filter: 'url(#pp)' } : {}, g);
    T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
    return wrap;
  }
  const BG_EDGE = { savanna: ['#bbd1cb', '#85623c'], grass: ['#cae1da', '#5d3a11'], night_forest: ['#02506e', '#1e4d47'], night_net: ['#023a65', '#635130'], morning: ['#cadcd6', '#7f7349'], board: ['#c9d9d2', '#7a5a34'] };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  function bgImage(T, key, parent) {
    const u = bgUrl(key); if (!u) return null;
    const { x, y, w, h } = BGBOX, [top, bot] = BG_EDGE[key];
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, T.bg);
    T.el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, T.bg);
    return T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent || T.bg);
  }
  /* 누운 사자 그림 (왼쪽을 봄, 발끝 0): 갈기 지름이 두 그림에서 같도록 같은 배율. 갈기 가운데 ≈ 임시 도형 머리 자리(-100, -96) */
  const LIE = {
    lion_sleep: { x: -209, y: -194, w: 352, h: 194, head: [-100, -112], nose: [-118, -70] },
    lion_lie_awake: { x: -206, y: -213, w: 324, h: 213, head: [-100, -126] },
  };
  /* 사자 큰 얼굴 (가운데 0,0, 갈기 지름 176 = 임시 도형과 같음) */
  const HEAD = { lion_head_yawn: [-94.5, -87, 189, 174.5], lion_head_laugh: [-95, -83, 190, 165.4] };
  /* 생쥐 자세: [키, 발끝 가운데(폭 비율), 폭/높이]. 눈 크기로 머리 크기를 맞춤(빌기·갉기는 원본이 조금 크게 나와 줄임) */
  const MOUSE = { walk: [62, .49, 1.6533], pray: [72, .457, .92], run: [68, .458, 1.81], gnaw: [77, .512, 1.2933] };

  /* ================= 캐릭터 (임시 도형) ================= */
  /* 사자 얼굴: 가운데가 (0,0). 눈·입 표정을 바꿀 수 있다 */
  function drawHead(T, g, { greybox = false } = {}) {
    const { el, paper } = T;
    const H = el('g', {}, g);
    if (!greybox && (artUrl('lion_head_yawn') || artUrl('lion_head_laugh'))) { // 그림: 웃는 눈(happy)이면 웃는 얼굴, 나머지는 졸린 하품 얼굴
      const faces = {};
      Object.entries(HEAD).forEach(([k, [x, y, w, h]]) => { const f = pic(T, H, k, x, y, w, h); if (f) faces[k] = f; });
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
        eyes(s) { const want = s === 'shut' && imgs.lion_sleep ? 'lion_sleep' : imgs.lion_lie_awake ? 'lion_lie_awake' : 'lion_sleep';
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
  const STAND = { x: -167, y: -241, w: 312, h: 241, head: [-58, -128], back: [52, -121] };
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
    if (bgImage(T, morning ? 'morning' : 'savanna')) return true; // 그림: 큰 아카시아(나무 그늘 x≈640)까지 그림 속에
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
    if (bgImage(T, 'grass')) return true;
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
    if (bgImage(T, 'board')) return true; // 그림: 크림 판은 무대 x 139~866, y 23~514
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.cream }, b);
    paper(b, [['rect', { x: 60, y: 40, width: 880, height: 440, rx: 16, fill: '#EFE0BD' }]]);
    paper(b, [['rect', { x: -200, y: 470, width: 1400, height: 200, fill: '#B98F4A' }]]);
  }
  /* 밤 숲 하이앵글: 위에서 내려다본 땅 */
  function nightHighBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'night_forest')) return true; // 숲 공터 가운데 ≈ (520,300)
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: '#223227' }, b);
    paper(b, [['ellipse', { cx: 520, cy: 330, rx: 360, ry: 200, fill: '#34493A' }]]);
    [[40, 40, 120], [960, 60, 140], [-10, 380, 110], [990, 470, 130], [300, -40, 90], [720, 560, 100]].forEach(([x, y, r]) =>
      paper(b, [['circle', { cx: x, cy: y, r, fill: '#172219' }], ['circle', { cx: x - r * .2, cy: y - r * .2, r: r * .6, fill: '#1E3024' }]]));
    [[150, 480], [860, 250], [260, 140]].forEach(([x, y]) => paper(b, [['ellipse', { cx: x, cy: y, rx: 26, ry: 16, fill: '#5A5A52' }]]));
  }
  function nightNetBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'night_net')) return true;
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
    const { el, sleep, say, camTo, camWide, camSnap, josa } = T;
    const LION = '사자', MOUSE = '생쥐';

    /* 그림 미리 불러오기: 첫 장면 그림·생쥐를 기다리고(최대 3초) 나머지는 뒤에서. 못 불러온 그림은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads['bg_' + k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    Object.keys(ART).filter(k => ART[k]).forEach(k => { loads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    await Promise.race([Promise.all([loads.bg_savanna, loads.lion_sleep, loads.lion_lie_awake, loads.mouse_walk, loads.mouse_pray, loads.mouse_run, loads.mouse_gnaw,
      loads.lion_head_yawn, loads.lion_head_laugh].filter(Boolean)), sleep(3000)]);
    const cutArt = (key, o = {}) => artUrl(key) && T.cutImage([{ src: artUrl(key), ...o }], o);

    /* --- 1. 낮잠 사자 (와이드) --- */
    let lion;
    if (savannaBG(T)) lion = mk(T, T.world, 620, 410, drawLionLie, 1.3); // 그림: 아카시아 그늘(줄기 앞)에 엎드림
    else {
      acacia(T, T.bg, 640, 1);
      el('ellipse', { cx: 640, cy: 486, rx: 250, ry: 24, fill: C.ink, opacity: .16 }, T.bg);
      tufts(T, T.bg, [90, 180, 880, 950], 500);
      lion = mk(T, T.world, 640, 492, drawLionLie, 1.3);
    }
    lion.parts.eyes('shut');
    const breathe = lion.parts.bubble.animate([{ transform: 'scale(3)' }, { transform: 'scale(9)' }], { duration: 1300, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
    const snoring = setInterval(() => snore(T), 2600);
    await T.curtain(true);
    snore(T);
    await say('나무 그늘에서 사자가 쿨쿨 낮잠을 자요.');
    await T.tap(lion.parts.H, { prompt: '사자 코를 톡 눌러 봐요!' });
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
    await say('작은 생쥐가 산책을 나왔어요. 풀이 숲처럼 커다래요!');
    await say('화면을 톡톡 눌러서 폴짝폴짝 가 볼까요?');
    let q = Promise.resolve();
    const follow = (x, dur) => { if (T.portrait()) camTo(x, 280, 1, dur); };
    const hopTo = (x, y, dur = 380) => { q = q.then(() => { squeak(T, 1400 + Math.random() * 300); mouse.hop(40, dur); follow(x + 60, dur); return mouse.move(x, y, dur); }); return q; };
    await T.mash(T.root.querySelector('#stageWrap'), { count: 4, prompt: '화면을 톡톡 눌러서 폴짝!',
      onStep: i => { if (i < 4) hopTo(60 + i * 42, 500); } });
    await q;
    // 네 번째 폴짝: 꼬리 → 등 → 갈기 미끄럼틀
    await say('어? 이건 뭐지? 폴짝!');
    // 그림 사자: 등 윗선(그림에서 잰 높이)을 따라 꼬리 → 등 → 갈기 꼭대기
    const climb = lion.parts.art ? [[275, 419, 380], [333, 329, 500], [430, 280, 500], [547, 226, 400], [702, 153, 450]]
      : [[232, 488, 380], [372, 376, 500], [568, 302, 500], [690, 250, 400], [815, 170, 450]];
    for (const [x, y, d] of climb) {
      squeak(T, 1500); mouse.hop(24, d); follow(x, d); await mouse.move(x, y, d);
    }
    await sleep(200);
    mouse.body.style.transform = 'rotate(-35deg)';
    T.tone([1400, 500], .9, { type: 'sine', vol: .12 });
    T.pop(760, 150, '쭈르륵~', C.bean);
    const slide = lion.parts.art ? [[839, 203], [896, 336], [930, 500]] : [[925, 250], [975, 360], [880, 500]]; // 갈기 앞면을 따라 쭈르륵
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
      mouse = mk(T, T.world, 884, 476, drawMouse, 1.6); mouse.face('right'); // 사자 몸 뒤에 먼저 깔아 꼬리 끝이 앞발 밑에 들어간다
      lion = mk(T, T.world, 640, 500, drawLionLie, 1.8); lion.face('right'); lion.parts.eyes('open');
      if (lion.parts.art) lion.place(520, 500);
      head = lionFace(T, lion.parts.hg, lion.parts.art);
      pawHit = T.el('circle', { cx: LIE.lion_lie_awake.x + 30, cy: -38, r: 46, fill: '#fff', opacity: 0 }, lion.parts.hg);
      if (T.portrait()) camSnap(845, 330, 1);
    }, mouse.pos);
    squeak(T, 1800); mouse.wiggle(10);
    await say('사자가 커다란 앞발로 생쥐 꼬리를 탁! 눌렀어요.');
    head.set('yawn'); roar(T, .2);
    await say('사자가 하품하며 말했어요. "하암~ 한입에 꿀꺽 해 버릴까?"');
    head.set(null);
    await say('생쥐가 말했어요. "살려 주시면 꼭 은혜 갚을게요!"');
    await say('생쥐를 톡 눌러서 부탁해 봐요.');
    await T.tap(mouse.pos, { prompt: '생쥐를 톡 눌러 봐요!' });
    mouse.parts.arms.setAttribute('opacity', 0); mouse.parts.pray.setAttribute('opacity', 1);
    squeak(T, 1600); mouse.hop(16);
    T.pop(860, 380, '제발요~', C.pine);
    await say('생쥐가 두 손을 모았어요. "제발요, 사자님~"');

    /* --- 4. 하하하 (사자 클로즈업 → 컷) --- */
    await camTo(720, 300, 1.6, 900);
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
    await camTo(800, 380, 1.4, 900);
    AudioFX.sfx('creak', .5);
    // 사자가 웃느라 몸이 뒤로 젖혀져 앞발이 들린다 (몸 전체를 뒷발 끝을 축으로 돌림)
    await T.anim(lion.parts.hg, [{ rotate: '0deg' }, { rotate: '3deg' }], { duration: 1200, easing: 'ease-out' });
    await say('사자가 웃다가 앞발이 스르르 열렸어요. 앞발을 톡 눌러 봐요!');
    await T.tap(pawHit, { prompt: '사자 앞발을 톡 눌러 봐요!' });
    T.anim(lion.parts.hg, [{ rotate: '3deg' }, { rotate: '8deg' }], 500);
    mouse.parts.arms.setAttribute('opacity', 1); mouse.parts.pray.setAttribute('opacity', 0);
    T.tone([600, 1600], .25, { type: 'sine', vol: .14 });
    T.pop(860, 420, '쏙!', C.pine);
    await mouse.move(960, 480, 500, 'ease-in');
    laugh.cancel();
    await say('생쥐가 쏙 빠져나왔어요. "고맙습니다, 사자님!"');
    squeak(T);
    if (mouse.parts.look) mouse.parts.look('run'); // 쪼르르 달려 나간다
    await mouse.move(1250, 480, 700, 'ease-in');

    /* --- 5. 누가 더 클까? (비교 판) --- */
    await T.sceneCard('누가 더 클까?', () => { T.clear(); camSnap(500, 280, 1); boardBG(T); });
    // 사자 발가락 하나 = 생쥐 한 마리
    const bigPaw = el('g', {}, T.world);
    let toes;
    // 세로 화면(보이는 폭 ≈260): 발을 조금 작게, 생쥐를 가까이, 살짝 물러서서 둘 다 보이게
    const PT = T.portrait(), PW = PT ? 280 : 320, PX = PT ? 335 : 210, PY = PT ? 130 : 140, MX = PT ? 640 : 650;
    if (artUrl('paw_pad') && artUrl('paw_toe')) { // 그림: 발(발가락 셋) + 따로 오린 넷째 발가락 (0.8493, 0.3791 자리, 폭 .2443 높이 .2712)
      const PH = PW * 471 / 400;
      pic(T, bigPaw, 'paw_pad', PX, PY, PW, PH);
      const tw = PW * .2443, th = PH * .2712, toeG = el('g', {}, bigPaw);
      pic(T, toeG, 'paw_toe', PX + PW * .8493 - tw / 2, PY + PH * .3791 - th / 2, tw, th);
      toes = [null, null, null, toeG];
    } else {
      T.paper(bigPaw, [['ellipse', { cx: 370, cy: 400, rx: 130, ry: 80, fill: C.lion }]]);
      toes = [[250, 280], [325, 240], [415, 240], [490, 280]].map(([x, y]) => T.paper(bigPaw, [['circle', { cx: x, cy: y, r: 40, fill: C.lionDk }]]));
    }
    mouse = mk(T, T.world, MX, 322, drawMouse, 1.3);
    el('rect', { x: MX - 90, y: 322, width: 180, height: 14, rx: 6, fill: C.bark }, T.world);
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
    const card = (x, drawIn) => {
      const g = el('g', {}, T.world);
      el('rect', { x: x - CW / 2, y: 110, width: CW, height: 300, rx: 24, fill: '#fff', opacity: .001 }, g);
      const inner = CK < 1 ? el('g', { transform: `translate(${x},260) scale(${CK}) translate(${-x},-260)` }, g) : g;
      drawIn(inner, x, 260); return g;
    };
    const lionPrint = (g, x, y) => pic(T, g, 'print_lion', x - 130, y - 129, 260, 257);
    const mousePrint = (g, x, y) => pic(T, g, 'print_mouse', x - 26, y - 32, 52, 64);
    const lionTooth = (g, x, y) => pic(T, g, 'tooth_lion', x - 50, y - 131, 100, 262);
    const mouseTooth = (g, x, y) => pic(T, g, 'tooth_mouse', x - 34, y - 23, 68, 46);
    const OX = T.portrait() ? 95 : 120; // 주인은 카드 오른쪽 아래
    const owner = (who, x) => who === LION
      ? (() => { const g = el('g', { transform: `translate(${x + OX},390) scale(.75)` }, T.world); drawHead(T, g).eyes('happy'); return g; })()
      : mk(T, T.world, x + OX, 450, drawMouse, 1.3).pos;
    const rounds = [
      { q: '더 큰 발자국은 어느 쪽일까요?', prompt: '더 큰 발자국을 톡 눌러 봐요!', ans: LION, thing: '발자국',
        draw: { [LION]: lionPrint, [MOUSE]: mousePrint }, where: '두 발자국을 잘 봐요. 어느 쪽이 더 커다랗지?' },
      { q: '이번엔 이빨이에요. 더 작은 이빨은 어느 쪽일까요?', prompt: '더 작은 이빨을 톡 눌러 봐요!', ans: MOUSE, thing: '이빨',
        draw: { [LION]: lionTooth, [MOUSE]: mouseTooth }, where: '콩알처럼 조그만 이빨을 찾아봐요!' },
    ];
    for (const r of rounds) {
      const lionLeft = Math.random() < .5, CL = T.portrait() ? 375 : 290, CR = T.portrait() ? 625 : 710;
      const xs = { [LION]: lionLeft ? CL : CR, [MOUSE]: lionLeft ? CR : CL };
      const cards = { [LION]: card(xs[LION], r.draw[LION]), [MOUSE]: card(xs[MOUSE], r.draw[MOUSE]) };
      await say(r.q);
      const other = r.ans === LION ? MOUSE : LION;
      await T.choose([{ el: cards[r.ans], ok: true }, { el: cards[other], ok: false }], { prompt: r.prompt, where: r.where,
        who: `${josa(r.ans, '이/가')} 가진 ${josa(r.thing, '이에요/예요')}. 반짝이는 쪽을 눌러 봐요!` });
      const o1 = owner(LION, xs[LION]), o2 = owner(MOUSE, xs[MOUSE]);
      r.ans === LION ? roar(T, .2) : squeak(T);
      cards[r.ans].animate([{ translate: '0 0' }, { translate: '0 -16px' }, { translate: '0 0' }], 500);
      await say(`맞아요! ${r.ans} ${josa(r.thing, '이에요/예요')}.`);
      if (r.ans === MOUSE) await say('생쥐 이빨은 작지만 아주 튼튼해요. 사각사각 뭐든 갉을 수 있지요.');
      T.world.innerHTML = '';
      o1.remove(); o2.remove();
    }
    // 좁은 구멍: 그루터기 그림(구멍은 밑동 가운데) — 세로 화면은 셋이 다 보이게 조금 모으고 물러선다
    const HP = T.portrait(), HX = HP ? 546 : 500, LX = HP ? 280 : 230, SMX = HP ? 740 : 790;
    if (!pic(T, T.world, 'hole_stump', HX - 126, 130, 252, 340)) {
      T.paper(T.world, [['rect', { x: HX - 70, y: 150, width: 140, height: 320, rx: 10, fill: '#8A6344' }]]);
      el('path', { d: `M${HX - 30} 470 Q${HX - 30} 420 ${HX} 420 Q${HX + 30} 420 ${HX + 30} 470 Z`, fill: C.ink }, T.world);
    }
    if (HP) camSnap(500, 280, .42);
    const bl = mk(T, T.world, LX, 470, drawLionStand, .8); bl.face('right'); bl.parts.eyes('open');
    const sm = mk(T, T.world, SMX, 470, drawMouse, 1.4);
    await say('좁은 구멍이 있어요. 쏙 들어갈 수 있는 건 누구일까요?');
    await T.choose([
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
      who: `${josa(MOUSE, '이/가')} 들어갈 수 있어요. 반짝이는 친구를 눌러 봐요!` });
    squeak(T);
    await sm.move(HX + 20, 470, 500);
    T.tone([900, 400], .2, { type: 'sine', vol: .12 });
    T.pop(HX, 380, '쏙!', C.pine);
    sm.pos.style.opacity = '0';
    await sleep(600);
    sm.pos.style.opacity = '1'; await sm.move(HX + 120, 470, 400); sm.hop(20);
    await say('맞아요! 작은 생쥐는 좁은 구멍도 쏙!');
    await say('크면 큰 대로, 작으면 작은 대로 다 쓸모가 있어요.');

    /* --- 6. 그물 (밤 숲 하이앵글) --- */
    await T.sceneCard('밤 숲', () => {
      T.clear(); nightHighBG(T);
      lion = mk(T, T.world, 560, 420, drawLionLie, 1.3); lion.parts.eyes('open');
      if (!pic(T, T.world, 'net', 250, 160, 620, 620 * 512 / 1000)) { // 그물 그림(둥근 지붕꼴)이 사자를 덮는다
        const clip = el('clipPath', { id: 'lmNetClip' }, T.fx);
        el('ellipse', { cx: 570, cy: 330, rx: 270, ry: 150 }, clip);
        const net = el('g', { 'clip-path': 'url(#lmNetClip)', stroke: C.rope, 'stroke-width': 5 }, T.world);
        for (let k = -8; k < 16; k++) {
          el('line', { x1: 200 + k * 50, y1: 150, x2: 200 + k * 50 + 300, y2: 500 }, net);
          el('line', { x1: 200 + k * 50, y1: 150, x2: 200 + k * 50 - 300, y2: 500 }, net);
        }
      }
      mouse = mk(T, T.world, 120, 520, drawMouse, 1.2);
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
    await camTo(140, 470, 2.4, 1000);
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
      const defs = el('defs', {}, T.world), pat = el('pattern', { id: 'lmRopePat', width: 12, height: 12, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(40)' }, defs);
      el('rect', { width: 12, height: 12, fill: C.rope }, pat); el('rect', { width: 12, height: 5, fill: '#B98F4E' }, pat);
      hRopes = el('g', { stroke: 'url(#lmRopePat)', 'stroke-width': 9, 'stroke-linecap': 'round' }, T.world);
      [150, 250, 350, 450].forEach(y => el('line', { x1: 100, y1: y, x2: 900, y2: y }, hRopes));
      ropes = ROPES.map(x => {
        const g = el('g', { stroke: 'url(#lmRopePat)', 'stroke-width': 12, 'stroke-linecap': 'round' }, T.world);
        const top = el('line', { x1: x, y1: 70, x2: x, y2: 496 }, g);
        const bot = el('line', { x1: x, y1: 514, x2: x, y2: 540 }, g);
        el('line', { x1: x, y1: 496, x2: x, y2: 514 }, g).classList.add('mid');
        top.style.transformBox = 'view-box'; top.style.transformOrigin = `${x}px 70px`;
        return { g, top, bot, mid: g.querySelector('.mid') };
      });
      mouse = mk(T, T.world, ROPES[0] - 52, 545, drawMouse, 1.5); mouse.face('right');
    }, mouse.pos);
    const cnt = counter(T, 10);
    await say('생쥐가 작은 이빨로 그물을 갉아요. 톡톡 눌러서 한 줄씩 끊어 봐요!');
    q = Promise.resolve();
    const cutRope = i => {
      q = q.then(async () => {
        const x = ROPES[i];
        if (T.portrait()) camTo(x, 280, 1, 220); // 세로 화면: 카메라가 생쥐를 따라 옆으로
        if (i > 0) { squeak(T, 1500); mouse.hop(20, 220); await mouse.move(x - 52, 545, 220); }
        mouse.parts.teeth.setAttribute('opacity', 1);
        gnaw(T); T.tone([2600, 2000], .05, { type: 'square', vol: .05, when: .1 });
        const r = ropes[i];
        r.mid.remove();
        r.bot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
        r.top.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${i % 2 ? 6 : -6}deg)` }], { duration: 400, fill: 'forwards', easing: 'ease-out' });
        r.top.style.opacity = '.45';
        T.pop(x, 400, i % 2 ? '톡!' : '사각!', C.bean);
        cnt.fill(i);
        Narrator.speak(NUMS[i]);
        hRopes.setAttribute('opacity', 1 - (i + 1) / 12);
        if (i === 2) { lion.parts.paws.animate([{ translate: '0 0' }, { translate: '-10px -40px' }, { translate: '0 0' }], 700); }
        if (i === 5) { lion.parts.hg.animate([{ rotate: '0deg' }, { rotate: '-8deg' }, { rotate: '8deg' }, { rotate: '0deg' }], 700); }
        await sleep(200);
        mouse.parts.teeth.setAttribute('opacity', 0);
      });
    };
    await T.mash(T.root.querySelector('#stageWrap'), { count: 10, prompt: '톡톡 눌러서 그물을 갉아요!', onStep: i => cutRope(i - 1) });
    await q;
    await sleep(500);
    cnt.remove();
    await (cutArt('cut_gnaw', { sfx: () => gnaw(T), hold: 1600 }) || Promise.resolve()); // 싹둑! (그림 컷만)
    await say('하나, 둘, 셋… 열! 그물 줄 열 개를 다 끊었어요!');
    // 사자가 풀려난다
    await Promise.all([hRopes, ...ropes.map(r => r.g)].map(n => T.anim(n, [{ opacity: n.getAttribute('opacity') || 1 }, { opacity: 0 }], 600)));
    lion.pos.remove();
    lion = mk(T, T.world, 600, 520, drawLionStand, 1.6); lion.parts.eyes('happy');
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
      T.clear();
      if (bgUrl('morning')) {
        // 그림: 아침 초원을 좌우로 번갈아 뒤집어 이어 붙인 긴 띠(이음매가 거울처럼 맞는다)를 통째로 민다
        scroll = el('g', {}, T.bg); scroll.style.transformBox = 'view-box';
        bgImage(T, 'morning', scroll); T.bg.appendChild(scroll); // 가장자리 색 띠 위로
        for (let k = 1; k < 5; k++) {
          const t = el('g', { transform: k % 2 ? `translate(${BGBOX.x * 2 + BGBOX.w * (k + 1)},0) scale(-1,1)` : `translate(${BGBOX.w * k},0)` }, scroll);
          el('image', { href: bgUrl('morning'), x: BGBOX.x - 1, y: BGBOX.y, width: BGBOX.w + 2, height: BGBOX.h, preserveAspectRatio: 'none' }, t); // 양옆 1px 겹쳐 이음매 실선이 안 보이게
        }
        // 해는 띠에서 지워 두고 하나만 하늘에 고정(띠를 이어 붙여도 해가 둘로 늘지 않는다)
        el('image', { href: AS + 'v3w/lm_sun.webp', x: 81, y: 31, width: 108, height: 108, style: 'pointer-events:none' }, T.bg);
      } else {
        savannaBG(T, { morning: true });
        scroll = el('g', {}, T.bg);
        scroll.style.transformBox = 'view-box';
        for (let k = 0; k < 5; k++) acacia(T, scroll, 950 + k * 700, .8 + (k % 2) * .15);
        tufts(T, scroll, [...Array(24)].map((_, k) => 60 + k * 140), 495, C.leaf);
      }
      lion = mk(T, T.world, 380, 495, drawLionStand, 1.1); lion.face('right'); lion.parts.eyes('happy');
      const bk = lion.parts.back || [40, -152]; // 그림 사자: 그림 등 윗선
      rider = mk(T, lion.body, bk[0], bk[1], drawMouse, 1.1);
    }, lion.parts.H);
    await say('다음 날 아침, 사자가 생쥐를 등에 태웠어요. "꽉 잡아!"');
    let sx = 0;
    await T.mash(T.root.querySelector('#stageWrap'), { count: 3, prompt: '톡톡 눌러서 달려요!',
      onStep: () => {
        const from = sx; sx -= 520;
        scroll.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${sx}px)` }], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
        lion.body.animate([{ translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }], 900);
        AudioFX.sfx('step_grass', .5) || T.tone([160, 120], .12);
        T.pop(260, 300, '다다다!', C.bark);
      } });
    await sleep(900);
    await say('바람을 가르며 초원을 달려요! 신난다!');
    T.finale();
    await say('사자랑 생쥐를 톡톡 눌러 봐요. 같이 웃어요!');
    await T.tap(rider.pos);
    rider.hop(26, 320); T.pop(250, 250, '찍!', C.pine); vo('hi_mouse');
    await sleep(500);
    await T.tap(lion.pos);
    vo('hi_lion'); lion.parts.mouth('open'); setTimeout(() => lion.parts.mouth('smile'), 500); lion.hop(20, 360); T.pop(640, 190, '어흥~', C.persimmon);
    await sleep(900);
    await say(`그날부터 ${josa(LION, '과/와')} ${josa(MOUSE, '은/는')} 둘도 없는 친구가 되었답니다.`);
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
    Object.keys(targetsOf).forEach(k => { T[k] = async (...a) => { await T.fitTo(targetsOf[k](a)); return api[k](...a); }; });
    T.sceneCard = (label, change, focus) => api.sceneCard(label, () => {
      if (guardCam) { const c = api.camera; if (c.x === guardCam.x && c.y === guardCam.y && c.z === guardCam.z) api.camSnap(500, 280, 1); guardCam = null; }
      change && change();
    }, focus);
    return T;
  }

  Tale.mount({ title: '사자와 생쥐', subtitle: '작은 친구의 큰 힘', run: T => run(portraitGuard(Tale.api)) });
})();
