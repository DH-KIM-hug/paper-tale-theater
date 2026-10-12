/* 헨젤과 그레텔 — 목업. 산딸기를 따다 길을 잃은 남매가 빵 부스러기는 새가 먹어 버려 과자 집에 닿고,
   과자를 아끼는 심술쟁이 마녀를 꾀로 쫓아낸 뒤 오리의 도움으로 아빠 품에 돌아온다. 무서운 장면 없음(마녀는 놀라서 날아갈 뿐).
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { father: 1.0043, father_wood: .6171, hans_walk: .4829, hans_crumb: .6579, hans_doze: .6135, hans_eat: .4886, hans_cage: .5329,
    hans_joy: .6771, gret_walk: .5857, gret_doze: .7329, gret_eat: .67, gret_clever: .6029, gret_push: .6975, gret_duck: .6733, gret_key: .6343,
    witch_beckon: .5486, witch_grope: .7871, witch_oven: .8157, bird_peck: 1.6627, bird_crumb: 1.1723, duck_ride: 1.2216, duck_ride2: 1.1356 };
  const BGS = ['cottage', 'trail', 'glade', 'ground', 'house', 'roof', 'cage', 'oven', 'river'];
  const CUTS = ['bird', 'eat', 'witch', 'slam', 'pop', 'duck', 'hug'];
  const bgSrc = k => AS + 'hg_bg_' + k + '.webp', cutSrc = k => AS + 'hg_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const INK = '#2E241C';

  let SC = 1; /* 세로 화면(폭이 좁다)에서는 그림을 조금 줄인다 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'hg_' + f + '.webp', x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
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
  const prop = (T, f, h, nat = 'left') => mk(T, { a: [f, h, nat] });
  function put(T, a, x, y = GROUND, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s * SC); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 400) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!'];

  async function run(T) {
    const { sleep, say, camSnap } = T;
    const tr = T.tr;
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 좁은 폭만 보인다 */
    SC = P ? .8 : 1;
    const scene = (key, cx = 500) => { T.clear(); bgImage(T, key); camSnap(cx, 280, 1); };
    const L = (l, p) => (P ? p : l); /* 가로 값, 세로 값 */

    /* 종이로 오린 작은 그림들 (눈 없는 것만) */
    const crumbAt = (x, y) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world);
      T.el('ellipse', { cx: x, cy: y, rx: 13, ry: 9, fill: '#F3DFA8' }, g);
      T.el('ellipse', { cx: x - 3, cy: y - 2, rx: 6, ry: 3.5, fill: '#FFF3CD' }, g);
      g.animate([{ transform: 'translateY(-26px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 260, easing: 'ease-out' });
      return g;
    };
    const CANDY = ['#E26D6D', '#F3C969', '#6FA8DC'];
    const candyAt = (x, y, i) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world), c = CANDY[i % 3], r = 17;
      if (i % 2 === 0) { T.el('circle', { cx: x, cy: y, r, fill: c }, g); T.el('circle', { cx: x - 4, cy: y - 4, r: 6, fill: '#fff', opacity: .45 }, g); }
      else { T.el('polygon', { points: `${x},${y - r} ${x + r * 1.1},${y + r * .8} ${x - r * 1.1},${y + r * .8}`, fill: c }, g); T.el('circle', { cx: x - 3, cy: y + 2, r: 4, fill: '#fff', opacity: .45 }, g); }
      return g;
    };
    const STAR = (x, y, R) => Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? R * .45 : R; return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`; }).join(' ');
    /* 열쇠: 머리 모양만 다른 금빛 열쇠. 손가락이 닿기 쉽게 투명한 큰 칸을 깐다 */
    const keyAt = (x, y, kind) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world), gold = '#E3B33C', dk = '#C99A2B';
      T.el('rect', { x: x - 6, y: y, width: 12, height: 52, fill: gold }, g);
      T.el('rect', { x: x + 6, y: y + 30, width: 14, height: 8, fill: gold }, g); T.el('rect', { x: x + 6, y: y + 44, width: 10, height: 8, fill: gold }, g);
      if (kind === 'circle') T.el('circle', { cx: x, cy: y - 12, r: 22, fill: gold }, g);
      else if (kind === 'square') T.el('rect', { x: x - 20, y: y - 32, width: 40, height: 40, rx: 4, fill: gold }, g);
      else T.el('polygon', { points: STAR(x, y - 12, 27), fill: gold }, g);
      T.el('circle', { cx: x, cy: y - 12, r: 6, fill: dk }, g);
      T.el('rect', { x: x - 34, y: y - 48, width: 68, height: 110, fill: 'rgba(0,0,0,0)' }, g);
      return g;
    };
    const lockAt = (x, y) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world);
      T.el('path', { d: `M${x - 14} ${y} v-22 a14 14 0 0 1 28 0 v22`, fill: 'none', stroke: '#B9B3A8', 'stroke-width': 7 }, g);
      T.el('rect', { x: x - 28, y, width: 56, height: 46, rx: 8, fill: '#E3B33C' }, g);
      T.el('polygon', { points: STAR(x, y + 23, 14), fill: '#6B4A1E' }, g);
      return g;
    };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    const hans = mk(T, { walk: ['hans_walk', 200, 'right'], crumb: ['hans_crumb', 200, 'right'], doze: ['hans_doze', 175, 'left'], eat: ['hans_eat', 200, 'left'],
      cage: ['hans_cage', 395, 'left'], joy: ['hans_joy', 200, 'left'] });
    const gret = mk(T, { walk: ['gret_walk', 190, 'right'], doze: ['gret_doze', 170, 'left'], eat: ['gret_eat', 190, 'left'], clever: ['gret_clever', 195, 'left'],
      push: ['gret_push', 195, 'right'], key: ['gret_key', 195, 'left'] });
    const father = mk(T, { wood: ['father_wood', 240, 'right'], hug: ['father', 240, 'left'] });
    const witch = mk(T, { beckon: ['witch_beckon', 270, 'left'], grope: ['witch_grope', 260, 'right'], oven: ['witch_oven', 255, 'left'] });
    const bird = mk(T, { crumb: ['bird_crumb', 80, 'left'], peck: ['bird_peck', 70, 'left'] });
    const duck = mk(T, { a: ['duck_ride', 135, 'right'], b: ['duck_ride2', 135, 'right'] });

    /* --- 1. 집 앞 --- */
    scene('cottage');
    put(T, gret, L(340, 410), GROUND, { look: 'walk', to: 'right' });
    put(T, hans, L(440, 480), GROUND, { look: 'walk', to: 'right' });
    put(T, father, L(560, 560), GROUND, { look: 'wood', to: 'right' });
    await T.curtain(true);
    await say('옛날 옛날에 숲 옆 작은 집에 헨젤과 그레텔이 살았어요.');
    await say('"얘들아, 숲에 산딸기 따러 가자!" 아빠가 말했어요.');
    await say('헨젤은 빵 부스러기로 길을 표시하기로 했어요.');
    await say('헨젤을 톡! 숲으로 출발해요.');
    await T.tap(hans.pos, { prompt: '헨젤을 톡! 출발!' });
    popSfx(T); hans.hop(20, 300);
    await Promise.all([gret.move(gret.x + 50, GROUND, 600), hans.move(hans.x + 50, GROUND, 600), father.move(father.x + 50, GROUND, 600)]);

    /* --- 2. 숲길: 빵 부스러기 세기 --- */
    await T.sceneCard(tr('숲길'), () => {
      scene('trail');
      put(T, gret, L(250, 400), GROUND, { look: 'walk', to: 'right' });
      put(T, hans, L(330, 430), GROUND, { look: 'crumb', to: 'right' });
    }, hans.pos);
    await say('헨젤이 빵 부스러기를 하나씩 떨어뜨려요. 같이 세어 봐요!');
    const stepX = L(80, 36);
    let hx = hans.x, gx = gret.x;
    await T.mash(hans.pos, { count: 5, prompt: '헨젤을 톡톡톡톡톡! 부스러기를 세어요.', onStep: i => {
      const cx = hx - 14;
      crumbAt(cx, 520); popSfx(T); T.pop(cx, 450, tr(NUM[i - 1]));
      hx += stepX; gx += stepX;
      hans.hop(10, 220); hans.move(hx, GROUND, 360); gret.move(gx, GROUND, 360);
    } });
    await say('빵 부스러기가 하나, 둘, 셋, 넷, 다섯! 길이 생겼어요.');

    /* --- 3. 빈터: 졸려서 잠들고 길을 잃어요 --- */
    await T.sceneCard(tr('빈터'), () => {
      scene('glade');
      put(T, hans, L(430, 445), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(540, 555), GROUND, { look: 'walk', to: 'left' });
    }, hans.pos);
    await say('빈터에는 빨간 산딸기가 가득했어요. 둘은 냠냠 따 먹었어요.');
    hans.hop(14, 300); gret.hop(14, 300);
    await say('배가 부르니 졸려서 둘은 나무 밑에서 깜빡 잠이 들었어요.');
    put(T, hans, L(430, 445), GROUND + 6, { look: 'doze' }); put(T, gret, L(540, 555), GROUND + 6, { look: 'doze' });
    await sleep(900);
    await say('눈을 떠 보니 아빠가 보이지 않았어요. 둘은 길을 잃었어요.');
    put(T, hans, L(430, 445), GROUND, { look: 'walk', to: 'right' }); put(T, gret, L(540, 555), GROUND, { look: 'walk', to: 'left' });
    await say('그레텔은 마음이 조금 무서웠어요. 그레텔을 톡! 꼭 안아 줘요.');
    await T.tap(gret.pos, { prompt: '그레텔을 톡! 꼭 안아 줘요.' });
    popSfx(T); gret.hop(14, 300); hans.move(hans.x + 28, GROUND, 360); T.pop(gret.x, gret.y - 215, tr('꼭!'));
    await say('"괜찮아, 빵 부스러기 길을 따라가자!" 헨젤이 말했어요.');

    /* --- 4. 땅바닥: 새가 부스러기를 먹었어요 --- */
    await T.sceneCard(tr('숲 바닥'), () => {
      scene('ground');
      put(T, hans, L(400, 425), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(490, 500), GROUND, { look: 'walk', to: 'right' });
    }, hans.pos);
    await say('그런데 이상해요. 빵 부스러기가 하나도 없어요!');
    put(T, bird, L(640, 590), GROUND + 10, { look: 'crumb', to: 'left' }); fadeIn(bird);
    await say('작은 새가 빵 부스러기를 물고 있어요. 새를 톡!');
    await T.tap(bird.pos, { prompt: '새를 톡! 어디 갔는지 물어봐요.' });
    bird.hop(18, 300); popSfx(T); T.pop(bird.x, bird.y - 110, tr('짹짹!'));
    await T.cutImage([{ src: cutSrc('bird'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    scene('ground');
    put(T, hans, L(400, 425), GROUND, { look: 'walk', to: 'right' }); put(T, gret, L(490, 500), GROUND, { look: 'walk', to: 'right' });
    put(T, bird, L(640, 590), GROUND + 10, { look: 'peck', to: 'left' });
    await say('"짹짹! 맛있어서 내가 다 먹었어!" 새가 말했어요.');
    await say('헨젤은 눈물이 글썽했지만 그레텔의 손을 꼭 잡고 걸었어요.');

    /* --- 5. 과자 집 --- */
    await T.sceneCard(tr('과자 집'), () => {
      scene('house');
      put(T, hans, L(400, 440), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(500, 540), GROUND, { look: 'walk', to: 'right' });
    }, gret.pos);
    await say('그때 달콤한 냄새가 솔솔 났어요. 앗, 과자 집이에요!');
    await say('벽은 쿠키, 지붕은 사탕이에요. 그레텔을 톡! 한 입 먹어 봐요.');
    await T.tap(gret.pos, { prompt: '그레텔을 톡! 냠냠 먹어요.' });
    gret.look('eat'); hans.look('eat'); popSfx(T); gret.hop(16, 300); T.pop(gret.x, gret.y - 215, tr('냠냠!'));
    await T.cutImage([{ src: cutSrc('eat'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    await say('너무 맛있어서 둘은 배가 빵빵해졌어요.');

    /* --- 6. 지붕: 사탕 세기 --- */
    await T.sceneCard(tr('지붕'), () => {
      scene('roof');
      put(T, gret, L(390, 420), GROUND, { look: 'eat', to: 'left' });
      put(T, hans, L(500, 520), GROUND, { look: 'walk', to: 'left' });
    }, hans.pos);
    await say('지붕에 사탕이 빠진 곳이 있어요. 헨젤이 하나씩 붙여 줘요. 같이 세어 봐요!');
    const rx = i => L(340 + i * 80, 396 + i * 52);
    await T.mash(hans.pos, { count: 5, prompt: '헨젤을 톡톡톡톡톡! 사탕을 세어요.', onStep: i => {
      const x = rx(i - 1), c = candyAt(hans.x, hans.y - 150, i - 1);
      c.animate([{ transform: 'translate(0,0) scale(.4)' }, { transform: `translate(${x - hans.x}px,${230 - hans.y + 150}px) scale(1)` }], { duration: 420, easing: 'ease-out', fill: 'forwards' });
      hans.hop(12, 240); popSfx(T); setTimeout(() => T.pop(x, 190, tr(NUM[i - 1])), 330);
    } });
    await say('사탕이 하나, 둘, 셋, 넷, 다섯! 지붕이 예뻐졌어요.');

    /* --- 7. 마녀 할머니 --- */
    await T.sceneCard(tr('마녀'), () => {
      scene('house');
      put(T, hans, L(380, 420), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(470, 480), GROUND, { look: 'walk', to: 'right' });
    }, hans.pos);
    put(T, witch, L(640, 590), GROUND, { look: 'beckon', to: 'left' }); fadeIn(witch);
    await say('그때 문이 열리고 마녀 할머니가 나왔어요.');
    await T.cutImage([{ src: cutSrc('witch'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    await say('"내 과자 집을 누가 먹었니!" 마녀가 투덜거렸어요.');
    await say('마녀는 과자를 아끼는 심술쟁이 할머니였어요.');
    hans.look('cage'); hans.place(hans.x, GROUND); hans.setScale(.55 * SC); hans.hop(14, 320); popSfx(T);
    await say('마녀는 헨젤을 새장에 쏙 넣어 버렸어요. "과자 값을 낼 때까지 여기 있어!"');

    /* --- 8. 새장: 별 열쇠 고르기 --- */
    const CX = L(500, 215);
    await T.sceneCard(tr('새장'), () => {
      scene('cage', CX);
      put(T, hans, 121, 433, { look: 'cage', to: 'left', s: 1 });
      put(T, gret, L(340, 300), GROUND, { look: 'clever', to: 'left' });
    }, hans.pos);
    hans.setScale(SC); /* 새장 그림 하나를 배경의 새장 자리에 맞춘다 */
    const lock = lockAt(L(232, 205), 330);
    await say('그레텔은 마녀가 낮잠을 자는 사이에 열쇠 세 개를 가져왔어요.');
    await say('새장 자물쇠에는 별 모양 구멍이 있어요. 별 모양 열쇠를 톡!');
    const kc = keyAt(L(470, 160), 440, 'circle'), ks = keyAt(L(570, 225), 440, 'square'), kt = keyAt(L(670, 290), 440, 'star');
    const keys = [kc, ks, kt];
    keys.forEach(k => k.animate([{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'translateY(0)' }], 350));
    await T.choose([{ key: 'c', el: kc, ok: false }, { key: 's', el: ks, ok: false }, { key: 't', el: kt, ok: true }],
      { prompt: '별 모양 열쇠를 톡!', where: '열쇠 머리 모양을 잘 봐요.', who: '반짝이는 별 열쇠를 톡!' });
    clinkSfx(T); kc.remove(); ks.remove(); kt.remove();
    gret.look('key'); gret.hop(14, 300); T.pop(L(232, 205), 300, tr('찰칵!'));
    await sleep(500);
    lock.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
    put(T, hans, L(250, 215), GROUND, { look: 'joy', to: 'left' });
    hans.hop(34, 420);
    await say('찰칵! 새장이 열렸어요. 헨젤이 폴짝 뛰어나왔어요!');
    await say('"고마워, 그레텔!" 헨젤이 말했어요.');

    /* --- 9. 화덕: 꾀로 마녀를 쫓아요 --- */
    await T.sceneCard(tr('화덕'), () => {
      scene('oven');
      put(T, hans, L(250, 380), GROUND, { look: 'joy', to: 'right' });
      put(T, gret, L(400, 445), GROUND, { look: 'clever', to: 'right' });
      put(T, witch, L(760, 640), GROUND, { look: 'grope', to: 'left' });
      if (P) hide(hans);
    }, gret.pos);
    await witch.move(L(640, 585), GROUND, 1000);
    await say('그때 마녀가 일어나 쿵쿵 걸어왔어요. 눈이 나빠서 더듬더듬 찾았어요.');
    await say('그레텔은 꾀가 났어요. "마녀님, 화덕 안에 반짝이는 게 있어요!"');
    witch.look('oven', 'left'); witch.hop(10, 300);
    await say('마녀가 화덕 안을 들여다봐요. 그레텔을 톡! 화덕 문을 쾅 밀어요.');
    await T.tap(gret.pos, { prompt: '그레텔을 톡! 쾅 밀어요.' });
    gret.look('push', 'right'); popSfx(T); T.pop(L(500, 500), 330, tr('쾅!'));
    await T.cutImage([{ src: cutSrc('slam'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    await say('쾅! 마녀는 깜짝 놀라 모자가 휙 날아갔어요.');
    await T.cutImage([{ src: cutSrc('pop'), sfx: 'pop', hold: 3600 }], { hold: 3600 });
    scene('oven');
    put(T, hans, L(300, 380), GROUND, { look: 'joy', to: 'right' }); put(T, gret, L(440, 480), GROUND, { look: 'clever', to: 'right' });
    if (P) hide(hans);
    await say('마녀는 빗자루를 타고 굴뚝으로 휘리릭 날아갔어요. "다시는 안 올게~!"');
    T.pop(L(500, 500), 300, tr('휘리릭!'));
    gret.hop(24, 400); hans.hop(24, 400);

    /* --- 10. 강: 오리의 등 --- */
    await T.sceneCard(tr('강'), () => {
      scene('river');
      put(T, hans, L(380, 420), GROUND + 12, { look: 'walk', to: 'right' });
      put(T, gret, L(470, 490), GROUND + 12, { look: 'walk', to: 'right' });
    }, hans.pos);
    await say('집으로 가는 길에 넓은 강이 나왔어요. 다리가 없어요!');
    put(T, duck, L(820, 640), 470, { look: 'a', to: 'left' }); fadeIn(duck);
    await duck.move(L(640, 570), 470, 1100);
    await say('그때 흰 오리가 헤엄쳐 왔어요. 오리를 톡!');
    await T.tap(duck.pos, { prompt: '오리를 톡! 등에 타요.' });
    duck.look('b'); duck.hop(14, 300); popSfx(T); T.pop(duck.x, duck.y - 150, tr('꽥꽥!'));
    await T.cutImage([{ src: cutSrc('duck'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    scene('river');
    put(T, duck, L(640, 570), 470, { look: 'b', to: 'left' });
    put(T, hans, L(380, 420), GROUND + 12, { look: 'walk', to: 'right' }); put(T, gret, L(470, 490), GROUND + 12, { look: 'walk', to: 'right' });
    await say('"꽥꽥! 내 등에 타!" 오리가 말했어요.');
    await say('오리가 둘을 태우고 강을 건너 주었어요. "고마워, 오리야!"');

    /* --- 11. 우리 집: 아빠와 만나요 --- */
    await T.sceneCard(tr('우리 집'), () => {
      scene('cottage');
      put(T, hans, L(660, 580), GROUND, { look: 'walk', to: 'left' });
      put(T, gret, L(740, 625), GROUND, { look: 'walk', to: 'left' });
      put(T, father, L(300, 400), GROUND, { look: 'hug', to: 'right' });
    }, hans.pos);
    await say('저 멀리 집이 보여요. 아빠가 숲에서 둘을 애타게 찾고 있었어요.');
    await father.move(L(450, 480), GROUND, 800);
    await say('"헨젤! 그레텔!" 아빠가 달려왔어요. 아빠를 톡!');
    await T.tap(father.pos, { prompt: '아빠를 톡! 꼭 안아요.' });
    popSfx(T); father.hop(20, 300);
    await T.cutImage([{ src: cutSrc('hug'), sfx: 'pop', hold: 3600 }], { hold: 3600 });
    scene('cottage');
    put(T, father, 500, GROUND, { look: 'hug', to: 'left' });
    put(T, hans, L(400, 440), GROUND, { look: 'joy', to: 'left' }); put(T, gret, L(600, 565), GROUND, { look: 'key', to: 'left' });
    await say('"찾았다! 보고 싶었어!" 아빠가 말했어요.');
    await say('헨젤과 그레텔은 마음이 따뜻하고 행복했어요. 여러분은 기분이 어때요? 헨젤을 톡! 만세!');
    await T.tap(hans.pos, { prompt: '헨젤을 톡! 만세!' });
    T.pop(hans.x, hans.y - 230, tr('만세!'));
    T.confetti();
    await Promise.all([hans.hop(40, 500), gret.hop(34, 500), father.hop(26, 500)]);
    await say('우리 집이 제일 포근해요. 헨젤과 그레텔 이야기는 이렇게 끝났어요.');
    T.finale();
    return '우리 집이 제일 포근해요!';
  }

  Tale.mount({ title: '헨젤과 그레텔', subtitle: '집이 제일 포근해요', run: T => run(Tale.api) });
})();
