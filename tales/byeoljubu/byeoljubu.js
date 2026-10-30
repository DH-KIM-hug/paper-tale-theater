/* 별주부전 — 전래동화(수궁가 계, 산신령 선약 판본). 기획: tales/byeoljubu/PLAN.md (2026-10-30 확정), 그림 작업표: tools/app/gen/jobs_byeoljubu.json
   조작 5곳(모두 T.ask: 안내 음성과 누르기 동시): 2장 바다·뭍 가르기(잉어·자라·문어 중 자라) · 3~4장 방향 고르기 3단계(왼쪽 → 오른쪽 → 가운데, 화면 기준) ·
   6장 풍덩 톡(자라 등) · 8장 놀란 얼굴 찾기(얼굴 카드 둘) · 10장 인사 톡(토끼). 연타·세기·줄거리 선택 없음. 교훈은 끝 화면 글자만.
   시선(PLAN 장면표): 1 용왕→의원(오른쪽 위)·의원·문어·게→용왕(왼쪽) · 2 용왕→신하(왼쪽), 문어 오른쪽 위→왼쪽(자라), 자라→오른쪽(문어)→오른쪽 위(용왕)
   · 3 자라→갈매기(오른쪽 위)→길, 갈매기→족자(왼쪽 아래)·왼쪽 가리킴 · 4 자라→다람쥐·멧돼지(오른쪽), 토끼→자라(왼쪽) · 5 마주 봄, 토끼 솔깃(오른쪽 위)
   · 6 토끼→아래, 자라→왼쪽(바다) / 바다 속 토끼→오른쪽 위(물고기) · 7 둘 다 오른쪽, 마지막에 자라→왼쪽(토끼), 게→왼쪽(손님)
   · 8 용왕→왼쪽 아래(토끼), 토끼→오른쪽 위, 자라→바닥 · 9 같은 자리, 자라→왼쪽(토끼) · 10 토끼(바위)→왼쪽 아래(자라)→오른쪽(숲), 자라→오른쪽 위→바닥
   · 11 자라→바닥→왼쪽 위(산신령), 산신령→오른쪽 아래 / 용궁: 용왕→왼쪽, 모두→오른쪽(용왕).
   그림이 보는 쪽(NAT)은 그림을 눈으로 보고 적었다. 길 안내 자세(갈매기·다람쥐·멧돼지 가리키기)는 'fixed' — 코드에서 절대 뒤집지 않는다(PLAN §방향 고르기).
   화면 방향(가로 1000×560 월드, 바닥 FL=490). 세로 화면은 보이는 폭이 약 430(폰)~640(아이패드)이라 장면마다 꼭 보여야 할 폭(nw)에 맞춰 월드·효과 층을 줄이고(원근) 가운데 lx 를 화면 가운데에 둔다.
   배경 층(T.bg)은 줄이지 않고 lx 만큼 옆으로 민다(이어 그린 긴 숲 한 장·바다 속 세로 세트에서 카메라가 따라감).
   그림이 없으면(아직 생성 전) 같은 크기의 종이 자리표시(색 네모 + 이름표)를 그린다. */
