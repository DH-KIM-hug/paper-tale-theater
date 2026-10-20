/* 백설공주 — 그림 형제 원작 그대로. 기획: tales/snow_white/PLAN.md (11장, 2026-10-20 확정)
   거울·질투 → 사냥꾼 → 난쟁이 집 문(톡) → 식탁 → 일곱 번째 침대 → 난쟁이의 당부 → 큰 침대 짜기 →
   침대 여덟 개 세기(톡 한 번, 1~8 저절로) → 이제 잘 시간 침대 색 찾기(고르기 3번) → 할머니와 사과 → 유리관과 왕자(덜컹, 사과 조각) → 깨어나요(손 톡).
   톡은 세 번뿐(문 · 침대 세기 시작 · 깨어남), 연타 없음. 줄거리를 바꾸는 선택 없음. 입맞춤 없음.
   교훈: 질투는 마음을 해친다. 낯선 사람이 주는 것은 어른에게 물어보고 받는다.
   그림: assets/v3w/sw_*.webp (목록은 tools/app/gen/jobs_snow_white.json — sw_ 머리글자는 해와 바람과 같이 쓰므로 그 목록에 있는 것만 쓴다) */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 비율 (사방 여백 없이 오린 그림) */
  const ASP = { snow_stand: .43, snow_flee: .69, snow_eat: .435, snow_chair: .51, snow_bedtest: 1.3194, snow_bedsleep: 1.6522, snow_receive: .445,
    snow_sleep: 1.2752, snow_awake: .75, queen_mirror: .6, queen_fist: .605, hunter_shake: .52, dwarfs_row: 2.8188, dwarf_hammer: .84,
    dwarf_plank: .915, dwarf_smile: .57, dwarfs_worry: 1.03, granny_basket: .765, prince: .365,
    prop_mirror: .675, prop_apple: .925, prop_apple_bitten: .9187, prop_apple_piece: .9437, prop_coffin: 2.1875,
    prop_door_closed: 1.0063, prop_door_open: .9756, prop_table: 2.2556, prop_chair: .7929, prop_chair_7: .7857,
    prop_bed1: 1.5857, prop_bed2: 1.5857, prop_bed3: 1.5786, prop_bed4: 1.5857, prop_bed5: 1.5857, prop_bed6: 1.5857, prop_bed7: 1.5857,
    prop_bed_big: 1.5, prop_planks: 1.1938, prop_glow: .98, prop_petals: 1.0526 };
  const BGS = ['queen_room', 'forest', 'house_front', 'house_table', 'house_bed', 'hill'];
  const bgSrc = k => AS + 'sw_bg_' + k + '.webp', artSrc = k => AS + 'sw_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 }; /* 1600×902 그림이 무대 1000×560을 덮게 */
  const H_SNOW = 205;  /* 백설 키 (서기 기준). 어른(왕비·사냥꾼·할머니·왕자)은 조금 더 크고, 난쟁이는 백설 허리 조금 위 */

  /* 배우: 자세 그림 여러 장 중 하나만 보인다. poses = { 이름: [그림, 높이, 그림이 보는 쪽('left'|'right'|'front')] }
     a.look(자세, 방향) — 그림이 보는 쪽과 원하는 쪽이 다르면 뒤집는다 (앞모습은 뒤집지 않는다) */
  function mk(T, poses) {
    const looks = {};
    const a = T.actor(T.world, -400, 520, g => {
      Object.entries(poses).forEach(([k, [f, h, nat]]) => {
        const w = h * ASP[f], wrap = T.el('g', { filter: 'url(#pp)' }, g);
        T.el('image', { href: artSrc(f), x: -w / 2, y: -h, width: w, height: h, preserveAspectRatio: 'none' }, wrap);
        wrap.style.display = 'none'; looks[k] = { wrap, h, w, nat };
      });
    });
    a.want = 'left';
    a.turn = d => { a.want = d; const n = looks[a.cur].nat; a.face(n === 'front' || n === d ? 'left' : 'right'); };
    a.look = (k, d) => {
      Object.entries(looks).forEach(([n, l]) => { l.wrap.style.display = n === k ? '' : 'none'; });
      a.cur = k; a.h = looks[k].h; a.w = looks[k].w; a.turn(d || a.want);
    };
    a.look(Object.keys(poses)[0]);
    return a;
  }
  const prop = (T, f, h, nat = 'front') => mk(T, { a: [f, h, nat] });
  function put(T, a, x, y, { look, to, s = 1 } = {}) {
    T.world.appendChild(a.pos); a.pos.getAnimations().forEach(n => n.cancel()); a.pos.style.display = ''; a.pos.style.opacity = '';
    a.setScale(s); if (look) a.look(look, to); else if (to) a.turn(to);
    a.place(x, y); a.body.style.transform = ''; a.body.style.filter = '';
    return a;
  }
  const hide = a => { a.pos.style.display = 'none'; };
  const fadeIn = (a, ms = 450) => a.pos.animate([{ opacity: 0 }, { opacity: 1 }], ms);
  const fadeOut = async (T, a, ms = 450) => { await T.anim(a.pos, [{ opacity: 1 }, { opacity: 0 }], ms); hide(a); a.pos.style.opacity = ''; };
  /* 반짝 (세는 침대·깨어나는 백설) */
  const glow = (a, ms = 900) => { a.body.style.filter = 'url(#hintGlow)'; setTimeout(() => { a.body.style.filter = ''; }, ms); };

  function bgImage(T, key) {
    return T.el('image', { href: bgSrc(key), x: BGBOX.x, y: BGBOX.y, width: BGBOX.w, height: BGBOX.h, preserveAspectRatio: 'none' }, T.bg);
  }
  const sfx = (T, name, fb) => AudioFX.sfx(name) || fb && fb();
  const popSfx = T => sfx(T, 'pop', () => T.tone([500, 800], .12, { vol: .12 }));
  const NUM = ['하나!', '둘!', '셋!', '넷!', '다섯!', '여섯!', '일곱!', '여덟!'];

  async function run(T) {
    const { sleep, say, camSnap, tr } = T;
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990; /* 세로 화면: 가운데 일부만 보인다 → 카메라가 주인공을 따라간다 */
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); }; /* 말풍선 없는 소리 대사 (수 세기) */

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...Object.keys(ASP).map(k => T.preload(artSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    /* ---- 배우 ---- */
    const snow = mk(T, { stand: ['snow_stand', H_SNOW, 'front'], flee: ['snow_flee', H_SNOW, 'left'], eat: ['snow_eat', H_SNOW, 'front'],
      receive: ['snow_receive', H_SNOW, 'front'], awake: ['snow_awake', 150, 'front'],
      chair: ['snow_chair', 156, 'right'],                 /* 작은 의자째 그린 앉은 그림 (의자는 그림 왼쪽, 얼굴은 오른쪽) */
      bedtest: ['snow_bedtest', 100, 'left'], bedsleep: ['snow_bedsleep', 84, 'left'], sleep: ['snow_sleep', 118, 'left'], coffin: ['snow_sleep', 96, 'left'] });
    const queen = mk(T, { mirror: ['queen_mirror', 240, 'front'], fist: ['queen_fist', 240, 'front'] });
    const hunter = prop(T, 'hunter_shake', 238);
    const dwarfs = prop(T, 'dwarfs_row', 150);
    const worry = prop(T, 'dwarfs_worry', 150);
    const hammerD = prop(T, 'dwarf_hammer', 128, 'left'), plankD = prop(T, 'dwarf_plank', 128, 'left'), smileD = prop(T, 'dwarf_smile', 128);
    const granny = prop(T, 'granny_basket', 215, 'left');
    const prince = prop(T, 'prince', 228);
    const mirror = prop(T, 'prop_mirror', 230);
    const door = mk(T, { closed: ['prop_door_closed', 104, 'front'], open: ['prop_door_open', 107, 'front'] });
    const table = prop(T, 'prop_table', 165);
    const chairs = Array.from({ length: 7 }, (_, i) => prop(T, i === 6 ? 'prop_chair_7' : 'prop_chair', 84));
    const beds = Array.from({ length: 7 }, (_, i) => prop(T, 'prop_bed' + (i + 1), 100));
    const bigBed = prop(T, 'prop_bed_big', 150);
    const planks = prop(T, 'prop_planks', 92);
    const apple = mk(T, { whole: ['prop_apple', 34, 'front'], bitten: ['prop_apple_bitten', 34, 'front'] });
    const piece = prop(T, 'prop_apple_piece', 26);
    const coffin = prop(T, 'prop_coffin', 150);
    const shine = prop(T, 'prop_glow', 190);
    const tiny = prop(T, 'snow_stand', 46);              /* 1장: 창밖 뜰의 백설 (멀리 작게) */
    [snow, queen, hunter, dwarfs, worry, hammerD, plankD, smileD, granny, prince, mirror, door, table, ...chairs, ...beds, bigBed, planks, apple, piece, coffin, shine, tiny].forEach(hide);

    /* ===== 1. 거울 앞의 왕비 ===== */
    scene('queen_room');
    put(T, mirror, X(250, 385), 455);
    put(T, queen, X(470, 560), 528, { look: 'mirror' });
    if (!P) put(T, tiny, 738, 372);                       /* 창밖 뜰에 백설 */
    const ripple = T.el('ellipse', { cx: mirror.x, cy: 455 - 230 * .47, rx: 46, ry: 70, fill: 'none', stroke: '#F6ECD8', 'stroke-width': 6, opacity: 0 }, T.world);
    ripple.style.transformBox = 'fill-box'; ripple.style.transformOrigin = 'center';
    await T.curtain(true);
    await say('거울아, 거울아, 이 나라에서 누가 제일 예쁘니?');
    sfx(T, 'sparkle');
    const rip = ripple.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: .9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.25)' }], { duration: 1300, iterations: 3 });
    await say('왕비님도 예쁘지만, 백설공주가 더 예뻐요.');
    rip.cancel();
    queen.look('fist'); T.shake(); sfx(T, 'thud'); queen.hop(16, 320);
    await say('내가 제일이어야 해! 사냥꾼을 불러라.');
    await sleep(300);

    /* ===== 2. 숲속의 사냥꾼 ===== */
    await T.sceneCard(tr('깊은 숲'), () => {
      scene('forest');
      put(T, snow, X(400, 440), 530, { look: 'stand' });
      put(T, hunter, X(610, 575), 534);
    }, hunter.pos);
    const shakeHead = (async () => { await sleep(300); for (let i = 0; i < 3; i++) await hunter.wiggle(5, 520); })();
    await say('도저히 못 하겠어요. 공주님, 멀리 달아나세요.');
    await shakeHead;
    await say('고맙습니다.');
    snow.look('flee', 'left'); sfx(T, 'whoosh');
    await snow.move(X(-120, 240), 530, 1300, 'ease-in');
    hide(snow);

    /* ===== 3. 난쟁이 집 문 (톡 1: 첫 조작) ===== */
    await T.sceneCard(tr('작은 집'), () => {
      scene('house_front');
      put(T, door, 314, 339, { look: 'closed' });          /* 그림 속 집의 문 자리에 딱 맞춘 문 */
      put(T, snow, 420, 352, { look: 'stand', s: .62 });
      camSnap(X(370, 330), 270, P ? 1.5 : 1.7);
    }, door.pos);
    await say('난쟁이 집에 들어가 볼까?');
    door.pos.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3, easing: 'ease-in-out' });
    await T.tap(door.pos, { prompt: '난쟁이 집에 들어가 볼까?' });
    sfx(T, 'creak', () => sfx(T, 'door'));
    door.look('open'); T.pop(314, 200, tr('끼익!'));
    await sleep(700);
    await snow.move(330, 345, 1100);
    await T.anim(snow.pos, [{ opacity: 1 }, { opacity: 0 }], 400); hide(snow); snow.pos.style.opacity = '';
    await sleep(300);

    /* ===== 4. 집 안 식탁 ===== */
    const CHX = X([450, 530, 610, 690, 770, 850], [450, 530, 610, 690, 770, 850]), C7 = 330, FL = 548;
    await T.sceneCard(tr('작은 식탁'), () => {
      scene('house_table');
      put(T, table, 640, FL - 30);
      chairs.forEach((c, i) => put(T, c, i < 6 ? CHX[i] : C7, FL));
      put(T, snow, 150, FL, { look: 'stand' });
      if (P) camSnap(380, 280, 1);
    }, table.pos);
    await snow.move(X(230, 300), FL, 700);
    await say('어머, 작은 집이네. 배가 고프니 조금만 먹어 볼게.');
    /* 접시마다 조금씩 맛보고(냠), 컵의 물을 마신다(꿀꺽). 뒤쪽 식탁 앞을 따라 걷는다 */
    snow.look('eat');
    for (const [x, w] of [[500, '냠!'], [640, '냠냠!'], [780, '꿀꺽!']]) {
      follow(x); await snow.move(x, FL, 650);
      sfx(T, w === '꿀꺽!' ? 'gulp' : 'chomp', () => popSfx(T)); snow.hop(10, 300); T.pop(x, FL - 250, tr(w));
      await sleep(900);
    }
    /* 의자를 차례로 앉아 보다가(끙, 너무 작아) 일곱 번째 의자에 앉는다 */
    snow.look('stand');
    for (const i of [5, 3]) {
      follow(CHX[i]); await snow.move(CHX[i], FL + 4, 600);
      snow.wiggle(6, 420); sfx(T, 'squeak', () => popSfx(T)); T.pop(CHX[i], FL - 240, tr('끙!'));
      await sleep(800);
    }
    follow(C7); await snow.move(C7 + 40, FL + 4, 1100);
    hide(chairs[6]);                                       /* 앉은 그림에 의자가 함께 있다 → 그 자리의 의자는 감춘다 */
    put(T, snow, C7 + 156 * .51 * .13, FL, { look: 'chair', to: 'right' }); /* 그림 속 의자 가운데를 의자 자리에 */
    sfx(T, 'paper_down', () => popSfx(T)); T.pop(C7, FL - 230, tr('쏙!'));
    await sleep(500);
    await say('이 의자가 딱 맞아요. 그런데 졸려요.');
    await sleep(300);

    /* ===== 5. 일곱 번째 침대 ===== */
    /* 작은 침대 일곱 개: 두 줄로 엇갈려 놓는다 (뒷줄 1·3·5·7, 앞줄 2·4·6 — 왼쪽부터 차례). 한 줄이면 너무 작아진다 */
    const BX = [125, 250, 375, 500, 625, 750, 875], BYs = i => (i % 2 ? 556 : 494), BS = i => (i % 2 ? 1 : .9);
    const layBeds = () => { [0, 2, 4, 6, 1, 3, 5].forEach(i => put(T, beds[i], BX[i], BYs(i), { s: BS(i) })); };
    /* 누운 백설: 이불 위에 머리가 베개 쪽(왼쪽)으로. 그 침대 바로 앞(앞줄 침대 뒤)에 끼워 넣는다 */
    const onBed = (i, look) => {
      put(T, snow, BX[i] + 8, BYs(i) - 100 * BS(i) * .3, { look, to: 'left', s: BS(i) });
      T.world.insertBefore(snow.pos, beds[i].pos.nextSibling);
    };
    await T.sceneCard(tr('작은 침대'), () => {
      scene('house_bed');
      layBeds();
      onBed(0, 'bedtest');
      if (P) camSnap(BX[0], 280, 1);
    }, beds[0].pos);
    const tries = (async () => {
      await sleep(400); snow.wiggle(6, 420); T.pop(BX[0], 300, tr('끙!'));
      await sleep(1100); follow(BX[1], 500); onBed(1, 'bedtest'); popSfx(T); await sleep(300); snow.wiggle(6, 420); T.pop(BX[1], 330, tr('끙!'));
      await sleep(1100); follow(BX[6], 900); onBed(6, 'bedsleep'); popSfx(T); T.pop(BX[6], 300, tr('쏙!'));
    })();
    await say('이 침대는 안 맞아. 이 침대도 안 맞아… 이 침대가 딱 맞아요.');
    await tries;
    T.pop(BX[6] - 40, 290, tr('새근새근'));
    await sleep(1500);

    /* ===== 6. 난쟁이의 당부 ===== */
    await T.sceneCard(tr('난쟁이들'), () => {
      scene('house_bed');
      layBeds();
      onBed(6, 'bedsleep');
      put(T, dwarfs, -260, 558);
      if (P) camSnap(BX[6], 280, 1);
    }, beds[6].pos);
    sfx(T, 'step_wood');
    await dwarfs.move(X(400, 640), 558, 1600);
    await say('누가 우리 침대에서 자고 있지?');
    sfx(T, 'sparkle'); put(T, snow, BX[6] + 6, BYs(6) - 24, { look: 'awake', s: .74 }); T.world.insertBefore(snow.pos, beds[6].pos.nextSibling);
    snow.hop(10, 300);
    await say('저 여기서 지내도 될까요?');
    dwarfs.hop(14, 360);
    await say('그럼, 대신 낯선 사람에겐 문을 열지 마!');
    await sleep(300);

    /* ===== 7. 큰 침대를 짜 주어요 ===== */
    await T.sceneCard(tr('큰 침대'), () => {
      scene('house_bed');
      put(T, planks, X(500, 500), 548);
      put(T, hammerD, X(370, 420), 548, { to: 'right' });
      put(T, plankD, X(630, 585), 548, { to: 'left' });
      put(T, snow, X(830, 620), 540, { look: 'stand' });
      if (P) hide(snow);
    }, planks.pos);
    await say('백설에게 맞는 큰 침대를 짜 줄게!');
    for (let i = 0; i < 3; i++) {
      hammerD.wiggle(10, 360); plankD.hop(10, 360);
      sfx(T, 'knock', () => T.tone([180, 90], .12, { type: 'square', vol: .12 }));
      T.pop(X(500, 500) + [-60, 50, -10][i], 330, tr(['뚝딱!', '쿵쿵!', '뚝딱!'][i]));
      await sleep(1000);
    }
    await fadeOut(T, planks, 300);
    put(T, bigBed, X(500, 500), 552); fadeIn(bigBed, 500); sfx(T, 'tada', () => popSfx(T)); glow(bigBed, 1200);
    hide(hammerD); put(T, smileD, X(370, 420), 548); smileD.hop(14, 340);
    if (P) { put(T, snow, 620, 540, { look: 'stand' }); camSnap(560, 280, 1); }
    snow.hop(16, 340);
    await say('고맙습니다!');
    await sleep(400);

    /* ===== 8. 침대 여덟 개 (배움 놀이: 세기 — 톡 한 번, 1~8 저절로) ===== */
    /* 작은 침대 일곱(두 줄로 엇갈려, 왼쪽부터 1~7) + 오른쪽 큰 침대(8) */
    const SX = [70, 160, 250, 340, 430, 520, 610], SYs = i => (i % 2 ? 552 : 496), SS = i => (i % 2 ? .82 : .74), SY = 552, BIGX = 790;
    let bedsG;
    await T.sceneCard(tr('침대 여덟 개'), () => {
      scene('house_bed');
      hide(smileD); hide(plankD);
      put(T, dwarfs, 340, 470, { s: .8 });                /* 난쟁이들은 침대 뒤 벽 앞에 */
      put(T, snow, 930, 552, { look: 'stand', s: .92 });
      bedsG = T.el('g', {}, T.world);
      [0, 2, 4, 6, 1, 3, 5].forEach(i => { put(T, beds[i], SX[i], SYs(i), { s: SS(i) }); bedsG.appendChild(beds[i].pos); });
      put(T, bigBed, BIGX, SY + 2); bedsG.appendChild(bigBed.pos);
      T.world.appendChild(snow.pos);
      if (P) camSnap(SX[2], 280, 1);
    }, bigBed.pos);
    await say('침대가 몇 개일까요? 톡 눌러 봐요.');
    await T.tap(bedsG, { prompt: '침대가 몇 개일까요? 톡 눌러 봐요.' });
    const all = [...beds, bigBed];
    for (let i = 0; i < 8; i++) {
      const b = all[i];
      if (P) T.camTo(Math.min(Math.max(b.x, SX[2]), BIGX), 280, 1, 450);
      AudioFX.countBeat && AudioFX.countBeat(i + 1); popSfx(T); vo('n' + (i + 1));
      glow(b, 800); b.hop(i === 7 ? 18 : 12, 360);
      T.pop(b.x, i === 7 ? 330 : (i % 2 ? 420 : 360), tr(NUM[i]));
      await sleep(i === 6 ? 1300 : 950);                  /* 일곱 다음에 한 박 쉬고 큰 침대 */
    }
    if (P) T.camTo(560, 280, 1, 700);
    await say('작은 침대 일곱 개에, 큰 침대 하나 더 해서 여덟 개!');
    dwarfs.hop(14, 360); snow.hop(16, 360);
    /* 이제 잘 시간! 침대 색 찾기 (고르기 3번, 일곱 색에서 겹치지 않게 무작위). 줄거리와 무관한 배움 놀이 */
    await say('이제 잘 시간! 난쟁이들이 침대를 찾아요.');
    const BCOL = ['빨간', '주황', '노란', '초록', '파란', '보라', '갈색'];   /* 침대 1~7 이불 색 */
    let relaid = false;
    if (P) {                                              /* 세로 화면: 일곱 침대를 두 줄씩 모아 한 화면에 */
      await T.anim(bedsG, [{ opacity: 1 }, { opacity: 0 }], 250);
      hide(dwarfs);
      const GP = [[190, 200], [340, 200], [490, 200], [265, 320], [415, 320], [265, 440], [415, 440]];
      beds.forEach((b, i) => put(T, b, GP[i][0], GP[i][1], { s: .85 }));
      hide(bigBed); camSnap(340, 280, 1); relaid = true;
      beds.forEach(b => fadeIn(b, 350));
      await sleep(400);
    }
    const order = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - .5).slice(0, 3);
    for (const k of order) {
      const q = BCOL[k] + ' 침대를 찾아 볼까요?';
      await say(q);
      const opts = beds.map((b, i) => ({ el: b.pos, ok: i === k,
        onWrong: async () => { await b.wiggle(8, 360); await say('그건 ' + BCOL[i] + ' 침대예요.'); } }));
      await T.choose(opts, { prompt: q });
      const b = beds[k];
      glow(b, 1200); b.hop(14, 400); sfx(T, 'sparkle', () => popSfx(T));
      T.pop(b.x, b.y - 100 * (relaid ? .85 : (k % 2 ? .82 : .74)) - 30, tr('쿨쿨'));
      await say('맞아요, ' + BCOL[k] + ' 침대!');
      await sleep(300);
    }
    if (relaid) {
      [0, 2, 4, 6, 1, 3, 5].forEach(i => put(T, beds[i], SX[i], SYs(i), { s: SS(i) }));
      put(T, bigBed, BIGX, SY + 2); put(T, dwarfs, 340, 470, { s: .8 }); T.world.insertBefore(dwarfs.pos, beds[0].pos); camSnap(560, 280, 1);
    }
    await say('모두 함께 지내서 행복해요.');
    await sleep(400);

    /* ===== 9. 할머니와 사과 ===== */
    await T.sceneCard(tr('사과 할머니'), () => {
      scene('house_front');
      put(T, door, 314, 339, { look: 'closed' });
      put(T, snow, X(440, 445), 530, { look: 'stand', to: 'right' });
      put(T, granny, X(820, 760), 532, { to: 'left' });
    }, snow.pos);
    await granny.move(X(640, 580), 532, 1500);
    /* 할머니 손끝에서 사과를 내민다 */
    const handX = () => granny.x - 215 * .765 * .42, handY = 532 - 215 * .52;
    put(T, apple, handX(), handY, { look: 'whole' }); fadeIn(apple, 300);
    await say('맛있는 사과란다. 하나 먹어 보렴.');
    snow.look('receive');
    await apple.move(snow.x + 4, 530 - H_SNOW * .44, 700);
    sfx(T, 'pop');
    await say('고맙습니다, 할머니!');
    await sleep(300);
    apple.look('bitten'); sfx(T, 'chomp', () => popSfx(T)); T.pop(snow.x, 530 - H_SNOW - 30, tr('아삭!'));
    await sleep(1200);
    hide(apple);
    await T.anim(snow.body, [{ transform: 'rotate(0deg)', opacity: 1 }, { transform: 'rotate(-8deg)', opacity: .4 }], 700);
    snow.body.style.transform = ''; snow.body.style.opacity = '';
    put(T, snow, snow.x - 10, 534, { look: 'sleep', to: 'left' }); fadeIn(snow, 500);
    sfx(T, 'slide_down');
    granny.turn('right');
    await granny.move(X(1150, 1000), 532, 1600);
    hide(granny);
    await sleep(600);

    /* ===== 10. 유리관과 왕자 ===== */
    const CX = 500, CY = 530;
    /* 유리관 속 백설: 관 그림(뒤) → 백설 → 같은 관 그림을 옅게 한 장(유리) + 꽃 장식 받침만 오린 한 장(앞).
       그래서 백설이 관 위가 아니라 유리 안에 누워 보인다 */
    const CW = 150 * ASP.prop_coffin;
    let glass = null;
    const inCoffin = () => {
      put(T, snow, CX + 4, CY - 150 * .24, { look: 'coffin', to: 'left' });
      glass = T.el('g', {}, T.world);
      const href = artSrc('prop_coffin'), box = { x: CX - CW / 2, y: CY - 150, width: CW, height: 150, preserveAspectRatio: 'none' };
      T.el('image', { href, ...box, opacity: .3 }, glass);
      const cid = 'swBase' + (inCoffin.n = (inCoffin.n || 0) + 1);
      T.el('rect', { x: CX - CW / 2, y: CY - 150 * .27, width: CW, height: 150 * .27 }, T.el('clipPath', { id: cid }, glass));
      T.el('image', { href, ...box, 'clip-path': `url(#${cid})` }, glass);
      glass.style.transformBox = 'view-box';
    };
    await T.sceneCard(tr('유리관'), () => {
      scene('hill');
      put(T, coffin, CX, CY);
      inCoffin();
      put(T, worry, X(205, 360), 548);
      if (P) camSnap(430, 280, 1);
    }, coffin.pos);
    await say('백설공주님이 깨어나지 않아요…');
    put(T, prince, X(1100, 900), 540); prince.face('left');
    await Promise.all([prince.move(X(770, 640), 540, 1700), follow(560, 1700)]);
    await say('이 분을 제 성으로 모셔 가도 될까요?');
    /* 관을 옮기다 덜컹 → 목에 걸린 사과 조각이 툭 빠진다 */
    await sleep(300);
    sfx(T, 'thud'); T.shake(); T.pop(CX, CY - 220, tr('덜컹!'));
    const jolt = [{ translate: '0 0', rotate: '0deg' }, { translate: '0 -14px', rotate: '-1.5deg' }, { translate: '0 0', rotate: '1deg' }, { translate: '0 0', rotate: '0deg' }];
    await Promise.all([coffin.pos, snow.pos, glass].map(n => { n.style.transformOrigin = `${CX}px ${CY}px`; return n.animate(jolt, 650).finished; }));
    const mouthX = snow.x - 96 * ASP.snow_sleep * .3, mouthY = snow.y - 96 * .72;
    put(T, piece, mouthX, mouthY);
    sfx(T, 'pop');
    await piece.move(mouthX - 70, 560, 700, 'ease-in');
    T.pop(mouthX - 70, 470, tr('툭!'));
    await sleep(1200);

    /* ===== 11. 깨어나요 (톡 3: 백설의 손을 톡) ===== */
    await T.sceneCard(tr('깨어나요'), () => {
      scene('hill');
      put(T, coffin, CX, CY);
      put(T, shine, CX, CY - 40); hide(shine);
      inCoffin();
      put(T, dwarfs, X(195, 330), 550, { s: .85 });
      put(T, prince, X(770, 650), 540);
      if (P) camSnap(500, 280, 1);
    }, snow.pos);
    /* 손 자리(배 위에 모은 두 손)를 누르는 곳으로 */
    /* 유리 뚜껑·관 앞판이 백설 위를 덮고 있어 백설을 직접 누를 수 없다 → 맨 위에 투명한 누르는 자리를 따로 둔다 (2026-10-20) */
    const hand = T.el('circle', { cx: snow.x, cy: snow.y - 48, r: 90, fill: '#fff', opacity: 0 }, T.world);
    snow.pos.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 1600, iterations: 3, easing: 'ease-in-out' });
    await T.tap(hand, { prompt: '백설공주의 손을 톡!' });
    hand.remove();
    glass.remove();                                        /* 유리 뚜껑을 열었다 */
    T.world.insertBefore(shine.pos, coffin.pos.nextSibling);
    shine.pos.style.display = ''; fadeIn(shine, 700);
    shine.body.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(.9)' }], { duration: 1600, iterations: Infinity, easing: 'ease-in-out' });
    sfx(T, 'sparkle', () => T.tone([700, 1400], .4, { vol: .12 }));
    put(T, snow, CX + 10, CY - 30, { look: 'awake' }); fadeIn(snow, 500); glow(snow, 1200);
    T.world.appendChild(prince.pos); T.world.appendChild(dwarfs.pos);
    /* 꽃잎이 팔랑팔랑 내린다 */
    for (let i = 0; i < 9; i++) {
      const p = prop(T, 'prop_petals', 44 + (i % 3) * 14);
      put(T, p, 80 + i * 105, -40);
      p.body.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 0 }, { transform: 'translate(-30px,240px) rotate(160deg)', opacity: 1, offset: .5 }, { transform: 'translate(20px,560px) rotate(320deg)', opacity: 0 }],
        { duration: 5200 + (i % 4) * 700, delay: i * 260, iterations: 2, easing: 'ease-in-out' });
    }
    dwarfs.hop(16, 360); prince.hop(10, 360);
    await say('어머, 제가 오래 잤네요.');
    await say('이제 낯선 사람이 주는 건 어른에게 먼저 물어봐요!');
    await sleep(300);
    await say('왕비는 멀리 떠났어요');
    T.confetti();
    await Promise.all([snow.hop(20, 460), dwarfs.hop(20, 460), prince.hop(14, 460)]);
    T.finale();
    await sleep(1500);
    return '낯선 사람이 주는 건 어른에게 먼저 물어봐요!';
  }

  Tale.mount({ title: '백설공주', subtitle: '질투는 마음을 해쳐요', run: T => run(Tale.api) });
})();
