/* 신데렐라 — 목업. 부엌일이 많은 신데렐라를 생쥐들과 요정 할머니가 도와주고, 무도회·열두 시 종·유리 구두 끝에 왕자님이 주인을 찾는다.
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. 새엄마와 언니들은 우스꽝스러울 뿐 벌을 받지 않고 끝에 함께 웃는다. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { cind_sweep: .7214, cind_cry: .4829, cind_joy: .5543, cind_surprise: .4871, cind_old: .4643, cind_gown: .75, cind_dance: .7757, cind_run: .7571,
    step_pose: .47, step_wave: .5471, sis1_ribbon: .6214, sis2_ribbon: .4743, sis1_pose: .5871, sis2_pose: .4171, sis_sorry: .9586,
    fairy_pop: .8286, fairy_wave: .8643, fairy_warn: .6986, prince_stand: .4929, prince_dance: .6143, prince_slipper: .5171, footman: .5829, mouse: .8831 };
  const BGS = ['kitchen', 'hearth', 'parlor', 'garden', 'hall', 'terrace', 'stairs_high', 'palacegarden'];
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
      cind.hop(14, 300); popSfx(T); T.pop(cind.x + 20 + [-1, 1, -1][i - 1] * X(100, 60), cind.y - (i === 3 ? 300 : 250), tr(['쓱쓱!', '싹싹!', '깨끗!'][i - 1]));
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
    put(T, cind, X(380, 350), 505, { look: 'cry', to: 'left' });
    const spots = X([[540, 545], [640, 497], [740, 545], [840, 497]], [[445, 555], [510, 470], [575, 555], [640, 470]]), ms = P ? .8 : 1;
    const hitR = X(40, 50) / ms, tags = [];
    mice.forEach((m, i) => {
      put(T, m, spots[i][0], spots[i][1], { to: i % 2 ? 'left' : 'right', s: ms });
      if (!m.hit) m.hit = T.el('circle', { cx: 0, cy: -42, r: hitR, fill: 'transparent' }, m.pos);
      m.hit.setAttribute('r', hitR);
      m.pos.animate([{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], { duration: 400, delay: i * 140, fill: 'backwards' });
      m.idle = m.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }, { transform: 'translateY(0)' }], { duration: 1500 + i * 230, delay: i * 300, iterations: Infinity, easing: 'ease-in-out' });
      m.counted = false;
    });
    await say('그때 생쥐들이 달려왔어요. "우리가 도와줄게!"');
    await say('생쥐를 톡톡톡톡 눌러서 하나씩 세어 봐요!');
    await new Promise(res => {
      let n = 0, last = 0, t1, t2, t3;
      const count = m => {
        if (m.counted) return;
        m.counted = true; n++; m.idle.cancel(); m.pos.classList.remove('armed');
        const i = mice.indexOf(m), [x, y] = spots[i];
        m.hop(22, 300); popSfx(T); T.pop(m.x, m.y - (n % 2 ? 190 : 260), tr(NUM[n - 1]));
        const tg = T.el('g', {}, T.world); tags.push(tg);
        T.el('circle', { cx: x, cy: y - 100 * ms, r: 14, fill: '#FFF3D6', stroke: '#B07A3A', 'stroke-width': 2.5 }, tg);
        const tx = T.el('text', { x, y: y - 100 * ms + 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: '#7A4A1E' }, tg); tx.textContent = n;
        tg.animate([{ opacity: 0, scale: .3 }, { opacity: 1, scale: 1 }], { duration: 260, easing: 'ease-out' });
        if (n >= 4) finish(); else arm();
      };
      const arm = () => {
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
        t2 = setTimeout(() => Narrator.speak(tr('생쥐를 톡톡톡톡! 하나씩 세어요.')), 12000);
        t3 = setTimeout(function auto() { const m = mice.find(q => !q.counted); if (m) { count(m); } }, 20000);
      };
      const offs = mice.map(m => {
        m.pos.classList.add('tap-target', 'armed');
        const on = e => {
          e.stopPropagation(); const t = performance.now(); if (t - last < 120) return; last = t;
          if (m.counted) { m.wiggle(10, 400); AudioFX.tap(); return; }
          count(m);
        };
        m.pos.addEventListener('pointerdown', on);
        return () => { m.pos.removeEventListener('pointerdown', on); m.pos.classList.remove('tap-target', 'armed'); };
      });
      const finish = () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); offs.forEach(f => f()); res(); };
      arm();
    });
    cind.look('joy'); cind.hop(24, 340);
    await say('생쥐가 하나, 둘, 셋, 넷! 모두 같이 청소를 했어요.');
    await say('신데렐라는 방긋 웃었어요. "고마워, 친구들!"');

    /* --- 3. 거실: 리본 언니들 --- */
    await T.sceneCard(tr('거실'), () => {
      scene('parlor');
      mice.forEach(hide); tags.forEach(t => t.remove());
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
    scene('parlor');
    put(T, cind, X(300, 385), 505, { look: 'old', to: 'right', s: P ? .72 : 1 });
    put(T, sisA, X(440, 460), 505, { look: 'ribbon', to: 'right' });
    put(T, sisB, X(660, 570), 505, { look: 'ribbon', to: 'left' });
    const bump = (async () => {
      await sleep(400);
      await Promise.all([sisA.move(X(520, 505), 505, 450), sisB.move(X(570, 525), 505, 450)]);
      popSfx(T); T.shake(); T.pop(X(545, 515), 250, tr('쿵!')); sisA.hop(18, 320); sisB.hop(18, 320);
      await sleep(500); cind.hop(16, 320);
    })();
    await say('쿵! 리본이 너무 커서 언니들이 서로 부딪혔어요. 신데렐라는 킥킥 웃었어요.');
    await bump;
    sisA.turn('right'); sisB.turn('right');
    const leave = Promise.all([sisA.move(X(1150, 760), 505, 1100), sisB.move(X(1230, 830), 505, 1100)]);
    await say('새엄마와 언니들은 무도회에 갔어요. 신데렐라만 집에 남았어요.');
    await leave; hide(sisA); hide(sisB); hide(step);
    cind.look('old', 'left');

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
      cind.hop(24, 360); prince.hop(24, 360); popSfx(T); T.pop((cind.x + prince.x) / 2 + [-1, 1, -1][i - 1] * X(110, 70), cind.y - (i === 2 ? 300 : 270), tr(['빙글!', '팔랑!', '빙글!'][i - 1]));
    } });
    await say('둘은 빙글빙글 춤을 추었어요. 신데렐라는 정말 행복했어요.');

    /* --- 6. 자정: 궁전 계단 위에서 멀리 시계탑의 종소리 세기 (시계를 톡톡톡톡톡, 그다음 계단 화살표를 톡) --- */
    let clock, arrow;
    await T.sceneCard(tr('자정'), () => {
      scene('terrace');
      if (P) camSnap(210, 280, 1); /* 세로 화면은 계단 위 신데렐라와 먼 시계탑이 함께 보이게 왼쪽으로 */
      hide(prince);
      put(T, cind, X(105, 120), 200, { look: 'gown', to: 'right', s: .8 });
      const cr = 25, cx = 266, cy = 121;
      clock = T.el('g', {}, T.world); clock.setAttribute('transform', `translate(${cx},${cy})`);
      const face = T.el('circle', { r: cr, fill: 'none', stroke: '#FFD36B', 'stroke-width': 5, opacity: .85 }, clock); /* 멀리 그려진 시계 둘레를 빛나는 종이 테로 */
      face.style.transformBox = 'fill-box'; face.style.transformOrigin = 'center';
      face.animate([{ opacity: .45 }, { opacity: .95 }, { opacity: .45 }], { duration: 1400, iterations: Infinity, easing: 'ease-in-out' });
      T.el('circle', { r: 48, fill: 'transparent' }, clock); /* 눌리는 곳은 지름 96 */
      clock.face = face;
      clock.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    }, cind.pos);
    await say('그때 시계탑에서 종이 울렸어요. 종을 톡톡톡톡톡 눌러서 종소리를 세어 봐요!');
    const idle = cind.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-7px)' }, { transform: 'translateY(0)' }], { duration: 700, iterations: Infinity, easing: 'ease-in-out' });
    await T.mash(clock, { count: 5, prompt: '종을 톡톡톡톡톡! 종소리를 세어요.', onStep: i => {
      bellSfx(T); T.shake(); T.pop(...(P ? [[270, 215], [240, 235], [300, 225], [255, 205], [285, 240]] : [[390, 60], [450, 120], [390, 170], [470, 50], [420, 100]])[i - 1], tr(NUM[i - 1]));
      clock.face.animate([{ transform: 'scale(1)', strokeWidth: 5 }, { transform: 'scale(1.3)', strokeWidth: 12 }, { transform: 'scale(1)', strokeWidth: 5 }], 480);
      clock.animate([{ translate: '0 0' }, { translate: '-3px 0' }, { translate: '3px 0' }, { translate: '0 0' }], 420);
    } });
    const sayRun = say('종이 하나, 둘, 셋, 넷, 다섯! 마법이 풀리기 전에 달려야 해요!');
    arrow = T.el('g', {}, T.world); arrow.setAttribute('transform', `translate(${X(420, 285)},${X(330, 330)})`);
    const ag = T.el('g', { filter: 'url(#pp)' }, arrow);
    T.el('circle', { r: X(40, 42), fill: '#FFF1D0', stroke: '#E8A93A', 'stroke-width': 5 }, ag);
    T.el('path', { d: `M-16,-14 L0,2 L16,-14 M-16,2 L0,18 L16,2`, fill: 'none', stroke: '#C2552B', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ag);
    T.el('circle', { r: X(48, 50), fill: 'transparent' }, arrow);
    ag.style.transformBox = 'fill-box'; ag.style.transformOrigin = 'center';
    ag.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 900, iterations: Infinity, easing: 'ease-in-out' });
    arrow.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    await sayRun;
    await T.tap(arrow);
    arrow.remove(); clock.remove(); idle.cancel();
    cind.look('run', 'right');
    await cind.move(X(700, 330), 420, 1500, 'ease-in');

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
    { const sx = cind.x - X(80, 62), g = T.el('g', { filter: 'url(#pp)' }, T.world), q = T.el('g', { transform: `translate(${sx} 505) scale(1.7) translate(${-sx} -505)` }, g);
      T.el('path', { d: `M${sx - 24} 505 v-8 q0 -20 10 -26 q6 -4 10 0 q2 14 22 18 q10 3 10 14 v2 z`, fill: '#CDEFFC', stroke: '#6DB7DB', 'stroke-width': 2.5 }, q);
      T.el('path', { d: `M${sx - 18} 492 q2 -12 6 -16`, stroke: '#fff', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, q);
      g.animate([{ transform: 'translateY(-30px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 400, easing: 'ease-out' }); }
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
