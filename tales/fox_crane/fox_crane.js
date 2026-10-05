/* 여우와 두루미 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §15
   여우는 납작 접시에, 두루미는 목이 긴 병에 음식을 낸다 → 서로 못 먹는다 → 왜 그랬을까? → 입 모양에 맞는 그릇 고르기 → 함께 먹는 잔치.
   순화: 원작처럼 골탕으로 끝내지 않고, 마지막에 서로 사과하고 각자 맞는 그릇으로 함께 먹는다. */
(() => {
  const C = { cream: '#F6ECD8', gold: '#D9A94E', persimmon: '#E8703A', bean: '#A93B32', bark: '#6B4A32', pine: '#3F6B4F',
    indigo: '#1F2A56', lav: '#8B7BB8', snow: '#F4F6FA', amber: '#F2B366', leaf: '#6E9A5B', ink: '#2E241C', pink: '#E8A0A0',
    sky: '#F2DFA8', grass: '#7c9a58', dirt: '#d9b98a', fox2: '#C85A2A', wood: '#b98f4a', water: '#4f6f9a', wall: '#E9D9B5' };

  /* ---------- 작은 도우미 ---------- */
  const rotO = (n, x, y) => { n.style.transformBox = 'view-box'; n.style.transformOrigin = `${x}px ${y}px`; return n; };
  const hit = (T, g, x, y, w, h) => T.el('rect', { x, y, width: w, height: h, fill: 'transparent' }, g);
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  /* 실제 효과음 → 없으면 합성음 */
  const sfx = (T, name, fb, vol) => AudioFX.sfx(name, vol) || (fb ? fb() : (AudioFX[name] && AudioFX[name]()));
  const peckSnd = T => sfx(T, 'knock', () => T.tone([1800, 1400], .06, { type: 'square', vol: .14 }), .6);
  const lickSnd = T => { T.tone([500, 700], .1, { type: 'sine', vol: .18 }); T.tone([500, 750], .1, { type: 'sine', vol: .18, when: .16 }); };
  const sipSnd = T => { T.tone([900, 1300], .08, { type: 'sine', vol: .16 }); T.tone([900, 1400], .08, { type: 'sine', vol: .16, when: .14 }); };
  const bubbleSnd = T => T.tone([300 + Math.random() * 200, 700], .09, { type: 'sine', vol: .16 });
  const craneCall = T => { T.tone([700, 1000], .18, { type: 'triangle', vol: .14 }); T.tone([1000, 800], .2, { type: 'triangle', vol: .12, when: .2 }); };

  /* 머리(부리·주둥이) 끝이 target(월드 좌표)을 향하도록 돌리는 각도(로컬, deg) */
  function aim(a, pivot, tip, [tx, ty]) {
    const w = ([x, y]) => [a.x + a.flip * a.scale * x, a.y + a.scale * y];
    const [px, py] = w(pivot), [qx, qy] = w(tip);
    let d = (Math.atan2(ty - py, tx - px) - Math.atan2(qy - py, qx - px)) * 180 / Math.PI;
    while (d > 180) d -= 360; while (d < -180) d += 360;
    return d * a.flip;
  }

  /* ================= 페이퍼아트 그림 (assets/v3w/fc_*.webp) =================
     null이거나 파일을 못 불러오면 그 자리는 아래 임시 도형(그레이박스)으로 그린다. 새 그림이 나오면 여기 한 줄만 바꾸면 된다.
     배경은 장면마다 한 장을 무대에 꽉 채워 깐다. 분할 화면은 부엌·두루미 방 그림을 반씩 잘라 쓴다.
     - crane_head / crane_body: 서 있는 두루미를 목(머리 포함)과 몸통으로 나눈 것 (같은 캔버스). 목만 돌려서 부리로 콕·쪽쪽
     - fox_stuck: 코 낀 여우 그림 속 호리병을 지운 것 → 장면의 긴 병에 코를 넣는다
     - plate_empty + plate_soup: 납작 접시를 빈 접시와 국물 한 장으로 나눈 것 (핥핥 → 국물이 줄어든다)
     - cut_stuck: 다시 뽑은 그림(여우 코가 키 큰 병에 쏙 낌)
     - mouth_*: 입 모양 카드용 얼굴 (나비의 빨대 입은 그림에 없어서 코드로 덧그린다)
     - feast_table: 잔치 식탁(빨간 천, 손님 앞) · invite: 초대장 봉투 — 코드 도형을 대신하는 그림
     - 쓰지 않는 그림: crane_peck (고개를 바닥까지 숙인 자세 — 이 동화의 접시·병은 높이 있어서 목 돌리기로 대신) */
  const AS = '../../assets/';
  const BG = {
    forest: 'v3w/fc_bg_forest.webp', kitchen: 'v3w/fc_bg_kitchen.webp', high: 'v3w/fc_bg_high.webp', pondhouse: 'v3w/fc_bg_pondhouse.webp',
    crane_room: 'v3w/fc_bg_crane_room.webp', feast_day: 'v3w/fc_bg_feast_day.webp', feast_night: 'v3w/fc_bg_feast_night.webp',
  };
  const ART = {
    fox_stand: 'v3w/fc_fox_stand.webp', fox_lick: 'v3w/fc_fox_lick.webp', fox_sorry: 'v3w/fc_fox_sorry.webp', fox_stuck: 'v3w/fc_fox_stuck.webp',
    crane_head: 'v3w/fc_crane_head.webp', crane_body: 'v3w/fc_crane_body.webp', crane_sad: 'v3w/fc_crane_sad.webp', crane_sorry: 'v3w/fc_crane_sorry.webp',
    duck: 'v3w/fc_duck.webp', butterfly: 'v3w/fc_butterfly.webp', pot: 'v3w/fc_pot.webp',
    plate: 'v3w/fc_plate.webp', plate_empty: 'v3w/fc_plate_empty.webp', plate_soup: 'v3w/fc_plate_soup.webp',
    bottle: 'v3w/fc_bottle.webp', bowl: 'v3w/fc_bowl.webp', flower: 'v3w/fc_flower.webp',
    mouth_crane: 'v3w/fc_mouth_crane.webp', mouth_fox: 'v3w/fc_mouth_fox.webp', mouth_duck: 'v3w/fc_mouth_duck.webp', mouth_butterfly: 'v3w/fc_mouth_butterfly.webp',
    cut_peck: 'v3w/fc_cut_peck.webp', cut_lick: 'v3w/fc_cut_lick.webp', cut_stuck: 'v3w/fc_cut_stuck.webp', cut_sorry: 'v3w/fc_cut_sorry.webp',
    feast_table: 'v3w/fc_feast_table.webp', invite: 'v3w/fc_invite.webp',
  };
  const artOK = {}, bgOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  /* 그림 상자 [x, y, w, h] (발끝 0,0 기준, 무대 단위) — 같은 인물은 자세가 바뀌어도 머리·몸 크기가 같게 맞췄다 (변환 스크립트 conv_fc.py) */
  const BOX = {
    fox_stand: [-102, -168.5, 202.8, 168.5], fox_lick: [-106.2, -150, 205, 150.2], fox_sorry: [-84.5, -166, 176, 166], fox_stuck: [-67.1, -141.4, 122.6, 143.2],
    crane_head: [-76, -249.9, 149.4, 251.7], crane_body: [-76, -249.9, 149.4, 251.7], crane_sad: [-77.3, -209.9, 146.4, 212.4], crane_sorry: [-67.6, -216.8, 135.9, 221.3],
    duck: [-60.7, -129.4, 121.8, 130], butterfly: [-60, -129, 120, 86.2], pot: [-115.2, -219.2, 230, 219.5],
    plate: [-90, -64.1, 180, 64.1], plate_empty: [-90, -64.1, 180, 64.1], plate_soup: [-90, -64.1, 180, 64.1],
    bottle: [-45.1, -186, 90, 186], bowl: [-74.1, -98.3, 150, 98.2], flower: [-55.4, -135, 86.3, 135],
    invite: [-52, -68, 104, 104 * 143 / 220], feast_table: [30, 392, 940, 940 * 284 / 1200],
  };
  const FOX_ART_NOSE = [-101, -96.5], FOX_STUCK_NOSE = [-66.9, -93.2];
  const CRANE_ART_PIV = [-24.2, -143.3], CRANE_ART_TIP = [-76, -221];
  /* 그림 한 장: BOX 자리에. 바깥 g(그림자) 안에 그림 */
  function pic(T, g, key, { shadow = true, box } = {}) {
    const u = artUrl(key); if (!u) return null;
    const [x, y, w, h] = box || BOX[key];
    const wrap = T.el('g', shadow ? { filter: 'url(#pp)' } : {}, g);
    T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
    return wrap;
  }
  /* 배경 그림: 무대 1000×560을 덮고 가장자리를 조금 더 덮는다 (그림 비율 1760:992). 그림 밖(세로 화면에서 물러설 때)은 끝 색으로 */
  const BG_EDGE = { forest: ['#f2e6bf', '#a98e62'], kitchen: ['#5a3a20', '#3e2614'], high: ['#f3e3c4', '#6b4426'], pondhouse: ['#c9e2e6', '#6f8f4a'],
    crane_room: ['#4a3220', '#3e2a1a'], feast_day: ['#cfe3ea', '#5f7a3a'], feast_night: ['#13204a', '#2d3a22'] };
  function bgImage(T, key, { dx = 0, parent, clip } = {}) {
    const u = bgUrl(key); if (!u) return null;
    const w = 1080, h = w * 992 / 1760, x = -40 + dx, y = -24;
    const p = parent || T.bg;
    const [top, bot] = BG_EDGE[key] || ['#cfe3ee', '#77693f'];
    if (!parent) {
      T.el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, p);
      T.el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, p);
    }
    const im = T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, p);
    if (clip) im.setAttribute('clip-path', `url(#${clip})`);
    return im;
  }
  /* 기분 자세: 그림이면 자세 그림을 바꾸고, 그레이박스면 고개를 숙인다 */
  function mood(a, m) {
    if (a.parts.setPose) { a.parts.head.style.transform = ''; a.parts.setPose(a.key === 'fox' && m === 'sad' ? 'sorry' : (m || 'stand')); return; } // 여우는 시무룩 = 미안해 자세(앉아서 고개 숙임)
    a.parts.head.style.transform = m ? `rotate(${a.key === 'fox' ? (m === 'sorry' ? -18 : -15) : (m === 'sorry' ? -14 : (a.parts.sadDeg || -18))}deg)` : '';
  }
  const clampDeg = (d, m) => (m ? Math.max(-m, Math.min(m, d)) : d);
  const aimP = (a, target) => clampDeg(aim(a, a.parts.PIV, a.parts.TIP, target), a.parts.maxDeg);

  /* ================= 인물 (모두 왼쪽을 보고 선다, 발끝 0,0) ================= */
  const FOX_PIV = [-40, -75], FOX_TIP = [-132, -94];
  function drawFoxArt(T, g) {
    const { el } = T;
    const all = rotO(el('g', {}, g), ...FOX_ART_NOSE);
    const head = rotO(el('g', {}, all), -30, 0); // 몸 전체가 앞발을 축으로 살짝 숙인다
    const poses = {};
    ['fox_stand', 'fox_lick', 'fox_sorry'].forEach(k => { poses[k.slice(4)] = pic(T, head, k); });
    const legs = rotO(el('g', {}, head), ...FOX_STUCK_NOSE); // 코 낀 자세: 코를 축으로 대롱대롱
    poses.stuck = pic(T, legs, 'fox_stuck');
    const setPose = n => Object.entries(poses).forEach(([k, p]) => { if (p) p.style.display = k === (poses[n] ? n : 'stand') ? '' : 'none'; });
    setPose('stand');
    hit(T, head, -110, -170, 215, 170);
    const tail = el('g', {}, g);
    const flag = n => ({ setAttribute: (k, v) => { if (k === 'opacity') setPose(+v ? n : 'stand'); } });
    return { all, head, legs, tail, tongue: flag('lick'), blush: flag('sorry'), setPose, art: true,
      PIV: [-30, 0], TIP: FOX_ART_NOSE, maxDeg: 22, kick: 6 };
  }
  function drawFox(T, g) {
    if (artUrl('fox_stand')) return drawFoxArt(T, g);
    const { el, paper } = T;
    const all = rotO(el('g', {}, g), -130, -94);
    const tail = rotO(el('g', {}, all), 38, -60);
    paper(tail, [
      ['path', { d: 'M36 -52 Q104 -46 118 -104 Q124 -134 100 -146 Q92 -96 34 -76 Z', fill: C.persimmon }],
      ['path', { d: 'M100 -146 Q124 -134 118 -104 Q108 -120 92 -124 Z', fill: C.cream }],
    ]);
    const legs = rotO(el('g', {}, all), 0, -44);
    paper(legs, [-40, -18, 12, 34].map(x => ['rect', { x, y: -42, width: 13, height: 42, rx: 6, fill: C.fox2 }]));
    paper(legs, [-40, -18, 12, 34].map(x => ['rect', { x: x - 1, y: -9, width: 15, height: 9, rx: 4, fill: C.ink }]));
    paper(all, [['ellipse', { cx: 0, cy: -58, rx: 56, ry: 30, fill: C.persimmon }], ['ellipse', { cx: -24, cy: -50, rx: 26, ry: 15, fill: C.cream }]]);
    const head = rotO(el('g', {}, all), ...FOX_PIV);
    paper(head, [
      ['path', { d: 'M-80 -116 L-74 -164 L-50 -126 Z', fill: C.persimmon }],
      ['path', { d: 'M-50 -124 L-34 -166 L-20 -118 Z', fill: C.persimmon }],
      ['path', { d: 'M-74 -124 L-72 -150 L-60 -128 Z', fill: C.ink }],
      ['path', { d: 'M-44 -126 L-35 -152 L-28 -122 Z', fill: C.ink }],
      ['circle', { cx: -55, cy: -100, r: 33, fill: C.persimmon }],
      ['path', { d: 'M-74 -114 L-132 -94 L-74 -76 Z', fill: C.persimmon }],
      ['path', { d: 'M-90 -90 L-132 -94 L-82 -78 Q-60 -68 -38 -84 Z', fill: C.cream }],
    ]);
    const tongue = el('ellipse', { cx: -116, cy: -80, rx: 12, ry: 6, fill: C.pink, opacity: 0 }, head);
    el('circle', { cx: -131, cy: -94, r: 7, fill: C.ink }, head);
    el('circle', { cx: -64, cy: -106, r: 5, fill: C.ink }, head);
    const blush = el('g', { opacity: 0 }, head);
    el('ellipse', { cx: -60, cy: -86, rx: 10, ry: 5, fill: C.pink }, blush);
    hit(T, g, -140, -170, 270, 170);
    return { all, head, tongue, legs, tail, blush, PIV: FOX_PIV, TIP: FOX_TIP };
  }
  const CRANE_PIV = [-25, -135], CRANE_TIP = [-112, -220];
  function drawCraneArt(T, g) {
    const { el } = T;
    const all = el('g', {}, g);
    const stand = el('g', {}, all);
    const head = rotO(el('g', {}, stand), ...CRANE_ART_PIV); // 목(머리 포함)만 돈다. 몸통이 위에 덮여 목 뿌리를 가린다
    pic(T, head, 'crane_head');
    hit(T, head, -82, -254, 100, 120);
    const body = pic(T, stand, 'crane_body');
    const poses = { stand, sad: pic(T, all, 'crane_sad'), sorry: pic(T, all, 'crane_sorry') };
    [body, poses.sad, poses.sorry].forEach(p => p && (p.style.pointerEvents = 'none')); // 몸통 그림이 위에서 머리·부리 터치를 가로채지 않게
    const setPose = n => Object.entries(poses).forEach(([k, p]) => { if (p) p.style.display = k === (poses[n] ? n : 'stand') ? '' : 'none'; });
    setPose('stand');
    return { all, head, setPose, art: true, PIV: CRANE_ART_PIV, TIP: CRANE_ART_TIP };
  }
  function drawCrane(T, g) {
    if (artUrl('crane_head') && artUrl('crane_body')) return drawCraneArt(T, g);
    const { el, paper } = T;
    const all = el('g', {}, g);
    paper(all, [['path', { d: 'M-8 -106 V0 M-22 0 H4 M14 -106 V0 M2 0 H28', stroke: C.ink, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }]]);
    paper(all, [
      ['path', { d: 'M46 -142 Q102 -140 108 -94 Q86 -110 48 -110 Z', fill: C.ink }],
      ['ellipse', { cx: 12, cy: -126, rx: 54, ry: 30, fill: C.snow }],
      ['path', { d: 'M-12 -130 Q30 -150 62 -124', stroke: '#c9ccd4', 'stroke-width': 4, fill: 'none' }],
    ]);
    const head = rotO(el('g', {}, all), ...CRANE_PIV);
    paper(head, [
      ['path', { d: 'M-25 -135 Q-44 -180 -30 -220', stroke: C.ink, 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' }],
      ['circle', { cx: -30, cy: -226, r: 17, fill: C.snow }],
      ['circle', { cx: -27, cy: -240, r: 8, fill: C.bean }],
      ['path', { d: 'M-44 -232 L-114 -220 L-44 -217 Z', fill: C.gold }],
    ]);
    el('circle', { cx: -36, cy: -229, r: 3.5, fill: C.ink }, head);
    hit(T, head, -120, -250, 110, 120);
    return { all, head, PIV: CRANE_PIV, TIP: CRANE_TIP };
  }
  function drawDuck(T, g) {
    const { el, paper } = T;
    if (artUrl('duck')) { // 그림: 몸 전체가 발끝 앞쪽을 축으로 꾸벅 (부리로 떠먹기)
      const head = rotO(el('g', {}, g), -30, 0);
      pic(T, head, 'duck'); hit(T, head, -62, -130, 124, 130);
      return { head, nod: 14 };
    }
    paper(g, [
      ['rect', { x: -14, y: -14, width: 9, height: 14, fill: C.persimmon }], ['rect', { x: 8, y: -14, width: 9, height: 14, fill: C.persimmon }],
      ['path', { d: 'M40 -62 L74 -78 L62 -44 Z', fill: C.snow }],
      ['ellipse', { cx: 6, cy: -46, rx: 52, ry: 34, fill: C.snow }],
      ['path', { d: 'M-4 -54 Q26 -68 44 -42 Q14 -30 -4 -54 Z', fill: '#dfe3ea' }],
      ['circle', { cx: -30, cy: -98, r: 28, fill: C.snow }],
    ]);
    const head = rotO(el('g', {}, g), -20, -80);
    paper(head, [['path', { d: 'M-50 -104 Q-104 -108 -108 -92 Q-104 -78 -50 -86 Z', fill: C.persimmon }]]);
    el('circle', { cx: -36, cy: -106, r: 4.5, fill: C.ink }, head);
    hit(T, g, -110, -130, 190, 130);
    return { head };
  }
  function drawButterfly(T, g) {
    const { el, paper } = T;
    if (artUrl('butterfly')) { // 그림: 종이 나비 전체가 날갯짓 (가운데 몸통 축으로 좌우 접힘)
      const wings = rotO(el('g', {}, g), 0, -88);
      pic(T, wings, 'butterfly');
      wings.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.68)' }, { transform: 'scaleX(1)' }], { duration: 560, iterations: Infinity });
      hit(T, g, -60, -140, 120, 100);
      return { wings };
    }
    const wings = rotO(el('g', {}, g), 0, -88);
    paper(wings, [
      ['ellipse', { cx: -26, cy: -108, rx: 28, ry: 32, fill: C.persimmon, transform: 'rotate(-20 -26 -108)' }],
      ['ellipse', { cx: 26, cy: -108, rx: 28, ry: 32, fill: C.persimmon, transform: 'rotate(20 26 -108)' }],
      ['ellipse', { cx: -22, cy: -66, rx: 19, ry: 17, fill: C.gold }],
      ['ellipse', { cx: 22, cy: -66, rx: 19, ry: 17, fill: C.gold }],
    ]);
    [[-28, -112], [28, -112], [-22, -66], [22, -66]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 6, fill: C.cream }, wings));
    paper(g, [['ellipse', { cx: 0, cy: -86, rx: 7, ry: 30, fill: C.ink }], ['circle', { cx: 0, cy: -120, r: 10, fill: C.ink }]]);
    el('path', { d: 'M-4 -128 Q-14 -150 -22 -150 M4 -128 Q14 -150 22 -150', stroke: C.ink, 'stroke-width': 3, fill: 'none' }, g);
    el('path', { d: 'M-6 -114 Q-24 -114 -26 -100 Q-26 -88 -16 -88 Q-8 -88 -10 -96', stroke: C.bark, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' }, g);
    wings.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.55)' }, { transform: 'scaleX(1)' }], { duration: 520, iterations: Infinity });
    hit(T, g, -60, -155, 120, 120);
    return { wings };
  }
  const GUESTS = {
    crane: { name: '두루미', draw: drawCrane, scale: 1.05 },
    fox: { name: '여우', draw: drawFox, scale: 1.05 },
    duck: { name: '오리', draw: drawDuck, scale: 1.25 },
    butterfly: { name: '나비', draw: drawButterfly, scale: 1.3 },
  };
  function guest(T, parent, key, x, y, scale) {
    let parts;
    const a = T.actor(parent, x, y, g => { parts = GUESTS[key].draw(T, g); }, { scale: scale || GUESTS[key].scale });
    a.parts = parts; a.key = key; return a;
  }

  /* ================= 그릇·소품 (발끝 0,0) ================= */
  const dishArt = (T, g, k, [x, y, w, h]) => { if (!pic(T, g, k)) return false; hit(T, g, x, y, w, h); return true; };
  const DISH = {
    plate: { name: '납작 접시', top: -12, draw(T, g) {
      if (dishArt(T, g, 'plate', [-95, -80, 190, 90])) return;
      T.paper(g, [['ellipse', { cx: 0, cy: -10, rx: 90, ry: 14, fill: C.cream, stroke: C.gold, 'stroke-width': 4 }], ['ellipse', { cx: 0, cy: -12, rx: 66, ry: 7, fill: C.amber }]]);
      hit(T, g, -95, -80, 190, 90);
    } },
    bottle: { name: '긴 병', top: -184, draw(T, g) {
      if (dishArt(T, g, 'bottle', [-50, -190, 100, 190])) return;
      T.paper(g, [
        ['ellipse', { cx: 0, cy: -40, rx: 40, ry: 40, fill: C.pine }], ['circle', { cx: 0, cy: -96, r: 24, fill: C.pine }],
        ['rect', { x: -8, y: -178, width: 16, height: 66, fill: C.pine }], ['rect', { x: -13, y: -186, width: 26, height: 9, rx: 3, fill: C.gold }],
        ['rect', { x: -11, y: -124, width: 22, height: 7, rx: 3, fill: C.bean }],
      ]);
      T.el('path', { d: 'M-24 -56 Q-28 -32 -14 -14', stroke: C.leaf, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
      hit(T, g, -50, -190, 100, 190);
    } },
    bowl: { name: '넓은 그릇', top: -50, draw(T, g) {
      if (dishArt(T, g, 'bowl', [-80, -100, 160, 100])) return;
      T.paper(g, [
        ['path', { d: 'M-74 -54 Q-70 0 0 0 Q70 0 74 -54 Z', fill: C.bean }],
        ['ellipse', { cx: 0, cy: -54, rx: 74, ry: 12, fill: '#7d2b25' }], ['ellipse', { cx: 0, cy: -52, rx: 64, ry: 8, fill: C.leaf }],
        ['path', { d: 'M-66 -30 Q0 -14 66 -30', stroke: C.gold, 'stroke-width': 4, fill: 'none' }],
      ]);
      hit(T, g, -80, -100, 160, 100);
    } },
    flower: { name: '꽃', top: -112, draw(T, g) {
      if (dishArt(T, g, 'flower', [-50, -150, 100, 150])) return;
      T.paper(g, [
        ['path', { d: 'M0 0 Q-6 -50 0 -98', stroke: C.pine, 'stroke-width': 7, fill: 'none' }],
        ['ellipse', { cx: -16, cy: -40, rx: 16, ry: 7, fill: C.leaf, transform: 'rotate(-30 -16 -40)' }],
        ['ellipse', { cx: 16, cy: -58, rx: 16, ry: 7, fill: C.leaf, transform: 'rotate(30 16 -58)' }],
        ...[0, 72, 144, 216, 288].map(d => ['circle', { cx: Math.cos(d * Math.PI / 180) * 19, cy: -112 + Math.sin(d * Math.PI / 180) * 19, r: 17, fill: C.persimmon }]),
        ['circle', { cx: 0, cy: -112, r: 12, fill: C.gold }],
      ]);
      hit(T, g, -45, -150, 90, 150);
    } },
  };
  function dish(T, parent, key, x, y, scale = 1) {
    const a = T.actor(parent, x, y, g => DISH[key].draw(T, g), { scale });
    a.key = key; return a;
  }
  function drawPot(T, g) {
    const { el, paper } = T;
    if (artUrl('pot')) { // 그림: 국자는 그림 안에 있다 → 젓기는 냄비 전체가 살짝 흔들린다. 거품은 국물 위(-130)에서 오른다
      const spoon = rotO(el('g', {}, g), 0, 0);
      pic(T, spoon, 'pot');
      const bubbles = el('g', { transform: 'translate(0,-4)' }, g);
      hit(T, g, -115, -220, 230, 220);
      return { spoon, bubbles, stir: 3 };
    }
    paper(g, [['path', { d: 'M-66 0 Q-56 -34 -34 -12 Q-22 -44 0 -14 Q22 -48 34 -12 Q56 -34 66 0 Z', fill: C.amber }]]);
    const spoon = rotO(el('g', {}, g), 0, -120);
    paper(spoon, [['rect', { x: -7, y: -236, width: 14, height: 124, rx: 7, fill: C.bark }], ['ellipse', { cx: 0, cy: -118, rx: 16, ry: 8, fill: C.bark }]]);
    paper(g, [
      ['path', { d: 'M-90 -112 Q-98 -22 -60 -18 H60 Q98 -22 90 -112 Z', fill: '#3a2a22' }],
      ['rect', { x: -102, y: -126, width: 204, height: 16, rx: 8, fill: C.ink }],
      ['ellipse', { cx: 0, cy: -122, rx: 84, ry: 6, fill: C.amber }],
    ]);
    const bubbles = el('g', {}, g);
    hit(T, g, -110, -240, 220, 240);
    return { spoon, bubbles };
  }
  function drawInvite(T, g) {
    if (!pic(T, g, 'invite')) T.paper(g, [
      ['rect', { x: -44, y: -60, width: 88, height: 60, rx: 5, fill: C.cream, stroke: C.gold, 'stroke-width': 3 }],
      ['path', { d: 'M-44 -60 L0 -26 L44 -60', stroke: C.gold, 'stroke-width': 3, fill: 'none' }],
      ['circle', { cx: 0, cy: -26, r: 9, fill: C.bean }],
    ]);
    hit(T, g, -55, -70, 110, 80);
  }
  function lantern(T, parent, x, y) {
    const { el, paper } = T;
    el('line', { x1: x, y1: -20, x2: x, y2: y - 30, stroke: C.bark, 'stroke-width': 3 }, parent);
    const glow = el('circle', { cx: x, cy: y, r: 62, fill: C.amber, opacity: .22 }, parent);
    glow.animate([{ opacity: .14 }, { opacity: .32 }, { opacity: .14 }], { duration: 1800 + Math.random() * 800, iterations: Infinity });
    paper(parent, [
      ['ellipse', { cx: x, cy: y, rx: 26, ry: 32, fill: C.amber }],
      ['rect', { x: x - 16, y: y - 38, width: 32, height: 9, rx: 3, fill: C.bean }], ['rect', { x: x - 16, y: y + 29, width: 32, height: 9, rx: 3, fill: C.bean }],
      ['path', { d: `M${x} ${y + 38} V${y + 60}`, stroke: C.bean, 'stroke-width': 4 }],
    ]);
  }

  /* ================= 배경 (장면마다 통판 1장) ================= */
  const sky = (T, fill) => T.el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill }, T.bg);
  function forestBG(T) {
    if (bgImage(T, 'forest')) return;
    const { el, paper } = T, b = T.bg;
    sky(T, C.sky);
    el('circle', { cx: 840, cy: 90, r: 44, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 330 Q200 230 500 300 Q800 220 1200 310 V600 H-200 Z', fill: '#b9a25a' }]]);
    for (let i = 0; i < 9; i++) {
      const x = -30 + i * 130 + (i % 2) * 30, s = 1 + (i % 3) * .18;
      paper(b, [
        ['rect', { x: x - 9, y: 420 - 60 * s, width: 18, height: 60 * s, fill: C.bark }],
        ['path', { d: `M${x - 60 * s} ${420 - 50 * s} L${x} ${420 - 190 * s} L${x + 60 * s} ${420 - 50 * s} Z`, fill: i % 2 ? C.pine : C.leaf }],
      ]);
    }
    paper(b, [['rect', { x: -200, y: 420, width: 1400, height: 400, fill: C.grass }]]);
    paper(b, [['ellipse', { cx: 500, cy: 492, rx: 620, ry: 42, fill: C.dirt }]]);
    [[80, 450], [930, 455], [160, 540], [860, 545]].forEach(([x, y]) => paper(b, [['circle', { cx: x, cy: y, r: 9, fill: C.persimmon }], ['circle', { cx: x, cy: y, r: 4, fill: C.gold }]]));
  }
  function kitchenBG(T) {
    if (bgImage(T, 'kitchen')) return;
    const { el, paper } = T, b = T.bg;
    sky(T, '#3a2519');
    paper(b, [['path', { d: 'M40 600 V210 Q40 30 500 30 Q960 30 960 210 V600 Z', fill: '#8a6344' }]]);
    el('circle', { cx: 790, cy: 170, r: 62, fill: C.sky }, b);
    el('circle', { cx: 790, cy: 170, r: 62, fill: 'none', stroke: C.bark, 'stroke-width': 10 }, b);
    el('path', { d: 'M728 170 H852 M790 108 V232', stroke: C.bark, 'stroke-width': 6 }, b);
    paper(b, [['rect', { x: 110, y: 190, width: 250, height: 12, fill: C.bark }]]);
    [[140, C.gold, 30], [190, C.bean, 40], [250, C.cream, 34], [310, C.pine, 44]].forEach(([x, f, h]) => paper(b, [['rect', { x: x - 16, y: 190 - h, width: 32, height: h, rx: 8, fill: f }]]));
    [[190, 70], [230, 60], [270, 76]].forEach(([x, h]) => paper(b, [['path', { d: `M${x} 40 V${40 + h}`, stroke: C.leaf, 'stroke-width': 10, 'stroke-linecap': 'round' }]]));
    paper(b, [['rect', { x: -200, y: 470, width: 1400, height: 300, fill: C.bark }]]);
  }
  function highBG(T) {
    if (bgImage(T, 'high')) return;
    const { el, paper } = T, b = T.bg;
    sky(T, C.wood);
    for (let i = -2; i < 14; i++) el('path', { d: `M${i * 90} -20 L${i * 90 + 60} 600`, stroke: '#a67c3d', 'stroke-width': 5 }, b);
    paper(b, [['ellipse', { cx: 500, cy: 440, rx: 440, ry: 160, fill: C.bean }], ['ellipse', { cx: 500, cy: 440, rx: 410, ry: 140, fill: 'none', stroke: C.gold, 'stroke-width': 6 }]]);
  }
  /* 그림: 탁자는 배경(부감 마루)에 있다 → 탁자 위에 빈 접시 + 국물 한 장 */
  const HIGH_PLATE = [505, 288, 1.35];
  function highTable(T, parent) {
    const { el, paper } = T;
    if (bgUrl('high') && artUrl('plate_empty') && artUrl('plate_soup')) {
      const [x, y, s] = HIGH_PLATE;
      const g = el('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
      pic(T, g, 'plate_empty');
      const soup = rotO(el('g', {}, g), 0, -34);
      pic(T, soup, 'plate_soup', { shadow: false });
      return { soup };
    }
    const g = el('g', {}, parent);
    paper(g, [['ellipse', { cx: 500, cy: 470, rx: 250, ry: 92, fill: '#8a6344' }], ['ellipse', { cx: 500, cy: 456, rx: 250, ry: 92, fill: '#C9A26A' }]]);
    paper(g, [['ellipse', { cx: 500, cy: 450, rx: 150, ry: 45, fill: C.cream, stroke: C.gold, 'stroke-width': 5 }]]);
    const soup = el('ellipse', { cx: 500, cy: 450, rx: 118, ry: 32, fill: C.amber }, g);
    rotO(soup, 500, 450);
    return { soup };
  }
  function pondHouseBG(T) {
    if (bgImage(T, 'pondhouse')) return;
    const { el, paper } = T, b = T.bg;
    sky(T, C.sky);
    el('circle', { cx: 150, cy: 90, r: 40, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 320 Q250 250 520 300 Q780 240 1200 300 V600 H-200 Z', fill: '#b9a25a' }]]);
    paper(b, [['rect', { x: -200, y: 420, width: 1400, height: 400, fill: C.grass }]]);
    paper(b, [['ellipse', { cx: 230, cy: 446, rx: 260, ry: 28, fill: C.water }], ['ellipse', { cx: 230, cy: 446, rx: 220, ry: 18, fill: C.lav }]]);
    for (let i = 0; i < 7; i++) {
      const x = 470 + i * 14;
      paper(b, [['path', { d: `M${x} 480 Q${x - 4} 420 ${x + 2} ${380 - (i % 3) * 20}`, stroke: C.pine, 'stroke-width': 5, fill: 'none' }], ['ellipse', { cx: x + 2, cy: 392 - (i % 3) * 20, rx: 5, ry: 14, fill: C.bark }]]);
    }
    paper(b, [
      ['rect', { x: 740, y: 300, width: 210, height: 160, fill: C.cream }],
      ['path', { d: 'M710 310 Q845 190 980 310 Z', fill: C.gold }],
      ['rect', { x: 820, y: 360, width: 56, height: 100, rx: 26, fill: C.bark }],
      ['circle', { cx: 775, cy: 360, r: 18, fill: C.sky, stroke: C.bark, 'stroke-width': 5 }],
    ]);
  }
  function lowBG(T) {
    if (bgImage(T, 'crane_room')) return;
    const { el, paper } = T, b = T.bg;
    sky(T, C.wall);
    paper(b, [['path', { d: 'M-200 -200 H1200 V150 H-200 Z', fill: '#C9A26A' }]]);
    for (let i = -4; i <= 4; i++) el('path', { d: `M${500 + i * 150} 150 L${500 + i * 70} -40`, stroke: C.bark, 'stroke-width': 16 }, b);
    el('rect', { x: -200, y: 140, width: 1400, height: 14, fill: C.bark }, b);
    paper(b, [['rect', { x: 110, y: 200, width: 170, height: 150, rx: 10, fill: C.sky }]]);
    el('ellipse', { cx: 195, cy: 330, rx: 70, ry: 14, fill: C.water }, b);
    el('path', { d: 'M110 275 H280 M195 200 V350', stroke: C.bark, 'stroke-width': 7 }, b);
    el('rect', { x: 110, y: 200, width: 170, height: 150, rx: 10, fill: 'none', stroke: C.bark, 'stroke-width': 10 }, b);
    paper(b, [['rect', { x: -200, y: 500, width: 1400, height: 300, fill: '#8a6344' }]]);
  }
  function lowTable(T, parent) {
    if (bgUrl('crane_room')) return; // 그림: 작은 탁자는 배경에 있다
    T.paper(parent, [
      ['rect', { x: 480, y: 440, width: 14, height: 62, fill: C.bark }], ['rect', { x: 626, y: 440, width: 14, height: 62, fill: C.bark }],
      ['rect', { x: 450, y: 424, width: 220, height: 20, rx: 8, fill: '#C9A26A' }],
    ]);
  }
  function splitBG(T) {
    const { el, paper } = T, b = T.bg;
    if (bgUrl('kitchen') && bgUrl('crane_room')) { // 그림: 왼쪽 = 여우 부엌(창문 쪽), 오른쪽 = 두루미 방(창문 쪽) — 부엌의 냄비·방의 탁자는 잘려 나간다
      sky(T, '#3e2614');
      const cl = el('clipPath', { id: 'fcSplitL' }, b); el('rect', { x: -1400, y: -1400, width: 1900, height: 3000 }, cl);
      const cr = el('clipPath', { id: 'fcSplitR' }, b); el('rect', { x: 500, y: -1400, width: 1900, height: 3000 }, cr);
      bgImage(T, 'kitchen', { dx: -400, parent: b, clip: 'fcSplitL' });
      bgImage(T, 'crane_room', { dx: 500, parent: b, clip: 'fcSplitR' });
      el('rect', { x: 488, y: -200, width: 24, height: 1000, fill: C.cream }, b);
      el('path', { d: 'M488 -200 V800 M512 -200 V800', stroke: C.gold, 'stroke-width': 5 }, b);
      return;
    }
    sky(T, C.cream);
    paper(b, [['rect', { x: -200, y: -200, width: 620, height: 1000, fill: '#8a6344' }], ['rect', { x: -200, y: 480, width: 620, height: 300, fill: C.bark }]]);
    paper(b, [['rect', { x: 580, y: -200, width: 620, height: 1000, fill: C.wall }], ['rect', { x: 580, y: 480, width: 620, height: 300, fill: C.wood }]]);
    el('circle', { cx: 120, cy: 110, r: 40, fill: C.sky, stroke: C.ink, 'stroke-width': 6 }, b);
    el('rect', { x: 860, y: 70, width: 90, height: 80, rx: 8, fill: C.sky, stroke: C.bark, 'stroke-width': 6 }, b);
    el('rect', { x: 420, y: -200, width: 160, height: 1000, fill: C.cream }, b);
    el('path', { d: 'M420 -200 V800 M580 -200 V800', stroke: C.gold, 'stroke-width': 8 }, b);
  }
  function feastBG(T, night) {
    if (bgImage(T, night ? 'feast_night' : 'feast_day')) return true; // 밤 그림에는 등불이 그려져 있다
    const { el, paper } = T, b = T.bg;
    sky(T, night ? C.indigo : C.sky);
    if (night) {
      el('circle', { cx: 880, cy: 70, r: 34, fill: C.cream }, b);
      [[90, 60], [260, 40], [520, 30], [700, 55], [960, 150]].forEach(([x, y]) => el('circle', { cx: x, cy: y, r: 3.5, fill: C.cream }, b));
    } else el('circle', { cx: 860, cy: 80, r: 40, fill: '#F6D98A' }, b);
    paper(b, [['path', { d: 'M-200 300 Q200 220 520 280 Q800 220 1200 290 V600 H-200 Z', fill: night ? '#2a355f' : '#b9a25a' }]]);
    paper(b, [['rect', { x: -200, y: 380, width: 1400, height: 400, fill: night ? '#2f4a3a' : C.grass }]]);
    if (!night) {
      el('path', { d: 'M-20 60 Q500 140 1020 60', stroke: C.bark, 'stroke-width': 3, fill: 'none' }, b);
      for (let i = 0; i < 12; i++) {
        const x = 20 + i * 84, y = 60 + Math.sin((i + .5) / 12 * Math.PI) * 60;
        paper(b, [['path', { d: `M${x - 22} ${y - 6} L${x + 22} ${y - 6} L${x} ${y + 34} Z`, fill: [C.bean, C.gold, C.pine][i % 3] }]]);
      }
    }
  }
  function feastTable(T, parent) {
    if (pic(T, parent, 'feast_table')) return; // 그림: 빨간 천 식탁, 손님 발을 가린다
    T.paper(parent, [
      ['rect', { x: 30, y: 394, width: 940, height: 20, rx: 6, fill: C.wall }],
      ['rect', { x: 40, y: 412, width: 920, height: 96, fill: C.bean }],
      ['path', { d: 'M40 426 H960', stroke: C.gold, 'stroke-width': 6 }],
    ]);
  }

  /* 화면 고정 동그라미 카드 (카메라 영향 없음) — 골라요 배지, 입 모양 확대 카드 */
  function badge(T, x, y, drawIcon, r = 70, magnifier = false) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, document.getElementById('stage'));
    if (magnifier) T.paper(g, [['rect', { x: r * .62, y: r * .62, width: 22, height: 70, rx: 10, fill: C.bark, transform: `rotate(-45 ${r * .62} ${r * .62})` }]]);
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    drawIcon(g);
    g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
    return g;
  }
  const ICON = {
    plate: (T, g) => pic(T, g, 'plate', { box: [-58, -12, 116, 41.3] }) || T.paper(g, [['ellipse', { cx: 0, cy: 8, rx: 52, ry: 11, fill: C.cream, stroke: C.gold, 'stroke-width': 3 }], ['ellipse', { cx: 0, cy: 6, rx: 38, ry: 5, fill: C.amber }]]),
    bottle: (T, g) => { const s = T.el('g', { transform: 'translate(0,50) scale(.55)' }, g); DISH.bottle.draw(T, s); },
  };
  /* 입 모양 카드: 그림이면 얼굴 그림을 동그랗게 오려 넣는다 (나비 빨대 입은 그림에 없어서 코드로 덧그린다) */
  let clipN = 0;
  function mouthArt(T, g, k) {
    const u = artUrl('mouth_' + k); if (!u) return false;
    const id = 'fcMouthClip' + (++clipN);
    const cp = T.el('clipPath', { id }, g); T.el('circle', { r: 76 }, cp);
    const im = T.el('image', { href: u, x: -76, y: -76, width: 152, height: 152, preserveAspectRatio: 'none' }, g);
    im.setAttribute('clip-path', `url(#${id})`);
    if (k === 'butterfly') [[C.cream, 11], [C.ink, 5]].forEach(([c, w]) => T.el('path', { d: 'M2 28 Q4 54 22 58 Q40 60 40 44 Q40 30 26 34', stroke: c, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, g));
    return true;
  }
  const MOUTH_GB = {
    crane: (T, g) => T.paper(g, [['circle', { cx: 34, cy: -6, r: 24, fill: C.snow }], ['circle', { cx: 38, cy: -26, r: 10, fill: C.bean }],
      ['path', { d: 'M16 -14 L-62 2 L16 6 Z', fill: C.gold }], ['circle', { cx: 28, cy: -8, r: 4, fill: C.ink }], ['path', { d: 'M40 16 Q44 40 36 60', stroke: C.ink, 'stroke-width': 14, fill: 'none' }]]),
    fox: (T, g) => T.paper(g, [['circle', { cx: 26, cy: -8, r: 36, fill: C.persimmon }], ['path', { d: 'M4 -26 L-48 -4 L4 16 Z', fill: C.persimmon }],
      ['circle', { cx: -46, cy: -4, r: 7, fill: C.ink }], ['circle', { cx: 18, cy: -18, r: 5, fill: C.ink }], ['ellipse', { cx: -24, cy: 18, rx: 20, ry: 10, fill: C.pink }]]),
    duck: (T, g) => T.paper(g, [['circle', { cx: 30, cy: -12, r: 30, fill: C.snow }], ['path', { d: 'M14 -20 Q-56 -26 -60 -4 Q-56 18 14 8 Z', fill: C.persimmon }], ['circle', { cx: 26, cy: -22, r: 5, fill: C.ink }]]),
    butterfly: (T, g) => T.paper(g, [['circle', { cx: 24, cy: -36, r: 18, fill: C.ink }], ['circle', { cx: 18, cy: -40, r: 4, fill: C.cream }],
      ['path', { d: 'M16 -22 Q-14 -6 -14 22 Q-14 48 12 48 Q34 48 34 30 Q34 16 20 18', stroke: C.bark, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }]]),
  };
  const MOUTH = Object.fromEntries(Object.keys(MOUTH_GB).map(k => [k, (T, g) => mouthArt(T, g, k) || MOUTH_GB[k](T, g)]));

  /* ================= 먹기 연출 ================= */
  async function eat(T, g, d) {
    if (g.key === 'crane') {
      const deg = aimP(g, [d.x, d.y + DISH[d.key].top * d.scale + 14]);
      await T.anim(g.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${deg}deg)` }, { transform: `rotate(${deg * .85}deg)` }, { transform: `rotate(${deg}deg)` }, { transform: 'rotate(0deg)' }], 900);
      sipSnd(T); T.pop(g.x, g.y - 290 * g.scale, '쪽쪽', C.pine);
    } else if (g.key === 'fox') {
      const deg = aimP(g, [d.x, d.y - 10]);
      g.parts.tongue.setAttribute('opacity', 1);
      await T.anim(g.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${deg}deg)` }, { transform: `rotate(${deg * .8}deg)` }, { transform: `rotate(${deg}deg)` }, { transform: 'rotate(0deg)' }], 900);
      g.parts.tongue.setAttribute('opacity', 0);
      lickSnd(T); T.pop(g.x, g.y - 200 * g.scale, '핥핥', C.bean);
    } else if (g.key === 'duck') {
      AudioFX.animal('duck', .6) || T.tone([500, 380], .15, { type: 'square', vol: .12 });
      const nd = -(g.parts.nod || 30) * g.flip;
      await T.anim(g.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${nd}deg)` }, { transform: 'rotate(0deg)' }, { transform: `rotate(${nd}deg)` }, { transform: 'rotate(0deg)' }], 800);
      T.pop(g.x, g.y - 170 * g.scale, '냠냠', C.pine);
    } else {
      const x0 = g.x, y0 = g.y;
      await g.move(d.x, d.y - 40, 500);
      sipSnd(T); T.pop(d.x, d.y - 200, '쪽!', C.bean);
      await T.sleep(300);
      await g.move(x0, y0, 500);
    }
  }

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, actor, camTo, camSnap, josa } = T;
    let fox, crane;
    /* 대사 연출: 목소리 주인에게 카메라, 여우와 두루미가 서로 마주 봄 (장면마다 새 배우라 함수로) */
    const direct = (getFox, getCrane) => T.director({ cast: { fox: getFox, crane: getCrane }, listener: r => (r === 'fox' ? 'crane' : 'fox') });
    direct(() => fox, () => crane);
    const vo = k => typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k] && AudioFX.voice(VOICE_LINES[k]); // 말풍선 없는 소리 대사
    const cutVo = k => setTimeout(() => vo(k), 380);
    /* 그림 컷: 그림이 있으면 그림, 없으면 코드 컷 */
    const cutArt = (key, draw, o = {}) => (artUrl(key) ? T.cutImage([{ src: artUrl(key), sfx: o.sfx, hold: o.hold || 2600 }], { hold: o.hold || 2600 }) : T.cut(draw, o));

    /* 그림 미리 불러오기: 첫 장면(숲·여우·두루미) 그림만 기다리고(최대 2.5초) 나머지는 뒤에서. 못 불러온 그림은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads['bg_' + k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    Object.keys(ART).filter(k => ART[k]).forEach(k => { loads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    await Promise.race([Promise.all([loads.bg_forest, loads.fox_stand, loads.crane_head, loads.crane_body].filter(Boolean)), sleep(2500)]);
    const ARTMODE = () => !!(artUrl('fox_stand') && artUrl('crane_head'));

    /* --- 1. 초대장 (숲길 와이드) --- */
    forestBG(T);
    // 세로 화면(보이는 폭 ≈260): 여우·두루미를 가운데로 모아 둘 다 보이게
    const P1 = T.portrait(), FX1 = P1 ? 380 : 300, CX1 = P1 ? 640 : 740;
    fox = guest(T, T.world, 'fox', FX1, 480, 1.1); fox.face('right');
    crane = guest(T, T.world, 'crane', CX1, 480, 1.1);
    const inv = actor(T.world, P1 ? 505 : 520, 440, g => drawInvite(T, g), { scale: 1.3 });
    if (P1) camSnap(500, 280, .78);
    await T.curtain(true);
    await say('숲속에 여우랑 두루미가 살았어요.');
    await say('여우가 초대장을 가져왔어요. 초대장을 톡 눌러 봐요!');
    await T.tap(inv.pos, { prompt: '초대장을 톡 눌러서 두루미에게 줘요!' });
    sfx(T, 'whoosh');
    await inv.move(CX1 - 90, 400, 700);
    sfx(T, 'ding');
    craneCall(T);
    await crane.hop(80, 600);
    T.pop(CX1, 180, '폴짝!', C.pine);
    await crane.hop(60, 500);
    await say('"와, 고마워!" 두루미가 긴 다리로 폴짝 뛰었어요.');

    /* --- 2. 여우의 부엌 (중간샷) --- */
    let pot;
    await T.sceneCard('여우의 부엌', () => {
      T.clear(); kitchenBG(T);
      let pp;
      if (bgUrl('kitchen') && artUrl('pot')) { // 그림: 배경 안쪽 아궁이 자리(그림 속 솥)에 수프 냄비를 얹고, 여우는 앞쪽에서 냄비를 본다
        fox = guest(T, T.world, 'fox', 500, 480, 1.2);
        pot = actor(T.world, 262, 374, g => { pp = drawPot(T, g); }, { scale: 1.05 }); pot.parts = pp;
        camSnap(420, 330, 1.3);
      } else {
        fox = guest(T, T.world, 'fox', 360, 470, 1.2); fox.face('right');
        pot = actor(T.world, 580, 470, g => { pp = drawPot(T, g); }, { scale: 1.05 }); pot.parts = pp;
        camSnap(480, 340, 1.3);
      }
    }, fox.pos);
    await say('여우가 맛있는 수프를 끓여요.');
    await say('냄비를 톡톡 눌러서 저어 볼까요?');
    await T.mash(pot.pos, { count: 5, prompt: '냄비를 톡톡 눌러서 휘휘 저어요!', onStep: i => {
      const st = pot.parts.stir || 22;
      pot.parts.spoon.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${-st}deg)` }, { transform: `rotate(${st}deg)` }, { transform: 'rotate(0deg)' }], { duration: 420 });
      for (let k = 0; k < 2; k++) {
        const b = el('circle', { cx: -60 + Math.random() * 120, cy: -126, r: 8 + Math.random() * 6, fill: C.cream, opacity: .9 }, pot.parts.bubbles);
        b.animate([{ transform: 'translateY(0)', opacity: .9 }, { transform: 'translateY(-60px)', opacity: 0 }], { duration: 900, delay: k * 150, fill: 'forwards' });
        setTimeout(() => b.remove(), 1200);
      }
      bubbleSnd(T);
      if (i % 2) T.pop(pot.x + 20, pot.y - 200, '보글', C.bean);
    } });
    await sleep(400);
    AudioFX.laugh();
    await fox.wiggle(8, 500);
    await say('여우가 킥킥 웃어요. "납작 접시에 담아야지~"');

    /* --- 3. 납작 접시 (하이앵글) --- */
    let tbl;
    await T.sceneCard('납작 접시', () => {
      T.clear(); camSnap(500, 280, 1); highBG(T);
      if (bgUrl('high') && ARTMODE()) { // 그림: 배경 속 둥근 탁자 위 접시 → 둘 다 조금 크게, 탁자 양옆 앞쪽에
        fox = guest(T, T.world, 'fox', 190, 398, 1.4); fox.face('right');
        crane = guest(T, T.world, 'crane', 770, 440, 1.3);
      } else {
        fox = guest(T, T.world, 'fox', 190, 440, 1.1); fox.face('right');
        crane = guest(T, T.world, 'crane', 730, 450, 1.2);
      }
      tbl = highTable(T, T.world);
    }, fox.pos);
    await say('두루미가 놀러 왔어요. 그런데 접시가 아주 납작해요!');
    await say('두루미 부리를 톡 눌러서 먹게 해 줘요!');
    const words = ['콕!', '딱!', '딱딱!'];
    const HI = bgUrl('high') && ARTMODE(); // 그림: 접시가 탁자 위(무대 y≈250)에 있다
    const peckAt = HI ? [612, 254] : [640, 418], lickAt = HI ? [400, 262] : [390, 440];
    for (let i = 0; i < 3; i++) {
      await T.tap(crane.parts.head, { prompt: '두루미 부리를 톡 눌러 봐요!' });
      const deg = aimP(crane, peckAt);
      await T.anim(crane.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${deg}deg)` }], 260);
      peckSnd(T); T.pop(peckAt[0] - (HI ? (T.portrait() ? 30 : 150) : 0), peckAt[1] - (HI ? 110 : 88), words[i], C.bean);
      await sleep(260);
      await T.anim(crane.parts.head, [{ transform: `rotate(${deg}deg)` }, { transform: 'rotate(0deg)' }], 320);
    }
    cutVo('cut_peck');
    await cutArt('cut_peck', svg => {
      el('ellipse', { cx: 200, cy: 258, rx: 170, ry: 26, fill: C.cream, stroke: C.gold, 'stroke-width': 6 }, svg);
      el('ellipse', { cx: 200, cy: 256, rx: 130, ry: 14, fill: C.amber }, svg);
      el('path', { d: 'M290 70 L150 236 L306 104 Z', fill: C.gold }, svg);
      el('circle', { cx: 320, cy: 80, r: 44, fill: C.snow }, svg);
      el('circle', { cx: 330, cy: 44, r: 18, fill: C.bean }, svg);
      el('circle', { cx: 306, cy: 78, r: 6, fill: C.ink }, svg);
      el('text', { x: 110, y: 120, 'text-anchor': 'middle', 'font-size': 64, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '딱딱!' }, svg);
    }, { sfx: 'poke' });
    await say('어머나, 부리 끝만 딱딱 닿아요. 수프를 먹을 수가 없어요.');
    await fox.move(HI ? 222 : 235, fox.y, 500);
    await T.fitTo([fox.pos, tbl.soup]); // 세로 화면: 핥는 여우와 접시가 함께 보이게
    fox.parts.tongue.setAttribute('opacity', 1);
    const fdeg = aimP(fox, lickAt);
    fox.parts.head.style.transform = `rotate(${fdeg}deg)`;
    const licking = fox.parts.head.animate([{ transform: `rotate(${fdeg}deg)` }, { transform: `rotate(${fdeg * .7}deg)` }, { transform: `rotate(${fdeg}deg)` }], { duration: 420, iterations: Infinity });
    const lickP = HI ? [360, 150] : [330, 300];
    const lickT = setInterval(() => { lickSnd(T); T.pop(...lickP, '핥핥', C.bean); }, 900);
    lickSnd(T); T.pop(...lickP, '핥핥', C.bean);
    await T.anim(tbl.soup, [{ transform: 'scale(1)' }, { transform: 'scale(0)' }], 2400);
    clearInterval(lickT); licking.cancel();
    fox.parts.head.style.transform = ''; fox.parts.tongue.setAttribute('opacity', 0);
    cutVo('cut_lick');
    await cutArt('cut_lick', svg => {
      el('ellipse', { cx: 200, cy: 262, rx: 170, ry: 24, fill: C.cream, stroke: C.gold, 'stroke-width': 6 }, svg);
      el('path', { d: 'M110 70 L150 20 L170 80 Z M230 80 L250 20 L290 70 Z', fill: C.persimmon }, svg);
      el('circle', { cx: 200, cy: 130, r: 90, fill: C.persimmon }, svg);
      el('path', { d: 'M140 150 Q200 210 260 150 Q200 190 140 150 Z', fill: C.cream }, svg);
      el('circle', { cx: 165, cy: 110, r: 9, fill: C.ink }, svg); el('circle', { cx: 235, cy: 110, r: 9, fill: C.ink }, svg);
      el('circle', { cx: 200, cy: 150, r: 12, fill: C.ink }, svg);
      el('ellipse', { cx: 200, cy: 222, rx: 30, ry: 36, fill: C.pink }, svg);
      el('text', { x: 330, y: 80, 'text-anchor': 'middle', 'font-size': 56, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '핥핥!' }, svg);
    }, { hold: 2200 });
    mood(crane, 'sad');
    T.tone([500, 300], .5, { type: 'sine', vol: .14 });
    T.pop(740, HI ? 150 : 120, '꼬르륵', C.indigo);
    await say('여우는 혀로 핥핥, 다 먹었어요. 두루미는 배가 꼬르륵, 속상했어요.');

    /* --- 4. 두루미 초대 (연못가 집 와이드) --- */
    await T.sceneCard('두루미네 집', () => {
      T.clear(); pondHouseBG(T);
      crane = guest(T, T.world, 'crane', 640, 500, 1.1);
      fox = guest(T, T.world, 'fox', -140, 510, 1.1); fox.face('right');
    }, crane.pos);
    craneCall(T);
    await say('며칠 뒤, 이번엔 두루미가 여우를 불렀어요.');
    await say('"여우야, 우리 집에도 놀러 와~"');
    const steps = setInterval(() => sfx(T, 'step_grass', () => T.tone([220, 160], .08, { type: 'triangle', vol: .1 }), .5), 380);
    await fox.move(380, 510, 1800);
    clearInterval(steps);
    await fox.hop(40);
    await say('여우가 신이 났어요. "좋아! 맛있는 거 먹어야지!"');

    /* --- 5. 긴 병 (로우앵글) --- */
    let bottle;
    await T.sceneCard('긴 병', () => {
      T.clear(); lowBG(T);
      fox = guest(T, T.world, 'fox', 300, 500, 1.0); fox.face('right');
      if (bgUrl('crane_room') && ARTMODE()) { // 그림: 병은 배경 속 작은 탁자 위, 두루미는 탁자 오른쪽 앞
        crane = guest(T, T.world, 'crane', 820, 505, 1.55);
        bottle = dish(T, T.world, 'bottle', 660, 358, 1.3);
      } else {
        crane = guest(T, T.world, 'crane', 730, 500, 1.5);
        lowTable(T, T.world);
        bottle = dish(T, T.world, 'bottle', 560, 432, 1.3);
      }
    }, fox.pos);
    await say('와, 병이 탑처럼 높아요! 목이 아주 길어요.');
    await say('여우 코를 톡 눌러서 먹게 해 줘요!');
    const mouth = [bottle.x, bottle.y + DISH.bottle.top * 1.3];
    // 1: 킁킁
    await T.tap(fox.parts.head, { prompt: '여우 코를 톡 눌러 봐요!' });
    await fox.move(360, 500, 400);
    await fox.wiggle(5, 400);
    T.tone([1200, 900], .08, { type: 'sine', vol: .1 }); T.pop(fox.x + 110, 360, '킁킁', C.bark);
    await sleep(400);
    // 2: 영차
    await T.tap(fox.parts.head, { prompt: '여우 코를 한 번 더 톡!' });
    await T.anim(fox.body, [{ transform: 'scale(1,1)' }, { transform: 'scale(.95,1.15)' }, { transform: 'scale(.95,1.15)' }, { transform: 'scale(1,1)' }], 800);
    T.pop(360, 250, '영차!', C.pine);
    await sleep(300);
    // 3: 폴짝 → 코가 쏙
    await T.tap(fox.parts.head, { prompt: '여우 코를 톡! 폴짝 뛰어 봐요!' });
    await T.fitTo([fox.pos, bottle.pos, crane.parts.head]); // 세로 화면: 여우·병·두루미가 함께 보이게
    const SN = fox.parts.art ? FOX_STUCK_NOSE : [-130, -94]; // 코 낀 자세의 코끝이 병 입구에
    const sx = mouth[0] + SN[0] * fox.scale + (fox.parts.art ? -6 : 0), sy = mouth[1] + (fox.parts.art ? 12 : 8) - SN[1] * fox.scale;
    sfx(T, 'whoosh');
    await Promise.all([
      fox.move(sx - 30, sy - 70, 380, 'ease-out'),
      T.anim(fox.parts.all, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-35deg)' }], 380),
    ]);
    await fox.move(sx, sy, 200, 'ease-in');
    if (fox.parts.art) { fox.parts.all.style.transform = ''; fox.parts.setPose('stuck'); }
    sfx(T, 'pop'); T.shake();
    const kd = fox.parts.kick || 14;
    const kick = fox.parts.legs.animate([{ transform: `rotate(${-kd}deg)` }, { transform: `rotate(${kd}deg)` }], { duration: 180, iterations: Infinity, direction: 'alternate' });
    const wag = fox.parts.tail.animate([{ transform: 'rotate(-16deg)' }, { transform: 'rotate(16deg)' }], { duration: 260, iterations: Infinity, direction: 'alternate' });
    cutVo('cut_stuck');
    await cutArt('cut_stuck', svg => {
      el('rect', { x: 170, y: 150, width: 60, height: 150, fill: C.pine }, svg);
      el('rect', { x: 158, y: 138, width: 84, height: 22, rx: 6, fill: C.gold }, svg);
      el('path', { d: 'M40 20 L110 0 L215 150 L185 160 Z', fill: C.persimmon }, svg);
      el('circle', { cx: 70, cy: 30, r: 60, fill: C.persimmon }, svg);
      el('circle', { cx: 80, cy: 20, r: 8, fill: C.ink }, svg);
      el('text', { x: 310, y: 110, 'text-anchor': 'middle', 'font-size': 80, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '쏙!' }, svg);
    }, { hold: 2200 });
    await say('어머나! 여우 코가 병에 쏙 끼었어요!');
    await sleep(600);
    kick.cancel(); wag.cancel();
    sfx(T, 'pop'); T.pop(mouth[0], mouth[1] - 40, '뿅!', C.bean);
    fox.parts.all.style.transform = '';
    if (fox.parts.art) fox.parts.setPose('stand');
    await fox.move(330, 380, 360, 'ease-out');
    await fox.move(300, 500, 320, 'ease-in');
    sfx(T, 'thud'); T.shake();
    fox.body.style.transform = 'scale(1.08,.86)';
    T.pop(300, 380, '쿵!', C.bark);
    const stars = el('g', {}, T.fx);
    for (let k = 0; k < 3; k++) el('path', { d: 'M0 -10 L3 -3 10 -3 4 2 6 10 0 5 -6 10 -4 2 -10 -3 -3 -3 Z', fill: '#FFD54F', transform: `rotate(${k * 120}) translate(34 0)` }, stars);
    stars.animate([{ transform: 'translate(250px,320px) rotate(0)' }, { transform: 'translate(250px,320px) rotate(360deg)' }], { duration: 1100, iterations: 3 });
    [0, .15, .3].forEach(w => T.tone([700, 500], .12, { type: 'triangle', vol: .14, when: w }));
    await say('뿅! 코가 빠졌어요. 엉덩방아 쿵!');
    stars.remove();
    const cdeg = aimP(crane, [mouth[0] + (crane.parts.art ? 4 : 0), mouth[1] + 20]);
    for (let k = 0; k < 2; k++) {
      await T.anim(crane.parts.head, [{ transform: 'rotate(0deg)' }, { transform: `rotate(${cdeg}deg)` }], 300);
      sipSnd(T); T.pop(crane.parts.art ? 800 : 760, 110, '쪽쪽', C.pine);
      await sleep(350);
      await T.anim(crane.parts.head, [{ transform: `rotate(${cdeg}deg)` }, { transform: 'rotate(0deg)' }], 300);
    }
    fox.body.style.transform = '';
    mood(fox, 'sad');
    T.tone([500, 300], .5, { type: 'sine', vol: .14 });
    await say('두루미는 긴 부리로 쪽쪽 먹었어요. 여우는 배가 꼬르륵, 속상했어요.');

    /* --- 6. 왜 못 먹었을까? (분할 화면) --- */
    let plateL, bottleR;
    await T.sceneCard('왜 못 먹었을까?', () => {
      T.clear(); splitBG(T);
      // 세로 화면: 양쪽을 가운데로 모으고 물러서서 두루미·접시·병·여우가 다 보이게
      const SP = T.portrait();
      crane = guest(T, T.world, 'crane', SP ? 310 : 150, 480, .95); crane.face('right');
      plateL = dish(T, T.world, 'plate', SP ? 405 : 300, 480, .9);
      fox = guest(T, T.world, 'fox', SP ? 700 : 870, 480, 1.0);
      bottleR = dish(T, T.world, 'bottle', SP ? 600 : 700, 480, .95);
      if (SP) camSnap(500, 280, .5);
      crane.parts.sadDeg = 15; mood(crane, 'sad');
      mood(fox, 'sad');
    }, fox.pos);
    await say('둘 다 못 먹었어요. 왜 그랬을까요?');
    const qs = [
      { who: crane, q: '두루미는 부리가 길쭉해요. 어떤 그릇이 좋을까요?', ok: 'bottle', no: 'plate',
        where: '길쭉한 부리가 쏙 들어가는 그릇을 찾아봐요!', old: () => plateL, at: [T.portrait() ? 405 : 280, 480] },
      { who: fox, q: '여우는 입이 짧아요. 혀로 핥아 먹어요. 어떤 그릇이 좋을까요?', ok: 'plate', no: 'bottle',
        where: '혀로 핥기 좋은 납작한 그릇을 찾아봐요!', old: () => bottleR, at: [T.portrait() ? 600 : 720, 480] },
    ];
    for (const r of qs) {
      const up = Math.random() < .5;
      const bOk = badge(T, 500, up ? 160 : 380, g => ICON[r.ok](T, g));
      const bNo = badge(T, 500, up ? 380 : 160, g => ICON[r.no](T, g));
      await say(r.q);
      await T.choose([{ el: bOk, ok: true }, { el: bNo, ok: false }], { prompt: r.q, where: r.where,
        who: `${josa(DISH[r.ok].name, '이에요/예요')}! 반짝이는 걸 눌러 봐요!` });
      bOk.remove(); bNo.remove();
      const o = r.old(); await T.anim(o.pos, [{ opacity: 1 }, { opacity: 0 }], 300); o.pos.remove();
      const nd = dish(T, T.world, r.ok, r.at[0], r.at[1], r.ok === 'bottle' ? .95 : .9);
      nd.pos.animate([{ opacity: 0 }, { opacity: 1 }], 300);
      sfx(T, 'pop');
      mood(r.who, null);
      await eat(T, r.who, nd);
      await r.who.hop(30);
      await say(`맞아요! ${josa(GUESTS[r.who.key].name, '은/는')} ${josa(DISH[r.ok].name, '이/가')} 좋아요.`);
    }

    /* --- 7. 알맞은 그릇 (잔치 식탁 정면, 메인) --- */
    let gL, tL, dL;
    await T.sceneCard('알맞은 그릇', () => {
      T.clear(); feastBG(T, false);
      gL = el('g', {}, T.world); tL = el('g', {}, T.world); dL = el('g', {}, T.world);
      feastTable(T, tL);
      if (T.portrait()) camSnap(557, 280, Math.min(1, T.viewWidth() / 2 / 375)); // 세로 화면: 손님과 그릇 셋이 다 보이게
    }, fox.pos);
    await say('여우랑 두루미가 함께 잔치를 열었어요. 손님들도 와요!');
    await say('입 모양을 잘 보고, 알맞은 그릇을 골라 줘요!');
    const ROUNDS = [
      { key: 'crane', ok: 'bottle', opts: ['bottle', 'plate', 'bowl'], q: '두루미는 부리가 길쭉해요. 어떤 그릇이 좋을까요?', where: '길쭉한 부리가 쏙 들어가는 걸 찾아봐요!' },
      { key: 'fox', ok: 'plate', opts: ['plate', 'bottle', 'flower'], q: '여우는 입이 짧아요. 어떤 그릇이 좋을까요?', where: '혀로 핥기 좋은 납작한 걸 찾아봐요!' },
      { key: 'duck', ok: 'bowl', opts: ['bowl', 'bottle', 'flower'], q: '오리는 부리가 넓적해요. 어떤 그릇이 좋을까요?', where: '넓적한 부리로 푹 떠먹기 좋은 걸 찾아봐요!' },
      { key: 'butterfly', ok: 'flower', opts: ['flower', 'plate', 'bowl'], q: '나비는 입이 빨대 같아요. 무엇이 좋을까요?', where: '빨대 입으로 쪽 빨아 먹는 걸 찾아봐요!' },
    ];
    const SLOTS = [440, 630, 820];
    // 그림: 손님은 식탁 뒤에 선다(발이 식탁보 뒤로 숨는다 — 식탁 위에 올라선 것처럼 보이지 않게)
    const FEET = bgUrl('feast_day') && ARTMODE() ? 440 : 400;
    // 세로 화면(양옆이 잘림): 손님을 조금 안쪽에 세우고, 손님과 그릇 셋이 다 보이게 살짝 물러선다. 가로는 그대로
    const GX = T.portrait() ? 250 : 190;
    for (const r of ROUNDS) {
      const gy = r.key === 'butterfly' ? 350 : FEET;
      const g = guest(T, gL, r.key, 1150, gy);
      const name = GUESTS[r.key].name;
      const walk = setInterval(() => sfx(T, 'step_grass', () => T.tone([220, 160], .08, { type: 'triangle', vol: .1 }), .4), 400);
      await g.move(GX, gy, 1500);
      clearInterval(walk);
      g.face('right');
      await g.hop(24);
      vo('hi_' + r.key); // 손님 인사 (내레이션은 인사가 끝난 뒤 이어진다)
      await say(`${josa(name, '이/가')} 왔어요!`);
      const card = badge(T, 500, 118, gg => MOUTH[r.key](T, gg), 84, true);
      sfx(T, 'ding');
      const opts = shuffle(r.opts).map((k, i) => dish(T, dL, k, SLOTS[i], 404, 1));
      await say(r.q);
      const res = await T.choose(opts.map(d => ({ el: d.pos, ok: d.key === r.ok, onWrong: async () => {
        await Promise.all([T.anim(d.pos, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 400), g.wiggle(10, 400)]);
      } })), { prompt: r.q, where: r.where, who: `${josa(DISH[r.ok].name, '이에요/예요')}! 반짝이는 걸 눌러 봐요!` });
      const good = opts.find(d => d.key === r.ok);
      await Promise.all(opts.filter(d => d !== good).map(d => T.anim(d.pos, [{ opacity: 1 }, { opacity: 0 }], 300)));
      opts.filter(d => d !== good).forEach(d => d.pos.remove());
      await good.move(320, 404, 600);
      await eat(T, g, good);
      await say(`맞아요! ${josa(name, '은/는')} ${josa(DISH[r.ok].name, '이/가')} 좋아요.`);
      card.remove();
      g.face('right');
      await Promise.all([g.move(1150, gy, 1200), good.move(1280, 404, 1200)]);
      g.pos.remove(); good.pos.remove();
    }

    /* --- 8. 함께 먹어요 (잔치 와이드, 등불) --- */
    const party = {};
    const plates = {};
    await T.sceneCard('함께 먹어요', () => {
      T.clear();
      if (!feastBG(T, true)) [150, 390, 610, 850].forEach(x => lantern(T, T.bg, x, 110));
      gL = el('g', {}, T.world); tL = el('g', {}, T.world); dL = el('g', {}, T.world);
      const PF = bgUrl('feast_night') && ARTMODE() ? 440 : 400; // 그림: 식탁 뒤에 선다
      party.duck = guest(T, gL, 'duck', 85, PF, 1.2); party.duck.face('right');
      party.fox = guest(T, gL, 'fox', 385, PF, 1.1); party.fox.face('right');
      party.crane = guest(T, gL, 'crane', 725 + (PF - 400) * .5, PF, 1.1);
      party.butterfly = guest(T, gL, 'butterfly', 915, 340, 1.3);
      feastTable(T, tL);
      plates.duck = dish(T, dL, 'bowl', 180, 404, .9);
      plates.fox = dish(T, dL, 'plate', 505, 404, .9);
      plates.crane = dish(T, dL, 'bottle', 612, 404, .95);
      plates.butterfly = dish(T, dL, 'flower', 840, 404, 1);
      if (T.portrait()) { // 세로 화면(양옆이 잘림): 손님과 그릇을 가운데로 모으고 살짝 물러서서 모두 보이게
        [...Object.values(party), ...Object.values(plates)].forEach(a => a.place(Math.round(500 + (a.x - 500) * .72), a.y));
        camSnap(500, 280, Math.min(1, T.viewWidth() / 2 / 350));
      }
    });
    direct(() => party.fox, () => party.crane);
    await say('등불이 반짝, 모두 모여 잔치를 해요.');
    party.fox.parts.blush.setAttribute('opacity', 1);
    mood(party.fox, 'sorry');
    await say('여우가 말했어요. "두루미야, 미안해."');
    if (!party.fox.parts.art) mood(party.fox, null); // 그림: 여우는 미안해 자세(앉음)로 두루미 말을 듣는다
    mood(party.crane, 'sorry');
    await say('두루미도 말했어요. "여우야, 나도 미안해."');
    mood(party.crane, null);
    await cutArt('cut_sorry', svg => {
      el('rect', { x: -10, y: 130, width: 200, height: 56, rx: 28, fill: C.persimmon }, svg);
      el('circle', { cx: 190, cy: 158, r: 36, fill: C.persimmon }, svg);
      el('path', { d: 'M410 120 Q300 130 216 150 Q300 200 410 196 Z', fill: C.snow }, svg);
      el('path', { d: 'M410 150 Q340 160 300 176', stroke: C.ink, 'stroke-width': 6, fill: 'none' }, svg);
      [[120, 70], [280, 70]].forEach(([x, y]) => el('path', { d: `M${x} ${y + 14} C${x - 30} ${y - 10} ${x - 10} ${y - 30} ${x} ${y - 12} C${x + 10} ${y - 30} ${x + 30} ${y - 10} ${x} ${y + 14} Z`, fill: C.bean }, svg));
      el('text', { x: 200, y: 262, 'text-anchor': 'middle', 'font-size': 60, fill: C.bean, stroke: '#fff', 'stroke-width': 10, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '미안해!' }, svg);
    }, { sfx: 'ding', hold: 2600 });
    party.fox.parts.blush.setAttribute('opacity', 0);
    await Promise.all([party.fox.hop(30), party.crane.hop(30)]);
    await say('"괜찮아!" 둘은 다시 사이좋은 친구가 되었어요.');
    await say('친구들을 톡톡 눌러 봐요. 냠냠 맛있게 먹어요!');
    const busyEat = {};
    await T.free(Object.keys(party).map(k => ({ el: party[k].pos, onTap: async () => {
      if (busyEat[k]) return; busyEat[k] = true;
      await eat(T, party[k], plates[k]); vo('yum_' + k); busyEat[k] = false; // 먹는 소리 뒤에 한마디
    } })), 15000);
    T.confetti(); AudioFX.fanfare && AudioFX.fanfare();
    await say('배부르게 먹고, 모두 행복하게 웃었답니다.');
    return '친구 입장이 되어 보면 모두 즐거워요!';
  }

  /* ================= 세로 화면 도우미 (이 동화 안에서만) =================
     세로 화면은 무대 양옆이 잘린다(보이는 폭 = T.viewWidth(), 폰에서 약 430).
     조작을 기다리기 전에 누를 대상(카메라 안의 그림)이 화면 밖이면 카메라를 옆으로 옮기고,
     그래도 다 안 들어가면 살짝 물러서서(줌아웃) 모두 보이게 한다.
     장면이 바뀌면 이 도우미가 옮긴 카메라는 제자리로 돌려놓는다.
     가로 화면(보이는 폭 1000)에서는 아무것도 하지 않는다. */
  function portraitGuard(api) {
    const T = Object.create(api);
    const portrait = () => api.viewWidth() < 990;
    let guardCam = null;
    const inCam = n => n && n.closest && n.closest('#cam');
    function worldBox(nodes) {
      const w = document.getElementById('stageWrap').getBoundingClientRect();
      const s = w.height / 560, c = api.camera; // 세로(slice): 무대 높이 560이 화면 높이에 맞는다
      const wx = px => c.x + ((px - w.left - w.width / 2) / s) / c.z, wy = py => c.y + ((py - w.top - w.height / 2) / s) / c.z;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      nodes.forEach(n => {
        const r = n.getBoundingClientRect(); if (!r.width && !r.height) return;
        x0 = Math.min(x0, wx(r.left)); x1 = Math.max(x1, wx(r.right)); y0 = Math.min(y0, wy(r.top)); y1 = Math.max(y1, wy(r.bottom));
      });
      return x0 < x1 ? { x0, x1, y0, y1 } : null;
    }
    T.portrait = portrait;
    /* 화면 고정 UI(#stage에 바로 붙은 카드·배지)를 보이는 폭 안에 한 줄로 다시 놓는다.
       gs: translate(x,y)로 놓인 그룹들. 원래 왼쪽→오른쪽 순서를 지키고, 넘치면 함께 줄인다. 세로 화면에서만 */
    T.fitRow = (gs, { gap = 16, margin = 12 } = {}) => {
      if (!portrait()) return;
      const vw = api.viewWidth();
      const at = g => (g.getAttribute('transform') || '').match(/translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/) || [0, 0, 0];
      const items = gs.map(g => { const m = at(g), b = g.getBBox(); return { g, x: +m[1], y: +m[2], b }; }).sort((p, q) => p.x - q.x);
      const total = items.reduce((s, it) => s + it.b.width, 0) + gap * (items.length - 1);
      const k = Math.min(1, (vw - 2 * margin) / total);
      let x = 500 - total * k / 2;
      items.forEach(it => {
        const cx = x + it.b.width * k / 2 - (it.b.x + it.b.width / 2) * k;
        // 자리·크기는 바깥 틀(wrap)이 맡는다 → 카드 자신의 톡 커지는(scale) 애니메이션은 카드 가운데 기준 그대로
        const wrap = it.g._fitWrap || T.el('g', {}, it.g.parentNode);
        if (!it.g._fitWrap) { it.g.parentNode.insertBefore(wrap, it.g); wrap.appendChild(it.g); it.g._fitWrap = wrap; const rm = it.g.remove.bind(it.g); it.g.remove = () => { rm(); wrap.remove(); }; }
        wrap.setAttribute('transform', `translate(${cx.toFixed(1)},${it.y}) scale(${k.toFixed(3)})`);
        it.g.setAttribute('transform', 'translate(0,0)');
        it.g._x = cx; x += (it.b.width + gap) * k;
      });
    };
    /* nodes가 모두 보이게 카메라를 옮긴다 (세로 화면에서만) */
    T.fitTo = async (nodes, { dur = 600, pad = 22, minZ = .5 } = {}) => {
      if (!portrait()) return;
      nodes = [].concat(nodes).filter(inCam); if (!nodes.length) return;
      const b = worldBox(nodes); if (!b) return;
      const vw = api.viewWidth(), c = api.camera, vert = c.z > 1.001; // z ≤ 1이면 세로는 늘 무대 전체가 보인다
      const hx = vw / 2 / c.z, hy = 280 / c.z;
      if (b.x0 - pad >= c.x - hx && b.x1 + pad <= c.x + hx && (!vert || (b.y0 - pad >= c.y - hy && b.y1 + pad <= c.y + hy))) return;
      const z = Math.max(minZ, Math.min(c.z, vw / 2 / ((b.x1 - b.x0) / 2 + pad), vert ? 280 / ((b.y1 - b.y0) / 2 + pad) : 9));
      const nx = vw / 2 / z, ny = 280 / z;
      const x = Math.min(Math.max(c.x, b.x1 + pad - nx), b.x0 - pad + nx);
      const y = Math.min(Math.max(c.y, b.y1 + pad - ny), b.y0 - pad + ny);
      await api.camTo(x, y, z, dur);
      guardCam = api.camera;
    };
    const targetsOf = { tap: a => a[0], mash: a => a[0], swipe: a => a[0], hold: a => a[0], choose: a => a[0].map(o => o.el), free: a => a[0].map(t => t.el) };
    Object.keys(targetsOf).forEach(k => { T[k] = async (...a) => { await T.fitTo(targetsOf[k](a)); return api[k](...a); }; });
    T.sceneCard = (label, change, focus) => api.sceneCard(label, () => {
      if (guardCam) { const c = api.camera; if (c.x === guardCam.x && c.y === guardCam.y && c.z === guardCam.z) api.camSnap(500, 280, 1); guardCam = null; }
      change && change();
    }, focus);
    return T;
  }

  Tale.mount({ title: '여우와 두루미', subtitle: '누구에게 어떤 그릇이 좋을까?', run: T => run(portraitGuard(Tale.api)) });
})();
