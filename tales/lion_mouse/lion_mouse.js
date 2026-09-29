/* 사자와 생쥐 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §14
   낮잠 사자 콧방울 → 생쥐 산책(갈기 미끄럼틀) → 잡혔다 → 하하하 → 크기 비교 3판 → 밤 그물 → 갉아요(10줄 세기) → 등에 타고 달리기.
   3~4세 순화: 사냥꾼은 나오지 않는다(먼 발소리만). 사자는 "꿀꺽 해 버릴까?" 대사만, 표정은 졸린 얼굴. */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32', indigo: '#1F2A56',
    persimmon: '#E8703A', bean: '#A93B32', pink: '#E8A0A0', ink: '#2E241C', sky: '#F2DFA8', snow: '#F4F6FA', amber: '#F2B366',
    lion: '#D9A94E', lionDk: '#C4923F', mane: '#E8703A', maneDk: '#C95F2E',
    mouse: '#A89A8C', mouseDk: '#8C7E72', rope: '#D9B878', ground: '#C9A95E' };
  const NUMS = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];

  /* ================= 캐릭터 (임시 도형) ================= */
  /* 사자 얼굴: 가운데가 (0,0). 눈·입 표정을 바꿀 수 있다 */
  function drawHead(T, g) {
    const { el, paper } = T;
    const H = el('g', {}, g);
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
  /* 선 사자 (왼쪽을 본다, 발끝 0). 등 위 (40,-152) */
  function drawLionStand(T, g) {
    const { el, paper } = T;
    el('path', { d: 'M140 -112 Q200 -120 204 -172', stroke: C.lion, 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round' }, g);
    paper(g, [['ellipse', { cx: 204, cy: -182, rx: 14, ry: 17, fill: C.maneDk }]]);
    paper(g, [['rect', { x: 96, y: -92, width: 26, height: 92, rx: 11, fill: C.lionDk }], ['rect', { x: -46, y: -92, width: 26, height: 92, rx: 11, fill: C.lionDk }]]);
    paper(g, [['ellipse', { cx: 30, cy: -104, rx: 118, ry: 50, fill: C.lion }],
      ['rect', { x: 126, y: -92, width: 26, height: 92, rx: 11, fill: C.lion }], ['rect', { x: -80, y: -92, width: 26, height: 92, rx: 11, fill: C.lion }]]);
    const hg = el('g', { transform: 'translate(-100,-150)' }, g);
    return { ...drawHead(T, hg), hg };
  }
  /* 생쥐 (왼쪽을 본다, 발끝 0, 키 약 62) */
  function drawMouse(T, g) {
    const { el, paper } = T;
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
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: '#EFE3B8' }, b);
    for (let i = 0; i < 16; i++) {
      const x = -40 + i * 72, h = 330 + (i * 53 % 4) * 45;
      paper(b, [['path', { d: `M${x} 520 Q${x + 12} ${520 - h / 2} ${x + 40} ${520 - h} Q${x + 30} ${520 - h / 2} ${x + 46} 520 Z`, fill: i % 2 ? '#A9BF7E' : '#8FAE6E' }]]);
    }
    paper(b, [['circle', { cx: 150, cy: 150, r: 34, fill: C.snow }], ['circle', { cx: 150, cy: 150, r: 13, fill: C.gold }], ['rect', { x: 147, y: 182, width: 6, height: 320, fill: C.pine }]]);
    paper(b, [['rect', { x: -200, y: 496, width: 1400, height: 200, fill: C.ground }]]);
  }
  /* 로우앵글: 하늘이 대부분, 땅은 아래 띠만 */
  function lowAngleBG(T) {
    const { el, paper } = T, b = T.bg;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: '#F6E7BE' }, b);
    for (let i = 0; i < 9; i++) {
      const x = -60 + i * 140;
      paper(b, [['path', { d: `M${x} 560 L${x + 30} ${40 + (i % 3) * 60} L${x + 60} 560 Z`, fill: i % 2 ? '#A9BF7E' : '#8FAE6E' }]]);
    }
    paper(b, [['rect', { x: -200, y: 505, width: 1400, height: 200, fill: C.ground }]]);
  }
  function boardBG(T) {
    const { el, paper } = T, b = T.bg;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.cream }, b);
    paper(b, [['rect', { x: 60, y: 40, width: 880, height: 440, rx: 16, fill: '#EFE0BD' }]]);
    paper(b, [['rect', { x: -200, y: 470, width: 1400, height: 200, fill: '#B98F4A' }]]);
  }
  /* 밤 숲 하이앵글: 위에서 내려다본 땅 */
  function nightHighBG(T) {
    const { el, paper } = T, b = T.bg;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: '#223227' }, b);
    paper(b, [['ellipse', { cx: 520, cy: 330, rx: 360, ry: 200, fill: '#34493A' }]]);
    [[40, 40, 120], [960, 60, 140], [-10, 380, 110], [990, 470, 130], [300, -40, 90], [720, 560, 100]].forEach(([x, y, r]) =>
      paper(b, [['circle', { cx: x, cy: y, r, fill: '#172219' }], ['circle', { cx: x - r * .2, cy: y - r * .2, r: r * .6, fill: '#1E3024' }]]));
    [[150, 480], [860, 250], [260, 140]].forEach(([x, y]) => paper(b, [['ellipse', { cx: x, cy: y, rx: 26, ry: 16, fill: '#5A5A52' }]]));
  }
  function nightNetBG(T) {
    const { el, paper } = T, b = T.bg;
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

    /* --- 1. 낮잠 사자 (와이드) --- */
    savannaBG(T);
    acacia(T, T.bg, 640, 1);
    el('ellipse', { cx: 640, cy: 486, rx: 250, ry: 24, fill: C.ink, opacity: .16 }, T.bg);
    tufts(T, T.bg, [90, 180, 880, 950], 500);
    let lion = mk(T, T.world, 640, 492, drawLionLie, 1.3);
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
    /* 대사 연출: 목소리 주인에게 카메라, 사자와 생쥐가 서로 마주 봄.
       '잡혔다' 장면의 사자는 얼굴 그림(head)뿐이라 얼굴을 배우처럼 넘긴다 (돌려세우지 않음) */
    T.director({
      cast: {
        lion: () => (head && head.H.isConnected ? { pos: head.H, body: head.H, x: 330, y: 175, scale: 1.75 } : lion),
        mouse: () => mouse,
      },
      listener: r => (r === 'lion' ? 'mouse' : 'lion'),
    });
    const vo = k => typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k] && AudioFX.voice(VOICE_LINES[k]); // 말풍선 없는 소리 대사
    const cutVo = k => setTimeout(() => vo(k), 380);
    await T.sceneCard('생쥐의 산책', () => {
      breathe2.cancel();
      T.clear(); grassForestBG(T);
      lion = mk(T, T.world, 640, 500, drawLionLie, 1.8); lion.face('right'); lion.parts.eyes('shut');
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
    for (const [x, y, d] of [[232, 488, 380], [372, 376, 500], [568, 302, 500], [690, 250, 400], [815, 170, 450]]) {
      squeak(T, 1500); mouse.hop(24, d); follow(x, d); await mouse.move(x, y, d);
    }
    await sleep(200);
    mouse.body.style.transform = 'rotate(-35deg)';
    T.tone([1400, 500], .9, { type: 'sine', vol: .12 });
    T.pop(760, 150, '쭈르륵~', C.bean);
    await mouse.move(925, 250, 260, 'ease-in');
    await mouse.move(975, 360, 240, 'linear');
    follow(760, 500);
    await mouse.move(880, 500, 320, 'ease-out');
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
    await T.cut(svg => {
      el('rect', { x: 0, y: 250, width: 400, height: 50, fill: C.ground }, svg);
      T.paper(svg, [['rect', { x: 150, y: -20, width: 120, height: 190, rx: 30, fill: C.lion }], ['ellipse', { cx: 210, cy: 190, rx: 110, ry: 55, fill: C.lion }],
        ...[140, 185, 235, 280].map(x => ['circle', { cx: x, cy: 238, r: 20, fill: C.lionDk }])]);
      el('text', { x: 90, y: 110, 'text-anchor': 'middle', 'font-size': 80, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '탁!' }, svg);
    }, { sfx: 'thud', hold: 1800 });

    /* --- 3. 잡혔다! (생쥐 시점 로우앵글) --- */
    let paw;
    await T.sceneCard('잡혔다!', () => {
      T.clear(); lowAngleBG(T);
      if (T.portrait()) camSnap(500, 280, 1);
      T.paper(T.world, [['ellipse', { cx: 560, cy: 40, rx: 330, ry: 190, fill: C.lionDk }]]); // 올려다본 사자 가슴
      const hg = el('g', { transform: 'translate(330,175) scale(1.75)' }, T.world);
      head = drawHead(T, hg); head.eyes('sleepy');
      mouse = mk(T, T.world, 490, 520, drawMouse, 2.1);
      paw = el('g', {}, T.world);
      paw.style.transformBox = 'view-box'; paw.style.transformOrigin = '0 0';
      T.paper(paw, [['rect', { x: 600, y: -40, width: 150, height: 470, rx: 40, fill: C.lion }], ['ellipse', { cx: 670, cy: 450, rx: 120, ry: 58, fill: C.lion }],
        ...[575, 635, 700, 760].map(x => ['circle', { cx: x, cy: 492, r: 26, fill: C.lionDk }])]);
    }, mouse.pos);
    squeak(T, 1800); mouse.wiggle(10);
    await say('사자가 커다란 앞발로 생쥐 꼬리를 탁! 눌렀어요.');
    head.mouth('open'); roar(T, .2);
    await say('사자가 하품하며 말했어요. "하암~ 한입에 꿀꺽 해 버릴까?"');
    head.mouth('smile');
    await say('생쥐가 말했어요. "살려 주시면 꼭 은혜 갚을게요!"');
    await say('생쥐를 톡 눌러서 부탁해 봐요.');
    await T.tap(mouse.pos, { prompt: '생쥐를 톡 눌러 봐요!' });
    mouse.parts.arms.setAttribute('opacity', 0); mouse.parts.pray.setAttribute('opacity', 1);
    squeak(T, 1600); mouse.hop(16);
    T.pop(420, 330, '제발요~', C.pine);
    await say('생쥐가 두 손을 모았어요. "제발요, 사자님~"');

    /* --- 4. 하하하 (사자 클로즈업 → 컷) --- */
    await camTo(330, 200, 1.6, 900);
    head.eyes('open');
    await say('"네가? 나를 도와준다고?"');
    cutVo('cut_laugh');
    await T.cut(svg => {
      const g = el('g', { transform: 'translate(200,160) scale(1.25)' }, svg);
      const h = drawHead(T, g); h.eyes('happy'); h.mouth('open');
      el('text', { x: 200, y: 290, 'text-anchor': 'middle', 'font-size': 64, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '하하하!' }, svg);
    }, { hold: 2200 });
    head.eyes('happy'); head.mouth('open');
    roar(T, .15);
    const laugh = head.H.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 300, iterations: Infinity });
    await camTo(600, 400, 1.4, 900);
    AudioFX.sfx('creak', .5);
    await T.anim(paw, [{ translate: '0 0' }, { translate: '0 -40px' }], { duration: 1200, easing: 'ease-out' });
    await say('사자가 웃다가 앞발이 스르르 열렸어요. 앞발을 톡 눌러 봐요!');
    await T.tap(paw, { prompt: '사자 앞발을 톡 눌러 봐요!' });
    T.anim(paw, [{ translate: '0 -40px' }, { translate: '0 -140px' }], 500);
    mouse.parts.arms.setAttribute('opacity', 1); mouse.parts.pray.setAttribute('opacity', 0);
    T.tone([600, 1600], .25, { type: 'sine', vol: .14 });
    T.pop(420, 380, '쏙!', C.pine);
    await mouse.move(250, 520, 500, 'ease-in');
    laugh.cancel(); head.mouth('smile');
    await say('생쥐가 쏙 빠져나왔어요. "고맙습니다, 사자님!"');
    squeak(T);
    await mouse.move(-150, 520, 700, 'ease-in');

    /* --- 5. 누가 더 클까? (비교 판) --- */
    await T.sceneCard('누가 더 클까?', () => { T.clear(); camSnap(500, 280, 1); boardBG(T); });
    // 사자 발가락 하나 = 생쥐 한 마리
    const bigPaw = el('g', {}, T.world);
    T.paper(bigPaw, [['ellipse', { cx: 370, cy: 400, rx: 130, ry: 80, fill: C.lion }]]);
    const toes = [[250, 280], [325, 240], [415, 240], [490, 280]].map(([x, y]) => T.paper(bigPaw, [['circle', { cx: x, cy: y, r: 40, fill: C.lionDk }]]));
    mouse = mk(T, T.world, 650, 322, drawMouse, 1.3);
    el('rect', { x: 560, y: 322, width: 180, height: 14, rx: 6, fill: C.bark }, T.world);
    await say('사자 발과 생쥐를 나란히 놓아 볼까요?');
    const toe = toes[3]; toe.style.filter = 'url(#hintGlow)';
    toe.animate([{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 700, iterations: 2 });
    mouse.hop(20); squeak(T);
    await say('사자 발가락 하나가 생쥐 한 마리만 해요!');
    toe.style.filter = '';
    bigPaw.remove(); mouse.pos.remove(); T.world.innerHTML = '';

    const card = (x, drawIn) => {
      const g = el('g', {}, T.world);
      T.paper(g, [['rect', { x: x - 150, y: 110, width: 300, height: 300, rx: 24, fill: C.cream, stroke: C.gold, 'stroke-width': 6 }]]);
      drawIn(g, x, 260); return g;
    };
    const lionPrint = (g, x, y) => T.paper(g, [['ellipse', { cx: x, cy: y + 30, rx: 62, ry: 48, fill: C.bark }], ...[-60, -22, 22, 60].map((dx, k) => ['ellipse', { cx: x + dx, cy: y - 42 - (k === 1 || k === 2 ? 14 : 0), rx: 20, ry: 25, fill: C.bark }])]);
    const mousePrint = (g, x, y) => T.paper(g, [['circle', { cx: x, cy: y + 10, r: 16, fill: C.bark }], ...[-18, -7, 7, 18].map(dx => ['circle', { cx: x + dx, cy: y - 16, r: 6.5, fill: C.bark }])]);
    const lionTooth = (g, x, y) => T.paper(g, [['path', { d: `M${x - 50} ${y - 90} L${x + 50} ${y - 90} L${x} ${y + 100} Z`, fill: C.snow, stroke: C.ink, 'stroke-width': 3 }]]);
    const mouseTooth = (g, x, y) => T.paper(g, [['rect', { x: x - 15, y: y - 18, width: 14, height: 32, rx: 3, fill: C.snow, stroke: C.ink, 'stroke-width': 2 }], ['rect', { x: x + 1, y: y - 18, width: 14, height: 32, rx: 3, fill: C.snow, stroke: C.ink, 'stroke-width': 2 }]]);
    const owner = (who, x) => who === LION
      ? (() => { const g = el('g', { transform: `translate(${x + 120},390) scale(.75)` }, T.world); drawHead(T, g).eyes('happy'); return g; })()
      : mk(T, T.world, x + 120, 450, drawMouse, 1.3).pos;
    const rounds = [
      { q: '더 큰 발자국은 어느 쪽일까요?', prompt: '더 큰 발자국을 톡 눌러 봐요!', ans: LION, thing: '발자국',
        draw: { [LION]: lionPrint, [MOUSE]: mousePrint }, where: '두 발자국을 잘 봐요. 어느 쪽이 더 커다랗지?' },
      { q: '이번엔 이빨이에요. 더 작은 이빨은 어느 쪽일까요?', prompt: '더 작은 이빨을 톡 눌러 봐요!', ans: MOUSE, thing: '이빨',
        draw: { [LION]: lionTooth, [MOUSE]: mouseTooth }, where: '콩알처럼 조그만 이빨을 찾아봐요!' },
    ];
    for (const r of rounds) {
      const lionLeft = Math.random() < .5;
      const xs = { [LION]: lionLeft ? 290 : 710, [MOUSE]: lionLeft ? 710 : 290 };
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
    // 좁은 구멍
    T.paper(T.world, [['rect', { x: 430, y: 150, width: 140, height: 320, rx: 10, fill: '#8A6344' }]]);
    el('path', { d: 'M470 470 Q470 420 500 420 Q530 420 530 470 Z', fill: C.ink }, T.world);
    const bl = mk(T, T.world, 230, 470, drawLionStand, .8); bl.face('right'); bl.parts.eyes('open');
    const sm = mk(T, T.world, 790, 470, drawMouse, 1.4);
    await say('좁은 구멍이 있어요. 쏙 들어갈 수 있는 건 누구일까요?');
    await T.choose([
      { el: sm.pos, ok: true },
      { el: bl.pos, ok: false, onWrong: async () => {
        await bl.move(300, 470, 500);
        AudioFX.sfx('bonk') || T.tone([300, 150], .2); T.shake(); T.pop(430, 250, '쿵!');
        bl.parts.eyes('shut');
        await sleep(700);
        bl.parts.eyes('open');
        await bl.move(230, 470, 500);
      } },
    ], { prompt: '구멍에 쏙 들어갈 친구를 톡 눌러 봐요!', where: '사자는 너무 커서 코가 쿵! 부딪혀요. 작은 친구는 누구지?',
      who: `${josa(MOUSE, '이/가')} 들어갈 수 있어요. 반짝이는 친구를 눌러 봐요!` });
    squeak(T);
    await sm.move(520, 470, 500);
    T.tone([900, 400], .2, { type: 'sine', vol: .12 });
    T.pop(500, 380, '쏙!', C.pine);
    sm.pos.style.opacity = '0';
    await sleep(600);
    sm.pos.style.opacity = '1'; await sm.move(620, 470, 400); sm.hop(20);
    await say('맞아요! 작은 생쥐는 좁은 구멍도 쏙!');
    await say('크면 큰 대로, 작으면 작은 대로 다 쓸모가 있어요.');

    /* --- 6. 그물 (밤 숲 하이앵글) --- */
    await T.sceneCard('밤 숲', () => {
      T.clear(); nightHighBG(T);
      lion = mk(T, T.world, 560, 420, drawLionLie, 1.3); lion.parts.eyes('open');
      const clip = el('clipPath', { id: 'lmNetClip' }, T.fx);
      el('ellipse', { cx: 570, cy: 330, rx: 270, ry: 150 }, clip);
      const net = el('g', { 'clip-path': 'url(#lmNetClip)', stroke: C.rope, 'stroke-width': 5 }, T.world);
      for (let k = -8; k < 16; k++) {
        el('line', { x1: 200 + k * 50, y1: 150, x2: 200 + k * 50 + 300, y2: 500 }, net);
        el('line', { x1: 200 + k * 50, y1: 150, x2: 200 + k * 50 - 300, y2: 500 }, net);
      }
      mouse = mk(T, T.world, 120, 520, drawMouse, 1.2);
      mouse.face('right');
    });
    lion.parts.mouth('open'); roar(T, .5); T.pop(430, 170, '어흥!');
    const struggle = lion.body.animate([{ rotate: '0deg' }, { rotate: '-2deg' }, { rotate: '2deg' }, { rotate: '0deg' }], { duration: 500, iterations: Infinity });
    await say('밤이 되었어요. 앗, 사자가 그물에 걸렸어요!');
    lion.parts.mouth('smile');
    cutVo('cut_net');
    await T.cut(svg => {
      const g = el('g', { transform: 'translate(200,150) scale(1.2)' }, svg);
      const h = drawHead(T, g); h.eyes('shut'); h.mouth('open');
      const n = el('g', { stroke: C.rope, 'stroke-width': 5 }, svg);
      for (let k = -4; k < 12; k++) { el('line', { x1: k * 40, y1: 0, x2: k * 40 + 240, y2: 300 }, n); el('line', { x1: k * 40, y1: 0, x2: k * 40 - 240, y2: 300 }, n); }
      el('text', { x: 200, y: 285, 'text-anchor': 'middle', 'font-size': 56, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '버둥버둥' }, svg);
    }, { hold: 2000 });
    AudioFX.sfx('step_grass', .15);
    await say('사자가 버둥버둥, 그래도 그물이 풀리지 않아요.');
    await camTo(140, 470, 2.4, 1000);
    await T.anim(mouse.parts.ears, [{ transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }], 900);
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
      hRopes = el('g', { stroke: C.rope, 'stroke-width': 7, 'stroke-linecap': 'round' }, T.world);
      [150, 250, 350, 450].forEach(y => el('line', { x1: 100, y1: y, x2: 900, y2: y }, hRopes));
      ropes = ROPES.map(x => {
        const g = el('g', { stroke: C.rope, 'stroke-width': 10, 'stroke-linecap': 'round' }, T.world);
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
      T.clear(); savannaBG(T, { morning: true });
      scroll = el('g', {}, T.bg);
      scroll.style.transformBox = 'view-box';
      for (let k = 0; k < 5; k++) acacia(T, scroll, 950 + k * 700, .8 + (k % 2) * .15);
      tufts(T, scroll, [...Array(24)].map((_, k) => 60 + k * 140), 495, C.leaf);
      lion = mk(T, T.world, 380, 495, drawLionStand, 1.1); lion.face('right'); lion.parts.eyes('happy');
      rider = mk(T, lion.body, 40, -152, drawMouse, 1.1);
    }, lion.parts.H);
    await say('다음 날 아침, 사자가 생쥐를 등에 태웠어요. "꽉 잡아!"');
    let sx = 0;
    await T.swipe(T.root.querySelector('#stageWrap'), { dir: 'right', count: 3, prompt: '옆으로 쓱 밀어서 달려요!',
      onStep: () => {
        const from = sx; sx -= 520;
        scroll.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${sx}px)` }], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
        lion.body.animate([{ translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }], 900);
        AudioFX.sfx('step_grass', .5) || T.tone([160, 120], .12);
        T.pop(260, 300, '다다다!', C.bark);
      } });
    await sleep(900);
    await say('바람을 가르며 초원을 달려요! 신난다!');
    await say('사자랑 생쥐를 톡톡 눌러 봐요. 같이 웃어요!');
    await T.free([
      { el: rider.pos, onTap: () => { rider.hop(26, 320); T.pop(390, 220, '찍!', C.pine); vo('hi_mouse'); } },
      { el: lion.pos, onTap: () => { vo('hi_lion'); lion.parts.mouth('open'); setTimeout(() => lion.parts.mouth('smile'), 500); lion.hop(20, 360); T.pop(560, 200, '어흥~', C.persimmon); } },
    ], 12000);
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
