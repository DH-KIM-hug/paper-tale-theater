/* 빨간 암탉 — 세계 민담(The Little Red Hen). 기획: tales/red_hen/PLAN.md (2026-10-30). 그림 접두어 hen_ (assets/v3w/hen_*.webp, 137장)
   장면 10: 원작 7장(1 누가 심어 줄래? … 7 누가 먹어 줄래?) + 다음 날 아침 에필로그 3장(8 우리도 할게! · 9 다 같이 ○○ · 10 다 같이 냠냠).
   두 번째 요리: 샌드위치·피자·팬케이크 중 무작위(놀이·자동 재생 모두). 시험용 ?dish=sandwich|pizza|pancake. 개발용 ?from=1~10 (그 장면부터).
   조작(모두 T.ask: 안내와 누르기를 함께 연다): 1장 감정 고르기 · 2장 씨앗 자루 톡(재미) · 5장 재료 찾기 ×2 · 8장 순서 카드 ×3(넷째는 저절로) · 9장 재료 찾기 ×3 · 10장 인사 톡.
   낱말: 한국어 모드는 한국어 이름만, 영어 모드는 영어 이름만(대사표 narration.js / narration_en.js). 낱말 꼬리표(hen_prop_tag + 글자)는 자막 끄기와 상관없이 보인다.
   녹음 전: narration_el.js 가 없으면 말풍선만 읽을 만큼 띄우고 소리 없이 넘어간다(TTS 없음).
   배경 음악: 1장 바흐 첼로 피치카토 · 8장 아침의 기분 · 10장 빈 행진곡(sounds/sfx/classical_*.mp3, 배움 장면에서는 끈다). 끝 = finale_fairy.
   세로 화면: 보이는 폭이 좁아(약 390) 장면마다 보는 가운데(lx)를 옮기고 배경·무대를 함께 옮긴다(setView). */
