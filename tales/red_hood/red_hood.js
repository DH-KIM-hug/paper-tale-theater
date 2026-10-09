/* 빨간 모자 — 목업(소리 없음). 기획: TALES_PLAN_2.md §9
   엄마와 한 약속을 깜빡한 빨간 모자가 늑대의 꾀에 넘어가지만, 이상한 곳을 찾아내 옷장에 숨고 사냥꾼이 도와준다.
   조작: 담기(톡 ×3) · 새끼손가락 · 걷기(쓱) · 색 맞춰 꽃병에(골라요 ×6) · 노크 · 다른 곳 찾기(골라요 ×3) · 옷장 · 창문 · 간지럼 · 나눠 주기 */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { apple: .9583, basket: .9604, bread: 1.2604, flower_blue: .7667, flower_red: .7542, flower_yellow: .6937, frame: .8896,
    granny_home: .6896, granny_pop: .675, granny_tea: .6021, hood_hide: .5667, hood_joy: .7188, hood_knock: .5667, hood_pick: .7229,
    hood_surprise: .5938, hood_walk: .5792, hood_walk2: .5354, hood_wonder: .5958, hunter_laugh: .7604, hunter_tickle: .6771,
    hunter_walk: .5458, mama: .4604, milk: .4313, vase_blue: .9458, vase_red: .9563, vase_yellow: .8938, wardrobe: .6, wolf_flee: 2.1638,
    wolf_granny: .6813, wolf_hiccup: .4854, wolf_jump: .5542, wolf_peek: .5292, wolf_run: 2.5, wolf_sleep: 2.1453, wolf_whisper: 1.5578 };
  const BGS = ['bed', 'cottage', 'door', 'flowers', 'kitchen', 'room', 'shortcut', 'table', 'trail', 'tree'];
  const CUTS = ['tail', 'whisper', 'dash', 'gulp', 'granwolf', 'jumpup', 'hiccup'];
  const bgSrc = k => AS + 'rh_bg_' + k + '.webp', cutSrc = k => AS + 'rh_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const C = { bean: '#A93B32', ink: '#2E241C' };

  /* 여러 자세를 겹쳐 두고 look()으로 하나만 보인다. 자세: [파일, 키, 그림이 원래 보는 쪽] — 발끝 가운데가 (0,0) */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'rh_' + f + '.webp', x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
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
    const wolf = mk(T, { peek: ['wolf_peek', 320, 'left'], whisper: ['wolf_whisper', 210, 'left'], granny: ['wolf_granny', 300, 'left'],
      run: ['wolf_run', 150, 'right'], sleep: ['wolf_sleep', 125, 'left'], hiccup: ['wolf_hiccup', 320, 'left'], flee: ['wolf_flee', 150, 'right'],
      jump: ['wolf_jump', 320, 'left'] });
    const hunter = mk(T, { walk: ['hunter_walk', 290, 'left'], tickle: ['hunter_tickle', 290, 'left'], laugh: ['hunter_laugh', 290, 'left'] });
    const basket = prop(T, 'basket', 100), bread = prop(T, 'bread', 62), milk = prop(T, 'milk', 105), apple = prop(T, 'apple', 62);
    const frame = prop(T, 'frame', 170);

    /* --- 1. 바구니 싸기 --- */
    scene('kitchen');
    const P = T.viewWidth() < 990; /* 세로 화면은 약 430 폭만 보인다 */
    put(T, mama, P ? 340 : 290, 510, { to: "right", s: P ? .8 : 1 });
    put(T, hood, P ? 645 : 700, 510, { look: "joy", to: "left", s: P ? .8 : 1 });
    put(T, basket, 500, 505);
    const TABLE_Y = 345;
    put(T, bread, 430, TABLE_Y); put(T, milk, 510, TABLE_Y); put(T, apple, 590, TABLE_Y);
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
    await say('빨간 모자는 콧노래를 부르며 숲길을 걸어요. 빨간 모자를 톡톡 눌러서 걸어가 봐요!');
    let step = 0;
    await T.mash(hood.pos, { count: 3, prompt: '빨간 모자를 톡톡톡! 한 걸음씩 걸어가요.', onStep: () => {
      step++; hood.look(step % 2 ? 'walk2' : 'walk');
      hood.move(hood.x + 55, 515 + step * 2, 420); hood.hop(14, 380);
      AudioFX.sfx('step_grass', .4);
    } });
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
    put(T, hood, 270, 330, { look: 'pick', to: 'right', s: .75 });
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
      T.pop(answer.x, 360, ['하나!', '둘!', '셋!', '넷!', '다섯!', '여섯!'][i]);
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
    await T.curtain(false);
    AudioFX.sfx('gulp') || T.tone([300, 120], .4, { vol: .2 });
    await say('똑똑똑… 문이 닫히고… 꿀꺽!');
    await say('늑대는 할머니의 잠옷을 입고 침대에 누웠어요.');

    /* --- 7. 할머니 집 --- */
    T.clear(); bgImage(T, 'cottage'); camSnap(480, 310, 2.2);
    put(T, hood, 450, 366, { look: 'knock', to: 'right', s: .34 });
    await T.curtain(true);
    await say('빨간 모자는 숲속 할머니 집에 도착했어요. 문을 톡 두드려요!');
    await T.tap(hood.pos, { prompt: '빨간 모자를 톡! 똑똑똑 노크해요.' });
    for (let k = 0; k < 3; k++) { knock(T); T.pop(500, 320, '똑!'); await hood.hop(8, 200); }
    await say('"들어오렴~" 안에서 쉰 목소리가 들렸어요.');

    /* --- 8. 이상한 할머니 --- */
    await T.cutImage([{ src: cutSrc('granwolf'), hold: 3000 }], { hold: 3000 });
    await T.sceneCard('이상해요', () => {
      scene('bed', 590);
      put(T, wolf, 430, 470, { look: 'granny', to: 'left' });
      put(T, frame, 775, 215);
      put(T, hood, 640, 510, { look: 'wonder', to: 'left' });
    }, wolf.pos);
    await say('"할머니, 오셨어요?" 그런데 침대 속 할머니가 어딘가 이상해요.');
    await say('벽에 걸린 진짜 할머니 사진과 비교해서 다른 곳을 찾아봐요!');
    const WX = 430, WW = 300 * ASP.wolf_granny, WG = 470;
    const px = f => WX - WW / 2 + f * WW, py = f => WG - 300 + f * 300;
    const parts = {
      ear: { at: [px(.25), py(.08)], r: 38, q: '"할머니, 귀가 왜 이렇게 커요?"', a: '"네 말을 잘 들으려고 그렇지~"', w: '뾰족 귀!' },
      eye: { at: [px(.43), py(.37)], r: 34, q: '"할머니, 눈이 왜 이렇게 노랗고 커요?"', a: '"너를 잘 보려고 그렇지~"', w: '노란 눈!' },
      mouth: { at: [px(.6), py(.47)], r: 40, q: '"할머니, 입이 왜 이렇게 길어요?"', a: '"그건 말이지… 어흥! 놀랐지?"', w: '긴 입!' },
    };
    const decoy = hotRect(T, px(.05), py(.7), WW * .9, 80);
    const left = Object.keys(parts);
    while (left.length) {
      const opts = left.map(k => ({ key: k, el: hot(T, parts[k].at[0], parts[k].at[1], parts[k].r), ok: true }));
      opts.push({ el: decoy, ok: false, onWrong: async () => { await wolf.wiggle(4, 400); } });
      const got = await T.choose(opts, { prompt: '사진 속 할머니와 달라 보이는 곳을 톡!', where: '이불 말고, 얼굴을 자세히 봐요.', who: '얼굴에서 이상한 곳을 눌러 봐요!' });
      opts.forEach(o => o.el.remove());
      left.splice(left.indexOf(got.key), 1);
      const p = parts[got.key];
      ring(T, p.at[0], p.at[1], p.r + 8);
      popSfx(T); T.pop(p.at[0], p.at[1] - 70, p.w);
      await T.camTo(p.at[0], p.at[1], 2, 600);
      await say(p.q); await say(p.a);
      await T.camTo(590, 280, 1, 500);
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
      put(T, wolf, 800, 450, { look: 'sleep', to: 'left' }); hide(wolf);
    }, hood.pos);
    const wardrobeHot = hotRect(T, 80, 40, 215, 410);
    await say('늑대가 벌떡 일어났어요! 빨간 모자야, 어서 숨어요! 옷장을 톡!');
    await T.tap(wardrobeHot, { prompt: '옷장을 톡! 쏙 숨어요.' });
    wardrobeHot.remove();
    await hood.move(190, 500, 650); hood.look('hide'); await sleep(250);
    AudioFX.sfx('door') || AudioFX.sfx('creak');
    hood.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' });
    await sleep(450);
    await say('빨간 모자는 옷장 속으로 쏙! 늑대는 두리번두리번 찾았지만 보이지 않았어요.');
    put(T, wolf, 800, 450, { look: 'sleep', to: 'left' });
    await T.camTo(640, 280, 1, 700);
    await say('할머니를 먹어서 배가 불렀던 늑대는 스르르 눈이 감겼어요. 쿨쿨…');
    T.pop(760, 300, '쿨쿨…', '#5C6BC0');

    /* --- 10. 사냥꾼 --- */
    await T.sceneCard('사냥꾼', () => { pan(620); }, wolf.pos);
    const windowHot = hotRect(T, 375, 55, 260, 230);
    await say('창밖으로 지나가던 사냥꾼이 코 고는 소리를 들었어요. 창문을 톡톡 두드려 봐요!');
    await T.tap(windowHot, { prompt: '창문을 톡!' });
    windowHot.remove();
    knock(T); T.pop(490, 130, '똑똑!');
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
      put(T, bread, 470, 410); put(T, milk, 530, 410); put(T, apple, 590, 410);
      [bread, milk, apple].forEach(a => T.world.appendChild(a.pos));
    }, granny.pos);
    await say('할머니 집 식탁에서 모두 함께 차를 마셔요. 바구니 속 간식을 한 가지씩 나눠 줘요!');
    const share = [[bread, granny, '할머니!'], [milk, hood, '빨간 모자!'], [apple, hunter, '아저씨!']];
    put(T, hunter, P ? 695 : 770, 510, { look: 'laugh', to: 'left', s: P ? .72 : 1 });
    for (const [it, who, word] of share) {
      await T.tap(it.pos, { prompt: '간식을 톡! 한 사람씩 나눠 줘요.' });
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
