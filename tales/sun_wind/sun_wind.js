/* 해와 바람 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §13 (8장면, 약 5분)
   누가 나그네 외투를 벗길까? 쓱쓱 세게 부는 바람에는 외투를 꽉 여미고, 꾹 따뜻한 햇볕에는 스스로 벗는다.
   순화: 바람은 심술궂지 않은 볼 빵빵 장난꾸러기. 외투는 바람에 절대 벗겨지지 않는다.
   해 · 바람은 사물 캐릭터라 정면 얼굴을 허용한다(디자인 시스템 §5). */
(() => {
  const C = { cream: '#F6ECD8', gold: '#D9A94E', persimmon: '#E8703A', bean: '#A93B32', bark: '#6B4A32', pine: '#3F6B4F',
    indigo: '#1F2A56', lav: '#8B7BB8', snow: '#F4F6FA', amber: '#F2B366', ink: '#2E241C', pink: '#E8A0A0', skin: '#F3D2B0',
    hair: '#3D2B1F', leaf: '#6E9A5B', stone: '#9A9186', pants: '#5a3d29', shirt: '#6E9A5B', collar: '#8e2f28',
    sunDisk: '#F6D98A', cloudBack: '#C9D8E6', rain: '#7F93A6', road: '#D9B77A', grass: '#7c9a58' };
  const SKY = { day: '#CFE3EE', warm: '#F6D9A0', grey: '#AFC0CC', snow: '#DCE3EA', rain: '#9FB0BE', hot: '#F9E3A8' };

  /* ================= 페이퍼아트 그림 (assets/v3w/sw_*.webp) =================
     null이거나 파일을 못 불러오면 그 자리는 아래 임시 도형(그레이박스)으로 그린다. 새 그림이 나오면 여기 한 줄만 바꾸면 된다.
     배경은 장면마다 한 장을 무대에 꽉 채워 깐다. 들길(field)은 바람·해님 차례·날씨 놀이·쨍쨍한 날·분할 화면에 같이 쓰고,
     하늘빛은 그림 위에 곱하기(multiply)로 얹는 색 한 겹(tint)이 바꾼다. */
  const AS = '../../assets/';
  const BG = {
    /* 화려한 다층 재기획(VISUAL_PLAN.md, 2026-10-23): 하늘은 라이트박스(지평선 빛·구름 바다), 부감 길·나무·바위·전나무는 옛 그림과 겹쳐 같은 자리.
       들길 라이트박스 둘(fieldBG lb): 바람 차례 = 은빛 바람 들판, 해님 차례 = 바람 들판에서 햇살 들판으로 톡톡마다 크로스페이드(틴트·덮개 대신) */
    sky: 'v3w/sw_lb_sky.webp', high: 'v3w/sw_bg_high_v2.webp', field: 'v3w/sw_bg_field_v2.webp',
    stream: 'v3w/sw_bg_stream_v2.webp', snow: 'v3w/sw_bg_snow_v2.webp',
    lb_wind: 'v3w/sw_lb_field_wind.webp', lb_sun: 'v3w/sw_lb_field_sun.webp',
  };
  /* 층 소품 sw_layer_*: [이름, 가운데 x, 발끝 y, 높이, 폭/높이, {mid(배우 뒤), flip, sway(바람 흔들림), lb('wind'|'sun')}]. 앞 소품은 배우 앞(T.fx), 누름 없음 */
  const LAYERS = {
    sky: [['cloud_front', 120, 600, 150, 2.6946], ['cloud_front', 500, 600, 150, 2.6946, { flip: true }], ['cloud_front', 880, 600, 150, 2.6946]],
    field: [['grass_front', 30, 590, 90, 1.0933]],
    stream: [['reeds_stream', 880, 560, 180, .7433, { mid: true }]],
    snowbush: [['snow_bush', 30, 590, 120, 1.2567]],
    wind: [['tree_bent', 40, 590, 280, 1.2944, { mid: true, sway: true, lb: 'wind' }], ['grass_front', 980, 590, 90, 1.0933, { flip: true, sway: true, lb: 'wind' }],
      ['wheat_front', 980, 590, 200, .8517, { lb: 'sun' }]],
  };
  function layers(T, key) {
    return (LAYERS[key] || []).map(([n, x, y, h, asp, o = {}]) => {
      const w = h * asp, g = T.el('g', { class: 'sw-layer', 'pointer-events': 'none', transform: `translate(${x} ${y})${o.flip ? ' scale(-1 1)' : ''}` }, o.mid ? T.bg : T.fx);
      const im = T.el('image', { href: AS + `v3w/sw_layer_${n}.webp`, x: -w / 2, y: -h, width: w, height: h, filter: 'url(#pp)' }, g);
      if (o.sway) { im.style.transformBox = 'fill-box'; im.style.transformOrigin = '50% 100%'; im.animate([{ transform: 'rotate(-1.5deg)' }, { transform: 'rotate(3deg)' }], { duration: 900, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' }); }
      if (o.lb) g.dataset.lb = o.lb;
      return g;
    });
  }
  /* 배우·소품·컷
     - trav_walk_nohat: 걷기 그림의 머리(모자)를 '덜덜' 그림 머리로 바꿔 붙인 것 (바람에 모자가 날아간 뒤, 외투는 아직 열림)
     - trav_sit: 신발을 살색으로 칠해 맨발로 (개울에 발을 담근다)
     - hat: 얼굴 달린 노란 덩어리 위의 모자만 오린 것(다시 뽑은 sw_hat은 납작한 보터 모자라 나그네 머리의 둥근 모자와 달라 안 씀) · coat: 다시 뽑은 얼굴 없는 긴 외투(360×435)
     - shirt(배지): 반팔 그림 몸통에서 팔·목 살색을 지운 것
     - cloud_snow: 얼굴 없는 새 눈구름(구름+눈송이 셋) · cloud_rain: 그 구름 몸통만 회청색으로 (빗방울은 코드)
     - cut_pant: 다시 뽑은 헉헉 컷(sw_cut_pant2 — 지친 바람, 혀 내밀고 땀) */
  const ART = {
    sun: 'v3w/sw_sun.webp', wind: 'v3w/sw_wind.webp', wind_blow: 'v3w/sw_wind_blow.webp', wind_tired: 'v3w/sw_wind_tired.webp',
    trav_walk: 'v3w/sw_trav_walk.webp', trav_walk_nohat: 'v3w/sw_trav_walk_nohat.webp', trav_hold: 'v3w/sw_trav_hold.webp',
    trav_fan: 'v3w/sw_trav_fan.webp', trav_shoulder: 'v3w/sw_trav_shoulder.webp', trav_shirt: 'v3w/sw_trav_shirt.webp',
    trav_sit: 'v3w/sw_trav_sit.webp', trav_scarf: 'v3w/sw_trav_scarf.webp', trav_rain: 'v3w/sw_trav_rain.webp',
    hat: 'v3w/sw_hat.webp', coat: 'v3w/sw_coat.webp', shirt: 'v3w/sw_shirt.webp',
    cloud_rain: 'v3w/sw_cloud_rain.webp', cloud_snow: 'v3w/sw_cloud_snow.webp',
    cut_hat: 'v3w/sw_cut_hat.webp', cut_hold: 'v3w/sw_cut_hold.webp', cut_pant: 'v3w/sw_cut_pant2.webp', cut_off: 'v3w/sw_cut_off.webp', cut_shake: 'v3w/sw_cut_shake.webp',
  };
  const artOK = {}, bgOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  /* 그림 한 장: (x,y)가 왼쪽 위인 w×h 상자. 바깥 g(그림자·자리) 안에 안쪽 g(움직임용, 원점 0,0)를 둔다 */
  function pic(T, g, key, x, y, w, h, { shadow = true } = {}) {
    const u = artUrl(key); if (!u) return null;
    const wrap = T.el('g', shadow ? { filter: 'url(#pp)' } : {}, g);
    const inner = T.el('g', {}, wrap); origin(inner, 0, 0);
    T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, inner);
    wrap.inner = inner;
    return wrap;
  }
  /* 나그네 자세: [폭, 높이, 발끝 x 어긋남, 눈 높이, 눈 사이(크기 기준)] — 발끝이 (0,0).
     그림마다 머리·몸 비율이 달라서(어깨에 건 외투·반팔·우비는 머리가 크다) 머리 크기와 눈 높이 차이를 반반 나눠 맞췄다 → 자세가 바뀌어도 크게 튀지 않는다 */
  /* 2026-10-20 새 그림(머리 작고 호리호리한 나그네, 눈 사이 ~25): 키 250 통일, 폭·눈 높이는 새 그림에서 다시 잰 값 */
  const TRAV = {
    trav_walk: [106, 250, .2, -196, 24.7], trav_walk_nohat: [86, 250, 0, -197, 25], trav_hold: [96, 250, -.7, -199, 25.7],
    trav_fan: [141, 250, -3.8, -196, 23.4], trav_shoulder: [117, 250, 8.6, -196, 25], trav_shirt: [101, 250, .5, -196, 25],
    trav_sit: [114, 250, .8, -194, 25.7], trav_scarf: [105, 250, .3, -196, 24.7], trav_rain: [111, 250, -.2, -196, 25],
  };
  const HAT_ART = [80, 58]; // 새 모자 그림(비스듬한 중절모 171×124)
  const HOLD_HAT_Y = -252;   // '덜덜' 그림(모자 없음) 머리에 얹을 모자 가운데
  const SIT_SEAT = 82;       // 앉은 그림: 발끝에서 엉덩이(바위 윗면)까지 (scale 1.2 기준 무대 단위)
  /* 해: 가운데 (0,0), 햇살 끝까지 지름 224. 바람: 구름 몸통 가운데가 (0,0), 꼬리는 왼쪽 */
  const SUN_D = 224;
  /* 2026-10-20 크기 일관성: wind_tired는 같은 구름을 1.13배로 그려 커 보였다(가로·세로 비율은 같음) → 기본 바람과 같은 상자로 맞춤 */
  /* 2026-10-22 사용자 지시: 해님에 비해 바람이 작다 → 세 자세 모두 같은 비율(WIND_K)로 키운다(자세끼리 크기는 그대로 같다) */
  const WIND_K = 1.4;
  const WIND_BOX = Object.fromEntries(Object.entries({ wind: [-135, -63, 223, 137], wind_blow: [-137, -63, 227, 140], wind_tired: [-135, -63, 223, 137] })
    .map(([k, v]) => [k, v.map(n => n * WIND_K)]));
  const cutArt = (T, key, sfx, hold, onShow) => (artUrl(key) ? T.cutImage([{ src: artUrl(key), sfx, hold }], { hold, onShow }) : null);
  /* 배경 그림: 무대 1000×560을 덮고 가장자리를 조금 더 덮는다 (그림 비율 1760:992). zoom: (cx, cy) 기준으로 키운다 */
  const BG_EDGE = { sky: ['#fbb440', '#3a284c'], high: ['#8fa056', '#7a8a47'], field: ['#7dc4ec', '#d1a16e'], stream: ['#93ceed', '#ae7b5a'], snow: ['#b1cee3', '#e7e6eb'] };
  function bgImage(T, key, { zoom = 1, cx = 500, cy = 560 } = {}) {
    const u = bgUrl(key); if (!u) return null;
    const w = 1080 * zoom, h = w * 992 / 1760, x = cx + (-40 - cx) * zoom, y = cy + (-24 - cy) * zoom;
    const [top, bot] = BG_EDGE[key] || ['#cfe3ee', '#77693f']; // 그림 밖(세로 화면에서 물러설 때 보이는 위·아래)은 그림 끝 색으로 잇는다
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, T.bg);
    T.el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, T.bg);
    return T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, T.bg);
  }
  /* 하늘빛: 그림 위에 곱하기로 얹는 색 한 겹. 코드가 sky.setAttribute('fill', SKY.x)로 부르던 자리에 그대로 쓰도록 같은 꼴로 */
  const TINT = { [SKY.day]: ['#ffffff', 0], [SKY.grey]: ['#93A6B8', .5], [SKY.warm]: ['#F7C77A', .32], [SKY.hot]: ['#F9D27E', .42],
    [SKY.rain]: ['#7F93A8', .55], [SKY.snow]: ['#DCE6F0', .3] };
  function tintLayer(T, parent, { x = -1400, w = 3800, dur = 1.2 } = {}) {
    const r = T.el('rect', { x, y: -1400, width: w, height: 3400, fill: '#ffffff', opacity: 0 }, parent);
    r.style.mixBlendMode = 'multiply'; r.style.transition = `opacity ${dur}s, fill ${dur}s`; r.style.pointerEvents = 'none';
    return { el: r, setAttribute(k, v) { if (k !== 'fill') return; const [c, o] = TINT[v] || ['#ffffff', 0]; r.setAttribute('fill', c); r.setAttribute('opacity', o); }, style: r.style };
  }

  /* ================= 작은 도우미 ================= */
  function origin(n, x, y) { n.style.transformBox = 'view-box'; n.style.transformOrigin = `${x}px ${y}px`; return n; }
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ================= 소리 ================= */
  const SND = {
    whoosh(T, k = 1) { // 바람 세기 1~5단계
      if (!AudioFX.sfx(k >= 3 ? 'blow_long' : 'blow', Math.min(1, .55 + k * .1))) AudioFX.whoosh(); // 입으로 후~ 부는 숨소리
    },
    warm(T, lv = 1) { // 따뜻한 합성 화음 (도미솔 → 한 음씩 쌓임)
      [262, 330, 392, 523].slice(0, 2 + lv).forEach((f, i) => T.tone(f, 1.4, { type: 'sine', vol: .07, when: i * .08 }));
    },
    sparkle(T) { [1047, 1319, 1568, 2093].forEach((f, i) => T.tone(f, .16, { type: 'triangle', vol: .12, when: i * .07 })); },
    breeze(T) { if (!AudioFX.sfx('blow', .45)) T.tone([500, 820], .7, { type: 'sine', vol: .06 }); },
    pant(T) { T.tone([420, 300], .18, { type: 'sine', vol: .1 }); T.tone([400, 280], .18, { type: 'sine', vol: .1, when: .32 }); },
    shiver(T) { [0, .08, .16, .24].forEach(w => T.tone(w % .16 ? 520 : 600, .06, { type: 'square', vol: .05, when: w })); },
    babble(T) { // 개울 물소리 (졸졸)
      return setInterval(() => { T.tone(rnd(700, 1600), .07, { type: 'sine', vol: .035 }); if (Math.random() < .3) T.tone(rnd(900, 1300), .06, { type: 'sine', vol: .03, when: .09 }); }, 170);
    },
  };

  /* ================= 캐릭터 (임시 도형) ================= */
  /* 해님: 가운데가 (0,0). 반지름 ~105 */
  function drawSun(T, g) {
    const { el, paper } = T;
    const glow = el('circle', { r: 118, fill: C.amber, opacity: 0 }, g);
    const art = pic(T, g, 'sun', -SUN_D / 2, -SUN_D / 2, SUN_D, SUN_D);
    if (art) return { glow, rays: art.inner, mouth: el('g', {}, g), art: true };
    const rays = el('g', {}, g); origin(rays, 0, 0);
    paper(rays, Array.from({ length: 12 }, (_, i) => ['path', { d: 'M-15 -74 L0 -106 L15 -74 Z', fill: i % 2 ? C.persimmon : C.gold, transform: `rotate(${i * 30})` }]));
    paper(g, [['circle', { r: 76, fill: C.gold }], ['circle', { r: 64, fill: C.sunDisk }]]);
    [-1, 1].forEach(s => el('path', { d: `M${s * 30 - 10} -12 Q${s * 30} -24 ${s * 30 + 10} -12`, stroke: C.ink, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g));
    [-1, 1].forEach(s => el('circle', { cx: s * 38, cy: 10, r: 10, fill: C.pink, opacity: .85 }, g));
    const mouth = el('path', { d: 'M-20 14 Q0 36 20 14', stroke: C.ink, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, g);
    return { glow, rays, mouth };
  }
  /* 바람: 볼 빵빵한 구름 장난꾸러기. 가운데가 (0,0), 꼬리(바람 자락)는 왼쪽 */
  const WIND_MOUTH = {
    smile: 'M-14 18 Q0 32 14 18',
    blow: 'M-9 20 a9 11 0 1 0 18 0 a9 11 0 1 0 -18 0',
    tired: 'M-14 26 Q-7 14 0 24 Q7 14 14 26 Q0 36 -14 26 Z',
  };
  function drawWind(T, g) {
    const { el, paper } = T;
    if (artUrl('wind')) { // 그림: 자세 셋(우쭐·볼 빵빵·헉헉)을 겹쳐 두고 입 모양 대신 자세를 바꾼다
      // 그림의 바람 줄(소용돌이)은 구름 뒤(왼쪽)에 붙어 있다 → 그림 그대로가 '오른쪽으로 분다'. (2026-10-22 사용자: 뒤집어 둔 것이 반대 방향)
      // 방향은 aimWind(바람, 상대)로만 정한다: 상대가 오른쪽이면 그대로, 왼쪽이면 face('right')로 뒤집는다
      const mir = el('g', {}, g);
      const tail = el('g', {}, mir), puff = el('g', {}, mir); origin(puff, 0, 0);
      const cheekG = el('g', {}, puff); origin(cheekG, 0, 0);
      const poses = {};
      Object.entries(WIND_BOX).forEach(([k, [x, y, w, h]]) => { const p = pic(T, cheekG, k, x, y, w, h); if (p) poses[k] = p; });
      const setMouth = k => {
        const want = k === 'blow' ? 'wind_blow' : k === 'tired' ? 'wind_tired' : 'wind';
        const show = poses[want] ? want : 'wind';
        Object.entries(poses).forEach(([n, p]) => { p.style.display = n === show ? '' : 'none'; });
      };
      setMouth('smile');
      const puffCheeks = s => { cheekG.style.transition = 'transform .3s cubic-bezier(.3,1.6,.5,1)'; cheekG.style.transform = `scale(${(1 + (s - 1) * .08).toFixed(3)})`; };
      // 주름·땀은 헉헉 그림에 이미 있다 → 빈 자리만 (코드가 opacity를 바꿔도 아무 일 없게)
      return { puff, tail, wrinkles: el('g', {}, g), sweat: el('g', {}, g), cheeks: [], setMouth, puffCheeks, art: true };
    }
    const tail = el('g', {}, g); origin(tail, -70, 10);
    [['M-72 -8 Q-120 -30 -146 -72', 12], ['M-80 18 Q-136 18 -168 -10', 11], ['M-66 44 Q-104 72 -146 62', 10]].forEach(([d, w]) =>
      el('path', { d, stroke: C.cloudBack, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, tail));
    const puff = el('g', {}, g); origin(puff, 0, 0);
    const blobs = [[-52, 12, 40], [-22, -26, 46], [26, -28, 44], [58, 8, 40], [0, 22, 52]];
    paper(puff, blobs.map(([x, y, r]) => ['circle', { cx: x + 6, cy: y + 7, r, fill: C.cloudBack }]));
    paper(puff, blobs.map(([x, y, r]) => ['circle', { cx: x, cy: y, r, fill: C.snow }]));
    const wrinkles = el('g', { opacity: 0 }, puff);
    ['M-70 -6 q8 -8 16 0 q8 8 16 0', 'M34 -40 q8 -8 16 0 q8 8 16 0', 'M-40 48 q8 -8 16 0 q8 8 16 0', 'M20 50 q8 -8 16 0 q8 8 16 0', 'M-34 -46 q8 -8 16 0'].forEach(d =>
      el('path', { d, stroke: '#9FB2C4', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, wrinkles));
    [-1, 1].forEach(s => { el('circle', { cx: s * 20, cy: -12, r: 7, fill: C.ink }, puff); el('circle', { cx: s * 20 + 2, cy: -15, r: 2.4, fill: '#fff' }, puff); });
    const cheeks = [-1, 1].map(s => origin(el('circle', { cx: s * 38, cy: 12, r: 13, fill: C.pink, opacity: .85 }, puff), s * 38, 12));
    const mouth = el('path', { d: WIND_MOUTH.smile, stroke: C.ink, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, puff);
    const sweat = el('g', { opacity: 0 }, g);
    [[70, -50], [86, -26], [-78, -40]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q-7 12 0 15 q7 -3 0 -15 Z`, fill: '#9CC7E6' }, sweat));
    const setMouth = k => {
      mouth.setAttribute('d', WIND_MOUTH[k]);
      mouth.setAttribute('fill', k === 'smile' ? 'none' : C.ink);
    };
    const puffCheeks = s => cheeks.forEach(c => { c.style.transition = 'transform .3s cubic-bezier(.3,1.6,.5,1)'; c.style.transform = `scale(${s})`; });
    return { puff, tail, wrinkles, sweat, cheeks, setMouth, puffCheeks };
  }
  /* 나그네: 발끝이 (0,0). 서 있을 때 키 ~240(모자 포함). 옷은 setOutfit으로 갈아입힌다 */
  const MOUTH = {
    smile: 'M-8 -170 Q0 -163 8 -170', big: 'M-10 -172 Q0 -157 10 -172 Z',
    o: 'M-4 -168 a4 5 0 1 0 8 0 a4 5 0 1 0 -8 0', cold: 'M-10 -168 l3.3 -3 l3.3 3 l3.3 -3 l3.3 3 l3.3 -3 l3.3 3',
  };
  function drawTraveler(T, g, { sit = false } = {}) {
    const { el, paper } = T;
    const P = { T };
    if (artUrl('trav_walk')) { // 그림: 자세(옷)마다 한 장씩 겹쳐 두고 setOutfit이 하나만 보인다. 발끝이 (0,0)
      P.art = true; P.sit = sit; P.poses = {};
      Object.keys(TRAV).forEach(k => { const [w, h, dx] = TRAV[k]; const p = pic(T, g, k, -w / 2 + dx, -h, w, h); if (p) { p.style.display = 'none'; P.poses[k] = p; } });
      // 모자 없는 그림('덜덜')에 얹는 모자: 모자가 머리에 있을 때만 보인다
      P.hat = el('g', {}, g);
      hatArt(T, P.hat).setAttribute('transform', `translate(0 ${HOLD_HAT_Y}) scale(${68 / HAT_ART[0]})`);
      P.sweat = el('g', { opacity: 0 }, g);
      [[56, -22], [-60, -8]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q-8 14 0 17 q8 -3 0 -17 Z`, fill: '#9CC7E6' }, P.sweat));
      P.cloth = el('g', {}, g); P.mouth = el('g', {}, g);
      P.face = k => { P.faceK = k; }; // 얼굴은 그림마다 정해져 있다
      return P;
    }
    const legs = el('g', {}, g);
    if (!sit) {
      [-1, 1].forEach(s => paper(legs, [['rect', { x: s < 0 ? -22 : 6, y: -76, width: 16, height: 72, rx: 6, fill: C.pants }],
        ['ellipse', { cx: s * 16, cy: -5, rx: 13, ry: 7, fill: C.ink }]]));
    } else {
      [0, 10].forEach(o => paper(legs, [
        ['rect', { x: -24, y: -80 + o * .4, width: 70, height: 18, rx: 8, fill: C.pants }], // 허벅지 (바위에 걸터앉음)
        ['rect', { x: 30 + o, y: -72, width: 16, height: 30, rx: 6, fill: C.pants }], // 걷어 올린 바짓단
        ['rect', { x: 32 + o, y: -46, width: 12, height: 40, rx: 5, fill: C.skin }],
        ['ellipse', { cx: 42 + o, cy: -6, rx: 11, ry: 6, fill: C.skin }]]));
    }
    P.cloth = el('g', {}, g);
    if (sit) g.appendChild(legs); // 앉으면 허벅지가 옷자락 앞으로 나온다
    const head = el('g', {}, g);
    paper(head, [['rect', { x: -8, y: -162, width: 16, height: 12, fill: C.skin }], ['circle', { cx: 0, cy: -184, r: 28, fill: C.skin }],
      ['path', { d: 'M-28 -186 Q-26 -214 0 -214 Q26 -214 28 -186 Q14 -198 0 -196 Q-14 -198 -28 -186 Z', fill: C.hair }]]);
    [-1, 1].forEach(s => { el('circle', { cx: s * 10, cy: -182, r: 3.6, fill: C.ink }, head); el('circle', { cx: s * 17, cy: -172, r: 5, fill: C.pink, opacity: .7 }, head); });
    P.mouth = el('path', { d: MOUTH.smile, stroke: C.ink, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, head);
    P.sweat = el('g', { opacity: 0 }, head);
    [[32, -200], [-34, -192]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q-5 9 0 11 q5 -2 0 -11 Z`, fill: '#9CC7E6' }, P.sweat));
    P.hat = paper(g, [['ellipse', { cx: 0, cy: -206, rx: 42, ry: 8, fill: C.bark }], ['rect', { x: -25, y: -238, width: 50, height: 34, rx: 10, fill: C.bark }],
      ['rect', { x: -25, y: -216, width: 50, height: 8, fill: C.gold }]]);
    P.face = k => { P.mouth.setAttribute('d', MOUTH[k]); P.mouth.setAttribute('fill', k === 'big' || k === 'o' ? C.ink : 'none'); };
    return P;
  }
  const HAT_SHAPES = [['ellipse', { cx: 0, cy: 16, rx: 42, ry: 8, fill: C.bark }], ['rect', { x: -25, y: -16, width: 50, height: 34, rx: 10, fill: C.bark }],
    ['rect', { x: -25, y: 6, width: 50, height: 8, fill: C.gold }]]; // 모자 (가운데 0,0) — 날아가는 모자·부채질용
  /* 모자 한 개 (가운데 0,0): 그림이 있으면 그림, 없으면 도형 */
  function hatArt(T, parent) {
    const g = T.el('g', {}, parent);
    if (!pic(T, g, 'hat', -HAT_ART[0] / 2, -HAT_ART[1] / 2, HAT_ART[0], HAT_ART[1])) T.paper(g, HAT_SHAPES);
    return g;
  }
  /* 그림 나그네: 옷·팔 → 자세 그림 고르기. 모자가 날아간 뒤의 열린 외투는 모자 없는 걷기 그림 */
  function travKey(P, kind, arms) {
    if (P.sit) return 'trav_sit';
    if (arms === 'fan') return 'trav_fan';
    if (kind === 'coatShut') return arms === 'cross' ? 'trav_hold' : 'trav_walk'; // 외투 여미고 팔 내린 그림은 없다 → 외투 입은 걷기
    if (kind === 'coat') return P.hat.dataset.gone === '1' ? 'trav_walk_nohat' : 'trav_walk';
    return { shirt: 'trav_shirt', rain: 'trav_rain', scarf: 'trav_scarf', shoulder: 'trav_shoulder' }[kind] || 'trav_walk';
  }
  function showPose(P) {
    let k = travKey(P, P.kind, P.arms);
    if (!P.poses[k]) k = P.poses.trav_walk ? 'trav_walk' : Object.keys(P.poses)[0];
    if (P.sway) { P.sway.cancel(); P.sway = null; }
    Object.entries(P.poses).forEach(([n, p]) => { p.style.display = n === k ? '' : 'none'; });
    P.cur = k;
    P.hat.style.display = k === 'trav_hold' && P.hat.dataset.gone !== '1' ? '' : 'none';
    const [, , , ey, ed] = TRAV[k];
    P.sweat.setAttribute('transform', `translate(0 ${ey}) scale(${(ed / 35).toFixed(3)})`);
    if (k === 'trav_fan') P.sway = P.poses[k].inner.animate([{ transform: 'rotate(-2deg)' }, { transform: 'rotate(2deg)' }, { transform: 'rotate(-2deg)' }], { duration: 480, iterations: Infinity, easing: 'ease-in-out' });
  }
  const refreshPose = P => { if (P.art) showPose(P); };
  /* 옷 갈아입기. kind: shirt 반팔 · coat 외투(열림) · coatShut 외투(여밈) · rain 우비 · scarf 외투+목도리 · shoulder 반팔+어깨에 건 외투
     arms: down · cross(꽉 여밈) · fan(모자로 부채질). buttons: 채운 단추 수 */
  function setOutfit(P, kind, arms = 'down', { buttons = 4 } = {}) {
    const { el, paper } = P.T, g = P.cloth;
    if (P.art) { // 그림: 단추는 그림에 있다 → 코드가 만지는 단추는 보이지 않는 빈 자리
      P.kind = kind; P.arms = arms; P.panels = [];
      if (!P.buttons || !P.buttons.length) P.buttons = [0, 1, 2, 3].map(() => el('g', { display: 'none' }, g));
      showPose(P);
      return;
    }
    g.innerHTML = '';
    P.kind = kind; P.arms = arms; P.panels = []; P.buttons = [];
    const hasCoat = ['coat', 'coatShut', 'rain', 'scarf'].includes(kind);
    const coatCol = kind === 'rain' ? C.gold : C.bean;
    if (kind === 'rain') paper(g, [['circle', { cx: 0, cy: -186, r: 36, fill: C.gold }]]); // 우비 모자(머리 뒤)
    paper(g, [['rect', { x: -30, y: -156, width: 60, height: 88, rx: 14, fill: C.shirt }]]);
    if (hasCoat) {
      const shut = kind !== 'coat';
      paper(g, [['rect', { x: -36, y: -158, width: 72, height: 118, rx: 14, fill: coatCol }]]);
      if (!shut) paper(g, [['rect', { x: -9, y: -156, width: 18, height: 90, fill: C.shirt }]]);
      const inner = shut ? 4 : -9;
      P.panels = [-1, 1].map(s => {
        const p = paper(g, [['path', { d: `M${s * 36} -146 Q${s * 36} -158 ${s * 24} -158 L${-s * inner} -158 L${-s * inner} -40 L${s * 36} -40 Z`, fill: coatCol }]]);
        return origin(p, s * 30, -156);
      });
      paper(g, [['path', { d: 'M-16 -160 L0 -140 L16 -160 Z', fill: kind === 'rain' ? '#b98f4a' : C.collar }]]);
      if (shut) P.buttons = [-136, -112, -88, -64].map((y, i) => el('circle', { cx: 0, cy: y, r: 5.5, fill: C.gold, opacity: i < buttons ? 1 : 0 }, g));
      if (kind === 'scarf') paper(g, [['rect', { x: -30, y: -166, width: 60, height: 16, rx: 8, fill: C.pine }], ['rect', { x: 8, y: -156, width: 16, height: 50, rx: 5, fill: C.pine }]]);
    }
    if (kind === 'shoulder') paper(g, [['path', { d: 'M8 -162 L42 -158 L50 -92 L30 -84 L22 -140 Z', fill: C.bean }], ['path', { d: 'M12 -160 L40 -156 L36 -144 Z', fill: C.collar }]]);
    const sleeve = hasCoat ? coatCol : C.shirt, short = !hasCoat;
    const armDown = s => {
      const x = s < 0 ? -48 : 34;
      paper(g, short ? [['rect', { x, y: -152, width: 14, height: 28, rx: 7, fill: sleeve }], ['rect', { x: x + 1, y: -128, width: 12, height: 44, rx: 6, fill: C.skin }], ['circle', { cx: s * 41, cy: -80, r: 8, fill: C.skin }]]
        : [['rect', { x, y: -152, width: 14, height: 68, rx: 7, fill: sleeve }], ['circle', { cx: s * 41, cy: -80, r: 8, fill: C.skin }]]);
    };
    if (arms === 'down') { armDown(-1); armDown(1); }
    if (arms === 'cross') {
      paper(g, [['rect', { x: -48, y: -152, width: 14, height: 30, rx: 7, fill: sleeve }], ['rect', { x: 34, y: -152, width: 14, height: 30, rx: 7, fill: sleeve }],
        ['rect', { x: -44, y: -128, width: 84, height: 16, rx: 8, fill: sleeve }], ['circle', { cx: 38, cy: -120, r: 8, fill: C.skin }],
        ['rect', { x: -40, y: -110, width: 84, height: 16, rx: 8, fill: sleeve }], ['circle', { cx: -38, cy: -102, r: 8, fill: C.skin }]]);
    }
    if (arms === 'fan') {
      armDown(-1);
      paper(g, short ? [['rect', { x: 34, y: -164, width: 14, height: 18, rx: 7, fill: sleeve }], ['rect', { x: 35, y: -200, width: 12, height: 40, rx: 6, fill: C.skin }]]
        : [['rect', { x: 34, y: -202, width: 14, height: 56, rx: 7, fill: sleeve }]]);
      const fan = el('g', {}, g); origin(fan, 41, -204);
      paper(fan, [['circle', { cx: 41, cy: -204, r: 8, fill: C.skin }]]);
      paper(el('g', { transform: 'translate(58,-236) rotate(-30) scale(.8)' }, fan), HAT_SHAPES);
      fan.animate([{ transform: 'rotate(-22deg)' }, { transform: 'rotate(18deg)' }, { transform: 'rotate(-22deg)' }], { duration: 480, iterations: Infinity, easing: 'ease-in-out' });
      P.hat.style.opacity = 0;
    } else if (P.hat.dataset.gone !== '1') P.hat.style.opacity = kind === 'rain' ? 0 : 1;
  }
  function flap(P, on) { // 외투 자락 펄럭
    (P.flaps || []).forEach(a => a.cancel()); P.flaps = [];
    if (on && P.art) { P.flaps = [P.poses[P.cur].inner.animate([{ transform: 'skewX(0deg)' }, { transform: 'skewX(-4deg)' }, { transform: 'skewX(1deg)' }, { transform: 'skewX(0deg)' }], { duration: 300, iterations: Infinity })]; return; }
    if (on) P.flaps = P.panels.map((p, i) => p.animate([{ transform: 'rotate(0deg)' }, { transform: `rotate(${i ? 10 : -10}deg)` }, { transform: 'rotate(0deg)' }], { duration: 260, iterations: Infinity, delay: i * 90 }));
  }
  function traveler(T, x, y, scale, kind = 'coat', arms = 'down', opts = {}) {
    let P;
    const a = T.actor(T.world, x, y, g => { P = drawTraveler(T, g, opts); }, { scale });
    a.P = P; setOutfit(P, kind, arms, opts);
    return a;
  }
  const sun = (T, x, y, s = 1, parent = T.world) => { let p; const a = T.actor(parent, x, y, g => { p = drawSun(T, g); }, { scale: s }); a.p = p; return a; };
  const wind = (T, x, y, s = 1, parent = T.world) => { let p; const a = T.actor(parent, x, y, g => { p = drawWind(T, g); }, { scale: s }); a.p = p; return a; };
  /* 내려다본 길: 위(먼 곳)일수록 작게 — 발끝 y 160 → 0.24, 476 → 0.34 (일정 비율) */
  const pathScale = y => +(0.24 + Math.max(0, Math.min(1, (y - 160) / 316)) * 0.10).toFixed(3);
  /* 길 따라 걷기: 점들을 잇는 한 번의 움직임(길이에 비례한 시간), 걷는 쪽으로 뒤집고, 멀고 가까움에 따라 크기를 바꾼다 */
  async function walkPath(T, a, pts, dur) {
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = seg.reduce((x, y) => x + y, 0) || 1;
    const fl = (p, q) => (q[0] < p[0] - 1 ? 1 : q[0] > p[0] + 1 ? -1 : 0); // 정면 그림: 엔진 기본(1)이 왼쪽
    let acc = 0, flip = fl(pts[0], pts[1]) || 1;
    const tf = (p, f) => `translate(${p[0]}px,${p[1]}px) scale(${f * pathScale(p[1])},${pathScale(p[1])})`;
    const kf = [{ transform: tf(pts[0], flip), offset: 0 }];
    for (let i = 1; i < pts.length; i++) {
      const off = (acc += seg[i - 1]) / total;
      kf.push({ transform: tf(pts[i], flip), offset: off });
      const nf = i < pts.length - 1 ? fl(pts[i], pts[i + 1]) : 0;
      if (nf && nf !== flip) { flip = nf; kf.push({ transform: tf(pts[i], flip), offset: off }); } // 꺾이는 점에서 바로 돌아선다
    }
    a.pos.removeAttribute('transform');
    await T.anim(a.pos, kf, { duration: dur, easing: 'linear' });
    a.pos.style.transform = '';
    const last = pts[pts.length - 1];
    a.flip = flip; a.scale = pathScale(last[1]); a.place(last[0], last[1]);
  }
  /* 바람은 늘 나그네(없으면 해님) 쪽을 보고 분다. 장면마다 바람을 놓은 뒤, 상대가 움직인 뒤에 부른다.
     엔진 face('right')는 그림을 뒤집는다 → 바람 그림(기본 오른쪽으로 붊)은 상대가 왼쪽일 때만 face('right') */
  const aimWind = (w, target) => { const tx = typeof target === 'number' ? target : target.x; w.face(tx >= w.x ? 'left' : 'right'); return w; };
  const windDir = w => (w.flip === 1 ? 1 : -1); // 1: 오른쪽으로 분다
  /* 바람 입(앞쪽)에서 부는 쪽으로 나가는 바람 줄 */
  const windGust = (T, w, n, o = {}) => {
    const d = windDir(w), len = o.len || 240, front = w.x + d * 130 * w.scale;
    gust(T, n, { ...o, x0: d > 0 ? front - 40 : front - len - 80, dist: d * Math.abs(o.dist || 760) });
  };
  const shiver = a => a.body.animate([{ translate: '0 0' }, { translate: '3px 0' }, { translate: '-3px 0' }], { duration: 110, iterations: Infinity });
  // 해 그림은 얼굴까지 한 장이라 한 바퀴 돌리지 않고 갸웃·통통 (도형은 햇살만 한 바퀴)
  const spinRays = (s, dur = 1400) => (s.p.art
    ? s.p.rays.animate([{ transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(-12deg) scale(1.1)', offset: .3 }, { transform: 'rotate(10deg) scale(1.08)', offset: .65 }, { transform: 'rotate(0deg) scale(1)' }], { duration: Math.min(dur, 1600), easing: 'ease-in-out' })
    : s.p.rays.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: dur, easing: 'ease-in-out' }));

  /* ================= 효과 ================= */
  function gust(T, n, { x0 = 120, y0 = 120, y1 = 420, len = 240, dur = 1000, alpha = .85, w = 7, dist = 760 } = {}) {
    for (let i = 0; i < n; i++) {
      const x = x0 + rnd(0, 120), y = rnd(y0, y1);
      const p = T.el('path', { d: `M0 0 Q${len * .25} -16 ${len * .5} 0 T${len} 0`, stroke: '#fff', 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, T.fx);
      p.animate([{ transform: `translate(${x}px,${y}px)`, opacity: 0 }, { opacity: alpha, offset: .3 }, { transform: `translate(${x + dist}px,${y + rnd(-30, 30)}px)`, opacity: 0 }],
        { duration: dur + rnd(0, 400), delay: i * 70, easing: 'ease-in', fill: 'both' }).finished.then(() => p.remove());
    }
  }
  function leaves(T, n, x, y, d = 1) { // d: 1 오른쪽, -1 왼쪽으로 날아간다
    for (let i = 0; i < n; i++) {
      const l = T.el('ellipse', { rx: 11, ry: 6, fill: [C.leaf, C.pine, C.gold][i % 3] }, T.fx);
      const sx = x + rnd(-60, 60), sy = y + rnd(-50, 40);
      l.animate([{ transform: `translate(${sx}px,${sy}px) rotate(0deg)` }, { transform: `translate(${sx + d * 300}px,${sy - rnd(40, 120)}px) rotate(${d * 260}deg)`, offset: .5 },
        { transform: `translate(${sx + d * 760}px,${sy + rnd(-40, 80)}px) rotate(${d * 620}deg)` }], { duration: 1800 + rnd(0, 700), delay: i * 60, fill: 'both' }).finished.then(() => l.remove());
    }
  }
  function sparkles(T, x, y, r = 120, n = 6) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
      const s = T.el('path', { d: 'M0 -14 L4 -4 14 0 4 4 0 14 -4 4 -14 0 -4 -4 Z', fill: '#FFE9A8' }, T.fx);
      s.animate([{ transform: `translate(${px}px,${py}px) scale(0)` }, { transform: `translate(${px}px,${py}px) scale(1.3)`, offset: .4 }, { transform: `translate(${px}px,${py}px) scale(0)` }],
        { duration: 900, delay: i * 60, fill: 'both' }).finished.then(() => s.remove());
    }
  }
  /* 떨어지는 것 (눈·비): 무한 반복, 끌 때 group.remove() */
  function precip(T, parent, kind, n = 26) {
    const g = T.el('g', {}, parent);
    for (let i = 0; i < n; i++) {
      const x = rnd(0, 1000), d = rnd(1600, 2600);
      const p = kind === 'snow' ? T.el('circle', { r: rnd(5, 9), fill: C.snow }, g)
        : T.el('rect', { width: 4, height: 18, rx: 2, fill: '#6E8FB0' }, g);
      p.animate([{ transform: `translate(${x}px,-30px)` }, { transform: `translate(${x + (kind === 'snow' ? rnd(-40, 40) : -30)}px,580px)` }],
        { duration: kind === 'snow' ? d * 2 : d * .45, delay: -rnd(0, 3000), iterations: Infinity });
    }
    return g;
  }

  /* ================= 배경 ================= */
  function cloudBank(T, parent, y, col, n = 7, r = 90) {
    T.paper(parent, Array.from({ length: n }, (_, i) => ['circle', { cx: -60 + i * (1120 / (n - 1)), cy: y + (i % 2) * 22, r: r + (i % 3) * 18, fill: col }]));
  }
  function skyBG(T, sunX = 290) { // 1. 하늘 와이드 (구름 층)
    const b = T.bg;
    // 2026-10-22 사용자: 앞쪽 흙바닥·바위가 보이면 해·바람이 땅 위에 선 것 같다 → 그림 위쪽(하늘·구름 바다)만 크게 잡아 땅은 화면 밖으로
    if (bgImage(T, 'sky', { zoom: 1.75, cx: 500, cy: 0 })) {
      T.el('circle', { cx: sunX, cy: 262, r: 170, fill: '#FFF3D2', opacity: .5, 'pointer-events': 'none' }, b); // 라이트박스 금빛 하늘에서 해님이 묻히지 않게 뒤에 옅은 빛 원
      layers(T, 'sky'); return { sky: null, drift: T.el('g', {}, b), art: true }; } // 구름은 그림 속 종이 → 흐르는 구름 없음
    const sky = T.el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: SKY.day }, b);
    const drift = T.el('g', {}, b);
    [[140, 120, .8], [520, 90, .6], [860, 150, .7]].forEach(([x, y, s]) => T.paper(drift, [['ellipse', { cx: x, cy: y, rx: 70 * s, ry: 26 * s, fill: C.snow }], ['ellipse', { cx: x + 30 * s, cy: y - 16 * s, rx: 40 * s, ry: 24 * s, fill: C.snow }]]));
    cloudBank(T, b, 470, C.cloudBack, 7, 90);
    cloudBank(T, b, 520, '#E6EEF4', 8, 80);
    cloudBank(T, b, 580, C.snow, 9, 70);
    return { sky, drift };
  }
  function highBG(T) { // 2. 하늘에서 내려다본 길
    const { el, paper } = T, b = T.bg;
    // 그림 속 굽은 흙길의 가운데(그림에서 잰 값, 무대 좌표). 다리 아래(먼 곳)에서 앞(가까운 곳)으로 내려오는 순서
    if (bgImage(T, 'high')) return { art: true, path: [[547, 160], [553, 182], [547, 206], [530, 233], [505, 260], [480, 287], [469, 314], [466, 341], [481, 368], [506, 395], [528, 422], [542, 449], [555, 476]] };
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.grass }, b);
    const cols = [C.leaf, '#8fae66', C.gold, C.pine, '#b9a25a'];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++)
      paper(b, [['rect', { x: -40 + c * 190 + (r % 2) * 40, y: -20 + r * 150, width: 170, height: 130, rx: 10, fill: cols[(r * 2 + c) % 5], transform: `rotate(${(c - r) % 3 * 2} ${c * 190} ${r * 150})` }]]);
    el('path', { d: 'M500 620 C420 500 620 430 520 330 C440 250 640 190 600 60 L600 -40', stroke: '#b98f4a', 'stroke-width': 62, fill: 'none', 'stroke-linecap': 'round' }, b);
    el('path', { d: 'M500 620 C420 500 620 430 520 330 C440 250 640 190 600 60 L600 -40', stroke: C.road, 'stroke-width': 50, fill: 'none', 'stroke-linecap': 'round' }, b);
    [[300, 200], [340, 250], [760, 380], [800, 330], [230, 420], [720, 120]].forEach(([x, y]) => paper(b, [['circle', { cx: x, cy: y, r: 34, fill: C.pine }], ['circle', { cx: x - 6, cy: y - 6, r: 18, fill: C.leaf }]]));
    paper(b, [['rect', { x: 820, y: 170, width: 70, height: 56, fill: C.cream }], ['path', { d: 'M810 176 L855 140 L900 176 Z', fill: C.gold }]]); // 초가 지붕 (위에서)
    // 구름 층 사이로 내려다본다 (위쪽 모서리)
    T.paper(b, [['circle', { cx: -20, cy: -10, r: 110, fill: C.snow }], ['circle', { cx: 100, cy: -40, r: 90, fill: C.snow }], ['circle', { cx: 1020, cy: -20, r: 120, fill: C.snow }], ['circle', { cx: 900, cy: -50, r: 90, fill: C.snow }]]);
    return { path: [[560, 240], [500, 330], [570, 420], [470, 520]] };
  }
  function fieldBG(T, opts = {}) { // 3·5. 들길 와이드 (바람/해 공용 — 조명은 하늘색과 덮개로)
    const { el, paper } = T, b = T.bg;
    const { lb, ...bo } = opts;
    const base = bgImage(T, 'field', bo);
    if (base && lb && bgUrl('lb_wind')) {
      /* 라이트박스 들길: lb 'wind' = 바람 들판, 'turn' = 바람 들판에서 시작해 light(p) 로 햇살 들판(0~1)으로 바뀐다. 하늘 틴트·덮개는 쓰지 않는다 */
      const wImg = el('image', { href: bgUrl('lb_wind'), x: base.getAttribute('x'), y: base.getAttribute('y'), width: base.getAttribute('width'), height: base.getAttribute('height'), preserveAspectRatio: 'none' }, b);
      const sImg = lb === 'turn' ? el('image', { href: bgUrl('lb_sun'), x: base.getAttribute('x'), y: base.getAttribute('y'), width: base.getAttribute('width'), height: base.getAttribute('height'), preserveAspectRatio: 'none', opacity: 0 }, b) : null;
      /* 그림 밖 위·아래(세로 화면에서 물러설 때)도 라이트박스 끝 색으로 */
      const edge = ([top, bot], o = 1) => { const y = +base.getAttribute('y'), h = +base.getAttribute('height'), g = el('g', { opacity: o }, b);
        el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, g); el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, g); base.before(g); return g; };
      edge(['#6d788d', '#253044']);
      const sEdge = lb === 'turn' ? edge(['#fda731', '#d7a855'], 0) : null;
      const ls = layers(T, 'wind');
      const light = p => {
        [[sImg, p], [sEdge, p], ...ls.map(g => [g, g.dataset.lb === 'sun' ? p : 1 - p])].forEach(([n, o]) => { if (!n) return; n.style.transition = 'opacity 1.2s'; n.setAttribute('opacity', o); });
      };
      ls.forEach(g => { if (g.dataset.lb === 'sun' || (g.dataset.lb === 'wind' && lb === 'sun')) g.setAttribute('opacity', 0); });
      const nop = { setAttribute() {}, style: {} };
      return { sky: nop, warm: nop, tufts: el('g', {}, b), tree: [95, 230], art: true, light };
    }
    if (base) {
      layers(T, 'field');
      const sky = tintLayer(T, b);
      const warm = el('rect', { x: -1400, y: -1400, width: 3800, height: 3400, fill: C.amber, opacity: 0 }, T.fx);
      warm.style.transition = 'opacity 1s';
      return { sky, warm, tufts: el('g', {}, b), tree: [95, 230], art: true }; // 풀은 그림 속 종이(흔들리지 않음), 나무는 왼쪽
    }
    const sky = el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: SKY.day }, b);
    sky.style.transition = 'fill 1.2s';
    paper(b, [['path', { d: 'M-200 350 Q120 240 420 320 Q700 230 1200 330 V700 H-200 Z', fill: '#b9c98f' }]]);
    paper(b, [['rect', { x: -200, y: 380, width: 1400, height: 400, fill: C.grass }]]);
    paper(b, [['path', { d: 'M-200 520 Q300 470 600 500 Q850 520 1200 480 V600 H-200 Z', fill: C.road }]]);
    // 나무 (나뭇잎이 날아간다)
    paper(b, [['rect', { x: 367, y: 250, width: 30, height: 190, rx: 8, fill: C.bark }], ['circle', { cx: 382, cy: 220, r: 80, fill: C.pine }], ['circle', { cx: 345, cy: 250, r: 50, fill: C.leaf }], ['circle', { cx: 423, cy: 245, r: 46, fill: C.leaf }]]);
    const tufts = el('g', {}, b);
    [80, 420, 700, 900, 980].forEach(x => {
      const t = paper(tufts, [['path', { d: `M${x} 470 l6 -34 l6 34 Z M${x + 10} 470 l8 -26 l4 26 Z M${x - 10} 470 l4 -24 l6 24 Z`, fill: C.pine }]]);
      origin(t, x, 470);
    });
    const warm = el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: C.amber, opacity: 0 }, T.fx);
    warm.style.transition = 'opacity 1s';
    return { sky, warm, tufts, tree: [382, 220] };
  }
  function streamBG(T) { // 7. 개울가
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'stream')) { // 바위는 그림 왼쪽(윗면 y≈300). 개어 둔 외투는 바위 오른쪽 풀밭에
      layers(T, 'stream');
      const cw = 70, ch = cw * 360 / 360;
      if (!pic(T, b, 'coat', 372 - cw / 2, 352 - ch, cw, ch)) paper(b, [['path', { d: 'M330 330 L410 322 L416 348 L326 352 Z', fill: C.bean }]]);
      return { tufts: el('g', {}, b), art: true, seat: [215, 410] };
    }
    el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: SKY.day }, b);
    paper(b, [['path', { d: 'M-200 330 Q200 250 520 300 Q800 240 1200 310 V700 H-200 Z', fill: '#b9c98f' }]]);
    paper(b, [['rect', { x: -200, y: 340, width: 1400, height: 200, fill: C.grass }]]);
    paper(b, [['path', { d: 'M-200 450 Q300 420 600 440 Q850 455 1200 430 V700 H-200 Z', fill: C.lav }]]);
    const ripples = el('g', {}, b);
    [[150, 500], [640, 520], [860, 480], [330, 540]].forEach(([x, y]) => el('path', { d: `M${x} ${y} q20 -8 40 0 q20 8 40 0`, stroke: C.snow, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', opacity: .8 }, ripples));
    ripples.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(24px)' }, { transform: 'translateX(0)' }], { duration: 2400, iterations: Infinity });
    [[120, 380], [720, 370], [900, 395]].forEach(([x, y]) => paper(b, [['circle', { cx: x, cy: y, r: 9, fill: C.persimmon }], ['circle', { cx: x, cy: y, r: 4, fill: C.gold }]]));
    paper(b, [['ellipse', { cx: 400, cy: 488, rx: 92, ry: 40, fill: C.stone }], ['ellipse', { cx: 388, cy: 476, rx: 64, ry: 20, fill: '#aaa297' }]]);
    paper(b, [['path', { d: 'M250 440 L330 432 L336 458 L246 462 Z', fill: C.bean }], ['path', { d: 'M262 436 L290 434 L282 446 Z', fill: C.collar }]]); // 개어 둔 외투
    const tufts = el('g', {}, b);
    [60, 560, 780, 960].forEach(x => { const t = paper(tufts, [['path', { d: `M${x} 430 l6 -34 l6 34 Z M${x + 10} 430 l8 -26 l4 26 Z M${x - 10} 430 l4 -24 l6 24 Z`, fill: C.pine }]]); origin(t, x, 430); });
    return { tufts, seat: [390, 520] };
  }
  function playBG(T) { // 8. 날씨 놀이 (구름 층은 들길 재사용)
    const { el, paper } = T, b = T.bg;
    if (bgImage(T, 'field')) { // 그림: 눈 오는 날은 눈 언덕 그림으로 바꿔 끼우고, 나머지 날씨는 하늘빛 한 겹으로
      const snowU = bgUrl('snow');
      const snowImg = snowU && el('image', { href: snowU, x: -40, y: -24, width: 1080, height: 1080 * 992 / 1760, preserveAspectRatio: 'none', opacity: 0 }, b);
      if (snowImg) snowImg.style.transition = 'opacity .8s';
      const tint = tintLayer(T, b, { dur: .8 });
      const [grass] = layers(T, 'field'), bush = layers(T, 'snowbush')[0];
      if (bush) bush.setAttribute('opacity', 0);
      const sky = { setAttribute(k, v) { if (k !== 'fill') return; const sn = v === SKY.snow && snowImg; if (snowImg) snowImg.setAttribute('opacity', sn ? 1 : 0); tint.setAttribute('fill', sn ? SKY.day : v);
        if (grass) grass.setAttribute('opacity', sn ? 0 : 1); if (bush) bush.setAttribute('opacity', sn ? 1 : 0); } };
      return { sky, ground: { setAttribute() {} }, art: true };
    }
    const sky = el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: SKY.day }, b);
    sky.style.transition = 'fill .8s';
    paper(b, [['path', { d: 'M-200 360 Q120 280 420 340 Q700 270 1200 350 V700 H-200 Z', fill: '#b9c98f' }]]);
    const ground = el('rect', { x: -200, y: 400, width: 1400, height: 400, fill: C.grass }, b);
    ground.style.transition = 'fill .8s';
    paper(b, [['path', { d: 'M-200 530 Q300 490 600 510 Q850 525 1200 495 V600 H-200 Z', fill: C.road }]]);
    return { sky, ground };
  }

  /* 골라요 판: 동그란 종이 배지 (월드 좌표) */
  function badge(T, x, y, drawIcon, r = 78) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, T.world);
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': 8 }]]);
    drawIcon(g);
    return g;
  }
  const ICON = {
    coat: (T, g) => pic(T, g, 'coat', -46, -58, 92, 92 * 360 / 360) || T.paper(g, [['path', { d: 'M-36 -48 L-12 -54 L0 -40 L12 -54 L36 -48 L58 26 L42 32 L34 4 L38 56 L-38 56 L-34 4 L-42 32 L-58 26 Z', fill: C.bean }],
      ['path', { d: 'M-12 -54 L0 -32 L12 -54 Z', fill: C.collar }], ...[-18, 2, 22, 42].map(y => ['circle', { cx: 0, cy: y, r: 5, fill: C.gold }])]),
    shirt: (T, g) => pic(T, g, 'shirt', -54, -38, 108, 108 * 204 / 230) || T.paper(g, [['path', { d: 'M-34 -40 L-14 -48 Q0 -38 14 -48 L34 -40 L56 -12 L38 0 L32 -10 L32 46 L-32 46 L-32 -10 L-38 0 L-56 -12 Z', fill: C.shirt }]]),
  };

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, camTo, camWide, camSnap, josa } = T;
    T.fx.style.pointerEvents = 'none';
    const stageWrap = T.root.querySelector('#stageWrap');
    /* 대사 연출: 목소리 주인에게 카메라가 가고 서로 마주 본다. 장면마다 새로 만든 배우 중 지금 무대에 있는 쪽을 고른다.
       해님·나그네는 정면 그림이라 돌려세우지 않고, 바람 그림은 오른쪽을 보고 있어서 face 방향을 뒤집어 넘긴다 */
    const live = (...fs) => () => { for (const f of fs) { try { const a = f(); if (a && a.pos && a.pos.isConnected) return a; } catch (e) { /* 아직 없는 장면 */ } } return null; };
    const mirror = get => () => { const a = get(); return a && new Proxy(a, { get: (o, k) => (k === 'face' ? d => o.face(d === 'right' ? 'left' : 'right') : o[k]) }); };
    const sunNow = live(() => S1, () => T.world.__sw[0], () => SN, () => Sr, () => SS, () => btns.sun);
    T.director({
      cast: { sun: sunNow, wind: mirror(live(() => W1, () => T.world.__sw[1], () => W, () => Wl, () => WW, () => btns.wind)), man: live(() => N, () => M8, () => T.world.__man) },
      listener: r => (r === 'sun' ? 'wind' : r === 'wind' ? (sunNow() ? 'sun' : 'man') : (sunNow() ? 'sun' : 'wind')),
      noFace: ['sun', 'man'],
    });
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); }; // 말풍선 없는 소리 대사

    /* 그림 미리 불러오기: 첫 장면(하늘·해·바람) 그림만 기다리고(최대 2.5초) 나머지는 뒤에서. 못 불러온 그림은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads['bg_' + k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    Object.keys(ART).filter(k => ART[k]).forEach(k => { loads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    await Promise.race([Promise.all([loads.bg_sky, loads.sun, loads.wind, loads.wind_blow].filter(Boolean)), sleep(2500)]);

    /* ================= 읽어 주기 (docs/READ_MODE.md): read_script_el.json 의 동사 → 놀이판 그림·연출을 누르기 없이 감싼 얇은 함수 =================
       set 은 놀이판 장면 배경과 카메라를 깐다(하늘·하이앵글 길·들길·개울가). 해님·바람·나그네는 동사가 처음 부를 때 그 장면 자리에 놓는다.
       바람·해님으로 외투를 벗기는 흐름(단추·땀·부채질·훌러덩)은 눌러서 하던 단계를 대본 줄에 맞춰 하나씩 한다. */
    const inst = () => T.readInstant();
    const rPt = () => T.portrait();
    let rScene = '', rFieldN = 0, rS = null, rW = null, rN = null, rF = null, rHB = null, rST = null, rFlying = null, rPant = null, rBabble = null, rHatGone = false, rButtoned = false, rWalkBob = null, rFlapShut = false;
    const rOn = a => a && a.pos.isConnected;
    const rAim = () => { if (rOn(rW)) aimWind(rW, rOn(rN) ? rN : rOn(rS) ? rS : 500); };
    const rSync = () => { T.world.__sw = [rS, rW]; T.world.__man = rN; };
    const inV = x => { if (!rPt()) return x; const c = T.camera, h = T.viewWidth() / 2 / Math.max(c.z, .1) - 60; return Math.max(c.x - h, Math.min(c.x + h, x)); };
    const POPC = { '반짝!': C.persimmon, '쨍쨍!': C.persimmon, '훌러덩!': C.bean, '꽉!': C.bean, '쏙!': C.persimmon, '퐁당!': C.indigo, '살랑~': C.pine, '휘잉!': C.indigo, '펄럭펄럭': C.bean, '악수!': C.bean };
    const fieldCam = () => {
      if (!rPt()) { camSnap(500, 280, 1); return; }
      const vw = T.viewWidth();
      if (rFieldN <= 2) camSnap(395, 280, Math.min(1, vw / 2 / 320));
      else if (rFieldN === 3) camSnap(672, 280, Math.min(1, vw / 2 / 270));
      else camSnap(500, 280, Math.min(1, vw / 2 / 400));
    };
    const mkSun = (x, y, s) => { if (rOn(rS)) rS.pos.remove(); rS = sun(T, x, y, s); rS.pos.style.opacity = ''; rSync(); return rS; };
    const mkWind = (x, y, s) => { if (rOn(rW)) rW.pos.remove(); rW = wind(T, x, y, s); rSync(); rAim(); return rW; };
    const mkMan = (x, kind = 'coat', arms = 'down', opts = {}) => {
      if (rOn(rN)) rN.pos.remove();
      const f = rScene === 'field';
      rN = traveler(T, x, f ? 500 : 510, f ? 1.25 : 1.2, kind, arms, opts);
      if (rHatGone && !opts.sit) { rN.P.hat.style.opacity = 0; rN.P.hat.dataset.gone = '1'; refreshPose(rN.P); }
      rN.P.face('smile'); rSync(); rAim();
      return rN;
    };
    const needMan = () => rOn(rN) ? rN : mkMan(520);
    const sway = (el, deg) => el.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${deg}deg)` }, { transform: 'rotate(0)' }], 900);
    const rWarmLv = [[SKY.day, .08], [SKY.warm, .16], [SKY.hot, .26]];
    const R = {
      set(key) {
        if (rBabble) { clearInterval(rBabble); rBabble = null; }
        if (rPant) { rPant.cancel(); rPant = null; }
        rScene = key; rS = rW = rN = rF = rHB = rST = rFlying = null; rFlapShut = false; rSync();
        T.clear();
        if (key === 'sky') {
          const pt = rPt(), sky1 = skyBG(T, pt ? 335 : 290);
          rS = sun(T, pt ? 335 : 290, 250, 1); rW = aimWind(wind(T, pt ? 610 : 720, 255, 1), pt ? 335 : 290); rSync();
          if (pt) camSnap(510, 280, Math.min(1, T.viewWidth() / 2 / 300)); else camSnap(500, 280, 1);
          sky1.drift.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(30px)' }, { transform: 'translateX(0)' }], { duration: 6000, iterations: Infinity });
        } else if (key === 'high') {
          rHB = highBG(T); camSnap(500, 280, 1);
        } else if (key === 'field') {
          rFieldN++; rF = fieldBG(T, rFieldN <= 2 ? { lb: 'wind' } : rFieldN === 3 ? { lb: 'turn' } : {}); rButtoned = rButtoned && rFieldN > 1;
          if (rFieldN === 3) rF.sky.setAttribute('fill', SKY.grey);
          fieldCam();
        } else if (key === 'stream') {
          rST = streamBG(T); camSnap(rPt() ? (rST.art ? 330 : 440) : 500, 280, 1);
          rBabble = SND.babble(T);
        }
      },
      sun(verb, a, b) {
        if (verb === 'at') {
          const [x, y] = String(a).split(',').map(Number);
          const hi = rScene === 'high', st = rScene === 'stream', pt = rPt();
          const fd = rScene === 'field', sx = hi ? (pt ? 300 : x) : x, sy = st ? 160 : fd ? 190 : y, s = hi ? .8 : st ? .7 : .85;
          mkSun(sx, sy, s); return;
        }
        if (verb === 'dim') { if (!rOn(rS)) mkSun(850, 120, .85); rS.pos.style.opacity = .4; return; }
        if (!rOn(rS)) return;
        if (verb === 'smile') { if (!inst()) rS.hop(14, 400); return; }
        if (verb === 'shine') {
          const lv = +a;
          if (inst()) return;
          rS.pos.style.opacity = '';
          spinRays(rS); SND.warm(T, lv); sparkles(T, rS.x, rS.y, 120, 8); rS.hop(16, 500);
          rS.p.glow.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: .6, transform: 'scale(1.1)' }, { opacity: 0, transform: 'scale(1)' }], 1200);
          if (rF && rF.sky && rFieldN >= 3 && lv >= 1) { const [c, o] = rWarmLv[Math.min(lv, 3) - 1]; rF.sky.setAttribute('fill', c); rF.warm.setAttribute('opacity', o); if (rF.light) rF.light([.4, .75, 1][Math.min(lv, 3) - 1]); }
          for (let i = 0; i < 5; i++) {
            const bm = el('path', { d: 'M0 0 L-16 0 L-60 260 L40 260 Z', fill: '#FFE9A8', opacity: 0, transform: `translate(${rS.x},${rS.y}) rotate(${40 + i * 12})` }, T.fx);
            bm.animate([{ opacity: 0 }, { opacity: .45 }, { opacity: 0 }], { duration: 1400, delay: i * 80 }).finished.then(() => bm.remove());
          }
          return;
        }
        console.warn('[read] sun 동사 모름', verb);
      },
      wind(verb, a) {
        if (verb === 'at') {
          const [x, y] = String(a).split(',').map(Number);
          const hi = rScene === 'high', st = rScene === 'stream', pt = rPt();
          const wx = hi ? (pt ? 700 : x) : st ? (rST && rST.art ? 520 : 400) : x, wy = st ? 165 : rScene === 'field' ? 190 : y, s = hi ? .8 : st ? .7 : .8;
          mkWind(wx, wy, s); return;
        }
        if (!rOn(rW)) return;
        rAim();
        if (verb === 'smile') { rW.p.setMouth('smile'); rW.p.puffCheeks(1); rW.p.puff.style.transform = ''; rW.p.wrinkles.setAttribute('opacity', 0); rW.p.sweat.setAttribute('opacity', 0); if (rPant) { rPant.cancel(); rPant = null; } return; }
        if (verb === 'puff') {
          rW.p.setMouth('blow'); rW.p.puffCheeks(rScene === 'sky' ? 1.6 : 1.3);
          if (inst()) return;
          SND.whoosh(T, 2); if (rScene === 'sky') windGust(T, rW, 6, { y0: 180, y1: 340, dist: 400 });
          rW.wiggle(6, 600); return;
        }
        if (verb === 'gentle') { rW.p.setMouth('blow'); rW.p.puffCheeks(1.1); return; }
        if (verb === 'blow') {
          const k = +a;
          rW.p.setMouth('blow'); rW.p.puffCheeks(1.2 + k * .18); rW.setScale(.8 + k * .05);
          if (inst()) return;
          SND.whoosh(T, k); windGust(T, rW, 3 + k * 2, { y0: k === 5 ? 310 : 150, y1: 470, w: 5 + k, alpha: .6 + k * .07 });
          if (rF) rF.tufts.childNodes.forEach(t => t.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${10 + k * 5}deg)` }, { transform: 'rotate(0)' }], 900));
          if (rOn(rN)) sway(rN.body, -1 - k);
          return;
        }
        if (verb === 'pant') {
          rW.setScale(.8); rW.p.puffCheeks(.7); rW.p.setMouth('tired');
          rW.p.wrinkles.setAttribute('opacity', 1); rW.p.sweat.setAttribute('opacity', 1);
          rW.p.puff.style.transition = 'transform .5s'; rW.p.puff.style.transform = rW.p.art ? 'scale(.94,.88)' : 'scale(.85,.75)';
          if (rPant) rPant.cancel();
          rPant = rW.p.puff.animate([{ scale: '1 1' }, { scale: '1.06 1.1' }, { scale: '1 1' }], { duration: 700, iterations: Infinity });
          if (!inst()) SND.pant(T);
          return;
        }
        console.warn('[read] wind 동사 모름', verb);
      },
      man(verb, a, b) {
        if (verb === 'walk') {
          const [x, ms] = String(a).split(',').map(Number), msx = b != null ? +b : ms;
          if (rScene === 'high') {   /* 하이앵글: 길 위쪽에서 아래로 걸어 내려온다 */
            const p0 = rHB.path[0];
            if (!rOn(rN)) { rN = traveler(T, p0[0], p0[1], pathScale(p0[1]), 'coat'); rN.P.face('smile'); rSync(); }
            if (!(msx > 0) || inst()) return;
            rWalkBob = rN.body.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 360, iterations: Infinity });
            const tok = rScene + rFieldN, a = rN;
            walkPath(T, rN, rHB.path, 7400).then(() => { if (rWalkBob) { rWalkBob.cancel(); rWalkBob = null; } if (rScene === 'high' && rN === a) camTo(500, 280, 1, 900); });
            camTo(rHB.art ? 510 : 530, rHB.art ? 340 : 300, 1.5, 1400);
            return;
          }
          if (!rOn(rN)) { mkMan(x); return; }
          if (msx > 0 && !inst()) return rN.move(x, rN.y, msx);
          rN.place(x, rN.y); return;
        }
        if (verb === 'sit') {
          if (rOn(rN)) rN.pos.remove();
          rN = traveler(T, rST.seat[0], rST.seat[1], 1.2, 'shirt', 'down', { sit: true }); rN.P.face('smile'); rSync(); rAim(); return;
        }
        const N = needMan();
        if (verb === 'hat') {
          if (a === 'off') {
            rHatGone = true; N.P.hat.style.opacity = 0; N.P.hat.dataset.gone = '1'; N.P.face('o'); refreshPose(N.P);
            if (inst()) return;
            const hx = N.x, hy = N.y - 228 * N.scale;
            rFlying = hatArt(T, T.fx);
            rFlying.animate([{ transform: `translate(${hx}px,${hy}px) scale(${N.scale}) rotate(0deg)` }, { transform: `translate(${hx + 160}px,${hy - 120}px) scale(${N.scale}) rotate(200deg)`, offset: .5 },
              { transform: `translate(${hx + 520}px,${hy - 200}px) scale(${N.scale}) rotate(520deg)` }], { duration: 1300, easing: 'ease-out', fill: 'forwards' });
            T.pop(inV(hx - 115), hy - 70, '앗!', C.bean);
            return sleep(900);
          }
          if (a === 'on') {
            const hx = N.x, hy = N.y - 228 * N.scale;
            const done = () => { if (rFlying) { rFlying.remove(); rFlying = null; } rHatGone = false; N.P.hat.dataset.gone = ''; N.P.hat.style.opacity = 1; N.P.face('o'); refreshPose(N.P); };
            if (inst()) { done(); return; }
            if (rFlying) { rFlying.remove(); rFlying = null; }
            const back = hatArt(T, T.fx);
            return (async () => {
              await T.anim(back, [{ transform: `translate(${hx + 260}px,-60px) scale(${N.scale}) rotate(-40deg)` }, { transform: `translate(${hx - 120}px,${hy - 150}px) scale(${N.scale}) rotate(30deg)`, offset: .45 },
                { transform: `translate(${hx + 60}px,${hy - 70}px) scale(${N.scale}) rotate(-20deg)`, offset: .75 }, { transform: `translate(${hx}px,${hy}px) scale(${N.scale}) rotate(0deg)` }], { duration: 2200, easing: 'ease-in-out' });
              back.remove(); done(); AudioFX.sfx('pop') || AudioFX.pop(); N.hop(18);
            })();
          }
        }
        if (verb === 'face') { N.P.face({ cold: 'cold', hot: 'o', happy: 'big' }[a] || 'smile'); return; }
        if (verb === 'hold') {
          setOutfit(N.P, 'coatShut', 'cross', { buttons: rButtoned ? 4 : 0 }); N.P.face('cold');
          if (!N.__shiver) N.__shiver = shiver(N);
          if (!inst()) SND.shiver(T);
          return;
        }
        if (verb === 'button') {
          rButtoned = true;
          if (inst()) return;
          return (async () => {
            await camTo(N.x, N.y - 150, 1.7, 800);
            for (let i = 0; i < 4; i++) { if (N.P.buttons[i]) N.P.buttons[i].setAttribute('opacity', 1); AudioFX.sfx('pop', .5) || AudioFX.pop(); await sleep(260); }
          })();
        }
        if (verb === 'unbutton') {
          if (N.__shiver) { N.__shiver.cancel(); N.__shiver = null; }
          N.P.face('smile'); setOutfit(N.P, 'coatShut', 'down', { buttons: 4 }); rButtoned = false;
          return (async () => {
            for (let i = 3; i >= 0; i--) { if (N.P.buttons[i]) N.P.buttons[i].setAttribute('opacity', 0); T.tone(700 + i * 90, .1, { type: 'triangle', vol: .12 }); await sleep(inst() ? 0 : 220); }
            setOutfit(N.P, 'coat', 'down');
          })();
        }
        if (verb === 'fan') { setOutfit(N.P, 'coat', 'fan'); N.P.sweat.setAttribute('opacity', 1); N.P.face('o'); if (!inst()) T.pop(inV(N.x + 20), N.y - 350, '팔랑팔랑', C.bark); return; }
        if (verb === 'coat') {
          if (N.__shiver) { N.__shiver.cancel(); N.__shiver = null; }
          setOutfit(N.P, 'shoulder', 'down'); N.P.sweat.setAttribute('opacity', 0); N.P.face('big'); rFlapShut = false;
          if (!inst()) { N.hop(22); T.confetti(); AudioFX.jingle(); }
          return;
        }
        if (verb === 'sit') return;
        if (verb === 'dip') { if (!inst()) { N.hop(10, 500); } return; }
        console.warn('[read] man 동사 모름', verb, a);
      },
      leaves() { if (rF) leaves(T, 10, ...rF.tree, rOn(rW) ? windDir(rW) : 1); },
      flap(onoff) {
        const N = needMan(), on = onoff === 'on';
        if (rScene === 'field' && rFieldN === 4) {   /* 누가 이겼을까: 바람이 불면 외투를 꽉 여미고, 해님이 비추면 벗는다 */
          if (on) { rFlapShut = true; setOutfit(N.P, 'coatShut', 'cross', { buttons: 4 }); N.P.face('cold'); if (!N.__shiver) N.__shiver = shiver(N); }
          else { if (N.__shiver) { N.__shiver.cancel(); N.__shiver = null; } }
          return;
        }
        flap(N.P, on);
      },
      sweat() { const N = needMan(); N.P.sweat.setAttribute('opacity', 1); },
      breeze() {
        if (inst()) return;
        SND.breeze(T);
        if (rOn(rW)) { rW.p.setMouth('blow'); rW.p.puffCheeks(1.1); windGust(T, rW, 2, { y0: 220, y1: 400, w: 4, alpha: .55, dur: 1800, dist: rST && rST.art ? 520 : 600 }); setTimeout(() => rW.p.setMouth('smile'), 700); }
        if (rST) rST.tufts.childNodes.forEach(t => t.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], 1400));
        if (rOn(rN)) rN.P.face('big');
      },
      cut(k) {
        const C5 = { hat: ['cut_hat', 'whoosh', 2200], hold: ['cut_hold', null, 2200], pant: ['cut_pant', null, 2400], off: ['cut_off', 'swish', 2400], shake: ['cut_shake', 'ding', 2400] };
        const c = C5[k]; if (!c) return console.warn('[read] cut 모름', k);
        if (k === 'pant') vo('cut_pant'); if (k === 'off') vo('cut_off');
        return cutArt(T, ...c);
      },
      vo(k) { return vo(k); },
      fx(n) {
        if (n === 'whoosh') return SND.whoosh(T, 3);
        if (n === 'swish') return AudioFX.swish();
        if (n === 'ding') return AudioFX.sfx('ding') || AudioFX.ding();
        if (n === 'splash') return AudioFX.splash();
      },
      pop(spec) {
        let [x, y, ...w] = String(spec).split(','); x = +x; y = +y; const t = w.join(',');
        if (rScene === 'field' && rOn(rN) && Math.abs(x - rN.x) < 100 && y > 200) x = rN.x + 185;   /* 나그네 얼굴을 가리지 않게 옆으로 */
        T.pop(inV(x), y, t, POPC[t]);
      },
      cam(a) { if (a === 'wide') return; const [x, y, z] = String(a).split(',').map(Number); return inst() ? camSnap(x, y, z || 1) : camTo(x, y, z || 1, 700); },
    };
    const READ_ACTS = { set: R.set, sun: R.sun, wind: R.wind, man: R.man, leaves: R.leaves, flap: R.flap, sweat: R.sweat, breeze: R.breeze, cut: R.cut, vo: R.vo, fx: R.fx, pop: R.pop, cam: R.cam };
    if (T.reading()) return T.readPlay(READ_ACTS);


    /* --- 1. 하늘 자랑 --- */
    const sky1 = skyBG(T, T.portrait() ? 335 : 290);
    // 세로 화면(양옆이 잘림): 해님·바람을 가운데 쪽으로 모으고 살짝 물러선다. 가로는 그대로
    const S1 = sun(T, T.portrait() ? 335 : 290, 250, 1), W1 = aimWind(wind(T, T.portrait() ? 610 : 720, 255, 1), T.portrait() ? 335 : 290); // 구름 바다 위 하늘에 떠 있다. 바람은 해님 쪽을 본다
    if (T.portrait()) camSnap(510, 280, Math.min(1, T.viewWidth() / 2 / 300)); // 커진 바람까지 보이게 조금 더 물러선다
    sky1.drift.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(30px)' }, { transform: 'translateX(0)' }], { duration: 6000, iterations: Infinity });
    await T.curtain(true);
    await say('하늘 높이 해님과 바람이 살았어요.');
    await sleep(500); // 해님은 저절로 반짝 (2026-10-20)
    spinRays(S1); S1.hop(26); sparkles(T, S1.x, S1.y, 130, 8); T.pop(S1.x, 110, '반짝!', C.persimmon);
    S1.p.glow.animate([{ opacity: 0, transform: 'scale(.8)' }, { opacity: .6, transform: 'scale(1.1)' }, { opacity: 0, transform: 'scale(1)' }], 1200);
    await say('"내가 제일 따뜻해!"');
    await sleep(500); // 바람은 저절로 휘잉 (2026-10-20)
    aimWind(W1, S1); W1.p.setMouth('blow'); W1.p.puffCheeks(1.6); SND.whoosh(T, 2); windGust(T, W1, 6, { y0: 180, y1: 340, dist: 400 });
    sky1.drift.animate([{ translate: '0 0' }, { translate: '60px 0' }, { translate: '0 0' }], { duration: 1400, easing: 'ease-out' });
    T.pop(W1.x - 30, 110, '휘잉!', C.indigo); // 세로 화면(보이는 폭 ≈500)에서 오른쪽이 잘리지 않게 조금 안쪽
    await W1.wiggle(6, 700);
    W1.p.setMouth('smile'); W1.p.puffCheeks(1);
    await say('"아니야, 내가 제일 세!"');
    await say('해님과 바람은 서로 자기가 최고래요.');

    /* --- 2. 내기 (하이앵글) --- */
    let N, HB;
    await T.sceneCard('내기', () => {
      T.clear(); HB = highBG(T);
      if (T.portrait()) camSnap(500, 280, 1);
      // 정면 얼굴 그림이라 멀어지면 뒤로 걷는 모양 → 위(먼 곳)에서 아래(가까운 쪽)로 길을 따라 걸어 내려온다
      N = traveler(T, HB.path[0][0], HB.path[0][1], pathScale(HB.path[0][1]), 'coat');
      N.P.face('smile');
      const pt = T.portrait(); // 세로 화면: 양 귀퉁이에서 빼꼼 보이게 안쪽으로
      const s = sun(T, pt ? 270 : 70, 520, 1.05), w = aimWind(wind(T, pt ? 715 : 940, 520, 1.05), 520); // 바람은 길 위 나그네 쪽(왼쪽)을 본다
      T.world.__sw = [s, w];
    });
    const walk = N.body.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 360, iterations: Infinity });
    const walking = walkPath(T, N, HB.path, 7400);
    await say('저 아래 길로 나그네가 걸어가요.');
    await camTo(HB.art ? 510 : 530, HB.art ? 340 : 300, 1.5, 1400);
    await say('나그네는 두툼한 외투를 입었어요.');
    await walking; walk.cancel();
    await camWide(900);
    T.world.__sw[1].hop(24);
    await say('바람이 말했어요. "저 외투를 먼저 벗기는 쪽이 이기기!"');
    T.world.__sw[0].hop(24);
    await say('해님이 웃었어요. "좋아. 바람아, 너 먼저 해 봐."');

    /* --- 3. 바람 차례 (메인 1): 쓱 ×5, 점점 세게 --- */
    let F, W;
    await T.sceneCard('바람 차례', () => {
      T.clear(); F = fieldBG(T, { lb: 'wind' });
      N = traveler(T, 600, 500, 1.25, 'coat');
      W = aimWind(wind(T, 150, 180, .8), N); // 나그네(오른쪽) 쪽으로 분다
      if (T.portrait()) camSnap(395, 280, Math.min(1, T.viewWidth() / 2 / 320)); // 세로 화면: 바람과 나그네가 함께 보이게
    }, N.pos);
    const hatHead = () => [N.x, N.y - 228 * N.scale];
    let flying = null;
    await say('바람이 볼을 빵빵하게 부풀렸어요.');
    const blow = async k => {
      W.p.setMouth('blow'); W.p.puffCheeks(1.2 + k * .18); W.setScale(.8 + k * .05);
      // 다섯째(단추 채우기)는 바로 얼굴로 카메라가 붙는다 → 바람 줄기는 얼굴 아래로만
      SND.whoosh(T, k); windGust(T, W, 3 + k * 2, { y0: k === 5 ? 310 : 150, y1: 470, w: 5 + k, alpha: .6 + k * .07 });
      F.tufts.childNodes.forEach(t => t.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${10 + k * 5}deg)` }, { transform: 'rotate(0)' }], 900));
      N.body.animate([{ transform: 'rotate(0)' }, { transform: `rotate(${-1 - k}deg)` }, { transform: 'rotate(0)' }], { duration: 900, easing: 'ease-in-out' });
    };
    const steps = [
      async () => { leaves(T, 10, ...F.tree, windDir(W)); await say('휘잉~ 나뭇잎이 날아가요!'); },
      async () => {
        N.P.hat.style.opacity = 0; N.P.hat.dataset.gone = '1'; N.P.face('o'); refreshPose(N.P);
        const [hx, hy] = hatHead();
        flying = hatArt(T, T.fx);
        const sc = N.scale;
        flying.animate([{ transform: `translate(${hx}px,${hy}px) scale(${sc}) rotate(0deg)` }, { transform: `translate(${hx + 160}px,${hy - 120}px) scale(${sc}) rotate(200deg)`, offset: .5 },
          { transform: `translate(${hx + 520}px,${hy - 200}px) scale(${sc}) rotate(520deg)` }], { duration: 1300, easing: 'ease-out', fill: 'forwards' });
        T.pop(hx - 115, hy - 70, '앗!', C.bean); // 얼굴을 가리지 않게 머리 왼쪽 위
        await sleep(900);
        await (cutArt(T, 'cut_hat', 'whoosh', 2200) || T.cut(svg => {
          T.paper(T.el('g', { transform: 'translate(210,150) rotate(-24) scale(2.4)' }, svg), HAT_SHAPES);
          [[60, 90], [50, 150], [70, 210]].forEach(([x, y]) => T.el('path', { d: `M${x} ${y} h80`, stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }, svg));
          T.el('text', { x: 200, y: 280, 'text-anchor': 'middle', 'font-size': 54, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('앗, 내 모자!') }, svg);
        }, { hold: 2200, sfx: 'whoosh' }));
        await say('"앗, 내 모자!" 모자가 훨훨 날아갔어요.');
      },
      async () => { N.P.face('cold'); flap(N.P, true); T.pop(N.x - 175, N.y - 120, '펄럭펄럭', C.bean); await say('외투 자락이 펄럭펄럭!'); }, // 바람 쪽(왼쪽) — 세로 화면에서 오른쪽은 잘린다
      async () => {
        flap(N.P, false); setOutfit(N.P, 'coatShut', 'cross', { buttons: 0 }); N.P.face('cold');
        N.__shiver = shiver(N); SND.shiver(T);
        await (cutArt(T, 'cut_hold', null, 2200) || T.cut(svg => {
          const a = T.actor(svg, 200, 330, g => { const P = drawTraveler(T, g); setOutfit(P, 'coatShut', 'cross', { buttons: 0 }); P.face('cold'); P.hat.style.opacity = 0; }, { scale: 1.35 });
          [[-1, 1], [1, 1]].forEach(([s]) => T.el('path', { d: `M${200 + s * 80} 150 l${s * 14} 10 l${-s * 14} 10 l${s * 14} 10`, stroke: '#fff', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, svg));
          T.el('text', { x: 330, y: 80, 'text-anchor': 'middle', 'font-size': 60, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('꽉!') }, svg);
          return a;
        }, { hold: 2200 }));
        await say('"으으, 추워!" 나그네는 외투를 꽉 여몄어요.');
      },
      async () => {
        await camTo(N.x, N.y - 150, 1.7, 800);
        for (let i = 0; i < 4; i++) { N.P.buttons[i].setAttribute('opacity', 1); AudioFX.sfx('pop', .5) || AudioFX.pop(); await sleep(260); }
        await say('단추까지 꼭꼭 채웠어요. 외투는 꼼짝도 안 해요!');
      },
    ];
    for (let k = 1; k <= 5; k++) {
      const puff = () => T.mash(W.pos, { count: 1, prompt: k === 1 ? '바람을 톡 눌러서 불어 봐요!' : '더 세게, 톡!' });
      await (k === 1 ? T.ask('바람을 톡 눌러서 후~ 불어 줘요!', puff) : puff());
      await blow(k);
      await steps[k - 1]();
      if (k < 5) { W.p.setMouth('smile'); if (k < 4) await say('바람은 더 세게 불었어요. 쓱!'); }
    }

    /* --- 4. 바람 헉헉 --- */
    await camWide(700);
    vo('cut_pant'); // 컷 속 바람의 헉헉 (말풍선 없음)
    await (cutArt(T, 'cut_pant', null, 2400) || T.cut(svg => {
      T.actor(svg, 200, 160, g => { const p = drawWind(T, g); p.wrinkles.setAttribute('opacity', 1); p.sweat.setAttribute('opacity', 1); p.setMouth('tired'); p.puff.style.transform = p.art ? 'scale(.94,.88)' : 'scale(.85,.72)'; }, { scale: 1.5 });
      T.el('text', { x: 200, y: 285, 'text-anchor': 'middle', 'font-size': 58, fill: C.indigo, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('헉헉…') }, svg);
    }, { hold: 2400 }));
    W.setScale(.8); W.p.puffCheeks(.7); W.p.setMouth('tired');
    W.p.wrinkles.setAttribute('opacity', 1); W.p.sweat.setAttribute('opacity', 1);
    W.p.puff.style.transition = 'transform .5s'; W.p.puff.style.transform = W.p.art ? 'scale(.94,.88)' : 'scale(.85,.75)';
    const pant = W.p.puff.animate([{ scale: '1 1' }, { scale: '1.06 1.1' }, { scale: '1 1' }], { duration: 700, iterations: Infinity });
    await camTo(W.x, W.y + 40, 2.1, 900);
    SND.pant(T);
    await say('바람은 숨이 차서 헉헉, 볼이 쭈글쭈글해졌어요.');
    await say('"에이, 안 되네!"'); // 헉헉 합성음은 목소리와 겹쳐서 뺌
    await camWide(800);
    // 웃음 컷: 날아간 모자가 팔랑팔랑 다시 떨어져 머리에 쏙
    const [hx, hy] = hatHead();
    if (flying) flying.remove();
    const back = hatArt(T, T.fx);
    await T.anim(back, [{ transform: `translate(${hx + 260}px,-60px) scale(${N.scale}) rotate(-40deg)` }, { transform: `translate(${hx - 120}px,${hy - 150}px) scale(${N.scale}) rotate(30deg)`, offset: .45 },
      { transform: `translate(${hx + 60}px,${hy - 70}px) scale(${N.scale}) rotate(-20deg)`, offset: .75 }, { transform: `translate(${hx}px,${hy}px) scale(${N.scale}) rotate(0deg)` }], { duration: 2200, easing: 'ease-in-out' });
    back.remove(); N.P.hat.dataset.gone = ''; N.P.hat.style.opacity = 1; N.P.face('o'); refreshPose(N.P);
    AudioFX.sfx('pop') || AudioFX.pop(); T.pop(hx + 130, hy - 90, '쏙!', C.persimmon); N.hop(18); // 모자·얼굴 옆 위
    await say('어? 날아간 모자가 나그네 머리에 쏙 떨어졌어요!');
    pant.cancel();

    /* --- 5. 해님 차례 (메인 2): 꾹 ×3 --- */
    let SN;
    await T.sceneCard('해님 차례', () => {
      T.clear(); F = fieldBG(T, { lb: 'turn' }); F.sky.setAttribute('fill', SKY.grey);
      if (N.__shiver) N.__shiver.cancel();
      N = traveler(T, 520, 500, 1.25, 'coatShut', 'cross', { buttons: 4 }); N.P.face('cold');
      N.__shiver = shiver(N);
      W = aimWind(wind(T, 150, 200, .6), N); W.p.wrinkles.setAttribute('opacity', 1); W.p.setMouth('smile'); W.p.puffCheeks(.8);
      SN = sun(T, 820, 190, .85);
      if (T.portrait()) camSnap(672, 280, Math.min(1, T.viewWidth() / 2 / 270)); // 세로 화면: 나그네와 해님이 함께 보이게
    }, N.pos);
    const ring = el('circle', { cx: 820, cy: 190, r: 104, fill: 'none', stroke: C.gold, 'stroke-width': 10, 'stroke-dasharray': 654, 'stroke-dashoffset': 654, transform: 'rotate(-90 820 190)', class: 'hold-ring', opacity: 0 }, T.fx);
    await say('이번엔 해님 차례예요.');
    const warmLv = [[SKY.day, .08], [SKY.warm, .16], [SKY.hot, .26]];
    const holdOnce = async (lv, guide) => {
      let lastTone = 0;
      ring.setAttribute('opacity', 1); ring.setAttribute('stroke-dashoffset', 654);
      const warm = () => T.mash(SN.pos, { count: 3, prompt: '해님을 톡톡 눌러 봐요!', onStep: i => {
        const p = i / 3;
        ring.setAttribute('stroke-dashoffset', 654 * (1 - p));
        SN.p.glow.setAttribute('opacity', (.2 + p * .5).toFixed(2));
        SN.body.style.transform = `scale(${1 + p * .12})`;
        T.tone(330 + p * 200, .4, { type: 'sine', vol: .06 });
      } });
      await T.ask(guide, warm);
      ring.setAttribute('opacity', 0);
      SN.body.style.transform = ''; spinRays(SN); SND.warm(T, lv + 1); sparkles(T, 820, 190, 120, 8);
      F.sky.setAttribute('fill', warmLv[lv][0]); F.warm.setAttribute('opacity', warmLv[lv][1]);
      if (F.light) F.light([.4, .75, 1][lv]); // 라이트박스: 톡톡마다 햇살 들판으로
      // 햇살 줄기
      for (let i = 0; i < 5; i++) {
        const b = el('path', { d: 'M0 0 L-16 0 L-60 260 L40 260 Z', fill: '#FFE9A8', opacity: 0, transform: `translate(820,190) rotate(${40 + i * 12})` }, T.fx);
        b.animate([{ opacity: 0 }, { opacity: .45 }, { opacity: 0 }], { duration: 1400, delay: i * 80 }).finished.then(() => b.remove());
      }
    };
    await holdOnce(0, '해님을 톡톡 눌러서 따뜻하게 비춰 줘요!');
    N.__shiver.cancel(); N.P.face('smile');
    setOutfit(N.P, 'coatShut', 'down', { buttons: 4 });
    for (let i = 3; i >= 0; i--) { N.P.buttons[i].setAttribute('opacity', 0); T.tone(700 + i * 90, .1, { type: 'triangle', vol: .12 }); await sleep(220); }
    setOutfit(N.P, 'coat', 'down');
    await say('"아, 따뜻하다~" 나그네가 단추를 풀었어요.');
    await holdOnce(1, '조금 더 톡톡!');
    setOutfit(N.P, 'coat', 'fan'); N.P.sweat.setAttribute('opacity', 1); N.P.face('o');
    T.pop(N.x + 20, N.y - 350, '팔랑팔랑', C.bark); // 부채질하는 모자 위 (세로 화면은 카메라가 오른쪽에 있어 왼쪽은 잘린다)
    await say('"아이, 더워!" 모자로 부채질을 해요.');
    await holdOnce(2, '한 번 더 톡톡!');
    vo('cut_off'); // 컷 속 나그네 한숨 (말풍선 없음)
    await (cutArt(T, 'cut_off', 'swish', 2400) || T.cut(svg => {
      const coat = T.el('g', { transform: 'translate(250,110) rotate(-28)' }, svg);
      ICON.coat(T, coat);
      T.actor(svg, 150, 300, g => { const P = drawTraveler(T, g); setOutfit(P, 'shirt', 'down'); P.face('big'); }, { scale: 1.05 });
      T.el('text', { x: 280, y: 280, 'text-anchor': 'middle', 'font-size': 56, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('훌러덩!') }, svg);
    }, { hold: 2400, sfx: 'swish' }));
    setOutfit(N.P, 'shoulder', 'down'); N.P.sweat.setAttribute('opacity', 0); N.P.face('big');
    N.hop(22); T.confetti(); AudioFX.jingle();
    await say('훌러덩! 나그네가 외투를 벗었어요!');
    W.hop(10);
    await say('바람이 깜짝 놀랐어요. "우와, 해님이 해냈네!"');

    /* --- 6. 누가 이겼을까? (분할 화면) --- */
    let Wl, Sr;
    await T.sceneCard('누가 이겼을까?', () => {
      T.clear();
      if (bgImage(T, 'field', { zoom: 1.6, cx: 480, cy: 560 })) { // 들길 그림을 키워 모래길이 양쪽 나그네 발밑까지 오게. 왼쪽은 흐린 빛, 오른쪽은 따뜻한 빛
        tintLayer(T, T.bg, { x: -1400, w: 1900 }).setAttribute('fill', SKY.grey);
        tintLayer(T, T.bg, { x: 500, w: 1900 }).setAttribute('fill', SKY.warm);
      } else {
        el('rect', { x: -200, y: -200, width: 700, height: 1000, fill: SKY.grey }, T.bg);
        el('rect', { x: 500, y: -200, width: 700, height: 1000, fill: SKY.warm }, T.bg);
        T.paper(T.bg, [['rect', { x: -200, y: 420, width: 1400, height: 300, fill: C.grass }]]);
      }
      T.paper(T.bg, [['rect', { x: 494, y: -10, width: 12, height: 600, fill: C.cream }], ['rect', { x: 498, y: -10, width: 4, height: 600, fill: C.gold }]]);
      // 세로 화면(양옆이 잘림): 양쪽 그림을 가운데 쪽으로 모으고 살짝 물러선다. 가로는 그대로
      const pt = T.portrait(), X = pt ? { L: 375, R: 625, W: 370, S: 630 } : { L: 290, R: 720, W: 130, S: 880 };
      const L = traveler(T, X.L, 510, 1.2, 'coatShut', 'cross'); L.P.face('cold'); shiver(L);
      const R = traveler(T, X.R, 510, 1.2, 'shoulder', 'down'); R.P.face('big');
      const skyY = pt && artUrl('trav_hold') ? 92 : 150; // 세로 화면 + 그림 나그네(모자까지 더 크다): 해·바람이 머리에 겹치지 않게 조금 위로
      Wl = aimWind(wind(T, X.W, skyY, .75), L); Wl.p.setMouth('blow'); Wl.p.puffCheeks(1.5);
      Sr = sun(T, X.S, skyY, .75);
      if (pt) camSnap(500, 280, Math.min(1, T.viewWidth() / 2 / 250));
      T.world.__LR = [L, R];
    });
    const gustL = setInterval(() => gust(T, 2, { x0: 40, y0: 180, y1: 460, dist: 240, len: 160, w: 5 }), 900);
    T.world.__LR[0].wiggle(3, 500);
    await say('바람이 불 때, 나그네는 외투를 꽉 여몄어요.');
    T.world.__LR[1].hop(20);
    await say('해님이 비출 때는 외투를 벗었지요.');
    const q1 = '누가 외투를 벗게 했을까요? 해님일까요, 바람일까요?';
    await T.ask(q1, () => T.choose([
      { el: Sr.pos, ok: true },
      { el: Wl.pos, ok: false, onWrong: async () => { SND.whoosh(T, 1); await Wl.wiggle(8, 500); T.world.__LR[0].wiggle(4, 400); } },
    ], { prompt: '누가 외투를 벗게 했을까요?', where: '외투를 벗은 나그네 쪽 하늘을 봐요!', who: '해님이에요! 반짝이는 해님을 눌러 봐요!' }));
    clearInterval(gustL);
    spinRays(Sr); SND.sparkle(T); T.confetti();
    await say('맞아요, 해님이에요! 따뜻한 해님이 이겼어요.');
    await say('세게 미는 것보다 다정한 게 더 힘이 세요.');

    /* 날씨 옷 고르기 ×2 */
    const wrongAt = M => [M.x, M.y - 360]; // 머리 위 — 옆에 두면 배지(고를 대상)를 가린다(세로 화면은 통째로)
    const clothesQ = async ({ label, bg, sky, ground, fx, q, okKey, noKey, okName, where, wrong, wear, after }) => {
      let M, fxG, bs;
      await T.sceneCard(label, () => {
        T.clear();
        if (bgImage(T, bg)) { if (bg === 'field') tintLayer(T, T.bg).setAttribute('fill', sky); } else {
          el('rect', { x: -200, y: -200, width: 1400, height: 1000, fill: sky }, T.bg);
          T.paper(T.bg, [['path', { d: 'M-200 380 Q200 320 520 360 Q800 310 1200 370 V700 H-200 Z', fill: ground }]]);
        }
        fxG = fx();
        M = traveler(T, 500, 510, 1.15, 'shirt', 'down'); M.P.face('smile');
        const left = Math.random() < .5;
        const bx = T.portrait() ? 165 : 300; // 세로 화면: 배지를 나그네 가까이 두고 살짝 물러선다
        bs = { [okKey]: badge(T, left ? 500 - bx : 500 + bx, 330, g => ICON[okKey](T, g)), [noKey]: badge(T, left ? 500 + bx : 500 - bx, 330, g => ICON[noKey](T, g)) };
        if (T.portrait()) camSnap(500, 280, Math.min(1, T.viewWidth() / 2 / (bx + 100)));
      }, null);
      await T.ask(q, () => T.choose([{ el: bs[okKey], ok: true }, { el: bs[noKey], ok: false, onWrong: () => wrong(M) }],
        { prompt: q, where, who: `${josa(okName, '이에요/예요')}! 반짝이는 걸 눌러 봐요!` }));
      bs[okKey].remove(); bs[noKey].remove();
      wear(M); M.hop(24); AudioFX.sfx('ding') || AudioFX.ding();
      await say(after);
      return fxG;
    };
    await clothesQ({ label: '눈 오는 날', bg: 'snow', sky: SKY.snow, ground: C.snow, fx: () => precip(T, T.bg, 'snow', 34),
      q: '눈이 펑펑 오는 날엔 무엇을 입을까요?', okKey: 'coat', noKey: 'shirt', okName: '외투', where: '추운 날엔 따뜻한 옷이 좋아요.',
      wrong: async M => { M.P.face('cold'); const s = shiver(M); T.pop(...wrongAt(M), '으으!', C.indigo); vo('wrong_cold'); await sleep(900); s.cancel(); M.P.face('smile'); },
      wear: M => { setOutfit(M.P, 'scarf', 'down', { buttons: 4 }); M.P.face('big'); },
      after: '맞아요! 따뜻한 외투를 입으니 포근해요.' });
    await clothesQ({ label: '쨍쨍한 날', bg: 'field', sky: SKY.hot, ground: C.grass, fx: () => { const s = sun(T, 500, 110, .55, T.bg); spinRays(s, 3000); return s; },
      q: '해가 쨍쨍한 날엔 무엇을 입을까요?', okKey: 'shirt', noKey: 'coat', okName: '반팔', where: '더운 날엔 시원한 옷이 좋아요.',
      wrong: async M => { setOutfit(M.P, 'coatShut', 'down'); M.P.sweat.setAttribute('opacity', 1); M.P.face('o'); T.pop(...wrongAt(M), '더워!', C.persimmon); vo('wrong_hot'); await sleep(1100); setOutfit(M.P, 'shirt', 'down'); M.P.sweat.setAttribute('opacity', 0); M.P.face('smile'); },
      wear: M => { setOutfit(M.P, 'shirt', 'down'); M.P.face('big'); },
      after: '맞아요! 반팔을 입으니 시원해요.' });
    await say('추우면 입고, 더우면 벗어요.');

    /* --- 7. 개울가 쉼 --- */
    let ST, WW, SS, babble;
    await T.sceneCard('개울가', () => {
      T.clear(); ST = streamBG(T);
      if (T.portrait()) camSnap(ST.art ? 330 : 440, 280, 1); // 앞 장면에서 물러선 카메라를 제자리로 (세로 화면만). 그림은 바위가 왼쪽
      N = traveler(T, ST.seat[0], ST.seat[1], 1.2, 'shirt', 'down', { sit: true }); N.P.face('smile');
      // 그림: 나그네가 왼쪽 바위에 앉으니 바람은 가운데 위에서 시작
      WW = ST.art ? wind(T, 520, 165, .7) : wind(T, 170, 190, .7); SS = sun(T, ST.art ? 850 : 830, ST.art ? 160 : 170, .7);
      aimWind(WW, N); // 나그네 쪽으로 분다 (그림: 나그네가 왼쪽 바위)
    }, null);
    babble = SND.babble(T);
    await say('나그네는 개울가에서 쉬어요.');
    AudioFX.splash(); T.pop(N.x + 150, N.y + 30, '퐁당!', C.indigo); // 발 옆 물 위 (다리를 가리지 않게)
    await say('시원한 물에 발을 퐁당 담갔어요.');
    await T.ask('바람아, 이번엔 살살 불어 줄래? 톡, 살살~', () => T.mash(WW.pos, { count: 3, prompt: '바람을 살살 톡톡 눌러 봐요!', onStep: i => {
      WW.p.setMouth('blow'); WW.p.puffCheeks(1.1); SND.breeze(T);
      // 그림: 바람(가운데 위)이 왼쪽 나그네 쪽으로 분다 → 바람 줄기도 왼쪽으로. 도형: 바람이 왼쪽에 있어 오른쪽으로
      windGust(T, WW, 2, { y0: 220, y1: 400, w: 4, alpha: .55, dur: 1800, dist: ST.art ? 520 : 600 });
      ST.tufts.childNodes.forEach(t => t.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], 1400));
      // 바람과 나그네 사이, 개울 위 (바람 구름·나그네 얼굴을 가리지 않게)
      if (ST.art) T.pop(N.x + 240 + i * 100, N.y - 100 + (i % 2) * 50, '살랑~', C.pine);
      else T.pop(N.x + 30 + i * 130, N.y - 360 + (i % 2) * 40, '살랑~', C.pine);
      N.P.face('big');
      setTimeout(() => WW.p.setMouth('smile'), 600);
    } }));
    await say('"아, 시원해. 고마워, 바람아!"');
    WW.hop(20);
    aimWind(WW, ST.art ? 660 : 600); // 이제 오른쪽 해님을 마주 본다 (악수 컷과 같은 자리: 바람 왼쪽, 해 오른쪽)
    await Promise.all(ST.art ? [WW.move(450, 170, 1200), SS.move(660, 165, 1200)] : [WW.move(400, 180, 1200), SS.move(600, 170, 1200)]);
    await say('해님과 바람이 마주 보고 웃었어요.');
    await (cutArt(T, 'cut_shake', 'ding', 2400) || T.cut(svg => {
      const w = T.actor(svg, 130, 160, g => drawWind(T, g), { scale: 1 });
      const s = T.actor(svg, 280, 150, g => drawSun(T, g), { scale: .9 });
      T.el('path', { d: 'M190 170 Q205 150 220 160', stroke: C.snow, 'stroke-width': 18, fill: 'none', 'stroke-linecap': 'round' }, svg);
      T.el('path', { d: 'M220 160 L196 176 L212 186 Z', fill: C.persimmon }, svg);
      T.el('text', { x: 200, y: 285, 'text-anchor': 'middle', 'font-size': 58, fill: C.bean, stroke: '#fff', 'stroke-width': 9, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: T.tr('악수!') }, svg);
      return [w, s];
    }, { hold: 2400, sfx: 'ding' }));
    await say('"우리, 사이좋게 지내자!"');
    clearInterval(babble);

    /* --- 8. 날씨 놀이: 해·비구름·바람·눈구름을 차례로 톡 (자유 놀이 없음) --- */
    let PL, M8, wfx = null;
    const btns = {};
    await T.sceneCard('날씨 놀이', () => {
      T.clear(); PL = playBG(T);
      M8 = traveler(T, 500, 520, 1.15, 'shirt', 'down'); M8.P.face('smile');
      btns.sun = sun(T, 130, 200, .55);
      // 비구름 그림(300×159, 구름 몸통만)은 가운데 위에, 빗방울 셋은 코드로 그 아래. 눈구름 그림(300×290)은 눈송이까지 한 장
      btns.rain = T.actor(T.world, 370, 200, g => (pic(T, g, 'cloud_rain', -72, -52, 144, 144 * 159 / 160) && T.paper(g, [-30, 0, 30].map(x => ['path', { d: `M${x} 34 q-7 12 0 15 q7 -3 0 -15 Z`, fill: '#6E8FB0' }]))) || T.paper(g, [['circle', { cx: -34, cy: 4, r: 34, fill: C.rain }], ['circle', { cx: 6, cy: -18, r: 42, fill: C.rain }], ['circle', { cx: 44, cy: 6, r: 32, fill: C.rain }], ['rect', { x: -60, y: 0, width: 130, height: 36, rx: 18, fill: C.rain }],
        ...[-30, 0, 30].map(x => ['path', { d: `M${x} 52 q-7 12 0 15 q7 -3 0 -15 Z`, fill: '#6E8FB0' }])]));
      btns.wind = wind(T, 630, 200, .5);
      btns.snowc = T.actor(T.world, 870, 200, g => pic(T, g, 'cloud_snow', -72, -66, 144, 144 * 281 / 300) || T.paper(g, [['circle', { cx: -34, cy: 4, r: 34, fill: '#E6EEF4' }], ['circle', { cx: 6, cy: -18, r: 42, fill: '#E6EEF4' }], ['circle', { cx: 44, cy: 6, r: 32, fill: '#E6EEF4' }], ['rect', { x: -60, y: 0, width: 130, height: 36, rx: 18, fill: '#E6EEF4' }],
        ...[-30, 0, 30].map(x => ['circle', { cx: x, cy: 58, r: 7, fill: C.snow, stroke: C.cloudBack, 'stroke-width': 3 }])]));
      // 세로 화면: 날씨 단추 넷을 가운데로 모으고 살짝 물러서서 모두 보이게 (가로는 그대로)
      if (T.portrait()) {
        const k = .62;
        Object.values(btns).forEach(b => b.place(Math.round(500 + (b.x - 500) * k), b.y));
        camSnap(500, 280, Math.min(1, T.viewWidth() / 2 / (370 * k + 95)));
      }
      aimWind(btns.wind, M8); // 나그네 쪽으로 분다
    }, null);
    const WEATHER = {
      sun: { sky: SKY.hot, ground: C.grass, word: '쨍쨍!', cloth: '반팔', col: C.persimmon, wear: () => setOutfit(M8.P, 'shirt'),
        fx: () => { spinRays(btns.sun); SND.warm(T, 2); sparkles(T, 500, 300, 200, 10); } },
      rain: { sky: SKY.rain, ground: '#6f8a52', word: '주룩주룩', cloth: '우비', col: C.indigo, wear: () => setOutfit(M8.P, 'rain'),
        fx: () => { wfx = precip(T, T.fx, 'rain', 40); AudioFX.splash(); } },
      wind: { sky: SKY.day, ground: C.grass, word: '휘잉!', cloth: '외투', col: C.indigo, wear: () => setOutfit(M8.P, 'coatShut'),
        fx: () => { SND.whoosh(T, 3); windGust(T, btns.wind, 10, { y0: 250, y1: 480 }); leaves(T, 8, btns.wind.x, 330, windDir(btns.wind)); } },
      snowc: { sky: SKY.snow, ground: C.snow, word: '펑펑', cloth: '목도리', col: C.indigo, wear: () => setOutfit(M8.P, 'scarf'),
        fx: () => { wfx = precip(T, T.fx, 'snow', 40); [1568, 1319, 1175].forEach((f, i) => T.tone(f, .3, { type: 'sine', vol: .08, when: i * .12 })); } },
    };
    T.finale();
    for (const [wi, [k, w]] of Object.entries(WEATHER).entries()) {
      const tapW = () => T.tap(btns[k].pos);
      await (wi === 0 ? T.ask('하늘을 톡 눌러서 날씨를 바꿔 볼까요?', tapW) : tapW());
      btns[k].hop(20);
      if (wfx) { wfx.remove(); wfx = null; }
      w.fx();
      T.pop(btns[k].x, 85, w.word, w.col);
      PL.sky.setAttribute('fill', w.sky); PL.ground.setAttribute('fill', w.ground);
      w.wear(); M8.P.face('big'); M8.hop(16);
      T.pop(M8.x + 185, 380, w.cloth, C.bean); // 몸 옆 (세로 화면 보이는 폭 안)
      if (wi === 0) await say('옷도 저절로 바뀐대요!');   // 첫 번째 눌렀을 때 옷이 바뀌는 걸 보며 안내
      await sleep(1800); // 바뀐 날씨를 잠깐 보여 준다
    }
    if (wfx) { wfx.remove(); wfx = null; }
    PL.sky.setAttribute('fill', SKY.day); PL.ground.setAttribute('fill', C.grass); setOutfit(M8.P, 'shirt'); M8.P.face('big');
    [btns.sun, btns.wind].forEach(a => a.hop(24));
    await say('해님과 바람은 오늘도 사이좋게 하늘을 지켜요.');
    await say('다정한 마음이 제일 힘이 세답니다. 끝!');
    return '다정한 마음이 제일 힘이 세요!';
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
    Object.keys(targetsOf).forEach(k => { T[k] = async (...a) => { await T.fitTo(targetsOf[k](a)); [].concat(targetsOf[k](a)).forEach(e => fatten(e)); return api[k](...a); }; });
    T.sceneCard = (label, change, focus) => api.sceneCard(label, () => {
      if (guardCam) { const c = api.camera; if (c.x === guardCam.x && c.y === guardCam.y && c.z === guardCam.z) api.camSnap(500, 280, 1); guardCam = null; }
      change && change();
    }, focus);
    return T;
  }

  /* 누르는 자리 넓히기 (2026-10-22): 화면에서 짧은 변이 84px 보다 작은 대상(g)에 투명 사각을 덧대 84px 이상으로 만든다.
     대상 가운데는 그대로(손가락 힌트 자리 불변). 조작을 열 때마다 지금 화면 배율로 다시 잰다. 클립된 그림 조각은 건드리지 않는다 */
  function fatten(el, min = 84) {
    try {
      if (!el || !(el instanceof SVGGElement) || el.__noFat) return;
      if (el.__fat) { el.__fat.remove(); el.__fat = null; }
      const r = el.getBoundingClientRect(); if (!r.width || !r.height || el.getAttribute('clip-path')) return;
      if (r.width >= min && r.height >= min) return;
      const m = el.getScreenCTM(), bb = el.getBBox(); if (!m || !bb.width || !bb.height) return;
      const sx = Math.hypot(m.a, m.b) || 1, sy = Math.hypot(m.c, m.d) || 1;
      const w = Math.max(bb.width, min / sx), h = Math.max(bb.height, min / sy);
      const rc = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rc.setAttribute('x', bb.x + bb.width / 2 - w / 2); rc.setAttribute('y', bb.y + bb.height / 2 - h / 2);
      rc.setAttribute('width', w); rc.setAttribute('height', h); rc.setAttribute('fill', '#000'); rc.setAttribute('fill-opacity', 0);
      el.insertBefore(rc, el.firstChild); el.__fat = rc;
    } catch (e) { /* 넓히기 실패는 무시 */ }
  }

  Tale.mount({ title: '해와 바람', subtitle: '누가 외투를 벗길까?', read: true, run: () => run(portraitGuard(Tale.api)) });
})();
