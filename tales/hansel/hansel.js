/* 헨젤과 그레텔 — 목업. 산딸기를 따다 길을 잃은 남매가 빵 부스러기는 새가 먹어 버려 과자 집에 닿고,
   과자를 아끼는 심술쟁이 마녀를 꾀로 쫓아낸 뒤 오리의 도움으로 아빠 품에 돌아온다. 무서운 장면 없음(마녀는 놀라서 날아갈 뿐).
   조작은 모두 톡 · 톡톡톡(세기) · 골라요. 쓱·꾹·자유 놀이 없음. */
(() => {
  const AS = '../../assets/v3w/';
  const GROUND = 505;
  const ASP = { father: .9727, father_wood: .806, hans_walk: .5838, hans_crumb: .6747, hans_doze: .8791, hans_eat: .5029, hans_cage: .6165,
    hans_joy: .6743, gret_walk: .6396, gret_doze: .7929, gret_eat: .6471, gret_clever: .7404, gret_push: .8225, gret_duck: .7038, gret_key: .7363,
    witch_beckon: .7515, witch_grope: .9245, witch_oven: .8086, bird_peck: 1.2067, bird_crumb: 1.1685, duck_ride: 1.1204, duck_ride2: 1.1275,
    step_stand: .45, step_point: .6833, step_arms: .45, father_worry: .54, prop_pebble: 1.3467, prop_door: .6767 };
  const BGS = ['cottage', 'trail', 'glade', 'ground', 'house', 'roof', 'cage', 'oven', 'river', 'house_night', 'cottage_night'];
  const CUTS = ['bird', 'eat', 'witch', 'slam', 'duck', 'hug', 'pebbles'];
  /* 새로 그리는 그림(엿듣기·조약돌 장면). 파일이 없으면 색 도형+이름표 자리표시, 그림이 생기면 자동으로 바뀐다.
     폭/높이 비율(ASP)은 그림이 오면 그 파일에서 읽는다 — 좌표 맞추기 때 ASP 표에 숫자로 옮긴다 */
  const NEWART = { step_stand: [.55, '#9AA7B5', '새엄마'], step_point: [.8, '#9AA7B5', '새엄마'], step_arms: [.6, '#9AA7B5', '새엄마'],
    father_worry: [.8, '#C98A55', '아빠'], prop_pebble: [1.3, '#F4F6FA', ''], prop_door: [.8, '#6B4A32', '문'],
    bg_house_night: [0, '#5B4332', '집 안 밤'], bg_cottage_night: [0, '#1F2A56', '집 앞 밤'] };
  const has = {}, imgAsp = {}; /* 새 그림이 실제로 있는지, 있으면 폭/높이 */
  const aspOf = f => ASP[f] || imgAsp[f] || (NEWART[f] && NEWART[f][0]) || 1;
  /* 2026-10-23 화려한 재기획(VISUAL_PLAN.md): 장면 키(읽어 주기 BGK 포함)는 그대로, 그림만 v2·라이트박스(lb). 지붕은 그대로.
     집 안 밤 문틀(DOOR·기둥 클립)·집 앞 집·과자 집 자리는 원본과 겹쳐 확인(문틀은 같은 자리, 과자 집은 약 2% 오른쪽 — 좌표에 묶이지 않음) */
  /* 2026-10-23 사용자 결정: 숲길(trail)·빈터(glade)·숲 바닥(ground)은 옛 그림으로 되돌림(짝 소품·반딧불도 뺌) */
  const BGFILE = { cottage: 'cottage_v2', house: 'house_lb', cage: 'cage_v2', oven: 'oven_v2', river: 'river_v2', house_night: 'house_night_v2', cottage_night: 'cottage_night_lb2' };   /* 2026-10-24 사용자 결정: 그날 밤 집 앞은 주황 해 질 녘처럼 보여 달밤(남색 하늘·은빛 달, 창 등불만 주황) lb2 로 다시 그림 — 집·문·창·달 자리 같음(겹쳐 확인) */
  const LASP = { leaves_front: 1.1533, berry_bush_front: 1.07, wildflowers: 1.11, reeds: .86, mist: 4.1667, beam_herbs: 1.3433, candy_cane: 1.0583, branch_sil: 1.01, grass_sil: 3.4483, pine_sil: .4967, lollipop_sil: 1.0917 };
  const bgSrc = k => AS + 'hg_bg_' + (BGFILE[k] || k) + '.webp', cutSrc = k => AS + 'hg_cut_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const INK = '#2E241C';

  let SC = 1; /* 세로 화면(폭이 좁다)에서는 그림을 조금 줄인다 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, GROUND, g => {
      Object.entries(poses).forEach(([k, [f, h, nat, ox = 0]]) => { /* ox: 발이 그림 가운데가 아닐 때 그림을 옮기는 양(폭의 비율) — 자세를 바꿔도 서 있는 자리가 그대로 */
        const w = h * aspOf(f), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        if (NEWART[f] && !has[f]) { /* 그림 도착 전 자리표시 */
          T.el('rect', { x: -w / 2, y: -h, width: w, height: h, rx: Math.min(12, h / 4), fill: NEWART[f][1], opacity: .92 }, wrap);
          if (h > 40) T.el('text', { x: 0, y: -h / 2, 'text-anchor': 'middle', 'font-size': Math.round(h * .1), fill: INK }, wrap).textContent = NEWART[f][2];
        } else T.el('image', { href: AS + 'hg_' + f + '.webp', x: -w / 2 + ox * w, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        wrap.style.display = 'none'; looks[k] = { wrap, h, nat };
      });
    });
    a.want = 'left';
    a.turn = d => { a.want = d; a.face(looks[a.cur].nat === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const prop = (T, f, h, nat = 'left') => mk(T, { a: [f, h, nat] });
  function put(T, a, x, y = GROUND, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s * SC); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 400) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);

  function bgImage(T, key) {
    if (NEWART['bg_' + key] && !has['bg_' + key]) { /* 새 배경 도착 전 자리표시 */
      const g = T.el('g', {}, T.bg);
      T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: NEWART['bg_' + key][1] }, g);
      T.el('text', { x: 500, y: 200, 'text-anchor': 'middle', 'font-size': 40, fill: '#F6ECD8' }, g).textContent = NEWART['bg_' + key][2];
      return g;
    }
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const popSfx = T => AudioFX.sfx('pop') || T.tone([500, 800], .12, { vol: .12 });
  const clinkSfx = T => AudioFX.sfx('ding') || T.tone([900, 1300], .15, { vol: .12 });
  const REST = 700; /* 장면 끝 쉼(ms) — 빠른 전환을 원하는 의견이 있어 1.5초를 넘기지 않는다 (2026-10-22) */
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!'];

  async function run(T) {
    /* 시작 음악 (2026-10-28): 첫 장면 시작에 12초 깔고, 첫 장면 전환에서 끈다. 읽어 주기는 음량 .25 */
    const intro = (() => {
      let h = null, on = true;
      const stop = () => { on = false; try { h && h.stop(.8); h = null; } catch (e) { /* 무시 */ } };
      const go = (delay = 0) => {
        const f = () => { try { if (!on) return; const o = { vol: T.reading() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }; h = AudioFX.ambient('intro_adventure', o); if (!h) setTimeout(() => { try { if (on) h = AudioFX.ambient('intro_adventure', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
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
    try { AudioFX.preloadSfx(['intro_adventure', 'crickets_night_1', 'crickets_night_2', 'leaves_footsteps', 'birds_chirp_1', 'fire_crackle', 'stream_1', 'drum', 'ding_glock', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'sleepy_tuba', 'surprise_sting', 'comic_brass', 'latch_click', 'question', 'door_heavy_1', 'door_heavy_2', 'zip_away', 'party_horn', 'creak', 'squeak', 'crunch']); } catch (e) { /* 무시 */ }
    { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stopAmb(.5); return sc0.apply(this, a); }; } // 장면이 바뀌면 배경 소리를 끈다
    const fx = document.getElementById('fxL'); if (fx) fx.style.pointerEvents = 'none'; /* 말풍선·효과 글자는 누름을 받지 않는다 */
    const tr = T.tr;
    const P = T.viewWidth() < 990; /* 세로 화면은 가운데 좁은 폭만 보인다 */
    SC = P ? .8 : 1;
    /* 층 소품(VISUAL_PLAN §3~§12): 누름 없음. 중간 층은 T.bg(배우 뒤), 앞 가림 층은 T.fx(배우 위, 누름 없음). 세로 화면은 가운데 밖 소품을 대부분 뺀다 */
    const LY = {};
    const still = () => T.reading() && T.readInstant();
    const layer = (k, cx, y, h, { front = true, flip = false, top = false, name } = {}) => {
      const w = h * LASP[k], g = T.el('g', { style: 'pointer-events:none' }, front ? T.fx : T.bg);
      if (flip) g.setAttribute('transform', `translate(${2 * cx},0) scale(-1,1)`);
      const inner = T.el('g', { filter: 'url(#pp)' }, g);
      T.el('image', { href: AS + 'hg_layer_' + k + '.webp', x: cx - w / 2, y: top ? y : y - h, width: w, height: h, preserveAspectRatio: 'none' }, inner);
      inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = top ? '50% 0%' : '50% 100%';
      if (name) LY[name] = inner;
      return inner;
    };
    const sway = (g, deg, ms, delay = 0) => { if (!still()) g.animate([{ rotate: `${-deg}deg` }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }], { duration: ms, delay, iterations: Infinity, easing: 'ease-in-out' }); return g; };
    const wig = (name, deg = 3, ms = 500) => { const g = LY[name]; if (g && g.isConnected) g.animate([{ rotate: '0deg' }, { rotate: `${deg}deg` }, { rotate: `${-deg}deg` }, { rotate: '0deg' }], { duration: ms, composite: 'add' }); };
    const lightOn = () => { if (still()) return; const r = T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3800, fill: INK, opacity: .35, style: 'pointer-events:none' }, T.fx); r.animate([{ opacity: .35 }, { opacity: 0 }], { duration: 900, fill: 'forwards' }).onfinish = () => r.remove(); };
    const twinkles = (pts, fill, r = 3) => pts.forEach(([x, y], i) => {
      const c = T.el('circle', { cx: x, cy: y, r, fill, style: 'pointer-events:none' }, T.fx);
      if (!still()) c.animate([{ opacity: .25 }, { opacity: 1 }, { opacity: .25 }], { duration: 1500 + i * 230, delay: i * 170, iterations: Infinity });
    });
    function dress(key) {
      if (key === 'cottage_night') {   // 라이트박스: 달빛 조약돌·그날 밤
        const night = g => { if (g) g.parentNode.style.filter = 'brightness(.42) saturate(.5)'; return g; };   // 달밤 lb2: 갈색 실루엣을 거의 검은 남빛 쪽으로(따뜻한 색은 창 등불만)
        sway(night(layer('branch_sil', L(90, 300), -24, 200, { top: true })), 1, 9000);
        if (!P) night(layer('pine_sil', 975, 585, 420));
        [170, 500, 830].forEach((x, i) => night(layer('grass_sil', x, 600, 70, { flip: i === 1 })));
        lightOn(); twinkles([[560, 60], [640, 110], [860, 70], [930, 140], [470, 40], [700, 30], [800, 160], [520, 150]], '#FFF4CC');
      }
      if (key === 'cottage' && !P) { layer('wildflowers', 55, 505, 90, { front: false }); layer('wildflowers', 905, 505, 90, { front: false, flip: true }); layer('wildflowers', 985, 600, 90, { name: 'flowers' }); }
      if (key === 'house') {   // 라이트박스: 과자 집·마녀
        layer('candy_cane', L(150, 300), 505, 110, { front: false });
        if (!P) { layer('candy_cane', 820, 505, 110, { front: false, flip: true }); layer('lollipop_sil', 90, 585, 150); layer('pine_sil', 25, 585, 420); layer('pine_sil', 975, 585, 420, { flip: true }); }
        lightOn(); twinkles([[120, 60], [220, 140], [280, 50], [720, 70], [800, 150], [880, 50]], '#FFF4CC', 2.5);
      }
      if (key === 'cage' || key === 'oven') [L(180, 120), L(820, 330)].forEach((x, i) => layer('beam_herbs', x, -24, 120, { top: true, flip: i === 1, name: 'beam' + i }));
      if (key === 'river') {
        if (!P) { sway(layer('reeds', 120, 517, 170, { front: false }), 1.5, 6000); layer('reeds', 30, 600, 170, { name: 'reedL' }); layer('reeds', 970, 600, 170, { flip: true, name: 'reedR' }); }
      }
    }
    const scene = (key, cx = 500) => { T.clear(); bgImage(T, key); dress(key); camSnap(cx, 280, 1); };
    const L = (l, p) => (P ? p : l); /* 가로 값, 세로 값 */

    /* 종이로 오린 작은 그림들 (눈 없는 것만) */
    const crumbAt = (x, y) => {
      const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, T.world);
      pic('hg_crumb', x - 14, y - 12, 28, 24.7, g);
      g.animate([{ transform: 'translateY(-26px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 260, easing: 'ease-out' });
      return g;
    };
    /* 그림 한 장(v3w)을 상자에 넣는다 */
    const pic = (f, x, y, w, h, parent, extra = {}) => T.el('image', { href: AS + f + '.webp', x, y, width: w, height: h, preserveAspectRatio: 'none', ...extra }, parent);
    const candyAt = (x, y, i) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world);
      if (i % 2 === 0) pic('hg_candy_round', x - 24, y - 17, 48, 34, g); /* 동그란 사탕(양쪽 포장지) 600×426 */
      else pic('hg_candy_tri', x - 17, y - 16, 34, 31.3, g); /* 세모 사탕 600×552 */
      return g;
    };
    const STAR = (x, y, R) => Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? R * .45 : R; return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`; }).join(' ');
    /* 조약돌 반짝: 크림 별 하나가 깜빡 (그라데이션·글로우 없음). loop 면 계속, 아니면 한 번 */
    const sparkleAt = (x, y, delay = 0, loop = true) => {
      const p = T.el('polygon', { points: STAR(x + 6, y - 14, 7), fill: '#F6ECD8', opacity: 0 }, T.world);
      p.style.pointerEvents = 'none';
      p.animate([{ opacity: 0 }, { opacity: .9, offset: .5 }, { opacity: 0 }], { duration: 1100, delay, iterations: loop ? Infinity : 1, fill: 'both' });
      if (!loop) setTimeout(() => p.remove(), 1300 + delay);
      return p;
    };
    /* 열쇠: 머리 모양만 다른 금빛 열쇠(동그라미·세모·별 — 대사에 맞춰 네모 → 세모, 2026-10-29). 손가락이 닿기 쉽게 투명한 큰 칸을 깐다 */
    const keyAt = (x, y, kind) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world);
      /* 그림은 가로(머리 왼쪽)라 90도 돌려 머리를 위로 세운다. 길이 112(y-44~y+68), 폭은 그림 비율대로 */
      const len = 112, wd = len * { circle: 392 / 900, tri: 400 / 755, star: 400 / 791 }[kind];
      pic('hg_key_' + kind, -len / 2, -wd / 2, len, wd, g, { transform: `translate(${x},${y + 12}) rotate(90)` });
      T.el('rect', { x: x - 34, y: y - 48, width: 68, height: 110, fill: 'rgba(0,0,0,0)' }, g);
      return g;
    };
    const lockAt = (x, y) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world);
      pic('hg_lock', x - 32.5, y - 36, 65, 82, g); /* 475×600 */
      T.el('polygon', { points: STAR(x, y + 16, 10), fill: '#6B4A1E' }, g); /* 별 모양 구멍 표시(고르기 정답 단서)는 코드로 남긴다 */
      return g;
    };

    /* 새 그림이 있는지 먼저 확인(없으면 바로 404 라 오래 안 걸린다) */
    await Promise.all(Object.keys(NEWART).map(async f => {
      const src = f.startsWith('bg_') ? bgSrc(f.slice(3)) : AS + 'hg_' + f + '.webp', pr = T.preload(src);
      if (await pr) { has[f] = true; imgAsp[f] = pr.img.naturalWidth / pr.img.naturalHeight; }
    }));
    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...CUTS.map(k => T.preload(cutSrc(k)))];
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);

    /* 크기(CLAUDE.md §4-1, 2026-10-22 실측): 눈 조각 넓이의 제곱근 × 화면 높이 ÷ 그림 몸 높이 = 화면 눈 크기를 사람 모두 4.7 로 맞춘다
       (아빠 wood 240 기준. hans_crumb 는 그림 속 머리가 walk 보다 1.28배 커서 200 → 177, 계모 3자세 252, 아빠 worry 245) */
    const hans = mk(T, { walk: ['hans_walk', 200, 'right'], crumb: ['hans_crumb', 177, 'right'], doze: ['hans_doze', 175, 'left'], eat: ['hans_eat', 200, 'left'],
      cage: ['hans_cage', 395, 'left'], joy: ['hans_joy', 200, 'left'] });
    const gret = mk(T, { walk: ['gret_walk', 190, 'right'], doze: ['gret_doze', 170, 'left'], eat: ['gret_eat', 190, 'left'], clever: ['gret_clever', 195, 'left'],
      push: ['gret_push', 195, 'right'], key: ['gret_key', 195, 'left'] });
    const father = mk(T, { wood: ['father_wood', 240, 'right'], hug: ['father', 240, 'left'], worry: ['father_worry', 245, 'left'] });
    const step = mk(T, { stand: ['step_stand', 252, 'right'], point: ['step_point', 252, 'right', .16], arms: ['step_arms', 252, 'right'] });
    /* 배경 hg_bg_house_night 의 문틀(세계 좌표): 왼쪽 기둥 853~891, 문 구멍 위 18, 문간 바닥 378. 문짝은 오른쪽(화면 밖)에 경첩, 왼쪽 가장자리 935 까지 닫혀 문틈이 생긴다 */
    const DOOR = { post: 853, open: 891, top: 18, sill: 378, edge: 935 };
    const door = prop(T, 'prop_door', DOOR.sill - DOOR.top, 'right');
    const pebbles = [0, 1, 2, 3, 4].map(() => prop(T, 'prop_pebble', 18, 'right')); /* 다섯 개 모두 같은 크기 (원근 축소 없음) */
    [door, ...pebbles].forEach(p => { p.pos.style.pointerEvents = 'none'; }); /* 소품은 누름을 받지 않는다 */
    const witch = mk(T, { beckon: ['witch_beckon', 270, 'left'], grope: ['witch_grope', 260, 'right'], oven: ['witch_oven', 255, 'left'] });
    const bird = mk(T, { crumb: ['bird_crumb', 80, 'left'], peck: ['bird_peck', 70, 'left'] });
    const duck = mk(T, { a: ['duck_ride', 135, 'right'], b: ['duck_ride2', 135, 'right'] });

    /* ================= 읽어 주기 (docs/READ_MODE.md): 대본 read_script_el.json 의 동사 → 놀이판 연출을 감싼 얇은 함수 =================
       장면 자리·자세·크기는 놀이판 그 장면 그대로(FIX 표). 대본 좌표는 놀이판 그림과 맞지 않아 FIX 가 우선한다. */
    const READ_ACTS = (() => {
      const A = { hans, gret, father, step, witch, bird, duck };
      const LOOKMAP = { hans: { sleep: 'doze' }, gret: { sleep: 'doze' }, witch: { sleep: 'oven' } };
      const BGK = { house_night: 'house_night', cottage_night: 'cottage_night', trail: 'trail', cottage: 'cottage', glade: 'glade', ground: 'ground', house: 'house', roof: 'roof', cage: 'cage', oven: 'oven', river: 'river' };
      const CARDS = { trail: '숲길', roof: '지붕', cage: '새장' };
      const CXM = { house_night: L(500, 790), cage: L(500, 215) };
      let key = '', houseN = 0, trailN = 0, cottageN = 0, pebs = [], glints = [], keys = [], lock = null, holes = [], holeRings = [];
      const rI = () => T.readInstant();
      const nums = s => String(s).split(',').map(Number);
      const S = P ? .9 : 1;
      /* 놀이판 자리 [x, y, {look, to, s}] — 같은 set 이 두 번 나오면 번호로 구분 */
      const fixOf = (k, n) => {
        const G = GROUND;
        const t = {
          house_night: { step: [L(330, 640), G, { look: 'point', to: 'right' }], father: [L(560, 775), G, { look: 'worry', to: 'left' }], hans: [DOOR.edge - 17, DOOR.sill, { look: 'walk', to: 'left', s: .9 }] },
          cottage_night: { hans: [L(430, 400), G, { look: 'crumb', to: 'right' }] },
          trail: trailN >= 2
            ? { gret: [L(250, 400), G, { look: 'walk', to: 'right' }], hans: [L(330, 430), G, { look: 'crumb', to: 'right' }] }
            : { father: [L(180, 355), G, { look: 'wood', to: 'right', s: S }], gret: [L(330, 440), G, { look: 'walk', to: 'right' }], hans: [L(450, 520), G, { look: 'crumb', to: 'right' }] },
          cottage: cottageN >= 2 ? { hans: [L(660, 580), G, { look: 'walk', to: 'left' }], gret: [L(740, 625), G, { look: 'walk', to: 'left' }], father: [-100, G, { look: 'wood', to: 'right', s: S }] } : { step: [L(200, 345), G, { look: 'stand', to: 'right' }], gret: [L(340, 430), G, { look: 'walk', to: 'right' }], hans: [L(440, 515), G, { look: 'walk', to: 'right' }], father: [L(560, 625), G, { look: 'wood', to: 'right', s: S }] },
          glade: { hans: [L(430, 445), G, { look: 'walk', to: 'right' }], gret: [L(540, 555), G, { look: 'walk', to: 'left' }], father: [L(700, 615), G, { look: 'wood', to: 'left', s: S }] },
          ground: { hans: [L(400, 425), G, { look: 'walk', to: 'right' }], gret: [L(490, 500), G, { look: 'walk', to: 'right' }], bird: [L(640, 590), G + 10, { look: 'crumb', to: 'left' }] },
          house: houseN <= 1
            ? { hans: [L(400, 440), G, { look: 'walk', to: 'right' }], gret: [L(500, 540), G, { look: 'walk', to: 'right' }] }
            : { hans: [L(380, 420), G, { look: 'walk', to: 'right' }], gret: [L(470, 480), G, { look: 'walk', to: 'right' }], witch: [L(640, 590), G, { look: 'beckon', to: 'left' }] },
          roof: { gret: [L(390, 420), G, { look: 'eat', to: 'left' }], hans: [L(500, 520), G, { look: 'walk', to: 'left' }] },
          cage: { hans: [140, 490, { look: 'cage', to: 'left' }], gret: [L(340, 300), G, { look: 'clever', to: 'left' }] },
          oven: { hans: [L(250, 380), G, { look: 'joy', to: 'right' }], gret: [L(400, 445), G, { look: 'clever', to: 'right' }], witch: [L(760, 640), G, { look: 'grope', to: 'left' }] },
          river: { hans: [L(380, 420), G + 12, { look: 'walk', to: 'right' }], gret: [L(470, 490), G + 12, { look: 'walk', to: 'right' }], duck: [L(820, 640), 470, { look: 'a', to: 'left' }] },
        };
        return t[k] && t[k][n];
      };
      const gone = a => !a.pos.isConnected || a.pos.style.display === 'none';
      const build = k => {
        key = k; pebs = []; glints = []; keys = []; lock = null;
        stopAmb(.6);
        { const ra = { house_night: ['crickets_night_1', .15], trail: ['leaves_footsteps', .15], ground: ['birds_chirp_1', .15], oven: ['fire_crackle', .15], river: ['stream_1', .15], cottage_night: ['crickets_night_2', .15] }[k]; if (ra) { const kk = k; if (!amb(ra[0], { vol: ra[1], dur: 4, fadeIn: 1 })) setTimeout(() => { if (key === kk) amb(ra[0], { vol: ra[1], dur: 3, fadeIn: 1 }); }, 1500); } } // 장소 소리는 작게, 잠깐만
        if (k === 'house') houseN++;
        if (k === 'trail') trailN++;
        if (k === 'cottage') cottageN++;
        scene(BGK[k], CXM[k] || 500);
        if (k === 'house_night') { // 문틈 빛 띠
          T.el('rect', { x: DOOR.open, y: DOOR.top, width: DOOR.edge - DOOR.open, height: DOOR.sill - DOOR.top, fill: '#F2B366', opacity: .16, 'pointer-events': 'none' }, T.world);
        }
        if (k === 'glade') {
          [L(330, 392), L(680, 612)].forEach(bx => {
            const g = T.el('g', { filter: 'url(#pp)' }, T.world);
            pic('hg_layer_berry_bush_front', bx - 54, GROUND + 6 - 101, 108, 101, g); /* 산딸기 덤불 642×600 */
          });
        }
        if (k === 'roof') {
          holes = [[446, 108], [502, 108], [557, 108], [623, 108], [535, 150]];
          holeRings = holes.map(([x, y]) => T.el('circle', { cx: x, cy: y, r: 18, fill: 'none', stroke: '#FFD54F', 'stroke-width': 3, 'stroke-dasharray': '5 4', opacity: .6 }, T.world));
        }
        if (k === 'cage') { lock = lockAt(L(231, 209), 357); }
      };
      const posOf = (n, spec) => {
        const f = fixOf(key, n);
        if (f) return f;
        let [x, y = GROUND] = nums(spec);
        if (P) x = 500 + (x - 500) * .5;
        return [x, y, {}];
      };
      const popAt = (x, y, w) => {
        if (P) { const c = T.camera.x; x = Math.min(Math.max(x, c - 190), c + 190); }
        T.pop(x, y, tr(w));
      };
      const actorVerb = (n, a) => (op, spec) => {
        if (op === 'at') {
          const [x, y, o] = posOf(n, spec);
          put(T, a, x, y, o);
          if (n === 'hans' && key === 'house_night') { a.pos.style.pointerEvents = 'none'; }
          if (n === 'witch' && key === 'house' && houseN > 1) fadeIn(a);
          if (n === 'hans' && key === 'oven' && P) hide(a);
          return;
        }
        if (op === 'look') {
          const k = (LOOKMAP[n] && LOOKMAP[n][spec]) || spec;
          if (n === 'witch' && k === 'broom') { // 빗자루 그림이 없어 마녀 자세 그대로 하늘로 날아간다
            a.look('beckon'); a.move(a.x + 420, 90, 1000, 'ease-in'); return;
          }
          if ((n === 'hans' || n === 'gret') && k === 'doze') { a.look('doze'); a.place(a.x, GROUND + 6); return; }
          if ((n === 'hans' || n === 'gret') && k === 'walk' && key === 'glade') { a.look('walk', n === 'hans' ? 'right' : 'left'); a.place(a.x, GROUND); return; }
          if (n === 'hans' && k === 'cage') { if (key === 'cage') a.look('cage'); return; }
          if (n === 'father' && k === 'hug' && key === 'cottage') { a.look('hug'); return; }
          a.look(k); return;
        }
        if (op === 'to') { a.turn(spec); return; }
        if (op === 'hide') { hide(a); return; }
        if (op === 'hop') { a.hop(20, 300); popSfx(T); return; }
        if (op === 'fade') { fadeIn(a); return; }
        if (op === 'walk') {
          let [x, y = a.y] = nums(spec);
          if (rI()) { a.place(x, y); return; }
          if (key === 'trail' && trailN < 2 && (n === 'father' || n === 'gret' || n === 'hans')) { // 셋이 함께 뚜벅뚜벅
            const pr = a.move(a.x + L(40, 10), GROUND, 1600);
            return n === 'hans' ? pr : null;
          }
          if (key === 'trail' && n === 'father') return a.move(1150, GROUND, 2600);
          if (key === 'ground' && n === 'hans') { a.look('walk', 'right'); a.move(1100, GROUND, 1500); return; }
          if (key === 'ground' && n === 'gret') { a.look('walk', 'right'); return a.move(1200, GROUND, 1500); }
          if (key === 'cottage' && n === 'father') return a.move(L(450, 480), GROUND, 800);
          if (key === 'river' && n === 'duck') return a.move(L(640, 570), 470, 1100);
          return a.move(P ? 500 + (x - 500) * .5 : x, y, 900);
        }
      };
      const acts = {
        set(k) {
          if (rI()) { build(k); return; }
          return T.sceneCard(tr(CARDS[k] || ''), () => {
            build(k);
            if (k === 'trail') { const f = fixOf('trail', 'gret'), g = fixOf('trail', 'hans'); put(T, gret, f[0], f[1], f[2]); put(T, hans, g[0], g[1], g[2]); }
            if (k === 'cage') { const f = fixOf('cage', 'hans'), g = fixOf('cage', 'gret'); put(T, hans, f[0], f[1], f[2]); hans.setScale(SC); put(T, gret, g[0], g[1], g[2]); }
          });
        },
        cam(a) { camSnap(CXM[key] || (a === 'wide' ? 500 : (P ? +a : 500)), 280, 1); },
        pebbles(op, n) {
          if (op === 'show') {
            const PX = L([520, 575, 630, 690, 750], [470, 520, 570, 620, 660]);
            pebs = pebbles.slice();
            pebs.forEach((p, i) => put(T, p, PX[i], GROUND, { to: 'right' }));
            glints = pebs.map((p, i) => sparkleAt(PX[i], GROUND, i * 300));
            return;
          }
          if (op === 'pick') {
            glints.forEach(g => g.remove()); hans.hop(10, 240);
            pebs.forEach(async (p, i) => { await sleep(i * 180); await p.move(hans.x - 6 * SC, hans.y - 62 * SC, 320, 'ease-in'); hide(p); popSfx(T); });
            return;
          }
          if (op === 'drop') { // 걸으며 하나씩 (이어서 문장을 읽는다)
            (async () => {
              const dx = L(60, 25);
              for (let i = 0; i < +n; i++) {
                const px = hans.x - 34 * SC;
                put(T, pebbles[i], px, GROUND + 12, { to: 'right' }); fadeIn(pebbles[i], 260);
                sparkleAt(px, GROUND + 12, 0, false); popSfx(T); hans.hop(8, 220);
                await Promise.all([father.move(father.x + dx, GROUND, 400), gret.move(gret.x + dx, GROUND, 400), hans.move(hans.x + dx, GROUND, 400)]);
                await sleep(450);
              }
            })();
          }
        },
        crumbs(op, n) {
          (async () => {
            const stepX = L(110, 36); let hx = hans.x, gx = gret.x;
            for (let i = 1; i <= +n; i++) {
              crumbAt(hx - 14, 520); popSfx(T); hx += stepX; gx += stepX;
              hans.hop(10, 220); hans.move(hx, GROUND, 360); gret.move(gx, GROUND, 360);
              await sleep(520);
            }
          })();
        },
        berries(op) { hans.look('eat'); gret.look('eat'); return (async () => { await sleep(400); hans.hop(14, 300); gret.hop(14, 300); await sleep(900); hans.hop(14, 300); gret.hop(14, 300); })(); },
        candy(op, n) {
          (async () => {
            for (let i = 1; i <= +n; i++) {
              const [x, y] = holes[i - 1], sx = hans.x, sy = hans.y - 150, c = candyAt(0, 0, i - 1);
              holeRings[i - 1] && holeRings[i - 1].remove();
              c.animate([{ transform: `translate(${sx}px,${sy}px) scale(.4)` }, { transform: `translate(${x}px,${y}px) scale(1)` }], { duration: 480, easing: 'ease-out', fill: 'forwards' });
              hans.hop(12, 240); popSfx(T); await sleep(560);
            }
          })();
        },
        keys(op) {
          const kc = keyAt(L(470, 160), 440, 'circle'), ks = keyAt(L(570, 225), 440, 'tri'), kt = keyAt(L(670, 290), 440, 'star');
          keys = [kc, ks, kt];
          keys.forEach(k => k.animate([{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'translateY(0)' }], 350));
        },
        cage(op) {
          if (op !== 'open') return;
          clinkSfx(T); keys.forEach(k => k.remove());
          gret.look('key'); gret.hop(14, 300);
          return (async () => {
            await sleep(500);
            if (lock) lock.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
            put(T, hans, L(250, 215), GROUND, { look: 'joy', to: 'left' });
            hans.hop(34, 420);
          })();
        },
        oven(op) { if (op === 'slam') { gret.look('push', 'right'); sfx('door_heavy_2', .35); T.shake(); } }, // 잠자리용: 문 닫는 소리 작게
        hat(op) { // 모자가 휙 (오린 검은 종이 모자)
          const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, T.world);
          const x = witch.x, y = witch.y - 240;
          pic('hg_witch_hat', x - 48, y - 72, 96, 82, g); /* 마녀 모자 600×512 */
          g.style.transformBox = 'fill-box'; g.style.transformOrigin = '50% 50%'; /* 모자 제자리에서 돈다(전에는 화면 원점 기준으로 돌아 발밑으로 갔다) */
          g.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: 'translate(160px,-170px) rotate(300deg)', opacity: 0 }], { duration: 1000, easing: 'ease-out', fill: 'forwards' });
          setTimeout(() => g.remove(), 1100);
        },
        door(op) { // 문짝과 기둥 (헨젤이 문틈으로 엿보도록 기둥은 헨젤 앞에)
          const defs = T.el('defs', {}, T.world), cp = T.el('clipPath', { id: 'hgPost', clipPathUnits: 'userSpaceOnUse' }, defs);
          T.el('rect', { x: DOOR.post, y: DOOR.top - 40, width: DOOR.open - DOOR.post, height: DOOR.sill + 20 - DOOR.top + 40 }, cp);
          T.el('image', { href: bgSrc('house_night'), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none', 'clip-path': 'url(#hgPost)', 'pointer-events': 'none' }, T.world);
          put(T, door, DOOR.edge + (DOOR.sill - DOOR.top) * aspOf('prop_door') / 2, DOOR.sill, { to: 'left', s: 1 / SC });
        },
        cut(k) {
          const HOLD = { pebbles: 2600, bird: 2600, eat: 2600, witch: 2600, slam: 2600, duck: 2600, hug: 3000 };   /* 2026-10-29 컷 멈춤 줄임(3200~3600 → 2600, 껴안기 3000) */
          if (k === 'eat') { gret.look('eat'); hans.look('eat'); AudioFX.sfx('crunch') || popSfx(T); gret.hop(16, 300); }
          if (k === 'bird') bird.look('peck');
          if (k === 'duck') duck.look('b');
          const pr = T.cutImage([{ src: cutSrc(k), sfx: k === 'slam' ? 'door_heavy_2' : 'pop', hold: HOLD[k] || 2600 }], { hold: HOLD[k] || 2600 });
          if (k === 'hug') return pr.then(() => { // 안아 올린 뒤 모두 모인 자리
            put(T, father, 500, GROUND, { look: 'hug', to: 'left' });
            put(T, hans, L(400, 440), GROUND, { look: 'joy', to: 'left' }); put(T, gret, L(600, 565), GROUND, { look: 'clever', to: 'left' });
          });
          return pr;
        },
        fx(n) {
          if (n === 'boom') sfx('door_heavy_2', .35);
          else if (n === 'whoosh') AudioFX.sfx('whoosh');
          else if (n === 'click' || n === 'sparkle') clinkSfx(T);
          else popSfx(T);
        },
        shake() {
          T.shake();
          if (key === 'oven' && witch.x > L(700, 600)) witch.move(L(640, 585), GROUND, 1000); // 마녀가 쿵쿵 걸어온다
        },
        pop(spec) { const a = String(spec).split(','); popAt(+a[0], +a[1], a.slice(2).join(',')); },
      };
      Object.keys(A).forEach(n => { acts[n] = actorVerb(n, A[n]); });
      const dv = acts.duck;
      acts.duck = (op, spec) => {
        if (op === 'cross') {
          (async () => {
            put(T, hans, hans.x, hans.y, { look: 'walk', to: 'right' }); put(T, gret, gret.x, gret.y, { look: 'walk', to: 'right' });
            await Promise.all([hans.move(duck.x - 22, GROUND + 12, 700), gret.move(duck.x + 22, GROUND + 12, 700)]);
            hans.setScale(.55 * SC); gret.setScale(.55 * SC); hans.place(hans.x, 428); gret.place(gret.x, 428);
            const tx = L(780, 600);
            duck.turn('right');
            await Promise.all([duck.move(tx, 330, 2600), hans.move(tx - 22, 290, 2600), gret.move(tx + 22, 290, 2600)]);
            await Promise.all([hans.move(tx - 22 + 50, 250, 700), gret.move(tx + 22 + 50, 250, 700)]);
          })();
          return;
        }
        return dv(op, spec);
      };
      return acts;
    })();
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

    /* --- 1. 집 안 밤: 문틈으로 엿듣기 --- */
    scene('house_night', L(500, 790)); /* 세로 화면은 오른쪽 끝(문틀)까지 보이게 */
    put(T, step, L(330, 640), GROUND, { look: 'stand', to: 'right' }); /* 계모 ↔ 아빠 마주 봄 */
    put(T, father, L(560, 775), GROUND, { look: 'worry', to: 'left' });
    /* 문틈 빛 띠: 문 구멍 위에서 문간 바닥까지(떠 있지 않게), 기둥과 문짝 사이 틈에만 */
    T.el('rect', { x: DOOR.open, y: DOOR.top, width: DOOR.edge - DOOR.open, height: DOOR.sill - DOOR.top, fill: '#F2B366', opacity: .16, 'pointer-events': 'none' }, T.world); /* 등잔 빛(앰버) */
    /* 헨젤은 문 너머 방(벽 면, 조금 멀어 .9)에 서서 왼쪽 어른들을 본다 — 얼굴 앞쪽만 틈에 보이고 뒤통수·몸 뒤는 문짝에 가린다 */
    put(T, hans, DOOR.edge - 17, DOOR.sill, { look: 'walk', to: 'left', s: .9 });
    { /* 왼쪽 기둥을 배경에서 오려 헨젤 앞에 다시 얹는다(헨젤이 기둥 앞으로 튀어나오지 않게) */
      const defs = T.el('defs', {}, T.world), cp = T.el('clipPath', { id: 'hgPost', clipPathUnits: 'userSpaceOnUse' }, defs);
      T.el('rect', { x: DOOR.post, y: DOOR.top - 40, width: DOOR.open - DOOR.post, height: DOOR.sill + 20 - DOOR.top + 40 }, cp);
      T.el('image', { href: bgSrc('house_night'), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none', 'clip-path': 'url(#hgPost)', 'pointer-events': 'none' }, T.world);
    }
    put(T, door, DOOR.edge + (DOOR.sill - DOOR.top) * aspOf('prop_door') / 2, DOOR.sill, { to: 'left', s: 1 / SC }); /* 배경 문틀에 맞춘 크기라 세로 화면에서도 줄이지 않는다. 손잡이는 틈 쪽 */
    await T.curtain(true);
    amb('crickets_night_1', { vol: .25, dur: 4 }); // 깊은 밤 귀뚜라미
    intro.go(); // 시작 음악 (놀이)
    await say('옛날 옛날에 숲 옆 작은 집에 헨젤과 그레텔이 살았어요.');
    await say('그런데 집에는 먹을 것이 점점 떨어져, 찬장이 텅텅 비었지요.');
    await say('헨젤과 그레텔은 밤마다 배가 꼬르륵꼬르륵 울었어요.');
    await say('어느 날 밤, 헨젤은 문틈으로 엿들었어요.');
    step.look('point'); step.hop(8, 300);
    await say('"먹을 게 없어요. 내일 아이들을 숲에 두고 와요." 새엄마가 말했어요.');
    step.look('arms'); father.hop(6, 300);
    await say('"음… 아이들이 가엾은데…" 아빠는 망설였어요.');
    await sleep(300); hans.hop(6, 260); /* 헨젤이 깜짝 — 들었어요 */
    sfx('drum', .25); // 콩닥, 작은 북으로
    await say('헨젤은 가슴이 콩닥콩닥 뛰었어요. 그래도 꼭 참고 생각했지요.');
    hans.hop(6, 260);
    sfx('ding_glock', .5); // 좋은 생각
    await say('"그래, 좋은 생각이 났어!" 헨젤이 작게 속삭였어요.');
    await sleep(300);

    /* --- 2. 달빛 조약돌: 톡 한 번으로 조약돌 다섯 개가 저절로 --- */
    const PX = L([520, 575, 630, 690, 750], [470, 520, 570, 620, 660]);
    T.cardSpeed(.7); /* 첫 조작을 30초 안에 */
    await T.sceneCard(tr('달빛 조약돌'), () => {
      scene('cottage_night');
      put(T, hans, L(430, 400), GROUND, { look: 'crumb', to: 'right' });
      pebbles.forEach((p, i) => put(T, p, PX[i], GROUND, { to: 'right' }));
    }, hans.pos);
    T.cardSpeed(1);
    const glints = pebbles.map((p, i) => sparkleAt(PX[i], GROUND, i * 300));
    await say('헨젤은 살금살금 밖으로 나왔어요. 달빛에 조약돌이 반짝반짝!');
    await T.ask('헨젤을 톡! 조약돌을 주워요.', () => T.tap(hans.pos, { prompt: '헨젤을 톡! 조약돌을 주워요.' })); /* 안내 도중에도 눌린다 (첫 조작 30초 안) */
    hans.hop(10, 240); glints.forEach(g => g.remove());
    const picking = say('헨젤은 하얀 조약돌을 하나, 또 하나, 주머니에 쏙쏙 넣었어요.'); /* 조약돌이 날아드는 동안 읽는다 */
    await Promise.all(pebbles.map(async (p, i) => {
      await sleep(i * 180);
      await p.move(hans.x - 6 * SC, hans.y - 62 * SC, 320, 'ease-in'); /* 반바지 주머니 자리 */
      hide(p); popSfx(T);
    }));
    T.pop(hans.x + 40, hans.y - 265, tr('쏙!')); /* 머리 위로 비켜서(얼굴을 가리지 않게) */
    await picking;
    hans.turn('left'); /* 집 쪽으로 돌아선다 */
    await sleep(500);
    await say('헨젤은 조약돌을 주머니에 가득 채웠어요. "이제 괜찮아."');
    hans.look('walk', 'left'); await hans.move(hans.x - L(150, 90), GROUND, 1200); /* 살금살금 집으로 (가는 쪽을 본다) */
    await sleep(300);

    /* --- 3. 조약돌 길: 조약돌을 떨어뜨리고, 밤에 달빛을 따라 돌아와요 --- */
    await T.sceneCard(tr('조약돌 길'), () => {
      scene('trail');
      put(T, father, L(180, 355), GROUND, { look: 'wood', to: 'right', s: P ? .9 : 1 });
      put(T, gret, L(330, 440), GROUND, { look: 'walk', to: 'right' });
      put(T, hans, L(450, 520), GROUND, { look: 'crumb', to: 'right' });
    }, hans.pos);
    await say('다음 날, 아빠는 둘을 데리고 숲 깊은 곳으로 갔어요.');
    const walkIn = Promise.all([father, gret, hans].map(a => a.move(a.x + L(40, 10), GROUND, 1600))); /* 뚜벅뚜벅 — 조금만 더 걸어도 다섯 걸음 뒤 셋 다 화면 안 */
    amb('leaves_footsteps', { vol: .25, dur: 4 }); // 낙엽 바스락
    await say('뚜벅뚜벅, 셋은 숲속 깊이 들어갔어요. 나뭇잎이 바스락바스락 소리를 냈지요.');
    await walkIn;
    const dropAuto = (async () => {
      const dx = L(60, 25); /* 다섯 걸음 뒤에도 셋 다 화면 안 */
      for (let i = 0; i < 5; i++) {
        const px = hans.x - 34 * SC; /* 헨젤 발 뒤, 길 위 */
        put(T, pebbles[i], px, GROUND + 12, { to: 'right' }); fadeIn(pebbles[i], 260);
        sparkleAt(px, GROUND + 12, 0, false); popSfx(T); T.pop(px, i % 2 ? 120 : 95, tr('반짝!')); /* 머리 위 하늘(인물을 가리지 않게) */
        hans.hop(8, 220);
        await Promise.all([father.move(father.x + dx, GROUND, 400), gret.move(gret.x + dx, GROUND, 400), hans.move(hans.x + dx, GROUND, 400)]);
        await sleep(450);
      }
    })();
    await say('헨젤은 조약돌을 하나씩 살짝 떨어뜨렸어요.');
    await dropAuto;
    hans.look('walk', 'right');
    const leave = father.move(1150, GROUND, 2600);
    await say('아빠는 둘을 숲에 남겨 두고 돌아갔어요.');
    await leave;
    /* 둘러보기: 아빠가 안 보여요 — 뒤(왼쪽)를 봤다가 다시 앞으로 */
    await sleep(300); hans.turn('left'); gret.turn('left'); await sleep(800); hans.turn('right'); gret.turn('right'); await sleep(400);
    gret.hop(10, 260);
    await say('"아빠? 아빠!" 그레텔이 불러 봤지만, 숲은 조용했어요.');
    /* 밤: 컷 위에서 읽는다 (그림이 없으면 밤 집 앞 장면에서 읽는다) */
    const N11 = '밤이 되자 조약돌이 달빛에 반짝반짝 빛났어요. 둘은 조약돌을 따라 집으로 돌아왔어요.';
    const N11b = '"저기 우리 집이야!" 헨젤이 소리쳤어요. 그레텔은 폴짝폴짝 뛰었지요.';
    if (await T.preload(cutSrc('pebbles'))) {
      const cp = document.getElementById('cutPanel'); let sp;
      await T.cutImage([{ src: cutSrc('pebbles'), sfx: 'pop', hold: 60000 }], { hold: 60000, onShow: () => {
        sp = say(N11).then(() => say(N11b)).then(() => sleep(500)).then(() => { if (cp.onpointerdown) cp.onpointerdown({ stopPropagation() {} }); });
      } });
      await sp;
    } else {
      scene('cottage_night');
      put(T, gret, L(300, 400), GROUND, { look: 'walk', to: 'right' }); put(T, hans, L(380, 440), GROUND, { look: 'walk', to: 'right' });
      const home = Promise.all([gret.move(L(520, 520), GROUND, 4000), hans.move(L(600, 570), GROUND, 4000)]);
      await say(N11); await home; gret.hop(14, 300); await say(N11b);
    }

    /* --- 4. 집 앞: 또 숲에 가요 --- */
    await T.sceneCard(tr('집 앞'), () => {
      scene('cottage');
      put(T, step, L(200, 345), GROUND, { look: 'stand', to: 'right' }); /* 집 문 옆에서 아이들을 본다 */
      put(T, gret, L(340, 430), GROUND, { look: 'walk', to: 'right' });
      put(T, hans, L(440, 515), GROUND, { look: 'walk', to: 'right' });
      put(T, father, L(560, 625), GROUND, { look: 'wood', to: 'right', s: P ? .9 : 1 });
    }, hans.pos);
    await say('하지만 얼마 뒤, 새엄마가 또 아이들을 숲에 두고 오자고 했어요.');
    await say('이번엔 밤에 문이 잠겨서, 조약돌을 주울 수 없었어요.');
    await say('"얘들아, 숲에 산딸기 따러 가자!" 아빠가 말했어요.');
    await say('헨젤은 빵 부스러기로 길을 표시하기로 했어요.');
    popSfx(T); hans.hop(20, 300);
    await Promise.all([gret.move(gret.x + 50, GROUND, 900), hans.move(hans.x + 50, GROUND, 900), father.move(father.x + 50, GROUND, 900)]);

    /* --- 2. 숲길: 빵 부스러기 세기 --- */
    await T.sceneCard(tr('숲길'), () => {
      scene('trail');
      put(T, gret, L(250, 400), GROUND, { look: 'walk', to: 'right' });
      put(T, hans, L(330, 430), GROUND, { look: 'crumb', to: 'right' });
    }, hans.pos);
    const stepX = L(110, 36);
    let hx = hans.x, gx = gret.x;
    await T.ask('헨젤이 빵 부스러기를 하나씩 떨어뜨려요. 같이 세어 봐요!', () => T.mash(hans.pos, { count: 5, prompt: '헨젤을 톡톡톡톡톡! 부스러기를 세어요.', onStep: i => {
      const cx = hx - 14;
      crumbAt(cx, 520); sfx('marimba_' + i, .6) || popSfx(T); T.pop(cx, i % 2 ? 260 : 200, tr(NUM[i - 1])); // 한 개에 한 음
      hx += stepX; gx += stepX;
      hans.hop(10, 220); hans.move(hx, GROUND, 360); gret.move(gx, GROUND, 360);
    } }));
    await say('빵 부스러기가 하나, 둘, 셋, 넷, 다섯! 길이 생겼어요.');
    await say('부스러기가 콩콩, 길게 줄을 이었지요.');

    /* --- 3. 빈터: 졸려서 잠들고 길을 잃어요 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('빈터'), () => {
      scene('glade');
      put(T, hans, L(430, 445), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(540, 555), GROUND, { look: 'walk', to: 'left' });
    }, hans.pos);
    [L(330, 392), L(680, 612)].forEach(bx => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world);
      pic('hg_layer_berry_bush_front', bx - 54, GROUND + 6 - 101, 108, 101, g); /* 산딸기 덤불 642×600 */
      g.animate([{ opacity: 0 }, { opacity: 1 }], 500);
    });
    put(T, hans, L(430, 445), GROUND, { look: 'eat', to: 'right' }); put(T, gret, L(540, 555), GROUND, { look: 'eat', to: 'left' });
    const eating = (async () => { await sleep(900); hans.hop(14, 300); gret.hop(14, 300); await sleep(900); hans.hop(14, 300); gret.hop(14, 300); })();
    await say('빈터에는 빨간 산딸기가 가득했어요. 둘은 냠냠 따 먹었어요.');
    await eating;
    await say('아삭아삭, 새콤달콤! 손가락이 빨갛게 물들었어요.');
    gret.hop(12, 300);
    await say('"오빠, 이것도 먹어 봐!" 그레텔이 제일 큰 산딸기를 건넸어요.');
    hans.hop(12, 300);
    sfx('sleepy_tuba', .5);
    await say('배가 부르니 졸려서 둘은 나무 밑에서 깜빡 잠이 들었어요.');
    put(T, hans, L(430, 445), GROUND + 6, { look: 'doze' }); put(T, gret, L(540, 555), GROUND + 6, { look: 'doze' });
    await sleep(900);
    AudioFX.animal('owl', .3); // 밤 숲 부엉부엉
    await say('눈을 떠 보니 아빠가 보이지 않았어요. 둘은 길을 잃었어요.');
    put(T, hans, L(430, 445), GROUND, { look: 'walk', to: 'right' }); put(T, gret, L(540, 555), GROUND, { look: 'walk', to: 'left' });
    await say('그레텔은 마음이 조금 무서웠어요.');
    await say('"오빠, 무서워…" 그레텔이 헨젤의 손을 꼭 잡았어요.');
    await sleep(700); /* 저절로 */
    popSfx(T); gret.hop(14, 300); hans.move(gret.x - L(46, 40), GROUND, 420); T.pop(gret.x, gret.y - 215, tr('꼭!'));
    [-26, 0, 26].forEach((dx, k) => { const h = T.el('g', { 'pointer-events': 'none', transform: `translate(${gret.x + dx - 22},${gret.y - 150})` }, T.world); pic('wc_prop_fx_heart', -15, -17, 30, 27, h);
      h.animate([{ translate: '0 0', opacity: 0 }, { opacity: 1, offset: .2 }, { translate: `${dx / 2}px -60px`, opacity: 0 }], { duration: 1100, delay: k * 140, easing: 'ease-out', fill: 'both' }); setTimeout(() => h.remove(), 1600); });
    await say('"괜찮아, 빵 부스러기 길을 따라가자!" 헨젤이 말했어요.');

    /* --- 4. 땅바닥: 새가 부스러기를 먹었어요 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('숲 바닥'), () => {
      scene('ground');
      put(T, hans, L(400, 425), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(490, 500), GROUND, { look: 'walk', to: 'right' });
    }, hans.pos);
    amb('birds_chirp_1', { vol: .22, dur: 3 }); // 작은 새
    await say('그런데 이상해요. 빵 부스러기가 하나도 없어요!');
    hans.turn('left'); /* 두리번두리번 — 헨젤은 뒤쪽, 그레텔은 앞쪽 */
    await say('둘은 두리번두리번, 땅바닥을 샅샅이 살폈어요.');
    hans.turn('right');
    put(T, bird, L(640, 590), GROUND + 10, { look: 'crumb', to: 'left' }); fadeIn(bird);
    await say('작은 새가 빵 부스러기를 물고 있어요.');
    await sleep(700); /* 저절로 */
    bird.hop(18, 300); AudioFX.sfx('squeak') || popSfx(T); T.pop(bird.x, bird.y - 110, tr('짹짹!'));
    await T.cutImage([{ src: cutSrc('bird'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    scene('ground');
    put(T, hans, L(400, 425), GROUND, { look: 'walk', to: 'right' }); put(T, gret, L(490, 500), GROUND, { look: 'walk', to: 'right' });
    put(T, bird, L(640, 590), GROUND + 10, { look: 'peck', to: 'left' });
    await say('"짹짹! 맛있어서 내가 다 먹었어!" 새가 말했어요.');
    gret.hop(12, 300);
    await say('"아이고, 우리 길이 없어졌네!" 그레텔이 울상을 지었어요.');
    const flyOff = bird.move(bird.x + L(140, 60), 150, 1000).then(() => hide(bird)); /* 포르르 — 오른쪽 위 하늘로 */
    await say('새는 포르르, 하늘로 날아가 버렸어요.');
    await flyOff;
    await say('헨젤은 눈물이 글썽했지만 그레텔의 손을 꼭 잡고 걸었어요.');

    /* --- 5. 과자 집 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('과자 집'), () => {
      scene('house');
      put(T, hans, L(400, 440), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(500, 540), GROUND, { look: 'walk', to: 'right' });
    }, gret.pos);
    sfx('ding_glock', .5); // 과자 집 발견
    await say('그때 달콤한 냄새가 솔솔 났어요. 앗, 과자 집이에요!');
    await say('벽은 쿠키, 지붕은 사탕이에요.');
    await sleep(700); /* 저절로 냠냠 */
    gret.look('eat'); hans.look('eat'); AudioFX.sfx('crunch') || popSfx(T); gret.hop(16, 300); T.pop(gret.x, gret.y - 215, tr('냠냠!'));
    await T.cutImage([{ src: cutSrc('eat'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    hans.hop(12, 300); setTimeout(() => gret.hop(12, 300), 500);
    await say('헨젤은 쿠키 벽을 와삭, 그레텔은 사탕 지붕을 오도독 깨물었어요.');
    await say('너무 맛있어서 둘은 배가 빵빵해졌어요.');

    /* --- 6. 지붕: 사탕 세기 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('지붕'), () => {
      scene('roof');
      put(T, gret, L(390, 420), GROUND, { look: 'eat', to: 'left' });
      put(T, hans, L(500, 520), GROUND, { look: 'walk', to: 'left' });
    }, hans.pos);
    /* 지붕 그림의 빈 구멍 다섯 곳(세계 좌표): 위 줄 넷, 아래 한 곳 */
    const HOLES = [[446, 108], [502, 108], [557, 108], [623, 108], [535, 150]];
    const holeRing = HOLES.map(([x, y]) => T.el('circle', { cx: x, cy: y, r: 18, fill: 'none', stroke: '#FFD54F', 'stroke-width': 3, 'stroke-dasharray': '5 4', opacity: .0 }, T.world));
    holeRing.forEach(c => c.animate([{ opacity: .35 }, { opacity: .95 }, { opacity: .35 }], { duration: 1200, iterations: Infinity }));
    await T.ask('지붕에 사탕이 빠진 곳이 있어요. 헨젤이 하나씩 붙여 줘요. 같이 세어 봐요!', () => T.mash(hans.pos, { count: 5, prompt: '헨젤을 톡톡톡톡톡! 사탕을 세어요.', onStep: i => {
      try { Narrator.hideBubble(); } catch (e) { /* 자막이 지붕 사탕 자리를 가리지 않게 누르는 동안은 숨긴다 */ }
      const [x, y] = HOLES[i - 1], sx = hans.x, sy = hans.y - 150, c = candyAt(0, 0, i - 1);
      holeRing[i - 1].remove();
      c.animate([{ transform: `translate(${sx}px,${sy}px) scale(.4)` }, { transform: `translate(${x}px,${y}px) scale(1)` }], { duration: 480, easing: 'ease-out', fill: 'forwards' });
      hans.hop(12, 240); sfx('marimba_' + i, .6) || popSfx(T); setTimeout(() => T.pop(x + 34, y + 44, tr(NUM[i - 1])), 400);   /* 숫자는 사탕 오른쪽 아래(사탕을 가리지 않게) */
    } }));
    await say('사탕이 하나, 둘, 셋, 넷, 다섯! 지붕이 예뻐졌어요.');

    /* --- 7. 마녀 할머니 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('마녀'), () => {
      scene('house');
      put(T, hans, L(380, 420), GROUND, { look: 'walk', to: 'right' });
      put(T, gret, L(470, 480), GROUND, { look: 'walk', to: 'right' });
    }, hans.pos);
    put(T, witch, L(640, 590), GROUND, { look: 'beckon', to: 'left' }); fadeIn(witch);
    sfx('creak', .8);
    await say('그때 문이 열리고 마녀 할머니가 나왔어요.');
    await T.cutImage([{ src: cutSrc('witch'), sfx: 'surprise_sting', hold: 2600 }], { hold: 2600 });
    await say('"내 과자 집을 누가 먹었니!" 마녀가 투덜거렸어요.');
    await say('마녀는 과자를 아끼는 심술쟁이 할머니였어요.');
    witch.hop(10, 260); setTimeout(() => witch.hop(10, 260), 400); /* 발을 쿵쿵 */
    sfx('comic_brass', .6); // 심술쟁이 마녀
    await say('"내 사탕! 내 쿠키! 으으, 아까워라!" 마녀는 발을 쿵쿵 굴렀어요.');
    await say('"죄송해요. 배가 너무 고팠어요." 헨젤이 작은 목소리로 말했어요.');
    hans.look('cage'); hans.place(hans.x, GROUND); hans.setScale(.55 * SC); hans.hop(14, 320); popSfx(T);
    sfx('latch_click', .7);
    await say('마녀는 헨젤을 새장에 쏙 넣어 버렸어요. "과자 값을 낼 때까지 여기 있어!"');
    gret.hop(10, 260);
    await say('그레텔은 눈물이 그렁그렁했어요. "오빠, 내가 꼭 꺼내 줄게!"');

    /* --- 8. 새장: 별 열쇠 고르기 --- */
    const CX = L(500, 215);
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('새장'), () => {
      scene('cage', CX);
      put(T, hans, 140, 490, { look: 'cage', to: 'left', s: 1 });
      put(T, gret, L(340, 300), GROUND, { look: 'clever', to: 'left' });
    }, hans.pos);
    hans.setScale(SC); /* 새장 그림 하나를 배경의 새장 자리에 맞춘다 */
    const lock = lockAt(L(231, 209), 357);
    await say('그레텔은 마녀가 낮잠을 자는 사이에 열쇠 세 개를 가져왔어요.');
    const kc = keyAt(L(470, 160), 440, 'circle'), ks = keyAt(L(570, 225), 440, 'tri'), kt = keyAt(L(670, 290), 440, 'star');
    const keys = [kc, ks, kt];
    keys.forEach(k => k.animate([{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'translateY(0)' }], 350));
    await say('동그라미, 세모, 별 모양. 그레텔은 자물쇠 구멍을 요리조리 살펴보았어요.');
    sfx('question', .6);
    await T.ask('새장 자물쇠에는 별 모양 구멍이 있어요. 별 모양 열쇠를 톡!', () => T.choose([{ key: 'c', el: kc, ok: false }, { key: 's', el: ks, ok: false }, { key: 't', el: kt, ok: true }],
      { prompt: '별 모양 열쇠를 톡!', where: '열쇠 머리 모양을 잘 봐요.', who: '반짝이는 별 열쇠를 톡!' }));
    clinkSfx(T); kc.remove(); ks.remove(); kt.remove();
    gret.look('key'); gret.hop(14, 300); T.pop(L(251, 224), L(170, 317), tr('찰칵!'));
    await sleep(500);
    lock.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
    put(T, hans, L(250, 215), GROUND, { look: 'joy', to: 'left' });
    hans.hop(34, 420);
    sfx('latch_click', .7);
    await say('찰칵! 새장이 열렸어요. 헨젤이 폴짝 뛰어나왔어요!');
    await say('"고마워, 그레텔!" 헨젤이 말했어요.');

    /* --- 9. 화덕: 꾀로 마녀를 쫓아요 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('화덕'), () => {
      scene('oven');
      put(T, hans, L(250, 380), GROUND, { look: 'joy', to: 'right' });
      put(T, gret, L(400, 445), GROUND, { look: 'clever', to: 'right' });
      put(T, witch, L(760, 640), GROUND, { look: 'grope', to: 'left' });
      if (P) hide(hans);
    }, gret.pos);
    await witch.move(L(640, 585), GROUND, 1000);
    amb('fire_crackle', { vol: .25, dur: 4 }); // 화덕 타닥
    await say('그때 마녀가 일어나 쿵쿵 걸어왔어요. 눈이 나빠서 더듬더듬 찾았어요.');
    await say('그레텔은 꾀가 났어요. "마녀님, 화덕 안에 반짝이는 게 있어요!"');
    const stride = witch.move(witch.x - L(40, 20), GROUND, 900); /* 성큼성큼 화덕 쪽으로 */
    await say('"반짝이는 거? 어디, 어디?" 마녀는 화덕 쪽으로 성큼성큼 갔어요.');
    await stride;
    witch.look('oven', 'left'); witch.hop(10, 300);
    await T.ask('마녀가 화덕 안을 들여다봐요. 그레텔을 톡! 화덕 문을 쾅 밀어요.', () => T.tap(gret.pos, { prompt: '그레텔을 톡! 쾅 밀어요.' }));
    gret.look('push', 'right'); sfx('door_heavy_2', .8); T.shake(); wig('beam0', 3, 700); wig('beam1', 3, 700); T.pop(L(500, 500), 330, tr('쾅!')); /* 2026-10-20 쾅 소리 */
    await T.cutImage([{ src: cutSrc('slam'), sfx: null, hold: 2600 }], { hold: 2600 });
    await say('쾅! 마녀는 깜짝 놀라 모자가 휙 날아갔어요.');
    scene('oven');
    put(T, hans, L(300, 380), GROUND, { look: 'joy', to: 'right' }); put(T, gret, L(440, 480), GROUND, { look: 'clever', to: 'right' });
    if (P) hide(hans);
    await say('마녀는 빗자루를 타고 굴뚝으로 휘리릭 날아갔어요. "다시는 안 올게~!"');
    sfx('zip_away', .6) || AudioFX.sfx('whoosh'); T.pop(L(500, 500), 300, tr('휘리릭!'));
    gret.hop(24, 400); hans.hop(24, 400);
    await say('"휴, 이제 집으로 가자!" 헨젤이 그레텔의 손을 잡았어요.');

    /* --- 10. 강: 오리의 등 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('강'), () => {
      scene('river');
      put(T, hans, L(380, 420), GROUND + 12, { look: 'walk', to: 'right' });
      put(T, gret, L(470, 490), GROUND + 12, { look: 'walk', to: 'right' });
    }, hans.pos);
    amb('stream_1', { vol: .25, dur: 4 }); // 강물 졸졸
    await say('집으로 가는 길에 넓은 강이 나왔어요. 다리가 없어요!');
    await say('강물이 콸콸, 세차게 흘렀어요.');
    gret.hop(10, 260); setTimeout(() => gret.hop(10, 260), 400); /* 발을 동동 */
    await say('"어떡하지? 우리는 헤엄을 못 치는데." 그레텔이 발을 동동 굴렀어요.');
    put(T, duck, L(820, 640), 470, { look: 'a', to: 'left' }); fadeIn(duck);
    await duck.move(L(640, 570), 470, 1100);
    await say('그때 흰 오리가 헤엄쳐 왔어요.');
    await sleep(700); /* 저절로 */
    duck.look('b'); duck.hop(14, 300); AudioFX.animal('duck', .5) || AudioFX.sfx('squeak') || popSfx(T); wig('reedL', 3, 400); wig('reedR', 3, 400); T.pop(duck.x, duck.y - 150, tr('꽥꽥!'));
    await T.cutImage([{ src: cutSrc('duck'), sfx: 'pop', hold: 2600 }], { hold: 2600 });
    scene('river');
    put(T, duck, L(640, 570), 470, { look: 'b', to: 'left' });
    put(T, hans, L(380, 420), GROUND + 12, { look: 'walk', to: 'right' }); put(T, gret, L(470, 490), GROUND + 12, { look: 'walk', to: 'right' });
    await say('"꽥꽥! 내 등에 타!" 오리가 말했어요.');
    const cross = (async () => {
      put(T, hans, hans.x, hans.y, { look: 'walk', to: 'right' }); put(T, gret, gret.x, gret.y, { look: 'walk', to: 'right' });
      await Promise.all([hans.move(duck.x - 22, GROUND + 12, 700), gret.move(duck.x + 22, GROUND + 12, 700)]);
      hans.setScale(.55 * SC); gret.setScale(.55 * SC); hans.place(hans.x, 428); gret.place(gret.x, 428);
      const tx = L(780, 600);
      duck.turn('right'); // 가는 쪽(오른쪽)을 본다
      await Promise.all([duck.move(tx, 330, 2600), hans.move(tx - 22, 290, 2600), gret.move(tx + 22, 290, 2600)]);
      await Promise.all([hans.move(tx - 22 + 50, 250, 700), gret.move(tx + 22 + 50, 250, 700)]);
    })();
    await say('둘은 오리 등에 폴짝 올라탔어요. 오리는 둥실둥실 강을 건넜지요.');
    await say('오리가 둘을 태우고 강을 건너 주었어요. "고마워, 오리야!"');
    await cross;

    /* --- 11. 우리 집: 아빠와 만나요 --- */
    await sleep(REST); /* 장면 끝 쉼 */
    await T.sceneCard(tr('우리 집'), () => {
      scene('cottage');
      put(T, hans, L(660, 580), GROUND, { look: 'walk', to: 'left' });
      put(T, gret, L(740, 625), GROUND, { look: 'walk', to: 'left' });
      put(T, father, L(300, 400), GROUND, { look: 'hug', to: 'right' });
    }, hans.pos);
    await say('저 멀리 집이 보여요. 아빠가 숲에서 둘을 애타게 찾고 있었어요.');
    const runAhead = gret.move(gret.x - L(120, 50), GROUND, 900); /* 그레텔이 먼저 아빠 쪽으로 */
    await say('"아빠다! 아빠!" 그레텔이 먼저 달려갔어요.');
    await runAhead;
    await father.move(L(450, 480), GROUND, 800);
    await say('"헨젤! 그레텔!" 아빠가 달려왔어요.');
    await sleep(700); /* 저절로 */
    popSfx(T); father.hop(20, 300);
    await T.cutImage([{ src: cutSrc('hug'), sfx: 'pop', hold: 3000 }], { hold: 3000 });
    scene('cottage');
    put(T, father, 500, GROUND, { look: 'hug', to: 'left' });
    put(T, hans, L(400, 440), GROUND, { look: 'joy', to: 'left' }); put(T, gret, L(600, 565), GROUND, { look: 'clever', to: 'left' });
    await say('"찾았다! 보고 싶었어!" 아빠가 말했어요.');
    hans.hop(10, 300);
    await say('"아빠, 다시는 우리를 두고 가지 마세요." 헨젤이 말했어요.');
    father.hop(10, 300);
    await say('"그래, 다시는 안 그럴게. 약속할게." 아빠가 두 아이를 꼭 안았어요.');
    await T.ask('헨젤과 그레텔은 마음이 따뜻하고 행복했어요. 여러분은 기분이 어때요? 헨젤을 톡! 만세!', () => T.tap(hans.pos, { prompt: '헨젤을 톡! 만세!' }));
    T.pop(hans.x - 90, hans.y - 230, tr('만세!'));
    T.confetti(); sfx('party_horn', .6); wig('flowers', 3, 500);
    await Promise.all([hans.hop(40, 500), gret.hop(34, 500), father.hop(26, 500)]);
    await sleep(REST);
    scene('cottage_night'); /* 그날 밤 — 창문만 환한 집(모두 안에서 잔다) */
    amb('crickets_night_2', { vol: .2, dur: 4 }); // 포근한 밤
    await say('그날 밤, 둘은 포근한 이불 속에서 새근새근 잠이 들었답니다.');
    await say('우리 집이 제일 포근해요. 헨젤과 그레텔 이야기는 이렇게 끝났어요.');
    T.finale(); stopAmb(.8);
    return '우리 집이 제일 포근해요!';
  }

  Tale.mount({ title: '헨젤과 그레텔', subtitle: '집이 제일 포근해요', read: true, run: T => run(Tale.api) });
})();
