/* 아기 돼지 삼형제 — 목업 (그림 파일은 assets/v3w/tp_*.webp, 낭독 파일 없이 글자만으로 진행) */
(() => {
  const U = n => `../../assets/v3w/tp_${n}.webp`;
  const SZ = {
    pig1_base: [365, 480], pig1_build: [471, 480], pig1_flee: [407, 480], pig1_joy: [361, 480], pig1_play: [342, 480],
    pig2_base: [378, 480], pig2_build: [442, 480], pig2_flee: [401, 480], pig2_joy: [410, 480], pig2_play: [453, 480],
    pig3_base: [353, 480], pig3_build: [416, 480], pig3_flee: [416, 480], pig3_joy: [392, 480], pig3_play: [314, 480],
    mama: [416, 480], wolf_walk: [480, 363], wolf_sniff: [480, 346], wolf_puff: [480, 325], wolf_tired: [369, 480],
    wolf_hot: [222, 480], wolf_flee: [480, 243], straw: [480, 217], wood: [480, 245], bricks: [480, 428], brick1: [480, 242],
    house_straw: [918, 537], house_straw_ruin: [944, 517], house_wood: [748, 671], house_wood_ruin: [889, 664],
    house_brick: [845, 729], pot: [480, 222], fan: [416, 480], instruments: [480, 237],
  };
  const BG = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const NUM = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  const GROUND = 480;

  async function run(T) {
    const say = T.say, sleep = T.sleep;
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
        a.h = hh; const [w0, h0] = SZ[n], w = hh * w0 / h0;
        im.setAttribute('href', U(n)); im.setAttribute('x', -w / 2); im.setAttribute('y', -hh);
        im.setAttribute('width', w); im.setAttribute('height', hh);
      };
      a.show = on => { a.pos.style.opacity = on ? 1 : 0; };
      a.set(name, h);
      return a;
    }
    async function grow(a, to, ms = 420) {
      const from = a.scale, t0 = performance.now();
      for (;;) {
        const k = Math.min(1, (performance.now() - t0) / ms);
        a.setScale(from + (to - from) * k * (2 - k));
        if (k >= 1) return;
        await raf();
      }
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
    await say('엄마가 말했어요. "이제 각자 집을 지어 보렴."');
    mama.wiggle(6, 700);
    const intro = ['첫째 돼지는 목도리를 둘렀어요.', '둘째 돼지는 파란 멜빵바지를 입었어요.', '셋째 돼지는 빨간 멜빵바지를 입었어요.'];
    const first = ['첫째!', '둘째!', '셋째!'];
    for (let i = 0; i < 3; i++) {
      await look(pigs[i].x - 40);
      await T.tap(pigs[i].pos, { prompt: '아기 돼지를 톡 눌러 봐요.' });
      pigs[i].hop(40); T.pop(pigs[i].x, 250, first[i]); sfx('pop');
      await say(intro[i]);
    }
    await look(500);
    await say('삼 형제는 엄마께 인사하고 길을 떠났어요.');

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

    /* 3~5. 집 짓기 */
    async function build({ label, bgKey, pigKey, pigX, pileKey, pileH, pileX, houseKey, houseH, houseX, taps, play, line, done, tick, tease }) {
      await T.sceneCard(label, () => { bg(bgKey); T.camSnap(pileX, 280, 1); });
      const pig = sprite(pigKey, portrait() ? pileX - 120 : pigX, 230);
      const pile = sprite(pileKey, pileX, pileH, 490);
      const house = sprite(houseKey, houseX, houseH); house.setScale(.05); house.show(false);
      await look(pileX, 200);
      await say(line);
      let made = 0;
      const step = async i => {
        sfx(tick); pig.hop(26, 300); pile.wiggle(6, 300);
        T.pop(pileX, 330, NUM[i - 1] || '톡');
        house.show(true); await grow(house, .25 + .75 * i / taps, 380);
        made = i;
      };
      if (tease) {
        await T.mash(pile.pos, { count: tease.at, onStep: step, prompt: '쌓을 것을 톡톡 눌러요.' });
        await say(tease.line);
        await T.mash(pile.pos, { count: taps - tease.at, onStep: i => step(i + tease.at), prompt: '쌓을 것을 톡톡 눌러요.' });
      } else await T.mash(pile.pos, { count: taps, onStep: step, prompt: '쌓을 것을 톡톡 눌러요.' });
      pile.show(false);
      pig.set(play); await look(houseX);
      sfx('ding'); T.confetti();
      await say(done);
      tune(tick === 'chop' ? [392, 440, 494, 523] : [523, 494, 440, 392]); pig.hop(40, 500);
      await sleep(700);
    }
    await build({ label: '첫째의 짚 집', bgKey: 'strawlot', pigKey: 'pig1_build', pigX: 380, pileKey: 'straw', pileH: 95, pileX: 560, houseKey: 'house_straw', houseH: 210, houseX: 720, taps: 3, play: 'pig1_play', tick: 'pop',
      line: '첫째는 짚으로 집을 짓기로 했어요. 짚을 톡톡톡 쌓아요!', done: '뚝딱! 짚 집이 완성됐어요. 첫째는 피리를 불며 놀았어요.' });
    await build({ label: '둘째의 나무 집', bgKey: 'woodlot', pigKey: 'pig2_build', pigX: 380, pileKey: 'wood', pileH: 100, pileX: 560, houseKey: 'house_wood', houseH: 210, houseX: 720, taps: 5, play: 'pig2_play', tick: 'chop',
      line: '둘째는 나무로 집을 짓기로 했어요. 망치로 톡톡톡톡톡!', done: '쿵쾅쿵쾅! 나무 집이 완성됐어요. 둘째는 바이올린을 켜며 놀았어요.' });
    await build({ label: '셋째의 벽돌 집', bgKey: 'bricklot', pigKey: 'pig3_build', pigX: 380, pileKey: 'bricks', pileH: 140, pileX: 560, houseKey: 'house_brick', houseH: 210, houseX: 720, taps: 10, play: 'pig3_play', tick: 'thud',
      tease: { at: 5, line: '형들이 놀렸어요. "아직도 해? 우리랑 놀자!" 그래도 셋째는 천천히 벽돌을 쌓았어요.' },
      line: '셋째는 벽돌로 집을 짓기로 했어요. 벽돌은 무거워서 하나, 둘, 셋 천천히 쌓아요.', done: '벽돌을 열 장 다 쌓았어요. 튼튼한 벽돌 집이 완성됐어요!' });

    /* 6~7. 늑대가 후~ */
    async function blow({ label, bgKey, houseKey, ruinKey, houseH, houseX, cutKey, lines, pigKeys }) {
      await T.sceneCard(label, () => { bg(bgKey); T.camSnap(450, 280, 1); });
      const house = sprite(houseKey, houseX, houseH);
      const pg = pigKeys.map((k, i) => sprite(k, houseX - 70 + i * 140, 200));
      pg.forEach(p => p.show(false));
      const wolf = sprite('wolf_sniff', -160, 220); wolf.face('right');
      await look(450, 200);
      wolf.move(280, GROUND, 1300); await sleep(700);
      sfx('step_grass');
      await wolf.wiggle(5, 500);
      await say(lines[0]);
      await say(lines[1]);
      wolf.set('wolf_puff', 200);
      let n = 0;
      await T.mash(house.pos, { count: 3, prompt: '손가락으로 톡톡 눌러서 늑대와 같이 후~ 불어요.', onStep: i => {
        n = i; sfx('blow'); T.pop(houseX - 140, 300, '후~!'); house.wiggle(5 + i * 4, 450); wolf.hop(10, 300);
      } });
      sfx('boom'); T.shake();
      house.set(ruinKey, houseH * .7);
      pg.forEach(p => { p.show(true); p.hop(30, 350); });
      await say(lines[2]);
      await T.cutImage([{ src: U(cutKey), hold: 3200 }]);
      pg.forEach((p, i) => { p.set(pigKeys[i].replace('base', 'flee')); p.move(1200, GROUND, 1100 + i * 150); });
      await sleep(900);
      await say(lines[3]);
    }
    await blow({ label: '후~ 짚 집', bgKey: 'strawlot', houseKey: 'house_straw', ruinKey: 'house_straw_ruin', houseH: 210, houseX: 560, cutKey: 'cut_strawhat', pigKeys: ['pig1_base'],
      lines: ['그때 배고픈 늑대가 킁킁 냄새를 맡으며 왔어요. "아기 돼지야, 문 열어라!"', '첫째가 말했어요. "싫어요, 싫어요!" 늑대가 말했어요. "그럼 후~ 불어서 날려 버릴 테야!"',
        '짚 집이 훨훨 날아가 버렸어요!', '첫째는 둘째네 집으로 달려갔어요.'] });
    await blow({ label: '후~ 나무 집', bgKey: 'woodlot', houseKey: 'house_wood', ruinKey: 'house_wood_ruin', houseH: 210, houseX: 560, cutKey: 'cut_planks', pigKeys: ['pig1_base', 'pig2_base'],
      lines: ['늑대가 나무 집에도 왔어요. "아기 돼지야, 문 열어라!"', '첫째와 둘째가 말했어요. "싫어요, 싫어요!" 늑대가 말했어요. "그럼 후~ 후~ 불어 주지!"',
        '나무 집이 와르르 무너졌어요!', '아기 돼지 둘은 막내네 집으로 달려갔어요.'] });

    /* 8. 어느 집으로? */
    await T.sceneCard('어느 집으로?', () => { bg('field'); T.camSnap(500, 280, 1); });
    const small = portrait(), k = small ? .42 : 1, gap = small ? 90 : 260;
    const choiceA = sprite('straw', 500 - gap, 110 * k, 470), choiceB = sprite('wood', 500, 120 * k, 470), choiceC = sprite('house_brick', 500 + gap, 230 * k, 470);
    const runners = [sprite('pig1_flee', 60, 120), sprite('pig2_flee', 160, 120)];
    await look(500, 200);
    await say('두 형은 숨이 차서 헉헉! 어느 집으로 가야 할까요?');
    const pick = await T.choose([{ el: choiceA.pos }, { el: choiceB.pos }, { el: choiceC.pos, ok: true }],
      { prompt: '가장 튼튼한 집을 골라 봐요!', where: '짚은 너무 가벼워요. 다시 골라 봐요.', who: '벽돌 집이 가장 튼튼해요!' });
    runners.forEach((r, i) => r.move(choiceC.x - 30 + i * 40, 470, 1000 + i * 200));
    choiceC.hop(20, 400); sfx('ding');
    await sleep(1300);
    await say('맞아요! 가장 튼튼한 벽돌 집이에요. 삼 형제는 문을 꼭 닫았어요.');

    /* 9. 집 안, 그리고 늑대 */
    await T.sceneCard('벽돌 집 안', () => { bg('brick_in'); T.camSnap(450, 280, 1); });
    const inside = [sprite('pig1_base', 300, 210), sprite('pig2_base', 440, 210), sprite('pig3_base', 580, 210)];
    await look(440, 200);
    await say('삼 형제는 모두 모였어요. 하나, 둘, 셋을 세어 볼까요?');
    for (let i = 0; i < 3; i++) {
      await look(inside[i].x);
      await T.tap(inside[i].pos, { prompt: '아기 돼지를 톡 눌러요.' });
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
    const fire = hit(420, 330, 160, 150);
    const glow = T.el('ellipse', { cx: 500, cy: 440, rx: 10, ry: 8, fill: '#FFB347', opacity: 0 }, T.world);
    await say('아기 돼지들은 큰 솥에 물을 팔팔 끓였어요.');
    await T.mash(fire, { count: 5, prompt: '불을 톡톡 눌러서 크게 해 줘요.', onStep: i => {
      const p = i / 5;
      glow.setAttribute('rx', 20 + 120 * p); glow.setAttribute('ry', 14 + 80 * p); glow.setAttribute('opacity', .15 + .45 * p);
      T.pop(500 + (Math.random() - .5) * 120, 300, '보글');
    } });
    sfx('ding');
    await say('보글보글 물이 끓어요! 그때 굴뚝에서 늑대가 쑥 내려왔어요.');
    await T.cutImage([{ src: U('cut_chimney'), hold: 2600 }, { src: U('cut_splash'), hold: 3200, sfx: 'splash' }]);
    await say('"앗, 뜨거워!"');
    await T.cutImage([{ src: U('cut_launch'), hold: 3400, sfx: 'boing' }]);
    await say('늑대는 굴뚝으로 휙! 날아가서 멀리멀리 도망쳤어요. 다시는 오지 않았어요.');

    /* 11. 벽돌 마을 */
    await T.sceneCard('벽돌 마을', () => { bg('sunset'); T.camSnap(500, 280, 1); });
    const hx = portrait() ? [500, 340, 660] : [500, 230, 770];
    const hs = hx.map(x => sprite('house_brick', x, portrait() ? 130 : 200));
    hs[1].setScale(.05); hs[1].show(false); hs[2].setScale(.05); hs[2].show(false);
    await look(500, 200);
    await say('이제 늑대는 오지 않아요. 아기 돼지들은 벽돌 집을 더 지었어요.');
    T.pop(500, 240, NUM[0]);
    for (let i = 1; i < 3; i++) {
      await look(hs[i - 1].x);
      await T.tap(hs[i - 1].pos, { prompt: '집을 톡 눌러서 새 집을 지어요.' });
      sfx('thud'); await look(hs[i].x); hs[i].show(true); await grow(hs[i], 1, 450); T.pop(hs[i].x, 240, NUM[i]); sfx('ding');
    }
    await look(500, 700);
    await say('하나, 둘, 셋! 튼튼한 벽돌 집이 세 채가 되었어요.');
    const band = [sprite('pig1_play', 380, 150, 540), sprite('pig2_play', 500, 150, 540), sprite('pig3_play', 620, 150, 540)];
    T.confetti();
    for (let r = 0; r < 4; r++) { tune([392, 523, 440, 587]); band.forEach((b, i) => setTimeout(() => b.hop(28, 350), i * 150)); await sleep(900); }
    await T.cutImage([{ src: U('cut_village'), hold: 3600 }]);
    await say('삼 형제는 튼튼한 집에서 오래오래 행복하게 살았어요.');
    return '튼튼한 집은 하나씩 정성껏 쌓아서 만들어요!';
  }

  Tale.mount({ title: '아기 돼지 삼형제', subtitle: '튼튼한 집은 어떤 집일까요?', run: T => run(Tale.api) });
})();
