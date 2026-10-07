/* 골디락스와 곰 세 마리 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §1 (결정: 순화안 — 사과하고 화해)
   빈 곰 집에 들어간 골디락스가 죽·의자·침대를 하나씩 맛보고 앉아 보고 누워 본다.
   곰 가족이 돌아오자 아이가 크기대로 주인을 찾아 주고, 끝에 골디락스가 사과하고 아기 곰과 의자를 함께 고친다.
   학습: 크다·중간·작다(1 : 0.72 : 0.5 고정) · 일대일 짝짓기 · 뜨겁다/차갑다/딱 좋다 · "미안해요"
   웃음 컷: 앗 뜨거 혀 · 부르르 · 뿌지직 엉덩방아 · 치마 걸림 */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32', bean: '#A93B32',
    indigo: '#1F2A56', persimmon: '#E8703A', amber: '#F2B366', snow: '#F4F6FA', ink: '#2E241C', pink: '#E8A0A0',
    skin: '#EDC9A0', log: '#B98A5E', logLine: '#8E6240', floor: '#8A6440', porridge: '#E9CFA0', tear: '#6FA8C8' };
  const SIZE = [1, .72, .5]; // 큰 · 중간 · 작은 — 곰·그릇·의자·침대 모두 같은 비율
  const SNAME = ['큰', '중간', '작은'];

  /* ================= 페이퍼아트 그림 (assets/v3w/gl_*.webp) =================
     null이거나 파일을 못 불러오면 그 자리는 아래 임시 도형(그레이박스)으로 그린다. 새 그림이 나오면 여기 한 줄만 바꾸면 된다.
     크기 비율(1 : .72 : .5)은 그림이 아니라 코드(SIZE)가 정한다 — 곰·그릇·의자·침대 그림은 모두 같은 기준 크기로 맞춰 두었다.
     - goldi_*: 머리카락 폭을 같게 맞춘 자세들 (걷기 그림은 꽃다발을 든다 → 꽃 따기는 그림 꽃다발로)
     - goldi_lie / goldi_lie_sleep: 누운 그림을 시계 방향으로 돌린 것(위에서 본 침대). *_sleep은 뜬 눈을 감은 눈으로 칠한 것
     - goldi_side / goldi_side_sleep: 누운 그림 그대로(옆에서 본 아기 곰 침대)
     - bowl / bowl_empty: 그림 속 김은 지우고(김은 코드가 그린다) 빈 그릇은 죽 자리를 그릇 안쪽 색으로
     - chair_small_back·seat·legL·legR: 작은 의자를 네 조각으로 (뿌지직 → 와르르, 고치기)
     - bed_*_blanket: 이불만 오린 한 장 (골디락스가 침대와 이불 사이에 눕는다)
     - bed_small: 다시 뽑은 그림(큰·중간 침대처럼 위에서 본 모습). gl_bg_bed_top 새 그림은 여전히 지평선·언덕이 보여(위에서 본 바닥 아님) 안 바꿈
     - cut_crack: 의자 등판에 붙은 눈·볼을 지운 것. 치마 걸림 컷은 코드 그림 그대로 */
  const AS = '../../assets/';
  const BG = { kitchen: 'v3w/gl_bg_kitchen.webp', forest: 'v3w/gl_bg_forest.webp', door: 'v3w/gl_bg_door.webp', table: 'v3w/gl_bg_table.webp',
    living: 'v3w/gl_bg_living.webp', bed_top: 'v3w/gl_bg_bed_top.webp', bed_side: 'v3w/gl_bg_bed_side.webp' };
  const ART = {};
  ['goldi_walk', 'goldi_walk_empty', 'goldi_pick', 'goldi_tongue', 'goldi_sorry', 'goldi_surprised', 'goldi_sit', 'goldi_side', 'goldi_side_sleep', 'goldi_lie', 'goldi_lie_sleep',
    'bear_dad', 'bear_mom', 'bear_baby', 'bear_baby_cry', 'bowl', 'bowl_empty', 'chair_big', 'chair_mid', 'chair_small',
    'chair_small_back', 'chair_small_seat', 'chair_small_legL', 'chair_small_legR',
    'bed_big', 'bed_big_blanket', 'bed_mid', 'bed_mid_blanket', 'bed_small', 'bed_small_blanket',
    'cut_hot', 'cut_cold', 'cut_crack', 'cut_eyes',
    'bed_side_small', 'bed_side_blanket', 'bowl_top', 'bowl_top_empty', 'table_front', 'table', 'bear_paw', 'hammer', 'cut_skirt'].forEach(k => { ART[k] = `v3w/gl_${k}.webp`; });
  ART.cut_eyes = 'v3w/gl_cut_eyes2.webp';   // 다시 뽑은 눈 마주침 컷: 무대 순서(골디락스 · 아기 · 엄마 · 아빠)
  ART.flower_g = 'v3w/fc_flower.webp';      // 숲길 바닥에 핀 꽃 (따러 허리를 숙인다)
  ART.butterfly = 'v3w/fc_butterfly.webp';  // 숲길 나비는 여우와 두루미 그림을 작게
  const artOK = {}, bgOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  /* 그림 상자 [x, y, w, h] (발끝·바닥 가운데 0,0, 무대 단위) — 변환 스크립트 conv_gl.py */
  const BOX = {
    goldi_walk: [-46.6, -157.6, 94.6, 159], goldi_walk_empty: [-32.8, -152.9, 93.7, 154.1], goldi_pick: [-38.3, -129.3, 98.8, 130.5], goldi_tongue: [-46.7, -145.5, 94.1, 146.2], goldi_sorry: [-46.1, -156.6, 94.5, 158.3],
    goldi_surprised: [-47.9, -154.6, 94.9, 154.8], goldi_sit: [-42.3, -159.6, 95.7, 160.8],
    goldi_side: [-165, -80, 213.3, 111.4], goldi_side_sleep: [-165, -76.5, 217.3, 104.4], // 옆 침대: 머리 왼쪽(베개), 머리 지름 93에 맞춤
    goldi_lie: [-45.8, -155.5, 91.6, 155.5], goldi_lie_sleep: [-47.3, -157.3, 94.5, 157.3],
    flower_g: [-17, -52, 34, 52],
    bear_dad: [-71.4, -225, 142.8, 225], bear_mom: [-73.6, -225, 147.2, 225], bear_baby: [-78.6, -225, 157.2, 225], bear_baby_cry: [-75.6, -230.3, 151.1, 230.3],
    bowl: [-85, -100.4, 170, 100.4], bowl_empty: [-85, -100.4, 170, 100.4],
    chair_big: [-79.7, -290, 159.4, 290], chair_mid: [-90.8, -290, 181.7, 290], chair_small: [-95.8, -290, 191.7, 290],
    bed_big: [-100, -261.5, 200, 261.5], bed_mid: [-100, -205.3, 200, 205.3], bed_small: [-73.1, -260, 146.1, 260], // 작은 침대: 다시 뽑은 위에서 본 그림(길쭉) → 폭 대신 큰 침대 그림 높이에 맞춤 (중간 침대보다 확실히 작게)
  };
  ['back', 'seat', 'legL', 'legR'].forEach(k => { BOX['chair_small_' + k] = BOX.chair_small; });
  ['big', 'mid', 'small'].forEach(k => { BOX[`bed_${k}_blanket`] = BOX['bed_' + k]; });
  const CHAIR_SEAT = [165, 204, 176];                        // 앉는 자리 높이 (기준 크기)
  /* 침대: 베개 가운데 x · 이불 윗단 y (기준 크기). 그림 폭 200 × BED_K (세로 화면은 조금 작게) */
  const BED_PILLOW = { big: [39.2, -195.3], mid: [-3.3, -146.1], small: [-3.5, -188.5] };
  const GOLDI_LIE = .55;                                   // 침대에 누운 골디락스 크기 — 작은 침대에 쏙 들어가게
  const BOWL_RIM = () => (artUrl('bowl') ? 100 : 80);
  function pic(T, g, key, { shadow = true, box } = {}) {
    const u = artUrl(key); if (!u) return null;
    const [x, y, w, h] = box || BOX[key];
    const wrap = T.el('g', shadow ? { filter: 'url(#pp)' } : {}, g);
    T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
    return wrap;
  }
  /* 배경 그림: 무대 1000×560을 덮고 가장자리를 조금 더 덮는다 (그림 비율 1760:992). 그림 밖은 끝 색으로 */
  const BG_EDGE = { kitchen: ['#efe0c4', '#4a3220'], forest: ['#cfe5ee', '#3c5a3a'], door: ['#cfe0e2', '#3f5a34'], table: ['#e8d6b6', '#6b4426'],
    living: ['#eee0c4', '#5a3a22'], bed_top: ['#f2e6cc', '#5a3a22'], bed_side: ['#f2e6cc', '#8a6440'] };
  function bgImage(T, key, { dx = 0, parent } = {}) {
    const u = bgUrl(key); if (!u) return null;
    const w = 1080, h = w * 992 / 1760, x = -40 + dx, y = -24, p = parent || T.bg;
    const [top, bot] = BG_EDGE[key] || ['#cfe3ee', '#77693f'];
    if (!parent) {
      T.el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, p);
      T.el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, p);
      if (dx > 0) T.el('rect', { x: -1400, y: -1400, width: 1400 + x + 2, height: 3800, fill: '#4a3220' }, p); // 그림을 오른쪽으로 민 만큼 왼쪽은 통나무 벽 색
    }
    return T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, p);
  }

  /* ================= 인물 (앞모습. 발끝 = 0,0) ================= */
  /* 골디락스: 키 약 157. 돌려주는 값으로 표정·다리를 바꾼다 */
  function drawGoldiArt(T, g) {
    const { el } = T;
    const poses = {};
    ['walk', 'walk_empty', 'pick', 'tongue', 'sorry', 'surprised', 'sit', 'side', 'side_sleep', 'lie', 'lie_sleep'].forEach(k => { poses[k] = pic(T, g, 'goldi_' + k); });
    let mode = 'stand', face = 'smile', hold = true, bend = false;
    const STAND = { tongue: 'tongue', brr: 'surprised', o: 'surprised', sorry: 'sorry' }; // 웃음·기쁨·하품 = 걷기(꽃다발)
    const show = () => {
      const sleepy = face === 'sleep' || face === 'yawn';
      let n = mode === 'sit' ? 'sit' : mode === 'lie' ? (sleepy ? 'lie_sleep' : 'lie') : mode === 'side' ? (face === 'sleep' ? 'side_sleep' : 'side') : (bend ? 'pick' : STAND[face] || (hold ? 'walk' : 'walk_empty'));
      if (!poses[n]) n = 'walk';
      Object.entries(poses).forEach(([k, p]) => { if (p) p.style.display = k === n ? '' : 'none'; });
    };
    show();
    T.el('rect', { x: -48, y: -160, width: 96, height: 160, fill: '#fff', opacity: 0 }, g);
    const legs = el('g', {}, g), arms = el('g', {}, g);
    const hand = el('g', { display: 'none' }, g); // 꽃다발은 걷기 그림에 있다
    return { setFace: st => { face = st; show(); }, setMode: m => { mode = m; show(); }, setHold: h => { hold = h; show(); }, setBend: b => { bend = b; show(); }, legs, hand, arms, art: true };
  }
  function drawGoldi(T, g) {
    if (artUrl('goldi_walk')) return drawGoldiArt(T, g);
    const { paper, el } = T;
    paper(g, [
      ['ellipse', { cx: 0, cy: -110, rx: 38, ry: 40, fill: C.gold }],
      ['circle', { cx: -34, cy: -90, r: 14, fill: C.gold }], ['circle', { cx: 34, cy: -90, r: 14, fill: C.gold }],
      ['circle', { cx: -30, cy: -74, r: 11, fill: C.gold }], ['circle', { cx: 30, cy: -74, r: 11, fill: C.gold }],
    ]);
    const legs = el('g', {}, g);
    legs.style.transformBox = 'view-box'; legs.style.transformOrigin = '0px -34px';
    paper(legs, [
      ['rect', { x: -14, y: -36, width: 9, height: 32, fill: C.skin }], ['rect', { x: 5, y: -36, width: 9, height: 32, fill: C.skin }],
      ['rect', { x: -18, y: -7, width: 15, height: 7, rx: 3, fill: C.bark }], ['rect', { x: 3, y: -7, width: 15, height: 7, rx: 3, fill: C.bark }],
    ]);
    paper(g, [
      ['path', { d: 'M-20 -94 L20 -94 L42 -30 L-42 -30 Z', fill: C.bean }],
      ['path', { d: 'M-12 -80 L12 -80 L22 -36 L-22 -36 Z', fill: C.cream }],
    ]);
    const arms = el('g', {}, g);
    el('path', { d: 'M-18 -88 L-32 -54', stroke: C.bean, 'stroke-width': 9, 'stroke-linecap': 'round' }, arms);
    el('path', { d: 'M18 -88 L32 -54', stroke: C.bean, 'stroke-width': 9, 'stroke-linecap': 'round' }, arms);
    el('circle', { cx: -33, cy: -50, r: 6, fill: C.skin }, arms); el('circle', { cx: 33, cy: -50, r: 6, fill: C.skin }, arms);
    paper(g, [
      ['circle', { cx: 0, cy: -118, r: 25, fill: C.skin }],
      ['path', { d: 'M-26 -120 Q-22 -148 0 -146 Q22 -148 26 -120 Q14 -134 0 -131 Q-14 -134 -26 -120 Z', fill: C.gold }],
      ['circle', { cx: -16, cy: -141, r: 10, fill: C.gold }], ['circle', { cx: 0, cy: -147, r: 11, fill: C.gold }], ['circle', { cx: 16, cy: -141, r: 10, fill: C.gold }],
      ['path', { d: 'M20 -150 L8 -158 L8 -142 Z M20 -150 L32 -158 L32 -142 Z', fill: C.bean }],
    ]);
    const face = el('g', {}, g);
    const hand = el('g', { transform: 'translate(33,-52)' }, g); // 꽃다발 자리
    const setFace = st => {
      face.innerHTML = '';
      const f = (t, a) => el(t, a, face);
      const ink = { stroke: C.ink, 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' };
      f('circle', { cx: -14, cy: -110, r: 4, fill: C.pink, opacity: .85 }); f('circle', { cx: 14, cy: -110, r: 4, fill: C.pink, opacity: .85 });
      const closed = () => { f('path', { d: 'M-13 -120 Q-9 -116 -5 -120', ...ink }); f('path', { d: 'M5 -120 Q9 -116 13 -120', ...ink }); };
      const squeeze = () => { f('path', { d: 'M-13 -123 L-6 -119 L-13 -115', ...ink }); f('path', { d: 'M13 -123 L6 -119 L13 -115', ...ink }); };
      const dots = (r = 3.2, dy = 0) => { f('circle', { cx: -9, cy: -120 + dy, r, fill: C.ink }); f('circle', { cx: 9, cy: -120 + dy, r, fill: C.ink }); };
      if (st === 'tongue') { squeeze(); f('ellipse', { cx: 0, cy: -104, rx: 7, ry: 5, fill: C.ink }); f('rect', { x: -5, y: -104, width: 10, height: 13, rx: 5, fill: '#E26B6B' }); }
      else if (st === 'brr') { squeeze(); f('path', { d: 'M-8 -104 L-4 -101 L0 -104 L4 -101 L8 -104', ...ink }); }
      else if (st === 'sleep') { closed(); f('path', { d: 'M-3 -104 Q0 -102 3 -104', ...ink }); }
      else if (st === 'yawn') { closed(); f('ellipse', { cx: 0, cy: -104, rx: 6, ry: 8, fill: C.ink }); }
      else if (st === 'o') { f('circle', { cx: -9, cy: -120, r: 5.5, fill: '#fff', stroke: C.ink, 'stroke-width': 2 }); f('circle', { cx: 9, cy: -120, r: 5.5, fill: '#fff', stroke: C.ink, 'stroke-width': 2 }); dots(2.6); f('ellipse', { cx: 0, cy: -104, rx: 4.5, ry: 6, fill: C.ink }); }
      else if (st === 'sorry') { dots(3, 2); f('path', { d: 'M-15 -125 L-5 -129 M15 -125 L5 -129', ...ink }); f('path', { d: 'M-6 -103 Q0 -107 6 -103', ...ink }); }
      else if (st === 'happy') { f('path', { d: 'M-13 -118 Q-9 -124 -5 -118', ...ink }); f('path', { d: 'M5 -118 Q9 -124 13 -118', ...ink }); f('path', { d: 'M-8 -107 Q0 -98 8 -107 Z', fill: C.bean }); }
      else { dots(); f('path', { d: 'M-7 -106 Q0 -100 7 -106', ...ink }); }
    };
    setFace('smile');
    return { setFace, legs, hand, arms };
  }

  /* 곰: 키 약 225(아빠 기준). kind: dad · mom · baby — 모양은 같고 크기(SIZE)와 옷만 다르다 */
  const BEAR = {
    dad: { name: '아빠 곰', fur: '#6B4A32', light: '#C9A27A', s: SIZE[0], voice: 120 },
    mom: { name: '엄마 곰', fur: '#8E6240', light: '#D9B48A', s: SIZE[1], voice: 240 },
    baby: { name: '아기 곰', fur: '#B0804F', light: '#EAD0A8', s: SIZE[2], voice: 520 },
  };
  function drawBear(T, g, kind) {
    const { paper, el } = T, b = BEAR[kind];
    if (artUrl('bear_' + kind)) { // 그림: 표정은 한 벌. 아기 곰만 우는 그림이 따로 있다
      const base = pic(T, g, 'bear_' + kind), cry = kind === 'baby' ? pic(T, g, 'bear_baby_cry') : null;
      if (cry) cry.style.display = 'none';
      T.el('rect', { x: -75, y: -228, width: 150, height: 228, fill: '#fff', opacity: 0 }, g);
      return { setFace: st => { if (!cry) return; cry.style.display = st === 'cry' ? '' : 'none'; base.style.display = st === 'cry' ? 'none' : ''; } };
    }
    paper(g, [
      ['circle', { cx: -36, cy: -206, r: 17, fill: b.fur }], ['circle', { cx: 36, cy: -206, r: 17, fill: b.fur }],
      ['circle', { cx: -36, cy: -206, r: 9, fill: b.light }], ['circle', { cx: 36, cy: -206, r: 9, fill: b.light }],
      ['rect', { x: -46, y: -54, width: 32, height: 54, rx: 14, fill: b.fur }], ['rect', { x: 14, y: -54, width: 32, height: 54, rx: 14, fill: b.fur }],
      ['ellipse', { cx: -60, cy: -104, rx: 17, ry: 38, fill: b.fur, transform: 'rotate(20 -60 -104)' }],
      ['ellipse', { cx: 60, cy: -104, rx: 17, ry: 38, fill: b.fur, transform: 'rotate(-20 60 -104)' }],
      ['ellipse', { cx: 0, cy: -98, rx: 64, ry: 62, fill: b.fur }],
      ['ellipse', { cx: 0, cy: -92, rx: 40, ry: 42, fill: b.light }],
      ['circle', { cx: 0, cy: -168, r: 48, fill: b.fur }],
      ['ellipse', { cx: 0, cy: -152, rx: 23, ry: 17, fill: b.light }],
    ]);
    if (kind === 'dad') paper(g, [['path', { d: 'M0 -124 L-24 -136 L-24 -112 Z M0 -124 L24 -136 L24 -112 Z', fill: C.bean }], ['circle', { cx: 0, cy: -124, r: 7, fill: C.bean }]]);
    if (kind === 'mom') paper(g, [['path', { d: 'M-32 -118 L32 -118 L42 -54 L-42 -54 Z', fill: C.persimmon }], ['circle', { cx: 40, cy: -214, r: 9, fill: C.pink }], ['circle', { cx: 40, cy: -214, r: 4, fill: C.gold }]]);
    if (kind === 'baby') paper(g, [['path', { d: 'M-40 -130 Q0 -110 40 -130 L36 -116 Q0 -96 -36 -116 Z', fill: C.pine }], ['path', { d: 'M18 -112 L30 -80 L40 -84 L30 -114 Z', fill: C.pine }]]);
    el('ellipse', { cx: 0, cy: -160, rx: 9, ry: 6, fill: C.ink }, g);
    const face = el('g', {}, g);
    const setFace = st => {
      face.innerHTML = '';
      const f = (t, a) => el(t, a, face);
      const ink = { stroke: C.ink, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' };
      if (st === 'o') {
        [-18, 18].forEach(x => { f('circle', { cx: x, cy: -182, r: 9, fill: '#fff', stroke: C.ink, 'stroke-width': 2.5 }); f('circle', { cx: x, cy: -182, r: 4.5, fill: C.ink }); });
        f('ellipse', { cx: 0, cy: -142, rx: 7, ry: 8, fill: C.ink });
      } else if (st === 'cry') {
        f('path', { d: 'M-26 -180 Q-18 -174 -10 -180', ...ink }); f('path', { d: 'M10 -180 Q18 -174 26 -180', ...ink });
        f('path', { d: 'M-10 -140 Q0 -150 10 -140 Z', fill: C.ink });
        [-20, 20].forEach(x => { const d = f('ellipse', { cx: x, cy: -168, rx: 5, ry: 8, fill: C.tear });
          d.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(30px)', opacity: 0 }], { duration: 900, iterations: Infinity }); });
      } else if (st === 'happy') {
        f('path', { d: 'M-26 -178 Q-18 -188 -10 -178', ...ink }); f('path', { d: 'M10 -178 Q18 -188 26 -178', ...ink });
        f('path', { d: 'M-12 -146 Q0 -132 12 -146 Z', fill: C.bean });
        f('circle', { cx: -30, cy: -160, r: 7, fill: C.pink, opacity: .7 }); f('circle', { cx: 30, cy: -160, r: 7, fill: C.pink, opacity: .7 });
      } else {
        f('circle', { cx: -18, cy: -180, r: 5.5, fill: C.ink }); f('circle', { cx: 18, cy: -180, r: 5.5, fill: C.ink });
        f('path', { d: 'M-10 -146 Q0 -138 10 -146', ...ink });
      }
    };
    setFace('smile');
    return { setFace };
  }

  /* ================= 소품 ================= */
  /* 옆에서 본 그릇 (바닥 = 0,0). 모두 같은 색 — 크기로만 주인을 찾는다 */
  function bowlSide(T, parent, x, y, s, { full = true } = {}) {
    const g = T.el('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
    if (artUrl('bowl') && artUrl('bowl_empty')) {
      T.el('rect', { x: -95, y: -110, width: 190, height: 120, fill: '#fff', opacity: 0 }, g);
      const fullP = pic(T, g, 'bowl'), emptyP = pic(T, g, 'bowl_empty');
      const setFull = v => { fullP.style.display = v ? '' : 'none'; emptyP.style.display = v ? 'none' : ''; };
      setFull(full);
      return { g, top: { setAttribute: (k, v) => { if (k === 'fill') setFull(v !== '#C9B48E'); } }, setFull };
    }
    T.el('rect', { x: -95, y: -80, width: 190, height: 90, fill: '#fff', opacity: 0 }, g);
    T.paper(g, [
      ['rect', { x: -30, y: -6, width: 60, height: 8, rx: 3, fill: C.bark }],
      ['path', { d: 'M-85 -62 H85 Q82 -2 0 0 Q-82 -2 -85 -62 Z', fill: C.cream }],
      ['path', { d: 'M-80 -40 Q0 -30 80 -40', stroke: C.bean, 'stroke-width': 8, fill: 'none' }],
    ]);
    const top = T.el('ellipse', { cx: 0, cy: -62, rx: 85, ry: 14, fill: full ? C.porridge : '#C9B48E' }, g);
    return { g, top, setFull(v) { top.setAttribute('fill', v ? C.porridge : '#C9B48E'); } };
  }
  /* 김 한 줄 */
  function steam(T, parent, x, y, s = 1) {
    const p = T.el('path', { d: 'M0 0 q-12 -18 0 -36 q12 -18 0 -36', stroke: C.snow, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round', opacity: .85,
      transform: `translate(${x},${y}) scale(${s})` }, parent);
    p.animate([{ translate: '0 0', opacity: .9 }, { translate: '0 -14px', opacity: .35 }, { translate: '0 0', opacity: .9 }], { duration: 1400 + Math.random() * 500, iterations: Infinity });
    return p;
  }
  /* 앞에서 본 의자 (바닥 가운데 = 0,0, 크기 s). setBroken(k): 0 = 멀쩡, 1 = 와르르 */
  function chair(T, parent, x, floorY, s, { cushion = false, tier } = {}) {
    const { el, paper } = T;
    const g = el('g', { transform: `translate(${x},${floorY}) scale(${s})` }, parent);
    el('rect', { x: -95, y: -300, width: 190, height: 305, fill: '#fff', opacity: 0 }, g);
    const ti = tier != null ? tier : s === 1 ? 0 : s > .6 ? 1 : 2, kn = ['big', 'mid', 'small'][ti];
    if (artUrl('chair_' + kn)) { // 그림: 작은 의자는 네 조각(등판·앉는 판·다리 둘)이라 부서지고 고쳐진다
      let parts = [];
      const pieces = ['back', 'legL', 'legR', 'seat'].map(k => 'chair_small_' + k);
      if (ti === 2 && pieces.every(artUrl)) {
        const ps = pieces.map(k => pic(T, g, k));
        parts = [[ps[0], -90, 150, -70, 0, -220], [ps[1], -40, 70, -85, -58, -75], [ps[2], 40, 70, 85, 58, -75], [ps[3], 0, 140, 8, 0, -150]];
      } else pic(T, g, 'chair_' + kn);
      const setBroken = k => parts.forEach(([n, dx, dy, r, cx, cy]) => n.setAttribute('transform', `translate(${dx * k},${dy * k}) rotate(${r * k} ${cx} ${cy})`));
      return { g, s, x, floorY, seatTop: floorY - CHAIR_SEAT[ti] * s, setBroken, art: true };
    }
    const wood = ['#6B4A32', '#8E6240', '#B0804F'][tier != null ? tier : s === 1 ? 0 : s > .6 ? 1 : 2];
    const back = paper(g, [['rect', { x: -70, y: -290, width: 140, height: 140, rx: 14, fill: wood }], ['rect', { x: -48, y: -266, width: 96, height: 16, rx: 6, fill: C.ink, opacity: .25 }]]);
    const legL = paper(g, [['rect', { x: -66, y: -150, width: 16, height: 150, rx: 4, fill: wood }]]);
    const legR = paper(g, [['rect', { x: 50, y: -150, width: 16, height: 150, rx: 4, fill: wood }]]);
    const seat = paper(g, [['rect', { x: -82, y: -162, width: 164, height: 22, rx: 6, fill: wood }]]);
    let cush = null;
    if (cushion) cush = paper(g, [['rect', { x: -80, y: -206, width: 160, height: 50, rx: 24, fill: C.persimmon }], ['circle', { cx: -30, cy: -182, r: 5, fill: C.amber }], ['circle', { cx: 30, cy: -182, r: 5, fill: C.amber }]]);
    const parts = [[back, -90, 150, -70, 0, -220], [legL, -40, 70, -85, -58, -75], [legR, 40, 70, 85, 58, -75], [seat, 0, 140, 8, 0, -150]];
    const setBroken = k => parts.forEach(([n, dx, dy, r, cx, cy]) => n.setAttribute('transform', `translate(${dx * k},${dy * k}) rotate(${r * k} ${cx} ${cy})`));
    return { g, s, x, floorY, seatTop: floorY - (cushion ? 206 : 162) * s, setBroken };
  }
  /* 위에서 본 침대 (가운데 x, 아래 끝 y). 이불은 top 층에 따로 — 골디락스가 그 사이에 눕는다 */
  function bedTop(T, baseL, topL, cx, bottomY, s, kind) {
    const { el, paper } = T;
    const bn = { hard: 'big', soft: 'mid', quilt: 'small' }[kind];
    if (artUrl('bed_' + bn) && artUrl(`bed_${bn}_blanket`)) { // 그림: 침대 한 장 + 이불만 오린 한 장(위층)
      const k = s * (window.matchMedia('(orientation: portrait)').matches ? 1.35 : 1.5), tf = `translate(${cx},${bottomY}) scale(${k})`;
      pic(T, el('g', { transform: tf }, baseL), 'bed_' + bn);
      const blanket = el('g', {}, topL);
      pic(T, el('g', { transform: tf }, blanket), `bed_${bn}_blanket`);
      const [bx, by, bw, bh] = BOX['bed_' + bn];
      el('rect', { x: cx + bx * k - 6, y: bottomY + by * k - 6, width: bw * k + 12, height: bh * k + 12, fill: '#fff', opacity: 0 }, blanket);
      const [px, py] = BED_PILLOW[bn];
      // 얼굴이 이불 윗단보다 22 위에 오게 (누운 그림의 얼굴 가운데 ≈ 머리끝에서 아래로, 발끝 기준 -125)
      return { blanket, cx, s, headX: cx + px * k, headY: bottomY + py * k - 22 - 25 * GOLDI_LIE, bottomY };
    }
    const w = 200 * s, h = 300 * s, x0 = cx - w / 2, y0 = bottomY - h;
    paper(baseL, [['rect', { x: x0 - 10, y: y0 - 14, width: w + 20, height: h + 20, rx: 10, fill: s === 1 ? C.bark : s > .6 ? '#8E6240' : '#B0804F' }],
      ['rect', { x: x0, y: y0, width: w, height: h, rx: 6, fill: C.cream }],
      ['rect', { x: x0 + w * .14, y: y0 + h * .05, width: w * .72, height: h * .17, rx: 12 * s, fill: C.snow }]]);
    const blanket = el('g', {}, topL);
    const by = y0 + h * .4;
    if (kind === 'hard') paper(blanket, [['rect', { x: x0, y: by, width: w, height: bottomY - by, rx: 4, fill: C.pine }], ['rect', { x: x0, y: by, width: w, height: 14, fill: C.cream }]]);
    else if (kind === 'soft') paper(blanket, [['rect', { x: x0 - 6, y: by - 6, width: w + 12, height: bottomY - by + 10, rx: 30, fill: C.persimmon }],
      ...[0, 1, 2].map(i => ['ellipse', { cx: x0 + w * (.2 + i * .3), cy: by + 34, rx: w * .16, ry: 18, fill: C.amber }])]);
    else paper(blanket, [['rect', { x: x0, y: by, width: w, height: bottomY - by, rx: 8, fill: C.gold }],
      ...[0, 1].map(i => ['rect', { x: x0 + 10, y: by + 20 + i * 34, width: w - 20, height: 6, rx: 3, fill: C.bean }])]);
    el('rect', { x: x0 - 10, y: y0 - 14, width: w + 20, height: h + 20, fill: '#fff', opacity: 0 }, blanket);
    return { blanket, cx, s, headY: y0 + h * .06, bottomY };
  }
  function bouquetFlower(T, parent, i) {
    const cols = [C.persimmon, C.pink, C.amber];
    const g = T.el('g', { transform: `rotate(${(i - 1) * 22})` }, parent);
    T.el('path', { d: 'M0 0 L0 -26', stroke: C.pine, 'stroke-width': 3 }, g);
    T.paper(g, [...[0, 72, 144, 216, 288].map(a => ['circle', { cx: Math.cos(a * Math.PI / 180) * 7, cy: -30 + Math.sin(a * Math.PI / 180) * 7, r: 6, fill: cols[i % 3] }]),
      ['circle', { cx: 0, cy: -30, r: 4, fill: C.gold }]]);
    return g;
  }

  /* ================= 배경 ================= */
  function fill(T, color) { return T.el('rect', { x: -400, y: -400, width: 1800, height: 1400, fill: color }, T.bg); }
  function logWall(T, pm) {
    fill(T, pm ? '#C99A66' : C.log);
    for (let i = 0; i < 14; i++) T.el('rect', { x: -400, y: -40 + i * 38, width: 1800, height: 5, fill: C.logLine, opacity: .6 }, T.bg);
  }
  function windowAt(T, x, y, w, h, pm) {
    T.paper(T.bg, [['rect', { x: x - 10, y: y - 10, width: w + 20, height: h + 20, rx: 6, fill: C.bark }], ['rect', { x, y, width: w, height: h, fill: pm ? '#F2C38A' : '#CFE0E6' }]]);
    if (!pm) T.paper(T.bg, [['circle', { cx: x + w * .7, cy: y + h * .35, r: 18, fill: '#F6D98A' }]]);
    else T.paper(T.bg, [['circle', { cx: x + w * .3, cy: y + h * .7, r: 26, fill: C.persimmon }]]);
    T.el('rect', { x: x + w / 2 - 4, y, width: 8, height: h, fill: C.bark }, T.bg);
    T.el('rect', { x, y: y + h / 2 - 4, width: w, height: 8, fill: C.bark }, T.bg);
  }
  function floorAt(T, y, color = C.floor) {
    T.paper(T.bg, [['rect', { x: -400, y, width: 1800, height: 800, fill: color }]]);
    for (let i = 1; i < 5; i++) T.el('rect', { x: -400, y: y + i * 24, width: 1800, height: 3, fill: C.ink, opacity: .18 }, T.bg);
  }
  function kitchenBG(T, pm = false) {
    if (bgImage(T, 'kitchen')) { // 그림. 오후는 노을빛 색덮개
      if (pm) { const r = T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: '#F2A65A', opacity: .26 }, T.bg); r.style.mixBlendMode = 'multiply'; }
      return;
    }
    logWall(T, pm);
    windowAt(T, 690, 110, 180, 150, pm);
    // 난로와 솥
    T.paper(T.bg, [['rect', { x: 40, y: 250, width: 190, height: 225, rx: 10, fill: '#5A3D29' }], ['rect', { x: 70, y: 340, width: 130, height: 110, rx: 50, fill: C.ink }],
      ['path', { d: 'M90 450 Q110 380 135 430 Q150 370 175 450 Z', fill: C.persimmon }], ['rect', { x: 110, y: 60, width: 50, height: 195, fill: '#5A3D29' }]]);
    T.paper(T.bg, [['path', { d: 'M92 216 H178 Q176 256 135 258 Q94 256 92 216 Z', fill: C.ink }], ['rect', { x: 86, y: 208, width: 98, height: 12, rx: 5, fill: '#4a3a30' }]]);
    // 벽 선반과 그릇
    T.paper(T.bg, [['rect', { x: 330, y: 150, width: 260, height: 12, fill: C.bark }]]);
    [[370, 1], [450, .72], [520, .5]].forEach(([x, s]) => T.paper(T.bg, [['circle', { cx: x, cy: 150 - 34 * s, r: 34 * s, fill: C.cream }]]));
    floorAt(T, 470, pm ? '#94693F' : C.floor);
    if (pm) T.el('rect', { x: -400, y: -400, width: 1800, height: 1400, fill: C.amber, opacity: .18 }, T.bg);
  }
  /* 숲 그림 속 먼 통나무집: 그 자리만 오린 같은 그림 한 겹 → 코드가 살짝 키웠다 줄인다(어? 저기 집이!) */
  const CABIN = { x: 757, y: 284, box: [680, 186, 156, 104] };
  function forestBG(T, hx = 900) {
    const { paper, el } = T, b = T.bg;
    if (bgImage(T, 'forest')) {
      const house = el('g', { transform: `translate(${CABIN.x},${CABIN.y}) scale(1)` }, b);
      const inner = el('g', { transform: `translate(${-CABIN.x},${-CABIN.y})` }, house);
      const cp = el('clipPath', { id: 'glCabin' }, b); const [cx, cy, cw, ch] = CABIN.box; el('rect', { x: cx, y: cy, width: cw, height: ch, rx: 8 }, cp);
      bgImage(T, 'forest', { parent: inner }).setAttribute('clip-path', 'url(#glCabin)');
      Object.assign(house, { ax: CABIN.x, ay: CABIN.y, as: 1 });
      return house;
    }
    fill(T, '#DCE8C8');
    el('circle', { cx: 150, cy: 90, r: 40, fill: '#F6D98A' }, b);
    for (let i = 0; i < 12; i++) paper(b, [['path', { d: `M${-40 + i * 95} 400 L${10 + i * 95} ${170 + (i % 3) * 40} L${60 + i * 95} 400 Z`, fill: i % 2 ? C.pine : '#557F5E' }]]);
    // 먼 곳 통나무집 (걷다 보면 보인다)
    const house = el('g', { transform: `translate(${hx},392) scale(.55)`, opacity: .9 }, b);
    paper(house, [['rect', { x: -80, y: -100, width: 160, height: 100, fill: C.bark }], ['path', { d: 'M-100 -96 L0 -170 L100 -96 Z', fill: C.bean }], ['rect', { x: 14, y: -64, width: 34, height: 64, fill: '#4E3524' }], ['rect', { x: -60, y: -76, width: 36, height: 30, fill: C.amber }]]);
    paper(b, [['rect', { x: -400, y: 390, width: 1800, height: 600, fill: C.leaf }]]);
    paper(b, [['path', { d: 'M-400 520 Q200 470 500 480 Q800 470 1400 460 V530 Q800 540 500 530 Q200 540 -400 560 Z', fill: '#D9C58E' }]]);
    return house;
  }
  function forestFront(T) {
    const { paper } = T, w = T.world;
    if (bgUrl('forest')) return; // 그림: 버섯·꽃은 배경 앞쪽에 있다
    paper(w, [['rect', { x: 60, y: 470, width: 40, height: 120, rx: 14, fill: C.cream }], ['path', { d: 'M-10 490 Q80 360 170 490 Z', fill: C.bean }],
      ['circle', { cx: 50, cy: 450, r: 12, fill: C.cream }], ['circle', { cx: 110, cy: 430, r: 9, fill: C.cream }], ['circle', { cx: 130, cy: 468, r: 8, fill: C.cream }]]);
    paper(w, [['path', { d: 'M960 600 L960 400', stroke: C.pine, 'stroke-width': 10 }], ['path', { d: 'M960 420 Q900 380 940 350 Q960 330 980 350 Q1020 380 960 420 Z', fill: C.persimmon }],
      ['ellipse', { cx: 930, cy: 480, rx: 30, ry: 12, fill: C.leaf, transform: 'rotate(-30 930 480)' }]]);
    paper(w, [['path', { d: 'M820 600 Q840 520 870 600 Z', fill: C.pine }], ['path', { d: 'M180 600 Q200 540 230 600 Z', fill: C.pine }]]);
  }
  /* 그림 속 문: 아치 모양 그대로 오린 같은 그림 한 겹이 문짝 (왼쪽 경첩을 축으로 열린다) */
  const DOOR_D = 'M416 473 V262 Q416 187 500 187 Q583 187 583 262 V473 Z';
  function doorBG(T) {
    const { paper, el } = T, b = T.bg;
    if (bgImage(T, 'door')) {
      const inside = paper(b, [['path', { d: DOOR_D, fill: C.amber }]]);
      paper(b, [['path', { d: 'M440 473 V300 Q440 230 500 230 Q560 230 560 300 V473 Z', fill: '#E9A35A', opacity: .7 }]]);
      const door = el('g', {}, b);
      const cp = el('clipPath', { id: 'glDoor' }, b); el('path', { d: DOOR_D }, cp);
      bgImage(T, 'door', { parent: door }).setAttribute('clip-path', 'url(#glDoor)');
      el('path', { d: DOOR_D, fill: '#fff', opacity: 0 }, door);
      door.style.transformBox = 'view-box'; door.style.transformOrigin = '416px 0px'; door.style.transition = 'transform .9s ease-in-out';
      return { door, inside };
    }
    fill(T, '#CFE0E6');
    // 아래에서 올려다본 통나무 벽: 위로 갈수록 좁아진다
    paper(b, [['path', { d: 'M-60 560 L130 -20 L870 -20 L1060 560 Z', fill: C.log }]]);
    for (let i = 0; i < 12; i++) { const y = 540 - i * 48, k = (560 - y) / 580; el('path', { d: `M${-60 + 190 * k} ${y} H${1060 - 190 * k}`, stroke: C.logLine, 'stroke-width': 6, opacity: .7 }, b); }
    paper(b, [['path', { d: 'M330 490 L360 70 Q500 10 640 70 L670 490 Z', fill: '#2E1F16' }]]);
    const inside = paper(b, [['path', { d: 'M345 490 L372 84 Q500 30 628 84 L655 490 Z', fill: C.amber }]]);
    const door = paper(b, [['path', { d: 'M345 490 L372 84 Q500 30 628 84 L655 490 Z', fill: '#5A3D29' }],
      ...[0, 1, 2, 3].map(i => ['rect', { x: 380 + i * 64, y: 100, width: 10, height: 380, fill: C.ink, opacity: .3 }]),
      ['circle', { cx: 610, cy: 300, r: 14, fill: C.gold }]]);
    el('rect', { x: 345, y: 40, width: 310, height: 450, fill: '#fff', opacity: 0 }, door);
    door.style.transformBox = 'view-box'; door.style.transformOrigin = '345px 0px'; door.style.transition = 'transform .9s ease-in-out';
    paper(b, [['rect', { x: -400, y: 490, width: 1800, height: 400, fill: C.leaf }], ['rect', { x: 300, y: 488, width: 400, height: 22, rx: 6, fill: '#8C7B6B' }]]);
    return { door, inside };
  }
  function tableTopBG(T) {
    const { paper, el } = T;
    if (bgImage(T, 'table')) return;
    fill(T, '#5A3D29');
    paper(T.bg, [['rect', { x: 20, y: 30, width: 960, height: 520, rx: 26, fill: C.log }]]);
    for (let i = 1; i < 8; i++) el('rect', { x: 20, y: 30 + i * 65, width: 960, height: 4, fill: C.logLine, opacity: .6 }, T.bg);
  }
  function bowlTop(T, parent, cx, cy, r) {
    const g = T.el('g', {}, parent);
    if (artUrl('bowl_top') && artUrl('bowl_top_empty')) { // 그림: 그릇 원(지름 2r)을 (cx,cy)에 맞춘다. 숟가락은 오른쪽으로 삐져 나온다. 다 먹으면 빈 그릇으로
      const put = (key, d, icx, icy, iw, ih) => { const k = 2 * r / d; return pic(T, g, key, { box: [cx - icx * k, cy - icy * k, iw * k, ih * k] }); };
      const full = put('bowl_top', 411.5, 214.2, 214.2, 520, 428), empty = put('bowl_top_empty', 453.8, 234.5, 234.5, 520, 469);
      empty.style.display = 'none';
      g.setEmpty = () => { full.style.display = 'none'; empty.style.display = ''; };
      return g;
    }
    T.paper(g, [['circle', { cx, cy, r, fill: C.cream }], ['circle', { cx, cy, r: r * .8, fill: C.porridge }]]);
    T.el('circle', { cx, cy, r: r * .9, fill: 'none', stroke: C.bean, 'stroke-width': 5 }, g);
    T.paper(g, [['rect', { x: cx + r * .9, y: cy - 6, width: r * .9, height: 12, rx: 6, fill: '#9A938C' }]]);
    return g;
  }
  function livingBG(T) {
    if (bgImage(T, 'living')) return;
    logWall(T);
    windowAt(T, 400, 90, 200, 150);
    T.paper(T.bg, [['rect', { x: 780, y: 110, width: 110, height: 90, fill: C.bark }], ['rect', { x: 792, y: 122, width: 86, height: 66, fill: C.cream }]]);
    // 액자 속 곰 가족 (큰 · 중간 · 작은 동그라미)
    [[808, 22], [838, 16], [862, 11]].forEach(([x, r]) => T.paper(T.bg, [['circle', { cx: x, cy: 176 - r, r, fill: C.bark }]]));
    floorAt(T, 470);
    T.paper(T.bg, [['ellipse', { cx: 500, cy: 520, rx: 420, ry: 40, fill: C.bean, opacity: .75 }]]);
  }
  function bedroomTopBG(T) {
    if (bgImage(T, 'bed_top')) return;
    fill(T, '#A87A4E');
    for (let i = 0; i < 12; i++) T.el('rect', { x: -40 + i * 90, y: -400, width: 4, height: 1400, fill: C.logLine, opacity: .6 }, T.bg);
    T.paper(T.bg, [['ellipse', { cx: 560, cy: 500, rx: 120, ry: 50, fill: C.pine, opacity: .8 }]]);
  }
  function bedroomSideBG(T, wx = 80) {
    if (bgImage(T, 'bed_side', { dx: wx + 50 })) return; // 그림 속 창문(가운데 x≈25)이 wx+75에 오도록 민다
    logWall(T);
    windowAt(T, wx, 150, 150, 190);
    floorAt(T, 470);
  }
  /* 옆 탁자 (부엌 그림엔 탁자가 없다). 윗면 y = top, 폭 w. 그림은 다리를 잘라 낮게 구운 것 */
  function sideTable(T, x, top, w) {
    if (artUrl('table')) { const h = w * 271 / 520; return pic(T, T.world, 'table', { box: [x, top - h * .032, w, h] }); }
    return T.paper(T.world, [['rect', { x, y: top, width: w, height: 18, rx: 6, fill: C.bark }], ['rect', { x: x + 20, y: top + 18, width: 16, height: 110, fill: C.bark }], ['rect', { x: x + w - 36, y: top + 18, width: 16, height: 110, fill: C.bark }]]);
  }
  /* 앞쪽 식탁 (화면 폭 전체, 인물 앞에 온다). 윗단 y = top. 그림이면 윗단이 420이 아니라 440 — 그릇·곰 자리는 TABLE_TOP()으로 */
  const TABLE_TOP = () => (artUrl('table_front') ? 440 : 420);
  function tableFront(T, top) {
    if (artUrl('table_front')) { const w = 1100, h = w * 535 / 1400; return pic(T, T.world, 'table_front', { box: [-50, top - h * .019, w, h] }); }
    return T.paper(T.world, [['rect', { x: -400, y: top, width: 1800, height: 200, fill: C.bark }], ['rect', { x: -400, y: top, width: 1800, height: 14, fill: '#8E6240' }]]);
  }
  /* 옆에서 본 아기 곰 침대 (머리맡이 왼쪽). 그림: 매트리스 윗선 y≈398, 베개 x 359~410 */
  const BED_SIDE_ART = () => !!artUrl('bed_side_small');
  function bedSide(T) {
    const { paper, el } = T;
    if (BED_SIDE_ART()) return pic(T, T.world, 'bed_side_small', { box: [340, 290, 320, 198] });
    paper(T.world, [['rect', { x: 360, y: 300, width: 26, height: 190, rx: 8, fill: '#B0804F' }], ['rect', { x: 614, y: 360, width: 22, height: 130, rx: 8, fill: '#B0804F' }],
      ['rect', { x: 370, y: 396, width: 260, height: 40, rx: 8, fill: C.cream }], ['rect', { x: 366, y: 432, width: 268, height: 18, fill: '#B0804F' }],
      ['ellipse', { cx: 420, cy: 390, rx: 40, ry: 16, fill: C.snow }]]);
  }
  function blanketSide(T) {
    if (artUrl('bed_side_blanket')) { // 그림 이불: 골디락스 가슴부터 발판 앞까지 (탭 목표)
      const g = T.el('g', {}, T.world);
      pic(T, g, 'bed_side_blanket', { box: [440, 308, 215, 104] });
      T.el('rect', { x: 425, y: 285, width: 250, height: 160, fill: '#fff', opacity: 0 }, g);
      return g;
    }
    const g = T.paper(T.world, [['path', { d: 'M468 440 L468 380 Q540 356 630 380 L634 444 Z', fill: C.gold }], ['rect', { x: 490, y: 400, width: 130, height: 6, rx: 3, fill: C.bean }], ['rect', { x: 490, y: 420, width: 130, height: 6, rx: 3, fill: C.bean }]]);
    T.el('rect', { x: 380, y: 330, width: 260, height: 130, fill: '#fff', opacity: 0 }, g);
    return g;
  }

  /* ================= 소리 ================= */
  const giggle = T => [0, .12, .24, .36].forEach((w, i) => T.tone([620 - i * 40, 520 - i * 40], .1, { type: 'triangle', vol: .12, when: w }));
  const thud = T => AudioFX.sfx('thud') || T.tone([120, 60], .25, { type: 'sine', vol: .25 });
  const knock = T => AudioFX.sfx('knock') || (T.tone([220, 160], .08, { type: 'square', vol: .2 }), T.tone([220, 160], .08, { type: 'square', vol: .2, when: .18 }));
  const hot = T => { T.tone([500, 1300], .25, { type: 'triangle', vol: .14 }); T.tone([1300, 900], .2, { type: 'triangle', vol: .12, when: .25 }); };
  const brr = T => { for (let i = 0; i < 8; i++) T.tone(i % 2 ? 300 : 340, .06, { type: 'square', vol: .07, when: i * .07 }); };
  const snore = T => { T.tone([140, 110], .6, { type: 'sine', vol: .12 }); T.tone([600, 900], .4, { type: 'sine', vol: .06, when: .7 }); };
  const blow = T => AudioFX.sfx('blow', .9) || T.tone([900, 300], .3, { type: 'sine', vol: .1 });

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, actor, camTo, camSnap, josa } = T;
    /* 세로 화면(무대 양옆이 잘림): 카메라를 조금 물리고(Z) 가로 자리를 가운데로 모은다(K) */
    const P = () => window.matchMedia('(orientation: portrait)').matches;
    const K = .7, Z = .62;
    const X = x => P() ? Math.round(500 + (x - 500) * K) : x;
    /* 의성어: 지금 카메라가 보여 주는 폭 안에 들어오게 x를 조인다 (세로 화면에서 '딱딱해!'가 왼쪽에 잘리던 것) */
    const pop = (x, y, w, c) => {
      const cam = T.camera, z = Math.max(1e-3, cam.z), half = T.viewWidth() / z / 2, m = Math.min(half - 10, (30 + [...w].length * 24) / Math.max(1, z));
      return T.pop(Math.min(cam.x + half - m, Math.max(cam.x - half + m, x)), y, w, c);
    };
    const view = () => camSnap(500, 280, P() ? Z : 1);
    const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
    /* 그림 미리 불러오기: 첫 장면(부엌·곰·그릇) 그림만 기다리고(최대 2.5초) 나머지는 뒤에서. 못 불러온 그림은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads['bg_' + k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    Object.keys(ART).filter(k => ART[k]).forEach(k => { loads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    await Promise.race([Promise.all(['bg_kitchen', 'goldi_walk', 'bear_dad', 'bear_mom', 'bear_baby', 'bowl', 'bowl_empty'].map(k => loads[k]).filter(Boolean)), sleep(2500)]);
    const cutArt = (key, draw, o = {}) => (artUrl(key) ? T.cutImage([{ src: artUrl(key), sfx: o.sfx, hold: o.hold || 2600 }], { hold: o.hold || 2600 }) : T.cut(draw, o));

    /* 배우: 안쪽 '자세' 층(lean)으로 눕기·기울기를 hop과 겹치지 않게 */
    const mk = draw => {
      let lean, api;
      const a = actor(T.world, -300, 500, g => {
        lean = el('g', {}, g);
        lean.style.transformBox = 'view-box'; lean.style.transformOrigin = '0 0'; lean.style.transition = 'transform .3s ease-out';
        api = draw(lean);
      });
      Object.assign(a, api, { lean });
      a.pose = tf => { a.lean.style.transform = tf || ''; };
      return a;
    };
    const goldi = mk(g => drawGoldi(T, g));
    goldi.name = '골디락스';
    /* 그림: 눕기(-90° 돌리기)는 누운 그림으로 바꾼다. 앉기·눕기 자세는 setMode */
    const gmode = m => goldi.setMode && goldi.setMode(m);
    if (goldi.art) { const pose0 = goldi.pose; goldi.pose = tf => { if (/rotate/.test(tf || '')) { gmode('side'); pose0(''); } else { if (!tf) gmode('stand'); pose0(tf); } }; }
    const bears = {};
    ['dad', 'mom', 'baby'].forEach(k => { bears[k] = mk(g => drawBear(T, g, k)); Object.assign(bears[k], BEAR[k], { key: k }); });
    const B = [bears.dad, bears.mom, bears.baby];
    /* 대사 연출: 목소리 주인에게 카메라. 모두 앞모습 그림이라 돌려세우지 않는다(noFace).
       골디락스는 아기 곰에게, 곰들은 골디락스에게 (골디락스가 없으면 곰 가족끼리) */
    T.director({
      cast: { goldi, ...bears },
      listener: r => (r === 'goldi' ? 'baby' : goldi.pos.isConnected ? 'goldi' : r === 'baby' ? 'mom' : 'baby'),
      noFace: ['goldi', 'dad', 'mom', 'baby'],
    });
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); }; // 말풍선 없는 소리 대사
    const cutVo = k => setTimeout(() => vo(k), 380);
    const put = (a, x, y, s = 1, parent = T.world) => {
      parent.appendChild(a.pos); a.setScale(s); a.place(x, y); a.pose(''); a.body.style.transform = ''; a.pos.style.opacity = '';
      if (a.setFace) a.setFace('smile');
    };
    const headY = a => a.y - (a === goldi ? 150 : 215) * a.scale;
    const stars = (x, y) => {
      const g = el('g', {}, T.fx);
      for (let k = 0; k < 3; k++) el('path', { d: 'M0 -10 L3 -3 10 -3 4 2 6 10 0 5 -6 10 -4 2 -10 -3 -3 -3 Z', fill: '#FFD54F', transform: `rotate(${k * 120}) translate(26 0)` }, g);
      g.animate([{ transform: `translate(${x}px,${y}px) rotate(0deg)` }, { transform: `translate(${x}px,${y}px) rotate(360deg)` }], { duration: 1100, iterations: Infinity });
      return g;
    };
    /* 아무 순서로나 다 톡 (각각 한 번씩) — 5초 지나면 남은 친구가 들썩인다 */
    async function tapAll(list, { prompt, onTap }) {
      const left = list.slice();
      while (left.length) {
        const nudge = setTimeout(() => left.forEach(a => a.pos.animate([{ translate: '0 0' }, { translate: '0 -14px' }, { translate: '0 0' }], { duration: 700, iterations: 2 })), 5000);
        const o = await T.choose(left.map(a => ({ el: a.pos, ok: true, a })), { prompt });
        clearTimeout(nudge);
        left.splice(left.indexOf(o.a), 1);
        await onTap(o.a);
      }
    }
    /* 짝 맞추기: 물건을 보여주고 → 주인 곰을 골라요 */
    async function whoseIs(item, owner, q, what) {
      const i = B.indexOf(owner);
      await say(q);
      return T.choose(B.map(b => ({ el: b.pos, ok: b === owner, onWrong: async () => {
        b.setFace('o'); await b.wiggle(10, 500); b.setFace('smile');
        await say(`${b.name}: "내 ${what}${what === '그릇' ? '은' : '는'} 더 ${B.indexOf(b) < i ? '커요' : '작아요'}~"`);
      } })), { prompt: q, where: `${SNAME[i]} ${what}${what === '그릇' ? '은' : '는'} ${['가장 큰', '중간', '가장 작은'][i]} 곰 거예요.`,
        who: `${josa(owner.name, '이에요/예요')}! 반짝이는 곰을 눌러요.` });
    }

    /* ---------- 1. 곰 집 아침 (부엌 와이드) ---------- */
    kitchenBG(T);
    sideTable(T, 680, 360, 260);
    SIZE.forEach((s, i) => bowlSide(T, T.world, 730 + i * 85, 360, s * .6));
    put(bears.dad, X(280), 500); put(bears.mom, X(470), 500, SIZE[1]); put(bears.baby, X(620), 500, SIZE[2]);
    view();
    await T.curtain(true);
    await say('숲속 통나무집에 곰 세 식구가 살았어요.');
    await say('곰 가족을 톡 눌러서 인사해요!');
    await tapAll(B, { prompt: '곰을 톡 눌러서 안녕!', onTap: async b => {
      vo('hi_' + b.key); b.setFace('happy'); b.hop(24, 420);
      pop(b.x, headY(b) - 40, '안녕!', b.key === 'dad' ? C.bark : b.key === 'mom' ? C.persimmon : C.pine);
      await sleep(700);
    } });
    await say('아빠 곰은 굵은 목소리, 아기 곰은 가느다란 목소리예요.');

    /* ---------- 2. 앗 뜨거 (식탁 클로즈업) ---------- */
    let bowlsG, steams = [];
    await T.sceneCard('앗 뜨거!', () => {
      T.clear(); kitchenBG(T);
      const TT = TABLE_TOP(), BY = TT + 30; // 식탁 윗단 · 그릇 바닥 (곰 발은 식탁 뒤에 숨는다)
      put(bears.dad, X(230), 520, 1.2); put(bears.mom, 500, TT + 50, .86); put(bears.baby, X(770), TT + 12, .6);
      tableFront(T, TT);
      bowlsG = el('g', {}, T.world);
      el('rect', { x: 100, y: 160, width: 800, height: BY - 150, fill: '#fff', opacity: 0 }, bowlsG);
      steams = [];
      [230, 500, 770].map(X).forEach((x, i) => {
        bowlSide(T, bowlsG, x, BY, SIZE[i]);
        for (let k = 0; k < 3; k++) steams.push(steam(T, bowlsG, x + (k - 1) * 40 * SIZE[i], BY - BOWL_RIM() * SIZE[i], SIZE[i] * 1.1));
      });
      view();
    }, bears.mom.pos);
    await say('엄마 곰이 맛있는 죽을 끓였어요. 그런데 너무 뜨거워요!');
    await say('톡톡 눌러서 후후 불어 줘요!');
    await T.mash(bowlsG, { count: 6, prompt: '죽을 톡톡 눌러서 후후!', onStep: i => {
      const b = B[(i - 1) % 3];
      b.setFace('o'); setTimeout(() => b.setFace('smile'), 500);
      blow(T); pop(b.x, 300, '후~', C.pine);
      const s = steams.splice(Math.floor(Math.random() * steams.length), 1)[0];
      s && s.animate([{ opacity: .9 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
    } });
    await sleep(400);
    await say('김이 줄었지만, 아직 뜨거워요.');
    await say('아빠 곰: "죽이 식을 동안 산책 다녀오자!"');
    B.forEach((b, i) => setTimeout(() => b.move(b.x + 900, b.y, 1400, 'ease-in'), i * 150));
    AudioFX.sfx('step_wood', .5);
    await sleep(1400);

    /* ---------- 3. 숲길 골디락스 (눈높이) ---------- */
    let area, butterfly, house, groundFlowers = [];
    await T.sceneCard('숲길', () => {
      T.clear(); house = forestBG(T, X(900));
      put(goldi, X(200), 505, 1.3); if (goldi.setHold) goldi.setHold(false); // 꽃을 따기 전엔 빈손
      butterfly = el('g', {}, T.world);
      const wings = artUrl('butterfly') ? pic(T, butterfly, 'butterfly', { box: [-22, -16, 44, 32] })
        : T.paper(butterfly, [['ellipse', { cx: -9, cy: 0, rx: 10, ry: 14, fill: C.persimmon }], ['ellipse', { cx: 9, cy: 0, rx: 10, ry: 14, fill: C.persimmon }], ['rect', { x: -2, y: -10, width: 4, height: 20, rx: 2, fill: C.ink }]]);
      wings.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(.3)' }, { transform: 'scaleX(1)' }], { duration: 300, iterations: Infinity });
      butterfly.style.transform = `translate(${X(120)}px,260px)`;
      forestFront(T);
      groundFlowers = [1, 2, 3].map(i => {
        const fg = el('g', { transform: `translate(${X(200 + i * 170) + 48},508)` }, T.world);
        if (!pic(T, fg, 'flower_g')) bouquetFlower(T, fg, i - 1);
        return fg;
      });
      area = el('rect', { x: -400, y: -400, width: 1800, height: 1400, fill: '#fff', opacity: 0 }, T.world);
      view();
    }, goldi.pos);
    await say('숲속에는 금빛 머리 골디락스가 살았어요.');
    await say('옆으로 쓱 밀어서 같이 걸어요!');
    const NUM = ['하나', '둘', '셋'];
    // 걸어와 멈추면 발치에 꽃이 피고, 허리를 숙여 꺾으면 손으로 쏙 올라간다
    const pickFlower = async (nx, i) => {
      const fx = nx + 85, tf = (x, y, k) => `translate(${x}px,${y}px) scale(${k})`;
      const fl = el('g', {}, T.world); fl.style.transform = tf(fx, 508, .01);
      bouquetFlower(T, fl, 1);
      await sleep(650);
      if (!fl.isConnected) return;
      fl.animate([{ transform: tf(fx, 508, .01) }, { transform: tf(fx, 508, 1.8) }], { duration: 350, easing: 'ease-out', fill: 'forwards' });
      await sleep(250);
      if (goldi.art) { goldi.setBend(true); setTimeout(() => goldi.setBend(false), 800); }
      else goldi.body.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(22deg)' }, { transform: 'rotate(22deg)' }, { transform: 'rotate(0)' }], { duration: 900, easing: 'ease-in-out' });
      await sleep(450);
      T.tone([600, 900], .12, { type: 'sine', vol: .1 });
      fl.animate([{ transform: tf(fx, 508, 1.8) }, { transform: tf(nx + 28, 430, .9) }], { duration: 450, easing: 'ease-in', fill: 'forwards' });
      await sleep(450);
      fl.remove();
    };
    await T.swipe(area, { dir: 'right', count: 3, prompt: '옆으로 쓱! 골디락스랑 걸어요.', onStep: i => {
      const nx = X(200 + i * 170);
      goldi.move(nx, 505, 600); goldi.hop(18, 300);
      AudioFX.sfx('step_grass', .6) || T.tone(300, .1);
      pickFlower(nx, i);
      const fl = groundFlowers[i - 1];
      setTimeout(() => { // 도착하면 허리를 숙여 꽃을 쏙 뽑는다
        if (!goldi.art) goldi.lean.style.transform = 'rotate(26deg) scale(1,.9)';
        setTimeout(() => {
          fl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, fill: 'forwards' });
          AudioFX.sfx('pop', .6) || T.tone(700, .1);
          pop(nx, 200, `꽃 ${NUM[i - 1]}!`, C.persimmon);
        }, 260);
        setTimeout(() => { goldi.lean.style.transform = ''; }, 620);
      }, 620);
      butterfly.animate([{ transform: butterfly.style.transform }, { transform: `translate(${nx - 60}px,${230 - (i % 2) * 40}px)` }], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
      butterfly.style.transform = `translate(${nx - 60}px,${230 - (i % 2) * 40}px)`;
    } });
    area.remove();
    if (goldi.setHold) goldi.setHold(true);
    await sleep(700);
    goldi.setFace('o');
    const hx = house.ax != null ? house.ax : X(900), hy = house.ay != null ? house.ay : 392, hs = house.as || .55;
    house.animate([{ transform: `translate(${hx}px,${hy}px) scale(${hs})` }, { transform: `translate(${hx}px,${hy}px) scale(${hs * 1.27})` }, { transform: `translate(${hx}px,${hy}px) scale(${hs})` }], { duration: 900 });
    await say('꽃을 세 송이 땄어요. 어? 저기 통나무집이 있어요!');

    /* ---------- 4. 커다란 문 (로우앵글) ---------- */
    let door;
    await T.sceneCard('똑똑똑', () => {
      T.clear(); door = doorBG(T).door;
      put(goldi, X(790), 530, 1.1);
      view();
    }, goldi.pos);
    await say('우와, 커다란 문이에요. 문을 톡 두드려 봐요.');
    await T.tap(door, { prompt: '문을 톡! 똑똑 두드려요.' });
    for (let k = 0; k < 2; k++) { knock(T); pop(X(560), 200 + k * 60, '똑똑!', C.bark); await sleep(650); }
    await say('골디락스: "계세요?"');
    await sleep(600);
    await say('아무 대답이 없어요.');
    AudioFX.sfx('creak') || T.tone([300, 180], .8, { type: 'sawtooth', vol: .08 });
    door.style.transform = 'scaleX(.12)';
    pop(500, 150, '삐걱~', C.bark);
    await sleep(900);
    goldi.setFace('o');
    await say('문이 삐걱 열렸어요. 골디락스가 살짝 들어가 봤어요.');
    AudioFX.sfx('step_wood', .5);
    goldi.pos.style.transition = 'opacity .8s'; goldi.pos.style.opacity = '0';
    await goldi.move(520, 490, 900);
    goldi.pos.style.transition = '';

    /* ---------- 5. 죽 세 그릇 (식탁 하이앵글) ---------- */
    let tops = [];
    await T.sceneCard('죽 세 그릇', () => {
      T.clear(); tableTopBG(T);
      const bx = [230, 510, 780].map(X), R = 110;
      tops = bx.map((x, i) => bowlTop(T, T.world, x, 230, R * SIZE[i]));
      for (let k = 0; k < 4; k++) steam(T, tops[0], bx[0] - 50 + k * 34, 250, 1.3);
      [[-26, -14], [18, -26], [4, 22], [-10, 6]].forEach(([dx, dy], k) => T.paper(tops[1], [['rect', { x: bx[1] + dx - 11, y: 230 + dy - 11, width: 22, height: 22, rx: 4, fill: C.snow, stroke: '#CFE0E6', 'stroke-width': 3, transform: `rotate(${k * 20} ${bx[1] + dx} ${230 + dy})` }]]));
      steam(T, tops[2], bx[2], 240, .7);
      put(goldi, 500, P() ? 715 : 600, 1.25);
      view();
    }, goldi.pos);
    await say('식탁 위에 죽이 세 그릇 있어요.');
    const q5 = '딱 좋은 죽은 어느 걸까요?';
    await say(q5);
    let cutHot = false, cutCold = false;
    await T.choose([
      { el: tops[0], ok: false, onWrong: async () => {
        goldi.setFace('tongue'); hot(T); goldi.hop(30, 400); pop(X(300), 150, '앗 뜨거!', C.bean);
        if (!cutHot) { cutHot = true; await sleep(500); cutVo('cut_hot'); await cutArt('cut_hot', svg => cutFace(T, svg, 'tongue', '앗 뜨거!'), { hold: 2000 }); }
        await say('펄펄 너무 뜨거워요!'); giggle(T); goldi.setFace('smile');
      } },
      { el: tops[1], ok: false, onWrong: async () => {
        goldi.setFace('brr'); brr(T); goldi.wiggle(6, 400); pop(500, 120, '으 차가워!', C.indigo);
        if (!cutCold) { cutCold = true; await sleep(500); cutVo('cut_cold'); await cutArt('cut_cold', svg => cutFace(T, svg, 'brr', '부르르!'), { hold: 2000 }); }
        await say('얼음처럼 너무 차가워요!'); giggle(T); goldi.setFace('smile');
      } },
      { el: tops[2], ok: true },
    ], { prompt: q5, where: '김이 펄펄 나면 뜨겁고, 얼음이 있으면 차가워요.', who: '김이 살짝 나는 작은 그릇이에요!' });
    goldi.setFace('happy');
    for (let k = 0; k < 3; k++) { AudioFX.chomp(); pop(X(760), 130, '냠냠!', C.persimmon); await sleep(500); }
    if (tops[2].setEmpty) tops[2].setEmpty();
    else { const inner = tops[2].querySelectorAll('circle')[1]; if (inner) inner.setAttribute('fill', '#C9B48E'); }
    [...tops[2].querySelectorAll('path')].forEach(p => p.remove()); // 김
    await say('딱 좋아요! 냠냠, 작은 그릇을 다 먹어 버렸어요.');

    /* ---------- 6. 의자 세 개 (거실 와이드) ---------- */
    let chairs = [], cushFront;
    const sitOn = (c, dy = 0) => { gmode('sit'); goldi.place(c.x, c.seatTop + 38 * goldi.scale + dy); };
    await T.sceneCard('의자 세 개', () => {
      T.clear(); livingBG(T);
      chairs = [chair(T, T.world, X(190), 500, SIZE[0]), chair(T, T.world, X(480), 500, SIZE[1], { cushion: true }), chair(T, T.world, X(790), 500, SIZE[2])];
      put(goldi, X(640), 510, 1);
      view();
    }, goldi.pos);
    await say('이번엔 의자가 세 개 있어요.');
    const q6 = '딱 맞는 의자는 어느 걸까요?';
    await say(q6);
    const back = async () => { gmode('stand'); goldi.setFace('smile'); await goldi.move(X(640), 510, 500); };
    await T.choose([
      { el: chairs[0].g, ok: false, onWrong: async () => {
        AudioFX.boing(); sitOn(chairs[0]); goldi.hop(40, 400);
        goldi.setFace('o');
        goldi.legs.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(14deg)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(0deg)' }], { duration: 600, iterations: 3 });
        pop(chairs[0].x, 120, '달랑달랑~', C.persimmon);
        await say('너무 높아요! 다리가 달랑달랑.'); giggle(T); await back();
      } },
      { el: chairs[1].g, ok: false, onWrong: async () => {
        sitOn(chairs[1]); goldi.setFace('o'); AudioFX.boing();
        cushFront = T.paper(T.world, [['ellipse', { cx: chairs[1].x, cy: chairs[1].seatTop + 30, rx: 70, ry: 30, fill: chairs[1].art ? '#F28C1C' : C.persimmon }]]);
        cushFront.style.opacity = '0'; cushFront.style.transition = 'opacity .4s'; void cushFront.getBoundingClientRect(); cushFront.style.opacity = '1';
        await goldi.move(chairs[1].x, goldi.y + 46, 600, 'ease-in');
        pop(chairs[1].x, 180, '폭신~', C.persimmon);
        await say('너무 푹신해서 쏙 파묻혔어요!'); giggle(T);
        cushFront.remove(); await back();
      } },
      { el: chairs[2].g, ok: true },
    ], { prompt: q6, where: '너무 크지도, 너무 푹신하지도 않은 의자예요.', who: '작은 의자예요! 반짝이는 의자를 눌러요.' });
    sitOn(chairs[2]); goldi.hop(16, 300); goldi.setFace('happy');
    await say('딱 맞아요! 그런데…');
    await sleep(300);
    cutVo('cut_crack');
    await cutArt('cut_crack', svg => cutCrack(T, svg), { hold: 1800, sfx: 'pow' });
    AudioFX.sfx('chop') || AudioFX.bonk();
    chairs[2].setBroken(1);
    goldi.setFace('o');
    await goldi.move(chairs[2].x, 505, 250, 'ease-in');
    thud(T); T.shake(); pop(chairs[2].x - 110, 300, '쿵!', C.bean);
    const st6 = stars(chairs[2].x, 340);
    giggle(T);
    await say('뿌지직! 작은 의자가 부서져서 엉덩방아를 찧었어요.');
    st6.remove();

    /* ---------- 7. 침대 세 개 (2층 하이앵글) ---------- */
    let beds = [], baseL, topL;
    const lieIn = bd => { const s = goldi.art ? GOLDI_LIE : .8; gmode('lie'); goldi.setScale(s); goldi.place(bd.headX != null ? bd.headX : bd.cx, bd.headY + 150 * s); };
    await T.sceneCard('침대 세 개', () => {
      T.clear(); bedroomTopBG(T);
      baseL = el('g', {}, T.world); const midL = el('g', {}, T.world); topL = el('g', {}, T.world);
      const bxs = P() ? (artUrl('bed_big') ? [285, 535, 740] : [290, 500, 700]) : [190, 470, 790];
      const bY = bgUrl('bed_top') && artUrl('bed_big') ? 545 : 470; // 그림: 침대 머리맡이 벽 쪽 바닥선에 닿게 조금 아래로
      beds = [bedTop(T, baseL, topL, bxs[0], bY, SIZE[0], 'hard'), bedTop(T, baseL, topL, bxs[1], bY, SIZE[1], 'soft'), bedTop(T, baseL, topL, bxs[2], bY, SIZE[2], 'quilt')];
      put(goldi, X(630), 540, .8, midL);
      view();
    }, goldi.pos);
    goldi.setFace('yawn');
    await say('하암, 졸려요. 위층에 침대가 세 개 있어요.');
    goldi.setFace('smile');
    const q7 = '딱 좋은 침대는 어느 걸까요?';
    await say(q7);
    const backBed = async () => { gmode('stand'); goldi.setScale(.8); goldi.setFace('smile'); goldi.place(X(630), 540); await sleep(200); };
    await T.choose([
      { el: beds[0].blanket, ok: false, onWrong: async () => {
        lieIn(beds[0]); goldi.setFace('o');
        await goldi.hop(40, 380); AudioFX.bonk(); await goldi.hop(20, 300); AudioFX.bonk();
        pop(beds[0].cx, 130, '딱딱해!', C.bark);
        await say('너무 딱딱해요!'); await backBed();
      } },
      { el: beds[1].blanket, ok: false, onWrong: async () => {
        lieIn(beds[1]); goldi.setFace('o');
        goldi.body.animate([{ transform: 'scale(1)' }, { transform: 'scale(.8)' }, { transform: 'scale(.85)' }], { duration: 700, fill: 'forwards' });
        AudioFX.boing(); pop(beds[1].cx, 150, '푹신푹신~', C.persimmon);
        await say('너무 푹신해요!'); giggle(T);
        goldi.body.getAnimations().forEach(a => a.cancel()); await backBed();
      } },
      { el: beds[2].blanket, ok: true },
    ], { prompt: q7, where: '딱딱하지도, 너무 푹신하지도 않은 침대예요.', who: '작은 침대예요! 반짝이는 침대를 눌러요.' });
    lieIn(beds[2]); goldi.setFace('happy');
    /* 브람스 〈자장가〉(1868, 공개 곡) — 오르골 소리. 한 소절을 들려주고, 침대를 꾹 누르고 있는 동안 다음 소절이 이어진다 */
    const LULL1 = T.parseSong('E4:.5 E4:.5 G4:2 E4:.5 E4:.5 G4:2 E4:.5 G4:.5 C5:1 B4:1 A4:.5 A4:.5 G4:2');
    const LULL2 = T.parseSong('A4:.5 A4:.5 C5:2 A4:.5 A4:.5 C5:2 A4:.5 C5:.5 F5:1 E5:1 D5:.5 D5:.5 C5:3');
    const box = T.timbre('box');
    const lullVoice = (n, d) => box(T.hz(n), d, 0, .22);
    const lullNote = i => pop(beds[2].cx - 50 + (i % 5) * 26, 150 - (i % 3) * 14, '♪', C.indigo);
    await say('딱 좋아요! 자장가를 들려줄게요. 잘 들어 봐요.');
    await T.playMelody(LULL1, { beat: .65, voice: lullVoice, onNote: lullNote });
    await sleep(400);
    await say('이번에는 침대를 꾹 누르고 있어요. 자장가가 이어져요!');
    let yawned = false, slept = false;
    await T.holdMelody(LULL2, { beat: .65, target: beds[2].blanket, voice: lullVoice, onNote: i => {
      lullNote(i);
      if (i >= 3 && !yawned) { yawned = true; goldi.setFace('yawn'); pop(beds[2].cx, 180, '하암~', C.indigo); T.tone([500, 300], .8, { type: 'sine', vol: .1 }); }
      if (i >= 9 && !slept) { slept = true; goldi.setFace('sleep'); }
    } });
    goldi.setFace('sleep');
    snore(T); pop(beds[2].cx, 200, '쿨쿨', C.indigo);
    await say('골디락스는 쿨쿨 잠이 들었어요.');

    /* ---------- 8. 곰 가족 귀가: 그릇 주인 찾기 (곰 눈높이) ---------- */
    const floor8 = 530;
    await T.sceneCard('곰 가족이 왔어요', () => {
      T.clear(); kitchenBG(T);
      sideTable(T, 330, 330, 340);
      shuffle([200, 500, 800].map(X)).forEach((x, i) => put(B[i], x, floor8, SIZE[i]));
      view();
    }, bears.dad.pos);
    await say('그때 곰 가족이 산책에서 돌아왔어요.');
    bears.dad.setFace('o');
    await say('아빠 곰: "누가 내 죽을 먹었지?"');
    bears.dad.setFace('smile');
    await say('그릇이 뒤죽박죽이에요. 주인을 찾아 줘요!');
    for (let i = 0; i < 3; i++) {
      const owner = B[i];
      const card = T.paper(T.fx, [['circle', { cx: 500, cy: 205, r: 105, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
      card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
      const bw = bowlSide(T, T.fx, 500, 250, SIZE[i], { full: false });
      bw.g.animate([{ opacity: 0, translate: '0 -40px' }, { opacity: 1, translate: '0 0' }], { duration: 400, easing: 'ease-out' });
      AudioFX.sfx('pop', .5);
      await whoseIs(bw.g, owner, `이 ${SNAME[i]} 그릇은 누구 거예요?`, '그릇');
      const tx = owner.x, ty = floor8 - 40 * owner.scale;
      card.remove();
      await T.anim(bw.g, [{ transform: `translate(500px,250px) scale(${SIZE[i]})` }, { transform: `translate(${tx}px,${ty}px) scale(${SIZE[i]})` }], { duration: 600, easing: 'ease-in-out' });
      owner.hop(20, 360);
      if (i < 2) { owner.setFace('happy'); vo('mine_' + owner.key); pop(owner.x, headY(owner) - 30, '내 거!', C.pine); await sleep(900); }
    }
    bears.baby.setFace('cry'); AudioFX.whimper();
    pop(bears.baby.x, headY(bears.baby) - 30, '으앙!', C.bean);
    await say('아기 곰: "내 죽을 다 먹어 버렸어!"');
    bears.mom.setFace('o');
    await say('누가 먹었을까요?');
    [...T.fx.children].forEach(n => n.remove());

    /* ---------- 9. 의자 주인 찾기 (거실 와이드) ---------- */
    let ch9 = [];
    await T.sceneCard('의자 주인', () => {
      T.clear(); livingBG(T);
      const pt = P();
      const cx9 = pt ? [280, 470, 640] : [120, 300, 450], cy9 = pt ? 440 : 500, cs9 = pt ? .8 : 1;
      ch9 = SIZE.map((s, i) => chair(T, T.world, cx9[i], cy9, s * cs9, { cushion: i === 1, tier: i }));
      ch9[2].setBroken(1);
      shuffle(pt ? [300, 500, 700] : [610, 770, 910]).forEach((x, i) => put(B[i], x, pt ? 548 : 530, SIZE[i]));
      view();
    }, bears.baby.pos);
    await say('의자도 누구 건지 찾아 줘요.');
    for (let i = 0; i < 2; i++) {
      const c = ch9[i];
      c.g.style.filter = 'url(#hintGlow)';
      c.g.animate([{ translate: '0 0' }, { translate: '0 -16px' }, { translate: '0 0' }], { duration: 600, iterations: 2 });
      await whoseIs(c.g, B[i], `이 ${SNAME[i]} 의자는 누구 거예요?`, '의자');
      c.g.style.filter = '';
      B[i].hop(20, 360); vo('chair_' + B[i].key); B[i].setFace('happy');
      pop(B[i].x, headY(B[i]) - 30, '내 의자!', C.pine);
      await sleep(900);
    }
    ch9[2].g.animate([{ translate: '0 0' }, { translate: '-6px 0' }, { translate: '6px 0' }, { translate: '0 0' }], { duration: 400, iterations: 2 });
    bears.baby.setFace('cry'); AudioFX.whimper();
    await say('아기 곰: "으앙, 내 의자가 부서졌어!"');
    if (!P()) { bears.baby.move(530, 548, 600); bears.mom.move(595, 546, 600); }
    bears.mom.hop(20, 400); bears.mom.setFace('happy');
    await sleep(700);
    await say('엄마 곰이 아기 곰을 꼭 안아 주었어요.');
    snore(T);
    B.forEach(b => b.setFace('o'));
    await say('그런데 위층에서 쿨쿨 소리가 나요.');

    /* ---------- 10. 누가 내 침대에? (아기 곰 시점, 침대 머리맡) ---------- */
    let blanket, paw;
    const winX = bgUrl('bed_side') ? (P() ? 140 : 10) : (P() ? 170 : 80); // 그림: 배경 속 창문 자리
    await T.sceneCard('누가 내 침대에?', () => {
      T.clear(); bedroomSideBG(T, winX);
      bedSide(T);
      put(goldi, BED_SIDE_ART() ? 505 : 548, BED_SIDE_ART() ? 385 : 386, .85); // 그림 침대: 머리가 베개(x≈385) 위에
      goldi.pose('rotate(-90deg)'); goldi.setFace('sleep');
      blanket = blanketSide(T);
      const pwx = P() ? 590 : 700;
      if (artUrl('bear_paw')) { paw = T.el('g', {}, T.fx); pic(T, paw, 'bear_paw', { box: [pwx - 60, 455, 120, 257] }); } // 그림 발: 아래에서 발가락이 쑥
      else paw = T.paper(T.fx, [['ellipse', { cx: pwx, cy: 560, rx: 70, ry: 60, fill: BEAR.baby.fur }], ['ellipse', { cx: pwx, cy: 540, rx: 30, ry: 22, fill: BEAR.baby.light }],
        ...[-34, 0, 34].map(d => ['circle', { cx: pwx + d, cy: 506, r: 12, fill: BEAR.baby.light }])]);
      camSnap(510, 400, 1.8);
    }, goldi.pos);
    const zz = setInterval(() => pop(420, 330, 'Z', C.indigo), 1600);
    snore(T);
    await say('아기 곰이 살금살금 가 보니, 누가 자고 있어요!');
    await say('이불을 톡 눌러 봐요.');
    paw.animate([{ translate: '0 0' }, { translate: '-20px -20px' }, { translate: '0 0' }], { duration: 900 });
    await T.tap(blanket, { prompt: '아기 곰이랑 이불을 톡!' });
    clearInterval(zz);
    paw.remove();
    goldi.pose(''); goldi.setFace('o');
    goldi.place(500, 400); goldi.hop(50, 450);
    AudioFX.boing();
    pop(500, 300, '깜짝!', C.bean);
    if (P()) { put(bears.dad, 738, 520, SIZE[0]); put(bears.mom, 676, 530, SIZE[1]); put(bears.baby, 626, 540, SIZE[2]); } // 세로: 아빠 곰 오른쪽 끝이 잘리지 않게
    else { put(bears.dad, 910, 520, SIZE[0]); put(bears.mom, 790, 520, SIZE[1]); put(bears.baby, 690, 520, SIZE[2]); }
    B.forEach(b => b.setFace('o'));
    await camTo(500, 280, P() ? Z : 1, 700);
    cutVo('cut_eyes');
    await cutArt('cut_eyes', svg => cutEyes(T, svg), { hold: 2400 });
    await say('골디락스와 곰 세 마리 눈이 딱 마주쳤어요!');
    AudioFX.whoosh();
    await goldi.move(winX + 75, 470, 700, 'ease-in');
    await goldi.move(winX + 75, 380, 300, 'ease-out');
    cutVo('cut_skirt');
    await cutArt('cut_skirt', svg => cutSkirt(T, svg), { hold: 2200 });
    pop(winX + 80, 170, '앗!', C.bean);
    giggle(T);
    await say('창문으로 나가려다 치마가 딱 걸렸어요!');
    await goldi.move(winX + 120, 505, 400, 'ease-in');
    goldi.setFace('sorry');
    await say('골디락스가 돌아서서 말했어요. "미안해요."');

    /* ---------- 11. 미안해요 · 함께 고치기 (부엌 오후) ---------- */
    let fix, hammer;
    await T.sceneCard('미안해요', () => {
      T.clear(); kitchenBG(T, true);
      const lx = P() ? [300, 430, 540, 640, 770] : [330, 500, 650, 770, 910];
      put(bears.dad, lx[4], 510, SIZE[0]); put(bears.mom, lx[3], 510, SIZE[1]);
      put(goldi, lx[0], 510, 1); goldi.setFace('sorry');
      fix = chair(T, T.world, lx[1], 510, SIZE[2]); fix.setBroken(1);
      put(bears.baby, lx[2], 515, SIZE[2]); bears.baby.setFace('cry');
      hammer = T.el('g', {}, T.fx);
      if (artUrl('hammer')) pic(T, hammer, 'hammer', { box: [-30, -33, 60, 142] }); // 머리 가운데가 (0,-15)
      else T.paper(hammer, [['rect', { x: -5, y: -10, width: 10, height: 60, rx: 4, fill: C.bark }], ['rect', { x: -22, y: -24, width: 44, height: 18, rx: 4, fill: '#9A938C' }]]);
      hammer.setAttribute('transform', `translate(${fix.x - 70},380) rotate(-30)`); hammer.style.opacity = '0';
      view();
    }, goldi.pos);
    await say('골디락스: "허락 없이 들어와서 미안해요."');
    bears.dad.setFace('happy');
    await say('아빠 곰: "괜찮아. 다음엔 똑똑 하고 기다려 줘."');
    goldi.setFace('smile');
    await say('골디락스: "아기 곰 의자, 같이 고칠래?"');
    bears.baby.setFace('smile'); bears.baby.hop(20);
    await say('톡톡 눌러서 뚝딱뚝딱 고쳐요!');
    hammer.style.opacity = '1';
    await T.mash(fix.g, { count: 5, prompt: '의자를 톡톡! 뚝딱뚝딱.', onStep: i => {
      knock(T);
      hammer.animate([{ transform: `translate(${fix.x - 70}px,380px) rotate(-30deg)` }, { transform: `translate(${fix.x - 50}px,400px) rotate(20deg)` }, { transform: `translate(${fix.x - 70}px,380px) rotate(-30deg)` }], { duration: 300 });
      fix.setBroken(1 - i / 5);
      pop(fix.x, 250, '뚝딱!', C.bark);
      (i % 2 ? goldi : bears.baby).hop(16, 300);
    } });
    hammer.remove();
    await sleep(400);
    AudioFX.sfx('ding') || AudioFX.ding();
    pop(fix.x, 300, '짠!', C.persimmon);
    goldi.setFace('happy'); bears.baby.setFace('happy');
    await say('짠! 의자가 다 고쳐졌어요.');
    await say('아기 곰: "고마워! 우리 친구 하자!"');

    /* 새 죽 나눠 먹기: 작은 그릇부터 차례대로 톡 */
    let tb = [];
    await T.sceneCard(null, () => {
      T.clear(); kitchenBG(T, true);
      const TT = TABLE_TOP();
      put(bears.dad, X(170), 525, 1.15); put(bears.mom, X(390), TT + 52, .82); put(goldi, X(610), TT + 42, 1.1); put(bears.baby, X(820), TT + 12, .6);
      [bears.dad, bears.mom, goldi, bears.baby].forEach(a => a.setFace('happy'));
      tableFront(T, TT);
      const xs = shuffle([240, 500, 760].map(X));
      tb = SIZE.map((s, i) => Object.assign(bowlSide(T, T.world, xs[i], TT + 70, s, { full: false }), { x: xs[i], y: TT + 70, s, i }));
      view();
    }, goldi.pos);
    await say('엄마 곰이 새 죽을 끓였어요. 다 함께 먹어요!');
    await say('가장 작은 그릇부터 차례대로 톡 눌러요.');
    const order = [tb[2], tb[1], tb[0]];
    const qs = ['가장 작은 그릇은 어느 걸까요?', '그다음은 중간 그릇!', '마지막은 가장 큰 그릇!'];
    const done = new Set();
    for (let k = 0; k < 3; k++) {
      const good = order[k];
      if (k > 0) await say(qs[k]);
      await T.choose(tb.filter(b => !done.has(b)).map(b => ({ el: b.g, ok: b === good, onWrong: async () => {
        await T.anim(b.g, [{ translate: '0 0' }, { translate: '0 -20px' }, { translate: '0 0' }], 360);
        await say(`"나는 다음이야~"`);
      } })), { prompt: qs[k], where: `${SNAME[good.i]} 그릇을 찾아요.`, who: `${SNAME[good.i]} 그릇이 반짝반짝! 눌러 봐요.` });
      done.add(good);
      good.setFull(true);
      steam(T, T.world, good.x, good.y - BOWL_RIM() * good.s, good.s);
      const tag = T.paper(T.fx, [['circle', { cx: good.x - 85 * good.s - 30, cy: good.y - 40, r: 24, fill: C.cream, stroke: C.gold, 'stroke-width': 4 }]]);
      el('text', { x: good.x - 85 * good.s - 30, y: good.y - 30, 'text-anchor': 'middle', 'font-size': 28, fill: C.bean, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: k + 1 }, tag);
      T.tone(440 + k * 110, .25, { type: 'triangle', vol: .16 });
    }
    T.finale();
    await say('작은 그릇, 중간 그릇, 큰 그릇! 차례대로 담았어요.');
    [...T.fx.children].forEach(n => n.remove());
    const gb = bowlSide(T, T.world, X(610), TABLE_TOP() + 102, .55, { full: true });
    gb.g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
    await say('골디락스 그릇도 하나 더! 다 함께 냠냠.');
    [bears.dad, bears.mom, goldi, bears.baby].forEach((a, i) => setTimeout(() => { a.hop(20, 320); AudioFX.chomp(); }, i * 180));
    pop(500, 200, '냠냠!', C.persimmon);
    T.confetti(); AudioFX.sfx('bell', .5);
    await sleep(900);
    await say('골디락스와 곰 가족은 사이좋은 친구가 되었답니다.');
    await gomSeMari(T, [bears.dad, bears.mom, bears.baby], goldi);
    return '"미안해요" 하면 다시 친구가 될 수 있어요!';
  }

  /* 마지막 노래: 〈곰 세 마리〉 (작사·작곡 미상의 동요). 녹음 대신 우리 소리로 직접 연주하고, 부르는 곰이 폴짝 뛴다 */
  async function gomSeMari(T, [dad, mom, baby], goldi) {
    const HZ = { 도: 261.63, 레: 293.66, 미: 329.63, 솔: 392, 라: 440 };
    /* 음 이름:박자 (1 = 4분음표). 말하듯 짧게 붙다가 구절 끝에서 길게 늘어난다 */
    const LINES = [
      ['곰세마리가한집에있어', '도:1 도:1 도:.5 도:.5 도:1 미:.5 솔:.5 솔:.5 미:.5 도:2', null],
      ['아빠곰엄마곰애기곰', '솔:.5 솔:.5 미:1 솔:.5 솔:.5 미:1 도:1 도:1 도:2', [dad, dad, dad, mom, mom, mom, baby, baby, baby]],
      ['아빠곰은뚱뚱해', '솔:.5 솔:.5 미:.5 도:.5 솔:.5 솔:.5 솔:1.5', dad],
      ['엄마곰은날씬해', '솔:.5 솔:.5 미:.5 도:.5 솔:.5 솔:.5 솔:1.5', mom],
      ['애기곰은너무귀여워', '솔:.5 솔:.5 미:.5 도:.5 솔:.5 솔:.5 솔:.5 라:.5 솔:2', baby],
      ['히쭉히쭉잘한다', '도:.5 솔:.5 도:.5 솔:.5 미:.5 레:.5 도:2', baby],
    ];
    const SHOW = ['곰 세 마리가 한 집에 있어', '아빠 곰 엄마 곰 애기 곰', '아빠 곰은 뚱뚱해', '엄마 곰은 날씬해', '애기 곰은 너무 귀여워', '히쭉히쭉 잘한다'];
    const BEAT = .52;
    const svg = T.fx;
    for (let li = 0; li < LINES.length; li++) {
      const [syl, notes, who] = LINES[li];
      svg.replaceChildren();
      const shown = T.tr(SHOW[li]), en = shown !== SHOW[li];
      const parts = shown.split(' ');
      const t = T.el('text', { x: 500, y: 74, 'text-anchor': 'middle', 'font-size': 46, 'font-weight': 800, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 9 }, svg);
      const spans = []; let i = 0;
      if (en) parts.forEach((w, wi) => { const sp = T.el('tspan', { fill: C.pine }, t); sp.textContent = (wi ? ' ' : '') + w; spans.push(sp); });
      else parts.forEach((w, wi) => [...w].forEach((ch, ci) => {
        const sp = T.el('tspan', { fill: C.pine }, t); sp.textContent = (wi && !ci ? ' ' : '') + ch; spans.push(sp); i++;
      }));
      const seq = notes.split(' ').map(x => x.split(':'));
      for (let k = 0; k < seq.length; k++) {
        const hz = HZ[seq[k][0]];
        const last = k === seq.length - 1;
        const dur = BEAT * +seq[k][1];
        T.tone(hz, dur * .9, { type: 'triangle', vol: .24 });
        T.tone(hz * 2, dur * .5, { type: 'sine', vol: .05 });
        const sp = spans[en ? Math.floor(k * spans.length / seq.length) : k];
        if (sp) sp.setAttribute('fill', C.bean);
        const a = Array.isArray(who) ? who[k] : who;
        if (a) a.hop(last ? 26 : 16, 280); else if (dur >= BEAT) goldi.hop(12, 240);
        await T.sleep(dur * 1000);
      }
    }
    svg.replaceChildren();
    T.confetti();
    await T.sleep(600);
  }

  /* ================= 만화 컷 (400×300) ================= */
  function cutText(T, svg, word, y = 62) {
    T.el('text', { x: 200, y, 'text-anchor': 'middle', 'font-size': 56, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr(word) }, svg);
  }
  function cutFace(T, svg, face, word) {
    const g = T.el('g', { transform: 'translate(200,560) scale(3.3)' }, svg);
    drawGoldi(T, g).setFace(face);
    if (face === 'tongue') for (let k = 0; k < 3; k++) T.el('path', { d: `M${60 + k * 20} 140 q-8 -14 0 -28 q8 -14 0 -28`, stroke: C.snow, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, svg);
    else [[40, 1], [360, -1]].forEach(([x, d]) => T.el('path', { d: `M${x} 110 l${10 * d} 12 l${-10 * d} 12 l${10 * d} 12 l${-10 * d} 12`, stroke: C.snow, 'stroke-width': 5, fill: 'none' }, svg));
    cutText(T, svg, word);
  }
  function cutCrack(T, svg) {
    const c = chair(T, svg, 200, 290, .8);
    c.setBroken(.5);
    T.el('path', { d: 'M150 150 L180 176 L160 196 L196 226', stroke: '#FFD54F', 'stroke-width': 7, fill: 'none', 'stroke-linejoin': 'round' }, svg);
    T.el('path', { d: 'M250 150 L222 180 L246 198 L210 228', stroke: '#FFD54F', 'stroke-width': 7, fill: 'none', 'stroke-linejoin': 'round' }, svg);
    cutText(T, svg, '뿌지직!');
  }
  function cutEyes(T, svg) {
    const g = T.el('g', { transform: 'translate(80,420) scale(2)' }, svg);
    drawGoldi(T, g).setFace('o');
    [[240, 250, .55], [300, 270, .5], [360, 280, .4]].forEach(([x, y, s], i) => {
      const b = T.el('g', { transform: `translate(${x},${y + 10}) scale(${s})` }, svg);
      drawBear(T, b, ['dad', 'mom', 'baby'][i]).setFace('o');
    });
    T.el('path', { d: 'M130 170 L220 160', stroke: '#FFD54F', 'stroke-width': 6, 'stroke-dasharray': '10 8' }, svg);
    cutText(T, svg, '깜짝!', 56);
  }
  function cutSkirt(T, svg) {
    T.paper(svg, [['rect', { x: 60, y: 40, width: 280, height: 260, fill: C.bark }], ['rect', { x: 80, y: 60, width: 240, height: 240, fill: '#CFE0E6' }]]);
    T.paper(svg, [['path', { d: 'M150 60 L250 60 L300 250 L100 250 Z', fill: C.bean }], ['path', { d: 'M170 100 L230 100 L250 230 L150 230 Z', fill: C.cream }]]);
    T.el('rect', { x: 80, y: 250, width: 240, height: 50, fill: C.bark }, svg);
    T.paper(svg, [['circle', { cx: 290, cy: 250, r: 9, fill: '#9A938C' }], ['path', { d: 'M284 244 L304 236 L300 258 Z', fill: C.bean }]]);
    T.el('path', { d: 'M318 216 l18 -10 M322 236 l22 0 M318 256 l18 10', stroke: '#FFD54F', 'stroke-width': 6, 'stroke-linecap': 'round' }, svg);
    cutText(T, svg, '앗, 치마가!', 64);
  }

  Tale.mount({ title: '골디락스와 곰 세 마리', subtitle: '크다, 중간, 작다!', run: T => run(Tale.api) });
})();
