/* 신데렐라 — 샤를 페로 「신데렐라 또는 작은 유리 구두」 원작 그대로. 기획: tales/cinderella/PLAN.md (10장, 2026-10-20 확정)
   재투성이 → 언니 머리 꾸미기(톡: 첫 조작) → 혼자 남은 밤, 요정 대모 → 호박(톡) → 생쥐 여섯 마리(덫 톡 한 번, 1~6 저절로) →
   드레스와 유리 구두 → 첫째 밤(오렌지, 약속대로 귀가) → 둘째 밤 열두 시(시계 보기 고르기) → 구두 신어 보기(발 크기 고르기) → 용서(인사 톡).
   톡은 세 번(언니 머리 · 호박 · 마지막 인사) + 덫 한 번. 연타 없음. 줄거리를 바꾸는 선택 없음. 디즈니 요소(말하는 생쥐, 노래 주문) 없음.
   교훈: 착한 마음은 힘들 때도 잃지 않고, 나를 괴롭힌 사람도 용서할 수 있다.
   그림: assets/v3w/cd2_*.webp (목록 tools/app/gen/jobs_cinderella2.json, 후처리 tools/app/gen/post_cinderella2.py).
   화려하게 다시 그리기(VISUAL_PLAN.md, 2026-10-22): 배경 6장 v2 + 층 소품 cd2_layer_*(누름 없음) + 컷 5장 v2 (후처리 tools/app/gen/post_v2.py).
   사람은 모두 머리 크기가 같다: 자세 그림마다 높이(HT)를 머리 크기에 맞춰 정해 두었다 (모두 같은 배율). */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 비율 (사방 여백 없이 오린 그림) */
  const ASP = { card_12: 0.9924, card_3: 0.9924, card_6: 0.9924, card_face: 0.9917, cind_braid: 0.53, cind_cry: 0.6433, cind_dance: 0.815,
    cind_give: 0.535, cind_gown: 0.6333, cind_hug: 0.6783, cind_joy: 0.44, cind_run: 0.795, cind_sit: 0.7083, cind_stand: 0.44,
    cind_surprise: 0.44, clock: 0.9883, clock_hour: 0.26, clock_min: 0.14, coachman: 0.7783, fairy_appear: 0.685, fairy_wand: 0.7933,
    foot: 0.4867, foot_big: 2.0, foot_bigger: 2.0, foot_small: 2.0, footman: 0.5333, horse: 0.9883, lizard: 1.305, mouse: 0.98,
    prince_dance: 0.59, prince_slipper: 0.4817, prince_stand: 0.36, prop_basket: 1.0733, prop_coach: 1.1033, prop_dress: 0.9633,
    prop_letter: 1.3767, prop_orange: 0.9867, prop_pumpkin: 1.0433, prop_ribbon: 1.1217, prop_slipper: 1.275, prop_trap: 0.9883, rat: 1.0417,
    sis1_foot: 0.8367, sis1_proud: 0.6417, sis1_sorry: 0.59, sis1_stand: 0.585, sis2_foot: 0.825, sis2_proud: 0.6017, sis2_sorry: 0.5117,
    sis2_stand: 0.5417, step_point: 0.6533, step_stand: 0.4017,
    /* 화려하게 다시 그리기(VISUAL_PLAN.md, 2026-10-22): 중간 층·앞 가림 층 소품 (tools/app/gen/post_v2.py 로 오림) */
    layer_chandelier: 0.92, layer_chandelier_small: 0.8867, layer_curtain_swag: 2.4725, layer_curtain_side: 0.3733, layer_candelabra: 0.5683,
    layer_vase: 0.6933, layer_garland: 3.2491, layer_lantern_post: 0.2483, layer_rose_urn: 0.95, layer_moonflowers: 0.87,
    layer_pumpkin_vine: 1.365, layer_star_burst: 0.9683, layer_basket_veg: 1.15 };
  /* 사람 그림 높이: 자세마다 그림 속 머리 크기가 달라서, 나란히 놓고 머리가 같은 크기로 보이게 맞춘 높이 (앉은 자세는 낮게, 어른은 조금 높게) */
  const HT = { cind_cry: 165, cind_sit: 178, step_stand: 212, step_point: 212, prince_stand: 210, prince_dance: 210, prince_slipper: 210, fairy_appear: 205, fairy_wand: 205 };
  /* 그림이 보는 쪽 ('left' | 'right' | 'front') */
  const NAT = { cind_braid: 'right', cind_dance: 'right', cind_give: 'left', cind_run: 'left', cind_sit: 'right', step_point: 'right',
    sis1_foot: 'right', sis2_foot: 'right', fairy_wand: 'right', prince_dance: 'left', prince_slipper: 'right',
    /* 앞모습처럼 보여도 얼굴이 오른쪽으로 살짝 돌아 있는 그림 (귀가 왼쪽에 보임) — 왼쪽을 보게 하려면 뒤집어야 한다 (2026-10-20: 마지막에 가족이 신데렐라를 안 봤음) */
    cind_stand: 'right', cind_surprise: 'right', cind_joy: 'right', step_stand: 'right', sis1_proud: 'right', sis1_sorry: 'right',
    sis2_stand: 'right', sis2_proud: 'right', sis2_sorry: 'right', prince_stand: 'right', fairy_appear: 'right', mouse: 'right' };
  const FL = 532;            /* 바닥 */
  const BGS = ['kitchen_v2', 'kitchen_night_v2', 'parlor_v2', 'garden_v2', 'ballroom_v2', 'stairs_lb'];   /* 다층 배경 v2 (VISUAL_PLAN). 궁전 계단은 열두 시 빛 상자 stairs_lb(VISUAL_PLAN 재기획 2, 2026-10-24) */
  const bgSrc = k => AS + 'cd2_bg_' + k + '.webp', artSrc = k => AS + 'cd2_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 }; /* 1600×902 그림이 무대 1000×560을 덮게 */
  const K = 1.35;            /* 집 배경이 사람에 비해 커 보여서 모든 사람·소품을 같은 비율로 키움 (2026-10-20) */
  const hOf = f => HT[f] || 200;

  /* 배우: 자세 그림 여러 장 중 하나만 보인다. poses = { 이름: 그림 } (사람은 높이를 얼굴로 계산) 또는 { 이름: [그림, 높이] }
     a.look(자세, 방향) — 그림이 보는 쪽과 원하는 쪽이 다르면 뒤집는다 (앞모습은 뒤집지 않는다) */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, v]) => {
        const [f, h0] = Array.isArray(v) ? v : [v, null], h = (h0 || hOf(f)) * K, w = h * (ASP[f] || 1);
        const wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: artSrc(f), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
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

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const sfx = (T, name, fb) => AudioFX.sfx(name) || fb && fb();
  const popSfx = T => sfx(T, 'pop', () => T.tone([500, 800], .12, { vol: .12 }));
  const sparkleSfx = T => sfx(T, 'sparkle', () => T.tone([700, 1400], .4, { vol: .12 }));
  const bellSfx = T => sfx(T, 'bell', () => { T.tone(392, 1.2, { type: 'sine', vol: .2 }); T.tone(392 * 2.76, .6, { type: 'sine', vol: .05 }); });
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!', '여섯!'];

  /* 반짝이: 지팡이 마법 (종이 별 조각 대신 작은 크림색 마름모가 퍼졌다 사라진다) */
  function sparkle(T, x, y, r = 90, n = 10) {
    sparkleSfx(T);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, d = r * (.6 + (i % 3) * .2);
      const p = T.el('path', { d: 'M0 -9 L5 0 L0 9 L-5 0 Z', fill: i % 2 ? '#F6ECD8' : '#F2B366', transform: `translate(${x},${y})` }, T.world);
      p.animate([{ transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 0 },
        { transform: `translate(${x + Math.cos(a) * d * .6}px,${y + Math.sin(a) * d * .6}px) scale(1.2)`, opacity: 1, offset: .4 },
        { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d}px) scale(.4)`, opacity: 0 }], { duration: 1100, delay: i * 30, easing: 'ease-out' })
        .finished.then(() => p.remove(), () => p.remove());
    }
  }

  /* ---- 층 소품 도우미 (VISUAL_PLAN §3~7) ---- */
  /* 매달린 소품(샹들리에)은 위 끝을 축으로 살랑 */
  function sway(a, deg, ms, delay = 0) {
    a.body.getAnimations().forEach(n => n.cancel());
    const h = a.h, R = d => `translate(0px,${-h}px) rotate(${d}deg) translate(0px,${h}px)`;
    return a.body.animate([{ transform: R(-deg) }, { transform: R(deg) }, { transform: R(-deg) }], { duration: ms, delay, iterations: Infinity, easing: 'ease-in-out' });
  }
  async function jolt(T, a, deg = 4) {
    const h = a.h, R = d => `translate(0px,${-h}px) rotate(${d}deg) translate(0px,${h}px)`;
    a.body.getAnimations().forEach(n => n.cancel());
    await T.anim(a.body, [{ transform: R(0) }, { transform: R(-deg) }, { transform: R(deg * .75) }, { transform: R(-deg * .35) }, { transform: R(0) }], 800);
  }
  /* 색을 고르는 마름모 반짝이 (sparkle 와 같은 모양, 소리 없음) */
  function sparkleRing(T, x, y, r, n, colors, dur = 1200) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, d = r * (.7 + (i % 3) * .15);
      const p = T.el('path', { d: 'M0 -9 L5 0 L0 9 L-5 0 Z', fill: colors[i % colors.length], transform: `translate(${x},${y})` }, T.world);
      p.style.pointerEvents = 'none';
      p.animate([{ transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 0 },
        { transform: `translate(${x + Math.cos(a) * d * .7}px,${y + Math.sin(a) * d * .7}px) scale(1.2)`, opacity: 1, offset: .4 },
        { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d}px) scale(.4)`, opacity: 0 }], { duration: dur, delay: i * 30, easing: 'ease-out' })
        .finished.then(() => p.remove(), () => p.remove());
    }
  }
  /* 깜빡이는 작은 점들 (촛불·별·등불). pts=[[x,y,r?,색?]] */
  function twinkle(T, pts, { color = '#FFF3C4', r = 3.5, ms = 1200, parent } = {}) {
    const g = T.el('g', {}, parent || T.world); g.style.pointerEvents = 'none';
    pts.forEach(([x, y, rr, c], i) => {
      const e = T.el('circle', { cx: x, cy: y, r: rr || r, fill: c || color }, g);
      e.animate([{ opacity: .1 }, { opacity: .95 }, { opacity: .1 }], { duration: ms + (i % 3) * 500, delay: i * 330, iterations: Infinity });
    });
    return g;
  }
  /* 반딧불: Pale Gold 원(둘레 크림 한 겹)이 느리게 떠다니며 깜빡인다. 자리: 울타리 위 하늘 아래쪽(y 150~400)과 양옆 */
  function fireflies(T, n, P) {
    const g = T.el('g', {}, T.world); g.style.pointerEvents = 'none';
    for (let i = 0; i < n; i++) {
      const side = i % 3;
      const x = side === 0 ? (P ? 300 : 140) + ((i * 137) % (P ? 400 : 720)) : side === 1 ? (P ? 295 : 30) + (i * 53) % 150 : (P ? 580 : 830) + (i * 61) % 150;
      const y = side === 0 ? 150 + (i * 47) % 90 : 170 + (i * 71) % 220;
      const f = T.el('g', { transform: `translate(${x},${y})` }, g), r = 3 + (i % 3);
      T.el('circle', { r: r + 3, fill: '#F6ECD8', opacity: .5 }, f);
      T.el('circle', { r, fill: '#EBD08A' }, f);
      const dx = 25 + (i % 4) * 5, dy = 15 + (i % 3) * 5;
      f.animate([{ transform: `translate(${x}px,${y}px)` }, { transform: `translate(${x + dx}px,${y - dy}px)` }, { transform: `translate(${x - dx}px,${y + dy}px)` }, { transform: `translate(${x}px,${y}px)` }],
        { duration: 5000 + (i % 5) * 1000, iterations: Infinity, easing: 'ease-in-out' });
      f.children[1].animate([{ opacity: .25 }, { opacity: 1 }, { opacity: .25 }], { duration: 1500 + (i % 4) * 400, delay: i * 170, iterations: Infinity });
    }
    return g;
  }
  /* 밤빛 한 장 (백설공주 tint 와 같은 코드): 배경 위, 인물 아래 */
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);

  /* 시계 숫자: 그림에는 12·3·6·9만 있어서, 나머지 숫자(1·2·4·5·7·8·10·11)를 코드로 그린다.
     그림의 눈금 자리(원본 그림 픽셀 좌표)를 얼굴색 원판으로 덮고 같은 크기·색의 숫자를 얹는다. */
  const TICKS = {
    clock: { W: 593, H: 600, c: '#ECDAC0', dh: 59, p: { 1: [402, 122], 2: [475, 194], 4: [474, 393], 5: [403, 463], 7: [187, 462], 8: [118, 394], 10: [116, 195], 11: [189, 123] } },
    card: { W: 520, H: 524, c: '#EEDDBA', dh: 62, p: { 1: [352, 116], 2: [410, 175], 4: [410, 345], 5: [351, 403], 7: [168, 403], 8: [110, 345], 10: [109, 174], 11: [168, 116] } } };
  function numerals(T, g, kind, x, y, w, h) {
    const t = TICKS[kind], sx = w / t.W, sy = h / t.H, fs = t.dh * sy / .74;
    Object.entries(t.p).forEach(([n, [px, py]]) => {
      const cx = x + px * sx, cy = y + py * sy;
      T.el('circle', { cx, cy, r: 30 * sx, fill: t.c }, g);
      /* 12 옆의 1·11은 12와 붙어 보여서 살짝 아래로·바깥으로 밀고, 두 글자(10·11)는 조금 작게 */
      const k2 = +n > 9 ? .86 : 1, ox = n == 11 ? -9 : n == 1 ? 7 : 0, oy = n == 11 || n == 1 ? 8 : 0;
      const f2 = fs * k2;
      const tx = T.el('text', { x: cx + ox * sx, y: cy + oy * sy + f2 * .36, 'text-anchor': 'middle', 'font-size': f2.toFixed(1), 'font-weight': 800, fill: '#5C4332',
        'font-family': "'Arial Rounded MT Bold','Pretendard Variable',Pretendard,sans-serif", 'letter-spacing': n > 9 ? f2 * .02 : 0, 'pointer-events': 'none' }, g);
      tx.textContent = n;
    });
  }

  /* 큰 벽시계: 빈 시계판 그림 + 짧은 바늘·긴 바늘 그림(위를 가리키는 그림을 돌린다). 구멍(바늘 아래 끝)이 시계 가운데 */
  function wallClock(T, cx, cy, D) {
    const g = T.el('g', { filter: 'url(#pp)' }, T.world);
    const fw = D, fh = D / (ASP.clock || 1);
    T.el('image', { href: artSrc('clock'), x: cx - fw / 2, y: cy - fh / 2, width: fw, height: fh, preserveAspectRatio: 'none' }, g);
    numerals(T, g, 'clock', cx - fw / 2, cy - fh / 2, fw, fh);
    const hand = (f, L) => {
      const w = L * (ASP[f] || .2), hg = T.el('g', {}, g);
      T.el('image', { href: artSrc(f), x: cx - w / 2, y: cy - (L - w / 2), width: w, height: L, preserveAspectRatio: 'none' }, hg);
      return hg;
    };
    const hh = hand('clock_hour', D * .27), mh = hand('clock_min', D * .38);
    const st = { h: 0, m: 0 };
    const set = (h, m) => { st.h = h; st.m = m; hh.setAttribute('transform', `rotate(${h} ${cx} ${cy})`); mh.setAttribute('transform', `rotate(${m} ${cx} ${cy})`); };
    /* 시각(시, 분) → 바늘 각도 */
    const at = (hr, min) => set(((hr % 12) + min / 60) * 30, min * 6);
    /* 열두 시까지 천천히 (바늘이 앞으로만 돈다) */
    const toTwelve = ms => new Promise(res => {
      const h0 = st.h, m0 = st.m, h1 = h0 > 0 ? 360 : 0, m1 = m0 > 0 ? 360 : 0, t0 = performance.now();
      const f = now => {
        const k = Math.min(1, (now - t0) / ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        set(h0 + (h1 - h0) * e, m0 + (m1 - m0) * e);
        if (k < 1) requestAnimationFrame(f); else { set(0, 0); res(); }
      };
      requestAnimationFrame(f);
    });
    return { g, at, toTwelve, cx, cy, D };
  }

  /* 그림 컷 (만화처럼 끼어드는 큰 그림, 2.2초). 그림 파일이 없으면 건너뛴다 */
  const CUTS = ['coach', 'gown', 'midnight', 'stairs_slipper', 'fit'];
  const cutOk = {};
  const cutArt = (T, k, sfxFn) => cutOk[k] ? T.cutImage([{ src: artSrc('cut_' + k + '_v2'), sfx: sfxFn, hold: 2200 }], { hold: 2200 }) : Promise.resolve();   /* 컷은 새 배경 기준 v2 (2026-10-22 결정 2) */

  async function run(T) {
    const { sleep, say, camSnap, tr } = T;
    if (T.fx) T.fx.style.pointerEvents = 'none'; // 효과 글자(pop)가 누르는 대상을 덮어 누름을 가로채지 않게 (2026-10-22)
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990; /* 세로 화면: 가운데 일부만 보인다 → 카메라가 주인공을 따라간다 */
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); }; /* 말풍선 없는 소리 대사 (수 세기) */

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...Object.keys(ASP).map(k => T.preload(artSrc(k)))];
    const cutLoads = CUTS.map(k => T.preload(artSrc('cut_' + k + '_v2')).then(ok => { cutOk[k] = ok; }));
    await Promise.race([Promise.all([...loads, ...cutLoads]), sleep(4000)]);

    /* ---- 배우 (사람은 모두 같은 얼굴 크기) ---- */
    const cind = mk(T, { stand: 'cind_stand', braid: 'cind_braid', cry: 'cind_cry', surprise: 'cind_surprise', joy: 'cind_joy',
      gown: 'cind_gown', dance: 'cind_dance', give: 'cind_give', run: 'cind_run', sit: 'cind_sit', hug: 'cind_hug' });
    const step = mk(T, { stand: 'step_stand', point: 'step_point' });
    const sis1 = mk(T, { stand: 'sis1_stand', proud: 'sis1_proud', foot: 'sis1_foot', sorry: 'sis1_sorry' });
    const sis2 = mk(T, { stand: 'sis2_stand', proud: 'sis2_proud', foot: 'sis2_foot', sorry: 'sis2_sorry' });
    const fairy = mk(T, { appear: 'fairy_appear', wand: 'fairy_wand' });
    const prince = mk(T, { stand: 'prince_stand', dance: 'prince_dance', slipper: 'prince_slipper' });
    const mice = Array.from({ length: 6 }, () => prop(T, 'mouse', 44));
    const horses = Array.from({ length: 6 }, () => prop(T, 'horse', 178)); // 마차(키 230) 앞에서 작아 보여 키움 (2026-10-20)
    const rat = prop(T, 'rat', 60), lizard = prop(T, 'lizard', 40);
    const coachman = prop(T, 'coachman', hOf('cind_stand') * .95), footman = prop(T, 'footman', hOf('cind_stand') * .95);
    const pumpkin = prop(T, 'prop_pumpkin', 120), coach = prop(T, 'prop_coach', 230), trap = prop(T, 'prop_trap', 92);
    const letter = prop(T, 'prop_letter', 56), ribbon = prop(T, 'prop_ribbon', 34);
    const basket = prop(T, 'prop_basket', 70), orange = prop(T, 'prop_orange', 22);
    const slipper = prop(T, 'prop_slipper', 30), slipper2 = prop(T, 'prop_slipper', 30);
    const ALL = [cind, step, sis1, sis2, fairy, prince, ...mice, ...horses, rat, lizard, coachman, footman, pumpkin, coach, trap, letter, ribbon, basket, orange, slipper, slipper2];
    ALL.forEach(hide);
    /* ---- 층 소품 (VISUAL_PLAN §3~8): 누름을 받지 않는다. 높이는 무대 px (mk 가 K 배 하므로 나눠 넘김) ---- */
    const D = (f, h) => { const a = prop(T, 'layer_' + f, h / K); a.pos.style.pointerEvents = 'none'; return a; };
    const chainOf = a => { const ch = T.el('rect', { x: -2, y: -a.h - 400, width: 4, height: 404, fill: '#6B4A32' }, a.body); a.body.insertBefore(ch, a.body.firstChild); };
    const L = {
      chand: [D('chandelier', 150), D('chandelier', 150)], chandS: D('chandelier_small', 110),
      swag: [D('curtain_swag', 120), D('curtain_swag', 120)], curtain: D('curtain_side', 420), cand: D('candelabra', 180),
      vase: D('vase', 120), garland: D('garland', 70), lantern: D('lantern_post', 220), urn: D('rose_urn', 150),
      moon: D('moonflowers', 100), vine: D('pumpkin_vine', 90), burst: D('star_burst', 200), veg: D('basket_veg', 80),
    };
    /* 궁전 계단(열두 시 빛 상자)에만 쓰는 앞 가림: 낮 색 그대로면 밤 그림에서 튀므로 밤빛으로 낮춘다 */
    L.urn.pos.style.filter = 'brightness(.55) saturate(.75)'; L.lantern.pos.style.filter = 'brightness(.75) saturate(.85)';   // put() 이 body 필터를 비우므로 pos 에
    [...L.chand, L.chandS].forEach(chainOf);
    Object.values(L).flat().forEach(hide);
    const front = (...as) => as.forEach(a => { if (a.pos.style.display !== 'none') T.world.appendChild(a.pos); });
    /* 거실(2·9·10장): 작은 샹들리에(중간) + 오른쪽 커튼(앞) */
    let chandDots = null;
    const parlorBack = () => {
      const cx = X(320, 520);                               /* 가로: 풍경 액자와 둥근 거울 사이 빈 벽 위(거울을 가리지 않게) */
      put(T, L.chandS, cx, 100); sway(L.chandS, 1, 7000);
      const w = L.chandS.w;
      chandDots = twinkle(T, [[cx - w * .38, 100 - 110 * .55], [cx, 100 - 110 * .62], [cx + w * .38, 100 - 110 * .55]]);
      chandDots.style.display = 'none';
    };
    const parlorFront = () => { put(T, L.curtain, 1010, 396); front(L.curtain); };
    /* 텃밭(4·5·6장): 덩굴(왼쪽)·달맞이꽃(오른쪽) + 반딧불 */
    const gardenBack = (vine = true) => {
      if (vine) put(T, L.vine, 50, 556); put(T, L.moon, 975, 556);
      fireflies(T, 12, P);
    };
    /* 무도회장(7·8장): 샹들리에 둘(중간, 시계 490~640 비움)·촛대(중간) → 배우 → 휘장 둘(앞) */
    let ballDots = null;
    const ballBack = () => {
      const cx = [X(300, 320), X(780, 700)];
      cx.forEach((x, i) => { put(T, L.chand[i], x, 150); sway(L.chand[i], 1.5, 6000, i * 3000); });
      const w = L.chand[0].w;
      ballDots = twinkle(T, cx.flatMap(x => [[x - w * .42, 150 - 150 * .5], [x - w * .15, 150 - 150 * .62], [x + w * .15, 150 - 150 * .62], [x + w * .42, 150 - 150 * .5]]));
      put(T, L.cand, 40, 560);
    };
    const ballFront = () => { put(T, L.swag[0], 150, 96); put(T, L.swag[1], 850, 96, { to: 'right' }); front(...L.swag); };
    /* 춤 둘레 반짝 점 6개가 천천히 돈다 (두 사람 몸 뒤) */
    const glimmer = (cx, before) => {
      const g = T.el('g', {}, T.world); g.style.pointerEvents = 'none'; T.world.insertBefore(g, before);
      for (let i = 0; i < 6; i++) {
        const a0 = i / 6 * 360, c = T.el('path', { d: 'M0 -7 L4 0 L0 7 L-4 0 Z', fill: i % 2 ? '#F2C94E' : '#F4F6FA' }, g);
        c.animate([{ transform: `translate(${cx}px,${FL - 150}px) rotate(${a0}deg) translate(150px,0) rotate(${-a0}deg)` }, { transform: `translate(${cx}px,${FL - 150}px) rotate(${a0 + 360}deg) translate(150px,0) rotate(${-a0 - 360}deg)` }],
          { duration: 6000, iterations: Infinity });
        c.animate([{ opacity: .2 }, { opacity: 1 }, { opacity: .2 }], { duration: 1400, delay: i * 230, iterations: Infinity, composite: 'add' });
      }
      return g;
    };
    /* 세로 화면: 말하는 사람을 카메라가 잡는다 (방향은 장면에서 직접 정하므로 돌려세우지 않는다) */
    T.director({ cast: { cind, step, sisa: sis1, sisb: sis2, fairy, prince }, noFace: ['cind', 'step', 'sisa', 'sisb', 'fairy', 'prince'] });

    /* ================= 읽어 주기 (docs/READ_MODE.md): read_script_el.json 의 동사 → 아래 놀이판 연출을 감싼 얇은 함수 =================
       장면 차리기(set)는 놀이판의 같은 장면 자리·자세·층 소품을 그대로 놓는다(같은 배경이 여러 번 나오면 나온 순서로 구분).
       대본 좌표의 y(470)는 바닥선이 아니어서 사람·땅 위 소품은 바닥(FL)에 둔다. */
    const RCAST = { cind, step, sis1, sis2, fairy, prince };
    const RPROP = { pumpkin, coach, trap, coachman, footman, orange, slipper, slipper2, letter, ribbon, rat, lizard };
    const RCL = { x: X(565, 500), y: X(118, 110), d: X(150, 120) };
    const RST = [[860, 185], [640, 262], [430, 335], [220, 410], [-150, 440]], RSS = .75;
    const RTX = X(600, 560);
    const RMX = X([420, 500, 580, 660, 740, 820], [470, 530, 590, 470, 530, 590]), RMY = X([FL, FL, FL, FL, FL, FL], [FL - 30, FL - 30, FL - 30, FL + 6, FL + 6, FL + 6]);
    const RHX = X([370, 500, 630], [380, 500, 620]);
    const inst = () => T.readInstant();
    const on = a => a.pos.isConnected && a.pos.style.display !== 'none';
    const rSeen = {};
    let rTag = '', SPOT = {}, FACE_FIX = {}, rClock = null, rBurst = false;
    const burstAt = (x, y, before) => { put(T, L.burst, x, y + 100); T.world.insertBefore(L.burst.pos, before.pos); fadeIn(L.burst, 500); };
    const burstOff = () => { if (on(L.burst)) T.anim(L.burst.pos, [{ opacity: 1 }, { opacity: 0 }], 1000).then(() => hide(L.burst)); };
    const LAYOUT = {
      kitchen1() {
        const fire = T.el('circle', { cx: 196, cy: 372, r: 14, fill: '#F2B366', opacity: .6 }, T.world); fire.style.pointerEvents = 'none'; fire.style.transformBox = 'fill-box'; fire.style.transformOrigin = 'center';
        fire.animate([{ opacity: .25, transform: 'scale(.9)' }, { opacity: .65, transform: 'scale(1.1)' }, { opacity: .25, transform: 'scale(.9)' }], { duration: 600, iterations: Infinity });
        put(T, cind, X(640, 560), FL, { look: 'stand', to: 'left' });
        put(T, step, X(400, 450), FL, { look: 'stand', to: 'right' });
        put(T, sis1, X(270, 350), FL + 4, { look: 'stand', to: 'right' });
        put(T, sis2, X(150, 260), FL + 8, { look: 'stand', to: 'right' });
        put(T, L.veg, 985, 585);
        if (P) camSnap(520, 280, 1);
      },
      parlor1() {
        parlorBack(); put(T, L.vase, 40, 560);
        put(T, sis2, X(190, 340), FL + 4, { look: 'stand', to: 'right' });
        put(T, sis1, X(460, 490), FL, { look: 'stand', to: 'right' });
        put(T, cind, X(620, 610), FL - 2, { look: 'stand', to: 'left' });
        parlorFront();
        if (P) camSnap(520, 280, 1);
      },
      kitchen_night1() {
        put(T, cind, X(480, 520), FL, { look: 'cry' });
        SPOT = { fairy: [X(700, 600), FL, 'left'] };
        if (P) camSnap(520, 280, 1);
      },
      garden1() {
        gardenBack();
        put(T, fairy, X(260, 400), FL, { look: 'wand', to: 'right' });
        put(T, cind, X(400, 470), FL + 2, { look: 'stand', to: 'left' });
        put(T, pumpkin, X(880, 700), FL + 4);   /* 굴려 오기 전: 텃밭 오른쪽 (놀이판은 660에 놓고 톡) */
        if (P) camSnap(520, 280, 1);
      },
      garden2() {
        gardenBack(false);
        put(T, coach, X(190, 190), FL + 6, { to: 'right' });
        put(T, fairy, X(350, 400), FL, { look: 'wand', to: 'right' });
        put(T, cind, X(925, 680), FL, { look: 'stand', to: 'left' });
        put(T, trap, RTX, FL - 4);
        put(T, rat, X(230, 300), FL + 10, { to: 'right' }); put(T, lizard, X(380, 420), FL + 14, { to: 'right' });
        if (P) { hide(cind); camSnap(RTX, 280, 1); }
      },
      garden3() {
        gardenBack();
        put(T, coach, X(820, 760), FL + 6, { to: 'right' });
        put(T, fairy, X(330, 420), FL, { look: 'wand', to: 'right' });
        put(T, cind, X(520, 560), FL, { look: 'stand', to: 'left' });
        if (P) camSnap(490, 280, 1);
      },
      ballroom1() {
        ballBack();
        put(T, cind, X(420, 450), FL, { look: 'gown', to: 'right' });
        put(T, prince, X(660, 630), FL, { look: 'stand', to: 'left' });   /* 성큼성큼 다가오기 전 (놀이판은 560에서 춤) */
        FACE_FIX = { prince: 'left' };   /* 대본 enter 의 prince:look:stand:right 는 신데렐라 반대쪽을 보게 된다 → 신데렐라 쪽으로 */
        put(T, sis1, X(800, 750), FL + 4, { look: 'stand', to: 'left' });
        put(T, sis2, X(910, 860), FL + 6, { look: 'stand', to: 'left' });
        put(T, basket, X(720, 660), FL + 8);
        T.world.insertBefore(basket.pos, prince.pos);
        ballFront();
        if (P) camSnap(500, 280, 1);
      },
      ballroom2() {
        ballBack();
        put(T, cind, X(440, 450), FL, { look: 'dance', to: 'right' });
        put(T, prince, X(580, 560), FL, { look: 'dance', to: 'left' });
        glimmer((cind.x + prince.x) / 2, cind.pos);
        ballFront();
        if (P) camSnap(500, 280, 1);
      },
      stairs1() {
        twinkle(T, Array.from({ length: 10 }, (_, i) => [60 + (i * 67) % 640, 20 + (i * 53) % 240, 2.5 + (i % 3)]), { color: '#EBD08A', ms: 2000 });   /* 별 깜빡: 빛 상자 Pale Gold */
        put(T, cind, RST[0][0], RST[0][1], { look: 'run', to: 'left', s: RSS });
        put(T, L.urn, 40, 585); put(T, L.lantern, 985, 585);
        twinkle(T, [[985, 585 - 220 * .82, 10, '#F2B366']], { ms: 1400 });
        SPOT = { prince: [930, RST[0][1] - 10, 'left', RSS] };   /* 계단 위에서 내려다본다 */
        if (P) camSnap(760, 280, 1);
      },
      parlor2() {   /* 구두 신어 보기: 놀이판에서 언니들이 비켜선 뒤의 자리 */
        parlorBack();
        put(T, step, X(110, 250), FL + 6, { look: 'stand', to: 'right' });
        put(T, sis2, X(220, 330), FL + 4, { look: 'stand', to: 'right' });
        put(T, sis1, X(330, 420), FL, { look: 'stand', to: 'right' });
        put(T, cind, X(530, 540), FL, { look: 'stand', to: 'right' });
        put(T, prince, X(800, 640), FL, { look: 'slipper', to: 'left' });
        parlorFront();
        if (P) camSnap(560, 280, 1);
      },
      parlor3() {
        put(T, L.garland, 500, 80);
        parlorBack();
        if (!P) put(T, fairy, 275, FL, { look: 'appear', to: 'right' });   /* 대본: 요정 대모도 함께 (놀이판 마지막 장면에는 없음). 세로 화면은 좁아 겹치므로 뺀다 */
        put(T, prince, X(140, 340), FL, { look: 'stand', to: 'right' });
        put(T, cind, X(420, 480), FL, { look: 'gown', to: 'right' });
        put(T, sis1, X(600, 600), FL, { look: 'sorry', to: 'left' });
        put(T, sis2, X(745, 700), FL + 4, { look: 'sorry', to: 'left' });
        put(T, step, X(885, 820), FL + 6, { look: 'stand', to: 'left' });
        parlorFront();
        if (P) camSnap(560, 280, 1);
      },
    };
    const rWall = () => { if (!rClock) rClock = wallClock(T, RCL.x, RCL.y, RCL.d); rClock.g.style.display = ''; return rClock; };
    const rAt = h => { const hr = Math.floor(+h), mn = Math.round((+h - hr) * 60); rWall().at(hr, mn); };
    const rLook = (id, pose, dir) => {
      const a = RCAST[id]; if (FACE_FIX[id]) dir = FACE_FIX[id];
      if (!on(a)) {
        const s = SPOT[id]; if (!s) { a.look(pose, dir); return; }
        put(T, a, s[0], s[1], { look: pose, to: dir || s[2], s: s[3] || 1 }); if (!inst()) fadeIn(a, 500);
        return;
      }
      if (rTag === 'stairs1' && id === 'prince' && pose === 'slipper' && on(slipper)) {   /* 계단에 남은 구두를 주워 든다 */
        return prince.move(slipper.x + 50, slipper.y - 6, 1300).then(() => { hide(slipper); prince.look('slipper', dir || 'left'); });
      }
      a.look(pose, dir);
      if (id === 'cind' && pose === 'gown' && rBurst) { rBurst = false; burstOff(); sparkle(T, cind.x, FL - 80, 130, 18); T.camTo(P ? cind.x : 500, 280, 1, 1200); }
    };
    const rWalk = async (a, spec) => {
      const [x, , ms] = String(spec).split(',').map(Number);
      if (!on(a)) return;
      a.turn(x > a.x ? 'right' : 'left');
      const rib = a === sis1 && on(ribbon) ? ribbon.move(x + 6, ribbon.y, ms || 1000) : null;
      await a.move(x, a.y, ms || 1000);
      if (rib) await rib;
      if (x < -60 || x > 1060) { hide(a); if (rib) hide(ribbon); }
    };
    const PSPOT = () => ({
      pumpkin: [X(880, 700), FL + 4], coach: rTag === 'garden2' ? [X(190, 190), FL + 6] : rTag === 'garden3' ? [X(820, 760), FL + 6] : [X(700, 620), FL + 6],
      trap: [RTX, FL - 4], coachman: [X(770, 620), FL], footman: [X(845, 690), FL], letter: [X(330, 420), 300],
    });
    const rProp = {
      async show(n) {
        const p = RPROP[n];
        if (n === 'letter') {
          const [x, y] = PSPOT().letter; put(T, letter, x, y);
          (async () => { await sleep(inst() ? 1400 : 0); letter.pos.animate([{ translate: '0 -30px', opacity: 0 }, { translate: '0 0', opacity: 1 }], 600); sfx(T, 'swish'); sparkleRing(T, letter.x, 300 - 35, 60, 6, ['#EBD08A']); await sleep(3200); if (on(letter)) fadeOut(T, letter, 400); })();
          return;
        }
        if (n === 'orange') {   /* 춤 자리에서 언니 쪽으로 걸어가 오렌지를 건넨다 (놀이판 그대로) */
          if (P) T.camTo(720, 280, 1, 800);
          cind.look('gown', 'right'); await cind.move(X(640, 600), FL, 900); cind.look('give', 'right');
          await sleep(500);
          const hand = [cind.x + cind.w * .43, FL - cind.h * .47];
          cind.look('gown', 'right'); put(T, orange, ...hand);
          await orange.move(sis1.x - 30, FL - sis1.h * .48, 700);
          sis1.hop(10, 300); setTimeout(() => hide(orange), 2500);
          return;
        }
        if (n === 'slipper') {   /* 계단: 구두는 신데렐라가 달려 내려가며 떨어뜨린다 (cut:stairs_slipper) */
          if (rTag === 'stairs1' && inst()) return;
          put(T, slipper, RST[1][0] + 16, RST[1][1] - 2, { to: 'right', s: RSS }); return;
        }
        if (n === 'slipper2') {
          put(T, slipper2, cind.x + 4, FL - cind.h * .36, { to: 'right' }); fadeIn(slipper2, 300);
          await slipper2.move(cind.x + 4, FL - cind.h * .46, 500, 'ease-out'); glow(slipper2, 1200);
          return;
        }
        if (n === 'clock') { rWall(); if (!inst()) rClock.g.animate([{ opacity: 0 }, { opacity: 1 }], 600); return; }
        if (n === 'mice') return R.mice('out');
        if (n === 'horses') return R.horses('line');
        if ((n === 'coachman' || n === 'footman') && on(rat)) {   /* 큰 쥐·도마뱀이 반짝 → 마부·시종 */
          sparkle(T, rat.x, FL - 30, 80, 8); sparkle(T, lizard.x, FL - 20, 70, 8);
          fadeOut(T, rat, 400); fadeOut(T, lizard, 400);
        }
        const s = PSPOT()[n];
        if (!on(p)) put(T, p, s ? s[0] : 500, s ? s[1] : FL, { to: n === 'coach' ? 'right' : undefined });
        if (n === 'coach' && !inst()) {
          if (rTag === 'garden1') { put(T, L.burst, coach.x, FL - 60 + 100); T.world.insertBefore(L.burst.pos, coach.pos); fadeIn(L.burst, 300); setTimeout(burstOff, 900); }
          glow(coach, 1200); T.pop(coach.x, FL - 260, tr('반짝!'));
        }
        if (!inst()) fadeIn(p, 500);
      },
      async hide(n) {
        if (n === 'clock') { if (rClock) rClock.g.style.display = 'none'; return; }
        if (n === 'mice') { await Promise.all(mice.filter(on).map(m => fadeOut(T, m, 400))); return; }
        if (n === 'horses') { horses.forEach(hide); return; }
        const p = RPROP[n]; if (!on(p)) return;
        if (n === 'pumpkin') { sparkle(T, pumpkin.x, FL - 60, 120, 14); pumpkin.wiggle(10, 500); await sleep(400); sparkleRing(T, pumpkin.x, FL - 70, 180, 24, ['#EBD08A', '#F2B366', '#D9A94E']); }
        if (inst()) hide(p); else await fadeOut(T, p, 300);
      },
      async at(n, spec) {
        const p = RPROP[n], [x] = String(spec).split(',').map(Number);
        if (!on(p)) { rProp.show(n); await sleep(50); }
        if (n === 'pumpkin') {   /* 데굴데굴 굴러 온다 */
          const r0 = p.body.animate([{ transform: 'translateY(-60px) rotate(0deg) translateY(60px)' }, { transform: `translateY(-60px) rotate(${x < p.x ? -360 : 360}deg) translateY(60px)` }], { duration: 700, iterations: 2 });
          await p.move(x, p.y, 1400, 'ease-out'); r0.cancel(); return;
        }
        if (n === 'coach') { p.turn(x > p.x ? 'right' : 'left'); sfx(T, 'whoosh'); await p.move(x, p.y, 1600, 'ease-in'); if (x > 1060 || x < -60) hide(p); return; }
        await p.move(x, p.y, 800);
      },
    };
    const R = {
      set(key) {
        rSeen[key] = (rSeen[key] || 0) + 1; rTag = key + rSeen[key];
        SPOT = {}; FACE_FIX = {}; rClock = null; rBurst = false; chandDots = null; ballDots = null;
        ALL.forEach(hide); Object.values(L).flat().forEach(hide);
        scene(key === 'stairs' ? 'stairs_lb' : key + '_v2');
        (LAYOUT[rTag] || (() => {}))();
      },
      cast(id, verb, a1, a2) {
        const a = RCAST[id]; if (!a) return console.warn('[read] cast 모름', id);
        if (verb === 'look') return rLook(id, a1, a2);
        if (verb === 'hop') return a.hop(12, 340);
        if (verb === 'hide') { hide(a); return; }
        if (verb === 'show') { if (!on(a)) { const s = SPOT[id]; put(T, a, s ? s[0] : a.x, FL); if (!inst()) fadeIn(a); } return; }
        if (verb === 'at') { const [x] = String(a1).split(',').map(Number); put(T, a, x, FL); return; }
        if (verb === 'walk') return rWalk(a, a1);
        console.warn('[read] cast 동사 모름', id, verb);
      },
      prop(n, verb, spec) { const f = verb === 'at' ? rProp.at : rProp[verb]; return f ? f(n, spec) : console.warn('[read] prop 동사 모름', n, verb); },
      ribbon() {
        const sh = sis1.h;
        put(T, ribbon, sis1.x + 6, FL - sh + 14);
        ribbon.pos.animate([{ transform: `translate(${sis1.x + 6}px,${FL - sh + 14}px) scale(.2)` }, { transform: `translate(${sis1.x + 6}px,${FL - sh + 14}px) scale(1.25)` }, { transform: `translate(${sis1.x + 6}px,${FL - sh + 14}px) scale(1)` }], 420);
        cind.hop(8, 300); return sis1.hop(16, 380);
      },
      async mice() {   /* 쥐덫에서 생쥐 여섯 마리가 차례로 (세기 놀이 없이 — 수 세기 목소리·숫자 글자는 뺌) */
        sfx(T, 'creak', () => popSfx(T)); trap.wiggle(6, 300);
        await sleep(400);
        for (let i = 0; i < 6; i++) {
          const m = mice[i];
          put(T, m, RTX, FL - 20, { to: 'right' }); m.turn(RMX[i] < RTX ? 'left' : 'right');
          popSfx(T);
          await m.move(RMX[i], RMY[i], 420, 'ease-out');
          m.hop(12, 300);
          await sleep(250);
        }
      },
      async horses() {
        sparkle(T, X(620, 530), FL - 40, 200, 16);
        await Promise.all(mice.filter(on).map(m => fadeOut(T, m, 400)));
        hide(trap);
        if (P) T.camTo(360, 280, 1, 700);
        horses.forEach((h, i) => { put(T, h, RHX[i >> 1] + (i % 2) * 34, FL - (i % 2 ? 0 : 18), { to: 'right', s: i % 2 ? 1 : .92 }); fadeIn(h, 500); });
        [0, 2, 4].forEach(i => T.world.insertBefore(horses[i].pos, horses[1].pos));
        T.world.appendChild(coach.pos);
        await sleep(600);
      },
      gown() {   /* 드레스: 별빛 판 + 카메라 밀기 + 반짝 (옷이 바뀌는 것은 cast:cind:look:gown) */
        burstAt(cind.x, FL - 130, cind); rBurst = true;
        T.camTo(cind.x, P ? 280 : 300, P ? 1 : 1.15, 900);
        sparkle(T, cind.x, FL - 110, 120, 16);
        sparkleRing(T, cind.x, FL - 120, 120, 14, ['#BFD9EA', '#F4F6FA', '#F6ECD8'], 1400);
        return sleep(500);
      },
      glow(id) { const a = RCAST[id] || RPROP[id]; if (a && on(a)) glow(a, 1200); },
      async fade(id, dir) {
        const a = RCAST[id] || RPROP[id]; if (!a) return;
        if (dir === 'out') { if (on(a)) await fadeOut(T, a, 450); return; }
        if (on(a)) return;
        const s = SPOT[id] || [a.x, FL];
        if (id === 'fairy' && rTag === 'kitchen_night1') {   /* 요정 등장: 별 비 → 별빛 판 → 반짝 (놀이판 그대로) */
          for (let i = 0; i < 8; i++) {
            const sx = s[0] - 140 + i * 40, st = T.el('path', { d: 'M0 -8 L2.5 -2.5 L8 0 L2.5 2.5 L0 8 L-2.5 2.5 L-8 0 L-2.5 -2.5 Z', fill: '#EBD08A' }, T.world);
            st.style.pointerEvents = 'none';
            st.animate([{ transform: `translate(${sx}px,150px)`, opacity: 0 }, { transform: `translate(${sx - 10}px,250px)`, opacity: 1, offset: .3 }, { transform: `translate(${sx - 25}px,400px)`, opacity: 0 }], { duration: 1400, delay: i * 90, easing: 'ease-in', fill: 'both' })
              .finished.then(() => st.remove(), () => st.remove());
          }
          await sleep(500);
          put(T, fairy, s[0], FL, { look: 'appear', to: s[2] || 'left' });
          burstAt(s[0], FL - 130, fairy); setTimeout(burstOff, 3500);
          fadeIn(fairy, 900); sparkle(T, fairy.x, FL - 120, 110, 12);
          if (P) T.camTo(560, 280, 1, 700);
          return sleep(600);
        }
        put(T, a, s[0], s[1], { to: s[2], s: s[3] || 1 }); fadeIn(a, 900);
        return sleep(600);
      },
      async clock(verb, h) {
        if (verb !== 'to') return;
        const c = rWall();
        if (inst()) { rAt(h); return; }
        if (+h >= 12) { glow({ body: c.g }, 1500); await c.toTwelve(1500); return; }
        await T.camTo(P ? RCL.x : 540, P ? 170 : 240, P ? 1.6 : 1.3, 800); // 가로: 시계(위 y≈43~193)가 다 보이게 위쪽으로
        glow({ body: c.g }, 1500); rAt(h);
        await sleep(1200);
        T.camTo(P ? 600 : 500, 280, 1, 600);
      },
      async bell(n) {   /* 땡, 땡, 땡… 홀이 어두워지고 샹들리에가 흔들린다 */
        const c = rWall();
        { const nt = tint(T, '#1F2A56', 0); nt.animate([{ opacity: 0 }, { opacity: .35 }], { duration: 2500, fill: 'forwards' }); }
        if (ballDots) ballDots.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1500, fill: 'forwards' });
        L.chand.forEach(ch => { if (on(ch)) jolt(T, ch); });
        for (let i = 0; i < (+n || 3); i++) {
          c.g.style.transformOrigin = `${c.cx}px ${c.cy}px`;
          bellSfx(T); c.g.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0)' }], { duration: 420 });
          T.pop(c.cx + (i % 2 ? 200 : 170), c.cy + 90, tr('땡!'));
          await sleep(520);
        }
      },
      async cut(k) {
        if (k === 'stairs_slipper' && on(cind) && cind.x === RST[0][0]) {   /* 먼저 계단을 달려 내려가며 구두 한 짝이 떨어진다 */
          follow(520, 2400);
          await cind.move(RST[1][0], RST[1][1], 800, 'linear');
          put(T, slipper, RST[1][0] + 16, RST[1][1] - 2, { to: 'right', s: RSS });
          slipper.pos.animate([{ translate: '0 -40px', rotate: '-20deg' }, { translate: '0 0', rotate: '0deg' }], 400);
          sparkleRing(T, slipper.x, slipper.y - 10, 50, 8, ['#BFD9EA', '#F4F6FA']);
          T.pop(RST[1][0], RST[1][1] - cind.h * RSS - 20, tr('앗!'));
          for (const [x, y] of RST.slice(2)) await cind.move(x, y, 750, 'linear');
          hide(cind);
          if (P) T.camTo(720, 280, 1, 900);
        }
        if (k === 'fit' && on(cind) && on(prince)) {   /* 왕자가 다가와 구두를 신겨 준다 */
          const toe = () => [cind.x + cind.w * .37, FL - cind.h * .1];
          if (P) T.camTo(600, 280, 1, 500);
          prince.look('slipper', 'left');
          await prince.move(cind.x + cind.w * .5 + 70, FL, 1000);
          prince.look('stand', 'left');
          put(T, slipper, prince.x - 40, FL - prince.h * .45, { to: 'right' });
          await slipper.move(...toe(), 700);
          sparkle(T, toe()[0], toe()[1], 60, 8);
          await sleep(400);
        }
        const SFX = {
          coach: () => { sparkleSfx(T); setTimeout(() => AudioFX.sfx('whoosh'), 500); },
          gown: () => { sparkleSfx(T); setTimeout(() => sparkleSfx(T), 700); },
          midnight: () => { bellSfx(T); setTimeout(() => bellSfx(T), 900); },
          stairs_slipper: () => { sparkleSfx(T); setTimeout(() => AudioFX.sfx('ding') || popSfx(T), 400); },
          fit: () => { popSfx(T); setTimeout(() => sparkleSfx(T), 250); },
        };
        await cutArt(T, k, SFX[k]);
      },
      fx(n) {
        if (n === 'sparkle') return sparkleSfx(T);
        if (n === 'bell') return bellSfx(T);
        if (n === 'pop') return popSfx(T);
        if (n === 'ding') return AudioFX.sfx('ding') || popSfx(T);
        return sfx(T, n);
      },
      pop(spec) { const [x, y, ...w] = String(spec).split(','); T.pop(+x, +y, tr(w.join(','))); },
      cam(a) {
        if (a === 'wide') return inst() ? camSnap(500, 280, 1) : T.camTo(500, 280, 1, 700);
        const [x, y, z] = String(a).split(',').map(Number);
        return inst() ? camSnap(x, y, z || 1) : T.camTo(x, y, z || 1, 800);
      },
    };
    const READ_ACTS = { set: R.set, cast: R.cast, prop: R.prop, ribbon: R.ribbon, mice: R.mice, horses: R.horses, gown: R.gown,
      glow: R.glow, fade: R.fade, clock: R.clock, bell: R.bell, cut: R.cut, fx: R.fx, pop: R.pop, cam: R.cam };
    if (T.reading()) return T.readPlay(READ_ACTS);

    /* ===== 1. 재투성이 ===== */
    scene('kitchen_v2');
    /* 아궁이 불(배경 그림 안) 위에 앰버 원을 얹어 깜빡 */
    { const fire = T.el('circle', { cx: 196, cy: 372, r: 14, fill: '#F2B366', opacity: .6 }, T.world); fire.style.pointerEvents = 'none';
      fire.animate([{ opacity: .25, transform: 'scale(.9)' }, { opacity: .65, transform: 'scale(1.1)' }, { opacity: .25, transform: 'scale(.9)' }], { duration: 600, iterations: Infinity }); fire.style.transformBox = 'fill-box'; fire.style.transformOrigin = 'center'; }
    put(T, cind, X(640, 560), FL, { look: 'stand', to: 'left' });
    put(T, step, X(400, 450), FL, { look: 'point', to: 'right' });
    put(T, sis1, X(270, 350), FL + 4, { look: 'stand', to: 'right' });
    put(T, sis2, X(150, 260), FL + 8, { look: 'stand', to: 'right' });
    put(T, L.veg, 985, 585);                               /* 앞 가림: 채소 바구니 (오른쪽 아래 모서리) */
    if (P) camSnap(520, 280, 1);
    await T.curtain(true);
    await say('옛날에 마음씨 고운 아가씨가 살았어요.');
    step.hop(10, 320);
    await say('넌 부엌 일을 해!');
    const tease = (async () => { for (let i = 0; i < 2; i++) { await Promise.all([sis1.hop(12, 380), sis2.hop(12, 380)]); await sleep(150); } })();
    if (P) T.camTo(330, 280, 1, 600);
    await say('재투성이래요~ 재투성이래요~');
    await tease;
    if (P) T.camTo(560, 280, 1, 600);
    await say('그래서 아가씨는 신데렐라라고 불렸어요.');
    await sleep(200);

    /* ===== 2. 머리 꾸미기 (톡 1: 첫 조작) ===== */
    let hair;
    await T.sceneCard(tr('무도회 편지'), () => {
      scene('parlor_v2');
      parlorBack(); put(T, L.vase, 40, 560);
      put(T, sis2, X(190, 340), FL + 4, { look: 'proud', to: 'right' });
      put(T, sis1, X(460, 490), FL, { look: 'stand', to: 'right' });
      put(T, cind, X(620, 610), FL - 2, { look: 'braid', to: 'left' });
      put(T, letter, X(330, 420), 300);
      parlorFront();
      if (P) camSnap(520, 280, 1);
    }, sis1.pos);
    letter.pos.animate([{ translate: '0 -30px', opacity: 0 }, { translate: '0 0', opacity: 1 }], 600);
    sfx(T, 'swish'); sparkleRing(T, letter.x, 300 - 35, 60, 6, ['#EBD08A']);
    await say('어느 날, 궁전에서 무도회 편지가 왔어요.');
    fadeOut(T, letter, 400);
    sis1.look('proud'); sis1.hop(10, 320);
    await say('신데렐라, 내 머리 좀 예쁘게 해 줘!');
    await say('네, 예쁘게 해 드릴게요.');
    /* 언니 머리 자리를 누르는 곳으로 */
    const sh = sis1.h;
    hair = T.el('circle', { cx: 0, cy: -sh * .8, r: sh * .25, fill: 'transparent' }, sis1.pos);
    await T.ask('언니 머리를 톡 눌러 봐요.', () => T.tap(sis1.pos, { prompt: '언니 머리를 톡 눌러 봐요.' }));
    hair.remove();
    put(T, ribbon, sis1.x + 6, FL - sh + 14); ribbon.pos.animate([{ transform: `translate(${sis1.x + 6}px,${FL - sh + 14}px) scale(.2)` }, { transform: `translate(${sis1.x + 6}px,${FL - sh + 14}px) scale(1.25)` }, { transform: `translate(${sis1.x + 6}px,${FL - sh + 14}px) scale(1)` }], 420);
    popSfx(T); setTimeout(() => T.pop(sis1.x, FL - sh - 30, tr('퐁!')), 260); /* 리본이 커진 뒤에 띄워 엔진이 리본·머리를 피해 놓게 */
    cind.hop(8, 300); await sis1.hop(16, 380);
    await say('어머, 예쁘다!');
    await say('언니들은 신이 나서 무도회에 갔어요.');
    sis1.turn('right'); sis2.turn('right');
    await Promise.all([sis1.move(1150, FL, 1500), sis2.move(1080, FL + 4, 1700), ribbon.move(1150 + 6, FL - sh + 14, 1500)]);
    [sis1, sis2, ribbon].forEach(hide);

    /* ===== 3. 혼자 남은 밤 ===== */
    await T.sceneCard(tr('혼자 남은 밤'), () => {
      scene('kitchen_night_v2');
      put(T, cind, X(480, 520), FL, { look: 'cry' });
      if (P) camSnap(520, 280, 1);
    }, cind.pos);
    const sob = cind.pos.animate([{ translate: '0 0' }, { translate: '0 -3px' }, { translate: '0 0' }], { duration: 700, iterations: 6 });
    await say('혼자 남은 신데렐라는 훌쩍훌쩍 울었어요.');
    await say('나도 무도회에 가고 싶어요.');
    sob.cancel();
    /* 요정 등장 3단: ① 별 비 → ② 별빛 판이 요정 뒤에서 → ③ 반짝 */
    const fx0 = X(700, 600);
    for (let i = 0; i < 8; i++) {
      const sx = fx0 - 140 + i * 40, st = T.el('path', { d: 'M0 -8 L2.5 -2.5 L8 0 L2.5 2.5 L0 8 L-2.5 2.5 L-8 0 L-2.5 -2.5 Z', fill: '#EBD08A' }, T.world);
      st.style.pointerEvents = 'none';
      st.animate([{ transform: `translate(${sx}px,150px)`, opacity: 0 }, { transform: `translate(${sx - 10}px,250px)`, opacity: 1, offset: .3 }, { transform: `translate(${sx - 25}px,400px)`, opacity: 0 }], { duration: 1400, delay: i * 90, easing: 'ease-in', fill: 'both' })
        .finished.then(() => st.remove(), () => st.remove());
    }
    await sleep(500);
    put(T, L.burst, fx0, FL - 130 + 100); T.world.insertBefore(L.burst.pos, cind.pos);
    L.burst.body.animate([{ transform: 'translateY(-100px) scale(.4) translateY(100px)', opacity: 0 }, { transform: 'translateY(-100px) scale(1.1) translateY(100px)', opacity: 1 }, { transform: 'translateY(-100px) scale(1) translateY(100px)' }], { duration: 700, fill: 'forwards' })
      .finished.then(() => L.burst.body.animate([{ transform: 'translateY(-100px) scale(.95) translateY(100px)' }, { transform: 'translateY(-100px) scale(1.05) translateY(100px)' }, { transform: 'translateY(-100px) scale(.95) translateY(100px)' }], { duration: 1600, iterations: Infinity }), () => {});
    put(T, fairy, fx0, FL, { look: 'appear' }); fadeIn(fairy, 900);
    sparkle(T, fairy.x, FL - 120, 110, 12);
    cind.look('surprise', 'right');
    if (P) T.camTo(560, 280, 1, 700);
    await say('그때 요정 대모가 나타났어요.');
    await say('울지 마렴. 너도 무도회에 가고 싶지? 내가 도와주마.');
    cind.look('joy'); cind.hop(12, 340);
    T.anim(L.burst.pos, [{ opacity: 1 }, { opacity: 0 }], 800).then(() => hide(L.burst));
    await sleep(300);

    /* ===== 4. 호박 (톡 2) ===== */
    await T.sceneCard(tr('커다란 호박'), () => {
      scene('garden_v2');
      gardenBack();
      put(T, fairy, X(260, 400), FL, { look: 'wand', to: 'right' });
      put(T, cind, X(400, 470), FL + 2, { look: 'joy', to: 'left' });
      put(T, pumpkin, X(660, 590), FL + 4);
      if (P) camSnap(520, 280, 1);
    }, pumpkin.pos);
    await say('텃밭에서 제일 큰 호박을 가져오렴.');
    pumpkin.pos.animate([{ translate: '0 0' }, { translate: '0 -6px' }, { translate: '0 0' }], { duration: 900, iterations: 3, easing: 'ease-in-out' });
    await T.ask('호박을 톡 눌러 봐요.', () => T.tap(pumpkin.pos, { prompt: '호박을 톡 눌러 봐요.' }));
    /* 호박 → 마차 4단: ① 별빛 판이 호박 뒤에서 커짐 → ② 호박 흔들림 → ③ 사라지며 금·앰버 마름모 24조각 → ④ 마차, 별빛 판은 천천히 사라짐 */
    put(T, L.burst, pumpkin.x, FL - 60 + 100); T.world.insertBefore(L.burst.pos, pumpkin.pos);
    L.burst.body.animate([{ transform: 'translateY(-100px) scale(.3) translateY(100px)', opacity: 0 }, { transform: 'translateY(-100px) scale(1.2) translateY(100px)', opacity: 1 }], { duration: 500, fill: 'forwards' });
    sparkle(T, pumpkin.x, FL - 60, 120, 14);
    pumpkin.wiggle(10, 500);
    await sleep(500);
    sfx(T, 'whoosh'); sparkleRing(T, pumpkin.x, FL - 70, 180, 24, ['#EBD08A', '#F2B366', '#D9A94E']);
    await fadeOut(T, pumpkin, 300);
    put(T, coach, X(700, 620), FL + 6, { to: 'right' }); fadeIn(coach, 500); glow(coach, 1200);
    T.pop(coach.x, FL - 260, tr('반짝!'));
    T.anim(L.burst.pos, [{ opacity: 1 }, { opacity: 0 }], 1200).then(() => hide(L.burst));
    await sleep(500);
    await cutArt(T, 'coach', () => { sparkleSfx(T); setTimeout(() => AudioFX.sfx('whoosh'), 500); });
    cind.look('surprise', 'right');
    await say('호박이 황금 마차가 되었어요!');
    cind.look('joy'); cind.hop(12, 340);

    /* ===== 5. 생쥐 여섯 마리 (배움 놀이: 세기 — 덫을 톡 한 번, 1~6 저절로) ===== */
    const TX = X(600, 560);
    const MX = X([420, 500, 580, 660, 740, 820], [470, 530, 590, 470, 530, 590]), MY = X([FL, FL, FL, FL, FL, FL], [FL - 30, FL - 30, FL - 30, FL + 6, FL + 6, FL + 6]);
    await T.sceneCard(tr('생쥐 여섯 마리'), () => {
      scene('garden_v2');
      gardenBack(false);
      put(T, coach, X(190, 190), FL + 6, { to: 'right' });
      put(T, fairy, X(350, 400), FL, { look: 'appear', to: 'right' });
      put(T, cind, X(925, 680), FL, { look: 'joy', to: 'left' });
      put(T, trap, TX, FL - 4);
      put(T, rat, X(230, 300), FL + 10, { to: 'right' }); put(T, lizard, X(380, 420), FL + 14, { to: 'right' });
      if (P) { hide(cind); camSnap(TX, 280, 1); }
    }, trap.pos);
    await say('쥐덫에 생쥐가 있구나. 몇 마리일까?');
    trap.pos.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 700, iterations: 4 });
    await T.ask('쥐덫을 톡 눌러 봐요.', () => T.tap(trap.pos, { prompt: '쥐덫을 톡 눌러 봐요.' }));
    sfx(T, 'creak', () => popSfx(T)); trap.wiggle(6, 300);
    await sleep(400);
    for (let i = 0; i < 6; i++) {
      const m = mice[i];
      put(T, m, TX, FL - 20, { to: 'right' });
      m.turn(MX[i] < TX ? 'left' : 'right'); // 가는 쪽을 본다
      AudioFX.countBeat && AudioFX.countBeat(i + 1); popSfx(T); vo('n' + (i + 1));
      await m.move(MX[i], MY[i], 420, 'ease-out');
      m.hop(12, 300); glow(m, 700);
      T.pop(MX[i] - (i === 5 ? 90 : 0), MY[i] - (i === 5 ? 170 : 230), tr(NUM[i]));
      await sleep(650);
    }
    await say('생쥐가 여섯 마리! 하얀 말 여섯 마리가 되었어요.');
    /* 생쥐가 반짝 → 말 여섯 마리가 마차 앞에 두 줄로 */
    sparkle(T, X(620, 530), FL - 40, 200, 16);
    await Promise.all(mice.map(m => fadeOut(T, m, 400)));
    hide(trap);
    const HX = X([370, 500, 630], [380, 500, 620]);
    if (P) T.camTo(360, 280, 1, 700);
    horses.forEach((h, i) => { put(T, h, HX[i >> 1] + (i % 2) * 34, FL - (i % 2 ? 0 : 18), { to: 'right', s: i % 2 ? 1 : .92 }); fadeIn(h, 500); });
    /* 뒷줄(짝수) 말을 앞줄 뒤로 */
    [0, 2, 4].forEach(i => T.world.insertBefore(horses[i].pos, horses[1].pos));
    T.world.appendChild(coach.pos);
    await sleep(600);
    sparkle(T, rat.x, FL - 30, 80, 8); sparkle(T, lizard.x, FL - 20, 70, 8);
    await Promise.all([fadeOut(T, rat, 400), fadeOut(T, lizard, 400)]);
    put(T, coachman, X(770, 620), FL, {}); put(T, footman, X(845, 690), FL, {});
    if (P) T.camTo(620, 280, 1, 700);
    fadeIn(coachman, 500); fadeIn(footman, 500);
    await say('큰 쥐는 마부가, 도마뱀은 시종이 되었어요.');
    await sleep(300);

    /* ===== 6. 드레스와 유리 구두 ===== */
    await T.sceneCard(tr('은빛 드레스'), () => {
      scene('garden_v2');
      gardenBack();
      horses.forEach(hide); hide(coachman); hide(footman);
      put(T, coach, X(820, 760), FL + 6, { to: 'right' });
      put(T, fairy, X(330, 420), FL, { look: 'wand', to: 'right' });
      put(T, cind, X(520, 560), FL, { look: 'joy', to: 'left' });
      if (P) camSnap(490, 280, 1);
    }, cind.pos);
    await say('이제 네 차례란다.');
    /* 드레스 5단: ① 별빛 판(신데렐라 뒤) + 카메라 밀기 → ② 옷 바뀜 → ③ 은빛 2겹 → ④ 금 조각이 양옆에서 떠오름 → ⑤ 컷 뒤 별빛 판 사라짐 */
    put(T, L.burst, cind.x, FL - 130 + 100); T.world.insertBefore(L.burst.pos, cind.pos); fadeIn(L.burst, 500);
    T.camTo(cind.x, P ? 280 : 300, P ? 1 : 1.15, 900);
    sparkle(T, cind.x, FL - 110, 120, 16);
    await T.anim(cind.pos, [{ opacity: 1 }, { opacity: .1 }], 400);
    cind.look('gown'); cind.pos.style.opacity = '';
    fadeIn(cind, 500); glow(cind, 1400);
    sparkleRing(T, cind.x, FL - 120, 120, 14, ['#BFD9EA', '#F4F6FA', '#F6ECD8'], 1400); setTimeout(() => sparkleRing(T, cind.x, FL - 130, 170, 16, ['#BFD9EA', '#F4F6FA', '#F2B366'], 1400), 300);
    for (let i = 0; i < 8; i++) {
      const sx = cind.x + (i % 2 ? 1 : -1) * (70 + (i % 4) * 13), sy = FL - 20;
      const d = T.el('path', { d: 'M0 -7 L4 0 L0 7 L-4 0 Z', fill: '#EBD08A' }, T.world); d.style.pointerEvents = 'none';
      d.animate([{ transform: `translate(${sx}px,${sy}px)`, opacity: 0 }, { transform: `translate(${sx}px,${sy - 60}px)`, opacity: 1, offset: .3 }, { transform: `translate(${sx}px,${sy - 160}px)`, opacity: 0 }], { duration: 1200, delay: i * 90, fill: 'both' })
        .finished.then(() => d.remove(), () => d.remove());
    }
    await sleep(500);
    await cutArt(T, 'gown', () => { sparkleSfx(T); setTimeout(() => sparkleSfx(T), 700); });
    T.anim(L.burst.pos, [{ opacity: 1 }, { opacity: 0 }], 1200).then(() => hide(L.burst));
    T.camTo(P ? cind.x : 500, 280, 1, 1200);
    sparkle(T, cind.x, FL - 80, 130, 18);
    await say('신데렐라는 은빛 드레스에 유리 구두를 신었어요.');
    cind.hop(14, 380);
    await say('와, 정말 고맙습니다!');
    fairy.look('appear');
    await say('꼭 기억하렴. 밤 열두 시가 되면 마법이 풀린단다.');
    await say('네, 꼭 기억할게요!');
    cind.turn('right');
    await cind.move(cind.x + 140, FL, 900);
    await fadeOut(T, cind, 300);

    /* ===== 7. 첫째 밤 ===== */
    let clock;
    const CL = { x: X(565, 500), y: X(118, 110), d: X(150, 120) };
    await T.sceneCard(tr('첫째 밤'), () => {
      scene('ballroom_v2');
      ballBack();
      clock = wallClock(T, CL.x, CL.y, CL.d); clock.at(11, 45);
      put(T, cind, X(420, 450), FL, { look: 'dance', to: 'right' });
      put(T, prince, X(560, 560), FL, { look: 'dance', to: 'left' });
      put(T, sis1, X(800, 750), FL + 4, { look: 'stand', to: 'left' });
      put(T, sis2, X(910, 860), FL + 6, { look: 'stand', to: 'left' });
      put(T, basket, X(720, 660), FL + 8);
      glimmer((cind.x + prince.x) / 2, cind.pos);
      ballFront();
      if (P) camSnap(500, 280, 1); else camSnap(500, 220, 1.18);   /* 입장: 샹들리에·창 높이에서 시작 */
    }, cind.pos);
    if (!P) T.camTo(500, 280, 1, 2600);
    await say('궁전에 가니 모두 신데렐라를 바라보았어요.');
    await say('함께 춤춰요.');
    /* 빙글빙글 (서로 손을 잡은 채 좌우로 오간다) */
    for (let i = 0; i < 2; i++) {
      await Promise.all([cind.move(cind.x - 30, FL, 600), prince.move(prince.x - 30, FL, 600)]);
      await Promise.all([cind.move(cind.x + 30, FL, 600), prince.move(prince.x + 30, FL, 600)]);
    }
    /* 오렌지를 나눠 준다: 왕자는 사라지지 않고 서서 지켜본다 (2026-10-20: 춤추다 갑자기 사라졌음) */
    prince.look('stand', 'right');
    cind.look('gown', 'right');
    if (P) T.camTo(720, 280, 1, 800);
    await cind.move(X(640, 600), FL, 900);
    cind.look('give', 'right');
    /* 오렌지를 든 그림 → 건네는 순간 빈손 그림으로 바꾸고, 손에 있던 자리에서 오렌지 조각이 언니에게 간다 */
    await say('신데렐라는 언니들에게도 오렌지를 나눠 주었어요.');
    const hand = [cind.x + cind.w * .43, FL - cind.h * .47];
    cind.look('gown', 'right'); put(T, orange, ...hand);
    await orange.move(sis1.x - 30, FL - sis1.h * .48, 700);
    sis1.hop(10, 300);
    await say('어머, 고마워요!');
    await say('언니들은 신데렐라를 알아보지 못했어요.');
    hide(orange);
    T.camTo(P ? CL.x : 540, P ? 170 : 240, P ? 1.6 : 1.3, 800); // 가로: 시계(위 y≈43~193)가 다 보이게 위쪽으로
    glow({ body: clock.g }, 1500);
    await say('시계를 보니 열두 시가 가까워요. 신데렐라는 약속대로 집에 돌아왔어요.');
    T.camTo(P ? 600 : 500, 280, 1, 600);
    cind.look('gown', 'left');
    await cind.move(-120, FL, 1600);
    hide(cind);

    /* ===== 8. 둘째 밤, 열두 시 (배움 놀이: 시계 보기 — 12시·3시·6시 중 고르기) ===== */
    await T.sceneCard(tr('둘째 밤'), () => {
      scene('ballroom_v2');
      ballBack();
      clock = wallClock(T, CL.x, CL.y, CL.d); clock.at(11, 50);
      put(T, cind, X(440, 450), FL, { look: 'dance', to: 'right' });
      put(T, prince, X(580, 560), FL, { look: 'dance', to: 'left' });
      glimmer((cind.x + prince.x) / 2, cind.pos);
      ballFront();
      if (P) camSnap(500, 280, 1);
    }, cind.pos);
    await say('다음 날 밤에도 무도회가 열렸어요.');
    const spin = (async () => {
      for (let i = 0; i < 2; i++) {
        await Promise.all([cind.move(cind.x - 30, FL, 550), prince.move(prince.x - 30, FL, 550)]);
        await Promise.all([cind.move(cind.x + 30, FL, 550), prince.move(prince.x + 30, FL, 550)]);
      }
    })();
    await say('신데렐라는 춤추느라 시간 가는 줄 몰랐어요.');
    await spin;
    /* 시계 카드 세 장 (순서는 무작위) */
    const cardS = X(170, 118), cardY = X([380, 380, 380], [290, 290, 420]); /* 세로 화면: 위 두 장 + 아래 한 장 (숫자가 잘 보이게 크게) */
    const cardX = X([250, 500, 750], [440, 560, 500]);
    const kinds = ['12', '3', '6'].sort(() => Math.random() - .5);
    const cards = kinds.map((k, i) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world);
      T.el('image', { href: artSrc('card_' + k), x: cardX[i] - cardS / 2, y: cardY[i] - cardS / 2, width: cardS, height: cardS / (ASP['card_' + k] || 1), preserveAspectRatio: 'none' }, g);
      g.animate([{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], { duration: 450, delay: i * 150, fill: 'backwards' });
      numerals(T, g, 'card', cardX[i] - cardS / 2, cardY[i] - cardS / 2, cardS, cardS / (ASP['card_' + k] || 1));
      return { k, g };
    });
    cind.pos.style.opacity = '.35'; prince.pos.style.opacity = '.35';
    if (P) camSnap(500, 250, 1);
    let hinted = false;
    const NAME = { 3: '그건 세 시예요.', 6: '그건 여섯 시예요.' };
    await T.ask('긴 바늘과 짧은 바늘이 모두 12를 가리키면 열두 시예요. 열두 시 시계를 찾아봐요!', () => T.choose(cards.map(c => ({ el: c.g, ok: c.k === '12',
      onWrong: async () => {
        await say(NAME[c.k]);
        if (!hinted) { hinted = true; glow({ body: clock.g }, 2600); await Promise.all([clock.toTwelve(2600), say('바늘이 모두 위로 올라가면 열두 시예요.')]); }
      } })), { prompt: '열두 시 시계를 찾아봐요!' }));
    const good = cards.find(c => c.k === '12');
    good.g.style.filter = 'url(#hintGlow)';
    await say('맞아요, 열두 시!');
    cards.forEach(c => c.g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }));
    if (!hinted) await clock.toTwelve(1200);
    await cutArt(T, 'midnight', () => { bellSfx(T); setTimeout(() => bellSfx(T), 900); });
    /* 땡, 땡, 땡… 홀이 어두워지고 샹들리에 불빛이 꺼지며 크게 한 번 흔들린다 */
    { const nt = tint(T, '#1F2A56', 0); nt.animate([{ opacity: 0 }, { opacity: .35 }], { duration: 2500, fill: 'forwards' }); }
    if (ballDots) ballDots.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1500, fill: 'forwards' });
    L.chand.forEach(c => jolt(T, c));
    for (let i = 0; i < 6; i++) {
      clock.g.style.transformOrigin = `${clock.cx}px ${clock.cy}px`;
      bellSfx(T); clock.g.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0)' }], { duration: 420 });
      T.pop(clock.cx + (i % 2 ? 200 : 170), clock.cy + 90, tr('땡!'));
      await sleep(520);
    }
    cards.forEach(c => c.g.remove());
    cind.pos.style.opacity = ''; prince.pos.style.opacity = '';
    cind.look('run', 'left');
    await say('앗, 열두 시예요!');
    await cind.move(-120, FL, 1100, 'ease-in');
    hide(cind);
    /* 계단: 위 오른쪽에서 아래 왼쪽으로 달려 내려가며 구두 한 짝이 떨어진다 */
    const ST = [[860, 185], [640, 262], [430, 335], [220, 410], [-150, 440]], SS = .75; /* 그림 속 계단 위끝 → 아래끝 */
    await T.sceneCard(tr('궁전 계단'), () => {
      scene('stairs_lb');   /* 열두 시 빛 상자: 창·문·달만 빛나고 계단은 어두운 단 */
      /* 하늘 별 깜빡 10 (그림 속 별 위) */
      twinkle(T, Array.from({ length: 10 }, (_, i) => [60 + (i * 67) % 640, 20 + (i * 53) % 240, 2.5 + (i % 3)]), { color: '#EBD08A', ms: 2000 });   /* 별 깜빡: 빛 상자 Pale Gold */
      put(T, cind, ST[0][0], ST[0][1], { look: 'run', to: 'left', s: SS });
      put(T, L.urn, 40, 585); put(T, L.lantern, 985, 585);   /* 앞 가림: 장미 항아리(왼쪽 아래)·등불 기둥(오른쪽 아래) */
      { const lw = L.lantern.w; twinkle(T, [[985, 585 - 220 * .82, 10, '#F2B366']], { ms: 1400 }); void lw; }
      if (P) camSnap(760, 280, 1);
    }, cind.pos);
    follow(520, 2400);
    await cind.move(ST[1][0], ST[1][1], 800, 'linear');
    put(T, slipper, ST[1][0] + 16, ST[1][1] - 2, { to: 'right', s: SS });
    slipper.pos.animate([{ translate: '0 -40px', rotate: '-20deg' }, { translate: '0 0', rotate: '0deg' }], 400);
    sparkleRing(T, slipper.x, slipper.y - 10, 50, 8, ['#BFD9EA', '#F4F6FA']);
    T.pop(ST[1][0], ST[1][1] - cind.h * SS - 20, tr('앗!'));
    for (const [x, y] of ST.slice(2)) await cind.move(x, y, 750, 'linear');
    hide(cind);
    await cutArt(T, 'stairs_slipper', () => { sparkleSfx(T); setTimeout(() => AudioFX.sfx('ding') || popSfx(T), 400); });
    await say('신데렐라는 계단을 달려 내려가다 유리 구두 한 짝을 떨어뜨렸어요.');
    put(T, prince, 980, ST[0][1] - 10, { look: 'stand', to: 'left', s: SS });
    if (P) T.camTo(720, 280, 1, 900);
    await prince.move(ST[1][0] + 60, ST[1][1] - 6, 1300);
    hide(slipper);
    prince.look('slipper', 'left'); glow(prince, 900);
    await say('이 구두가 꼭 맞는 사람을 찾을 거예요.');
    await sleep(300);

    /* ===== 9. 구두 신어 보기 (배움 놀이: 크기 비교 — 구두와 같은 크기의 발 고르기) ===== */
    await T.sceneCard(tr('유리 구두'), () => {
      scene('parlor_v2');
      parlorBack();
      put(T, prince, X(800, 640), FL, { look: 'slipper', to: 'left' });
      put(T, sis1, X(580, 520), FL, { look: 'stand', to: 'right' });
      put(T, sis2, X(430, 420), FL + 4, { look: 'stand', to: 'right' });
      put(T, step, X(270, 330), FL + 6, { look: 'stand', to: 'right' });
      parlorFront();
      if (P) camSnap(560, 280, 1);
    }, prince.pos);
    await say('왕자님이 유리 구두를 들고 집집마다 찾아다녔어요.');
    sis1.look('foot', 'right'); sis1.wiggle(5, 500);
    await say('내 발이 들어갈 거야!');
    T.pop(sis1.x + 50, FL - sis1.h - 80, tr('끙!'));
    await sleep(500);
    sis1.look('stand');
    if (P) T.camTo(480, 280, 1, 500);
    sis2.look('foot', 'right'); sis2.wiggle(5, 500);
    await say('내 발도 들어갈 거야!');
    T.pop(sis2.x + 50, FL - sis2.h - 80, tr('끙끙!'));
    await sleep(500);
    sis2.look('stand');
    await say('언니들의 발은 너무 커서 들어가지 않았어요.');
    /* 언니들과 새엄마는 왼쪽으로 비켜서고, 부엌에서 신데렐라가 나온다 */
    step.turn('left'); sis1.turn('left'); sis2.turn('left');
    await Promise.all([step.move(X(110, 250), FL + 6, 800), sis2.move(X(220, 330), FL + 4, 800), sis1.move(X(330, 420), FL, 800)]);
    step.turn('right'); sis1.turn('right'); sis2.turn('right');
    put(T, cind, X(530, 540), FL, { look: 'stand', to: 'right' }); fadeIn(cind, 500);
    if (P) T.camTo(560, 280, 1, 600);
    await say('저도 신어 봐도 될까요?');
    /* 발 카드 두 장(큰 발·작은 발, 길이 1.9배 차이) + 위에 유리 구두 (작은 발 = 구두 길이) */
    const FW = X(230, 180), FH = FW / 2;
    const fx = X([320, 680], [500, 500]), fy = X([360, 360], [250, 410]);
    const ord = ['bigger', 'small'].sort(() => Math.random() - .5);
    const BIGK = 1.15; /* 큰 발 그림은 작은 발보다 1.66배 길어서, 판을 1.15배로 키워 1.9배 차이로 */
    const dim = T.el('rect', { x: -100, y: -100, width: 1200, height: 800, fill: '#F6ECD8', opacity: 0 }, T.world);
    dim.animate([{ opacity: 0 }, { opacity: .7 }], { duration: 400, fill: 'forwards' });
    const sw = FW * 340 / 600 * 1.0;       /* 작은 발의 길이(판 600 중 340)와 같은 길이의 구두 */
    const showSl = T.el('g', { filter: 'url(#pp)' }, T.world);
    const SLY = X(190, 95);
    T.el('image', { href: artSrc('prop_slipper'), x: 500 - sw / 2, y: SLY - sw / (ASP.prop_slipper || 2) / 2, width: sw, height: sw / (ASP.prop_slipper || 2), preserveAspectRatio: 'none' }, showSl);
    const feet = ord.map((k, i) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world), fw = FW * (k === 'bigger' ? BIGK : 1), fh = fw / 2;
      T.el('rect', { x: fx[i] - fw / 2 - 8, y: fy[i] - fh / 2 - 8, width: fw + 16, height: fh + 16, rx: 14, fill: '#F6ECD8' }, g);
      T.el('image', { href: artSrc('foot_' + k), x: fx[i] - fw / 2, y: fy[i] - fh / 2, width: fw, height: fh, preserveAspectRatio: 'none' }, g);
      g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: i * 120, fill: 'backwards' });
      return { k, g };
    });
    if (P) camSnap(500, 280, 1);
    await T.ask('구두와 크기가 같은 발을 찾아봐요!', () => T.choose(feet.map(f => ({ el: f.g, ok: f.k === 'small', onWrong: async () => { await say('그 발은 구두보다 커요.'); } })), { prompt: '구두와 크기가 같은 발을 찾아봐요!' }));
    const right = feet.find(f => f.k === 'small');
    right.g.style.filter = 'url(#hintGlow)'; sparkleSfx(T);
    await say('맞아요, 작은 발!');
    await Promise.all([...feet.map(f => T.anim(f.g, [{ opacity: 1 }, { opacity: 0 }], 350)), T.anim(showSl, [{ opacity: 1 }, { opacity: 0 }], 350), T.anim(dim, [{ opacity: .7 }, { opacity: 0 }], 350)]);
    feet.forEach(f => f.g.remove()); showSl.remove(); dim.remove();
    /* 의자에 앉아 발을 내밀고, 왕자가 구두를 신겨 준다 */
    cind.look('sit', 'right');
    if (P) T.camTo(600, 280, 1, 500);
    const toe = () => [cind.x + cind.w * .37, FL - cind.h * .1];
    prince.look('slipper', 'left');
    await prince.move(cind.x + cind.w * .5 + 70, FL, 1000);
    prince.look('stand');
    put(T, slipper, prince.x - 40, FL - prince.h * .45, { to: 'right' });
    await slipper.move(...toe(), 700);
    sparkle(T, toe()[0], toe()[1], 60, 8);
    T.pop(toe()[0], toe()[1] - 60, tr('쏙!'));
    await sleep(500);
    await cutArt(T, 'fit', () => { popSfx(T); setTimeout(() => sparkleSfx(T), 250); });
    await say('구두가 꼭 맞았어요!');
    /* 앞치마 주머니(무릎 위)에서 다른 한 짝이 쏙 나온다 */
    put(T, slipper2, cind.x + 4, FL - cind.h * .36, { to: 'right' }); fadeIn(slipper2, 300);
    await slipper2.move(cind.x + 4, FL - cind.h * .46, 500, 'ease-out');
    glow(slipper2, 1200);
    await say('신데렐라는 주머니에서 다른 한 짝을 꺼냈어요.');
    hide(slipper2);
    put(T, fairy, X(880, 760), FL, { look: 'wand', to: 'left' }); fadeIn(fairy, 600);
    if (P) T.camTo(620, 280, 1, 500);
    sparkle(T, cind.x, FL - 100, 120, 14);
    hide(slipper);
    await T.anim(cind.pos, [{ opacity: 1 }, { opacity: .1 }], 350);
    cind.look('gown'); cind.pos.style.opacity = ''; fadeIn(cind, 450); glow(cind, 1200);
    await say('요정 대모가 다시 고운 옷을 입혀 주었어요.');
    await fadeOut(T, fairy, 500);

    /* ===== 10. 용서 (톡 3: 마지막 인사) ===== */
    await T.sceneCard(tr('함께 웃어요'), () => {
      scene('parlor_v2');
      put(T, L.garland, 500, 80);                          /* 벽 위 몰딩 아래, 샹들리에 뒤 */
      parlorBack();
      put(T, prince, X(140, 340), FL, { look: 'stand', to: 'right' });
      put(T, cind, X(420, 480), FL, { look: 'gown', to: 'right' });
      put(T, sis1, X(600, 600), FL, { look: 'sorry', to: 'left' });
      put(T, sis2, X(745, 700), FL + 4, { look: 'sorry', to: 'left' });
      put(T, step, X(885, 820), FL + 6, { look: 'stand', to: 'left' });
      parlorFront();
      if (P) camSnap(560, 280, 1);
    }, cind.pos);
    await say('신데렐라, 그동안 미안해. 정말 미안해.');
    cind.look('hug'); cind.hop(10, 340);
    await say('괜찮아요. 우리 함께 행복해요.');
    sis1.look('stand', 'left'); sis2.look('stand', 'left');
    await Promise.all([sis1.hop(12, 360), sis2.hop(12, 360)]);
    if (P) T.camTo(480, 280, 1, 500);
    await T.ask('신데렐라에게 톡 인사해요!', () => T.tap(cind.pos, { prompt: '신데렐라에게 톡 인사해요!' }));
    T.confetti(); sfx(T, 'tada', () => sparkleSfx(T));
    L.garland.hop(6, 420); if (chandDots) chandDots.style.display = '';
    glow(cind, 1200);
    await Promise.all([cind.hop(20, 460), sis1.hop(16, 460), sis2.hop(16, 460), prince.hop(12, 460)]);
    await say('모두 함께 웃었어요.');
    await say('착한 마음은 나를 괴롭힌 사람도 용서할 수 있어요.');
    T.finale();
    await sleep(1500);
    return '착한 마음은 나를 괴롭힌 사람도 용서할 수 있어요.';
  }

  Tale.mount({ title: '신데렐라', subtitle: '착한 마음은 용서할 줄 알아요', read: true, run: T => run(Tale.api) });
})();
