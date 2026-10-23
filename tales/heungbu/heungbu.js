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
    /* 층 소품(VISUAL_PLAN §3~§6, 2026-10-23) */
    layer_blossom_branch: 1.0133, layer_petal: .7417, layer_grass_front: 1.1683, layer_rapeseed: .8683, layer_pine_branch: 1.0967, layer_jars: 1.5929,
    layer_persimmon_branch: 1.0367, layer_leaf_sil: .9583, layer_tree_sil: .98, layer_reeds_sil: 1.2517, layer_grass_sil: 1.085, layer_vine_sil: 2.2785,
  };
  /* 2026-10-23 화려한 재기획(VISUAL_PLAN.md): 장면 키(읽어 주기 set:<키> 포함)는 그대로, 그림만 v2·라이트박스. 둥지·부엌문·초가·대문·기와집 자리는 원본과 같다(겹쳐 확인) */
  const BGS = { sky_spring: 'sky_spring_v2', nolkitchen: 'nolkitchen_v2', eaves: 'eaves_v2', yard: 'yard_v2', sky_autumn: 'sky_autumn_lb', nol_eaves: 'nol_eaves_v2', nolyard: 'nolyard_v2', giwa: 'giwa_v2' };
  const BG = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const GROUND = 500;
  const NUM = ['하나!', '둘!', '셋!'];

  async function run(T) {
    const { sleep, say } = T;
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const tr = T.tr;
    /* 세로 화면은 가운데 약 430만 보인다 → 가운데(500)를 기준으로 사람·물건 사이를 좁히고 조금 작게 */
    const P = T.viewWidth() < 990, K = P ? .82 : 1;
    const fx = x => P ? 500 + (x - 500) * .55 : x;
    const cl = (b, i, s, n = 3, sp = 70) => P ? 500 + ((b + (n - 1) / 2 * s) - 500) * .45 + (i - (n - 1) / 2) * sp : b + i * s;
    const pan = () => T.camSnap(500, 280, 1);
    const sfx = n => { try { AudioFX.sfx(n); } catch (e) { /* 소리 없이도 진행 */ } };
    const cut = (k, s = 'pop', hold = 3200) => T.cutImage([{ src: U('cut_' + k), sfx: s, hold }], { hold });

    /* 층 소품: 누름 없음. 중간 층은 T.bg(배우 뒤), 앞 가림 층은 T.fx(배우 위). (cx, y) = 가운데·발끝, top 이면 윗변 */
    const L = {};
    const still = () => T.reading() && T.readInstant();
    function layer(k, cx, y, h, { front = true, flip = false, top = false, name } = {}) {
      const w = h * AR['layer_' + k], g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
      if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
      const inner = T.el('g', { filter: 'url(#pp)' }, g);
      T.el('image', { href: U('layer_' + k), x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, inner);
      inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = top ? '50% 0%' : '50% 100%';
      if (name) L[name] = inner;
      return inner;
    }
    const sway = (g, deg, ms, delay = 0) => { if (!still()) g.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }], { duration: ms, delay, iterations: Infinity, easing: 'ease-in-out' }); return g; };
    const wig = (name, deg = 3, ms = 500) => { const g = L[name]; if (g && g.isConnected) g.animate([{ rotate: '0deg' }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }, { rotate: '0deg' }], { duration: ms, composite: 'add' }); };
    /* 꽃잎·단풍잎 낙하(사인 곡선, 회전). 작아서 얼굴을 지나도 괜찮다 */
    function falling(k, n, h, { loop = true, x0 = 0, x1 = 1000 } = {}) {
      if (still()) return;
      for (let i = 0; i < n; i++) {
        const x = x0 + Math.random() * (x1 - x0), w = h * AR['layer_' + k], d = 6000 + Math.random() * 4000;
        const g = T.el('g', { style: 'pointer-events:none' }, T.fx);
        T.el('image', { href: U('layer_' + k), x: -w / 2, y: -h / 2, width: w, height: h }, g);
        const sx = (i % 2 ? 1 : -1) * (30 + Math.random() * 10);
        const a = g.animate([0, .25, .5, .75, 1].map((t, j) => ({ transform: `translate(${x + (j % 2 ? sx : 0) + t * 80}px, ${-40 + t * 640}px) rotate(${t * 360}deg)` })),
          { duration: d, delay: loop ? Math.random() * d : i * 150, iterations: loop ? Infinity : 1, easing: 'linear' });
        if (!loop) a.onfinish = () => g.remove();
      }
    }
    /* 빛 점(라이트박스 하늘): 작은 크림 원이 깜빡 */
    function lightDots(n, [x0, x1, y0, y1]) {
      for (let i = 0; i < n; i++) {
        const x = x0 + Math.random() * (x1 - x0), y = y0 + Math.random() * (y1 - y0), r = 3 + Math.random() * 2;
        const g = T.el('g', { style: 'pointer-events:none' }, T.fx);
        T.el('circle', { cx: x, cy: y, r: r + 3, fill: '#FBE8A6', opacity: .5 }, g); T.el('circle', { cx: x, cy: y, r, fill: '#FFF4CC' }, g);
        if (!still()) g.animate([{ opacity: .2 }, { opacity: 1 }, { opacity: .2 }], { duration: 1400 + Math.random() * 1200, delay: Math.random() * 1000, iterations: Infinity });
      }
    }
    /* 어두운 막을 깔았다가 걷는다(종이 뒤 불이 켜지는 느낌) */
    function tint(o, ms) {
      if (still()) return;
      const r = T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3800, fill: '#2E241C', opacity: o, style: 'pointer-events:none' }, T.fx);
      r.animate([{ opacity: o }, { opacity: 0 }], { duration: ms, fill: 'forwards' }).onfinish = () => r.remove();
    }
    let spring2 = false;   // 6장(이듬해 봄): 제비가 지나가므로 벚꽃 가지를 더 위로
    function dress(key) {
      if (key === 'sky_spring') {
        const y = spring2 ? -60 : -24;
        sway(layer('blossom_branch', P ? 290 : 80, y, 180, { top: true, name: 'blossomL' }), 1, 8000);
        sway(layer('blossom_branch', P ? 710 : 920, y, 180, { top: true, flip: true }), 1, 8000, 2000);
        if (!P) { layer('grass_front', 60, 600, 90); layer('grass_front', 940, 600, 90, { flip: true }); }
        falling('petal', 8, 22);
      }
      if (key === 'nolkitchen') { if (!P) layer('jars', 880, 520, 150, { front: false }); layer('pine_branch', P ? 715 : 930, P ? -40 : -24, 200, { top: true, name: 'pine' }); layer('grass_front', 40, 600, 90); }
      if (key === 'eaves') { layer('rapeseed', 50, 600, 110, { name: 'rapeL' }); layer('rapeseed', 950, 600, 110, { flip: true, name: 'rape' }); }
      if (key === 'yard') { layer('persimmon_branch', 940, -24, 170, { top: true, name: 'persimmon' }); layer('grass_front', 40, 600, 90, { name: 'grassF' }); }
      if (key === 'sky_autumn') {
        if (!P) layer('tree_sil', 40, 585, 420);
        [180, 500, 820].forEach((x, i) => { const r = layer('reeds_sil', x, 600, 120, { flip: i === 1 }); if (!still()) r.animate([{ translate: '-6px 0' }, { translate: '6px 0' }, { translate: '-6px 0' }], { duration: 5000, delay: i * 700, iterations: Infinity, easing: 'ease-in-out' }); });
        falling('leaf_sil', 6, 26, { x0: 0, x1: 700 });
        tint(.35, 600); lightDots(12, [520, 1000, 30, 130]);
      }
      if (key === 'nol_eaves') { layer('pine_branch', P ? 290 : 60, P ? -40 : -24, 200, { top: true, flip: true, name: 'pine' }); if (!P) layer('jars', 120, 520, 150, { front: false }); }
      if (key === 'nolyard') { layer('pine_branch', P ? 710 : 930, P ? -40 : -24, 200, { top: true, name: 'pine' }); layer('grass_front', 40, 600, 90); }
      if (key === 'giwa') {
        layer('blossom_branch', P ? 290 : 80, -24, 180, { top: true });
        if (!P) layer('blossom_branch', 920, -24, 180, { top: true, flip: true });
        layer('grass_front', 40, 600, 90); layer('grass_front', 960, 600, 90, { flip: true });
        falling('petal', 6, 22);
      }
    }
    function scene(key, cx = 500) {
      T.clear(); L.lb = null;
      L.bg = T.el('image', { href: U('bg_' + (BGS[key] || key)), x: BG.x, y: BG.y, width: BG.w, height: BG.h, preserveAspectRatio: 'none' }, T.bg);
      dress(key);
      pan(cx);
    }
    /* 7장 첫 박을 타는 순간: 낮 마당 → 금빛 라이트박스(같은 구도). 감 가지·풀 포기는 걷고 넝쿨·풀 실루엣을 건다 */
    function toLightbox() {
      if (!L.bg || !L.bg.isConnected || L.lb) return;
      const old = L.bg, lb = T.el('image', { href: U('bg_yard_lb'), x: BG.x, y: BG.y, width: BG.w, height: BG.h, preserveAspectRatio: 'none', opacity: 0 }, T.bg);
      old.after(lb); L.lb = lb;
      const quick = still();
      tint(.3, 900);
      if (quick) { lb.setAttribute('opacity', 1); old.remove(); }
      else lb.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, fill: 'forwards' }).onfinish = () => { lb.setAttribute('opacity', 1); old.remove(); };
      [L.persimmon, L.grassF].forEach(g => { if (g) { if (quick) g.remove(); else g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }); } });
      const add = [sway(layer('vine_sil', 500, -24, 150, { top: true }), .5, 9000)];
      if (!P) add.push(layer('grass_sil', 25, 600, 80), layer('grass_sil', 975, 600, 80, { flip: true }));
      if (!quick) add.forEach(g => g.animate([{ opacity: 0 }, { opacity: 1 }], 600));
      lightDots(8, [460, 1000, 30, 200]);
      if (!P && !quick) T.camTo(560, 300, 1.06, 900).then(() => T.camTo(500, 280, 1, 1400));
    }
    /* 누르는 대상이 아닌 그림은 누름을 받지 않고(옆 그림이 가리지 않게), 대상은 live() 로 열며 짧은 변 90단위(휴대폰 세로에서도 80px 이상)로 넓힌다 (2026-10-22) */
    const live = (a, w = 90) => {
      if (!a._hit) { a._hit = T.el('rect', { x: -w / 2, y: -Math.max(a.h || 0, 90), width: w, height: Math.max(a.h || 0, 90), fill: '#000', 'fill-opacity': 0 }, a.pos); a.pos.insertBefore(a._hit, a.pos.firstChild); }
      a.pos.style.pointerEvents = 'auto'; return a.pos;
    };
    function spr(name, x, h, y = GROUND) {
      let im;
      const a = T.actor(T.world, fx(x), y, b => { im = T.el('image', { filter: 'url(#pp)', preserveAspectRatio: 'none' }, b); });
      a.pos.style.pointerEvents = 'none';
      a.set = (n, hh = a.h0) => {
        a.h0 = hh; hh *= K; a.h = hh; const w = hh * AR[n];
        im.setAttribute('href', U(n)); im.setAttribute('x', -w / 2); im.setAttribute('y', -hh);
        im.setAttribute('width', w); im.setAttribute('height', hh);
      };
      a.show = on => { a.pos.style.display = on ? '' : 'none'; };
      a.set(name, h);
      return a;
    }

    await Promise.race([Promise.all(['sky_spring', 'nolkitchen', 'eaves', 'yard', 'sky_autumn', 'nol_eaves', 'nolyard', 'giwa', 'yard_lb']
      .map(k => T.preload(U('bg_' + (BGS[k] || k)))).concat(['rice', 'fall', 'bandage2', 'south', 'seedback', 'rice_pour2', 'house2', 'mud2', 'dokkaebi', 'collapse']
      .map(k => T.preload(U('cut_' + k))))), sleep(4000)]);

    /* ================= 읽어 주기 (docs/READ_MODE.md): 대본 read_script_el.json 의 동사 → 놀이판 연출을 감싼 얇은 함수 ================= */
    const READ_ACTS = (() => {
      let S = {}, gourds = [], sacks = [], seenSpring = false;
      const rI = () => T.readInstant();
      const nums = s => String(s).split(',').map(Number);
      const reset = () => { S = {}; gourds = []; sacks = []; };
      const CARD = { yard: '마당' };
      const CUT = { catch: ['fall', 'pop', 3200], rice: ['rice_pour2', 'pop', 3600], house: ['house2', 'pop', 3600], mud: ['mud2', 'pow', 3400], dok: ['dokkaebi', 'pow', 3400], collapse: ['collapse', 'crash', 3600] };
      const FX = { pop: 'pop', ding: 'ding', saw: 'pop', splash: 'pow', crash: 'crash', boom: 'pow' };
      const sawer = () => S.heung_saw || S.nol_saw;
      const gx = i => (S.nol_saw ? cl(620, i, 100) : cl(640, i, 100));
      return {
        set(key) {
          const go = () => { reset(); spring2 = key === 'sky_spring' && seenSpring; if (key === 'sky_spring') seenSpring = true; scene(key, 500); };
          if (rI()) { go(); return; }
          return T.sceneCard(CARD[key] || '', go);
        },
        cam() { pan(); }, // 놀이판처럼 카메라는 가운데(세로 화면은 spr 좌표를 좁혀 놓는다)
        spr(name, op, spec) {
          const a = S[name];
          if (op === 'at') {
            const [x, y = GROUND, h] = nums(spec);
            if (a) a.pos.remove();
            const n = spr(name, x, h, y === 505 ? GROUND : y);
            if (name === 'swallow_seed') n.face('right'); // 왼쪽이 기본인 그림 → 오른쪽으로 날아가므로 뒤집는다
            S[name] = n; return;
          }
          if (!a) return;
          if (op === 'hop') { a.hop(24, 360); sfx('pop'); return; }
          if (op === 'hide') { a.show(false); return; }
          if (op === 'walk') {
            const [x, y = GROUND] = nums(spec);
            const ty = y === 505 ? GROUND : y;
            if (rI()) { a.place(fx(x), ty); return; }
            return a.move(fx(x), ty, 900);
          }
        },
        chick(op) {
          if (op === 'fall') { // 말과 동시에 굴러떨어진다 (기다리지 않는다)
            const eaves = !!S.chicks;
            const t = spr('chick_fall', eaves ? 493 : 720, eaves ? 90 : 120, eaves ? 120 : -30); S.chick_fall = t;
            sfx('pow');
            (async () => { await t.move(fx(eaves ? 560 : 720), 480, eaves ? 800 : 650, 'ease-in'); t.hop(10, 300); T.pop(t.x, t.y - 140, '아야!'); })();
            return;
          }
          if (op === 'catch') {
            const f = S.chick_fall, h = S.heung_catch;
            if (rI()) { f && f.place(fx(425), 410); return; }
            if (h) h.hop(20, 300);
            sfx('ding');
            return f && f.move(fx(425), 410, 500, 'ease-out');
          }
          if (op === 'bandage') return cut('bandage2', 'pop', 3600);
        },
        async swallow(op, x) {
          const sx = +x;
          if (S.swallow_seed) return S.swallow_seed.move(fx(sx), 280, 1300, 'ease-out'); // 봄: 날아와서 머문다
          if (S.swallow_fly) return S.swallow_fly.move(sx, 240, 1400, 'ease-in'); // 가을: 남쪽으로
          const c = S.chick_fall; // 놀부네: 천을 감아 주면 다친 데 없이 날아간다
          if (c) {
            const n = S.nol_proud; if (n) n.set('nol_wrap');
            await c.move(fx(480), 430, 500, 'ease-out'); sfx('ding'); c.hop(12, 260);
            await sleep(900);
            c.set('swallow_fly', 100);
            return c.move(sx, 150, 1400, 'ease-in');
          }
        },
        async seed(op) {
          const sw = S.swallow_seed; if (!sw) return;
          const sd = spr('seed', 380, 70, 280); S.seed = sd; sd.place(sw.x, 280);
          await sd.move(fx(560), 470, 600, 'ease-in'); sfx('ding'); sw.hop(16, 300);
          sw.move(1150, 160, 1600, 'ease-in'); // 박씨를 주고 날아간다
        },
        vine(op) { const v = S.vine; if (v && op === 'grow') { v.hop(18, 360); sfx('pop'); } },
        gourds(op, n) {
          for (let i = 0; i < +n; i++) { const g = spr('gourd', gx(i), 140); gourds.push(g); if (!rI()) g.hop(14, 260); }
          if (!rI()) sfx('pop');
        },
        gourd(op, i) {
          const g = gourds[+i]; if (!g) return;
          if (+i === 0) toLightbox();
          g.hop(18, 300); const s = sawer(); if (s) s.hop(14, 300); sfx('pop');
          if (+i === 1) sacks.forEach(k => k.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }));
        },
        rice(op, n) {
          if (op === 'pour') {
            for (let i = 0; i < +n; i++) { const s = spr('rice', cl(620, i, 90), 90, 545); s.hop(14, 260); sacks.push(s); }
            sfx('pop'); return;
          }
          if (op === 'send') { // 쌀자루를 형님네 집으로 (누르기 없이 저절로)
            const ns2 = S.nol_shy; if (!ns2) return;
            const bags = [...Array(+n)].map((_, i) => spr('rice', cl(460, i, 80), 100, 500));
            return (async () => {
              for (let i = 0; i < bags.length; i++) { await sleep(300); sfx('pop'); await bags[i].move(ns2.x, 470, 450, 'ease-in'); bags[i].hop(12, 240); }
            })();
          }
        },
        treasure(op) {
          const g = gourds[1]; if (g) g.set('gourd_open', 120);
          const t = spr('treasure', 640, 130, 490); S.treasure = t;
          if (g) t.place(g.x, 490);
          t.hop(18, 300); sfx('ding');
        },
        house(op) { if (op === 'new') T.confetti(); else if (op === 'collapse') { sfx('crash'); const s = S.nol_saw; if (s) s.hop(14, 300); } },
        mud(op) { const s = S.nol_saw; if (s) s.set('nol_mud'); sfx('pow'); },
        shake() {
          const n = S.nol_proud;
          if (n) { n.set('nol_shake'); n.hop(18, 300); return; }
          T.shake();
        },
        cut(k) {
          if (k === 'hug') { T.confetti(); ['heung_glad', 'hwife_joy', 'nol_shy'].forEach(m => S[m] && S[m].hop(30, 500)); return; } // 컷 그림이 없어 함께 뛰는 장면으로 대신
          if (k === 'treasure') return; // 컷 그림이 없어 금은보화 그림(treasure:show)만 보인다
          const c = CUT[k]; if (!c) return;
          return cut(c[0], c[1], c[2]);
        },
        fx(n) { sfx(FX[n] || 'pop'); },
        pop(spec) {
          const a = String(spec).split(',');
          T.pop(fx(+a[0]), +a[1], a.slice(2).join(','));
        },
      };
    })();
    if (T.reading()) return T.readPlay(READ_ACTS);

    /* 1. 봄 하늘 */
    scene('sky_spring');
    const heung = spr('heung_hello', 500, 330);
    await T.curtain(true);
    await say('옛날 옛날에 마음씨 착한 동생 흥부와 욕심쟁이 형 놀부가 살았어요.');
    await T.ask('흥부를 톡! 눌러서 인사해요.', () => T.tap(live(heung), { prompt: '흥부를 톡! 인사해요.' }));
    heung.hop(34, 400); sfx('pop'); T.pop(heung.x + 80, heung.y - 390, '안녕!'); falling('petal', 4, 22, { loop: false });
    await say('흥부는 활짝 웃으며 인사했어요.');

    /* 2. 형 집 */
    await T.sceneCard('형의 집', () => {
      scene('nolkitchen', 500);
      heung.pos.remove();
    }, heung.pos);
    const h2 = spr('heung_hello', 400, 320), wife2 = spr('nwife', 640, 330);
    await say('흥부는 배가 고파서 형 집으로 밥을 얻으러 갔어요.');
    await say('형수는 화가 난 얼굴로 말했어요. "밥이 어디 있어요! 저리 가요!"');
    wife2.hop(16, 300); wig('pine', 2, 300);
    await cut('rice', 'pop', 3600);
    await say('형수가 주걱을 휘두르자 흥부 볼에 밥알이 붙었어요. 흥부는 그 밥알을 맛있게 먹었어요.');
    await say('흥부는 웃으며 말했어요. "괜찮아요. 밥알도 맛있어요!"');
    await h2.move(fx(120), GROUND, 900);

    /* 3. 제비집 */
    await T.sceneCard('흥부네 집', () => { scene('eaves', 500); });
    const chicks = spr('chicks', 493, 112, 128); /* 배경에 그려진 작은 둥지 위에 딱 겹쳐서 둥지가 하나로 보이게 */
    const hw = spr('hwife', 300, 300), h3 = spr('heung_hello', 700, 310);
    await say('흥부네 초가집 처마에는 제비 가족이 살았어요.');
    await T.ask('아기 제비는 몇 마리일까요? 둥지를 톡톡톡 눌러서 세어 봐요!', () => T.mash(live(chicks), { count: 3, prompt: '둥지를 톡톡톡! 아기 제비를 세어 봐요.', onStep: i => {
      chicks.hop(14, 260); sfx('pop'); T.pop(chicks.x + (i - 2) * 70, chicks.y + 70, NUM[i - 1]);
    } }));
    await say('아기 제비가 하나, 둘, 셋! 세 마리예요.');
    /* 강제로 떨어진다: 아이가 아무것도 안 눌러도 둥지에서 굴러떨어져 땅에 아프게 눕는다 */
    const tumble = spr('chick_fall', 493, 90, 120);
    const fell = say('앗! 아기 제비 한 마리가 둥지에서 떨어졌어요!'); /* 말과 동시에 굴러떨어진다 */
    sfx('pow'); wig('rape', 3, 400); await tumble.move(fx(560), 470, 800, 'ease-in'); tumble.hop(10, 300);
    T.pop(tumble.x, tumble.y - 140, '아야!');
    const tshiv = setInterval(() => tumble.hop(5, 220), 800); await sleep(1400); clearInterval(tshiv);
    await fell;
    await cut('fall', 'pop', 3200);
    await T.sceneCard('마당', () => { scene('yard', 500); });
    const hc = spr('heung_catch', 380, 340), fallen = spr('chick_fall', 560, 120, 470); /* 떨어진 채 마당 바닥에 누워 있다 */
    fallen.hop(10, 300); T.pop(fallen.x, fallen.y - 140, '아야!');
    const shiver = setInterval(() => fallen.hop(5, 220), 800); /* 다리를 다쳐서 바들바들 */
    await T.ask('흥부를 톡! 눌러서 아기 제비를 받아 줘요.', () => T.tap(live(hc), { prompt: '흥부를 톡! 제비를 받아 줘요.' }));
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
    await T.sceneCard('이듬해 봄', () => { spring2 = true; scene('sky_spring', 500); });
    const sw = spr('swallow_seed', -150, 140, 280), hp = spr('heung_plant', 640, 260);
    sw.face('right'); // seed 그림은 왼쪽이 기본 → 오른쪽으로 날아가므로 뒤집는다
    await sw.move(fx(380), 280, 1300, 'ease-out'); /* 날아와서 머문다 */
    await say('봄이 되자 제비가 돌아와서 박씨 하나를 떨어뜨렸어요.');
    await cut('seedback', 'pop', 3200);
    const seed = spr('seed', 380, 70, 280); seed.place(sw.x, 280);
    await seed.move(fx(560), 470, 600, 'ease-in'); sfx('ding'); sw.hop(16, 300); falling('petal', 2, 22, { loop: false });
    sw.move(1150, 160, 1600, 'ease-in'); /* 박씨를 주고 날아간다 */
    await say('흥부는 박씨를 마당에 심었어요.');
    for (let i = 1; i <= 3; i++) { /* 저절로 물을 줘요 (2026-10-20 톡 조작 정리) */
      hp.hop(14, 260); sfx('pop'); T.pop(hp.x - 60, hp.y - 280, ['쑥!', '쑥쑥!', '쑥쑥쑥!'][i - 1]); await sleep(600);
    }
    await T.sceneCard('박이 열렸어요', () => { scene('yard', 560); });
    const vine = spr('vine', 560, 360), hs = spr('heung_saw', 380, 300), hw2 = spr('hwife_joy', 195, 300); /* 2026-10-20 새 그림이 더 넓어 둘이 겹치던 것 벌림 */
    const gourds = [];
    await T.ask('쑥쑥 자란 줄기에 박이 열렸어요. 줄기를 톡톡톡 눌러서 박을 세어 봐요!', () => T.mash(live(vine), { count: 3, prompt: '줄기를 톡톡톡! 박을 세어 봐요.', onStep: i => {
      const g = spr('gourd', cl(640, i - 1, 100), 140); g.hop(14, 260); gourds.push(g);
      sfx('pop'); T.pop(g.x, g.y - 170, NUM[i - 1]);
    } }));
    await say('박이 하나, 둘, 셋! 세 통이에요.');

    /* 6. 박 타기 */
    const open = async (g, word, guide) => {
      const tapIt = () => T.tap(live(g), { prompt: '박을 톡! 슬근슬근 타요.' });
      await (guide ? T.ask(guide, tapIt) : tapIt());
      g.hop(18, 300); hs.hop(14, 300); sfx('pop'); T.pop(g.x, g.y - 170, word);
    };
    await open(gourds[0], '슬근슬근!', '흥부 부부는 톱으로 박을 탔어요. 박을 톡! 눌러서 슬근슬근 타 봐요.');
    toLightbox();
    const autoOpen1 = async g => { await sleep(500); g.hop(18, 300); hs.hop(14, 300); sfx('pop'); T.pop(g.x, g.y - 170, '슬근슬근!'); };
    await cut('rice_pour2', 'pop', 3600);
    await say('첫 번째 박에서 하얀 쌀이 쏟아졌어요! 아이들이 신나서 소리쳤어요.');
    const sacks = [];
    await T.ask('쌀자루를 톡톡톡 눌러서 세어 봐요!', () => T.mash(live(gourds[0]), { count: 3, prompt: '쌀자루를 톡톡톡! 세어 봐요.', onStep: i => {
      const s = spr('rice', cl(620, i - 1, 90), 90, 545); s.hop(14, 260); sacks.push(s);
      sfx('pop'); T.pop(s.x, s.y - 140, NUM[i - 1]);
    } }));
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
    nol.set('nol_shake'); nol.hop(18, 300); wig('pine', 4, 500);
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
    const nopen = async (g, word, guide) => {
      const tapIt = () => T.tap(live(g), { prompt: '박을 톡! 슬근슬근 타요.' });
      await (guide ? T.ask(guide, tapIt) : tapIt());
      g.hop(18, 300); ns.hop(14, 300); sfx('pop'); T.pop(g.x, g.y - 170, word);
    };
    await nopen(ng[0], '슬근슬근!', '첫 번째 박을 톡!');
    const autoOpen = async g => { await sleep(500); g.hop(18, 300); ns.hop(14, 300); sfx('pop'); T.pop(g.x, g.y - 170, '슬근슬근!'); };
    await cut('mud2', 'pow', 3400);
    await say('콸콸콸! 박에서 흙탕물이 쏟아져서 놀부가 흠뻑 젖었어요.');
    ns.set('nol_mud');
    await autoOpen(ng[1]);
    await cut('dokkaebi', 'pow', 3400);
    await say('이번에는 방망이를 든 도깨비가 쑥 나왔어요. "이 욕심쟁이야!" 도깨비는 놀부를 놀라게 하고 사라졌어요.');
    await autoOpen(ng[2]);
    await cut('collapse', 'crash', 3600); wig('pine', 6, 600);
    await say('와르르! 놀부의 집이 무너졌어요. 다행히 아무도 다치지 않았어요.');

    /* 8. 화해와 나눔 */
    await T.sceneCard('흥부네 집', () => { scene('giwa', 500); }); /* 부자가 된 흥부네는 기와집 */
    const hg = spr('heung_glad', 415, 330), hj = spr('hwife_joy', 225, 310), ns2 = spr('nol_shy', 650, 320); /* 2026-10-20 새 그림 폭에 맞춰 벌림 */
    await say('놀부는 흙투성이가 되어 흥부네 집을 찾아왔어요.');
    await say('놀부가 고개를 숙였어요. "동생아, 내가 잘못했다. 욕심을 부려서 미안하구나."');
    ns2.hop(10, 400);
    await say('흥부가 활짝 웃으며 말했어요. "형님, 괜찮아요. 우리 함께 살아요!"');
    const bags = [0, 1, 2].map(i => spr('rice', cl(460, i, 80), 100, 500));
    for (let i = 0; i < 3; i++) {
      if (i === 0) await T.ask('쌀자루를 톡! 눌러서 형님네 집으로 보내 줘요.', () => T.tap(live(bags[i]), { prompt: '쌀자루를 톡! 형님께 보내요.' })); else await sleep(500); /* 한 번 누르면 나머지는 저절로 */
      bags[i].pos.style.pointerEvents = 'none';
      sfx('pop'); await bags[i].move(ns2.x, 470, 450, 'ease-in'); bags[i].hop(12, 240); T.pop(ns2.x, 120, NUM[i]);
    }
    await say('쌀자루가 하나, 둘, 셋! 놀부는 눈물이 핑 돌았어요.');
    await T.ask('흥부를 톡! 눌러서 모두 함께 만세!', () => T.tap(live(hg), { prompt: '흥부를 톡! 모두 만세!' }));
    T.confetti(); falling('petal', 6, 22, { loop: false });
    await Promise.all([hg.hop(40, 500), hj.hop(30, 500), ns2.hop(30, 500)]);
    await say('흥부와 놀부는 그 뒤로 사이좋게 오래오래 살았대요. 착한 마음은 복이 되어 돌아와요.');
    T.finale();
    return '착한 마음은 복이 되어 돌아와요!';
  }

  Tale.mount({ title: '흥부와 놀부', subtitle: '착한 마음은 복이 되어 돌아와요', read: true, run: T => run(Tale.api) });
})();
