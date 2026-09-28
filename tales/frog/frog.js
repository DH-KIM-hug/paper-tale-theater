/* 황소와 개구리 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN.md §2
   "누가 더 커?" 비교 놀이 → 엄마 개구리 부풀리기 → 뻥! 풍선처럼 날아다니다 퐁당 → 폴짝 대회 → 밤 연못 합창.
   3~4세 순화: 개구리는 터져 다치지 않는다 — 공기가 빠지며 날아다니다 원래 크기로 돌아온다. */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', lily: '#5E8A4A', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32',
    indigo: '#1F2A56', lav: '#8B7BB8', persimmon: '#E8703A', pink: '#E8A0A0', ink: '#2E241C', sky: '#F2DFA8', snow: '#F4F6FA' };

  /* ================= 그림 도우미 (임시 도형) ================= */
  function drawFrog(T, g, { color = C.pine, sleepy = false } = {}) {
    const { el, paper } = T;
    const layers = paper(g, [
      ['ellipse', { cx: -26, cy: -8, rx: 16, ry: 8, fill: color }], ['ellipse', { cx: 26, cy: -8, rx: 16, ry: 8, fill: color }],
      ['ellipse', { cx: 0, cy: -32, rx: 40, ry: 30, fill: color }],
    ]);
    const inner = el('ellipse', { cx: 0, cy: -26, rx: 26, ry: 18, fill: C.cream }, layers); // 배판 (부풀면 벌어지는 안쪽 층)
    const eyes = el('g', {}, layers);
    [-17, 17].forEach(x => {
      el('circle', { cx: x, cy: -60, r: 12, fill: color }, eyes);
      el('circle', { cx: x, cy: -61, r: 9, fill: '#fff' }, eyes);
    });
    const pupils = el('g', {}, eyes);
    [-17, 17].forEach(x => el('circle', { cx: x, cy: -60, r: 4.5, fill: C.ink }, pupils));
    const lids = el('g', { opacity: sleepy ? 1 : 0 }, eyes);
    [-17, 17].forEach(x => el('path', { d: `M${x - 9} -61 Q${x} -54 ${x + 9} -61`, stroke: C.ink, 'stroke-width': 3, fill: color }, lids));
    [-26, 26].forEach(x => el('circle', { cx: x, cy: -38, r: 5, fill: C.pink, opacity: .8 }, layers));
    const mouth = el('path', { d: 'M-12 -40 Q0 -32 12 -40', stroke: C.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, layers);
    const hands = el('g', { opacity: 0 }, layers); // 눈 가리기
    [-17, 17].forEach(x => el('ellipse', { cx: x, cy: -60, rx: 13, ry: 9, fill: color, stroke: '#2f5a3f', 'stroke-width': 2 }, hands));
    return { inner, lids, mouth, hands, pupils };
  }
  function drawOx(T, g, { dotted = false } = {}) {
    const { paper, el } = T;
    if (dotted) {
      el('path', { d: 'M-150 0 V-80 M150 0 V-80 M-110 0 V-80 M110 0 V-80 M-160 -80 Q-160 -230 0 -230 Q160 -230 160 -80 Z M-165 -190 Q-230 -200 -235 -150 Q-230 -110 -170 -120 M-215 -205 Q-225 -240 -200 -250',
        fill: 'rgba(107,74,50,.12)', stroke: C.bark, 'stroke-width': 5, 'stroke-dasharray': '14 10' }, g);
      return {};
    }
    paper(g, [
      ['rect', { x: -150, y: -80, width: 26, height: 80, rx: 8, fill: '#5a3d29' }], ['rect', { x: 124, y: -80, width: 26, height: 80, rx: 8, fill: '#5a3d29' }],
      ['rect', { x: -110, y: -80, width: 26, height: 80, rx: 8, fill: C.bark }], ['rect', { x: 84, y: -80, width: 26, height: 80, rx: 8, fill: C.bark }],
      ...[-150, -110, 84, 124].map(x => ['rect', { x: x - 2, y: -22, width: 30, height: 22, rx: 6, fill: C.ink }]), // 발굽
      ['rect', { x: -160, y: -230, width: 320, height: 160, rx: 70, fill: C.bark }],
      ['ellipse', { cx: 40, cy: -170, rx: 50, ry: 34, fill: '#8a6344' }],
      ['path', { d: 'M155 -190 Q200 -150 186 -90', stroke: '#5a3d29', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' }],
      ['ellipse', { cx: 186, cy: -84, rx: 12, ry: 16, fill: C.ink }],
      ['rect', { x: -250, y: -250, width: 110, height: 120, rx: 46, fill: C.bark }],
      ['path', { d: 'M-230 -245 Q-270 -290 -240 -300 M-160 -245 Q-120 -290 -150 -300', stroke: C.cream, 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }],
      ['ellipse', { cx: -238, cy: -150, rx: 34, ry: 24, fill: '#c9a07a' }],
      ['circle', { cx: -250, cy: -150, r: 4, fill: C.ink }], ['circle', { cx: -226, cy: -150, r: 4, fill: C.ink }],
      ['circle', { cx: -225, cy: -205, r: 8, fill: '#fff' }], ['circle', { cx: -227, cy: -205, r: 4, fill: C.ink }],
    ]);
    return {};
  }
  const ANIMALS = {
    tadpole: { name: '올챙이', h: 36, draw: (T, g) => T.paper(g, [['path', { d: 'M18 -18 Q50 -30 60 -10 Q50 -2 18 -14', fill: '#2f4a3a' }], ['circle', { cx: 0, cy: -18, r: 18, fill: '#2f4a3a' }], ['circle', { cx: -6, cy: -22, r: 4, fill: '#fff' }]]) },
    frog: { name: '개구리', h: 72, draw: (T, g) => drawFrog(T, g) },
    duck: { name: '오리', h: 118, draw: (T, g) => T.paper(g, [['ellipse', { cx: 0, cy: -40, rx: 46, ry: 34, fill: C.snow }], ['circle', { cx: -30, cy: -92, r: 26, fill: C.snow }], ['path', { d: 'M-54 -92 L-80 -86 L-54 -80 Z', fill: C.persimmon }], ['circle', { cx: -36, cy: -98, r: 4, fill: C.ink }], ['rect', { x: -12, y: -8, width: 8, height: 10, fill: C.persimmon }], ['rect', { x: 8, y: -8, width: 8, height: 10, fill: C.persimmon }]]) },
    sheep: { name: '양', h: 150, draw: (T, g) => T.paper(g, [['rect', { x: -44, y: -50, width: 14, height: 50, fill: C.ink }], ['rect', { x: 30, y: -50, width: 14, height: 50, fill: C.ink }], ['ellipse', { cx: 0, cy: -80, rx: 70, ry: 46, fill: C.cream }], ['circle', { cx: -40, cy: -110, r: 26, fill: C.cream }], ['circle', { cx: 30, cy: -112, r: 24, fill: C.cream }], ['ellipse', { cx: -70, cy: -104, rx: 22, ry: 28, fill: '#4a3a30' }], ['circle', { cx: -76, cy: -110, r: 4, fill: '#fff' }]]) },
    ox: { name: '황소', h: 300, draw: (T, g) => drawOx(T, g) },
  };

  /* ================= 배경 ================= */
  function pondBG(T, night = false) {
    const { el, paper } = T, b = T.bg;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: night ? '#16204a' : C.sky }, b);
    if (night) {
      el('circle', { cx: 820, cy: 100, r: 44, fill: C.cream }, b);
      [[120, 80], [300, 50], [520, 110], [680, 60], [930, 150]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 4, fill: C.cream }, b));
    } else el('circle', { cx: 150, cy: 100, r: 46, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 330 Q150 230 420 310 Q700 220 1200 320 V600 H-200 Z', fill: night ? '#2a355f' : '#b9a25a' }]]);
    paper(b, [['rect', { x: -200, y: 360, width: 1400, height: 400, fill: night ? '#243048' : '#7c9a58' }]]);
    paper(b, [['ellipse', { cx: 500, cy: 470, rx: 470, ry: 110, fill: night ? C.indigo : '#4f6f9a' }], ['ellipse', { cx: 500, cy: 470, rx: 400, ry: 80, fill: night ? '#2d3a6e' : C.lav }]]);
    return [[250, 470], [370, 492], [500, 468], [630, 492], [750, 470]].map(([x, y]) => {
      paper(T.bg, [['ellipse', { cx: x, cy: y, rx: 58, ry: 18, fill: C.lily }], ['path', { d: `M${x} ${y} L${x + 40} ${y - 10} L${x + 44} ${y + 4} Z`, fill: night ? '#243048' : C.lav }]]);
      return [x, y - 6];
    });
  }
  function grassBG(T) {
    const { el, paper } = T;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.sky }, T.bg);
    paper(T.bg, [['rect', { x: -200, y: 440, width: 1400, height: 300, fill: '#7c9a58' }]]);
    for (let i = 0; i < 14; i++) {
      const x = -60 + i * 80, h = 240 + (i % 3) * 60;
      paper(T.bg, [['path', { d: `M${x} 560 Q${x + 14} ${560 - h / 2} ${x + 36} ${560 - h} Q${x + 30} ${560 - h / 2} ${x + 40} 560 Z`, fill: i % 2 ? C.leaf : C.pine }]]);
    }
    paper(T.bg, [['circle', { cx: 640, cy: 250, r: 26, fill: '#F6D98A' }], ['rect', { x: 637, y: 270, width: 6, height: 190, fill: C.pine }]]);
    paper(T.bg, [['ellipse', { cx: 300, cy: 300, rx: 12, ry: 10, fill: C.bean || '#A93B32' }], ['circle', { cx: 290, cy: 297, r: 3, fill: C.ink }]]); // 무당벌레
  }
  function chartBG(T) {
    const { el, paper } = T;
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.cream }, T.bg);
    paper(T.bg, [['rect', { x: 200, y: 40, width: 600, height: 440, rx: 12, fill: '#efe0bd' }]]);
    for (let i = 0; i < 9; i++) el('rect', { x: 220, y: 450 - i * 48, width: i % 2 ? 40 : 70, height: 6, fill: C.gold }, T.bg);
    paper(T.bg, [['rect', { x: -200, y: 470, width: 1400, height: 200, fill: '#b98f4a' }]]);
  }

  /* 화면 고정 UI (카메라 영향 없음): 골라요 배지 */
  function badge(T, x, y, drawIcon) {
    const ui = document.getElementById('stage');
    const g = T.el('g', { transform: `translate(${x},${y})` }, ui);
    T.paper(g, [['circle', { r: 70, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    drawIcon(g);
    return g;
  }
  const ICONS = {
    tail: (T, g) => T.el('path', { d: 'M-30 -40 Q20 -20 0 20 Q-10 40 10 44', stroke: C.bark, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, g) && T.el('ellipse', { cx: 12, cy: 46, rx: 12, ry: 16, fill: C.ink }, g),
    tree: (T, g) => T.el('rect', { x: -8, y: -6, width: 16, height: 50, fill: C.bark }, g) && T.el('circle', { cy: -24, r: 32, fill: C.pine }, g),
    hoof: (T, g) => T.el('path', { d: 'M-34 30 V-10 Q-34 -40 0 -40 Q34 -40 34 -10 V30 H10 V0 H-10 V30 Z', fill: C.ink }, g),
    rock: (T, g) => T.el('path', { d: 'M-44 30 Q-50 -20 -10 -34 Q40 -44 46 0 Q50 30 -44 30 Z', fill: '#8a8a8a' }, g),
    horn: (T, g) => T.el('path', { d: 'M-30 36 Q-40 -30 30 -40 Q-10 -20 -8 36 Z', fill: C.cream, stroke: C.bark, 'stroke-width': 4 }, g),
    branch: (T, g) => T.el('path', { d: 'M0 44 V-10 M0 10 L-30 -30 M0 -4 L28 -36', stroke: C.bark, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, g),
  };

  const moo = T => { T.tone([150, 105], .9, { type: 'sawtooth', vol: .12 }); T.tone([300, 210], .9, { type: 'triangle', vol: .08 }); };
  const croak = (T, f = 330) => { T.tone([f, f * .8], .12, { type: 'square', vol: .12 }); T.tone([f * .9, f * .7], .12, { type: 'square', vol: .1, when: .14 }); };

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, actor, camTo, camWide, camSnap } = T;

    /* --- 1. 연못의 아침: 아기 개구리 깨우기 --- */
    let pads = pondBG(T);
    const mom = actor(T.world, pads[2][0], pads[2][1], g => drawFrog(T, g), { scale: 1.2 });
    mom.parts = null;
    const babies = [0, 1, 3].map(i => {
      let parts;
      const a = actor(T.world, pads[i === 3 ? 4 : i][0], pads[i === 3 ? 4 : i][1], g => { parts = drawFrog(T, g, { color: C.leaf, sleepy: true }); }, { scale: .6 });
      a.parts = parts; return a;
    });
    await T.curtain(true);
    await say('연못에 아침이 왔어요. 아기 개구리들이 아직 쿨쿨 자고 있네요.');
    await say('아기 개구리들을 톡 눌러서 깨워 줄까요?');
    for (const b of babies) {
      await T.tap(b.pos, { prompt: '자고 있는 아기 개구리를 톡 눌러 봐요!' });
      b.parts.lids.setAttribute('opacity', 0); croak(T, 420); b.hop(40); T.pop(b.x, b.y - 80, '개굴!', C.pine);
      await sleep(300);
    }
    await say('엄마 개구리가 말했어요. "얘들아, 멀리 가면 안 된다~"');

    /* --- 2. 풀밭 모험 --- */
    await T.sceneCard('풀밭', () => {
      T.clear(); grassBG(T);
      babies.forEach((b, i) => { T.world.appendChild(b.pos); b.setScale(.9); b.place(120 + i * 70, 500); });
    });
    await say('아기 개구리들이 몰래 풀밭으로 나왔어요. 톡톡 눌러서 폴짝폴짝 가 볼까요?');
    await T.mash(T.root.querySelector('#stageWrap'), { count: 5, prompt: '화면을 톡톡 눌러서 폴짝폴짝!',
      onStep: i => babies.forEach((b, k) => { setTimeout(() => { croak(T, 380 + k * 40); b.move(b.x + 110, 500, 420); b.hop(50, 420); }, k * 90); }) });
    await sleep(500);

    /* --- 3. 이건 뭐지? (부분만 보이는 황소 퀴즈) --- */
    await T.sceneCard('커다란 무언가', () => {
      T.clear(); grassBG(T);
      actor(T.world, 520, 540, g => drawOx(T, g), { scale: 1 });
      camSnap(706, 450, 3.4);
    });
    await say('어? 눈앞에 커다란 무언가가 있어요!');
    const quiz = [
      { cam: [706, 450, 3.4], q: '이건 뭘까요? 꼬리일까요, 나무일까요?', ok: 'tail', no: 'tree', okName: '꼬리' },
      { cam: [395, 505, 2.6], q: '이번엔 뭘까요? 발굽일까요, 돌멩이일까요?', ok: 'hoof', no: 'rock', okName: '발굽' },
      { cam: [320, 280, 2.1], q: '이건 뭘까요? 뿔일까요, 나뭇가지일까요?', ok: 'horn', no: 'branch', okName: '뿔' },
    ];
    for (const r of quiz) {
      await camTo(...r.cam, 900);
      const left = Math.random() < .5;
      const bOk = badge(T, left ? 130 : 870, 300, g => ICONS[r.ok](T, g));
      const bNo = badge(T, left ? 870 : 130, 300, g => ICONS[r.no](T, g));
      await say(r.q);
      await T.choose([{ el: bOk, ok: true }, { el: bNo, ok: false }], { prompt: r.q,
        where: '가운데 그림이랑 똑같이 생긴 쪽을 골라 봐요!', who: `${r.okName}예요! 반짝이는 걸 눌러 봐요!` });
      bOk.remove(); bNo.remove();
      await say(`맞아요, ${r.okName}예요!`);
    }
    await camTo(500, 280, 1, 1600);
    moo(T); T.shake();
    await say('음매~! 커다란 황소였어요! 아기 개구리들은 깜짝 놀라 도망쳤어요.');

    /* --- 4. 엄마! 괴물이에요! --- */
    await T.sceneCard('연못', () => {
      T.clear(); pads = pondBG(T);
      T.world.appendChild(mom.pos); mom.place(pads[2][0], pads[2][1]);
      babies.forEach((b, i) => { T.world.appendChild(b.pos); b.setScale(.6); b.place(pads[[0, 1, 4][i]][0], pads[[0, 1, 4][i]][1]); });
    });
    babies.forEach(b => b.hop(30));
    await say('"엄마! 산처럼 커다란 괴물을 봤어요!"');
    await say('엄마 개구리가 말했어요. "흥, 얼마나 컸는데?"');

    /* --- 5. 누가 더 커요? (비교 놀이) --- */
    await T.sceneCard('키재기', () => { T.clear(); chartBG(T); });
    await say('누가 더 큰지 키를 재 볼까요?');
    const pairs = [['tadpole', 'frog'], ['frog', 'duck'], ['duck', 'sheep'], ['sheep', 'ox']];
    for (const [small, big] of pairs) {
      const bigLeft = Math.random() < .5;
      const mk = (k, x) => {
        const s = k === 'ox' ? .62 : 1; // 황소는 무대에 들어오게 줄여서
        const a = actor(T.world, x, 470, g => ANIMALS[k].draw(T, g), { scale: s });
        a.key = k; return a;
      };
      const A = mk(bigLeft ? big : small, 340), B = mk(bigLeft ? small : big, 660);
      const bigA = bigLeft ? A : B, smallA = bigLeft ? B : A;
      await say(`${ANIMALS[A.key].name}랑 ${ANIMALS[B.key].name}, 누가 더 커요?`);
      await T.choose([
        { el: bigA.pos, ok: true },
        { el: smallA.pos, ok: false, onWrong: async () => {
          // 틀리면 등을 맞대고 나란히 서서 차이를 보여준다
          const ax = A.x, bx = B.x;
          await Promise.all([A.move(470, 470, 500), B.move(560, 470, 500)]);
          await sleep(900);
          await Promise.all([A.move(ax, 470, 500), B.move(bx, 470, 500)]);
        } },
      ], { prompt: '누가 더 커요? 큰 친구를 눌러 봐요!',
        where: '둘이 나란히 섰어요. 머리가 더 높은 친구는 누구지?', who: `${ANIMALS[big].name}가 더 커요! 반짝이는 친구를 눌러 봐요!` });
      big === 'ox' ? moo(T) : croak(T, 500);
      await bigA.hop(24);
      await say(`맞아요! ${ANIMALS[big].name}가 더 커요!`);
      A.pos.remove(); B.pos.remove();
    }

    /* --- 6. 엄마 개구리 부풀리기 --- */
    await T.sceneCard('연못가', () => {
      T.clear(); pondBG(T);
      actor(T.world, 520, 500, g => drawOx(T, g, { dotted: true }), { scale: 1.15 });
      T.world.appendChild(mom.pos); mom.place(520, 500);
      babies.forEach((b, i) => { T.world.appendChild(b.pos); b.place([150, 230, 860][i], 500); });
    });
    await say('"흥, 나도 황소만큼 클 수 있어!" 엄마 개구리가 숨을 크게 들이마셨어요.');
    await say('엄마 개구리를 톡톡 눌러서 부풀려 볼까요?');
    const SIZES = [1, 1.35, 1.7, 2.05, 2.4, 2.75, 3.1, 3.4, 3.65];
    const cheer = { 2: '"아직 황소가 더 커요!"', 5: '"와, 양만큼 커졌다! 그래도 황소가 더 커요!"' };
    await T.mash(mom.pos, { count: 8, prompt: '엄마 개구리를 톡톡 눌러 봐요!', onStep: i => {
      T.tone([200 + i * 40, 420 + i * 40], .25, { type: 'sine', vol: .18 });
      mom.body.style.transition = 'transform .35s cubic-bezier(.3,1.6,.5,1)';
      mom.body.style.transform = `scale(${SIZES[i] * 1.08}, ${SIZES[i]})`;
      if (cheer[i]) Narrator.speak(cheer[i]);
    } });
    await sleep(500);

    /* --- 7. 부들부들 --- */
    const shiver = mom.body.animate([{ translate: '0 0' }, { translate: '4px 0' }, { translate: '-4px 0' }], { duration: 120, iterations: Infinity });
    babies.forEach(b => b.parts.hands.setAttribute('opacity', 1));
    await say('엄마 개구리가 부들부들 떨려요. 어어… 한 번 더 누르면 어떻게 될까?');
    await Promise.race([T.tap(mom.pos), sleep(8000)]);
    shiver.cancel();

    /* --- 8. 뻥! → 풍선처럼 날아다니다 퐁당 --- */
    await T.cut(svg => {
      T.el('circle', { cx: 200, cy: 150, r: 110, fill: C.pine }, svg);
      T.el('ellipse', { cx: 200, cy: 170, rx: 70, ry: 50, fill: C.cream }, svg);
      T.el('text', { x: 200, y: 175, 'text-anchor': 'middle', 'font-size': 90, fill: '#A93B32', stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': 'Jua, sans-serif', text: '뻥!' }, svg);
    }, { sfx: 'boom' });
    babies.forEach(b => b.parts.hands.setAttribute('opacity', 0));
    mom.body.style.transition = 'transform 3s linear';
    mom.body.style.transform = 'scale(1.6)';
    const fly = mom.pos.animate([
      { transform: 'translate(520px,500px)' }, { transform: 'translate(760px,220px) rotate(40deg)' }, { transform: 'translate(300px,160px) rotate(-30deg)' },
      { transform: 'translate(820px,380px) rotate(60deg)' }, { transform: 'translate(200px,330px) rotate(-50deg)' }, { transform: 'translate(520px,200px)' },
    ], { duration: 3600, iterations: Infinity, easing: 'ease-in-out' });
    mom.pos.removeAttribute('transform');
    const whoosh = setInterval(() => T.tone([900, 300], .35, { type: 'sawtooth', vol: .06 }), 500);
    await say('푸슈슈슉~ 엄마 개구리가 풍선처럼 날아다녀요! 톡 눌러서 잡아 줘요!');
    await T.tap(mom.pos, { prompt: '날아다니는 엄마 개구리를 톡!' });
    clearInterval(whoosh); fly.cancel();
    mom.body.style.transition = ''; mom.body.style.transform = '';
    mom.place(500, 468);
    AudioFX.splash(); T.pop(500, 400, '퐁당!', C.indigo);
    const stars = el('g', { transform: 'translate(500,370)' }, T.fx);
    for (let k = 0; k < 3; k++) el('path', { d: 'M0 -10 L3 -3 10 -3 4 2 6 10 0 5 -6 10 -4 2 -10 -3 -3 -3 Z', fill: '#FFD54F', transform: `rotate(${k * 120}) translate(28 0)` }, stars);
    stars.animate([{ transform: 'translate(500px,370px) rotate(0)' }, { transform: 'translate(500px,370px) rotate(360deg)' }], { duration: 1200, iterations: 3 });
    [0, .15, .3].forEach(w => T.tone([700, 500], .12, { type: 'triangle', vol: .14, when: w }));
    await say('엄마 개구리는 원래 크기로 돌아왔어요. 어지러워도 깔깔깔 웃었답니다.');
    stars.remove();

    /* --- 9. 폴짝 대회 --- */
    await T.sceneCard('폴짝 대회', () => {
      T.clear(); pads = pondBG(T);
      T.world.appendChild(mom.pos); mom.place(120, 480);
      actor(T.world, 900, 520, g => drawOx(T, g), { scale: .55 });
    });
    const ox = T.world.lastChild;
    moo(T);
    await say('황소가 몸을 낮추고 다정하게 말했어요. "크지 않아도 괜찮아. 너는 폴짝 뛰기 선수잖아!"');
    let pi = 0;
    await T.mash(mom.pos, { count: 5, prompt: '엄마 개구리를 톡 눌러서 폴짝!', onStep: () => {
      const [x, y] = pads[pi++]; croak(T, 360 + pi * 30);
      mom.pos.animate([{ transform: `translate(${mom.x}px,${mom.y}px) scale(1.2)` }, { transform: `translate(${(mom.x + x) / 2}px,${y - 120}px) scale(1.2)` }, { transform: `translate(${x}px,${y}px) scale(1.2)` }], { duration: 420, easing: 'ease-out' });
      mom.place(x, y);
    } });
    await sleep(500);
    await say('황소도 따라 뛰어 볼까요? 하나, 둘…');
    await T.anim(ox, [{ translate: '0 0' }, { translate: '0 -14px' }, { translate: '0 0' }], 400);
    AudioFX.thud(); T.shake(); T.pop(900, 330, '쿵!');
    await say('쿵! 황소는 폴짝 뛰지 못했어요. 누가 더 멀리 뛸까요? 개구리!');

    /* --- 10. 밤 연못 합창 --- */
    await T.sceneCard('밤 연못', () => {
      T.clear(); pads = pondBG(T, true);
      T.world.appendChild(mom.pos); mom.place(pads[2][0], pads[2][1]);
      [0, 1, 3].forEach((p, i) => { const b = babies[i]; T.world.appendChild(b.pos); b.place(pads[p][0], pads[p][1]); });
      const x = actor(T.world, pads[4][0], pads[4][1], g => drawFrog(T, g, { color: '#58805a' }), { scale: .8 });
      x.pos.id = 'uncleFrog';
      T.world.__uncle = x;
    });
    const choir = [babies[0], babies[1], mom, babies[2], T.world.__uncle];
    const NOTES = [262, 294, 330, 392, 440]; // 도레미솔라 — 어떻게 눌러도 어울린다
    await say('밤이 되었어요. 개구리 가족이 노래를 불러요. 개구리를 톡톡 눌러서 합창해 봐요!');
    const metro = setInterval(() => T.tone([140, 110], .5, { type: 'triangle', vol: .08 }), 1600);
    await T.free(choir.map((f, i) => ({ el: f.pos, onTap: () => { T.tone(NOTES[i], .35, { type: 'triangle', vol: .22 }); f.hop(22, 300); } })), 20000);
    clearInterval(metro);
    await say('개굴개굴~ 노래가 잦아들고, 개구리 가족은 쿨쿨 잠이 들었답니다.');
    return '개구리는 개구리대로 멋져요!';
  }

  Tale.mount({ title: '황소와 개구리', subtitle: '누가 더 클까?', run: T => run(Tale.api) });
})();
