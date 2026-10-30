/* 콩쥐팥쥐 — 목업. 착한 콩쥐가 새엄마의 심부름을 소·두꺼비·참새·선녀의 도움으로 해내고, 잔치에서 꽃신 주인이 되어 모두와 화해한다.
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. 새엄마와 팥쥐는 부끄러워할 뿐 벌을 받지 않는다. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { basket_r: 1.1861, basket_y: 1.1563, buk: 0.9671, drum: 1.2567, fairy_float: 0.9211, fairy_give: 0.8134, gong: 1.0256,
    hangari: 0.9504, kong_bride: 0.8421, kong_hoe: 0.8966, kong_loom: 1.0174, kong_pour: 0.9145, kong_shoes: 0.8349, kong_step_l: 0.8617, kong_step_r: 0.8367, kong_sweep: 0.9176,
    kong_wet: 0.8294, loom: 1.0240, ox_stand: 0.8526, ox_walk: 1.5771, pail: 1.0608, pat_dressed: 0.6433, pat_eat: 0.8316,
    pat_shy: 0.5786, ricecake: 1.2600, shoe_butterfly: 2.0949, shoe_peony: 2.0693, shoe_plum: 2.0959, sparrow_flock: 1.0225,
    sparrow_one: 1.0704, step_dressed: 0.7247, step_order: 0.7370, step_shy: 0.7208, toad_idle: 1.2000, toad_plug: 1.2019,
    won_shoe: 0.5745, won_stand: 0.4757, kong_oneshoe: 0.7733, shoe_blue: 2.0930, shoe_yellow: 2.0930,
    /* 2026-10-30 꽃신 색 맞춤: 콩쥐가 신은 꽃신을 개울에 빠지는 나비 꽃신(분홍 바탕·장미빛 앞코·꽃·나비)과 같은 짝으로 다시 그림(_v2). 인물·틀은 원본과 같아 높이도 그대로 */
    kong_shoes_v2: 0.8350, kong_step_r_v2: 0.8367, kong_step_l_v2: 0.8600, kong_oneshoe_v2: 0.7733, };
  /* 2026-10-20 새 그림은 그림 크기(세로 픽셀)가 옛 그림과 달라서, 옛 그림과 같은 픽셀 축척이 되도록 높이에 곱하는 비율 */
  const RS = { drum: 0.918, fairy_float: 0.706, fairy_give: 0.789, gong: 0.948, kong_hoe: 0.994, kong_loom: 0.821,
    kong_pour: 0.940, /* 2026-10-20 크기 일관성: 물 붓기 자세가 같은 자리의 젖은 자세보다 머리 폭 17% 작아서 0.786 → 0.940 */ kong_sweep: 0.936, pail: 0.870, pat_dressed: 0.877, pat_eat: 0.849,
    step_dressed: 0.846, step_order: 0.853, step_shy: 0.757, toad_idle: 0.976, won_shoe: 0.940, };
  const NF = new Set(['basket_r', 'basket_y', 'buk', 'drum', 'gong', 'loom', 'pail', 'ricecake', 'shoe_peony', 'shoe_plum', 'shoe_blue', 'shoe_yellow']); // 얼굴 없는 새 그림(파일 이름 끝에 nf)
  /* 서 있는 콩쥐(신부·젖은·꽃신)는 새 그림이 작게 그려져서 비율 대신 높이를 직접 정함 */
  const BGS = ['yard', 'field', 'jar', 'jarbottom', 'mat', 'loom', 'stream', 'feast', 'gate', 'wedding'];
  const CUTS = ['ox', 'wet', 'toad', 'sparrows', 'fairy', 'splash', 'shy'];
  /* 2026-10-24 사용자 지시: 두꺼비 컷을 원작대로 다시 그림(toad2: 깨진 독 안 바닥 구멍을 두꺼비가 등으로 막고 물이 차오르며, 땋은 머리 콩쥐가 물동이로 붓는다) */
  const CUTFILE = { toad: 'toad2' };
  /* 2026-10-23 화려한 재기획(VISUAL_PLAN.md): 장면 키는 그대로 두고 그림만 v2·라이트박스(lb)로. 우물·독 입구와 구멍·멍석·문/창/병풍·징검돌·대문은 원본 자리(겹쳐 확인) */
  const BGFILE = { yard: 'yard_v2', field: 'field_v2', jar: 'jar_v2', mat: 'mat_v2', loom: 'loom_v2', stream: 'stream_v3', gate: 'gate_v2' };
  /* 2026-10-23 사용자 결정: 잔치(feast)·혼례(wedding 라이트박스)는 옛 그림으로 되돌림(홍등 줄·깃발·모란·소나무/풀 실루엣·반딧불도 뺌) */
  /* 2026-10-24 사용자 결정: 독 안(jarbottom 라이트박스)도 옛 그림(kj_bg_jarbottom)으로 되돌림(독 벽 쐐기 실루엣도 뺌) */
  /* 층 소품 폭/높이 */
  const LASP = { persimmon_branch: .77, cosmos_front: .9983, mist: 4.9724, willow: .7617, lantern_string: 1.6275, flags: 4.4335, peony_front: 1.0217, thread_skeins: 1.03, pine_sil: 1.0117, grass_sil: 3.2727, jarwall_sil: .9867 };
  const bgSrc = k => AS + 'kj_bg_' + (BGFILE[k] || k) + '.webp', cutSrc = k => AS + 'kj_cut_' + (CUTFILE[k] || k) + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };

  /* 2026-10-20 새 그림은 콩쥐(쓸기·괭이·베틀)가 왼쪽을, 새엄마(시키기)가 오른쪽을 보게 그려져 그림 방향 표시를 바꿈 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const hh = h * (RS[f] || 1), w = hh * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: AS + 'kj_' + f + (NF.has(f) ? 'nf' : '') + '.webp', x: -w / 2, y: -hh, width: w, height: hh, preserveAspectRatio: 'none' }, wrap);
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
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  /* 작은 소품도 손가락이 닿게: 투명한 누르는 자리를 깐다(발끝 가운데가 0,0). 화면 짧은 변 80px 이상 (2026-10-22) */
  function widen(T, a, w = 100, h = 100) {
    const r = T.el('rect', { x: -w / 2, y: -h, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.pos.firstChild); return a;
  }

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!'];
  /* 2026-10-24 사용자 지시: 참새를 셀 때 내레이터가 "하나! 둘! …" 하고 소리 내어 센다. 같은 내레이터 목소리(ElevenLabs nar=Huelyn)로
     녹음된 해와 달 세기 클립을 빌려 쓴다(콩쥐 대본에 없는 줄만 채움) */
  (() => {
    const KO = ['nar_e5ca069e52', 'nar_d8cbfaca09', 'nar_b63e21d47c', 'nar_8af172779e', 'nar_85ab7b4b39'];
    const EN = [['One!', 'nar_732ee05cfe'], ['Two!', 'nar_ef5690c0b2'], ['Three!', 'nar_a1c2b6b48c'], ['Four!', 'nar_eeeefc8670'], ['Five!', 'nar_cddcb7ac4a']];
    try {
      NUM.forEach((k, i) => {
        if (typeof NARRATION_CLIPS !== 'undefined' && !NARRATION_CLIPS[k]) NARRATION_CLIPS[k] = 'audio/el/sunmoon/' + KO[i] + '.mp3';
        if (typeof NARRATION_CLIPS_EN !== 'undefined' && !NARRATION_CLIPS_EN[k]) NARRATION_CLIPS_EN[k] = { t: EN[i][0], c: 'audio/el/sunmoon/en/' + EN[i][1] + '.mp3' };
      });
    } catch (e) { /* 클립 표가 없으면 소리 없이 */ }
  })();
  const sayNum = (T, i) => { if (!(T.reading() && T.readInstant())) try { Narrator.speak(NUM[i - 1]); } catch (e) { /* 무시 */ } };
  /* 2026-10-24 독 안(옛 그림 kj_bg_jarbottom): 바닥 구멍은 (467~536, 540~557). 두꺼비는 구멍 옆에 폴짝 나타났다가, 톡 하면 구멍 위로 폴짝 올라가 막는다 */
  const TOAD_SIDE = [350, 534], TOAD_HOLE = [500, 562];

  async function run(T) {
    /* 시작 음악 (2026-10-28): 첫 장면 시작에 12초 깔고, 첫 장면 전환에서 끈다. 읽어 주기는 음량 .25 */
    const intro = (() => {
      let h = null, on = true;
      const stop = () => { on = false; try { h && h.stop(.8); h = null; } catch (e) { /* 무시 */ } };
      const go = (delay = 0) => {
        const f = () => { try { if (!on) return; const o = { vol: T.reading() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }; h = AudioFX.ambient('intro_cozy2', o); if (!h) setTimeout(() => { try { if (on) h = AudioFX.ambient('intro_cozy2', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
        if (delay) setTimeout(f, delay); else f();
      };
      try { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stop(); return sc0.apply(this, a); }; } catch (e) { /* 무시 */ }
      return { go, stop };
    })();
    const { sleep, say, camSnap, camTo } = T;
    /* 효과음 (2026-10-28): 시간·장소 단서만 실제 소리, 나머지는 만화·악기 소리. 읽어 주기에서는 부드러운 배경 소리만(vol ≤ .2, dur ≤ 4) */
    const sfx = (n, v) => { try { return AudioFX.sfx(n, v); } catch (e) { return false; } };
    const amb = (n, o) => { try { return AudioFX.ambient(n, o); } catch (e) { return null; } };
    /* 대금 한 소절(2026-10-29): 울상·밤·용서처럼 조용하고 애틋한 순간에만. 놀이 .3, 읽기 ×0.8 */
    const daeg = () => { try { const o = { vol: T.reading() ? .24 : .3, loop: false, fadeIn: .3, dur: 6.5 }; if (!AudioFX.ambient('daegeum', o)) setTimeout(() => { try { AudioFX.ambient('daegeum', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
    const stopAmb = f => { try { AudioFX.stopAmbient(f); } catch (e) { /* 무시 */ } };
    /* 맨 끝 축하 음악(2026-10-31 사용자 지시): 전래동화 끝 음악 finale_korean(9.5초, sounds/CREDITS.md). 내레이션이 읽히는 동안은 엔진이 자동으로 낮춘다(ambient 덕킹).
       끝 화면 전에 곡 끝(페이드)까지 기다린다. 읽어 주기도 같은 곡(화면을 꺼도 끝까지 재생) */
    let finaleEnd = 0;
    const finaleMusic = () => { try { const o = { vol: T.reading() ? .3 : .5, loop: false, fadeIn: .2, dur: 9.5 }; finaleEnd = Date.now() + 9500; if (!AudioFX.ambient('finale_korean', o)) setTimeout(() => { try { AudioFX.ambient('finale_korean', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
    const finaleWait = () => (finaleEnd ? sleep(Math.max(0, Math.min(6000, finaleEnd - Date.now() - 600))) : Promise.resolve());
    try { AudioFX.preloadSfx(['finale_korean', 'daegeum', 'intro_cozy2', 'birds_chirp_1', 'birds_chirp_2', 'stream_1', 'stream_2', 'loom_spin', 'crowd_murmur_1', 'broom_1', 'dig_soil', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'boing', 'shimmer', 'chime_up', 'whistle_down', 'splash', 'question', 'party_horn', 'ding_glock', 'pop_appear']); } catch (e) { /* 무시 */ }
    { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stopAmb(.5); return sc0.apply(this, a); }; } // 장면이 바뀌면 배경 소리를 끈다
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const tr = T.tr;
    /* 층 소품(VISUAL_PLAN §3~§8): 누름 없음. 중간 층은 T.bg(배우 뒤), 앞 가림 층은 T.fx(배우 위, 이미 pointer-events none).
       (cx, y) = 가운데·발끝, top 이면 윗변. 앞 소품은 세로 화면 가운데(285~715) 밖에만 둔다 */
    const L = {};
    const still = () => T.reading && T.reading() && T.readInstant && T.readInstant();
    const layer = (k, cx, y, h, { front = false, flip = false, top = false, name } = {}) => {
      const w = h * LASP[k], g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
      const inner = T.el('g', { filter: 'url(#pp)' }, g);
      if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
      T.el('image', { href: AS + 'kj_layer_' + k + '.webp', x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, inner);
      inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = top ? '50% 0%' : '50% 100%';
      if (name) L[name] = inner;
      return inner;
    };
    const sway = (g, deg, ms, delay = 0) => { if (!still()) g.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }], { duration: ms, delay, iterations: Infinity, easing: 'ease-in-out' }); return g; };
    const wig = (name, deg = 3, ms = 500) => { const g = L[name]; if (g && g.isConnected) g.animate([{ rotate: '0deg' }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }, { rotate: '0deg' }], { duration: ms, composite: 'add' }); };
    const cosmos = (both = true) => { sway(layer('cosmos_front', 30, 600, 120, { front: true }), 1, 5000); if (both) sway(layer('cosmos_front', 970, 600, 120, { front: true, flip: true }), 1, 5000, 1300); };
    const peony = () => { layer('peony_front', 30, 600, 110, { front: true }); layer('peony_front', 970, 600, 110, { front: true, flip: true }); };
    function dress(key) {
      if (key === 'yard') { sway(layer('persimmon_branch', P ? 700 : 920, -24, 220, { front: true, top: true, name: 'persimmon' }), 1.2, 7000); cosmos(); }
      if (key === 'field') cosmos();   // 안개 띠(mist)는 들판 가운데 떠 있는 구름처럼 보여 뺐다(사진 확인 2026-10-23)
      if (key === 'jar') { sway(layer('persimmon_branch', P ? 700 : 920, -24, 220, { front: true, top: true, name: 'persimmon' }), 1.2, 7000); cosmos(false); }
      if (key === 'mat') cosmos();
      if (key === 'loom') layer('thread_skeins', 250, 540, 80);
      if (key === 'stream') {
        cosmos(false);
        sway(layer('willow', 70, -24, 280, { front: true, top: true, name: 'willowL' }), 1.5, 6000); sway(layer('willow', 930, -24, 280, { front: true, top: true, flip: true, name: 'willowR' }), 1.5, 6000, 1500);
      }
      if (key === 'gate') peony();
    }
    const scene = key => { T.clear(); bgImage(T, key); dress(key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 약 430만 보인다 */
    /* 물방울: 물동이에서 독으로 붓기 / 독 구멍으로 새기 */
    const drop = (x0, y0, x1, y1, ms = 420) => {
      const c = T.el('image', { href: AS + 'kj_water_drop.webp', x: x0 - 7, y: y0 - 10, width: 14, height: 20, preserveAspectRatio: 'none', style: 'pointer-events:none' }, T.world);   // 2026-10-24 코드 타원 → 종이 물방울 그림
      const a = c.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${x1 - x0}px,${y1 - y0}px)`, opacity: .2 }], { duration: ms, easing: 'ease-in' });
      a.onfinish = () => c.remove();
    };
    /* 독 아가리의 물 면: 종이 물 면 그림(kj_water_surface, 흰 테두리 없음). opacity 로 차오름 */
    const waterTop = jar => T.el('image', { href: AS + 'kj_water_surface.webp', x: jar.x - 52, y: jar.y - 162, width: 104, height: 24, preserveAspectRatio: 'none', opacity: 0, style: 'pointer-events:none' }, T.world);
    const pourDrops = (pail, jar) => { for (let k = 0; k < 3; k++) setTimeout(() => drop(pail.x - 10, pail.y - 90, jar.x - 20 + k * 14, jar.y - 150, 380), k * 90); };
    const leakDrops = jar => { for (let k = 0; k < 3; k++) setTimeout(() => drop(jar.x - 4, jar.y - 30, jar.x - 4 + (k - 1) * 12, jar.y + 20, 360), 380 + k * 110); };
    /* 개울 v3: 징검돌·모래톱 자리와 떠내려가는 꽃신. 꽃신 아래쪽을 물빛 물결 조각으로 덮어 물에 잠겨 보이게 하고(앞층), 물결 따라 오르내리며 오른쪽으로 */
    /* 그림(kj_bg_stream_v3)에서 잰 자리: 징검돌 가운데 x 298·432·570·700, 돌 윗면 y 414~456 → 발 440. 왼쪽 모래톱 (170, 520).
       세로 화면(보이는 폭 약 430)은 카메라가 콩쥐를 따라 옆으로 간다(가로는 clampCam 이 500 에 묶어 그대로) */
    const STONES = [298, 432, 570, 700], STONE_Y = 440, BANK = [170, 520], WATER_FRONT = '#3F87C6';
    const followCam = (x, ms = 380) => { if (P) return ms ? camTo(x, 280, 1, ms) : camSnap(x, 280, 1); };
    /* 2026-10-30 꽃신이 너무 컸다(높이 34 = 콩쥐 발 꽃신의 2.5배) → 콩쥐 발에 신은 꽃신과 같은 크기(높이 16)로. 물결 조각도 같은 비율로 줄임 */
    const driftShoe = () => {
      const lost = prop(T, 'shoe_butterfly', 16); put(T, lost, STONES[3] + 60, 470, { to: 'right' });
      followCam(STONES[3] + 60, 0);
      const wv = T.el('g', { style: 'pointer-events:none', filter: 'url(#pp)' }, lost.pos);   // 물결 종이 조각 두 장(물빛 + 흰 물마루)
      T.el('image', { href: AS + 'kj_wave_front.webp', x: -30, y: -8, width: 60, height: 13, preserveAspectRatio: 'none' }, wv);   // 2026-10-24 코드 물결 → 종이 물결 그림(kj_wave_front)
      lost.pos.animate([{ opacity: 0 }, { opacity: 1 }], 300);
      if (!still()) lost.body.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '0 -2px', rotate: '-4deg' }, { translate: '0 0', rotate: '0deg' }], { duration: 900, iterations: Infinity, easing: 'ease-in-out' });
      return lost.move(1080, 466, 4200, 'ease-in').then(() => hide(lost));
    };
    /* 2026-10-30 크기를 키운 뒤 인물 자리(놀이판·읽어 주기 같이). [x, y, 배율]. 세로 화면(P, 휴대폰은 보이는 폭 약 390: 305~695)은 안쪽으로 모은다.
       혼례(마지막 장면)는 넷이 붙어 겹치던 것을 가로는 넓게 벌리고, 세로는 넷을 한 비율로 함께 줄여 멀리서 보는 것처럼 모두 보이게 한다(휴대폰 .72, 보이는 폭이 넓은 아이패드 세로는 폭에 맞춰 .84 까지) */
    const SPOT = {
      yard: { kong: P ? [385, 505] : [430, 505], step: P ? [545, 505] : [620, 505], pat: P ? [640, 505] : [800, 505] },
      field: { kong: P ? [375, 505] : [380, 505], ox: P ? [515, 520] : [575, 520], step: P ? [635, 505] : [770, 505] },
      mat: { kong: [390, 505], step: P ? [665, 505] : [760, 505] },
      loom: { kong: P ? [390, 505] : [430, 505], fairy: P ? [610, 420] : [720, 420], kongGift: P ? [400, 505] : [430, 505], fairyGive: P ? [575, 505] : [600, 505] },
      feast: { step: P ? [375, 490] : [330, 490], pat: P ? [500, 490] : [470, 490], kong: P ? [615, 490] : [650, 490] },
      /* 2026-10-30 사용자 지시: 아이패드 세로에서 넷의 발이 화면 아래에 잘림 → 세로 배율 상한 1 → .84, 발 자리 505 → 492(아래 여유), 떡 548 → 538 */
      wedding: P ? ((f, s) => ({ won: [500 - 148 * f, 492, s], kong: [500 - 42 * f, 492, s], step: [500 + 70 * f, 492, s], pat: [500 + 150 * f, 492, s], cakes: [500, 538, Math.min(.85, .8 * f)] }))(...(f => [f, Math.min(.84, .72 * f)])(Math.min(1.38, Math.max(1, T.viewWidth() / 390))))
        : { won: [280, 505], kong: [430, 505], step: [600, 505], pat: [740, 505], cakes: [515, 548] },
    };
    const spot = (k, n) => SPOT[k] && SPOT[k][n];
    const putAt = (a, k, n, o = {}) => { const [x, y, s = 1] = spot(k, n); return put(T, a, x, y, { ...o, s }); };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k))), ...['kong_step_r_v2', 'kong_step_l_v2', 'kong_oneshoe_v2', 'water_drop', 'water_surface', 'wave_front'].map(k => T.preload(AS + 'kj_' + k + '.webp'))];   // 걸음 자세는 장면 중간에 바뀌므로 미리 불러 둔다
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);

    /* 2026-10-30 전체 크기 점검(§4-1, 사용자 지시 "선녀가 너무 작다, 팥쥐·새엄마도 이상해"). 아래 높이는 그림(webp)에서 같은 부위를 재서 정했다.
       화면 크기 = 그림 속 부위 픽셀 / 그림 높이 × (높이 × RS). '머리' = (머리카락 바깥 폭 + 머리 꼭대기~턱 길이) / 2, 그림 높이에 대한 비율.
       콩쥐 머리 비율: 쓸기 .364 · 괭이 .367 · 붓기 .376 · 베틀 .334 · 꽃신 .386 · 젖음 .371 · 걸음 .384 · 한 짝 .371 · 신부(정면, 머리카락이 납작) .308
         → 고치기 전 화면 머리 78 · 84 · 81 · 63(베틀) · 83 · 83 · 77 · – · 72 → 모두 82 로 맞춤(신부는 정면이라 얼굴 폭이 커서 76 에서 멈춤)
       새엄마 머리(올림머리 포함) .332 · .334 · 쪽 폭만 .362(부채 자세) → 고치기 전 68 → 83. 키 약 250 (콩쥐 약 215 보다 크다, 어른)
       선녀 머리 .259(내려옴) · .255(줌) → 고치기 전 46 · 50 (콩쥐 82 의 절반 남짓이라 너무 작았다) → 83 · 82. 키 약 320(어른, 몸이 길게 그려짐)
       팥쥐는 정면이라 얼굴 폭(볼~볼, 귀 빼고): 먹기 .392 · 차림 .296 · 부끄럼 .270 → 고치기 전 63 · 55 · 57 → 모두 62 (콩쥐 신부 얼굴 폭 68 보다 조금 작게)
       원님은 갓 때문에 얼굴 폭과 갓 꼭대기~턱: 서기 .214/.346 · 꽃신 .208/.342 → 고치기 전 얼굴 54 · 49 → 62 · 61 (키 약 290, 어른)
       두꺼비 눈 사이: 가만 .448 · 막기 .465 → 66 · 70 → 66 · 66.  소는 콩쥐보다 작았다(170) → 230.
       참새 떼 한 마리는 혼자 참새의 약 1/3 크기였다 → 떼 높이 90 → 150 (한 마리 약 0.75배, 하늘 높이 멀리 날아오는 만큼만 작게) */
    const kong = mk(T, { sweep: ['kong_sweep', 240, 'left'], hoe: ['kong_hoe', 225, 'left'], pour: ['kong_pour', 232, 'left'],
      loom: ['kong_loom', 299, 'left'], shoes: ['kong_shoes_v2', 212, 'left'],
      /* 2026-10-24 징검다리 걸음: 오른발·왼발 번갈아 디디는 옆모습(오른쪽을 봄) */
      stepR: ['kong_step_r_v2', 214, 'right'], stepL: ['kong_step_l_v2', 214, 'right'], bride: ['kong_bride', 245, 'left'], wet: ['kong_wet', 221, 'left'],
      /* 2026-10-30 꽃신 한 짝을 잃은 콩쥐: 한 발은 꽃신, 한 발은 버선. 오른쪽(물 쪽)을 보는 옆모습 */
      oneshoe: ['kong_oneshoe_v2', 221, 'right'] });
    const step = mk(T, { order: ['step_order', 293, 'right'], dressed: ['step_dressed', 293, 'left'], shy: ['step_shy', 293, 'left'] });
    const pat = mk(T, { eat: ['pat_eat', 186, 'left'], dressed: ['pat_dressed', 239, 'left'], shy: ['pat_shy', 230, 'left'] });
    const toad = mk(T, { idle: ['toad_idle', 150, 'left'], plug: ['toad_plug', 141, 'left'] });
    const ox = prop(T, 'ox_stand', 230);
    const fairy = mk(T, { float: ['fairy_float', 453, 'left'], give: ['fairy_give', 408, 'left'] });
    const won = mk(T, { stand: ['won_stand', 290, 'left'], shoe: ['won_shoe', 312, 'left'] });
    const pail = prop(T, 'pail', 80), jar = prop(T, 'hangari', 170);
    const flock = prop(T, 'sparrow_flock', 150);
    widen(T, pail, 100, 100); widen(T, flock, 140, 120);
    const sparrows = Array.from({ length: 5 }, () => prop(T, 'sparrow_one', 56));
    const basketY = prop(T, 'basket_y', 80), basketR = prop(T, 'basket_r', 80);
    /* 2026-10-30 꽃신 고르기가 너무 어려워(세 켤레가 거의 같음) 틀린 두 켤레를 하늘색 물방울(shoeP 자리)·노랑 잎(shoeM 자리)으로 바꿈. 같은 신발 틀이라 높이 44 그대로 */
    const shoeB = prop(T, 'shoe_butterfly', 44), shoeP = prop(T, 'shoe_blue', 44), shoeM = prop(T, 'shoe_yellow', 44);
    [shoeB, shoeP, shoeM].forEach(a => widen(T, a, 100, 90));
    const drum = prop(T, 'buk', 84), buk = prop(T, 'drum', 84), gong = prop(T, 'gong', 84); [drum, buk, gong].forEach(a => widen(T, a, 100, 100)); // 2026-10-20 새 그림은 'buk'이 큰 북, 'drum'이 장구라서 파일을 맞바꿈
    const cakes = prop(T, 'ricecake', 76), loomProp = prop(T, 'loom', 190);

    /* ================= 읽어 주기 (docs/READ_MODE.md): 대본 read_script_el.json 의 동사 → 놀이판 연출을 감싼 얇은 함수 ================= */
    const READ_ACTS = (() => {
      const A = { kong, step, pat, ox, toad, fairy, won, flock };
      const PR = { jar, pail, basketY, basketR, drum, buk, gong, shoeP, shoeB, shoeM, cakes };
      const BG_OF = { yard: 'yard', field: 'field', well: 'jar', jar: 'jarbottom', mat: 'mat', loom: 'loom', stream: 'stream', feast: 'feast', office: 'gate', wedding: 'wedding' };
      let key = '', water = null;
      const rI = () => T.readInstant();
      const nums = s => String(s).split(',').map(Number);
      /* 인물 자리는 놀이판과 같은 SPOT 표를 먼저 쓴다(가로·세로 다름). 표에 없으면 대본 좌표 */
      const fadeIn = a => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], 450);
      const CUT_HOLD = { ox: 2600, wet: 2600, toad: 2600, sparrows: 2600, fairy: 2600, splash: 2600, shy: 2600 }; // 2026-10-29: 3~3.2초 → 2.6초
      const actorVerb = (n, a) => (op, spec) => {
        if (op === 'at') {
          const [x, y = GROUND] = nums(spec); if (n === 'toad' && key === 'jar') { put(T, a, ...TOAD_SIDE); return; }
          if (spot(BG_OF[key], n)) { putAt(a, BG_OF[key], n); return; }
          put(T, a, x, y); return;
        }
        if (op === 'look') {
          if (n === 'kong' && spec === 'shoes' && key === 'loom') putAt(a, 'loom', 'kongGift'); // 선녀가 옷을 주는 자리 (놀이판)
          a.look(spec); return;
        }
        if (op === 'to') { a.turn(spec); return; }
        if (op === 'hide') { hide(a); return; }
        if (op === 'hop') { a.hop(24, 320); popSfx(T); return; }
        if (op === 'fade') { fadeIn(a); return; }
        if (op === 'walk') {
          const [x, y = GROUND] = nums(spec);
          if (rI()) { a.place(x, y); return; }
          return a.move(x, y, 900);
        }
        if (op === 'cross') { // 징검다리를 n 번 폴짝 (누르기 없이 저절로)
          const next = STONES.filter(x => x > a.x + 10).slice(0, +spec);   // 개울 v3: 돌마다 폴짝
          return (async () => { let k = 0; for (const x of next) { if (n === 'kong') a.look(++k % 2 ? 'stepL' : 'stepR', 'right'); a.move(x, STONE_Y, 380); a.hop(26, 380); followCam(x); popSfx(T); await sleep(430); } })();
        }
        if (op === 'peck') return null;
      };
      const wellScene = () => {
        scene('jar'); water = null;
        put(T, kong, 400, 505, { look: 'pour', to: 'right' }); put(T, jar, 560, 505); put(T, pail, 480, 520);
      };
      const acts = {
        set(k) {
          key = k; stopAmb(.6);
          { const ra = { yard: ['birds_chirp_1', .15], mat: ['birds_chirp_2', .15], loom: ['loom_spin', .15], stream: ['stream_1', .15], feast: ['crowd_murmur_1', .12] }[k]; if (ra) { const kk = k; if (!amb(ra[0], { vol: ra[1], dur: 4, fadeIn: 1 })) setTimeout(() => { if (key === kk) amb(ra[0], { vol: ra[1], dur: 3, fadeIn: 1 }); }, 1500); } } // 장소 소리는 작게, 잠깐만
          if (k === 'well') { if (rI()) { wellScene(); return; } return T.sceneCard(null, wellScene); }
          if (rI()) { scene(BG_OF[k]); water = null; return; }
          return T.sceneCard(null, () => { scene(BG_OF[k]); water = null; });
        },
        cam() { camSnap(500, 280, 1); if (key === 'stream') followCam(kong.x, 0); },
        prop(id, op, spec) {
          const a = PR[id]; if (!a) return;
          if (op === 'at') { if (id === 'cakes' && spot(BG_OF[key], 'cakes')) { putAt(a, BG_OF[key], 'cakes'); return; } const [x, y] = nums(spec); put(T, a, x, y); return; }
          if (op === 'hide') hide(a);
        },
        sweep() { return (async () => { for (let i = 0; i < 3; i++) { kong.hop(14, 300); popSfx(T); await sleep(450); } })(); },
        pail(op, n) {
          if (op !== 'pour') return;
          return (async () => { for (let i = 0; i < +n; i++) { pail.hop(14, 260); popSfx(T); pourDrops(pail, jar); await sleep(500); } })();
        },
        jar(op) {
          if (op === 'leak') { leakDrops(jar); return sleep(900); }
          if (op === 'full') {
            if (!water || !water.isConnected) water = waterTop(jar);
            water.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, fill: 'forwards' });
            popSfx(T); return sleep(700);
          }
        },
        sparrows(op, n) {
          const sp = sparrows.slice(0, +n);
          return (async () => {
            for (let i = 1; i <= sp.length; i++) {
              const s = sp[i - 1]; put(T, s, 410 + i * 52, 440 - (i % 2) * 26, { to: 'left' });
              s.pos.animate([{ opacity: 0, translate: '0 -30px' }, { opacity: 1, translate: '0 0' }], 260); s.hop(10, 240); popSfx(T);
              sayNum(T, i); T.pop(s.x, s.y - 190, tr(NUM[i - 1]));
              await sleep(rI() ? 0 : 750);
            }
          })();
        },
        shoe(op) {
          if (op === 'drift') { // 떠내려간다 (이어서 다음 줄을 읽는다)
            driftShoe();
            return;
          }
          if (op === 'fit') { clinkSfx(T); shoeB.hop(24, 320); return sleep(450).then(() => kong.hop(34, 400)); }
        },
        cut(k) {
          if (k === 'fairy') sfx('shimmer', .35); // 원작의 선녀 선물: 반짝 한 번
          if (k === 'sparrows') hide(flock);
          if (k === 'toad') { toad.look('plug'); toad.place(...TOAD_HOLE); }
          return T.cutImage([{ src: cutSrc(k), sfx: 'pop', hold: CUT_HOLD[k] || 2600 }], { hold: CUT_HOLD[k] || 2600 });
        },
        fx(n) {
          if (n === 'drum') { AudioFX.sfx('drum') || T.tone([140, 90], .3, { vol: .25 }); drum.hop(14, 240); buk.hop(14, 240); }
          else if (n === 'gong') { clinkSfx(T); gong.hop(14, 240); }
          else if (n === 'splash') AudioFX.sfx('pow');
          else if (n === 'sparkle') clinkSfx(T);
          else popSfx(T);
        },
        pop(spec) { const a = String(spec).split(','); T.pop(+a[0], +a[1], tr(a.slice(2).join(','))); },
      };
      Object.keys(A).forEach(n => { acts[n] = actorVerb(n, A[n]); });
      acts.sparrow = acts.sparrows;
      /* 선녀가 옷을 줄 때는 땅으로 내려온다 */
      const fa = acts.fairy; acts.fairy = (op, spec) => { if (op === 'look' && spec === 'give' && key === 'loom') putAt(fairy, 'loom', 'fairyGive', { to: 'left' }); return fa(op, spec); };
      return acts;
    })();
    /* 읽어 주기 효과음 동사 (2026-10-28 사용자 결정: 놀이판과 같은 효과음). 대본 before/after 에 sfx:이름:음량, sfxs:이름들:간격ms:음량 으로 넣는다.
       기다리지 않고(null 반환), 실패해도 낭독을 막지 않는다. 낭독 전에 장면이 순식간에 놓이는 중(readInstant)에는 울리지 않는다. */
    if (READ_ACTS && typeof READ_ACTS === 'object') {
      READ_ACTS.sfx = (n, v) => { try { if (!T.readInstant()) AudioFX.sfx(n, +v || .55); } catch (e) { /* 무시 */ } return null; };
      READ_ACTS.sfxs = (list, step, v) => { try { if (T.readInstant()) return null; String(list).split(',').forEach((n, i) => setTimeout(() => { try { AudioFX.sfx(n, +v || .55); } catch (e) { /* 무시 */ } }, i * (+step || 260))); } catch (e) { /* 무시 */ } return null; };
    }
    if (READ_ACTS && typeof READ_ACTS === 'object') { // 짧은 배경 소리·동물 소리 동사: amb:이름:음량:초, animal:이름:음량
      READ_ACTS.amb = (n, v, d) => { try { if (!T.readInstant()) AudioFX.ambient(n, { vol: +v || .15, dur: +d || 3, fadeIn: 1 }); } catch (e) { /* 무시 */ } return null; };
      READ_ACTS.finale = () => { try { if (!T.readInstant()) finaleMusic(); } catch (e) { /* 무시 */ } return null; }; // 읽어 주기 맨 끝 축하 음악(2026-10-31)
      READ_ACTS.daeg = () => { try { if (!T.readInstant()) daeg(); } catch (e) { /* 무시 */ } return null; };
      READ_ACTS.animal = (n, v) => { try { if (!T.readInstant()) AudioFX.animal(n, +v || .4); } catch (e) { /* 무시 */ } return null; };
    }
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) { const rr = await T.readPlay(READ_ACTS); await finaleWait(); try { AudioFX.stopAmbient(.5); } catch (e) { /* 무시 */ } return rr; }

    /* --- 1. 마당 쓸기 --- */
    scene('yard');
    putAt(kong, 'yard', 'kong', { look: 'sweep', to: 'right' });
    putAt(step, 'yard', 'step', { look: 'order', to: 'left' });
    putAt(pat, 'yard', 'pat', { look: 'eat', to: 'left' });
    await T.curtain(true);
    amb('birds_chirp_1', { vol: .25, dur: 4 }); // 아침 마당 새소리
    intro.go(); // 시작 음악 (놀이)
    await say('옛날 옛날에 마음씨 고운 콩쥐가 살았어요.');
    await say('콩쥐는 새엄마, 팥쥐와 함께 살았어요.');
    await say('"콩쥐야, 마당을 쓸어라!" 새엄마가 말했어요.');
    const sweep = i => {
      kong.hop(14, 300); sfx('broom_1', .5) || popSfx(T); T.pop(kong.x + 70, kong.y - 295, tr(['쓱쓱!', '싹싹!', '깨끗!'][i - 1])); if (i === 1) wig('persimmon');
    };
    await T.ask('콩쥐를 톡! 눌러서 마당을 쓸어 봐요!', () => T.tap(kong.pos, { prompt: '콩쥐를 톡! 마당을 쓸어요.' })); // 한 번 누르면 나머지는 저절로 (2026-10-19)
    for (let i = 1; i <= 3; i++) { await sweep(i); await sleep(450); }
    await say('마당이 깨끗해졌어요. 콩쥐는 방긋 웃었어요.');

    /* --- 2. 소가 밭을 갈아요 --- */
    await T.sceneCard(tr('밭'), () => {
      scene('field');
      putAt(kong, 'field', 'kong', { look: 'hoe', to: 'right' });
      putAt(step, 'field', 'step', { look: 'order', to: 'left' });
    }, kong.pos);
    await say('"이 밭을 다 갈아 놓아라!" 새엄마가 말했어요.');
    await say('밭은 너무 넓어서 콩쥐는 한숨이 나왔어요.');
    putAt(ox, 'field', 'ox', { to: 'left' }); ox.pos.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    AudioFX.animal('cow', .5);
    await say('그때 검은 소가 나타났어요. "음메~ 내가 도와줄게!"');
    await sleep(500);
    popSfx(T); ox.hop(20, 300);
    await T.cutImage([{ src: cutSrc('ox'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    sfx('dig_soil', .4);
    await say('소가 쑥쑥 밭을 갈아 주었어요. "고마워, 소야!"');

    /* --- 3. 깨진 독 --- */
    await T.sceneCard(tr('우물가'), () => {
      scene('jar');
      put(T, kong, 400, 505, { look: 'pour', to: 'right' });
      put(T, jar, 560, 505); put(T, pail, 480, 520);
    }, jar.pos);
    await say('"이 독에 물을 가득 채워라!" 새엄마가 말했어요.');
    await T.ask('물동이를 톡톡톡 눌러서 물을 세 번 부어 봐요!', () => T.mash(pail.pos, { count: 3, prompt: '물동이를 톡톡톡! 물을 부어요.', onStep: i => {
      pail.hop(14, 260); sfx('marimba_' + i, .6) || popSfx(T); pourDrops(pail, jar); leakDrops(jar); T.pop(pail.x, pail.y - 290, tr(NUM[i - 1])); // 붓는 만큼 한 음씩
    } }));
    daeg(); // 물이 새어 울상이 된 콩쥐 — 대금
    await T.cutImage([{ src: cutSrc('wet'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    scene('jar');
    put(T, kong, 400, 505, { look: 'wet', to: 'right' }); put(T, jar, 560, 505);
    amb('stream_2', { vol: .25, dur: 3 }); // 물이 줄줄
    await say('앗! 독 밑에 구멍이 나서 물이 줄줄 새어 나왔어요.');
    await T.sceneCard(tr('독 안'), () => {
      scene('jarbottom');
      put(T, toad, ...TOAD_SIDE, { look: 'idle', to: 'left' });
    }, toad.pos);
    await say('그때 두꺼비가 폴짝 나타났어요. "내가 구멍을 막아 줄게!"');
    await T.tap(toad.pos, { prompt: '두꺼비를 톡! 구멍을 막아요.' });
    toad.look('plug'); toad.hop(40, 420); sfx('boing', .6); await toad.move(...TOAD_HOLE, 420); popSfx(T);
    await T.cutImage([{ src: cutSrc('toad'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    await say('두꺼비가 구멍에 쏙! 이제 물이 새지 않아요.');
    scene('jar');
    put(T, kong, 400, 505, { look: 'pour', to: 'right' }); put(T, jar, 560, 505); put(T, pail, 480, 520);
    const water = waterTop(jar);
    const refill = i => {
      pail.hop(14, 260); sfx('marimba_' + i, .6) || popSfx(T); pourDrops(pail, jar); T.pop(pail.x, pail.y - 290, tr(NUM[i - 1]));
      setTimeout(() => { water.setAttribute('opacity', (i / 3).toFixed(2)); }, 380);
    };
    // 저절로 (2026-10-19 톡 조작 정리)
    for (let i = 1; i <= 3; i++) { await refill(i); await sleep(500); }
    await say('독이 물로 가득 찼어요. "고마워, 두꺼비야!"');

    /* --- 4. 참새와 곡식 --- */
    await T.sceneCard(tr('멍석'), () => {
      scene('mat');
      put(T, kong, 390, 505, { look: 'sweep', to: 'right' });
      putAt(step, 'mat', 'step', { look: 'order', to: 'left' });
      put(T, basketY, 500, 535); put(T, basketR, 590, 535);
    }, kong.pos);
    await say('"겉겨를 벗겨서 쌀을 가져오너라!" 새엄마가 말했어요.');
    await say('곡식이 너무 많아서 콩쥐는 걱정이 되었어요.');
    put(T, flock, 500, 330); flock.pos.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    amb('birds_chirp_2', { vol: .25, dur: 3 }); // 참새 짹짹
    await say('그때 참새들이 날아왔어요. "짹짹! 우리가 도와줄게!"');
    await sleep(500);
    hide(flock); popSfx(T);
    await T.cutImage([{ src: cutSrc('sparrows'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    scene('mat');
    put(T, kong, 390, 505, { look: 'sweep', to: 'right' }); put(T, basketY, 500, 535); put(T, basketR, 590, 535);
    put(T, flock, 500, 310); flock.pos.animate([{ opacity: 0 }, { opacity: 1 }], 300);
    await T.ask('참새들이 콕콕 쪼아서 껍질을 벗겨 주었어요. 참새를 하나씩 세어 봐요!', () => T.mash(flock.pos, { count: 5, prompt: '참새를 톡톡톡톡톡! 하나씩 세어요.', onStep: i => {
      const s = sparrows[i - 1]; put(T, s, 410 + i * 52, 440 - (i % 2) * 26, { to: 'left' });
      s.pos.animate([{ opacity: 0, translate: '0 -30px' }, { opacity: 1, translate: '0 0' }], 260); s.hop(10, 240);
      sfx('marimba_' + i, .6) || popSfx(T); sayNum(T, i); T.pop(s.x, s.y - 190, tr(NUM[i - 1])); // 한 마리에 한 음
    } }));
    hide(flock);
    await say('참새가 하나, 둘, 셋, 넷, 다섯! 쌀이 금방 하얗게 되었어요.');

    /* --- 5. 선녀와 고운 옷 --- */
    await T.sceneCard(tr('베틀'), () => {
      scene('loom');
      putAt(kong, 'loom', 'kong', { look: 'loom', to: 'right' }); // 2026-10-20 새 콩쥐 베틀 그림은 베틀이 그림 속에 있어 따로 놓던 베틀 소품은 뺌
    }, kong.pos);
    amb('loom_spin', { vol: .22, dur: 4 }); // 베틀 찰칵
    daeg(); // 밤늦도록 베를 짜는 콩쥐 — 대금
    await say('이제 콩쥐는 베를 짜야 했어요. 콩쥐는 열심히 베를 짰어요.');
    putAt(fairy, 'loom', 'fairy', { look: 'float', to: 'left' }); fairy.pos.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    sfx('shimmer', .4); // 원작의 선녀: 반짝 한 번
    await say('그때 하늘에서 선녀가 내려왔어요. "착한 콩쥐야, 선물을 줄게!"');
    await sleep(500);
    fairy.look('give'); popSfx(T);
    await T.cutImage([{ src: cutSrc('fairy'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    scene('loom');
    putAt(kong, 'loom', 'kongGift', { look: 'shoes', to: 'right' }); putAt(fairy, 'loom', 'fairyGive', { look: 'give', to: 'left' });
    sfx('chime_up', .5); // 선물을 받아 옷이 바뀐다
    await say('콩쥐는 곱디고운 옷과 나비 꽃신을 받았어요. "고맙습니다, 선녀님!"');
    await kong.hop(30, 400);

    /* --- 6. 개울에서 꽃신이 풍덩 --- */
    /* 2026-10-23 개울 v3: 물이 화면 아래 절반, 징검돌 넷(STONES). 콩쥐는 왼쪽 모래톱에서 돌 넷을 하나씩 폴짝(세로는 카메라가 따라감) */
    await T.sceneCard(tr('개울'), () => {
      scene('stream');
      put(T, kong, BANK[0], BANK[1], { look: 'shoes', to: 'right' }); followCam(BANK[0], 0);
      kong.look('stepR', 'right');
    }, kong.pos);
    amb('stream_1', { vol: .25, dur: 4 }); // 개울 졸졸
    const cross = (i, x) => {
      kong.look(i % 2 ? 'stepL' : 'stepR', 'right'); kong.move(x, STONE_Y, 380); kong.hop(26, 380); followCam(x); sfx('marimba_' + i, .6) || popSfx(T); wig('willowL', 2, 400); wig('willowR', 2, 400); T.pop(x + 40, STONE_Y - 295, tr(NUM[i - 1]));
      return sleep(380);
    };
    await T.ask('콩쥐는 잔치에 가려고 개울을 건너기로 했어요. 징검다리를 톡! 건너 봐요!', () => T.tap(kong.pos, { prompt: '콩쥐를 톡! 징검다리를 건너요.' })); // 한 번 누르면 나머지는 저절로 (2026-10-19)
    { const next = STONES.filter(x => x > kong.x + 10); for (let i = 1; i <= next.length; i++) { await cross(i, next[i - 1]); await sleep(400); } }
    await T.cutImage([{ src: cutSrc('splash'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    scene('stream');
    put(T, kong, STONES[3], STONE_Y, { look: 'oneshoe', to: 'right' }); // 2026-10-30 꽃신 한 짝을 잃고 버선발로 서서 물을 바라봄
    sfx('whistle_down', .5); setTimeout(() => sfx('splash', .35), 450); // 꽃신이 퐁당
    const drift = driftShoe();
    await say('풍덩! 꽃신 한 짝이 개울에 빠졌어요. 꽃신은 둥둥 떠내려갔어요.');
    await drift;
    await say('콩쥐는 아쉬웠지만 한 짝만 신고 잔치로 갔어요.');

    /* --- 7. 잔치 --- */
    await T.sceneCard(tr('잔치'), () => {
      scene('feast');
      putAt(step, 'feast', 'step', { look: 'dressed', to: 'right' });
      putAt(pat, 'feast', 'pat', { look: 'dressed', to: 'right' });
      putAt(kong, 'feast', 'kong', { look: 'oneshoe', to: 'left' }); // 한 짝만 신고 온 콩쥐
      put(T, drum, 400, 560); put(T, buk, 500, 560); put(T, gong, 600, 560);
    }, kong.pos);
    amb('crowd_murmur_1', { vol: .2, dur: 4 }); // 잔치 웅성웅성
    await T.ask('잔치에서는 북과 장구와 꽹과리 소리가 울렸어요. 북을 톡 눌러 봐요!', () => T.tap(drum.pos, { prompt: '북을 톡! 둥둥 소리가 나요.' }));
    AudioFX.sfx('drum') || T.tone([140, 90], .3, { vol: .25 }); drum.hop(14, 240); T.pop(drum.x, drum.y - 360, tr('둥!'));
    await sleep(500);
    AudioFX.sfx('drum') || T.tone([200, 150], .25, { vol: .22 }); buk.hop(14, 240); T.pop(buk.x, buk.y - 360, tr('덩!'));
    await sleep(500);
    clinkSfx(T); gong.hop(14, 240); T.pop(gong.x, gong.y - 360, tr('꽹!'));
    await say('모두 신나게 춤을 추었어요. 새엄마와 팥쥐도 곱게 차려입고 왔어요.');
    await T.cutImage([{ src: cutSrc('shy'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    await say('콩쥐를 본 새엄마와 팥쥐는 부끄러워서 부채로 얼굴을 가렸어요.');

    /* --- 8. 꽃신 주인 --- */
    await T.sceneCard(tr('원님 댁'), () => {
      scene('gate');
      put(T, won, 480, 505, { look: 'shoe', to: 'right' });
      put(T, shoeP, 380, 545); put(T, shoeB, 500, 545); put(T, shoeM, 620, 545);
    }, won.pos);
    await say('개울에 빠진 꽃신은 원님에게 닿았어요. "이 꽃신의 주인을 찾아요!"');
    sfx('question', .6);
    const got = await T.ask('꽃신 세 켤레 중에서 나비 꽃신이 콩쥐의 꽃신이에요. 나비 꽃신을 톡!', () => T.choose([
      { key: 'p', el: shoeP.pos, ok: false }, { key: 'b', el: shoeB.pos, ok: true }, { key: 'm', el: shoeM.pos, ok: false }],
      { prompt: '나비 꽃신을 톡!', where: '나비가 그려진 꽃신을 찾아봐요.', who: '반짝이는 꽃신을 톡!' }));
    clinkSfx(T); shoeB.hop(24, 320);
    hide(shoeP); hide(shoeM); // 콩쥐가 설 자리를 비운다
    put(T, kong, 640, 505, { look: 'shoes', to: 'left' }); kong.pos.animate([{ opacity: 0 }, { opacity: 1 }], 400); // 꽃신을 신는 콩쥐(두 짝 다 신은 꽃신 자세는 이때만)
    await say('원님이 콩쥐에게 꽃신을 신겨 주었어요. 꼭 맞았어요!');
    await sleep(500);
    popSfx(T); kong.hop(34, 400);

    /* --- 9. 화해와 함께하는 잔치 --- */
    await T.sceneCard(tr('혼례'), () => {
      scene('wedding');
      putAt(won, 'wedding', 'won', { look: 'stand', to: 'right' });
      putAt(kong, 'wedding', 'kong', { look: 'bride', to: 'left' });
      putAt(step, 'wedding', 'step', { look: 'shy', to: 'left' }); putAt(pat, 'wedding', 'pat', { look: 'shy', to: 'left' });
      putAt(cakes, 'wedding', 'cakes');
    }, kong.pos);
    await say('콩쥐와 원님은 혼례를 올렸어요. 콩쥐는 곱게 차린 신부가 되었어요.');
    daeg(); // 사과와 용서 — 대금
    await say('"콩쥐야, 그동안 미안했어." 새엄마와 팥쥐가 고개를 숙였어요.');
    await say('콩쥐는 웃으며 말했어요. "괜찮아요. 우리 같이 지내요."');
    await Promise.all([step.hop(20, 400), pat.hop(20, 400)]);
    await say('모두 함께 떡을 나눠 먹어요.');
    const eaters = [won, step, pat];
    const feed = i => {
      const who = eaters[i - 1], c = prop(T, 'ricecake', 30); put(T, c, cakes.x, cakes.y - 20);
      c.move(who.x, who.y - 110, 420, 'ease-in').then(() => { hide(c); who.hop(14, 240); });
      cakes.hop(10, 220); popSfx(T); T.pop(who.x, who.y - 330, tr(['냠냠!', '쫀득!', '맛있다!'][i - 1]));
    };
    // 저절로 (2026-10-19 톡 조작 정리)
    for (let i = 1; i <= 3; i++) { await feed(i); await sleep(500); }
    await T.ask('모두 둘러앉아 맛있게 먹었어요. 콩쥐를 톡! 모두 함께 만세!', () => T.tap(kong.pos, { prompt: '콩쥐를 톡! 모두 함께 만세!' }));
    T.confetti(); finaleMusic();
    await Promise.all([kong.hop(40, 500), won.hop(30, 500), step.hop(24, 500), pat.hop(24, 500)]);
    await say('착한 마음은 도움을 불러와요. 콩쥐팥쥐 이야기는 이렇게 끝났어요.');
    await finaleWait();
    T.finale(); stopAmb(.8);
    return '착한 마음은 도움을 불러와요!';
  }

  Tale.mount({ title: '콩쥐팥쥐', subtitle: '착한 마음은 도움을 불러와요', read: true, run: T => run(Tale.api) });
})();
