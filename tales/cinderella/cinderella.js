/* 신데렐라 — 목업. 부엌일이 많은 신데렐라를 생쥐들과 요정 할머니가 도와주고, 무도회·열두 시 종·유리 구두 끝에 왕자님이 주인을 찾는다.
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. 새엄마와 언니들은 우스꽝스러울 뿐 벌을 받지 않고 끝에 함께 웃는다. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { cind_sweep: .7214, cind_cry: .4829, cind_joy: .5543, cind_surprise: .4871, cind_old: .4643, cind_gown: .75, cind_dance: .7757, cind_run: .7571,
    step_pose: .47, step_wave: .5471, sis1_ribbon: .6214, sis2_ribbon: .4743, sis1_pose: .5871, sis2_pose: .4171, sis_sorry: .9586,
    fairy_pop: .8286, fairy_wave: .8643, fairy_warn: .6986, prince_stand: .4929, prince_dance: .6143, prince_slipper: .5171, footman: .5829, mouse: .8831 };
  const BGS = ['kitchen', 'hearth', 'parlor', 'garden', 'hall', 'tower', 'stairs_high', 'palacegarden'];
  const CUTS = ['bow', 'fairy', 'horses', 'pumpkin', 'dress', 'slipper', 'foot'];
  const bgSrc = k => AS + 'cd_bg_' + k + '.webp', cutSrc = k => AS + 'cd_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };

  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'cd_' + f + '.webp', x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
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
  const fade = (a, ms = 400) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const bellSfx = T => AudioFX.sfx('ding') || T.tone([330, 300], .5, { vol: .18, type: 'triangle' });
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!'];

  async function run(T) {
    const { sleep, say, camSnap } = T;
    const tr = T.tr;
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 약 260만 보인다 */
    const X = (l, p) => (P ? p : l);

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    const cind = mk(T, { sweep: ['cind_sweep', 225, 'left'], cry: ['cind_cry', 225, 'left'], joy: ['cind_joy', 225, 'left'], old: ['cind_old', 225, 'left'],
      gown: ['cind_gown', 235, 'left'], dance: ['cind_dance', 235, 'left'], run: ['cind_run', 225, 'right'], surprise: ['cind_surprise', 225, 'left'] });
    const step = mk(T, { pose: ['step_pose', 235, 'left'], wave: ['step_wave', 235, 'left'] });
    const sisA = mk(T, { ribbon: ['sis1_ribbon', 215, 'left'], pose: ['sis1_pose', 215, 'left'] });
    const sisB = mk(T, { ribbon: ['sis2_ribbon', 220, 'left'], pose: ['sis2_pose', 220, 'left'] });
    const sorry = prop(T, 'sis_sorry', 190);
    const fairy = mk(T, { pop: ['fairy_pop', 215, 'left'], wave: ['fairy_wave', 215, 'left'], warn: ['fairy_warn', 215, 'left'] });
    const prince = mk(T, { stand: ['prince_stand', 225, 'left'], dance: ['prince_dance', 225, 'right'], slip: ['prince_slipper', 225, 'left'] });
    const footman = prop(T, 'footman', 220);
    const mice = Array.from({ length: 4 }, () => prop(T, 'mouse', 84));
    const faces = ['cry', 'joy', 'surprise'].map(k => mk(T, { a: ['cind_' + k, 190, 'left'] }));

    /* --- 1. 부엌 --- */
    scene('kitchen');
    put(T, cind, X(400, 440), 505, { look: 'sweep', to: 'left' });
    put(T, step, X(640, 575), 505, { look: 'wave', to: 'left' });
    await T.curtain(true);
    await say('옛날 옛날에 마음씨 고운 신데렐라가 살았어요.');
    await say('신데렐라는 새엄마, 두 언니와 함께 살았어요.');
    await say('"신데렐라, 부엌을 쓸어라!" 새엄마가 말했어요.');
    await say('신데렐라를 톡톡톡 눌러서 부엌을 쓸어 봐요!');
    await T.mash(cind.pos, { count: 3, prompt: '신데렐라를 톡톡톡! 부엌을 쓸어요.', onStep: i => {
      cind.hop(14, 300); popSfx(T); T.pop(cind.x + 20, cind.y - 250, tr(['쓱쓱!', '싹싹!', '깨끗!'][i - 1]));
    } });
    await say('부엌이 깨끗해졌어요. 그런데 일이 아직 많이 남았어요.');

    /* --- 2. 난롯가: 마음 고르기 + 생쥐 세기 --- */
    await T.sceneCard(tr('난롯가'), () => {
      scene('hearth');
      put(T, cind, X(500, 500), 505, { look: 'cry', to: 'left' });
    }, cind.pos);
    await say('일이 너무 많아서 신데렐라는 마음이 슬퍼졌어요.');
    await say('신데렐라의 마음은 어떨까요? 슬픈 얼굴을 톡!');
    hide(cind);
    const fx = X([360, 500, 640], [418, 500, 582]);
    faces.forEach((f, i) => put(T, f, fx[i], 505, { to: 'left' }));
    const feel = await T.choose([
      { key: 'cry', el: faces[0].pos, ok: true }, { key: 'joy', el: faces[1].pos, ok: false }, { key: 'sur', el: faces[2].pos, ok: false }],
      { prompt: '슬픈 얼굴을 톡!', where: '눈물이 맺힌 얼굴을 찾아봐요.', who: '두 손으로 눈을 가린 얼굴을 톡!' });
    clinkSfx(T); faces[0].hop(20, 320);
    await say('맞아요, 슬픈 마음이에요. 그때 쪼르르 소리가 났어요.');
    faces.forEach(hide);
    put(T, cind, X(380, 425), 505, { look: 'cry', to: 'left' });
    const mx = X([520, 590, 660, 730], [495, 548, 601, 522]), my = X([505, 505, 505, 505], [505, 505, 505, 462]);
    put(T, mice[0], mx[0], my[0], { to: 'right' }); fade(mice[0]);
    await say('그때 생쥐들이 달려왔어요. "우리가 도와줄게!"');
    await say('생쥐를 톡톡톡톡 눌러서 하나씩 세어 봐요!');
    await T.mash(mice[0].pos, { count: 4, prompt: '생쥐를 톡톡톡톡! 하나씩 세어요.', onStep: i => {
      const m = mice[i - 1];
      if (i > 1) { put(T, m, mx[i - 1], my[i - 1], { to: 'right' }); m.pos.animate([{ opacity: 0, translate: '0 -30px' }, { opacity: 1, translate: '0 0' }], 260); }
      m.hop(14, 260); popSfx(T); T.pop(m.x, m.y - 190, tr(NUM[i - 1]));
    } });
    cind.look('joy'); cind.hop(24, 340);
    await say('생쥐가 하나, 둘, 셋, 넷! 모두 같이 청소를 했어요.');
    await say('신데렐라는 방긋 웃었어요. "고마워, 친구들!"');

    /* --- 3. 거실: 리본 언니들 --- */
    await T.sceneCard(tr('거실'), () => {
      scene('parlor');
      mice.forEach(hide);
      put(T, sisA, X(480, 440), 505, { look: 'ribbon', to: 'left' });
      put(T, sisB, X(580, 545), 505, { look: 'ribbon', to: 'left' });
      put(T, step, X(720, 600), 505, { look: 'pose', to: 'left' });
      if (P) hide(step);
      put(T, cind, X(300, 380), 505, { look: 'old', to: 'right' });
      if (P) hide(cind);
    }, sisA.pos);
    await say('어느 날, 왕궁에서 무도회가 열린다는 소식이 왔어요.');
    await say('언니들은 커다란 리본을 달고 빙글빙글 돌았어요.');
    sisA.hop(20, 400); sisB.hop(20, 400);
    await say('언니를 톡! 리본을 달아 줘요.');
    await T.tap(sisA.pos, { prompt: '언니를 톡! 리본을 달아 줘요.' });
    popSfx(T); sisA.hop(26, 340);
    await T.cutImage([{ src: cutSrc('bow'), sfx: 'pop', hold: 3600 }], { hold: 3600 });
    await say('쿵! 리본이 너무 커서 언니들이 서로 부딪혔어요. 신데렐라는 킥킥 웃었어요.');
    scene('parlor');
    put(T, cind, X(500, 500), 505, { look: 'old', to: 'left' });
    hide(sisA); hide(sisB); hide(step);
    await say('새엄마와 언니들은 무도회에 갔어요. 신데렐라만 집에 남았어요.');

    /* --- 4. 밤 정원: 요정 할머니 --- */
    await T.sceneCard(tr('밤 정원'), () => {
      scene('garden');
      put(T, cind, X(430, 440), 505, { look: 'cry', to: 'left' });
    }, cind.pos);
    await say('신데렐라는 정원에서 훌쩍훌쩍 울었어요.');
    put(T, fairy, X(580, 570), 480, { look: 'pop', to: 'left' }); fade(fairy, 500);
    await say('그때 요정 할머니가 나타났어요. "울지 마, 내가 도와줄게!" 요정 할머니를 톡!');
    await T.tap(fairy.pos, { prompt: '요정 할머니를 톡! 마법을 부려요.' });
    fairy.look('wave'); popSfx(T); fairy.hop(22, 360);
    await T.cutImage([{ src: cutSrc('fairy'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    await say('요정 할머니가 지팡이를 휘휘! 생쥐들은 하얀 말이 되었어요.');
    await T.cutImage([{ src: cutSrc('horses'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    await say('커다란 호박은 황금 마차가 되었어요!');
    await T.cutImage([{ src: cutSrc('pumpkin'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    await say('신데렐라는 반짝이는 드레스를 입고 유리 구두를 신었어요.');
    await T.cutImage([{ src: cutSrc('dress'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    cind.look('gown'); cind.hop(26, 380); fairy.look('warn'); T.pop(cind.x, cind.y - 270, tr('반짝!')); clinkSfx(T);
    await say('"밤 열두 시 종이 울리면 마법이 풀려요. 서둘러 돌아오렴!"');
    await say('신데렐라는 고개를 끄덕이고 마차를 탔어요.');

    /* --- 5. 무도회 --- */
    await T.sceneCard(tr('무도회'), () => {
      scene('hall');
      put(T, prince, X(600, 565), 505, { look: 'stand', to: 'left' });
      put(T, cind, X(420, 450), 505, { look: 'gown', to: 'right' });
    }, prince.pos);
    await say('궁전에서는 왕자님이 신데렐라에게 인사했어요. "나와 함께 춤춰요!"');
    await say('신데렐라를 톡톡톡 눌러서 함께 춤을 춰 봐요!');
    cind.look('dance'); prince.look('dance', 'left');
    await T.mash(cind.pos, { count: 3, prompt: '신데렐라를 톡톡톡! 함께 춤을 춰요.', onStep: i => {
      cind.hop(24, 360); prince.hop(24, 360); popSfx(T); T.pop((cind.x + prince.x) / 2, cind.y - 270, tr(['빙글!', '팔랑!', '빙글!'][i - 1]));
    } });
    await say('둘은 빙글빙글 춤을 추었어요. 신데렐라는 정말 행복했어요.');

    /* --- 6. 시계탑: 종소리 세기 --- */
    await T.sceneCard(tr('시계탑'), () => {
      scene('tower');
      hide(prince);
      put(T, cind, X(670, 500), 520, { look: 'run', to: 'left', s: X(.85, .62) });
    }, cind.pos);
    await say('그때 시계탑에서 종이 울렸어요. 신데렐라를 톡톡톡톡톡 눌러서 종소리를 세어 봐요!');
    await T.mash(cind.pos, { count: 5, prompt: '신데렐라를 톡톡톡톡톡! 종소리를 세어요.', onStep: i => {
      cind.hop(14, 260); bellSfx(T); T.pop(cind.x, cind.y - 260, tr(NUM[i - 1]));
    } });
    await say('종이 하나, 둘, 셋, 넷, 다섯! 마법이 풀리기 전에 달려야 해요!');

    /* --- 7. 계단: 유리 구두 --- */
    await T.sceneCard(tr('계단'), () => {
      scene('stairs_high');
      put(T, cind, X(520, 520), 340, { look: 'run', to: 'left', s: .5 });
    }, cind.pos);
    const down = cind.move(X(470, 480), 505, 2800, 'ease-in');
    await say('신데렐라는 계단을 후다닥 달려 내려갔어요.');
    await down; hide(cind);
    await T.cutImage([{ src: cutSrc('slipper'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    await say('앗! 유리 구두 한 짝이 계단에 떨어졌어요.');
    put(T, prince, 500, 505, { look: 'slip', to: 'left' }); fade(prince);
    await say('왕자님이 구두를 주웠어요. "이 구두의 주인을 꼭 찾을 거야!"');

    /* --- 8. 구두 찾기 --- */
    await T.sceneCard(tr('구두 찾기'), () => {
      scene('parlor');
      hide(prince);
      put(T, footman, X(620, 575), 505, { to: 'left' });
      put(T, sisA, X(440, 440), 505, { look: 'pose', to: 'right' });
    }, footman.pos);
    await say('다음 날, 시종이 집집마다 구두를 들고 찾아왔어요.');
    await say('신데렐라의 집에도 왔어요. "이 구두가 꼭 맞는 분을 찾아요!"');
    await T.cutImage([{ src: cutSrc('foot'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    await say('언니가 발을 쏙 넣어 보았어요. 하지만 발이 너무 커서 안 들어갔어요.');
    await say('구두가 꼭 맞는 사람은 누굴까요? 앞치마를 입은 신데렐라를 톡!');
    hide(footman); hide(sisA);
    const px = X([360, 500, 640], [425, 510, 595]), hh = X(215, 175);
    put(T, sisA, px[0], 505, { look: 'pose', to: 'left', s: hh / 215 });
    put(T, sisB, px[1], 505, { look: 'pose', to: 'left', s: hh / 220 });
    put(T, cind, px[2], 505, { look: 'old', to: 'left', s: hh / 225 });
    const got = await T.choose([
      { key: 'a', el: sisA.pos, ok: false }, { key: 'b', el: sisB.pos, ok: false }, { key: 'c', el: cind.pos, ok: true }],
      { prompt: '신데렐라를 톡!', where: '앞치마를 입은 친구를 찾아봐요.', who: '앞치마를 입은 신데렐라를 톡!' });
    clinkSfx(T); cind.hop(24, 320);
    await say('구두가 꼭 맞았어요! 모두 깜짝 놀랐어요.');

    /* --- 9. 궁전 정원: 화해 --- */
    await T.sceneCard(tr('궁전 정원'), () => {
      scene('palacegarden');
      hide(sisB);
      const k = P ? .62 : 1;
      put(T, sorry, X(370, 435), 505, { to: 'left', s: k });
      put(T, cind, X(520, 505), 505, { look: 'gown', to: 'left', s: 1 });
      put(T, prince, X(660, 590), 505, { look: 'stand', to: 'left', s: P ? .78 : 1 });
      sisA.pos.style.display = 'none';
    }, cind.pos);
    await say('언니들이 말했어요. "신데렐라, 그동안 미안해!"');
    await say('신데렐라는 웃으며 말했어요. "괜찮아요. 우리 같이 행복해요!"');
    await say('신데렐라를 톡! 모두 함께 만세!');
    await T.tap(cind.pos, { prompt: '신데렐라를 톡! 모두 함께 만세!' });
    T.confetti();
    await Promise.all([cind.hop(40, 500), prince.hop(30, 500), sorry.hop(24, 500)]);
    await say('착한 마음은 행복을 불러와요. 신데렐라 이야기는 이렇게 끝났어요.');
    T.finale();
    return '착한 마음은 행복을 불러와요!';
  }

  Tale.mount({ title: '신데렐라', subtitle: '착한 마음은 행복을 불러와요', run: T => run(Tale.api) });
})();
