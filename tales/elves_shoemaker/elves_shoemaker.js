/* 구두장이와 요정 — 그림 형제 KHM 39 첫 이야기. 기획: tales/elves_shoemaker/PLAN.md (2026-11-26, 요정 B 여자아이 2026-11-27). 그림 접두어 es_ (assets/v3w/es_*.webp)
   장면 12, 컷 4. 조작(모두 T.ask: 안내와 누르기를 함께 연다): 4장 짝 찾기 ×2 · 5장 촛불 톡 · 8장 크기 고르기 ×2 + 망치 톡 · 10장 감정 고르기 · 12장 인사 톡.
   읽어 주기(?read=1, 시작 화면 단추): 같은 장면 코드를 그대로 돌리고 조작은 저절로, 안내 줄 대신 R1~R6(PLAN §4-2). T.readPlay 를 쓰지 않는 까닭: 녹음 전 줄도 글자를 보이며 끝까지 가야 해서.
     화면이 꺼져도(document.hidden) 멈추지 않게 쉼·컷은 건너뛰고 애니메이션은 기다리지 않는다(sleep 기반).
   녹음 전: narration_el.js 가 없으면 말풍선만 읽을 만큼 띄우고 소리 없이 넘어간다(TTS 없음).
   배경 음악(2026-11-28 사용자 확정, 화려판 *_orch): 1 wish_workshop · 2~4 deck_day · 5 noel_candle · 6 wenceslas_tiptoe · 7~8 wish_workshop · 9 noel_candle · 10~11 deck_dance · 12 wish_xmas.
   크기: 볼(분홍 원판) 크기를 재서 자세마다 높이를 맞췄다(구두장이 서기 225 = 1, 아내 .95, 요정 .42, 손님 1.05/.95/.98). 개발용 ?from=1~12 */
