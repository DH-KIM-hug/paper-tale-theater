/* 진저브레드맨 — 미국 민화 「The Gingerbread Boy」(1875 St. Nicholas) 계열. 기획: tales/gingerbread/PLAN.md (2026-11-26 확정). 그림 접두어 gb_ (assets/v3w/gb_*.webp)
   장면 11: 1 부엌 · 2 얼굴 꾸미기 · 3 오븐 · 4 집 앞 · 5 헛간 · 6 들판 · 7 소 · 8 돼지와 긴 줄 · 9 여우 · 10 여우가 가장 빨랐어요 · 11 눈 내리는 저녁. 컷 5장.
   조작(모두 T.ask: 안내와 누르기를 함께 연다): 2장 위치어 ×3(위·가운데·아래) · 3장 오븐 문 톡 · 4장 진저브레드맨 톡(반복 구절 시작) · 7장 빠른 쪽 고르기 · 8장 맨 뒤 고르기.
   대사: narration.js 의 GB_LINES(키 → 글), 장면별 순서 GB_ORDER(mk_script.py 가 만든다). 녹음 전: 클립이 없으면 말풍선만 읽을 만큼 띄우고 소리 없이 넘어간다(TTS 없음).
   진행 구조: 장면마다 B[n] = 줄 키(문자열)와 움직임(함수)·놀이 전용({p})·읽기 전용({r}) 항목의 목록. 놀이는 차례로 돌고, 읽어 주기는 read_script 의 go:<키>·tail:<n> 동사가
   같은 목록을 줄 사이사이 잘라 돈다(조작은 저절로). 먹는 장면은 보여 주지 않는다(입 벌림 → 눈가루가 화면을 덮음, PLAN 판단 1).
   이동: 걷기 그림 없이 미끄러짐 + 통통 튀기·앞으로 기울기(2026-11-24 결정), 크기는 바꾸지 않는다. 달리는 방향은 늘 왼쪽 → 오른쪽(3장 부엌 문으로 나갈 때만 왼쪽).
   음악(2026-11-28 확정, 화려판 *_orch): 1~3 Jingle Bells · 4~5 Jingle Bells 쫓기 · 6~8 Deck the Halls · 9~10 God Rest Ye(10장 "휙! 가로막았어요"부터 쉼) · 11 Jingle Bells 느린 판.
   개발용 ?from=1~11 (그 장면부터). */
