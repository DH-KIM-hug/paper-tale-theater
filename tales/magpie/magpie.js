/* 은혜 갚은 까치 — 목업. 선비가 구렁이에게서 아기 까치를 지켜 주고, 훗날 까치들이 머리로 종을 세 번 울려 선비를 돕는다.
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. 구렁이는 사과하고 숲으로 돌아가며, 까치는 조금 지칠 뿐 괜찮다. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { scholar_walk: .4786, scholar_surprise: .5157, scholar_bow_shoot: .6086, scholar_water: .7214, scholar_bow: .5486,
    snake_coil: 1.1058, snake_flee: 2.3411, lady: .7457, chick: .9185, mag_dad_sit: 1.3158, mag_mom_sit: 1.1958,
    mag_dad_fly: 1.9337, mag_mom_fly: 1.6514, mag_dad_tired: 2.2801, mag_mom_tired: 2.5926, mag_flock: 2.0173 };
  const BGS = ['path', 'bigtree', 'nest', 'night', 'porch', 'paperdoor', 'moonnest', 'belltower', 'dawn', 'morning'];
  const CUTS = ['flee', 'tail', 'flock', 'ring', 'wake'];
  const bgSrc = k => AS + 'mg_bg_' + k + '.webp', cutSrc = k => AS + 'mg_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };

  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'mg_' + f + '.webp', x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
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
  const fadeIn = (a, ms = 400) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const bellSfx = T => { AudioFX.sfx('ding'); T.tone([330, 300], .7, { type: 'sine', vol: .2 }); };
  const NUM = ['하나!', '둘!', '셋!', '넷!'];

  async function run(T) {
    const { sleep, say, camSnap } = T;
    const tr = T.tr;
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 약 260~430만 보인다 */
    /* 눈에 안 보이는 누를 자리 (그림 속 종·둥지 위) */
    /* 아이가 어디를 눌러야 하는지 보이도록 연한 노란 빛 + 점선 테두리가 천천히 깜빡인다 */
    const zone = (x, y, w, h) => {
      const r = T.el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 30, fill: 'rgba(255,213,79,.2)', stroke: '#FFD54F', 'stroke-width': 4, 'stroke-dasharray': '10 8' }, T.world);
      r.animate([{ opacity: .45 }, { opacity: 1 }, { opacity: .45 }], { duration: 1300, iterations: Infinity, easing: 'ease-in-out' });
      return r;
    };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    const sch = mk(T, { walk: ['scholar_walk', 240, 'left'], wonder: ['scholar_bow', 240, 'left'], surprise: ['scholar_surprise', 240, 'left'],
      shoot: ['scholar_bow_shoot', 240, 'left'], water: ['scholar_water', 200, 'left'] });
    const lady = prop(T, 'lady', 210), coil = prop(T, 'snake_coil', 210), flee = prop(T, 'snake_flee', 100, 'right');
    const mom = mk(T, { sit: ['mag_mom_sit', 150, 'left'], tired: ['mag_mom_tired', 56, 'left'] });
    const dad = mk(T, { sit: ['mag_dad_sit', 150, 'left'], tired: ['mag_dad_tired', 56, 'left'] });
    const momF = prop(T, 'mag_mom_fly', 84, 'right'), dadF = prop(T, 'mag_dad_fly', 84, 'right');
    const flock = prop(T, 'mag_flock', 110);
    const chicks = Array.from({ length: 4 }, () => prop(T, 'chick', 100));

    /* --- 1. 길 --- */
    scene('path');
    put(T, sch, P ? 400 : 330, 505, { look: 'walk', to: 'right' });
    await T.curtain(true);
    await say('옛날 옛날에 마음씨 고운 선비가 길을 걸어가고 있었어요.');
    await say('선비를 톡톡톡 눌러서 걸어가 봐요!');
    await T.mash(sch.pos, { count: 3, prompt: '선비를 톡톡톡! 걸어가요.', onStep: i => {
      sch.move(sch.x + 55, 505, 380); popSfx(T);
    } });
    await say('선비는 큰 소나무 아래에 닿았어요.');

    /* --- 2. 큰 소나무: 구렁이를 쫓아요 --- */
    await T.sceneCard(tr('큰 소나무'), () => {
      scene('bigtree');
      put(T, sch, P ? 470 : 440, 505, { look: 'surprise', to: 'right' });
    }, sch.pos);
    await say('나무 위에서 까치 엄마가 울었어요. "까악 까악! 도와주세요!"');
    T.pop(sch.x + 20, 230, tr('까악!'));
    await sleep(500);
    put(T, coil, P ? 640 : 790, 505, { to: 'left', s: .55 }); fadeIn(coil, 400);
    const climb = coil.move(P ? 625 : 735, 185, 3200, 'ease-in-out');
    await say('구렁이가 아기 까치 둥지로 스르르 올라가고 있어요!');
    await climb;
    put(T, sch, P ? 470 : 440, 505, { look: 'shoot', to: 'right' });
    await say('선비가 말했어요. "아기 까치를 지켜 줄게!"');
    await T.tap(sch.pos, { prompt: '선비를 톡! 하늘에 활을 쏘아요.' });
    popSfx(T); sch.hop(18, 300); T.pop(sch.x + 60, sch.y - 250, tr('쉬익!'));
    hide(coil);
    await T.cutImage([{ src: cutSrc('flee'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    await say('쉬익! 활 소리에 깜짝 놀란 구렁이는 숲으로 도망갔어요.');

    /* --- 3. 둥지: 아기 까치 세기 --- */
    await T.sceneCard(tr('둥지'), () => { scene('nest'); }, null);
    await say('아기 까치들이 짹짹 울었어요. 아기 까치를 하나씩 세어 봐요!');
    const nestZone = zone(540, 330, 300, 190);
    const spots = [[410, 395], [480, 345], [560, 345], [630, 395]];
    await T.mash(nestZone, { count: 4, prompt: '아기 까치를 톡톡톡톡! 하나씩 세어요.', onStep: i => {
      const c = chicks[i - 1]; put(T, c, spots[i - 1][0], spots[i - 1][1] + 40, { to: 'left' });
      fadeIn(c, 260); c.hop(14, 260); popSfx(T); T.pop(c.x, c.y - 130, tr(NUM[i - 1]));
    } });
    nestZone.remove();
    await say('아기 까치는 모두 네 마리예요. "선비님, 고맙습니다!"');
    await Promise.all(chicks.map(c => c.hop(16, 400)));
    put(T, dad, P ? 385 : 255, P ? 300 : 345, { look: 'sit', to: 'right', s: P ? .6 : .85 }); fadeIn(dad, 400);
    await say('까치 아빠가 말했어요. "은혜는 꼭 갚을게요!"');
    await dad.hop(14, 300);

    /* --- 4. 깊은 밤 --- */
    await T.sceneCard(tr('깊은 밤'), () => {
      scene('night');
      put(T, sch, P ? 400 : 360, 505, { look: 'walk', to: 'right' });
    }, sch.pos);
    await say('선비는 컴컴한 산길을 걸었어요. 멀리 불빛이 반짝!');
    await T.tap(sch.pos, { prompt: '선비를 톡! 불빛을 따라가요.' });
    popSfx(T); sch.move(sch.x + 110, 505, 700);

    /* --- 5. 외딴집 --- */
    await T.sceneCard(tr('외딴집'), () => {
      scene('porch');
      put(T, sch, P ? 440 : 400, 505, { look: 'wonder', to: 'right' });
      put(T, lady, P ? 590 : 600, 505, { to: 'left' });
    }, sch.pos);
    await say('외딴집에서 아주머니가 나왔어요. "어서 오세요. 하룻밤 쉬어 가세요."');
    await lady.hop(14, 300);
    await T.cutImage([{ src: cutSrc('tail'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    await say('앗! 아주머니 치마 밑에 꼬리가 삐죽!');
    scene('paperdoor');
    put(T, sch, P ? 440 : 400, 505, { look: 'surprise', to: 'right' });
    put(T, coil, P ? 590 : 600, 505, { to: 'left' }); fadeIn(coil, 500);
    await say('아주머니는 낮에 만난 그 구렁이였어요.');
    await say('구렁이가 말했어요. "새벽까지 종이 세 번 울리면 보내 줄게. 하지만 종은 너무 멀어서 울릴 수 없을걸!"');
    await say('선비는 걱정이 되었어요. "어떡하지?"');

    /* --- 6. 달밤: 까치 가족 --- */
    await T.sceneCard(tr('달밤'), () => {
      scene('moonnest');
      put(T, dad, P ? 425 : 400, 505, { look: 'sit', to: 'right', s: P ? .85 : 1 });
      put(T, mom, P ? 580 : 560, 505, { look: 'sit', to: 'left', s: P ? .85 : 1 });
    }, dad.pos);
    await say('달빛 아래에서 까치 아빠가 말했어요. "이번에는 우리가 도울 차례예요!"');
    await dad.hop(18, 360);
    await say('까치 엄마가 말했어요. "모두 종으로 날아가요!"');
    await mom.hop(18, 360);
    hide(dad); hide(mom);
    put(T, flock, P ? 500 : 520, 380, { to: 'right' }); fadeIn(flock, 400);
    await T.tap(flock.pos, { prompt: '까치 가족을 톡! 함께 날아가요.' });
    popSfx(T); flock.hop(20, 300);
    await T.cutImage([{ src: cutSrc('flock'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    await say('까치들이 종이 있는 곳까지 쌩쌩 날아갔어요.');

    /* --- 7. 종탑: 종을 세 번 --- */
    await T.sceneCard(tr('종탑'), () => {
      scene('belltower');
      put(T, dadF, P ? 420 : 340, 330, { to: 'right' });
      put(T, momF, P ? 600 : 690, 330, { to: 'left' });
    }, null);
    await say('까치들이 머리로 종을 칠 거예요. 종을 톡톡톡 눌러서 세 번 울려 봐요!');
    const bellZone = zone(475, 310, 130, 160);
    const birds = [[dadF, P ? 420 : 340, 'right'], [momF, P ? 600 : 690, 'left']];
    await T.mash(bellZone, { count: 3, prompt: '종을 톡톡톡! 세 번 울려요.', onStep: async i => {
      const [b, hx, dir] = birds[(i - 1) % 2];
      bellSfx(T); T.pop(475, 160, tr(NUM[i - 1])); T.pop(475 + (dir === 'right' ? -125 : 125), 320, tr('댕!'), '#7A4B19');
      b.move(hx + (dir === 'right' ? 70 : -70), 290, 160).then(() => b.move(hx, 330, 260));
      T.shake();
    } });
    bellZone.remove();
    hide(dadF); hide(momF);
    await T.cutImage([{ src: cutSrc('ring'), sfx: 'pop', hold: 3600 }], { hold: 3600 });
    await say('댕, 댕, 댕! 종이 세 번 울렸어요.');
    scene('belltower');
    put(T, dad, P ? 420 : 380, 485, { look: 'tired', to: 'right', s: P ? 1.2 : 1.4 }); put(T, mom, P ? 580 : 620, 485, { look: 'tired', to: 'left', s: P ? 1.2 : 1.4 });
    await say('까치들은 조금 지쳤지만 괜찮았어요.');

    /* --- 8. 새벽: 구렁이는 돌아가요 --- */
    await T.sceneCard(tr('새벽'), () => {
      scene('dawn');
      put(T, sch, P ? 440 : 380, 505, { look: 'surprise', to: 'right' });
      put(T, coil, P ? 560 : 640, 505, { to: 'left', s: P ? .6 : .7 });
    }, sch.pos);
    await say('새벽이 밝았어요. 구렁이가 종소리를 들었어요.');
    await say('구렁이가 말했어요. "종이 세 번 울렸네! 약속대로 보내 줄게. 놀라게 해서 미안해."');
    hide(coil); put(T, flee, P ? 560 : 640, 520, { to: 'right', s: P ? .7 : 1 });
    await flee.move(P ? 760 : 1160, 520, 1400, 'ease-in');
    hide(flee);
    await say('구렁이는 스르르 숲으로 돌아갔어요.');
    put(T, mom, P ? 470 : 470, 520, { look: 'tired', to: 'right' });
    put(T, dad, P ? 440 : 590, P ? 478 : 520, { look: 'tired', to: 'right' });
    put(T, sch, P ? 590 : 380, 505, { look: 'water', to: P ? 'left' : 'left' });
    if (!P) put(T, sch, 700, 505, { look: 'water', to: 'left' });
    await say('지친 까치 엄마 아빠가 쉬고 있어요.');
    await T.tap(sch.pos, { prompt: '선비를 톡! 물을 줘요.' });
    popSfx(T); sch.hop(16, 360); mom.hop(10, 300); dad.hop(10, 300);
    await say('선비가 말했어요. "고마워, 까치야. 푹 쉬렴!"');

    /* --- 9. 아침 --- */
    await T.sceneCard(tr('아침'), () => {
      scene('morning');
      put(T, sch, P ? 450 : 450, 505, { look: 'wonder', to: 'right' });
      put(T, mom, P ? 560 : 580, 500, { look: 'sit', to: 'left' });
      put(T, dad, P ? 625 : 660, 500, { look: 'sit', to: 'left' });
    }, sch.pos);
    await T.cutImage([{ src: cutSrc('wake'), sfx: 'pop', hold: 3600 }], { hold: 3600 });
    await say('아침 해가 떴어요. 아기 까치들도 날아왔어요.');
    chicks.forEach((c, i) => { put(T, c, (P ? 410 : 360) + i * (P ? 70 : 60), 540, { to: 'right' }); fadeIn(c, 400); c.hop(12, 400); });
    await say('모두 함께 웃었어요.');
    await T.tap(sch.pos, { prompt: '선비를 톡! 모두 함께 만세!' });
    T.confetti();
    await Promise.all([sch.hop(40, 500), mom.hop(26, 500), dad.hop(26, 500), ...chicks.map(c => c.hop(22, 500))]);
    await say('서로 돕는 마음은 따뜻해요. 은혜 갚은 까치 이야기는 이렇게 끝났어요.');
    T.finale();
    return '서로 돕는 마음은 따뜻해요!';
  }

  Tale.mount({ title: '은혜 갚은 까치', subtitle: '서로 돕는 마음은 따뜻해요', run: T => run(Tale.api) });
})();
