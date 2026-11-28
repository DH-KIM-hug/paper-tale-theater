/* 크리스마스 전날 밤 — Clement C. Moore, "A Visit from St. Nicholas"(1823, 1844 판본). 기획: tales/night_before/PLAN.md (2026-11-26 확정).
   그림 접두어 nb_ (assets/v3w/nb_*.webp, 2026-11-28 post_tale.py·post_cuts.py 로 변환). 장면 12, 화자는 아빠(1인칭 '나').
   조작(모두 T.ask: 안내와 누르기를 함께 연다): 4장 창문 톡(재미) · 7장 위치말 '위' 고르기 · 9장 같은 색 찾기 ×2 · 10장 위치말 '속' 고르기(하나 누르면 넷 다 저절로) · 12장 썰매 인사 톡.
   읽어 주기: read_script_el.json / read_script_en.json 의 동사(set:n, b:이름, cut:id, music:곡) → 아래 READ_ACTS. 조작 자리는 저절로 진행한다.
   녹음 전(2026-11-28): narration_el.js 가 없으면 말풍선만 읽을 만큼 띄우고 소리 없이 넘어간다(TTS 없음). 읽어 주기도 같은 방식으로 끝까지 간다(RW.say).
   개발용 ?from=1~12 (그 장면부터).
   빛 상자 갈아 끼우기: 아래 BG_YARD / BG_SKY 한 줄만 바꾼다(2026-11-28 사용자 결정: 앞마당 빛 상자 nb_bg_yard_lb 는 합성 결과를 본 뒤 정하므로 지금은 일반 배경).
   크기(CLAUDE.md §4-1): 아빠 서기 DAD = 220 을 기준으로, 자세마다 같은 부위(아빠 = 얼굴 폭, 산타 = 앞쪽 볼 지름, 순록 = 귀 안쪽 길이)를 재서 높이를 맞췄다(HT).
   바깥(5~7, 12장)과 굴뚝 단면 거실(8, 11장)은 배경 속 집과 벽난로가 작게 그려져 있어, 그 장면의 모든 인물과 소품을 같은 비율(K)로 함께 줄인다(멀어 보이는 원근만 허용). */
