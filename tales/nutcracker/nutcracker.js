/* 호두까기 인형 — 크리스마스 명작(호프만 1816, 차이콥스키 발레 1892 줄거리). 기획: tales/nutcracker/PLAN.md (2026-11-27, 판단 1~5 권장안 확정).
   그림 접두어 nc_ (assets/v3w/nc_*.webp, post_tale.py·post_cuts.py 로 변환). 대사·장면 순서는 build_scripts.py 한 곳(→ narration.js·narration_en.js·steps.js·read_script_*.json).
   장면 11: 1 이브의 문소리 · 2 상자 안의 친구(재미: 상자 톡) · 3 너무 큰 호두 · 4 파란 손수건(배움: 같은 색) · 5 한밤의 눈짓 · 6 마루의 작은 행진
            7 슬리퍼가 톡(재미: 슬리퍼 톡) · 8 매듭을 맨 왕자 · 9 눈송이 숲의 다리(배움: 위치말 '위') · 10 꽃이 피는 과자 나라 · 11 좋은 아침.
   조작은 모두 T.ask(안내와 누르기를 함께 연다). 손수건 매듭·슬리퍼·상자·호두는 인물 그림에 없고 소품으로 얹는다.
   이동은 걷기 그림 없이 미끄러지며 통통 튀기·작은 기울기(glide). 병정 행진은 행진 그림 한 장(march_a)만 쓰고 통통 이동, 멈추면 차렷.
   음악: 차이콥스키 선율 ElevenLabs 관현악 판 sounds/music/el_nc_*_orch.mp3(2026-11-28 사용자 확정), 효과음 sounds/sfx/el_nc_*.mp3. 출처 sounds/CREDITS.md.
   녹음 전: narration_el.js 가 없으면 말풍선만 읽을 만큼 띄우고 소리 없이 넘어간다(TTS 없음). 읽어 주기도 녹음이 없는 줄은 글자만 띄우고 끝까지 간다.
   세로 화면: 보이는 폭이 좁아(폰 약 517, 아이패드 약 778) 장면마다 보는 가운데(lx)를 옮기고, 멀리 떨어진 곳은 pan 으로 옮겨 간다.
   개발용: ?from=N (그 장면부터), ?snow=lb|plain (9장 배경 비교). */