(() => {
  const AS = '../../assets/v3w/';
  const src = k => AS + k + '.webp';
  /* 그림 비율(폭/높이). preload 가 실제 그림 비율로 덮어쓴다 */
  const ASP = {};
  /* 높이(px, scale 1, 토끼 서기 = 170). §4-1: 자세마다 같은 부위 폭으로 잰 값 — 토끼 머리 폭(귀 제외), 자라 등딱지 길이, 용왕 얼굴 폭, 문어 머리 폭, 산신령 머리 폭.
     WID 에 있으면 폭으로 정한다(가로로 긴 소품). 기획 비율: 토끼 1 : 자라 길이 1.3(높이 0.55) : 용왕 앉기 2.4 : 문어 1.2 : 게 0.5 : 멧돼지 0.9 : 산신령 1.7 */
  const HT = {
    /* 토끼: 눈 흰자 지름을 서기와 같게 잰 값(2026-10-30, eyes.py) */
    bj_rabbit_stand: 170, bj_rabbit_hop: 133, bj_rabbit_tempted: 182, bj_rabbit_ride: 178, bj_rabbit_amazed: 162, bj_rabbit_shock: 143, bj_rabbit_clever: 166, bj_rabbit_wave: 174,
    /* 자라: 등딱지 길이 = 221(토끼 1.3배)이 되게 그림마다 등딱지 폭 비율을 재서 정한 높이(2026-10-30, 격자 사진) */
    bj_jara_stand: 157, bj_jara_walk: 151, bj_jara_up: 240, bj_jara_argue: 170, bj_jara_bow: 101, bj_jara_scroll: 245, bj_jara_compare: 170, bj_jara_swim: 136, bj_jara_sad: 115, bj_jara_receive: 194, bj_jara_carry: 136,
    /* 용왕: 눈 흰자로 앉기(408)와 맞춤. 끄덕은 눈을 감아 앉기와 같은 구도로 408 */
    bj_king_sit: 408, bj_king_lie: 236, bj_king_point: 408, bj_king_nod: 408, bj_king_well: 373,
    /* 문어: 머리(몸통 원) 폭을 서기와 나란히 놓고 맞춘 값 */
    bj_octopus_stand: 204, bj_octopus_boast: 228, bj_octopus_huff: 204, bj_octopus_huff2: 204, bj_octopus_sheepish: 200,
    bj_doctor: 140, bj_shrimp_painter: 110, bj_crab_guard: 110, bj_gull_sit: 85, bj_gull_point_left: 97, bj_squirrel_sit: 95, bj_squirrel_point_right: 100,
    bj_boar_stand: 153, bj_boar_point_up: 177, bj_sage_stand: 289, bj_sage_give: 258, bj_fish_trio: 70,
    bj_prop_medicine_pot: 70, bj_prop_throne: 470, bj_prop_scroll: 140, bj_prop_ink_cloud: 160, bj_prop_acorn: 22,
    bj_prop_face_shock: 104, bj_prop_face_happy: 104, bj_prop_door_coral: 374, bj_prop_door_coral_open: 374, bj_prop_door_pearl: 374, bj_prop_door_pearl_open: 374,
    bj_prop_door_gold: 374, bj_prop_door_gold_open: 374, bj_prop_feast: 150, bj_prop_thought: 150, bj_prop_rock_shore: 120, bj_prop_splash: 170, bj_prop_medicine_bag: 46,
    bj_prop_path_left: 210, bj_prop_path_mid: 230, bj_prop_path_right: 210, bj_prop_scroll_rolled: 36,
    bj_fg_coral_left: 230, bj_fg_kelp_curtain: 330, bj_fg_shell_big: 120, bj_fg_fern_mushroom: 180, bj_fg_maple_branch: 200, bj_fg_wave_front: 120,
  };
  const WID = { bj_prop_bed: 560, bj_prop_painter_desk: 150 };
  /* 그림이 보는 쪽: left·right·front(뒤집지 않음)·fixed(방향 그림, 뒤집기 금지) */
  const NAT = {
    bj_rabbit_stand: 'left', bj_rabbit_hop: 'right', bj_rabbit_tempted: 'right', bj_rabbit_ride: 'left', bj_rabbit_amazed: 'right', bj_rabbit_shock: 'right', bj_rabbit_clever: 'left', bj_rabbit_wave: 'front',
    bj_jara_stand: 'left', bj_jara_walk: 'right', bj_jara_up: 'right', bj_jara_argue: 'right', bj_jara_bow: 'right', bj_jara_scroll: 'right', bj_jara_compare: 'left', bj_jara_swim: 'left', bj_jara_sad: 'left',
    bj_jara_receive: 'left', bj_jara_carry: 'left',
    bj_king_sit: 'left', bj_king_lie: 'right', bj_king_point: 'left', bj_king_nod: 'left', bj_king_well: 'left',
    bj_octopus_stand: 'left', bj_octopus_boast: 'right', bj_octopus_huff: 'left', bj_octopus_huff2: 'left', bj_octopus_sheepish: 'left',
    bj_doctor: 'left', bj_shrimp_painter: 'left', bj_crab_guard: 'left', bj_gull_sit: 'left', bj_gull_point_left: 'fixed', bj_squirrel_sit: 'left', bj_squirrel_point_right: 'fixed',
    bj_boar_stand: 'left', bj_boar_point_up: 'fixed', bj_sage_stand: 'front', bj_sage_give: 'right', bj_fish_trio: 'right',
  };
  const FILE = { bj_jara_up: 'bj_jara_walk_up' };   // 자세 이름 → 그림 파일
  const file = k => FILE[k] || k;
  const NAMES = {
    rabbit: '토끼', jara: '자라', king: '용왕', octopus: '문어', doctor: '잉어 의원', shrimp: '새우 화공', crab: '게 병사', gull: '갈매기', squirrel: '다람쥐', boar: '멧돼지', sage: '산신령', fish: '물고기',
    prop: '', fg: '', door: '문', path: '길', face: '얼굴 카드', bed: '침상', throne: '옥좌', scroll: '족자', ink: '먹물', feast: '잔치 상', thought: '상상', rock: '바위', splash: '물보라', medicine: '약', acorn: '도토리',
  };
  const FL = 490;
  const BGS = ['bj_bg_chamber', 'bj_bg_chamber_bright', 'bj_bg_hall', 'bj_bg_shore_day', 'bj_bg_shore_dusk', 'bj_bg_shore_morning', 'bj_bg_forest', 'bj_bg_gate', 'bj_bg_dive'];
  const CUTS = ['bj_cut_volunteer', 'bj_cut_dive', 'bj_cut_shock', 'bj_cut_hop', 'bj_cut_medicine'];
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 902 / 1600 };
  const DIVEBOX = { x: -40, y: -24, w: 1080, h: 1620 };
  /* 4·5장 숲: 숲 입구(forest_a)를 오른쪽으로 두 번 이어 그려(bj_bg_forest_ext1·ext2) 한 장으로 합친 긴 그림 3527×902. 월드 x -40~2336.
     다람쥐 큰 나무 밑동 ≈ 700~850, 가운데 빈 풀밭 ≈ 1050~1850(길 조각·자라), 회색 바위 무리 ≈ 1900~2140(멧돼지 옆) */
  const FORESTBOX = { x: -40, y: -24, w: 1080 * 3527 / 1600, h: 1080 * 902 / 1600 };
  const artOK = {}, bgOK = {}, DASP = {};   // DASP: 세로 긴 배경의 실제 비율
  const INK = '#2E241C', FONT = "'Pretendard Variable', Pretendard, sans-serif";
  /* 빛 상자(6장 바다 속, PLAN §빛 상자): 2026-10-30 생성분(bj_bg_dive_lb)이 빛 상자가 아니라(가로 그림, 실루엣 없음) 검수 탈락 → 보통 다층 bj_bg_dive 를 쓴다.
     8장 빛 상자(bj_bg_throne_lb)는 기획대로 6장 결과를 본 뒤 만들지 않았다. 다시 만들면 true 로 바꾸고 BGS 에 넣는다 */
  const DIVE_LB = false;

  const PHCOL = { rabbit: '#C9A574', jara: '#4F3826', king: '#2A7A8C', octopus: '#F2795C', doctor: '#F2B134', shrimp: '#F4A27A', crab: '#E8703A', gull: '#F4F6FA', squirrel: '#F28C28', boar: '#5A554E', sage: '#F6ECD8', fish: '#7FD8D3' };
  function placeholder(T, parent, f, w, h) {
    const g = T.el('g', {}, parent), who = f.split('_')[1];
    T.el('rect', { x: 0, y: 0, width: w, height: h, rx: Math.min(w, h) * .18, fill: PHCOL[who] || '#D9A94E', opacity: .85 }, g);
    const t = T.el('text', { x: w / 2, y: h / 2, 'text-anchor': 'middle', 'font-size': Math.max(10, Math.min(16, h * .12)), 'font-weight': 700, fill: INK, 'font-family': FONT, text: (NAMES[who] || '') + ' ' + f.split('_').slice(2).join(' ') }, g);
    t.classList.add('phl'); t.dataset.cx = w / 2; t.dataset.cy = h / 2;
    return g;
  }
  function sprite(T, parent, f, x, y, w, h) {
    if (artOK[f]) return T.el('image', { href: src(f), x, y, width: w, height: h, preserveAspectRatio: 'none' }, parent);
    return placeholder(T, T.el('g', { transform: `translate(${x},${y})` }, parent), f, w, h);
  }
  const size = k => { const f = file(k), a = ASP[f] || 1; if (WID[k]) return [WID[k], WID[k] / a]; const h = HT[k] || 150; return [h * a, h]; };

  /* ================= 배우·소품 ================= */
  /* poses = { 이름: 자세 키 }. a.look(자세, 방향): 그림이 보는 쪽이 다르면 뒤집는다. front·fixed 는 뒤집지 않는다 */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -600, FL, g => {
      Object.entries(poses).forEach(([k, key]) => {
        const [w, h] = size(key), wrap = T.el('g', { filter: 'url(#pp)' }, g);
        sprite(T, wrap, file(key), -w / 2, -h, w, h);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[key] || 'front' };
      });
    });
    a.want = 'left';
    const place0 = a.place;
    a.place = (nx, ny) => { place0(nx, ny); a.pos.querySelectorAll('.phl').forEach(t => t.setAttribute('transform', `translate(${t.dataset.cx},${t.dataset.cy}) scale(${a.flip},1) translate(${-t.dataset.cx},${-t.dataset.cy})`)); };
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === 'fixed' || n === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.w = looks[k].w; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const prop = (T, key) => mk(T, { a: key });
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to || a.want); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = ''; a.body.style.opacity = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const shown = a => a.pos.isConnected && a.pos.style.display !== 'none';
  const fadeIn = (T, a, ms = 600) => T.anim(a.pos, [{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  const bob = (n, it = 3) => n.animate([{ translate: '0 0' }, { translate: '0 -6px' }, { translate: '0 0' }], { duration: 900, iterations: it });

  const S = {
    L1: "깊고 깊은 바다 밑에 용궁이 있어요.",
    L2: "용왕님이 병이 났어요. 콜록, 콜록.",
    L3: "아이고, 온몸이 아프구나.",
    L4: "뭍에 사는 토끼의 간을 드시면 나아요.",
    L5: "누가 토끼 간을 가져오겠느냐?",
    L6: "제가요! 다리가 여덟이니 제일 빨라요!",
    L7: "문어님, 뭍에서는 다리가 미끌미끌해서 못 걸어요.",
    L8: "걸을 수 있다니까!",
    L9: "문어는 먹물 속에서 뻐끔뻐끔. 물고기들은 뭍에 가면 숨을 못 쉬어요.",
    ASK1: "뭍에서도 걸을 수 있는 친구를 톡 눌러 봐요.",
    W_DOC: "저는 물 밖에선 숨을 못 쉬어요…",
    W_OCTO: "나… 나는 미끌미끌…",
    L10: "저는 물에서도 뭍에서도 걸을 수 있어요.",
    L11: "자라가 가거라. 화공은 토끼를 그려 주어라.",
    L12: "화공이 토끼 그림을 그렸어요. 귀는 길쭉, 꼬리는 짧게.",
    L13: "이 그림을 들고 토끼를 찾겠습니다!",
    L14: "자라는 바다 위로 올라왔어요. 햇빛이 눈부셔요.",
    L15: "뭍은 이렇게 환하구나!",
    L16: "갈매기님, 이 동물 어디 있소?",
    L17: "토끼네! 저 산에 살아. 왼쪽으로 가시오.",
    ASK_L: "왼쪽 길을 톡 눌러 봐요.",
    WRONG: "어? 이쪽이 아니네.",
    L18: "왼쪽, 왼쪽.",
    L19: "자라는 엉금엉금 산으로 올라갔어요.",
    L20: "다람쥐님, 이 동물 어디 있소?",
    L21: "토끼? 오른쪽으로 가시오.",
    ASK_R: "오른쪽 길을 톡 눌러 봐요.",
    L22: "멧돼지님, 이 동물 어디 있소?",
    L23: "토끼는 저 바위 뒤에. 가운데로 가시오.",
    ASK_M: "가운데 길을 톡 눌러 봐요.",
    L24: "누가 나를 찾아?",
    L25: "귀는 길쭉, 꼬리는 짧고… 똑같다! 토끼님이구나.",
    L26: "토끼님, 용궁에 가면 높은 벼슬을 드려요.",
    L27: "맛있는 것도 잔뜩 있어요.",
    L28: "벼슬? 맛있는 것? 좋아, 갈래!",
    L29: "토끼는 덥석 따라나섰어요. 좋은 것만 생각했거든요.",
    L30: "제 등에 타세요. 꼭 잡으세요!",
    ASK_DIVE: "자라 등을 톡 눌러 봐요.",
    L31: "자라는 토끼를 업고 바다 속으로 들어갔어요.",
    L32: "우와, 물고기다! 바다 속은 파랗구나.",
    L33: "용궁에 다 왔어요. 문이 차례로 열려요.",
    L34: "어서 오세요!",
    L35: "우와, 진주랑 산호가 반짝반짝!",
    L36: "자, 용왕님께 가요.",
    L37: "토끼야, 잘 왔다. 네 간을 다오.",
    ASK_FACE: "토끼는 어떤 얼굴이 됐을까요? 놀란 얼굴을 톡 눌러 봐요.",
    W_FACE: "웃을 때가 아니에요.",
    L38: "네?! 제 간을요?",
    L39: "토끼는 그제야 알았어요. 자라가 거짓말을 한 거예요.",
    L40: "어떡하지… 겁먹지 말고 생각하자.",
    L41: "용왕님, 저는 간을 꺼내서 산속 바위에 널어 두고 왔어요.",
    L42: "자라님이 미리 말을 안 해 줬어요. 가서 가져올게요!",
    L43: "그래? 그럼 얼른 가져오너라.",
    L44: "용왕님은 토끼 말을 믿었어요.",
    L45: "제가 모시고 다녀오겠습니다.",
    L46: "자라는 토끼를 업고 다시 뭍으로 갔어요.",
    L47: "자라님, 간을 꺼내 놓고 다니는 동물이 어디 있어요? 하하!",
    L48: "이제 달콤한 말엔 안 속을 거야!",
    L49: "아이고… 속았구나.",
    ASK_BYE: "토끼를 톡 눌러 봐요.",
    L50: "안녕!",
    L51: "자라는 바닷가에 엎드려 한숨을 쉬었어요.",
    L52: "용왕님께 뭐라고 하지…",
    L53: "그때, 산신령이 나타났어요.",
    L54: "자라야, 애쓴 마음이 갸륵하구나. 이 약을 용왕님께 드려라.",
    L55: "고맙습니다, 산신령님!",
    L56: "자라는 약을 안고 바다로 돌아갔어요.",
    L57: "아, 이제 다 나았다!",
    L58: "용궁에 웃음이 돌아왔어요.",
  };
  const MORAL = '달콤한 말에 덥석 따라가지 말아요. 어려울 땐 차분히 생각해요.';

  async function run(T) {
    const { sleep, tr } = T;
    T.cardSpeed(.6);
    const GAP = 600, SCENE_END = 1400;
    const say = async text => { await T.say(text); await sleep(GAP); };
    const rd = () => T.reading();
    const inst = () => T.readInstant();
    let P = T.viewWidth() < 990;
    const refreshP = () => { P = T.viewWidth() < 990; };
    const X = (l, p) => (P ? p : l);
    T.director(null);
    T.world.style.pointerEvents = 'none';   // 누르는 대상(hitBox)만 누름을 받는다 — 인물 그림·말풍선·효과 글자는 받지 않는다
    T.fx.style.pointerEvents = 'none';

    /* ---------- 소리 (만화식 효과음, 분당 4~6개. 읽어 주기는 ×0.8) ---------- */
    const sfx = (name, v = .5, d = 0) => { const go = () => { try { AudioFX.sfx(name, rd() ? v * .8 : v); } catch (e) { /* 소리 없이 */ } }; if (d) setTimeout(go, d); else go(); };
    const sting = n => { try { if (AudioFX.hasSting && AudioFX.hasSting(n)) AudioFX.sting(n); } catch (e) { /* */ } };
    const animal = (n, v = .5, d = 0) => setTimeout(() => { try { AudioFX.animal(n, rd() ? v * .8 : v); } catch (e) { /* */ } }, d);
    const amb = (name, v = .22, d = 6) => { try { AudioFX.ambient(name, { vol: rd() ? Math.min(v, .18) : v, dur: rd() ? Math.min(d, 4) : d, fadeIn: .6 }); } catch (e) { /* */ } };
    const intro = () => {   // 여는 음악: 가야금 국악풍 12초(대사 밑으로 저절로 낮아짐). 장면이 바뀌면 scene() 의 stopAmbient 가 끈다
      const go = () => { try { return AudioFX.ambient('intro_korean', { vol: rd() ? .25 : .3, loop: false, fadeIn: .5, dur: 12 }); } catch (e) { return true; } };
      if (!go()) setTimeout(go, 900);
    };
    const daegeum = () => { try { AudioFX.ambient('daegeum', { vol: rd() ? .22 : .28, loop: false, fadeIn: .3, dur: 6.5 }); } catch (e) { /* */ } };   // 11장 바닷가 한숨(조용한 한 순간)
    AudioFX.preloadSfx(['intro_korean', 'daegeum', 'bubbles', 'waves', 'birds_chirp_1', 'birds_chirp_2', 'question', 'slide_up', 'slide_down', 'toot_kazoo', 'cork', 'pop_out', 'peek_pop', 'ding_glock', 'xylo_up', 'xylo_down',
      'broom_1', 'swish', 'paper_up', 'paper_down', 'seagull_1', 'seagull_2', 'tiptoe_pizz', 'knock', 'doop', 'boing', 'boing_steps', 'squeak', 'sparkle', 'spring', 'harp_gliss', 'splash', 'splash_big', 'whoosh',
      'door_heavy_1', 'door_heavy_2', 'marimba_1', 'marimba_3', 'marimba_5', 'tada', 'drum', 'giggle_xylo', 'whistle_down', 'zip_away', 'shimmer', 'chime_up', 'party_horn', 'surprise_sting', 'water_drip', 'magic_wand', 'pop', 'ding']);

    /* ---------- 화면(view): lx = 화면 가운데에 올 월드 x, nw = 세로 화면에 보여야 할 월드 폭, vy = 아래로 내려간 양(바다 속) ---------- */
    let V = { lx: 500, nw: 1000, vy: 0 }, bgKey = null;
    /* nw = 세로 화면에 꼭 보여야 할 월드 폭. 보이는 폭(폰 세로 약 430, 아이패드 세로 약 640)에 맞춰 줄인다(최대 1) */
    const ES = nw => Math.min(1, T.viewWidth() / nw);
    const wT = (v, css) => { const s = P ? ES(v.nw) : 1; return css ? `translate(500px, ${FL - v.vy}px) scale(${s}) translate(${-v.lx}px, ${-FL}px)` : `translate(500 ${FL - v.vy}) scale(${s}) translate(${-v.lx} ${-FL})`; };
    const bT = (v, css) => (css ? `translate(${500 - v.lx}px, ${-v.vy}px)` : `translate(${500 - v.lx} ${-v.vy})`);
    const view = (nv, ms = 0) => {
      const old = V; V = { ...V, ...nv }; if (!P && bgKey !== 'forest' && 'lx' in nv) V.lx = 500;
      [T.world, T.fx, glowEl].forEach(g => g && g.setAttribute('transform', wT(V)));
      T.bg.setAttribute('transform', bT(V));
      if (!ms || inst() || document.hidden) return Promise.resolve();
      const a = [T.world, T.fx].map(g => T.anim(g, [{ transform: wT(old, true) }, { transform: wT(V, true) }], { duration: ms, easing: 'ease-in-out' }));
      a.push(T.anim(T.bg, [{ transform: bT(old, true) }, { transform: bT(V, true) }], { duration: ms, easing: 'ease-in-out' }));
      return Promise.all(a).then(() => { [T.world, T.fx, T.bg].forEach(g => { g.style.transform = ''; }); });
    };
    const H = n => (P ? n / ES(V.nw) : n);    // 화면 크기를 지키는 누르는 자리(세로는 월드가 줄어든 만큼 키운다)

    /* ---------- 배경 ---------- */
    const bgImg = (key, box, dx = 0) => {
      if (bgOK[key]) return T.el('image', { href: src(key), x: box.x + dx, y: box.y, width: box.w, height: box.h, preserveAspectRatio: 'none' }, T.bg);
      const g = T.el('g', {}, T.bg);
      T.el('rect', { x: box.x + dx, y: box.y, width: box.w, height: box.h, fill: /dive|chamber|hall|gate/.test(key) ? '#1F2A56' : '#CDE6F7' }, g);
      T.el('rect', { x: box.x + dx, y: 300, width: box.w, height: Math.max(0, box.h - 324), fill: /dive/.test(key) ? '#0F1F3D' : '#E9DCC0' }, g);
      T.el('text', { x: 500 + dx, y: 52, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: '#6B4A32', 'font-family': FONT, text: '(그림 자리) ' + key }, g);
      return g;
    };
    const drawBg = key => {
      T.bg.innerHTML = '';
      if (key === 'forest') bgImg('bj_bg_forest', FORESTBOX);   // 이어 그린 긴 숲 한 장(카메라 lx 500 → 1580 으로 오른쪽으로 옮겨 간다)
      else if (key === 'dive') { const k = DIVE_LB && bgOK.bj_bg_dive_lb ? 'bj_bg_dive_lb' : 'bj_bg_dive'; DIVEBOX.h = 1080 / (DASP[k] || 1080 / 1620); bgImg(k, DIVEBOX); }
      else bgImg(key, BGBOX);
    };
    const SCENE_AMB = { bj_bg_chamber: ['bubbles', .2], bj_bg_hall: ['bubbles', .2], bj_bg_gate: ['bubbles', .2], bj_bg_shore_day: ['waves', .22], bj_bg_shore_dusk: ['waves', .2], bj_bg_shore_morning: ['waves', .2], forest: ['birds_chirp_1', .22], dive: ['bubbles', .25] };
    /* 장면 차리기: 같은 배경이면 그대로 두고(이어 가기), 다르면 지우고 새로 깐다 */
    const ALL = [];
    let glowEl = null;   // 11장 산신령 빛(인물 뒤 층)
    const scene = (key, nv = {}) => {
      refreshP();
      ALL.forEach(a => { hide(a); a._mv = null; });
      T.fx.innerHTML = ''; if (glowEl) { glowEl.remove(); glowEl = null; }
      if (key !== bgKey) {
        bgKey = key;
        try { AudioFX.stopAmbient(.5); } catch (e) { /* */ }
        drawBg(key);
        if (SCENE_AMB[key]) amb(...SCENE_AMB[key]);
      }
      T.camSnap(500, 280, 1);
      view({ lx: 500, nw: 600, vy: 0, ...nv });
    };

    /* ---------- 그림 불러오기 ---------- */
    const loads = [];
    BGS.forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { bgOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) DASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    const SPR = [...new Set([...Object.keys(HT), ...Object.keys(WID)].map(file))];
    SPR.forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    CUTS.forEach(k => T.preload(src(k)));
    await Promise.race([Promise.all(loads), new Promise(r => setTimeout(r, 4000))]);

    /* ---------- 배우 ---------- */
    const pz = (who, ps) => Object.fromEntries(ps.map(p => [p, `bj_${who}_${p}`]));
    const rabbit = mk(T, pz('rabbit', ['stand', 'hop', 'tempted', 'ride', 'amazed', 'shock', 'clever', 'wave']));
    const jara = mk(T, pz('jara', ['stand', 'walk', 'up', 'argue', 'bow', 'scroll', 'compare', 'swim', 'sad', 'receive', 'carry']));
    const king = mk(T, pz('king', ['sit', 'lie', 'point', 'nod', 'well']));
    const octo = mk(T, pz('octopus', ['stand', 'boast', 'huff', 'huff2', 'sheepish']));
    const doctor = prop(T, 'bj_doctor'), shrimp = prop(T, 'bj_shrimp_painter');
    const crab1 = prop(T, 'bj_crab_guard'), crab2 = prop(T, 'bj_crab_guard');
    const gull = mk(T, { sit: 'bj_gull_sit', point: 'bj_gull_point_left' });
    const squirrel = mk(T, { sit: 'bj_squirrel_sit', point: 'bj_squirrel_point_right' });
    const boar = mk(T, { stand: 'bj_boar_stand', up: 'bj_boar_point_up' });
    const sage = mk(T, { stand: 'bj_sage_stand', give: 'bj_sage_give' });
    const fish = prop(T, 'bj_fish_trio');
    const P_ = k => prop(T, 'bj_prop_' + k);
    const bed = P_('bed'), pot = P_('medicine_pot'), throne = P_('throne'), scroll = P_('scroll'), desk = P_('painter_desk'), ink = P_('ink_cloud'), acorn = P_('acorn');
    const rolled = P_('scroll_rolled'), feast = P_('feast'), thought = P_('thought'), rock = P_('rock_shore'), splash = P_('splash'), bag = P_('medicine_bag');
    const paths = { left: P_('path_left'), mid: P_('path_mid'), right: P_('path_right') };
    const faces = { shock: P_('face_shock'), happy: P_('face_happy') };
    const doors = ['coral', 'pearl', 'gold'].map(n => mk(T, { closed: `bj_prop_door_${n}`, open: `bj_prop_door_${n}_open` }));
    const FG = Object.fromEntries(['coral_left', 'kelp_curtain', 'shell_big', 'wave_front', 'fern_mushroom', 'maple_branch'].map(k => [k, prop(T, 'bj_fg_' + k)]));
    const CAST = [rabbit, jara, king, octo, doctor, shrimp, crab1, crab2, gull, squirrel, boar, sage, fish];
    ALL.push(...CAST, bed, pot, throne, scroll, desk, ink, acorn, rolled, feast, thought, rock, splash, bag, ...Object.values(paths), ...Object.values(faces), ...doors, ...Object.values(FG));
    ALL.forEach(hide);

    /* ---------- 누르는 자리 ---------- */
    /* 화면 크기 w×h(가로 월드 px) 투명 사각. (dx, dy) = 발끝 기준 가운데 위치. 세로는 월드가 줄어든 만큼 키운다 */
    function hitBox(a, w, h, dy = null, dx = 0) {
      const sc = a.scale || 1, lw = H(w) / sc, lh = H(h) / sc, cy = dy == null ? -a.h / 2 : dy / sc;
      const r = T.el('rect', { x: dx / sc - lw / 2, y: cy - lh / 2, width: lw, height: lh, fill: '#000', 'fill-opacity': 0 }, a.pos);
      a.pos.insertBefore(r, a.body); a.hitRect = r; a.pos.style.pointerEvents = 'all';
      T.world.appendChild(a.pos);
      return a.pos;
    }
    const unhit = a => { if (a.hitRect) { a.hitRect.remove(); a.hitRect = null; } a.pos.style.pointerEvents = ''; };
    const popAt = (x, y, word, col) => T.pop(x, y, tr(word), col);
    const headY = a => a.y - a.h * (a.scale || 1) - 30;

    /* 걷기: 깡충깡충 작은 들썩임과 함께 옮긴다 */
    const hopLoop = async (a, ms, h = 4, d = 380) => { const end = Date.now() + ms; while (Date.now() < end - d) await a.hop(h, d); };
    const walk = (a, x, y, ms, ease = 'linear', h = 3) => (inst() ? (a.place(x, y), Promise.resolve()) : Promise.all([a.move(x, y, ms, ease), hopLoop(a, ms, h)]));
    /* 토끼를 자라 등에 얹기(토끼 앉기 그림 = 자라 등딱지 위). 토끼는 자라와 같이 움직인다 */
    const RIDE = { stand: [10, -52], swim: [0, -62], sad: [10, -46] };
    const riding = { on: false };
    const seatRabbit = (k = 'stand') => {
      const o = RIDE[k] || RIDE.stand, f = jara.flip === -1 ? -1 : 1;
      rabbit.look('ride', jara.flip === -1 ? 'right' : 'left'); rabbit.setScale(jara.scale); rabbit.place(jara.x + o[0] * f * jara.scale, jara.y + o[1] * jara.scale);
      rabbit.pos.style.display = ''; rabbit.pos.style.opacity = ''; T.world.appendChild(rabbit.pos); riding.on = true;
    };
    const moveDuo = async (x, y, ms, ease = 'ease-in-out', k = 'swim') => {
      const o = RIDE[k] || RIDE.stand, f = jara.flip === -1 ? -1 : 1;
      if (inst()) { jara.place(x, y); rabbit.place(x + o[0] * f * jara.scale, y + o[1] * jara.scale); return; }
      await Promise.all([jara.move(x, y, ms, ease), rabbit.move(x + o[0] * f * jara.scale, y + o[1] * jara.scale, ms, ease)]);
    };
    /* 자라 등의 말린 족자(3~5장): 자라 서기 그림 위에 얹는다 */
    const putRolled = () => { put(T, rolled, jara.x + (jara.flip === -1 ? -1 : 1) * jara.w * .14, jara.y - jara.h * .6, { look: 'a' }); };

    /* ================= 장면 배치 (놀이판·읽어 주기 같이 씀) ================= */
    /* 길 셋(3·4장): 자라가 선 갈림길 가운데 cx 에서 위로 부채꼴. 가로 끝 x ≈ cx-250 / cx / cx+250, 세로는 .75 배로 모아 cx-190 / cx / cx+190 */
    const PATH = { left: [-137, -250], mid: [0, 0], right: [137, 250] };
    const PS = () => (P ? .9 : 1.3);   // 길 크기(가로 1.3배, 세로는 모아서 .9배)
    const pathEnd = (k, cx) => { const s = PS(); return [cx + (k === 'left' ? -1 : k === 'right' ? 1 : 0) * 190 * s, FL + 30 - (paths[k].h - 20) * s]; };
    const layPaths = cx => { const s = PS(); ['left', 'mid', 'right'].forEach(k => put(T, paths[k], cx + PATH[k][0] * s * (k === 'mid' ? 0 : 1) * .78, FL + 30, { look: 'a', s })); };
    const LAY = {
      chamber() {   // 1장: 용궁 침전. 용왕은 머리 오른쪽, 의원·문어·게는 머리맡 오른쪽에서 왼쪽(용왕)을 본다
        scene('bj_bg_chamber', { lx: 560, nw: 800 });
        put(T, bed, 350, FL + 4, { look: 'a', s: .9 });
        put(T, king, 370, FL - bed.h * .9 * .6, { look: 'lie', to: 'right' });
        put(T, pot, 610, FL + 4, { look: 'a' });
        put(T, octo, 950, FL - 6, { look: 'stand', to: 'left' });
        put(T, doctor, 790, FL, { to: 'left' });
        put(T, crab1, 665, FL + 8, { to: 'left' });
        put(T, FG.coral_left, 40, 610); put(T, FG.kelp_curtain, 1000, 280);
      },
      hall() {      // 2장: 용궁 대전. 옥좌 오른쪽, 신하 줄 왼쪽부터 잉어·자라·문어(시선표: 문어↔자라 마주, 문어 오른쪽 위 용왕)
        scene('bj_bg_hall', { lx: 385, nw: 760 });
        put(T, throne, 860, FL + 6, { look: 'a' });
        put(T, king, 860, FL - 18, { look: 'sit', to: 'left' });
        put(T, desk, 330, FL - 92, { look: 'a', s: .85 }); put(T, shrimp, 285, FL - 100, { to: 'left', s: .9 });
        put(T, doctor, X(115, 150), FL, { to: 'right' });
        put(T, jara, 380, FL, { look: 'stand', to: 'right' });
        put(T, octo, 640, FL, { look: 'stand', to: 'right' });
        put(T, fish, 300, 120, { s: .8 }); put(T, FG.shell_big, -30, 610, { s: .8 });
      },
      shore() {     // 3장: 바닷가 낮. 자라는 길이 갈라지는 가운데 아래, 갈매기는 오른쪽 바위 위
        scene('bj_bg_shore_day', { lx: 600, nw: 580 });
        layPaths(600);
        put(T, rock, X(880, 760), FL + 4, { look: 'a' });
        put(T, gull, rock.x + 10, FL - rock.h * .82, { look: 'sit', to: 'left' });
        put(T, jara, 600, FL + 50, { look: 'stand', to: 'right' }); putRolled();
        put(T, FG.wave_front, 120, 615);
      },
      fork1() {     // 4장 ①: 숲 입구, 다람쥐는 오른쪽 나무 밑동
        scene('forest', { lx: 500, nw: 580 });
        layPaths(500);
        put(T, squirrel, X(800, 700), FL - 10, { look: 'sit', to: 'left' });
        put(T, jara, 500, FL + 50, { look: 'stand', to: 'right' }); putRolled();
        put(T, FG.fern_mushroom, X(60, 300), 600);
      },
      fork2() {     // 4장 ②: 숲 속(두 번째 장), 멧돼지는 오른쪽 바위 옆
        scene('forest', { lx: 1580, nw: 580 });
        layPaths(1580);
        put(T, boar, X(1920, 1790), FL - 20, { look: 'stand', to: 'left' });
        put(T, jara, 1580, FL + 50, { look: 'stand', to: 'right' }); putRolled();
      },
      meet() {      // 4장 ③·5장: 토끼 바위. 자라 왼쪽, 토끼 오른쪽(마주 봄)
        scene('forest', { lx: 1570, nw: 580 });
        put(T, rock, X(1840, 1740), FL + 4, { look: 'a' });
        put(T, jara, X(1400, 1460), FL, { look: 'stand', to: 'right' }); putRolled();
        put(T, rabbit, X(1660, 1630), FL, { look: 'stand', to: 'left' });
        put(T, FG.maple_branch, X(2060, 1760), 200);
      },
      dusk() {      // 6장 앞: 바닷가 저녁, 자라는 물가에서 바다(왼쪽)를 본다
        scene('bj_bg_shore_dusk', { lx: 470, nw: 540 });
        put(T, jara, 400, FL, { look: 'stand', to: 'left' });
        put(T, rabbit, 600, FL, { look: 'stand', to: 'left' });
        put(T, FG.wave_front, 120, 615);
      },
      dive() {      // 6장 바다 속(세로 긴 배경): 자라·토끼가 가운데 물길로 내려간다
        scene('dive', { lx: 500, nw: 520, vy: 0 });
        put(T, jara, 520, 300, { look: 'swim', to: 'left' }); seatRabbit('swim');
        put(T, FG.kelp_curtain, X(960, 700), 300);
      },
      gate() {      // 7장: 용궁 대문. 문 셋이 저절로 차례로 열린다
        scene('bj_bg_gate', { lx: 330, nw: 600 });
        doors.forEach((d, i) => put(T, d, 420 + i * 235, FL + 4, { look: 'closed', s: .78 }));   // 문 높이 0.78배(문 셋이 한 화면에)
        put(T, feast, 890, FL - 20, { look: 'a', s: .8 }); T.world.insertBefore(feast.pos, doors[2].pos);
        put(T, crab1, 300, FL, { to: 'left' }); put(T, crab2, 540, FL, { to: 'left' });
        put(T, rabbit, 70, FL, { look: 'stand', to: 'right' });
        put(T, jara, 180, FL, { look: 'walk', to: 'right' });
        put(T, FG.coral_left, -10, 600);
      },
      throne() {    // 8·9장: 옥좌 앞. 용왕이 위에서 왼쪽 아래(토끼)를 본다
        scene('bj_bg_hall', { lx: 520, nw: 620 });
        put(T, throne, 840, FL + 6, { look: 'a' });
        put(T, king, 840, FL - 18, { look: 'sit', to: 'left' });
        put(T, crab1, 90, FL, { to: 'right' }); put(T, crab2, 195, FL, { to: 'right' });
        put(T, rabbit, 350, FL, { look: 'stand', to: 'right' });
        put(T, jara, 610, FL, { look: 'sad', to: 'left' });
      },
      morning() {   // 10장: 바닷가 아침. 토끼는 바위 위
        scene('bj_bg_shore_morning', { lx: 500, nw: 640 });
        put(T, rock, X(730, 660), FL + 4, { look: 'a' });
        put(T, jara, 330, FL, { look: 'stand', to: 'right' });
        put(T, rabbit, rock.x, FL - rock.h * .8, { look: 'stand', to: 'left' });
        put(T, FG.wave_front, 120, 615);
      },
      sage() {      // 11장 앞: 같은 바닷가. 자라는 엎드려 있고, 산신령은 왼쪽에 나타난다
        scene('bj_bg_shore_morning', { lx: 470, nw: 580 });
        put(T, jara, X(560, 545), FL, { look: 'sad', to: 'left' });
        put(T, sage, X(320, 380), FL, { look: 'stand', to: 'right' }); hide(sage);
        put(T, FG.wave_front, 120, 615);
      },
      healed() {    // 11장 끝: 밝아진 용궁 침전. 용왕은 오른쪽 침상에서 일어나 앉고, 모두 오른쪽(용왕)을 본다
        scene('bj_bg_chamber_bright', { lx: 560, nw: 820 });
        put(T, bed, 760, FL + 4, { look: 'a', s: .85 });
        put(T, king, 790, FL - bed.h * .85 * .55, { look: 'well', to: 'left' });
        put(T, octo, 170, FL - 40, { look: 'stand', to: 'right', s: .9 });
        put(T, crab1, 70, FL + 6, { to: 'right' });
        put(T, jara, 330, FL, { look: 'stand', to: 'right' });
        put(T, doctor, 545, FL, { to: 'right' });
      },
    };
    LAY.meetClose = () => { LAY.meet(); T.camSnap(P ? 500 : 520, 300, P ? 1 : 1.12); };
    LAY.throneClose = () => { LAY.throne(); jara.look('stand', 'left'); T.camSnap(P ? 500 : 560, 300, P ? 1 : 1.1); };
    let curLay = null;
    const lay = k => { curLay = k; LAY[k](); };
    /* 세로 화면에서 말하는 쪽으로 화면 가운데를 옮긴다(가로는 그대로) */
    const look = (lx, ms = 700) => (P ? view({ lx }, ms) : Promise.resolve());

    /* ================= 장면 연출 조각(beat) — 놀이판과 읽어 주기가 같이 쓴다 ================= */
    const B = {
      /* 1장 */
      async bubbles() {   // 물방울이 천천히 오른다(장식)
        for (let i = 0; i < 7; i++) {
          const x = 80 + i * 140 + (i % 2) * 40, c = T.el('circle', { cx: x, cy: 520, r: 5 + (i % 3) * 3, fill: i % 2 ? '#F4F6FA' : '#7FD8D3', opacity: .8 }, T.bg);
          c.animate([{ transform: 'translate(0,0)', opacity: 0 }, { transform: 'translate(6px,-200px)', opacity: .85, offset: .4 }, { transform: 'translate(-6px,-520px)', opacity: 0 }], { duration: 6000 + i * 500, iterations: Infinity, delay: -i * 900 });
        }
      },
      cough() { king.wiggle(3, 400); popAt(king.x + 200, headY(king) + 40, '콜록, 콜록', '#2A7A8C'); sfx('xylo_down', .35); },
      async doctorBow() { await doctor.hop(8, 360); },
      /* 2장 */
      async ask() { sfx('question', .55); await look(700); king.look('point', 'left'); },
      async boast() {   // 문어가 다리를 번쩍 들고 나선다(오른쪽 위 용왕을 본다)
        octo.look('boast', 'right'); sfx('slide_up', .5); sfx('party_horn', .35, 250); popAt(octo.x, headY(octo), '짠!', '#E8703A');
        await look(520); await octo.hop(18, 420);
      },
      async argue() { octo.look('stand', 'left'); jara.look('argue', 'right'); await look(510); },
      async huff() {    // 볼 부풀리기 → 다리 휘젓기(두 장 번갈아) → 먹물 퐁. 때리지 않고, 다리는 자라에게 닿지 않는다(거리 220)
        octo.look('huff', 'left'); sfx('toot_kazoo', .6); popAt(octo.x + 10, headY(octo), '뿌웅!', '#2A2A2A');
        for (let i = 0; i < 4; i++) { await sleep(220); octo.look(i % 2 ? 'huff' : 'huff2', 'left'); }
        put(T, ink, octo.x, FL + 6, { look: 'a' }); sfx('cork', .7); popAt(octo.x + 40, headY(octo) - 30, '퐁!', '#2A2A2A');
        await T.anim(ink.pos, [{ opacity: 0, transform: `translate(${ink.x}px,${ink.y}px) scale(.3)` }, { opacity: 1, transform: `translate(${ink.x}px,${ink.y}px) scale(1)` }], 300);
        ink.place(ink.x, ink.y);
      },
      async inkClear() { await sleep(rd() ? 600 : 1200); await fadeOut(T, ink, 500); octo.look('stand', 'left'); sfx('bubbles', .4); popAt(octo.x, headY(octo), '뻐끔뻐끔', '#2A7A8C'); },
      async chosen() {  // 용왕이 자라를 고른다: 문어는 머쓱하게 다리를 내리고 뒤로 물러선다
        glow(jara, 1200); sfx('ding_glock', .7);
        jara.look('bow', 'right'); octo.look('sheepish', 'left'); sfx('whistle_down', .35, 300);
        await octo.move(octo.x + 50, FL - 14, 600, 'ease-out');
      },
      async kingSends() { king.look('point', 'left'); await look(640); },
      async paint() {   // 화공이 족자에 토끼를 그린다(붓 쓱쓱) → 족자가 자라에게
        await look(330);
        put(T, scroll, desk.x + 20, FL - 70, { look: 'a', s: .6 }); fadeIn(T, scroll, 400);
        sfx('broom_1', .45); popAt(shrimp.x, headY(shrimp), '쓱쓱', '#6B4A32');
        for (let i = 0; i < 3; i++) await shrimp.wiggle(6, 300);
        sfx('sparkle', .4); glow(scroll, 800);
      },
      async takeScroll() {
        await scroll.move(jara.x, FL - 120, 700, 'ease-in-out'); hide(scroll);
        jara.look('scroll', 'right'); sfx('paper_up', .5); await look(450);
      },
      /* 3장 */
      async crawlUp() { // 물방울 톡톡: 자라가 물결 뒤에서 모래톱으로 기어오른다
        jara.look('walk', 'right'); jara.place(150, FL + 30); T.world.insertBefore(jara.pos, FG.wave_front.pos); hide(rolled);
        sfx('water_drip', .45); sfx('splash', .3, 200);
        if (P) view({ lx: 420 }); await walk(jara, 600, FL + 50, 2200, 'ease-out', 3);
        jara.look('stand', 'right'); putRolled(); T.world.appendChild(jara.pos); T.world.appendChild(rolled.pos); look(600, 900);
      },
      async show(who) { // 족자를 촤락 펼쳐 보인다
        hide(rolled); jara.look('scroll', 'right'); sfx('swish', .5); sfx('paper_up', .45, 120); popAt(jara.x + 40, headY(jara), '촤락!', '#A93B32');
        await jara.hop(6, 300);
      },
      async gullPoint() { sfx('seagull_1', .35); popAt(gull.x, headY(gull), '끼룩!'); gull.look('point', 'left'); await gull.hop(8, 360); },
      async squirrelPoint() { squirrel.look('point', 'left'); put(T, acorn, squirrel.x - 20, FL - 40, { look: 'a' }); sfx('knock', .5); popAt(squirrel.x, headY(squirrel), '통!');
        await acorn.move(squirrel.x - 30, FL + 2, 300, 'ease-in'); await squirrel.hop(6, 300); },
      async boarPoint() { animal('pig', .35); sfx('squeak', .4, 400); popAt(boar.x, headY(boar), '킁킁'); boar.look('up', 'left'); await boar.hop(6, 360); },
      /* 길 가기: 정답 길을 따라 걸어 올라가며 작아진다(멀어짐) → 사라진다 */
      async goPath(k, cx) {
        const [ex, ey] = pathEnd(k, cx);
        hide(rolled); jara.look('up', 'right'); sfx('tiptoe_pizz', .45);
        await walk(jara, (jara.x + ex) / 2, (jara.y + ey) / 2 + 30, 900, 'linear', 3);
        jara.setScale(.75);
        await walk(jara, ex, ey + 40, 900, 'linear', 2);
        await fadeOut(T, jara, 400); jara.setScale(1);
      },
      async toFork2() {   // 숲 ① → ② : 카메라가 오른쪽으로 옮겨 간다(이어 그린 긴 숲 한 장)
        lay('fork2'); view({ lx: 500 }); hide(jara); hide(rolled);
        const pre = [paths.left, paths.mid, paths.right, boar]; pre.forEach(a => { a.pos.style.opacity = 0; });
        await B.pan(1580, rd() ? 1500 : 1800);
        await Promise.all(pre.map(a => fadeIn(T, a, 500).then(() => { a.pos.style.opacity = ''; })));
        jara.pos.style.display = ''; rolled.pos.style.display = ''; await fadeIn(T, jara, 500); jara.pos.style.opacity = '';
      },
      async toMeet() { lay('meet'); hide(rabbit); await sleep(300); rabbit.pos.style.display = ''; },
      toDive() { lay('dive'); },
      async pathsOut() { await Promise.all(Object.values(paths).map(p => fadeOut(T, p, 400))); },
      async pan(lx, ms = 1800) { await view({ lx }, ms); },
      async rabbitPops() {   // 바위 뒤에서 토끼가 깡충 나온다(통통)
        rabbit.look('hop', 'left'); rabbit.place(rock.x + 30, FL - 40); T.world.insertBefore(rabbit.pos, rock.pos);
        sfx('boing_steps', .5); popAt(rabbit.x - 40, headY(rabbit) - 40, '통통');
        await rabbit.move(rock.x + 20, FL - 150, 350, 'ease-out'); T.world.appendChild(rabbit.pos);
        await rabbit.move(X(1660, 1630), FL, 450, 'ease-in'); rabbit.look('stand', 'left'); await rabbit.hop(8, 260);
      },
      async compare() {      // 자라가 족자를 토끼 옆에 나란히: 작은 반짝 한 번(자동 연출)
        hide(rolled); jara.look('compare', 'right'); sfx('paper_up', .45);
        await walk(jara, rabbit.x - 210, FL, 600, 'ease-out', 2);
        await sleep(700); glow(jara, 900); glow(rabbit, 900); sfx('sparkle', .55); popAt((jara.x + rabbit.x) / 2, headY(rabbit) - 20, '똑같다!', '#D9A94E');
      },
      /* 5장 */
      async perk() { rabbit.look('stand', 'left'); sfx('spring', .45); popAt(rabbit.x, headY(rabbit) - 10, '쫑긋!'); await rabbit.hop(6, 260); },
      async tempted() {
        rabbit.look('tempted', 'right'); sfx('harp_gliss', .45);
        put(T, thought, rabbit.x + 150, FL - rabbit.h - 60, { look: 'a' }); await fadeIn(T, thought, 500);
      },
      async grab() { await fadeOut(T, thought, 400); rabbit.look('hop', 'left'); sfx('cork', .6); popAt(rabbit.x, headY(rabbit), '덥석!'); await rabbit.hop(14, 360); rabbit.look('stand', 'left'); },
      /* 6장 */
      async hopOn() { rabbit.look('hop', 'left'); sfx('boing', .5); await rabbit.move(jara.x + 40, FL - 90, 450, 'ease-out'); seatRabbit('stand'); },
      async splash() {
        sting('splash'); sfx('splash_big', .7);
        put(T, splash, jara.x - 40, FL + 10, { look: 'a' }); popAt(jara.x - 40, FL - 200, '풍덩!', '#3E7CB1');
        await moveDuo(jara.x - 80, FL + 20, 300, 'ease-in', 'stand');
      },
      async descend() {      // 카메라가 아래로 따라 내려간다. 물고기 떼가 지나간다
        sfx('bubbles', .5); sfx('slide_down', .35, 300);
        const dy = P ? 760 : 960, s = P ? ES(V.nw) : 1, ms = rd() ? 3500 : 4200;
        put(T, fish, X(1150, 900), 300 + dy / s * .55, { look: 'a' });
        await Promise.all([view({ vy: dy }, ms), moveDuo(500, 300 + dy / s, ms, 'ease-in-out', 'swim'),
          fish.move(X(-150, 200), fish.y, ms + 800, 'linear')]);
      },
      async fishLook() { rabbit.look('ride', 'right'); sfx('marimba_5', .45); popAt(rabbit.x + 60, headY(rabbit), '보글보글', '#4FB3C9'); await rabbit.hop(6, 300); },
      /* 7장 */
      async doorOpen(i) {
        const d = doors[i]; sfx(i % 2 ? 'door_heavy_2' : 'door_heavy_1', .5); sfx('xylo_up', .35, 400);
        await T.anim(d.pos, [{ opacity: 1 }, { opacity: .3 }], 250); d.look('open'); await T.anim(d.pos, [{ opacity: .3 }, { opacity: 1 }], 300); d.pos.style.opacity = '';
        glow(d, 600);
      },
      async walkTo(x, ms = 1600) {
        jara.look('walk', 'right'); rabbit.look('hop', 'right');
        if (P) view({ lx: Math.max(330, x - 60) }, ms);
        sfx('tiptoe_pizz', .35);
        await Promise.all([walk(jara, x + 110, FL, ms, 'linear', 3), walk(rabbit, x, FL, ms, 'linear', 8)]);
        jara.look('walk', 'right'); rabbit.look('amazed', 'right');
      },
      async crabHello() { crab1.hop(10, 300); crab2.hop(10, 300); sfx('drum', .4); },
      async sparkle() { rabbit.look('amazed', 'right'); sfx('sparkle', .5); popAt(rabbit.x + 30, headY(rabbit), '반짝!', '#D9A94E'); await rabbit.hop(8, 300); },
      async jaraBack() { jara.look('stand', 'left'); await jara.hop(4, 260); },
      /* 8장 */
      async kingAsks() { king.look('point', 'left'); await look(640); },
      async cards() {
        await look(470);
        const sw = Math.random() < .5;
        put(T, faces.shock, rabbit.x + (sw ? -85 : 85), FL - rabbit.h - 95, { look: 'a' });
        put(T, faces.happy, rabbit.x + (sw ? 85 : -85), FL - rabbit.h - 95, { look: 'a' });
        sfx('question', .55); await Promise.all([fadeIn(T, faces.shock, 400), fadeIn(T, faces.happy, 400)]);
      },
      async cardsOut() { await Promise.all([fadeOut(T, faces.shock, 300), fadeOut(T, faces.happy, 300)]); },
      async fall() { rabbit.look('shock', 'right'); sting('slip'); popAt(rabbit.x, headY(rabbit) - 20, '깜짝!', '#A93B32'); await rabbit.wiggle(4, 400); },
      async think() { rabbit.look('stand', 'right'); sfx('tiptoe_pizz', .25); await sleep(300); },
      /* 9장 */
      async clever() { rabbit.look('clever', 'right'); sfx('magic_wand', .4); sfx('ding', .35, 300); await rabbit.hop(8, 300); },
      async nod() { king.look('nod', 'left'); sfx('doop', .45); popAt(king.x - 60, headY(king) + 30, '끄덕끄덕'); await king.hop(4, 400); },
      async jaraDoubt() { jara.look('stand', 'left'); await jara.wiggle(2, 400); },
      async jaraBow() { jara.look('bow', 'right'); await sleep(300); },
      /* 10장 */
      async arrive() {   // 자라가 토끼를 업고 바다에서 나와 물가에 닿는다 → 토끼가 바위 위로 폴짝
        jara.look('swim', 'right'); jara.place(-120, FL + 10); seatRabbit('swim'); T.world.appendChild(FG.wave_front.pos);
        sfx('splash', .4);
        await moveDuo(330, FL, 1800, 'ease-out', 'swim');
        jara.look('stand', 'right'); seatRabbit('stand');
        rabbit.look('hop', 'right'); sfx('boing', .55); popAt(rabbit.x + 120, FL - 260, '폴짝!');
        await rabbit.move((rabbit.x + rock.x) / 2, FL - 260, 380, 'ease-out');
        await rabbit.move(rock.x, FL - rock.h * .8, 380, 'ease-in'); rabbit.setScale(1);
        rabbit.look('stand', 'left'); riding.on = false;
      },
      async laugh() { sfx('giggle_xylo', .5); popAt(rabbit.x, headY(rabbit), '하하!'); await rabbit.hop(8, 300); },
      async tricked() { jara.look('sad', 'right'); sfx('whistle_down', .4); popAt(jara.x, headY(jara), '휴…', '#6B4A32'); },
      async wave() { rabbit.look('wave'); sfx('ding_glock', .5); await rabbit.hop(10, 300); },
      async runAway() {
        rabbit.look('hop', 'right'); sfx('zip_away', .45); sfx('boing_steps', .4, 200);
        await rabbit.move(rabbit.x + 160, FL - 120, 400, 'ease-out'); await rabbit.move(rabbit.x + 160, FL, 400, 'ease-in');
        await walk(rabbit, 1250, FL, 900, 'linear', 14); hide(rabbit);
      },
      /* 11장 */
      async sigh() { daegeum(); jara.look('sad', 'left'); popAt(jara.x, headY(jara), '휴…', '#6B4A32'); await sleep(400); },
      async sageAppears() {   // 산신령이 나타남: 종이 뒤 빛 번짐 한 번(§7-1 빛 예외 — 빛 층만, 조각 안 그라데이션 아님)
        sfx('harp_gliss', .55); sfx('shimmer', .45, 300);
        const g = glowEl = T.el('g', { 'pointer-events': 'none' }, T.fx);
        const id = 'bjGlow' + Date.now();
        const defs = T.el('defs', {}, g), rg = T.el('radialGradient', { id }, defs);
        T.el('stop', { offset: '0%', 'stop-color': '#FBF3D5', 'stop-opacity': .95 }, rg); T.el('stop', { offset: '60%', 'stop-color': '#FBF3D5', 'stop-opacity': .45 }, rg); T.el('stop', { offset: '100%', 'stop-color': '#FBF3D5', 'stop-opacity': 0 }, rg);
        const c = T.el('ellipse', { cx: sage.x, cy: FL - 150, rx: 240, ry: 260, fill: `url(#${id})` }, g);
        T.fx.parentNode.insertBefore(g, T.world);   // 빛은 인물 뒤(배경과 인물 사이)
        g.setAttribute('transform', T.world.getAttribute('transform') || '');
        if (!inst()) await T.anim(c, [{ opacity: 0 }, { opacity: 1 }], 900);
        sage.pos.style.display = ''; sage.look('stand', 'right'); T.world.appendChild(sage.pos);
        if (!inst()) await fadeIn(T, sage, 900);
        jara.look('receive', 'left'); look(450);
      },
      async give() {
        sage.look('give', 'right'); sfx('paper_up', .4);
        put(T, bag, sage.x + 105, FL - 60, { look: 'a' }); await fadeIn(T, bag, 300);
        await bag.move(jara.x - 60, FL - 120, 900, 'ease-in-out'); glow(bag, 800); sfx('chime_up', .55);
      },
      async thanks() { await fadeOut(T, bag, 300); jara.look('stand', 'left'); await jara.hop(10, 360); },
      async swimHome() {
        sage.look('stand', 'right'); jara.look('carry', 'left'); sfx('splash', .45, 600);
        if (P) view({ lx: 380 }, 1400);
        await walk(jara, 120, FL + 20, 1600, 'ease-in', 2); await fadeOut(T, jara, 400);
      },
      async well() { king.look('well', 'left'); sting('win'); T.confetti(); popAt(king.x - 40, headY(king) + 20, '반짝!', '#D9A94E'); await king.hop(14, 420); },
      async cheer() { for (const a of [octo, jara, doctor, crab1]) { a.hop(12, 360); await sleep(120); } sfx('party_horn', .4); },
    };

    /* ================= 읽어 주기 (docs/READ_MODE.md): set = 장면 배치(LAY), beat:<이름>[:인자] = 위 연출 조각, 그 밖 cut·snd·pop ================= */
    if (rd()) {
      const R = {
        set(k) {
          refreshP();
          lay(k);
          if (k === 'chamber') { intro(); B.bubbles(); }
          if (k === 'healed') B.bubbles();
        },
        beat(name, a1, a2) { const f = B[name]; if (!f) { console.warn('[read] 모르는 beat', name); return; } return f(a1 == null ? a1 : isNaN(+a1) ? a1 : +a1, a2 == null ? a2 : isNaN(+a2) ? a2 : +a2); },
        cut(n) { return T.cutImage([{ src: src(n), hold: 3000 }]); },
        snd(n, v = .6, d = 0) { sfx(n, +v, +d); },
        look(who, pose, dir) { const a = { rabbit, jara, king, octo, gull, squirrel, boar, sage }[who]; if (a) a.look(pose, dir); },
        view(lx, ms) { return view({ lx: +lx }, +ms || 800); },
      };
      return T.readPlay(R).finally(() => { try { AudioFX.stopAmbient(); } catch (e) { /* */ } });
    }

    /* ===== 1. 아픈 용왕님 — 용궁 침전, 가까이 눈높이 ===== */
    lay('chamber'); B.bubbles();
    await T.curtain(true);
    intro();
    await say(S.L1);
    B.cough();
    await say(S.L2);
    await look(450);
    await say(S.L3);
    await look(700);
    B.doctorBow();
    await say(S.L4);
    await sleep(SCENE_END);

    /* ===== 2. 누가 갈까요? — 용궁 대전, 멀리 넓게 (배움: 바다·뭍 가르기) ===== */
    await T.sceneCard(tr('누가 갈까요?'), () => lay('hall'), jara.pos);
    await B.ask();
    await say(S.L5);
    await B.boast();
    await say(S.L6);
    await B.argue();
    await say(S.L7);
    await B.huff();
    await say(S.L8);
    await B.inkClear();
    await say(S.L9);
    await look(400);
    const opts = [[doctor, false, S.W_DOC], [jara, true, null], [octo, false, S.W_OCTO]].map(([a, ok, w]) => {
      const el = hitBox(a, a === octo ? (P ? 140 : 170) : P ? 140 : 200, a === octo ? 210 : 150, a === octo ? -100 : -60);
      bob(a.pos);
      return { el, ok, onWrong: async () => { await a.wiggle(5, 360); sfx('pop_out', .4); if (w) await T.say(w); } };
    });
    await T.ask(S.ASK1, () => T.choose(opts, { prompt: S.ASK1 }));
    [doctor, jara, octo].forEach(unhit);
    await B.chosen();
    await say(S.L10);
    await B.kingSends();
    await say(S.L11);
    await B.paint();
    await say(S.L12);
    await T.cutImage([{ src: src('bj_cut_volunteer'), hold: 2800 }]);
    await B.takeScroll();
    await say(S.L13);
    await sleep(SCENE_END);

    /* ===== 3. 뭍에 오른 자라 — 바닷가 낮 (배움: 방향 고르기 1단계 = 왼쪽) ===== */
    /* 방향 고르기: 길 셋(화면 왼쪽·가운데·오른쪽)의 끝 표식 둘레가 누르는 자리. 오답 = 뿅 + 그 길로 한 걸음 갔다가 돌아옴 + "어? 이쪽이 아니네." */
    const choosePath = async (ans, ask, cx) => {
      const os = ['left', 'mid', 'right'].map(k => {
        const p = paths[k], [ex, ey] = pathEnd(k, cx);
        const el = hitBox(p, 150, 140, (ey + 40) - p.y, ex - p.x);
        return {
          el, ok: k === ans,
          onWrong: async () => {
            sfx('peek_pop', .5); popAt(ex, ey - 20, '뿅');
            hide(rolled); jara.look('walk', ex < jara.x ? 'left' : 'right'); const x0 = jara.x, y0 = jara.y;
            await jara.move(x0 + (ex - x0) * .18, y0 - 20, 400, 'ease-out');
            await T.say(S.WRONG);
            await jara.move(x0, y0, 400, 'ease-in'); jara.look('stand', 'right'); putRolled();
          },
        };
      });
      Object.values(paths).forEach(p => bob(p.pos, 2));
      jara.look('stand', 'right'); putRolled(); T.world.appendChild(jara.pos); T.world.appendChild(rolled.pos);   // 길(누르는 대상)은 자라 뒤 — 자라 몸은 누름을 받지 않는다
      await T.ask(ask, () => T.choose(os, { prompt: ask }));
      Object.values(paths).forEach(unhit);
      glow(paths[ans], 900); sfx('ding_glock', .6);
    };
    await T.sceneCard(tr('뭍에 오른 자라'), () => lay('shore'), jara.pos);
    const l14 = say(S.L14);
    await B.crawlUp(); await l14;
    await say(S.L15);
    await B.show();
    await say(S.L16);
    await B.gullPoint();
    await say(S.L17);
    await choosePath('left', S.ASK_L, 600);
    const l18 = say(S.L18);
    await B.goPath('left', 600); await l18;
    await sleep(600);

    /* ===== 4. 산길 — 긴 숲 한 장(①→②), 카메라가 오른쪽으로 (배움: 방향 2단계 = 오른쪽, 3단계 = 가운데) ===== */
    await T.sceneCard(tr('산길'), () => lay('fork1'), jara.pos);
    await say(S.L19);
    await B.show();
    await say(S.L20);
    await B.squirrelPoint();
    await say(S.L21);
    await choosePath('right', S.ASK_R, 500);
    await B.goPath('right', 500);
    await B.toFork2();
    await B.show();
    await say(S.L22);
    await B.boarPoint();
    await say(S.L23);
    await choosePath('mid', S.ASK_M, 1580);
    await B.goPath('mid', 1580);
    await B.toMeet();
    await B.rabbitPops();
    await say(S.L24);
    const l25 = say(S.L25);
    await B.compare(); await l25;
    await sleep(SCENE_END);

    /* ===== 5. 달콤한 말 — 같은 숲, 가까이 둘만 ===== */
    await T.sceneCard(tr('달콤한 말'), () => lay('meetClose'), rabbit.pos);
    await say(S.L26);
    await B.perk();
    await say(S.L27);
    await B.tempted();
    await say(S.L28);
    await B.grab();
    await say(S.L29);
    await sleep(SCENE_END);

    /* ===== 6. 풍덩, 바다 속으로 (재미 톡) ===== */
    await T.sceneCard(tr('풍덩!'), () => lay('dusk'), jara.pos);
    await say(S.L30);
    await B.hopOn();
    hitBox(jara, 240, 170, -70); bob(jara.pos, 3);
    await T.ask(S.ASK_DIVE, () => T.tap(jara.pos, { prompt: S.ASK_DIVE }));
    unhit(jara);
    await B.splash();
    await T.cutImage([{ src: src('bj_cut_dive'), hold: 2600, onShow: () => setTimeout(() => B.toDive(), 300) }]);
    if (curLay !== 'dive') B.toDive();
    const l31 = say(S.L31);
    await B.descend(); await l31;
    await B.fishLook();
    await say(S.L32);
    await sleep(SCENE_END);

    /* ===== 7. 용궁 구경 — 문 셋이 저절로 차례로 열린다(세기 없음) ===== */
    await T.sceneCard(tr('용궁 구경'), () => lay('gate'), rabbit.pos);
    const l33 = say(S.L33);
    await sleep(600); await B.doorOpen(0); await l33;
    await B.crabHello();
    await say(S.L34);
    await B.walkTo(400);
    await B.doorOpen(1);
    await B.walkTo(640);
    await B.doorOpen(2);
    await B.sparkle();
    await say(S.L35);
    await B.jaraBack();
    await say(S.L36);
    await sleep(SCENE_END);

    /* ===== 8. 간을 다오 — 옥좌 앞, 낮게 (배움: 놀란 얼굴 찾기) ===== */
    await T.sceneCard(tr('간을 다오'), () => lay('throne'), rabbit.pos);
    await B.kingAsks();
    await say(S.L37);
    await B.cards();
    const fo = ['shock', 'happy'].map(k => ({ el: hitBox(faces[k], 120, 120), ok: k === 'shock', onWrong: async () => { sfx('pop_out', .4); await T.say(S.W_FACE); } }));
    await T.ask(S.ASK_FACE, () => T.choose(fo, { prompt: S.ASK_FACE }));
    Object.values(faces).forEach(unhit);
    glow(faces.shock, 700); await sleep(500);
    await B.cardsOut();
    await T.cutImage([{ src: src('bj_cut_shock'), hold: 2600, sfx: 'surprise' }]);
    await B.fall();
    await say(S.L38);
    await say(S.L39);
    await B.think();
    await say(S.L40);
    await sleep(SCENE_END);

    /* ===== 9. 토끼의 꾀 — 같은 옥좌 앞, 가까이 ===== */
    await T.sceneCard(tr('토끼의 꾀'), () => lay('throneClose'), rabbit.pos);
    await B.clever();
    await say(S.L41);
    await say(S.L42);
    await look(640);
    await B.nod();
    await say(S.L43);
    await look(500);
    await say(S.L44);
    await B.jaraDoubt();
    await B.jaraBow();
    await say(S.L45);
    await sleep(SCENE_END);

    /* ===== 10. 다시 뭍으로 — 폴짝! (인사 톡) ===== */
    await T.sceneCard(tr('다시 뭍으로'), () => lay('morning'), jara.pos);
    const l46 = say(S.L46);
    await B.arrive(); await l46;
    await B.laugh();
    await say(S.L47);
    await say(S.L48);
    await B.tricked();
    await say(S.L49);
    hitBox(rabbit, 150, 200, -95); bob(rabbit.pos, 3);
    await T.ask(S.ASK_BYE, () => T.tap(rabbit.pos, { prompt: S.ASK_BYE }));
    unhit(rabbit);
    await B.wave();
    await say(S.L50);
    await T.cutImage([{ src: src('bj_cut_hop'), hold: 2600 }]);
    await B.runAway();
    await sleep(SCENE_END);

    /* ===== 11. 산신령의 약 → 밝아진 용궁 ===== */
    lay('sage');                       // 같은 바닷가: 넘김 없이 이어 간다
    await B.sigh();
    await say(S.L51);
    await say(S.L52);
    await B.sageAppears();
    await say(S.L53);
    await B.give();
    await say(S.L54);
    await T.cutImage([{ src: src('bj_cut_medicine'), hold: 2800 }]);
    await B.thanks();
    await say(S.L55);
    const l56 = say(S.L56);
    await B.swimHome(); await l56;
    await T.sceneCard('', () => lay('healed'), king.pos);
    B.bubbles();
    await sleep(500);
    await B.well();
    await say(S.L57);
    await B.cheer();
    await say(S.L58);
    await sleep(1500);
    try { AudioFX.stopAmbient(); } catch (e) { /* */ }
    T.finale(); await sleep(1500);
    return MORAL;
  }

  Tale.mount({ title: '별주부전', subtitle: '', read: true, run: () => run(Tale.api) });
})();