(() => {
  const BG_YARD = 'nb_bg_yard';      // ← 앞마당 빛 상자가 합성 검수를 통과하면 'nb_bg_yard_lb' 로 바꾼다(5~7장)
  const BG_SKY = 'nb_bg_sky_lb';     // ← 12장 빛 상자판(검수 탈락이면 'nb_bg_sky')
  const AS = '../../assets/v3w/';
  const src = k => AS + k + '.webp';
  const QS = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(''); } })();
  const L = typeof NB_LINES !== 'undefined' ? NB_LINES : {};
  const MORAL = '모두에게 즐거운 크리스마스, 그리고 모두 포근히 잘 자요.';
  const artOK = {};

  /* ---------- 비율(ASP.txt). preload 가 실제 그림 비율로 다시 덮는다 ---------- */
  const ASP = {};
  'santa_stand_pack .7917 deer_stand .9617 mom_sleep 1.9438 kid1_sleep 1.7143 kid2_sleep 1.7208 mouse_sleep 1.115 dad_stand .4067 dad_sleep 1.875 dad_wake 1.2 dad_dash 1.0067 dad_open_window .8017 dad_look_out .4717 dad_window_face .7583 dad_window_up .76 dad_turn .5267 dad_startled .4017 dad_peek .3683 dad_giggle .405 dad_relieved .3783 dad_watch_up .5283 dad_wave .5567 santa_drive .9717 santa_whistle .8233 santa_bound_down .8083 santa_land 1.055 santa_show_pack .7767 santa_laugh .78 santa_wink .8133 santa_fill 1.0633 santa_done .75 santa_finger_nose .8083 santa_rise .7817 santa_jump_sleigh .9233 santa_sleigh_wave 1.1583 deer_prance .6617 deer_run 1.425 deer_fly 1.22 deer_roof .8083 kid1_smile 1.7143 kid2_smile 1.7208 prop_sleigh 1.4917 prop_stocking_red .5883 prop_stocking_green .59 prop_stocking_blue .5883 prop_stocking_yellow .5867 prop_stocking_red_full .6117 prop_stocking_green_full .6167 prop_stocking_blue_full .6 prop_stocking_yellow_full .5867 prop_gift_a .8717 prop_gift_b .87 prop_gift_c .8717 prop_gift_d .8717 prop_shutter_l .5733 prop_shutter_r .575 prop_sash .975 prop_dream_bubble 1.1267 prop_card_cherry .765 prop_card_snowball .7667 prop_card_jelly .765 prop_marker_roof 3.7815 prop_marker_yard 3.7657 prop_marker_wall .3967 prop_marker_sock 3.75 prop_marker_shelf 3.7657 prop_marker_floor 3.7975 prop_ash_cloud 2.9412 prop_leaves 1.495 prop_snow_puff 1.1917 prop_holly 1.3383 prop_candle .7567 prop_lamb_toy 1.41 prop_harness_red 1.0983 prop_harness_green 1.0983 prop_harness_blue 1.0983 prop_harness_marigold 1.0967 prop_harness_plum 1.0983 prop_harness_persimmon 1.0533 prop_harness_lagoon 1.1017 prop_harness_pink 1.0983'
    .split(' ').reduce((k, v, i, a) => { if (i % 2) ASP['nb_' + a[i - 1]] = +v; return k; }, 0);

  /* ---------- 높이(HT, 장면 비율 K=1 기준) ----------
     아빠: 얼굴 폭(그림 px, 높이 600 그림, 누움 480) stand 136 · dash 159 · giggle 134 · look_out 133 · peek 139 · relieved 132 · startled 139 · turn 133 · watch_up 128 · wave 130 ·
           window_face 240 · window_up 224 · sleep 206(높이 480) · wake 179. 덧문 열기(뒷모습)는 얼굴이 1/4만 보여 서기와 같게 둔다.
     산타(아빠의 0.7): 앞쪽 볼 지름(자동 측정 뒤 나란히 놓고 사진으로 고친 값) stand_pack 40 · drive 39 · whistle 40 · bound_down 40 · land 43 · show_pack 40 · laugh 40 · wink 39 · fill 40 · done 39 · finger_nose 38 · rise 38 · jump_sleigh 42 · sleigh_wave 42.
     순록(아빠의 0.42, 뿔 끝까지): 귀 안쪽 길이 stand 81 · roof 78 · prance 73 · run 73 · fly(귀가 접혀 사진으로 견줌) 73.
     엄마 머리 = 아빠 머리, 아이 머리 = 아빠의 0.85(PLAN 크기표). 소품은 PLAN 크기표 그대로 */
  const DAD = 220, SANTA = DAD * .7, DEER = DAD * .42;
  const HT = {};
  const DADFW = { stand: 136, dash: 159, giggle: 134, look_out: 133, open_window: 136, peek: 139, relieved: 132, startled: 139, turn: 133, watch_up: 128, wave: 130, window_face: 240, window_up: 224, sleep: 206, wake: 179 };
  Object.entries(DADFW).forEach(([p, fw]) => { HT['nb_dad_' + p] = Math.round((p === 'sleep' ? 480 : 600) * (136 * DAD / 600) / fw); });
  const SCK = { stand_pack: 40, drive: 39, whistle: 40, bound_down: 40, land: 43, show_pack: 40, laugh: 40, wink: 39, fill: 40, done: 39, finger_nose: 38, rise: 38, jump_sleigh: 41, sleigh_wave: 45 };   // 2026-11-28 나란히 놓고 머리 크기로 다시 봄(볼 자동 측정이 수염·코와 붙어 튄 값은 사진으로 고침)
  Object.entries(SCK).forEach(([p, c]) => { HT['nb_santa_' + p] = Math.round(SANTA * 40 / c); });
  const DEAR = { stand: 81, roof: 78, prance: 73, run: 73, fly: 73 };
  Object.entries(DEAR).forEach(([p, e]) => { HT['nb_deer_' + p] = Math.round(DEER * 81 / e); });
  Object.assign(HT, {
    nb_mom_sleep: Math.round(DAD * .512), nb_kid1_sleep: Math.round(DAD * .398), nb_kid1_smile: Math.round(DAD * .398), nb_kid2_sleep: Math.round(DAD * .41), nb_kid2_smile: Math.round(DAD * .41),
    nb_mouse_sleep: Math.round(DAD * .14 / 1.115),
    nb_prop_sleigh: Math.round(DAD * .9 / 1.4917), nb_prop_holly: 52, nb_prop_candle: 56, nb_prop_lamb_toy: 34, nb_prop_dream_bubble: 116,
    nb_prop_gift_a: 30, nb_prop_gift_b: 30, nb_prop_gift_c: 30, nb_prop_gift_d: 30, nb_prop_ash_cloud: 60, nb_prop_leaves: 90, nb_prop_snow_puff: 70,
  });
  ['red', 'green', 'blue', 'yellow'].forEach(c => { HT['nb_prop_stocking_' + c] = Math.round(DAD * .3); HT['nb_prop_stocking_' + c + '_full'] = Math.round(DAD * .31); });
  /* 보는 쪽(그림을 보고 정함). 정면은 방향을 못 바꾼다 */
  const NAT = {
    nb_dad_stand: 'left', nb_dad_sleep: 'front', nb_dad_wake: 'right', nb_dad_dash: 'right', nb_dad_open_window: 'front', nb_dad_look_out: 'right', nb_dad_window_face: 'right', nb_dad_window_up: 'right',
    nb_dad_turn: 'front', nb_dad_startled: 'right', nb_dad_peek: 'right', nb_dad_giggle: 'right', nb_dad_relieved: 'right', nb_dad_watch_up: 'right', nb_dad_wave: 'right',
    nb_santa_stand_pack: 'left', nb_santa_drive: 'left', nb_santa_whistle: 'left', nb_santa_bound_down: 'front', nb_santa_land: 'left', nb_santa_show_pack: 'left', nb_santa_laugh: 'left',
    nb_santa_wink: 'left', nb_santa_fill: 'right', nb_santa_done: 'right', nb_santa_finger_nose: 'left', nb_santa_rise: 'front', nb_santa_jump_sleigh: 'right', nb_santa_sleigh_wave: 'left',
    nb_deer_stand: 'left', nb_deer_prance: 'left', nb_deer_run: 'left', nb_deer_fly: 'left', nb_deer_roof: 'left',
  };
  /* 순록 고삐(목걸이와 방울) 자리: 그림 폭·높이 비율(왼쪽 위 0,0, 왼쪽 보는 그림 기준) + 폭 비율 */
  const HARN = { nb_deer_stand: [.29, .5, .3], nb_deer_prance: [.36, .4, .42], nb_deer_run: [.2, .43, .2], nb_deer_fly: [.22, .42, .24], nb_deer_roof: [.29, .5, .34] };
  const REIN = ['red', 'green', 'blue', 'marigold', 'plum', 'persimmon', 'lagoon', 'pink'];
  /* 산타 서기(stand_pack) 그림 속 부위(9장 묘사 반짝) */
  const PART = { fur: [.55, .62], pack: [.86, .4], eye: [.32, .22], cheek: [.2, .3], nose: [.32, .28], mouth: [.32, .34], beard: [.33, .42], belly: [.42, .7] };

  /* ================= 그림 ================= */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f] !== false) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    return T.el('rect', { x, y, width: w, height: h, rx: 10, fill: '#D9A94E' }, parent);
  }
  /* 발끝(cx, by)에 높이 h 로 세운다(그림자 pp). top 이면 by 가 윗변 */
  const stand = (T, parent, f, cx, by, h = HT[f], { top = false, w } = {}) => {
    const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, parent);
    const ww = w || h * (ASP[f] || 1); sprite(T, g, f, cx - ww / 2, top ? by : by - h, ww, h); return g;
  };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  function glow(T, parent, cx, cy, r, color = '#F2B366', a = .5) {
    const svg = T.world.ownerSVGElement, id = 'nbGlow' + color.replace('#', '') + String(a).replace('.', '');
    if (!svg.querySelector('#' + id)) {
      let defs = svg.querySelector('defs#nbDefs'); if (!defs) { defs = T.el('defs', {}, svg); defs.id = 'nbDefs'; }
      const g = T.el('radialGradient', { id }, defs);
      T.el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': a }, g); T.el('stop', { offset: '.5', 'stop-color': color, 'stop-opacity': a * .4 }, g); T.el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, g);
    }
    return T.el('circle', { cx, cy, r, fill: `url(#${id})`, 'pointer-events': 'none' }, parent);
  }
  /* 반짝 별(Honey 종이 한 조각, 0.5초) */
  function twinkle(T, x, y, s = 1) {
    const g = T.el('g', { 'pointer-events': 'none', filter: 'url(#pp)' }, T.fx);
    const r1 = 13 * s, r2 = 5.5 * s, pts = [];
    for (let i = 0; i < 10; i++) { const r = i % 2 ? r2 : r1, a = -Math.PI / 2 + i * Math.PI / 5; pts.push((x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1)); }
    T.el('polygon', { points: pts.join(' '), fill: '#F6D27A' }, g);
    g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
    g.animate([{ transform: 'scale(.2) rotate(0deg)', opacity: 0 }, { transform: 'scale(1.2) rotate(40deg)', opacity: 1, offset: .4 }, { transform: 'scale(.8) rotate(80deg)', opacity: 0 }], { duration: 900, easing: 'ease-out', fill: 'forwards' }).finished.then(() => g.remove(), () => g.remove());
  }

  /* ================= 배우 ================= */
  function mk(T, parent, poses, deco) {
    const looks = {};
    let decoG;
    const a = T.actor(parent, -600, 400, g => {
      Object.entries(poses).forEach(([k, f]) => {
        const h = HT[f], w = h * (ASP[f] || 1), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, f, nat: NAT[f] || 'front' };
      });
      decoG = T.el('g', { filter: 'url(#pp)' }, g);
    });
    a.want = 'left';
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    const drawDeco = () => {
      decoG.innerHTML = ''; if (!deco) return;
      const l = looks[a.cur], p = HARN[l.f]; if (!p) return;
      const w = l.w * p[2], h = w / (ASP[deco] || 1.1);
      sprite(T, decoG, deco, -l.w / 2 + p[0] * l.w - w / 2, -l.h + p[1] * l.h - h * .35, w, h);
    };
    a.look = (k, d) => { Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; }); a.cur = k; a.h = looks[k].h; a.w = looks[k].w; drawDeco(); a.turn(d || a.want); };
    /* 그림 속 자리(fx, fy: 지금 자세 그림 비율, 그림 그대로 기준) → 무대 좌표(부모 기준) */
    a.at = (fx, fy) => { const l = looks[a.cur]; return [a.x + (-l.w / 2 + fx * l.w) * a.flip * a.scale, a.y + (-l.h + fy * l.h) * a.scale]; };
    a.look(Object.keys(poses)[0]);
    a.pos.style.pointerEvents = 'none';            // 인물 그림은 누름을 받지 않는다
    return a;
  }
  function put(a, x, y, { look, to, s } = {}) {
    a.pos.style.display = ''; a.pos.style.opacity = '';
    if (s != null) a.setScale(s);
    if (look) a.look(look, to || a.want); else if (to) a.turn(to);
    a.place(x, y); return a;
  }
  /* 투명 누름판(보이는 표식은 따로) */
  function hitZone(T, parent, cx, cy, w, h) {
    const g = T.el('g', {}, parent);
    T.el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 14, fill: '#000', 'fill-opacity': 0 }, g);
    return g;
  }

  async function run(T) {
    const { sleep, tr } = T;
    T.cardSpeed(.7);
    const GAP = 550;
    const line = k => L[k] || k;
    const P = T.viewWidth() < 990;
    const VW = T.viewWidth();
    const PS = P ? Math.min(1, VW / 400) : 1;
    const X = (l, p) => (P ? p : l);
    /* 누르는 판 최소 크기(CLAUDE.md §2 짧은 변 80px 이상, 여유 두고 88px): 무대 1단위 = 화면 몇 px 를 재서 world 단위로(세로는 PS 배율까지 나눔) */
    const stageK = () => { try { const sv = T.world.ownerSVGElement, r = sv.getBoundingClientRect(); if (!r.width) return 1; const m = /meet/.test(sv.getAttribute('preserveAspectRatio') || ''); return m ? Math.min(r.width / 1000, r.height / 560) : Math.max(r.width / 1000, r.height / 560); } catch (e) { return 1; } };
    const MINW = () => 88 / (PS * stageK());
    const big = n => Math.max(n, MINW());
    let FLV = 470;
    /* 세로 화면: 보는 가운데(lx)로 배경과 무대를 함께 옮긴다(red_hen setView 방식) */
    const setView = (lx = 500) => {
      const t = P ? `translate(500 ${FLV}) scale(${PS}) translate(${-lx} ${-FLV})` : '';
      [T.bg, T.world, T.fx].forEach(g => (t ? g.setAttribute('transform', t) : g.removeAttribute('transform')));
      T.camSnap(500, 280, 1);
    };
    const bgImage = (key, parent = T.bg) => T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, parent);
    const inst = () => T.reading() && T.readInstant();
    const hidden = () => document.hidden;

    /* ---- 소리 ---- */
    const sfx = (n, v = .5) => { try { if (T.reading()) v *= .75; return AudioFX.sfx(n, v); } catch (e) { return false; } };
    const SFX = ['el_nb_bed_spring', 'el_nb_candy_swirl', 'el_nb_chimney_slide', 'el_nb_clock_tick', 'el_nb_dash_whistle', 'el_nb_deer_names', 'el_nb_deer_prance', 'el_nb_drumroll_gallop', 'el_nb_embers',
      'el_nb_fly_up', 'el_nb_gift_pop_1', 'el_nb_gift_pop_2', 'el_nb_gift_pop_3', 'el_nb_gift_pop_4', 'el_nb_jelly_wobble', 'el_nb_moon_shimmer', 'el_nb_mouse_snore', 'el_nb_nod_tok', 'el_nb_realize_ding',
      'el_nb_roof_hooves', 'el_nb_roof_wrong', 'el_nb_shutters_open', 'el_nb_sleigh_hop', 'el_nb_sleigh_land', 'el_nb_sleigh_takeoff_bells', 'el_nb_snow_dust', 'el_nb_soot_poof', 'el_nb_sparkle_part',
      'el_nb_stifle_giggle', 'el_nb_thump_clatter', 'el_nb_up_chimney', 'el_nb_wave_bell', 'el_nb_whistle_santa', 'el_nb_wink_ting',
      'xm_bells_fade_away', 'xm_boing_cartoon', 'xm_boop_soft', 'xm_cymbal_tap', 'xm_ding_bell', 'xm_harp_gliss_down', 'xm_harp_gliss_up', 'xm_pizz_tiptoe', 'xm_sleigh_bells', 'xm_sleigh_glide',
      'xm_snare_roll_short', 'xm_snow_wind_soft', 'xm_star_twinkle', 'xm_triangle_ta_da', 'xm_whistle_slide_down', 'xm_whistle_slide_up', 'xm_wind_chime_snow', 'xm_woodblock_tok', 'xm_woodblock_tok3', 'xm_xylo_down3', 'xm_xylo_up_swirl'];
    try { AudioFX.preloadSfx(SFX); } catch (e) { /* 효과음 없이 */ }

    /* ---- 배경 음악(PLAN §장면별 곡 배정, 잠자리 동화라 잔잔한 판): 1~3 고요한 밤(오르골) · 4~5 The First Noel · 6~7 Deck the Halls · 8~9 Good King Wenceslas · 10~12 고요한 밤(하프) ---- */
    const TRACK = { 1: 'el_nb_silent_box', 2: 'el_nb_silent_box', 3: 'el_nb_silent_box', 4: 'el_nb_noel_moon', 5: 'el_nb_noel_moon', 6: 'el_nb_deck_sleigh', 7: 'el_nb_deck_sleigh',
      8: 'el_nb_wenceslas_jolly', 9: 'el_nb_wenceslas_jolly', 10: 'el_nb_silent_harp', 11: 'el_nb_silent_harp', 12: 'el_nb_silent_harp' };
    try { AudioFX.preloadMusic([...new Set(Object.values(TRACK))]); } catch (e) { /* 음악 없이 */ }
    const mVol = () => (T.reading() ? .13 : .2);
    let mTok = 0, mDone = false;
    const music = n => {
      if (mDone) return; const tok = ++mTok; let k = 0;
      const go = () => { if (tok !== mTok || mDone) return; let h = null; try { h = AudioFX.bgm(n, { vol: mVol(), fadeIn: 2.5, xfade: 2 }); } catch (e) { return; } if (!h && ++k < 12) setTimeout(go, 1000); };
      go();
    };
    const mNow = () => { try { return AudioFX.bgmNow && AudioFX.bgmNow(); } catch (e) { return null; } };
    const mDip = (sec, level = .25) => { const h = mNow(); if (h) try { h.dip(sec, level, .3); } catch (e) { /* 무시 */ } };
    const mOff = (f = 3) => { mDone = true; mTok++; try { AudioFX.stopBgm(f); } catch (e) { /* 무시 */ } };

    /* ---- 그림 불러오기 ---- */
    const BGS = ['nb_bg_living', 'nb_bg_living_tall', 'nb_bg_kids', 'nb_bg_parents', 'nb_bg_parents_open', BG_YARD, BG_SKY];
    const loads = [];
    [...BGS, ...Object.keys(ASP)].forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight && ASP[k]) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(5000)]);
    ['nb_cut_window_moon', 'nb_cut_fly_up', 'nb_cut_chimney', 'nb_cut_santa_face', 'nb_cut_moon_sleigh'].forEach(k => T.preload(src(k)));
    /* 그림 컷 켜고 끄기: 2026-11-28 검수로 꺼 두었던 컷 셋(아이들이 깨어 창밖을 봄, 거실에 순록·침대, 아빠 얼굴이 무대와 다름)을
       같은 날 다섯 장 모두 무대 아빠 기준 그림을 참고로 다시 그려(원작대로: 아이·엄마는 자는 중이라 안 보임) 다시 켰다. 꺼야 하면 0 */
    const CUT_ON = { nb_cut_window_moon: 1, nb_cut_santa_face: 1, nb_cut_fly_up: 1, nb_cut_chimney: 1, nb_cut_moon_sleigh: 1 };
    const cut = async (id, sfxName) => { if (!CUT_ON[id]) return; if (sfxName) sfx(sfxName, .5); await T.cutImage([{ src: src(id), hold: T.reading() ? 4000 : 3600 }]); };

    let S = {};       // 지금 장면의 배우·소품
    T.faces({ santa: () => S.santa });   // 세로 휴대폰 대사 상자: 산타 대사에 산타 얼굴
    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, `nb_${who}_${p}`]));
    const DADP = ['stand', 'dash', 'open_window', 'look_out', 'turn', 'startled', 'peek', 'giggle', 'relieved', 'watch_up', 'wave'];
    const SANP = ['stand_pack', 'show_pack', 'laugh', 'wink', 'fill', 'done', 'finger_nose', 'rise', 'land', 'bound_down'];

    /* ---- 공통 차림 ---- */
    const clear = (bg, fl, lx, lxp) => { T.clear(); S = { bg }; FLV = fl; bgImage(bg); setView(X(500, lxp ?? lx)); };
    /* 창 속 얼굴(밖에서 본 아빠): 창 사각형으로 오린다 */
    const windowDad = (rect, look, cx, cy, k) => {
      const id = 'nbWin' + Math.random().toString(36).slice(2, 7), cp = T.el('clipPath', { id }, T.world);
      T.el('rect', { x: rect[0], y: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1] }, cp);
      const holder = T.el('g', { 'clip-path': `url(#${id})`, 'pointer-events': 'none' }, T.world);
      const d = mk(T, holder, pz('dad', ['window_face', 'window_up']));
      d.setScale(k); d.look(look, 'right');
      const f = 'nb_dad_' + look, h = HT[f] * k, w = h * ASP[f];
      d.place(cx - (.433 - .5) * w, cy + (1 - .367) * h);   // 얼굴 가운데(그림 .433, .367)가 (cx, cy)
      return d;
    };
    /* 양말 넷(1, 8~11장): 선반 아래에 고리로 건다 */
    const SOCKC = ['red', 'green', 'blue', 'yellow'];
    const socks = (xs, top, k, full = false) => {
      S.sockG = T.el('g', { 'pointer-events': 'none' }, T.world);
      S.socks = xs.map((x, i) => { const f = 'nb_prop_stocking_' + SOCKC[i] + (full ? '_full' : ''); const g = stand(T, S.sockG, f, x, top, HT[f] * k, { top: true }); g.style.transformBox = 'fill-box'; g.style.transformOrigin = '50% 0%'; return { g, x, top, k, i }; });
    };
    const sockFill = i => { const s = S.socks[i]; s.g.remove(); const f = 'nb_prop_stocking_' + SOCKC[i] + '_full'; s.g = stand(T, S.sockG, f, s.x, s.top, HT[f] * s.k, { top: true }); s.g.style.transformBox = 'fill-box'; s.g.style.transformOrigin = '50% 0%'; s.g.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.12,.92)' }, { transform: 'scale(1,1)' }], 380); };
    /* 눈 내리는 창(작은 흰 종이 점, 창 사각형 안에서만) */
    const snowWindow = rect => {
      const id = 'nbSnow' + Math.random().toString(36).slice(2, 7), cp = T.el('clipPath', { id }, T.bg);
      T.el('rect', { x: rect[0], y: rect[1], width: rect[2] - rect[0], height: rect[3] - rect[1] }, cp);
      const g = T.el('g', { 'clip-path': `url(#${id})`, 'pointer-events': 'none' }, T.bg);
      for (let i = 0; i < 14; i++) {
        const x = rect[0] + Math.random() * (rect[2] - rect[0]), r = 2 + Math.random() * 2.5;
        const c = T.el('circle', { cx: x, cy: rect[1] - 10, r, fill: '#F4F6FA' }, g);
        if (!inst()) c.animate([{ transform: 'translate(0px,0px)' }, { transform: `translate(${(Math.random() - .5) * 30}px,${rect[3] - rect[1] + 20}px)` }], { duration: 5000 + Math.random() * 4000, delay: -Math.random() * 8000, iterations: Infinity });
        else c.setAttribute('cy', rect[1] + Math.random() * (rect[3] - rect[1]));
      }
    };
    const living = () => {   // 1, 9, 10장 거실(FL 470)
      stand(T, T.world, 'nb_prop_holly', 660, 128, HT.nb_prop_holly);
      const em = glow(T, T.bg, 780, 385, 140, '#F2B366', .55); if (!inst()) em.animate([{ opacity: .75 }, { opacity: 1 }, { opacity: .75 }], { duration: 3000, iterations: Infinity });
      snowWindow([135, 72, 292, 255]);
      S.mouse = stand(T, T.world, 'nb_mouse_sleep', 520, 448, HT.nb_mouse_sleep);
    };
    const livingTall = () => { // 8, 11장 굴뚝 단면(K .7, FL 490)
      stand(T, T.world, 'nb_prop_holly', 640, 294, HT.nb_prop_holly * .7);
      const em = glow(T, T.bg, 710, 462, 100, '#F2B366', .55); if (!inst()) em.animate([{ opacity: .75 }, { opacity: 1 }, { opacity: .75 }], { duration: 3000, iterations: Infinity });
      snowWindow([180, 255, 296, 390]);
      stand(T, T.world, 'nb_mouse_sleep', 518, 499, HT.nb_mouse_sleep * .7);
    };
    const breathe = g => { if (!inst() && g) { g.style.transformBox = 'fill-box'; g.style.transformOrigin = '50% 100%'; g.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.03,.96)' }, { transform: 'scale(1,1)' }], { duration: 2600, iterations: Infinity }); } };

    /* ---- 썰매 팀(5~7, 12장): 순록 여덟(둘씩 네 줄, 한 마리 크기 그대로) + 썰매 + 산타. 팀 그룹 하나를 통째로 옮긴다 ---- */
    const team = (dir, k, sp) => {
      const g = T.el('g', { 'pointer-events': 'none' }, T.world);
      const deer = [];
      const sgn = dir === 'left' ? 1 : -1;
      const DW = HT.nb_deer_stand * ASP.nb_deer_stand * k;
      const sleighW = HT.nb_prop_sleigh * ASP.nb_prop_sleigh * k, sleighH = HT.nb_prop_sleigh * k;
      const sx = sgn * (3 * sp + DW * .45 + sleighW * .5);
      /* 뒤 줄 먼저(위로 9, 뒤로 19 비켜 겹침) */
      for (const row of [1, 0]) for (let c = 0; c < 4; c++) {
        const i = c * 2 + row, d = mk(T, g, pz('deer', ['stand', 'prance', 'run', 'fly', 'roof']), 'nb_prop_harness_' + REIN[i]);
        d.setScale(k); d.look('stand', dir); d.place(sgn * (c * sp + row * 19 * k / .75), -row * 9 * k / .75); d.i = i; deer[i] = d;
      }
      const santa = mk(T, g, pz('santa', ['drive', 'whistle', 'jump_sleigh', 'sleigh_wave']));
      santa.setScale(k); santa.look('drive', dir); santa.place(sx - sgn * 8, -sleighH * .32);
      const sl = T.el('g', {}, g);
      if (dir === 'right') sl.setAttribute('transform', `translate(${2 * sx} 0) scale(-1 1)`);
      stand(T, sl, 'nb_prop_sleigh', sx, 6, sleighH);
      const t = { g, deer, santa, sx, sleighW, x: 0, y: 0, r: 0,
        at(x, y, r = 0) { t.x = x; t.y = y; t.r = r; g.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`; },
        async go(x, y, r, ms, easing = 'ease-in-out', mid) {
          if (inst() || hidden()) { t.at(x, y, r); return; }
          const from = { transform: `translate(${t.x}px,${t.y}px) rotate(${t.r}deg)` }, to = { transform: `translate(${x}px,${y}px) rotate(${r}deg)` };
          const kf = mid ? [from, { transform: `translate(${mid[0]}px,${mid[1]}px) rotate(${mid[2] || 0}deg)`, offset: .5 }, to] : [from, to];
          const a = g.animate(kf, { duration: ms, easing, fill: 'forwards' });
          try { await a.finished; } catch (e) { /* 취소 */ }
          t.at(x, y, r); try { a.cancel(); } catch (e) { /* 무시 */ }
        },
        pose(p, d) { deer.forEach(x => x.look(p, d || x.want)); },
        bob() { if (inst()) return; deer.forEach((x, i) => setTimeout(() => x.hop(8, 300), i * 60)); },
      };
      return t;
    };

    /* ================= 장면 차리기(놓기만, 움직임 없음) ================= */
    const SET = {
      1() { clear('nb_bg_living', 470, 500, 690); living(); socks([645, 720, 795, 870], 140, 1); breathe(S.mouse); },
      2() {
        clear('nb_bg_kids', 470, 500, 470);
        glow(T, T.bg, 468, 268, 70, '#F2B366', .45);
        S.kid1 = mk(T, T.world, pz('kid1', ['sleep', 'smile'])); S.kid2 = mk(T, T.world, pz('kid2', ['sleep', 'smile']));
        const lay = (a, f, fx, fy, hx, hy) => { const h = HT[f], w = h * ASP[f]; a.look('sleep', 'left'); a.place(hx - (fx - .5) * w, hy + (1 - fy) * h); };
        lay(S.kid1, 'nb_kid1_sleep', .708, .337, 292, 300); lay(S.kid2, 'nb_kid2_sleep', .284, .344, 648, 300);
        stand(T, T.world, 'nb_prop_lamb_toy', 815, 334, HT.nb_prop_lamb_toy);
        breathe(S.kid1.body); breathe(S.kid2.body);
      },
      3() {
        clear('nb_bg_parents', 470, 500, 720);
        stand(T, T.world, 'nb_prop_candle', 778, 344, HT.nb_prop_candle);
        shutters();
        S.mom = mk(T, T.world, pz('mom', ['sleep'])); S.dad = mk(T, T.world, pz('dad', ['sleep', 'wake']));
        const lay = (a, k, f, fx, fy, hx, hy) => { const h = HT[f], w = h * ASP[f]; a.look(k, 'left'); a.place(hx - (fx - .5) * w, hy + (1 - fy) * h); };
        lay(S.mom, 'sleep', 'nb_mom_sleep', .708, .322, 590, 288); lay(S.dad, 'sleep', 'nb_dad_sleep', .742, .317, 648, 308);
        breathe(S.mom.body); breathe(S.dad.body);
      },
      4() {
        clear('nb_bg_parents', 470, 500, 790);
        stand(T, T.world, 'nb_prop_candle', 778, 344, HT.nb_prop_candle);
        S.mom = mk(T, T.world, pz('mom', ['sleep']));
        const h = HT.nb_mom_sleep, w = h * ASP.nb_mom_sleep; S.mom.look('sleep', 'left'); S.mom.place(590 - .208 * w, 288 + .678 * h); breathe(S.mom.body);
        shutters();
        S.dad = put(mk(T, T.world, pz('dad', DADP)), X(470, 620), 474, { look: 'dash', to: 'right' });
      },
      5() { yard(); S.team.at(X(470, 450) + 460, 482); },
      6() { yard(); S.team.at(X(470, 450), 482); },
      7() { yard(210); S.team.at(X(470, 450), 482); S.team.pose('run'); },
      8() {
        clear('nb_bg_living_tall', 490, 500, 560); livingTall(); socks([600, 670, 740, 810], 304, .7);
        S.dad = put(mk(T, T.world, pz('dad', DADP)), X(115, 400), 494, { look: 'turn', to: 'right', s: .7 });
        S.santa = mk(T, chimneyClip(), pz('santa', SANP)); S.santa.setScale(.7); S.santa.look('bound_down', 'left'); S.santa.place(705, -40); S.santa.pos.style.display = 'none';
      },
      9() {
        clear('nb_bg_living', 470, 500, 600); living(); socks([645, 720, 795, 870], 140, 1);
        S.dad = put(mk(T, T.world, pz('dad', DADP)), X(70, 440), 474, { look: 'peek', to: 'right' });
        S.santa = put(mk(T, T.world, pz('santa', SANP)), 720, 470, { look: 'stand_pack', to: 'left' });
      },
      10() {
        clear('nb_bg_living', 470, 500, 690); living(); socks([645, 720, 795, 870], 140, 1);
        S.dad = put(mk(T, T.world, pz('dad', DADP)), X(70, 440), 474, { look: 'giggle', to: 'right' });
        S.santa = put(mk(T, T.world, pz('santa', SANP)), X(560, 600), 470, { look: 'wink', to: 'left' });
      },
      11() {
        clear('nb_bg_living_tall', 490, 500, 560); livingTall(); socks([600, 670, 740, 810], 304, .7, true);
        S.dad = put(mk(T, T.world, pz('dad', DADP)), X(115, 400), 494, { look: 'relieved', to: 'right', s: .7 });
        S.santa = mk(T, chimneyClip(), pz('santa', SANP)); S.santa.setScale(.7); put(S.santa, 640, 490, { look: 'finger_nose', to: 'left' });
      },
      12() {
        clear(BG_SKY, 470, 500, 380);
        S.dad = windowDad([92, 466, 170, 548], 'window_up', 128, 505, .75);
        S.team = team('right', .75, X(70, 55)); S.team.pose('fly', 'right');
        S.santa = S.team.santa; S.santa.look('jump_sleigh', 'right');
        S.team.at(X(420, 400), 330, -8);
      },
    };
    /* 부모 방 덧문(닫힘): 창 안쪽 x 821~976, y 64~296 을 두 장이 반씩 덮는다. 누르는 묶음 = S.shut */
    function shutters() {
      const [x0, x1, y0, y1] = [821, 976, 64, 296], mid = (x0 + x1) / 2, hw = (x1 - x0) / 2;
      S.shut = T.el('g', {}, T.world);
      T.el('rect', { x: x0 - 22, y: y0 - 22, width: x1 - x0 + 44, height: y1 - y0 + 44, fill: '#000', 'fill-opacity': 0 }, S.shut);
      const one = (f, x, origin) => { const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, S.shut); sprite(T, g, f, x, y0, hw, y1 - y0); g.style.transformBox = 'fill-box'; g.style.transformOrigin = origin; return g; };
      S.shL = one('nb_prop_shutter_l', x0, '0% 50%'); S.shR = one('nb_prop_shutter_r', mid, '100% 50%');
    }
    /* 굴뚝 단면(8, 11장): 굴뚝 통로(x 650~762)와 벽난로 입구 안에서만 산타가 보이게 오린다 */
    function chimneyClip() {
      const id = 'nbChim' + Math.random().toString(36).slice(2, 7), cp = T.el('clipPath', { id }, T.world);
      T.el('path', { d: 'M650 -80 H762 V372 H800 V560 H520 V372 H650 Z' }, cp);
      return T.el('g', { 'clip-path': `url(#${id})`, 'pointer-events': 'none' }, T.world);
    }
    /* 앞마당(5~7장, K .75): 창 속 아빠 + 썰매 팀 */
    function yard(lxp = 640) {
      clear(BG_YARD, 482, 500, lxp);
      S.dad = windowDad([152, 247, 236, 331], 'window_face', 193, 290, .75);
      S.team = team('left', .75, X(72, 55));
      S.santa = S.team.santa;
    }

    /* ================= 동작(놀이와 읽어 주기가 함께 쓴다). 조작 자리는 읽어 주기에서 '저절로' 동작으로 대신한다 ================= */
    const B = {
      /* 1 */
      tick() { sfx('el_nb_clock_tick', .35); sfx('el_nb_embers', .25); if (!P && !inst()) T.camTo(700, 300, 1.08, 7000); },
      snore() { sfx('el_nb_mouse_snore', .4); },
      sway() { sfx('xm_pizz_tiptoe', .35); if (inst()) return; S.socks.forEach((s, i) => s.g.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(0deg)' }], { duration: 1600, delay: i * 140 })); },
      chime() { sfx('xm_wind_chime_snow', .35); },
      /* 2 */
      dream() {
        sfx('el_nb_candy_swirl', .4); sfx('xm_xylo_up_swirl', .3);
        S.kid1.look('smile'); S.kid2.look('smile');
        [[X(250, 330), 180], [X(720, 615), 180]].forEach(([x, y], i) => {
          const g = T.el('g', { 'pointer-events': 'none' }, T.fx), ig = stand(T, g, 'nb_prop_dream_bubble', x, y, HT.nb_prop_dream_bubble);
          ig.style.transformBox = 'fill-box'; ig.style.transformOrigin = 'center';
          if (!inst()) { ig.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 600, delay: i * 250, fill: 'backwards', easing: 'ease-out' }); g.animate([{ transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(-3deg)' }], { duration: 2400, iterations: Infinity }); }
        });
      },
      /* 3 */
      harp() { sfx('xm_harp_gliss_up', .3); },
      thump() {
        mDip(3, .3); sfx('el_nb_thump_clatter', T.reading() ? .35 : .5); setTimeout(() => sfx('xm_sleigh_bells', .3), 300);
        if (S.shL && !inst()) [S.shL, S.shR].forEach(g => g.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }], { duration: 300, iterations: 3 }));
      },
      wake() { S.dad.look('wake', 'right'); const h = HT.nb_dad_wake, w = h * ASP.nb_dad_wake; S.dad.place(640 - (.407 - .5) * w, 255 + (1 - .292) * h); sfx('el_nb_bed_spring', .4); sfx('xm_boing_cartoon', .35); if (!inst()) S.dad.hop(16, 360); },
      /* 4 */
      async dash() {
        sfx('el_nb_dash_whistle', .4);
        S.dad.look('dash', 'right');
        if (inst() || hidden()) { S.dad.place(X(735, 760), 474); return; }
        await S.dad.move(X(735, 760), 474, 900, 'ease-out');
      },
      async open() {   // 덧문 벌컥 → 창 쓱 → 달빛
        sfx('el_nb_shutters_open', .55);
        S.dad.look('open_window', 'right'); S.dad.place(898, 474);
        const ob = bgImage('nb_bg_parents_open'); ob.style.opacity = 0;
        const gl = glow(T, T.bg, 900, 200, 260, '#FBF3D5', .5); gl.style.opacity = 0;
        const fade = [{ opacity: 0 }, { opacity: 1 }];
        if (inst() || hidden()) { ob.style.opacity = 1; gl.style.opacity = 1; S.shL.style.opacity = 0; S.shR.style.opacity = 0; }
        else {
          [S.shL, S.shR].forEach(g => g.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.08)', opacity: .4 }], { duration: 420, easing: 'ease-in', fill: 'forwards' }));
          await ob.animate(fade, { duration: 600, fill: 'forwards' }).finished.catch(() => {});
          sfx('el_nb_moon_shimmer', .4); sfx('xm_harp_gliss_down', .3);
          await gl.animate(fade, { duration: 600, fill: 'forwards' }).finished.catch(() => {});
          await sleep(700);
        }
        S.dad.look('look_out', 'right'); S.dad.place(840, 474);
      },
      /* 5 */
      async arrive() {
        sfx('xm_sleigh_glide', .45); sfx('el_nb_sleigh_land', .4);
        S.team.bob(); await S.team.go(X(470, 450), 482, 0, 2400, 'ease-out');
        sfx('xm_sleigh_bells', .3);
      },
      hopSanta() { if (!inst()) S.santa.hop(10, 320); sfx('xm_woodblock_tok', .3); },
      realize() { sfx('el_nb_realize_ding', .45); if (!inst()) S.dad.hop(8, 300); },
      /* 6 */
      cam6() { if (!P && !inst()) T.camTo(560, 330, 1.12, 1600); },
      gallop() { S.team.bob(); sfx('el_nb_drumroll_gallop', .3); },
      whistle() { S.santa.look('whistle', 'left'); sfx('el_nb_whistle_santa', .45); },
      async names(half) {
        S.santa.look('drive', 'left');
        const ids = +half ? [4, 5, 6, 7] : [0, 1, 2, 3];
        for (const i of ids) {
          const d = S.team.deer[i]; d.look('prance', 'left'); sfx('el_nb_deer_names', .35); sfx('el_nb_deer_prance', .25);
          const [hx, hy] = d.at(HARN.nb_deer_prance[0], HARN.nb_deer_prance[1]);
          if (!inst()) { const m = new DOMMatrix(S.team.g.style.transform || ''); const p = m.transformPoint(new DOMPoint(hx, hy)); twinkle(T, p.x, p.y, .8); d.hop(12, 300); }
          await sleep(inst() || hidden() ? 0 : 650);
          d.look('stand', 'left');
        }
      },
      raise() { if (!inst()) S.santa.hop(12, 300); sfx('xm_whistle_slide_up', .3); },
      runAll() { S.team.pose('run', 'left'); S.team.bob(); sfx('el_nb_drumroll_gallop', .4); },
      /* 7 */
      leaves() {
        sfx('xm_snow_wind_soft', .35); sfx('xm_whistle_slide_up', .3);
        if (inst()) return;
        const g = T.el('g', { 'pointer-events': 'none' }, T.fx); stand(T, g, 'nb_prop_leaves', 0, 0, HT.nb_prop_leaves);
        g.animate([{ transform: `translate(${X(700, 380)}px,480px) rotate(0deg)`, opacity: 0 }, { opacity: 1, offset: .2 }, { transform: `translate(${X(250, 160)}px,60px) rotate(-200deg)`, opacity: 0 }], { duration: 2600, easing: 'ease-out', fill: 'forwards' }).finished.then(() => g.remove(), () => g.remove());
      },
      async fly() {
        sfx('el_nb_fly_up', .45); sfx('xm_sleigh_bells', .3);
        S.team.pose('fly', 'left');
        await S.team.go(ROOF[0], ROOF[1], ROOF[2], 2400, 'ease-in-out', [X(420, 300), 120, -16]);
        S.team.pose('roof', 'left'); sfx('el_nb_snow_dust', .3);
        if (!inst()) S.team.bob();
        S.dad.look('window_up', 'right');
      },
      hooves() { sfx('el_nb_roof_hooves', .35); S.dad.look('window_up', 'right'); },
      roofOK() {
        sfx('el_nb_roof_hooves', .6); const tm = S.team; tm.bob(); setTimeout(() => tm.bob(), 420);   // 장면이 빨리 넘어가면(검증 건너뛰기) S 가 비어 S.team 오류가 났다(2026-11-28)
        if (inst()) return;
        const g = T.el('g', { 'pointer-events': 'none' }, T.fx); const ig = stand(T, g, 'nb_prop_snow_puff', 158, 40, HT.nb_prop_snow_puff);
        ig.animate([{ transform: 'translateY(10px)', opacity: 0 }, { opacity: 1, offset: .3 }, { transform: 'translateY(-40px)', opacity: 0 }], { duration: 1600, fill: 'forwards' }).finished.then(() => g.remove(), () => g.remove());
        sfx('el_nb_snow_dust', .35);
      },
      /* 8 */
      turn() { S.dad.look('turn'); sfx('xm_woodblock_tok', .3); },
      hush() { mDip(2.2, 0); sfx('xm_snare_roll_short', .3); },
      async down() {
        const s = S.santa; s.pos.style.display = '';
        s.look('bound_down'); s.place(705, -40);
        sfx('el_nb_chimney_slide', .5);
        if (!(inst() || hidden())) await s.move(705, 490, 600, 'ease-in');
        s.look('land', 'left'); s.place(690, 490);
        sfx('el_nb_soot_poof', T.reading() ? .35 : .5);
        S.dad.look('startled', 'right');
        puff(700, 488, .7);
      },
      /* 9 */
      shine(part) {
        const p = PART[part]; if (!p || !S.santa) return;
        sfx(part === 'fur' || part === 'pack' ? 'xm_star_twinkle' : 'el_nb_sparkle_part', .35);
        if (inst()) return;
        const [x, y] = S.santa.at(p[0], p[1]); twinkle(T, x, y, 1.1);
        if (part === 'cheek') { const [x2, y2] = S.santa.at(.44, .32); twinkle(T, x2, y2, 1); }
      },
      showPack() { S.santa.look('show_pack', 'left'); sfx('xm_pizz_tiptoe', .3); },
      standPack() { S.santa.look('stand_pack', 'left'); },
      cards() {
        if (S.cards) return;
        sfx('xm_triangle_ta_da', .35);
        S.cards = ['cherry', 'snowball', 'jelly'].map((k, i) => {
          const cx = X([385, 515, 645], [464, 600, 736])[i], cy = X(236, 188), g = hitZone(T, T.fx, cx, cy, big(118), big(150));   // 카드 사이 12px 이상(2026-11-28 검수)
          const pg = T.el('g', { 'pointer-events': 'none' }, g); stand(T, pg, 'nb_prop_card_' + k, cx, cy + 70, 140);
          g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
          if (!inst()) g.animate([{ transform: 'translateY(-30px) scale(.5)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, delay: i * 120, easing: 'ease-out', fill: 'backwards' });
          return { k, el: g };
        });
      },
      laugh() {
        S.santa.look('laugh', 'left'); sfx('el_nb_jelly_wobble', .45);
        if (inst()) return;
        S.santa.body.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.05,.95)' }, { transform: 'scale(.98,1.02)' }, { transform: 'scale(1.05,.95)' }, { transform: 'scale(1,1)' }], { duration: 1100, easing: 'ease-in-out' });
        const j = S.cards && S.cards.find(c => c.k === 'jelly');
        if (j) j.el.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.1,.9)' }, { transform: 'scale(.94,1.06)' }, { transform: 'scale(1,1)' }], 900);
      },
      cardsOff() { if (!S.cards) return; S.cards.forEach(c => c.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.then(() => c.el.remove(), () => c.el.remove())); S.cards = null; },
      giggle() { S.dad.look('giggle', 'right'); sfx('el_nb_stifle_giggle', .4); if (!inst()) S.dad.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 300, iterations: 3 }); },
      /* 10 */
      wink() { S.santa.look('wink', 'left'); sfx('el_nb_wink_ting', .45); if (!inst()) S.santa.body.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(0)' }], 600); },
      relieved() { S.dad.look('relieved', 'right'); sfx('xm_harp_gliss_up', .25); },
      async work() {
        sfx('xm_pizz_tiptoe', .35);
        S.santa.look('fill', 'right');
        if (!(inst() || hidden())) await S.santa.move(X(500, 560), 470, 700);
        else S.santa.place(X(500, 560), 470);
      },
      async fill() {   // 선물 넷: 하나 쏙 → 셋 저절로 쏙쏙쏙
        for (let i = 0; i < 4; i++) {
          const s = S.socks[i], [hx, hy] = S.santa.at(.92, .26);
          if (!(inst() || hidden())) {
            const g = T.el('g', { 'pointer-events': 'none' }, T.fx); stand(T, g, 'nb_prop_gift_' + 'abcd'[i], 0, 0, HT.nb_prop_gift_a);
            await g.animate([{ transform: `translate(${hx}px,${hy + 15}px)` }, { transform: `translate(${(hx + s.x) / 2}px,${Math.min(hy, s.top) - 50}px)`, offset: .5 }, { transform: `translate(${s.x}px,${s.top + 28}px) scale(.6)` }], { duration: 480, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {});
            g.remove();
          }
          sfx('el_nb_gift_pop_' + (i + 1), .5); sockFill(i);
          if (!(inst() || hidden())) await sleep(320);
        }
        S.santa.look('done', 'right'); sfx('xm_ding_bell', .35);
      },
      /* 11 */
      spin() { S.santa.look('finger_nose', 'left'); sfx('xm_whistle_slide_down', .25); if (!inst()) S.santa.hop(10, 300); },
      nod() { sfx('el_nb_nod_tok', .45); if (inst()) return; S.santa.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(5px)' }, { transform: 'translateY(0)' }, { transform: 'translateY(5px)' }, { transform: 'translateY(0)' }], 800); },
      async rise() {
        const s = S.santa; s.look('rise'); sfx('el_nb_up_chimney', .5); puff(700, 488, .6);
        if (!(inst() || hidden())) await s.move(705, -60, 900, 'ease-in');
        s.pos.style.display = 'none';
        S.dad.look('watch_up', 'right');
      },
      /* 12 */
      hopSleigh() { S.santa.look('jump_sleigh', 'right'); sfx('el_nb_sleigh_hop', .4); if (!inst()) S.santa.hop(16, 340); },
      whistle12() { S.santa.look('whistle', 'right'); sfx('el_nb_whistle_santa', .45); },
      async away() {
        sfx('el_nb_sleigh_takeoff_bells', .45); sfx('xm_harp_gliss_up', .3);
        await S.team.go(X(800, 520), X(235, 250), -10, 2800, 'ease-in-out', [X(600, 470), 280, -14]);
        S.dad.look('window_up', 'right');
      },
      async wave() {
        S.santa.look('sleigh_wave', 'left'); sfx('el_nb_wave_bell', .4); sfx('xm_sleigh_bells', .3);
        if (S.dad) { S.dad.look('window_face', 'right'); if (!inst()) S.dad.hop(8, 300); }
        if (!inst()) S.santa.hop(8, 300);
      },
      async gone() {
        sfx('xm_bells_fade_away', .4); mOff(5);
        await S.team.go(1250, -40, -12, 2600, 'ease-in');
      },
      ding() { sfx('xm_ding_bell', .3); },
    };
    const ROOF = [X(42, 42), X(82, 82), 27];   // 지붕 비탈(왼쪽 위 굴뚝 쪽) 위 팀 자리: 앞 순록 발끝, 기울기(도)
    function puff(x, y, k) {
      if (inst()) return;
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx), ig = stand(T, g, 'nb_prop_ash_cloud', x, y, HT.nb_prop_ash_cloud * k / .7);
      ig.animate([{ transform: 'translateY(6px) scale(.6)', opacity: 0 }, { opacity: 1, offset: .25 }, { transform: 'translateY(-20px) scale(1.1)', opacity: 0 }], { duration: 1200, fill: 'forwards' }).finished.then(() => g.remove(), () => g.remove());
    }

    /* ================= 조작 ================= */
    const choose = async (ask, opts, wrong) => {
      T.fx.style.pointerEvents = '';
      const o = opts.map(c => ({ el: c.el, ok: c.ok, c, onWrong: async () => { sfx('xm_boop_soft', .45); await wrong(c); } }));
      const r = await T.ask(line(ask), () => T.choose(o, { prompt: line(ask) }));
      T.fx.style.pointerEvents = 'none';
      return r.c;
    };
    const say = async (k, opts) => { await T.say(line(k), opts); await sleep(GAP); };

    /* ================= 놀이 모드 장면 ================= */
    const PLAY = {
      async 1() { music(TRACK[1]); B.tick(); await say('A1'); B.snore(); await say('A2'); B.sway(); await say('A3'); await say('A4'); B.chime(); await say('A5'); },
      async 2() { music(TRACK[2]); await say('B1'); B.dream(); await say('B2'); await sleep(600); },
      async 3() { music(TRACK[3]); await say('C1'); B.harp(); await say('C2'); B.thump(); await say('C3'); B.wake(); await say('C4'); },
      async 4() {
        music(TRACK[4]);
        await Promise.all([B.dash(), say('D1')]);
        S.shut.style.pointerEvents = '';
        await T.ask(line('ASK_D'), () => T.tap(S.shut, { prompt: line('ASK_D') }));
        await B.open();
        await say('D2'); await say('D3');
        await cut('nb_cut_window_moon', 'xm_harp_gliss_down');
      },
      async 5() { music(TRACK[5]); await say('E1'); await Promise.all([B.arrive(), say('E2')]); B.hopSanta(); await say('E3'); B.realize(); await say('E4'); },
      async 6() {
        music(TRACK[6]); B.cam6(); B.gallop(); await say('F1'); B.whistle(); await say('F2');
        await Promise.all([say('F3'), B.names(0)]); await Promise.all([say('F4'), B.names(1)]);
        B.raise(); await say('F5'); B.runAll(); await say('F6');
      },
      async 7() {
        music(TRACK[7]); B.leaves(); await say('G1'); await Promise.all([B.fly(), say('G2')]);
        await cut('nb_cut_fly_up', 'xm_sleigh_bells');
        await say('G3'); B.hooves(); await say('G4');
        const zones = roofZones();
        await choose('ASK_G', zones, async () => { await say('NO_G'); });
        zones.forEach(z => z.el.remove()); S.marks.remove();
        B.roofOK(); await say('G5');
      },
      async 8() { music(TRACK[8]); B.turn(); await say('H1'); B.hush(); await say('H2'); await cut('nb_cut_chimney', 'el_nb_chimney_slide'); await B.down(); await say('H3'); },
      async 9() {
        music(TRACK[9]); B.shine('fur'); await say('I1'); B.showPack(); await say('I2'); B.standPack();
        await cut('nb_cut_santa_face', 'xm_star_twinkle');
        B.shine('eye'); await say('I3'); B.cards(); B.shine('cheek'); await say('I4');
        const col = { cherry: '빨간', snowball: '하얀', jelly: '노란' };
        await choose('ASK_I1', S.cards.map(c => ({ el: c.el, ok: c.k === 'cherry', k: c.k })), async c => { await say(c.k === 'snowball' ? 'NO_I1w' : 'NO_I1y'); });
        B.shine('nose'); await say('I5'); B.shine('mouth'); await say('I6');
        await choose('ASK_I2', S.cards.map(c => ({ el: c.el, ok: c.k === 'snowball', k: c.k })), async c => { await say(c.k === 'cherry' ? 'NO_I2r' : 'NO_I2y'); });
        void col;
        B.shine('beard'); await say('I7'); B.shine('belly'); await say('I8'); B.laugh(); await say('I9'); B.cardsOff(); B.standPack(); await say('I10'); B.giggle(); await say('I11');
      },
      async 10() {
        music(TRACK[10]); B.wink(); await say('J1'); B.relieved(); await say('J2'); await Promise.all([B.work(), say('J3')]);
        const zones = sockZones();
        await choose('ASK_J', zones, async () => { await say('NO_J'); });
        zones.forEach(z => z.el.remove()); S.marks.remove();
        await B.fill(); await say('J4');
      },
      async 11() { music(TRACK[11]); B.spin(); await say('K1'); B.nod(); await say('K2'); await Promise.all([B.rise(), say('K3')]); },
      async 12() {
        music(TRACK[12]); B.hopSleigh(); await sleep(300); B.whistle12(); await say('L1'); await Promise.all([B.away(), say('L2')]);
        await cut('nb_cut_moon_sleigh', 'xm_sleigh_bells');
        await say('L3');
        const hb = S.team.g.getBBox(), m = new DOMMatrix(S.team.g.style.transform || ''), c = m.transformPoint(new DOMPoint(hb.x + hb.width / 2, hb.y + hb.height / 2));
        const hit = hitZone(T, T.fx, c.x, c.y, Math.max(160, hb.width), Math.max(120, hb.height));
        T.fx.style.pointerEvents = '';
        await T.ask(line('ASK_L'), () => T.tap(hit, { prompt: line('ASK_L') }));
        T.fx.style.pointerEvents = 'none'; hit.remove();
        B.wave(); await say('L4');
        await Promise.all([B.gone(), say('L5')]);
        B.ding(); await sleep(800);
      },
    };
    /* 7장 누르는 자리 셋: 지붕 위 / 마당 아래 / 창문 옆(작은 Honey 표식 + 투명 누름판) */
    function roofZones() {
      S.marks = T.el('g', { 'pointer-events': 'none' }, T.fx);
      const Z = [['roof', X(165, 165), 128, 250, 110, 'nb_prop_marker_roof', -28], ['yard', X(600, 320), 470, X(300, 130), 104, 'nb_prop_marker_yard', 0], ['wall', 62, X(305, 312), 100, 104, 'nb_prop_marker_wall', 0]];
      return Z.map(([k, x, y, w, h, f, r]) => {
        const mg = T.el('g', {}, S.marks); if (r) mg.setAttribute('transform', `rotate(${r} ${x} ${y})`);
        const mw = k === 'wall' ? 30 : Math.min(w * .8, 170); stand(T, mg, f, x, y + (k === 'wall' ? 38 : 12), k === 'wall' ? 76 : mw / ASP[f]);
        const z = hitZone(T, T.fx, x, y, big(w), big(h)); if (r) z.setAttribute('transform', `rotate(${r} ${x} ${y})`);
        return { el: z, ok: k === 'roof', k };
      });
    }
    /* 10장 누르는 자리 셋: 양말 속 / 선반 위 / 양말 옆 바닥 */
    function sockZones() {
      S.marks = T.el('g', { 'pointer-events': 'none' }, T.fx);
      const Z = [['sock', 757, X(200, 203), 300, 96, 'nb_prop_marker_sock'], ['shelf', 757, X(72, 66), 300, 96, 'nb_prop_marker_shelf'], ['floor', X(740, 770), 494, X(200, 170), 100, 'nb_prop_marker_floor']];   // 세로: 판을 88px 로 키우며 양말·선반 사이 12px 를 두려고 조금 벌림
      return Z.map(([k, x, y, w, h, f]) => {
        const mw = Math.min(w * .7, 180); stand(T, S.marks, f, x, y + (k === 'sock' ? 36 : 12), mw / ASP[f]);
        return { el: hitZone(T, T.fx, x, y, big(w), big(h)), ok: k === 'sock', k };
      });
    }

    const SC = [
      [1, '고요한 집'], [2, '달콤한 사탕 꿈'], [3, '쿵쾅! 무슨 소리지?'], [4, '창문을 열자'], [5, '작은 썰매와 순록 여덟'], [6, '이름 부르기'],
      [7, '지붕 위로'], [8, '굴뚝에서 쿵'], [9, '산타 할아버지의 모습'], [10, '양말 속에 쏙'], [11, '굴뚝 위로 쑤욱'], [12, '메리 크리스마스'],
    ];
    window.__nb = { scene: 0 };

    /* ================= 읽어 주기 ================= */
    if (T.reading()) {
      const READ_ACTS = {
        set(n) { window.__nb.scene = +n; SET[+n](); music(TRACK[+n]); return null; },
        b(name, a) { const f = B[name]; if (!f) { console.warn('[nb] 모르는 동작', name); return null; } const r = f(a); return r && r.then ? r : null; },
        /* 대사와 함께 움직임(기다리지 않음): 놀이 모드의 Promise.all([동작, 대사]) 와 같다 */
        par(name, a) { const f = B[name]; if (f) { try { const r = f(a); if (r && r.catch) r.catch(e => console.warn('[nb]', name, e)); } catch (e) { console.warn('[nb]', name, e); } } return null; },
        cut(id) { return cut(id); },
        /* 조작 대신 저절로 */
        auto(k) {
          if (k === 'roof') return B.roofOK();
          if (k === 'nose') return B.shine('nose');
          if (k === 'beard') return B.shine('beard');
          if (k === 'fill') return B.fill();
          if (k === 'wave') return B.wave();
          return null;
        },
        settle() { return null; },
      };
      const RW = Object.create(T);
      /* 녹음 없는 줄: 엔진 읽어 주기는 바로 건너뛰지만(recordedOnly), 녹음 전에는 글자만 읽을 만큼 띄우고 넘어간다(소리 없음, TTS 없음) */
      const hasClip = t => { try { const en = typeof englishOn === 'function' && englishOn(); return en ? !!(NARRATION_CLIPS_EN[t] && NARRATION_CLIPS_EN[t].c) : !!(typeof NARRATION_CLIPS !== 'undefined' && NARRATION_CLIPS[t]); } catch (e) { return false; } };
      RW.say = (text, o = {}) => T.say(text, hasClip(text) ? o : { ...o, recordedOnly: false });
      try { await T.readPlay.call(RW, READ_ACTS); } finally { mOff(3); }
      window.__nb.scene = 13;
      return MORAL;
    }

    const from = Math.max(1, Math.min(12, +QS.get('from') || 1));
    let first = true;
    for (const [n, label] of SC) {
      if (n < from) continue;
      window.__nb.scene = n;
      if (first) { SET[n](); await T.curtain(true); first = false; }
      else await T.sceneCard(tr(label), () => SET[n]());
      window.__nb.ready = n;
      await PLAY[n]();
    }
    window.__nb.scene = 13;
    mOff(3);
    T.finale(); await sleep(1200);
    return MORAL;
  }

  const sub = (() => { try { return typeof englishOn === 'function' && englishOn() ? 'A Visit from St. Nicholas' : ''; } catch (e) { return ''; } })();   // 원제는 영어 모드에서만(PLAN 판단 9)
  Tale.mount({ title: '크리스마스 전날 밤', subtitle: sub, read: true, run: T => run(Tale.api) });
})();
