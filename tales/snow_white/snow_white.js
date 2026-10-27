/* 백설공주 — 그림 형제 원작 그대로. 기획: tales/snow_white/PLAN.md (11장, 2026-10-20 확정), 화면·대사: SCRIPT.md (2026-10-20 재기획)
   거울·질투 → 사냥꾼 → 난쟁이 집 문(톡) → 식탁 → 일곱 번째 침대 → 난쟁이의 당부 → 큰 침대 짜기 →
   침대 여덟 개 세기(톡 한 번, 1~8 저절로) → 이제 잘 시간 침대 색 찾기(고르기 3번) → 할머니와 사과 → 유리관과 왕자(덜컹, 사과 조각) → 깨어나요(손 톡).
   톡은 세 번뿐(문 · 침대 세기 시작 · 깨어남), 연타 없음. 줄거리를 바꾸는 선택 없음. 입맞춤 없음.
   크기 원칙: 백설은 모든 장면에서 같은 크기다 (자세마다 머리 크기가 같게 높이를 맞췄다). 난쟁이 가구가 백설에게 작은 것이지, 백설을 줄이지 않는다.
   난쟁이 목소리: 일곱 명이 따로(dwarfa~g). [난쟁이들] 대사는 일곱 목소리를 겹친 합창 파일(chorus.js, mix_chorus.py).
   교훈: 질투는 마음을 해친다. 낯선 사람이 주는 것은 어른에게 물어보고 받는다.
   그림: assets/v3w/sw_*.webp (목록은 tools/app/gen/jobs_snow_white.json — sw_ 머리글자는 해와 바람과 같이 쓰므로 그 목록에 있는 것만 쓴다)
   화려하게 다시 그리기(VISUAL_PLAN.md, 2026-10-22): 성·숲·집 앞·빈터 배경 v2 + 층 소품 sw_layer_*(중간 층은 배우 뒤, 앞 가림 층은 맨 앞, 모두 누름 없음) */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 비율 (사방 여백 없이 오린 그림) */
  const ASP = { snow_stand: .43, snow_flee: .69, snow_eat: .435, snow_chair_small: .6017, snow_chair: .51, snow_bedsleep: 1.6522, snow_receive: .445,
    snow_awake: .75, queen_mirror: .6, queen_fist: .605, hunter_shake: .52, dwarfs_row: 2.8188, dwarf_hammer: .84,
    dwarf_plank: .915, dwarf_smile: .57, dwarfs_worry: 1.03, granny_basket: .765, prince: .365,
    prop_mirror: .675, prop_apple: .925, prop_apple_bitten: .9187, prop_apple_piece: .9437, prop_coffin: 2.1875,
    prop_door_closed: 1.0063, prop_door_open: .9756, prop_table: 2.2556, prop_chair: .7929, prop_chair_7: .7857,
    prop_bed1: 1.5857, prop_bed2: 1.5857, prop_bed3: 1.5786, prop_bed4: 1.5857, prop_bed5: 1.5857, prop_bed6: 1.5857, prop_bed7: 1.5857,
    prop_bed_big: 1.5, prop_planks: 1.1938, prop_glow: .98, prop_petals: 1.0526,
    snow_bedknees: 1.5738, snow_bedtoes: 1.5786, snow_bedcurl: 1.519, prop_mirror_face: .9875, prop_lantern: .6833,
    /* 화려하게 다시 그리기(VISUAL_PLAN.md, 2026-10-22): 중간 층·앞 가림 층 소품 (tools/app/gen/post_v2.py 로 오림) */
    layer_chandelier: .94, layer_candelabra: .4883, layer_curtain_side: .3817, layer_vine: .4133, layer_mushrooms: 1.0583,
    layer_bluebells: .8117, layer_fern_front: 1.1017, layer_flowers_front: 1.07, layer_flowers_mid: 2.3316, layer_branch: 1.07,
    layer_bird_blue: 1.0083, layer_bird_robin: 1.0017, layer_rabbit: .6517, layer_fawn: 1.2617, layer_butterfly: 1.205 };
  const BGS = ['queen_room_v2', 'forest_v2', 'house_front_v2', 'house_table2', 'house_bed2', 'hill_v2'];   /* 성·숲·집 앞·빈터는 v2(다층) */
  const bgSrc = k => AS + 'sw_bg_' + k + '.webp', artSrc = k => AS + 'sw_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 }; /* 1600×902 그림이 무대 1000×560을 덮게 */
  const H_SNOW = 205;  /* 백설 키 (서기 기준). 어른(왕비·사냥꾼·할머니·왕자)은 조금 더 크고, 난쟁이는 백설 허리 조금 위 */
  /* 작은 침대 높이(5·6장). 침대에 누운 백설 그림(침대째 그림)도 이 침대 크기에 맞추면 백설이 서 있을 때와 같은 크기가 된다 */
  const BED_H = 140;

  /* 배우: 자세 그림 여러 장 중 하나만 보인다. poses = { 이름: [그림, 높이, 그림이 보는 쪽('left'|'right'|'front')] }
     a.look(자세, 방향) — 그림이 보는 쪽과 원하는 쪽이 다르면 뒤집는다 (앞모습은 뒤집지 않는다) */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, 520, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: artSrc(f), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat };
      });
    });
    a.want = 'left';
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.w = looks[k].w; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const prop = (T, f, h, nat = 'front') => mk(T, { a: [f, h, nat] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 450) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  /* 반짝 (세는 침대·깨어나는 백설) */
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };

  /* ---- 층 소품 도우미 (VISUAL_PLAN §3~5) ---- */
  /* 매달린 소품(샹들리에·덩굴·가지)은 위 끝을 축으로, 바닥 소품은 발끝을 축으로 살랑 */
  function sway(a, deg, ms, top = true) {
    a.body.getAnimations().forEach(n => n.cancel());
    const h = a.h, R = d => (top ? `translate(0px,${-h}px) rotate(${d}deg) translate(0px,${h}px)` : `rotate(${d}deg)`);
    return a.body.animate([{ transform: R(-deg) }, { transform: R(deg) }, { transform: R(-deg) }], { duration: ms, iterations: Infinity, easing: 'ease-in-out' });
  }
  /* 은·금 마름모 반짝이 (신데렐라 sparkle 과 같은 모양) */
  function sparkleRing(T, x, y, r, n, colors) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, d = r * (.7 + (i % 3) * .15);
      const p = T.el('path', { d: 'M0 -9 L5 0 L0 9 L-5 0 Z', fill: colors[i % colors.length], transform: `translate(${x},${y})` }, T.world);
      p.style.pointerEvents = 'none';
      p.animate([{ transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 0 },
        { transform: `translate(${x + Math.cos(a) * d * .7}px,${y + Math.sin(a) * d * .7}px) scale(1.2)`, opacity: 1, offset: .4 },
        { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d}px) scale(.4)`, opacity: 0 }], { duration: 1300, delay: i * 35, easing: 'ease-out' })
        .finished.then(() => p.remove(), () => p.remove());
    }
  }
  /* 촛불 반짝 점: 노란 원이 천천히 깜빡인다 (불꽃 그림 위에 얹는다) */
  function twinkle(T, pts) {
    const g = T.el('g', {}, T.world); g.style.pointerEvents = 'none';
    pts.forEach(([x, y], i) => {
      const c = T.el('circle', { cx: x, cy: y, r: 3.5, fill: '#FFF3C4' }, g);
      c.animate([{ opacity: .1 }, { opacity: .95 }, { opacity: .1 }], { duration: 1200, delay: i * 400, iterations: Infinity });
    });
    return g;
  }
  /* 반딧불: 노란 원(둘레에 크림 원 한 겹)이 느리게 떠다니며 깜빡인다. 인물 얼굴 자리(x 250~760, y 330~450)는 피한다 */
  function fireflies(T, n, P) {
    const g = T.el('g', {}, T.world); g.style.pointerEvents = 'none';
    const flies = [];
    for (let i = 0; i < n; i++) {
      const side = i % 3;   // 0: 위쪽, 1: 왼쪽, 2: 오른쪽
      const x = side === 0 ? (P ? 300 : 120) + ((i * 137) % (P ? 400 : 760)) : side === 1 ? (P ? 300 : 40) + (i * 53) % 170 : (P ? 560 : 790) + (i * 61) % 170;
      const y = side === 0 ? 60 + (i * 47) % 150 : 120 + (i * 71) % 200;
      const f = T.el('g', { transform: `translate(${x},${y})` }, g);
      const r = 3 + (i % 3);
      T.el('circle', { r: r + 3, fill: '#F3E9C8', opacity: .55 }, f);
      T.el('circle', { r, fill: '#F2C94E' }, f);
      const dx = 25 + (i % 4) * 5, dy = 15 + (i % 3) * 5, ms = 5000 + (i % 5) * 1000;
      f.animate([{ transform: `translate(${x}px,${y}px)` }, { transform: `translate(${x + dx}px,${y - dy}px)` }, { transform: `translate(${x - dx}px,${y + dy}px)` }, { transform: `translate(${x}px,${y}px)` }],
        { duration: ms, iterations: Infinity, easing: 'ease-in-out' });
      f.children[1].animate([{ opacity: .25 }, { opacity: 1 }, { opacity: .25 }], { duration: 1500 + (i % 4) * 400, delay: i * 170, iterations: Infinity });
      flies.push({ f, x, y });
    }
    return { g, flies };
  }
  /* 나비: 날갯짓(scaleX) + 떠다님. fast 면 빠르게 */
  function flutter(a, fast = false) {
    a.body.getAnimations().forEach(n => n.cancel());
    const h = a.h / 2;
    a.body.animate([{ transform: `translateY(${-h}px) scaleX(1) translateY(${h}px)` }, { transform: `translateY(${-h}px) scaleX(.3) translateY(${h}px)` }, { transform: `translateY(${-h}px) scaleX(1) translateY(${h}px)` }],
      { duration: fast ? 260 : 520, iterations: Infinity });
    const x = a.x, y = a.y, dx = fast ? 60 : 30, ms = fast ? 2600 : 6000;
    a.pos.animate([{ transform: `translate(${x}px,${y}px)` }, { transform: `translate(${x + dx}px,${y - 30}px)` }, { transform: `translate(${x}px,${y - 10}px)` }, { transform: `translate(${x - dx}px,${y - 30}px)` }, { transform: `translate(${x}px,${y}px)` }],
      { duration: ms, iterations: Infinity, easing: 'ease-in-out' });
  }

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const sfx = (T, name, fb) => AudioFX.sfx(name) || fb && fb();
  /* 마법이 풀리는 음악(sounds/music/magic_awaken.mp3, 16초): 대사와 겹치니 작게, 끝은 페이드 */
  const awakenMusic = () => { if (!AudioFX.music) return null; AudioFX.preloadMusic && AudioFX.preloadMusic(['magic_awaken']); return AudioFX.music('magic_awaken', { vol: .28, fade: 3 }); };
  const popSfx = T => sfx(T, 'pop', () => T.tone([500, 800], .12, { vol: .12 }));
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!', '여섯!', '일곱!', '여덟!'];

  let uid = 0;
  /* 배경 위에 얇은 색 한 장 (해 질 녘·밤). 인물은 그 위에 있어 그대로 보인다 */
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);

  /* 거울 속 백설 얼굴: 거울 유리(타원) 안에서 은빛 파문과 함께 천천히 떠오른다 */
  function mirrorFace(T, mx, my) {
    const g = T.el('g', { opacity: 0 }, T.world), id = 'swMf' + (++uid), D = 84;
    T.el('ellipse', { cx: mx, cy: my, rx: 43, ry: 66 }, T.el('clipPath', { id }, g));
    T.el('image', { href: artSrc('prop_mirror_face'), x: mx - D / 2, y: my - D / 2 / ASP.prop_mirror_face, width: D, height: D / ASP.prop_mirror_face,
      preserveAspectRatio: 'none', 'clip-path': `url(#${id})` }, g);
    const ring = T.el('ellipse', { cx: mx, cy: my, rx: 46, ry: 70, fill: 'none', stroke: '#DCE3EE', 'stroke-width': 5, opacity: 0 }, T.world);
    ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = 'center';
    let rip = null;
    return {
      show() {
        rip = ring.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: .9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.25)' }], { duration: 1300, iterations: 3 });
        g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1600, delay: 300, fill: 'forwards', easing: 'ease-out' });
      },
      hide() { if (rip) rip.cancel(); g.getAnimations().forEach(a => a.cancel()); g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'forwards' }); },
    };
  }

  /* 난쟁이 집 문 (3장·9장). 배경 그림(sw_bg_house_front)의 돌 아치 문 자리에 딱 겹치게 세계 좌표로 바로 놓는다.
     배경 아치(그림 픽셀 x 454~592, y 380~533)를 세계 좌표로 옮기면 x 266.5~359.6, 위 232.4, 문지방 335.7.
     문 그림(480×477)의 돌 테 바깥선(x 3~476, y 0~477)을 그 자리에 맞춘 값이 DOOR (가로 .2053, 세로 .2187 — 배경 아치가 5% 더 길쭉해서 세로만 조금 늘림).
     조각 (sw_prop_door_closed/open 에서 오려 냄, 좌표는 원래 그림 그대로):
       room 문 구멍 안 방(sw_door_room: 안쪽 벽·바닥·빛 자리·문지방·작은 창·식탁 실루엣, 구멍 위·옆 안쪽 그림자) ·
       leaf 문짝(경첩은 왼쪽) · slot 들어가는 인물 자리 · wall 배경에서 오린 문 둘레 벽(문틀 바깥선 안쪽은 비움) · frame 돌 테
     층 순서(뒤→앞): 방 → 문짝 → 인물 자리 → 벽 → 돌 테. 돌 테가 늘 맨 앞이라 문짝은 문틀 뒤, 구멍 안에서만 보인다.
     열림(2026-10-22): 오두막 문은 안쪽으로 열린다. 문짝이 왼쪽 경첩을 축으로 방 안으로 돌아 들어가 앞에서 보면 가로로 좁아지고(cos),
     빛을 등지며 조금 어두워진다. 다 열리면 왼쪽 돌 테 바로 뒤에 좁은 띠로 남고, 오른쪽 구멍으로 방 안이 보인다.
     (안쪽으로 열린 문의 옆면은 경첩 쪽이라 돌 테에 가려 보이지 않는다) */
  const DOOR = { x: 263.9, y: 231.4, sx: .2053, sy: .2187 };
  const DOOR_ART = ['door_room', 'door_wall_v2', 'door_frame', 'door_leaf'];
  const DOOR_OPEN = .3;   /* 다 열린 문짝의 앞에서 보이는 폭 비율 (약 72도) */
  function makeDoor(T) {
    const d = (ix, iy) => [DOOR.x + ix * DOOR.sx, DOOR.y + iy * DOOR.sy];
    const img = (k, ix, iy, iw, ih, parent, f = 'url(#pp)') => {
      const [x, y] = d(ix, iy), g = T.el('g', f ? { filter: f } : {}, parent);
      return { g, im: T.el('image', { href: artSrc(k), x, y, width: iw * DOOR.sx, height: ih * DOOR.sy, preserveAspectRatio: 'none' }, g) };
    };
    const p = {};
    const a = T.actor(T.world, 0, 0, g => {
      const id = 'swTint' + (++uid), f = T.el('filter', { id, 'color-interpolation-filters': 'sRGB' }, T.el('defs', {}, g));
      T.el('feFlood', { 'flood-color': '#E8703A', 'flood-opacity': .16 }, f);
      T.el('feComposite', { in2: 'SourceGraphic', operator: 'in' }, f);
      const fm = T.el('feMerge', {}, f); T.el('feMergeNode', { in: 'SourceGraphic' }, fm); T.el('feMergeNode', {}, fm);
      p.tintId = id;
      p.inside = img('door_room', 73, 63, 320, 410, g, '').g;
      p.front = T.el('g', {}, g);                 /* 두드릴 때 들썩이는 것은 문짝뿐 (돌 테·벽은 집에 붙어 움직이지 않는다) */
      p.leaf = img('door_leaf', 75, 65, 316, 406, p.front);
      p.slot = T.el('g', {}, g);
      /* 배경 1600×902 의 (409,326)~(640,533) 조각 → 세계 좌표 (door_wall_v2: 같은 조각 모양을 v2 집 앞 배경에서 다시 오림. v2 집·아치 자리는 옛 배경과 같다) */
      p.wall = T.el('image', { href: artSrc('door_wall_v2'), x: -40 + 409 * .675, y: -24 + 326 * BGBOX.h / 902, width: 231 * .675, height: 207 * BGBOX.h / 902, preserveAspectRatio: 'none' }, g);
      p.frame = img('door_frame', 0, 0, 480, 477, g).g;
    });
    Object.assign(a, p);
    const L = a.leaf.im; L.style.transformBox = 'fill-box'; L.style.transformOrigin = '0% 50%';   /* 문짝 왼쪽 끝 = 경첩 */
    a.reset = (tint = false) => {
      T.world.appendChild(a.pos); a.pos.style.display = ''; a.pos.style.opacity = '';
      [a.front, L, a.frame, a.leaf.g].forEach(n => { n.getAnimations().forEach(x => x.cancel()); n.style.transform = ''; n.style.opacity = ''; n.style.filter = ''; });
      a.inside.style.display = 'none'; a.wall.style.display = 'none';
      a.frame.style.display = ''; a.leaf.g.style.display = '';
      a.wall.setAttribute('filter', tint ? `url(#${a.tintId})` : '');
      a.tint = tint;
    };
    /* 안쪽으로 돌아 들어가는 문짝: 각도마다 앞에서 보이는 폭 = cos, 빛을 등지는 만큼 어두워진다.
       삐걱(살짝 틈) → 잠깐 멈칫 → 끝까지 */
    const at = deg => { const c = Math.cos(deg * Math.PI / 180); return { transform: `scaleX(${Math.max(c, DOOR_OPEN).toFixed(3)})`, filter: `brightness(${(1 - .28 * (1 - c)).toFixed(3)})` }; };
    const swing = (d0, d1, ms, easing) => {
      const n = 8, k = [...Array(n + 1)].map((_, i) => at(d0 + (d1 - d0) * i / n));
      return T.anim(L, k, { duration: ms, easing });
    };
    const END = acos => Math.acos(acos) * 180 / Math.PI;
    a.open = async (onHalf) => {
      a.inside.style.display = '';
      await swing(0, 24, 520, 'ease-in');                  /* 삐걱… 틈이 벌어진다 */
      Object.assign(L.style, at(24));
      if (onHalf) onHalf();
      await T.anim(L, [at(24), at(27), at(24)], { duration: 260 });
      await swing(24, END(DOOR_OPEN), 760, 'ease-out');    /* 끝까지 안쪽으로 */
      Object.assign(L.style, at(END(DOOR_OPEN)));
    };
    a.reset();
    return a;
  }

  /* 일곱 난쟁이 한 줄 그림을 일곱 조각으로 오려(같은 그림, 자리만 나눠 자름) 말하는 난쟁이만 콩 뛰게 한다.
     등불(lantern)은 몇 명의 손 쪽에 붙여 함께 뛴다 */
  function crew(T, { lanterns = false } = {}) {
    const H = 150, W = H * ASP.dwarfs_row, one = W / 7, subs = [];
    const a = T.actor(T.world, -400, 520, g => {
      const wrap = T.el('g', { filter: 'url(#pp)' }, g);
      for (let i = 0; i < 7; i++) {
        const sg = T.el('g', {}, wrap), id = 'swDw' + (++uid);
        const x0 = -W / 2 + one * i - (i ? .5 : 30), x1 = -W / 2 + one * (i + 1) + (i < 6 ? .5 : 30);
        T.el('rect', { x: x0, y: -H - 40, width: x1 - x0, height: H + 50 }, T.el('clipPath', { id }, sg));
        T.el('image', { href: artSrc('dwarfs_row'), x: -W / 2, y: -H, width: W, height: H, preserveAspectRatio: 'none', 'clip-path': `url(#${id})` }, sg);
        if (lanterns && i % 3 === 0) {
          const lh = 40, lw = lh * ASP.prop_lantern;
          T.el('image', { href: artSrc('prop_lantern'), x: -W / 2 + one * (i + .5) + one * .18 - lw / 2, y: -H * .52, width: lw, height: lh, preserveAspectRatio: 'none' }, sg);
        }
        subs.push(sg);
      }
    });
    a.hopOne = (i, h = 16, ms = 420) => subs[i].animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-h}px)` }, { transform: 'translateY(0)' }], { duration: ms, easing: 'ease-out' }).finished.catch(() => {});
    a.hopAll = (h = 14, ms = 420) => Promise.all(subs.map((_, i) => sleep0(i * 60).then(() => a.hopOne(i, h, ms))));
    return a;
  }
  const sleep0 = ms => new Promise(r => setTimeout(r, ms));

  /* 누르는 자리 넓히기(2026-10-22): 화면에서 짧은 변이 min px 보다 작으면 투명 사각을 대상 안에 깔아 min px 로 키운다. 눌리는 곳 크기만 바뀌고 그림은 그대로 */
  function padHit(T, el, min = 88) {
    try {
      if (el.__pad) { el.__pad.remove(); el.__pad = null; }
      const m = el.getScreenCTM(); if (!m) return;
      const sc = Math.hypot(m.a, m.b) || 1, bb = el.getBBox();
      const w = Math.max(bb.width, min / sc), h = Math.max(bb.height, min / sc);
      if (w === bb.width && h === bb.height) return;
      el.__pad = T.el('rect', { x: bb.x + bb.width / 2 - w / 2, y: bb.y + bb.height / 2 - h / 2, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, el);
    } catch (e) { /* 크기를 못 재면 그대로 둔다 */ }
  }
  async function run(T) {
    if (AudioFX.preloadMusic) AudioFX.preloadMusic(['magic_awaken']);
    if (T.fx) T.fx.style.pointerEvents = 'none';   // 효과 글자(pop)가 누르는 대상을 덮지 않게
    const { sleep, camSnap, tr } = T;
    /* 대사 사이에 숨 한 번 (3~4세가 따라오게, 한 편 6~7분) */
    const say = async text => { await T.say(text); await sleep(700); };
    /* 소리 큐: 놀이에서만 만화 소리, 읽어 주기에서는 장면 시작 배경 소리(낮은 볼륨·4초 이내)만 */
    const amb = (name, v = .28, d = 4) => { try { const rd = T.reading(); AudioFX.ambient(name, { vol: rd ? Math.min(v, .18) : v, dur: rd ? Math.min(d, 4) : d }); } catch (e) { /* 소리 없이 */ } };
    const cue = (name, v) => { try { return T.reading() ? false : AudioFX.sfx(name, v); } catch (e) { return false; } };
    const SCENE_AMB = { forest_v2: 'crickets_night_2', hill_v2: 'birds_chirp_1' };
    const scene = key => { try { AudioFX.stopAmbient(.5); } catch (e) { /* */ } T.clear(); bgImage(T, key); camSnap(500, 280, 1); if (SCENE_AMB[key]) amb(SCENE_AMB[key]); };
    try { AudioFX.preloadSfx(['sparkle', 'thud', 'whoosh', 'knock', 'creak', 'door', 'gulp', 'chomp', 'squeak', 'paper_down', 'step_wood', 'tada', 'pop', 'slide_down', 'crickets_night_1', 'crickets_night_2', 'birds_chirp_1', 'surprise_sting', 'zip_away', 'sleepy_tuba', 'boing', 'tiptoe_pizz', 'ding_glock', 'hammer', 'pop_appear', 'whistle_down', 'party_horn', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'marimba_6', 'marimba_7', 'marimba_8']); } catch (e) { /* */ }
    const P = T.viewWidth() < 990; /* 세로 화면: 가운데 일부만 보인다 → 카메라가 주인공을 따라간다 */
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); }; /* 말풍선 없는 소리 대사 (수 세기) */

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...Object.keys(ASP).map(k => T.preload(artSrc(k))), ...DOOR_ART.map(k => T.preload(artSrc(k)))];
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);

    /* ---- 배우 ---- (높이는 자세마다 머리 크기가 서 있을 때와 같아지게 잰 값) */
    const snow = mk(T, { stand: ['snow_stand', H_SNOW, 'front'], flee: ['snow_flee', 167, 'right'], eat: ['snow_eat', H_SNOW, 'front'],
      receive: ['snow_receive', H_SNOW, 'front'], awake: ['snow_awake', 152, 'front'],
      chair: ['snow_chair_small', 170, 'right'],                 /* 작은 의자째 그린 앉은 그림 (의자는 그림 왼쪽, 얼굴은 오른쪽) */
      /* 작은 침대째 그린 누운 그림 3장: 침대 부분이 BED_H 침대와 같은 크기가 되는 높이 */
      bedknees: ['snow_bedknees', 140, 'front'], bedtoes: ['snow_bedtoes', 140, 'front'], bedcurl: ['snow_bedcurl', 146, 'front'],
      coffin: ['snow_bedsleep', 98, 'left'] });
    const BED_DX = { bedknees: 0, bedtoes: 0, bedcurl: 0 };   /* 그림 속 침대 가운데를 침대 자리에 */
    const queen = mk(T, { mirror: ['queen_mirror', 240, 'right'], fist: ['queen_fist', 240, 'right'] }); // 그림은 오른쪽을 본다 → 왼쪽 거울을 보게 뒤집는다 (2026-10-20)
    const hunter = prop(T, 'hunter_shake', 238);
    const dwarfs = prop(T, 'dwarfs_row', 150);
    const worry = prop(T, 'dwarfs_worry', 150);
    const hammerD = prop(T, 'dwarf_hammer', 128, 'left'), plankD = prop(T, 'dwarf_plank', 128, 'left'), smileD = prop(T, 'dwarf_smile', 128);
    const granny = prop(T, 'granny_basket', 215, 'left');
    const prince = prop(T, 'prince', 228);
    const mirror = prop(T, 'prop_mirror', 230);
    const door = makeDoor(T);
    const table = prop(T, 'prop_table', 165);
    const chairs = Array.from({ length: 7 }, (_, i) => prop(T, i === 6 ? 'prop_chair_7' : 'prop_chair', 84));
    const beds = Array.from({ length: 7 }, (_, i) => prop(T, 'prop_bed' + (i + 1), 100));
    const bigBed = prop(T, 'prop_bed_big', 150);
    const planks = prop(T, 'prop_planks', 92);
    const apple = mk(T, { whole: ['prop_apple', 34, 'front'], bitten: ['prop_apple_bitten', 34, 'front'] });
    const piece = prop(T, 'prop_apple_piece', 26);
    const coffin = prop(T, 'prop_coffin', 150);
    const shine = prop(T, 'prop_glow', 190);
    [snow, queen, hunter, dwarfs, worry, hammerD, plankD, smileD, granny, prince, mirror, door, table, ...chairs, ...beds, bigBed, planks, apple, piece, coffin, shine].forEach(hide);

    /* ---- 층 소품 (VISUAL_PLAN §3~6): 누름을 받지 않는다. 같은 소품은 어느 장면이든 같은 높이(§4-1) ---- */
    const D = (f, h, nat) => { const a = prop(T, 'layer_' + f, h, nat); a.pos.style.pointerEvents = 'none'; return a; };
    const L = {
      chand: D('chandelier', 150), cand: [D('candelabra', 170), D('candelabra', 170)], curtain: D('curtain_side', 400),
      vine: [D('vine', 220), D('vine', 220)], mush: D('mushrooms', 95), bells: D('bluebells', 90),
      fern: [D('fern_front', 120), D('fern_front', 120)],
      fmid: [D('flowers_mid', 80), D('flowers_mid', 80), D('flowers_mid', 80)], branch: [D('branch', 180), D('branch', 180)],
      blue: D('bird_blue', 34, 'right'), robin: D('bird_robin', 34, 'right'), rabbit: D('rabbit', 56), fawn: D('fawn', 95, 'left'),
      bf: [D('butterfly', 26), D('butterfly', 26), D('butterfly', 26)], ffront: [D('flowers_front', 100), D('flowers_front', 100)],
    };
    /* 샹들리에 사슬: 그림 위 끝에서 화면 밖까지 Bark Brown 띠 한 장 */
    { const ch = T.el('rect', { x: -2, y: -150 - 400, width: 4, height: 404, fill: '#6B4A32' }, L.chand.body); L.chand.body.insertBefore(ch, L.chand.body.firstChild); }
    Object.values(L).flat().forEach(hide);
    /* 앞 가림 층을 맨 앞으로 (뒤에 put 한 배우보다 앞) */
    const front = (...as) => as.forEach(a => { if (a.pos.style.display !== 'none') T.world.appendChild(a.pos); });
    /* 성: 샹들리에(중간)·촛대 둘(중간)·오른쪽 커튼(앞). 거울·왕비보다 먼저 깐다 */
    const castleBack = () => {
      put(T, L.chand, X(640, 620), 150); sway(L.chand, 1.5, 6000);
      put(T, L.cand[0], X(70, 150), 560); put(T, L.cand[1], X(930, 840), 560);
    };
    const castleFront = () => {
      put(T, L.curtain, 1012, 376); front(L.curtain);
      const w = 150 * ASP.layer_chandelier, cx = X(640, 620);
      twinkle(T, [[cx - w * .27, 150 - 150 * .58], [cx + w * .05, 150 - 150 * .62], [cx + w * .4, 150 - 150 * .58]]);
    };
    /* 거울 장면 (1장, 9장 처음) */
    const MY = 455, MCY = MY - 230 * .47;
    const mirrorRoom = () => {
      scene('queen_room_v2');
      castleBack();
      put(T, mirror, X(250, 385), MY);
      put(T, queen, X(470, 560), 528, { look: 'mirror', to: 'left' });
      const f = mirrorFace(T, X(250, 385), MCY);
      castleFront();
      return f;
    };
    const mirrorShine = () => sparkleRing(T, X(250, 385), MCY, 120, 12, ['#DCE3EE', '#EBD08A']);
    /* 왕비가 주먹 쥘 때 샹들리에가 한 번 크게 흔들린다 */
    const chandJolt = async () => {
      const h = L.chand.h, R = d => `translate(0px,${-h}px) rotate(${d}deg) translate(0px,${h}px)`;
      L.chand.body.getAnimations().forEach(n => n.cancel());
      await T.anim(L.chand.body, [{ transform: R(0) }, { transform: R(-4) }, { transform: R(3) }, { transform: R(-1.5) }, { transform: R(0) }], 700);
      sway(L.chand, 1.5, 6000);
    };

    /* ===== 읽어 주기 (docs/READ_MODE.md §10): 놀이판 연출 함수를 동사 이름으로 묶은 맵. 놀이판 흐름은 아래 그대로 ===== */
    if (T.reading()) {
      const inst = () => T.readInstant();
      const R = { set: '', mf: null, night: null, ffly: null, bedsG: null, winG: null, glass: null, tinted: false, fr: [], laid: false, worryHill: false, crewN: null, crewE: null };
      const FAR = .62, FL = 548, C7 = 330, CHX = [450, 530, 610, 690, 770, 850];
      const SETS = { queen_room: 'queen_room_v2', forest: 'forest_v2', house_front: 'house_front_v2', house_table2: 'house_table2', house_bed2: 'house_bed2', hill: 'hill_v2' };
      const CARD = { house_front: '사과 할머니', hill: '유리관' };
      /* 세로 화면에서 가로와 다르게 놓던 자리 (놀이판의 X(가로, 세로) 값) */
      const PM = { forest: { 400: 440, 610: 575, '-120': 240 }, house_table2: { 230: 300 }, house_bed2: { 860: 640, 330: 460 }, hill: { 205: 360, 195: 330, 770: 650 } };
      const px = x => { x = +x; return P && PM[R.set] && PM[R.set][x] != null ? PM[R.set][x] : x; };
      const xy = s => String(s).split(',').map(Number);
      const fr = () => front(...R.fr);
      const crewN = crew(T, { lanterns: true }), crewE = crew(T); hide(crewN); hide(crewE);
      const crewCur = () => (R.set === 'hill' ? crewE : crewN);
      /* 작은 침대 (놀이판 5장과 같은 자리) */
      const BS = BED_H / 100, BY_B = 468, BY_F = 556;
      const BPOS = { 2: [170, BY_B], 3: [390, BY_B], 4: [610, BY_B], 5: [830, BY_B], 0: [160, BY_F], 1: [500, BY_F], 6: [840, BY_F] };
      const layBeds = () => { [2, 3, 4, 5, 0, 1, 6].forEach(i => put(T, beds[i], BPOS[i][0], BPOS[i][1], { s: BS })); };
      let lying = -1;
      const onBed = (i, look) => {
        if (lying >= 0) beds[lying].pos.style.display = '';
        put(T, snow, BPOS[i][0], BPOS[i][1], { look });
        T.world.insertBefore(snow.pos, beds[i].pos.nextSibling); hide(beds[i]); lying = i;
      };
      /* 빈터 (놀이판 10·11장과 같은 층) */
      const CX = 500, CY = 530, CW = 150 * ASP.prop_coffin;
      const inCoffin = () => {
        put(T, snow, CX + 4, CY - 150 * .24, { look: 'coffin', to: 'left' });
        const glass = R.glass = T.el('g', {}, T.world);
        const href = artSrc('prop_coffin'), box = { x: CX - CW / 2, y: CY - 150, width: CW, height: 150, preserveAspectRatio: 'none' };
        T.el('image', { href, ...box, opacity: .3 }, glass);
        const cid = 'swBase' + (++uid);
        T.el('rect', { x: CX - CW / 2, y: CY - 150 * .27, width: CW, height: 150 * .27 }, T.el('clipPath', { id: cid }, glass));
        T.el('image', { href, ...box, 'clip-path': `url(#${cid})` }, glass);
        glass.style.transformBox = 'view-box';
      };
      const BIRD = { blue: [X(70, 640), X(122, 118)], robin: [X(930, 742), X(118, 112)] };
      const meadowBack = () => {
        [170, 500, 830].forEach((x, i) => put(T, L.fmid[i], x, 556, { to: i === 1 ? 'right' : 'left' }));
        put(T, L.fawn, X(960, 770), 548, { to: 'left' });
        put(T, L.rabbit, X(880, 700), 556);
      };
      const meadowFront = (fast = false) => {
        put(T, L.branch[0], X(940, 700), 156); sway(L.branch[0], 1, 8000);
        if (!P) { put(T, L.branch[1], 60, 156, { to: 'right' }); sway(L.branch[1], 1, 8600); }
        put(T, L.blue, BIRD.blue[0], BIRD.blue[1], { to: 'right' }); put(T, L.robin, BIRD.robin[0], BIRD.robin[1], { to: 'left' });
        if (P) hide(L.blue);
        const bx = X([140, 880, 960], [330, 660, 600]), by = [250, 300, 220];
        L.bf.forEach((b, i) => { if (i < (fast ? 3 : 2)) { put(T, b, bx[i], by[i]); flutter(b, fast); } else hide(b); });
        put(T, L.ffront[0], 985, 600); put(T, L.ffront[1], 25, 618, { to: 'right' });
        R.fr = [L.branch[0], L.branch[1], L.blue, L.robin, ...L.bf, ...L.ffront]; fr();
      };
      const wake = async () => {
        sfx(T, 'sparkle', () => T.tone([700, 1400], .4, { vol: .12 }));
        awakenMusic();
        sparkleRing(T, CX, CY - 80, 190, 18, ['#EBD08A', '#F6ECD8']);
        if (!P) T.camTo(500, 300, 1.08, 900).then(() => T.camTo(500, 280, 1, 1400));
        const land = async (b, x, ms, d) => {
          await sleep(d); b.pos.style.display = ''; T.world.appendChild(b.pos);
          const x0 = b.x, y0 = b.y, y1 = CY - 150 + 12, mx = (x0 + x) / 2, my = Math.min(y0, y1) - 60;
          b.pos.removeAttribute('transform');
          const t = (xx, yy) => `translate(${xx}px,${yy}px) scale(${b.flip * b.scale},${b.scale})`;
          await T.anim(b.pos, [{ transform: t(x0, y0) }, { transform: t(mx, my) }, { transform: t(x, y1) }], { duration: ms, easing: 'ease-in-out' });
          b.pos.style.transform = ''; b.place(x, y1); await b.hop(6, 300);
        };
        land(L.blue, CX - 150, 900, 300); land(L.robin, CX + 150, 900, 600);
        (async () => { await sleep(800); popSfx(T); L.rabbit.hop(14, 400).then(() => L.rabbit.hop(14, 400)); L.fawn.hop(8, 420); })();
        (async () => { await sleep(1000); L.bf.forEach((b, i) => { const bx = X([140, 880, 960], [330, 660, 600]), by = [250, 300, 220]; put(T, b, bx[i], by[i]); flutter(b, true); }); fr(); })();
      };
      /* 창문 속 백설 (놀이판 9장) */
      const WX = 162, SILL = 306, WS = .36;
      const handX = () => granny.x - 215 * .765 * .42 * FAR, handY = 356 - 215 * .52 * FAR;
      /* 문 안으로 들어간다 (놀이판 3장 그대로) */
      const enterDoor = async () => {
        const EX = 325, SILL3 = 336.5;
        const tf = (x, y, s) => `translate(${x}px,${y}px) scale(${s},${s})`;
        const stepTo = async (x, y, s, ms, extra) => {
          const from = tf(snow.x, snow.y, snow.scale), to = tf(x, y, s);
          snow.pos.removeAttribute('transform');
          await Promise.all([T.anim(snow.pos, [{ transform: from }, { transform: to }], { duration: ms, easing: 'ease-in-out' }), extra && extra()]);
          snow.pos.style.transform = ''; snow.scale = s; snow.place(x, y);
        };
        await snow.move(EX, 350, 900);
        await stepTo(EX, SILL3, .44, 600);
        door.wall.style.display = ''; door.slot.appendChild(snow.pos);
        await stepTo(EX + 2, SILL3 - 6, .3, 1000, () => T.anim(snow.body, [{ filter: 'brightness(1)', opacity: 1 }, { filter: 'brightness(.35)', opacity: 1, offset: .6 }, { filter: 'brightness(.2)', opacity: 0 }], { duration: 1000, easing: 'ease-in' }));
        hide(snow); snow.body.style.filter = ''; snow.body.style.opacity = ''; door.wall.style.display = 'none';
        T.world.appendChild(snow.pos);
      };
      let building = null;

      const READ_ACTS = {
        set: key => {
          const build = () => {
            scene(SETS[key]); R.set = key; R.tinted = false; R.fr = []; R.mf = null; R.night = null; R.laid = false; R.worryHill = false; lying = -1;
            if (key === 'forest') {
              put(T, L.vine[0], X(120, 300), 196); sway(L.vine[0], 1.5, 7000);
              put(T, L.vine[1], X(900, 720), 196, { to: 'right' }); sway(L.vine[1], 1.5, 7600);
              put(T, L.mush, X(130, 290), 556); put(T, L.bells, X(900, 720), 556);
              put(T, L.fern[0], 40, 590); put(T, L.fern[1], 980, 590, { to: 'right' });
              R.fr = [L.fern[0], L.fern[1]];
              R.ffly = fireflies(T, 14, P);
            } else if (key === 'house_front') {
              if (!P) { put(T, L.fern[0], 110, 448, { s: FAR }); R.fr = [L.fern[0]]; }
            } else if (key === 'hill') {
              meadowBack(); meadowFront();
            }
          };
          if (inst()) { build(); return null; }
          return T.sceneCard(tr(CARD[key] || ''), build);
        },
        cam: s => {
          let [x, y, z] = xy(s);
          if (P) {
            if (R.set === 'house_front' && z === 1.7) { z = 1.5; x = x === 370 ? 380 : x === 280 ? 250 : x; }
            else if (R.set === 'house_table2' && x === 500) x = 380;
            else if (R.set === 'house_bed2' && x === 500 && R.laid) x = 160;
            else if (R.set === 'hill' && x === 500 && R.worryHill) x = 430;
          }
          if (!P && z > 1.3) { x = 500; y = 280; z = 1.3; }
          camSnap(x, y, z);
        },
        tint: s => { const [c, o] = s.split(','); tint(T, c, +o); R.tinted = true; },
        night: m => {
          if (m === 'on') { R.night = tint(T, '#1F2A56', .45); amb('crickets_night_1', .18, 4); return null; }
          const n = R.night; if (!n) return null;
          if (inst()) { n.setAttribute('opacity', 0); return null; }
          return T.anim(n, [{ opacity: .45 }, { opacity: 0 }], 1200).then(() => n.setAttribute('opacity', 0));
        },
        mirror: (a, b) => {
          if (a === 'room') { R.mf = mirrorRoom(); return; }
          if (a === 'face' && R.mf) { if (b === 'show') R.mf.show(); else R.mf.hide(); }
        },
        queen: (a, b) => {
          if (a === 'look') queen.look(b === 'fist' ? 'fist' : 'mirror');
          else if (a === 'hop') queen.hop(16, 320);
        },
        snow: (a, b, c, d) => {
          if (a === 'look') {
            if (b === 'awake' && lying >= 0 && R.set === 'house_bed2') {
              beds[lying].pos.style.display = ''; const i = lying; lying = -1;
              put(T, snow, BPOS[i][0] + 6, BPOS[i][1] - 34, { look: 'awake' }); T.world.insertBefore(snow.pos, beds[i].pos.nextSibling);
            } else if (b === 'awake' && R.set === 'hill') {
              put(T, snow, CX + 10, CY - 30, { look: 'awake' }); fadeIn(snow, 500);
              T.world.appendChild(prince.pos); T.world.appendChild(crewE.pos); fr();
            } else snow.look(b, c);
          } else if (a === 'at') {
            const [x, y] = xy(b); put(T, snow, px(x), y, { look: c || undefined, s: d ? +d : 1 }); fr();
          } else if (a === 'move') {
            const [x, y, ms] = xy(b); if (P) follow(px(x), ms);
            return snow.move(px(x), y, ms);
          } else if (a === 'hop') snow.hop(12, 320);
          else if (a === 'wiggle') snow.wiggle(4, 450);
          else if (a === 'hide') hide(snow);
          else if (a === 'enter_door') return enterDoor();
          else if (a === 'eat3') {
            return (async () => {
              for (const [x, w] of [[500, '냠!'], [640, '꿀꺽!'], [780, '냠냠!']]) {
                follow(x); await snow.move(x, FL, 650);
                sfx(T, w === '꿀꺽!' ? 'gulp' : 'chomp', () => popSfx(T)); snow.hop(10, 300); T.pop(x, FL - 250, tr(w));
                await sleep(700);
              }
            })();
          } else if (a === 'sit7') {
            hide(chairs[6]);
            put(T, snow, C7 + 170 * .6017 * .215, FL, { look: 'chair', to: 'right' });
            sfx(T, 'squeak', () => popSfx(T)); snow.wiggle(4, 380); T.pop(C7, FL - 240, tr('영차!'));
          } else if (a === 'onbed') {
            const i = +b;
            if (P && !inst()) follow(BPOS[i][0], 500);
            onBed(i, c);
            if (!inst() && c !== 'bedcurl') { popSfx(T); snow.wiggle(3, 420); }
          } else if (a === 'window') {
            const winG = R.winG = T.el('g', {}, T.world);
            const id = 'swWin' + (++uid);
            T.el('rect', { x: WX - 17, y: SILL - 44, width: 34, height: 44, rx: 15 }, T.el('clipPath', { id }, winG));
            winG.setAttribute('clip-path', `url(#${id})`);
            T.el('rect', { x: WX - 20, y: SILL - 48, width: 40, height: 52, fill: '#4A3626' }, winG);
            put(T, snow, WX, SILL + 35, { look: 'receive', s: WS }); winG.appendChild(snow.pos);
          } else if (a === 'fall') {
            hide(apple); sfx(T, 'slide_down');
            return snow.move(WX, SILL + 35 + 70, 1500, 'ease-in').then(() => { hide(snow); if (R.winG) R.winG.style.display = 'none'; });
          }
          return null;
        },
        hunter: (a, b) => {
          if (a === 'at') { const [x, y] = xy(b); put(T, hunter, px(x), y); fr(); }
          else if (a === 'shake') (async () => { await sleep(200); for (let i = 0; i < 3; i++) await hunter.wiggle(5, 520); })();
        },
        door: a => {
          if (a === 'reset') door.reset(R.tinted);
          else if (a === 'knock') {
            door.front.animate([{ translate: '0 0' }, { translate: '0 -3px' }, { translate: '0 0' }], { duration: 300, iterations: 3, easing: 'ease-in-out' });
            [0, 330, 660].forEach(d => setTimeout(() => sfx(T, 'knock', () => T.tone([180, 90], .12, { type: 'square', vol: .12 })), d));
            return sleep(950);
          } else if (a === 'open') { door.front.getAnimations().forEach(n => n.cancel()); return door.open(); }
          return null;
        },
        table: a => {
          if (a === 'set') { put(T, table, 640, FL - 30); chairs.forEach((c, i) => put(T, c, i < 6 ? CHX[i] : C7, FL)); }
        },
        beds: a => {
          if (a === 'lay') { layBeds(); lying = -1; R.laid = true; }
          else if (a === 'eight') {
            return (async () => {
              if (building) await building;
              hide(hammerD); hide(plankD); hide(smileD);
              const SX = [70, 160, 250, 340, 430, 520, 610], SYs = i => (i % 2 ? 552 : 496), SS = i => (i % 2 ? .82 : .74), BIGX = 790;
              put(T, dwarfs, 340, 470, { s: .8 });
              [0, 2, 4, 6, 1, 3, 5].forEach(i => put(T, beds[i], SX[i], SYs(i), { s: SS(i) }));
              put(T, bigBed, BIGX, 554); fadeIn(bigBed, 500);
              put(T, snow, P ? 700 : 930, 552, { look: 'stand' });
              if (P) T.camTo(560, 280, 1, 700);
            })();
          }
          return null;
        },
        dwarfs: a => {
          if (a !== 'build') return null;
          const X5 = X(500, 500);
          building = (async () => {
            put(T, planks, X5, 548, { s: 1.3 });
            put(T, hammerD, X(330, 400), 548, { to: 'right' });
            put(T, plankD, X(670, 600), 548, { to: 'left' });
            for (let i = 0; i < 3; i++) {
              hammerD.wiggle(10, 360); plankD.hop(10, 360);
              sfx(T, 'knock', () => T.tone([180, 90], .12, { type: 'square', vol: .12 }));
              T.pop(X5 + [-60, 50, -10][i], 330, tr(['뚝딱!', '쿵쿵!', '뚝딱!'][i]));
              await sleep(700);
            }
            await fadeOut(T, planks, 300);
            hide(hammerD); put(T, smileD, X(330, 400), 548); smileD.hop(14, 340);
          })();
          return building;
        },
        crew: (a, b, c) => {
          const cw = crewCur();
          if (a === 'enter') return cw.move(X(330, 460), 560, 2200);
          if (a === 'at') { const [x, y] = xy(b); put(T, cw, px(x), y, { s: cw === crewE ? .85 : 1 }); fr(); }
          else if (a === 'hopOne') {
            const i = +b;
            if (P) { const dx = cw.x - 150 * ASP.dwarfs_row / 2 + 150 * ASP.dwarfs_row / 7 * (i + .5); T.camTo(i < 6 ? dx : 740, 280, 1, 450); }
            cw.hopOne(i);
          } else if (a === 'hopAll') cw.hopAll(cw === crewE ? 18 : 12, 400);
          else if (a === 'hide') { hide(crewN); hide(crewE); }
          return null;
        },
        worry: (a, b) => {
          if (a === 'at') {
            const [x, y] = xy(b); put(T, worry, px(x), y, { s: R.set === 'house_front' ? FAR : 1 });
            if (R.set === 'hill') R.worryHill = true; fr();
          } else if (a === 'enter') return worry.move(X(360, 290), 360, 1400);
          return null;
        },
        granny: (a, b, c) => {
          if (a === 'at') { const [x, y] = xy(b); put(T, granny, x, y, { to: 'left', s: FAR }); fr(); }
          else if (a === 'move') { const [x, y, ms] = xy(b); return granny.move(x, y, ms); }
          else if (a === 'leave') { granny.turn('right'); return granny.move(560, 356, 1600).then(() => hide(granny)); }
          return null;
        },
        apple: a => {
          if (a === 'show') { put(T, apple, handX(), handY, { look: 'whole', s: FAR }); fadeIn(apple, 300); }
          else if (a === 'give') {
            return (async () => {
              apple.setScale(.5); await apple.move(WX + 6, SILL - 8, 800);
              sfx(T, 'pop'); await sleep(400); apple.look('bitten');
            })();
          }
          return null;
        },
        coffin: a => {
          if (a === 'set') {
            put(T, coffin, CX, CY); put(T, shine, CX, CY - 40); hide(shine); inCoffin(); fr();
          } else if (a === 'jolt') {
            return (async () => {
              sfx(T, 'thud'); T.shake(); T.pop(CX, CY - 220, tr('덜컹!'));
              const j = [{ translate: '0 0', rotate: '0deg' }, { translate: '0 -14px', rotate: '-1.5deg' }, { translate: '0 0', rotate: '1deg' }, { translate: '0 0', rotate: '0deg' }];
              await Promise.all([coffin.pos, snow.pos, R.glass].map(n => { n.style.transformOrigin = `${CX}px ${CY}px`; return n.animate(j, 650).finished; }));
              const mouthX = snow.x - 98 * ASP.snow_bedsleep * .27, mouthY = snow.y - 98 * .55;
              put(T, piece, mouthX, mouthY); sfx(T, 'pop');
              await piece.move(mouthX - 70, 560, 700, 'ease-in');
              T.pop(mouthX - 70, 470, tr('툭!'));
            })();
          }
          return null;
        },
        glass: a => { if (a === 'open' && R.glass) R.glass.remove(); },
        shine: () => {
          T.world.insertBefore(shine.pos, coffin.pos.nextSibling);
          shine.pos.style.display = ''; fadeIn(shine, 700);
          shine.body.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(.9)' }], { duration: 1600, iterations: Infinity, easing: 'ease-in-out' });
        },
        petals: () => {
          for (let i = 0; i < 9; i++) {
            const p = prop(T, 'prop_petals', 44 + (i % 3) * 14); p.pos.style.pointerEvents = 'none';
            put(T, p, P ? 600 + (i % 5) * 30 : (i < 5 ? 880 + i * 30 : 20 + (i - 5) * 45), 60);
            p.body.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 0 }, { transform: 'translate(-30px,240px) rotate(160deg)', opacity: 1, offset: .5 }, { transform: 'translate(20px,560px) rotate(320deg)', opacity: 0 }],
              { duration: 5200 + (i % 4) * 700, delay: i * 260, iterations: 2, easing: 'ease-in-out' });
          }
        },
        prince: (a, b) => {
          if (a === 'enter') { put(T, prince, X(1100, 900), 540); prince.face('left'); fr(); if (P) follow(560, 2200); return prince.move(X(770, 640), 540, 2200); }
          if (a === 'at') { const [x, y] = xy(b); put(T, prince, px(x), y); fr(); }
          else if (a === 'hop') prince.hop(10, 360);
          return null;
        },
        glow: w => {
          if (w === 'snow') glow(snow, 1200); else if (w === 'prince') glow(prince, 1000); else if (w === 'bigbed') glow(bigBed, 1200);
        },
        sparkle: () => {
          if (R.set === 'queen_room') { sfx(T, 'sparkle'); mirrorShine(); } else if (R.set === 'hill') wake();
          else sfx(T, 'sparkle');
        },
        shake: () => { T.shake(); if (R.set === 'queen_room') chandJolt(); },
        confetti: () => T.confetti(),
        fx: n => { sfx(T, n, () => popSfx(T)); },
        pop: s => { const m = String(s).split(','); T.pop(+m[0], +m[1], tr(m.slice(2).join(','))); },
      };
      return T.readPlay(READ_ACTS);
    }

    /* ===== 1. 거울 앞의 왕비 ===== */
    let mf = mirrorRoom();
    await T.curtain(true);
    if (!P) T.camTo(500, 240, 1.06, 2500).then(() => T.camTo(500, 280, 1, 1500));   /* 홀 위쪽(샹들리에·창)을 천천히 보여 주고 돌아온다 */
    await say('옛날 어느 나라에 눈처럼 하얀 얼굴의 공주가 살았어요. 이름은 백설공주였어요.');
    await say('왕비에게는 무엇이든 대답하는 신기한 거울이 있었어요.');
    await say('거울아, 거울아, 이 나라에서 누가 제일 예쁘니?');
    sfx(T, 'sparkle'); mf.show(); mirrorShine();
    await say('왕비님도 예쁘지만, 백설공주가 더 예뻐요.');
    queen.look('fist'); T.shake(); cue('surprise_sting', .7) || sfx(T, 'thud'); queen.hop(16, 320); chandJolt();
    await say('왕비는 샘이 나서 얼굴이 빨개졌어요.');
    mf.hide();
    queen.hop(12, 300);
    await say('내가 제일이어야 해! 사냥꾼을 불러라!');
    await sleep(300);

    /* ===== 2. 숲속의 사냥꾼 ===== */
    let ffly;
    await T.sceneCard(tr('깊은 숲'), () => {
      scene('forest_v2');
      /* 중간 층: 덩굴·버섯·초롱꽃 → 배우 → 앞 층: 고사리.
         (안개 띠 sw_layer_mist 는 오솔길 위에 놓으면 납작한 눈 둑처럼 보여 쓰지 않는다. 배경 그림의 안개 층으로 충분) */
      put(T, L.vine[0], X(120, 300), 196); sway(L.vine[0], 1.5, 7000);
      put(T, L.vine[1], X(900, 720), 196, { to: 'right' }); sway(L.vine[1], 1.5, 7600);
      put(T, L.mush, X(130, 290), 556); put(T, L.bells, X(900, 720), 556);
      put(T, snow, X(400, 440), 530, { look: 'stand' });
      put(T, hunter, X(610, 575), 534);
      put(T, L.fern[0], 40, 590); put(T, L.fern[1], 980, 590, { to: 'right' });
      ffly = fireflies(T, 14, P);
    }, hunter.pos);
    await say('사냥꾼은 백설공주를 깊은 숲으로 데려갔어요.');
    const shakeHead = (async () => { await sleep(300); for (let i = 0; i < 3; i++) await hunter.wiggle(5, 520); })();
    await say('공주님, 저는 도저히 못 하겠어요. 멀리멀리 달아나세요.');
    await shakeHead;
    await say('고맙습니다, 아저씨.');
    snow.look('flee', 'left'); cue('zip_away', .6) || sfx(T, 'whoosh');
    L.fern[0].wiggle(4, 500);
    ffly.flies.slice(0, 2).forEach(({ f }) => f.parentNode && f.animate([{ translate: '0 0' }, { translate: '-300px 40px' }], { duration: 1600, fill: 'forwards', easing: 'ease-in', composite: 'add' }));
    await Promise.all([say('백설공주는 어두운 숲을 혼자 달리고 또 달렸어요.'),
      (async () => { await snow.move(X(-120, 240), 530, 1600, 'ease-in'); hide(snow); })()]);

    /* ===== 3. 작은 집 (톡 1: 첫 조작) ===== */
    const FAR = .62;                                       /* 집이 멀리 보이는 장면: 카메라를 당겨 화면 속 백설 크기는 다른 장면과 같다 */
    await T.sceneCard(tr('작은 집'), () => {
      scene('house_front_v2'); tint(T, '#E8703A', .16);       /* 해 질 녘 */
      door.reset(true);                                    /* 그림 속 집의 문 자리에 딱 맞춘 문 (해 질 녘 빛을 벽 조각에도) */
      put(T, snow, 520, 352, { look: 'stand', s: FAR });
      if (!P) put(T, L.fern[0], 110, 448, { s: FAR });       /* 앞 가림(가로만): 화면 왼쪽 아래 모서리 */
      camSnap(X(500, 380), P ? 270 : 280, P ? 1.5 : 1.3);
    }, door.pos);
    await Promise.all([say('날이 저물 무렵, 백설공주는 숲속에서 아주 작은 집을 찾았어요.'), snow.move(410, 352, 1800)]);
    /* 문 바로 옆까지 다가가 두드린다 (문을 연 사람처럼 문 가까이 서서 열리는 문을 본다) */
    await Promise.all([say('어머, 정말 작은 집이네. 계세요? 아무도 안 계세요?'), snow.move(388, 352, 1200)]);
    snow.turn('left');
    door.front.animate([{ translate: '0 0' }, { translate: '0 -3px' }, { translate: '0 0' }], { duration: 900, iterations: 3, easing: 'ease-in-out' });
    await T.ask('문을 톡 두드려 볼까요?', () => T.tap(door.pos, { prompt: '문을 톡 두드려 볼까요?' }));
    sfx(T, 'knock', () => T.tone([180, 90], .12, { type: 'square', vol: .12 })); T.pop(314, 170, tr('똑똑!'));
    await sleep(700);
    sfx(T, 'creak', () => sfx(T, 'door'));
    door.front.getAnimations().forEach(n => n.cancel());
    /* 문이 왼쪽 경첩을 축으로 안쪽(방 안)으로 열린다: 문짝은 돌 테 뒤에서 좁아지고, 오른쪽 구멍으로 창빛·식탁이 있는 방이 보인다 */
    await door.open(() => T.pop(314, 150, tr('삐걱!')));
    await say('삐걱, 문이 열렸어요. 집 안에는 아무도 없었어요.');
    /* 문 안으로 들어간다: 문 앞까지 걸어가 문지방에 올라서며(안쪽으로 한 걸음, 원근만큼 작아짐) →
       문틀·벽 조각 뒤(slot)로 옮겨 문 구멍 안에서만 보이게 → 어두운 방 안쪽으로 멀어지며 어두워지다 사라진다.
       문지방 위 크기 .44×FAR 는 문 구멍(열린 문짝 오른쪽 x 307~344, 아치 꼭대기 245)에 몸이 다 들어가는 크기라 옮길 때 잘림이 없다 */
    const EX = 325, SILL3 = 336.5;
    const tf = (x, y, s) => `translate(${x}px,${y}px) scale(${s},${s})`;
    const stepTo = async (x, y, s, ms, extra) => {
      const from = tf(snow.x, snow.y, snow.scale), to = tf(x, y, s);
      snow.pos.removeAttribute('transform');
      await Promise.all([T.anim(snow.pos, [{ transform: from }, { transform: to }], { duration: ms, easing: 'ease-in-out' }), extra && extra()]);
      snow.pos.style.transform = ''; snow.scale = s; snow.place(x, y);
    };
    await snow.move(EX, 350, 900);
    await stepTo(EX, SILL3, .44, 600);
    door.wall.style.display = ''; door.slot.appendChild(snow.pos);
    await stepTo(EX + 2, SILL3 - 6, .3, 1000, () => T.anim(snow.body, [{ filter: 'brightness(1)', opacity: 1 }, { filter: 'brightness(.35)', opacity: 1, offset: .6 }, { filter: 'brightness(.2)', opacity: 0 }], { duration: 1000, easing: 'ease-in' }));
    hide(snow); snow.body.style.filter = ''; snow.body.style.opacity = ''; door.wall.style.display = 'none';
    T.world.appendChild(snow.pos);
    await sleep(200);

    /* ===== 4. 작은 식탁 ===== */
    const C7 = 330, FL = 548, CHX = [450, 530, 610, 690, 770, 850];
    await T.sceneCard(tr('작은 식탁'), () => {
      scene('house_table2');
      put(T, table, 640, FL - 30);
      chairs.forEach((c, i) => put(T, c, i < 6 ? CHX[i] : C7, FL));
      put(T, snow, 150, FL, { look: 'stand' });
      if (P) camSnap(380, 280, 1);
    }, table.pos);
    await say('작은 식탁 위에 작은 접시와 작은 컵이 나란히 놓여 있었어요.');
    await snow.move(X(230, 300), FL, 700);
    await say('배가 너무 고파요. 한 접시에서 다 먹으면 미안하니까, 조금씩만 먹을게요.');
    /* 접시마다 조금씩 맛보고(냠), 컵마다 한 모금(꿀꺽). 식탁 앞을 따라 걷는다 */
    snow.look('eat');
    const eating = (async () => {
      for (const [x, w] of [[500, '냠!'], [640, '꿀꺽!'], [780, '냠냠!']]) {
        follow(x); await snow.move(x, FL, 650);
        sfx(T, w === '꿀꺽!' ? 'gulp' : 'chomp', () => popSfx(T)); snow.hop(10, 300); T.pop(x, FL - 250, tr(w));
        await sleep(700);
      }
    })();
    await say('백설공주는 접시마다 한 입씩, 컵마다 한 모금씩 먹었어요.');
    await eating;
    /* 일곱 번째 작은 의자에 앉는다. 백설은 제 크기 그대로라 의자가 작다 (무릎이 올라온 앉은 그림) */
    snow.look('stand');
    follow(C7); await snow.move(C7 + 50, FL + 4, 1300);
    const sit = (async () => {
      await sleep(2600);                                   /* "영차," 에 맞춰 앉는다 */
      hide(chairs[6]);                                     /* 앉은 그림에 의자가 함께 있다 → 그 자리의 의자는 감춘다 */
      put(T, snow, C7 + 170 * .6017 * .215, FL, { look: 'chair', to: 'right' }); /* 그림 속 의자 가운데를 의자 자리에 */
      sfx(T, 'squeak', () => popSfx(T)); snow.wiggle(4, 380); T.pop(C7, FL - 240, tr('영차!'));
    })();
    await say('의자가 정말 작네. 조금 작지만… 영차, 앉았다!');
    await sit;
    cue('sleepy_tuba', .6);
    await say('하아암, 너무 졸려요.');
    await sleep(300);

    /* ===== 5. 일곱 번째 침대 ===== */
    /* 작은 침대 일곱 개를 두 줄로: 뒷줄 3·4·5·6, 앞줄 1·2·7 (백설이 누워 보는 침대는 앞줄이라 가리지 않는다) */
    const BS = BED_H / 100, BY_B = 468, BY_F = 556;
    const BPOS = { 2: [170, BY_B], 3: [390, BY_B], 4: [610, BY_B], 5: [830, BY_B], 0: [160, BY_F], 1: [500, BY_F], 6: [840, BY_F] };
    const layBeds = () => { [2, 3, 4, 5, 0, 1, 6].forEach(i => put(T, beds[i], BPOS[i][0], BPOS[i][1], { s: BS })); };
    /* 누운 백설: 침대째 그린 그림으로 그 침대를 바꿔 끼운다 (침대가 짧아 무릎이 올라오고 발끝이 닿는다) */
    let lying = -1;
    const onBed = (i, look) => {
      if (lying >= 0) beds[lying].pos.style.display = '';
      put(T, snow, BPOS[i][0] + BED_DX[look], BPOS[i][1], { look });
      T.world.insertBefore(snow.pos, beds[i].pos.nextSibling); hide(beds[i]); lying = i;
    };
    await T.sceneCard(tr('작은 침대'), () => {
      scene('house_bed2');
      layBeds(); lying = -1;
      put(T, snow, X(60, 60), BY_F + 2, { look: 'stand' });
      if (P) camSnap(160, 280, 1);
    }, beds[0].pos);
    await say('방에는 작은 침대가 나란히 놓여 있었어요.');
    onBed(0, 'bedknees'); cue('boing', .6) || popSfx(T); snow.wiggle(3, 420); T.pop(300, BY_F - 200, tr('끙!'));
    await say('이 침대는 너무 짧아요. 다리가 안 펴져요.');
    follow(500, 500); onBed(1, 'bedtoes'); cue('boing', .6) || popSfx(T); snow.wiggle(3, 420); T.pop(390, BY_F - 240, tr('쿵!'));
    await say('이 침대는 불편해요. 발끝이 쿵 닿아요.');
    follow(840, 700); onBed(6, 'bedcurl'); sfx(T, 'paper_down', () => popSfx(T)); T.pop(840, BY_F - 230, tr('쏙!'));
    await say('몸을 동그랗게 웅크리면… 조금 작지만 포근해요. 잘 자요…');
    T.pop(790, BY_F - 230, tr('새근새근'));
    await say('백설공주는 스르르 잠이 들었어요.');
    await sleep(600);

    /* ===== 6. 일곱 난쟁이 ===== */
    const crewN = crew(T, { lanterns: true }); hide(crewN);
    let night;
    await T.sceneCard(tr('일곱 난쟁이'), () => {
      scene('house_bed2'); night = tint(T, '#1F2A56', .45); amb('crickets_night_1');
      layBeds(); lying = -1;
      onBed(6, 'bedcurl');
      put(T, crewN, -260, 560);
      if (P) camSnap(560, 280, 1);
    }, beds[6].pos);
    cue('tiptoe_pizz', .7) || sfx(T, 'step_wood');
    await Promise.all([say('밤이 되자, 산에서 일하던 일곱 난쟁이가 집으로 돌아왔어요.'), crewN.move(X(330, 460), 560, 2200)]);
    const WHO = ['누가 내 의자에 앉았지?', '누가 내 접시에서 먹었지?', '누가 내 빵을 먹었지?', '누가 내 숟가락을 썼지?',
      '누가 내 포크를 썼지?', '누가 내 컵으로 마셨지?', '어? 내 침대에 누가 자고 있어!'];
    /* 세로 화면: 말하는 난쟁이를 따라가다 일곱째에서 백설이 자는 침대까지 함께 보이게 */
    const dwX = i => crewN.x - 150 * ASP.dwarfs_row / 2 + 150 * ASP.dwarfs_row / 7 * (i + .5);
    for (let i = 0; i < 7; i++) { if (P) T.camTo(i < 6 ? dwX(i) : 740, 280, 1, 450); crewN.hopOne(i); await say(WHO[i]); }
    glow(snow, 1200);
    crewN.hopAll(10, 380);
    await say('와아, 정말 예쁜 아이다! 깨우지 말자, 쉿!');
    /* 아침: 밤빛이 걷히고 백설이 일어나 앉는다 */
    await T.anim(night, [{ opacity: .45 }, { opacity: 0 }], 1200); night.setAttribute('opacity', 0);
    await say('아침이 되자 백설공주가 눈을 떴어요.');
    amb('birds_chirp_1'); cue('ding_glock', .7) || sfx(T, 'sparkle'); beds[6].pos.style.display = ''; lying = -1;
    put(T, snow, BPOS[6][0] + 6, BPOS[6][1] - 34, { look: 'awake' }); T.world.insertBefore(snow.pos, beds[6].pos.nextSibling);
    snow.hop(10, 300);
    await say('깜짝이야! 저는 백설공주예요. 갈 곳이 없어요. 여기서 지내도 될까요?');
    crewN.hopAll(14, 380);
    await say('그럼! 대신 우리가 일하러 간 사이, 낯선 사람에겐 절대 문을 열지 마!');
    snow.hop(10, 300);
    await say('네, 약속할게요.');
    await sleep(300);

    /* ===== 7. 큰 침대 ===== */
    const BIG = 190 / 150;                                 /* 큰 침대: 백설 키보다 길게 */
    await T.sceneCard(tr('큰 침대'), () => {
      scene('house_bed2');
      put(T, planks, X(500, 500), 548, { s: 1.3 });
      put(T, hammerD, X(330, 400), 548, { to: 'right' });
      put(T, plankD, X(670, 600), 548, { to: 'left' });
      put(T, snow, X(860, 640), 540, { look: 'stand' });
      if (P) hide(snow);
    }, planks.pos);
    await say('백설공주는 집안일을 하고, 난쟁이들은 산에서 일했어요. 모두 사이좋게 지냈어요.');
    hammerD.hop(10, 360); plankD.hop(10, 360);
    await say('백설공주에게는 우리 침대가 너무 작아. 큰 침대를 만들어 주자!');
    const hammering = (async () => {
      for (let i = 0; i < 3; i++) {
        hammerD.wiggle(10, 360); plankD.hop(10, 360);
        cue('hammer', .7) || sfx(T, 'knock', () => T.tone([180, 90], .12, { type: 'square', vol: .12 }));
        T.pop(X(500, 500) + [-60, 50, -10][i], 330, tr(['뚝딱!', '쿵쿵!', '뚝딱!'][i]));
        await sleep(900);
      }
    })();
    await say('뚝딱뚝딱, 쿵쿵!');
    await hammering;
    await fadeOut(T, planks, 300);
    put(T, bigBed, X(500, 500), 552, { s: BIG }); fadeIn(bigBed, 500); sfx(T, 'tada', () => popSfx(T)); glow(bigBed, 1200);
    hide(hammerD); put(T, smileD, X(330, 400), 548); smileD.hop(14, 340);
    if (P) { put(T, snow, 640, 540, { look: 'stand' }); camSnap(560, 280, 1); }
    snow.hop(16, 340);
    await say('와아, 고맙습니다!');
    await sleep(400);

    /* ===== 8. 침대 여덟 개 (배움 놀이: 세기 — 톡 한 번, 1~8 저절로) ===== */
    /* 작은 침대 일곱(두 줄로 엇갈려, 왼쪽부터 1~7) + 오른쪽 큰 침대(8) */
    const SX = [70, 160, 250, 340, 430, 520, 610], SYs = i => (i % 2 ? 552 : 496), SS = i => (i % 2 ? .82 : .74), SY = 552, BIGX = 790;
    let bedsG;
    await T.sceneCard(tr('침대 여덟 개'), () => {
      scene('house_bed2');
      hide(smileD); hide(plankD);
      put(T, dwarfs, 340, 470, { s: .8 });                /* 난쟁이들은 침대 뒤 벽 앞에 */
      put(T, snow, 930, 552, { look: 'stand' });
      bedsG = T.el('g', {}, T.world);
      [0, 2, 4, 6, 1, 3, 5].forEach(i => { put(T, beds[i], SX[i], SYs(i), { s: SS(i) }); bedsG.appendChild(beds[i].pos); });
      put(T, bigBed, BIGX, SY + 2); bedsG.appendChild(bigBed.pos);
      T.world.appendChild(snow.pos);
      if (P) camSnap(SX[2], 280, 1);
    }, bigBed.pos);
    await T.ask('침대가 몇 개일까요? 톡 눌러 봐요.', () => T.tap(bedsG, { prompt: '침대가 몇 개일까요? 톡 눌러 봐요.' }));
    const all = [...beds, bigBed];
    for (let i = 0; i < 8; i++) {
      const b = all[i];
      if (P) T.camTo(Math.min(Math.max(b.x, SX[2]), BIGX), 280, 1, 450);
      AudioFX.countBeat && AudioFX.countBeat(i + 1); cue('marimba_' + (i + 1), .8) || popSfx(T); vo('n' + (i + 1));
      glow(b, 800); b.hop(i === 7 ? 18 : 12, 360);
      T.pop(b.x, i === 7 ? 220 : (i % 2 ? 250 : 190), tr(NUM[i]));
      await sleep(i === 6 ? 1300 : 950);                  /* 일곱 다음에 한 박 쉬고 큰 침대 */
    }
    if (P) T.camTo(560, 280, 1, 700);
    dwarfs.hop(14, 360);
    await say('작은 침대 일곱 개, 큰 침대 하나, 모두 여덟 개!');
    snow.hop(16, 360);
    /* 이제 잘 시간! 침대 색 찾기 (고르기 3번, 일곱 색에서 겹치지 않게 무작위). 줄거리와 무관한 배움 놀이 */
    await say('이제 잘 시간! 난쟁이들이 침대를 찾아요.');
    const BCOL = ['빨간', '주황', '노란', '초록', '파란', '보라', '갈색'];   /* 침대 1~7 이불 색 */
    let relaid = false;
    if (P) {                                              /* 세로 화면: 일곱 침대를 두 줄씩 모아 한 화면에 */
      await T.anim(bedsG, [{ opacity: 1 }, { opacity: 0 }], 250);
      hide(dwarfs);
      const GP = [[190, 200], [340, 200], [490, 200], [265, 320], [415, 320], [265, 440], [415, 440]];
      beds.forEach((b, i) => put(T, b, GP[i][0], GP[i][1], { s: .85 }));
      hide(bigBed); camSnap(340, 280, 1); relaid = true;
      beds.forEach(b => fadeIn(b, 350));
      await sleep(400);
    }
    const order = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - .5).slice(0, 3);
    for (const k of order) {
      const q = BCOL[k] + ' 침대를 찾아 볼까요?';
      const opts = beds.map((b, i) => ({ el: b.pos, ok: i === k,
        onWrong: async () => { await b.wiggle(8, 360); await say('그건 ' + BCOL[i] + ' 침대예요.'); } }));
      beds.forEach(b => padHit(T, b.pos));
      await T.ask(q, () => T.choose(opts, { prompt: q }));
      const b = beds[k];
      glow(b, 1200); b.hop(14, 400); cue('ding_glock', .8) || sfx(T, 'sparkle', () => popSfx(T));
      T.pop(b.x, b.y - 100 * (relaid ? .85 : (k % 2 ? .82 : .74)) - 30, tr('쿨쿨'));
      await say('맞아요, ' + BCOL[k] + ' 침대!');
      await sleep(300);
    }
    if (relaid) {
      [0, 2, 4, 6, 1, 3, 5].forEach(i => put(T, beds[i], SX[i], SYs(i), { s: SS(i) }));
      put(T, bigBed, BIGX, SY + 2); put(T, dwarfs, 340, 470, { s: .8 }); T.world.insertBefore(dwarfs.pos, beds[0].pos); camSnap(560, 280, 1);
    }
    await say('모두 잘 자요. 함께 지내서 행복해요.');
    await sleep(400);

    /* ===== 9. 할머니와 사과 ===== */
    /* 다시 거울: 짧게 */
    await T.sceneCard(tr('다시 거울'), () => { mf = mirrorRoom(); queen.look('mirror'); }, mirror.pos);
    await say('거울아, 거울아, 이 나라에서 누가 제일 예쁘니?');
    sfx(T, 'sparkle'); mf.show(); mirrorShine();
    await say('숲속 일곱 난쟁이 집의 백설공주가 제일 예뻐요.');
    queen.look('fist'); T.shake(); cue('surprise_sting', .7) || sfx(T, 'thud'); queen.hop(14, 300); chandJolt();
    await sleep(500);
    /* 난쟁이 집 앞. 백설은 문을 열지 않고 집 안에서 창문으로 내다보며 사과를 받는다 (원작: 문은 열지 않음).
       그림 속 창문 구멍(WX·SILL, 폭 약 37·높이 44)만 보이게 자르고, 몸은 집 안(어두운 방)에 있어 벽 앞으로 나오지 않는다 */
    const WX = 162, SILL = 306, WS = .36;
    let winG;
    await T.sceneCard(tr('사과 할머니'), () => {
      scene('house_front_v2');
      door.reset();
      winG = T.el('g', {}, T.world);
      const id = 'swWin' + (++uid);
      T.el('rect', { x: WX - 17, y: SILL - 44, width: 34, height: 44, rx: 15 }, T.el('clipPath', { id }, winG));
      winG.setAttribute('clip-path', `url(#${id})`);
      T.el('rect', { x: WX - 20, y: SILL - 48, width: 40, height: 52, fill: '#4A3626' }, winG);   /* 창 너머 어두운 방 */
      put(T, snow, WX, SILL + 35, { look: 'receive', s: WS }); winG.appendChild(snow.pos);
      put(T, granny, 560, 356, { to: 'left', s: FAR });
      if (!P) put(T, L.fern[0], 110, 448, { s: FAR });
      camSnap(X(500, 250), 280, P ? 1.5 : 1.3);
    }, snow.pos);
    await Promise.all([say('왕비는 할머니로 변장하고 빨간 사과를 들고 숲으로 갔어요.'), granny.move(262, 356, 2400)]);
    const handX = () => granny.x - 215 * .765 * .42 * FAR, handY = 356 - 215 * .52 * FAR;
    put(T, apple, handX(), handY, { look: 'whole', s: FAR }); fadeIn(apple, 300);
    await say('사과 사세요~ 아주 맛있는 사과란다.');
    snow.wiggle(4, 500);
    await say('문은 열면 안 돼요. 난쟁이들과 약속했거든요.');
    await say('그럼 창문으로 하나만 맛보렴.');
    apple.setScale(.5); await apple.move(WX + 6, SILL - 8, 800);
    sfx(T, 'pop');
    await sleep(400);
    apple.look('bitten'); sfx(T, 'chomp', () => popSfx(T)); T.pop(WX, SILL - 60, tr('아삭!'));
    const fall = (async () => {
      await sleep(1600);
      hide(apple);
      cue('whistle_down', .6) || sfx(T, 'slide_down');
      await snow.move(WX, SILL + 35 + 70, 1500, 'ease-in');  /* 창틀 아래로 스르르 (구멍 밖은 잘려 안 보인다) */
      hide(snow); winG.style.display = 'none';   /* 닫힌 창으로 돌아간다 */
      granny.turn('right');
      await granny.move(560, 356, 1600);
      hide(granny);
    })();
    await say('백설공주는 사과를 한 입 베어 물고, 그만 스르르 잠이 들었어요.');
    await fall;
    await sleep(300);

    /* ===== 10. 유리관과 왕자 ===== */
    /* 저녁에 돌아온 난쟁이들 (같은 집 앞, 해 질 녘) */
    tint(T, '#E8703A', .16);
    put(T, worry, 520, 360, { s: FAR });
    await worry.move(X(360, 290), 360, 1400);
    await say('저녁에 돌아온 난쟁이들은 깜짝 놀랐어요.');
    worry.hop(8, 300);
    await say('백설공주님, 일어나요! 일어나세요…');
    await sleep(300);
    const CX = 500, CY = 530;
    /* 유리관 속 백설: 관 그림(뒤) → 백설 → 같은 관 그림을 옅게 한 장(유리) + 꽃 장식 받침만 오린 한 장(앞).
       그래서 백설이 관 위가 아니라 유리 안에 누워 보인다 */
    const CW = 150 * ASP.prop_coffin;
    let glass = null;
    const inCoffin = () => {
      put(T, snow, CX + 4, CY - 150 * .24, { look: 'coffin', to: 'left' });
      glass = T.el('g', {}, T.world);
      const href = artSrc('prop_coffin'), box = { x: CX - CW / 2, y: CY - 150, width: CW, height: 150, preserveAspectRatio: 'none' };
      T.el('image', { href, ...box, opacity: .3 }, glass);
      const cid = 'swBase' + (++uid);
      T.el('rect', { x: CX - CW / 2, y: CY - 150 * .27, width: CW, height: 150 * .27 }, T.el('clipPath', { id: cid }, glass));
      T.el('image', { href, ...box, 'clip-path': `url(#${cid})` }, glass);
      glass.style.transformBox = 'view-box';
    };
    /* 빈터 층 소품 (VISUAL_PLAN §5): 들꽃 띠 → 아기 사슴 → 토끼 → (유리관·백설·난쟁이·왕자) → 새 → 벚꽃 가지·나비·꽃 묶음 */
    const BIRD = { blue: [X(70, 640), X(122, 118)], robin: [X(930, 742), X(118, 112)] };   /* 10장: 가지 위 */
    const meadowBack = () => {
      [170, 500, 830].forEach((x, i) => put(T, L.fmid[i], x, 556, { to: i === 1 ? 'right' : 'left' }));
      put(T, L.fawn, X(960, 770), 548, { to: 'left' });
      put(T, L.rabbit, X(880, 700), 556);
    };
    const meadowFront = (fast = false) => {
      put(T, L.branch[0], X(940, 700), 156); sway(L.branch[0], 1, 8000);
      if (!P) { put(T, L.branch[1], 60, 156, { to: 'right' }); sway(L.branch[1], 1, 8600); }
      put(T, L.blue, BIRD.blue[0], BIRD.blue[1], { to: 'right' }); put(T, L.robin, BIRD.robin[0], BIRD.robin[1], { to: 'left' });
      if (P) hide(L.blue);
      const bx = X([140, 880, 960], [330, 660, 600]), by = [250, 300, 220];
      L.bf.forEach((b, i) => { if (i < (fast ? 3 : 2)) { put(T, b, bx[i], by[i]); flutter(b, fast); } else hide(b); });
      put(T, L.ffront[0], 985, 600); put(T, L.ffront[1], 25, 618, { to: 'right' });
      front(L.branch[0], L.branch[1], L.blue, L.robin, ...L.bf, ...L.ffront);
    };
    await T.sceneCard(tr('유리관'), () => {
      scene('hill_v2');
      meadowBack();
      put(T, coffin, CX, CY);
      inCoffin();
      put(T, worry, X(205, 360), 548);
      meadowFront();
      if (P) camSnap(430, 280, 1);
    }, coffin.pos);
    /* "날마다 곁을 지켰어요": 꽃잎 두 장만 천천히 */
    for (let i = 0; i < 2; i++) {
      const p = prop(T, 'prop_petals', 44); p.pos.style.pointerEvents = 'none';
      put(T, p, X(860, 640) - i * 120, 40);
      p.body.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 0 }, { transform: 'translate(-30px,200px) rotate(140deg)', opacity: 1, offset: .5 }, { transform: 'translate(10px,420px) rotate(280deg)', opacity: 0 }],
        { duration: 6500, delay: 600 + i * 1500, fill: 'forwards', easing: 'ease-in-out' });
    }
    await say('난쟁이들은 백설공주를 맑은 유리관에 눕히고, 날마다 곁을 지켰어요.');
    put(T, prince, X(1100, 900), 540); prince.face('left');
    front(L.branch[0], L.branch[1], L.blue, L.robin, ...L.bf, ...L.ffront);
    await Promise.all([say('어느 날, 이웃 나라 왕자님이 숲을 지나가다 백설공주를 보았어요.'), prince.move(X(770, 640), 540, 2200), follow(560, 2200)]);
    await say('이 공주님을 제 성으로 모셔 가 정성껏 돌보고 싶어요.');
    /* 관을 옮기다 덜컹 → 목에 걸린 사과 조각이 툭 빠진다 */
    const jolt = (async () => {
      await sleep(1200);
      sfx(T, 'thud'); T.shake(); T.pop(CX, CY - 220, tr('덜컹!'));
      const j = [{ translate: '0 0', rotate: '0deg' }, { translate: '0 -14px', rotate: '-1.5deg' }, { translate: '0 0', rotate: '1deg' }, { translate: '0 0', rotate: '0deg' }];
      await Promise.all([coffin.pos, snow.pos, glass].map(n => { n.style.transformOrigin = `${CX}px ${CY}px`; return n.animate(j, 650).finished; }));
      const mouthX = snow.x - 98 * ASP.snow_bedsleep * .27, mouthY = snow.y - 98 * .55;
      put(T, piece, mouthX, mouthY);
      sfx(T, 'pop');
      await piece.move(mouthX - 70, 560, 700, 'ease-in');
      T.pop(mouthX - 70, 470, tr('툭!'));
    })();
    await say('그런데 관을 옮기다가 덜컹! 목에 걸렸던 사과 조각이 툭 빠졌어요.');
    await jolt;
    await sleep(600);

    /* ===== 11. 깨어나요 (톡: 백설의 손을 톡) ===== */
    const crewE = crew(T); hide(crewE);
    await T.sceneCard(tr('깨어나요'), () => {
      scene('hill_v2');
      meadowBack();
      put(T, coffin, CX, CY);
      put(T, shine, CX, CY - 40); hide(shine);
      inCoffin();
      put(T, crewE, X(195, 330), 550, { s: .85 });
      put(T, prince, X(770, 650), 540);
      meadowFront();
      if (P) camSnap(500, 280, 1);
    }, snow.pos);
    /* 유리 뚜껑·관 앞판이 백설 위를 덮고 있어 백설을 직접 누를 수 없다 → 맨 위에 투명한 누르는 자리를 따로 둔다 (2026-10-20) */
    const hand = T.el('circle', { cx: snow.x, cy: snow.y - 48, r: 90, fill: '#fff', opacity: 0 }, T.world);
    snow.pos.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 1600, iterations: 3, easing: 'ease-in-out' });
    await T.ask('백설공주의 손을 톡 눌러 볼까요?', () => T.tap(hand, { prompt: '백설공주의 손을 톡 눌러 볼까요?' }));
    hand.remove();
    glass.remove();                                        /* 유리 뚜껑을 열었다 */
    T.world.insertBefore(shine.pos, coffin.pos.nextSibling);
    shine.pos.style.display = ''; fadeIn(shine, 700);
    shine.body.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(.9)' }], { duration: 1600, iterations: Infinity, easing: 'ease-in-out' });
    sfx(T, 'sparkle', () => T.tone([700, 1400], .4, { vol: .12 }));
    awakenMusic();
    put(T, snow, CX + 10, CY - 30, { look: 'awake' }); fadeIn(snow, 500); glow(snow, 1200);
    T.world.appendChild(prince.pos); T.world.appendChild(crewE.pos);
    /* 깨어남 연출(VISUAL_PLAN §5): 반짝 → 새 두 마리가 유리관 테두리로 → 토끼·사슴 깡충 → 나비 빠르게 → 꽃잎은 벚꽃 가지에서 */
    sparkleRing(T, CX, CY - 80, 190, 18, ['#EBD08A', '#F6ECD8']);
    if (!P) T.camTo(500, 300, 1.08, 900).then(() => T.camTo(500, 280, 1, 1400));
    const land = async (b, x, ms, d) => {
      await sleep(d); b.pos.style.display = ''; T.world.appendChild(b.pos);
      const x0 = b.x, y0 = b.y, y1 = CY - 150 + 12, mx = (x0 + x) / 2, my = Math.min(y0, y1) - 60;
      b.pos.removeAttribute('transform');
      const t = (xx, yy) => `translate(${xx}px,${yy}px) scale(${b.flip * b.scale},${b.scale})`;
      await T.anim(b.pos, [{ transform: t(x0, y0) }, { transform: t(mx, my) }, { transform: t(x, y1) }], { duration: ms, easing: 'ease-in-out' });
      b.pos.style.transform = ''; b.place(x, y1); await b.hop(6, 300);
    };
    land(L.blue, CX - 150, 900, 300); land(L.robin, CX + 150, 900, 600);
    (async () => { await sleep(800); popSfx(T); L.rabbit.hop(14, 400).then(() => L.rabbit.hop(14, 400)); L.fawn.hop(8, 420); })();
    (async () => { await sleep(1000); L.bf.forEach((b, i) => { const bx = X([140, 880, 960], [330, 660, 600]), by = [250, 300, 220]; put(T, b, bx[i], by[i]); flutter(b, true); }); front(...L.bf, ...L.ffront); })();
    /* 꽃잎이 팔랑팔랑 내린다 (벚꽃 가지 자리에서) */
    for (let i = 0; i < 9; i++) {
      const p = prop(T, 'prop_petals', 44 + (i % 3) * 14); p.pos.style.pointerEvents = 'none';
      put(T, p, P ? 600 + (i % 5) * 30 : (i < 5 ? 880 + i * 30 : 20 + (i - 5) * 45), 60);
      p.body.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 0 }, { transform: 'translate(-30px,240px) rotate(160deg)', opacity: 1, offset: .5 }, { transform: 'translate(20px,560px) rotate(320deg)', opacity: 0 }],
        { duration: 5200 + (i % 4) * 700, delay: i * 260, iterations: 2, easing: 'ease-in-out' });
    }
    await say('어머, 제가 오래 잤나 봐요.');
    prince.hop(10, 360);
    await say('이제 괜찮아요. 함께 성으로 가요.');
    crewE.hopAll(18, 420);
    await say('만세! 백설공주가 깨어났다!');
    await say('낯선 사람이 주는 것은 꼭 어른에게 먼저 물어봐요.');
    await sleep(300);
    await say('왕비는 멀리 떠났어요');
    T.confetti(); cue('party_horn', .9);
    await Promise.all([snow.hop(20, 460), crewE.hopAll(20, 460), prince.hop(14, 460)]);
    try { AudioFX.stopAmbient(); } catch (e) { /* */ }
    T.finale();
    await sleep(1500);
    return '낯선 사람이 주는 것은 꼭 어른에게 먼저 물어봐요.';
  }

  Tale.mount({ title: '백설공주', subtitle: '질투는 마음을 해쳐요', read: true, run: T => run(Tale.api) });
})();
