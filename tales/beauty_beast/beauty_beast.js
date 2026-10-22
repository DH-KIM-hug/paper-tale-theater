/* 미녀와 야수 — 보몽 판(1756) 원작 그대로. 기획: tales/beauty_beast/PLAN.md, 상세: SPEC.md
   톡 2번(2장 말 출발 · 11장 샘물), 배움 놀이 3개(4장 많고 적음 · 7장 위·아래·옆 · 8장 아침·낮·밤), 연타 없음, 줄거리 선택 없음, 입맞춤 없음.
   사람은 모두 머리 크기가 같다(HT). 야수만 머리 1.3배, 키 1.5배. 그림: assets/v3w/bb_*.webp (목록 tools/app/gen/jobs_beauty_beast.json)
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다.
   파일이 생기면 코드를 고치지 않아도 그림으로 바뀐다 (ASP 표만 실제 비율로 갱신).
   화려하게 다시 그리기(VISUAL_PLAN.md, 2026-10-22): 궁전 장면만 배경 v2 + 층 소품 bb_layer_*(누름 없음, 후처리 post_v2.py), 11장 끝 봄 정원 크로스페이드. 시골집은 그대로. */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 비율 (tales/beauty_beast/ASP.txt 에서 옮김) */
  const ASP = {
    belle_stand: 0.465, horse_stand: 1.0867, beast_stand: 0.71, beast_ring: 0.7133, father_stand: 0.4233, sisa_pout: 0.4567, sisb_pout: 0.4783,
    prince_stand: 0.5283, belle_broom: 0.53, belle_point: 0.5483, belle_resolve: 0.465, belle_sit: 0.475, belle_worry: 0.4967,
    belle_sleep: 1.4367, belle_run: 0.7233, belle_kneel: 0.695, belle_joy: 0.635, beast_sit: 0.7317, beast_lie: 1.6393,
    beast_lie_eyes: 1.6393, father_ride: 0.9717, father_eat: 0.4917, father_sleep: 0.78, father_shock: 0.47, father_rose: 0.4117,
    father_bed: 1.3167, father_well: 0.4833, sisa_plead: 0.46, sisa_gasp: 0.4717, sisa_joy: 0.5467, sisb_plead: 0.4767,
    sisb_gasp: 0.4783, sisb_joy: 0.5717, prop_rose: 0.6033, prop_rose_vase: 0.5733, prop_bush5: 1.1083, prop_bush2: 1.2167,
    prop_table_small: 1.055, prop_table_long: 1.415, card_morning: 0.9067, card_noon: 0.905, card_night: 0.905, prop_mirror: 0.8267,
    prop_ring: 0.8133, prop_dream: 1.1283, prop_spring: 1.4833, prop_glow: 0.9883, prop_hat: 1.4783,
    /* 화려하게 다시 그리기(VISUAL_PLAN.md, 2026-10-22): 궁전 장면 층 소품 (tools/app/gen/post_v2.py 로 오림) */
    layer_snow_fir_front: 0.575, layer_snow_bush: 1.8987, layer_chandelier: 0.845, layer_curtain: 0.42, layer_feast: 2.1951,
    layer_topiary_snow: 0.3983, layer_rosebush_front: 1.3633, layer_petal_rose: 1.0533,
  };
  /* 사람 그림 높이 (머리 크기를 벨 서기 200 과 맞춘 값. 야수는 머리 약 1.4배·키 1.15배 — 갈기가 커서 머리 1.3배를 지키면 벨보다 작아진다) */
  const HT = { beast_stand: 235, beast_ring: 235, beast_sit: 193, beast_lie: 141, beast_lie_eyes: 141,
    father_stand: 212, father_ride: 300, father_eat: 215, father_sleep: 192, father_shock: 205, father_rose: 212, father_bed: 130, father_well: 205,
    prince_stand: 212, sisa_pout: 210, sisa_plead: 210, sisa_gasp: 210, sisa_joy: 204, sisb_pout: 204, sisb_plead: 204, sisb_gasp: 204, sisb_joy: 200,
    belle_sit: 190, belle_sleep: 105, belle_kneel: 165, belle_run: 195, horse_stand: 230 };
  /* 그림이 보는 쪽 ('left' | 'right' | 'front') — 그림을 직접 보고 정함 */
  const NAT = { belle_point: 'right', belle_run: 'right', belle_kneel: 'right', belle_sleep: 'left', father_bed: 'left',
    beast_lie: 'left', beast_lie_eyes: 'left', beast_ring: 'left', father_ride: 'right', horse_stand: 'right' };
  const FL = 528;                    // 바닥(발끝 y)
  /* 사람 세계(시골집)는 그대로, 야수의 궁전 장면만 다층 v2 (VISUAL_PLAN) */
  const BGS = ['cottage', 'cottage_front', 'snow_forest_v2', 'dining_v2', 'garden_v2', 'garden_bloom_v2', 'room_v2'];
  const bgSrc = k => AS + 'bb_bg_' + k + '.webp', artSrc = k => AS + 'bb_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const hOf = f => HT[f] || 200;
  const artOK = {}, bgOK = {};       // 그림 파일이 실제로 있는지 (preload 결과)

  /* ================= 자리표시(그림이 없을 때) ================= */
  const WHO = { belle: '벨', beast: '야수', prince: '왕자', father: '아버지', sisa: '큰언니', sisb: '작은언니' };
  const POSE = { stand: '서기', broom: '빗자루', point: '가리킴', resolve: '결심', sit: '앉기', worry: '걱정', sleep: '잠', run: '달림', kneel: '무릎', joy: '기쁨',
    ring: '반지', lie: '누움', lie_eyes: '눈 뜸', ride: '말 탐', eat: '식사', shock: '놀람', rose: '장미', bed: '침대', well: '인사', pout: '뾰로통', plead: '조름', gasp: '놀람' };
  const PROPN = { horse_stand: '말', prop_rose: '장미', prop_rose_vase: '장미 꽃병', prop_bush5: '덤불(5송이)', prop_bush2: '덤불(2송이)', prop_table_small: '작은 탁자',
    prop_table_long: '긴 식탁', prop_mirror: '거울', prop_ring: '반지', prop_dream: '꿈', prop_spring: '샘', prop_glow: '빛', prop_hat: '모자',
    card_morning: '아침', card_noon: '낮', card_night: '밤' };
  const BODYC = { belle: '#E8703A', father: '#6B4A32', sisa: '#A93B32', sisb: '#3F6B4F', prince: '#1F2A56', beast: '#6B4A32' };
  const HAIRC = { belle: '#6B4A32', father: '#3a2a1c', sisa: '#2E241C', sisb: '#D9A94E', prince: '#2E241C', beast: '#4a3322' };
  const SKIN = '#F2D9B8', CREAM = '#F6ECD8', FONT = "'Pretendard Variable', Pretendard, sans-serif";

  /* box(0..w, 0..h) 안에 종이 조각 자리표시를 그린다. 그림 파일과 같은 크기라 나중에 그림이 그대로 대신한다 */
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
    const m = /^(belle|beast|prince|father|sisa|sisb)_(.+)$/.exec(f), nat = NAT[f] || 'front', dx = nat === 'left' ? -1 : nat === 'right' ? 1 : 0;
    if (m) {
      const [, who, pose] = m, body = BODYC[who], big = who === 'beast', lying = w / h > 1.4, name = WHO[who] + ' ' + (POSE[pose] || pose);
      if (pose === 'ride') {                                   // 말과 한 그림: 말 + 위에 앉은 아버지
        E(w * .5, h * .74, w * .46, h * .17, '#8a5a38'); [.2, .34, .66, .8].forEach(k => R(w * k - 6, h * .82, 12, h * .18, 4, '#6B4A32'));
        E(w * .9, h * .58, w * .09, h * .13, '#8a5a38');
        const r = h * .13; R(w * .36, h * .3, w * .2, h * .36, 10, body); C(w * .46, h * .2, r, SKIN); R(w * .34, h * .05, w * .24, h * .06, 3, '#3a2a1c');
        label(name, w * .5, h * .78, CREAM, 13); return g;
      }
      const r = big ? 44 : Math.min(h * .17, w * .5);
      if (lying) {                                             // 침대·눕기: 몸은 가로, 머리는 왼쪽
        if (pose === 'bed' || pose === 'sleep') R(w * .02, h * .55, w * .96, h * .45, 8, '#6B4A32');
        R(w * .2, h * .3, w * .76, h * .55, 14, big ? body : who === 'belle' ? '#F6ECD8' : body);
        C(r + 6, h * .5, r, big ? '#7a5638' : SKIN); C(r + 6 - r * .3, h * .46, r * .1, '#2E241C'); C(r + 6 + r * .3, h * .46, r * .1, '#2E241C');
        if (pose === 'lie_eyes') { C(r + 6 - r * .3, h * .46, r * .16, '#fff'); C(r + 6 + r * .3, h * .46, r * .16, '#fff'); C(r + 6 - r * .3, h * .46, r * .08, '#2E241C'); C(r + 6 + r * .3, h * .46, r * .08, '#2E241C'); }
        label(name, w * .58, h * .62, CREAM, 14); return g;
      }
      const sit = pose === 'sit' || pose === 'eat' || pose === 'sleep', bw = Math.min(w * .78, r * 2.5), by = 2 * r - 6, bh = h - by;
      if (sit) R(w * .1, h * .62, w * .8, h * .38, 8, '#8a5a38');          // 의자
      R(w / 2 - bw / 2, by, bw, bh, 16, body);
      if (who === 'belle') Pth(`M${w / 2 - r - 3} ${r + 2} Q${w / 2} ${-r * .6} ${w / 2 + r + 3} ${r + 2} Z`, HAIRC[who]);
      if (who === 'sisa') C(w / 2, 4, r * .4, HAIRC[who]);
      if (who === 'sisb') [-1, 1].forEach(s => C(w / 2 + s * r * .85, r * .6, r * .3, HAIRC[who]));
      if (big) { C(w / 2, r + 4, r + 4, '#7a5638'); [-1, 1].forEach(s => Pth(`M${w / 2 + s * r * .6} 8 L${w / 2 + s * r * 1.2} -8 L${w / 2 + s * r * 1.05} 24 Z`, '#4a3322')); }
      else C(w / 2, r + 4, r, SKIN);
      if (who === 'belle' || who === 'sisa' || who === 'sisb') Pth(`M${w / 2 - r} ${r + 2} Q${w / 2} ${-r * .25} ${w / 2 + r} ${r + 2} Q${w / 2} ${r * .55} ${w / 2 - r} ${r + 2}Z`, HAIRC[who]);
      if (who === 'father' && !/shock|eat|bed|sleep/.test(pose)) R(w / 2 - r * 1.1, 2, r * 2.2, r * .45, 4, '#3a2a1c');
      if (who === 'prince') [-1, 0, 1].forEach(s => R(w / 2 + s * r * .5 - 3, -2, 6, 10, 1, '#D9A94E'));
      [-1, 1].forEach(s => C(w / 2 + s * r * .36 + dx * r * .25, r + 2, Math.max(2.5, r * .1), '#2E241C'));
      if (pose === 'rose' || pose === 'ring') C(w / 2 + bw * .38, h * .55, pose === 'rose' ? 6 : 5, pose === 'rose' ? '#A93B32' : '#F2B366');
      if (pose === 'shock') E(w / 2, r + 14, r * .14, r * .18, '#2E241C');
      label(name, w / 2, by + bh * .45, CREAM, Math.max(11, Math.min(15, bw / 5.2)));
      return g;
    }
    const nm = PROPN[f] || f.replace('prop_', '');
    switch (f) {
      case 'horse_stand': E(w * .45, h * .55, w * .42, h * .22, '#8a5a38'); [.15, .3, .6, .75].forEach(k => R(w * k - 6, h * .65, 12, h * .35, 4, '#6B4A32')); E(w * .88, h * .3, w * .1, h * .17, '#8a5a38'); R(w * .3, h * .3, w * .22, h * .12, 5, '#D9A94E'); label(nm, w * .45, h * .6, CREAM, 15); break;
      case 'prop_rose': R(w / 2 - 2, h * .3, 4, h * .7, 1, '#3F6B4F'); C(w / 2, h * .22, w * .3, '#A93B32'); C(w / 2, h * .22, w * .13, '#C8524A'); break;
      case 'prop_rose_vase': Pth(`M${w * .25} ${h * .55} L${w * .75} ${h * .55} L${w * .65} ${h} L${w * .35} ${h}Z`, '#D9A94E'); R(w / 2 - 2, h * .15, 4, h * .42, 1, '#3F6B4F'); C(w / 2, h * .13, w * .22, '#A93B32'); C(w * .28, h * .3, w * .12, '#A93B32'); C(w * .72, h * .3, w * .12, '#A93B32'); break;
      case 'prop_bush5': case 'prop_bush2': {
        const n = f === 'prop_bush5' ? 5 : 2; E(w / 2, h * .62, w * .46, h * .36, '#3F6B4F'); E(w * .3, h * .7, w * .25, h * .24, '#4d7c5d');
        const pts = [[.3, .45], [.5, .3], [.7, .45], [.4, .65], [.62, .65]]; (n === 5 ? pts : [pts[0], pts[2]]).forEach(([a, b]) => C(w * a, h * b, Math.min(w, h) * .07, '#A93B32'));
        label(nm, w / 2, h * .93, '#2E241C', 14); break; }
      case 'prop_table_small': R(w * .05, h * .1, w * .9, h * .12, 4, '#8a5a38'); R(w * .12, h * .22, 10, h * .78, 2, '#6B4A32'); R(w * .88 - 10, h * .22, 10, h * .78, 2, '#6B4A32'); label(nm, w / 2, h * .17, CREAM, 11); break;
      case 'prop_table_long': R(w * .02, h * .45, w * .96, h * .15, 4, '#8a5a38'); R(w * .06, h * .6, 12, h * .4, 2, '#6B4A32'); R(w * .94 - 12, h * .6, 12, h * .4, 2, '#6B4A32'); R(w * .12, h * .3, w * .76, h * .15, 4, CREAM); C(w * .3, h * .22, 8, '#F2B366'); R(w * .3 - 2, h * .22, 4, h * .1, 1, CREAM); label(nm, w / 2, h * .56, CREAM, 14); break;
      case 'prop_mirror': R(w * .1, h * .02, w * .8, h * .8, w * .4, '#D9A94E'); E(w / 2, h * .42, w * .32, h * .34, '#dfe6ee'); R(w / 2 - 4, h * .82, 8, h * .18, 2, '#6B4A32'); label(nm, w / 2, h * .46, '#6B4A32', 14); break;
      case 'prop_ring': C(w / 2, h / 2, Math.min(w, h) * .38, 'none', { stroke: '#D9A94E', 'stroke-width': Math.max(4, w * .18) }); C(w / 2, h * .14, w * .13, '#A93B32'); break;
      case 'prop_dream': E(w / 2, h * .42, w * .46, h * .36, CREAM); C(w * .3, h * .86, 8, CREAM); C(w * .22, h * .96, 5, CREAM); label(nm, w / 2, h * .2, '#8a7a60', 14); break;
      case 'prop_spring': E(w / 2, h * .62, w * .48, h * .34, '#6B4A32'); E(w / 2, h * .6, w * .4, h * .26, '#BFD8EE'); label(nm, w / 2, h * .66, '#1F2A56', 14); break;
      case 'prop_glow': C(w / 2, h / 2, Math.min(w, h) * .5, '#F2B366', { opacity: .55 }); C(w / 2, h / 2, Math.min(w, h) * .3, '#F6ECD8', { opacity: .7 }); break;
      case 'prop_hat': E(w / 2, h * .8, w * .46, h * .14, '#3a2a1c'); R(w * .28, h * .2, w * .44, h * .6, 8, '#3a2a1c'); break;
      case 'card_morning': case 'card_noon': case 'card_night': {
        const sky = { card_morning: '#F2B366', card_noon: '#F6ECD8', card_night: '#1F2A56' }[f];
        R(0, 0, w, h, 10, '#6B4A32'); R(w * .08, h * .08, w * .84, h * .84, 6, sky);
        if (f === 'card_night') { C(w * .66, h * .34, w * .12, CREAM); C(w * .3, h * .3, 3, CREAM); C(w * .45, h * .2, 3, CREAM); } else C(w * .5, f === 'card_morning' ? h * .62 : h * .36, w * .15, f === 'card_morning' ? '#E8703A' : '#D9A94E');
        R(w * .08, h * .72, w * .84, h * .2, 4, f === 'card_night' ? '#1b3b2a' : '#3F6B4F');
        label(nm, w / 2, h * .98 - 6, CREAM, Math.max(12, w * .14)); break; }
      default: R(0, 0, w, h, Math.min(w, h) * .2, '#D9A94E'); label(nm, w / 2, h / 2, '#2E241C', 13);
    }
    return g;
  }
  /* 그림 한 장(있으면 그림, 없으면 자리표시): 위 왼쪽 (x,y), 크기 w×h */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: artSrc(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    const g = placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
    return g.parentNode;
  }

  /* 배경 자리표시: 종이 한 장 + 요소 2~3개 + 장면 이름표 */
  const BGPH = {
    cottage:       { sky: '#E9DCC0', gnd: '#C9A878', name: '시골 작은 집(안)', shapes: g => [['rect', { x: 120, y: 150, width: 120, height: 150, rx: 4, fill: '#3F6B4F' }], ['rect', { x: 780, y: 120, width: 140, height: 200, rx: 4, fill: '#D9A94E' }], ['rect', { x: 360, y: 250, width: 240, height: 70, rx: 6, fill: '#6B4A32' }]] },
    cottage_front: { sky: '#F6ECD8', gnd: '#D9A94E', name: '시골집 앞 길', shapes: g => [['rect', { x: 100, y: 190, width: 260, height: 190, fill: '#E9DCC0' }], ['path', { d: 'M80 190 L230 90 L380 190Z', fill: '#A93B32' }], ['path', { d: 'M820 400 L880 150 L940 400Z', fill: '#3F6B4F' }]] },
    snow_forest:   { sky: '#1F2A56', gnd: '#F4F6FA', name: '눈보라 숲(밤)', shapes: g => [['circle', { cx: 860, cy: 110, r: 46, fill: '#F2B366' }], ['path', { d: 'M180 420 L250 150 L320 420Z', fill: '#3F6B4F' }], ['path', { d: 'M520 420 L600 190 L680 420Z', fill: '#3F6B4F' }]] },
    dining:        { sky: '#2B3263', gnd: '#6B4A32', name: '궁전 식당(밤)', shapes: g => [['rect', { x: 760, y: 90, width: 120, height: 170, rx: 60, fill: '#1F2A56' }], ['circle', { cx: 860, cy: 110, r: 40, fill: '#F2B366', opacity: .6 }], ['rect', { x: 140, y: 140, width: 150, height: 130, rx: 4, fill: '#A93B32' }]] },
    garden:        { sky: '#F6ECD8', gnd: '#8fae85', name: '궁전 정원(낮, 왼쪽 문)', shapes: g => [['rect', { x: 20, y: 90, width: 150, height: 320, fill: '#D9A94E' }], ['rect', { x: 60, y: 260, width: 70, height: 150, rx: 35, fill: '#6B4A32' }], ['circle', { cx: 860, cy: 100, r: 44, fill: '#F2B366' }]] },
    room:          { sky: '#F6ECD8', gnd: '#C9A878', name: '벨의 방(오른쪽 문)', shapes: g => [['rect', { x: 780, y: 140, width: 120, height: 270, rx: 6, fill: '#A93B32' }], ['rect', { x: 130, y: 110, width: 200, height: 250, rx: 4, fill: '#6B4A32' }], ['rect', { x: 150, y: 140, width: 160, height: 40, fill: '#D9A94E' }]] },
  };
  ['snow_forest', 'dining', 'garden', 'room'].forEach(k => { BGPH[k + '_v2'] = BGPH[k]; }); BGPH.garden_bloom_v2 = BGPH.garden;
  function bgImage(T, key) {
    if (bgOK[key]) return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const d = BGPH[key], g = T.el('g', {}, T.bg);
    T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: d.sky }, g);
    T.el('rect', { x: BGBOX.x, y: 412, width: BGBOX.w, height: 200, fill: d.gnd }, g);
    d.shapes().forEach(([t, a]) => T.el(t, a, g));
    T.el('text', { x: 500, y: 52, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: key === 'snow_forest' || key === 'dining' ? CREAM : '#6B4A32', 'font-family': FONT, opacity: .85, text: '(그림 자리) 배경: ' + d.name }, g);
    return g;
  }

  /* ================= 배우·소품 ================= */
  /* poses = { 이름: 그림 } (높이는 HT) 또는 { 이름: [그림, 높이] }. a.look(자세, 방향) — 그림이 보는 쪽이 다르면 뒤집는다 (앞모습은 뒤집지 않는다) */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, v]) => {
        const [f, h0] = Array.isArray(v) ? v : [v, null], h = h0 || hOf(f), w = h * (ASP[f] || 1);
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

  const sfx = (T, name, vol, fb) => (typeof vol === 'function' ? (AudioFX.sfx(name) || vol()) : (AudioFX.sfx(name, vol) || (fb && fb())));
  const popSfx = T => sfx(T, 'pop', undefined, () => T.tone([500, 800], .12, { vol: .12 }));
  const sparkleSfx = T => sfx(T, 'sparkle', undefined, () => T.tone([700, 1400], .4, { vol: .12 }));
  /* 배경 위에 얇은 색 한 장 (밤·하늘빛). 인물은 그 위에 있어 그대로 보인다 */
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);

  /* 반짝: 작은 크림색 마름모가 퍼졌다 사라진다 */
  function sparkle(T, x, y, r = 90, n = 10, quiet = false) {
    if (!quiet) sparkleSfx(T);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, d = r * (.6 + (i % 3) * .2);
      const p = T.el('path', { d: 'M0 -9 L5 0 L0 9 L-5 0 Z', fill: i % 2 ? '#F6ECD8' : '#F2B366', transform: `translate(${x},${y})` }, T.world);
      p.animate([{ transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 0 },
        { transform: `translate(${x + Math.cos(a) * d * .6}px,${y + Math.sin(a) * d * .6}px) scale(1.2)`, opacity: 1, offset: .4 },
        { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d}px) scale(.4)`, opacity: 0 }], { duration: 1100, delay: i * 30, easing: 'ease-out' })
        .finished.then(() => p.remove(), () => p.remove());
    }
  }

  let uid = 0;
  /* 거울 속 아버지: 거울 유리(원) 안에서 은빛 파문과 함께 천천히 떠오른다 */
  function mirrorFace(T, mx, my, r) {
    const g = T.el('g', { opacity: 0 }, T.world), id = 'bbMf' + (++uid), W = r * 1.7, H = W / (ASP.father_bed || 1.86);
    T.el('circle', { cx: mx, cy: my, r }, T.el('clipPath', { id }, g));
    const im = sprite(T, g, 'father_bed', mx - W / 2, my + r * .15 - H / 2, W, H);
    im.setAttribute('clip-path', `url(#${id})`);
    const ring = T.el('circle', { cx: mx, cy: my, r: r + 4, fill: 'none', stroke: '#DCE3EE', 'stroke-width': 5, opacity: 0 }, T.world);
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

  /* 눈: 한 줄로 내려온다 */
  function snowfall(T, n = 14) {
    for (let i = 0; i < n; i++) {
      const c = T.el('circle', { cx: 40 + (i * 977 / n) % 980, cy: -30, r: 4 + (i % 4), fill: '#F4F6FA', opacity: .9 }, T.world);
      c.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-40px,640px)' }], { duration: 5200 + (i % 4) * 900, delay: i * 180, iterations: Infinity, easing: 'linear' });
    }
  }

  /* 장미 꽃잎이 (x,y) 둘레에서 바깥으로 흩날린다 (얼굴 위는 지나지 않게 아래·옆으로) */
  function rosePetals(T, x, y, n = 10) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, d = 150 + (i % 3) * 40, s = .8 + (i % 3) * .2;
      const p = T.el('image', { href: artSrc('layer_petal_rose'), x: -8, y: -8, width: 16 * ASP.layer_petal_rose, height: 16, opacity: 0 }, T.world);
      p.style.pointerEvents = 'none';
      const ex = x + Math.cos(a) * d, ey = y + Math.abs(Math.sin(a)) * d * .5 + 20;
      p.animate([{ transform: `translate(${x}px,${y}px) rotate(0deg) scale(${s})`, opacity: 0 }, { opacity: 1, offset: .2 },
        { transform: `translate(${ex}px,${ey}px) rotate(${200 + i * 30}deg) scale(${s})`, opacity: 0 }], { duration: 1600, delay: i * 40, easing: 'ease-out' })
        .finished.then(() => p.remove(), () => p.remove());
    }
  }

  /* 문패 */
  /* 가로 화면은 배경 문의 놋쇠 문패 위에 글자만 얹고, 세로 화면(문이 안 보임)은 종이 문패를 벽에 단다 */
  function namePlate(T, x, y, onDoor) {
    const g = onDoor ? T.el('g', { transform: `translate(${x},${y})` }, T.world)
      : T.paper(T.world, [['rect', { x: -72, y: -26, width: 144, height: 52, rx: 9, fill: '#F6ECD8' }],
        ['rect', { x: -64, y: -18, width: 128, height: 36, rx: 6, fill: 'none', stroke: '#6B4A32', 'stroke-width': 3 }]], { transform: `translate(${x},${y})` });
    const label = T.tr('벨의 방');
    T.el('text', { x: 0, y: 9, 'text-anchor': 'middle', 'font-size': label.length > 8 ? 17 : onDoor ? 22 : 24, 'font-weight': 800, fill: onDoor ? '#5A3A22' : '#A93B32', 'font-family': FONT, text: label }, g);
    return { g, glow: ms => { g.style.filter = 'url(#hintGlow)'; setTimeout(() => { g.style.filter = ''; }, ms); } };
  }

  /* 물방울 (벨의 손 → 야수 얼굴) */
  function drops(T, x0, y0, x1, y1) {
    for (let i = 0; i < 5; i++) {
      const c = T.el('circle', { cx: 0, cy: 0, r: 5, fill: '#BFD8EE' }, T.world);
      c.animate([{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 40}px)`, offset: .5 }, { transform: `translate(${x1 + (i - 2) * 6}px,${y1}px)` }],
        { duration: 520, delay: i * 90, easing: 'ease-in', fill: 'both' }).finished.then(() => c.remove(), () => c.remove());
    }
  }

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
    if (T.fx) T.fx.style.pointerEvents = 'none';   // 효과 글자(pop)가 누르는 대상을 덮지 않게
    const { sleep, camSnap, tr } = T;
    let gap = 150;                                  // 대사 사이 숨 (첫 조작 전에는 짧게: 시작 후 30초 안에 첫 톡)
    const say = async text => { await T.say(text); await sleep(gap); };
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    const loads = [...BGS.map(k => T.preload(bgSrc(k)).then(ok => { bgOK[k] = ok; })), ...Object.keys(ASP).map(k => T.preload(artSrc(k)).then(ok => { artOK[k] = ok; }))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    /* ---- 배우 ---- */
    const belle = mk(T, { stand: 'belle_stand', broom: 'belle_broom', point: 'belle_point', resolve: 'belle_resolve', sit: 'belle_sit',
      worry: 'belle_worry', sleep: 'belle_sleep', run: 'belle_run', kneel: 'belle_kneel', joy: 'belle_joy' });
    const beast = mk(T, { stand: 'beast_stand', sit: 'beast_sit', ring: 'beast_ring', lie: 'beast_lie', eyes: 'beast_lie_eyes' });
    const prince = mk(T, { stand: 'prince_stand' });
    const father = mk(T, { stand: 'father_stand', ride: 'father_ride', eat: 'father_eat', sleep: 'father_sleep', shock: 'father_shock',
      rose: 'father_rose', bed: 'father_bed', well: 'father_well' });
    const sisa = mk(T, { pout: 'sisa_pout', plead: 'sisa_plead', gasp: 'sisa_gasp', joy: 'sisa_joy' });
    const sisb = mk(T, { pout: 'sisb_pout', plead: 'sisb_plead', gasp: 'sisb_gasp', joy: 'sisb_joy' });
    const horse = prop(T, 'horse_stand', 230);
    const bush5 = prop(T, 'prop_bush5', 150), bush2 = prop(T, 'prop_bush2', 150);
    const rose = prop(T, 'prop_rose', 50);
    const vases = Array.from({ length: 3 }, () => prop(T, 'prop_rose_vase', 70));   // 위·아래·옆
    const tableS = prop(T, 'prop_table_small', 110), tableL = prop(T, 'prop_table_long', 170);
    const mirror = prop(T, 'prop_mirror', 200), ring = prop(T, 'prop_ring', 22), dream = prop(T, 'prop_dream', 150);
    const spring = prop(T, 'prop_spring', 90), shine = prop(T, 'prop_glow', 220), hat = prop(T, 'prop_hat', 34);
    const ALL = [belle, beast, prince, father, sisa, sisb, horse, bush5, bush2, rose, ...vases, tableS, tableL, mirror, ring, dream, spring, shine, hat];
    ALL.forEach(hide);
    /* ---- 층 소품 (VISUAL_PLAN §4): 누름을 받지 않는다. 같은 소품은 어느 장면이든 같은 높이 ---- */
    const D = (f, h) => { const a = prop(T, 'layer_' + f, h); a.pos.style.pointerEvents = 'none'; return a; };
    const L = { fir: [D('snow_fir_front', 420), D('snow_fir_front', 420)], sbush: D('snow_bush', 110), chand: D('chandelier', 160),
      curtain: [D('curtain', 520), D('curtain', 520)], feast: D('feast', 70), topiary: D('topiary_snow', 200), rose: D('rosebush_front', 150) };
    Object.values(L).flat().forEach(hide);
    const front = (...as) => as.forEach(a => { if (a.pos.style.display !== 'none') T.world.appendChild(a.pos); });
    /* 연회장(3B·8장): 샹들리에(중간·위) → 배우·식탁 → 잔칫상(식탁 위) → 휘장 둘(앞) */
    const diningBack = () => { put(T, L.chand, X(500, 520), 180); };
    const diningFront = () => {
      put(T, L.feast, tableL.x, FL + 4 - 170 * .72);
      put(T, L.curtain[0], 25, 580); put(T, L.curtain[1], 975, 580, { to: 'right' });
      front(L.curtain[0], L.curtain[1]);
    };
    T.director({ cast: { belle, beast, father, sisa, sisb, prince }, noFace: ['belle', 'beast', 'father', 'sisa', 'sisb', 'prince'] });

    /* ================= 읽어 주기 (docs/READ_MODE.md): read_script_el.json 의 동사 → 아래 놀이판 연출을 감싼 얇은 함수 =================
       set 은 놀이판 장면의 배경·층 소품(전나무·샹들리에·휘장·토피어리·앞 장미 덤불)을 그대로 깐다. 같은 배경이 여러 번 나오므로
       set 호출 순서로 장면 이름표(tag)를 센다. 세로 화면은 대본의 가로 x 를 놀이판의 세로 자리(PXT)로 바꾼다. 대본 y(505)는 바닥선(FL)으로. */
    const READ_ACTS = (() => {
      const inst = () => T.readInstant();
      const on = a => a.pos.isConnected && a.pos.style.display !== 'none';
      const SEQ = ['R01', 'R02', 'R03', 'R03b', 'R04', 'R05', 'R06', 'R06b', 'R07', 'R08', 'R09', 'R10', 'R11'];
      const PCAM = { R01: 520, R02: 520, R03: 300, R03b: 520, R04: 515, R05: 520, R06: 500, R06b: 500, R07: 520, R08: 520, R09: 520, R10: 500, R11: 500 };
      const PXT = {
        R01: { father: { 330: 400 }, belle: { 560: 520 }, sisa: { 760: 630 }, sisb: { 870: 700 } },
        R02: { sisa: { 200: 330 }, sisb: { 300: 400 }, belle: { 430: 470 }, horse: { 640: 600 }, father: { 560: 540, 640: 600 } },
        R03: { father: { 480: 500 } },
        R03b: { father: { 560: 520, 300: 420 } },
        R04: { father: { 880: 760, 440: 550, 700: 640 }, beast: { 430: 440 } },
        R05: { father: { 380: 420 }, belle: { 560: 540 }, sisa: { 740: 640 }, sisb: { 850: 710 } },
        R06: { beast: { 300: 380 }, father: { 1100: 1000, 650: 620 }, belle: { 1100: 1000, 520: 520 } },
        R06b: { belle: { 230: 330 } },
        R07: { belle: { 440: 450 }, beast: { 700: 600 } },
        R08: { belle: { 470: 500 }, beast: { 700: 650 }, mirror: { 300: 380 }, tableS: { 880: 800 } },
        R09: { father: { 330: 400 }, belle: { 520: 520, '520:sleep': 500, 560: 520 }, sisa: { 700: 640 }, sisb: { 800: 720 } },
        R10: { beast: { 720: 640 }, belle: { 430: 400 }, spring: { 520: 460 } },
        R11: { prince: { 680: 600 }, belle: { 480: 450 } },
      };
      let rIdx = -1, tag = '', camX = 500, busy = {}, cyc = null, famP = null, vPlaced = false, rPlate = null, rMf = null;
      const LX = {};
      const px = (who, lx, look) => {
        if (!P) return lx;
        const t = PXT[tag] && PXT[tag][who]; if (!t) return lx;
        const k = look != null ? t[lx + ':' + look] : null;
        return k != null ? k : (t[lx] != null ? t[lx] : lx);
      };
      const yOf = y => FL + (Number(y) - 505);
      const xy = s => String(s).split(',').map(Number);
      const A = { belle, beast, prince, father, sisa, sisb };
      const RF = () => front(L.fir[0], L.fir[1], L.sbush, L.curtain[0], L.curtain[1], L.rose);
      const BGK = { cottage: 'cottage', cottage_front: 'cottage_front', snow_forest: 'snow_forest_v2', dining: 'dining_v2', garden: 'garden_v2', room: 'room_v2' };
      const setLayers = () => {
        Object.values(L).flat().forEach(hide);
        if (tag === 'R03') { put(T, L.fir[0], 60, 575); put(T, L.fir[1], 950, 575, { to: 'right' }); put(T, L.sbush, 985, 585); }
        if (tag === 'R03b' || tag === 'R07') diningBack();
        if (['R04', 'R06', 'R10', 'R11'].includes(tag)) put(T, L.topiary, 70, FL);
        if (tag === 'R04') put(T, L.rose, 30, 585);
        if (tag === 'R10' || tag === 'R11') put(T, L.rose, 985, 585, { to: 'right' });
      };
      const HOP = { belle: [10, 320], beast: [6, 500], prince: [8, 300], father: [8, 300], sisa: [8, 300], sisb: [8, 300] };
      const bloomNow = () => {
        if (!bgOK.garden_bloom_v2) return;
        const img = T.el('image', { href: bgSrc('garden_bloom_v2'), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none', opacity: inst() ? 1 : 0 }, T.bg);
        if (inst()) hide(L.topiary);
        else { img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2400, fill: 'forwards' }); sfx(T, 'sparkle'); fadeOut(T, L.topiary, 2400); }
      };
      const actor = (name, a) => (op, ...r) => {
        const w = busy[name];
        const go = () => {
          switch (op) {
            case 'at': {
              const [lx, ly] = xy(r[0]), look = r[1] || undefined, dir = r[2] || undefined, sc = r[3] ? Number(r[3]) : 1;
              LX[name] = lx;
              put(T, a, px(name, lx, look), yOf(ly), { look, to: dir, s: sc }); RF();
              if (name === 'father' && look === 'ride' && tag === 'R02') bob(a.pos);
              if (name === 'prince' && !inst()) { fadeIn(a, 500); glow(a, 1400); rosePetals(T, a.x, FL - 100, 10); bloomNow(); }
              if (name === 'prince' && inst()) bloomNow();
              if (name === 'belle' && look === 'sleep' && tag === 'R09' && !on(tableS)) { put(T, tableS, X(720, 610), FL); fadeIn(tableS); }
              return null;
            }
            case 'look': a.look(r[0], r[1] || undefined); return null;
            case 'hop': { const h = HOP[name]; a.hop(h[0], h[1]); return null; }
            case 'wiggle': a.wiggle(name === 'belle' ? 3 : 4, 500); return null;
            case 'fade': if (r[0] === 'out') return fadeOut(T, a, 400); fadeIn(a, 450); return null;
            case 'hide': hide(a); return null;
            case 'move': {
              const [lx, ly] = xy(r[0]), ms = Number(r[1] || 1000), tx = px(name, lx);
              LX[name] = lx;
              const ride = a.cur === 'ride';
              if (ride) (async () => { for (let i = 0; i < Math.floor(ms / 600); i++) { a.hop(5, 400); await sleep(600); } })();
              if (P && tag === 'R03') T.camTo(450, 280, 1, ms);
              if (P && tag === 'R10') T.camTo(460, 280, 1, ms);
              busy[name] = a.move(tx, yOf(ly), ms, ride ? 'linear' : undefined); return null;
            }
            case 'appear': {
              a.place(a.x, FL + 40);
              if (on(bush5)) T.world.insertBefore(a.pos, bush5.pos);
              a.pos.style.opacity = 0;
              a.pos.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1400, fill: 'forwards' });
              a.move(a.x, FL, 1400, 'ease-out');
              setTimeout(() => sfx(T, 'thud', .45), 700);
              return null;
            }
            case 'transform': return T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], 500).then(() => hide(a));
            case 'ride_off': {
              (async () => { for (let i = 0; i < 6; i++) { AudioFX.sfx('step_grass'); a.hop(6, 420); await sleep(450); } })();
              setTimeout(() => T.pop(P ? a.x + 40 : a.x + 300, FL - 340, tr('따각따각')), 1300);
              a.move(1150, FL, 2800, 'linear').then(() => hide(a)); return null;
            }
            default: console.warn('[read] 모르는 동작', name, op); return null;
          }
        };
        return (w && (op === 'at' || op === 'look')) ? w.then(go) : go();
      };
      const sparkleBeast = () => {
        const bx = (on(beast) ? beast.x : px('prince', 680)) - 40;
        if (!(AudioFX.sting && AudioFX.sting('magic'))) sparkleSfx(T);
        sparkle(T, bx, FL - 120, 160, 18); setTimeout(() => sparkle(T, bx, FL - 120, 220, 18, true), 300);
      };
      const popX = x => {
        let best = null;
        Object.keys(LX).forEach(n => { const a = A[n] || null; if (a && on(a) && Math.abs(LX[n] - x) < 170 && (!best || Math.abs(LX[n] - x) < Math.abs(LX[best] - x))) best = n; });
        if (best) return A[best].x + (x - LX[best]);
        return Math.max(camX - 95, Math.min(camX + 95, x));
      };
      const R = {
        set: key => {
          tag = SEQ[++rIdx] || tag; busy = {}; cyc = null; famP = null; vPlaced = false; rMf = null;
          scene(BGK[key] || key); if (P) { camX = PCAM[tag] || 520; camSnap(camX, 280, 1); }
          setLayers();
        },
        belle: actor('belle', belle), beast: actor('beast', beast), father: actor('father', father), prince: actor('prince', prince),
        sisa: actor('sisa', sisa), sisb: actor('sisb', sisb),
        sisters: (op, s) => {
          if (op === 'at') { const [x1, x2] = xy(s); LX.sisa = x1; LX.sisb = x2; put(T, sisa, px('sisa', x1), FL + 4); put(T, sisb, px('sisb', x2), FL + 6); RF(); }
          else if (op === 'hop') { sisa.hop(8, 300); sisb.hop(8, 300); }
          else if (op === 'wiggle') { sisa.wiggle(5, 500); sisb.wiggle(5, 500); }
          return null;
        },
        horse: (op, s) => { if (op === 'hide') hide(horse); else { const [lx, ly] = xy(s); put(T, horse, px('horse', lx), yOf(ly), { to: 'right' }); RF(); } },
        cam: a => { let [x, y, z] = String(a).split(',').map(Number); if (P) x = PCAM[tag] || x; camX = x; return inst() ? camSnap(x, y, z || 1) : T.camTo(x, y, z || 1, 800); },
        follow: a => { if (!P) return null; let x = Number(a); if (tag === 'R04' && x === 330) x = 440; camX = x; T.camTo(x, 280, 1, tag === 'R06' ? 1800 : 900); return null; },
        tint: a => { const [c, o] = String(a).split(','), op = Number(o); if (inst()) { tint(T, c, op); return null; } const n = tint(T, c, 0); return T.anim(n, [{ opacity: 0 }, { opacity: op }], 1000).then(() => n.setAttribute('opacity', op)); },
        snowfall: () => snowfall(T, 22),
        shake: () => T.shake(),
        confetti: () => { const go = () => { T.confetti(); [belle, prince, father, sisa, sisb].forEach((a, i) => setTimeout(() => a.hop(16 + (i % 3) * 2, 460), i * 120)); return null; }; return famP ? famP.then(go) : go(); },
        sparkle: () => { if (tag === 'R08') sparkle(T, ring.x, ring.y, 60, 8, true); else sparkleBeast(); },
        glow: n => { const g = { belle, beast, prince, bush5, ring }[n]; if (g) glow(g, n === 'prince' ? 1400 : 1200); },
        fx: n => {
          const V = { thud: .45, blow_long: .4, womp: .4, xylo_down: .5, splash: .5 };
          if (n === 'sparkle') return sparkleSfx(T); if (n === 'pop') return popSfx(T);
          if (n === 'tada') return sfx(T, 'tada', () => sparkleSfx(T));
          return sfx(T, n, V[n]);
        },
        pop: s => { const p = String(s).split(','); const x = Number(p[0]); T.pop(P ? popX(x) : x, Number(p[1]), tr(p.slice(2).join(','))); },
        bushes: () => { put(T, bush5, X(330, 440), FL - 10, { s: P ? .65 : 1 }); put(T, bush2, X(690, 590), FL - 10, { s: P ? .65 : 1 }); RF(); },
        bush5: () => { if (!on(bush5)) { put(T, bush5, X(780, 700), FL - 10, { s: P ? .8 : 1 }); RF(); } else bush5.hop(8, 360); },
        bush2: () => { bush2.hop(8, 360); },
        rose: () => {
          const go = async () => { put(T, rose, bush5.x + 30, FL - 120); await rose.move(father.x - 28, FL - 108, 700); hide(rose); };
          return busy.father ? busy.father.then(go) : go();
        },
        hat: () => {
          put(T, hat, father.x, FL - 212 + 12); RF();
          hat.pos.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '40px 200px', rotate: '70deg' }], { duration: 600, easing: 'ease-in', fill: 'forwards' });
          sfx(T, 'paper_down'); return null;
        },
        table: op => {
          if (op === 'long') { put(T, tableL, tag === 'R07' ? X(570, 525) : X(560, 520), FL + 4); diningFront(); }
          else put(T, tableS, px('tableS', tag === 'R08' ? 880 : 500), FL);
          return null;
        },
        vases: () => {
          if (!vPlaced) {
            vPlaced = true; const tx = X(500, 500);
            put(T, vases[1], tx, FL - 4, { s: .85 }); T.world.insertBefore(vases[1].pos, tableS.pos);
            put(T, vases[0], tx, FL - 110 + 2); put(T, vases[2], tx + X(140, 125), FL);
          } else (async () => { for (const v of vases) await v.hop(8, 300); })();
          return null;
        },
        plate: () => { rPlate = P ? namePlate(T, 560, 276, false) : namePlate(T, 932, 141, true); rPlate.glow(1500); return null; },
        mirror: (op, a) => {
          if (op === 'set') { put(T, mirror, px('mirror', 300), FL); rMf = mirrorFace(T, mirror.x, FL - 200 * .6, 58); }
          else if (rMf) { if (a === 'show') rMf.show(); else rMf.hide(); }
          return null;
        },
        ring: op => {
          if (op === 'show') { put(T, ring, beast.x - beast.w * .28, FL - beast.h * .48); fadeIn(ring); return null; }
          if (op === 'give') return ring.move(belle.x + 22, FL - 100, 900);
          return (async () => { put(T, ring, belle.x + 22, FL - 100); fadeIn(ring); await ring.move(tableS.x, FL - 110 + 4, 900); sparkle(T, tableS.x, FL - 120, 60, 8); })();
        },
        sun: () => {
          const sun = T.el('circle', { cx: 0, cy: 0, r: 28, fill: '#F2B366' }, T.bg);
          sun.animate([{ translate: '120px 170px' }, { translate: '500px 50px' }, { translate: '880px 170px' }], { duration: 1700, iterations: 3 });
          const nt = tint(T, '#1F2A56', 0);
          nt.animate([{ opacity: 0 }, { opacity: .35, offset: .5 }, { opacity: 0 }], { duration: 1700, iterations: 3 }).finished.then(() => { nt.setAttribute('opacity', .35); sun.remove(); }, () => {});
          cyc = (async () => { await sleep(5100); await Promise.all([fadeOut(T, father, 400), fadeOut(T, sisa, 400), fadeOut(T, sisb, 400), fadeOut(T, belle, 400)]); })();
          return null;
        },
        dream: op => {
          if (op === 'hide') { hide(dream); hide(beast); return null; }
          put(T, dream, belle.x + X(170, 110), FL - 250); fadeIn(dream, 600);
          put(T, beast, dream.x, dream.y - 45, { look: 'lie', s: .38 }); fadeIn(beast, 600); return null;
        },
        spring: () => { put(T, spring, px('spring', 520), FL + 10); return null; },
        drops: () => { drops(T, belle.x + 40, FL - 85, beast.x - beast.w * .3, FL - 60); return null; },
        shine: () => {
          const bx = on(beast) ? beast.x - 40 : px('prince', 680);
          put(T, shine, bx, FL - 10); if (on(beast)) T.world.insertBefore(shine.pos, beast.pos); fadeIn(shine, 500);
          shine.body.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(.9)' }], { duration: 1400, iterations: Infinity });
          if (inst()) setTimeout(() => fadeOut(T, shine, 600), 6500);
          return null;
        },
        family: () => {
          put(T, father, -100, FL, { look: 'well' }); put(T, sisa, -100, FL + 4, { look: 'joy' }); put(T, sisb, -100, FL + 8, { look: 'joy' }); RF();
          if (P) T.camTo(430, 280, 1, 1200);
          famP = Promise.all([father.move(X(160, 300), FL, 1600), sisa.move(X(260, 350), FL + 4, 1800), sisb.move(X(340, 395), FL + 8, 2000)])
            .then(() => { if (P) T.camTo(520, 280, 1, 800); });
          return null;
        },
      };
      /* 아침 장면 전환: 대본의 '꿈' 장면에서 벨이 잠들기 전 해 뜨고 지기를 기다린다 */
      const at0 = R.belle;
      R.belle = (op, ...r) => { if (cyc && op === 'at') { const c = cyc; cyc = null; return c.then(() => at0(op, ...r)); } return at0(op, ...r); };
      return R;
    })();
    if (T.reading()) return T.readPlay(READ_ACTS);

    /* ===== 1. 가난해진 가족 ===== */
    scene('cottage');
    put(T, father, X(330, 400), FL, { look: 'stand' });
    put(T, belle, X(560, 520), FL, { look: 'broom' });
    put(T, sisa, X(760, 630), FL + 4, { look: 'pout' });
    put(T, sisb, X(870, 700), FL + 4, { look: 'pout' });
    if (P) camSnap(520, 280, 1);
    await T.curtain(true);
    await say('옛날에 상인에게 딸이 셋 있었어요. 막내 벨은 마음이 고와서 모두 \'미녀\'라고 불렀어요.');
    const w1 = father.wiggle(4, 600);
    await say('어느 날 배들이 가라앉아, 가족은 시골 작은 집으로 갔어요.');
    await w1;
    belle.hop(10, 320);
    await say('괜찮아요, 제가 집안일을 할게요.');
    Promise.all([sisa.hop(8, 300), sisb.hop(8, 300)]);
    T.pop((sisa.x + sisb.x) / 2, FL - 230, tr('힝…')); sfx(T, 'womp', .4);

    /* ===== 2. 장미 한 송이만 (톡 1) ===== */
    await T.sceneCard(tr('장미 한 송이'), () => {
      scene('cottage_front');
      put(T, sisb, X(200, 330), FL + 6, { look: 'plead' });
      put(T, sisa, X(300, 400), FL + 4, { look: 'plead' });
      put(T, belle, X(430, 470), FL, { look: 'point', to: 'right' });
      put(T, horse, X(640, 600), FL, { to: 'right' });
      put(T, father, X(560, 540), FL, { look: 'stand' });
      if (P) camSnap(520, 280, 1);
    }, horse.pos);
    await say('배 한 척이 돌아왔대요! 아버지가 도시로 떠나요.');
    await sisa.hop(12, 360); sisb.hop(12, 360);
    await say('비단옷이요! 반지랑 리본도요!');
    belle.hop(8, 300);
    await say('저는 장미 한 송이면 돼요.');
    father.hop(8, 300);
    await say('그래, 다녀오마.');
    hide(father); hide(horse);
    put(T, father, X(640, 600), FL, { look: 'ride', to: 'right' }); sfx(T, 'paper_up');
    bob(father.pos);
    await T.ask('말을 톡 눌러 봐요.', () => T.tap(father.pos, { prompt: '말을 톡 눌러 봐요.' }));
    gap = 500;
    (async () => { for (let i = 0; i < 6; i++) { AudioFX.sfx('step_grass'); father.hop(6, 420); await sleep(450); } })();
    T.pop(father.x, FL - 350, tr('따각따각'));
    setTimeout(() => T.pop(father.x + 300, FL - 340, tr('따각따각')), 1300);
    belle.hop(10); sisa.wiggle(5, 500); sisb.wiggle(5, 500);
    await Promise.all([father.move(1150, FL, 2800, 'linear'), say('따각따각, 아버지가 도시로 떠났어요.')]);
    hide(father);

    /* ===== 3. 눈보라 속 궁전 ===== */
    await T.sceneCard(tr('눈보라 속 궁전'), () => {
      scene('snow_forest_v2'); snowfall(T, 22);
      put(T, father, -150, FL, { look: 'ride', to: 'right' });
      put(T, L.fir[0], 60, 575); put(T, L.fir[1], 950, 575, { to: 'right' }); put(T, L.sbush, 985, 585);   /* 앞 가림: 아버지는 왼쪽 전나무 뒤로 지나간다 */
      if (P) camSnap(300, 280, 1);
    }, father.pos);
    sfx(T, 'blow_long', .4);
    (async () => { for (let i = 0; i < 6; i++) { father.hop(5, 400); await sleep(600); } })();
    if (P) T.camTo(450, 280, 1, 3000);
    await Promise.all([father.move(X(480, 500), FL, 3200, 'linear'), say('그런데 배의 짐은 남의 것이 되어, 아버지는 빈손으로 돌아오다 눈보라에 길을 잃었어요.')]);
    await sleep(300);
    const h10 = father.hop(8, 400);
    await say('멀리 불빛! 커다란 궁전에 아무도 없고, 따뜻한 저녁상만 차려져 있었어요.');
    await h10;
    T.clear(); bgImage(T, 'dining_v2'); camSnap(500, 280, 1);
    diningBack();
    put(T, father, X(560, 520), FL, { look: 'eat' });
    put(T, tableL, X(560, 520), FL + 4);
    diningFront();
    if (P) camSnap(520, 280, 1);
    await say('누구 계세요? …고맙게 먹겠습니다.');
    sfx(T, 'chomp'); father.hop(8, 300); T.pop(father.x, FL - 330, tr('냠냠!'));
    await sleep(700);
    sfx(T, 'chomp'); father.hop(8, 300); T.pop(father.x, FL - 330, tr('냠냠!'));
    await sleep(700);
    await fadeOut(T, father, 400);
    put(T, father, X(300, 420), FL, { look: 'sleep' }); fadeIn(father); front(L.curtain[0], L.curtain[1]);
    const night3 = tint(T, '#1F2A56', 0);
    T.anim(night3, [{ opacity: 0 }, { opacity: .25 }], 1000);
    T.pop(father.x, FL - 230, tr('쿨쿨'));
    await say('아버지는 배불리 먹고, 푹신한 의자에서 잠이 들었어요.');
    await sleep(400);

    /* ===== 4. 장미 정원 (배움 놀이 1: 많고 적음) ===== */
    await T.sceneCard(tr('장미 정원'), () => {
      scene('garden_v2');                                  /* 4장은 세기 놀이라 층 소품을 두지 않는다 */
      put(T, bush5, X(330, 440), FL - 10, { s: P ? .65 : 1 });
      put(T, bush2, X(690, 590), FL - 10, { s: P ? .65 : 1 });
      put(T, father, X(880, 760), FL, { look: 'stand', to: 'left' });
      if (P) camSnap(515, 280, 1);
    }, bush5.pos);
    await say('아침이 되자 눈 속에 장미가 활짝 피어 있었어요!');
    bush5.hop(8, 360); await sleep(150); bush2.hop(8, 360);
    await T.ask('장미가 많은 덤불은 어느 쪽일까요?', () => T.choose([{ el: bush5.pos, ok: true }, { el: bush2.pos, ok: false, onWrong: async () => { await bush2.wiggle(8, 360); await say('그 덤불은 장미가 두 송이예요. 적어요.'); } }],
      { prompt: '장미가 많은 덤불은 어느 쪽일까요?' }));
    glow(bush5, 1200); bush5.hop(14, 400); sparkleSfx(T); T.pop(bush5.x, FL - 260, tr('반짝!'));
    await say('맞아요, 다섯 송이! 장미가 많아요.');
    {
      const a5 = bush5.x, a2 = bush2.x; sfx(T, 'swish');
      await Promise.all([bush5.move(a2, FL - 10, 900), bush2.move(a5, FL - 10, 900)]);
    }
    await T.ask('자리를 바꿨어요. 장미가 적은 덤불은 어느 쪽일까요?', () => T.choose([{ el: bush2.pos, ok: true }, { el: bush5.pos, ok: false, onWrong: async () => { await bush5.wiggle(8, 360); await say('그 덤불은 장미가 다섯 송이예요. 많아요.'); } }],
      { prompt: '장미가 적은 덤불은 어느 쪽일까요?' }));
    glow(bush2, 1200); bush2.hop(14, 400); sparkleSfx(T); T.pop(bush2.x, FL - 260, tr('반짝!'));
    await say('맞아요, 두 송이! 장미가 적어요.');
    follow(bush5.x, 900);
    await father.move(bush5.x + 110, FL, 1200);
    put(T, rose, bush5.x + 30, FL - 120);
    const rm = rose.move(father.x - 28, FL - 108, 700);
    await say('벨에게 줄 장미 한 송이만.');
    await rm;
    hide(rose); father.look('rose'); sfx(T, 'pop'); T.pop(father.x, FL - 240, tr('톡!'));
    await sleep(500);

    /* ===== 5. 야수 ===== */
    await T.sceneCard(tr('야수'), () => {
      scene('garden_v2');
      put(T, L.topiary, 70, FL);
      put(T, bush5, X(330, 380), FL - 10, { s: P ? .8 : 1 });
      put(T, father, X(700, 640), FL, { look: 'rose', to: 'left' });
      put(T, beast, X(430, 440), FL + 40, { look: 'stand' });
      T.world.insertBefore(beast.pos, bush5.pos); beast.pos.style.opacity = 0;
      put(T, L.rose, 30, 585);
      if (P) camSnap(520, 280, 1);
    }, bush5.pos);
    const appear = beast.pos.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1400, fill: 'forwards' });
    beast.move(beast.x, FL, 1400, 'ease-out');
    sfx(T, 'thud', .45); T.pop(beast.x, FL - 330, tr('쿵'));
    setTimeout(() => { sfx(T, 'thud', .45); T.pop(beast.x + 40, FL - 330, tr('쿵')); }, 700);
    await say('그때 덤불 뒤에서 커다란 야수가 천천히 나왔어요.');
    await appear.finished.catch(() => {});
    await say('내 장미를 꺾었구나. 재워 주고 먹여 줬는데.');
    put(T, hat, father.x, FL - 212 + 12); father.look('shock'); front(L.rose);
    hat.pos.animate([{ translate: '0 0', rotate: '0deg' }, { translate: '40px 200px', rotate: '70deg' }], { duration: 600, easing: 'ease-in', fill: 'forwards' });
    sfx(T, 'paper_down'); T.pop(father.x + 40, FL - 40, tr('툭!'));
    const w5 = father.wiggle(4, 500);
    await say('죄송해요, 나리. 막내딸이 부탁한 거예요.');
    await w5;
    beast.hop(6, 500);
    await say('나리가 아니라 야수라고 불러라. 장미를 꺾었으니 벌을 받아야 해. 네가 돌아오든지, 딸 하나가 스스로 오든지.');
    await sleep(500);

    /* ===== 6. 벨의 결심 ===== */
    await T.sceneCard(tr('벨의 결심'), () => {
      scene('cottage');
      put(T, father, X(380, 420), FL, { look: 'rose' });
      put(T, belle, X(560, 540), FL, { look: 'resolve' });
      put(T, sisa, X(740, 640), FL + 4, { look: 'gasp' });
      put(T, sisb, X(850, 710), FL + 8, { look: 'gasp' });
      if (P) camSnap(520, 280, 1);
    }, belle.pos);
    await say('아버지는 장미를 들고 집으로 돌아왔어요.');
    father.wiggle(3, 600);
    await say('야수가… 딸 하나를 보내라고 했단다.');
    belle.hop(10, 320);
    await say('제 장미 때문이에요. 제가 갈게요.');
    father.hop(8, 300);
    await say('안 된다, 벨.');
    belle.hop(12, 340);
    await say('괜찮아요. 제가 가고 싶어요.');
    await sleep(400);

    /* ===== 7. 궁전의 손님 (배움 놀이 2: 위·아래·옆) ===== */
    await T.sceneCard(tr('궁전의 손님'), () => {
      scene('garden_v2');
      put(T, L.topiary, 70, FL);
      put(T, beast, X(300, 380), FL, { look: 'stand' });
      put(T, father, X(1100, 1000), FL, { look: 'stand' });
      put(T, belle, X(1100, 1000), FL, { look: 'stand' });
      if (P) camSnap(500, 280, 1);
    }, beast.pos);
    (async () => { await Promise.all([father.move(X(650, 620), FL, 1800), belle.move(X(520, 520), FL, 1800)]); })();
    follow(500, 1800);
    await say('아버지는 벨을 궁전까지 데려다주었어요.');
    beast.hop(6, 500);
    await say('스스로 온 거니?');
    belle.hop(8, 300);
    await say('네.');
    await say('착하구나. 아버지는 내일 아침 집으로 가거라.');
    await sleep(400);
    let plate;
    await T.sceneCard(tr('벨의 방'), () => {
      scene('room_v2');
      put(T, belle, X(230, 330), FL, { look: 'stand' });
      const tx = X(500, 500);
      put(T, vases[1], tx, FL - 4, { s: .85 });
      put(T, tableS, tx, FL); tableS.pos.style.pointerEvents = 'none';
      put(T, vases[0], tx, FL - 110 + 2);
      put(T, vases[2], tx + X(140, 125), FL);
      plate = P ? namePlate(T, 560, 276, false) : namePlate(T, 932, 141, true);
      if (P) camSnap(500, 280, 1);
    }, belle.pos);
    plate.glow(1500);
    const vh = (async () => { for (const v of vases) { await v.hop(8, 300); } })();
    await say('방 문에 \'벨의 방\'이라고 쓰여 있어요. 책도 많고, 장미도 있어요.');
    await vh;
    const hits = vases.map((v, i) => { const hh = v.h * v.scale; return T.el('circle', { cx: 0, cy: -hh / 2, r: 48 / v.scale * (i === 1 ? .85 : 1), fill: 'transparent' }, v.pos); });
    const QS = {
      on:     { ask: '탁자 위에 있는 장미를 찾아봐요.', right: '맞아요, 탁자 위!', vi: 0 },
      under:  { ask: '탁자 아래에 있는 장미를 찾아봐요.', right: '맞아요, 탁자 아래!', vi: 1 },
      beside: { ask: '탁자 옆에 있는 장미를 찾아봐요.', right: '맞아요, 탁자 옆!', vi: 2 },
    };
    const WR = ['그건 탁자 위예요.', '그건 탁자 아래예요.', '그건 탁자 옆이에요.'];
    for (const k of ['on', 'under', 'beside'].sort(() => Math.random() - .5)) {
      const q = QS[k];
      vases.forEach(v => padHit(T, v.pos));
      await T.ask(q.ask, () => T.choose(vases.map((v, i) => ({ el: v.pos, ok: i === q.vi, onWrong: async () => { await v.wiggle(8, 360); await say(WR[i]); } })), { prompt: q.ask }));
      const v = vases[q.vi]; glow(v, 1200); v.hop(14, 400); sparkleSfx(T); T.pop(v.x, FL - 160, tr('반짝!'));
      await say(q.right);
      await sleep(300);
    }
    hits.forEach(c => c.remove()); tableS.pos.style.pointerEvents = '';
    await sleep(400);

    /* ===== 8. 저녁마다 (배움 놀이 3: 아침·낮·밤) ===== */
    await T.sceneCard(tr('저녁마다'), () => {
      scene('dining_v2');
      diningBack();
      put(T, belle, X(440, 450), FL, { look: 'sit' });
      put(T, beast, X(700, 600), FL, { look: 'sit' });
      put(T, tableL, X(570, 525), FL + 4);
      diningFront();
      if (P) camSnap(520, 280, 1);
    }, belle.pos);
    await say('저녁마다 야수가 찾아왔어요.');
    beast.hop(6, 500);
    await say('벨, 잘 지냈니? 나와 결혼해 줄래?');
    belle.hop(8, 300);
    await say('아니요, 야수님. 하지만 친구로 좋아해요.');
    beast.wiggle(3, 600);
    await say('그럼 내일 저녁에 또 올게.');
    await say('벨은 날마다 친절하게 대답했고, 둘은 친구가 되었어요.');
    const cardS = X(170, 96), cardY = X(380, 360), cardX = X([250, 500, 750], [396, 500, 604]);
    const kinds = ['morning', 'noon', 'night'].sort(() => Math.random() - .5);
    const cards = kinds.map((k, i) => {
      const g = T.el('g', { filter: 'url(#pp)' }, T.world), f = 'card_' + k;
      sprite(T, g, f, cardX[i] - cardS / 2, cardY - cardS / 2, cardS, cardS / (ASP[f] || 1));
      g.animate([{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], { duration: 450, delay: i * 150, fill: 'backwards' });
      return { k, g };
    });
    const cardOf = k => cards.find(c => c.k === k);
    belle.pos.style.opacity = '.35'; beast.pos.style.opacity = '.35';
    if (P) camSnap(500, 250, 1);
    const SKY = tint(T, '#F2B366', 0);
    const flash = async (col, peak, end) => {
      SKY.setAttribute('fill', col);
      await T.anim(SKY, [{ opacity: +SKY.style.opacity || 0 }, { opacity: peak }], 600);
      if (end !== undefined) await T.anim(SKY, [{ opacity: peak }, { opacity: end }], 600);
    };
    const ASK = '창밖은 아침, 낮, 밤으로 바뀌어요. 아침부터 차례로 눌러 봐요.'.replace('창밖은', '창밖은');
    const wrongC = (k, line) => ({ el: cardOf(k).g, ok: false, onWrong: async () => { await wiggleEl(T, cardOf(k).g); await say(line); } });
    await T.ask('창밖은 아침, 낮, 밤으로 바뀌어요. 아침부터 차례로 눌러 봐요.', () => T.choose([{ el: cardOf('morning').g, ok: true }, wrongC('noon', '그건 낮이에요. 아침은 어디일까요?'), wrongC('night', '그건 밤이에요. 아침은 어디일까요?')], { prompt: ASK }));
    cardOf('morning').g.style.filter = 'url(#hintGlow)';
    flash('#F2B366', .22, 0);
    setTimeout(() => { cardOf('morning').g.style.filter = ''; }, 1200); cardOf('morning').g.style.opacity = '.35'; cardOf('morning').g.style.pointerEvents = 'none';
    await T.ask('맞아요, 아침! 아침 다음은?', () => T.choose([{ el: cardOf('noon').g, ok: true }, wrongC('night', '그건 밤이에요. 아침 다음은?')], { prompt: ASK }));
    cardOf('noon').g.style.filter = 'url(#hintGlow)';
    flash('#F6ECD8', .3, 0);
    setTimeout(() => { cardOf('noon').g.style.filter = ''; }, 1200); cardOf('noon').g.style.opacity = '.35'; cardOf('noon').g.style.pointerEvents = 'none';
    await T.ask('맞아요, 낮! 낮 다음은?', () => T.tap(cardOf('night').g, { prompt: ASK }));
    cardOf('night').g.style.filter = 'url(#hintGlow)';
    SKY.setAttribute('fill', '#1F2A56'); T.anim(SKY, [{ opacity: 0 }, { opacity: .35 }], 800);
    await say('맞아요, 밤! 아침, 낮, 밤. 하루가 이렇게 지나가요.');
    await Promise.all(cards.map(c => T.anim(c.g, [{ opacity: 1 }, { opacity: 0 }], 400)));
    cards.forEach(c => c.g.remove());
    belle.pos.style.opacity = ''; beast.pos.style.opacity = '';
    await sleep(400);

    /* ===== 9. 거울과 반지 ===== */
    let mf;
    await T.sceneCard(tr('거울과 반지'), () => {
      scene('room_v2'); tint(T, '#1F2A56', .35);
      put(T, mirror, X(300, 380), FL);
      put(T, belle, X(470, 500), FL, { look: 'worry', to: 'left' });
      put(T, beast, X(700, 650), FL, { look: 'ring', to: 'left' });
      put(T, tableS, X(880, 800), FL);
      mf = mirrorFace(T, mirror.x, FL - 200 * .6, 58);
      if (P) camSnap(520, 280, 1);
    }, belle.pos);
    sfx(T, 'sparkle'); mf.show();
    await say('어느 날, 벨은 거울로 집을 보았어요.');
    belle.wiggle(3, 500);
    await say('아버지가 아파요…');
    beast.hop(6, 500);
    await say('다녀와요. 하지만 일주일 뒤엔 꼭 돌아와요. 안 오면 나는 너무 슬플 거예요.');
    put(T, ring, beast.x - beast.w * .28, FL - beast.h * .48); fadeIn(ring);
    const rg = (async () => { await sleep(1500); const m = ring.move(belle.x + 22, FL - 100, 900); glow(ring, 1200); sparkleSfx(T); await m; })();
    await say('자기 전에 이 반지를 탁자에 놓으면, 아침에 여기로 돌아와요.');
    await rg;
    mf.hide();
    await say('꼭 돌아올게요, 약속해요.');
    hide(ring);
    await sleep(400);

    /* ===== 10. 집에서 늦어진 날들 ===== */
    await T.sceneCard(tr('집에서'), () => {
      scene('cottage');
      put(T, father, X(330, 400), FL, { look: 'well' });
      put(T, belle, X(520, 520), FL, { look: 'stand' });
      put(T, sisa, X(700, 640), FL + 4, { look: 'plead' });
      put(T, sisb, X(800, 720), FL + 8, { look: 'plead' });
      if (P) camSnap(520, 280, 1);
    }, belle.pos);
    await say('다음 날 아침, 벨은 집에 와 있었어요.');
    father.hop(10, 320);
    await say('네 덕분에 다 나았다.');
    await sisa.hop(10, 340); sisb.hop(10, 340);
    await say('조금만 더 있다 가. 응? 조금만 더.');
    belle.wiggle(3, 500);
    await say('그럴까…');
    {
      const sun = T.el('circle', { cx: 0, cy: 0, r: 28, fill: '#F2B366' }, T.bg);
      sun.animate([{ translate: '120px 170px' }, { translate: '500px 50px' }, { translate: '880px 170px' }], { duration: 1700, iterations: 3 });
      const nt = tint(T, '#1F2A56', 0);
      nt.animate([{ opacity: 0 }, { opacity: .35, offset: .5 }, { opacity: 0 }], { duration: 1700, iterations: 3 }).finished.then(() => { nt.setAttribute('opacity', .35); sun.remove(); }, () => {});
      const sp = say('해가 뜨고 지고, 일주일이 훌쩍 지났어요. 어느 밤, 벨은 꿈을 꾸었어요.');
      await sleep(5100);
      await Promise.all([fadeOut(T, father, 400), fadeOut(T, sisa, 400), fadeOut(T, sisb, 400), fadeOut(T, belle, 400)]);
      put(T, belle, X(520, 500), FL + 6, { look: 'sleep' }); fadeIn(belle);
      T.pop(belle.x - 60, FL - 150, tr('새근새근'));
      put(T, tableS, X(720, 610), FL); fadeIn(tableS);
      put(T, dream, belle.x + X(170, 110), FL - 250); fadeIn(dream, 600);
      put(T, beast, dream.x, dream.y - 45, { look: 'lie', s: .38 }); fadeIn(beast, 600);
      sfx(T, 'xylo_down', .5);
      await sp;
    }
    hide(dream); hide(beast);
    put(T, belle, X(560, 520), FL, { look: 'worry', to: 'right' }); fadeIn(belle);
    const sayB = say('야수님! 약속을 어겼어요. 돌아가야 해요.');
    await sayB;
    put(T, ring, belle.x + 22, FL - 100); fadeIn(ring);
    await ring.move(tableS.x, FL - 110 + 4, 900);
    sparkle(T, tableS.x, FL - 120, 60, 8);
    put(T, belle, X(520, 500), FL + 6, { look: 'sleep' }); fadeIn(belle);
    await say('벨은 반지를 탁자에 놓고 다시 잠이 들었어요.');
    await sleep(600);

    /* ===== 11. 샘가의 야수 (톡 2) ===== */
    await T.sceneCard(tr('샘가의 야수'), () => {
      scene('garden_v2');
      put(T, L.topiary, 70, FL);
      put(T, bush5, X(780, 700), FL - 10, { s: P ? .8 : 1 });
      put(T, beast, X(720, 640), FL, { look: 'lie' });
      put(T, spring, X(520, 460), FL + 10);
      put(T, belle, X(-120, -120), FL, { look: 'run', to: 'right' });
      put(T, L.rose, 985, 585, { to: 'right' });
      if (P) camSnap(500, 280, 1);
    }, spring.pos);
    follow(460, 1800);
    (async () => { AudioFX.sfx('step_grass'); await sleep(900); AudioFX.sfx('step_grass'); })();
    const run11 = belle.move(X(430, 400), FL, 2000, 'ease-out');
    await say('아침이 되자 벨은 궁전 정원에 있었어요. 야수는 샘가에 힘없이 누워 있었어요.');
    await run11;
    belle.look('kneel', 'right');
    await say('야수님, 일어나요!');
    bob(spring.pos);
    await T.ask('샘물을 톡 눌러 봐요.', () => T.tap(spring.pos, { prompt: '샘물을 톡 눌러 봐요.' }));
    drops(T, belle.x + 40, FL - 85, beast.x - beast.w * .3, FL - 60);
    sfx(T, 'splash', .5); T.pop(beast.x - 60, FL - 170, tr('똑똑!'));
    await sleep(700);
    beast.look('eyes'); glow(beast, 1000); sfx(T, 'sparkle');
    await say('벨… 돌아왔구나.');
    belle.hop(8, 300);
    await say('사랑해요, 야수님. 제 남편이 되어 주세요.');
    put(T, shine, beast.x - 40, FL - 10); T.world.insertBefore(shine.pos, beast.pos); fadeIn(shine, 500);
    shine.body.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(.9)' }], { duration: 1400, iterations: Infinity });
    if (!(AudioFX.sting && AudioFX.sting('magic'))) sparkleSfx(T);
    /* 변신 반짝 2배(두 겹 36) + 장미 꽃잎 10장 */
    sparkle(T, beast.x - 40, FL - 120, 160, 18); setTimeout(() => sparkle(T, beast.x - 40, FL - 120, 220, 18, true), 300);
    const s73 = say('그러자 반짝! 야수가 멋진 왕자님으로 변했어요.');
    await sleep(900);
    await T.anim(beast.pos, [{ opacity: 1 }, { opacity: 0 }], 500); hide(beast);
    put(T, prince, X(680, 600), FL, { look: 'stand' }); fadeIn(prince, 500); glow(prince, 1400); front(L.rose);
    rosePetals(T, prince.x, FL - 100, 10);
    await s73;
    /* 마법이 풀렸다: 같은 구도의 봄 정원으로 천천히 바뀐다 (눈 녹고 장미 만발). 눈 얹힌 토피어리는 함께 사라진다 */
    if (bgOK.garden_bloom_v2) {
      const bloom = T.el('image', { href: bgSrc('garden_bloom_v2'), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none', opacity: 0 }, T.bg);
      bloom.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2400, fill: 'forwards' }); sfx(T, 'sparkle');
      fadeOut(T, L.topiary, 2400);
    }
    put(T, belle, X(480, 450), FL, { look: 'joy' });
    prince.hop(8, 300);
    await say('고마워요, 벨. 겉모습만 보지 않고 내 마음을 봐 줬어요.');
    await say('요정이 건 마법이 이제 풀렸어요.');
    fadeOut(T, shine, 600);
    put(T, father, -100, FL, { look: 'well' }); put(T, sisa, -100, FL + 4, { look: 'joy' }); put(T, sisb, -100, FL + 8, { look: 'joy' });
    if (P) T.camTo(430, 280, 1, 1200);
    const fam = Promise.all([father.move(X(160, 300), FL, 1600), sisa.move(X(260, 350), FL + 4, 1800), sisb.move(X(340, 395), FL + 8, 2000)]);
    await say('아버지와 언니들도 달려왔어요.');
    await fam;
    if (P) T.camTo(520, 280, 1, 800);
    T.confetti(); sfx(T, 'tada', () => sparkleSfx(T));
    [belle, prince, father, sisa, sisb].forEach((a, i) => setTimeout(() => a.hop(16 + (i % 3) * 2, 460), i * 120));
    await say('모두 함께 궁전에서 행복하게 살았어요.');
    await say('겉모습이 아니라 마음을 봐요.');
    T.finale(); await sleep(1500);
    return '겉모습이 아니라 마음을 봐요.';
  }

  Tale.mount({ title: '미녀와 야수', subtitle: '겉모습이 아니라 마음을 봐요', read: true, run: T => run(Tale.api) });
})();
