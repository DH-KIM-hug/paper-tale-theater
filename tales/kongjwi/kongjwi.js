/* 콩쥐팥쥐 — 목업. 착한 콩쥐가 새엄마의 심부름을 소·두꺼비·참새·선녀의 도움으로 해내고, 잔치에서 꽃신 주인이 되어 모두와 화해한다.
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. 새엄마와 팥쥐는 부끄러워할 뿐 벌을 받지 않는다. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { basket_r: 1.1861, basket_y: 1.1563, buk: 0.9671, drum: 1.2567, fairy_float: 0.9211, fairy_give: 0.8134, gong: 1.0256,
    hangari: 0.9504, kong_bride: 0.8421, kong_hoe: 0.8966, kong_loom: 1.0174, kong_pour: 0.9145, kong_shoes: 0.8349, kong_sweep: 0.9176,
    kong_wet: 0.8294, loom: 1.0240, ox_stand: 0.8526, ox_walk: 1.5771, pail: 1.0608, pat_dressed: 0.6433, pat_eat: 0.8316,
    pat_shy: 0.5786, ricecake: 1.2600, shoe_butterfly: 2.0949, shoe_peony: 2.0693, shoe_plum: 2.0959, sparrow_flock: 1.0225,
    sparrow_one: 1.0704, step_dressed: 0.7247, step_order: 0.7370, step_shy: 0.7208, toad_idle: 1.2000, toad_plug: 1.2019,
    won_shoe: 0.5745, won_stand: 0.4757, };
  /* 2026-10-20 새 그림은 그림 크기(세로 픽셀)가 옛 그림과 달라서, 옛 그림과 같은 픽셀 축척이 되도록 높이에 곱하는 비율 */
  const RS = { drum: 0.918, fairy_float: 0.706, fairy_give: 0.789, gong: 0.948, kong_hoe: 0.994, kong_loom: 0.821,
    kong_pour: 0.940, /* 2026-10-20 크기 일관성: 물 붓기 자세가 같은 자리의 젖은 자세보다 머리 폭 17% 작아서 0.786 → 0.940 */ kong_sweep: 0.936, pail: 0.870, pat_dressed: 0.877, pat_eat: 0.849,
    step_dressed: 0.846, step_order: 0.853, step_shy: 0.757, toad_idle: 0.976, won_shoe: 0.940, };
  const NF = new Set(['basket_r', 'basket_y', 'buk', 'drum', 'gong', 'loom', 'pail', 'ricecake', 'shoe_peony', 'shoe_plum']); // 얼굴 없는 새 그림(파일 이름 끝에 nf)
  /* 서 있는 콩쥐(신부·젖은·꽃신)는 새 그림이 작게 그려져서 비율 대신 높이를 직접 정함 */
  const BGS = ['yard', 'field', 'jar', 'jarbottom', 'mat', 'loom', 'stream', 'feast', 'gate', 'wedding'];
  const CUTS = ['ox', 'wet', 'toad', 'sparrows', 'fairy', 'splash', 'shy'];
  const bgSrc = k => AS + 'kj_bg_' + k + '.webp', cutSrc = k => AS + 'kj_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };

  /* 2026-10-20 새 그림은 콩쥐(쓸기·괭이·베틀)가 왼쪽을, 새엄마(시키기)가 오른쪽을 보게 그려져 그림 방향 표시를 바꿈 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const hh = h * (RS[f] || 1), w = hh * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'kj_' + f + (NF.has(f) ? 'nf' : '') + '.webp', x: -w / 2, y: -hh, width: w, height: hh, preserveAspectRatio: 'none' }, wrap);
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
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  /* 작은 소품도 손가락이 닿게: 투명한 누르는 자리를 깐다(발끝 가운데가 0,0). 화면 짧은 변 80px 이상 (2026-10-22) */
  function widen(T, a, w = 100, h = 100) {
    const r = T.el('rect', { x: -w / 2, y: -h, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.pos.firstChild); return a;
  }

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!'];

  async function run(T) {
    const { sleep, say, camSnap } = T;
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const tr = T.tr;
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 약 430만 보인다 */
    /* 물방울: 물동이에서 독으로 붓기 / 독 구멍으로 새기 */
    const drop = (x0, y0, x1, y1, ms = 420) => {
      const c = T.el('ellipse', { cx: x0, cy: y0, rx: 7, ry: 10, fill: '#5FB4E8', stroke: '#fff', 'stroke-width': 2 }, T.world);
      const a = c.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${x1 - x0}px,${y1 - y0}px)`, opacity: .2 }], { duration: ms, easing: 'ease-in' });
      a.onfinish = () => c.remove();
    };
    const pourDrops = (pail, jar) => { for (let k = 0; k < 3; k++) setTimeout(() => drop(pail.x - 10, pail.y - 90, jar.x - 20 + k * 14, jar.y - 150, 380), k * 90); };
    const leakDrops = jar => { for (let k = 0; k < 3; k++) setTimeout(() => drop(jar.x - 4, jar.y - 30, jar.x - 4 + (k - 1) * 12, jar.y + 20, 360), 380 + k * 110); };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    const kong = mk(T, { sweep: ['kong_sweep', 230, 'left'], hoe: ['kong_hoe', 230, 'left'], pour: ['kong_pour', 230, 'left'],
      loom: ['kong_loom', 230, 'left'], shoes: ['kong_shoes', 215, 'left'], bride: ['kong_bride', 235, 'left'], wet: ['kong_wet', 225, 'left'] });
    const step = mk(T, { order: ['step_order', 240, 'right'], dressed: ['step_dressed', 240, 'left'], shy: ['step_shy', 240, 'left'] });
    const pat = mk(T, { eat: ['pat_eat', 190, 'left'], dressed: ['pat_dressed', 210, 'left'], shy: ['pat_shy', 210, 'left'] });
    const toad = mk(T, { idle: ['toad_idle', 150, 'left'], plug: ['toad_plug', 150, 'left'] });
    const ox = prop(T, 'ox_stand', 170);
    const fairy = mk(T, { float: ['fairy_float', 250, 'left'], give: ['fairy_give', 250, 'left'] });
    const won = mk(T, { stand: ['won_stand', 250, 'left'], shoe: ['won_shoe', 250, 'left'] });
    const pail = prop(T, 'pail', 80), jar = prop(T, 'hangari', 170);
    const flock = prop(T, 'sparrow_flock', 90);
    widen(T, pail, 100, 100); widen(T, flock, 120, 100);
    const sparrows = Array.from({ length: 5 }, () => prop(T, 'sparrow_one', 56));
    const basketY = prop(T, 'basket_y', 80), basketR = prop(T, 'basket_r', 80);
    const shoeB = prop(T, 'shoe_butterfly', 44), shoeP = prop(T, 'shoe_peony', 44), shoeM = prop(T, 'shoe_plum', 44);
    [shoeB, shoeP, shoeM].forEach(a => widen(T, a, 100, 90));
    const drum = prop(T, 'buk', 84), buk = prop(T, 'drum', 84), gong = prop(T, 'gong', 84); [drum, buk, gong].forEach(a => widen(T, a, 100, 100)); // 2026-10-20 새 그림은 'buk'이 큰 북, 'drum'이 장구라서 파일을 맞바꿈
    const cakes = prop(T, 'ricecake', 76), loomProp = prop(T, 'loom', 190);

    /* --- 1. 마당 쓸기 --- */
    scene('yard');
    put(T, kong, 440, 505, { look: 'sweep', to: 'right' });
    put(T, step, P ? 600 : 620, 505, { look: 'order', to: 'left' });
    put(T, pat, P ? 690 : 800, 505, { look: 'eat', to: 'left' });
    await T.curtain(true);
    await say('옛날 옛날에 마음씨 고운 콩쥐가 살았어요.');
    await say('콩쥐는 새엄마, 팥쥐와 함께 살았어요.');
    await say('"콩쥐야, 마당을 쓸어라!" 새엄마가 말했어요.');
    const sweep = i => {
      kong.hop(14, 300); popSfx(T); T.pop(kong.x + 70, kong.y - 295, tr(['쓱쓱!', '싹싹!', '깨끗!'][i - 1]));
    };
    await T.ask('콩쥐를 톡! 눌러서 마당을 쓸어 봐요!', () => T.tap(kong.pos, { prompt: '콩쥐를 톡! 마당을 쓸어요.' })); // 한 번 누르면 나머지는 저절로 (2026-10-19)
    for (let i = 1; i <= 3; i++) { await sweep(i); await sleep(450); }
    await say('마당이 깨끗해졌어요. 콩쥐는 방긋 웃었어요.');

    /* --- 2. 소가 밭을 갈아요 --- */
    await T.sceneCard(tr('밭'), () => {
      scene('field');
      put(T, kong, P ? 380 : 400, 505, { look: 'hoe', to: 'right' });
      put(T, step, P ? 660 : 720, 505, { look: 'order', to: 'left' });
    }, kong.pos);
    await say('"이 밭을 다 갈아 놓아라!" 새엄마가 말했어요.');
    await say('밭은 너무 넓어서 콩쥐는 한숨이 나왔어요.');
    put(T, ox, P ? 520 : 560, 520, { to: 'left' }); ox.pos.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    await say('그때 검은 소가 나타났어요. "음메~ 내가 도와줄게!"');
    await sleep(500);
    popSfx(T); ox.hop(20, 300);
    await T.cutImage([{ src: cutSrc('ox'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    await say('소가 쑥쑥 밭을 갈아 주었어요. "고마워, 소야!"');

    /* --- 3. 깨진 독 --- */
    await T.sceneCard(tr('우물가'), () => {
      scene('jar');
      put(T, kong, 400, 505, { look: 'pour', to: 'right' });
      put(T, jar, 560, 505); put(T, pail, 480, 520);
    }, jar.pos);
    await say('"이 독에 물을 가득 채워라!" 새엄마가 말했어요.');
    await T.ask('물동이를 톡톡톡 눌러서 물을 세 번 부어 봐요!', () => T.mash(pail.pos, { count: 3, prompt: '물동이를 톡톡톡! 물을 부어요.', onStep: i => {
      pail.hop(14, 260); popSfx(T); pourDrops(pail, jar); leakDrops(jar); T.pop(pail.x, pail.y - 290, tr(NUM[i - 1]));
    } }));
    await T.cutImage([{ src: cutSrc('wet'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    scene('jar');
    put(T, kong, 400, 505, { look: 'wet', to: 'right' }); put(T, jar, 560, 505);
    await say('앗! 독 밑에 구멍이 나서 물이 줄줄 새어 나왔어요.');
    await T.sceneCard(tr('독 안'), () => {
      scene('jarbottom');
      put(T, toad, 500, 520, { look: 'idle', to: 'left' });
    }, toad.pos);
    await say('그때 두꺼비가 폴짝 나타났어요. "내가 구멍을 막아 줄게!"');
    await T.tap(toad.pos, { prompt: '두꺼비를 톡! 구멍을 막아요.' });
    toad.look('plug'); toad.hop(24, 320); popSfx(T);
    await T.cutImage([{ src: cutSrc('toad'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    await say('두꺼비가 구멍에 쏙! 이제 물이 새지 않아요.');
    scene('jar');
    put(T, kong, 400, 505, { look: 'pour', to: 'right' }); put(T, jar, 560, 505); put(T, pail, 480, 520);
    const water = T.el('ellipse', { cx: jar.x, cy: jar.y - 150, rx: 52, ry: 11, fill: '#5FB4E8', stroke: '#fff', 'stroke-width': 3, opacity: 0 }, T.world);
    const refill = i => {
      pail.hop(14, 260); popSfx(T); pourDrops(pail, jar); T.pop(pail.x, pail.y - 290, tr(NUM[i - 1]));
      setTimeout(() => { water.setAttribute('opacity', (i / 3).toFixed(2)); }, 380);
    };
    // 저절로 (2026-10-19 톡 조작 정리)
    for (let i = 1; i <= 3; i++) { await refill(i); await sleep(500); }
    await say('독이 물로 가득 찼어요. "고마워, 두꺼비야!"');

    /* --- 4. 참새와 곡식 --- */
    await T.sceneCard(tr('멍석'), () => {
      scene('mat');
      put(T, kong, 390, 505, { look: 'sweep', to: 'right' });
      put(T, step, P ? 660 : 740, 505, { look: 'order', to: 'left' });
      put(T, basketY, 500, 535); put(T, basketR, 590, 535);
    }, kong.pos);
    await say('"겉겨를 벗겨서 쌀을 가져오너라!" 새엄마가 말했어요.');
    await say('곡식이 너무 많아서 콩쥐는 걱정이 되었어요.');
    put(T, flock, 500, 330); flock.pos.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    await say('그때 참새들이 날아왔어요. "짹짹! 우리가 도와줄게!"');
    await sleep(500);
    hide(flock); popSfx(T);
    await T.cutImage([{ src: cutSrc('sparrows'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    scene('mat');
    put(T, kong, 390, 505, { look: 'sweep', to: 'right' }); put(T, basketY, 500, 535); put(T, basketR, 590, 535);
    put(T, flock, 500, 310); flock.pos.animate([{ opacity: 0 }, { opacity: 1 }], 300);
    await T.ask('참새들이 콕콕 쪼아서 껍질을 벗겨 주었어요. 참새를 하나씩 세어 봐요!', () => T.mash(flock.pos, { count: 5, prompt: '참새를 톡톡톡톡톡! 하나씩 세어요.', onStep: i => {
      const s = sparrows[i - 1]; put(T, s, 410 + i * 52, 440 - (i % 2) * 26, { to: 'left' });
      s.pos.animate([{ opacity: 0, translate: '0 -30px' }, { opacity: 1, translate: '0 0' }], 260); s.hop(10, 240);
      popSfx(T); T.pop(s.x, s.y - 190, tr(NUM[i - 1]));
    } }));
    hide(flock);
    await say('참새가 하나, 둘, 셋, 넷, 다섯! 쌀이 금방 하얗게 되었어요.');

    /* --- 5. 선녀와 고운 옷 --- */
    await T.sceneCard(tr('베틀'), () => {
      scene('loom');
      put(T, kong, 520, 505, { look: 'loom', to: 'right' }); // 2026-10-20 새 콩쥐 베틀 그림은 베틀이 그림 속에 있어 따로 놓던 베틀 소품은 뺌
    }, kong.pos);
    await say('이제 콩쥐는 베를 짜야 했어요. 콩쥐는 열심히 베를 짰어요.');
    put(T, fairy, 640, 400, { look: 'float', to: 'left' }); fairy.pos.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    await say('그때 하늘에서 선녀가 내려왔어요. "착한 콩쥐야, 선물을 줄게!"');
    await sleep(500);
    fairy.look('give'); popSfx(T);
    await T.cutImage([{ src: cutSrc('fairy'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    scene('loom');
    put(T, kong, 450, 505, { look: 'shoes', to: 'right' }); put(T, fairy, 580, 505, { look: 'give', to: 'left' });
    await say('콩쥐는 곱디고운 옷과 나비 꽃신을 받았어요. "고맙습니다, 선녀님!"');
    await kong.hop(30, 400);

    /* --- 6. 개울에서 꽃신이 풍덩 --- */
    await T.sceneCard(tr('개울'), () => {
      scene('stream');
      put(T, kong, 370, 505, { look: 'shoes', to: 'right' });
    }, kong.pos);
    const cross = i => {
      kong.move(370 + i * 75, 505, 380); popSfx(T); T.pop(kong.x + 40, kong.y - 295, tr(NUM[i - 1]));
    };
    await T.ask('콩쥐는 잔치에 가려고 개울을 건너기로 했어요. 징검다리를 톡! 건너 봐요!', () => T.tap(kong.pos, { prompt: '콩쥐를 톡! 징검다리를 건너요.' })); // 한 번 누르면 나머지는 저절로 (2026-10-19)
    for (let i = 1; i <= 3; i++) { await cross(i); await sleep(400); }
    await T.cutImage([{ src: cutSrc('splash'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    scene('stream');
    put(T, kong, 595, 505, { look: 'shoes', to: 'right' });
    const lost = prop(T, 'shoe_butterfly', 34); put(T, lost, 640, 540);
    const drift = lost.move(930, 560, 3800, 'ease-in-out').then(() => hide(lost));
    await say('풍덩! 꽃신 한 짝이 개울에 빠졌어요. 꽃신은 둥둥 떠내려갔어요.');
    await drift;
    await say('콩쥐는 아쉬웠지만 한 짝만 신고 잔치로 갔어요.');

    /* --- 7. 잔치 --- */
    await T.sceneCard(tr('잔치'), () => {
      scene('feast');
      put(T, step, 410, 490, { look: 'dressed', to: 'right' });
      put(T, pat, 500, 490, { look: 'dressed', to: 'right' });
      put(T, kong, 590, 490, { look: 'shoes', to: 'left' });
      put(T, drum, 400, 560); put(T, buk, 500, 560); put(T, gong, 600, 560);
    }, kong.pos);
    await T.ask('잔치에서는 북과 장구와 꽹과리 소리가 울렸어요. 북을 톡 눌러 봐요!', () => T.tap(drum.pos, { prompt: '북을 톡! 둥둥 소리가 나요.' }));
    AudioFX.sfx('drum') || T.tone([140, 90], .3, { vol: .25 }); drum.hop(14, 240); T.pop(drum.x, drum.y - 360, tr('둥!'));
    await sleep(500);
    AudioFX.sfx('drum') || T.tone([200, 150], .25, { vol: .22 }); buk.hop(14, 240); T.pop(buk.x, buk.y - 360, tr('덩!'));
    await sleep(500);
    clinkSfx(T); gong.hop(14, 240); T.pop(gong.x, gong.y - 360, tr('꽹!'));
    await say('모두 신나게 춤을 추었어요. 새엄마와 팥쥐도 곱게 차려입고 왔어요.');
    await T.cutImage([{ src: cutSrc('shy'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    await say('콩쥐를 본 새엄마와 팥쥐는 부끄러워서 부채로 얼굴을 가렸어요.');

    /* --- 8. 꽃신 주인 --- */
    await T.sceneCard(tr('원님 댁'), () => {
      scene('gate');
      put(T, won, 480, 505, { look: 'shoe', to: 'right' });
      put(T, shoeP, 380, 545); put(T, shoeB, 500, 545); put(T, shoeM, 620, 545);
    }, won.pos);
    await say('개울에 빠진 꽃신은 원님에게 닿았어요. "이 꽃신의 주인을 찾아요!"');
    const got = await T.ask('꽃신 세 켤레 중에서 나비 꽃신이 콩쥐의 꽃신이에요. 나비 꽃신을 톡!', () => T.choose([
      { key: 'p', el: shoeP.pos, ok: false }, { key: 'b', el: shoeB.pos, ok: true }, { key: 'm', el: shoeM.pos, ok: false }],
      { prompt: '나비 꽃신을 톡!', where: '나비가 그려진 꽃신을 찾아봐요.', who: '반짝이는 꽃신을 톡!' }));
    clinkSfx(T); shoeB.hop(24, 320);
    await say('원님이 콩쥐에게 꽃신을 신겨 주었어요. 꼭 맞았어요!');
    put(T, kong, 640, 505, { look: 'shoes', to: 'left' });
    await sleep(500);
    popSfx(T); kong.hop(34, 400);

    /* --- 9. 화해와 함께하는 잔치 --- */
    await T.sceneCard(tr('혼례'), () => {
      scene('wedding');
      put(T, kong, 482, 505, { look: 'bride', to: 'left' });
      put(T, won, 407, 505, { look: 'stand', to: 'right' });
      put(T, step, 557, 505, { look: 'shy', to: 'left' }); put(T, pat, 622, 505, { look: 'shy', to: 'left' });
      put(T, cakes, 500, 548);
    }, kong.pos);
    await say('콩쥐와 원님은 혼례를 올렸어요. 콩쥐는 곱게 차린 신부가 되었어요.');
    await say('"콩쥐야, 그동안 미안했어." 새엄마와 팥쥐가 고개를 숙였어요.');
    await say('콩쥐는 웃으며 말했어요. "괜찮아요. 우리 같이 지내요."');
    await Promise.all([step.hop(20, 400), pat.hop(20, 400)]);
    await say('모두 함께 떡을 나눠 먹어요.');
    const eaters = [won, step, pat];
    const feed = i => {
      const who = eaters[i - 1], c = prop(T, 'ricecake', 30); put(T, c, cakes.x, cakes.y - 20);
      c.move(who.x, who.y - 110, 420, 'ease-in').then(() => { hide(c); who.hop(14, 240); });
      cakes.hop(10, 220); popSfx(T); T.pop(who.x, who.y - 330, tr(['냠냠!', '쫀득!', '맛있다!'][i - 1]));
    };
    // 저절로 (2026-10-19 톡 조작 정리)
    for (let i = 1; i <= 3; i++) { await feed(i); await sleep(500); }
    await T.ask('모두 둘러앉아 맛있게 먹었어요. 콩쥐를 톡! 모두 함께 만세!', () => T.tap(kong.pos, { prompt: '콩쥐를 톡! 모두 함께 만세!' }));
    T.confetti();
    await Promise.all([kong.hop(40, 500), won.hop(30, 500), step.hop(24, 500), pat.hop(24, 500)]);
    await say('착한 마음은 도움을 불러와요. 콩쥐팥쥐 이야기는 이렇게 끝났어요.');
    T.finale();
    return '착한 마음은 도움을 불러와요!';
  }

  Tale.mount({ title: '콩쥐팥쥐', subtitle: '착한 마음은 도움을 불러와요', run: T => run(Tale.api) });
})();
