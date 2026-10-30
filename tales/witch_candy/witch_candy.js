/* 사탕 마녀의 핼러윈 — 창작 동화(핼러윈). 기획: tales/witch_candy/PLAN.md (2026-10-28). 그림 접두어 wc_ (assets/v3w/wc_*.webp 예정)
   시안(목업) 모드: 그림 파일이 없으면 같은 크기·자리에 종이 자리표시(색 도형 + 한글 이름표)를 그린다. 파일이 생기면 코드를 고치지 않아도 그림으로 바뀐다
   (ASP 는 preload 가 실제 비율로 덮어쓴다; HT 는 그림 도착 뒤 같은 부위 폭(머리카락 폭)으로 다시 잰다 — CLAUDE.md §4-1).
   조작: 2장 장작 톡(재미) · 4장 자유 넣기 fill(배움, 세기) · 5장 색 고르기 choose(배움) · 6²끝 '한 번 더?' 시간 제한 톡 · 7장 재료 톡 1(친구들이 나머지 자동) · 9장 마녀 인사 톡.
   장 구성: 1~3 · [4·5·6 회전 블록 ×2, ?rounds=3 또는 '한 번 더?' 톡이면 ×3] · 7 · 8 · 9.
   주소 인자(검증용): ?rounds=3 · ?mix=ry,b (회전별 고정 조합; r y b g 글자) — 자동 재생·검증 모드에서도 같이 쓴다.
   세로 화면: 보이는 폭이 좁아 월드를 ps 배로 줄이고(setView) 누르는 상자는 H() 로 화면 크기를 지킨다. */
