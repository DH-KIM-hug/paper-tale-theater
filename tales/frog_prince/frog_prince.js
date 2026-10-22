/* 개구리 왕자 — 그림 형제 원작 그대로. 기획: tales/frog_prince/PLAN.md, 상세: SPEC.md (2026-10-21)
   배움 놀이 2개(1장 모양 고르기 · 8장 빵 세기), 톡 1번(10장 손잡기), 연타 없음, 줄거리 선택 없음. 교훈 대사 없음. 입맞춤 없음.
   크기: 사람(공주·임금·왕자)은 머리 크기가 같다(2.5등신, HT 표). 개구리는 공주 키의 0.39(앉은 높이 90), 금공 지름 48(≈ 공주 머리 폭 80 의 0.6).
   던지기: 개구리는 벽에 닿지 않고 베개 위에 떨어진다. 아픈 표현 없음. 소품은 얼굴 없음.
   세기: 하나·둘·셋은 공주 목소리(vo n1~n3)로만, 글 말풍선 없음.
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/fp_*.webp (목록 tools/app/gen/jobs_frog_prince.json) — 파일이 생기면 코드 변경 없이 그림으로 바뀐다. */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 비율: 그림이 오기 전엔 SPEC §2-1 시작값. preload 가 실제 비율로 덮어쓴다 */
  const ASP = {
    fp_prin_stand: 0.47, fp_prin_ball: 0.5617, fp_prin_cry: 0.4717, fp_prin_run: 0.7083, fp_prin_refuse: 0.525, fp_prin_sorry: 0.4717, fp_prin_sit: 0.47, fp_prin_throw: 0.6317, fp_prin_hand: 0.535,
    fp_king_stand: 0.4983, fp_prince_stand: 0.4633, fp_prince_hand: 0.5817,
    fp_frog_sit: 1.0633, fp_frog_ball: 1.0633, fp_frog_hop: 1.5411, fp_frog_fly: 1.03, fp_frog_surprise: 1.0633,
    fp_prop_ball: 1.0, fp_prop_table: 3.0201, fp_prop_plate: 2.093, fp_prop_bread: 1.3033, fp_prop_pillow: 1.9438,
    fp_layer_rose_arch: .6283, fp_layer_flowerbed: 2.2333, fp_layer_topiary: .57, fp_layer_lily_pads: 1.39, fp_layer_reeds: .6117, fp_layer_butterfly: 1.1883,
    fp_layer_chandelier: .955, fp_layer_candelabra: .4633, fp_layer_garland: 4.3269, fp_layer_magic_burst: .9367, fp_layer_hedge_front: 2.381,
  };
  /* 높이: 사람은 얼굴 폭, 개구리는 눈 폭으로 맞춘다(SPEC §2-2). 그림이 오면 다시 잰다 */
  const HT = {
    fp_prin_stand: 230, fp_prin_ball: 238, fp_prin_cry: 230, fp_prin_run: 225, fp_prin_refuse: 230, fp_prin_sorry: 222, fp_prin_sit: 236, fp_prin_throw: 230, fp_prin_hand: 230,
    fp_king_stand: 245, fp_prince_stand: 240, fp_prince_hand: 240,
    fp_frog_sit: 90, fp_frog_ball: 90, fp_frog_hop: 104, fp_frog_fly: 89, fp_frog_surprise: 99,
    fp_prop_ball: 48, fp_prop_table: 150, fp_prop_plate: 40, fp_prop_bread: 34, fp_prop_pillow: 70,
    /* 레이어 소품(VISUAL_PLAN §5): 배경을 꾸미는 종이 조각. 누름을 받지 않는다 */
    fp_layer_rose_arch: 300, fp_layer_flowerbed: 110, fp_layer_topiary: 200, fp_layer_lily_pads: 50, fp_layer_reeds: 190, fp_layer_butterfly: 34,
    fp_layer_chandelier: 170, fp_layer_candelabra: 230, fp_layer_garland: 80, fp_layer_magic_burst: 260, fp_layer_hedge_front: 100,
  };
  /* 그림이 보는 쪽 ('left' | 'right' | 'front') */
  const NAT = { fp_prin_run: 'right', fp_prin_throw: 'right', fp_prin_hand: 'right', fp_prin_refuse: 'left', fp_prin_sit: 'left',
    fp_prince_hand: 'right', fp_frog_hop: 'right', fp_frog_fly: 'right' };
  const FL = 505;                       // 바닥(발끝 y)
  const POND = { x: 660, surf: 420 };   // 2~5장 샘: 가운데 x, 물 윗선 y (받은 배경 fp_bg_pond 를 보고 ±20)
  const DOOR = { x: 130 };              // 6·7장 열린 문의 가운데 x
  const BED  = { x: 850, top: 272 };    // 9장 침대: 베개 x, 매트리스 윗선 y (fp_bg_room_v2 에서 잼: 매트리스 윗선 266, 머리판 앞 흰 매트리스 x 860~975)
  const TABLE_TOP = FL - 140;           // 8장 식탁 윗면 y
  const BALL_UP  = [0, -272];           // prin_ball: 들어 올린 두 손 위 공 중심(공주 발끝 기준)
  const BALL_RUN = [22, -118];          // prin_run: 품에 안은 공 중심(오른쪽 볼 때). 왼쪽을 볼 때는 x 부호를 뒤집는다
  const HAND_PRIN = [58, -118];         // prin_hand: 내민 손끝(오른쪽 볼 때)
  const HAND_PRINCE = [60, -122];       // prince_hand: 내민 손끝(오른쪽 볼 때; 왼쪽 보면 x = -60)
  const BGS = ['fp_bg_yard_v2', 'fp_bg_pond_v2', 'fp_bg_dining_v2', 'fp_bg_room_v2'];
  const src = k => AS + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const artOK = {}, bgOK = {};          // preload 결과(그림이 실제로 있는지) — 없으면 자리표시
  const hOf = f => HT[f] || 200;

  /* ================= 자리표시(그림이 없을 때) ================= */
  const WHO = { prin: '공주', frog: '개구리', king: '임금님', prince: '왕자' };
  const POSE = { stand: '서기', ball: '공놀이', cry: '울음', run: '안고 달림', refuse: '싫어함', sorry: '반성', sit: '식사', throw: '던짐', hand: '손 내밈', hop: '폴짝', fly: '날아감', surprise: '놀람' };
  const PROPN = { fp_prop_ball: '금공', fp_prop_table: '식탁', fp_prop_plate: '접시', fp_prop_bread: '빵', fp_prop_pillow: '베개' };
  const SKIN = '#F3D9B8', CREAM = '#F6ECD8', GOLD = '#D9A94E', FONT = "'Pretendard Variable', Pretendard, sans-serif";

  function placeholder(T, parent, f, w, h) {
    const g = T.el('g', {}, parent);
    const R = (x, y, ww, hh, rx, fill, extra = {}) => T.el('rect', { x, y, width: ww, height: hh, rx, fill, ...extra }, g);
    const C = (cx, cy, r, fill, extra = {}) => T.el('circle', { cx, cy, r, fill, ...extra }, g);
    const E = (cx, cy, rx, ry, fill) => T.el('ellipse', { cx, cy, rx, ry, fill }, g);
    const Pth = (d, fill, extra = {}) => T.el('path', { d, fill, ...extra }, g);
    const label = (txt, cx, cy, fill = CREAM, fs) => {
      const t = T.el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': fs || Math.max(11, Math.min(20, h * .075)), 'font-weight': 700, fill, 'font-family': FONT, text: txt }, g);
      t.classList.add('phl'); t.dataset.cx = cx; t.dataset.cy = cy; t.setAttribute('transform', `translate(${cx},${cy})`);
    };
    const m = /^fp_(prin|frog|king|prince)_(.+)$/.exec(f), nat = NAT[f] || 'front', dx = nat === 'left' ? -1 : nat === 'right' ? 1 : 0;
    if (m) {
      const [, who, pose] = m, name = WHO[who] + ' ' + (POSE[pose] || pose);
      if (who === 'frog') {
        const wide = pose === 'hop' || pose === 'fly', big = pose === 'surprise' ? 1.4 : 1;
        if (pose === 'fly') { E(w / 2, h / 2, w * .4, h * .42, '#3F6B4F'); C(w * .66, h * .3, h * .13 * big, '#F4F6FA'); C(w * .66 + dx * 3, h * .3, h * .05, '#2E241C'); }
        else {
          E(w / 2, h * .62, w * (wide ? .46 : .4), h * .36, '#3F6B4F'); E(w / 2, h * .7, w * (wide ? .3 : .24), h * .2, '#9DBB7A');
          const ex = wide ? w * .66 : w / 2;
          [-1, 1].forEach(s => { const cx = wide ? ex : ex + s * w * .14, cy = wide ? h * .3 + (s > 0 ? 0 : 6) : h * .28; C(cx, cy, h * .13 * big, '#F4F6FA'); C(cx + dx * 2, cy, h * .05, '#2E241C'); });
        }
        if (pose === 'ball') C(w / 2, h * .78, h * .25, GOLD);
        label(name, w / 2, h * .92, CREAM, 12); return g;
      }
      const r = h * .2, lying = false;
      const body = { prin: '#F2C94C', king: '#A93B32', prince: '#1F2A56' }[who];
      const arm = (dir, y) => E(w / 2 + dir * w * .36, y, w * .15, h * .05, SKIN);
      const sit = pose === 'sit';
      if (who === 'prince') R(w * .2, h * .3, w * .6, h * .6, 6, '#3F6B4F');                    // 망토
      if (sit) R(w * .06, h * .6, w * .88, h * .4, 6, '#8a5a38');                                // 의자
      const bw = Math.min(w * .6, r * 2.4), by = 2 * r;
      if (who === 'prin') Pth(`M${w / 2 - bw * .4} ${by} L${w / 2 + bw * .4} ${by} L${w / 2 + bw * .62} ${h} L${w / 2 - bw * .62} ${h} Z`, body);
      else R(w / 2 - bw / 2, by, bw, h - by, 8, body);
      if (who === 'prin') { E(w / 2 - r * .9, r * 1.7, r * .22, r * .75, '#E9C46A'); C(w / 2, r + 2, r + 2, '#E9C46A'); }
      if (who === 'prince') C(w / 2, r - 2, r + 2, '#6B4A32');
      C(w / 2, r + 4, r, SKIN);
      if (who === 'prin') Pth(`M${w / 2 - r} ${r} Q${w / 2} ${-r * .3} ${w / 2 + r} ${r} Q${w / 2} ${r * .5} ${w / 2 - r} ${r}Z`, '#E9C46A');
      if (who === 'king') Pth(`M${w / 2 - r * .6} ${r * 1.5} Q${w / 2} ${r * 2.3} ${w / 2 + r * .6} ${r * 1.5} Z`, '#BDB7AE');
      [-1, 1].forEach(s => C(w / 2 + s * r * .36 + dx * r * .25, r + 4, Math.max(2.5, r * .08), '#2E241C'));
      [0, 1, 2].forEach(i => Pth(`M${w / 2 + (i - 1) * r * .5 - 6} 4 L${w / 2 + (i - 1) * r * .5} -8 L${w / 2 + (i - 1) * r * .5 + 6} 4 Z`, GOLD));
      if (who === 'prin' && pose === 'ball') { arm(-1, r * .6); arm(1, r * .6); }
      if (who === 'prin' && pose === 'cry') { E(w / 2 - r * .45, r + 4, r * .3, r * .22, SKIN); E(w / 2 + r * .45, r + 4, r * .3, r * .22, SKIN); }
      if ((pose === 'run' || pose === 'throw' || pose === 'hand') || (who === 'prince' && pose === 'hand')) E(w * .86, h * .55, w * .17, h * .05, SKIN);
      if (pose === 'refuse') E(w * .1, h * .5, w * .17, h * .05, SKIN);
      label(name, w / 2, by + (h - by) * .5, who === 'prin' ? '#6B4A32' : CREAM, Math.max(11, Math.min(15, bw / 4.4)));
      return g;
    }
    const nm = PROPN[f] || f;
    switch (f) {
      case 'fp_prop_ball': C(w / 2, h / 2, Math.min(w, h) / 2, GOLD); Pth(`M${w * .22} ${h * .5} Q${w * .3} ${h * .22} ${w * .55} ${h * .2} Q${w * .36} ${h * .3} ${w * .22} ${h * .5} Z`, CREAM); break;
      case 'fp_prop_table': R(0, h * .12, w, h * .2, 4, GOLD); R(w * .05, h * .18, w * .9, h * .06, 2, CREAM); R(w * .08, h * .32, 12, h * .68, 2, '#6B4A32'); R(w * .92 - 12, h * .32, 12, h * .68, 2, '#6B4A32'); label(nm, w / 2, h * .5, '#6B4A32', 14); break;
      case 'fp_prop_plate': E(w / 2, h / 2, w / 2, h / 2, '#A93B32'); E(w / 2, h / 2, w * .44, h * .38, CREAM); break;
      case 'fp_prop_bread': R(0, h * .1, w, h * .9, h * .35, GOLD); R(w * .1, 0, w * .8, h * .4, h * .2, '#6B4A32'); break;
      case 'fp_prop_pillow': R(0, 0, w, h, h * .35, CREAM); R(w * .1, h * .62, w * .8, h * .14, 4, '#F2C4C4'); break;
      default: R(0, 0, w, h, Math.min(w, h) * .2, GOLD); label(nm, w / 2, h / 2, '#2E241C', 13);
    }
    return g;
  }
  /* 그림 한 장(있으면 그림, 없으면 자리표시): 위 왼쪽 (x,y), 크기 w×h */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    const g = placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
    return g.parentNode;
  }

  /* 배경 자리표시: 종이 한 장 + 요소 2~3개 + 장면 이름표 */
  const BGPH = {
    fp_bg_yard_v2:   { sky: '#EEF3F7', gnd: '#9DBB7A', name: '성 뜰', shapes: () => [['rect', { x: 60, y: 170, width: 90, height: 240, fill: CREAM }], ['rect', { x: 170, y: 220, width: 80, height: 190, fill: CREAM }], ['path', { d: 'M50 170 L105 100 L160 170Z', fill: GOLD }], ['rect', { x: 850, y: 280, width: 30, height: 130, fill: '#6B4A32' }], ['circle', { cx: 865, cy: 240, r: 70, fill: '#3F6B4F' }]] },
    fp_bg_pond_v2:   { sky: '#EEF3F7', gnd: '#9DBB7A', name: '숲속 샘', shapes: () => [['ellipse', { cx: 660, cy: 500, rx: 215, ry: 90, fill: '#BFD8EE' }], ['circle', { cx: 150, cy: 440, r: 30, fill: '#BDB7AE' }], ['circle', { cx: 210, cy: 460, r: 24, fill: '#BDB7AE' }], ['circle', { cx: 120, cy: 475, r: 20, fill: '#BDB7AE' }], ['circle', { cx: 60, cy: 200, r: 90, fill: '#3F6B4F' }], ['circle', { cx: 950, cy: 200, r: 90, fill: '#3F6B4F' }]] },
    fp_bg_dining_v2: { sky: CREAM, gnd: '#6B4A32', name: '성 식당(식탁 없음)', shapes: () => [['rect', { x: 70, y: 150, width: 120, height: 262, fill: '#6B4A32' }], ['rect', { x: 95, y: 190, width: 70, height: 110, fill: '#1F2A56' }], ['rect', { x: 440, y: 70, width: 120, height: 160, rx: 60, fill: '#1F2A56' }], ['rect', { x: 860, y: 250, width: 24, height: 160, fill: GOLD }], ['circle', { cx: 872, cy: 240, r: 18, fill: '#F2B366' }]] },
    fp_bg_room_v2:   { sky: CREAM, gnd: '#6B4A32', name: '공주 방(베개 없음)', shapes: () => [['rect', { x: 640, y: 400, width: 320, height: 110, fill: '#6B4A32' }], ['rect', { x: 650, y: 390, width: 300, height: 30, fill: CREAM }], ['rect', { x: 700, y: 420, width: 250, height: 80, fill: '#A93B32' }], ['rect', { x: 120, y: 90, width: 150, height: 170, fill: '#1F2A56' }], ['circle', { cx: 230, cy: 130, r: 26, fill: CREAM }]] },
  };
  function bgImage(T, key) {
    if (bgOK[key]) return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const d = BGPH[key], g = T.el('g', {}, T.bg);
    T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: d.sky }, g);
    T.el('rect', { x: BGBOX.x, y: 412, width: BGBOX.w, height: 200, fill: d.gnd }, g);
    d.shapes().forEach(([t, a]) => T.el(t, a, g));
    T.el('text', { x: 500, y: 52, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: '#6B4A32', 'font-family': FONT, opacity: .85, text: '(그림 자리) 배경: ' + d.name }, g);
    return g;
  }

  /* ================= 배우·소품 ================= */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, [f, h0]]) => {
        const h = h0 || hOf(f), w = h * (ASP[f] || 1);
        const wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
      });
    });
    a.want = 'left';
    const place0 = a.place;      // 자리표시의 글자는 뒤집히지 않게 거꾸로 되돌린다
    a.place = (nx, ny) => { place0(nx, ny); a.pos.querySelectorAll('.phl').forEach(t => t.setAttribute('transform', `translate(${t.dataset.cx},${t.dataset.cy}) scale(${a.flip},1)`)); };
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
  const wiggleEl = (T, n) => T.anim(n, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360);
  const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
  const sfx = (name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });
  const boing = (T, v) => sfx('boing', v, () => T.tone([300, 600], .12, { vol: .15 }));

  /* 누르는 자리 넓히기: 화면 w×h 투명 사각을 그림 뒤에 깐다(a.scale 로 나눠 화면 크기를 지킨다). 도형(kind)은 가운데 기준 */
  function hitBox(T, a, w = 100, h = 100) {
    const sc = a.scale || 1, lw = w / sc, lh = h / sc;
    const r = T.el('rect', { x: -lw / 2, y: a.kind ? -lh / 2 : -lh, width: lw, height: lh, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.body); a.hit = a.pos;
    return a;
  }
  /* 보이지 않는 톡 자리 (10장 손 사이) */
  function tapSpot(T, x, y, w, h) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, T.world);
    T.el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, g);
    return g;
  }
  /* 종이 도형 (1장 고르기 보기): 셋 다 같은 금색·같은 크기 */
  function shape(T, kind, x, y, size) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, T.world), body = T.el('g', { filter: 'url(#pp)' }, g), s = size / 2, F = GOLD;
    if (kind === 'circle') T.el('circle', { cx: 0, cy: 0, r: s, fill: F }, body);
    else if (kind === 'square') T.el('rect', { x: -s, y: -s, width: size, height: size, rx: 4, fill: F }, body);
    else T.el('path', { d: `M0 ${-s} L${s} ${s} L${-s} ${s} Z`, fill: F }, body);
    return { pos: g, body, x, y, kind, scale: 1 };
  }
  /* 물 파문 (3장) */
  function ripple(T, x, y) {
    const L = T.fx || T.world;
    for (let i = 0; i < 3; i++) setTimeout(() => {
      const e = T.el('ellipse', { cx: x, cy: y, rx: 20, ry: 7, fill: 'none', stroke: '#F4F6FA', 'stroke-width': 3 }, L);
      e.style.transformOrigin = `${x}px ${y}px`;
      e.animate([{ transform: 'scale(1)', opacity: .9 }, { transform: 'scale(4.5)', opacity: 0 }], { duration: 1200, easing: 'ease-out', fill: 'forwards' }).finished.then(() => e.remove(), () => e.remove());
    }, i * 250);
  }
  /* 물 윗선 아래를 감추는 클립 (4·5장). put() 은 이 부르기 전에 한 번만 */
  function waterClip(T, a, surfY) {
    const wc = T.el('g', { 'clip-path': 'url(#fpWater)' }, T.world);
    const cp = T.el('clipPath', { id: 'fpWater' }, wc);
    T.el('rect', { x: -200, y: -200, width: 1400, height: surfY + 200 }, cp);
    wc.appendChild(a.pos);
    return wc;
  }
  /* 포물선 이동 (식탁 위로, 던지기) */
  function arc(a, nx, ny, peak, ms) {
    const up = a.body.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-peak}px)`, offset: .5 }, { transform: 'translateY(0)' }], { duration: ms, easing: 'ease-in-out' }).finished.catch(() => {});
    return Promise.all([a.move(nx, ny, ms, 'linear'), up]);
  }
  /* 폴짝폴짝: n 번 */
  async function hops(T, a, toX, n, ms) {
    const step = (toX - a.x) / n;
    for (let i = 0; i < n; i++) { boing(T, .25); await arc(a, a.x + step, a.y, 40, ms); await T.sleep(120); }
  }
  /* 마법 빛: 크림 원 + 금별 8개 */
  function flash(T, x, y) {
    const L = T.fx || T.world;
    const c = T.el('circle', { cx: x, cy: y, r: 10, fill: CREAM }, L);
    c.style.transformOrigin = `${x}px ${y}px`; c.style.transformBox = 'view-box';
    c.animate([{ transform: 'scale(1)', opacity: .95 }, { transform: 'scale(42)', opacity: 0 }], { duration: 700, easing: 'ease-out', fill: 'forwards' }).finished.then(() => c.remove(), () => c.remove());
    for (let i = 0; i < 8; i++) {
      const ang = i / 8 * Math.PI * 2, r = 14;
      const p = T.el('path', { d: `M0 ${-r} L${r * .3} ${-r * .3} L${r} 0 L${r * .3} ${r * .3} L0 ${r} L${-r * .3} ${r * .3} L${-r} 0 L${-r * .3} ${-r * .3} Z`, fill: GOLD, transform: `translate(${x},${y})` }, L);
      p.animate([{ transform: `translate(${x}px,${y}px)`, opacity: 1 }, { transform: `translate(${x + Math.cos(ang) * 160}px,${y + Math.sin(ang) * 160}px)`, opacity: 0 }], { duration: 900, easing: 'ease-out', fill: 'forwards' }).finished.then(() => p.remove(), () => p.remove());
    }
  }
  /* 꽃잎 (10장) */
  function petals(T) {
    const L = T.fx || T.world;
    for (let i = 0; i < 14; i++) {
      const x = 300 + Math.random() * 460, sgn = Math.random() < .5 ? -1 : 1;
      const e = T.el('ellipse', { cx: 0, cy: 0, rx: 7, ry: 4, fill: '#F2C4C4', transform: `translate(${x},-30)` }, L);
      e.animate([{ transform: `translate(${x}px,-30px) rotate(0)` }, { transform: `translate(${x + sgn * 30}px,560px) rotate(${sgn * 180}deg)` }],
        { duration: 2600 + Math.random() * 900, delay: i * 120, easing: 'linear', fill: 'forwards' }).finished.then(() => e.remove(), () => e.remove());
    }
  }
  /* 걷는 동안 발소리·통통 걸음 */
  async function walkFx(T, a, mv, name, every, h) {
    let done = false; mv.then(() => { done = true; });
    while (!done) { sfx(name, .4); a.hop(h, every - 60); await T.sleep(every); }
    await mv;
  }

  const S = {
    L0: "옛날 어느 성에 금빛 공을 가장 좋아하는 공주가 살았어요.",
    L1: "금공은 어떤 모양일까요? 골라 봐요.",
    W_sq: "그건 네모예요. 금공 모양을 다시 찾아봐요.",
    W_tri: "그건 세모예요. 금공 모양을 다시 찾아봐요.",
    C1: "맞아요, 동그라미! 금공은 동글동글 동그라미예요.",
    L2: "통통통! 내 금공은 세상에서 제일 예뻐.",
    L3: "어느 날, 공주는 숲속 샘가에서 공놀이를 했어요.",
    L4: "공이 높이, 더 높이… 어머나!",
    L5: "공이 샘 속으로 풍덩! 금공이 깊은 물속으로 가라앉았어요.",
    L6: "엉엉, 내 금공… 내 금공이 사라졌어.",
    L7: "그때 샘물 위로 초록 개구리가 고개를 내밀었어요.",
    L8: "공주님, 왜 울어요?",
    L9: "내 금공이 샘에 빠졌어. 흑흑.",
    L10: "내가 공을 찾아 줄게. 대신 나랑 친구가 되고, 같이 먹고, 한 침대에서 자 줄래?",
    L11: "좋아, 약속할게!",
    L12: "개구리는 풍덩 물속으로 들어가 금공을 물고 올라왔어요.",
    L13: "내 공이다!",
    L14: "공주는 공을 받아 안고 성으로 쌩 달려갔어요.",
    L15: "기다려, 약속했잖아!",
    L16: "저녁 식사 때, 문 밖에서 폴짝폴짝 소리가 났어요. 똑똑!",
    L17: "공주님, 약속했잖아요. 문 좀 열어 줘요.",
    L18: "싫어! 저리 가!",
    L19: "그 모습을 본 임금님이 공주에게 물었어요.",
    L20: "공주야, 무슨 약속을 했느냐?",
    L21: "개구리가 금공을 찾아 주면… 친구가 되겠다고 했어요.",
    L22: "약속은 지켜야 한단다. 도와준 친구에게는 더욱 그렇지.",
    L23: "…알겠어요, 아버지.",
    L24: "공주는 개구리를 식탁으로 데려갔어요.",
    L25: "약속했으니까 같이 먹자.",
    L26: "접시에 빵이 몇 개일까요? 접시를 톡 눌러 봐요.",
    L27: "빵이 세 개! 너 하나, 나 하나, 남은 하나는 나눠 먹자.",
    L28: "냠냠, 맛있다!",
    L29: "밤이 되자 개구리가 공주의 방까지 따라왔어요.",
    L30: "공주님, 같은 침대에서 자기로 했잖아요.",
    L31: "으, 이제 그만!",
    L32: "공주는 개구리를 침대 쪽으로 휙 던졌어요. 개구리는 푹신한 베개 위에 포옥!",
    L33: "고마워요. 나는 마법에 걸린 왕자였어요. 약속을 지켜 줘서 마법이 풀렸어요.",
    L34: "어머, 개구리가… 왕자님이었구나!",
    L35: "다음 날, 공주와 왕자는 성 뜰에서 함께 놀았어요.",
    L36: "이제 우리는 진짜 친구예요.",
    L37: "응! 우리 같이 공놀이하자!",
    L38: "둘은 금공을 주고받으며 오래오래 사이좋게 지냈답니다.",
  };

  async function run(T) {
    if (T.fx) T.fx.style.pointerEvents = 'none';   // 효과 글자(pop)가 누르는 대상을 덮지 않게
    const { sleep, camSnap, tr } = T;
    const GAP = 700, SCENE_END = 1500, LOOK = 1500;   /* 2026-10-22 대사 뒤·장면 끝 쉼을 줄임(전환이 느리다는 지적) */   // LOOK: 장면이 바뀐 뒤 그림을 둘러보는 쉼(목표 7분)
    const say = async text => { await T.say(text); await sleep(GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(하나·둘·셋)
    const scene = key => { T.clear(); bgImage(T, key); dress(key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    AudioFX.preloadSfx(['boing', 'splash', 'splash_big', 'bubbles', 'knock', 'door', 'step_grass', 'step_wood', 'paper_up', 'paper_down', 'swish', 'sparkle', 'tada', 'chomp', 'pop']);
    /* 그림 파일 미리 받기: 있으면 쓰고, 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 */
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(4000)]);
    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, ['fp_' + who + '_' + p, HT['fp_' + who + '_' + p]]]));
    const prin = mk(T, pz('prin', ['stand', 'ball', 'cry', 'run', 'refuse', 'sorry', 'sit', 'throw', 'hand']));
    const frog = mk(T, pz('frog', ['sit', 'ball', 'hop', 'fly', 'surprise']));
    const king = mk(T, pz('king', ['stand']));
    const prince = mk(T, pz('prince', ['stand', 'hand']));
    const ball = prop(T, 'fp_prop_ball', HT.fp_prop_ball), table = prop(T, 'fp_prop_table', HT.fp_prop_table), plate = prop(T, 'fp_prop_plate', HT.fp_prop_plate), pillow = prop(T, 'fp_prop_pillow', HT.fp_prop_pillow);
    const breads = [0, 1, 2].map(() => prop(T, 'fp_prop_bread', HT.fp_prop_bread));
    /* 레이어 소품(VISUAL_PLAN §4): 중간 층은 world 맨 뒤(배우보다 먼저), 앞 가림 층은 fx(배우 위). 모두 누름 없음 */
    const deco = k => { const a = prop(T, 'fp_layer_' + k, HT['fp_layer_' + k]); a.pos.style.pointerEvents = 'none'; return a; };
    const L = Object.fromEntries(['rose_arch', 'flowerbed', 'topiary', 'lily_pads', 'reeds', 'chandelier', 'candelabra', 'garland', 'garland2', 'magic_burst', 'hedge_front'].map(k => [k, deco(k.replace(/2$/, ''))]));
    const flies = [0, 1].map(() => deco('butterfly'));
    [prin, frog, king, prince, ball, table, plate, pillow, ...breads, ...Object.values(L), ...flies].forEach(hide);
    const mid = (a, x, y) => { put(T, a, x, y); T.world.insertBefore(a.pos, T.world.firstChild); return a; };
    const front = (a, x, y) => { put(T, a, x, y); T.fx.appendChild(a.pos); return a; };
    function drift(b, cx, cy, i) {     // 나비: 느린 8자(12초), 날갯짓
      put(T, b, cx, cy); T.fx.appendChild(b.pos); b.body.getAnimations().forEach(n => n.cancel());
      const k = i ? -1 : 1;
      b.body.animate([0, 1, 2, 3, 4].map(t => ({ translate: `${k * 60 * Math.sin(t * Math.PI / 2)}px ${26 * Math.sin(t * Math.PI)}px` })), { duration: 12000 + i * 1500, iterations: Infinity, easing: 'ease-in-out' });
      b.body.animate([{ scale: '1 1' }, { scale: '.55 1' }, { scale: '1 1' }], { duration: 420, iterations: Infinity });
    }
    const flicker = a => a.body.animate([{ opacity: 1 }, { opacity: .85 }, { opacity: 1 }], { duration: 1600, iterations: Infinity });
    function dress(key) {
      if (key === 'fp_bg_yard_v2') {
        mid(L.rose_arch, X(80, 300), FL - 10);
        front(L.hedge_front, X(40, 40), 585);
        flies.forEach((b, i) => drift(b, X([150, 880][i], [480, 650][i]), [200, 140][i], i));
      }
      if (key === 'fp_bg_pond_v2') {
        mid(L.reeds, 985, FL - 20); mid(L.lily_pads, 800, 488);
        front(L.flowerbed, X(950, 760), 585);
        drift(flies[0], X(200, 450), 200, 0);
      }
      if (key === 'fp_bg_dining_v2') {
        flicker(mid(L.chandelier, 560, 170)); flicker(mid(L.candelabra, 940, FL - 10));
      }
    }

    T.director({ cast: { prin, frog, king, prince }, noFace: ['prin', 'frog', 'king', 'prince'] });
    const bounce = a => a.pos.animate([{ translate: '0 0' }, { translate: '0 -40px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity, easing: 'ease-in-out' });

    /* ===== 1. 성 뜰 (배움 놀이 1: 금공 모양 고르기 — 첫 조작) ===== */
    scene('fp_bg_yard_v2');
    put(T, prin, X(300, 420), FL, { look: 'ball', to: 'right' });
    put(T, ball, prin.x + BALL_UP[0], FL + BALL_UP[1] + 24);
    let bn = bounce(ball);
    const kinds = ['circle', 'square', 'triangle'].sort(() => Math.random() - .5), spots = X([470, 600, 730], [470, 560, 650]);
    const sh = {};
    kinds.forEach((k, i) => { sh[k] = shape(T, k, spots[i], FL - 36, 70); hitBox(T, sh[k], 100, 100); });
    put(T, ball, prin.x + BALL_UP[0], FL + BALL_UP[1] + 24);   // 금공은 맨 앞(손 위)
    bn.cancel(); bn = bounce(ball);
    if (P) camSnap(560, 280, 1);
    await T.curtain(true);
    await say(S.L0);
    await sleep(300);
    Object.values(sh).forEach(s => bob(s.pos));
    await T.ask(S.L1, () => T.choose(kinds.map(k => ({
      el: sh[k].hit, ok: k === 'circle',
      onWrong: async () => { await wiggleEl(T, sh[k].hit); await say(k === 'square' ? S.W_sq : S.W_tri); },
    })), { prompt: S.L1 }));
    glow(sh.circle, 1200); sparkleSfx(T); T.pop(sh.circle.x, FL - 150, tr('반짝!'));
    await say(S.C1);
    kinds.forEach(k => T.anim(sh[k].pos, [{ opacity: 1 }, { opacity: 0 }], 400).then(() => { sh[k].pos.style.display = 'none'; }));
    bn.cancel();
    for (let i = 0; i < 3; i++) {
      ball.hop(90, 700); boing(T, .3);
      if (i === 0) T.pop(prin.x + 120, FL - 300, tr('통통!'));
      await sleep(700);
    }
    prin.hop(10, 320);
    await say(S.L2);
    await sleep(SCENE_END);

    /* ===== 2. 샘가 (공이 높이 튀어 샘으로) ===== */
    await T.sceneCard(tr('샘가'), () => {
      scene('fp_bg_pond_v2');
      put(T, prin, X(380, 430), FL, { look: 'ball', to: 'right' });
      put(T, ball, prin.x + BALL_UP[0], FL + BALL_UP[1] + 24);
      bn = bounce(ball);
      camSnap(520, 280, 1);
    }, prin.pos);
    await sleep(LOOK);
    await say(S.L3);
    bn.cancel();
    for (let i = 0; i < 2; i++) {
      ball.hop(90, 700); boing(T, .3);
      if (i === 1) T.pop(prin.x + 120, FL - 300, tr('통통!'));
      await sleep(700);
    }
    const t2 = (async () => {
      sfx('swish', .3);
      ball.move(prin.x + 40, 60, 900, 'ease-out');
      await sleep(900);
      follow(POND.x - 60, 1100);
      await ball.move(POND.x, POND.surf - 24, 1100, 'ease-in');
      L.lily_pads.wiggle(3, 500);
      prin.look('stand'); await prin.wiggle(5, 500);
    })();
    await say(S.L4); await t2;
    await sleep(1800);
    await sleep(SCENE_END);

    /* ===== 3. 풍덩 (공이 가라앉고 공주가 운다) ===== */
    await T.sceneCard(tr('풍덩'), () => {
      scene('fp_bg_pond_v2');
      put(T, prin, X(380, 430), FL, { look: 'stand' });
      put(T, ball, POND.x, POND.surf - 24);
      camSnap(520, 280, 1);
    }, ball.pos);
    await sleep(LOOK);
    const t3 = (async () => {
      sfx('splash_big', .5); T.pop(POND.x, POND.surf - 130, tr('풍덩!'), '#1F2A56'); ripple(T, POND.x, POND.surf + 6);
      (async () => { await sleep(300); await L.lily_pads.hop(4, 500); await L.lily_pads.hop(4, 500); })();
      ball.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1400, fill: 'forwards' });
      await ball.move(POND.x, POND.surf + 90, 1400, 'ease-in');
      hide(ball); ball.pos.getAnimations().forEach(n => n.cancel()); ball.pos.style.opacity = '';
    })();
    await say(S.L5); await t3;
    prin.look('cry'); T.pop(prin.x - 90, FL - 270, tr('엉엉'), '#1F2A56');
    await say(S.L6);
    await sleep(SCENE_END);

    /* ===== 4. 개구리의 약속 ===== */
    await T.sceneCard(tr('개구리의 약속'), () => {
      scene('fp_bg_pond_v2');
      put(T, prin, X(380, 430), FL, { look: 'cry' });
      put(T, frog, POND.x - 60, POND.surf + 95, { look: 'sit' });
      waterClip(T, frog, POND.surf + 4);
      camSnap(520, 280, 1);
    }, prin.pos);
    await sleep(LOOK);
    const t4 = (async () => { L.lily_pads.hop(3, 400); sfx('bubbles', .4); T.pop(POND.x + 70, POND.surf - 90, tr('뽀글뽀글'), '#1F2A56'); await frog.move(POND.x - 60, POND.surf + 36, 900, 'ease-out'); })();
    await say(S.L7); await t4;
    frog.hop(6, 300); await say(S.L8);
    prin.look('stand'); await say(S.L9);
    frog.hop(6, 300); await say(S.L10);
    prin.hop(14, 360); await say(S.L11);
    await sleep(SCENE_END);

    /* ===== 5. 공을 찾았어요 ===== */
    await T.sceneCard(tr('공을 찾았어요'), () => {
      scene('fp_bg_pond_v2');
      put(T, prin, X(380, 430), FL, { look: 'stand' });
      put(T, frog, POND.x - 60, POND.surf + 36, { look: 'sit' });
      waterClip(T, frog, POND.surf + 4);
      camSnap(520, 280, 1);
    }, frog.pos);
    await sleep(LOOK);
    const t5 = (async () => {
      frog.move(POND.x - 60, POND.surf + 95, 500, 'ease-in'); sfx('splash', .4); T.pop(POND.x + 60, POND.surf - 110, tr('풍덩!'), '#1F2A56');
      await sleep(2600);
      frog.look('ball'); sfx('bubbles', .4);
      await frog.move(POND.x - 60, POND.surf + 10, 900, 'ease-out');
    })();
    await say(S.L12); await t5;
    prin.hop(14, 360); await say(S.L13);
    frog.look('sit');
    put(T, ball, frog.x, frog.y - 52);
    sfx('paper_up', .5);
    await ball.move(prin.x + BALL_RUN[0], FL + BALL_RUN[1] + 24, 700, 'ease-out');
    prin.look('run', 'left');
    ball.place(prin.x - BALL_RUN[0], FL + BALL_RUN[1] + 24);
    const t5b = (async () => {
      T.pop(prin.x + 110, FL - 250, tr('쌩!'));
      const mv = Promise.all([prin.move(-200, FL, 3600, 'ease-in'), ball.move(-200 - BALL_RUN[0], FL + BALL_RUN[1] + 24, 3600, 'ease-in')]);
      if (P) T.camTo(300, 280, 1, 1500);
      await walkFx(T, prin, mv, 'step_grass', 400, 6);
      hide(prin); hide(ball);
    })();
    await say(S.L14); await t5b;
    frog.wiggle(4, 500); await say(S.L15);
    await sleep(SCENE_END);

    /* ===== 6. 문 앞의 개구리 ===== */
    await T.sceneCard(tr('문 앞의 개구리'), () => {
      scene('fp_bg_dining_v2');
      put(T, table, 560, FL);
      put(T, prin, X(420, 420), FL, { look: 'stand', to: 'left' });
      hide(frog);
      camSnap(P ? 310 : 500, 280, 1);
    }, prin.pos);
    await sleep(LOOK);
    const t6 = (async () => {
      await sleep(2000);
      sfx('knock', .5); L.chandelier.wiggle(2, 600); await sleep(300); sfx('knock', .5);
      T.pop(DOOR.x + 40, 150, tr('똑똑!'), '#6B4A32');
    })();
    await say(S.L16); await t6;
    put(T, frog, -60, FL, { look: 'hop', to: 'right' });
    T.pop(DOOR.x - 20, FL - 130, tr('폴짝'));
    await hops(T, frog, DOOR.x + 60, 3, 420);
    frog.look('sit');
    frog.hop(8, 300); await say(S.L17);
    prin.look('refuse', 'left'); prin.move(prin.x + 40, FL, 500, 'ease-out');
    await say(S.L18);
    frog.wiggle(4, 500);
    await sleep(SCENE_END);

    /* ===== 7. 아버지의 말씀 ===== */
    await T.sceneCard(tr('아버지의 말씀'), () => {
      scene('fp_bg_dining_v2');
      put(T, table, 560, FL);
      put(T, frog, DOOR.x + 60, FL, { look: 'sit' });
      put(T, prin, X(460, 440), FL, { look: 'refuse', to: 'left' });
      put(T, king, 1100, FL, { look: 'stand', to: 'left' });
      camSnap(P ? 460 : 500, 280, 1);
    }, prin.pos);
    await sleep(LOOK);
    const t7 = walkFx(T, king, king.move(X(680, 640), FL, 3200, 'ease-out'), 'step_wood', 500, 4);
    follow(560, 3200);
    await say(S.L19); await t7;
    await say(S.L20);
    prin.look('sorry'); await say(S.L21);
    king.hop(6, 300); await say(S.L22);
    await say(S.L23);
    const t7b = (async () => {
      prin.look('stand');
      frog.look('hop', 'right');
      await hops(T, frog, 330, 2, 420);
      boing(T, .25);
      await arc(frog, 390, TABLE_TOP, 110, 600);
      frog.look('sit');
    })();
    await say(S.L24); await t7b;
    await sleep(SCENE_END);

    /* ===== 8. 같이 먹어요 (배움 놀이 2: 빵 세기) ===== */
    await T.sceneCard(tr('같이 먹어요'), () => {
      scene('fp_bg_dining_v2');
      const tx = X(500, 500);
      L.chandelier.place(tx, 150);
      put(T, table, tx, FL);
      put(T, plate, tx, TABLE_TOP + 8);
      breads.forEach((b, i) => put(T, b, tx + (i - 1) * 44, TABLE_TOP - 10));
      put(T, frog, tx - 170, TABLE_TOP, { look: 'sit' });
      put(T, prin, tx + 300, FL, { look: 'sit', to: 'left' });
      hitBox(T, plate, 200, 100);
      camSnap(500, 280, 1);
    }, plate.pos);
    await sleep(LOOK);
    await say(S.L25);
    bob(plate.pos);
    await T.ask(S.L26, () => T.tap(plate.hit, { prompt: S.L26 }));
    for (let i = 0; i < 3; i++) {
      if (AudioFX.countBeat) AudioFX.countBeat(i + 1);
      sfx('pop', .4); vo('n' + (i + 1)); glow(breads[i], 800); breads[i].hop(14, 360);
      await sleep(1500);
    }
    prin.hop(8, 300); await say(S.L27);
    await breads[0].move(frog.x + 6, TABLE_TOP - 34, 500, 'ease-in');
    sfx('chomp', .5); fadeOut(T, breads[0], 300); frog.hop(10, 320); T.pop(frog.x, TABLE_TOP - 150, tr('냠냠'));
    await sleep(400);
    await breads[1].move(prin.x - 60, FL - 150, 500, 'ease-in');
    sfx('chomp', .5); fadeOut(T, breads[1], 300); prin.hop(8, 300);
    frog.wiggle(4, 500); await say(S.L28);
    await sleep(SCENE_END);

    /* ===== 9. 베개 위로 폴짝 ===== */
    await T.sceneCard(tr('베개 위로 폴짝'), () => {
      scene('fp_bg_room_v2');
      put(T, pillow, BED.x, BED.top + 4);
      put(T, prin, X(360, 400), FL, { look: 'stand', to: 'right' });
      hide(frog);
      camSnap(520, 280, 1);
    }, prin.pos);
    await sleep(LOOK);
    const t9 = (async () => {
      put(T, frog, -60, FL, { look: 'hop', to: 'right' });
      await hops(T, frog, 480, 4, 420);
      frog.look('sit');
    })();
    await say(S.L29); await t9;
    frog.hop(6, 300); await say(S.L30);
    prin.look('throw', 'right'); await say(S.L31);
    const t9b = (async () => {
      sfx('swish', .5); T.pop(prin.x + 30, FL - 310, tr('휙!'));
      frog.look('fly', 'right');
      follow(BED.x - 80, 1100);
      await arc(frog, BED.x, BED.top - 62, 170, 1100);
      sfx('paper_down', .4); frog.look('surprise'); T.pop(BED.x, BED.top - 200, tr('포옥'), '#1F2A56');
      pillow.body.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.85)' }, { transform: 'scaleY(1)' }], { duration: 400 });
    })();
    await say(S.L32); await t9b;
    await sleep(500);
    sparkleSfx(T); T.pop(BED.x, BED.top - 240, tr('팡!'), GOLD);
    if (!P) T.camTo(BED.x - 80, 300, 1.12, 500);
    { const b = front(L.magic_burst, BED.x, BED.top - 100 + HT.fp_layer_magic_burst / 2); b.body.style.transformBox = 'fill-box'; b.body.style.transformOrigin = '50% 50%';
      b.body.animate([{ transform: 'scale(.2) rotate(0deg)', opacity: 1 }, { transform: 'scale(1.6) rotate(20deg)', opacity: 1, offset: .7 }, { transform: 'scale(1.6) rotate(20deg)', opacity: 0 }], { duration: 700, easing: 'ease-out' }).finished.then(() => hide(b), () => hide(b)); }
    flash(T, BED.x, BED.top - 100);
    await sleep(350);
    hide(frog);
    put(T, prince, BED.x - 40, FL, { look: 'stand' }); fadeIn(prince, 400); glow(prince, 1200);
    if (!P) T.camTo(500, 280, 1, 900);
    await say(S.L33);
    prin.look('stand'); prin.hop(14, 360); await say(S.L34);
    await sleep(SCENE_END);

    /* ===== 10. 약속을 지켜요 (톡 1 — 손잡기, 마지막 인사형 톡) ===== */
    await T.sceneCard(tr('약속을 지켜요'), () => {
      scene('fp_bg_yard_v2');
      mid(L.topiary, X(900, 760), FL - 10);
      front(L.flowerbed, X(960, 760), 585);
      [[L.garland, X(250, 420)], [L.garland2, X(750, 640)]].forEach(([g, x]) => { front(g, x, 92); g.body.animate([{ rotate: '-1.5deg' }, { rotate: '1.5deg' }, { rotate: '-1.5deg' }], { duration: 4000, iterations: Infinity, easing: 'ease-in-out' }); });
      put(T, ball, 510, FL + 2);
      put(T, prin, X(400, 440), FL, { look: 'stand', to: 'right' });
      put(T, prince, X(620, 620), FL, { look: 'stand', to: 'left' });
      camSnap(P ? 530 : 500, 280, 1);
    }, prin.pos);
    await sleep(LOOK);
    await say(S.L35);
    await say(S.L36);
    prin.look('hand', 'right'); prince.look('hand', 'left');
    await prince.move(prin.x + HAND_PRIN[0] + 22 + HAND_PRINCE[0], FL, 500, 'ease-out');
    const spot = tapSpot(T, prin.x + HAND_PRIN[0] + 11, FL + HAND_PRIN[1], 120, 120);
    bob(spot);
    await T.tap(spot);
    spot.remove();
    await prince.move(prince.x - 24, FL, 400, 'ease-out');
    sparkleSfx(T); T.pop(prin.x + HAND_PRIN[0] + 11, FL - 300, tr('반짝!'));
    for (let i = 0; i < 2; i++) await Promise.all([prin.hop(16, 360), prince.hop(16, 360)]);
    petals(T);
    await say(S.L37);
    const tb = (async () => {
      await ball.move(prince.x + 30, FL - 110, 600, 'ease-out'); boing(T, .3);
      await ball.move(prin.x - 30, FL - 110, 600, 'ease-in-out'); boing(T, .3);
      await ball.move(510, FL + 2, 600, 'ease-in');
    })();
    await say(S.L38); await tb;
    T.finale(); sfx('tada') || sparkleSfx(T);
    await sleep(2500);
    return '한 약속은 지켜요.';
  }

  Tale.mount({ title: '개구리 왕자', subtitle: '한 약속은 지켜요', run: T => run(Tale.api) });
})();
