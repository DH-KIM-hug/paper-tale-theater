/* 완두콩 공주 — 안데르센 「완두콩 위의 공주」. 기획: tales/princess_pea/PLAN.md, 상세: SPEC.md (2026-10-21)
   톡 3번(1장 배 · 3장 성문 · 9장 유리 상자), 배움 놀이 3개(4장 제일 작은 것·제일 큰 것 · 5장 매트리스 1~20 세기(톡 2번) · 6장 위·아래), 연타 없음, 줄거리 선택 없음. 교훈 대사 없음.
   수 세기는 왕비 목소리 클립(vo('n1'..'n20'))로만, 숫자 글자 없음. 이불 4조각은 세지 않고 자동.
   탑: 매트리스 한 장 = 240×20 종이 조각(금·크림·감 3색 번갈아 20장 = 400px). 침대·탑·사다리·꼭대기 공주는 rig 묶음에 넣고, 꼭대기를 볼 때 rig 를 +130 내린다(엔진 카메라 y 는 고정).
   크기: 사람 넷은 머리 폭이 같다(HT 표, 공주 서기 기준). 소품은 얼굴 없음. 완두콩은 자리마다 크기가 다르다(PLAN 확정: 판자 12 · 비교 22 · 상자 30).
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/pp_*.webp (목록 tools/app/gen/jobs_princess_pea.json) */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 — post_tale.py 출력(tales/princess_pea/ASP.txt)으로 바꾼다. 그림이 오기 전엔 SPEC §2-1 시작값. preload 가 실제 비율로 덮어쓴다 */
  const ASP = {
    pp_princess_stand: .45, pp_princess_wet: .50, pp_princess_climb: .55, pp_princess_lie_a: 1.86, pp_princess_lie_b: 1.86, pp_princess_sleepy: .48, pp_princess_honest: .45, pp_princess_hold: .62, pp_princess_wave: .52,
    pp_prince_sigh: .48, pp_prince_stand: .45, pp_prince_surprise: .55, pp_prince_joy: .60, pp_prince_hold: .62,
    pp_queen_smile: .55, pp_queen_wink: .55, pp_queen_place: .70, pp_queen_lift: .60, pp_queen_hug: .80,
    pp_king_lantern: .60,
    pp_prop_pea: 1.0, pp_prop_pillow: 2.0, pp_prop_ladder: .20, pp_prop_boat: 1.1, pp_prop_far_lands: 9.0, pp_prop_cloud: 2.0, pp_prop_lightning: .35,
    pp_prop_door_closed: .55, pp_prop_door_open: 1.4, pp_prop_case: .5,
    pp_layer_map_table: 1.7682, pp_layer_lantern_post: .2133, pp_layer_puddle: 2.6087, pp_layer_pea_vine: .3883, pp_layer_bunting: 4.4554, pp_layer_rose_arch: .63, pp_layer_flowerbed: 2.2059, pp_layer_fountain: .7183,
  };
  /* 상자를 폭·높이 둘 다 고정(preload 로 덮어쓰지 않음).
     매트리스(2026-10-22 다시 그림): 갈색 테두리 띠·누빔선·둥근 단추가 있는 옆모습. 받은 그림은 5.8:1 이라 240×20 에 넣으면 단추가 반으로 눌린다 →
     민짜 몸통 줄만 빼서 12:1(900×75)로 만든 webp 를 쓴다(단추·테두리 띠는 그대로, 원본 png 는 assets/raw/_work/pp_mattress_try1). 분홍·민트·라일락(v2)도 같은 방식: 윗면 줄을 빼고 테두리 띠를 반으로, 민짜 몸통 줄을 빼 900×75 */
  const FIXED_ASP = { pp_prop_mattress_gold: 12, pp_prop_mattress_cream: 12, pp_prop_mattress_persimmon: 12, pp_prop_mattress_rose: 12, pp_prop_mattress_mint: 12, pp_prop_mattress_lilac: 12, pp_prop_duvet: 12.2, pp_prop_bed_board: 8.7 };
  /* 높이 — 같은 부위(얼굴 폭) 크기가 같아지도록 정한 값. 그림이 오면 얼굴 폭을 재서 고친다(SPEC §2-2) */
  const HT = {
    pp_princess_stand: 240, pp_princess_wet: 240, pp_princess_climb: 245, pp_princess_lie_a: 129, pp_princess_lie_b: 129, pp_princess_sleepy: 240, pp_princess_honest: 240, pp_princess_hold: 240, pp_princess_wave: 250,
    pp_prince_sigh: 240, pp_prince_stand: 240, pp_prince_surprise: 245, pp_prince_joy: 255, pp_prince_hold: 240,
    pp_queen_smile: 225, pp_queen_wink: 225, pp_queen_place: 200, pp_queen_lift: 250, pp_queen_hug: 225,
    pp_king_lantern: 225,
    pp_prop_mattress_gold: 20, pp_prop_mattress_cream: 20, pp_prop_mattress_persimmon: 20, pp_prop_mattress_rose: 20, pp_prop_mattress_mint: 20, pp_prop_mattress_lilac: 20, pp_prop_duvet: 20, pp_prop_pillow: 40, pp_prop_bed_board: 30, pp_prop_ladder: 470,
    pp_prop_boat: 44, pp_prop_far_lands: 44, pp_prop_cloud: 70, pp_prop_lightning: 160, pp_prop_door_closed: 300, pp_prop_door_open: 300, pp_prop_case: 150, pp_prop_pea: 12,
    /* 레이어 소품(VISUAL_PLAN §5): 배경을 꾸미는 종이 조각. 누름을 받지 않는다 */
    pp_layer_map_table: 120, pp_layer_lantern_post: 300, pp_layer_puddle: 60, pp_layer_pea_vine: 260, pp_layer_bunting: 80, pp_layer_rose_arch: 300, pp_layer_flowerbed: 110, pp_layer_fountain: 220,
  };
  /* 그림이 보는 쪽 ('left' | 'right' | 'front') */
  const NAT = { pp_princess_climb: 'left', pp_princess_lie_a: 'left', pp_princess_lie_b: 'left', pp_princess_hold: 'right', pp_prince_hold: 'right', pp_queen_place: 'right', pp_prop_boat: 'right', pp_prop_cloud: 'left' };
  const FL = 505;                       // 바닥(발끝 y)
  const MAT_W = 240, MAT_H = 20, BOARD_TOP = 475, TOP20 = BOARD_TOP - 20 * MAT_H;   // 탑: 판자 윗면 475, 20장 꼭대기 75
  const DUV_STEP = 12, DUV_TOP = TOP20 - 3 * DUV_STEP - HT.pp_prop_duvet;            // 이불 4장 꼭대기 y = 19
  const LIE_DY = 10;                    // 누운 공주를 이불 속으로 내리는 양(그림 아래 여백·들린 머리 보정)
  const RIG_UP = 130;                   // 꼭대기를 볼 때 rig 를 내리는 양(§5-1)
  const BGS = ['pp_bg_room_day_v2', 'pp_bg_gate_night_lb', 'pp_bg_guest_day_v2', 'pp_bg_guest_night_lb', 'pp_bg_yard_day_v2'];
  /* 2026-10-28 사용자 결정(§7-1 빛 예외): 밤 두 장면은 반투명 빛이 광원에서 멀어질수록 흐려지는 _glow 그림(같은 구도, 창·성문·등 자리 그대로).
     손님방: 바닥의 불투명 평행사변형 달빛 조각 → 창에서 바닥으로 흐려지는 달빛. 성문: 문간 빛이 돌바닥으로 퍼지고, 벽 등에 옅은 빛 */
  const GLOW = { pp_bg_guest_night_lb: 1, pp_bg_gate_night_lb: 1 };
  const src = k => AS + k + (GLOW[k] ? '_glow' : '') + '.webp';    // 배경·스프라이트 모두 파일 이름 전체(pp_…)로 부른다
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  const artOK = {}, bgOK = {};          // preload 결과(그림이 실제로 있는지) — 없으면 자리표시
  const hOf = f => HT[f] || 200;

  /* ================= 자리표시(그림이 없을 때) ================= */
  const WHO = { princess: '공주', prince: '왕자', queen: '왕비', king: '왕' };
  const POSE = { stand: '서기', wet: '비 맞음', climb: '오르기', lie_a: '누움', lie_b: '돌아누움', sleepy: '하품', honest: '솔직히', hold: '손 뻗음', wave: '손 흔듦',
    sigh: '한숨', surprise: '놀람', joy: '기쁨', smile: '웃음', wink: '찡긋', place: '놓기', lift: '들기', hug: '안기', lantern: '등불' };
  const PROPN = { pp_prop_pea: '완두콩', pp_prop_mattress_gold: '매트리스', pp_prop_mattress_cream: '매트리스', pp_prop_mattress_persimmon: '매트리스', pp_prop_duvet: '이불',
    pp_prop_pillow: '베개', pp_prop_bed_board: '침대 판자', pp_prop_ladder: '사다리', pp_prop_boat: '배', pp_prop_far_lands: '먼 나라', pp_prop_cloud: '구름', pp_prop_lightning: '번개',
    pp_prop_door_closed: '성문', pp_prop_door_open: '열린 성문', pp_prop_case: '유리 상자' };
  const BODYC = { princess: '#F6ECD8', prince: '#1F2A56', queen: '#A93B32', king: '#6B4A32' };
  const HAIRC = { princess: '#8a6a48', prince: '#3a2a1c', queen: '#F4F6FA', king: '#F4F6FA' };
  const SKIN = '#F2D9B8', CREAM = '#F6ECD8', INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";

  /* box(0..w, 0..h) 안에 종이 조각 자리표시를 그린다. 그림 파일과 같은 크기라 나중에 그림이 그대로 대신한다 */
  function placeholder(T, parent, f, w, h) {
    const g = T.el('g', {}, parent);
    const R = (x, y, ww, hh, rx, fill, extra = {}) => T.el('rect', { x, y, width: ww, height: hh, rx, fill, ...extra }, g);
    const C = (cx, cy, r, fill, extra = {}) => T.el('circle', { cx, cy, r, fill, ...extra }, g);
    const E = (cx, cy, rx, ry, fill) => T.el('ellipse', { cx, cy, rx, ry, fill }, g);
    const Pth = (d, fill, extra = {}) => T.el('path', { d, fill, ...extra }, g);
    const Ln = (x1, y1, x2, y2, stroke, sw = 4) => T.el('line', { x1, y1, x2, y2, stroke, 'stroke-width': sw, 'stroke-linecap': 'round' }, g);
    const label = (txt, cx, cy, fill = CREAM, fs) => {
      const t = T.el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': fs || Math.max(11, Math.min(20, h * .075)), 'font-weight': 700, fill, 'font-family': FONT, text: txt }, g);
      t.classList.add('phl'); t.dataset.cx = cx; t.dataset.cy = cy; t.setAttribute('transform', `translate(${cx},${cy})`);
    };
    const m = /^pp_(princess|prince|queen|king)_(.+)$/.exec(f), nat = NAT[f] || 'front', dx = nat === 'left' ? -1 : nat === 'right' ? 1 : 0;
    if (m) {
      const [, who, pose] = m, body = BODYC[who], hair = HAIRC[who], name = WHO[who] + ' ' + (POSE[pose] || pose);
      const lying = w / h > 1.4, r = Math.min(48, h * .3, w * .5);
      if (lying) {                                             // 누운 상자: 머리는 왼쪽, 몸은 오른쪽
        R(w * .24, h * .22, w * .74, h * .6, 14, '#F6ECD8'); R(w * .5, h * .22, 10, h * .6, 2, '#3F6B4F');
        C(r + 8, h * .5, r, SKIN); Pth(`M${8} ${h * .5} A${r} ${r} 0 0 1 ${r * 2 + 8} ${h * .5} Z`, hair);
        if (pose === 'lie_a') { [-1, 1].forEach(s => Ln(r + 8 + s * r * .38 - 5, h * .56, r + 8 + s * r * .38 + 5, h * .56, INK, 2.5)); [-1, 1].forEach(s => C(r + 8 + s * r * .38, h * .58, 0, INK)); }
        label(name, w * .62, h * .6, INK, 13); return g;
      }
      const bw = Math.min(w * .9, r * 2.4), by = 2 * r - 4, bh = h - by, cx = w / 2;
      if (who === 'princess') {
        Pth(`M${cx - bw * .3} ${by} L${cx + bw * .3} ${by} L${cx + bw / 2} ${h} L${cx - bw / 2} ${h} Z`, body);
        R(cx - bw * .36, by + bh * .3, bw * .72, 8, 2, '#3F6B4F');
      } else if (who === 'queen') {
        R(cx - bw / 2 - 4, by, bw + 8, bh, 28, body, pose === 'place' ? { transform: `rotate(15 ${cx} ${h})` } : {});
      } else R(cx - bw * .4, by, bw * .8, bh, 8, body);
      if (who === 'king') { Pth(`M${cx - r * .8} ${r + 14} Q${cx} ${r * 2.4} ${cx + r * .8} ${r + 14} Z`, '#F4F6FA'); }
      C(cx, r + 2, r, SKIN);
      if (who === 'princess') {
        const long = pose === 'wet';
        Pth(`M${cx - r} ${r + 2} A${r} ${r} 0 0 1 ${cx + r} ${r + 2} ${long ? `L${cx + r} ${r * 2.1} L${cx - r} ${r * 2.1}` : ''}Z`, hair); C(cx, -2, r * .3, hair);
        if (long) [.3, .5, .7].forEach((k, i) => C(cx - r + k * r * 2, r * 2.4 + i * 6, 3, '#6aa6d6'));
      } else if (who === 'prince') { Pth(`M${cx - r} ${r + 2} A${r} ${r} 0 0 1 ${cx + r} ${r + 2} Q${cx} ${r * .6} ${cx - r} ${r + 2}Z`, hair); [-1, 0, 1].forEach(s => Pth(`M${cx + s * r * .5 - 6} 4 L${cx + s * r * .5} -10 L${cx + s * r * .5 + 6} 4Z`, '#D9A94E')); }
      else if (who === 'queen') { Pth(`M${cx - r} ${r + 2} A${r} ${r} 0 0 1 ${cx + r} ${r + 2} Q${cx} ${r * .5} ${cx - r} ${r + 2}Z`, hair); C(cx, -4, r * .28, hair); }
      else { Pth(`M${cx - r} ${r + 2} A${r} ${r} 0 0 1 ${cx + r} ${r + 2} Q${cx} ${r * .6} ${cx - r} ${r + 2}Z`, hair); R(cx - r * .7, -6, r * 1.4, 10, 2, '#D9A94E'); }
      const er = pose === 'honest' ? r * .14 : r * .1;
      if (pose === 'sleepy') [-1, 1].forEach(s => Ln(cx + s * r * .36 + dx * r * .25 - 5, r + 6, cx + s * r * .36 + dx * r * .25 + 5, r + 6, INK, 3));
      else if (pose === 'wink') { C(cx - r * .36, r + 6, er, INK); Ln(cx + r * .36 - 6, r + 6, cx + r * .36 + 6, r + 6, INK, 3); }
      else [-1, 1].forEach(s => C(cx + s * r * .36 + dx * r * .25, r + 6, Math.max(2.5, er), INK));
      if (who === 'queen') [-1, 1].forEach(s => C(cx + s * r * .36, r + 6, r * .26, 'none', { stroke: INK, 'stroke-width': 1.5 }));
      if (pose === 'surprise') E(cx, r + r * .6, r * .12, r * .16, INK);
      if (pose === 'sigh') { Ln(cx - r * .6, r - r * .3, cx - r * .2, r - r * .05, INK, 2.5); Ln(cx + r * .6, r - r * .3, cx + r * .2, r - r * .05, INK, 2.5); R(cx + bw * .45, by + bh * .3, 8, 22, 2, CREAM); }
      if (pose === 'joy' || pose === 'lift') { Ln(cx - bw * .4, by + 6, cx - bw * .7, by - r * .9, CREAM, 3); Ln(cx + bw * .4, by + 6, cx + bw * .7, by - r * .9, CREAM, 3); }
      if (pose === 'hug') { Ln(cx - bw * .4, by + 10, cx - w * .48, by + bh * .3, CREAM, 3); Ln(cx + bw * .4, by + 10, cx + w * .48, by + bh * .3, CREAM, 3); }
      if (pose === 'hold') Ln(cx + dx * bw * .3, by + 12, cx + dx * w * .48, by + bh * .12, who === 'princess' ? '#8a6a48' : CREAM, 4);
      if (pose === 'wave') { C(cx + r * 1.3, r * .9, 7, SKIN); }
      if (pose === 'lantern') R(cx + bw * .4, by + bh * .3, 18, 22, 3, '#F2B366');
      label(name, cx, by + bh * .5, who === 'princess' ? '#6B4A32' : CREAM, Math.max(11, Math.min(15, bw / 5.2)));
      return g;
    }
    const nm = PROPN[f] || f.replace('pp_prop_', '');
    switch (f) {
      case 'pp_prop_pea': C(w / 2, h / 2, Math.min(w, h) / 2, '#3F6B4F'); C(w * .36, h * .36, Math.min(w, h) * .14, '#5c8b6a'); break;
      case 'pp_prop_mattress_gold': case 'pp_prop_mattress_cream': case 'pp_prop_mattress_persimmon':
        R(0, 0, w, h, Math.min(8, h * .4), { pp_prop_mattress_gold: '#D9A94E', pp_prop_mattress_cream: '#F6ECD8', pp_prop_mattress_persimmon: '#E8703A' }[f]); break;
      case 'pp_prop_duvet': R(0, 0, w, h * .75, 5, '#F4F6FA'); Pth(`M0 ${h * .7} Q${w * .125} ${h * 1.1} ${w * .25} ${h * .7} T${w * .5} ${h * .7} T${w * .75} ${h * .7} T${w} ${h * .7} L${w} ${h * .5} L0 ${h * .5}Z`, '#F4F6FA'); break;
      case 'pp_prop_pillow': R(0, 0, w, h, h * .35, CREAM); R(w * .4, 0, w * .2, h, 2, '#3F6B4F'); label(nm, w / 2, h * .62, INK, 12); break;
      case 'pp_prop_bed_board': R(0, 0, w, h * .45, 3, '#6B4A32'); R(w * .08, h * .45, 8, h * .55, 2, '#6B4A32'); R(w * .92 - 8, h * .45, 8, h * .55, 2, '#6B4A32'); R(0, -h * .5, 10, h * 1.4, 2, '#6B4A32'); break;
      case 'pp_prop_ladder': R(w * .1, 0, 4, h, 1, '#6B4A32'); R(w * .9 - 4, 0, 4, h, 1, '#6B4A32'); for (let i = 0; i < 7; i++) R(w * .1, h * (.08 + i * .14), w * .8, 4, 1, '#6B4A32'); break;
      case 'pp_prop_boat': Pth(`M0 ${h * .6} Q${w / 2} ${h * 1.1} ${w} ${h * .6} Z`, '#6B4A32'); Pth(`M${w * .5} ${h * .1} L${w * .5} ${h * .58} L${w * .85} ${h * .58} Z`, CREAM); break;
      case 'pp_prop_far_lands': [[.1, .6, .12], [.22, .8, .14]].forEach(([a, b, c]) => R(w * a, h * (1 - b), w * c * .3, h * b, 1, '#8B7BB8')); [.3, .5, .72].forEach(k => E(w * k, h * .6, 4, 10, '#8B7BB8')); R(w * .06, h * .55, w * .88, h * .45, 2, '#8B7BB8', { opacity: .55 }); break;
      case 'pp_prop_cloud': E(w / 2, h * .62, w * .46, h * .3, '#1F2A56'); C(w * .35, h * .4, h * .28, '#1F2A56'); C(w * .62, h * .36, h * .32, '#1F2A56'); break;
      case 'pp_prop_lightning': Pth(`M${w * .6} 0 L${w * .15} ${h * .55} L${w * .5} ${h * .55} L${w * .3} ${h} L${w * .9} ${h * .4} L${w * .55} ${h * .4}Z`, '#F2B366'); break;
      case 'pp_prop_door_closed': Pth(`M0 ${h} L0 ${w / 2} A${w / 2} ${w / 2} 0 0 1 ${w} ${w / 2} L${w} ${h}Z`, '#6B4A32'); Ln(w / 2, w * .3, w / 2, h, '#3a2a1c', 3); break;
      case 'pp_prop_door_open': R(0, h * .05, w * .12, h * .95, 3, '#6B4A32'); R(w * .88, h * .05, w * .12, h * .95, 3, '#6B4A32'); break;
      case 'pp_prop_case': R(w * .1, h * .88, w * .8, h * .12, 2, '#6B4A32'); R(w * .12, 0, w * .76, h * .88, 4, 'none', { stroke: '#DCE3EA', 'stroke-width': 4 }); break;
      default: R(0, 0, w, h, Math.min(w, h) * .2, '#D9A94E'); label(nm, w / 2, h / 2, INK, 13);
    }
    if (h > 40 && f !== 'pp_prop_pillow') label(nm, w / 2, h * .5, f === 'pp_prop_mattress_cream' || f === 'pp_prop_door_open' ? INK : CREAM, f === 'pp_prop_ladder' ? 11 : Math.min(14, h * .12));
    else if (w > 150 && h >= 18 && /mattress|duvet/.test(f)) label(nm, w / 2, h * .72, INK, 12);
    return g;
  }
  /* 그림 한 장(있으면 그림, 없으면 자리표시): 위 왼쪽 (x,y), 크기 w×h */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    const g = placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
    return g.parentNode;
  }

  /* 배경 자리표시: 종이 한 장 + 바닥 띠 + 요소 2~3개 + 이름표 */
  const BGPH = {
    pp_bg_room_day_v2:    { sky: '#F6ECD8', gnd: '#D9A94E', name: '왕자의 방(낮, 오른쪽 창)', shapes: () => [['rect', { x: 554, y: 49, width: 400, height: 201, rx: 4, fill: '#BFD8EE' }], ['rect', { x: 554, y: 250, width: 400, height: 103, fill: '#8B7BB8' }], ['rect', { x: 120, y: 160, width: 160, height: 250, rx: 4, fill: '#A93B32' }]] },
    pp_bg_gate_night_lb:  { sky: '#1F2A56', gnd: '#3a3f55', name: '성문 앞(밤)', shapes: () => [['rect', { x: -40, y: 205, width: 1080, height: 207, fill: '#55607F' }], ['rect', { x: 617, y: 205, width: 166, height: 300, rx: 4, fill: '#F2B366' }], ['rect', { x: 140, y: 250, width: 120, height: 160, fill: '#55607F' }]] },
    pp_bg_guest_day_v2:   { sky: '#F6ECD8', gnd: '#6B4A32', name: '손님방(낮, 왼쪽 창)', shapes: () => [['rect', { x: 100, y: 70, width: 170, height: 170, rx: 4, fill: '#BFD8EE' }], ['rect', { x: 140, y: 330, width: 140, height: 80, fill: '#A93B32' }], ['rect', { x: 880, y: 150, width: 90, height: 260, fill: '#D9A94E' }]] },
    pp_bg_guest_night_lb: { sky: '#2B3263', gnd: '#3a2a1c', name: '손님방(밤, 왼쪽 창·달)', shapes: () => [['rect', { x: 100, y: 70, width: 170, height: 170, rx: 4, fill: '#1F2A56' }], ['circle', { cx: 190, cy: 150, r: 38, fill: '#F6ECD8' }], ['rect', { x: 140, y: 330, width: 140, height: 80, fill: '#6B4A32' }]] },
    pp_bg_yard_day_v2:    { sky: '#BFD8EE', gnd: '#3F6B4F', name: '성 마당(낮)', shapes: () => [['rect', { x: -40, y: 250, width: 1080, height: 162, fill: '#F6ECD8' }], ['circle', { cx: 160, cy: 110, r: 44, fill: '#F2B366' }], ['rect', { x: 700, y: 90, width: 160, height: 160, rx: 4, fill: '#F6ECD8' }]] },
  };
  function bgImage(T, key) {
    if (bgOK[key]) return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const d = BGPH[key], g = T.el('g', {}, T.bg), dark = /night/.test(key);
    T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: d.sky }, g);
    T.el('rect', { x: BGBOX.x, y: 412, width: BGBOX.w, height: 200, fill: d.gnd }, g);
    d.shapes().forEach(([t, a]) => T.el(t, a, g));
    T.el('text', { x: 500, y: 36, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: dark ? CREAM : '#6B4A32', 'font-family': FONT, opacity: .85, text: '(그림 자리) 배경: ' + d.name }, g);
    return g;
  }

  /* ================= 배우·소품 ================= */
  /* poses = { 이름: [그림, 높이] }. a.look(자세, 방향) — 그림이 보는 쪽이 다르면 뒤집는다 (앞모습은 뒤집지 않는다) */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, v]) => {
        const [f, h0] = Array.isArray(v) ? v : [v, null], h = h0 || hOf(f), w = h * (ASP[f] || 1);
        const wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        /* 누운 자세: 그림은 머리가 살짝 들려 있어 이불 위에 떠 보인다 → 조금 내려 이불에 눕히고(LIE_DY), 발끝을 축으로 머리 쪽을 3도 낮춘다 */
        if (/_lie_[ab]$/.test(f)) wrap.setAttribute('transform', `translate(0 ${LIE_DY}) rotate(-3 ${w * .3} 0)`);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
      });
    });
    a.want = 'left';
    a.pos.style.pointerEvents = 'none';   // 톡 대상이 아닌 배우·소품이 대상 위를 덮어 누름을 가로채지 않게(2026-10-22). 대상은 hitBox/tapable 로 연다
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
  const fadeIn = (a, ms = 450) => { a.pos.style.display = ''; return a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms); };
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  const wiggleEl = (T, n) => T.anim(n, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360);
  const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
  const sfx = (T, name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle') || T.tone([700, 1400], .3, { vol: .15 });
  /* 누르는 자리 넓히기: 그림 뒤에 투명 사각을 깔고 a.hit = a.pos */
  function hitBox(T, a, w = 100, h = 100) {
    const r = T.el('rect', { x: -w / 2, y: -h, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.body); a.hit = a.pos; a.pos.style.pointerEvents = 'auto'; return a;
  }

  /* ---- 세트 묶음 rig (탑 꼭대기를 볼 때 위로 보이게 아래로 내린다) ---- */
  let rig, rigY = 0;
  function newRig(T) { rig = T.el('g', {}, T.world); rigY = 0; }
  function inRig(a) { rig.appendChild(a.pos); a.pos.style.pointerEvents = 'none'; return a; }
  function rigTo(T, dy, ms) {
    const from = rigY; rigY = dy;
    if (!ms) { rig.style.transform = `translate(0,${dy}px)`; return Promise.resolve(); }
    return T.anim(rig, [{ transform: `translate(0,${from}px)` }, { transform: `translate(0,${dy}px)` }], { duration: ms, easing: 'ease-in-out' });
  }
  /* 위·아래 구역: 연한 종이 띠 */
  function zone(T, x, y, w, h) { return T.el('rect', { x, y, width: w, height: h, rx: 14, fill: '#F6ECD8', opacity: 0 }, rig); }
  /* 빗줄기(코드) */
  function rain(T) {
    const g = T.el('g', {}, T.fx || T.world);
    for (let i = 0; i < 28; i++) {
      const x = -40 + Math.random() * 1080, y = -80 + Math.random() * 720;
      T.el('line', { x1: x, y1: y, x2: x - 7, y2: y + 33, stroke: '#BFD8EE', 'stroke-width': 2, opacity: .55, 'stroke-linecap': 'round' }, g);
    }
    g.animate([{ translate: '0 -80px' }, { translate: '0 80px' }], { duration: 700, iterations: Infinity });
    return g;
  }
  /* 꽃잎(코드) */
  function petals(T) {
    const cols = ['#E8703A', '#A93B32', '#F6ECD8'], layer = T.fx || T.world;
    for (let i = 0; i < 10; i++) {
      const sg = i % 2 ? 1 : -1;
      const p = T.el('ellipse', { cx: 300 + Math.random() * 600, cy: 0, rx: 7, ry: 4, fill: cols[i % 3], filter: 'url(#pp)' }, layer);
      p.animate([{ translate: '0 -30px', rotate: '0deg' }, { translate: `${sg * (20 + Math.random() * 30)}px 600px`, rotate: `${sg * 200}deg` }],
        { duration: 6000 + i * 500, iterations: Infinity, delay: i * 400 });
    }
  }

  async function run(T) {
    /* 시작 음악 (2026-10-28): 첫 장면 시작에 12초 깔고, 첫 장면 전환에서 끈다. 읽어 주기는 음량 .25 */
    const intro = (() => {
      let h = null, on = true;
      const stop = () => { on = false; try { h && h.stop(.8); h = null; } catch (e) { /* 무시 */ } };
      const go = (delay = 0) => {
        const f = () => { try { if (!on) return; const o = { vol: T.reading() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }; h = AudioFX.ambient('intro_magic', o); if (!h) setTimeout(() => { try { if (on) h = AudioFX.ambient('intro_magic', o); } catch (e) { /* 무시 */ } }, 900); } catch (e) { /* 무시 */ } };
        if (delay) setTimeout(f, delay); else f();
      };
      try { const sc0 = T.sceneCard; if (sc0) T.sceneCard = function (...a) { stop(); return sc0.apply(this, a); }; } catch (e) { /* 무시 */ }
      return { go, stop };
    })();
    const { sleep, camSnap, tr } = T;
    const GAP = 700, SCENE_END = 1500,   /* 2026-10-22 대사 뒤·장면 끝 쉼을 줄임(전환이 느리다는 지적) */ SAIL = 8000, COUNT_A = 1400, COUNT_B = 1300, CLIMB = 6000;   // §2-7 속도 상수
    const say = async text => { await T.say(text); await sleep(GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(수 세기 n1~n20)
    /* 소리 큐: 놀이에서만 만화 소리, 읽어 주기에서는 장면 시작 배경 소리(낮은 볼륨·4초 이내)만 */
    const amb = (name, v = .28, d = 4) => { try { const rd = T.reading(); AudioFX.ambient(name, { vol: rd ? Math.min(v, .18) : v, dur: rd ? Math.min(d, 4) : d }); } catch (e) { /* 소리 없이 */ } };
    const cue = (name, v) => { try { if (T.reading() && document.hidden && name === 'cushion') return true; /* 화면 꺼짐: 스무 번이 한꺼번에 울리지 않게 */ return AudioFX.sfx(name, T.reading() ? v * .8 : v); } catch (e) { return false; } };
    const SCENE_AMB = { pp_bg_room_day_v2: 'waves', pp_bg_gate_night_lb: 'rain_1', pp_bg_guest_night_lb: 'crickets_night_1', pp_bg_yard_day_v2: 'birds_chirp_1' };
    const scene = key => { try { AudioFX.stopAmbient(.5); } catch (e) { /* */ } T.clear(); bgImage(T, key); newRig(T); dress(key); camSnap(500, 280, 1); if (SCENE_AMB[key]) amb(SCENE_AMB[key]); };
    if (T.fx) T.fx.style.pointerEvents = 'none';  // 빗줄기·꽃잎·'뚝뚝' 같은 효과 조각이 톡 대상을 덮지 않게
    const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    const TX = X(560, 520);                        // 탑(침대) 가운데 x — 4·5·6·7·8장 공통
    AudioFX.preloadSfx && AudioFX.preloadSfx(['intro_magic', 'paper_down', 'paper_up', 'swish', 'whoosh', 'knock', 'creak', 'boom', 'sparkle', 'tada', 'step_wood', 'poke', 'splash', 'bubbles', 'waves', 'rain_1', 'crickets_night_1', 'birds_chirp_1', 'birds_chirp_2', 'thunder', 'door_heavy_1', 'question', 'ding_glock', 'cushion', 'sleepy_tuba', 'party_horn', 'applause_1']);
    /* 그림 파일 미리 받기: 있으면 쓰고, 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 (FIXED_ASP 는 덮어쓰지 않는다) */
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    [...Object.keys(ASP), ...Object.keys(FIXED_ASP)].forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && !FIXED_ASP[k] && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);   // 진짜 4초: 검증 화면 건너뛰기(skipto)의 빠른 sleep(15ms)에 지면 그림이 덜 받아져 이름표 상자로 나온다(unicorn 과 같은 처리, 2026-10-28)
    Object.assign(ASP, FIXED_ASP);
    const H = f => [f, HT[f]];

    /* ---- 배우 ---- */
    const pea = mk(T, Object.fromEntries([['stand', 'princess_stand'], ['wet', 'princess_wet'], ['climb', 'princess_climb'], ['lie_a', 'princess_lie_a'], ['lie_b', 'princess_lie_b'], ['sleepy', 'princess_sleepy'],
      ['honest', 'princess_honest'], ['hold', 'princess_hold'], ['wave', 'princess_wave']].map(([k, f]) => [k, H('pp_' + f)])));
    const prince = mk(T, Object.fromEntries([['sigh', 'prince_sigh'], ['stand', 'prince_stand'], ['surprise', 'prince_surprise'], ['joy', 'prince_joy'], ['hold', 'prince_hold']].map(([k, f]) => [k, H('pp_' + f)])));
    const queen = mk(T, Object.fromEntries([['smile', 'queen_smile'], ['wink', 'queen_wink'], ['place', 'queen_place'], ['lift', 'queen_lift'], ['hug', 'queen_hug']].map(([k, f]) => [k, H('pp_' + f)])));
    const king = mk(T, { lantern: H('pp_king_lantern') });
    const MATF = ['pp_prop_mattress_gold', 'pp_prop_mattress_cream', 'pp_prop_mattress_persimmon', 'pp_prop_mattress_rose', 'pp_prop_mattress_mint', 'pp_prop_mattress_lilac'];   // 2026-10-22 VISUAL_PLAN 판단 1: 6색 순환
    const mats = Array.from({ length: 20 }, (_, i) => prop(T, MATF[i % 6], MAT_H));     // 20장(6색 번갈아)
    const pile = Array.from({ length: 5 }, (_, i) => prop(T, MATF[i % 6], MAT_H));      // 5장 더미(5장 장면)
    const duvs = Array.from({ length: 4 }, () => prop(T, 'pp_prop_duvet', HT.pp_prop_duvet));
    const peaB = prop(T, 'pp_prop_pea', 12), peaC = prop(T, 'pp_prop_pea', 22), peaM = prop(T, 'pp_prop_pea', 30);   // 판자 위·비교 놀이·유리 상자
    const matC = prop(T, 'pp_prop_mattress_gold', MAT_H), pillow = prop(T, 'pp_prop_pillow', HT.pp_prop_pillow);        // 4장 비교 보기
    const board = prop(T, 'pp_prop_bed_board', HT.pp_prop_bed_board), ladder = prop(T, 'pp_prop_ladder', HT.pp_prop_ladder);
    const boat = prop(T, 'pp_prop_boat', HT.pp_prop_boat), lands = prop(T, 'pp_prop_far_lands', HT.pp_prop_far_lands);
    const cloudA = prop(T, 'pp_prop_cloud', HT.pp_prop_cloud), cloudB = prop(T, 'pp_prop_cloud', HT.pp_prop_cloud), bolt = prop(T, 'pp_prop_lightning', HT.pp_prop_lightning);
    const doorC = prop(T, 'pp_prop_door_closed', HT.pp_prop_door_closed), doorO = prop(T, 'pp_prop_door_open', HT.pp_prop_door_open), kase = prop(T, 'pp_prop_case', HT.pp_prop_case);
    const ALL = [pea, prince, queen, king, ...mats, ...pile, ...duvs, peaB, peaC, peaM, matC, pillow, board, ladder, boat, lands, cloudA, cloudB, bolt, doorC, doorO, kase];
    /* 레이어 소품(VISUAL_PLAN §4): rig 밖 T.world 맨 뒤(중간 층) 또는 fx(앞 가림 층). 모두 누름 없음 */
    const deco = k => { const a = prop(T, 'pp_layer_' + k, HT['pp_layer_' + k]); a.pos.style.pointerEvents = 'none'; return a; };
    const L = Object.fromEntries(['map_table', 'lantern_post', 'puddle', 'puddle2', 'pea_vine', 'bunting', 'bunting2', 'rose_arch', 'flowerbed', 'fountain'].map(k => [k, deco(k.replace(/2$/, ''))]));
    ALL.push(...Object.values(L));
    ALL.forEach(hide);
    const mid = (a, x, y) => { put(T, a, x, y); T.world.insertBefore(a.pos, T.world.firstChild); return a; };
    const front = (a, x, y) => { put(T, a, x, y); T.fx.appendChild(a.pos); return a; };
    const flicker = a => a.body.animate([{ opacity: 1 }, { opacity: .85 }, { opacity: 1 }], { duration: 1600, iterations: Infinity });
    function rings(x, y) {          // 웅덩이 빗방울 고리(코드 원 2개)
      [0, 700].forEach((d, i) => { const c = T.el('ellipse', { cx: x + (i ? 30 : -25), cy: y, rx: 6, ry: 2.5, fill: 'none', stroke: '#F6ECD8', 'stroke-width': 2 }, T.fx);
        c.style.transformBox = 'fill-box'; c.style.transformOrigin = '50% 50%';
        c.animate([{ transform: 'scale(.4)', opacity: .9 }, { transform: 'scale(3)', opacity: 0 }], { duration: 1400, delay: d, iterations: Infinity }); });
    }
    function dress(key) {
      if (key === 'pp_bg_room_day_v2') mid(L.map_table, X(150, 250), FL);
      if (key === 'pp_bg_gate_night_lb') {
        flicker(mid(L.lantern_post, 940, FL)); L.lantern_post.pos.style.filter = 'brightness(.7) saturate(.85)';   // 빛 상자 밤: 기둥을 조금 낮춰 성문 빛이 가장 밝게
        front(L.puddle, X(80, 470), 585); front(L.puddle2, X(960, 830), 585); [L.puddle, L.puddle2].forEach(a => { a.pos.style.filter = 'brightness(.55) saturate(.8)'; }); rings(X(80, 470), 560); rings(X(960, 830), 560);
      }
      if (key === 'pp_bg_guest_day_v2' || key === 'pp_bg_guest_night_lb') {
        mid(L.pea_vine, 40, FL); L.pea_vine.body.style.filter = key === 'pp_bg_guest_night_lb' ? 'brightness(.6) saturate(.8)' : '';
      }
      if (key === 'pp_bg_yard_day_v2') {
        mid(L.rose_arch, X(120, 330), FL); mid(L.fountain, 950, FL);
        L.fountain.body.animate([{ translate: '0 0' }, { translate: '0 -3px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity });
        [[L.bunting, X(250, 470)], [L.bunting2, X(750, 690)]].forEach(([g, x]) => { front(g, x, 92); g.body.animate([{ rotate: '-1.5deg' }, { rotate: '1.5deg' }, { rotate: '-1.5deg' }], { duration: 4000, iterations: Infinity, easing: 'ease-in-out' }); });
        front(L.flowerbed, X(40, 290), 585);
      }
    }
    /* 탑 꼭대기 별(코드, 크림 별) */
    function topStars(n, dy = 0) {
      for (let i = 0; i < n; i++) {
        const x = TX + [-150, 150, -110, 120][i], y = [70, 60, 20, 15][i] + dy, r = 10;
        const st = T.el('path', { d: `M0 ${-r} L${r * .3} ${-r * .3} L${r} 0 L${r * .3} ${r * .3} L0 ${r} L${-r * .3} ${r * .3} L${-r} 0 L${-r * .3} ${-r * .3} Z`, fill: '#F6ECD8', transform: `translate(${x},${y})` }, T.fx);
        st.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 1200, delay: i * 200 }).finished.then(() => st.remove(), () => st.remove());
      }
    }
    const towerShake = () => { rig.style.transformBox = 'view-box'; rig.style.transformOrigin = `${TX}px ${FL}px`; rig.animate([{ rotate: '0deg' }, { rotate: '1deg' }, { rotate: '-1deg' }, { rotate: '0deg' }], 400); sparkleSfx(T); };
    hitBox(T, boat, 100, 100); hitBox(T, peaC, 100, 100); hitBox(T, pillow, 100, 100); hitBox(T, matC, 250, 100); hitBox(T, kase, 100, 150);
    T.director({ cast: { pea, prince, queen, king }, noFace: ['pea', 'prince', 'queen', 'king'] });

    /* 탑 한 채를 rig 안에 세운다(6·7·8장) */
    const buildTower = () => {
      put(T, board, TX, FL); inRig(board);
      mats.forEach((m, i) => { put(T, m, TX, BOARD_TOP - i * MAT_H); inRig(m); });
      duvs.forEach((d, j) => { put(T, d, TX, TOP20 - j * DUV_STEP); inRig(d); });
      put(T, peaB, TX - 60, BOARD_TOP + 4); inRig(peaB);
    };
    const reward = (a, ms = 1200, h = 14) => { glow(a, ms); a.hop(h, 400); cue('ding_glock', .8) || sparkleSfx(T); };
    const wrongSay = (a, text) => async () => { await a.wiggle(8, 360); await say(text); };

    /* ===== 읽어 주기: 동사 맵(READ_ACTS). 놀이판 장면·배우·소품 함수를 그대로 감싼다 ===== */
    const READ_CAMP = [770, 700, 630, 500, TX, TX, TX, 520, 560];   // 세로 화면 카메라 가운데 — 장면 차례별(놀이판 camSnap 값)
    const READ_PX = { pea: { 500: 560, 740: TX + 160, 720: 620, 520: 540 }, queen: { 410: 330, 690: 620, 350: 400, 330: 400, 290: 400 }, prince: { 300: 420, 400: 500, 430: 450 } };
    const POPC = { '휴우': '#1F2A56', '뚝뚝': '#1F2A56', '뒤척뒤척': '#1F2A56', '하암': '#1F2A56', '우르릉': '#1F2A56', '번쩍': '#D9A94E' };
    let rsc = -1, rcamP = 500, rrain = null, rtoss = null, rtowerRig = false, rclimb = false;
    const rinst = () => T.readInstant();
    const rcam = (ms = 600) => (P ? (rinst() ? (camSnap(rcamP, 280, 1), Promise.resolve()) : T.camTo(rcamP, 280, 1, ms)) : Promise.resolve());
    const rstop = () => { if (rtoss) { clearInterval(rtoss); rtoss = null; } };
    const rkey = k => { const b = k.replace(/_(v2|lb)$/, ''); return b + (b === 'pp_bg_gate_night' || b === 'pp_bg_guest_night' ? '_lb' : '_v2'); };   // 밤 두 장면은 빛 상자판
    const rat = (who, a, args) => {
      const [xy, look, dir] = args; const [x0, y] = String(xy).split(',').map(Number);
      const x = P && READ_PX[who] && READ_PX[who][x0] != null ? READ_PX[who][x0] : x0;
      if (a === pea) rstop();
      put(T, a, x, y, { look: look || undefined, to: dir || undefined });
      if (a === pea && rtowerRig) inRig(a);
      return a;
    };
    const rhop = (a, h = 10) => { a.hop(h, 340); };
    const actorAct = (who, a) => (cmd, ...args) => {
      if (cmd === 'look') { if (a === pea) rstop(); a.look(args[0], args[1]); return; }
      if (cmd === 'at') return rat(who, a, args);
      if (cmd === 'hop') return rhop(a, 10);
      if (cmd === 'wiggle') return a.wiggle(3, 500);
      if (cmd === 'fade') { if (rinst()) { a.pos.style.display = ''; } else fadeIn(a, 400); return; }
    };
    const peaAct = actorAct('pea', pea);
    const READ_ACTS = {
      set: key => { rsc++; rcamP = READ_CAMP[Math.min(rsc, READ_CAMP.length - 1)]; rstop(); rrain = null; rtowerRig = false; rclimb = false; scene(rkey(key)); if (P) camSnap(rcamP, 280, 1); },
      cam: () => rcam(),
      follow: x => { if (!P) return; const m = { 300: 420, 700: 700, 600: TX + 40 }; return follow(m[x] != null ? m[x] : +x); },
      rig: d => { rtowerRig = true; return rigTo(T, d === 'up' ? RIG_UP : 0, rinst() ? 0 : 1600); },
      pea: (cmd, ...args) => {
        if (cmd === 'climb') {
          rstop(); pea.look('climb', 'left'); pea.place(TX + 125, FL); inRig(pea); follow(TX + 40);
          return (async () => {
            let on = true; (async () => { while (on) { sfx(T, 'step_wood', .3); await sleep(500); } })();
            await Promise.all([pea.move(TX + 125, TOP20, CLIMB, 'linear'), rigTo(T, RIG_UP, CLIMB)]); on = false;
          })();
        }
        if (cmd === 'lie') { rstop(); pea.look('lie_a'); put(T, pea, TX, DUV_TOP, { look: 'lie_a' }); inRig(pea); if (!rinst()) topStars(4, RIG_UP); return; }
        if (cmd === 'toss') { rstop(); rtoss = setInterval(() => pea.look(pea.cur === 'lie_a' ? 'lie_b' : 'lie_a'), 900); setTimeout(rstop, 12000); return; }
        if (cmd === 'place') {   // 완두콩을 침대 판자에 쏙
          return (async () => {
            peaC.move(queen.x + 60, FL - 120, 600, 'ease-in'); await sleep(600); hide(peaC);
            put(T, peaB, board.x - 60, BOARD_TOP + 4); inRig(peaB); fadeIn(peaB, 250);
            fadeOut(T, matC, 400); fadeOut(T, pillow, 400);
          })();
        }
        return peaAct(cmd, ...args);
      },
      prince: actorAct('prince', prince),
      queen: (cmd, ...args) => {
        if (cmd === 'hug') {
          queen.look('hug'); sfx(T, 'paper_up', .4);
          return (async () => { await queen.move(pea.x - 85, FL, 700, 'ease-out'); queen.hop(10, 360); pea.hop(10, 360); topStars(3); })();
        }
        return actorAct('queen', queen)(cmd, ...args);
      },
      king: (cmd, ...args) => {
        if (cmd === 'at') { const [x, y] = args[0].split(',').map(Number); return put(T, king, x, y, { look: 'lantern' }); }
        if (cmd === 'fade') { king.pos.style.display = ''; if (!rinst()) fadeIn(king, 400); }
      },
      boat: cmd => {
        if (cmd === 'set') { put(T, boat, 600, 300, { to: 'right' }); boat.body.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity }); return; }
        if (cmd === 'sail') return (async () => { await boat.move(900, 300, 3500, 'linear'); await sleep(300); boat.turn('left'); await boat.move(600, 300, 3500, 'linear'); boat.turn('right'); })();
      },
      lands: () => { put(T, lands, 754, 262); },
      storm: () => {
        put(T, cloudA, 250, 110); put(T, cloudB, 820, 95, { to: 'right' });
        put(T, doorC, 700, FL); put(T, bolt, 480, 190); bolt.pos.style.opacity = 0;
        put(T, doorO, 700, FL); hide(doorO); put(T, queen, 745, FL, { look: 'smile' }); put(T, king, 700, FL, { look: 'lantern' }); hide(queen); hide(king);
        cloudA.body.animate([{ translate: '0 0' }, { translate: '6px 0' }, { translate: '0 0' }], { duration: 2400, iterations: Infinity });
        cloudB.body.animate([{ translate: '0 0' }, { translate: '-6px 0' }, { translate: '0 0' }], { duration: 2400, iterations: Infinity });
      },
      rain: o => {
        if (o === 'on') { rrain = rain(T); return; }
        const r = rrain; rrain = null; if (!r) return;
        if (rinst()) r.remove(); else return T.anim(r, [{ opacity: 1 }, { opacity: 0 }], 600);
      },
      lightning: async () => {
        bolt.pos.animate([{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .5 }, { opacity: 0 }], { duration: 450 });
        cue('thunder', .45) || sfx(T, 'boom', .35, () => T.tone([120, 60], .4, { type: 'square', vol: .12 })); await sleep(500);
      },
      door: cmd => {
        if (cmd === 'knock') { doorC.wiggle(4, 300); sfx(T, 'knock', .6, () => T.tone([900, 400], .1, { vol: .2 })); return sleep(700); }
        if (cmd === 'open') {
          if (rinst()) { hide(doorC); doorO.pos.style.display = ''; queen.pos.style.display = ''; return; }
          fadeOut(T, doorC, 300); fadeIn(doorO, 300); fadeIn(queen, 400);
        }
      },
      compare: cmd => {
        if (cmd === 'hide') { hide(matC); hide(pillow); hide(peaC); return; }
        put(T, board, X(820, 760), FL); inRig(board);
        if (P) { put(T, peaC, 500, 300); put(T, pillow, 500, 400); put(T, matC, 500, FL); }
        else { put(T, matC, 180, FL); put(T, pillow, 360, FL); put(T, peaC, 470, FL); }
      },
      pile: () => {
        const PILE_X = X(850, 700);
        mats.forEach(hide); duvs.forEach(hide);
        pile.forEach((p, k) => put(T, p, PILE_X, FL - k * MAT_H));
      },
      tower: (cmd, a) => {
        if (cmd === 'build') { buildTower(); rtowerRig = true; rig.appendChild(peaB.pos); return; }
        if (cmd === 'stack') {
          const [from, to] = a.split(',').map(Number), PILE_X = X(850, 700);
          return (async () => {
            for (let i = from; i < to; i++) {
              const m = mats[i];
              put(T, m, PILE_X, FL - 100); inRig(m); rig.appendChild(peaB.pos);
              m.move(TX, BOARD_TOP - i * MAT_H, 450, 'ease-out'); cue('cushion', .45) || sfx(T, 'paper_down', .35);
              if (i >= 15) hide(pile[19 - i]);
              if (i === 9 || i === 19) setTimeout(towerShake, 450);
              await sleep(480);
            }
          })();
        }
      },
      duvets: async () => {
        for (let j = 0; j < 4; j++) {
          const d = duvs[j]; put(T, d, TX, -80); inRig(d); d.move(TX, TOP20 - j * DUV_STEP, 500, 'ease-in'); sfx(T, 'swish', .3); await sleep(550);
        }
        rig.appendChild(peaB.pos); duvs.forEach(d => d.hop(6, 400));
      },
      ladder: () => { put(T, ladder, TX + 125, FL); inRig(ladder); },
      case: () => { put(T, kase, X(800, 660), FL); put(T, peaM, kase.x, kase.y - 95); },
      glow: w => {
        if (w === 'king') glow(king, 1200);
        else if (w === 'pea') glow(pea, 1200);
        else if (w === 'peaB') { glow(peaB, 1600); peaB.hop(8, 400); }
        else if (w === 'peaM') { glow(peaM, 1500); peaM.hop(10, 360); }
      },
      petals: () => petals(T),
      sparkle: () => sparkleSfx(T),
      shake: () => T.shake(),
      confetti: () => T.confetti(),
      snd: (n, v = .7, d = 0) => { try { +d > 0 ? setTimeout(() => cue(n, +v), +d) : cue(n, +v); } catch (e) { /* */ } },
      amb: (n, v = .2, d = 4) => { try { AudioFX.ambient(n, { vol: +v, dur: Math.min(+d, 5) }); } catch (e) { /* */ } },
      fx: n => { if (n === 'creak' && cue('door_heavy_1', .6)) return; sfx(T, n, n === 'tada' ? undefined : .4, n === 'tada' ? () => sparkleSfx(T) : undefined); },
      pop: s => {
        const [x0, y, ...t] = s.split(','), txt = t.join(','), x = P ? Math.max(rcamP - 110, Math.min(rcamP + 110, +x0)) : +x0;
        T.pop(x, +y, tr(txt), POPC[txt]);
      },
    };
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) return T.readPlay(READ_ACTS).finally(() => { try { AudioFX.stopAmbient(); } catch (e) { /* */ } });

    /* ===== 1. 진짜 공주를 찾아서 (톡 1 — 배) ===== */
    scene('pp_bg_room_day_v2');
    put(T, lands, 754, 262);
    put(T, boat, 600, 300, { to: 'right' });
    boat.body.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity });
    put(T, queen, X(410, 330), FL, { look: 'smile' });
    put(T, prince, X(300, 420), FL, { look: 'sigh' });
    if (P) camSnap(770, 280, 1);
    await T.curtain(true);
    intro.go(); // 시작 음악 (놀이)
    await say('옛날에 진짜 공주와 결혼하고 싶은 왕자가 있었어요.');
    await T.ask('배를 톡 눌러 봐요.', () => T.tap(boat.hit, { prompt: '배를 톡 눌러 봐요.' }));
    sfx(T, 'swish', .35); T.pop(754, 200, tr('출렁출렁'));
    {
      const t = boat.move(900, 300, SAIL, 'linear');
      await say('왕자는 배를 타고 온 세상을 돌아다녔어요.'); await t;
      await sleep(500);
      boat.turn('left');
      const back = boat.move(600, 300, SAIL, 'linear');
      setTimeout(() => T.pop(754, 200, tr('출렁출렁')), 1500);
      await back; boat.turn('right'); await sleep(300);
    }
    follow(X(300, 420), 600);
    prince.wiggle(3, 500); T.pop(prince.x - 95, FL - 250, tr('휴우'), '#1F2A56');
    await say('온 세상을 다 가 봤지만, 진짜 공주인지 알 수 없었어요.');
    await sleep(SCENE_END);

    /* ===== 2. 폭풍우 밤 (자동) ===== */
    await T.sceneCard(tr('폭풍우 밤'), () => {
      scene('pp_bg_gate_night_lb');
      put(T, cloudA, 250, 110); put(T, cloudB, 820, 95, { to: 'right' });
      put(T, doorC, 700, FL);
      put(T, bolt, 480, 190); bolt.pos.style.opacity = 0;
      rain(T);
      cloudA.body.animate([{ translate: '0 0' }, { translate: '6px 0' }, { translate: '0 0' }], { duration: 2400, iterations: Infinity });
      cloudB.body.animate([{ translate: '0 0' }, { translate: '-6px 0' }, { translate: '0 0' }], { duration: 2400, iterations: Infinity });
      if (P) camSnap(700, 280, 1);
    }, doorC.pos);
    {
      const t = (async () => {
        await sleep(1200);
        bolt.pos.animate([{ opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: 1, offset: .5 }, { opacity: 0 }], { duration: 450 });
        cue('thunder', .45) || sfx(T, 'boom', .35, () => T.tone([120, 60], .4, { type: 'square', vol: .12 }));
        T.pop(480, 60, tr('번쩍'), '#D9A94E'); T.shake();
        await sleep(800);
        T.pop(250, 40, tr('우르릉'), '#1F2A56');
      })();
      await say('그날 밤, 비가 쏟아지고 천둥이 우르릉!'); await t;
    }
    await sleep(600);
    doorC.wiggle(4, 300); sfx(T, 'knock', .6, () => T.tone([900, 400], .1, { vol: .2 })); T.pop(700, 150, tr('똑똑'));
    await sleep(900);
    doorC.wiggle(4, 300); sfx(T, 'knock', .6, () => T.tone([900, 400], .1, { vol: .2 })); T.pop(740, 150, tr('똑똑'));
    await say('누가 성문을 똑똑, 두드려요.');
    await sleep(SCENE_END);

    /* ===== 3. 문 앞의 아가씨 (톡 2 — 성문) ===== */
    let rain3;
    await T.sceneCard(tr('문 앞의 아가씨'), () => {
      scene('pp_bg_gate_night_lb');
      put(T, cloudA, 250, 110); put(T, cloudB, 820, 95, { to: 'right' });
      put(T, doorO, 700, FL); hide(doorO);
      put(T, queen, 745, FL, { look: 'smile' }); put(T, king, 700, FL, { look: 'lantern' }); hide(queen); hide(king);
      put(T, doorC, 700, FL);
      put(T, pea, X(500, 560), FL, { look: 'wet', to: 'right' });
      rain3 = rain(T);
      if (P) camSnap(630, 280, 1);
    }, doorC.pos);
    T.pop(pea.x - 85, FL - 40, tr('뚝뚝'), '#1F2A56');
    bob(doorC.pos); doorC.pos.style.pointerEvents = 'auto';
    await T.ask('성문을 톡 눌러 봐요.', () => T.tap(doorC.pos, { prompt: '성문을 톡 눌러 봐요.' }));
    doorC.pos.style.pointerEvents = 'none';
    sfx(T, 'door_heavy_1', .6, () => sfx(T, 'creak', .5)); T.pop(700, 150, tr('끼익'));
    fadeOut(T, doorC, 300); fadeIn(doorO, 300);
    fadeIn(queen, 400); fadeIn(king, 400); glow(king, 1200);
    await say('이 밤에 누구지?');
    pea.hop(10, 320);
    await say('비를 맞았지만 괜찮아요. 저는 진짜 공주예요!');
    queen.wiggle(3, 400);
    await say('어서 들어와 몸을 말리렴.');
    queen.look('wink'); T.pop(queen.x + 70, FL - 250, tr('찡긋'));
    await say('진짜 공주인지는… 살짝 알아볼까?');
    await T.anim(rain3, [{ opacity: 1 }, { opacity: 0 }], 600);
    await sleep(SCENE_END);

    /* ===== 4. 왕비의 완두콩 (배움 놀이 1: 제일 작은 것 · 제일 큰 것) ===== */
    await T.sceneCard(tr('왕비의 완두콩'), () => {
      scene('pp_bg_guest_day_v2');
      put(T, board, X(820, 760), FL); inRig(board);
      put(T, queen, X(690, 620), FL, { look: 'place', to: 'right' });
      if (P) { put(T, peaC, 500, 300); put(T, pillow, 500, 400); put(T, matC, 500, FL); }   // 세로: 누르는 자리 100씩(화면 90px) 겹치지 않게
      else { put(T, matC, 180, FL); put(T, pillow, 360, FL); put(T, peaC, 470, FL); }
      if (P) camSnap(500, 280, 1);
    }, peaC.pos);
    await say('왕비님은 손님방에 완두콩 한 알, 베개, 매트리스 한 장을 가져왔어요.');
    cue('question', .6);
    await T.ask('셋 중에서 제일 작은 것은 뭘까요? 눌러 봐요.', () => T.choose([
      { el: peaC.hit, ok: true },
      { el: pillow.hit, ok: false, onWrong: wrongSay(pillow, '그건 베개예요. 더 작은 걸 찾아봐요.') },
      { el: matC.hit, ok: false, onWrong: wrongSay(matC, '그건 매트리스예요. 더 작은 걸 찾아봐요.') },
    ], { prompt: '셋 중에서 제일 작은 것은 뭘까요? 눌러 봐요.' }));
    reward(peaC); T.pop(peaC.x, peaC.y - 70, tr('반짝!'));
    await say('맞아요, 완두콩이 제일 작아요!');
    await sleep(1400);
    cue('question', .6);
    await T.ask('그럼 제일 큰 것은 뭘까요? 눌러 봐요.', () => T.choose([
      { el: matC.hit, ok: true },
      { el: peaC.hit, ok: false, onWrong: wrongSay(peaC, '그건 완두콩이에요. 더 큰 걸 찾아봐요.') },
      { el: pillow.hit, ok: false, onWrong: wrongSay(pillow, '그건 베개예요. 더 큰 걸 찾아봐요.') },
    ], { prompt: '그럼 제일 큰 것은 뭘까요? 눌러 봐요.' }));
    reward(matC, 1200, 10); T.pop(matC.x, matC.y - 60, tr('반짝!'));
    await say('맞아요, 매트리스가 제일 커요!');
    follow(X(700, 700));
    {
      const t = (async () => {
        peaC.move(queen.x + 60, FL - 120, 600, 'ease-in');
        await sleep(600); hide(peaC);
        await sleep(300);
        put(T, peaB, board.x - 60, BOARD_TOP + 4); inRig(peaB); fadeIn(peaB, 250);
        sfx(T, 'poke', .4, () => T.tone([600, 900], .06, { vol: .15 })); T.pop(board.x - 60, BOARD_TOP - 50, tr('톡'));
      })();
      await say('요 조그만 완두콩 한 알을 침대 판자에 톡. 아무도 못 본 척!'); await t;
    }
    fadeOut(T, matC, 400); fadeOut(T, pillow, 400);
    queen.look('wink');
    await sleep(SCENE_END);

    /* ===== 5. 매트리스 스무 장 (배움 놀이 2: 수 세기 1~20, 톡 2번) ===== */
    const PILE_X = X(850, 700);
    let bedHit;
    await T.sceneCard(tr('매트리스 스무 장'), () => {
      scene('pp_bg_guest_day_v2');
      put(T, board, TX, FL); inRig(board);
      put(T, peaB, TX - 60, BOARD_TOP + 4); inRig(peaB);
      pile.forEach((p, k) => put(T, p, PILE_X, FL - k * MAT_H));
      put(T, queen, X(350, 400), FL, { look: 'lift' });
      bedHit = T.el('g', {}, rig);
      const bedR = T.el('rect', { x: TX - 125, y: BOARD_TOP - 230, width: 250, height: 260, fill: '#000', 'fill-opacity': 0 }, bedHit);
      const pileR = T.el('rect', { x: PILE_X - 130, y: FL - 5 * MAT_H - 60, width: 260, height: 5 * MAT_H + 60, fill: '#000', 'fill-opacity': 0 }, bedHit);   // 들썩이는 더미(5장) 자리
      (P ? bedR : pileR).dataset.hand = '1';
      if (P) camSnap(TX, 280, 1);
    }, board.pos);
    bob(pile[4].pos);
    await T.ask('완두콩 위에 매트리스를 쌓아 볼까? 몇 장일까요? 톡 눌러 봐요.', () => T.tap(bedHit, { prompt: '완두콩 위에 매트리스를 쌓아 볼까? 몇 장일까요? 톡 눌러 봐요.' }));
    const stack = async (from, to, gap) => {
      for (let i = from; i < to; i++) {
        const m = mats[i];
        put(T, m, PILE_X, FL - 100); inRig(m); rig.appendChild(peaB.pos); rig.appendChild(bedHit);
        m.move(TX, BOARD_TOP - i * MAT_H, 450, 'ease-out');
        cue('cushion', .45) || sfx(T, 'paper_down', .35);
        if (i >= 15) hide(pile[19 - i]);
        vo('n' + (i + 1));
        if (i === 9 || i === 19) setTimeout(towerShake, 450);
        await sleep(gap);
      }
    };
    await stack(0, 10, COUNT_A);
    bob(pile[4].pos);
    await T.ask('열! 아직 더 있어요. 한 번 더 톡!', () => T.tap(bedHit, { prompt: '열! 아직 더 있어요. 한 번 더 톡!' }));
    await stack(10, 20, COUNT_B);
    await sleep(400);
    await say('스물! 매트리스가 스무 장이에요.');
    for (let j = 0; j < 4; j++) {
      const d = duvs[j];
      put(T, d, TX, -80); inRig(d); d.move(TX, TOP20 - j * DUV_STEP, 500, 'ease-in');
      sfx(T, 'swish', .3); await sleep(550);
    }
    rig.appendChild(peaB.pos);
    T.pop(TX, 150, tr('푹신푹신')); duvs.forEach(d => d.hop(6, 400));
    await say('이불도 스무 장, 푹신푹신!');
    await sleep(SCENE_END);

    /* ===== 6. 위? 아래? (배움 놀이 3: 위·아래) ===== */
    let zTop, zBot;
    await T.sceneCard(tr('위? 아래?'), () => {
      scene('pp_bg_guest_day_v2');
      buildTower();
      put(T, ladder, TX + 125, FL); inRig(ladder);
      put(T, pea, X(TX + 180, TX + 160), FL, { look: 'stand' }); inRig(pea);
      put(T, queen, X(330, 400), FL, { look: 'smile' });
      zTop = zone(T, TX - 125, 0, 250, 190); zBot = zone(T, TX - 125, 330, 250, 175);
      if (P) camSnap(TX, 280, 1);
    }, board.pos);
    const showZones = () => [zTop, zBot].forEach(z => { z.animate([{ opacity: 0 }, { opacity: .22 }], { duration: 400, fill: 'forwards' }); });
    const hideZones = async () => { await Promise.all([zTop, zBot].map(z => T.anim(z, [{ opacity: .22 }, { opacity: 0 }], 300))); };
    showZones();
    cue('question', .6);
    await T.ask('완두콩은 어디 있을까요? 탑의 위? 아래?', () => T.choose([
      { el: zBot, ok: true },
      { el: zTop, ok: false, onWrong: async () => { await wiggleEl(T, zTop); await say('거긴 탑의 위예요. 완두콩은 맨 아래에 있어요. 아래를 눌러 봐요.'); } },
    ], { prompt: '완두콩은 어디 있을까요? 탑의 위? 아래?' }));
    glow(peaB, 1500); peaB.hop(10, 360); cue('ding_glock', .8) || sparkleSfx(T); T.pop(TX, 420, tr('반짝!'));
    await say('맞아요! 완두콩은 맨 아래에 있어요.'); await sleep(1200);
    cue('question', .6);
    await T.ask('공주님은 어디서 잘까요? 위? 아래?', () => T.choose([
      { el: zTop, ok: true },
      { el: zBot, ok: false, onWrong: async () => { await wiggleEl(T, zBot); await say('거긴 탑의 아래예요. 공주님은 맨 위에서 자요. 위를 눌러 봐요.'); } },
    ], { prompt: '공주님은 어디서 잘까요? 위? 아래?' }));
    zTop.style.filter = 'url(#hintGlow)'; setTimeout(() => { zTop.style.filter = ''; }, 1200); cue('ding_glock', .8) || sparkleSfx(T); T.pop(TX, 110, tr('반짝!'));
    await say('맞아요! 공주님은 맨 위에서 자요.');
    await hideZones(); zTop.remove(); zBot.remove();
    await say('완두콩은 맨 아래, 공주님은 맨 위에서 자요.');
    pea.look('climb', 'left'); pea.place(TX + 125, FL);
    follow(TX + 40);
    {
      let climbing = true;
      (async () => { while (climbing) { sfx(T, 'step_wood', .3); await sleep(500); } })();
      await Promise.all([pea.move(TX + 125, TOP20, CLIMB, 'linear'), rigTo(T, RIG_UP, CLIMB)]);
      climbing = false;
    }
    pea.look('lie_a'); pea.place(TX, DUV_TOP); sfx(T, 'paper_down', .3); topStars(4, RIG_UP);
    await say('와, 높다! 잘 자요.');
    await sleep(SCENE_END);

    /* ===== 7. 잠 못 든 밤 (자동) ===== */
    await T.sceneCard(tr('잠 못 든 밤'), () => {
      scene('pp_bg_guest_night_lb');
      buildTower();
      put(T, ladder, TX + 125, FL); inRig(ladder);
      put(T, pea, TX, DUV_TOP, { look: 'lie_a' }); inRig(pea);
      rigTo(T, RIG_UP, 0);
      if (P) camSnap(TX, 280, 1);
    }, pea.pos);
    {
      const toss = setInterval(() => pea.look(pea.cur === 'lie_a' ? 'lie_b' : 'lie_a'), 900);
      T.pop(X(TX - 180, TX - 60), 36, tr('뒤척뒤척'), '#1F2A56');
      setTimeout(() => T.pop(X(TX - 180, TX - 60), 36, tr('뒤척뒤척'), '#1F2A56'), 2700);
      await say('밤이 깊었는데… 공주는 이리 뒤척, 저리 뒤척.');
      clearInterval(toss); pea.look('lie_a');
      const t = (async () => {
        rigTo(T, 0, 1500);
        await sleep(1600); glow(peaB, 1600); peaB.hop(8, 400); sfx(T, 'poke', .3);
        await sleep(1000); sfx(T, 'poke', .3);
      })();
      await say('뭔가 딱딱한 게 있는 것 같아…'); await t;
    }
    await sleep(2500);
    await rigTo(T, RIG_UP, 1600);
    pea.look('lie_b'); await sleep(1600); pea.look('lie_a'); await sleep(1600);
    await sleep(SCENE_END);

    /* ===== 8. 아침 인사 (자동) ===== */
    await T.sceneCard(tr('아침 인사'), () => {
      scene('pp_bg_guest_day_v2'); amb('birds_chirp_2');
      buildTower();
      put(T, ladder, TX + 125, FL); inRig(ladder);
      put(T, queen, X(290, 400), FL, { look: 'smile' });
      put(T, prince, X(400, 500), FL, { look: 'stand' });
      put(T, pea, X(720, 620), FL, { look: 'sleepy' });
      if (P) camSnap(520, 280, 1);
    }, pea.pos);
    pea.wiggle(3, 500); cue('sleepy_tuba', .6); T.pop(pea.x, FL - 290, tr('하암'), '#1F2A56');
    await say('아침이 되었어요. 공주가 사다리를 내려왔어요.');
    await say('잘 잤니?');
    pea.look('honest'); pea.hop(8, 300);
    await say('아니요, 솔직히 한숨도 못 잤어요. 뭔가 딱딱한 게 있어서 몸이 뻐근하고 졸려요.');
    prince.look('surprise'); prince.hop(10, 320);
    await say('매트리스 스무 장 아래 완두콩을 느끼다니! 진짜 공주로구나!');
    queen.look('hug'); sfx(T, 'paper_up', .4);
    await queen.move(pea.x - 85, FL, 700, 'ease-out');
    T.pop(queen.x - 95, FL - 240, tr('꼬옥')); queen.hop(10, 360); pea.hop(10, 360); topStars(3);
    prince.look('joy'); prince.hop(12, 360);
    await sleep(2500);

    /* ===== 9. 진짜 공주 (톡 3 — 유리 상자, 마지막 인사) ===== */
    await T.sceneCard(tr('진짜 공주'), () => {
      scene('pp_bg_yard_day_v2');
      put(T, kase, X(800, 660), FL);
      put(T, peaM, kase.x, kase.y - 95);
      put(T, prince, X(430, 450), FL, { look: 'hold', to: 'right' });
      put(T, pea, X(520, 540), FL, { look: 'hold', to: 'left' });
      if (P) camSnap(560, 280, 1);
    }, kase.pos);
    await say('왕자와 공주는 손을 꼭 잡았어요.');
    prince.hop(8, 320); pea.hop(8, 320);
    await say('진짜 공주님을 드디어 찾았어요!');
    petals(T);
    await say('완두콩은 박물관에 갔대요.');
    bob(kase.pos);
    await T.ask('유리 상자를 톡 눌러 봐요.', () => T.tap(kase.hit, { prompt: '유리 상자를 톡 눌러 봐요.' }));
    glow(peaM, 1500); peaM.hop(10, 360); cue('ding_glock', .8) || sparkleSfx(T); T.pop(kase.x, kase.y - 190, tr('반짝!'));
    [L.bunting, L.bunting2].forEach(g => g.wiggle(6, 700));
    pea.look('wave'); prince.look('joy'); pea.hop(12, 360); prince.hop(12, 360);
    T.confetti(); sfx(T, 'party_horn', .9, () => sfx(T, 'tada', undefined, () => sparkleSfx(T))); setTimeout(() => cue('applause_1', .4), 900);
    T.pop(X(475, 495), FL - 290, tr('안녕!'));
    await say('안녕!');
    await sleep(2500); try { AudioFX.stopAmbient(); } catch (e) { /* */ }
    T.finale(); await sleep(1500);
    return '느낀 것을 솔직하게 말하는 마음이 진짜 공주의 마음이에요.';
  }

  Tale.mount({ read: true, title: '완두콩 공주', subtitle: '느낀 것을 솔직하게 말하는 마음이 진짜 공주의 마음이에요', run: T => run(Tale.api) });
})();
