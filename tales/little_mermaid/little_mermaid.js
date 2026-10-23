/* 인어공주 — 안데르센 원작. 기획 PLAN.md, 제작 명세 SPEC.md (11장, 2026-10-20 확정)
   바다 밑 궁전(뜨고 가라앉기 놀이) → 열다섯 살, 바다 위로(불꽃 톡) → 폭풍, 왕자 구하기 → 모래밭 → 할머니의 이야기 →
   바다 마녀(가마솥 톡) → 다리가 생겼어요 → 왕자와 함께(바다·땅 가르기 놀이) → 왕자의 결혼 → 언니들의 단검(칼집째, 칼날 없음) → 바닷바람(인사 톡).
   톡 3번(불꽃·가마솥·인사) + 배움 놀이 2번. 연타 없음. 줄거리를 바꾸는 선택 없음. 디즈니 요소(노래, 마법 요정, 키스) 없음.
   6번 가마솥 뒤부터 10번 끝까지 인어공주는 말하지 않는다(내레이터가 마음을 말하고, 7번 '…' 구름 + doop 소리만).
   교훈: 사랑하는 마음으로 양보하면, 그 마음은 좋은 일이 되어 남아요.
   그림: assets/v3w/mer_*.webp (목록 tools/app/gen/jobs_little_mermaid.json, 후처리 tools/app/gen/post_tale.py little_mermaid).
   화려하게 다시 그리기(VISUAL_PLAN.md, 2026-10-22): 배경 bg5 5장 + 층 소품 mer_layer_*(누름 없음, 후처리 post_v2.py), 불꽃 한 번 톡에 7발.
   ★ 목업: 그림 파일(webp)이 아직 없으면 종이 조각 자리표시(PH)와 평평한 종이 배경이 대신 그려진다. 그림이 생기면 코드 변경 없이 바뀐다
   (미리 받아 보고 있으면 쓰고, 그림의 실제 가로세로 비율은 파일에서 읽어 ASP 를 덮어쓴다). */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 비율 (ASP.txt 와 같다). 그림이 있으면 파일의 실제 비율로 한 번 더 덮어쓴다 */
  const ASP = {
    mer_swim: 0.6683, mer_garden: 0.7233, mer_peek: 1.0333, mer_hide: 0.9033, mer_hold: 1.9956, mer_worry: 0.6217, mer_resolve: 0.6217,
    mer_sit_tail: 0.7367, mer_stand: 0.6667, mer_wobble_a: 0.7883, mer_wobble_b: 0.7467, mer_dance: 0.8233, mer_sad: 0.6283, mer_shake: 0.6717,
    mer_throw: 0.9117, mer_bubble: 0.9983, sisters_long: 2.1845, sisters_short: 3.1915, king: 0.6167, granny_talk: 0.68, granny_hand: 0.74,
    prince_stand: 0.38, prince_float: 3.125, prince_lie: 2.8125, prince_wake: 0.9367, prince_dance: 0.54, prince_sleep: 0.76, witch_stand: 0.7133,
    witch_hand: 0.7983, lady_stand: 0.445, lady_wed: 0.4467, lady_sleep: 0.7667, gull: 1.1417, fish_a: 1.49, fish_b: 1.4867, fish_c: 1.4867,
    prop_ship_lantern: 1.6453, prop_ship_tilt: 1.6334, prop_ship_flower: 1.6514, prop_fw_a: 1.01, prop_fw_b: 0.91, prop_fw_c: 1.0033, prop_stone: 1.435,
    prop_wood: 2.0785, prop_anchor: 0.8733, prop_bottle_cork: 0.5317, prop_cauldron_dim: 1.0183, prop_cauldron_glow: 0.89, prop_potion_empty: 0.6117,
    prop_potion_full: 0.6117, prop_shell_pearl: 0.9633, item_shell: 1.085, item_starfish: 1.08, item_butterfly: 1.3583, item_bird: 1.115,
    item_rabbit: 0.6883, item_flower: 0.705, item_tree: 0.8483, item_dog: 0.9333, prop_dagger: 5.2326, prop_glint: 0.9217, prop_ripple: 3.5019,
    prop_bubble: 1, prop_wind: 2.6866, prop_rock: 1.5254, prop_cloud_dark: 1.9694, prop_wave: 8.7379, prop_wave_big: 3.6145, prop_sun: 1.4917,
    /* 화려하게 다시 그리기(VISUAL_PLAN.md, 2026-10-22): 중간 층·앞 가림 층 소품·불꽃 2종 (tools/app/gen/post_v2.py 로 오림) */
    layer_coral_front_a: 1.5789, layer_coral_front_b: 1.5789, layer_kelp_front: 0.395, layer_fish_school: 1.7544, layer_anemone: 1.1067,
    layer_jelly_a: 0.6783, layer_jelly_b: 0.68, layer_fw_d: 0.9917, layer_fw_e: 1.015, layer_rosebush: 1.395, layer_topiary: 0.4417,
    layer_flower_arch: 0.7483, layer_bunting: 3.75, layer_petal: 0.7 };
  /* 사람·인어 자세별 높이(px). 머리 지름이 모두 ≈80px (SPEC §3) */
  const HT = { mer_swim: 205, mer_garden: 168, mer_peek: 140, mer_hide: 145, mer_hold: 130, mer_worry: 205, mer_resolve: 205, mer_sit_tail: 190,
    mer_stand: 205, mer_wobble_a: 205, mer_wobble_b: 205, mer_dance: 205, mer_sad: 205, mer_shake: 205, mer_throw: 210, mer_bubble: 260,
    sisters_long: 240, sisters_short: 130, king: 228, granny_talk: 230, granny_hand: 230,
    prince_stand: 200, prince_float: 85, prince_lie: 82, prince_wake: 140, prince_dance: 200, prince_sleep: 130,
    witch_stand: 235, witch_hand: 235, lady_stand: 208, lady_wed: 208, lady_sleep: 150, gull: 60, fish_a: 36, fish_b: 36, fish_c: 36 };
  /* 그림이 보는 쪽 ('left' | 'right' | 'front') */
  const NAT = { mer_swim: 'left', mer_garden: 'left', mer_peek: 'left', mer_hide: 'right', mer_hold: 'left', mer_worry: 'left', mer_resolve: 'left',
    mer_sit_tail: 'left', mer_stand: 'left', mer_wobble_a: 'left', mer_wobble_b: 'left', mer_dance: 'right', mer_sad: 'left', mer_shake: 'left',
    mer_throw: 'left', mer_bubble: 'left', sisters_long: 'front', sisters_short: 'front', king: 'front', granny_talk: 'left', granny_hand: 'left',
    prince_stand: 'front', prince_float: 'left', prince_lie: 'left', prince_wake: 'right', prince_dance: 'left', prince_sleep: 'left',
    witch_stand: 'left', witch_hand: 'left', lady_stand: 'front', lady_wed: 'front', lady_sleep: 'right', gull: 'left',
    fish_a: 'left', fish_b: 'left', fish_c: 'left', prop_ship_lantern: 'left', prop_ship_tilt: 'left', prop_ship_flower: 'left' };
  const FL = 528;             /* 땅 바닥 (계단·정원·갑판·모래) */
  const WATER = 300;          /* 2·3·10번 수면선 */
  const WATER11 = 372;        /* 11번 수면선 */
  const BGS = ['palace', 'night_sea', 'beach', 'witch', 'steps', 'garden', 'deck', 'dawn_sea', 'morning_sea'];
  const bgSrc = k => AS + (BG5[k] ? 'mer_bg5_' : BG3[k] ? 'mer_bg3_' : 'mer_bg2_') + k + (LB[k] ? '_lb' : '') + '.webp', artSrc = k => AS + 'mer_' + k + '.webp';
  const BG3 = { steps: 1 };   /* 비례를 다시 그린 배경(mer_bg3_*) */
  const BG5 = { palace: 1, night_sea: 1, witch: 1, garden: 1, deck: 1 };
  const LB = { night_sea: 1 };   /* 빛 상자판(mer_bg5_night_sea_lb, VISUAL_PLAN 재기획 2 B, 2026-10-24): 같은 수면선·달 자리 */   /* 화려하게 다시 그린 다층 배경(mer_bg5_*, 같은 구도: VISUAL_PLAN) */
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 }; /* 1600×902 배경이 무대 1000×560 을 덮게 */
  /* 장면별 배경 상자: 마녀 동굴은 조개 문이 작게 그려져 2.2배 확대(문 중심 x=680, 문 밑 y≈470) */
  const BGBOXES = { witch: { x: -1221, y: -594, w: 1080 * 2.2, h: 1080 * 992 / 1760 * 2.2 } };
  const bgBox = k => BGBOXES[k] || BGBOX;
  const hOf = f => HT[f] || 200;
  const artOK = {}, bgOK = {};  /* 파일이 있으면 true — 없으면 자리표시 */

  /* ================= 자리표시 (그림이 없을 때) =================
     종이 조각을 겹친 단순 도형 + 작은 한국어 이름표. 사람은 머리 지름 80, 눈은 점 둘. 소품에는 얼굴이 없다. */
  const SK = '#F2CDA8', INK = '#2E241C', CR = '#F6ECD8';
  const LBL = {
    mer_swim: '인어공주 헤엄', mer_garden: '인어공주 정원', mer_peek: '인어공주 수면 위', mer_hide: '인어공주 바위 뒤', mer_hold: '인어공주 안고 헤엄',
    mer_worry: '인어공주 걱정', mer_resolve: '인어공주 결심', mer_sit_tail: '인어공주 앉음', mer_stand: '인어공주 다리', mer_wobble_a: '인어공주 흔들(왼)',
    mer_wobble_b: '인어공주 흔들(오)', mer_dance: '인어공주 춤', mer_sad: '인어공주 슬픔', mer_shake: '인어공주 고개 젓기', mer_throw: '인어공주 던짐',
    mer_bubble: '인어공주 거품', sisters_long: '언니들 (긴 머리)', sisters_short: '언니들 (짧은 머리)', king: '바다 왕', granny_talk: '할머니', granny_hand: '할머니 손짓',
    prince_stand: '왕자', prince_float: '왕자 물에 뜸', prince_lie: '왕자 누움', prince_wake: '왕자 깨어남', prince_dance: '왕자 춤', prince_sleep: '왕자 잠듦',
    witch_stand: '마녀', witch_hand: '마녀 손짓', lady_stand: '이웃 나라 공주', lady_wed: '공주 꽃다발', lady_sleep: '공주 잠듦', gull: '갈매기',
    fish_a: '물고기', fish_b: '물고기', fish_c: '물고기', prop_ship_lantern: '배 (등불)', prop_ship_tilt: '배 (기우뚱)', prop_ship_flower: '배 (꽃 장식)',
    prop_stone: '돌', prop_wood: '나무토막', prop_anchor: '닻', prop_bottle_cork: '코르크 병', prop_cauldron_dim: '가마솥', prop_cauldron_glow: '가마솥 (빛)',
    prop_potion_empty: '약병', prop_potion_full: '약병 (가득)', prop_shell_pearl: '진주 조개', item_shell: '조개', item_starfish: '불가사리', item_butterfly: '나비',
    item_bird: '새', item_rabbit: '토끼', item_flower: '꽃', item_tree: '나무', item_dog: '강아지', prop_dagger: '단검(칼집)', prop_rock: '바위',
    prop_cloud_dark: '먹구름', prop_wave: '', prop_wave_big: '큰 파도', prop_sun: '해', prop_wind: '바람', prop_fw_a: '불꽃', prop_fw_b: '불꽃', prop_fw_c: '불꽃' };
  const PC = { mer: { hair: '#D9A94E', body: CR, tail: '#3F9A8F', fin: '#7FBFB5' }, prince: { hair: '#6B4A32', body: '#A93B32' },
    lady: { hair: '#A06A3A', body: '#F4F6FA' }, witch: { hair: '#2E241C', body: '#3F6B4F' }, granny: { hair: '#E4E4E4', body: '#8E9AA6' },
    king: { hair: '#E4E4E4', body: '#D9A94E' } };
  function phHuman(T, g, w, h, c, { tail = false, half = false, D = 0 } = {}) {
    const { el } = T, d = D || Math.min(80, h * .4, w * .95), hx = 0, hy = -h + d / 2;
    const bw = Math.min(w * .84, d * 1.05), by = hy + d * .42, bb = half ? 0 : tail ? -h * .42 : 0;
    el('rect', { x: -bw / 2, y: by, width: bw, height: bb - by, rx: 8, fill: c.body }, g);
    if (tail) {
      el('path', { d: `M${-bw / 2} ${bb} h${bw} q-4 ${h * .25} 6 ${h * .4} l${bw * .38} ${-h * .04} v${h * .1} h${-bw * 1.3} v${-h * .1} l${bw * .38} ${h * .04} q10 ${-h * .15} ${-bw / 2 - 6} ${-h * .4}z`.replace(/ \s+/g, ' '), fill: c.tail }, g);
      el('rect', { x: -bw / 2 + 4, y: bb - 2, width: bw - 8, height: 6, fill: c.fin }, g);
    }
    el('circle', { cx: hx, cy: hy, r: d / 2, fill: SK }, g);
    el('path', { d: `M${-d / 2} ${hy} a${d / 2} ${d / 2} 0 0 1 ${d} 0 q-${d * .25} ${-d * .12} -${d * .5} ${-d * .06} q-${d * .25} ${-d * .06} -${d * .5} ${d * .06}z`, fill: c.hair }, g);
    el('circle', { cx: -d * .17, cy: hy + 2, r: 3, fill: INK }, g); el('circle', { cx: d * .17, cy: hy + 2, r: 3, fill: INK }, g);
    el('path', { d: `M${-d * .1} ${hy + d * .2} q${d * .1} ${d * .08} ${d * .2} 0`, stroke: '#A93B32', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }, g);
  }
  function phLying(T, g, w, h, c) {   /* 가로로 누운·뜬 사람: 머리가 왼쪽 */
    const { el } = T, d = Math.min(80, h * .85);
    el('ellipse', { cx: d * .35, cy: -h * .45, rx: w / 2 - d * .45, ry: h * .34, fill: c.body }, g);
    el('circle', { cx: -w / 2 + d / 2, cy: -h * .5, r: d / 2, fill: SK }, g);
    el('path', { d: `M${-w / 2} ${-h * .5} a${d / 2} ${d / 2} 0 0 1 ${d} 0 q-${d * .3} ${-d * .1} -${d} 0z`, fill: c.hair }, g);
    el('circle', { cx: -w / 2 + d * .35, cy: -h * .48, r: 2.5, fill: INK }, g); el('circle', { cx: -w / 2 + d * .65, cy: -h * .48, r: 2.5, fill: INK }, g);
  }
  function phMerH(T, g, w, h) {       /* 가로로 헤엄: 머리 왼쪽, 꼬리 오른쪽 */
    const { el } = T, c = PC.mer, d = Math.min(80, h * .55);
    el('path', { d: `M${w * .12} ${-h * .5} L${w / 2} ${-h * .85} L${w / 2 - 14} ${-h * .5} L${w / 2} ${-h * .15}z`, fill: c.tail }, g);
    el('ellipse', { cx: -w * .02, cy: -h * .5, rx: w * .36, ry: h * .22, fill: c.tail }, g);
    el('ellipse', { cx: -w * .3, cy: -h * .52, rx: w * .15, ry: h * .2, fill: c.body }, g);
    el('circle', { cx: -w / 2 + d / 2, cy: -h * .55, r: d / 2, fill: SK }, g);
    el('path', { d: `M${-w / 2} ${-h * .55} a${d / 2} ${d / 2} 0 0 1 ${d} 0 q-${d * .3} ${-d * .1} -${d} 0z`, fill: c.hair }, g);
    el('circle', { cx: -w / 2 + d * .35, cy: -h * .53, r: 2.5, fill: INK }, g); el('circle', { cx: -w / 2 + d * .65, cy: -h * .53, r: 2.5, fill: INK }, g);
  }
  function phSisters(T, g, w, h, short) {
    const { el } = T, n = 5, hairs = ['#E8703A', '#D9A94E', '#6B4A32', '#A93B32', '#3F6B4F'], tails = ['#3F9A8F', '#E8703A', '#3F6B4F', '#A93B32', '#D9A94E'];
    const cw = w / n, fh = short ? h : h * .96;
    for (let i = 0; i < n; i++) {
      const sg = el('g', { transform: `translate(${-w / 2 + cw * (i + .5)},0)` }, g);
      phHuman(T, sg, cw * .9, fh, { hair: hairs[i], body: CR, tail: tails[i], fin: '#7FBFB5' }, { tail: !short, half: short, D: Math.min(60, fh * .3) });
    }
  }
  const ph = (T, g, f, w, h) => {      /* f = 그림 이름. 이름표 element 를 돌려준다 */
    const { el } = T, lbl = LBL[f] || '';
    let inside = false, below = false;
    if (/^mer_(swim|garden|worry|resolve|sit_tail)$/.test(f)) phHuman(T, g, w, h, PC.mer, { tail: true });
    else if (/^mer_(peek|hide)$/.test(f)) phHuman(T, g, w, h, PC.mer, { half: true });
    else if (f === 'mer_hold') phMerH(T, g, w, h);
    else if (f === 'mer_bubble') { el('circle', { cx: 0, cy: -h / 2, r: h / 2, fill: '#BFE3F0', opacity: .7 }, g); phHuman(T, el('g', { transform: `translate(0,${-h * .08})` }, g), w * .5, h * .6, PC.mer, { half: false }); }
    else if (/^mer_/.test(f)) phHuman(T, g, w, h, { ...PC.mer, body: CR }, {});
    else if (f === 'sisters_long') phSisters(T, g, w, h, false);
    else if (f === 'sisters_short') phSisters(T, g, w, h, true);
    else if (/^prince_(float|lie)$/.test(f)) phLying(T, g, w, h, PC.prince);
    else if (/^(prince|king|granny|witch|lady)_?/.test(f)) phHuman(T, g, w, h, PC[f.split('_')[0]], {});
    else if (f === 'gull') { el('ellipse', { cx: 0, cy: -h * .4, rx: w * .3, ry: h * .25, fill: '#F4F6FA' }, g); el('path', { d: `M${-w * .1} ${-h * .5} q${-w * .2} ${-h * .6} ${-w * .4} ${-h * .1}z M${w * .1} ${-h * .5} q${w * .2} ${-h * .6} ${w * .4} ${-h * .1}z`, fill: '#C9D0D8' }, g); inside = false; }
    else if (/^fish_/.test(f)) { const col = { a: '#E8703A', b: '#D9A94E', c: '#3F6B4F' }[f.slice(-1)]; el('ellipse', { cx: 0, cy: -h / 2, rx: w * .34, ry: h * .36, fill: col }, g); el('path', { d: `M${w * .28} ${-h / 2} l${w * .2} ${-h * .3} v${h * .6}z`, fill: col }, g); el('circle', { cx: -w * .15, cy: -h * .55, r: 2.5, fill: INK }, g); below = true; }
    else if (/^prop_ship/.test(f)) {
      const tilt = /tilt/.test(f), gr = el('g', tilt ? { transform: `rotate(-9 0 ${-h * .3})` } : {}, g);
      el('path', { d: `M${-w * .46} ${-h * .30} H${w * .46} L${w * .34} ${-h * .02} H${-w * .3}z`, fill: '#6B4A32' }, gr);
      el('rect', { x: -w * .46, y: -h * .34, width: w * .92, height: h * .06, fill: '#A93B32' }, gr);
      el('rect', { x: -w * .02, y: -h * .98, width: 6, height: h * .66, fill: '#6B4A32' }, gr);
      el('path', { d: `M${w * .02} ${-h * .96} L${w * .3} ${-h * .36} H${w * .02}z`, fill: CR }, gr);
      el('path', { d: `M${-w * .02} ${-h * .9} L${-w * .26} ${-h * .36} H${-w * .02}z`, fill: '#F2B366' }, gr);
      if (/lantern/.test(f)) el('circle', { cx: -w * .4, cy: -h * .4, r: 7, fill: '#F2B366' }, gr);
      if (/flower/.test(f)) [-.3, -.1, .15, .3].forEach((k, i) => el('circle', { cx: w * k, cy: -h * .35, r: 7, fill: ['#E8703A', '#D9A94E', '#F4F6FA', '#A93B32'][i] }, gr));
    }
    else if (/^prop_fw_/.test(f)) { const col = { a: '#E8703A', b: '#D9A94E', c: '#F4F6FA' }[f.slice(-1)]; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; el('path', { d: `M0 ${-h / 2} L${Math.cos(a) * w * .5} ${-h / 2 + Math.sin(a) * h * .5}`, stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' }, g); } el('circle', { cx: 0, cy: -h / 2, r: 9, fill: col }, g); }
    else if (f === 'prop_stone') { el('ellipse', { cx: 0, cy: -h * .42, rx: w * .46, ry: h * .42, fill: '#8E8A84' }, g); below = true; }
    else if (f === 'prop_wood') { el('rect', { x: -w / 2, y: -h * .8, width: w, height: h * .8, rx: 7, fill: '#B98A58' }, g); el('rect', { x: -w / 2 + 6, y: -h * .52, width: w * .5, height: 4, fill: '#8A5E38' }, g); below = true; }
    else if (f === 'prop_anchor') { el('rect', { x: -4, y: -h, width: 8, height: h * .9, fill: '#4A4F58' }, g); el('rect', { x: -w * .32, y: -h * .8, width: w * .64, height: 7, fill: '#4A4F58' }, g); el('path', { d: `M${-w * .42} ${-h * .3} Q0 ${h * .1} ${w * .42} ${-h * .3}`, stroke: '#4A4F58', 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round' }, g); below = true; }
    else if (f === 'prop_bottle_cork') { el('rect', { x: -w * .35, y: -h * .75, width: w * .7, height: h * .75, rx: 8, fill: '#7FBFB5' }, g); el('rect', { x: -w * .13, y: -h, width: w * .26, height: h * .3, fill: '#7FBFB5' }, g); el('rect', { x: -w * .15, y: -h * 1.06, width: w * .3, height: h * .1, fill: '#B98A58' }, g); below = true; }
    else if (/^prop_cauldron/.test(f)) { const gl = /glow/.test(f); el('ellipse', { cx: 0, cy: -h * .45, rx: w * .46, ry: h * .4, fill: '#3A3A44' }, g); el('ellipse', { cx: 0, cy: -h * .8, rx: w * .38, ry: h * .1, fill: gl ? '#F2B366' : '#2B5A4A' }, g); [-1, 1].forEach(k => el('rect', { x: k * w * .3 - 4, y: -h * .12, width: 8, height: h * .12, fill: '#3A3A44' }, g)); }
    else if (/^prop_potion/.test(f)) { const full = /full/.test(f); el('circle', { cx: 0, cy: -h * .32, r: h * .32, fill: '#BFE3F0' }, g); if (full) el('circle', { cx: 0, cy: -h * .26, r: h * .22, fill: '#E8703A' }, g); el('rect', { x: -4, y: -h * .95, width: 8, height: h * .4, fill: '#BFE3F0' }, g); el('rect', { x: -6, y: -h, width: 12, height: 6, fill: '#B98A58' }, g); }
    else if (f === 'prop_shell_pearl') { el('path', { d: `M${-w * .45} 0 Q${-w * .5} ${-h * .9} 0 ${-h * .95} Q${w * .5} ${-h * .9} ${w * .45} 0z`, fill: '#E8A0A0' }, g); el('circle', { cx: 0, cy: -h * .35, r: h * .16, fill: CR }, g); }
    else if (/^item_/.test(f)) {
      const col = { shell: '#E8A0A0', starfish: '#E8703A', butterfly: '#F2B366', bird: '#7FA7C9', rabbit: '#F4F6FA', flower: '#A93B32', tree: '#3F6B4F', dog: '#B98A58' }[f.slice(5)];
      if (f === 'item_starfish') el('path', { d: 'M0 -90 L12 -58 L46 -56 L20 -34 L30 -2 L0 -22 L-30 -2 L-20 -34 L-46 -56 L-12 -58z', fill: col, transform: `scale(${w / 100},${h / 96})` }, g);
      else if (f === 'item_tree') { el('rect', { x: -6, y: -h * .4, width: 12, height: h * .4, fill: '#6B4A32' }, g); el('circle', { cx: 0, cy: -h * .65, r: h * .33, fill: col }, g); }
      else el('ellipse', { cx: 0, cy: -h / 2, rx: w * .4, ry: h * .4, fill: col }, g);
      below = true;
    }
    else if (f === 'prop_dagger') { el('rect', { x: -w / 2, y: -h * .8, width: w, height: h * .6, rx: 5, fill: '#6B4A32' }, g); el('rect', { x: -w / 2 - 6, y: -h, width: 10, height: h, rx: 3, fill: '#D9A94E' }, g); }
    else if (f === 'prop_glint') { el('path', { d: `M0 ${-h} L${w * .15} ${-h * .6} L${w * .5} ${-h * .5} L${w * .15} ${-h * .4} L0 0 L${-w * .15} ${-h * .4} L${-w * .5} ${-h * .5} L${-w * .15} ${-h * .6}z`, fill: '#F2B366' }, g); }
    else if (f === 'prop_ripple') { el('ellipse', { cx: 0, cy: -h / 2, rx: w * .48, ry: h * .3, fill: 'none', stroke: CR, 'stroke-width': 5 }, g); el('ellipse', { cx: 0, cy: -h / 2, rx: w * .28, ry: h * .17, fill: 'none', stroke: CR, 'stroke-width': 4 }, g); }
    else if (f === 'prop_bubble') { el('circle', { cx: 0, cy: -h / 2, r: h / 2, fill: '#DDF1F7', opacity: .85 }, g); el('circle', { cx: -h * .15, cy: -h * .65, r: h * .1, fill: '#fff' }, g); }
    else if (f === 'prop_wind') { [.25, .5, .75].forEach((k, i) => el('path', { d: `M${-w / 2} ${-h * k} q${w * .25} ${-h * .2} ${w * .5} 0 t${w * (.5 - i * .1)} 0`, stroke: '#DDF1F7', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g)); }
    else if (f === 'prop_rock') { el('path', { d: `M${-w * .5} 0 L${-w * .38} ${-h * .5} L${-w * .05} ${-h * .7} L${w * .3} ${-h * .55} L${w * .5} 0z`, fill: '#7D7A74' }, g); }
    else if (f === 'prop_cloud_dark') { el('ellipse', { cx: 0, cy: -h * .3, rx: w * .45, ry: h * .3, fill: '#3C4468' }, g); el('circle', { cx: -w * .15, cy: -h * .5, r: h * .3, fill: '#3C4468' }, g); el('circle', { cx: w * .12, cy: -h * .55, r: h * .26, fill: '#3C4468' }, g); }
    else if (f === 'prop_wave') { el('rect', { x: -w / 2, y: -h, width: w, height: h, fill: '#3F8F96' }, g); el('rect', { x: -w / 2, y: -h, width: w, height: h * .12, fill: '#6FB5B8' }, g); }
    else if (f === 'prop_wave_big') { el('path', { d: `M${-w / 2} 0 V${-h * .5} q${w * .12} ${-h * .55} ${w * .25} 0 q${w * .12} ${-h * .55} ${w * .25} 0 q${w * .12} ${-h * .55} ${w * .25} 0 q${w * .12} ${-h * .55} ${w * .25} 0 V0z`, fill: '#2F5F7A' }, g); }
    else if (f === 'prop_sun') { el('circle', { cx: 0, cy: -h * .45, r: h * .42, fill: '#F2B366' }, g); }
    else { el('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 8, fill: '#D9A94E' }, g); }
    if (!lbl || (h < 34 && !below)) return null;
    const t = el('text', { x: 0, y: below ? 15 : -h * .5, 'text-anchor': 'middle', 'font-size': below ? 12 : 13, 'font-weight': 700, fill: INK, 'paint-order': 'stroke', stroke: CR, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    t.textContent = lbl; t.style.pointerEvents = 'none';
    return t;
  };
  /* 배경 자리표시: 평평한 종이 한 장 + 요소 2~3개 + 장면 이름표 */
  const BGPH = {
    palace: { name: '바다 밑 궁전', base: '#7FBFB5', shapes: g => [['rect', { x: -60, y: 512, width: 1120, height: 120, fill: '#D9C08A' }], ['rect', { x: 120, y: 140, width: 90, height: 372, fill: CR }], ['rect', { x: 800, y: 120, width: 90, height: 392, fill: CR }], ['circle', { cx: 60, cy: 490, r: 28, fill: '#E8703A' }]] },
    night_sea: { name: '밤바다', base: '#1F2A56', shapes: () => [['rect', { x: -60, y: 300, width: 1120, height: 340, fill: '#2B4A78' }], ['circle', { cx: 840, cy: 90, r: 44, fill: CR }], ['circle', { cx: 160, cy: 70, r: 4, fill: CR }], ['circle', { cx: 400, cy: 120, r: 3, fill: CR }]] },
    beach: { name: '모래밭', base: '#BFE0EA', shapes: () => [['rect', { x: -60, y: 330, width: 1120, height: 121, fill: '#7FBFD5' }], ['rect', { x: -60, y: 451, width: 1120, height: 200, fill: '#E8D3A0' }], ['circle', { cx: 150, cy: 100, r: 40, fill: '#F2D88A' }]] },
    witch: { name: '바다 마녀의 동굴', base: '#34495A', shapes: () => [['rect', { x: -60, y: 512, width: 1120, height: 120, fill: '#5A4A3A' }], ['path', { d: 'M100 512 Q200 160 330 512z', fill: '#2B3340' }], ['path', { d: 'M700 512 Q820 220 940 512z', fill: '#2B3340' }]] },
    steps: { name: '궁전 계단', base: '#F2D2B0', shapes: () => [['rect', { x: 0, y: 470, width: 1000, height: 160, fill: CR }], ['rect', { x: 150, y: 430, width: 700, height: 40, fill: '#E8DAC0' }], ['rect', { x: 300, y: 390, width: 400, height: 40, fill: CR }], ['rect', { x: 60, y: 100, width: 70, height: 370, fill: CR }]] },
    garden: { name: '궁전 정원', base: '#CFE6EA', shapes: () => [['rect', { x: -60, y: 250, width: 1120, height: 400, fill: '#8FB56B' }], ['ellipse', { cx: 500, cy: 488, rx: 162, ry: 49, fill: '#7FBFD5' }], ['circle', { cx: 120, cy: 220, r: 50, fill: '#3F6B4F' }]] },
    deck: { name: '배 갑판 (밤)', base: '#1F2A56', shapes: () => [['rect', { x: -60, y: 402, width: 1120, height: 240, fill: '#6B4A32' }], ['circle', { cx: 850, cy: 90, r: 40, fill: CR }], ['rect', { x: 120, y: 330, width: 10, height: 72, fill: '#3F2A1C' }], ['circle', { cx: 125, cy: 320, r: 12, fill: '#F2B366' }]] },
    dawn_sea: { name: '새벽 바다', base: '#F4D6A8', shapes: () => [['rect', { x: -60, y: 300, width: 1120, height: 340, fill: '#5A9AA0' }], ['rect', { x: -60, y: 220, width: 1120, height: 80, fill: '#F2B366', opacity: .5 }]] },
    morning_sea: { name: '아침 바다', base: '#BFE3F0', shapes: () => [['rect', { x: -60, y: 372, width: 1120, height: 270, fill: '#3F8FA0' }], ['circle', { cx: 120, cy: 90, r: 38, fill: '#F2D88A' }]] },
  };
  function bgPlaceholder(T, key) {
    const d = BGPH[key], p = T.bg;
    T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3800, fill: d.base }, p);
    d.shapes().forEach(([tag, at]) => T.el(tag, at, p));
    const t = T.el('text', { x: 18, y: 30, 'font-size': 15, 'font-weight': 700, fill: INK, opacity: .7 }, p);
    t.textContent = '[그림 준비 중] ' + d.name;
  }
  function bgImage(T, key) {
    if (bgOK[key]) { const b = bgBox(key); return T.el('image', { href: bgSrc(key), x: b.x, y: b.y, width: b.w, height: b.h, preserveAspectRatio: 'none' }, T.bg); }
    bgPlaceholder(T, key);
  }
  /* 물 덮개: 새 바다 배경은 물결이 그림 안에 있다. 배·인어가 물에 잠겨 보이게, 같은 배경 그림을 y0 아래만 오려 인물 위에 한 번 더 얹는다
     (배경과 같은 그림이라 이음새가 없다). 그림이 없으면 아무것도 하지 않는다 */
  function waterCover(T, key, y0) {
    if (!bgOK[key]) return null;
    const id = 'wc' + Math.round(y0) + key, cp = T.el('clipPath', { id }, T.world);
    T.el('rect', { x: -1400, y: y0, width: 3800, height: 3000 }, cp);
    const g = T.el('g', { 'clip-path': `url(#${id})` }, T.world);
    T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, g);
    T._cover = g;
    return g;
  }
  /* 폭풍 파도(prop_wave_big)의 남색 몸판을 빛 상자 밤바다(틴트 .35 아래) 물빛에 맞춘다 — 물 덮개 윗선에서 몸판 네모 띠가 따로 보이지 않게.
     채널마다 직선 변환: 몸판 (16,51,103) → 바다 (30,41,87), 거품 크림 (233,228,204) 은 그대로 */
  function stormWaves(T, ws) {
    const old = T.world.ownerDocument.getElementById('merWaveNight'); if (old) old.remove();
    const f = T.el('filter', { id: 'merWaveNight', 'color-interpolation-filters': 'sRGB' }, T.world);
    T.el('feColorMatrix', { type: 'matrix', values: '0.9355 0 0 0 0.0589  0 1.0565 0 0 -0.0505  0 0 1.1584 0 -0.1267  0 0 0 1 0' }, f);
    /* 몸판 아래쪽은 물 덮개 윗선까지 서서히 사라지게(마스크) — 이음 띠가 남지 않게 */
    const om = T.world.ownerDocument.getElementById('merWaveFade'); if (om) om.remove();
    const og = T.world.ownerDocument.getElementById('merWaveFadeG'); if (og) og.remove();
    const gr = T.el('linearGradient', { id: 'merWaveFadeG', x1: 0, y1: 0, x2: 0, y2: 1 }, T.world);
    [[0, 1], [.7, 1], [.95, 0]].forEach(([o, a]) => T.el('stop', { offset: o, 'stop-color': '#fff', 'stop-opacity': a }, gr));
    const mk = T.el('mask', { id: 'merWaveFade', maskContentUnits: 'objectBoundingBox' }, T.world);
    T.el('rect', { x: 0, y: 0, width: 1, height: 1, fill: 'url(#merWaveFadeG)' }, mk);
    ws.forEach(w => { w.body.style.filter = 'url(#merWaveNight)'; w.body.setAttribute('mask', 'url(#merWaveFade)'); });
  }
  const WY = 482;   /* 마녀 동굴: 마녀 발 (조개 문 앞 모래, 뒤쪽이라 원근 0.66배) */
  const SY = 404;   /* 계단 장면: 맨 윗단 위 (기둥 밑) */
  const GF = 514;   /* 정원 바닥 (화면 아래 가장자리에 발이 잘리지 않게) */
  const SC = { steps: 0.8, garden: 1.2, deck: 1.5, witch: 0.66 };   /* 장면별 인물 확대 (모든 자세에 같은 배율, §4-1) */

  /* 배우: 자세 그림 여러 장 중 하나만 보인다. poses = { 이름: 그림 } 또는 { 이름: [그림, 높이] }
     그림 파일이 없으면 자리표시. a.look(자세, 방향) — 그림이 보는 쪽과 원하는 쪽이 다르면 뒤집는다 (앞모습은 뒤집지 않는다) */
  function mk(T, poses) {
    const looks = {}, labels = [];
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, v]) => {
        const [f, h0] = Array.isArray(v) ? v : [v, null], h = h0 || hOf(f), w = h * (ASP[f] || 1);
        const wrap = T.el('g', { filter: 'url(#pp)' }, g);
        if (artOK[f]) T.el('image', { href: artSrc(f), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        else { const t = ph(T, wrap, f, w, h); if (t) labels.push(t); }
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
      });
    });
    const place0 = a.place;
    a.place = (x, y) => { place0(x, y); labels.forEach(t => t.setAttribute('transform', `scale(${a.flip},1)`)); };   /* 이름표 글자는 뒤집히지 않게 */
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
    if (T._cover) T.world.appendChild(T._cover);   /* 물 덮개는 늘 맨 위 */
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 450) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  const sleep0 = ms => new Promise(r => setTimeout(r, ms));
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);
  const sfx = (T, name, fb) => AudioFX.sfx(name) || fb && fb();
  const popSfx = T => sfx(T, 'pop', () => T.tone([500, 800], .12, { vol: .12 }));
  const sparkleSfx = T => sfx(T, 'sparkle', () => T.tone([700, 1400], .4, { vol: .12 }));

  /* 반짝이: 종이 마름모가 퍼졌다 사라진다 */
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

  /* ---- 이 동화의 도우미 (SPEC §1) ---- */
  /* 누르기 자리: 작은 소품도 손가락으로 쉽게 누르게 투명 원을 소품 그룹 안에 둔다 (r 은 무대 단위) */
  const hit = (T, a, r) => T.el('circle', { cx: 0, cy: -a.h / 2, r, fill: '#fff', opacity: 0 }, a.pos);
  /* 거품: (x,y) 에서 작은 거품 n 개가 흔들리며 올라가 사라진다 */
  function bubblesUp(T, x, y, n = 5, rise = 160) {
    for (let i = 0; i < n; i++) {
      const b = prop(T, 'prop_bubble', 18 + (i % 3) * 8), dx = (i - n / 2) * 14;
      put(T, b, x + dx, y);
      b.pos.animate([{ transform: `translate(${x + dx}px,${y}px)`, opacity: 0 }, { opacity: 1, offset: .2 },
        { transform: `translate(${x + dx + (i % 2 ? 12 : -12)}px,${y - rise}px)`, opacity: 0 }], { duration: 1400 + i * 120, delay: i * 90, fill: 'backwards' })
        .finished.then(() => b.pos.remove(), () => b.pos.remove());
    }
  }
  /* 흔들 걸음: wobble_a / wobble_b 를 300ms 마다 번갈아 보이며 x 까지 걷고, 끝나면 stand */
  async function wobbleWalk(T, a, x, ms, y = FL) {
    let k = 0; const tm = setInterval(() => a.look(k++ % 2 ? 'wobble_b' : 'wobble_a'), 300);
    sfx(T, 'step_wood'); await a.move(x, y, ms, 'linear'); clearInterval(tm); a.look('stand');
  }
  /* 붉은 금빛 반짝: glint 5개가 (x,y) 에서 퍼졌다 사라진다 */
  function glints(T, x, y, n = 12) {   /* 5 → 12조각 (VISUAL_PLAN §4 10장) */
    for (let i = 0; i < n; i++) {
      const g = prop(T, 'prop_glint', 22 + (i % 2) * 8), a = i / n * Math.PI * 2, d = 70 + (i % 3) * 25;
      put(T, g, x, y);
      g.pos.animate([{ transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 0 },
        { transform: `translate(${x + Math.cos(a) * d / 2}px,${y + Math.sin(a) * d / 4}px) scale(1.2)`, opacity: 1, offset: .4 },
        { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d / 2}px) scale(.4)`, opacity: 0 }], { duration: 1000, delay: i * 25, fill: 'backwards' })
        .finished.then(() => g.pos.remove(), () => g.pos.remove());
    }
  }
  /* 꽃잎 흩날림: 위에서 n 장이 팔랑팔랑 (얼굴 자리 x0~x1 은 피해 양옆에서만) */
  function petals(T, n, xs, ms = 4000) {
    for (let i = 0; i < n; i++) {
      const p = prop(T, 'layer_petal', 16 + (i % 3) * 3); p.pos.style.pointerEvents = 'none';
      const x = xs[i % xs.length] + (i * 37) % 60 - 30;
      put(T, p, x, -20);
      p.pos.animate([{ transform: `translate(${x}px,-20px) rotate(0deg)`, opacity: 0 }, { transform: `translate(${x - 30}px,200px) rotate(150deg)`, opacity: 1, offset: .4 },
        { transform: `translate(${x + 20}px,560px) rotate(320deg)`, opacity: 0 }], { duration: ms + (i % 4) * 500, delay: i * 300, fill: 'both', easing: 'ease-in-out' })
        .finished.then(() => p.pos.remove(), () => p.pos.remove());
    }
  }
  /* 잔물결 */
  function rippleAt(T, x, y) {
    const r = prop(T, 'prop_ripple', 60); put(T, r, x, y + 30);
    r.body.animate([{ transform: 'scale(.4)', opacity: 1 }, { transform: 'scale(1.5)', opacity: 0 }], 1500).finished.then(() => hide(r), () => hide(r));
  }

  async function run(T) {
    if (T.fx) T.fx.style.pointerEvents = 'none';   // 효과 글자(pop)가 누르는 대상을 덮지 않게
    const { sleep, say, camSnap, tr } = T;
    const scene = key => { T.clear(); T._cover = null; bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990;   /* 세로 화면: 가운데 일부만 보인다 → 카메라가 따라간다 */
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());

    /* 그림 파일 미리 받기: 있으면 쓰고(artOK/bgOK), 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 */
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(bgSrc(k)).then(ok => { bgOK[k] = ok; })));
    Object.keys(ASP).forEach(k => { const pr = T.preload(artSrc(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(4000)]);

    /* ---- 배우 ---- */
    const mer = mk(T, { swim: 'mer_swim', garden: 'mer_garden', peek: 'mer_peek', hide: 'mer_hide', hold: 'mer_hold', worry: 'mer_worry', resolve: 'mer_resolve',
      sit_tail: 'mer_sit_tail', stand: 'mer_stand', wobble_a: 'mer_wobble_a', wobble_b: 'mer_wobble_b', dance: 'mer_dance', sad: 'mer_sad', shake: 'mer_shake',
      throw: 'mer_throw', bubble: 'mer_bubble' });
    const sisters = mk(T, { long: 'sisters_long', short: 'sisters_short' });
    const king = mk(T, { a: 'king' });
    const granny = mk(T, { talk: 'granny_talk', hand: 'granny_hand' });
    const prince = mk(T, { stand: 'prince_stand', float: 'prince_float', lie: 'prince_lie', wake: 'prince_wake', dance: 'prince_dance', sleep: 'prince_sleep' });
    const witch = mk(T, { stand: 'witch_stand', hand: 'witch_hand' });
    const lady = mk(T, { stand: 'lady_stand', wed: 'lady_wed', sleep: 'lady_sleep' });
    const gulls = [prop(T, 'gull', 60), prop(T, 'gull', 60)];
    const fish = ['fish_a', 'fish_b', 'fish_c'].map(f => prop(T, f, 36));
    const ship = mk(T, { lantern: ['prop_ship_lantern', 330], tilt: ['prop_ship_tilt', 330], flower: ['prop_ship_flower', 330] });
    const SHIP_W = 330 * ASP.prop_ship_lantern, DECK_DY = -330 * .30 /* 갑판 높이: SPEC 은 .42 였으나 왕자 머리가 무대 위로 잘려 .30 으로 — 그림이 나오면 갑판선에 맞춰 보정 */, BOW_DX = -SHIP_W * .30;
    const fw = ['prop_fw_a', 'prop_fw_b', 'prop_fw_c'].map(f => prop(T, f, 120));
    const stone = prop(T, 'prop_stone', 48), wood = prop(T, 'prop_wood', 44), anchor = prop(T, 'prop_anchor', 80), bottle = prop(T, 'prop_bottle_cork', 70);
    const cauldron = mk(T, { dim: ['prop_cauldron_dim', 150], glow: ['prop_cauldron_glow', 172] });
    const potion = mk(T, { empty: ['prop_potion_empty', 44], full: ['prop_potion_full', 44] });
    const shell = prop(T, 'prop_shell_pearl', 64);
    const dagger = prop(T, 'prop_dagger', 18), rock = prop(T, 'prop_rock', 120);
    const clouds = [prop(T, 'prop_cloud_dark', 160), prop(T, 'prop_cloud_dark', 160)];
    const wave = prop(T, 'prop_wave', 110), waves = [prop(T, 'prop_wave_big', 180), prop(T, 'prop_wave_big', 180)];
    const sun = prop(T, 'prop_sun', 120), wind = [prop(T, 'prop_wind', 90), prop(T, 'prop_wind', 90)];
    const ALL = [mer, sisters, king, granny, prince, witch, lady, ...gulls, ...fish, ship, ...fw, stone, wood, anchor, bottle, cauldron, potion, shell, dagger, rock,
      ...clouds, wave, ...waves, sun, ...wind];
    ALL.forEach(hide);
    /* ---- 층 소품 (VISUAL_PLAN §4): 누름을 받지 않는다. 같은 소품은 어느 장면이든 같은 높이 ---- */
    const D = (f, h) => { const a = prop(T, 'layer_' + f, h); a.pos.style.pointerEvents = 'none'; return a; };
    const L = { coralA: D('coral_front_a', 160), coralB: D('coral_front_b', 160), kelp: D('kelp_front', 220), school: D('fish_school', 90), anemone: D('anemone', 90),
      jellyA: D('jelly_a', 110), jellyB: D('jelly_b', 110), rose: [D('rosebush', 140), D('rosebush', 140)], topiary: D('topiary', 200), arch: D('flower_arch', 300),
      bunting: D('bunting', 70) };
    Object.values(L).flat().forEach(hide);
    const fwD = [prop(T, 'layer_fw_d', 120), prop(T, 'layer_fw_d', 120)], fwE = prop(T, 'layer_fw_e', 120), fwA2 = prop(T, 'prop_fw_a', 120);
    [...fwD, fwE, fwA2].forEach(hide);
    const front = (...as) => { as.forEach(a => { if (a.pos.style.display !== 'none') T.world.appendChild(a.pos); }); if (T._cover) T.world.appendChild(T._cover); };
    /* 바다 밑 궁전(1·2앞·5장): 물고기 떼·말미잘(중간) → 배우 → 산호 둘·다시마(앞) */
    const palaceBack = () => {
      put(T, L.school, X(820, 700), 150); L.school.pos.animate([{ translate: '-40px 0' }, { translate: '40px 0' }], { duration: 6000, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
      put(T, L.anemone, 60, 512);
    };
    const palaceFront = () => { put(T, L.coralA, 40, 548); put(T, L.coralB, 1035, 548, { to: 'right' }); put(T, L.kelp, 975, 560);   /* 할머니(880) 꼬리를 덮지 않게 오른쪽 끝으로 */ front(L.coralA, L.coralB, L.kelp); };
    const waveS = () => 1100 / (110 * ASP.prop_wave);
    T.director({ cast: { mer, granny, prince, lady, witch }, noFace: ['mer', 'granny', 'prince', 'lady', 'witch'] });
    const drift = (a, dx, dy, ms) => a.pos.animate([{ translate: '0 0' }, { translate: `${dx}px ${dy}px` }], { duration: ms, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
    const bob = (a, px, ms, n = Infinity) => a.pos.animate([{ translate: '0 0' }, { translate: `0 ${px}px` }, { translate: '0 0' }], { duration: ms, iterations: n, easing: 'ease-in-out' });

    /* ===== 읽어 주기 (docs/READ_MODE.md): 조작·배움 놀이 없이 같은 그림으로 읽어 준다. 놀이판 흐름은 아래 그대로 ===== */
    if (T.reading()) {
      let sn = 0;                       /* 몇 번째 장면(set 을 부른 횟수). 같은 배경이 두 번 나와도 구분 */
      let frontList = [], bobAnim = null;
      const inst = () => T.readInstant();
      const PX = x => (P && x >= 0 && x <= 1000 ? 500 + (x - 500) * .6 : x);
      const CAMP = { 1: 440, 2: 460, 3: 520, 4: 500, 5: 500, 6: 600, 7: 500, 8: 500, 9: 500, 10: 300, 11: 470 };
      const refront = () => { front(...frontList); };
      const NAMES = { mer, sisters, king, granny, prince, witch, lady };
      const SCN = { 6: { witch: .66 }, 7: { _: .8 }, 8: { _: 1.2 }, 9: { _: 1.5 } };
      /* 대본 좌표는 놀이판과 바닥선·수면선이 달라서, 장면마다 놀이판 자리로 맞춘다 */
      const place = (nm, x, y) => {
        const sc = SCN[sn]; let s = sc ? (sc[nm] != null ? sc[nm] : (sc._ != null ? sc._ : 1)) : 1;
        let xx = PX(x), yy = y;
        if (sn === 6 && nm === 'witch') yy = WY; if (sn === 7) yy = SY; if (sn === 8) yy = GF;
        if (sn === 2) { if (nm === 'ship') { xx = X(640, 560); yy = WATER + 28; } if (nm === 'prince') { xx = ship.x + BOW_DX; yy = ship.y + DECK_DY; } if (nm === 'mer') { xx = X(330, 420); yy = WATER + 12; } }
        if (sn === 3) { if (nm === 'ship') { xx = X(620, 560); yy = WATER + 40; } if (nm === 'mer') yy = WATER + 12; }
        if (sn === 4) { if (nm === 'mer') xx = X(360, 420); if (nm === 'prince') xx = X(580, 560); }
        if (sn === 10) {
          if (nm === 'ship') { xx = 720; yy = WATER + 46; }
          if (nm === 'prince') { xx = ship.x + 40; yy = ship.y + DECK_DY; }
          if (nm === 'lady') { xx = ship.x + 150; yy = ship.y + DECK_DY; }
          if (nm === 'mer') { xx = ship.x + BOW_DX; yy = ship.y + DECK_DY; }
          if (nm === 'sisters') { xx = 250; yy = WATER + 90; }
        }
        if (sn === 11) {
          if (nm === 'ship') { xx = X(640, 600); yy = WATER11 + 28; }
          if (nm === 'prince') { xx = ship.x - SHIP_W * .10; yy = ship.y + DECK_DY; }
          if (nm === 'lady') { xx = ship.x + 60; yy = ship.y + DECK_DY; }
          if (nm === 'mer') { xx = X(340, 410); yy = 300; }
        }
        return [xx, yy, s];
      };
      const hideLayers = () => { [...ALL, ...Object.values(L).flat(), ...fwD, fwE, fwA2].forEach(hide); };
      const rWaveCover = (key) => waterCover(T, key, key === 'dawn_sea' ? WATER + 38 : WATER + 20);
      const Y = y => (sn === 7 ? SY : sn === 8 ? GF : +y);
      const R = {
        set: key => {
          sn++; frontList = []; hideLayers(); scene(key); T._cover = null;
          if (P) camSnap(CAMP[sn] || 500, 280, 1);
          if (key === 'palace') {
            palaceBack(); put(T, L.coralA, 40, 548); put(T, L.coralB, 1035, 548, { to: 'right' }); put(T, L.kelp, 975, 560);
            frontList = [L.coralA, L.coralB, L.kelp];
          } else if (key === 'witch') {
            put(T, L.jellyA, X(150, 400), 130); put(T, L.jellyB, X(880, 800), 200);
            [L.jellyA, L.jellyB].forEach((j, i) => j.pos.animate([{ translate: '0 -14px' }, { translate: '0 14px' }], { duration: 3200, delay: i * 900, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }));
            put(T, L.coralB, 30, 552); frontList = [L.coralB];
          } else if (key === 'garden') {
            put(T, L.arch, 960, GF); put(T, L.topiary, 70, GF);
            put(T, L.rose[0], 40, 560); put(T, L.rose[1], 975, 560, { to: 'right' }); frontList = [...L.rose];
          } else if (key === 'deck') {
            put(T, L.arch, X(565, 540), 520);
          } else if (key === 'beach') {
            put(T, rock, X(400, 420), 522); frontList = [rock];
          }
        },
        tint: arg => { const [c, op] = arg.split(','); tint(T, c, +op); },
        cam: arg => {
          const [x, y, z] = arg.split(',');
          const zz = +z, xx = P ? (zz > 1.1 ? 500 : (CAMP[sn] || 500)) : +x;
          if (inst()) camSnap(xx, +y, zz); else T.camTo(xx, +y, zz, 700);
        },
        follow: x => { if (P && !inst()) T.camTo(+x, 280, 1, 700); },
        confetti: () => { T.confetti(); },
        fx: name => { sfx(T, name, name === 'tada' ? () => sparkleSfx(T) : name === 'sparkle' ? () => sparkleSfx(T) : null); },
        pop: (...a) => { const [x, y, ...t] = a.join(':').split(','); T.pop(PX(+x), +y, tr(t.join(','))); },
        glow: nm => { glow(NAMES[nm]); },
        bubbles: arg => { const [x, y, n] = arg.split(','); bubblesUp(T, PX(+x), +y, +n, 140); },
        sparkle: arg => { const [x, y] = arg.split(','); sparkle(T, PX(+x), +y, 110, 14); },
        water: (op, a) => { const [key] = String(a).split(','); rWaveCover(key); refront(); },
        fish: () => {
          const fxs = X([120, 640, 760], [380, 560, 600]), fys = [380, 200, 430];
          fish.forEach((f, i) => { put(T, f, fxs[i], fys[i], { to: i % 2 ? 'left' : 'right' }); drift(f, 24 * (i % 2 ? -1 : 1), 12, 3000 + i * 500); });
          refront();
        },
        gulls: () => {
          put(T, gulls[0], X(150, 250), 120); put(T, gulls[1], X(820, 560), 90);
          gulls.forEach((g, i) => g.pos.animate([{ translate: '-30px 0' }, { translate: '30px -10px' }], { duration: 4000, iterations: Infinity, direction: 'alternate', delay: i * 700 }));
        },
        sun: () => { put(T, sun, 820, WATER + 70); T.bg.appendChild(sun.pos); },
        shell: (op, xy) => { const [x, y] = xy.split(','); put(T, shell, PX(+x), +y); },
        cauldron: (op, xy) => {
          if (op === 'at') { const [x, y] = xy.split(','); put(T, cauldron, PX(+x), +y, { look: 'dim', s: .85 }); refront(); return; }
          cauldron.look('glow'); sfx(T, 'bubbles');
          put(T, potion, cauldron.x + 44, cauldron.y - 150, { look: 'empty' }); fadeIn(potion, 400);
          sleep(600).then(() => { potion.look('full'); glow(potion, 1000); sfx(T, 'sparkle'); });
        },
        pearl: async () => {
          const pearl = T.el('circle', { cx: 0, cy: 0, r: 8, fill: '#F6ECD8', stroke: '#F2B366', 'stroke-width': 2 }, T.world);
          const mx = mer.x + mer.w * .28, my = mer.y - mer.h * .70;
          potion.move(mer.x + 36, mer.y - 120, 1200).then(() => hide(potion), () => hide(potion));
          await T.anim(pearl, [{ transform: `translate(${mx}px,${my}px)` }, { transform: `translate(${mx + 90}px,${my - 120}px)` }], { duration: 500, easing: 'ease-out' });
          await T.anim(pearl, [{ transform: `translate(${mx + 90}px,${my - 120}px)` }, { transform: `translate(${shell.x}px,${shell.y - 30}px)` }], { duration: 700, easing: 'ease-in' });
          sfx(T, 'sparkle'); pearl.remove(); glow(shell, 1200); mer.look('worry', 'right'); mer.wiggle(2, 600);
        },
        potion: async () => {
          put(T, potion, mer.x + 34 * SC.steps, mer.y - 118 * SC.steps, { look: 'full', s: SC.steps });
          await potion.move(mer.x + 22 * SC.steps, mer.y - 150 * SC.steps, 500); sfx(T, 'gulp', () => popSfx(T)); hide(potion);
        },
        ship: (op, xy, look) => {
          if (op === 'at') {
            const [x, y] = xy.split(',');
            const o = place('ship', +x, +y); put(T, ship, o[0], o[1], { look });
            if (sn === 2) ship.pos.animate([{ translate: '0 0' }, { translate: '0 3px' }, { translate: '0 0' }], { duration: 2600, iterations: Infinity });
            return;
          }
          if (sn === 2) { ship.wiggle(2, 700); return; }
          T.shake(); sfx(T, 'thud'); return ship.wiggle(4, 900);
        },
        storm: () => {
          put(T, clouds[0], X(300, 380), 150); put(T, clouds[1], X(760, 620), 120);
          T.bg.appendChild(clouds[0].pos); T.bg.appendChild(clouds[1].pos);
          put(T, waves[0], X(420, 500), WATER + 95); put(T, waves[1], X(850, 760), WATER + 105); stormWaves(T, waves);
          { const c = waterCover(T, 'night_sea', WATER + 88); if (c) T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#1F2A56', opacity: .35 }, c); }
          waves.forEach((w, i) => w.pos.animate([{ translate: '-25px 0' }, { translate: '25px -8px' }], { duration: 2000, iterations: Infinity, direction: 'alternate', delay: i * 400 }));
        },
        fireworks: () => {
          const burst = async (f, x, y, h, snd, word) => {
            put(T, f, x, y + h / 2); f.setScale(h / 120);
            if (snd) sfx(T, snd); if (word) T.pop(x + 60, y - h / 2, tr('펑!'));
            f.body.animate([{ transform: 'scale(.2)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], 500);
            await sleep(1800); await T.anim(f.pos, [{ opacity: 1 }, { opacity: 0 }], 400).catch(() => {}); hide(f);
          };
          const FWC = { prop_fw_a: '#F2C94E', prop_fw_b: '#E8A0B8', prop_fw_c: '#8FC1E3', layer_fw_d: '#EBD08A', layer_fw_e: '#F2A7B5' };
          const reflect = (x, c) => [-30, 25].forEach((dx, i) => {
            const e = T.el('ellipse', { cx: x + dx, cy: WATER + 30 + i * 22, rx: 26, ry: 5, fill: c, opacity: 0 }, T._cover || T.world); e.style.pointerEvents = 'none';
            e.animate([{ opacity: 0 }, { opacity: .6 }, { opacity: 0 }], { duration: 900, delay: 200 }).finished.then(() => e.remove(), () => e.remove());
          });
          const fwx = x => X(x, 460 + (x - 560) * .55);
          const SHOW = [[fw[0], 640, 100, 'pow', true], [fw[1], 780, 70], [fw[2], 300, 130], [fwD[0], 700, 160, 'boom'], [fwE, 230, 70], [fwD[1], 870, 130], [fwA2, 610, 60, 'pow', true]];
          const GAPS = [700, 700, 600, 600, 500, 500];
          (async () => {
            for (let i = 0; i < SHOW.length; i++) {
              const [f, x, y, snd, word] = SHOW[i], key = f === fwA2 ? 'prop_fw_a' : f === fwE ? 'layer_fw_e' : fwD.includes(f) ? 'layer_fw_d' : ['prop_fw_a', 'prop_fw_b', 'prop_fw_c'][fw.indexOf(f)];
              burst(f, fwx(x), y, 120, snd || null, word); reflect(fwx(x), FWC[key]);
              if (i < GAPS.length) await sleep(GAPS[i]);
            }
          })();
          bob(mer, -3, 600, 3);
        },
        dance: async () => {
          for (let i = 0; i < 2; i++) {
            await Promise.all([mer.move(mer.x - 30, GF, 600), prince.move(prince.x - 30, GF, 600)]);
            await Promise.all([mer.move(mer.x + 30, GF, 600), prince.move(prince.x + 30, GF, 600)]);
            if (!i) T.pop(mer.x, GF - 250 * SC.garden, tr('흔들흔들'));
          }
        },
        dagger: async op => {
          if (op === 'give') {
            if (dagger.pos.style.display === 'none') { put(T, dagger, sisters.x - sisters.w * .40, WATER - 12); fadeIn(dagger, 300); }
            await dagger.move(mer.x, mer.y - mer.h * .38, 900); return;
          }
          const SP = [430, WATER + 40];
          await dagger.move(mer.x - 120, mer.y - 260, 450, 'ease-out');
          await dagger.move(SP[0], SP[1], 650, 'ease-in'); hide(dagger);
          sfx(T, 'splash'); rippleAt(T, SP[0], WATER + 20); glints(T, SP[0], WATER + 10);
          sun.move(820, WATER - 40, 2500, 'ease-out');
          [-60, -30, 0, 30, 60].forEach((deg, i) => {
            const a = (deg - 90) * Math.PI / 180, a1 = a - .06, a2 = a + .06, cx = 820, cy = WATER - 40, Rr = 420;
            const w = T.el('polygon', { points: `${cx},${cy} ${cx + Math.cos(a1) * Rr},${cy + Math.sin(a1) * Rr} ${cx + Math.cos(a2) * Rr},${cy + Math.sin(a2) * Rr}`, fill: '#F2B366', opacity: 0 }, T.bg);
            T.bg.insertBefore(w, sun.pos);
            w.animate([{ opacity: 0 }, { opacity: .18 }], { duration: 2500, delay: i * 120, fill: 'forwards' });
          });
          const warm = tint(T, '#F2B366', 0); T.anim(warm, [{ opacity: 0 }, { opacity: .18 }], 2500).catch(() => {}); warm.setAttribute('opacity', .18);
          if (T._cover) { const w2 = T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#F2B366', opacity: .18 }, T._cover); T.anim(w2, [{ opacity: 0 }, { opacity: .18 }], 2500).catch(() => {}); }
          sfx(T, 'sparkle');
        },
        wind: () => {
          sfx(T, 'blow_long', () => sfx(T, 'whoosh'));
          [[wind[0], mer.x + 70, 220, ship.x + 150, 200, 1400], [wind[1], mer.x + 50, 300, ship.x + 120, 280, 1600]].forEach(async ([w, x0, y0, x1, y1, ms]) => {
            put(T, w, x0, y0); fadeIn(w, 300);
            await w.move(x1, y1, ms, 'ease-in-out'); await fadeOut(T, w, 300);
          });
          ship.body.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }], 900);
          ship.hop(10, 600); ship.move(ship.x - 60, ship.y, 1800); gulls.forEach(g => g.hop(16, 500));
        },
      };
      /* 배우 동사: at / look / move / hop / wiggle / fade / hide (+ 인어공주·왕자 전용) */
      const AV = (nm, a) => (op, ...r) => {
        switch (op) {
          case 'at': {
            const [xy, look, to] = r, [x, y] = xy.split(','), o = place(nm, +x, +y);
            put(T, a, o[0], o[1], { look: look || undefined, to: to || undefined, s: o[2] });
            if (nm === 'mer' && sn === 7 && look === 'sit_tail') put(T, potion, a.x + 34 * SC.steps, a.y - 118 * SC.steps, { look: 'full', s: SC.steps });
            if (nm === 'mer' && sn === 8 && look === 'dance') petals(T, 6, X([120, 220, 800, 900], [330, 370, 640, 680]));
            if (nm === 'sisters' && sn === 10) a.pos.style.opacity = '0';
            if (nm === 'granny' && sn === 1 && look === 'hand') { [king, sisters, ...fish].forEach(hide); hide(L.school); }
            refront(); return;
          }
          case 'look': a.look(r[0], r[1]); return;
          case 'move': {
            const [x, y, ms] = r[0].split(','), tx = (P && sn === 6 && nm === 'mer') ? 490 : PX(+x), p = a.move(tx, Y(y), +ms);
            return (nm === 'prince' && (sn === 4 || sn === 7) && +x > 1000) ? null : p;
          }
          case 'hop': a.hop(10, 400); if (nm === 'sisters' && sn === 1) king.hop(6, 600); if (nm === 'sisters' && sn === 10 && dagger.pos.style.display === 'none') { put(T, dagger, a.x - a.w * .40, WATER - 12); fadeIn(dagger, 300); } return;
          case 'wiggle': a.wiggle(nm === 'granny' ? 3 : 4, 600); return;
          case 'fade':
            if (r[0] === 'out') return fadeOut(T, a, 500);
            a.pos.style.display = ''; a.pos.style.opacity = '';
            fadeIn(a, 900); if (nm === 'sisters' && sn === 10) { sfx(T, 'bubbles'); a.move(250, WATER + 30, 1200, 'ease-out'); } return;
          case 'hide': hide(a); return;
          case 'wobble': { const [x, ms] = r[0].split(','); return wobbleWalk(T, a, PX(+x), +ms, SY); }
          case 'surface': {
            a.turn('left'); sfx(T, 'bubbles'); bubblesUp(T, a.x, a.y - 60, 6, 220);
            return a.move(a.x + 40, -220, 2000, 'ease-in').then(() => hide(a));
          }
          case 'rescue': {
            const HOLD_DX = a.w * .45 + prince.w * .5 - 20;
            if (P) T.camTo(prince.x - 60, 280, 1, 700);
            return a.move(prince.x - HOLD_DX, WATER + 12, 1400).then(() => {
              mer.move(mer.x + 60, mer.y, 3600, 'linear'); prince.move(prince.x + 60, prince.y, 3600, 'linear');
            });
          }
          case 'bubble': {
            const bx = a.x, by = a.y, my = sn;
            (async () => {
              await fadeOut(T, a, 500);
              if (sn !== my) return;   /* 장면이 이미 넘어갔으면 다음 장면 인물을 건드리지 않는다 */
              put(T, a, bx, by, { look: 'bubble', s: .6 }); fadeIn(a, 600);
              bubblesUp(T, bx, by - 80, 8, 260); sparkle(T, bx, by - 110, 120, 12); sleep(250).then(() => sparkle(T, bx, by - 150, 160, 12, true));
              sleep(1200).then(() => T.pop(bx + 40, 230, tr('둥실')));
              await a.move(bx + 40, 90, 3200, 'ease-in-out').catch(() => {}); if (sn === my) await fadeOut(T, a, 600);
            })();
            return;
          }
          case 'fall': {
            put(T, a, ship.x - 120, ship.y + DECK_DY, { look: 'stand', to: 'left' });
            return (async () => {
              await a.move(a.x, WATER - 40, 620, 'ease-in');
              sfx(T, 'splash_big');
              a.look('float', 'left'); await a.move(ship.x - 150, WATER + 10, 500, 'ease-out');
            })();
          }
        }
      };
      const READ_ACTS = { ...R, set: R.set };
      Object.entries(NAMES).forEach(([nm, a]) => { READ_ACTS[nm] = AV(nm, a); });
      return T.readPlay(READ_ACTS);
    }

    /* ===== 1. 바다 밑 궁전 (배움 놀이: 뜨고 가라앉기) ===== */
    scene('palace');
    palaceBack();
    put(T, king, X(690, 700), 512, { to: 'left' });
    put(T, granny, X(880, 810), 516, { look: 'talk', to: 'left' });
    put(T, sisters, X(500, 430), 300, { look: 'long', s: X(1, .93) });
    put(T, mer, X(200, 340), 520, { look: 'garden', to: 'right' });
    const fxs = X([120, 640, 760], [380, 560, 600]), fys = X([380, 200, 430], [380, 200, 430]);
    fish.forEach((f, i) => { put(T, f, fxs[i], fys[i], { to: i % 2 ? 'left' : 'right' }); drift(f, 24 * (i % 2 ? -1 : 1), 12, 3000 + i * 500); });
    palaceFront();
    if (P) camSnap(440, 280, 1);
    await T.curtain(true);
    bubblesUp(T, X(520, 500), 420, 8);
    sisters.hop(8, 600); king.hop(6, 600);
    await say('깊고 깊은 바다 밑에 인어 나라가 있었어요. 바다 왕님과 할머니, 여섯 공주가 살았지요.');
    glow(mer, 1200);
    if (P) T.camTo(440, 280, 1, 600);
    await say('막내 인어공주는 조용하고 생각이 많았어요. 정원에는 배에서 떨어진 물건을 모았어요.');
    /* 뜨고 가라앉기 두 문제 */
    const sinkRound = async (a, b, ax, bx, prompt, wrongLine, rightLine, land, ground) => {
      [[a, ax], [b, bx]].forEach(([o, x]) => { put(T, o, x, 300); hit(T, o, 62); fadeIn(o, 900); });
      await Promise.all([a.move(ax, 400, 900, 'ease-out'), b.move(bx, 400, 900, 'ease-out')]);
      await T.ask(prompt, () => T.choose([{ el: a.pos, ok: true }, { el: b.pos, ok: false, onWrong: async () => {
        b.pos.animate([{ translate: '0 0' }, { translate: '0 -120px' }, { translate: '0 0' }], 900);
        T.pop(b.x, 300, tr('떠요'));
        await say(wrongLine);
      } }], { prompt }));
      sfx(T, 'bubbles'); bubblesUp(T, a.x, 400, 5, 120);
      const lift = b.move(b.x, 150, 1200).then(() => hide(b));
      T.pop(a.x, 330, tr('가라앉아요'));
      await a.move(land[0], ground, 2400, 'ease-in');
      sfx(T, 'paper_down', () => popSfx(T)); glow(a, 1000); mer.hop(10, 360);
      await Promise.all([lift, say(rightLine)]);
    };
    await sinkRound(stone, wood, X(300, 440), X(480, 560), '무거운 것은 가라앉고, 가벼운 것은 떠요. 어느 것이 바다 밑까지 내려올까요?',
      '나무토막은 가벼워서 둥둥 떠요.', '무거운 돌이 가라앉았어요!', [X(240, 470)], 500);
    await sinkRound(anchor, bottle, X(300, 440), X(480, 560), '이번에는 어느 것이 가라앉을까요?',
      '코르크 병은 가벼워서 둥둥 떠요.', '무거운 닻도 가라앉았어요!', [X(300, 520)], 505);
    await sleep(300);

    /* ===== 2. 열다섯 살, 바다 위로 (톡: 불꽃) ===== */
    await T.sceneCard(tr('열다섯 살'), () => {
      scene('palace');
      palaceBack();
      put(T, granny, X(560, 560), 516, { look: 'hand', to: 'left' });
      put(T, mer, X(400, 430), 512, { look: 'swim', to: 'right' });
      palaceFront();
      camSnap(X(480, 500), 330, 1.3);
    }, mer.pos);
    mer.hop(12, 400);
    await say('언니들은 열다섯 살이 되면 바다 위로 올라갔어요. 드디어 막내 차례예요!');
    granny.wiggle(3, 600);
    await say('조심해서 다녀오렴.');
    await say('네, 할머니. 다녀올게요!');
    mer.turn('left'); sfx(T, 'bubbles'); bubblesUp(T, mer.x, mer.y - 60, 6, 220);
    await mer.move(mer.x + 40, -220, 2000, 'ease-in'); hide(mer);
    let sky;
    await T.sceneCard(tr('밤바다'), () => {
      scene('night_sea');
      put(T, ship, X(640, 560), WATER + 28, { look: 'lantern' });
      put(T, prince, ship.x + BOW_DX, ship.y + DECK_DY, { look: 'stand', to: 'left' });
      put(T, mer, X(330, 420), WATER + 12, { look: 'peek', to: 'right' });
      waterCover(T, 'night_sea', WATER + 20);
      if (P) camSnap(460, 280, 1);
      sky = T.el('rect', { x: X(560, 440) - 170, y: 30, width: 340, height: 200, fill: '#fff', opacity: 0 }, T.world);
    }, ship.pos);
    ship.pos.animate([{ translate: '0 0' }, { translate: '0 3px' }, { translate: '0 0' }], { duration: 2600, iterations: Infinity });
    await say('커다란 배가 있었어요. 오늘은 왕자님 생일이래요.');
    await T.ask('하늘을 톡 눌러 봐요.', () => T.tap(sky, { prompt: '하늘을 톡 눌러 봐요.' }));
    sky.remove();
    const burst = async (f, x, y, h, snd, word) => {
      put(T, f, x, y + h / 2); f.setScale(h / 120);
      if (snd) sfx(T, snd); if (word) T.pop(x + 60, y - h / 2, tr('펑!'));
      f.body.animate([{ transform: 'scale(.2)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], 500);
      await sleep(1800); await T.anim(f.pos, [{ opacity: 1 }, { opacity: 0 }], 400).catch(() => {}); hide(f);
    };
    /* 한 번 톡 → 7발이 저절로 (VISUAL_PLAN §4): 같은 종류는 같은 높이 120. 효과음은 1·4·7발, '펑!' 은 1·7발. 발마다 수면에 같은 색 반사 조각 */
    const FWC = { prop_fw_a: '#F2C94E', prop_fw_b: '#E8A0B8', prop_fw_c: '#8FC1E3', layer_fw_d: '#EBD08A', layer_fw_e: '#F2A7B5' };
    const reflect = (x, c) => [-30, 25].forEach((dx, i) => {
      const e = T.el('ellipse', { cx: x + dx, cy: WATER + 30 + i * 22, rx: 26, ry: 5, fill: c, opacity: 0 }, T._cover || T.world); e.style.pointerEvents = 'none';   /* 물 덮개 안(수면 위)에 */
      e.animate([{ opacity: 0 }, { opacity: .6 }, { opacity: 0 }], { duration: 900, delay: 200 }).finished.then(() => e.remove(), () => e.remove());
    });
    const fx = x => X(x, 460 + (x - 560) * .55);
    /* 뱃머리 왕자 얼굴(x 430~530, y 0~130)은 피한다 */
    const SHOW = [[fw[0], 640, 100, 'pow', true], [fw[1], 780, 70], [fw[2], 300, 130], [fwD[0], 700, 160, 'boom'], [fwE, 230, 70], [fwD[1], 870, 130], [fwA2, 610, 60, 'pow', true]];
    const GAP = [700, 700, 600, 600, 500, 500];
    (async () => {
      for (let i = 0; i < SHOW.length; i++) {
        const [f, x, y, snd, word] = SHOW[i], key = f === fwA2 ? 'prop_fw_a' : f === fwE ? 'layer_fw_e' : fwD.includes(f) ? 'layer_fw_d' : ['prop_fw_a', 'prop_fw_b', 'prop_fw_c'][fw.indexOf(f)];
        burst(f, fx(x), y, 120, snd || null, word); reflect(fx(x), FWC[key]);
        if (i < GAP.length) await sleep(GAP[i]);
      }
    })();
    bob(mer, -3, 600, 3); prince.hop(8, 400);   /* 인어공주는 바다에 있으니 배 위로 뛰지 않고 물결에 흔들리기만 한다 */
    await say('펑! 펑! 불꽃이 하늘에 피었어요.');
    glow(prince, 1200); mer.wiggle(2, 700);
    await say('저 사람이 왕자님이구나.');
    await sleep(300);

    /* ===== 3. 폭풍 (자동) ===== */
    await T.sceneCard(tr('폭풍'), () => {
      scene('night_sea'); tint(T, '#1F2A56', .35);
      put(T, clouds[0], X(300, 380), 150); put(T, clouds[1], X(760, 620), 120);
      T.bg.appendChild(clouds[0].pos); T.bg.appendChild(clouds[1].pos);
      put(T, ship, X(620, 560), WATER + 40, { look: 'tilt' });
      put(T, waves[0], X(420, 500), WATER + 95); put(T, waves[1], X(850, 760), WATER + 105); stormWaves(T, waves);
      { const c = waterCover(T, 'night_sea', WATER + 88); if (c) T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#1F2A56', opacity: .35 }, c); }
      waves.forEach((w, i) => w.pos.animate([{ translate: '-25px 0' }, { translate: '25px -8px' }], { duration: 2000, iterations: Infinity, direction: 'alternate', delay: i * 400 }));
      if (P) camSnap(520, 280, 1);
    }, ship.pos);
    sfx(T, 'whoosh');
    const stormSay = say('밤이 깊자 바람이 세졌어요. 배가 기우뚱!');
    await sleep(1200); T.shake(); sfx(T, 'thud'); ship.wiggle(4, 900);
    await sleep(1100); T.shake(); sfx(T, 'thud'); ship.wiggle(4, 900);
    await stormSay;
    put(T, prince, ship.x - 120, ship.y + DECK_DY, { look: 'stand', to: 'left' });
    await prince.move(ship.x - 120, WATER - 40, 620, 'ease-in');
    sfx(T, 'splash_big'); T.pop(prince.x, WATER - 110, tr('풍덩!'));
    prince.look('float', 'left'); await prince.move(ship.x - 150, WATER + 10, 500, 'ease-out');
    await say('왕자님이 바다에 빠졌어요.');
    put(T, mer, -150, WATER + 12, { look: 'hold', to: 'right' }); sfx(T, 'bubbles');
    const HOLD_DX = mer.w * .45 + prince.w * .5 - 20;
    if (P) follow(prince.x - 60);
    await Promise.all([say('내가 도와줄게요!'), mer.move(prince.x - HOLD_DX, WATER + 12, 1400)]);
    await Promise.all([say('인어공주는 왕자님의 머리를 물 위로 받쳐 주었어요.'), mer.move(mer.x + 60, mer.y, 2600, 'linear'), prince.move(prince.x + 60, prince.y, 2600, 'linear'), (async () => { glow(mer, 1200); })()]);
    await Promise.all([fadeOut(T, mer, 500), fadeOut(T, prince, 500)]);
    await sleep(200);

    /* ===== 4. 모래밭 (자동) ===== */
    await T.sceneCard(tr('모래밭'), () => {
      scene('beach');
      put(T, mer, X(360, 420), 470, { look: 'hide', to: 'right' });
      put(T, rock, X(400, 420), 522);
      put(T, prince, X(580, 560), 512, { look: 'lie' });
      if (P) camSnap(500, 280, 1);
    }, prince.pos);
    bob(mer, -3, 600, 3);
    await say('인어공주는 왕자님을 모래밭에 눕히고, 바위 뒤에 숨었어요.');
    put(T, lady, 1100, 510, { look: 'stand', to: 'left' }); sfx(T, 'step_grass');
    await lady.move(X(720, 660), 510, 1800);
    follow(600);
    lady.hop(8, 360);
    await say('어머, 괜찮으세요?');
    prince.look('wake', 'right'); sfx(T, 'sparkle', () => popSfx(T)); glow(prince, 1000);
    await say('왕자님은 아가씨에게 웃어 주었어요. 인어공주는 보지 못했지요.');
    mer.hop(6, 400);
    await say('왕자님이 깨어났어요. 다행이에요.');
    await T.anim(mer.pos, [{ translate: '0 0', opacity: 1 }, { translate: '0 40px', opacity: 0 }], 600); hide(mer);
    prince.look('stand', 'right'); sfx(T, 'step_grass');
    await Promise.all([prince.move(1150, 510, 1800), lady.move(1180, 510, 1800)]);
    hide(prince); hide(lady);
    await sleep(200);

    /* ===== 5. 할머니의 이야기 (자동) ===== */
    await T.sceneCard(tr('할머니의 이야기'), () => {
      scene('palace');
      palaceBack();
      put(T, granny, X(590, 580), 516, { look: 'talk', to: 'left' });
      put(T, mer, X(400, 430), 514, { look: 'worry', to: 'right' });
      palaceFront();
      camSnap(X(490, 500), 330, 1.3);
    }, granny.pos);
    mer.hop(6, 400);
    await say('할머니, 사람은 어떻게 살아요?');
    granny.look('hand'); bubblesUp(T, granny.x - 40, granny.y - 200, 3, 120);
    await say('사람은 땅 위에서 살고, 우리는 바다에서 살지. 사람에겐 별처럼 영원히 남는 마음이 있단다.');
    granny.look('talk'); mer.look('resolve', 'right');
    await say('나도 왕자님 곁에서 그런 마음을 갖고 싶어요.');
    await sleep(300);

    /* ===== 6. 바다 마녀 (톡: 가마솥) ===== */
    await T.sceneCard(tr('바다 마녀'), () => {
      scene('witch');
      put(T, L.jellyA, X(150, 400), 130); put(T, L.jellyB, X(880, 800), 200);
      [L.jellyA, L.jellyB].forEach((j, i) => j.pos.animate([{ translate: '0 -14px' }, { translate: '0 14px' }], { duration: 3200, delay: i * 900, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' }));
      put(T, witch, X(690, 670), WY, { look: 'stand', to: 'left', s: SC.witch });
      put(T, cauldron, X(480, 560), 526, { look: 'dim', s: .85 });
      put(T, shell, X(780, 740), 506);
      put(T, L.coralB, 30, 552);
      if (P) camSnap(600, 280, 1);
    }, cauldron.pos);
    put(T, mer, X(-150, 330), 520, { look: 'swim', to: 'right' }); sfx(T, 'bubbles'); front(L.coralB);
    await Promise.all([say('인어공주는 소용돌이 너머 바다 마녀를 찾아갔어요.'), mer.move(X(290, 490), 520, 1800)]);
    mer.look('worry', 'right');
    witch.look('hand');
    await say('다리를 갖고 싶다고? 좋아. 대신 네 고운 목소리를 다오.');
    witch.look('stand');
    await say('다리는 조금 흔들흔들할 거야. 그리고 왕자가 다른 사람과 결혼하면, 너는 바다 거품이 된단다.');
    mer.look('resolve', 'right'); mer.hop(8, 400);
    await say('그래도 갈래요.');
    cauldron.pos.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
    await T.ask('가마솥을 톡 눌러 봐요.', () => T.tap(cauldron.pos, { prompt: '가마솥을 톡 눌러 봐요.' }));
    cauldron.look('glow'); sfx(T, 'bubbles'); T.pop(cauldron.x, cauldron.y - 200, tr('보글보글'));
    sparkle(T, cauldron.x, cauldron.y - 120, 110, 20);
    put(T, potion, cauldron.x + 44, cauldron.y - 150, { look: 'empty' }); fadeIn(potion, 400);
    sleep(600).then(() => { potion.look('full'); glow(potion, 1000); sfx(T, 'sparkle'); });
    const pearl = T.el('circle', { cx: 0, cy: 0, r: 8, fill: '#F6ECD8', stroke: '#F2B366', 'stroke-width': 2 }, T.world);
    const mx = mer.x + mer.w * .28, my = mer.y - mer.h * .70;
    await T.anim(pearl, [{ transform: `translate(${mx}px,${my}px)` }, { transform: `translate(${mx + 90}px,${my - 120}px)` }], { duration: 500, easing: 'ease-out' });
    await T.anim(pearl, [{ transform: `translate(${mx + 90}px,${my - 120}px)` }, { transform: `translate(${shell.x}px,${shell.y - 30}px)` }], { duration: 700, easing: 'ease-in' });
    sfx(T, 'sparkle'); pearl.remove(); glow(shell, 1200); mer.look('worry', 'right'); mer.wiggle(2, 600);
    await say('마녀가 목소리를 진주처럼 가져갔어요. 이제 인어공주는 말을 할 수 없어요.');
    await potion.move(mer.x + 36, mer.y - 120, 700); hide(potion);
    await sleep(300);

    /* ===== 7. 다리가 생겼어요 (자동) ===== */
    await T.sceneCard(tr('다리가 생겼어요'), () => {
      scene('steps');
      put(T, mer, X(520, 500), SY, { look: 'sit_tail', s: SC.steps });
      put(T, potion, mer.x + 34 * SC.steps, mer.y - 118 * SC.steps, { look: 'full', s: SC.steps });
      if (P) camSnap(500, 280, 1);
    }, mer.pos);
    const drink = say('새벽, 궁전 계단에서 인어공주는 약을 마셨어요.');
    await sleep(1500);
    await potion.move(mer.x + 22 * SC.steps, mer.y - 150 * SC.steps, 500); sfx(T, 'gulp', () => popSfx(T)); T.pop(mer.x + 40, mer.y - 230 * SC.steps, tr('꿀꺽!')); hide(potion);
    await drink;
    sfx(T, 'sparkle'); sparkle(T, mer.x, mer.y - 100 * SC.steps, 130, 16);
    await T.anim(mer.pos, [{ opacity: 1 }, { opacity: .1 }], 400);
    mer.look('stand', 'right'); mer.pos.style.opacity = ''; fadeIn(mer, 500); glow(mer, 1400);
    await Promise.all([say('꼬리가 사라지고 다리가 생겼어요! 걸음은 흔들흔들.'), (async () => { await sleep(1800); T.pop(mer.x, mer.y - 250 * SC.steps, tr('흔들흔들')); await wobbleWalk(T, mer, X(540, 500), 1800, SY); })()]);
    put(T, prince, 1100, SY, { look: 'stand', to: 'left', s: SC.steps }); sfx(T, 'step_wood');
    await prince.move(X(740, 700), SY, 1500);
    follow(600);
    prince.hop(8, 360);
    await say('누구세요? 어디서 왔어요?');
    sfx(T, 'doop'); T.pop(mer.x, mer.y - mer.h * SC.steps - 30, tr('…')); mer.wiggle(3, 500); mer.hop(6, 400);
    await say('인어공주는 말을 못 해요. 그저 웃었지요.');
    prince.hop(10, 360);
    await say('우리 궁전에서 지내요.');
    prince.turn('right');
    await Promise.all([prince.move(1150, SY, 1600), wobbleWalk(T, mer, 1150, 2000, SY)]);
    hide(prince); hide(mer);
    await sleep(200);

    /* ===== 8. 왕자와 함께 (배움 놀이: 바다·땅 가르기) ===== */
    await T.sceneCard(tr('궁전 정원'), () => {
      scene('garden');
      put(T, L.arch, 960, GF); put(T, L.topiary, 70, GF);
      put(T, prince, X(170, 330), GF, { look: 'stand', to: 'right', s: SC.garden });
      put(T, mer, X(840, 690), GF, { look: 'stand', to: 'left', s: SC.garden });
      put(T, L.rose[0], 40, 560); put(T, L.rose[1], 975, 560, { to: 'right' });
      if (P) camSnap(500, 280, 1);
    }, prince.pos);
    prince.hop(8, 360);
    await say('정원에 바다 친구가 섞였네. 바다에 사는 친구를 찾아봐요.');
    if (P) { prince.pos.style.opacity = '.35'; mer.pos.style.opacity = '.35'; }
    const ROUNDS = [{ ok: 'fish', opts: ['fish', 'butterfly', 'rabbit'] }, { ok: 'shell', opts: ['shell', 'flower', 'bird'] }, { ok: 'starfish', opts: ['starfish', 'tree', 'dog'] }];
    const WRONG = { butterfly: '나비는 하늘을 날아요. 땅 친구예요.', rabbit: '토끼는 땅에서 뛰어요. 땅 친구예요.', flower: '꽃은 땅에서 피어요. 땅 친구예요.',
      bird: '새는 하늘을 날아요. 땅 친구예요.', tree: '나무는 땅에서 자라요. 땅 친구예요.', dog: '강아지는 땅에서 뛰어요. 땅 친구예요.' };
    const RIGHT = { fish: '물고기는 바다에 살아요!', shell: '조개는 바다에 살아요!', starfish: '불가사리는 바다에 살아요!' };
    const IX = X([330, 500, 670], [416, 500, 584]), IY = 330, IH = X(96, 76);
    for (const R of ROUNDS) {
      const order = [...R.opts].sort(() => Math.random() - .5);
      const cards = order.map((name, i) => {
        const a = prop(T, name === 'fish' ? 'fish_a' : 'item_' + name, IH);
        put(T, a, IX[i], 300); hit(T, a, X(66, 52));
        a.pos.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: i * 120, fill: 'backwards' });
        a.move(IX[i], IY, 400 + i * 120);
        return { name, a };
      });
      await sleep(400 + 2 * 120);
      await T.ask('바다에 사는 친구는 누구일까요?', () => T.choose(cards.map(c => ({ el: c.a.pos, ok: c.name === R.ok, onWrong: async () => { await c.a.wiggle(8, 360); await say(WRONG[c.name]); } })), { prompt: '바다에 사는 친구는 누구일까요?' }));
      const g = cards.find(c => c.name === R.ok).a;
      sparkle(T, g.x, g.y - IH / 2, 70, 8);
      await g.move(500, 488, 700, 'ease-in');
      sfx(T, 'splash'); T.pop(500, 430, tr('퐁당!'));
      await T.anim(g.pos, [{ opacity: 1 }, { opacity: 0 }], 300); hide(g);
      cards.filter(c => c.a !== g).forEach(c => fadeOut(T, c.a, 300));
      await say(RIGHT[R.ok]);
      await sleep(300);
    }
    if (P) { prince.pos.style.opacity = ''; mer.pos.style.opacity = ''; }
    prince.look('stand');
    prince.hop(8, 360); mer.hop(6, 360);
    await say('바다에서 온 아이 같아요. 내 귀여운 동생처럼 지내요.');
    put(T, mer, X(430, 430), GF, { look: 'dance', to: 'right', s: SC.garden });
    put(T, prince, X(580, 580), GF, { look: 'dance', to: 'left', s: SC.garden });
    front(...L.rose);
    petals(T, 6, X([120, 220, 800, 900], [330, 370, 640, 680]));   /* 얼굴 위는 지나지 않게 양옆에서만 */
    sfx(T, 'giggle_xylo');
    await Promise.all([say('인어공주는 흔들흔들해도 왕자님과 함께 춤추었어요.'), (async () => {
      for (let i = 0; i < 2; i++) {
        await Promise.all([mer.move(mer.x - 30, GF, 600), prince.move(prince.x - 30, GF, 600)]);
        await Promise.all([mer.move(mer.x + 30, GF, 600), prince.move(prince.x + 30, GF, 600)]);
        if (!i) T.pop(mer.x, GF - 250 * SC.garden, tr('흔들흔들'));
      }
    })()]);
    await sleep(300);

    /* ===== 9. 왕자의 결혼 (자동) ===== */
    await T.sceneCard(tr('왕자의 결혼'), () => {
      scene('deck');
      put(T, L.arch, X(565, 540), 520);                    /* 꽃 아치: 왕자와 공주 사이 뒤 */
      put(T, prince, X(480, 480), 518, { look: 'stand', to: 'right', s: SC.deck });
      put(T, lady, X(650, 600), 518, { look: 'wed', to: 'left', s: SC.deck });
      put(T, mer, X(210, 340), 520, { look: 'sad', to: 'right', s: SC.deck });   /* 임시: worry 는 꼬리 자세라 사람 다리 모습과 안 맞음. 왕자 쪽을 보는 옆모습 그림이 생기면 교체 */
      if (P) camSnap(500, 280, 1);
    }, prince.pos);
    sfx(T, 'bell'); sleep(600).then(() => { sfx(T, 'bell'); petals(T, 8, X([60, 150, 260, 880, 960], [300, 360, 420, 640, 700]), 5000); }); prince.hop(10, 360);
    lady.hop(8, 360);
    await say('당신이 모래밭에서 저를 구해 준 분이군요!');
    follow(400);
    mer.wiggle(2, 900);
    await say('왕자님은 이웃 나라 공주님과 결혼했어요. 인어공주는 말없이 웃었어요. 마음은 아팠지요.');
    glow(mer, 1000);
    await sleep(400);

    /* ===== 10. 언니들의 단검 (자동) ===== */
    await T.sceneCard(tr('새벽 바다'), () => {
      scene('dawn_sea');
      put(T, sun, 820, WATER + 70); T.bg.appendChild(sun.pos);
      put(T, ship, 720, WATER + 46, { look: 'flower' });
      put(T, prince, ship.x + 40, ship.y + DECK_DY, { look: 'sleep', to: 'left' });
      put(T, lady, ship.x + 150, ship.y + DECK_DY, { look: 'sleep', to: 'right' });
      put(T, mer, ship.x + BOW_DX, ship.y + DECK_DY, { look: 'sad', to: 'right' });   /* 잠든 왕자 쪽(오른쪽)을 본다 */
      put(T, sisters, 250, WATER + 90, { look: 'short' }); sisters.pos.style.opacity = '0';
      waterCover(T, 'dawn_sea', WATER + 38);
      if (P) camSnap(300, 280, 1);
    }, sisters.pos);
    sfx(T, 'bubbles'); sisters.pos.style.opacity = ''; fadeIn(sisters, 900);
    await Promise.all([say('새벽, 배 옆에 언니들이 올라왔어요. 긴 머리가 짧아졌어요.'), sisters.move(250, WATER + 30, 1200, 'ease-out')]);
    put(T, dagger, sisters.x - sisters.w * .40, WATER - 12); fadeIn(dagger, 300);
    sisters.hop(8, 400);
    await say('마녀에게 머리카락을 주고 이 단검을 받았어.');
    sisters.wiggle(2, 800);
    await say('해가 뜨기 전에 이걸 왕자에게 쓰면 너는 다시 인어가 돼. 그러지 않으면 거품이 되는 거야.');
    follow(560);
    sfx(T, 'swish');
    await dagger.move(mer.x, mer.y - mer.h * .38, 900);
    await Promise.all([say('인어공주는 잠든 왕자님과 공주님을 보았어요. 그리고 고개를 저었지요.'), (async () => {
      follow(ship.x); glow(prince, 1400); glow(lady, 1400); await sleep(2200);
      follow(560); mer.look('shake'); await mer.wiggle(4, 700); await mer.wiggle(4, 700);
    })()]);
    mer.look('throw', 'left'); sfx(T, 'whoosh');
    const SP = [430, WATER + 40];
    await dagger.move(mer.x - 120, mer.y - 260, 450, 'ease-out');
    await dagger.move(SP[0], SP[1], 650, 'ease-in'); hide(dagger);
    sfx(T, 'splash'); T.pop(SP[0], WATER - 50, tr('풍덩!')); rippleAt(T, SP[0], WATER + 20); glints(T, SP[0], WATER + 10);
    sun.move(820, WATER - 40, 2500, 'ease-out');
    /* 해돋이 햇살 쐐기 5개 (해 뒤, 앰버 한 장씩) */
    [-60, -30, 0, 30, 60].forEach((deg, i) => {
      const a = (deg - 90) * Math.PI / 180, a1 = a - .06, a2 = a + .06, cx = 820, cy = WATER - 40, Rr = 420;
      const w = T.el('polygon', { points: `${cx},${cy} ${cx + Math.cos(a1) * Rr},${cy + Math.sin(a1) * Rr} ${cx + Math.cos(a2) * Rr},${cy + Math.sin(a2) * Rr}`, fill: '#F2B366', opacity: 0 }, T.bg);
      T.bg.insertBefore(w, sun.pos);
      w.animate([{ opacity: 0 }, { opacity: .18 }], { duration: 2500, delay: i * 120, fill: 'forwards' });
    });
    const warm = tint(T, '#F2B366', 0); T.anim(warm, [{ opacity: 0 }, { opacity: .18 }], 2500).catch(() => {}); warm.setAttribute('opacity', .18);
    if (T._cover) { const w2 = T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#F2B366', opacity: .18 }, T._cover); T.anim(w2, [{ opacity: 0 }, { opacity: .18 }], 2500).catch(() => {}); }
    sfx(T, 'sparkle');
    mer.look('sad', 'left');
    await say('인어공주는 단검을 칼집째 바다에 던졌어요. 물결이 붉은 금빛으로 반짝였어요. 해가 떠올랐어요.');
    const bx = mer.x, by = mer.y;
    await fadeOut(T, mer, 500);
    put(T, mer, bx, by, { look: 'bubble', s: .6 }); fadeIn(mer, 600);
    sfx(T, 'slide_up'); bubblesUp(T, bx, by - 80, 8, 260); sparkle(T, bx, by - 110, 120, 12); sleep(250).then(() => sparkle(T, bx, by - 150, 160, 12, true));   /* 거품 반짝 2배 */
    sleep(1200).then(() => T.pop(bx + 40, 230, tr('둥실')));
    await Promise.all([say('인어공주는 반짝이는 거품이 되어 하늘로 둥실 올라갔어요.'), mer.move(bx + 40, 90, 3200, 'ease-in-out')]);
    fadeOut(T, sisters, 800); await fadeOut(T, mer, 600);
    await sleep(300);

    /* ===== 11. 바닷바람이 되어 (톡: 인사) ===== */
    await T.sceneCard(tr('바닷바람'), () => {
      scene('morning_sea');
      put(T, ship, X(640, 600), WATER11 + 28, { look: 'flower' });
      put(T, prince, ship.x - SHIP_W * .10, ship.y + DECK_DY, { look: 'stand', to: 'left' });
      put(T, lady, ship.x + 60, ship.y + DECK_DY, { look: 'wed', to: 'left' });
      put(T, mer, X(340, 410), 300, { look: 'bubble', to: 'right', s: 1 });   /* 배 위 왕자 쪽(오른쪽)을 본다 */
      put(T, gulls[0], X(150, 250), 120); put(T, gulls[1], X(820, 560), 90);
      gulls.forEach((g, i) => g.pos.animate([{ translate: '-30px 0' }, { translate: '30px -10px' }], { duration: 4000, iterations: Infinity, direction: 'alternate', delay: i * 700 }));
      if (P) camSnap(470, 280, 1);
    }, mer.pos);
    mer.pos.animate([{ translate: '0 0' }, { translate: '0 6px' }], { duration: 1600, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out' });
    hit(T, mer, 70);
    await say('인어공주는 부드러운 바닷바람이 되었어요. 길 잃은 배의 돛을 밀어 주고, 더운 날엔 시원한 바람을 보내지요.');
    await T.ask('거품 빛을 톡 눌러 인사해요.', () => T.tap(mer.pos, { prompt: '거품 빛을 톡 눌러 인사해요.' }));
    sfx(T, 'blow_long', () => sfx(T, 'whoosh'));
    [[wind[0], mer.x + 70, 220, ship.x + 150, 200, 1400], [wind[1], mer.x + 50, 300, ship.x + 120, 280, 1600]].forEach(async ([w, x0, y0, x1, y1, ms]) => {
      put(T, w, x0, y0); fadeIn(w, 300);
      await w.move(x1, y1, ms, 'ease-in-out'); await fadeOut(T, w, 300);
    });
    T.pop(mer.x + 130, 170, tr('휘잉~'));
    ship.body.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }], 900);
    ship.hop(10, 600); ship.move(ship.x - 60, ship.y, 1800);
    prince.hop(10, 460); lady.hop(10, 460); gulls.forEach(g => g.hop(16, 500));
    glow(mer, 1400); mer.hop(14, 500); T.confetti(); sfx(T, 'tada', () => sparkleSfx(T));
    await say('사랑하는 마음은 사라지지 않아요. 안녕, 또 만나요!');
    await say('사랑하는 마음으로 양보하면, 그 마음은 좋은 일이 되어 남아요.');
    T.finale(); await sleep(1500);
    return '사랑하는 마음으로 양보하면, 그 마음은 좋은 일이 되어 남아요.';
  }

  Tale.mount({ title: '인어공주', subtitle: '사랑하는 마음은 사라지지 않아요', read: true, run: T => run(Tale.api) });
})();
