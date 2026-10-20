/* 늑대와 아기 염소 — 시안(목업): 그림은 완성본, 목소리는 아직 없음(말풍선 + 브라우저 음성).
   대사는 script_draft.txt 로 검토한 뒤 voice_script.json 을 만들어 Typecast 로 녹음한다.
   - 3~4세 순화: 늑대는 우물에 빠졌다 도망갈 뿐 다치지 않고, 아기 염소들도 하나도 다치지 않는다. 틀리거나 지는 일 없음.
   - 배경은 장면마다 한 장(assets/v3w/wg_bg_*.webp), 배우는 자세마다 한 장(발끝 = 배우 y). */
(() => {
  const NF = new Set(['wg_clock', 'wg_clock_open', 'wg_laundry', 'wg_quilt', 'wg_stone', 'wg_cut_voice']); // 얼굴 없는 새 그림(파일 이름 끝에 nf)
  const A = f => `../../assets/v3w/${f}${NF.has(f) ? 'nf' : ''}.webp`;
  /* 그림 크기 [가로, 세로] (assets/v3w, 배우 그림은 여백을 잘라 가장 긴 변 480) */
  const DIM = {
    wg_clock: [211, 564], wg_clock_open: [262, 700], wg_laundry: [612, 499], wg_quilt: [572, 490], wg_stone: [696, 607],
    wg_mama_basket: [284, 480], wg_mama_warn: [284, 480], wg_mama_surprise: [280, 480], wg_mama_scissors: [342, 480], wg_mama_dance: [354, 480],
    wg_wolf_knock: [232, 246], wg_wolf_chalk: [207, 189], wg_wolf_flour: [207, 198], wg_wolf_belly: [262, 174], wg_wolf_heavy: [445, 434],
    wg_wolf_splash: [252, 204], wg_wolf_flee: [362, 231],
    wg_kid1_base: [458, 480], wg_kid1_joy: [389, 427], wg_kid2_base: [476, 480], wg_kid2_joy: [445, 443], wg_kid3_base: [464, 472], wg_kid3_joy: [424, 420],
    wg_kid4_base: [411, 480], wg_kid4_joy: [429, 450], wg_kid5_base: [422, 480], wg_kid5_joy: [421, 454], wg_kid6_base: [446, 480], wg_kid6_joy: [433, 417],
    wg_kid7_base: [435, 480], wg_kid7_joy: [408, 410],
  };
  const show = (n, on) => n.setAttribute('opacity', on ? 1 : 0);
  const KX = i => 320 + 60 * i; // 아기 염소 일곱이 한 줄로 설 자리 (세로 화면에서도 보이는 가운데 폭 안)

  function bg(T, key) {
    T.el('image', { href: A('wg_bg_' + key), x: -40, y: -22, width: 1080, height: 605, preserveAspectRatio: 'xMidYMid slice' }, T.bg);
  }
  /* 배우: poses = { 이름: 그림 }. first 자세의 높이가 h. 발끝 = (x,y) */
  function figure(T, x, y, h, poses, first) {
    const imgs = {}, s = h / DIM[poses[first]][1];
    const a = T.actor(T.world, x, y, g => {
      const w = T.el('g', { filter: 'url(#pp)' }, g);
      for (const [k, f] of Object.entries(poses)) {
        const [pw, ph] = DIM[f];
        imgs[k] = T.el('image', { href: A(f), x: -pw * s / 2, y: -ph * s, width: pw * s, height: ph * s, opacity: k === first ? 1 : 0 }, w);
      }
    });
    a.pose = k => Object.entries(imgs).forEach(([n, i]) => show(i, n === k));
    return a;
  }
  const kid = (T, n, x, y, h = 90) => figure(T, x, y, h, { base: `wg_kid${n}_base`, joy: `wg_kid${n}_joy` }, 'base');
  const mama = (T, x, y, h = 270, first = 'basket') => figure(T, x, y, h, {
    basket: 'wg_mama_basket', warn: 'wg_mama_warn', surprise: 'wg_mama_surprise', scissors: 'wg_mama_scissors', dance: 'wg_mama_dance' }, first);
  const prop = (T, f, x, y, h) => figure(T, x, y, h, { a: f }, 'a');
  const knock = () => { AudioFX.sfx('knock', .9); };
  const sting = k => AudioFX.sting && AudioFX.sting(k);
  const cutArt = (T, f, sfx, hold = 3200) => T.cutImage([{ src: A(f), sfx, hold }], { hold });
  const hide = a => show(a.pos, 0);
  const appear = a => show(a.pos, 1);

  async function run(T) {
    const { sleep, say } = T;
    const scene = (label, fn) => T.sceneCard(label, () => { T.clear(); T.camSnap(500, 280, 1); fn(); });
    const hopAll = (list, h = 24) => Promise.all(list.map((a, i) => sleep(i * 70).then(() => a.hop(h, 360))));
    let kids;
    const lineUp = (y = 520, h = 90) => { kids = [1, 2, 3, 4, 5, 6, 7].map((n, i) => kid(T, n, KX(i), y, h)); return kids; };

    /* --- 1. 부엌 --- */
    bg(T, 'kitchen');
    const mm = mama(T, 330, 478); lineUp();
    await T.curtain(true);
    await say('아주 먼 옛날, 엄마 염소와 일곱 마리 아기 염소가 살았어요.');
    await hopAll(kids); AudioFX.jingle();
    await say('어느 날, 엄마 염소가 바구니를 들고 말했어요.');
    await say('"엄마는 풀을 뜯으러 다녀올게. 늑대가 오면 문을 열어 주면 안 돼!"');
    await T.tap(mm.pos, { prompt: '엄마 염소를 톡 눌러 봐요!' });
    mm.pose('warn'); mm.hop(14, 300);
    await say('"늑대는 목소리가 걸걸하고, 발이 시커멓단다. 꼭 기억해!"');
    await say('"네, 엄마!" 아기 염소들이 큰 소리로 대답했어요.');
    await hopAll(kids); mm.pose('basket');
    await mm.move(1120, 478, 2600);

    /* --- 2. 문 안쪽: 똑똑똑 --- */
    await scene('똑똑똑!', () => { bg(T, 'inside_door'); lineUp(); });
    await say('엄마가 가고 얼마 뒤, 문밖에서 소리가 났어요.');
    knock(); T.pop(500, 200, '똑똑똑!'); T.shake();
    await sleep(900);
    await say('"얘들아, 엄마야. 문 열어 줘!" 걸걸한 목소리였어요.');
    await cutArt(T, 'wg_cut_voice', 'surprise');
    await say('아기 염소들이 서로 쳐다보았어요.');
    await sleep(500);
    kids[0].hop(20, 320);
    await say('"목소리가 걸걸해. 우리 엄마가 아니야!" 첫째가 말했어요.');
    await say('"저리 가요, 늑대!" 아기 염소들이 소리쳤어요.');
    await hopAll(kids, 18);

    /* --- 3. 분필 먹은 늑대 --- */
    await scene('분필 먹은 늑대', () => { bg(T, 'door'); });
    const wc = figure(T, 500, 520, 200, { a: 'wg_wolf_chalk' }, 'a');
    await say('늑대는 곰곰이 생각했어요.');
    await say('"목소리를 곱게 만들어야지. 분필을 먹어 볼까?"');
    const chalk = i => { wc.hop(14, 240); T.pop(500 + (i % 2 ? 60 : -60), 170, '와작!'); AudioFX.tap(); };
    await T.tap(wc.pos, { prompt: '늑대를 톡! 눌러 봐요!' }); // 한 번 누르면 나머지는 저절로 (2026-10-19)
    for (let i = 1; i <= 3; i++) { await chalk(i); await sleep(500); }
    await cutArt(T, 'wg_cut_chalk', 'laugh');
    await say('늑대의 목소리가 가늘고 고와졌어요.');
    knock(); T.pop(500, 120, '똑똑똑!');
    await sleep(800);
    await say('"얘들아, 엄마야. 문 열어 줘~"');
    await say('"그럼 문틈으로 발을 보여 주세요!" 아기 염소들이 말했어요.');

    /* --- 4. 창가: 하얀 발 --- */
    await scene('하얀 발', () => { bg(T, 'window'); });
    const wf = figure(T, 500, 545, 200, { a: 'wg_wolf_flour' }, 'a');
    await say('늑대는 밀가루를 발에 묻혀서, 하얀 발을 쑥 내밀었어요.');
    await sleep(500);
    await cutArt(T, 'wg_cut_flour', 'laugh');
    await say('"에취!" 늑대가 밀가루 재채기를 했어요.');
    await say('"어? 하얀 발이야! 엄마다!" 아기 염소들은 깜빡 속아서 문을 열었어요.');

    /* --- 5. 숨바꼭질 --- */
    await scene('숨바꼭질', () => { bg(T, 'house'); });
    const quilt = prop(T, 'wg_quilt', 360, 535, 150), laundry = prop(T, 'wg_laundry', 540, 540, 110), clock = figure(T, 660, 535, 330, { a: 'wg_clock', open: 'wg_clock_open' }, 'a');
    lineUp(500, 80);
    await say('그런데 들어온 건 엄마가 아니라 늑대였어요!');
    sting('surprise'); T.pop(500, 200, '꺄악!');
    await hopAll(kids, 30);
    await say('"숨자, 숨자!" 아기 염소들이 이불 속, 빨래 바구니 속으로 쏙쏙 숨었어요.');
    await Promise.all(kids.slice(0, 6).map((k, i) => sleep(i * 120).then(async () => { await k.move(i < 3 ? 360 : 540, 520, 600); hide(k); })));
    await say('막내는 어디에 숨을까요?');
    await T.tap(kids[6].pos, { prompt: '막내 염소를 톡 눌러서 시계 속에 숨겨 줘요!' });
    clock.pose('open');
    await kids[6].move(660, 505, 700); hide(kids[6]); clock.pose('a'); AudioFX.ding();
    await say('막내는 키 큰 시계 속에 쏙 숨었어요. 아무도 몰랐어요.');
    const wk = figure(T, -80, 540, 210, { a: 'wg_wolf_knock' }, 'a'); wk.face('right');
    await wk.move(300, 540, 1600);
    await say('"어디 숨었나? 다 찾아낼 테다!" 늑대가 집 안을 뒤졌어요.');
    await cutArt(T, 'wg_cut_dark', 'bigHit');
    wk.hop(30, 420); quilt.hop(14, 300); laundry.hop(14, 300); AudioFX.sting('surprise'); // 꿀꺽
    await say('늑대는 시계 속만 빼고, 아기 염소들을 모두 찾아내서 꿀꺽 삼켜 버렸어요.');
    await say('하지만 아기 염소들은 다치지 않았어요. 아주 따뜻하고 포근한 뱃속이었거든요.');
    await cutArt(T, 'wg_cut_belly', null);

    /* --- 6. 엄마가 돌아왔어요 --- */
    await scene('엄마가 돌아왔어요', () => { bg(T, 'messy'); });
    const clock2 = figure(T, 86, 492, 450, { a: 'wg_clock', open: 'wg_clock_open' }, 'a'); // 그림 속 시계 자리에 덮는다
    const mm2 = mama(T, 340, 520, 280, 'surprise');
    const k7 = kid(T, 7, 90, 490, 90); hide(k7);
    await say('집에 돌아온 엄마 염소는 깜짝 놀랐어요.');
    await say('"얘들아, 어디 있니? 엄마 왔어!"');
    mm2.hop(16, 300);
    if (T.viewWidth() < 990) await T.camTo(220, 280, 1, 800); // 세로 화면: 왼쪽 끝의 시계가 화면 밖이라 누를 수 없었다 → 시계 쪽으로 카메라를 옮긴다
    await sleep(500);
    clock2.pose('open'); appear(k7); AudioFX.ding();
    if (T.viewWidth() < 990) T.camTo(500, 280, 1, 700);
    await k7.move(480, 530, 700); clock2.pose('a'); k7.pose('joy');
    await say('"엄마!" 막내가 시계 속에서 폴짝 나왔어요.');
    await say('"늑대가 형들과 누나들을 꿀꺽 삼켰어요!"');
    mm2.pose('scissors');
    await say('"걱정 마. 엄마가 꼭 구해 줄게!" 엄마는 가위와 바늘을 챙겼어요.');

    /* --- 7. 나무 아래 늑대 --- */
    await scene('나무 아래 늑대', () => { bg(T, 'tree'); });
    const wb = figure(T, 620, 520, 110, { a: 'wg_wolf_belly' }, 'a');
    const mm3 = mama(T, 230, 515, 270, 'scissors'); const k7b = kid(T, 7, 350, 515, 90); k7b.pose('base');
    await say('늑대는 배가 불러서, 나무 아래에서 쿨쿨 자고 있었어요.');
    T.pop(520, 360, '쿨쿨~', '#3F6B4F');
    await Promise.all([mm3.move(340, 515, 1400), k7b.move(430, 515, 1400)]);
    await say('엄마와 막내는 살금살금 다가갔어요.');
    await sleep(500);
    mm3.hop(14, 300);
    await say('"쉿! 늑대가 깨지 않게, 그림자 극장에서 아기들을 꺼내 줄게."');

    /* --- 8. 그림자 극장 --- */
    await scene('그림자 극장', () => { bg(T, 'shadow'); });
    const mm4 = mama(T, 200, 545, 300, 'scissors');
    mm4.pos.style.filter = 'brightness(0)'; show(mm4.pos, 0); // 엄마는 종이 극장에 비친 까만 그림자
    await say('하얀 종이 극장에 엄마의 그림자가 나타났어요.');
    show(mm4.pos, .72);
    mm4.hop(10, 240); sleep(320).then(() => mm4.hop(10, 240)); // 슥삭슥삭 가위질
    await say('슥삭슥삭, 가위질을 하자 아기 염소들이 하나씩 나와요!');
    await cutArt(T, 'wg_cut_pop', 'magic');
    kids = [1, 2, 3, 4, 5, 6].map((n, i) => { const k = kid(T, n, KX(i), 520, 90); hide(k); return k; });
    const hit = T.el('rect', { x: 290, y: 100, width: 420, height: 360, rx: 26, fill: '#fffaf0', 'fill-opacity': .4, stroke: '#fff', 'stroke-width': 5 }, T.world); // 눌러 볼 하얀 종이 화면
    await T.mash(hit, { count: 6, prompt: '화면을 톡톡 눌러 봐요!', onStep: i => {
      const k = kids[i - 1]; appear(k); k.pose('joy'); k.hop(40, 420); sting('surprise'); T.pop(KX(i - 1), 330 - (i % 2) * 90, '뿅!');
    } });
    hit.remove();
    const k7c = kid(T, 7, KX(6), 520, 90); k7c.pose('joy'); kids.push(k7c);
    await hopAll(kids, 30); AudioFX.sting('win');
    await say('"엄마!" 아기 염소 여섯 마리가 모두 무사히 나왔어요.');
    await say('"이제 늑대 배에 돌멩이를 넣어 주자."');
    const stone = prop(T, 'wg_stone', 500, 400, 90);
    const drop = i => { stone.hop(30, 300); T.pop(500, 250, '쏙!'); AudioFX.tap(); stone.setScale(1 - i * .25); };
    await T.tap(stone.pos, { prompt: '돌멩이를 톡! 눌러 봐요!' }); // 한 번 누르면 나머지는 저절로 (2026-10-19)
    for (let i = 1; i <= 3; i++) { await drop(i); await sleep(500); }
    await cutArt(T, 'wg_cut_stitch', 'magic');
    await say('엄마가 바늘로 콕콕콕 꿰맸어요. 늑대는 아무것도 몰랐어요.');

    /* --- 9. 우물 --- */
    await scene('우물가', () => { bg(T, 'well'); });
    const wh = figure(T, 260, 520, 230, { heavy: 'wg_wolf_heavy', splash: 'wg_wolf_splash' }, 'heavy'); wh.face('right');
    await say('잠에서 깬 늑대가 비틀비틀 일어났어요.');
    await say('"아이고, 배가 무거워. 목이 말라!"');
    T.camTo(700, 280, 1, 2600);
    await wh.move(700, 520, 2600);
    await say('"우물에서 물을 마셔야지."');
    await sleep(500);
    wh.pose('splash'); wh.face('left'); await wh.move(760, 470, 420);
    await cutArt(T, 'wg_cut_splash', 'splash');
    await say('풍덩! 늑대가 우물에 빠졌어요.');
    wh.pos.remove();
    const wf2 = figure(T, 790, 520, 130, { a: 'wg_wolf_flee' }, 'a');
    await say('"으악, 차가워! 다시는 안 올 거야!"');
    await wf2.move(1250, 520, 1500);
    await say('늑대는 흠뻑 젖은 채 멀리멀리 도망갔어요.');

    /* --- 10. 춤 --- */
    await cutArt(T, 'wg_cut_dance', 'win', 4200);
    await scene('모두 모였어요', () => { bg(T, 'well'); });
    const md = mama(T, 500, 470, 260, 'dance');
    kids = [1, 2, 3, 4, 5, 6, 7].map((n, i) => { const k = kid(T, n, KX(i), 525, 90); k.pose('joy'); return k; });
    T.finale();
    await say('엄마와 일곱 아기 염소는 손을 잡고 신나게 춤을 추었어요.');
    await hopAll(kids, 34); md.hop(30, 400); T.confetti(); AudioFX.sting('win');
    await say('아기 염소를 톡! 눌러 같이 춤춰 봐요!');
    // 가운데 아기 염소를 톡톡: 누를 때마다 엄마와 아기 염소들이 차례로 폴짝 (자유 놀이 없음)
    const dance = () => { AudioFX.tap(); md.hop(30, 340); kids.forEach((k, j) => setTimeout(() => k.hop(30, 340), j * 70)); };
    await T.tap(kids[3].pos, { prompt: '아기 염소를 톡! 눌러 같이 춤춰 봐요!' }); // 한 번 누르면 나머지는 저절로
    for (let i = 1; i <= 3; i++) { dance(); await sleep(700); }
    await sleep(700);
    await say('엄마 목소리를 잘 아는 아기 염소들은 오래오래 행복하게 살았답니다.');
    return '엄마 목소리를 잘 기억해요!';
  }

  Tale.mount({ title: '늑대와 일곱 마리 아기 염소', subtitle: '엄마 목소리는 어떤 걸까?', run: T => run(Tale.api) });
})();
