/* 흥부와 놀부 — 목업. 착한 흥부가 다친 제비를 돌봐 주고 박 속에서 복을 얻고, 욕심쟁이 놀부는 소동을 겪은 뒤 흥부와 나눠 사이좋게 살아요.
   조작은 모두 톡 · 톡톡톡(세기). 쓱·꾹·자유 놀이 없음. */
(() => {
  const NF = new Set(['gourd', 'gourd_open', 'rice', 'treasure', 'seed', 'vine']); // 얼굴 없는 새 그림(파일 이름 끝에 nf)
  const G2 = { gourd: 'gourd2_closed', gourd_open: 'gourd2_open', vine: 'gourd2_vine' }; // 새 박 그림
  const U = n => `../../assets/v3w/hb_${G2[n] || n}${!G2[n] && NF.has(n) ? 'nf' : ''}.webp`;
  const AR = {
    heung_hello: .6212, heung_rice: .581, heung_catch: .4806, heung_wrap: .7073, heung_plant: .8343, heung_saw: .9954, heung_glad: .8316,
    hwife: .4429, hwife_joy: .4573, nol_proud: .5551, nol_shake: .8046, nol_wrap: .9382, nol_saw: 1.0143, nol_ouch: .6929, nol_mud: .961,
    nol_shy: .6321, nwife: .7027, nwife_smile: .7335, swallow_fly: 1.1971, swallow_hurt: 1.136, swallow_band: 1.2842, swallow_seed: 1.2057,
    chicks: 1.2811, chick_fall: 1.2373, gourd: .5963, gourd_open: 1.0704, rice: .9294, treasure: 1.2652, seed: .9284, vine: .5342,
  };
  const BG = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const GROUND = 500;
  const NUM = ['하나!', '둘!', '셋!'];

  async function run(T) {
    const { sleep, say } = T;
    const tr = T.tr;
    /* 세로 화면은 가운데 약 430만 보인다 → 가운데(500)를 기준으로 사람·물건 사이를 좁히고 조금 작게 */
    const P = T.viewWidth() < 990, K = P ? .82 : 1;
    const fx = x => P ? 500 + (x - 500) * .55 : x;
    const cl = (b, i, s, n = 3, sp = 70) => P ? 500 + ((b + (n - 1) / 2 * s) - 500) * .45 + (i - (n - 1) / 2) * sp : b + i * s;
    const pan = () => T.camSnap(500, 280, 1);
    const sfx = n => { try { AudioFX.sfx(n); } catch (e) { /* 소리 없이도 진행 */ } };
    const cut = (k, s = 'pop', hold = 3200) => T.cutImage([{ src: U('cut_' + k), sfx: s, hold }], { hold });

    function scene(key, cx = 500) {
      T.clear();
      T.el('image', { href: U('bg_' + key), x: BG.x, y: BG.y, width: BG.w, height: BG.h, preserveAspectRatio: 'none' }, T.bg);
      pan(cx);
    }
    function spr(name, x, h, y = GROUND) {
      let im;
      const a = T.actor(T.world, fx(x), y, b => { im = T.el('image', { filter: 'url(#pp)', preserveAspectRatio: 'none' }, b); });
      a.set = (n, hh = a.h0) => {
        a.h0 = hh; hh *= K; a.h = hh; const w = hh * AR[n];
        im.setAttribute('href', U(n)); im.setAttribute('x', -w / 2); im.setAttribute('y', -hh);
        im.setAttribute('width', w); im.setAttribute('height', hh);
      };
      a.show = on => { a.pos.style.display = on ? '' : 'none'; };
      a.set(name, h);
      return a;
    }

    await Promise.race([Promise.all(['sky_spring', 'nolkitchen', 'eaves', 'yard', 'sky_autumn', 'nol_eaves', 'nolyard', 'giwa']
      .map(k => T.preload(U('bg_' + k))).concat(['rice', 'fall', 'bandage2', 'south', 'seedback', 'rice_pour2', 'house2', 'mud2', 'dokkaebi', 'collapse']
      .map(k => T.preload(U('cut_' + k))))), sleep(4000)]);

    /* 1. 봄 하늘 */
    scene('sky_spring');
    const heung = spr('heung_hello', 500, 330);
    await T.curtain(true);
    await say('옛날 옛날에 마음씨 착한 동생 흥부와 욕심쟁이 형 놀부가 살았어요.');
    await say('흥부를 톡! 눌러서 인사해요.');
    await T.tap(heung.pos, { prompt: '흥부를 톡! 인사해요.' });
    heung.hop(34, 400); sfx('pop'); T.pop(heung.x + 80, heung.y - 300, '안녕!');
    await say('흥부는 활짝 웃으며 인사했어요.');

    /* 2. 형 집 */
    await T.sceneCard('형의 집', () => {
      scene('nolkitchen', 500);
      heung.pos.remove();
    }, heung.pos);
    const h2 = spr('heung_hello', 400, 320), wife2 = spr('nwife', 640, 330);
    await say('흥부는 배가 고파서 형 집으로 밥을 얻으러 갔어요.');
    await say('형수는 화가 난 얼굴로 말했어요. "밥이 어디 있어요! 저리 가요!"');
    wife2.hop(16, 300);
    await cut('rice', 'pop', 3600);
    await say('형수가 주걱을 휘두르자 흥부 볼에 밥알이 붙었어요. 흥부는 그 밥알을 맛있게 먹었어요.');
    await say('흥부는 웃으며 말했어요. "괜찮아요. 밥알도 맛있어요!"');
    await h2.move(fx(120), GROUND, 900);

    /* 3. 제비집 */
    await T.sceneCard('흥부네 집', () => { scene('eaves', 500); });
    const chicks = spr('chicks', 493, 112, 128); /* 배경에 그려진 작은 둥지 위에 딱 겹쳐서 둥지가 하나로 보이게 */
    const hw = spr('hwife', 300, 300), h3 = spr('heung_hello', 700, 310);
    await say('흥부네 초가집 처마에는 제비 가족이 살았어요.');
    await say('아기 제비는 몇 마리일까요? 둥지를 톡톡톡 눌러서 세어 봐요!');
    await T.mash(chicks.pos, { count: 3, prompt: '둥지를 톡톡톡! 아기 제비를 세어 봐요.', onStep: i => {
      chicks.hop(14, 260); sfx('pop'); T.pop(chicks.x + (i - 2) * 70, chicks.y + 70, NUM[i - 1]);
    } });
    await say('아기 제비가 하나, 둘, 셋! 세 마리예요.');
    /* 강제로 떨어진다: 아이가 아무것도 안 눌러도 둥지에서 굴러떨어져 땅에 아프게 눕는다 */
    const tumble = spr('chick_fall', 493, 90, 120);
    const fell = say('앗! 아기 제비 한 마리가 둥지에서 떨어졌어요!'); /* 말과 동시에 굴러떨어진다 */
    sfx('pow'); await tumble.move(fx(560), 470, 800, 'ease-in'); tumble.hop(10, 300);
    T.pop(tumble.x, tumble.y - 140, '아야!');
    const tshiv = setInterval(() => tumble.hop(5, 220), 800); await sleep(1400); clearInterval(tshiv);
    await fell;
    await cut('fall', 'pop', 3200);
    await T.sceneCard('마당', () => { scene('yard', 500); });
    const hc = spr('heung_catch', 380, 340), fallen = spr('chick_fall', 560, 120, 470); /* 떨어진 채 마당 바닥에 누워 있다 */
    fallen.hop(10, 300); T.pop(fallen.x, fallen.y - 140, '아야!');
    const shiver = setInterval(() => fallen.hop(5, 220), 800); /* 다리를 다쳐서 바들바들 */
    await say('흥부를 톡! 눌러서 아기 제비를 받아 줘요.');
    await T.tap(hc.pos, { prompt: '흥부를 톡! 제비를 받아 줘요.' });
    clearInterval(shiver);
    await fallen.move(fx(425), 410, 500, 'ease-out'); hc.hop(20, 300); sfx('ding');
    await cut('bandage2', 'pop', 3600);
    await say('흥부는 아기 제비의 다친 다리에 천을 감아 주었어요. 아기 제비는 금방 나았어요.');

    /* 4. 가을, 남쪽으로 */
    await T.sceneCard('가을', () => { scene('sky_autumn', 500); });
    const fly = spr('swallow_fly', 380, 150, 300);
    await say('가을이 되자 제비 가족은 따뜻한 남쪽 나라로 떠났어요.');
    await fly.move(1150, 240, 1400, 'ease-in');
    await cut('south', 'pop', 3200);

    /* 5. 이듬해 봄, 박씨 */
    await T.sceneCard('이듬해 봄', () => { scene('sky_spring', 500); });
    const sw = spr('swallow_seed', -150, 140, 280), hp = spr('heung_plant', 640, 260);
    sw.face('right'); // seed 그림은 왼쪽이 기본 → 오른쪽으로 날아가므로 뒤집는다
    await sw.move(fx(380), 280, 1300, 'ease-out'); /* 날아와서 머문다 */
    await say('봄이 되자 제비가 돌아와서 박씨 하나를 떨어뜨렸어요.');
    await cut('seedback', 'pop', 3200);
    const seed = spr('seed', 380, 70, 280); seed.place(sw.x, 280);
    await seed.move(fx(560), 470, 600, 'ease-in'); sfx('ding'); sw.hop(16, 300);
    sw.move(1150, 160, 1600, 'ease-in'); /* 박씨를 주고 날아간다 */
    await say('흥부는 박씨를 마당에 심었어요.');
    for (let i = 1; i <= 3; i++) { /* 저절로 물을 줘요 (2026-10-20 톡 조작 정리) */
      hp.hop(14, 260); sfx('pop'); T.pop(hp.x - 60, hp.y - 280, ['쑥!', '쑥쑥!', '쑥쑥쑥!'][i - 1]); await sleep(600);
    }
    await T.sceneCard('박이 열렸어요', () => { scene('yard', 560); });
    const vine = spr('vine', 560, 360), hs = spr('heung_saw', 380, 300), hw2 = spr('hwife_joy', 195, 300); /* 2026-10-20 새 그림이 더 넓어 둘이 겹치던 것 벌림 */
    await say('쑥쑥 자란 줄기에 박이 열렸어요. 줄기를 톡톡톡 눌러서 박을 세어 봐요!');
    const gourds = [];
    await T.mash(vine.pos, { count: 3, prompt: '줄기를 톡톡톡! 박을 세어 봐요.', onStep: i => {
      const g = spr('gourd', cl(640, i - 1, 100), 140); g.hop(14, 260); gourds.push(g);
      sfx('pop'); T.pop(g.x, g.y - 170, NUM[i - 1]);
    } });
    await say('박이 하나, 둘, 셋! 세 통이에요.');

    /* 6. 박 타기 */
    await say('흥부 부부는 톱으로 박을 탔어요. 박을 톡! 눌러서 슬근슬근 타 봐요.');
    const open = async (g, word) => {
      await T.tap(g.pos, { prompt: '박을 톡! 슬근슬근 타요.' });
      g.hop(18, 300); hs.hop(14, 300); sfx('pop'); T.pop(g.x, g.y - 170, word);
    };
    await open(gourds[0], '슬근슬근!');
    const autoOpen1 = async g => { await sleep(500); g.hop(18, 300); hs.hop(14, 300); sfx('pop'); T.pop(g.x, g.y - 170, '슬근슬근!'); };
    await cut('rice_pour2', 'pop', 3600);
    await say('첫 번째 박에서 하얀 쌀이 쏟아졌어요! 아이들이 신나서 소리쳤어요.');
    await say('쌀자루를 톡톡톡 눌러서 세어 봐요!');
    const sacks = [];
    await T.mash(gourds[0].pos, { count: 3, prompt: '쌀자루를 톡톡톡! 세어 봐요.', onStep: i => {
      const s = spr('rice', cl(620, i - 1, 90), 90, 545); s.hop(14, 260); sacks.push(s);
      sfx('pop'); T.pop(s.x, s.y - 140, NUM[i - 1]);
    } });
    await say('쌀자루가 하나, 둘, 셋! 이제 배불리 먹을 수 있어요.');
    sacks.forEach(s => s.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }));
    await autoOpen1(gourds[1]);
    gourds[1].set('gourd_open', 120);
    const tre = spr('treasure', 640, 130, 490); tre.place(gourds[1].x, 490); tre.hop(18, 300); sfx('ding');
    await say('두 번째 박에서는 반짝반짝 금은보화가 나왔어요!');
    await autoOpen1(gourds[2]);
    await cut('house2', 'pop', 3600);
    await say('세 번째 박에서는 작은 박 요정들이 나와 멋진 새집을 지어 주었어요!');
    T.confetti();

    /* 7. 놀부 소문 */
    await T.sceneCard('놀부네 집', () => { scene('nol_eaves', 500); });
    const nol = spr('nol_proud', 400, 330), nw = spr('nwife', 620, 320);
    await say('소문을 들은 놀부는 배가 아팠어요. "나도 부자가 될 거야!"');
    await say('놀부는 제비집을 마구 흔들었어요. 아기 제비가 떨어졌어요!');
    nol.set('nol_shake'); nol.hop(18, 300);
    const chick2 = spr('chick_fall', 720, 120, -30);
    await chick2.move(fx(720), 480, 650, 'ease-in'); chick2.hop(10, 300);
    await sleep(500); /* 저절로 받아 줘요 */
    await chick2.move(fx(480), 430, 500, 'ease-out'); sfx('ding'); chick2.hop(12, 260);
    nol.set('nol_wrap');
    setTimeout(() => { chick2.set('swallow_fly', 100); chick2.move(1150, 150, 1400, 'ease-in'); }, 3600);
    await say('놀부는 서둘러 천을 칭칭 감아 주었어요. "자, 이제 박씨를 가져와라!" 제비는 다치지 않고 날아갔어요.');
    await T.sceneCard('놀부네 마당', () => { scene('nolyard', 560); });
    const ns = spr('nol_saw', 340, 290), ng = [0, 1, 2].map(i => spr('gourd', cl(620, i, 100), 140));
    await say('놀부네 마당에도 박이 세 통 열렸어요.');
    for (let i = 1; i <= 3; i++) { /* 저절로 세기 */
      ng[i - 1].hop(14, 260); sfx('pop'); T.pop(ng[i - 1].x, ng[i - 1].y - 170, NUM[i - 1]); await sleep(600);
    }
    await say('박이 하나, 둘, 셋! 놀부는 기대에 부풀었어요.');
    const nopen = async (g, word) => {
      await T.tap(g.pos, { prompt: '박을 톡! 슬근슬근 타요.' });
      g.hop(18, 300); ns.hop(14, 300); sfx('pop'); T.pop(g.x, g.y - 170, word);
    };
    await say('첫 번째 박을 톡!');
    await nopen(ng[0], '슬근슬근!');
    const autoOpen = async g => { await sleep(500); g.hop(18, 300); ns.hop(14, 300); sfx('pop'); T.pop(g.x, g.y - 170, '슬근슬근!'); };
    await cut('mud2', 'pow', 3400);
    await say('콸콸콸! 박에서 흙탕물이 쏟아져서 놀부가 흠뻑 젖었어요.');
    ns.set('nol_mud');
    await autoOpen(ng[1]);
    await cut('dokkaebi', 'pow', 3400);
    await say('이번에는 방망이를 든 도깨비가 쑥 나왔어요. "이 욕심쟁이야!" 도깨비는 놀부를 놀라게 하고 사라졌어요.');
    await autoOpen(ng[2]);
    await cut('collapse', 'crash', 3600);
    await say('와르르! 놀부의 집이 무너졌어요. 다행히 아무도 다치지 않았어요.');

    /* 8. 화해와 나눔 */
    await T.sceneCard('흥부네 집', () => { scene('giwa', 500); }); /* 부자가 된 흥부네는 기와집 */
    const hg = spr('heung_glad', 415, 330), hj = spr('hwife_joy', 225, 310), ns2 = spr('nol_shy', 650, 320); /* 2026-10-20 새 그림 폭에 맞춰 벌림 */
    await say('놀부는 흙투성이가 되어 흥부네 집을 찾아왔어요.');
    await say('놀부가 고개를 숙였어요. "동생아, 내가 잘못했다. 욕심을 부려서 미안하구나."');
    ns2.hop(10, 400);
    await say('흥부가 활짝 웃으며 말했어요. "형님, 괜찮아요. 우리 함께 살아요!"');
    await say('쌀자루를 톡! 눌러서 형님네 집으로 보내 줘요.');
    const bags = [0, 1, 2].map(i => spr('rice', cl(460, i, 80), 100, 500));
    for (let i = 0; i < 3; i++) {
      if (i === 0) await T.tap(bags[i].pos, { prompt: '쌀자루를 톡! 형님께 보내요.' }); else await sleep(500); /* 한 번 누르면 나머지는 저절로 */
      sfx('pop'); await bags[i].move(ns2.x, 470, 450, 'ease-in'); bags[i].hop(12, 240); T.pop(ns2.x, 120, NUM[i]);
    }
    await say('쌀자루가 하나, 둘, 셋! 놀부는 눈물이 핑 돌았어요.');
    await say('흥부를 톡! 눌러서 모두 함께 만세!');
    await T.tap(hg.pos, { prompt: '흥부를 톡! 모두 만세!' });
    T.confetti();
    await Promise.all([hg.hop(40, 500), hj.hop(30, 500), ns2.hop(30, 500)]);
    await say('흥부와 놀부는 그 뒤로 사이좋게 오래오래 살았대요. 착한 마음은 복이 되어 돌아와요.');
    T.finale();
    return '착한 마음은 복이 되어 돌아와요!';
  }

  Tale.mount({ title: '흥부와 놀부', subtitle: '착한 마음은 복이 되어 돌아와요', run: T => run(Tale.api) });
})();
