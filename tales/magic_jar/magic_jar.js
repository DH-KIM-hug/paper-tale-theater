/* 요술 항아리 — 목업. 착한 농부가 밭에서 요술 항아리를 얻어 이웃과 나누고, 욕심쟁이 부자는 항아리를 빌려 가 소동을 벌이지만 나눌 줄 알게 된다.
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { coin: 1.0064, farmer_amaze: 0.8628, farmer_count: 0.8194, farmer_feast: 0.9316, farmer_hoe: 0.9299, farmer_pull: 1.0085,
    farmer_share: 0.5386, father_fall: 0.9149, father_fightA: 0.6563, father_fightB: 0.7567, father_peek: 0.7839, fwife: 0.5973,
    fwife_share: 0.6010, gold: 1.2430, hoe: 1., jar: 0.9759, jar_cracked: 1.1566, rice: 1.0036, rich_gold: 0.7145, rich_grab: 0.8183,
    rich_hurry: 0.7843, rich_pinned: 1.0612, rich_shout: 0.7496, table: 1.3065, };
  /* 2026-10-20 새 그림은 그림 크기(세로 픽셀)가 옛 그림과 달라서, 옛 그림과 같은 픽셀 축척이 되도록 높이에 곱하는 비율 */
  const RS = { coin: 0.958, farmer_amaze: 0.823, farmer_count: 0.736, farmer_feast: 0.856, farmer_hoe: 0.774, farmer_pull: 0.800, /* 2026-10-20 크기 일관성: 허리 숙인 당기기 자세가 모자 폭 기준 다른 농부보다 16% 작아서 0.671 → 0.800 */
    father_fightA: 0.969, father_fightB: 0.851, father_peek: 0.939, fwife: 0.859, fwife_share: 0.877, jar: 0.947, rice: 0.803,
    rich_gold: 0.906, rich_grab: 0.873, rich_shout: 0.953, };
  const NF = new Set(['coin', 'gold', 'jar', 'jar_cracked', 'rice']); // 얼굴 없는 새 그림(파일 이름 끝에 nf)
  const BGS = ['field', 'pit', 'jarfront', 'village', 'richgate', 'hall', 'hallwide', 'feast'];
  /* 2026-10-23 화려한 다층 재기획(VISUAL_PLAN.md): 장면 키(읽어 주기 set 포함)는 그대로, 그림만 v2·라이트박스.
     마당 초가·돌담·감나무, 마을 집 다섯, 대문·계단·돌사자, 병풍·마루, 땅속 뚜껑, 잔치 초가 자리는 옛 그림과 겹쳐 같다(±1%).
     라이트박스는 2장 땅속·10장 잔치 둘(7장 금 더미는 코드 반짝) */
  /* 2026-10-23 사용자 결정: 밭(field)·땅속(pit 라이트박스)·부잣집 대문(richgate)·큰 방(hall·hallwide)은 옛 그림으로 되돌림(짝 소품·땅속 빛 연출도 뺌) */
  const BGV = { pit: 'pit_empty', jarfront: 'jarfront_v2', village: 'village_v2', feast: 'feast_lb' };
  /* 층 소품(mj_layer_*, 누름 없음) 그림 폭/높이 */
  const LAR = { persimmon_branch: .965, cosmos_front: 1.075, sparrow: 1.0333, chili_string: .5983, blossom_branch: .8783, pine_branch: 1.055, peony_front: 1.105,
    lantern: .3667, roots_sil: 1.2783, soil_sil: 4.4776, lantern_sil: 2.381, bush_sil: 1.15 };
  const CUTS = ['clink', 'twohoes', 'coins', 'buried', 'plop', 'eight', 'smash', 'hungry'];
  const bgSrc = k => AS + 'mj_bg_' + (BGV[k] || k) + '.webp', cutSrc = k => AS + 'mj_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };

  /* 2026-10-20 새 '금 넣는 부자' 그림(gold)은 그림 속에 항아리가 이미 있어 항아리가 둘로 보여서, 항아리 없는 shout 자세로 대신함 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const hh = h * (RS[f] || 1), w = hh * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'mj_' + f + (NF.has(f) ? 'nf' : '') + '.webp', x: -w / 2, y: -hh, width: w, height: hh, preserveAspectRatio: 'none' }, wrap);
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
  const prop = (T, f, h) => { const a = mk(T, { a: [f, h, 'left'] }); a.isProp = true; return a; };
  /* 세로 화면은 무대가 좁게(약 430) 보인다 → 가운데(500)를 기준으로 사람과 물건 사이를 좁히고 사람은 조금 작게 */
  const tight = T => T.viewWidth() < 990;
  const fx = (T, x) => tight(T) ? 500 + (x - 500) * .55 : x;
  function put(T, a, x, y = GROUND, { look, to, s = 1, raw } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s * (tight(T) && !a.isProp && s === 1 ? .85 : 1)); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(raw ? x : fx(T, x), y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };

  function bgImage(T, key, { x = BGBOX.x, y = BGBOX.y, w = BGBOX.w, h = BGBOX.h, parent } = {}) {
    return T.el('image', { href: bgSrc(key), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent || T.bg);
  }
  /* ---- 층 소품: 누름 없음. 앞 가림 층은 T.fx(배우 위), 중간 층은 T.bg(배우 뒤). (cx, y) = 가운데·발끝, top 이면 윗변. 세로 화면 압축(fx) 없이 무대 좌표 그대로 ---- */
  const LY = {};
  function layer(T, k, cx, y, h, { front = true, flip = false, top = false, name } = {}) {
    const w = h * LAR[k], g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
    if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
    const inner = T.el('g', { filter: 'url(#pp)' }, g);
    T.el('image', { href: AS + 'mj_layer_' + k + '.webp', x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, inner);
    inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = top ? '50% 0%' : '50% 100%';
    if (name) LY[name] = inner;
    return inner;
  }
  const sway = (g, deg, ms, delay = 0) => { g.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }], { duration: ms, delay, iterations: Infinity, easing: 'ease-in-out' }); return g; };
  const lyHop = (name, dy = 6, ms = 220) => { const g = LY[name]; if (g && g.isConnected) g.animate([{ translate: '0 0' }, { translate: `0 ${-dy}px` }, { translate: '0 0' }], { duration: ms, easing: 'ease-out', composite: 'add' }); };
  const lyWig = (name, deg = 4, ms = 500) => { const g = LY[name]; if (g && g.isConnected) g.animate([{ rotate: '0deg' }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }, { rotate: '0deg' }], { duration: ms, composite: 'add' }); };
  /* 금빛 마름모 반짝: (x, y) 에서 n 조각이 퍼졌다 사라진다 */
  function sparkle(T, x, y, n = 6, spread = 70, colors = ['#EBD08A', '#F3E9C8']) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * .5, d = spread * (.6 + Math.random() * .5), s = 7 + Math.random() * 5;
      const g = T.el('path', { d: `M0 ${-s} L${s * .6} 0 L0 ${s} L${-s * .6} 0 Z`, fill: colors[i % colors.length], style: 'pointer-events:none' }, T.fx);
      g.animate([{ transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 1 }, { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d}px) scale(1)`, opacity: 1, offset: .6 }, { transform: `translate(${x + Math.cos(a) * d * 1.15}px,${y + Math.sin(a) * d * 1.15}px) scale(.6)`, opacity: 0 }],
        { duration: 900 + Math.random() * 300, easing: 'ease-out', fill: 'forwards' }).onfinish = () => g.remove();
    }
  }
  /* 빛 점: 정해진 자리에서 깜빡 (장면이 바뀌면 T.clear 로 지워진다) */
  function glowDots(T, spots, r = 4, color = '#F2B366', ms = 1600) {
    return spots.map(([x, y], i) => {
      const g = T.el('g', { style: 'pointer-events:none' }, T.fx);
      T.el('circle', { cx: x, cy: y, r: r + 4, fill: color, opacity: .4 }, g); T.el('circle', { cx: x, cy: y, r, fill: '#FFF1C9' }, g);
      g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
      g.animate([{ opacity: .3 }, { opacity: 1 }, { opacity: .3 }], { duration: ms, delay: i * (ms / spots.length), iterations: Infinity });
      return g;
    });
  }
  /* 어두운(또는 따뜻한) 막을 깔았다가 걷는다 — 종이 뒤 불이 켜지는 느낌 */
  function tint(T, color, o, ms) {
    const r = T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3800, fill: color, opacity: o, style: 'pointer-events:none' }, T.fx);
    r.animate([{ opacity: o }, { opacity: 0 }], { duration: ms, fill: 'forwards' }).onfinish = () => r.remove();
  }
  /* 꽃잎이 위에서 천천히 떨어진다(한 번) */
  function petals(T, n = 8) {
    for (let i = 0; i < n; i++) {
      const x = 60 + Math.random() * 880, g = T.el('ellipse', { cx: 0, cy: 0, rx: 7, ry: 4.5, fill: i % 3 ? '#F2A7B8' : '#F7C9D2', style: 'pointer-events:none' }, T.fx);
      g.animate([0, .5, 1].map((t, j) => ({ transform: `translate(${x + (j === 1 ? 30 : 0) + t * 40}px, ${-30 + t * 560}px) rotate(${t * 300}deg)`, opacity: t > .85 ? 0 : 1 })),
        { duration: 3000 + Math.random() * 600, delay: i * 120, easing: 'linear', fill: 'forwards' }).onfinish = () => g.remove();
    }
  }
  /* 장면별 층 소품 (VISUAL_PLAN §3~§7). 세로 화면 가운데(x 285~715)에는 앞 가림 층을 두지 않는다 */
  const LANTERN_HOLES = [[.094, .446], [.258, .526], [.42, .563], [.583, .562], [.745, .526], [.909, .446]];
  function dress(T, key) {
    Object.keys(LY).forEach(k => delete LY[k]);
    if (key === 'jarfront') {
      sway(layer(T, 'persimmon_branch', 960, -24, 200, { top: true }), 1, 8000);
      layer(T, 'chili_string', CHILI[0], CHILI[1], 140, { front: false, top: true, name: 'chili' });
      layer(T, 'cosmos_front', 40, 590, 110);
      layer(T, 'sparrow', 930, 285, 30, { front: false, flip: true, name: 'sp1' });
    }
    if (key === 'village') {
      sway(layer(T, 'blossom_branch', 60, -24, 180, { top: true }), 1, 8000); sway(layer(T, 'blossom_branch', 940, -24, 180, { top: true, flip: true }), 1, 8000, 1500);
      layer(T, 'sparrow', 297, 205, 30, { front: false, name: 'sp297' }); layer(T, 'sparrow', 719, 205, 30, { front: false, flip: true, name: 'sp719' });
    }
    if (key === 'feast') {
      const lh = 120, lw = lh * LAR.lantern_sil, xs = [200, 800];
      xs.forEach((x, i) => sway(layer(T, 'lantern_sil', x, -12, lh, { top: true, flip: i === 1 }), 1, 7000, i * 1500));
      glowDots(T, xs.flatMap(x => LANTERN_HOLES.map(([fx2, fy]) => [x - lw / 2 + fx2 * lw, -12 + fy * lh])), 6, '#F2B366', 1200);
      layer(T, 'bush_sil', 30, 590, 120); layer(T, 'bush_sil', 970, 590, 120, { flip: true });
      tint(T, '#E8703A', .12, 1400);
    }
  }
  /* 고추 꾸러미: 처마 밑 벽(문과 마늘 타래 사이를 피해 왼쪽 기둥 옆) [가운데 x, 윗 y] */
  const CHILI = [300, 150];
  const hot = (T, cx, cy, r) => T.el('circle', { cx, cy, r, fill: '#fff', 'fill-opacity': .01 }, T.world);
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   /* 세기는 말로만 (말풍선 없음) */
  /* 세기 미션의 수는 할 때마다 바뀐다(괭이 3~6, 엽전 4~8, 엽전은 괭이와 다른 수). 안내·재안내·끝 대사는 수별로 미리 녹음해 두었다 → 문장이 voice_script 와 글자까지 같아야 한다 */
  const KN = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟'], KC = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟'];
  const words = n => KC.slice(1, n + 1).join(', ');
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const hoeRows = n => n <= 3 ? [n] : n === 4 ? [2, 2] : n === 5 ? [3, 2] : [3, 3];   // 아래 줄부터 채워 항아리 위로 솟아오른다

  async function run(T) {
    /* 시작 음악 (2026-10-28): 첫 장면 시작에 12초 깔고, 첫 장면 전환에서 끈다. 읽어 주기는 음량 .25 */
    const intro = (() => {
      let h = null, on = true;
      const stop = () => { on = false; try { h && h.stop(.8); h = null; } catch (e) { /* 무시 */ } };
      const go = (delay = 0) => {
        const f = () => { try { if (!on) return; const o = { vol: T.reading() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }; h = AudioFX.ambient('intro_korean_happy', o); if (!h) setTimeout(() => { try { if (on) h = AudioFX.ambient('intro_korean_happy', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
        if (delay) setTimeout(f, delay); else f();
      };
      try { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stop(); return sc0.apply(this, a); }; } catch (e) { /* 무시 */ }
      return { go, stop };
    })();
    try { AudioFX.sfx('magic_wand', 0); AudioFX.preloadSfx(['intro_korean_happy', 'daegeum', 'pop', 'ding', 'pow', 'tada', 'magic_wand', 'shimmer', 'birds_chirp_1', 'birds_chirp_2', 'dig_soil_1', 'dig_soil_2', 'dig_soil_3', 'ding_glock', 'pull_pop', 'coins_1', 'coins_2', 'zip_away', 'door_heavy_2', 'whistle_down', 'splash', 'comic_brass', 'pottery_break', 'pop_appear', 'party_horn', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'marimba_6', 'marimba_7', 'marimba_8']); } catch (e) { /* 요술 봉 소리 미리 불러오기 */ }
    if (T.fx) T.fx.style.pointerEvents = 'none';   // 효과 글자(pop)가 누르는 대상을 덮지 않게
    const { sleep, say, camSnap } = T;
    const tr = T.tr;
    const pan = (cx = 500) => camSnap(T.viewWidth() < 990 ? cx : 500, 280, 1);
    /* 소리 큐: 놀이에서만 만화 소리, 읽어 주기에서는 장면 시작 배경 소리(낮은 볼륨·4초 이내)와 요술 반짝만 */
    const amb = (name, v = .28, d = 4) => { try { const rd = T.reading(); AudioFX.ambient(name, { vol: rd ? Math.min(v, .18) : v, dur: rd ? Math.min(d, 4) : d }); } catch (e) { /* 소리 없이 */ } };
    const cue = (name, v) => { try { if (T.reading() && document.hidden && /^marimba_/.test(name)) return true; /* 화면 꺼짐: 한꺼번에 울리는 화음 방지 */ return AudioFX.sfx(name, T.reading() ? v * .8 : v); } catch (e) { return false; } };
    const later = (ms, name, v) => setTimeout(() => cue(name, v), ms);
    const note = (i, v = .8) => cue('marimba_' + Math.min(8, Math.max(1, i)), v);   // 세기: 한 번에 한 음, 올라간다
    const SCENE_AMB = { field: 'birds_chirp_2', village: 'birds_chirp_1' };
    /* 대금 한 소절(2026-10-29): 이웃에게 나누는 마음, 소동 뒤의 조용한 뉘우침에만(웃기는 순간엔 쓰지 않는다). 놀이 .3, 읽기 ×0.8 */
    const daeg = () => { try { const o = { vol: T.reading() ? .24 : .3, loop: false, fadeIn: .3, dur: 6.5 }; if (!AudioFX.ambient('daegeum', o)) setTimeout(() => { try { AudioFX.ambient('daegeum', o); } catch (e) { /* */ } }, 900); } catch (e) { /* */ } };
    const scene = (key, cx) => { try { AudioFX.stopAmbient(.5); } catch (e) { /* */ } T.clear(); bgImage(T, key); dress(T, key); pan(cx); if (SCENE_AMB[key]) amb(SCENE_AMB[key]); };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);

    const farmer = mk(T, { hoe: ['farmer_hoe', 250, 'left'], pull: ['farmer_pull', 250, 'right'], amaze: ['farmer_amaze', 250, 'left'],
      count: ['farmer_count', 250, 'left'], share: ['farmer_share', 200, 'left'], feast: ['farmer_feast', 250, 'left'] }); /* 2026-10-20 크기 일관성: 나눠 주기(share) 자세는 모자 폭이 다른 농부보다 22% 커서 250 → 200 */
    const wife = mk(T, { clap: ['fwife', 250, 'left'], share: ['fwife_share', 250, 'left'] });
    const rich = mk(T, { shout: ['rich_shout', 260, 'left'], grab: ['rich_grab', 260, 'left'], gold: ['rich_gold', 260, 'left'],
      pinned: ['rich_pinned', 190, 'left'], hurry: ['rich_hurry', 240, 'left'] });
    const jar = prop(T, 'jar', 170), cracked = prop(T, 'jar_cracked', 130);
    const hoe = prop(T, 'hoe', 100); // 2026-10-20 새 괭이 그림은 정사각형 그림이라 높이를 키움
    const olds = Array.from({ length: 8 }, (_, i) => mk(T, { a: ['father_fightA', 210, 'left'], b: ['father_fightB', 210, 'left'] })   /* 진짜 아버지(peek 210)와 같은 얼굴 크기 — 180 은 너무 작음(2026-10-30 사용자) */);
    const father = mk(T, { peek: ['father_peek', 210, 'left'], fall: ['father_fall', 150, 'left'] });

    const plow = i => {
      // 삽질 한 번 소리(옛 dig_soil 6.8초를 겹쳐 울려 이상했음 — 2026-10-30 사용자)
      farmer.hop(16, 300); cue('dig_soil_' + i, .6) || AudioFX.sfx('pop'); T.pop(farmer.x + 90, farmer.y - 300, tr(['영차!', '영차영차!', '으랏차!'][i - 1]));
    };
    const dig = i => { farmer.hop(10, 260); cue('dig_soil_' + i, .6) || AudioFX.sfx('pop'); };   // 땅속: 삽질 한 번
    const pull = i => {
      farmer.hop(14, 300); popSfx(T); T.pop(farmer.x - 60, farmer.y - 310, tr(['영차!', '영차영차!', '으랏차!'][i - 1]));
    };
    const sparrowHop = x => { const n = 'sp' + x; lyHop(n, 8, 220); setTimeout(() => lyHop(n, 8, 220), 260); };
    /* 땅속 항아리: 땅선(y≈370) 아래를 가려 두고 y 를 줄일수록 솟아오른다. 배경(pit_empty)에는 항아리가 없다(2026-10-30 사용자: 배경 항아리와 겹침) */
    let pitG = null;
    const bury = y => {
      if (!pitG || !pitG.isConnected) {
        const svg = T.world.ownerSVGElement;
        if (!svg.querySelector('#mjPitClip')) { const cp = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath'); cp.id = 'mjPitClip'; cp.setAttribute('clipPathUnits', 'userSpaceOnUse'); T.el('rect', { x: -2000, y: -2000, width: 5000, height: 2370 }, cp); (svg.querySelector('defs') || svg).appendChild(cp); }
        pitG = T.el('g', { 'clip-path': 'url(#mjPitClip)' }, T.world);
      }
      put(T, jar, 500, y); pitG.appendChild(jar.pos);
    };
    const unbury = () => { put(T, jar, 500, 430); if (pitG) { pitG.remove(); pitG = null; } };
    const jarGlint = () => { sparkle(T, jar.x, 345, 6, 60); lyHop('sp1', 6, 200); };
    const goldGlint = i => { sparkle(T, 560 + i * 90, 380, 10, 80, ['#EBD08A', '#F6ECD8']); };
    /* ===== 읽어 주기 동사 맵: 놀이판 장면·배우·컷 함수를 감싼 얇은 함수 (대본 read_script_el.json) ===== */
    const RD = { hoes: [], coins: [], golds: [] };
    const nums = s => String(s).split(',').map(Number);
    const hideAll = list => { list.forEach(h => hide(h)); list.length = 0; };
    const actorVerbs = (a, extra = {}) => (op, ...r) => {
      if (op === 'look') return a.look(r[0], r[1]);
      if (op === 'at') { const [x, y] = nums(r[0]); return put(T, a, x, y, { look: r[1], to: r[2] }); }
      if (op === 'walk') { const [x, y, ms] = nums(r[0]); return a.move(fx(T, x), y, ms); }
      if (op === 'hop') return a.hop(26, 400);
      if (op === 'hide') return hide(a);
      return extra[op] ? extra[op](...r) : console.warn('[read] 요술 항아리: 모르는 동작', op);
    };
    const CUT_SFX = { clink: () => cue('ding_glock', .8) || AudioFX.sfx('pop'), buried: () => cue('coins_1', .7) || AudioFX.sfx('pop'),
      plop: () => { if (cue('whistle_down', .7)) later(650, 'splash', .4); else AudioFX.sfx('pop'); }, eight: () => cue('tada', .7) || AudioFX.sfx('pop'),
      hungry: () => cue('comic_brass', .7) || AudioFX.sfx('pop'), smash: () => AudioFX.sfx('pottery_break') || AudioFX.sfx('pow') };
    const cutVerb = k => T.cutImage([{ src: cutSrc(k), sfx: CUT_SFX[k] || (k === 'twohoes' || k === 'coins' ? 'shimmer' : 'pop'), hold: 2600 }], { hold: 2600 });   /* 2026-10-29 컷 멈춤 3000 → 2600 */
    const READ_ACTS = {
      set: k => scene(k),
      cam: s => { const [x, y, z] = nums(s); camSnap(x, y, z); },
      cut: cutVerb,
      confetti: () => T.confetti(),
      fx: k => k === 'clink' ? clinkSfx(T) : k === 'pow' ? AudioFX.sfx('pow') : k === 'tada' ? (AudioFX.sfx('tada') || AudioFX.sfx('pop')) : popSfx(T),
      pop: s => { const [x, y, ...t] = String(s).split(','); T.pop(+x, +y, tr(t.join(','))); },
      farmer: actorVerbs(farmer, {
        pull3: async () => { for (let i = 1; i <= 3; i++) { pull(i); await sleep(450); } },
        plow: async () => { for (let i = 1; i <= 3; i++) { plow(i); await sleep(450); } },
      }),
      wife: actorVerbs(wife),
      rich: actorVerbs(rich, {
        dash: async () => { rich.look('hurry', 'right'); for (const x of [150, 330, 180, 300]) { rich.turn(x > rich.x ? 'right' : 'left'); await rich.move(fx(T, x), 505, 600); } rich.look('shout', 'right'); },
      }),
      father: actorVerbs(father),
      jar: (op, ...r) => {
        if (op === 'at') { const [x, y] = nums(r[0]); return put(T, jar, x, y); }
        if (op === 'show') { jar.pos.style.display = ''; jar.pos.style.opacity = 1; return; }
        if (op === 'hide') return hide(jar);
        if (op === 'hop') return jar.hop(14, 260);
        if (op === 'bury') return bury(+r[0] || 525);
        if (op === 'dig') { unbury(); return jar.hop(40, 500); }
        if (op === 'lend') return (async () => { await sleep(300); await jar.move(fx(T, 700), 520, 600); hide(jar); })();
        console.warn('[read] 요술 항아리: 모르는 항아리 동작', op);
      },
      hoe: async op => {
        if (op !== 'drop') return;
        put(T, hoe, 400, 470); await sleep(300);
        await hoe.move(fx(T, 520), 400, 450, 'ease-in'); hide(hoe); jar.hop(14, 260); lyWig('chili', 3, 400);
      },
      cracked: op => { if (op === 'show') put(T, cracked, 700, 505); },
      hoes: async (op, n) => {
        if (op === 'hide') return hideAll(RD.hoes);
        n = +n; hideAll(RD.hoes);
        const spots = []; hoeRows(n).forEach((cnt, r) => { for (let c = 0; c < cnt; c++) spots.push([fx(T, 520) + (c - (cnt - 1) / 2) * 105, 335 - r * 115]); });
        for (let i = 0; i < n; i++) {
          const h2 = prop(T, 'hoe', 110); h2.pos.style.pointerEvents = 'none'; put(T, h2, spots[i][0], spots[i][1], { raw: true });
          if (!T.readInstant()) { h2.pos.animate([{ opacity: 0 }, { opacity: 1 }], 250); jar.hop(12, 240); note(i + 1) || popSfx(T); jarGlint(); await sleep(450); }
          RD.hoes.push(h2);
        }
      },
      coins: async (op, n) => {
        if (op === 'hide') return hideAll(RD.coins);
        n = +n; hideAll(RD.coins);
        const csp = tight(T) ? (n <= 5 ? 60 : 50) : (n <= 5 ? 90 : 72);
        for (let i = 1; i <= n; i++) {
          const c = prop(T, 'coin', 52); c.pos.style.pointerEvents = 'none'; put(T, c, fx(T, 520) + (i - (n + 1) / 2) * csp, 548, { raw: true });
          if (!T.readInstant()) { c.pos.animate([{ opacity: 0, translate: '0 -40px' }, { opacity: 1, translate: '0 0' }], 280); jar.hop(10, 220); note(i) || clinkSfx(T); jarGlint(); await sleep(450); }
          RD.coins.push(c);
        }
      },
      golds: async (op, n) => {
        if (op === 'hide') return hideAll(RD.golds);
        for (let i = 1; i <= +n; i++) {
          const d = prop(T, 'gold', 46); put(T, d, jar.x, 250); d.move(jar.x, 400, 300, 'ease-in').then(() => hide(d));
          const g = prop(T, 'gold', 70 + i * 24); put(T, g, 560 + i * 90, 505 - i * 6); RD.golds.push(g);
          jar.hop(12, 240); if (!note(i)) clinkSfx(T); if (i === 1) later(200, 'coins_2', .6); goldGlint(i); await sleep(500);
        }
      },
      fathers: async (op, n) => {
        if (op === 'hide') return olds.forEach(o => hide(o));
        if (op === 'hop') return olds.forEach((o, i) => o.hop(14 + (i % 3) * 4, 300));
        n = +n;
        for (let i = 1; i <= n; i++) {
          const o = olds[i - 1]; o.pos.style.pointerEvents = 'none';
          put(T, o, tight(T) ? 500 + (4.5 - i) * 48 : 880 - (i - 1) * 80 + 10, 520 - (i % 2) * 6, { look: i % 2 ? 'a' : 'b', to: 'left', s: tight(T) ? .72 : 1, raw: tight(T) });
          if (!T.readInstant()) { o.pos.animate([{ opacity: 0 }, { opacity: 1 }], 250); jar.hop(10, 200); note(i) || popSfx(T); await sleep(450); }
        }
      },
      rice: async op => {
        if (op !== 'share') return;
        const spots = [78, 297, 500, 719, 922];
        for (let n = 0; n < 5; n++) {
          const x = spots[n];
          if (tight(T)) await Promise.all([T.camTo(x, 280, 1, 600), farmer.move(x, 540, 600)]);
          const sack = prop(T, 'rice', 62); put(T, sack, farmer.x, 440, { raw: true });
          note(n + 1) || popSfx(T);
          await sack.move(x, 450, 520, 'ease-in');
          sack.hop(16, 260); farmer.hop(12, 240); sparrowHop(x); await sleep(400);
        }
        if (tight(T)) await T.camTo(500, 280, 1, 600);
        petals(T, 8);
      },
      tables: async op => {
        if (op !== 'show') return;
        const ts = [170, 820].map(x => { const t = prop(T, 'table', 80); put(T, t, x, 540); return t; });
        for (const [i, t] of ts.entries()) { await sleep(600); cue('pop_appear', .7) || popSfx(T); t.hop(20, 300); T.pop(t.x, t.y - 120, tr(['냠냠!', '맛있다!'][i])); }
      },
    };
    /* 읽어 주기 소리 큐 (2026-10-28): 대본 동사 snd:<이름>:<볼륨>:<지연ms> · amb:<이름>:<볼륨>:<초>. 소리는 대사를 막지 않는다 */
    Object.assign(READ_ACTS, {
      daeg: () => daeg(),
      snd: (n, v = .7, d = 0) => { try { +d > 0 ? later(+d, n, +v) : cue(n, +v); } catch (e) { /* */ } },
      amb: (n, v = .2, d = 4) => { try { AudioFX.ambient(n, { vol: +v, dur: Math.min(+d, 5) }); } catch (e) { /* */ } },
    });
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) {   // 읽어 주기: 아래 놀이 흐름은 돌지 않는다
      return T.readPlay(READ_ACTS).finally(() => { try { AudioFX.stopAmbient(); } catch (e) { /* */ } });
    }

    /* --- 1. 밭 --- */
    scene('field');
    put(T, farmer, 460, 480, { look: 'hoe', to: 'right' });
    await T.curtain(true);
    intro.go(); // 시작 음악 (놀이)
    await say('옛날 옛날에 마음씨 착한 농부가 살았어요.');
    await say('농부는 밭을 열심히 갈았어요.');   // 누르기 없이 저절로(2026-10-30 사용자: 첫 장면은 그냥 넘기기)
    for (let i = 1; i <= 3; i++) { await plow(i); await sleep(450); }
    await T.cutImage([{ src: cutSrc('clink'), sfx: () => cue('ding_glock', .8) || AudioFX.sfx('pop'), hold: 2600 }], { hold: 2600 });
    await say('쨍! 괭이 끝에 뭔가 딱딱한 게 닿았어요.');

    /* --- 2. 항아리 캐내기 --- */
    await T.sceneCard(tr('땅속'), () => {
      scene('pit');
      put(T, farmer, 680, 520, { look: 'pull', to: 'left' });
      bury(525);   // 테두리만 살짝 보인다
    }, farmer.pos);
    await say('땅속에서 둥근 뚜껑이 보여요.');
    /* 땅 파기는 저절로, 항아리 당기기는 손으로(2026-10-30 사용자) — 세 번 파서 뚜껑이 드러나면, 농부를 누를 때마다 한 번 영차 당긴다 */
    for (let i = 1; i <= 3; i++) { dig(i); bury([0, 518, 511, 505][i]); await sleep(500); }
    const PULL = '농부를 톡! 눌러서 항아리를 당겨 봐요!';
    for (let i = 1; i <= 3; i++) {
      if (i === 1) await T.ask(PULL, () => T.tap(farmer.pos, { prompt: PULL })); else await T.tap(farmer.pos, { prompt: PULL });
      pull(i);
      if (i < 3) { bury([0, 475, 445][i]); jar.hop(8, 260); }
      await sleep(350);
    }
    unbury(); jar.hop(40, 500); cue('pull_pop', .8);
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
    await say('농부가 괭이를 항아리 옆에 두려다 그만 항아리 속에 떨어뜨렸어요.');
    await sleep(500);
    await hoe.move(fx(T, 520), 400, 450, 'ease-in'); hide(hoe); jar.hop(14, 260); lyWig('chili', 3, 400);
    await T.cutImage([{ src: cutSrc('twohoes'), sfx: () => AudioFX.sfx('shimmer') || AudioFX.sfx('magic_wand') || AudioFX.sfx('pop'), hold: 2600 }], { hold: 2600 });
    await say('"어머나! 괭이가 두 개가 되었어요!" 아내가 깜짝 놀랐어요.');
    const hoes = [], nHoe = rnd(3, 6);
    let nCoin; do nCoin = rnd(4, 8); while (nCoin === nHoe);
    const hoeSpots = []; hoeRows(nHoe).forEach((cnt, r) => { for (let c = 0; c < cnt; c++) hoeSpots.push([fx(T, 520) + (c - (cnt - 1) / 2) * 105, 335 - r * 115]); });
    await T.ask(`항아리를 ${KN[nHoe]} 번 톡톡 눌러서 괭이를 ${KN[nHoe]} 개 세어 봐요!`, () => T.mash(jar.pos, { count: nHoe, prompt: `항아리를 ${KN[nHoe]} 번 톡톡! 괭이를 세어 봐요.`, onStep: i => {
      const h2 = prop(T, 'hoe', 110); h2.pos.style.pointerEvents = 'none'; put(T, h2, hoeSpots[i - 1][0], hoeSpots[i - 1][1], { raw: true });
      h2.pos.animate([{ opacity: 0 }, { opacity: 1 }], 250); hoes.push(h2);
      jar.hop(12, 240); note(i) || popSfx(T); vo('n' + i); jarGlint(); if (i === nHoe) later(500, 'tada', .7);
    } }));
    await say(`괭이가 ${words(nHoe)}! 농부와 아내는 손뼉을 쳤어요.`);
    await wife.hop(30, 400);

    /* --- 4. 엽전 --- */
    await T.cutImage([{ src: cutSrc('coins'), sfx: () => AudioFX.sfx('shimmer') || AudioFX.sfx('magic_wand') || AudioFX.sfx('pop'), hold: 2600 }], { hold: 2600 });
    scene('jarfront');
    hoes.forEach(h => hide(h));
    put(T, jar, 520, 500); put(T, farmer, 270, 500, { look: 'count', to: 'right' }); put(T, wife, 780, 500, { look: 'clap', to: 'left' });
    cue('coins_1', .6);
    await say('이번에는 엽전 하나를 넣어 봤어요. 와르르! 엽전이 쏟아져 나왔어요.');
    const csp = tight(T) ? (nCoin <= 5 ? 60 : 50) : (nCoin <= 5 ? 90 : 72);   // 엽전 사이 간격: 8개까지 가로·세로 화면 안에 들어오게
    await T.ask(`항아리를 ${KN[nCoin]} 번 톡톡 눌러서 엽전을 ${KN[nCoin]} 개 세어 봐요!`, () => T.mash(jar.pos, { count: nCoin, prompt: `항아리를 ${KN[nCoin]} 번 톡톡! 엽전을 세어 봐요.`, onStep: i => {
      const c = prop(T, 'coin', 52); c.pos.style.pointerEvents = 'none'; put(T, c, fx(T, 520) + (i - (nCoin + 1) / 2) * csp, 548, { raw: true });
      c.pos.animate([{ opacity: 0, translate: '0 -40px' }, { opacity: 1, translate: '0 0' }], 280);
      jar.hop(10, 220); note(i) || clinkSfx(T); vo('n' + i); jarGlint(); if (i === nCoin) later(500, 'tada', .7);
    } }));
    await say(`엽전이 ${words(nCoin)}! 이제 쌀도 사고 옷도 살 수 있어요.`);

    /* --- 5. 이웃에게 나눠 주기 --- */
    await T.sceneCard(tr('이웃 마을'), () => {
      scene('village');
      put(T, farmer, 500, 540, { look: 'share', to: 'left' });
    }, farmer.pos);
    daeg(); // 이웃에게 나누는 마음 — 대금
    await say('착한 농부는 혼자만 쓰지 않았어요. 이웃 다섯 집에 쌀을 나눠 주러 갔어요.');
    const spots = [78, 297, 500, 719, 922];
    let rest = spots.map((x, i) => ({ x, i }));
    for (let n = 0; n < 5; n++) {
      let got;
      /* 다섯 집 모두 손으로 톡(2026-10-30 사용자: 쌀 나눠 주기는 수동) */
      const RICE = '집을 톡! 쌀을 나눠 줘요.';
      const ask = f => (n === 0 ? T.ask(RICE, f) : f());
      if (tight(T)) {
        /* 세로 화면: 집을 하나씩 카메라가 따라가며 보여 주고, 눌러야 하는 집은 늘 화면 안에 있다 */
        got = { key: rest[0] };
        await Promise.all([T.camTo(got.key.x, 280, 1, 600), farmer.move(got.key.x, 540, 600)]);
        const el = hot(T, got.key.x, 400, 80);
        await ask(() => T.tap(el, { prompt: RICE }));
        el.remove();
      } else {
        const opts = rest.map(r => ({ key: r, el: hot(T, r.x, 400, 70), ok: true }));
        got = await ask(() => T.choose(opts, { prompt: RICE }));
        opts.forEach(o => o.el.remove());
      }
      rest = rest.filter(r => r !== got.key);
      const sack = prop(T, 'rice', 62); put(T, sack, farmer.x, 440, { raw: true });
      popSfx(T);
      await sack.move(got.key.x, 450, 520, 'ease-in');
      note(n + 1, .7); sack.hop(16, 260); vo('n' + (n + 1)); sparrowHop(got.key.x);
      farmer.hop(12, 240);
    }
    if (tight(T)) await T.camTo(500, 280, 1, 600);
    petals(T, 8);
    await say('다섯 집 모두 쌀을 받고 활짝 웃었어요. 마을이 함께 행복해졌어요.');

    /* --- 6. 욕심쟁이 부자 --- */
    await T.sceneCard(tr('부잣집'), () => {
      scene('richgate');
      put(T, rich, 740, 520, { look: 'shout', to: 'left' });
      put(T, farmer, 380, 520, { look: 'share', to: 'right' });
      put(T, jar, 500, 520); hide(jar);
    }, rich.pos);
    await say('소문을 들은 부잣집 주인이 농부를 불렀어요. "그 항아리를 나한테 빌려주게!"');
    await say('마음씨 착한 농부는 웃으며 말했어요. "필요하시면 쓰세요. 잘 쓰고 돌려주세요!"');
    put(T, jar, 430, 520);
    await sleep(500);
    await jar.move(fx(T, 700), 520, 600); hide(jar);
    rich.look('grab', 'right');
    await say('"고맙네! 얼른 가져가야지, 헤헤." 부자는 항아리를 꼭 안고 달려갔어요.');
    cue('zip_away', .6); await rich.move(fx(T, 1200), 520, 1300, 'ease-in');

    /* --- 7. 금덩이 --- */
    await T.sceneCard(tr('큰 방'), () => {
      scene('hall'); cue('door_heavy_2', .6);
      put(T, rich, 330, 505, { look: 'shout', to: 'right' });
      put(T, jar, 650, 505); jar.pos.style.display = '';
    }, jar.pos);
    await say('부자는 방에 항아리를 놓고 말했어요. "금덩이를 넣으면 금이 산더미가 되겠지!"');
    const golds = [];
    const goldIn = i => {
      /* 금덩이를 하나 항아리에 쏙 넣으면, 항아리에서 금이 와르르 쏟아져 쌓인다 */
      const d = prop(T, 'gold', 46); put(T, d, jar.x, 250); d.move(jar.x, 400, 300, 'ease-in').then(() => hide(d));
      const g = prop(T, 'gold', 70 + i * 24); put(T, g, 560 + i * 90, 505 - i * 6); g.pos.style.opacity = 0; golds.push(g);
      setTimeout(() => { g.pos.animate([{ opacity: 0 }, { opacity: 1 }], 250).onfinish = () => { g.pos.style.opacity = 1; }; g.pos.style.opacity = 1; }, 300);
      jar.hop(12, 240); note(i) || clinkSfx(T); if (i === 1) later(250, 'coins_2', .5); vo('n' + i); setTimeout(() => goldGlint(i), 300);
    };
    // 저절로 (2026-10-19 톡 조작 정리)
    for (let i = 1; i <= 3; i++) { await goldIn(i); await sleep(500); }
    await T.cutImage([{ src: cutSrc('buried'), sfx: () => cue('coins_1', .7) || AudioFX.sfx('pop'), hold: 2600 }], { hold: 2600 });
    scene('hall');
    put(T, jar, 650, 505); golds.forEach(g => { g.pos.style.display = ''; T.world.appendChild(g.pos); });
    put(T, rich, 330, 505, { look: 'pinned', to: 'left' });
    await say('금덩이가 와르르! 부자는 금 더미에 폭 파묻혔어요. "사람 살려~"');
    await T.ask('부자를 톡! 눌러서 꺼내 줘요.', () => T.tap(rich.pos, { prompt: '부자를 톡! 금 더미에서 꺼내 줘요.' }));
    golds.forEach(g => hide(g)); cue('pull_pop', .8) || popSfx(T);
    rich.look('shout', 'right'); rich.hop(30, 400);
    await say('쏙! 부자가 빠져나왔어요. 다치지는 않았어요.');

    /* --- 8. 아버지가 풍덩 --- */
    await T.sceneCard(tr('아버지'), () => {
      scene('hallwide');
      put(T, jar, 700, 505); put(T, rich, 240, 505, { look: 'shout', to: 'right' });
      put(T, father, 480, 505, { look: 'peek', to: 'right' });
    }, father.pos);
    await say('그때 부자의 아버지가 다가와 항아리 속을 들여다보았어요. "이게 뭐냐?"');
    await sleep(500);
    await father.move(fx(T, 660), 505, 700);
    await T.cutImage([{ src: cutSrc('plop'), sfx: () => { if (cue('whistle_down', .7)) later(650, 'splash', .4); else AudioFX.sfx('pop'); }, hold: 2600 }], { hold: 2600 });
    scene('hallwide');
    put(T, jar, 700, 505); put(T, rich, 240, 505, { look: 'shout', to: 'right' });
    await say('풍덩! 아버지가 항아리에 거꾸로 쏙 빠졌어요. 다치지는 않았어요.');
    await T.ask('"아버지가 어디 계시지?" 항아리를 여덟 번 톡톡 눌러서 아버지를 세어 봐요!', () => T.mash(jar.pos, { count: 8, prompt: '항아리를 여덟 번 톡톡! 아버지를 세어 봐요.', onStep: i => {
      const o = olds[i - 1]; o.pos.style.pointerEvents = 'none';   // 항아리 위·옆에 쌓이는 아버지 그림이 눌림을 가로채지 않게
      put(T, o, tight(T) ? 500 + (4.5 - i) * 48 : 880 - (i - 1) * 80 + 10, 520 - (i % 2) * 6, { look: i % 2 ? 'a' : 'b', to: 'left', s: tight(T) ? .72 : 1, raw: tight(T) });
      o.pos.animate([{ opacity: 0 }, { opacity: 1 }], 250); jar.hop(10, 200); note(i) || popSfx(T); vo('n' + i);
    } }));
    await T.cutImage([{ src: cutSrc('eight'), sfx: () => cue('tada', .7) || AudioFX.sfx('pop'), hold: 2600 }], { hold: 2600 });
    await say('아버지가 하나, 둘, 셋, 넷, 다섯, 여섯, 일곱, 여덟! 여덟 명이나 되었어요.');
    await say('"내가 진짜 아버지다!" "아니야, 내가 진짜야!" 모두 서로 자기가 진짜라고 우겼어요.');
    olds.forEach((o, i) => o.hop(14 + (i % 3) * 4, 300));
    await T.cutImage([{ src: cutSrc('hungry'), sfx: () => cue('comic_brass', .7) || AudioFX.sfx('pop'), hold: 2600 }], { hold: 2600 });
    rich.look('hurry', 'right');
    const dash = (async () => { for (const x of [150, 330, 180, 300]) { rich.turn(x > rich.x ? 'right' : 'left'); await rich.move(fx(T, x), 505, 600); } })();
    await say('"배고프다! 밥 줘라!" 부자는 쟁반을 들고 이리저리 뛰어다녔어요.');
    await dash; rich.look('shout', 'right');

    /* --- 9. 항아리가 깨졌어요 --- */
    await say('부자는 지쳐서 외쳤어요. "이게 다 항아리 때문이야! 이제 그만!"');
    await sleep(500);
    await T.cutImage([{ src: cutSrc('smash'), sfx: () => AudioFX.sfx('pottery_break') || AudioFX.sfx('pow'), hold: 2600 }], { hold: 2600 });
    scene('hallwide');
    olds.forEach(o => hide(o)); hide(jar);
    put(T, cracked, 700, 505); put(T, rich, 300, 505, { look: 'shout', to: 'right' }); put(T, father, 500, 505, { look: 'peek', to: 'right' });
    daeg(); // 소동이 끝난 뒤의 조용함 — 대금
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
      await sleep(600);
      cue('pop_appear', .7) || popSfx(T); t.hop(20, 300); T.pop(t.x, t.y - 120, tr(['냠냠!', '맛있다!'][i]));
    }
    await say('"모두 고맙네!" 모두 둘러앉아 맛있게 먹었어요.');
    await sleep(600);   /* 마지막 톡 없음: 만세는 저절로 */
    T.confetti(); cue('party_horn', .9);
    await Promise.all([farmer.hop(40, 500), wife.hop(30, 500), rich.hop(30, 500), father.hop(24, 500)]);
    await say('나누면 기쁨이 커져요. 요술 항아리 이야기는 이렇게 끝났어요.');
    try { AudioFX.stopAmbient(); } catch (e) { /* */ }
    T.finale();
    return '나누면 기쁨이 커져요!';
  }

  Tale.mount({ title: '요술 항아리', subtitle: '나누면 기쁨이 커져요', read: true, run: T => run(Tale.api) });
})();
