/* 라푼젤 — 그림 형제 「라푼젤」(1857) 원작 그대로. 기획: tales/rapunzel/PLAN.md, 상세: SPEC.md (2026-10-21)
   톡 3번(2장 라푼젤 풀 · 4장 창문 · 10장 손잡기), 배움 놀이 2개(3장 위·아래 · 5장 긴 것·짧은 것), 연타 없음, 줄거리 선택 없음, 수세기 없음. 교훈 대사 없음.
   사람은 모두 머리 크기가 같다(2.5등신, HT 는 머리 폭으로 맞춤). 어른은 키만 조금 크다(212~215). 원근 축소 s 없음.
   탑은 소품(rp_prop_tower, 높이 445)이고 숲 배경(낮·해질녘)에 얹는다. 창문 고리·땋은 머리·오르는 사람은 모두 탑 좌표(SPEC §2-8)에서 계산한다.
   마법은 "지팡이 톡 → 별 셋 반짝 → 결과". 소품은 얼굴 없음. 피·아픔 없음.
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/rp_*.webp (목록 tools/app/gen/jobs_rapunzel.json). 그림이 생기면 코드 변경 없이 자동으로 바뀐다(ASP 는 실제 비율로 덮어씀). */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 — 그림이 오기 전엔 SPEC §2-1 시작값. 그림이 있으면 preload 가 실제 비율로 덮어쓴다 */
  const ASP = {
    rp_rap_stand: .48, rp_rap_window: .70, rp_rap_wrap: .72, rp_rap_sing: .46, rp_rap_surprise: .50, rp_rap_joy: .60, rp_rap_short_shock: .46, rp_rap_short_sing: .44, rp_rap_short_hold: .62,
    rp_gothel_stand: .50, rp_gothel_point: .68, rp_gothel_wand: .55, rp_gothel_scissors: .55, rp_gothel_cradle: .52, rp_gothel_climb: .42,
    rp_father_stand: .46, rp_father_climb: .95, rp_father_pull: .95, rp_father_shock: .55, rp_mother_window: .46,
    rp_prince_stand: .48, rp_prince_ride: 1.05, rp_prince_hide: .85, rp_prince_climb: .42, rp_prince_sad: .50, rp_prince_float: .62, rp_prince_hold: .62,
    rp_horse_stand: 1.25, rp_bird: 1.05, rp_rabbit: .80,
    rp_prop_tower: .36, rp_prop_braid: .13, rp_prop_braid_cut: .45, rp_prop_hook: .75, rp_prop_silk: 1.1, rp_prop_cradle_baby: 1.25, rp_prop_rampion: 1.0, rp_prop_rampion_pulled: .85,
    rp_layer_branch_silhouette_lb: .8767, rp_layer_tree_front: .6867, rp_layer_bush_flower_front: 1.6304, rp_layer_wildflowers_mid: 1.7143, rp_layer_mushrooms: .9717, rp_layer_butterfly: 1.295,
    rp_layer_tower_ivy: 1.5929, rp_layer_flower_pot: .6717, rp_layer_flowers_front_a: 1.415, rp_layer_flowers_front_b: 1.5625, rp_layer_flower_band_mid: 2.6706,
    rp_prop_ribbon_long: 8.0, rp_prop_ribbon_mid: 5.4, rp_prop_ribbon_short: 2.7, rp_prop_note: .62, rp_prop_petal: .62, rp_prop_star: 1.0, rp_prop_wind: 1.9,
  };
  /* 높이: 사람은 머리 폭으로 맞춘다(기준 rp_rap_stand 200). 그림이 오면 SPEC §2-2 대로 재서 고친다 */
  const HT = {
    rp_rap_stand: 200, rp_rap_sing: 200, rp_rap_surprise: 200, rp_rap_short_shock: 200, rp_rap_short_sing: 200, rp_rap_short_hold: 200, rp_rap_joy: 212, rp_rap_window: 120, rp_rap_wrap: 120,
    rp_gothel_stand: 215, rp_gothel_point: 215, rp_gothel_scissors: 215, rp_gothel_cradle: 215, rp_gothel_wand: 240, rp_gothel_climb: 235,
    rp_father_stand: 212, rp_father_climb: 190, rp_father_pull: 150, rp_father_shock: 222, rp_mother_window: 212,
    rp_prince_stand: 212, rp_prince_hold: 212, rp_prince_ride: 300, rp_prince_hide: 150, rp_prince_sad: 205, rp_prince_float: 220, rp_prince_climb: 235,
    rp_horse_stand: 230, rp_bird: 40, rp_rabbit: 56,
    rp_prop_tower: 445, rp_prop_braid: 300, rp_prop_braid_cut: 110, rp_prop_hook: 24, rp_prop_silk: 40, rp_prop_cradle_baby: 90, rp_prop_rampion: 70, rp_prop_rampion_pulled: 86,
    /* 레이어 소품(VISUAL_PLAN §5): 배경을 꾸미는 종이 조각. 누름을 받지 않는다 */
    rp_layer_branch_silhouette_lb: 200, rp_layer_tree_front: 520, rp_layer_bush_flower_front: 120, rp_layer_wildflowers_mid: 110, rp_layer_mushrooms: 70, rp_layer_butterfly: 34,
    rp_layer_tower_ivy: 120, rp_layer_flower_pot: 50, rp_layer_flowers_front_a: 120, rp_layer_flowers_front_b: 120, rp_layer_flower_band_mid: 100,
    rp_prop_note: 34, rp_prop_petal: 18, rp_prop_star: 28, rp_prop_wind: 70,
  };
  /* 그림이 보는 쪽 ('left' | 'right' | 'front') */
  const NAT = {
    rp_rap_short_hold: 'left', rp_gothel_point: 'left', rp_gothel_wand: 'right', rp_gothel_scissors: 'left', rp_gothel_cradle: 'right',
    rp_father_climb: 'right', rp_father_pull: 'right', rp_mother_window: 'right',
    rp_prince_ride: 'right', rp_prince_hide: 'right', rp_prince_hold: 'right', rp_prince_sad: 'left',
    rp_horse_stand: 'right', rp_bird: 'left', rp_rabbit: 'left', rp_prop_wind: 'right',
  };
  const FL = 505;                                                    // 바닥(발끝 y)
  const TOWER_H = 445, WIN_DY = -300, HOOK_DX = 40, BRAID_H = 300;   // 탑 좌표계 (SPEC §2-8)
  const BGS = ['rp_bg_cottage', 'rp_bg_garden_night_lb', 'rp_bg_forest_day_v2', 'rp_bg_room_v2', 'rp_bg_forest_dusk_v2', 'rp_bg_field_v2', 'rp_bg_forest_night_lb'];   // _lb: 빛 상자(VISUAL_PLAN 재기획 2, 2026-10-24) — 밤 텃밭, 9장 끝 밤 숲(크로스페이드)
  /* 2026-10-28 사용자 결정(§7-1 빛 예외): 밤 텃밭 달의 단단한 주황 고리 → 달에서 흐려지는 반투명 달무리(_glow, 같은 구도·담·고랑 자리) */
  const GLOW = { rp_bg_garden_night_lb: 1 };
  const src = k => AS + k + (GLOW[k] ? '_glow' : '') + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const artOK = {}, bgOK = {};

  /* ================= 자리표시(그림이 없을 때) ================= */
  const WHO = { rap: '라푼젤', gothel: '고텔', father: '아버지', mother: '어머니', prince: '왕자' };
  const POSE = { stand: '서기', window: '창가', wrap: '머리 감기', sing: '노래', surprise: '놀람', joy: '기쁨', short_shock: '단발 놀람', short_sing: '단발 노래', short_hold: '단발 손잡기',
    point: '가리킴', wand: '지팡이', scissors: '가위', cradle: '요람', climb: '오르기', pull: '풀 뽑기', shock: '놀람', ride: '말 탐', hide: '숨기', sad: '슬픔', float: '떠오름', hold: '손잡기' };
  const PROPN = { rp_horse_stand: '말', rp_bird: '새', rp_rabbit: '토끼', rp_prop_tower: '탑', rp_prop_braid: '땋은 머리', rp_prop_braid_cut: '잘린 머리', rp_prop_hook: '고리', rp_prop_silk: '비단실',
    rp_prop_cradle_baby: '요람', rp_prop_rampion: '라푼젤 풀', rp_prop_rampion_pulled: '뽑힌 풀', rp_prop_ribbon_long: '긴 리본', rp_prop_ribbon_mid: '중간 리본', rp_prop_ribbon_short: '짧은 리본',
    rp_prop_note: '음표', rp_prop_petal: '꽃잎', rp_prop_star: '별', rp_prop_wind: '바람' };
  const BODYC = { rap: '#B9CF7A', gothel: '#3F6B4F', father: '#6B4A32', mother: '#F6ECD8', prince: '#A93B32' };
  const SKIN = '#F2D9B8', CREAM = '#F6ECD8', GOLD = '#D9A94E', RED = '#A93B32', BROWN = '#6B4A32', GREEN = '#3F6B4F', INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";

  /* box(0..w, 0..h) 안에 종이 조각 자리표시를 그린다. 그림 파일과 같은 크기라 나중에 그림이 그대로 대신한다 */
  function placeholder(T, parent, f, w, h) {
    const g = T.el('g', {}, parent);
    const R = (x, y, ww, hh, rx, fill, extra = {}) => T.el('rect', { x, y, width: ww, height: hh, rx, fill, ...extra }, g);
    const C = (cx, cy, r, fill, extra = {}) => T.el('circle', { cx, cy, r, fill, ...extra }, g);
    const E = (cx, cy, rx, ry, fill) => T.el('ellipse', { cx, cy, rx, ry, fill }, g);
    const Pth = (d, fill, extra = {}) => T.el('path', { d, fill, ...extra }, g);
    const label = (txt, cx, cy, fill = CREAM, fs) => {
      const t = T.el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': fs || Math.max(11, Math.min(18, h * .075)), 'font-weight': 700, fill, 'font-family': FONT, text: txt }, g);
      t.classList.add('phl'); t.dataset.cx = cx; t.dataset.cy = cy; t.setAttribute('transform', `translate(${cx},${cy})`);
    };
    const m = /^rp_(rap|gothel|father|mother|prince)_(.+)$/.exec(f), nat = NAT[f] || 'front', dx = nat === 'left' ? -1 : nat === 'right' ? 1 : 0;
    if (m) {
      const [, who, pose] = m, body = BODYC[who], name = WHO[who] + ' ' + (POSE[pose] || pose);
      if (pose === 'ride') {                                        // 말 + 위에 앉은 왕자
        E(w * .5, h * .74, w * .46, h * .17, '#8A5A38'); [.2, .34, .66, .8].forEach(k => R(w * k - 6, h * .82, 12, h * .18, 4, BROWN));
        E(w * .9, h * .58, w * .09, h * .13, '#8A5A38');
        const r = h * .13; R(w * .36, h * .3, w * .2, h * .36, 10, body); C(w * .46, h * .2, r, SKIN); [-1, 0, 1].forEach(s => R(w * .46 + s * r * .5 - 3, h * .05, 6, 10, 1, GOLD));
        label(name, w * .5, h * .78, CREAM, 13); return g;
      }
      const r = Math.min(h * .17, w * .5);
      const half = pose === 'window' || pose === 'wrap' || pose === 'mother_window';
      const low = /^(climb|pull|hide)$/.test(pose) && who !== 'gothel' && who !== 'prince' || (who === 'prince' && pose === 'hide');
      if (who === 'father' && (pose === 'climb' || pose === 'pull')) {       // 몸을 가로로
        R(w * .12, h * .3, w * .76, h * .5, 12, body); C(w * .78, h * .3, h * .22, SKIN); R(w * .66, h * .02, w * .24, h * .1, 3, '#3a2a1c');
        label(name, w * .42, h * .6, CREAM, 13); return g;
      }
      if (who === 'prince' && pose === 'hide') {                              // 몸 낮게
        R(w * .2, h * .35, w * .6, h * .65, 12, body); C(w * .5, h * .25, h * .2, SKIN); [-1, 0, 1].forEach(s => R(w * .5 + s * h * .09 - 3, 0, 6, 10, 1, GOLD));
        label(name, w * .5, h * .72, CREAM, 12); return g;
      }
      const bw = Math.min(w * .78, r * 2.5), by = 2 * r - 6, bh = half ? Math.max(8, h - by) : h - by;
      if (who === 'gothel') {
        R(w / 2 - bw / 2, by, bw, bh, 16, body);
        if (pose === 'cradle') {                                              // 뒷모습: 얼굴 없음
          C(w / 2, r + 4, r, '#9A9A9A'); R(w * .15, h * .72, w * .7, h * .28, 6, BROWN); label(name, w / 2, h * .55, CREAM, 13); return g;
        }
        C(w / 2, r + 4, r, SKIN); C(w / 2, 4, r * .5, '#9A9A9A');
        if (pose === 'wand') R(w / 2 + bw * .5, 0, 5, h * .8, 2, BROWN); else R(w / 2 + bw * .5, h * .35, 5, h * .62, 2, BROWN);
        if (pose === 'point') R(w * .05, by + bh * .15, w * .4, 9, 4, body);
        if (pose === 'scissors') { Pth(`M${w * .05} ${h * .4} L${w * .45} ${h * .55}`, 'none', { stroke: '#9A9A9A', 'stroke-width': 4 }); Pth(`M${w * .05} ${h * .55} L${w * .45} ${h * .4}`, 'none', { stroke: '#9A9A9A', 'stroke-width': 4 }); }
        if (pose === 'climb') { R(w * .05, by - 10, 8, bh * .5, 4, body); R(w * .95 - 8, by - 10, 8, bh * .5, 4, body); }
        [-1, 1].forEach(s => C(w / 2 + s * r * .36 + dx * r * .25, r + 2, Math.max(2.5, r * .1), INK));
        label(name, w / 2, by + bh * .45, CREAM, Math.max(11, Math.min(15, bw / 5.2))); return g;
      }
      if (who === 'rap' && !/^short_/.test(pose)) {                           // 땋은 머리 금빛 띠(오른쪽 어깨 → 바닥)
        R(w / 2 - bw / 2, by, bw, bh, 16, body);
        if (!half) { const bx = w / 2 + bw * .38; R(bx - r * .25, by, r * .5, h - by, r * .25, GOLD); [.3, .5, .7].forEach(k => R(bx - r * .18, by + (h - by) * k, r * .36, 6, 2, RED)); }
        C(w / 2, r + 4, r, SKIN); Pth(`M${w / 2 - r} ${r + 2} Q${w / 2} ${-r * .5} ${w / 2 + r} ${r + 2} Q${w / 2} ${r * .55} ${w / 2 - r} ${r + 2}Z`, GOLD);
      } else {
        R(w / 2 - bw / 2, by, bw, bh, 16, body);
        C(w / 2, r + 4, r, SKIN);
        if (who === 'rap') Pth(`M${w / 2 - r * 1.1} ${r + 6} A${r * 1.1} ${r * 1.1} 0 0 1 ${w / 2 + r * 1.1} ${r + 6} Z`, GOLD);   // 단발 반원 머리카락
        if (who === 'father') R(w / 2 - r * 1.1, 2, r * 2.2, r * .45, 4, '#3a2a1c');
        if (who === 'mother') Pth(`M${w / 2 - r} ${r + 2} A${r} ${r} 0 0 1 ${w / 2 + r} ${r + 2} Z`, BROWN);
        if (who === 'prince') [-1, 0, 1].forEach(s => R(w / 2 + s * r * .5 - 3, -2, 6, 10, 1, GOLD));
      }
      if (who === 'mother') R(w / 2 - bw * .3, by + bh * .2, bw * .6, bh * .4, 6, GOLD);
      if (/hold$/.test(pose)) R(dx < 0 ? 0 : w / 2, by + bh * .12, w / 2, 9, 4, body);
      if (pose === 'joy') { R(w * .08, by - 20, 9, bh * .5, 4, body); R(w * .92 - 9, by - 20, 9, bh * .5, 4, body); }
      if (pose === 'climb') { R(w * .05, by - 10, 8, bh * .5, 4, body); R(w * .95 - 8, by - 10, 8, bh * .5, 4, body); }
      const big = /shock|surprise/.test(pose), sing = /sing/.test(pose);
      [-1, 1].forEach(s => {
        const ex = w / 2 + s * r * .36 + dx * r * .25;
        if (sing) Pth(`M${ex - r * .14} ${r + 2} q${r * .14} ${-r * .18} ${r * .28} 0`, 'none', { stroke: INK, 'stroke-width': 2 });
        else if (pose === 'sad') Pth(`M${ex - r * .14} ${r} q${r * .14} ${r * .18} ${r * .28} 0`, 'none', { stroke: INK, 'stroke-width': 2 });
        else C(ex, r + 2, big ? r * .16 : Math.max(2.5, r * .1), INK);
      });
      if (sing) E(w / 2 + dx * r * .25, r + r * .5, r * .12, r * .16, INK);
      if (big) E(w / 2, r + r * .5, r * .14, r * .18, INK);
      label(name, w / 2, by + bh * .45, CREAM, Math.max(10, Math.min(15, bw / 5.2)));
      return g;
    }
    const nm = PROPN[f] || f.replace('rp_prop_', '');
    switch (f) {
      case 'rp_horse_stand': E(w * .45, h * .55, w * .42, h * .22, '#8A5A38'); [.15, .3, .6, .75].forEach(k => R(w * k - 6, h * .65, 12, h * .35, 4, BROWN)); E(w * .88, h * .3, w * .1, h * .17, '#8A5A38'); C(w * .92, h * .26, 2.5, INK); label(nm, w * .45, h * .6, CREAM, 15); break;
      case 'rp_bird': C(w / 2, h / 2, h * .45, '#E8703A'); Pth(`M${w * .1} ${h * .5} L${-0} ${h * .4} L${w * .1} ${h * .65}Z`, '#F2B366'); C(w * .32, h * .4, 2.2, INK); break;
      case 'rp_rabbit': E(w / 2, h * .66, w * .45, h * .3, CREAM); R(w * .25, 0, w * .12, h * .4, 5, CREAM); R(w * .45, 0, w * .12, h * .4, 5, CREAM); C(w * .22, h * .6, 2.4, INK); break;
      case 'rp_prop_tower': R(w * .2, h * .2, w * .6, h * .8, 2, '#D8D2C4'); Pth(`M${w * .12} ${h * .2} L${w * .5} 0 L${w * .88} ${h * .2}Z`, RED);
        R(w * .38, h * .3, w * .24, h * .1, w * .12, CREAM); Pth(`M${w * .72} ${h * .3} q${w * .1} 0 ${w * .1} ${h * .02}`, 'none', { stroke: INK, 'stroke-width': 3 }); label(nm, w / 2, h * .6, BROWN, 14); break;
      case 'rp_prop_braid': R(0, 0, w, h, w * .3, GOLD); [.15, .4, .65, .88].forEach(k => R(w * .1, h * k, w * .8, h * .02, 1, RED)); break;
      case 'rp_prop_braid_cut': R(w * .1, 0, w * .32, h, w * .1, GOLD); R(w * .58, 0, w * .32, h, w * .1, GOLD); [.2, .6].forEach(k => R(w * .1, h * k, w * .8, 5, 1, RED)); break;
      case 'rp_prop_hook': Pth(`M${w * .3} 0 L${w * .3} ${h * .7} Q${w * .3} ${h} ${w * .8} ${h * .8}`, 'none', { stroke: INK, 'stroke-width': Math.max(3, w * .18) }); break;
      case 'rp_prop_silk': E(w / 2, h / 2, w / 2, h / 2, '#BFD8EE'); break;
      case 'rp_prop_cradle_baby': R(w * .05, h * .35, w * .9, h * .65, 8, BROWN); C(w / 2, h * .3, h * .22, CREAM); Pth(`M${w * .42} ${h * .3} q${w * .03} -4 ${w * .06} 0 M${w * .52} ${h * .3} q${w * .03} -4 ${w * .06} 0`, 'none', { stroke: INK, 'stroke-width': 1.6 }); break;
      case 'rp_prop_rampion': [.2, .4, .6, .8, .5].forEach((k, i) => C(w * k, h * (i === 4 ? .2 : .45), Math.min(w, h) * .13, GREEN)); E(w / 2, h, w * .45, h * .12, BROWN); break;
      case 'rp_prop_rampion_pulled': [.2, .4, .6, .8, .5].forEach((k, i) => C(w * k, h * (i === 4 ? .1 : .3), Math.min(w, h) * .12, GREEN)); R(w / 2 - 2, h * .45, 4, h * .55, 2, CREAM); break;
      case 'rp_prop_ribbon_long': case 'rp_prop_ribbon_mid': case 'rp_prop_ribbon_short': R(0, 0, w, h, 3, RED); label(nm, w / 2, h * .72, CREAM, Math.max(9, Math.min(14, h * .6))); break;
      case 'rp_prop_note': C(w * .4, h * .8, w * .22, CREAM); R(w * .55, h * .1, 3, h * .7, 1, CREAM); break;
      case 'rp_prop_petal': E(w / 2, h / 2, w * .4, h * .46, '#F2B8C0'); break;
      case 'rp_prop_star': Pth(`M${w / 2} 0 L${w * .62} ${h * .5} L${w / 2} ${h} L${w * .38} ${h * .5}Z M0 ${h / 2} L${w * .5} ${h * .38} L${w} ${h / 2} L${w * .5} ${h * .62}Z`, CREAM); break;
      case 'rp_prop_wind': Pth(`M0 ${h * .7} Q${w * .3} ${h * .1} ${w * .55} ${h * .5} T${w} ${h * .3}`, 'none', { stroke: CREAM, 'stroke-width': Math.max(6, h * .16), 'stroke-linecap': 'round' }); break;
      default: R(0, 0, w, h, Math.min(w, h) * .2, GOLD); label(nm, w / 2, h / 2, INK, 13);
    }
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
    rp_bg_cottage:     { sky: '#F6ECD8', gnd: GOLD, name: '오두막 안', shapes: () => [['rect', { x: 600, y: 120, width: 280, height: 200, rx: 4, fill: '#E9DCC0' }], ['rect', { x: 620, y: 260, width: 240, height: 60, fill: GREEN }], ['rect', { x: 120, y: 330, width: 200, height: 80, rx: 6, fill: BROWN }]] },
    rp_bg_garden_night_lb: { sky: '#1F2A56', gnd: '#4A3626', name: '밤 텃밭(왼쪽 담)', shapes: () => [['rect', { x: 0, y: 220, width: 340, height: 192, fill: '#9A9A9A' }], ['circle', { cx: 860, cy: 100, r: 46, fill: CREAM }], ['path', { d: 'M700 412 L760 300 L820 412Z', fill: GREEN }]] },
    rp_bg_forest_day_v2:  { sky: '#DCE9F2', gnd: '#9DBB7A', name: '숲(낮, 가운데 비움)', shapes: () => [['path', { d: 'M20 412 L110 150 L200 412Z', fill: GREEN }], ['path', { d: 'M800 412 L890 170 L980 412Z', fill: GREEN }]] },
    rp_bg_room_v2:        { sky: '#E4DFD3', gnd: GOLD, name: '탑 안(오른쪽 위 창)', shapes: () => [['rect', { x: 673, y: 128, width: 216, height: 244, rx: 100, fill: '#BFD8EE' }], ['rect', { x: 140, y: 330, width: 140, height: 80, rx: 6, fill: BROWN }]] },
    rp_bg_forest_dusk_v2: { sky: '#F2B366', gnd: '#7FA06A', name: '숲(해질녘, 가운데 비움)', shapes: () => [['path', { d: 'M20 412 L110 140 L200 412Z', fill: '#2F5640' }], ['path', { d: 'M800 412 L890 160 L980 412Z', fill: '#2F5640' }], ['circle', { cx: 820, cy: 90, r: 44, fill: CREAM }]] },
    rp_bg_field_v2:       { sky: '#DCE9F2', gnd: '#9DBB7A', name: '들판(오른쪽 오두막)', shapes: () => [['rect', { x: 694, y: 250, width: 160, height: 140, fill: CREAM }], ['path', { d: 'M674 250 L774 170 L874 250Z', fill: GOLD }]] },
  };
  function bgImage(T, key) {
    if (bgOK[key]) return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const d = BGPH[key], g = T.el('g', {}, T.bg);
    T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: d.sky }, g);
    T.el('rect', { x: BGBOX.x, y: 412, width: BGBOX.w, height: 200, fill: d.gnd }, g);
    d.shapes().forEach(([t, a]) => T.el(t, a, g));
    T.el('text', { x: 500, y: 52, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: key === 'rp_bg_garden_night_lb' ? CREAM : BROWN, 'font-family': FONT, opacity: .85, text: '(그림 자리) 배경: ' + d.name }, g);
    return g;
  }

  /* ================= 배우·소품 ================= */
  /* poses = { 이름: [그림, 높이] }. a.look(자세, 방향) — 그림이 보는 쪽이 다르면 뒤집는다 (앞모습은 뒤집지 않는다) */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, FL, g => {
      Object.entries(poses).forEach(([k, [f, h]]) => {
        const w = h * (ASP[f] || 1);
        const wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, f, -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
      });
    });
    a.want = 'left';
    a.pos.style.pointerEvents = 'none';   // 누르는 대상이 아닌 배우·소품이 대상 위를 덮어 누름을 가로채지 않게(2026-10-22). 대상은 hitBox 가 연다
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
  function put(T, a, x, y, { look, to } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(1); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 450) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
  const sfx = (T, name, vol, fb) => (AudioFX.sfx(name, vol) || (fb && fb()));
  const sparkleSfx = T => sfx(T, 'sparkle', undefined, () => T.tone([700, 1400], .4, { vol: .12 }));

  /* 누르는 자리 넓히기: 화면 w×h 투명 사각을 그림 가운데에 깐다(그림 뒤). a.hit = 눌릴 그룹 */
  function hitBox(T, a, w, h) {
    if (a.hitRect) a.hitRect.remove();
    const lw = w / a.scale, lh = h / a.scale;
    const r = T.el('rect', { x: -lw / 2, y: -a.h / 2 - lh / 2, width: lw, height: lh, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.body); a.hit = a.pos; a.hitRect = r; a.pos.style.pointerEvents = 'auto';
    return a;
  }
  const unhit = a => { if (a.hitRect) { a.hitRect.remove(); a.hitRect = null; } a.hit = null; a.pos.style.pointerEvents = 'none'; };

  const hopLoop = async (a, ms, h = 4) => { const end = Date.now() + ms; while (Date.now() < end - 400) await a.hop(h, 520); };
  const walk = (a, x, y, ms, ease = 'linear') => Promise.all([a.move(x, y, ms, ease), hopLoop(a, ms)]);

  /* 같은 장면 안 배경 바꾸기: 크림 종이가 덮었다 걷힌다 */
  async function veil(T, change) {
    const r = T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#F5EFE9', opacity: 0 }, T.fx);
    await T.anim(r, [{ opacity: 0 }, { opacity: 1 }], 350); r.setAttribute('opacity', 1);
    change(); T.fx.appendChild(r);
    await T.anim(r, [{ opacity: 1 }, { opacity: 0 }], 350); r.remove();
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
    if (T.fx) T.fx.style.pointerEvents = 'none';   // 효과 글자(pop)가 누르는 대상을 덮지 않게
    const { sleep, camSnap, tr } = T;
    const GAP = 700, SCENE_END = 1500,   /* 2026-10-22 대사 뒤·장면 끝 쉼을 줄임(전환이 느리다는 지적) */ CLIMB = 4500 /* 2026-10-29 6000→4500 */, BRAID = 1800 /* 2026-10-29 2600→1800 */, RISE = 2200, WALK = 3600;   // 속도 상수 (SPEC §2-7)
    const say = async text => { await T.say(text); await sleep(GAP); };
    /* 그림 컷(CLAUDE.md §5-2, SPEC 컷신 표): 사건 직후 컷을 띄우고 그 위에서 기존 대사 한 줄을 읽는다. 톡하면 바로 닫힌다 */
    const CUT_HOLD = 2600;   /* 2026-10-29 4200→2600 (컷 멈춤 줄임) */
    const cutSay = async (k, sfxName, line) => { const c = T.cutImage([{ src: src(k), sfx: sfxName, hold: CUT_HOLD }], { hold: CUT_HOLD }); await say(line); await c; };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };         // 말풍선 없는 소리(허밍)
    /* 소리 큐: 놀이에서만 만화 소리, 읽어 주기에서는 장면 시작 배경 소리(낮은 볼륨·4초 이내)만 */
    const amb = (name, v = .28, d = 4) => { try { const rd = T.reading(); AudioFX.ambient(name, { vol: rd ? Math.min(v, .18) : v, dur: rd ? Math.min(d, 4) : d }); } catch (e) { /* 소리 없이 */ } };
    const cue = (name, v) => { try { return AudioFX.sfx(name, T.reading() ? v * .8 : v); } catch (e) { return false; } };
    const SCENE_AMB = { rp_bg_garden_night_lb: 'crickets_night_1', rp_bg_forest_day_v2: 'birds_chirp_1', rp_bg_forest_dusk_v2: 'birds_chirp_2', rp_bg_field_v2: 'birds_chirp_1' };
    const bgAmb = key => { try { AudioFX.stopAmbient(.5); } catch (e) { /* */ } if (SCENE_AMB[key]) amb(SCENE_AMB[key]); };   // 배경이 바뀔 때마다(setBg) 이전 배경 소리를 끄고 새 장면 소리 시작
    const scene = key => { setBg(key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990;                 // 세로 화면(보이는 폭 약 260)
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    const TX = X(640, 560);                        // 탑의 x (3·4·6·7·9장 공통)
    const HOOKX = X(905, 905);                     // 탑 안 창 오른쪽 벽의 고리 x
    AudioFX.preloadSfx(['intro_magic', 'paper_down', 'paper_up', 'paper_tap', 'swish', 'whoosh', 'sparkle', 'tada', 'step_grass', 'pop', 'slide_up', 'slide_down', 'chop', 'knock', 'cork', 'creak', 'crickets_night_1', 'birds_chirp_1', 'birds_chirp_2', 'whistle_up', 'whistle_wobble', 'pull_pop', 'question', 'ding_glock', 'surprise_sting', 'horse_neigh_1', 'party_horn']);
    /* 그림 파일 미리 받기: 있으면 쓰고, 없으면 자리표시. 있는 그림은 실제 비율로 ASP 를 덮어쓴다 */
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    ['rp_cut_caught', 'rp_cut_climb', 'rp_cut_peek', 'rp_cut_snip', 'rp_cut_reunion'].forEach(k => loads.push(T.preload(src(k))));
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);
    // 리본 높이는 길이에서 계산: 그림이 와서 ASP 가 바뀌어도 길이 180/120/60 이 유지된다
    HT.rp_prop_ribbon_long = 180 / ASP.rp_prop_ribbon_long; HT.rp_prop_ribbon_mid = 120 / ASP.rp_prop_ribbon_mid; HT.rp_prop_ribbon_short = 60 / ASP.rp_prop_ribbon_short;

    /* ---- 배우 ---- */
    const pz = (who, names) => Object.fromEntries(names.map(n => [n, ['rp_' + who + '_' + n, HT['rp_' + who + '_' + n]]]));
    const rap = mk(T, pz('rap', ['stand', 'window', 'wrap', 'sing', 'surprise', 'joy', 'short_shock', 'short_sing', 'short_hold']));
    const gothel = mk(T, pz('gothel', ['stand', 'point', 'wand', 'scissors', 'cradle', 'climb']));
    const father = mk(T, pz('father', ['stand', 'climb', 'pull', 'shock']));
    const mother = mk(T, pz('mother', ['window']));
    const prince = mk(T, pz('prince', ['stand', 'ride', 'hide', 'climb', 'sad', 'float', 'hold']));
    const horse = prop(T, 'rp_horse_stand', HT.rp_horse_stand), bird = prop(T, 'rp_bird', HT.rp_bird), rabbit = prop(T, 'rp_rabbit', HT.rp_rabbit);
    const tower = prop(T, 'rp_prop_tower', HT.rp_prop_tower), braid = prop(T, 'rp_prop_braid', HT.rp_prop_braid), braidCut = prop(T, 'rp_prop_braid_cut', HT.rp_prop_braid_cut);
    const hook = prop(T, 'rp_prop_hook', HT.rp_prop_hook), cradle = prop(T, 'rp_prop_cradle_baby', HT.rp_prop_cradle_baby);
    const silks = [0, 1, 2].map(() => prop(T, 'rp_prop_silk', HT.rp_prop_silk)), silk = silks[0];
    const rampion = mk(T, { in: ['rp_prop_rampion', HT.rp_prop_rampion], out: ['rp_prop_rampion_pulled', HT.rp_prop_rampion_pulled] });
    const ribbons = { long: prop(T, 'rp_prop_ribbon_long', HT.rp_prop_ribbon_long), mid: prop(T, 'rp_prop_ribbon_mid', HT.rp_prop_ribbon_mid), short: prop(T, 'rp_prop_ribbon_short', HT.rp_prop_ribbon_short) };
    const notes = [0, 1, 2].map(() => prop(T, 'rp_prop_note', HT.rp_prop_note)), stars = [0, 1, 2].map(() => prop(T, 'rp_prop_star', HT.rp_prop_star)), wind = prop(T, 'rp_prop_wind', HT.rp_prop_wind);
    /* 레이어 소품(VISUAL_PLAN §4): 중간 층은 world 맨 뒤(배우보다 먼저), 앞 가림 층은 fx(배우 위, 누름 없음) */
    const deco = k => prop(T, 'rp_layer_' + k, HT['rp_layer_' + k]);
    const L = Object.fromEntries(['tree_front', 'bush_flower_front', 'wildflowers_mid', 'wildflowers_mid2', 'mushrooms', 'tower_ivy', 'flower_pot', 'flowers_front_a', 'flowers_front_b', 'flower_band_mid', 'flower_band_mid2'].map(k => [k, deco(k.replace(/2$/, ''))]));
    const flies = [0, 1].map(() => deco('butterfly'));
    const ALL = [...Object.values(L), ...flies, rap, gothel, father, mother, prince, horse, bird, rabbit, tower, braid, braidCut, hook, ...silks, cradle, rampion, ...Object.values(ribbons), ...notes, ...stars, wind];
    ALL.forEach(hide);
    T.director({ cast: { rap, gothel, father, mother, prince }, noFace: ['rap', 'gothel', 'father', 'mother', 'prince'] });

    /* ---- 배경 꾸밈: 중간 층·앞 가림 층·반딧불·나비 (VISUAL_PLAN §4) ---- */
    const mid = (a, x, y) => { put(T, a, x, y); T.world.insertBefore(a.pos, T.world.firstChild); };
    const front = (a, x, y) => { put(T, a, x, y); T.fx.appendChild(a.pos); };
    function fireflies(spots) {
      spots.forEach(([x, y], i) => {
        const c = T.el('circle', { cx: x, cy: y, r: 3 + (i % 2), fill: '#F2B366' }, T.bg);
        c.animate([{ opacity: .2 }, { opacity: .9 }, { opacity: .2 }], { duration: 2000 + (i % 3) * 450, delay: i * 230, iterations: Infinity });
      });
    }
    function butterflies(box) {      // 왼쪽 위에서 천천히 8자. 탑·인물 쪽으로 가지 않는다
      flies.forEach((b, i) => {
        const [x0, y0, x1, y1] = box, cx = x0 + (x1 - x0) * (i ? .7 : .3), cy = y0 + (y1 - y0) * (i ? .6 : .35);
        put(T, b, cx, cy); T.fx.appendChild(b.pos);
        b.body.getAnimations().forEach(n => n.cancel());
        const rx = (x1 - x0) * .25, ry = (y1 - y0) * .3, k = i ? -1 : 1;
        b.body.animate([0, 1, 2, 3, 4].map(t => ({ translate: `${k * rx * Math.sin(t * Math.PI / 2)}px ${ry * Math.sin(t * Math.PI)}px` })), { duration: 6000 + i * 900, iterations: Infinity, easing: 'ease-in-out' });
        b.body.animate([{ scale: '1 1' }, { scale: '.55 1' }, { scale: '1 1' }], { duration: 420, iterations: Infinity });
      });
    }
    function dress(key) {
      if (key === 'rp_bg_garden_night_lb') fireflies([[640, 305], [800, 318], [960, 310]].map(([x, y]) => [P ? x - 120 : x, y]));   // 빛 상자 그림에 반딧불 구멍이 있어 셋만
      if (key === 'rp_bg_forest_day_v2') {
        mid(L.wildflowers_mid, X(150, 330), FL + 20); mid(L.wildflowers_mid2, X(960, 800), FL + 20);
        front(L.tree_front, X(40, 250), 590); front(L.mushrooms, X(130, 330), 572); front(L.bush_flower_front, X(975, 770), 595);
        butterflies(P ? [380, 110, 470, 170] : [130, 110, 320, 210]);
      }
      if (key === 'rp_bg_room_v2') mid(L.flower_pot, X(668, 668), 297);
      if (key === 'rp_bg_forest_dusk_v2') {
        mid(L.wildflowers_mid, X(960, 800), FL + 20); mid(L.tower_ivy, TX - 80, FL + 8);
        front(L.tree_front, X(70, 215), P ? 640 : 590); front(L.bush_flower_front, X(975, 770), 595);   // 세로: 나무를 낮춰 왕자(350)가 잎 뒤에 숨고 말(440)은 보이게
        fireflies([[90, 420], [160, 455], [230, 400], [60, 470], [880, 430], [940, 400], [990, 460], [840, 470]].map(([x, y]) => [P ? (x < 500 ? x + 280 : x - 220) : x, y]));
      }
      if (key === 'rp_bg_field_v2') {
        if (!P) mid(L.flower_band_mid, 300, FL + 10); mid(L.flower_band_mid2, X(760, 640), FL + 10);
        front(L.flowers_front_a, X(60, 330), 595); front(L.flowers_front_b, X(945, 760), 595);
        butterflies(P ? [400, 100, 500, 160] : [110, 90, 330, 190]);
      }
    }
    const setBg = key => { bgAmb(key); T.clear(); hide(branchSil); L.tree_front.body.style.transition = ''; L.tree_front.body.style.filter = ''; bgImage(T, key); dress(key); };
    /* 9장 끝 "숲을 걷고 또 걸었어요": 해질녘 숲 위에 밤 빛 상자 숲을 3초 크로스페이드로 얹는다(VISUAL_PLAN 재기획 2 B·판단 1).
       앞 큰 나무는 밤빛 실루엣으로 낮추고, 들꽃·꽃 덤불은 걷고, 왼쪽 위에 전나무 가지 실루엣(가로만, 탑 쪽 x 300 안 넘음) */
    const branchSil = deco('branch_silhouette_lb'); hide(branchSil);
    function forestNight(instant) {
      if (!bgOK.rp_bg_forest_night_lb) return;
      const ms = instant ? 0 : 3000;
      const im = T.el('image', { href: src('rp_bg_forest_night_lb'), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none', opacity: instant ? 1 : 0 }, T.bg);
      if (!instant) T.anim(im, [{ opacity: 0 }, { opacity: 1 }], ms).then(() => im.setAttribute('opacity', 1), () => {});
      const dim = 'brightness(.35) saturate(.5)';
      L.tree_front.body.style.transition = instant ? '' : `filter ${ms}ms`; L.tree_front.body.style.filter = dim;
      [L.wildflowers_mid, L.bush_flower_front].forEach(a => { if (instant) hide(a); else fadeOut(T, a, ms); });
      [[90, 440], [230, 410], [880, 430], [960, 455]].forEach(([x, y], i) => {   // 반딧불 넷(해질녘 여덟 → 넷), 빛 상자 그림 위
        const c = T.el('circle', { cx: P ? (x < 500 ? x + 280 : x - 220) : x, cy: y, r: 3 + (i % 2), fill: '#EBD08A', opacity: 0 }, T.bg);
        c.animate([{ opacity: .2 }, { opacity: .9 }, { opacity: .2 }], { duration: 2000 + (i % 3) * 450, delay: ms + i * 230, iterations: Infinity });
      });
      if (!P) { front(branchSil, 120, 180); if (!instant) branchSil.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms); }
    }

    /* ---- 코드로 그리는 연출 (SPEC §5) ---- */
    const sillPaper = () => T.paper(T.world, [['rect', { x: -40, y: -8, width: 80, height: 12, rx: 2, fill: BROWN }]], { transform: `translate(${TX},${FL + WIN_DY + 6})` });
    /* 마법 반짝: 별 셋 */
    function magic(x, y) {
      sparkleSfx(T);
      [[x - 36, y + 10], [x, y - 30], [x + 36, y + 10]].forEach(([sx, sy], i) => {
        const s = put(T, stars[i], sx, sy);
        s.pos.style.opacity = 0;
        const an = s.pos.animate([{ opacity: 0, transform: `translate(${sx}px,${sy}px) scale(.3)` }, { opacity: 1, transform: `translate(${sx}px,${sy}px) scale(1.2)`, offset: .4 }, { opacity: 0, transform: `translate(${sx}px,${sy}px) scale(.5)` }], { duration: 900, delay: i * 90 });
        an.finished.then(() => hide(s), () => hide(s));
      });
    }
    async function towerRise() {
      tower.body.style.transformBox = 'fill-box'; tower.body.style.transformOrigin = '50% 100%';
      cue('whistle_up', .5) || AudioFX.sfx('slide_up', .5);
      setTimeout(() => T.pop(TX - 150, 200, tr('쑥!')), 600);
      await T.anim(tower.body, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1.04)', offset: .85 }, { transform: 'scaleY(1)' }], { duration: RISE, easing: 'ease-out' });
      tower.body.style.transform = '';
    }
    async function braidDown() {
      put(T, braid, TX + HOOK_DX, FL);
      braid.body.style.transformBox = 'fill-box'; braid.body.style.transformOrigin = '50% 0%';
      cue('whistle_wobble', .5) || AudioFX.sfx('slide_down', .5, () => T.tone([900, 300], .5, { vol: .1 }));
      T.pop(TX - 130, 330, tr('스르르~'));
      await T.anim(braid.body, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], { duration: BRAID, easing: 'ease-out' });
      braid.body.style.transform = '';
    }
    async function braidUp() {
      braid.body.style.transformBox = 'fill-box'; braid.body.style.transformOrigin = '50% 0%';
      AudioFX.sfx('swish', .3);
      await T.anim(braid.body, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], { duration: 1200, easing: 'ease-in' });
      hide(braid); braid.body.style.transform = '';
    }
    async function climb(who, pops) {
      who.look('climb', 'left'); T.world.appendChild(who.pos);
      who.place(TX + HOOK_DX + 2, FL);
      let climbing = true;
      const sway = (async () => { while (climbing) await who.wiggle(3, 700); })();
      const creak = (async () => { while (climbing) { AudioFX.sfx('creak', .25); await sleep(1500); } })();
      if (pops) { T.pop(TX + 165, 380, tr('영차, 영차')); setTimeout(() => T.pop(TX + 165, 380, tr('영차, 영차')), 2200); }
      await who.move(TX + HOOK_DX + 2, FL + WIN_DY + 60, CLIMB, 'linear');
      climbing = false; await sway;   /* 삐걱 소리 고리의 1.5초 쉼까지 기다리지 않는다 */
      await fadeOut(T, who, 400);
    }
    async function notesUp(x, y) {
      notes.forEach((n, i) => setTimeout(() => {
        const nx = x + 30 + i * 26; put(T, n, nx, y + 20);
        n.move(nx + (i % 2 ? 18 : -14), y - 110, 1800, 'ease-out');
        n.pos.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1800, fill: 'forwards' }).finished.then(() => hide(n), () => hide(n));
      }, i * 350));
    }
    async function hum(x, y) {
      const u = vo('hum');
      notesUp(x, y); T.pop(x, y, tr('라라라~'));
      await (u || T.playMelody(T.parseSong('G4 A4 B4 A4 G4:2 E4 G4:2'), { beat: .4 }));
    }
    async function arrowHint(x, dir) {
      const g = T.paper(T.fx, [['path', { d: 'M0 -22 L18 0 L7 0 L7 22 L-7 22 L-7 0 L-18 0 Z', fill: CREAM, stroke: BROWN, 'stroke-width': 2, transform: dir === 'down' ? 'scale(1,-1)' : '' }]], { filter: 'url(#pp)' });
      const [y0, y1] = dir === 'up' ? [330, 110] : [110, 330];
      await T.anim(g, [{ transform: `translate(${x}px,${y0}px)`, opacity: 1 }, { transform: `translate(${x}px,${y1}px)`, opacity: 0 }], { duration: 900, easing: 'ease-in-out' });
      g.remove();
    }
    async function compare(wrong, right, left) {
      const mine = [wrong, right], from = mine.map(a => [a.x, a.y]);
      const pe = mine.map(a => a.pos.style.pointerEvents);
      mine.forEach(a => { a.pos.style.pointerEvents = 'none'; });
      await Promise.all([right.move(left + right.w / 2, 300, 500), wrong.move(left + wrong.w / 2, 336, 500)]);
      await sleep(1000);
      await Promise.all(mine.map((a, i) => a.move(from[i][0], from[i][1], 500)));
      mine.forEach((a, i) => { a.pos.style.pointerEvents = pe[i]; });
    }
    function petals(x0, x1) {
      for (let i = 0; i < 12; i++) setTimeout(async () => {
        const p = prop(T, 'rp_prop_petal', HT.rp_prop_petal), x = x0 + Math.random() * (x1 - x0);
        put(T, p, x, -20);
        const d = 2500 + Math.random() * 1000;
        const m = p.move(x + (Math.random() * 60 - 30), FL + 10, d, 'ease-in');
        const wg = (async () => { const end = Date.now() + d - 700; while (Date.now() < end) await p.wiggle(12, 700); })();
        await m; hide(p); wg.catch(() => {});
      }, i * 150);
    }
    /* 탑 밖 장면의 무대: 탑 → (라푼젤 창가 → 가림판) → 고리 → 새·토끼 */
    function towerSet({ withRap = true } = {}) {
      put(T, tower, TX, FL);
      if (withRap) { put(T, rap, TX, FL + WIN_DY + 4, { look: 'window' }); sillPaper(); }
      put(T, hook, TX + HOOK_DX, FL + WIN_DY - 4);
    }
    const popAt = (a, dx, y, txt) => T.pop(a.x + dx, y, tr(txt));

    /* ===== 읽어 주기(READ_MODE.md §10): 대본 동사 → 놀이판 함수. 그림·크기·자리·컷은 놀이판 그대로 ===== */
    const READ_ACTS = (() => {
      const NUM = s => String(s).split(',').map(Number);
      let n = 0, curBg = '', winDrawn = false, curCut = null, camX = 500;
      const bgKey = k => (k === 'rp_bg_cottage' || /_(v2|lb)$/.test(k) ? k : k === 'rp_bg_garden_night' ? k + '_lb' : k + '_v2');
      /* 대본 좌표(가로 기준) → 세로 화면 자리. 놀이판이 세로에서 X(가로, 세로) 로 쓰던 값을 장면별로 모은 것 */
      const PMAP = { 1: { 600: 470 }, 2: { 640: 540 }, 3: { 640: TX, 555: TX - 85, 646: TX + 6 }, 4: { 640: TX, 555: TX - 85, 646: TX + 6 }, 5: { 760: 520, 610: 370, 720: 480 },
        6: { 640: TX, 260: 440, 330: 420, 120: 320, 470: 475, 480: 400 }, 7: { 760: 520, 770: 530, 600: 440, 640: TX }, 8: { 760: 520, 680: 440, 720: 480 }, 9: { 640: TX, 560: 440, 760: 540, 600: 480 }, 10: { 330: 420, 572: 492, 606: 526 } };
      const mx = x => {
        if (x === 742) return TX + HOOK_DX + 2;
        if (!P) return x;
        if (n === 8 && /field/.test(curBg)) return ({ 560: 520, 480: 460 })[x] ?? x;
        const m = PMAP[n]; return m && m[x] != null ? m[x] : x;
      };
      const PCAM = [0, 420, 470, 520, 520, 400, 480, 520, 520, 520, 560];
      const popX = x => { const v = mx(x); return P ? Math.max(camX - 110, Math.min(camX + 110, v)) : v; };
      const camTo0 = x => { camX = x; camSnap(x, 280, 1); };
      const bgSet = key => { setBg(key); curBg = key; winDrawn = false; if (key === 'rp_bg_room_v2') put(T, hook, HOOKX, 250); };
      const winKit = () => { if (winDrawn) return; winDrawn = true; put(T, hook, TX + HOOK_DX, FL + WIN_DY - 4); sillPaper(); };
      const inst = () => T.readInstant();
      const place = (a, s, k, d) => { const [x, y] = NUM(s); return put(T, a, mx(x), y, { look: k, to: d }); };
      const actor = (a, extra = {}) => ({
        look: (k, d) => { a.look(k, d); if (k === 'hide') T.world.appendChild(a.pos); if (extra.look) extra.look(k, d); },
        at: (s, k, d) => extra.at ? extra.at(s, k, d) : place(a, s, k, d),
        hop: () => { a.hop(8, 350); }, wiggle: () => { a.wiggle(3, 600); },
        walk: s => { const [x, ms] = NUM(s); return walk(a, mx(x), FL, ms); },
        move: s => { const [x, y, ms] = NUM(s); return a.move(mx(x), y, ms, 'ease-in-out'); },
        fade: () => { fadeIn(a, 400); }, hide: () => hide(a), ...extra.more,
      });
      const A = {
        rap: actor(rap, { at: (s, k, d) => { const [x] = NUM(s); if (k === 'window' || k === 'wrap') { place0(rap, TX, FL + WIN_DY + 4, k, d); winKit(); return; } place(rap, s, k, d); } }),
        gothel: actor(gothel, { more: { walk_out: undefined } }),
        father: actor(father, { look: k => { if (k === 'pull') father.place(rampion.x - 70, FL); if (k === 'shock') rampion.move(father.x + 40, FL, 300); } }),
        mother: actor(mother, { at: s => place(mother, s, 'window', 'right') }),
        prince: actor(prince, {
          at: (s, k, d) => { const [x] = NUM(s); if (k === 'float') { place0(prince, mx(x), FL + WIN_DY - 40, k, d); return; } place(prince, s, k, d); if (n === 6 && k === 'stand') T.world.insertBefore(prince.pos, tower.pos); },
          more: {
            loop: async () => { T.world.insertBefore(prince.pos, tower.pos); await walk(prince, TX + 130, FL, 1800, 'ease-in-out'); await sleep(300); await walk(prince, X(330, 420), FL, 1800, 'linear'); },
            land: async () => {
              const mv = prince.move(X(TX - 150, TX - 110), FL, 2600, 'ease-out');
              prince.wiggle(3, 900); setTimeout(() => prince.wiggle(3, 900), 1000);
              await mv; AudioFX.sfx('paper_down', .3);
            },
          },
        }),
      };
      function place0(a, x, y, k, d) { return put(T, a, x, y, { look: k, to: d }); }
      A.gothel.walk_out = async () => {
        await walk(gothel, X(600, 540), FL, 2200, 'ease-out'); await sleep(400);
        hide(cradle); gothel.look('cradle', 'right'); AudioFX.sfx('paper_up', .4); await sleep(200);
        await walk(gothel, 1150, FL, WALK, 'linear');
      };
      const prop1 = (a, extra = {}) => ({ at: s => { const [x, y] = NUM(s); put(T, a, mx(x), extra.y != null ? extra.y : y); }, hop: () => { a.hop(6, 300); } });
      const SFX = { chop: [.6, () => T.tone([900, 300], .12, { type: 'square', vol: .18 })], cork: [.5], knock: [.5], step_grass: [.3], paper_down: [.4], paper_tap: [.4], swish: [.3], pop: [.4], tada: [] };
      const CUTS = { caught: ['rp_cut_caught', () => cue('surprise_sting', .6) || AudioFX.sfx('sparkle', .5)], climb: ['rp_cut_climb', () => AudioFX.sfx('paper_up', .4)], peek: ['rp_cut_peek', null], snip: ['rp_cut_snip', () => AudioFX.sfx('chop', .5)], reunion: ['rp_cut_reunion', () => AudioFX.sfx('pop', .4)] };
      const acts = {
        set(k) { n++; setBg(bgKey(k)); curBg = bgKey(k); winDrawn = false; if (curBg === 'rp_bg_room_v2') put(T, hook, HOOKX, 250); camTo0(500); },
        cam(s) { const [x, y, z] = NUM(s); if (x === 500 && P) camTo0(PCAM[n] || 500); else { camX = x; camSnap(x, y, z); } },
        follow(x) { if (n === 9 && +x === 300 && /forest_dusk/.test(curBg)) forestNight(T.readInstant()); follow(+x, 6000); },   // 9장 끝 밤 숲으로
        veil(k) {
          const key = bgKey(k);
          const r = T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#F5EFE9', opacity: 0 }, T.fx);
          return (async () => {
            await T.anim(r, [{ opacity: 0 }, { opacity: 1 }], 350); r.setAttribute('opacity', 1);
            bgSet(key);
            camTo0(P ? ({ rp_bg_cottage: 470, rp_bg_room_v2: n === 7 ? 480 : 520, rp_bg_field_v2: 480, rp_bg_forest_dusk_v2: 520 })[key] || 500 : 500);
            T.fx.appendChild(r);
            setTimeout(async () => { T.fx.appendChild(r); await T.anim(r, [{ opacity: 1 }, { opacity: 0 }], 350); r.remove(); }, 160);
          })();
        },
        rap: (v, ...a) => A.rap[v](...a), gothel: (v, ...a) => A.gothel[v](...a), father: (v, ...a) => A.father[v](...a), mother: (v, ...a) => A.mother[v](...a), prince: (v, ...a) => A.prince[v](...a),
        horse: (v, s) => { if (v === 'at') { const [x] = NUM(s); put(T, horse, mx(x), FL); } },
        bird: (v, s) => { if (v === 'at') { const [x] = NUM(s); put(T, bird, mx(x), FL - TOWER_H + 16); } else if (v === 'hop') bird.hop(6, 300); },
        rabbit: (v, s) => { if (v === 'at') { const [x] = NUM(s); put(T, rabbit, mx(x), FL); } else if (v === 'hop') rabbit.hop(6, 300); },
        tower(v, arg) {
          if (v === 'set') { towerSet({ withRap: arg !== 'norap' }); winDrawn = true; }
          else if (v === 'rise') { put(T, tower, TX, FL); towerRise(); }
        },
        braid: v => (v === 'down' ? braidDown() : braidUp()),
        braidcut(v) {
          if (v === 'down') return (async () => { await fadeOut(T, braidCut, 300); await braidDown(); })();
          const room = curBg === 'rp_bg_room_v2', hx = room ? HOOKX : TX + HOOK_DX, hy = room ? 250 + 110 : FL + WIN_DY - 4 + 110;
          if (inst() || !braidCut.pos.isConnected || braidCut.pos.style.display === 'none') { put(T, braidCut, hx, hy); return; }
          return (async () => { await braidCut.move(hx, hy, 800, 'ease-in-out'); AudioFX.sfx('paper_up', .4); })();
        },
        scissors() { put(T, braidCut, gothel.x + 40, FL - 60); fadeIn(braidCut, 200); rap.hop(8, 300); },
        climb: (who, pops) => climb(who === 'prince' ? prince : gothel, !!pops),
        cradle() { put(T, cradle, X(470, 430), FL); },
        magic: s => { const [x, y] = NUM(s); magic(mx(x), y); },
        hum: s => { const [x, y] = NUM(s); return hum(mx(x), y); },
        notes: s => { const [x, y] = NUM(s); notesUp(mx(x), y); },
        silks(c) {
          const k = +c; if (!prince.pos.isConnected) return;
          const show = (a, dx, ms) => { put(T, a, prince.x + dx, FL); fadeIn(a, ms); };
          if (k === 1) show(silks[0], 70, 400); else { show(silks[0], 70, 200); setTimeout(() => show(silks[1], 100, 400), 300); setTimeout(() => show(silks[2], 130, 400), 900); }
        },
        ribbon() {
          const x = rap.x + 38; put(T, ribbons.long, x - 120, FL + 20); AudioFX.sfx('swish', .3);
          return ribbons.long.move(x, FL - 14, 700, 'ease-in-out');
        },
        wind() {
          return (async () => {
            AudioFX.sfx('knock', 0); await sleep(500);
            put(T, wind, gothel.x + 90, FL - 200); fadeIn(wind, 200);
            wind.move(prince.x, FL - 230, 900, 'ease-in'); AudioFX.sfx('whoosh', .5); await sleep(900);
            prince.look('float'); await prince.move(prince.x, FL - 90, 600, 'ease-out'); hide(wind);
            await prince.move(1100, FL - 140, 900, 'ease-in');
          })();
        },
        petals() { petals(X(480, 400), X(800, 680)); },
        confetti() { T.confetti(); },
        glow(w) { glow(w === 'bird' ? bird : rabbit, 1200); },
        fx(name) { const [v, f] = SFX[name] || [.4]; if (name === 'cork' && cue('pull_pop', .8)) return; if (name === 'tada') return AudioFX.sfx('tada') || sparkleSfx(T); if (name === 'chop' || name === 'pop' || name === 'paper_down') return AudioFX.sfx(name, v, f); AudioFX.sfx(name, v, f); },
        pop(s) { const p = s.split(','); T.pop(popX(+p[0]), +p[1], tr(p.slice(2).join(','))); },
        cut(k) { const [f, sf] = CUTS[k]; curCut = T.cutImage([{ src: src(f), sfx: sf, hold: CUT_HOLD }], { hold: CUT_HOLD }); curCut.then(() => { curCut = null; }, () => { curCut = null; }); },
      };
      acts.rampion = (v, s) => { if (v === 'at') { const [x, y] = NUM(s); put(T, rampion, mx(x), y, { look: 'in' }); } else if (v === 'pull') { rampion.look('out'); rampion.move(rampion.x, FL - 60, 350, 'ease-out').then(() => rampion.move(father.x + 60, FL - 70, 400)); } };
      /* 컷이 떠 있는 동안에는 뒤따르는 동사(climb 제외: 컷 아래에서 오르기)가 컷이 끝나기를 기다린다 */
      const gate = f => (...a) => (curCut && !inst() ? curCut.then(() => f(...a)) : f(...a));
      const RA = Object.fromEntries(Object.entries(acts).map(([k, f]) => [k, ['cut', 'climb', 'set'].includes(k) ? f : gate(f)]));
      /* 읽어 주기 소리 큐 (2026-10-28): 대본 동사 snd:<이름>:<볼륨>:<지연ms> · amb:<이름>:<볼륨>:<초>. 소리는 대사·컷을 막지 않는다 */
      RA.snd = (n, v = .7, d = 0) => { try { +d > 0 ? setTimeout(() => cue(n, +v), +d) : cue(n, +v); } catch (e) { /* */ } };
      RA.amb = (n, v = .2, d = 4) => { try { AudioFX.ambient(n, { vol: +v, dur: Math.min(+d, 5) }); } catch (e) { /* */ } };
      return RA;
    })();
    if (T.reading()) intro.go(300); // 시작 음악 (읽어 주기)
    if (T.reading()) return T.readPlay(READ_ACTS).finally(() => { try { AudioFX.stopAmbient(); } catch (e) { /* */ } });

    /* ===== 1. 담 너머 텃밭 (자동) ===== */
    scene('rp_bg_cottage');
    put(T, father, 420, FL, { look: 'stand' });
    put(T, mother, X(600, 470), FL, { look: 'window', to: 'right' });
    camSnap(P ? 420 : 500, 280, 1);
    await T.curtain(true);
    intro.go(); // 시작 음악 (놀이)
    await say('옛날에 아기를 기다리는 부부가 살았어요. 아기가 곧 올 거예요.');
    setTimeout(() => T.pop(760, 120, tr('반짝!')), 1500);
    await say('담 너머 텃밭은 마녀 고텔의 마법 텃밭이라 아무도 들어가지 못했어요.');
    mother.hop(6, 400);
    await say('저 라푼젤 풀이 너무너무 먹고 싶어요.');
    father.hop(8, 300);
    await say('내가 가져올게요.');
    await sleep(SCENE_END);

    /* ===== 2. 라푼젤 풀 (톡 1 — 첫 조작) ===== */
    await T.sceneCard(tr('라푼젤 풀'), () => {
      scene('rp_bg_garden_night_lb');
      put(T, rampion, 470, FL, { look: 'in' }); hitBox(T, rampion, 100, 100);
      put(T, father, 230, 235, { look: 'climb', to: 'right' });
      camSnap(P ? 470 : 500, 280, 1);
    }, rampion.pos);
    const l4 = say('밤이 되자, 아버지는 살금살금 담을 넘었어요.');
    await sleep(600);
    AudioFX.sfx('paper_down', .4);
    await father.move(380, FL, 900, 'ease-in');
    father.look('pull', 'right'); father.place(rampion.x - 70, FL);
    await l4;
    bob(rampion.pos);
    await T.tap(rampion.hit);
    rampion.look('out'); unhit(rampion);
    cue('pull_pop', .8) || sfx(T, 'cork', .5); T.pop(rampion.x + 60, FL - 150, tr('쏙!'));
    await rampion.move(rampion.x, FL - 60, 350, 'ease-out');
    await rampion.move(father.x + 60, FL - 70, 400);
    await sleep(300);
    magic(X(640, 540), FL - 120);
    put(T, gothel, X(640, 540), FL, { look: 'point' }); fadeIn(gothel, 300);
    await cutSay('rp_cut_caught', () => cue('surprise_sting', .6) || AudioFX.sfx('sparkle', .5), '누구냐! 내 풀을 뽑다니!');
    father.look('shock'); father.hop(12, 300); rampion.move(father.x + 40, FL, 300);
    await say('아, 아내가 너무너무 먹고 싶어 해서요.');
    gothel.look('stand'); gothel.wiggle(3, 600);
    await say('내 풀을 가져가도 좋다. 대신 아기가 태어나면 내가 키우마.');
    father.look('stand');
    await say('네… 알겠어요.');
    await sleep(400);
    await veil(T, () => { setBg('rp_bg_cottage'); camSnap(X(500, 470), 280, 1); put(T, cradle, X(470, 430), FL); put(T, gothel, 1150, FL, { look: 'stand' }); });
    const walkOut = (async () => {
      const t0 = walk(gothel, X(600, 540), FL, 2200, 'ease-out');
      await t0;
      await sleep(400);
      hide(cradle); gothel.look('cradle', 'right'); AudioFX.sfx('paper_up', .4);
      await sleep(200);
      await walk(gothel, 1150, FL, WALK, 'linear');
    })();
    await say('아기가 태어났어요. 마녀 고텔은 아기를 데려가 라푼젤이라고 이름 짓고 정성껏 키웠어요.');
    await walkOut;
    await sleep(SCENE_END);

    /* ===== 3. 문 없는 탑 (배움 놀이 1: 위·아래) ===== */
    await T.sceneCard(tr('문 없는 탑'), () => {
      scene('rp_bg_forest_day_v2');
      put(T, gothel, 470, FL, { look: 'wand', to: 'right' });
      camSnap(P ? 520 : 500, 280, 1);
    }, gothel.pos);
    const knock = (async () => { await sleep(2000); gothel.hop(6, 300); AudioFX.sfx('knock', .5); T.pop(gothel.x + 70, FL - 260, tr('톡')); magic(TX, FL - 40); })();
    await say('라푼젤이 열두 살이 되자, 마녀는 지팡이를 톡 두드렸어요.');
    await knock;
    put(T, tower, TX, FL);
    const rise = towerRise();
    const s11 = say('숲속에 문도 계단도 없는 높은 탑이 쑥 솟았어요. 창문은 꼭대기에 하나뿐이에요.');
    await rise;
    put(T, rap, TX, FL + WIN_DY + 4, { look: 'window' }); fadeIn(rap, 400);
    const sill = sillPaper(); sill.animate([{ opacity: 0 }, { opacity: 1 }], 400);
    put(T, hook, TX + HOOK_DX, FL + WIN_DY - 4);
    put(T, rabbit, TX - 85, FL); fadeIn(rabbit, 400);
    put(T, bird, TX + 6, FL - TOWER_H + 16); fadeIn(bird, 400);
    T.world.appendChild(gothel.pos);
    await s11;
    setTimeout(() => magic(TX, FL - 40), 600); setTimeout(() => AudioFX.sfx('knock', .4), 600);
    await say('자, 잠겨라. 밖은 위험하단다. 여기가 제일 안전해.');
    gothel.look('stand');
    bird.hop(6, 300); setTimeout(() => rabbit.hop(6, 300), 1800);
    await say('지붕 위에는 새 한 마리, 탑 아래에는 토끼 한 마리가 있어요.');
    hitBox(T, bird, 90, 90); hitBox(T, rabbit, 90, 90);
    const Q1 = '탑 위에 있는 새를 톡, 눌러 봐요.', Q2 = '이번엔 탑 아래에 있는 토끼를 톡, 눌러 봐요.';
    cue('question', .6);
    await T.ask(Q1, () => T.choose([{ el: bird.hit, ok: true }, { el: rabbit.hit, ok: false, onWrong: async () => { await rabbit.wiggle(8, 360); await say('그건 탑 아래에 있는 토끼예요. 위를 봐요.'); await arrowHint(TX + 110, 'up'); } }], { prompt: Q1 }));
    glow(bird, 1200); bird.hop(14, 400); cue('ding_glock', .8) || sparkleSfx(T); T.pop(TX + 120, 60, tr('반짝!'));
    await say('맞아요, 탑 위에 새!');
    cue('question', .6);
    await T.ask(Q2, () => T.choose([{ el: rabbit.hit, ok: true }, { el: bird.hit, ok: false, onWrong: async () => { await bird.wiggle(8, 360); await say('그건 탑 위에 있는 새예요. 아래를 봐요.'); await arrowHint(TX + 110, 'down'); } }], { prompt: Q2 }));
    glow(rabbit, 1200); rabbit.hop(14, 400); cue('ding_glock', .8) || sparkleSfx(T); T.pop(TX - 160, FL - 110, tr('반짝!'));
    await say('맞아요, 탑 아래에 토끼!');
    unhit(bird); unhit(rabbit);
    await sleep(SCENE_END);

    /* ===== 4. 머리를 내려요 (톡 2 — 창문) ===== */
    await T.sceneCard(tr('머리를 내려요'), () => {
      scene('rp_bg_forest_day_v2');
      towerSet();
      put(T, rabbit, TX - 85, FL); put(T, bird, TX + 6, FL - TOWER_H + 16);
      put(T, gothel, 470, FL, { look: 'stand' });
      camSnap(P ? 520 : 500, 280, 1);
    }, rap.pos);
    gothel.hop(6, 400);
    await say('라푼젤, 라푼젤, 머리를 내려 줘!');
    hitBox(T, rap, 150, 150); bob(rap.pos);
    await T.tap(rap.hit);
    unhit(rap);
    rap.look('wrap'); AudioFX.sfx('paper_tap', .4);
    await sleep(400);
    await Promise.all([braidDown(), say('스르르~ 금빛 머리가 탑 아래까지 닿았어요.')]);
    rap.look('window');
    await gothel.move(TX + HOOK_DX + 2, FL, 900, 'ease-in-out');
    gothel.look('climb');
    await Promise.all([climb(gothel, true), cutSay('rp_cut_climb', () => AudioFX.sfx('paper_up', .4), '고텔은 머리를 잡고 천천히 올라가요.')]);
    await braidUp();
    await rap.hop(6, 300);
    await sleep(SCENE_END);

    /* ===== 5. 탑 안의 노래 (배움 놀이 2: 긴 것·짧은 것) ===== */
    const LEFT = X(150, 250), ys = P ? [380, 460, 540] : [436, 494, 552], LEN = { long: 180, mid: 120, short: 60 };
    await T.sceneCard(tr('탑 안의 노래'), () => {
      scene('rp_bg_room_v2');
      put(T, hook, HOOKX, 250);
      put(T, rap, X(760, 520), FL, { look: 'sing' });
      ['long', 'mid', 'short'].sort(() => Math.random() - .5).forEach((k, i) => {
        const r = ribbons[k]; put(T, r, LEFT + LEN[k] / 2, ys[i]); hitBox(T, r, LEN[k] + 24, P ? 88 : 56);
      });
      camSnap(P ? 400 : 500, 280, 1);
    }, rap.pos);
    await say('라푼젤은 혼자 있을 때면 창가에서 노래를 불렀어요.');
    await hum(rap.x - 150, FL - 300);
    rap.hop(6, 400);
    await say('내 노래가 숲 끝까지 닿았으면.');
    ['long', 'mid', 'short'].forEach((_, i) => setTimeout(() => Object.values(ribbons).sort((a, b) => a.y - b.y)[i].hop(6, 300), i * 500));
    await say('바닥에 리본 세 개가 있어요. 길이가 다 달라요.');
    const Q3 = '라푼젤 머리를 묶을 제일 긴 리본을 찾아봐요.', Q4 = '그럼 제일 짧은 리본은 어디 있을까요?';
    cue('question', .6);
    await T.ask(Q3, () => T.choose(['long', 'mid', 'short'].map(k => ({ el: ribbons[k].hit, ok: k === 'long', onWrong: async () => {
      await ribbons[k].wiggle(8, 360);
      await say(k === 'mid' ? '그건 중간 리본이에요. 더 긴 리본이 있어요.' : '그건 제일 짧은 리본이에요. 더 긴 리본이 있어요.');
      await compare(ribbons[k], ribbons.long, LEFT);
    } })), { prompt: Q3 }));
    glow(ribbons.long, 1200); cue('ding_glock', .8) || sparkleSfx(T); T.pop(LEFT + 200, 395, tr('반짝!'));
    await say('맞아요, 제일 긴 리본!');
    const TIE = [38, -14];
    AudioFX.sfx('swish', .3);
    await ribbons.long.move(rap.x + TIE[0], FL + TIE[1], 700, 'ease-in-out');
    ribbons.long.pos.style.pointerEvents = 'none';
    cue('question', .6);
    await T.ask(Q4, () => T.choose([{ el: ribbons.short.hit, ok: true }, { el: ribbons.mid.hit, ok: false, onWrong: async () => {
      await ribbons.mid.wiggle(8, 360); await say('그건 중간 리본이에요. 더 짧은 리본이 있어요.'); await compare(ribbons.mid, ribbons.short, LEFT);
    } }], { prompt: Q4 }));
    glow(ribbons.short, 1200); cue('ding_glock', .8) || sparkleSfx(T); T.pop(LEFT + 100, 395, tr('반짝!'));
    await say('맞아요, 제일 짧은 리본!');
    AudioFX.sfx('swish', .3);
    await ribbons.short.move(rap.x + TIE[0] + 26, FL + TIE[1] - 10, 700, 'ease-in-out');
    Object.values(ribbons).forEach(unhit);
    setTimeout(() => notesUp(rap.x - 40, FL - 230), 300);
    await say('라푼젤은 리본을 묶은 머리를 창가에 늘어뜨리고 또 노래했어요.');
    await sleep(SCENE_END);

    /* ===== 6. 노랫소리 (자동) ===== */
    await T.sceneCard(tr('노랫소리'), () => {
      scene('rp_bg_forest_dusk_v2');
      towerSet();
      put(T, prince, -200, FL, { look: 'ride', to: 'right' });
      camSnap(P ? 480 : 500, 280, 1);
    }, rap.pos);
    cue('horse_neigh_1', .5);
    const stepper = (async () => { for (let i = 0; i < 4; i++) { AudioFX.sfx('step_grass', .3); await sleep(1000); } })();
    const ridePromise = walk(prince, X(260, 440), FL, 3500, 'linear');
    await say('어느 해질녘, 숲을 지나던 왕자가 노랫소리를 들었어요.');
    await Promise.all([ridePromise, stepper]);
    await hum(TX - 160, 140);
    prince.hop(6, 400);
    await say('어디서 이렇게 고운 노래가 들리지?');
    hide(prince); put(T, horse, X(260, 440), FL);
    put(T, prince, X(330, 420), FL, { look: 'stand' }); T.world.insertBefore(prince.pos, tower.pos);
    const loop = (async () => { await walk(prince, TX + 130, FL, 1800, 'ease-in-out'); await sleep(300); await walk(prince, X(330, 420), FL, 1800, 'linear'); })();
    await say('왕자는 탑을 한 바퀴 돌았지만 문이 없었어요.');
    await loop;
    const gwalk = (async () => { put(T, gothel, -100, FL, { look: 'stand' }); await walk(gothel, X(470, 475), FL, WALK, 'linear'); })();
    T.world.appendChild(prince.pos); prince.look('hide', 'right');
    const hid = prince.move(X(120, 320), FL, 1200);   // 세로: 숨은 왕자가 마녀(475)에 가려지지 않게 왼쪽으로(2026-10-24 검수)
    await say('그때 마녀 고텔이 왔어요. 왕자는 나무 뒤에 숨었어요.');
    await Promise.all([gwalk, hid]);
    gothel.hop(6, 400);
    await say('라푼젤, 라푼젤, 머리를 내려 줘!');
    rap.look('wrap');
    await braidDown();
    rap.look('window');
    await gothel.move(TX + HOOK_DX + 2, FL, 900);
    gothel.look('climb');
    await climb(gothel, true);
    await braidUp();
    prince.hop(8, 300);
    await cutSay('rp_cut_peek', null, '아, 저렇게 올라가는구나!');
    await sleep(SCENE_END);

    /* ===== 7. 왕자가 올라와요 (자동) ===== */
    await T.sceneCard(tr('왕자가 올라와요'), () => {
      scene('rp_bg_forest_dusk_v2');
      towerSet();
      put(T, prince, 470, FL, { look: 'stand' });
      camSnap(P ? 520 : 500, 280, 1);
    }, prince.pos);
    await say('다음 날 저녁, 왕자는 탑 아래에서 외쳤어요.');
    prince.hop(6, 400);
    await say('라푼젤, 라푼젤, 머리를 내려 줘요!');
    rap.look('wrap');
    await braidDown();
    rap.look('window');
    await prince.move(TX + HOOK_DX + 2, FL, 900);
    prince.look('climb');
    await climb(prince, true);
    await braidUp();
    await veil(T, () => {
      setBg('rp_bg_room_v2'); camSnap(X(500, 480), 280, 1); put(T, hook, HOOKX, 250);
      put(T, rap, X(760, 520), FL, { look: 'surprise' });
      put(T, prince, X(760, 520) + 10, FL, { look: 'stand' }); prince.pos.style.opacity = 0;
    });
    fadeIn(prince, 400); AudioFX.sfx('paper_down', .4);
    prince.pos.style.opacity = '';
    await prince.move(X(600, 440), FL, 1200, 'ease-out');
    put(T, silk, prince.x + 70, FL); fadeIn(silk, 400);
    rap.hop(10, 300);
    await say('어머, 할머니가 아니네?');
    prince.wiggle(3, 600);
    await say('놀라게 해서 미안해요. 노래가 너무 고와서 왔어요. 저와 함께 성으로 가요.');
    rap.look('joy'); rap.hop(12, 320);
    await say('좋아요. 비단실을 가져오면 사다리를 엮을게요.');
    rap.look('stand');
    setTimeout(() => { put(T, silks[1], prince.x + 100, FL); fadeIn(silks[1], 400); }, 1200);
    setTimeout(() => { put(T, silks[2], prince.x + 130, FL); fadeIn(silks[2], 400); }, 2400);
    await say('그날부터 왕자는 저녁마다 비단실을 가져왔어요.');
    await sleep(SCENE_END);

    /* ===== 8. 싹둑 (자동) ===== */
    await T.sceneCard(tr('싹둑'), () => {
      scene('rp_bg_room_v2');
      put(T, hook, HOOKX, 250);
      put(T, gothel, 560, FL, { look: 'stand' });
      put(T, rap, X(760, 520), FL, { look: 'stand' });
      camSnap(P ? 520 : 500, 280, 1);
    }, rap.pos);
    await say('어느 날, 라푼젤이 무심코 말했어요.');
    rap.hop(6, 400);
    await say('할머니, 할머니는 왜 왕자님보다 훨씬 무거워요?');
    gothel.hop(10, 300); gothel.wiggle(4, 500);
    await say('뭐라고? 왕자라니!');
    await gothel.move(rap.x - 80, FL, 700, 'ease-in-out');
    gothel.look('scissors', 'right');
    await sleep(400);
    AudioFX.sfx('chop', .6, () => T.tone([900, 300], .12, { type: 'square', vol: .18 }));
    T.pop(gothel.x - 60, 250, tr('싹둑!'));
    rap.look('short_shock'); rap.hop(8, 300);
    put(T, braidCut, gothel.x + 40, FL - 60); fadeIn(braidCut, 200);
    await braidCut.move(HOOKX, 250 + 110, 800, 'ease-in-out');
    AudioFX.sfx('paper_up', .4);
    gothel.look('wand', 'right');
    const l35 = (async () => {
      await sleep(1800);
      AudioFX.sfx('knock', .5); magic(gothel.x + 40, FL - 260); T.pop(gothel.x - 70, 230, tr('톡'));
      await sleep(800);
      await veil(T, () => { setBg('rp_bg_field_v2'); camSnap(X(500, 480), 280, 1); put(T, gothel, X(400, 400), FL, { look: 'stand' }); put(T, rap, X(560, 520), FL, { look: 'short_shock' }); });
      magic(X(480, 460), FL - 200);
    })();
    await cutSay('rp_cut_snip', () => AudioFX.sfx('chop', .5), '마녀는 가위 한 번으로 라푼젤의 머리를 자르고, 지팡이를 톡 두드려 먼 들판의 작은 오두막으로 데려갔어요.');
    await l35;
    rap.wiggle(3, 600);
    await sleep(SCENE_END);

    /* ===== 9. 빈 탑 (자동) ===== */
    await T.sceneCard(tr('빈 탑'), () => {
      scene('rp_bg_forest_dusk_v2');
      towerSet({ withRap: false });
      put(T, braidCut, TX + HOOK_DX, FL + WIN_DY - 4 + 110);
      put(T, prince, 470, FL, { look: 'stand' });
      camSnap(P ? 520 : 500, 280, 1);
    }, prince.pos);
    await say('그날 저녁, 왕자는 아무것도 모르고 탑에 왔어요.');
    prince.hop(6, 400);
    await say('라푼젤, 라푼젤, 머리를 내려 줘요!');
    const down9 = (async () => { await fadeOut(T, braidCut, 300); await braidDown(); })();
    const s37 = say('마녀는 잘린 머리를 고리에 걸어 내려 주었어요.');
    await down9;
    await prince.move(TX + HOOK_DX + 2, FL, 900);
    prince.look('climb');
    await climb(prince, false);
    await braidUp();
    await s37;
    await veil(T, () => {
      setBg('rp_bg_room_v2'); camSnap(X(500, 520), 280, 1); put(T, hook, HOOKX, 250); put(T, braidCut, HOOKX, 250 + 110);
      put(T, gothel, X(560, 440), FL, { look: 'point', to: 'right' }); put(T, prince, X(760, 540), FL, { look: 'stand' });
    });
    prince.hop(8, 300);
    await say('라푼젤은 여기 없다. 다시는 못 볼 거다. 자, 내려가라.');
    gothel.look('wand', 'right'); AudioFX.sfx('knock', .5); magic(gothel.x + 40, FL - 260);
    await sleep(500);
    put(T, wind, gothel.x + 90, FL - 200); fadeIn(wind, 200);
    const s39 = (async () => {
      wind.move(prince.x, FL - 230, 900, 'ease-in'); AudioFX.sfx('whoosh', .5); T.pop(gothel.x - 80, 240, tr('휘익~'));
      await sleep(900);
      prince.look('float'); await prince.move(prince.x, FL - 90, 600, 'ease-out'); hide(wind);
      await prince.move(1100, FL - 140, 900, 'ease-in');
    })();
    await Promise.all([s39, sleep(100)]);
    await veil(T, () => {
      setBg('rp_bg_forest_dusk_v2'); camSnap(X(500, 520), 280, 1);
      put(T, tower, TX, FL); put(T, hook, TX + HOOK_DX, FL + WIN_DY - 4);
      put(T, prince, TX + HOOK_DX, FL + WIN_DY - 40, { look: 'float' });
    });
    const land = (async () => {
      T.pop(TX - 170, 300, tr('휘익~'));
      const mv = prince.move(X(TX - 150, TX - 110), FL, 2600, 'ease-out');
      prince.wiggle(3, 900); setTimeout(() => prince.wiggle(3, 900), 1000);
      setTimeout(() => T.pop(prince.x - 110, FL - 60, tr('사뿐')), 2400);
      await mv; AudioFX.sfx('paper_down', .3);
    })();
    await say('휘익~ 마법 바람이 왕자를 탑 아래 풀숲에 사뿐 내려놓았어요.');
    await land;
    prince.look('sad');
    await say('라푼젤… 어디로 갔을까.');
    const stepper2 = (async () => { for (let i = 0; i < 5; i++) { AudioFX.sfx('step_grass', .25); await sleep(1100); } })();
    const off = walk(prince, -150, FL, 6000, 'linear');
    forestNight(false);
    follow(300, 6000);
    await Promise.all([say('왕자는 슬픈 얼굴로 숲을 걷고 또 걸었어요.'), off, stepper2]);
    await sleep(SCENE_END);

    /* ===== 10. 노래를 따라서 (톡 3 — 마지막 인사: 손잡기) ===== */
    await T.sceneCard(tr('노래를 따라서'), () => {
      scene('rp_bg_field_v2');
      put(T, rap, 640, FL, { look: 'short_sing' });
      put(T, prince, -120, FL, { look: 'sad', to: 'right' });
      camSnap(P ? 560 : 500, 280, 1);
    }, rap.pos);
    const come = walk(prince, X(330, 420), FL, WALK, 'linear');
    await say('그때, 바람을 타고 노랫소리가 들려왔어요.');
    await hum(rap.x - 150, FL - 300);
    await come;
    prince.look('stand'); prince.hop(12, 320);
    await say('이 노래는… 라푼젤!');
    const near = walk(prince, X(572, 492), FL, 2200, 'ease-in-out');
    rap.look('short_shock'); await near;
    rap.hop(10, 300);
    await say('왕자님! 찾아와 줬군요.');
    await say('포기하지 않길 잘했어요. 이제 함께 가요.');
    const mx = X(606, 526);
    const midHit = T.el('rect', { x: mx - 60, y: FL - 170, width: 120, height: 120, fill: '#000', 'fill-opacity': 0 }, T.world);
    bob(midHit);
    await T.tap(midHit);
    midHit.remove();
    rap.look('short_hold', 'left'); prince.look('hold', 'right');
    AudioFX.sfx('pop', .4);
    petals(X(480, 400), X(800, 680));
    T.confetti(); (cue('party_horn', .9) || AudioFX.sfx('tada') || sparkleSfx(T));
    rap.hop(14, 400); prince.hop(14, 400);
    const l46 = cutSay('rp_cut_reunion', () => AudioFX.sfx('pop', .4), '두 사람은 손을 꼭 잡고 성으로 떠났어요.');
    await sleep(900); rap.hop(14, 400); prince.hop(14, 400);
    await l46;
    await say('마녀 고텔은 텃밭으로 돌아갔어요.');
    try { AudioFX.stopAmbient(); } catch (e) { /* */ }
    T.finale(); await sleep(1500);
    return '포기하지 않으면 다시 만날 수 있어요.';
  }

  Tale.mount({ title: '라푼젤', subtitle: '포기하지 않으면 다시 만날 수 있어요', read: true, run: T => run(Tale.api) });
})();
