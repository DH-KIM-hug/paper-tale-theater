/* 요술 항아리 — 목업. 착한 농부가 밭에서 요술 항아리를 얻어 이웃과 나누고, 욕심쟁이 부자는 항아리를 빌려 가 소동을 벌이지만 나눌 줄 알게 된다.
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { coin: .9785, farmer_amaze: .71, farmer_count: .6029, farmer_feast: .7971, farmer_hoe: .6571, farmer_pull: .6771,
    farmer_share: .5886, father_fall: .9856, father_fightA: .6357, father_fightB: .6443, father_peek: .7357, fwife: .5129,
    fwife_share: .5271, gold: 1.5695, hoe: 3.2864, jar: 1.0294, jar_cracked: 1.2797, rice: .8886, rich_gold: .6471, rich_grab: .7143,
    rich_hurry: .8071, rich_pinned: 1.2238, rich_shout: .7143, table: 1.566 };
  const BGS = ['field', 'pit', 'jarfront', 'village', 'richgate', 'hall', 'hallwide', 'feast'];
  const CUTS = ['clink', 'twohoes', 'coins', 'buried', 'plop', 'eight', 'smash', 'hungry'];
  const bgSrc = k => AS + 'mj_bg_' + k + '.webp', cutSrc = k => AS + 'mj_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };

  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'mj_' + f + '.webp', x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
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
  const prop = (T, f, h) => mk(T, { a: [f, h, 'left'] });
  function put(T, a, x, y = GROUND, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };

  function bgImage(T, key, { x = BGBOX.x, y = BGBOX.y, w = BGBOX.w, h = BGBOX.h, parent } = {}) {
    return T.el('image', { href: bgSrc(key), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent || T.bg);
  }
  const hot = (T, cx, cy, r) => T.el('circle', { cx, cy, r, fill: '#fff', 'fill-opacity': .01 }, T.world);
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!', '여섯!', '일곱!', '여덟!'];

  async function run(T) {
    const { sleep, say, camSnap } = T;
    const tr = T.tr;
    const pan = (cx = 500) => camSnap(T.viewWidth() < 990 ? cx : 500, 280, 1);
    const scene = (key, cx) => { T.clear(); bgImage(T, key); pan(cx); };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    const farmer = mk(T, { hoe: ['farmer_hoe', 250, 'left'], pull: ['farmer_pull', 250, 'left'], amaze: ['farmer_amaze', 250, 'left'],
      count: ['farmer_count', 250, 'left'], share: ['farmer_share', 250, 'left'], feast: ['farmer_feast', 250, 'left'] });
    const wife = mk(T, { clap: ['fwife', 250, 'left'], share: ['fwife_share', 250, 'left'] });
    const rich = mk(T, { shout: ['rich_shout', 260, 'left'], grab: ['rich_grab', 260, 'left'], gold: ['rich_gold', 260, 'left'],
      pinned: ['rich_pinned', 190, 'left'], hurry: ['rich_hurry', 240, 'left'] });
    const jar = prop(T, 'jar', 170), cracked = prop(T, 'jar_cracked', 130);
    const hoe = prop(T, 'hoe', 62);
    const olds = Array.from({ length: 8 }, (_, i) => mk(T, { a: ['father_fightA', 180, 'left'], b: ['father_fightB', 180, 'left'] }));
    const father = mk(T, { peek: ['father_peek', 210, 'left'], fall: ['father_fall', 150, 'left'] });

    /* --- 1. 밭 --- */
    scene('field');
    put(T, farmer, 460, 480, { look: 'hoe', to: 'right' });
    await T.curtain(true);
    await say('옛날 옛날에 마음씨 착한 농부가 살았어요.');
    await say('농부는 밭을 열심히 갈았어요. 농부를 톡톡톡 눌러서 밭을 갈아 봐요!');
    await T.mash(farmer.pos, { count: 3, prompt: '농부를 톡톡톡! 괭이질을 해요.', onStep: i => {
      farmer.hop(16, 300); AudioFX.sfx('pop'); T.pop(farmer.x + 90, farmer.y - 190, tr(['영차!', '영차영차!', '으랏차!'][i - 1]));
    } });
    await T.cutImage([{ src: cutSrc('clink'), sfx: 'pop', hold: 2800 }], { hold: 2800 });
    await say('쨍! 괭이 끝에 뭔가 딱딱한 게 닿았어요.');

    /* --- 2. 항아리 캐내기 --- */
    await T.sceneCard(tr('땅속'), () => {
      scene('pit');
      put(T, farmer, 700, 520, { look: 'pull', to: 'left' });
      put(T, jar, 500, 430); jar.pos.style.opacity = 0;
    }, farmer.pos);
    await say('땅속에서 둥근 뚜껑이 보여요. 농부를 톡톡톡 눌러서 힘껏 당겨 봐요!');
    await T.mash(farmer.pos, { count: 3, prompt: '농부를 톡톡톡! 영차 당겨요.', onStep: i => {
      farmer.hop(14, 300); popSfx(T); T.pop(farmer.x - 60, farmer.y - 220, tr(['영차!', '영차영차!', '으랏차!'][i - 1]));
    } });
    jar.pos.style.opacity = 1; jar.hop(40, 500);
    farmer.look('amaze');
    await say('쑥! 커다란 항아리가 나왔어요. 농부는 눈이 동그래졌어요.');

    /* --- 3. 괭이가 두 개? --- */
    await T.sceneCard(tr('마당'), () => {
      scene('jarfront');
      put(T, jar, 520, 500); put(T, farmer, 270, 500, { look: 'hoe', to: 'right' });
      put(T, wife, 780, 500, { look: 'clap', to: 'left' });
      put(T, hoe, 400, 470);
    }, jar.pos);
    await say('농부는 항아리를 집 마당에 놓았어요. 아내도 구경하러 나왔어요.');
    await say('농부가 괭이를 항아리 옆에 두려다 그만 항아리 속에 떨어뜨렸어요. 괭이를 톡!');
    await T.tap(hoe.pos, { prompt: '괭이를 톡! 항아리에 넣어요.' });
    await hoe.move(520, 400, 450, 'ease-in'); hide(hoe); jar.hop(14, 260);
    await T.cutImage([{ src: cutSrc('twohoes'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    await say('"어머나! 괭이가 두 개가 되었어요!" 아내가 깜짝 놀랐어요.');
    await say('항아리를 톡톡톡 눌러서 괭이가 몇 개 나오는지 세어 봐요!');
    const hoes = [];
    await T.mash(jar.pos, { count: 3, prompt: '항아리를 톡톡톡! 괭이를 세어 봐요.', onStep: i => {
      const h2 = prop(T, 'hoe', 62); put(T, h2, 760 + (i % 2) * 40, 330 + i * 56);
      h2.pos.animate([{ opacity: 0 }, { opacity: 1 }], 250); hoes.push(h2);
      jar.hop(12, 240); popSfx(T); T.pop(h2.x, h2.y - 60, tr(NUM[i - 1]));
    } });
    await say('괭이가 하나, 둘, 셋! 농부와 아내는 손뼉을 쳤어요.');
    await wife.hop(30, 400);

    /* --- 4. 엽전 --- */
    await T.cutImage([{ src: cutSrc('coins'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    scene('jarfront');
    hoes.forEach(h => hide(h));
    put(T, jar, 520, 500); put(T, farmer, 270, 500, { look: 'count', to: 'right' }); put(T, wife, 780, 500, { look: 'clap', to: 'left' });
    await say('이번에는 엽전 하나를 넣어 봤어요. 와르르! 엽전이 쏟아져 나왔어요.');
    await say('항아리를 톡톡톡톡톡 눌러서 엽전을 다섯 개 세어 봐요!');
    await T.mash(jar.pos, { count: 5, prompt: '항아리를 톡톡톡톡톡! 엽전을 세어 봐요.', onStep: i => {
      const c = prop(T, 'coin', 52); put(T, c, 280 + i * 90, 548);
      c.pos.animate([{ opacity: 0, translate: '0 -40px' }, { opacity: 1, translate: '0 0' }], 280);
      jar.hop(10, 220); clinkSfx(T); T.pop(c.x, c.y - 70, tr(NUM[i - 1]));
    } });
    await say('엽전이 하나, 둘, 셋, 넷, 다섯! 이제 쌀도 사고 옷도 살 수 있어요.');

    /* --- 5. 이웃에게 나눠 주기 --- */
    await T.sceneCard(tr('이웃 마을'), () => {
      scene('village');
      put(T, farmer, 500, 540, { look: 'share', to: 'left' });
    }, farmer.pos);
    await say('착한 농부는 혼자만 쓰지 않았어요. 이웃 다섯 집에 쌀을 나눠 주러 갔어요.');
    const spots = [78, 297, 500, 719, 922];
    let rest = spots.map((x, i) => ({ x, i }));
    for (let n = 0; n < 5; n++) {
      const opts = rest.map(r => ({ key: r, el: hot(T, r.x, 400, 70), ok: true }));
      const got = await T.choose(opts, { prompt: '집을 톡! 쌀을 나눠 줘요.' });
      opts.forEach(o => o.el.remove());
      rest = rest.filter(r => r !== got.key);
      const sack = prop(T, 'rice', 62); put(T, sack, farmer.x, 440);
      popSfx(T);
      await sack.move(got.key.x, 450, 520, 'ease-in');
      sack.hop(16, 260); T.pop(got.key.x, 350, tr(NUM[n]));
      farmer.hop(12, 240);
    }
    await say('다섯 집 모두 쌀을 받고 활짝 웃었어요. 마을이 함께 행복해졌어요.');

    /* --- 6. 욕심쟁이 부자 --- */
    await T.sceneCard(tr('부잣집'), () => {
      scene('richgate');
      put(T, rich, 740, 520, { look: 'shout', to: 'left' });
      put(T, farmer, 380, 520, { look: 'share', to: 'right' });
      put(T, jar, 500, 520); hide(jar);
    }, rich.pos);
    await say('소문을 들은 부잣집 주인이 농부를 불렀어요. "그 항아리를 나한테 빌려주게!"');
    await say('마음씨 착한 농부는 웃으며 말했어요. "필요하시면 쓰세요. 잘 쓰고 돌려주세요!" 항아리를 톡!');
    put(T, jar, 430, 520);
    await T.tap(jar.pos, { prompt: '항아리를 톡! 부자에게 빌려줘요.' });
    await jar.move(700, 520, 600); hide(jar);
    rich.look('grab', 'right');
    await say('"고맙네! 얼른 가져가야지, 헤헤." 부자는 항아리를 꼭 안고 달려갔어요.');
    await rich.move(1200, 520, 1300, 'ease-in');

    /* --- 7. 금덩이 --- */
    await T.sceneCard(tr('큰 방'), () => {
      scene('hall');
      put(T, rich, 330, 505, { look: 'gold', to: 'right' });
      put(T, jar, 650, 505); jar.pos.style.display = '';
    }, jar.pos);
    await say('부자는 방에 항아리를 놓고 말했어요. "금덩이를 넣으면 금이 산더미가 되겠지!"');
    await say('항아리를 톡톡톡 눌러서 금덩이를 넣어 봐요!');
    const golds = [];
    await T.mash(jar.pos, { count: 3, prompt: '항아리를 톡톡톡! 금덩이가 나와요.', onStep: i => {
      const g = prop(T, 'gold', 70 + i * 24); put(T, g, 560 + i * 90, 505 - i * 6);
      g.pos.animate([{ opacity: 0 }, { opacity: 1 }], 250); golds.push(g);
      jar.hop(12, 240); clinkSfx(T); T.pop(g.x, g.y - 120, tr(NUM[i - 1]));
    } });
    await T.cutImage([{ src: cutSrc('buried'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    scene('hall');
    put(T, jar, 650, 505); golds.forEach(g => { g.pos.style.display = ''; T.world.appendChild(g.pos); });
    put(T, rich, 330, 505, { look: 'pinned', to: 'left' });
    await say('금덩이가 와르르! 부자는 금 더미에 폭 파묻혔어요. "사람 살려~"');
    await say('부자를 톡! 눌러서 꺼내 줘요.');
    await T.tap(rich.pos, { prompt: '부자를 톡! 금 더미에서 꺼내 줘요.' });
    golds.forEach(g => hide(g)); popSfx(T);
    rich.look('shout', 'right'); rich.hop(30, 400);
    await say('쏙! 부자가 빠져나왔어요. 다치지는 않았어요.');

    /* --- 8. 아버지가 풍덩 --- */
    await T.sceneCard(tr('아버지'), () => {
      scene('hallwide');
      put(T, jar, 700, 505); put(T, rich, 240, 505, { look: 'shout', to: 'right' });
      put(T, father, 480, 505, { look: 'peek', to: 'right' });
    }, father.pos);
    await say('그때 부자의 아버지가 다가와 항아리 속을 들여다보았어요. "이게 뭐냐?"');
    await say('아버지를 톡! 눌러서 항아리 쪽으로 가 봐요.');
    await T.tap(father.pos, { prompt: '아버지를 톡! 항아리를 구경해요.' });
    await father.move(660, 505, 700);
    await T.cutImage([{ src: cutSrc('plop'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    scene('hallwide');
    put(T, jar, 700, 505); put(T, rich, 240, 505, { look: 'shout', to: 'right' });
    await say('풍덩! 아버지가 항아리에 거꾸로 쏙 빠졌어요. 다치지는 않았어요.');
    await say('"아버지가 어디 계시지?" 항아리를 톡톡톡 눌러서 아버지를 세어 봐요!');
    await T.mash(jar.pos, { count: 8, prompt: '항아리를 톡톡톡! 아버지를 세어 봐요.', onStep: i => {
      const o = olds[i - 1]; put(T, o, 880 - (i - 1) * 100 + 10, 520 - (i % 2) * 6, { look: i % 2 ? 'a' : 'b', to: 'left' });
      o.pos.animate([{ opacity: 0 }, { opacity: 1 }], 250); jar.hop(10, 200); popSfx(T); T.pop(o.x, o.y - 200, tr(NUM[i - 1]));
    } });
    await T.cutImage([{ src: cutSrc('eight'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    await say('아버지가 하나, 둘, 셋, 넷, 다섯, 여섯, 일곱, 여덟! 여덟 명이나 되었어요.');
    await say('"내가 진짜 아버지다!" "아니야, 내가 진짜야!" 모두 서로 자기가 진짜라고 우겼어요.');
    olds.forEach((o, i) => o.hop(14 + (i % 3) * 4, 300));
    await T.cutImage([{ src: cutSrc('hungry'), sfx: 'pop', hold: 3200 }], { hold: 3200 });
    await say('"배고프다! 밥 줘라!" 부자는 쟁반을 들고 이리저리 뛰어다녔어요.');

    /* --- 9. 항아리가 깨졌어요 --- */
    await say('부자는 지쳐서 외쳤어요. "이게 다 항아리 때문이야! 이제 그만!" 부자를 톡!');
    await T.tap(rich.pos, { prompt: '부자를 톡! 항아리를 그만 쓰자고 해요.' });
    await T.cutImage([{ src: cutSrc('smash'), sfx: 'pow', hold: 3000 }], { hold: 3000 });
    scene('hallwide');
    olds.forEach(o => hide(o)); hide(jar);
    put(T, cracked, 700, 505); put(T, rich, 300, 505, { look: 'hurry', to: 'right' }); put(T, father, 500, 505, { look: 'peek', to: 'right' });
    await say('쨍그랑! 항아리가 깨지자 일곱 명은 사라지고, 진짜 아버지만 남았어요.');
    await say('"아버지, 죄송해요. 욕심을 부려서 소동이 났어요."');
    await Promise.all([rich.hop(24, 400), father.hop(20, 400)]);

    /* --- 10. 함께하는 잔치 --- */
    await T.sceneCard(tr('잔치'), () => {
      scene('feast');
      put(T, farmer, 450, 515, { look: 'feast', to: 'right' });
      put(T, wife, 570, 515, { look: 'share', to: 'left' });
      put(T, rich, 300, 515, { look: 'hurry', to: 'right' });
      put(T, father, 700, 515, { look: 'peek', to: 'left' });
    }, farmer.pos);
    await say('부자는 농부를 찾아가 사과하고, 가진 것을 마을 사람들과 나누기로 했어요. 함께 잔치를 열어요!');
    const tables = [[170, 'table'], [820, 'table']].map(([x]) => { const t = prop(T, 'table', 80); put(T, t, x, 540); return t; });
    for (const [i, t] of tables.entries()) {
      await T.tap(t.pos, { prompt: '상을 톡! 맛있는 음식을 차려요.' });
      popSfx(T); t.hop(20, 300); T.pop(t.x, t.y - 120, tr(['냠냠!', '맛있다!'][i]));
    }
    await say('"모두 고맙네!" 모두 둘러앉아 맛있게 먹었어요.');
    await T.tap(farmer.pos, { prompt: '농부를 톡! 모두 함께 만세!' });
    T.confetti();
    await Promise.all([farmer.hop(40, 500), wife.hop(30, 500), rich.hop(30, 500), father.hop(24, 500)]);
    await say('나누면 기쁨이 커져요. 요술 항아리 이야기는 이렇게 끝났어요.');
    T.finale();
    return '나누면 기쁨이 커져요!';
  }

  Tale.mount({ title: '요술 항아리', subtitle: '나누면 기쁨이 커져요', run: T => run(Tale.api) });
})();
