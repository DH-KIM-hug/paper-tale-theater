/* 콩쥐팥쥐 — 목업. 착한 콩쥐가 새엄마의 심부름을 소·두꺼비·참새·선녀의 도움으로 해내고, 잔치에서 꽃신 주인이 되어 모두와 화해한다.
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. 새엄마와 팥쥐는 부끄러워할 뿐 벌을 받지 않는다. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { basket_r: 1.2797, basket_y: 1.2423, buk: .9871, drum: 1.1041, fairy_float: .65, fairy_give: .6414, gong: 1.0033,
    hangari: 1.0324, kong_bride: .48, kong_hoe: .8914, kong_loom: .8357, kong_pour: .7186, kong_shoes: .5129, kong_sweep: .8586,
    kong_wet: .5, loom: .9332, ox_stand: 1.1725, ox_walk: 2.0, pail: .8429, pat_dressed: .5643, pat_eat: .7057, pat_shy: .5871,
    ricecake: 1.7995, shoe_butterfly: 2.5547, shoe_peony: 2.3973, shoe_plum: 2.1944, sparrow_flock: 2.2508, sparrow_one: 1.1778,
    step_dressed: .6129, step_order: .6286, step_shy: .5457, toad_idle: 1.1717, toad_plug: 1.3333, won_shoe: .54, won_stand: .5057 };
  const BGS = ['yard', 'field', 'jar', 'jarbottom', 'mat', 'loom', 'stream', 'feast', 'gate', 'wedding'];
  const CUTS = ['ox', 'wet', 'toad', 'sparrows', 'fairy', 'splash', 'shy'];
  const bgSrc = k => AS + 'kj_bg_' + k + '.webp', cutSrc = k => AS + 'kj_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };

  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'kj_' + f + '.webp', x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
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

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!'];

  async function run(T) {
    const { sleep, say, camSnap } = T;
    const tr = T.tr;
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    const kong = mk(T, { sweep: ['kong_sweep', 230, 'right'], hoe: ['kong_hoe', 230, 'right'], pour: ['kong_pour', 230, 'left'],
      loom: ['kong_loom', 230, 'right'], shoes: ['kong_shoes', 240, 'left'], bride: ['kong_bride', 250, 'left'], wet: ['kong_wet', 240, 'left'] });
    const step = mk(T, { order: ['step_order', 240, 'left'], dressed: ['step_dressed', 240, 'left'], shy: ['step_shy', 240, 'left'] });
    const pat = mk(T, { eat: ['pat_eat', 190, 'left'], dressed: ['pat_dressed', 210, 'left'], shy: ['pat_shy', 210, 'left'] });
    const toad = mk(T, { idle: ['toad_idle', 150, 'left'], plug: ['toad_plug', 150, 'left'] });
    const ox = prop(T, 'ox_stand', 170);
    const fairy = mk(T, { float: ['fairy_float', 250, 'left'], give: ['fairy_give', 250, 'left'] });
    const won = mk(T, { stand: ['won_stand', 250, 'left'], shoe: ['won_shoe', 250, 'left'] });
    const pail = prop(T, 'pail', 80), jar = prop(T, 'hangari', 170);
    const flock = prop(T, 'sparrow_flock', 90);
    const sparrows = Array.from({ length: 5 }, () => prop(T, 'sparrow_one', 56));
    const basketY = prop(T, 'basket_y', 80), basketR = prop(T, 'basket_r', 80);
    const shoeB = prop(T, 'shoe_butterfly', 44), shoeP = prop(T, 'shoe_peony', 44), shoeM = prop(T, 'shoe_plum', 44);
    const drum = prop(T, 'drum', 84), buk = prop(T, 'buk', 84), gong = prop(T, 'gong', 84);
    const cakes = prop(T, 'ricecake', 76), loomProp = prop(T, 'loom', 190);

    /* --- 1. 마당 쓸기 --- */
    scene('yard');
    put(T, kong, 440, 505, { look: 'sweep', to: 'right' });
    put(T, step, 620, 505, { look: 'order', to: 'left' });
    await T.curtain(true);
    await say('옛날 옛날에 마음씨 고운 콩쥐가 살았어요.');
    await say('콩쥐는 새엄마, 팥쥐와 함께 살았어요.');
    await say('"콩쥐야, 마당을 쓸어라!" 새엄마가 말했어요.');
    await say('콩쥐를 톡톡톡 눌러서 마당을 쓸어 봐요!');
    await T.mash(kong.pos, { count: 3, prompt: '콩쥐를 톡톡톡! 마당을 쓸어요.', onStep: i => {
      kong.hop(14, 300); popSfx(T); T.pop(kong.x + 70, kong.y - 150, tr(['쓱쓱!', '싹싹!', '깨끗!'][i - 1]));
    } });
    await say('마당이 깨끗해졌어요. 콩쥐는 방긋 웃었어요.');

    /* --- 2. 소가 밭을 갈아요 --- */
    await T.sceneCard(tr('밭'), () => {
      scene('field');
      put(T, kong, 400, 505, { look: 'hoe', to: 'right' });
      put(T, step, 720, 505, { look: 'order', to: 'left' });
    }, kong.pos);
    await say('"이 밭을 다 갈아 놓아라!" 새엄마가 말했어요.');
    await say('밭은 너무 넓어서 콩쥐는 한숨이 나왔어요.');
    put(T, ox, 560, 520, { to: 'left' }); ox.pos.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    await say('그때 검은 소가 나타났어요. "음메~ 내가 도와줄게!"');
    await T.tap(ox.pos, { prompt: '소를 톡! 같이 밭을 갈아요.' });
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
    await say('물동이를 톡톡톡 눌러서 물을 세 번 부어 봐요!');
    await T.mash(pail.pos, { count: 3, prompt: '물동이를 톡톡톡! 물을 부어요.', onStep: i => {
      pail.hop(14, 260); popSfx(T); T.pop(pail.x, pail.y - 110, tr(NUM[i - 1]));
    } });
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
    await say('물동이를 톡톡톡 눌러서 다시 물을 채워 봐요!');
    await T.mash(pail.pos, { count: 3, prompt: '물동이를 톡톡톡! 물을 가득 채워요.', onStep: i => {
      pail.hop(14, 260); popSfx(T); T.pop(pail.x, pail.y - 110, tr(NUM[i - 1]));
    } });
    await say('독이 물로 가득 찼어요. "고마워, 두꺼비야!"');

    /* --- 4. 참새와 곡식 --- */
    await T.sceneCard(tr('멍석'), () => {
      scene('mat');
      put(T, kong, 390, 505, { look: 'sweep', to: 'right' });
      put(T, step, 740, 505, { look: 'order', to: 'left' });
      put(T, basketY, 500, 535); put(T, basketR, 590, 535);
    }, kong.pos);
    await say('"겉겨를 벗겨서 쌀을 가져오너라!" 새엄마가 말했어요.');
    await say('곡식이 너무 많아서 콩쥐는 걱정이 되었어요.');
    put(T, flock, 500, 330); flock.pos.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    await say('그때 참새들이 날아왔어요. "짹짹! 우리가 도와줄게!" 참새를 톡!');
    await T.tap(flock.pos, { prompt: '참새를 톡! 곡식을 도와줘요.' });
    hide(flock); popSfx(T);
    await T.cutImage([{ src: cutSrc('sparrows'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    scene('mat');
    put(T, kong, 390, 505, { look: 'sweep', to: 'right' }); put(T, basketY, 500, 535); put(T, basketR, 590, 535);
    await say('참새들이 콕콕 쪼아서 껍질을 벗겨 주었어요. 참새를 하나씩 세어 봐요!');
    await T.mash(basketY.pos, { count: 5, prompt: '바구니를 톡톡톡톡톡! 참새를 세어요.', onStep: i => {
      const s = sparrows[i - 1]; put(T, s, 410 + i * 52, 440 - (i % 2) * 26, { to: 'left' });
      s.pos.animate([{ opacity: 0, translate: '0 -30px' }, { opacity: 1, translate: '0 0' }], 260); s.hop(10, 240);
      popSfx(T); T.pop(s.x, s.y - 70, tr(NUM[i - 1]));
    } });
    await say('참새가 하나, 둘, 셋, 넷, 다섯! 쌀이 금방 하얗게 되었어요.');

    /* --- 5. 선녀와 고운 옷 --- */
    await T.sceneCard(tr('베틀'), () => {
      scene('loom');
      put(T, loomProp, 600, 505); put(T, kong, 450, 505, { look: 'loom', to: 'right' });
    }, kong.pos);
    await say('이제 콩쥐는 베를 짜야 했어요. 콩쥐는 열심히 베를 짰어요.');
    put(T, fairy, 560, 400, { look: 'float', to: 'left' }); fairy.pos.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    await say('그때 하늘에서 선녀가 내려왔어요. "착한 콩쥐야, 선물을 줄게!" 선녀를 톡!');
    await T.tap(fairy.pos, { prompt: '선녀를 톡! 선물을 받아요.' });
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
    await say('콩쥐는 잔치에 가려고 개울을 건너기로 했어요. 징검다리를 톡톡톡 건너 봐요!');
    await T.mash(kong.pos, { count: 3, prompt: '콩쥐를 톡톡톡! 징검다리를 건너요.', onStep: i => {
      kong.move(370 + i * 75, 505, 380); popSfx(T); T.pop(kong.x + 40, kong.y - 190, tr(NUM[i - 1]));
    } });
    await T.cutImage([{ src: cutSrc('splash'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    scene('stream');
    put(T, kong, 595, 505, { look: 'shoes', to: 'right' });
    await say('풍덩! 꽃신 한 짝이 개울에 빠졌어요. 꽃신은 둥둥 떠내려갔어요.');
    await say('콩쥐는 아쉬웠지만 한 짝만 신고 잔치로 갔어요.');

    /* --- 7. 잔치 --- */
    await T.sceneCard(tr('잔치'), () => {
      scene('feast');
      put(T, step, 410, 490, { look: 'dressed', to: 'right' });
      put(T, pat, 500, 490, { look: 'dressed', to: 'right' });
      put(T, kong, 590, 490, { look: 'shoes', to: 'left' });
      put(T, drum, 400, 560); put(T, buk, 500, 560); put(T, gong, 600, 560);
    }, kong.pos);
    await say('잔치에서는 북과 장구와 꽹과리 소리가 울렸어요. 북을 톡 눌러 봐요!');
    await T.tap(drum.pos, { prompt: '북을 톡! 둥둥 소리가 나요.' });
    AudioFX.sfx('drum') || T.tone([140, 90], .3, { vol: .25 }); drum.hop(14, 240); T.pop(drum.x, drum.y - 120, tr('둥!'));
    await T.tap(buk.pos, { prompt: '장구를 톡! 덩덕 소리가 나요.' });
    AudioFX.sfx('drum') || T.tone([200, 150], .25, { vol: .22 }); buk.hop(14, 240); T.pop(buk.x, buk.y - 120, tr('덩!'));
    await T.tap(gong.pos, { prompt: '꽹과리를 톡! 꽹 소리가 나요.' });
    clinkSfx(T); gong.hop(14, 240); T.pop(gong.x, gong.y - 120, tr('꽹!'));
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
    await say('꽃신 세 켤레 중에서 나비 꽃신이 콩쥐의 꽃신이에요. 나비 꽃신을 톡!');
    const got = await T.choose([
      { key: 'p', el: shoeP.pos, ok: false }, { key: 'b', el: shoeB.pos, ok: true }, { key: 'm', el: shoeM.pos, ok: false }],
      { prompt: '나비 꽃신을 톡!', where: '나비가 그려진 꽃신을 찾아봐요.', who: '반짝이는 꽃신을 톡!' });
    clinkSfx(T); shoeB.hop(24, 320);
    await say('원님이 콩쥐에게 꽃신을 신겨 주었어요. 꼭 맞았어요! 콩쥐를 톡!');
    put(T, kong, 640, 505, { look: 'shoes', to: 'left' });
    await T.tap(kong.pos, { prompt: '콩쥐를 톡! 꽃신을 신어요.' });
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
    await say('모두 함께 떡을 나눠 먹어요. 떡을 톡톡톡 눌러서 하나씩 나눠 줘요!');
    await T.mash(cakes.pos, { count: 3, prompt: '떡을 톡톡톡! 하나씩 나눠 줘요.', onStep: i => {
      cakes.hop(10, 220); popSfx(T); T.pop(cakes.x, cakes.y - 90, tr(['냠냠!', '쫀득!', '맛있다!'][i - 1]));
    } });
    await say('모두 둘러앉아 맛있게 먹었어요. 콩쥐를 톡! 모두 함께 만세!');
    await T.tap(kong.pos, { prompt: '콩쥐를 톡! 모두 함께 만세!' });
    T.confetti();
    await Promise.all([kong.hop(40, 500), won.hop(30, 500), step.hop(24, 500), pat.hop(24, 500)]);
    await say('착한 마음은 도움을 불러와요. 콩쥐팥쥐 이야기는 이렇게 끝났어요.');
    T.finale();
    return '착한 마음은 도움을 불러와요!';
  }

  Tale.mount({ title: '콩쥐팥쥐', subtitle: '착한 마음은 도움을 불러와요', run: T => run(Tale.api) });
})();
