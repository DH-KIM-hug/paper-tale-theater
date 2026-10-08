/* 팥죽할멈과 호랑이 — 공용 2D 엔진(engine/tale.js) 버전.
   예전 2.5D(CSS 3D 원근 레이어) 무대를 평면 SVG 무대로 옮겼다. 깊이감은 그림 속 종이 층이 맡는다.
   - 배경: 장면마다 한 장(assets/v3w/scene_*.webp). 아직 없으면 기존 조각 그림을 평면으로 겹쳐 대신한다.
   - 배우·소품은 따로 그린 그림을 코드로 배치한다.
   - 이야기·대사·도움말은 ../../story.js 그대로 (녹음 파일이 대사 글자와 정확히 맞아야 재생된다). */
(() => {
  const ROOT = '../../';
  const A = p => ROOT + 'assets/' + p;

  /* 녹음 내레이션 경로("audio/...")는 루트 페이지 기준 — 이 폴더에서 열리도록 앞에 ../../ 를 붙인다 */
  if (typeof NARRATION_CLIPS !== 'undefined') {
    const fix = u => (/^(\.\.\/|\/|https?:)/.test(u) ? u : ROOT + u);
    for (const k of Object.keys(NARRATION_CLIPS)) {
      const v = NARRATION_CLIPS[k];
      NARRATION_CLIPS[k] = Array.isArray(v) ? v.map(fix) : fix(v);
    }
  }

  /* 장면 한 장 그림 (생성 중). 없으면 폴백 조합 */
  const SCENE_IMG = { A: A('v3w/scene_a_field.webp'), B1: A('v3w/scene_b_kitchen.webp'), B2: A('v3w/scene_c_yard_sea.webp') };
  const sceneOK = {};

  /* 무대 좌표 (발 기준 y=520) */
  const POS = { tigerEnter: 1080, tigerStage: [270, 335, 430, 470, 885, 560, 640], grannyCook: 250, grannyCorner: 620, rolledSpot: 560 };
  const STATION_CAM = [[240, 430, 1.5], [320, 430, 1.5], [420, 440, 1.4], [470, 450, 1.5], [860, 380, 1.32], [560, 440, 1.35], [640, 450, 1.3]];
  const DOOR_X = { B1: 885, B2: 135 };
  const FRIEND_SET = { bam: 'B1', jara: 'B1', ddong: 'B1', songgot: 'B1', jeolgu: 'B1', myeongseok: 'B2', jige: 'B2' };
  /* 친구 자리 (발끝) · 그림 상자 [x, y, w, h] · 그림자 반지름 */
  const FR = {
    bam: { x: 190, y: 508, box: [-19, -38, 38, 38], shd: 14 },
    jara: { x: 300, y: 428, box: [-24, -42, 48, 48], shd: 18 },
    ddong: { x: 432, y: 520, box: [-23, -42, 46, 46], shd: 21 },
    songgot: { x: 495, y: 520, box: [-20, -42, 40, 42], shd: 12 },
    jeolgu: { x: 885, y: 312, box: [-27, -52, 54, 54], shd: 23 },
    myeongseok: { x: 560, y: 520, box: [-47, -76, 94, 80], shd: 42 },
    jige: { x: 690, y: 520, box: [-54, -118, 108, 120], shd: 40 },
  };
  const ACTOR_SCALE = { A: 2.1, B1: 1.25, B2: 1.45 };
  /* 만화 컷 스팅 (audio.js AudioFX.sting): 친구 컷은 맞는 순간, _b 컷은 호랑이 반응, wrong_ 컷은 비웃음 */
  const CUT_SFX = {
    bam: 'hit', bam_b: 'dizzy',               // 알밤이 눈에 톡! → 눈 감싸고 빙글빙글
    jara: 'bite', jara_b: 'ouch',             // 자라가 코를 앙! → 엉엉
    ddong: 'slip', ddong_b: 'dizzy',          // 쇠똥에 미끄덩 → 눈이 뱅글뱅글
    songgot: 'poke', songgot_b: 'surprise',   // 송곳이 엉덩이 콕! → 펄쩍
    jeolgu: 'bigHit', jeolgu_b: 'dizzy',      // 절구가 머리 위에 쿵! → 혹 나고 어질어질
    myeongseok: 'roll', myeongseok_b: 'ouch', // 멍석이 돌돌 → 멍석 속에서 엉엉
    jige: 'splash', jige_b: 'surprise',       // 지게째 풍덩 → 바다에서 허우적
  };
  const FINALE_SFX = { bam: 'pop', jara: 'chomp', ddong: 'boing', songgot: 'poke', jeolgu: 'bonk', myeongseok: 'roll', jige: 'boing' };
  const STAR_SCALE = { bam: 1.9, jara: 1.9, ddong: 1.9, songgot: 1.9, jeolgu: 1.45, myeongseok: 1.15, jige: 1.15 };
  /* 다시 뽑은 컷 (2026-10-04): 절구 반응은 작은 혹+별, 지게는 A자 나무 지게가 멍석째 바다로, 헛수고 지게는 빈 A자 지게, 자라 반응은 입을 문 자라.
     새 파일을 못 불러오면 예전 그림(cut_<key>.png)으로 */
  const CUT_NEW = { jeolgu_b: 'jeolgu_b2', jige: 'jige2', wrong_jige: 'wrong_jige2', jara_b: 'jara_b2' };
  const cutOK = {};
  const cutUrl = key => A(`v2/cut_${CUT_NEW[key] && cutOK[key] !== false ? CUT_NEW[key] : key}.png`);

  let played = false; // 두 번째부터(다시 보기)는 오프닝·인트로 없이 바로 놀이

  async function run(T) {
    const { el, sleep, anim } = T;
    const $ = s => document.querySelector(s);
    const say = t => T.say(t);
    const img = (parent, href, x, y, w, h, par = 'xMidYMid meet', extra = {}) =>
      el('image', { href: A(href), x, y, width: w, height: h, preserveAspectRatio: par, ...extra }, parent);

    /* ---------- 미리 불러오기: 장면 그림 존재 확인, 컷, 녹음 ---------- */
    await Promise.race([
      Promise.all(Object.entries(SCENE_IMG).map(([k, u]) => T.preload(u).then(ok => { sceneOK[k] = ok; }))),
      sleep(2500),
    ]);
    const preCut = key => T.preload(cutUrl(key)).then(ok => { cutOK[key] = ok; if (!ok && CUT_NEW[key]) T.preload(cutUrl(key)); });
    FRIENDS.forEach(f => ['', '_b'].forEach(s => preCut(f.id + s)));
    FRIENDS.forEach(f => preCut('wrong_' + f.id));
    if (typeof NARRATION_CLIPS !== 'undefined') AudioFX.preloadAll(Object.values(NARRATION_CLIPS).flat());

    /* ---------- 층: 배경(bg) · 배우(world) · 근경(fgL) · 효과(fx) ----------
       무대 둘레는 엔진의 종이 구멍(#frame)이 맡는다: 무대 바깥은 종이, 아래 가장자리는 오린 종이의 깨끗한 그늘 */
    const cam = $('#cam'), stage = $('#stage');
    $('#pjFg') && $('#pjFg').remove();
    const fgL = el('g', { id: 'pjFg', 'pointer-events': 'none' });
    cam.insertBefore(fgL, T.fx);

    /* 확대해도 배우가 선 바닥선(y=520)이 화면에서 늘 같은 높이(무대 구멍 아래 가장자리 조금 위, 화면 y≈EDGE)에 오도록
       카메라 높이를 맞춘다. 와이드(1배)와 같은 높이라서 가까이 가도 인형 발이 바닥에 붙어 있다 (위로 뜨지 않는다) */
    const GROUND = 520, EDGE = 522;
    const groundY = (y, z) => {
      if (z <= 1.05) return y;
      const anchored = GROUND - (EDGE - 280) / z;
      // 선반 위 절구처럼 높은 곳을 비출 때 대상이 화면 밖으로 밀려나면 예외로 둔다
      return Math.abs(anchored - y) < 0.55 * 280 / z ? anchored : y;
    };
    /* 세로 화면: 양옆이 잘리므로 카메라를 좌우로 옮겨 호랑이 전신이 늘 보이게 한다 */
    let tigerDest = null, camBusy = 0;
    const portrait = () => T.viewWidth() < 990;
    function keepTiger(x, z) {
      let tg; try { tg = tiger; } catch (e) { return x; } // 호랑이를 만들기 전(오프닝)에는 그대로
      if (!portrait() || tg.pos.style.opacity === '0') return x;
      const tx = tigerDest ?? tg.x, hw = T.viewWidth() / 2 / z, tw = 112 * tg.scale + 12;
      const lo = tx + tw - hw, hi = tx - tw + hw;
      return lo > hi ? tx : Math.min(Math.max(x, lo), hi);
    }
    const camTo = async (x, y, z = 1, dur = 800) => {
      camBusy++;
      try { await T.camTo(keepTiger(x, z), groundY(y, z), z, dur); } finally { camBusy--; }
    };
    const camSnap = (x, y, z = 1) => { T.camSnap(keepTiger(x, z), groundY(y, z), z); };
    const camWide = (dur = 800) => camTo(500, 280, 1, dur);
    /* 세로 화면: 주어진 요소들이 모두 보이도록 카메라를 맞춘다 (화면 좌표 → 무대 좌표로 바꿔 합친 상자) */
    async function fitCam(els, maxZ, pad, dur) {
      const r = stage.getBoundingClientRect(), c = T.camera, k = Math.max(r.width / 1000, r.height / 560) * c.z;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      els.forEach(e => { const b = e.getBoundingClientRect(); if (!b.width) return;
        x0 = Math.min(x0, c.x + (b.left - cx) / k); x1 = Math.max(x1, c.x + (b.right - cx) / k);
        y0 = Math.min(y0, c.y + (b.top - cy) / k); y1 = Math.max(y1, c.y + (b.bottom - cy) / k); });
      if (!isFinite(x0)) return;
      const z = Math.min(maxZ, T.viewWidth() / (x1 - x0 + 2 * pad), 560 / (y1 - y0 + 2 * pad));
      await camTo((x0 + x1) / 2, (y0 + y1) / 2, z, dur);
    }

    /* ---------- 배우 ---------- */
    function makeGranny() {
      let art, ladle, hoe, tears;
      const a = T.actor(T.world, POS.grannyCook, 520, g => {
        el('ellipse', { class: 'shd', cx: 0, cy: -2, rx: 27, ry: 6 }, g);
        art = el('g', { class: 'pj-art' }, g);
        ladle = img(art, 'v2/c2_granny.png', -32, -118, 64, 118, 'xMidYMax meet');
        hoe = img(art, 'v2/c2_granny_hoe.png', -32, -118, 64, 118, 'xMidYMax meet');
        tears = el('g', { class: 'pj-tears', opacity: 0, fill: '#9ec8e8' }, art);
        el('path', { class: 'tear', d: 'M-12 -92 q-3 6 0 8 q3 -2 0 -8' }, tears);
        el('path', { class: 'tear t2', d: 'M12 -92 q3 6 0 8 q-3 -2 0 -8' }, tears);
      });
      Object.assign(a, { art, ladle, hoe, tears });
      return a;
    }
    function makeTiger() {
      let art;
      const a = T.actor(T.world, POS.tigerEnter, 520, g => {
        el('ellipse', { class: 'shd', cx: -4, cy: -3, rx: 76, ry: 10 }, g);
        art = el('g', { class: 'pj-art pj-tiger' }, g);
        img(art, 'v3w/tiger_stand.webp', -86, -108, 172, 108, 'xMidYMax meet', { class: 'tbase' });
        img(art, 'v3w/tiger_fallen.webp', -100, -92, 200, 92, 'xMidYMax meet', { class: 'tpose', 'data-pose': 'fallen' });
        img(art, 'v3w/tiger_flat.webp', -112, -74, 224, 74, 'xMidYMax meet', { class: 'tpose', 'data-pose': 'flat' });
        img(art, 'v3w/tiger_bow.webp', -80, -117, 160, 117, 'xMidYMax meet', { class: 'tpose', 'data-pose': 'bow' });
        // 알밤에 맞은 뒤: 한쪽 눈을 앞발로 감싸고 찡그린 그림 (예전엔 선 그림 위에 X 표시만 그렸다). 머리 크기를 선 그림에 맞춤
        img(art, 'v3w/tiger_eyehurt.webp', -42, -112, 84, 112, 'xMidYMax meet', { class: 'tpose', 'data-pose': 'eyehurt' });
        const ov = el('g', { class: 'toverlay' }, art);
        el('path', { id: 'pjEyeHurt', opacity: 0, d: 'M-73 -81 l14 14 M-59 -81 l-14 14', stroke: '#2c1a10', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, ov);
        const band = (p, x, y, r, s = 8) => { const b = el('g', { fill: '#efe0bd', transform: `translate(${x},${y}) rotate(${r})` }, p); el('rect', { x: -s, y: -s / 3, width: s * 2, height: s * .66, rx: s / 3 }, b); el('rect', { x: -s / 3, y: -s, width: s * .66, height: s * 2, rx: s / 3 }, b); };
        const w0 = el('g', { id: 'pjWnd0', opacity: 0 }, ov); el('circle', { cx: -66, cy: -66, r: 7, fill: '#f2a7a0', opacity: .85 }, w0); band(w0, -60, -90, -20);
        const w1 = el('g', { id: 'pjWnd1', opacity: 0 }, ov); el('circle', { cx: -80, cy: -62, r: 6, fill: '#f2a7a0', opacity: .9 }, w1); band(w1, -80, -60, 18);
        const w2 = el('g', { id: 'pjWnd2', opacity: 0, fill: '#8a6a45' }, ov); [[46, -26, 4], [57, -21, 3], [52, -34, 2.6]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r }, w2));
        const w3 = el('g', { id: 'pjWnd3', opacity: 0 }, ov); el('circle', { cx: 60, cy: -44, r: 5, fill: '#f2a7a0', opacity: .9 }, w3); band(w3, 60, -44, 20, 9);
        const w4 = el('g', { id: 'pjWnd4', opacity: 0 }, ov); el('ellipse', { cx: -52, cy: -104, rx: 11, ry: 9, fill: '#f0b26a' }, w4); el('ellipse', { cx: -55, cy: -107, rx: 4, ry: 3, fill: '#f8d9a8' }, w4);
        const dz = el('g', { id: 'pjDizzy', opacity: 0, fill: '#ffd54f', transform: 'translate(8,24)' }, ov);
        el('path', { class: 'dz', d: 'M-58 -136 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 Z' }, dz);
        el('path', { class: 'dz d1', d: 'M-80 -130 l2.4 5 5.6 .8 -4 4 .8 5.6 -4.8 -2.4 -4.8 2.4 .8 -5.6 -4 -4 5.6 -.8 Z' }, dz);
        el('path', { class: 'dz d2', d: 'M-36 -130 l2.4 5 5.6 .8 -4 4 .8 5.6 -4.8 -2.4 -4.8 2.4 .8 -5.6 -4 -4 5.6 -.8 Z' }, dz);
      });
      a.art = art;
      return a;
    }
    function makeFriend(f) {
      const c = FR[f.id];
      let act, sway;
      const a = T.actor(T.world, c.x, c.y, g => {
        el('ellipse', { class: 'shd', cx: 0, cy: -2, rx: c.shd, ry: Math.max(3.5, c.shd / 5.5) }, g);
        act = el('g', { class: 'fr-act' }, g);
        sway = el('g', { class: 'fr-sway' }, act);
        const [bx, by, bw, bh] = c.box;
        img(sway, `v2/c2_${f.id}.png`, bx + bw * .02, by + bh * .02, bw * .96, bh * .96, 'xMidYMax meet');
      });
      a.pos.classList.add('friend', 'fr-' + f.id);
      Object.assign(a, { id: f.id, act, sway, gx: c.x, gy: c.y, h: c.box[3], by: c.box[1], shown: false });
      return a;
    }
    function makeRolled() {
      const a = T.actor(T.world, POS.rolledSpot, 520, g => {
        el('ellipse', { class: 'shd', cx: 0, cy: 0, rx: 84, ry: 10 }, g);
        img(g, 'v2/c2_rolled.png', -105, -96, 210, 96, 'xMidYMax meet');
      });
      a.pos.style.display = 'none';
      return a;
    }

    /* ---------- 장면 ---------- */
    let scene = 'A', daylight = null;
    const friends = {}; // id → actor
    function setScene(k) {
      scene = k;
      const bg = T.bg;
      bg.innerHTML = ''; fgL.innerHTML = '';
      daylight = null;
      el('rect', { x: -3000, y: -3000, width: 7000, height: 7000, fill: k === 'A' ? '#e9c77a' : k === 'B1' ? '#241811' : '#1a2350' }, bg);
      const full = sceneOK[k];
      // 장면 한 장 그림: 무대(1000x560)를 꽉 채우고 가로 레터박스용으로 양옆을 조금 더 덮는다
      if (full) el('image', { href: SCENE_IMG[k], x: -40, y: -22, width: 1080, height: 605, preserveAspectRatio: 'xMidYMid slice' }, bg);
      if (k === 'A') {
        if (!full) {
          img(bg, 'v3w/a3_sky.webp', -150, -80, 1300, 760, 'xMidYMid slice');
          img(bg, 'v3w/a3_cloud1.webp', 520, 30, 320, 97);
          img(bg, 'v3w/a3_cloud1.webp', 40, 50, 230, 70, 'xMidYMid meet', { transform: 'translate(310,0) scale(-1,1)' });
          img(bg, 'v3w/a3_geese.webp', 700, 140, 190, 56);
          img(bg, 'v3w/a3_field.webp', -170, 370, 650, 250, 'xMidYMax slice', { class: 'prop' });
          img(bg, 'v3w/a3_field.webp', 450, 360, 720, 265, 'xMidYMax slice', { class: 'prop' });
          img(fgL, 'v3w/a3_fg_branch.webp', -120, -70, 240, 338);
          img(fgL, 'v3w/a3_fg_grass.webp', -140, 250, 180, 343);
          img(fgL, 'v3w/a3_fg_grass.webp', -1150, 270, 170, 324, 'xMidYMid meet', { transform: 'scale(-1,1)' });
        }
      }
      if (k === 'B1') {
        if (!full) {
          img(bg, 'v2/b_kitchen.png', -150, -60, 1300, 600, 'xMidYMax slice', { opacity: .96 });
          const w = el('g', { transform: 'translate(615,140)' }, bg);
          el('rect', { width: 150, height: 92, rx: 8, fill: '#182448' }, w);
          [18, 46, 74, 102, 130].forEach(x => el('rect', { x, y: -4, width: 10, height: 100, fill: '#4a3220' }, w));
          el('rect', { x: -8, y: -8, width: 166, height: 108, rx: 10, fill: 'none', stroke: '#5b3f28', 'stroke-width': 10 }, w);
          img(bg, 'v3w/b3_floor.webp', -150, 488, 1300, 150, 'none');
          el('ellipse', { cx: 220, cy: 400, rx: 280, ry: 190, fill: '#f7d98a', opacity: .12 }, bg);
          img(bg, 'v2/p2_meju.png', 80, 180, 80, 128, 'xMidYMin meet', { class: 'prop' });
          img(bg, 'v2/p2_chaeban.png', 196, 196, 96, 96, 'xMidYMid meet', { class: 'prop' });
          img(bg, 'v2/p2_gourds.png', 320, 182, 74, 108, 'xMidYMin meet', { class: 'prop' });
          img(bg, 'v2/p2_jipsin.png', 420, 204, 76, 66, 'xMidYMid meet', { class: 'prop' });
          img(bg, 'v2/p2_lamp.png', 392, 330, 96, 80, 'xMidYMid meet', { class: 'prop' });
        }
        daylight = el('rect', { x: -3000, y: -3000, width: 7000, height: 7000, fill: '#f2e3c0', opacity: 0, 'pointer-events': 'none' }, bg);
        // 이야기에 쓰이는 소품: 부뚜막(알밤) · 물독(자라) · 장작 · 부엌문(절구)
        img(bg, 'v3w/b3_door.webp', 808, 302, 153, 220, 'xMidYMax meet', { class: 'prop' });
        img(bg, 'v3w/b3_hearth.webp', 30, 390, 222, 120, 'xMidYMax meet', { class: 'prop' });
        img(bg, 'v2/p2_muldok.png', 258, 408, 88, 115, 'xMidYMax meet', { class: 'prop' });
        img(bg, 'v2/p2_firewood.png', 352, 462, 78, 62, 'xMidYMax meet', { class: 'prop' });
        const st = el('g', { class: 'pj-steam', fill: '#f6efe2', opacity: .8 }, bg);
        [[82, 380, 9, 6, ''], [96, 370, 11, 7, 'p2'], [190, 372, 8, 5, 'p3']].forEach(([cx, cy, rx, ry, c]) => el('ellipse', { class: 'puff ' + c, cx, cy, rx, ry }, st));
        el('ellipse', { class: 'pj-fire', cx: 150, cy: 505, rx: 160, ry: 70, fill: '#ff9a4d', opacity: .18 }, bg);
      }
      if (k === 'B2') {
        if (!full) {
          img(bg, 'v2/b_sky.png', -150, -80, 1300, 760, 'xMidYMid slice');
          img(bg, 'v2/b_hills.png', -150, 249, 1300, 185, 'none', { class: 'prop' });
          img(bg, 'v2/p2_pine.png', 700, 235, 200, 220, 'xMidYMax meet', { class: 'prop' });
          img(bg, 'v3w/c3_yard.webp', -150, 440, 1300, 200, 'none');
          img(bg, 'v3w/c3_sea.webp', 790, 436, 400, 126, 'none', { class: 'prop' });
          img(bg, 'v2/p2_haystack.png', 760, 372, 80, 96, 'xMidYMax meet', { class: 'prop' });
          const sn = el('g', { class: 'pj-snow', fill: '#f6f8fd', opacity: .9 }, fgL);
          [[80, 11, 0], [240, 13, -4], [420, 10, -7], [590, 12, -2], [760, 14, -9], [930, 11, -5]].forEach(([cx, d, dl]) => {
            const c = el('circle', { cx, cy: -20, r: 4 }, sn); c.style.animationDuration = d * .7 + 's'; c.style.animationDelay = dl + 's';
          });
        }
        // 이야기에 쓰이는 소품: 집(할멈·호랑이가 드나드는 문) · 장독대 · 돌담(지게가 기댄 담벼락)
        img(bg, 'v3w/c3_house.webp', -130, 250, 560, 275, 'xMidYMax meet', { class: 'prop' });
        el('ellipse', { cx: DOOR_X.B2, cy: 440, rx: 90, ry: 90, fill: '#f7d98a', opacity: .16 }, bg);
        img(bg, 'v3w/c3_jangdok.webp', 330, 438, 140, 82, 'xMidYMax meet', { class: 'prop' });
        if (!full) img(bg, 'v2/p2_doldam.png', 470, 440, 190, 80, 'none', { class: 'prop' }); // 장면 그림엔 돌담·사립문이 이미 있다
      }
      // 배우 크기·옷차림·보이는 친구
      granny.setScale(ACTOR_SCALE[k]); tiger.setScale(ACTOR_SCALE[k]);
      granny.ladle.style.display = k === 'A' ? 'none' : '';
      granny.hoe.style.display = k === 'A' ? '' : 'none';
      Object.values(friends).forEach(f => { f.pos.style.display = (FRIEND_SET[f.id] === k && f.shown) ? '' : 'none'; });
    }

    /* ---------- 배우 도우미 ---------- */
    async function walk(a, x, speed = 260, turn = true) {
      const dx = x - a.x;
      const dur = Math.max(300, Math.abs(dx) / speed * 1000);
      if (turn && Math.abs(dx) > 4) a.face(dx > 0 ? 'right' : 'left'); // turn=false: 뒷걸음질 (보던 쪽을 그대로 보며 물러난다)
      a.art && a.art.classList.add('walking');
      const moving = a.move(x, a.y, dur, 'ease-in-out');
      let follow = null;
      if (a === tiger) {
        tigerDest = x;
        await Promise.resolve(); // 같은 Promise.all 안의 카메라 이동이 먼저 시작되게
        // 세로 화면에서 따로 카메라를 움직이는 중이 아니면, 호랑이를 따라 카메라를 옮긴다
        if (portrait() && !camBusy) { const c = T.camera; follow = camTo(c.x, c.y, c.z, dur); }
      }
      await moving;
      if (follow) await follow;
      if (a === tiger) tigerDest = null;
      a.art && a.art.classList.remove('walking');
    }
    /* 무대 밖 대기: 가로 화면 클로즈업 때 레터박스 가장자리로 비치지 않게 숨긴다 */
    const parkTiger = () => { tiger.place(POS.tigerEnter, 520); tiger.pos.style.opacity = 0; };
    const faceTo = (a, b) => a.face(b.x > a.x ? 'right' : 'left');
    const pose = p => { tiger.art.classList.remove('fallen', 'flat', 'bow'); if (p) tiger.art.classList.add(p); };
    const tigerEyesHurt = on => { $('#pjEyeHurt').setAttribute('opacity', on ? 1 : 0); tiger.art.classList.toggle('eyehurt', !!on); };
    const showWound = i => { const w = $('#pjWnd' + i); w && w.setAttribute('opacity', 1); };
    const dizzy = on => $('#pjDizzy').setAttribute('opacity', on ? 1 : 0);
    function grannyMood(m) {
      granny.art.classList.remove('scaredShake');
      granny.tears.setAttribute('opacity', m === 'cry' ? 1 : 0);
      if (m === 'scared') granny.art.classList.add('scaredShake');
    }
    const impact = (x, y, word, color = '#8e3b2f') => T.pop(x, y, word, color);
    const bounceFriend = id => friends[id].hop(26, 500);
    function camFriend(id, dur) {
      const f = friends[id];
      const z = Math.min(2.6, Math.max(1.6, (560 * .3) / f.h));
      return camTo(f.gx, f.gy + f.by + f.h / 2 - 20, z, dur);
    }
    function stationCam(i, tigerX = POS.tigerStage[i]) {
      const [cx, cy, z] = STATION_CAM[i];
      if (scene !== 'B1') return [cx, cy, z];
      const lo = Math.min(tigerX - 120, POS.grannyCorner - 70), hi = Math.max(tigerX + 120, POS.grannyCorner + 70);
      return [(lo + hi) / 2, cy, Math.min(z, Math.max(1.1, 1000 / (hi - lo)))];
    }
    function friendTo(id, x, dur, big = false) {
      const f = friends[id];
      f.shown = true; f.pos.style.display = '';
      const to = `translate(${x - f.gx}px, ${Math.max(0, 520 - f.gy)}px) scale(${big ? STAR_SCALE[id] : 1})`;
      if (!dur) { f.act.style.transform = to; return Promise.resolve(); }
      return anim(f.act, [{ transform: to }], { duration: dur, easing: 'ease-out' });
    }
    /* 타격 순간 무대를 살짝 밀기 */
    const punch = () => stage.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' });

    /* 만화 컷 (그림): 친구마다 두 장, 틀리면 비웃는 한 장. 4초 뒤 자동, 탭하면 빨리 */
    let lastCut = Promise.resolve();
    function showCut(id, hold = 4000, split = true) {
      const keys = id.startsWith('wrong_') ? [id] : [id, id + '_b'];
      const V = new Proxy({}, { get: (_, k) => Narrator.voiceLine(k) || undefined });
      // 컷 속 목소리: 첫 장(친구가 치는 순간) = 친구의 외침, 둘째 장(_b, 호랑이 반응) = 호랑이 비명.
      // _b 전용 대사가 있거나(지게) 컷을 기다리지 않고 내레이션이 이어지면(split=false, 멍석) 첫 장에서 둘 다 외친다
      // (내레이션은 이어지는 목소리 묶음이 끝나야 시작하므로, 둘째 장 목소리를 따로 내면 내레이션과 겹친다).
      // 헛수고 컷은 친구가 머쓱 → 호랑이가 비웃음
      const voiceOf = key => {
        if (key.startsWith('wrong_')) return [].concat(V['oops_' + key.slice(6)] || [], V[Math.random() < .5 ? 'cut_wrong_1' : 'cut_wrong_2'] || []);
        if (key.endsWith('_b')) return V['cut_' + key] || (split ? [].concat(V['cut_' + key.slice(0, -2)] || []).slice(1) : null);
        return V['cut_' + key + '_b'] || !split ? V['cut_' + key] : [].concat(V['cut_' + key] || []).slice(0, 1);
      };
      const list = keys.map(key => ({ src: cutUrl(key), sfx: key.startsWith('wrong_') ? 'laugh' : CUT_SFX[key], voice: voiceOf(key) }));
      const onShow = o => { punch(o); if (o.voice && o.voice.length) setTimeout(() => AudioFX.voice(o.voice), 380); };
      lastCut = lastCut.then(() => T.cutImage(list, { hold, onShow }));
      return lastCut;
    }

    /* ---------- 카드 (패 받침) ---------- */
    const trayEl = document.createElement('div');
    trayEl.id = 'tray'; trayEl.className = 'locked'; trayEl.hidden = true;
    $('#tray') && $('#tray').remove();
    $('#stageWrap').after(trayEl);
    let cardWaiter = null, trayLocked = true;
    function lockTray(v) {
      trayLocked = v;
      trayEl.classList.toggle('locked', v);
      trayEl.querySelectorAll('.card').forEach(b => { b.classList.add('tap-target'); b.classList.toggle('armed', !v && !b.classList.contains('used')); });
    }
    function buildTray() {
      trayEl.innerHTML = '';
      const order = FRIENDS.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      order.forEach(i => {
        const f = FRIENDS[i];
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'card'; b.id = 'card-' + f.id;
        b.innerHTML = `<img src="${A('v2/c2_' + f.id + '.png')}" alt=""><span>${T.tr(f.name)}</span>`;
        b.addEventListener('pointerdown', e => {
          e.stopPropagation();
          if (trayLocked || !cardWaiter) {
            // 연출 중에 눌러도 무반응이면 답답하다 — 살짝 흔들고 톡 소리만
            AudioFX.tap(); b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge');
            return;
          }
          if (b.classList.contains('used')) { AudioFX.tap(); return; }
          const w = cardWaiter; cardWaiter = null; lockTray(true); w(i);
        });
        trayEl.appendChild(b);
      });
      trayEl.hidden = false;
      lockTray(true);
    }
    const waitCard = () => new Promise(res => { cardWaiter = res; lockTray(false); });

    /* ---------- 건너뛰기 버튼 (인트로, 1초 꾹) ---------- */
    let skipRequested = false;
    $('#skipBtn') && $('#skipBtn').remove();
    const skipBtn = document.createElement('button');
    skipBtn.id = 'skipBtn'; skipBtn.type = 'button'; skipBtn.hidden = true;
    skipBtn.innerHTML = `<span>${T.tr('꾹 눌러 건너뛰기')}</span>`;
    T.root.appendChild(skipBtn);
    let skipTimer = null;
    const cancelSkip = () => { clearTimeout(skipTimer); skipTimer = null; skipBtn.classList.remove('holding'); };
    skipBtn.addEventListener('pointerdown', e => {
      e.stopPropagation(); AudioFX.tap(); skipBtn.classList.add('holding');
      skipTimer = setTimeout(() => { cancelSkip(); skipRequested = true; Narrator.stop(); }, 1000);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => skipBtn.addEventListener(ev, cancelSkip));

    /* ---------- 등장인물 만들기 ---------- */
    const granny = makeGranny();
    FRIENDS.forEach(f => { friends[f.id] = makeFriend(f); });
    const rolled = makeRolled();
    const tiger = makeTiger();
    T.world.appendChild(granny.pos); // 할멈은 친구들 앞
    T.world.appendChild(tiger.pos);
    T.world.appendChild(rolled.pos);
    let stageI = 0, misses = 0;

    /* 대사 연출: 목소리 주인에게 카메라가 가고, 말하는 쪽과 듣는 쪽이 서로 마주 본다 */
    T.director({
      cast: { halmi: granny, tiger, ...friends },
      listener: r => (r === 'halmi' ? 'tiger' : 'halmi'),
      camTo: (x, y, z, dur) => camTo(x, y, z, dur),
    });

    /* ================= 시작: 종이 조리개가 열리며 낮 팥밭이 보인다 ================= */
    async function openScene() {
      setScene('A');
      grannyMood('cook');
      granny.place(POS.grannyCook, 520); parkTiger();
      camSnap(500, 280, 1);
      await sleep(300);
      await T.curtain(true);
    }

    /* ================= 인트로 ================= */
    async function playIntro() {
      skipBtn.hidden = false;
      const beats = [];
      // 1. 낮 — 팥밭에서 일하는 할멈 클로즈업
      beats.push(async () => {
        grannyMood('cook');
        await camTo(240, 430, 1.55, 1100);
        await say(INTRO.opening[0]);
      });
      // 2. 호랑이 등장 — 와이드로 빠졌다가 호랑이 쪽으로
      beats.push(async () => {
        await camWide(700);
        AudioFX.growl();
        tiger.pos.style.opacity = 1;
        await walk(tiger, 700, 340);
        tiger.face('left');
        granny.face('right');
        grannyMood('scared');
        impact(700, 330, '어흥!', '#c0392b');
        AudioFX.thud(); T.shake();
        granny.hop(26, 420);
        await granny.move(granny.x - 24, 520, 420, 'ease-out');
        granny.art.style.transition = 'rotate .22s ease-in';
        granny.art.style.rotate = '-24deg';
        await camTo(690, 430, 1.45, 600);
        await say(INTRO.opening[1]);
      });
      // 3. 약속 — 와이드, 호랑이 퇴장
      beats.push(async () => {
        granny.art.style.transition = 'rotate .35s ease-out';
        granny.art.style.rotate = '0deg';
        await sleep(360);
        granny.art.style.transition = ''; granny.art.style.rotate = '';
        grannyMood('cook');
        await camWide(700);
        await say(INTRO.opening[2]);
        await walk(tiger, POS.tigerEnter, 340);
        parkTiger();
        granny.face('left');
      });
      // 4. 동짓날 저녁 — 낮 팥밭에서 저녁 부엌으로
      beats.push(async () => {
        await T.sceneCard('동짓날 저녁', () => {
          setScene('B1');
          granny.place(POS.grannyCook, 520); granny.face('left');
          grannyMood('cry');
          daylight && daylight.setAttribute('opacity', .25);
          camSnap(240, 430, 1.6);
        }, granny.pos);
        await say(INTRO.opening[3]);
      });
      // 5~11. 친구들 등장 — 와이드로 입장을 보여주고 숨는 곳을 클로즈업
      FRIENDS.forEach(f => beats.push(async () => {
        if (skipRequested) return;
        const set = FRIEND_SET[f.id];
        if (set === 'B2' && scene !== 'B2') await T.sceneCard('마당', () => setScene('B2'), granny.pos);
        await camWide(500);
        AudioFX.jingle();
        const fr = friends[f.id];
        fr.shown = true; fr.pos.style.display = '';
        // 세트의 문에서 들어와 바닥을 따라 걸어온 뒤, 숨는 자리로 폴짝 오른다
        const doorDx = DOOR_X[set] - fr.gx;
        const groundDy = Math.max(0, 520 - fr.gy);
        await anim(fr.act, [{ transform: `translate(${doorDx}px, ${groundDy}px)` }, { transform: `translate(0px, ${groundDy}px)` }],
          { duration: Math.max(500, Math.abs(doorDx) * 3), easing: 'ease-out' });
        if (groundDy > 4) {
          AudioFX.tap();
          await anim(fr.act, [{ transform: `translate(0px, ${groundDy}px)` }, { transform: `translate(0px, ${groundDy * .4 - 24}px)` }, { transform: 'translate(0px, 0px)' }],
            { duration: Math.max(420, groundDy * 2.2), easing: 'ease-in-out' });
        }
        fr.act.style.transform = '';
        camFriend(f.id, 650);
        bounceFriend(f.id);
        await say(f.intro);
      }));

      for (const beat of beats) {
        if (skipRequested) break;
        await beat();
        if (skipRequested) break;
        await sleep(350);
      }
      // 건너뛰었든 아니든 인트로 끝 상태로 정리
      Narrator.stop();
      granny.art.style.transition = ''; granny.art.style.rotate = '';
      Object.values(friends).forEach(fr => { fr.shown = true; fr.act.style.transform = ''; });
      if (scene === 'A') setScene('B1'); else setScene(scene);
      parkTiger();
      granny.place(POS.grannyCook, 520); granny.face('left');
      grannyMood('cry');
      if (daylight) anim(daylight, [{ opacity: skipRequested ? 1 : .25 }, { opacity: 0 }], 900);
      await camWide(600);
      // 호랑이가 오기 전, 숨은 친구들에게 작전 속삭이기 (놀이 설명)
      await say(INTRO.help);
      skipBtn.hidden = true;
    }

    /* ================= 놀이 ================= */
    async function beginPlay(replay) {
      stageI = 0; misses = 0;
      buildTray();
      if (replay) {
        // 다시 보기: 덮인 종이 뒤에서 무대를 차려 두고 종이 조리개를 연다
        Object.values(friends).forEach(fr => { fr.shown = true; });
        setScene('B1');
        if (daylight) daylight.setAttribute('opacity', 0);
        granny.place(POS.grannyCook, 520); grannyMood('cry');
        parkTiger();
        camSnap(500, 280, 1);
        await sleep(300);
        await T.curtain(true);
      } else {
        await T.sceneCard('깜깜한 밤', () => {
          setScene('B1');
          if (daylight) daylight.setAttribute('opacity', 0);
          camSnap(500, 280, 1);
        });
      }
      AudioFX.growl();
      const arrive = say(INTRO.tigerBack);
      // 호랑이가 부엌문을 벌컥 열고 들어와 문가에 버티고 선다
      tiger.pos.style.opacity = 0;
      tiger.place(DOOR_X.B1 - 25, 520); tiger.face('left');
      await sleep(150);
      tiger.pos.style.opacity = 1;
      T.shake();
      impact(DOOR_X.B1 - 25, 340, '어흥!', '#c0392b');
      grannyMood('scared'); granny.face('right');
      await arrive;
      // 할멈의 말에 이끌려 호랑이가 아궁이로 가고, 그 틈에 할멈은 반대편 구석으로 피한다
      const lure = say(PROMPTS[0]);
      await sleep(1400);
      await Promise.all([
        walk(tiger, POS.tigerStage[0], 240),
        walk(granny, POS.grannyCorner, 300).then(() => grannyMood('scared')),
        camTo(...stationCam(0), 1300),
      ]);
      tiger.face('left');
      faceTo(granny, tiger);
      await lure;
    }

    async function handleCorrect(idx) {
      const f = FRIENDS[idx];
      AudioFX.ding();
      const card = $('#card-' + f.id);
      card.classList.add('used'); card.classList.remove('hint');
      misses = 0;
      await SUCCESS[f.id]();
      showWound(idx); // 맞은 자리마다 상처가 남는다
      await say(f.success);
      stageI++;
      if (stageI >= FRIENDS.length) return;
      await ADVANCE[stageI]();
      if (scene === 'B1') faceTo(granny, tiger); // 할멈은 구석에서도 늘 호랑이 쪽을 본다
      await say(PROMPTS[stageI]);
    }

    async function handleWrong(idx) {
      const f = FRIENDS[idx], fr = friends[f.id];
      if (FRIEND_SET[f.id] === scene) {
        await camTo(fr.gx, fr.gy + fr.by / 2, 1.45, 550); // 헛수고하는 친구에게 컷
        await FAIL[f.id]();
        impact(fr.gx, fr.gy + fr.by - 30, '어라?', '#7a6a55');
      }
      // 다른 세트의 친구를 눌러도 비웃는 컷은 항상 뜬다
      await showCut('wrong_' + f.id, 3600);
      AudioFX.miss();
      await say(f.fail);
      misses++;
      await camTo(...stationCam(stageI, tiger.x), 550); // 호랑이에게 컷백
      await giveHelp();
    }
    /* 틀릴수록 더 도와준다: 1회 = 장소 힌트, 2회부터 = 정답 카드·친구가 들썩이며 이름을 알려줌 */
    async function giveHelp() {
      const help = HELP[stageI];
      if (misses === 1) { await say(help.where); return; }
      const id = FRIENDS[stageI].id;
      const card = $('#card-' + id);
      if (card) card.classList.add('hint');
      if (FRIEND_SET[id] === scene) bounceFriend(id);
      AudioFX.jingle();
      await say(help.who);
    }

    /* ===== 정답 연출 ===== */
    const act = id => friends[id].act;
    const SUCCESS = {
      async bam() {
        const dx = (tiger.x - 58) - FR.bam.x;
        AudioFX.pop();
        await anim(act('bam'), [{ transform: 'translate(0px,0px)' }, { transform: `translate(${dx * .5}px,-120px) rotate(180deg)` }, { transform: `translate(${dx}px,-80px) rotate(360deg)` }], { duration: 550, easing: 'ease-out' });
        AudioFX.bonk();
        impact(tiger.x - 58, 390, '톡!');
        await showCut('bam');
        tigerEyesHurt(true);
        AudioFX.whimper();
        tiger.hop(34, 400);
        await anim(act('bam'), [{ transform: `translate(${dx}px,-80px)` }, { transform: `translate(${dx * .4}px,-140px) rotate(-180deg)` }, { transform: 'translate(0px,0px) rotate(-360deg)' }], { duration: 500, easing: 'ease-in' });
        act('bam').style.transform = '';
      },
      async jara() {
        AudioFX.chomp();
        await anim(act('jara'), [{ transform: 'translate(0px,0px)' }, { transform: 'translate(-8px,-30px) rotate(-20deg)' }, { transform: 'translate(0px,0px)' }], { duration: 450, easing: 'ease-out' });
        impact(300, 380, '앙!');
        await showCut('jara');
        AudioFX.whimper();
        tiger.art.classList.add('shiver');
        tiger.hop(20, 420);
        await tiger.move(tiger.x + 26, 520, 420);
        await sleep(350);
        tiger.art.classList.remove('shiver');
      },
      async ddong() {
        AudioFX.slide();
        impact(440, 440, '미끌~', '#4f7d46');
        await tiger.move(POS.tigerStage[3], 520, 500, 'ease-in');
        pose('fallen');
        AudioFX.thud();
        impact(470, 460, '꽈당!');
        T.shake();
        await showCut('ddong');
        await sleep(400);
      },
      async songgot() {
        AudioFX.poke();
        await anim(act('songgot'), [{ transform: 'translate(0px,0px)' }, { transform: 'translate(0px,-18px)' }, { transform: 'translate(0px,0px)' }], 260);
        impact(495, 440, '콕!');
        await showCut('songgot');
        pose(null);
        AudioFX.boing();
        await tiger.hop(100, 550);
      },
      async jeolgu() {
        const dx = (tiger.x - 58) - FR.jeolgu.x, dy = 150;
        AudioFX.slide();
        await anim(act('jeolgu'), [{ transform: 'translate(0px,0px)' }, { transform: `translate(${dx}px,${dy}px) rotate(14deg)` }], { duration: 420, easing: 'ease-in' });
        AudioFX.bonk();
        impact(tiger.x - 40, 370, '쿵!');
        T.shake();
        await showCut('jeolgu');
        dizzy(true);
        anim(tiger.body, [{ transform: 'translateY(0px)' }, { transform: 'translateY(10px) scaleY(.9)' }, { transform: 'translateY(0px)' }], 380);
        await sleep(500);
        await anim(act('jeolgu'), [{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0px,0px)' }], { duration: 450, easing: 'ease-out' });
        act('jeolgu').style.transform = '';
      },
      async myeongseok() {
        AudioFX.roll();
        impact(560, 400, '돌돌돌!');
        showCut('myeongseok', 4000, false); // 말리는 동안 컷 (기다리지 않음 → 목소리는 첫 장에 몰아서)
        await anim(act('myeongseok'), [{ transform: 'translate(0px,0px) rotate(0deg)' }, { transform: 'translate(-10px,-40px) rotate(-360deg) scale(1.25)' }, { transform: 'translate(0px,-6px) rotate(-720deg) scale(1.1)' }], { duration: 900, easing: 'ease-in-out' });
        pose(null);
        tiger.pos.style.opacity = 0;
        friends.myeongseok.pos.style.display = 'none'; friends.myeongseok.shown = false;
        act('myeongseok').style.transform = '';
        rolled.place(POS.rolledSpot, 520); rolled.pos.style.display = '';
        await anim(rolled.body, [{ transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0deg)' }], 700);
      },
      async jige() {
        // 지게가 다가가 멍석말이 호랑이를 지고 물가로
        await anim(act('jige'), [{ transform: 'translate(0px,0px)' }, { transform: 'translate(-45px,0px)' }], { duration: 500, easing: 'ease-in-out' });
        AudioFX.boing();
        await Promise.all([
          rolled.move(930, 475, 1700),
          anim(act('jige'), [{ transform: 'translate(-45px,0px)' }, { transform: 'translate(215px,0px)' }], { duration: 1700, easing: 'ease-in-out' }),
          camTo(880, 440, 1.4, 1700),
        ]);
        // 물에 풍덩
        rolled.pos.removeAttribute('transform');
        await anim(rolled.pos, [
          { transform: 'translate(930px,475px) rotate(0deg)' },
          { transform: 'translate(965px,405px) rotate(160deg)' },
          { transform: 'translate(970px,505px) rotate(340deg) scale(.55)' },
        ], { duration: 800, easing: 'ease-in' });
        rolled.pos.style.display = 'none'; rolled.pos.style.transform = '';
        AudioFX.splash();
        impact(950, 420, '풍덩!', '#3e6a8a');
        showCut('jige'); // 물보라와 동시 (기다리지 않음)
        const sp = el('g', { transform: 'translate(962,478)' }, T.fx);
        el('path', { d: 'M0 0 Q-16 -34 -30 -10 M0 0 Q0 -44 14 -14 M0 0 Q20 -30 30 -6', stroke: '#8fb8dd', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, sp);
        [[-22, -30, 5], [8, -40, 6], [28, -24, 4.6]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#bcd8ee' }, sp));
        anim(sp, [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], 900).then(() => sp.remove());
        await anim(act('jige'), [{ transform: 'translate(215px,0px)' }, { transform: 'translate(0px,0px)' }], { duration: 900, easing: 'ease-in-out' });
        act('jige').style.transform = '';
      },
    };

    /* ===== 단계 전환: 다음 공격 지점으로 호랑이 이동 ===== */
    const ADVANCE = {
      1: async () => { tigerEyesHurt(true); await Promise.all([walk(tiger, POS.tigerStage[1], 380), camTo(...stationCam(1), 900)]); tiger.face('left'); },
      2: async () => { tigerEyesHurt(false); tiger.face('left'); await Promise.all([walk(tiger, POS.tigerStage[2], 300, false), camTo(...stationCam(2), 900)]); }, // 물독에서 놀라 뒷걸음질: 물독(왼쪽)을 본 채로 물러난다
      3: async () => { await camTo(...stationCam(3, tiger.x), 600); /* 이미 미끄러져 넘어진 상태 */ },
      4: async () => {
        // 문 쪽으로 도망치다 구석의 할멈을 폴짝 뛰어넘는다
        const over = sleep(Math.max(0, (POS.grannyCorner - 60 - tiger.x) / 360 * 1000)).then(() => {
          grannyMood('scared');
          return anim(tiger.body, [{ transform: 'translateY(0px)' }, { transform: 'translateY(-120px)', offset: .5 }, { transform: 'translateY(0px)' }], { duration: 520, easing: 'ease-in-out' });
        });
        await Promise.all([walk(tiger, POS.tigerStage[4], 360), camTo(...stationCam(4), 900), over]);
        tiger.face('left');
      },
      5: async () => {
        // 절구에 맞은 호랑이가 문을 뛰쳐나와 마당으로 도망친다
        await T.sceneCard('마당', () => {
          setScene('B2');
          granny.pos.style.display = 'none'; // 할멈은 부엌에 남는다
          camSnap(500, 280, 1);
        }, tiger.pos);
        tiger.pos.style.opacity = 0;
        tiger.place(DOOR_X.B2 + 30, 520); tiger.face('left');
        await sleep(150);
        tiger.pos.style.opacity = 1;
        T.shake();
        await sleep(300);
        await Promise.all([walk(tiger, POS.tigerStage[5], 260), camTo(...STATION_CAM[5], 1400)]);
        dizzy(false);
        pose('flat');
        AudioFX.thud();
        await sleep(300);
      },
      6: async () => { await camTo(...STATION_CAM[6], 600); /* 멍석에 말린 상태 */ },
    };

    /* ===== 오답 연출: 헛수고 장면 ===== */
    const FAIL = {
      async bam() {
        AudioFX.pop();
        await anim(act('bam'), [{ transform: 'translate(0px,0px)' }, { transform: 'translate(-60px,-100px) rotate(-180deg)' }, { transform: 'translate(-90px,0px) rotate(-360deg)' }, { transform: 'translate(-60px,-40px) rotate(-460deg)' }, { transform: 'translate(0px,0px) rotate(-720deg)' }], { duration: 1200, easing: 'ease-in-out' });
        act('bam').style.transform = '';
      },
      async jara() {
        AudioFX.chomp();
        await anim(act('jara'), [{ transform: 'translate(0px,0px)' }, { transform: 'translate(-6px,-16px)' }, { transform: 'translate(6px,-16px)' }, { transform: 'translate(0px,0px)' }], 700);
        AudioFX.chomp();
      },
      async ddong() {
        await bounceFriend('ddong');
        AudioFX.boing();
        if (tiger.pos.style.opacity !== '0' && !tiger.art.classList.contains('flat') && !tiger.art.classList.contains('fallen')) await tiger.hop(40, 450);
      },
      async songgot() {
        AudioFX.poke();
        await anim(act('songgot'), [{ transform: 'translate(0px,0px)' }, { transform: 'translate(0px,-16px)' }, { transform: 'translate(0px,0px)' }, { transform: 'translate(0px,-16px)' }, { transform: 'translate(0px,0px)' }], 600);
      },
      async jeolgu() {
        AudioFX.slide();
        await anim(act('jeolgu'), [{ transform: 'translate(0px,0px)' }, { transform: 'translate(-30px,205px) rotate(30deg)' }], { duration: 450, easing: 'ease-in' });
        AudioFX.thud();
        await sleep(350);
        await anim(act('jeolgu'), [{ transform: 'translate(-30px,205px)' }, { transform: 'translate(0px,0px)' }], { duration: 500, easing: 'ease-out' });
        act('jeolgu').style.transform = '';
      },
      async myeongseok() {
        AudioFX.roll();
        await anim(act('myeongseok'), [{ transform: 'scaleX(1)' }, { transform: 'scaleX(1.5)' }, { transform: 'scaleX(.8)' }, { transform: 'scaleX(1)' }], 900);
      },
      async jige() {
        AudioFX.boing();
        await anim(act('jige'), [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(0deg)' }], 800);
      },
    };

    /* ================= 엔딩 ================= */
    async function happyEnd() {
      trayEl.hidden = true;
      await lastCut; // 풍덩 컷이 잔치 장면을 가리지 않게 끝까지 보고 넘어간다
      AudioFX.sting('win'); // 두구두구-짜잔!-와아
      await camWide(900);
      T.confetti();
      grannyMood('happy');
      // 할멈이 집 문에서 마당으로 걸어 나온다
      granny.place(DOOR_X.B2, 520); granny.face('left');
      granny.pos.style.opacity = 0; granny.pos.style.display = '';
      await sleep(150);
      granny.pos.style.opacity = 1;
      await walk(granny, 560, 260);
      granny.face('left');
      const GATHER = { jara: 395, bam: 445, ddong: 495, songgot: 625, jeolgu: 670, myeongseok: 735, jige: 810 };
      Object.values(friends).forEach(fr => fr.pos.classList.add('party'));
      await Promise.all([...FRIENDS.map(f => friendTo(f.id, GATHER[f.id], 850, true)), camTo(600, 430, 1.4, 1100)]);
      // 세로 화면: 1.4배 클로즈업이면 양 끝 친구가 잘린다 → 잔치에 모인 모두가 들어오게 카메라를 맞춘다.
      // 친구 그림(act)만 누름 대상으로 쓴다 (원래 자리에 남은 그림자까지 넣으면 누름 영역이 화면 밖으로 넓어진다)
      const partyEl = f => friends[f.id].act;
      if (portrait()) await fitCam([...FRIENDS.map(partyEl), granny.pos], 1.4, 28, 800);
      T.finale();
      await say(LINES.happyEnd);
      // 잔치: 친구·할멈을 차례로 톡 하면 인사한다
      await say(LINES.finaleTap);
      // 누르면 처음 등장 때와 같은 목소리로 인사
      const hello = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };
      // 한 명씩 차례로 톡 (자유 놀이 없이): 친구들 → 할멈 순서
      const greet = [
        ...FRIENDS.map(f => ({ el: partyEl(f), go: () => { const s = FINALE_SFX[f.id]; s && AudioFX[s] && AudioFX[s](); friends[f.id].hop(26, 500); hello('hi_' + f.id); } })),
        { el: granny.pos, go: () => { AudioFX.jingle(); granny.hop(22, 420); hello('hi_halmi'); } },
      ];
      for (const g of greet) { await T.tap(g.el); g.go(); await sleep(700); }
      await bowTogether();
    }

    /* 마무리: 종이 조리개가 한 번 닫혔다 열리면 모두 한 줄로 서 있고, 차례로 꾸벅 인사한다 */
    async function bowTogether() {
      await camWide(700);
      const LINE_X = { jara: 235, bam: 295, ddong: 355, songgot: 420, jeolgu: 595, myeongseok: 675, jige: 770 };
      await T.sceneCard('모두 꾸벅', () => {
        $('#confetti').innerHTML = '';
        Object.values(friends).forEach(fr => fr.pos.classList.remove('party'));
        FRIENDS.forEach(f => friendTo(f.id, LINE_X[f.id], 0, true));
        granny.place(505, 520); granny.face('left');
        rolled.pos.style.display = 'none';
        pose(null); tigerEyesHurt(false); dizzy(false);
        tiger.place(880, 520); tiger.face('left');
        tiger.pos.style.opacity = 1;
        camSnap(500, 280, 1);
      });
      await camTo(560, 440, 1.3, 900);
      // 차례로 꾸벅. 세로 화면은 한 줄(x 235~880)이 다 안 들어오므로 꾸벅하는 쪽으로 카메라를 옮겨 간다 (엔진 camTo: 호랑이 붙잡기 없이)
      const bow = t => anim(t, [{ rotate: '0deg' }, { rotate: '-16deg' }, { rotate: '0deg' }], { duration: 520, easing: 'ease-in-out' });
      const look = x => (portrait() ? T.camTo(x, groundY(440, 1.3), 1.3, 380) : Promise.resolve());
      for (const f of FRIENDS) {
        await look(LINE_X[f.id]);
        const s = FINALE_SFX[f.id]; s && AudioFX[s] && AudioFX[s]();
        await bow(friends[f.id].sway);
      }
      await look(505);
      AudioFX.jingle();
      await bow(granny.art);
      await look(880);
      AudioFX.whimper();
      pose('bow'); // 반창고 붙인 호랑이도 꾸벅 — 무섭지 않게 끝낸다
      await bow(tiger.art);
      AudioFX.fanfare();
      await sleep(700);
      await camWide(700);
    }

    /* ================= 진행 ================= */
    if (!played) {
      played = true;
      await openScene();
      await playIntro();
      await beginPlay(false);
    } else {
      await beginPlay(true);
    }
    while (stageI < FRIENDS.length) {
      const idx = await waitCard();
      if (idx === stageI) await handleCorrect(idx); else await handleWrong(idx);
    }
    await happyEnd();
    trayEl.hidden = true;
    return '친구들이 힘을 모아 호랑이를 물리쳤어요!';
  }

  Tale.mount({ title: '팥죽할멈과 호랑이', subtitle: '친구들을 순서대로 불러서 호랑이를 물리쳐요!', note: false, endTitle: '만세!', run: T => run(Tale.api) });
})();
