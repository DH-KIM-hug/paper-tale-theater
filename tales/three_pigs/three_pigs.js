/* 아기 돼지 삼형제 — 목업 (그림 파일은 assets/v3w/tp_*.webp, 낭독 파일 없이 글자만으로 진행) */
(() => {
  const NF = { pig3_base: 'v2', pig3_build: 'v2', pig3_play: 'v2', bricks: 'nf', straw: 'nf', wood: 'nf', cut_splash: '_in', cut_tired: 'v2', cut_crawl: 'v2', bg_brick_out: 'v2' }; // 얼굴 없는/통일한 새 그림(파일 이름 끝 글자)
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
  /* 화려한 다층 재기획(VISUAL_PLAN.md, 2026-10-23): 들판·집터 셋·세 집터 들판은 v2(땅선·집 자리 그대로), 쿵쿵쿵은 해 질 녘 라이트박스(집·문·창·굴뚝 자리 그대로),
     보글보글은 벽난로 불빛 라이트박스, 벽돌 마을은 노을 라이트박스. 가게·벽돌 집 안은 그대로 */
  /* 2026-10-28 사용자 결정(§7-1 빛 예외): 벽난로 불빛은 불 가운데가 밝고 바깥으로 투명해지는 방사형(옛 단색 주황 타원) */
  let glowN = 0;
  function fireGlow(T) {
    const id = 'tpFire' + (++glowN), rg = T.el('radialGradient', { id }, T.world);
    [[0, '#FFE2A0', 1], [.5, '#FFB347', .55], [1, '#FFB347', 0]].forEach(([o, c, a]) => T.el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, rg));
    return T.el('ellipse', { cx: 500, cy: 348, rx: 10, ry: 8, fill: `url(#${id})`, opacity: 0, 'pointer-events': 'none' }, T.world);
  }
  const BGF = { meadow: 'bg_meadow_v2', strawlot: 'bg_strawlot_v2', woodlot: 'bg_woodlot_v2', bricklot: 'bg_bricklot_v3', field: 'bg_field_v2', brick_out: 'lb_brick_dusk_glow', chimney: 'lb_hearth', sunset: 'lb_village_sunset_glow' };   // 2026-10-28 사용자 결정(§7-1 빛 예외): 노을 해 둘레의 단단한 동심원 종이 → 해에서 흐려지는 반투명 햇무리(_glow, 집·문·창·굴뚝·땅선 자리 그대로)
  /* 층 소품(tp_layer_*, 누름 없음): 폭/높이. 중간 층은 T.bg(배우 뒤), 앞 가림 층은 T.fx(배우 위, pointer-events none). (cx, y) = 가운데·발끝, top 이면 윗변 */
  const LASP = { wheat_front: 1.0017, fern_front: 1.0533, poppies_mid: 4.2857, cherry_branch: .8883, sil_cypress: .3933 };
  const NUM = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  const GROUND = 480;

  async function run(T) {
    /* 시작 음악 (2026-10-28): 첫 장면 시작에 12초 깔고, 첫 장면 전환에서 끈다. 읽어 주기는 음량 .25 */
    const intro = (() => {
      let h = null, on = true;
      const stop = () => { on = false; try { h && h.stop(.8); h = null; } catch (e) { /* 무시 */ } };
      const go = (delay = 0) => {
        const f = () => { try { if (!on) return; const o = { vol: T.reading() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }; h = AudioFX.ambient('intro_playful', o); if (!h) setTimeout(() => { try { if (on) h = AudioFX.ambient('intro_playful', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
        if (delay) setTimeout(f, delay); else f();
      };
      try { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stop(); return sc0.apply(this, a); }; } catch (e) { /* 무시 */ }
      return { go, stop };
    })();
    const say = T.say, sleep = T.sleep, tr = T.tr;
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const portrait = () => T.viewWidth() < 990;
    const look = (x, dur = 700) => T.camTo(x, 280, 1, dur);
    const sfx = (n, v) => { try { return AudioFX.sfx(n, v); } catch (e) { return false; } }; // 소리 없이도 진행
    const raf = () => new Promise(r => requestAnimationFrame(r));
    /* 효과음 (2026-10-28): 시간·장소 단서만 실제 소리, 나머지는 만화·악기 소리. 읽어 주기에서는 부드러운 배경 소리만(vol ≤ .2, dur ≤ 4) */
    const amb = (n, o) => { try { return AudioFX.ambient(n, o); } catch (e) { return null; } };
    const stopAmb = f => { try { AudioFX.stopAmbient(f); } catch (e) { /* 무시 */ } };
    try { AudioFX.preloadSfx(['intro_playful', 'level_win', 'birds_chirp_1', 'rustle_1', 'pot_boil', 'toy_flute', 'question', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'marimba_6', 'marimba_7', 'marimba_8', 'marimba_note', 'chop', 'ding_glock', 'tiptoe_pizz', 'fall_crash', 'sad_trombone', 'latch_click', 'knock', 'comic_brass', 'zip_away', 'party_horn', 'pop_appear', 'drumroll_crash', 'blow', 'pop', 'thud', 'ding', 'boom', 'pig_flute', 'pig_violin', 'drum', 'rustle_2', 'hammer']); AudioFX.preloadMusic(['pigs_band']); } catch (e) { /* 무시 */ }
    /* 집 짓기 숫자 목소리 (2026-10-28 사용자 요청): 같은 내레이터의 공용 숫자 클립(audio/el/count) */
    if (typeof NARRATION_CLIPS !== 'undefined') NUM.forEach((n, i) => { NARRATION_CLIPS[n] = NARRATION_CLIPS[n] || `audio/el/count/ko_${i + 1}.mp3`; });
    if (typeof NARRATION_CLIPS_EN !== 'undefined') NUM.forEach((n, i) => { NARRATION_CLIPS_EN[n] = NARRATION_CLIPS_EN[n] || { t: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][i], c: `audio/el/count/en_${i + 1}.mp3` }; });
    const MAT = { straw: ['rustle_1', 'rustle_2'], wood: ['hammer'], brick: ['thud'] }; // 쌓을 때 재료 소리
    { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stopAmb(.5); return sc0.apply(this, a); }; } // 장면이 바뀌면 배경 소리를 끈다

    const still = () => T.reading && T.reading() && T.readInstant && T.readInstant();
    function layer(k, cx, y, h, { front = false, flip = false, top = false } = {}) {
      const w = h * LASP[k], g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
      const inner = T.el('g', { filter: 'url(#pp)' }, g);
      if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
      T.el('image', { href: `../../assets/v3w/tp_layer_${k}.webp`, x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, inner);
      inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = top ? '50% 0%' : '50% 100%';
      return inner;
    }
    const sway = (g, deg, ms, delay = 0) => { if (!still()) g.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }], { duration: ms, delay, iterations: Infinity, easing: 'ease-in-out' }); return g; };
    function dress(key) {
      if (key === 'meadow') [250, 750].forEach((x, i) => layer('poppies_mid', x, 590, 60, { flip: !!i }));
      if (key === 'shop') sway(layer('cherry_branch', 40, -24, 180, { front: true, top: true, flip: true }), 1, 8000);
      if (key === 'strawlot') sway(layer('wheat_front', 40, 592, 120, { front: true }), 1.2, 5000);   // 집터는 오른쪽에 집이 오므로 왼쪽만
      if (key === 'woodlot') layer('fern_front', 40, 592, 120, { front: true });
      if (key === 'brick_out') { layer('sil_cypress', 20, 600, 300, { front: true }); layer('sil_cypress', 985, 600, 300, { front: true, flip: true }); }
    }
    function bg(key) {
      T.bg.innerHTML = ''; T.world.innerHTML = ''; T.fx.innerHTML = '';
      T.el('image', { href: BGF[key] ? `../../assets/v3w/tp_${BGF[key]}.webp` : U('bg_' + key), x: BG.x, y: BG.y, width: BG.w, height: BG.h, preserveAspectRatio: 'none' }, T.bg);
      dress(key);
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

    /* ================= 읽어 주기 (docs/READ_MODE.md): 대본 read_script_el.json 의 동사 → 놀이판 연출을 감싼 얇은 함수 =================
       장면 자리·크기는 놀이판 그 장면 그대로(대본 좌표는 놀이판 그림과 맞지 않아 쓰지 않는다). 세로 화면은 meadow·shop·sunset 만 카메라를 물려 넓게 본다. */
    const READ_ACTS = (() => {
      const P = portrait();
      const KIND = {
        straw: { n: 1, build: 'pig1_build', play: 'pig1_play', pigH: 245, playH: 245, pile: 'straw', pileH: 95, house: 'house_straw', ruin: 'house_straw_ruin', taps: 3, tick: 'pop', cut: 'cut_strawhat' },
        wood: { n: 2, build: 'pig2_build', play: 'pig2_play', pigH: 230, playH: 214, pile: 'wood', pileH: 100, house: 'house_wood', ruin: 'house_wood_ruin', taps: 5, tick: 'chop', cut: 'cut_planks' },
        brick: { n: 3, build: 'pig3_build', play: 'pig3_play', pigH: 215, playH: 215, pile: 'bricks', pileH: 140, house: 'house_brick', taps: 10, tick: 'thud' },
      };
      const LOT = { strawlot: 'straw', woodlot: 'wood', bricklot: 'brick' };
      const rPIECE = { straw: [40, 41], wood: [50, 41], brick: [36, 20] };
      const hx = P ? 640 : 700, hy = P ? 420 : GROUND, houseH = P ? 310 : 390;
      const BL = P ? { pigX: 560, pigY: 548, pigS: .85, pileX: 735, pileY: 556 } : { pigX: 160, pigY: GROUND, pigS: 1, pileX: 385, pileY: 490 };
      let key = '', mode = '', kind = '', seen = {}, A = {}, house = null, stages = [], pile = null, glow = null, vh = [], vstages = [], vchain = Promise.resolve();
      const rI = () => T.readInstant();
      const nums = s => String(s).split(',').map(Number);
      const CAMP = { meadow: [490, 280, .62], shop: [500, 280, .62], sunset: [500, 280, .55], strawlot: [hx, 280, 1], woodlot: [hx, 280, 1], bricklot: [hx, 280, 1], brick_in: [450, 280, 1], brick_out: [450, 280, 1] };
      const camGo = (a, y, z) => { const c = P && CAMP[key] ? CAMP[key] : [a, y, z]; T.camSnap(c[0], c[1], c[2]); };
      const popAt = (x, y, w) => { if (P) { const c = T.camera, h = T.viewWidth() / 2 / (c.z || 1) - 40; x = Math.min(Math.max(x, c.x - h), c.x + h); } T.pop(x, y, w); };
      const reveal = async (a, ms = 380) => {
        a.show(true);
        const im = a.pos.querySelector('image');
        const an = im.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { duration: ms, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'forwards' });
        try { await an.finished; } catch (e) { /* 취소 */ }
        try { an.cancel(); } catch (e) { /* 이미 끝남 */ }
      };
      const dropPieces = (k, x0, y0, x1, y1, n = 3) => {
        const [w, h] = rPIECE[k];
        for (let i = 0; i < n; i++) {
          const g = T.el('g', {}, T.world); g.style.pointerEvents = 'none';
          T.el('image', { href: `../../assets/v3w/tp_chip_${k}.webp`, x: -w / 2, y: -h / 2, width: w, height: h }, g);
          const tx = x1 + (i - (n - 1) / 2) * 38, ty = y1 + (i % 2) * 8, mx = (x0 + tx) / 2, my = Math.min(y0, ty) - 90, rot = (i % 2 ? 1 : -1) * (14 + i * 6);
          g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
          const an = g.animate([
            { transform: `translate(${x0}px,${y0}px) rotate(0deg)`, offset: 0 },
            { transform: `translate(${mx}px,${my}px) rotate(${rot}deg)`, offset: .5 },
            { transform: `translate(${tx}px,${ty}px) rotate(${rot / 3}deg)`, offset: .86 },
            { transform: `translate(${tx}px,${ty}px) rotate(${rot / 3}deg) scale(1.3,.8)`, offset: .93 },
            { transform: `translate(${tx}px,${ty}px) rotate(${rot / 3}deg)`, opacity: 1, offset: 1 }], { duration: 520 + i * 70, delay: i * 90, easing: 'ease-in', fill: 'forwards' });
          an.finished.then(() => g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' }).finished).then(() => g.remove()).catch(() => g.remove());
        }
      };
      const stageSprites = async (k, x, h, y) => {
        const ok = await Promise.all([1, 2, 3].map(i => T.preload(U(`tp2_${k}_s${i}`))));
        return ok.every(Boolean) ? [1, 2, 3].map(i => { const s = sprite(`tp2_${k}_s${i}`, x, h, y); s.show(false); s.pos.style.pointerEvents = 'none'; return s; }) : [];
      };
      const mkHouse = (k, x, h, y) => { const c = KIND[k]; const hs = sprite(c.house, x, h, y); hs.pos.style.pointerEvents = 'none'; return hs; };
      const build = k => {
        key = k; A = {}; house = null; stages = []; pile = null; glow = null;
        { const ra = { meadow: ['birds_chirp_1', .15], strawlot: ['rustle_1', .15], chimney: ['pot_boil', .15] }[k]; if (ra && !amb(ra[0], { vol: ra[1], dur: 4, fadeIn: 1 })) setTimeout(() => { if (key === k) amb(ra[0], { vol: ra[1], dur: 3, fadeIn: 1 }); }, 1500); }
        seen[k] = (seen[k] || 0) + 1;
        bg(k === 'strawlot' || k === 'woodlot' || k === 'bricklot' ? k : k);
        camGo(500, 280, 1);
        kind = LOT[k] || '';
        mode = kind ? (seen[k] === 1 ? 'build' : 'blow') : '';
        if (k === 'shop') {
          A.fan = sprite('fan', 90, 190); A.mats = [sprite('straw', 310, 95), sprite('wood', 520, 105), sprite('bricks', 720, 150)];
          A.mats.forEach(m => { m.pos.style.pointerEvents = 'none'; });
          if (P) A.fan.show(false);
        }
        if (mode === 'build') {
          (async () => {
            stages = await stageSprites(kind, hx, houseH, hy);
          })();
          house = sprite(KIND[kind].house, hx, houseH, hy); house.show(false); house.pos.style.pointerEvents = 'none';
        }
        if (mode === 'blow') { house = sprite(KIND[kind].house, hx, houseH, hy); house.pos.style.pointerEvents = 'none'; }
        if (k === 'chimney') {
          glow = fireGlow(T);
        }
        if (k === 'sunset') {
          const hxs = P ? [500, 230, 770] : [500, 200, 800], vhh = P ? 230 : 270;
          vh = hxs.map(x => { const hs = sprite('house_brick', x, vhh); hs.show(false); hs.pos.style.pointerEvents = 'none'; return hs; });
          vstages = [];
          hxs.forEach((x, i) => { stageSprites('brick', x, vhh, GROUND).then(st => { vstages[i] = st; }); });
        }
      };
      const pigIdx = n => +n.replace('pig', '') - 1;
      const pigAt = (n, x) => {
        const i = pigIdx(n), nm = n;
        let a;
        if (key === 'meadow') a = sprite(nm + '_base', [500, 650, 800][i], 215);
        else if (mode === 'build') { const c = KIND[kind]; a = sprite(c.build, BL.pigX, c.pigH * BL.pigS, BL.pigY); }
        else if (mode === 'blow') a = sprite(nm + '_base', hx - (P ? 50 : 70) + (n === 'pig1' ? 0 : 1) * (P ? 100 : 140), P ? 150 : 215, hy + (P ? 20 : 0));
        else if (key === 'brick_in') a = sprite(nm + '_base', [300, 440, 580][i], 210);
        else if (key === 'chimney' || key === 'sunset') a = sprite(nm + '_base', [380, 500, 620][i], 140, 548);
        else if (key === 'shop') { if (P) return null; a = sprite(nm + '_base', [95, 195, 295][i], 215, 548); }
        else a = sprite(nm + '_base', x, 215);
        if (key === 'bricklot' && x >= 600) { a.place(n === 'pig1' ? 540 : 880, 548); } // 셋째를 놀리러 온 형들
        a.pos.style.pointerEvents = 'none';
        return a;
      };
      const wolfAt = () => {
        let w;
        if (key === 'brick_out') { w = sprite('wolf_puff', 230, 210); w.face('right'); }
        else { const wh = P ? 170 : 230; w = sprite('wolf_sniff', -160, wh, P ? 548 : GROUND); w.face('right'); w.wh = wh; }
        w.pos.style.pointerEvents = 'none';
        return w;
      };
      const SETN = (n, x) => {
        if (/^pig/.test(n)) return null;
      };
      const actorVerb = n => (op, spec) => {
        if (op === 'at') {
          if (A[n] && A[n].pos.isConnected) A[n].pos.remove();
          let a = null;
          if (n === 'mom') { a = sprite('mama', P ? 230 : 230, 300); }
          else if (n === 'wolf') a = wolfAt();
          else { const x = nums(spec)[0]; a = pigAt(n, x); }
          if (a) { a._n = n; A[n] = a; }
          return;
        }
        const a = A[n]; if (!a) return;
        if (op === 'hide') { a.show(false); return; }
        if (op === 'hop') { a.hop(36); sfx('pop'); return; }
        if (op === 'walk') {
          const [x, y = a.y] = nums(spec);
          if (n === 'wolf') { sfx('step_grass'); const wx = P ? 560 : 330; const p = a.move(x > 1000 ? 1200 : wx, a.y, x > 1000 ? 1100 : 1300); return p.then(async () => { await sleep(500); a.wiggle(5, 500); }); }
          if (/^pig/.test(n) && key === 'meadow') { a.set(n + '_base'); const pr = a.move(x, a.y, 1500); return n === 'pig3' ? pr : null; }
          if (/^pig/.test(n)) return a.move(x, a.y, 1100);
          return a.move(x, y, 900);
        }
        if (op === 'set') {
          if (n === 'wolf') { if (spec === 'blow') a.set('wolf_puff', a.wh || 230); else if (spec === 'tired') { a.set('wolf_tired', 230); } return; }
          const c = KIND[kind];
          if (spec === 'build') return;
          if (spec === 'play') { const kk = Object.values(KIND).find(v => v.n === pigIdx(n) + 1); if (kk) a.set(kk.play, kk.playH * (P ? .85 : 1)); return; }
          if (spec === 'flee') { a.set(n + '_flee'); return; }
          if (spec === 'base') a.set(n + '_base');
        }
      };
      const acts = {
        set(k) {
          if (rI()) { build(k); return; }
          return T.sceneCard('', () => build(k));
        },
        cam(a, spec) { if (a === 'snap') { const [x, y, z] = nums(spec); camGo(x, y, z); } else camGo(500, 280, 1); },
        fan(op, what) {
          if (op !== 'blow') return;
          const i = { straw: 0, wood: 1, brick: 2 }[what], m = A.mats && A.mats[i], f = A.fan;
          if (!m) return;
          if (P) T.camTo(m.x - 20, 280, .8, 400);
          if (f && !P) f.move(m.x - 210, GROUND, 500);
          return (async () => {
            await sleep(P ? 300 : 500); sfx('blow'); T.pop(m.x - 60, 330, tr('후우~'));
            if (i === 0) { m.pos.style.transition = 'opacity 1s'; m.pos.style.opacity = 0; m.move(m.x + 650, 250, 1100); }
            else if (i === 1) await m.wiggle(14, 800);
            else await sleep(500);
          })();
        },
        pile(op, what) {
          const c = KIND[what]; if (!c) return;
          if (!pile || !pile.pos.isConnected) pile = sprite(c.pile, BL.pileX, c.pileH * (P ? .85 : 1), BL.pileY);
          pile.pos.style.pointerEvents = 'none';
          const pig = A['pig' + c.n], target = [hx, hy - houseH * .25];
          (async () => { // 말과 동시에 조각들이 집 자리로 (누르기 없이 저절로)
            for (let i = 0; i < c.taps; i++) {
              sfx(c.tick); if (pig) pig.hop(26, 300); pile.wiggle(6, 300);
              dropPieces(what, BL.pileX, BL.pileY - c.pileH * .5, target[0], target[1]);
              await sleep(c.taps > 5 ? 360 : 520);
            }
          })();
        },
        async house(op, what, n2) {
          if (op === 'reveal') {
            if (key === 'brick_out') return;
            const c = KIND[what]; if (!c) return;
            if (!house || !house.pos.isConnected) house = sprite(c.house, hx, houseH, hy);
            house.pos.style.pointerEvents = 'none';
            if (rI()) { house.show(true); return; }
            if (pile) pile.show(false);
            for (const s of stages) { await reveal(s, 300); stages.forEach(o => { if (o !== s) o.show(false); }); s.hop(7, 200); }
            await reveal(house, 380); stages.forEach(o => o.show(false)); house.hop(8, 240); sfx('level_win', .48); T.confetti();
            return;
          }
          if (op === 'ruin') {
            const c = KIND[what]; sfx('boom', .3); T.shake(); // 읽어 주기: 큰 소리는 작게
            if (house) house.set(c.ruin, houseH * .7);
            Object.values(A).forEach(a => { if (/^pig/.test(a._n || '')) a.hop(30, 350); });
            return;
          }
          if (op === 'build') {
            const i = +what - 1;
            vchain = vchain.then(async () => {
              const hs = vh[i]; if (!hs) return;
              const band = A['pig' + (i + 1)];
              if (band) band.hop(24, 300);
              sfx('thud');
              dropPieces('brick', band ? band.x : 500, 480, hs.x, GROUND - (P ? 230 : 270) * .25, 4);
              await sleep(300);
              let prev = null;
              for (const s of (vstages[i] || [])) { await reveal(s, 260); if (prev) prev.show(false); prev = s; }
              await reveal(hs, 300); if (prev) prev.show(false); hs.hop(8, 240); sfx('ding');
            });
          }
        },
        wolf(op, spec) { return actorVerb('wolf')(op, spec); },
        pigs(op, x) {
          if (op !== 'run') return;
          const ps = ['pig1', 'pig2'].map(n => A[n]).filter(Boolean);
          return Promise.all(ps.map((p, i) => p.move(+x, p.y, 1100 + i * 150)));
        },
        fire(op) {
          if (!glow) return;
          (async () => { for (let i = 1; i <= 5; i++) { const p = i / 5; glow.setAttribute('rx', 18 + 62 * p); glow.setAttribute('ry', 14 + 40 * p); glow.setAttribute('opacity', .15 + .5 * p); await sleep(220); } })();
        },
        pot(op) { (async () => { for (let i = 0; i < 4; i++) { T.pop(500 + (Math.random() - .5) * 100, 250, tr('보글')); await sleep(300); } sfx('ding'); })(); },
        cut(k) {
          const HOLD = { strawhat: 3200, planks: 3200, tired: 3200, crawl: 3200, chimney: 2600, splash: 3200, launch: 3400, village: 3600 };
          const SF = { splash: 'splash', launch: 'whoosh' };
          return T.cutImage([{ src: U('cut_' + k), hold: HOLD[k] || 3200, sfx: SF[k] }]);
        },
        fx(n) {
          if (n === 'thud') sfx('thud'); else if (n === 'ding') sfx('ding'); else if (n === 'crash') sfx('crash', .35); else if (n === 'splash') sfx('splash'); else sfx(n === 'whoosh' ? 'whoosh' : 'pop');
        },
        shake() { T.shake(); },
        pop(spec) { const a = String(spec).split(','); popAt(+a[0], +a[1], tr(a.slice(2).join(','))); },
      };
      ['mom', 'pig1', 'pig2', 'pig3'].forEach(n => { acts[n] = actorVerb(n); });
      const wv = actorVerb('wolf');
      acts.wolf = (op, a1, a2) => {
        if (op === 'blow') { // 후~ n 번 (세지 않고 저절로)
          const w = A.wolf; const cnt = +a1;
          return (async () => { for (let i = 0; i < cnt; i++) { sfx('blow'); if (w) w.hop(10, 300); if (house) house.wiggle(5 + Math.min(i, 3) * 4, 450); await sleep(450); } })();
        }
        if (op === 'hide') return;
        return wv(op, a1);
      };
      return acts;
    })();
    /* 읽어 주기 효과음 동사 (2026-10-28 사용자 결정: 놀이판과 같은 효과음). 대본 before/after 에 sfx:이름:음량, sfxs:이름들:간격ms:음량 으로 넣는다.
       기다리지 않고(null 반환), 실패해도 낭독을 막지 않는다. 낭독 전에 장면이 순식간에 놓이는 중(readInstant)에는 울리지 않는다. */
    if (READ_ACTS && typeof READ_ACTS === 'object') {
      READ_ACTS.sfx = (n, v) => { try { if (!T.readInstant()) AudioFX.sfx(n, +v || .55); } catch (e) { /* 무시 */ } return null; };
      READ_ACTS.music = (n, v, d, f) => { try { if (!T.readInstant()) AudioFX.music(n, { vol: +v || .3, dur: +d || undefined, fade: +f || .8 }); } catch (e) { /* 무시 */ } return null; };
      READ_ACTS.sfxs = (list, step, v) => { try { if (T.readInstant()) return null; String(list).split(',').forEach((n, i) => setTimeout(() => { try { AudioFX.sfx(n, +v || .55); } catch (e) { /* 무시 */ } }, i * (+step || 260))); } catch (e) { /* 무시 */ } return null; };
    }
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) return T.readPlay(READ_ACTS);

    /* 1. 엄마 배웅 */
    bg('meadow'); T.camSnap(500, 280, 1);
    const mama = sprite('mama', 230, 300);
    const pigs = [sprite('pig1_base', 500, 215), sprite('pig2_base', 650, 215), sprite('pig3_base', 800, 215)];
    await T.curtain(true);
    intro.go(); // 시작 음악 (놀이)
    await look(300, 300);
    amb('birds_chirp_1', { vol: .25, dur: 4 }); // 풀밭 새소리
    sfx('toy_flute', .5);
    await say('옛날 옛날에 아기 돼지 삼 형제가 살았어요.');
    await say('엄마 돼지가 말했어요. "이제 너희도 다 컸구나. 세상에 나가서 각자 집을 지어 보렴."');
    mama.wiggle(6, 700);   // 아기 돼지 한 마리씩 카메라로 비추며 띄우던 소개는 뺌(2026-10-31 사용자)
    await sleep(500);
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
        sfx('question', .6);
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
    const PIECE = { straw: [40, 41], wood: [50, 41], brick: [36, 20] };
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
      const [w, h] = PIECE[kind];
      for (let i = 0; i < n; i++) {
        const g = T.el('g', {}, T.world); g.style.pointerEvents = 'none';
        T.el('image', { href: `../../assets/v3w/tp_chip_${kind}.webp`, x: -w / 2, y: -h / 2, width: w, height: h }, g);
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
        const mat = MAT[kind] || []; if (mat.length) sfx(mat[(i - 1) % mat.length], .7); else if (tick === 'chop') sfx('chop');
        sfx(i <= 8 ? 'marimba_' + i : 'marimba_note', .45); // 쌓을 때마다 한 음씩 올라간다
        const said = NUM[i - 1] ? Narrator.speak(NUM[i - 1]).catch(() => { /* 소리 실패는 무시 */ }) : null; // 하나, 둘, 셋… (끝까지 듣고 나서야 다음 톡을 받는다)
        pig.hop(26, 300); pile.wiggle(6, 300);
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
        if (said) await Promise.race([said, sleep(2500)]); // 숫자 목소리가 끝나기 전에는 다음 톡이 안 받아진다 (2026-10-28, 사자와 생쥐 그물 세기와 같은 방식)
      };
      const PILE_PROMPT = '쌓을 것을 톡톡 눌러요.';
      for (let i = 1; i <= taps; i++) {
        await T.tap(pile.pos, { prompt: PILE_PROMPT });
        await step(i);
        if (tease && i === tease.at) await say(tease.line);
      }
      pile.show(false);
      pig.set(play, playH * L.pigS); await look(L.houseX);
      sfx('level_win', .6); T.confetti();
      await say(done);
      // 진짜 악기 소리 (2026-10-28): 첫째 피리, 둘째 바이올린, 셋째 북. 못 불러오면 합성음으로 대신
      if (!sfx(kind === 'straw' ? 'pig_flute' : kind === 'wood' ? 'pig_violin' : 'drum', .5)) tune(tick === 'chop' ? [392, 440, 494, 523] : [523, 494, 440, 392]);
      pig.hop(40, 500);
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
      sfx('tiptoe_pizz', .6); // 늑대가 살금살금
      await wolf.wiggle(5, 500);
      await say(lines[0]);
      await say(lines[1]);
      wolf.set('wolf_puff', wh);
      let n = 0;
      await T.mash(house.pos, { count: 3, prompt: '손가락으로 톡톡 눌러서 늑대와 같이 후~ 불어요.', onStep: i => {
        n = i; sfx('blow'); T.pop(P ? hx - 90 : wx + 130, 300, '후~!'); house.wiggle(5 + i * 4, 450); wolf.hop(10, 300);
      } });
      sfx('fall_crash', .8); T.shake(); // 와르르 (놀라지 않게 만화 소리로)
      house.set(ruinKey, houseH * .7);
      pg.forEach(p => { p.show(true); p.hop(30, 350); });
      await say(lines[2]);
      await T.cutImage([{ src: U(cutKey), hold: 2600 }]);
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
    sfx('question', .6);
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
    sfx('latch_click', .7); // 빗장 철컥
    const inside = [sprite('pig1_base', 300, 210), sprite('pig2_base', 440, 210), sprite('pig3_base', 580, 210)];
    await look(440, 200);
    let askG1 = '삼 형제는 모두 모였어요. 하나, 둘, 셋을 세어 볼까요?'; // 안내는 첫 번째 누름에만 (T.ask)
    const askOnce1 = f => { const g = askG1; askG1 = null; return g ? T.ask(g, f) : f(); };
    for (let i = 0; i < 3; i++) {
      await look(inside[i].x);
      await askOnce1(() => T.tap(inside[i].pos, { prompt: '아기 돼지를 톡 눌러요.' }));
      inside[i].hop(36); T.pop(inside[i].x, 260, NUM[i]); sfx('marimba_' + (i + 1), .6);
    }
    await say('"셋이서 함께라서 무섭지 않아!"');
    await T.sceneCard('쿵쿵쿵!', () => { bg('brick_out'); T.camSnap(450, 280, 1); });
    const wolf2 = sprite('wolf_puff', 230, 210);
    wolf2.face('right');
    const wall = hit(420, 190, 270, 290);
    await look(450, 200);
    sfx('knock', .7);
    await say('늑대가 벽돌 집에 왔어요. "아기 돼지야, 문 열어라!"');
    await say('"싫어요, 싫어요!" "그럼 후~ 후~ 불어 주지!"');
    await T.mash(wall, { count: 8, prompt: '집을 톡톡 눌러서 몇 번 부는지 세어 봐요.', onStep: i => {
      sfx(i <= 8 ? 'marimba_' + i : 'marimba_note', .6); T.pop(400, 300, NUM[i - 1]); wolf2.hop(12, 300); // 센 만큼 한 음씩
    } });
    await say('후~ 후~ 여덟 번이나 불었지만 벽돌 집은 끄떡없어요!');
    wolf2.set('wolf_tired', 230); sfx('sad_trombone', .6); // 늑대가 지쳐서 풀썩
    await T.cutImage([{ src: U('cut_tired'), hold: 2600 }]);
    await say('늑대는 숨이 차서 털썩 주저앉았어요.');

    /* 10. 굴뚝 */
    await T.cutImage([{ src: U('cut_crawl'), hold: 2600 }]);
    sfx('tiptoe_pizz', .6);
    await say('늑대는 지붕으로 살금살금 올라갔어요. 굴뚝으로 몰래 들어가려고요.');
    await T.sceneCard('보글보글', () => { bg('chimney'); T.camSnap(500, 280, 1); });
    const fire = hit(425, 290, 150, 100); // 2026-10-20 새 배경: 벽난로 불이 무대 y≈345 (옛 그림은 바닥 근처였다)
    const glow = fireGlow(T);
    amb('pot_boil', { vol: .25, dur: 4 }); // 솥 보글보글
    await say('아기 돼지들은 큰 솥에 물을 팔팔 끓였어요.');
    await T.mash(fire, { count: 5, prompt: '불을 톡톡 눌러서 크게 해 줘요.', onStep: i => {
      const p = i / 5;
      glow.setAttribute('rx', 18 + 62 * p); glow.setAttribute('ry', 14 + 40 * p); glow.setAttribute('opacity', .15 + .5 * p);
      T.pop(500 + (Math.random() - .5) * 100, 250, '보글');
    } });
    sfx('drumroll_crash', .6); // 늑대가 내려오기 전
    await say('보글보글 물이 끓어요! 그때 굴뚝에서 늑대가 쑥 내려왔어요.');
    await T.cutImage([{ src: U('cut_chimney'), hold: 2600 }, { src: U('cut_splash'), hold: 2600, sfx: 'splash' }]);
    sfx('comic_brass', .6);
    await say('"앗, 뜨거워!"');
    await T.cutImage([{ src: U('cut_launch'), hold: 2600, sfx: 'zip_away' }]);
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
      sfx('pop_appear', .6); band.forEach((b, j) => setTimeout(() => b.hop(24, 300), j * 100)); await look(hs[i].x);
      drop('brick', band[i].x, 480, hs[i].x, GROUND - vh * .25, 4);
      let prev = null; await sleep(300);
      for (const s of vstages[i]) { await reveal(s, 260); if (prev) prev.show(false); prev = s; }
      await reveal(hs[i], 300); if (prev) prev.show(false); hs[i].hop(8, 240); T.pop(hs[i].x, 240, NUM[i]); sfx('marimba_' + (i + 1), .6);
    }
    await look(500, 700);
    await say('하나, 둘, 셋! 튼튼한 벽돌 집이 세 채가 되었어요.');
    band.forEach((b, i) => b.set(['pig1_play', 'pig2_play', 'pig3_play'][i], 150));
    T.confetti();
    // 진짜 악기 연주 (2026-10-28): 피리·바이올린·북이 함께 6.4초. 못 불러오면 합성음 4번
    let bandMusic = null; try { bandMusic = AudioFX.music('pigs_band', { vol: .5, dur: 6.4, fade: .8 }); } catch (e) { bandMusic = null; }
    for (let r = 0; r < (bandMusic ? 10 : 4); r++) { if (!bandMusic) tune([392, 523, 440, 587]); band.forEach((b, i) => setTimeout(() => b.hop(28, 350), i * 150)); await sleep(bandMusic ? 640 : 900); }
    await T.cutImage([{ src: U('cut_village'), hold: 2600 }]);
    sfx('party_horn', .6);
    await say('삼 형제는 튼튼한 집에서 오래오래 행복하게 살았어요.');
    stopAmb(.8);
    return '튼튼한 집은 하나씩 정성껏 쌓아서 만들어요!';
  }

  Tale.mount({ title: '아기 돼지 삼형제', subtitle: '튼튼한 집은 어떤 집일까요?', read: true, run: T => run(Tale.api) });
})();
