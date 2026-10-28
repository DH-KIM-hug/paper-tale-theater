/* 구름 공장 — 가족 동화. 다현이·이현이(쌍둥이)·은우와 강아지 꿀떡이가 냄새를 따라 구름 공장에 가서,
   구름이 만들어지는 걸 보고, 비가 싫다고 숨은 아기 먹구름을 달래 하늘로 보낸다. 비 → 새싹 → 무지개.
   원고: tale-y content/stories/cloud-factory/manuscripts/c3-sound.json (막내가 소리 대사 벌), 기획 tales/kkultteok/PLAN.md.
   대사 글자는 원고 그대로(녹음과 글자가 같아야 재생), ▶ 조작 안내만 게임이 덧붙인다. 조작은 모두 톡 · 톡톡톡 · 골라요.
   그림: assets/v3w/cf4_*.webp (Codex 이미지 생성, tools/app/gen/jobs_kkultteok.json). 시험용: ?scene=N 으로 N장면부터 */
(() => {
  const AS = '../../assets/v3w/';
  const G = 520; // 발 기준선
  const src = f => AS + 'cf4_' + f + '.webp';
  const bgSrc = k => AS + 'cf4_bg_' + k + '.webp';
  const BGS = ['01_road', '02_hill', '03_chimney', '04_door', '05_belt_v2', '06_press_v2', '07_button_v2', '08_tank_room', '09_bell_room', '10_corner_close', '12_storm', '13_rain', '14_soil_v2', '15_rainbow_v2', '16_road_bloom']; // v2·bloom: 2026-10-22 다층 보강(VISUAL_PLAN.md)
  /* 꽃·딸기 (2026-10-22 VISUAL_PLAN §3): 같은 종류는 어디서나 같은 높이(§4-1). 뒷줄은 한 줄 통째로 0.85배 */
  const FLW = ['tulip_red', 'tulip_yellow', 'tulip_pink', 'sunflower', 'daisy_white', 'cosmos_pink', 'poppy_orange', 'bell_blue', 'wild_purple', 'cluster_a', 'cluster_b'];
  const PH = { tulip_red: 120, tulip_yellow: 120, tulip_pink: 120, sunflower: 150, daisy_white: 110, cosmos_pink: 110, poppy_orange: 110, bell_blue: 100, wild_purple: 100, cluster_a: 95, cluster_b: 95,
    bud_mix: 110, berry_bush: 120, berry_bush_b: 120, berry_single: 46, berry_flower: 60 };
  const SPR = ['nuna_lookup', 'nuna_walk', 'nuna_run', 'nuna_wave', 'nuna_blow', 'nuna_hug', 'nuna_jump', 'nuna_back', 'nuna_whisper',
    'oppa_lookup', 'oppa_walk', 'oppa_run', 'oppa_reach', 'oppa_press', 'oppa_hug', 'oppa_jump', 'oppa_back',
    'agi_lookup', 'agi_walk', 'agi_run', 'agi_press', 'agi_pet', 'agi_wave', 'agi_hug', 'agi_jump', 'agi_back', 'agi_lookback',
    'nuna_point', 'nuna_tiptoe', 'nuna_crouch', 'nuna_clap', 'nuna_eek', 'nuna_splash', 'oppa_point', 'oppa_tiptoe', 'oppa_crouch', 'oppa_clap', 'oppa_eek', 'oppa_splash', 'agi_point', 'agi_tiptoe', 'agi_crouch', 'agi_clap', 'agi_eek', 'agi_splash', 'dog_lookup', 'dog_sniff', 'dog_run', 'dog_wag', 'dog_sneeze', 'dog_lick', 'dog_bark', 'dog_nose',
    'cloud_white', 'cloud_rabbit', 'cloud_whale', 'cloud_dog', 'cloud_fish', 'cloud_car',
    'dark_drink', 'dark_drink2', 'dark_drink3', 'dark_march', 'dark_march2', 'dark_march3', 'dark_bump', 'cloud_one', 'cloud_two', 'cloud_long', 'cloud_small', 'baby_huddle', 'baby_wide', 'baby_up', 'baby_sorry', 'baby_white',
    'prop_drop', 'prop_sprout', 'prop_bud', 'prop_flower', 'prop_berry_green', 'prop_berry_red', 'prop_chimney_far',
    ...FLW.map(k => 'prop_flower_' + k), 'prop_flower_bud_mix', 'prop_berry_bush', 'prop_berry_bush_b', 'prop_berry_single', 'prop_berry_flower'];
  const ASP = {}; // 그림 가로/세로 (불러온 뒤 채운다)

  /* 배우: poses = { 이름: [그림, 높이, 그림이 보는 쪽] } */
  /* shadow=false: 구름·먹구름·소품은 그림자 필터를 빼다 (Safari 가 움직이는 필터 그림을 잘라 먹는다) */
  function mk(T, poses, shadow = false) { /* shadow: 발밑 납작한 그림자 (SVG 필터는 Safari 에서 움직이는 그림을 지워 쓰지 않는다) */
    const looks = {};
    const a = T.actor(T.world, -400, G, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * (ASP[f] || .7), wrap = T.el('g', {}, g);
        if (shadow) T.el('ellipse', { cx: 0, cy: -3, rx: w * .32, ry: Math.max(4, w * .05), fill: 'rgba(46,36,28,.22)' }, wrap);
        T.el('image', { href: src(f), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        wrap.style.display = 'none'; looks[k] = { wrap, h, nat: nat || 'right' };
      });
    });
    a.want = 'right'; a.looks = looks;
    a.turn = d => { a.want = d; a.face(looks[a.cur].nat === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const one = (T, f, h) => mk(T, { a: [f, h] }, false);
  function put(T, a, x, y = G, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 400) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  /* 모양 바꾸기: 옛 그림이 흐려지며 새 그림이 번져 나타난다 */
  function morph(a, key, ms = 800) {
    const oldW = a.looks[a.cur].wrap, nw = a.looks[key].wrap;
    if (oldW === nw) return;
    a.look(key); oldW.style.display = '';
    nw.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms, easing: 'ease-in-out' });
    const an = oldW.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' });
    an.onfinish = () => { oldW.style.display = 'none'; an.cancel(); };
  }
  /* '퐁' 소리는 꼭 필요한 두 곳(첫 구름이 생길 때, 아기 구름이 하얗게 웃을 때)만 낸다 — keep=true.
     나머지는 조용히 둔다 (2026-10-21: 구름을 만드는 아이가 주인공이 되어 퐁 소리를 줄임) */
  const popSfx = (T, keep) => { if (keep) AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 }); };

  async function run(T) {
    /* 시작 음악 (2026-10-28): 첫 장면 시작에 12초 깔고, 첫 장면 전환에서 끈다. 읽어 주기는 음량 .25 */
    const intro = (() => {
      let h = null, on = true;
      const stop = () => { on = false; try { h && h.stop(.8); h = null; } catch (e) { /* 무시 */ } };
      const go = (delay = 0) => {
        const f = () => { try { if (!on) return; const o = { vol: T.reading() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }; h = AudioFX.ambient('intro_cozy', o); if (!h) setTimeout(() => { try { if (on) h = AudioFX.ambient('intro_cozy', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
        if (delay) setTimeout(f, delay); else f();
      };
      try { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stop(); return sc0.apply(this, a); }; } catch (e) { /* 무시 */ }
      return { go, stop };
    })();
    const { sleep, say, camSnap } = T;
    /* 효과음 (2026-10-28): 시간·장소 단서만 실제 소리, 나머지는 만화·악기 소리. 읽어 주기에서는 부드러운 배경 소리만(vol ≤ .2, dur ≤ 4) */
    const sfx = (n, v) => { try { return AudioFX.sfx(n, v); } catch (e) { return false; } };
    const amb = (n, o) => { try { return AudioFX.ambient(n, o); } catch (e) { return null; } };
    const stopAmb = f => { try { AudioFX.stopAmbient(f); } catch (e) { /* 무시 */ } };
    try { AudioFX.preloadSfx(['intro_cozy', 'birds_chirp_1', 'birds_chirp_2', 'steam_hiss', 'water_drip', 'rain_1', 'pop_appear', 'chime_up', 'zip_away', 'question', 'thunder', 'whistle_up', 'ding_glock', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'marimba_6', 'marimba_7', 'party_horn', 'creak', 'ding', 'bonk', 'bell', 'gulp', 'splash', 'splash_big', 'blow', 'whoosh', 'sparkle', 'cork']); } catch (e) { /* 무시 */ }
    { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stopAmb(.5); return sc0.apply(this, a); }; } // 장면이 바뀌면 배경 소리를 끈다
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const tr = T.tr, el = T.el;
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 약 430만 보인다 */
    const X = (l, p) => P ? p : l;
    let sceneTok = 0;
    const scene = (key, cx = 500) => {
      sceneTok++; T.clear(); stopRain();
      el('image', { href: bgSrc(key), x: -40, y: -24, width: 1080, height: 608, preserveAspectRatio: 'xMidYMid slice' }, T.bg);
      camSnap(P ? cx : 500, 280, 1);
    };
    const hitC = (cx, cy, r) => el('circle', { cx, cy, r, fill: 'transparent' }, T.world);
    const hitR = (x, y, w, h) => el('rect', { x, y, width: w, height: h, rx: 18, fill: 'transparent' }, T.world);
    /* 종이 조각이 튀는 모양 (퐁!) */
    const puff = (x, y, color = '#fff') => {
      for (let k = 0; k < 7; k++) {
        const a = k / 7 * Math.PI * 2, c = el('circle', { cx: x, cy: y, r: 6 + (k % 3) * 2, fill: color, stroke: '#D8CFC2', 'stroke-width': 1.5 }, T.fx);
        c.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * 46}px,${Math.sin(a) * 40 - 8}px) scale(.3)`, opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => c.remove();
      }
    };
    const ring = (x, y) => {
      const c = el('ellipse', { cx: x, cy: y, rx: 20, ry: 6, fill: 'none', stroke: '#7FA9C9', 'stroke-width': 3 }, T.world);
      c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';
      c.animate([{ transform: 'scale(.5)', opacity: .9 }, { transform: 'scale(2.2)', opacity: 0 }], { duration: 600, easing: 'ease-out' }).onfinish = () => c.remove();
    };
    /* 굴뚝 연기: 바람을 따라 한쪽으로 휘어 오르는 길(2차 곡선). 김 덩이는 이 길을 따라 커지며 옅게 흐른다 */
    const qpt = (p0, c, p1, t) => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]];
    /* 연기 한 덩이: 겹친 동그라미 셋(옅은 회백색 종이 + 아래쪽 그늘). 구름 그림이 아니라 연기 모양 */
    const smokeBlob = () => {
      const g = el('g', {}, T.fx);
      [[-9, 3, 11], [6, -4, 13], [14, 6, 9]].forEach(([cx, cy, r]) => el('circle', { cx: cx + 1.5, cy: cy + 3, r, fill: '#CFCBC4', opacity: .55 }, g));
      [[-9, 3, 11], [6, -4, 13], [14, 6, 9]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#F3F2EE' }, g));
      return g;
    };
    /* 연기 한 덩이가 굴뚝(p0)에서 c 를 거쳐 p1 쪽으로 upto(0~1) 만큼 흘러가며 커진다 */
    const puffAlong = (p0, c, p1, { upto = 1, s0 = .4, s1 = 1.6, ms = 3600, op = .8, fade = true } = {}) => {
      const im = smokeBlob(), N = 12, kf = [];
      for (let i = 0; i <= N; i++) {
        const t = upto * i / N, [x, y] = qpt(p0, c, p1, t), sc = s0 + (s1 - s0) * (i / N);
        kf.push({ transform: `translate(${x + Math.sin(i * 1.3) * 5}px,${y}px) scale(${sc})`, opacity: i === 0 ? 0 : (fade && i === N ? 0 : op), offset: i / N });
      }
      const an = im.animate(kf, { duration: ms, easing: 'ease-out', fill: 'forwards' });
      an.finished.then(() => { if (fade) im.remove(); }, () => {});
      return { im, an };
    };
    /* 굴뚝에서 연기가 뭉게뭉게 줄지어 올라가 끝자리(p1)에 모이고, 모인 연기가 퐁! 구름(c 배우)이 된다 */
    const smokeToCloud = async (cloud, p0, ctl, p1, ms = 3200, sc = 1, loud = false) => {
      const N = 18, blobs = []; // 풍성하게: 연기 덩이 열여덟이 줄지어 뭉게뭉게
      for (let k = 0; k < N; k++) {
        // 뒤로 갈수록 끝자리 둘레에 조금씩 흩어져 쌓이게 (한 점으로 몰리지 않게)
        const ang = k * 2.4, rr = 20 + (k % 4) * 14, end = [p1[0] + Math.cos(ang) * rr * 1.6 * sc, p1[1] + Math.sin(ang) * rr * .6 * sc];
        blobs.push(puffAlong(p0, ctl, end, { s0: .5, s1: (2.6 + (k % 4) * .45) * sc, ms: ms * .75, op: .9, fade: false }));
        await sleep(ms * .3 / N);
      }
      await Promise.all(blobs.map(b => b.an.finished.catch(() => {})));
      put(T, cloud, p1[0], p1[1] + (cloud.h || 140) * sc / 2, { s: sc }); // 구름 배우는 발끝 기준이라 가운데에서 높이 절반만큼 아래
      cloud.pos.animate([{ opacity: 0, scale: .85 }, { opacity: 1, scale: 1.08, offset: .6 }, { opacity: 1, scale: 1 }], { duration: 600, easing: 'ease-out' });
      blobs.forEach(b => b.im.animate([{ opacity: .85 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }).onfinish = () => b.im.remove());
      popSfx(T, loud); puff(p1[0], p1[1], '#FBFAF6');
    };
    /* 하늘에 천천히 흘러가는 종이 구름. list: [y, 너비, 한 바퀴 초, 시작 위치(0~1), 투명도] */
    const SKYC = ['cloud_long', 'cloud_two', 'cloud_small', 'cloud_white']; let skyN = 0; // 모두 한 겹, 뭉게 모양만 서로 다르게
    const skyDrift = list => {
      const g = el('g', {}, T.bg);
      list.forEach(([y, w, dur, f, op = .95]) => {
        const kind = SKYC[(skyN++) % SKYC.length], h = w / (ASP[kind] || 1.6);
        const im = el('image', { href: src(kind), x: -w / 2, y: -h / 2, width: w, height: h, preserveAspectRatio: 'none' }, g);
        im.style.opacity = op;
        im.animate([{ transform: `translate(${-60 - w / 2}px,${y}px)` }, { transform: `translate(${1060 + w / 2}px,${y}px)` }], { duration: dur * 1000, iterations: Infinity, delay: -dur * 1000 * f });
      });
    };
    /* 굴뚝에서 쉬지 않고 피어오르는 작은 김: 길의 앞부분까지만 흐르다 옅어진다 */
    const chimneyLoop = (p0, ctl, p1, o = {}) => { const my = sceneTok; (async () => { await sleep(500); while (my === sceneTok) { puffAlong(p0, ctl, p1, { upto: .55, s0: .5, s1: 2, ms: 4600, op: .8, ...o }); await sleep(650); } })(); };
    /* 비 */
    let rainG = null;
    function startRain(x0 = 0, x1 = 1000, y0 = -20, n = 22) {
      stopRain(); rainG = el('g', {}, T.fx);
      for (let k = 0; k < n; k++) {
        const x = x0 + (x1 - x0) * ((k * 0.618) % 1), d = el('path', { d: 'M0 -10 C6 0 7 6 0 8 C-7 6 -6 0 0 -10Z', fill: '#6FB1E0', stroke: '#fff', 'stroke-width': 1.5 }, rainG);
        d.animate([{ transform: `translate(${x}px,${y0}px)`, opacity: 0 }, { transform: `translate(${x}px,${y0 + 30}px)`, opacity: 1, offset: .15 }, { transform: `translate(${x - 12}px,${G + 10}px)`, opacity: .9, offset: .9 }, { transform: `translate(${x - 14}px,${G + 20}px)`, opacity: 0 }],
          { duration: 1500, delay: (k * 97) % 1500, iterations: Infinity });
      }
    }
    function stopRain() { if (rainG) { rainG.remove(); rainG = null; } }
    const BOLT = 'M18 0 L-14 44 L2 44 L-12 92 L28 36 L10 36 Z';
    /* 마음 카드 (골라요) */
    const feelCard = (cx, cy, kind, label) => {
      const g = el('g', { transform: `translate(${cx},${cy}) scale(1)` }, T.fx);   // 세로에서도 카드 짧은 변이 화면 80px 이상 (2026-10-22: .85→1)
      const inner = el('g', {}, g); const plain = (par, shapes) => shapes.forEach(([t, a]) => el(t, a, par)); plain(inner, [ // 필터 없이 (Safari)
        ['rect', { x: -70, y: -50, width: 140, height: 100, rx: 20, fill: '#F6ECD8', stroke: '#6B4A32', 'stroke-width': 3 }],
        ['circle', { cx: 0, cy: -8, r: 24, fill: kind === 'sad' ? '#9DB4C8' : '#F6C945' }],
        ['circle', { cx: -8, cy: -13, r: 3.4, fill: '#2E241C' }], ['circle', { cx: 8, cy: -13, r: 3.4, fill: '#2E241C' }],
        ['path', { d: kind === 'sad' ? 'M-9 4 Q0 -2 9 4' : 'M-10 0 Q0 12 10 0', fill: 'none', stroke: '#2E241C', 'stroke-width': 3, 'stroke-linecap': 'round' }],
        ...(kind === 'sad' ? [['path', { d: 'M-12 -6 q-3 8 0 10 q3 -2 0 -10z', fill: '#6FB1E0' }]] : [])]);
      const t = el('text', { x: 0, y: 44, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#2E241C', 'font-family': "'Pretendard Variable', Pretendard, sans-serif" }, inner); t.textContent = tr(label);
      g.style.pointerEvents = 'all';
      return g;
    };

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), T.preload(src('cut_hug')), T.preload(src('cut_rainbow'))];
    await Promise.race([Promise.all([...loads, ...SPR.map(f => new Promise(res => { const i = new Image(); i.onload = () => { ASP[f] = i.naturalWidth / i.naturalHeight; res(); }; i.onerror = res; i.src = src(f); }))]), new Promise(r => setTimeout(r, 6000))]);

    /* 배역: 쌍둥이는 같은 키, 은우는 3분의 2쯤 */
    const TW = 250, AG = 178, DG = 118;
    /* 머리 크기 맞춤 (2026-10-21, §4-1): 머리카락 덩어리 높이를 재서 자세별 높이를 조정 (tools/app/head_width.py 계열 측정).
       웅크린 자세는 머리가 크게 그려져 있어 줄이고, 까치발·달리기는 조금만 줄인다 */
    const HT = { nuna: { crouch: Math.round(TW * .87), tiptoe: Math.round(TW * .92) }, oppa: { crouch: Math.round(TW * .80) }, agi: { crouch: Math.round(AG * .87), run: Math.round(AG * .93) } };
    const nuna = mk(T, Object.fromEntries(['lookup', 'walk', 'run', 'wave', 'blow', 'hug', 'jump', 'back', 'whisper', 'point', 'tiptoe', 'crouch', 'clap', 'eek', 'splash'].map(k => [k, ['nuna_' + k, k === 'jump' ? TW + 14 : (HT.nuna[k] || TW)]])), true);
    const oppa = mk(T, Object.fromEntries(['lookup', 'walk', 'run', 'reach', 'press', 'hug', 'jump', 'back', 'point', 'tiptoe', 'crouch', 'clap', 'eek', 'splash'].map(k => [k, ['oppa_' + k, k === 'jump' ? TW + 14 : (HT.oppa[k] || TW)]])), true);
    const agi = mk(T, Object.fromEntries(['lookup', 'walk', 'run', 'press', 'pet', 'wave', 'hug', 'jump', 'back', 'lookback', 'point', 'tiptoe', 'crouch', 'clap', 'eek', 'splash'].map(k => [k, ['agi_' + k, k === 'jump' ? AG + 12 : (HT.agi[k] || AG), k === 'lookback' ? 'left' : 'right']])), true);
    /* 꿀떡이: 자세마다 그림 비율이 달라 높이를 똑같이 두면 크기가 널뛴다. 몸 길이(가로)가 일정하도록 자세별 높이를 맞춘다 */
    const DOGH = { sniff: 116, nose: 110, run: 114, sneeze: 128, bark: 132, lookup: 138, wag: 138, lick: 148 };
    const dog = mk(T, Object.fromEntries(Object.entries(DOGH).map(([k, h]) => [k, ['dog_' + k, h]])), true);
    const baby = mk(T, { huddle: ['baby_huddle', 130], wide: ['baby_wide', 140], up: ['baby_up', 150], sorry: ['baby_sorry', 140], white: ['baby_white', 140] }, false);
    const kids = [nuna, oppa, agi];
    const allHide = () => [nuna, oppa, agi, dog, baby].forEach(hide);

    /* ================= 읽어 주기 (docs/READ_MODE.md): read_script_el.json 의 동사 → 아래 놀이판 연출을 누르기 없이 감싼 얇은 함수 =================
       장면 차리기(set)는 놀이판 그 장면의 자리·자세·소품을 그대로 놓는다. 같은 배경이 두 번 나오면(길·단추 방) 나온 차례로 구분.
       대본 y=470 은 바닥선이 아니라서 사람·강아지는 바닥(G)에 둔다. */
    const RK = { nuna, oppa, agi };
    const inst = () => T.readInstant();
    const RCX = { '01_road': 500, '02_hill': 420, '03_chimney': 520, '04_door': 700, '05_belt_v2': 400, '06_press_v2': 470, '07_button_v2': 300, '08_tank_room': 560, '09_bell_room': 610, '10_corner_close': 480, '12_storm': 520, '13_rain': 500, '14_soil_v2': 500, '15_rainbow_v2': 500 };
    const rSeen = {}; let rTag = '', RS = {};
    const live = () => { const t = sceneTok; return () => t === sceneTok; };   // 장면이 바뀌면 늦게 도는 연출은 멈춘다
    const onS = a => a.pos.isConnected && a.pos.style.display !== 'none';
    const C0R = [657, 124];
    const SKYR = [[X(570, 610), 92, 'rabbit', '토끼!'], [X(355, 480), 140, 'fish', '물고기!'], [X(140, 350), 96, 'car', '자동차!']];
    const CSR = P ? .7 : 1;
    const ctlR = ([, ty]) => [C0R[0] + 10, Math.min(ty, C0R[1]) - 30];
    const FARR = [X(120, 300), 60];
    const RLAY = {
      '01_road'(n) {
        if (n === 1) {
          skyDrift([[70, 150, 90, .15], [130, 110, 70, .55], [55, 90, 110, .8, .85]]);
          put(T, nuna, X(300, 330), G, { look: 'walk', to: 'right' }); put(T, oppa, X(400, 420), G, { look: 'walk', to: 'right' });
          put(T, agi, X(490, 500), G, { look: 'walk', to: 'right' }); put(T, dog, X(640, 600), G, { look: 'sniff', to: 'right' });
          return;
        }
        skyDrift([[60, 170, 120, .1], [120, 120, 95, .45], [45, 100, 140, .7, .9], [150, 90, 110, .9, .85]]);
        const ch = one(T, 'prop_chimney_far', 130); put(T, ch, X(880, 640), 330); RS.ch = ch;
        RS.c2 = [0, 1].map(() => { const c = one(T, 'cloud_white', 110); hide(c); return c; });
        put(T, dog, X(150, 360), G, { look: 'run', to: 'left' }); put(T, nuna, X(300, 420), G, { look: 'walk', to: 'left' });
        put(T, oppa, X(400, 480), G, { look: 'walk', to: 'left' }); put(T, agi, X(540, 560), G, { look: 'wave', to: 'right' });
        const C0 = [ch.x + 6, ch.y - 124]; RS.C0 = C0;
        chimneyLoop(C0, [C0[0], C0[1] - 40], [C0[0] - 160, C0[1] - 70], { s0: .25, s1: .9 });
      },
      '02_hill'() {
        skyDrift([[60, 120, 95, .35], [120, 90, 75, .75, .9]]);
        put(T, nuna, X(180, 330), G, { look: 'run', to: 'right' }); put(T, oppa, X(280, 410), G, { look: 'run', to: 'right' });
        put(T, agi, X(370, 480), G, { look: 'run', to: 'right' }); put(T, dog, X(500, 560), G, { look: 'nose', to: 'right' });
        const trail = el('path', { d: 'M520 410 C600 360 640 300 720 260 S860 170 920 150', fill: 'none', stroke: '#E87FA8', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-dasharray': '2 16', opacity: .85 }, T.bg);
        trail.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -72 }], { duration: 1200, iterations: Infinity });
      },
      '03_chimney'() {
        RS.cl = SKYR.map(([, , shape]) => mk(T, { c: ['cloud_white', 140], s: ['cloud_' + shape, 150] }, false));
        put(T, nuna, X(250, 390), G, { look: 'lookup', to: 'right' }); put(T, oppa, X(345, 455), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(430, 525), G, { look: 'point', to: 'right' }); put(T, dog, X(160, 600), G, { look: 'lookup', to: 'right' });
        RS.cl.forEach(hide);
      },
      '04_door'() {
        put(T, nuna, X(330, 520), G, { look: 'lookup', to: 'right' }); put(T, oppa, X(430, 590), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(520, 650), G, { look: 'lookup', to: 'right' }); put(T, dog, X(700, 760), G, { look: 'nose', to: 'right' });
      },
      '05_belt_v2'() {
        put(T, oppa, X(240, 300), G, { look: 'reach', to: 'right' }); put(T, nuna, X(400, 420), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(520, 500), G, { look: 'clap', to: 'right' }); put(T, dog, X(130, 230), G, { look: 'sniff', to: 'right' });
        RS.drops = [];
      },
      '06_press_v2'() {
        put(T, oppa, X(205, 330), G, { look: 'press', to: 'right' }); put(T, nuna, X(110, 270), G, { look: 'clap', to: 'right' });
        put(T, agi, X(820, 650), G, { look: 'point', to: 'left' }); put(T, dog, X(730, 600), G, { look: 'lookup', to: 'left' });
        RS.shapes = ['rabbit', 'whale', 'dog'].map(sh => { const c = one(T, 'cloud_' + sh, 110); hide(c); return c; });
      },
      '07_button_v2'(n) {
        if (n === 1) {
          put(T, agi, X(250, 260), G, { look: 'lookup', to: 'left' }); put(T, nuna, X(370, 360), G, { look: 'lookup', to: 'left' });
          put(T, oppa, X(460, 430), G, { look: 'lookup', to: 'left' }); put(T, dog, X(600, 500), G, { look: 'wag', to: 'right' });
          RS.dc = one(T, 'cloud_dog', 120); put(T, RS.dc, X(660, 560), 360);
          return;
        }
        put(T, baby, 520, 330, { look: 'wide', to: 'right', s: 1 });
        put(T, nuna, X(250, 390), G, { look: 'wave', to: 'right' }); put(T, agi, X(340, 445), G, { look: 'wave', to: 'right' });
        put(T, oppa, X(430, 505), G, { look: 'lookup', to: 'right' }); put(T, dog, X(600, 620), G, { look: 'bark', to: 'right' });
      },
      '08_tank_room'() {
        put(T, nuna, X(110, 400), G, { look: 'tiptoe', to: 'right' }); put(T, oppa, X(200, 455), G, { look: 'tiptoe', to: 'right' });
        put(T, agi, X(280, 505), G, { look: 'lookup', to: 'right' }); put(T, dog, X(380, 380), G, { look: 'sniff', to: 'right' });
        RS.darks = [650, 760, 870].map((x, i) => { const d = one(T, ['dark_drink', 'dark_drink2', 'dark_drink3'][i], [150, 130, 115][i]); put(T, d, x, 222, { s: .85 }); return d; });
      },
      '09_bell_room'(n) {
        put(T, nuna, X(430, 500), G, { look: 'lookup', to: 'right' }); put(T, oppa, X(520, 560), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(600, 620), G, { look: 'lookup', to: 'right' }); put(T, dog, X(330, 440), G, { look: 'lookup', to: 'left' });
        if (n === 1) RS.march = [0, 1, 2].map(i => { const d = one(T, ['dark_march', 'dark_march2', 'dark_march3'][i], [140, 120, 105][i]); put(T, d, 640 + i * 110, 300, { s: .8 }); return d; });
        else put(T, baby, X(110, 300), G - 10, { look: 'huddle', to: 'right' });
      },
      '10_corner_close'() {
        put(T, baby, 470, 330, { look: 'huddle', to: 'right', s: 1.2 }); put(T, agi, X(330, 360), G, { look: 'pet', to: 'right' });
        put(T, nuna, X(680, 600), G, { look: 'lookup', to: 'left' }); put(T, oppa, X(800, 640), G, { look: 'lookup', to: 'left' });
      },
      '12_storm'() {
        const big = one(T, 'dark_bump', 150); put(T, big, 760, 210);
        put(T, baby, 420, 170, { look: 'up', to: 'right' });
        put(T, nuna, X(380, 430), G, { look: 'lookup', to: 'right' }); put(T, oppa, X(470, 490), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(550, 545), G, { look: 'lookup', to: 'right' }); put(T, dog, X(680, 600), G, { look: 'wag', to: 'left' });
        startRain(0, 1000, -20, 14);
      },
      '13_rain'() {
        put(T, nuna, X(250, 380), G, { look: 'lookup', to: 'right' }); put(T, oppa, X(420, 450), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(580, 520), G, { look: 'lookup', to: 'right' }); put(T, dog, X(740, 610), G, { look: 'lookup', to: 'left' });
        RS.rd = 0;
      },
      '14_soil_v2'() {
        put(T, baby, X(780, 620), 120, { look: 'sorry', to: 'left' });
        put(T, dog, X(860, 640), G + 20, { look: 'sniff', to: 'left' });
        put(T, nuna, X(110, 300), G + 20, { look: 'crouch', to: 'right' }); put(T, agi, X(170, 330), G + 30, { look: 'crouch', to: 'right' }); put(T, oppa, X(920, 700), G + 20, { look: 'crouch', to: 'left' });
        startRain(0, 1000, -20, 6);
      },
      '15_rainbow_v2'() {
        skyDrift([[90, 110, 120, .2, .9], [60, 80, 150, .75, .85]]);
        put(T, baby, X(820, 640), 150, { look: 'sorry', to: 'left' });
        put(T, nuna, X(330, 380), G, { look: 'point', to: 'right' }); put(T, oppa, X(420, 440), G, { look: 'clap', to: 'right' });
        put(T, agi, X(500, 500), G, { look: 'jump', to: 'right' }); put(T, dog, X(620, 580), G, { look: 'sniff', to: 'right' });
      },
    };
    const RA = {
      set(key) {
        const n = rSeen[key] = (rSeen[key] || 0) + 1; rTag = key + n; RS = {};
        stopAmb(.6);
        { const ra = { '01_road': ['birds_chirp_1', .15], '03_chimney': ['steam_hiss', .12], '05_belt_v2': ['water_drip', .12], '13_rain': ['rain_1', .18], '15_rainbow_v2': ['birds_chirp_2', .15] }[key]; if (ra) { const kk = rTag; if (!amb(ra[0], { vol: ra[1], dur: 4, fadeIn: 1 })) setTimeout(() => { if (rTag === kk) amb(ra[0], { vol: ra[1], dur: 3, fadeIn: 1 }); }, 1500); } } // 장소 소리는 작게, 잠깐만
        allHide();
        let cx = RCX[key] || 500;
        if (key === '09_bell_room' && n === 2 && P) cx = 500;
        if (key === '07_button_v2' && n === 2) cx = 560;
        scene(key === '01_road' && n === 2 ? '16_road_bloom' : key, cx);
        (RLAY[key] || (() => {}))(n);
      },
      cam(a) { if (a === 'wide') { if (inst()) camSnap(P ? (RCX[rTag.replace(/\d$/, '')] || 500) : 500, 280, 1); } else { const [x, y, z] = String(a).split(',').map(Number); inst() ? camSnap(x, y, z || 1) : T.camTo(x, y, z || 1, 800); } },
      kid(id, verb, a1, a2) {
        const k = RK[id]; if (!k) return console.warn('[read] kid 모름', id);
        if (verb === 'look') return k.look(k.looks[a1] ? a1 : 'lookup', a2);
        if (verb === 'hop') return k.hop(id === 'agi' ? 24 : 18, 340);
        console.warn('[read] kid 동사 모름', verb);
      },
      kids(verb, a1, a2) {
        if (verb === 'look') { kids.forEach(k => k.look(k.looks[a1] ? a1 : (a1 === 'wave' ? 'clap' : 'lookup'), a2)); return; }   // 이현이는 손 흔들기 그림이 없어 손뼉으로
        if (verb !== 'walk') return console.warn('[read] kids 동사 모름', verb);
        const [x, ms] = String(a1).split(',').map(Number);
        if (rTag === '02_hill1') { return Promise.all(kids.map(k => k.move(k.x + 200, G - 40, ms || 2000, 'linear'))); }
        if (rTag === '04_door1') {   // 열린 문 틈으로 걸어 들어가 어둠 속으로 사라진다 (개는 먼저)
          const DX = 723, DOORY = 428, my = live();
          const enter = async (k, xx, wait) => {
            await sleep(wait); if (!my()) return; await k.move(xx, G - 6, 1500, 'ease-in-out'); if (!my()) return;
            const x0 = k.x, y0 = k.y, f = k.flip, s0 = k.scale;
            await k.pos.animate([{ transform: `translate(${x0}px,${y0}px) scale(${f * s0},${s0})`, opacity: 1 }, { transform: `translate(${DX}px,${DOORY + 20}px) scale(${f * s0 * .6},${s0 * .6})`, opacity: 1, offset: .6 },
              { transform: `translate(${DX}px,${DOORY}px) scale(${f * s0 * .5},${s0 * .5})`, opacity: 0 }], { duration: 1300, easing: 'ease-in', fill: 'forwards' }).finished;
            hide(k);
          };
          enter(dog, DX - 10, 0); kids.forEach((k, i) => enter(k, DX - 25 + i * 22, 900 + i * 450));
          return;
        }
        if (rTag === '07_button_v21' || rTag === '07_button_v22') {   // 단추 방 두 번째: 삼남매가 밖으로 달려 나간다
          const my = live(); kids.forEach((k, i) => k.move(1100 + i * 60, G, 1500 + i * 150, 'ease-in').then(() => { if (my()) hide(k); })); return;
        }
        if (rTag === '01_road2') {   // 왔던 길로 집에: 꿀떡이는 앞서 달리고 다현·이현이 뒤따른다 (은우는 손 흔들며 서 있다)
          dog.move(X(-60, 260), G, 3800, 'linear'); nuna.move(X(160, 340), G, ms || 2500, 'linear'); oppa.move(X(260, 400), G, ms || 2500, 'linear'); return;
        }
        kids.forEach(k => k.move(x, G, ms || 1500));
      },
      dog(verb, a1, a2) {
        if (!onS(dog) && verb === 'look') { put(T, dog, X(580, 520), G, { look: a1, to: a2 || 'left' }); if (!inst()) fadeIn(dog, 300); return; }
        if (verb === 'look') return dog.look(a1, a2);
        if (verb === 'hop') return dog.hop(10, 260);
        if (verb === 'sneeze') { const hx = RS.HOLE3 || 700; for (let k = 0; k < 5; k++) puff(hx + 20 - k * 10, 303 - k * 8); T.pop(dog.x + 20, dog.y - 280, tr('에취!')); return; }
        if (verb === 'walk') {
          const [x, , ms] = String(a1).split(',').map(Number);
          if (rTag === '02_hill1') { const my = live(); dog.move(X(1180, 780), 330, ms + 400, 'ease-in').then(() => { if (my()) hide(dog); }); return; }
          if (rTag === '06_press_v21') { RS.HOLE3 = 628; return dog.move(628 + 85, G, ms || 900); }
          if (rTag === '09_bell_room2') return dog.move(baby.x + 120, G, ms || 1600, 'linear');
          return dog.move(x, G, ms || 1000);
        }
        console.warn('[read] dog 동사 모름', verb);
      },
      sky() { /* 하늘 구름은 장면을 차릴 때 이미 떠다닌다 */ },
      chimney(verb) {
        if (verb === 'steam') {
          if (RS.steam) return; RS.steam = 1;
          chimneyLoop(C0R, ctlR(FARR), FARR, { s1: 2.4 }); return;
        }
        if (verb === 'cloud') {   // 김 덩이가 줄지어 올라 하늘 세 곳에서 구름이 된다 (한 번 눌러 둔 것처럼 저절로)
          if (!RS.cl) return;
          const my = live();
          (async () => { for (let i = 1; i <= 3 && my(); i++) { T.pop(C0R[0] + 70, C0R[1] + 60, tr(['폴폴', '뭉게', '퐁!'][i - 1])); const [tx, ty] = SKYR[i - 1]; smokeToCloud(RS.cl[i - 1], C0R, ctlR([tx, ty]), [tx, ty], 3200 + i * 300, CSR, i === 1); await sleep(600); } })();
          return;
        }
      },
      clouds(verb) {
        if (verb !== 'shapes' || !RS.cl) return;
        const my = live();
        (async () => {
          for (let i = 0; i < 3 && my(); i++) {
            if (i > 0) await sleep(400);
            const c = RS.cl[i]; morph(c, 's'); c.hop(14, 360); popSfx(T); puff(c.x, c.y - 70 * CSR); T.pop(c.x, c.y + 30, tr(SKYR[i][3]));
            kids[i].look('jump'); kids[i].hop(16, 320); await sleep(500); kids[i].look('lookup');
          }
        })();
      },
      door() { AudioFX.sfx('creak') || popSfx(T); },
      belt(verb) {
        if (verb !== 'drops') return;
        const my = live(), FX = 198, FY = 222, BY = 300, DX0 = X(FX, 250), DH = 100;
        (async () => {
          for (let i = 1; i <= 3 && my(); i++) {
            const d = one(T, 'prop_drop', DH); put(T, d, DX0, FY + 62); fadeIn(d, 300); RS.drops.push(d);
            await sleep(450); if (!my()) return;
            d.pos.animate([{ transform: `translate(${DX0}px,${d.y}px) scale(${d.flip * d.scale},${d.scale})` }, { transform: `translate(${DX0}px,${BY}px) scale(${d.flip * d.scale},${d.scale})` }], { duration: 500, easing: 'ease-in', fill: 'forwards' });
            AudioFX.sfx('ding') || popSfx(T); T.pop(DX0 + 70, FY - 100, tr('똑!'), '#4A90D9');
            await sleep(500);
          }
        })();
      },
      horn(verb) {
        if (verb !== 'blow') return;
        (RS.drops || []).forEach(d => d.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }));
        const cloud = one(T, 'cloud_white', 40); put(T, cloud, 680, 310); hide(cloud); RS.cloud = cloud;
        AudioFX.sfx('blow') || T.tone([300, 200], .3, { vol: .08 });
      },
      cloud(verb, n) {
        if (verb !== 'grow') return;
        const cloud = RS.cloud, sizes = [70, 110, 160], BY = 300; if (!cloud) return;
        const step = i => {
          if (i === 1) { put(T, cloud, 680, BY + 10); fadeIn(cloud, 300); }
          cloud.setScale(sizes[i - 1] / 40); cloud.place(680, BY + 10); cloud.hop(10, 300);
          AudioFX.sfx('blow') || T.tone([300, 200], .3, { vol: .08 });
          T.pop(680, BY - sizes[i - 1] - 30, tr(['뭉게', '뭉게뭉게', '뭉게뭉게뭉게!'][i - 1]));
        };
        if (+n === 1) {   // 한 줄을 읽는 동안 세 단계로 커진다 (2·3 은 시간 맞춰 저절로)
          const my = live(); step(1);
          setTimeout(() => { if (my()) step(2); }, 1100); setTimeout(() => { if (my()) step(3); }, 2200);
          setTimeout(() => { if (my()) { popSfx(T); puff(680, 230); T.pop(680, 90, tr('퐁!')); } }, 3200);
        }
      },
      press(shape) {
        const i = { rabbit: 1, whale: 2, puppy: 3 }[shape]; if (!i || !RS.shapes) return;
        const HOLES = [[378, 206], [500, 219], [628, 219]], BELT = 343, c = RS.shapes[i - 1], [hx, hy] = HOLES[i - 1], my = live();
        oppa.hop(8, 220); AudioFX.sfx('bonk') || popSfx(T); T.shake();
        put(T, c, hx, hy + 40, { s: .35 });
        c.pos.animate([{ transform: `translate(${hx}px,${hy + 40}px) scale(.35)`, opacity: .4 }, { transform: `translate(${hx}px,${hy + 95}px) scale(.8)`, opacity: 1, offset: .55 },
          { transform: `translate(${hx}px,${BELT}px) scale(1)`, opacity: 1 }], { duration: 1800, easing: 'cubic-bezier(.3,.7,.4,1)', fill: 'forwards' }).finished.then(() => {
          if (!my()) return;
          c.pos.getAnimations().forEach(an => an.cancel()); c.setScale(1); c.place(hx, BELT); c.hop(10, 300); popSfx(T); puff(hx, BELT - 50);
          T.pop(hx, BELT - 150, tr(['토끼!', '고래!', '강아지!'][i - 1]));
        }).catch(() => {});
      },
      button() { agi.look('press', 'left'); AudioFX.sfx('bonk') || popSfx(T); T.shake(); },
      flue(verb, who) {
        const FLX = 771, FLY = 400, my = live();
        if (verb !== 'up') return;
        if (who === 'puppy' && RS.dc) {
          const dc = RS.dc, sx = dc.x, sy = dc.y; AudioFX.sfx('whoosh') || popSfx(T);
          dc.pos.animate([{ transform: `translate(${sx}px,${sy}px) scale(1)`, opacity: 1 }, { transform: `translate(${(sx + FLX) / 2}px,${sy + 10}px) scale(.8) rotate(-8deg)`, opacity: 1, offset: .45 },
            { transform: `translate(${FLX}px,${FLY + 10}px) scale(.15)`, opacity: 0 }], { duration: 1600, easing: 'ease-in', fill: 'forwards' }).finished.then(() => { if (my()) { hide(dc); T.pop(FLX, 120, tr('퐁!')); } }, () => {});
        }
        if (who === 'baby') {
          baby.look('up', 'right'); AudioFX.sfx('whoosh') || popSfx(T);
          const sx = baby.x, sy = baby.y;
          baby.pos.animate([{ transform: `translate(${sx}px,${sy}px) scale(1)`, opacity: 1 }, { transform: `translate(${(sx + FLX) / 2}px,${sy - 20}px) scale(.8)`, opacity: 1, offset: .45 },
            { transform: `translate(${FLX}px,${FLY + 10}px) scale(.15)`, opacity: 0 }], { duration: 1600, easing: 'ease-in', fill: 'forwards' }).finished.then(() => { if (my()) hide(baby); }, () => {});
        }
      },
      tank(verb) {
        if (verb !== 'drink' || !RS.darks) return;
        const my = live();
        (async () => { for (let i = 0; i < 3 && my(); i++) { const d = RS.darks[i]; d.setScale(1.05); d.place(d.x, d.y); d.hop(6, 300); AudioFX.sfx('gulp') || popSfx(T); await sleep(600); } })();
      },
      bell() {
        const my = live();
        (async () => { for (let k = 0; k < 3 && my(); k++) { AudioFX.sfx('bell') || T.tone([880], .3, { vol: .1 }); await sleep(380); } })();
      },
      darks(verb) {
        if (verb !== 'lineout' || !RS.march) return;
        const my = live();
        RS.march.forEach((d, i) => d.move(1060 + i * 60, 300, 2200 + i * 200, 'ease-in').then(() => { if (my()) hide(d); }));
      },
      baby(verb) {
        if (verb === 'curl') { if (!onS(baby)) { put(T, baby, X(110, 300), G - 10, { look: 'huddle', to: 'right' }); } else baby.look('huddle'); return; }
        if (verb === 'eyes') { morph(baby, 'wide'); baby.hop(12, 360); return; }
        if (verb === 'up') { baby.look('up', 'right'); return; }
        if (verb === 'pet') {
          const my = live();
          (async () => { for (let i = 1; i <= 3 && my(); i++) { baby.hop(6, 260); agi.hop(8, 260); popSfx(T); T.pop(baby.x + 30, baby.y - 230, tr(['살살', '쓰담', '토닥'][i - 1])); await sleep(600); } })();
          return;
        }
        if (verb === 'white') {   // 남은 비를 톡톡 내리며 조금씩 작아지고 옅어져 하얀 아기 구름만 남는다
          const my = live();
          startRain(baby.x - 50, baby.x + 50, baby.y - 10, 8);
          const bx = baby.x, by = baby.y, s0 = baby.scale || 1;
          baby.pos.animate([{ transform: `translate(${bx}px,${by}px) scale(${s0})`, opacity: 1 }, { transform: `translate(${bx}px,${by - 10}px) scale(${s0 * .55})`, opacity: .85 }], { duration: 3200, easing: 'ease-in-out', fill: 'forwards' });
          morph(baby, 'white', 3200); AudioFX.sfx('sparkle') || popSfx(T);
          setTimeout(() => { if (!my()) return; stopRain(); baby.pos.getAnimations().forEach(an => an.cancel()); baby.setScale(s0 * .55); baby.place(bx, by - 10); baby.pos.style.opacity = .85; RS.white = true; }, 3400);
        }
      },
      storm(verb) {
        if (verb === 'bump') {
          baby.move(620, 190, 900, 'ease-in'); const my = live();
          setTimeout(() => { if (my()) { T.shake(); AudioFX.sfx('bonk') || popSfx(T); morph(baby, 'sorry'); } }, 900);
          return;
        }
        if (verb === 'flash') {
          const fl = el('rect', { x: -40, y: -24, width: 1080, height: 620, fill: '#fff', opacity: 0 }, T.fx);
          fl.animate([{ opacity: 0 }, { opacity: .85 }, { opacity: 0 }, { opacity: .5 }, { opacity: 0 }], { duration: 700 }).onfinish = () => fl.remove();
          T.shake(); T.pop(500, 150, tr('번쩍!'), '#E8A317');
        }
      },
      async cut(k) {
        if (k === 'hug') {
          await T.cutImage([{ src: src('cut_hug'), sfx: 'swish', hold: 3200 }], { hold: 3200 });
          put(T, nuna, X(440, 450), G, { look: 'hug', to: 'right' }); put(T, oppa, X(520, 510), G, { look: 'hug', to: 'left' }); put(T, agi, X(480, 480), G + 6, { look: 'hug', to: 'right' });
          return;
        }
        if (k === 'rainbow') await T.cutImage([{ src: src('cut_rainbow'), sfx: 'sparkle', hold: 3000 }], { hold: 3000 });
      },
      rain(verb) {
        if (verb === 'start') { RS.rd = 0; return; }
        if (verb !== 'drops') return;
        const i = RS.rd = (RS.rd || 0) + 1, d = one(T, 'prop_drop', 46), x = X(330 + (i - 1) * 170, 400 + (i - 1) * 50);
        put(T, d, x, 160); fadeIn(d, 300);
        setTimeout(() => { d.pos.animate([{ transform: `translate(${x}px,160px)` }, { transform: `translate(${x}px,${G}px)`, opacity: 0 }], { duration: 600, easing: 'ease-in', fill: 'forwards' }); }, 300);
        AudioFX.sfx('ding') || popSfx(T); startRain(0, 1000, -20, [4, 10, 24][Math.min(i, 3) - 1]);
      },
      puddle() {
        const my = live();
        (async () => { for (let i = 0; i < 3 && my(); i++) { const k = kids[i]; k.hop(30, 420); ring(k.x, G + 4); ring(k.x + 30, G + 8); AudioFX.sfx('splash') || popSfx(T); await sleep(600); } })();
      },
      soil(verb) {
        const my = live();
        const PX = x => P ? Math.round(500 + (x - 500) * .44) : x;
        const HOLE = 492, BACK = 452, FRONT = 546;
        const behind = baby.pos;
        const sprout = (key, x, y, s = 1, ms = 600) => {
          const p = put(T, key, PX(x), y, { s }); T.world.insertBefore(p.pos, behind);
          p.body.animate([{ transform: 'scale(.2)' }, { transform: 'scale(1)' }], { duration: ms, easing: 'cubic-bezier(.3,1.6,.5,1)' });
          return p;
        };
        const plant = (k, x, y, s) => sprout(one(T, 'prop_' + (FLW.includes(k) ? 'flower_' + k : k), PH[k]), x, y, s);
        if (verb === 'sprout') {
          const ORDER = [[505, 'sunflower'], [354, 'tulip_red'], [657, 'tulip_yellow'], [203, 'daisy_white'], [809, 'cosmos_pink']];
          const buds = RS.buds = ORDER.map(([, k], i) => mk(T, { s0: ['prop_sprout', 90], s1: [i ? 'prop_flower_bud_mix' : 'prop_bud', i ? PH.bud_mix : 120], s2: ['prop_flower_' + k, PH[k]] }, false));
          buds.forEach((b, i) => setTimeout(() => { if (my()) { sprout(b, ORDER[i][0], HOLE, 1); b.look('s0'); } }, i * 120));
          popSfx(T); return;
        }
        if (verb === 'flower') {
          const buds = RS.buds; if (!buds) return;
          stopRain();
          buds.forEach(b => morph(b, 's1', 400));
          setTimeout(() => { if (!my()) return; morph(buds[0], 's2'); buds.slice(1).forEach((b, i) => setTimeout(() => { if (my()) morph(b, 's2'); }, 300 + i * 140)); }, 450);
          const FILL = [[430, BACK, 'wild_purple', .85], [580, BACK, 'tulip_pink', .85], [280, BACK, 'bell_blue', .85], [730, BACK, 'cluster_a', .85], [130, BACK, 'poppy_orange', .85], [880, BACK, 'cluster_b', .85],
            [430, FRONT, 'daisy_white', 1], [590, FRONT, 'cosmos_pink', 1], [30, FRONT, 'cluster_a', 1], [975, FRONT, 'cluster_b', 1]];
          (async () => { await sleep(800); for (const [x, y, k, sc] of FILL) { if (!my()) return; plant(k, x, y, sc); await sleep(90); } })();
          return;
        }
        if (verb === 'berry') {
          const BUSH = [[300, 'berry_bush_b'], [700, 'berry_bush'], [880, 'berry_bush']];
          const bushes = BUSH.map(([x, k]) => { const b = mk(T, { s0: ['prop_berry_green', 110], s1: ['prop_' + k, PH[k]] }, false); sprout(b, x, FRONT + 4, 1); b.look('s0'); return b; });
          setTimeout(() => { if (my()) bushes.forEach(b => morph(b, 's1')); }, 500);
          const BITS = [[240, 'berry_single'], [370, 'berry_flower'], [470, 'berry_single'], [560, 'berry_flower'], [640, 'berry_single'], [770, 'berry_single']];
          (async () => { await sleep(300); for (const [x, k] of BITS) { if (!my()) return; plant(k, x, FRONT + 6, 1); await sleep(100); } })();
          dog.move(X(790, 610), G + 20, 900);
          setTimeout(() => { if (my()) morph(baby, 'wide'); }, 2600);
        }
      },
      rainbow(verb) {
        if (verb !== 'count') return;
        const COL = ['#E4573D', '#F29A38', '#F6C945', '#6FAE5A', '#4A90D9', '#3F4FA0', '#8B5CB8'], NAME = ['빨강!', '주황!', '노랑!', '초록!', '파랑!', '남색!', '보라!'], my = live();
        (async () => {
          for (let i = 1; i <= 7 && my(); i++) {
            const t = Math.PI * (1 - (i - .5) / 7), x = 540 + 470 * Math.cos(t), y = 380 - 320 * Math.sin(t);
            popSfx(T); T.pop(X(x, Math.max(320, Math.min(680, x))), Math.max(70, y), tr(NAME[i - 1]), COL[i - 1]); await sleep(520);
          }
        })();
      },
      fx(n) {
        if (n === 'pong') {
          popSfx(T, true);
          if (rTag === '15_rainbow_v21' && RS.white) { baby.hop(16, 400); T.pop(baby.x, baby.y - 140, tr('퐁!')); }
          if (rTag === '01_road2' && RS.c2) { const my = live(); (async () => { for (let k = 0; k < 2 && my(); k++) { const C0 = RS.C0; smokeToCloud(RS.c2[k], C0, [C0[0], C0[1] - 50], [[X(720, 600), 150], [X(600, 520), 120]][k], 2400, P ? .75 : 1); await sleep(700); } })(); }
          return;
        }
        if (n === 'ding') return AudioFX.sfx('ding') || popSfx(T);
        if (n === 'splash') return AudioFX.sfx('splash') || popSfx(T);
        if (n === 'whoosh') return AudioFX.sfx('whoosh') || popSfx(T);
        if (n === 'thunder') return sfx('thunder', .3) || AudioFX.sfx('boom', .35) || T.tone([110, 55], .6, { type: 'sawtooth', vol: .08 }); // 잠자리용: 천둥은 작게
        if (n === 'sneeze') return AudioFX.sfx('cork') || popSfx(T);
        if (n === 'woof') { dog.hop(10, 260); T.pop(dog.x, dog.y - 260, tr('멍!')); return; }
        if (n === 'sniff') { popSfx(T); dog.hop(10, 260); T.pop(dog.x + 30, dog.y - 250, tr('킁킁!')); return; }
        console.warn('[read] fx 모름', n);
      },
      pop(spec) { const [x, y, ...w] = String(spec).split(','); const px = P ? Math.max(RCX[rTag.replace(/\d$/, '')] - 170 || 330, Math.min((RCX[rTag.replace(/\d$/, '')] || 500) + 170, +x)) : +x; T.pop(px, +y, tr(w.join(','))); },
    };
    const READ_ACTS = RA;
    /* 읽어 주기 효과음 동사 (2026-10-28 사용자 결정: 놀이판과 같은 효과음). 대본 before/after 에 sfx:이름:음량, sfxs:이름들:간격ms:음량 으로 넣는다.
       기다리지 않고(null 반환), 실패해도 낭독을 막지 않는다. 낭독 전에 장면이 순식간에 놓이는 중(readInstant)에는 울리지 않는다. */
    if (READ_ACTS && typeof READ_ACTS === 'object') {
      READ_ACTS.sfx = (n, v) => { try { if (!T.readInstant()) AudioFX.sfx(n, +v || .55); } catch (e) { /* 무시 */ } return null; };
      READ_ACTS.sfxs = (list, step, v) => { try { if (T.readInstant()) return null; String(list).split(',').forEach((n, i) => setTimeout(() => { try { AudioFX.sfx(n, +v || .55); } catch (e) { /* 무시 */ } }, i * (+step || 260))); } catch (e) { /* 무시 */ } return null; };
    }
    if (READ_ACTS && typeof READ_ACTS === 'object') { // 짧은 배경 소리·동물 소리 동사: amb:이름:음량:초, animal:이름:음량
      READ_ACTS.amb = (n, v, d) => { try { if (!T.readInstant()) AudioFX.ambient(n, { vol: +v || .15, dur: +d || 3, fadeIn: 1 }); } catch (e) { /* 무시 */ } return null; };
      READ_ACTS.animal = (n, v) => { try { if (!T.readInstant()) AudioFX.animal(n, +v || .4); } catch (e) { /* 무시 */ } return null; };
    }
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) return T.readPlay(READ_ACTS);

    const SCENES = [];
    const S = f => SCENES.push(f);

    /* --- 1. 산책길 --- */
    S(async first => {
      const go = () => {
        scene('01_road'); skyDrift([[70, 150, 90, .15], [130, 110, 70, .55], [55, 90, 110, .8, .85]]);
        put(T, nuna, X(300, 330), G, { look: 'walk', to: 'right' });
        put(T, oppa, X(400, 420), G, { look: 'walk', to: 'right' });
        put(T, agi, X(490, 500), G, { look: 'walk', to: 'right' });
        put(T, dog, X(640, 600), G, { look: 'sniff', to: 'right' });
      };
      if (first) { go(); await T.curtain(true); } else await T.sceneCard('', go);
      amb('birds_chirp_1', { vol: .25, dur: 4 }); // 햇살 언덕 새소리
      if (first) intro.go(); // 시작 음악 (놀이)
      await say('해가 쨍쨍한 날, 다현이와 이현이와 은우는 꿀떡이랑 산책을 나가요.');
      await say('하늘에 구름이 둥실둥실.');
      nuna.look('point'); oppa.look('lookup'); agi.look('lookup');
      await say('"구름은 어디서 올까?"');
      await sleep(600); // 저절로 (2026-10-20 톡 조작 정리)
      popSfx(T); dog.hop(10, 260); T.pop(dog.x + 30, dog.y - 250, tr('킁킁!'));
      await say('꿀떡이는 땅에 코를 대고 킁킁.');
    });
    /* --- 2. 냄새를 따라 --- */
    S(async () => {
      let trail;
      await T.sceneCard('', () => {
        scene('02_hill', 420); skyDrift([[60, 120, 95, .35], [120, 90, 75, .75, .9]]);
        put(T, nuna, X(180, 330), G, { look: 'run', to: 'right' });
        put(T, oppa, X(280, 410), G, { look: 'run', to: 'right' });
        put(T, agi, X(370, 480), G, { look: 'run', to: 'right' });
        put(T, dog, X(500, 560), G, { look: 'nose', to: 'right' });
        trail = el('path', { d: 'M520 410 C600 360 640 300 720 260 S860 170 920 150', fill: 'none', stroke: '#E87FA8', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-dasharray': '2 16', opacity: .85 }, T.bg);
      });
      trail.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: -72 }], { duration: 1200, iterations: Infinity });
      await say('킁킁킁! 꿀떡이가 무슨 냄새를 맡았어요.');
      await sleep(600); // 저절로 (2026-10-20 톡 조작 정리)
      popSfx(T); dog.look('run', 'right');
      // 냄새 길을 따라 언덕 위까지 달려가 멈추고, 뒤돌아 꼬리를 흔들며 기다린다 (사라지지 않는다)
      const run1 = dog.move(X(1180, 780), 330, 2600, 'ease-in').then(() => hide(dog)); // 언덕 너머로 달려 나가 보이지 않는다
      await say('냄새를 따라 쪼르르 달려가요.');
      await run1;
      await say('"꿀떡아, 같이 가!"');
      const climb = Promise.all(kids.map(k => k.move(k.x + 200, G - 40, 2600, 'linear')));
      await say('삼남매는 영차, 영차 언덕을 올라요.');
      await climb;
    });
    /* --- 3. 굴뚝에서 퐁! 굴뚝 김이 바람을 따라 왼쪽 위로 휘어 오르고, 톡 할 때마다 큰 김 덩이가 그 길 끝에서 종이 구름이 된다.
           그 구름 셋을 톡 하면 토끼·물고기·자동차 --- */
    S(async () => {
      const C0 = [657, 124]; // 굴뚝 꼭대기 (그림에서 잰 자리)
      const SKY = [[X(570, 610), 92, 'rabbit', '토끼!'], [X(355, 480), 140, 'fish', '물고기!'], [X(140, 350), 96, 'car', '자동차!']];
      const CS = P ? .7 : 1; // 세로 화면은 폭이 좁아 조금 작게
      const ctl = ([tx, ty]) => [C0[0] + 10, Math.min(ty, C0[1]) - 30]; // 곧게 솟다가 왼쪽으로 눕는다
      const cl = SKY.map(([, , shape]) => mk(T, { c: ['cloud_white', 140], s: ['cloud_' + shape, 150] }, false));
      await T.sceneCard('', () => {
        scene('03_chimney', 520);
        put(T, nuna, X(250, 390), G, { look: 'lookup', to: 'right' });
        put(T, oppa, X(345, 455), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(430, 525), G, { look: 'point', to: 'right' });
        put(T, dog, X(160, 600), G, { look: 'lookup', to: 'right' });
        cl.forEach(hide);
      });
      const far = [X(120, 300), 60];
      chimneyLoop(C0, ctl(far), far, { s1: 2.4 });
      await say('언덕 너머에 커다란 굴뚝 하나.');
      amb('steam_hiss', { vol: .25, dur: 3 }); // 김 폴폴
      await say('굴뚝에서 하얀 김이 폴폴.');
      const outs = [];
      const puffUp = i => {
        T.pop(C0[0] + 70, C0[1] + 60, tr(['폴폴', '뭉게', '퐁!'][i - 1]));
        const [tx, ty] = SKY[i - 1]; outs.push(smokeToCloud(cl[i - 1], C0, ctl([tx, ty]), [tx, ty], 3200 + i * 300, CS, i === 1));
      };
      await T.ask('굴뚝을 톡!', () => T.tap(hitR(C0[0] - 45, C0[1] - 20, 90, 280), { prompt: '톡!' })); // 한 번 누르면 나머지는 저절로 (2026-10-20)
      for (let i = 1; i <= 3; i++) { puffUp(i); await sleep(600); }
      await Promise.all(outs);
      oppa.look('clap'); agi.look('lookup');
      sfx('pop_appear', .6);
      await say('김이 뭉치고, 뭉치고… 퐁! 구름이 됐어요.');
      oppa.look('lookup'); nuna.look('point');
      await say('"구름이 여기서 오는구나!"');
      agi.look('jump'); agi.hop(24, 380); popSfx(T);
      await say('"퐁!" 은우가 따라 해요.');
      agi.look('lookup');
      /* 세 구름 중 아무거나 하나를 누르면 된다: 구름 셋 위에 투명한 누르는 자리를 한 판으로 덮는다 (2026-10-20: 오른쪽 구름만 눌렸음) */
      const anyCloud = el('g', {}, T.world);
      const cx = cl.slice(0, 3).map(c => c.x), cy = cl.slice(0, 3).map(c => c.y - 50 * CS), R = 95 * CS;
      el('rect', { x: Math.min(...cx) - R, y: Math.min(...cy) - R, width: Math.max(...cx) - Math.min(...cx) + 2 * R, height: Math.max(...cy) - Math.min(...cy) + 2 * R, rx: 40, fill: 'transparent' }, anyCloud); // 구름 사이 빈 곳도 눌리게 (손 힌트가 가운데를 가리킨다)
      await T.ask('하늘의 구름을 톡! 무엇이 될까요?', () => T.tap(anyCloud, { prompt: '하늘의 구름을 톡! 무엇이 될까요?' })); // 한 번 누르면 나머지는 저절로
      anyCloud.remove();
      sfx('chime_up', .5); // 구름이 모양으로 바뀐다
      await say('구름이 쏙! 토끼, 물고기, 자동차로 바뀌어요.'); // 구름이 모양으로 바뀌는 첫 순간의 내레이션 (2026-10-21)
      for (let i = 0; i < 3; i++) {
        if (i > 0) await sleep(400);
        morph(cl[i], 's'); cl[i].hop(14, 360); popSfx(T); puff(cl[i].x, cl[i].y - 70 * CS); T.pop(cl[i].x, cl[i].y + 30, tr(SKY[i][3]));
        kids[i].look('jump'); kids[i].hop(16, 320); await sleep(500); kids[i].look('lookup');
      }
      await sleep(900);
    });
    /* --- 4. 커다란 문 --- */
    S(async () => {
      const DX = X(723, 723), DOORY = 428; // 열린 문 안쪽 (어두운 틈) 가운데 · 문 안쪽 바닥
      await T.sceneCard('', () => {
        scene('04_door', 700);
        put(T, nuna, X(330, 520), G, { look: 'lookup', to: 'right' });
        put(T, oppa, X(430, 590), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(520, 650), G, { look: 'lookup', to: 'right' });
        put(T, dog, X(700, 760), G, { look: 'nose', to: 'right' });
      });
      await say('굴뚝 아래 커다란 문.');
      await say('여기는… 어떤 공장일까요?');
      await say('꿀떡이가 문틈에 코를 쏙 밀어 넣어요.');
      await sleep(600); // 저절로 (2026-10-20 톡 조작 정리)
      AudioFX.sfx('creak') || popSfx(T);
      await say('스르르… 문이 열려요.');
      kids.forEach(k => k.look('tiptoe', 'right'));
      // 문 앞 바닥을 걸어가 열린 문 틈 앞에 서고, 안쪽으로 걸어 들어가며 작아지고 어둠 속으로 사라진다 (문 앞에서 한 번에 사라지지 않는다)
      const enter = async (k, x, wait) => {
        await sleep(wait); await k.move(x, G - 6, 1500, 'ease-in-out');
        const x0 = k.x, y0 = k.y, f = k.flip, s0 = k.scale;
        await k.pos.animate([{ transform: `translate(${x0}px,${y0}px) scale(${f * s0},${s0})`, opacity: 1 },
          { transform: `translate(${DX}px,${DOORY + 20}px) scale(${f * s0 * .6},${s0 * .6})`, opacity: 1, offset: .6 },
          { transform: `translate(${DX}px,${DOORY}px) scale(${f * s0 * .5},${s0 * .5})`, opacity: 0 }], { duration: 1300, easing: 'ease-in', fill: 'forwards' }).finished;
        hide(k);
      };
      const inn = Promise.all([enter(dog, DX - 10, 0), ...kids.map((k, i) => enter(k, DX - 25 + i * 22, 900 + i * 450))]);
      await say('삼남매는 살금살금 따라 들어가요.');
      await inn;
    });
    /* --- 5. 물방울과 바람 --- */
    S(async () => {
      const FX = 198, FY = 222, HX = 540, HY = 165, BY = 300; // 깔때기 끝 · 나팔 입 · 벨트 위
      await T.sceneCard('', () => {
        scene('05_belt_v2', 400);
        put(T, oppa, X(240, 300), G, { look: 'reach', to: 'right' });
        put(T, nuna, X(400, 420), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(520, 500), G, { look: 'clap', to: 'right' });
        put(T, dog, X(130, 230), G, { look: 'sniff', to: 'right' });
      });
      const drops = [], DX0 = X(FX, 250), DH = 100; // 세로 화면은 왼쪽이 잘려 깔때기 아래쪽으로 당겨 보인다
      // 물방울은 말하기 전에 깔때기 끝에 큼직하게 맺혀 흔들린다
      const first = one(T, 'prop_drop', DH); put(T, first, DX0, FY + 62); fadeIn(first, 400); drops.push(first);
      first.body.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(8px)' }, { transform: 'translateY(0)' }], { duration: 900, iterations: Infinity, easing: 'ease-in-out' });
      amb('water_drip', { vol: .25, dur: 3 }); // 물방울 똑똑
      await say('기다란 벨트 위로 물방울이 똑, 똑, 똑.');
      const fall = (d, x) => d.pos.animate([{ transform: `translate(${x}px,${d.y}px) scale(${d.flip * d.scale},${d.scale})` }, { transform: `translate(${x}px,${BY}px) scale(${d.flip * d.scale},${d.scale})` }], { duration: 500, easing: 'ease-in', fill: 'forwards' });
      const dropStep = i => {
        let d = first;
        if (i > 1) { d = one(T, 'prop_drop', DH); put(T, d, DX0, FY + 62); drops.push(d); }
        else first.body.getAnimations().forEach(an => an.cancel());
        fall(d, DX0);
        AudioFX.sfx('ding') || popSfx(T); T.pop(DX0 + 70, FY - 100, tr('똑!'), '#4A90D9');
      };
      await T.ask('물방울을 톡!', () => T.tap(hitC(DX0, FY + 62 - DH / 2, 80), { prompt: '물방울을 톡!' })); // 한 번 누르면 나머지는 저절로 (2026-10-20)
      for (let i = 1; i <= 3; i++) { dropStep(i); await sleep(500); }
      await say('이현이가 물방울에 손을 살짝 대 봐요.');
      oppa.hop(8, 260); T.pop(oppa.x + 40, oppa.y - 340, tr('앗, 차가워!'), '#4A90D9');
      await sleep(700);
      // 바람: 나팔을 톡톡톡 → 구름이 세 단계로 커진다
      nuna.look('blow');
      drops.forEach(d => d.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }));
      const cloud = one(T, 'cloud_white', 40); put(T, cloud, 680, BY + 10); hide(cloud);
      await say('다현이는 후우— 바람을 불어 줘요.');
      const sizes = [70, 110, 160];
      const blowStep = i => {
        if (i === 1) { put(T, cloud, 680, BY + 10); fadeIn(cloud, 300); }
        cloud.setScale(sizes[i - 1] / 40); cloud.place(680, BY + 10); cloud.hop(10, 300);
        AudioFX.sfx('blow') || T.tone([300, 200], .3, { vol: .08 });
        T.pop(680, BY - sizes[i - 1] - 30, tr(['뭉게', '뭉게뭉게', '뭉게뭉게뭉게!'][i - 1]));
      };
      await T.ask('바람 나팔을 톡!', () => T.tap(hitR(HX - 180, HY - 80, 200, 160), { prompt: '톡!' })); // 한 번 누르면 나머지는 저절로 (2026-10-20)
      for (let i = 1; i <= 3; i++) { blowStep(i); await sleep(600); }
      popSfx(T); puff(680, BY - 70); T.pop(680, BY - 210, tr('퐁!'));
      await say('뭉게, 뭉게뭉게, 뭉게뭉게뭉게! 퐁!');
      nuna.look('jump'); nuna.hop(20, 360);
      await say('"여기는 구름 공장이야!"');
    });
    /* --- 6. 모양 틀: 틀의 구멍(토끼·고래·강아지)에서 구름이 천천히 밀려 나와 벨트로 내려앉는다 --- */
    S(async () => {
      const HOLES = [[378, 206], [500, 219], [628, 219]], BELT = 343; // 그림에서 잰 구멍 가운데 · 벨트 윗면
      let shapes;
      await T.sceneCard('', () => {
        scene('06_press_v2', 470);
        put(T, oppa, X(205, 330), G, { look: 'press', to: 'right' });
        put(T, nuna, X(110, 270), G, { look: 'clap', to: 'right' });
        put(T, agi, X(820, 650), G, { look: 'point', to: 'left' });
        put(T, dog, X(730, 600), G, { look: 'lookup', to: 'left' });
        shapes = ['rabbit', 'whale', 'dog'].map(sh => { const c = one(T, 'cloud_' + sh, 110); hide(c); return c; });
      });
      await say('이현이가 모양 틀을 꾹! 눌러요.');
      const outs = [];
      const pressStep = i => {
        const c = shapes[i - 1], [hx, hy] = HOLES[i - 1];
        oppa.hop(8, 220); AudioFX.sfx('bonk') || popSfx(T); T.shake();
        put(T, c, hx, hy + 40, { s: .35 });
        // 구멍에서 쑥 밀려 나와(커지며) 벨트 위로 툭 내려앉는다
        outs.push(c.pos.animate([{ transform: `translate(${hx}px,${hy + 40}px) scale(.35)`, opacity: .4 }, { transform: `translate(${hx}px,${hy + 95}px) scale(.8)`, opacity: 1, offset: .55 },
          { transform: `translate(${hx}px,${BELT}px) scale(1)`, opacity: 1 }], { duration: 1800, easing: 'cubic-bezier(.3,.7,.4,1)', fill: 'forwards' }).finished.then(() => {
          c.pos.getAnimations().forEach(an => an.cancel()); c.setScale(1); c.place(hx, BELT); c.hop(10, 300); popSfx(T); puff(hx, BELT - 50);
          T.pop(hx, BELT - 150, tr(['토끼!', '고래!', '강아지!'][i - 1]));
        }).catch(() => {}));
      };
      await sleep(500); // 저절로 (2026-10-20 톡 조작 정리)
      for (let i = 1; i <= 3; i++) { pressStep(i); await sleep(700); }
      await Promise.all(outs);
      await say('퐁! 토끼 구름. 퐁! 고래 구름.');
      await say('퐁! 이번엔 강아지 구름.');
      dog.look('nose', 'left'); await dog.move(HOLES[2][0] + 85, G, 900);
      await say('꿀떡이가 강아지 구름과 코를 맞대요.');
      dog.look('sneeze', 'left'); AudioFX.sfx('cork') || popSfx(T);
      for (let k = 0; k < 5; k++) puff(HOLES[2][0] + 20 - k * 10, BELT - 40 - k * 8);
      T.pop(dog.x + 20, dog.y - 280, tr('에취!'));
      await say('에취! 구름 조각이 사르르 날려요.');
    });
    /* --- 7. 빨간 단추 --- */
    S(async () => {
      const BX = 154, BYY = 300, FLX = 771, FLY = 400; // 단추 · 굴뚝 관 입구
      let dc;
      await T.sceneCard('', () => {
        scene('07_button_v2', 300);
        put(T, agi, X(250, 260), G, { look: 'lookup', to: 'left' });
        put(T, nuna, X(370, 360), G, { look: 'lookup', to: 'left' });
        put(T, oppa, X(460, 430), G, { look: 'lookup', to: 'left' });
        put(T, dog, X(600, 500), G, { look: 'wag', to: 'right' });
        dc = one(T, 'cloud_dog', 120); put(T, dc, X(660, 560), 360);
      });
      await say('구석에 커다란 빨간 단추가 있어요.');
      await say('"눌러 봐도 돼?"');
      await T.ask('빨간 단추를 톡!', () => T.tap(hitC(BX, BYY, 70), { prompt: '빨간 단추를 톡!' }));
      agi.look('press', 'left'); AudioFX.sfx('bonk') || popSfx(T); T.shake();
      await say('은우가 꾹! 눌렀어요.');
      dog.look('lookup', 'right'); kids.forEach(k => k.look('lookup', 'right'));
      // 굴뚝 관 아래 입구로 빨려 들어가며 작아져 사라진다
      sfx('zip_away', .6) || popSfx(T);
      const sx = dc.x, sy = dc.y;
      const up = dc.pos.animate([{ transform: `translate(${sx}px,${sy}px) scale(1)`, opacity: 1 }, { transform: `translate(${(sx + FLX) / 2}px,${sy + 10}px) scale(.8) rotate(-8deg)`, opacity: 1, offset: .45 },
        { transform: `translate(${FLX}px,${FLY + 10}px) scale(.15)`, opacity: 0 }], { duration: 1600, easing: 'ease-in', fill: 'forwards' });
      await say('슈웅— 강아지 구름이 굴뚝으로 올라가요.');
      await up.finished.catch(() => {}); hide(dc);
      popSfx(T); T.pop(FLX, 120, tr('퐁!'));
      await say('퐁! 하늘로 나갔어요.');
    });
    /* --- 8. 먹구름 방 --- */
    S(async () => {
      const DXS = [650, 760, 870], DYY = 222; // 물통 윗면(그림에서 잰 자리) 위에 앉아 빨대로 마신다
      let darks;
      await T.sceneCard('', () => {
        scene('08_tank_room', 560);
        put(T, nuna, X(110, 400), G, { look: 'tiptoe', to: 'right' });
        put(T, oppa, X(200, 455), G, { look: 'tiptoe', to: 'right' });
        put(T, agi, X(280, 505), G, { look: 'lookup', to: 'right' });
        put(T, dog, X(380, 380), G, { look: 'sniff', to: 'right' });
        darks = DXS.map((x, i) => { const d = one(T, ['dark_drink', 'dark_drink2', 'dark_drink3'][i], [150, 130, 115][i]); put(T, d, x, DYY, { s: .85 }); return d; });
      });
      await say('옆방은 어두컴컴한 먹구름 방.');
      await say('먹구름들이 커다란 물통에서 물을 마셔요.');
      const drinkStep = i => {
        const d = darks[i - 1]; d.setScale(1.05); d.place(d.x, d.y); d.hop(6, 300);
        AudioFX.sfx('gulp') || popSfx(T); T.pop(d.x, d.y - 200, tr('꿀꺽!'));
      };
      await sleep(500); // 저절로 (2026-10-20 톡 조작 정리)
      for (let i = 1; i <= 3; i++) { drinkStep(i); await sleep(600); }
      await say('꿀꺽, 꿀꺽, 꿀꺽. 배가 빵빵해졌어요.');
      nuna.look('whisper', 'right');
      await say('"비를 만들려나 봐."');
      await say('꿀떡이는 축축한 바닥을 킁킁.');
    });
    /* --- 9. 종 · 아기 먹구름 --- */
    S(async () => {
      const BX = 792, BYY = 100, EXIT = 1060;
      let march;
      await T.sceneCard('', () => {
        scene('09_bell_room', 610);   // 세로: 종(792)이 화면 안에 오게 카메라를 오른쪽으로 (2026-10-22)
        put(T, nuna, X(430, 500), G, { look: 'lookup', to: 'right' });
        put(T, oppa, X(520, 560), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(600, 620), G, { look: 'lookup', to: 'right' });
        put(T, dog, X(330, 440), G, { look: 'lookup', to: 'left' });
        march = [0, 1, 2].map(i => { const d = one(T, ['dark_march', 'dark_march2', 'dark_march3'][i], [140, 120, 105][i]); put(T, d, 640 + i * 110, 300, { s: .8 }); return d; });
        hide(baby);
      });
      await T.ask('종을 톡!', () => T.tap(hitC(BX, BYY, 60), { prompt: '종을 톡!' }));
      for (let k = 0; k < 3; k++) { AudioFX.sfx('bell') || T.tone([880], .3, { vol: .1 }); T.pop(BX - 40 + k * 30, BYY + 70 + k * 10, tr('땡!'), '#C98A2B'); await sleep(380); }
      await say('땡, 땡, 땡! 종이 울려요.');
      const out = Promise.all(march.map((d, i) => d.move(EXIT + i * 60, 300, 2200 + i * 200, 'ease-in')));
      await say('먹구름들이 줄을 서서 밖으로 나가요.');
      await out; march.forEach(hide);
      if (P) await T.camTo(500, 280, 1, 600);   // 세로: 종 쪽에서 가운데로 되돌린다
      put(T, baby, X(110, 300), G - 10, { look: 'huddle', to: 'right' }); fadeIn(baby, 600);
      nuna.look('crouch', 'left'); oppa.look('lookup', 'left'); agi.look('crouch', 'left');
      await say('구석에 아기 먹구름 하나가 혼자 웅크리고 있어요.');
      await say('"나는 안 나갈래. 다들 비를 싫어하잖아."');
      const cSad = feelCard(X(330, 380), 140, 'sad', '슬퍼요'), cHappy = feelCard(X(670, 620), 140, 'happy', '기뻐요');
      sfx('question', .6);
      await T.ask('아기 먹구름은 지금 어떤 마음일까요?', () => T.choose([{ key: 'sad', el: cSad, ok: true }, { key: 'happy', el: cHappy, ok: false }],
        { prompt: '아기 먹구름은 지금 어떤 마음일까요?', where: '혼자 웅크리고 있어요. 슬픈 것 같아요.', who: '슬퍼요를 톡!' }));
      cSad.remove(); cHappy.remove();
      dog.look('sniff', 'left'); const near = dog.move(baby.x + 120, G, 1600, 'linear');
      await say('꿀떡이가 살금살금 다가가요.');
      await near;
    });
    /* --- 10. 비 좋아! --- */
    S(async () => {
      await T.sceneCard('', () => {
        scene('10_corner_close', 480);
        put(T, baby, 470, 330, { look: 'huddle', to: 'right', s: 1.2 });
        put(T, agi, X(330, 360), G, { look: 'pet', to: 'right' });
        put(T, nuna, X(680, 600), G, { look: 'lookup', to: 'left' });
        put(T, oppa, X(800, 640), G, { look: 'lookup', to: 'left' });
        put(T, dog, X(580, 520), G, { look: 'lick', to: 'left' }); hide(dog);
      });
      await say('은우가 아기 먹구름을 살살 쓰다듬어요.');
      const petStep = i => {
        baby.hop(6, 260); agi.hop(8, 260); popSfx(T); T.pop(baby.x + 30, baby.y - 230, tr(['살살', '쓰담', '토닥'][i - 1]));
      };
      await sleep(400); // 저절로 (2026-10-20 톡 조작 정리)
      for (let i = 1; i <= 3; i++) { petStep(i); await sleep(600); }
      nuna.look('splash', 'left'); nuna.hop(18, 360);
      await say('"비 좋아! 장화 신고 첨벙첨벙!"');
      oppa.look('splash', 'left'); oppa.hop(28, 420); ring(oppa.x, G + 4);
      await say('"첨벙첨벙!" 이현이도 폴짝 뛰어요.');
      put(T, dog, X(580, 520), G, { look: 'lick', to: 'left' }); fadeIn(dog, 300);
      T.pop(dog.x - 40, dog.y - 290, tr('할짝!'));
      await say('꿀떡이는 아기 먹구름 볼을 할짝.');
      morph(baby, 'wide'); baby.hop(12, 360);
      await say('아기 먹구름 눈이 동그래졌어요.');
    });
    /* --- 11. 나, 갈게! (강아지 구름이 나간 그 굴뚝 관으로 들어간다) --- */
    S(async () => {
      const FLX = 771, FLY = 400; // 7장면 그림의 굴뚝 관 입구
      await T.sceneCard('', () => {
        scene('07_button_v2', 560);
        put(T, baby, 520, 330, { look: 'wide', to: 'right', s: 1 });
        put(T, nuna, X(250, 390), G, { look: 'wave', to: 'right' });
        put(T, agi, X(340, 445), G, { look: 'wave', to: 'right' });
        put(T, oppa, X(430, 505), G, { look: 'lookup', to: 'right' });
        put(T, dog, X(600, 620), G, { look: 'bark', to: 'right' });
      });
      await say('"정말? 그럼 나, 갈게!"');
      await sleep(500); // 저절로 (2026-10-20 톡 조작 정리)
      baby.look('up', 'right'); sfx('zip_away', .6) || popSfx(T);
      const sx = baby.x, sy = baby.y;
      const up = baby.pos.animate([{ transform: `translate(${sx}px,${sy}px) scale(1)`, opacity: 1 }, { transform: `translate(${(sx + FLX) / 2}px,${sy - 20}px) scale(.8)`, opacity: 1, offset: .45 },
        { transform: `translate(${FLX}px,${FLY + 10}px) scale(.15)`, opacity: 0 }], { duration: 1600, easing: 'ease-in', fill: 'forwards' });
      await say('슈웅— 아기 먹구름이 굴뚝으로 올라가요. 퐁!');
      await up.finished.catch(() => {}); hide(baby); popSfx(T); T.pop(FLX, 110, tr('퐁!'));
      nuna.look('run'); agi.look('run'); oppa.look('run');
      await say('삼남매도 손을 흔들며 밖으로 달려 나가요.');
      for (let k = 0; k < 2; k++) { dog.hop(10, 260); T.pop(dog.x, dog.y - 260, tr('멍!')); await sleep(420); }
      await say('꿀떡이는 하늘을 보고 멍! 멍!');
    });
    /* --- 12. 번쩍! 우르릉 쾅! --- */
    S(async () => {
      let big;
      await T.sceneCard('', () => {
        scene('12_storm', 520);
        big = one(T, 'dark_bump', 150); put(T, big, 760, 210);
        put(T, baby, 420, 170, { look: 'up', to: 'right' });
        put(T, nuna, X(380, 430), G, { look: 'lookup', to: 'right' });
        put(T, oppa, X(470, 490), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(550, 545), G, { look: 'lookup', to: 'right' });
        put(T, dog, X(680, 600), G, { look: 'wag', to: 'left' });
        startRain(0, 1000, -20, 14);
      });
      baby.move(620, 190, 900, 'ease-in'); await sleep(900); T.shake(); AudioFX.sfx('bonk') || popSfx(T); morph(baby, 'sorry');
      await say('하늘에서 아기 먹구름이 큰 먹구름과 쿵!');
      const bg = el('g', { transform: 'translate(640,250) scale(.9)' }, T.world); T.paper(bg, [['path', { d: BOLT, fill: '#FFD43B', stroke: '#E8A317', 'stroke-width': 3 }]]); el('circle', { cx: 8, cy: 46, r: 62, fill: 'transparent' }, bg);
      await T.ask('번개를 톡!', () => T.tap(bg, { prompt: '번개를 톡!' }));
      const fl = el('rect', { x: -40, y: -24, width: 1080, height: 620, fill: '#fff', opacity: 0 }, T.fx);
      fl.animate([{ opacity: 0 }, { opacity: .85 }, { opacity: 0 }, { opacity: .5 }, { opacity: 0 }], { duration: 700 }).onfinish = () => fl.remove();
      T.shake(); sfx('thunder', .4) || AudioFX.sfx('boom', .5) || T.tone([110, 55], .6, { type: 'sawtooth', vol: .08 }); T.pop(500, 150, tr('번쩍!'), '#E8A317'); bg.remove(); // 천둥은 부드럽게
      kids.forEach(k => k.look('eek'));
      await say('번쩍! 우르릉 쾅!');
      await T.cutImage([{ src: src('cut_hug'), sfx: 'swish', hold: 3200 }], { hold: 3200 });
      put(T, nuna, X(440, 450), G, { look: 'hug', to: 'right' }); put(T, oppa, X(520, 510), G, { look: 'hug', to: 'left' }); put(T, agi, X(480, 480), G + 6, { look: 'hug', to: 'right' });
      await say('"으악!" 삼남매는 서로 꼭 껴안아요.');
      await say('"미안, 미안! 인사한 거야!"');
      dog.wiggle && dog.wiggle(8, 700);
      await say('꿀떡이는 꼬리를 살랑살랑 흔들어요.');
    });
    /* --- 13. 비가 내려요 --- */
    S(async () => {
      const PUD = [[180, 500], [500, 495], [800, 500]];
      await T.sceneCard('', () => {
        scene('13_rain', 500);
        put(T, nuna, X(250, 380), G, { look: 'lookup', to: 'right' });
        put(T, oppa, X(420, 450), G, { look: 'lookup', to: 'right' });
        put(T, agi, X(580, 520), G, { look: 'lookup', to: 'right' });
        put(T, dog, X(740, 610), G, { look: 'lookup', to: 'left' });
      });
      const words = ['톡.', '토독.', '토도독.'];
      for (let i = 0; i < 3; i++) {
        const d = one(T, 'prop_drop', 46), x = X(330 + i * 170, 400 + i * 50); put(T, d, x, 160); fadeIn(d, 300);
        await sleep(700); // 저절로 (2026-10-20 톡 조작 정리)
        d.pos.animate([{ transform: `translate(${x}px,160px)` }, { transform: `translate(${x}px,${G}px)`, opacity: 0 }], { duration: 600, easing: 'ease-in', fill: 'forwards' });
        AudioFX.sfx('ding') || popSfx(T); startRain(0, 1000, -20, [4, 10, 24][i]);
        await say(words[i]);
      }
      amb('rain_1', { vol: .25, dur: 4 }); // 비 소리
      await say('비가 내려요!');
      kids.forEach(k => k.look('splash')); dog.look('run', 'left');
      const splashStep = i => {
        const k = kids[i - 1]; k.hop(30, 420); ring(k.x, G + 4); ring(k.x + 30, G + 8); AudioFX.sfx('splash') || popSfx(T); T.pop(k.x, k.y - 290, tr('첨벙!'), '#4A90D9');
      };
      await sleep(400); // 저절로 (2026-10-20 톡 조작 정리)
      for (let i = 1; i <= 3; i++) { splashStep(i); await sleep(600); }
      await say('삼남매는 꿀떡이랑 물웅덩이에서 첨벙첨벙!');
      agi.hop(46, 520); ring(agi.x, G + 4); AudioFX.sfx('splash_big') || popSfx(T);
      await say('"첨벙!" 은우가 제일 높이 뛰어요.');
    });
    /* --- 14. 쑥! 활짝! 빨갛게! (2026-10-22 VISUAL_PLAN §3: 새싹 1→5, 꽃 1→5→15송이, 딸기 포기 3 + 조각 6) ---
       흙 그림(14_soil_v2)의 심을 자리 7곳 중 가운데 5곳에서 새싹이 나고, 꽃은 인물 뒤(z)·양옆·발 아래 띠에만 핀다 */
    S(async () => {
      const PX = x => P ? Math.round(500 + (x - 500) * .44) : x; // 세로 화면은 가운데 430만 보여 안쪽으로 모은다
      const HOLE = 492, BACK = 452, FRONT = 546; // 심을 자리 발끝 · 뒷줄(0.85배) · 발 아래 띠
      await T.sceneCard('', () => {
        scene('14_soil_v2', 500);
        put(T, baby, X(780, 620), 120, { look: 'sorry', to: 'left' });
        // 2026-10-20 크기 일관성: 앞쪽(기준선이 더 아래)인데 0.8~0.9로 줄여져 있던 것을 1로 (다른 장면과 같은 크기)
        put(T, dog, X(860, 640), G + 20, { look: 'sniff', to: 'left' });
        put(T, nuna, X(110, 300), G + 20, { look: 'crouch', to: 'right' }); put(T, agi, X(170, 330), G + 30, { look: 'crouch', to: 'right' }); put(T, oppa, X(920, 700), G + 20, { look: 'crouch', to: 'left' });
        startRain(0, 1000, -20, 6);
      });
      const behind = baby.pos; // 꽃·딸기는 땅에서 자라 나오니 인물·강아지·구름보다 뒤에 둔다
      const sprout = (key, x, y, s = 1, ms = 600) => {
        const p = put(T, key, PX(x), y, { s }); T.world.insertBefore(p.pos, behind);
        p.body.animate([{ transform: 'scale(.2)' }, { transform: 'scale(1)' }], { duration: ms, easing: 'cubic-bezier(.3,1.6,.5,1)' });
        return p;
      };
      const plant = (k, x, y, s) => sprout(one(T, 'prop_' + (FLW.includes(k) ? 'flower_' + k : k), PH[k]), x, y, s);
      // 1) 새싹 다섯: 가운데 → 양옆 → 바깥. 새싹 → 꽃봉오리 → 꽃 세 겹을 한 배우에 담아 morph
      const ORDER = [[505, 'sunflower'], [354, 'tulip_red'], [657, 'tulip_yellow'], [203, 'daisy_white'], [809, 'cosmos_pink']];
      const buds = ORDER.map(([x, k], i) => mk(T, { s0: ['prop_sprout', 90], s1: [i ? 'prop_flower_bud_mix' : 'prop_bud', i ? PH.bud_mix : 120], s2: ['prop_flower_' + k, PH[k]] }, false));
      await sleep(600);
      buds.forEach((b, i) => setTimeout(() => { sprout(b, ORDER[i][0], HOLE, 1); b.look('s0'); }, i * 120));
      popSfx(T); T.pop(PX(505), HOLE - 150, tr('쑥!'), '#5B9A4A');
      sfx('whistle_up', .4);
      await say('비 맞은 땅에서 새싹이 쑥!');
      // 2) 꽃: 꽃이 피는 순간 비가 그친다. 가운데 해바라기 먼저, 넷은 가운데에서 바깥으로
      stopRain();
      buds.forEach(b => morph(b, 's1', 400));
      await sleep(450);
      morph(buds[0], 's2');
      buds.slice(1).forEach((b, i) => setTimeout(() => morph(b, 's2'), 300 + i * 140));
      T.pop(PX(505), HOLE - 190, tr('활짝!'), '#E36B5C');
      // 땅에서 바로 피는 열 송이: 뒷줄 여섯(0.85배) + 발 아래 띠 넷, 가운데에서 양옆으로 번지듯
      const FILL = [[430, BACK, 'wild_purple', .85], [580, BACK, 'tulip_pink', .85], [280, BACK, 'bell_blue', .85], [730, BACK, 'cluster_a', .85], [130, BACK, 'poppy_orange', .85], [880, BACK, 'cluster_b', .85],
        [430, FRONT, 'daisy_white', 1], [590, FRONT, 'cosmos_pink', 1], [30, FRONT, 'cluster_a', 1], [975, FRONT, 'cluster_b', 1]];
      const fill = (async () => { await sleep(800); for (const [x, y, k, sc] of FILL) { plant(k, x, y, sc); await sleep(90); } })();
      sfx('pop_appear', .6);
      await say('꽃이 활짝!');
      await fill;
      // 3) 딸기: 초록 포기 셋이 빨간 딸기 포기로 익고, 낱개 딸기·딸기꽃이 포기 사이에 톡톡
      const BUSH = [[300, 'berry_bush_b'], [700, 'berry_bush'], [880, 'berry_bush']];
      const bushes = BUSH.map(([x, k]) => { const b = mk(T, { s0: ['prop_berry_green', 110], s1: ['prop_' + k, PH[k]] }, false); sprout(b, x, FRONT + 4, 1); b.look('s0'); return b; });
      await sleep(500);
      bushes.forEach(b => morph(b, 's1'));
      const BITS = [[240, 'berry_single'], [370, 'berry_flower'], [470, 'berry_single'], [560, 'berry_flower'], [640, 'berry_single'], [770, 'berry_single']];
      (async () => { await sleep(300); for (const [x, k] of BITS) { plant(k, x, FRONT + 6, 1); await sleep(100); } })();
      T.pop(PX(700), FRONT - 170, tr('빨갛게!'), '#A93B32');
      sfx('ding_glock', .5);
      await say('딸기가 빨갛게!');
      dog.move(X(790, 610), G + 20, 900);
      await say('꿀떡이는 딸기 냄새를 킁킁.');
      morph(baby, 'wide');
      await say('아기 먹구름이 내려다봐요. "어? 다들 웃고 있네!"');
    });
    /* --- 15. 무지개 --- */
    S(async () => {
      const COL = ['#E4573D', '#F29A38', '#F6C945', '#6FAE5A', '#4A90D9', '#3F4FA0', '#8B5CB8'], NAME = ['빨강!', '주황!', '노랑!', '초록!', '파랑!', '남색!', '보라!'];
      await T.sceneCard('', () => {
        scene('15_rainbow_v2', 500); skyDrift([[90, 110, 120, .2, .9], [60, 80, 150, .75, .85]]);
        put(T, baby, X(820, 640), 150, { look: 'sorry', to: 'left' });
        put(T, nuna, X(330, 380), G, { look: 'point', to: 'right' });
        put(T, oppa, X(420, 440), G, { look: 'clap', to: 'right' });
        put(T, agi, X(500, 500), G, { look: 'jump', to: 'right' });
        put(T, dog, X(620, 580), G, { look: 'sniff', to: 'right' });
      });
      amb('birds_chirp_2', { vol: .25, dur: 4 }); // 비 갠 뒤 새소리
      await say('하늘에 커다란 무지개! "우와!"');
      // 그림 속 무지개 띠를 따라 누를 자리 (타원 호)
      const arc = el('path', { d: 'M75 400 A465 330 0 0 1 1005 400', fill: 'none', stroke: 'transparent', 'stroke-width': 250 }, T.world); // 일곱 띠 전체를 덮는다
      await T.ask('무지개를 톡톡톡… 일곱 색을 세어 봐요!', () => T.mash(arc, { count: 7, prompt: '무지개를 톡톡톡… 일곱 색을 세어 봐요!', onStep: i => {
        const t = Math.PI * (1 - (i - .5) / 7), x = 540 + 470 * Math.cos(t), y = 380 - 320 * Math.sin(t);
        sfx('marimba_' + i, .6) || popSfx(T); Narrator.speak(NAME[i - 1]); T.pop(X(x, Math.max(320, Math.min(680, x))), Math.max(70, y), tr(NAME[i - 1]), COL[i - 1]); // 한 색에 한 음
      } }));
      arc.remove();
      await sleep(500); // 저절로 (2026-10-20 톡 조작 정리)
      // 남은 비를 톡톡 다 내리면서 조금씩 작아지고 옅어져, 작은 하얀 구름만 남는다 (갑자기 하얘지지 않게)
      startRain(baby.x - 50, baby.x + 50, baby.y - 10, 8);
      const bx = baby.x, by = baby.y, s0 = baby.scale || 1;
      baby.pos.animate([{ transform: `translate(${bx}px,${by}px) scale(${s0})`, opacity: 1 }, { transform: `translate(${bx}px,${by - 10}px) scale(${s0 * .55})`, opacity: .85 }],
        { duration: 3200, easing: 'ease-in-out', fill: 'forwards' });
      morph(baby, 'white', 3200); AudioFX.sfx('sparkle') || popSfx(T);
      await say('비를 다 내린 아기 먹구름은 하얗게 변했어요.');
      await sleep(600); stopRain();
      baby.pos.getAnimations().forEach(an => an.cancel()); baby.setScale(s0 * .55); baby.place(bx, by - 10); baby.pos.style.opacity = .85;
      baby.hop(16, 400); popSfx(T, true); T.pop(baby.x, baby.y - 140, tr('퐁!'));
      await say('하얀 아기 구름이 방긋 웃어요. 퐁!');
      await T.cutImage([{ src: src('cut_rainbow'), sfx: 'sparkle', hold: 3000 }], { hold: 3000 });
      await say('"구름은 여기서 오는 거였어!"');
      await say('꿀떡이는 젖은 흙에 코를 대고 킁킁.');
    });
    /* --- 16. 집으로: 하늘엔 종이 구름이 둥실, 먼 굴뚝 김이 바람 따라 흘러 구름이 된다 ---
       2026-10-22 VISUAL_PLAN §4: 1장과 같은 길(01_road)로 열리고, 비가 온 뒤라 같은 화면이 꽃밭·딸기밭(16_road_bloom)으로 번진다 */
    S(async () => {
      let ch, c2, bloom;
      await T.sceneCard('', () => {
        scene('01_road', 500);
        bloom = el('image', { href: bgSrc('16_road_bloom'), x: -40, y: -24, width: 1080, height: 608, preserveAspectRatio: 'xMidYMid slice', opacity: 0 }, T.bg);
        skyDrift([[60, 170, 120, .1], [120, 120, 95, .45], [45, 100, 140, .7, .9], [150, 90, 110, .9, .85]]);
        ch = one(T, 'prop_chimney_far', 130); put(T, ch, X(880, 640), 330); el('rect', { x: -55, y: -130, width: 110, height: 130, fill: 'transparent' }, ch.pos);   // 누르는 자리 넓히기 (2026-10-22)
        c2 = [0, 1].map(() => { const c = one(T, 'cloud_white', 110); hide(c); return c; });
        put(T, dog, X(150, 360), G, { look: 'run', to: 'left' });
        put(T, nuna, X(300, 420), G, { look: 'walk', to: 'left' });
        put(T, oppa, X(400, 480), G, { look: 'walk', to: 'left' });
        put(T, agi, X(540, 560), G, { look: 'wave', to: 'right' }); // 왼쪽으로 가는 길에 굴뚝(오른쪽)을 돌아보며 손 흔들기: 몸과 머리가 같은 쪽을 본다
      });
      // 꽃밭으로 번지기: 배경 크로스페이드 2.4초 + 꽃 조각 3파(공장 쪽 오른쪽 → 집 쪽 왼쪽). 길(모래색) 위는 걷는 자리라 비운다
      (async () => {
        const PX = x => P ? Math.round(500 + (x - 500) * .44) : x, UP = 414, LOW = 552, behind = dog.pos;
        const plant = (k, x, y, s = 1) => {
          const p = put(T, one(T, 'prop_' + (FLW.includes(k) ? 'flower_' + k : k), PH[k]), PX(x), y, { s }); T.world.insertBefore(p.pos, behind);
          p.body.animate([{ transform: 'scale(.2)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'cubic-bezier(.3,1.6,.5,1)' });
        };
        await sleep(400);
        bloom.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2400, easing: 'ease-in-out', fill: 'forwards' });
        const WAVES = [[[975, LOW, 'tulip_red'], [960, UP, 'cosmos_pink', .85], [790, UP, 'tulip_yellow', .85], [905, LOW, 'daisy_white'], [745, LOW, 'poppy_orange']],
          [[690, UP, 'cluster_a', .85], [640, LOW, 'bell_blue'], [465, UP, 'tulip_pink', .85], [470, LOW, 'cluster_b'], [400, UP, 'sunflower', .85]],
          [[330, UP, 'wild_purple', .85], [290, LOW, 'cosmos_pink'], [190, UP, 'daisy_white', .85], [90, LOW, 'tulip_yellow'], [40, UP, 'poppy_orange', .85]]];
        for (const wave of WAVES) { for (const [x, y, k, s] of wave) { plant(k, x, y, s); await sleep(140); } await sleep(700 - 140 * 5 + 140); }
        const BERRY = [[60, 'berry_bush_b'], [950, 'berry_bush'], [140, 'berry_single'], [870, 'berry_single'], [200, 'berry_flower'], [820, 'berry_flower'], [25, 'berry_single']];
        for (const [x, k] of BERRY) { plant(k, x, LOW + 4); await sleep(100); }
      })();
      const C0 = [ch.x + 6, ch.y - 124], tgt = [[X(720, 600), 150], [X(600, 520), 120]];
      chimneyLoop(C0, [C0[0], C0[1] - 40], [C0[0] - 160, C0[1] - 70], { s0: .25, s1: .9 });
      const home = Promise.all([dog.move(X(-60, 260), G, 3800, 'linear'), nuna.move(X(160, 340), G, 4200, 'linear'), oppa.move(X(260, 400), G, 4200, 'linear')]);
      await say('삼남매는 꿀떡이랑 왔던 길로 집에 가요.');
      await T.ask('굴뚝을 톡! 안녕!', () => T.tap(ch.pos, { prompt: '굴뚝을 톡! 안녕!' }));
      for (let k = 0; k < 2; k++) { smokeToCloud(c2[k], C0, [C0[0], C0[1] - 50], tgt[k], 2400, P ? .75 : 1); T.pop(C0[0] + 40, C0[1] - 30, tr('퐁!')); await sleep(700); }
      await say('멀리 굴뚝에서 작은 구름이 퐁! 퐁!');
      agi.look('wave', 'right'); agi.hop(10, 300);
      await say('은우가 뒤를 돌아보며 손을 흔들어요. "퐁!"');
      await say('꿀떡이는 굴뚝 쪽 바람을 마지막으로 킁킁.');
      await home;
      T.finale(); sfx('party_horn', .6);
    });

    let start = 0;
    try { const q = +new URLSearchParams(location.search).get('scene'); if (q >= 1 && q <= SCENES.length) start = q - 1; } catch (e) { /* 처음부터 */ }
    allHide();
    if (start > 0) await T.curtain(true);
    for (let i = start; i < SCENES.length; i++) await SCENES[i](i === start);
    stopAmb(.8);
    return '또 놀러 와, 아기 구름아!';
  }

  Tale.mount({ title: '구름 공장', subtitle: '다현이와 이현이와 은우와 꿀떡이의 구름 공장', transition: 'page', read: true, run: T => run(Tale.api) });
})();
