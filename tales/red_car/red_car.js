/* 나의 빨간 자동차 — 창작 동화(사용자 원고). 기획: tales/red_car/PLAN.md, 상세: SPEC.md (2026-10-21)
   톡 3번(5장 불꽃 3개 · 8장 고리 · 10장 이현이), 배움 놀이 2개(1장 빨간 것 찾기 · 9장 줄 순서 묻기(맨 앞·가운데·맨 뒤 중 하나)), 연타 없음, 줄거리 선택 없음. 교훈 대사 없음.
   두 세계: 사람 세계(1·2·10장)에서 자동차는 손에 쥐는 장난감(S_TOY = .32), 장난감 세상(3~9장)에서는 화면 주인공 크기(scale 1). 3장 머리에서 카메라가 자동차 눈높이로 내려간다(줌).
   크기: 같은 자동차는 자세가 달라도 바퀴 지름이 같다(HT 표). 자동차끼리는 길이 비율 red 1.0 : police 1.1 : tow 1.3 : amb 1.4 : fire 1.6.
   자동차 얼굴은 점 눈 둘뿐. 소품은 얼굴 없음. 사이렌은 효과음이 아니라 배역 목소리 의성어(vo).
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다. 파일이 생기면 코드를 고치지 않아도 그림으로 바뀐다.
   그림: assets/v3w/rc_*.webp (목록 tools/app/gen/jobs_red_car.json) */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이(post_tale.py 가 잰 값, tales/red_car/ASP.txt). preload 가 실제 비율로 다시 덮어쓴다 */
  const ASP = {
    rc_child_stand: 0.4683, rc_red_run: 1.6854, rc_prop_block: 0.9083, rc_prop_duck: 1.0867, rc_prop_butterfly_open: 1.2317, rc_prop_house: 0.8417,
    rc_prop_flame: 0.5817, rc_prop_smoke: 0.8067, rc_prop_water: 1.9608, rc_thief_a_run: 0.7217, rc_bear_sit: 0.695, rc_rabbit_sit: 0.6083, rc_child_eat: 0.7567,
    rc_child_sleep: 2.0316, rc_child_point: 0.6233, rc_child_run: 0.6083, rc_child_cry: 0.4683, rc_child_turn: 0.5117, rc_child_hug: 0.5167, rc_red_joy: 1.5957,
    rc_red_tired: 1.7078, rc_red_hooked: 1.5679, rc_police_run: 1.6854, rc_fire_run: 1.9027, rc_amb_run: 1.6822, rc_tow_run: 1.6605, rc_thief_b_run: 0.7233,
    rc_thief_a_hands: 0.7367, rc_bear_off: 0.695, rc_rabbit_off: 0.5667, rc_prop_butterfly_fold: 0.6967, rc_police_joy: 1.6187, rc_fire_spray: 1.8595,
    rc_fire_joy: 1.7893, rc_amb_open: 1.6791, rc_amb_joy: 1.5411, rc_tow_pull: 1.7647, rc_tow_joy: 1.5901, rc_thief_b_hands: 0.725, rc_prop_hook: 0.3783,
    /* 시각 재기획(2026-10-22, PLAN.md '시각 재기획') 레이어 소품 */
    rc_layer_arch: 0.7283, rc_layer_tower: 0.2367, rc_layer_crayons: 0.5883, rc_layer_crayon_front: 0.305, rc_layer_buttons: 0.76, rc_layer_train: 2.0737, rc_layer_top: 0.8183,
    rc_layer_ball: 0.9933, rc_layer_spring: 1.7308, rc_layer_flags: 4.7872, rc_layer_signal: 0.3133, rc_layer_house_blue: 0.8383, rc_layer_rings: 0.6417, rc_layer_dice: 0.8983,
    rc_layer_toybox: 1.0633, rc_layer_flowerbed: 1.7241, rc_layer_grass_front: 1.6129, rc_layer_meadow: 1.0467, rc_layer_ladybug: 1.105, rc_layer_snail: 1.345, rc_layer_sand_tools: 1.0617,
    /* 장난감나라 세상별 소품·인형(2026-10-24, PLAN '장난감나라 컨셉 재기획' §4). 값은 preload 가 실제 그림 비율로 덮어씀 */
    rc_layer_bricks: 1.2367, rc_layer_yarn: 1.22, rc_layer_tyres: 0.9433, rc_prop_house_crayon: 0.84,
    rc_layer_doll_teddy_giant: 0.7317, rc_layer_doll_rabbit: 0.5417, rc_layer_doll_duck: 0.69, rc_layer_doll_elephant: 0.975,
  };
  /* 장난감 세상 길이(px, scale 1). 기획 길이비 150:165:240:210:195 를 그대로 두면 큰 차(소방·구급·견인)의 바퀴가 빨간 차보다 27~31% 커진다(그림에서 잰 값).
     바퀴를 빨간 차의 +20% 안(≈40px)에 두려고 큰 차만 길이를 줄였다: 소방 240→218, 구급 210→191, 견인 195→183 (비율 1 : 1.1 : 1.22 : 1.27 : 1.45) */
  const LEN = { red: 150, police: 165, fire: 218, amb: 191, tow: 183 };
  /* 높이: 인물은 얼굴 폭, 자동차는 길이·바퀴 지름으로 맞춘다(SPEC §2-2). 자동차 기준 자세는 preload 뒤 calcHT() 가 길이에서 계산 */
  const HT = {
    rc_child_stand: 230, rc_child_point: 236, rc_child_run: 228, rc_child_cry: 230, rc_child_turn: 222, rc_child_hug: 217, rc_child_eat: 235, rc_child_sleep: 130,
    rc_thief_a_run: 76, rc_thief_b_run: 76, rc_thief_a_hands: 78, rc_thief_b_hands: 78, rc_bear_sit: 56, rc_rabbit_sit: 56, rc_bear_off: 56, rc_rabbit_off: 55.2,   /* 머리 폭을 sit 과 맞춤(곰 .672/.675, 토끼 .495/.502) */
    /* 레이어 소품 높이(무대 px, PLAN 시각 재기획 §3). 장면이 달라도 같은 소품은 같은 높이 */
    rc_layer_arch: 320, rc_layer_tower: 300, rc_layer_crayons: 220, rc_layer_crayon_front: 260, rc_layer_buttons: 110, rc_layer_train: 70, rc_layer_top: 120, rc_layer_ball: 110,
    rc_layer_spring: 90, rc_layer_flags: 80, rc_layer_signal: 170, rc_layer_house_blue: 190, rc_layer_rings: 160, rc_layer_dice: 80, rc_layer_toybox: 150, rc_layer_flowerbed: 90,
    rc_layer_grass_front: 70, rc_layer_meadow: 90, rc_layer_ladybug: 18, rc_layer_snail: 22, rc_layer_sand_tools: 90,
    rc_layer_bricks: 80, rc_layer_yarn: 90, rc_layer_tyres: 90, rc_prop_house_crayon: 170,   /* 블록 더미=옛 주사위 자리·높이, 색칠 집=옛 블록 집과 같은 틀 */
    /* 봉제 인형 세상 인형(머리 폭을 환자 곰 rc_bear_sit 머리와 같게 잼, 큰 곰인형은 환자 곰의 4.5배) */
    rc_layer_doll_teddy_giant: 250, rc_layer_doll_rabbit: 120, rc_layer_doll_duck: 72, rc_layer_doll_elephant: 96,   /* 행인 머리 폭 ≈ 34(환자 곰 머리 26의 1.3배 — 화면에서 읽히게, 세 행인끼리 같음. 토끼는 귀 포함 높이). 큰 곰 머리 ≈ 142 = 환자 곰 머리의 5.5배 */
    rc_prop_butterfly_open: 60, rc_prop_butterfly_fold: 42,   /* 나비: 몸통 길이를 open 과 같게(몸통이 open 은 그림 높이의 .457, fold 는 .652 → 60×.457/.652) */ rc_prop_block: 42, rc_prop_duck: 46, rc_prop_house: 170, rc_prop_flame: 90, rc_prop_smoke: 40, rc_prop_water: 76, rc_prop_hook: 60,
  };
  function calcHT() {
    ['red', 'police', 'fire', 'amb', 'tow'].forEach(k => { HT['rc_' + k + '_run'] = LEN[k] / ASP['rc_' + k + '_run']; });
    /* 자세별 배율 = (자세 그림 높이/기준 그림 높이) × (기준 바퀴 지름/자세 바퀴 지름) — 2026-10-21 첫 그림 도착 뒤 webp 에서 잰 값. 새 그림이 오면 다시 잰다 */
    const K = { red: { joy: 1.056, tired: 1.006, hooked: 1.080 }, police: { joy: 1.060 }, fire: { spray: .993, joy: 1.060 }, amb: { open: 1.0, joy: 1.092 }, tow: { pull: .988, joy: 1.047 } };
    Object.entries(K).forEach(([k, ps]) => Object.entries(ps).forEach(([p, v]) => { HT['rc_' + k + '_' + p] = HT['rc_' + k + '_run'] * v; }));
  }
  /* 그림이 보는 쪽 (그림을 직접 보고 정함; 이 동화는 자동차를 뒤집지 않는다) */
  const NAT = { rc_child_eat: 'right', rc_child_run: 'right', rc_child_point: 'right', rc_child_sleep: 'right',
    rc_red_run: 'right', rc_red_joy: 'right', rc_red_tired: 'right', rc_red_hooked: 'right',
    rc_police_run: 'right', rc_police_joy: 'right', rc_fire_run: 'right', rc_fire_spray: 'right', rc_fire_joy: 'right',
    rc_amb_run: 'right', rc_amb_open: 'right', rc_amb_joy: 'right', rc_tow_run: 'right', rc_tow_pull: 'right', rc_tow_joy: 'right',
    rc_thief_a_run: 'right', rc_thief_b_run: 'right', rc_prop_duck: 'right', rc_prop_water: 'right', rc_prop_hook: 'right', rc_layer_train: 'left',
    rc_layer_doll_rabbit: 'right', rc_layer_doll_duck: 'right', rc_layer_doll_elephant: 'left' };
  const TRAIN_Y = 330;                 // 7·9장 장난감 기차 바퀴 y: v3 기찻길 놀이판의 뒤 직선 레일(화면 y 312~332) 위
  const FL = 505;                       // 바닥(바퀴·발끝 y)
  const S_TOY = .42;                    // 사람 세계에서 자동차 다섯 대에 공통으로 쓰는 축소 비율. 그 밖에 s 를 쓰지 않는다
  const BGS = ['rc_bg_room_v2', 'rc_bg_yard_v2', 'rc_bg_gate_v2', 'rc_bg_road_a_v2', 'rc_bg_road_b_v2', 'rc_bg_road_c_v2', 'rc_bg_road_long_v2', 'rc_bg_road_hill_v2', 'rc_bg_playground_v2',
    'rc_bg_road_a_v3', 'rc_bg_road_b_v3', 'rc_bg_road_c_v3', 'rc_bg_road_long_v3', 'rc_bg_road_hill_v4'];   // 2026-10-22 시각 재기획: 옛 rc_bg_* 는 쓰지 않음. _v3: 장난감나라 세상별 컨셉(2026-10-24, PLAN '장난감나라 컨셉 재기획')
  const src = k => AS + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const artOK = {}, bgOK = {};          // preload 결과(그림이 실제로 있는지) — 없으면 자리표시

  /* ================= 자리표시(그림이 없을 때) ================= */
  const WHO = { child: '이현이', red: '빨간 자동차', police: '경찰차', fire: '소방차', amb: '구급차', tow: '견인차', thief_a: '도둑 A', thief_b: '도둑 B', bear: '곰 인형', rabbit: '토끼 인형' };
  const POSE = { stand: '서기', eat: '밥 먹기', sleep: '잠', point: '가리킴', run: '달리기', cry: '울음', turn: '돌아봄', hug: '안기', joy: '신남', tired: '지침', hooked: '걸림',
    spray: '물 뿌리기', open: '문 열림', pull: '끌기', hands: '손 듦', sit: '앉기', off: '내림' };
  const PROPN = { rc_prop_block: '파란 블록', rc_prop_duck: '노란 오리', rc_prop_butterfly_open: '나비(펴짐)', rc_prop_butterfly_fold: '나비(접힘)', rc_prop_house: '블록 집',
    rc_prop_flame: '불꽃', rc_prop_smoke: '연기', rc_prop_water: '물줄기', rc_prop_hook: '고리' };
  const CARC = { red: '#A93B32', police: '#F4F6FA', fire: '#A93B32', amb: '#F4F6FA', tow: '#E8703A' };
  const CREAM = '#F6ECD8', INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";

  function placeholder(T, parent, f, w, h) {
    const g = T.el('g', {}, parent);
    const R = (x, y, ww, hh, rx, fill, extra = {}) => T.el('rect', { x, y, width: ww, height: hh, rx, fill, ...extra }, g);
    const C = (cx, cy, r, fill, extra = {}) => T.el('circle', { cx, cy, r, fill, ...extra }, g);
    const E = (cx, cy, rx, ry, fill) => T.el('ellipse', { cx, cy, rx, ry, fill }, g);
    const Pth = (d, fill, extra = {}) => T.el('path', { d, fill, ...extra }, g);
    const label = (txt, cx, cy, fill = CREAM, fs) => {
      const t = T.el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': fs || Math.max(11, Math.min(20, h * .075)), 'font-weight': 700, fill, 'font-family': FONT, text: T.tr(txt) }, g);
      t.classList.add('phl'); t.dataset.cx = cx; t.dataset.cy = cy; t.setAttribute('transform', `translate(${cx},${cy})`);
    };
    const star = (cx, cy, r) => Pth(`M${cx} ${cy - r} L${cx + r * .3} ${cy - r * .3} L${cx + r} ${cy} L${cx + r * .3} ${cy + r * .3} L${cx} ${cy + r} L${cx - r * .3} ${cy + r * .3} L${cx - r} ${cy} L${cx - r * .3} ${cy - r * .3}Z`, '#D9A94E');
    const m = /^rc_(child|red|police|fire|amb|tow|thief_a|thief_b|bear|rabbit)_(.+)$/.exec(f);
    if (m) {
      const [, who, pose] = m, name = WHO[who] + ' ' + (POSE[pose] || pose);
      if (who === 'child') {
        const r = Math.min(h * .2, w * .22);
        if (pose === 'sleep') {                                    // 누운 상자: 머리 왼쪽, 몸 오른쪽
          R(w * .22, h * .3, w * .76, h * .6, 12, '#D9A94E'); R(w * .62, h * .55, w * .36, h * .35, 8, '#3E7CB1');
          C(r + 8, h * .55, Math.min(r, h * .4), '#F3D9B8'); Pth(`M8 ${h * .5} Q${r + 8} ${h * .02} ${2 * r + 8} ${h * .5}Z`, INK);
          label(name, w * .55, h * .62, INK, 14); return g;
        }
        const sit = pose === 'eat';
        if (sit) R(w * .05, h * .6, w * .9, h * .4, 8, '#8a5a38');
        R(w / 2 - r * 1.2, 2 * r - 4, r * 2.4, h * .38, 10, '#D9A94E');
        R(w / 2 - r * 1.1, 2 * r + h * .34, r * 1.0, h - (2 * r + h * .34), 4, '#3E7CB1'); R(w / 2 + r * .1, 2 * r + h * .34, r * 1.0, h - (2 * r + h * .34), 4, '#3E7CB1');
        C(w / 2, r + 2, r, '#F3D9B8'); Pth(`M${w / 2 - r} ${r + 2} Q${w / 2} ${-r * .5} ${w / 2 + r} ${r + 2}Z`, INK);
        [-1, 1].forEach(s => C(w / 2 + s * r * .35 + (NAT[f] === 'right' ? r * .2 : 0), r + 4, 2.6, INK));
        if (pose === 'cry') Pth(`M${w / 2 - r * .4} ${r + 12} q-4 14 0 18`, 'none', { stroke: '#8FB6D6', 'stroke-width': 3 });
        label(name, w / 2, 2 * r + h * .2, INK, Math.max(11, Math.min(15, w / 5)));
        return g;
      }
      if (['red', 'police', 'fire', 'amb', 'tow'].includes(who)) {
        const body = CARC[who], by = h * .08, bh = h * .62, wr = h * .17;
        const rot = pose === 'hooked' ? `rotate(-18 ${w * .5} ${h})` : '';
        const gg = T.el('g', { transform: rot }, g);
        const RR = (x, y, ww, hh, rx, fill) => T.el('rect', { x, y, width: ww, height: hh, rx, fill }, gg);
        if (who === 'tow') RR(w * .02, h * .0, w * .34, h * .09, 4, '#6B4A32');                       // 갈색 팔 띠
        RR(w * .02, by, w * .96, bh, 14, body);
        if (who === 'police') { RR(w * .02, by + bh * .55, w * .96, bh * .2, 2, '#1F2A56'); T.el('circle', { cx: w * .42, cy: by - 3, r: 5, fill: '#A93B32' }, gg); T.el('circle', { cx: w * .58, cy: by - 3, r: 5, fill: '#1F2A56' }, gg); }
        if (who === 'fire') { RR(w * .06, by - 2, w * .5, h * .07, 2, '#F4F6FA'); RR(w * .02, by + bh * .6, w * .96, bh * .14, 2, '#F4F6FA'); }
        if (who === 'amb') { RR(w * .22, by + bh * .22, w * .1, bh * .5, 1, '#A93B32'); RR(w * .12, by + bh * .42, w * .3, bh * .1, 1, '#A93B32'); }
        RR(w * .52, by + bh * .12, w * .4, bh * .36, 6, CREAM);
        if (pose === 'joy') { star(w * .64, by + bh * .3, 6); star(w * .8, by + bh * .3, 6); }
        else if (pose === 'tired') [w * .64, w * .8].forEach(x => T.el('path', { d: `M${x - 6} ${by + bh * .3} q6 6 12 0`, fill: 'none', stroke: INK, 'stroke-width': 3 }, gg));
        else [w * .64, w * .8].forEach(x => T.el('circle', { cx: x, cy: by + bh * .3, r: 3.4, fill: INK }, gg));
        [w * .22, w * .78].forEach(x => { T.el('circle', { cx: x, cy: h - wr, r: wr, fill: '#1F2A56' }, gg); T.el('circle', { cx: x, cy: h - wr, r: wr * .38, fill: CREAM }, gg); });
        label(name, w * .3, by + bh * .55, who === 'police' || who === 'amb' ? INK : CREAM, Math.max(11, Math.min(17, h * .09)));
        return g;
      }
      if (who === 'thief_a' || who === 'thief_b') {
        const col = who === 'thief_a' ? '#1F2A56' : '#6B4A32', r = Math.min(w * .3, h * .2);
        R(w * .2, 2 * r - 2, w * .6, h - 2 * r + 2, 6, col); for (let i = 0; i < 4; i++) R(w * .2, 2 * r + 4 + i * (h * .18), w * .6, 5, 1, CREAM);
        C(w / 2, r, r, '#F3D9B8'); R(w / 2 - r, r * .7, 2 * r, r * .4, 3, INK); [-1, 1].forEach(s => C(w / 2 + s * r * .4, r * .9, 2.4, CREAM));
        if (pose === 'hands') [-1, 1].forEach(s => R(w / 2 + s * w * .36 - 3, 2 * r - 8, 6, h * .32, 3, col));
        label(WHO[who], w / 2, h * .62, CREAM, 10); return g;
      }
      const bear = who === 'bear', rr = Math.min(w * .3, h * .24), col = bear ? '#6B4A32' : CREAM;
      E(w / 2, h * .66, w * .3, h * .3, col); C(w / 2, rr + 3, rr, col);
      if (bear) [-1, 1].forEach(s => C(w / 2 + s * rr * .8, 6, rr * .32, col)); else [-1, 1].forEach(s => E(w / 2 + s * rr * .45, 2, rr * .2, rr * .75, col));
      [-1, 1].forEach(s => C(w / 2 + s * rr * .38, rr + 2, 2.6, INK));
      label(WHO[who], w / 2, h * .72, bear ? CREAM : INK, 10); return g;
    }
    const nm = PROPN[f] || f.replace('rc_prop_', '');
    switch (f) {
      case 'rc_prop_block': R(0, h * .12, w, h * .88, 6, '#3E7CB1'); [.3, .7].forEach(k => C(w * k, h * .12, w * .1, '#F6ECD8')); label(nm, w / 2, h * .62, CREAM, 11); break;
      case 'rc_prop_duck': E(w * .46, h * .62, w * .4, h * .3, '#F2C94E'); C(w * .66, h * .3, w * .2, '#F2C94E'); Pth(`M${w * .84} ${h * .3} l${w * .14} 4 l-${w * .14} 6Z`, '#E8703A'); C(w * .7, h * .26, 2.6, INK); label(nm, w * .42, h * .66, INK, 11); break;
      case 'rc_prop_butterfly_open': E(w * .3, h * .45, w * .26, h * .4, '#F2C94E'); E(w * .7, h * .45, w * .26, h * .4, '#F2C94E'); R(w * .47, h * .2, w * .06, h * .6, 3, '#6B4A32'); break;
      case 'rc_prop_butterfly_fold': E(w * .5, h * .5, w * .24, h * .42, '#F2C94E'); R(w * .47, h * .1, w * .06, h * .8, 3, '#6B4A32'); break;
      case 'rc_prop_house': R(w * .08, h * .35, w * .84, h * .65, 4, '#F2C94E'); Pth(`M${w * .02} ${h * .38} L${w * .5} ${h * .02} L${w * .98} ${h * .38}Z`, '#E8703A'); R(w * .4, h * .65, w * .2, h * .35, 2, '#6B4A32'); label(nm, w / 2, h * .55, INK, 12); break;
      case 'rc_prop_flame': Pth(`M${w / 2} 0 C${w * .95} ${h * .4} ${w * .9} ${h} ${w / 2} ${h} C${w * .1} ${h} ${w * .05} ${h * .4} ${w / 2} 0Z`, '#E8703A'); Pth(`M${w / 2} ${h * .4} C${w * .75} ${h * .6} ${w * .7} ${h} ${w / 2} ${h} C${w * .3} ${h} ${w * .25} ${h * .6} ${w / 2} ${h * .4}Z`, '#F2B366'); break;
      case 'rc_prop_smoke': E(w * .3, h * .62, w * .26, h * .3, '#C9C5BC'); E(w * .6, h * .5, w * .3, h * .38, '#C9C5BC'); E(w * .8, h * .7, w * .18, h * .24, '#C9C5BC'); break;
      case 'rc_prop_water': Pth(`M0 ${h * .2} Q${w * .5} ${-h * .3} ${w} ${h * .9}`, 'none', { stroke: '#9EC6E2', 'stroke-width': Math.max(8, h * .3), 'stroke-linecap': 'round' }); label(nm, w * .5, h * .5, '#1F2A56', 11); break;
      case 'rc_prop_hook': Pth(`M${w * .5} 0 L${w * .5} ${h * .6} Q${w * .5} ${h * .98} ${w * .15} ${h * .8}`, 'none', { stroke: '#8D8A84', 'stroke-width': Math.max(6, w * .16), 'stroke-linecap': 'round' }); break;
      default: R(0, 0, w, h, Math.min(w, h) * .2, '#D9A94E'); label(nm, w / 2, h / 2, INK, 13);
    }
    return g;
  }
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    const g = placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
    return g.parentNode;
  }
  const BGPH = {
    rc_bg_room: { sky: '#F6ECD8', gnd: '#D9A94E', name: '이현이 방', shapes: () => [['rect', { x: 640, y: 100, width: 220, height: 190, rx: 4, fill: '#9EC6E2' }], ['rect', { x: 100, y: 330, width: 220, height: 80, rx: 6, fill: '#E8703A' }]] },
    rc_bg_yard: { sky: '#EEF3F7', gnd: '#9DBB7A', name: '마당 풀밭', shapes: () => [['circle', { cx: 200, cy: 470, r: 18, fill: '#E8703A' }], ['circle', { cx: 760, cy: 480, r: 18, fill: '#F2C94E' }], ['circle', { cx: 470, cy: 500, r: 14, fill: '#F6ECD8' }]] },
    rc_bg_gate: { sky: '#EEF3F7', gnd: '#9DBB7A', name: '장난감 세상 입구', shapes: () => [...Array.from({ length: 8 }, (_, i) => ['rect', { x: 340 + i * 80, y: 440, width: 80, height: 60, fill: i % 2 ? '#F6ECD8' : '#F2C94E' }]), ['rect', { x: 640, y: 160, width: 30, height: 280, fill: '#1F2A56' }], ['rect', { x: 790, y: 160, width: 30, height: 280, fill: '#1F2A56' }], ['path', { d: 'M640 170 Q730 40 820 170Z', fill: '#A93B32' }]] },
    rc_bg_road_a: { sky: '#EEF3F7', gnd: '#F2C94E', name: '장난감 길 A', shapes: () => [['rect', { x: 120, y: 200, width: 40, height: 220, fill: '#6B4A32' }], ['circle', { cx: 140, cy: 190, r: 60, fill: '#3F6B4F' }], ['rect', { x: 800, y: 220, width: 36, height: 200, fill: '#6B4A32' }], ['circle', { cx: 818, cy: 210, r: 54, fill: '#3F6B4F' }]] },
    rc_bg_road_b: { sky: '#EEF3F7', gnd: '#F2C94E', name: '장난감 길 B (오른쪽 빈 터)', shapes: () => [['rect', { x: 100, y: 230, width: 36, height: 190, fill: '#6B4A32' }], ['circle', { cx: 118, cy: 220, r: 52, fill: '#3F6B4F' }], ['rect', { x: 700, y: 440, width: 280, height: 60, fill: '#F6ECD8' }]] },
    rc_bg_road_c: { sky: '#EEF3F7', gnd: '#F2C94E', name: '장난감 길 C (병원)', shapes: () => [['rect', { x: 760, y: 130, width: 220, height: 290, rx: 4, fill: '#F4F6FA' }], ['rect', { x: 850, y: 170, width: 40, height: 100, fill: '#A93B32' }], ['rect', { x: 820, y: 200, width: 100, height: 40, fill: '#A93B32' }], ['rect', { x: 100, y: 230, width: 36, height: 190, fill: '#6B4A32' }], ['circle', { cx: 118, cy: 220, r: 52, fill: '#3F6B4F' }]] },
    rc_bg_road_long: { sky: '#EEF3F7', gnd: '#F2C94E', name: '장난감 긴 길', shapes: () => [['rect', { x: 240, y: 240, width: 34, height: 180, fill: '#6B4A32' }], ['circle', { cx: 257, cy: 230, r: 50, fill: '#3F6B4F' }], ['rect', { x: 760, y: 250, width: 34, height: 170, fill: '#6B4A32' }], ['circle', { cx: 777, cy: 240, r: 48, fill: '#3F6B4F' }]] },
    rc_bg_road_hill: { sky: '#EEF3F7', gnd: '#F2C94E', name: '장난감 오르막길', shapes: () => [...[0, 1, 2, 3].map(i => ['rect', { x: 700 + i * 70, y: 380 - i * 50, width: 70, height: 50 + i * 50, fill: i % 2 ? '#F6ECD8' : '#E8703A' }]), ['rect', { x: 140, y: 240, width: 34, height: 180, fill: '#6B4A32' }], ['circle', { cx: 157, cy: 230, r: 50, fill: '#3F6B4F' }]] },
    rc_bg_playground: { sky: '#EEF3F7', gnd: '#E9DCC0', name: '놀이터', shapes: () => [['rect', { x: 120, y: 160, width: 120, height: 260, fill: '#F2C94E' }], ['path', { d: 'M240 180 L460 420 L400 420 L240 240Z', fill: '#E8703A' }], ['circle', { cx: 860, cy: 100, r: 44, fill: '#F2B366' }]] },
  };
  function bgImage(T, key) {
    if (!bgOK[key] && BGPH[key.replace(/_v[234]$/, '')] && !BGPH[key]) BGPH[key] = BGPH[key.replace(/_v[234]$/, '')];
    if (bgOK[key]) return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const d = BGPH[key], g = T.el('g', {}, T.bg);
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
  const prop = (T, f, h) => mk(T, { a: [f, h] });
  let fronts = [];   // 앞 가림 층 소품: 나중에 put 한 배우보다도 늘 앞에 둔다(scene() 이 비운다)
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); fronts.forEach(f => { if (f !== a && f.pos.isConnected) T.world.appendChild(f.pos); }); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to || 'right'); else a.turn(to || 'right');
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 450) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  /* 침대에서 자는 이현이(1장 '잠잘 때도 쌔근', 2026-10-22 3차). 전용 그림 rc_child_bed 한 장(침대·베개·파란 이불·이현이·쥔 빨간 자동차)이
     배경 침대 자리(배경 픽셀 x 1200~1600, y 250~850)를 같은 틀로 다시 그린 것이라, 그 자리에 그대로 덮으면 배경 침대가 가려지고 이불 속에 누운 모습이 된다.
     후처리 tools/app/gen/post_red_car_bed.py. 머리 폭은 다른 자세와 같다(배경 픽셀 약 140 = 무대 약 95). 방이 밤빛(#1F2A56 .22)이라 같은 빛 필터를 건다 */
  const BED = { f: 'rc_child_bed', box: [1200, 250, 400, 600], head: [1427, 434] };
  function bedSleep(T) {
    const bs = BGBOX.w / 1600, bsy = BGBOX.h / 902, bx = px => BGBOX.x + px * bs, by = py => BGBOX.y + py * bsy;
    const root = T.el('g', { opacity: 0 }, T.world);
    const fn = T.el('filter', { id: 'rcBedNight', 'color-interpolation-filters': 'sRGB' }, T.el('defs', {}, root)), ct = T.el('feComponentTransfer', {}, fn);
    [['feFuncR', 31], ['feFuncG', 42], ['feFuncB', 86]].forEach(([n, c]) => T.el(n, { type: 'linear', slope: .78, intercept: +(c / 255 * .22).toFixed(4) }, ct));
    const [x, y, w, h] = BED.box;
    T.el('image', { href: src(BED.f), x: bx(x), y: by(y), width: w * bs, height: h * bsy, filter: 'url(#rcBedNight)' }, root);
    fronts.forEach(f => { if (f.pos.isConnected) T.world.appendChild(f.pos); });   // 앞 가림 층(공·장난감 상자)은 침대보다 앞
    return {
      head: [bx(BED.head[0]), by(BED.head[1])],
      show() { T.anim(root, [{ opacity: 0 }, { opacity: 1 }], 500).then(() => root.setAttribute('opacity', 1)); },
    };
  }
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);
  const wiggleEl = (T, n) => T.anim(n, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360);
  const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
  const sfx = (name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  /* 불 타닥 소리: 크로스페이드로 이음매를 없앤 3.9초 파일을 3.5초마다 겹쳐 틀어 반복한다. 반환한 함수를 부르면 멈춘다 */
  const fireLoop = vol => { const go = () => AudioFX.sfx('fire_crackle', vol); go(); const id = setInterval(go, 3500); return () => clearInterval(id); };
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });

  /* 누르는 자리 넓히기: 화면 w×h 투명 사각을 그림 뒤에 깐다(a.scale 로 나눠 화면 크기를 지킨다) */
  function hitBox(T, a, w = 100, h = 100) {
    const lw = w / a.scale, lh = h / a.scale;
    const r = T.el('rect', { x: -lw / 2, y: -lh, width: lw, height: lh, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.body); a.hit = a.pos; a.hitRect = r;
    return a;
  }
  const unhit = a => { if (a.hitRect) { a.hitRect.remove(); a.hitRect = null; } a.hit = null; };
  /* 지붕 등 반짝(사이렌): 필터를 켜고 끈다 */
  async function blink(T, a, n = 3) {
    for (let i = 0; i < n; i++) { a.body.style.filter = 'url(#hintGlow)'; await T.sleep(220); a.body.style.filter = ''; await T.sleep(220); }
  }
  /* 나비 날갯짓 */
  function flutter(bf) {
    let open = true;
    const id = setInterval(() => {
      if (!bf.pos.isConnected || bf.pos.style.display === 'none') { clearInterval(id); return; }
      open = !open; bf.look(open ? 'open' : 'fold');
    }, 260);
    bf.body.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], { duration: 700, iterations: Infinity });
  }
  /* 같은 장면 안 배경 바꾸기: 크림 종이가 덮었다 걷힌다(T.clear 가 가림 종이도 지우므로 change 뒤에 다시 붙인다) */
  async function veil(T, change) {
    const r = T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#F5EFE9', opacity: 0 }, T.fx);
    await T.anim(r, [{ opacity: 0 }, { opacity: 1 }], 350); r.setAttribute('opacity', 1);
    change(); T.fx.appendChild(r);
    await T.anim(r, [{ opacity: 1 }, { opacity: 0 }], 350); r.remove();
  }
  /* 자동차 카드(9장 고르기): 카드 UI 의 작은 그림 */
  function carCard(T, key, x, y, s = 1) {
    const w = 150 * s, h = 112 * s, f = { tow: 'rc_tow_run', red: 'rc_red_run', police: 'rc_police_run', fire: 'rc_fire_run', amb: 'rc_amb_run' }[key];
    const g = T.paper(T.world, [['rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10 * s, fill: '#F6ECD8' }],
      ['rect', { x: -w / 2 + 7 * s, y: -h / 2 + 7 * s, width: w - 14 * s, height: h - 14 * s, rx: 6 * s, fill: 'none', stroke: '#6B4A32', 'stroke-width': 3 * s }]],
      { transform: `translate(${x},${y})`, filter: 'url(#pp)' });
    const iw = w * .8, ih = iw / ASP[f];
    sprite(T, g, f, -iw / 2, -ih / 2, iw, ih);
    return { key, g, x, y };
  }
  /* 달리는 동안 몸이 들썩인다 */
  const hopLoop = async (a, ms, h = 3) => { const end = Date.now() + ms; while (Date.now() < end - 400) await a.hop(h, 460); };
  const drive = (a, x, y, ms, ease = 'linear', h = 3) => Promise.all([a.move(x, y, ms, ease), hopLoop(a, ms, h)]);
  /* 장난감이 굴러가는 소리를 every ms 마다. 돌려받은 함수를 부르면 멈춘다 */
  const rattle = (vol = .25, every = 1100) => {
    const one = () => sfx('rattle', vol, () => AudioFX.tone && null);
    one(); const id = setInterval(one, every); return () => clearInterval(id);
  };

  const S = {
    L0: "이현이는 빨간 자동차를 참 좋아했어요.",
    L1: "빨간 것은 어디 있을까요? 찾아봐요.",
    W_block: "그건 파란 블록이에요. 빨간 것을 찾아봐요.",
    W_duck: "그건 노란 오리예요. 빨간 것을 찾아봐요.",
    C1: "맞아요, 빨간 자동차!",
    L2: "밥 먹을 때도 냠냠, 잠잘 때도 쌔근, 언제나 손에 꼭 쥐고 있었지요.",
    L3: "그러던 어느 날, 밖에서 놀고 있었어요.",
    L4: "어! 나비다!",
    L5: "노느라 그만 빨간 자동차를 톡, 놓고 말았어요.",
    L6: "정신을 차려 보니… 어라? 빨간 자동차가 보이지 않아요!",
    L7: "잉잉, 내 빨간 자동차 어디 갔지?",
    L8: "홀로 남은 빨간 자동차는 이현이를 찾기로 했어요. 용기 있게 출발!",
    L9: "부릉부릉! 이현이를 찾아 장난감 세상으로 가자!",
    L10: "조금 가다 보니, 삐뽀삐뽀 우렁찬 소리가 들렸어요.",
    L11: "게 멈춰라!",
    L12: "경찰차 장난감이 도둑 장난감들을 쫓아 씽씽 달리고 있었어요.",
    L13: "어? 너는 이현이가 잃어버렸던 경찰차 형아?!",
    L14: "우리 같이 이현이한테 가자!",
    L15: "좋아! 도둑을 다 잡았으니 같이 가자!",
    L16: "경찰차 형아가 앞장섰어요.",
    L17: "가다 보니 이번엔 위이잉, 소리가 났어요.",
    L18: "조심하세요! 불을 끕니다!",
    L19: "소방차가 블록으로 만든 장난감 집에 난 불을 쉭쉭 끄고 있었어요.",
    L19B: "불을 톡톡 눌러서 꺼 줘요!",
    L20: "어? 소방차 이모! 우리 같이 이현이 만나러 가요!",
    L21: "그래그래! 불을 다 껐으니 같이 가자!",
    L22: "소방차 이모도 신나게 함께했어요.",
    L23: "셋이서 길을 가다 보니 삐용삐용, 바쁜 소리가 들렸어요.",
    L24: "구급차 삼촌이 아픈 인형들을 태우고 병원으로 가고 있었지요.",
    L25: "구급차 삼촌! 우리랑 같이 이현이한테 가요!",
    L26: "오냐오냐, 아픈 친구들을 다 데려다주었으니 이제 이현이에게 가자!",
    L27: "구급차 삼촌도 든든하게 따라나섰어요.",
    L28: "넷이서 나란히 달려요. 친구들이 소리로 인사했어요.",
    L29: "자, 다 같이 이현이한테 가자!",
    L30: "하지만 너무 오래 달린 빨간 자동차는 그만 툭, 멈춰 서고 말았어요.",
    L31: "아이고, 힘들어. 더는 못 가겠어…",
    L32: "바퀴가 무거워 꼼짝할 수가 없었지요.",
    L33: "그때, 저 멀리서 덜컹덜컹 든든한 소리가 들렸어요.",
    L34: "걱정 마! 내가 도와줄게!",
    L35: "바로 이현이가 전에 잃어버렸던 주황색 견인차였어요!",
    L36: "견인차가 튼튼한 고리로 빨간 자동차를 찰칵! 걸어 주었어요.",
    L37: "영차, 영차!",
    L38: "견인차가 빨간 자동차를 앞에서 끌고, 그 뒤로 다른 차들이 든든하게 따랐어요.",
    L39: "맨 앞에서 끌어 주는 건 누구일까요? 골라 봐요.",
    W_red: "그건 빨간 자동차예요. 맨 앞을 다시 봐요.",
    W_police: "그건 경찰차 형아예요. 맨 앞을 다시 봐요.",
    W_fire: "그건 소방차 이모예요. 맨 앞을 다시 봐요.",
    W_amb: "그건 구급차 삼촌이에요. 맨 앞을 다시 봐요.",
    C2: "맞아요, 견인차!",
    Q_mid: "가운데에서 달리는 건 누구일까요? 골라 봐요.",
    Q_back: "맨 뒤에서 따라가는 건 누구일까요? 골라 봐요.",
    C_mid_police: "맞아요, 가운데는 경찰차!", C_mid_fire: "맞아요, 가운데는 소방차!", C_mid_amb: "맞아요, 가운데는 구급차!",
    C_back_police: "맞아요, 맨 뒤는 경찰차!", C_back_fire: "맞아요, 맨 뒤는 소방차!", C_back_amb: "맞아요, 맨 뒤는 구급차!",
    W2_red: "그건 빨간 자동차예요. 다시 볼까요?", W2_police: "그건 경찰차 형아예요. 다시 볼까요?", W2_fire: "그건 소방차 이모예요. 다시 볼까요?",
    W2_amb: "그건 구급차 삼촌이에요. 다시 볼까요?", W2_tow: "그건 견인차예요. 다시 볼까요?",
    L40: "긴 기차처럼 한 줄로 칙칙폭폭, 붕붕붕!",
    L41: "마침내 놀이터에 있는 이현이를 만났어요!",
    L42: "와아! 내 빨간 자동차다!",
    L43: "경찰차랑 소방차, 구급차랑 견인차도 다 여기 있네!",
    L44: "이현이는 소중한 보물 자동차들을 모두 품에 안고 펄쩍펄쩍 기뻐했답니다.",
    L45: "이제 모두 함께 집으로 출발!",
  };


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
    const { sleep, camSnap, tr } = T;
    T.cardSpeed(.6);   /* 장면 전환을 빠르게(기본의 60%) */
    const GAP = 700, SCENE_END = 1500, DRIVE = 6300, LINE_DRIVE = 8400, SIREN_GAP = 4000;
    const say = async text => { await T.say(text); await sleep(GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(삐뽀삐뽀!·톡!…)
    /* 장난감나라 세상(2026-10-24): 4장 블록 · 5장 색칠 · 6장 봉제 인형 · 7·9장 기찻길 놀이판 · 8장 소꿉놀이 → _v3. 나머지는 _v2 */
    const V3 = { rc_bg_road_a: '_v3', rc_bg_road_b: '_v3', rc_bg_road_c: '_v3', rc_bg_road_long: '_v3', rc_bg_road_hill: '_v4' };   // 8장: 장난감 정비소(v4, 소꿉놀이 v3 은 쓰지 않음)
    /* 소리 큐: 놀이에서만 만화 소리, 읽어 주기에서는 장면 시작 배경 소리(낮은 볼륨·4초 이내)만 */
    const amb4 = (name, v = .28, d = 4) => { try { const rd = T.reading(); AudioFX.ambient(name, { vol: rd ? Math.min(v, .18) : v, dur: rd ? Math.min(d, 4) : d }); } catch (e) { /* 소리 없이 */ } };
    const cue = (name, v) => { try { return AudioFX.sfx(name, T.reading() ? v * .8 : v); } catch (e) { return false; } };
    const SCENE_AMB = { rc_bg_yard: 'birds_chirp_1', rc_bg_playground: 'birds_chirp_2' };
    const scene = key => { try { AudioFX.stopAmbient(.5); } catch (e) { /* */ } fronts = []; T.clear(); bgImage(T, key + (V3[key] || '_v2')); camSnap(500, 280, 1); if (SCENE_AMB[key]) amb4(SCENE_AMB[key]); };
    /* 레이어 소품(누름을 받지 않는다). mid: 배우보다 먼저 put → 뒤 / front: 앞 가림 층, fronts 에 넣어 늘 맨 앞 */
    const LAYERS = {};
    const layer = (k, x, y, { front = false, s = 1 } = {}) => {
      const f = 'rc_layer_' + k;
      const a = mk(T, { a: [f, HT[f]] }); a.pos.style.pointerEvents = 'none';
      put(T, a, x, y, { s }); if (front) fronts.push(a);
      (LAYERS[k] = LAYERS[k] || []).push(a);
      return a;
    };
    /* 7·9장 장난감 기차: 기찻길 놀이판 오른쪽 터널(입구 안쪽 x 918~991, 바닥 y ≈ 307)에서 빠져나와 왼쪽으로 달린다(두 장면 같은 방향).
       터널 안에 있는 부분은 x 918 오른쪽을 잘라(clipPath, 무대 좌표) 보이지 않게 하고, 입구 바닥에서 굽은 레일을 따라 뒤 직선(TRAIN_Y)으로 내려온다 */
    const TUN_X = 918, TUN_Y = 305;
    const trainRun = () => {
      const t0 = layer('train', TUN_X + HT.rc_layer_train * ASP.rc_layer_train / 2 + 6, TUN_Y); t0.turn('left');
      const g = T.el('g', {}, t0.pos.parentNode), cp = T.el('clipPath', { id: 'rcTunnelClip' }, g);
      T.el('rect', { x: -2000, y: -2000, width: 2000 + TUN_X, height: 4000 }, cp);
      const cg = T.el('g', { 'clip-path': 'url(#rcTunnelClip)' }, g); t0.pos.parentNode.insertBefore(g, t0.pos); cg.appendChild(t0.pos);
      t0.move(840, TRAIN_Y, 6000, 'linear').then(() => t0.move(-260, TRAIN_Y, 34000, 'linear')).catch(() => {});
      return t0;
    };
    /* 6장 봉제 인형 세상의 인형들(누름 없음, 자동차 뒤 바닥선 y≈412~418에 서서 자동차보다 먼저 put → 뒤).
       큰 곰인형은 왼쪽 베개 집 앞에 앉아 집 대신 서 있고, 행인 토끼·오리는 울타리 앞을 천천히 걷는다(병원 문 740~788·인형 내리는 길 밖), 코끼리는 병원 오른쪽 */
    const plushDolls = () => {
      layer('doll_teddy_giant', X(125, 150), 420);
      const rb = layer('doll_rabbit', X(500, 520), 412); rb.turn('left');
      const dk = layer('doll_duck', X(590, 590), 414); dk.turn('left');
      const el = layer('doll_elephant', X(940, 900), 414); el.turn('left');
      rb.move(rb.x - 90, 412, 9000, 'linear').catch(() => {}); dk.move(dk.x - 60, 414, 9000, 'linear').catch(() => {});
      [rb, dk, el].forEach((a, i) => swayLoop(a, 2, 700 + i * 120));
    };
    const swayLoop = (a, px = 3, ms = 900) => { (async () => { while (a.pos.isConnected && a.pos.style.display !== 'none') await a.wiggle(px, ms); })(); };
    const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    AudioFX.preloadSfx(['intro_adventure', 'paper_down', 'paper_up', 'swish', 'whoosh', 'rattle', 'knock', 'sparkle', 'tada', 'step_grass', 'pop', 'thud', 'splash', 'squeak', 'door', 'creak', 'police_siren', 'fire_siren', 'ambulance_siren', 'fire_crackle', 'birds_chirp_1', 'birds_chirp_2', 'ding_glock', 'question', 'whistle_down', 'harp_gliss', 'pop_appear', 'water_pour_1', 'latch_click', 'train', 'party_horn']);
    /* 그림 파일 미리 받기: 있으면 쓰고, 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 */
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    loads.push(T.preload(src(BED.f)));
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);
    calcHT();
    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, ['rc_' + who + '_' + p, HT['rc_' + who + '_' + p]]]));
    const kid = mk(T, pz('child', ['stand', 'eat', 'sleep', 'point', 'run', 'cry', 'turn', 'hug']));
    const red = mk(T, pz('red', ['run', 'joy', 'tired', 'hooked'])), police = mk(T, pz('police', ['run', 'joy'])), fire = mk(T, pz('fire', ['run', 'spray', 'joy']));
    const amb = mk(T, pz('amb', ['run', 'open', 'joy'])), tow = mk(T, pz('tow', ['run', 'pull', 'joy']));
    const thiefA = mk(T, pz('thief_a', ['run', 'hands'])), thiefB = mk(T, pz('thief_b', ['run', 'hands']));
    const bear = mk(T, pz('bear', ['sit', 'off'])), rabbit = mk(T, pz('rabbit', ['sit', 'off']));
    const bfly = mk(T, { open: ['rc_prop_butterfly_open', HT.rc_prop_butterfly_open], fold: ['rc_prop_butterfly_fold', HT.rc_prop_butterfly_fold] });
    const block = prop(T, 'rc_prop_block', HT.rc_prop_block), duck = prop(T, 'rc_prop_duck', HT.rc_prop_duck);
    const house = prop(T, 'rc_prop_house_crayon', HT.rc_prop_house_crayon), flame = prop(T, 'rc_prop_flame', HT.rc_prop_flame), smoke = prop(T, 'rc_prop_smoke', HT.rc_prop_smoke);
    const flame2 = prop(T, 'rc_prop_flame', HT.rc_prop_flame), flame3 = prop(T, 'rc_prop_flame', HT.rc_prop_flame), smoke2 = prop(T, 'rc_prop_smoke', HT.rc_prop_smoke), smoke3 = prop(T, 'rc_prop_smoke', HT.rc_prop_smoke);
    const water = prop(T, 'rc_prop_water', HT.rc_prop_water), hook = prop(T, 'rc_prop_hook', HT.rc_prop_hook);
    const CARS = [red, police, fire, amb, tow];
    [kid, ...CARS, thiefA, thiefB, bear, rabbit, bfly, block, duck, house, flame, flame2, flame3, smoke, smoke2, smoke3, water, hook].forEach(hide);
    T.director({ cast: { child: kid, red, police, fire, amb, tow }, noFace: ['child', 'red', 'police', 'fire', 'amb', 'tow'] });
    /* 그림에서 잰 좌표(차 가운데 x·바닥 y 기준 오프셋, 2026-10-21): 서 있는 이현이 쥔 주먹(그림 왼쪽 손) · 식탁 윗면 · 누운 손 옆 · 호스 끝 · 견인차 사슬 끝(고리 꼭대기가 사슬과 겹치게) · 빨간 차 앞 범퍼(지침 / 걸림 자세) */
    const HAND = { stand: [-14, -80], eat: [38, -96], sleep: [-63, -22] };
    const DROP = X(380, 400) + 130;   // 2장에서 자동차가 떨어지는 자리(이현이 출발 x + 130). 3장 첫 화면도 이 자리
    const NOZ = [49, -56], TIP_PULL = [-90, -1], BUMPER = [60, -16], BUMPER9 = [66, -48];
    /* 견인(8~9장, 2026-10-21 그림에서 잰 값): 견인차 사슬 끝은 견인차 그림 기준 (-90, -42) 에 매달리고, 걸림 자세 범퍼 윗면은 빨간 차 기준 (+67, -57) 이다.
       고리가 하나의 사슬로 이어지려면 견인차 사슬 끝과 범퍼가 같은 자리에 와야 하므로 두 차의 가운데 간격을 TOWGAP(=90+67)로 두고,
       견인차를 한 줄(LANE_T) 위로, 빨간 차를 한 줄(LANE_R) 아래로 둔다(높이차 15 = 57-42). 고리는 붐 끝에서 범퍼 윗면까지 걸리도록 .78 배(그림 높이 47)로 줄여, 위쪽이 붐 끝, 아래 갈고리가 범퍼에 걸린다 */
    const TOWGAP = 157, LANE_T = FL - 7, LANE_R = FL + 8, HOOK_S = .78, HOOK_DX = -90, HOOK_DY = -37;
    /* 한 줄로 선 차들의 가운데 x: 맨 앞 차 가운데 x0, 간격 gap(길이 LEN 기준; LEN 을 바꿔도 줄이 어긋나지 않게 계산) */
    const chain = (x0, keys, gap, sc = 1) => { const o = {}; let edge = x0 - LEN[keys[0]] * sc / 2; o[keys[0]] = x0; keys.slice(1).forEach(k => { o[k] = edge - gap - LEN[k] * sc / 2; edge = o[k] - LEN[k] * sc / 2; }); return o; };
    const waitFor = async cond => { for (let i = 0; i < 40 && !cond(); i++) await sleep(50); };

    /* ================= 읽어 주기 (docs/READ_MODE.md): read_script_el.json 의 동사 → 놀이판 장면·배우·연출을 누르기 없이 감싼 얇은 함수 =================
       장면 차리기(set)는 배경·층 소품만 깔고, 배우는 enter 동사가 놓는다(놀이판의 같은 자리·크기). 대본의 y(470)는 바닥선이 아니라서 바닥(FL, 견인차는 LANE_T)에 둔다.
       달리기(drive)는 저절로 가며(말하는 동안 이어진다), 다음 장면 책장이 넘어가기 전에 모두 끝난 뒤에 넘어간다. */
    const RCARS = { red, police, fire, amb, tow };
    const inst = () => T.readInstant();
    const on = a => a.pos.isConnected && a.pos.style.display !== 'none';
    const num = s => String(s).split(',').map(Number);
    const rSeen = {};
    let rTag = '', rCamX = 500, rFlights = [], rBed = null, rCabin = null, rChase = false, rConv = 0, rBush = null, rZoom = null, rStopFire = null, rWob = [], rFlameN = 0;
    const PCAM = { room: 560, yard: 560, gate: 500, road_a: 520, road_b: 560, road_c: 600, road_long: 400, road_hill: 600, playground: 560 };
    const flight = p => { const q = Promise.resolve(p).catch(() => {}); rFlights.push(q); return q; };
    const flightsDone = async () => { while (rFlights.length) { const l = rFlights.splice(0); await Promise.all(l); } };
    const stagger = ms => sleep(Math.min(ms, 250));
    const rToy = () => ['room1', 'yard1', 'yard2', 'playground1'].includes(rTag);
    const RCY = id => (id === 'tow' && rTag === 'road_hill1' ? LANE_T : (rTag === 'playground1' ? FL + 6 : FL));
    const RKX = { 300: X(300, 420), 380: X(380, 400), 780: X(640, 600), 800: X(640, 600) };
    const RSPOTS = X([480, 600, 720], [495, 570, 645]);
    const RTOW8 = 600 + LEN.red / 2 + 20 + LEN.tow / 2;
    const RORD = ['tow', 'red', 'police', 'fire', 'amb'];
    const RC7 = chain(845, ['red', 'police', 'fire', 'amb'], 30), RC8 = chain(600, ['red', 'police', 'fire', 'amb'], 20);
    const REND9 = chain(880, RORD, 10); { const sh = REND9.tow - REND9.red - TOWGAP; RORD.slice(1).forEach(k => { REND9[k] += sh; }); }
    const REND10 = chain(X(520, 500), RORD, 6, S_TOY);
    const RE5 = chain(900, ['fire', 'red', 'police'], 12), RE6 = chain(640, ['amb', 'red', 'police', 'fire'], 12);
    const RDX = { 'road_a1:red:200': X(430, 380), 'road_b1:police:250': X(150, 300), 'road_b1:red:330': X(330, 440), 'road_c1:police:300': X(120, 300), 'road_c1:red:420': X(300, 440), 'road_c1:fire:180': X(-60, 100), 'road_hill1:tow:250': RTOW8 };
    const RFL3 = [flame, flame2, flame3], RSMK = [smoke, smoke2, smoke3];
    const RFPOS = [[-42, -108], [2, -150], [44, -70]], RWCH = { x: 0.785, y: -0.145 };
    const RALL = [kid, ...CARS, thiefA, thiefB, bear, rabbit, bfly, block, duck, house, ...RFL3, ...RSMK, water, hook];
    const RAMB_X = X(620, 600), RDOOR = 764, RSTEP = 407;
    const rLong = dir => {
      trainRun();
      [layer('flags', X(250, 400), 110, { front: true }), layer('flags', X(750, 760), 110, { front: true })].forEach(f => swayLoop(f, 4, 1800));
    };
    const RLAY = {
      room1() { layer('toybox', X(60, 330), 585, { front: true }); layer('ball', X(960, 790), 585, { front: true }); },
      yard1() { layer('flowerbed', X(150, 300), FL - 25); layer('ladybug', X(230, 340), FL + 2); layer('snail', X(880, 790), FL + 2); layer('meadow', X(980, 800), 585, { front: true }); },
      yard2() { layer('flowerbed', X(150, 300), FL - 25); layer('ladybug', X(230, 340), FL + 2); layer('snail', X(880, 790), FL + 2); rBush = layer('grass_front', DROP, FL + 38, { front: true }); },
      gate1() { layer('rings', 900, FL - 5); layer('crayons', 1000, FL - 5); layer('arch', 700, FL + 4, { front: true }); layer('flags', 850, 120, { front: true }); layer('buttons', 980, 585, { front: true }); },
      road_a1() { layer('tower', X(80, 360), FL - 10); layer('bricks', X(1005, 720), 585, { front: true }); },
      road_b1() { layer('crayon_front', X(20, 200), 590, { front: true }); },
      road_c1() { plushDolls(); layer('yarn', X(990, 800), 585, { front: true }); },
      road_long1() { rLong(-1); },
      road_hill1() { layer('tyres', X(995, 860), 585, { front: true }); },
      road_long2() { rLong(1); },
      playground1() { layer('sand_tools', X(60, 330), 585, { front: true }); layer('grass_front', X(990, 790), 585, { front: true, s: 90 / 70 }); },
    };
    const rFollow = (x, ms) => follow(x, ms);
    const carDrive = (a, x, ms, ease = 'ease-out', y) => {
      y = y ?? a.y;
      if (inst()) { a.place(x, y); return; }
      const fl = flight(drive(a, x, y, ms, ease, 3));
      return stagger(ms).then(() => fl && null);
    };
    const exitChain = (E, order, camX) => {
      rFollow(camX, 6000);
      order.forEach((k, i) => { const a = RCARS[k]; if (on(a)) { a.look('run'); flight(sleep(i * 200).then(() => drive(a, E[k], a.y, 6000, 'ease-out', 3))); } });
    };
    const rSpray = async f => {
      const tx = f.x, ty = f.y - 45, w = water.w, h = water.h;
      const nz = { x: fire.x + NOZ[0], y: FL + NOZ[1] };
      const ox = -.40 * w, oy = -.04 * h;
      put(T, water, nz.x - ox, nz.y - oy, { to: 'right' });
      const cx = RWCH.x * w, cy = RWCH.y * h, chord = Math.hypot(cx, cy);
      const ang = Math.atan2(ty - nz.y, tx - nz.x) - Math.atan2(cy, cx), sc = Math.min(1.7, Math.max(.45, Math.hypot(tx - nz.x, ty - nz.y) / chord));
      water.body.style.transformOrigin = `${ox}px ${oy}px`;
      const tr0 = `rotate(${ang}rad) scale(`;
      const an = water.body.animate([{ transform: tr0 + '.05)', opacity: .6 }, { transform: tr0 + sc + ')', opacity: 1 }], { duration: 380, easing: 'ease-out', fill: 'forwards' });
      cue('water_pour_1', .4) || sfx('splash', .35); T.pop(f.x, f.y - 110, tr('쉭쉭!'));
      await an.finished;
    };
    const rRide = () => {
      const k = amb.w / 900, x0 = -amb.w / 2 + 83 * k, y0 = -amb.h + 90 * k, cw = 229 * k, ch = 176 * k, yb = y0 + ch;
      const g = T.el('g', {}, amb.body), cp = T.el('clipPath', { id: 'rcAmbWin' }, g);
      T.el('rect', { x: x0, y: y0, width: cw, height: ch, rx: 3 }, cp);
      const inner = T.el('g', { 'clip-path': 'url(#rcAmbWin)' }, g);
      T.el('rect', { x: x0, y: y0, width: cw, height: ch, fill: '#A9C7DE' }, inner);
      [[rabbit, x0 + cw * .82, yb + 22], [bear, x0 + cw * .28, yb + 23]].forEach(([d, x, y]) => {
        inner.appendChild(d.pos); d.pos.getAnimations().forEach(n => n.cancel()); d.pos.style.display = ''; d.pos.style.opacity = '';
        d.setScale(1); d.look('sit', 'right'); d.place(x, y);
      });
      T.el('rect', { x: x0, y: y0, width: cw, height: 3, fill: '#2E241C', opacity: .3 }, inner);
      rCabin = g;
    };
    const R = {
      set(key) {
        const go = () => {
          rSeen[key] = (rSeen[key] || 0) + 1; rTag = key + rSeen[key];
          if (rStopFire) { rStopFire(); rStopFire = null; }
          rWob.forEach(w => { w.on = false; }); rWob = []; rCabin = null; rBed = null; rChase = false; rConv = 0; rBush = null; rZoom = null;
          RALL.forEach(hide);
          scene('rc_bg_' + key);
          rCamX = P ? PCAM[key] : 500; if (P) camSnap(rCamX, 280, 1);
          (RLAY[rTag] || (() => {}))();
        };
        if (inst() || !rTag) { go(); return; }
        return flightsDone().then(() => veil(T, go));
      },
      cam(a) {
        if (a === 'wide') { if (P) return inst() ? camSnap(rCamX, 280, 1) : T.camTo(rCamX, 280, 1, 700); return inst() ? camSnap(500, 280, 1) : T.camTo(500, 280, 1, 700); }
        const [x, y, z] = num(a); return inst() ? camSnap(x, y, z || 1) : T.camTo(x, y, z || 1, 800);
      },
      kid(verb, a1, a2) {
        if (verb === 'hide') { hide(kid); return; }
        if (verb === 'at') { const [x] = num(a1); put(T, kid, RKX[x] ?? x, FL, { look: kid.cur, to: kid.want }); return; }
        if (verb === 'hop') return kid.hop(10, 320);
        if (verb === 'wiggle') return kid.wiggle(5, 500);
        if (verb === 'walk') { const [x, , ms] = num(a1); return kid.move(RKX[x] ?? x, FL, ms || 1500, 'linear'); }
        if (verb === 'look') {
          if (a1 === 'sleep') return;   /* 잠은 침대 그림(hand:sleep)이 맡는다 */
          if (a1 === 'hug' && rTag === 'playground1' && on(kid)) {   /* 자동차 다섯 대가 품으로 */
            kid.look('hug', a2 || 'right');
            const HUG = { amb: [24, -64], fire: [-18, -62], police: [26, -50], red: [-24, -50], tow: [2, -46] };
            ['amb', 'fire', 'police', 'red', 'tow'].forEach(k => put(T, RCARS[k], RCARS[k].x, RCARS[k].y, { look: 'run', s: S_TOY }));
            sfx('paper_up', .5);
            return Promise.all(Object.entries(RCARS).map(([k, c]) => c.move(kid.x + HUG[k][0], FL + HUG[k][1], 600, 'ease-out'))).then(() => CARS.forEach(c => c.look('joy')));
          }
          kid.look(a1, a2); return;
        }
        console.warn('[read] kid 동사 모름', verb);
      },
      car(id, verb, a1, a2) {
        const a = RCARS[id]; if (!a) return console.warn('[read] car 모름', id);
        if (verb === 'hide') { hide(a); return; }
        if (verb === 'hop') {
          if (rTag === 'yard2' && id === 'red' && !rZoom) {   /* 자동차 눈높이로 카메라가 내려간다 (놀이판 3장 머리) */
            rZoom = T.camTo(DROP, 470, 1 / S_TOY, 4000).then(() => { if (rBush) rBush.move(rBush.x, rBush.y + 40, 400); a.look('run', 'right'); }).catch(() => {});
          }
          return a.hop(8, 300);
        }
        if (verb === 'wiggle') return a.wiggle(3, 500);
        if (verb === 'at') {
          let [x] = num(a1);
          if (rTag === 'gate1') x = X(200, 380); else if (rTag === 'yard2') x = DROP; else if (rTag === 'road_a1' && id === 'police') x = X(300, 400);
          put(T, a, x, rTag === 'yard2' ? FL + 6 : RCY(id), { look: a.cur, to: a.want, s: rToy() ? S_TOY : 1 }); return;
        }
        if (verb === 'drive') {
          let [x, ms] = num(a1); x = RDX[`${rTag}:${id}:${x}`] ?? x;
          if (id === 'tow') ms = 7000; else if (ms <= 1500) ms = 3000;
          if (rTag === 'road_a1' && id === 'police' && x === 900) { fadeOut(T, thiefA, 700); fadeOut(T, thiefB, 700); rFollow(800, 6000); }
          else if (ms > 3000 || x > 400) rFollow(Math.min(x, 900), ms);
          return carDrive(a, x, ms, id === 'tow' ? 'linear' : 'ease-out');
        }
        if (verb === 'look') {
          const pose = a1 === 'open' ? 'run' : a1;
          if (!on(a) && rTag === 'road_b1' && id === 'fire') { put(T, a, house.x - X(220, 150), FL, { look: pose, to: 'right' }); return; }
          if (rTag === 'yard1' && id === 'red' && pose === 'tired') {   /* 나비를 따라가다 톡, 떨어뜨림 */
            sfx('paper_down', .5); vo('tok');
            a.look('tired', 'right');
            const bushX = DROP;
            return a.move(bushX, FL + 6, 600, 'ease-in').then(() => { const g = layer('grass_front', bushX, FL + 38, { front: true }); g.wiggle(4, 500); });
          }
          const wasJoy = a.cur === 'joy';
          if (a.looks && !a.looks[pose]) { console.warn('[read] 자세 없음', id, pose); return; }
          a.look(pose, a2 || undefined);
          if (pose === 'hooked' && on(tow) && on(a)) a.place(a.x, LANE_R);
          if (pose === 'run' && wasJoy && on(a)) {
            if (rTag === 'road_b1' && id === 'fire') exitChain(RE5, ['police', 'red', 'fire'], 750);
            if (rTag === 'road_c1' && id === 'amb') exitChain(RE6, ['police', 'red', 'fire', 'amb'], 560);
          }
          return;
        }
        console.warn('[read] car 동사 모름', id, verb);
      },
      toys(n) {
        if (n !== 'show') return;
        put(T, block, RSPOTS[0], FL + 6); put(T, duck, RSPOTS[2], FL + 6); put(T, red, RSPOTS[1], FL + 6, { look: 'run', s: S_TOY });
        if (!inst()) [red, block, duck].forEach(a => bob(a.pos));
      },
      hand(n) {
        if (n === 'stand') { put(T, red, kid.x + HAND.stand[0], FL + HAND.stand[1], { look: 'run', s: S_TOY }); return; }
        if (n === 'eat') {
          fadeOut(T, block, 400); fadeOut(T, duck, 400); sfx('paper_up', .5);
          return red.move(kid.x + HAND.eat[0], FL + HAND.eat[1], 600, 'ease-out');
        }
        if (n === 'sleep') {   /* 침대 그림으로: 밤빛 → 카메라가 침대로 */
          fadeOut(T, kid, 350); fadeOut(T, red, 350);
          const t = tint(T, '#1F2A56', 0); T.anim(t, [{ opacity: 0 }, { opacity: .22 }], 900).then(() => t.setAttribute('opacity', .22));
          rBed = bedSleep(T);
          return (P ? T.camTo(870, 300, 1.3, 900) : T.camTo(760, 310, 1.9, 900)).then(() => rBed.show());
        }
      },
      bfly(verb, a1) {
        if (verb === 'flutter') { put(T, bfly, X(700, 640), 300, { look: 'open' }); flutter(bfly); return; }
        if (verb === 'fly') {
          const [x, y] = num(a1), ms = x > 1000 ? 3000 : 2000;
          sfx('swish', .4);
          flight(bfly.move(x, y, ms, 'ease-in').then(() => { if (x > 1000) hide(bfly); }));
          return;
        }
      },
      thieves(verb) {
        if (verb === 'run') { put(T, thiefA, X(520, 560), FL, { look: 'run' }); put(T, thiefB, X(580, 620), FL, { look: 'run' }); return; }
        if (verb === 'hands') { thiefA.look('hands'); thiefB.look('hands'); thiefA.hop(12, 320); thiefB.hop(12, 320); return; }
      },
      house(verb) {
        if (verb !== 'fire') return;
        put(T, house, X(800, 640), FL - 30);
        RFL3.forEach((f, i) => put(T, f, house.x + RFPOS[i][0], house.y + RFPOS[i][1]));
        rWob = RFL3.map(() => ({ on: true }));
        RFL3.forEach((f, i) => { (async () => { while (rWob[i] && rWob[i].on) await f.wiggle(4, 600 + i * 90); })(); });
        if (!inst()) rStopFire = fireLoop(.2);
      },
      async flames(verb) {
        if (verb !== 'out') return;
        const left = [...RFL3];
        while (left.length) {
          const f = left.shift();
          await rSpray(f);
          if (rWob[RFL3.indexOf(f)]) rWob[RFL3.indexOf(f)].on = false;
          f.body.animate([{ scale: 1 }, { scale: .5 }], { duration: 800, fill: 'forwards' });
          await sleep(850);
          hide(water);
          await fadeOut(T, f, 300);
          const sm = RSMK[RFL3.indexOf(f)];
          put(T, sm, f.x, f.y - 10); fadeIn(sm, 300);
          flight(Promise.all([sm.move(sm.x + 10, sm.y - 60, 2400, 'ease-out'), T.anim(sm.pos, [{ opacity: 1 }, { opacity: 0 }], 2400)]).then(() => hide(sm)));
        }
        if (rStopFire) { rStopFire(); rStopFire = null; }
        fire.look('run');
      },
      async dolls(verb) {
        if (verb !== 'out' || !rCabin) return;
        await flightsDone();
        sfx('paper_down', .4);
        await Promise.all([bear, rabbit].map(d => d.move(d.x, d.y + 40, 450, 'ease-in')));
        rCabin.remove(); rCabin = null;
        [[bear, amb.x + 45], [rabbit, amb.x + 75]].forEach(([d, x]) => { put(T, d, x, RSTEP, { look: 'off' }); T.world.insertBefore(d.pos, amb.pos); fadeIn(d, 250); });
        await Promise.all([drive(bear, RDOOR - 12, RSTEP, 1300, 'ease-in-out', 8), sleep(150).then(() => drive(rabbit, RDOOR + 14, RSTEP, 1200, 'ease-in-out', 8))]);
        sfx('door', .4);
        await Promise.all([fadeOut(T, bear, 500), fadeOut(T, rabbit, 500)]);
      },
      amb(verb) { if (verb === 'door') return; },
      async hook(verb) {
        if (verb !== 'click') return;
        put(T, hook, tow.x + HOOK_DX, tow.y + HOOK_DY, { to: 'right', s: HOOK_S });
        await Promise.all([tow.move(red.x + TOWGAP, LANE_T, 700, 'ease-in-out'), hook.move(red.x + TOWGAP + HOOK_DX, hook.y, 700, 'ease-in-out')]);
        cue('latch_click', .6) || sfx('knock', .6);
        red.look('hooked'); red.place(red.x, LANE_R); glow(red, 600); red.hop(4, 260);
      },
      convoy(verb) {
        if (verb === 'line') {
          if (rTag === 'road_long1') { [['amb', 0], ['fire', 0], ['police', 0], ['red', 0]].forEach(([k]) => put(T, RCARS[k], RC7[k] - 450, FL, { look: 'run' })); }
          else if (rTag === 'road_hill1') { ['amb', 'fire', 'police', 'red'].forEach(k => put(T, RCARS[k], RC8[k], FL, { look: 'run' })); }
          else if (rTag === 'road_long2') {
            ['amb', 'fire', 'police'].forEach(k => put(T, RCARS[k], REND9[k] - 430, FL, { look: 'run' }));
            put(T, red, REND9.red - 430, LANE_R, { look: 'hooked' }); put(T, tow, REND9.tow - 430, LANE_T, { look: 'pull' }); put(T, hook, tow.x + HOOK_DX, tow.y + HOOK_DY, { to: 'right', s: HOOK_S });
          } else if (rTag === 'playground1') { RORD.forEach(k => put(T, RCARS[k], REND10[k] - 330, FL + 6, { look: 'run', s: S_TOY })); }
          return;
        }
        if (verb === 'drive') {
          const n = rConv++;
          if (rTag === 'road_long1') {
            const ms = n ? 5000 : LINE_DRIVE, d = n ? 110 : 0;
            rFollow(845, ms);
            ['red', 'police', 'fire', 'amb'].forEach(k => flight(drive(RCARS[k], RC7[k] + d, FL, ms, n ? 'ease-out' : 'linear', 3)));
            return stagger(ms);
          }
          if (rTag === 'road_long2') {
            rFollow(REND9.tow, LINE_DRIVE);
            RORD.forEach(k => flight(drive(RCARS[k], REND9[k], RCARS[k].y, LINE_DRIVE, 'linear', 3)));
            flight(drive(hook, REND9.tow + HOOK_DX, LANE_T + HOOK_DY, LINE_DRIVE, 'linear', 3));
            return stagger(LINE_DRIVE);
          }
          if (rTag === 'playground1') {
            RORD.forEach(k => flight(drive(RCARS[k], REND10[k], FL + 6, 8000, 'linear', 2)));
            return stagger(8000);
          }
        }
      },
      vo(k) {
        const SIR = { siren_police: ['police_siren', police, '삐뽀삐뽀!'], siren_fire: ['fire_siren', fire, '위이잉!'], siren_amb: ['ambulance_siren', amb, '삐용삐용!'] }[k];
        const long = rTag.startsWith('road_long');
        if (SIR) {
          const [s, c] = SIR;
          sfx(s, long ? .45 : .3);
          if (k === 'siren_police' && rTag === 'road_a1' && !rChase) {   /* 사이렌과 함께 도둑을 쫓기 시작 */
            rChase = true; rFollow(620, 4400);
            flight(drive(thiefA, thiefA.x + 300, FL, 4400, 'linear', 8)); flight(drive(thiefB, thiefB.x + 300, FL, 4400, 'linear', 8)); flight(drive(police, police.x + 300, FL, 4400, 'linear', 3));
          }
          if (k === 'siren_amb' && rTag === 'road_c1') {   /* 병원 문 앞까지 */
            rFollow(600, DRIVE);
            flight(drive(amb, RAMB_X - 90, FL, DRIVE, 'linear', 3).then(() => { rFollow(650, 2600); return drive(amb, RAMB_X, FL, 2600, 'ease-out', 3); }));
          }
          blink(T, c);
          const u = vo(k);
          if (long) { c.hop(10, 320); T.pop(c.x, FL - c.h - 40, tr(SIR[2])); }
          /* 사이렌 목소리가 끝난 뒤 대사로 (말하기의 voiceIdle 은 4초까지만 기다려서, 4.6초짜리 위이잉 위로 내레이션이 겹쳤다) */
          return u ? Promise.race([u, sleep(6000)]) : sleep(800);
        }
        return vo(k);
      },
      fx(n) { return sfx(n === 'click' ? 'knock' : n, .4); },
      confetti() { T.confetti(); sfx('tada') || sparkleSfx(T); },
      pop(spec) {
        let [x, y, ...w] = String(spec).split(','); x = +x; y = +y; const text = w.join(',');
        if (rBed && text === '쌔근') { T.pop(rBed.head[0] - 40, rBed.head[1] - 75, tr(text), '#1F2A56'); return; }
        if (P) { const cx = T.camera.x, lim = 190; x = Math.max(cx - lim, Math.min(cx + lim, x)); }
        if (rTag === 'road_hill1' && text === '영차!') {   /* 영차, 영차! 견인차가 앞에서 끈다 */
          [tow, hook, red].forEach(a => flight(a.move(a.x + 60, a.y, 3200, 'ease-in-out')));
        }
        T.pop(x, y, tr(text), text === '잉잉' || text === '툭' ? '#1F2A56' : undefined);
      },
    };
    /* settle: 장면 넘김 전에 달리던 차가 다 멈추기를 기다린다(엔진이 넘김 시간 제한 밖에서 부른다) */
    const READ_ACTS = { settle: flightsDone, set: R.set, cam: R.cam, kid: R.kid, car: R.car, toys: R.toys, hand: R.hand, bfly: R.bfly, thieves: R.thieves, house: R.house, flames: R.flames, dolls: R.dolls, amb: R.amb, hook: R.hook, convoy: R.convoy, vo: R.vo, fx: R.fx, pop: R.pop, confetti: R.confetti };
    /* 읽어 주기 소리 큐 (2026-10-28): 대본 동사 snd:<이름>:<볼륨>:<지연ms> · bg:<이름>:<볼륨>:<초> (amb 는 구급차 동사라 bg 로) */
    READ_ACTS.snd = (n, v = .7, d = 0) => { try { +d > 0 ? setTimeout(() => cue(n, +v), +d) : cue(n, +v); } catch (e) { /* */ } };
    READ_ACTS.bg = (n, v = .2, d = 4) => { try { AudioFX.ambient(n, { vol: +v, dur: Math.min(+d, 5) }); } catch (e) { /* */ } };
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) {
      return T.readPlay(READ_ACTS).finally(() => { try { AudioFX.stopAmbient(); } catch (e) { /* */ } });
    }

    /* ===== 1. 언제나 함께 (배움 놀이 1: 빨간 것 찾기 — 첫 조작) ===== */
    scene('rc_bg_room');
    put(T, kid, X(300, 420), FL, { look: 'stand' });
    layer('toybox', X(60, 330), 585, { front: true }); layer('ball', X(960, 790), 585, { front: true });   // 앞 가림 층(빨강 없음)
    const kinds = ['red', 'block', 'duck'].sort(() => Math.random() - .5), spots = X([480, 600, 720], [495, 570, 645]), toy = { red, block, duck };
    kinds.forEach((k, i) => { if (k !== 'red') { put(T, toy[k], spots[i], FL + 6); hitBox(T, toy[k], 100, 100); } });
    kinds.forEach((k, i) => { if (k === 'red') { put(T, red, spots[i], FL + 6, { look: 'run', s: S_TOY }); hitBox(T, red, 100, 100); } });
    if (P) camSnap(560, 280, 1);
    await T.curtain(true);
    intro.go(); // 시작 음악 (놀이)
    await say(S.L0);
    await sleep(300);
    [red, block, duck].forEach(a => bob(a.pos));
    cue('question', .6);
    await T.ask(S.L1, () => T.choose(kinds.map(k => ({
      el: toy[k].hit, ok: k === 'red',
      onWrong: async () => { await wiggleEl(T, toy[k].hit); await say(k === 'block' ? S.W_block : S.W_duck); },
    })), { prompt: S.L1 }));
    glow(red, 1200); cue('ding_glock', .8) || sparkleSfx(T); T.pop(red.x, FL - 60, tr('반짝!'));
    await say(S.C1);
    unhit(red);
    fadeOut(T, block, 400); fadeOut(T, duck, 400);
    sfx('paper_up', .5);
    await red.move(kid.x + HAND.stand[0], FL + HAND.stand[1], 700, 'ease-out');
    kid.hop(10, 320);
    const toHand = h => red.place(kid.x + h[0], FL + h[1]);
    const cut2 = (async () => {
      kid.look('eat', 'right'); toHand(HAND.eat); T.pop(kid.x + 80, FL - 300, tr('냠냠'));
      await sleep(2400);
      /* 잠: 바닥 요가 아니라 배경 오른쪽 침대에서 잔다(2026-10-22). 깔개 위 이현이·자동차는 사라지고 카메라가 침대로 간다(침대 그림 속 이현이가 자동차를 쥐고 있다) */
      fadeOut(T, kid, 350); fadeOut(T, red, 350);
      const t = tint(T, '#1F2A56', 0); T.anim(t, [{ opacity: 0 }, { opacity: .22 }], 900).then(() => t.setAttribute('opacity', .22));
      const nightBed = bedSleep(T);
      await (P ? T.camTo(870, 300, 1.3, 900) : T.camTo(760, 310, 1.9, 900));
      nightBed.show();
      T.pop(nightBed.head[0] - 40, nightBed.head[1] - 75, tr('쌔근'), '#1F2A56');
    })();
    await Promise.all([say(S.L2), cut2]);
    await sleep(SCENE_END);

    /* ===== 2. 나비다! (자동 — 나비는 저절로 날아간다) ===== */
    await T.sceneCard(tr('나비다!'), () => {
      scene('rc_bg_yard');
      layer('flowerbed', X(150, 300), FL - 25); layer('ladybug', X(230, 340), FL + 2); layer('snail', X(880, 790), FL + 2);   // 중간 층
      put(T, kid, X(380, 400), FL, { look: 'stand' });
      put(T, red, kid.x + HAND.stand[0], FL + HAND.stand[1], { look: 'run', s: S_TOY });
      put(T, bfly, X(700, 640), 300, { look: 'open' }); flutter(bfly);
      layer('meadow', X(980, 800), 585, { front: true });
      if (P) camSnap(560, 280, 1);
    }, bfly.pos);
    await say(S.L3);
    kid.look('point', 'right'); kid.hop(8, 300);
    await say(S.L4);
    await sleep(1000);   // 나비가 저절로 날아가기 전 잠깐 쉼
    sfx('swish', .4); T.pop(bfly.x, bfly.y - 50, tr('팔랑팔랑'));
    const bflyGo = bfly.move(1150, 120, 2800, 'ease-in');
    kid.look('run', 'right');
    const kidGo = kid.move(X(640, 600), FL, 1800, 'linear');
    await sleep(500);
    cue('whistle_down', .5) || sfx('paper_down', .5); vo('tok'); T.pop(red.x, FL - 40, tr('톡!'));
    /* 자동차는 수풀 속에 떨어져 반쯤만 보인다 (잃어버린 느낌) */
    const bushX = DROP;   // 3장도 같은 자리(같은 세계 좌표)에서 시작한다
    red.look('tired', 'right');
    await red.move(bushX, FL + 6, 600, 'ease-in');
    layer('grass_front', bushX, FL + 38, { front: true }).wiggle(4, 500);   // 앞 풀 조각이 자동차 아래 절반을 가린다(시각 재기획: 타원 수풀 → 종이 풀 조각)
    await Promise.all([bflyGo, kidGo]);
    hide(bfly);
    const l5 = say(S.L5);
    await l5;
    kid.look('stand'); kid.wiggle(5, 500); T.pop(kid.x, FL - 260, tr('두리번')); await sleep(500); await kid.wiggle(5, 500);
    await say(S.L6);
    kid.look('cry'); T.pop(kid.x - 40, FL - 320, tr('잉잉'), '#1F2A56');
    await say(S.L7);
    await sleep(SCENE_END);

    /* ===== 3. 장난감 세상으로 붕붕! (자동 — 카메라 줌) ===== */
    await T.sceneCard(tr('장난감 세상으로 붕붕!'), () => {
      scene('rc_bg_yard');
      layer('flowerbed', X(150, 300), FL - 25); layer('ladybug', X(230, 340), FL + 2);
      layer('snail', X(880, 790), FL + 2);
      put(T, red, DROP, FL + 6, { look: 'tired', to: 'right', s: S_TOY });   // 2장에서 떨어진 그 자리·크기·방향 그대로
      layer('grass_front', DROP, FL + 38, { front: true });
      if (P) camSnap(560, 280, 1);
    }, red.pos);
    const l8 = say(S.L8);
    const zoom = T.camTo(DROP, 470, 1 / S_TOY, 4000);
    await Promise.all([l8, zoom]);
    { const g = LAYERS.grass_front[LAYERS.grass_front.length - 1]; g.move(g.x, g.y + 40, 400); }   // 줌이 끝나면 앞 풀이 내려가 자동차가 다 보인다
    red.look('run', 'right');   // 용기 있게 출발: 지친 얼굴 → 달리는 얼굴
    await sleep(1500);
    let pop3;
    await veil(T, () => {
      scene('rc_bg_gate');
      const mids = [layer('rings', 900, FL - 5), layer('crayons', 1000, FL - 5)];   // 중간 층: 아치 너머 장난감 도시
      put(T, red, X(200, 380), FL, { look: 'run', s: 1 });
      layer('arch', 700, FL + 4, { front: true });                                  // 앞 가림 층: 자동차가 아치 뒤로 지나간다
      const late = [layer('flags', 850, 120, { front: true }), layer('buttons', 980, 585, { front: true }), ...mids];
      late.forEach(hide);
      pop3 = () => late.forEach((a, i) => setTimeout(() => { a.pos.style.display = ''; fadeIn(a, 300); a.hop(6, 300); cue('pop_appear', .4) || sfx('pop', .3); }, i * 300));
    });
    const l9 = say(S.L9);
    red.hop(6, 300);
    await sleep(900);
    const stopR3 = rattle(.25, 1200);
    if (P) T.camTo(700, 280, 1, 2500);
    setTimeout(() => { T.pop(700, 250, tr('부릉부릉!')); cue('harp_gliss', .6) || sparkleSfx(T); pop3();   // 아치를 지나는 순간: 깃발·단추 꽃·링 탑이 차례로 톡톡
      if (!P) T.camTo(700, 300, 1.12, 900).then(() => T.camTo(500, 280, 1, 1400)); }, 2700);
    await Promise.all([drive(red, 1150, FL, DRIVE), l9]);
    stopR3();
    await sleep(SCENE_END);

    /* ===== 4. 경찰차 형아 (자동) ===== */
    await T.sceneCard(tr('경찰차 형아'), () => {
      scene('rc_bg_road_a');
      layer('tower', X(80, 360), FL - 10);   // 중간 층: 블록 세상의 블록 탑
      put(T, thiefA, X(520, 560), FL, { look: 'run' }); put(T, thiefB, X(580, 620), FL, { look: 'run' }); put(T, police, X(300, 400), FL, { look: 'run' });
      layer('bricks', X(1005, 720), 585, { front: true });   // 앞 가림 층: 블록 더미
      if (P) camSnap(520, 280, 1);
    }, police.pos);
    const l10 = say(S.L10);
    sfx('police_siren', .3); const u4 = vo('siren_police'); blink(T, police); T.pop(police.x, FL - 150, tr('삐뽀삐뽀!'));
    const stopR4 = rattle(.25, 1200);
    follow(620, 4400);
    await Promise.all([drive(thiefA, thiefA.x + 300, FL, 4400, 'linear', 8), drive(thiefB, thiefB.x + 300, FL, 4400, 'linear', 8), drive(police, police.x + 300, FL, 4400), l10]);
    stopR4();
    await say(S.L11);
    thiefA.look('hands'); thiefB.look('hands'); thiefA.hop(12, 320); thiefB.hop(12, 320); sfx('squeak', .5);
    T.pop(police.x, FL - 150, tr('씽씽!'));
    await say(S.L12);
    put(T, red, -120, FL, { look: 'run' });
    const stopR4b = rattle(.25, 1200);
    follow(380, 2500);
    await drive(red, X(430, 380), FL, 2500, 'ease-out');
    stopR4b();
    await say(S.L13);
    red.hop(8, 300); await say(S.L14);
    police.look('joy'); police.hop(8, 300); await say(S.L15);
    police.look('run');
    const l16 = say(S.L16), stopR4c = rattle(.25, 1200);
    follow(800, DRIVE);
    fadeOut(T, thiefA, 700); fadeOut(T, thiefB, 700);   // 잡힌 도둑은 차들이 떠날 때 사라진다(차가 도둑 위를 지나가지 않게)
    const go4 = [drive(police, 900, FL, 6000, 'ease-out'), sleep(400).then(() => { red.look('run'); return drive(red, 730, FL, 6000, 'ease-out'); })];   // 장면 끝에도 차가 화면 안에 남는다(빈 배경으로 넘어가지 않게)
    await Promise.all([...go4, l16]);
    stopR4c();
    await sleep(SCENE_END);

    /* ===== 5. 소방차 이모 (불 3개를 아이가 톡톡 눌러 끈다 — 순서 마음대로) ===== */
    const FL3 = [flame, flame2, flame3];
    const FPOS = [[-42, -108], [2, -150], [44, -70]];   // 블록 집 기준: 지붕 왼쪽, 지붕 꼭대기, 창문 옆 벽
    const WCH = { x: 0.785, y: -0.145 };                // 물줄기 그림의 시작(왼쪽 아래)에서 끝(오른쪽 위 물방울)까지, 그림 폭·높이 비율
    await T.sceneCard(tr('소방차 이모'), () => {
      scene('rc_bg_road_b');
      put(T, house, X(800, 640), FL - 30);
      FL3.forEach((f, i) => { put(T, f, house.x + FPOS[i][0], house.y + FPOS[i][1]); hitBox(T, f, 84, 100); });
      put(T, fire, house.x - X(220, 150), FL, { look: 'spray' });
      layer('crayon_front', X(20, 200), 590, { front: true });   // 앞 가림 층: 색칠 세상의 큰 크레용(불꽃 ±120 밖)
      if (P) camSnap(560, 280, 1);
    }, fire.pos);
    const wob = [0, 1, 2].map(() => ({ on: true }));
    FL3.forEach((f, i) => { (async () => { while (wob[i].on) await f.wiggle(4, 600 + i * 90); })(); });
    const l17 = say(S.L17);
    const stopFire = fireLoop(.2); sfx('fire_siren', .3);
    vo('siren_fire'); blink(T, fire); T.pop(fire.x, FL - 190, tr('위이잉!'));
    await l17;
    fire.hop(6, 300); await say(S.L18);
    await say(S.L19);
    /* 호스 끝에서 불꽃 쪽으로 물줄기: 그림의 시작점(왼쪽 아래)을 호스 끝에 두고, 시작→끝 방향을 불꽃으로 돌려 길이를 맞춘다 */
    const nz = { x: fire.x + NOZ[0], y: FL + NOZ[1] };
    const spray = async (f) => {
      const tx = f.x, ty = f.y - 45;
      const w = water.w, h = water.h;
      const ox = -.40 * w, oy = -.04 * h;                          // 그림 안 시작점(가운데 아래 기준)
      put(T, water, nz.x - ox, nz.y - oy, { to: 'right' });
      const cx = WCH.x * w, cy = WCH.y * h, chord = Math.hypot(cx, cy);
      const ang = Math.atan2(ty - nz.y, tx - nz.x) - Math.atan2(cy, cx), sc = Math.min(1.7, Math.max(.45, Math.hypot(tx - nz.x, ty - nz.y) / chord));
      water.body.style.transformOrigin = `${ox}px ${oy}px`;
      const tr0 = `rotate(${ang}rad) scale(`;
      const an = water.body.animate([{ transform: tr0 + '.05)', opacity: .6 }, { transform: tr0 + sc + ')', opacity: 1 }], { duration: 380, easing: 'ease-out', fill: 'forwards' });
      cue('water_pour_1', .4) || sfx('splash', .35); T.pop(f.x, f.y - 110, tr('쉭쉭!'));
      await an.finished;
    };
    const left = [...FL3]; let smokes = [];
    while (left.length) {
      const pick = () => T.choose(left.map(f => ({ el: f.hit, ok: true })), { prompt: S.L19B });
      const o = left.length === 3 ? await T.ask(S.L19B, pick) : await pick();   // 안내가 나오는 순간부터 불꽃을 누를 수 있다
      const f = left.find(x => x.hit === o.el); left.splice(left.indexOf(f), 1);
      unhit(f);
      await spray(f);
      wob[FL3.indexOf(f)].on = false;
      f.body.animate([{ scale: 1 }, { scale: .5 }], { duration: 800, fill: 'forwards' });
      await sleep(850);
      hide(water);
      await fadeOut(T, f, 300);
      const sm = FL3.length - left.length === 1 ? smoke : (FL3.length - left.length === 2 ? smoke2 : smoke3);
      put(T, sm, f.x, f.y - 10); fadeIn(sm, 300);
      smokes.push(Promise.all([sm.move(sm.x + 10, sm.y - 60, 2400, 'ease-out'), T.anim(sm.pos, [{ opacity: 1 }, { opacity: 0 }], 2400)]).then(() => hide(sm)));
    }
    stopFire();   // 불이 다 꺼지면 타닥 소리도 멈춘다
    fire.look('run');
    await Promise.all(smokes);
    put(T, police, -200, FL, { look: 'run' }); put(T, red, -120, FL, { look: 'run' });
    const stopR5 = rattle(.25, 1200);
    follow(440, 3800);
    await Promise.all([drive(police, X(150, 300), FL, 3800, 'ease-out'), sleep(300).then(() => drive(red, X(330, 440), FL, 3800, 'ease-out'))]);
    stopR5();
    red.hop(8, 300); await say(S.L20);
    fire.look('joy'); fire.hop(8, 300); await say(S.L21);
    fire.look('run');
    const l22 = say(S.L22), stopR5b = rattle(.25, 1200);
    follow(750, 6000);
    const E5 = chain(900, ['fire', 'red', 'police'], 12);
    await Promise.all([drive(police, E5.police, FL, 6000, 'ease-out'), sleep(400).then(() => drive(red, E5.red, FL, 6000, 'ease-out')), drive(fire, E5.fire, FL, 6000, 'ease-out'), l22]);
    stopR5b();
    await sleep(SCENE_END);

    /* ===== 6. 구급차 삼촌 (자동 — 인형 내려 주기) ===== */
    /* 인형은 '차 안에 탄' 모습(2026-10-22): 구급차 뒤 큰 옆창(달리기 그림에서 잰 창 x 83~312, y 90~266 / 900×535) 모양으로 자른 묶음을
       구급차 몸(body)에 붙여 차와 함께 달리고 들썩인다. 창 안은 하늘색 종이(크림 토끼가 크림 창에 묻히지 않게), 인형은 머리·어깨만 보이고 크기는 다른 장면과 같다(scale 1).
       내릴 때는 옆구리 문을 쓰지 않는다: 창 아래로 내려가(건너편으로 내림) 병원 쪽 차 뒤에서 나와 병원 문으로 들어간다 */
    let cabin = null;
    const ride = () => {
      const k = amb.w / 900, x0 = -amb.w / 2 + 83 * k, y0 = -amb.h + 90 * k, cw = 229 * k, ch = 176 * k, yb = y0 + ch;
      const g = T.el('g', {}, amb.body), cp = T.el('clipPath', { id: 'rcAmbWin' }, g);
      T.el('rect', { x: x0, y: y0, width: cw, height: ch, rx: 3 }, cp);
      const inner = T.el('g', { 'clip-path': 'url(#rcAmbWin)' }, g);
      T.el('rect', { x: x0, y: y0, width: cw, height: ch, fill: '#A9C7DE' }, inner);
      [[rabbit, x0 + cw * .82, yb + 22], [bear, x0 + cw * .28, yb + 23]].forEach(([d, x, y]) => {
        inner.appendChild(d.pos); d.pos.getAnimations().forEach(n => n.cancel()); d.pos.style.display = ''; d.pos.style.opacity = '';
        d.setScale(1); d.look('sit', 'right'); d.place(x, y);
      });
      T.el('rect', { x: x0, y: y0, width: cw, height: 3, fill: '#2E241C', opacity: .3 }, inner);   // 창 윗변 종이가 드리운 얕은 그림자
      cabin = g;
    };
    await T.sceneCard(tr('구급차 삼촌'), () => {
      scene('rc_bg_road_c');
      plushDolls();   // 중간 층: 큰 곰인형·행인 인형
      put(T, amb, 40, FL, { look: 'run' }); ride();
      layer('yarn', X(990, 800), 585, { front: true });   // 앞 가림 층: 털실·단추
      if (P) camSnap(600, 280, 1);
    }, amb.pos);
    const ambX = X(620, 600), DOOR = 764, STEP = 407;   // 병원 문(봉제 병원 v3 그림 1156~1227px → 화면 x 740~788, 문 아래 391), 문턱 y
    const l23 = say(S.L23), stopR6 = rattle(.25, 1200);
    follow(600, DRIVE);
    setTimeout(() => { sfx('ambulance_siren', .3); vo('siren_amb'); blink(T, amb); T.pop(amb.x, FL - 170, tr('삐용삐용!')); }, 800);
    await Promise.all([drive(amb, ambX - 90, FL, DRIVE), l23]);
    const l24 = say(S.L24);   // 아직 병원으로 가는 중: 창 안의 인형을 태운 채 병원 문 앞까지
    follow(650, 2600);
    await Promise.all([drive(amb, ambX, FL, 2600, 'ease-out'), l24]);
    stopR6();
    /* 내리기: 창 아래로 쏙(건너편으로 내림) → 병원 쪽 차 뒤에서 나와 문으로 콩콩 → 문 안으로 */
    sfx('paper_down', .4);
    await Promise.all([bear, rabbit].map(d => d.move(d.x, d.y + 40, 450, 'ease-in')));
    cabin.remove(); cabin = null;
    [[bear, amb.x + 45], [rabbit, amb.x + 75]].forEach(([d, x]) => { put(T, d, x, STEP, { look: 'off' }); T.world.insertBefore(d.pos, amb.pos); fadeIn(d, 250); });
    await Promise.all([drive(bear, DOOR - 12, STEP, 1300, 'ease-in-out', 8), sleep(150).then(() => drive(rabbit, DOOR + 14, STEP, 1200, 'ease-in-out', 8))]);
    sfx('door', .4);
    await Promise.all([fadeOut(T, bear, 500), fadeOut(T, rabbit, 500)]);
    put(T, police, -250, FL, { look: 'run' }); put(T, red, -130, FL, { look: 'run' }); put(T, fire, -400, FL, { look: 'run' });
    const stopR6b = rattle(.25, 1200);
    follow(500, 3800);
    await Promise.all([drive(police, X(120, 300), FL, 3800, 'ease-out'), sleep(300).then(() => drive(red, X(300, 440), FL, 3800, 'ease-out')), sleep(300).then(() => drive(fire, X(-60, 100), FL, 3800, 'ease-out'))]);
    stopR6b();
    red.hop(8, 300); await say(S.L25);
    amb.look('joy'); amb.hop(8, 300); await say(S.L26);
    amb.look('run');
    const l27 = say(S.L27), stopR6c = rattle(.25, 1200);
    follow(560, 6000);
    const E6 = chain(640, ['amb', 'red', 'police', 'fire'], 12);
    await Promise.all([drive(police, E6.police, FL, 6000, 'ease-out'), drive(red, E6.red, FL, 6000, 'ease-out'), drive(fire, E6.fire, FL, 6000, 'ease-out'), drive(amb, E6.amb, FL, 6000, 'ease-out'), l27]);
    stopR6c();
    await sleep(SCENE_END);

    /* 7·9장 긴 길: 뒤 기찻길 위로 장난감 기차가 천천히 지나가고(40초에 화면 한 번), 위에는 깃발 줄 두 장이 살랑 */
    const longRoad = (dir, front) => {
      trainRun();
      const flags = [layer('flags', X(250, 400), 110, { front: true }), layer('flags', X(750, 760), 110, { front: true })];
      flags.forEach(f => swayLoop(f, 4, 1800));
      front(); return flags;
    };
    /* ===== 7. 나란히 달려요 (자동 — 소리로 인사) ===== */
    const C7 = chain(845, ['red', 'police', 'fire', 'amb'], 30);
    await T.sceneCard(tr('나란히 달려요'), () => {
      scene('rc_bg_road_long');
      longRoad(-1, () => {});
      put(T, amb, C7.amb - 450, FL, { look: 'run' }); put(T, fire, C7.fire - 450, FL, { look: 'run' }); put(T, police, C7.police - 450, FL, { look: 'run' }); put(T, red, C7.red - 450, FL, { look: 'run' });
      if (P) camSnap(400, 280, 1);
    }, red.pos);
    const l28 = say(S.L28), stopR7 = rattle(.3, 1200);
    follow(845, LINE_DRIVE);
    await Promise.all([drive(red, C7.red, FL, LINE_DRIVE), drive(police, C7.police, FL, LINE_DRIVE), drive(fire, C7.fire, FL, LINE_DRIVE), drive(amb, C7.amb, FL, LINE_DRIVE), l28]);
    stopR7();
    await sleep(400);
    for (const [c, k, word] of [[police, 'siren_police', '삐뽀삐뽀!'], [fire, 'siren_fire', '위이잉!'], [amb, 'siren_amb', '삐용삐용!'], [red, 'vroom', '부릉부릉!']]) {
      follow(c.x);
      if (k !== 'vroom') sfx({ siren_police: 'police_siren', siren_fire: 'fire_siren', siren_amb: 'ambulance_siren' }[k], .45);
      const u = vo(k); if (c === red) glow(red, 700); else blink(T, c);
      c.hop(10, 320); T.pop(c.x, FL - c.h - 40, tr(word));
      await (u || sleep(1200)); await sleep(SIREN_GAP - 1200);
    }
    red.hop(8, 300);
    const l29 = say(S.L29), stopR7b = rattle(.3, 1200);
    follow(845);
    await Promise.all([drive(red, C7.red + 110, FL, 5000, 'ease-out'), drive(police, C7.police + 110, FL, 5000, 'ease-out'), drive(fire, C7.fire + 110, FL, 5000, 'ease-out'), drive(amb, C7.amb + 110, FL, 5000, 'ease-out'), l29]);
    stopR7b();
    await sleep(SCENE_END);

    /* ===== 8. 에구구, 지쳤어요 (톡 2 — 고리) ===== */
    const C8 = chain(600, ['red', 'police', 'fire', 'amb'], 20), TOW8 = 600 + LEN.red / 2 + 20 + LEN.tow / 2;   // 견인차는 빨간 차 앞(오른쪽)
    await T.sceneCard(tr('에구구, 지쳤어요'), () => {
      scene('rc_bg_road_hill');
      put(T, amb, C8.amb - 260, FL, { look: 'run' }); put(T, fire, C8.fire - 260, FL, { look: 'run' }); put(T, police, C8.police - 260, FL, { look: 'run' }); put(T, red, C8.red - 260, FL, { look: 'run' });
      layer('tyres', X(995, 860), 585, { front: true });   // 앞 가림 층: 정비소 타이어(고리 ±120 밖, 견인차 끝 938 밖)
      if (P) camSnap(600, 280, 1);
    }, red.pos);
    const l30 = say(S.L30), stopR8 = rattle(.25, 1200);
    follow(600, 4000);
    await Promise.all([drive(amb, C8.amb, FL, 4000, 'ease-out'), drive(fire, C8.fire, FL, 4000, 'ease-out'), drive(police, C8.police, FL, 4000, 'ease-out'), drive(red, C8.red, FL, 4000, 'ease-out')]);
    stopR8();
    if (cue('whistle_down', .5)) setTimeout(() => cue('thud', .3), 500); else sfx('thud', .4);
    T.pop(red.x, FL - 140, tr('툭'), '#1F2A56');
    red.look('tired'); red.wiggle(3, 500);
    await l30;
    red.hop(4, 300); await say(S.L31);
    await say(S.L32);
    [police, fire, amb].forEach((c, i) => setTimeout(() => c.wiggle(2, 700), i * 300));
    const l33 = say(S.L33);
    put(T, tow, -300, LANE_T, { look: 'run' });
    const stopR8b = rattle(.45, 900);
    setTimeout(() => T.pop(tow.x, FL - 150, tr('덜컹덜컹')), 0); setTimeout(() => T.pop(tow.x, FL - 150, tr('덜컹덜컹')), 3500);
    follow(TOW8 - 96, 9500);
    await Promise.all([drive(tow, TOW8, LANE_T, 9500, 'linear', 4), l33]);
    stopR8b();
    tow.hop(8, 300); await say(S.L34);
    tow.look('pull'); sfx('creak', .4);
    put(T, hook, tow.x + HOOK_DX, tow.y + HOOK_DY, { to: 'right', s: HOOK_S }); hitBox(T, hook, 90, 90);
    bob(hook.pos);
    await T.ask(S.L35, () => T.tap(hook.hit));
    unhit(hook);
    /* 견인차가 뒤로 살짝 물러나 고리를 빨간 차 앞 범퍼 위로 가져간다(사슬은 견인차에 붙은 채) */
    sfx('creak', .4);
    await Promise.all([tow.move(red.x + TOWGAP, LANE_T, 700, 'ease-in-out'), hook.move(red.x + TOWGAP + HOOK_DX, hook.y, 700, 'ease-in-out')]);
    sfx('latch_click', .6, () => sfx('knock', .6)); vo('chalkak'); T.pop(hook.x, hook.y - 90, tr('찰칵!'));
    red.look('hooked'); red.place(red.x, LANE_R); glow(red, 600); red.hop(4, 260);   // 코가 들려 고리에 걸린다
    await say(S.L36);
    const l37 = say(S.L37);
    T.pop(tow.x, FL - 170, tr('영차!')); setTimeout(() => T.pop(tow.x, FL - 170, tr('영차!')), 1100);
    await Promise.all([tow.move(tow.x + 60, tow.y, 3200, 'ease-in-out'), hook.move(hook.x + 60, hook.y, 3200, 'ease-in-out'), red.move(red.x + 60, red.y, 3200, 'ease-in-out'), l37]);
    await sleep(SCENE_END);

    /* ===== 9. 기차처럼 한 줄로 (배움 놀이 2: 맨 앞은 누구?) ===== */
    const MID3 = ['police', 'fire', 'amb'].sort(() => Math.random() - .5), ORD9 = ['tow', 'red', ...MID3];   // 줄 순서: 견인차·빨간 차는 고정, 나머지 셋은 매번 섞는다(10장도 같은 순서)
    const END9 = chain(880, ORD9, 10);
    const sh9 = END9.tow - END9.red - TOWGAP;   // 고리로 이어진 두 차는 LEN 간격보다 가깝다 → 뒤 차들도 같이 당긴다
    ORD9.slice(1).forEach(k => { END9[k] += sh9; });
    let flags9 = [];
    await T.sceneCard(tr('기차처럼 한 줄로'), () => {
      scene('rc_bg_road_long'); if (!T.reading()) amb4('train', .25, 4);
      flags9 = longRoad(1, () => {});
      put(T, amb, END9.amb - 430, FL, { look: 'run' }); put(T, fire, END9.fire - 430, FL, { look: 'run' }); put(T, police, END9.police - 430, FL, { look: 'run' });
      put(T, red, END9.red - 430, LANE_R, { look: 'hooked' }); put(T, tow, END9.tow - 430, LANE_T, { look: 'pull' }); put(T, hook, tow.x + HOOK_DX, tow.y + HOOK_DY, { to: 'right', s: HOOK_S });
      if (P) camSnap(400, 280, 1);
    }, tow.pos);
    const l38 = say(S.L38), stopR9 = rattle(.3, 1000);
    setTimeout(() => T.pop(tow.x, FL - 160, tr('칙칙폭폭!')), 2000); setTimeout(() => T.pop(tow.x, FL - 160, tr('칙칙폭폭!')), 5000);
    follow(END9.tow, LINE_DRIVE);
    await Promise.all([drive(tow, END9.tow, LANE_T, LINE_DRIVE), drive(red, END9.red, LANE_R, LINE_DRIVE), drive(hook, END9.tow + HOOK_DX, LANE_T + HOOK_DY, LINE_DRIVE),
      drive(police, END9.police, FL, LINE_DRIVE), drive(fire, END9.fire, FL, LINE_DRIVE), drive(amb, END9.amb, FL, LINE_DRIVE), l38]);
    stopR9();
    await sleep(400);
    const CAR = { tow, red, police, fire, amb }, order = ['tow', 'red', 'police', 'fire', 'amb'].sort(() => Math.random() - .5);
    const QK = ['front', 'mid', 'back'][Math.floor(Math.random() * 3)], ANS = { front: 'tow', mid: ORD9[2], back: ORD9[4] }[QK];   // 오늘의 질문 하나(맨 앞·가운데·맨 뒤)
    const QLINE = { front: S.L39, mid: S.Q_mid, back: S.Q_back }[QK], CLINE = QK === 'front' ? S.C2 : S['C_' + QK + '_' + ANS];
    const CX = P ? null : [200, 350, 500, 650, 800], cs = X(1, .54);
    const posP = [[413, 110], [500, 110], [587, 110], [456, 180], [544, 180]];
    if (P) camSnap(500, 280, 1);
    flags9.forEach(f => T.anim(f.pos, [{ opacity: 1 }, { opacity: 0 }], 300).then(() => hide(f)));   // 카드 띠와 겹치지 않게 깃발 줄은 잠깐 걷는다
    const cards = order.map((k, i) => carCard(T, k, P ? posP[i][0] : CX[i], P ? posP[i][1] : 150, cs));
    cards.forEach((c, i) => c.g.animate([{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], { duration: 450, delay: i * 120, fill: 'backwards' }));
    const W = QK === 'front' ? { red: S.W_red, police: S.W_police, fire: S.W_fire, amb: S.W_amb } : { red: S.W2_red, police: S.W2_police, fire: S.W2_fire, amb: S.W2_amb, tow: S.W2_tow };
    cue('question', .6);
    await T.ask(QLINE, () => T.choose(cards.map(c => ({ el: c.g, ok: c.key === ANS, onWrong: async () => { await wiggleEl(T, c.g); CAR[c.key].hop(10, 320); await say(W[c.key]); } })), { prompt: QLINE }));
    cards.find(c => c.key === ANS).g.style.filter = 'url(#hintGlow)';
    const winner = CAR[ANS];
    winner.look('joy'); glow(winner, 1200); cue('ding_glock', .8) || sparkleSfx(T); T.pop(winner.x, FL - 170, tr('반짝!'));
    await say(CLINE);
    await Promise.all(cards.map(c => T.anim(c.g, [{ opacity: 1 }, { opacity: 0 }], 400)));
    cards.forEach(c => c.g.remove());
    flags9.forEach(f => { f.pos.style.display = ''; fadeIn(f, 300); });
    winner.look({ tow: 'pull', red: 'hooked' }[ANS] || 'run');
    const l40 = say(S.L40), stopR9b = rattle(.3, 1000);
    T.pop(tow.x + 40, FL - 170, tr('칙칙폭폭!')); setTimeout(() => T.pop(red.x, FL - 140, tr('붕붕붕!')), 1800);
    follow(END9.tow);
    await Promise.all([...[tow, red, police, fire, amb].map(c => drive(c, c.x + 90, c.y, 5000, 'ease-out')), drive(hook, hook.x + 90, hook.y, 5000, 'ease-out'), l40]);
    stopR9b();
    await sleep(SCENE_END);

    /* ===== 10. 이현이야, 안녕! (톡 3 — 마지막 인사) ===== */
    const END10 = chain(X(520, 500), ORD9, 6, S_TOY), CK10 = new Map([[tow, 'tow'], [red, 'red'], [police, 'police'], [fire, 'fire'], [amb, 'amb']]);
    await T.sceneCard(tr('이현이야, 안녕!'), () => {
      scene('rc_bg_playground');
      put(T, kid, X(640, 600), FL, { look: 'stand' });
      layer('sand_tools', X(60, 330), 585, { front: true }); layer('grass_front', X(990, 790), 585, { front: true, s: 90 / 70 });   // 앞 가림 층
      [amb, fire, police, red, tow].forEach(c => put(T, c, END10[CK10.get(c)] - 330, FL + 6, { look: 'run', s: S_TOY }));
      if (P) camSnap(560, 280, 1);
    }, kid.pos);
    const endX = END10;
    const l41 = say(S.L41), stopR10 = rattle(.25, 1200);
    setTimeout(() => { kid.look('turn'); kid.hop(8, 300); }, 2000);
    await Promise.all([...Object.entries({ tow, red, police, fire, amb }).map(([k, c]) => drive(c, endX[k], FL + 6, 8000, 'linear', 2)), l41]);
    stopR10();
    await say(S.L42);
    kid.hop(8, 300);
    bob(kid.pos);
    await T.ask(S.L43, () => T.tap(kid.pos));
    kid.look('hug');
    const HUG = { amb: [24, -64], fire: [-18, -62], police: [26, -50], red: [-24, -50], tow: [2, -46] }, CK = { tow, red, police, fire, amb };
    ['amb', 'fire', 'police', 'red', 'tow'].forEach(k => put(T, CK[k], CK[k].x, CK[k].y, { look: 'run', s: S_TOY }));   // 견인차가 맨 앞(품 가운데)에 보이게 뒤→앞 순서
    sfx('paper_up', .5);
    await Promise.all(Object.entries(CK).map(([k, c]) => c.move(kid.x + HUG[k][0], FL + HUG[k][1], 600, 'ease-out')));
    CARS.forEach(c => c.look('joy'));
    T.confetti(); sfx('party_horn', .9) || sfx('tada') || sparkleSfx(T);
    for (let i = 0; i < 3; i++) await Promise.all([kid.hop(30, 480), ...CARS.map(c => c.hop(30, 480))]);
    await say(S.L44);
    await say(S.L45);
    T.pop(kid.x + X(-90, -45), FL - 250, tr('빵빵!')); T.pop(kid.x + X(90, 35), FL - X(250, 305), tr('부릉부릉!'));
    await say('부릉부릉, 빵빵!');
    try { AudioFX.stopAmbient(); } catch (e) { /* */ }
    T.finale(); await sleep(1500);
    return '서로 도우면 함께 갈 수 있어요.';
  }

  Tale.mount({ title: '나의 빨간 자동차', subtitle: '서로 도우면 함께 갈 수 있어요', read: true, run: T => run(Tale.api) });
})();
