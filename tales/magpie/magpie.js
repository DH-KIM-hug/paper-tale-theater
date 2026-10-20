/* 은혜 갚은 까치 — 한국 전래동화 원작 그대로. 기획: tales/magpie/PLAN.md, 상세: SPEC.md (2026-10-20 재기획, 9장)
   톡 3번(2장 활 · 7장 종 · 9장 인사), 숫자 알기 1개(3장, 아기 까치 1~5마리 무작위 + 숫자 카드), 연타 없음, 줄거리 선택 없음.
   구렁이 아내는 여자 목소리. 까치는 죽지 않고 쓰러져 잠들었다 새벽에 깨어난다. 종소리는 범종 녹음(beomjong.mp3, 없으면 beomjong_synth.mp3).
   크기: 자세가 달라도 같은 인물은 같은 크기(HT 표). 부모 까치는 아기의 약 2.1배. 그림: assets/v3w/mg_*.webp + mg2_*.webp (목록 tools/app/gen/jobs_magpie.json)
   그림 파일이 없으면 종이 자리표시가 대신 그려지고, 있으면 실제 가로세로 비율을 읽어 ASP 를 덮어쓴다. 시험용: ?n=1..5 로 아기 까치 수 고정. */
(() => {
  const AS = '../../assets/v3w/';
  const ASP = { mg_scholar_walk: .5857, mg_scholar_bow: .5881, mg_scholar_surprise: .6786, mg_scholar_bow_shoot: .7889, mg_scholar_water: .9439,
    mg_snake_coil: 1.0158, mg_snake_flee: 1.4415, mg_chick: .8076,
    mg_mag_mom_sit: 1.3506, mg_mag_dad_sit: 1.2688, mg_mag_mom_fly: 1.2452, mg_mag_dad_fly: 1.2044, mg_mag_mom_tired: 1.8259, mg_mag_dad_tired: 1.8827,
    mg2_scholar_bow_ready: .8533, mg2_scholar_bow_release: .8033, mg2_scholar_sit_worry: .7117, mg2_lady_greet: .725, mg2_lady_stern: .7267, mg2_lady_tail: .7883,
    mg2_prop_arrow: 4.8649, mg2_prop_nest_rim: 2.0045, mg2_prop_bell: .615 };
  const NAT = { mg_scholar_walk: 'right', mg2_scholar_bow_ready: 'right', mg2_scholar_bow_release: 'right', mg_scholar_bow_shoot: 'left', mg_scholar_water: 'left',
    mg_snake_flee: 'right', mg_mag_mom_sit: 'left', mg_mag_dad_sit: 'left', mg_mag_mom_fly: 'right', mg_mag_dad_fly: 'right',
    mg_mag_mom_tired: 'right', mg_mag_dad_tired: 'right', mg2_prop_arrow: 'right' };   // 그 밖의 그림은 앞모습('front')
  const FL = 505;
  const BGS = ['mg_bg_path', 'mg_bg_bigtree', 'mg_bg_nest', 'mg_bg_night', 'mg_bg_porch', 'mg_bg_paperdoor', 'mg_bg_moonnest', 'mg2_bg_belltower_night', 'mg_bg_belltower', 'mg_bg_dawn'];
  const CUTS = ['mg_cut_arrow', 'mg_cut_flee', 'mg_cut_flock', 'mg_cut_ring', 'mg_cut_wake'];
  const src = k => AS + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 };
  const BG_PLACE = { mg_bg_belltower: { dx: 119, dy: -74 }, mg_bg_nest: { dx: 40, dy: 47, s: 1.25 } };
  const artOK = {}, bgOK = {}, cutOk = {};
  const INK = '#2E241C', CR = '#F6ECD8';
  const PHC = { scholar: '#8FB4E0', lady: '#3F6B4F', snake: '#7A9A4E', mag: '#3B3B44', chick: '#D9A94E', prop: '#A47A4A' };
  const LBL = { mg2_scholar_bow_ready: '선비 활 들기', mg2_scholar_bow_release: '선비 쏜 뒤', mg2_scholar_sit_worry: '선비 걱정', mg2_lady_greet: '여인', mg2_lady_stern: '여인(굳은 얼굴)',
    mg2_lady_tail: '여인(꼬리)', mg2_prop_arrow: '화살', mg2_prop_nest_rim: '둥지 앞테', mg2_prop_bell: '범종' };
  const BGNAME = { mg2_bg_belltower_night: '밤의 종탑' };
  function ph(T, g, f, w, h) {
    const col = /scholar/.test(f) ? PHC.scholar : /lady/.test(f) ? PHC.lady : /snake/.test(f) ? PHC.snake : /chick/.test(f) ? PHC.chick : /mag/.test(f) ? PHC.mag : PHC.prop;
    T.el('rect', { x: -w / 2, y: -h, width: w, height: h, rx: Math.min(14, h / 4), fill: col }, g);
    if (h > 60) { T.el('circle', { cx: 0, cy: -h + Math.min(w, h) * .22, r: Math.min(w, h) * .18, fill: '#F2CDA8' }, g); }
    const t = T.el('text', { x: 0, y: -h / 2, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: CR, 'paint-order': 'stroke', stroke: INK, 'stroke-width': 3, text: LBL[f] || f.replace(/^mg2?_/, '') }, g);
    t.style.pointerEvents = 'none'; return t;
  }
  function mk(T, poses) {
    const looks = {}, labels = [];
    const a = T.actor(T.world, -400, 520, g => {
      Object.entries(poses).forEach(([k, [f, h]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        if (artOK[f]) T.el('image', { href: src(f), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        else labels.push(ph(T, wrap, f, w, h));
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat: NAT[f] || 'front' };
      });
    });
    const place0 = a.place;
    a.place = (x, y) => { place0(x, y); labels.forEach(t => t.setAttribute('transform', `scale(${a.flip},1)`)); };
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
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 450) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };
  function bgImage(T, key) {
    if (!bgOK[key]) {
      T.el('rect', { x: -1400, y: -1400, width: 3800, height: 3800, fill: /night/.test(key) ? '#1F2A56' : '#E9DDBF' }, T.bg);
      const t = T.el('text', { x: 18, y: 30, 'font-size': 15, 'font-weight': 700, fill: INK, opacity: .7, text: '[그림 준비 중] ' + (BGNAME[key] || key) }, T.bg); return t;
    }
    const { dx = 0, dy = 0, s = 1 } = BG_PLACE[key] || {};
    const w = BGBOX.w * s, h = BGBOX.h * s;
    const x = s === 1 ? BGBOX.x + dx : 500 + dx - w / 2, y = s === 1 ? BGBOX.y + dy : 280 + dy - h / 2;
    const img = (extra = {}) => T.el('image', { href: src(key), x, y, width: w, height: h, preserveAspectRatio: 'none', ...extra }, T.bg);
    if (dx > 0 && s === 1) img({ transform: `matrix(-1,0,0,1,${2 * x},0)` });
    if (dy < 0 && s === 1) { img({ transform: `matrix(1,0,0,-1,0,${2 * (y + h)})` }); if (dx > 0) img({ transform: `matrix(-1,0,0,-1,${2 * x},${2 * (y + h)})` }); }
    return img();
  }
  const sfx = (name, vol, fb) => AudioFX.sfx(name, vol) || (fb && fb());
  const bellSfx = (T, vol = .9) => { (AudioFX.sfx('beomjong', vol) || AudioFX.sfx('beomjong_synth', vol)); T.tone(64, 2.2, { type: 'sine', vol: .12 * vol }); };
  const sparkleSfx = (T, v) => AudioFX.sfx('sparkle', v) || T.tone([700, 1400], .3, { vol: .15 });
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);
  const wiggleEl = (T, n) => T.anim(n, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360);
  const bob = el => el.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3, easing: 'ease-in-out' });

  function numCard(T, n, x, y, s = 1) {
    const w = 100 * s, h = 130 * s;
    const g = T.paper(T.world, [['rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10 * s, fill: '#F6ECD8' }],
      ['rect', { x: -w / 2 + 8 * s, y: -h / 2 + 8 * s, width: w - 16 * s, height: h - 16 * s, rx: 6 * s, fill: 'none', stroke: '#6B4A32', 'stroke-width': 3 * s }]],
      { transform: `translate(${x},${y})` });
    T.el('text', { x: 0, y: 30 * s, 'text-anchor': 'middle', 'font-size': 86 * s, 'font-weight': 800, fill: '#A93B32', 'font-family': "'Pretendard Variable', Pretendard, sans-serif", text: String(n) }, g);
    return { n, g, x, y };
  }
  function swingBell(bell) {
    bell.body.animate([{ rotate: '0deg' }, { rotate: '5deg', offset: .12 }, { rotate: '-4deg', offset: .4 }, { rotate: '2.5deg', offset: .65 }, { rotate: '-1deg', offset: .85 }, { rotate: '0deg' }], { duration: 2600, easing: 'ease-in-out' });
  }

  const S = {
    L0: "옛날 옛날, 마음씨 고운 선비가 과거를 보러 먼 길을 떠났어요.",
    L1: "저벅저벅. 산 넘고 물 건너, 선비는 깊은 산속으로 들어갔어요.",
    L2: "까악, 까악! 도와주세요!",
    L3: "큰 소나무 위 둥지에 아기 까치들이 있어요. 그런데 구렁이가 스르르 올라가고 있어요!",
    L4: "안 돼! 내가 아기 까치들을 지켜 줄게.",
    L5: "선비가 활을 꺼냈어요. 선비를 톡 눌러 봐요.",
    L6: "쉬익, 탁! 화살이 구렁이 바로 옆 나무에 꽂혔어요.",
    L7: "깜짝 놀란 구렁이는 스르르 숲으로 달아났어요.",
    L8: "고맙습니다, 선비님! 이 은혜는 꼭 갚을게요.",
    L9: "둥지 안에서 아기 까치들이 고개를 쏙 내밀었어요.",
    L10: "아기 까치가 몇 마리일까요? 맞는 숫자를 골라요.",
    W1: "그건 1이에요. 다시 세어 볼까요?",
    W2: "그건 2예요. 다시 세어 볼까요?",
    W3: "그건 3이에요. 다시 세어 볼까요?",
    W4: "그건 4예요. 다시 세어 볼까요?",
    W5: "그건 5예요. 다시 세어 볼까요?",
    C1: "맞아요! 한 마리예요.",
    C2: "맞아요! 두 마리예요.",
    C3: "맞아요! 세 마리예요.",
    C4: "맞아요! 네 마리예요.",
    C5: "맞아요! 다섯 마리예요.",
    L11: "짹짹! 선비님, 고맙습니다!",
    L12: "선비는 빙긋 웃으며 다시 길을 떠났어요.",
    L13: "어느새 해가 지고, 산길은 캄캄해졌어요.",
    L14: "오늘 밤은 어디서 자지? …어, 저기 불빛이!",
    L15: "깊은 산속 외딴집에서 한 여인이 나왔어요.",
    L16: "어서 오세요, 나그네님. 하룻밤 쉬어 가세요.",
    L17: "고맙습니다. 하룻밤만 신세 질게요.",
    L18: "선비는 따뜻한 방에서 금세 잠이 들었어요.",
    L19: "한밤중, 선비는 으스스한 기운에 눈을 떴어요.",
    L20: "문 앞에 그 여인이 서 있었어요. 그런데… 치마 밑으로 꼬리가 삐죽!",
    L21: "나는 낮에 네가 활로 쫓아낸, 그 구렁이의 아내다.",
    L22: "내 남편을 놀라게 한 벌로, 너를 이대로 보내 줄 수는 없어.",
    L23: "저는 그저 아기 까치들을 지키려 했을 뿐이에요. 제발 보내 주세요.",
    L24: "좋아. 새벽이 오기 전에 저 산 위 절의 종이 세 번 울리면, 너를 놓아주마.",
    L25: "하지만 이 깊은 밤에, 누가 종을 치겠니? 후후…",
    L26: "종소리… 종이 울려야 해. 어떡하지…",
    L27: "그때, 큰 소나무 둥지의 까치 가족은 잠들지 못하고 있었어요.",
    L28: "여보, 선비님이 큰일 났어요! 외딴집의 구렁이 아내가…",
    L29: "종! 절의 종을 울리면 돼요. 우리가 날아가요!",
    L30: "아기들아, 둥지에서 꼭 기다리렴.",
    L31: "까치 엄마 아빠와 숲속 까치 친구들이 밤하늘로 날아올랐어요.",
    L32: "달빛을 가르며, 산 위 절을 향해 쌩쌩!",
    L33: "절은 고요했어요. 커다란 종이 달빛 아래 걸려 있었어요.",
    L34: "종을 쳐야 해. 우리 머리로, 온 힘을 다해!",
    L35: "종을 톡 눌러 봐요.",
    L36: "댕—. 깊고 큰 종소리가 산을 넘어 퍼져 갔어요.",
    L37: "댕—. 두 번째 종소리.",
    L38: "댕—. 세 번째 종소리가 울렸어요.",
    L39: "까치들은 온 힘을 다해 종을 울렸어요.",
    L40: "그리고 힘이 다 빠진 까치들은, 종 아래에 스르르 쓰러져 잠이 들었어요.",
    L41: "멀리서 종소리가 들려왔어요.",
    L42: "종이… 울렸어. 하나, 둘, 셋.",
    L43: "약속은 약속. 너를 놓아주마.",
    L44: "여인은 스르르 구렁이로 변하더니, 새벽 숲으로 사라졌어요.",
    L45: "종소리… 누가 종을 울렸을까? 가 봐야겠어!",
    L46: "선비는 산 위 절로 달려갔어요.",
    L47: "종 아래에, 까치 엄마 아빠가 눈을 감은 채 누워 있었어요.",
    L48: "까치야… 너희였구나. 나를 구하려고…",
    L49: "선비는 까치들을 품에 안고, 시원한 물을 한 모금씩 먹여 주었어요.",
    L50: "선비님… 무사하셨군요.",
    L51: "은혜를 갚았으니, 이제 됐어요.",
    L52: "그때 아기 까치들이 짹짹 울며 날아왔어요.",
    L53: "엄마! 아빠!",
    L54: "선비를 톡 눌러 봐요.",
    L55: "고마워, 까치들아. 너희 마음, 평생 잊지 않을게.",
    L56: "은혜를 잊지 않고 갚는 마음은, 이렇게 따뜻해요.",
  };
  async function run(T) {
    const { sleep, camSnap, tr } = T;
    let GAP = 900; const SCENE_END = 2000, CUT_HOLD = 4200, STRIKE_GAP = 4500, FAINT_GAP = 2800;
    let early = true;   // 첫 조작(활 톡)까지는 숨을 짧게 (시작 30초 안에 첫 조작)
    const say = async text => { await T.say(text); await sleep(early ? 300 : GAP); };
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); };
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990;
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    AudioFX.preloadSfx(['beomjong', 'beomjong_synth', 'bonk', 'whoosh', 'creak', 'step_grass', 'step_wood', 'swish', 'paper_up', 'paper_down', 'sparkle', 'tada', 'door', 'thud', 'pop', 'splash']);
    const loads = [...BGS.map(k => T.preload(src(k)).then(ok => { bgOK[k] = ok; })), ...CUTS.map(k => T.preload(src(k)).then(ok => { cutOk[k] = ok; }))];
    Object.keys(ASP).forEach(k => { const pr = T.preload(src(k)); loads.push(pr.then(ok => { artOK[k] = ok; if (ok && pr.img && pr.img.naturalHeight) ASP[k] = pr.img.naturalWidth / pr.img.naturalHeight; })); });
    await Promise.race([Promise.all(loads), sleep(4000)]);
    const cut = (k, sfxName) => cutOk[k] ? T.cutImage([{ src: src(k), sfx: sfxName, hold: CUT_HOLD }], { hold: CUT_HOLD }) : Promise.resolve();
    const cutSay = async (k, line) => { const c = cut(k); await say(line); await c; };
    const stepLoop = (ms, vol, hopH, total) => { let on = true; (async () => { while (on) { AudioFX.sfx('step_grass', vol); await sleep(ms); } })(); return () => { on = false; }; };

    const sch = mk(T, { walk: ['mg_scholar_walk', 240], wonder: ['mg_scholar_bow', 240], surprise: ['mg_scholar_surprise', 236],
      ready: ['mg2_scholar_bow_ready', 240], draw: ['mg_scholar_bow_shoot', 232], release: ['mg2_scholar_bow_release', 240],
      sit: ['mg2_scholar_sit_worry', 200], water: ['mg_scholar_water', 185] });
    const lady = mk(T, { greet: ['mg2_lady_greet', 232], stern: ['mg2_lady_stern', 232], tail: ['mg2_lady_tail', 232] });
    const snake = mk(T, { coil: ['mg_snake_coil', 150], flee: ['mg_snake_flee', 110] });
    const mom = mk(T, { sit: ['mg_mag_mom_sit', 154], fly: ['mg_mag_mom_fly', 197], tired: ['mg_mag_mom_tired', 133] });
    const dad = mk(T, { sit: ['mg_mag_dad_sit', 150], fly: ['mg_mag_dad_fly', 186], tired: ['mg_mag_dad_tired', 103] });
    const friends = [0, 1, 2].map(i => mk(T, { fly: [i % 2 ? 'mg_mag_mom_fly' : 'mg_mag_dad_fly', i % 2 ? 197 : 186] }));
    const chicks = Array.from({ length: 5 }, () => prop(T, 'mg_chick', 70));
    const arrow = prop(T, 'mg2_prop_arrow', 14);
    const rim = prop(T, 'mg2_prop_nest_rim', 70);
    const bell = prop(T, 'mg2_prop_bell', 170);
    [sch, lady, snake, mom, dad, ...friends, ...chicks, arrow, rim, bell].forEach(hide);
    T.director({ cast: { sch, snake: lady, mom, dad }, noFace: ['sch', 'snake', 'mom', 'dad'] });
    const qn = +new URLSearchParams(location.search).get('n');
    const N = qn >= 1 && qn <= 5 ? qn : 1 + Math.floor(Math.random() * 5);

    /* ===== 1. 산길 (자동) ===== */
    scene('mg_bg_path');
    put(T, sch, X(-120, -120), FL, { look: 'walk', to: 'right' });
    await T.curtain(true);
    const steps1 = stepLoop(520, .5);
    const walk1 = sch.move(X(520, 500), FL, 7000, 'linear');
    (async () => { for (let i = 0; i < 13; i++) { sch.hop(5, 480); await sleep(520); } })();
    T.pop(sch.x, FL - 270, tr('저벅저벅')); setTimeout(() => T.pop(sch.x, FL - 270, tr('저벅저벅')), 3000);
    await say(S.L0);
    const l1 = say(S.L1);
    await walk1; steps1(); await l1;
    await sleep(150);
    vo('caw'); T.pop(X(900, 640), 230, tr('까악!'));
    sch.look('surprise'); sch.hop(8, 300);
    await sleep(500);

    /* ===== 2. 큰 소나무 (톡 1: 활쏘기) ===== */
    await T.sceneCard(tr('큰 소나무'), () => {
      scene('mg_bg_bigtree');
      put(T, snake, X(790, 640), FL, { look: 'coil', s: .8 });
      put(T, mom, X(650, 615), 168, { look: 'sit', to: 'left', s: .8 });
      put(T, dad, X(540, 560), 215, { look: 'fly', to: 'right', s: .8 });
      put(T, sch, X(440, 470), FL, { look: 'surprise' });
      if (P) camSnap(520, 280, 1);
    }, sch.pos);
    const l2 = say(S.L2); mom.hop(10, 300); await sleep(500); mom.hop(10, 300); dad.wiggle(5, 500); await l2;
    const climb = snake.move(X(735, 625), 185, 3600, 'ease-in-out');
    await say(S.L3); await climb;
    sch.look('ready', 'right'); sfx('paper_up');
    await say(S.L4); await sleep(150);
    await say(S.L5);
    bob(sch.pos);
    await T.tap(sch.pos, { prompt: '선비가 활을 꺼냈어요. 선비를 톡 눌러 봐요.' });
    early = false;
    sch.look('draw', 'right'); sfx('creak', .5);
    for (let i = 0; i < 3; i++) await sch.wiggle(1.5, 400);
    await sleep(300);
    sch.look('release', 'right'); sfx('whoosh', .8); T.pop(sch.x + 70, FL - 250, tr('쉬익!'));
    put(T, arrow, sch.x + 70, FL - 150, { to: 'right' });
    await arrow.move(snake.x - 60, snake.y - 70, 420, 'linear');
    sfx('thud', .6); T.pop(arrow.x, arrow.y - 40, tr('탁!'));
    await sleep(500);
    await cutSay('mg_cut_arrow', S.L6);
    hide(arrow);
    snake.look('flee', 'right'); snake.place(X(700, 640), FL + 8); snake.setScale(1);
    sfx('swish', .6); T.pop(760, FL - 130, tr('스르르'));
    const run2 = snake.move(1150, FL + 8, 1800, 'ease-in');
    await run2; hide(snake);
    await cutSay('mg_cut_flee', S.L7);
    sch.look('wonder');
    mom.setScale(1); mom.look('sit', 'right'); mom.turn('left'); mom.move(X(600, 580), FL - 4, 1200);
    dad.setScale(1); dad.look('fly', 'right');
    await dad.move(X(690, 640), FL - 150, 1200);
    dad.look('sit', 'left'); dad.place(dad.x, FL - 4);
    const l8 = say(S.L8); await sleep(900); mom.hop(10, 320); await sleep(2200); dad.hop(10, 320); await l8;
    await sleep(SCENE_END);

    /* ===== 3. 둥지 (숫자 알기) ===== */
    const SPOTS = { 1: [540], 2: [500, 580], 3: [470, 540, 610], 4: [455, 510, 570, 625], 5: [440, 490, 540, 590, 640] };
    const CY = N === 1 ? 398 : 392;
    await T.sceneCard(tr('둥지'), () => {
      scene('mg_bg_nest');
      put(T, mom, X(300, 380), 300, { look: 'sit', to: 'right', s: .9 });
      camSnap(P ? 540 : 500, 280, 1);
    }, null);
    const l9 = say(S.L9);
    for (let i = 0; i < N; i++) {
      const x = SPOTS[N][i];
      put(T, chicks[i], x, CY, { to: 'left' }); fadeIn(chicks[i], 260); chicks[i].hop(14, 260);
      vo('chirp'); T.pop(x, CY - 110, tr('짹!')); await sleep(700);
    }
    put(T, rim, 540, 412);
    await l9; await sleep(300);
    const others = [1, 2, 3, 4, 5].filter(k => k !== N).sort(() => Math.random() - .5).slice(0, 2);
    const kinds = [N, ...others].sort(() => Math.random() - .5);
    const cardX = X([340, 540, 740], [460, 540, 620]), cardY = X(470, 455);
    const cards = kinds.map((n, i) => numCard(T, n, cardX[i], cardY, X(1, .72)));
    cards.forEach((c, i) => c.g.animate([{ opacity: 0, translate: '0 20px' }, { opacity: 1, translate: '0 0' }], { duration: 450, delay: i * 150, fill: 'backwards' }));
    const W = { 1: '그건 1이에요. 다시 세어 볼까요?', 2: '그건 2예요. 다시 세어 볼까요?', 3: '그건 3이에요. 다시 세어 볼까요?', 4: '그건 4예요. 다시 세어 볼까요?', 5: '그건 5예요. 다시 세어 볼까요?' };
    const CN = ['하나!', '둘!', '셋!', '넷!', '다섯!'];
    const countChicks = async () => {
      for (let i = 0; i < N; i++) {
        const c = chicks[i];
        c.hop(16, 320); glow(c, 700); AudioFX.popStep(i + 1); T.pop(c.x, CY - 110, tr(CN[i]));
        const u = vo('n' + (i + 1)); await (u || sleep(650)); await sleep(350);
      }
    };
    await say(S.L10);
    await T.choose(cards.map(c => ({ el: c.g, ok: c.n === N, onWrong: async () => { await wiggleEl(T, c.g); await say(W[c.n]); await countChicks(); } })), { prompt: '아기 까치가 몇 마리일까요? 맞는 숫자를 골라요.' });
    const good = cards.find(c => c.n === N);
    good.g.style.filter = 'url(#hintGlow)'; sparkleSfx(T); T.pop(good.x, cardY - 90, tr('반짝!'));
    await countChicks();
    await say(S['C' + N]);
    cards.forEach(c => c.g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }));
    await sleep(450); cards.forEach(c => c.g.remove());
    const l11 = say(S.L11); chicks.slice(0, N).forEach(c => c.hop(12, 300)); await sleep(500); mom.hop(10, 320); await l11;
    await say(S.L12);
    await sleep(SCENE_END);

    /* ===== 4. 깊은 밤 (자동) ===== */
    await T.sceneCard(tr('깊은 밤'), () => {
      scene('mg_bg_night');
      put(T, sch, X(300, 420), FL, { look: 'walk', to: 'right' });
      if (P) camSnap(420, 280, 1);
    }, sch.pos);
    const steps4 = stepLoop(520, .35);
    const walk4 = sch.move(X(560, 560), FL, 6000, 'linear'); follow(540, 6000);
    (async () => { for (let i = 0; i < 11; i++) { sch.hop(5, 480); await sleep(520); } })();
    await say(S.L13); await walk4; steps4();
    const l14 = say(S.L14); await sleep(3200); T.pop(790, 290, tr('반짝!')); sparkleSfx(T); await l14;
    sch.hop(8, 300);
    await sch.move(X(700, 640), FL, 2000, 'linear'); await sleep(400);
    T.clear(); bgImage(T, 'mg_bg_porch'); camSnap(500, 280, 1);
    put(T, sch, X(380, 430), FL, { look: 'wonder' });
    sfx('door', .6);
    put(T, lady, X(640, 590), FL, { look: 'greet' }); fadeIn(lady, 900);
    await say(S.L15);
    const l16 = say(S.L16); await sleep(500); lady.hop(4, 700); await l16;
    const l17 = say(S.L17); await sleep(500); sch.hop(8, 300); await l17;
    const dusk = tint(T, '#1F2A56', 0);
    T.anim(dusk, [{ opacity: 0 }, { opacity: .3 }], 1500).then(() => dusk.setAttribute('opacity', .3));
    T.pop(sch.x, FL - 260, tr('쿨쿨'));
    await say(S.L18);
    await sleep(SCENE_END);

    /* ===== 5. 외딴집 (자동) ===== */
    await T.sceneCard(tr('외딴집'), () => {
      scene('mg_bg_paperdoor'); tint(T, '#1F2A56', .35);
      put(T, sch, X(380, 440), FL, { look: 'sit' });
      if (P) camSnap(510, 280, 1);
    }, sch.pos);
    const l19 = say(S.L19); sch.wiggle(3, 500); await l19;
    put(T, lady, X(640, 590), FL, { look: 'stern' }); fadeIn(lady, 1200);
    await sleep(1200);
    const l20 = say(S.L20); await sleep(3400);
    lady.look('tail'); sfx('pop', .5); T.pop(lady.x + 60, FL - 40, tr('!'), '#A93B32'); sch.look('surprise'); await l20;
    await say(S.L21);
    const l22 = say(S.L22); await sleep(700); lady.hop(3, 800); await l22;
    sch.look('sit');
    const l23 = say(S.L23); sch.wiggle(3, 500); await l23;
    await say(S.L24);
    const l25 = say(S.L25); await sleep(3000); T.pop(lady.x, FL - 250, tr('후후…'), '#1F2A56'); await l25;
    await say(S.L26);
    await sleep(SCENE_END);

    /* ===== 6. 달밤의 까치 (자동) ===== */
    await T.sceneCard(tr('달밤의 까치'), () => {
      scene('mg_bg_moonnest');
      put(T, dad, X(300, 400), FL - 160, { look: 'sit', to: 'right' });
      put(T, mom, X(470, 540), FL - 160, { look: 'sit', to: 'left' });
      for (let i = 0; i < N; i++) put(T, chicks[i], X(560 + i * 52, 600 + i * 44), FL - 150, { to: 'left' });
      camSnap(P ? 420 : 500, 280, 1);
    }, dad.pos);
    await say(S.L27);
    const l28 = say(S.L28); mom.hop(10, 320); await l28;
    const l29 = say(S.L29); dad.hop(12, 320); await l29;
    mom.turn('right');
    const cx6 = X(560 + (N - 1) * 26, 600 + (N - 1) * 22);
    const l30 = say(S.L30); await sleep(900); chicks.slice(0, N).forEach(c => c.hop(8, 300)); vo('chirp2'); T.pop(cx6, FL - 260, tr('짹짹!')); await l30;
    hide(mom); hide(dad);
    const flock = [dad, mom, friends[0], friends[1], friends[2]], FS = [1, 1, .9, .9, .85];
    flock.forEach((b, i) => {
      const y = 150 + (i % 2) * 70 + (i > 1 ? 50 : 0);
      put(T, b, -150 - i * 130, y, { look: 'fly', to: 'right', s: FS[i] });
      b.move(1150, y - 40, 3200 + i * 200, 'linear');
      (async () => { for (let j = 0; j < 10; j++) { b.hop(8, 380); await sleep(380); } })();
    });
    sfx('whoosh', .3);
    await say(S.L31);
    await cutSay('mg_cut_flock', S.L32);
    flock.forEach(hide); chicks.forEach(hide);
    await sleep(SCENE_END);

    /* ===== 7. 종탑 (톡 2: 종) ===== */
    await T.sceneCard(tr('종탑'), () => {
      scene('mg2_bg_belltower_night');
      put(T, bell, 500, 385);
      bell.body.style.transformOrigin = '0 -170px';
      put(T, dad, X(250, 330), 300, { look: 'fly', to: 'right' });
      put(T, mom, X(750, 670), 300, { look: 'fly', to: 'left' });
      camSnap(500, 280, 1);
    }, bell.pos);
    await say(S.L33);
    const l34 = say(S.L34); dad.hop(10, 320); await l34;
    bob(bell.pos);
    await say(S.L35);
    await T.tap(bell.pos, { prompt: '종을 톡 눌러 봐요.' });
    const hitL = 442, hitR = 558, backL = X(330, 400), backR = X(670, 600);
    const strike = async k => {
      const t0 = performance.now();
      const mv = k === 1 ? [[dad, hitL, backL]] : k === 2 ? [[mom, hitR, backR]] : [[dad, hitL, backL], [mom, hitR, backR]];
      sfx('whoosh', .4);
      await Promise.all(mv.map(([b, h]) => b.move(h, 300, 340, 'ease-in')));
      sfx('bonk', .7); mv.forEach(([b, h]) => T.pop(h, 232, tr('꽁!')));
      swingBell(bell); bellSfx(T, .9); T.shake(); setTimeout(() => T.pop(500, 165, tr('댕—'), '#1F2A56'), 250);
      const back = Promise.all(mv.map(([b, , bk]) => b.move(bk, 300, 520, 'ease-out')));
      mv.forEach(([b]) => b.wiggle(6, 520));
      await sleep(600); await say(S['L' + (35 + k)]); await back;
      await sleep(Math.max(0, STRIKE_GAP - (performance.now() - t0)));
    };
    for (const k of [1, 2, 3]) await strike(k);
    await cutSay('mg_cut_ring', S.L39);
    dad.look('tired'); mom.look('tired');
    put(T, dad, X(430, 440), 300, { look: 'tired' }); put(T, mom, X(560, 560), 300, { look: 'tired' });
    [dad, mom].forEach(b => { fadeIn(b, 900); b.move(b.x, 480, 1600, 'ease-in'); });
    sfx('paper_down', .4);
    await say(S.L40);
    await sleep(2500); await sleep(SCENE_END);

    /* ===== 8. 새벽 (자동) ===== */
    let dawn;
    await T.sceneCard(tr('새벽'), () => {
      scene('mg_bg_paperdoor'); dawn = tint(T, '#1F2A56', .28);
      put(T, sch, X(380, 440), FL, { look: 'sit' });
      put(T, lady, X(640, 590), FL, { look: 'stern' });
      if (P) camSnap(510, 280, 1);
    }, sch.pos);
    const l41 = say(S.L41);
    for (let k = 1; k <= 3; k++) {
      await sleep(k === 1 ? 600 : 0);
      bellSfx(T, .32); T.pop(X(880, 640), 150, tr('댕—'), '#1F2A56');
      lady.wiggle(4, 450).then(() => lady.move(lady.x + 14, FL, 260)); lady.hop(5, 300);
      if (k === 1) sch.look('surprise');
      await sleep(FAINT_GAP);
    }
    await l41;
    const l42 = say(S.L42); await l42;
    await say(S.L43);
    await fadeOut(T, lady, 700);
    put(T, snake, lady.x, FL, { look: 'coil' }); fadeIn(snake, 700); sparkleSfx(T, .4);
    await sleep(700);
    snake.look('flee', 'right'); snake.place(snake.x, FL + 8);
    sfx('swish', .5); T.pop(snake.x + 40, FL - 130, tr('스르르'));
    const sl = snake.move(1150, FL + 8, 2200, 'ease-in');
    await say(S.L44); await sl; hide(snake);
    T.anim(dawn, [{ opacity: .28 }, { opacity: 0 }], 2000).then(() => dawn.setAttribute('opacity', 0));
    const l45 = say(S.L45); sch.hop(10, 320); await l45;
    await sleep(SCENE_END);

    /* ===== 9. 아침 (톡 3: 마지막 인사) ===== */
    await T.sceneCard(tr('아침'), () => {
      scene('mg_bg_dawn');
      put(T, sch, -120, FL, { look: 'walk', to: 'right' });
    }, sch.pos);
    const steps9 = stepLoop(420, .5);
    const w9 = sch.move(1150, FL, 4200, 'linear');
    (async () => { for (let i = 0; i < 10; i++) { sch.hop(7, 380); await sleep(420); } })();
    await say(S.L46); await w9; steps9();
    await sleep(300);
    T.clear(); bgImage(T, 'mg_bg_belltower'); camSnap(500, 280, 1);
    put(T, dad, X(430, 440), 480, { look: 'tired' }); put(T, mom, X(560, 560), 480, { look: 'tired' });
    put(T, sch, X(1100, 1000), FL, { look: 'walk', to: 'left' });
    const w9b = sch.move(X(720, 660), FL, 2600, 'ease-out'); follow(560, 2600);
    await say(S.L47); await w9b;
    sch.look('surprise');
    await say(S.L48);
    sch.look('water', 'left'); sfx('splash', .35);
    for (let i = 0; i < 4; i++) {
      const d = T.el('circle', { r: 5, fill: '#BFD8EE', cx: sch.x - 95, cy: FL - 95 }, T.world);
      const tx = mom.x + 40 - (sch.x - 95), ty = 480 - 30 - (FL - 95);
      d.animate([{ translate: '0 0' }, { translate: `${tx / 2}px ${ty / 2 - 30}px`, offset: .5 }, { translate: `${tx}px ${ty}px` }], { duration: 480, delay: i * 110, easing: 'ease-in', fill: 'both' }).finished.then(() => d.remove()).catch(() => {});
    }
    T.pop(mom.x, 480 - 150, tr('똑똑!'));
    await say(S.L49);
    glow(mom, 1000); glow(dad, 1000); sparkleSfx(T);
    mom.hop(10, 420); dad.hop(10, 420);
    await say(S.L50); await say(S.L51);
    const l52 = say(S.L52);
    for (let i = 0; i < N; i++) { put(T, chicks[i], X(300 + i * 52, 392 + i * 44), 455, { to: 'right' }); fadeIn(chicks[i], 400); chicks[i].hop(12, 400); if (!i) vo('chirp2'); await sleep(120); }
    await l52;
    await cutSay('mg_cut_wake', S.L53);
    bob(sch.pos);
    await say(S.L54);
    await T.tap(sch.pos, { prompt: '선비를 톡 눌러 봐요.' });
    T.confetti(); sfx('tada', 1, () => sparkleSfx(T));
    sch.hop(30, 480); chicks.slice(0, N).forEach(c => c.hop(18, 460)); mom.hop(8, 460); dad.hop(8, 460);
    await say(S.L55);
    await say(S.L56);
    T.finale(); await sleep(1500);
    return '은혜를 잊지 않고 갚아요.';
  }

  Tale.mount({ title: '은혜 갚은 까치', subtitle: '은혜를 잊지 않고 갚아요', run: T => run(Tale.api) });
})();
