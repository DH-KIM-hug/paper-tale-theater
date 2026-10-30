/* 늑대와 아기 염소 — 시안(목업): 그림은 완성본, 목소리는 아직 없음(말풍선 + 브라우저 음성).
   대사는 script_draft.txt 로 검토한 뒤 voice_script.json 을 만들어 Typecast 로 녹음한다.
   - 3~4세 순화: 늑대는 우물에 빠졌다 도망갈 뿐 다치지 않고, 아기 염소들도 하나도 다치지 않는다. 틀리거나 지는 일 없음.
   - 배경은 장면마다 한 장(assets/v3w/wg_bg_*.webp), 배우는 자세마다 한 장(발끝 = 배우 y). */
(() => {
  const NF = new Set(['wg_clock', 'wg_clock_open', 'wg_laundry', 'wg_quilt', 'wg_stone']); // 얼굴 없는 새 그림(파일 이름 끝에 nf)
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

  /* 2026-10-23 화려한 재기획(VISUAL_PLAN.md): 장면 키(읽어 주기 포함)는 그대로 그림만 v2·라이트박스.
     부엌 창·시계·난로, 집 안 문(문 밑 틈 369)·창·벤치, 어질러진 방 시계·의자·이불, 집 앞 문, 나무 기둥, 우물·울타리는 원본과 겹쳐 같은 자리.
     나무 아래는 노을 라이트박스, 우물가는 달밤 라이트박스(판단 1 추천안). 똑똑똑(inside_door)은 그대로 */
  const BGS = { kitchen: 'wg_bg_kitchen_v2', house: 'wg_bg_house_v2', messy: 'wg_bg_messy_v2', door: 'wg_bg_door_v2', tree: 'wg_lb_tree_sunset', well: 'wg_lb_well_moon_glow' };   // 2026-10-28 사용자 결정(§7-1 빛 예외): 달의 단단한 크림 고리 → 반투명 달무리(_glow, 우물·땅선 자리 그대로)
  const LAYER_AR = { herb_garland: 1.215, rosebush_front: 1.1183, wildflowers_mid: 3.4091, sil_branch: 1.16 };
  function bg(T, key) {
    T.el('image', { href: BGS[key] ? `../../assets/v3w/${BGS[key]}.webp` : A('wg_bg_' + key), x: -40, y: -22, width: 1080, height: 605, preserveAspectRatio: 'xMidYMid slice' }, T.bg);
    dress(T, key);
  }
  /* 층 소품: 누름 없음. front 면 배우 앞(T.fx), 아니면 배우 뒤(T.bg). (cx, y) = 가운데·발끝, top 이면 윗변 */
  const still = T => T.reading() && T.readInstant();
  function layer(T, k, cx, y, h, { front = true, flip = false, top = false, sway = 0, ms = 9000 } = {}) {
    const w = h * LAYER_AR[k], g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
    if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
    const inner = T.el('g', { filter: 'url(#pp)' }, g);
    T.el('image', { href: `../../assets/v3w/wg_layer_${k}.webp`, x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, inner);
    inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = top ? '50% 0%' : '50% 100%';
    if (sway && !still(T)) inner.animate([{ rotate: `${-sway}deg` }, { rotate: `${sway}deg` }, { rotate: `${-sway}deg` }], { duration: ms, iterations: Infinity, easing: 'ease-in-out' });
    return inner;
  }
  /* 반딧불(라이트박스 하늘): 작은 크림 원이 깜빡 */
  function lightDots(T, n, [x0, x1, y0, y1]) {
    for (let i = 0; i < n; i++) {
      const x = x0 + Math.random() * (x1 - x0), y = y0 + Math.random() * (y1 - y0), r = 3 + Math.random() * 2;
      const g = T.el('g', { style: 'pointer-events:none' }, T.fx);
      T.el('circle', { cx: x, cy: y, r: r + 3, fill: '#FBE8A6', opacity: .5 }, g); T.el('circle', { cx: x, cy: y, r, fill: '#FFF4CC' }, g);
      if (!still(T)) g.animate([{ opacity: .2 }, { opacity: 1 }, { opacity: .2 }], { duration: 1400 + Math.random() * 1200, delay: Math.random() * 1000, iterations: Infinity });
    }
  }
  function dress(T, key) {
    if (key === 'kitchen' || key === 'inside_door') layer(T, 'herb_garland', key === 'kitchen' ? 860 : 800, -22, 70, { top: true });
    if (key === 'door') {
      layer(T, 'wildflowers_mid', 140, 560, 70, { front: false }); layer(T, 'wildflowers_mid', 860, 560, 70, { front: false, flip: true });
      layer(T, 'rosebush_front', 40, 592, 120); layer(T, 'rosebush_front', 960, 592, 120, { flip: true });
    }
    if (key === 'tree') layer(T, 'sil_branch', 60, -22, 220, { top: true, sway: 1 });
    if (key === 'well') {
      layer(T, 'sil_branch', 60, -22, 200, { top: true, sway: 1 }); layer(T, 'sil_branch', 940, -22, 200, { top: true, flip: true, sway: 1 });
      lightDots(T, 10, [40, 960, 60, 300]);
    }
  }
  /* 2026-10-24 사용자 결정(빛 상자 검수): 늑대가 우물 오른쪽 빈 땅에서 물을 튀겨 → 달밤 우물(wg_lb_well_moon) 돌 우물 안으로 빠진다.
     그림 속 우물: 돌 벽 x 446~690, 테두리 윗면 y≈258, 앞 벽 y 268~392(겹쳐 잼). 늑대는 우물 가운데(568, 352)에 발끝을 두고,
     배경에서 앞 벽만 오려 배우 위(T.fx)에 다시 얹어 아랫몸이 우물 속에 잠기게 한다 */
  const WELL_IN = { x: 568, y: 352 };
  let wellN = 0;
  function wellFront(T) {
    const id = 'wgWellFront' + (++wellN), g = T.el('g', { style: 'pointer-events:none' }, T.fx);
    const cp = T.el('clipPath', { id }, g); T.el('path', { d: 'M446 270 Q568 284 690 270 V392 H446 Z' }, cp);
    T.el('image', { href: `../../assets/v3w/${BGS.well}.webp`, x: -40, y: -22, width: 1080, height: 605, preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${id})` }, g);
    return g;
  }
  async function wellSplash(T, W) {
    W.pose('splash'); W.face('left');
    const front = wellFront(T);
    W.hop && W.hop(40, 420);
    await W.move(WELL_IN.x, WELL_IN.y, 420);
    return front;
  }
  /* 배우: poses = { 이름: 그림 }. first 자세의 높이가 h. 발끝 = (x,y) */
  function figure(T, x, y, h, poses, first, mul = {}) {
    const imgs = {}, s = h / DIM[poses[first]][1];
    const a = T.actor(T.world, x, y, g => {
      const w = T.el('g', { filter: 'url(#pp)' }, g);
      for (const [k, f] of Object.entries(poses)) {
        const [pw, ph] = DIM[f], ps = s * (mul[k] || 1); // mul: 자세별 배율(머리 폭 맞춤, 2026-10-20 크기 일관성)
        imgs[k] = T.el('image', { href: A(f), x: -pw * ps / 2, y: -ph * ps, width: pw * ps, height: ph * ps, opacity: k === first ? 1 : 0 }, w);
      }
    });
    a.pose = k => Object.entries(imgs).forEach(([n, i]) => show(i, n === k));
    /* 누르는 자리 넓히기: 눌러야 할 때만 부른다(작은 아기 염소도 화면 짧은 변 80px 이상). 항상 깔면 옆 그림이 누름을 가로챈다 (2026-10-22) */
    a.widen = () => {
      if (a._hit) return a.pos;
      const hh = Math.max(h, 96);
      a._hit = T.el('rect', { x: -56, y: -hh, width: 112, height: hh, fill: '#000', 'fill-opacity': 0 }, a.pos);
      a.pos.insertBefore(a._hit, a.pos.firstChild); return a.pos;
    };
    return a;
  }
  // 2026-10-20 크기 일관성: 1번 아기 염소의 기뻐하는 자세(joy)는 머리 폭이 기본 자세보다 약 21% 작아서 1.26배로 맞춘다 (2번은 12%라 그대로)
  const JOY_MUL = { 1: 1.26 };
  /* 아기 염소 그림이 원래 보는 쪽(몸통 반대쪽, 2026-10-22 측정). look(방향)으로 그쪽을 보게 뒤집는다 */
  const KID_SIDE = { 1: 'left', 2: 'left', 3: 'left', 4: 'right', 5: 'left', 6: 'right', 7: 'right' };
  const kid = (T, n, x, y, h = 90) => {
    const k = figure(T, x, y, h, { base: `wg_kid${n}_base`, joy: `wg_kid${n}_joy` }, 'base', JOY_MUL[n] ? { joy: JOY_MUL[n] } : {});
    k.look = d => k.face(d === KID_SIDE[n] ? 'left' : 'right');
    return k;
  };
  /* 2026-10-22 크기 일관성(§4-1): 늑대 자세별 화면 높이. 같은 부위(코 동그라미 지름)를 재서 화면에서 코 지름이 약 20이 되게 맞춘다.
     그림 속 코 지름(px): knock 18.5, chalk 19, flour 16.5, belly 17, heavy 39, splash 20, flee 26 */
  const WP = { knock: 'wg_wolf_knock', chalk: 'wg_wolf_chalk', flour: 'wg_wolf_flour', belly: 'wg_wolf_belly', heavy: 'wg_wolf_heavy', splash: 'wg_wolf_splash', flee: 'wg_wolf_flee' };
  const WOLF_H = { knock: 266, chalk: 199, flour: 240, belly: 205, heavy: 223, splash: 204, flee: 178 };
  const wolf = (T, x, y, keys, first) => {
    const poses = {}, mul = {}, s0 = WOLF_H[first] / DIM[WP[first]][1];
    keys.forEach(k => { poses[k] = WP[k]; mul[k] = (WOLF_H[k] / DIM[WP[k]][1]) / s0; });
    return figure(T, x, y, WOLF_H[first], poses, first, mul);
  };
  /* 떠오르며 사라지는 작은 글자(음표·반짝이·zZ·밀가루 가루). 누름을 받지 않는다 */
  const floaty = (T, x, y, ch, color, size = 40, delay = 0) => new Promise(r => setTimeout(r, delay)).then(() => {
    const t = T.el('text', { x, y, 'font-size': size, 'font-weight': 800, fill: color, 'text-anchor': 'middle', filter: 'url(#pp)', 'pointer-events': 'none' }, T.world);
    t.textContent = ch;
    const a = t.animate([{ transform: 'translate(0px,0px)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: 'translate(14px,-70px)', opacity: 0 }], { duration: 1800, easing: 'ease-out' });
    a.onfinish = () => t.remove();
  });
  const PAW_SPOTS = [[235, 470], [295, 505], [355, 462], [410, 520], [465, 478], [525, 512], [580, 468]]; // 하얀 발 장면: 문 쪽을 보는 아기 염소 자리
  const mama = (T, x, y, h = 270, first = 'basket') => figure(T, x, y, h, {
    basket: 'wg_mama_basket', warn: 'wg_mama_warn', surprise: 'wg_mama_surprise', scissors: 'wg_mama_scissors', dance: 'wg_mama_dance' }, first);
  const prop = (T, f, x, y, h) => figure(T, x, y, h, { a: f }, 'a');
  const knock = () => { AudioFX.sfx('knock', .9); };
  const sting = k => AudioFX.sting && AudioFX.sting(k);
  const cutArt = (T, f, sfx, hold = 2600) => T.cutImage([{ src: A(f), sfx, hold }], { hold });
  const hide = a => show(a.pos, 0);
  const appear = a => show(a.pos, 1);

  async function run(T) {
    /* 시작 음악 (2026-10-28): 첫 장면 시작에 12초 깔고, 첫 장면 전환에서 끈다. 읽어 주기는 음량 .25 */
    const intro = (() => {
      let h = null, on = true;
      const stop = () => { on = false; try { h && h.stop(.8); h = null; } catch (e) { /* 무시 */ } };
      const go = (delay = 0) => {
        const f = () => { try { if (!on) return; const o = { vol: T.reading() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }; h = AudioFX.ambient('intro_adventure', o); if (!h) setTimeout(() => { try { if (on) h = AudioFX.ambient('intro_adventure', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
        if (delay) setTimeout(f, delay); else f();
      };
      try { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stop(); return sc0.apply(this, a); }; } catch (e) { /* 무시 */ }
      return { go, stop };
    })();
    const { sleep, say } = T;
    /* 효과음 (2026-10-28): 시간·장소 단서만 실제 소리, 나머지는 만화·악기 소리. 읽어 주기에서는 부드러운 배경 소리만(vol ≤ .2, dur ≤ 4) */
    const sfx = (n, v) => { try { return AudioFX.sfx(n, v); } catch (e) { return false; } };
    const amb = (n, o) => { try { return AudioFX.ambient(n, o); } catch (e) { return null; } };
    const stopAmb = f => { try { AudioFX.stopAmbient(f); } catch (e) { /* 무시 */ } };
    try { AudioFX.preloadSfx(['intro_adventure', 'birds_chirp_1', 'stream_1', 'door_heavy_1', 'ding_glock', 'clock_tick', 'question', 'tiptoe_pizz', 'zip_away', 'sleepy_tuba', 'zipper', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'marimba_6', 'whistle_down', 'comic_brass', 'party_horn', 'knock', 'door', 'crunch', 'finale_happy']); } catch (e) { /* 무시 */ }
    { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stopAmb(.5); return sc0.apply(this, a); }; } // 장면이 바뀌면 배경 소리를 끈다
    /* 맨 끝 축하 음악(2026-10-31 사용자 지시): 팥죽과 같은 finale_happy(9.5초, sounds/CREDITS.md). 내레이션 동안은 엔진이 자동으로 낮춘다(ambient 덕킹). 끝 화면 전에 곡 끝까지 기다린다 */
    let finaleEnd = 0;
    const finaleMusic = () => { try { const o = { vol: T.reading() ? .3 : .5, loop: false, fadeIn: .2, dur: 9.5 }; finaleEnd = Date.now() + 9500; if (!AudioFX.ambient('finale_happy', o)) setTimeout(() => { try { AudioFX.ambient('finale_happy', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
    const finaleWait = () => (finaleEnd ? sleep(Math.max(0, Math.min(6000, finaleEnd - Date.now() - 600))) : Promise.resolve());
    const portrait = () => T.viewWidth() < 990;
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const scene = (label, fn) => T.sceneCard(label, () => { T.clear(); T.camSnap(500, 280, 1); fn(); });
    const hopAll = (list, h = 24) => Promise.all(list.map((a, i) => sleep(i * 70).then(() => a.hop(h, 360))));
    let kids;
    const lineUp = (y = 520, h = 90) => { kids = [1, 2, 3, 4, 5, 6, 7].map((n, i) => kid(T, n, KX(i), y, h)); return kids; };

    /* ================= 읽어 주기 (docs/READ_MODE.md): 대본 read_script_el.json 의 동사 → 놀이판 연출을 감싼 얇은 함수 =================
       장면 자리·크기·카메라는 놀이판 그 장면 그대로(대본 좌표는 놀이판 그림과 맞지 않아 쓰지 않는다). */
    const READ_ACTS = (() => {
      const rI = () => T.readInstant();
      const nums = s => String(s).split(',').map(Number);
      const P = portrait();
      const QX = 300, LX = 525, CX = 720, BX = 700, BY = 500, BELLY = [684, 425];
      let key = '', seen = {}, M = null, W = null, wellF = null, K7 = null, kidsR = [], quilt = null, laundry = null, clk = null, doorway = null, paw = null, stoneP = null, snoreOn = false, popped = false, wolfs = {};
      const CAMW = { house: P ? [180, 280] : [500, 280], tree: P ? [600, 280] : [500, 280] };
      const clearAll = () => { snoreOn = false; };
      const build = k => {
        clearAll(); seen[k] = (seen[k] || 0) + 1;
        const n = seen[k];
        T.clear(); T.camSnap(500, 280, 1);
        key = k; M = null; W = null; wellF = null; K7 = null; kidsR = []; popped = false; quilt = laundry = clk = doorway = paw = stoneP = null; wolfs = {};
        if (k === 'house' && n === 1) k = 'paw'; if (k === 'house' && n > 1) k = 'hide'; key = k;
        if (k === 'tree' && n > 1) key = 'belly';
        { const kk = key; const ra = { kitchen: ['birds_chirp_1', .15], hide: ['clock_tick', .15], well: ['stream_1', .15] }[key]; if (ra && !amb(ra[0], { vol: ra[1], dur: 4, fadeIn: 1 })) setTimeout(() => { if (key === kk) amb(ra[0], { vol: ra[1], dur: 3, fadeIn: 1 }); }, 1500); } // 새소리·큰 시계 똑딱·우물 물소리
        if (k === 'well' && n > 1) key = 'together';
        const bgKey = { paw: 'house', hide: 'house', belly: 'tree', together: 'well' }[key] || key;
        bg(T, bgKey);
        if (key === 'paw') {
          T.el('rect', { x: 6, y: 369, width: 178, height: 8, rx: 2, fill: '#4A3424' }, T.world);
          const cp = T.el('clipPath', { id: 'wgPawClip' }, T.world); T.el('rect', { x: -20, y: 374, width: 240, height: 200 }, cp);
          const holder = T.el('g', { 'clip-path': 'url(#wgPawClip)' }, T.world);
          paw = T.actor(holder, 95, 290, g => {
            const w = T.el('g', { transform: 'translate(0 45) rotate(55)' }, g);
            T.el('image', { href: A('wg_paw'), x: -131, y: -91, width: 170, height: 146 }, w);
          });
        }
        if (key === 'hide') {
          quilt = prop(T, 'wg_quilt', QX, 548, 150); laundry = prop(T, 'wg_laundry', LX, 550, 110); clk = figure(T, CX, 445, 330, { a: 'wg_clock', open: 'wg_clock_open' }, 'a');
          doorway = T.el('g', { opacity: 0 }, T.world);
          T.el('image', { href: A('wg_door_view'), x: 0, y: 4, width: 186, height: 372, preserveAspectRatio: 'none' }, doorway); // 열린 문 너머 바깥(하늘·풀밭·젖혀진 문짝) 그림 420×840 (2026-10-29, 옛 코드 네모 3장 대신)
          const wk = wolf(T, 100, 420, ['knock'], 'knock'); wk.face('right'); hide(wk); wolfs.wk = wk; W = wk;
        }
        if (key === 'messy') { clk = figure(T, 86, 492, 450, { a: 'wg_clock', open: 'wg_clock_open' }, 'a'); }
        if (CAMW[bgKey] && (key === 'paw' || key === 'hide' || key === 'tree' || key === 'belly')) T.camSnap(CAMW[bgKey][0], CAMW[bgKey][1], 1);
        if (key === 'tree' || key === 'belly') {
          W = wolf(T, BX, BY, ['belly'], 'belly');
          snoreOn = true;
          (async () => { while (snoreOn) { floaty(T, 560, 340, 'z', '#3F6B4F', 34); floaty(T, 585, 305, 'Z', '#3F6B4F', 44, 500); await sleep(2400); } })();
        }
      };
      const mkKids = () => {
        if (key === 'paw' || key === 'hide') { kidsR = PAW_SPOTS.map(([x, y], i) => { const k = kid(T, i + 1, x, y, 85); k.look('left'); return k; }); return; }
        if (key === 'together') { kidsR = [1, 2, 3, 4, 5, 6, 7].map((n, i) => { const k = kid(T, n, KX(i), 525, 90); k.pose('joy'); return k; }); return; }
        lineUp(); kidsR = kids;
      };
      const acts = {
        set(k) { if (rI()) { build(k); return; } return T.sceneCard('', () => build(k)); },
        cam() { const bk = { paw: 'house', hide: 'house', tree: 'tree', belly: 'tree' }[key]; const c = (bk && CAMW[bk]) || [500, 280]; T.camSnap(c[0], c[1], 1); },
        mama(op, a1) {
          if (op === 'at') {
            const [x, y] = nums(a1);
            if (key === 'kitchen') M = mama(T, 330, 478);
            else if (key === 'messy') M = mama(T, -100, 520, 280, 'surprise');
            else if (key === 'tree') M = mama(T, -100, 530, 270, 'scissors');
            else if (key === 'belly') M = mama(T, BELLY[0] + 6, 548, 270, 'scissors');
            else if (key === 'together') M = mama(T, 500, 470, 260, 'dance');
            else M = mama(T, x, y);
            return;
          }
          if (!M) return;
          if (op === 'pose') { M.pose(a1 === 'joy' ? 'dance' : a1); return; } // 엄마 염소에는 기뻐하는 그림이 따로 없어 춤 자세로
          if (op === 'walk') {
            const [x, y] = nums(a1);
            if (key === 'kitchen') return M.move(1120, 478, 2600);
            if (key === 'messy') return M.move(340, 520, 1400);
            if (key === 'tree') return Promise.all([M.move(400, 532, 1600), K7 ? K7.move(500, 540, 1600) : null]);
            if (key === 'belly') return Promise.all([M.move(250, 535, 800), K7 ? K7.move(345, 545, 800) : null]);
            return M.move(x, y, 1200);
          }
        },
        kids(op) {
          if (op === 'lineup') { mkKids(); return; }
          if (op === 'hop') { if (rI()) return; hopAll(kidsR, key === 'inside_door' ? 18 : 24); if (key === 'kitchen') AudioFX.jingle(); return; }
          if (op === 'hide') { // 이불 속·빨래 바구니 속으로
            return Promise.all(kidsR.slice(0, 6).map((k, i) => sleep(i * 120).then(async () => { const x = i < 3 ? QX : LX; k.look(k.x < x ? 'right' : 'left'); await k.move(x, 520, 600); hide(k); })));
          }
          if (op === 'dance') { hopAll(kidsR, 34); if (M) M.hop(30, 400); T.confetti(); AudioFX.sting('win'); return; }
        },
        kid7(op, a1) {
          if (op === 'at') {
            if (key === 'messy') { K7 = kid(T, 7, 90, 490, 90); hide(K7); return; }
            if (key === 'tree') { K7 = kid(T, 7, -60, 535, 90); K7.pose('base'); K7.look('right'); return; }
            if (key === 'belly') { K7 = kid(T, 7, 500, 540, 90); K7.pose('base'); K7.look('right'); return; }
            return;
          }
          const k = key === 'hide' ? kidsR[6] : K7;
          if (!k) return;
          if (op === 'pose') { k.pose(a1); return; }
          if (op === 'walk') {
            if (key === 'hide') return k.move(CX, 480, 700); // 시계 앞으로
            const [x, y] = nums(a1);
            if (key === 'messy') return k.move(480, 530, 700);
            if (key === 'tree') return null; // 엄마와 함께 걷는다 (mama:walk)
            return k.move(x, y, 700);
          }
        },
        wolf(op, a1, a2) {
          if (op === 'show') {
            if (a1 === 'chalk') { W = wolf(T, 500, 520, ['chalk', 'knock'], 'chalk'); return; }
            if (a1 === 'knock') { if (W) appear(W); return; }
            if (a1 === 'belly') return;
            if (a1 === 'heavy') { W = wolf(T, 260, 520, ['heavy', 'splash'], 'heavy'); W.face('right'); return; }
            if (a1 === 'splash') { if (W) { W.pose('splash'); W.face('left'); } return; } // 우물 속으로는 walk(y<500) 에서
            if (a1 === 'flee') { if (W) W.pos.remove(); if (wellF) { wellF.remove(); wellF = null; } W = wolf(T, 790, 520, ['flee'], 'flee'); return; }
            return;
          }
          if (op === 'hide') { if (W && key !== 'tree' && key !== 'belly') hide(W); return; }
          if (op === 'at') { return; } // 자리는 놀이판 그대로(show/set 이 놓는다)
          if (!W) return;
          if (op === 'walk') {
            const [x, y] = nums(a1);
            if (key === 'door') { W.pose('knock'); return W.move(575, 515, 700).then(() => { knock(); [['♪', '#7B4F8C', 470, 250], ['✦', '#D9A94E', 520, 205], ['♫', '#E8703A', 430, 215], ['✦', '#3E7CB1', 560, 265]].forEach(([c, col, fx, fy], i) => floaty(T, fx, fy, c, col, 40, i * 260)); }); }
            if (key === 'hide') {
              if (x <= 250) { // 문으로 들어와 놀라게 한다 → 아기 염소들이 방 곳곳으로
                const SCATTER = [[285, 505], [390, 552], [455, 470], [600, 548], [640, 470], [880, 388], [930, 545]], LOOK = ['left', 'right', 'left', 'right', 'left', 'left', 'right'];
                sting('surprise'); T.pop(520, 200, '꺄악!');
                kidsR.forEach((k, i) => sleep(i * 70).then(() => { k.look(LOOK[i]); k.hop(26, 360); k.move(SCATTER[i][0], SCATTER[i][1], 650); }));
                if (P) T.camTo(520, 280, 1, 700);
                return W.move(175, 455, 900);
              }
              return W.move(420, 540, 1600);
            }
            if (key === 'well' || key === 'together') {
              if (y < 500) return wellSplash(T, W).then(f => { wellF = f; });
              if (x < 800 && x > 500) { T.camTo(700, 280, 1, 2600); return W.move(700, 520, 2600); }
              return W.move(x, y, 1500);
            }
            return W.move(x, y, 900);
          }
        },
        paw(op) { // 문 밑 틈으로 하얀 발이 쑥
          if (op !== 'show' || !paw) return;
          paw.move(95, 372, 800, 'ease-out').then(() => { T.pop(200, 250, '쑥!'); AudioFX.tap(); [[50, 455], [140, 470], [95, 490], [180, 445]].forEach(([x, y], i) => floaty(T, x, y, '•', '#FFFFFF', 34, i * 120)); });
        },
        door(op) { if (op === 'open' && doorway) { doorway.setAttribute('opacity', 1); AudioFX.sfx('door', .8); } },
        quilt(op) { if (quilt) quilt.hop(10, 260); },
        laundry(op) { if (laundry) laundry.hop(10, 260); },
        clock(op) {
          if (!clk) return;
          if (op === 'open') {
            if (key === 'messy') { // 시계 속에서 막내가 폴짝
              return (async () => {
                if (P) await T.camTo(220, 280, 1, 800);
                clk.pose('open'); if (K7) appear(K7); AudioFX.ding();
                if (P) T.camTo(500, 280, 1, 700);
              })();
            }
            clk.pose('open'); const k = kidsR[6];
            if (k) return k.move(CX, 430, 700).then(() => hide(k));
            return;
          }
          if (op === 'close') { clk.pose('a'); if (key === 'messy' && K7) { K7.pose('joy'); } }
        },
        belly(op, n) {
          if (op !== 'pop') return;
          const LAND = [[440, 552], [520, 515], [470, 488], [600, 556], [800, 556], [880, 545]];
          kidsR = [1, 2, 3, 4, 5, 6].map(q => { const k = kid(T, q, BELLY[0], BELLY[1] + 40, 90); hide(k); k.pos.style.pointerEvents = 'none'; return k; });
          return (async () => {
            for (let i = 1; i <= +n; i++) {
              const k = kidsR[i - 1], [x, y] = LAND[i - 1]; appear(k); k.pose('joy'); k.look(x < BELLY[0] ? 'left' : 'right');
              k.hop(110, 640); k.move(x, y, 640); sting('surprise'); T.pop(BELLY[0] + (i % 2 ? -50 : 50), 270, '뿅!');
              if (W) W.wiggle(3, 300);
              await sleep(450);
            }
            if (K7) { K7.pose('joy'); kidsR.push(K7); }
            popped = true;
          })();
        },
        stone(op) { // 돌멩이를 늑대 배에 쏙쏙 (엄마가 배를 가린다)
          if (op !== 'drop') return;
          if (M) M.move(BELLY[0] + 6, 548, 800);
          stoneP = prop(T, 'wg_stone', 520, 548, 90);
          (async () => {
            for (let i = 1; i <= 3; i++) {
              await stoneP.move(BELLY[0] - 40, 480, 380); hide(stoneP); T.pop(BELLY[0], 250, '쏙!'); AudioFX.tap(); await sleep(300);
              if (i < 3) { stoneP.place(520, 548); appear(stoneP); }
              await sleep(300);
            }
          })();
        },
        needle(op) { snoreOn = false; return cutArt(T, 'wg_cut_stitch', 'magic'); },
        cut(k) {
          const C = { keyhole: ['wg_cut_keyhole', 'surprise'], chalk: ['wg_cut_chalk', 'laugh'], flour: ['wg_cut_flour', 'laugh'], enter: ['wg_cut_enter', 'bigHit'], gulp: ['wg_cut_belly', null], splash: ['wg_cut_splash', 'splash'] }[k];
          if (!C) return;
          if (k === 'gulp') { if (W) W.hop(30, 420); if (quilt) quilt.hop(14, 300); if (laundry) laundry.hop(14, 300); AudioFX.sfx('gulp'); }
          return cutArt(T, C[0], C[1]);
        },
        fx(n) {
          if (n === 'knock') { knock(); if (key === 'inside_door') T.shake(); }
          else if (n === 'ding') { AudioFX.ding && AudioFX.ding(); if (key === 'paw' && kidsR.length) hopAll(kidsR, 22); }
          else if (n === 'splash') AudioFX.sfx('splash');
          else if (n === 'snore') { floaty(T, 560, 340, 'z', '#3F6B4F', 34); floaty(T, 585, 305, 'Z', '#3F6B4F', 44, 500); }
          else if (n === 'snip') { AudioFX.tap(); if (M) { M.hop(10, 240); sleep(320).then(() => { M.hop(10, 240); AudioFX.tap(); }); } }
          else if (n === 'pop') { if (key === 'belly' && popped) { hopAll(kidsR, 30); AudioFX.sting('win'); } else AudioFX.tap(); }
          else AudioFX.tap();
        },
        pop(spec) {
          const a = String(spec).split(','), txt = a.slice(2).join(',');
          if (key === 'door' && txt === '와작!' && W) { W.hop(14, 240); AudioFX.sfx('crunch'); }
          T.pop(+a[0], +a[1], txt, /쿨쿨/.test(txt) ? '#3F6B4F' : undefined);
        },
      };
      return acts;
    })();
    /* 읽어 주기 효과음 동사 (2026-10-28 사용자 결정: 놀이판과 같은 효과음). 대본 before/after 에 sfx:이름:음량, sfxs:이름들:간격ms:음량 으로 넣는다.
       기다리지 않고(null 반환), 실패해도 낭독을 막지 않는다. 낭독 전에 장면이 순식간에 놓이는 중(readInstant)에는 울리지 않는다. */
    if (READ_ACTS && typeof READ_ACTS === 'object') {
      READ_ACTS.sfx = (n, v) => { try { if (!T.readInstant()) AudioFX.sfx(n, +v || .55); } catch (e) { /* 무시 */ } return null; };
      READ_ACTS.finale = () => { try { if (!T.readInstant()) finaleMusic(); } catch (e) { /* 무시 */ } return null; }; // 맨 끝 축하 음악(2026-10-31 사용자)
      READ_ACTS.sfxs = (list, step, v) => { try { if (T.readInstant()) return null; String(list).split(',').forEach((n, i) => setTimeout(() => { try { AudioFX.sfx(n, +v || .55); } catch (e) { /* 무시 */ } }, i * (+step || 260))); } catch (e) { /* 무시 */ } return null; };
    }
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) { const rr = await T.readPlay(READ_ACTS); await finaleWait(); stopAmb(.5); return rr; }

    /* --- 1. 부엌 --- */
    bg(T, 'kitchen');
    const mm = mama(T, 330, 478); lineUp();
    await T.curtain(true);
    intro.go(); // 시작 음악 (놀이)
    await say('아주 먼 옛날, 엄마 염소와 일곱 마리 아기 염소가 살았어요.');
    await hopAll(kids); AudioFX.jingle();
    await say('어느 날, 엄마 염소가 바구니를 들고 말했어요.');
    await say('"엄마는 풀을 뜯으러 다녀올게. 늑대가 오면 문을 열어 주면 안 돼!"');
    await sleep(500);   /* 2026-10-22: 이유 없는 엄마 염소 톡을 뺌. 엄마는 저절로 당부한다 */
    mm.pose('warn'); mm.hop(14, 300);
    await say('"늑대는 목소리가 굵고 거칠고, 발이 시커멓단다. 꼭 기억해!"');
    await say('"네, 엄마!" 아기 염소들이 큰 소리로 대답했어요.');
    await hopAll(kids); mm.pose('basket');
    await mm.move(1120, 478, 2600);
    sfx('door_heavy_1', .5); // 엄마가 나가며 문이 닫힌다

    /* --- 2. 문 안쪽: 똑똑똑 --- */
    await scene('똑똑똑!', () => { bg(T, 'inside_door'); lineUp(); });
    await say('엄마가 가고 얼마 뒤, 문밖에서 소리가 났어요.');
    knock(); T.pop(500, 200, '똑똑똑!'); T.shake();
    await sleep(900);
    await say('"얘들아, 엄마야. 문 열어 줘!" 굵고 거친 목소리였어요.');
    await cutArt(T, 'wg_cut_keyhole', 'surprise'); // 2026-10-22: 열쇠 구멍에 늑대 눈 하나만, 아기 염소들은 숨죽여 듣는다(늑대 한 마리). 옛 wg_cut_voice 는 늑대가 둘로 보여 뺐다
    await say('아기 염소들이 서로 쳐다보았어요.');
    await sleep(500);
    kids[0].hop(20, 320);
    await say('"목소리가 굵고 거칠어. 우리 엄마가 아니야!" 첫째가 말했어요.');
    await say('"저리 가요, 늑대!" 아기 염소들이 소리쳤어요.');
    await hopAll(kids, 18);

    /* --- 3. 분필 먹은 늑대 --- */
    await scene('분필 먹은 늑대', () => { bg(T, 'door'); });
    const wc = wolf(T, 500, 520, ['chalk', 'knock'], 'chalk');
    await say('늑대는 곰곰이 생각했어요.');
    await say('"목소리를 곱게 만들어야지. 분필을 먹어 볼까?"');
    const chalk = i => { wc.hop(14, 240); T.pop(500 + (i % 2 ? 60 : -60), 170, '와작!'); AudioFX.sfx('crunch'); };
    await T.tap(wc.pos, { prompt: '늑대를 톡! 눌러 봐요!' }); // 한 번 누르면 나머지는 저절로 (2026-10-19)
    for (let i = 1; i <= 3; i++) { await chalk(i); await sleep(500); }
    await cutArt(T, 'wg_cut_chalk', 'laugh');
    sfx('ding_glock', .5);
    await say('늑대의 목소리가 가늘고 고와졌어요.');
    /* 2026-10-22: 분필을 다 먹었으니 문 앞에서 다정한 척 서서 말한다(분필 자세 그대로 말하지 않게). 고운 목소리는 음표·반짝이로 */
    wc.pose('knock'); await wc.move(575, 515, 700);
    knock(); T.pop(470, 200, '똑똑똑!');
    await sleep(800);
    [['♪', '#7B4F8C', 470, 250], ['✦', '#D9A94E', 520, 205], ['♫', '#E8703A', 430, 215], ['✦', '#3E7CB1', 560, 265]].forEach(([c, col, x, y], i) => floaty(T, x, y, c, col, 40, i * 260));
    await say('"얘들아, 엄마야. 문 열어 줘~"');
    await say('"그럼 문틈으로 발을 보여 주세요!" 아기 염소들이 말했어요.');

    /* --- 4. 집 안: 문 밑으로 하얀 발 (2026-10-22: 커다란 창문 배경 대신 집 안. 문 밑 틈으로 밀가루 발만 쑥, 늑대 몸은 문밖) --- */
    await scene('하얀 발', () => { bg(T, 'house'); });
    T.el('rect', { x: 6, y: 369, width: 178, height: 8, rx: 2, fill: '#4A3424' }, T.world); // 문 밑 틈
    const clipId = 'wgPawClip';
    const cp = T.el('clipPath', { id: clipId }, T.world); T.el('rect', { x: -20, y: 374, width: 240, height: 200 }, cp);
    const pawHolder = T.el('g', { 'clip-path': `url(#${clipId})` }, T.world);
    const paw = T.actor(pawHolder, 95, 290, g => { // 밀가루 묻은 하얀 발(그림 wg_paw, 발바닥이 아래로 오게 돌림)
      const w = T.el('g', { transform: 'translate(0 45) rotate(55)' }, g);
      T.el('image', { href: A('wg_paw'), x: -131, y: -91, width: 170, height: 146 }, w);
    });
    kids = PAW_SPOTS.map(([x, y], i) => { const k = kid(T, i + 1, x, y, 85); k.look('left'); return k; }); // 모두 문 쪽을 본다
    if (portrait()) await T.camTo(180, 280, 1, 600); // 세로: 문이 왼쪽 끝이라 문 쪽으로
    sleep(600).then(() => paw.move(95, 372, 800, 'ease-out')).then(() => { // 말하는 동안 문 밑으로 쑥
      T.pop(200, 250, '쑥!'); AudioFX.tap();
      [[50, 455], [140, 470], [95, 490], [180, 445]].forEach(([x, y], i) => floaty(T, x, y, '•', '#FFFFFF', 34, i * 120));
    });
    await say('늑대는 밀가루를 발에 묻혀서, 하얀 발을 쑥 내밀었어요.');
    await sleep(300);
    await cutArt(T, 'wg_cut_flour', 'laugh');
    T.pop(130, 250, '에취!');
    await say('"에취!" 늑대가 밀가루 재채기를 했어요.');
    hopAll(kids, 22);
    await say('"어? 하얀 발이야! 엄마다!" 아기 염소들은 깜빡 속아서 문을 열었어요.');

    /* --- 5. 숨바꼭질 (2026-10-22: 늑대가 왼쪽 문으로 들어오고, 아기 염소들은 방 곳곳으로 흩어진다. 숨을 곳은 서로 떨어지게) --- */
    await scene('숨바꼭질', () => { bg(T, 'house'); });
    amb('clock_tick', { vol: .25, dur: 4 }); // 큰 시계 똑딱
    const QX = 300, LX = 525, CX = 720;
    const quilt = prop(T, 'wg_quilt', QX, 548, 150), laundry = prop(T, 'wg_laundry', LX, 550, 110), clock = figure(T, CX, 445, 330, { a: 'wg_clock', open: 'wg_clock_open' }, 'a'); // 시계는 벽 앞
    const doorway = T.el('g', { opacity: 0 }, T.world); // 열린 문: 바깥 하늘·풀밭 조각과 젖혀진 문짝
    T.el('image', { href: A('wg_door_view'), x: 0, y: 4, width: 186, height: 372, preserveAspectRatio: 'none' }, doorway); // 열린 문 너머 바깥(하늘·풀밭·젖혀진 문짝) 그림 420×840 (2026-10-29, 옛 코드 네모 3장 대신)
    const wk = wolf(T, 100, 420, ['knock'], 'knock'); wk.face('right'); hide(wk);
    kids = PAW_SPOTS.map(([x, y], i) => { const k = kid(T, i + 1, x, y, 85); k.look('left'); return k; });
    if (portrait()) await T.camTo(180, 280, 1, 600);
    doorway.setAttribute('opacity', 1); AudioFX.sfx('door', .8);
    await sleep(300);
    const SCATTER = [[285, 505], [390, 552], [455, 470], [600, 548], [640, 470], [880, 388], [930, 545]]; // 6번째는 탁자 밑
    const LOOK = ['left', 'right', 'left', 'right', 'left', 'left', 'right'];
    appear(wk); await wk.move(175, 455, 900);
    sting('surprise'); T.pop(520, 200, '꺄악!');
    const scatter = Promise.all(kids.map((k, i) => sleep(i * 70).then(() => { k.look(LOOK[i]); k.hop(26, 360); return k.move(SCATTER[i][0], SCATTER[i][1], 650); }))); // 놀라서 방 곳곳으로
    await say('그런데 들어온 건 엄마가 아니라 늑대였어요!');
    await scatter;
    if (portrait()) T.camTo(520, 280, 1, 700); // 세로: 늑대를 보여 준 뒤 흩어진 아기 염소들 쪽으로
    await cutArt(T, 'wg_cut_enter', 'bigHit'); // 문을 열고 들어오는 늑대 한 마리, 아기 염소들이 놀라 흩어짐 (2026-10-22: 옛 wg_cut_dark 는 문 안 늑대 그림자로 늑대가 둘로 보여 새로 그림)
    await say('"숨자, 숨자!" 아기 염소들이 이불 속, 빨래 바구니 속으로 쏙쏙 숨었어요.');
    await Promise.all(kids.slice(0, 6).map((k, i) => sleep(i * 120).then(async () => { const x = i < 3 ? QX : LX; k.look(k.x < x ? 'right' : 'left'); await k.move(x, 520, 600); hide(k); })));
    quilt.hop(10, 260); laundry.hop(10, 260);
    if (portrait()) await T.camTo(820, 280, 1, 700); // 세로: 막내(오른쪽)와 시계가 보이게
    kids[6].look('left');
    sfx('question', .6);
    await T.ask('막내는 어디에 숨을까요?', () => T.tap(kids[6].widen(), { prompt: '막내 염소를 톡 눌러서 시계 속에 숨겨 줘요!' }));
    clock.pose('open');
    await kids[6].move(CX, 430, 700); hide(kids[6]); clock.pose('a'); AudioFX.ding();
    await say('막내는 키 큰 시계 속에 쏙 숨었어요. 아무도 몰랐어요.');
    if (portrait()) T.camTo(420, 280, 1, 900);
    sfx('tiptoe_pizz', .6); // 늑대가 살금살금 뒤진다
    await wk.move(420, 540, 1600);
    await say('"어디 숨었나? 다 찾아낼 테다!" 늑대가 집 안을 뒤졌어요.');
    wk.hop(30, 420); quilt.hop(14, 300); laundry.hop(14, 300); sfx('zip_away', .6); // 꿀꺽 대신 만화 소리 (2026-10-28)
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

    /* --- 7. 나무 아래 늑대 (2026-10-22: 늑대를 서 있는 늑대와 같은 크기로, 오른쪽 큰 나무 밑 그늘에 눕힌다. 머리는 엄마가 오는 왼쪽) --- */
    await scene('나무 아래 늑대', () => { bg(T, 'tree'); });
    const BX = 700, BY = 500, BELLY = [684, 425]; // 늑대 자리와 불룩한 배 가운데
    const wb = wolf(T, BX, BY, ['belly'], 'belly');
    const mm3 = mama(T, 150, 530, 270, 'scissors'); const k7b = kid(T, 7, 260, 535, 90); k7b.pose('base'); k7b.look('right');
    let snoring = true;
    (async () => { while (snoring) { floaty(T, 560, 340, 'z', '#3F6B4F', 34); floaty(T, 585, 305, 'Z', '#3F6B4F', 44, 500); await sleep(2400); } })();
    if (portrait()) await T.camTo(600, 280, 1, 600);
    sfx('sleepy_tuba', .5);
    await say('늑대는 배가 불러서, 나무 아래에서 쿨쿨 자고 있었어요.');
    T.pop(560, 250, '쿨쿨~', '#3F6B4F');
    await Promise.all([mm3.move(400, 532, 1600), k7b.move(500, 540, 1600)]);
    await say('엄마와 막내는 살금살금 다가갔어요.');
    await sleep(500);
    mm3.hop(14, 300);
    await say('"쉿! 늑대가 깨지 않게, 살살 배에서 아기들을 꺼내 줄게."');

    /* --- 8. 늑대 배에서 뿅! (2026-10-22 사용자 결정: 그림자 극장 대신 원작처럼 잠든 늑대 배에서 꺼낸다.
       가위질·가르는 순간은 엄마 몸이 배를 가려 보이지 않게, 피·상처 없음. 아기 염소가 배에서 튀어나오는 모습은 보여 준다) --- */
    await mm3.move(BELLY[0] + 6, 548, 900); // 엄마가 배 앞에 서서 가린다
    k7b.look('right');
    T.pop(BELLY[0], 230, '슥삭!'); sfx('zipper', .7); mm3.hop(10, 240); sleep(320).then(() => { mm3.hop(10, 240); }); // 가위질은 지퍼 소리로
    await say('엄마가 가위로 슥삭슥삭, 늑대 배를 열었어요. 늑대는 쿨쿨 자고 있었어요.');
    await Promise.all([mm3.move(250, 535, 800), k7b.move(345, 545, 800)]); // 비켜서서 배를 보여 준다
    const LAND = [[440, 552], [520, 515], [470, 488], [600, 556], [800, 556], [880, 545]];
    kids = [1, 2, 3, 4, 5, 6].map(n => { const k = kid(T, n, BELLY[0], BELLY[1] + 40, 90); hide(k); k.pos.style.pointerEvents = 'none'; return k; });
    const hit = T.el('rect', { x: BELLY[0] - 95, y: BELLY[1] - 85, width: 190, height: 150, rx: 40, fill: '#000', 'fill-opacity': 0 }, T.world); // 눌러 볼 늑대 배
    await T.ask('늑대 배를 톡톡 눌러 봐요!', () => T.mash(hit, { count: 6, prompt: '늑대 배를 톡톡 눌러 봐요!', onStep: i => {
      const k = kids[i - 1], [x, y] = LAND[i - 1]; appear(k); k.pose('joy'); k.look(x < BELLY[0] ? 'left' : 'right');
      k.hop(110, 640); k.move(x, y, 640); sfx('marimba_' + i, .6); T.pop(BELLY[0] + (i % 2 ? -50 : 50), 270, '뿅!'); // 한 마리에 한 음
      wb.wiggle(3, 300);
    } }));
    hit.remove();
    kids.push(k7b); k7b.pose('joy');
    await sleep(500);
    await hopAll(kids, 30); AudioFX.sting('win');
    await say('"엄마!" 아기 염소 여섯 마리가 모두 무사히 나왔어요.');
    await say('"이제 늑대 배에 돌멩이를 넣어 주자."');
    await mm3.move(BELLY[0] + 6, 548, 800); // 다시 배 앞에 서서 가린다
    const stone = prop(T, 'wg_stone', 520, 548, 90);
    const drop = async i => { await stone.move(BELLY[0] - 40, 480, 380); hide(stone); T.pop(BELLY[0], 250, '쏙!'); AudioFX.tap(); await sleep(300); if (i < 3) { stone.place(520, 548); appear(stone); } };
    await T.tap(stone.pos, { prompt: '돌멩이를 톡! 눌러 봐요!' }); // 한 번 누르면 나머지는 저절로 (2026-10-19)
    for (let i = 1; i <= 3; i++) { await drop(i); await sleep(400); }
    await cutArt(T, 'wg_cut_stitch', 'magic');
    await say('엄마가 바늘로 콕콕콕 꿰맸어요. 늑대는 아무것도 몰랐어요.');
    snoring = false;

    /* --- 9. 우물 --- */
    await scene('우물가', () => { bg(T, 'well'); });
    const wh = wolf(T, 260, 520, ['heavy', 'splash'], 'heavy'); wh.face('right');
    await say('잠에서 깬 늑대가 비틀비틀 일어났어요.');
    await say('"아이고, 배가 무거워. 목이 말라!"');
    T.camTo(700, 280, 1, 2600);
    await wh.move(700, 520, 2600);
    await say('"우물에서 물을 마셔야지."');
    await sleep(500);
    sfx('whistle_down', .6); // 우물로 쑤욱
    const wellFr = await wellSplash(T, wh);
    await cutArt(T, 'wg_cut_splash', 'splash');
    await say('풍덩! 늑대가 우물에 빠졌어요.');
    wh.pos.remove(); wellFr.remove();
    const wf2 = wolf(T, 790, 520, ['flee'], 'flee');
    sfx('comic_brass', .6);
    await say('"으악, 차가워! 다시는 안 올 거야!"');
    await wf2.move(1250, 520, 1500);
    await say('늑대는 흠뻑 젖은 채 멀리멀리 도망갔어요.');

    /* --- 10. 춤 --- */
    await cutArt(T, 'wg_cut_dance', 'win', 3000);
    await scene('모두 모였어요', () => { bg(T, 'well'); });
    const md = mama(T, 500, 470, 260, 'dance');
    kids = [1, 2, 3, 4, 5, 6, 7].map((n, i) => { const k = kid(T, n, KX(i), 525, 90); k.pose('joy'); return k; });
    T.finale();
    await say('엄마와 일곱 아기 염소는 손을 잡고 신나게 춤을 추었어요.');
    await hopAll(kids, 34); md.hop(30, 400); T.confetti(); finaleMusic(); // 맨 끝 축하 음악(2026-10-31 사용자)
    // 가운데 아기 염소를 톡톡: 누를 때마다 엄마와 아기 염소들이 차례로 폴짝 (자유 놀이 없음)
    const dance = () => { AudioFX.tap(); md.hop(30, 340); kids.forEach((k, j) => setTimeout(() => k.hop(30, 340), j * 70)); };
    await T.ask('아기 염소를 톡! 눌러 같이 춤춰 봐요!', () => T.tap(kids[3].widen(), { prompt: '아기 염소를 톡! 눌러 같이 춤춰 봐요!' })); // 한 번 누르면 나머지는 저절로
    for (let i = 1; i <= 3; i++) { dance(); await sleep(700); }
    await sleep(700);
    await say('엄마 목소리를 잘 아는 아기 염소들은 오래오래 행복하게 살았답니다.');
    await finaleWait();
    stopAmb(.8);
    return '엄마 목소리를 잘 기억해요!';
  }

  Tale.mount({ title: '늑대와 일곱 마리 아기 염소', subtitle: '엄마 목소리는 어떤 걸까?', read: true, run: T => run(Tale.api) });
})();