(() => {
  const AS = '../../assets/v3w/';
  const src = k => AS + k + '.webp';
  const QS = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(''); } })();
  const LINES = typeof NC_LINES !== 'undefined' ? NC_LINES : {};
  const SCENES = typeof NC_SCENES !== 'undefined' ? NC_SCENES : [];
  const READ_ALT = typeof NC_READ_ALT !== 'undefined' ? NC_READ_ALT : {};
  const artOK = {};

  /* ---------- 크기(CLAUDE.md §4-1): 같은 부위 폭을 재서 맞춘 높이 ----------
     기준 키(PLAN §3 크기표, 클라라 선 키 1.00 = 200): 클라라 200 · 프리츠 220 · 대부 264 · 인형 84 · 왕자 208 · 요정 224 · 병정 72 · 생쥐 왕 60(일어선 call) · 생쥐 44(귀 세운 ear).
     잰 부위(그림 높이 대비 폭, 2026-11-28 measure.py): 클라라 = 귀 위 머리카락 폭 · 프리츠 = 이마 위 곱슬 폭 · 대부 = 옆머리(관자놀이) 폭 · 인형 = 모자 챙 폭 · 왕자·요정 = 머리카락 폭 ·
     생쥐 = 머리(볼) 지름(눈으로 잼) · 병정 = 모자 폭. HT = 기준 키 × (기준 자세 비율 / 이 자세 비율).
     선 자세인데 고개 기울기 때문에 비율이 빗나간 것(인형 open·thanks·nestle, 대부 nod·pause, 요정 bud·finish·listen·turn)은 그림 높이가 같으므로 기준과 같은 키로 둔다(사진으로 확인). */
  const R = {
    clara: { wave: .463, amaze: .483, clap: .462, cradle: .533, doze: .638, kneel_hug: .543, laugh: .462, listen: .505, meet: .462, reach: .465, receive: .463, snow: .447, stretch: .494, tie: .525, toss: .505, turn: .468, worry: .457, yawn: .51 },
    fritz: { wait: .37, flinch: .398, listen: .37, nudge: .372, peek: .412, press: .377, show: .37, sorry: .373 },
    godfather: { arrive: .383, nod: .383, offer: .397, pause: .395, point: .389, smile: .383 },
    doll: { rest: .3347, open: .3347, loose: .3347, brace: .3317, relax: .3317, lead: .3333, thanks: .3347, nestle: .325, rise: .36 },
    prince: { bow: .366, cross: .366, follow_flake: .356, gate: .36, guest: .375, guide: .365, invite: .367, knot: .362, listen: .363, petal: .387 },
    fairy: { welcome: .395, bud: .395, finish: .395, listen: .395, turn: .395, curtsy: .403 },
    king: { call: .417, peek: .6, beckon: .395, startle: .398, turn: .469 },
    grey: { ear: .413, in: .603, jump: .425, out: .51 },
    brown: { in: .539, sniff: .362, freeze: .423, out: .509 },
    guard_round: { stand: .335, march_a: .335 },
    guard_flat: { stand: .2833, march_a: .2977 },
  };
  const BASE = { clara: ['wave', 200], fritz: ['wait', 220], godfather: ['arrive', 264], doll: ['rest', 84], prince: ['bow', 208], fairy: ['welcome', 224],
    king: ['call', 60], grey: ['ear', 44], brown: ['sniff', 44 * .413 / .362], guard_round: ['stand', 72], guard_flat: ['stand', 72] };   // 밤색 생쥐 머리 지름 = 회색 생쥐 머리 지름(PLAN: 둘 다 0.22)
  const FILE = { grey: 'mouse_grey', brown: 'mouse_brown' };
  const fileOf = (who, pose) => 'nc_' + (FILE[who] || who) + '_' + pose;
  const HT = {};
  Object.entries(R).forEach(([who, t]) => { const [bp, bh] = BASE[who]; Object.entries(t).forEach(([p, r]) => { HT[fileOf(who, p)] = Math.round(bh * t[bp] / r); }); });
  HT.nc_doll_tucked = 58;   // 누운 인형: 모자 크기를 선 인형의 모자 크기에 맞춤(길이 약 100, 줄 세운 사진으로 확인)
  /* post_tale.py 가 쓴 비율(ASP.txt). preload 가 실제 비율로 다시 덮는다 */
  const ASP = {};
  /* 보는 쪽(그림을 보고 정함, 2026-11-28). front 는 뒤집지 않는다 */
  const NAT = {
    clara: { amaze: 'front', clap: 'right', cradle: 'right', doze: 'right', kneel_hug: 'right', laugh: 'right', listen: 'left', meet: 'right', reach: 'right', receive: 'right', snow: 'left', stretch: 'front', tie: 'right', toss: 'right', turn: 'right', wave: 'right', worry: 'right', yawn: 'front' },
    fritz: { flinch: 'front', listen: 'left', nudge: 'left', peek: 'left', press: 'left', show: 'left', sorry: 'front', wait: 'right' },
    godfather: { arrive: 'left', nod: 'left', offer: 'left', pause: 'front', point: 'left', smile: 'left' },
    doll: { rest: 'right', open: 'right', loose: 'right', tucked: 'left', rise: 'left', lead: 'right', brace: 'right', relax: 'right', thanks: 'right', nestle: 'right' },
    prince: { bow: 'left', knot: 'left', invite: 'left', guide: 'left', follow_flake: 'front', cross: 'left', gate: 'right', guest: 'right', listen: 'left', petal: 'right' },
    fairy: { bud: 'front', curtsy: 'left', finish: 'front', listen: 'left', turn: 'right', welcome: 'front' },
    king: { peek: 'left', call: 'front', beckon: 'right', startle: 'left', turn: 'right' },
    grey: { in: 'left', ear: 'left', jump: 'left', out: 'right' },
    brown: { in: 'left', sniff: 'front', freeze: 'left', out: 'right' },
    guard_round: { stand: 'right', march_a: 'right' },
    guard_flat: { stand: 'right', march_a: 'right' },
  };
  /* 그림 안 자리(뒤집기 전 그림의 폭·높이 비율, 왼쪽 위 0,0) */
  const KNOT = {   // 손수건 매듭: 인형은 턱 밑, 왕자는 목 옆
    nc_doll_loose: [.52, .45], nc_doll_tucked: [.2, .84], nc_doll_rise: [.32, .57], nc_doll_lead: [.53, .45], nc_doll_brace: [.47, .45], nc_doll_relax: [.47, .45],
    nc_doll_thanks: [.42, .46], nc_doll_nestle: [.55, .44], nc_doll_rest: [.47, .45], nc_doll_open: [.6, .47],
    nc_prince_bow: [.46, .365], nc_prince_knot: [.5, .365], nc_prince_invite: [.53, .365], nc_prince_guide: [.51, .365], nc_prince_follow_flake: [.47, .365], nc_prince_cross: [.55, .365],
    nc_prince_gate: [.37, .365], nc_prince_guest: [.46, .375], nc_prince_listen: [.46, .365], nc_prince_petal: [.42, .385],
  };
  const JAW = { nc_doll_rest: [.5, .38], nc_doll_open: [.62, .37], nc_doll_loose: [.52, .38] };
  const HAND = {   // 손에 든 소품(가운데)
    nc_godfather_arrive: [.16, .5], nc_godfather_nod: [.18, .5], nc_godfather_offer: [.06, .49],
    nc_fritz_show: [.06, .41], nc_fritz_press: [.06, .6],
    nc_clara_toss: [.95, .5], nc_clara_snow: [.06, .42], nc_clara_kneel_hug: [.78, .5], nc_clara_cradle: [.55, .46],
  };

  /* ================= 그림 ================= */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f] !== false) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    return T.el('rect', { x, y, width: w, height: h, rx: 10, fill: '#D9A94E' }, parent);
  }
  const asp = f => ASP[f] || 1;
  /* 가운데 (cx, cy), 폭 w */
  const picW = (T, parent, f, cx, cy, w) => { const h = w / asp(f); return sprite(T, parent, f, cx - w / 2, cy - h / 2, w, h); };
  /* 바닥(cx, by)에 높이 h 로 세운다 */
  const stand = (T, parent, f, cx, by, h, o = {}) => { const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none', ...o }, parent); const w = h * asp(f); sprite(T, g, f, cx - w / 2, by - h, w, h); return g; };
  const standW = (T, parent, f, cx, by, w, o = {}) => stand(T, parent, f, cx, by, w / asp(f), o);
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };

  /* ================= 배우 ================= */
  function mk(T, who, poses) {
    const looks = {};
    let decoG, holdG;
    const a = T.actor(T.world, -400, 500, g => {
      poses.forEach(p => {
        const f = fileOf(who, p), h = HT[f] || 100, w = h * asp(f), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[p] = { wrap, h, w, f, nat: (NAT[who] || {})[p] || 'front' };
      });
      decoG = T.el('g', { filter: 'url(#pp)' }, g); holdG = T.el('g', { filter: 'url(#pp)' }, g);
    });
    a.who = who; a.want = 'left'; a.knot = false; a.item = null;
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    a.at = ([fx, fy]) => { const l = looks[a.cur]; return [-l.w / 2 + fx * l.w, -l.h + fy * l.h]; };
    a.world = p => { const [x, y] = a.at(p); return [a.x + x * a.flip * a.scale, a.y + y * a.scale]; };
    a.hand = () => a.world(HAND[looks[a.cur].f] || [.5, .5]);
    a.jaw = () => a.world(JAW[looks[a.cur].f] || KNOT[looks[a.cur].f] || [.5, .4]);
    const draw = () => {
      decoG.innerHTML = '';
      if (a.knot) { const p = KNOT[looks[a.cur].f]; if (p) { const [x, y] = a.at(p); picW(T, decoG, 'nc_prop_cloth_knot', x, y, who === 'prince' ? 26 : 18); } }
      holdG.innerHTML = '';
      if (a.item) { const p = HAND[looks[a.cur].f]; if (p) { const [x, y] = a.at(p); if (a.item.draw) a.item.draw(holdG, x, y); else picW(T, holdG, a.item.f, x + (a.item.dx || 0), y + (a.item.dy || 0), a.item.w); } }
    };
    a.look = (k, d) => { if (!looks[k]) { console.warn('[nc] 자세 없음', who, k); return; } Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; }); a.cur = k; a.h = looks[k].h; a.w = looks[k].w; draw(); a.turn(d || a.want); };
    a.setKnot = on => { a.knot = !!on; draw(); };
    a.hold = it => { a.item = it || null; draw(); };
    a.look(poses[0]);
    a.pos.style.pointerEvents = 'none';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const shown = a => a.pos.isConnected && a.pos.style.display !== 'none';
  function put(T, a, x, y, { look, to, s = 1, parent } = {}) {
    (parent || T.world).appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.body.getAnimations().forEach(n => n.cancel());
    a.pos.style.display = ''; a.pos.style.opacity = ''; a.body.style.translate = ''; a.body.style.rotate = ''; a.body.style.opacity = '';
    a.setScale(s); a.x = x; if (look) a.look(look, to || a.want); else a.turn(to || a.want);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }

  async function run(T) {
    const { sleep, tr } = T;
    T.cardSpeed(.6);
    const P = T.viewWidth() < 990;
    const X = (l, p) => (P ? p : l);
    const line = k => LINES[k] || k;
    /* 화면 1px 이 무대 몇 칸인지(누르는 판 80px 이상 맞추기) */
    const ppu = () => { try { const r = document.getElementById('stage').getBoundingClientRect(); return (r.width || 1000) / T.viewWidth(); } catch (e) { return 1; } };
    const minZ = n => Math.max(n, 88 / ppu());

    /* ---- 보는 자리(세로): bg·world·fx 를 함께 옮긴다. pan 은 부드럽게(화면이 안 보이거나 바로 놓을 때는 바로) ---- */
    let LX = 500, panTok = 0;
    const viewT = lx => `translate(${500 - lx} 0)`;
    /* 가로 화면 확대(PLAN §6 카메라, 상한 1.15): 탁자 근경 2장 1.08·3장 1.10, 마루 6·7장 1.12(배경이 마루 높이 세트가 아니라 작은 인물이 잘 보이게), 8·11장 1.05 */
    const setView = (lx = 500, z = 1, cx = 500, cy = 280) => {
      T.fx.style.pointerEvents = 'none'; panTok++;
      LX = P ? lx : 500;
      [T.bg, T.world, T.fx].forEach(g => (P ? g.setAttribute('transform', viewT(LX)) : g.removeAttribute('transform')));
      if (P) T.camSnap(500, 280, 1); else T.camSnap(cx, cy, z);
    };
    const pan = (lx, ms = 1100) => {
      if (!P || Math.abs(lx - LX) < 2) return null;
      const from = LX, tok = ++panTok; LX = lx;
      const set = v => [T.bg, T.world, T.fx].forEach(g => g.setAttribute('transform', viewT(v)));
      if (document.hidden || T.readInstant()) { set(lx); return null; }
      return new Promise(res => {
        const t0 = performance.now();
        const step = () => {
          if (tok !== panTok) return res();
          const p = Math.min(1, (performance.now() - t0) / ms), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          set(from + (lx - from) * e);
          if (p < 1 && !document.hidden) requestAnimationFrame(step); else { set(lx); res(); }
        };
        requestAnimationFrame(step);
        setTimeout(() => { if (tok === panTok) { set(lx); res(); } }, ms + 600);   // 화면이 멈춰도 끝난다
      });
    };

    /* ---- 소리 ---- */
    const SFX = ['door_knock', 'door_bell', 'box_rustle', 'lid_ding', 'jaw_crack', 'nut_roll', 'cloth_swish', 'knot_pluck', 'basket_set', 'clock_bong', 'tree_grow', 'wink_ting',
      'snare_march', 'mouse_pizz', 'slipper_whoosh', 'slipper_tap', 'mice_scurry', 'cape_flutter', 'transform_shimmer', 'warm_chord', 'snow_tin', 'snow_touch', 'gate_wafer', 'tiptoe_ting', 'petal_fold', 'morning_birds'];
    /* 이 동화 효과음(el_nc_*)은 짧은 이름으로 부른다. 읽어 주기는 한 단 낮게, 작은북과 휙은 더 낮게(PLAN §7) */
    const sfx = (n, v = .6) => { try { if (T.reading()) v *= (/snare|whoosh/.test(n) ? .55 : .8); return AudioFX.sfx(SFX.includes(n) ? 'el_nc_' + n : n, v); } catch (e) { return false; } };
    try { AudioFX.preloadSfx([...SFX.map(n => 'el_nc_' + n), 'pop', 'ding', 'yawn', 'swish', 'doop', 'slide_up', 'chime_up', 'harp_gliss']); } catch (e) { /* 소리 없이 */ }
    const MUS = ['march_light', 'march_parade', 'reedflutes', 'waltz_box', 'waltz_snow', 'waltz_main', 'waltz_morning', 'sugarplum_night', 'sugarplum'];
    const musFile = n => 'el_nc_' + n + '_orch';
    try { AudioFX.preloadMusic(MUS.map(musFile)); } catch (e) { /* 음악 없이 */ }
    let musTok = 0;
    const musVol = n => (T.reading() ? .13 : (/waltz_box|waltz_morning|sugarplum_night/.test(n) ? .17 : .21));
    const musOn = n => {
      const tok = ++musTok; let k = 0;
      const go = () => { if (tok !== musTok) return; let h = null; try { h = AudioFX.bgm(musFile(n), { vol: musVol(n), fadeIn: 1.5, xfade: 1.5 }); } catch (e) { return; } if (!h && ++k < 12) setTimeout(go, 800); };
      go();
    };
    const musOff = (f = 1.5) => { musTok++; try { AudioFX.stopBgm(f); } catch (e) { /* 무시 */ } };

    /* ---- 그림 불러오기 ---- */
    const ALLF = new Set();
    Object.entries(R).forEach(([who, t]) => Object.keys(t).forEach(p => ALLF.add(fileOf(who, p))));
    ['nc_doll_tucked', 'nc_prop_box', 'nc_prop_lid', 'nc_prop_door', 'nc_prop_stand', 'nc_prop_cloth_knot', 'nc_prop_snow_branch', 'nc_prop_nut', 'nc_prop_cloth_blue', 'nc_prop_cloth_yellow',
      'nc_prop_slipper', 'nc_prop_tree', 'nc_prop_bridge', 'nc_prop_flake', 'nc_prop_wafer_gate', 'nc_prop_flower_open', 'nc_prop_flower_bud', 'nc_fg_pine', 'nc_fg_table', 'nc_fg_floor', 'nc_fg_snow', 'nc_fg_petals'].forEach(f => ALLF.add(f));
    const BGS = ['nc_bg_party', 'nc_bg_table', 'nc_bg_chair_evening', 'nc_bg_parlor_night', 'nc_bg_floor_night', 'nc_bg_snow', 'nc_bg_snow_lb', 'nc_bg_sweets', 'nc_bg_morning'];
    const loads = [];
    [...BGS, ...ALLF].forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(6000)]);

    /* ---- 인물 ---- */
    const C = {
      clara: mk(T, 'clara', Object.keys(R.clara)),
      fritz: mk(T, 'fritz', Object.keys(R.fritz)),
      godfather: mk(T, 'godfather', Object.keys(R.godfather)),
      doll: mk(T, 'doll', [...Object.keys(R.doll), 'tucked']),
      prince: mk(T, 'prince', Object.keys(R.prince)),
      fairy: mk(T, 'fairy', Object.keys(R.fairy)),
      king: mk(T, 'king', Object.keys(R.king)),
      grey: mk(T, 'grey', Object.keys(R.grey)),
      brown: mk(T, 'brown', Object.keys(R.brown)),
      guard_round: mk(T, 'guard_round', Object.keys(R.guard_round)),
      guard_flat: mk(T, 'guard_flat', Object.keys(R.guard_flat)),
    };
    const ALL = Object.values(C);
    ALL.forEach(hide);
    const faceOf = n => src('nc_' + n + '_face');
    T.faceArt({ clara: faceOf('clara'), fritz: faceOf('fritz'), godfather: faceOf('godfather'), doll: faceOf('doll'), prince: faceOf('prince'), fairy: faceOf('fairy'), king: faceOf('king') });
    T.faces({ clara: C.clara, fritz: C.fritz, godfather: C.godfather, doll: C.doll, prince: C.prince, fairy: C.fairy, king: C.king });

    /* ---- 움직임 ---- */
    let tok = 0;                       // 장면이 바뀌면 늘어난다: 앞 장면의 늦은 연출이 새 장면을 건드리지 않게
    const live = t => t === tok;
    /* 미끄러지며 통통(걷기 그림 없음, 2026-11-24 사용자 결정): 위치는 a.move, 몸은 translate·rotate 로 튀기·기울기(크기 변화 없음) */
    const glide = (a, x, y = a.y, ms = 1200, { hopH = 0.05, n = 0 } = {}) => {
      if (document.hidden || T.readInstant()) { a.place(x, y); return Promise.resolve(); }
      const dist = Math.hypot(x - a.x, y - a.y), steps = n || Math.max(2, Math.round(Math.min(dist / (a.h * .45), ms / 330)));
      const A = a.h * hopH, kf = [];
      for (let i = 0; i <= steps * 2; i++) { const up = i % 2 === 1; kf.push({ translate: `0 ${up ? -A : 0}px`, rotate: `${i === 0 || i === steps * 2 ? 0 : (up ? 0 : (i % 4 === 0 ? 2.5 : -2.5))}deg` }); }
      const b = a.body.animate(kf, { duration: ms, easing: 'linear' });
      return a.move(x, y, ms, 'ease-in-out').finally(() => b.cancel());
    };
    const fade = (n, a, b, ms = 400) => (document.hidden ? (n.style.opacity = b, Promise.resolve()) : n.animate([{ opacity: a }, { opacity: b }], { duration: ms, fill: 'forwards' }).finished.catch(() => {}));
    const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -7px' }, { translate: '0 0' }], { duration: 1000, iterations: Infinity });
    const wiggle = n => n.animate([{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 380).finished.catch(() => {});
    /* 포물선으로 날아가기: 그룹 g(제자리 0,0 에 그려 둠)를 (x0,y0)→(x1,y1) */
    const arc = (g, x0, y0, x1, y1, ms = 700, lift = 90, spin = 0) => {
      if (document.hidden) { g.setAttribute('transform', `translate(${x1} ${y1})`); return Promise.resolve(); }
      const a = g.animate([{ transform: `translate(${x0}px,${y0}px) rotate(0deg)` }, { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - lift}px) rotate(${spin / 2}deg)`, offset: .5 }, { transform: `translate(${x1}px,${y1}px) rotate(${spin}deg)` }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' });
      return a.finished.then(() => { a.cancel(); g.setAttribute('transform', `translate(${x1} ${y1}) rotate(${spin})`); }).catch(() => {});
    };
    const loose = (f, w) => { const g = T.el('g', { 'pointer-events': 'none' }, S.top || T.world); picW(T, T.el('g', { filter: 'url(#pp)' }, g), f, 0, 0, w); return g; };
    const cutPic = async (id, hold = 3000) => { if (await T.preload(src(id))) { sfx('slide_up', .4); await T.cutImage([{ src: src(id), hold: +hold }]); } };

    /* ---- 누르는 판: 투명 판(짧은 변 88px 이상) ---- */
    function zone(parent, cx, cy, w, h) {
      const g = T.el('g', { 'pointer-events': 'all' }, parent);
      const W = minZ(w), H = minZ(h);
      T.el('rect', { x: cx - W / 2, y: cy - H / 2, width: W, height: H, rx: 14, fill: '#000', 'fill-opacity': 0 }, g);
      return g;
    }

    /* ================= 장면 차리기 ================= */
    let S = {};
    const layers = () => { S.back = T.el('g', {}, T.world); S.act = T.el('g', {}, T.world); S.mid = T.el('g', {}, T.world); S.top = T.el('g', {}, T.world); S.front = T.el('g', {}, T.world); S.ui = T.el('g', { 'pointer-events': 'none' }, T.fx); };
    const bgImage = key => T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    /* 배경 한 조각을 오려 인물 앞에 다시 얹는다(탁자 앞판 등): polys = [[x,y]...] 목록 */
    const bgFront = (key, polys, parent) => {
      const id = 'ncClip' + Math.random().toString(36).slice(2, 8), cp = T.el('clipPath', { id }, T.world);
      polys.forEach(p => T.el('polygon', { points: p.map(q => q.join(',')).join(' ') }, cp));
      const g = T.el('g', { 'clip-path': `url(#${id})`, 'pointer-events': 'none' }, parent);
      T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, g);
      return g;
    };
    /* 위쪽만 보이는 그룹(바구니 안의 인형): y 아래는 가린다 */
    const clipAbove = (y, parent) => {
      const id = 'ncCa' + Math.random().toString(36).slice(2, 8), cp = T.el('clipPath', { id }, T.world);
      T.el('rect', { x: -200, y: -400, width: 1400, height: y + 400 }, cp);
      return T.el('g', { 'clip-path': `url(#${id})` }, parent);
    };
    const fg = (f, x, by, h, flip) => { const g = stand(T, S.ui, f, x, by, h); if (flip) g.setAttribute('transform', `translate(${2 * x} 0) scale(-1 1)`); return g; };
    const reset = () => { tok++; T.clear(); S = {}; ALL.forEach(a => { a.hold(null); }); layers(); };

    /* 표 위치: 장면마다 (가로, 세로) */
    const TABLE_Y = 420;                                    // 탁자 윗면(물건 바닥)
    const KIDS_Y = 448;                                     // 탁자 뒤 아이들 발(탁자 앞판에 가린다)
    const tableFront = () => bgFront('nc_bg_table', [[[124, 372], [922, 372], [922, 490], [898, 490], [898, 580], [846, 580], [846, 490], [228, 490], [228, 580], [176, 580], [176, 490], [124, 490]]], S.mid);
    const doorAt = { x: 932, by: 462, h: 338 };
    /* 상자(뚜껑 포함) 그리기: 바닥 가운데 (0,0) 기준 그룹 */
    const BOXW = 112;
    const boxGroup = (parent, withLid = true) => {
      const g = T.el('g', { 'pointer-events': 'none' }, parent);
      const bh = BOXW / asp('nc_prop_box');
      S.boxInner = T.el('g', {}, g);                         // 상자 속(인형)
      S.boxImg = standW(T, g, 'nc_prop_box', 0, 0, BOXW);
      if (withLid) { S.lid = T.el('g', {}, g); standW(T, S.lid, 'nc_prop_lid', 0, -bh + 50, BOXW + 8); }
      S.boxH = bh;
      return g;
    };
    const SET = {
      1() {
        reset(); bgImage('nc_bg_party'); setView(X(500, 720));
        stand(T, S.back, 'nc_prop_tree', X(150, 470), 498, 330);
        /* 문: 문 안(밤)에 대부가 서 있고 문짝이 열린다 */
        put(T, C.godfather, doorAt.x, 466, { look: 'arrive', to: 'left', parent: S.back, s: .96 }); C.godfather.pos.style.opacity = '0';
        const box = boxGroup(T.el('g', {}, T.world), true); box.parentNode.remove();
        C.godfather.hold({ draw: (g, x, y) => { g.appendChild(box); box.setAttribute('transform', `translate(${x - 40} ${y + 66})`); } });
        S.door = T.el('g', { 'pointer-events': 'none' }, S.back); standW(T, S.door, 'nc_prop_door', doorAt.x, doorAt.by, doorAt.h * asp('nc_prop_door'));
        S.door.style.transformBox = 'view-box'; S.door.style.transformOrigin = `${doorAt.x + doorAt.h * asp('nc_prop_door') / 2}px ${doorAt.by}px`;
        put(T, C.clara, X(330, 540), 528, { look: 'laugh', to: 'right', parent: S.act });
        put(T, C.fritz, X(470, 645), 524, { look: 'wait', to: 'right', parent: S.act });
        fg('nc_fg_pine', X(70, 500), 150, 120, false);
      },
      2() {
        reset(); bgImage('nc_bg_table'); setView(X(500, 500), 1.08, 500, 330);
        put(T, C.clara, X(240, 320), KIDS_Y, { look: 'worry', to: 'right', parent: S.act });
        put(T, C.fritz, X(830, 590), KIDS_Y, { look: 'wait', to: 'left', parent: S.act });
        put(T, C.godfather, X(690, 665), KIDS_Y + 6, { look: 'arrive', to: 'left', parent: S.act });
        tableFront();
        const box = boxGroup(T.el('g', {}, T.world), true); box.parentNode.remove();
        S.boxAt = [X(480, 470), TABLE_Y];
        C.godfather.hold({ draw: (g, x, y) => { g.appendChild(box); box.setAttribute('transform', `translate(${x + 34} ${y + 8})`); } });
        S.boxG = box;
        /* 상자 속 인형: 바닥에서 살짝 들린 받침에 서서 모자와 턱만 테두리 위로 */
        put(T, C.doll, 0, -26, { look: 'rest', to: 'left', parent: S.boxInner });
        fg('nc_fg_table', X(900, 700), 590, 60);
      },
      3() {
        reset(); bgImage('nc_bg_table'); setView(X(500, 500), 1.1, 510, 330);
        put(T, C.clara, X(300, 330), KIDS_Y, { look: 'laugh', to: 'right', parent: S.act });
        put(T, C.fritz, X(720, 660), KIDS_Y, { look: 'show', to: 'left', parent: S.act });
        tableFront();
        S.standX = X(520, 500);
        stand(T, S.top, 'nc_prop_stand', S.standX, TABLE_Y, 100);
        put(T, C.doll, S.standX, TABLE_Y - 8, { look: 'rest', to: 'left', parent: S.top });
        C.fritz.hold({ f: 'nc_prop_nut', w: 26, dy: -12 });
        fg('nc_fg_table', X(900, 700), 590, 60);
      },
      4() {
        reset(); bgImage('nc_bg_table'); setView(X(500, 500));
        put(T, C.clara, X(430, 400), KIDS_Y, { look: 'worry', to: 'right', parent: S.act });
        put(T, C.fritz, X(730, 660), KIDS_Y, { look: 'sorry', to: 'left', parent: S.act });
        tableFront();
        S.standX = X(540, 520);
        stand(T, S.top, 'nc_prop_stand', S.standX, TABLE_Y, 100);
        put(T, C.doll, S.standX, TABLE_Y - 8, { look: 'loose', to: 'left', parent: S.top });
        fg('nc_fg_table', X(900, 700), 590, 60);
      },
      /* 4장 뒤(의자): 손수건을 맨 뒤 */
      chair() {
        reset(); bgImage('nc_bg_chair_evening'); setView(X(500, 680));
        S.basket = [808, 462];
        S.basketG = clipAbove(S.basket[1], S.mid);
        put(T, C.clara, X(650, 650), 530, { look: 'kneel_hug', to: 'right', parent: S.act });
        put(T, C.doll, 0, 0, { look: 'tucked', to: 'left', parent: S.top }); C.doll.setKnot(true);
        const [hx, hy] = C.clara.hand(); C.doll.place(hx + 6, hy + 34);
      },
      5() {
        reset(); bgImage('nc_bg_parlor_night'); setView(X(500, 300));
        S.home = X(500, 300); S.basketLx = 700;
        S.tree = T.el('g', { 'pointer-events': 'none' }, S.back); stand(T, S.tree, 'nc_prop_tree', 742, 474, 440);
        S.tree.style.transformBox = 'view-box'; S.tree.style.transformOrigin = '742px 474px';
        S.basket = [945, 470];
        S.basketG = clipAbove(S.basket[1], S.mid);
        put(T, C.clara, 222, 508, { look: 'doze', to: 'right', parent: S.act });
        put(T, C.doll, S.basket[0], S.basket[1] + 22, { look: 'tucked', to: 'left', parent: S.basketG }); C.doll.setKnot(true);
        fg('nc_fg_pine', X(60, 120), 120, 110, false);
      },
      6() { floorSet(); },
      7() {
        floorSet(true);
      },
      8() {
        reset(); bgImage('nc_bg_parlor_night'); setView(X(500, 490), 1.05, 490, 300);
        put(T, C.clara, X(400, 410), 528, { look: 'worry', to: 'right', parent: S.act });
        put(T, C.doll, X(565, 560), 526, { look: 'relax', to: 'left', parent: S.act }); C.doll.setKnot(true);
        S.slip = loose('nc_prop_slipper', 50); S.slip.setAttribute('transform', `translate(${X(355, 365)} 520)`);
        fg('nc_fg_pine', X(60, 290), 120, 110, false); fg('nc_fg_pine', X(940, 700), 120, 110, true);
      },
      9() {
        reset();
        const lb = QS.get('snow') !== 'plain';
        bgImage(lb ? 'nc_bg_snow_lb' : 'nc_bg_snow'); setView(X(500, 540));
        S.bridgeY = 540;
        standW(T, S.back, 'nc_prop_bridge', 500, S.bridgeY, 620);
        S.deck = S.bridgeY - 620 / asp('nc_prop_bridge') * .43;   // 상판 윗면
        /* 아래 눈송이: 다리 아래 가는 가지 위 */
        S.branch = T.el('g', { 'pointer-events': 'none' }, S.mid); standW(T, S.branch, 'nc_prop_snow_branch', 470, 520, 210);
        S.branch.style.transformBox = 'fill-box'; S.branch.style.transformOrigin = '50% 100%';
        S.flUp = [450, S.deck - 128]; S.flDn = [470, 478];
        S.flakeUp = loose('nc_prop_flake', 46); S.flakeUp.setAttribute('transform', `translate(${S.flUp[0]} ${S.flUp[1]})`);
        S.flakeDn = loose('nc_prop_flake', 46); S.flakeDn.setAttribute('transform', `translate(${S.flDn[0]} ${S.flDn[1]})`); S.mid.appendChild(S.flakeDn);
        put(T, C.clara, X(650, 595), S.deck + 6, { look: 'reach', to: 'right', parent: S.act });
        put(T, C.prince, X(745, 675), S.deck + 6, { look: 'guide', to: 'left', parent: S.act }); C.prince.setKnot(true);
        fg('nc_fg_snow', X(60, 300), 130, 120, false);
      },
      10() {
        reset(); bgImage('nc_bg_sweets'); setView(X(500, 470));
        const gh = 270, gw = gh * asp('nc_prop_wafer_gate');
        S.gateL = T.el('g', { 'pointer-events': 'none' }, S.back); stand(T, S.gateL, 'nc_prop_wafer_gate', 520 - gw / 2, 420, gh);
        S.gateR = T.el('g', { 'pointer-events': 'none' }, S.back); stand(T, S.gateR, 'nc_prop_wafer_gate', 520 + gw / 2, 420, gh, { transform: `translate(${2 * (520 + gw / 2)} 0) scale(-1 1)` });
        put(T, C.clara, X(230, 305), 526, { look: 'laugh', to: 'right', parent: S.act });
        put(T, C.prince, X(345, 395), 526, { look: 'gate', to: 'right', parent: S.act }); C.prince.setKnot(true);
        put(T, C.fairy, X(720, 600), 522, { look: 'welcome', parent: S.act }); C.fairy.pos.style.opacity = '0';
        S.flowers = X([620, 715, 810, 900], [520, 595, 670]).map((x, i) => { const g = T.el('g', { 'pointer-events': 'none' }, S.top); stand(T, g, 'nc_prop_flower_bud', x, 560 - (i % 2) * 6, 92); g.style.transformBox = 'fill-box'; g.style.transformOrigin = '50% 100%'; return { g, x, by: 560 - (i % 2) * 6 }; });
        fg('nc_fg_petals', X(40, 240), 600, 130, false); fg('nc_fg_petals', X(960, 740), 600, 130, true);
      },
      11() {
        reset(); bgImage('nc_bg_morning'); setView(X(500, 330), 1.05, 420, 300);
        S.basket = [808, 462];
        S.basketG = clipAbove(S.basket[1], S.mid);
        put(T, C.clara, 185, 528, { look: 'stretch', parent: S.act });
        put(T, C.doll, S.basket[0], S.basket[1] + 22, { look: 'tucked', to: 'left', parent: S.basketG }); C.doll.setKnot(true);
      },
    };
    /* 6·7장 마루(의자 왼쪽, 오른쪽 벽구멍, 가운데 깔개) */
    const HOLE = [893, 412];
    function floorSet(seven) {
      reset(); bgImage('nc_bg_floor_night'); S.home = X(500, 420); S.holeLx = 700; setView(S.home, 1.12, 560, 330);
      S.rug = [470, 528];
      put(T, C.clara, 222, 508, { look: 'turn', to: 'right', parent: S.act });
      if (!seven) {
        put(T, C.doll, 370, 526, { look: 'lead', to: 'right', parent: S.act });
        put(T, C.guard_round, -90, 530, { look: 'stand', to: 'right', parent: S.act });
        put(T, C.guard_flat, -170, 528, { look: 'stand', to: 'right', parent: S.act });
        [C.king, C.grey, C.brown].forEach(m => { put(T, m, HOLE[0], 470, { look: m === C.king ? 'peek' : 'in', to: 'left', parent: S.act }); m.pos.style.opacity = '0'; });
      } else {
        put(T, C.guard_flat, 250, 530, { look: 'stand', to: 'right', parent: S.act });
        put(T, C.guard_round, 305, 532, { look: 'stand', to: 'right', parent: S.act });
        put(T, C.doll, 370, 526, { look: 'brace', to: 'right', parent: S.act });
        put(T, C.king, 545, 512, { look: 'call', parent: S.act });
        put(T, C.grey, 610, 498, { look: 'ear', to: 'left', parent: S.act });
        put(T, C.brown, 640, 532, { look: 'sniff', parent: S.act });
      }
      S.act.appendChild(C.clara.pos);
      fg('nc_fg_floor', 500, 602, 52);
    }
    const setScene = n => { (SET[n] || SET[1])(); };

    /* ================= 연출 동사 (놀이와 읽어 주기가 같이 쓴다) ================= */
    const A = {
      look(who, pose, d) { const a = C[who]; if (!a) return null; a.look(pose, d || a.want); return null; },
      face(who, d) { const a = C[who]; if (a) a.turn(d); return null; },
      hop(who, h = 12) { const a = C[who]; if (!a || document.hidden) return null; return a.hop(+h, 360); },
      wait(ms) { return document.hidden ? null : sleep(+ms); },
      sfx(n, v) { sfx(n, v ? +v : .6); return null; },
      bgm(n, a1) {
        if (n === 'off') { musOff(a1 ? +a1 : 1.5); return null; }
        if (n === 'dip') { try { const h = AudioFX.bgmNow(); if (h) h.dip(+a1 || 4, .35); } catch (e) { /* 무시 */ } return null; }
        if (n === 'next') { musOff(1); const t = musTok; return sleep(1100).then(() => { if (t === musTok) musOn(a1); }); }   // 앞 곡이 끝난 뒤 다음 곡(겹치지 않게)
        musOn(n); return null;
      },
      cut(id, ms) { return cutPic(id, ms); },
      pan(where) { const lx = where === 'home' ? (S.home || LX) : where === 'basket' ? (S.basketLx || LX) : where === 'hole' ? (S.holeLx || LX) : +where; return pan(lx); },

      /* 1장: 문이 열리고 대부가 상자를 받쳐 들고 들어온다 */
      async door_open() {
        const t = tok, g = C.godfather;
        sfx('door_bell', .55);
        if (!document.hidden) S.door.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.08)' }], { duration: 650, easing: 'ease-in', fill: 'forwards' });
        else S.door.style.display = 'none';
        g.pos.style.opacity = '1';
        await sleep(450); if (!live(t)) return;
        S.act.appendChild(g.pos);
        await glide(g, X(770, 820), 532, 1500);
      },
      /* 2장: 대부가 상자를 탁자에 내려놓는다 */
      async box_down() {
        const t = tok, g = C.godfather;
        const [hx, hy] = g.hand(); g.hold(null);
        S.top.appendChild(S.boxG); S.boxG.setAttribute('transform', `translate(${hx + 34} ${hy + 8})`);
        sfx('box_rustle', .5);
        await arc(S.boxG, hx + 34, hy + 8, S.boxAt[0], S.boxAt[1], 800, 20);
        if (!live(t)) return;
        S.boxZ = zone(S.ui, S.boxAt[0], S.boxAt[1] - S.boxH / 2 - 6, 116, 96);
        S.boxZ.setAttribute('pointer-events', 'none');
      },
      async box_open() {
        const t = tok;
        if (S.boxZ) S.boxZ.remove();
        sfx('lid_ding', .6); sfx('box_rustle', .35);
        if (!document.hidden) await S.lid.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: 'translate(70px,-60px) rotate(18deg)', opacity: 1, offset: .6 }, { transform: 'translate(120px,-30px) rotate(26deg)', opacity: 0 }], { duration: 750, easing: 'ease-out', fill: 'forwards' }).finished.catch(() => {});
        else S.lid.style.display = 'none';
        if (!live(t)) return;
        musOff(1.6);   // 행진곡 응답구가 뚜껑과 함께 끝난다
        const d = C.doll;
        await glide(d, d.x, d.y - 18, 500, { n: 1, hopH: .1 });
        if (live(t)) d.hop(6, 300);
      },
      /* 3장 */
      async stand_turn() {
        const d = C.doll; sfx('pop', .3);
        await d.hop(5, 260); d.look('open', 'right');
        return sleep(300);
      },
      async nut_press() {
        const t = tok, f = C.fritz, d = C.doll;
        const [x0, y0] = f.hand(); f.hold(null);
        const nut = loose('nc_prop_nut', 26); S.nut = nut;
        const [jx, jy] = d.jaw();
        await arc(nut, x0, y0 - 12, jx, jy, 650, 40);
        if (!live(t)) return; await sleep(250);
      },
      async jaw_crack() {
        const t = tok, d = C.doll, f = C.fritz;
        sfx('jaw_crack', .7);
        d.look('loose', 'left'); f.look('flinch');
        if (!document.hidden) d.body.animate([{ rotate: '0deg' }, { rotate: '-6deg' }, { rotate: '3deg' }, { rotate: '0deg' }], 500);
        await sleep(300); if (!live(t)) return;
        sfx('nut_roll', .55);
        const [jx, jy] = d.jaw();
        if (S.nut) await arc(S.nut, jx, jy, jx - 70, TABLE_Y - 4, 900, 10, -540);
        if (!live(t)) return; await sleep(300);
      },
      /* 4장 */
      cloth_show() {
        S.cloths = {};
        [['blue', X(360, 400)], ['yellow', X(660, 610)]].forEach(([k, x]) => {
          const g = T.el('g', { 'pointer-events': 'none' }, S.top);
          const pg = T.el('g', { filter: 'url(#pp)' }, g); picW(T, pg, 'nc_prop_cloth_' + k, x, TABLE_Y - 18, 92);
          if (!document.hidden && !T.readInstant()) g.animate([{ opacity: 0, translate: '0 -20px' }, { opacity: 1, translate: '0 0' }], { duration: 400, easing: 'ease-out' });
          S.cloths[k] = { g, x, y: TABLE_Y - 18 };
        });
        sfx('cloth_swish', .4);
        return sleep(400);
      },
      async tie() {
        const t = tok, d = C.doll, cl = S.cloths && S.cloths.blue;
        if (S.cloths && S.cloths.yellow) fade(S.cloths.yellow.g, 1, 0, 400);
        sfx('cloth_swish', .6);
        if (cl) {
          const [jx, jy] = d.jaw();
          const inner = cl.g.firstChild; inner.setAttribute('transform', `translate(${-cl.x} ${-cl.y})`);
          await arc(cl.g, cl.x, cl.y, jx, jy, 700, 50);
          if (!live(t)) return;
          cl.g.remove();
        }
        d.setKnot(true); sfx('knot_pluck', .6);
        await d.hop(5, 300); if (!live(t)) return;
        await sleep(400);
      },
      /* 4장 끝: 의자 장면으로 디졸브 */
      async to_chair() {
        const snap = Ly => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('pointer-events', 'none'); [...Ly.children].forEach(n => g.appendChild(n.cloneNode(true))); return g; };
        const old = document.hidden ? null : [snap(T.bg), snap(T.world), snap(T.fx)];
        const lx0 = LX;
        SET.chair();
        if (!old) return null;
        old.forEach((g, i) => { [T.bg, T.world, T.fx][i].appendChild(g); if (LX !== lx0) g.setAttribute('transform', `translate(${LX - lx0} 0)`); });
        await Promise.all(old.map(g => g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: 'ease-in-out', fill: 'forwards' }).finished.catch(() => {})));
        old.forEach(g => g.remove());
        return null;
      },
      async basket_tuck() {
        const t = tok, d = C.doll;
        await glide(d, S.basket[0], S.basket[1] - 34, 900, { hopH: .2, n: 1 });
        if (!live(t)) return;
        S.basketG.appendChild(d.pos);
        await glide(d, S.basket[0], S.basket[1] + 22, 400, { hopH: 0, n: 1 });
        if (!live(t)) return;
        sfx('basket_set', .55);
        await sleep(300);
      },
      async clara_sit() {
        const t = tok, c = C.clara;
        c.look('laugh', 'left');
        const pp = pan(330, 1300);
        await glide(c, 185, 528, 1300);
        await pp; if (!live(t)) return;
        c.look('yawn'); sfx('yawn', .35);
        await sleep(700);
      },
      /* 5장 */
      async tree_grow() {
        sfx('tree_grow', .6);
        if (document.hidden) { S.tree.style.transform = 'scale(1.06,1.22)'; return; }
        await S.tree.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.06,1.22)' }], { duration: 1800, easing: 'ease-out', fill: 'forwards' }).finished.catch(() => {});
      },
      async doll_rise() {
        const t = tok, d = C.doll;
        d.look('rise', 'left'); d.place(S.basket[0], S.basket[1] + 30);
        await glide(d, S.basket[0] - 6, S.basket[1] + 12, 700, { n: 1, hopH: .08 });
        if (!live(t)) return;
        sfx('wink_ting', .6);
      },
      /* 6장 */
      async king_peek() {
        const t = tok, k = C.king;
        const pp = pan(S.holeLx);
        k.place(HOLE[0] - 10, 470); k.pos.style.opacity = '1';
        sfx('mouse_pizz', .45);
        await glide(k, 790, 486, 900, { hopH: .06 });
        if (!live(t)) return; await pp;
      },
      async mice_peek() {
        const t = tok;
        sfx('mice_scurry', .4);
        [[C.grey, 850, 472], [C.brown, 880, 506]].forEach(([m, x, y], i) => { m.place(HOLE[0], 470); m.pos.style.opacity = '1'; setTimeout(() => { if (live(t)) glide(m, x, y, 700, { hopH: .07 }); }, i * 250); });
        await sleep(900);
      },
      async march() {
        const t = tok, gr = C.guard_round, gf = C.guard_flat;
        const pp = pan(S.home);
        await pp;
        gr.look('march_a', 'right'); gf.look('march_a', 'right');
        const beat = setInterval(() => { if (live(t)) sfx('snare_march', .4); }, 900);
        await Promise.all([glide(gr, 305, 532, 2600, { hopH: .07, n: 6 }), sleep(250).then(() => glide(gf, 250, 530, 2400, { hopH: .07, n: 6 }))]);
        clearInterval(beat);
        if (!live(t)) return;
        gr.look('stand', 'right'); gf.look('stand', 'right'); sfx('pop', .3);
        await sleep(400);
      },
      async mice_gather() {
        const t = tok;
        sfx('mice_scurry', .45);
        const pp = pan(S.home);
        await Promise.all([glide(C.king, 545, 512, 1500, { hopH: .06 }), sleep(150).then(() => glide(C.grey, 610, 498, 1400, { hopH: .06 })), sleep(300).then(() => glide(C.brown, 640, 532, 1300, { hopH: .05 })), pp]);
        if (!live(t)) return;
        C.king.look('call');
      },
      /* 7장 */
      slipper_show() {
        const c = C.clara; c.look('toss', 'right'); c.place(270, 528);
        c.hold({ f: 'nc_prop_slipper', w: 54, dy: 4 });
        return null;
      },
      async slipper_toss() {
        const t = tok, c = C.clara;
        const [hx, hy] = c.hand(); c.hold(null);
        if (S.slipZ) S.slipZ.remove();
        const s = loose('nc_prop_slipper', 54); S.slip = s;
        sfx('slipper_whoosh', .6);
        await arc(s, hx, hy + 4, S.rug[0], S.rug[1], 650, 80, 360);
        if (!live(t)) return;
        sfx('slipper_tap', .75);
        C.king.look('startle', 'left'); C.grey.look('jump', 'left'); C.brown.look('freeze', 'left');
        [C.king, C.grey, C.brown].forEach(m => m.hop(10, 300));
        await sleep(500);
      },
      async mice_out() {
        const t = tok;
        const pp = pan(S.holeLx, 1500);
        sfx('mice_scurry', .55);
        const run1 = (m, d) => sleep(d).then(async () => {
          if (!live(t)) return;
          m.look(m === C.king ? 'turn' : 'out', 'right');
          await glide(m, HOLE[0] - 30, 474, 1300, { hopH: .05 });
          if (!live(t)) return;
          await glide(m, HOLE[0] + 6, 440, 420, { n: 1, hopH: .02 });
          await fade(m.pos, 1, 0, 250);
        });
        await Promise.all([run1(C.king, 0), run1(C.grey, 250), run1(C.brown, 450), pp]);
      },
      /* 8장 */
      async slipper_on() {
        const t = tok, c = C.clara;
        if (S.slip) { await arc(S.slip, X(355, 365), 520, c.x - 10, 524, 450, 10); if (!live(t)) return; await fade(S.slip, 1, 0, 250); }
        sfx('pop', .35); c.look('laugh', 'right');
        await sleep(300);
      },
      async transform() {
        const t = tok, d = C.doll, p = C.prince;
        sfx('cape_flutter', .6); sfx('transform_shimmer', .55);
        put(T, p, d.x, d.y, { look: 'bow', to: 'left', parent: S.act }); p.setKnot(true); p.pos.style.opacity = '0';
        if (!document.hidden) {
          await Promise.all([d.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, fill: 'forwards' }).finished.catch(() => {}),
            p.pos.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 300, fill: 'forwards' }).finished.catch(() => {})]);
        }
        if (!live(t)) return;
        p.pos.getAnimations().forEach(a => a.cancel()); p.pos.style.opacity = '1'; hide(d);
      },
      /* 9장 */
      async flake_up() {
        const t = tok, c = C.clara, p = C.prince;
        c.look('snow', 'left'); p.look('follow_flake');
        sfx('snow_tin', .6);
        const [hx, hy] = c.hand();
        await arc(S.flakeUp, S.flUp[0], S.flUp[1], hx, hy - 16, 1100, 60, 90);
        if (!live(t)) return;
        sfx('snow_touch', .6);
        if (!document.hidden) S.flakeUp.animate([{ opacity: 1 }, { opacity: .9 }], 200);
      },
      async cross() {
        const t = tok, c = C.clara, p = C.prince;
        p.look('cross', 'left'); c.look('snow', 'left');
        fade(S.flakeUp, 1, 0, 600);
        await Promise.all([glide(c, X(300, 330), S.deck + 6, 2600, { hopH: .04 }), glide(p, X(395, 425), S.deck + 6, 2600, { hopH: .04 })]);
      },
      /* 10장 */
      async gate_open() {
        const t = tok;
        sfx('gate_wafer', .6);
        if (!document.hidden) await Promise.all([S.gateL.animate([{ translate: '0 0', opacity: 1 }, { translate: '-130px 0', opacity: 0 }], { duration: 1100, easing: 'ease-in-out', fill: 'forwards' }).finished,
          S.gateR.animate([{ translate: '0 0', opacity: 1 }, { translate: '130px 0', opacity: 0 }], { duration: 1100, easing: 'ease-in-out', fill: 'forwards' }).finished]).catch(() => {});
        else { S.gateL.style.display = S.gateR.style.display = 'none'; }
        if (!live(t)) return;
        C.fairy.look('welcome'); await fade(C.fairy.pos, 0, 1, 600);
        if (!live(t)) return;
        sfx('harp_gliss', .35);
        await sleep(600);
      },
      async bloom() {
        const t = tok, f = C.fairy;
        f.look('turn', 'right');
        for (const fl of S.flowers) {
          if (!live(t)) return;
          fl.g.innerHTML = ''; stand(T, fl.g, 'nc_prop_flower_open', fl.x, fl.by, 92);
          if (!document.hidden) fl.g.animate([{ transform: 'scale(.7,.85)' }, { transform: 'scale(1.06,1.04)', offset: .6 }, { transform: 'scale(1,1)' }], { duration: 520, easing: 'ease-out' });
          sfx('tiptoe_ting', .45);
          await sleep(document.hidden ? 0 : 600);
        }
      },
      async petal_fold() {
        const fl = S.flowers[S.flowers.length - 1];
        sfx('petal_fold', .55);
        if (!document.hidden) await fl.g.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(.85,.95)' }], { duration: 500, fill: 'forwards' }).finished.catch(() => {});
        fl.g.getAnimations().forEach(a => a.cancel());
        fl.g.innerHTML = ''; stand(T, fl.g, 'nc_prop_flower_bud', fl.x, fl.by, 92);
      },
      /* 11장 */
      async lift_doll() {
        const t = tok, c = C.clara, d = C.doll;
        c.look('cradle', 'right');
        const [hx, hy] = c.hand();
        S.top.appendChild(d.pos); d.look('nestle', 'left');
        sfx('chime_up', .35);
        await glide(d, hx + 4, hy + 46, 1300, { n: 1, hopH: .4 });
        if (!live(t)) return;
        sfx('warm_chord', .4);
      },
      settle() { tok++; panTok++; return null; },
    };
    /* 안 기다리는 동사(&이름) */
    Object.keys(A).forEach(k => { A['&' + k] = (...a) => { try { const r = A[k](...a); if (r && r.catch) r.catch(e => console.warn('[nc]', k, e)); } catch (e) { console.warn('[nc]', k, e); } return null; }; });

    /* 놀이 조작 */
    const ASK = {
      async box() {
        S.boxZ.setAttribute('pointer-events', 'all');
        const b = bob(S.boxG.firstChild ? S.boxG : S.boxG);
        await T.ask(line('B_ASK'), () => T.tap(S.boxZ, { prompt: line('B_ASK') }));
        b.cancel();
        await A.box_open();
      },
      async cloth() {
        await A.cloth_show();
        const mkOpt = k => { const c = S.cloths[k]; const z = zone(S.ui, c.x, c.y, 96, 80); return { k, el: z, ok: k === 'blue', c }; };
        const opts = ['blue', 'yellow'].map(mkOpt).map(o => ({ ...o, onWrong: async () => { sfx('doop', .4); await wiggle(o.c.g); await say('D_NO'); } }));
        const r = await T.ask(line('D_ASK'), () => T.choose(opts, { prompt: line('D_ASK') }));
        opts.forEach(o => o.el.remove());
        await say('D_OK');
        await A.tie();
        return r;
      },
      async slipper() {
        const c = C.clara, [hx, hy] = c.hand();
        S.slipZ = zone(S.ui, hx, hy + 4, 92, 88);
        const b = c.body.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity });
        await T.ask(line('G_ASK'), () => T.tap(S.slipZ, { prompt: line('G_ASK') }));
        b.cancel();
        await A.slipper_toss();
      },
      async flake() {
        const zu = zone(S.ui, S.flUp[0], S.flUp[1], 88, 88), zd = zone(S.ui, S.flDn[0], S.flDn[1], 88, 88);
        const opts = [{ el: zu, ok: true }, { el: zd, ok: false, onWrong: async () => {
          sfx('doop', .4);
          if (!document.hidden) { S.branch.animate([{ rotate: '0deg' }, { rotate: '-4deg' }, { rotate: '3deg' }, { rotate: '0deg' }], 600); S.flakeDn.animate([{ translate: '0 0' }, { translate: '-6px -4px' }, { translate: '5px 0' }, { translate: '0 0' }], 600); }
          await say('I_NO');
        } }];
        await T.ask(line('I_ASK'), () => T.choose(opts, { prompt: line('I_ASK') }));
        zu.remove(); zd.remove();
        await A.flake_up();
        await say('I_OK');
      },
    };

    const say = async k => { await T.say(line(k)); await sleep(350); };
    const runStep = async s => {
      if (s.startsWith('say:')) return say(s.slice(4));
      if (s.startsWith('ask:')) return ASK[s.slice(4)]();
      const [name, ...args] = s.split(':');
      const f = A[name];
      if (!f) { console.warn('[nc] 모르는 동사', s); return null; }
      try { const r = f(...args); if (r && r.then) await r; } catch (e) { console.warn('[nc] 동사 실패', s, e); }
      return null;
    };

    /* ================= 읽어 주기 ================= */
    if (T.reading()) {
      const RA = Object.assign({}, A, { set: n => { setScene(+n); return null; } });
      const RW = Object.create(T);
      /* 녹음이 없는 줄도 글자는 보인다(엔진은 읽어 주기에서 녹음 없는 줄을 바로 건너뛴다 → 이 동화는 말풍선을 읽을 만큼 띄운다, 소리는 없음) */
      const hasClip = t => { try { const en = typeof englishOn === 'function' && englishOn(); if (en) return !!(NARRATION_CLIPS_EN[t] && NARRATION_CLIPS_EN[t].c); return typeof NARRATION_CLIPS !== 'undefined' && !!NARRATION_CLIPS[t]; } catch (e) { return false; } };
      RW.say = (text, o = {}) => (hasClip(text) ? T.say(text, o) : T.say(text, { ...o, recordedOnly: false }));
      try {
        const r = await T.readPlay.call(RW, RA);
        await sleep(400);
        return r;
      } finally { musOff(2); A.settle(); }
    }

    /* ================= 놀이 ================= */
    const from = Math.max(1, Math.min(11, +QS.get('from') || 1));
    window.__nc = { scene: 0 };
    let first = true;
    for (const sc of SCENES) {
      if (sc.n < from) continue;
      window.__nc.scene = sc.n;
      if (first) { setScene(sc.n); await T.curtain(true); first = false; }
      else await T.sceneCard(tr(sc.card), () => setScene(sc.n));
      for (const s of sc.steps) await runStep(s);
    }
    window.__nc.scene = 12;
    musOff(2.5);
    T.finale(); await sleep(1200);
    return '친구가 곤란할 때 곁에서 도와줄 수 있어요.';
  }

  Tale.mount({ title: '호두까기 인형', subtitle: '', read: true, run: T => run(Tale.api) });
})();