(() => {
  const AS = '../../assets/v3w/';
  const src = k => AS + k + '.webp';
  const FL = 490;                                  // 바닥(발끝 y)
  const CREAM = '#F6ECD8', INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";
  const artOK = {}, bgOK = {};
  let curBg = '';                                   // 지금 깔린 배경(같은 배경이면 넘김 없이 이어 간다 — run 의 cont)
  const QS = (() => { try { return new URLSearchParams(location.search); } catch (e) { return new URLSearchParams(''); } })();

  /* ---------- 그림 목록: 비율(ASP) · 높이(HT, px, scale 1) · 보는 쪽(NAT) ----------
     ASP: tales/witch_candy/ASP.txt(post_tale.py) 값. preload 가 실제 비율로 다시 덮는다.
     HT: 같은 부위 폭을 재서 맞춘 값(CLAUDE.md §4-1, 2026-10-29 그림 도착 뒤). 인물 그림은 모두 높이 600 으로 오려져 있어 '폭'은 그 600 높이 그림의 px.
       다현이(기준 230): 머리카락 덩어리(갈색 조각) 가로 폭. 서기 310 → 화면 머리 폭 230×310/600 ≈ 119px 를 모든 자세에서 같게, HT = 230×310/폭.
         walk 318 · yuck 322 · reach 331 · point 311 · yum 310 · ghost 297(올린 팔이 머리 끝을 가려 좁게 잡힘 → 두 눈 사이 86 대 서기 87 로 다시 재 232)
         · tf_strawberry 306 · tf_strawberry_ball 412 · tf_duck 325 · tf_fish 349 · tf_frog_jump 322 · tf_frog_sit 331 · tf_pumpkin 307 · tf_bat_up/down 368 · tf_choco 312 · tf_choco_flat 469
       마녀(기준 368 = 다현이 ×1.6): 민트 뽀글 머리 가로 폭. 서기 320 · present 323 · stir 331 · giggle 332 · ghost 316. surprise 는 두 팔에 밀린 머리가 넓게 잡혀(356) 치마 폭(서기 370 : 371)으로 다시 재 365
       호박이(기준 앉기 150): 두 눈 가운데 사이. 앉기 111 · nose 119 · reach 118 · waddle 97 · ghost 95 (두 발로 서면 앉기보다 키가 크다)
       토끼(기준 240, 귀 포함 다현이와 같은 키): 얼굴 폭 stand 250 · reach 250 · happy 245 · ghost 250
       곰(기준 230): 얼굴 폭(귀 빼고) stand 265 · reach 266 · happy 280 · ghost 265
       여우(기준 230): 얼굴 폭(볼털 포함) stand 305 · reach 303 · happy 331 · ghost 300 */
  const POSES = {
    kid: ['stand', 'walk', 'yuck', 'reach', 'point', 'yum', 'ghost', 'tf_strawberry', 'tf_strawberry_ball', 'tf_duck', 'tf_fish', 'tf_frog_jump', 'tf_frog_sit', 'tf_pumpkin', 'tf_bat_up', 'tf_bat_down', 'tf_choco', 'tf_choco_flat', 'tf_kiwi', 'tf_croc'],
    witch: ['stand', 'present', 'stir', 'magic', 'surprise', 'giggle', 'ghost'],
    cat: ['sit', 'nose', 'reach', 'waddle', 'ghost'],
    rabbit: ['stand', 'reach', 'happy', 'ghost'], bear: ['stand', 'reach', 'happy', 'ghost'], fox: ['stand', 'reach', 'happy', 'ghost'],
  };
  const HT = {
    wc_kid_stand: 230, wc_kid_walk: 224, wc_kid_yuck: 226, wc_kid_reach: 215, wc_kid_point: 229, wc_kid_yum: 230, wc_kid_ghost: 232,
    wc_kid_tf_strawberry: 233, wc_kid_tf_strawberry_ball: 173, wc_kid_tf_duck: 219, wc_kid_tf_fish: 204, wc_kid_tf_frog_jump: 209, wc_kid_tf_frog_sit: 219, wc_kid_tf_kiwi: 217, wc_kid_tf_croc: 221,
    wc_kid_tf_pumpkin: 232, wc_kid_tf_bat_up: 194, wc_kid_tf_bat_down: 194, wc_kid_tf_choco: 229, wc_kid_tf_choco_flat: 152,
    wc_witch_stand: 368, wc_witch_present: 365, wc_witch_stir: 356, wc_witch_surprise: 365, wc_witch_giggle: 355, wc_witch_ghost: 373,
    wc_witch_magic: 356,   // 마법으로 젓기(2026-10-29 새 그림): 민트 머리 폭 345/600 → stand(334/600, 368)과 같은 머리 폭
    wc_ghost: 160,         // 진짜 유령(8장 행진 맨 뒤에 몰래) — 몸통 폭이 유령 흉내 다현이(머리 폭 119)의 1.3배쯤
    wc_cat_sit: 150, wc_cat_nose: 140, wc_cat_reach: 141, wc_cat_waddle: 172, wc_cat_ghost: 175,
    wc_rabbit_stand: 240, wc_rabbit_reach: 240, wc_rabbit_happy: 245, wc_rabbit_ghost: 240,
    wc_bear_stand: 230, wc_bear_reach: 229, wc_bear_happy: 218, wc_bear_ghost: 230,
    wc_fox_stand: 230, wc_fox_reach: 232, wc_fox_happy: 212, wc_fox_ghost: 234,
    /* 소품(PLAN §3-1 비율, 다현이 머리 폭 ≈ 119px): 솥 그림 높이 200(솥 입 지름 ≈ 136), 장작 폭 = 솥 입 지름 */
    wc_prop_cauldron: 200, wc_prop_firewood: 70, wc_prop_flame_small: 46, wc_prop_flame_big: 86, wc_prop_ladle: 120, wc_prop_invite: 58, wc_prop_candy_jar: 110, wc_prop_plate_white: 80,
    wc_prop_table: 150, wc_prop_smoke_puff: 200, wc_prop_sparkle_pop: 170, wc_prop_pumpkin_lantern: 62, wc_prop_bat_sil: 26, wc_prop_bunting: 70, wc_prop_web: 90,
    wc_prop_fx_bubble: 26, wc_prop_fx_heart: 34, wc_prop_fx_feather: 40,
    wc_fg_pumpkin_pile: 150, wc_fg_leaves_front: 130, wc_fg_fence_candy: 130, wc_fg_jar_shelf_front: 230, wc_fg_web_corner: 150, wc_fg_roof_sil: 150,
  };
  /* ASP.txt (2026-10-29) */
  const ASP = {
    wc_kid_stand: .6, wc_kid_walk: .6517, wc_kid_yuck: .6833, wc_kid_reach: .7317, wc_kid_point: .615, wc_kid_yum: .6, wc_kid_ghost: .69,
    wc_kid_tf_strawberry: .66, wc_kid_tf_strawberry_ball: .8083, wc_kid_tf_duck: .6683, wc_kid_tf_fish: 1.0517, wc_kid_tf_frog_jump: .765, wc_kid_tf_frog_sit: .7517, wc_kid_tf_kiwi: .6583, wc_kid_tf_croc: .795,
    wc_kid_tf_pumpkin: .6783, wc_kid_tf_bat_up: 1.1167, wc_kid_tf_bat_down: 1.0883, wc_kid_tf_choco: .605, wc_kid_tf_choco_flat: .9983,
    wc_witch_stand: .715, wc_witch_present: .7583, wc_witch_stir: .695, wc_witch_surprise: .72, wc_witch_giggle: .62, wc_witch_ghost: .7233, wc_witch_magic: .86, wc_ghost: 1.0083,
    wc_cat_sit: .6317, wc_cat_nose: .675, wc_cat_reach: .9917, wc_cat_waddle: .8467, wc_cat_ghost: .7067,
    wc_rabbit_stand: .5017, wc_rabbit_reach: .6483, wc_rabbit_happy: .605, wc_rabbit_ghost: .5917,
    wc_bear_stand: .5317, wc_bear_reach: .7833, wc_bear_happy: .6583, wc_bear_ghost: .635,
    wc_fox_stand: .6467, wc_fox_reach: .8933, wc_fox_happy: .7633, wc_fox_ghost: .77,
    wc_prop_invite: .965, wc_prop_pumpkin_lantern: 1.0117, wc_prop_bunting: 4.1667, wc_prop_web: .9717, wc_prop_bat_sil: 2.1327, wc_prop_cauldron: 1.1133, wc_prop_firewood: 1.6605,
    wc_prop_flame_small: .765, wc_prop_flame_big: .7467, wc_prop_smoke_puff: 1.115, wc_prop_pot_flat: 2.3077, wc_prop_pot_swirl: 1.0167, wc_prop_shelf_box: 1.9231, wc_prop_shelf_cell: 1.0133,
    wc_prop_ing_snot: .8417, wc_prop_ing_firetruck: 1.3433, wc_prop_ing_ladybug: 1.0483, wc_prop_ing_fart: 1.1683, wc_prop_ing_duck: 1.0583, wc_prop_ing_poo: 1.0583, wc_prop_ing_stink: .5933,
    wc_prop_ing_fly: .925, wc_prop_ing_fish: 1.2317, wc_prop_ing_wave: 1.9868, wc_prop_ing_frog: 1.095, wc_prop_ing_dino: 1.315, wc_prop_ing_leek: 0.9733, wc_prop_ing_lantern: 1.01,
    wc_prop_ladle: 1.0633, wc_prop_table: 2.1127, wc_prop_sample_orange: .56, wc_prop_sample_green: .5533, wc_prop_sample_purple: .565, wc_prop_sample_brown: .5033, wc_prop_sparkle_pop: 1.005,
    wc_prop_candy_strawberry: 1.7893, wc_prop_candy_duck: .7133, wc_prop_candy_fish: 1.6729, wc_prop_candy_frog: .5717, wc_prop_candy_kiwi: 1.8595, wc_prop_candy_croc: 1.19, wc_prop_candy_pumpkin: 1.833, wc_prop_candy_bat: 1.0617,
    wc_prop_candy_choco: .6933, wc_prop_candy_ghost: 2.0362, wc_prop_candy_jar: .93, wc_prop_plate_white: 1.7208, wc_prop_sign_candy: .8,
    wc_prop_fx_bubble: .9933, wc_prop_fx_heart: 1.1117, wc_prop_fx_feather: .555,
    wc_fg_pumpkin_pile: 1.3217, wc_fg_leaves_front: 1.2367, wc_fg_fence_candy: 1.9068, wc_fg_jar_shelf_front: .7133, wc_fg_web_corner: .995, wc_fg_roof_sil: 2.7439,
    /* 변신 컷 인물 큰 그림(post: 마젠타 오림, 이 작업에서 만든 webp) */
    wc_cut_tf_strawberry: 1.0702, wc_cut_tf_duck: .8111, wc_cut_tf_fish: 1.0022, wc_cut_tf_frog: .8322, wc_cut_tf_kiwi: .7667, wc_cut_tf_croc: .8744, wc_cut_tf_pumpkin: .7589, wc_cut_tf_bat: 1.1984, wc_cut_tf_choco: .69, wc_cut_tf_ghost: .8867,
  };
  const ING = [   // 재료 12개(2026-10-29 구운 초록 대파 추가) (PLAN §4-1): id, 색 key, 이름. 호박 등(lantern)은 노란 호박 등 그림 wc_prop_ing_lantern
    { id: 'snot', key: 'r', name: '아기 용 콧물' }, { id: 'firetruck', key: 'r', name: '소방차' }, { id: 'ladybug', key: 'r', name: '무당벌레' },
    { id: 'lantern', key: 'y', name: '노란 호박 등' }, { id: 'fart', key: 'y', name: '병아리 방귀' }, { id: 'duck', key: 'y', name: '고무 오리' },
    { id: 'poo', key: 'b', name: '괴물 응가' }, { id: 'fish', key: 'b', name: '파란 생선' }, { id: 'wave', key: 'b', name: '파란 파도' },
    { id: 'frog', key: 'g', name: '개구리' }, { id: 'dino', key: 'g', name: '공룡' }, { id: 'leek', key: 'g', name: '구운 대파' },
  ];
  const ingF = id => 'wc_prop_ing_' + id;   // 호박 등 재료는 노란 호박 등(wc_prop_ing_lantern, 2026-10-29 사용자: 노랑 칸인데 주황이라 이상)
  const CANDY = ['strawberry', 'duck', 'fish', 'frog', 'kiwi', 'croc', 'pumpkin', 'bat', 'choco', 'ghost'];
  /* 보는 쪽(그림을 눈으로 보고 정함, 2026-10-29). 정면은 방향을 못 바꾼다.
     PLAN §10-1 과 다른 것: 다현이 yuck 은 오른쪽(얼굴이 오른쪽으로 돌아 있음 → 왼쪽을 볼 때 뒤집음), point 오른쪽, 호박이 reach 는 왼쪽(엎드려 왼쪽으로 뻗음) */
  const NAT = { wc_kid_stand: 'right', wc_kid_walk: 'right', wc_kid_yuck: 'right', wc_kid_reach: 'left', wc_kid_point: 'right', wc_kid_yum: 'front', wc_kid_ghost: 'right', wc_kid_tf_strawberry: 'front', wc_kid_tf_strawberry_ball: 'front',
    wc_kid_tf_duck: 'right', wc_kid_tf_fish: 'right', wc_kid_tf_frog_jump: 'right', wc_kid_tf_frog_sit: 'front', wc_kid_tf_kiwi: 'front', wc_kid_tf_croc: 'right', wc_kid_tf_pumpkin: 'front', wc_kid_tf_bat_up: 'right', wc_kid_tf_bat_down: 'right', wc_kid_tf_choco: 'front', wc_kid_tf_choco_flat: 'front',
    wc_witch_stand: 'left', wc_witch_present: 'left', wc_witch_stir: 'right', wc_witch_surprise: 'front', wc_witch_giggle: 'left', wc_witch_ghost: 'right', wc_witch_magic: 'left', wc_ghost: 'left',
    wc_cat_sit: 'left', wc_cat_nose: 'left', wc_cat_reach: 'left', wc_cat_waddle: 'right', wc_cat_ghost: 'right' };
  ['rabbit', 'bear', 'fox'].forEach(w => { NAT[`wc_${w}_stand`] = 'right'; NAT[`wc_${w}_reach`] = 'left'; NAT[`wc_${w}_happy`] = 'front'; NAT[`wc_${w}_ghost`] = 'right'; });

  const COL = { r: '#E04B3C', y: '#F2C94E', b: '#3A6FD8', blue: '#3A6FD8', teal: '#2A9D8F', lime: '#A8CF45', g: '#6FB94A', orange: '#F28C28', green: '#6FB94A', purple: '#7A5AA6', brown: '#6B4A32', black: '#1A1410', water: '#D9E4EE' };
  const KO = { r: '빨강', y: '노랑', b: '파랑', g: '초록' };
  /* 결과표(PLAN §4-2): 들어간 색 집합 → 결과 */
  const RES = {
    strawberry: { ko: '딸기', color: 'r', plate: COL.r }, duck: { ko: '오리', color: 'y', plate: COL.y }, fish: { ko: '물고기', color: 'b', plate: COL.b }, frog: { ko: '개구리', color: 'teal', plate: COL.teal },
    kiwi: { ko: '키위', color: 'lime', plate: COL.lime }, croc: { ko: '악어', color: 'green', plate: COL.green },   // 2026-10-30 사용자: 연두 = 키위, 초록 = 악어, 청록 = 개구리
    pumpkin: { ko: '호박', color: 'orange', plate: COL.orange }, bat: { ko: '박쥐', color: 'purple', plate: COL.purple }, choco: { ko: '초콜릿', color: 'brown', plate: COL.brown },
  };
  const PAIRS = [['r', 'y'], ['y', 'b'], ['r', 'b'], ['r', 'g'], ['g', 'y'], ['g', 'b']];      // 질문 문장 속 순서 (빨노·노파·빨파·빨초·초노·초파)
  const MIX_RES = { ry: ['pumpkin', 'orange'], rb: ['bat', 'purple'], rg: ['choco', 'brown'], yb: ['croc', 'green'], gy: ['kiwi', 'lime'], gb: ['frog', 'teal'] };
  const SORT = k => [...k].sort().join('');
  const MIXKEY = { ry: 'ry', yr: 'ry', br: 'rb', rb: 'rb', gr: 'rg', rg: 'rg', by: 'yb', yb: 'yb', gy: 'gy', yg: 'gy', bg: 'gb', gb: 'gb' };
  function resultOf(kinds) {
    const ks = [...kinds];
    if (ks.length === 1) { const k = ks[0]; return { res: { r: 'strawberry', y: 'duck', b: 'fish', g: 'croc' }[k], color: k, single: k }; }
    const key = MIXKEY[ks.join('')], pair = PAIRS.find(p => p.every(x => kinds.has(x)));
    const m = MIX_RES[key]; return { res: m[0], color: m[1], pair };
  }
  const COLOR_KO = { orange: '주황', green: '초록', purple: '보라', brown: '갈색', teal: '청록', lime: '연두' };
  const comboFor = res => ({ strawberry: [['r']], duck: [['y']], fish: [['b']], frog: [['g', 'b']], kiwi: [['g', 'y']], croc: [['g'], ['y', 'b']], pumpkin: [['r', 'y']], bat: [['r', 'b']], choco: [['r', 'g']] }[res]);

  /* ---------- 대사 (PLAN §5·§7 문장 그대로) ---------- */
  const S = {
    A1: "핼러윈 밤이에요. 바람을 타고 무언가 팔랑팔랑 날아왔어요.", A2: "어? 초대장이다!", A3: "우와!", A4: "거리 끝 사탕 가게 창이 환하게 켜졌어요.",
    A5: "어서 와, 친구들! 나는 사탕 마녀야.", A6: "다현이랑 친구들은 사탕 가게로 쪼르르 들어갔어요.",
    B1: "오늘은 핼러윈 특별 사탕을 만들 거야. 먼저 솥을 끓여야지.", B2: "장작을 톡 눌러 불을 지펴요.", B3: "화르륵! 불이 활활, 솥이 뽀글뽀글 끓기 시작했어요.", B4: "냐옹!", B5: "뽀글뽀글!",
    C1: "핼러윈 사탕 재료야! 빨간 건 아기 용 콧물이랑 소방차, 노란 건 호박 등이랑 병아리 방귀!", C2: "파란 건 괴물 응가랑 파란 생선, 초록은 개구리랑 공룡!", C3: "으엑! 콧물이랑 응가요?", C3s: "으엑! 콧물이요?", C3p: "으엑! 응가요?", C4: "냐… 냄새!",
    C5: "히히, 색을 섞으면 다른 색 사탕이 돼. 먹으면 어떻게 되는지는… 비밀! 같이 만들까?", C6: "네, 제가 할게요!", C7: "나도!",
    D1: "다현이가 넣어 줘. 하나든 여러 개든 좋아.", D2: "넣고 싶은 재료를 톡 눌러 솥에 넣어요.", D3: "으엑…", D4: "다 넣었지? 그럼 저어 보자!", D5: "세 가지는 맨 마지막에!", D6: "하나는 넣어야지!",
    R2: "이번엔 다른 색으로 해 볼까?", R2a: "재료를 톡!", RSAME: "아까랑 같네? 다음엔 다른 색도 해 봐!", RMORE: "한 번 더 할래?", RMOREa: "한 번 더 하려면 솥을 톡 눌러요.", RCLEAR: "솥 물이 쏴아, 다시 맑아졌어요.",
    E1: "자, 저어 보자. 뽀글뽀글…", E2: "펑! 솥에서 사탕이 퐁퐁 튀어나왔어요.", E3: "먼저 먹어 봐.", E4: "콧물로 만든 건데… 으웩…",
    F1: "히히, 핼러윈 마법이야!", F2: "나도 하고 싶다!", F4: "뿅! 다현이는 다시 원래대로 돌아왔어요.",
    G1: "마지막은 핼러윈 특별 사탕! 색을 전부 다 넣는 거야.", G2: "전부 다요?", G3: "이번엔 빨강, 노랑, 파랑 다 넣어요! 톡 눌러요.", G4: "하나, 둘, 셋! 색을 전부 섞으면…", G5: "뽀글뽀글… 펑!", G6: "까만 사탕이 나왔어요!", G7: "까맣다!",
    H1: "어? 입이 까매졌다! 유령 사탕이다~", H2: "오~~우~~", H3: "히히, 나도!", H4: "마녀도, 호박이도, 친구들도 까만 입술로…", H5: "유령 흉내를 내며 마을을 한 바퀴 돌았어요. 하나도 안 무서워요, 다 웃고 있거든요.",
    I1: "자, 약속! 남은 사탕 다 나와라!", I2: "솥에서 사탕이 퐁퐁퐁 쏟아졌어요. 모두 하나씩… 마녀는 두 개!", I3: "히히, 나는 두 개!", I4: "으웩!… 어? 맛있다!", I5: "뿅, 뿅, 뿅! 딸기, 개구리, 오리, 박쥐, 물고기, 호박… 다 같이 변신!",
    I6: "뿅! 모두 원래대로.", I7: "다현이 덕분에 사탕이 가득! 내년에도 같이 섞자.", I8: "네! 다음엔 다른 색으로요!", I9: "사탕 마녀를 톡 눌러 인사해요.", I10: "해피 핼러윈! 오~우~!",
    NTF: { strawberry: "뿅! 다현이가 빨간 딸기가 됐어요!", duck: "뿅! 다현이 발이 오리발이 됐어요!", fish: "뿅! 다현이한테 물고기 꼬리가 생겼어요!", frog: "뿅! 다현이가 청록 개구리가 됐어요!", kiwi: "뿅! 다현이가 동그란 연두 키위가 됐어요!", croc: "뿅! 다현이한테 초록 악어 꼬리가 생겼어요!", pumpkin: "뿅! 다현이의 볼이랑 배가 호박처럼 환해졌어요!", bat: "뿅! 다현이 등에 박쥐 날개가 돋았어요!", choco: "뿅! 다현이 입에 초콜릿 수염이 났어요!" },
    KTF: { strawberry: "데굴데굴, 멈춰 줘요~!", duck: "꽥꽥… 어? 내 발이!", fish: "하늘에서 수영이다!", frog: "개굴! 지붕까지 폴짝!", kiwi: "보송보송… 간지러워! 히히!", croc: "앙! 앙! 나는 악어다!", pumpkin: "내 배가 등불이 됐어!", bat: "파닥파닥, 달님 안녕!", choco: "주르륵… 나 녹아요~" },
    NACT: { strawberry: "길을 데굴데굴 굴러가다 호박 등에 통!", duck: "뒤뚱뒤뚱, 호박이도 뒤뚱뒤뚱.", fish: "보름달 둘레를 보글보글 헤엄쳤어요.", frog: "폴짝, 폴짝, 폴짝! 지붕 위에서 손을 흔들었어요.", kiwi: "통, 통, 통! 키위 공처럼 길을 통통 튀어 갔어요.", croc: "엉금엉금 기어가다 앙! 호박이가 깜짝 놀라 폴짝 뛰었어요.", pumpkin: "깜깜한 길이 다현이 덕분에 환해졌어요.", bat: "박쥐 친구들이랑 달 앞을 빙글 돌았어요.", choco: "납작해졌다가… 뿅!" },
  };
  const eum = w => ((w.charCodeAt(w.length - 1) - 0xAC00) % 28 ? '이에요' : '예요');

  /* ================= 자리표시(그림이 없을 때) ================= */
  const WORD = { kid: '다현이', witch: '마녀', cat: '호박이', rabbit: '토끼', bear: '곰', fox: '여우', stand: '서기', walk: '걷기', yuck: '으엑', reach: '뻗기', point: '가리키기', yum: '냠', ghost: '유령', tf: '변신', strawberry: '딸기', ball: '공', duck: '오리', fish: '물고기', frog: '개구리', jump: '점프', sit: '앉기', pumpkin: '호박', bat: '박쥐', up: '위', down: '아래', choco: '초콜릿', flat: '납작', present: '가리키기', stir: '젓기', magic: '마법', surprise: '놀람', giggle: '웃음', nose: '코 막기', waddle: '뒤뚱', happy: '활짝' };
  const nameOf = f => f.replace(/^wc_(kid|witch|cat|rabbit|bear|fox|prop|bg|fg|cut)_/, (m, a) => (WORD[a] || a) + ' ').split('_').map(w => WORD[w] || w).join(' ').replace(/^ing /, '').trim();
  const WHOCOL = { kid: '#F3D9B8', witch: '#8B5A7E', cat: '#E8A14E', rabbit: '#F4F6FA', bear: '#B0713E', fox: '#E8703A' };
  function placeholder(T, parent, f, w, h) {
    const g = T.el('g', {}, parent);
    const label = (txt, cx, cy, fs = 12, fill = INK) => { const t = T.el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 700, fill, 'font-family': FONT, text: T.tr(txt) }, g); t.classList.add('phl'); t.dataset.cx = cx; t.dataset.cy = cy; t.setAttribute('transform', `translate(${cx},${cy})`); };
    const ch = /^wc_(kid|witch|cat|rabbit|bear|fox)_(.+)$/.exec(f);
    if (ch) {
      const [, who, pose] = ch, r = Math.min(h * .21, w * .26), tf = /^tf_/.test(pose);
      const body = tf ? (/strawberry/.test(pose) ? '#E04B3C' : /duck/.test(pose) ? '#F2C94E' : /fish/.test(pose) ? '#3A6FD8' : /frog/.test(pose) ? '#2A9D8F' : /kiwi/.test(pose) ? '#A8CF45' : /croc/.test(pose) ? '#6FB94A' : /pumpkin/.test(pose) ? '#F28C28' : /bat/.test(pose) ? '#7A5AA6' : '#6B4A32') : who === 'kid' ? '#5A3F7A' : WHOCOL[who];
      T.el('rect', { x: w * .2, y: 2 * r - 4, width: w * .6, height: h - 2 * r + 4, rx: 10, fill: body }, g);
      T.el('circle', { cx: w / 2, cy: r + 2, r, fill: WHOCOL[who] }, g);
      if (who === 'witch') T.el('path', { d: `M${w / 2 - r * 1.2} ${r * .4} L${w / 2} ${-r * .6} L${w / 2 + r * 1.2} ${r * .4}Z`, fill: '#5A3F7A' }, g);
      if (/ghost/.test(pose)) T.el('rect', { x: w / 2 - r * .4, y: r + r * .5, width: r * .8, height: r * .25, rx: 3, fill: '#1A1410' }, g);
      [-1, 1].forEach(s => T.el('circle', { cx: w / 2 + s * r * .35, cy: r, r: 2.6, fill: INK }, g));
      label(nameOf(f), w / 2, h * .62, Math.max(10, Math.min(14, w / 5)), /witch|bear/.test(f) || tf ? CREAM : INK);
      return g;
    }
    const nm = nameOf(f);
    let m;
    if ((m = /^wc_prop_ing_(.+)$/.exec(f))) { const it = ING.find(i => i.id === m[1]); T.el('rect', { width: w, height: h, rx: 10, fill: COL[it.key] }, g); label(it.name, w / 2, h / 2 + 4, 10, it.key === 'y' ? INK : CREAM); return g; }
    if ((m = /^wc_prop_candy_(.+)$/.exec(f))) { const c = { strawberry: '#E04B3C', duck: '#F2C94E', fish: '#3A6FD8', frog: '#2A9D8F', kiwi: '#A8CF45', croc: '#6FB94A', pumpkin: '#F28C28', bat: '#7A5AA6', choco: '#6B4A32', ghost: '#1A1410' }[m[1]]; T.el('circle', { cx: w / 2, cy: h / 2, r: Math.min(w, h) / 2, fill: c }, g); T.el('circle', { cx: w * .38, cy: h * .35, r: Math.min(w, h) * .08, fill: '#FBF3D5' }, g); label((WORD[m[1]] || m[1]) + ' 사탕', w / 2, h + 12, 11, CREAM); return g; }
    if ((m = /^wc_prop_sample_(.+)$/.exec(f))) { T.el('circle', { cx: w / 2, cy: h / 2, r: Math.min(w, h) / 2, fill: COL[m[1]] }, g); return g; }
    switch (f) {
      case 'wc_prop_firewood': T.el('rect', { x: 0, y: h * .3, width: w, height: h * .7, rx: 6, fill: '#6B4A32' }, g); label('장작', w / 2, h * .8, 12, CREAM); break;
      case 'wc_prop_flame_small': case 'wc_prop_flame_big': T.el('path', { d: `M${w / 2} 0 Q${w} ${h * .6} ${w / 2} ${h} Q0 ${h * .6} ${w / 2} 0Z`, fill: '#F2B366' }, g); T.el('path', { d: `M${w / 2} ${h * .35} Q${w * .75} ${h * .7} ${w / 2} ${h} Q${w * .25} ${h * .7} ${w / 2} ${h * .35}Z`, fill: '#F6D27A' }, g); break;
      case 'wc_prop_ladle': T.el('rect', { x: w * .4, y: 0, width: w * .2, height: h * .8, rx: 4, fill: '#C9A574' }, g); T.el('ellipse', { cx: w / 2, cy: h * .88, rx: w * .5, ry: h * .12, fill: '#9AA79A' }, g); break;
      case 'wc_prop_invite': T.el('rect', { width: w, height: h, rx: 10, fill: '#F28C28' }, g); label('초대장', w / 2, h / 2 + 4, 11, CREAM); break;
      default: T.el('rect', { width: w, height: h, rx: Math.min(w, h) * .2, fill: '#D9A94E' }, g); label(nm, w / 2, h / 2 + 4, 11);
    }
    return g;
  }
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    const g = placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
    return g.parentNode;
  }
  /* 그림을 bw×bh 상자 안에 비율을 지켜 맞춘 크기 */
  const fitWH = (f, bw, bh) => { const a = ASP[f] || 1; return bw / bh > a ? [bh * a, bh] : [bw, bw / a]; };
  /* 상자 가운데(cx,cy)에 비율을 지켜 놓는다(재료·사탕처럼 모양이 제각각인 것) */
  const pic = (T, parent, f, cx, cy, bw, bh = bw) => { const [w, h] = fitWH(f, bw, bh); return sprite(T, parent, f, cx - w / 2, cy - h / 2, w, h); };
  /* 빛 층(CLAUDE.md §7-1 빛 예외): 광원에서 멀수록 흐려지는 둥근 빛. 종이 조각이 아니라 조명이라 그라데이션 허용 */
  function glow(T, parent, cx, cy, r, color = '#F2B366', a = .8) {
    const svg = T.world.ownerSVGElement, id = 'wcGlow' + color.replace('#', '') + String(a).replace('.', '');
    if (!svg.querySelector('#' + id)) {
      let defs = svg.querySelector('defs#wcDefs'); if (!defs) { defs = T.el('defs', {}, svg); defs.id = 'wcDefs'; }
      const g = T.el('radialGradient', { id }, defs);
      T.el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': a }, g); T.el('stop', { offset: '.45', 'stop-color': color, 'stop-opacity': a * .45 }, g); T.el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, g);
    }
    return T.el('circle', { cx, cy, r, fill: `url(#${id})`, 'pointer-events': 'none' }, parent);
  }
  /* 색 틴트: 흰 종이 그림(솥 물 판·회오리 띠)에 색을 곱한다 — 종이 결은 그대로, 1조각 1색(PLAN §17 ②, 판단 9) */
  function tintId(T, color) {
    const svg = T.world.ownerSVGElement, id = 'wcTint' + color.replace('#', '');
    if (!svg.querySelector('#' + id)) {
      let defs = svg.querySelector('defs#wcDefs'); if (!defs) { defs = T.el('defs', {}, svg); defs.id = 'wcDefs'; }
      const f = T.el('filter', { id, x: 0, y: 0, width: 1, height: 1, 'color-interpolation-filters': 'sRGB' }, defs);
      T.el('feFlood', { 'flood-color': color, result: 'c' }, f);
      T.el('feComposite', { in: 'c', in2: 'SourceGraphic', operator: 'arithmetic', k1: 1, k2: 0, k3: 0, k4: 0 }, f);
    }
    return `url(#${id})`;
  }
  /* 배경 자리표시: 핼러윈 밤 (하늘 띠·보름달·바닥·층 몇 개 + 이름표) */
  const BGD = {
    wc_bg_street: { sky: ['#141B3D', '#1F2A56', '#5A4A7A', '#8A5A8F'], gnd: '#8C7461', name: '핼러윈 밤 거리', moon: [820, 110], houses: true },
    wc_bg_shop_front: { sky: ['#1F2A56', '#1F2A56', '#5A4A7A', '#5A4A7A'], gnd: '#8C7461', name: '사탕 가게 앞', moon: [160, 90], shop: true },
    wc_bg_kitchen: { sky: ['#5A3F7A', '#5A3F7A', '#5A3F7A', '#5A3F7A'], gnd: '#4E3524', name: '사탕 가게 부엌', moon: [500, 80], wall: true },
    wc_bg_rooftops_lb: { sky: ['#141B3D', '#1F2A56', '#3B4C8F', '#5A4A7A'], gnd: '#1A1410', name: '달밤 지붕', moon: [700, 150], big: true },
  };
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };   // 배경 그림 1600×902 (post_tale.py)
  /* 앞 가림 층(PLAN §6·§10-3): 효과 층(T.fx, 누름 없음)에 얹어 인물보다 앞. 가장자리에만 두어 인물·누르는 대상을 가리지 않는다.
     세로 화면은 보이는 폭이 좁아(가운데 약 300~700) 모서리 조각을 화면 끝에 반쯤 걸치게 옮긴다 */
  function fgLayer(T, key, P) {
    const g = T.el('g', { 'pointer-events': 'none' }, T.fx), at = (f, x, y, h, flip) => {
      const w = h * (ASP[f] || 1), wrap = T.el('g', { filter: 'url(#pp)', transform: flip ? `translate(${2 * x + w} 0) scale(-1 1)` : '' }, g);
      sprite(T, wrap, f, x, y, w, h);
    };
    if (key === 'wc_bg_street') { at('wc_fg_pumpkin_pile', P ? 230 : -30, P ? 470 : 440, HT.wc_fg_pumpkin_pile); at('wc_fg_leaves_front', P ? 640 : 870, P ? 470 : 450, HT.wc_fg_leaves_front); }
    else if (key === 'wc_bg_shop_front') { at('wc_fg_fence_candy', P ? 160 : -40, P ? 490 : 440, HT.wc_fg_fence_candy); at('wc_fg_leaves_front', P ? 650 : 880, P ? 480 : 460, HT.wc_fg_leaves_front * .85); }
    else if (key === 'wc_bg_kitchen') at('wc_fg_web_corner', P ? 590 : 870, -14, HT.wc_fg_web_corner);
    else if (key === 'wc_bg_rooftops_lb') [-60, 340, 740].forEach((x, i) => at('wc_fg_roof_sil', x, 440, HT.wc_fg_roof_sil, i % 2));
    return g;
  }
  function bgImage(T, key) {
    curBg = key;
    if (bgOK[key]) { const P = T.viewWidth() < 990; fgLayer(T, key, P); return T.el('image', { href: src(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg); }
    const d = BGD[key], g = T.el('g', {}, T.bg);
    d.sky.forEach((c, i) => T.el('rect', { x: -40, y: -24 + i * 130, width: 1080, height: 140, fill: c }, g));
    T.el('circle', { cx: d.moon[0], cy: d.moon[1], r: d.big ? 110 : 56, fill: '#FBF3D5' }, g);
    [[120, 60], [330, 130], [560, 40], [930, 70], [430, 210]].forEach(([x, y]) => T.el('circle', { cx: x, cy: y, r: 3, fill: '#F6D27A' }, g));
    [[300, 90], [380, 60], [760, 70]].forEach(([x, y]) => T.el('path', { d: `M${x} ${y} l10 -8 l8 6 l8 -6 l10 8 l-10 -3 l-8 5 l-8 -5Z`, fill: '#1A1410' }, g));
    if (d.wall) { T.el('rect', { x: -40, y: -24, width: 1080, height: 480, fill: '#5A3F7A' }, g); [100, 300, 500, 700, 900].forEach(x => T.el('rect', { x, y: -24, width: 60, height: 480, fill: CREAM, opacity: 1 }, g)); T.el('circle', { cx: 500, cy: 110, r: 70, fill: '#1F2A56' }, g); T.el('circle', { cx: 500, cy: 110, r: 36, fill: '#FBF3D5' }, g); T.el('rect', { x: 250, y: 120, width: 300, height: 14, fill: '#6B4A32' }, g); }
    if (d.houses) [[40, 170, 150], [260, 200, 130], [620, 180, 160], [880, 210, 120]].forEach(([x, y, w]) => { T.el('rect', { x, y, width: w, height: 300, fill: '#6C739A' }, g); T.el('rect', { x: x + w * .3, y: y + 60, width: 30, height: 36, fill: '#F2B366' }, g); });
    if (d.shop) { T.el('rect', { x: 260, y: 130, width: 480, height: 340, fill: CREAM }, g); T.el('path', { d: 'M230 140 L500 40 L770 140Z', fill: '#5A3F7A' }, g); T.el('rect', { x: 440, y: 270, width: 120, height: 200, fill: '#F2B366' }, g); [300, 640].forEach(x => T.el('circle', { cx: x + 30, cy: 230, r: 34, fill: '#F2B366' }, g)); }
    T.el('rect', { x: -40, y: 440, width: 1080, height: 160, fill: d.gnd }, g);
    T.el('text', { x: 500, y: 26, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 700, fill: '#F6ECD8', 'font-family': FONT, opacity: .85, text: '(그림 자리) 배경: ' + d.name }, g);
    return g;
  }

  /* ================= 배우·소품 ================= */
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
    const place0 = a.place;
    a.place = (nx, ny) => { place0(nx, ny); a.pos.querySelectorAll('.phl').forEach(t => t.setAttribute('transform', `translate(${t.dataset.cx},${t.dataset.cy}) scale(${a.flip},1)`)); };
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    a.look = (k, d) => { Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; }); a.cur = k; a.h = looks[k].h; a.w = looks[k].w; a.turn(d || a.want); };
    a.look(Object.keys(poses)[0]);
    a.pos.style.pointerEvents = 'none';           // 인물 그림은 누름을 받지 않는다(마녀 인사 톡만 hit 상자로)
    return a;
  }
  const prop = (T, f, h) => mk(T, { a: [f, h || HT[f]] });
  /* 사탕은 모양마다 비율이 달라(막대·꼬임 포장) b×b 상자에 맞춘 높이로 만든다 */
  const candyProp = (T, c, b) => { const f = 'wc_prop_candy_' + c; return prop(T, f, fitWH(f, b * 1.3, b)[1]); };
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); a.x = x; if (look) a.look(look, to || 'right'); else a.turn(to || a.want);   // x 를 먼저 둔다: 다현이 시선(솥 쪽)이 새 자리로 정해진다
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = ''; a.body.style.opacity = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 500) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const bob = n => n.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
  /* 누르는 상자: 투명 사각 (화면 크기 w×h 를 지키려고 호출 쪽이 H() 로 키운다). 대상 그룹 g 에 붙이고 g 를 arm 한다 */
  function hitZone(T, parent, cx, cy, w, h) {
    const g = T.el('g', {}, parent);
    T.el('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 12, fill: '#000', 'fill-opacity': 0 }, g);
    return g;
  }

  async function run(T) {
    const { sleep, camSnap, tr } = T;
    T.cardSpeed(.6);
    const GAP = 700;
    const say = async text => { await T.say(text); await sleep(GAP); };
    const P = T.viewWidth() < 990;
    const VW = T.viewWidth();
    const PS = P ? Math.min(1, VW / 400) : 1;
    const X = (l, p) => (P ? p : l);
    const H = n => (P ? n / PS : n);
    let VX = { lx: 500 };
    const setView = (lx = 500) => {
      T.fx.style.pointerEvents = 'none';
      VX = { lx };
      const t = P ? `translate(500 ${FL}) scale(${PS}) translate(${-lx} ${-FL})` : '';
      [T.world, T.fx].forEach(g => (t ? g.setAttribute('transform', t) : g.removeAttribute('transform')));
      camSnap(500, 280, 1);
    };
    /* ---- 소리: 기존 소리를 먼저 재사용, 새로 받은 소리(없으면 다음 후보) ---- */
    const playS = (n, v) => { try { return n.startsWith('animals/') ? AudioFX.animal(n.slice(8), v) : AudioFX.sfx(n, T.reading() ? v * .8 : v); } catch (e) { return false; } };
    const cue = (names, v = .6, fb) => { for (const n of [].concat(names)) if (playS(n, v)) return true; if (fb) fb(); return false; };
    const tn = (f, d = .25, o = {}) => () => T.tone(f, d, { vol: .16, ...o });
    const SFXN = ['paper_turn', 'wing_flap_2', 'ding', 'ding_glock', 'ding_glock_2', 'whistle_up', 'whistle_down', 'whistle_wobble', 'bell', 'fire_crackle', 'whoosh', 'pot_boil', 'water_drip', 'fire_siren', 'bee_buzz', 'pop', 'harp_gliss', 'harp_gliss_2', 'chime_up', 'drum', 'squeak', 'splash', 'splash_big', 'pow', 'boom', 'cymbal', 'slide_up', 'slide_down', 'sparkle', 'shimmer', 'tada', 'wing_flap_1', 'party_horn', 'cushion', 'boing', 'spring', 'xylo_up', 'step_wood', 'giggle_xylo', 'chomp', 'gulp', 'zip', 'doop', 'paper_up', 'paper_down', 'knock', 'door', 'hop', 'toy_flute',
      'toot_kazoo', 'squelch', 'dino_roar', 'theremin_wobble', 'marimba_1', 'marimba_2', 'marimba_3', 'marimba_4', 'marimba_5', 'crickets_night_1', 'winter_wind_1'];
    AudioFX.preloadSfx(SFXN); ['duck', 'frog', 'cat', 'tiger_2'].forEach(n => { try { AudioFX.animal(n, 0); } catch (e) { /* */ } });
    const amb = (name, v = .25, d = 4) => { try { AudioFX.ambient(name, { vol: v, dur: d }); } catch (e) { /* */ } };
    const ingSfx = {
      snot: () => cue('water_drip', .7, tn([900, 500], .2)),
      firetruck: () => cue('fire_siren', .45, tn([700, 520, 700, 520], .5, { type: 'square' })),
      ladybug: () => { cue('bee_buzz', .4); setTimeout(() => cue('pop', .6), 350); },
      lantern: () => { cue('pop', .7); setTimeout(() => cue('harp_gliss', .5), 100); setTimeout(() => cue('chime_up', .5), 500); },
      fart: () => cue('toot_kazoo', .7, tn([220, 110, 140], .35, { type: 'sawtooth' })),
      duck: () => cue('animals/duck', .7, tn([520, 380], .25, { type: 'square' })),
      poo: () => { cue('slide_down', .5); setTimeout(() => cue('pop', .7), 350); },   // 응가: 만화식 '뿅~ 뽁'(2026-10-28 사용자: 뿌직은 너무 리얼)
      fish: () => cue('splash', .6),
      wave: () => cue(['splash_big'], .6),
      frog: () => { cue('animals/frog', .7); setTimeout(() => cue('pop', .5), 300); },
      leek: () => { cue('fire_crackle', .5); setTimeout(() => cue('pop', .5), 300); },   // 구운 대파: 지글지글
      dino: () => { cue(['dino_roar', 'animals/tiger_2'], .45, tn([1000, 1500], .3, { type: 'square' })); setTimeout(() => cue('pop', .5), 350); },
    };
    const count = n => { const k = 'n' + n; const u = typeof Narrator !== 'undefined' && Narrator.voiceLine(k); if (u && AudioFX.voice) AudioFX.voice(u); else cue('marimba_' + Math.min(5, n), .5); };
    /* 목소리 한 줄(VOICE_LINES 키): 녹음이 없으면 null. 솔로 '오~~우~~'(ghost_kid)·'으엑…'(yuck)은 합창·내레이션 키와 글자가 겹쳐 이 키로만 부른다 */
    const vo = k => { try { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); } catch (e) { return null; } };
    const voWait = async k => { const p = vo(k); if (p) await Promise.race([p, sleep(4000)]); };

    /* ---- 그림 불러오기(없으면 자리표시) ---- */
    const loads = [];
    Object.keys(BGD).forEach(k => loads.push(T.preload(src(k)).then(ok => { bgOK[k] = ok; })));
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);

    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, [`wc_${who}_${p}`, HT[`wc_${who}_${p}`]]]));
    const kid = mk(T, pz('kid', POSES.kid)), witch = mk(T, pz('witch', POSES.witch)), cat = mk(T, pz('cat', POSES.cat));
    const fr = { rabbit: mk(T, pz('rabbit', POSES.rabbit)), bear: mk(T, pz('bear', POSES.bear)), fox: mk(T, pz('fox', POSES.fox)) };
    const FRS = Object.values(fr);
    const ALL = [kid, witch, cat, ...FRS];
    const loadBase = () => {
      ALL.forEach(a => { hide(a); a.pos.style.pointerEvents = 'none'; });
    };
    loadBase();
    const cast = (list) => list.forEach(([a, x, y, o]) => put(T, a, x, y, o));
    /* 같은 배경 이어 가기(2026-10-29 사용자: '같은 배경인데 자꾸 화면 넘기는 처리하네 안해도 될 듯' — 유니콘 10f0cfa0 방식).
       fn = 다음 장면 차리기(배경·솥·선반을 다시 지어도 된다). 차리기 전 무대(인물 빼고)를 떠 둔 사본을 새 무대 위에 얹어 흐리게 지운다:
       그대로인 것은 같은 자리라 티가 안 나고, 사라질 것은 흐려지고, 새로 놓일 것은 사본이 걷히며 나타난다.
       인물은 전후를 견주어 새 자리로 걸어가고(다현이는 걷기 자세), 빠지는 인물은 흐려지고, 새 인물은 나타난다 */
    const ACT = new Set(ALL.map(a => a.pos));
    const shown = a => a.pos.isConnected && a.pos.style.display !== 'none';
    const tfm = (x, y, f, s) => `translate(${x}px,${y}px) scale(${f * s},${s})`;
    const cont = async (fn, ms = 800) => {
      const was = new Map(ALL.map(a => [a, { vis: shown(a), x: a.x, y: a.y, s: a.scale, f: a.flip }]));
      const snap = L => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('pointer-events', 'none');
        [...L.children].forEach(n => { if (!ACT.has(n)) g.appendChild(n.cloneNode(true)); });
        g.querySelectorAll('.tap-target').forEach(n => n.classList.remove('tap-target'));
        return g;
      };
      const sb = snap(T.bg), sw = snap(T.world), sf = snap(T.fx);
      fn();
      T.bg.appendChild(sb); T.world.insertBefore(sw, [...T.world.children].find(n => ACT.has(n)) || null); T.fx.appendChild(sf);
      const jobs = [sb, sw, sf].map(g => g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' }).finished.then(() => g.remove()));
      let walking = 0;
      for (const a of ALL) {
        const w = was.get(a), n = shown(a);
        if (w.vis && n) {
          if (Math.abs(w.x - a.x) + Math.abs(w.y - a.y) < 2 && Math.abs(w.s - a.scale) < .01) continue;
          const k = a.cur, d = a.want, nx = a.x, ny = a.y, go = nx >= w.x ? 'right' : 'left';
          if (/^tf_/.test(k)) continue;                       // 변신 컷 뒤: 새 자리에 바로
          if (a === kid) a.look('walk', go); else a.turn(go);
          const dur = Math.max(ms, Math.min(1600, Math.hypot(nx - w.x, ny - w.y) * 2.4)); walking = Math.max(walking, dur);
          jobs.push(a.pos.animate([{ transform: tfm(w.x, w.y, a.flip, w.s) }, { transform: tfm(nx, ny, a.flip, a.scale) }], { duration: dur, easing: 'ease-in-out' }).finished.then(() => a.look(k, d)));
        } else if (w.vis && !n) {   // 빠지는 인물: 옛 자리에서 흐려진다(배경을 다시 지었으면 다시 붙여서)
          if (!a.pos.isConnected) T.world.appendChild(a.pos);
          a.pos.style.display = ''; a.scale = w.s; a.flip = w.f; a.place(w.x, w.y);
          jobs.push(a.pos.animate([{ opacity: 1 }, { opacity: 0 }], ms).finished.then(() => hide(a)));
        } else if (!w.vis && n) jobs.push(a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms).finished);
      }
      if (walking) { const id = setInterval(() => cue('step_wood', .22), 380); setTimeout(() => clearInterval(id), walking); }
      await Promise.all(jobs);
    };
    /* 장면 시작: 배경이 같으면 넘김 없이 이어 가고, 다르면 책장 넘김 */
    const next = (label, bg, fn, focus) => (bg === curBg && !document.hidden ? cont(fn) : T.sceneCard(label, fn, focus));

    /* ================= 솥·불·선반 (4~7장 부엌) =================
       솥 그림 wc_prop_cauldron(668×600): 솥 입(안쪽 어두운 타원) 가운데 = 그림 폭의 .497·높이의 .113, 반지름 = 폭의 .302 × 높이의 .072 (2026-10-29 잼).
       POT.cx·cy 는 솥 입 가운데, rx·ry 는 솥 입 반지름. 솥 물(wc_prop_pot_flat)·회오리 띠(wc_prop_pot_swirl)는 흰 종이 그림에 색을 곱해(tintId) 솥 입에 얹는다 */
    /* 세로 화면: 위쪽 선반(4단)과 아래 인물 사이에 솥이 들어가도록 솥·장작·불꽃·국자를 .8 배로(보이는 아래 끝 ≈ y 560) */
    const KS = X(1, .8), PFY = 550;   // PFY = 세로 부엌 바닥(발끝)
    const PH = HT.wc_prop_cauldron * KS, PW = PH * ASP.wc_prop_cauldron;
    const POT = { cx: 0, cy: 0, rx: PW * .302, ry: PH * .072 };
    const potAt = (cx, bottom) => { POT.cx = cx; POT.cy = bottom - PH * (1 - .113); };
    const potHome = () => potAt(X(790, 500), X(FL - 40, 515));
    /* 부엌에서 다현이는 늘 솥을 본다(2026-10-29 사용자: '왜 자꾸 왼쪽 보지, 솥을 보자') — 서기·걷기·뻗기·가리키기·냠·으엑 자세만, 변신·유령 행진은 그대로 */
    { const turn0 = kid.turn; kid.turn = d => turn0(d !== 'front' && curBg === 'wc_bg_kitchen' && /^(stand|walk|reach|point|yum|yuck)$/.test(kid.cur) && POT.cx && Math.abs(kid.x - POT.cx) > 20 ? (kid.x < POT.cx ? 'right' : 'left') : d); }
    potHome();
    let K = null;                           // 지금 장면의 부엌 도구
    let lit = false;                        // 2장에서 장작에 불을 붙인 뒤로는 부엌마다 큰 불(2026-10-29 사용자: 솥 밑이 불타고 있어야)
    function potDraw(parent) {
      const g = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, parent);
      sprite(T, g, 'wc_prop_cauldron', POT.cx - PW * .497, POT.cy - PH * .113, PW, PH);
      return g;
    }
    function kitchen({ shelf = true, ladle = true, jars = false } = {}) {
      potHome();                                          // 9장에서 솥을 옮겼어도 부엌은 늘 제자리
      T.clear(); bgImage(T, 'wc_bg_kitchen'); setView(500);
      const k = { cells: [], pot: null };
      /* 솥 → 불꽃 → 장작(앞): 장작 더미가 솥 다리 앞, 불꽃은 장작 뒤에서 솥 배 아래로 솟는다 */
      const bottom = POT.cy + PH * (1 - .113);
      k.potG = potDraw(T.world);
      const lay = T.el('g', { 'pointer-events': 'none' }, T.world);
      k.lay = lay;
      const FWH = HT.wc_prop_firewood * KS, FWW = FWH * ASP.wc_prop_firewood, fy = bottom + 6;   // 장작 폭 ≈ 솥 입 지름
      const flame = f => { const h = HT[f] * KS, w = h * ASP[f], g = T.el('g', { 'pointer-events': 'none', filter: 'url(#pp)' }, T.world); sprite(T, g, f, POT.cx - w / 2, fy - h + 4, w, h); g.style.transformBox = 'fill-box'; g.style.transformOrigin = '50% 100%'; g.style.display = 'none'; g.animate([{ transform: 'scale(1,1)' }, { transform: 'scale(1.06,.94)' }, { transform: 'scale(1,1)' }], { duration: 700, iterations: Infinity }); return g; };
      k.flameS = flame('wc_prop_flame_small'); k.flameB = flame('wc_prop_flame_big');
      (lit ? k.flameB : k.flameS).style.display = '';
      const woodG = hitZone(T, T.world, POT.cx, fy + FWH / 2 - 4, H(Math.max(110, FWW)), H(90));
      const wi = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, woodG); sprite(T, wi, 'wc_prop_firewood', POT.cx - FWW / 2, fy - 4, FWW, FWH);
      k.wood = woodG;
      k.potHit = hitZone(T, T.world, POT.cx, POT.cy + 60, H(200), H(150));
      k.kinds = [];
      /* 선반: 가로 = 선반 상자 그림 한 장(2단 6칸, 칸 가운데를 그림에서 잼), 세로 = 칸 조각 4단 3열 */
      if (shelf) {
        const cellsPos = [], SG = k.shelfG = T.el('g', {}, T.world);   // 선반 한 덩어리(읽어 주기가 shelf:show 로 켠다)
        if (!P) {
          const sw = 550, sh = sw / ASP.wc_prop_shelf_box, sx = 85, sy = FL - sh, s = sw / 900;   // 2026-10-29 왼쪽으로 당김(마녀가 화면 오른쪽 밖으로 잘리던 것) — 왼쪽 끝은 친구들 자리, 선반 위는 호박이 자리
          k.shelfTop = [sx + sw * .9, sy + 12];
          const g0 = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, SG); sprite(T, g0, 'wc_prop_shelf_box', sx, sy, sw, sh);
          const cx = [108, 240, 367, 532, 660, 788].map(v => sx + v * s), cy = [140, 307].map(v => sy + v * s);
          [0, 1, 2].forEach(i => cellsPos.push([cx[i], cy[0]])); [3, 4, 5].forEach(i => cellsPos.push([cx[i], cy[0]]));
          [0, 1, 2].forEach(i => cellsPos.push([cx[i], cy[1]])); [3, 4, 5].forEach(i => cellsPos.push([cx[i], cy[1]]));
        } else {
          const colX = [400, 500, 600], rowY = i => 42 + i * 82;   // 칸을 조금 좁혀 맨 아랫줄이 솥 입을 가리지 않게(2026-10-29 사용자)
          ['r', 'y', 'b', 'g'].forEach((c, ri) => [0, 1, 2].forEach(ci => cellsPos.push([colX[ci], rowY(ri)])));
          cellsPos.forEach(([x, y]) => { const g0 = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, SG); pic(T, g0, 'wc_prop_shelf_cell', x, y, 96, 88); });
        }
        ING.forEach((it, i) => {
          const [cx, cy] = cellsPos[i];
          const g = hitZone(T, SG, cx, cy, P ? 86 : 80, P ? 82 : 84);   // 가로 칸 간격 78~81(화면 1024 폭에서 80px 이상)
          const ig = T.el('g', { 'pointer-events': 'none', filter: 'url(#pp)' }, g); pic(T, ig, ingF(it.id), cx, cy + 4, P ? 66 : 64, P ? 62 : 62);
          if (it.id === 'poo') { pic(T, ig, 'wc_prop_ing_stink', cx - 22, cy - 30, 22, 30); pic(T, ig, 'wc_prop_ing_fly', cx + 26, cy - 30, 22, 22); }   // 응가 칸: 냄새 선·파리(PLAN §10-2)
          k.cells.push({ ...it, el: g, cx, cy });
        });
      } else if (!P && jars) { const g0 = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, T.fx); sprite(T, g0, 'wc_fg_jar_shelf_front', -24, FL - HT.wc_fg_jar_shelf_front + 40, HT.wc_fg_jar_shelf_front * ASP.wc_fg_jar_shelf_front, HT.wc_fg_jar_shelf_front); }   // 선반이 없는 2장만 왼쪽 앞 가림(병 선반)
      /* 국자는 없앴다(2026-10-29 사용자) — 마녀가 마법으로 젓는다 */
      return k;
    }
    /* 솥 물: 흰 판(wc_prop_pot_flat)에 색을 곱해 솥 입에 꼭 맞춘다 */
    const potFlatEl = (parent, color) => { const g = T.el('g', { filter: tintId(T, color) }, parent); sprite(T, g, 'wc_prop_pot_flat', POT.cx - POT.rx, POT.cy - POT.ry, POT.rx * 2, POT.ry * 2); return g; };
    const potFlat = (color, fade = true) => {
      K.lay.innerHTML = ''; K.swirlAnim = null; const e = potFlatEl(K.lay, color); if (fade) e.animate([{ opacity: 0 }, { opacity: 1 }], 500); return e;
    };
    /* 색 띠 회오리(사용자 2026-10-28: 빨강 다음 노랑 = 빨강·노랑이 함께 돌다가 펑 뒤에 결과 색): 첫 색 판 위에 흰 나선 띠(wc_prop_pot_swirl)를
       색마다 한 장씩, 360/n 도씩 어긋나게 겹쳐 솥 입 타원으로 잘라 함께 회전(8초 한 바퀴). 띠마다 단색 */
    function potSwirl(keys) {
      K.lay.innerHTML = '';
      const id = 'wcClip' + Math.random().toString(36).slice(2, 7), cp = T.el('clipPath', { id }, K.lay);
      T.el('ellipse', { cx: POT.cx, cy: POT.cy, rx: POT.rx, ry: POT.ry }, cp);
      const clip = T.el('g', { 'clip-path': `url(#${id})` }, K.lay);
      potFlatEl(clip, COL[keys[0]]);
      const sq = T.el('g', { transform: `translate(${POT.cx} ${POT.cy}) scale(1 ${(POT.ry / POT.rx).toFixed(3)})` }, clip);
      const rot = T.el('g', {}, sq); rot.style.transformBox = 'view-box'; rot.style.transformOrigin = '0 0';
      const R = POT.rx * 1.2, rest = keys.slice(1), n = rest.length;
      rest.forEach((k, i) => {
        const g = T.el('g', { transform: `rotate(${(360 / (n + 1)) * (i + 1)})` }, rot), t = T.el('g', { filter: tintId(T, COL[k]) }, g);
        sprite(T, t, 'wc_prop_pot_swirl', -R, -R, R * 2, R * 2 / ASP.wc_prop_pot_swirl);
      });
      K.swirlAnim = rot.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 8000, iterations: Infinity });
    }
    const potClear = (fade = true) => { K.kinds = []; potFlat(COL.water, fade); };
    function bubbles(on = true) {
      if (!on) { K.bub && K.bub.remove(); return; }
      const g = K.bub = T.el('g', { 'pointer-events': 'none' }, T.world);
      for (let i = 0; i < 4; i++) {
        const c = T.el('g', {}, g); pic(T, c, 'wc_prop_fx_bubble', POT.cx - 36 + i * 24, POT.cy, 12 + (i % 2) * 4);
        c.animate([{ transform: 'translateY(0)', opacity: 0 }, { transform: 'translateY(-24px)', opacity: .9, offset: .5 }, { transform: 'translateY(-44px)', opacity: 0 }], { duration: 1500, iterations: Infinity, delay: -i * 380 });
      }
    }
    /* 펑 연기: 연기 뭉치 그림 1장을 셋으로 복제(PLAN §4-3) + 반짝 */
    async function smoke(big = false) {
      cue('pow', .8) || cue('boom', .6); cue('cymbal', .4); setTimeout(() => cue('sparkle', .6), 200);
      const g = T.el('g', { 'pointer-events': 'none', filter: 'url(#pp)' }, T.fx), k = big ? 1.35 : 1, sh = HT.wc_prop_smoke_puff * k;
      const cs = [[-90, -40, .8], [90, -30, .85], [0, -70, 1], [0, -150, .6]];
      const els = cs.map(([dx, dy, s], i) => { const e = T.el('g', {}, g); pic(T, e, i === 3 ? 'wc_prop_sparkle_pop' : 'wc_prop_smoke_puff', POT.cx + dx * k, POT.cy + dy * k, sh * s * 1.12, sh * s); e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; return e; });
      els.forEach((e, i) => e.animate([{ transform: 'scale(.1)', opacity: 0 }, { transform: 'scale(1)', opacity: 1, offset: .35 }, { transform: 'scale(1.15)', opacity: 1, offset: .7 }, { transform: 'scale(1.3)', opacity: 0 }], { duration: 1500, delay: i * 40 }));
      await sleep(850);
      return () => g.remove();
    }
    /* 재료가 솥으로 날아간다(원래 칸은 그대로): 선반 칸 → 솥 입 포물선 */
    function fly(c) {
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx); const ig = T.el('g', { filter: 'url(#pp)' }, g);
      pic(T, ig, ingF(c.id), 0, 0, 70, 66);
      const x0 = c.cx, y0 = c.cy, x1 = POT.cx + (Math.random() - .5) * POT.rx, y1 = POT.cy;
      const a = g.animate([{ transform: `translate(${x0}px,${y0}px) scale(1)` }, { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 90}px) scale(.9) rotate(180deg)`, offset: .5 }, { transform: `translate(${x1}px,${y1}px) scale(.6)` }], { duration: 650, easing: 'ease-in', fill: 'forwards' });
      return a.finished.then(() => { g.remove(); });
    }
    function plop(c, kindsNow) {
      ingSfx[c.id](); if (c.id === 'lantern') K.lay.animate([{ opacity: 1 }, { opacity: .6 }, { opacity: 1 }], 600);
      const ring = T.el('ellipse', { cx: POT.cx, cy: POT.cy, rx: 10, ry: 4, fill: 'none', stroke: '#F4F6FA', 'stroke-width': 3, 'pointer-events': 'none' }, T.world);
      ring.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(6)', opacity: 0 }], 600).finished.then(() => ring.remove());
      ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = 'center';
    }
    /* 마녀는 국자를 잡지 않고 마법으로 젓는다(2026-10-29 사용자: 젓는 자세와 국자 자리가 너무 달라). 솥 오른쪽에서 두 손을 솥 쪽으로 뻗고
       손끝에서 반짝이가 솥으로 날아간다. 솥에 걸린 국자는 저절로 흔들린다. 새 그림 wc_witch_magic 이 없으면 옛 젓기 자세(stir)로 */
    const MAGIC = () => (artOK.wc_witch_magic ? 'magic' : 'stir');
    let stirStop = null;
    const sparkTo = () => {
      const s = witch.scale, hx = witch.x - witch.w * .42 * s, hy = witch.y - witch.h * .55 * s, tx = POT.cx + (Math.random() - .5) * POT.rx;
      const g = T.el('g', { 'pointer-events': 'none' }, T.fx), ig = T.el('g', { filter: 'url(#pp)' }, g); pic(T, ig, 'wc_prop_sparkle_pop', 0, 0, 34);
      g.animate([{ transform: `translate(${hx}px,${hy}px) scale(.5)`, opacity: 0 }, { opacity: 1, offset: .2 }, { transform: `translate(${(hx + tx) / 2}px,${Math.min(hy, POT.cy) - 50}px) scale(1) rotate(90deg)`, offset: .5 }, { transform: `translate(${tx}px,${POT.cy}px) scale(.4) rotate(180deg)`, opacity: 0 }], { duration: 900, easing: 'ease-in-out' }).finished.then(() => g.remove());
    };
    const stopStir = () => { if (stirStop) { stirStop(); stirStop = null; } };
    const magicStir = () => {
      stopStir();
      witch.look(MAGIC(), 'left'); cue('marimba_2', .4); cue(['harp_gliss', 'shimmer'], .35);
      const lad = K && K.ladle && K.ladle.style.display !== 'none' ? K.ladle.animate([{ rotate: '-12deg' }, { rotate: '12deg' }], { duration: 300, iterations: Infinity, direction: 'alternate' }) : null;
      if (K && K.swirlAnim) K.swirlAnim.updatePlaybackRate(4);
      const ids = []; for (let i = 0; i < 12; i++) ids.push(setTimeout(sparkTo, i * 260));
      stirStop = () => { ids.forEach(clearTimeout); if (lad) lad.cancel(); };
    };
    /* 펑 뒤 사탕: 솥에서 튀어 올라 다현이 손 앞에 내려앉는다(옛 자리는 세로 화면에서 선반 칸 위였다 — 2026-10-29) */
    const candyPop = res => {
      const cand = candyProp(T, res, 70); put(T, cand, POT.cx, POT.cy - 10);
      const kv = shown(kid), kh = HT.wc_kid_stand * kid.scale, side = kid.x < POT.cx ? 1 : -1;
      const tx = kv ? kid.x + side * kh * .16 : POT.cx - X(160, 90), ty = kv ? kid.y - kh * .3 : POT.cy - 60, es = kv ? Math.max(.65, Math.min(1, kid.scale * 1.1)) : 1;
      cand.pos.animate([{ transform: `translate(${POT.cx}px,${POT.cy}px) scale(.3)` }, { transform: `translate(${(POT.cx + tx) / 2}px,${POT.cy - 130}px) scale(1.2)`, offset: .6 }, { transform: `translate(${tx}px,${ty}px) scale(${es})` }], { duration: 900, fill: 'forwards' });
      cue(['pop', 'pop_out'], .6); setTimeout(() => cue('pop', .6), 250);
      return cand;
    };
    /* 결과 알림 줄(2026-10-29 사용자: 색 질문 대신 "빨강이랑 파랑을 섞었더니 보라색이 됐어요"). 녹음 전에는 한 색은 녹음된 옛 줄, 섞은 색은 말풍선만 */
    const ADJ = { r: '빨간', y: '노란', b: '파란', g: '초록' };
    const resultLine = rs => (rs.single ? `${KO[rs.single]}만 넣었더니 ${ADJ[rs.single]} ${RES[rs.res].ko} 사탕이 됐어요!`
      : `${KO[rs.pair[0]]}이랑 ${KO[rs.pair[1]]}을 섞었더니 ${COLOR_KO[rs.color]}${rs.color === 'brown' ? '' : '색'}이 됐어요!`);
    const hasClip = t => { try { return !!((typeof NARRATION_CLIPS_EN !== 'undefined' && NARRATION_CLIPS_EN[t]) || (typeof NARRATION_CLIPS !== 'undefined' && NARRATION_CLIPS[t])); } catch (e) { return false; } };
    const sayResult = async rs => {
      const t = resultLine(rs);
      T.pop(POT.cx, POT.cy - 70, tr(rs.single ? KO[rs.single] : COLOR_KO[rs.color]), COL[rs.color]);
      if (hasClip(t)) return say(t);
      if (rs.single) return say(`${KO[rs.single]}만 넣었으니… ${KO[rs.single]} 그대로!`);
      await T.say(t, { recordedOnly: true, keep: true }); await sleep(Math.min(3600, 1400 + t.length * 60));
    };
    /* 넣은 재료 말하기: voice_script 의 앞 줄(ING_FRONT)·뒤 줄(ING_BACK) 클립을 한 줄로 이어 붙여 재생(글자는 한 문장).
       녹음이 없으면 말풍선만 보이고 넘어간다 */
    const ING_KO = { snot: '아기 용 콧물', firetruck: '빨간 소방차', ladybug: '무당벌레', lantern: '노란 호박 등', fart: '병아리 방귀', duck: '고무 오리', poo: '괴물 응가', fish: '파란 생선', wave: '파란 파도', frog: '초록 개구리', dino: '초록 공룡', leek: '구운 초록 대파' };
    const bat = w => (w.charCodeAt(w.length - 1) - 0xAC00) % 28 !== 0;
    const ingFront = id => ING_KO[id] + (bat(ING_KO[id]) ? '이랑' : '랑');
    const ingBack = id => ING_KO[id] + (bat(ING_KO[id]) ? '을' : '를') + ' 넣었어요!';
    const clipOf = t => { try { return (typeof NARRATION_CLIPS !== 'undefined' && NARRATION_CLIPS[t]) || null; } catch (e) { return null; } };
    const clipEn = t => { try { return (typeof NARRATION_CLIPS_EN !== 'undefined' && NARRATION_CLIPS_EN[t]) || null; } catch (e) { return null; } };
    const sayRec = async (t, ms) => { if (hasClip(t)) return say(t); await T.say(t, { recordedOnly: true, keep: true }); await sleep(ms || Math.min(3600, 1400 + t.length * 60)); };
    const sayIngs = async ids => {
      const uniq = ids.filter((id, i) => ids.indexOf(id) === i);
      const parts = uniq.length > 1 ? [...uniq.slice(0, -1).map(ingFront), ingBack(uniq[uniq.length - 1])] : [ingBack(uniq[0])];
      const text = parts.join(' ');
      const ko = parts.map(clipOf), en = parts.map(clipEn);
      const flat = a => a.flatMap(v => [].concat(v));
      if (ko.every(Boolean) && typeof NARRATION_CLIPS !== 'undefined') NARRATION_CLIPS[text] = flat(ko);
      if (en.every(Boolean) && typeof NARRATION_CLIPS_EN !== 'undefined') { const t = en.map(v => v.t).join(' '); NARRATION_CLIPS_EN[text] = { t: t.charAt(0).toUpperCase() + t.slice(1), c: flat(en.map(v => v.c)) }; }
      await sayRec(text);
    };
    /* 콧물·응가를 넣었을 때만 다현이 으엑(3장에서 옮김): 둘 다 / 콧물만 / 응가만 */
    const yuckFor = async ids => {
      const sn = ids.includes('snot'), po = ids.includes('poo');
      if (!sn && !po) return;
      kid.look('yuck', 'left'); cue('whistle_down', .4);
      await sayRec(sn && po ? S.C3 : sn ? S.C3s : S.C3p, 1600);
      kid.look('stand', 'left');
    };
    /* 진짜 유령(2026-10-29 사용자: '다들 유령 흉내를 내며 도는데 사실 뒤에 진짜 유령이 같이 움직이고 있어'): 행진 줄 맨 뒤에 몰래 붙어
       둥실둥실 따라간다(아이들은 모름, 대사 없음). 그림 그대로(반투명 아님). 마지막 행진 끝에 한 번 뒤돌아보고 뿅 사라진다(효과음만) */
    const ghost = mk(T, { a: ['wc_ghost', HT.wc_ghost] }); hide(ghost);
    let ghostBob = null;
    const ghostJoin = (x, y, s) => {
      put(T, ghost, x, y - 34 * s, { look: 'a', s });
      if (ghostBob) ghostBob.cancel();
      ghostBob = ghost.body.animate([{ translate: '0 0', rotate: '-4deg' }, { translate: '0 -12px', rotate: '4deg' }, { translate: '0 0', rotate: '-4deg' }], { duration: 1400, iterations: Infinity });
      return ghost;
    };
    const ghostBye = async () => {
      if (!shown(ghost)) return;
      await sleep(300);
      cue(['theremin_wobble', 'whistle_wobble'], .45);
      ghost.body.style.transformBox = 'fill-box'; ghost.body.style.transformOrigin = '50% 50%';
      await ghost.body.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(-1)', offset: .3 }, { transform: 'scaleX(-1)', offset: .7 }, { transform: 'scaleX(1)' }], { duration: 1100, easing: 'ease-in-out' }).finished;   // 한 번 뒤돌아보고
      /* 화면 가운데로 다가오며 커지다가 화면 밖으로 나가듯 사라진다(2026-10-29 사용자) */
      if (ghostBob) { ghostBob.cancel(); ghostBob = null; }
      const sc = ghost.scale || 1, tx = P ? VX.lx : 500, ty = P ? FL + (280 - FL) / PS : 280;
      const dx = (tx - ghost.x) / sc, dy = (ty - (ghost.y - ghost.h * sc / 2)) / sc;
      cue('whoosh', .5); cue(['theremin_wobble', 'whistle_wobble'], .4);
      await ghost.body.animate([{ transform: 'translate(0px, 0px) scale(1)', opacity: 1 }, { transform: `translate(${dx * .7}px, ${dy * .7}px) scale(3)`, opacity: 1, offset: .6 }, { transform: `translate(${dx}px, ${dy}px) scale(9)`, opacity: 0 }], { duration: 1300, easing: 'ease-in', fill: 'forwards' }).finished;
      cue('pop', .5); cue('sparkle', .4);
      hide(ghost); ghost.body.getAnimations().forEach(n => n.cancel()); if (ghostBob) { ghostBob.cancel(); ghostBob = null; }
    };
    /* 유령 사탕은 흰 접시 위(PLAN §6 검정 사탕 대비): 솥 위에 접시째 떠오른다 */
    function ghostPlate() {
      const pos = T.el('g', { 'pointer-events': 'none' }, T.world), cx = POT.cx, cy = POT.cy - 70;
      const pg = T.el('g', { filter: 'url(#pp)' }, pos); pic(T, pg, 'wc_prop_plate_white', cx, cy + 10, 170, 100);
      const cg = T.el('g', { filter: 'url(#pp)' }, pos); pic(T, cg, 'wc_prop_candy_ghost', cx, cy - 6, 150, 80);
      return { pos };
    }
    /* 9장 가게 앞: 솥(가운데) 둘레에 여섯. 다현이·친구들은 왼쪽(솥 쪽 = 오른쪽), 마녀·호박이는 오른쪽(왼쪽을 본다) */
    function finaleCast(pose = 'ghost') {
      cast([[witch, X(830, 640), FL, { look: pose === 'ghost' ? 'ghost' : 'stand', to: 'left' }], [cat, X(670, 590), FL, { look: pose === 'ghost' ? 'ghost' : 'sit', to: 'left', s: X(1, .8) }], [kid, X(330, 380), FL, { look: pose === 'ghost' ? 'ghost' : 'stand', to: 'right' }]]);
      FRS.forEach((f, i) => { put(T, f, X(235 - i * 95, 300), FL, { look: pose === 'ghost' ? 'ghost' : 'stand', to: 'right' }); if (P) hide(f); });
    }
    /* 탁자(wc_prop_table) + 재료 넷(7장, 읽어 주기 table:four). 가로: 솥 왼쪽 바닥, 친구들은 탁자 뒤 / 세로: 솥 뒤 먼 바닥(위쪽) */
    function tableFour(items, tapFirst) {
      const tab = T.el('g', {}, T.world), th = HT.wc_prop_table * X(1, .95), tw = th * ASP.wc_prop_table, tx = X(280, 500), ty = X(FL, 350) - th;
      const tg = T.el('g', { filter: 'url(#pp)', 'pointer-events': 'none' }, tab); sprite(T, tg, 'wc_prop_table', tx - tw / 2, ty, tw, th);
      const step = tw * .22, cells = items.map((it, i) => {
        const cx = tx + (i - (items.length - 1) / 2) * step, cy = ty - 26;
        const g = tapFirst ? hitZone(T, tab, cx, cy, H(i === 0 ? 90 : step - 4), H(90)) : T.el('g', { 'pointer-events': 'none' }, tab);
        const ig = T.el('g', { 'pointer-events': 'none', filter: 'url(#pp)' }, g); pic(T, ig, ingF(it.id), cx, cy, step - 8, 60);
        return { ...it, el: g, cx, cy };
      });
      return { tab, cells };
    }
    function setLook() {   // 마녀·호박이·친구들을 부엌 기본 자리에. 세로: 선반이 폭을 다 써서 인물은 솥 양옆 아래로 작게, 호박이·친구들은 화면 밖
      const FY = P ? PFY : FL;
      cast([[witch, X(925, 668), FY, { look: 'present', to: 'left', s: P ? .6 : .85 }], [kid, X(680, 340), FY, { look: 'stand', to: 'left', s: P ? .6 : .85 }]]);
      if (!P) {   // 친구 셋은 선반 왼쪽 끝 바닥(조금 뒤라 .72), 호박이는 선반 위(PLAN §5 7장 '호박이는 선반 위')
        FRS.forEach((f, i) => put(T, f, 5 + i * 50, FL - 14, { look: 'stand', to: 'right', s: .72 }));
        if (K && K.shelfTop) put(T, cat, K.shelfTop[0], K.shelfTop[1], { look: 'sit', to: 'right', s: .85 }); else put(T, cat, 60, FL, { look: 'sit', to: 'right', s: .85 });
      } else { FRS.forEach(hide); put(T, cat, 596, PFY, { look: 'sit', to: 'left', s: .55 }); }   // 세로: 호박이는 솥 오른쪽 앞(마녀 발치) — 3장 '냐… 냄새!' 대사가 있으니 보여야 한다(2026-10-29 사용자)
    }
    /* 컷(그림이 있으면 cutImage, 없으면 자리표시 컷) */
    const cutMock = (label, color = '#F28C28', hold = 2400) => T.cut(svg => {
      T.el('rect', { x: 20, y: 20, width: 360, height: 260, rx: 18, fill: '#1F2A56' }, svg);
      T.el('circle', { cx: 200, cy: 130, r: 70, fill: color }, svg);
      T.el('text', { x: 200, y: 230, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: CREAM, 'font-family': FONT, text: tr('(그림 자리) ' + label) }, svg);
    }, { hold, sfx: () => cue('slide_up', .5) });
    const cutPic = async (id, label, color, hold) => { if (await T.preload(src(id))) await T.cutImage([{ src: src(id), hold: hold || 3600 }]); else await cutMock(label, color, hold ? Math.min(hold, 2400) : 2400); };
    const cutTf = async res => {   // 변신 컷: 공용 틀 + 변신한 다현이 큰 그림 합성(둘 다 있어야 그림, 없으면 자리표시)
      const f = 'wc_cut_tf_frame', b = 'wc_cut_tf_' + (res === 'ghost' ? 'ghost' : res);
      cue(['slide_up'], .6); cue('chime_up', .5);
      if ((await T.preload(src(f))) && (await T.preload(src(b)))) await T.cut(svg => {
        T.el('image', { href: src(f), x: 0, y: 0, width: 400, height: 300 }, svg);
        if (res === 'pumpkin') {   // 호박 배 빛 층(PLAN §9: 빛 층 포함) — 멀수록 흐려지는 빛
          const d = T.el('defs', {}, svg), gr = T.el('radialGradient', { id: 'wcCutGlow' }, d);
          [[0, .85], [.5, .35], [1, 0]].forEach(([o, a]) => T.el('stop', { offset: o, 'stop-color': '#F6D27A', 'stop-opacity': a }, gr));
          T.el('circle', { cx: 200, cy: 185, r: 120, fill: 'url(#wcCutGlow)' }, svg);
        }
        T.el('image', { href: src(b), x: 60, y: 10, width: 280, height: 280, preserveAspectRatio: 'xMidYMid meet' }, svg);
      }, { hold: 2800 });
      else await cutMock('변신 컷: ' + (res === 'ghost' ? '유령' : RES[res].ko), res === 'ghost' ? '#1A1410' : RES[res].plate, 2800);
    };
    const seenKey = 'wc_seen';
    const seenGet = () => { try { return JSON.parse(localStorage.getItem(seenKey) || '[]'); } catch (e) { return []; } };
    const seenAdd = r => { try { const s = seenGet(); if (!s.includes(r)) localStorage.setItem(seenKey, JSON.stringify([...s, r])); } catch (e) { /* */ } };
    const rounds3 = QS.get('rounds') === '3';
    const mixArg = (QS.get('mix') || '').split(',').filter(Boolean);
    const autoMode = T.autoplay() || (() => { try { return window.parent !== window && QS.get('verify') === '1'; } catch (e) { return false; } })();
    const usedIng = new Set();               // 이미 넣은 재료 — 다음 회전 선반에서 빈칸(2026-10-29 사용자)
    const used = [];                         // 지금까지 나온 결과 (자동 재생은 중복 없이)
    let lastRes = '';
    const pickAuto = (round) => {
      if (mixArg[round - 1]) return [...mixArg[round - 1]].map(c => c);
      const seen = seenGet(), all = Object.keys(RES).filter(r => !used.includes(r));
      const fresh = all.filter(r => !seen.includes(r)), pool = fresh.length ? fresh : all;
      const res = pool[Math.floor(Math.random() * pool.length)], cs = comboFor(res), combo = cs[Math.floor(Math.random() * cs.length)];
      return combo;
    };

    /* ================= 읽어 주기 (docs/READ_MODE.md): read_script_el.json 의 동사 → 놀이판 연출을 감싼 얇은 함수 =================
       set(배경) 이 장면을 비우고 배경·솥·선반을 다시 짓는다(인물은 모두 숨김). 뒤이어 enter 동사가 인물을 놓는다.
       T.readInstant() 가 참인 동안(장면 차리기)은 움직임·소리 없이 바로 놓는다. 장면 안에서 길게 도는 것(행진 걸음 소리 등)은 settle() 이 끝낸다.
       세로 화면은 스크립트 x(가로 기준)를 가운데 폭으로 줄여 놓는다. 녹음 클립이 없는 줄은 엔진이 건너뛴다(글자·그림·효과음만 진행). */
    const inst = () => T.readInstant();
    const rs = { bg: '', stops: [], tab: {}, jar: null };
    const PX = x => (P ? Math.max(335, Math.min(665, 500 + (x - 500) * .45)) : x);
    const inKit = () => rs.bg === 'wc_bg_kitchen';
    const ROLE = { kid, witch, cat };
    const stand = { kid: 'stand', witch: 'stand', cat: 'sit', friend: 'stand' };
    const rdir = (a, who, pose) => {   // 시선: 선반·재료 쪽(왼쪽)을 보는 자세는 왼쪽, 아니면 다현이(마녀·호박이·친구들) / 마녀(다현이) 쪽, 가게 밖은 오른쪽
      if (who === 'kid') return /reach|point|yuck/.test(pose) ? 'left' : (inKit() && witch.pos.style.display !== 'none' ? (witch.x > kid.x ? 'right' : 'left') : 'right');
      if (who === 'witch') return 'left';   // 마녀는 늘 솥·아이들의 오른쪽(젓기도 솥 쪽 = 왼쪽)
      return kid.x > a.x ? 'right' : 'left';
    };
    /* 읽어 주기 자리(2026-10-29 그림 반영): 대본의 x 는 그림 전 자리표시 기준이라, 놀이판과 같은 자리로 옮겨 놓는다(겹침·누르는 대상 가림 방지).
       부엌: 선반이 보이면 선반 장면(4장) 자리, 탁자(7장)가 있으면 탁자 장면 자리, 아니면 2장 자리. 지붕(달밤)은 다현이·마녀만. 그 밖은 대본 x */
    const layoutFor = (a, x, fi) => {
      const kidS = inKit() ? X(.85, .6) : 1;
      if (inKit()) {
        if (P) { if (a === kid) return [340, PFY, .6]; if (a === witch) return [668, PFY, .6]; if (a === cat) return [596, PFY, .55]; return null; }
        const shelfOn = K && K.shelfG && K.shelfG.style.display !== 'none', tab = !!rs.tabG;
        if (a === witch) return [925, FL, .85];
        if (shelfOn) { if (a === kid) return [680, FL, kidS]; if (a === cat) return K.shelfTop ? [K.shelfTop[0], K.shelfTop[1], .85] : [60, FL, .85]; return [5 + fi * 50, FL - 14, .72]; }
        if (tab) { if (a === kid) return [570, FL, kidS]; if (a === cat) return [50, FL, .9]; return [190 + fi * 100, FL - 40, .8]; }
        if (a === kid) return [500, FL, kidS]; if (a === cat) return [680, FL, .85]; return [200 + fi * 95, FL, .85];
      }
      if (rs.bg === 'wc_bg_rooftops_lb' && a !== kid && a !== witch) return null;
      if (rs.bg === 'wc_bg_rooftops_lb' && a === witch) return [X(900, 650), FL, .7];
      if (!P && fi >= 0) return [rs.bg === 'wc_bg_street' ? [370, 260, 150][fi] : 290 - fi * 100, FL, 1];   // 친구 셋: 다현이 왼쪽에 한 줄(놀이판 1장과 같은 크기)
      if (P && fi >= 0) return rs.bg === 'wc_bg_street' ? [[470, 385, 300][fi], FL, 1] : null;   // 세로: 거리에서만 친구들(놀이판 1장과 같게)
      return [PX(x), FL, 1];
    };
    const showA = (a, x, fi = -1) => { const L = layoutFor(a, x, fi); if (!L) { hide(a); return; } put(T, a, L[0], L[1], { s: L[2] }); if (rs.tabG) T.world.appendChild(rs.tabG); };
    const lookA = (a, who, pose, dir) => { a.look(pose, dir || rdir(a, who, pose)); };
    const ATM = (who, a) => (cmd, arg, arg2) => {
      if (cmd === 'look') { if (who === 'witch' && arg === 'stir') { if (inst()) witch.look(MAGIC(), 'left'); else magicStir(); return null; } stopStir(); const pose = arg === 'stand' ? stand[who] : arg; lookA(a, who, pose, arg2); }
      else if (cmd === 'at') showA(a, +String(arg).split(',')[0]);
      else if (cmd === 'hop') { if (!inst()) { a.hop(14, 320); cue('pop', .4); return sleep(340); } }
      else if (cmd === 'front') { const k = { kid: 'yum', witch: 'surprise', cat: 'reach' }[who]; lookA(a, who, k, 'left'); if (who === 'kid' && rs.cand) { hide(rs.cand); rs.cand = null; } }   // 사탕을 먹었다
      else if (cmd === 'hat_pop') { if (!inst()) { a.hop(18, 360); cue('slide_up', .5); cue('pop', .5); T.pop(a.x, FL - a.h - 20, tr('뿅!'), '#7A5AA6'); return sleep(400); } }
      else if (cmd === 'march') { if (!inst()) return marchOnce([a], 1800); }
      return null;
    };
    const stepTimer = () => { const id = setInterval(() => cue('step_wood', .25), 500); rs.stops.push(() => clearInterval(id)); return () => clearInterval(id); };
    async function marchOnce(list, ms) {
      const st = stepTimer(); cue(['theremin_wobble', 'whistle_wobble'], .35);
      await Promise.all(list.map((a, i) => a.move(Math.min(a.x + (P ? 120 : 380), 960), a.y, ms, 'linear'))); st();
    }
    const TFPOSE = { strawberry: 'tf_strawberry', duck: 'tf_duck', fish: 'tf_fish', frog: 'tf_frog_jump', kiwi: 'tf_kiwi', croc: 'tf_croc', pumpkin: 'tf_pumpkin', bat: 'tf_bat_up', choco: 'tf_choco', none: 'stand' };
    /* 변신 동작 한 바퀴(PLAN §4-2). short 는 4~5초. 한 동사 8초 제한 안에 끝낸다 */
    async function tfMotion(res, short) {
      const ms = short ? 3600 : 6200, x0 = kid.x, y0 = kid.y, run = Math.min(P ? 90 : 260, 960 - x0);
      cue('pop', .6);
      if (res === 'strawberry') {
        kid.look('tf_strawberry_ball', 'right'); kid.body.style.transformOrigin = `0 ${-HT.wc_kid_tf_strawberry_ball / 2}px`; kid.body.style.transformBox = 'view-box';
        const sp = kid.body.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(720deg)' }], { duration: ms, easing: 'linear' });
        const st = stepTimer(); await kid.move(x0 + run, y0, ms * .75, 'linear'); st(); cue('bonk', .6) || cue('pop', .6); T.pop(kid.x + 30, FL - 140, tr('통!'), '#E04B3C');
        await kid.move(x0, y0, ms * .25, 'ease-out'); sp.cancel(); kid.look('tf_strawberry', 'right');
      } else if (res === 'duck') {
        kid.look('tf_duck', 'right'); cue('animals/duck', .7); const w = kid.body.animate([{ transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }], { duration: 450, iterations: Infinity, direction: 'alternate' });
        const w2 = cat.pos.style.display !== 'none' ? cat.body.animate([{ transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }], { duration: 450, iterations: Infinity, direction: 'alternate' }) : null;
        await Promise.all([kid.move(x0 + run, y0, ms, 'linear'), cat.pos.style.display !== 'none' ? cat.move(cat.x + run * .8, cat.y, ms, 'linear') : sleep(ms)]); w.cancel(); if (w2) w2.cancel();
      } else if (res === 'fish' || res === 'bat') {
        kid.look(res === 'fish' ? 'tf_fish' : 'tf_bat_up', 'right'); cue(res === 'fish' ? 'harp_gliss' : 'wing_flap_1', .5);
        const fl = res === 'bat' ? setInterval(() => kid.look(kid.cur === 'tf_bat_up' ? 'tf_bat_down' : 'tf_bat_up', 'right'), 300) : 0; rs.stops.push(() => clearInterval(fl));
        await kid.move(x0 + run * .5, FL - 200, ms / 2, 'ease-in-out'); await kid.move(x0 + run, FL - 140, ms / 2, 'ease-in-out'); if (fl) clearInterval(fl);
      } else if (res === 'frog') {
        kid.look('tf_frog_jump', 'right'); cue('animals/frog', .7);
        for (let i = 0; i < 3; i++) { cue('spring', .5) || cue('hop', .5); await kid.move(x0 + (i + 1) * (run / 3), FL - (i + 1) * 50, 400, 'ease-out'); cue('thud', .3); }
        kid.look('tf_frog_sit', 'front'); kid.hop(10, 300); await sleep(short ? 500 : 1200); kid.look('tf_frog_jump', 'right'); await kid.move(x0, y0, 500, 'ease-in');
      } else if (res === 'kiwi') {
        kid.look('tf_kiwi', 'front'); cue('giggle_xylo', .5);
        for (let i = 0; i < 4; i++) { cue('boing', .5) || cue('hop', .5); await kid.move(x0 + (i + 1) * (run / 4), FL - 70, 260, 'ease-out'); await kid.move(kid.x, y0, 260, 'ease-in'); }
        await kid.move(x0, y0, 500, 'ease-in-out');
      } else if (res === 'croc') {
        kid.look('tf_croc', 'right'); const cr = kid.body.animate([{ transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }], { duration: 380, iterations: Infinity, direction: 'alternate' });
        const st = stepTimer(); await kid.move(x0 + run * .7, y0, ms * .6, 'linear'); st(); cr.cancel();
        cue('chomp', .7); T.pop(kid.x + 40, FL - 160, tr('앙!'), '#3F6B4F'); if (shown(cat)) cat.hop(30, 360); await sleep(700); await kid.move(x0, y0, 600, 'ease-in-out');
      } else if (res === 'pumpkin') {
        kid.look('tf_pumpkin', 'front'); cue('shimmer', .6);
        const gl = glow(T, T.world, kid.x, FL - 90, 190); T.world.insertBefore(gl, kid.pos); gl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: 'forwards' });
        FRS.forEach(f => f.hop(10, 300)); await sleep(ms - 600);
      } else if (res === 'choco') {
        kid.look('tf_choco', 'left'); cue('slide_down', .6); await sleep(500); kid.look('tf_choco_flat', 'left'); cue('squelch', .5); T.pop(kid.x, FL - 120, tr('주르륵…'), '#6B4A32'); await sleep(ms / 2); kid.look('tf_choco', 'left');
      }
    }
    const COLK = { red: 'r', yellow: 'y', blue: 'b', green: 'g' };
    const PLATE = { red: COL.r, yellow: COL.y, blue: COL.b, green: COL.green, teal: COL.teal, lime: COL.lime, orange: COL.orange, purple: COL.purple, brown: COL.brown, black: COL.black };
    const cellOf = id => { const c = K.cells.find(x => x.id === id); const t = rs.tab[id]; return t ? { ...c, cx: t[0], cy: t[1] } : c; };
    const READ_ACTS = {
      set(bg) {
        rs.bg = bg; rs.stops.forEach(f => f()); rs.stops = []; rs.tab = {}; rs.tabG = null; K = null; stopStir(); rs.cand = null; hide(ghost);
        if (bg === 'wc_bg_kitchen') { K = kitchen({ shelf: true, ladle: true }); K.shelfG.style.display = 'none'; potClear(false); }
        else {
          T.clear(); bgImage(T, bg); setView(500);
          if (bg === 'wc_bg_street') [[130, 400], [820, 380], [560, 410]].forEach(([x, y]) => { const l = prop(T, 'wc_prop_pumpkin_lantern'); put(T, l, PX(x), y, {}); });
        }
        const wasGhost = kid.cur === 'ghost' && kid.pos.style.display !== 'none';
        ALL.forEach(a => { hide(a); a.setScale(1); });
        if (wasGhost && bg === 'wc_bg_street') {   // 8장 행진: 대본에 자리가 없어 거리에 아무도 없던 것(2026-10-29 고침) — 여섯이 유령 걸음 한 줄로 지나간다
          const L = [kid, witch, cat, ...FRS];
          L.forEach((a, i) => { put(T, a, X(80, 300) - i * X(70, 40), FL, { look: 'ghost', to: 'right', s: X(.9, .7) }); if (P && FRS.includes(a)) hide(a); });
          { const vis = L.filter(a => a.pos.style.display !== 'none'), last = vis.reduce((m, a) => (a.x < m.x ? a : m)); ghostJoin(last.x - X(90, 50), FL, X(.9, .7)); }   // 맨 뒤(보이는 마지막 사람 뒤) 진짜 유령, 대사 없음
          if (!inst()) return marchOnce([...L.filter(a => a.pos.style.display !== 'none'), ghost], 3200).then(ghostBye);
        }
        return null;
      },
      cam(k) { if (P) { T.camSnap(500, 280, 1); return null; } const t = { wide: [500, 280, 1], shelf: [430, 320, 1.2], pot: [660, 300, 1.1], moon: [650, 200, 1.1] }[k] || [500, 280, 1]; if (inst()) { T.camSnap(...t); return null; } return T.camTo(t[0], t[1], t[2], 700); },
      kid: ATM('kid', kid), witch: ATM('witch', witch), cat: ATM('cat', cat),
      friends(cmd, arg, arg2) {
        if (cmd === 'at') String(arg).split(',').forEach((x, i) => { showA(FRS[i], +x, i); lookA(FRS[i], 'friend', stand.friend); });
        else if (cmd === 'hop') { if (!inst()) { FRS.forEach(f => f.hop(12, 320)); cue('pop', .4); return sleep(340); } }
        else if (cmd === 'look') FRS.forEach(f => lookA(f, 'friend', arg === 'stand' ? 'stand' : arg));
        return null;
      },
      all(cmd, arg) {
        const L = [[kid, 'kid'], [witch, 'witch'], [cat, 'cat'], ...FRS.map(f => [f, 'friend'])];
        if ((cmd === 'look' || cmd === 'front') && L.every(([a]) => a.pos.style.display === 'none') && rs.bg === 'wc_bg_shop_front') finaleCast();   // 8장 끝·9장: 대본에 자리가 없어 아무도 안 보이던 것(2026-10-29 고침)
        if (cmd === 'look') L.forEach(([a, w]) => { if (a.pos.style.display !== 'none') lookA(a, w, arg === 'ghost' ? 'ghost' : stand[w]); });
        else if (cmd === 'front') L.forEach(([a, w]) => { if (a.pos.style.display === 'none') return; const k = { kid: 'yum', witch: 'surprise', cat: 'sit', friend: 'happy' }[w]; lookA(a, w, k, w === 'cat' || w === 'witch' ? 'left' : 'right'); });
        else if (cmd === 'hop') { if (!inst()) { L.forEach(([a]) => a.hop(16, 340)); cue('pop', .5); return sleep(360); } }
        else if (cmd === 'walk' || cmd === 'march') {
          if (inst()) return null;
          const vis = L.map(x => x[0]).filter(a => a.pos.style.display !== 'none');
          if (cmd === 'march' && inKit() && vis.length) { const last = vis.reduce((m, a) => (a.x < m.x ? a : m)); ghostJoin(last.x - X(90, 50), last.y, last.scale); fadeIn(ghost, 600); vis.push(ghost); }   // 부엌 행진: 맨 뒤 진짜 유령
          return marchOnce(vis, cmd === 'march' ? 3200 : 2200);
        }
        return null;
      },
      invites(cmd) {
        if (cmd !== 'fly' || inst()) return null;
        cue('paper_turn', .6); cue('wing_flap_2', .3);
        const tg = [kid, ...FRS], ps = [0, 1, 2, 3].map(i => { const a = prop(T, 'wc_prop_invite'); put(T, a, -50, 150 + i * 30); return a; });
        return Promise.all(ps.map((a, i) => sleep(i * 400).then(async () => { await a.move(tg[i].x + 30, FL - 96, 2000, 'ease-in-out'); cue('ding_glock', .5); a.hop(10, 300); })));
      },
      shop(cmd) { if (cmd === 'light' && !inst()) { cue('harp_gliss_2', .5) || cue('xylo_up', .5); const g = glow(T, T.bg, PX(960), 290, 110, '#F6D27A', .9); g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: 'forwards' }); return sleep(800); } return null; },
      fire(cmd) { if (cmd === 'light' && K) { lit = true; K.flameS.style.display = 'none'; K.flameB.style.display = ''; if (!inst()) { cue('knock', .6); cue('fire_crackle', .7); cue('whoosh', .5); T.pop(POT.cx, POT.cy + 20, tr('화르륵!'), '#E8703A'); return sleep(800); } } return null; },
      shelf(cmd, cols) {
        if (!K) return null;
        if (cmd === 'show') { K.shelfG.style.display = ''; if (!inst()) { cue('rattle', .4); return sleep(300); } }
        else if (cmd === 'point' && !inst()) { const ks = String(cols).split(',').map(c => COLK[c]); K.cells.filter(c => ks.includes(c.key)).forEach(c => bob(c.el)); return sleep(900); }
        return null;
      },
      ladle() { return null; },   // 국자 없음
      table(cmd) {
        if (cmd !== 'four') return null;
        const tf = tableFour(['snot', 'fart', 'poo'].map(id => ING.find(i => i.id === id)), false); rs.tabG = tf.tab;
        tf.cells.forEach(c => { rs.tab[c.id] = [c.cx, c.cy]; });
        return null;
      },
      pot(cmd, arg) {
        if (cmd === 'outside') {   // 9장: 가게 앞에 끌어낸 솥 (가게 앞 장면은 K 가 없어 먼저 처리 — 2026-10-29 고침: 솥이 안 보이던 것)
          potAt(500, X(FL + 10, FL + 10));
          K = { lay: T.el('g', { 'pointer-events': 'none' }, T.world), cells: [], kinds: [] }; potDraw(T.world); T.world.appendChild(K.lay); potFlatEl(K.lay, COL.black);
          return null;
        }
        if (!K) return null;
        if (cmd === 'clear') { potClear(false); K.bub && K.bub.remove(); bubbles(); if (!inst()) cue('rattle', .4); }
        else if (cmd === 'boil') { bubbles(); if (!inst()) amb('pot_boil', .2, 4); }
        else if (cmd === 'swirl') { const ks = [...new Set(String(arg).split(',').map(c => COLK[c]))]; if (ks.length === 1) potFlat(COL[ks[0]], !inst()); else potSwirl(ks); if (!inst()) cue(['whistle_up', 'xylo_up'], .35); }
        else if (cmd === 'drop') {
          if (inst()) return null;
          return (async () => { for (const id of String(arg).split(',')) { const c = cellOf(id); kid.hop(6, 260); await fly(c); plop(c); await sleep(450); } })();
        }
        else if (cmd === 'pop') { stopStir(); if (inst()) { potFlat(PLATE[arg], false); return null; } return (async () => { const clr = await smoke(); potFlat(PLATE[arg], false); clr(); })(); }
        else if (cmd === 'bigpop') { stopStir(); if (inst()) { potFlat(COL.black, false); return null; } return (async () => { const clr = await smoke(true); potFlat(COL.black, false); clr(); })(); }
        else if (cmd === 'outside') {   // 9장: 가게 앞에 끌어낸 솥
          potAt(500, X(FL + 10, FL + 10));
          K = { lay: T.el('g', { 'pointer-events': 'none' }, T.world), cells: [], kinds: [] }; potDraw(T.world); T.world.appendChild(K.lay); potFlatEl(K.lay, COL.black);
        }
        return null;
      },
      candy(cmd, arg) {
        if (cmd === 'jar') {
          if (inst() || !K) return null;
          if (rs.cand) hide(rs.cand);
          const cand = rs.cand = candyPop(arg);   // 다현이 손 앞에 내려앉고, 먹는 줄(kid:front)·장면 끝에서 치운다
          return sleep(1000);
        }
        if (cmd === 'plate') { const gc = ghostPlate(); if (!inst()) { cue('harp_gliss', .6); cue('chime_up', .5); fadeIn(gc, 600); } return null; }
        if (cmd === 'pour') {
          if (inst() || !K) return null;
          cue('magic_wand', .5);
          for (let i = 0; i < 9; i++) { const a = candyProp(T, CANDY[i], 56); put(T, a, POT.cx, POT.cy); const tx = POT.cx - 160 + i * 40, ty = FL + 10 - (i % 3) * 8; a.pos.animate([{ transform: `translate(${POT.cx}px,${POT.cy}px)` }, { transform: `translate(${(POT.cx + tx) / 2}px,${POT.cy - 150}px)`, offset: .5 }, { transform: `translate(${tx}px,${ty}px)` }], { duration: 700, delay: i * 110, fill: 'forwards', easing: 'ease-in' }); setTimeout(() => cue('pop', .5), i * 110 + 400); }
          cue('rattle', .5); return sleep(1500);
        }
        return null;
      },
      cut(id) {
        if (inst()) return null;
        if (id === 'gather') return cutPic('wc_cut_gather', '문 앞에 모인 친구들', '#F2B366');
        if (id === 'parade') return cutPic('wc_cut_parade', '한 줄 유령 행진', '#1A1410');
        if (id === 'all_transform') return cutPic('wc_cut_all_transform', '여섯이 한꺼번에 여덟 가지 변신', '#F28C28', 4000);
        const m = /^tf_(.+)$/.exec(id); if (m) return cutTf(m[1]);
        return null;
      },
      confetti() { if (!inst()) { T.confetti(); cue('party_horn', .8) || cue('tada', .6); cue('shimmer', .5); } return null; },
      settle() { stopStir(); if (rs.cand) { hide(rs.cand); rs.cand = null; } rs.stops.forEach(f => f()); rs.stops = []; ALL.forEach(a => { try { a.body.getAnimations().forEach(n => n.cancel()); } catch (e) { /* */ } }); return null; },
    };
    /* kid:tf:<변신|none> (자세 교체 + 반짝) · kid:act:<변신>[:short] (동작 한 바퀴) 는 kid 동사에 이어 붙인다 */
    const kidBase = READ_ACTS.kid;
    READ_ACTS.kid = (cmd, a, b) => {
      if (cmd === 'tf') { kid.look(TFPOSE[a] || 'stand', /pumpkin|strawberry$|choco|frog_sit|kiwi/.test(TFPOSE[a] || '') ? 'front' : 'right'); kid.pos.style.opacity = ''; if (!inst() && a !== 'none') { cue('slide_up', .5); cue('chime_up', .5); T.pop(kid.x, FL - 220, tr('뿅!'), '#F28C28'); return sleep(500); } if (!inst() && a === 'none') { cue('slide_up', .5); cue('sparkle', .6); return sleep(300); } return null; }
      if (cmd === 'act') return inst() ? null : tfMotion(a, b === 'short');
      if (cmd === 'march') { kid.look('ghost', 'right'); if (!inst()) { kid.hop(10, 300); cue(['theremin_wobble', 'whistle_wobble'], .4); } return null; }
      return kidBase(cmd, a, b);
    };
    /* 같은 배경이 이어지는 장면(부엌 → 부엌: 1장 끝 → 재료 선반 → 솥에 퐁퐁 → 초콜릿 변신 → 다른 색으로 → 다 넣어요 → 유령 사탕)은
       책장을 넘기지 않는다(2026-10-29 사용자, 유니콘 10f0cfa0 방식). 엔진 readPlay 는 장면마다 this.sceneCard 를 부르므로 감싼 T(RW)를 넘긴다.
       몇 번째 장면 넘김인지 세어, 엔진과 같은 규칙(회전 결과 window.__READ.chosen)으로 거른 대본에서 다음 장면 배경(set)을 찾는다 */
    /* 배경 음악: 「산왕의 궁전에서」 오르골(픽사베이, sounds/CREDITS.md) — 놀이·읽어 주기 내내 작게 되풀이(2026-10-29 사용자) */
    const BGM = 'mountain_king_box';
    AudioFX.preloadMusic([BGM]);
    let bgmOn = true, bgmH = null;
    const bgmLoop = () => { if (!bgmOn) return; bgmH = AudioFX.music(BGM, { vol: .16, fade: .8 }); if (!bgmH) { setTimeout(bgmLoop, 800); return; } bgmH.done.then(() => { bgmH = null; bgmLoop(); }); };
    const bgmStop = () => { bgmOn = false; if (bgmH) bgmH.stop(1.5); };

    if (T.reading()) {
      const en = (() => { try { return typeof englishOn === 'function' && englishOn(); } catch (e) { return false; } })();
      const getJ = f => fetch(f, { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).catch(() => null);
      const sc = (en && await getJ('read_script_en.json')) || await getJ('read_script_el.json');
      let list = null, idx = 0;
      const RW = Object.create(T);
      RW.sceneCard = (label, change, focus) => {
        idx++;
        if (!list && sc && Array.isArray(sc.scenes)) { const ch = (window.__READ && window.__READ.chosen) || []; list = sc.scenes.filter(x => !x.variant || x.variant === ch[(x.round || 1) - 1]); }
        const nx = list && list[idx];
        if (nx && nx.set && nx.set === curBg && !document.hidden) return cont(change);
        return T.sceneCard(label, change, focus);
      };
      bgmLoop();
      try { return await T.readPlay.call(RW, READ_ACTS); } finally { bgmStop(); }
    }

    /* ================= 1. 초대장 ================= */
    const street = () => {
      T.clear(); bgImage(T, 'wc_bg_street'); setView(500);
      [[130, 400], [820, 380], [560, 410]].forEach(([x, y]) => { const l = prop(T, 'wc_prop_pumpkin_lantern'); put(T, l, x, y, {}); });
      cast([[kid, X(520, 560), FL, { look: 'stand', to: 'right' }], [fr.rabbit, X(400, 470), FL, { look: 'stand', to: 'right' }], [fr.bear, X(285, 385), FL, { look: 'stand', to: 'right' }], [fr.fox, X(170, 300), FL, { look: 'stand', to: 'right' }]]);   // 모두 오른쪽(거리 끝 가게) — 세로는 좁아 겹쳐 선다
      hide(witch); hide(cat);
    };
    street();
    await T.curtain(true);
    bgmLoop();
    amb('winter_wind_1', .15, 4);
    const sayA1 = say(S.A1);
    const invs = [0, 1, 2, 3].map(i => { const a = prop(T, 'wc_prop_invite'); put(T, a, -50, 150 + i * 30); return a; });
    cue('paper_turn', .6); cue('wing_flap_2', .3);
    invs.forEach((a, i) => { const tx = [kid, fr.rabbit, fr.bear, fr.fox][i]; setTimeout(async () => { await a.move(tx.x + (tx === kid ? 34 : 30), FL - 96, 2400, 'ease-in-out'); cue('ding_glock', .5); a.hop(10, 300); }, i * 500); });
    await sayA1;
    await sleep(2000);
    kid.look('stand', 'right'); kid.hop(8, 300);
    await say(S.A2);
    FRS.forEach(f => f.hop(10, 320)); cue('ding_glock_2', .4); await sleep(700);   // 친구들 '우와!' 대사는 뺌(2026-10-29 사용자) — 통통 뛰기만
    cue('harp_gliss_2', .5) || cue('xylo_up', .5);
    { const g = glow(T, T.bg, X(960, 700), 290, 110, '#F6D27A', .9); g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: 'forwards' }); }   // 거리 끝 가게 창 불빛(빛 층)
    await say(S.A4);
    await T.sceneCard(tr('초대장이 날아왔어요'), () => {
      T.clear(); bgImage(T, 'wc_bg_shop_front'); setView(500);
      cast([[witch, X(770, 620), FL, { look: 'stand', to: 'left' }], [cat, X(590, 540), FL, { look: 'sit', to: 'left' }], [kid, X(400, 400), FL, { look: 'stand', to: 'right' }]]);
      FRS.forEach((f, i) => put(T, f, X(290 - i * 100, 300), FL, { look: 'stand', to: 'right' }));
      if (P) FRS.forEach(hide);
    }, kid.pos);
    cue('whistle_up', .5); witch.hop(8, 300);
    await say(S.A5);
    await cutPic('wc_cut_gather', '문 앞에 모인 친구들', '#F2B366');
    cue('bell', .5);
    await say(S.A6);
    await sleep(1200);

    /* ================= 2. 솥 끓이기 (재미 톡: 장작) ================= */
    lit = false;
    await T.sceneCard(tr('뽀글뽀글 솥을 끓여요'), () => {
      K = kitchen({ shelf: false, ladle: false, jars: true }); setLook();
      if (!P) {   // 2장: 아이들은 왼쪽에 모여 구경(솥 쪽 = 오른쪽), 호박이는 장작 옆에서 앞발로 장작을 가리킴(PLAN §5 2장)
        FRS.forEach((f, i) => put(T, f, 200 + i * 95, FL, { look: 'stand', to: 'right', s: .85 }));
        put(T, kid, 500, FL, { look: 'stand', to: 'right', s: .85 }); put(T, cat, 680, FL, { look: 'reach', to: 'right', s: .85 });
      } else put(T, kid, 340, PFY, { look: 'stand', to: 'right', s: .6 });
    });
    potClear(false);
    await say(S.B1);
    const gl = K.wood.animate([{ translate: '0 0' }, { translate: '0 -6px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity });
    K.flameS.style.display = '';
    kid.look('point', 'right');   // 다현이 → 장작(PLAN §5 2장 시선)
    await T.ask(S.B2, () => T.tap(K.wood, { prompt: S.B2 }));
    gl.cancel(); kid.look('stand', 'right');
    cue('knock', .6); lit = true; K.flameS.style.display = 'none'; K.flameB.style.display = '';
    cue('fire_crackle', .7); cue('whoosh', .5); T.pop(K.wood.getBBox ? POT.cx : POT.cx, POT.cy + 20, tr('화르륵!'), '#E8703A');
    bubbles(); amb('pot_boil', .2, 6);
    await say(S.B3);
    cat.hop(8, 300); await say(S.B4);   // 효과음 고양이·말풍선 '냐옹!'은 뺐다 — 녹음 '냐옹!'과 겹쳐 두 번 울렸다(2026-10-29)
    FRS.forEach(f => f.hop(8, 300)); cue('pop', .4); await sleep(600);   // 친구들 '뽀글뽀글!' 뺌
    await sleep(1200);

    /* ================= 3. 재료 선반 ================= */
    await next(tr('으엑, 이게 재료라고?'), 'wc_bg_kitchen', () => { K = kitchen({ shelf: true, ladle: true }); setLook(); potClear(false); bubbles(); });   // 같은 부엌: 넘김 없이 선반이 나타나고 모두 제자리로
    cue('rattle', .4); witch.hop(8, 300);
    /* 재료 설명(C1·C2)과 다현이 "으엑! 콧물이랑 응가요?"는 3장에서 뺐다(2026-10-29 사용자) — 4장에서 넣은 재료를 말하고, 콧물·응가를 넣었을 때만 으엑 */
    cat.look('nose', 'left'); await say(S.C4);
    kid.look('stand', 'left'); witch.look('giggle', 'left'); cue('giggle_xylo', .5);
    await say(S.C5);
    kid.hop(10, 300); cue('ding_glock', .5); await say(S.C6);
    FRS.forEach(f => f.hop(10, 300)); cue('pop', .4); await sleep(500);   // 친구들 '나도!' 뺌
    await sleep(600);

    /* ================= 4·5·6 회전 블록 ================= */
    const ROUNDS_MAX = 3;
    let round = 0, again = true;
    while (again && round < ROUNDS_MAX) {
      round++;
      const first = round === 1;
      if (!first) cue('rattle', .3);   // 같은 부엌(3장·변신 뒤 돌아온 부엌)에서 그대로 이어 간다 — 옛 '솥에 퐁퐁' 넘김 없앰
      if (!first) { witch.look('present', 'left'); kid.look('stand', 'left'); }
      /* ---- 4. 솥에 퐁퐁 (fill) ---- */
      if (!first) { await say(S.R2); }
      else await say(S.D1);
      const bigAsk = first ? S.D2 : S.R2a;
      kid.look('reach', 'left');
      K.cells.forEach(c => { if (usedIng.has(c.id)) c.el.style.visibility = 'hidden'; });
      const cells = K.cells.filter(c => !usedIng.has(c.id));
      cells.forEach(c => bob(c.el));
      const landing = [];                    // 날아가는 재료(솥에 닿아야 색이 바뀐다) — 젓기 전에 다 닿기를 기다린다
      /* 재료 두 개를 넣으면 저절로 끝(2026-10-29 사용자: '넣고 국자 누르는게 어려워'). 하나만 넣고 9초 더 안 넣으면 그 하나로 */
      const result = await T.ask(bigAsk, () => T.fill(cells, {
        maxKinds: 2, maxCount: 2, idleDone: 9000, prompt: bigAsk,
        allow: (c, st) => !st.order.includes(c),   // 같은 재료는 두 번 못 넣는다(2026-10-30 사용자)
        onPut: async (c, n) => {
          kid.hop(6, 260); c.el.style.visibility = 'hidden';   // 넣은 재료는 선반에서 바로 사라진다(2026-10-30 사용자)
          landing.push(fly(c).then(() => {
            plop(c);
            if (!K.kinds.includes(c.key)) { K.kinds.push(c.key); if (K.kinds.length === 1) { potFlat(COL[c.key]); cue('rattle', .4) || cue('pop', .3); } else { potSwirl(K.kinds); cue(['whistle_up', 'xylo_up'], .35); } }
            else T.pop(POT.cx, POT.cy - 20, tr('퐁!'), '#3E7CB1');
            count(Math.min(n, 5));
          }));
        },
        onReject: async c => { cue('doop', .4) || cue('pop', .3); c.el.animate([{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360); },
        /* 자동 재생: 늘 두 개(한 색이면 같은 색 재료 둘 — 빨강 둘 = 딸기) */
        auto: () => { const ks = pickAuto(round), ids = []; (ks.length === 1 ? [ks[0], ks[0]] : ks).forEach(k => { const c = ING.filter(i => i.key === k && !ids.includes(i.id)); const f = c.filter(i => !usedIng.has(i.id)), pool = f.length ? f : c; ids.push(pool[Math.floor(Math.random() * pool.length)].id); }); return ids.map(id => K.cells.find(c => c.id === id)); },
      }));
      K.cells.forEach(c => { c.el.classList.remove('tap-target'); });
      result.order.forEach(c => usedIng.add(c.id));
      await Promise.all(landing); await sleep(350);
      const kinds = result.kinds, rs = resultOf(kinds), resKo = RES[rs.res].ko;
      kid.look('stand', 'left');
      /* 넣은 재료를 말한다(2026-10-29 사용자): 재료별 앞 클립 "아기 용 콧물이랑" + 뒤 클립 "빨간 소방차를 넣었어요!"를 이어서. 하나·같은 것 둘이면 뒤 클립만 */
      await sayIngs(result.order.map(c => c.id));
      await yuckFor(result.order.map(c => c.id));
      /* ---- 5. 저어서 펑! (색 고르기 질문은 2026-10-29 사용자 결정으로 뺌: 너무 어렵다) ---- */
      await say(S.D4);
      magicStir();
      await say(S.E1);
      stopStir();
      witch.look('surprise', 'front');
      const clearSmoke = await smoke();
      potFlat(COL[rs.color] || RES[rs.res].plate, false);
      const cand = candyPop(rs.res);
      clearSmoke(); K.bub && K.bub.remove(); bubbles();
      await say(S.E2);
      await sayResult(rs);                       // "빨강이랑 파랑을 섞었더니 보라색이 됐어요!" / "빨강만 넣었더니 빨간 딸기 사탕이 됐어요!"
      if (lastRes === rs.res) { witch.look('giggle', 'left'); await say(S.RSAME); }
      witch.look('present', 'left');
      kid.look('yum', 'front'); K.swirlAnim = null;
      /* 맛없을 줄 알았다는 으웩·'어? 맛있다!'는 뺐다(2026-10-29 사용자) — 1회전만 마녀가 '먼저 먹어 봐', 늘 '냠… ○○ 사탕이다!' */
      if (first) await say(S.E3);
      cue('chomp', .5); kid.look('yum', 'front'); if (first) { cue('ding_glock', .5); cue('harp_gliss', .4); }
      await say(`냠… ${resKo} 사탕이다!`);
      cand.pos.style.display = 'none';
      seenAdd(rs.res); used.push(rs.res); lastRes = rs.res;
      /* ---- 6. 뿅! 몸이 변했어요 ---- */
      await tfScene(rs.res, first);
      /* ---- 회전 끝 ---- */
      if (round < 2) again = true;
      else if (round === 2) {
        witch.look('present', 'left');
        await say(S.RMORE);
        const yes = await T.ask(S.RMOREa, () => T.tap(K.potHit, { timeout: 6000, autoResult: rounds3 }));
        again = !!yes || rounds3 && autoMode;
        if (!again) break;
      } else again = false;
      if (again) { K.kinds = []; cue('rattle', .5) || cue('slide_down', .4); potClear(); await say(S.RCLEAR); }
    }
    amb('pot_boil', .15, 4);

    /* ---- 6 장면 본체: 변신 컷 → 무대 변신 동작 → 뿅 원래대로 ---- */
    async function tfScene(res, long) {
      const tfN = S.NTF[res];
      await cutTf(res);
      cue(['slide_up'], .6); cue('chime_up', .5);
      const K6 = { x0: kid.x };
      const out = async (bg, then) => { if (bg === curBg) return cont(() => { if (bg !== 'wc_bg_kitchen') { T.clear(); bgImage(T, bg); setView(500); } then(); }); await T.curtain(false); T.clear(); bgImage(T, bg); setView(500); then(); await T.curtain(true); };   // 같은 배경(초콜릿 = 부엌)은 막 없이
      kid.pos.style.pointerEvents = 'none';
      const act = !long ? 4500 : 8500;
      const lines = async () => { await say(tfN); await say(S.KTF[res]); if (res === 'strawberry') { witch.look('surprise', 'front'); await say('어디 가!'); } if (res === 'choco') await say('녹았다!'); if (long) await say(S.NACT[res]); };
      const back = async () => { const f = () => { K = kitchen({ shelf: true, ladle: true }); setLook(); potClear(false); bubbles(); }; if (curBg === 'wc_bg_kitchen') return cont(f); await T.curtain(false); f(); await T.curtain(true); };
      /* 구경꾼(시선 PLAN §5 6장: 마녀·친구들·호박이 → 다현이). 마녀·호박이는 오른쪽에서 왼쪽을, 친구 셋은 왼쪽 끝에서 오른쪽을 본다 */
      const friendsWatch = () => { cast([[witch, X(890, 650), FL, { look: 'surprise', to: 'left' }], [cat, X(780, 600), FL, { look: 'sit', to: 'left' }]]); if (!P) FRS.forEach((f, i) => put(T, f, 250 - i * 95, FL, { look: 'stand', to: 'right' })); else FRS.forEach(hide); };
      /* 변신 효과 조각(PLAN §10-2 fx): 다현이 지금 자리(움직이는 중에도)에서 퐁퐁 */
      const kidXY = () => { try { const m = T.world.getCTM().inverse().multiply(kid.pos.getCTM()); return [m.e, m.f]; } catch (e) { return [kid.x, kid.y]; } };
      const fxTrail = (f, n, every, size, dy = -120, rise = -70) => { const ids = []; for (let i = 0; i < n; i++) ids.push(setTimeout(() => {
        const [x, y] = kidXY(), g = T.el('g', { 'pointer-events': 'none', filter: 'url(#pp)' }, T.fx); pic(T, g, f, x + (Math.random() - .5) * 90, y + dy + (Math.random() - .5) * 40, size);
        g.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: `translate(${(Math.random() - .5) * 40}px,${rise}px) rotate(${(Math.random() - .5) * 60}deg)`, opacity: 0 }], { duration: 1400, easing: 'ease-out' }).finished.then(() => g.remove());
      }, i * every)); rs.stops.push(() => ids.forEach(clearTimeout)); };
      const run1 = (ms, f) => Promise.all([f(), sleep(ms)]);
      const x1 = X(330, 340), x2 = X(850, 660);
      if (res === 'strawberry') {
        await out('wc_bg_street', () => { friendsWatch(); put(T, kid, x1, FL, { look: 'tf_strawberry_ball', to: 'right' }); });
        cue('pop', .7); const L = lines();
        cue('step_wood', .3); const rot = kid.body; kid.body.style.transformOrigin = `0 ${-HT.wc_kid_tf_strawberry_ball / 2}px`; kid.body.style.transformBox = 'view-box';
        const sp = rot.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(1080deg)' }], { duration: act, easing: 'linear' });
        fxTrail('wc_prop_fx_heart', Math.round(act / 600), 600, 30, -170, -60);
        [0, 1, 2, 3, 4, 5].forEach(i => setTimeout(() => cue('step_wood', .25), i * 500));
        await kid.move(x2 - 120, FL, act, 'linear'); cue('bonk', .6) || cue('pop', .6); T.pop(x2 - 80, FL - 140, tr('통!'), '#E04B3C');
        await kid.move(x1 + 100, FL, 900, 'ease-out'); sp.cancel(); await L;
      } else if (res === 'duck') {
        await out('wc_bg_shop_front', () => { friendsWatch(); put(T, kid, X(420, 400), FL, { look: 'tf_duck', to: 'right' }); put(T, cat, X(320, 330), FL, { look: 'waddle', to: 'right' }); });
        cue('pop', .7); const L = lines();
        cue('animals/duck', .7); setTimeout(() => cue('animals/duck', .6), 900);
        const wob = kid.body.animate([{ transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }], { duration: 450, iterations: Infinity, direction: 'alternate' });
        const wob2 = cat.body.animate([{ transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }], { duration: 450, iterations: Infinity, direction: 'alternate' });
        fxTrail('wc_prop_fx_feather', Math.round(act / 700), 700, 30, -40, 40); await Promise.all([kid.move(X(660, 520), FL, act, 'linear'), cat.move(X(560, 440), FL, act, 'linear'), sleep(act)]); wob.cancel(); wob2.cancel(); await L;
      } else if (res === 'fish' || res === 'bat') {
        await out('wc_bg_rooftops_lb', () => { put(T, kid, X(250, 360), FL - 140, { look: res === 'fish' ? 'tf_fish' : 'tf_bat_up', to: 'right' }); cast([[witch, X(900, 650), FL, { look: 'surprise', to: 'left', s: .7 }]]); hide(cat); FRS.forEach(hide); });
        cue('pop', .7); const L = lines();
        if (res === 'fish') { [0, 1, 2, 3].forEach(i => setTimeout(() => cue(['bubbles', 'pop'], .3), i * 700)); cue('harp_gliss', .5); fxTrail('wc_prop_fx_bubble', Math.round(act / 400), 400, 26, -60, -90); }
        else { cue('wing_flap_1', .4); [0, 1, 2].forEach(i => setTimeout(() => cue('wing_flap_2', .3), i * 900)); fxTrail('wc_prop_bat_sil', Math.round(act / 600), 600, 56, -80, -60); }   // 박쥐 친구들(실루엣 복제)
        const mid = X(500, 500), flap = res === 'bat' ? setInterval(() => kid.look(kid.cur === 'tf_bat_up' ? 'tf_bat_down' : 'tf_bat_up', 'right'), 300) : 0;
        await kid.move(mid, FL - 220, act / 2, 'ease-in-out'); await kid.move(X(780, 600), FL - 140, act / 2, 'ease-in-out'); if (flap) clearInterval(flap); await L;
      } else if (res === 'frog') {
        await out('wc_bg_shop_front', () => { friendsWatch(); put(T, kid, x1 + 60, FL, { look: 'tf_frog_jump', to: 'right' }); });
        cue('pop', .7); const L = lines();
        cue('animals/frog', .7);
        for (let i = 0; i < 3; i++) { cue('spring', .5) || cue('hop', .5); await kid.move(x1 + 60 + (i + 1) * X(110, 60), FL - (i + 1) * 60, 450, 'ease-out'); cue('thud', .3); }
        kid.look('tf_frog_sit', 'front'); cue('animals/frog', .6); kid.hop(10, 300); await sleep(act / 2);
        kid.look('tf_frog_jump', 'left'); await kid.move(x1 + 60, FL, 600, 'ease-in'); kid.look('tf_frog_jump', 'right'); await L;
      } else if (res === 'kiwi') {   // 동그란 연두 키위: 거리를 통통 튀어 간다
        await out('wc_bg_street', () => { friendsWatch(); put(T, kid, x1, FL, { look: 'tf_kiwi', to: 'right' }); });
        cue('pop', .7); const L = lines(); cue('giggle_xylo', .5);
        const n = long ? 6 : 4, step = (x2 - 120 - x1) / n, hop = act / n;
        for (let i = 0; i < n; i++) { cue('boing', .5) || cue('hop', .5); await kid.move(x1 + (i + .5) * step, FL - 90, hop / 2, 'ease-out'); await kid.move(x1 + (i + 1) * step, FL, hop / 2, 'ease-in'); cue('thud', .3); }
        await kid.move(x1 + 100, FL, 900, 'ease-in-out'); await L;
      } else if (res === 'croc') {   // 초록 악어 꼬리: 엉금엉금 기어가다 앙! 호박이 깜짝
        await out('wc_bg_shop_front', () => { friendsWatch(); put(T, kid, X(360, 380), FL, { look: 'tf_croc', to: 'right' }); put(T, cat, X(640, 560), FL, { look: 'sit', to: 'left' }); });
        cue('pop', .7); const L = lines();
        const cr = kid.body.animate([{ transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }], { duration: 380, iterations: Infinity, direction: 'alternate' });
        const st = setInterval(() => cue('step_wood', .25), 500); rs.stops.push(() => clearInterval(st));
        await kid.move(X(540, 470), FL, act * .6, 'linear'); clearInterval(st); cr.cancel();
        cue('chomp', .8); T.pop(kid.x + 40, FL - 170, tr('앙!'), '#3F6B4F'); cat.hop(36, 380); cue('whistle_up', .5);
        await sleep(act * .3); await L;
      } else if (res === 'pumpkin') {
        await out('wc_bg_shop_front', () => { friendsWatch(); put(T, kid, X(450, 400), FL, { look: 'tf_pumpkin', to: 'right' });
          const dark = T.el('rect', { x: -40, y: -24, width: 1080, height: 620, fill: '#141B3D', opacity: .4, 'pointer-events': 'none' }, T.bg);
          const glowC = glow(T, T.world, kid.x, FL - 90, 200); T.world.insertBefore(glowC, kid.pos);
          glowC.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: 'forwards' }); });
        cue('pop', .7); cue('shimmer', .6); const L = lines();
        FRS.forEach(f => f.hop(10, 300)); await sleep(act); await L;
      } else {   // choco
        await out('wc_bg_kitchen', () => { K = kitchen({ shelf: true, ladle: true }); setLook(); potClear(false); bubbles(); put(T, kid, X(620, 340), X(FL, PFY), { look: 'tf_choco', to: 'left', s: X(.85, .6) }); });
        cue('pop', .7); const L = lines();
        cue('slide_down', .6); kid.look('tf_choco_flat', 'left'); cue('squelch', .5); T.pop(kid.x, FL - 120, tr('주르륵…'), '#6B4A32');
        await sleep(act / 2); witch.look('surprise', 'front'); await L;
      }
      /* 뿅 원래대로 */
      cue('slide_up', .5); cue('sparkle', .6); T.pop(kid.x, FL - 220, tr('뿅!'), '#F28C28');
      await say(S.F4);
      if (long) { witch.look('giggle', 'left'); await say(S.F1); FRS.forEach(f => f.hop(10, 300)); cue('pop', .4); await sleep(500); }   // 친구들 '나도 하고 싶다!' 뺌
      if (!K || !K.cells.length || res !== 'choco') await back();
      else { kid.look('stand', 'left'); put(T, kid, X(680, 340), X(FL, PFY), { look: 'stand', to: 'left', s: X(.85, .6) }); }
    }

    /* ================= 7. 이번엔 다 넣어요 ================= */
    await next(tr('이번엔 다 넣어요!'), 'wc_bg_kitchen', () => {   // 같은 부엌: 넘김 없이 선반·국자가 걷히고 친구들이 탁자 쪽으로
      K = kitchen({ shelf: false, ladle: false }); setLook(); potClear(false); bubbles();
      if (!P) FRS.forEach((f, i) => put(T, f, 190 + i * 100, FL - 40, { look: 'stand', to: 'right', s: .8 })); else FRS.forEach(hide);   // 친구들은 탁자 뒤(탁자가 나중에 그려져 앞)
      cast([[kid, X(570, 340), X(FL, PFY), { look: 'stand', to: 'right', s: X(.85, .6) }]]);
      if (!P) cast([[cat, 50, FL, { look: 'sit', to: 'right', s: .9 }]]); else hide(cat);
    });
    /* 탁자 위 재료 넷 (이번 판에서 안 쓴 것 우선) */
    const lastIds = new Set(); const pickIng = key => { const c = ING.filter(i => i.key === key); return c[Math.floor(Math.random() * c.length)]; };
    const four = ['r', 'y', 'b'].map(pickIng);   // 마지막은 빨·노·파 셋(2026-10-29 사용자: 초록 빼고)
    const { tab, cells: tcell } = tableFour(four, true);
    witch.look('present', 'left'); await say(S.G1);
    kid.look('yuck', 'left'); await say(S.G2);
    tcell.forEach(c => bob(c.el));
    const land7 = [];
    const sevenPut = (c, n) => { land7.push(fly(c).then(() => { plop(c); if (!K.kinds.includes(c.key)) { K.kinds.push(c.key); if (K.kinds.length === 1) potFlat(COL[c.key]); else potSwirl(K.kinds); } count(n); })); };
    /* 네 가지를 다현이가 하나씩 톡(2026-10-29 사용자: '7장은 4개니깐 하나씩 선택하게') — 넣은 것은 다시 받지 않고, 넷이면 저절로 끝 */
    await T.ask(S.G3, () => T.fill(tcell, {
      maxCount: 3, prompt: S.G3,
      allow: (c, st) => !st.order.includes(c),
      onPut: (c, n) => { c.el.getAnimations().forEach(a => a.cancel()); c.el.classList.remove('tap-target'); sevenPut(c, n); kid.look('reach', 'right'); setTimeout(() => kid.look('stand', 'right'), 800); kid.hop(8, 260); },
      onReject: () => {},
      auto: () => tcell.slice(),
    }));
    tcell.forEach(c => { c.el.getAnimations().forEach(a => a.cancel()); c.el.classList.remove('tap-target'); });
    await Promise.all(land7); await sleep(500);
    await sayIngs(tcell.map(c => c.id));   // "아기 용 콧물이랑 병아리 방귀랑 괴물 응가랑 초록 개구리를 넣었어요!"
    await say(S.G4);
    magicStir();
    await say(S.G5);
    stopStir();
    tab.remove();
    const cs7 = await smoke(true);
    potFlat(COL.black, false); cs7();
    cue('boom', .5); await sleep(600);
    cue('harp_gliss', .6); cue('chime_up', .5);
    const gc = ghostPlate(); fadeIn(gc, 600);
    witch.look('surprise', 'front'); await say(S.G6);
    FRS.forEach(f => f.hop(10, 300)); cue('boing', .4) || cue('pop', .4); await sleep(700);   // 친구들 '까맣다!' 뺌
    gc.pos.style.display = 'none'; seenAdd('ghost');
    await sleep(600);

    /* ================= 8. 유령 사탕 행진 ================= */
    await cutTf('ghost');
    cue('slide_up', .6);
    kid.look('ghost', 'right'); kid.hop(8, 300);
    await say(S.H1);
    cue(['theremin_wobble', 'whistle_wobble'], .5); T.pop(kid.x, FL - kid.h - 10, tr('오~~우~~'), '#5A3F7A');
    { const gp = vo('ghost_kid'); if (gp) await Promise.race([gp, sleep(5000)]); else await say(S.H2); }      // 다현이 혼자: VOICE_LINES ghost_kid (합창과 글자가 같아 NARRATION_CLIPS 키를 쓰지 않는다)
    await sleep(GAP);
    witch.look('ghost', 'right'); witch.hop(8, 300); await say(S.H3);
    cat.look('ghost', 'right'); FRS.forEach(f => f.look('ghost', 'right'));
    await say(S.H4);
    cue(['theremin_wobble', 'whistle_wobble'], .5); await say(S.H2);      // 모두 합창 '오~~우~~'(chorus_el.js)
    const march = async (bg, xs, onOpen) => {
      const all = [kid, witch, cat, ...FRS], kit = bg === curBg && bg === 'wc_bg_kitchen', fy = kit ? X(FL, PFY) : FL;
      const ms = kit ? X(.85, .6) : X(.9, .7), sp = P ? 52 : 70;   // 부엌은 부엌 크기(솥과 같은 비율)
      const line = () => { all.map((a, i) => [a, i]).reverse().forEach(([a, i]) => put(T, a, xs[0] - i * sp, fy, { to: 'right', s: ms }));   // 뒤에서부터 놓아 맨 앞 다현이가 맨 위(마녀 뒤에 가려지지 않게)
      all.forEach(a => a.look('ghost', 'right')); };
      /* 같은 부엌(7장 → 8장): 넘김 없이 솥은 그대로 두고, 여섯이 왼쪽에 한 줄로 걸어가 선다(2026-10-29) */
      if (kit) await cont(() => { K = kitchen({ shelf: false, ladle: false }); potFlat(COL.black, false); bubbles(); line(); });
      else { await T.curtain(false); T.clear(); bgImage(T, bg); setView(500); line(); await T.curtain(true); }
      const said = onOpen && onOpen();
      const gs = ms;
      ghostJoin(xs[0] - 6 * sp - 20, fy, gs); fadeIn(ghost, 600);   // 맨 뒤에 몰래 붙은 진짜 유령
      const st = setInterval(() => cue('step_wood', .25), 500);
      cue('theremin_wobble', .4) || cue('whistle_wobble', .4);
      await Promise.all([...all.map((a, i) => a.move(xs[1] - i * sp, fy, 3200, 'linear')), ghost.move(xs[1] - 6 * sp - 20, ghost.y, 3200, 'linear')]);
      clearInterval(st);
      if (bg === 'wc_bg_street') await ghostBye();
      await said;
    };
    await march('wc_bg_kitchen', [X(80, 300), X(780, 640)]);
    await march('wc_bg_street', [X(80, 300), X(780, 640)], () => say(S.H5));   // '마을을 한 바퀴'는 거리 장면이 열린 뒤에(2026-10-30 사용자: 부엌에서 말하면 마을이 아님)
    await cutPic('wc_cut_parade', '한 줄 유령 행진', '#1A1410');

    /* ================= 9. 모두 변신! ================= */
    await T.sceneCard(tr('모두 변신! 해피 핼러윈!'), () => {
      T.clear(); bgImage(T, 'wc_bg_shop_front'); setView(500);
      potAt(500, X(FL + 10, FL + 10));
      K = { lay: T.el('g', { 'pointer-events': 'none' }, T.world), cells: [], kinds: [] };
      potDraw(T.world); T.world.appendChild(K.lay); K.lay.innerHTML = ''; potFlatEl(K.lay, COL.black);
      finaleCast();
    });
    cue('magic_wand', .5); witch.look('present', 'left'); await say(S.I1);
    const pile = [];
    for (let i = 0; i < 9; i++) { const c = CANDY[i], a = candyProp(T, c, 56); put(T, a, POT.cx, POT.cy); const tx = POT.cx - 160 + i * 40 + (i % 2) * 6, ty = FL + 10 - (i % 3) * 8; a.pos.animate([{ transform: `translate(${POT.cx}px,${POT.cy}px)` }, { transform: `translate(${(POT.cx + tx) / 2}px,${POT.cy - 150}px)`, offset: .5 }, { transform: `translate(${tx}px,${ty}px)` }], { duration: 700, delay: i * 110, fill: 'forwards', easing: 'ease-in' }); setTimeout(() => cue('pop', .5), i * 110 + 400); pile.push(a); }
    cue('rattle', .5);
    await say(S.I2);
    witch.look('giggle', 'left'); await say(S.I3);
    FRS.forEach(f => f.hop(8, 300)); cue('chomp_2', .5) || cue('chomp', .5); await sleep(900);   // 친구들 '으웩!… 어? 맛있다!' 뺌
    pile.forEach(a => { a.pos.style.display = 'none'; });
    cue('slide_up', .6); cue('chime_up', .6);
    await say(S.I5);
    await cutPic('wc_cut_all_transform', '여섯이 한꺼번에 여덟 가지 변신', '#F28C28', 4000);
    cue('slide_up', .6); [kid, witch, cat, ...FRS].forEach((a, i) => setTimeout(() => { a.hop(14, 300); cue('pop', .4); }, i * 160));
    await sleep(1400);
    cue('sparkle', .6); T.pop(kid.x, FL - 240, tr('뿅!'), '#F28C28');
    kid.look('stand', 'right'); witch.look('present', 'left'); cat.look('sit', 'left'); FRS.forEach(f => f.look('happy', 'right'));
    await say(S.I6);
    await say(S.I7);
    kid.look('stand', 'left'); await say(S.I8);
    const wh = hitZone(T, T.world, witch.x, FL - 140, H(130), H(280)); wh.style.pointerEvents = 'all';
    witch.pos.parentNode.appendChild(wh); witch.look('present', 'left');
    wh.animate([{ translate: '0 0' }, { translate: '0 -6px' }, { translate: '0 0' }], { duration: 900, iterations: 3 });
    await T.ask(S.I9, () => T.tap(wh, { prompt: S.I9 }));
    T.confetti(); cue('party_horn', .8) || cue('tada', .6); cue('shimmer', .5);
    [kid, witch, cat, ...FRS].forEach(a => a.hop(24, 400)); setTimeout(() => [kid, witch, cat, ...FRS].forEach(a => a.hop(24, 400)), 500);
    cue(['theremin_wobble', 'whistle_wobble'], .4);
    await say(S.I10);
    await sleep(2000);
    try { AudioFX.stopAmbient(); } catch (e) { /* */ }
    bgmStop();
    T.finale(); await sleep(1500);
    return '다음엔 다른 색을 섞어 볼까요?';
  }

  Tale.mount({ title: '사탕 마녀의 핼러윈', subtitle: '', read: true, run: T => run(Tale.api) });
})();
