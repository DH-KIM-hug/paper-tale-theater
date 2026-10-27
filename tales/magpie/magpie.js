/* 은혜 갚은 까치 — 한국 전래동화 원작 그대로. 기획: tales/magpie/PLAN.md, 상세: SPEC.md (2026-10-20 재기획, 9장)
   톡 3번(2장 활 · 7장 종 · 9장 인사), 숫자 알기 1개(3장, 아기 까치 1~5마리 무작위 + 숫자 카드), 연타 없음, 줄거리 선택 없음.
   구렁이 아내는 여자 목소리. 까치는 죽지 않고 쓰러져 잠들었다 새벽에 깨어난다. 종소리는 범종 녹음(beomjong.mp3, 없으면 beomjong_synth.mp3).
   크기: 자세가 달라도 같은 인물은 같은 크기(HT 표). 부모 까치는 아기의 약 2.1배. 그림: assets/v3w/mg_*.webp + mg2_*.webp (목록 tools/app/gen/jobs_magpie.json)
   그림 파일이 없으면 종이 자리표시가 대신 그려지고, 있으면 실제 가로세로 비율을 읽어 ASP 를 덮어쓴다. 시험용: ?n=1..5 로 아기 까치 수 고정. */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { mg_scholar_walk: .5857, mg_scholar_bow: .5881, mg_scholar_surprise: .6786, mg_scholar_bow_shoot: .7889, mg_scholar_water: .9439,
    mg_snake_coil: 1.0158, mg_snake_flee: 1.4415, mg_chick: .8076,
    mg_mag_mom_sit: 1.3506, mg_mag_dad_sit: 1.2688, mg_mag_mom_fly: 1.2452, mg_mag_dad_fly: 1.2044, mg_mag_mom_tired: 1.8259, mg_mag_dad_tired: 1.8827,
    mg2_scholar_bow_ready: .8533, mg2_scholar_bow_release: .8033, mg2_scholar_sit_worry: .7117, mg2_lady_greet: .725, mg2_lady_stern: .7267, mg2_lady_tail: .7883,
    mg2_prop_arrow: 4.8649, mg2_prop_nest_rim: 2.0045, mg2_prop_bell: .615 };
  const NAT = { mg_scholar_walk: 'right', mg2_scholar_bow_ready: 'right', mg2_scholar_bow_release: 'right', mg_scholar_bow_shoot: 'left', mg_scholar_water: 'left',
    mg_snake_flee: 'right', mg_mag_mom_sit: 'left', mg_mag_dad_sit: 'left', mg_mag_mom_fly: 'right', mg_mag_dad_fly: 'right',
    mg_mag_mom_tired: 'right', mg_mag_dad_tired: 'right', mg2_prop_arrow: 'right' };   // 그 밖의 그림은 앞모습('front')
  const FL = 505;
  const BGS = ['mg_bg_path', 'mg_bg_bigtree', 'mg_bg_nest', 'mg_bg_night', 'mg_bg_porch', 'mg_bg_paperdoor', 'mg_bg_moonnest', 'mg2_bg_belltower_night', 'mg_bg_belltower', 'mg_bg_dawn'];
  const CUTS = ['mg_cut_arrow', 'mg_cut_flee', 'mg_cut_flock', 'mg_cut_ring', 'mg_cut_wake'];
  const src = k => AS + k + '.webp';
  /* 2026-10-23 화려한 다층 재기획(VISUAL_PLAN.md): 배경 키(대본·PXM·CAMP·BG_PLACE)는 그대로, 파일만 v2·라이트박스로.
     산길·큰 나무(둥지 자리)·밤 산길·외딴집·창호문·종탑(밤·아침)·새벽 마당은 옛 그림과 겹쳐 같은 자리(±1%).
     둥지(mg_bg_nest)는 v2 둥지가 아래로 약 5% 내려가 그려져(±1.5% 넘음) 기존 그림을 그대로 쓴다(둥지는 움직이지 않는다).
     라이트박스: 창호문(5·8장), 달밤(6장), 밤 종탑(7장) */
  /* 2026-10-23 사용자 결정: 큰 나무·밤 산길·창호문·달밤·밤 종탑·아침 종탑은 옛 그림으로 되돌림(짝 소품·라이트박스 연출도 뺌). 아침 종탑 dy −85 는 그림과 상관없이 아래 빈 띠(약 15px)를 채우는 값이라 그대로 둔다 */
  const BGFILE = { mg_bg_path: 'mg2_bg_path_v2', mg_bg_porch: 'mg2_bg_porch_v2', mg_bg_dawn: 'mg2_bg_dawn_v2' };
  const bgSrc = k => src(BGFILE[k] || k);
  /* 층 소품(mg2_layer_*, 누름 없음) 그림 폭/높이 */
  const LAR = { maple_branch: .8, leaf_pile: 2.1327, leaf: .99, pine_sprig: .9983, blossom_branch: .6817, petal: .8583, pine_branch_sil: .8967, grass_sil: 4.0909, soban_sil: 1.1233 };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  /* 아침 종탑: 1.2배로 아래가 약 15px 비던 것(AUDIT 9장)을 v2 그림에서 15 내려 채움(-100 → -85) */
  const BG_PLACE = { mg_bg_belltower: { dx: 130, dy: -85, s: 1.2 }, mg_bg_nest: { dx: 40, dy: 47, s: 1.25 } };
  const artOK = {}, bgOK = {}, cutOk = {};
  const INK = '#2E241C', CR = '#F6ECD8';
  const PHC = { scholar: '#8FB4E0', lady: '#3F6B4F', snake: '#7A9A4E', mag: '#3B3B44', chick: '#D9A94E', prop: '#A47A4A' };
  const LBL = { mg2_scholar_bow_ready: '선비 활 들기', mg2_scholar_bow_release: '선비 쏜 뒤', mg2_scholar_sit_worry: '선비 걱정', mg2_lady_greet: '여인', mg2_lady_stern: '여인(굳은 얼굴)',
    mg2_lady_tail: '여인(꼬리)', mg2_prop_arrow: '화살', mg2_prop_nest_rim: '둥지 앞테', mg2_prop_bell: '범종' };
  const BGNAME = { mg2_bg_belltower_night: '밤의 종탑' };
  function ph(T, g, f, w, h) {
    const col = /scholar/.test(f) ? PHC.scholar : /lady/.test(f) ? PHC.lady : /snake/.test(f) ? PHC.snake : /chick/.test(f) ? PHC.chick : /mag/.test(f) ? PHC.mag : PHC.prop;
    T.el('rect', { x: -w / 2, y: -h, width: w, height: h, rx: Math.min(14, h / 4), fill: col }, g);
    if (h > 60) { T.el('circle', { cx: 0, cy: -h + Math.min(w, h) * .22, r: Math.min(w, h) * .18, fill: '#F2CDA8' }, g); }
    const t = T.el('text', { x: 0, y: -h / 2, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: CR, 'paint-order': 'stroke', stroke: INK, 'stroke-width': 3, text: LBL[f] || f.replace(/^mg2?_/, '') }, g);
    t.style.pointerEvents = 'none'; return t;
  }
  function mk(T, poses) {
    const looks = {}, labels = [];
    const a = T.actor(T.world, -400, 520, g => {
      Object.entries(poses).forEach(([k, [f, h]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        if (artOK[f]) T.el('image', { href: src(f), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        else labels.push(ph(T, wrap, f, w, h));
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
      });
    });
    const place0 = a.place;
    a.place = (x, y) => { place0(x, y); labels.forEach(t => t.setAttribute('transform', `scale(${a.flip},1)`)); };
    a.want = 'left';
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.w = looks[k].w; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 450) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  function bgImage(T, key) {
    if (!bgOK[key]) {
      T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3800, fill: /night/.test(key) ? '#1F2A56' : '#E9DDBF' }, T.bg);
      const t = T.el('text', { x: 18, y: 30, 'font-size': 15, 'font-weight': 700, fill: INK, opacity: .7, text: '[그림 준비 중] ' + (BGNAME[key] || key) }, T.bg); return t;
    }
    const { dx = 0, dy = 0, s = 1 } = BG_PLACE[key] || {};
    const w = BGBOX.w * s, h = BGBOX.h * s;
    const x = s === 1 ? BGBOX.x + dx : 500 + dx - w / 2, y = s === 1 ? BGBOX.y + dy : 280 + dy - h / 2;
    const img = (extra = {}) => T.el('image', { href: bgSrc(key), x, y, width: w, height: h, preserveAspectRatio: 'none', ...extra }, T.bg);
    if (dx > 0 && s === 1) img({ transform: `matrix(-1,0,0,1,${2 * x},0)` });
    if (dy < 0 && s === 1) { img({ transform: `matrix(1,0,0,-1,0,${2 * (y + h)})` }); if (dx > 0) img({ transform: `matrix(-1,0,0,-1,${2 * x},${2 * (y + h)})` }); }
    return img();
  }
  /* ---- 층 소품: 누름 없음. 앞 가림 층은 T.fx(배우 위), 중간 층은 T.bg(배우 뒤). (cx, y) = 가운데·발끝, top 이면 윗변 ---- */
  const LY = {};
  function layer(T, k, cx, y, h, { front = true, flip = false, top = false, name } = {}) {
    const w = h * LAR[k], g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
    if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
    const inner = T.el('g', { filter: 'url(#pp)' }, g);
    T.el('image', { href: AS + 'mg2_layer_' + k + '.webp', x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, inner);
    inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = top ? '50% 0%' : '50% 100%';
    if (name) LY[name] = inner;
    return inner;
  }
  const sway = (g, deg, ms, delay = 0) => { g.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }], { duration: ms, delay, iterations: Infinity, easing: 'ease-in-out' }); return g; };
  const lyWig = (name, deg = 3, ms = 400) => { const g = LY[name]; if (g && g.isConnected) g.animate([{ rotate: '0deg' }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }, { rotate: '0deg' }], { duration: ms, composite: 'add' }); };
  /* 낙엽·꽃잎: 위에서 아래로 사인 곡선 + 회전. xs = [[x0, x1], ...] 가운데(누르는 대상 위)를 피한 범위. loop 면 끝나면 다시 위에서 */
  function falling(T, k, n, h, xs, { loop = true, y0 = -30, y1 = 540, ms = [7000, 11000], front = false } = {}) {
    for (let i = 0; i < n; i++) {
      const [a, b] = xs[i % xs.length], x = a + Math.random() * (b - a), w = h * LAR[k], d = ms[0] + Math.random() * (ms[1] - ms[0]);
      const g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
      T.el('image', { href: AS + 'mg2_layer_' + k + '.webp', x: -w / 2, y: -h / 2, width: w, height: h }, g);
      const sx = (i % 2 ? 1 : -1) * 35;
      const an = g.animate([0, .25, .5, .75, 1].map((t, j) => ({ transform: `translate(${x + (j % 2 ? sx : 0)}px, ${y0 + t * (y1 - y0)}px) rotate(${t * 360}deg)`, opacity: t > .9 ? 0 : 1 })),
        { duration: d, delay: loop ? Math.random() * d * .8 : i * 160, iterations: loop ? Infinity : 1, easing: 'linear', fill: loop ? 'none' : 'forwards' });
      if (!loop) an.onfinish = () => g.remove();
    }
  }
  /* 반딧불: 사인 곡선으로 떠다니며 깜빡 (얼굴 자리 밖) */
  function fireflies(T, n, xs, [ya, yb] = [150, 380]) {
    return Array.from({ length: n }, (_, i) => {
      const [a, b] = xs[i % xs.length], x = a + Math.random() * (b - a), y = ya + Math.random() * (yb - ya);
      const g = T.el('g', { style: 'pointer-events:none' }, T.world);
      T.el('circle', { cx: x, cy: y, r: 6, fill: '#F6ECD8', opacity: .35 }, g); T.el('circle', { cx: x, cy: y, r: 3.5, fill: '#F2B366' }, g);
      const d = 5000 + Math.random() * 4000;
      g.animate([{ translate: '0 0', opacity: .2 }, { translate: '40px -25px', opacity: 1 }, { translate: '-20px 25px', opacity: .5 }, { translate: '0 0', opacity: .2 }], { duration: d, delay: -Math.random() * d, iterations: Infinity, easing: 'ease-in-out' });
      return g;
    });
  }
  /* 장면별 층 소품 (VISUAL_PLAN §3~§7). 세로 화면 가운데(x 285~715)에는 앞 가림 층을 두지 않는다. 안개 띠 소품(밤·새벽)은 땅 위에 떠 보여 쓰지 않는다(배경 그림에 안개 띠가 이미 있다) */
  function dress(T, key) {
    Object.keys(LY).forEach(k => delete LY[k]);
    if (key === 'mg_bg_path') {
      sway(layer(T, 'maple_branch', 90, -24, 170, { top: true }), 1.2, 7000); sway(layer(T, 'maple_branch', 930, -24, 170, { top: true, flip: true }), 1.2, 7000, 1500);
      layer(T, 'leaf_pile', 40, 590, 90, { name: 'pileL' }); layer(T, 'leaf_pile', 985, 590, 90, { flip: true });
      falling(T, 'leaf', 6, 22, [[0, 1000]]);
    }
    if (key === 'mg_bg_nest') { layer(T, 'pine_sprig', 50, 590, 150); layer(T, 'pine_sprig', 950, 590, 150, { flip: true }); }
    if (key === 'mg_bg_porch') LY.flies = fireflies(T, 8, [[0, 250], [800, 1000]]);
    /* 달밤: 왼쪽 나무에서 뻗은 가지. 가운데 윗면 y≈345(부모 까치 발끝), 달(x≈750) 밖.
       놀이·읽기 모두 dress 를 쓰며 까치 높이·배율은 그대로 유지한다. */
    if (key === 'mg_bg_moonnest') T.el('image', { href: src('mg2_layer_moon_perch'), x: -40, y: 278, width: 700, height: 184.333, preserveAspectRatio: 'none', style: 'pointer-events:none' }, T.bg);
  }
  const sfx = (name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const bellSfx = (T, vol = .9) => { (AudioFX.sfx('beomjong', vol) || AudioFX.sfx('beomjong_synth', vol)); T.tone(64, 2.2, { type: 'sine', vol: .12 * vol }); };
  const sparkleSfx = (T, v) => AudioFX.sfx('sparkle', v) || T.tone([700, 1400], .3, { vol: .15 });
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);
  const wiggleEl = (T, n) => T.anim(n, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360);
  const bob = el => el.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3, easing: 'ease-in-out' });

  function numCard(T, n, x, y, s = 1) {
    const w = 100 * s, h = 130 * s;
    const g = T.paper(T.world, [['rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10 * s, fill: '#F6ECD8' }],
      ['rect', { x: -w / 2 + 8 * s, y: -h / 2 + 8 * s, width: w - 16 * s, height: h - 16 * s, rx: 6 * s, fill: 'none', stroke: '#6B4A32', 'stroke-width': 3 * s }]],
      { transform: `translate(${x},${y})` });
    T.el('text', { x: 0, y: 30 * s, 'text-anchor': 'middle', 'font-size': 86 * s, 'font-weight': 800, fill: '#A93B32', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: String(n) }, g);
    return { n, g, x, y };
  }
  function swingBell(bell) {
    bell.body.animate([{ rotate: '0deg' }, { rotate: '5deg', offset: .12 }, { rotate: '-4deg', offset: .4 }, { rotate: '2.5deg', offset: .65 }, { rotate: '-1deg', offset: .85 }, { rotate: '0deg' }], { duration: 2600, easing: 'ease-in-out' });
  }

  const S = {
    L0: "옛날 옛날, 마음씨 고운 선비가 과거를 보러 먼 길을 떠났어요.",
    L1: "저벅저벅. 산 넘고 물 건너, 선비는 깊은 산속으로 들어갔어요.",
    L2: "까악, 까악! 도와주세요!",
    L3: "큰 소나무 위 둥지에 아기 까치들이 있어요. 그런데 구렁이가 스르르 올라가고 있어요!",
    L4: "안 돼! 내가 아기 까치들을 지켜 줄게.",
    L5: "선비가 활을 꺼냈어요. 선비를 톡 눌러 봐요.",
    L6: "쉬익, 탁! 화살이 구렁이 바로 옆 나무에 꽂혔어요.",
    L7: "깜짝 놀란 구렁이는 스르르 숲으로 달아났어요.",
    L8: "고맙습니다, 선비님! 이 은혜는 꼭 갚을게요.",
    L9: "둥지 안에서 아기 까치들이 고개를 쏙 내밀었어요.",
    L10: "아기 까치가 몇 마리일까요? 맞는 숫자를 골라요.",
    W1: "그건 1이에요. 다시 세어 볼까요?",
    W2: "그건 2예요. 다시 세어 볼까요?",
    W3: "그건 3이에요. 다시 세어 볼까요?",
    W4: "그건 4예요. 다시 세어 볼까요?",
    W5: "그건 5예요. 다시 세어 볼까요?",
    C1: "맞아요! 한 마리예요.",
    C2: "맞아요! 두 마리예요.",
    C3: "맞아요! 세 마리예요.",
    C4: "맞아요! 네 마리예요.",
    C5: "맞아요! 다섯 마리예요.",
    L11: "짹짹! 선비님, 고맙습니다!",
    L12: "선비는 빙긋 웃으며 다시 길을 떠났어요.",
    L13: "어느새 해가 지고, 산길은 캄캄해졌어요.",
    L14: "오늘 밤은 어디서 자지? …어, 저기 불빛이!",
    L15: "깊은 산속 외딴집에서 한 여인이 나왔어요.",
    L16: "어서 오세요, 나그네님. 하룻밤 쉬어 가세요.",
    L17: "고맙습니다. 하룻밤만 신세 질게요.",
    L18: "선비는 따뜻한 방에서 금세 잠이 들었어요.",
    L19: "한밤중, 선비는 으스스한 기운에 눈을 떴어요.",
    L20: "문 앞에 그 여인이 서 있었어요. 그런데… 치마 밑으로 꼬리가 삐죽!",
    L21: "나는 낮에 네가 활로 쫓아낸, 그 구렁이의 아내다.",
    L22: "내 남편을 놀라게 한 벌로, 너를 이대로 보내 줄 수는 없어.",
    L23: "저는 그저 아기 까치들을 지키려 했을 뿐이에요. 제발 보내 주세요.",
    L24: "좋아. 새벽이 오기 전에 저 산 위 절의 종이 세 번 울리면, 너를 놓아주마.",
    L25: "하지만 이 깊은 밤에, 누가 종을 치겠니? 후후…",
    L26: "종소리… 종이 울려야 해. 어떡하지…",
    L27: "그때, 큰 소나무 둥지의 까치 가족은 잠들지 못하고 있었어요.",
    L28: "여보, 선비님이 큰일 났어요! 외딴집의 구렁이 아내가…",
    L29: "종! 절의 종을 울리면 돼요. 우리가 날아가요!",
    L30: "아기들아, 둥지에서 꼭 기다리렴.",
    L31: "까치 엄마 아빠와 숲속 까치 친구들이 밤하늘로 날아올랐어요.",
    L32: "달빛을 가르며, 산 위 절을 향해 쌩쌩!",
    L33: "절은 고요했어요. 커다란 종이 달빛 아래 걸려 있었어요.",
    L34: "종을 쳐야 해. 우리 머리로, 온 힘을 다해!",
    L35: "종을 톡 눌러 봐요.",
    L36: "댕—. 깊고 큰 종소리가 산을 넘어 퍼져 갔어요.",
    L37: "댕—. 두 번째 종소리.",
    L38: "댕—. 세 번째 종소리가 울렸어요.",
    L39: "까치들은 온 힘을 다해 종을 울렸어요.",
    L40: "그리고 힘이 다 빠진 까치들은, 종 아래에 스르르 쓰러져 잠이 들었어요.",
    L41: "멀리서 종소리가 들려왔어요.",
    L42: "종이… 울렸어. 하나, 둘, 셋.",
    L43: "약속은 약속. 너를 놓아주마.",
    L44: "여인은 스르르 구렁이로 변하더니, 새벽 숲으로 사라졌어요.",
    L45: "종소리… 누가 종을 울렸을까? 가 봐야겠어!",
    L46: "선비는 산 위 절로 달려갔어요.",
    L47: "종 아래에, 까치 엄마 아빠가 눈을 감은 채 누워 있었어요.",
    L48: "까치야… 너희였구나. 나를 구하려고…",
    L49: "선비는 까치들을 품에 안고, 시원한 물을 한 모금씩 먹여 주었어요.",
    L50: "선비님… 무사하셨군요.",
    L51: "은혜를 갚았으니, 이제 됐어요.",
    L52: "그때 아기 까치들이 짹짹 울며 날아왔어요.",
    L53: "엄마! 아빠!",
    L54: "선비를 톡 눌러 봐요.",
    L55: "고마워, 까치들아. 너희 마음, 평생 잊지 않을게.",
    L56: "은혜를 잊지 않고 갚는 마음은, 이렇게 따뜻해요.",
  };
  /* 누르는 자리 넓히기(2026-10-22): 화면에서 짧은 변이 min px 보다 작으면 투명 사각을 대상 안에 깔아 min px 로 키운다. 눌리는 곳 크기만 바뀌고 그림은 그대로 */
  function padHit(T, el, min = 88) {
    try {
      if (el.__pad) { el.__pad.remove(); el.__pad = null; }
      const m = el.getScreenCTM(); if (!m) return;
      const sc = Math.hypot(m.a, m.b) || 1, bb = el.getBBox();
      const w = Math.max(bb.width, min / sc), h = Math.max(bb.height, min / sc);
      if (w === bb.width && h === bb.height) return;
      el.__pad = T.el('rect', { x: bb.x + bb.width / 2 - w / 2, y: bb.y + bb.height / 2 - h / 2, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, el);
    } catch (e) { /* 크기를 못 재면 그대로 둔다 */ }
  }
  async function run(T) {
    if (T.fx) T.fx.style.pointerEvents = 'none';   // 효과 글자(pop)가 누르는 대상을 덮지 않게
    const { sleep, camSnap, tr } = T;
    let GAP = 900; const SCENE_END = 2000, CUT_HOLD = 4200, STRIKE_GAP = 4500, FAINT_GAP = 2800;
    let early = true;   // 첫 조작(활 톡)까지는 숨을 짧게 (시작 30초 안에 첫 조작)
    const say = async text => { await T.say(text); await sleep(early ? 300 : GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };
    const scene = key => { T.clear(); bgImage(T, key); dress(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990;
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    AudioFX.preloadSfx(['beomjong', 'beomjong_synth', 'bonk', 'whoosh', 'creak', 'step_grass', 'step_wood', 'swish', 'paper_up', 'paper_down', 'sparkle', 'tada', 'door', 'thud', 'pop', 'splash']);
    const loads = [T.preload(src('mg2_layer_moon_perch')), ...BGS.map(k => T.preload(bgSrc(k)).then(ok => { bgOK[k] = ok; })), ...CUTS.map(k => T.preload(src(k)).then(ok => { cutOk[k] = ok; }))];
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(4000)]);
    const cut = (k, sfxName) => cutOk[k] ? T.cutImage([{ src: src(k), sfx: sfxName, hold: CUT_HOLD }], { hold: CUT_HOLD }) : Promise.resolve();
    const cutSay = async (k, line) => { const c = cut(k); await say(line); await c; };
    const stepLoop = (ms, vol, hopH, total) => { let on = true; (async () => { while (on) { AudioFX.sfx('step_grass', vol); await sleep(ms); } })(); return () => { on = false; }; };

    const sch = mk(T, { walk: ['mg_scholar_walk', 240], wonder: ['mg_scholar_bow', 240], surprise: ['mg_scholar_surprise', 236],
      ready: ['mg2_scholar_bow_ready', 240], draw: ['mg_scholar_bow_shoot', 232], release: ['mg2_scholar_bow_release', 240],
      sit: ['mg2_scholar_sit_worry', 200], water: ['mg_scholar_water', 185] });
    const lady = mk(T, { greet: ['mg2_lady_greet', 232], stern: ['mg2_lady_stern', 232], tail: ['mg2_lady_tail', 232] });
    const snake = mk(T, { coil: ['mg_snake_coil', 150], flee: ['mg_snake_flee', 110] });
    const mom = mk(T, { sit: ['mg_mag_mom_sit', 154], fly: ['mg_mag_mom_fly', 197], tired: ['mg_mag_mom_tired', 133] });
    const dad = mk(T, { sit: ['mg_mag_dad_sit', 150], fly: ['mg_mag_dad_fly', 186], tired: ['mg_mag_dad_tired', 103] });
    const friends = [0, 1, 2].map(i => mk(T, { fly: [i % 2 ? 'mg_mag_mom_fly' : 'mg_mag_dad_fly', i % 2 ? 197 : 186] }));
    /* 새끼 크기: 키 88 (앉은 엄마 154 대비 1:1.75, 날개 편 엄마 197 대비 1:2.2 — 새끼는 어디서나 같은 크기) */
    const CH = 88;
    const chicks = Array.from({ length: 5 }, () => prop(T, 'mg_chick', CH));
    const arrow = prop(T, 'mg2_prop_arrow', 14);
    const rim = prop(T, 'mg2_prop_nest_rim', 100);
    const bell = prop(T, 'mg2_prop_bell', 170);
    [sch, lady, snake, mom, dad, ...friends, ...chicks, arrow, rim, bell].forEach(hide);
    T.director({ cast: { sch, snake: lady, mom, dad }, noFace: ['sch', 'snake', 'mom', 'dad'] });
    const qn = +new URLSearchParams(location.search).get('n');
    const N = qn >= 1 && qn <= 5 ? qn : 1 + Math.floor(Math.random() * 5);

    /* 반딧불 둘이 문 쪽으로 모였다 흩어진다 */
    const fliesToDoor = () => (LY.flies || []).slice(0, 2).forEach(g => g.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${(g.getBBox().x < 500 ? 1 : -1) * 260}px, 40px)`, offset: .5 }, { transform: 'translate(0,0)' }], { duration: 2400, easing: 'ease-in-out' }));
    /* ================= 읽어 주기 (docs/READ_MODE.md): 대본 read_script_el.json 의 동사 → 놀이판 연출을 감싼 얇은 함수 =================
       대본 좌표는 가로 화면 기준이라 세로 화면은 놀이판의 세로 자리(PXM)로 바꾼다. 둥지는 움직이지 않고 새끼는 둥지 안에서만 보인다. */
    const READ_ACTS = (() => {
      const rI = () => T.readInstant();
      const A = { sch, lady, snake, mom, dad };
      const NR = qn >= 1 && qn <= 5 ? qn : 3; // 읽기에서는 아기 까치 3마리로 고정(숫자 알기 없음)
      /* 세로 화면 x (놀이판 X(l,p) 값). [장면][배우] */
      const PXM = {
        mg_bg_bigtree: { snake: 640, mom: 615, dad: 560, sch: 470 }, mg_bg_nest: { mom: 440 }, mg_bg_night: { sch: 420 },
        mg_bg_paperdoor: { sch: 440, lady: 590, snake: 590 }, mg_bg_porch: { sch: 430, lady: 590 }, mg_bg_moonnest: { dad: 400, mom: 540 },
        mg2_bg_belltower_night: { dad: 330, mom: 670 }, mg_bg_belltower: { dad: 440, mom: 560, sch: 1000 },
      };
      const CAMP = { mg_bg_bigtree: [520, 280], mg_bg_nest: [540, 235], mg_bg_night: [420, 280], mg_bg_paperdoor: [510, 280], mg_bg_moonnest: [420, 280] };
      let key = '', walkP = Promise.resolve(), tintEl = null, dawnEl = null, flockR = [], nestN = NR, stopSteps = null;
      const nums = s => String(s).split(',').map(v => (isNaN(+v) ? v : +v));
      const px = (n, x) => (P && PXM[key] && PXM[key][n] != null ? PXM[key][n] : x);
      const camGo = (x = 500, y = 280, z = 1) => { const c = P && CAMP[key]; camSnap(c ? c[0] : x, c ? c[1] : y, z); };
      const NX = 564, RIM_Y = 284, STEP = 54, RWn = 150 + 36 * NR, RHn = RWn / ASP.mg2_prop_nest_rim;
      const spotX = i => NX + (i - (NR - 1) / 2) * STEP;
      const spotY = i => RIM_Y - .45 * RHn - Math.abs(i - (NR - 1) / 2) * 6 + (i % 2 ? 4 : 0);
      const CY = RIM_Y - .45 * RHn;
      const rCut = (k, name) => cutOk[name] ? T.cutImage([{ src: src(name), hold: CUT_HOLD }], { hold: CUT_HOLD }) : Promise.resolve();
      const build = k => {
        key = k; flockR = []; tintEl = null; dawnEl = null;
        [sch, lady, snake, mom, dad, ...friends, ...chicks, arrow, rim, bell].forEach(hide);
        scene(k);
        if (P && CAMP[k]) camSnap(CAMP[k][0], CAMP[k][1], 1);
      };
      const place = (n, spec, look, a3, a4) => {
        const a = A[n]; if (!a) return;
        let [x, y] = nums(spec);
        x = px(n, x);
        let o = {};
        if (n === 'snake') { o = { look, s: a3 != null && a3 !== '' ? +a3 : 1 }; }
        else if (n === 'mom' || n === 'dad') { o = { look, to: a3 || undefined, s: a4 != null && a4 !== '' ? +a4 : 1 }; }
        else o = { look, to: a3 || undefined };
        if (n === 'sch' && key === 'mg_bg_belltower' && x >= 1000) x = P ? 1000 : 1100;
        put(T, a, x, y, o);
      };
      const actorVerb = n => (op, a1, a2, a3, a4) => {
        const a = A[n]; if (!a) return;
        if (op === 'at') return place(n, a1, a2, a3, a4);
        if (op === 'look') {
          if (n === 'snake' && a1 === 'flee' && key === 'mg_bg_bigtree') { a.look('flee', a2 || 'left'); return; }
          a.look(a1, a2 || undefined); return;
        }
        if (op === 'hop') { a.hop(n === 'sch' ? 8 : 10, 320); return; }
        if (op === 'wiggle') { a.wiggle(n === 'sch' ? 3 : 5, 500); return; }
        if (op === 'hide') { hide(a); return; }
        if (op === 'fade') { if (a1 === 'in') { a.pos.style.display = ''; fadeIn(a, n === 'lady' && key === 'mg_bg_paperdoor' ? 1200 : 900); return; } return fadeOut(T, a, 700); }
        if (op === 'walk') {
          let [x, y, ms] = nums(a1);
          if (n === 'sch') {
            x = key === 'mg_bg_path' ? (P ? 500 : x) : key === 'mg_bg_belltower' && x === 720 ? (P ? 660 : 720) : key === 'mg_bg_night' && x === 700 ? (P ? 640 : 700) : x;
            if (rI()) { a.place(x, y); return; }
            const prev = walkP;
            walkP = (async () => {
              await prev;
              let on = true; const stepV = key === 'mg_bg_night' ? .35 : .5;
              (async () => { while (on) { AudioFX.sfx('step_grass', stepV); await sleep(520); } })();
              (async () => { while (on) { a.hop(5, 480); await sleep(520); } })();
              if (P) follow(Math.min(x, 700), ms);
              await a.move(x, y, ms, 'linear'); on = false;
            })();
            return;
          }
          return a.move(x, y, ms || 900);
        }
      };
      const acts = {
        set(k) {
          if (rI()) { build(k); return; }
          return walkP.then(() => T.sceneCard('', () => build(k)));
        },
        cam(spec) { const [x, y, z] = nums(spec); camGo(x, y, z); },
        tint(op) {
          const o = +op;
          if (tintEl) { tintEl.remove(); tintEl = null; }
          const tc = '#1F2A56';
          if (rI()) { tintEl = tint(T, tc, o); return; }
          const d = tint(T, tc, 0); tintEl = d;
          T.anim(d, [{ opacity: 0 }, { opacity: o }], 1500).then(() => d.setAttribute('opacity', o));
        },
        dawn(op) {
          if (op === 'on') { dawnEl = tint(T, '#1F2A56', .28); return; }
          if (dawnEl) { const d = dawnEl; T.anim(d, [{ opacity: .28 }, { opacity: 0 }], 2000).then(() => d.setAttribute('opacity', 0)); }
        },
        parents(op) {
          if (op === 'land') { // 나무에서 선비 옆 땅으로
            sch.look('wonder');
            mom.setScale(1); mom.look('sit', 'right'); mom.turn('left'); mom.move(X(600, 580), FL - 4, 1200);
            dad.setScale(1); dad.look('fly', 'right');
            return dad.move(X(690, 640), FL - 150, 1200).then(() => { dad.look('sit', 'left'); dad.place(dad.x, FL - 4); });
          }
          if (op === 'collapse') { // 힘이 빠져 종 아래로 스르르
            put(T, dad, X(430, 440), 300, { look: 'tired' }); put(T, mom, X(560, 560), 300, { look: 'tired' });
            [dad, mom].forEach(b => { fadeIn(b, 900); b.move(b.x, 480, 1600, 'ease-in'); });
            sfx('paper_down', .4); return sleep(900);
          }
        },
        snake(op, a1, a2, a3) {
          if (op === 'climb') { // 똬리를 풀고 나무 기둥 위로
            snake.look('flee', 'left');
            return (async () => { await snake.move(X(800, 640), snake.y, 500); await snake.move(X(800, 185), 185, 2800, 'ease-in-out'); snake.look('coil'); })();
          }
          if (op === 'flee') {
            if (key === 'mg_bg_paperdoor') { // 새벽: 여인이 변한 구렁이가 숲으로
              snake.look('flee', 'right'); snake.place(snake.x, FL + 8);
              sfx('swish', .5); T.pop(snake.x + 40, FL - 130, tr('스르르'));
              return snake.move(1150, FL + 8, 2200, 'ease-in').then(() => hide(snake));
            }
            snake.look('flee', 'right'); snake.place(X(700, 640), FL + 8); snake.setScale(1);
            sfx('swish', .6); T.pop(760, FL - 130, tr('스르르'));
            return snake.move(1150, FL + 8, 1800, 'ease-in').then(() => hide(snake));
          }
          return actorVerb('snake')(op, a1, a2, a3);
        },
        chicks(op) {
          if (op === 'nest') { // 배경 둥지의 오목한 자리에 앉는다 (둥지는 움직이지 않고 새끼는 둥지 안에서만)
            nestN = NR;
            (async () => { for (let i = 0; i < NR; i++) { const x = spotX(i); put(T, chicks[i], x, spotY(i), { to: 'left' }); fadeIn(chicks[i], 260); chicks[i].hop(14, 260); vo('chirp'); T.pop(x, spotY(i) - CH - 24, tr('짹!')); await sleep(700); } })();
            return;
          }
          if (op === 'hop') { chicks.slice(0, NR).forEach(c => c.hop(12, 300)); vo('chirp2'); return; }
          if (op === 'hide') chicks.forEach(hide);
        },
        flock(op) {
          if (op === 'fly') {
            hide(mom); hide(dad);
            flockR = [dad, mom, friends[0], friends[1], friends[2]]; const FS = [1, 1, .9, .9, .85];
            flockR.forEach((b, i) => {
              const y = 150 + (i % 2) * 70 + (i > 1 ? 50 : 0);
              put(T, b, -150 - i * 130, y, { look: 'fly', to: 'right', s: FS[i] });
              b.move(1150, y - 40, 3200 + i * 200, 'linear');
              (async () => { for (let j = 0; j < 10; j++) { b.hop(8, 380); await sleep(380); } })();
            });
            return;
          }
          if (op === 'hide') flockR.forEach(hide);
        },
        arrow(op) {
          return (async () => {
            sch.look('draw', 'right'); sfx('creak', .5);
            for (let i = 0; i < 3; i++) await sch.wiggle(1.5, 400);
            await sleep(300);
            sch.look('release', 'right'); sfx('whoosh', .8); T.pop(sch.x + 70, FL - 250, tr('쉬익!'));
            put(T, arrow, sch.x + 70, FL - 150, { to: 'right' });
            await arrow.move(snake.x - 60, snake.y - 70, 420, 'linear');
            sfx('thud', .6); T.pop(arrow.x, arrow.y - 40, tr('탁!'));
            await sleep(500);
          })();
        },
        bell(op, a1) {
          if (op === 'show') { put(T, bell, 500, 385); bell.body.style.transformOrigin = '0 -170px'; return; }
          if (op === 'strike') {
            const k = +a1, hitL = 442, hitR = 558, backL = X(330, 400), backR = X(670, 600);
            const mv = k === 1 ? [[dad, hitL, backL]] : k === 2 ? [[mom, hitR, backR]] : [[dad, hitL, backL], [mom, hitR, backR]];
            return (async () => {
              sfx('whoosh', .4);
              await Promise.all(mv.map(([b, h]) => b.move(h, 300, 340, 'ease-in')));
              sfx('bonk', .7); mv.forEach(([b, h]) => T.pop(h, 232, tr('꽁!')));
              swingBell(bell); bellSfx(T, .9); T.shake(); setTimeout(() => T.pop(500, 165, tr('댕—'), '#1F2A56'), 250);
              mv.forEach(([b]) => b.move(b === dad ? backL : backR, 300, 520, 'ease-out'));
              mv.forEach(([b]) => b.wiggle(6, 520));
              await sleep(600);
            })();
          }
          if (op === 'far') { // 멀리서 들리는 종소리 세 번 — 여인이 흠칫
            [600, 2400, 4200].forEach((t, i) => setTimeout(() => {
              bellSfx(T, .32); T.pop(X(880, 640), 150, tr('댕—'), '#1F2A56');
              lady.wiggle(4, 450).then(() => lady.move(lady.x + 14, FL, 260)); lady.hop(5, 300);
            }, t));
          }
        },
        water(op) {
          if (op !== 'drops') return;
          for (let i = 0; i < 4; i++) {
            const d = T.el('circle', { r: 5, fill: '#BFD8EE', cx: sch.x - 95, cy: FL - 95 }, T.world);
            const tx = mom.x + 40 - (sch.x - 95), ty = 480 - 30 - (FL - 95);
            d.animate([{ translate: '0 0' }, { translate: `${tx / 2}px ${ty / 2 - 30}px`, offset: .5 }, { translate: `${tx}px ${ty}px` }], { duration: 480, delay: i * 110, easing: 'ease-in', fill: 'both' }).finished.then(() => d.remove()).catch(() => {});
          }
          T.pop(mom.x, 480 - 150, tr('똑똑!'));
        },
        cut(k) { return rCut(k, 'mg_cut_' + k); },
        fx(n) {
          if (n === 'caw') vo('caw'); else if (n === 'chirp') vo('chirp'); else if (n === 'chirp2') vo('chirp2');
          else if (n === 'door') sfx('door', .6); else if (n === 'tada') sfx('tada', 1, () => sparkleSfx(T));
          else if (n === 'splash') sfx('splash', .35); else if (n === 'paper_up') sfx('paper_up'); else if (n === 'paper_down') sfx('paper_down', .4);
          else sfx(n, .6, () => sfx('pop', .5));
        },
        sparkle() { sparkleSfx(T); },
        confetti() { T.confetti(); },
        shake() { T.shake(); },
        pop(spec) { const a = String(spec).split(','); T.pop(+a[0], +a[1], tr(a.slice(2).join(',')), a.slice(2).join(',') === '!' ? '#A93B32' : undefined); },
      };
      ['sch', 'lady', 'mom', 'dad'].forEach(n => { acts[n] = actorVerb(n); });
      return acts;
    })();
    if (T.reading()) return T.readPlay(READ_ACTS);

    /* ===== 1. 산길 (자동) ===== */
    scene('mg_bg_path');
    put(T, sch, X(-120, -120), FL, { look: 'walk', to: 'right' });
    await T.curtain(true);
    const steps1 = stepLoop(520, .5);
    const walk1 = sch.move(X(520, 500), FL, 7000, 'linear'); setTimeout(() => lyWig('pileL', 3, 400), 1200);
    (async () => { for (let i = 0; i < 13; i++) { sch.hop(5, 480); await sleep(520); } })();
    T.pop(sch.x, FL - 270, tr('저벅저벅')); setTimeout(() => T.pop(sch.x, FL - 270, tr('저벅저벅')), 3000);
    await say(S.L0);
    const l1 = say(S.L1);
    await walk1; steps1(); await l1;
    await sleep(150);
    vo('caw'); T.pop(X(900, 640), 230, tr('까악!'));
    sch.look('surprise'); sch.hop(8, 300);
    await sleep(500);

    /* ===== 2. 큰 소나무 (톡 1: 활쏘기) ===== */
    await T.sceneCard(tr('큰 소나무'), () => {
      scene('mg_bg_bigtree');
      put(T, snake, X(790, 640), FL, { look: 'coil', s: .8 });
      put(T, mom, X(650, 615), 168, { look: 'sit', to: 'left', s: .8 });
      put(T, dad, X(540, 560), 215, { look: 'fly', to: 'right', s: .8 });
      put(T, sch, X(440, 470), FL, { look: 'surprise' });
      if (P) camSnap(520, 280, 1);
    }, sch.pos);
    const l2 = say(S.L2); mom.hop(10, 300); await sleep(500); mom.hop(10, 300); dad.wiggle(5, 500); await l2;
    snake.look('flee', 'left');   /* 똬리를 풀고 몸을 길게 뻗어 기어 올라간다 */
    /* 나무 기둥(가운데 x≈800) 위로만 기어 올라간다: 먼저 기둥 밑으로 가고, 그다음 기둥을 따라 위로 (허공으로 빗겨 가지 않게) */
    const climb = (async () => { await snake.move(X(800, 640), snake.y, 500);   /* 지금 높이 그대로 옆으로만 가서 기둥 밑에 선다(아래로 내려가지 않게) */ await snake.move(X(800, 185), 185, 2800, 'ease-in-out'); })();
    await say(S.L3); await climb; snake.look('coil');   /* 나무 위에 도착해 다시 똬리를 튼다 */
    sch.look('ready', 'right'); sfx('paper_up');
    await say(S.L4); await sleep(150);
    bob(sch.pos);
    await T.ask(S.L5, () => T.tap(sch.pos, { prompt: '선비가 활을 꺼냈어요. 선비를 톡 눌러 봐요.' }));
    early = false;
    sch.look('draw', 'right'); sfx('creak', .5);
    for (let i = 0; i < 3; i++) await sch.wiggle(1.5, 400);
    await sleep(300);
    sch.look('release', 'right'); sfx('whoosh', .8); T.pop(sch.x + 70, FL - 250, tr('쉬익!'));
    put(T, arrow, sch.x + 70, FL - 150, { to: 'right' });
    await arrow.move(snake.x - 60, snake.y - 70, 420, 'linear');
    sfx('thud', .6); T.pop(arrow.x, arrow.y - 40, tr('탁!'));
    await sleep(500);
    await cutSay('mg_cut_arrow', S.L6);
    hide(arrow);
    snake.look('flee', 'right'); snake.place(X(700, 640), FL + 8); snake.setScale(1);
    sfx('swish', .6); T.pop(760, FL - 130, tr('스르르'));
    const run2 = snake.move(1150, FL + 8, 1800, 'ease-in');
    await run2; hide(snake);
    await cutSay('mg_cut_flee', S.L7);
    sch.look('wonder');
    mom.setScale(1); mom.look('sit', 'right'); mom.turn('left'); mom.move(X(600, 580), FL - 4, 1200);
    dad.setScale(1); dad.look('fly', 'right');
    await dad.move(X(690, 640), FL - 150, 1200);
    dad.look('sit', 'left'); dad.place(dad.x, FL - 4);
    const l8 = say(S.L8); await sleep(900); mom.hop(10, 320); await sleep(2200); dad.hop(10, 320); await l8;
    await sleep(SCENE_END);

    /* ===== 3. 둥지 (숫자 알기) ===== */
    /* 둥지 안 새끼: 새끼는 둥지 안에 앉아 있고, 앞테(초승달 모양 둥지 조각)가 몸 아래를 가린다. 마리 수가 늘면 앞테를 넓히고 새끼는 겹쳐 앉는다.
       배경 둥지(mg_bg_nest, 1.25배) 속 오목한 자리 중심 x≈564, 앞테 바닥 y≈272. 앞테 윗선 가운데는 그림 높이의 40% 지점이라, 새끼 발을 그보다 0.45rh 위에 둔다. */
    const NX = 564, RIM_Y = 284, STEP = 54;
    const RW = 150 + 36 * N, RH = RW / ASP.mg2_prop_nest_rim;
    const spotX = i => NX + (i - (N - 1) / 2) * STEP;
    const spotY = i => RIM_Y - .45 * RH - Math.abs(i - (N - 1) / 2) * 6 + (i % 2 ? 4 : 0);
    const CY = RIM_Y - .45 * RH;
    await T.sceneCard(tr('둥지'), () => {
      scene('mg_bg_nest');
      put(T, mom, X(170, 440), 300, { look: 'sit', to: 'right', s: 1 });   /* 엄마는 둥지 바깥 왼쪽에 앉아 새끼와 겹치지 않게 */
      camSnap(P ? 540 : 500, P ? 235 : 280, 1);
    }, null);
    const l9 = say(S.L9);
    for (let i = 0; i < N; i++) {
      const x = spotX(i);
      put(T, chicks[i], x, spotY(i), { to: 'left' }); fadeIn(chicks[i], 260); chicks[i].hop(14, 260);
      vo('chirp'); T.pop(x, spotY(i) - CH - 24, tr('짹!')); await sleep(700);
    }
    /* 둥지 앞테는 쓰지 않는다: 배경 둥지 안에 작은 둥지가 한 번 더 겹쳐 보이므로. 새끼는 배경 둥지의 오목한 자리에 앉는다 */
    await l9; await sleep(300);
    const others = [1, 2, 3, 4, 5].filter(k => k !== N).sort(() => Math.random() - .5).slice(0, 2);
    const kinds = [N, ...others].sort(() => Math.random() - .5);
    const cardX = X([340, 540, 740], [460, 540, 620]), cardY = X(470, 405);
    const cards = kinds.map((n, i) => numCard(T, n, cardX[i], cardY, X(1, .72)));
    cards.forEach((c, i) => c.g.animate([{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], { duration: 450, delay: i * 150, fill: 'backwards' }));
    const W = { 1: '그건 1이에요. 다시 세어 볼까요?', 2: '그건 2예요. 다시 세어 볼까요?', 3: '그건 3이에요. 다시 세어 볼까요?', 4: '그건 4예요. 다시 세어 볼까요?', 5: '그건 5예요. 다시 세어 볼까요?' };
    const CN = ['하나!', '둘!', '셋!', '넷!', '다섯!'];
    const countChicks = async () => {
      for (let i = 0; i < N; i++) {
        const c = chicks[i];
        c.hop(16, 320); glow(c, 700); AudioFX.popStep(i + 1); T.pop(c.x, c.y - CH - 24, tr(CN[i]));
        const u = vo('n' + (i + 1)); await (u || sleep(650)); await sleep(350);
      }
    };
    cards.forEach(c => padHit(T, c.g));
    await T.ask(S.L10, () => T.choose(cards.map(c => ({ el: c.g, ok: c.n === N, onWrong: async () => { await wiggleEl(T, c.g); await say(W[c.n]); await countChicks(); } })), { prompt: '아기 까치가 몇 마리일까요? 맞는 숫자를 골라요.' }));
    const good = cards.find(c => c.n === N);
    good.g.style.filter = 'url(#hintGlow)'; sparkleSfx(T); T.pop(good.x, cardY - 90, tr('반짝!'));
    await countChicks();
    await say(S['C' + N]);
    cards.forEach(c => c.g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }));
    await sleep(450); cards.forEach(c => c.g.remove());
    const l11 = say(S.L11); chicks.slice(0, N).forEach(c => c.hop(12, 300)); await sleep(500); mom.hop(10, 320); await l11;
    await say(S.L12);
    await sleep(SCENE_END);

    /* ===== 4. 깊은 밤 (자동) ===== */
    await T.sceneCard(tr('깊은 밤'), () => {
      scene('mg_bg_night');
      put(T, sch, X(300, 420), FL, { look: 'walk', to: 'right' });
      if (P) camSnap(420, 280, 1);
    }, sch.pos);
    const steps4 = stepLoop(520, .35);
    const walk4 = sch.move(X(560, 560), FL, 6000, 'linear'); follow(540, 6000);
    (async () => { for (let i = 0; i < 11; i++) { sch.hop(5, 480); await sleep(520); } })();
    await say(S.L13); await walk4; steps4();
    const l14 = say(S.L14); await sleep(3200); T.pop(790, 290, tr('반짝!')); sparkleSfx(T); await l14;
    sch.hop(8, 300);
    await sch.move(X(700, 640), FL, 2000, 'linear'); await sleep(400);
    T.clear(); bgImage(T, 'mg_bg_porch'); dress(T, 'mg_bg_porch'); camSnap(500, 280, 1);
    put(T, sch, X(380, 430), FL, { look: 'wonder' });
    sfx('door', .6);
    put(T, lady, X(640, 590), FL, { look: 'greet' }); fadeIn(lady, 900); fliesToDoor();
    await say(S.L15);
    const l16 = say(S.L16); await sleep(500); lady.hop(4, 700); await l16;
    const l17 = say(S.L17); await sleep(500); sch.hop(8, 300); await l17;
    const dusk = tint(T, '#1F2A56', 0);
    T.anim(dusk, [{ opacity: 0 }, { opacity: .3 }], 1500).then(() => dusk.setAttribute('opacity', .3));
    T.pop(sch.x, FL - 260, tr('쿨쿨'));
    await say(S.L18);
    await sleep(SCENE_END);

    /* ===== 5. 외딴집 (자동) ===== */
    await T.sceneCard(tr('외딴집'), () => {
      scene('mg_bg_paperdoor'); tint(T, '#1F2A56', .35);
      put(T, sch, X(380, 440), FL, { look: 'sit' });
      if (P) camSnap(510, 280, 1);
    }, sch.pos);
    const l19 = say(S.L19); sch.wiggle(3, 500); await l19;
    put(T, lady, X(640, 590), FL, { look: 'stern' }); fadeIn(lady, 1200);
    await sleep(1200);
    const l20 = say(S.L20); await sleep(3400);
    lady.look('tail'); sfx('pop', .5); T.pop(lady.x + 120, FL - 40, tr('!'), '#A93B32'); sch.look('surprise'); await l20;
    await say(S.L21);
    const l22 = say(S.L22); await sleep(700); lady.hop(3, 800); await l22;
    sch.look('sit');
    const l23 = say(S.L23); sch.wiggle(3, 500); await l23;
    await say(S.L24);
    const l25 = say(S.L25); await sleep(3000); T.pop(lady.x, FL - 330, tr('후후…'), '#1F2A56'); await l25;
    await say(S.L26);
    await sleep(SCENE_END);

    /* ===== 6. 달밤의 까치 (자동) ===== */
    await T.sceneCard(tr('달밤의 까치'), () => {
      scene('mg_bg_moonnest');
      put(T, dad, X(300, 400), FL - 160, { look: 'sit', to: 'right' });
      put(T, mom, X(470, 540), FL - 160, { look: 'sit', to: 'left' });
      /* 달밤 장면: 엄마·아빠 까치만 나온다 (새끼는 둥지에 있으므로 여기에 없음) */
      camSnap(P ? 420 : 500, 280, 1);
    }, dad.pos);
    await say(S.L27);
    const l28 = say(S.L28); mom.hop(10, 320); await l28;
    const l29 = say(S.L29); dad.hop(12, 320); await l29;
    mom.turn('right');
    const cx6 = X(560 + (N - 1) * 26, 600 + (N - 1) * 22);
    const l30 = say(S.L30); await sleep(900); chicks.slice(0, N).forEach(c => c.hop(8, 300)); vo('chirp2'); T.pop(cx6, FL - 260, tr('짹짹!')); await l30;
    hide(mom); hide(dad);
    const flock = [dad, mom, friends[0], friends[1], friends[2]], FS = [1, 1, .9, .9, .85];
    flock.forEach((b, i) => {
      const y = 150 + (i % 2) * 70 + (i > 1 ? 50 : 0);
      put(T, b, -150 - i * 130, y, { look: 'fly', to: 'right', s: FS[i] });
      b.move(1150, y - 40, 3200 + i * 200, 'linear');
      (async () => { for (let j = 0; j < 10; j++) { b.hop(8, 380); await sleep(380); } })();
    });
    sfx('whoosh', .3);
    await say(S.L31);
    await cutSay('mg_cut_flock', S.L32);
    flock.forEach(hide); chicks.forEach(hide);
    await sleep(SCENE_END);

    /* ===== 7. 종탑 (톡 2: 종) ===== */
    await T.sceneCard(tr('종탑'), () => {
      scene('mg2_bg_belltower_night');
      put(T, bell, 500, 385);
      bell.body.style.transformOrigin = '0 -170px';
      put(T, dad, X(250, 330), 300, { look: 'fly', to: 'right' });
      put(T, mom, X(750, 670), 300, { look: 'fly', to: 'left' });
      camSnap(500, 280, 1);
    }, bell.pos);
    await say(S.L33);
    const l34 = say(S.L34); dad.hop(10, 320); await l34;
    bob(bell.pos);
    await T.ask(S.L35, () => T.tap(bell.pos, { prompt: '종을 톡 눌러 봐요.' }));
    const hitL = 442, hitR = 558, backL = X(330, 400), backR = X(670, 600);
    const strike = async k => {
      const t0 = performance.now();
      const mv = k === 1 ? [[dad, hitL, backL]] : k === 2 ? [[mom, hitR, backR]] : [[dad, hitL, backL], [mom, hitR, backR]];
      sfx('whoosh', .4);
      await Promise.all(mv.map(([b, h]) => b.move(h, 300, 340, 'ease-in')));
      sfx('bonk', .7); mv.forEach(([b, h]) => T.pop(h, 232, tr('꽁!')));
      swingBell(bell); bellSfx(T, .9); T.shake(); setTimeout(() => T.pop(500, 165, tr('댕—'), '#1F2A56'), 250);
      const back = Promise.all(mv.map(([b, , bk]) => b.move(bk, 300, 520, 'ease-out')));
      mv.forEach(([b]) => b.wiggle(6, 520));
      await sleep(600); await say(S['L' + (35 + k)]); await back;
      await sleep(Math.max(0, STRIKE_GAP - (performance.now() - t0)));
    };
    for (const k of [1, 2, 3]) await strike(k);
    await cutSay('mg_cut_ring', S.L39);
    dad.look('tired'); mom.look('tired');
    put(T, dad, X(430, 440), 300, { look: 'tired' }); put(T, mom, X(560, 560), 300, { look: 'tired' });
    [dad, mom].forEach(b => { fadeIn(b, 900); b.move(b.x, 480, 1600, 'ease-in'); });
    sfx('paper_down', .4);
    await say(S.L40);
    await sleep(2500); await sleep(SCENE_END);

    /* ===== 8. 새벽 (자동) ===== */
    let dawn;
    await T.sceneCard(tr('새벽'), () => {
      scene('mg_bg_paperdoor'); dawn = tint(T, '#1F2A56', .28);
      put(T, sch, X(380, 440), FL, { look: 'sit' });
      put(T, lady, X(640, 590), FL, { look: 'stern' });
      if (P) camSnap(510, 280, 1);
    }, sch.pos);
    const l41 = say(S.L41);
    for (let k = 1; k <= 3; k++) {
      await sleep(k === 1 ? 600 : 0);
      bellSfx(T, .32); T.pop(X(880, 640), 150, tr('댕—'), '#1F2A56');
      lady.wiggle(4, 450).then(() => lady.move(lady.x + 14, FL, 260)); lady.hop(5, 300);
      if (k === 1) sch.look('surprise');
      await sleep(FAINT_GAP);
    }
    await l41;
    const l42 = say(S.L42); await l42;
    await say(S.L43);
    await fadeOut(T, lady, 700);
    put(T, snake, lady.x, FL, { look: 'coil' }); fadeIn(snake, 700); sparkleSfx(T, .4);
    await sleep(700);
    snake.look('flee', 'right'); snake.place(snake.x, FL + 8);
    sfx('swish', .5); T.pop(snake.x + 40, FL - 130, tr('스르르'));
    const sl = snake.move(1150, FL + 8, 2200, 'ease-in');
    await say(S.L44); await sl; hide(snake);
    T.anim(dawn, [{ opacity: .28 }, { opacity: 0 }], 2000).then(() => dawn.setAttribute('opacity', 0));
    const l45 = say(S.L45); sch.hop(10, 320); await l45;
    await sleep(SCENE_END);

    /* ===== 9. 아침 (톡 3: 마지막 인사) ===== */
    await T.sceneCard(tr('아침'), () => {
      scene('mg_bg_dawn');
      put(T, sch, -120, FL, { look: 'walk', to: 'right' });
    }, sch.pos);
    const steps9 = stepLoop(420, .5);
    const w9 = sch.move(1150, FL, 4200, 'linear');
    (async () => { for (let i = 0; i < 10; i++) { sch.hop(7, 380); await sleep(420); } })();
    await say(S.L46); await w9; steps9();
    await sleep(300);
    T.clear(); bgImage(T, 'mg_bg_belltower'); camSnap(500, 280, 1);
    put(T, dad, X(430, 440), 480, { look: 'tired' }); put(T, mom, X(560, 560), 480, { look: 'tired' });
    put(T, sch, X(1100, 1000), FL, { look: 'walk', to: 'left' });
    const w9b = sch.move(X(720, 660), FL, 2600, 'ease-out'); follow(560, 2600);
    await say(S.L47); await w9b;
    sch.look('surprise');
    await say(S.L48);
    sch.look('water', 'left'); sfx('splash', .35);
    for (let i = 0; i < 4; i++) {
      const d = T.el('circle', { r: 5, fill: '#BFD8EE', cx: sch.x - 95, cy: FL - 95 }, T.world);
      const tx = mom.x + 40 - (sch.x - 95), ty = 480 - 30 - (FL - 95);
      d.animate([{ translate: '0 0' }, { translate: `${tx / 2}px ${ty / 2 - 30}px`, offset: .5 }, { translate: `${tx}px ${ty}px` }], { duration: 480, delay: i * 110, easing: 'ease-in', fill: 'both' }).finished.then(() => d.remove()).catch(() => {});
    }
    T.pop(mom.x, 480 - 150, tr('똑똑!'));
    await say(S.L49);
    glow(mom, 1000); glow(dad, 1000); sparkleSfx(T);
    mom.hop(10, 420); dad.hop(10, 420);
    await say(S.L50); await say(S.L51);
    const l52 = say(S.L52);
    /* 새끼는 둥지에 있어야 하므로 종 장면(땅)에는 두지 않는다. 짹짹 소리만 */
    vo('chirp2');
    await l52;
    await cutSay('mg_cut_wake', S.L53);
    bob(sch.pos);
    await T.ask(S.L54, () => T.tap(sch.pos, { prompt: '선비를 톡 눌러 봐요.' }));
    T.confetti(); sfx('tada', 1, () => sparkleSfx(T));
    sch.hop(30, 480); chicks.slice(0, N).forEach(c => c.hop(18, 460)); mom.hop(8, 460); dad.hop(8, 460);
    await say(S.L55);
    await say(S.L56);
    T.finale(); await sleep(1500);
    return '은혜를 잊지 않고 갚아요.';
  }

  Tale.mount({ title: '은혜 갚은 까치', subtitle: '은혜를 잊지 않고 갚아요', read: true, run: T => run(Tale.api) });
})();
