/* 유니콘을 찾아서 — 창작 동화. 기획: tales/unicorn/PLAN.md (2026-10-22), 그림 작업표: tools/app/gen/jobs_unicorn.json
   조작 4번: 1장 꽃 선물 고르기(7색 중 하나, 고르기 1회 — 2026-10-22 블록 대신) · 2장 구름 톡 · 4장 가시 세기(톡 1회 → 목소리만 하나·둘·셋) · 10장 유니콘 인사 톡. 연타 없음, 줄거리 선택 없음. 교훈 대사 없음(끝 글자만).
   시선(PLAN 장면표): 1 아이→구름(앞모습 위 보기) · 2 양→아이 · 3 아이→양 · 4 사슴→아이 · 5 아이→사슴 뿔 · 6 말→간식 · 7 말→아이 · 8 아이→땅(왼쪽으로 걸음) · 9 아이 뒤돌아봄(유니콘 뒷모습) · 10 유니콘→아이(정면).
   그림이 보는 쪽(NAT): 양·사슴·말·유니콘(서기)은 왼쪽, 아이 걷기·슬픔·지침은 오른쪽, 아이 서기·안기는 앞모습, 아이 돌아봄은 뒷모습(고개를 오른쪽 어깨 너머로), 유니콘 뒷모습은 오른쪽 위로 걸어가는 뒷모습.
   그래서 아이는 왼쪽, 동물은 오른쪽에 두고 서로 마주 본다. 도망·이동하는 인물은 가는 쪽을 본다(뒤집기).
   시안(목업) 모드: 그림 파일이 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다. 파일(assets/v3w/uc_*.webp)이 생기면 코드를 고치지 않아도 그림으로 바뀐다
   (ASP 는 preload 가 실제 비율로 덮어쓴다; HT 는 같은 부위 폭으로 다시 잰다 — 아래 '그림 도착 뒤 맞출 것').
   세로(390x844): 보이는 폭이 약 260 이라 장면 전체를 PS 배로 줄여(원근) 한 화면에 담는다. 월드와 효과 층에 같은 변환을 건다(setView).
   2026-10-22 연출 재기획 그림 반영: 배경 uc_bg2_* · 다현이 공주 옷 uc_kid2_* · 컷 uc_cut2_* · 숨은 유니콘은 장소별 전신 자세 + 가리는 물체(z 순서, 반투명 없음)
   · 중간 소품 uc_mid_* · 앞 가림 조각 uc_fg_*. 옛 uc_hint_*·uc_prop_waterfall·uc_bg_*·uc_kid_*·uc_cut_* 는 쓰지 않는다(파일만 둠, 자리표시 함수에 이름이 남아 있음).
   z 순서: 배경 → 중간 소품 → 숨은 유니콘 → 가림 → 인물 → 앞 가림. 남은 확인: 사슴 가시 자리 THORN, 말 입·간식 자리 */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = {
    uc_kid_stand: 0.6017, uc_unicorn_stand: 1.0233, uc_sheep_cry: 1.0883, uc_deer_hurt: 1.1233,
    uc_horse_hungry: 1.3617, uc_prop_block_red: 1.0233, uc_prop_cloud: 2.2785, uc_prop_thorn: 0.4233,
    uc_prop_thorn_bush: 1.355, uc_prop_waterfall: 0.5067, uc_prop_rainbow: 1.7274, uc_prop_basket: 1.0367,
    uc_prop_horn_bands: 5.0, uc_kid_walk: 0.6067, uc_kid_sad: 0.5817, uc_kid_tired: 0.585,
    uc_kid_turn: 0.5717, uc_kid_hug: 0.66, uc_unicorn_back: 0.75, uc_hint_tail: 0.79,
    uc_hint_silhouette: 1.0083, uc_hint_tree_gap: 0.1883, uc_hint_spray_eye: 1.1167, uc_hint_horn_tip: 0.365,
    uc_sheep_jump: 1.2683, uc_sheep_happy: 1.09, uc_deer_relief: 0.7933, uc_horse_happy: 1.2433,
    uc_prop_block_yellow: 1.0233, uc_prop_block_blue: 1.015,
    /* 2026-10-22 연출 재기획 그림(PLAN §9): 다현이 공주 옷 · 숨는 자세 · 중간 소품 · 앞 가림 조각 */
    uc_kid2_stand: 0.565, uc_kid2_walk: 0.5983, uc_kid2_sad: 0.5517, uc_kid2_tired: 0.5517, uc_kid2_turn: 0.5417, uc_kid2_hug: 0.6633, uc_kid2_wave: 0.6567,
    uc_unicorn_hide_cloud: 1.18, uc_unicorn_peek_cloud_horn: 0.9083, uc_unicorn_peek_tree: 0.9633, uc_unicorn_peek_spray: 1.015, uc_unicorn_hide_bush: 1.7274,
    uc_mid_sheep_home: 1.3433, uc_mid_bush_corner: 1.3867, uc_mid_moon_halo: 1.085,
    uc_fg_grass_flowers: 1.3833, uc_fg_cloud_hill: 2.4862, uc_fg_cloud_bank: 0.7333, uc_fg_cloud_wisp: 2.8846, uc_fg_tree_trunk: 0.6183, uc_fg_pine_branch: 1.5,
    uc_fg_spray: 0.835, uc_fg_bare_branch: 1.5598, uc_fg_fern_night: 1.315,
    /* 1장 꽃 선물(꿀떡이 꽃 그림 재사용, 2026-10-22) */
    cf4_prop_flower_tulip_red: 0.4614, cf4_prop_flower_poppy_orange: 0.6114, cf4_prop_flower_tulip_yellow: 0.5243, cf4_prop_flower_cosmos_pink: 0.6257,
    cf4_prop_flower_wild_purple: 0.8686, cf4_prop_flower_bell_blue: 0.6114, cf4_prop_flower_daisy_white: 0.5643,
  };
  /* 높이(px, scale 1). 인물·동물은 같은 부위 폭으로 맞춘다: 아이 머리 폭 기준 / 양·사슴·말·유니콘 몸통 폭 기준.
     기획 비율: 유니콘 = 말 = 조랑말(아이 어깨 높이 이상, 서면 뿔까지 아이의 1.2배), 양은 유니콘 키의 절반(등이 아이 허리), 사슴은 유니콘과 비슷한 크기.
     그림이 오면 자세마다 같은 부위 폭을 재서 다시 맞춘다 (지금은 자리표시용 값) */
  const HT = {
    uc_kid_stand: 230, uc_kid_walk: 239, uc_kid_sad: 234, uc_kid_tired: 237, uc_kid_turn: 241, uc_kid_hug: 230,   /* 모자 챙 폭을 서기와 같게 잰 값(2026-10-22) */
    uc_unicorn_stand: 270, uc_unicorn_back: 272, uc_horse_hungry: 212, uc_horse_happy: 233,                       /* 말은 유니콘과 몸길이 같게(폭 286 : 277) */
    uc_sheep_cry: 148, uc_sheep_jump: 125, uc_sheep_happy: 148,                                                    /* 같은 털뭉치 폭, 서면 등이 아이 허리 */
    uc_deer_hurt: 221, uc_deer_relief: 250,
    uc_prop_block_red: 56, uc_prop_block_yellow: 56, uc_prop_block_blue: 56, uc_prop_cloud: 120, uc_prop_thorn: 54, uc_prop_thorn_bush: 100,
    uc_prop_waterfall: 300, uc_prop_rainbow: 200, uc_prop_basket: 66, uc_prop_horn_bands: 40,
    uc_hint_tail: 90, uc_hint_silhouette: 150, uc_hint_tree_gap: 260, uc_hint_spray_eye: 70, uc_hint_horn_tip: 110,
    /* 다현이(공주 옷, 2026-10-22): 머리카락 덩어리 폭(위 절반의 갈색 조각 폭)을 서기와 같게 잰 값. 돌아봄은 옆얼굴이라 머리카락 높이로 */
    uc_kid2_stand: 230, uc_kid2_walk: 237, uc_kid2_sad: 236, uc_kid2_tired: 240, uc_kid2_turn: 244, uc_kid2_hug: 230, uc_kid2_wave: 238,
    /* 숨는 자세(§8-3): 눈·얼굴 크기와 다리 길이를 서기(270)와 나란히 놓고 맞춘 값. 덤불 자세는 낮고 길게 엎드려 그림 높이가 작다 */
    uc_unicorn_peek_tree: 270, uc_unicorn_peek_spray: 268, uc_unicorn_peek_cloud_horn: 282, uc_unicorn_hide_cloud: 245, uc_unicorn_hide_bush: 160,
    uc_mid_sheep_home: 280, uc_mid_bush_corner: 260, uc_mid_moon_halo: 330,
    uc_fg_grass_flowers: 240, uc_fg_cloud_hill: 125, uc_fg_cloud_bank: 300, uc_fg_cloud_wisp: 92, uc_fg_tree_trunk: 560, uc_fg_pine_branch: 240,
    uc_fg_spray: 330, uc_fg_bare_branch: 260, uc_fg_fern_night: 180,
    /* 꽃: 아이 무릎 높이(아이 230 의 0.43). 일곱 송이 모두 같은 높이 */
    cf4_prop_flower_tulip_red: 100, cf4_prop_flower_poppy_orange: 100, cf4_prop_flower_tulip_yellow: 100, cf4_prop_flower_cosmos_pink: 100,
    cf4_prop_flower_wild_purple: 100, cf4_prop_flower_bell_blue: 100, cf4_prop_flower_daisy_white: 100,
  };
  /* 꽃 선물 7색(그림 → 색 이름). 매번 하나가 정답 */
  const FLOWER = { red: 'cf4_prop_flower_tulip_red', orange: 'cf4_prop_flower_poppy_orange', yellow: 'cf4_prop_flower_tulip_yellow', pink: 'cf4_prop_flower_cosmos_pink',
    purple: 'cf4_prop_flower_wild_purple', blue: 'cf4_prop_flower_bell_blue', white: 'cf4_prop_flower_daisy_white' };
  const COLOR_KO = { red: '빨간', orange: '주황', yellow: '노란', pink: '분홍', purple: '보라', blue: '파란', white: '하얀' };
  /* 그림이 보는 쪽 (PLAN §5-1 표; 실제 그림을 눈으로 본 뒤 고친다) */
  const NAT = {
    uc_kid_walk: 'right', uc_kid_sad: 'right', uc_kid_tired: 'right', uc_kid_turn: 'right', uc_kid_stand: 'front', uc_kid_hug: 'front',
    uc_unicorn_stand: 'left', uc_unicorn_back: 'right', uc_sheep_cry: 'left', uc_sheep_jump: 'left', uc_sheep_happy: 'left',
    uc_deer_hurt: 'left', uc_deer_relief: 'left', uc_horse_hungry: 'left', uc_horse_happy: 'left', uc_hint_silhouette: 'left',
    /* 2026-10-22 새 그림(눈으로 본 쪽): 다현이 걷기·돌아봄·지침(고개 숙여 오른쪽 아래를 봄, 발끝도 오른쪽 — 2026-10-22 다시 봄)은 오른쪽, 서기·슬픔·안기·손 흔들기는 앞모습. 숨는 자세 다섯은 모두 왼쪽 */
    uc_kid2_walk: 'right', uc_kid2_turn: 'right', uc_kid2_tired: 'right', uc_kid2_stand: 'front', uc_kid2_sad: 'front', uc_kid2_hug: 'front', uc_kid2_wave: 'front',
    uc_unicorn_hide_cloud: 'left', uc_unicorn_peek_cloud_horn: 'left', uc_unicorn_peek_tree: 'left', uc_unicorn_peek_spray: 'left', uc_unicorn_hide_bush: 'left',
  };
  const FL = 490;                       // 바닥(발끝 y)
  const BGS = ['uc_bg2_hill', 'uc_bg2_cloudland', 'uc_bg2_night_forest', 'uc_bg2_waterfall', 'uc_bg2_dusk_road', 'uc_bg2_moon_night'];   // 2026-10-22 화려한 다층 배경(옛 uc_bg_* 는 쓰지 않음)
  const CUTS = ['uc_cut2_sheep_jump', 'uc_cut2_thorns', 'uc_cut2_turn', 'uc_cut2_hug'];   // 공주 옷 컷
  const src = k => AS + k + '.webp';
  const FILL = { red: '#A93B32', orange: '#E8703A', yellow: '#D9A94E', pink: '#E79AB4', purple: '#7B4F8C', blue: '#3E7CB1', white: '#F4F6FA' };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  const artOK = {}, bgOK = {};          // preload 결과(그림이 실제로 있는지) — 없으면 자리표시
  const CREAM = '#F6ECD8', INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";
  const RAIN = ['#A93B32', '#E8703A', '#D9A94E', '#3F6B4F', '#3E7CB1', '#1F2A56', '#7B4F8C'];

  /* ================= 자리표시(그림이 없을 때) ================= */
  const NAMES = {
    uc_kid_stand: '아이 서기', uc_kid_walk: '아이 걷기', uc_kid_sad: '아이 아쉬움', uc_kid_tired: '아이 지침', uc_kid_turn: '아이 돌아봄', uc_kid_hug: '아이 안기',
    uc_unicorn_stand: '유니콘', uc_unicorn_back: '유니콘 뒷모습', uc_sheep_cry: '양 울음', uc_sheep_jump: '양 뛰기', uc_sheep_happy: '양 웃음',
    uc_deer_hurt: '사슴 아픔', uc_deer_relief: '사슴 웃음', uc_horse_hungry: '말 배고픔', uc_horse_happy: '말 웃음',
    uc_prop_block_red: '빨간 조각', uc_prop_block_yellow: '노란 조각', uc_prop_block_blue: '파란 조각', uc_prop_cloud: '구름 섬', uc_prop_thorn: '가시', uc_prop_thorn_bush: '가시 덤불',
    uc_prop_waterfall: '폭포', uc_prop_rainbow: '무지개', uc_prop_basket: '간식 바구니', uc_prop_horn_bands: '무지개 띠',
    uc_hint_tail: '(힌트) 꼬리', uc_hint_silhouette: '(힌트) 구름 실루엣', uc_hint_tree_gap: '(힌트) 나무 틈', uc_hint_spray_eye: '(힌트) 물보라 눈', uc_hint_horn_tip: '(힌트) 뿔 끝',
  };
  function placeholder(T, parent, f, w, h) {
    const g = T.el('g', {}, parent);
    const R = (x, y, ww, hh, rx, fill, extra = {}) => T.el('rect', { x, y, width: ww, height: hh, rx, fill, ...extra }, g);
    const C = (cx, cy, r, fill) => T.el('circle', { cx, cy, r, fill }, g);
    const E = (cx, cy, rx, ry, fill) => T.el('ellipse', { cx, cy, rx, ry, fill }, g);
    const Pth = (d, fill, extra = {}) => T.el('path', { d, fill, ...extra }, g);
    const label = (txt, cx, cy, fill = INK, fs) => {
      const t = T.el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': fs || Math.max(10, Math.min(16, h * .07)), 'font-weight': 700, fill, 'font-family': FONT, text: T.tr(txt) }, g);
      t.classList.add('phl'); t.dataset.cx = cx; t.dataset.cy = cy; t.setAttribute('transform', `translate(${cx},${cy})`);
    };
    const nm = NAMES[f] || f;
    const kid = /^uc_kid_(.+)$/.exec(f);
    if (kid) {
      const pose = kid[1], r = Math.min(h * .2, w * .22);
      R(w / 2 - r * 1.2, 2 * r - 4, r * 2.4, h * .38, 10, '#D9A94E');
      R(w / 2 - r * 1.1, 2 * r + h * .34, r * 1.0, h - (2 * r + h * .34), 4, '#6B4A32'); R(w / 2 + r * .1, 2 * r + h * .34, r * 1.0, h - (2 * r + h * .34), 4, '#6B4A32');
      if (pose === 'hug') [-1, 1].forEach(s => R(w / 2 + s * (w * .3) - 5, 2 * r - 2, 10, h * .3, 5, '#F3D9B8', { transform: `rotate(${s * 70} ${w / 2 + s * r * 1.1} ${2 * r})` }));
      C(w / 2, r + 2, r, '#F3D9B8'); Pth(`M${w / 2 - r} ${r + 2} Q${w / 2} ${-r * .5} ${w / 2 + r} ${r + 2}Z`, '#6B4A32');
      const dx = pose === 'stand' || pose === 'hug' || pose === 'turn' ? 0 : r * .25;
      [-1, 1].forEach(s => C(w / 2 + s * r * .35 + dx, r + 4, 2.6, INK));
      label(nm, w / 2, 2 * r + h * .2, INK, Math.max(10, Math.min(14, w / 4)));
      return g;
    }
    if (/^uc_(unicorn|horse|deer|sheep)_/.test(f)) {
      const who = f.split('_')[1], lying = f === 'uc_deer_hurt', back = f === 'uc_unicorn_back';
      const col = { unicorn: '#F4F6FA', horse: '#8A5A38', deer: '#6B4A32', sheep: '#F4F6FA' }[who];
      const bh = h * (lying ? .5 : who === 'sheep' ? .5 : .38), by = h - bh - (lying ? 0 : h * .22);
      E(w * .55, by + bh / 2, w * .34, bh / 2, col);
      if (!lying) [.3, .42, .62, .74].forEach(k => R(w * k, by + bh * .6, Math.max(4, w * .035), h - by - bh * .6, 2, who === 'sheep' ? '#6B4A32' : INK));
      const hx = back ? w * .6 : w * .2, hy = lying ? h * .45 : who === 'sheep' ? by : h * .22;
      C(hx, hy, Math.max(12, h * (who === 'sheep' ? .14 : .1)), who === 'sheep' ? CREAM : col);
      if (who === 'unicorn') { Pth(`M${hx - 4} ${hy - h * .1} L${hx + 4} ${hy - h * .1} L${hx} ${hy - h * .26}Z`, CREAM); RAIN.forEach((c, i) => R(hx + 8 + i * 5, hy - h * .08, 5, h * .26, 1, c)); }
      if (who === 'deer') { Pth(`M${hx + 4} ${hy - h * .08} l-6 ${-h * .1} m6 ${h * .1} l8 ${-h * .1}`, 'none', { stroke: '#6B4A32', 'stroke-width': 3 }); }
      if (who === 'horse') C(hx + 16, hy - 6, 6, '#3E7CB1');
      if (!back) C(hx - 5, hy - 2, 2.4, INK);
      label(nm, w * .55, by + bh / 2 + 4, who === 'horse' || who === 'deer' ? CREAM : INK, Math.max(10, Math.min(15, h * .06)));
      return g;
    }
    switch (f) {
      case 'uc_prop_block_red': case 'uc_prop_block_yellow': case 'uc_prop_block_blue':
        R(0, h * .12, w, h * .88, 5, f.endsWith('red') ? '#A93B32' : f.endsWith('yellow') ? '#D9A94E' : '#3E7CB1'); R(0, 0, w, h * .14, 3, 'rgba(46,36,28,.25)'); label(nm, w / 2, h * .66, CREAM, 10); break;
      case 'uc_prop_cloud': E(w / 2, h * .62, w * .48, h * .36, '#F4F6FA'); E(w * .35, h * .4, w * .2, h * .26, '#F4F6FA'); E(w * .62, h * .34, w * .24, h * .3, '#F4F6FA'); label(nm, w / 2, h * .7, INK, 13); break;
      case 'uc_prop_thorn': Pth(`M${w * .15} ${h} L${w / 2} 0 L${w * .85} ${h}Z`, '#6B4A32'); break;
      case 'uc_prop_thorn_bush': E(w / 2, h * .6, w * .46, h * .38, '#3F6B4F'); E(w * .32, h * .5, w * .26, h * .3, '#3F6B4F'); label(nm, w / 2, h * .66, CREAM, 12); break;
      case 'uc_prop_waterfall': [0, 1, 2].forEach(i => R(w * (.1 + i * .3), 0, w * .22, h * (.9 - i * .06), 4, '#F4F6FA')); label(nm, w / 2, h * .5, INK, 13); break;
      case 'uc_prop_rainbow': RAIN.forEach((c, i) => Pth(`M${w * .04 + i * 10} ${h} A${w * .46 - i * 10} ${h * .96 - i * 10} 0 0 1 ${w * .96 - i * 10} ${h}`, 'none', { stroke: c, 'stroke-width': 10 })); break;
      case 'uc_prop_basket': Pth(`M${w * .1} ${h * .5} L${w * .9} ${h * .5} L${w * .78} ${h} L${w * .22} ${h}Z`, '#D9A94E'); [.3, .5, .7].forEach(k => C(w * k, h * .42, w * .09, k === .5 ? '#A93B32' : '#E8703A')); label(nm, w / 2, h * .78, INK, 10); break;
      case 'uc_prop_horn_bands': RAIN.forEach((c, i) => R(w * (.04 + i * .135), h * .2, w * .1, h * .6, 3, c)); break;
      case 'uc_hint_tail': RAIN.forEach((c, i) => R(w * (.08 + i * .12), h * .1, w * .09, h * .8, 2, c)); break;
      case 'uc_hint_silhouette': E(w * .5, h * .55, w * .4, h * .28, CREAM); C(w * .14, h * .3, h * .12, CREAM); Pth(`M${w * .1} ${h * .2} L${w * .14} 0 L${w * .18} ${h * .2}Z`, CREAM); break;
      case 'uc_hint_tree_gap': R(w * .3, 0, w * .4, h, 2, '#F4F6FA'); RAIN.slice(0, 3).forEach((c, i) => R(w * (.34 + i * .1), 0, w * .08, h * .2, 1, c)); break;
      case 'uc_hint_spray_eye': [[.3, .6, .18], [.6, .5, .22], [.5, .8, .14]].forEach(([x, y, r]) => C(w * x, h * y, w * r, '#F4F6FA')); C(w * .55, h * .5, w * .13, '#1F2A56'); C(w * .59, h * .46, w * .035, '#F4F6FA'); break;
      case 'uc_hint_horn_tip': Pth(`M${w * .3} ${h} L${w * .5} ${h * .15} L${w * .7} ${h}Z`, CREAM); Pth(`M${w * .5} 0 L${w * .56} ${h * .1} L${w * .66} ${h * .14} L${w * .56} ${h * .2} L${w * .5} ${h * .3} L${w * .44} ${h * .2} L${w * .34} ${h * .14} L${w * .44} ${h * .1}Z`, '#D9A94E'); break;
      default:
        if (/^cf4_prop_flower_/.test(f)) { const c = Object.keys(FLOWER).find(k => FLOWER[k] === f); R(w / 2 - 3, h * .4, 6, h * .6, 3, '#3F6B4F'); C(w / 2, h * .28, Math.min(w, h) * .28, FILL[c] || '#E8703A'); break; }
        R(0, 0, w, h, Math.min(w, h) * .2, '#D9A94E'); label(nm, w / 2, h / 2, INK, 13);
    }
    return g;
  }
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    const g = placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
    return g.parentNode;
  }
  const BGPH = {
    uc_bg_hill: { sky: '#F6ECD8', gnd: '#3F6B4F', name: '집 앞 언덕', shapes: () => [['circle', { cx: 150, cy: 120, r: 46, fill: '#D9A94E' }], ['rect', { x: 100, y: 330, width: 120, height: 90, fill: '#F6ECD8' }], ['ellipse', { cx: 780, cy: 130, rx: 90, ry: 34, fill: '#F4F6FA' }]] },
    uc_bg_cloudland: { sky: '#F6ECD8', gnd: '#F4F6FA', name: '구름 나라', shapes: () => [['circle', { cx: 150, cy: 100, r: 40, fill: '#D9A94E' }], ['ellipse', { cx: 520, cy: 160, rx: 80, ry: 30, fill: '#F4F6FA' }], ['ellipse', { cx: 840, cy: 230, rx: 70, ry: 26, fill: '#F4F6FA' }]] },
    uc_bg_night_forest: { sky: '#1F2A56', gnd: '#3F6B4F', name: '별빛 숲', shapes: () => [...[80, 240, 640, 820].map(x => ['rect', { x, y: 190, width: 36, height: 230, fill: '#3F6B4F' }]), ...[160, 520, 900].map(x => ['circle', { cx: x, cy: 380, r: 8, fill: '#F2B366' }])] },
    uc_bg_waterfall: { sky: '#F6ECD8', gnd: '#3F6B4F', name: '무지개 폭포', shapes: () => [['rect', { x: 640, y: 40, width: 380, height: 380, fill: '#7A8B74' }], ['ellipse', { cx: 840, cy: 470, rx: 150, ry: 36, fill: '#F4F6FA' }]] },
    uc_bg_dusk_road: { sky: '#F2B366', gnd: '#6B4A32', name: '빈 길', shapes: () => [['rect', { x: -40, y: 330, width: 1080, height: 80, fill: '#1F2A56' }], ['rect', { x: 80, y: 200, width: 24, height: 220, fill: '#2E241C' }]] },
    uc_bg_moon_night: { sky: '#1F2A56', gnd: '#6B4A32', name: '달밤', shapes: () => [['circle', { cx: 820, cy: 120, r: 60, fill: '#F6ECD8' }], ...[60, 200, 360, 560, 900].map(x => ['circle', { cx: x, cy: 380, r: 40, fill: '#3F6B4F' }])] },
  };
  function bgImage(T, key) {
    if (bgOK[key]) return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const d = BGPH[key] || BGPH[key.replace('bg2_', 'bg_')], g = T.el('g', {}, T.bg);
    T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: d.sky }, g);
    T.el('rect', { x: BGBOX.x, y: 412, width: BGBOX.w, height: 200, fill: d.gnd }, g);
    d.shapes().forEach(([t, a]) => T.el(t, a, g));
    T.el('text', { x: 500, y: 52, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: '#6B4A32', 'font-family': FONT, opacity: .85, text: '(그림 자리) 배경: ' + d.name }, g);
    return g;
  }

  /* ================= 배우·소품 ================= */
  /* poses = { 이름: [그림, 높이] }. a.look(자세, 방향) — 그림이 보는 쪽이 다르면 뒤집는다(앞모습은 뒤집지 않는다). 기본 방향은 오른쪽 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, [f, h]]) => {
        const w = h * (ASP[f] || 1), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
      });
    });
    a.want = 'right';
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
  const prop = (T, f, h) => mk(T, { a: [f, h || HT[f]] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to || 'right'); else a.turn(to || 'right');
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = ''; a.body.style.opacity = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 600) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  const wiggleEl = (T, n) => T.anim(n, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360);
  const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
  const sfx = (name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });
  const hopLoop = async (a, ms, h = 4) => { const end = Date.now() + ms; while (Date.now() < end - 400) await a.hop(h, 460); };
  const drive = (a, x, y, ms, ease = 'linear', h = 4) => Promise.all([a.move(x, y, ms, ease), hopLoop(a, ms, h)]);
  const stepSfx = (vol = .22, every = 700) => { const one = () => sfx('step_grass', vol); one(); const id = setInterval(one, every); return () => clearInterval(id); };
  /* 누르는 자리 넓히기: 화면 크기 w×h 투명 사각을 그림 뒤에 깐다 (세로에서는 PS 배 줄어드는 만큼 키운다) */
  function hitBox(T, a, w = 100, h = 100) {
    const lw = w / a.scale, lh = h / a.scale;
    const r = T.el('rect', { x: -lw / 2, y: -lh, width: lw, height: lh, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.body); a.hit = a.pos; a.hitRect = r;
    return a;
  }
  const unhit = a => { if (a.hitRect) { a.hitRect.remove(); a.hitRect = null; } a.hit = null; };

  /* 무지개 폭포 배경(uc_bg2_waterfall)에서 잰 자리(월드 좌표): 물줄기 x 800~925·위 35·떨어지는 자리 y≈355, 호수 수면 위 가장자리 y≈430(물보라 밑) */
  const FALL = { x: 862, l: 803, r: 922, top: 36, base: 356, lake: 430 };
  function fallsAnim(T) {
    const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, T.world);
    const id = 'ucFall' + Math.random().toString(36).slice(2, 7);
    const cp = T.el('clipPath', { id }, g); T.el('rect', { x: FALL.l, y: FALL.top, width: FALL.r - FALL.l, height: FALL.base - FALL.top }, cp);
    const strips = T.el('g', { 'clip-path': `url(#${id})` }, g);
    const span = FALL.base - FALL.top + 120;
    for (let i = 0; i < 7; i++) {                       // 물줄기 띠: 세로로 긴 종이 조각이 아래로 흘러내린다(한 조각 한 색)
      const x = FALL.l + 8 + i * 16, w = 7 + (i % 3) * 2;
      for (let j = 0; j < 2; j++) {
        const r = T.el('rect', { x, y: FALL.top - 90, width: w, height: 60 + (i % 2) * 24, rx: w / 2, fill: (i + j) % 2 ? '#F4F6FA' : '#D6ECF7' }, strips);
        const dur = 1500 + (i % 4) * 180;
        r.animate([{ transform: 'translateY(0px)' }, { transform: `translateY(${span}px)` }], { duration: dur, iterations: Infinity, delay: -(j * dur / 2 + i * 137) % dur });
      }
    }
    for (let i = 0; i < 9; i++) {                       // 물보라 조각 퐁퐁: 떨어지는 자리에서 동그란 종이가 튀어 올랐다 사라진다
      const x = FALL.l - 30 + i * 22, c = T.el('circle', { cx: x, cy: FALL.base + 30, r: 6 + (i % 3) * 3, fill: i % 2 ? '#F4F6FA' : '#CFE8F6' }, g);
      c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'center';
      const dx = (i - 4) * 7, dur = 1100 + (i % 3) * 200;
      c.animate([{ transform: 'translate(0px,0px) scale(.3)', opacity: 0 }, { transform: `translate(${dx * .5}px,-26px) scale(1)`, opacity: 1, offset: .45 },
        { transform: `translate(${dx}px,-6px) scale(.8)`, opacity: 0 }], { duration: dur, iterations: Infinity, delay: -(i * 173) % dur, easing: 'ease-out' });
    }
    return g;
  }

  const S = {
    L0: "언덕 위에 다현이가 서 있어요. 하늘을 올려다보고 있어요.",
    L1: "진짜 유니콘을 만나고 싶어요.",
    /* 1장 꽃 선물(색별): F_ASK_색 · F_OK_색, 주워 넣기 F_PICK. 마지막 장면 F_END_색. 오답 목소리는 extra retry_색 */
    ...Object.fromEntries(Object.entries(COLOR_KO).flatMap(([c, k]) => [
      ['F_ASK_' + c, `유니콘에게 줄 ${k} 꽃을 찾아 볼까요? 톡, 눌러 봐요.`],
      ['F_OK_' + c, `맞았어요! ${k} 꽃이에요.`],
      ['F_END_' + c, `다현이는 바구니 속 ${k} 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.`]])),
    F_PICK: "다현이는 바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
    L3: "다현이는 구름 나라로 올라가 보기로 했어요.",
    L4: "구름 섬에 양 한 마리가 혼자 앉아 있어요.",
    L5: "훌쩍… 집에 어떻게 가지…",
    L6: "양이 앉은 구름을 톡, 눌러 봐요.",
    L7: "양이 폴짝 뛰어내렸어요!",
    L8: "같이 가자!",
    L9: "다현이와 양은 손을 잡고 구름 길을 걸었어요.",
    L10: "고마워! 이제 집이 보여!",
    L11: "양은 집으로 돌아갔어요. 유니콘은 아직 보이지 않아요.",
    L12: "밤이 되자, 다현이는 별빛 숲으로 들어갔어요.",
    L13: "아야, 아야…",
    L14: "사슴 다리에 가시가 박혔어요. 가시를 톡, 눌러 봐요. 살살 빼 줄게요.",
    L15: "가시 세 개를 모두 뺐어요!",
    L16: "고마워! 이제 하나도 안 아파.",
    L17: "다현이는 사슴의 작은 뿔을 가만히 보았어요.",
    L18: "유니콘은… 아니구나.",
    L19: "폭포 위에 무지개가 떠 있어요. 말 한 마리가 서 있어요.",
    L20: "꼬르륵…",
    L21: "말은 다현이의 간식 바구니를 보고 있어요.",
    L22: "자, 같이 먹자.",
    L23: "말은 간식을 냠냠 맛있게 먹었어요.",
    L24: "고마워! 정말 맛있었어.",
    L25: "너도… 유니콘은 아니구나.",
    L26: "해가 지고, 길은 텅 비었어요.",
    L27: "진짜 유니콘은… 없나 봐.",
    L28: "다현이는 땅만 보며 터벅터벅 걸었어요.",
    L29: "그때, 뒤에서 작은 소리가 났어요.",
    L30: "다현이가 천천히 뒤를 돌아보았어요.",
    L31: "달빛 아래, 하얀 유니콘이 서 있었어요.",
    L32: "나는 계속 여기 있었어.",
    L33: "네가 친절한 걸 다 보고 있었어.",
    L34: "유니콘…!",
    L35: "유니콘을 톡, 눌러서 인사해요.",
    L36: "다현이는 유니콘을 꼭 안았어요.",
    H1: "다음 날 아침, 다현이는 유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
    H2: "고마워, 정말 예뻐!",
  };

  async function run(T) {
    const { sleep, camSnap, tr } = T;
    T.cardSpeed(.6);
    /* 쉼(7분 이상으로 맞추는 값): 대사 사이 GAP, 장면 끝 SCENE_END, 조용한 걸음 */
    const GAP = 3200, SCENE_END = 7500;
    const say = async text => { await T.say(text); await sleep(GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };
    const voWait = async k => { const p = vo(k); if (p) await Promise.race([p, sleep(4000)]); };
    const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
    const X = (l, p) => (P ? p : l);
    let VX = { lx: 500, ps: 1 };
    /* 장면 시작: 세로에서는 월드·효과 층을 ps 배로 줄여 landscape 좌표 lx 가 화면 가운데에 오게 한다 */
    const setView = (lx, ps = .75) => {
      T.fx.style.pointerEvents = 'none';
      VX = { lx, ps };
      const t = P ? `translate(500 ${FL}) scale(${ps}) translate(${-lx} ${-FL})` : '';
      [T.world, T.fx].forEach(g => (t ? g.setAttribute('transform', t) : g.removeAttribute('transform')));
      camSnap(500, 280, 1);
    };
    const scene = (key, lx, ps) => { T.clear(); bgImage(T, key); setView(lx, ps); };
    const follow = (x, ms = 800) => (P ? T.camTo(500 + (x - VX.lx) * VX.ps, 280, 1, ms) : Promise.resolve());
    const H = n => (P ? n / VX.ps : n);               // 화면 크기를 지키는 누르는 자리
    AudioFX.preloadSfx(['paper_down', 'paper_up', 'swish', 'whoosh', 'knock', 'sparkle', 'tada', 'step_grass', 'pop', 'cushion', 'ding']);
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    CUTS.forEach(k => T.preload(src(k)));
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);   // 진짜 4초(검증 화면 건너뛰기의 빠른 sleep 에 지지 않게 — 그림이 다 받아진 뒤 장면을 그린다)
    const pz = (who, ps, pre = who) => Object.fromEntries(ps.map(p => [p, ['uc_' + pre + '_' + p, HT['uc_' + pre + '_' + p]]]));
    const kid = mk(T, pz('kid', ['stand', 'walk', 'sad', 'tired', 'turn', 'hug', 'wave'], 'kid2'));   // 다현이(공주 옷, PLAN §13)
    /* 유니콘: 서기·뒷모습 + 장소별 숨는 자세 다섯(PLAN §8-2). 가리는 물체는 z 순서로 덮는다(반투명 없음) */
    const uni = mk(T, { ...pz('unicorn', ['stand', 'back']), ...pz('unicorn', ['hide_cloud', 'peek_cloud_horn', 'peek_tree', 'peek_spray', 'hide_bush']) });
    const sheep = mk(T, pz('sheep', ['cry', 'jump', 'happy']));
    const deer = mk(T, pz('deer', ['hurt', 'relief']));
    const horse = mk(T, pz('horse', ['hungry', 'happy']));
    const flowers = Object.fromEntries(Object.entries(FLOWER).map(([c, f]) => [c, prop(T, f)]));   // 1장 꽃밭(누름: 고르기 동안만)
    const cloud = prop(T, 'uc_prop_cloud'), bush = prop(T, 'uc_prop_thorn_bush'), rainbow = prop(T, 'uc_prop_rainbow');
    const basket = prop(T, 'uc_prop_basket'), bands = prop(T, 'uc_prop_horn_bands');
    const thorns = [0, 1, 2].map(() => prop(T, 'uc_prop_thorn'));
    /* 중간 소품(P1)·앞 가림 조각(P2b·P4): 누름을 받지 않는다 */
    const deco = k => { const a = prop(T, 'uc_' + k); a.pos.style.pointerEvents = 'none'; return a; };
    const home = deco('mid_sheep_home'), cbush = deco('mid_bush_corner'), halo = deco('mid_moon_halo');
    const FG = Object.fromEntries(['grass_flowers', 'cloud_hill', 'cloud_bank', 'cloud_wisp', 'tree_trunk', 'pine_branch', 'spray', 'bare_branch', 'fern_night'].map(k => [k, deco('fg_' + k)]));
    const ALL = [kid, uni, sheep, deer, horse, ...Object.values(flowers), cloud, bush, rainbow, basket, bands, ...thorns, home, cbush, halo, ...Object.values(FG)];
    ALL.forEach(hide);
    T.director(null);
    /* 사슴 다리의 가시 자리(사슴 가운데 x·바닥 y 기준 오프셋, 누운 사슴 그림 도착 뒤 다시 잰다) */
    const THORN = [[-52, -42], [-72, -35], [-92, -28]];
    const POPY = a => FL - a.h - 30;      // 말풍선 글자: 머리 위쪽 (인물 얼굴을 가리지 않는다)
    const stepTo = async (a, x, ms, h = 4) => { const st = stepSfx(.2, 600); await drive(a, x, FL, ms, 'linear', h); st(); };

    /* ================= 읽어 주기 (docs/READ_MODE.md): read_script_el.json 의 동사 → 아래 놀이판 연출을 감싼 얇은 함수 =================
       set 은 놀이판의 그 장면 자리·자세·가림 조각을 그대로 놓는다(같은 배경이 두 번 나오면 나온 순서로 구분: hill1·hill2 …).
       그래서 set 직후(T.readInstant()) enter 의 at·look·fg 동사는 놓여 있는 것을 건드리지 않는다. 세로 화면 x 는 놀이판 값(PMAP)으로 바꾼다. */
    const inst = () => T.readInstant();
    const rGift = flowers.red, RCLOUD_TOP = FL - 170, RMANE = () => [-uni.w * .14, -uni.h * .64];
    const SHORT = { uc_bg2_hill: 'hill', uc_bg2_cloudland: 'cloudland', uc_bg2_night_forest: 'forest', uc_bg2_waterfall: 'waterfall', uc_bg2_dusk_road: 'dusk', uc_bg2_moon_night: 'moon' };
    const PMAP = {
      hill1: { 520: 400 }, cloudland1: { 470: 400 }, cloudland2: { 560: 420, 660: 520, 700: 560, 790: 640, 880: 700 }, forest1: { 400: 455 },
      waterfall2: { 310: 290 }, dusk1: { 430: 380 }, moon1: { 500: 490, 430: 440, 830: 690 }, moon2: { 585: 705 },
    };
    let rTag = '', rTok = 0, rPicked = false; const rSeen = {};
    const px = x => (P && PMAP[rTag] && PMAP[rTag][x] != null ? PMAP[rTag][x] : x);
    const num = s => { s = String(s).trim(); const m = /^FL([+-]\d+)?$/.exec(s); return m ? FL + (m[1] ? +m[1] : 0) : +s; };
    const aft = (a, fn) => { const p = a._mv; return p ? p.then(fn) : fn(); };
    const rwalk = (a, x, y, ms, ease = 'linear') => {   /* 걷기는 기다리지 않는다(말하는 동안 걷는다). 같은 배우의 다음 동사가 끝나기를 기다린다 */
      if (inst()) { a.place(x, y); return null; }
      const st = stepSfx(.2, 600);
      const p = (async () => { await (ease === 'linear' ? drive(a, x, y, ms, 'linear', 4) : a.move(x, y, ms, ease)); st(); })().finally(() => { if (a._mv === p) a._mv = null; });
      a._mv = p; return null;
    };
    const rPick = async () => {   /* 떨어진 꽃을 주워 바구니에 쏙 */
      kid.hop(8, 300); sfx('pop', .4);
      await rGift.move(basket.x, FL - 150, 600, 'ease-out');
      rGift.setScale(.7); T.world.appendChild(basket.pos);
      await rGift.move(basket.x + 4, FL - 22, 450, 'ease-in');
      T.pop(basket.x, FL - 120, tr('쏙!')); sfx('paper_down', .4);
    };
    const forestL = (kidLook, kidX) => {
      scene('uc_bg2_night_forest', 590, .65);
      put(T, uni, X(30, 260), FL - 10, { look: 'peek_tree', to: 'right' });
      put(T, FG.tree_trunk, X(70, 300), FL + 40);
      put(T, bush, X(840, 745), FL - 6, { look: 'a' });
      put(T, deer, X(690, 650), FL, { look: kidLook === 'walk' ? 'hurt' : 'relief', to: 'left' });
      put(T, kid, kidX, FL, { look: kidLook, to: 'right' });
      put(T, FG.pine_branch, X(900, 790), 210); put(T, FG.fern_night, X(70, 290), 600);
    };
    const fallsL = (kidX, withBasket) => {
      scene('uc_bg2_waterfall', 420, .55);
      fallsAnim(T);
      put(T, rainbow, 690, 400, { look: 'a' });
      put(T, uni, FALL.x + 40, FALL.lake + 2, { look: 'peek_spray', to: 'left', s: .75 });
      put(T, FG.spray, FALL.x, FALL.lake + 10, { s: .85 });
      put(T, horse, X(470, 450), FL, { look: 'hungry', to: 'left' });
      put(T, kid, kidX, FL, { look: 'walk', to: 'right' });
      put(T, basket, kid.x + 85, FL, { look: 'a' }); if (!withBasket) hide(basket);
      put(T, FG.grass_flowers, X(30, 60), 600);
    };
    const LAYOUT = {
      hill1() {
        scene('uc_bg2_hill', X(400, 430));
        put(T, uni, X(800, 535), 188, { look: 'hide_cloud', to: 'left', s: .6 });
        put(T, FG.cloud_hill, X(790, 525), 195);
        put(T, kid, X(300, 260), FL, { look: 'stand' });
        put(T, basket, kid.x + X(85, 80), FL, { look: 'a' });
        put(T, rGift, X(470, 420), FL + 6, { look: 'a' });   /* 바람에 떨어진 꽃 (대본에 동사가 없어 첫 kid:hop 뒤 저절로 주워 넣는다) */
        put(T, FG.grass_flowers, X(110, 90), 600);
      },
      cloudland1() {
        scene('uc_bg2_cloudland', 470, .7);
        put(T, uni, X(1060, 860), FL + 30, { look: 'peek_cloud_horn', to: 'left' });
        put(T, FG.cloud_bank, X(985, 785), FL + 60);
        put(T, cloud, X(620, 550), FL - 50, { look: 'a' });
        put(T, sheep, cloud.x, RCLOUD_TOP + 18, { look: 'cry', to: 'left' });
        put(T, kid, X(280, 345), FL, { look: 'walk', to: 'right' });
        put(T, FG.cloud_wisp, X(110, 250), 600);
      },
      cloudland2() {
        scene('uc_bg2_cloudland', 480, .7);
        put(T, uni, X(935, 755), FL + 2, { look: 'peek_cloud_horn', to: 'left' });
        put(T, home, X(880, 700), FL + 6);
        put(T, kid, X(150, 330), FL, { look: 'walk', to: 'right' });
        put(T, sheep, kid.x + 150, FL, { look: 'happy', to: 'right' });
        put(T, FG.cloud_wisp, X(110, 250), 600);
      },
      forest1() { forestL('walk', X(200, 360)); },
      forest2() { forestL('sad', X(400, 455)); },
      waterfall1() { fallsL(X(60, 150), false); },
      waterfall2() { fallsL(X(250, 250), true); },
      dusk1() {
        scene('uc_bg2_dusk_road', 500);
        put(T, FG.bare_branch, X(150, 330), 236);
        put(T, kid, X(760, 640), FL, { look: 'tired', to: 'left' });
      },
      moon1() {
        scene('uc_bg2_moon_night', 540);
        put(T, uni, X(745, 655), FL - 5, { look: 'hide_bush', to: 'right' });
        put(T, cbush, X(930, 760), FL + 20);
        put(T, kid, X(640, 600), FL, { look: 'tired', to: 'left' });
        put(T, FG.fern_night, X(70, 400), 600);
      },
      moon2() {
        scene('uc_bg2_moon_night', 500, 1);
        if (P) camSnap(790, 280, .6);
        put(T, halo, 878, 86 + HT.uc_mid_moon_halo / 2); T.bg.appendChild(halo.pos); halo.pos.style.opacity = 0;
        put(T, kid, X(420, 650), FL, { look: 'stand' });
        put(T, uni, X(720, 840), FL, { look: 'stand', to: 'left' }); uni.pos.style.opacity = 0;
      },
      hill2() {
        scene('uc_bg2_hill', X(400, 450));
        put(T, kid, X(360, 300), FL, { look: 'walk', to: 'right' });
        put(T, uni, X(640, 580), FL, { look: 'stand', to: 'left' });
        put(T, FG.grass_flowers, X(110, 230), 600);
        const tok = rTok;   /* 대본에 동사가 없어: 첫 줄을 읽는 동안 기다렸다가 바구니 속 빨간 꽃을 갈기에 꽂아 준다 */
        setTimeout(async () => {
          if (tok !== rTok || rTag !== 'hill2') return;
          kid.look('stand'); sfx('paper_up', .4);
          put(T, rGift, kid.x + 40, FL - 100, { look: 'a', s: .55 }); fadeIn(rGift, 300);
          const m = RMANE();
          await rGift.move(uni.x + m[0], FL + m[1], 1200, 'ease-in-out');
          if (tok !== rTok) return;
          glow(uni, 1200); sparkleSfx(T); T.pop(uni.x + m[0], FL + m[1] - 70, tr('반짝!'), '#D9A94E');
        }, 4200);
      },
    };
    const ACTS = { kid, uni, sheep, deer, horse };
    const actorVerb = name => (verb, a1, a2) => {
      const a = ACTS[name];
      if (verb === 'look') { if (inst()) return; return aft(a, () => a.look(a1, a2)); }
      if (verb === 'at') { if (inst()) return; const [x, y] = String(a1).split(',').map(num); return aft(a, () => put(T, a, px(x), isNaN(y) ? FL : y)); }
      if (verb === 'turn') return aft(a, () => a.turn(a1));
      if (verb === 'walk') { const [x, y, ms] = String(a1).split(',').map(num); return name === 'uni' ? rwalk(a, px(x), y, ms, 'ease-in-out') : rwalk(a, px(x), FL, y); }
      if (verb === 'hop') {
        if (inst()) return;
        if (name === 'kid' && rTag === 'hill1' && !rPicked) { rPicked = true; setTimeout(() => { if (rTag === 'hill1') rPick(); }, 2300); }
        if (name === 'horse' && a1) return aft(a, async () => { for (let i = 0; i < +a1; i++) await a.hop(8, 520); });
        return aft(a, () => a.hop(name === 'kid' ? 10 : 8, 380));
      }
      if (verb === 'hide') return aft(a, () => hide(a));
      if (verb === 'front') { if (name === 'kid') sfx('paper_up', .5); T.world.appendChild(a.pos); if (name === 'uni') T.world.appendChild(FG.fern_night.pos); return; }
      if (verb === 'glow') return aft(a, () => glow(a, 1500));
      if (verb === 'fade') { a.pos.style.opacity = ''; fadeIn(a, 1400); return; }
      if (verb === 'wiggle') return aft(a, () => a.wiggle(3, 300));
      if (verb === 'jump') {   /* 구름에서 포물선으로 뛰어내림 (놀이판 그대로) */
        const land = kid.x + 150, sx = a.x, sy = a.y;
        sfx('whoosh', .4);
        const p = (async () => { await a.move((sx + land) / 2 + 30, sy - 40, 250, 'ease-out'); await a.move(land, FL, 650, 'ease-in'); })().finally(() => { if (a._mv === p) a._mv = null; });
        a._mv = p; return;
      }
      if (verb === 'behind') return aft(a, () => T.world.insertBefore(a.pos, home.pos));
      console.warn('[read] 모르는 동사', name, verb);
    };
    const R = {
      set(key) {
        const k = SHORT[key]; rSeen[k] = (rSeen[k] || 0) + 1; rTag = k + rSeen[k]; rTok++;
        ALL.forEach(a => { hide(a); a._mv = null; });
        (LAYOUT[rTag] || (() => console.warn('[read] 장면 모름', rTag)))();
      },
      kid: actorVerb('kid'), uni: actorVerb('uni'), sheep: actorVerb('sheep'), deer: actorVerb('deer'), horse: actorVerb('horse'),
      cam() { /* 카메라는 set 이 정한다 (cam:wide = 장면 기본, cam:moon = moon2 레이아웃) */ },
      follow(a) { if (inst()) return; const [x, ms] = String(a).split(',').map(Number); follow(px(x), ms || 800); },
      cloud() {}, bush() {}, rainbow() {}, home() {}, cbush() {},
      halo(verb) { if (verb === 'fade') { halo.pos.style.opacity = ''; fadeIn(halo, 2400); } },
      basket(verb, a1) {
        if (verb === 'show') { put(T, basket, kid.x + 85, FL, { look: 'a' }); fadeIn(basket, 400); T.world.appendChild(FG.grass_flowers.pos); return; }
        if (verb === 'move') { const [x, ms] = String(a1).split(',').map(Number); sfx('paper_up', .5); return basket.move(px(x), FL, ms || 1000, 'ease-in-out'); }
        if (verb === 'hide') return fadeOut(T, basket, 600);
      },
      async thorns(verb) {
        if (verb === 'show') {
          thorns.forEach((t, i) => { put(T, t, deer.x + THORN[i][0], FL + THORN[i][1], { look: 'a' }); fadeIn(t, 500); });
          return;
        }
        for (let i = 0; i < 3; i++) {   /* 쏙, 쏙, 쏙 (놀이판 가시 빼기, 숫자 목소리 없이) */
          deer.wiggle(3, 300);
          const t = thorns[i], tx = t.x, ty = t.y;
          sfx('pop', .5);
          await T.anim(t.pos, [{ transform: `translate(${tx}px,${ty}px)`, opacity: 1 }, { transform: `translate(${tx - 30}px,${ty - 80}px)`, opacity: 0 }], 650);
          hide(t); await sleep(400);
        }
      },
      fg(name, a1) { if (a1 === 'wiggle' && FG[name]) return wiggleEl(T, FG[name].pos); },
      cut(n) { return T.cutImage([{ src: src(n), hold: n.endsWith('hug') ? 4200 : 3600 }]); },
      pop(spec) {
        const parts = String(spec).split(','), first = parts[0].trim();
        if (ACTS[first]) {
          const a = ACTS[first], txt = parts.slice(1).join(',').trim();
          if (first === 'sheep') return T.pop(a.x, POPY(a) - 90, tr(txt), txt === '훌쩍…' ? '#3E7CB1' : undefined);
          if (first === 'horse') return T.pop(a.x - (txt === '냠냠' ? 10 : 20), POPY(a) - (txt === '냠냠' ? 50 : 40), tr(txt));
          if (first === 'uni') return T.pop(a.x + 40, FL - HT.uc_unicorn_stand - 100, tr(txt), '#D9A94E');
          return T.pop(a.x, POPY(a), tr(txt));
        }
        const x = rTag === 'moon1' ? X(830, 560) : +first;
        T.pop(x, num(parts[1]), tr(parts.slice(2).join(',').trim()));
      },
      vo(k) { vo(k); },
      fx(n) {
        if (n === 'boing') return AudioFX.sfx('boing', .5);
        if (n === 'sparkle') return sparkleSfx(T);
        if (n === 'tada') return sfx('tada', .4) || sparkleSfx(T);
        if (n === 'paper_up') return sfx('paper_up', .5);
        if (n === 'pop') return sfx('pop', .5);
        if (n === 'whoosh') return sfx('whoosh', .4);
        return sfx(n);
      },
      confetti() { T.confetti(); sfx('tada') || sparkleSfx(T); },
    };
    if (T.reading()) return T.readPlay(R);

    /* ===== 1. 설렘 (배움 놀이: 꽃 선물 색 고르기 — 첫 조작) — 멀리서 넓게 ===== */
    const ANS = Object.keys(FLOWER)[Math.floor(Math.random() * 7)];   // 오늘 유니콘에게 줄 꽃 색(7색 중 하나)
    scene('uc_bg2_hill', X(400, 430));
    /* 하늘의 구름 덩이(배경 구름 띠 아래, 지평선 위 y≈200): 다현이가 올려다보는 쪽. 유니콘은 그 구름 속에 숨어 꼬리 끝만 보인다 */
    put(T, uni, X(800, 535), 188, { look: 'hide_cloud', to: 'left', s: .6 });    // 먼 하늘(원근으로만 작게): 꼬리 끝 7줄만 구름 위로
    put(T, FG.cloud_hill, X(790, 525), 195);
    put(T, kid, X(300, 260), FL, { look: 'stand' });
    put(T, basket, kid.x + X(85, 80), FL, { look: 'a' });
    /* 꽃: 정답 + 다른 색. 가로는 한 줄 5송이(누르는 자리 100×120 = 화면 137×164px), 세로는 2줄 4송이(누르는 자리 128 = 화면 약 82px) */
    const others = Object.keys(FLOWER).filter(c => c !== ANS).sort(() => Math.random() - .5);
    const picks = [ANS, ...others.slice(0, P ? 3 : 4)].sort(() => Math.random() - .5);
    const spots = P ? [[455, FL + 12], [585, FL + 12], [520, FL - 116], [650, FL - 116]] : [470, 575, 680, 785, 890].map(x => [x, FL + 6]);
    picks.forEach((c, i) => { put(T, flowers[c], spots[i][0], spots[i][1], { look: 'a' }); hitBox(T, flowers[c], P ? 128 : 100, P ? 128 : 120); });
    put(T, FG.grass_flowers, X(110, 90), 600);   // 세로: 왼쪽 끝으로 비켜 다현이·바구니가 묻히지 않게
    await T.curtain(true);
    await say(S.L0);
    await sleep(300);
    await say(S.L1);
    picks.forEach(c => bob(flowers[c].pos));
    await T.ask(S['F_ASK_' + ANS], () => T.choose(picks.map(c => ({
      el: flowers[c].hit, ok: c === ANS,
      onWrong: async () => { await wiggleEl(T, flowers[c].hit); await voWait('retry_' + ANS); },
    })), { prompt: S['F_ASK_' + ANS] }));
    picks.forEach(c => unhit(flowers[c]));
    const gift = flowers[ANS];
    glow(gift, 1200); sparkleSfx(T); T.pop(gift.x, gift.y - 140, tr('반짝!'));
    await say(S['F_OK_' + ANS]);
    /* 떨어진 꽃을 주워 바구니에 쏙: 꽃이 아이 앞을 지나 바구니로 날아가 반쯤 잠긴다(바구니가 꽃 줄기를 가린다) */
    kid.hop(8, 300); sfx('pop', .4);
    const pickSay = say(S.F_PICK);
    await gift.move(basket.x, FL - 150, 600, 'ease-out');
    gift.setScale(.7); T.world.appendChild(basket.pos);
    await gift.move(basket.x + 4, FL - 22, 450, 'ease-in');
    T.pop(basket.x, FL - 120, tr('쏙!')); sfx('paper_down', .4);
    await pickSay;
    kid.hop(10, 320);
    await say(S.L3);
    await sleep(SCENE_END);

    /* ===== 2. 구름 나라 (재미 톡 1: 구름) — 아이 눈높이, 가까이 ===== */
    const CLOUD_TOP = FL - 170;               // 양 구름 윗면(바닥보다 170 위, 떠 있음). 밑면은 FL-50
    await T.sceneCard(tr('구름 나라'), () => {
      scene('uc_bg2_cloudland', 470, .7);
      put(T, uni, X(1060, 860), FL + 30, { look: 'peek_cloud_horn', to: 'left' });   // 구름 둑(오른쪽이 높다) 위로 뿔·귀만, 발굽은 둑 밑에
      put(T, FG.cloud_bank, X(985, 785), FL + 60);
      put(T, cloud, X(620, 550), FL - 50, { look: 'a' });
      put(T, sheep, cloud.x, CLOUD_TOP + 18, { look: 'cry', to: 'left' });
      put(T, kid, X(280, 345), FL, { look: 'walk', to: 'right' });
      put(T, FG.cloud_wisp, X(110, 250), 600);
    }, kid.pos);
    await say(S.L4);
    T.pop(sheep.x, POPY(sheep) - 90, tr('훌쩍…'), '#3E7CB1');
    await say(S.L5);
    hitBox(T, cloud, H(P ? 180 : 260), H(P ? 140 : 160));
    bob(cloud.pos);
    await T.ask(S.L6, () => T.tap(cloud.hit, { prompt: S.L6 }));
    unhit(cloud); AudioFX.sfx('cushion', .7);
    await T.cutImage([{ src: src('uc_cut2_sheep_jump'), hold: 3600 }]);
    sheep.look('jump', 'left'); sfx('whoosh', .4);
    const land = kid.x + 150, sx = sheep.x, sy = sheep.y;     // 포물선: 위로 40(0.25초) → 아래로 210(0.65초)
    const sayJump = say(S.L7);
    await sheep.move((sx + land) / 2 + 30, sy - 40, 250, 'ease-out');
    await sheep.move(land, FL, 650, 'ease-in');
    sheep.look('happy', 'left'); sheep.hop(14, 380); setTimeout(() => sheep.hop(14, 380), 420); T.pop(land, FL - 200, tr('폴짝!'));
    kid.look('walk', 'right'); kid.hop(10, 320);
    await sayJump;
    await sleep(SCENE_END);

    /* ===== 3. 길 찾기 — 옆에서 트래킹, 양의 집에 닿아 헤어진다 ===== */
    await T.sceneCard(tr('길 찾기'), () => {
      scene('uc_bg2_cloudland', 480, .7);
      put(T, uni, X(935, 755), FL + 2, { look: 'peek_cloud_horn', to: 'left' });  // 양의 집 지붕 왼쪽 위로 뿔·귀만
      put(T, home, X(880, 700), FL + 6);
      put(T, kid, X(150, 330), FL, { look: 'walk', to: 'right' });
      put(T, sheep, kid.x + 150, FL, { look: 'happy', to: 'left' });
      put(T, FG.cloud_wisp, X(110, 250), 600);
    }, kid.pos);
    await say(S.L8);
    kid.hop(10, 300);
    sheep.turn('right');                                  // 둘 다 가는 쪽(오른쪽)을 본다 — 양이 앞서고 손을 잡는다
    const endX = X(700, 560), stop3 = stepSfx(.2, 600);
    const l9 = say(S.L9);
    follow(endX - 40, 2500);
    await Promise.all([drive(kid, endX - 140, FL, 2500, 'linear', 5), drive(sheep, endX, FL, 2500, 'linear', 5)]);
    stop3(); await l9;
    sheep.turn('left'); sheep.hop(18, 400); sparkleSfx(T);
    await say(S.L10);
    sheep.look('happy', 'right'); await sheep.move(X(790, 640), FL, 600, 'ease-out');
    sheep.turn('left'); sheep.hop(10, 320);                // 집 앞에서 아이 쪽을 보고 인사
    kid.look('wave'); kid.hop(10, 320);
    const l11 = say(S.L11);
    await sleep(900);
    sheep.turn('right'); T.world.insertBefore(sheep.pos, home.pos);   // 집 뒤로 들어간다(사라지는 대신 z 로 숨김)
    await sheep.move(X(880, 700), FL, 800, 'ease-in'); hide(sheep);
    await l11;
    await sleep(SCENE_END);

    /* ===== 4. 별빛 숲 (배움 놀이 2: 세기 — 톡 1회, 목소리만) — 낮게, 둥치 사이로 ===== */
    const forest = (kidLook, kidX) => {
      scene('uc_bg2_night_forest', 590, .65);
      put(T, uni, X(30, 260), FL - 10, { look: 'peek_tree', to: 'right' });   // 둥치 뒤에서 얼굴 반쪽·눈 하나
      put(T, FG.tree_trunk, X(70, 300), FL + 40);
      put(T, bush, X(840, 745), FL - 6, { look: 'a' });
      put(T, deer, X(690, 650), FL, { look: kidLook === 'walk' ? 'hurt' : 'relief', to: 'left' });
      put(T, kid, kidX, FL, { look: kidLook, to: 'right' });
      put(T, FG.pine_branch, X(900, 790), 210); put(T, FG.fern_night, X(70, 290), 600);
    };
    await T.sceneCard(tr('별빛 숲'), () => forest('walk', X(200, 360)), kid.pos);
    const l12 = say(S.L12);
    await stepTo(kid, X(400, 455), 1200);
    await l12;
    await say(S.L13);
    deer.hop(4, 500);
    thorns.forEach((t, i) => { put(T, t, deer.x + THORN[i][0], FL + THORN[i][1], { look: 'a' }); fadeIn(t, 500); });
    hitBox(T, thorns[0], H(P ? 100 : 110), H(P ? 90 : 100));
    bob(thorns[0].pos);
    await T.ask(S.L14, () => T.tap(thorns[0].hit, { prompt: S.L14 }));
    unhit(thorns[0]);
    await T.cutImage([{ src: src('uc_cut2_thorns'), hold: 3600 }]);
    for (let i = 0; i < 3; i++) {                          // 하나 · 둘 · 셋 (목소리만, 화면 숫자 글자 없음)
      deer.wiggle(3, 300);
      const t = thorns[i], tx = t.x, ty = t.y;
      sfx('pop', .5);
      const v = voWait('n' + (i + 1));
      await T.anim(t.pos, [{ transform: `translate(${tx}px,${ty}px)`, opacity: 1 }, { transform: `translate(${tx - 30}px,${ty - 80}px)`, opacity: 0 }], 650);
      hide(t); await v; await sleep(500);
    }
    sparkleSfx(T);
    await say(S.L15);
    deer.look('relief', 'left'); deer.hop(10, 400);
    await say(S.L16);
    await sleep(SCENE_END);

    /* ===== 5. 사슴의 뿔 · 아쉬움 — 같은 세트, 가까이 ===== */
    await T.sceneCard(tr('사슴의 뿔'), () => forest('sad', X(400, 455)), kid.pos);
    await say(S.L17);
    await sleep(2500);
    await say(S.L18);
    await sleep(SCENE_END);

    /* ===== 6. 무지개 폭포 — 옆에서 넓게. 폭포는 배경 안(PLAN §5) ===== */
    const falls = (kidX, withBasket) => {
      scene('uc_bg2_waterfall', 420, .55);
      fallsAnim(T);                                                          // 배경 폭포 물줄기 위로 흐르는 종이 띠 + 떨어지는 자리 물보라 퐁퐁
      put(T, rainbow, 690, 400, { look: 'a' });
      put(T, uni, FALL.x + 40, FALL.lake + 2, { look: 'peek_spray', to: 'left', s: .75 });   // 폭포 떨어지는 자리 뒤(호수 건너편이라 원근으로 작게): 물보라 틈으로 갈기·뿔·눈
      put(T, FG.spray, FALL.x, FALL.lake + 10, { s: .85 });                   // 물보라 밑동이 호수 수면(폭포 떨어지는 자리)에 닿게
      put(T, horse, X(470, 450), FL, { look: 'hungry', to: 'left' });
      put(T, kid, kidX, FL, { look: 'walk', to: 'right' });
      put(T, basket, kid.x + 85, FL, { look: 'a' }); if (!withBasket) basket.pos.style.display = 'none';
      put(T, FG.grass_flowers, X(30, 60), 600);   // 아이(250)와 겹치지 않게 왼쪽 모서리
    };
    await T.sceneCard(tr('무지개 폭포'), () => falls(X(60, 150), false), kid.pos);
    await stepTo(kid, X(250, 250), 800);
    put(T, basket, kid.x + 85, FL, { look: 'a' }); fadeIn(basket, 400); T.world.appendChild(FG.grass_flowers.pos);
    const l19 = say(S.L19);
    follow(840, 1600); setTimeout(() => follow(420, 1600), 3200);
    await l19;
    horse.hop(6, 500); T.pop(horse.x - 20, POPY(horse) - 40, tr('꼬르륵…'));
    await say(S.L20);
    await say(S.L21);
    await sleep(SCENE_END);

    /* ===== 7. 간식 나누기 — 같은 세트 ===== */
    await T.sceneCard(tr('간식 나누기'), () => falls(X(250, 250), true), kid.pos);
    kid.hop(10, 320);
    await say(S.L22);
    sfx('paper_up', .5);
    await basket.move(horse.x - 160, FL, 1000, 'ease-in-out');
    horse.look('happy', 'left');
    const l23 = say(S.L23);
    T.pop(horse.x - 10, POPY(horse) - 50, tr('냠냠')); sfx('pop', .4);
    for (let i = 0; i < 3; i++) await horse.hop(8, 520);
    fadeOut(T, basket, 600);
    await l23;
    await say(S.L24);
    kid.look('sad', 'right');
    await say(S.L25);
    follow(840, 1400);
    await sleep(4500);
    follow(420, 1200);
    await sleep(SCENE_END);

    /* ===== 8. 빈 길 (조용히) — 멀리서 넓게, 여백. 유니콘 없음 ===== */
    await T.sceneCard(tr('빈 길'), () => {
      scene('uc_bg2_dusk_road', 500);
      put(T, FG.bare_branch, X(150, 330), 236);
      put(T, kid, X(760, 640), FL, { look: 'tired', to: 'left' });     // 아이는 땅을 보며 왼쪽으로 걷는다 (뒤돌아보지 않음)
    }, kid.pos);
    await sleep(5000);
    await say(S.L26);
    await sleep(1500);
    await say(S.L27);
    await sleep(2000);
    const l28 = say(S.L28), stop8 = stepSfx(.15, 1000);
    follow(X(430, 380), 3000);
    await drive(kid, X(430, 380), FL, 3000, 'linear', 2);       // 지친 걸음 110px/초(최대 3초)
    stop8(); await l28;
    await sleep(SCENE_END + 1500);

    /* ===== 9. 사박사박 — 아이 눈높이, 길모퉁이 ===== */
    await T.sceneCard(tr('사박사박'), () => {
      scene('uc_bg2_moon_night', 540);
      put(T, uni, X(745, 655), FL - 5, { look: 'hide_bush', to: 'right' });   // 머리는 덤불 속, 엉덩이·꼬리 7색만
      put(T, cbush, X(930, 760), FL + 20);
      put(T, kid, X(640, 600), FL, { look: 'tired', to: 'left' });
      put(T, FG.fern_night, X(70, 400), 600);
    }, kid.pos);
    const l29 = say(S.L29), stop9 = stepSfx(.15, 1000);
    follow(X(430, 440), 1000);
    await drive(kid, X(500, 490), FL, 1000, 'linear', 2);
    stop9(); await l29;
    await sleep(600);
    for (let i = 0; i < 3; i++) { vo('steps'); T.pop(X(830, 560), FL - 345, tr('사박, 사박')); await sleep(3600); }
    await T.cutImage([{ src: src('uc_cut2_turn'), hold: 3600 }]);
    kid.look('turn', 'right'); kid.hop(6, 400);                       // 뒤를 돌아본다 (고개를 오른쪽 어깨 너머로)
    const l30 = say(S.L30);
    uni.look('back', 'right'); T.world.appendChild(uni.pos); T.world.appendChild(FG.fern_night.pos);   // 덤불에서 걸어 나온다
    await uni.move(X(830, 690), FL - 30, 1200, 'ease-in-out'); glow(uni, 1800);
    await l30;
    await sleep(4500);
    await sleep(SCENE_END);

    /* ===== 10. 진짜 유니콘 (인사 톡) — 가까이, 둘만 ===== */
    await T.sceneCard(tr('진짜 유니콘'), () => {
      scene('uc_bg2_moon_night', 500, 1);                              // 세로도 월드 확대 없이 카메라를 달 쪽으로 옮겨 달·고리·두 주인공이 함께 보이게 한다
      if (P) camSnap(790, 280, .6);                                    // 세로: 보이는 폭 약 433(x 575~1000) — 배경 달(878)과 무리가 화면 안
      put(T, halo, 878, 86 + HT.uc_mid_moon_halo / 2); T.bg.appendChild(halo.pos);   // 배경 층에 붙여 배경 달 둘레에
      halo.pos.style.opacity = 0;   // 달 둘레 7색 무리
      put(T, kid, X(420, 650), FL, { look: 'stand' });
      put(T, uni, X(720, 840), FL, { look: 'stand', to: 'left' }); uni.pos.style.opacity = 0;
    }, uni.pos);
    uni.pos.style.opacity = ''; fadeIn(uni, 1400); glow(uni, 1500);
    halo.pos.style.opacity = ''; fadeIn(halo, 2400);
    await sleep(2500);
    await say(S.L31);
    await say(S.L32);
    await say(S.L33);
    kid.hop(18, 420); sfx('tada', .4);
    await say(S.L34);
    hitBox(T, uni, P ? 190 / .6 : 260, P ? 230 / .6 : 300);   // 세로는 카메라 .6 배라 월드 크기를 키운다
    bob(uni.pos);
    await T.ask(S.L35, () => T.tap(uni.hit, { prompt: S.L35 }));
    unhit(uni);
    glow(uni, 1400); sparkleSfx(T);
    put(T, bands, uni.x - 95, FL - HT.uc_unicorn_stand - 34, { look: 'a' }); fadeIn(bands, 500);
    T.pop(uni.x + 40, FL - HT.uc_unicorn_stand - 100, tr('반짝!'), '#D9A94E');
    await sleep(3000);
    await T.anim(bands.pos, [{ opacity: 1 }, { opacity: 0 }], 600); hide(bands);
    await T.cutImage([{ src: src('uc_cut2_hug'), hold: 4200 }]);
    kid.look('hug'); T.world.appendChild(kid.pos);
    sfx('paper_up', .5);
    await kid.move(uni.x - 135, FL, 700, 'ease-out');
    T.confetti(); sfx('tada') || sparkleSfx(T);
    for (let i = 0; i < 2; i++) await Promise.all([kid.hop(22, 480), uni.hop(14, 480)]);
    await say(S.L36);
    await sleep(SCENE_END);

    /* ===== 11. 집으로 — 1장과 같은 집 앞 언덕. 바구니 속 꽃을 유니콘 갈기에 꽂아 준다 ===== */
    await T.sceneCard(tr('집으로'), () => {
      scene('uc_bg2_hill', X(400, 450));
      put(T, kid, X(360, 300), FL, { look: 'walk', to: 'right' });
      put(T, uni, X(640, 580), FL, { look: 'stand', to: 'left' });          // 다현이를 마주 본다
      put(T, FG.grass_flowers, X(110, 230), 600);
    }, kid.pos);
    await say(S.H1);
    /* 갈기 자리(유니콘 서기 그림, 왼쪽을 봄): 그림 폭의 36%·높이의 36% — 꽃 밑동을 여기에 */
    const MANE = [-uni.w * .14, -uni.h * .64];
    put(T, gift, kid.x + 40, FL - 100, { look: 'a', s: .55 }); fadeIn(gift, 300);
    kid.look('stand'); sfx('paper_up', .4);
    const endSay = say(S['F_END_' + ANS]);
    await gift.move(uni.x + MANE[0], FL + MANE[1], 1200, 'ease-in-out');
    glow(uni, 1200); sparkleSfx(T); T.pop(uni.x + MANE[0], FL + MANE[1] - 70, tr('반짝!'), '#D9A94E');
    await endSay;
    uni.hop(10, 420);
    await say(S.H2);
    kid.look('wave'); kid.hop(12, 360);
    await sleep(3000);
    T.finale(); await sleep(1500);
    return '너도 누군가에게 친절하면, 너만의 유니콘을 만날 수 있어.';
  }

  Tale.mount({ title: '유니콘을 찾아서', subtitle: '', read: true, run: T => run(Tale.api) });
})();