(() => {
  const AS = '../../assets/v3w/';
  const src = k => AS + k + '.webp';
  const FL = 490;
  const QS = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(''); } })();
  const L = typeof ES_LINES !== 'undefined' ? ES_LINES : {};
  const artOK = {};
  /* 볼 크기로 맞춘 자세별 높이(구두장이 서기 225)와 그림 비율(ASP.txt, post_tale.py 2026-11-28). preload 가 실제 비율로 다시 덮는다 */
  const HT0 = { es_c1_admire: 236, es_c1_leave: 236, es_c1_pay: 236, es_c1_stand: 236, es_c2_admire: 214, es_c2_pay: 214, es_c2_stand: 214, es_c3_admire: 228, es_c3_pay: 220, es_c3_stand: 220, es_ea_dress: 94, es_ea_dressed_dance: 94, es_ea_dressed_jump_chair: 82, es_ea_dressed_run_out: 94, es_ea_dressed_sing: 94, es_ea_dressed_smooth: 94, es_ea_dressed_stand: 94, es_ea_dressed_wave_back: 94, es_ea_hold_shoe_up: 104, es_ea_hop_table: 90, es_ea_joy_jump: 86, es_ea_look_side: 92, es_ea_run: 88, es_ea_sit_hammer: 76, es_ea_sit_hammer_b: 78, es_ea_sit_sew: 78, es_ea_sit_sew_b: 78, es_ea_stand: 94, es_ea_stand_puzzled: 94, es_ea_surprised: 94, es_eb_dress: 94, es_eb_dressed_dance: 94, es_eb_dressed_jump_chair: 84, es_eb_dressed_run_out: 94, es_eb_dressed_sing: 94, es_eb_dressed_smooth: 94, es_eb_dressed_stand: 94, es_eb_dressed_wave_back: 94, es_eb_hold_shoe_up: 102, es_eb_hop_table: 94, es_eb_joy_jump: 86, es_eb_look_side: 94, es_eb_run: 94, es_eb_sit_hammer: 86, es_eb_sit_hammer_b: 86, es_eb_sit_sew: 81, es_eb_sit_sew_b: 84, es_eb_stand: 94, es_eb_stand_puzzled: 94, es_eb_surprised: 94, es_sm_admire: 232, es_sm_coins: 225, es_sm_cut: 207, es_sm_cut_b: 207, es_sm_cut_small: 199, es_sm_greet: 225, es_sm_hammer: 225, es_sm_hammer_b: 225, es_sm_hide_peek: 238, es_sm_hide_peek_glad: 238, es_sm_hold_pair: 230, es_sm_inspect: 225, es_sm_place_gift: 225, es_sm_point_shelf: 225, es_sm_resolve: 232, es_sm_show_tiny: 232, es_sm_sigh: 225, es_sm_sit_ready: 225, es_sm_sleep: 124, es_sm_stand: 225, es_sm_surprised: 225, es_sm_talk: 225, es_sm_wave: 225, es_sm_wave_side: 225, es_sm_yawn: 225, es_wf_clap: 214, es_wf_clap_b: 214, es_wf_explain: 214, es_wf_hide_peek: 228, es_wf_hide_peek_glad: 228, es_wf_hold_cloth: 220, es_wf_hold_shirt: 220, es_wf_knit: 214, es_wf_light_candle: 214, es_wf_place_gift: 214, es_wf_sew: 204, es_wf_sew_b: 204, es_wf_shh: 214, es_wf_sleep: 90, es_wf_stand: 214, es_wf_suggest: 214, es_wf_surprised: 218, es_wf_wave: 218, es_wf_wave_side: 214, es_wf_worry: 214 };
  const ASP = { es_c1_admire: 0.45, es_c1_face: 0.995, es_c1_leave: 0.5083, es_c1_pay: 0.575, es_c1_stand: 0.4083, es_c2_admire: 0.4617, es_c2_face: 0.9983, es_c2_pay: 0.545, es_c2_stand: 0.4133, es_c3_admire: 0.59, es_c3_face: 0.835, es_c3_pay: 0.6267, es_c3_stand: 0.5167, es_ea_dress: 0.5533, es_ea_dressed_dance: 0.715, es_ea_dressed_jump_chair: 0.9267, es_ea_dressed_run_out: 0.69, es_ea_dressed_sing: 0.7783, es_ea_dressed_smooth: 0.4717, es_ea_dressed_stand: 0.4533, es_ea_dressed_wave_back: 0.6133, es_ea_face: 1.0917, es_ea_hold_shoe_up: 0.52, es_ea_hop_table: 0.7017, es_ea_joy_jump: 0.7433, es_ea_look_side: 0.585, es_ea_run: 0.6583, es_ea_sit_hammer: 0.62, es_ea_sit_hammer_b: 0.6217, es_ea_sit_sew: 0.725, es_ea_sit_sew_b: 0.6617, es_ea_stand: 0.45, es_ea_stand_puzzled: 0.5017, es_ea_surprised: 0.48, es_eb_dress: 0.63, es_eb_dressed_dance: 0.7083, es_eb_dressed_jump_chair: 0.885, es_eb_dressed_run_out: 0.66, es_eb_dressed_sing: 0.76, es_eb_dressed_smooth: 0.6383, es_eb_dressed_stand: 0.6267, es_eb_dressed_wave_back: 0.67, es_eb_face: 1.4267, es_eb_hold_shoe_up: 0.575, es_eb_hop_table: 0.7767, es_eb_joy_jump: 0.7817, es_eb_look_side: 0.7017, es_eb_run: 0.7133, es_eb_sit_hammer: 0.7533, es_eb_sit_hammer_b: 0.7533, es_eb_sit_sew: 0.8067, es_eb_sit_sew_b: 0.8067, es_eb_stand: 0.6283, es_eb_stand_puzzled: 0.68, es_eb_surprised: 0.6617, es_fg_coat_rack: 0.5317, es_fg_fir_garland: 3.2143, es_fg_lasts_hanging: 1.26, es_prop_bed: 1.8405, es_prop_bench: 2.2613, es_prop_blanket: 3.01, es_prop_candle_off: 0.885, es_prop_candle_on: 0.84, es_prop_chair: 0.6467, es_prop_clock_12: 0.7967, es_prop_clock_9: 0.7967, es_prop_clock_day: 0.7967, es_prop_cloth_red: 2.4862, es_prop_cloth_white: 2.4862, es_prop_coat_green: 1.095, es_prop_coat_red: 1.095, es_prop_coin_pouch: 0.8267, es_prop_coins: 1.075, es_prop_door_day: 0.9317, es_prop_door_open: 0.9317, es_prop_face_happy: 0.8217, es_prop_face_sad: 0.82, es_prop_fir_branch: 1.8828, es_prop_footprints: 2.3377, es_prop_hammer: 1.8443, es_prop_knitting: 0.8, es_prop_leather_cut_1: 2.069, es_prop_leather_cut_many: 1.6423, es_prop_leather_sheet: 1.17, es_prop_leather_small: 1.24, es_prop_match: 2.6471, es_prop_needle_thread: 1.355, es_prop_pair_brown: 1.833, es_prop_rags: 1.676, es_prop_scissors: 1.7613, es_prop_shelf: 0.9083, es_prop_shirt_l: 1.0867, es_prop_shirt_m: 1.155, es_prop_shirt_s: 1.0933, es_prop_shoe_blue: 1.8109, es_prop_shoe_boot: 1.8145, es_prop_shoe_box: 1.3017, es_prop_shoe_brown: 1.8109, es_prop_shoe_green: 1.8145, es_prop_shoe_last: 1.8634, es_prop_shoe_last_small: 1.5957, es_prop_shoe_red: 1.8109, es_prop_sock_l: 0.9617, es_prop_sock_m: 0.9617, es_prop_sock_s: 0.9617, es_prop_sparkle: 0.8883, es_prop_stool: 1.0167, es_prop_table: 2.069, es_prop_tiny_pair: 1.6917, es_prop_trousers_blue: 0.9033, es_prop_trousers_slate: 1.245, es_prop_vest_red: 0.8317, es_prop_vest_yellow: 0.8517, es_prop_wreath: 0.9183, es_sm_admire: 0.4233, es_sm_coins: 0.515, es_sm_cut: 0.64, es_sm_cut_b: 0.64, es_sm_cut_small: 0.54, es_sm_face: 0.9867, es_sm_greet: 0.6233, es_sm_hammer: 0.535, es_sm_hammer_b: 0.53, es_sm_hide_peek: 0.32, es_sm_hide_peek_glad: 0.32, es_sm_hold_pair: 0.645, es_sm_inspect: 0.4867, es_sm_place_gift: 0.6, es_sm_point_shelf: 0.5433, es_sm_resolve: 0.4833, es_sm_show_tiny: 0.4183, es_sm_sigh: 0.4467, es_sm_sit_ready: 0.5067, es_sm_sleep: 1.8367, es_sm_stand: 0.4233, es_sm_surprised: 0.64, es_sm_talk: 0.5667, es_sm_wave: 0.5183, es_sm_wave_side: 0.54, es_sm_yawn: 0.6083, es_wf_clap: 0.4217, es_wf_clap_b: 0.4217, es_wf_explain: 0.575, es_wf_face: 0.9733, es_wf_hide_peek: 0.25, es_wf_hide_peek_glad: 0.2517, es_wf_hold_cloth: 0.4317, es_wf_hold_shirt: 0.42, es_wf_knit: 0.5067, es_wf_light_candle: 0.68, es_wf_place_gift: 0.685, es_wf_sew: 0.555, es_wf_sew_b: 0.5483, es_wf_shh: 0.425, es_wf_sleep: 2.1127, es_wf_stand: 0.425, es_wf_suggest: 0.4467, es_wf_surprised: 0.4283, es_wf_wave: 0.4967, es_wf_wave_side: 0.51, es_wf_worry: 0.4133 };
  const HT = Object.assign({}, HT0, {
    es_prop_table: 135, es_prop_stool: 62, es_prop_chair: 125, es_prop_bench: 62, es_prop_bed: 130, es_prop_shelf: 215,
    es_prop_leather_sheet: 52, es_prop_leather_cut_1: 30, es_prop_leather_cut_many: 46, es_prop_leather_small: 26,
    es_prop_shoe_brown: 28, es_prop_pair_brown: 30, es_prop_shoe_red: 28, es_prop_shoe_blue: 28, es_prop_shoe_green: 28, es_prop_shoe_boot: 28,
    es_prop_shoe_box: 40, es_prop_coin_pouch: 42, es_prop_coins: 26, es_prop_candle_off: 66, es_prop_candle_on: 70, es_prop_match: 14,
    es_prop_clock_9: 84, es_prop_clock_12: 84, es_prop_clock_day: 84, es_prop_hammer: 40, es_prop_needle_thread: 30, es_prop_knitting: 40, es_prop_scissors: 24,
    es_prop_shoe_last: 28, es_prop_shoe_last_small: 18, es_prop_cloth_white: 30, es_prop_cloth_red: 30,
    es_prop_shirt_l: 112, es_prop_shirt_m: 78, es_prop_shirt_s: 44, es_prop_sock_l: 76, es_prop_sock_m: 52, es_prop_sock_s: 28,
    es_prop_coat_red: 30, es_prop_coat_green: 30, es_prop_vest_yellow: 28, es_prop_vest_red: 28, es_prop_trousers_blue: 30, es_prop_trousers_slate: 26, es_prop_tiny_pair: 14,
    es_prop_rags: 30, es_prop_face_happy: 96, es_prop_face_sad: 96, es_prop_door_open: 300, es_prop_door_day: 300, es_prop_wreath: 70, es_prop_fir_branch: 54,
    es_prop_sparkle: 60, es_prop_footprints: 34, es_fg_coat_rack: 290, es_fg_lasts_hanging: 92, es_fg_fir_garland: 110,
  });
  /* 보는 쪽(그림을 보고 정함, 2026-11-28). 정면은 방향을 못 바꾼다. 손에 든 소품이 있는 자세는 뒤집지 않는다(PLAN §3-3) */
  const NAT = {
    es_sm_stand: 'front', es_sm_sigh: 'front', es_sm_cut: 'front', es_sm_cut_b: 'front', es_sm_yawn: 'front', es_sm_sit_ready: 'right', es_sm_surprised: 'front', es_sm_inspect: 'right',
    es_sm_admire: 'front', es_sm_greet: 'left', es_sm_coins: 'right', es_sm_point_shelf: 'right', es_sm_hold_pair: 'front', es_sm_talk: 'left', es_sm_hide_peek: 'left', es_sm_hide_peek_glad: 'left',
    es_sm_resolve: 'left', es_sm_cut_small: 'front', es_sm_hammer: 'front', es_sm_hammer_b: 'front', es_sm_show_tiny: 'front', es_sm_place_gift: 'left', es_sm_wave_side: 'left', es_sm_wave: 'front',
    es_wf_stand: 'front', es_wf_worry: 'right', es_wf_surprised: 'front', es_wf_clap: 'front', es_wf_clap_b: 'front', es_wf_suggest: 'right', es_wf_light_candle: 'right', es_wf_shh: 'left',
    es_wf_hide_peek: 'left', es_wf_hide_peek_glad: 'left', es_wf_explain: 'right', es_wf_hold_cloth: 'front', es_wf_sew: 'front', es_wf_sew_b: 'front', es_wf_knit: 'front', es_wf_hold_shirt: 'front',
    es_wf_place_gift: 'left', es_wf_wave_side: 'left', es_wf_wave: 'front',
    es_ea_stand: 'front', es_ea_run: 'right', es_ea_hop_table: 'right', es_ea_look_side: 'right', es_ea_dressed_jump_chair: 'right', es_ea_dressed_run_out: 'left',
    es_eb_stand: 'front', es_eb_run: 'left', es_eb_hop_table: 'right', es_eb_look_side: 'left', es_eb_dressed_jump_chair: 'right', es_eb_dressed_run_out: 'left',
    es_c1_stand: 'right', es_c1_admire: 'right', es_c1_pay: 'right', es_c1_leave: 'left', es_c2_stand: 'right', es_c2_admire: 'right', es_c2_pay: 'right',
    es_c3_stand: 'right', es_c3_admire: 'right', es_c3_pay: 'right',
  };

  /* ================= 그림 ================= */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f] !== false) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    return T.el('rect', { x, y, width: w, height: h, rx: 10, fill: '#D9A94E' }, parent);
  }
  /* 바닥(cx, 발끝 by)에 높이 h 로 세운다 */
  const stand = (T, parent, f, cx, by, h = HT[f], o = {}) => { const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none', ...o }, parent); const w = h * (ASP[f] || 1); sprite(T, g, f, cx - w / 2, by - h, w, h); return g; };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  function glow(T, parent, cx, cy, r, color = '#F2B366', a = .85) {
    const svg = T.world.ownerSVGElement, id = 'esGlow' + color.replace('#', '') + String(a).replace('.', '');
    if (!svg.querySelector('#' + id)) {
      let defs = svg.querySelector('defs#esDefs'); if (!defs) { defs = T.el('defs', {}, svg); defs.id = 'esDefs'; }
      const g = T.el('radialGradient', { id }, defs);
      T.el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': a }, g); T.el('stop', { offset: '.45', 'stop-color': color, 'stop-opacity': a * .45 }, g); T.el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, g);
    }
    return T.el('circle', { cx, cy, r, fill: `url(#${id})`, 'pointer-events': 'none' }, parent);
  }

  /* ================= 배우 ================= */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, f]) => {
        const h = HT[f] || 100, w = h * (ASP[f] || 1), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, f, nat: NAT[f] || 'front' };
      });
    });
    a.want = 'left';
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    a.look = (k, d) => { Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; }); a.cur = k; a.h = looks[k].h; a.w = looks[k].w; a.turn(d || a.want); };
    a.look(Object.keys(poses)[0]);
    a.pos.style.pointerEvents = 'none';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  function put(T, a, x, y, { look, to, s = 1, parent } = {}) {
    (parent || T.world).appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = ''; a.body.style.filter = '';
    a.setScale(s); a.x = x; if (look) a.look(look, to || a.want); else a.turn(to || a.want);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  function hitZone(T, parent, cx, cy, w, h) {
    const g = T.el('g', {}, parent);
    T.el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 14, fill: '#000', 'fill-opacity': 0 }, g);
    return g;
  }

  async function run(T) {
    const { tr } = T;
    const RD = T.reading();
    T.cardSpeed(.6);
    /* 읽어 주기에서 화면이 꺼지면 쉼을 건너뛴다(타이머가 늘어져 멈춘 것처럼 되지 않게) */
    const sleep = ms => ((RD && document.hidden) ? Promise.resolve() : T.sleep(ms));
    const line = k => L[k] || k;
    /* 읽어 주기 + 화면 꺼짐: 끝이 있는 애니메이션은 바로 끝낸다(엔진 readPlay 와 같은 방식, 오류 기록 3 '읽어 주기 화면 꺼짐 시 멈춤') */
    const hidIv = RD ? setInterval(() => { if (!document.hidden) return; try { document.getAnimations().forEach(a => { const t = a.effect && a.effect.getComputedTiming(); if (t && isFinite(t.endTime) && a.playState === 'running') a.finish(); }); } catch (e) { /* 무시 */ } }, 300) : 0;
    const say = async (k, gap = 550) => { await T.say(line(k)); await sleep(gap); };
    const P = T.viewWidth() < 990;
    const VW = T.viewWidth();
    const PS = P ? Math.min(1, VW / 400) : 1;
    const X = (l, p) => (P ? p : l);
    /* 누르는 영역: 화면에서 짧은 변 86px 이상(무대 1단위가 화면 몇 px 인지 재서 키운다, §2) */
    const UPX = () => { try { const sv = T.world.ownerSVGElement, r = sv.getBoundingClientRect(); if (!r.width) return 1; return /meet/.test(sv.getAttribute('preserveAspectRatio') || '') ? Math.min(r.width / 1000, r.height / 560) : Math.max(r.width / 1000, r.height / 560); } catch (e) { return 1; } };   // 가로(meet)는 폭·높이 중 작은 쪽이 실제 배율(2026-11-28: 높이만 보면 가로에서 판이 70px 까지 작아질 수 있었다)
    const H = n => Math.max(n, 86 / (PS * UPX()));
    const setView = (lx = 500) => {
      T.fx.style.pointerEvents = 'none';
      const t = P ? `translate(500 ${FL}) scale(${PS}) translate(${-lx} ${-FL})` : '';
      [T.bg, T.world, T.fx].forEach(g => (t ? g.setAttribute('transform', t) : g.removeAttribute('transform')));
      T.camSnap(500, 280, 1);
    };
    const bgImage = key => T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);

    /* ---- 소리 ---- */
    const cue = (n, v = .5) => { try { return AudioFX.sfx(n, RD ? v * .8 : v); } catch (e) { return false; } };
    const SFX = ['el_es_bells_ring', 'el_es_candle_snuff', 'el_es_chair_hop', 'el_es_clock_midnight', 'el_es_coins_clink', 'el_es_door_creak', 'el_es_door_snow_open', 'el_es_dress_rustle',
      'el_es_elves_harp', 'el_es_elves_run', 'el_es_gift_tok', 'el_es_hammer_tiny', 'el_es_hide_pizz', 'el_es_joy_glock', 'el_es_knit_clicks', 'el_es_match_strike', 'el_es_morning_harp',
      'el_es_oh_whistle_up', 'el_es_puzzled_violin', 'el_es_resolve_triangle', 'el_es_scissors_leather', 'el_es_sew_rhythm', 'el_es_shelf_xylo_up', 'el_es_shoe_fly', 'el_es_shop_bell',
      'el_es_size_ding', 'el_es_sleep_pizz', 'el_es_snow_door_wind', 'el_es_spring_hop', 'el_es_stitch_tick', 'el_es_surprise_boing', 'el_es_tambourine_dance', 'el_es_tiny_footsteps_away',
      'el_es_window_glow', 'el_es_xylo_three', 'el_es_yawn_slide', 'xm_boop_soft', 'xm_ding_bell', 'xm_star_twinkle', 'xm_triangle_ta_da', 'xm_pizz_tiptoe', 'xm_whistle_slide_up',
      'xm_whistle_slide_down', 'xm_harp_gliss_up', 'xm_snow_wind_soft', 'xm_woodblock_tok', 'xm_woodblock_tok3', 'xm_xylo_up_swirl', 'xm_xylo_down3', 'xm_boing_cartoon', 'xm_wind_chime_snow', 'xm_cymbal_tap', 'xm_bells_fade_away', 'paper_turn'];
    try { AudioFX.preloadSfx(SFX); } catch (e) { /* 소리 없이 */ }
    /* 배경 음악: 화려판(_orch). 대사 동안은 엔진이 낮춘다. 읽어 주기는 한 단 낮게. 요정 노래 구절·시계 땡 동안만 잠깐 비킨다 */
    const MUS = { wish: 'el_es_wish_workshop_orch', deckDay: 'el_es_deck_day_orch', noel: 'el_es_noel_candle_orch', tiptoe: 'el_es_wenceslas_tiptoe_orch', dance: 'el_es_deck_dance_orch', xmas: 'el_es_wish_xmas_orch' };
    try { AudioFX.preloadMusic(Object.values(MUS)); } catch (e) { /* 음악 없이 */ }
    let musTok = 0, musName = '';
    const music = (k, vol = .2) => {
      const n = MUS[k]; musName = n; const tok = ++musTok; let tries = 0;
      const v = RD ? vol * .7 : vol;
      const go = () => { if (tok !== musTok) return; let h = null; try { h = AudioFX.bgm(n, { vol: v, fadeIn: 2, xfade: 2 }); } catch (e) { return; } if (!h && ++tries < 12) setTimeout(go, 900); };
      go();
    };
    const musDip = (sec, level = 0) => { try { const h = AudioFX.bgmNow(); if (h) h.dip(sec, level, .4); } catch (e) { /* 무시 */ } };
    const musVol = v => { try { const h = AudioFX.bgmNow(); if (h) h.setVol(RD ? v * .7 : v, 1.2); } catch (e) { /* 무시 */ } };
    const musOff = (f = 2) => { musTok++; try { AudioFX.stopBgm(f); } catch (e) { /* 무시 */ } };

    /* ---- 그림 불러오기 ---- */
    const BGS = ['es_bg_shop_evening', 'es_bg_shop_morning', 'es_bg_shop_day', 'es_bg_shop_night_lb', 'es_bg_shop_night', 'es_bg_shop_xmas'];
    const loads = [];
    [...BGS, ...Object.keys(ASP).map(k => k)].forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight && ASP[k]) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), T.sleep(5000)]);

    /* ---- 인물 ---- */
    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, `es_${who}_${p}`]));
    const sm = mk(T, pz('sm', ['stand', 'sigh', 'cut', 'cut_b', 'yawn', 'sit_ready', 'surprised', 'inspect', 'admire', 'greet', 'coins', 'point_shelf', 'hold_pair', 'talk', 'hide_peek', 'hide_peek_glad', 'resolve', 'cut_small', 'hammer', 'hammer_b', 'show_tiny', 'place_gift', 'wave_side', 'wave']));
    const wf = mk(T, pz('wf', ['stand', 'worry', 'surprised', 'clap', 'clap_b', 'suggest', 'light_candle', 'shh', 'hide_peek', 'hide_peek_glad', 'explain', 'hold_cloth', 'sew', 'sew_b', 'knit', 'hold_shirt', 'place_gift', 'wave_side', 'wave']));
    const ELF = ['stand', 'run', 'hop_table', 'sit_sew', 'sit_sew_b', 'sit_hammer', 'sit_hammer_b', 'hold_shoe_up', 'stand_puzzled', 'look_side', 'surprised', 'joy_jump', 'dress', 'dressed_stand', 'dressed_smooth', 'dressed_sing', 'dressed_dance', 'dressed_jump_chair', 'dressed_run_out', 'dressed_wave_back'];
    const ea = mk(T, pz('ea', ELF)), eb = mk(T, pz('eb', ELF));
    const c1 = mk(T, pz('c1', ['stand', 'admire', 'pay', 'leave'])), c2 = mk(T, pz('c2', ['stand', 'admire', 'pay'])), c3 = mk(T, pz('c3', ['stand', 'admire', 'pay']));
    const sleepers = { sm: mk(T, { s: 'es_sm_sleep' }), wf: mk(T, { s: 'es_wf_sleep' }) };
    const ALL = [sm, wf, ea, eb, c1, c2, c3, sleepers.sm, sleepers.wf];
    [sm, wf, c1, c2, c3].forEach(a => { a.gait = 'walk'; });   // 사람은 종이 인형 걸음(엔진 GSAP), 요정은 통통 뛰기를 동화가 준다
    [ea, eb].forEach(a => { a.gait = false; });
    const FA = k => '../../assets/v3w/es_' + k + '_face.webp';
    T.faceArt({ shoe: FA('sm'), wife: FA('wf'), elfa: FA('ea'), elfb: FA('eb'), custa: FA('c1'), custb: FA('c2'), custc: FA('c3') });
    ALL.forEach(hide);
    const ELVES = [ea, eb];
    const both = (k, da = 'right', db = 'left') => { ea.look(k, da); eb.look(k, db); };

    /* ---- 무대 ---- */
    const TX = () => X(440, 450);                    // 작업 탁자 가운데
    const TY = FL - 12;                              // 탁자 다리 끝
    const TOP = TY - HT.es_prop_table + 14;          // 탁자 윗면(소품·요정이 서는 곳)
    const RACK = () => X([760, 980], [700, 830]);    // 옷걸이 둘(아내, 구두장이 숨는 곳)
    let S = {};
    /* 방 차리기: 배경 + 시간대 빛 층 + 벽 소품(시계, 선반) + 탁자 */
    function room(bg, { tint = 0, tintColor = '#1E1630', clock = 'day', shelf = 0, xmas = false, table = true, racks = false, lx = 500, door = false } = {}) {
      T.clear(); S = {}; setView(lx);
      bgImage(bg);
      S.tint = T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: tintColor, opacity: tint, 'pointer-events': 'none' }, T.bg);
      S.lightL = T.el('g', { 'pointer-events': 'none' }, T.bg);            // 촛불 빛 층(벽에 번짐)
      S.clock = stand(T, T.bg, 'es_prop_clock_' + clock, X(640, 610), 160);
      if (xmas) { stand(T, T.bg, 'es_prop_wreath', 54, 252); stand(T, T.bg, 'es_prop_fir_branch', 360, 268); }
      if (door) S.door = stand(T, T.bg, door, 54, 466);
      S.back = T.el('g', {}, T.world);
      if (shelf != null && shelf !== false) { S.shelfX = X(760, 615); S.shelf = stand(T, S.back, 'es_prop_shelf', S.shelfX, FL - 34); S.shelfShoes = T.el('g', { 'pointer-events': 'none' }, S.back); shelfFill(shelf); }
      if (table) {
        S.table = stand(T, S.back, 'es_prop_table', TX(), TY);
        S.top = T.el('g', { 'pointer-events': 'none' }, S.back);             // 탁자 위 소품
      }
      S.front = T.el('g', { 'pointer-events': 'none' }, T.fx);
      if (racks) { const [r1, r2] = RACK(); S.rack1 = stand(T, S.front, 'es_fg_coat_rack', r1, FL + 46); S.rack2 = stand(T, S.front, 'es_fg_coat_rack', r2, FL + 50); S.rack2.setAttribute('transform', `translate(${2 * r2} 0) scale(-1 1)`); }
      stand(T, S.front, 'es_fg_lasts_hanging', X(920, 700), 98);              // 앞 가림: 오른쪽 위 줄에 걸린 구두 골
    }
    /* 선반 단(위에서부터 0,1,2): 단마다 구두가 놓이는 높이 */
    const shelfY = i => FL - 34 - HT.es_prop_shelf * [.70, .45, .17][i];
    function shelfFill(n) {   // n = 놓인 켤레 수(0~9)
      if (!S.shelfShoes) return;
      S.shelfShoes.innerHTML = '';
      const W = HT.es_prop_shelf * ASP.es_prop_shelf * .72;
      const COL = ['es_prop_pair_brown', 'es_prop_pair_brown', 'es_prop_tiny_pair'];
      for (let i = 0; i < n; i++) {
        const row = Math.floor(i / 3), col = i % 3;
        const g = stand(T, S.shelfShoes, i % 4 === 3 ? 'es_prop_shoe_box' : 'es_prop_pair_brown', S.shelfX - W / 2 + W * (col + .5) / 3, shelfY(row) + 4, i % 4 === 3 ? 34 : 28);
        if (COL && i === n - 1 && n > 0) g.animate([{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'translateY(0)' }], 360);
      }
    }
    const onTop = (f, x, h, o) => stand(T, S.top, f, x, TOP + 4, h, o);
    /* 촛불: 꺼짐/켜짐 + 빛 층(탁자와 벽에 걸쳐 번지게, 떠 있는 원판이 아니게) */
    function candle(x, lit) {
      if (S.candle) S.candle.remove();
      S.candleX = x;
      S.candle = onTop(lit ? 'es_prop_candle_on' : 'es_prop_candle_off', x);
      S.lightL.innerHTML = '';
      if (lit) {
        const yy = TOP - 60;
        glow(T, S.lightL, x, yy, 330, '#F2B366', .55);
        glow(T, S.lightL, x, yy, 140, '#F6D27A', .7);
        const fl = T.el('g', { 'pointer-events': 'none' }, S.back); glow(T, fl, x, yy + 4, 46, '#FBF3D5', .9); S.flame = fl;
        S.lightL.animate([{ opacity: .9 }, { opacity: 1 }, { opacity: .92 }], { duration: 1600, iterations: Infinity });
      } else if (S.flame) { S.flame.remove(); S.flame = null; }
    }
    const fadeIn = (g, ms = 400) => g.animate([{ opacity: 0 }, { opacity: 1 }], ms);
    const pop = (x, y, w) => { try { T.pop(x, y, tr(w)); } catch (e) { /* 무시 */ } };
    /* 2프레임 번갈기(가위·망치·바느질·손뼉) */
    const alt = async (a, k1, k2, n, ms, d, s) => { for (let i = 0; i < n; i++) { a.look(i % 2 ? k2 : k1, d); if (s && i % 2 === 0) cue(s, .4); await sleep(ms); } };
    /* 통통 뛰며 미끄러지기(걷기 그림 없음, 2026-11-24) */
    const scurry = async (a, x, y, ms) => {
      const n = Math.max(2, Math.round(ms / 260)); let alive = true;
      (async () => { for (let i = 0; i < n && alive; i++) { a.hop(8, 240); await sleep(260); } })();
      if (RD && document.hidden) { a.place(x, y); alive = false; return; }
      await a.move(x, y, ms, 'linear'); alive = false;
    };
    const cutPic = async (id, hold = 3600) => { if (RD && document.hidden) return; if (await T.preload(src(id))) { cue('xm_whistle_slide_up', .4); await T.cutImage([{ src: src(id), hold }]); } };
    const tint = (a, v) => { a.body.style.filter = v ? `brightness(${v})` : ''; };
    /* 세로: 옷걸이 하나 뒤에 아내가 남편 뒤(왼쪽)에 겹쳐 숨는다(좁은 화면에 두 사람 얼굴이 다 보이게) */
    const hideX = a => { const [r1, r2] = RACK(); return P ? (a === sm ? r1 - 100 : r1 - 165) : (a === sm ? r2 - 100 : r1 - 93); };
    const hideAt = (a, k) => { return put(T, a, hideX(a), FL + (a === sm ? 40 : 38), { look: k, to: 'left' }); };   // 그림 오른쪽 잘린 끝이 옷 뒤에 들어가고 얼굴은 옷 왼쪽으로 나온다
    const sparkle = (x, y, s = 70) => { const g = stand(T, T.fx, 'es_prop_sparkle', x, y, s); g.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1.1)', offset: .5 }, { opacity: 0, transform: 'scale(1)' }], { duration: 900, fill: 'forwards' }); g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center'; setTimeout(() => g.remove(), 1000); };
    /* 눈송이(코드 파티클): 창 안에서만 */
    function snow() {
      const id = 'esWin' + Math.random().toString(36).slice(2, 7), cp = T.el('clipPath', { id }, T.bg);
      T.el('rect', { x: 262, y: 40, width: 196, height: 212 }, cp);
      const g = T.el('g', { 'clip-path': `url(#${id})`, 'pointer-events': 'none' }, T.bg);
      for (let i = 0; i < 16; i++) {
        const r = [2, 3, 4][i % 3], x = 262 + Math.random() * 196, c = T.el('circle', { cx: x, cy: 30, r, fill: '#F4F6FA' }, g);
        c.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${(Math.random() - .5) * 30}px,240px)` }], { duration: 4000 + Math.random() * 3000, delay: -Math.random() * 6000, iterations: Infinity });
      }
    }

    /* ---- 조작: 읽어 주기면 저절로(안내 줄 대신 R 줄은 장면에서 따로) ---- */
    const askTap = async (k, el) => { if (RD) return; const b = el.animate([{ translate: '0 0' }, { translate: '0 -6px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity }); T.world.appendChild(el); await T.ask(line(k), () => T.tap(el, { prompt: line(k) })); b.cancel(); };
    const wiggle = n => n.animate([{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360).finished;
    async function choose(k, opts, wrong1, wrong2) {
      let miss = 0;
      const o = opts.map(c => ({ el: c.el, ok: c.ok, c, onWrong: async () => { cue('xm_boop_soft', .45); await wiggle(c.el); miss++; await say(miss === 1 ? wrong1 : wrong2, 200); } }));
      o.forEach(x => T.world.appendChild(x.el));
      const r = await T.ask(line(k), () => T.choose(o, { prompt: line(k) }));
      cue('el_es_size_ding', .5);
      return r.c;
    }

    /* ================= 1. 가죽 한 켤레 몫 (저녁) ================= */
    async function s1() {
      room('es_bg_shop_evening', { tint: .14, clock: 9, shelf: 0, lx: X(500, 520) });
      snow();
      S.bed = stand(T, S.back, 'es_prop_bed', X(860, 690), FL + 10);
      S.leather = onTop('es_prop_leather_sheet', TX() - 40);
      candle(TX() + 90, true);
      S.stool = stand(T, S.back, 'es_prop_stool', TX() - 70, FL + 22);
      put(T, sm, X(440, 470), FL + 30, { look: 'sigh', to: 'left' });
      put(T, wf, X(250, 370), FL + 26, { look: 'worry', to: 'right' });
      await T.curtain(true);
      music('wish', .2);
      await say('N1');
      await say('N2');
      await say('S1');
      sm.look('cut'); S.leather.remove();
      const sayN3 = say('N3');
      await alt(sm, 'cut', 'cut_b', 8, 380, null, 'el_es_scissors_leather');
      S.leather = onTop('es_prop_leather_cut_1', TX() - 40); fadeIn(S.leather);
      await sayN3;
      sm.look('yawn'); cue('el_es_yawn_slide', .45);
      await say('S2');
      /* 촛불 끄고 잠 */
      cue('el_es_candle_snuff', .5); candle(TX() + 90, false);
      S.tint.animate([{ opacity: .14 }, { opacity: .38 }], { duration: 900, fill: 'forwards' });
      musDip(30, .35);
      await sleep(500);
      [sm, wf].forEach(hide);
      const bx = X(860, 690);
      put(T, sleepers.wf, bx + 40, FL - 66, { look: 's', to: 'left' });   // 아내는 뒤(위)에, 구두장이는 앞에. 둘 다 머리 왼쪽
      put(T, sleepers.sm, bx - 15, FL - 26, { look: 's', to: 'left' });
      [sleepers.wf, sleepers.sm].forEach(a => fadeIn(a.pos, 600));
      cue('el_es_sleep_pizz', .45);
      await say('N4', 1200);
    }

    /* ================= 2. 아침의 구두 ================= */
    async function s2() {
      await T.sceneCard(tr('아침의 구두'), () => {
        room('es_bg_shop_morning', { clock: 'day', shelf: 0, lx: X(500, 420) });
        S.pair = onTop('es_prop_pair_brown', TX() + 10, 30);
        S.stool = stand(T, S.back, 'es_prop_stool', TX() - 60, FL + 22);
        put(T, sm, X(380, 360), FL + 30, { look: 'sit_ready', to: 'right' });
        put(T, wf, X(170, 250), FL + 24, { look: 'stand', to: 'right' });
      });
      music('deckDay', .2);
      cue('el_es_morning_harp', .45);
      await say('N5');
      sm.look('surprised'); sm.hop(10, 300); cue('el_es_surprise_boing', .5);
      S.pair.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px)' }, { transform: 'translateY(0)' }], { duration: 500, iterations: 2 });
      await say('N6');
      await say('S3');
      await cutPic('es_cut_morning_pair');
      sm.look('inspect', 'right'); S.pair.remove(); S.pair = onTop('es_prop_shoe_brown', TX() + 10);
      cue('el_es_xylo_three', .45);
      await say('N7');
      sm.look('admire'); S.pair.remove(); cue('xm_star_twinkle', .4);
      await say('S4');
      wf.look('surprised'); wf.hop(8, 300);
      await say('W1', 900);
    }

    /* ================= 3. 손님이 좋은 값을 ================= */
    async function s3() {
      await T.sceneCard(tr('손님이 좋은 값을'), () => {
        room('es_bg_shop_day', { clock: 'day', shelf: 0, lx: X(500, 380) });
        S.pair = onTop('es_prop_pair_brown', TX(), 30);
        put(T, sm, X(560, 470), FL + 30, { look: 'stand', to: 'left' });
        put(T, wf, X(760, 560), FL + 22, { look: 'stand', to: 'left' });
      });
      cue('el_es_shop_bell', .5);
      S.door = stand(T, T.bg, 'es_prop_door_day', 62, 466); fadeIn(S.door);
      put(T, c1, X(-60, 150), FL + 34, { look: 'stand', to: 'right' });
      const enter = c1.move(X(300, 290), FL + 34, 1400);
      sm.look('greet', 'left');
      await say('N8');
      await enter;
      c1.look('admire', 'right'); S.pair.remove(); cue('el_es_oh_whistle_up', .45);
      await say('C1');
      c1.look('pay', 'right');
      await say('C2');
      cue('el_es_coins_clink', .5); sm.look('coins', 'right');
      S.coins = stand(T, T.fx, 'es_prop_coins', sm.x + X(55, 50), FL - 120); fadeIn(S.coins);
      await say('N9');
      S.coins.remove();
      wf.look('clap'); alt(wf, 'clap', 'clap_b', 6, 260);
      await say('S5');
      /* 손님이 구두 상자를 안고 나간다 → 저녁 */
      c1.look('leave', 'left');
      await c1.move(X(-120, 120), FL + 34, 1400);
      hide(c1); S.door.remove();
      S.tint.setAttribute('fill', '#2A2040');
      S.tint.animate([{ opacity: 0 }, { opacity: .22 }], { duration: 1200, fill: 'forwards' });
      S.cut = onTop('es_prop_leather_cut_many', TX() - 20); fadeIn(S.cut);
      wf.look('stand', 'left');
      sm.look('cut');
      const n10 = say('N10');
      await alt(sm, 'cut', 'cut_b', 6, 380, null, 'el_es_scissors_leather');
      await n10;
      await sleep(600);
    }

    /* ================= 4. 밤마다 아침마다 + 짝 찾기 ================= */
    async function s4() {
      await T.sceneCard(tr('밤마다 아침마다'), () => {
        room('es_bg_shop_day', { clock: 'day', shelf: 1, lx: X(500, 520) });
        put(T, sm, X(560, 440), FL + 30, { look: 'stand', to: 'left' });
        put(T, wf, X(330, 330), FL + 22, { look: 'stand', to: 'right' });
      });
      cue('el_es_shelf_xylo_up', .45); shelfFill(2);
      await say('N11');
      /* 손님 둘 차례로 */
      for (const [c, k] of [[c2, 'C3'], [c3, 'C4']]) {
        cue('el_es_shop_bell', .4);
        put(T, c, X(-60, 150), FL + 34, { look: 'stand', to: 'right' });
        sm.look('greet', 'left');
        if (k === 'C3') { const m = c.move(X(200, 230), FL + 34, 1300); await say('N12'); await m; } else await c.move(X(200, 230), FL + 34, 1300);
        c.look('admire', 'right'); cue('el_es_oh_whistle_up', .4);
        await say(k, 300);
        c.look('pay', 'right'); cue('el_es_coins_clink', .45); await sleep(700);
        await c.move(X(-120, 110), FL + 34, 1100); hide(c);
      }
      sm.look('stand', 'right'); wf.look('clap');
      const n13 = say('N13');
      for (let n = 3; n <= 9; n++) { cue('el_es_shelf_xylo_up', .35); shelfFill(n); await sleep(700); }
      await n13;
      /* 짝이 섞임: 선반 가운데 단에 한 짝씩 셋 */
      shelfFill(6);
      wf.look('stand', 'right');
      await say('N14');
      sm.look('point_shelf', 'right');
      const W = HT.es_prop_shelf * ASP.es_prop_shelf * .72, sx = i => S.shelfX - W / 2 + W * (i + .5) / 3, sy = shelfY(2) + 6;
      const hold = (f) => { if (S.held) S.held.remove(); S.held = T.el('g', { 'pointer-events': 'none' }, T.world); const hx = sm.x - X(52, 50), hy = sm.y - 100; const g = stand(T, S.held, f, hx, hy, 32); g.setAttribute('transform', `translate(${2 * hx} 0) scale(-1 1)`); return [hx, hy]; };
      async function round(target, shoes, ask, after) {
        const [hx, hy] = hold(target);
        /* 고르는 세 짝: 선반 맨 아래 단에서는 서로 너무 붙어(가로 56px, 세로 휴대폰 36px) 판이 겹쳤다(2026-11-28 검수).
           고를 때는 세 짝이 선반 앞 바닥으로 톡 내려와 한 줄로 선다: 판 86px 이상, 판 사이 12px 이상, 세로 화면 오른쪽 끝 안 */
        const zw = H(80), csp = zw + 16 / (PS * UPX()), by = FL + 50;
        const right = P ? 520 + VW / (2 * PS) - zw / 2 - 8 : 1000 - zw / 2 - 8;
        const c0 = Math.min(S.shelfX, right - csp), cx = i => c0 + (i - 1) * csp, cy = Math.min(by - 15, 560 - zw / 2 - 2);
        const opts = shoes.map((f, i) => {
          const g = hitZone(T, T.world, cx(i), cy, zw, H(84));
          stand(T, g, f, cx(i), by, 30);
          if (!(RD && document.hidden)) g.animate([{ transform: `translate(${sx(i) - cx(i)}px,${sy - by}px)` }, { transform: `translate(${(sx(i) - cx(i)) / 2}px,${(sy - by) / 2 - 40}px)`, offset: .5 }, { transform: 'translate(0,0)' }], { duration: 450, delay: i * 90, easing: 'ease-in-out', fill: 'backwards' });
          return { el: g, ok: f === target, f, i };
        });
        let pick;
        if (RD) pick = opts.find(o => o.ok); else pick = await choose(ask, opts, 'X1', 'X2');
        /* 정답 구두가 날아가 손의 구두 옆에 나란히 */
        cue('el_es_shoe_fly', .5);
        pick.el.remove(); const px = cx(pick.i), fly = stand(T, T.world, pick.f, px, by, 30);
        if (!(RD && document.hidden)) await fly.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${(hx + 30 - px) / 2}px,-80px)`, offset: .5 }, { transform: `translate(${hx + 30 - px}px,${hy - by}px)` }], { duration: 650, easing: 'ease-in-out', fill: 'forwards' }).finished;
        opts.forEach(o => o.el.remove());
        cue('xm_ding_bell', .4);
        await after(fly);
      }
      if (RD) {
        cue('el_es_shelf_xylo_up', .4);
        await say('R1');
        sm.look('hold_pair'); shelfFill(9);
        await say('S7');
      } else {
        await round('es_prop_shoe_red', ['es_prop_shoe_green', 'es_prop_shoe_red', 'es_prop_shoe_blue'], 'A1', async fly => { fly.remove(); S.held.remove(); sm.look('hold_pair'); sm.hop(8, 300); await say('S6'); });
        sm.look('point_shelf', 'right');
        await round('es_prop_shoe_blue', ['es_prop_shoe_blue', 'es_prop_shoe_boot', 'es_prop_shoe_green'], 'A2', async fly => { await sleep(300); fly.remove(); S.held.remove(); sm.look('stand', 'left'); sm.hop(8, 300); shelfFill(9); cue('el_es_shelf_xylo_up', .4); await say('S7'); });
      }
      wf.look('clap'); alt(wf, 'clap', 'clap_b', 6, 260);
      sm.look('stand', 'left');
      await say('N15', 900);
    }

    /* ================= 5. 오늘 밤은 지켜보자 (크리스마스 전 저녁) ================= */
    async function s5() {
      await T.sceneCard(tr('오늘 밤은 지켜보자'), () => {
        room('es_bg_shop_evening', { tint: .16, clock: 9, shelf: 9, xmas: true, racks: true, lx: X(500, 545) });
        snow();
        S.cut = onTop('es_prop_leather_cut_many', TX() - 50);
        candle(TX() + X(-110, 70), false);   // 세로: 좁은 화면 안에 촛불(누르는 대상)이 들어오게
        put(T, sm, X(560, 520), FL + 30, { look: 'cut', to: 'left' });
        put(T, wf, X(330, 330), FL + 22, { look: 'stand', to: 'right' });
      });
      music('noel', .2);
      cue('xm_snow_wind_soft', .3);
      await say('N16');
      const n17 = say('N17');
      await alt(sm, 'cut', 'cut_b', 6, 380, null, 'el_es_scissors_leather');
      await n17;
      sm.look('talk', 'left');
      await say('S8');
      wf.look('suggest', 'right');
      await say('W2');
      /* 촛불 톡 */
      const cz = hitZone(T, T.world, S.candleX, TOP - 30, H(96), H(110));
      const lightUp = async () => {
        await wf.move(S.candleX - X(80, 70), FL + 22, 600); wf.look('light_candle', 'right');
        cue('el_es_match_strike', .5); await sleep(500);
        candle(S.candleX, true); cue('xm_star_twinkle', .45);
        S.tint.animate([{ opacity: .16 }, { opacity: .3 }], { duration: 900, fill: 'forwards' });
      };
      if (RD) { await lightUp(); await say('R2'); }
      else { await askTap('A3', cz); await lightUp(); }
      cz.remove();
      /* 둘이 옷 뒤로 숨는다 */
      wf.look('shh', 'left'); await sleep(300);
      cue('el_es_hide_pizz', .45);
      const [r1, r2] = RACK();
      const n18 = say('N18');
      await Promise.all([wf.move(hideX(wf), FL + 38, 1500), sm.move(hideX(sm), FL + 40, 1700)]);
      hideAt(wf, 'hide_peek'); hideAt(sm, 'hide_peek');
      await n18;
      await say('W3', 900);
    }

    /* ================= 6. 한밤의 요정들 (빛 상자) ================= */
    async function s6() {
      await T.sceneCard(tr('한밤의 요정들'), () => {
        room('es_bg_shop_night_lb', { tint: 0, clock: 12, shelf: 9, xmas: true, racks: true, lx: X(500, 545) });
        S.cut = onTop('es_prop_leather_cut_many', TX() - 30);
        candle(TX() + 100, true);
        const [r1, r2] = RACK();
        hideAt(wf, 'hide_peek'); hideAt(sm, 'hide_peek');
        tint(wf, .62); tint(sm, .62);
        hide(ea); hide(eb);
      });
      music('tiptoe', .16);
      musDip(3.5, .1); cue('el_es_clock_midnight', .5); pop(X(640, 600), 70, '땡!');
      await say('N19');
      cue('el_es_door_creak', .45);
      S.door = stand(T, T.bg, 'es_prop_door_open', 62, 466); fadeIn(S.door, 500);
      cue('el_es_elves_harp', .45);
      put(T, ea, X(70, 290), FL + 8, { look: 'run', to: 'right' }); put(T, eb, X(10, 250), FL + 12, { look: 'run', to: 'right' });
      const n20 = say('N20');
      cue('el_es_elves_run', .45); pop(X(240, 380), 300, '쪼르르');
      await Promise.all([scurry(ea, TX() - 110, FL + 8, 1800), scurry(eb, TX() - 160, FL + 12, 1900)]);
      await n20;
      /* 탁자 위로 폴짝 */
      both('hop_table', 'right', 'right'); cue('el_es_spring_hop', .45);
      const n21 = say('N21');
      await Promise.all([ea.move(TX() - 20, TOP + 4, 600, 'ease-out'), eb.move(TX() - 85, TOP + 4, 650, 'ease-out')]);
      S.cut.remove(); S.work = onTop('es_prop_leather_cut_1', TX() - 50, 22);
      ea.look('sit_sew', 'left'); eb.look('sit_hammer', 'right');
      if (!P && !(RD && document.hidden)) T.camTo(525, 330, 1.15, 900);   // 옷 뒤에 숨은 구두장이(x 880)까지 화면 안에(2026-11-28 검수: TX-40 이면 오른쪽 끝에서 잘려 'S9' 대사 중 안 보였다)
      await n21;
      const n22 = say('N22');
      pop(TX() - 50, TOP - 110, '땅땅땅');
      await Promise.all([alt(ea, 'sit_sew', 'sit_sew_b', 10, 330, 'left', 'el_es_sew_rhythm'), alt(eb, 'sit_hammer', 'sit_hammer_b', 10, 330, 'right', 'el_es_hammer_tiny')]);
      await n22;
      await cutPic('es_cut_elves_work');
      await say('S9');
      await say('W4');
      /* 다 만든 구두를 들어 올리고, 세워 두고, 후다닥 */
      S.work.remove(); both('hold_shoe_up'); cue('xm_triangle_ta_da', .45);
      const n23 = say('N23');
      await sleep(1100);
      S.made = onTop('es_prop_pair_brown', TX() - 50, 30); fadeIn(S.made);
      if (!P) T.camWide(700);
      both('run', 'left', 'left');
      await Promise.all([ea.move(TX() - 30, FL + 8, 400), eb.move(TX() - 95, FL + 12, 420)]);
      cue('el_es_elves_run', .45);
      await Promise.all([scurry(ea, X(40, 230), FL + 8, 1500), scurry(eb, X(0, 200), FL + 12, 1400)]);
      [ea, eb].forEach(a => a.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }));
      await n23;
      cue('el_es_door_creak', .35); S.door.remove();
      await sleep(700);
    }

    /* ================= 7. 고마움을 갚아요 (아침) ================= */
    async function s7() {
      await T.sceneCard(tr('고마움을 갚아요'), () => {
        room('es_bg_shop_morning', { clock: 'day', shelf: 9, lx: X(500, 470) });
        onTop('es_prop_pair_brown', TX() + 40, 30); onTop('es_prop_pair_brown', TX() - 40, 30);
        onTop('es_prop_cloth_white', TX() - 100); onTop('es_prop_knitting', TX() + 100);
        put(T, wf, X(300, 360), FL + 24, { look: 'explain', to: 'right' });
        put(T, sm, X(680, 560), FL + 30, { look: 'stand', to: 'left' });
        [ea, eb].forEach(hide);
      });
      music('wish', .2);
      cue('el_es_morning_harp', .4);
      await say('N24');
      await say('W5');
      wf.look('stand', 'right');
      await say('W6');
      wf.look('hold_cloth'); cue('xm_star_twinkle', .35);
      await say('W7');
      wf.look('explain', 'right');
      await say('W8');
      sm.look('resolve', 'left'); sm.hop(10, 300); cue('el_es_resolve_triangle', .5);
      await say('S10', 900);
    }

    /* ================= 8. 작은 옷과 작은 구두 (낮) ================= */
    async function s8() {
      await T.sceneCard(tr('작은 옷과 작은 구두'), () => {
        room('es_bg_shop_day', { clock: 'day', shelf: 9, lx: X(500, 470) });
        S.stoolW = stand(T, S.back, 'es_prop_stool', X(230, 330), FL + 18);
        S.stoolS = stand(T, S.back, 'es_prop_stool', X(790, 610), FL + 20);
        put(T, wf, X(230, 330), FL + 30, { look: 'sew', to: 'right' });
        put(T, sm, X(790, 610), FL + 34, { look: 'cut_small', to: 'left' });
      });
      const n25 = say('N25');
      await alt(wf, 'sew', 'sew_b', 6, 420, null, 'el_es_stitch_tick');
      wf.look('knit'); cue('el_es_knit_clicks', .4);
      await n25;
      wf.look('stand', 'right');
      /* 크기 고르기 1: 셔츠 셋(같은 흰색, 크기만 다름). 자리는 판마다 섞는다 */
      const sizeRound = async (kind, ask) => {
        const ks = ['l', 'm', 's'].sort(() => Math.random() - .5);
        const gap = X(120, 136), x0 = TX() - gap;   // 판(88 이상) 사이와 큰 셔츠 그림 사이를 12px 넘게(2026-11-28 검수: 가로 7px, 세로 휴대폰 겹침)
        const opts = ks.map((k, i) => {
          const f = `es_prop_${kind}_${k}`, x = x0 + gap * i;
          const g = hitZone(T, T.world, x, TOP - 46, H(88), H(110));
          stand(T, g, f, x, TOP + 4);
          g.animate([{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'translateY(0)' }], 360);
          return { el: g, ok: k === 's', f, x };
        });
        cue('paper_turn', .4);
        let pick;
        if (RD) pick = opts.find(o => o.ok); else { await sleep(300); pick = await choose(ask, opts, 'X3', 'X4'); }
        opts.forEach(o => { if (o !== pick) o.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }); });
        await sleep(400);
        opts.forEach(o => o.el.remove());
      };
      if (RD) {
        await sizeRound('shirt'); wf.look('hold_shirt'); await sizeRound('sock');
        await say('R3');
        wf.look('knit'); cue('el_es_knit_clicks', .4);
        await say('W10');
      } else {
        await sizeRound('shirt', 'A4');
        wf.look('hold_shirt'); wf.hop(8, 300);
        await say('W9');
        wf.look('stand', 'right');
        await sizeRound('sock', 'A5');
        wf.look('knit'); cue('el_es_knit_clicks', .4);
        await say('W10');
      }
      /* 구두장이: 작은 가죽 자르기 → 망치 톡 → 땅땅땅 */
      S.small = onTop('es_prop_leather_small', TX() + X(80, 60));
      S.lastS = onTop('es_prop_shoe_last_small', TX() + X(30, 20));
      const n26 = say('N26');
      await alt(sm, 'cut_small', 'cut_small', 2, 400, 'left', 'el_es_scissors_leather');
      await n26;
      const hx = TX() + X(120, 100);
      const hz = hitZone(T, T.world, hx, TOP - 12, H(96), H(84));
      stand(T, hz, 'es_prop_hammer', hx, TOP + 4);
      const ham = async () => {
        hz.remove(); musVol(.1);
        pop(sm.x - 60, sm.y - 250, '땅땅땅');
        await alt(sm, 'hammer', 'hammer_b', 6, 330, null, 'el_es_hammer_tiny');
        musVol(.2);
        S.small.remove(); S.lastS.remove();
        S.tiny = onTop('es_prop_tiny_pair', TX() + X(40, 30)); fadeIn(S.tiny); cue('xm_triangle_ta_da', .45);
        sm.look('show_tiny');
      };
      if (RD) { await ham(); await say('R4'); }
      else { await askTap('A6', hz); await ham(); }
      sm.hop(8, 300);
      await say('S11', 900);
    }

    /* 선물 차림(9·10장): 8장 옷 소품을 탁자 위에 가지런히 (PLAN 판단 12) */
    const GIFTS = [['es_prop_coat_red', -110], ['es_prop_vest_yellow', -80], ['es_prop_trousers_blue', -52], ['es_prop_sock_s', -26], ['es_prop_shirt_s', 0],
      ['es_prop_coat_green', 28], ['es_prop_vest_red', 56], ['es_prop_trousers_slate', 84], ['es_prop_tiny_pair', 112]];
    const giftAt = i => TX() - 14 + GIFTS[i][1] * .5;
    const gift = (i, h) => onTop(GIFTS[i][0], giftAt(i), GIFTS[i][0] === 'es_prop_shirt_s' ? 32 : GIFTS[i][0] === 'es_prop_sock_s' ? 22 : h);

    /* ================= 9. 선물을 놓고 숨어요 (저녁) ================= */
    async function s9() {
      await T.sceneCard(tr('선물을 놓고 숨어요'), () => {
        room('es_bg_shop_evening', { tint: .18, clock: 9, shelf: 9, xmas: true, racks: true, lx: X(500, 545) });
        snow();
        candle(TX() + 128, false);
        put(T, wf, X(280, 330), FL + 24, { look: 'place_gift', to: 'right' });
        put(T, sm, X(620, 580), FL + 30, { look: 'place_gift', to: 'left' });
      });
      music('noel', .2);
      await say('N27');
      const n28 = say('N28');
      S.gifts = [];
      for (let i = 0; i < GIFTS.length; i++) { const g = gift(i); fadeIn(g, 300); S.gifts.push(g); cue('el_es_gift_tok', .35); await sleep(420); }
      await n28;
      sm.look('talk', 'left');
      await say('S12');
      wf.look('shh', 'right');
      await say('W11');
      /* 촛불은 저절로 켜진다(톡 반복 안 함) */
      cue('el_es_match_strike', .45); candle(S.candleX, true); cue('xm_star_twinkle', .35);
      S.tint.animate([{ opacity: .18 }, { opacity: .32 }], { duration: 900, fill: 'forwards' });
      cue('el_es_hide_pizz', .45);
      const [r1, r2] = RACK();
      const n29 = say('N29');
      wf.look('stand', 'right'); sm.look('stand', 'right');
      await Promise.all([wf.move(hideX(wf), FL + 38, 1700), sm.move(hideX(sm), FL + 40, 1200)]);
      hideAt(wf, 'hide_peek'); hideAt(sm, 'hide_peek');
      await n29;
      await sleep(700);
    }

    /* 보통 밤 방(10·11장): 밝은 벽에 남색 밤 빛 층을 덮고 촛불 빛 층을 켠다 */
    const nightRoom = (o = {}) => room('es_bg_shop_night', { tint: .42, tintColor: '#171230', clock: 12, shelf: 9, xmas: true, racks: true, lx: X(500, 545), ...o });

    /* ================= 10. 요정들의 기쁨 ================= */
    async function s10() {
      await T.sceneCard(tr('요정들의 기쁨'), () => {
        nightRoom();
        candle(TX() + 128, true);
        S.gifts = GIFTS.map((_, i) => gift(i));
        const [r1, r2] = RACK();
        hideAt(wf, 'hide_peek_glad'); hideAt(sm, 'hide_peek_glad');
        tint(wf, .75); tint(sm, .75);
        hide(ea); hide(eb);
      });
      music('dance', .18);
      musDip(3, .15); cue('el_es_clock_midnight', .45); pop(X(640, 600), 70, '땡!');
      S.door = stand(T, T.bg, 'es_prop_door_open', 62, 466); fadeIn(S.door, 400);
      put(T, ea, X(70, 290), FL + 8, { look: 'run', to: 'right' }); put(T, eb, X(10, 250), FL + 12, { look: 'run', to: 'right' });
      const n30 = say('N30');
      cue('el_es_spring_hop', .45); pop(X(240, 380), 300, '폴짝');
      await Promise.all([scurry(ea, TX() - 120, FL + 8, 1700), scurry(eb, TX() - 170, FL + 12, 1800)]);
      both('hop_table', 'right', 'right'); cue('el_es_spring_hop', .45);
      /* 탁자 위: A 는 왼쪽, B 는 오른쪽에 서서 마주 본다(PLAN 판단 17, §3-3 look_side) */
      await Promise.all([ea.move(TX() - 108, TOP + 4, 600, 'ease-out'), eb.move(TX() + 78, TOP + 4, 800, 'ease-out')]);
      S.door.remove();
      both('stand');
      if (!P && !(RD && document.hidden)) T.camTo(TX() + 80, 330, 1.12, 900);   // 숨은 구두장이가 오른쪽 끝에서 잘리지 않게(2026-11-28 검수)
      await n30;
      both('stand_puzzled'); cue('el_es_puzzled_violin', .45);
      await say('N31');
      ea.look('stand_puzzled');
      await say('EA1');
      ea.look('look_side', 'right'); eb.look('look_side', 'left');
      await say('EB1');
      both('surprised'); cue('el_es_surprise_boing', .45);
      await sleep(500);
      /* 감정 고르기: 요정 둘 사이 위에 얼굴 카드 둘(자리는 판마다 바뀜) */
      if (RD) {
        await say('R5');
      } else {
        const ord = Math.random() < .5 ? ['happy', 'sad'] : ['sad', 'happy'];
        const cy = TOP - 175, cx0 = TX();
        cue('xm_xylo_up_swirl', .4);
        const cards = ord.map((k, i) => {
          const cx = cx0 + (i ? 1 : -1) * Math.max(X(66, 60), H(100) / 2 + 9 / (PS * UPX())), g = hitZone(T, T.world, cx, cy, H(100), H(122));   // 두 카드 사이 12px 이상
          stand(T, g, 'es_prop_face_' + k, cx, cy + 48);
          g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
          g.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 380, easing: 'ease-out' });
          return { el: g, ok: k === 'happy' };
        });
        await choose('A7', cards, 'X5', 'X6');
        cards.forEach(c => c.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.then(() => c.el.remove()));
      }
      both('joy_jump'); ELVES.forEach((a, i) => setTimeout(() => a.hop(22, 380), i * 120)); cue('el_es_joy_glock', .5);
      await say('N32');
      /* 새 옷을 두 손으로 들어 올리고 → 반짝 한 번 → 새 옷 차림(갈아입는 모습은 보이지 않음) */
      S.gifts.forEach(g => g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }));
      both('dress'); cue('el_es_dress_rustle', .45);
      const n33 = say('N33');
      await sleep(1300);
      ELVES.forEach(a => sparkle(a.x, a.y - 50, 90)); cue('xm_star_twinkle', .5);
      await sleep(350);
      both('dressed_stand', 'right', 'left');
      S.rags = onTop('es_prop_rags', TX(), 26); fadeIn(S.rags);
      await sleep(500);
      both('dressed_smooth'); cue('el_es_dress_rustle', .35);
      await n33;
      both('dressed_sing');
      await say('N34', 200);
      musDip(5, .05); cue('el_es_tambourine_dance', .4);
      ELVES.forEach((a, i) => setTimeout(() => a.hop(12, 320), i * 150));
      await say('EE1');
      await cutPic('es_cut_elves_dressed');
    }

    /* ================= 11. 춤추며 문 밖으로 ================= */
    async function s11() {
      await T.sceneCard(tr('춤추며 문 밖으로'), () => {
        nightRoom({ table: true });
        candle(TX() + 128, true);
        S.rags = onTop('es_prop_rags', TX(), 26);
        S.bench = stand(T, T.world, 'es_prop_bench', X(420, 420), FL + 46);
        S.chair = stand(T, T.world, 'es_prop_chair', X(570, 540), FL + 40);
        const [r1, r2] = RACK();
        hideAt(wf, 'hide_peek_glad'); hideAt(sm, 'hide_peek_glad');
        tint(wf, .75); tint(sm, .75);
        put(T, ea, X(310, 330), FL + 50, { look: 'dressed_dance' }); put(T, eb, X(250, 290), FL + 52, { look: 'dressed_dance' });
      });
      cue('el_es_tambourine_dance', .4);
      const n35 = say('N35');
      /* 걸상을 넘고 의자를 넘고: 폴짝(공중 자세로 포물선) */
      const jump = async (a, x1, y1) => {
        a.look('dressed_jump_chair', 'right'); cue('el_es_chair_hop', .45);
        if (!(RD && document.hidden)) {
          const x0 = a.x, y0 = a.y, peak = Math.min(y0, y1) - 120, f = a.flip * a.scale;
          a.pos.removeAttribute('transform');
          await a.pos.animate([{ transform: `translate(${x0}px,${y0}px) scale(${f},${a.scale})` }, { transform: `translate(${(x0 + x1) / 2}px,${peak}px) scale(${f},${a.scale})` }, { transform: `translate(${x1}px,${y1}px) scale(${f},${a.scale})` }], { duration: 750, easing: 'ease-in-out' }).finished;
        }
        a.place(x1, y1); a.look('dressed_dance');
      };
      await Promise.all([jump(ea, X(500, 490), FL + 50), sleep(250).then(() => jump(eb, X(470, 465), FL + 52))]);
      await Promise.all([jump(ea, X(650, 610), FL + 50), sleep(250).then(() => jump(eb, X(620, 585), FL + 52))]);
      await n35;
      musDip(2.5, .1);
      ELVES.forEach((a, i) => setTimeout(() => a.hop(20, 360), i * 120));
      await say('EE2');
      /* 문이 열리고 눈 내리는 밤 속으로 */
      cue('el_es_door_snow_open', .45);
      const dx = X(54, 300);
      S.door = stand(T, P ? T.world : T.bg, 'es_prop_door_open', dx, P ? FL + 10 : 466, P ? 280 : HT.es_prop_door_open); fadeIn(S.door, 500);
      if (P) T.world.insertBefore(S.door, S.back.nextSibling);
      both('dressed_run_out', 'left', 'left');
      const n36 = say('N36');
      cue('el_es_tiny_footsteps_away', .4);
      await Promise.all([scurry(ea, dx + 50, FL + 6, 2000), scurry(eb, dx + 10, FL + 8, 2100)]);
      both('dressed_wave_back'); cue('xm_wind_chime_snow', .35);
      await sleep(1100);
      ELVES.forEach(a => a.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }));
      await n36;
      /* 부부가 옷 뒤에서 나와 손을 흔든다 */
      const [r1, r2] = RACK();
      put(T, wf, X(r1 - 100, 560), FL + 30, { look: 'wave_side', to: 'left' }); put(T, sm, X(r2 - 110, 650), FL + 34, { look: 'wave_side', to: 'left' });
      tint(wf, .85); tint(sm, .85);
      [wf, sm].forEach(a => fadeIn(a.pos, 400));
      await say('S13');
      await say('W12');
      cue('xm_bells_fade_away', .3);
      await cutPic('es_cut_dance_out');
    }

    /* ================= 12. 그 뒤로 (크리스마스 아침) ================= */
    async function s12() {
      await T.sceneCard(tr('그 뒤로'), () => {
        room('es_bg_shop_xmas', { clock: 'day', shelf: 9, table: false, lx: X(500, 450) });
        /* 창밖 눈 위 작은 발자국 두 줄(판단 16) */
        const id = 'esFp', cp = T.el('clipPath', { id }, T.bg); T.el('rect', { x: 262, y: 150, width: 196, height: 100 }, cp);
        const fp = T.el('g', { 'clip-path': `url(#${id})` }, T.bg); stand(T, fp, 'es_prop_footprints', 360, 252);
        S.glowW = T.el('g', { 'pointer-events': 'none', opacity: 0 }, T.bg); glow(T, S.glowW, 360, 150, 220, '#F6D27A', .55);
        put(T, sm, X(540, 500), FL + 30, { look: 'stand', to: 'left' });
        put(T, wf, X(420, 400), FL + 24, { look: 'stand', to: 'right' });
      });
      music('xmas', .22);
      await say('N37');
      await say('N38');
      cue('el_es_window_glow', .45); S.glowW.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1200, fill: 'forwards' });
      await say('N39');
      /* 인사 톡: 두 사람을 한 상자로 */
      const done = () => { sm.look('wave'); wf.look('wave'); cue('el_es_bells_ring', .5); [sm, wf].forEach((a, i) => setTimeout(() => a.hop(14, 360), i * 120)); T.confetti(); };
      if (RD) { done(); await say('R6'); }
      else {
        const box = hitZone(T, T.world, (sm.x + wf.x) / 2, FL - 110, H(Math.abs(sm.x - wf.x) + 180), H(240));
        await askTap('A8', box); box.remove(); done();
      }
      await say('S14');
      await say('W13', 1200);
    }

    const SC = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12];
    const from = Math.max(1, Math.min(12, +QS.get('from') || 1));
    window.__es = { scene: 0, read: RD };
    const MSTART = [null, 'wish', 'deckDay', 'deckDay', 'deckDay', 'noel', 'tiptoe', 'wish', 'wish', 'noel', 'dance', 'dance', 'xmas'];
    try {
      for (let n = from; n <= 12; n++) {
        window.__es.scene = n;
        if (n === from && n > 1) {   // ?from= 로 중간부터: 첫 장면은 막을 열고 시작
          const real = T.sceneCard; T.sceneCard = async (l, ch) => { T.sceneCard = real; if (ch) ch(); await T.curtain(true); };
          music(MSTART[n]);
        }
        await SC[n - 1]();
        window.__es.done = n;
      }
    } finally { musOff(2.5); clearInterval(hidIv); }
    window.__es.scene = 13;
    await sleep(800);
    return '도움을 받았으면 고마운 마음을 갚아요.';
  }

  Tale.mount({ title: '구두장이와 요정', subtitle: '', read: true, run: T => run(Tale.api) });
})();
