/* 잠자는 숲속의 공주 — 페로 원작 전반부. 기획: tales/sleeping_beauty/PLAN.md, 상세: SPEC.md (2026-10-21)
   톡 3번(1장 요람 · 9장 가시덤불 · 11장 인사), 배움 놀이 3개(2장 많고 적음 · 6장 길고 짧음 · 10장 위·아래·옆), 연타 없음, 줄거리 선택 없음, 입맞춤 없음, 피 없음. 교훈 대사 없음.
   사람·요정은 모두 머리 크기가 같다(HT, 머리 지름 ≈ 80). 아기도 머리는 같고 몸만 작다. 소품은 얼굴 없음.
   짝 맞춤 줄·지팡이 빛·손끝 별빛·해·달은 코드로 그린다. 세기는 해설이 작게 따라 셀 뿐(vo count1~7) 화면 글자 없음.
   시안(목업) 모드: 그림 파일이 아직 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다(beauty_beast.js 와 같은 방식).
   그림: assets/v3w/sb_*.webp (목록 tools/app/gen/jobs_sleeping_beauty.json) */
(() => {
  const AS = '../../assets/v3w/';
  const FC = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  /* 그림 폭/높이 비율 — 그림이 오기 전엔 SPEC §2-1 의 시작값. preload 가 실제 비율로 덮어쓴다(post_tale.py 값은 ASP.txt) */
  const ASP = {
    sb_pr_stand: .45, sb_pr_climb: .60, sb_pr_reach: .72, sb_pr_yawn: .47, sb_pr_lie: 2.1, sb_pr_wake: .62, sb_pr_wave: .50, sb_pr_baby_sleep: .78, sb_pr_baby_giggle: .78,
    sb_king_joy: .72, sb_king_surprise: .60, sb_king_command: .50, sb_king_worry: .46, sb_queen_joy: .45, sb_queen_surprise: .48, sb_queen_worry: .45,
    sb_young_stand: .46, sb_young_peek: .75, sb_young_wand: .60,
    sb_old_stand: .50, sb_old_sulk: .50, sb_old_smile: .52, sb_granny_spin: .78, sb_granny_startle: .80, sb_prince_stand: .47, sb_prince_tiptoe: .55, sb_prince_kneel: .72, sb_prince_wave: .50,
    sb_grandpa_point: .70, sb_maid_stand: .44, sb_maid_sleep: .46, sb_guard_a_stand: .46, sb_guard_a_sleep: .46, sb_guard_b_stand: .46, sb_guard_b_sleep: .46, sb_cook_stand: .58, sb_cook_sleep: .58, sb_kid_stand: .46, sb_kid_sleep: .48,
    sb_dog_sleep: 1.6, sb_dog_wag: 1.35, sb_bird_sleep: 1.2,
    sb_prop_cradle: 1.25, sb_prop_plate: 2.6, sb_prop_door_closed: .52, sb_prop_door_open: .52, sb_prop_curtain: .75, sb_prop_wheel: 1.15, sb_prop_thread_short: .22, sb_prop_thread_mid: .13, sb_prop_thread_long: .09,
    sb_layer_chandelier: .9733, sb_layer_flower_garland: 2.8302, sb_layer_bunting: 4.918, sb_layer_candle_stand: .4117, sb_layer_vase_roses: .8667, sb_layer_rose_bush: 1.8109, sb_layer_mushrooms: .89,
    sb_layer_cobweb: 1.0317, sb_layer_pot_rack: 2.1077, sb_layer_bread_basket: 1.0633, sb_layer_wake_burst: .9967, sb_layer_thorn_vine: .3483, sb_layer_thorn_top: 2.267,
    sb_prop_bed: 1.45, sb_prop_candle_lit: .35, sb_prop_candle_out: .33, sb_prop_bush_closed: 1.75, sb_prop_bush_open: 1.75, sb_prop_tree_small: .9, sb_prop_tree_big: .8, sb_prop_table: 2.1, sb_prop_shelf: 3.0, sb_prop_bell: .8,
  };
  FC.forEach(c => { ASP[`sb_fairy_${c}_stand`] = .46; ASP[`sb_fairy_${c}_wand`] = .60; });
  ['mirror', 'heart', 'bubble', 'shoes', 'note', 'flute'].forEach(g => { ASP[`sb_prop_gift_${g}`] = 1.0; });
  /* 높이(SPEC §2-2): 사람·요정은 머리 지름 ≈ 80. 그림이 오면 같은 부위(얼굴 폭)를 재서 고친다 */
  const HT = {
    sb_pr_stand: 205, sb_pr_climb: 205, sb_pr_reach: 205, sb_pr_yawn: 205, sb_pr_wave: 205, sb_pr_wake: 150, sb_pr_lie: 105, sb_pr_baby_sleep: 120, sb_pr_baby_giggle: 120,
    sb_king_joy: 215, sb_king_surprise: 215, sb_king_command: 215, sb_king_worry: 215, sb_queen_joy: 212, sb_queen_surprise: 212, sb_queen_worry: 212,
    sb_young_stand: 205, sb_young_wand: 215, sb_young_peek: 110, sb_old_stand: 200, sb_old_sulk: 200, sb_old_smile: 205, sb_granny_spin: 165, sb_granny_startle: 175,
    sb_prince_stand: 212, sb_prince_tiptoe: 212, sb_prince_wave: 212, sb_prince_kneel: 165, sb_grandpa_point: 208, sb_maid_stand: 210, sb_maid_sleep: 210,
    sb_guard_a_stand: 215, sb_guard_a_sleep: 215, sb_guard_b_stand: 215, sb_guard_b_sleep: 215, sb_cook_stand: 212, sb_cook_sleep: 212, sb_kid_stand: 195, sb_kid_sleep: 195,
    sb_dog_sleep: 56, sb_dog_wag: 72, sb_bird_sleep: 28,
    sb_prop_cradle: 150, sb_prop_plate: 26, sb_prop_door_closed: 300, sb_prop_door_open: 300, sb_prop_curtain: 330, sb_prop_wheel: 150,
    sb_prop_thread_short: 70, sb_prop_thread_mid: 120, sb_prop_thread_long: 176, sb_prop_bed: 240, sb_prop_candle_lit: 90, sb_prop_candle_out: 90,
    /* 레이어 소품(VISUAL_PLAN §5): 배경을 꾸미는 종이 조각. 누름을 받지 않는다 */
    sb_layer_chandelier: 150, sb_layer_flower_garland: 70, sb_layer_bunting: 70, sb_layer_candle_stand: 260, sb_layer_vase_roses: 120, sb_layer_rose_bush: 130, sb_layer_mushrooms: 60,
    sb_layer_cobweb: 120, sb_layer_pot_rack: 110, sb_layer_bread_basket: 90, sb_layer_wake_burst: 300, sb_layer_thorn_vine: 320, sb_layer_thorn_top: 90,
    sb_prop_bush_closed: 300, sb_prop_bush_open: 300, sb_prop_tree_small: 110, sb_prop_tree_big: 300, sb_prop_table: 110, sb_prop_shelf: 60, sb_prop_bell: 70,
  };
  FC.forEach(c => { HT[`sb_fairy_${c}_stand`] = 205; HT[`sb_fairy_${c}_wand`] = 215; });
  ['mirror', 'heart', 'bubble', 'shoes', 'note', 'flute'].forEach(g => { HT[`sb_prop_gift_${g}`] = 44; });
  /* 그림이 보는 쪽(SPEC §2-3) — 앞모습은 'front'(뒤집지 않음) */
  const NAT = { sb_pr_climb: 'right', sb_pr_reach: 'right', sb_pr_lie: 'left', sb_young_peek: 'left', sb_old_stand: 'left', sb_old_sulk: 'left',
    sb_granny_spin: 'left', sb_granny_startle: 'left', sb_grandpa_point: 'right', sb_prince_tiptoe: 'right', sb_prince_kneel: 'left',
    sb_dog_sleep: 'left', sb_dog_wag: 'left', sb_bird_sleep: 'left', sb_layer_cobweb: 'left' };
  const FL = 528;                       // 바닥(발끝 y)
  let TABLE_Y = 207;                    // 2·3·11장 식탁 윗선. 배경마다 잰 값으로 dress() 가 바꾼다(hall_v2 260, chapel_v2 254 — 접시는 띠 윗선에 얹힌다)
  const BGS = ['sb_bg_room_v2', 'sb_bg_hall_v2', 'sb_bg_stairs', 'sb_bg_tower', 'sb_bg_bedroom_v2', 'sb_bg_outside_v2', 'sb_bg_kitchen_v2', 'sb_bg_chapel_v2', 'sb_bg_outside_v3'];   // outside_v3: 9장 백 년 뒤 크로스페이드(같은 구도)
  const src = k => AS + k + '.webp';    // 배경·스프라이트 모두 파일 이름 전체(sb_…)로 부른다
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const hOf = f => HT[f] || 200;
  const artOK = {}, bgOK = {};
  const CRADLE_BABY = [0, -72], SPINDLE = [-70, -128], REACH_TIP = [74, -118], BED_TOP = -95, WAND_TIP = [58, -222];
  const COLOR = ['#A93B32', '#E8703A', '#D9A94E', '#3F6B4F', '#3E7CB1', '#7A4E86'];

  /* ================= 자리표시(그림이 없을 때) ================= */
  const WHO = { pr: '공주', king: '왕', queen: '왕비', fairy_red: '빨강 요정', fairy_orange: '주황 요정', fairy_yellow: '노랑 요정', fairy_green: '초록 요정', fairy_blue: '파랑 요정', fairy_purple: '보라 요정',
    young: '막내 요정', old: '잊힌 요정', granny: '물레 할머니', prince: '왕자', grandpa: '할아버지', maid: '시녀', guard_a: '경비병', guard_b: '경비병', cook: '요리사', kid: '꼬마' };
  const POSE = { stand: '서기', climb: '오름', reach: '손 뻗음', yawn: '하품', lie: '누움', wake: '깨어남', wave: '인사', baby_sleep: '아기 잠', baby_giggle: '아기 웃음',
    joy: '기쁨', surprise: '놀람', command: '명령', worry: '걱정', wand: '지팡이', peek: '내다봄', sulk: '삐죽', smile: '웃음', spin: '실 잣기', startle: '깜짝', tiptoe: '살금', kneel: '무릎', point: '가리킴', sleep: '잠' };
  const PROPN = { cradle: '요람', plate: '금 접시', door_closed: '문', door_open: '열린 문', curtain: '커튼', wheel: '물레', thread_short: '짧은 실', thread_mid: '중간 실', thread_long: '긴 실',
    bed: '침대', candle_lit: '촛대', candle_out: '꺼진 촛대', bush_closed: '가시덤불', bush_open: '열린 덤불', tree_small: '작은 나무', tree_big: '큰 나무', table: '탁자', shelf: '선반', bell: '종',
    gift_mirror: '거울', gift_heart: '마음', gift_bubble: '말', gift_shoes: '춤', gift_note: '노래', gift_flute: '피리' };
  const BODYC = { pr: '#E7A2B2', king: '#A93B32', queen: '#1F2A56', fairy_red: '#A93B32', fairy_orange: '#E8703A', fairy_yellow: '#D9A94E', fairy_green: '#3F6B4F', fairy_blue: '#3E7CB1', fairy_purple: '#7A4E86',
    young: '#9CC7DD', old: '#A9A39B', granny: '#6B4A32', prince: '#3F6B4F', grandpa: '#6B4A32', maid: '#1F2A56', guard_a: '#A93B32', guard_b: '#A93B32', cook: '#E8703A', kid: '#3F6B4F' };
  const GOWN = new Set(['pr', 'queen', 'old', 'maid', 'young', 'fairy_red', 'fairy_orange', 'fairy_yellow', 'fairy_green', 'fairy_blue', 'fairy_purple']);
  const SKIN = '#F3D9B8', CREAM = '#F6ECD8', GOLD = '#D9A94E', BARK = '#6B4A32', FONT = "'Pretendard Variable', Pretendard, sans-serif";

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
    const id = f.replace(/^sb_/, '');
    const nat = NAT[f] || 'front', dx = nat === 'left' ? -1 : nat === 'right' ? 1 : 0;
    const eyes = (cx, cy, r, sleepy) => [-1, 1].forEach(s => (sleepy
      ? Pth(`M${cx + s * r * .36 - r * .18 + dx * r * .2} ${cy} q${r * .18} ${r * .16} ${r * .36} 0`, 'none', { stroke: '#2E241C', 'stroke-width': 2, 'stroke-linecap': 'round' })
      : C(cx + s * r * .36 + dx * r * .25, cy, Math.max(2.5, r * .1), '#2E241C')));
    if (/^prop_gift_/.test(id)) {
      const k = id.slice(10);
      if (k === 'mirror') { E(w / 2, h * .45, w * .32, h * .4, GOLD); E(w / 2, h * .45, w * .22, h * .3, '#dfe6ee'); }
      else if (k === 'heart') { C(w * .36, h * .38, w * .2, '#E8703A'); C(w * .64, h * .38, w * .2, '#E8703A'); Pth(`M${w * .18} ${h * .48} L${w * .5} ${h * .85} L${w * .82} ${h * .48}Z`, '#E8703A'); }
      else if (k === 'bubble') { R(w * .1, h * .15, w * .8, h * .55, w * .2, CREAM); Pth(`M${w * .3} ${h * .7} L${w * .25} ${h * .92} L${w * .48} ${h * .7}Z`, CREAM); }
      else if (k === 'shoes') { E(w * .3, h * .62, w * .22, h * .2, '#3F6B4F'); E(w * .7, h * .62, w * .22, h * .2, '#3F6B4F'); }
      else if (k === 'note') { C(w * .4, h * .72, w * .17, '#3E7CB1'); R(w * .5, h * .12, w * .07, h * .6, 2, '#3E7CB1'); }
      else R(w * .08, h * .4, w * .84, h * .2, h * .1, '#7A4E86');
      return g;
    }
    if (/^prop_/.test(id)) {
      const k = id.slice(5), nm = PROPN[k] || k;
      switch (k) {
        case 'cradle': R(w * .08, h * .3, w * .84, h * .42, 14, BARK); Pth(`M${w * .05} ${h * .72} Q${w * .5} ${h * 1.05} ${w * .95} ${h * .72}Z`, '#8a5a38'); label(nm, w / 2, h * .55, CREAM, 14); break;
        case 'plate': E(w / 2, h / 2, w * .48, h * .46, GOLD); E(w / 2, h / 2, w * .38, h * .32, '#E9C877'); break;
        case 'door_closed': case 'door_open': Pth(`M${w * .05} ${h} V${h * .3} A${w * .45} ${w * .45} 0 0 1 ${w * .95} ${h * .3} V${h}Z`, BARK);
          if (k === 'door_open') R(w * .3, h * .3, w * .4, h * .7, 0, '#2E241C'); label(nm, w / 2, h * .6, CREAM, 14); break;
        case 'curtain': R(0, 0, w, h, 4, '#A93B32'); R(0, h * .12, w, 10, 0, GOLD); label(nm, w / 2, h * .5, CREAM, 14); break;
        case 'wheel': C(w * .55, h * .62, h * .36, 'none', { stroke: BARK, 'stroke-width': 10 }); [0, 60, 120].forEach(a => R(w * .55 - 2, h * .62 - h * .36, 4, h * .72, 1, BARK, { transform: `rotate(${a} ${w * .55} ${h * .62})` }));
          Pth(`M${w * .22} ${h * .5} L${w * .12} ${h * .1}`, 'none', { stroke: '#A9A39B', 'stroke-width': 7, 'stroke-linecap': 'round' }); label(nm, w * .55, h * .98, BARK, 13); break;
        case 'thread_short': case 'thread_mid': case 'thread_long': R(w / 2 - 7, 0, 14, h - 14, 4, CREAM, { stroke: '#cdbd9b', 'stroke-width': 1 }); C(w / 2, h - 8, 8, CREAM); break;
        case 'bed': R(w * .03, h * .22, w * .94, h * .78, 6, BARK); R(w * .08, h * .45, w * .84, h * .3, 8, CREAM); R(w * .08, h * .62, w * .84, h * .1, 0, '#E7A2B2'); R(0, 0, w, h * .12, 3, GOLD); label(nm, w / 2, h * .9, CREAM, 14); break;
        case 'candle_lit': case 'candle_out': R(w * .3, h * .35, w * .4, h * .65, 3, CREAM);
          if (k === 'candle_lit') Pth(`M${w / 2} ${h * .03} Q${w * .85} ${h * .22} ${w / 2} ${h * .34} Q${w * .15} ${h * .22} ${w / 2} ${h * .03}Z`, '#E8703A'); else R(w * .4, h * .28, w * .2, 3, 1, '#A9A39B'); break;
        case 'bush_closed': case 'bush_open': E(w * .25, h * .62, w * .25, h * .36, '#3F6B4F'); E(w * .5, h * .5, w * .27, h * .46, '#3F6B4F'); E(w * .75, h * .62, w * .25, h * .36, '#3F6B4F');
          [[.2, .6], [.35, .4], [.65, .4], [.8, .6], [.5, .7]].forEach(([a, b]) => C(w * a, h * b, 6, '#A93B32'));
          if (k === 'bush_open') R(w / 2 - 22, h * .25, 44, h * .75, 0, '#1b2a20'); label(nm, w / 2, h * .96, '#2E241C', 14); break;
        case 'tree_small': case 'tree_big': R(w / 2 - 6, h * .45, 12, h * .55, 2, BARK); C(w / 2, h * .3, w * .4, '#3F6B4F');
          if (k === 'tree_big') { C(w * .25, h * .42, w * .26, '#3F6B4F'); C(w * .75, h * .42, w * .26, '#3F6B4F'); } break;
        case 'table': R(w * .02, 0, w * .96, h * .22, 4, '#8a5a38'); R(w * .08, h * .22, 12, h * .78, 2, BARK); R(w * .92 - 12, h * .22, 12, h * .78, 2, BARK); label(nm, w / 2, h * .16, CREAM, 12); break;
        case 'shelf': R(0, h * .3, w, h * .5, 4, BARK); R(w * .15, h * .05, w * .12, h * .25, 2, CREAM); R(w * .3, h * .05, w * .1, h * .25, 2, CREAM); label(nm, w * .6, h * .62, CREAM, 14); break;
        case 'bell': Pth(`M${w * .5 - 8} ${h * .05} h16 L${w * .95} ${h * .85} H${w * .05}Z`, GOLD); C(w / 2, h * .92, 7, BARK); break;
        default: R(0, 0, w, h, Math.min(w, h) * .2, GOLD); label(nm, w / 2, h / 2, '#2E241C', 13);
      }
      return g;
    }
    if (id.startsWith('dog_') || id.startsWith('bird_')) {
      const sl = /sleep/.test(id);
      if (id.startsWith('dog_')) {
        E(w * .55, h * .62, w * .42, h * .36, CREAM); E(w * .22, h * .5, w * .16, h * .3, CREAM); R(w * .08, h * .22, w * .1, h * .3, 4, BARK); R(w * .24, h * .2, w * .1, h * .28, 4, BARK);
        if (sl) Pth(`M${w * .12} ${h * .5} q${w * .05} ${h * .1} ${w * .1} 0`, 'none', { stroke: '#2E241C', 'stroke-width': 2 }); else C(w * .15, h * .5, 3, '#2E241C');
        label(WHO.dog || '강아지', w * .55, h * .66, BARK, 11);
      } else { E(w / 2, h * .55, w * .42, h * .42, GOLD); Pth(`M${w * .1} ${h * .5} L${w * .0} ${h * .6} L${w * .12} ${h * .65}Z`, '#E8703A'); }
      return g;
    }
    const m = /^(pr|king|queen|fairy_(?:red|orange|yellow|green|blue|purple)|young|old|granny|prince|grandpa|maid|guard_[ab]|cook|kid)_(.+)$/.exec(id);
    if (!m) { R(0, 0, w, h, 10, GOLD); label(id, w / 2, h / 2, '#2E241C', 13); return g; }
    const who = m[1], pose = m[2], body = BODYC[who], name = WHO[who] + ' ' + (POSE[pose] || pose), baby = pose.startsWith('baby_'), lying = pose === 'lie', sleepy = /sleep/.test(pose) && !baby || pose === 'baby_sleep';
    const hairC = { pr: GOLD, queen: BARK, king: '#4a3322', old: '#F4F6FA', prince: '#2E241C', grandpa: '#F4F6FA', granny: CREAM, kid: '#4a3322' }[who] || BARK;
    if (lying) {                                           // 누운 공주: 머리 왼쪽, 몸 가로
      const r = h * .38;
      R(r * 1.6, h * .28, w - r * 1.6 - 4, h * .62, 12, '#E7A2B2'); C(r + 4, h * .5, r, SKIN); Pth(`M${4} ${h * .5} q${r} ${-r * 1.4} ${r * 2} 0 q${-r} ${-r * .3} ${-r * 2} 0Z`, GOLD);
      eyes(r + 4, h * .52, r, true); label(name, w * .6, h * .62, CREAM, 14); return g;
    }
    if (baby) {
      const r = h * .33; E(w / 2, h * .72, w * .42, h * .26, '#F4F6FA'); C(w / 2, r + 3, r, SKIN); Pth(`M${w / 2 - r} ${r} q${r} ${-r * 1.3} ${r * 2} 0 q${-r} ${-r * .2} ${-r * 2} 0Z`, GOLD);
      eyes(w / 2, r + 5, r, sleepy); if (pose === 'baby_giggle') E(w / 2, r + r * .55, r * .22, r * .14, '#A93B32'); label(name, w / 2, h * .8, '#6B4A32', 12); return g;
    }
    const half = /^(wake|peek|kneel)$/.test(pose), sit = who === 'granny';
    const r = Math.min(h * .195, w * .3), cx = pose === 'peek' ? w * .3 : w / 2, by = 2 * r - 4, bw = Math.min(w * .84, r * 3.1), bh = h - by;
    if (sit) R(w * .1, h * .8, w * .8, h * .2, 4, BARK);
    const bodyH = sit ? bh * .8 : bh;
    if (GOWN.has(who)) Pth(`M${cx - bw * .3} ${by} L${cx + bw * .3} ${by} L${cx + bw / 2} ${by + bodyH} L${cx - bw / 2} ${by + bodyH}Z`, body); else R(cx - bw / 2, by, bw, bodyH, 12, body, pose === 'tiptoe' ? { transform: `rotate(8 ${cx} ${h})` } : {});
    if (who === 'king') { R(cx - bw * .5, by, bw, bodyH * .9, 8, '#A93B32'); }
    if (who === 'guard_a' || who === 'guard_b') R(cx - bw * .2, by + 8, bw * .4, bodyH * .5, 4, CREAM);
    if (who === 'maid' || who === 'cook' || who === 'kid') R(cx - bw * .3, by + bodyH * .25, bw * .6, bodyH * .5, 6, CREAM);
    C(cx, r, r, SKIN);
    if (who === 'pr' || who === 'queen') { Pth(`M${cx - r} ${r} Q${cx} ${-r * .5} ${cx + r} ${r} Q${cx} ${r * .4} ${cx - r} ${r}Z`, hairC); if (who === 'pr') { R(cx + r * .6, r, r * .4, h * .35, r * .2, GOLD); Pth(`M${cx - r * .4} ${-r * .05} l${r * .4} ${-r * .5} l${r * .4} ${r * .5}Z`, GOLD); } else E(cx, -r * .1, r * .6, r * .5, hairC); }
    else if (who === 'king') { R(cx - r * .8, -r * .1, r * 1.6, r * .35, 3, GOLD); Pth(`M${cx - r * .7} ${r * 1.3} Q${cx} ${r * 2} ${cx + r * .7} ${r * 1.3}Z`, hairC); }
    else if (who.startsWith('fairy') || who === 'young') Pth(`M${cx - r * 1.1} ${r * .3} L${cx} ${-r * .9} L${cx + r * 1.1} ${r * .3}Z`, body);
    else if (who === 'old') Pth(`M${cx - r} ${r} Q${cx} ${-r * .6} ${cx + r} ${r} Q${cx} ${r * .3} ${cx - r} ${r}Z`, hairC);
    else if (who === 'prince') R(cx - r * .7, -r * .15, r * 1.4, r * .3, 3, GOLD);
    else if (who === 'grandpa') { E(cx, r * .1, r * 1.4, r * .25, GOLD); Pth(`M${cx - r * .7} ${r * 1.2} Q${cx} ${r * 2} ${cx + r * .7} ${r * 1.2}Z`, hairC); }
    else if (who === 'granny') Pth(`M${cx - r * 1.1} ${r * 1.1} Q${cx - r * 1.2} ${-r * .3} ${cx} ${-r * .3} Q${cx + r * 1.2} ${-r * .3} ${cx + r * 1.1} ${r * 1.1} Q${cx} ${r * .2} ${cx - r * 1.1} ${r * 1.1}Z`, CREAM);
    else if (who === 'cook') R(cx - r * .6, -r * .9, r * 1.2, r * .9, 6, '#fff');
    else if (who.startsWith('guard')) Pth(`M${cx - r} ${r * .5} Q${cx} ${-r * 1.1} ${cx + r} ${r * .5}Z`, CREAM);
    eyes(cx, r + 2, r, sleepy);
    if (['joy', 'smile', 'wave', 'wake', 'stand'].includes(pose) && who === 'old') Pth(`M${cx - r * .3} ${r * 1.4} q${r * .3} ${pose === 'smile' ? r * .25 : 0} ${r * .6} 0`, 'none', { stroke: '#6B4A32', 'stroke-width': 2 });
    if (pose === 'sulk') Pth(`M${cx - r * .3} ${r * 1.5} q${r * .3} ${-r * .25} ${r * .6} 0`, 'none', { stroke: '#6B4A32', 'stroke-width': 2 });
    if (pose === 'wand' || pose === 'command') R(cx + bw * .45, -h * .02, 6, h * .5, 3, BARK, { transform: `rotate(20 ${cx + bw * .45} ${h * .3})` });
    if (who === 'old') Pth(`M${cx + bw * .5} ${by + bodyH * .2} q${r * .6} ${-r * .3} ${r * .2} ${bodyH * .8}`, 'none', { stroke: BARK, 'stroke-width': 4 });
    if (pose === 'point') R(cx + r * .6, by + 10, w * .38, 10, 5, SKIN);
    label(name, cx, by + bodyH * .55, CREAM, Math.max(10, Math.min(15, bw / 5.2)));
    return g;
  }
  /* 그림 한 장(있으면 그림, 없으면 자리표시): 위 왼쪽 (x,y), 크기 w×h */
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    const g = placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
    return g.parentNode;
  }

  /* 배경 자리표시: 종이 한 장 + 요소 2~3개 + 장면 이름표 */
  const BGPH = {
    sb_bg_room_v2: { sky: CREAM, gnd: GOLD, name: '아기 방', shapes: () => [['path', { d: 'M120 330 V190 A70 70 0 0 1 260 190 V330Z', fill: '#B9D3E4' }], ['rect', { x: 780, y: 20, width: 90, height: 190, fill: '#A93B32' }]] },
    sb_bg_hall_v2: { sky: CREAM, gnd: BARK, name: '잔치 홀', shapes: () => [['rect', { x: -40, y: 207, width: 1080, height: 55, fill: BARK }], ['rect', { x: -40, y: 207, width: 1080, height: 10, fill: GOLD }]] },
    sb_bg_stairs:  { sky: '#B8AFA3', gnd: '#8f877c', name: '탑 계단', shapes: () => [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => ['rect', { x: 200 + i * 80, y: 470 - i * 48, width: 90, height: 24, fill: '#6f675d' }]) },
    sb_bg_tower:   { sky: '#B8AFA3', gnd: GOLD, name: '탑 꼭대기 방', shapes: () => [['path', { d: 'M440 300 V150 A60 60 0 0 1 560 150 V300Z', fill: '#B9D3E4' }]] },
    sb_bg_bedroom_v2: { sky: CREAM, gnd: GOLD, name: '공주 침실', shapes: () => [['path', { d: 'M780 330 V190 A70 70 0 0 1 920 190 V330Z', fill: '#B9D3E4' }]] },
    sb_bg_outside_v2: { sky: '#EEF3F7', gnd: '#9DBB7A', name: '성 밖 (덤불 자리 비움)', shapes: () => [['ellipse', { cx: 250, cy: 430, rx: 340, ry: 130, fill: '#3F6B4F' }], ['ellipse', { cx: 800, cy: 450, rx: 320, ry: 130, fill: '#3F6B4F' }], ['rect', { x: 440, y: 170, width: 120, height: 200, fill: CREAM }], ['rect', { x: 400, y: 120, width: 40, height: 250, fill: CREAM }], ['rect', { x: 560, y: 120, width: 40, height: 250, fill: CREAM }], ['rect', { x: 380, y: 480, width: 240, height: 120, fill: '#D9C79C' }]] },
    sb_bg_kitchen_v2: { sky: CREAM, gnd: '#B8AFA3', name: '부엌', shapes: () => [['path', { d: 'M60 420 V220 A110 110 0 0 1 280 220 V420Z', fill: BARK }], ['ellipse', { cx: 170, cy: 370, rx: 60, ry: 36, fill: '#E8703A' }]] },
    sb_bg_chapel_v2: { sky: CREAM, gnd: '#B8AFA3', name: '예배당', shapes: () => [['path', { d: 'M420 120 V60 A80 80 0 0 1 580 60 V120Z', fill: '#B9D3E4' }], ['rect', { x: 440, y: 20, width: 28, height: 90, fill: '#A93B32' }], ['rect', { x: 468, y: 20, width: 28, height: 90, fill: GOLD }], ['rect', { x: 496, y: 20, width: 28, height: 90, fill: '#3F6B4F' }], ['rect', { x: 524, y: 20, width: 28, height: 90, fill: '#3E7CB1' }], ['rect', { x: -40, y: 207, width: 1080, height: 55, fill: BARK }], ['rect', { x: -40, y: 207, width: 1080, height: 10, fill: GOLD }]] },
  };
  function bgImage(T, key) {
    if (bgOK[key]) return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
    const d = BGPH[key], g = T.el('g', {}, T.bg);
    T.el('rect', { x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, fill: d.sky }, g);
    T.el('rect', { x: BGBOX.x, y: 412, width: BGBOX.w, height: 200, fill: d.gnd }, g);
    d.shapes().forEach(([t, a]) => T.el(t, a, g));
    T.el('text', { x: 500, y: 52, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: '#6B4A32', 'font-family': FONT, opacity: .85, text: '(그림 자리) 배경: ' + d.name }, g);
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
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = ''; a.pos.style.translate = '';
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
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);
  const sfx = (T, name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const sparkleSfx = T => AudioFX.sfx('sparkle', .4) || T.tone([700, 1400], .3, { vol: .15 });

  /* ================= 코드로 그리는 것 (SPEC §5) ================= */
  /* 누르는 자리 넓히기: 배우 맨 앞 자식으로 투명 사각 */
  function hitBox(T, a, w = 100, h = 100) {
    const lw = w / a.scale, lh = h / a.scale;
    const r = T.el('rect', { x: -lw / 2, y: -lh, width: lw, height: lh, fill: '#000', 'fill-opacity': 0 }, a.pos);
    a.pos.insertBefore(r, a.body); a.hit = a.pos; a.hitRect = r; a.pos.style.pointerEvents = 'auto';
    return a;
  }
  /* 줄 전체·화면 전체 누르기 자리 (T.world 맨 앞) */
  const hitRect = (T, x, y, w, h) => T.el('rect', { x, y, width: w, height: h, fill: '#000', 'fill-opacity': 0 }, T.world);
  /* 짝 맞춤 줄: 색지 띠 한 장이 위에서 아래로 자란다 */
  function strip(T, x, y0, y1) {
    const g = T.paper(T.world, [['rect', { x: -5, y: 0, width: 10, height: y1 - y0, rx: 5, fill: '#E8703A' }]], { filter: 'url(#pp)' });
    g.style.pointerEvents = 'none';
    g.animate([{ transform: `translate(${x}px,${y0}px) scaleY(0)` }, { transform: `translate(${x}px,${y0}px) scaleY(1)` }], { duration: 350, easing: 'ease-out', fill: 'forwards' });
    return g;
  }
  /* 반짝: 네 꼭짓점 별이 퍼졌다 사라진다 (지팡이 빛·손끝 별빛) */
  function twinkle(T, x, y, color, n = 5, r = 46) {
    const k = r >= 30 ? 1.7 : 1;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, dx = Math.cos(a) * r, dy = Math.sin(a) * r;
      const p = T.paper(T.world, [['path', { d: 'M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2Z', fill: color }]], {});
      p.style.pointerEvents = 'none';
      p.animate([{ transform: `translate(${x}px,${y}px) scale(${.4 * k})`, opacity: 1 }, { transform: `translate(${x + dx * .6}px,${y + dy * .6}px) scale(${1.2 * k})`, opacity: 1, offset: .4 },
        { transform: `translate(${x + dx}px,${y + dy}px) scale(${.3 * k})`, opacity: 0 }], { duration: 900, delay: i * 40, easing: 'ease-out', fill: 'both' }).finished.then(() => p.remove(), () => p.remove());
    }
  }
  /* 해·달 (9장): 해·달·해·달·해 다섯 번 하늘을 가로지른다. onSun3 는 세 번째(해)에 불린다 */
  async function sunMoon(T, onSun3) {
    for (let k = 0; k < 5; k++) {
      const sun = k % 2 === 0;
      const g = T.paper(T.world, [sun ? ['circle', { r: 34, fill: '#F2B366' }] : ['path', { d: 'M0,-30 A30,30 0 1,1 0,30 A22,22 0 1,0 0,-30Z', fill: CREAM }]], {});
      g.style.pointerEvents = 'none';
      T.world.insertBefore(g, T.world.firstChild);
      let nt = null;
      if (!sun) { nt = tint(T, '#1F2A56', 0); T.anim(nt, [{ opacity: 0 }, { opacity: .25 }], 300); }
      if (k === 2 && onSun3) onSun3();
      await g.animate([{ transform: 'translate(-60px,250px)' }, { transform: 'translate(500px,70px)', offset: .5 }, { transform: 'translate(1060px,250px)' }], { duration: 1500, easing: 'linear' }).finished.catch(() => {});
      g.remove();
      if (nt) { await T.anim(nt, [{ opacity: .25 }, { opacity: 0 }], 300); nt.remove(); }
    }
  }
  /* 같은 장면 안 배경 바꾸기: 크림 종이가 덮였다 걷힌다 */
  async function veil(T, change) {
    const r = T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill: '#F5EFE9', opacity: 0 }, T.fx);
    await T.anim(r, [{ opacity: 0 }, { opacity: 1 }], 350); r.setAttribute('opacity', 1);
    change(); T.fx.appendChild(r);
    await T.anim(r, [{ opacity: 1 }, { opacity: 0 }], 350); r.remove();
  }
  /* 걷기: 이동하는 동안 폴짝폴짝 + 발소리 */
  function walk(T, a, x, y, ms, { h = 4, hd = 420, snd = 'step_wood', vol = .3, ease = 'linear' } = {}) {
    let go = true;
    const p = a.move(x, y, ms, ease).then(() => { go = false; });
    (async () => { while (go) { if (snd) sfx(T, snd, vol); a.hop(h, hd); await T.sleep(hd); } })();
    return p;
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
    const GAP = 700, SCENE_END = 1500,   /* 2026-10-22 대사 뒤·장면 끝 쉼을 줄임(전환이 느리다는 지적) */ WALK = 3000;
    const say = async text => { await T.say(text); await sleep(GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };   // 말풍선 없는 소리(count1~7)
    const scene = key => { setBg(key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990;                 // 세로 화면
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    /* 세로 화면 2·11장 줄: 폰(보이는 폭 약 260)은 .36, 아이패드 세로(약 420)는 .55 (SPEC §12 권장) */
    const S_ROW = T.viewWidth() < 300 ? .36 : .55, SGAP = S_ROW === .36 ? 32 : 50;
    const SLOT = i => 112 + 108 * i, SLOTP = i => 500 - 3.5 * SGAP + SGAP * i;
    const SX = i => X(SLOT(i), SLOTP(i)), RS = X(1, S_ROW);
    AudioFX.preloadSfx(['paper_down', 'paper_up', 'paper_tap', 'swish', 'whoosh', 'rattle', 'knock', 'sparkle', 'tada', 'baby_giggle', 'bell', 'door', 'creak', 'step_wood', 'step_grass', 'blow', 'pop', 'doop', 'hop']);
    const S = {
      L1: "왕과 왕비는 오래오래 아기를 기다렸어요. 드디어 예쁜 공주님이 태어났어요!",
      L2: "온 나라 사람들을 불러 잔치를 열자!",
      L3: "아기는 까르르 웃었어요.",
      L4: "요정 일곱 명을 아기의 대모로 모셨어요. 금 접시도 일곱 개 놓았지요.",
      L5: "그런데 저기, 요정이 한 명 더 왔어요!",
      Q1: "요정과 금 접시, 어느 쪽이 더 많아요? 더 많은 쪽을 톡 눌러요.",
      W1: "접시 하나에 요정 한 명… 어, 요정이 남았어요. 요정이 더 많아요. 다시 골라 봐요.",
      C1: "맞아요. 요정이 더 많아요. 요정 한 명은 접시가 없네요.",
      Q2: "그럼 더 적은 쪽은 어느 쪽일까요? 더 적은 쪽을 톡 눌러요.",
      W2: "요정은 더 많은 쪽이에요. 더 적은 쪽을 찾아봐요.",
      C2: "맞아요. 접시가 더 적어요. 일곱 개뿐이에요.",
      L6: "접시가 없는 요정은 누구일까요?",
      L7: "탑에 너무 오래 살아서 모두가 잊어버린 요정이었어요.",
      L8: "내 접시는 없구나… 나만 빼놓다니.",
      L9: "어이쿠, 깜빡했어요. 미안해요.",
      L10: "나는 맨 나중에 말할래.",
      L11: "예쁜 얼굴을 줄게.",
      L12: "상냥한 마음을 줄게.",
      L13: "고운 말씨를 줄게.",
      L14: "사뿐사뿐 춤을 줄게.",
      L15: "꾀꼬리 같은 노래를 줄게.",
      L16: "피리 솜씨를 줄게.",
      L17: "아기는 쌔근쌔근 웃었어요.",
      L18: "열여섯 살이 되면 물레 바늘에 찔려 영영 깨어나지 않는 깊은 잠에 빠질 거야.",
      L19: "영영이 아니에요. 백 년이 지나면 깨어날 거예요. 그리고 왕자님이 올 거예요.",
      L20: "온 나라의 물레를 모두 치워라!",
      L21: "물레는 모두 사라졌어요.",
      L22: "공주님이 열여섯 살이 되던 날, 왕과 왕비는 멀리 나들이를 갔어요.",
      L23: "공주님은 성 구석구석을 돌아다니다 탑 꼭대기까지 올라갔어요.",
      L24: "할머니, 뭐 하세요?",
      L25: "실을 잣고 있단다. 물레를 치우라는 말은 못 들었거든.",
      Q3: "할머니가 실을 잣고 있어요. 제일 긴 실은 어느 것일까요? 톡 눌러요.",
      W3a: "그 실은 제일 짧아요. 제일 긴 실을 찾아봐요.",
      W3b: "그 실보다 더 긴 실이 있어요. 다시 찾아봐요.",
      C3: "맞아요. 이 실이 제일 길어요.",
      Q4: "그럼 제일 짧은 실은 어느 것일까요? 톡 눌러요.",
      W4a: "그 실은 제일 길어요. 제일 짧은 실을 찾아봐요.",
      W4b: "그 실보다 더 짧은 실이 있어요. 다시 찾아봐요.",
      C4: "맞아요. 이 실이 제일 짧아요.",
      L26: "저도 해 볼래요!",
      L27: "아야… 졸려요…",
      L28: "어머나, 큰일 났네! 누구 없어요?",
      L29: "우리 아가, 막내 요정 말대로 백 년을 자는구나.",
      L30: "공주님이 혼자 깨면 외로울 거야. 모두 함께 자요.",
      L31: "촛불도 잠들고, 성 둘레에는 가시덤불이 높이높이 자랐어요.",
      L32: "백 년이 흘렀어요. 낮과 밤이 몇 번이나 지났을까요.",
      L33: "저 안에 공주님이 백 년째 자고 있대요.",
      L34: "제가 가 볼게요.",
      L35: "가시덤불이 왕자님에게만 길을 열어 주었어요.",
      L36: "쉿, 다들 자고 있어요.",
      L37: "왕자님은 발소리를 죽이고 걸었어요.",
      Q5: "모두 쿨쿨 자요. 탁자 아래에서 자는 강아지를 찾아봐요.",
      W5: "거긴 아니에요. 탁자 아래를 봐요.",
      C5: "맞아요. 강아지가 탁자 아래에서 자요.",
      Q6: "선반 위에서 자는 새를 찾아봐요.",
      W6: "거긴 아니에요. 선반 위를 봐요.",
      C6: "맞아요. 새가 선반 위에서 자요.",
      Q7: "요리사 옆에서 자는 꼬마를 찾아봐요.",
      W7: "거긴 아니에요. 요리사 옆을 봐요.",
      C7: "맞아요. 꼬마 요리사가 요리사 옆에서 자요.",
      L38: "바로 그때, 백 년이 꽉 찼어요. 공주님이 스스로 눈을 떴어요.",
      L39: "왕자님이세요? 오래 기다렸어요.",
      L40: "안녕하세요, 공주님.",
      L41: "성 안의 모두가 기지개를 켰어요.",
      L42: "그날 저녁 예배당에서 결혼식을 올렸지요. 이번에는 요정 여덟 명을 모두 불렀어요. 접시도 여덟 개!",
      L43: "나도 불러 줘서 고마워.",
      L44: "모두 손을 흔들며 인사했어요. 안녕!",
    };
    const loads = [];
    BGS.forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(4000)]);

    /* ---- 배우 (자세 이름: [그림, 높이]) ---- */
    const h = f => [f, HT[f]];
    const pr     = mk(T, { stand: h('sb_pr_stand'), climb: h('sb_pr_climb'), reach: h('sb_pr_reach'), yawn: h('sb_pr_yawn'), lie: h('sb_pr_lie'), wake: h('sb_pr_wake'), wave: h('sb_pr_wave') });
    const baby   = mk(T, { sleep: h('sb_pr_baby_sleep'), giggle: h('sb_pr_baby_giggle') });
    const king   = mk(T, { joy: h('sb_king_joy'), surprise: h('sb_king_surprise'), command: h('sb_king_command'), worry: h('sb_king_worry') });
    const queen  = mk(T, { joy: h('sb_queen_joy'), surprise: h('sb_queen_surprise'), worry: h('sb_queen_worry') });
    const fairies = FC.map(c => mk(T, { stand: h(`sb_fairy_${c}_stand`), wand: h(`sb_fairy_${c}_wand`) }));
    const young  = mk(T, { stand: h('sb_young_stand'), peek: h('sb_young_peek'), wand: h('sb_young_wand') });
    const old    = mk(T, { stand: h('sb_old_stand'), sulk: h('sb_old_sulk'), smile: h('sb_old_smile') });
    const granny = mk(T, { spin: h('sb_granny_spin'), startle: h('sb_granny_startle') });
    const prince = mk(T, { stand: h('sb_prince_stand'), tiptoe: h('sb_prince_tiptoe'), kneel: h('sb_prince_kneel'), wave: h('sb_prince_wave') });
    const grandpa = mk(T, { point: h('sb_grandpa_point') });
    const maid   = mk(T, { stand: h('sb_maid_stand'), sleep: h('sb_maid_sleep') });
    const guardA = mk(T, { stand: h('sb_guard_a_stand'), sleep: h('sb_guard_a_sleep') });
    const guardB = mk(T, { stand: h('sb_guard_b_stand'), sleep: h('sb_guard_b_sleep') });
    const cook   = mk(T, { stand: h('sb_cook_stand'), sleep: h('sb_cook_sleep') });
    const kid    = mk(T, { stand: h('sb_kid_stand'), sleep: h('sb_kid_sleep') });
    const dog    = mk(T, { sleep: h('sb_dog_sleep'), wag: h('sb_dog_wag') });
    const bird   = prop(T, 'sb_bird_sleep', HT.sb_bird_sleep);
    const cradle = prop(T, 'sb_prop_cradle', HT.sb_prop_cradle);
    const plates = Array.from({ length: 8 }, () => prop(T, 'sb_prop_plate', HT.sb_prop_plate));
    const door   = mk(T, { closed: h('sb_prop_door_closed'), open: h('sb_prop_door_open') });
    const curtain = prop(T, 'sb_prop_curtain', HT.sb_prop_curtain);
    const gifts  = ['mirror', 'heart', 'bubble', 'shoes', 'note', 'flute'].map(g => prop(T, `sb_prop_gift_${g}`, HT[`sb_prop_gift_${g}`]));
    const wheel  = prop(T, 'sb_prop_wheel', HT.sb_prop_wheel);
    const threads = { short: prop(T, 'sb_prop_thread_short', HT.sb_prop_thread_short), mid: prop(T, 'sb_prop_thread_mid', HT.sb_prop_thread_mid), long: prop(T, 'sb_prop_thread_long', HT.sb_prop_thread_long) };
    const bed    = prop(T, 'sb_prop_bed', HT.sb_prop_bed);
    const candle = mk(T, { lit: h('sb_prop_candle_lit'), out: h('sb_prop_candle_out') });
    const bush   = mk(T, { closed: h('sb_prop_bush_closed'), open: h('sb_prop_bush_open') });
    const tree   = mk(T, { small: h('sb_prop_tree_small'), big: h('sb_prop_tree_big') });
    const table  = prop(T, 'sb_prop_table', HT.sb_prop_table), shelf = prop(T, 'sb_prop_shelf', HT.sb_prop_shelf), bell = prop(T, 'sb_prop_bell', HT.sb_prop_bell);
    const ALL = [pr, baby, king, queen, ...fairies, young, old, granny, prince, grandpa, maid, guardA, guardB, cook, kid, dog, bird, cradle, ...plates, door, curtain, ...gifts, wheel, ...Object.values(threads), bed, candle, bush, tree, table, shelf, bell];
    /* 레이어 소품(VISUAL_PLAN §4): 중간 층은 world 맨 뒤(배우보다 먼저), 앞 가림 층은 fx(배우 위). 모두 누름 없음 */
    const L = Object.fromEntries(['chandelier', 'chandelier2', 'bunting', 'bunting2', 'candle_stand', 'candle_stand2', 'vase_roses', 'rose_bush', 'rose_bush2', 'mushrooms', 'cobweb', 'cobweb2', 'pot_rack', 'bread_basket', 'wake_burst', 'thorn_vine', 'thorn_top', 'thorn_top2']
      .map(k => [k, prop(T, 'sb_layer_' + k.replace(/2$/, ''), HT['sb_layer_' + k.replace(/2$/, '')])]));
    ALL.push(...Object.values(L));
    ALL.forEach(hide);
    const mid = (a, x, y, o) => { put(T, a, x, y, o); T.world.insertBefore(a.pos, T.world.firstChild); return a; };
    const front = (a, x, y, o) => { put(T, a, x, y, o); T.fx.appendChild(a.pos); return a; };
    const flicker = a => { a.body.animate([{ opacity: 1 }, { opacity: .85 }, { opacity: 1 }], { duration: 1600, iterations: Infinity }); return a; };
    const sway = a => { a.body.animate([{ rotate: '-1.5deg' }, { rotate: '1.5deg' }, { rotate: '-1.5deg' }], { duration: 4000, iterations: Infinity, easing: 'ease-in-out' }); return a; };
    function dress(key) {
      if (key === 'sb_bg_room_v2') mid(L.vase_roses, X(880, 880), FL);
      if (key === 'sb_bg_hall_v2') TABLE_Y = 258;
      if (key === 'sb_bg_chapel_v2') TABLE_Y = 252;
      if (key === 'sb_bg_hall_v2') { flicker(mid(L.chandelier, X(300, 380), 150)); flicker(mid(L.chandelier2, X(700, 620), 150)); }
      if (key === 'sb_bg_outside_v2') { mid(L.rose_bush, X(120, 330), FL - 10); front(L.thorn_vine, X(40, 300), 585); }
      if (key === 'sb_bg_kitchen_v2') {
        mid(L.pot_rack, X(500, 250), 120);
        front(L.bread_basket, X(985, 985), 585); front(L.cobweb, 30, 110); front(L.cobweb2, 970, 110, { to: 'right' });
      }
      if (key === 'sb_bg_chapel_v2') {
        flicker(mid(L.chandelier, X(250, 330), 150)); flicker(mid(L.chandelier2, X(750, 670), 150));
        flicker(mid(L.candle_stand, X(60, 330), FL)); flicker(mid(L.candle_stand2, X(940, 670), FL));
      }
    }
    const setBg = key => { T.clear(); bgImage(T, key); dress(key); };
    T.director({ cast: { king, queen, princess: pr, fred: fairies[0], forange: fairies[1], fyellow: fairies[2], fgreen: fairies[3], fblue: fairies[4], fpurple: fairies[5], young, old, granny, prince, grandpa },
                 noFace: ['king', 'queen', 'princess', 'fred', 'forange', 'fyellow', 'fgreen', 'fblue', 'fpurple', 'young', 'old', 'granny', 'prince', 'grandpa'] });
    const PEEK_DX = -(curtain.w / 2 + 25);
    const hasFace = a => a;   // (자리 맞추기용 훅 — 지금은 쓰지 않음)

    /* ===== 읽어 주기 (docs/READ_MODE.md §10) — 놀이판 장면·배우 함수를 동사 이름으로 감싼 것. 놀이판 흐름은 아래에서 그대로 ===== */
    const READ_ACTS = (() => {
      const inst = () => T.readInstant();
      const BGMAP = { sb_bg_room: 'sb_bg_room_v2', sb_bg_hall: 'sb_bg_hall_v2', sb_bg_stairs: 'sb_bg_stairs', sb_bg_tower: 'sb_bg_tower', sb_bg_bedroom: 'sb_bg_bedroom_v2', sb_bg_outside: 'sb_bg_outside_v2', sb_bg_kitchen: 'sb_bg_kitchen_v2', sb_bg_chapel: 'sb_bg_chapel_v2' };
      const PCAM = [500, 500, 620, 470, 540, 300, 520, 470, 600, 540, 540];   // 세로 화면: 장면마다 놀이판의 카메라 x
      /* 세로 화면: 대본의 가로 x → 놀이판이 세로에서 쓰는 x */
      const PM = { 'king:360': 395, 'queen:640': 605, 'queen:300': 430, 'king:420': 510, 'young:580': 590, 'old:870': 760, 'king:720': 660, 'queen:820': 740, 'king:640': 650, 'queen:730': 720,
        'old:380': 420, 'pr:140': 140, 'pr:380': 400, 'young:300': 470, 'prince:-200': 200, 'prince:-80': 300, 'prince:660': 610, 'queen:700': 640, 'king:800': 720 };
      const PW = { 'prince:340': 480, 'prince:150': 395 };
      const who = { pr, baby, king, queen, young, old, granny, prince, grandpa };
      const px = (n, x) => (P && PM[n + ':' + x] != null ? PM[n + ':' + x] : x);
      const BGM = { cur: '', hall: 0, sleepers: 0, cam: 0 };
      const rDoorX = X(970, SX(7) + 160 * RS - 60);
      const POPC = { 딸랑: '#D9A94E', 덜컹: '#6B4A32', 쉿: '#1F2A56', 스르륵: '#3F6B4F', 하암: '#8A7A60' };
      let strips = [], gp = null, curF = null, night = null;
      const placeSet = (a, x, y, pose, to, s) => put(T, a, x, FL, { look: pose || undefined, to: to || undefined, s: s || 1 });
      const lieOnBed = () => { if (bed.pos.isConnected) put(T, pr, bed.x - 8, bed.y + BED_TOP, { look: 'lie', to: 'left' }); };
      const sleepRow = [[dog, X(590, 560), 'wag'], [maid, X(720, 640), 'stand'], [guardA, X(790, 720), 'stand'], [cook, X(860, 800), 'stand'], [kid, X(920, 870), 'stand'], [guardB, X(980, 940), 'stand']];
      const leaveF = (f, i) => { f.look('stand'); f.move(X(50 + 70 * i, -200), FL, 900, 'ease-out'); };
      const setCam = () => { const k = BGM.cam++; return inst() ? camSnap(P ? PCAM[Math.min(k, PCAM.length - 1)] : 500, 280, 1) : null; };
      /* 사람·동물 공통 동사: at / look / hop / wiggle */
      const actor = (name, hopArgs = [8, 300], extra = {}) => (verb, ...args) => {
        const a = who[name];
        if (verb === 'at') {
          const [xs, ys] = String(args[0]).split(','); const [pose, dir] = [args[1], args[2]];
          if (name === 'young' && pose === 'peek') {
            put(T, curtain, X(900, 790), FL); put(T, a, curtain.x + PEEK_DX, FL, { look: 'peek', to: dir || 'left' }); return;
          }
          return put(T, a, px(name, +xs), FL, { look: pose, to: dir, s: 1 });
        }
        if (verb === 'look') {
          const [pose, dir] = args;
          if (name === 'pr' && pose === 'lie') return lieOnBed();
          if (name === 'young' && pose === 'peek') { a.look('peek', dir || 'left'); if (curtain.pos.isConnected) a.place(curtain.x + PEEK_DX, FL); return; }
          return a.look(pose, dir);
        }
        if (verb === 'hop') { if (name === 'baby') { a.hop(3, 500); return T.sleep(550).then(() => a.hop(3, 500)); } return a.hop(...hopArgs); }
        if (verb === 'wiggle') return a.wiggle(2, 700);
        const f = extra[verb]; return f ? f(...args) : console.warn('[read] 모르는 ' + name + ' 동사', verb);
      };
      const R = {
        set(key) {
          const bg = BGMAP[key] || key; BGM.cur = bg; strips = []; night = null;
          setBg(bg); camSnap(500, 280, 1);
          if (bg === 'sb_bg_hall_v2' && ++BGM.hall === 2) { put(T, curtain, X(760, 700), FL); put(T, door, X(985, 870), FL, { look: 'closed' }); }
        },
        cam(a) {
          if (!inst()) { const [x, y, z] = String(a).split(',').map(Number); return T.camTo(x, y, z || 1, 700); }
          return setCam();
        },
        async veil(key) {
          const bg = BGMAP[key] || key;
          const change = () => { BGM.cur = bg; setBg(bg); camSnap(P && bg === 'sb_bg_outside_v2' ? 600 : P && bg === 'sb_bg_tower' ? 520 : 500, 280, 1); };
          if (inst()) return change();
          await veil(T, change);
        },
        baby: actor('baby'), king: actor('king'), queen: actor('queen', [6, 300]), young: actor('young', [6, 300], {
          hide: async () => {
            if (!curtain.pos.isConnected) put(T, curtain, X(760, 700), FL);
            await young.move(curtain.x + 10, FL, 900, 'ease-in');
          },
          step_out: async () => {
            young.look('stand'); young.place(curtain.x + PEEK_DX, FL);
            await walk(T, young, X(620, 600), FL, 1200, { snd: null, ease: 'ease-out' });
            young.look('wand');
          },
          sleep_all: async () => {
            for (const [a] of sleepRow) {
              follow(a.x - 30, 600);
              await walk(T, young, a.x - 70, FL, 600, { h: 4, hd: 420, snd: null });
              twinkle(T, young.x + WAND_TIP[0], FL + WAND_TIP[1], '#9CC7DD', 4, 30); sfx(T, 'doop', .35, () => T.tone([520, 380], .12, { vol: .12 }));
              a.look('sleep'); T.pop(a.x, FL - a.h - 80, tr('쿨쿨'), '#1F2A56'); T.tone([320, 220], .3, { type: 'sine', vol: .08 });
              await sleep(700);
            }
          },
        }),
        old: actor('old', [6, 400], {
          enter: async () => {
            door.look('open'); L.chandelier2.wiggle(2, 600);
            put(T, old, X(1080, rDoorX + 20), FL, { look: 'stand', to: 'left', s: RS });
            await walk(T, old, SX(7), FL, WALK, { h: 3 * RS, hd: 560 });
            door.look('closed');
          },
        }),
        granny: actor('granny', [6, 300]), pr: actor('pr', [8, 300], {
          climb_stairs: async () => {
            for (const [sx, sy] of [[320, 452], [500, 376], [680, 300], [860, 224]]) { follow(sx, 900); await walk(T, pr, sx, sy, 900, { h: 6, hd: 300 }); }
          },
          prick: async () => {
            pr.look('reach', 'right');
            await pr.move(wheel.x + SPINDLE[0] - REACH_TIP[0], FL, 700, 'ease-out');
            await sleep(250);
            twinkle(T, pr.x + REACH_TIP[0], FL + REACH_TIP[1], CREAM, 4, 26); sfx(T, 'sparkle', .3);
            await sleep(300);
          },
          wake: () => { pr.look('wake'); pr.place(bed.x - 20, bed.y + BED_TOP + 8); pr.hop(5, 400); },
        }),
        prince: actor('prince', [8, 300], {
          walk: spec => {
            const [xs, ms] = String(spec).split(',');
            const grass = BGM.cur.startsWith('sb_bg_outside');
            const p = walk(T, prince, PW['prince:' + xs] != null && P ? PW['prince:' + xs] : +xs, FL, +ms, { h: 4, hd: 420, snd: grass ? 'step_grass' : 'step_wood', vol: grass ? .3 : .2 });
            return Promise.all([p, gp]).then(() => { gp = null; });
          },
          through: async () => {
            prince.look('tiptoe', 'right'); T.world.insertBefore(prince.pos, bush.pos);
            await walk(T, prince, 700, FL, 2200, { h: 4, hd: 420, snd: 'step_grass' });
            await fadeOut(T, prince, 500);
          },
        }),
        grandpa(verb) {
          if (verb !== 'enter') return;
          put(T, grandpa, X(-100, 280), FL, { look: 'point', to: 'right' });
          gp = walk(T, grandpa, X(220, 390), FL, WALK, { h: 3, hd: 560, snd: 'step_grass' });
          return T.sleep(300);
        },
        cradle(verb) {
          if (verb === 'set') { put(T, cradle, 500, FL + 4); put(T, baby, cradle.x + CRADLE_BABY[0], cradle.y + CRADLE_BABY[1], { look: 'sleep' }); }
          else if (verb === 'rock') { cradle.wiggle(5, 700); return cradle.wiggle(5, 700); }
        },
        plates(n) {
          n = +n;
          for (let i = 0; i < n; i++) put(T, plates[i], SLOT(i), TABLE_Y + 2);
        },
        fairies() {   /* 요정 여섯 + 막내 한 줄, 접시 일곱을 줄에 맞추고 문 */
          for (let i = 0; i < 7; i++) put(T, plates[i], SX(i), TABLE_Y + 2, { s: RS });
          for (let i = 0; i < 6; i++) put(T, fairies[i], SX(i), FL, { look: 'stand', s: RS });
          put(T, young, SX(6), FL, { look: 'stand', s: RS });
          put(T, door, rDoorX, FL, { look: 'closed', s: RS });
        },
        async fairy(verb, i) {
          if (verb !== 'gift') return;
          i = +i;
          if (curF) { leaveF(curF.f, curF.i); curF = null; }
          const f = fairies[i]; curF = { f, i };
          put(T, f, X(-80, 250), FL, { look: 'stand' });
          await walk(T, f, X(400, 410), FL, 1500, { snd: 'step_wood', vol: .25 });
          f.look('wand');
          twinkle(T, f.x + WAND_TIP[0], FL + WAND_TIP[1], COLOR[i]); sparkleSfx(T);
          put(T, gifts[i], 500, FL - 205); fadeIn(gifts[i], 300);
          gifts[i].move(500, FL - 295, 1600, 'ease-out');
          setTimeout(() => fadeOut(T, gifts[i], 400), 1500);
          await sleep(500);
        },
        match(verb) {
          if (verb === 'strips') return (async () => {
            for (let i = 0; i < 7; i++) { strips.push(strip(T, SX(i), TABLE_Y + 2 + 10 * RS, FL - 205 * RS - 6)); sfx(T, 'paper_tap', .3); await sleep(450); }
          })();
          if (verb === 'clear') { const ss = strips; strips = []; ss.forEach(s => s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' })); return sleep(300).then(() => ss.forEach(s => s.remove())); }
        },
        wheel(verb) {
          if (verb === 'set') put(T, wheel, X(150, 330), FL);
          else if (verb === 'exit') {
            wheel.wiggle(3, 500); setTimeout(() => sfx(T, 'rattle', .4), 900);
            return wheel.move(X(-250, 100), FL, 1800, 'ease-in').then(() => hide(wheel));
          }
        },
        tower() {
          setBg('sb_bg_tower'); camSnap(P ? 520 : 500, 280, 1);
          put(T, granny, X(640, 640), FL, { look: 'spin', to: 'left' });
          put(T, wheel, X(540, 540), FL);
          put(T, pr, X(380, 400), FL, { look: 'stand' });
        },
        threads() {
          const order = ['short', 'mid', 'long'].sort(() => Math.random() - .5), TX = [wheel.x - 52, wheel.x, wheel.x + 52];
          order.forEach((k, i) => put(T, threads[k], TX[i], FL - 150 + HT['sb_prop_thread_' + k]));
        },
        parents() {
          put(T, king, X(-80, 300), FL, { look: 'worry' }); put(T, queen, X(-160, 240), FL, { look: 'worry' });
          return Promise.all([walk(T, king, X(240, 420), FL, 1400, { h: 6, hd: 320, vol: .35 }), walk(T, queen, X(140, 330), FL, 1400, { h: 6, hd: 320, snd: null })]);
        },
        candle(k) {
          if (k === 'lit') put(T, candle, X(240, 380), FL, { look: 'lit' });
          else { candle.look('out'); night = tint(T, '#1F2A56', 0); T.anim(night, [{ opacity: 0 }, { opacity: .22 }], 1200); }
        },
        bed() { put(T, bed, 500, FL + 6); },
        sleepers(verb) {
          if (verb === 'set') {
            if (++BGM.sleepers === 1) sleepRow.forEach(([a, x, lk]) => put(T, a, x, FL, { look: lk }));
            else { put(T, maid, X(120, 330), FL, { look: 'sleep' }); put(T, cook, X(860, 720), FL, { look: 'sleep' }); put(T, kid, X(940, 800), FL, { look: 'sleep' }); front(L.cobweb, 30, 110); front(L.cobweb2, 970, 110, { to: 'right' }); }
          } else if (verb === 'wake') [maid, cook, kid].forEach((a, i) => setTimeout(() => { a.look('stand'); a.hop(10, 360); }, i * 200));
        },
        tree(k) {
          if (k === 'small') put(T, tree, X(880, 860), FL, { look: 'small' });
          else if (tree.cur !== 'big') { tree.look('big'); tree.hop(6, 400); sfx(T, 'pop', .3); }
        },
        bush(verb) {
          if (verb === 'set') { put(T, bush, X(700, 700), FL, { look: 'closed' }); if (!inst()) bush.body.style.transform = 'scale(.12)'; }
          else if (verb === 'grow') {
            const g = bush.body.animate([{ transform: 'scale(.12)' }, { transform: 'scale(1)' }], { duration: 2400, easing: 'ease-out', fill: 'forwards' });
            L.thorn_vine.body.style.transformBox = 'fill-box'; L.thorn_vine.body.style.transformOrigin = '50% 100%';
            L.thorn_vine.body.animate([{ transform: 'scale(.3)' }, { transform: 'scale(1)' }], { duration: 2400, easing: 'ease-out' });
            return g.finished.catch(() => {}).then(() => { g.cancel(); bush.body.style.transform = ''; });
          } else if (verb === 'open') {
            bush.look('open'); if (!P) [L.thorn_top, L.thorn_top2].forEach(a => a.wiggle(3, 700)); return bush.wiggle(2, 500);
          }
        },
        sunmoon() {
          return sunMoon(T, () => {
            tree.look('big'); tree.hop(6, 400); sfx(T, 'pop', .3);
            const v3 = bgImage(T, 'sb_bg_outside_v3'); v3.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2400, fill: 'backwards' });
            const come = [mid(L.rose_bush2, X(1000, 790), FL - 10), front(L.mushrooms, X(60, 330), 585)];
            if (!P) come.push(front(L.thorn_top, 120, 90), front(L.thorn_top2, 880, 90, { to: 'right' }));
            come.forEach(a => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2400 }));
          });
        },
        kitchen() {
          put(T, shelf, X(760, 470), 150); put(T, bird, shelf.x + 45, shelf.y - 52, { to: 'left' });
          put(T, table, X(300, 430), FL); put(T, dog, table.x, FL, { look: 'sleep', to: 'left' });
          put(T, cook, X(560, 525), FL, { look: 'sleep' }); put(T, kid, X(640, 585), FL, { look: 'sleep' }); put(T, guardB, X(880, 665), FL, { look: 'sleep' });
          L.pot_rack.wiggle(2, 800);
        },
        glow(k) {
          if (k === 'plates') return (async () => { for (let i = 0; i < 8; i++) { glow(plates[i], 400); await sleep(100); } })();
          const a = { old, dog, bird, kid }[k]; if (!a) return;
          glow(a, 1200);
          if (k !== 'old') { sparkleSfx(T); T.pop(a.x, k === 'bird' ? a.y - 80 : FL - (k === 'kid' ? 240 : 150), tr('반짝!')); }
        },
        chapel() {
          for (let i = 0; i < 8; i++) put(T, plates[i], SX(i), TABLE_Y + 2, { s: RS });
          for (let i = 0; i < 6; i++) put(T, fairies[i], SX(i), FL - 70, { look: 'stand', s: RS });
          put(T, young, SX(6), FL - 70, { look: 'stand', s: RS });
          put(T, old, SX(7), FL - 70, { look: 'smile', to: 'left', s: RS });
          put(T, bell, 500, 118);
          put(T, king, X(150, 300), FL, { look: 'joy' }); put(T, queen, X(940, 700), FL, { look: 'joy' });
          put(T, pr, X(460, 462), FL, { look: 'wave' }); put(T, prince, X(540, 538), FL, { look: 'wave' });
        },
        bell() {
          sfx(T, 'bell', .5, () => T.tone([1320, 1760], .25, { type: 'sine', vol: .12 }));
          bell.wiggle(12, 900); setTimeout(() => bell.wiggle(12, 900), 950);
        },
        twinkle(spec) { const [x, y, c] = String(spec).split(','); twinkle(T, +x, +y, c, 6, 60); },
        sparkle() { sparkleSfx(T); },
        confetti() { T.confetti(); },
        fx(n) {
          if (n === 'sparkle') return sparkleSfx(T);
          if (n === 'bell') return sfx(T, 'bell', .5, () => T.tone([1320, 1760], .25, { type: 'sine', vol: .12 }));
          if (n === 'tada') return sfx(T, 'tada', .5, () => sparkleSfx(T));
          if (n === 'giggle') return sfx(T, 'baby_giggle', .6, () => AudioFX.sfx('baby_giggle', .6));
          if (n === 'boing' || n === 'hop') return sfx(T, 'hop', .5);
          return sfx(T, n, .4);
        },
        pop(spec) {
          const [x, y, ...w] = String(spec).split(','); const t = w.join(',');
          let xx = +x; if (P && xx === 150) xx = +y === 310 ? 330 : 395;
          T.pop(xx, +y, tr(t), POPC[t]);
        },
      };
      return R;
    })();
    if (T.reading()) return T.readPlay(READ_ACTS);

    /* ===== 1. 기다리던 아기 (톡 1: 요람) ===== */
    scene('sb_bg_room_v2');
    put(T, king, X(360, 395), FL, { look: 'joy' });
    put(T, queen, X(640, 605), FL, { look: 'joy' });
    put(T, cradle, 500, FL + 4);
    put(T, baby, cradle.x + CRADLE_BABY[0], cradle.y + CRADLE_BABY[1], { look: 'sleep' });
    const cradleHit = hitRect(T, 500 - 115, FL + 4 - 180, 230, 180);
    if (P) camSnap(500, 280, 1);
    await T.curtain(true);
    await say(S.L1);
    await sleep(300);
    const l2 = say(S.L2); king.hop(8, 300);
    [[L.bunting, X(250, 420)], [L.bunting2, X(750, 600)]].forEach(([g, x]) => { front(g, x, 70); sway(g); g.pos.animate([{ opacity: 0, translate: '0 -40px' }, { opacity: 1, translate: '0 0' }], 600); });
    await l2;
    bob(cradle.pos);
    await T.tap(cradleHit);
    cradleHit.remove();
    sfx(T, 'creak', .3);
    await cradle.wiggle(5, 700); cradle.wiggle(5, 700);
    await sleep(400);
    baby.look('giggle'); sfx(T, 'baby_giggle', .6, () => AudioFX.sfx('baby_giggle', .6)); sfx(T, 'bell', .35, () => T.tone([1320, 1760], .25, { type: 'sine', vol: .12 }));
    T.pop(500, FL - 232, tr('까르르')); T.pop(560, FL - 262, tr('딸랑'), '#D9A94E');
    await say(S.L3);
    await sleep(SCENE_END);

    /* ===== 2. 접시 일곱, 요정 여덟 (배움 놀이 1: 많고 적음) ===== */
    const doorX = X(970, SX(7) + 160 * RS - 60);
    await T.sceneCard(tr('접시 일곱, 요정 여덟'), () => {
      scene('sb_bg_hall_v2');
      for (let i = 0; i < 7; i++) put(T, plates[i], SX(i), TABLE_Y + 2, { s: RS });
      for (let i = 0; i < 6; i++) put(T, fairies[i], SX(i), FL, { look: 'stand', s: RS });
      put(T, young, SX(6), FL, { look: 'stand', s: RS });
      put(T, door, doorX, FL, { look: 'closed', s: RS });
      if (P) camSnap(500, 280, 1);
    }, young.pos);
    await say(S.L4);
    door.look('open'); sfx(T, 'door', .5); L.chandelier2.wiggle(2, 600);
    put(T, old, X(1080, doorX + 20), FL, { look: 'stand', to: 'left', s: RS });
    const entering = walk(T, old, SX(7), FL, WALK, { h: 3 * RS, hd: 560 });
    await Promise.all([entering, say(S.L5)]);
    door.look('closed');
    const lx = SX(0) - 55 * RS, rw = SX(7) - SX(0) + 110 * RS;
    const rowPlates = P ? hitRect(T, lx, TABLE_Y - 54, rw, 98) : hitRect(T, lx, TABLE_Y - 40, rw, 70);   // 세로: 짧은 변 80px 이상
    const rowFairies = hitRect(T, lx, FL - 215 * RS, rw, 215 * RS + 10);
    let strips = [], striped = false;
    const matchUp = async () => {
      if (striped) { await sleep(600); return; }
      for (let i = 0; i < 7; i++) {
        strips.push(strip(T, SX(i), TABLE_Y + 2 + 10 * RS, FL - 205 * RS - 6));
        sfx(T, 'paper_tap', .3); vo('count' + (i + 1));
        await sleep(700);
      }
      striped = true;
      glow(old, 1400); old.hop(8, 400);
    };
    const clearStrips = async () => {
      const ss = strips; strips = []; striped = false;
      ss.forEach(s => s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }));
      await sleep(300); ss.forEach(s => s.remove());
    };
    await T.ask(S.Q1, () => T.choose([{ el: rowFairies, ok: true }, { el: rowPlates, ok: false, onWrong: async () => { await matchUp(); await say(S.W1); await clearStrips(); } }], { prompt: S.Q1 }));
    await matchUp();
    await sleep(700);
    await say(S.C1);
    await T.ask(S.Q2, () => T.choose([{ el: rowPlates, ok: true }, { el: rowFairies, ok: false, onWrong: async () => { await matchUp(); await say(S.W2); } }], { prompt: S.Q2 }));
    for (let i = 0; i < 7; i++) { glow(plates[i], 500); await sleep(120); }
    sparkleSfx(T);
    await say(S.C2);
    await clearStrips();
    rowPlates.remove(); rowFairies.remove();
    const l6 = say(S.L6);
    glow(old, 2000);
    [...plates.slice(0, 7), ...fairies, young, L.chandelier, L.chandelier2].forEach(a => { a.pos.style.transition = 'opacity .4s'; a.pos.style.opacity = .45; });
    await l6;
    [...plates.slice(0, 7), ...fairies, young, L.chandelier, L.chandelier2].forEach(a => { a.pos.style.transition = ''; a.pos.style.opacity = ''; });
    await sleep(SCENE_END);

    /* ===== 3. 잊힌 요정 ===== */
    await T.sceneCard(tr('잊힌 요정'), () => {
      scene('sb_bg_hall_v2');
      for (let i = 0; i < 7; i++) put(T, plates[i], SLOT(i), TABLE_Y + 2);
      put(T, queen, X(300, 430), FL, { look: 'surprise', to: 'right' });
      put(T, king, X(420, 510), FL, { look: 'surprise', to: 'right' });
      put(T, young, X(580, 590), FL, { look: 'stand' });
      put(T, curtain, X(760, 700), FL);
      put(T, old, X(870, 760), FL, { look: 'sulk', to: 'left' });
      put(T, door, X(985, 870), FL, { look: 'closed' });
      camSnap(X(500, 620), 280, 1);
    }, old.pos);
    await say(S.L7);
    const w8 = old.wiggle(2, 700);
    await say(S.L8); await w8;
    king.hop(6, 300);
    await say(S.L9);
    const hide3 = young.move(curtain.x + 10, FL, 900, 'ease-in');
    await Promise.all([say(S.L10), hide3]);
    young.look('peek', 'left'); young.place(curtain.x + PEEK_DX, FL);
    await sleep(SCENE_END);

    /* ===== 4. 여섯 가지 선물 ===== */
    await T.sceneCard(tr('여섯 가지 선물'), () => {
      scene('sb_bg_room_v2');
      put(T, cradle, 500, FL + 4);
      put(T, baby, cradle.x + CRADLE_BABY[0], cradle.y + CRADLE_BABY[1], { look: 'sleep' });
      put(T, king, X(720, 660), FL, { look: 'joy' });
      put(T, queen, X(820, 740), FL, { look: 'joy' });
      camSnap(X(500, 470), 280, 1);
    }, cradle.pos);
    const GIFT_X = X(400, 410), L4 = [S.L11, S.L12, S.L13, S.L14, S.L15, S.L16];
    for (let i = 0; i < 6; i++) {
      const f = fairies[i];
      put(T, f, X(-80, 250), FL, { look: 'stand' });
      await walk(T, f, GIFT_X, FL, 1800, { snd: 'step_wood', vol: .25 });
      f.look('wand');
      twinkle(T, f.x + WAND_TIP[0], FL + WAND_TIP[1], COLOR[i]); sparkleSfx(T);
      put(T, gifts[i], 500, FL - 205); fadeIn(gifts[i], 300);
      const up = gifts[i].move(500, FL - 295, 1600, 'ease-out');
      await Promise.all([say(L4[i]), up]);
      fadeOut(T, gifts[i], 400);
      await sleep(500);
      f.look('stand');
      await f.move(X(50 + 70 * i, -200), FL, 900, 'ease-out');
    }
    for (let i = 0; i < 6; i++) {      // 여섯 색 별 아치(요람 위, 천천히 깜빡)
      const t = i / 5, x = 380 + 240 * t, y = 230 - 40 * Math.sin(Math.PI * t), r = 11;
      const st = T.el('path', { d: `M0 ${-r} L${r * .3} ${-r * .3} L${r} 0 L${r * .3} ${r * .3} L0 ${r} L${-r * .3} ${r * .3} L${-r} 0 L${-r * .3} ${-r * .3} Z`, fill: COLOR[i], transform: `translate(${x},${y})`, filter: 'url(#pp)' }, T.fx);
      st.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: i * 120, fill: 'backwards' }).finished.then(() => st.animate([{ opacity: 1 }, { opacity: .45 }, { opacity: 1 }], { duration: 1800, iterations: Infinity }), () => {});
    }
    const l17 = say(S.L17); baby.hop(3, 500); await sleep(550); baby.hop(3, 500); await l17;
    await sleep(SCENE_END);

    /* ===== 5. 백 년 잠 ===== */
    await T.sceneCard(tr('백 년 잠'), () => {
      scene('sb_bg_room_v2');
      put(T, wheel, X(150, 330), FL);
      put(T, cradle, 500, FL + 4);
      put(T, baby, cradle.x + CRADLE_BABY[0], cradle.y + CRADLE_BABY[1], { look: 'sleep' });
      put(T, king, X(640, 650), FL, { look: 'worry' });
      put(T, queen, X(730, 720), FL, { look: 'worry' });
      put(T, curtain, X(900, 790), FL);
      put(T, young, curtain.x + PEEK_DX, FL, { look: 'peek', to: 'left' });
      put(T, old, X(380, 420), FL, { look: 'sulk', to: 'right' });
      camSnap(X(500, 540), 280, 1);
    }, old.pos);
    const w18 = old.wiggle(2, 800);
    await say(S.L18); await w18;
    young.look('stand'); young.place(curtain.x + PEEK_DX, FL);
    await walk(T, young, X(620, 600), FL, 1200, { snd: null, ease: 'ease-out' });
    young.look('wand');
    twinkle(T, young.x + WAND_TIP[0], FL + WAND_TIP[1], '#9CC7DD'); sparkleSfx(T);
    await say(S.L19);
    young.look('stand');
    king.look('command'); king.hop(8, 300);
    await say(S.L20);
    wheel.wiggle(3, 500); sfx(T, 'rattle', .4); T.pop(wheel.x, FL - 195, tr('덜컹'), '#6B4A32');
    const exit5 = wheel.move(X(-250, 100), FL, 1800, 'ease-in');
    setTimeout(() => sfx(T, 'rattle', .4), 900);
    await exit5; hide(wheel);
    await say(S.L21);
    king.look('worry');
    await sleep(SCENE_END);

    /* ===== 6. 탑 꼭대기 물레 (배움 놀이 2: 길고 짧음) ===== */
    await T.sceneCard(tr('탑 꼭대기 물레'), () => {
      scene('sb_bg_stairs');
      put(T, pr, X(140, 140), FL, { look: 'climb', to: 'right' });
      camSnap(X(500, 300), 280, 1);
    }, pr.pos);
    await say(S.L22);
    const STEPS = [[320, 452], [500, 376], [680, 300], [860, 224]];
    const l23 = say(S.L23);
    for (const [sx, sy] of STEPS) {
      follow(sx, 900);
      const mv = walk(T, pr, sx, sy, 900, { h: 6, hd: 300 });
      await mv;
    }
    await l23; await sleep(400);
    const TY = FL - 150;
    const order = ['short', 'mid', 'long'].sort(() => Math.random() - .5);
    const towerSet = () => {
      setBg('sb_bg_tower'); camSnap(X(500, 520), 280, 1);
      put(T, granny, X(640, 640), FL, { look: 'spin', to: 'left' });
      put(T, wheel, X(540, 540), FL);
      const TX = [wheel.x - 52, wheel.x, wheel.x + 52];
      order.forEach((k, i) => put(T, threads[k], TX[i], TY + HT['sb_prop_thread_' + k]));
      put(T, pr, X(380, 400), FL, { look: 'stand' });
    };
    await veil(T, towerSet);
    order.forEach(k => { hitBox(T, threads[k], 60, HT['sb_prop_thread_' + k] + 24); padHit(T, threads[k].pos, 80); });
    await say(S.L24);
    granny.wiggle(2, 600);
    await say(S.L25);
    const showPair = async (k, target) => {
      const a = threads[k].pos, b = threads[target].pos, ax = threads[k].x, bx = threads[target].x;
      sfx(T, 'swish', .3);
      await Promise.all([T.anim(a, [{ translate: '0 0' }, { translate: `${wheel.x - 20 - ax}px 0` }], 600), T.anim(b, [{ translate: '0 0' }, { translate: `${wheel.x + 20 - bx}px 0` }], 600)]);
      await sleep(250);
      await Promise.all([T.anim(a, [{ translate: `${wheel.x - 20 - ax}px 0` }, { translate: '0 0' }], 600), T.anim(b, [{ translate: `${wheel.x + 20 - bx}px 0` }, { translate: '0 0' }], 600)]);
      a.style.translate = ''; b.style.translate = '';
    };
    await T.ask(S.Q3, () => T.choose(order.map(k => ({ el: threads[k].hit, ok: k === 'long', onWrong: async () => { await wiggleEl(T, threads[k].pos); await showPair(k, 'long'); await say(k === 'short' ? S.W3a : S.W3b); } })), { prompt: S.Q3 }));
    glow(threads.long, 1200);
    threads.long.body.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.08)' }, { transform: 'scaleY(1)' }], 700);
    sparkleSfx(T); T.pop(wheel.x, TY - 125, tr('반짝!'));
    await sleep(700);
    await say(S.C3);
    await T.ask(S.Q4, () => T.choose(order.map(k => ({ el: threads[k].hit, ok: k === 'short', onWrong: async () => { await wiggleEl(T, threads[k].pos); await showPair(k, 'short'); await say(k === 'long' ? S.W4a : S.W4b); } })), { prompt: S.Q4 }));
    glow(threads.short, 1200); sparkleSfx(T); T.pop(wheel.x, TY - 125, tr('반짝!'));
    await say(S.C4);
    await sleep(SCENE_END);

    /* ===== 7. 콕, 스르르 ===== */
    await T.sceneCard(tr('콕, 스르르'), () => {
      towerSet();
      order.forEach(k => { const t = threads[k]; if (t.hitRect) { t.hitRect.remove(); t.hitRect = null; t.hit = null; t.pos.style.pointerEvents = 'none'; } });
      camSnap(X(500, 520), 280, 1);
    }, pr.pos);
    const l26 = say(S.L26); pr.hop(8, 300); await l26;
    pr.look('reach', 'right');
    await pr.move(wheel.x + SPINDLE[0] - REACH_TIP[0], FL, 700, 'ease-out');
    await sleep(250);
    twinkle(T, pr.x + REACH_TIP[0], FL + REACH_TIP[1], CREAM, 4, 26); sfx(T, 'sparkle', .3);
    T.pop(pr.x, FL - 285, tr('콕!'));
    await sleep(500);
    pr.look('yawn'); T.pop(pr.x + 70, FL - 285, tr('하암'), '#8A7A60');
    await say(S.L27);
    granny.look('startle'); granny.hop(6, 300);
    await say(S.L28);
    put(T, king, X(-80, 300), FL, { look: 'worry' });
    put(T, queen, X(-160, 240), FL, { look: 'worry' });
    await Promise.all([walk(T, king, X(240, 420), FL, 1400, { h: 6, hd: 320, vol: .35 }), walk(T, queen, X(140, 330), FL, 1400, { h: 6, hd: 320, snd: null })]);
    await sleep(300);
    await veil(T, () => {
      setBg('sb_bg_bedroom_v2'); camSnap(500, 280, 1);
      put(T, candle, X(240, 380), FL, { look: 'lit' });
      put(T, bed, 500, FL + 6);
      put(T, pr, bed.x - 8, bed.y + BED_TOP, { look: 'lie', to: 'left' });
      put(T, queen, X(700, 640), FL, { look: 'worry' });
      put(T, king, X(800, 720), FL, { look: 'worry' });
    });
    const wq = queen.wiggle(2, 700);
    await say(S.L29); await wq;
    await sleep(SCENE_END);

    /* ===== 8. 모두 잠들어요 ===== */
    const sleepers = [[dog, X(590, 560), 'wag'], [maid, X(720, 640), 'stand'], [guardA, X(790, 720), 'stand'], [cook, X(860, 800), 'stand'], [kid, X(920, 870), 'stand'], [guardB, X(980, 940), 'stand']];
    await T.sceneCard(tr('모두 잠들어요'), () => {
      scene('sb_bg_bedroom_v2');
      put(T, candle, X(240, 380), FL, { look: 'lit' });
      put(T, bed, 500, FL + 6);
      put(T, pr, bed.x - 8, bed.y + BED_TOP, { look: 'lie', to: 'left' });
      sleepers.forEach(([a, x, lk]) => put(T, a, x, FL, { look: lk }));
      put(T, young, X(300, 470), FL, { look: 'wand' });
      camSnap(X(500, 470), 280, 1);
    }, young.pos);
    const l30 = say(S.L30); young.hop(6, 300); await l30;
    for (const [a] of sleepers) {
      follow(a.x - 30, 700);
      await walk(T, young, a.x - 70, FL, 700, { h: 4, hd: 420, snd: null });
      twinkle(T, young.x + WAND_TIP[0], FL + WAND_TIP[1], '#9CC7DD', 4, 30); sfx(T, 'doop', .35, () => T.tone([520, 380], .12, { vol: .12 }));
      a.look('sleep');
      T.pop(a.x, FL - a.h - 80, tr('쿨쿨'), '#1F2A56'); T.tone([320, 220], .3, { type: 'sine', vol: .08 });
      await sleep(1000);
    }
    const l31 = say(S.L31);
    candle.look('out'); sfx(T, 'blow', .4);
    const night8 = tint(T, '#1F2A56', 0); T.anim(night8, [{ opacity: 0 }, { opacity: .22 }], 1200);
    await sleep(1800);
    await veil(T, () => {
      setBg('sb_bg_outside_v2'); camSnap(X(500, 600), 280, 1);
      put(T, tree, X(880, 860), FL, { look: 'small' });
      put(T, bush, X(700, 700), FL, { look: 'closed' });
    });
    const grow = bush.body.animate([{ transform: 'scale(.12)' }, { transform: 'scale(1)' }], { duration: 2400, easing: 'ease-out', fill: 'forwards' });
    L.thorn_vine.body.style.transformBox = 'fill-box'; L.thorn_vine.body.style.transformOrigin = '50% 100%';
    L.thorn_vine.body.animate([{ transform: 'scale(.3)' }, { transform: 'scale(1)' }], { duration: 2400, easing: 'ease-out' });
    sfx(T, 'whoosh', .35); T.pop(700, FL - 345, tr('스르륵'), '#3F6B4F');
    await grow.finished.catch(() => {}); grow.cancel(); bush.body.style.transform = '';
    await l31;
    await sleep(SCENE_END);

    /* ===== 9. 백 년 뒤 (톡 2: 가시덤불) ===== */
    await T.sceneCard(tr('백 년 뒤'), () => {
      scene('sb_bg_outside_v2');
      put(T, tree, X(880, 860), FL, { look: 'small' });
      put(T, bush, 700, FL, { look: 'closed' });
      camSnap(X(500, 600), 280, 1);
    }, bush.pos);
    const bushHit = hitRect(T, 700 - 270, FL - 320, 540, 320);
    const l32 = say(S.L32);
    const sm = sunMoon(T, () => {
      tree.look('big'); tree.hop(6, 400); sfx(T, 'pop', .3);
      const v3 = bgImage(T, 'sb_bg_outside_v3'); v3.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2400, fill: 'backwards' });   // 백 년 뒤: 같은 구도의 무성한 숲으로
      const come = [mid(L.rose_bush2, X(1000, 790), FL - 10), front(L.mushrooms, X(60, 330), 585)];
      if (!P) come.push(front(L.thorn_top, 120, 90), front(L.thorn_top2, 880, 90, { to: 'right' }));
      come.forEach(a => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 2400 }));
    });
    await Promise.all([l32, sm]);
    put(T, grandpa, X(-100, 280), FL, { look: 'point', to: 'right' });
    const gp = walk(T, grandpa, X(220, 390), FL, WALK, { h: 3, hd: 560, snd: 'step_grass' });
    await sleep(300);
    put(T, prince, X(-200, 200), FL, { look: 'tiptoe', to: 'right' });
    const pw = walk(T, prince, X(340, 480), FL, WALK, { h: 4, hd: 420, snd: 'step_grass' }).then(() => prince.look('stand'));
    await Promise.all([gp, pw]);
    grandpa.hop(4, 400);
    await say(S.L33);
    prince.hop(8, 300);
    bob(bush.pos);
    await say(S.L34);
    await T.tap(bushHit);
    bushHit.remove();
    await bush.wiggle(2, 500);
    bush.look('open'); sfx(T, 'swish', .45); T.pop(700, FL - 345, tr('스르륵'), '#3F6B4F');
    if (!P) [L.thorn_top, L.thorn_top2].forEach(a => a.wiggle(3, 700));
    const l35 = say(S.L35);
    prince.look('tiptoe', 'right');
    T.world.insertBefore(prince.pos, bush.pos);
    await walk(T, prince, 700, FL, 2200, { h: 4, hd: 420, snd: 'step_grass' });
    await fadeOut(T, prince, 500);
    await l35;
    await sleep(SCENE_END);

    /* ===== 10. 잠든 궁전 (배움 놀이 3: 위·아래·옆) ===== */
    await T.sceneCard(tr('잠든 궁전'), () => {
      scene('sb_bg_kitchen_v2');
      put(T, shelf, X(760, 470), 150);
      put(T, bird, shelf.x + 45, shelf.y - 52, { to: 'left' });
      put(T, table, X(300, 430), FL);
      put(T, dog, table.x, FL, { look: 'sleep', to: 'left' });
      put(T, cook, X(560, 525), FL, { look: 'sleep' });
      put(T, kid, X(640, 585), FL, { look: 'sleep' });
      put(T, guardB, X(880, 665), FL, { look: 'sleep' });
      put(T, prince, X(-80, 300), FL, { look: 'tiptoe', to: 'right' });
      camSnap(X(500, 540), 280, 1);
    }, cook.pos);
    hitBox(T, bird, 90, 90); hitBox(T, dog, 120, 100); hitBox(T, kid, 110, 210); hitBox(T, guardB, 120, 230);
    L.pot_rack.wiggle(2, 800);
    await walk(T, prince, X(150, 395), FL, 2000, { h: 4, hd: 420, snd: 'step_wood', vol: .2 });
    const l36 = say(S.L36); T.pop(prince.x, FL - 295, tr('쉿'), '#1F2A56'); await l36;
    await say(S.L37);
    const OPT = { dog, bird, kid, guard: guardB };
    const ask = async (Q, W, right, onRight, C) => {
      await T.ask(Q, () => T.choose(Object.keys(OPT).map(k => ({ el: OPT[k].hit, ok: k === right, onWrong: async () => { await wiggleEl(T, OPT[k].pos); await say(W); } })), { prompt: Q }));
      onRight(); sparkleSfx(T);
      await sleep(700);
      await say(C);
    };
    await ask(S.Q5, S.W5, 'dog', () => { glow(dog, 1200); T.pop(dog.x, FL - 150, tr('반짝!')); }, S.C5);
    await ask(S.Q6, S.W6, 'bird', () => { glow(bird, 1200); T.pop(bird.x, bird.y - 80, tr('반짝!')); }, S.C6);
    await ask(S.Q7, S.W7, 'kid', () => { glow(kid, 1200); T.pop(kid.x, FL - 240, tr('반짝!')); }, S.C7);
    await sleep(SCENE_END);

    /* ===== 11. 깨어나요 (톡 3: 인사) ===== */
    await T.sceneCard(tr('깨어나요'), () => {
      scene('sb_bg_bedroom_v2');
      put(T, candle, X(240, 380), FL, { look: 'lit' });
      put(T, bed, 500, FL + 6);
      put(T, pr, bed.x - 8, bed.y + BED_TOP, { look: 'lie', to: 'left' });
      put(T, prince, X(660, 610), FL, { look: 'kneel', to: 'left' });
      put(T, maid, X(120, 330), FL, { look: 'sleep' });
      put(T, cook, X(860, 720), FL, { look: 'sleep' });
      put(T, kid, X(940, 800), FL, { look: 'sleep' });
      front(L.cobweb, 30, 110); front(L.cobweb2, 970, 110, { to: 'right' });   // 백 년의 잠(깨어날 때 걷힌다)
      camSnap(X(500, 540), 280, 1);
    }, pr.pos);
    const l38 = say(S.L38);
    await sleep(1200);
    twinkle(T, bed.x, bed.y + BED_TOP - 60, '#F2B366', 6, 60); sparkleSfx(T);
    { const b = front(L.wake_burst, bed.x, bed.y + BED_TOP - 60 + HT.sb_layer_wake_burst / 2); b.body.style.transformBox = 'fill-box'; b.body.style.transformOrigin = '50% 50%';
      b.body.animate([{ transform: 'scale(.2)', opacity: 1 }, { transform: 'scale(1.4)', opacity: 1, offset: .7 }, { transform: 'scale(1.4)', opacity: 0 }], { duration: 700, easing: 'ease-out' }).finished.then(() => hide(b), () => hide(b));
      [L.cobweb, L.cobweb2].forEach(c => fadeOut(T, c, 900)); }
    pr.look('wake'); pr.place(bed.x - 20, bed.y + BED_TOP + 8); pr.hop(5, 400);
    await l38;
    await say(S.L39);
    prince.look('stand'); prince.hop(6, 300);
    await say(S.L40);
    const l41 = say(S.L41);
    [maid, cook, kid].forEach((a, i) => setTimeout(() => { a.look('stand'); a.hop(10, 360); sfx(T, 'hop', .5); }, i * 200));
    await l41;
    await sleep(300);
    await veil(T, () => {
      setBg('sb_bg_chapel_v2'); camSnap(500, 280, 1);
      for (let i = 0; i < 8; i++) put(T, plates[i], SX(i), TABLE_Y + 2, { s: RS });
      for (let i = 0; i < 6; i++) put(T, fairies[i], SX(i), FL - 70, { look: 'stand', s: RS });
      put(T, young, SX(6), FL - 70, { look: 'stand', s: RS });
      put(T, old, SX(7), FL - 70, { look: 'smile', to: 'left', s: RS });
      put(T, bell, 500, 118);
      put(T, king, X(150, 300), FL, { look: 'joy' });
      put(T, queen, X(940, 700), FL, { look: 'joy' });
      put(T, pr, X(460, 462), FL, { look: 'wave' });
      put(T, prince, X(540, 538), FL, { look: 'wave' });
    });
    const l42 = say(S.L42);
    sfx(T, 'bell', .5, () => T.tone([1320, 1760], .25, { type: 'sine', vol: .12 }));
    bell.wiggle(12, 900); setTimeout(() => bell.wiggle(12, 900), 950); T.pop(500, 60, tr('딸랑'), '#D9A94E');
    setTimeout(async () => { for (let i = 0; i < 8; i++) { glow(plates[i], 400); await sleep(100); } }, 4200);
    await l42;
    await sleep(1500);
    old.hop(6, 400);
    await say(S.L43);
    const allHit = hitRect(T, 0, 80, 1000, 480);
    bob(pr.pos);
    await T.tap(allHit);
    allHit.remove();
    pr.look('wave'); prince.look('wave');
    [...fairies, young, old, king, queen, pr, prince].forEach((a, i) => setTimeout(() => a.hop(10, 400), i * 120));
    T.confetti(); sfx(T, 'tada', .5, () => sparkleSfx(T));
    await say(S.L44);
    T.finale(); await sleep(2500);
    return '아무도 빼놓지 않아요. 잊힌 사람의 마음은 아프답니다.';
  }
  Tale.mount({ title: '잠자는 숲속의 공주', subtitle: '아무도 빼놓지 않아요', read: true, run: async T => { try { return await run(Tale.api); } catch (e) { console.error('RUNERR ' + (e && e.stack || e)); throw e; } } });
})();
