/* 퐁! 구름 공장 — 가족 동화. 다현이·이현이·은우와 강아지 꿀떡이가 구름 냄새를 따라 구름 공장에 가서,
   빨간 단추로 나온 아기 먹구름을 달래고 무지개를 만든다. 조작은 모두 톡 · 톡톡톡(세기) · 골라요. 틀려도 부드럽게 다시.
   이름 토큰(누나 c1=다현, 오빠 c2=이현, 막내 c3=은우, dog=꿀떡이)은 script_draft.txt 에 적어 두었다. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const BGS = ['window', 'frontdoor', 'meadow', 'door', 'inside', 'corner', 'rain', 'rainbow', 'sunset', 'night'];
  const CUTS = ['hug', 'rainbow'];
  const SPR = ['cloud3', 'cloud_rabbit', 'cloud_fish', 'dark_teary', 'dark_cry', 'dark_smile',
    'nuna_lookup', 'nuna_reach', 'nuna_wave', 'nuna_jump', 'nuna_back', 'nuna_hug', 'nuna_press', 'nuna_walk',
    'oppa_lookup', 'oppa_reach', 'oppa_wave', 'oppa_jump', 'oppa_back', 'oppa_hug', 'oppa_walk',
    'agi_lookup', 'agi_reach', 'agi_wave', 'agi_jump', 'agi_back', 'agi_hug', 'agi_press', 'agi_walk',
    'dog_lookup', 'dog_run', 'dog_wag', 'dog_sniff'];
  const sprFile = f => (/_walk$/.test(f) || f === 'dog_sniff') ? 'kk_' + f : 'cf_' + f;
  const src = f => AS + sprFile(f) + '.webp';
  const BG2 = ['window', 'frontdoor', 'meadow', 'inside']; // 새 종이공예 배경
  const bgSrc = k => AS + (BG2.includes(k) ? 'cf_bg2_' : 'cf_bg_') + k + '.webp', cutSrc = k => AS + 'cf_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const ASP = {}; // 그림 가로/세로 (불러온 뒤 채운다)

  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * (ASP[f] || .6), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: src(f), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        wrap.style.display = 'none'; looks[k] = { wrap, h, nat };
      });
    });
    a.want = 'left'; a.looks = looks;
    a.turn = d => { a.want = d; a.face(looks[a.cur].nat === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const prop = (T, f, h, nat = 'right') => mk(T, { a: [f, h, nat] });
  function put(T, a, x, y = GROUND, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 400) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);

  /* 모양 바꾸기: 옛 그림이 흐려지며 새 그림이 번져 나타난다 (바로 바꾸지 않는다) */
  function morph(a, key, ms = 800) {
    const oldW = a.looks[a.cur].wrap, nw = a.looks[key].wrap;
    if (oldW === nw) return;
    a.look(key); oldW.style.display = '';
    nw.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms, easing: 'ease-in-out' });
    const an = oldW.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' });
    an.onfinish = () => { oldW.style.display = 'none'; an.cancel(); };
  }

  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const NUM = ['하나!', '둘!', '셋!', '넷!'];

  async function run(T) {
    const { sleep, say, camSnap } = T;
    const tr = T.tr, el = T.el;
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 약 430만 보인다 */
    const X = (l, p) => P ? p : l;
    let sceneTok = 0, clipN = 0;
    const live = new Set(); /* 떠 있는 퐁 구름 (최대 8) */
    const scene = (key, cx = 500) => {
      sceneTok++; live.clear();
      T.clear(); stopRain();
      el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
      if (SKY[key]) skyScene(key);
      camSnap(P ? cx : 500, 280, 1);
    };
    /* 하늘에 늘 천천히 떠가는 종이 구름. list: [y, 너비, 한 바퀴 초, 시작 위치(0~1), 투명도] · clip: 창 안에서만 보이게 */
    const sky = (list, clip) => {
      const g = el('g', {}, T.bg);
      if (clip) { const id = 'cfClip' + (++clipN); el('rect', clip, el('clipPath', { id }, g)); g.setAttribute('clip-path', `url(#${id})`); }
      list.forEach(([y, w, dur, f, op = .9]) => {
        const h = w / (ASP.cloud3 || 1.9), x0 = (clip ? clip.x : -40) - w / 2, x1 = (clip ? clip.x + clip.width : 1040) + w / 2;
        const im = el('image', { href: src('cloud3'), x: -w / 2, y: -h / 2, width: w, height: h, preserveAspectRatio: 'none' }, g);
        im.style.opacity = op;
        im.animate([{ transform: `translate(${x0}px,${y}px)` }, { transform: `translate(${x1}px,${y}px)` }], { duration: dur * 1000, iterations: Infinity, delay: -dur * 1000 * f });
      });
    };
    const SKY = {
      window: [[{ x: 301, y: 60, width: 376, height: 320 }], [[112, 72, 46, .2, .85], [335, 56, 62, .65, .7], [172, 46, 78, .9, .6]]],
      frontdoor: [[], [[42, 110, 110, .1], [92, 70, 84, .55, .85], [66, 50, 140, .85, .8]]],
      meadow: [[], [[60, 120, 104, .15], [150, 80, 78, .6], [228, 60, 124, .9, .8]]],
      door: [[], [[40, 110, 104, .3], [76, 64, 84, .7, .85], [56, 46, 136, .05, .8]]],
      rainbow: [[], [[44, 100, 112, .5], [190, 60, 84, .2, .85], [158, 44, 140, .8, .8]]],
      sunset: [[], [[40, 120, 112, .2, .8], [112, 70, 88, .6, .75], [172, 50, 132, .9, .7]]],
      night: [[{ x: 304, y: 35, width: 392, height: 336 }], [[92, 70, 62, .3, .35], [212, 52, 84, .7, .3], [300, 44, 104, .05, .28]]],
    };
    /* 연기 한 덩이가 올라가며 진짜 구름으로 번진다. to:'pipe' 는 공장 안 천장 굴뚝관으로 빠져나간다 */
    const puffToCloud = (x, y, o = {}) => {
      const k = o.k || 1, rise = o.rise ?? 50, dx = o.dx ?? 300, pipe = o.to === 'pipe';
      for (const n of [...live]) if (!n.isConnected) live.delete(n);
      while (live.size >= 8) { const old = live.values().next().value; live.delete(old); old.remove(); }
      const g = el('g', {}, T.fx); live.add(g);
      const pf = el('g', { filter: 'url(#pp)' }, g);
      const L = [[-14, 4, 15], [6, -6, 19], [22, 5, 14], [4, 9, 16]];
      L.forEach(([cx, cy, r]) => el('circle', { cx, cy: cy + 2.5, r, fill: '#C9C3BA' }, pf));
      L.forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#ECE9E4' }, pf));
      const cw = 92, ch = cw / (ASP.cloud3 || 1.9);
      const cl = el('image', { href: src('cloud3'), x: -cw / 2, y: -ch / 2, width: cw, height: ch, preserveAspectRatio: 'none' }, g); cl.style.opacity = 0;
      const tf = (a, b, s) => `translate(${a}px,${b}px) scale(${s * k})`;
      const life = pipe ? 5200 : (o.life || 9800), r = (pipe ? 1800 : 1100) / life, top = y - rise;
      const kf = [
        { transform: tf(x, y, .55), opacity: 0, offset: 0 },
        { transform: tf(x + 7, y - rise * .25, .8), opacity: 1, offset: r * .2, easing: 'ease-out' },
        { transform: tf(x - 7, y - rise * .55, 1.05), opacity: 1, offset: r * .5 },
        { transform: tf(x + 6, y - rise * .8, 1.25), opacity: 1, offset: r * .78 },
        { transform: tf(x, top, 1.4), opacity: 1, offset: r }];
      if (pipe) { const [px, py] = o.dest; kf.push({ transform: tf(x + (px - x) * .75, top + (py - top) * .75, 1.15), opacity: 1, offset: .82 }, { transform: tf(px, py, .35), opacity: 0, offset: 1 }); }
      else kf.push({ transform: tf(x + dx * .35, top + 6, 1.65), opacity: 1, offset: .35 }, { transform: tf(x + dx * .75, top + 14, 1.9), opacity: 1, offset: .82 }, { transform: tf(x + dx, top + 10, 1.95), opacity: 0, offset: 1 });
      const fade = { duration: pipe ? 1800 : 3200, delay: 150, fill: 'forwards', easing: 'ease-in-out' };
      pf.animate([{ opacity: 1 }, { opacity: 0 }], fade); cl.animate([{ opacity: 0 }, { opacity: 1 }], fade);
      g.animate(kf, { duration: life, fill: 'forwards' }).onfinish = () => { live.delete(g); g.remove(); };
      return g;
    };
    /* 굴뚝에서 가만히 이어지는 연기 */
    const chimneyLoop = async () => {
      const my = sceneTok; let i = 0;
      await sleep(700);
      while (my === sceneTok) { puffToCloud(497, 106, { k: .8, rise: 40 + (i % 3) * 10, dx: 260 + (i % 3) * 40, life: 9000 }); i++; await sleep(2000); }
    };
    const skyScene = key => { const [clip, list] = SKY[key]; sky(list, clip[0]); };
    const hit = (cx, cy, r) => el('circle', { cx, cy, r, fill: 'transparent' }, T.world);
    const hitRect = (x, y, w, h) => el('rect', { x, y, width: w, height: h, rx: 18, fill: 'transparent' }, T.world);
    /* 종이 조각이 튀는 모양 (퐁!) */
    const puff = (x, y, color = '#fff') => {
      for (let k = 0; k < 7; k++) {
        const a = k / 7 * Math.PI * 2, c = el('circle', { cx: x, cy: y, r: 6 + (k % 3) * 2, fill: color, stroke: '#D8CFC2', 'stroke-width': 1.5 }, T.fx);
        const an = c.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * 46}px,${Math.sin(a) * 40 - 8}px) scale(.3)`, opacity: 0 }], { duration: 520, easing: 'ease-out' });
        an.onfinish = () => c.remove();
      }
    };
    const ring = (x, y) => {
      const c = el('ellipse', { cx: x, cy: y, rx: 20, ry: 6, fill: 'none', stroke: '#7FA9C9', 'stroke-width': 3 }, T.world);
      const an = c.animate([{ transform: 'scale(.5)', opacity: .9 }, { transform: 'scale(2.2)', opacity: 0 }], { duration: 600, easing: 'ease-out' });
      c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center'; an.onfinish = () => c.remove();
    };
    /* 비: 떨어지는 물방울 */
    let rainG = null;
    function startRain(x0 = 270, x1 = 730, y0 = 250, n = 16) {
      stopRain();
      rainG = el('g', {}, T.fx);
      for (let k = 0; k < n; k++) {
        const x = x0 + (x1 - x0) * ((k * 0.618) % 1), d = el('path', { d: 'M0 -10 C6 0 7 6 0 8 C-7 6 -6 0 0 -10Z', fill: '#6FB1E0', stroke: '#fff', 'stroke-width': 1.5, transform: `translate(${x},${y0})` }, rainG);
        d.animate([{ transform: `translate(${x}px,${y0}px)`, opacity: 0 }, { transform: `translate(${x}px,${y0 + 30}px)`, opacity: 1, offset: .15 }, { transform: `translate(${x - 12}px,${GROUND + 20}px)`, opacity: .9, offset: .9 }, { transform: `translate(${x - 14}px,${GROUND + 30}px)`, opacity: 0 }], { duration: 1500, delay: (k * 97) % 1500, iterations: Infinity });
      }
    }
    function stopRain() { if (rainG) { rainG.remove(); rainG = null; } }
    const BOLT = 'M18 0 L-14 44 L2 44 L-12 92 L28 36 L10 36 Z';
    /* 마음 카드 (골라요) */
    const feelCard = (cx, cy, kind, label) => {
      const g = el('g', { transform: `translate(${cx},${cy}) scale(${P ? .85 : 1})` }, T.fx);
      const inner = el('g', {}, g); const body = T.paper(inner, [
        ['rect', { x: -70, y: -50, width: 140, height: 100, rx: 20, fill: '#F6ECD8', stroke: '#6B4A32', 'stroke-width': 3 }],
        ['circle', { cx: 0, cy: -8, r: 24, fill: kind === 'sad' ? '#9DB4C8' : '#F6C945' }],
        ['circle', { cx: -8, cy: -13, r: 3.4, fill: '#2E241C' }], ['circle', { cx: 8, cy: -13, r: 3.4, fill: '#2E241C' }],
        ['path', { d: kind === 'sad' ? 'M-9 4 Q0 -2 9 4' : 'M-10 0 Q0 12 10 0', fill: 'none', stroke: '#2E241C', 'stroke-width': 3, 'stroke-linecap': 'round' }],
        ...(kind === 'sad' ? [['path', { d: 'M-12 -6 q-3 8 0 10 q3 -2 0 -10z', fill: '#6FB1E0' }]] : []),
      ]);
      const t = el('text', { x: 0, y: 44, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#2E241C', 'font-family': "'Pretendard Variable', Pretendard, sans-serif" }, inner); t.textContent = tr(label);
      g.style.pointerEvents = 'all';
      return g;
    };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all([...loads, Promise.all(SPR.map(f => new Promise(res => { const i = new Image(); i.onload = () => { ASP[f] = i.naturalWidth / i.naturalHeight; res(); }; i.onerror = res; i.src = src(f); })))]), sleep(5000)]);

    const nuna = mk(T, { lookup: ['nuna_lookup', 258, 'right'], reach: ['nuna_reach', 258, 'right'], wave: ['nuna_wave', 258, 'right'], jump: ['nuna_jump', 270, 'right'],
      back: ['nuna_back', 252, 'right'], hug: ['nuna_hug', 240, 'right'], press: ['nuna_press', 258, 'right'], walk: ['nuna_walk', 258, 'right'] });
    const oppa = mk(T, { lookup: ['oppa_lookup', 234, 'right'], reach: ['oppa_reach', 234, 'right'], wave: ['oppa_wave', 234, 'right'], jump: ['oppa_jump', 246, 'right'],
      back: ['oppa_back', 228, 'right'], hug: ['oppa_hug', 222, 'right'], walk: ['oppa_walk', 234, 'right'] });
    const agi = mk(T, { lookup: ['agi_lookup', 192, 'right'], reach: ['agi_reach', 192, 'right'], wave: ['agi_wave', 192, 'right'], jump: ['agi_jump', 210, 'right'],
      back: ['agi_back', 186, 'right'], hug: ['agi_hug', 180, 'right'], press: ['agi_press', 192, 'right'], walk: ['agi_walk', 192, 'right'] });
    const dog = mk(T, { lookup: ['dog_lookup', 144, 'right'], run: ['dog_run', 92, 'right'], wag: ['dog_wag', 126, 'right'], sniff: ['dog_sniff', 90, 'right'] });
    const dark = mk(T, { teary: ['dark_teary', 150, 'right'], cry: ['dark_cry', 165, 'right'], smile: ['dark_smile', 150, 'right'] });
    const cloudA = mk(T, { c: ['cloud3', 76, 'left'], rabbit: ['cloud_rabbit', 92, 'right'] });
    const cloudB = mk(T, { c: ['cloud3', 70, 'right'], fish: ['cloud_fish', 66, 'right'] });
    const cloudC = mk(T, { c: ['cloud3', 76, 'right'] });
    const clouds = [cloudA, cloudB, cloudC];
    const btn = T.actor(T.world, 885, 345, g => T.paper(g, [
      ['rect', { x: -66, y: -26, width: 132, height: 30, rx: 8, fill: '#E8D9BD', stroke: '#B79F78', 'stroke-width': 2 }],
      ['ellipse', { cx: 0, cy: -30, rx: 52, ry: 17, fill: '#9E2A1F' }], ['ellipse', { cx: 0, cy: -38, rx: 50, ry: 16, fill: '#E8402B' }],
      ['ellipse', { cx: -10, cy: -42, rx: 24, ry: 6, fill: '#F6806A' }], ['circle', { cx: -54, cy: -11, r: 3.5, fill: '#B79F78' }], ['circle', { cx: 54, cy: -11, r: 3.5, fill: '#B79F78' }]]));
    T.world.removeChild(btn.pos);
    const winClouds = [0, 1, 2].map(() => prop(T, 'cloud3', 62));

    /* --- 1. 아침 창가 --- */
    scene('window');
    put(T, nuna, X(330, 350), 522, { look: 'lookup', to: 'right' });
    put(T, oppa, X(430, 440), 522, { look: 'lookup', to: 'right' });
    put(T, agi, X(535, 525), 522, { look: 'lookup', to: 'left' });
    put(T, dog, X(650, 620), 535, { look: 'sniff', to: 'left' });
    await T.curtain(true);
    await say('다현이와 이현이와 은우는 아침마다 창밖을 봐요.');
    await say('하늘에 구름이 하나, 둘, 셋.');
    await say('구름을 톡톡톡 눌러서 세어 봐요!');
    const WC = [[388, 250], [500, 250], [612, 250]];
    const wh = el('g', {}, T.world); WC.forEach(([x, y]) => el('circle', { cx: x, cy: y - 30, r: 48, fill: 'transparent' }, wh));
    await T.mash(wh, { count: 3, prompt: '구름을 톡톡톡 눌러서 세어 봐요!', onStep: i => {
      const c = put(T, winClouds[i - 1], WC[i - 1][0], WC[i - 1][1]); fadeIn(c, 200); c.hop(16, 320); popSfx(T); puff(WC[i - 1][0], WC[i - 1][1] - 30);
      T.pop(WC[i - 1][0], WC[i - 1][1] - 90, tr(NUM[i - 1]));
    } });
    wh.remove();
    await say('"구름은 어디서 올까?" 다현이가 물어요.');
    await say('"어디서 올까?" 은우도 따라 해요.');

    /* --- 2. 현관 앞 --- */
    await T.sceneCard(tr('현관'), () => {
      scene('frontdoor');
      put(T, nuna, X(380, 370), 522, { look: 'wave', to: 'left' });
      put(T, oppa, X(470, 450), 522, { look: 'jump', to: 'left' });
      put(T, agi, X(550, 520), 522, { look: 'jump', to: 'left' });
      put(T, dog, X(680, 620), 535, { look: 'sniff', to: 'left' });
    }, dog.pos);
    await say('꿀떡이가 코를 들고 킁킁, 킁킁.');
    await say('"멍! 구름 냄새다!"');
    await say('꿀떡이를 톡! 달려 나가게 해 줘요.');
    await T.tap(dog.pos, { prompt: '꿀떡이를 톡! 달려 나가게 해 줘요.' });
    popSfx(T); T.pop(dog.x, dog.y - 100, tr('멍!')); dog.look('run', 'left'); dog.hop(18, 260);
    const run1 = dog.move(150, 540, 1300, 'ease-in').then(() => hide(dog));
    await say('꿀떡이는 문밖으로 달려 나가요.');
    await run1;
    await say('"꿀떡아, 같이 가!"');

    /* --- 3. 언덕과 풀밭 --- */
    await T.sceneCard(tr('풀밭'), () => {
      scene('meadow');
      put(T, nuna, X(320, 350), 545, { look: 'walk', to: 'right' });
      put(T, oppa, X(430, 440), 545, { look: 'reach', to: 'right' });
      put(T, agi, X(540, 525), 545, { look: 'walk', to: 'right' });
      put(T, dog, X(660, 630), 548, { look: 'sniff', to: 'left' });
    }, oppa.pos);
    await say('킁킁, 킁킁. 꿀떡이는 냄새만 따라가요.');
    await say('언덕을 넘고, 풀밭을 지나고.');
    await say('이현이는 길가 꽃을 살짝 만져 봐요.');
    await say('꽃을 톡톡톡 눌러서 향기를 맡아요!');
    const FL = [[252, 325, '#C9433A'], [494, 325, '#F2C14E'], [727, 325, '#EFA6A6']].map(([x, y]) => [x, y]);
    const fh = el('g', {}, T.world); FL.forEach(([x, y]) => el('circle', { cx: x, cy: y + 10, r: 48, fill: 'transparent' }, fh));
    await T.mash(fh, { count: 3, prompt: '꽃을 톡톡톡 눌러서 향기를 맡아요!', onStep: i => {
      const [x, y] = FL[i - 1]; popSfx(T); puff(x, y, ['#F4A6A0', '#FBE08A', '#FFD3D3'][i - 1]); T.pop(x, y - 60, tr('향긋!'));
      oppa.hop(12, 300);
    } });
    fh.remove();
    await say('"꿀떡아, 어디까지 가?" 다현이가 물어요.');

    /* --- 4. 언덕 위 굴뚝 --- */
    await T.sceneCard(tr('언덕'), () => {
      scene('door');
      put(T, nuna, X(410, 395), 530, { look: 'lookup', to: 'right' });
      put(T, oppa, X(495, 470), 530, { look: 'lookup', to: 'right' });
      put(T, agi, X(580, 545), 530, { look: 'jump', to: 'left' });
      put(T, dog, X(300, 330), 540, { look: 'lookup', to: 'right' });
    }, nuna.pos);
    chimneyLoop();
    await say('언덕 위에 굴뚝 하나.');
    await say('굴뚝을 톡톡톡 눌러요!');
    const chim = hitRect(445, 90, 110, 140);
    await T.mash(chim, { count: 3, prompt: '굴뚝을 톡톡톡 눌러요!', onStep: i => {
      popSfx(T); puff(497, 100, '#ECE9E4'); puffToCloud(497, 106, { k: 1.25 + i * .12, rise: 55 + i * 8, dx: 300 + i * 30 });
      T.pop(497, 190, tr('퐁!'));
    } });
    chim.remove();
    await say('굴뚝에서 하얀 구름이 퐁! 퐁!');
    await say('"굴뚝에서 구름이 나와?" 다현이가 물어요.');
    await say('"퐁! 퐁!" 은우가 따라 해요.');

    /* --- 5. 동그란 문 --- */
    await T.sceneCard(tr('동그란 문'), () => {
      scene('door'); chimneyLoop();
      put(T, nuna, X(330, 350), 530, { look: 'lookup', to: 'right' });
      put(T, oppa, X(425, 425), 530, { look: 'reach', to: 'right' });
      put(T, dog, X(590, 540), 540, { look: 'run', to: 'left' });
      put(T, agi, X(660, 610), 530, { look: 'walk', to: 'left' });
    }, oppa.pos);
    await say('굴뚝 아래, 동그란 문.');
    await say('동그란 문을 톡! 같이 밀어 봐요.');
    const door = hit(495, 365, 105);
    await T.tap(door, { prompt: '동그란 문을 톡! 같이 밀어 봐요.' });
    popSfx(T); door.remove(); AudioFX.sfx('creak'); T.shake();
    el('ellipse', { cx: 470, cy: 365, rx: 16, ry: 92, fill: '#FFE9A8', opacity: .85 }, T.bg);
    await say('이현이가 문을 살짝 밀어요. 끼이익.');
    await say('"들어가도 될까?" 다현이가 물어요.');
    const run2 = dog.move(470, 470, 900).then(() => { dog.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' }); });
    await say('꿀떡이가 먼저 쏙 들어가요.');
    await run2;

    /* --- 6. 구름 공장 안 --- */
    await T.sceneCard(tr('구름 공장'), () => {
      scene('inside');
      put(T, nuna, X(290, 310), 535, { look: 'lookup', to: 'right' });
      put(T, oppa, X(375, 385), 535, { look: 'reach', to: 'right' });
      put(T, agi, X(655, 640), 535, { look: 'reach', to: 'left' });
      put(T, dog, X(730, 690), 540, { look: 'wag', to: 'left' });
    }, oppa.pos);
    await say('여기는 구름 공장!');
    await say('보글보글, 구름 솥이 끓어요.');
    await say('구름 솥을 톡톡톡 눌러요!');
    const potHit = hitRect(320, 300, 270, 150);
    const CP = [[430, 300], [570, 300], [500, 235]];
    await T.mash(potHit, { count: 3, prompt: '구름 솥을 톡톡톡 눌러요!', onStep: i => {
      const c = put(T, clouds[i - 1], CP[i - 1][0], CP[i - 1][1]); c.look && c.look('c');
      c.pos.animate([{ opacity: 0, translate: '0 90px' }, { opacity: 1, translate: '0 0' }], 450);
      puffToCloud(451, 322, { k: .95, rise: 200, to: 'pipe', dest: X([666, 140], [640, 140]) });
      c.hop(14, 360); popSfx(T); puff(CP[i - 1][0], CP[i - 1][1] - 30); T.pop(CP[i - 1][0], CP[i - 1][1] - 90, tr(NUM[i - 1]));
    } });
    potHit.remove();
    await say('퐁! 하얀 구름. 퐁! 뭉게구름.');
    await say('"퐁! 퐁!" 삼남매는 같이 외쳐요.');
    await say('이현이가 구름 하나를 톡 건드려요.');
    await say('구름을 톡! 무엇이 될까요?');
    await T.tap(cloudA.pos, { prompt: '구름을 톡! 무엇이 될까요?' });
    morph(cloudA, 'rabbit'); cloudA.hop(18, 360); popSfx(T); puff(cloudA.x, cloudA.y - 40); T.pop(cloudA.x, cloudA.y - 120, tr('퐁!')); oppa.hop(12, 300);
    await say('퐁! 구름이 토끼가 됐어요.');
    await say('은우도 따라서 톡.');
    await say('다른 구름도 톡!');
    await T.tap(cloudB.pos, { prompt: '다른 구름도 톡!' });
    morph(cloudB, 'fish'); cloudB.hop(18, 360); popSfx(T); puff(cloudB.x, cloudB.y - 40); T.pop(cloudB.x, cloudB.y - 110, tr('퐁!')); agi.hop(14, 300);
    await say('퐁! 이번엔 물고기.');
    await say('"퐁! 퐁! 퐁!" 은우는 신이 나요.');
    await agi.hop(26, 400);

    /* --- 7. 빨간 단추 --- */
    await T.sceneCard(tr('빨간 단추'), () => {
      scene('corner', 790);
      T.world.appendChild(btn.pos); btn.place(885, 345);
      put(T, nuna, X(610, 615), 530, { look: 'lookup', to: 'right' });
      put(T, oppa, X(695, 695), 530, { look: 'reach', to: 'right' });
      put(T, agi, X(785, 775), 530, { look: 'press', to: 'right' });
      put(T, dog, X(525, 565), 540, { look: 'sniff', to: 'right' });
    }, agi.pos);
    await say('구석에 빨간 단추가 있어요.');
    await say('"이건 뭐야? 눌러도 돼?" 다현이가 물어요.');
    await say('이현이는 손을 뻗었다가… 멈춰요.');
    await say('빨간 단추를 톡! 은우가 눌러요.');
    await T.tap(btn.pos, { prompt: '빨간 단추를 톡! 은우가 눌러요.' });
    btn.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(8px)' }, { transform: 'translateY(0)' }], 260); AudioFX.sfx('bonk') || popSfx(T); T.shake(); agi.hop(8, 260);
    for (let k = 0; k < 4; k++) { puff(780 + k * 55, 250 - (k % 2) * 40); await sleep(120); }
    await say('은우가 꾹! 눌러 버렸어요.');

    /* --- 8. 아기 먹구름 --- */
    await T.sceneCard(tr('아기 먹구름'), () => {
      scene('inside');
      put(T, dark, 500, 330, { look: 'teary', to: 'right' });
      put(T, nuna, X(340, 360), 535, { look: 'lookup', to: 'right' });
      put(T, oppa, X(430, 435), 535, { look: 'back', to: 'right' });
      put(T, agi, X(570, 540), 535, { look: 'back', to: 'right' });
      put(T, dog, X(650, 620), 540, { look: 'lookup', to: 'left' });
      hide(dark);
    }, nuna.pos);
    await say('덜컹! 기계가 흔들려요.');
    T.shake();
    put(T, dark, 500, 330, { look: 'teary', to: 'right' }); fadeIn(dark, 500); dark.hop(14, 400); puff(500, 270, '#A9A39B');
    await say('퐁… 작은 먹구름 하나가 나왔어요.');
    await say('까맣고, 조그맣고, 눈이 그렁그렁.');
    await say('"왜 울어?" 다현이가 물어요.');
    await say('먹구름은 지금 어떤 마음일까요?');
    const cSad = feelCard(X(330, 362), 150, 'sad', '슬퍼요'), cHappy = feelCard(X(670, 638), 150, 'happy', '기뻐요');
    await T.choose([{ key: 'sad', el: cSad, ok: true }, { key: 'happy', el: cHappy, ok: false }],
      { prompt: '먹구름은 지금 어떤 마음일까요?', where: '눈물이 그렁그렁해요. 슬픈 것 같아요.', who: '슬퍼요를 톡!' });
    cSad.remove(); cHappy.remove();
    dark.look('cry'); dark.hop(10, 300);
    await say('"나는 하얗지 않아." 아기 먹구름이 훌쩍여요.');
    startRain(X(300, 330), X(700, 670), 300);
    await say('훌쩍, 훌쩍, 후두둑.');
    await say('먹구름 눈물이 비가 되어 떨어져요.');
    await say('다현이와 이현이와 은우와 꿀떡이는 흠뻑 젖었어요.');

    /* --- 9. 비 좋아! --- */
    await T.sceneCard(tr('비 오는 날'), () => {
      scene('rain');
      put(T, dark, 500, 330, { look: 'cry', to: 'right' });
      put(T, nuna, X(340, 360), 535, { look: 'reach', to: 'right' });
      put(T, oppa, X(425, 435), 535, { look: 'reach', to: 'right' });
      put(T, agi, X(610, 575), 535, { look: 'jump', to: 'left' });
      put(T, dog, X(690, 640), 540, { look: 'wag', to: 'left' });
      startRain(X(300, 330), X(700, 670), 330);
    }, dark.pos);
    await say('이현이가 먹구름 뺨을 살살 쓰다듬어요.');
    await say('먹구름을 톡톡톡 쓰다듬어 줘요!');
    await T.mash(dark.pos, { count: 3, prompt: '먹구름을 톡톡톡 쓰다듬어 줘요!', onStep: i => {
      dark.hop(8, 260); oppa.hop(10, 280); agi.hop(18, 300); ring(agi.x, agi.y + 4); ring(agi.x + 40, agi.y + 8);
      popSfx(T); T.pop(dark.x + 20, dark.y - 140, tr(['살살!', '쓰담!', '토닥!'][i - 1]));
    } });
    dark.look('teary');
    await say('"비 좋아! 장화 신고 첨벙첨벙!"');
    agi.hop(30, 420); ring(agi.x, agi.y + 4);
    await say('"첨벙첨벙!" 은우가 따라 뛰어요.');
    await say('"먹구름아, 우리랑 놀래?" 다현이가 물어요.');

    /* --- 10. 번쩍! 우르르 쾅 --- */
    await T.sceneCard(tr('번쩍!'), () => {
      scene('rain');
      put(T, dark, 500, 320, { look: 'cry', to: 'right' });
      put(T, nuna, X(340, 360), 535, { look: 'lookup', to: 'right' });
      put(T, oppa, X(430, 440), 535, { look: 'lookup', to: 'right' });
      put(T, agi, X(540, 520), 535, { look: 'lookup', to: 'right' });
      put(T, dog, X(640, 610), 540, { look: 'wag', to: 'left' });
      startRain(X(300, 330), X(700, 670), 320, 10);
    }, dark.pos);
    const bg = el('g', { transform: 'translate(625,235) scale(.9)' }, T.world), bolt = T.paper(bg, [['path', { d: BOLT, fill: '#FFD43B', stroke: '#E8A317', 'stroke-width': 3 }]]);
    await say('번개를 톡!');
    await T.tap(bg, { prompt: '번개를 톡!' });
    const fl = el('rect', { x: -40, y: -24, width: 1080, height: 620, fill: '#fff', opacity: 0 }, T.fx);
    fl.animate([{ opacity: 0 }, { opacity: .85 }, { opacity: 0 }, { opacity: .5 }, { opacity: 0 }], { duration: 700 }).onfinish = () => fl.remove();
    T.shake(); AudioFX.sfx('boom') || T.tone([110, 55], .6, { type: 'sawtooth', vol: .18 }); T.pop(500, 150, tr('번쩍!'), '#E8A317');
    bg.remove();
    await say('번쩍! 우르르 쾅!');
    dark.hop(16, 400);
    await say('먹구름이 깜짝 놀라 번개를 냈어요.');
    await say('꿀떡이를 톡! 꼭 안아 줘요.');
    await T.tap(dog.pos, { prompt: '꿀떡이를 톡! 꼭 안아 줘요.' });
    popSfx(T); dog.hop(14, 260);
    await T.cutImage([{ src: cutSrc('hug'), sfx: 'pop', hold: 3600 }], { hold: 3600 });
    stopRain();
    put(T, nuna, X(430, 420), 535, { look: 'hug', to: 'right' });
    put(T, oppa, X(500, 485), 535, { look: 'hug', to: 'left' });
    put(T, agi, X(565, 540), 535, { look: 'hug', to: 'left' });
    put(T, dog, X(500, 485), 548, { look: 'wag', to: 'left' });
    await say('삼남매는 꿀떡이를 꼭 껴안아요.');
    await say('"괜찮아, 괜찮아." 다현이가 속삭여요.');
    await say('"괜찮아." 은우도 속삭여요.');

    /* --- 11. 방긋 --- */
    await T.sceneCard(tr('방긋'), () => {
      scene('inside');
      put(T, dark, 500, 330, { look: 'teary', to: 'right' });
      put(T, nuna, X(340, 360), 535, { look: 'wave', to: 'right' });
      put(T, oppa, X(430, 435), 535, { look: 'reach', to: 'right' });
      put(T, agi, X(600, 560), 535, { look: 'wave', to: 'left' });
      put(T, dog, X(680, 630), 540, { look: 'lookup', to: 'left' });
      startRain(X(300, 330), X(700, 670), 330, 8);
    }, dark.pos);
    await say('먹구름이 눈물을 닦아요.');
    await say('먹구름의 눈물을 톡! 닦아 줘요.');
    const tearHit = hit(500, 300, 70);
    await T.tap(tearHit, { prompt: '먹구름의 눈물을 톡! 닦아 줘요.' });
    tearHit.remove(); popSfx(T); stopRain(); dark.look('smile'); dark.hop(14, 360); puff(500, 270, '#fff'); T.pop(500, 190, tr('방긋!'));
    await say('"나도… 괜찮아?"');
    await say('"괜찮아! 비는 재밌어." 삼남매가 말해요.');
    await say('먹구름이 처음으로 방긋 웃어요.');
    await say('비가 그쳐요.');

    /* --- 12. 무지개 --- */
    const RC = ['#E4573D', '#F6C945', '#6FAE5A', '#4A90D9'], RN = ['빨강!', '노랑!', '초록!', '파랑!'];
    const RR = P ? [215, 185, 155, 125] : [300, 262, 224, 186], RW = P ? 28 : 36, RY = 520;
    let arcs;
    await T.sceneCard(tr('무지개'), () => {
      scene('rainbow');
      put(T, nuna, X(390, 395), 535, { look: 'lookup', to: 'right' });
      put(T, oppa, X(470, 465), 535, { look: 'lookup', to: 'right' });
      put(T, agi, X(550, 535), 535, { look: 'jump', to: 'left' });
      put(T, dog, X(620, 590), 540, { look: 'lookup', to: 'left' });
      put(T, dark, X(740, 640), 165, { look: 'smile', to: 'left' }); dark.setScale(.7); dark.place(dark.x, dark.y);
      const rb = el('g', { filter: 'url(#pp)' }, T.world);
      arcs = RR.map((r, i) => el('path', { d: `M${500 - r} ${RY} A${r} ${r} 0 0 1 ${500 + r} ${RY}`, fill: 'none', stroke: RC[i], 'stroke-width': RW, opacity: .25 }, rb));
      T.world.insertBefore(rb, T.world.firstChild);
    }, nuna.pos);
    await say('하늘에 무지개!');
    await say('무지개를 톡톡톡톡 눌러서 색깔을 세어 봐요!');
    const rhit = el('g', {}, T.world);
    RR.forEach(r => el('path', { d: `M${500 - r} ${RY} A${r} ${r} 0 0 1 ${500 + r} ${RY}`, fill: 'none', stroke: 'transparent', 'stroke-width': RW + 14 }, rhit));
    await T.mash(rhit, { count: 4, prompt: '무지개를 톡톡톡톡 눌러서 색깔을 세어 봐요!', onStep: i => {
      const a = arcs[i - 1], r = RR[i - 1]; a.setAttribute('opacity', 1); popSfx(T);
      T.pop(500 + (i % 2 ? -1 : 1) * r * .72, RY - r * .7, tr(RN[i - 1]), RC[i - 1]);
    } });
    rhit.remove();
    await T.cutImage([{ src: cutSrc('rainbow'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    await say('빨강, 노랑, 초록, 파랑.');
    await say('"무지개는 누가 만들어?" 다현이가 물어요.');
    dark.hop(14, 400);
    await say('"내가!" 먹구름이 으쓱해요.');
    agi.hop(30, 420); popSfx(T); T.pop(agi.x, agi.y - 220, tr('퐁!'));
    await say('"퐁!" 은우가 손뼉을 쳐요.');

    /* --- 13. 노을 길 --- */
    await T.sceneCard(tr('노을 길'), () => {
      scene('sunset');
      put(T, dog, X(430, 450), 545, { look: 'run', to: 'left' });
      put(T, nuna, X(520, 505), 535, { look: 'walk', to: 'left' });
      put(T, oppa, X(600, 565), 535, { look: 'walk', to: 'left' });
      put(T, agi, X(675, 625), 535, { look: 'walk', to: 'left' });
      put(T, dark, X(790, 650), 190, { look: 'smile', to: 'left' }); dark.setScale(.6); dark.place(dark.x, dark.y);
    }, nuna.pos);
    await say('해가 기울어요. 집에 갈 시간.');
    await say('"먹구름아, 또 놀자!"');
    await say('먹구름에게 톡! 손을 흔들어요.');
    await T.tap(dark.pos, { prompt: '먹구름에게 톡! 손을 흔들어요.' });
    popSfx(T); dark.wiggle(10, 600); T.pop(dark.x, dark.y - 110, tr('안녕!'), '#E8703A');
    const goHome = Promise.all([dog.move(X(250, 330), 545, 2600, 'linear'), nuna.move(X(340, 380), 535, 3000, 'linear'), oppa.move(X(420, 440), 535, 3000, 'linear'), agi.move(X(495, 500), 535, 3000, 'linear')]);
    await say('꿀떡이가 앞장서요. 킁킁, 집 냄새.');
    await say('은우는 이현이의 손을 꼭 잡아요.');
    await goHome;

    /* --- 14. 밤 --- */
    await T.sceneCard(tr('밤'), () => {
      scene('night');
      put(T, dark, 500, 250, { look: 'smile', to: 'left' }); dark.setScale(.42); dark.place(dark.x, dark.y);
      put(T, nuna, X(390, 395), 540, { look: 'back', to: 'right' });
      put(T, oppa, X(465, 460), 540, { look: 'back', to: 'right' });
      put(T, agi, X(535, 525), 540, { look: 'back', to: 'right' });
      put(T, dog, X(620, 595), 545, { look: 'wag', to: 'left' });
    }, dark.pos);
    await say('밤이에요. 다현이와 이현이와 은우와 꿀떡이는 창밖을 봐요.');
    await say('하늘에 작은 먹구름 하나.');
    await say('우리한테 손을 흔들어요.');
    dark.wiggle(10, 700);
    await say('먹구름에게 톡! 잘 자라고 인사해요.');
    await T.tap(dark.pos, { prompt: '먹구름에게 톡! 잘 자라고 인사해요.' });
    popSfx(T); dark.hop(10, 320); T.pop(dark.x, dark.y - 70, tr('잘 자!'), '#1F2A56');
    await say('"잘 자, 먹구름아."');
    popSfx(T); T.pop(dark.x, dark.y - 70, tr('퐁!'));
    await say('퐁.');
    T.finale();
    return '다음에 또 놀자, 먹구름아!';
  }

  Tale.mount({ title: '퐁! 구름 공장', subtitle: '다현이와 이현이와 은우와 꿀떡이의 구름 공장', run: T => run(Tale.api) });
})();
