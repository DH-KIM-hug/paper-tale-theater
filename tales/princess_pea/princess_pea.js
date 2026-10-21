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
  };
  /* 상자를 폭·높이 둘 다 고정(preload 로 덮어쓰지 않음).
     매트리스(2026-10-22 다시 그림): 갈색 테두리 띠·누빔선·둥근 단추가 있는 옆모습. 받은 그림은 5.8:1 이라 240×20 에 넣으면 단추가 반으로 눌린다 →
     민짜 몸통 줄만 빼서 12:1(900×75)로 만든 webp 를 쓴다(단추·테두리 띠는 그대로, 원본 png 는 assets/raw/_work/pp_mattress_try1) */
  const FIXED_ASP = { pp_prop_mattress_gold: 12, pp_prop_mattress_cream: 12, pp_prop_mattress_persimmon: 12, pp_prop_duvet: 12.2, pp_prop_bed_board: 8.7 };
  /* 높이 — 같은 부위(얼굴 폭) 크기가 같아지도록 정한 값. 그림이 오면 얼굴 폭을 재서 고친다(SPEC §2-2) */
  const HT = {
    pp_princess_stand: 240, pp_princess_wet: 240, pp_princess_climb: 245, pp_princess_lie_a: 129, pp_princess_lie_b: 129, pp_princess_sleepy: 240, pp_princess_honest: 240, pp_princess_hold: 240, pp_princess_wave: 250,
    pp_prince_sigh: 240, pp_prince_stand: 240, pp_prince_surprise: 245, pp_prince_joy: 255, pp_prince_hold: 240,
    pp_queen_smile: 225, pp_queen_wink: 225, pp_queen_place: 200, pp_queen_lift: 250, pp_queen_hug: 225,
    pp_king_lantern: 225,
    pp_prop_mattress_gold: 20, pp_prop_mattress_cream: 20, pp_prop_mattress_persimmon: 20, pp_prop_duvet: 20, pp_prop_pillow: 40, pp_prop_bed_board: 30, pp_prop_ladder: 470,
    pp_prop_boat: 44, pp_prop_far_lands: 44, pp_prop_cloud: 70, pp_prop_lightning: 160, pp_prop_door_closed: 300, pp_prop_door_open: 300, pp_prop_case: 150, pp_prop_pea: 12,
  };
  /* 그림이 보는 쪽 ('left' | 'right' | 'front') */
  const NAT = { pp_princess_climb: 'left', pp_princess_lie_a: 'left', pp_princess_lie_b: 'left', pp_princess_hold: 'right', pp_prince_hold: 'right', pp_queen_place: 'right', pp_prop_boat: 'right', pp_prop_cloud: 'left' };
  const FL = 505;                       // 바닥(발끝 y)
  const MAT_W = 240, MAT_H = 20, BOARD_TOP = 475, TOP20 = BOARD_TOP - 20 * MAT_H;   // 탑: 판자 윗면 475, 20장 꼭대기 75
  const DUV_STEP = 12, DUV_TOP = TOP20 - 3 * DUV_STEP - HT.pp_prop_duvet;            // 이불 4장 꼭대기 y = 19
  const RIG_UP = 130;                   // 꼭대기를 볼 때 rig 를 내리는 양(§5-1)
  const BGS = ['pp_bg_room_day', 'pp_bg_gate_night', 'pp_bg_guest_day', 'pp_bg_guest_night', 'pp_bg_yard_day'];
  const src = k => AS + k + '.webp';    // 배경·스프라이트 모두 파일 이름 전체(pp_…)로 부른다
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
    pp_bg_room_day:    { sky: '#F6ECD8', gnd: '#D9A94E', name: '왕자의 방(낮, 오른쪽 창)', shapes: () => [['rect', { x: 554, y: 49, width: 400, height: 201, rx: 4, fill: '#BFD8EE' }], ['rect', { x: 554, y: 250, width: 400, height: 103, fill: '#8B7BB8' }], ['rect', { x: 120, y: 160, width: 160, height: 250, rx: 4, fill: '#A93B32' }]] },
    pp_bg_gate_night:  { sky: '#1F2A56', gnd: '#3a3f55', name: '성문 앞(밤)', shapes: () => [['rect', { x: -40, y: 205, width: 1080, height: 207, fill: '#55607F' }], ['rect', { x: 617, y: 205, width: 166, height: 300, rx: 4, fill: '#F2B366' }], ['rect', { x: 140, y: 250, width: 120, height: 160, fill: '#55607F' }]] },
    pp_bg_guest_day:   { sky: '#F6ECD8', gnd: '#6B4A32', name: '손님방(낮, 왼쪽 창)', shapes: () => [['rect', { x: 100, y: 70, width: 170, height: 170, rx: 4, fill: '#BFD8EE' }], ['rect', { x: 140, y: 330, width: 140, height: 80, fill: '#A93B32' }], ['rect', { x: 880, y: 150, width: 90, height: 260, fill: '#D9A94E' }]] },
    pp_bg_guest_night: { sky: '#2B3263', gnd: '#3a2a1c', name: '손님방(밤, 왼쪽 창·달)', shapes: () => [['rect', { x: 100, y: 70, width: 170, height: 170, rx: 4, fill: '#1F2A56' }], ['circle', { cx: 190, cy: 150, r: 38, fill: '#F6ECD8' }], ['rect', { x: 140, y: 330, width: 140, height: 80, fill: '#6B4A32' }]] },
    pp_bg_yard_day:    { sky: '#BFD8EE', gnd: '#3F6B4F', name: '성 마당(낮)', shapes: () => [['rect', { x: -40, y: 250, width: 1080, height: 162, fill: '#F6ECD8' }], ['circle', { cx: 160, cy: 110, r: 44, fill: '#F2B366' }], ['rect', { x: 700, y: 90, width: 160, height: 160, rx: 4, fill: '#F6ECD8' }]] },
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
    const { sleep, camSnap, tr } = T;
    const GAP = 700, SCENE_END = 1500,   /* 2026-10-22 대사 뒤·장면 끝 쉼을 줄임(전환이 느리다는 지적) */ SAIL = 8000, COUNT_A = 1400, COUNT_B = 1300, CLIMB = 6000;   // §2-7 속도 상수
    const say = async text => { await T.say(text); await sleep(GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(수 세기 n1~n20)
    const scene = key => { T.clear(); bgImage(T, key); newRig(T); camSnap(500, 280, 1); };
    if (T.fx) T.fx.style.pointerEvents = 'none';  // 빗줄기·꽃잎·'뚝뚝' 같은 효과 조각이 톡 대상을 덮지 않게
    const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    const TX = X(560, 520);                        // 탑(침대) 가운데 x — 4·5·6·7·8장 공통
    AudioFX.preloadSfx && AudioFX.preloadSfx(['paper_down', 'paper_up', 'swish', 'whoosh', 'knock', 'creak', 'boom', 'sparkle', 'tada', 'step_wood', 'poke', 'splash', 'bubbles']);
    /* 그림 파일 미리 받기: 있으면 쓰고, 없으면 자리표시. 있는 그림은 실제 비율을 읽어 ASP 를 덮어쓴다 (FIXED_ASP 는 덮어쓰지 않는다) */
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    [...Object.keys(ASP), ...Object.keys(FIXED_ASP)].forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && !FIXED_ASP[k] && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(4000)]);
    Object.assign(ASP, FIXED_ASP);
    const H = f => [f, HT[f]];

    /* ---- 배우 ---- */
    const pea = mk(T, Object.fromEntries([['stand', 'princess_stand'], ['wet', 'princess_wet'], ['climb', 'princess_climb'], ['lie_a', 'princess_lie_a'], ['lie_b', 'princess_lie_b'], ['sleepy', 'princess_sleepy'],
      ['honest', 'princess_honest'], ['hold', 'princess_hold'], ['wave', 'princess_wave']].map(([k, f]) => [k, H('pp_' + f)])));
    const prince = mk(T, Object.fromEntries([['sigh', 'prince_sigh'], ['stand', 'prince_stand'], ['surprise', 'prince_surprise'], ['joy', 'prince_joy'], ['hold', 'prince_hold']].map(([k, f]) => [k, H('pp_' + f)])));
    const queen = mk(T, Object.fromEntries([['smile', 'queen_smile'], ['wink', 'queen_wink'], ['place', 'queen_place'], ['lift', 'queen_lift'], ['hug', 'queen_hug']].map(([k, f]) => [k, H('pp_' + f)])));
    const king = mk(T, { lantern: H('pp_king_lantern') });
    const MATF = ['pp_prop_mattress_gold', 'pp_prop_mattress_cream', 'pp_prop_mattress_persimmon'];
    const mats = Array.from({ length: 20 }, (_, i) => prop(T, MATF[i % 3], MAT_H));     // 20장(금·크림·감 번갈아)
    const pile = Array.from({ length: 5 }, (_, i) => prop(T, MATF[i % 3], MAT_H));      // 5장 더미(5장 장면)
    const duvs = Array.from({ length: 4 }, () => prop(T, 'pp_prop_duvet', HT.pp_prop_duvet));
    const peaB = prop(T, 'pp_prop_pea', 12), peaC = prop(T, 'pp_prop_pea', 22), peaM = prop(T, 'pp_prop_pea', 30);   // 판자 위·비교 놀이·유리 상자
    const matC = prop(T, 'pp_prop_mattress_gold', MAT_H), pillow = prop(T, 'pp_prop_pillow', HT.pp_prop_pillow);        // 4장 비교 보기
    const board = prop(T, 'pp_prop_bed_board', HT.pp_prop_bed_board), ladder = prop(T, 'pp_prop_ladder', HT.pp_prop_ladder);
    const boat = prop(T, 'pp_prop_boat', HT.pp_prop_boat), lands = prop(T, 'pp_prop_far_lands', HT.pp_prop_far_lands);
    const cloudA = prop(T, 'pp_prop_cloud', HT.pp_prop_cloud), cloudB = prop(T, 'pp_prop_cloud', HT.pp_prop_cloud), bolt = prop(T, 'pp_prop_lightning', HT.pp_prop_lightning);
    const doorC = prop(T, 'pp_prop_door_closed', HT.pp_prop_door_closed), doorO = prop(T, 'pp_prop_door_open', HT.pp_prop_door_open), kase = prop(T, 'pp_prop_case', HT.pp_prop_case);
    const ALL = [pea, prince, queen, king, ...mats, ...pile, ...duvs, peaB, peaC, peaM, matC, pillow, board, ladder, boat, lands, cloudA, cloudB, bolt, doorC, doorO, kase];
    ALL.forEach(hide);
    hitBox(T, boat, 100, 100); hitBox(T, peaC, 100, 100); hitBox(T, pillow, 100, 100); hitBox(T, matC, 250, 100); hitBox(T, kase, 100, 150);
    T.director({ cast: { pea, prince, queen, king }, noFace: ['pea', 'prince', 'queen', 'king'] });

    /* 탑 한 채를 rig 안에 세운다(6·7·8장) */
    const buildTower = () => {
      put(T, board, TX, FL); inRig(board);
      mats.forEach((m, i) => { put(T, m, TX, BOARD_TOP - i * MAT_H); inRig(m); });
      duvs.forEach((d, j) => { put(T, d, TX, TOP20 - j * DUV_STEP); inRig(d); });
      put(T, peaB, TX - 60, BOARD_TOP + 4); inRig(peaB);
    };
    const reward = (a, ms = 1200, h = 14) => { glow(a, ms); a.hop(h, 400); sparkleSfx(T); };
    const wrongSay = (a, text) => async () => { await a.wiggle(8, 360); await say(text); };

    /* ===== 1. 진짜 공주를 찾아서 (톡 1 — 배) ===== */
    scene('pp_bg_room_day');
    put(T, lands, 754, 262);
    put(T, boat, 600, 300, { to: 'right' });
    boat.body.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity });
    put(T, queen, X(410, 330), FL, { look: 'smile' });
    put(T, prince, X(300, 420), FL, { look: 'sigh' });
    if (P) camSnap(770, 280, 1);
    await T.curtain(true);
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
      scene('pp_bg_gate_night');
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
        sfx(T, 'boom', .35, () => T.tone([120, 60], .4, { type: 'square', vol: .12 }));
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
      scene('pp_bg_gate_night');
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
    sfx(T, 'creak', .5); T.pop(700, 150, tr('끼익'));
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
      scene('pp_bg_guest_day');
      put(T, board, X(820, 760), FL); inRig(board);
      put(T, queen, X(690, 620), FL, { look: 'place', to: 'right' });
      if (P) { put(T, peaC, 500, 300); put(T, pillow, 500, 400); put(T, matC, 500, FL); }   // 세로: 누르는 자리 100씩(화면 90px) 겹치지 않게
      else { put(T, matC, 180, FL); put(T, pillow, 360, FL); put(T, peaC, 470, FL); }
      if (P) camSnap(500, 280, 1);
    }, peaC.pos);
    await say('왕비님은 손님방에 완두콩 한 알, 베개, 매트리스 한 장을 가져왔어요.');
    await T.ask('셋 중에서 제일 작은 것은 뭘까요? 눌러 봐요.', () => T.choose([
      { el: peaC.hit, ok: true },
      { el: pillow.hit, ok: false, onWrong: wrongSay(pillow, '그건 베개예요. 더 작은 걸 찾아봐요.') },
      { el: matC.hit, ok: false, onWrong: wrongSay(matC, '그건 매트리스예요. 더 작은 걸 찾아봐요.') },
    ], { prompt: '셋 중에서 제일 작은 것은 뭘까요? 눌러 봐요.' }));
    reward(peaC); T.pop(peaC.x, peaC.y - 70, tr('반짝!'));
    await say('맞아요, 완두콩이 제일 작아요!');
    await sleep(1400);
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
      scene('pp_bg_guest_day');
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
        sfx(T, 'paper_down', .35);
        if (i >= 15) hide(pile[19 - i]);
        vo('n' + (i + 1));
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
      scene('pp_bg_guest_day');
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
    await T.ask('완두콩은 어디 있을까요? 탑의 위? 아래?', () => T.choose([
      { el: zBot, ok: true },
      { el: zTop, ok: false, onWrong: async () => { await wiggleEl(T, zTop); await say('거긴 탑의 위예요. 완두콩은 맨 아래에 있어요. 아래를 눌러 봐요.'); } },
    ], { prompt: '완두콩은 어디 있을까요? 탑의 위? 아래?' }));
    glow(peaB, 1500); peaB.hop(10, 360); sparkleSfx(T); T.pop(TX, 420, tr('반짝!'));
    await say('맞아요! 완두콩은 맨 아래에 있어요.'); await sleep(1200);
    await T.ask('공주님은 어디서 잘까요? 위? 아래?', () => T.choose([
      { el: zTop, ok: true },
      { el: zBot, ok: false, onWrong: async () => { await wiggleEl(T, zBot); await say('거긴 탑의 아래예요. 공주님은 맨 위에서 자요. 위를 눌러 봐요.'); } },
    ], { prompt: '공주님은 어디서 잘까요? 위? 아래?' }));
    zTop.style.filter = 'url(#hintGlow)'; setTimeout(() => { zTop.style.filter = ''; }, 1200); sparkleSfx(T); T.pop(TX, 110, tr('반짝!'));
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
    pea.look('lie_a'); pea.place(TX, DUV_TOP); sfx(T, 'paper_down', .3);
    await say('와, 높다! 잘 자요.');
    await sleep(SCENE_END);

    /* ===== 7. 잠 못 든 밤 (자동) ===== */
    await T.sceneCard(tr('잠 못 든 밤'), () => {
      scene('pp_bg_guest_night');
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
      scene('pp_bg_guest_day');
      buildTower();
      put(T, ladder, TX + 125, FL); inRig(ladder);
      put(T, queen, X(290, 400), FL, { look: 'smile' });
      put(T, prince, X(400, 500), FL, { look: 'stand' });
      put(T, pea, X(720, 620), FL, { look: 'sleepy' });
      if (P) camSnap(520, 280, 1);
    }, pea.pos);
    pea.wiggle(3, 500); T.pop(pea.x, FL - 290, tr('하암'), '#1F2A56');
    await say('아침이 되었어요. 공주가 사다리를 내려왔어요.');
    await say('잘 잤니?');
    pea.look('honest'); pea.hop(8, 300);
    await say('아니요, 솔직히 한숨도 못 잤어요. 뭔가 딱딱한 게 있어서 몸이 뻐근하고 졸려요.');
    prince.look('surprise'); prince.hop(10, 320);
    await say('매트리스 스무 장 아래 완두콩을 느끼다니! 진짜 공주로구나!');
    queen.look('hug'); sfx(T, 'paper_up', .4);
    await queen.move(pea.x - 85, FL, 700, 'ease-out');
    T.pop(queen.x - 95, FL - 240, tr('꼬옥')); queen.hop(10, 360); pea.hop(10, 360);
    prince.look('joy'); prince.hop(12, 360);
    await sleep(2500);

    /* ===== 9. 진짜 공주 (톡 3 — 유리 상자, 마지막 인사) ===== */
    await T.sceneCard(tr('진짜 공주'), () => {
      scene('pp_bg_yard_day');
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
    glow(peaM, 1500); peaM.hop(10, 360); sparkleSfx(T); T.pop(kase.x, kase.y - 190, tr('반짝!'));
    pea.look('wave'); prince.look('joy'); pea.hop(12, 360); prince.hop(12, 360);
    T.confetti(); sfx(T, 'tada', undefined, () => sparkleSfx(T));
    T.pop(X(475, 495), FL - 290, tr('안녕!'));
    await say('안녕!');
    await sleep(2500); T.finale(); await sleep(1500);
    return '느낀 것을 솔직하게 말하는 마음이 진짜 공주의 마음이에요.';
  }

  Tale.mount({ title: '완두콩 공주', subtitle: '느낀 것을 솔직하게 말하는 마음이 진짜 공주의 마음이에요', run: T => run(Tale.api) });
})();