(() => {
  const AS = '../../assets/v3w/';
  const src = k => AS + k + '.webp';
  const INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";
  const QS = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(''); } })();
  const L = typeof GB_LINES !== 'undefined' ? GB_LINES : {};
  const ORDER = typeof GB_ORDER !== 'undefined' ? GB_ORDER : {};
  const MODE = {}; Object.values(ORDER).forEach(list => list.forEach(([k, m]) => { MODE[k] = m; }));
  const artOK = {};

  /* ---------- 크기(HT): 같은 부위를 재서 맞춘 높이(CLAUDE.md §4-1, 2026-11-28 그림 도착 뒤). 기준 = 할머니 서기 270(아래 G 로 화면 크기 조정)
     진저브레드맨 = 머리 동그라미 폭(머리 위 23% 줄 안의 가장 넓은 폭, 서기 272/600), 사람 = 얼굴판(살색 한 조각) 폭과 높이의 평균,
     여우 = 볼 동그라미 지름(서기 57/600), 소 = 코 폭(서기 184/600). 돼지는 코가 귀와 같은 색이라 사진으로 견주어 정했다.
     PLAN §3-1 비율: 할머니 1 : 할아버지·일꾼 1.05 : 진저브레드맨 0.55 : 소(뿔 끝) 1.30 : 돼지 0.60 : 여우 서기 0.75. 모자 쓴 할아버지(arm_granny, shrug_l)와 옆모습(stand_r)은
     얼굴판이 가려 작게 잡혀(313~324) 서기 크기에 맞춰 300 으로 묶었다. 크기 시트(자세를 이 높이로 나란히)로 머리를 견주어 몇 개를 고쳤다(할머니 cutter 282→272, 할아버지 reach_run 305→295, 탈곡 a look_r 305→290, 돼지 pant 150→160, 여우 block_front 231→215, 진저브레드맨 stand_r·taunt 156→151) */
  const HT = {
    gb_man_stand_front: 149, gb_man_caught_front: 149, gb_man_cheer_front: 143, gb_man_dough: 149, gb_man_dough_face: 150, gb_man_face: 150, gb_man_jump_out: 140,
    gb_man_look_down_tray: 139, gb_man_point_fox: 151, gb_man_run_a: 147, gb_man_run_b: 145, gb_man_run_lookback: 150, gb_man_run_worried: 145, gb_man_skid: 150,
    gb_man_stand_r: 151, gb_man_taunt_stand: 151, gb_man_wave_back: 152,
    gb_prop_piece_smile: 149, gb_prop_piece_eyes: 149, gb_prop_piece_buttons: 149,
    gb_granny_stand_r: 270, gb_granny_cutter: 272, gb_granny_decorate: 270, gb_granny_knead: 273, gb_granny_oven_open: 274, gb_granny_pant: 267, gb_granny_point_tray: 274,
    gb_granny_reach_run: 255, gb_granny_sad_window: 260, gb_granny_shocked: 267, gb_granny_stand_l_sad: 286,
    gb_grandpa_stand_l: 284, gb_grandpa_arm_granny: 300, gb_grandpa_chair: 281, gb_grandpa_laugh_front: 292, gb_grandpa_pant: 273, gb_grandpa_point_r: 295, gb_grandpa_reach_run: 295,
    gb_grandpa_shrug_l: 300, gb_grandpa_sniff: 294, gb_grandpa_stand_r: 300,
    gb_thresher_a_stand_l: 284, gb_thresher_a_look_r: 290, gb_thresher_a_pant: 260, gb_thresher_a_reach_run: 275, gb_thresher_a_work: 277,
    gb_thresher_b_stand_l: 284, gb_thresher_b_look_r: 290, gb_thresher_b_pant: 275, gb_thresher_b_reach_run: 278, gb_thresher_b_work: 301,
    gb_mower_a_stand_l: 284, gb_mower_a_look_r: 284, gb_mower_a_pant: 272, gb_mower_a_reach_run: 273, gb_mower_a_work: 287,
    gb_mower_b_stand_l: 284, gb_mower_b_look_r: 292, gb_mower_b_pant: 264, gb_mower_b_reach_run: 263, gb_mower_b_work: 246,
    gb_cow_stand_l: 351, gb_cow_graze: 316, gb_cow_look_r: 360, gb_cow_pant: 351, gb_cow_run: 351,
    gb_pig_stand_l: 162, gb_pig_jump_over: 165, gb_pig_pant: 160, gb_pig_peek_fence: 190, gb_pig_run: 162,
    gb_fox_stand_l: 203, gb_fox_block_front: 215, gb_fox_ear_up: 203, gb_fox_lick: 214, gb_fox_lie: 119, gb_fox_mouth_open: 203, gb_fox_run: 157, gb_fox_stretch: 201, gb_fox_walk_away: 195,
    /* 소품(할머니 270 기준, PLAN §10-2) */
    gb_prop_table: 140, gb_prop_rocking_chair: 189, gb_prop_oven_closed: 324, gb_prop_oven_open: 324, gb_prop_flour_tin: 68, gb_prop_cutter: 70, gb_prop_rolling_pin: 26,
    gb_prop_haystack_snow: 300, gb_prop_haybale: 120, gb_prop_pigpen_fence: 150, gb_prop_flail_thrown: 110, gb_prop_scythe_down: 64, gb_prop_fence_gate: 170,
    gb_prop_wreath_door: 70, gb_prop_smell: 120,
    gb_fg_snowbank: 130, gb_fg_fir_branch_r: 220, gb_fg_fir_branch_l: 230, gb_fg_haybale: 150, gb_fg_reeds: 230, gb_fg_fence_post: 200, gb_fg_fir_sil: 190, gb_fg_chair_back: 220,
  };
  /* 화면 크기: 할머니 270 은 무대(높이 560)에서 너무 커 모든 인물·소품을 같은 비율로 줄인다(비율 그대로) */
  const G = .86;
  Object.keys(HT).forEach(k => { HT[k] = Math.round(HT[k] * G); });
  /* ASP.txt (post_tale.py, 2026-11-28). preload 가 실제 비율로 다시 덮는다 */
  const ASP = {};
  /* 보는 쪽(그림을 보고 정함, 2026-11-28). 정면은 방향을 못 바꾼다.
     주의: 탈곡 a·b, 풀 베는 a 의 'stand_l' 그림은 이름과 달리 오른쪽을 본다(_rej 원본을 뒤집은 판도 얼굴이 오른쪽). 4분의 3 얼굴이라 코드로 뒤집어 쓴다.
     돼지 jump_over 는 왼쪽을 본다(PLAN 은 오른쪽) → 코드로 뒤집는다 */
  const NAT = {
    gb_man_stand_front: 'front', gb_man_caught_front: 'front', gb_man_cheer_front: 'front', gb_man_jump_out: 'front', gb_man_look_down_tray: 'front', gb_man_face: 'front',
    gb_man_dough: 'front', gb_man_dough_face: 'front',
    gb_man_point_fox: 'right', gb_man_run_a: 'right', gb_man_run_b: 'right', gb_man_run_lookback: 'right', gb_man_run_worried: 'right', gb_man_skid: 'right', gb_man_stand_r: 'right',
    gb_man_taunt_stand: 'left', gb_man_wave_back: 'right',
    gb_granny_stand_r: 'right', gb_granny_cutter: 'right', gb_granny_decorate: 'right', gb_granny_knead: 'right', gb_granny_oven_open: 'right', gb_granny_pant: 'right',
    gb_granny_point_tray: 'right', gb_granny_reach_run: 'right', gb_granny_sad_window: 'left', gb_granny_shocked: 'front', gb_granny_stand_l_sad: 'left',
    gb_grandpa_stand_l: 'left', gb_grandpa_arm_granny: 'left', gb_grandpa_chair: 'left', gb_grandpa_laugh_front: 'front', gb_grandpa_pant: 'front', gb_grandpa_point_r: 'right',
    gb_grandpa_reach_run: 'right', gb_grandpa_shrug_l: 'front', gb_grandpa_sniff: 'front', gb_grandpa_stand_r: 'right',
    gb_thresher_a_stand_l: 'right', gb_thresher_a_look_r: 'right', gb_thresher_a_pant: 'right', gb_thresher_a_reach_run: 'right', gb_thresher_a_work: 'right',
    gb_thresher_b_stand_l: 'right', gb_thresher_b_look_r: 'right', gb_thresher_b_pant: 'right', gb_thresher_b_reach_run: 'right', gb_thresher_b_work: 'right',
    gb_mower_a_stand_l: 'right', gb_mower_a_look_r: 'right', gb_mower_a_pant: 'right', gb_mower_a_reach_run: 'right', gb_mower_a_work: 'right',
    gb_mower_b_stand_l: 'left', gb_mower_b_look_r: 'right', gb_mower_b_pant: 'right', gb_mower_b_reach_run: 'right', gb_mower_b_work: 'left',
    gb_cow_stand_l: 'left', gb_cow_graze: 'left', gb_cow_look_r: 'right', gb_cow_pant: 'right', gb_cow_run: 'right',
    gb_pig_stand_l: 'left', gb_pig_jump_over: 'left', gb_pig_pant: 'right', gb_pig_peek_fence: 'right', gb_pig_run: 'right',
    gb_fox_stand_l: 'left', gb_fox_block_front: 'front', gb_fox_ear_up: 'left', gb_fox_lick: 'front', gb_fox_lie: 'left', gb_fox_mouth_open: 'left', gb_fox_run: 'right',
    gb_fox_stretch: 'left', gb_fox_walk_away: 'right',
  };
  /* 무대 */
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  const bgY = sy => BGBOX.y + sy * BGBOX.h / 902;   // 배경 그림(1600×902) 안 y → 무대 y
  const bgX = sx => BGBOX.x + sx * BGBOX.w / 1600;

  /* ================= 그림 ================= */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f] !== false) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    return T.el('rect', { x, y, width: w, height: h, rx: 10, fill: '#D9A94E' }, parent);
  }
  const stand = (T, parent, f, cx, by, h = HT[f], o = {}) => { const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none', ...o }, parent); const w = h * (ASP[f] || 1); sprite(T, g, f, cx - w / 2, by - h, w, h); return g; };
  const standW = (T, parent, f, cx, by, w) => stand(T, parent, f, cx, by, w / (ASP[f] || 1));
  function glow(T, parent, cx, cy, r, color = '#F2B366', a = .85) {
    const svg = T.world.ownerSVGElement, id = 'gbGlow' + color.replace('#', '') + String(a).replace('.', '');
    if (!svg.querySelector('#' + id)) {
      let defs = svg.querySelector('defs#gbDefs'); if (!defs) { defs = T.el('defs', {}, svg); defs.id = 'gbDefs'; }
      const g = T.el('radialGradient', { id }, defs);
      T.el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': a }, g); T.el('stop', { offset: '.45', 'stop-color': color, 'stop-opacity': a * .45 }, g); T.el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, g);
    }
    return T.el('circle', { cx, cy, r, fill: `url(#${id})`, 'pointer-events': 'none' }, parent);
  }

  /* ================= 배우 ================= */
  /* body > rig(달릴 때 통통·기울기, 발끝 가운데 축) > 자세 그림들 */
  function mk(T, poses) {
    const looks = {};
    let rig;
    const a = T.actor(T.world, -400, 500, g => {
      rig = T.el('g', {}, g);
      rig.style.transformBox = 'fill-box'; rig.style.transformOrigin = '50% 100%';
      Object.entries(poses).forEach(([k, f]) => {
        const h = HT[f] || 200, w = h * (ASP[f] || 1), wrap = T.el('g', { filter: 'url(#pp)' }, rig);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, f, nat: NAT[f] || 'front' };
      });
    });
    a.rig = rig; a.want = 'right';
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    a.look = (k, d) => { if (!looks[k]) { console.warn('[gb] 자세 없음', k); return; } Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; }); a.cur = k; a.h = looks[k].h; a.w = looks[k].w; a.turn(d || a.want); };
    a.look(Object.keys(poses)[0]);
    a.pos.style.pointerEvents = 'none';            // 인물 그림은 누름을 받지 않는다(진저브레드맨 톡은 따로 투명 판)
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; stopRun(a); };
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); stopRun(a); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); a.x = x; if (look) a.look(look, to || a.want); else a.turn(to || a.want);
    a.place(x, y); a.body.style.transform = ''; a.body.style.opacity = '';
    return a;
  }
  /* 달리기 모습: rig 에 통통(위아래)과 앞으로 기울기. 화면에서 보는 방향 dir 쪽으로 기운다(뒤집힌 배우는 부호를 바꾼다) */
  function startRun(a, { amp = 5, period = 230, tilt = 7, dir } = {}) {
    stopRun(a);
    const d = (dir || a.want) === 'left' ? -1 : 1, deg = tilt * d * a.flip * -1 * -1;   // flip(-1)이면 몸이 거울이라 회전 부호가 바뀐다
    const r = (deg * (a.flip < 0 ? -1 : 1)).toFixed(1);
    a._run = a.rig.animate([{ transform: `translateY(0px) rotate(${r}deg)` }, { transform: `translateY(${-amp}px) rotate(${r}deg)` }, { transform: `translateY(0px) rotate(${r}deg)` }], { duration: period, iterations: Infinity });
  }
  function stopRun(a) { if (a && a._run) { a._run.cancel(); a._run = null; } }
  /* x 까지 미끄러져 달린다(크기 그대로). 걷기 그림 없음 */
  async function runTo(a, x, dur, o = {}) {
    if (o.look) a.look(o.look, o.to || (x >= a.x ? 'right' : 'left'));
    startRun(a, { dir: x >= a.x ? 'right' : 'left', ...o });
    try { await a.move(x, o.y == null ? a.y : o.y, dur, o.ease || 'ease-in-out'); } finally { if (!o.keep) stopRun(a); }
  }

  async function run(T) {
    const { sleep, tr } = T;
    T.cardSpeed(.6);
    const RD = T.reading();
    const GAP = 450;
    const line = k => L[k] || k;
    const say = async k => { await T.say(line(k)); await sleep(GAP); };
    const P = T.viewWidth() < 990;
    const VW = T.viewWidth();
    const PS = P ? Math.min(1, VW / 400) : 1;
    const X = (l, p) => (P ? p : l);
    const H = n => (P ? n / PS : n);
    /* 누르는 판 최소 크기(CLAUDE.md §2 짧은 변 80px 이상, 여유 두고 88px): 무대 1단위가 화면 몇 px 인지 재서 무대 단위로 바꾼다.
       세로(slice)는 높이 기준, 가로(meet)는 작은 쪽. setView 의 PS 배율까지 나눠 world 단위로 준다 */
    const stageK = () => { try { const sv = T.world.ownerSVGElement, r = sv.getBoundingClientRect(); if (!r.width) return 1; const m = /meet/.test(sv.getAttribute('preserveAspectRatio') || ''); return m ? Math.min(r.width / 1000, r.height / 560) : Math.max(r.width / 1000, r.height / 560); } catch (e) { return 1; } };
    const MINW = () => 88 / ((P ? PS : 1) * stageK());
    let LX = 500;
    const setView = (lx = 500) => {
      LX = P ? lx : 500;
      const t = P ? `translate(500 500) scale(${PS}) translate(${-lx} -500)` : '';
      [T.bg, T.world, T.fx].forEach(g => (t ? g.setAttribute('transform', t) : g.removeAttribute('transform')));
      T.fx.style.pointerEvents = 'none';
      T.camSnap(500, 280, 1);
    };
    const bgImage = key => T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const fg = (f, x, by, h, flip) => { const g = stand(T, T.fx, f, x, by, h); if (flip) g.setAttribute('transform', `translate(${2 * x} 0) scale(-1 1)`); return g; };

    /* ---- 소리(sounds/CREDITS.md 크리스마스 절) ---- */
    const SFX = ['el_gb_window_chime', 'el_gb_teacup', 'el_gb_rolling_pin', 'el_gb_cutter_press', 'el_gb_dough_pull', 'el_gb_piece_float', 'el_gb_stick_pops', 'el_gb_harp_done',
      'el_gb_oven_hum', 'el_gb_smell_harp', 'el_gb_sniff_kazoo', 'el_gb_oven_door', 'el_gb_jump_out', 'el_gb_land_timp', 'el_gb_run_out', 'el_gb_woodblock_run', 'el_gb_woodblock_slow',
      'el_gb_snow_crunch', 'el_gb_chorus_roll', 'el_gb_flail', 'el_gb_flail_throw', 'el_gb_scythe', 'el_gb_scythe_down', 'el_gb_cow_bell', 'el_gb_cow_munch', 'el_gb_cow_steps',
      'el_gb_fence_hop', 'el_gb_chime_pullback', 'el_gb_long_line_run', 'el_gb_skid', 'el_gb_fox_bass', 'el_gb_ear_ting', 'el_gb_stretch', 'el_gb_fox_zoom', 'el_gb_block_thump',
      'el_gb_snap_kazoo', 'el_gb_snow_burst', 'el_gb_tok_descend', 'el_gb_lip_smack', 'el_gb_harp_two_low', 'el_gb_fox_leave', 'el_gb_pant_slow', 'el_gb_window_ding', 'el_gb_oops_xylo',
      'xm_boing_cartoon', 'xm_boop_soft', 'xm_ding_bell', 'xm_star_twinkle', 'xm_triangle_ta_da', 'xm_whistle_slide_up', 'xm_whistle_slide_down', 'xm_cymbal_tap', 'xm_woodblock_tok',
      'xm_xylo_down3', 'xm_xylo_up_swirl', 'xm_harp_gliss_up', 'xm_wind_chime_snow', 'xm_snare_roll_short', 'xm_sleigh_bells', 'paper_turn', 'ding', 'pop'];
    try { AudioFX.preloadSfx(SFX); } catch (e) { /* 소리 없이 */ }
    const cue = (names, v = .6) => { if (RD && T.readInstant()) return false; for (const n of [].concat(names)) { try { if (AudioFX.sfx(n, RD ? v * .8 : v)) return true; } catch (e) { /* */ } } return false; };
    /* 배경 음악: 장면마다 곡(화려판 *_orch). 내레이션 동안은 엔진이 낮춘다(DUCK) */
    const MUS = { 1: 'el_gb_jingle_bake_orch', 2: 'el_gb_jingle_bake_orch', 3: 'el_gb_jingle_bake_orch', 4: 'el_gb_jingle_chase_orch', 5: 'el_gb_jingle_chase_orch',
      6: 'el_gb_deck_chase_orch', 7: 'el_gb_deck_chase_orch', 8: 'el_gb_deck_chase_orch', 9: 'el_gb_godrest_fox_orch', 10: 'el_gb_godrest_fox_orch', 11: 'el_gb_jingle_snow_orch' };
    try { AudioFX.preloadMusic([...new Set(Object.values(MUS))]); } catch (e) { /* 음악 없이 */ }
    const mVol = () => (RD ? .14 : .22);
    let mTok = 0, mName = '', mOff = false;
    const music = n => {
      if (mOff || !n || n === mName) return; mName = n; const t = ++mTok; let k = 0;
      const go = () => { if (t !== mTok || mOff) return; let h = null; try { h = AudioFX.bgm(n, { vol: mVol(), fadeIn: 2, xfade: 2 }); } catch (e) { return; } if (!h && ++k < 12) setTimeout(go, 1000); };
      go();
    };
    const musicStop = (f = 1.5) => { mTok++; mName = ''; try { AudioFX.stopBgm(f); } catch (e) { /* */ } };
    const musicDip = (sec = 1.4) => { try { const h = AudioFX.bgmNow && AudioFX.bgmNow(); if (h) h.dip(sec, .3, .1); } catch (e) { /* */ } };

    /* ---- 그림 불러오기 ---- */
    const BGS = ['gb_bg_kitchen', 'gb_bg_yard_snow', 'gb_bg_barn', 'gb_bg_field', 'gb_bg_pasture', 'gb_bg_pigpen_hill', 'gb_bg_forest_edge', 'gb_bg_evening_hill'];
    const EXTRA = ['gb_prop_piece_smile_cut', 'gb_prop_piece_eyes_cut', 'gb_prop_piece_buttons_cut', 'gb_prop_piece_shoes_cut', 'gb_prop_tray', 'gb_prop_dish_raisin', 'gb_prop_dish_candy', 'gb_prop_dish_sugar', 'gb_prop_sign_choice', 'gb_prop_oven_glow'];
    const loads = [];
    [...BGS, ...EXTRA, ...Object.keys(HT)].forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(6000)]);

    /* ---- 인물 ---- */
    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, `gb_${who}_${p}`]));
    const man = mk(T, pz('man', ['stand_front', 'run_a', 'run_b', 'run_lookback', 'taunt_stand', 'wave_back', 'skid', 'point_fox', 'run_worried', 'caught_front', 'cheer_front', 'jump_out', 'stand_r', 'look_down_tray']));
    const granny = mk(T, pz('granny', ['stand_r', 'sad_window', 'knead', 'cutter', 'decorate', 'point_tray', 'oven_open', 'shocked', 'reach_run', 'pant', 'stand_l_sad']));
    const grandpa = mk(T, pz('grandpa', ['stand_l', 'chair', 'sniff', 'point_r', 'reach_run', 'pant', 'shrug_l', 'stand_r', 'laugh_front', 'arm_granny']));
    const ws = ['stand_l', 'work', 'look_r', 'reach_run', 'pant'];
    const thA = mk(T, pz('thresher_a', ws)), thB = mk(T, pz('thresher_b', ws));
    const moA = mk(T, pz('mower_a', ws)), moB = mk(T, pz('mower_b', ws));
    const cow = mk(T, pz('cow', ['stand_l', 'graze', 'look_r', 'run', 'pant']));
    const pig = mk(T, pz('pig', ['stand_l', 'peek_fence', 'jump_over', 'run', 'pant']));
    const fox = mk(T, pz('fox', ['lie', 'ear_up', 'stretch', 'stand_l', 'run', 'block_front', 'mouth_open', 'lick', 'walk_away']));
    const ALL = [man, granny, grandpa, thA, thB, moA, moB, cow, pig, fox];
    const face = k => AS + k + '.webp';
    T.faceArt({ man: face('gb_man_face'), granny: face('gb_granny_face'), grandpa: face('gb_grandpa_face'), thresha: face('gb_thresher_face'), mowa: face('gb_mower_face'),
      cow: face('gb_cow_face'), pig: face('gb_pig_face'), fox: face('gb_fox_face') });   // 말풍선 얼굴 전용 그림(첫 그림이 얼굴이 아니어도 같은 얼굴)
    T.faces({ man, granny, grandpa, thresha: thA, threshb: thB, mowa: moA, mowb: moB, cow, pig, fox });
    ALL.forEach(hide);
    const cutPic = async (id, hold = 3600) => { if (await T.preload(src(id))) { cue('xm_wind_chime_snow', .45); await T.cutImage([{ src: src(id), hold }]); } };

    let S = {}, tok = 0;
    const alive = t => t === tok;
    /* 눈송이(코드 파티클): 흰 둥근 조각 세 크기, 느리게 */
    function snow(n = 18, dark = false) {
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx);
      for (let i = 0; i < n; i++) {
        const r = [3, 4.5, 6][i % 3], x = -40 + Math.random() * 1080, d = 7000 + Math.random() * 6000;
        const c = T.el('circle', { cx: x, cy: -20, r, fill: dark ? '#FBF3D5' : '#FFFFFF', opacity: dark ? .85 : .9 }, g);
        c.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${(Math.random() - .5) * 80}px, 620px)` }], { duration: d, delay: -Math.random() * d, iterations: Infinity });
      }
      return g;
    }
    /* 발밑 눈가루(달릴 때): 흰 조각 셋이 뒤로 튄다 */
    const puffs = (a, ms = 1600) => {
      if (document.hidden) return;
      const t0 = Date.now(), iv = setInterval(() => {
        if (Date.now() - t0 > ms || !a.pos.isConnected) { clearInterval(iv); return; }
        const back = a.want === 'left' ? 1 : -1;
        for (let i = 0; i < 3; i++) { const c = T.el('circle', { cx: a.x, cy: a.y - 4, r: 4 + i * 1.5, fill: '#FFFFFF', opacity: .9, 'pointer-events': 'none' }, T.fx); c.animate([{ transform: 'translate(0,0)', opacity: .9 }, { transform: `translate(${back * (20 + i * 14)}px, ${-10 - i * 6}px)`, opacity: 0 }], { duration: 420, fill: 'forwards' }).finished.then(() => c.remove()); }
      }, 300);
    };
    /* 반복 구절 효과 글자: 진저브레드맨 위에 두 줄이 통통(누름 안 받음) */
    function chant(a) {
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx);
      const half = P ? 190 / PS : 470, cx = P ? LX : Math.max(LX - half + 230, Math.min(LX + half - 230, a.x)), top = Math.max(70, Math.min(150, a.y - a.h * a.scale - 110));   // 하늘 띠(150 위)에 둔다: 진저브레드맨 머리 위에 맞추면 키 큰 탈곡하는 사람들 얼굴을 덮었다(2026-11-28 검수, 5장)
      const mkT = (t, y, size, fill) => { const n = T.el('text', { x: cx, y, 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill, stroke: '#FBF3D5', 'stroke-width': 7, 'paint-order': 'stroke', 'stroke-linejoin': 'round', 'font-family': FONT, 'letter-spacing': '2px', text: t }, g); n.style.transformBox = 'fill-box'; n.style.transformOrigin = 'center'; return n; };
      const en = tr('달려라 달려, 날 잡아 봐!') !== '달려라 달려, 날 잡아 봐!';
      const k = P ? .72 : 1, t1 = mkT(tr('달려라 달려, 날 잡아 봐!'), top, (en ? 34 : 44) * k, '#C8303A'), t2 = mkT(tr('나는 진저브레드맨!'), top + (en ? 44 : 54) * k, (en ? 26 : 36) * k, '#8A4A1F');
      [t1, t2].forEach((n, i) => n.animate([{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.1)', opacity: 1, offset: .6 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, delay: i * 500, fill: 'backwards', easing: 'ease-out' }));
      const bounce = t1.animate([{ translate: '0 0' }, { translate: '0 -8px' }, { translate: '0 0' }], { duration: 520, iterations: Infinity, delay: 500 });
      return () => { bounce.cancel(); g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).finished.then(() => g.remove()); };
    }
    /* 반복 구절 한 세트: 드럼롤 + 효과 글자(runPre) → 구절 'RUN'(한 클립, 줄 항목) → 챙(runPost). 읽어 주기에서도 같은 항목이 줄 앞뒤로 돈다 */
    let chantOff = null;
    const runPre = (a = man) => { cue('el_gb_chorus_roll', .5) || cue('xm_snare_roll_short', .5); a.look('run_lookback', 'right'); a.hop(10, 300); if (chantOff) chantOff(); chantOff = chant(a); };
    const runPost = () => { cue('xm_cymbal_tap', .45); if (chantOff) { chantOff(); chantOff = null; } };
    /* 뒤쫓는 줄: 왼쪽 밖에서 들어와 오른쪽 밖으로(배경에서 도는 일, 기다리지 않음) */
    function chase(list, y, { from = -140, to = 1180, dur = 4200, gap = 120, delay = 0 } = {}) {
      list.forEach(([a, k], i) => {
        const on = a.pos.isConnected && a.pos.style.display !== 'none';
        if (on) a.look(k, 'right'); else put(T, a, X(from, LX - 260) - i * gap, y, { look: k, to: 'right' });
        setTimeout(() => { if (a.pos.isConnected) runTo(a, X(to, LX + 300) + (list.length - i) * 10, dur, { amp: a === cow ? 3 : a === pig ? 5 : 4, period: a === cow ? 500 : a === pig ? 180 : 260, tilt: 5, ease: 'linear' }).then(() => hide(a)); }, delay + i * 160);
      });
      cue('el_gb_woodblock_slow', .35);
    }
    /* 오답 반응 */
    const wiggle = n => n.animate([{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360).finished;
    /* 누르는 고리(준비된 그림 gb_prop_sign_choice). 투명 판이 누름을 받는다(짧은 변 ≥ 90) */
    function ring(parent, cx, cy, d, label) {
      const g = T.el('g', {}, parent);
      const hd = Math.max(H(d), MINW());
      T.el('rect', { x: cx - hd / 2, y: cy - hd / 2, width: hd, height: hd, rx: 14, fill: '#000', 'fill-opacity': 0 }, g);
      const im = T.el('g', { 'pointer-events': 'none' }, g); sprite(T, im, 'gb_prop_sign_choice', cx - d / 2, cy - d / 2, d, d);
      im.animate([{ opacity: .55 }, { opacity: 1 }, { opacity: .55 }], { duration: 1400, iterations: Infinity });
      /* 낱말 꼬리표(위·가운데·아래): 세로 휴대폰은 엔진이 고를 것을 무대 아래 칸으로 꺼내 보여 주므로, 칸에서도 어느 자리인지 알 수 있게 */
      if (label) T.el('text', { x: cx + d / 2 + 10, y: cy + 9, 'font-size': 26, 'font-weight': 800, fill: INK, stroke: '#FBF3D5', 'stroke-width': 6, 'paint-order': 'stroke', 'font-family': FONT, 'pointer-events': 'none', text: tr(label) }, g);
      return g;
    }
    /* 인물 고르기 칸: 투명 누르기 판 + 인물 그림 사본(같은 자리·크기). 세로 휴대폰의 꺼낸 칸에 인물이 보이게 한다. 오답이면 이 사본이 흔들린다 */
    /* o.dx·o.fw: 큰 인물(소)의 판을 몸 한쪽으로 좁혀 옆 인물 판과 겹치지 않게(폭 비율 fw, 가운데 밀기 dx = 그림 폭의 비율) */
    function pickZone(a, who, o = {}) {
      const f = `gb_${who}_${a.cur}`, h = a.h, w = a.w, sw = w * a.scale, sh = h * a.scale;
      const g = zone(T.world, a.x + (o.dx || 0) * sw, a.y - sh / 2, Math.max(96, sw * (o.fw || .9)), Math.max(96, sh * .9));
      const c = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none', transform: `translate(${a.x} ${a.y}) scale(${a.flip * a.scale} ${a.scale})` }, g);
      sprite(T, c, f, -w / 2, -h, w, h);
      return g;
    }
    function zone(parent, cx, cy, w, h) { const g = T.el('g', {}, parent), zw = Math.max(H(w), MINW()), zh = Math.max(H(h), MINW()); T.el('rect', { x: cx - zw / 2, y: cy - zh / 2, width: zw, height: zh, rx: 14, fill: '#000', 'fill-opacity': 0 }, g); return g; }

    /* ================= 장면 차리기 ================= */
    const FK = X(522, 522);   // 부엌 바닥(발끝)
    function kitchen() { T.clear(); bgImage('gb_bg_kitchen'); S = {}; S.mid = T.el('g', {}, T.world); }
    /* 1장 부엌 */
    const DOUGH = { x: X(470, 425) };
    function s1() {
      kitchen(); setView(X(500, 400));
      stand(T, S.mid, 'gb_prop_rocking_chair', X(735, 560), FK - 4);
      S.ovenX = 905; stand(T, S.mid, 'gb_prop_oven_closed', S.ovenX, FK);
      S.tableTop = FK - HT.gb_prop_table * .93;
      standW(T, S.mid, 'gb_prop_table', DOUGH.x, FK, 260);
      stand(T, S.mid, 'gb_prop_flour_tin', DOUGH.x + 95, S.tableTop + 4);
      S.tray = standW(T, S.mid, 'gb_prop_tray', DOUGH.x - 10, S.tableTop + 6, 120);
      S.dough = T.el('g', {}, S.mid);
      put(T, granny, X(215, 270), FK, { look: 'sad_window', to: 'left' });
      put(T, grandpa, X(735, 560), FK - 6, { look: 'chair', to: 'left' });
      fg('gb_fg_chair_back', X(1010, 610), 590, HT.gb_fg_chair_back);
    }
    const B = {};
    B[1] = [
      () => { music(MUS[1]); cue('el_gb_window_chime', .45); },
      'S1-1',
      () => { cue('el_gb_teacup', .45); },
      'S1-2',
      () => { granny.look('stand_r', 'right'); granny.hop(6, 260); },
      'S1-3',
      async () => { grandpa.look('stand_l', 'left'); grandpa.place(grandpa.x, FK); cue('xm_boing_cartoon', .3); },
      'S1-4',
      async () => {
        await runTo(granny, DOUGH.x - 150, 700, { look: 'stand_r', amp: 3, tilt: 2 });
        granny.look('knead', 'right');
        const roll = setInterval(() => { granny.body.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], 500); }, 520);
        cue('el_gb_rolling_pin', .5); S.iv = roll;
      },
      'S1-5',
      async () => {
        clearInterval(S.iv); granny.look('cutter', 'right'); cue('el_gb_cutter_press', .6);
        const s1 = S; await sleep(500);
        if (S !== s1 || !s1.dough || !isFinite(s1.tableTop)) return;   // 읽어 주기 화면 꺼짐: 쉼 동안 다음 장면이 S 를 새로 만들면 그림 y 가 NaN 이 됐다(2026-11-28 검수, 3회 재현)
        cue('el_gb_dough_pull', .5);
        const d = stand(T, s1.dough, 'gb_man_dough', DOUGH.x - 10, s1.tableTop + 2, 52);
        d.animate([{ transform: 'translateY(-10px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], 400);
        await sleep(700);
      },
    ];

    /* 2장 얼굴 꾸미기(탁자 가까이): 쟁반을 세로로 놓고 반죽 위 세 자리(머리 = 위, 배 = 가운데, 발 = 아래) */
    const TR = { x: X(500, 500), y: X(300, 282), h: X(300, 372) };   // 반죽 그림 가운데·높이. 세로는 반죽을 키워 세 고리(88px 이상) 사이를 12px 넘게 띄운다(2026-11-28 검수)
    function s2() {
      kitchen(); setView(X(500, 500));
      T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#2E241C', opacity: .18, 'pointer-events': 'none' }, T.bg);   // 가까이: 뒤 벽을 살짝 어둡게
      /* 탁자 윗면(가까이 본 나무판) + 세로 쟁반 */
      T.el('rect', { x: -60, y: 395, width: 1120, height: 240, fill: '#E9DCC0', 'pointer-events': 'none' }, S.mid);
      const th = X(470, 556), tw = th / (ASP.gb_prop_tray || 1.95);
      const tg = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none', transform: `rotate(90 ${TR.x} ${TR.y})` }, S.mid);
      sprite(T, tg, 'gb_prop_tray', TR.x - th / 2, TR.y - tw / 2, th, tw);
      S.cookie = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, S.mid);
      const w = TR.h * (ASP.gb_man_dough || .717); S.cw = w;
      S.base = sprite(T, S.cookie, 'gb_man_dough', TR.x - w / 2, TR.y - TR.h / 2, w, TR.h);
      S.layers = T.el('g', {}, S.cookie);
      /* 접시 셋(건포도, 사탕, 설탕) */
      S.dish = {};
      [['eyes', 'gb_prop_dish_raisin'], ['buttons', 'gb_prop_dish_candy'], ['shoes', 'gb_prop_dish_sugar']].forEach(([k, f], i) => {
        const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, S.mid); const dw = X(120, 92);
        const [x, y] = P ? [[355, 540], [500, 548], [645, 540]][i] : [[690, 215], [705, 330], [690, 445]][i];
        sprite(T, g, f, x - dw / 2, y - dw / 1.22 / 2, dw, dw / 1.22); S.dish[k] = { g, x, y };
      });
      put(T, granny, X(215, 345), 590, { look: 'decorate', to: 'right', s: X(1.25, 1.05) });
      put(T, grandpa, X(865, 650), 590, { look: 'stand_l', to: 'left', s: X(1.25, 1.05) });
      if (P) { granny.pos.style.opacity = '.0'; grandpa.pos.style.opacity = '.0'; }
    }
    /* 조각 자리(반죽 그림 비율): 눈 = 머리 위쪽, 단추 = 배, 신발 = 발 */
    const SPOT = { eyes: .17, buttons: .55, shoes: .93 };
    const spotY = k => TR.y - TR.h / 2 + TR.h * SPOT[k];
    /* 붙인 조각: 반죽과 같은 오림의 조각 그림에서 그 조각만 오려 둔 그림(gb_prop_piece_*_cut, 2026-11-28 조각 그림 ↔ 반죽 차이로 만듦)을 반죽 위에 겹친다 */
    function addLayer(k) {
      const w = S.cw, x0 = TR.x - w / 2, y0 = TR.y - TR.h / 2;
      const g = T.el('g', {}, S.layers);
      sprite(T, g, 'gb_prop_piece_' + k + '_cut', x0, y0, w, TR.h);
      g.animate([{ opacity: 0 }, { opacity: 1 }], 300);
    }
    const flyTo = (f, x0, y0, x1, y1, size = 90, ms = 650) => {
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx), ig = T.el('g', { filter: 'url(#pp)' }, g);
      sprite(T, ig, f, -size / 2, -size / 2.44, size, size / 1.22);
      cue('xm_whistle_slide_up', .35);
      return g.animate([{ transform: `translate(${x0}px,${y0}px) scale(1)` }, { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 80}px) scale(.9)`, offset: .5 }, { transform: `translate(${x1}px,${y1}px) scale(.4)`, opacity: .2 }], { duration: ms, easing: 'ease-in', fill: 'forwards' }).finished.then(() => g.remove());
    };
    const POP_NOTE = { eyes: 'marimba_3', buttons: 'marimba_2', shoes: 'marimba_1' };
    async function place(k) {
      const d = S.dish[k]; await flyTo(k === 'eyes' ? 'gb_prop_dish_raisin' : k === 'buttons' ? 'gb_prop_dish_candy' : 'gb_prop_dish_sugar', d.x, d.y, TR.x, spotY(k), 80);
      cue('el_gb_stick_pops', .5) || cue(POP_NOTE[k], .5); addLayer(k);
    }
    /* 위치어 한 번(놀이): 접시가 반짝 → 안내 + 세 고리 고르기. 오답 = 흔들림 + 뿅 + 할머니 한 줄. 두 번째 오답부터 엔진이 정답을 반짝 */
    async function where(k, ask, ok, wrong) {
      const d = S.dish[k]; cue('el_gb_piece_float', .45);
      const bob = d.g.animate([{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 800, iterations: Infinity });
      granny.look('point_tray', 'right');
      const rings = T.el('g', {}, T.world);
      const opts = ['eyes', 'buttons', 'shoes'].map(s => {
        const el = ring(rings, TR.x, spotY(s), s === 'buttons' ? 108 : 100, { eyes: '위', buttons: '가운데', shoes: '아래' }[s]);
        return { el, ok: s === k, onWrong: async () => { cue('xm_boop_soft', .45); await wiggle(el); await say(wrong); } };
      });
      await T.ask(line(ask), () => T.choose(opts, { prompt: line(ask) }));
      rings.remove(); bob.cancel();
      await place(k); granny.look('decorate', 'right');
      await say(ok);
    }
    B[2] = [
      () => { music(MUS[2]); granny.look('decorate', 'right'); },
      'S2-1',
      async () => { cue('el_gb_piece_float', .4); await sleep(200); },
      'S2-2',
      async () => { cue('el_gb_stick_pops', .45); addLayer('smile'); await sleep(500); },
      { p: async () => { await where('eyes', 'S2-A1', 'S2-3', 'S2-W1'); await where('buttons', 'S2-A2', 'S2-4', 'S2-W2'); await where('shoes', 'S2-A3', 'S2-5', 'S2-W3'); } },
      { r: async () => { (async () => { for (const k of ['eyes', 'buttons', 'shoes']) { await place(k); await sleep(250); } })(); } },
      'S2-R',
      async () => {
        await sleep(300);
        cue('el_gb_harp_done', .55);
        S.layers.innerHTML = ''; S.base.setAttribute('href', src('gb_man_face'));   // 완성(같은 오림의 완성 그림)
        S.cookie.animate([{ filter: 'brightness(1.25)' }, { filter: 'brightness(1)' }], 700);
        grandpa.look('laugh_front'); grandpa.hop(6, 280);
      },
      'S2-6',
      async () => { cue('xm_xylo_up_swirl', .4); await cutPic('gb_cut_decorate'); },
    ];

    /* 3장 오븐 가까이 */
    const OV = { x: X(780, 600), by: 528, s: 1.12 };
    function s3() {
      kitchen(); setView(X(500, 540));
      S.oven = T.el('g', {}, S.mid);
      S.ovenImg = stand(T, S.oven, 'gb_prop_oven_closed', OV.x, OV.by, HT.gb_prop_oven_closed * OV.s);
      const oh = HT.gb_prop_oven_closed * OV.s; S.ovenWin = [OV.x, OV.by - oh * .42];
      put(T, granny, X(560, 440), OV.by, { look: 'stand_r', to: 'right', s: OV.s });
      put(T, grandpa, X(360, 330), OV.by, { look: 'sniff', to: 'right', s: OV.s });
      if (P) grandpa.pos.style.opacity = '0';
      fg('gb_fg_chair_back', X(30, 250), 600, HT.gb_fg_chair_back * 1.1, true);
    }
    const ovenOpen = async () => {
      cue('el_gb_oven_door', .7); musicDip(1.8);
      S.ovenImg.remove(); S.ovenImg = stand(T, S.oven, 'gb_prop_oven_open', OV.x, OV.by, HT.gb_prop_oven_closed * OV.s);
      const gl = glow(T, S.oven, S.ovenWin[0], S.ovenWin[1], 150, '#F2B366', .9); S.oven.insertBefore(gl, S.oven.firstChild);
      gl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: 'forwards' });
    };
    const jumpOut = async () => {
      put(T, man, S.ovenWin[0], S.ovenWin[1] + 40, { look: 'jump_out', s: OV.s });
      cue('el_gb_jump_out', .7);
      const lx = X(660, 560);
      await man.pos.animate([{ transform: `translate(${S.ovenWin[0]}px,${S.ovenWin[1] + 40}px) scale(${OV.s * .5})` }, { transform: `translate(${(S.ovenWin[0] + lx) / 2}px,${S.ovenWin[1] - 120}px) scale(${OV.s})`, offset: .5 }, { transform: `translate(${lx}px,${OV.by}px) scale(${OV.s})` }], { duration: 750, easing: 'ease-out' }).finished;
      man.place(lx, OV.by); cue('el_gb_land_timp', .6);
    };
    B[3] = [
      () => { music(MUS[3]); cue('el_gb_oven_hum', .4); },
      'S3-1',
      async () => {
        cue('el_gb_smell_harp', .45);
        S.smell = T.el('g', { 'pointer-events': 'none' }, T.fx);
        [0, 1, 2].forEach(i => { const g = T.el('g', {}, S.smell); stand(T, g, 'gb_prop_smell', 0, 0, 90); g.animate([{ transform: `translate(${S.ovenWin[0] - 20 + i * 30}px,${S.ovenWin[1]}px)`, opacity: 0 }, { opacity: .9, offset: .3 }, { transform: `translate(${grandpa.x + 40 - i * 40}px,${120}px)`, opacity: 0 }], { duration: 2600, delay: i * 500, iterations: 2 }); });
        cue('el_gb_sniff_kazoo', .45);
      },
      'S3-2',
      async () => { if (S.smell) S.smell.remove(); granny.look('oven_open', 'right'); },
      { p: async () => {
        const hz = zone(T.world, OV.x, OV.by - HT.gb_prop_oven_closed * OV.s * .45, 200, 230);
        const bob = S.oven.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity });
        await T.ask(line('S3-A'), () => T.tap(hz, { prompt: line('S3-A') }));
        bob.cancel(); hz.remove(); await ovenOpen();
      } },
      { r: async () => { granny.look('oven_open', 'right'); } },
      'S3-R',
      { r: ovenOpen },
      async () => { await jumpOut(); },
      'S3-3',
      async () => { man.look('stand_front'); man.hop(14, 320); },
      'S3-4',
      async () => { granny.look('shocked'); granny.hop(10, 260); cue('xm_boing_cartoon', .5); },
      'S3-5',
      async () => { grandpa.pos.style.opacity = ''; grandpa.look('point_r', 'right'); },
      'S3-6',
      async () => {
        cue('el_gb_run_out', .6); puffs(man, 900);
        runTo(man, X(-140, 260), 1300, { look: 'run_a', to: 'left', ease: 'ease-in', amp: 6, period: 220, tilt: 8 }).then(() => hide(man));
        granny.look('stand_r', 'left'); grandpa.look('point_r', 'left');
      },
      'S3-7',
      async () => { await cutPic('gb_cut_oven_jump'); },
    ];

    /* 4장 집 앞 눈길: 집 문(배경 x 155~285)에서 진저브레드맨이 달려 나온다 */
    const ROAD = 530;
    function outdoor(bg, lx) { T.clear(); bgImage(bg); S = {}; setView(lx); S.snow = snow(P ? 12 : 20); }
    function s4() {
      outdoor('gb_bg_yard_snow', X(500, 440));
      fg('gb_fg_snowbank', X(820, 600), 600, HT.gb_fg_snowbank);
      fg('gb_fg_fir_branch_r', X(940, 640), 210, HT.gb_fg_fir_branch_r);
    }
    B[4] = [
      async () => {
        music(MUS[4]); cue('el_gb_snow_crunch', .5);
        put(T, man, 230, ROAD - 40, { look: 'run_a', to: 'right' }); puffs(man, 1500);
        await runTo(man, X(600, 520), 1500, { amp: 6, period: 220, tilt: 8 });
        man.look('run_lookback', 'right');
        put(T, granny, X(200, 300), ROAD, { look: 'reach_run', to: 'right' }); put(T, grandpa, X(90, 230), ROAD + 8, { look: 'reach_run', to: 'right' });
        [granny, grandpa].forEach(a => { a.pos.animate([{ opacity: 0 }, { opacity: 1 }], 400); startRun(a, { amp: 4, period: 280, tilt: 4 }); });
        cue('el_gb_woodblock_slow', .35);
      },
      'S4-1',
      'S4-2',
      async () => { [granny, grandpa].forEach(stopRun); },
      { p: async () => {
        const hz = zone(T.world, man.x, man.y - man.h / 2, 130, 180);
        T.world.appendChild(hz);
        const bob = man.body.animate([{ translate: '0 0' }, { translate: '0 -8px' }, { translate: '0 0' }], { duration: 700, iterations: Infinity });
        await T.ask(line('S4-A'), () => T.tap(hz, { prompt: line('S4-A') }));
        bob.cancel(); hz.remove();
      } },
      () => runPre(),
      'RUN',
      () => runPost(),
      async () => {
        cue('el_gb_woodblock_run', .5); puffs(man, 1400);
        runTo(man, X(1150, 760), 1800, { look: 'run_a', to: 'right', amp: 6, period: 220, tilt: 8, ease: 'ease-in' }).then(() => hide(man));
        runTo(granny, X(470, 420), 2400, { amp: 4, period: 280, tilt: 4 }).then(() => granny.look('pant', 'right'));
        runTo(grandpa, X(340, 330), 2400, { amp: 4, period: 280, tilt: 4 });
      },
      'S4-3',
      async () => {
        granny.look('reach_run', 'right'); cue('el_gb_woodblock_slow', .35);
        runTo(granny, X(1150, 760), 2600, { ease: 'ease-in', amp: 4, period: 280, tilt: 4 }).then(() => hide(granny));
        await runTo(grandpa, X(1100, 740), 2700, { ease: 'ease-in', amp: 4, period: 280, tilt: 4 }); hide(grandpa);
      },
    ];

    /* 5장 헛간: 문 안에서 도리깨질 → 진저브레드맨이 지나가며 뽐냄 → 줄이 길어짐 */
    function s5() {
      outdoor('gb_bg_barn', X(500, 450));
      put(T, thA, X(250, 330), 470, { look: 'work', to: 'right' });
      put(T, thB, X(400, 450), 470, { look: 'work', to: 'right' });
      fg('gb_fg_haybale', X(980, 650), 610, HT.gb_fg_haybale);
    }
    /* 진저브레드맨이 왼쪽에서 달려 들어와 멈춘다 */
    async function enterMan(x, y = ROAD) {
      put(T, man, X(-120, LX - 260), y, { look: 'run_a', to: 'right' }); puffs(man, 1200);
      cue('el_gb_woodblock_run', .45);
      await runTo(man, x, 1500, { amp: 6, period: 220, tilt: 8, ease: 'ease-out' });
    }
    /* 장면 끝: 진저브레드맨이 오른쪽 밖으로, 뒤에 쫓는 줄 */
    function exitAll(runners, y = ROAD + 10) {
      cue('el_gb_woodblock_run', .5); puffs(man, 1400);
      man.look('run_a', 'right');
      runTo(man, X(1160, LX + 300), 1700, { amp: 6, period: 220, tilt: 8, ease: 'ease-in' }).then(() => hide(man));
      chase(runners, y, { delay: 500, dur: 3600, gap: 125 });
    }
    B[5] = [
      async () => {
        music(MUS[5]);
        const flail = setInterval(() => { [thA, thB].forEach((a, i) => setTimeout(() => a.body.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0)' }], 300), i * 200)); }, 700);
        cue('el_gb_flail', .5); S.iv = flail;
        enterMan(X(680, 560));
      },
      'S5-1',
      async () => { clearInterval(S.iv); cue('xm_ding_bell', .35); [thA, thB].forEach(a => { a.look('look_r', 'right'); a.hop(6, 240); }); man.look('taunt_stand', 'left'); },
      'S5-2',
      'S5-3',
      () => runPre(),
      'RUN',
      () => runPost(),
      async () => {
        cue('el_gb_flail_throw', .55);
        stand(T, T.world, 'gb_prop_flail_thrown', thA.x + 40, 486); T.world.appendChild(thA.pos); T.world.appendChild(thB.pos);
        exitAll([[thB, 'reach_run'], [thA, 'reach_run'], [grandpa, 'reach_run'], [granny, 'reach_run']]);
      },
      'S5-4',
      async () => { await sleep(1200); },
    ];

    /* 6장 들판: 왼쪽 갈대 앞에서 마른 풀 베기 */
    function s6() {
      outdoor('gb_bg_field', X(500, 420));
      put(T, moA, X(210, 310), 520, { look: 'work', to: 'right' });
      put(T, moB, X(360, 420), 528, { look: 'work', to: 'right' });
      fg('gb_fg_reeds', X(40, 240), 610, HT.gb_fg_reeds);
      fg('gb_fg_snowbank', X(760, 560), 610, HT.gb_fg_snowbank);
    }
    B[6] = [
      async () => {
        music(MUS[6]);
        S.iv = setInterval(() => { [moA, moB].forEach((a, i) => setTimeout(() => a.body.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(0)' }], 320), i * 220)); }, 760);
        cue('el_gb_scythe', .5);
        enterMan(X(700, 560));
      },
      'S6-1',
      async () => { clearInterval(S.iv); cue('xm_ding_bell', .35); moA.look('look_r', 'right'); moB.look('look_r', 'right'); moA.hop(6, 240); },
      'S6-2',
      async () => { man.look('run_lookback', 'right'); },
      'S6-3',
      () => runPre(),
      'RUN',
      () => runPost(),
      async () => {
        cue('el_gb_scythe_down', .55);
        stand(T, T.world, 'gb_prop_scythe_down', moA.x + 30, 540);
        exitAll([[moB, 'reach_run'], [moA, 'reach_run'], [thB, 'reach_run'], [thA, 'reach_run'], [grandpa, 'reach_run'], [granny, 'reach_run']]);
      },
      'S6-4',
      async () => { await sleep(1600); },
    ];

    /* 7장 소: 울타리 앞 건초 더미 옆에서 우물우물 → 비교(빠르다, 느리다) */
    function s7() {
      outdoor('gb_bg_pasture', X(500, 440));
      stand(T, T.world, 'gb_prop_haystack_snow', X(95, 300), 520);
      put(T, cow, X(250, 400), 540, { look: 'graze', to: 'left' });
      fg('gb_fg_fence_post', X(985, 650), 610, HT.gb_fg_fence_post);
    }
    B[7] = [
      async () => { music(MUS[7]); cue('el_gb_cow_munch', .5); enterMan(X(720, 560)); },
      'S7-1',
      async () => { cow.look('look_r', 'right'); cue('el_gb_cow_bell', .4); },
      'S7-2',
      async () => { man.look('taunt_stand', 'left'); },
      'S7-3',
      () => runPre(),
      'RUN',
      () => runPost(),
      async () => {
        /* 비교 보여 주기: 소는 느릿느릿(0.4), 진저브레드맨은 쌩쌩(1.0) 2초 — 둘 다 화면 안에 남는다 */
        cue('el_gb_cow_steps', .45); cue('el_gb_woodblock_run', .4);
        const c7 = runTo(cow, cow.x + X(80, 40), 2400, { look: 'run', to: 'right', amp: 3, period: 500, tilt: 3, ease: 'linear' }).then(() => cow.look('look_r', 'right'));
        put(T, man, man.x - X(260, 150), man.y, { look: 'run_a', to: 'right' }); puffs(man, 1000);
        const m7 = runTo(man, X(800, 600), 1100, { amp: 6, period: 220, tilt: 8, ease: 'ease-out' }).then(() => man.look('stand_front'));
        S.cmp7 = Promise.all([c7, m7]).catch(() => {});   // 고르기 판은 둘 다 멈춘 자리에서 만든다(달리는 중이면 판이 옛 자리에 생겨 소 판과 겹쳤다, 2026-11-28 검수)
      },
      'S7-4',
      { p: async () => {
        await sleep(400); if (S.cmp7) await S.cmp7;
        const zc = pickZone(cow, 'cow', P ? { dx: -.15, fw: .6 } : {}), zm = pickZone(man, 'man');   // 세로: 소 판을 엉덩이 쪽으로 좁혀 진저브레드맨 판과 떨어뜨린다
        const opts = [{ el: zc, ok: false, onWrong: async () => { cue('xm_boop_soft', .45); await wiggle(zc); await say('S7-W'); } }, { el: zm, ok: true }];
        await T.ask(line('S7-A'), () => T.choose(opts, { prompt: line('S7-A') }));
        zc.remove(); zm.remove();
        man.look('cheer_front'); man.hop(16, 340); cue('el_gb_jump_out', .5);
        await say('S7-5');
      } },
      async () => {
        man.look('run_a', 'right');
        exitAll([[cow, 'run'], [moB, 'reach_run'], [moA, 'reach_run'], [thB, 'reach_run'], [thA, 'reach_run'], [grandpa, 'reach_run'], [granny, 'reach_run']]);
        cue('el_gb_cow_bell', .35);
        await sleep(2000);
      },
    ];

    /* 8장 돼지와 긴 줄: 우리(배경 왼쪽) → 울타리 뛰어넘기 → 멀리 빠져 줄 전체(같은 비율로 작게) → 맨 뒤 고르기 */
    const LINE = () => {   // [배우, 자세, x] 앞(오른쪽) → 뒤(왼쪽). 맨 뒤 = 할머니
      const xs = P ? [752, 712, 588, 535, 495, 458, 422, 386, 348] : [920, 835, 700, 615, 545, 475, 405, 335, 265, 175];   // 돼지와 소 사이를 띄워 고르기 판이 겹치지 않게(2026-11-28 검수)
      return [[man, 'run_lookback'], [pig, 'run'], [cow, 'run'], [moA, 'reach_run'], [moB, 'reach_run'], [thA, 'reach_run'], [thB, 'reach_run'], [grandpa, 'reach_run'], [granny, 'reach_run']].map((r, i) => [...r, xs[i]]);
    };
    const lineY = x => 560 - (x - 100) * .2;   // 길이 왼쪽 아래 → 오른쪽 위로 오른다
    function s8() {
      outdoor('gb_bg_pigpen_hill', X(500, 330));
      put(T, pig, X(185, 220), 455, { look: 'peek_fence', to: 'right' });
      S.fence = stand(T, T.world, 'gb_prop_pigpen_fence', X(185, 220), 470);
      fg('gb_fg_snowbank', X(150, 320), 612, HT.gb_fg_snowbank);
    }
    const lineUp = () => {
      setView(X(500, 520));
      const sc = X(.56, .4);
      LINE().forEach(([a, k, x], i) => { put(T, a, x, lineY(x) - (P ? 30 : 0), { look: k, to: 'right', s: sc }); startRun(a, { amp: 3, period: a === cow ? 500 : a === pig ? 180 : 260 + i * 7, tilt: 3 }); });
      if (S.fence) S.fence.style.display = 'none';
    };
    B[8] = [
      async () => { music(MUS[8]); pig.hop(8, 260); enterMan(X(560, 470)); },
      'S8-1',
      async () => {
        pig.look('jump_over', 'right'); cue('el_gb_fence_hop', .55);
        const jx = X(120, 70);
        await pig.pos.animate([{ transform: `translate(${pig.x}px,${pig.y}px) scale(-1,1)` }, { transform: `translate(${pig.x + jx / 2}px,${pig.y - 50}px) scale(-1,1)`, offset: .5 }, { transform: `translate(${pig.x + jx}px,${ROAD}px) scale(-1,1)` }], { duration: 700, easing: 'ease-in-out' }).finished;
        pig.place(pig.x + jx, ROAD); pig.look('run', 'right');
      },
      'S8-2',
      async () => { man.look('run_lookback', 'right'); },
      'S8-3',
      () => runPre(),
      'RUN',
      () => runPost(),
      async () => {
        /* 멀리 빠지기: 사진 넘기듯 카메라가 물러나며 줄 전체 */
        cue('el_gb_chime_pullback', .5);
        await T.sceneCard('', lineUp);
        cue('el_gb_long_line_run', .45);
      },
      'S8-4',
      { p: async () => {
        const L8 = LINE(), pick = [granny, cow, pig];
        pick.forEach(stopRun);
        const opts = pick.map(a => {
          const el = pickZone(a, a === granny ? 'granny' : a === cow ? 'cow' : 'pig', a === cow ? { dx: -.08, fw: .7 } : {});
          return { el, ok: a === granny, onWrong: async () => { cue('xm_boop_soft', .45); await wiggle(el); await say('S8-W'); } };
        });
        await T.ask(line('S8-A'), () => T.choose(opts, { prompt: line('S8-A') }));
        opts.forEach(o => o.el.remove()); pick.forEach(a => startRun(a, { amp: 3, period: 260, tilt: 3 }));
        granny.hop(14, 300); setTimeout(() => man.hop(14, 300), 300); cue('xm_triangle_ta_da', .45);
        await say('S8-5');
        void L8;
      } },
      'S8-R',
      async () => { ALL.forEach(stopRun); await cutPic('gb_cut_chase_line'); },
    ];

    /* 9장 숲가 여우: 오른쪽 큰 나무 아래 여우(누움) — 처음으로 마주 본다 */
    const TREE = X(780, 600);
    function s9() {
      outdoor('gb_bg_forest_edge', X(500, 470));
      put(T, fox, TREE, 540, { look: 'lie', to: 'left' });
      fg('gb_fg_fir_branch_l', X(70, 330), 230, HT.gb_fg_fir_branch_l);
    }
    B[9] = [
      async () => {
        music(MUS[9]);
        put(T, man, X(-120, 230), ROAD, { look: 'run_a', to: 'right' }); puffs(man, 1200); cue('el_gb_woodblock_run', .45);
        await runTo(man, X(360, 380), 1500, { amp: 6, period: 220, tilt: 8, ease: 'ease-out' });
        man.look('skid', 'right'); cue('el_gb_skid', .55); puffs(man, 500);
        await man.move(man.x + 25, man.y, 300, 'ease-out');
        cue('el_gb_fox_bass', .55);
      },
      'S9-1',
      async () => { man.look('point_fox', 'right'); },
      'S9-2',
      async () => { man.look('taunt_stand', 'right'); fox.look('ear_up', 'left'); cue('el_gb_ear_ting', .5); },
      'S9-3',
      () => runPre(),
      'RUN',
      () => { runPost(); man.look('taunt_stand', 'right'); },
      async () => { fox.look('stretch', 'left'); cue('el_gb_stretch', .5); },
      'S9-4',
      'S9-5',
      async () => { fox.look('stand_l', 'left'); },
      'S9-6',
      async () => { fox.look('stretch', 'left'); cue('el_gb_stretch', .4); await sleep(500); await runTo(fox, X(600, 520), 1400, { look: 'stand_l', to: 'left', amp: 2, period: 380, tilt: 1 }); },   // 천천히 일어나 다가온다
      'S9-7',
      async () => { await cutPic('gb_cut_fox_stretch'); },
    ];

    /* 10장 여우가 가장 빨랐어요: 진저브레드맨이 여우 옆을 지나 오른쪽으로 → 여우가 순식간에 앞질러 가로막음 → 입 벌림(이빨 없음) → 눈가루가 화면을 덮음 */
    function s10() {
      outdoor('gb_bg_forest_edge', X(500, 560));
      put(T, man, X(300, 380), ROAD, { look: 'taunt_stand', to: 'right' });
      put(T, fox, X(600, 520), 540, { look: 'stand_l', to: 'left' });
      fg('gb_fg_fir_branch_l', X(70, 330), 230, HT.gb_fg_fir_branch_l);
    }
    /* 눈가루 덮기: 흰 둥근 조각 40개가 아래에서 위로 퍽 → 덮였다가 흩어짐(코드 파티클) */
    /* 눈가루 퍽(10장): 먹는 모습은 보이지 않게 여우와 진저브레드맨 둘레만 눈 조각이 잠깐 덮는다.
       2026-11-28 사용자 결정: 화면 전체를 2~3초 덮던 것(흰 판 + 큰 조각 40개)을 1초 안쪽, 여우 둘레만으로 줄였다.
       덮인 사이(0.35초)에 진저브레드맨을 숨기고 여우 입을 다문다. 끝나면 조각은 스스로 지운다 */
    function snowBurst() {
      const cx = (fox.x + man.x) / 2, cy = ROAD - 95, done = () => { hide(man); fox.look('block_front'); };
      cue('el_gb_snow_burst', .7) || cue('xm_cymbal_tap', .5);
      if (document.hidden) { done(); return sleep(50); }
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx);
      for (let i = 0; i < 24; i++) {
        const ang = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random());
        const x = cx + Math.cos(ang) * 120 * d, y = cy + Math.sin(ang) * 95 * d, r = 26 + Math.random() * 26;
        const c = T.el('circle', { cx: x, cy: ROAD, r, fill: i % 3 ? '#FFFFFF' : '#DCEBF5', opacity: 0 }, g);
        c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';   // 줄고 커질 때 제자리에서(SVG 기본은 원점 기준이라 왼쪽 위로 날아갔다)
        const dx = (x - cx) * .9, dy = (y - cy) * .9 - 40;
        c.animate([
          { transform: 'translate(0px,0px) scale(.3)', opacity: 0 },
          { transform: `translate(0px,${y - ROAD}px) scale(1)`, opacity: 1, offset: .32 },
          { transform: `translate(0px,${y - ROAD}px) scale(1)`, opacity: 1, offset: .5 },
          { transform: `translate(${dx}px,${y - ROAD + dy}px) scale(.6)`, opacity: 0 }
        ], { duration: 850, easing: 'ease-out', fill: 'forwards', delay: Math.random() * 60 });
      }
      setTimeout(done, 340);
      return sleep(920).then(() => g.remove());
    }
    const unBurst = async () => { /* 2026-11-28: 눈가루가 스스로 걷힌다(옛 화면 덮개 걷기 자리) */ };
    const small = k => { try { const b = document.getElementById('bubbleText'); if (b) b.style.fontSize = k ? `${k}em` : ''; } catch (e) { /* */ } };
    B[10] = [
      async () => {
        music(MUS[10]); cue('el_gb_woodblock_run', .5); puffs(man, 2000);
        fox.look('stand_l', 'left');
        const run1 = runTo(man, X(720, 640), 2000, { look: 'run_worried', to: 'right', amp: 6, period: 220, tilt: 8, ease: 'linear', keep: true });
        await sleep(1300); fox.look('stand_l', 'right');   // 지나가는 진저브레드맨을 따라 고개를 돌린다
        await run1;
      },
      async () => {   // 여우가 달리기 시작: 뒤에서 순식간에 앞지른다(진저브레드맨보다 빠르게)
        cue('el_gb_fox_zoom', .6);
        put(T, fox, fox.x, 540, { look: 'run', to: 'right' });
        runTo(fox, X(845, 750), 700, { amp: 1, period: 200, tilt: 2, ease: 'ease-in' });
        man.move(man.x + 30, man.y, 700);
      },
      'S10-1',
      async () => { man.look('run_worried', 'right'); man.hop(6, 200); },
      'S10-2',
      async () => {
        musicStop(1.2);   // 잡히는 순간부터 음악을 쉰다(PLAN 판단 12 확정)
        fox.look('block_front'); fox.place(X(850, 740), 540); cue('el_gb_block_thump', .6);
        stopRun(man); man.look('caught_front'); man.place(X(745, 650), ROAD); man.hop(10, 220);
      },
      'S10-3',
      'S10-4',   // "잡았다!" 뒤에 와앙 → 눈가루 퍽(기획서 장면표 순서. 2026-11-28 눈가루를 짧게 줄이며 '잡았다' 앞에서 뒤로 옮김: 앞에 두면 진저브레드맨이 대사 전에 사라져 보였다)
      async () => { fox.look('mouth_open', 'left'); cue('el_gb_snap_kazoo', .5); await sleep(400); await snowBurst(); small(.85); cue('xm_woodblock_tok', .4); },
      'S10-5',
      async () => { small(.7); cue('xm_woodblock_tok', .35); },
      'S10-6',
      async () => { small(.55); cue('el_gb_tok_descend', .4); },
      'S10-7',
      async () => { small(0); fox.look('lick'); await unBurst(); cue('el_gb_lip_smack', .55); },
      'S10-8',
      async () => { cue('el_gb_harp_two_low', .45); },
      'S10-9',
      async () => { await sleep(600); },
    ];

    /* 11장 눈 내리는 저녁: 여우는 오른쪽 숲으로, 쫓던 모두는 숲가에 멈춰 헐떡 → 집으로 → 창에 불 */
    const WIN11 = [bgX(170), bgY(545)];   // 배경 왼쪽 아래 작은 집 창
    function s11() {
      T.clear(); bgImage('gb_bg_evening_hill'); S = {}; setView(X(500, 470)); S.snow = snow(P ? 14 : 24, true);
      put(T, fox, X(720, 600), 520, { look: 'walk_away', to: 'right', s: .8 });
      fg('gb_fg_fir_sil', X(0, 240), 610, HT.gb_fg_fir_sil);
    }
    const ARRIVE = () => (P ? [[granny, 560], [grandpa, 495], [thA, 440], [thB, 395], [moA, 350], [moB, 305], [cow, 250], [pig, 420]] : [[granny, 690], [grandpa, 610], [thA, 530], [thB, 465], [moA, 400], [moB, 335], [cow, 175], [pig, 470]]);
    B[11] = [
      async () => {
        music(MUS[11]); cue('el_gb_fox_leave', .45);
        runTo(fox, X(1150, 800), 6500, { amp: 2, period: 420, tilt: 0, ease: 'linear' }).then(() => hide(fox));
      },
      'S11-1',
      async () => {
        cue('el_gb_pant_slow', .5);
        const sc = X(.66, .58);
        ARRIVE().forEach(([a, x], i) => {
          const pk = a === cow ? 'run' : a === pig ? 'run' : 'reach_run';
          put(T, a, x - 420, a === pig ? 560 : 535 - (i % 2) * 8, { look: pk, to: 'right', s: a === pig ? sc * .95 : sc });
          runTo(a, x, 1800 + i * 80, { amp: 3, period: 280, tilt: 4, ease: 'ease-out' }).then(() => a.look('pant', 'right'));
        });
        T.world.appendChild(pig.pos);
        await sleep(2000);
      },
      'S11-2',
      async () => { grandpa.look('pant', 'right'); },
      'S11-3',
      async () => { grandpa.look('shrug_l'); cue('el_gb_oops_xylo', .4); granny.look('stand_l_sad', 'left'); },
      'S11-4',
      async () => {
        grandpa.look('arm_granny', 'left'); grandpa.place(granny.x + X(70, 55), grandpa.y);
        cue('xm_wind_chime_snow', .4);
        ARRIVE().forEach(([a], i) => { if (a === granny || a === grandpa) return; const k = a === cow || a === pig ? 'run' : 'reach_run'; setTimeout(() => runTo(a, a.x - 600, 4200, { look: k, to: 'left', amp: 3, period: 300, tilt: 3, ease: 'ease-in' }).then(() => hide(a)), 300 + i * 120); });
      },
      'S11-5',
      async () => {
        [granny, grandpa].forEach((a, i) => setTimeout(() => runTo(a, a.x - 500, 3800, { amp: 2, period: 340, tilt: 2, ease: 'ease-in' }).then(() => hide(a)), i * 150));
        const gl = glow(T, T.bg, WIN11[0], WIN11[1], 90, '#F2B366', .95);
        gl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1600, fill: 'forwards', delay: 900 });
        setTimeout(() => cue('el_gb_window_ding', .55), 900);
        T.camTo(X(WIN11[0] + 120, 400), WIN11[1] - 60, 1.15, 2400);
      },
      'S11-6',
      async () => { cue('xm_xylo_down3', .45); await sleep(1500); await cutPic('gb_cut_snow_evening'); },   // 기획 §7 컷 '11 끝'(2026-11-28 다시 그려 붙임)
    ];

    const SETS = [null, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11];
    const CARD = [null, '눈 내리는 부엌', '얼굴 꾸미기', '오븐에서 폴짝', '할머니 할아버지 쫓아요', '헛간의 탈곡하는 사람들', '들판의 풀 베는 사람들', '소', '돼지, 그리고 긴 줄', '여우를 만나요', '여우가 가장 빨랐어요', '눈 내리는 저녁'];
    const setScene = n => { tok++; ALL.forEach(a => { try { a.pos.getAnimations().forEach(x => x.cancel()); stopRun(a); hide(a); } catch (e) { /* */ } }); small(0); clearInterval(S.iv); SETS[n](); window.__gb.scene = n; };

    /* 장면 순서 점검(읽어 주기 대본과 같은 순서인지) */
    for (let n = 1; n <= 11; n++) {
      const mine = B[n].filter(x => typeof x === 'string' && MODE[x] !== 'p');
      const want = (ORDER[n] || []).filter(([k, m]) => m !== 'p').map(([k]) => k);
      if (mine.join() !== want.join()) console.warn('[gb] 장면 줄 순서가 대본과 다름', n, mine, want);
    }
    window.__gb = { scene: 0, log: [] };

    /* ================= 읽어 주기 (docs/READ_MODE.md · read_script_el.json) =================
       같은 B[n] 목록을 대본의 go:<키>(그 줄 앞까지의 움직임)·tail:<n>(마지막 줄 뒤) 동사로 잘라 돈다. 놀이 전용({p})은 건너뛰고 읽기 전용({r})을 돈다 */
    if (RD) {
      let cur = 0, cn = 0, chain = Promise.resolve();
      const runItems = async (upto, t) => {
        const list = B[cn] || [];
        for (; cur < upto && cur < list.length; cur++) {
          const it = list[cur];
          if (!alive(t)) return;
          if (typeof it === 'string') continue;
          if (T.readInstant()) continue;
          const f = typeof it === 'function' ? it : it.r;
          if (!f) continue;
          try { await f(); } catch (e) { console.warn('[gb] 읽기 움직임 실패', e); }
        }
      };
      const R = {
        set(n) { cn = +n; cur = 0; chain = Promise.resolve(); setScene(cn); return null; },
        go(k) {
          const list = B[cn] || [], i = list.indexOf(k);
          if (i < 0) { console.warn('[gb] 대본 줄이 장면에 없음', k); return null; }
          const t = tok;
          chain = chain.then(() => runItems(i, t)).then(() => { if (alive(t)) cur = Math.max(cur, i + 1); });
          return chain;
        },
        tail() { const t = tok; chain = chain.then(() => runItems(Infinity, t)); return chain; },
        settle() { ALL.forEach(stopRun); return null; },
      };
      /* 녹음이 없는 줄: readPlay 는 바로 건너뛰므로(recordedOnly) 말풍선만 읽을 만큼 띄운다(TTS 없음). 녹음이 있으면 엔진 그대로 */
      const RW = Object.create(T);
      const hasClip = t => { try { const en = typeof englishOn === 'function' && englishOn(); return en ? !!(NARRATION_CLIPS_EN[t] && NARRATION_CLIPS_EN[t].c) : !!(typeof NARRATION_CLIPS !== 'undefined' && NARRATION_CLIPS[t]); } catch (e) { return false; } };
      RW.say = (text, o = {}) => (hasClip(text) ? T.say(text, o) : T.say(text, { ...o, recordedOnly: false }));
      /* RUN 줄은 효과 글자도 함께 */
      try {
        const rr = await T.readPlay.call(RW, R);
        return rr;
      } finally { musicStop(2); ALL.forEach(stopRun); small(0); }
    }

    /* ================= 놀이 ================= */
    const from = Math.max(1, Math.min(11, +QS.get('from') || 1));
    let first = true;
    for (let n = from; n <= 11; n++) {
      if (first) { setScene(n); await T.curtain(true); first = false; }
      else await T.sceneCard(tr(CARD[n]), () => setScene(n));
      const t = tok;
      for (const it of B[n]) {
        if (!alive(t)) break;
        if (typeof it === 'string') { if (MODE[it] === 'r') continue; window.__gb.log.push(it); await say(it); continue; }
        if (typeof it === 'function') { await it(); continue; }
        if (it.p) await it.p();
      }
    }
    window.__gb.scene = 12;
    musicStop(2);
    T.finale(); await sleep(1200);
    return GB_MORAL;
  }

  Tale.mount({ title: typeof GB_TITLE !== 'undefined' ? GB_TITLE : '진저브레드맨', subtitle: '', read: true, run: T => run(Tale.api) });
})();
