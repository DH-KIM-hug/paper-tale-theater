/* 미운 아기 오리 — 임시 도형(그레이박스) 버전. 기획: TALES_PLAN_2.md §16
   다르게 생겨 놀림받던 아기 오리가 사계절을 지나 백조로 자란다. 아이는 아기 오리의 마음을 알아주고, 자라는 순서를 맞춘다.
   학습: 감정 얼굴(기쁨·슬픔·무서움·화남) · 성장 순서(알→아기→어린 새→백조) · 계절 순서(여름→가을→겨울→봄) · 다름 인정·위로.
   순화: 사냥꾼은 나오지 않는다(화면 밖 "쾅!" 소리 → 기러기들이 날아가 버린다). 사냥개 생략. 놀림은 말로만, 곧 다정한 말로 답한다.
   웃음 컷: 알껍데기 모자 · 헤엄치다 쏙-퐁! · 고양이 흉내 "가르릉… 꽥!"
   2막: 1~6(여름) / 7~12(가을·겨울·봄) */
(() => {
  const C = { pine: '#3F6B4F', leaf: '#6E9A5B', cream: '#F6ECD8', gold: '#D9A94E', bark: '#6B4A32', bean: '#A93B32',
    indigo: '#1F2A56', persimmon: '#E8703A', amber: '#F2B366', snow: '#F4F6FA', ink: '#2E241C', pink: '#E8A0A0', skin: '#EDC9A0',
    grey: '#8E8A86', greyDk: '#6F6B67', young: '#B7B2AB', youngDk: '#9A958E', yellow: '#F2CE5A', yellowDk: '#D9A94E',
    orange: '#E8703A', beakDk: '#B8502A', water: '#6F9FC0', waterDk: '#5A8AAE', waterLt: '#9CC0D6', ice: '#D4E6EF', iceDk: '#AFCDDC',
    tear: '#7FB3D5', reed: '#8A9A5B', reedDk: '#6E7E45', cattail: '#7A5234', hen: '#D39A5E', henDk: '#B87E44', goose: '#A08E78' };

  /* ================= 페이퍼아트 그림 (assets/v3w/ud_*.webp) =================
     null이거나 파일을 못 불러오면 그 자리는 아래 임시 도형(그레이박스)으로 그린다. 새 그림이 나오면 여기 한 줄만 바꾸면 된다.
     배경은 장면마다 한 장을 무대에 꽉 채워 깐다. 물에 뜬 배우는 같은 배경 그림의 아래쪽을 배우 앞에 한 번 더 오려 깔아(frontCut) 몸 아래가 물에 잠긴다.
     - nest: 둥지가 작고 위쪽에 있어 그림을 1.7배 당겨 둥지를 가운데로 (다시 뽑기 목록)
     - reeds: 아래쪽 진한 흙·그늘을 밝혀 구움 · autumn: 나무 그늘·검은 흙을 밝혀 구움 · reflect: 형광 하늘색 물을 차분하게 */
  const AS = '../../assets/';
  const BG = {
    nest: 'v3w/ud_bg_nest.webp', pond: 'v3w/ud_bg_pond.webp', yard: 'v3w/ud_bg_yard.webp', reeds: 'v3w/ud_bg_reeds.webp',
    swamp: 'v3w/ud_bg_swamp.webp', swamp_high: 'v3w/ud_bg_swamp_high.webp', autumn: 'v3w/ud_bg_autumn.webp', winter: 'v3w/ud_bg_winter.webp',
    cabin: 'v3w/ud_bg_cabin.webp', spring: 'v3w/ud_bg_spring.webp', reflect: 'v3w/ud_bg_reflect.webp',
  };
  /* 배우·소품·컷 (모두 왼쪽을 본다)
     - 주인공: 알 → 아기(보통·슬픔·무서움·기쁨) → 어린 새(보통·덜덜·날개 활짝) → 백조. 같은 자라기 단계 안에서는 픽셀 배율이 같다(머리 크기가 튀지 않게)
     - 엄마·마당 흰 오리 = fc_duck, 수탉 = br_rooster, 고양이 = tn_cat_sit (다른 동화 그림 재사용)
     - 노란 형제: 형광 노랑을 차분한 병아리색으로 구움
     - 감정 카드 face_*: 머리만 동그랗게 오림. 기쁨·슬픔·무서움은 주인공 자세 그림 그대로(거울 카드 = 무대 위 주인공 얼굴),
       화남은 얼굴 그림(부리가 둘 → 옆 회색 부리를 지우고 주황 부리를 주인공 부리 색으로). 백조 넷은 얼굴 그림
     - 못 써서 그레이박스로 두는 것: cut_reflect(어린 새와 백조가 따로 나란히 있어 '물에 비친 내가 백조'가 아니라 '백조 친구'로 읽힌다, 어린 새도 오른쪽을 봄) */
  const ART = {
    egg: 'v3w/ud_egg.webp', baby: 'v3w/ud_baby.webp', baby_sad: 'v3w/ud_baby_sad.webp', baby_scared: 'v3w/ud_baby_scared.webp', baby_happy: 'v3w/ud_baby_happy.webp',
    young: 'v3w/ud_young.webp', young_sad: 'v3w/ud_young_sad.webp', young_wings: 'v3w/ud_young_wings.webp', swan: 'v3w/ud_swan.webp', swan_fly: 'v3w/ud_swan_fly.webp',
    duckling: 'v3w/ud_duckling.webp', mom: 'v3w/fc_duck.webp', hen: 'v3w/ud_hen.webp', rooster: 'v3w/br_rooster.webp', goose: 'v3w/ud_goose.webp',
    cat: 'v3w/tn_cat_sit.webp', grandma: 'v3w/ud_grandma.webp', farmer: 'v3w/ud_farmer.webp', reed: 'v3w/ud_reed.webp', reed_clump: 'v3w/ud_reed_clump.webp',
    face_happy: 'v3w/ud_face_happy.webp', face_sad: 'v3w/ud_face_sad.webp', face_scared: 'v3w/ud_face_scared.webp', face_angry: 'v3w/ud_face_angry.webp',
    face_swan_happy: 'v3w/ud_face_swan_happy.webp', face_swan_sad: 'v3w/ud_face_swan_sad.webp', face_swan_scared: 'v3w/ud_face_swan_scared.webp', face_swan_angry: 'v3w/ud_face_swan_angry.webp',
    cut_hatch: 'v3w/ud_cut_hatch.webp', cut_reflect: null,
  };
  const artOK = {}, bgOK = {};
  const artUrl = k => (ART[k] && artOK[k] !== false ? AS + ART[k] : null);
  const bgUrl = k => (BG[k] && bgOK[k] !== false ? AS + BG[k] : null);
  /* 자세 그림: [폭, 높이, 발끝 가운데 x(폭 비율), 발끝 y(높이 비율)] — 발끝 가운데가 (0,0). 백조는 몸 아래 가운데 */
  const SPR = {
    egg: [68.6, 95.6, .504, .978], baby: [94.6, 107.9, .483, .981], baby_sad: [89.3, 108.2, .542, .981], baby_scared: [90.5, 111.1, .422, .981], baby_happy: [94.5, 115.2, .47, .978],
    young: [98, 146.8, .434, .983], young_sad: [87.6, 146.8, .421, .983], young_wings: [139.8, 145.5, .477, .983], swan: [167, 192.9, .489, .981],
    duckling: [65.6, 72.4, .51, .983], mom: [66.1, 70.4, .498, .994], hen: [85.5, 95.1, .463, .983], rooster: [91.9, 100.4, .345, .996], goose: [92.9, 103.2, .464, .983],
    cat: [92.3, 80.3, .49, .997], grandma: [89.2, 170.3, .442, .983], farmer: [138, 216.4, .567, .984], reed: [93.2, 473.3, .393, .984], reed_clump: [207, 237, .488, .984],
  };
  function pic(T, g, key, x, y, w, h, { shadow = true } = {}) {
    const u = artUrl(key); if (!u) return null;
    const wrap = T.el('g', shadow ? { filter: 'url(#pp)' } : {}, g);
    T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
    return wrap;
  }
  const sprite = (T, g, key, k = 1) => { const s = SPR[key]; return s && artUrl(key) ? pic(T, g, key, -s[2] * s[0] * k, -s[3] * s[1] * k, s[0] * k, s[1] * k) : null; };
  /* 배경 그림: 무대 1000×560을 덮고 가장자리를 조금 더 덮는다 (그림 비율 1760:992).
     BG_FIT[key] = [배율, 그림 속 점 u, v(비율), 그 점이 올 무대 x, y] — 배율 1이면 그림 전체를 무대에 맞춘다 */
  const BG_EDGE = { nest: ['#a7cac7', '#415535'], pond: ['#bfd4d7', '#5f4326'], yard: ['#9ec8df', '#706e50'], reeds: ['#bad2d9', '#533f27'],
    swamp: ['#b5b9ab', '#515a5c'], swamp_high: ['#a1ad95', '#5a7076'], autumn: ['#fee7c8', '#4a280f'], winter: ['#d2e4f4', '#eef3fb'],
    cabin: ['#cab18f', '#88562f'], spring: ['#c3dcdf', '#889669'], reflect: ['#c5e4ed', '#77cae2'] };
  const BG_FIT = { nest: [1.7, .514, .425, 490, 330], reeds: [1.3, .5, .5, 500, 280] };
  function bgRect(key) {
    const w0 = 1080, h0 = w0 * 992 / 1760, f = BG_FIT[key];
    if (!f) return [-40, -24, w0, h0];
    const [z, u, v, sx, sy] = f, w = w0 * z, h = h0 * z;
    return [sx - u * w, sy - v * h, w, h];
  }
  function bgImage(T, key) {
    const u = bgUrl(key); if (!u) return null;
    const [x, y, w, h] = bgRect(key);
    const [top, bot] = BG_EDGE[key];
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 1400 + y + h / 2, fill: top }, T.bg);
    T.el('rect', { x: -1400, y: y + h / 2, width: 3800, height: 2000, fill: bot }, T.bg);
    return T.el('image', { href: u, x, y, width: w, height: h, preserveAspectRatio: 'none' }, T.bg);
  }
  /* 배경 그림의 y 아래쪽만 배우 앞에 한 번 더: 물에 뜬 배우는 몸 아래가 잠기고, 둑 너머 배우는 둑에 가린다 (같은 그림이라 이음매가 없다) */
  let clipN = 0;
  function frontCut(T, key, y, op = 1) {
    const u = bgUrl(key); if (!u) return null;
    const id = 'udCut' + (++clipN), [x0, y0, w, h] = bgRect(key);
    const g = T.el('g', { 'pointer-events': 'none' }, T.world);
    T.el('rect', { x: -1400, y, width: 3800, height: 2000 }, T.el('clipPath', { id }, g));
    T.el('image', { href: u, x: x0, y: y0, width: w, height: h, preserveAspectRatio: 'none', 'clip-path': `url(#${id})`, opacity: op }, g);
    return g;
  }

  /* ================= 표정 (정면 얼굴, 머리 반지름 26 기준) ================= */
  const MOOD_LABEL = { happy: '기뻐요', sad: '슬퍼요', scared: '무서워요', angry: '화나요' };
  const MOOD_FACE = { happy: '기쁜 얼굴', sad: '슬픈 얼굴', scared: '무서워하는 얼굴', angry: '화난 얼굴' };
  function moodFace(T, g, x, y, s, mood, beak = C.orange) {
    const { el } = T;
    const f = el('g', { transform: `translate(${x},${y}) scale(${s})` }, g);
    const line = (d, w = 3.2) => el('path', { d, stroke: C.ink, 'stroke-width': w, fill: 'none', 'stroke-linecap': 'round' }, f);
    const dotEyes = (r = 4, yy = -2) => [-10, 10].forEach(ex => { el('circle', { cx: ex, cy: yy, r, fill: C.ink }, f); el('circle', { cx: ex + 1.3, cy: yy - 1.3, r: r * .32, fill: '#fff' }, f); });
    if (mood === 'happy') {
      line('M-15 0 Q-10 -9 -5 0'); line('M5 0 Q10 -9 15 0');
      [-17, 17].forEach(cx => el('circle', { cx, cy: 8, r: 4.5, fill: C.pink, opacity: .9 }, f));
      el('path', { d: 'M-10 11 Q0 25 10 11 Z', fill: C.beakDk }, f);
      el('ellipse', { cx: 0, cy: 9, rx: 12, ry: 4.5, fill: beak }, f);
    } else if (mood === 'sad') {
      dotEyes(3.6, 0);
      line('M-17 -6 L-5 -12', 3); line('M5 -12 L17 -6', 3); // 八자 눈썹
      el('path', { d: 'M-12 5 Q-17 13 -12 16 Q-7 13 -12 5 Z', fill: C.tear }, f); // 눈물 한 방울
      el('ellipse', { cx: 0, cy: 12, rx: 10, ry: 4, fill: beak }, f);
      line('M-6 19 Q0 15 6 19', 2.4);
    } else if (mood === 'scared') {
      [-10, 10].forEach(ex => { el('circle', { cx: ex, cy: -2, r: 7, fill: '#fff', stroke: C.ink, 'stroke-width': 1.6 }, f); el('circle', { cx: ex, cy: -2, r: 2.6, fill: C.ink }, f); });
      line('M-17 -13 Q-11 -19 -5 -14', 2.6); line('M5 -14 Q11 -19 17 -13', 2.6);
      el('ellipse', { cx: 0, cy: 12, rx: 7, ry: 6, fill: beak }, f);
      el('ellipse', { cx: 0, cy: 12.5, rx: 3.4, ry: 3, fill: C.ink }, f);
      el('path', { d: 'M20 -12 Q16 -5 20 -3 Q24 -5 20 -12 Z', fill: C.tear }, f); // 식은땀
    } else if (mood === 'angry') {
      dotEyes(3.6, 0);
      line('M-17 -12 L-5 -6', 3.6); line('M5 -6 L17 -12', 3.6); // V자 눈썹
      [-17, 17].forEach(cx => el('circle', { cx, cy: 8, r: 5.5, fill: '#E0604A', opacity: .85 }, f));
      el('ellipse', { cx: 0, cy: 11, rx: 12, ry: 4, fill: beak }, f);
      line('M-7 11 L7 11', 2);
    } else {
      dotEyes();
      el('ellipse', { cx: 0, cy: 9, rx: 12, ry: 5, fill: beak }, f);
      line('M-8 9 Q0 11 8 9', 1.8);
    }
    return f;
  }

  /* ================= 주인공 (알 → 아기 → 어린 새 → 백조). 왼쪽을 본다, 발끝 = 0,0 ================= */
  const HERO_H = { egg: 92, baby: 104, young: 142, swan: 186 };
  /* 그림 주인공: 기분마다 자세 그림 한 장. 날개 조각(wing·wingBack)은 빈 묶음으로 두어 코드의 날개 움직임이 그대로 돌아도 아무 일이 없다.
     'wings' = 봄에 날개를 활짝 편 어린 새(그레이박스에서는 기쁜 얼굴) */
  const HERO_ART = {
    egg: () => 'egg',
    baby: m => ({ sad: 'baby_sad', scared: 'baby_scared', happy: 'baby_happy' })[m] || 'baby',
    young: m => ({ sad: 'young_sad', wings: 'young_wings' })[m] || 'young',
    swan: () => 'swan',
  };
  const HERO_PT = { egg: { shoulder: [0, -46], head: [0, -46] }, baby: { shoulder: [2, -38], head: [-12, -74] },
    young: { shoulder: [-4, -52], head: [-22, -126] }, swan: { shoulder: [-10, -52], head: [-38, -164] } };
  const heroArtKey = (form, mood) => { const k = HERO_ART[form](mood); return artUrl(k) ? k : null; };
  function heroArt(T, g, form, mood) {
    const k = heroArtKey(form, mood);
    if (!k) return null;
    sprite(T, g, k);
    const p = { wing: T.el('g', {}, g), wingBack: T.el('g', {}, g), ...HERO_PT[form], art: k };
    if (form === 'egg') p.crack = T.el('g', {}, g);
    const s = SPR[k];
    T.el('rect', { x: -s[2] * s[0], y: -s[3] * s[1], width: s[0], height: s[1], fill: '#fff', opacity: 0 }, g);
    return p;
  }
  const HERO = {
    egg(T, g) {
      const A = heroArt(T, g, 'egg'); if (A) return A;
      const { paper, el } = T;
      paper(g, [['ellipse', { cx: 0, cy: -46, rx: 36, ry: 46, fill: '#E9E2D0' }]]);
      [[-12, -62, 4], [10, -40, 5], [-6, -22, 3.5], [16, -70, 3]].forEach(([cx, cy, r]) => el('circle', { cx, cy, r, fill: '#B8AE98' }, g));
      const crack = el('g', {}, g);
      el('rect', { x: -50, y: -100, width: 100, height: 104, fill: '#fff', opacity: 0 }, g);
      return { crack };
    },
    baby(T, g, mood) {
      const A = heroArt(T, g, 'baby', mood); if (A) return A;
      if (mood === 'wings') mood = 'happy';
      const { paper, el } = T;
      const wingBack = el('g', {}, g);
      paper(wingBack, [['ellipse', { cx: 18, cy: -40, rx: 18, ry: 10, fill: C.greyDk }]]);
      paper(g, [
        ['rect', { x: -14, y: -12, width: 9, height: 12, rx: 3, fill: C.orange }], ['rect', { x: 6, y: -12, width: 9, height: 12, rx: 3, fill: C.orange }],
        ['path', { d: 'M34 -40 L52 -56 L46 -28 Z', fill: C.greyDk }],
        ['ellipse', { cx: 6, cy: -32, rx: 38, ry: 26, fill: C.grey }],
        ['circle', { cx: -10, cy: -74, r: 26, fill: C.grey }],
        ['path', { d: 'M-16 -98 Q-12 -112 -4 -100 Q2 -114 6 -97 Z', fill: C.greyDk }],
      ]);
      const wing = el('g', {}, g);
      paper(wing, [['ellipse', { cx: 14, cy: -34, rx: 20, ry: 12, fill: C.greyDk }]]);
      moodFace(T, g, -10, -74, 1, mood);
      el('rect', { x: -46, y: -112, width: 100, height: 114, fill: '#fff', opacity: 0 }, g);
      return { wing, wingBack, shoulder: [2, -38], head: [-10, -74] };
    },
    young(T, g, mood) {
      const A = heroArt(T, g, 'young', mood); if (A) return A;
      if (mood === 'wings') mood = 'happy';
      const { paper, el } = T;
      const wingBack = el('g', {}, g);
      paper(wingBack, [['ellipse', { cx: 22, cy: -54, rx: 34, ry: 15, fill: C.youngDk }]]);
      paper(g, [
        ['rect', { x: -16, y: -16, width: 10, height: 16, rx: 3, fill: C.ink }], ['rect', { x: 8, y: -16, width: 10, height: 16, rx: 3, fill: C.ink }],
        ['path', { d: 'M52 -50 L74 -66 L66 -34 Z', fill: C.youngDk }],
        ['ellipse', { cx: 8, cy: -44, rx: 52, ry: 32, fill: C.young }],
        ['rect', { x: -26, y: -118, width: 24, height: 76, rx: 12, fill: C.young }],
        ['circle', { cx: -14, cy: -116, r: 26, fill: C.young }],
        ['ellipse', { cx: 0, cy: -34, rx: 30, ry: 12, fill: '#D6D2CB' }],
      ]);
      const wing = el('g', {}, g);
      paper(wing, [['ellipse', { cx: 18, cy: -48, rx: 32, ry: 15, fill: C.youngDk }]]);
      moodFace(T, g, -14, -116, 1, mood, '#9C8570');
      el('rect', { x: -56, y: -150, width: 136, height: 152, fill: '#fff', opacity: 0 }, g);
      return { wing, wingBack, shoulder: [-4, -52], head: [-14, -116] };
    },
    swan(T, g, mood) {
      const A = heroArt(T, g, 'swan', mood); if (A) return A;
      if (mood === 'wings') mood = 'happy';
      const { paper, el } = T;
      const wingBack = el('g', {}, g);
      paper(wingBack, [['path', { d: 'M-6 -56 Q40 -92 96 -60 Q50 -40 -6 -56 Z', fill: '#E3E7EE' }]]);
      paper(g, [
        ['path', { d: 'M70 -46 L100 -64 L92 -30 Z', fill: C.snow }],
        ['ellipse', { cx: 14, cy: -40, rx: 70, ry: 34, fill: C.snow }],
      ]);
      el('path', { d: 'M-38 -52 Q-74 -104 -42 -150', stroke: C.snow, 'stroke-width': 22, fill: 'none', 'stroke-linecap': 'round', filter: 'url(#pp)' }, g);
      paper(g, [['circle', { cx: -42, cy: -160, r: 23, fill: C.snow }]]);
      const wing = el('g', {}, g);
      paper(wing, [['path', { d: 'M-16 -48 Q30 -84 86 -50 Q40 -26 -16 -48 Z', fill: '#E3E7EE' }]]);
      moodFace(T, g, -42, -160, .88, mood);
      el('rect', { x: -84, y: -190, width: 190, height: 192, fill: '#fff', opacity: 0 }, g);
      return { wing, wingBack, shoulder: [-10, -52], head: [-42, -160] };
    },
  };
  function makeHero(T) {
    let inner;
    const st = { form: 'egg', mood: 'neutral' };
    const a = T.actor(T.world, -400, 0, g => {
      inner = T.el('g', {}, g);
      inner.style.transformBox = 'view-box'; inner.style.transformOrigin = '0 0'; inner.style.transition = 'transform .35s ease-out';
    });
    a.inner = inner;
    a.redraw = () => {
      inner.innerHTML = '';
      a.parts = HERO[st.form](T, inner, st.mood);
      [a.parts.wing, a.parts.wingBack].forEach(w => { if (!w) return; w.style.transformBox = 'view-box'; w.style.transformOrigin = `${a.parts.shoulder[0]}px ${a.parts.shoulder[1]}px`; w.style.transition = 'transform .3s ease-out'; });
    };
    a.setForm = f => { st.form = f; a.redraw(); };
    a.setMood = m => { st.mood = m; a.redraw(); };
    Object.defineProperty(a, 'mood', { get: () => st.mood });
    /* 그림 주인공은 슬픔·무서움 자세가 그림 속에 이미 있어 몸을 찌그러뜨리지 않는다 (고개 들기 rotate는 그대로) */
    a.pose = tf => { inner.style.transform = (tf && a.parts.art && !/rotate/.test(tf)) ? '' : (tf || ''); };
    Object.defineProperty(a, 'art', { get: () => !!(a.parts && a.parts.art) });
    Object.defineProperty(a, 'form', { get: () => st.form });
    a.headPt = () => { const [hx, hy] = a.parts.head || [0, -46]; return [a.x + hx * a.scale * a.flip, a.y + hy * a.scale]; };
    a.redraw();
    return a;
  }

  /* ================= 다른 배우들 (왼쪽을 본다, 발끝 = 0,0) ================= */
  function sideDuck(T, g, { body, wing, beak = C.orange, feet = C.orange }) {
    const { paper, el } = T;
    paper(g, [
      ['rect', { x: -10, y: -8, width: 7, height: 8, rx: 2, fill: feet }], ['rect', { x: 4, y: -8, width: 7, height: 8, rx: 2, fill: feet }],
      ['path', { d: 'M26 -30 L42 -44 L38 -22 Z', fill: body }],
      ['ellipse', { cx: 4, cy: -24, rx: 30, ry: 19, fill: body }],
      ['circle', { cx: -16, cy: -48, r: 17, fill: body }],
      ['path', { d: 'M-30 -52 L-48 -47 L-30 -41 Z', fill: beak }],
    ]);
    const w = el('g', {}, g);
    paper(w, [['ellipse', { cx: 8, cy: -26, rx: 15, ry: 9, fill: wing }]]);
    w.style.transformBox = 'view-box'; w.style.transformOrigin = '0px -30px';
    el('circle', { cx: -22, cy: -52, r: 3, fill: C.ink }, g);
    el('rect', { x: -50, y: -70, width: 94, height: 72, fill: '#fff', opacity: 0 }, g);
    return { wing: w };
  }
  const DRAW = {
    duckling: (T, g) => sideDuck(T, g, { body: C.yellow, wing: C.yellowDk }),
    mom: (T, g) => sideDuck(T, g, { body: C.snow, wing: '#DADFE8' }),
    hen(T, g, rooster = false) {
      const { paper, el } = T;
      const body = rooster ? '#C8663A' : C.hen, dk = rooster ? '#9E4A28' : C.henDk;
      paper(g, [
        ['rect', { x: -10, y: -18, width: 6, height: 18, fill: C.gold }], ['rect', { x: 6, y: -18, width: 6, height: 18, fill: C.gold }],
        ...(rooster ? [['path', { d: 'M24 -40 Q60 -90 50 -30 Z', fill: C.pine }], ['path', { d: 'M24 -36 Q70 -70 58 -20 Z', fill: C.ink }]]
          : [['path', { d: 'M26 -36 L48 -60 L44 -26 Z', fill: dk }]]),
        ['ellipse', { cx: 4, cy: -38, rx: 32, ry: 24, fill: body }],
        ['circle', { cx: -18, cy: -66, r: 16, fill: body }],
        ['path', { d: rooster ? 'M-30 -78 Q-28 -100 -20 -84 Q-16 -104 -8 -84 Q0 -98 0 -76 Z' : 'M-26 -78 Q-22 -92 -16 -80 Q-10 -92 -6 -78 Z', fill: C.bean }],
        ['path', { d: 'M-32 -66 L-46 -62 L-32 -58 Z', fill: C.gold }],
        ['ellipse', { cx: -30, cy: -52, rx: 4, ry: 7, fill: C.bean }],
        ['ellipse', { cx: 8, cy: -38, rx: 16, ry: 10, fill: dk }],
      ]);
      el('circle', { cx: -22, cy: -70, r: 3, fill: C.ink }, g);
      el('rect', { x: -50, y: -100, width: 100, height: 102, fill: '#fff', opacity: 0 }, g);
    },
    rooster: (T, g) => DRAW.hen(T, g, true),
    goose(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['path', { d: 'M34 -34 L54 -46 L48 -22 Z', fill: C.bark }],
        ['ellipse', { cx: 6, cy: -26, rx: 40, ry: 20, fill: C.goose }],
        ['rect', { x: -30, y: -86, width: 12, height: 62, rx: 6, fill: C.ink }],
        ['ellipse', { cx: -30, cy: -88, rx: 14, ry: 11, fill: C.ink }],
        ['ellipse', { cx: -28, cy: -84, rx: 6, ry: 4, fill: C.snow }],
        ['path', { d: 'M-42 -90 L-56 -86 L-42 -82 Z', fill: C.ink }],
        ['ellipse', { cx: 12, cy: -28, rx: 20, ry: 10, fill: '#857462' }],
      ]);
      el('circle', { cx: -34, cy: -91, r: 2.4, fill: '#fff' }, g);
      el('rect', { x: -60, y: -104, width: 116, height: 106, fill: '#fff', opacity: 0 }, g);
    },
    cat(T, g) {
      const { paper, el } = T;
      paper(g, [
        ...[-20, -6, 16, 28].map(x => ['rect', { x: x - 4, y: -22, width: 9, height: 22, rx: 4, fill: '#C8913E' }]),
        ['path', { d: 'M30 -34 Q52 -40 46 -82', stroke: C.gold, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }],
        ['ellipse', { cx: 6, cy: -32, rx: 32, ry: 17, fill: C.gold }],
        ['path', { d: 'M-40 -60 L-36 -80 L-24 -64 Z M-18 -64 L-10 -80 L-6 -58 Z', fill: C.gold }],
        ['circle', { cx: -24, cy: -50, r: 18, fill: C.gold }],
      ]);
      [-2, 10, 22].forEach(x => el('rect', { x, y: -46, width: 5, height: 14, rx: 2, fill: C.persimmon }, g));
      el('path', { d: 'M-36 -54 Q-32 -58 -28 -54 M-20 -54 Q-16 -58 -12 -54', stroke: C.ink, 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, g);
      el('circle', { cx: -27, cy: -45, r: 2.5, fill: C.pink }, g);
      el('path', { d: 'M-34 -44 L-50 -46 M-34 -41 L-50 -38', stroke: C.ink, 'stroke-width': 1.5 }, g);
      el('rect', { x: -54, y: -86, width: 106, height: 88, fill: '#fff', opacity: 0 }, g);
    },
    grandma(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['rect', { x: -14, y: -24, width: 10, height: 24, fill: C.bark }], ['rect', { x: 4, y: -24, width: 10, height: 24, fill: C.bark }],
        ['path', { d: 'M-24 -96 L24 -96 L38 -18 L-38 -18 Z', fill: C.persimmon }],
        ['path', { d: 'M-18 -80 L10 -80 L14 -26 L-22 -26 Z', fill: C.cream }],
        ['rect', { x: -24, y: -124, width: 48, height: 36, rx: 14, fill: C.snow }],
        ['circle', { cx: 0, cy: -142, r: 23, fill: C.skin }],
        ['path', { d: 'M-26 -140 A26 26 0 0 1 26 -140 L34 -118 L20 -128 L-24 -134 Z', fill: C.bean }],
      ]);
      el('path', { d: 'M-16 -144 Q-11 -148 -6 -144', stroke: C.ink, 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, g);
      el('path', { d: 'M-16 -130 Q-10 -125 -4 -130', stroke: C.ink, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }, g);
      el('circle', { cx: -4, cy: -134, r: 4, fill: C.pink, opacity: .8 }, g);
    },
    farmer(T, g) {
      const { paper, el } = T;
      paper(g, [
        ['rect', { x: -18, y: -62, width: 14, height: 62, rx: 5, fill: C.bark }], ['rect', { x: 4, y: -62, width: 14, height: 62, rx: 5, fill: C.bark }],
        ['rect', { x: -22, y: -10, width: 20, height: 10, rx: 4, fill: C.ink }], ['rect', { x: 0, y: -10, width: 20, height: 10, rx: 4, fill: C.ink }],
        ['rect', { x: -32, y: -138, width: 64, height: 84, rx: 20, fill: C.pine }],
        ['rect', { x: -32, y: -74, width: 64, height: 8, fill: C.gold }],
        ['circle', { cx: 0, cy: -160, r: 26, fill: C.skin }],
        ['ellipse', { cx: -6, cy: -142, rx: 20, ry: 14, fill: C.snow }],
        ['ellipse', { cx: 0, cy: -178, rx: 48, ry: 10, fill: C.gold }], ['path', { d: 'M-24 -180 Q0 -214 24 -180 Z', fill: C.gold }],
        ['rect', { x: -24, y: -186, width: 48, height: 6, fill: C.bean }],
      ]);
      el('path', { d: 'M-18 -162 Q-13 -166 -8 -162', stroke: C.ink, 'stroke-width': 2.6, fill: 'none', 'stroke-linecap': 'round' }, g);
      el('circle', { cx: -26, cy: -152, r: 6, fill: '#D99A7A' }, g);
      const arm = el('g', {}, g);
      el('path', { d: 'M-6 -120 L-56 -104', stroke: C.pine, 'stroke-width': 17, 'stroke-linecap': 'round' }, arm);
      el('circle', { cx: -60, cy: -103, r: 9, fill: C.skin }, arm);
      arm.style.transformBox = 'view-box'; arm.style.transformOrigin = '-6px -120px'; arm.style.transition = 'transform .15s';
      el('rect', { x: -70, y: -214, width: 120, height: 216, fill: '#fff', opacity: 0 }, g);
      return { arm };
    },
  };
  /* 그림 배우: 그림이 있으면 그림 한 장(발끝 = 0,0), 없으면 위 그레이박스. 농부 팔(arm)은 빈 묶음 — 그림 속 팔이 이미 앞으로 뻗어 있다 */
  {
    const greyHen = DRAW.hen;
    const GREY = { ...DRAW, hen: (T, g) => greyHen(T, g), rooster: (T, g) => greyHen(T, g, true) };
    ['duckling', 'mom', 'hen', 'rooster', 'goose', 'cat', 'grandma', 'farmer'].forEach(k => {
      DRAW[k] = (T, g) => {
        if (!sprite(T, g, k)) return GREY[k](T, g);
        const s = SPR[k];
        T.el('rect', { x: -s[2] * s[0], y: -s[3] * s[1], width: s[0], height: s[1], fill: '#fff', opacity: 0 }, g);
        return k === 'farmer' ? { arm: T.el('g', {}, g) } : {};
      };
    });
  }
  function cast(T, key, x, y, scale = 1, parent = T.world) {
    let parts;
    const a = T.actor(parent, x, y, g => { parts = DRAW[key](T, g); }, { scale });
    a.parts = parts || {};
    return a;
  }
  /* 물에 뜬 배우: 다리(발끝 위 frac 만큼)를 감추고 물결 한 줄을 깐다 — 앞에 오려 깔 물 그림이 없는 하이앵글 늪에서 기러기가 물 위에 '서' 있지 않게 */
  let wadeN = 0;
  function wade(T, a, key, frac = .17) {
    const s = SPR[key]; if (!s || !artUrl(key)) return;
    const cut = -frac * s[1], id = 'udWade' + (++wadeN);
    T.el('rect', { x: -400, y: -800, width: 800, height: 800 + cut }, T.el('clipPath', { id }, a.pos));
    a.body.setAttribute('clip-path', `url(#${id})`);
    const rip = T.el('ellipse', { cx: 0, cy: cut + 1, rx: s[0] * .42, ry: 4, fill: '#C9DCE4', opacity: .7 }, a.pos);
    a.pos.insertBefore(rip, a.body); a.ripple = rip;
  }
  /* 하늘을 나는 백조 (오른쪽 → 왼쪽으로 난다) */
  function flyingSwan(T, parent, x, y, s = 1) {
    const { el, paper } = T;
    const g = el('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
    if (artUrl('swan_fly')) { // 그림: 날개를 편 옆모습 한 장이 위아래로 살랑
      const w = el('g', {}, g);
      pic(T, w, 'swan_fly', -65, -25.5, 130, 51);
      w.animate([{ transform: 'translateY(0) rotate(0deg)' }, { transform: 'translateY(-6px) rotate(-2deg)' }, { transform: 'translateY(0) rotate(0deg)' }], { duration: 1000 + Math.random() * 300, iterations: Infinity });
      return g;
    }
    const wu = el('g', {}, g);
    paper(wu, [['path', { d: 'M-4 -4 L22 -44 L30 -4 Z', fill: '#E3E7EE' }]]);
    paper(g, [['ellipse', { cx: 6, cy: 0, rx: 30, ry: 10, fill: C.snow }], ['path', { d: 'M-18 -2 L-50 -8', stroke: C.snow, 'stroke-width': 7, 'stroke-linecap': 'round' }],
      ['circle', { cx: -52, cy: -9, r: 7, fill: C.snow }], ['path', { d: 'M-58 -10 L-68 -7 L-58 -5 Z', fill: C.orange }]]);
    wu.style.transformBox = 'view-box'; wu.style.transformOrigin = '0 -4px';
    wu.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(-.7)' }, { transform: 'scaleY(1)' }], { duration: 900 + Math.random() * 200, iterations: Infinity });
    return g;
  }

  /* ================= 배경 (장면마다 통판 1장) ================= */
  function fill(T, color) { return T.el('rect', { x: -400, y: -400, width: 1800, height: 1400, fill: color }, T.bg); }
  function tufts(T, list, color = C.leaf) { list.forEach(([x, y]) => T.paper(T.bg, [['path', { d: `M${x - 14} ${y} L${x - 8} ${y - 22} L${x - 2} ${y} L${x + 4} ${y - 28} L${x + 10} ${y} L${x + 16} ${y - 18} L${x + 20} ${y} Z`, fill: color }]])); }
  function nestBG(T) { // 둥지 하이앵글 (여름)
    if (bgImage(T, 'nest')) return true;
    const { paper, el } = T;
    fill(T, '#A6BF74');
    paper(T.bg, [['ellipse', { cx: 960, cy: 40, rx: 300, ry: 150, fill: C.water }], ['ellipse', { cx: 980, cy: 30, rx: 230, ry: 100, fill: C.waterLt }]]);
    tufts(T, [[80, 90], [180, 480], [260, 130], [120, 300], [850, 380], [900, 520], [760, 120], [60, 520], [940, 260]]);
    [[140, 200, C.snow], [880, 460, C.yellow], [90, 420, C.snow], [820, 80, C.yellow]].forEach(([cx, cy, f]) => paper(T.bg, [['circle', { cx, cy, r: 10, fill: f }], ['circle', { cx, cy, r: 4, fill: C.gold }]]));
    paper(T.bg, [['ellipse', { cx: 490, cy: 340, rx: 250, ry: 170, fill: C.bark }]]);
    paper(T.bg, [['ellipse', { cx: 490, cy: 336, rx: 212, ry: 138, fill: C.gold }]]);
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2, r1 = 1.02, r2 = 1.14;
      el('path', { d: `M${490 + Math.cos(a) * 212 * r1} ${336 + Math.sin(a) * 138 * r1} L${490 + Math.cos(a + .2) * 212 * r2} ${336 + Math.sin(a + .2) * 138 * r2}`, stroke: '#C39445', 'stroke-width': 6, 'stroke-linecap': 'round' }, T.bg);
    }
    paper(T.bg, [['ellipse', { cx: 490, cy: 344, rx: 170, ry: 104, fill: '#E3BD6C' }]]);
  }
  function pondSideBG(T) { // 연못 옆 모습
    if (bgImage(T, 'pond')) return true;
    const { paper } = T;
    fill(T, '#DCEBEF');
    paper(T.bg, [['circle', { cx: 140, cy: 90, r: 44, fill: '#F6D98A' }]]);
    [[230, 110], [680, 70]].forEach(([x, y]) => paper(T.bg, [['ellipse', { cx: x, cy: y, rx: 70, ry: 22, fill: C.snow }], ['ellipse', { cx: x + 36, cy: y - 12, rx: 38, ry: 20, fill: C.snow }]]));
    paper(T.bg, [['path', { d: 'M-300 380 Q200 300 520 350 Q800 300 1300 360 V600 H-300 Z', fill: '#8FAE82' }]]);
    paper(T.bg, [['rect', { x: -300, y: 400, width: 1600, height: 400, fill: C.water }]]);
    for (let i = 0; i < 4; i++) T.el('rect', { x: -300, y: 430 + i * 32, width: 1600, height: 5, fill: C.waterLt, opacity: .6 }, T.bg);
    reeds(T, T.bg, [[-10, 400], [30, 400], [960, 400], [1000, 400]], 180);
  }
  function waterFront(T, y, color = C.water, op = .92) {
    const g = T.paper(T.world, [['rect', { x: -400, y, width: 1800, height: 400, fill: color, opacity: op }]]);
    T.el('rect', { x: -400, y, width: 1800, height: 5, fill: C.waterLt }, g);
    return g;
  }
  function reeds(T, parent, list, h = 300, color = C.reed) {
    const g = T.el('g', {}, parent);
    list.forEach(([x, y], i) => {
      const hh = h * (.85 + (i % 3) * .1);
      T.paper(g, [['path', { d: `M${x - 6} ${y} Q${x - 2} ${y - hh / 2} ${x + 4} ${y - hh} Q${x + 6} ${y - hh / 2} ${x + 8} ${y} Z`, fill: i % 2 ? color : C.reedDk }],
        ['rect', { x: x - 3, y: y - hh - 38, width: 14, height: 40, rx: 7, fill: C.cattail }],
        ['path', { d: `M${x} ${y - hh * .4} Q${x - 40} ${y - hh * .6} ${x - 50} ${y - hh * .45}`, stroke: color, 'stroke-width': 6, fill: 'none' }]]);
    });
    return g;
  }
  function yardBG(T) { // 농장 마당 와이드
    if (bgImage(T, 'yard')) return true;
    const { paper, el } = T;
    fill(T, '#D6E6DA');
    el('circle', { cx: 880, cy: 90, r: 40, fill: '#F6D98A' }, T.bg);
    paper(T.bg, [['path', { d: 'M-60 420 L-60 200 L90 110 L240 200 L240 420 Z', fill: C.bean }], ['path', { d: 'M-80 212 L90 96 L260 212 L240 222 L90 124 L-60 222 Z', fill: C.bark }],
      ['rect', { x: 40, y: 290, width: 100, height: 130, fill: '#5A2A22' }]]);
    for (let i = 0; i < 8; i++) paper(T.bg, [['rect', { x: 290 + i * 90, y: 300, width: 16, height: 120, rx: 5, fill: C.cream }]]);
    paper(T.bg, [['rect', { x: 260, y: 330, width: 800, height: 12, fill: C.cream }], ['rect', { x: 260, y: 380, width: 800, height: 12, fill: C.cream }]]);
    paper(T.bg, [['rect', { x: -300, y: 410, width: 1600, height: 400, fill: '#C9A95E' }]]);
    tufts(T, [[330, 470], [700, 530], [120, 520], [900, 480]], C.leaf);
  }
  function reedEyeBG(T) { // 갈대숲 눈높이
    const art = bgImage(T, 'reeds'); if (art) return art; // 그림: 배경 한 장이 통째로 천천히 밀린다(1.3배로 당겨 둔 여유만큼)
    const { paper } = T;
    fill(T, '#E6EEDC');
    paper(T.bg, [['rect', { x: -300, y: 500, width: 1600, height: 300, fill: '#8A7A50' }]]);
    const list = []; for (let i = 0; i < 26; i++) list.push([-240 + i * 62, 506]);
    return reeds(T, T.bg, list, 360, '#9AAA6B');
  }
  function swampBG(T) { // 늪 와이드
    if (bgImage(T, 'swamp')) return true;
    const { paper, el } = T;
    fill(T, '#D8E3DA');
    [[200, 90], [760, 120]].forEach(([x, y]) => paper(T.bg, [['ellipse', { cx: x, cy: y, rx: 80, ry: 22, fill: C.snow }]]));
    paper(T.bg, [['path', { d: 'M-300 340 Q300 280 600 320 Q850 290 1300 330 V600 H-300 Z', fill: '#7E9468' }]]);
    paper(T.bg, [['path', { d: 'M-300 390 Q500 360 1300 392 V800 H-300 Z', fill: '#6A8FA4' }]]);
    for (let i = 0; i < 3; i++) el('rect', { x: -300, y: 430 + i * 40, width: 1600, height: 4, fill: C.waterLt, opacity: .5 }, T.bg);
    reeds(T, T.bg, [[40, 400], [80, 400], [120, 400], [880, 400], [930, 400], [980, 400]], 200);
    paper(T.bg, [['ellipse', { cx: 250, cy: 470, rx: 44, ry: 12, fill: C.leaf }], ['ellipse', { cx: 780, cy: 510, rx: 40, ry: 11, fill: C.leaf }]]);
  }
  function swampHighBG(T) { // 늪 하이앵글 — 물이 화면 가득, 갈대 덤불은 위에서 본 동그라미
    if (bgImage(T, 'swamp_high')) return true;
    const { paper, el } = T;
    fill(T, '#6A8FA4');
    for (let i = 0; i < 7; i++) el('ellipse', { cx: 120 + (i * 173) % 860, cy: 80 + (i * 97) % 440, rx: 60, ry: 10, fill: C.waterLt, opacity: .45 }, T.bg);
    [[90, 110, 70], [900, 90, 80], [120, 470, 90], [880, 460, 80]].forEach(([cx, cy, r]) => paper(T.bg, [['circle', { cx, cy, r, fill: C.reedDk }], ['circle', { cx: cx + 10, cy: cy - 8, r: r * .7, fill: C.reed }]]));
    paper(T.bg, [['ellipse', { cx: 500, cy: 360, rx: 170, ry: 90, fill: '#7E9468' }]]);
  }
  function autumnLowBG(T) { // 가을 호수 로우앵글 — 하늘이 크게
    if (bgImage(T, 'autumn')) return true;
    const { paper, el } = T;
    fill(T, '#F4D9AE');
    el('circle', { cx: 830, cy: 120, r: 54, fill: '#F7E2A0' }, T.bg);
    [[160, 80], [520, 60]].forEach(([x, y]) => paper(T.bg, [['ellipse', { cx: x, cy: y, rx: 80, ry: 20, fill: '#FBEBD0' }]]));
    const tree = (x, s, c1, c2) => paper(T.bg, [['rect', { x: x - 12 * s, y: 540 - 260 * s, width: 24 * s, height: 260 * s, fill: C.bark }],
      ['circle', { cx: x, cy: 540 - 280 * s, r: 90 * s, fill: c1 }], ['circle', { cx: x - 60 * s, cy: 540 - 220 * s, r: 60 * s, fill: c2 }], ['circle', { cx: x + 60 * s, cy: 540 - 230 * s, r: 64 * s, fill: c2 }]]);
    tree(40, 1.3, C.persimmon, C.gold); tree(960, 1.2, C.gold, C.persimmon);
    paper(T.bg, [['path', { d: 'M-300 500 Q500 470 1300 500 V800 H-300 Z', fill: '#A8743E' }]]);
    paper(T.bg, [['path', { d: 'M200 520 Q500 505 800 520 L820 560 L180 560 Z', fill: C.water }]]);
  }
  function winterHighBG(T) { // 겨울 호수 하이앵글
    if (bgImage(T, 'winter')) return true;
    const { paper, el } = T;
    fill(T, C.snow);
    [[80, 80], [920, 100], [70, 480], [930, 470]].forEach(([cx, cy]) => paper(T.bg, [['circle', { cx, cy, r: 50, fill: '#DDE3EA' }], ['circle', { cx: cx + 6, cy: cy - 6, r: 30, fill: C.snow }]]));
    paper(T.bg, [['ellipse', { cx: 500, cy: 300, rx: 400, ry: 220, fill: C.ice }]]);
    [['M180 250 L260 280 L300 260', 0], ['M700 180 L760 220 L820 210', 0], ['M620 430 L700 410 L760 450', 0], ['M240 400 L300 380', 0]].forEach(([d]) => el('path', { d, stroke: C.iceDk, 'stroke-width': 3, fill: 'none' }, T.bg));
  }
  function cabinBG(T) { // 오두막 안 와이드 (난로)
    if (bgImage(T, 'cabin')) return true;
    const { paper, el } = T;
    fill(T, '#8A6444');
    for (let i = 0; i < 10; i++) el('rect', { x: -300, y: i * 48, width: 1600, height: 4, fill: '#6E4E32', opacity: .6 }, T.bg);
    paper(T.bg, [['rect', { x: 60, y: 90, width: 190, height: 160, fill: C.indigo }], ['rect', { x: 146, y: 90, width: 18, height: 160, fill: C.bark }], ['rect', { x: 60, y: 160, width: 190, height: 14, fill: C.bark }]]);
    [[90, 120], [210, 110], [120, 210], [220, 220], [180, 140]].forEach(([cx, cy]) => el('circle', { cx, cy, r: 5, fill: C.snow }, T.bg));
    paper(T.bg, [['rect', { x: -300, y: 470, width: 1600, height: 400, fill: '#5A3D29' }]]);
    // 난로
    paper(T.bg, [['rect', { x: 800, y: 120, width: 40, height: 220, fill: '#3A3430' }], ['rect', { x: 740, y: 320, width: 180, height: 170, rx: 14, fill: '#3A3430' }],
      ['rect', { x: 780, y: 380, width: 100, height: 70, rx: 8, fill: C.amber }], ['path', { d: 'M800 450 Q815 400 830 440 Q845 390 860 450 Z', fill: C.persimmon }]]);
    el('circle', { cx: 830, cy: 420, r: 150, fill: C.amber, opacity: .12 }, T.bg);
    paper(T.bg, [['ellipse', { cx: 470, cy: 510, rx: 250, ry: 40, fill: C.bean }], ['ellipse', { cx: 470, cy: 510, rx: 200, ry: 28, fill: '#C4574A' }]]);
  }
  function springBG(T) { // 봄 호수 와이드
    if (bgImage(T, 'spring')) return true;
    const { paper, el } = T;
    fill(T, '#D6EAF2');
    el('circle', { cx: 160, cy: 100, r: 46, fill: '#F6D98A' }, T.bg);
    paper(T.bg, [['path', { d: 'M-300 330 Q200 250 560 310 Q820 260 1300 320 V600 H-300 Z', fill: '#9DBE7E' }]]);
    paper(T.bg, [['rect', { x: 860, y: 190, width: 26, height: 150, fill: C.bark }], ['circle', { cx: 872, cy: 170, r: 80, fill: '#F2C4C4' }], ['circle', { cx: 820, cy: 210, r: 50, fill: '#F7D8D8' }]]);
    paper(T.bg, [['ellipse', { cx: 560, cy: 470, rx: 560, ry: 120, fill: C.water }], ['ellipse', { cx: 560, cy: 470, rx: 480, ry: 86, fill: '#80AECB' }]]);
    flowers(T, [[60, 380], [140, 420], [260, 370], [760, 380], [930, 400], [980, 360], [40, 520], [960, 540]]);
  }
  function flowers(T, list) {
    list.forEach(([x, y], i) => {
      const c = [C.pink, C.snow, C.yellow][i % 3];
      T.paper(T.bg, [['rect', { x: x - 2, y, width: 4, height: 20, fill: C.pine }], ...[0, 1, 2, 3, 4].map(k => ['circle', { cx: x + Math.cos(k * 1.256) * 8, cy: y + Math.sin(k * 1.256) * 8, r: 6, fill: c }]), ['circle', { cx: x, cy: y, r: 4, fill: C.gold }]]);
    });
  }
  function reflectBG(T) { // 호수 반사 하이앵글
    if (bgImage(T, 'reflect')) return true;
    const { paper, el } = T;
    fill(T, '#7FA9C6');
    paper(T.bg, [['path', { d: 'M-300 -200 H1300 V200 Q900 240 500 226 Q100 240 -300 200 Z', fill: '#9DBE7E' }]]);
    flowers(T, [[120, 150], [230, 120], [760, 140], [880, 110], [320, 170], [680, 170]]);
    for (let i = 0; i < 6; i++) el('ellipse', { cx: 150 + i * 150, cy: 470 + (i % 2) * 40, rx: 50, ry: 6, fill: '#B3D2E4', opacity: .5 }, T.bg);
  }

  /* ================= 화면 고정 카드 (카메라 영향 없음) ================= */
  /* 세로 화면은 무대 양옆이 잘린다 → 보이는 너비 안에 카드를 나란히 놓는다 */
  function visW() {
    const s = document.getElementById('stage'), w = document.getElementById('stageWrap');
    if (!/slice/.test(s.getAttribute('preserveAspectRatio') || '')) return 1000;
    return Math.min(1000, 560 * w.clientWidth / Math.max(1, w.clientHeight));
  }
  const narrow = () => visW() < 760; // 세로(좁은) 화면: 양옆이 잘린다
  function slots(n) {
    const vw = visW(), sp = Math.min(230, (vw - 24) / n), r = Math.min(84, sp * .45);
    return { xs: [...Array(n)].map((_, i) => 500 + (i - (n - 1) / 2) * sp), r };
  }
  function card(T, x, y, r, draw, label) {
    const g = T.el('g', { transform: `translate(${x},${y})` }, document.getElementById('stage'));
    T.paper(g, [['circle', { r, fill: C.cream, stroke: C.gold, 'stroke-width': Math.max(4, r * .09) }]]);
    const inner = T.el('g', { transform: `scale(${r / 84})` }, g);
    draw(inner);
    if (label) T.el('text', { y: r + Math.max(22, r * .34), 'text-anchor': 'middle', 'font-size': Math.max(22, r * .34), fill: C.bean, stroke: C.cream, 'stroke-width': 6, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: label }, g);
    g._x = x; g._y = y;
    return g;
  }
  /* 감정 카드: 그림 얼굴(머리만 동그랗게 오린 것)이 있으면 그것, 없으면 코드 얼굴 */
  const faceIcon = (mood, swan) => (T, g) => {
    const k = `face_${swan ? 'swan_' : ''}${mood}`;
    if (artUrl(k)) { pic(T, g, k, -72, -72, 144, 144, { shadow: false }); return; }
    faceIconGrey(mood, swan)(T, g);
  };
  const faceIconGrey = (mood, swan) => (T, g) => { T.paper(g, [['circle', { cy: 2, r: 56, fill: swan ? C.snow : C.grey }], ...(swan ? [] : [['path', { d: 'M-8 -52 Q-4 -70 4 -54 Q10 -72 14 -50 Z', fill: C.greyDk }]])]); moodFace(T, g, 0, 0, 2.05, mood); };
  const growthIcon = form => (T, g) => {
    const s = { egg: 1.15, baby: 1.05, young: .82, swan: .66 }[form];
    const inner = T.el('g', { transform: `translate(${form === 'swan' ? 12 : 4},${HERO_H[form] * s / 2}) scale(${s})` }, g);
    HERO[form](T, inner, form === 'swan' ? 'happy' : 'neutral');
  };
  const SEASON_ICON = {
    summer: (T, g) => { T.paper(g, [['rect', { x: -60, y: 20, width: 120, height: 34, rx: 10, fill: C.leaf }], ['circle', { cy: -12, r: 30, fill: '#F2B94A' }]]); for (let k = 0; k < 8; k++) T.el('rect', { x: -4, y: -62, width: 8, height: 14, rx: 4, fill: '#F2B94A', transform: `rotate(${k * 45} 0 -12)` }, g); },
    autumn: (T, g) => T.paper(g, [['path', { d: 'M0 -56 L14 -24 L46 -32 L30 -4 L52 14 L16 18 L10 46 L0 26 L-10 46 L-16 18 L-52 14 L-30 -4 L-46 -32 L-14 -24 Z', fill: C.persimmon }], ['rect', { x: -3, y: 20, width: 6, height: 36, fill: C.bark }]]),
    winter: (T, g) => { for (let k = 0; k < 3; k++) T.el('rect', { x: -5, y: -52, width: 10, height: 104, rx: 5, fill: '#8FB8D0', transform: `rotate(${k * 60})` }, g); T.paper(g, [['circle', { r: 14, fill: C.snow, stroke: '#8FB8D0', 'stroke-width': 5 }]]); },
    spring: (T, g) => { T.paper(g, [['rect', { x: -3, y: 6, width: 6, height: 50, fill: C.pine }], ['ellipse', { cx: 18, cy: 34, rx: 16, ry: 7, fill: C.leaf }], ...[0, 1, 2, 3, 4].map(k => ['circle', { cx: Math.cos(k * 1.256 - 1.57) * 24, cy: -14 + Math.sin(k * 1.256 - 1.57) * 24, r: 18, fill: C.pink }]), ['circle', { cy: -14, r: 12, fill: C.gold }]]); },
  };
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  /* ================= 소리 ================= */
  const quack = (T, v = .7) => AudioFX.animal('duck', v) || (T.tone([420, 300], .16, { type: 'square', vol: .09 }), T.tone([400, 290], .16, { type: 'square', vol: .09, when: .22 }));
  const peep = (T, f = 1500) => { T.tone([f, f * 1.25], .09, { type: 'sine', vol: .12 }); T.tone([f * 1.05, f * 1.3], .09, { type: 'sine', vol: .12, when: .13 }); };
  const honk = T => { T.tone([330, 280], .22, { type: 'sawtooth', vol: .06 }); T.tone([340, 290], .22, { type: 'sawtooth', vol: .06, when: .28 }); };
  const cluck = T => [0, .14, .28].forEach(w => T.tone([700, 520], .08, { type: 'square', vol: .06, when: w }));
  const crow = T => AudioFX.animal('rooster', .5) || cluck(T);
  const meow = T => AudioFX.animal('cat', .7) || T.tone([700, 900], .5, { type: 'sine', vol: .14 });
  const purr = T => { for (let i = 0; i < 9; i++) T.tone([95, 80], .08, { type: 'sawtooth', vol: .05, when: i * .09 }); };
  const giggle = T => [0, .12, .24, .36].forEach((w, i) => T.tone([620 - i * 40, 520 - i * 40], .1, { type: 'triangle', vol: .12, when: w }));
  const crack = T => AudioFX.sfx('poke', .6) || T.tone([1400, 700], .06, { type: 'square', vol: .1 });
  /* 백조 소리: 녹음이 없으면 부드러운 나팔 소리를 만든다 */
  const swanCall = T => AudioFX.animal('swan', .7) || [0, .5].forEach(w => {
    T.tone([466, 415], .45, { type: 'triangle', vol: .13, when: w });
    T.tone([233, 208], .45, { type: 'sine', vol: .07, when: w });
    T.tone([932, 830], .4, { type: 'sine', vol: .03, when: w + .02 });
  });

  /* 손 (쓰다듬기) */
  const HAND_D = 'M22 30 V10 a5 5 0 0 1 10 0 V28 M32 26 a5 5 0 0 1 10 0 V30 M42 28 a5 5 0 0 1 10 0 V40 C52 52 44 60 34 60 C24 60 18 54 14 46 L8 36 a5 5 0 0 1 8 -5 L22 38 Z';

  /* ================= 이야기 ================= */
  async function run(T) {
    const { el, sleep, say, camTo, camWide, camSnap, josa } = T;
    /* 그림 미리 불러오기: 배우와 첫 배경을 기다리고(최대 4초) 나머지는 뒤에서. 못 불러온 그림은 그레이박스로 */
    const loads = {};
    Object.keys(BG).filter(k => BG[k]).forEach(k => { loads['bg_' + k] = T.preload(AS + BG[k]).then(ok => { bgOK[k] = ok; }); });
    Object.keys(ART).filter(k => ART[k]).forEach(k => { loads[k] = T.preload(AS + ART[k]).then(ok => { artOK[k] = ok; }); });
    await Promise.race([Promise.all([loads.bg_nest, ...Object.keys(SPR).map(k => loads[k])].filter(Boolean)), sleep(4000)]);
    /* 그림 컷: 컷 틀(400×300)에 그림을 깐다. 그림이 없으면 draw(임시 그림) */
    const cutPic = (key, draw) => svg => { const u = artUrl(key); if (u) el('image', { href: u, x: 0, y: 0, width: 400, height: 300, preserveAspectRatio: 'xMidYMid slice' }, svg); else if (draw) draw(svg); };
    /* 물 앞 띠: 그림 배경이면 같은 그림의 아래쪽을 배우 앞에(frontCut), 아니면 코드 물 띠 */
    const water = (key, artY, y, color, op, artOp = .92) => frontCut(T, key, artY, artOp) || waterFront(T, y, color, op);
    const hero = makeHero(T);
    const put = (a, x, y, s = a.scale, dir = 'left') => { T.world.appendChild(a.pos); a.setScale(s); a.face(dir); a.place(x, y); };
    let snowT = null;

    /* 대사 연출: 목소리 주인에게 카메라가 가고, 말하는 쪽과 듣는 쪽이 서로 마주 본다.
       동물들은 장면마다 새로 만들어지므로 함수로 (아직 없거나 무대에 없으면 건너뜀) */
    const ref = f => () => { try { return f(); } catch (e) { return null; } };
    const onStage = (...fs) => fs.map(f => ref(f)()).find(a => a && a.pos.isConnected) || null;
    const vo = k => typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k] && setTimeout(() => AudioFX.voice(VOICE_LINES[k]), 380);
    const momNow = () => onStage(() => far._ducks[0], () => mom); // 마지막 장면: 멀리서 손 흔드는 엄마 오리
    T.director({
      cast: {
        hero, mom: momNow,
        rooster: ref(() => rooster), ducks: ref(() => ducks[0]), geese: ref(() => geese[1]), farmer: ref(() => farmer),
        cat: ref(() => cat), hen: ref(() => henIn), swan: ref(() => swans[0]),
      },
      listener: (r, last) => {
        if (r === 'hero') return last && last !== 'hero' && last !== 'card' ? last : null;
        if (r !== 'mom') return 'hero';
        if (last === 'rooster' || last === 'ducks') return last; // 엄마 오리가 놀린 친구들에게 한마디
        const m = momNow(); // 둥지 위·먼 언덕처럼 위아래로 멀면 둘을 한 화면에 못 잡으니 엄마만
        return m && Math.abs(m.y - hero.y) > 120 ? null : 'hero';
      },
    });

    /* 감정 골라요: 주인공 얼굴을 크게 보여주고, 아래에 얼굴 카드 */
    async function askMood(answer, moods, q) {
      /* 주인공 얼굴을 위에 크게 비춰 주고(거울), 아래에 얼굴 카드 */
      const swan = hero.form === 'swan', mood = hero.mood;
      const mirror = card(T, 500, 205, 88, g => faceIcon(mood, swan)(T, g));
      mirror.style.pointerEvents = 'none';
      await T.anim(mirror, [{ opacity: 0, translate: '0 -30px' }, { opacity: 1, translate: '0 0' }], 400);
      const sl = slots(moods.length), order = shuffle(moods);
      const cards = order.map((m, i) => ({ m, g: card(T, sl.xs[i], 425, Math.min(sl.r, 66), g => faceIcon(m, swan)(T, g), MOOD_LABEL[m]) }));
      await say(q);
      const pick = await T.choose(cards.map(c => ({ el: c.g, ok: c.m === answer, onWrong: async () => {
        await T.anim(c.g, [{ translate: '0 0' }, { translate: '-10px 0' }, { translate: '10px 0' }, { translate: '0 0' }], 400);
      } })), { prompt: q, where: swan ? '백조 얼굴을 잘 봐요. 눈썹이랑 입이 어떻게 생겼지?' : '아기 오리 얼굴을 잘 봐요. 눈썹이랑 입이 어떻게 생겼지?', who: `${josa(MOOD_FACE[answer], '이에요/예요')}! 반짝이는 얼굴을 눌러 봐요.` });
      await T.anim(pick.el, [{ translate: '0 0' }, { translate: '0 -24px' }, { translate: '0 0' }], 420);
      cards.forEach(c => c.g.remove()); mirror.remove();
    }
    /* 차례대로 톡: 틀리면 "나는 다음이야~" 하고 다음 차례가 반짝인다 */
    async function orderGame(items, qFirst, qNext, doneLine) {
      const sl = slots(items.length), r = Math.min(sl.r, 74);
      let pos; do { pos = shuffle(items.map((_, i) => i)); } while (pos.every((p, i) => p === i));
      const cards = items.map((it, i) => ({ ...it, g: card(T, sl.xs[pos[i]], 330, r, g => it.icon(T, g), it.label) }));
      const done = [];
      for (let k = 0; k < cards.length; k++) {
        const good = cards[k];
        const q = k === 0 ? qFirst : qNext(cards[k - 1]);
        await say(q);
        const left = cards.filter(c => !done.includes(c));
        await T.choose(left.map(c => ({ el: c.g, ok: c === good, onWrong: async () => {
          await T.anim(c.g, [{ translate: '0 0' }, { translate: '0 -22px' }, { translate: '0 0' }], 380);
          await say(`"나는 다음이야~"`);
          good.g.style.filter = 'url(#hintGlow)';
          good.g.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
        } })), { prompt: q, who: `${josa(good.label, '이에요/예요')}! 반짝이는 카드를 눌러 봐요.` });
        done.push(good);
        good.g.style.filter = '';
        const tx = sl.xs[k], ty = 478;
        good.g.removeAttribute('transform');
        await T.anim(good.g, [{ transform: `translate(${good.g._x}px,${good.g._y}px) scale(1)` }, { transform: `translate(${tx}px,${ty}px) scale(.55)` }], { duration: 480, easing: 'cubic-bezier(.3,1.4,.5,1)' });
        T.tone(440 + k * 110, .25, { type: 'triangle', vol: .16 });
        const tag = T.paper(good.g, [['circle', { cx: r * .8, cy: -r * .8, r: 24, fill: C.persimmon, stroke: C.cream, 'stroke-width': 4 }]]);
        el('text', { x: r * .8, y: -r * .8 + 10, 'text-anchor': 'middle', 'font-size': 30, fill: C.cream, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: k + 1 }, tag);
      }
      await say(doneLine);
      await sleep(400);
      cards.forEach(c => c.g.remove());
    }

    /* ============ 1막 ============ */
    /* --- 1. 알 깨기 (둥지 하이앵글, 여름) --- */
    const artNest = nestBG(T); // 그림: 1.7배 당긴 둥지 (가운데 490,330 · 안쪽 오목한 곳 400~580 × 280~365)
    const mom = artNest ? (narrow() ? cast(T, 'mom', 652, 334, 1.75) : cast(T, 'mom', 712, 332, 1.95)) : cast(T, 'mom', 760, 250, 1.6); // 세로: 화면 안에 엄마가 보이게 둥지 쪽으로
    const SMALL = artNest ? [[398, 328], [446, 286], [538, 286], [590, 330]] : [[400, 300], [480, 250], [572, 262], [420, 400]];
    const eggs = SMALL.map(([x, y]) => {
      const g = el('g', { transform: `translate(${x},${y})` }, T.world);
      if (!sprite(T, g, 'egg', 62 / 92 * .97)) { // 그림: 큰 알과 같은 그림을 작게 (가운데 맞춤 위해 아래로 31)
        T.paper(g, [['ellipse', { rx: 24, ry: 31, fill: '#EFE6D2' }]]);
        el('circle', { cx: -6, cy: -10, r: 3, fill: '#C8BFA8' }, g);
      } else g.lastChild.setAttribute('transform', 'translate(0,31)');
      el('circle', { r: 46, fill: '#fff', opacity: 0 }, g);
      return { g, x, y };
    });
    if (artNest) put(hero, 492, 432, 1.25); else put(hero, 570, 470, 1.25);
    hero.setForm('egg');
    const sibs = [];
    await T.curtain(true);
    await say('따뜻한 여름날, 엄마 오리가 둥지에서 알을 품고 있었어요.');
    await say('알을 톡 눌러서 아기 오리를 깨워 줄까요?');
    for (const e of eggs) {
      await T.tap(e.g, { prompt: '알을 톡 눌러 봐요!' });
      crack(T);
      e.g.remove();
      T.paper(T.world, [['path', { d: `M${e.x - 26} ${e.y + 20} Q${e.x - 24} ${e.y + 34} ${e.x - 6} ${e.y + 34} L${e.x - 10} ${e.y + 20} Z`, fill: '#EFE6D2' }],
        ['path', { d: `M${e.x + 26} ${e.y + 20} Q${e.x + 24} ${e.y + 34} ${e.x + 6} ${e.y + 34} L${e.x + 10} ${e.y + 20} Z`, fill: '#EFE6D2' }]]);
      const d = cast(T, 'duckling', e.x, e.y + 30, 1.2);
      T.world.appendChild(hero.pos);
      sibs.push(d);
      peep(T, 1400 + sibs.length * 80); d.hop(34);
      T.pop(e.x, e.y - 60, '삐약!', C.gold);
      await sleep(350);
    }
    await say('노란 아기 오리 넷이 나왔어요. 삐약삐약!');
    await say('어? 제일 큰 알은 아직이에요. 톡톡톡 두드려 볼까요?');
    const CR = ['M-10 -60 L-2 -52 L-8 -44', 'M-8 -44 L4 -38 L0 -30', 'M-2 -52 L12 -56 L20 -48', 'M20 -48 L30 -52', 'M-10 -60 L-24 -56 L-32 -62', 'M0 -30 L14 -26 L26 -30'];
    await T.mash(hero.pos, { count: 6, prompt: '큰 알을 톡톡 눌러 봐요!', onStep: i => {
      crack(T);
      el('path', { d: CR[i - 1], stroke: C.bark, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, hero.parts.crack);
      hero.wiggle(8, 300);
      if (i % 2 === 0) T.pop(hero.x + 80, hero.y - 150, '쩍!', C.bark);
    } });
    await sleep(300);
    hero.setForm('baby'); hero.setScale(hero.art ? 1.4 : 1.1); // 그림: 노란 형제(1.2배 키 84)보다 확실히 크게
    const [hx0, hy0] = hero.headPt();
    const hat = T.paper(T.fx, [['path', { d: 'M-30 0 Q-28 -34 0 -36 Q28 -34 30 0 L20 -6 L10 2 L0 -8 L-10 2 L-20 -6 Z', fill: '#E9E2D0' }]]);
    const hatY = hy0 - (hero.art ? 34 : 20); // 그림 머리는 위로 조금 더 둥글다
    hat.setAttribute('transform', `translate(${hx0},${hatY})`);
    if (artUrl('cut_hatch')) await T.cut(cutPic('cut_hatch'), { hold: 1600, sfx: 'pop' }); // 그림 컷: 알껍데기 모자를 쓰고 쩍! 나온 아기 오리
    else AudioFX.sfx('pop') || AudioFX.pop();
    quack(T); await hero.hop(26);
    T.pop(hero.x + 90, hero.y - 150, '꽥?', C.bark);
    await say('크고 회색인 아기 오리가 나왔어요! 머리에 알껍데기 모자를 썼네요.');
    await T.anim(hat, [{ transform: `translate(${hx0}px,${hatY}px) rotate(0deg)` }, { transform: `translate(${hx0 + 50}px,${hatY - 30}px) rotate(40deg)` }, { transform: `translate(${hx0 + 90}px,${hero.y}px) rotate(160deg)` }], { duration: 700, easing: 'ease-in' });
    AudioFX.sfx('bonk', .4) || AudioFX.bonk(); giggle(T);
    sibs.forEach((d, k) => setTimeout(() => { peep(T, 1500 + k * 60); d.hop(20, 300); }, k * 90));
    await say('톡! 모자가 떨어졌어요.');
    quack(T); mom.hop(16);
    await say('엄마 오리가 말했어요. "어머, 이 아기는 크고 회색이구나. 그래도 괜찮아. 모두 내 아기란다!"');

    /* --- 2. 헤엄 줄 (연못 옆 모습) --- */
    const LINE = [0, 1, 2, 3].map(k => 300 - k * 80);
    await T.sceneCard('연못', () => {
      T.clear();
      const art = pondSideBG(T), wy = art ? 46 : 0; // 그림: 물 띠가 265~395 → 물 위로 올리고, 앞 둑(397 아래)이 몸 아래를 가린다
      put(mom, 390, 456 - wy, 1.8, 'right'); // 오른쪽으로 헤엄쳐 가니 모두 오른쪽을 본다 (뒷걸음 X)
      sibs.forEach((d, k) => put(d, LINE[k], 452 - wy, 1.3, 'right'));
      put(hero, -40, 454 - wy, 1.15, 'right');
      water('pond', 397, 441, C.water, .92, 1);
      if (narrow()) camSnap(250, 280, 1); // 세로: 줄 선 오리들 쪽을 비춘다
    }, hero.pos);
    await say('엄마 오리가 아기들을 데리고 연못에 갔어요. 줄을 서서 헤엄쳐요.');
    await say('화면을 옆으로 쓱 밀어서 헤엄쳐 볼까요?');
    const swimmers = [mom, ...sibs, hero];
    await T.swipe(T.root.querySelector('#stageWrap'), { dir: 'right', count: 3, prompt: '옆으로 쓱 밀어서 헤엄쳐요!', onStep: i => {
      AudioFX.sfx('splash', .35) || AudioFX.splash();
      swimmers.forEach((a, k) => setTimeout(() => {
        if (a === hero && narrow()) camTo(a.x + 150 + 130, 280, 1, 650); // 세로: 맨 끝 회색 오리를 카메라가 따라간다
        a.move(a.x + 150, a.y, 650); if (a !== hero) a.hop(8, 400); }, k * 70));
      if (i === 2) setTimeout(async () => {
        await T.anim(hero.inner, [{ transform: 'translateY(0)' }, { transform: 'translateY(60px)' }, { transform: 'translateY(60px)' }, { transform: 'translateY(0)' }], 900);
        T.pop(hero.x, hero.y - 130, '퐁!', C.indigo);
      }, 500);
    } });
    await sleep(900);
    await say('회색 아기 오리는 헤엄을 제일 잘해요! 쏙 들어갔다가 퐁!');
    await say('그런데 늘 줄 맨 끝에서 혼자 따라가요.');

    /* --- 3. 놀림 (감정 1 · 농장 마당 와이드) --- */
    let hen, rooster, ducks;
    await T.sceneCard('농장 마당', () => {
      T.clear(); yardBG(T);
      hen = cast(T, 'hen', 290, 500, 1.4); hen.face('right');
      rooster = cast(T, 'rooster', 395, 512, 1.5); rooster.face('right');
      ducks = [cast(T, 'mom', 650, 505, 1.5), cast(T, 'mom', 750, 515, 1.6)];
      put(hero, 525, 525, 1.35);
      put(mom, 960, 505, 1.85); // 엄마는 놀린 오리들(1.5)보다 확실히 크게 — 같은 흰 오리라 헷갈리지 않게
      camSnap(narrow() ? 420 : 500, 280, 1); // 세로: 먼저 닭 쪽
    }, hero.pos);
    await say('농장 마당에 닭이랑 오리들이 모여 있어요.');
    crow(T); rooster.hop(20);
    T.pop(420, 250, '못생겼다!', C.bean);
    await say('수탉이 말했어요. "꼬꼬댁! 너는 못생겼어!"');
    if (narrow()) await camTo(600, 280, 1, 600); // 세로: 말하는 오리들 쪽으로
    quack(T); ducks.forEach(d => d.hop(14));
    await say('오리들도 말했어요. "꽥꽥! 너는 우리랑 달라!"');
    hero.setMood('sad'); hero.pose('translateY(4px) scale(1,.96)');
    await askMood('sad', ['happy', 'sad', 'angry'], '아기 오리 마음은 어떨까요?');
    await say('맞아요. 아기 오리는 슬퍼요. 눈물이 똑 떨어졌어요.');
    await say('아기 오리를 톡 눌러서 쓰다듬어 줄까요? "괜찮아."');
    await T.tap(hero.pos, { prompt: '아기 오리를 톡! 쓰다듬어 줘요.' });
    {
      const [hx, hy] = hero.headPt();
      const hand = el('g', {}, T.fx);
      el('path', { d: HAND_D, fill: C.cream, stroke: C.bark, 'stroke-width': 3, 'stroke-linejoin': 'round', transform: 'scale(1.6) rotate(200 32 32)' }, hand);
      const frames = []; for (let k = 0; k < 4; k++) frames.push({ transform: `translate(${hx + 60}px,${hy - 110}px)` }, { transform: `translate(${hx + 40}px,${hy - 70}px)` });
      frames.push({ transform: `translate(${hx + 60}px,${hy - 110}px)` });
      T.tone([523, 659], .3, { type: 'sine', vol: .12 }); T.tone([659, 784], .3, { type: 'sine', vol: .12, when: .4 });
      await T.anim(hand, frames, 1800);
      hand.remove();
    }
    hero.setMood('neutral'); hero.pose('');
    T.pop(hero.x, hero.y - 190, '괜찮아', C.pine);
    await say('"괜찮아. 너는 너라서 멋져."');
    quack(T); ducks.forEach((d, k) => { d.face('right'); d.move(d.x + 130, d.y, 600).then(() => d.face('left')); }); await mom.move(655, 508, 800); // 오리들은 돌아서 비켜 갔다가 다시 아기 오리 쪽을 본다
    await say('엄마 오리도 말했어요. "우리 아기는 헤엄을 제일 잘한단다!"');
    if (narrow()) await camTo(470, 280, 1, 600); // 세로: 머쓱한 수탉 쪽으로
    rooster.wiggle(6); hen.wiggle(6);
    await say('수탉과 오리들이 머쓱해서 말했어요. "놀려서 미안해."');

    /* --- 4. 떠나기 (갈대숲 눈높이) --- */
    await say('그래도 아기 오리는 마음이 쓸쓸했어요. 넓은 세상을 보러 길을 떠났어요.');
    let bgReeds, fgReeds;
    await T.sceneCard('갈대숲', () => {
      T.clear(); bgReeds = reedEyeBG(T); camSnap(500, 280, 1);
      put(hero, 380, 540, 1.7, 'right');
      const list = []; for (let i = 0; i < 14; i++) list.push([60 + i * 130 + (i % 2) * 30, 562]);
      if (artUrl('reed')) { // 그림: 갈대 한 줄기를 키·방향만 바꿔 늘어놓는다 (띠 그림 아님)
        fgReeds = el('g', {}, T.world);
        list.forEach(([x, y], i) => { const g = el('g', { transform: `translate(${x},${y}) scale(${i % 2 ? -1 : 1},1)` }, fgReeds); sprite(T, g, 'reed', .85 + (i % 3) * .1); });
      } else fgReeds = reeds(T, T.world, list, 460, C.reedDk);
    }, hero.pos);
    await say('갈대가 아기 오리 머리보다 훨씬 높아요.');
    await say('옆으로 쓱 밀어서 갈대를 헤치고 가 볼까요?');
    let off = 0;
    await T.swipe(T.root.querySelector('#stageWrap'), { dir: 'right', count: 3, prompt: '옆으로 쓱! 갈대를 헤치고 가요.', onStep: () => {
      off += 1;
      AudioFX.sfx('step_grass', .5) || AudioFX.swish();
      T.anim(fgReeds, [{ transform: `translateX(${-(off - 1) * 260}px)` }, { transform: `translateX(${-off * 260}px)` }], { duration: 700, easing: 'ease-out' });
      const bd = bgReeds.tagName === 'image' ? 40 : 90; // 그림 배경은 당겨 둔 여유(양옆 200)만큼만
      T.anim(bgReeds, [{ transform: `translateX(${-(off - 1) * bd}px)` }, { transform: `translateX(${-off * bd}px)` }], { duration: 700, easing: 'ease-out' });
      hero.hop(18, 350);
    } });
    await sleep(700);
    await say('뒤뚱뒤뚱, 갈대숲을 지나 넓은 늪에 닿았어요.');

    /* --- 5. 기러기 친구 (감정 2 · 늪 와이드) --- */
    let geese;
    await T.sceneCard('늪', () => {
      T.clear(); swampBG(T);
      const nw = narrow(); // 세로: 기러기 셋과 아기 오리가 한 화면에
      put(hero, nw ? 372 : 380, 476, 1.45);  hero.face('right');
      geese = (nw ? [[552, 470], [632, 484], [708, 474]] : [[580, 470], [690, 484], [800, 474]]).map(([x, y], k) => cast(T, 'goose', x, y, [1.3, 1.35, 1.25][k]));
      camSnap(nw ? 530 : 500, 280, 1);
      water('swamp', 446, 446, '#6A8FA4');
    }, hero.pos);
    honk(T); geese.forEach((g, k) => setTimeout(() => g.hop(16), k * 120));
    await say('늪에는 기러기들이 살고 있었어요.');
    await say('기러기들이 말했어요. "안녕! 우리랑 같이 놀자!"');
    hero.setMood('happy'); hero.hop(24);
    await askMood('happy', ['happy', 'sad', 'scared'], '아기 오리 마음은 지금 어떨까요?');
    await say('맞아요! 친구가 생겨서 기뻐요.');
    [hero, ...geese].forEach((a, k) => setTimeout(() => { a.hop(20, 380); k ? honk(T) : quack(T); }, k * 150));
    await sleep(800);

    /* --- 6. 쾅! (감정 3 · 늪 하이앵글) --- */
    let bush;
    await T.sceneCard('늪 한가운데', () => {
      T.clear(); const art = swampHighBG(T); camSnap(500, 280, 1);
      // 그림: 늪 한가운데 작은 풀섬(430~640 × 270~310) 위에 아기 오리, 양옆에 갈대 덤불 그림
      if (art) put(hero, 525, 300, 1.6); else put(hero, 500, 410, 1.6);
      hero.face('left'); hero.setMood('neutral');
      geese.forEach((g, k) => { put(g, [300, 700, 640][k], art ? [330, 350, 500][k] : [300, 320, 500][k], 1.2, k === 0 ? 'right' : 'left'); if (art) wade(T, g, 'goose'); }); // 모두 아기 오리 쪽을 보고, 물 위에 떠 있다
      bush = el('g', {}, T.world);
      const clump = artUrl('reed_clump');
      (art ? [[-1, 398, 318], [1, 652, 318]] : [[-1, 400, 380], [1, 600, 380]]).forEach(([dir, x, y]) => {
        const leaf = el('g', {}, bush);
        if (clump) { const g = el('g', { transform: `translate(${x},${y}) scale(${dir < 0 ? 1 : -1},1)` }, leaf); sprite(T, g, 'reed_clump', .8); }
        else T.paper(leaf, [['path', { d: `M${x} ${y} Q${x + dir * 30} ${y - 150} ${x + dir * 10} ${y - 230} Q${x + dir * 60} ${y - 140} ${x + dir * 40} ${y} Z`, fill: C.reed }],
          ['path', { d: `M${x + dir * 20} ${y} Q${x + dir * 70} ${y - 120} ${x + dir * 60} ${y - 200} Q${x + dir * 100} ${y - 110} ${x + dir * 70} ${y} Z`, fill: C.reedDk }]]);
        leaf.style.transformBox = 'view-box'; leaf.style.transformOrigin = `${x}px ${y}px`; leaf.style.transition = 'transform .9s cubic-bezier(.3,1.3,.5,1)';
        leaf._dir = dir;
      });
      if (art) el('rect', { x: 340, y: 100, width: 370, height: 230, fill: '#fff', opacity: 0 }, bush);
      else el('rect', { x: 330, y: 150, width: 340, height: 250, fill: '#fff', opacity: 0 }, bush);
    }, hero.pos);
    await say('기러기들과 아기 오리는 신나게 놀았어요.');
    geese.forEach((g, k) => setTimeout(() => g.wiggle(8), k * 100));
    await sleep(600);
    AudioFX.sfx('boom', .5) || AudioFX.boom();
    await T.cut(svg => {
      el('rect', { width: 400, height: 300, fill: C.indigo }, svg);
      el('text', { x: 200, y: 180, 'text-anchor': 'middle', 'font-size': 110, fill: C.amber, stroke: '#fff', 'stroke-width': 8, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: '쾅!' }, svg);
    }, { hold: 1500 });
    honk(T);
    await say('저 멀리서 큰 소리가 났어요. 깜짝 놀란 기러기들이 모두 날아가 버렸어요.');
    geese.forEach(g => { if (g.ripple) g.ripple.remove(); }); // 날아오르면 물결은 그 자리에 남는다
    await Promise.all(geese.map((g, k) => g.move(g.x + (k - 1) * 200, -260, 1200 + k * 150, 'ease-in')));
    hero.setMood('scared'); hero.pose('scale(1.08,.84)');
    const tremble = hero.body.animate([{ translate: '0 0' }, { translate: '3px 0' }, { translate: '-3px 0' }], { duration: 140, iterations: Infinity });
    await askMood('scared', ['happy', 'scared', 'angry'], '혼자 남은 아기 오리 마음은 어떨까요?');
    await say('맞아요. 아기 오리는 무서워요. 갈대 속에 웅크렸어요.');
    await say('갈대를 톡 눌러서 아기 오리를 살포시 덮어 줄까요?');
    await T.tap(bush, { prompt: '갈대를 톡! 살포시 덮어 줘요.' });
    [...bush.children].forEach(l => { if (l._dir) l.style.transform = `rotate(${l._dir * -28}deg)`; });
    AudioFX.swish();
    tremble.cancel();
    hero.setMood('neutral');
    await sleep(700);
    await say('쉿, 이제 조용해요. 아기 오리는 갈대 속에서 포근하게 쉬었어요.');

    /* ============ 2막 ============ */
    /* --- 7. 가을 하늘 (가을 호수 로우앵글) --- */
    let flock;
    const leafFall = setInterval(() => {
      if (!document.getElementById('bgL').firstChild) return;
      const lf = T.paper(T.fx, [['ellipse', { rx: 9, ry: 5, fill: Math.random() < .5 ? C.persimmon : C.gold }]]);
      const x0 = Math.random() * 1000;
      lf.animate([{ transform: `translate(${x0}px,-20px) rotate(0deg)` }, { transform: `translate(${x0 - 80}px,560px) rotate(400deg)` }], { duration: 4200 }).finished.then(() => lf.remove());
    }, 700);
    await T.sceneCard('둘째 막 · 가을', () => {
      T.clear(); autumnLowBG(T);
      hero.setForm('young');
      put(hero, narrow() ? 440 : 400, 548, 1.45, 'right');
      hero.pose('rotate(-8deg)');
      flock = el('g', {}, T.world);
      [[0, 0], [70, 44], [-70, 44], [140, 88], [-140, 88]].forEach(([x, y]) => flyingSwan(T, flock, 560 + x, 110 + y, 1.15));
      el('rect', { x: 380, y: 50, width: 360, height: 180, fill: '#fff', opacity: 0 }, flock);
      flock.animate([{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 2400, iterations: Infinity });
    }, hero.pos);
    await say('어느덧 가을이 되었어요. 아기 오리는 조금 더 자라 어린 새가 되었어요.');
    await say('하늘 높이 하얀 새들이 줄지어 날아가요. 톡 눌러 볼까요?');
    await T.tap(flock, { prompt: '하늘의 하얀 새들을 톡!' });
    swanCall(T);
    T.pop(560, 250, '뿌우~', C.indigo);
    await sleep(600);
    await say('뿌우~ 나팔 같은 소리! 백조들이에요.');
    await T.anim(flock, [{ transform: 'translate(0px,0px)' }, { transform: 'translate(-900px,-60px)' }], { duration: 3200, easing: 'ease-in' });
    await say('아기 오리는 오래오래 하늘을 올려다보았어요. "나도 저렇게 날고 싶다."');
    clearInterval(leafFall); [...T.fx.children].forEach(n => n.remove());
    hero.pose('');

    /* --- 8. 얼음 (겨울 호수 하이앵글) --- */
    let icePatch, farmer, wy = 0;
    await T.sceneCard('겨울', () => {
      T.clear(); wy = winterHighBG(T) ? -100 : 0; // 그림: 언 호수가 165~300 → 얼음판과 아기 오리를 호수 위로
      icePatch = el('g', { transform: `translate(0,${wy})` }, T.world);
      T.paper(icePatch, [['ellipse', { cx: 470, cy: 372, rx: 110, ry: 40, fill: C.iceDk }], ['ellipse', { cx: 470, cy: 368, rx: 90, ry: 28, fill: '#E6F1F6' }]]);
      icePatch._cracks = el('g', {}, icePatch);
      el('rect', { x: 350, y: 320, width: 240, height: 100, fill: '#fff', opacity: 0 }, icePatch);
      put(hero, 470, 372 + wy, 1.35, 'left');
      hero.setMood('sad');
      farmer = cast(T, 'farmer', 1200, wy ? 345 : 400, 1.2);
    }, hero.pos);
    snowT = setInterval(() => {
      const f = el('circle', { r: 4 + Math.random() * 3, fill: '#fff', opacity: .9 }, T.fx);
      const x0 = Math.random() * 1000;
      f.animate([{ transform: `translate(${x0}px,-10px)` }, { transform: `translate(${x0 + 40}px,570px)` }], { duration: 5000 }).finished.then(() => f.remove());
    }, 260);
    const shiver = hero.body.animate([{ translate: '0 0' }, { translate: '2px 0' }, { translate: '-2px 0' }], { duration: 120, iterations: Infinity });
    await say('추운 겨울이 왔어요. 호수가 꽁꽁 얼어서 발이 얼음에 붙어 버렸어요.');
    await say('아기 오리를 꾹 눌러 봐요. 날개로 몸을 감싸서 따뜻하게!');
    let warmed = false;
    await T.hold(hero.pos, { ms: 2400, prompt: '아기 오리를 꾹 누르고 있어요.', onProgress: p => {
      hero.parts.wing.style.transform = `scale(${1 + p * .5},${1 + p * .9})`;
      shiver.playbackRate = Math.max(.15, 1 - p);
      if (p > .5 && !warmed) { warmed = true; T.pop(hero.x, hero.y - 220, '따뜻해', C.persimmon); T.tone([392, 523], .4, { type: 'sine', vol: .12 }); if (hero.art) hero.setMood('neutral'); } // 그림: 덜덜 자세 → 보통 자세
    } });
    shiver.cancel();
    hero.setMood('neutral'); hero.parts.wing.style.transform = 'scale(1.5,1.9)';
    await say('날개로 몸을 꼭 감쌌더니 조금 따뜻해졌어요.');
    AudioFX.sfx('step_grass', .5);
    await farmer.move(640, farmer.y, 1600);
    hero.face('right'); // 다가온 농부 할아버지를 본다
    await say('그때 농부 할아버지가 지나가다 아기 오리를 보았어요. "저런, 얼음에 발이 붙었구나!"');
    await say('얼음을 톡톡톡 눌러서 깨 줘요!');
    const ICR = ['M430 360 L450 380 L440 396', 'M500 350 L520 370 L540 364', 'M400 370 L380 386', 'M540 380 L560 396', 'M460 340 L470 356', 'M480 396 L500 406'];
    await T.mash(icePatch, { count: 6, prompt: '얼음을 톡톡 눌러요!', onStep: i => {
      AudioFX.sfx('chop', .6) || T.tone([900, 300], .1, { type: 'square', vol: .12 });
      farmer.parts.arm.style.transform = 'rotate(24deg)'; setTimeout(() => farmer.parts.arm.style.transform = '', 160);
      el('path', { d: ICR[i - 1], stroke: '#7FA6BC', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, icePatch._cracks);
      for (let k = 0; k < 3; k++) {
        const bit = T.paper(T.fx, [['path', { d: 'M0 -8 L9 0 L2 9 L-8 4 Z', fill: '#E6F1F6' }]]);
        const x0 = 420 + Math.random() * 100, dx = (Math.random() - .5) * 180;
        bit.animate([{ transform: `translate(${x0}px,${370 + wy}px)` }, { transform: `translate(${x0 + dx / 2}px,${300 + wy}px) rotate(90deg)` }, { transform: `translate(${x0 + dx}px,${390 + wy}px) rotate(200deg)`, opacity: 0 }], { duration: 700 }).finished.then(() => bit.remove());
      }
      if (i % 2 === 0) T.pop(i === 6 ? 470 : 360 + i * 30, 250 + wy * .6, '쩍!', '#4A7A96');
    } });
    icePatch.remove();
    quack(T); hero.hop(30);
    await say('쩍! 얼음이 깨졌어요. 발이 쏙 빠졌어요!');
    hero.parts.wing.style.transform = '';
    T.world.appendChild(hero.pos);
    const hugY = wy ? 268 : 300; // 그림 농부: 앞으로 뻗은 두 손(발끝에서 -80,-121) 높이에 안긴다
    hero.face('left'); hero.setScale(1); hero.move(wy ? 562 : 575, hugY, 600); // 안겨서 할아버지와 같은 쪽(가는 쪽)을 본다
    await say('농부 할아버지가 아기 오리를 품에 폭 안았어요. 따뜻한 집으로 가요!');
    // 농부는 왼쪽을 보고 서 있으니 보는 쪽(왼쪽)으로 걸어 나간다 (뒷걸음 X)
    await Promise.all([farmer.move(-260, farmer.y, 1900), hero.move((wy ? 562 : 575) - 900, hugY, 1900)]);
    clearInterval(snowT); snowT = null;

    /* --- 9. 할머니 집 (오두막 안 와이드) --- */
    let cat, henIn, grandma;
    await T.sceneCard('할머니 집', () => {
      T.clear(); [...T.fx.children].forEach(n => n.remove()); cabinBG(T);
      grandma = cast(T, 'grandma', narrow() ? 680 : 715, 505, 1.55);
      cat = cast(T, 'cat', 480, 520, 1.7); cat.face('left');
      henIn = cast(T, 'hen', 610, 490, 1.45); henIn.face('left');
      T.paper(T.world, [['path', { d: 'M545 516 L560 478 L670 478 L655 516 Z', fill: '#C39445' }], ['rect', { x: 556, y: 486, width: 104, height: 6, fill: C.bark }]]);
      put(hero, narrow() ? 385 : 355, 525, 1.25, 'right');
    }, hero.pos);
    await say('할머니 집은 난로가 있어 따뜻했어요. 고양이와 암탉도 함께 살았어요.');
    meow(T); cat.hop(14);
    await say('고양이가 말했어요. "야옹. 너, 가르릉 할 줄 아니?"');
    await say('아기 오리가 흉내를 내 보았어요.');
    const hugeHero = (svg, word, mood) => {
      el('rect', { width: 400, height: 300, fill: '#F2DFA8' }, svg);
      const g = el('g', { transform: `translate(${mood === 'wings' ? 170 : 140},286) scale(1.7)` }, svg); // 글자와 머리가 겹치지 않게 왼쪽으로
      HERO.young(T, g, mood);
      el('text', { x: 292, y: 70, 'text-anchor': 'middle', 'font-size': 50, fill: C.bean, stroke: '#fff', 'stroke-width': 8, 'paint-order': 'stroke', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: word }, svg);
    };
    vo('cut_purr') || purr(T); // 목소리 흉내가 있으면 합성음은 생략
    await T.cut(svg => hugeHero(svg, '가르릉…', 'neutral'), { hold: 1500 });
    vo('cut_quack') || quack(T);
    await T.cut(svg => hugeHero(svg, '꽥!', 'wings'), { hold: 1500, sfx: 'pop' }); // 그림: 날개 활짝 웃는 어린 새
    giggle(T);
    [cat, henIn, grandma].forEach((a, k) => setTimeout(() => a.hop(14, 320), k * 120));
    await say('가르릉이 아니라 꽥! 모두 깔깔 웃었어요. 아기 오리도 웃었어요.');
    cluck(T); henIn.hop(14);
    await say('암탉이 말했어요. "꼬꼬. 그럼 알은 낳을 줄 아니?" 아기 오리는 고개를 저었어요.');
    await hero.wiggle(10);
    const q9 = '아기 오리가 잘하는 건 뭘까요?';
    await say(q9);
    {
      const sl = slots(3), r = Math.min(sl.r, 72);
      const opts = shuffle([
        { k: 'purr', label: '가르릉', ok: false, icon: (T, g) => { DRAW.cat(T, T.el('g', { transform: 'translate(10,40) scale(1.1)' }, g)); T.el('path', { d: 'M-50 -40 q10 -10 20 0 t20 0', stroke: C.bark, 'stroke-width': 4, fill: 'none' }, g); } },
        { k: 'egg', label: '알 낳기', ok: false, icon: (T, g) => { T.paper(g, [['ellipse', { cy: 34, rx: 52, ry: 14, fill: C.cattail }], ['ellipse', { cy: 30, rx: 44, ry: 10, fill: C.gold }]]); if (!sprite(T, T.el('g', { transform: 'translate(0,40)' }, g), 'egg', .95)) T.paper(g, [['ellipse', { cy: -4, rx: 30, ry: 38, fill: '#EFE6D2', stroke: C.bark, 'stroke-width': 3 }]]); } }, // 크림 카드 위 크림 알이 안 보여서: 점박이 알 그림 + 짚 둥지
        { k: 'swim', label: '헤엄', ok: true, icon: (T, g) => { HERO.baby(T, T.el('g', { transform: 'translate(4,24) scale(.8)' }, g), 'happy'); T.paper(g, [['path', { d: 'M-66 20 Q-50 8 -34 20 Q-18 8 -2 20 Q14 8 30 20 Q46 8 62 20 V60 H-66 Z', fill: C.water }]]); } },
      ]);
      const cards = opts.map((o, i) => ({ ...o, g: card(T, sl.xs[i], narrow() ? 190 : 158, r, g => o.icon(T, g), o.label) }));
      const pick = await T.choose(cards.map(c => ({ el: c.g, ok: c.ok, onWrong: async () => {
        await T.anim(c.g, [{ translate: '0 0' }, { translate: '-10px 0' }, { translate: '10px 0' }, { translate: '0 0' }], 360);
        if (c.k === 'purr') { cat.hop(14); await say('고양이: "가르릉은 내가 잘하지~"'); } // 목소리와 겹치던 합성음은 뺐다
        else { henIn.hop(14); await say('암탉: "알 낳기는 내가 잘하지~"'); }
      } })), { prompt: q9, where: '연못에서 쏙 들어갔다가 퐁! 기억나요?', who: '헤엄이에요! 반짝이는 카드를 눌러 봐요.' });
      await T.anim(pick.el, [{ translate: '0 0' }, { translate: '0 -24px' }, { translate: '0 0' }], 420);
      cards.forEach(c => c.g.remove());
    }
    quack(T); hero.hop(24);
    await say('맞아요! 아기 오리는 헤엄을 제일 잘해요.');
    meow(T);
    await say('고양이와 암탉이 고개를 끄덕였어요. "그렇구나! 모두 잘하는 게 다르구나."');

    /* --- 10. 봄 날개 (봄 호수 와이드) --- */
    await T.sceneCard('봄', () => {
      T.clear();
      put(hero, 470, springBG(T) ? 548 : 470, 1.5, 'right'); // 그림: 호수 앞 풀밭에 선다. 오른쪽으로 날아갈 테니 오른쪽을 본다
      hero.setMood('happy');
    }, hero.pos);
    await say('따뜻한 봄이 왔어요. 아기 오리는 몸이 부쩍 자랐어요.');
    await say('아기 오리를 꾹 눌러서 날개를 활짝 펴 볼까요?');
    let spread = false;
    await T.hold(hero.pos, { ms: 2000, prompt: '꾹 누르고 있어요. 날개를 활짝!', onProgress: p => {
      if (p > .4 && !spread && hero.art) { spread = true; hero.setMood('wings'); AudioFX.swish(); } // 그림: 날개 활짝 그림으로
      hero.parts.wing.style.transform = `rotate(${-p * 55}deg) scale(${1 + p * .6})`;
      hero.parts.wingBack.style.transform = `rotate(${-p * 80}deg) scale(${1 + p * .6})`;
    } });
    T.pop(hero.x - 170, hero.y - 250, '활짝!', C.persimmon); // 머리를 가리지 않게 옆으로 T.tone([523, 784], .35, { type: 'triangle', vol: .14 });
    await say('와, 날개가 이렇게 커졌어요!');
    await say('한 번 더 꾹! 훨훨 날아 볼까요?');
    const y0 = hero.y;
    await T.hold(hero.pos, { ms: 2000, prompt: '한 번 더 꾹! 훨훨!', onProgress: p => { hero.place(hero.x, y0 - p * 120); } });
    const flap = [hero.parts.wing, hero.parts.wingBack].map((w, k) => { w.style.transition = ''; return w.animate([{ transform: `rotate(${-55 - k * 25}deg) scale(1.6)` }, { transform: `rotate(${15 + k * 10}deg) scale(1.6)` }, { transform: `rotate(${-55 - k * 25}deg) scale(1.6)` }], { duration: 420, iterations: Infinity }); });
    if (hero.art) flap.push(hero.body.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '0 -10px', rotate: '-4deg' }, { translate: '0 0', rotate: '0deg' }], { duration: 420, iterations: Infinity })); // 그림: 날갯짓 대신 몸이 살랑
    AudioFX.whoosh();
    T.pop(330, 140, '훨훨!', C.indigo);
    await hero.move(560, 330, 1400, 'ease-out');
    await say('훨훨! 아기 오리가 하늘을 날아요!');
    await hero.move(1250, 250, 1400, 'ease-in');
    flap.forEach(a => a.cancel());

    /* --- 11. 물에 비친 모습 (호수 반사 하이앵글, 메인) --- */
    let refl;
    await T.sceneCard('물에 비친 모습', () => {
      T.clear(); reflectBG(T);
      hero.setForm('swan'); hero.setMood('happy');
      refl = T.actor(T.world, 500, 264, g => HERO.swan(T, g, 'happy'), { scale: 1.1 });
      refl.pos.setAttribute('transform', 'translate(500,264) scale(1.1,-1.1)');
      refl.pos.style.opacity = .55;
      for (let i = 0; i < 4; i++) el('ellipse', { cx: 485 + (i % 2) * 30, cy: 302 + i * 40, rx: 70 - i * 6, ry: 2.2, fill: '#E4F1F7', opacity: .45 }, T.world); // 비친 모습 위 잔물결: 가늘고 옅게 (딱딱한 줄무늬 X)
      put(hero, 500, 250, 1.1, 'left');
      camSnap(500, 360, 1.7);
    });
    await say('아기 오리가 호숫가에 내려앉았어요. 물에 누가 비쳤을까요?');
    await say('길고 하얀 목, 커다란 하얀 날개…');
    await camWide(1400);
    swanCall(T); T.pop(640, 110, '백조!', C.indigo);
    await sleep(900); // 백조 울음이 끝나고 "어? 이게 나야?"
    await say('"어? 이게 나야?" 아기 오리는 하얀 백조였어요!');
    await orderGame([
      { label: '알', icon: growthIcon('egg') }, { label: '아기', icon: growthIcon('baby') },
      { label: '어린 새', icon: growthIcon('young') }, { label: '백조', icon: growthIcon('swan') },
    ], '어떻게 자랐는지 순서대로 톡! 맨 처음은 뭐였지?', prev => `${prev.label} 다음은 뭐였지?`, '알, 아기, 어린 새, 그리고 백조! 이렇게 자랐어요.');
    await say('이번에는 아기 오리가 지나온 계절이에요.');
    await orderGame([
      { label: '여름', icon: SEASON_ICON.summer }, { label: '가을', icon: SEASON_ICON.autumn },
      { label: '겨울', icon: SEASON_ICON.winter }, { label: '봄', icon: SEASON_ICON.spring },
    ], '알에서 나온 건 해님이 쨍쨍한 계절이었어요. 어느 카드일까요?', prev => ({ 여름: '그다음, 나뭇잎이 빨갛게 물든 계절은?', 가을: '그다음, 꽁꽁 얼음이 언 계절은?', 겨울: '마지막으로 꽃이 핀 계절은?' })[prev.label],
    '여름, 가을, 겨울, 봄! 계절이 한 바퀴 돌았어요.');

    /* --- 12. 백조 가족 (호수 와이드, 봄꽃) --- */
    let swans, far;
    await T.sceneCard('백조 가족', () => {
      T.clear(); const art = springBG(T), sy = art ? -32 : 0; // 그림: 호수(가운데 330~515)에 뜨게 조금 위로
      far = el('g', {}, T.world);
      const fm = cast(T, 'mom', 300, 300, .7, far); fm.face('right'); // 멀리서 백조들 쪽을 본다
      const fs = [0, 1, 2, 3].map(k => { const d = cast(T, 'duckling', 336 + k * 24, 302, .45, far); d.face('right'); return d; });
      far._ducks = [fm, ...fs];
      put(hero, 440, 472 + sy, 1, 'right');
      swans = [[585, 462 + sy], [685, 490 + sy], [785, 468 + sy]].map(([x, y]) => {
        let parts;
        const a = T.actor(T.world, x, y, g => { parts = HERO.swan(T, g, 'happy'); }, { scale: .9 });
        a.parts = parts; return a;
      });
      water('spring', 452 + sy, 452, '#80AECB', .8, 1); // 반투명이면 물 아래 몸이 비쳐 이음 줄이 보인다
    }, hero.pos);
    swanCall(T);
    await say('백조들이 헤엄쳐 왔어요. "안녕! 너도 우리 친구야. 같이 살자!"');
    await askMood('happy', ['happy', 'sad', 'scared', 'angry'], '지금 백조 마음은 어떨까요?');
    await say('맞아요! 백조는 정말 정말 기뻐요.');
    far._ducks.forEach((d, k) => setTimeout(() => { d.parts.wing && d.parts.wing.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-40deg)' }, { transform: 'rotate(0deg)' }], { duration: 500, iterations: 4 }); d.hop(10, 300); }, k * 100));
    quack(T, .4);
    await say('저 멀리 엄마 오리와 형제들도 반갑게 날개를 흔들어요. "잘 자랐구나!"');
    // 세로: 백조 넷이 한 화면에 다 들어오게 카메라를 살짝 물린다
    if (narrow()) await camTo(605, 280, Math.min(1, visW() / 610), 700);
    await say('백조들을 톡톡 눌러서 함께 춤을 춰요!');
    const NOTES = [392, 440, 523, 587];
    await T.free([hero, ...swans].map((a, i) => ({ el: a.pos, onTap: () => {
      T.tone(NOTES[i], .35, { type: 'triangle', vol: .18 });
      a.hop(34, 420);
      a.body.animate([{ rotate: '0deg' }, { rotate: '-10deg' }, { rotate: '10deg' }, { rotate: '0deg' }], 500);
      if (Math.random() < .3) swanCall(T);
    } })), 15000);
    T.confetti(); AudioFX.sfx('bell', .5) || AudioFX.bell();
    await say('다르게 생겼던 아기 오리는 이렇게 멋진 백조로 자랐답니다.');
    return '달라도 괜찮아요. 모두 저마다 멋지게 자라요!';
  }

  Tale.mount({ title: '미운 아기 오리', subtitle: '나는 누구일까?', run: T => run(Tale.api) });
})();
