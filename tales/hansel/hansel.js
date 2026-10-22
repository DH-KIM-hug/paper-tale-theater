/* 헨젤과 그레텔 — 목업. 산딸기를 따다 길을 잃은 남매가 빵 부스러기는 새가 먹어 버려 과자 집에 닿고,
   과자를 아끼는 심술쟁이 마녀를 꾀로 쫓아낸 뒤 오리의 도움으로 아빠 품에 돌아온다. 무서운 장면 없음(마녀는 놀라서 날아갈 뿐).
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { father: .9727, father_wood: .806, hans_walk: .5838, hans_crumb: .6747, hans_doze: .8791, hans_eat: .5029, hans_cage: .6165,
    hans_joy: .6743, gret_walk: .6396, gret_doze: .7929, gret_eat: .6471, gret_clever: .7404, gret_push: .8225, gret_duck: .7038, gret_key: .7363,
    witch_beckon: .7515, witch_grope: .9245, witch_oven: .8086, bird_peck: 1.2067, bird_crumb: 1.1685, duck_ride: 1.1204, duck_ride2: 1.1275,
    step_stand: .45, step_point: .6833, step_arms: .45, father_worry: .54, prop_pebble: 1.3467, prop_door: .6767 };
  const BGS = ['cottage', 'trail', 'glade', 'ground', 'house', 'roof', 'cage', 'oven', 'river', 'house_night', 'cottage_night'];
  const CUTS = ['bird', 'eat', 'witch', 'slam', 'duck', 'hug', 'pebbles'];
  /* 새로 그리는 그림(엿듣기·조약돌 장면). 파일이 없으면 색 도형+이름표 자리표시, 그림이 생기면 자동으로 바뀐다.
     폭/높이 비율(ASP)은 그림이 오면 그 파일에서 읽는다 — 좌표 맞추기 때 ASP 표에 숫자로 옮긴다 */
  const NEWART = { step_stand: [.55, '#9AA7B5', '새엄마'], step_point: [.8, '#9AA7B5', '새엄마'], step_arms: [.6, '#9AA7B5', '새엄마'],
    father_worry: [.8, '#C98A55', '아빠'], prop_pebble: [1.3, '#F4F6FA', ''], prop_door: [.8, '#6B4A32', '문'],
    bg_house_night: [0, '#5B4332', '집 안 밤'], bg_cottage_night: [0, '#1F2A56', '집 앞 밤'] };
  const has = {}, imgAsp = {}; /* 새 그림이 실제로 있는지, 있으면 폭/높이 */
  const aspOf = f => ASP[f] || imgAsp[f] || (NEWART[f] && NEWART[f][0]) || 1;
  const bgSrc = k => AS + 'hg_bg_' + k + '.webp', cutSrc = k => AS + 'hg_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const INK = '#2E241C';

  let SC = 1; /* 세로 화면(폭이 좁다)에서는 그림을 조금 줄인다 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat, ox = 0]]) => { /* ox: 발이 그림 가운데가 아닐 때 그림을 옮기는 양(폭의 비율) — 자세를 바꿔도 서 있는 자리가 그대로 */
        const w = h * aspOf(f), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        if (NEWART[f] && !has[f]) { /* 그림 도착 전 자리표시 */
          T.el('rect', { x: -w / 2, y: -h, width: w, height: h, rx: Math.min(12, h / 4), fill: NEWART[f][1], opacity: .92 }, wrap);
          if (h > 40) T.el('text', { x: 0, y: -h / 2, 'text-anchor': 'middle', 'font-size': Math.round(h * .1), fill: INK }, wrap).textContent = NEWART[f][2];
        } else T.el('image', { href: AS + 'hg_' + f + '.webp', x: -w / 2 + ox * w, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
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
    if (NEWART['bg_' + key] && !has['bg_' + key]) { /* 새 배경 도착 전 자리표시 */
      const g = T.el('g', {}, T.bg);
      T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: NEWART['bg_' + key][1] }, g);
      T.el('text', { x: 500, y: 200, 'text-anchor': 'middle', 'font-size': 40, fill: '#F6ECD8' }, g).textContent = NEWART['bg_' + key][2];
      return g;
    }
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const REST = 700; /* 장면 끝 쉼(ms) — 빠른 전환을 원하는 의견이 있어 1.5초를 넘기지 않는다 (2026-10-22) */
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!'];

  async function run(T) {
    const { sleep, say, camSnap } = T;
    const fx = document.getElementById('fxL'); if (fx) fx.style.pointerEvents = 'none'; /* 말풍선·효과 글자는 누름을 받지 않는다 */
    const tr = T.tr;
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 좁은 폭만 보인다 */
    SC = P ? .8 : 1;
    const scene = (key, cx = 500) => { T.clear(); bgImage(T, key); camSnap(cx, 280, 1); };
    const L = (l, p) => (P ? p : l); /* 가로 값, 세로 값 */

    /* 종이로 오린 작은 그림들 (눈 없는 것만) */
    const crumbAt = (x, y) => {
      const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, T.world);
      T.el('ellipse', { cx: x, cy: y, rx: 13, ry: 9, fill: '#F3DFA8' }, g);
      T.el('ellipse', { cx: x - 3, cy: y - 2, rx: 6, ry: 3.5, fill: '#FFF3CD' }, g);
      g.animate([{ transform: 'translateY(-26px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 260, easing: 'ease-out' });
      return g;
    };
    const CANDY = ['#E26D6D', '#F3C969', '#6FA8DC'];
    const candyAt = (x, y, i) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world), c = CANDY[i % 3], r = 16;
      if (i % 2 === 0) { T.el('circle', { cx: x, cy: y, r, fill: c }, g); T.el('circle', { cx: x - 4, cy: y - 4, r: 6, fill: '#fff', opacity: .45 }, g); }
      else { T.el('polygon', { points: `${x},${y - r} ${x + r * 1.1},${y + r * .8} ${x - r * 1.1},${y + r * .8}`, fill: c }, g); T.el('circle', { cx: x - 3, cy: y + 2, r: 4, fill: '#fff', opacity: .45 }, g); }
      return g;
    };
    const STAR = (x, y, R) => Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? R * .45 : R; return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`; }).join(' ');
    /* 조약돌 반짝: 크림 별 하나가 깜빡 (그라데이션·글로우 없음). loop 면 계속, 아니면 한 번 */
    const sparkleAt = (x, y, delay = 0, loop = true) => {
      const p = T.el('polygon', { points: STAR(x + 6, y - 14, 7), fill: '#F6ECD8', opacity: 0 }, T.world);
      p.style.pointerEvents = 'none';
      p.animate([{ opacity: 0 }, { opacity: .9, offset: .5 }, { opacity: 0 }], { duration: 1100, delay, iterations: loop ? Infinity : 1, fill: 'both' });
      if (!loop) setTimeout(() => p.remove(), 1300 + delay);
      return p;
    };
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

    /* 새 그림이 있는지 먼저 확인(없으면 바로 404 라 오래 안 걸린다) */
    await Promise.all(Object.keys(NEWART).map(async f => {
      const src = f.startsWith('bg_') ? bgSrc(f.slice(3)) : AS + 'hg_' + f + '.webp', pr = T.preload(src);
      if (await pr) { has[f] = true; imgAsp[f] = pr.img.naturalWidth / pr.img.naturalHeight; }
    }));
    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    /* 크기(CLAUDE.md §4-1, 2026-10-22 실측): 눈 조각 넓이의 제곱근 × 화면 높이 ÷ 그림 몸 높이 = 화면 눈 크기를 사람 모두 4.7 로 맞춘다
       (아빠 wood 240 기준. hans_crumb 는 그림 속 머리가 walk 보다 1.28배 커서 200 → 177, 계모 3자세 252, 아빠 worry 245) */
    const hans = mk(T, { walk: ['hans_walk', 200, 'right'], crumb: ['hans_crumb', 177, 'right'], doze: ['hans_doze', 175, 'left'], eat: ['hans_eat', 200, 'left'],
      cage: ['hans_cage', 395, 'left'], joy: ['hans_joy', 200, 'left'] });
    const gret = mk(T, { walk: ['gret_walk', 190, 'right'], doze: ['gret_doze', 170, 'left'], eat: ['gret_eat', 190, 'left'], clever: ['gret_clever', 195, 'left'],
      push: ['gret_push', 195, 'right'], key: ['gret_key', 195, 'left'] });
    const father = mk(T, { wood: ['father_wood', 240, 'right'], hug: ['father', 240, 'left'], worry: ['father_worry', 245, 'left'] });
    const step = mk(T, { stand: ['step_stand', 252, 'right'], point: ['step_point', 252, 'right', .16], arms: ['step_arms', 252, 'right'] });
    /* 배경 hg_bg_house_night 의 문틀(세계 좌표): 왼쪽 기둥 853~891, 문 구멍 위 18, 문간 바닥 378. 문짝은 오른쪽(화면 밖)에 경첩, 왼쪽 가장자리 935 까지 닫혀 문틈이 생긴다 */
    const DOOR = { post: 853, open: 891, top: 18, sill: 378, edge: 935 };
    const door = prop(T, 'prop_door', DOOR.sill - DOOR.top, 'right');
    const pebbles = [0, 1, 2, 3, 4].map(() => prop(T, 'prop_pebble', 18, 'right')); /* 다섯 개 모두 같은 크기 (원근 축소 없음) */
    [door, ...pebbles].forEach(p => { p.pos.style.pointerEvents = 'none'; }); /* 소품은 누름을 받지 않는다 */
    const witch = mk(T, { beckon: ['witch_beckon', 270, 'left'], grope: ['witch_grope', 260, 'right'], oven: ['witch_oven', 255, 'left'] });
    const bird = mk(T, { crumb: ['bird_crumb', 80, 'left'], peck: ['bird_peck', 70, 'left'] });
    const duck = mk(T, { a: ['duck_ride', 135, 'right'], b: ['duck_ride2', 135, 'right'] });

    /* --- 1. 집 안 밤: 문틈으로 엿듣기 --- */
    scene('house_night', L(500, 790)); /* 세로 화면은 오른쪽 끝(문틀)까지 보이게 */
    put(T, step, L(330, 640), GROUND, { look: 'stand', to: 'right' }); /* 계모 ↔ 아빠 마주 봄 */
    put(T, father, L(560, 775), GROUND, { look: 'worry', to: 'left' });
    /* 문틈 빛 띠: 문 구멍 위에서 문간 바닥까지(떠 있지 않게), 기둥과 문짝 사이 틈에만 */
    T.el('rect', { x: DOOR.open, y: DOOR.top, width: DOOR.edge - DOOR.open, height: DOOR.sill - DOOR.top, fill: '#F2B366', opacity: .16, 'pointer-events': 'none' }, T.world); /* 등잔 빛(앰버) */
    /* 헨젤은 문 너머 방(벽 면, 조금 멀어 .9)에 서서 왼쪽 어른들을 본다 — 얼굴 앞쪽만 틈에 보이고 뒤통수·몸 뒤는 문짝에 가린다 */
    put(T, hans, DOOR.edge - 17, DOOR.sill, { look: 'walk', to: 'left', s: .9 });
    { /* 왼쪽 기둥을 배경에서 오려 헨젤 앞에 다시 얹는다(헨젤이 기둥 앞으로 튀어나오지 않게) */
      const defs = T.el('defs', {}, T.world), cp = T.el('clipPath', { id: 'hgPost', clipPathUnits: 'userSpaceOnUse' }, defs);
      T.el('rect', { x: DOOR.post, y: DOOR.top - 40, width: DOOR.open - DOOR.post, height: DOOR.sill + 20 - DOOR.top + 40 }, cp);
      T.el('image', { href: bgSrc('house_night'), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none', 'clip-path': 'url(#hgPost)', 'pointer-events': 'none' }, T.world);
    }
    put(T, door, DOOR.edge + (DOOR.sill - DOOR.top) * aspOf('prop_door') / 2, DOOR.sill, { to: 'left', s: 1 / SC }); /* 배경 문틀에 맞춘 크기라 세로 화면에서도 줄이지 않는다. 손잡이는 틈 쪽 */
    await T.curtain(true);
    await say('옛날 옛날에 숲 옆 작은 집에 헨젤과 그레텔이 살았어요.');
    await say('그런데 집에는 먹을 것이 점점 떨어져, 찬장이 텅텅 비었지요.');
    await say('헨젤과 그레텔은 밤마다 배가 꼬르륵꼬르륵 울었어요.');
    await say('어느 날 밤, 헨젤은 문틈으로 엿들었어요.');
    step.look('point'); step.hop(8, 300);
    await say('"먹을 게 없어요. 내일 아이들을 숲에 두고 와요." 새엄마가 말했어요.');
    step.look('arms'); father.hop(6, 300);
    await say('"음… 아이들이 가엾은데…" 아빠는 망설였어요.');
    await sleep(300); hans.hop(6, 260); /* 헨젤이 깜짝 — 들었어요 */
    await say('헨젤은 가슴이 콩닥콩닥 뛰었어요. 그래도 꼭 참고 생각했지요.');
    hans.hop(6, 260);
    await say('"그래, 좋은 생각이 났어!" 헨젤이 작게 속삭였어요.');
    await sleep(300);

    /* --- 2. 달빛 조약돌: 톡 한 번으로 조약돌 다섯 개가 저절로 --- */
    const PX = L([520, 575, 630, 690, 750], [470, 520, 570, 620, 660]);
    T.cardSpeed(.7); /* 첫 조작을 30초 안에 */
    await T.sceneCard(tr('달빛 조약돌'), () => {
      scene('cottage_night');
      put(T, hans, L(430, 400), GROUND, { look: 'crumb', to: 'right' });
      pebbles.forEach((p, i) => put(T, p, PX[i], GROUND, { to: 'right' }));
    }, hans.pos);
    T.cardSpeed(1);
    const glints = pebbles.map((p, i) => sparkleAt(PX[i], GROUND, i * 300));
    await say('헨젤은 살금살금 밖으로 나왔어요. 달빛에 조약돌이 반짝반짝!');
    await T.ask('헨젤을 톡! 조약돌을 주워요.', () => T.tap(hans.pos, { prompt: '헨젤을 톡! 조약돌을 주워요.' })); /* 안내 도중에도 눌린다 (첫 조작 30초 안) */
    hans.hop(10, 240); glints.forEach(g => g.remove());
    const picking = say('헨젤은 하얀 조약돌을 하나, 또 하나, 주머니에 쏙쏙 넣었어요.'); /* 조약돌이 날아드는 동안 읽는다 */
    await Promise.all(pebbles.map(async (p, i) => {
      await sleep(i * 180);
      await p.move(hans.x - 6 * SC, hans.y - 62 * SC, 320, 'ease-in'); /* 반바지 주머니 자리 */
      hide(p); popSfx(T);
    }));
    T.pop(hans.x + 40, hans.y - 265, tr('쏙!')); /* 머리 위로 비켜서(얼굴을 가리지 않게) */
    await picking;
    hans.turn('left'); /* 집 쪽으로 돌아선다 */
    await sleep(500);
    await say('헨젤은 조약돌을 주머니에 가득 채웠어요. "이제 괜찮아."');
    hans.look('walk', 'left'); await hans.move(hans.x - L(150, 90), GROUND, 1200); /* 살금살금 집으로 (가는 쪽을 본다) */
    await sleep(300);

    /* --- 3. 조약돌 길: 조약돌을 떨어뜨리고, 밤에 달빛을 따라 돌아와요 --- */
    await T.sceneCard(tr('조약돌 길'), () => {
      scene('trail');
      put(T, father, L(180, 355), GROUND, { look: 'wood', to: 'right', s: P ? .9 : 1 });
      put(T, gret, L(330, 440), GROUND, { look: 'walk', to: 'right' });
      put(T, hans, L(450, 520), GROUND, { look: 'crumb', to: 'right' });
    }, hans.pos);
    await say('다음 날, 아빠는 둘을 데리고 숲 깊은 곳으로 갔어요.');
    const walkIn = Promise.all([father, gret, hans].map(a => a.move(a.x + L(40, 10), GROUND, 1600))); /* 뚜벅뚜벅 — 조금만 더 걸어도 다섯 걸음 뒤 셋 다 화면 안 */
    await say('뚜벅뚜벅, 셋은 숲속 깊이 들어갔어요. 나뭇잎이 바스락바스락 소리를 냈지요.');
    await walkIn;
    const dropAuto = (async () => {
      const dx = L(60, 25); /* 다섯 걸음 뒤에도 셋 다 화면 안 */
      for (let i = 0; i < 5; i++) {
        const px = hans.x - 34 * SC; /* 헨젤 발 뒤, 길 위 */
        put(T, pebbles[i], px, GROUND + 12, { to: 'right' }); fadeIn(pebbles[i], 260);
        sparkleAt(px, GROUND + 12, 0, false); popSfx(T); T.pop(px, i % 2 ? 120 : 95, tr('반짝!')); /* 머리 위 하늘(인물을 가리지 않게) */
        hans.hop(8, 220);
        await Promise.all([father.move(father.x + dx, GROUND, 400), gret.move(gret.x + dx, GROUND, 400), hans.move(hans.x + dx, GROUND, 400)]);
        await sleep(450);
      }
    })();
    await say('헨젤은 조약돌을 하나씩 살짝 떨어뜨렸어요.');
    await dropAuto;
    hans.look('walk', 'right');
    const leave = father.move(1150, GROUND, 2600);
    await say('아빠는 둘을 숲에 남겨 두고 돌아갔어요.');
    await leave;
    /* 둘러보기: 아빠가 안 보여요 — 뒤(왼쪽)를 봤다가 다시 앞으로 */
    await sleep(300); hans.turn('left'); gret.turn('left'); await sleep(800); hans.turn('right'); gret.turn('right'); await sleep(400);
    gret.hop(10, 260);
    await say('"아빠? 아빠!" 그레텔이 불러 봤지만, 숲은 조용했어요.');
    /* 밤: 컷 위에서 읽는다 (그림이 없으면 밤 집 앞 장면에서 읽는다) */
    const N11 = '밤이 되자 조약돌이 달빛에 반짝반짝 빛났어요. 둘은 조약돌을 따라 집으로 돌아왔어요.';
    const N11b = '"저기 우리 집이야!" 헨젤이 소리쳤어요. 그레텔은 폴짝폴짝 뛰었지요.';
    if (await T.preload(cutSrc('pebbles'))) {
      const cp = document.getElementById('cutPanel'); let sp;
      await T.cutImage([{ src: cutSrc('pebbles'), sfx: 'pop', hold: 60000 }], { hold: 60000, onShow: () => {
        sp = say(N11).then(() => say(N11b)).then(() => sleep(500)).then(() => { if (cp.onpointerdown) cp.onpointerdown({ stopPropagation() {} }); });
      } });
      await sp;
    } else {
      scene('cottage_night');
      put(T, gret, L(300, 400), GROUND, { look: 'walk', to: 'right' }); put(T, hans, L(380, 440), GROUND, { look: 'walk', to: 'right' });
      const home = Promise.all([gret.move(L(520, 520), GROUND, 4000), hans.move(L(600, 570), GROUND, 4000)]);
      await say(N11); await home; gret.hop(14, 300); await say(N11b);
    }

    /* --- 4. 집 앞: 또 숲에 가요 --- */
    await T.sceneCard(tr('집 앞'), () => {
      scene('cottage');
      put(T, step, L(200, 345), GROUND, { look: 'stand', to: 'right' }); /* 집 문 옆에서 아이들을 본다 */
      put(T, gret, L(340, 430), GROUND, { look: 'walk', to: 'right' });
      put(T, hans, L(440, 515), GROUND, { look: 'walk', to: 'right' });
      put(T, father, L(560, 625), GROUND, { look: 'wood', to: 'right', s: P ? .9 : 1 });
    }, hans.pos);
    await say('하지만 얼마 뒤, 새엄마가 또 아이들을 숲에 두고 오자고 했어요.');
    await say('이번엔 밤에 문이 잠겨서, 조약돌을 주울 수 없었어요.');
    await say('"얘들아, 숲에 산딸기 따러 가자!" 아빠가 말했어요.');
    await say('헨젤은 빵 부스러기로 길을 표시하기로 했어요.');
    popSfx(T); hans.hop(20, 300);
    await Promise.all([gret.move(gret.x + 50, GROUND, 900), hans.move(hans.x + 50, GROUND, 900), father.move(father.x + 50, GROUND, 900)]);

    /* --- 2. 숲길: 빵 부스러기 세기 --- */
    await T.sceneCard(tr('숲길'), () => {
      scene('trail');
      put(T, gret, L(250, 400), GROUND, { look: 'walk', to: 'right' });
      put(T, hans, L(330, 430), GROUND, { look: 'crumb', to: 'right' });
    }, hans.pos);
    const stepX = L(110, 36);
    let hx = hans.x, gx = gret.x;
    await T.ask('헨젤이 빵 부스러기를 하나씩 떨어뜨려요. 같이 세어 봐요!', () => T.mash(hans.pos, { count: 5, prompt: '헨젤을 톡톡톡톡톡! 부스러기를 세어요.', onStep: i => {
      const cx = hx - 14;
      crumbAt(cx, 520); popSfx(T); T.pop(cx, i % 2 ? 260 : 200, tr(NUM[i - 1]));
      hx += stepX; gx += stepX;
      hans.hop(10, 220); hans.move(hx, GROUND, 360); gret.move(gx, GROUND, 360);
    } }));
    await say('빵 부스러기가 하나, 둘, 셋, 넷, 다섯! 길이 생겼어요.');
    await say('부스러기가 콩콩, 길게 줄을 이었지요.');

    /* --- 3. 빈터: 졸려서 잠들고 길을 잃어요 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('빈터'), () => {
      scene('glade');
      put(T, hans, L(430, 445), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(540, 555), GROUND, { look: 'walk', to: 'left' });
    }, hans.pos);
    [L(330, 392), L(680, 612)].forEach(bx => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world);
      T.el('ellipse', { cx: bx, cy: GROUND - 22, rx: 54, ry: 30, fill: '#5E8A3E' }, g); T.el('ellipse', { cx: bx - 12, cy: GROUND - 32, rx: 30, ry: 16, fill: '#76A24D' }, g);
      [[-30, -20], [-12, -34], [8, -18], [26, -32], [38, -14], [-4, -8], [16, -4], [-36, -4]].forEach(([dx, dy]) => { T.el('circle', { cx: bx + dx, cy: GROUND + dy, r: 7, fill: '#D93A3A' }, g); T.el('circle', { cx: bx + dx - 2, cy: GROUND + dy - 2, r: 2, fill: '#fff', opacity: .55 }, g); });
      g.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    });
    put(T, hans, L(430, 445), GROUND, { look: 'eat', to: 'right' }); put(T, gret, L(540, 555), GROUND, { look: 'eat', to: 'left' });
    const eating = (async () => { await sleep(900); hans.hop(14, 300); gret.hop(14, 300); await sleep(900); hans.hop(14, 300); gret.hop(14, 300); })();
    await say('빈터에는 빨간 산딸기가 가득했어요. 둘은 냠냠 따 먹었어요.');
    await eating;
    await say('아삭아삭, 새콤달콤! 손가락이 빨갛게 물들었어요.');
    gret.hop(12, 300);
    await say('"오빠, 이것도 먹어 봐!" 그레텔이 제일 큰 산딸기를 건넸어요.');
    hans.hop(12, 300);
    await say('배가 부르니 졸려서 둘은 나무 밑에서 깜빡 잠이 들었어요.');
    put(T, hans, L(430, 445), GROUND + 6, { look: 'doze' }); put(T, gret, L(540, 555), GROUND + 6, { look: 'doze' });
    await sleep(900);
    await say('눈을 떠 보니 아빠가 보이지 않았어요. 둘은 길을 잃었어요.');
    put(T, hans, L(430, 445), GROUND, { look: 'walk', to: 'right' }); put(T, gret, L(540, 555), GROUND, { look: 'walk', to: 'left' });
    await say('그레텔은 마음이 조금 무서웠어요.');
    await say('"오빠, 무서워…" 그레텔이 헨젤의 손을 꼭 잡았어요.');
    await sleep(700); /* 저절로 */
    popSfx(T); gret.hop(14, 300); hans.move(gret.x - L(46, 40), GROUND, 420); T.pop(gret.x, gret.y - 215, tr('꼭!'));
    [-26, 0, 26].forEach((dx, k) => { const h = T.el('path', { d: 'M0 8 C-14 -4 -12 -16 0 -9 C12 -16 14 -4 0 8 Z', fill: '#E8607A', 'pointer-events': 'none', transform: `translate(${gret.x + dx - 22},${gret.y - 150})` }, T.world);
      h.animate([{ translate: '0 0', opacity: 0 }, { opacity: 1, offset: .2 }, { translate: `${dx / 2}px -60px`, opacity: 0 }], { duration: 1100, delay: k * 140, easing: 'ease-out', fill: 'both' }); setTimeout(() => h.remove(), 1600); });
    await say('"괜찮아, 빵 부스러기 길을 따라가자!" 헨젤이 말했어요.');

    /* --- 4. 땅바닥: 새가 부스러기를 먹었어요 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('숲 바닥'), () => {
      scene('ground');
      put(T, hans, L(400, 425), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(490, 500), GROUND, { look: 'walk', to: 'right' });
    }, hans.pos);
    await say('그런데 이상해요. 빵 부스러기가 하나도 없어요!');
    hans.turn('left'); /* 두리번두리번 — 헨젤은 뒤쪽, 그레텔은 앞쪽 */
    await say('둘은 두리번두리번, 땅바닥을 샅샅이 살폈어요.');
    hans.turn('right');
    put(T, bird, L(640, 590), GROUND + 10, { look: 'crumb', to: 'left' }); fadeIn(bird);
    await say('작은 새가 빵 부스러기를 물고 있어요.');
    await sleep(700); /* 저절로 */
    bird.hop(18, 300); AudioFX.sfx('squeak') || popSfx(T); T.pop(bird.x, bird.y - 110, tr('짹짹!'));
    await T.cutImage([{ src: cutSrc('bird'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    scene('ground');
    put(T, hans, L(400, 425), GROUND, { look: 'walk', to: 'right' }); put(T, gret, L(490, 500), GROUND, { look: 'walk', to: 'right' });
    put(T, bird, L(640, 590), GROUND + 10, { look: 'peck', to: 'left' });
    await say('"짹짹! 맛있어서 내가 다 먹었어!" 새가 말했어요.');
    gret.hop(12, 300);
    await say('"아이고, 우리 길이 없어졌네!" 그레텔이 울상을 지었어요.');
    const flyOff = bird.move(bird.x + L(140, 60), 150, 1000).then(() => hide(bird)); /* 포르르 — 오른쪽 위 하늘로 */
    await say('새는 포르르, 하늘로 날아가 버렸어요.');
    await flyOff;
    await say('헨젤은 눈물이 글썽했지만 그레텔의 손을 꼭 잡고 걸었어요.');

    /* --- 5. 과자 집 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('과자 집'), () => {
      scene('house');
      put(T, hans, L(400, 440), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(500, 540), GROUND, { look: 'walk', to: 'right' });
    }, gret.pos);
    await say('그때 달콤한 냄새가 솔솔 났어요. 앗, 과자 집이에요!');
    await say('벽은 쿠키, 지붕은 사탕이에요.');
    await sleep(700); /* 저절로 냠냠 */
    gret.look('eat'); hans.look('eat'); AudioFX.sfx('chomp') || popSfx(T); gret.hop(16, 300); T.pop(gret.x, gret.y - 215, tr('냠냠!'));
    await T.cutImage([{ src: cutSrc('eat'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    hans.hop(12, 300); setTimeout(() => gret.hop(12, 300), 500);
    await say('헨젤은 쿠키 벽을 와삭, 그레텔은 사탕 지붕을 오도독 깨물었어요.');
    await say('너무 맛있어서 둘은 배가 빵빵해졌어요.');

    /* --- 6. 지붕: 사탕 세기 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('지붕'), () => {
      scene('roof');
      put(T, gret, L(390, 420), GROUND, { look: 'eat', to: 'left' });
      put(T, hans, L(500, 520), GROUND, { look: 'walk', to: 'left' });
    }, hans.pos);
    /* 지붕 그림의 빈 구멍 다섯 곳(세계 좌표): 위 줄 넷, 아래 한 곳 */
    const HOLES = [[446, 108], [502, 108], [557, 108], [623, 108], [535, 150]];
    const holeRing = HOLES.map(([x, y]) => T.el('circle', { cx: x, cy: y, r: 18, fill: 'none', stroke: '#FFD54F', 'stroke-width': 3, 'stroke-dasharray': '5 4', opacity: .0 }, T.world));
    holeRing.forEach(c => c.animate([{ opacity: .35 }, { opacity: .95 }, { opacity: .35 }], { duration: 1200, iterations: Infinity }));
    await T.ask('지붕에 사탕이 빠진 곳이 있어요. 헨젤이 하나씩 붙여 줘요. 같이 세어 봐요!', () => T.mash(hans.pos, { count: 5, prompt: '헨젤을 톡톡톡톡톡! 사탕을 세어요.', onStep: i => {
      try { Narrator.hideBubble(); } catch (e) { /* 자막이 지붕 사탕 자리를 가리지 않게 누르는 동안은 숨긴다 */ }
      const [x, y] = HOLES[i - 1], sx = hans.x, sy = hans.y - 150, c = candyAt(0, 0, i - 1);
      holeRing[i - 1].remove();
      c.animate([{ transform: `translate(${sx}px,${sy}px) scale(.4)` }, { transform: `translate(${x}px,${y}px) scale(1)` }], { duration: 480, easing: 'ease-out', fill: 'forwards' });
      hans.hop(12, 240); popSfx(T); setTimeout(() => T.pop(x + 34, y + 44, tr(NUM[i - 1])), 400);   /* 숫자는 사탕 오른쪽 아래(사탕을 가리지 않게) */
    } }));
    await say('사탕이 하나, 둘, 셋, 넷, 다섯! 지붕이 예뻐졌어요.');

    /* --- 7. 마녀 할머니 --- */
    await sleep(REST); /* 장면 끝 쉼 */
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
    witch.hop(10, 260); setTimeout(() => witch.hop(10, 260), 400); /* 발을 쿵쿵 */
    await say('"내 사탕! 내 쿠키! 으으, 아까워라!" 마녀는 발을 쿵쿵 굴렀어요.');
    await say('"죄송해요. 배가 너무 고팠어요." 헨젤이 작은 목소리로 말했어요.');
    hans.look('cage'); hans.place(hans.x, GROUND); hans.setScale(.55 * SC); hans.hop(14, 320); popSfx(T);
    await say('마녀는 헨젤을 새장에 쏙 넣어 버렸어요. "과자 값을 낼 때까지 여기 있어!"');
    gret.hop(10, 260);
    await say('그레텔은 눈물이 그렁그렁했어요. "오빠, 내가 꼭 꺼내 줄게!"');

    /* --- 8. 새장: 별 열쇠 고르기 --- */
    const CX = L(500, 215);
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('새장'), () => {
      scene('cage', CX);
      put(T, hans, 140, 490, { look: 'cage', to: 'left', s: 1 });
      put(T, gret, L(340, 300), GROUND, { look: 'clever', to: 'left' });
    }, hans.pos);
    hans.setScale(SC); /* 새장 그림 하나를 배경의 새장 자리에 맞춘다 */
    const lock = lockAt(L(231, 209), 357);
    await say('그레텔은 마녀가 낮잠을 자는 사이에 열쇠 세 개를 가져왔어요.');
    const kc = keyAt(L(470, 160), 440, 'circle'), ks = keyAt(L(570, 225), 440, 'square'), kt = keyAt(L(670, 290), 440, 'star');
    const keys = [kc, ks, kt];
    keys.forEach(k => k.animate([{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'translateY(0)' }], 350));
    await say('동그라미, 세모, 별 모양. 그레텔은 자물쇠 구멍을 요리조리 살펴보았어요.');
    await T.ask('새장 자물쇠에는 별 모양 구멍이 있어요. 별 모양 열쇠를 톡!', () => T.choose([{ key: 'c', el: kc, ok: false }, { key: 's', el: ks, ok: false }, { key: 't', el: kt, ok: true }],
      { prompt: '별 모양 열쇠를 톡!', where: '열쇠 머리 모양을 잘 봐요.', who: '반짝이는 별 열쇠를 톡!' }));
    clinkSfx(T); kc.remove(); ks.remove(); kt.remove();
    gret.look('key'); gret.hop(14, 300); T.pop(L(251, 224), L(170, 317), tr('찰칵!'));
    await sleep(500);
    lock.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
    put(T, hans, L(250, 215), GROUND, { look: 'joy', to: 'left' });
    hans.hop(34, 420);
    await say('찰칵! 새장이 열렸어요. 헨젤이 폴짝 뛰어나왔어요!');
    await say('"고마워, 그레텔!" 헨젤이 말했어요.');

    /* --- 9. 화덕: 꾀로 마녀를 쫓아요 --- */
    await sleep(REST); /* 장면 끝 쉼 */
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
    const stride = witch.move(witch.x - L(40, 20), GROUND, 900); /* 성큼성큼 화덕 쪽으로 */
    await say('"반짝이는 거? 어디, 어디?" 마녀는 화덕 쪽으로 성큼성큼 갔어요.');
    await stride;
    witch.look('oven', 'left'); witch.hop(10, 300);
    await T.ask('마녀가 화덕 안을 들여다봐요. 그레텔을 톡! 화덕 문을 쾅 밀어요.', () => T.tap(gret.pos, { prompt: '그레텔을 톡! 쾅 밀어요.' }));
    gret.look('push', 'right'); AudioFX.sfx('boom', 1); AudioFX.sfx('crash'); T.shake(); T.pop(L(500, 500), 330, tr('쾅!')); /* 2026-10-20 쾅 소리 */
    await T.cutImage([{ src: cutSrc('slam'), sfx: 'boom', hold: 3200 }], { hold: 3200 });
    await say('쾅! 마녀는 깜짝 놀라 모자가 휙 날아갔어요.');
    scene('oven');
    put(T, hans, L(300, 380), GROUND, { look: 'joy', to: 'right' }); put(T, gret, L(440, 480), GROUND, { look: 'clever', to: 'right' });
    if (P) hide(hans);
    await say('마녀는 빗자루를 타고 굴뚝으로 휘리릭 날아갔어요. "다시는 안 올게~!"');
    AudioFX.sfx('whoosh'); T.pop(L(500, 500), 300, tr('휘리릭!'));
    gret.hop(24, 400); hans.hop(24, 400);
    await say('"휴, 이제 집으로 가자!" 헨젤이 그레텔의 손을 잡았어요.');

    /* --- 10. 강: 오리의 등 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('강'), () => {
      scene('river');
      put(T, hans, L(380, 420), GROUND + 12, { look: 'walk', to: 'right' });
      put(T, gret, L(470, 490), GROUND + 12, { look: 'walk', to: 'right' });
    }, hans.pos);
    await say('집으로 가는 길에 넓은 강이 나왔어요. 다리가 없어요!');
    await say('강물이 콸콸, 세차게 흘렀어요.');
    gret.hop(10, 260); setTimeout(() => gret.hop(10, 260), 400); /* 발을 동동 */
    await say('"어떡하지? 우리는 헤엄을 못 치는데." 그레텔이 발을 동동 굴렀어요.');
    put(T, duck, L(820, 640), 470, { look: 'a', to: 'left' }); fadeIn(duck);
    await duck.move(L(640, 570), 470, 1100);
    await say('그때 흰 오리가 헤엄쳐 왔어요.');
    await sleep(700); /* 저절로 */
    duck.look('b'); duck.hop(14, 300); AudioFX.sfx('squeak') || popSfx(T); T.pop(duck.x, duck.y - 150, tr('꽥꽥!'));
    await T.cutImage([{ src: cutSrc('duck'), sfx: 'pop', hold: 3400 }], { hold: 3400 });
    scene('river');
    put(T, duck, L(640, 570), 470, { look: 'b', to: 'left' });
    put(T, hans, L(380, 420), GROUND + 12, { look: 'walk', to: 'right' }); put(T, gret, L(470, 490), GROUND + 12, { look: 'walk', to: 'right' });
    await say('"꽥꽥! 내 등에 타!" 오리가 말했어요.');
    const cross = (async () => {
      put(T, hans, hans.x, hans.y, { look: 'walk', to: 'right' }); put(T, gret, gret.x, gret.y, { look: 'walk', to: 'right' });
      await Promise.all([hans.move(duck.x - 22, GROUND + 12, 700), gret.move(duck.x + 22, GROUND + 12, 700)]);
      hans.setScale(.55 * SC); gret.setScale(.55 * SC); hans.place(hans.x, 428); gret.place(gret.x, 428);
      const tx = L(780, 600);
      duck.turn('right'); // 가는 쪽(오른쪽)을 본다
      await Promise.all([duck.move(tx, 330, 2600), hans.move(tx - 22, 290, 2600), gret.move(tx + 22, 290, 2600)]);
      await Promise.all([hans.move(tx - 22 + 50, 250, 700), gret.move(tx + 22 + 50, 250, 700)]);
    })();
    await say('둘은 오리 등에 폴짝 올라탔어요. 오리는 둥실둥실 강을 건넜지요.');
    await say('오리가 둘을 태우고 강을 건너 주었어요. "고마워, 오리야!"');
    await cross;

    /* --- 11. 우리 집: 아빠와 만나요 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('우리 집'), () => {
      scene('cottage');
      put(T, hans, L(660, 580), GROUND, { look: 'walk', to: 'left' });
      put(T, gret, L(740, 625), GROUND, { look: 'walk', to: 'left' });
      put(T, father, L(300, 400), GROUND, { look: 'hug', to: 'right' });
    }, hans.pos);
    await say('저 멀리 집이 보여요. 아빠가 숲에서 둘을 애타게 찾고 있었어요.');
    const runAhead = gret.move(gret.x - L(120, 50), GROUND, 900); /* 그레텔이 먼저 아빠 쪽으로 */
    await say('"아빠다! 아빠!" 그레텔이 먼저 달려갔어요.');
    await runAhead;
    await father.move(L(450, 480), GROUND, 800);
    await say('"헨젤! 그레텔!" 아빠가 달려왔어요.');
    await sleep(700); /* 저절로 */
    popSfx(T); father.hop(20, 300);
    await T.cutImage([{ src: cutSrc('hug'), sfx: 'pop', hold: 3600 }], { hold: 3600 });
    scene('cottage');
    put(T, father, 500, GROUND, { look: 'hug', to: 'left' });
    put(T, hans, L(400, 440), GROUND, { look: 'joy', to: 'left' }); put(T, gret, L(600, 565), GROUND, { look: 'clever', to: 'left' });
    await say('"찾았다! 보고 싶었어!" 아빠가 말했어요.');
    hans.hop(10, 300);
    await say('"아빠, 다시는 우리를 두고 가지 마세요." 헨젤이 말했어요.');
    father.hop(10, 300);
    await say('"그래, 다시는 안 그럴게. 약속할게." 아빠가 두 아이를 꼭 안았어요.');
    await T.ask('헨젤과 그레텔은 마음이 따뜻하고 행복했어요. 여러분은 기분이 어때요? 헨젤을 톡! 만세!', () => T.tap(hans.pos, { prompt: '헨젤을 톡! 만세!' }));
    T.pop(hans.x - 90, hans.y - 230, tr('만세!'));
    T.confetti();
    await Promise.all([hans.hop(40, 500), gret.hop(34, 500), father.hop(26, 500)]);
    await sleep(REST);
    scene('cottage_night'); /* 그날 밤 — 창문만 환한 집(모두 안에서 잔다) */
    await say('그날 밤, 둘은 포근한 이불 속에서 새근새근 잠이 들었답니다.');
    await say('우리 집이 제일 포근해요. 헨젤과 그레텔 이야기는 이렇게 끝났어요.');
    T.finale();
    return '우리 집이 제일 포근해요!';
  }

  Tale.mount({ title: '헨젤과 그레텔', subtitle: '집이 제일 포근해요', run: T => run(Tale.api) });
})();
