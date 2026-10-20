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
  const NF = new Set(['apple', 'basket', 'bread', 'flower_blue', 'flower_red', 'flower_yellow', 'milk', 'vase_blue', 'vase_red', 'vase_yellow', 'wardrobe']); // 얼굴 없는 새 그림(파일 이름 끝에 nf)
  const CUTS = ['tail', 'whisper', 'dash', 'gulp', 'granwolf', 'jumpup', 'hiccup'];
  const bgSrc = k => AS + 'rh_bg_' + k + '.webp', cutSrc = k => AS + 'rh_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const C = { bean: '#A93B32', ink: '#2E241C' };

  /* 여러 자세를 겹쳐 두고 look()으로 하나만 보인다. 자세: [파일, 키, 그림이 원래 보는 쪽] — 발끝 가운데가 (0,0) */
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
    const pan = (cx = 500) => camSnap(T.viewWidth() < 990 ? cx : 500, 280, 1);
    const scene = (key, cx) => { T.clear(); bgImage(T, key); pan(cx); };

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
    await say('빵, 우유, 사과를 바구니에 담아요!');
    const pack = [[bread, '하나!'], [milk, '둘!'], [apple, '셋!']];
    for (const [it, word] of pack) {
      await T.tap(it.pos, { prompt: '톡! 바구니에 담아요.' });
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
    await T.tap(hood.pos, { prompt: '빨간 모자를 톡! 새끼손가락을 걸어요.' });
    popSfx(T); T.pop(500, 200, '약속!');
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
      put(T, v, 380 + i * 120, 535); return v;
    });
    put(T, hood, P ? 340 : 270, 330, { look: 'pick', to: 'right', s: .75 }); // 2026-10-20 세로 화면에서 왼쪽 밖으로 잘리던 것
    await say('꽃밭에 알록달록 꽃이 가득해요. 꽃을 같은 색 꽃병에 쏙쏙 담아요!');
    const seq = ['red', 'yellow', 'blue', 'blue', 'red', 'yellow'];
    for (const [i, col] of seq.entries()) {
      const fl = prop(T, 'flower_' + col, 130);
      put(T, fl, 500, 340);
      fl.pos.animate([{ opacity: 0 }, { opacity: 1 }], 300);
      await fl.hop(30, 400);
      const answer = vases.find(v => v.color === col);
      await T.choose(vases.map(v => ({ el: v.pos, ok: v === answer,
        onWrong: async () => { v.wiggle(8, 380); AudioFX.miss && AudioFX.miss(); } })), {
        prompt: `${NAME[col]} 꽃이에요! 같은 색 꽃병을 톡!`, where: '꽃이랑 색깔이 같은 꽃병이 어디 있을까?', who: `${NAME[col]} 꽃병이에요! 반짝이는 꽃병을 눌러 봐요!` });
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
    }, wolf.pos);
    await say('위에서는 빨간 모자가 꽃을 따요. 아래에서는 늑대가 지름길로 달려가요!');
    hood.hop(16, 420);
    AudioFX.sfx('whoosh', .6);
    await wolf.move(1200, 535, 2400, 'ease-in');
    await T.cutImage([{ src: cutSrc('dash'), sfx: 'whoosh', hold: 2400 }], { hold: 2400 });
    await T.cutImage([{ src: cutSrc('gulp'), hold: 2600 }], { hold: 2600 });
    await T.sceneCard('', () => { T.clear(); bgImage(T, 'cottage'); camSnap(480, 310, 2.2); hide(hood); hide(wolf); }, wolf.pos);
    AudioFX.sfx('gulp') || T.tone([300, 120], .4, { vol: .2 });
    await say('똑똑똑… 문이 닫히고… 꿀꺽!');
    await T.sceneCard('', () => { scene('bed', 590); put(T, wolf, 430, 470, { look: 'granny', to: 'left' }); }, wolf.pos);
    await say('늑대는 할머니의 잠옷을 입고 침대에 누웠어요.');

    /* --- 7. 할머니 집 --- */
    await T.sceneCard('', () => {
      T.clear(); bgImage(T, 'cottage'); camSnap(480, 310, 2.2);
      put(T, hood, 470, 366, { look: 'knock', to: 'left', s: .34 });
    }, wolf.pos);
    await say('빨간 모자는 숲속 할머니 집에 도착했어요. 문을 톡 두드려요!');
    await T.tap(hood.pos, { prompt: '빨간 모자를 톡! 똑똑똑 노크해요.' });
    for (let k = 0; k < 3; k++) { knock(T); T.pop(500, 320, '똑!'); await hood.hop(8, 200); }
    await say('"들어오렴~" 안에서 쉰 목소리가 들렸어요.');

    /* --- 8. 이상한 할머니 --- */
    await T.cutImage([{ src: cutSrc('granwolf'), hold: 3000 }], { hold: 3000 });
    await T.sceneCard('이상해요', () => {
      scene('bed', P ? 510 : 590);
      put(T, wolf, 335, 472, { look: 'granny', to: 'left' });
      put(T, frame, 805, 278); // 그림 속 빈 액자 안에 진짜 할머니 사진
      put(T, hood, 640, 510, { look: 'wonder', to: 'left' });
    }, wolf.pos);
    await say('"할머니, 오셨어요?" 그런데 침대 속 할머니가 어딘가 이상해요.');
    await say('벽에 걸린 진짜 할머니 사진과 비교해서 다른 곳을 찾아봐요!');
    const WX = 335, WHt = 405 * RS.wolf_granny, WW = WHt * ASP.wolf_granny, WG = 472; // 2026-10-20 새 늑대 그림(오른쪽을 봄)에 맞춰 귀·눈·입 자리를 다시 잡음
    const px = f => WX - WW / 2 + f * WW, py = f => WG - WHt + f * WHt;
    const parts = {
      ear: { at: [px(.35), py(.14)], r: 32, q: '"할머니, 귀가 왜 이렇게 커요?"', a: '"네 말을 잘 들으려고 그렇지~"', w: '뾰족 귀!' },
      eye: { at: [px(.61), py(.26)], r: 28, q: '"할머니, 눈이 왜 이렇게 노랗고 커요?"', a: '"너를 잘 보려고 그렇지~"', w: '노란 눈!' },
      mouth: { at: [px(.74), py(.37)], r: 34, q: '"할머니, 입이 왜 이렇게 길어요?"', a: '"그건 말이지… 어흥! 놀랐지?"', w: '긴 입!' },
    };
    const left = Object.keys(parts);
    const PROMPT = '사진 속 할머니와 달라 보이는 곳을 톡!';
    while (left.length) {
      const p = parts[await findSpot(T, left.map(k => ({ key: k, ...parts[k] })), PROMPT, () => wolf.wiggle(4, 400))];
      const got = { key: left.find(k => parts[k] === p) };
      left.splice(left.indexOf(got.key), 1);
      ring(T, p.at[0], p.at[1], p.r + 8);
      await T.camTo(p.at[0], p.at[1], 2, 600);
      popSfx(T); T.pop(p.at[0], p.at[1] - 70, p.w);
      await say(p.q); await say(p.a);
      await T.camTo(P ? 510 : 590, 280, 1, 500);
      if (!left.length) break;
      await say('빨간 모자는 고개를 갸웃했어요. 또 이상한 곳이 있나 봐요.');
    }
    hood.look('surprise'); hood.hop(30, 350);
    await say('빨간 모자는 깜짝 놀랐어요. 이 사람은 할머니가 아니에요!');

    /* --- 9. 옷장으로! --- */
    await T.cutImage([{ src: cutSrc('jumpup'), sfx: 'pow', hold: 2600 }], { hold: 2600 });
    await T.sceneCard('옷장으로!', () => {
      scene('room', 380);
      put(T, hood, 560, 510, { look: 'surprise', to: 'left' });
      put(T, wolf, 800, 450, { look: 'jump', to: 'left' });
    }, hood.pos);
    const wardrobeHot = hotRect(T, 40, 125, 215, 345);
    await say('늑대가 벌떡 일어났어요! 빨간 모자야, 어서 숨어요! 옷장을 톡!');
    await T.tap(wardrobeHot, { prompt: '옷장을 톡! 쏙 숨어요.' });
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
    await say('창밖으로 지나가던 사냥꾼이 코 고는 소리를 들었어요. 창문을 톡톡 두드려 봐요!');
    await T.tap(windowHot, { prompt: '창문을 톡!' });
    windowHot.remove();
    knock(T); T.pop(500, 120, '똑똑!');
    put(T, hunter, 1150, 510, { look: 'walk', to: 'left' });
    await say('"이상한 코골이네? 할머니 댁에 무슨 일이 있나?" 사냥꾼이 방 안으로 들어왔어요.');
    await hunter.move(600, 510, 1200);
    hunter.look('tickle');
    await say('"늑대잖아! 이럴 땐 간질간질 간지럼이 최고지!"');
    await T.mash(wolf.pos, { count: 5, prompt: '늑대를 톡톡톡! 간지럼을 태워요.', onStep: i => {
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
    await say('할머니 집 식탁에서 모두 함께 차를 마셔요. 바구니 속 간식을 한 가지씩 나눠 줘요!');
    const share = [[bread, granny, '할머니!', '빵은 할머니께 톡!'], [milk, hood, '빨간 모자!', '우유는 빨간 모자 톡!'], [apple, hunter, '아저씨!', '사과는 사냥꾼 아저씨 톡!']];
    put(T, hunter, P ? 695 : 770, 510, { look: 'laugh', to: 'left', s: P ? .72 : 1 });
    for (const [it, who, word, pr] of share) {
      await T.tap(it.pos, { prompt: pr });
      popSfx(T); T.pop(who.x, 250, word);
      await it.move(who.x - (who === hood ? 0 : 0), who.y - 105, 520);
      who.hop(20, 300);
    }
    await say('"모두 고마워요!" 할머니는 활짝 웃었어요.');
    await say('"이제 약속을 꼭 지킬게요. 길에서 벗어나지 않고, 모르는 사람과는 이야기하지 않을래요."');
    await T.tap(hood.pos, { prompt: '빨간 모자를 톡! 다시 약속해요.' });
    popSfx(T); T.pop(hood.x, 200, '약속!');
    await Promise.all([hood.hop(40, 500), granny.hop(20, 500)]);
    T.confetti();
    await say('빨간 모자는 새끼손가락을 걸고, 오늘 일을 오래오래 기억했어요.');
    T.finale();
    return '빨간 모자가 약속을 꼭 지켜요!';
  }

  Tale.mount({ title: '빨간 모자', subtitle: '약속을 꼭 지켜요', run: T => run(Tale.api) });
})();
