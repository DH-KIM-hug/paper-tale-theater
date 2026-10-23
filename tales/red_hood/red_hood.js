/* 빨간 모자 — 목업(소리 없음). 기획: TALES_PLAN_2.md §9
   엄마와 한 약속을 깜빡한 빨간 모자가 늑대의 꾀에 넘어가지만, 이상한 곳을 찾아내 옷장에 숨고 사냥꾼이 도와준다.
   조작: 담기(톡 ×3) · 새끼손가락 · 걷기(쓱) · 색 맞춰 꽃병에(골라요 ×6) · 노크 · 다른 곳 찾기(골라요 ×3) · 옷장 · 창문 · 간지럼 · 나눠 주기 */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { apple: 0.9286, basket: 1.0222, bread: 1.2479, flower_blue: 0.7891, flower_red: 0.7875, flower_yellow: 0.7629, frame: 0.8729,
    granny_home: 0.8575, granny_pop: 0.8640, granny_tea: 0.6613, hood_hide: 0.7705, hood_joy: 0.7599, hood_knock: 0.7253,
    hood_pick: 0.9378, hood_surprise: 0.6674, hood_walk: 0.6526, hood_walk2: 0.6693, hood_wonder: 0.6272, hunter_laugh: 0.6687,
    hunter_tickle: 0.7593, hunter_walk: 0.5861, mama: 0.4933, milk: 0.4470, vase_blue: 0.9068, vase_red: 0.9094, vase_yellow: 0.9067,
    wardrobe: 0.7023, wolf_flee: 1.4077, wolf_granny: 1.0447, wolf_hiccup: 0.8826, wolf_jump: 1.1224, wolf_peek: 0.8881,
    wolf_run: 1.5403, wolf_sleep: 1.0934, wolf_whisper: 1.2990, };
  /* 2026-10-20 새 그림은 그림 크기(세로 픽셀)가 옛 그림과 달라서, 옛 그림과 같은 픽셀 축척이 되도록 높이에 곱하는 비율 */
  const RS = { basket: 0.901, flower_blue: 0.941, flower_red: 0.820, granny_home: 0.804, granny_pop: 0.910, /* 2026-10-20 크기 일관성: 할머니 튀어나옴(pop)이 차 마실 때(tea)보다 15% 작아서 tea 와 같은 0.910 으로 */ granny_tea: 0.910, hood_hide: 0.735,
    hood_joy: 0.946, hood_knock: 0.781, hood_pick: 0.771, hood_surprise: 0.890, hood_walk: 0.887, hood_walk2: 0.887, /* 2026-10-20 크기 일관성: walk2 는 walk 와 같은 몸 높이로 (0.800 → 0.887, 옛 0.800 은 화면에서 10% 작았다) */ hood_wonder: 0.950,
    hunter_tickle: 0.892, hunter_walk: 0.931, mama: 0.933, milk: 0.863, vase_blue: 0.904, vase_red: 0.944, vase_yellow: 0.964,
    wardrobe: 0.734, wolf_granny: 0.652, wolf_hiccup: 0.550, wolf_jump: 0.494, wolf_peek: 0.596, };
  const BGS = ['bed', 'cottage', 'door', 'flowers', 'kitchen', 'room', 'shortcut', 'table', 'trail', 'tree'];
  /* 2026-10-23 화려한 다층 재기획(VISUAL_PLAN.md): 장면 키(읽어 주기 BGKEY 포함)는 그대로, 그림만 v2·라이트박스.
     부엌 식탁·집 문·오두막·침대·액자·옷장·창·식탁은 옛 그림과 겹쳐 같은 자리(±1%). 늑대(4장)·지름길(6장 아래 칸)은 라이트박스 */
  /* 2026-10-23 사용자 결정: 숲길(trail)·꽃밭(flowers)·늑대 숲(tree 라이트박스)은 옛 그림으로 되돌림(짝 소품·빛 점·어둠 막도 뺌) */
  const BGV = { bed: 'bed_v2', cottage: 'cottage_v2', door: 'door_v2', kitchen: 'kitchen_v2', room: 'room_v2', shortcut: 'shortcut_lb', table: 'table_v2' };
  /* 층 소품(rh_layer_*, 누름 없음) 그림 폭/높이 */
  const LAR = { fern_front: 1.0267, branch_leaves: 1.01, flowers_front: 1.0967, bird: .9833, butterfly: 1.2033, herbs: .67, plant_pot: .7967, trees_sil: .8533, grass_sil: 5.6962 };
  const NF = new Set(['apple', 'basket', 'bread', 'flower_blue', 'flower_red', 'flower_yellow', 'milk', 'vase_blue', 'vase_red', 'vase_yellow', 'wardrobe']); // 얼굴 없는 새 그림(파일 이름 끝에 nf)
  const CUTS = ['tail', 'whisper', 'dash', 'gulp', 'granwolf', 'jumpup', 'hiccup'];
  const bgSrc = k => AS + 'rh_bg_' + (BGV[k] || k) + '.webp', cutSrc = k => AS + 'rh_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const C = { bean: '#A93B32', ink: '#2E241C' };
  /* 할머니 사진 소품: 침실 그림 속 빈 액자(무대 x 752~899, y 2~154)를 덮는다 [가운데 x, 아래 y, 크기] (2026-10-23, 옛 805,278 은 액자 아래 벽에 떠 있었다) */
  const FRAME = [825, 162, .88];

  /* 여러 자세를 겹쳐 두고 look()으로 하나만 보인다. 자세: [파일, 키, 그림이 원래 보는 쪽] — 발끝 가운데가 (0,0) */
  const ACTORS = [];   // 누르는 대상이 아닌 배우·소품은 누름을 받지 않는다(마지막 장 빨간 모자가 할머니·사냥꾼 그림에 가려 안 눌리던 것, 2026-10-22). 대상만 live() 로 연다
  const quiet = () => ACTORS.forEach(a => { a.pos.style.pointerEvents = 'none'; });
  const live = a => { a.pos.style.pointerEvents = 'auto'; return a.pos; };
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const hh = h * (RS[f] || 1), w = hh * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'rh_' + f + (NF.has(f) ? 'nf' : '') + '.webp', x: -w / 2, y: -hh, width: w, height: hh, preserveAspectRatio: 'none' }, wrap);
        wrap.style.display = 'none'; looks[k] = { wrap, h, nat };
      });
    });
    a.want = 'left';
    a.pos.style.pointerEvents = 'none'; ACTORS.push(a);
    a.turn = d => { a.want = d; a.face(looks[a.cur].nat === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const prop = (T, f, h) => mk(T, { a: [f, h, 'left'] });
  function put(T, a, x, y = GROUND, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };

  /* ---- 층 소품: 누름 없음. 앞 가림 층은 T.fx(배우 위), 중간 층은 T.bg(배우 뒤). (cx, y) = 가운데·발끝, top 이면 윗변 ---- */
  const LY = {};
  function layer(T, k, cx, y, h, { front = true, flip = false, top = false, name } = {}) {
    const w = h * LAR[k], g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
    if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
    const inner = T.el('g', { filter: 'url(#pp)' }, g);
    T.el('image', { href: AS + 'rh_layer_' + k + '.webp', x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, inner);
    inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = top ? '50% 0%' : '50% 100%';
    if (name) LY[name] = inner;
    return inner;
  }
  const sway = (g, deg, ms, delay = 0) => { g.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }], { duration: ms, delay, iterations: Infinity, easing: 'ease-in-out' }); return g; };
  const lyHop = (name, dy = 6, ms = 250) => { const g = LY[name]; if (g && g.isConnected) g.animate([{ translate: '0 0' }, { translate: `0 ${-dy}px` }, { translate: '0 0' }], { duration: ms, easing: 'ease-out', composite: 'add' }); };
  /* 나비: 날갯짓(scaleX 1↔.3) + 가로 ±dx 사인 곡선 (가운데로 들어오지 않게 dx 작게) */
  function butterfly(T, cx, cy, h, dx = 50, ms = 6000, name) {
    const outer = T.el('g', { style: 'pointer-events:none' }, T.fx);
    const g = layer(T, 'butterfly', 0, 0, h, { top: true }); outer.appendChild(g.parentNode);
    g.style.transformOrigin = '50% 50%';
    g.animate([{ scale: '1 1' }, { scale: '.3 1' }, { scale: '1 1' }], { duration: 260, iterations: Infinity });
    const k = [0, .25, .5, .75, 1].map((t, i) => ({ transform: `translate(${cx + Math.sin(t * Math.PI * 2) * dx}px, ${cy + (i % 2 ? -14 : 0)}px)` }));
    outer.animate(k, { duration: ms, iterations: Infinity, easing: 'ease-in-out' });
    if (name) LY[name] = outer;
    return outer;
  }
  /* 라이트박스 빛 점: 호박색 작은 원이 깜빡 (장면이 바뀌면 T.clear 로 지워진다) */
  function glowDots(T, n, pick) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const [x, y] = pick(i), r = 3 + Math.random();
      const g = T.el('g', { style: 'pointer-events:none' }, T.fx);
      T.el('circle', { cx: x, cy: y, r: r + 3, fill: '#F2B366', opacity: .45 }, g); T.el('circle', { cx: x, cy: y, r, fill: '#FFE3A8' }, g);
      g.animate([{ opacity: .3 }, { opacity: 1 }, { opacity: .3 }], { duration: 2000 + Math.random() * 2000, delay: Math.random() * 1500, iterations: Infinity });
      out.push(g);
    }
    return out;
  }
  /* 장면별 층 소품 (VISUAL_PLAN §3~§7). 세로 화면 가운데(x 285~715)에는 앞 가림 층을 두지 않는다 */
  function dress(T, key, P, { bird = false } = {}) {
    Object.keys(LY).forEach(k => delete LY[k]);
    if (key === 'kitchen') { sway(layer(T, 'herbs', 150, -24, 150, { top: true }), 1.5, 7000); sway(layer(T, 'herbs', 880, -24, 150, { top: true, flip: true }), 1.5, 7000, 1500); }
    if (key === 'door') {
      layer(T, 'bird', 300, 100, 34, { front: false, name: 'bird' });
      layer(T, 'fern_front', 980, 590, 120);
      butterfly(T, 860, 245, 26, 50);
    }
    if (key === 'cottage') {
      layer(T, 'fern_front', 262, 445, 54); layer(T, 'flowers_front', 700, 445, 45);
      if (bird) layer(T, 'bird', 560, 232, 15, { front: false, name: 'bird' });
    }
    if (key === 'bed') layer(T, 'plant_pot', 60, 545, 150);
    if (key === 'room') layer(T, 'plant_pot', 20, 545, 150);
    if (key === 'table') { sway(layer(T, 'herbs', 120, -24, 150, { top: true }), 1.5, 7000); layer(T, 'plant_pot', 960, 545, 150); }
  }
  /* 6장 분할 화면: 위 꽃밭(낮)·아래 지름길(해질녘 라이트박스). 아래 칸 풀 띠·빛 점은 배우 위 */
  function splitDress(T) {
    [140, 500, 860].forEach((x, i) => layer(T, 'grass_sil', x, 605, 70, { flip: i === 1 }));
    glowDots(T, 6, i => [i % 2 ? 20 + Math.random() * 190 : 790 + Math.random() * 190, 300 + Math.random() * 70]);
    return glowDots(T, 2, i => [-60 - i * 80, 330 + i * 30]);
  }
  /* 작은 소품도 손가락이 닿게: 투명한 누르는 자리를 깐다(발끝 가운데가 0,0). 화면 짧은 변 80px 이상 (2026-10-22) */
  function widen(T, a, w = 100, h = 100) {
    const r = T.el('rect', { x: -w / 2, y: -h, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.pos.firstChild); return a;
  }

  function bgImage(T, key, { x = BGBOX.x, y = BGBOX.y, w = BGBOX.w, h = BGBOX.h, parent } = {}) {
    return T.el('image', { href: bgSrc(key), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent || T.bg);
  }
  let clipN = 0;
  function panel(T, key, y0, y1, shift = 0) {
    const id = 'rhclip' + (++clipN), g = T.el('g', {}, T.bg);
    const cp = T.el('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, g);
    T.el('rect', { x: -40, y: y0, width: 1080, height: y1 - y0 }, cp);
    const inner = T.el('g', { 'clip-path': `url(#${id})` }, g);
    bgImage(T, key, { y: y0 + (y1 - y0) / 2 - BGBOX.h / 2 + shift, parent: inner });
  }
  const hot = (T, cx, cy, r) => T.el('circle', { cx, cy, r, fill: '#fff', 'fill-opacity': .01 }, T.world);
  const hotRect = (T, x, y, w, h) => T.el('rect', { x, y, width: w, height: h, rx: 18, fill: '#fff', 'fill-opacity': .01 }, T.world);
  const ring = (T, cx, cy, r) => T.el('ellipse', { cx, cy, rx: r, ry: r * .8, fill: 'none', stroke: '#E8703A', 'stroke-width': 6, 'stroke-dasharray': '14 8' }, T.world);
  const knock = T => AudioFX.sfx('knock') || T.tone([300, 200], .08, { type: 'square', vol: .12 });
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });


  /* 다른 곳 찾기: 처음부터 부드럽게 빛나는 고리, 3초 멈추면 손가락, 틀리면 더 크게 튀어 오르고, 두 번 틀리면 큰 화살표 + 더 넓은 눌림 */
  function findSpot(T, spots, prompt, onWrongTap) {
    return new Promise(res => {
      const g = T.el('g', { 'pointer-events': 'none' }, T.world);
      const fx = spots.map(sp => {
        const r = T.el('ellipse', { cx: sp.at[0], cy: sp.at[1], rx: sp.r + 12, ry: (sp.r + 12) * .85, fill: '#FFE082', 'fill-opacity': .22, stroke: '#FFB300', 'stroke-width': 5, 'stroke-opacity': .85 }, g);
        r.style.transformBox = 'fill-box'; r.style.transformOrigin = 'center';
        const an = r.animate([{ transform: 'scale(.92)', opacity: .55 }, { transform: 'scale(1.08)', opacity: 1 }], { duration: 900, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
        return { sp, r, an };
      });
      const hand = T.el('image', { href: '../../assets/ui/hand3.webp', width: 62, height: 112, opacity: 0 }, g);
      const arrow = T.el('path', { d: 'M0 0 L34 -44 L14 -44 L14 -96 L-14 -96 L-14 -44 L-34 -44 Z', fill: '#FFC107', stroke: '#8A4B12', 'stroke-width': 6, 'stroke-linejoin': 'round', opacity: 0 }, g);
      const hit = T.el('rect', { x: -40, y: -30, width: 1080, height: 720, fill: '#fff', 'fill-opacity': .01 }, T.world);
      hit.classList.add('findhit');
      hit.__spots = () => fx.map(f => f.sp.at);
      let wrong = 0, done = false, idle, talk = false, bob = null, abob = null;
      const target = () => fx[0];
      const aim = () => {
        const t = target(); if (!t) return;
        const [x, y] = t.sp.at;
        hand.setAttribute('x', x - 31); hand.setAttribute('y', y - 6); hand.setAttribute('opacity', 1);
        bob && bob.cancel(); bob = hand.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(16px)' }], { duration: 650, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
        if (wrong >= 2) {
          arrow.setAttribute('transform', `translate(${x},${y - t.sp.r - 16})`); arrow.setAttribute('opacity', 1);
          abob && abob.cancel(); abob = arrow.animate([{ translate: '0 0' }, { translate: '0 -18px' }], { duration: 500, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
        }
      };
      const rearm = () => { clearTimeout(idle); hand.setAttribute('opacity', 0); bob && bob.cancel(); idle = setTimeout(() => { if (!done) aim(); }, 3000); };
      const say2 = t => { if (talk) return; talk = true; T.say(t).finally(() => { talk = false; }); };
      const hitR = () => wrong >= 2 ? 84 : 64;
      rearm();
      const promptT = setTimeout(() => !done && say2(prompt), 12000);
      T.autoDo(1800, () => { // 자동 재생: 첫 번째 다른 곳을 대신 누른다
        if (done) return;
        const [x, y] = fx[0].sp.at, m = hit.ownerSVGElement.createSVGPoint(); m.x = x; m.y = y;
        const q = m.matrixTransform(T.world.getScreenCTM());
        hit.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: q.x, clientY: q.y, pointerId: 1, isPrimary: true }));
      });
      const spotsAt = (x, y) => {
        let best = null, bd = 1e9;
        fx.forEach(f => { const d = Math.hypot(x - f.sp.at[0], y - f.sp.at[1]); if (d < bd) { bd = d; best = f; } });
        return best && bd <= Math.max(hitR(), best.sp.r + 10) ? best : null;
      };
      hit.addEventListener('pointerdown', e => {
        e.stopPropagation(); if (done) return;
        const m = hit.ownerSVGElement.createSVGPoint(); m.x = e.clientX; m.y = e.clientY;
        const w = m.matrixTransform(T.world.getScreenCTM().inverse());
        const f = spotsAt(w.x, w.y);
        if (f) {
          done = true; clearTimeout(idle); clearTimeout(promptT); bob && bob.cancel(); abob && abob.cancel();
          AudioFX.ding(); g.remove(); hit.remove(); res(f.sp.key); return;
        }
        wrong++; AudioFX.miss(); onWrongTap && onWrongTap(); rearm();
        fx.forEach(q => { q.an.cancel(); q.r.setAttribute('stroke-width', 8); q.r.setAttribute('fill-opacity', .4);
          q.an = q.r.animate([{ transform: 'scale(1)', opacity: .7 }, { transform: 'scale(1.3)', opacity: 1 }], { duration: 600, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }); });
        const t = target(); t.r.animate([{ translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], { duration: 700 });
        aim();
        if (wrong === 1) say2('이불 말고, 얼굴을 자세히 봐요.'); else if (wrong === 2) say2('얼굴에서 이상한 곳을 눌러 봐요!');
      });
    });
  }

  async function run(T) {
    const { sleep, say, camSnap } = T;
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const pan = (cx = 500) => camSnap(T.viewWidth() < 990 ? cx : 500, 280, 1);
    const scene = (key, cx) => { T.clear(); bgImage(T, key); dress(T, key, T.viewWidth() < 990); pan(cx); quiet(); };

    let runDots = [];
    /* 지름길 빛 점 둘이 늑대 뒤를 따라 오른쪽으로 흘러간다(늑대와 같은 2400ms) */
    const followDots = ds => ds.forEach((g, i) => g.animate([{ translate: '0 0' }, { translate: `${700 + i * 120}px 0` }], { duration: 2400, easing: 'ease-in', fill: 'forwards', composite: 'add' }));
    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    const hood = mk(T, { joy: ['hood_joy', 230, 'left'], walk: ['hood_walk', 230, 'right'], walk2: ['hood_walk2', 230, 'right'],
      pick: ['hood_pick', 230, 'left'], knock: ['hood_knock', 230, 'left'], wonder: ['hood_wonder', 230, 'left'],
      surprise: ['hood_surprise', 230, 'left'], hide: ['hood_hide', 230, 'left'] });
    const mama = mk(T, { a: ['mama', 270, 'left'] });
    const granny = mk(T, { home: ['granny_home', 230, 'left'], pop: ['granny_pop', 230, 'left'], tea: ['granny_tea', 230, 'left'] });
    const wolf = mk(T, { peek: ['wolf_peek', 430, 'left'], whisper: ['wolf_whisper', 210, 'left'], granny: ['wolf_granny', 405, 'left'],
      run: ['wolf_run', 150, 'right'], sleep: ['wolf_sleep', 190, 'left'], hiccup: ['wolf_hiccup', 430, 'left'], flee: ['wolf_flee', 150, 'right'],
      jump: ['wolf_jump', 430, 'left'] });
    const hunter = mk(T, { walk: ['hunter_walk', 290, 'right'], tickle: ['hunter_tickle', 290, 'left'], laugh: ['hunter_laugh', 290, 'left'] });
    const basket = prop(T, 'basket', 100), bread = prop(T, 'bread', 62), milk = prop(T, 'milk', 105), apple = prop(T, 'apple', 62);
    const frame = prop(T, 'frame', 200);
    widen(T, bread, 96, 96); widen(T, milk, 96, 110); widen(T, apple, 96, 96);

    /* ================= 읽어 주기 (docs/READ_MODE.md): 대본 read_script_el.json 의 동사 → 놀이판 연출을 감싼 얇은 함수 =================
       장면 자리·자세·크기는 놀이판 그 장면 그대로(FIX). 대본 좌표는 놀이판 그림과 맞지 않는 곳이 있어 FIX 가 우선한다. */
    const READ_ACTS = (() => {
      const RP = T.viewWidth() < 990, TY = 336, tr = T.tr;
      const A = { hood, wolf, mama, granny, hunter };
      const BGKEY = { home: 'kitchen', promise: 'door', path: 'trail', wolf: 'tree', flowers: 'flowers', cottage: 'cottage', bed: 'bed', wardrobe: 'room', hunter: 'room', table: 'table' };
      const CX = { wolf: 560, bed: RP ? 470 : 590, wardrobe: RP ? 330 : 380, hunter: 620, table: 540 };
      const CARDS = { cottage: '', bed: '' };
      const LOOKMAP = { hood: { spin: 'joy', promise: 'joy', flowers: 'pick', hug: 'joy', stand: 'joy', walk: 'walk' }, wolf: { stand: 'jump' } };
      /* 놀이판 자리: [x, y, {look, to, s}] */
      const FIX = {
        home: { mama: [RP ? 340 : 290, 510, { to: 'right', s: RP ? .8 : 1 }], hood: [RP ? 645 : 700, 510, { look: 'joy', to: 'left', s: RP ? .8 : 1 }] },
        promise: { mama: [400, 510, { look: 'a', to: 'right' }], hood: [600, 510, { look: 'joy', to: 'left' }] },
        path: { hood: [380, 515, { look: 'walk', to: 'right', s: .95 }] },
        wolf: { wolf: [650, 500, { look: 'peek', to: 'left' }], hood: [400, 510, { look: 'wonder', to: 'right' }] },
        flowers: { hood: [RP ? 340 : 270, 330, { look: 'pick', to: 'right', s: .75 }] },
        split: { hood: [500, 268, { look: 'pick', to: 'right', s: .62 }], wolf: [-200, 535, { look: 'run', to: 'right' }] },
        cottage: { hood: [470, 366, { look: 'knock', to: 'left', s: .34 }] },
        wardrobe: { hood: [RP ? 500 : 560, 510, { look: 'surprise', to: 'left' }] },
        table: { granny: [RP ? 625 : 650, 510, { look: 'tea', to: 'left', s: RP ? .8 : 1 }], hood: [RP ? 385 : 400, 510, { look: 'joy', to: 'right', s: RP ? .8 : 1 }], hunter: [RP ? 695 : 770, 510, { look: 'laugh', to: 'left', s: RP ? .72 : 1 }] },
      };
      const ROOM_WOLF = { jump: [800, 450], sleep: [815, 430], hiccup: [760, 510], flee: [760, 520], _: [815, 440] };
      let key = '', vases = [], packing = null, splitDots = [];
      const rI = () => T.readInstant();
      const nums = s => String(s).split(',').map(Number);
      const isRoom = () => key === 'wardrobe' || key === 'hunter';
      const here = a => a.pos.isConnected && a.pos.style.display !== 'none';
      const build = k => {
        key = k; vases = [];
        if (k === 'split') {
          T.clear();
          panel(T, 'flowers', 0, 272, 40); panel(T, 'shortcut', 288, 560, -20);
          T.el('rect', { x: -40, y: 270, width: 1080, height: 20, fill: '#F6ECD8' }, T.bg);
          T.el('rect', { x: -40, y: 290, width: 1080, height: 5, fill: '#000', 'fill-opacity': .18 }, T.bg);
          splitDots = splitDress(T);
          camSnap(500, 280, 1); quiet(); return;
        }
        if (k === 'cottage') { T.clear(); bgImage(T, 'cottage'); dress(T, 'cottage', RP, { bird: true }); camSnap(480, 310, 2.2); quiet(); return; }
        scene(BGKEY[k], CX[k]);
        if (k === 'home') { // 바구니와 식탁 위 음식 (담기는 basket:fill)
          put(T, basket, 500, 505); put(T, bread, 370, TY); put(T, milk, 440, TY); put(T, apple, 510, TY);
        }
        if (k === 'bed') put(T, frame, FRAME[0], FRAME[1], { s: FRAME[2] }); // 그림 속 빈 액자 안에 진짜 할머니 사진
        if (k === 'flowers') {
          ['yellow', 'red', 'blue'].forEach((c, i) => { const v = prop(T, 'vase_' + c, 104); v.color = c; v.bq = []; put(T, v, 380 + i * 120, 535); vases.push(v); });
        }
        if (k === 'table') { put(T, bread, 480, 296); put(T, milk, 555, 296); put(T, apple, 630, 296); }
      };
      const placeRoomWolf = (look, a) => { const [x, y] = ROOM_WOLF[look] || ROOM_WOLF._; a.place(x, y); };
      const walkLooks = a => { let n = 0; const iv = setInterval(() => { n++; a.look(n % 2 ? 'walk2' : 'walk'); }, 350); return () => clearInterval(iv); };
      const actorVerb = (n, a) => (op, spec) => {
        if (op === 'at') {
          let [x, y = 505] = nums(spec); let o = {};
          const f = FIX[key] && FIX[key][n];
          if (f) { [x, y, o] = f; }
          else if (isRoom() && n === 'wolf') { const [rx, ry] = ROOM_WOLF._; x = rx; y = ry; }
          else if (isRoom() && n === 'hunter' && x >= 900) x = 1150;
          else if (isRoom() && n === 'hood') { x = RP ? 500 : 560; y = 510; }
          if (n === 'hood' && key === 'hunter' && here(a) && !rI()) { return a.move(x, y, 600); }
          put(T, a, x, y, o);
          if (isRoom() && n === 'wolf' && !f) placeRoomWolf(a.cur, a);
          return;
        }
        if (op === 'look') {
          const k = (LOOKMAP[n] && LOOKMAP[n][spec]) || spec;
          if (n === 'hood' && spec === 'spin') { a.look('joy'); return a.hop(40, 500); }
          if (n === 'wolf' && isRoom()) { a.look(k); placeRoomWolf(k, a); return; }
          if (n === 'wolf' && key === 'hunter' && k === 'flee') { a.look('flee', 'right'); return; }
          if (n === 'wolf' && k === 'flee') { a.look('flee', 'right'); return; }
          a.look(k); return;
        }
        if (op === 'to') { a.turn(spec); return; }
        if (op === 'hide') { hide(a); return; }
        if (op === 'hop') { a.hop(30, 420); popSfx(T); return; }
        if (op === 'walk') {
          let [x, y = a.y] = nums(spec);
          if (rI()) { a.place(x, y); return; }
          if (n === 'hood' && isRoom()) { x = 145; y = 495; } // 옷장은 놀이판 그림에서 왼쪽 벽에 있다
          if (n === 'hunter' && isRoom()) x = 600;
          if (n === 'wolf') { AudioFX.sfx('whoosh', .6); if (key === 'split') followDots(splitDots); return a.move(x, y === 480 || y === 470 ? 535 - (key === 'split' ? 0 : 15) : y, key === 'split' ? 2400 : 1300, 'ease-in'); }
          const dx = x - a.x;
          if (n === 'hood' && key !== 'wardrobe') {
            a.look('walk', dx >= 0 ? 'right' : 'left');
            const stop = walkLooks(a);
            return a.move(x, y, Math.max(600, Math.abs(dx) * 6)).finally(stop);
          }
          if (n === 'hunter') { a.look('walk', 'left'); return a.move(x, y, 1200).then(() => a.look('tickle')); }
          return a.move(x, y, 900);
        }
      };
      const CUTH = { tail: [2600], whisper: [3200], dash: [2400, 'whoosh'], gulp: [2600], granwolf: [3000], jumpup: [2600, 'pow'], hiccup: [3200, 'pop'] };
      const acts = {
        set(k) {
          if (rI()) { build(k); return; }
          return T.sceneCard(CARDS[k] != null ? CARDS[k] : '', () => build(k));
        },
        cam(a, y, z) {
          if (a === 'snap') { camSnap(+y, +arguments[3] || 280, +arguments[3] ? 1 : 1); return; }
          return;
        },
        basket(op) {
          if (op !== 'fill' || rI()) return;
          return (async () => {
            for (const it of [bread, milk, apple]) {
              popSfx(T); await it.move(500, 480, 450, 'ease-in'); hide(it); basket.hop(14, 260);
            }
          })();
        },
        hood_on() { },
        pinky() { popSfx(T); hood.hop(36, 450); lyHop('bird', 10, 300); if (mama.pos.isConnected && here(mama)) mama.hop(20, 450); if (key === 'table') granny.hop(20, 450); },
        flowers(op) {
          if (op !== 'pick') return;
          hood.hop(16, 420); popSfx(T);
          const seq = ['red', 'yellow', 'blue', 'blue', 'red', 'yellow'];
          (async () => { // 말과 동시에 여섯 송이를 같은 색 꽃병에 (놀이판 짝 맞추기를 저절로)
            for (const col of seq) {
              if (key !== 'flowers') return;
              const answer = vases.find(v => v.color === col); if (!answer) return;
              const fl = prop(T, 'flower_' + col, 130); put(T, fl, 500, 340); fl.pos.animate([{ opacity: 0 }, { opacity: 1 }], 150);
              await fl.move(answer.x, 440, 380, 'ease-in'); hide(fl);
              const n = answer.bq.length;
              const f2 = prop(T, 'flower_' + col, 70 + n * 16); put(T, f2, answer.x + (n % 2 ? 22 : -22) * (1 + n * .4), 440 - n * 6);
              answer.bq.push(f2); T.world.appendChild(answer.pos); answer.hop(14, 260); popSfx(T);
              await sleep(120);
            }
          })();
        },
        vases() { },
        door(op) { if (op === 'knock') return (async () => { for (let k = 0; k < 3; k++) { hood.hop(8, 200); lyHop('bird', 6, 250); await sleep(260); } })(); },
        window(op) { if (op === 'knock') knock(T); },
        wardrobe(op) {
          if (op === 'in') { // 옷장 속으로 쏙
            hood.look('hide'); AudioFX.sfx('door') || AudioFX.sfx('creak');
            hood.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' });
            return sleep(400);
          }
          if (op === 'out') { // 옷장에서 살그머니
            put(T, hood, 145, 495, { look: 'hide', to: 'left' });
            AudioFX.sfx('door') || AudioFX.sfx('creak');
            hood.pos.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 350 });
            return sleep(450).then(() => hood.look('joy'));
          }
        },
        wolf_tickle() { },
        snacks(op) {
          if (op !== 'share') return;
          const plan = [[bread, granny], [milk, hood], [apple, hunter]];
          return (async () => {
            for (const [it, who] of plan) { popSfx(T); await it.move(who.x, who.y - 105 * (who.sc || 1), 520); who.hop(20, 300); }
          })();
        },
        cut(k) {
          const [hold, sfx] = CUTH[k] || [3000];
          return T.cutImage([{ src: cutSrc(k), sfx, hold }], { hold });
        },
        fx(n) {
          if (n === 'knock') knock(T);
          else if (n === 'whoosh') AudioFX.sfx('whoosh', .6);
          else if (n === 'pow') AudioFX.sfx('pow');
          else if (n === 'ding') AudioFX.ding && AudioFX.ding();
          else popSfx(T);
        },
        pop(spec) { const a = String(spec).split(','); T.pop(+a[0], +a[1], tr(a.slice(2).join(',')), a.slice(2).join(',') === '쿨쿨…' ? '#5C6BC0' : undefined); },
      };
      Object.keys(A).forEach(n => { acts[n] = actorVerb(n, A[n]); });
      /* 이름이 겹치는 동사: wolf:tickle / granny:pop 은 배우 동사에 얹는다 */
      const wv = acts.wolf; acts.wolf = (op, spec) => {
        if (op === 'tickle') {
          return (async () => { for (let i = 1; i <= 5; i++) { wolf.wiggle(6 + i * 2, 260); hunter.hop(12, 260); popSfx(T); await sleep(330); } })();
        }
        return wv(op, spec);
      };
      const gv = acts.granny; acts.granny = (op, spec) => {
        if (op === 'pop') { // 딸꾹! → 할머니가 퐁
          hunter.look('laugh'); wolf.look('hiccup'); wolf.place(...ROOM_WOLF.hiccup);
          put(T, granny, 900, 510, { look: 'pop', to: 'left' }); T.pop(760, 160, '딸꾹!');
          return granny.move(660, 510, 500).then(() => granny.hop(40, 450));
        }
        return gv(op, spec);
      };
      const hv = acts.hood; acts.hood = (op, spec) => (op === 'on' ? popSfx(T) : hv(op, spec));
      /* cam:snap:x,y,z 는 콜론으로 잘려 cam('snap','480,310,2.2') 로 온다. cam:wide / cam:620 */
      acts.cam = (a, spec) => {
        if (a === 'snap') { const [x, y, z] = nums(spec); camSnap(x, y, z); return; }
        if (a === 'wide') { if (key === 'cottage') return; camSnap(RP ? (CX[key] || 500) : 500, 280, 1); return; }
        const x = +a; if (!isNaN(x)) camSnap(RP ? x : 500, 280, 1);
      };
      acts.vases = () => { };
      acts.pinky = acts.pinky;
      return acts;
    })();
    if (T.reading()) return T.readPlay(READ_ACTS);

    /* --- 1. 바구니 싸기 --- */
    scene('kitchen');
    const P = T.viewWidth() < 990; /* 세로 화면은 약 430 폭만 보인다 */
    put(T, mama, P ? 340 : 290, 510, { to: "right", s: P ? .8 : 1 });
    put(T, hood, P ? 645 : 700, 510, { look: "joy", to: "left", s: P ? .8 : 1 });
    put(T, basket, 500, 505);
    const TABLE_Y = 336; // 그림 속 식탁 윗면(무대 x 300~570, y≈327)
    put(T, bread, 370, TABLE_Y); put(T, milk, 440, TABLE_Y); put(T, apple, 510, TABLE_Y);
    await T.curtain(true);
    await say('엄마가 빨간 모자에게 말했어요. "할머니가 아프시단다. 맛있는 걸 가져다 드리렴."');
    let askG1 = '빵, 우유, 사과를 바구니에 담아요!'; // 안내는 첫 번째 누름에만 (T.ask)
    const askOnce1 = f => { const g = askG1; askG1 = null; return g ? T.ask(g, f) : f(); };
    const pack = [[bread, '하나!'], [milk, '둘!'], [apple, '셋!']];
    for (const [it, word] of pack) {
      await askOnce1(() => T.tap(live(it), { prompt: '톡! 바구니에 담아요.' }));
      it.pos.style.pointerEvents = 'none';
      popSfx(T); T.pop(it.x, it.y - 130, word);
      await it.move(500, 480, 450, 'ease-in');
      hide(it); basket.hop(14, 260);
    }
    await say('셋! 바구니가 가득 찼어요.');
    await say('엄마가 빨간 모자를 머리에 씌워 주었어요. 빨간 모자가 한 번 빙글 돌았어요.');
    await hood.hop(40, 500);

    /* --- 2. 약속 --- */
    await T.sceneCard('약속', () => {
      scene('door');
      put(T, mama, 400, 510, { look: 'a', to: 'right' });
      put(T, hood, 600, 510, { look: 'joy', to: 'left' });
    }, hood.pos);
    await say('"길에서 벗어나면 안 돼. 모르는 사람과 이야기하지도 마."');
    await say('"네, 엄마! 약속해요."');
    await T.tap(live(hood), { prompt: '빨간 모자를 톡! 새끼손가락을 걸어요.' });
    popSfx(T); T.pop(500, 200, '약속!');
    lyHop('bird', 10, 300); setTimeout(() => lyHop('bird', 10, 300), 320);
    await Promise.all([hood.hop(36, 450), mama.hop(20, 450)]);
    await say('엄마와 빨간 모자는 새끼손가락을 걸었어요.');

    /* --- 3. 숲길 --- */
    await T.sceneCard('숲길', () => {
      scene('trail');
      put(T, hood, 380, 515, { look: 'walk', to: 'right', s: .95 });
    }, hood.pos);
    await say('빨간 모자는 콧노래를 부르며 숲길을 걸어요.'); // 숲길은 저절로 (2026-10-19)
    let step = 0;
    const trailStep = _ => {
      step++; hood.look(step % 2 ? 'walk2' : 'walk');
      hood.move(hood.x + 55, 515 + step * 2, 420); hood.hop(14, 380);
      AudioFX.sfx('step_grass', .4);
    };
    // 저절로 (2026-10-19 톡 조작 정리)
    for (let i = 1; i <= 3; i++) { await trailStep(i); await sleep(600); }
    await sleep(500);
    await T.cutImage([{ src: cutSrc('tail'), hold: 2600 }], { hold: 2600 });
    await say('어, 나무 뒤에서 뭔가 보슬보슬한 게 살짝 보였어요. 꼬리였나 봐요!');

    /* --- 4. 늑대의 꾀 --- */
    await T.sceneCard('늑대', () => {
      scene('tree', 560);
      put(T, wolf, 650, 500, { look: 'peek', to: 'left' });
      put(T, hood, 400, 510, { look: 'wonder', to: 'right' });
    }, wolf.pos);
    await say('나무 옆에서 늑대가 슬그머니 나왔어요. "빨간 모자 아가씨, 어디 가니?"');
    await say('"할머니 댁에 가요." 빨간 모자가 대답했어요.');
    await T.cutImage([{ src: cutSrc('whisper'), hold: 3200 }], { hold: 3200 });
    await say('"꽃을 따 가면 할머니가 참 좋아하실 텐데~"');
    hood.look('joy'); await hood.hop(34, 420);
    await say('"좋은 생각이에요!" 빨간 모자는 엄마와 한 약속을 깜빡하고 말았어요.');

    /* --- 5. 꽃밭: 같은 색 꽃병에 --- */
    await T.sceneCard('꽃밭', () => {
      scene('flowers');
      hood.pos.style.display = 'none'; wolf.pos.style.display = 'none';
    }, hood.pos);
    const bouquet = T.el('g', {}, T.world);
    const colors = ['yellow', 'red', 'blue'];
    const NAME = { red: '빨간', yellow: '노란', blue: '파란' };
    const vases = colors.map((c, i) => {
      const v = prop(T, 'vase_' + c, 104); v.color = c; v.bq = [];
      widen(T, v, 100, 110); put(T, v, 380 + i * 120, 535); return v;
    });
    put(T, hood, P ? 340 : 270, 330, { look: 'pick', to: 'right', s: .75 }); // 2026-10-20 세로 화면에서 왼쪽 밖으로 잘리던 것
    let askG2 = '꽃밭에 알록달록 꽃이 가득해요. 꽃을 같은 색 꽃병에 쏙쏙 담아요!'; // 안내는 첫 번째 누름에만 (T.ask)
    const askOnce2 = f => { const g = askG2; askG2 = null; return g ? T.ask(g, f) : f(); };
    const seq = ['red', 'yellow', 'blue', 'blue', 'red', 'yellow'];
    for (const [i, col] of seq.entries()) {
      const fl = prop(T, 'flower_' + col, 130);
      put(T, fl, 500, 340);
      fl.pos.animate([{ opacity: 0 }, { opacity: 1 }], 300);
      await fl.hop(30, 400);
      const answer = vases.find(v => v.color === col);
      await askOnce2(() => T.choose(vases.map(v => ({ el: live(v), ok: v === answer,
        onWrong: async () => { v.wiggle(8, 380); AudioFX.miss && AudioFX.miss(); } })), {
        prompt: `${NAME[col]} 꽃이에요! 같은 색 꽃병을 톡!`, where: '꽃이랑 색깔이 같은 꽃병이 어디 있을까?', who: `${NAME[col]} 꽃병이에요! 반짝이는 꽃병을 눌러 봐요!` }));
      popSfx(T);
      await fl.move(answer.x, 440, 420, 'ease-in');
      hide(fl);
      const n = answer.bq.length;
      const f2 = prop(T, 'flower_' + col, 70 + n * 16); put(T, f2, answer.x + (n % 2 ? 22 : -22) * (1 + n * .4), 440 - n * 6);
      bouquet.appendChild(f2.pos); answer.bq.push(f2); T.world.appendChild(answer.pos);
      answer.hop(14, 260);
      T.pop(answer.x + (n % 2 ? 50 : -50), 360 - (n > 1 ? 40 : 0), ['하나!', '둘!', '셋!', '넷!', '다섯!', '여섯!'][i]);
      await sleep(300);
    }
    await say('꽃병마다 꽃다발이 활짝! 빨간 모자는 꽃을 따느라 시간 가는 줄 몰랐어요.');

    /* --- 6. 늑대가 먼저 (분할 화면) --- */
    await T.sceneCard('늑대가 먼저', () => {
      T.clear();
      panel(T, 'flowers', 0, 272, 40); panel(T, 'shortcut', 288, 560, -20);
      T.el('rect', { x: -40, y: 270, width: 1080, height: 20, fill: '#F6ECD8' }, T.bg);
      T.el('rect', { x: -40, y: 290, width: 1080, height: 5, fill: '#000', 'fill-opacity': .18 }, T.bg);
      pan();
      put(T, hood, 500, 268, { look: 'pick', to: 'right', s: .62 });
      put(T, wolf, -200, 535, { look: 'run', to: 'right' });
      runDots = splitDress(T);
    }, wolf.pos);
    await say('위에서는 빨간 모자가 꽃을 따요. 아래에서는 늑대가 지름길로 달려가요!');
    hood.hop(16, 420);
    AudioFX.sfx('whoosh', .6); followDots(runDots);
    await wolf.move(1200, 535, 2400, 'ease-in');
    await T.cutImage([{ src: cutSrc('dash'), sfx: 'whoosh', hold: 2400 }], { hold: 2400 });
    await T.cutImage([{ src: cutSrc('gulp'), hold: 2600 }], { hold: 2600 });
    await T.sceneCard('', () => { T.clear(); bgImage(T, 'cottage'); dress(T, 'cottage', P); camSnap(480, 310, 2.2); hide(hood); hide(wolf); }, wolf.pos); // 꿀꺽: 새는 놀라 날아간 뒤라 없다
    AudioFX.sfx('gulp') || T.tone([300, 120], .4, { vol: .2 });
    await say('똑똑똑… 문이 닫히고… 꿀꺽!');
    await T.sceneCard('', () => { scene('bed', 590); put(T, wolf, 430, 470, { look: 'granny', to: 'left' }); }, wolf.pos);
    await say('늑대는 할머니의 잠옷을 입고 침대에 누웠어요.');

    /* --- 7. 할머니 집 --- */
    await T.sceneCard('', () => {
      T.clear(); bgImage(T, 'cottage'); dress(T, 'cottage', P, { bird: true }); camSnap(480, 310, 2.2);
      put(T, hood, 470, 366, { look: 'knock', to: 'left', s: .34 });
    }, wolf.pos);
    await T.ask('빨간 모자는 숲속 할머니 집에 도착했어요. 문을 톡 두드려요!', () => T.tap(live(hood), { prompt: '빨간 모자를 톡! 똑똑똑 노크해요.' }));
    for (let k = 0; k < 3; k++) { knock(T); T.pop(560, 250, '똑!'); lyHop('bird', 6, 250); await hood.hop(8, 200); }
    await say('"들어오렴~" 안에서 쉰 목소리가 들렸어요.');

    /* --- 8. 이상한 할머니 --- */
    await T.cutImage([{ src: cutSrc('granwolf'), hold: 3000 }], { hold: 3000 });
    await T.sceneCard('이상해요', () => {
      scene('bed', P ? 470 : 590);
      put(T, wolf, 335, 472, { look: 'granny', to: 'left' });
      put(T, frame, FRAME[0], FRAME[1], { s: FRAME[2] }); // 그림 속 빈 액자 안에 진짜 할머니 사진
      put(T, hood, 640, 510, { look: 'wonder', to: 'left' });
    }, wolf.pos);
    await say('"할머니, 오셨어요?" 그런데 침대 속 할머니가 어딘가 이상해요.');
    const WX = 335, WHt = 405 * RS.wolf_granny, WW = WHt * ASP.wolf_granny, WG = 472; // 2026-10-20 새 늑대 그림(오른쪽을 봄)에 맞춰 귀·눈·입 자리를 다시 잡음
    const px = f => WX - WW / 2 + f * WW, py = f => WG - WHt + f * WHt;
    const parts = {
      ear: { at: [px(.35), py(.14)], r: 32, q: '"할머니, 귀가 왜 이렇게 커요?"', a: '"네 말을 잘 들으려고 그렇지~"', w: '뾰족 귀!' },
      eye: { at: [px(.61), py(.26)], r: 28, q: '"할머니, 눈이 왜 이렇게 노랗고 커요?"', a: '"너를 잘 보려고 그렇지~"', w: '노란 눈!' },
      mouth: { at: [px(.74), py(.37)], r: 34, q: '"할머니, 입이 왜 이렇게 길어요?"', a: '"그건 말이지… 어흥! 놀랐지?"', w: '긴 입!' },
    };
    const left = Object.keys(parts);
    const PROMPT = '사진 속 할머니와 달라 보이는 곳을 톡!';
    let askG4 = '벽에 걸린 진짜 할머니 사진과 비교해서 다른 곳을 찾아봐요!'; // 안내는 첫 번째 찾기에만 (T.ask)
    const askOnce4 = f => { const g = askG4; askG4 = null; return g ? T.ask(g, f) : f(); };
    while (left.length) {
      const p = parts[await askOnce4(() => findSpot(T, left.map(k => ({ key: k, ...parts[k] })), PROMPT, () => wolf.wiggle(4, 400)))];
      const got = { key: left.find(k => parts[k] === p) };
      left.splice(left.indexOf(got.key), 1);
      ring(T, p.at[0], p.at[1], p.r + 8);
      await T.camTo(p.at[0], p.at[1], 2, 600);
      popSfx(T); T.pop(p.at[0], p.at[1] - 70, p.w);
      await say(p.q); await say(p.a);
      await T.camTo(P ? 470 : 590, 280, 1, 500);
      if (!left.length) break;
      await say('빨간 모자는 고개를 갸웃했어요. 또 이상한 곳이 있나 봐요.');
    }
    hood.look('surprise'); hood.hop(30, 350);
    await say('빨간 모자는 깜짝 놀랐어요. 이 사람은 할머니가 아니에요!');

    /* --- 9. 옷장으로! --- */
    await T.cutImage([{ src: cutSrc('jumpup'), sfx: 'pow', hold: 2600 }], { hold: 2600 });
    await T.sceneCard('옷장으로!', () => {
      scene('room', P ? 330 : 380);   // 세로: 옷장(40~255)이 화면 안에 온전히 들어오게 (2026-10-22)
      put(T, hood, P ? 500 : 560, 510, { look: 'surprise', to: 'left' });
      put(T, wolf, 800, 450, { look: 'jump', to: 'left' });
    }, hood.pos);
    const wardrobeHot = hotRect(T, 40, 125, 215, 345);
    await T.ask('늑대가 벌떡 일어났어요! 빨간 모자야, 어서 숨어요! 옷장을 톡!', () => T.tap(wardrobeHot, { prompt: '옷장을 톡! 쏙 숨어요.' }));
    wardrobeHot.remove();
    await hood.move(145, 495, 650); hood.look('hide'); await sleep(250);
    AudioFX.sfx('door') || AudioFX.sfx('creak');
    hood.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' });
    await sleep(450);
    await say('빨간 모자는 옷장 속으로 쏙! 늑대는 두리번두리번 찾았지만 보이지 않았어요.');
    wolf.look('peek', 'left'); wolf.wiggle(8, 500); await sleep(900);
    put(T, wolf, 815, 430, { look: 'sleep', to: 'left' }); // 침대 위
    await T.camTo(640, 280, 1, 700);
    await say('할머니를 먹어서 배가 불렀던 늑대는 스르르 눈이 감겼어요. 쿨쿨…');
    T.pop(760, 300, '쿨쿨…', '#5C6BC0');

    /* --- 10. 사냥꾼 --- */
    await T.sceneCard('사냥꾼', () => { pan(620); }, wolf.pos);
    const windowHot = hotRect(T, 420, 140, 160, 170);
    await T.ask('창밖으로 지나가던 사냥꾼이 코 고는 소리를 들었어요. 창문을 톡톡 두드려 봐요!', () => T.tap(windowHot, { prompt: '창문을 톡!' }));
    windowHot.remove();
    knock(T); T.pop(500, 120, '똑똑!');
    put(T, hunter, 1150, 510, { look: 'walk', to: 'left' });
    await say('"이상한 코골이네? 할머니 댁에 무슨 일이 있나?" 사냥꾼이 방 안으로 들어왔어요.');
    await hunter.move(600, 510, 1200);
    hunter.look('tickle');
    await say('"늑대잖아! 이럴 땐 간질간질 간지럼이 최고지!"');
    await T.mash(live(wolf), { count: 5, prompt: '늑대를 톡톡톡! 간지럼을 태워요.', onStep: i => {
      wolf.wiggle(6 + i * 2, 260); hunter.hop(12, 260); popSfx(T);
      T.pop(780, 300 - i * 6, ['킥', '킥킥', '키득', '하하', '꺄르르!'][i - 1] || '킥');
    } });
    await T.cutImage([{ src: cutSrc('hiccup'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    hunter.look('laugh');
    wolf.look('hiccup'); wolf.place(760, 510);
    put(T, granny, 900, 510, { look: 'pop', to: 'left' });
    AudioFX.sfx('pop'); T.pop(760, 160, '딸꾹!');
    await granny.move(660, 510, 500); granny.hop(40, 450);
    await say('늑대가 딸꾹! 하자 할머니가 퐁! 하고 튀어나왔어요. 할머니는 다치지 않고 멀쩡했어요!');
    await say('늑대는 깜짝 놀라서 "걸음아 날 살려라~" 하고 창밖으로 달아났어요.');
    wolf.look('flee', 'right'); wolf.place(760, 520);
    AudioFX.sfx('whoosh', .6);
    await wolf.move(1250, 520, 1300, 'ease-in');
    hide(wolf);
    await say('빨간 모자도 옷장에서 살그머니 나왔어요. "할머니!"');

    /* --- 11. 차 마시기 --- */
    await T.sceneCard('차 마시기', () => {
      scene('table', 540);
      put(T, granny, P ? 625 : 650, 510, { look: 'tea', to: 'left', s: P ? .8 : 1 });
      put(T, hood, P ? 385 : 400, 510, { look: 'joy', to: 'right', s: P ? .8 : 1 });
      put(T, bread, 480, 296); put(T, milk, 555, 296); put(T, apple, 630, 296); // 그림 속 식탁 윗면
      [bread, milk, apple].forEach(a => T.world.appendChild(a.pos));
    }, granny.pos);
    let askG3 = '할머니 집 식탁에서 모두 함께 차를 마셔요. 바구니 속 간식을 한 가지씩 나눠 줘요!'; // 안내는 첫 번째 누름에만 (T.ask)
    const askOnce3 = f => { const g = askG3; askG3 = null; return g ? T.ask(g, f) : f(); };
    const share = [[bread, granny, '할머니!', '빵은 할머니께 톡!'], [milk, hood, '빨간 모자!', '우유는 빨간 모자 톡!'], [apple, hunter, '아저씨!', '사과는 사냥꾼 아저씨 톡!']];
    put(T, hunter, P ? 695 : 770, 510, { look: 'laugh', to: 'left', s: P ? .72 : 1 });
    for (const [it, who, word, pr] of share) {
      await askOnce3(() => T.tap(live(it), { prompt: pr }));
      it.pos.style.pointerEvents = 'none'; // 옮겨 놓은 간식이 뒤에 눌러야 할 빨간 모자를 덮지 않게
      popSfx(T); T.pop(who.x, 250, word);
      await it.move(who.x - (who === hood ? 0 : 0), who.y - 105, 520);
      who.hop(20, 300);
    }
    await say('"모두 고마워요!" 할머니는 활짝 웃었어요.');
    await say('"이제 약속을 꼭 지킬게요. 길에서 벗어나지 않고, 모르는 사람과는 이야기하지 않을래요."');
    await T.tap(live(hood), { prompt: '빨간 모자를 톡! 다시 약속해요.' });
    popSfx(T); T.pop(hood.x, 200, '약속!');
    await Promise.all([hood.hop(40, 500), granny.hop(20, 500)]);
    T.confetti();
    await say('빨간 모자는 새끼손가락을 걸고, 오늘 일을 오래오래 기억했어요.');
    T.finale();
    return '빨간 모자가 약속을 꼭 지켜요!';
  }

  Tale.mount({ title: '빨간 모자', subtitle: '약속을 꼭 지켜요', read: true, run: T => run(Tale.api) });
})();