(() => {
  const AS = '../../assets/v3w/';
  const src = k => AS + k + '.webp';
  const FL = 490;                                   // 바닥(발끝 y)
  const INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";
  const QS = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(''); } })();
  const L = typeof RH_LINES !== 'undefined' ? RH_LINES : {};
  const artOK = {};
  let curBg = '';

  /* ---------- 크기(HT): 같은 부위를 재서 맞춘 높이(CLAUDE.md §4-1, 2026-10-31 그림 도착 뒤)
     인물 그림은 높이 600 으로 오려져 있다. 기준 높이(PLAN 크기표, 암탉 서기 = 170): 암탉 170 · 병아리 60(0.35) · 고양이 앉기 119(0.7) · 개 앉기 145(0.85) · 돼지 서기 145(0.85).
     재는 부위: 암탉 = 볼 동그라미 지름(서기 40px), 병아리 = 볼 지름(서기 54.5), 고양이 = 귀 안쪽 분홍 높이(앉기 98), 개 = 볼 지름(앉기 35.5), 돼지 = 코 높이(서기 138/599).
     HT = 기준 × (기준 부위 / 자세 부위). 엿보기(peek) 그림은 얼굴이 크게 그려져 같은 방식이 크게 빗나가 사진을 견주어 고쳤다(개 91→100, 돼지 116→118), 돼지 두 발 서기는 코가 비스듬해 작게 잡혀(211) 머리 크기를 사진으로 견주어 172. */
  const HT = {
    hen_hen_stand: 170, hen_hen_hold_sack: 170, hen_hen_sad: 172, hen_hen_determined: 174, hen_hen_sow: 156, hen_hen_water: 174, hen_hen_look_up: 160, hen_hen_cut: 158,
    hen_hen_carry: 184, hen_hen_ask: 170, hen_hen_knead: 168, hen_hen_butter: 170, hen_hen_sit_wait: 146, hen_hen_bread: 186, hen_hen_speak_calm: 162, hen_hen_eat: 170,
    hen_hen_happy: 189, hen_hen_point: 164, hen_hen_place: 158, hen_hen_pour: 162, hen_hen_wave: 189,
    hen_chick_stand: 60, hen_chick_look_up: 59, hen_chick_hop: 61, hen_chick_carry: 56, hen_chick_eat: 43,
    hen_cat_sit: 119, hen_cat_lie_fence: 100, hen_cat_yawn: 120, hen_cat_peek: 75, hen_cat_sniff: 120, hen_cat_raise: 121, hen_cat_run: 115, hen_cat_stand_help: 119, hen_cat_eat: 120,
    hen_dog_sit: 145, hen_dog_lie: 84, hen_dog_peek: 100, hen_dog_sniff: 135, hen_dog_raise: 145, hen_dog_run: 154, hen_dog_stand_help: 154, hen_dog_eat: 143,
    hen_pig_stand: 145, hen_pig_mud: 174, hen_pig_peek: 118, hen_pig_sniff: 164, hen_pig_raise: 179, hen_pig_run: 193, hen_pig_stand_help: 172, hen_pig_eat: 176,
    /* 소품(암탉 = 170 기준, PLAN 크기표) */
    hen_prop_seed_sack: 85, hen_prop_sun: 96, hen_prop_sprout: 51, hen_prop_wheat_young: 119, hen_prop_wheat_gold: 221, hen_prop_wheat_cut: 62, hen_prop_wheat_bundle: 120,
    hen_prop_flour_bin: 120, hen_prop_mill_sails: 190, hen_prop_oven_closed: 230, hen_prop_oven_open: 230, hen_prop_bread: 64, hen_prop_smell: 120,
    hen_prop_bowl_flour: 70, hen_prop_bowl_dough: 70, hen_prop_tin: 40, hen_prop_plate: 34, hen_prop_cup: 34, hen_prop_tag: 50,
    hen_prop_table_kitchen: 190, hen_prop_table_long: 196, hen_prop_shelf: 112, hen_prop_bow_red: 22, hen_prop_bow_blue: 22, hen_prop_bow_green: 22,
    hen_fg_flower_bush: 150, hen_fg_grass_tuft: 90, hen_fg_wheat_ears: 170, hen_fg_pot_plant: 120, hen_fg_hanging_pans: 120,
  };
  /* 2026-10-31: 기획의 '암탉 약 170' 은 아이패드 화면에서 작아 보여 모든 인물·소품을 같은 비율로 1.2 배(G). 비율(크기표)은 그대로 */
  const G = 1.2;
  Object.keys(HT).forEach(k => { if (!/mill_sails|prop_tag/.test(k)) HT[k] = Math.round(HT[k] * G); });
  /* ASP.txt (post_tale.py, 2026-10-31). preload 가 실제 비율로 다시 덮는다 */
  const ASP = {
    hen_hen_stand: .7633, hen_hen_hold_sack: .8067, hen_hen_sad: .7217, hen_hen_determined: .8233, hen_hen_sow: .9567, hen_hen_water: .9117, hen_hen_look_up: .8467, hen_hen_cut: .9967,
    hen_hen_carry: 1.0333, hen_hen_ask: .8867, hen_hen_knead: .8083, hen_hen_butter: .8383, hen_hen_sit_wait: .8333, hen_hen_bread: .7367, hen_hen_speak_calm: .77, hen_hen_eat: .8333,
    hen_hen_happy: .8633, hen_hen_point: .9, hen_hen_place: .97, hen_hen_pour: .9467, hen_hen_wave: .85,
    hen_chick_stand: .9833, hen_chick_look_up: .9617, hen_chick_hop: .9533, hen_chick_carry: .9133, hen_chick_eat: 1.4433,
    hen_cat_sit: .745, hen_cat_lie_fence: 1.5789, hen_cat_yawn: .7583, hen_cat_peek: .8433, hen_cat_sniff: 1.0567, hen_cat_raise: .825, hen_cat_run: .8533, hen_cat_stand_help: .7367, hen_cat_eat: .755,
    hen_dog_sit: .8833, hen_dog_lie: 1.7476, hen_dog_peek: .8683, hen_dog_sniff: 1.095, hen_dog_raise: .93, hen_dog_run: .865, hen_dog_stand_help: .8033, hen_dog_eat: .8783,
    hen_pig_stand: 1.5025, hen_pig_mud: .8867, hen_pig_peek: 1.19, hen_pig_sniff: 1.4633, hen_pig_raise: 1.0033, hen_pig_run: .885, hen_pig_stand_help: .9233, hen_pig_eat: .96,
    hen_prop_seed_sack: .96, hen_prop_sun: 1.0267, hen_prop_sprout: .6683, hen_prop_wheat_young: .6467, hen_prop_wheat_gold: .48, hen_prop_wheat_cut: 2.0134, hen_prop_wheat_bundle: .825,
    hen_prop_watering_can: 1.07, hen_prop_flour_bin: .8683, hen_prop_flour_bin_empty: 1.2, hen_prop_mill_sails: .99, hen_prop_shelf: 3.8298,
    hen_prop_ing_flour: .9467, hen_prop_ing_water: .945, hen_prop_ing_butter: 1.6667, hen_prop_ing_tomato: 1.02, hen_prop_ing_cheese: 1.0867, hen_prop_ing_lettuce: .965, hen_prop_ing_egg: 1.1283,
    hen_prop_ing_milk: .49, hen_prop_ing_corn: .7867, hen_prop_ing_strawberry: .8, hen_prop_ing_banana: 1.1733, hen_prop_ing_honey: .9067,
    hen_prop_bowl_flour: 1.3383, hen_prop_bowl_dough: 1.3233, hen_prop_tin: 2.2005, hen_prop_oven_closed: .785, hen_prop_oven_open: .785, hen_prop_bread: 1.2267, hen_prop_bread_slice: 2.1378,
    hen_prop_plate: 3.5433, hen_prop_smell: .6717, hen_prop_window_frame: 1.4, hen_prop_layer_lettuce: 2.1687, hen_prop_layer_tomato: 2.795, hen_prop_layer_cheese: 2.1277, hen_prop_layer_egg: 3.0612,
    hen_prop_sandwich_piece: 1.1833, hen_prop_pizza_dough: 1.3183, hen_prop_pizza_layer_sauce: 1.3183, hen_prop_pizza_layer_cheese: 1.335, hen_prop_pizza_layer_corn: 1.3, hen_prop_pizza_whole: 1.3,
    hen_prop_pizza_slice: .9333, hen_prop_fry_pan: 3.4615, hen_prop_pancake_stack: 1.5306, hen_prop_pancake_layer_strawberry: 3.9301, hen_prop_pancake_layer_banana: 3.321, hen_prop_pancake_layer_honey: 1.6187,
    hen_prop_pancake_piece: 1.3667, hen_prop_card_seed: .9467, hen_prop_card_wheat: .7267, hen_prop_card_flour: .755, hen_prop_card_bread: .8983, hen_prop_card_pizza: .795, hen_prop_card_pancake: .84,
    hen_prop_card_slot: .7783, hen_prop_face_sad: .7417, hen_prop_face_happy: .74, hen_prop_tag: 2.2059, hen_prop_bow_red: 1.1767, hen_prop_bow_blue: 1.1533, hen_prop_bow_green: 1.27,
    hen_prop_table_long: 2.148, hen_prop_cup: 1.2867, hen_prop_table_kitchen: 1.7613,
    hen_fg_flower_bush: 1.5762, hen_fg_grass_tuft: .98, hen_fg_wheat_ears: .7933, hen_fg_pot_plant: .845, hen_fg_hanging_pans: 1.2317,
  };
  /* 보는 쪽(그림을 보고 정함, 2026-10-31). 정면은 방향을 못 바꾼다 */
  const NAT = {
    hen_hen_stand: 'left', hen_hen_hold_sack: 'left', hen_hen_sad: 'left', hen_hen_determined: 'front', hen_hen_sow: 'left', hen_hen_water: 'left', hen_hen_look_up: 'left', hen_hen_cut: 'left',
    hen_hen_carry: 'right', hen_hen_ask: 'left', hen_hen_knead: 'left', hen_hen_butter: 'left', hen_hen_sit_wait: 'right', hen_hen_bread: 'front', hen_hen_speak_calm: 'right', hen_hen_eat: 'left',
    hen_hen_happy: 'front', hen_hen_point: 'left', hen_hen_place: 'right', hen_hen_pour: 'right', hen_hen_wave: 'front',
    hen_chick_stand: 'left', hen_chick_look_up: 'left', hen_chick_hop: 'front', hen_chick_carry: 'right', hen_chick_eat: 'left',
    hen_cat_sit: 'left', hen_cat_lie_fence: 'left', hen_cat_yawn: 'front', hen_cat_peek: 'right', hen_cat_sniff: 'left', hen_cat_raise: 'left', hen_cat_run: 'right', hen_cat_stand_help: 'left', hen_cat_eat: 'left',
    hen_dog_sit: 'left', hen_dog_lie: 'left', hen_dog_peek: 'right', hen_dog_sniff: 'left', hen_dog_raise: 'left', hen_dog_run: 'right', hen_dog_stand_help: 'left', hen_dog_eat: 'left',
    hen_pig_stand: 'left', hen_pig_mud: 'left', hen_pig_peek: 'right', hen_pig_sniff: 'left', hen_pig_raise: 'left', hen_pig_run: 'right', hen_pig_stand_help: 'left', hen_pig_eat: 'left',
  };
  /* 그림 안 자리(그림 폭·높이 비율, 왼쪽 위 0,0 — 뒤집기 전 그림 기준): 병아리 리본(머리 위) · 들고 오는 재료(앞발) · 먹는 음식(입 앞) */
  const BOW = { hen_chick_stand: [.44, .07], hen_chick_look_up: [.6, .06], hen_chick_hop: [.5, .05], hen_chick_carry: [.5, .05], hen_chick_eat: [.33, .15] };
  const HOLD = { hen_dog_run: [.9, .38], hen_cat_run: [.92, .42], hen_pig_run: [.94, .38], hen_chick_carry: [.5, -.08],
    hen_hen_eat: [.12, .36], hen_cat_eat: [.14, .33], hen_dog_eat: [.16, .3], hen_pig_eat: [.16, .3], hen_chick_eat: [.1, .5] };

  /* ---------- 두 번째 요리(PLAN §두 번째 요리) ---------- */
  const DISHES = {
    sandwich: { bring: ['tomato', 'cheese', 'lettuce'], cells: ['lettuce', 'tomato', 'cheese', 'egg'], ask: ['lettuce', 'tomato', 'cheese'], card: 'hen_prop_card_bread', cut: 'hen_cut_sandwich', piece: 'hen_prop_sandwich_piece' },
    pizza: { bring: ['tomato', 'cheese', 'corn'], cells: ['tomato', 'cheese', 'corn', 'strawberry'], ask: ['tomato', 'cheese', 'corn'], card: 'hen_prop_card_pizza', cut: 'hen_cut_pizza', piece: 'hen_prop_pizza_slice' },
    pancake: { bring: ['strawberry', 'honey', 'banana'], cells: ['strawberry', 'banana', 'honey', 'tomato'], ask: ['strawberry', 'banana', 'honey'], card: 'hen_prop_card_pancake', cut: 'hen_cut_pancake', piece: 'hen_prop_pancake_piece' },
  };
  const LAYER = { sandwich: { lettuce: 'hen_prop_layer_lettuce', tomato: 'hen_prop_layer_tomato', cheese: 'hen_prop_layer_cheese', egg: 'hen_prop_layer_egg' },
    pizza: { tomato: 'hen_prop_pizza_layer_sauce', cheese: 'hen_prop_pizza_layer_cheese', corn: 'hen_prop_pizza_layer_corn' },
    pancake: { strawberry: 'hen_prop_pancake_layer_strawberry', banana: 'hen_prop_pancake_layer_banana', honey: 'hen_prop_pancake_layer_honey' } };
  const ING = id => 'hen_prop_ing_' + id;
  const WORDKO = { water: '물', flour: '밀가루', butter: '버터', bread: '빵', tomato: '토마토', cheese: '치즈', lettuce: '상추', egg: '달걀', milk: '우유', corn: '옥수수',
    strawberry: '딸기', banana: '바나나', honey: '꿀', sandwich: '샌드위치', pizza: '피자', pancake: '팬케이크' };

  /* ================= 그림 ================= */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f] !== false) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    return T.el('rect', { x, y, width: w, height: h, rx: 10, fill: '#D9A94E' }, parent);   // 그림을 못 불러오면 빈 종이 자리
  }
  const fitWH = (f, bw, bh) => { const a = ASP[f] || 1; return bw / bh > a ? [bh * a, bh] : [bw, bw / a]; };
  const pic = (T, parent, f, cx, cy, bw, bh = bw) => { const [w, h] = fitWH(f, bw, bh); return sprite(T, parent, f, cx - w / 2, cy - h / 2, w, h); };
  /* 바닥(cx, 발끝 by)에 높이 h 로 세운다 */
  const stand = (T, parent, f, cx, by, h = HT[f], o = {}) => { const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none', ...o }, parent); const w = h * (ASP[f] || 1); sprite(T, g, f, cx - w / 2, by - h, w, h); g.dataset.f = f; return g; };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  /* 빛 층(CLAUDE.md §7-1 빛 예외): 광원에서 멀수록 흐려지는 둥근 빛 */
  function glow(T, parent, cx, cy, r, color = '#F2B366', a = .85) {
    const svg = T.world.ownerSVGElement, id = 'rhGlow' + color.replace('#', '') + String(a).replace('.', '');
    if (!svg.querySelector('#' + id)) {
      let defs = svg.querySelector('defs#rhDefs'); if (!defs) { defs = T.el('defs', {}, svg); defs.id = 'rhDefs'; }
      const g = T.el('radialGradient', { id }, defs);
      T.el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': a }, g); T.el('stop', { offset: '.45', 'stop-color': color, 'stop-opacity': a * .45 }, g); T.el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, g);
    }
    return T.el('circle', { cx, cy, r, fill: `url(#${id})`, 'pointer-events': 'none' }, parent);
  }

  /* ================= 배우 ================= */
  function mk(T, poses, deco) {
    const looks = {};
    let holdG, decoG;
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, f]) => {
        const h = HT[f], w = h * (ASP[f] || 1), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, f, nat: NAT[f] || 'front' };
      });
      decoG = T.el('g', { filter: 'url(#pp)' }, g); holdG = T.el('g', { filter: 'url(#pp)' }, g);
    });
    a.want = 'left'; a.item = null;
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    const at = ([fx, fy]) => { const l = looks[a.cur]; return [-l.w / 2 + fx * l.w, -l.h + fy * l.h]; };
    const drawHold = () => {
      holdG.innerHTML = ''; if (!a.item) return;
      const p = HOLD[looks[a.cur].f]; if (!p) return;
      const [x, y] = at(p); pic(T, holdG, a.item.f, x, y, a.item.s, a.item.s);
    };
    const drawDeco = () => { decoG.innerHTML = ''; if (!deco) return; const p = BOW[looks[a.cur].f]; if (!p) return; const [x, y] = at(p); pic(T, decoG, deco, x, y, HT[deco] * 1.3, HT[deco]); };
    a.look = (k, d) => { Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; }); a.cur = k; a.h = looks[k].h; a.w = looks[k].w; drawDeco(); drawHold(); a.turn(d || a.want); };
    a.hold = (f, s = 44) => { a.item = f ? { f, s } : null; drawHold(); };
    a.holdAt = () => { const p = HOLD[looks[a.cur].f] || [.5, .5]; const [x, y] = at(p); return [a.x + x * a.flip * a.scale, a.y + y * a.scale]; };
    a.look(Object.keys(poses)[0]);
    a.pos.style.pointerEvents = 'none';            // 인물 그림은 누름을 받지 않는다(인사 톡은 따로 hit 상자로)
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  function put(T, a, x, y, { look, to, s = 1, parent } = {}) {
    (parent || T.world).appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); a.x = x; if (look) a.look(look, to || a.want); else a.turn(to || a.want);
    a.place(x, y); a.body.style.transform = ''; a.body.style.opacity = '';
    return a;
  }
  /* 누르는 상자: 종이 칸(보이는 판) + 투명 판. 대상 그룹 g 를 arm 한다 */
  function hitZone(T, parent, cx, cy, w, h) {
    const g = T.el('g', {}, parent);
    T.el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 12, fill: '#000', 'fill-opacity': 0 }, g);
    return g;
  }

  async function run(T) {
    const { sleep, tr } = T;
    T.cardSpeed(.6);
    const GAP = 600;
    const line = k => L[k] || k;
    const say = async k => { await T.say(line(k)); await sleep(GAP); };
    const P = T.viewWidth() < 990;
    const VW = T.viewWidth();
    const PS = P ? Math.min(1, VW / 400) : 1;
    const X = (l, p) => (P ? p : l);
    const H = n => (P ? n / PS : n);
    let LX = 500;
    const setView = (lx = 500) => {
      T.fx.style.pointerEvents = 'none'; LX = P ? lx : 500;
      const t = P ? `translate(500 ${FL}) scale(${PS}) translate(${-lx} ${-FL})` : '';
      [T.bg, T.world, T.fx].forEach(g => (t ? g.setAttribute('transform', t) : g.removeAttribute('transform')));
      T.camSnap(500, 280, 1);
    };
    const bgImage = key => { curBg = key; return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg); };
    const fg = (f, x, by, h, flip) => { const g = stand(T, T.fx, f, x, by, h); if (flip) g.setAttribute('transform', `translate(${2 * x} 0) scale(-1 1)`); return g; };

    /* ---- 소리 ---- */
    const playS = (n, v) => { try { return n.startsWith('animals/') ? AudioFX.animal(n.slice(8), v) : AudioFX.sfx(n, v); } catch (e) { return false; } };
    const cue = (names, v = .6) => { for (const n of [].concat(names)) if (playS(n, v)) return true; return false; };
    AudioFX.preloadSfx(['paper_turn', 'ding', 'ding_glock', 'ding_glock_2', 'pop', 'pop_appear', 'whoosh', 'slide_up', 'slide_down', 'whistle_up', 'whistle_down', 'harp_gliss', 'harp_gliss_2', 'chime_up',
      'xylo_up', 'shimmer', 'sparkle', 'toot_kazoo', 'yawn', 'water_pour_1', 'dig_soil_1', 'chop', 'rattle', 'drum', 'knock', 'door', 'bell', 'fire_crackle', 'steam_hiss', 'chomp', 'chomp_2', 'step_grass',
      'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'tada', 'party_horn', 'doop', 'duckling_peep', 'birds_chirp_1', 'paper_up', 'paper_down', 'squelch', 'cymbal', 'swish', 'hop']);
    ['rooster', 'cat', 'dog', 'pig'].forEach(n => { try { AudioFX.animal(n, 0); } catch (e) { /* */ } });
    const peep = () => cue(['duckling_peep', 'pop'], .35);

    /* ---- 그림 불러오기 ---- */
    const BGS = ['hen_bg_yard', 'hen_bg_yard_morning', 'hen_bg_field', 'hen_bg_field_gold', 'hen_bg_mill', 'hen_bg_kitchen', 'hen_bg_kitchen_lb'];
    const loads = [];
    [...BGS, ...Object.keys(ASP)].forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight && ASP[k]) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(5000)]);

    /* ---- 인물 ---- */
    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, `hen_${who}_${p}`]));
    const hen = mk(T, pz('hen', ['stand', 'hold_sack', 'sad', 'determined', 'sow', 'water', 'look_up', 'cut', 'carry', 'ask', 'knead', 'butter', 'sit_wait', 'bread', 'speak_calm', 'eat', 'happy', 'point', 'place', 'pour', 'wave']));
    const chicks = ['red', 'blue', 'green'].map(c => mk(T, pz('chick', ['stand', 'look_up', 'hop', 'carry', 'eat']), 'hen_prop_bow_' + c));
    const cat = mk(T, pz('cat', ['sit', 'lie_fence', 'yawn', 'peek', 'sniff', 'raise', 'run', 'stand_help', 'eat']));
    const dog = mk(T, pz('dog', ['sit', 'lie', 'peek', 'sniff', 'raise', 'run', 'stand_help', 'eat']));
    const pig = mk(T, pz('pig', ['stand', 'mud', 'peek', 'sniff', 'raise', 'run', 'stand_help', 'eat']));
    const FRS = [cat, dog, pig];
    const ALL = [hen, ...chicks, ...FRS];
    ALL.forEach(hide);
    const cast = list => list.forEach(([a, x, y, o]) => put(T, a, x, y, o));
    const chicksAt = (xs, y, o = {}) => chicks.forEach((c, i) => { if (xs[i] == null) hide(c); else put(T, c, xs[i], y, { look: 'stand', ...o }); });
    const chicksLook = (k, d) => chicks.forEach(c => c.look(k, d));
    const chicksHop = () => { chicks.forEach((c, i) => setTimeout(() => c.hop(14, 320), i * 90)); peep(); };

    /* ---- 같은 배경 이어 가기(사탕 마녀 cont 방식): 무대 사본을 얹어 흐리게 지우고, 인물은 새 자리로 걸어간다 ---- */
    const ACT = new Set(ALL.map(a => a.pos));
    const shown = a => a.pos.isConnected && a.pos.style.display !== 'none';
    const tfm = (x, y, f, s) => `translate(${x}px,${y}px) scale(${f * s},${s})`;
    const cont = async (fn, ms = 800) => {
      const was = new Map(ALL.map(a => [a, { vis: shown(a), x: a.x, y: a.y, s: a.scale, f: a.flip, par: a.pos.parentNode }]));
      const snap = Ly => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('pointer-events', 'none'); [...Ly.children].forEach(n => { if (!ACT.has(n)) g.appendChild(n.cloneNode(true)); }); g.querySelectorAll('.tap-target').forEach(n => n.classList.remove('tap-target')); return g; };
      const tb = T.bg.getAttribute('transform') || '';
      const sb = snap(T.bg), sw = snap(T.world), sf = snap(T.fx);
      fn();
      if ((T.bg.getAttribute('transform') || '') !== tb) { await T.sceneCard('', null); return; }   // 보는 자리가 바뀌면(세로) 넘김으로
      T.bg.appendChild(sb); T.world.insertBefore(sw, [...T.world.children].find(n => ACT.has(n)) || null); T.fx.appendChild(sf);
      const jobs = [sb, sw, sf].map(g => g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' }).finished.then(() => g.remove()));
      for (const a of ALL) {
        const w = was.get(a), n = shown(a);
        if (w.vis && n && a.pos.parentNode === T.world && w.par === T.world) {
          if (Math.abs(w.x - a.x) + Math.abs(w.y - a.y) < 2 && Math.abs(w.s - a.scale) < .01) continue;
          const dur = Math.max(ms, Math.min(1500, Math.hypot(a.x - w.x, a.y - w.y) * 2.4));
          jobs.push(a.pos.animate([{ transform: tfm(w.x, w.y, a.flip, w.s) }, { transform: tfm(a.x, a.y, a.flip, a.scale) }], { duration: dur, easing: 'ease-in-out' }).finished);
        } else if (!w.vis && n) jobs.push(a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished);
      }
      await Promise.all(jobs);
    };
    const KITCHEN = /^hen_bg_kitchen/;
    const next = (label, bg, fn) => ((KITCHEN.test(bg) && KITCHEN.test(curBg) && !document.hidden) ? cont(fn) : T.sceneCard(label, fn));

    /* ---- 낱말 꼬리표: 크림 종이 꼬리표 + 그 판의 말 한 줄(자막 끄기와 상관없이 보인다), 낱말 소리와 함께 ---- */
    async function word(k, x, y) {
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx), label = tr(WORDKO[k]);
      const w = Math.max(118, 34 + label.length * (/[a-z]/.test(label) ? 15 : 26)), h = 52;
      const half = P ? 185 / PS : 490, xx = Math.max(LX - half + w / 2, Math.min(LX + half - w / 2, x));
      const inner = T.el('g', { filter: 'url(#pp)' }, g);
      sprite(T, inner, 'hen_prop_tag', xx - w / 2, y - h / 2, w, h);
      T.el('text', { x: xx + w * .05, y: y + 9, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 800, fill: INK, 'font-family': FONT, 'letter-spacing': '1px', text: label }, g);
      g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
      g.animate([{ transform: 'scale(.3) rotate(-8deg)', opacity: 0 }, { transform: 'scale(1.08) rotate(2deg)', opacity: 1, offset: .6 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], { duration: 380, easing: 'ease-out' });
      cue('ding_glock', .45);
      const t0 = Date.now();
      await say('W_' + k);
      await sleep(Math.max(0, 2000 - (Date.now() - t0)));
      g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).finished.then(() => g.remove());
    }
    /* 날아가기: 그림 f 가 (x0,y0)에서 (x1,y1)로 포물선 */
    const fly = (f, x0, y0, x1, y1, size = 70, ms = 650) => {
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx), ig = T.el('g', { filter: 'url(#pp)' }, g); pic(T, ig, f, 0, 0, size);
      cue('whistle_up', .3);
      const a = g.animate([{ transform: `translate(${x0}px,${y0}px) scale(1)` }, { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 90}px) scale(1.05) rotate(160deg)`, offset: .5 }, { transform: `translate(${x1}px,${y1}px) scale(.7) rotate(360deg)` }], { duration: ms, easing: 'ease-in', fill: 'forwards' });
      return a.finished.then(() => g.remove());
    };
    const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -6px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity });
    const wiggle = n => n.animate([{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360).finished;
    /* 재료 칸: Sand 종이 칸 + 재료 그림. 칸 상자만 누름을 받는다 */
    function cell(parent, id, cx, cy, w = 100, h = 100) {
      const g = hitZone(T, parent, cx, cy, H(w), H(h));
      const pg = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, g);
      T.el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 14, fill: '#E9DCC0' }, pg);
      pic(T, pg, ING(id), cx, cy + 2, w * .8, h * .8);
      return { id, el: g, cx, cy };
    }
    /* 찾기 한 회전: 암탉 부탁(안내) + 칸 고르기. 오답 = 뿅 + 흔들림 + "그건 ○○예요." + 힌트 한 줄(두 번째부터 정답 반짝 — 엔진 choose) */
    async function find(cells, id, wrongSay) {
      const ask = line('ASK_' + id);
      const opts = cells.map(c => ({ el: c.el, ok: c.id === id, c,
        onWrong: async () => { cue('doop', .4) || cue('pop', .3); await wiggle(c.el); if (wrongSay && wrongSay[c.id]) await say(wrongSay[c.id]); else { await say('NO_' + c.id); await say('HINT_' + id); } } }));
      const r = await T.ask(ask, () => T.choose(opts, { prompt: ask }));
      cue('ding', .5);
      return r.c;
    }

    /* ---- 배경 음악(2026-10-31 사용자 곡 선택, sounds/sfx/classical_*.mp3 약 27초 토막을 되풀이): 이야기만 흐르는 세 곳에만 낮게.
       1장 오프닝 = bach_cello_pizz · 8장 다음 날 아침(친구들 오기 전) = morning_mood_flute · 10장 잔치(교훈 줄 뒤~인사 톡) = vienna_march.
       배움(꼬리표·찾기·카드) 동안은 끈다. 내레이션 동안은 엔진이 ambient 를 자동으로 낮춘다. 파일이 없으면 조용히 진행 ---- */
    const BGM = { open: 'classical_bach_cello_pizz', morning: 'classical_morning_mood_flute', feast: 'classical_vienna_march' };
    try { AudioFX.preloadSfx([...Object.values(BGM), 'finale_fairy']); } catch (e) { /* 음악 없이 */ }
    let bgmH = null;
    const bgm = k => {
      try {
        if (bgmH) { bgmH.stop(1.2); bgmH = null; }
        if (!k) return;
        const o = { vol: T.reading() ? .12 : .16, loop: true, fadeIn: 1 };
        bgmH = AudioFX.ambient(BGM[k], o);
        if (!bgmH) setTimeout(() => { if (!bgmH) try { bgmH = AudioFX.ambient(BGM[k], o); } catch (e) { /* */ } }, 900);
      } catch (e) { /* 음악 없이 */ }
    };
    /* 맨 끝 축하 음악: 서양 명작 동화와 같은 finale_fairy(9.5초, 커밋 7ef85621). 곡 끝까지 기다렸다 끝 화면 */
    let finaleEnd = 0;
    const finaleMusic = () => { try { bgm(null); const o = { vol: .5, loop: false, fadeIn: .2, dur: 9.5 }; finaleEnd = Date.now() + 9500; if (!AudioFX.ambient('finale_fairy', o)) setTimeout(() => { try { AudioFX.ambient('finale_fairy', o); } catch (e) { /* */ } }, 900); } catch (e) { /* */ } };
    const finaleWait = () => (finaleEnd ? sleep(Math.max(0, Math.min(6000, finaleEnd - Date.now() - 600))) : Promise.resolve());

    const dishQ = QS.get('dish');
    let DISH = DISHES[dishQ] ? dishQ : Object.keys(DISHES)[Math.floor(Math.random() * 3)];
    let D = DISHES[DISH];
    const cutPic = async (id, hold = 3400) => { if (await T.preload(src(id))) { cue(['slide_up'], .5); await T.cutImage([{ src: src(id), hold }]); } };

    /* ================= 장면 차리기 ================= */
    let S = {};   // 지금 장면의 소품
    /* 1·10장 마당 */
    function yard(bg = 'hen_bg_yard') {
      T.clear(); bgImage(bg); S = {};
    }
    /* 부엌(5·6·7·9장): 창(유리 안쪽 x 605~940, y 16~236)으로 바깥 친구들이 보인다. 창살은 위에 다시 그린다 */
    const WIN = { x0: 605, x1: 940, y0: 16, y1: 236, mx: [760, 779], my: [94, 106] };
    function kitchen(bg = 'hen_bg_kitchen') {
      T.clear(); bgImage(bg); S = {};
      const id = 'rhWin' + Math.random().toString(36).slice(2, 7), cp = T.el('clipPath', { id }, T.world);
      T.el('rect', { x: WIN.x0, y: WIN.y0, width: WIN.x1 - WIN.x0, height: WIN.y1 - WIN.y0 }, cp);
      S.win = T.el('g', { 'clip-path': `url(#${id})`, 'pointer-events': 'none' }, T.world);
      S.bars = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, T.world);
      T.el('rect', { x: WIN.mx[0], y: WIN.y0, width: WIN.mx[1] - WIN.mx[0], height: WIN.y1 - WIN.y0, fill: '#6E4A2E' }, S.bars);
      T.el('rect', { x: WIN.x0, y: WIN.my[0], width: WIN.x1 - WIN.x0, height: WIN.my[1] - WIN.my[0], fill: '#6E4A2E' }, S.bars);
      S.mid = T.el('g', {}, T.world);   // 탁자·선반·오븐(인물 뒤)
    }
    const winPut = (a, x, look, to, s = .62) => put(T, a, x, WIN.y1 + 8, { look, to, s, parent: S.win });

    /* ================= 1. 누가 심어 줄래? ================= */
    async function s1() {
      const set = () => {
        yard(); setView(X(500, 500));
        fg('hen_fg_flower_bush', X(30, 230), 590, 150); fg('hen_fg_grass_tuft', X(985, 760), 585, 90);
        put(T, cat, X(330, 378), 308, { look: 'lie_fence', to: 'left' });
        put(T, dog, X(705, 625), X(394, 372), { look: 'lie', to: 'left' });
        put(T, pig, X(870, 620), X(530, 582), { look: 'mud', to: 'left' });
        put(T, hen, X(530, 490), X(482, 470), { look: 'hold_sack', to: 'left' });
        chicksAt(X([430, 382, 334], [350, 412, 474]), X(505, 550), { to: 'right' });
      };
      return set;
    }
    async function p1() {
      cue('animals/rooster', .5); bgm('open');
      await say('A1');
      chicksHop();
      await say('A2');
      hen.look('hold_sack', 'left');
      await say('A3');
      hen.look('stand', 'left'); cue('yawn', .4) || cue('slide_down', .4); cat.look('lie_fence', 'left');
      await say('A4'); cue('toot_kazoo', .35);
      hen.look('stand', 'right'); cue('animals/dog', .3);
      await say('A5'); cue('toot_kazoo', .35);
      cue('animals/pig', .3);
      await say('A6'); cue('toot_kazoo', .35);
      bgm(null);   // 배움(감정 고르기) 동안은 음악을 끈다
      /* 감정 고르기: 암탉 머리 위 얼굴 카드 둘(자리는 판마다 바뀜) */
      const ord = Math.random() < .5 ? ['sad', 'happy'] : ['happy', 'sad'];
      const cw = 84, ch = 112, cy = hen.y - hen.h - 72;
      cue('ding_glock_2', .45);
      const cards = ord.map((k, i) => {
        const cx = hen.x + (i ? 1 : -1) * X(64, 62), g = hitZone(T, T.fx, cx, cy, H(cw + 6), H(ch + 6));
        const pg = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, g); pic(T, pg, 'hen_prop_face_' + k, cx, cy, cw, ch);
        g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
        g.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 380, easing: 'ease-out' });
        return { el: g, ok: k === 'sad', k };
      });
      T.fx.style.pointerEvents = '';
      hen.look('stand', 'left');
      const opts = cards.map(c => ({ el: c.el, ok: c.ok, onWrong: async () => { cue('doop', .4); await wiggle(c.el); await say('A7w'); } }));
      await T.ask(line('A7'), () => T.choose(opts, { prompt: line('A7') }));
      T.fx.style.pointerEvents = 'none';
      cards.forEach(c => c.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }).finished.then(() => c.el.remove()));
      hen.look('sad', 'left'); cue('whistle_down', .35);
      await say('A8');
      hen.look('determined'); hen.hop(10, 300); cue('xylo_up', .5);
      await say('A9');
      chicksLook('hop'); chicksHop();
      await say('A10');
      chicksLook('stand', 'right');
      await sleep(500);
    }

    /* ================= 2. 씨를 심고 물을 줘요 ================= */
    const ROW = () => (P ? [340, 420, 500, 580, 660] : [360, 460, 560, 660, 760, 860]);
    const ROWY = 452;
    function s2() {
      return () => {
        T.clear(); bgImage('hen_bg_field'); S = {}; setView(X(500, 500));
        S.plants = T.el('g', {}, T.world);
        fg('hen_fg_grass_tuft', X(990, 715), 585, 90);
        S.sack = hitZone(T, T.world, X(330, 430), FL - 40, H(96), H(96));
        stand(T, S.sack, 'hen_prop_seed_sack', X(330, 430), FL + 4);
        put(T, hen, X(230, 368), FL + 8, { look: 'stand', to: 'right' });
        chicksAt([X(140, 330), X(100, 375), X(60, 420)], FL + 40, { to: 'right' });
        if (P) chicksAt([335, 378, 421], FL + 50, { to: 'right' });
      };
    }
    const sunPatch = () => {   // 배경에 그려진 해를 하늘색 종이로 덮고(같은 하늘 한 장), 움직이는 해 소품을 그 자리에 놓는다
      T.el('circle', { cx: 74, cy: 29, r: 48, fill: '#ACDAF3' }, T.bg);   // 배경 해(x 29~120, y -15~75)
    };
    async function p2() {
      hen.look('stand', 'right');
      await say('B1');
      const sb = bob(S.sack);
      await T.ask(line('B1a'), () => T.tap(S.sack, { prompt: line('B1a') }));
      sb.cancel(); cue('drum', .4) || cue('knock', .4);
      S.sack.style.display = 'none'; hen.look('hold_sack', 'right'); await sleep(500);
      /* 심기: 걸으며 씨를 뿌리고, 지나간 자리마다 싹 */
      hen.look('sow', 'right');
      const xs = ROW(), plants = [];
      const walk = hen.move(xs[xs.length - 1] + 40, hen.y, 3600, 'linear');
      const sayP = say('B2');
      for (const x of xs) {
        await sleep(3600 / xs.length);
        cue('dig_soil_1', .3) || cue('pop', .3);
        const g = T.el('g', {}, S.plants); plants.push({ x, g });
        stand(T, g, 'hen_prop_sprout', x, ROWY);
        g.animate([{ transform: 'scale(1,0)', transformOrigin: `${x}px ${ROWY}px` }, { transform: 'scale(1,1)', transformOrigin: `${x}px ${ROWY}px` }], 300);
      }
      await walk;
      /* 물 주기: 물뿌리개 자세로 돌아오며 쪼르르 */
      hen.look('water', 'left'); cue(['water_pour_1', 'water_drip'], .45);
      const back = hen.move(X(260, 368), hen.y, 3000, 'linear');
      await sayP;
      const wp = word('water', hen.x - X(70, 40), hen.y - 210);
      await back; await wp; await sleep(300);
      hen.look('stand', 'right');
      /* 해가 하늘을 건너가며(저녁 한 번) 싹 → 작은 밀 → 황금 밀 */
      sunPatch();
      const sun = T.el('g', { 'pointer-events': 'none' }, T.bg); stand(T, sun, 'hen_prop_sun', 0, 0, 96);
      const dusk = T.el('rect', { x: -60, y: -40, width: 1120, height: 650, fill: '#F4A261', opacity: 0, 'pointer-events': 'none' }, T.bg);
      const sayB3 = say('B3');
      cue(['shimmer', 'chime_up'], .35);
      sun.animate([{ transform: 'translate(74px,77px)' }, { transform: 'translate(500px,30px)', offset: .5 }, { transform: 'translate(1010px,160px)' }], { duration: 3600, easing: 'ease-in-out', fill: 'forwards' });
      dusk.animate([{ opacity: 0 }, { opacity: 0 }, { opacity: .38 }, { opacity: 0 }], { duration: 4200, fill: 'forwards' });
      const grow = async f => { cue('slide_up', .4); plants.forEach(p => { p.g.innerHTML = ''; stand(T, p.g, f, p.x, ROWY); p.g.animate([{ transform: 'scale(1,.6)', transformOrigin: `${p.x}px ${ROWY}px` }, { transform: 'scale(1,1)', transformOrigin: `${p.x}px ${ROWY}px` }], 420); }); };
      await sleep(1800); await grow('hen_prop_wheat_young');
      await sleep(1800); await grow('hen_prop_wheat_gold');
      sun.animate([{ transform: 'translate(-80px,120px)' }, { transform: 'translate(74px,77px)' }], { duration: 900, fill: 'forwards' });
      await sayB3;
      await cutPic('hen_cut_grow');
      hen.look('look_up', 'right'); chicksLook('look_up', 'right');
      chicksHop(); await say('B4');
      await say('B5');
      await sleep(400);
    }

    /* ================= 3. 누가 베어 줄래? ================= */
    const ROW3 = () => (P ? [510, 570] : [600, 700, 800, 900]);
    function s3() {
      return () => {
        T.clear(); bgImage('hen_bg_field_gold'); S = {}; setView(X(500, 410));
        S.plants = ROW3().map(x => ({ x, g: stand(T, T.world, 'hen_prop_wheat_gold', x, ROWY) }));
        /* 울타리 뒤 친구 셋(앉거나 서서 넘겨다봄): 오른쪽(암탉)을 본다. 배경에서 오린 울타리 나무를 앞에 다시 얹어 가로대 사이로 몸이 보이게 */
        [[pig, X(390, 425)], [dog, X(240, 300)], [cat, X(140, 240)]].forEach(([a, x]) => put(T, a, x, 293, { look: a === pig ? 'stand' : 'sit', to: 'right', s: .9 }));
        T.el('image', { href: src('hen_layer_fence_gold'), x: BGBOX.x + 212 * BGBOX.w / 1600, y: BGBOX.y + 365 * BGBOX.w / 1600, width: 498 * BGBOX.w / 1600, height: 113 * BGBOX.w / 1600, 'pointer-events': 'none' }, T.world);
        put(T, hen, X(520, 470), FL + 8, { look: 'stand', to: 'left' });
        chicksAt([X(440, 380), X(400, 335), X(360, 425)], FL + 40, { to: 'right' });
        fg('hen_fg_wheat_ears', X(975, 640), 590, 170);
      };
    }
    async function p3() {
      hen.look('stand', 'left');
      await say('C1');
      FRS.forEach(f => f.hop(6, 260));
      await say('C2'); cue('toot_kazoo', .4);
      FRS.forEach(f => f.turn('left'));
      hen.look('determined');
      await say('C3');
      /* 베기: 밀 포기마다 다가가 싹둑 → 누운 밀 → 밀단 */
      const sayC4 = say('C4');
      hen.look('cut', 'right');
      for (const p of S.plants) {
        await hen.move(p.x - X(70, 80), hen.y, 600, 'ease-in-out');
        cue(['chop', 'swish'], .45);
        p.g.remove(); p.g = stand(T, T.world, 'hen_prop_wheat_cut', p.x + 10, FL - 12);
        T.world.appendChild(hen.pos);
        await sleep(350);
      }
      await sayC4;
      S.plants.forEach(p => p.g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }));
      const bx = S.plants[0].x + X(40, 0);
      const bundle = stand(T, T.world, 'hen_prop_wheat_bundle', bx, FL - 4);
      bundle.animate([{ transform: 'translateY(-30px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], 400);
      T.world.appendChild(hen.pos); chicks.forEach(c => T.world.appendChild(c.pos));
      cue('rattle', .4);
      hen.look('happy'); chicksLook('hop'); chicksHop();
      await say('C5');
      setTimeout(() => chicksHop(), 400);
      await sleep(900);
      chicksLook('stand', 'right');
    }

    /* ================= 4. 방앗간 — 밀가루! ================= */
    /* 배경의 풍차 탑(x 150~252, 꼭대기 지붕 y 42, 밑 y 213)은 기획보다 작다 → 날개를 탑에 맞춰 줄인다(지름 190, 중심 = 지붕 위 축 215,88) */
    const MILL = { hx: 215, hy: 88, door: [214, 214] };
    function s4() {
      return () => {
        T.clear(); bgImage('hen_bg_mill'); S = {}; setView(X(500, 400));
        const sh = HT.hen_prop_mill_sails, sw = sh * ASP.hen_prop_mill_sails;
        S.sails = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, T.bg);
        sprite(T, S.sails, 'hen_prop_mill_sails', MILL.hx - sw / 2, MILL.hy - sh / 2, sw, sh);
        S.sails.style.transformBox = 'view-box'; S.sails.style.transformOrigin = `${MILL.hx}px ${MILL.hy}px`;
        S.spin = S.sails.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 9000, iterations: Infinity });
        put(T, cat, X(250, 280), 548, { look: 'lie_fence', to: 'left' });
        put(T, dog, X(430, 375), 552, { look: 'lie', to: 'left' });
        put(T, pig, X(610, 465), 560, { look: 'mud', to: 'left' });
        put(T, hen, X(870, 495), X(472, 440), { look: 'carry', to: 'left' });
        chicksAt([X(950, 600), X(985, 630), X(1015, 660)], X(480, 448), { to: 'left' });
        if (P) chicks.forEach(hide);
        fg('hen_fg_grass_tuft', X(1000, 600), 600, 80);
      };
    }
    async function p4() {
      hen.look('carry', 'left');
      await say('D1');
      FRS.forEach(f => f.hop(6, 260));
      await say('C2'); cue('toot_kazoo', .4);
      await say('D2');
      /* 길을 따라 풍차로(멀어질수록 작게 — 원근에 따른 크기만) */
      const steps = setInterval(() => cue('step_grass', .25), 420);
      const path = X([[760, 400, .85], [560, 335, .68], [380, 280, .55], [255, 222, .42]], [[510, 345, .8], [350, 290, .62], [255, 222, .42]]);
      for (const [x, y, s] of path) { const sc = hen.scale; const a = hen.pos.animate([{ transform: tfm(hen.x, hen.y, hen.flip, sc) }, { transform: tfm(x, y, hen.flip, s) }], { duration: 1100, easing: 'linear' }); await a.finished; hen.setScale(s); hen.place(x, y); }
      clearInterval(steps);
      /* 방앗간: 날개가 빨라지고 덜컹덜컹 */
      S.spin.updatePlaybackRate(4); cue('drum', .4);
      const thud = setInterval(() => cue(['knock', 'drum'], .3), 600);
      hen.look('stand', 'right');
      const bin = T.el('g', { 'pointer-events': 'none' }, T.world);
      stand(T, bin, 'hen_prop_flour_bin_empty', MILL.door[0] + 46, MILL.door[1] + 6, 46);
      await say('D3');
      clearInterval(thud); cue('rattle', .5);
      await cutPic('hen_cut_mill');
      bin.innerHTML = ''; stand(T, bin, 'hen_prop_flour_bin', MILL.door[0] + 46, MILL.door[1] + 6, 50);
      S.spin.updatePlaybackRate(1);
      await word('flour', MILL.door[0] + 46, MILL.door[1] - 80);
      hen.look('happy'); cue('harp_gliss', .45);
      await say('D4');
      await sleep(400);
    }

    /* ================= 5·6·7·9장 부엌 ================= */
    const KS = X(1.12, 1);                    // 부엌은 가까이(인물·소품 같은 비율로 크게)
    const KP = KS * G;                        // 부엌 소품 높이 배율
    const FK = X(500, 520);                   // 부엌 바닥
    /* 탁자: 판 윗면 y(그림 높이의 17% 아래) */
    function table(cx, w, by = FK) { const h = w / ASP.hen_prop_table_kitchen; stand(T, S.mid, 'hen_prop_table_kitchen', cx, by, h); return by - h * .83; }
    function oven(cx, by = FK, open = false, s = KS) { if (S.oven) S.oven.remove(); S.oven = stand(T, S.mid, open ? 'hen_prop_oven_open' : 'hen_prop_oven_closed', cx, by, HT.hen_prop_oven_closed * s); S.ovenAt = [cx, by, s]; return S.oven; }
    const ovenWin = () => { const [cx, by, s] = S.ovenAt, h = HT.hen_prop_oven_closed * s; return [cx, by - h * .6]; };
    /* 암탉은 탁자 뒤에 선다(발이 탁자에 가려, 반죽하는 손이 탁자 윗면에 온다) */
    const behind = top => top + 12 * KS;   // 발끝이 탁자 윗판 뒤에 숨는 높이(판 아래는 다리 사이가 비어 있다)
    const BOWLX = () => X(500, 530);

    function s5() {
      return () => {
        kitchen('hen_bg_kitchen'); setView(X(500, 560));
        if (!P) {
          stand(T, S.mid, 'hen_prop_shelf', 255, 212 + 119, 119);   // 벽 선반(판 윗면 y 212, 세 칸이 판 위에)
          S.top = table(600, 380);
          oven(880);
        } else {
          S.top = table(620, 300);
        }
        S.bowl = stand(T, S.mid, 'hen_prop_bowl_flour', BOWLX(), S.top + 6, 70 * KP); S.bowl.style.display = 'none';
        S.bowl0 = T.el('g', {}, S.mid); stand(T, S.bowl0, 'hen_prop_bowl_flour', BOWLX(), S.top + 6, 70 * KP);
        S.bowl0.querySelector('image').style.clipPath = 'inset(28% 0 0 0)';   // 빈 그릇: 밀가루 더미 윗부분을 잘라 낸다
        put(T, hen, X(655, 655), behind(S.top), { look: 'stand', to: 'left', s: KS });
        T.world.appendChild(S.mid);   // 탁자가 암탉 앞
        chicksAt(X([720, 757, 794], [700, 740, 590]), S.top + 4, { to: 'left', s: KS });
        if (!P) fg('hen_fg_pot_plant', -10, 590, 130);
        /* 선반 칸(누르는 대상): 가로 = 선반 판 위 세 칸, 세로 = 왼쪽 세로 한 줄 */
        S.cellsG = T.el('g', {}, T.world);
        const pos = P ? [[405, 115], [405, 225], [405, 335]] : [[120, 164], [255, 164], [390, 164]];
        const ids = ['flour', 'water', 'butter'];
        S.cells = ids.map((id, i) => cell(S.cellsG, id, pos[i][0], pos[i][1], 104, 100));
      };
    }
    async function p5() {
      hen.look('stand', 'right');
      /* 창밖으로 친구 셋이 지나가며 거절(부엌 안을 한 번 본다) */
      [[pig, 470], [dog, 360], [cat, 260]].forEach(([a, x]) => winPut(a, x + 150, 'run', 'right', .68));
      const pass = Promise.all(FRS.map((a, i) => a.move(a.x + X(420, 420), a.y, 5200, 'linear')));
      await say('E1');
      FRS.forEach(f => f.turn('left'));
      await say('C2'); cue('toot_kazoo', .4);
      FRS.forEach(f => f.turn('right'));
      await say('E2');
      chicksLook('hop'); chicksHop();
      await say('E3');
      await pass; FRS.forEach(hide);
      chicksLook('stand', 'left');
      /* 찾기 1·2: 밀가루 → 물 (찾은 칸은 비운다) */
      hen.look('ask', 'left');
      const into = async (c, after) => { c.el.style.visibility = 'hidden'; await fly(ING(c.id), c.cx, c.cy, BOWLX(), S.top - 20, 74); after(); };
      let c = await find(S.cells, 'flour');
      await into(c, () => { cue('rattle', .5); S.bowl0.style.display = 'none'; S.bowl.style.display = ''; });
      await word('flour', BOWLX(), S.top - 120);
      c = await find(S.cells.filter(x => x.id !== 'flour'), 'water');
      await into(c, () => { cue(['water_pour_1', 'water_drip'], .5); });
      await word('water', BOWLX(), S.top - 120);
      /* 반죽(저절로): 그릇을 치우고 반죽하는 자세(그림 속 반죽이 탁자 위에 온다) */
      S.cells.forEach(x => { x.el.style.pointerEvents = 'none'; });
      hen.move(BOWLX() + X(40, 40), hen.y, 500); S.bowl.style.display = 'none';
      hen.look('knead', 'left'); hen.place(hen.x, S.top + 6 + hen.h * hen.scale * .08);   // 그림 속 반죽이 탁자 윗면에 오게
      const kn = setInterval(() => { hen.body.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.03,.97)' }, { transform: 'scale(1,1)' }], 400); cue('marimba_1', .3); }, 520);
      await say('E6');
      clearInterval(kn);
      /* 버터(이름만): 버터 칸이 사라지고 암탉 손에 */
      const bc = S.cells.find(x => x.id === 'butter'); bc.el.style.visibility = 'hidden';
      const tin = stand(T, S.mid, 'hen_prop_tin', BOWLX() - 70, S.top + 8, 40 * KP);
      hen.look('butter', 'left'); cue('swish', .4);
      await say('E7');
      await word('butter', hen.x - 60, S.top - 150);
      hen.look('stand', 'right');
      await say('E8');
      if (S.oven) { const [ox, oy] = ovenWin(); tin.remove(); await fly('hen_prop_tin', BOWLX() - 70, S.top - 10, ox, oy, 60); cue('door', .5) || cue('knock', .5); cue('fire_crackle', .4); }
      else { tin.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }); cue('door', .5); }
      await sleep(500);
    }

    /* ================= 6. 빵이 구워져요 (늦은 오후, 오븐 빛) ================= */
    function s6() {
      return () => {
        kitchen('hen_bg_kitchen_lb'); setView(X(500, 630));
        oven(X(870, 740), FK, false, X(KS, .92));
        if (!P) stand(T, S.mid, 'hen_prop_shelf', 255, 212 + 119, 119);
        put(T, hen, X(630, 530), FK + 4, { look: 'sit_wait', to: 'right', s: KS });
        chicksAt(X([540, 495, 450], [460, 500, 545]), FK + X(30, 40), { look: 'look_up', to: 'right', s: KS });
        if (!P) fg('hen_fg_pot_plant', -10, 590, 130);
      };
    }
    async function p6() {
      const [ox, oy] = ovenWin();
      const gl = glow(T, S.mid, ox, oy, 150, '#F2B366', .9); S.mid.insertBefore(gl, S.mid.firstChild);
      gl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1200, fill: 'forwards' });
      const gl2 = glow(T, T.fx, ox, oy, 60, '#FBF3D5', .75); gl2.animate([{ opacity: .6 }, { opacity: 1 }, { opacity: .6 }], { duration: 1600, iterations: Infinity });
      cue('fire_crackle', .3); cue('shimmer', .35);
      await say('F1');
      peep(); chicks.forEach(c => c.hop(8, 260));
      await say('F2');
      await say('F3');
      await sleep(700);
      cue('bell', .6) || cue('ding', .6);
      oven(...S.ovenAt.slice(0, 2), true, S.ovenAt[2]); T.world.appendChild(hen.pos); chicks.forEach(c => T.world.appendChild(c.pos));
      await cutPic('hen_cut_oven');
      gl2.remove();
      hen.look('bread'); hen.move(hen.x - X(30, 0), FK + 4, 400); cue('harp_gliss', .5); cue('chime_up', .4);
      chicksLook('hop', 'right'); chicksHop();
      await say('F4');
      await word('bread', hen.x, hen.y - 230);
      /* 냄새 선이 창으로, 창밖 친구들이 코를 킁킁 */
      const sm = T.el('g', { 'pointer-events': 'none' }, T.fx);
      [0, 1, 2].forEach(i => { const g = T.el('g', {}, sm); stand(T, g, 'hen_prop_smell', 0, 0, 100); g.animate([{ transform: `translate(${hen.x - 20 + i * 30}px,${hen.y - 170}px)`, opacity: 0 }, { opacity: .95, offset: .3 }, { transform: `translate(${720 + i * 50}px,${120}px)`, opacity: 0 }], { duration: 2600, delay: i * 500, iterations: 2 }); });
      cue('harp_gliss_2', .35);
      winPut(cat, X(670, 650), 'sniff', 'left', X(.78, .66)); winPut(dog, X(790, 715), 'sniff', 'left', X(.72, .6)); winPut(pig, X(895, 772), 'sniff', 'left', X(.6, .48));
      FRS.forEach(f => { f.pos.animate([{ opacity: 0 }, { opacity: 1 }], 600); });
      const sn = setInterval(() => { FRS.forEach((f, i) => setTimeout(() => f.hop(6, 240), i * 120)); cue('toot_kazoo', .2); }, 900);
      await say('F5');
      clearInterval(sn); sm.remove();
      await sleep(300);
    }

    /* ================= 7. 누가 먹어 줄래? ================= */
    function s7() {
      return () => {
        kitchen('hen_bg_kitchen_lb'); setView(X(500, 630));
        oven(X(1010, 1010), FK, false, KS);
        S.top = table(X(580, 640), X(420, 330));
        S.food = T.el('g', {}, S.mid);
        stand(T, S.food, 'hen_prop_plate', X(580, 640), S.top + 8, 30 * KP);
        S.bread = stand(T, S.food, 'hen_prop_bread', X(580, 640), S.top - 2, 64 * KP);
        put(T, hen, X(290, 505), FK + 6, { look: 'speak_calm', to: 'right', s: KS });
        chicksAt(X([470, 690, 735], [550, 720, 765]), S.top + 6, { look: 'stand', to: 'right', s: KS });
        chicks[1].turn('left'); chicks[2].turn('left');
        T.world.appendChild(S.mid); chicks.forEach(c => T.world.appendChild(c.pos)); T.world.appendChild(hen.pos);
        if (!P) fg('hen_fg_pot_plant', -10, 590, 130);
        winPut(cat, X(675, 655), 'raise', 'left', X(.85, .7)); winPut(dog, X(800, 722), 'raise', 'left', X(.78, .64)); winPut(pig, X(900, 765), 'raise', 'left', X(.64, .5));
      };
    }
    async function p7() {
      hen.look('speak_calm', 'right');
      await say('G1');
      cat.hop(10, 260); cue('pop', .4); await say('G2');
      dog.hop(10, 260); cue('pop', .45); await say('G3');
      pig.hop(10, 260); cue('pop', .5); await say('G4');
      await say('G5');
      await say('G6');
      /* 먹기: 빵 조각을 들고 냠냠(조각은 코드로 붙임) */
      S.bread.remove(); S.bread = stand(T, S.food, 'hen_prop_bread', X(580, 640), S.top - 2, 48 * KP);
      hen.look('eat', 'right'); hen.hold('hen_prop_bread', 40);
      chicksLook('eat'); chicks[0].turn('right'); chicks[1].turn('left'); chicks[2].turn('left');
      const nom = setInterval(() => cue(['chomp', 'marimba_2'], .3), 700);
      await say('G7');
      clearInterval(nom);
      await cutPic('hen_cut_eat');
      /* 친구들은 머쓱하게 고개를 숙인다(앉은 자세로 조금 내려앉음) */
      [[cat, 'sit'], [dog, 'sit'], [pig, 'stand']].forEach(([a, k]) => { a.look(k, 'left'); a.place(a.x, a.y + 14); });
      cue('whistle_down', .3);
      await say('G8');
      hen.hold(null);
      await sleep(700);
    }

    /* ================= 8. 다음 날 아침 — 우리도 할게! ================= */
    function s8() {
      return () => {
        yard('hen_bg_yard_morning'); setView(X(500, 480));
        if (!P) fg('hen_fg_flower_bush', -30, 590, 150);
        put(T, hen, X(250, 385), FL, { look: 'bread' });
        chicksAt(X([170, 130, 90], [300, 335, 420]), FL + 20, { to: 'right' });
        if (P) chicksAt([310, 345, 420], FL + 50, { to: 'right' });
        FRS.forEach(hide);
      };
    }
    async function p8() {
      cue('animals/rooster', .45); cue('birds_chirp_1', .3);
      bgm('morning');
      await say('H1');
      await say('H2');
      bgm(null);
      /* 셋이 재료를 들고 달려온다(재료 그림은 앞발에 코드로 붙임) */
      const stops = X([500, 655, 825], [450, 520, 575]);
      const runners = [[dog, D.bring[0]], [cat, D.bring[1]], [pig, D.bring[2]]];
      runners.forEach(([a, ing], i) => { put(T, a, X(1100, 800) + i * 120, FL, { look: 'run', to: 'left', s: P ? .85 : 1 }); a.hold(ING(ing), P ? 50 : 54); });
      const steps = setInterval(() => cue('step_grass', .3), 260);
      await Promise.all(runners.map(([a], i) => sleep(i * 300).then(() => a.move(stops[i], FL, 1700, 'ease-out'))));
      clearInterval(steps);
      const bringLine = { 0: 'H3_' + D.bring[0], 1: 'H4_' + D.bring[1], 2: 'H5_' + D.bring[2] };
      hen.look('stand', 'right');
      for (let i = 0; i < 3; i++) {
        const [a, ing] = runners[i];
        a.hop(10, 280);
        await say(bringLine[i]);
        const [ix, iy] = a.holdAt();
        await word(ing, ix, iy - 70);
      }
      hen.look('happy'); cue('xylo_up', .5); chicksHop();
      await say('H6_' + DISH);
      /* 재료는 내려놓고 앉아서 본다 */
      runners.forEach(([a]) => a.hold(null));
      dog.look('sit', 'left'); cat.look('sit', 'left'); pig.look('stand', 'left');
      await say('H7');
      hen.look('point', 'right');
      await say('H8');
      /* 순서 카드: 빈 칸 넷(위) + 섞인 카드 넷(아래) */
      const order = ['hen_prop_card_seed', 'hen_prop_card_wheat', 'hen_prop_card_flour', D.card];
      let mix; do { mix = [0, 1, 2, 3].sort(() => Math.random() - .5); } while (mix.every((v, i) => v === i));
      const CW = 84, CH = 112;
      const slotXY = i => X([290 + i * 112, 205], [356 + i * 96, 150]);
      const cardXY = j => X([290 + j * 112, 405], [[450, 570][j % 2], [300, 425][j >> 1]]);
      if (!P) { cast([[dog, 750, FL, { look: 'sit', to: 'left' }], [pig, 950, FL + 14, { look: 'mud', to: 'left' }], [cat, 850, FL + 4, { look: 'sit', to: 'left' }]]); put(T, hen, 175, FL, { look: 'point', to: 'right' }); chicksAt([235, 120, 75], FL + 30, { to: 'right' }); }
      else { FRS.forEach(hide); put(T, hen, 345, FL + 40, { look: 'point', to: 'right', s: .9 }); chicksAt([400, 315, null], FL + 60, { to: 'right' }); }
      const slots = T.el('g', { 'pointer-events': 'none' }, T.fx);
      [0, 1, 2, 3].forEach(i => { const [x, y] = slotXY(i); pic(T, T.el('g', { filter: 'url(#pp)' }, slots), 'hen_prop_card_slot', x, y, CW + 4, CH + 4); });
      cue('paper_turn', .5);
      const cards = mix.map((k, j) => {
        const [x, y] = cardXY(j), g = hitZone(T, T.fx, x, y, H(CW + 6), H(CH + 6));
        const pg = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, g); pic(T, pg, order[k], x, y, CW, CH);
        g.animate([{ transform: 'translateY(-30px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 400, delay: j * 90, fill: 'backwards' });
        return { el: g, k, x, y };
      });
      T.fx.style.pointerEvents = '';
      const slide = async (c, i) => {
        const [x, y] = slotXY(i);
        c.el.style.pointerEvents = 'none';
        await c.el.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${x - c.x}px,${y - c.y}px)` }], { duration: 500, easing: 'ease-in-out', fill: 'forwards' }).finished;
        cue('paper_down', .4) || cue('ding_glock', .4);
      };
      const PROMPT = ['H9', 'H10', 'H11'], HINT = ['H9h', 'H10h', 'H11h'];
      for (let i = 0; i < 3; i++) {
        const left = cards.filter(c => c.k >= i);
        const opts = left.map(c => ({ el: c.el, ok: c.k === i, c, onWrong: async () => { cue('doop', .4); await wiggle(c.el); await say(HINT[i]); } }));
        const r = await T.ask(line(PROMPT[i]), () => T.choose(opts, { prompt: line(PROMPT[i]) }));
        cue('ding', .5);
        await slide(r.c, i);
      }
      T.fx.style.pointerEvents = 'none';
      await sleep(300); await slide(cards.find(c => c.k === 3), 3);
      /* 왼쪽부터 가리키며 */
      const sayH = say('H12_' + DISH);
      for (let i = 0; i < 4; i++) { const c = cards.find(x => x.k === i); c.el.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], 420); cue('marimba_' + (i + 1), .4); await sleep(560); }
      await sayH;
      chicksHop(); FRS.forEach(f => f.hop(10, 300));
      await sleep(700);
    }

    /* ================= 9. 다 같이 (샌드위치 · 피자 · 팬케이크) ================= */
    const standWH = (parent, f, cx, by, w, h) => { const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, parent); sprite(T, g, f, cx - w / 2, by - h, w, h); return g; };
    const SLH = 74;                           // 샌드위치 빵 조각 높이(폭 ≈ 158)
    const PZH = 120, PKH = 110;               // 피자 반죽·팬케이크 높이
    const PLATE = () => X([700, S.top], [555, S.top]);
    function s9() {
      return () => {
        kitchen('hen_bg_kitchen'); setView(X(500, 500));
        if (!P) { table(250, 400); S.top = table(650, 400); }
        else S.top = table(520, 360);
        const [px] = PLATE();
        S.dish = T.el('g', {}, S.mid);
        S.base = T.el('g', {}, S.dish);
        put(T, hen, X(830, 612), behind(S.top), { look: 'stand', to: 'left', s: KS });
        if (!P) {
          put(T, cat, 75, FK, { look: 'stand_help', to: 'right', s: KS });
          put(T, dog, 575, behind(S.top) - 6, { look: 'stand_help', to: 'right', s: KS });
          put(T, pig, 968, behind(S.top) + 10, { look: 'stand_help', to: 'left', s: KS });
        } else { FRS.forEach(hide); }
        T.world.appendChild(S.mid);
        chicksAt(X([560, 600, 790], [400, 440, 480]), S.top + 6, { to: 'right', s: KS }); chicks[2].turn('left');
        if (!P) T.world.appendChild(cat.pos);
        /* 재료 칸: 가로 = 왼쪽 탁자 위 네 칸, 세로 = 위쪽 2×2 */
        S.cellsG = T.el('g', {}, T.world);
        const pos = P ? [[400, 120], [515, 120], [400, 235], [515, 235]] : [[115, S.top - 50], [235, S.top - 50], [355, S.top - 50], [475, S.top - 50]];
        S.cells = D.cells.map((id, i) => cell(S.cellsG, id, pos[i][0], pos[i][1], 104, 100));
        if (DISH !== 'pancake') stand(T, S.base, 'hen_prop_plate', px, S.top + 10, 30 * KP);
        if (DISH === 'sandwich') stand(T, S.base, 'hen_prop_bread_slice', px, S.top - 2, SLH);
        if (DISH === 'pizza') stand(T, S.base, 'hen_prop_pizza_dough', px, S.top - 2, PZH);
        if (DISH === 'pancake') { S.bowlD = stand(T, S.base, 'hen_prop_bowl_dough', px, S.top + 6, 70 * KP); }
      };
    }
    async function p9() {
      const [px] = PLATE();
      let stackY = S.top - 2 - SLH * .5;   // 샌드위치 빵 윗면(가운데)
      const LAYW = 160;
      const addLayer = (id) => {
        const f = LAYER[DISH][id]; if (!f) return;
        if (DISH === 'sandwich') { const h = LAYW / ASP[f] * .55; standWH(S.dish, f, px, stackY + h * .5, LAYW, h); stackY -= h * .42; }   // 얹힌 층은 옆에서 본 것처럼 납작하게
        else if (DISH === 'pizza') { const g = stand(T, S.dish, f, px, S.top - 2, PZH); g.dataset.layer = id; }
        else if (DISH === 'pancake') {
          if (id === 'honey') { S.base.innerHTML = ''; stand(T, S.base, 'hen_prop_pancake_layer_honey', px, S.top + 8, PKH * ASP.hen_prop_pancake_stack / ASP.hen_prop_pancake_layer_honey); }   // 꿀이 흐르는 팬케이크(과일 층은 그 위에 그대로)
          else { const w = 120, h = w / ASP[f], g = stand(T, S.dish, f, px + (id === 'banana' ? 14 : -14), S.panTop + h * (id === 'banana' ? .75 : .35), h); g.dataset.layer = id; }
        }
      };
      /* 팬케이크: 먼저 반죽(밀가루·우유·달걀) → 팬에 지글 → 두 장 쌓임 */
      if (DISH === 'pancake') {
        hen.look('knead', 'left');
        await say('I0_pancake');
        hen.look('place', 'left'); cue('pop', .4);
        await say('I_egg');
        await word('egg', px, S.top - 130);
        hen.look('knead', 'left'); const kn = setInterval(() => cue('marimba_1', .3), 500); await sleep(1200); clearInterval(kn);
        S.base.innerHTML = ''; stand(T, S.base, 'hen_prop_fry_pan', px, S.top + 4, 52);
        cue('steam_hiss', .4) || cue('fire_crackle', .4);
        await say('I0b_pancake');
        S.base.innerHTML = ''; stand(T, S.base, 'hen_prop_pancake_stack', px, S.top + 8, PKH); S.panTop = S.top + 8 - PKH * .72;
        cue('pop_appear', .5) || cue('pop', .5);
      }
      if (DISH === 'pizza') { hen.look('knead', 'left'); await say('I0_pizza'); }
      hen.look('ask', 'left');
      await say('I1_' + DISH);
      FRS.forEach(f => f.look('stand_help'));
      const wrongSay = DISH === 'pizza' ? { strawberry: 'I_nostraw' } : DISH === 'pancake' ? { tomato: 'I_notomato' } : null;
      let left = S.cells.slice();
      for (const id of D.ask) {
        hen.look('ask', 'left');
        const c = await find(left, id, wrongSay);
        left = left.filter(x => x !== c);
        c.el.style.visibility = 'hidden';
        chicks.forEach((k, i) => setTimeout(() => k.hop(8, 240), i * 80));
        await fly(ING(id), c.cx, c.cy, px, S.top - 30, 70);
        hen.look('place', 'left');
        cue('pop', .4 + D.ask.indexOf(id) * .1); addLayer(id);
        if (DISH === 'pancake' && id === 'honey') { cue('slide_down', .4); await say('I_honeydrip'); }
        await word(id, px, S.top - 150);
      }
      /* 남은 칸 */
      const rest = left[0];
      if (DISH === 'sandwich') {
        rest.el.style.visibility = 'hidden'; hen.look('happy');
        await say('I_egg');
        hen.look('place', 'left'); await fly(ING('egg'), rest.cx, rest.cy, px, S.top - 30, 70); cue('pop', .7); addLayer('egg');
        await word('egg', px, S.top - 150);
        await say('I_top');
        await fly('hen_prop_bread_slice', hen.x - 40, hen.y - 120, px, stackY, 110);
        stand(T, S.dish, 'hen_prop_bread_slice', px, stackY + SLH * .55, SLH); cue('pop', .8);
        await word('bread', px, S.top - 170);
      } else {
        const who = DISH === 'pizza' ? cat : dog;
        if (!P) { who.hop(12, 300); }
        rest.el.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(30px)' }], { duration: 500, fill: 'forwards' });
        cue('giggle_xylo', .4) || cue('pop', .4);
        await say(DISH === 'pizza' ? 'I_nostraw' : 'I_notomato');
      }
      if (DISH === 'pizza') {   // 오븐에 넣고 띵
        hen.look('stand', 'right');
        await say('E8');
        S.dish.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
        cue('door', .4); await sleep(1300); cue('bell', .6) || cue('ding', .6);
        S.dish.getAnimations().forEach(a => a.cancel());
        [...S.dish.children].forEach(n => { if (n !== S.base) n.remove(); });
        S.base.innerHTML = ''; stand(T, S.base, 'hen_prop_plate', px, S.top + 10, 30 * KP); stand(T, S.base, 'hen_prop_pizza_whole', px, S.top - 2, PZH);
      }
      hen.look('happy'); chicksLook('hop'); chicksHop(); FRS.forEach(f => f.hop(12, 300));
      cue('cymbal', .3); cue('chime_up', .5);
      await say('I_done_' + DISH);
      await cutPic(D.cut);
      await word(DISH, px, S.top - 170);
      chicksLook('stand', 'right');
      await sleep(300);
    }

    /* ================= 10. 다 같이 냠냠 ================= */
    function s10() {
      return () => {
        yard(); setView(X(500, 540));
        const tw = X(520, 400), tx = X(730, 590), th = tw / ASP.hen_prop_table_long;
        S.tableTop = FL + 6 - th * .92;
        put(T, cat, X(585, 470), S.tableTop + 34, { look: 'eat', to: 'left' }); cat.hold(D.piece, 48);
        put(T, dog, X(735, 565), S.tableTop + 40, { look: 'eat', to: 'left' }); dog.hold(D.piece, 48);
        put(T, pig, X(885, 655), S.tableTop + 52, { look: 'eat', to: 'left' }); pig.hold(D.piece, 48);
        S.tab = stand(T, T.world, 'hen_prop_table_long', tx, FL + 6, th);
        S.onTab = T.el('g', {}, T.world);
        X([600, 740, 880], [470, 565, 655]).forEach(x => { stand(T, S.onTab, 'hen_prop_plate', x, S.tableTop + 14, 24); stand(T, S.onTab, 'hen_prop_cup', x + 38, S.tableTop + 10, 34); });
        put(T, hen, X(380, 432), FL + 8, { look: 'stand', to: 'right' });
        chicksAt(X([300, 255, 210], [260, 215, 300]), FL + 36, { look: 'stand', to: 'right' });
        if (P) chicksAt([380, 415, 455], FL + 62, { look: 'stand', to: 'right' });
        if (!P) fg('hen_fg_flower_bush', 0, 590, 150);
      };
    }
    async function p10() {
      await say('J1');
      /* 우유: 따르는 자세(우유병 그림 포함) + 컵 */
      hen.look('pour', 'right'); cue(['water_pour_1', 'water_drip'], .4);
      const cupX = hen.x + hen.w * .45, cup = stand(T, T.world, 'hen_prop_cup', cupX, FL + 10, 30);
      await say('J2');
      await word('milk', hen.x + 20, hen.y - 230);
      cup.remove();
      hen.look('stand', 'right');
      const nom = (a, k) => { a.hop(8, 260); cue(['chomp', 'chomp_2'], .35); return say(k); };
      await nom(cat, 'J3'); await nom(dog, 'J4'); await nom(pig, 'J5');
      await say('J6');
      bgm('feast');   // 교훈 줄 뒤 ~ 인사 톡
      /* 인사 톡: 암탉(투명 상자) */
      const hz = hitZone(T, T.world, hen.x, hen.y - 85, H(140), H(190)); hz.style.pointerEvents = 'all';
      const hb = bob(hz);
      T.world.appendChild(hz);
      await T.ask(line('J7'), () => T.tap(hz, { prompt: line('J7') }));
      hb.cancel(); hz.remove();
      hen.look('wave'); cue('animals/rooster', .5);
      T.confetti(); finaleMusic();
      ALL.forEach((a, i) => { if (shown(a)) setTimeout(() => a.hop(20, 380), i * 70); });
      await say('J8');
      await sleep(1500);
      await finaleWait();
    }

    /* ================= 차례대로 ================= */
    const SC = [[1, '누가 심어 줄래?', 'hen_bg_yard', s1, p1], [2, '씨를 심고 물을 줘요', 'hen_bg_field', s2, p2], [3, '누가 베어 줄래?', 'hen_bg_field_gold', s3, p3],
      [4, '방앗간 — 밀가루!', 'hen_bg_mill', s4, p4], [5, '누가 빵을 만들어 줄래?', 'hen_bg_kitchen', s5, p5], [6, '빵이 구워져요', 'hen_bg_kitchen_lb', s6, p6],
      [7, '누가 먹어 줄래?', 'hen_bg_kitchen_lb', s7, p7], [8, '다음 날 아침 — 우리도 할게!', 'hen_bg_yard_morning', s8, p8],
      [9, { sandwich: '다 같이 샌드위치', pizza: '다 같이 피자', pancake: '다 같이 팬케이크' }[DISH], 'hen_bg_kitchen', s9, p9], [10, '다 같이 냠냠', 'hen_bg_yard', s10, p10]];
    /* ================= 읽어 주기 (docs/READ_MODE.md · read_script_el.json) =================
       조작(톡·찾기·카드 고르기)은 모두 빼고 같은 그림 위에서 이야기만 읽는다. 장면 차리기는 놀이판의 s1~s10 을 그대로 부르고,
       찾기·카드는 저절로 이뤄지게 한다. 두 번째 요리는 판마다 무작위(window.__READ.chosen[0], ?mix=pizza 로 고정).
       배경에서 도는 일(씨 심기·밀 베기·냄새 선 등)은 verb 가 Promise 를 돌려주지 않고 시작만 한다. 장면이 바뀌면 tok 를 올려 멈춘다 */
    if (T.reading()) {
      const inst = () => T.readInstant();
      let tok = 0, rs = { iv: [] };
      const every = (fn, ms) => { const i = setInterval(fn, ms); rs.iv.push(i); return i; };
      const stopAll = () => { rs.iv.forEach(clearInterval); rs = { iv: [] }; };
      const actor = a => (cmd, k, d) => {
        if (cmd === 'look') a.look(k, d || a.want);
        else if (cmd === 'turn') a.turn(k);
        else if (cmd === 'hop') { if (!inst()) a.hop(10, 300); }
        return null;
      };
      const R = {
        set(n) {
          tok++; stopAll();
          const ch = window.__READ && window.__READ.chosen && window.__READ.chosen[0];
          if (ch && DISHES[ch]) { DISH = ch; D = DISHES[ch]; }
          ALL.forEach(a => { try { a.hold(null); a.pos.getAnimations().forEach(x => x.cancel()); } catch (e) { /* */ } });
          if (+n === 1) return SC[0][3]().then(f => f());   // 1장 차리기만 async
          SC[+n - 1][3]()();
          return null;
        },
        hen: actor(hen), cat: actor(cat), dog: actor(dog), pig: actor(pig),
        chicks(cmd, k, d) { if (cmd === 'look') chicksLook(k, d); else if (cmd === 'hop' && !inst()) chicksHop(); return null; },
        friends(cmd, k) { if (cmd === 'hop') { if (!inst()) FRS.forEach(f => f.hop(6, 260)); } else if (cmd === 'turn') FRS.forEach(f => f.turn(k)); return null; },
        cue(n, v) { if (!inst()) cue(n.replace('~', '/'), +v || .4); return null; },
        bgm(k) { bgm(k === 'off' ? null : k); return null; },
        word(k) { if (inst()) return null; return word(k, hen.x, hen.y - 230); },
        cut(id) { if (inst()) return null; return cutPic(id); },
        /* 2장 */
        field(cmd) {
          if (inst()) return null;
          const t = tok;
          if (cmd === 'sack') { if (S.sack) S.sack.style.display = 'none'; hen.look('hold_sack', 'right'); cue('drum', .4) || cue('knock', .4); }
          else if (cmd === 'sow') {
            hen.look('sow', 'right');
            const xs = ROW(); rs.plants = [];
            const walk = hen.move(xs[xs.length - 1] + 40, hen.y, 3600, 'linear');
            rs.sowP = (async () => {
              for (const x of xs) {
                await sleep(3600 / xs.length); if (t !== tok) return;
                cue('dig_soil_1', .3) || cue('pop', .3);
                const g = T.el('g', {}, S.plants); rs.plants.push({ x, g });
                stand(T, g, 'hen_prop_sprout', x, ROWY);
                g.animate([{ transform: 'scale(1,0)', transformOrigin: `${x}px ${ROWY}px` }, { transform: 'scale(1,1)', transformOrigin: `${x}px ${ROWY}px` }], 300);
              }
              await walk;
            })();
          } else if (cmd === 'water') {
            return (async () => {
              await rs.sowP; if (t !== tok) return;
              hen.look('water', 'left'); cue(['water_pour_1', 'water_drip'], .45);
              await hen.move(X(260, 368), hen.y, 2400, 'linear'); if (t !== tok) return;
              await word('water', hen.x - X(70, 40), hen.y - 210);
              hen.look('stand', 'right');
            })();
          } else if (cmd === 'grow') {
            sunPatch();
            const sun = T.el('g', { 'pointer-events': 'none' }, T.bg); stand(T, sun, 'hen_prop_sun', 0, 0, 96);
            const dusk = T.el('rect', { x: -60, y: -40, width: 1120, height: 650, fill: '#F4A261', opacity: 0, 'pointer-events': 'none' }, T.bg);
            cue(['shimmer', 'chime_up'], .35);
            sun.animate([{ transform: 'translate(74px,77px)' }, { transform: 'translate(500px,30px)', offset: .5 }, { transform: 'translate(1010px,160px)' }], { duration: 3600, easing: 'ease-in-out', fill: 'forwards' });
            dusk.animate([{ opacity: 0 }, { opacity: 0 }, { opacity: .38 }, { opacity: 0 }], { duration: 4200, fill: 'forwards' });
            const gw = f => { cue('slide_up', .4); (rs.plants || []).forEach(p => { p.g.innerHTML = ''; stand(T, p.g, f, p.x, ROWY); p.g.animate([{ transform: 'scale(1,.6)', transformOrigin: `${p.x}px ${ROWY}px` }, { transform: 'scale(1,1)', transformOrigin: `${p.x}px ${ROWY}px` }], 420); }); };
            (async () => {
              await sleep(1800); if (t !== tok) return; gw('hen_prop_wheat_young');
              await sleep(1800); if (t !== tok) return; gw('hen_prop_wheat_gold');
              sun.animate([{ transform: 'translate(-80px,120px)' }, { transform: 'translate(74px,77px)' }], { duration: 900, fill: 'forwards' });
            })();
          }
          return null;
        },
        /* 3장: 밀 베기는 이야기 줄과 함께 시작하고, 다음 줄 앞에서 끝낸다 */
        reap(cmd) {
          if (inst()) return null;
          const t = tok;
          if (cmd === 'start') {
            hen.look('cut', 'right');
            rs.reapP = (async () => {
              for (const p of S.plants) {
                await hen.move(p.x - X(70, 80), hen.y, 600, 'ease-in-out'); if (t !== tok) return;
                cue(['chop', 'swish'], .45);
                p.g.remove(); p.g = stand(T, T.world, 'hen_prop_wheat_cut', p.x + 10, FL - 12);
                T.world.appendChild(hen.pos);
                await sleep(350);
              }
            })();
            return null;
          }
          return (async () => {
            await rs.reapP; if (t !== tok) return;
            S.plants.forEach(p => p.g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }));
            const bx = S.plants[0].x + X(40, 0);
            const bundle = stand(T, T.world, 'hen_prop_wheat_bundle', bx, FL - 4);
            bundle.animate([{ transform: 'translateY(-30px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], 400);
            T.world.appendChild(hen.pos); chicks.forEach(c => T.world.appendChild(c.pos));
            cue('rattle', .4); hen.look('happy'); chicksLook('hop'); chicksHop();
          })();
        },
        /* 4장 방앗간 */
        mill(cmd) {
          if (cmd === 'walk') {
            const path = X([[760, 400, .85], [560, 335, .68], [380, 280, .55], [255, 222, .42]], [[510, 345, .8], [350, 290, .62], [255, 222, .42]]);
            if (inst()) { const [x, y, s] = path[path.length - 1]; hen.setScale(s); hen.place(x, y); return null; }
            const t = tok;
            return (async () => {
              const steps = every(() => cue('step_grass', .25), 420);
              for (const [x, y, s] of path) {
                if (t !== tok) return;
                const sc = hen.scale;
                await hen.pos.animate([{ transform: tfm(hen.x, hen.y, hen.flip, sc) }, { transform: tfm(x, y, hen.flip, s) }], { duration: 1000, easing: 'linear' }).finished;
                hen.setScale(s); hen.place(x, y);
              }
              clearInterval(steps);
            })();
          }
          if (inst()) return null;
          if (cmd === 'grind') {
            S.spin.updatePlaybackRate(4); cue('drum', .4);
            every(() => cue(['knock', 'drum'], .3), 600);
            hen.look('stand', 'right');
            S.bin = T.el('g', { 'pointer-events': 'none' }, T.world);
            stand(T, S.bin, 'hen_prop_flour_bin_empty', MILL.door[0] + 46, MILL.door[1] + 6, 46);
          } else if (cmd === 'flour') {
            rs.iv.forEach(clearInterval); rs.iv = []; cue('rattle', .5);
            if (S.bin) { S.bin.innerHTML = ''; stand(T, S.bin, 'hen_prop_flour_bin', MILL.door[0] + 46, MILL.door[1] + 6, 50); }
            S.spin.updatePlaybackRate(1);
            return word('flour', MILL.door[0] + 46, MILL.door[1] - 80);
          }
          return null;
        },
        /* 5장 부엌: 반죽 */
        k5(cmd) {
          if (inst()) return null;
          const t = tok;
          if (cmd === 'pass') {
            [[pig, 470], [dog, 360], [cat, 260]].forEach(([a, x]) => winPut(a, x + 150, 'run', 'right', .68));
            rs.passP = Promise.all(FRS.map(a => a.move(a.x + X(420, 420), a.y, 5200, 'linear')));
          } else if (cmd === 'passEnd') {
            return (async () => { await rs.passP; if (t !== tok) return; FRS.forEach(hide); chicksLook('stand', 'left'); hen.look('ask', 'left'); })();
          } else if (cmd === 'bring') {
            return (async () => {
              hen.look('ask', 'left');
              for (const id of ['flour', 'water']) {
                const c = S.cells.find(x => x.id === id); c.el.style.visibility = 'hidden';
                await fly(ING(id), c.cx, c.cy, BOWLX(), S.top - 20, 74); if (t !== tok) return;
                if (id === 'flour') { cue('rattle', .5); S.bowl0.style.display = 'none'; S.bowl.style.display = ''; } else cue(['water_pour_1', 'water_drip'], .5);
                await word(id, BOWLX(), S.top - 120); if (t !== tok) return;
              }
            })();
          } else if (cmd === 'knead') {
            hen.move(BOWLX() + X(40, 40), hen.y, 500); S.bowl.style.display = 'none';
            hen.look('knead', 'left'); hen.place(hen.x, S.top + 6 + hen.h * hen.scale * .08);
            every(() => { hen.body.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.03,.97)' }, { transform: 'scale(1,1)' }], 400); cue('marimba_1', .3); }, 520);
          } else if (cmd === 'butter') {
            rs.iv.forEach(clearInterval); rs.iv = [];
            const bc = S.cells.find(x => x.id === 'butter'); if (bc) bc.el.style.visibility = 'hidden';
            S.tin = stand(T, S.mid, 'hen_prop_tin', BOWLX() - 70, S.top + 8, 40 * KP);
            hen.look('butter', 'left'); cue('swish', .4);
          } else if (cmd === 'butterWord') {
            return word('butter', hen.x - 60, S.top - 150).then(() => hen.look('stand', 'right'));
          } else if (cmd === 'oven') {
            return (async () => {
              if (S.oven) { const [ox, oy] = ovenWin(); S.tin.remove(); await fly('hen_prop_tin', BOWLX() - 70, S.top - 10, ox, oy, 60); cue('door', .5) || cue('knock', .5); cue('fire_crackle', .4); }
              else { S.tin.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }); cue('door', .5); }
            })();
          }
          return null;
        },
        /* 6장 오븐 */
        k6(cmd) {
          if (inst()) return null;
          const t = tok;
          if (cmd === 'glow') {
            const [ox, oy] = ovenWin();
            const gl = glow(T, S.mid, ox, oy, 150, '#F2B366', .9); S.mid.insertBefore(gl, S.mid.firstChild);
            gl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1200, fill: 'forwards' });
            rs.gl2 = glow(T, T.fx, ox, oy, 60, '#FBF3D5', .75); rs.gl2.animate([{ opacity: .6 }, { opacity: 1 }, { opacity: .6 }], { duration: 1600, iterations: Infinity });
            cue('fire_crackle', .3); cue('shimmer', .35);
          } else if (cmd === 'open') {
            return (async () => {
              cue('bell', .6) || cue('ding', .6);
              oven(...S.ovenAt.slice(0, 2), true, S.ovenAt[2]); T.world.appendChild(hen.pos); chicks.forEach(c => T.world.appendChild(c.pos));
              await cutPic('hen_cut_oven'); if (t !== tok) return;
              if (rs.gl2) rs.gl2.remove();
              hen.look('bread'); hen.move(hen.x - X(30, 0), FK + 4, 400); cue('harp_gliss', .5); cue('chime_up', .4);
              chicksLook('hop', 'right'); chicksHop();
            })();
          } else if (cmd === 'smell') {
            const sm = rs.sm = T.el('g', { 'pointer-events': 'none' }, T.fx);
            [0, 1, 2].forEach(i => { const g = T.el('g', {}, sm); stand(T, g, 'hen_prop_smell', 0, 0, 100); g.animate([{ transform: `translate(${hen.x - 20 + i * 30}px,${hen.y - 170}px)`, opacity: 0 }, { opacity: .95, offset: .3 }, { transform: `translate(${720 + i * 50}px,${120}px)`, opacity: 0 }], { duration: 2600, delay: i * 500, iterations: 2 }); });
            cue('harp_gliss_2', .35);
            winPut(cat, X(670, 650), 'sniff', 'left', X(.78, .66)); winPut(dog, X(790, 715), 'sniff', 'left', X(.72, .6)); winPut(pig, X(895, 772), 'sniff', 'left', X(.6, .48));
            FRS.forEach(f => { f.pos.animate([{ opacity: 0 }, { opacity: 1 }], 600); });
            every(() => { FRS.forEach((f, i) => setTimeout(() => f.hop(6, 240), i * 120)); cue('toot_kazoo', .2); }, 900);
          } else if (cmd === 'smellEnd') { rs.iv.forEach(clearInterval); rs.iv = []; if (rs.sm) rs.sm.remove(); }
          return null;
        },
        /* 7장 */
        k7(cmd) {
          if (inst()) return null;
          if (cmd === 'eat') {
            S.bread.remove(); S.bread = stand(T, S.food, 'hen_prop_bread', X(580, 640), S.top - 2, 48 * KP);
            hen.look('eat', 'right'); hen.hold('hen_prop_bread', 40);
            chicksLook('eat'); chicks[0].turn('right'); chicks[1].turn('left'); chicks[2].turn('left');
            every(() => cue(['chomp', 'marimba_2'], .3), 700);
          } else if (cmd === 'eatEnd') { rs.iv.forEach(clearInterval); rs.iv = []; return cutPic('hen_cut_eat'); }
          else if (cmd === 'shy') {
            [[cat, 'sit'], [dog, 'sit'], [pig, 'stand']].forEach(([a, k]) => { a.look(k, 'left'); a.place(a.x, a.y + 14); });
            cue('whistle_down', .3);
          } else if (cmd === 'shyEnd') hen.hold(null);
          return null;
        },
        /* 8장 다음 날 아침 */
        k8(cmd, a1) {
          if (inst()) return null;
          const t = tok;
          if (cmd === 'run') {
            cue('animals/rooster', .45); cue('birds_chirp_1', .3);
            const stops = X([500, 655, 825], [450, 520, 575]);
            const runners = rs.runners = [[dog, D.bring[0]], [cat, D.bring[1]], [pig, D.bring[2]]];
            runners.forEach(([a, ing], i) => { put(T, a, X(1100, 800) + i * 120, FL, { look: 'run', to: 'left', s: P ? .85 : 1 }); a.hold(ING(ing), P ? 50 : 54); });
            const steps = setInterval(() => cue('step_grass', .3), 260);
            return Promise.all(runners.map(([a], i) => sleep(i * 300).then(() => a.move(stops[i], FL, 1700, 'ease-out')))).then(() => { clearInterval(steps); hen.look('stand', 'right'); });
          }
          if (cmd === 'hopWord') {
            const [a, ing] = rs.runners[+a1];
            a.hop(10, 280);
            const [ix, iy] = a.holdAt();
            return word(ing, ix, iy - 70);
          }
          if (cmd === 'sit') { rs.runners.forEach(([a]) => a.hold(null)); dog.look('sit', 'left'); cat.look('sit', 'left'); pig.look('stand', 'left'); }
          else if (cmd === 'cards') {
            const order = ['hen_prop_card_seed', 'hen_prop_card_wheat', 'hen_prop_card_flour', D.card];
            const CW = 84, CH = 112;
            const slotXY = i => X([290 + i * 112, 205], [356 + i * 96, 150]);
            if (!P) { cast([[dog, 750, FL, { look: 'sit', to: 'left' }], [pig, 950, FL + 14, { look: 'mud', to: 'left' }], [cat, 850, FL + 4, { look: 'sit', to: 'left' }]]); put(T, hen, 175, FL, { look: 'point', to: 'right' }); chicksAt([235, 120, 75], FL + 30, { to: 'right' }); }
            else { FRS.forEach(hide); put(T, hen, 345, FL + 40, { look: 'point', to: 'right', s: .9 }); chicksAt([400, 315, null], FL + 60, { to: 'right' }); }
            const slots = T.el('g', { 'pointer-events': 'none' }, T.fx);
            [0, 1, 2, 3].forEach(i => { const [x, y] = slotXY(i); pic(T, T.el('g', { filter: 'url(#pp)' }, slots), 'hen_prop_card_slot', x, y, CW + 4, CH + 4); });
            cue('paper_turn', .5);
            rs.cards = [];
            return (async () => {
              for (let i = 0; i < 4; i++) {
                if (t !== tok) return;
                const [x, y] = slotXY(i), g = T.el('g', { 'pointer-events': 'none' }, T.fx), pg = T.el('g', { filter: 'url(#pp)' }, g);
                pic(T, pg, order[i], x, y, CW, CH);
                g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center';
                g.animate([{ transform: 'translateY(-30px) scale(.6)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 }], 400);
                rs.cards.push(g); cue('paper_down', .4) || cue('ding_glock', .4);
                await sleep(650);
              }
            })();
          } else if (cmd === 'bounce') {
            (async () => { for (let i = 0; i < 4; i++) { if (t !== tok) return; const c = rs.cards && rs.cards[i]; if (c) c.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], 420); cue('marimba_' + (i + 1), .4); await sleep(560); } })();
          }
          return null;
        },
        /* 9장 두 번째 요리 */
        k9(cmd, id) {
          const px = PLATE()[0];
          if (cmd === 'init') { rs.stackY = S.top - 2 - SLH * .5; return null; }
          if (inst()) return null;
          const t = tok;
          const LAYW = 160;
          const addLayer = (lid) => {
            const f = LAYER[DISH][lid]; if (!f) return;
            if (DISH === 'sandwich') { const h = LAYW / ASP[f] * .55; standWH(S.dish, f, px, rs.stackY + h * .5, LAYW, h); rs.stackY -= h * .42; }
            else if (DISH === 'pizza') { const g = stand(T, S.dish, f, px, S.top - 2, PZH); g.dataset.layer = lid; }
            else if (DISH === 'pancake') {
              if (lid === 'honey') { S.base.innerHTML = ''; stand(T, S.base, 'hen_prop_pancake_layer_honey', px, S.top + 8, PKH * ASP.hen_prop_pancake_stack / ASP.hen_prop_pancake_layer_honey); }
              else { const w = 120, h = w / ASP[f], g = stand(T, S.dish, f, px + (lid === 'banana' ? 14 : -14), S.panTop + h * (lid === 'banana' ? .75 : .35), h); g.dataset.layer = lid; }
            }
          };
          if (cmd === 'add') {
            return (async () => {
              const c = S.cells.find(x => x.id === id); if (c) c.el.style.visibility = 'hidden';
              chicks.forEach((k, i) => setTimeout(() => k.hop(8, 240), i * 80));
              await fly(ING(id), c ? c.cx : hen.x, c ? c.cy : hen.y - 100, px, S.top - 30, 70); if (t !== tok) return;
              hen.look('place', 'left'); cue('pop', .5); addLayer(id);
              if (DISH === 'pancake' && id === 'honey') cue('slide_down', .4);
            })();
          }
          if (cmd === 'word') return word(id, px, S.top - (id === 'bread' ? 170 : 150));
          if (cmd === 'eggword') { hen.look('place', 'left'); cue('pop', .4); return word('egg', px, S.top - 130); }
          if (cmd === 'knead') { hen.look('knead', 'left'); every(() => cue('marimba_1', .3), 500); }
          else if (cmd === 'pan') { rs.iv.forEach(clearInterval); rs.iv = []; S.base.innerHTML = ''; stand(T, S.base, 'hen_prop_fry_pan', px, S.top + 4, 52); cue('steam_hiss', .4) || cue('fire_crackle', .4); }
          else if (cmd === 'stack') { S.base.innerHTML = ''; stand(T, S.base, 'hen_prop_pancake_stack', px, S.top + 8, PKH); S.panTop = S.top + 8 - PKH * .72; cue('pop_appear', .5) || cue('pop', .5); }
          else if (cmd === 'top') {
            return (async () => {
              await fly('hen_prop_bread_slice', hen.x - 40, hen.y - 120, px, rs.stackY, 110); if (t !== tok) return;
              stand(T, S.dish, 'hen_prop_bread_slice', px, rs.stackY + SLH * .55, SLH); cue('pop', .8);
            })();
          } else if (cmd === 'rest') {
            const rest = S.cells.find(x => x.el.style.visibility !== 'hidden' && !D.ask.includes(x.id));
            (DISH === 'pizza' ? cat : dog).hop(12, 300);
            if (rest) rest.el.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(30px)' }], { duration: 500, fill: 'forwards' });
            cue('giggle_xylo', .4) || cue('pop', .4);
          } else if (cmd === 'oven') {
            return (async () => {
              S.dish.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
              cue('door', .4); await sleep(1300); if (t !== tok) return; cue('bell', .6) || cue('ding', .6);
              S.dish.getAnimations().forEach(a => a.cancel());
              [...S.dish.children].forEach(n => { if (n !== S.base) n.remove(); });
              S.base.innerHTML = ''; stand(T, S.base, 'hen_prop_plate', px, S.top + 10, 30 * KP); stand(T, S.base, 'hen_prop_pizza_whole', px, S.top - 2, PZH);
            })();
          } else if (cmd === 'done') {
            hen.look('happy'); chicksLook('hop'); chicksHop(); FRS.forEach(f => f.hop(12, 300));
            cue('cymbal', .3); cue('chime_up', .5);
          }
          return null;
        },
        /* 10장 */
        k10(cmd, a1) {
          if (inst()) return null;
          if (cmd === 'pour') { hen.look('pour', 'right'); cue(['water_pour_1', 'water_drip'], .4); rs.cup = stand(T, T.world, 'hen_prop_cup', hen.x + hen.w * .45, FL + 10, 30); }
          else if (cmd === 'pourEnd') { if (rs.cup) rs.cup.remove(); hen.look('stand', 'right'); }
          else if (cmd === 'nom') { const a = { cat, dog, pig }[a1]; a.hop(8, 260); cue(['chomp', 'chomp_2'], .35); }
          else if (cmd === 'finale') {
            bgm(null);
            hen.look('wave'); cue('animals/rooster', .5);
            T.confetti(); finaleMusic();
            ALL.forEach((a, i) => { if (shown(a)) setTimeout(() => a.hop(20, 380), i * 70); });
          }
          return null;
        },
        settle() { stopAll(); return null; },
      };
      const en = (() => { try { return typeof englishOn === 'function' && englishOn(); } catch (e) { return false; } })();
      const getJ = f => fetch(f, { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).catch(() => null);
      const sc = (en && await getJ('read_script_en.json')) || await getJ('read_script_el.json');
      let list = null, idx = 0;
      const RW = Object.create(T);
      /* 부엌이 이어지는 장면(5·6·7)은 책장을 넘기지 않고 같은 배경 위에서 잇는다 */
      RW.sceneCard = (label, change, focus) => {
        idx++;
        if (!list && sc && Array.isArray(sc.scenes)) { const ch = (window.__READ && window.__READ.chosen) || []; list = sc.scenes.filter(x => !x.variant || x.variant === ch[(x.round || 1) - 1]); }
        const nx = list && list[idx];
        const nbg = nx && nx.set != null && SC[+nx.set - 1] ? SC[+nx.set - 1][2] : null;
        if (nbg && KITCHEN.test(nbg) && KITCHEN.test(curBg) && !document.hidden) return cont(change);
        return T.sceneCard(label, change, focus);
      };
      try { const rr = await T.readPlay.call(RW, R); await finaleWait(); try { AudioFX.stopAmbient(.5); } catch (e) { /* */ } return rr; } finally { bgm(null); stopAll(); }
    }

    const from = Math.max(1, Math.min(10, +QS.get('from') || 1));
    window.__rh = { dish: DISH, scene: 0 };
    let first = true;
    for (const [n, label, bg, mkSet, play] of SC) {
      if (n < from) continue;
      const set = await mkSet();
      window.__rh.scene = n;
      if (first) { set(); await T.curtain(true); first = false; }
      else await next(tr(label), bg, set);
      window.__rh.ready = n;
      await play();
    }
    window.__rh.scene = 11;
    bgm(null); try { AudioFX.stopAmbient(1); } catch (e) { /* */ }
    T.finale(); await sleep(1200);
    return '일할 때 같이 하면 먹을 때도 같이 먹어요.';
  }

  Tale.mount({ title: '빨간 암탉', subtitle: '', read: true, run: T => run(Tale.api) });
})();
