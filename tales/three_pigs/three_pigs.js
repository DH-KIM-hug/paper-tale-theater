/* 아기 돼지 삼형제 — 목업 (그림 파일은 assets/v3w/tp_*.webp, 낭독 파일 없이 글자만으로 진행) */
(() => {
  const NF = { bricks: 'nf', straw: 'nf', wood: 'nf', cut_splash: 'nf', cut_tired: 'v2', cut_crawl: 'v2', bg_brick_out: 'v2' }; // 얼굴 없는/통일한 새 그림(파일 이름 끝 글자)
  const U = n => /^tp2_/.test(n) ? `../../assets/v3w/${n}.webp` : `../../assets/v3w/tp_${n}${NF[n] || ''}.webp`;
  const SZ = {
    pig1_base: [365, 480], pig1_build: [471, 480], pig1_flee: [407, 480], pig1_joy: [361, 480], pig1_play: [342, 480],
    pig2_base: [378, 480], pig2_build: [442, 480], pig2_flee: [401, 480], pig2_joy: [410, 480], pig2_play: [453, 480],
    pig3_base: [353, 480], pig3_build: [416, 480], pig3_flee: [416, 480], pig3_joy: [392, 480], pig3_play: [314, 480],
    mama: [416, 480], wolf_walk: [480, 363], wolf_sniff: [480, 346], wolf_puff: [480, 325], wolf_tired: [369, 480],
    wolf_hot: [222, 480], wolf_flee: [480, 243], straw: [700, 294], wood: [700, 289], bricks: [459, 448], brick1: [480, 242],
    house_straw: [918, 537], house_straw_ruin: [944, 517], house_wood: [748, 671], house_wood_ruin: [889, 664],
    house_brick: [845, 729], pot: [480, 222], fan: [643, 700], instruments: [480, 237],
  };
  // 2026-10-20 새 그림 실제 크기(SZ는 옛 그림 크기 = 높이 기준). 같은 픽셀 눈금으로 그려서 새 그림의 실제 비율을 따른다
  const NW = { pig1_base: [365, 459], pig1_build: [458, 480], pig1_flee: [407, 455], pig1_play: [342, 432], pig2_base: [372, 480], pig2_build: [418, 480], pig2_flee: [367, 480], pig2_play: [422, 480], pig3_base: [345, 480], pig3_build: [394, 480], pig3_play: [314, 446], mama: [398, 480], wolf_sniff: [401, 346], wolf_puff: [395, 325], wolf_tired: [369, 376], straw: [214, 294], wood: [471, 289], bricks: [459, 351], house_straw: [551, 537], house_straw_ruin: [650, 517], house_wood: [741, 671], house_wood_ruin: [823, 664], house_brick: [803, 729], fan: [498, 623] };
  // 집 짓는 단계 그림(tp2_<집>_s1~3): 완성 그림과 같은 상자·같은 바닥선으로 만든다
  ['straw', 'wood', 'brick'].forEach(k => [1, 2, 3].forEach(i => { SZ[`tp2_${k}_s${i}`] = SZ[`house_${k}`]; NW[`tp2_${k}_s${i}`] = NW[`house_${k}`]; }));
  const BG = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const NUM = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  const GROUND = 480;

  async function run(T) {
    const say = T.say, sleep = T.sleep;
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const portrait = () => T.viewWidth() < 990;
    const look = (x, dur = 700) => T.camTo(x, 280, 1, dur);
    const sfx = n => { try { AudioFX.sfx(n); } catch (e) { /* 소리 없이도 진행 */ } };
    const raf = () => new Promise(r => requestAnimationFrame(r));

    function bg(key) {
      T.bg.innerHTML = ''; T.world.innerHTML = ''; T.fx.innerHTML = '';
      T.el('image', { href: U('bg_' + key), x: BG.x, y: BG.y, width: BG.w, height: BG.h, preserveAspectRatio: 'none' }, T.bg);
    }
    function sprite(name, x, h, y = GROUND) {
      let im;
      const a = T.actor(T.world, x, y, b => { im = T.el('image', { filter: 'url(#pp)', preserveAspectRatio: 'none' }, b); });
      a.h = h;
      a.set = (n, hh = a.h) => {
        a.h = hh; const [, h0] = SZ[n], [nw, nh] = NW[n] || SZ[n], w = hh * nw / h0, h = hh * nh / h0;
        im.setAttribute('href', U(n)); im.setAttribute('x', -w / 2); im.setAttribute('y', -h);
        im.setAttribute('width', w); im.setAttribute('height', h);
      };
      a.show = on => { a.pos.style.opacity = on ? 1 : 0; };
      a.set(name, h);
      /* 누르는 자리: 작은 그림도 화면 짧은 변 80px 이상(세로 휴대폰 포함)이 되게 투명 사각을 깐다 (2026-10-22) */
      const hh = Math.max(h, 96), hr = T.el('rect', { x: -48, y: -hh, width: 96, height: hh, fill: '#000', 'fill-opacity': 0 }, a.pos);
      a.pos.insertBefore(hr, a.pos.firstChild);
      return a;
    }
    const hit = (x, y, w, h) => T.el('rect', { x, y, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, T.world);
    const tune = (notes, type = 'triangle') => notes.forEach((f, i) => T.tone(f, .22, { type, vol: .12, when: i * .2 }));

    await Promise.all(['cut_strawhat', 'cut_planks', 'cut_tired', 'cut_crawl', 'cut_chimney', 'cut_splash', 'cut_launch', 'cut_village'].map(n => T.preload(U(n))));

    /* 1. 엄마 배웅 */
    bg('meadow'); T.camSnap(500, 280, 1);
    const mama = sprite('mama', 230, 300);
    const pigs = [sprite('pig1_base', 500, 215), sprite('pig2_base', 650, 215), sprite('pig3_base', 800, 215)];
    await T.curtain(true);
    await look(300, 300);
    await say('옛날 옛날에 아기 돼지 삼 형제가 살았어요.');
    await say('엄마 돼지가 말했어요. "이제 너희도 다 컸구나. 세상에 나가서 각자 집을 지어 보렴."');
    mama.wiggle(6, 700);
    const first = ['첫째!', '둘째!', '셋째!'];
    for (let i = 0; i < 3; i++) {
      await look(pigs[i].x - 40);
      await sleep(400); // 아기 돼지 소개는 저절로 (2026-10-20)
      pigs[i].hop(40); T.pop(pigs[i].x, 250, first[i]); sfx('pop');
      await sleep(700);
    }
    await look(500);
    await say('삼 형제는 엄마께 인사하고 길을 떠났어요.');

    /* 1-2. 옷 맞히기 (이야기와 상관없는 관찰 놀이): 두 문제를 무작위로, 돼지 자리는 매번 섞는다 */
    {
      const POOL = [
        { q: '목도리를 두른 돼지는 누구일까요?', ans: 0 }, { q: '노란 모자를 쓴 돼지는 누구일까요?', ans: 0 }, { q: '하얀 모자를 쓴 돼지는 누구일까요?', ans: 2 },
        { q: '파란 멜빵바지를 입은 돼지는 누구일까요?', ans: 1 }, { q: '빨간 멜빵바지를 입은 돼지는 누구일까요?', ans: 2 }];
      const qs = POOL.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).slice(0, 2).map(v => v[1]);
      const order = [0, 1, 2].map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(v => v[1]); // 자리 → 돼지 번호
      await T.sceneCard('누구일까요?', () => { bg('meadow'); T.camSnap(500, 280, 1); });
      const P = portrait(), xs = P ? [414, 500, 586] : [250, 500, 750], ph = P ? 118 : 270;
      const row = order.map((pi, j) => sprite(`pig${pi + 1}_base`, xs[j], ph, GROUND + (P ? 30 : 0)));
      await look(500, 200);
      await say('아기 돼지들의 옷을 잘 보세요.');
      for (const q of qs) {
        const opts = row.map((a, j) => ({ el: a.pos, ok: order[j] === q.ans }));
        const pick = await T.ask(q.q, () => T.choose(opts, { prompt: q.q, where: '다시 한번 잘 보세요.', who: '반짝이는 돼지를 눌러 보세요.' }));
        const w = row[opts.indexOf(pick)]; w.hop(36, 450); sfx('pop');
        await say('맞아요! 이 돼지예요.');
      }
    }

    /* 2. 바람 실험 */
    await T.sceneCard('무엇으로 지을까?', () => {
      bg('shop'); T.camSnap(300, 280, 1);
    });
    const fan = sprite('fan', 90, 190);
    const mats = [sprite('straw', 310, 95), sprite('wood', 520, 105), sprite('bricks', 720, 150)];
    if (portrait()) fan.show(false);
    await look(310, 200);
    await say('가게에서 바람을 불어 보기로 했어요.');
    const lesson = ['짚은 훨훨 날아가요. 아주 가벼워요.', '나무는 흔들흔들! 조금 튼튼해요.', '벽돌은 끄떡없어요! 아주 아주 튼튼해요.'];
    for (let i = 0; i < 3; i++) {
      await look(mats[i].x - 20);
      if (!portrait()) fan.move(mats[i].x - 210, GROUND, 500);
      await T.mash(mats[i].pos, { count: 1, prompt: '손가락으로 톡 눌러서 바람을 불어 봐요.' });
      sfx('blow'); T.pop(mats[i].x - 60, 330, '후우~');
      if (i === 0) { mats[0].pos.style.transition = 'opacity 1s'; mats[0].pos.style.opacity = 0; mats[0].move(mats[0].x + 650, 250, 1100); }
      else if (i === 1) await mats[1].wiggle(14, 800);
      else { await sleep(500); T.pop(mats[2].x, 330, '끄떡없어!', '#3F6B4F'); }
      await say(lesson[i]);
    }

    /* 3~5. 집 짓기: 짓는 단계 그림이 땅에서 위로 올라오며 쌓인다 (그림이 없으면 완성 그림만 올라온다) */
    const PIECE = { straw: ['#D9A94E', 34, 9], wood: ['#8A5E3C', 46, 9], brick: ['#A93B32', 28, 13] };
    const stageArt = async kind => {
      const ok = await Promise.all([1, 2, 3].map(i => T.preload(U(`tp2_${kind}_s${i}`))));
      return ok.every(Boolean);
    };
    const mkStages = async (kind, x, h, y) => (await stageArt(kind)) ? [1, 2, 3].map(i => { const s = sprite(`tp2_${kind}_s${i}`, x, h, y); s.show(false); s.pos.style.pointerEvents = 'none'; return s; }) : [];
    /* 그림이 땅에서 위로 올라오며 나타난다 (clip 으로 아래부터 드러냄, 크기는 그대로) */
    async function reveal(a, ms = 380) {
      a.show(true);
      const im = a.pos.querySelector('image');
      const an = im.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { duration: ms, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'forwards' });
      try { await an.finished; } catch (e) { /* 취소 */ }
      try { an.cancel(); } catch (e) { /* 이미 끝남 */ }
    }
    /* 얇고 납작한 종이 조각 몇 장이 더미에서 집 자리로 톡 떨어진다 */
    function drop(kind, x0, y0, x1, y1, n = 3) {
      const [col, w, h] = PIECE[kind];
      for (let i = 0; i < n; i++) {
        const g = T.el('g', {}, T.world); g.style.pointerEvents = 'none';
        T.el('rect', { x: -w / 2 + 2, y: -h / 2 + 2, width: w, height: h, rx: 1.5, fill: '#2E241C', 'fill-opacity': .22 }, g);
        T.el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 1.5, fill: col }, g);
        if (kind === 'straw') T.el('rect', { x: -2, y: -h / 2, width: 4, height: h, fill: '#8A6A2E' }, g);
        if (kind === 'brick') T.el('rect', { x: -w / 2 + 3, y: -1, width: w - 6, height: 2, fill: '#E8D9BE', 'fill-opacity': .7 }, g);
        const tx = x1 + (i - (n - 1) / 2) * 38, ty = y1 + (i % 2) * 8, mx = (x0 + tx) / 2, my = Math.min(y0, ty) - 90;
        const rot = (i % 2 ? 1 : -1) * (14 + i * 6);
        g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
        const an = g.animate([
          { transform: `translate(${x0}px,${y0}px) rotate(0deg) scale(1)`, offset: 0 },
          { transform: `translate(${mx}px,${my}px) rotate(${rot}deg) scale(1)`, offset: .5 },
          { transform: `translate(${tx}px,${ty}px) rotate(${rot / 3}deg) scale(1)`, offset: .86 },
          { transform: `translate(${tx}px,${ty}px) rotate(${rot / 3}deg) scale(1.3,.8)`, offset: .93 },
          { transform: `translate(${tx}px,${ty}px) rotate(${rot / 3}deg) scale(1)`, opacity: 1, offset: 1 }], { duration: 520 + i * 70, delay: i * 90, easing: 'ease-in', fill: 'forwards' });
        an.finished.then(() => g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).finished).then(() => g.remove()).catch(() => g.remove());
      }
    }
    async function build({ label, bgKey, pigKey, pigH, playH, pileKey, pileH, houseKey, kind, stageAt, taps, play, line, done, tick, tease }) {
      const P = portrait();
      // 가로: 돼지·더미는 왼쪽, 집은 오른쪽 땅 위. 세로: 집이 가운데, 돼지·더미는 집 앞(아래)
      const L = P ? { pigX: 560, pigY: 548, pigS: .85, pileX: 735, pileY: 556, houseX: 640, houseY: 420, houseH: 310 }
        : { pigX: 160, pigY: GROUND, pigS: 1, pileX: 385, pileY: 490, houseX: 700, houseY: GROUND, houseH: 390 };
      await T.sceneCard(label, () => { bg(bgKey); T.camSnap(P ? L.houseX : L.pileX, 280, 1); });
      const stages = await mkStages(kind, L.houseX, L.houseH, L.houseY);
      const house = sprite(houseKey, L.houseX, L.houseH, L.houseY); house.show(false); house.pos.style.pointerEvents = 'none';
      const pig = sprite(pigKey, L.pigX, pigH * L.pigS, L.pigY);
      const pile = sprite(pileKey, L.pileX, pileH * (P ? .85 : 1), L.pileY);
      await look(P ? L.houseX : L.pileX, 200);
      await say(line);
      let cur = null; // 지금 보이는 단계 그림
      const target = [L.houseX, L.houseY - L.houseH * .25];
      const step = async i => {
        sfx(tick); pig.hop(26, 300); pile.wiggle(6, 300);
        T.pop(L.pileX, P ? 380 : 330, NUM[i - 1] || '톡');
        drop(kind, L.pileX, L.pileY - pileH * .5, target[0], target[1]);
        const last = i === taps, sIdx = stageAt[i];
        if (!stages.length) { // 단계 그림이 없으면 예전처럼 완성 그림만 올라온다
          if (last) { await sleep(300); await reveal(house); cur = house; }
          else await sleep(380);
        } else {
          await sleep(300);
          if (sIdx) { const s = stages[sIdx - 1]; await reveal(s); if (cur && cur !== s) cur.show(false); cur = s; s.hop(7, 200); }
          else if (cur) cur.wiggle(2.5, 280); // 망치질만 하는 차례
          else await sleep(200);
          if (last) {
            await sleep(180); await reveal(house); if (cur) cur.show(false); cur = house; house.hop(8, 240);
          }
        }
      };
      if (tease) {
        await T.mash(pile.pos, { count: tease.at, onStep: step, prompt: '쌓을 것을 톡톡 눌러요.' });
        await say(tease.line);
        await T.mash(pile.pos, { count: taps - tease.at, onStep: i => step(i + tease.at), prompt: '쌓을 것을 톡톡 눌러요.' });
      } else await T.mash(pile.pos, { count: taps, onStep: step, prompt: '쌓을 것을 톡톡 눌러요.' });
      pile.show(false);
      pig.set(play, playH * L.pigS); await look(L.houseX);
      sfx('ding'); T.confetti();
      await say(done);
      tune(tick === 'chop' ? [392, 440, 494, 523] : [523, 494, 440, 392]); pig.hop(40, 500);
      await sleep(700);
    }
    await build({ label: '첫째의 짚 집', bgKey: 'strawlot', pigKey: 'pig1_build', pigH: 245, playH: 245, pileKey: 'straw', pileH: 95, houseKey: 'house_straw', kind: 'straw',
      stageAt: { 1: 1, 2: 2, 3: 3 }, taps: 3, play: 'pig1_play', tick: 'pop',
      line: '첫째는 짚으로 집을 짓기로 했어요. 짚을 톡톡톡 쌓아요!', done: '뚝딱! 짚 집이 완성됐어요. 첫째는 피리를 불며 놀았어요.' });
    await build({ label: '둘째의 나무 집', bgKey: 'woodlot', pigKey: 'pig2_build', pigH: 230, playH: 214, pileKey: 'wood', pileH: 100, houseKey: 'house_wood', kind: 'wood',
      stageAt: { 1: 1, 3: 2, 5: 3 }, taps: 5, play: 'pig2_play', tick: 'chop',
      line: '둘째는 나무로 집을 짓기로 했어요. 망치로 톡톡톡톡톡!', done: '쿵쾅쿵쾅! 나무 집이 완성됐어요. 둘째는 바이올린을 켜며 놀았어요.' });
    await build({ label: '셋째의 벽돌 집', bgKey: 'bricklot', pigKey: 'pig3_build', pigH: 215, playH: 215, pileKey: 'bricks', pileH: 140, houseKey: 'house_brick', kind: 'brick',
      stageAt: { 3: 1, 6: 2, 9: 3 }, taps: 10, play: 'pig3_play', tick: 'thud',
      tease: { at: 5, line: '형들이 놀렸어요. "아직도 해? 우리랑 놀자!" 그래도 셋째는 천천히 벽돌을 쌓았어요.' },
      line: '셋째는 벽돌로 집을 짓기로 했어요. 벽돌은 무거워서 열 장을 천천히 쌓아요.', done: '벽돌을 열 장 다 쌓았어요. 튼튼한 벽돌 집이 완성됐어요!' });

    /* 6~7. 늑대가 후~ */
    async function blow({ label, bgKey, houseKey, ruinKey, cutKey, lines, pigKeys }) {
      const P = portrait();
      const hx = P ? 640 : 700, hy = P ? 420 : GROUND, houseH = P ? 310 : 390, pigH = P ? 150 : 215;
      await T.sceneCard(label, () => { bg(bgKey); T.camSnap(P ? hx : 500, 280, 1); });
      const house = sprite(houseKey, hx, houseH, hy);
      const pg = pigKeys.map((k, i) => sprite(k, hx - (P ? 50 : 70) + i * (P ? 100 : 140), pigH, hy + (P ? 20 : 0)));
      pg.forEach(p => { p.show(false); p.pos.style.pointerEvents = 'none'; }); // 숨은 돼지가 집 누름을 가로막지 않게
      const wy = P ? 548 : GROUND, wx = P ? 560 : 330, wh = P ? 170 : 230;
      const wolf = sprite('wolf_sniff', -160, wh, wy); wolf.face('right');
      await look(P ? hx : 500, 200);
      wolf.move(wx, wy, 1300); await sleep(700);
      sfx('step_grass');
      await wolf.wiggle(5, 500);
      await say(lines[0]);
      await say(lines[1]);
      wolf.set('wolf_puff', wh);
      let n = 0;
      await T.mash(house.pos, { count: 3, prompt: '손가락으로 톡톡 눌러서 늑대와 같이 후~ 불어요.', onStep: i => {
        n = i; sfx('blow'); T.pop(P ? hx - 90 : wx + 130, 300, '후~!'); house.wiggle(5 + i * 4, 450); wolf.hop(10, 300);
      } });
      sfx('boom'); T.shake();
      house.set(ruinKey, houseH * .7);
      pg.forEach(p => { p.show(true); p.hop(30, 350); });
      await say(lines[2]);
      await T.cutImage([{ src: U(cutKey), hold: 3200 }]);
      pg.forEach((p, i) => { p.set(pigKeys[i].replace('base', 'flee')); p.move(1200, hy, 1100 + i * 150); });
      await sleep(900);
      await say(lines[3]);
    }
    await blow({ label: '후~ 짚 집', bgKey: 'strawlot', houseKey: 'house_straw', ruinKey: 'house_straw_ruin', cutKey: 'cut_strawhat', pigKeys: ['pig1_base'],
      lines: ['그때 배고픈 늑대가 킁킁 냄새를 맡으며 왔어요. "아기 돼지야, 문 열어라!"', '첫째가 말했어요. "싫어요, 싫어요!" 늑대가 말했어요. "그럼 후~ 불어서 날려 버릴 테야!"',
        '짚 집이 훨훨 날아가 버렸어요!', '첫째는 둘째네 집으로 달려갔어요.'] });
    await blow({ label: '후~ 나무 집', bgKey: 'woodlot', houseKey: 'house_wood', ruinKey: 'house_wood_ruin', cutKey: 'cut_planks', pigKeys: ['pig1_base', 'pig2_base'],
      lines: ['늑대가 나무 집에도 왔어요. "아기 돼지야, 문 열어라!"', '첫째와 둘째가 말했어요. "싫어요, 싫어요!" 늑대가 말했어요. "그럼 후~ 후~ 불어 주지!"',
        '나무 집이 와르르 무너졌어요!', '아기 돼지 둘은 막내네 집으로 달려갔어요.'] });

    /* 8. 어느 집으로? */
    await T.sceneCard('어느 집으로?', () => { bg('field'); T.camSnap(500, 280, 1); });
    const small = portrait(), gap = small ? 88 : 300, ch = small ? 76 : 270; // 세 집은 같은 높이 (벽돌만 튼튼해 보이게 키우지 않는다)
    const choiceA = sprite('house_straw', 500 - gap, ch, 470), choiceB = sprite('house_wood', 500, ch, 470), choiceC = sprite('house_brick', 500 + gap, ch, 470);
    const runners = [sprite('pig1_flee', 60, small ? 55 : 150, 540), sprite('pig2_flee', 150, small ? 55 : 150, 540)];
    await look(500, 200);
    const pick = await T.ask('두 형은 숨이 차서 헉헉! 어느 집으로 가야 할까요?', () => T.choose([{ el: choiceA.pos }, { el: choiceB.pos }, { el: choiceC.pos, ok: true }],
      { prompt: '가장 튼튼한 집을 골라 봐요!', where: '짚은 너무 가벼워요. 다시 골라 봐요.', who: '벽돌 집이 가장 튼튼해요!' }));
    runners.forEach((r, i) => r.move(choiceC.x - 30 + i * 40, 540, 1000 + i * 200));
    choiceC.hop(20, 400); sfx('ding');
    await sleep(1300);
    await say('맞아요! 가장 튼튼한 벽돌 집이에요. 삼 형제는 문을 꼭 닫았어요.');

    /* 9. 집 안, 그리고 늑대 */
    await T.sceneCard('벽돌 집 안', () => { bg('brick_in'); T.camSnap(450, 280, 1); });
    const inside = [sprite('pig1_base', 300, 210), sprite('pig2_base', 440, 210), sprite('pig3_base', 580, 210)];
    await look(440, 200);
    let askG1 = '삼 형제는 모두 모였어요. 하나, 둘, 셋을 세어 볼까요?'; // 안내는 첫 번째 누름에만 (T.ask)
    const askOnce1 = f => { const g = askG1; askG1 = null; return g ? T.ask(g, f) : f(); };
    for (let i = 0; i < 3; i++) {
      await look(inside[i].x);
      await askOnce1(() => T.tap(inside[i].pos, { prompt: '아기 돼지를 톡 눌러요.' }));
      inside[i].hop(36); T.pop(inside[i].x, 260, NUM[i]); sfx('pop');
    }
    await say('"셋이서 함께라서 무섭지 않아!"');
    await T.sceneCard('쿵쿵쿵!', () => { bg('brick_out'); T.camSnap(450, 280, 1); });
    const wolf2 = sprite('wolf_puff', 230, 210);
    wolf2.face('right');
    const wall = hit(420, 190, 270, 290);
    await look(450, 200);
    await say('늑대가 벽돌 집에 왔어요. "아기 돼지야, 문 열어라!"');
    await say('"싫어요, 싫어요!" "그럼 후~ 후~ 불어 주지!"');
    await T.mash(wall, { count: 8, prompt: '집을 톡톡 눌러서 몇 번 부는지 세어 봐요.', onStep: i => {
      sfx('blow'); T.pop(400, 300, NUM[i - 1]); wolf2.hop(12, 300);
    } });
    await say('후~ 후~ 여덟 번이나 불었지만 벽돌 집은 끄떡없어요!');
    wolf2.set('wolf_tired', 230); sfx('thud');
    await T.cutImage([{ src: U('cut_tired'), hold: 3200 }]);
    await say('늑대는 숨이 차서 털썩 주저앉았어요.');

    /* 10. 굴뚝 */
    await T.cutImage([{ src: U('cut_crawl'), hold: 3200 }]);
    await say('늑대는 지붕으로 살금살금 올라갔어요. 굴뚝으로 몰래 들어가려고요.');
    await T.sceneCard('보글보글', () => { bg('chimney'); T.camSnap(500, 280, 1); });
    const fire = hit(425, 290, 150, 100); // 2026-10-20 새 배경: 벽난로 불이 무대 y≈345 (옛 그림은 바닥 근처였다)
    const glow = T.el('ellipse', { cx: 500, cy: 348, rx: 10, ry: 8, fill: '#FFB347', opacity: 0, 'pointer-events': 'none' }, T.world);
    await say('아기 돼지들은 큰 솥에 물을 팔팔 끓였어요.');
    await T.mash(fire, { count: 5, prompt: '불을 톡톡 눌러서 크게 해 줘요.', onStep: i => {
      const p = i / 5;
      glow.setAttribute('rx', 14 + 40 * p); glow.setAttribute('ry', 10 + 26 * p); glow.setAttribute('opacity', .1 + .28 * p);
      T.pop(500 + (Math.random() - .5) * 100, 250, '보글');
    } });
    sfx('ding');
    await say('보글보글 물이 끓어요! 그때 굴뚝에서 늑대가 쑥 내려왔어요.');
    await T.cutImage([{ src: U('cut_chimney'), hold: 2600 }, { src: U('cut_splash'), hold: 3200, sfx: 'splash' }]);
    await say('"앗, 뜨거워!"');
    await T.cutImage([{ src: U('cut_launch'), hold: 3400, sfx: 'boing' }]);
    await say('늑대는 굴뚝으로 휙! 날아가서 멀리멀리 도망쳤어요. 다시는 오지 않았어요.');

    /* 11. 벽돌 마을 */
    await T.sceneCard('벽돌 마을', () => { bg('sunset'); T.camSnap(500, 280, 1); });
    const hx = portrait() ? [500, 230, 770] : [500, 200, 800], vh = portrait() ? 230 : 270;
    const hs = hx.map(x => sprite('house_brick', x, vh));
    const vOk = await stageArt('brick');
    const vstages = hx.map(x => vOk ? [1, 2, 3].map(i => { const s = sprite(`tp2_brick_s${i}`, x, vh); s.show(false); s.pos.style.pointerEvents = 'none'; return s; }) : []);
    hs[1].show(false); hs[2].show(false);
    const band = [sprite('pig1_base', 380, 140, 548), sprite('pig2_base', 500, 140, 548), sprite('pig3_base', 620, 140, 548)];
    band.forEach(b => { b.pos.style.pointerEvents = 'none'; }); // 앞에 선 돼지가 집 누름을 가로막지 않게
    await look(500, 200);
    await say('이제 늑대는 오지 않아요. 아기 돼지들은 벽돌 집을 더 지었어요.');
    T.pop(500, 240, NUM[0]);
    for (let i = 1; i < 3; i++) {
      await look(hs[i - 1].x);
      await T.tap(hs[i - 1].pos, { prompt: '집을 톡 눌러서 새 집을 지어요.' });
      sfx('thud'); band.forEach((b, j) => setTimeout(() => b.hop(24, 300), j * 100)); await look(hs[i].x);
      drop('brick', band[i].x, 480, hs[i].x, GROUND - vh * .25, 4);
      let prev = null; await sleep(300);
      for (const s of vstages[i]) { await reveal(s, 260); if (prev) prev.show(false); prev = s; }
      await reveal(hs[i], 300); if (prev) prev.show(false); hs[i].hop(8, 240); T.pop(hs[i].x, 240, NUM[i]); sfx('ding');
    }
    await look(500, 700);
    await say('하나, 둘, 셋! 튼튼한 벽돌 집이 세 채가 되었어요.');
    band.forEach((b, i) => b.set(['pig1_play', 'pig2_play', 'pig3_play'][i], 150));
    T.confetti();
    for (let r = 0; r < 4; r++) { tune([392, 523, 440, 587]); band.forEach((b, i) => setTimeout(() => b.hop(28, 350), i * 150)); await sleep(900); }
    await T.cutImage([{ src: U('cut_village'), hold: 3600 }]);
    await say('삼 형제는 튼튼한 집에서 오래오래 행복하게 살았어요.');
    return '튼튼한 집은 하나씩 정성껏 쌓아서 만들어요!';
  }

  Tale.mount({ title: '아기 돼지 삼형제', subtitle: '튼튼한 집은 어떤 집일까요?', run: T => run(Tale.api) });
})();
