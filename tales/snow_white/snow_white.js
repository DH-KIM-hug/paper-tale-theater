/* 백설공주 — 그림 형제 원작 그대로. 기획: tales/snow_white/PLAN.md (11장, 2026-10-20 확정), 화면·대사: SCRIPT.md (2026-10-20 재기획)
   거울·질투 → 사냥꾼 → 난쟁이 집 문(톡) → 식탁 → 일곱 번째 침대 → 난쟁이의 당부 → 큰 침대 짜기 →
   침대 여덟 개 세기(톡 한 번, 1~8 저절로) → 이제 잘 시간 침대 색 찾기(고르기 3번) → 할머니와 사과 → 유리관과 왕자(덜컹, 사과 조각) → 깨어나요(손 톡).
   톡은 세 번뿐(문 · 침대 세기 시작 · 깨어남), 연타 없음. 줄거리를 바꾸는 선택 없음. 입맞춤 없음.
   크기 원칙: 백설은 모든 장면에서 같은 크기다 (자세마다 머리 크기가 같게 높이를 맞췄다). 난쟁이 가구가 백설에게 작은 것이지, 백설을 줄이지 않는다.
   난쟁이 목소리: 일곱 명이 따로(dwarfa~g). [난쟁이들] 대사는 일곱 목소리를 겹친 합창 파일(chorus.js, mix_chorus.py).
   교훈: 질투는 마음을 해친다. 낯선 사람이 주는 것은 어른에게 물어보고 받는다.
   그림: assets/v3w/sw_*.webp (목록은 tools/app/gen/jobs_snow_white.json — sw_ 머리글자는 해와 바람과 같이 쓰므로 그 목록에 있는 것만 쓴다) */
(() => {
  const AS = '../../assets/v3w/';
  /* 그림 폭/높이 비율 (사방 여백 없이 오린 그림) */
  const ASP = { snow_stand: .43, snow_flee: .69, snow_eat: .435, snow_chair_small: .6017, snow_chair: .51, snow_bedsleep: 1.6522, snow_receive: .445,
    snow_awake: .75, queen_mirror: .6, queen_fist: .605, hunter_shake: .52, dwarfs_row: 2.8188, dwarf_hammer: .84,
    dwarf_plank: .915, dwarf_smile: .57, dwarfs_worry: 1.03, granny_basket: .765, prince: .365,
    prop_mirror: .675, prop_apple: .925, prop_apple_bitten: .9187, prop_apple_piece: .9437, prop_coffin: 2.1875,
    prop_door_closed: 1.0063, prop_door_open: .9756, prop_table: 2.2556, prop_chair: .7929, prop_chair_7: .7857,
    prop_bed1: 1.5857, prop_bed2: 1.5857, prop_bed3: 1.5786, prop_bed4: 1.5857, prop_bed5: 1.5857, prop_bed6: 1.5857, prop_bed7: 1.5857,
    prop_bed_big: 1.5, prop_planks: 1.1938, prop_glow: .98, prop_petals: 1.0526,
    snow_bedknees: 1.5738, snow_bedtoes: 1.5786, snow_bedcurl: 1.519, prop_mirror_face: .9875, prop_lantern: .6833 };
  const BGS = ['queen_room', 'forest', 'house_front', 'house_table2', 'house_bed2', 'hill'];
  const bgSrc = k => AS + 'sw_bg_' + k + '.webp', artSrc = k => AS + 'sw_' + k + '.webp';
  const BGBOX = { x: -40, y: -24, w: 1080, h: 1080 * 992 / 1760 }; /* 1600×902 그림이 무대 1000×560을 덮게 */
  const H_SNOW = 205;  /* 백설 키 (서기 기준). 어른(왕비·사냥꾼·할머니·왕자)은 조금 더 크고, 난쟁이는 백설 허리 조금 위 */
  /* 작은 침대 높이(5·6장). 침대에 누운 백설 그림(침대째 그림)도 이 침대 크기에 맞추면 백설이 서 있을 때와 같은 크기가 된다 */
  const BED_H = 140;

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

  let uid = 0;
  /* 배경 위에 얇은 색 한 장 (해 질 녘·밤). 인물은 그 위에 있어 그대로 보인다 */
  const tint = (T, fill, op) => T.el('rect', { x: -60, y: -40, width: 1120, height: 660, fill, opacity: op }, T.bg);

  /* 거울 속 백설 얼굴: 거울 유리(타원) 안에서 은빛 파문과 함께 천천히 떠오른다 */
  function mirrorFace(T, mx, my) {
    const g = T.el('g', { opacity: 0 }, T.world), id = 'swMf' + (++uid), D = 84;
    T.el('ellipse', { cx: mx, cy: my, rx: 43, ry: 66 }, T.el('clipPath', { id }, g));
    T.el('image', { href: artSrc('prop_mirror_face'), x: mx - D / 2, y: my - D / 2 / ASP.prop_mirror_face, width: D, height: D / ASP.prop_mirror_face,
      preserveAspectRatio: 'none', 'clip-path': `url(#${id})` }, g);
    const ring = T.el('ellipse', { cx: mx, cy: my, rx: 46, ry: 70, fill: 'none', stroke: '#DCE3EE', 'stroke-width': 5, opacity: 0 }, T.world);
    ring.style.transformBox = 'fill-box'; ring.style.transformOrigin = 'center';
    let rip = null;
    return {
      show() {
        rip = ring.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: .9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.25)' }], { duration: 1300, iterations: 3 });
        g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1600, delay: 300, fill: 'forwards', easing: 'ease-out' });
      },
      hide() { if (rip) rip.cancel(); g.getAnimations().forEach(a => a.cancel()); g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'forwards' }); },
    };
  }

  /* 일곱 난쟁이 한 줄 그림을 일곱 조각으로 오려(같은 그림, 자리만 나눠 자름) 말하는 난쟁이만 콩 뛰게 한다.
     등불(lantern)은 몇 명의 손 쪽에 붙여 함께 뛴다 */
  function crew(T, { lanterns = false } = {}) {
    const H = 150, W = H * ASP.dwarfs_row, one = W / 7, subs = [];
    const a = T.actor(T.world, -400, 520, g => {
      const wrap = T.el('g', { filter: 'url(#pp)' }, g);
      for (let i = 0; i < 7; i++) {
        const sg = T.el('g', {}, wrap), id = 'swDw' + (++uid);
        const x0 = -W / 2 + one * i - (i ? .5 : 30), x1 = -W / 2 + one * (i + 1) + (i < 6 ? .5 : 30);
        T.el('rect', { x: x0, y: -H - 40, width: x1 - x0, height: H + 50 }, T.el('clipPath', { id }, sg));
        T.el('image', { href: artSrc('dwarfs_row'), x: -W / 2, y: -H, width: W, height: H, preserveAspectRatio: 'none', 'clip-path': `url(#${id})` }, sg);
        if (lanterns && i % 3 === 0) {
          const lh = 40, lw = lh * ASP.prop_lantern;
          T.el('image', { href: artSrc('prop_lantern'), x: -W / 2 + one * (i + .5) + one * .18 - lw / 2, y: -H * .52, width: lw, height: lh, preserveAspectRatio: 'none' }, sg);
        }
        subs.push(sg);
      }
    });
    a.hopOne = (i, h = 16, ms = 420) => subs[i].animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-h}px)` }, { transform: 'translateY(0)' }], { duration: ms, easing: 'ease-out' }).finished.catch(() => {});
    a.hopAll = (h = 14, ms = 420) => Promise.all(subs.map((_, i) => sleep0(i * 60).then(() => a.hopOne(i, h, ms))));
    return a;
  }
  const sleep0 = ms => new Promise(r => setTimeout(r, ms));

  async function run(T) {
    const { sleep, camSnap, tr } = T;
    /* 대사 사이에 숨 한 번 (3~4세가 따라오게, 한 편 6~7분) */
    const say = async text => { await T.say(text); await sleep(700); };
    const scene = key => { T.clear(); bgImage(T, key); camSnap(500, 280, 1); };
    const P = T.viewWidth() < 990; /* 세로 화면: 가운데 일부만 보인다 → 카메라가 주인공을 따라간다 */
    const X = (l, p) => (P ? p : l);
    const follow = (x, ms = 700) => (P ? T.camTo(x, 280, 1, ms) : Promise.resolve());
    const vo = k => { const u = Narrator.voiceLine(k); return u && AudioFX.voice(u); }; /* 말풍선 없는 소리 대사 (수 세기) */

    const loads = [...BGS.map(k => T.preload(bgSrc(k))), ...Object.keys(ASP).map(k => T.preload(artSrc(k)))];
    await Promise.race([Promise.all(loads), sleep(4000)]);

    /* ---- 배우 ---- (높이는 자세마다 머리 크기가 서 있을 때와 같아지게 잰 값) */
    const snow = mk(T, { stand: ['snow_stand', H_SNOW, 'front'], flee: ['snow_flee', 167, 'right'], eat: ['snow_eat', H_SNOW, 'front'],
      receive: ['snow_receive', H_SNOW, 'front'], awake: ['snow_awake', 152, 'front'],
      chair: ['snow_chair_small', 170, 'right'],                 /* 작은 의자째 그린 앉은 그림 (의자는 그림 왼쪽, 얼굴은 오른쪽) */
      /* 작은 침대째 그린 누운 그림 3장: 침대 부분이 BED_H 침대와 같은 크기가 되는 높이 */
      bedknees: ['snow_bedknees', 140, 'front'], bedtoes: ['snow_bedtoes', 140, 'front'], bedcurl: ['snow_bedcurl', 146, 'front'],
      coffin: ['snow_bedsleep', 98, 'left'] });
    const BED_DX = { bedknees: 0, bedtoes: 0, bedcurl: 0 };   /* 그림 속 침대 가운데를 침대 자리에 */
    const queen = mk(T, { mirror: ['queen_mirror', 240, 'right'], fist: ['queen_fist', 240, 'right'] }); // 그림은 오른쪽을 본다 → 왼쪽 거울을 보게 뒤집는다 (2026-10-20)
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
    [snow, queen, hunter, dwarfs, worry, hammerD, plankD, smileD, granny, prince, mirror, door, table, ...chairs, ...beds, bigBed, planks, apple, piece, coffin, shine].forEach(hide);

    /* 거울 장면 (1장, 9장 처음) */
    const MY = 455, MCY = MY - 230 * .47;
    const mirrorRoom = () => {
      scene('queen_room');
      put(T, mirror, X(250, 385), MY);
      put(T, queen, X(470, 560), 528, { look: 'mirror', to: 'left' });
      return mirrorFace(T, X(250, 385), MCY);
    };

    /* ===== 1. 거울 앞의 왕비 ===== */
    let mf = mirrorRoom();
    await T.curtain(true);
    await say('옛날 어느 나라에 눈처럼 하얀 얼굴의 공주가 살았어요. 이름은 백설공주였어요.');
    await say('왕비에게는 무엇이든 대답하는 신기한 거울이 있었어요.');
    await say('거울아, 거울아, 이 나라에서 누가 제일 예쁘니?');
    sfx(T, 'sparkle'); mf.show();
    await say('왕비님도 예쁘지만, 백설공주가 더 예뻐요.');
    queen.look('fist'); T.shake(); sfx(T, 'thud'); queen.hop(16, 320);
    await say('왕비는 샘이 나서 얼굴이 빨개졌어요.');
    mf.hide();
    queen.hop(12, 300);
    await say('내가 제일이어야 해! 사냥꾼을 불러라!');
    await sleep(300);

    /* ===== 2. 숲속의 사냥꾼 ===== */
    await T.sceneCard(tr('깊은 숲'), () => {
      scene('forest');
      put(T, snow, X(400, 440), 530, { look: 'stand' });
      put(T, hunter, X(610, 575), 534);
    }, hunter.pos);
    await say('사냥꾼은 백설공주를 깊은 숲으로 데려갔어요.');
    const shakeHead = (async () => { await sleep(300); for (let i = 0; i < 3; i++) await hunter.wiggle(5, 520); })();
    await say('공주님, 저는 도저히 못 하겠어요. 멀리멀리 달아나세요.');
    await shakeHead;
    await say('고맙습니다, 아저씨.');
    snow.look('flee', 'left'); sfx(T, 'whoosh');
    await Promise.all([say('백설공주는 어두운 숲을 혼자 달리고 또 달렸어요.'),
      (async () => { await snow.move(X(-120, 240), 530, 1600, 'ease-in'); hide(snow); })()]);

    /* ===== 3. 작은 집 (톡 1: 첫 조작) ===== */
    const FAR = .62;                                       /* 집이 멀리 보이는 장면: 카메라를 당겨 화면 속 백설 크기는 다른 장면과 같다 */
    await T.sceneCard(tr('작은 집'), () => {
      scene('house_front'); tint(T, '#E8703A', .16);       /* 해 질 녘 */
      put(T, door, 314, 339, { look: 'closed' });          /* 그림 속 집의 문 자리에 딱 맞춘 문 */
      put(T, snow, 520, 352, { look: 'stand', s: FAR });
      camSnap(X(370, 380), 270, P ? 1.5 : 1.7);
    }, door.pos);
    await Promise.all([say('날이 저물 무렵, 백설공주는 숲속에서 아주 작은 집을 찾았어요.'), snow.move(410, 352, 1800)]);
    await say('어머, 정말 작은 집이네. 계세요? 아무도 안 계세요?');
    door.pos.animate([{ translate: '0 0' }, { translate: '0 -5px' }, { translate: '0 0' }], { duration: 900, iterations: 3, easing: 'ease-in-out' });
    await say('문을 톡 두드려 볼까요?');
    await T.tap(door.pos, { prompt: '문을 톡 두드려 볼까요?' });
    sfx(T, 'knock', () => T.tone([180, 90], .12, { type: 'square', vol: .12 })); T.pop(314, 170, tr('똑똑!'));
    await sleep(700);
    sfx(T, 'creak', () => sfx(T, 'door'));
    /* 문이 왼쪽 경첩을 따라 열린다: 닫힌 문 → 반쯤 열림(뒤에 어두운 안쪽) → 활짝 열린 그림 */
    const dark = T.el('rect', { x: 314 - 51, y: 339 - 100, width: 102, height: 100, fill: '#2B1D14' }, T.world);
    T.world.insertBefore(dark, door.pos);
    door.body.style.transformBox = 'fill-box'; door.body.style.transformOrigin = '0% 50%';
    await T.anim(door.body, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(.55)' }], 420);
    door.body.style.transform = 'scaleX(.55)'; T.pop(314, 150, tr('삐걱!'));
    await T.anim(door.body, [{ transform: 'scaleX(.55)' }, { transform: 'scaleX(.9)' }], 260);
    door.body.style.transform = ''; door.look('open'); dark.remove();
    await say('삐걱, 문이 열렸어요. 집 안에는 아무도 없었어요.');
    /* 열린 문 안쪽(어두운 방)으로 걸어 들어간다 */
    await snow.move(314, 345, 900);
    snow.setScale(.8 * FAR);
    snow.body.style.filter = 'brightness(.3)';
    await T.anim(snow.pos, [{ opacity: 1 }, { opacity: 0 }], 500); hide(snow); snow.pos.style.opacity = ''; snow.body.style.filter = '';
    await sleep(200);

    /* ===== 4. 작은 식탁 ===== */
    const C7 = 330, FL = 548, CHX = [450, 530, 610, 690, 770, 850];
    await T.sceneCard(tr('작은 식탁'), () => {
      scene('house_table2');
      put(T, table, 640, FL - 30);
      chairs.forEach((c, i) => put(T, c, i < 6 ? CHX[i] : C7, FL));
      put(T, snow, 150, FL, { look: 'stand' });
      if (P) camSnap(380, 280, 1);
    }, table.pos);
    await say('작은 식탁 위에 작은 접시와 작은 컵이 나란히 놓여 있었어요.');
    await snow.move(X(230, 300), FL, 700);
    await say('배가 너무 고파요. 한 접시에서 다 먹으면 미안하니까, 조금씩만 먹을게요.');
    /* 접시마다 조금씩 맛보고(냠), 컵마다 한 모금(꿀꺽). 식탁 앞을 따라 걷는다 */
    snow.look('eat');
    const eating = (async () => {
      for (const [x, w] of [[500, '냠!'], [640, '꿀꺽!'], [780, '냠냠!']]) {
        follow(x); await snow.move(x, FL, 650);
        sfx(T, w === '꿀꺽!' ? 'gulp' : 'chomp', () => popSfx(T)); snow.hop(10, 300); T.pop(x, FL - 250, tr(w));
        await sleep(700);
      }
    })();
    await say('백설공주는 접시마다 한 입씩, 컵마다 한 모금씩 먹었어요.');
    await eating;
    /* 일곱 번째 작은 의자에 앉는다. 백설은 제 크기 그대로라 의자가 작다 (무릎이 올라온 앉은 그림) */
    snow.look('stand');
    follow(C7); await snow.move(C7 + 50, FL + 4, 1300);
    const sit = (async () => {
      await sleep(2600);                                   /* "영차," 에 맞춰 앉는다 */
      hide(chairs[6]);                                     /* 앉은 그림에 의자가 함께 있다 → 그 자리의 의자는 감춘다 */
      put(T, snow, C7 + 170 * .6017 * .215, FL, { look: 'chair', to: 'right' }); /* 그림 속 의자 가운데를 의자 자리에 */
      sfx(T, 'squeak', () => popSfx(T)); snow.wiggle(4, 380); T.pop(C7, FL - 240, tr('영차!'));
    })();
    await say('의자가 정말 작네. 조금 작지만… 영차, 앉았다!');
    await sit;
    await say('하아암, 너무 졸려요.');
    await sleep(300);

    /* ===== 5. 일곱 번째 침대 ===== */
    /* 작은 침대 일곱 개를 두 줄로: 뒷줄 3·4·5·6, 앞줄 1·2·7 (백설이 누워 보는 침대는 앞줄이라 가리지 않는다) */
    const BS = BED_H / 100, BY_B = 468, BY_F = 556;
    const BPOS = { 2: [170, BY_B], 3: [390, BY_B], 4: [610, BY_B], 5: [830, BY_B], 0: [160, BY_F], 1: [500, BY_F], 6: [840, BY_F] };
    const layBeds = () => { [2, 3, 4, 5, 0, 1, 6].forEach(i => put(T, beds[i], BPOS[i][0], BPOS[i][1], { s: BS })); };
    /* 누운 백설: 침대째 그린 그림으로 그 침대를 바꿔 끼운다 (침대가 짧아 무릎이 올라오고 발끝이 닿는다) */
    let lying = -1;
    const onBed = (i, look) => {
      if (lying >= 0) beds[lying].pos.style.display = '';
      put(T, snow, BPOS[i][0] + BED_DX[look], BPOS[i][1], { look });
      T.world.insertBefore(snow.pos, beds[i].pos.nextSibling); hide(beds[i]); lying = i;
    };
    await T.sceneCard(tr('작은 침대'), () => {
      scene('house_bed2');
      layBeds(); lying = -1;
      put(T, snow, X(60, 60), BY_F + 2, { look: 'stand' });
      if (P) camSnap(160, 280, 1);
    }, beds[0].pos);
    await say('방에는 작은 침대가 나란히 놓여 있었어요.');
    onBed(0, 'bedknees'); popSfx(T); snow.wiggle(3, 420); T.pop(300, BY_F - 200, tr('끙!'));
    await say('이 침대는 너무 짧아요. 다리가 안 펴져요.');
    follow(500, 500); onBed(1, 'bedtoes'); popSfx(T); snow.wiggle(3, 420); T.pop(390, BY_F - 240, tr('쿵!'));
    await say('이 침대는 불편해요. 발끝이 쿵 닿아요.');
    follow(840, 700); onBed(6, 'bedcurl'); sfx(T, 'paper_down', () => popSfx(T)); T.pop(840, BY_F - 230, tr('쏙!'));
    await say('몸을 동그랗게 웅크리면… 조금 작지만 포근해요. 잘 자요…');
    T.pop(790, BY_F - 230, tr('새근새근'));
    await say('백설공주는 스르르 잠이 들었어요.');
    await sleep(600);

    /* ===== 6. 일곱 난쟁이 ===== */
    const crewN = crew(T, { lanterns: true }); hide(crewN);
    let night;
    await T.sceneCard(tr('일곱 난쟁이'), () => {
      scene('house_bed2'); night = tint(T, '#1F2A56', .45);
      layBeds(); lying = -1;
      onBed(6, 'bedcurl');
      put(T, crewN, -260, 560);
      if (P) camSnap(560, 280, 1);
    }, beds[6].pos);
    sfx(T, 'step_wood');
    await Promise.all([say('밤이 되자, 산에서 일하던 일곱 난쟁이가 집으로 돌아왔어요.'), crewN.move(X(330, 460), 560, 2200)]);
    const WHO = ['누가 내 의자에 앉았지?', '누가 내 접시에서 먹었지?', '누가 내 빵을 먹었지?', '누가 내 숟가락을 썼지?',
      '누가 내 포크를 썼지?', '누가 내 컵으로 마셨지?', '어? 내 침대에 누가 자고 있어!'];
    /* 세로 화면: 말하는 난쟁이를 따라가다 일곱째에서 백설이 자는 침대까지 함께 보이게 */
    const dwX = i => crewN.x - 150 * ASP.dwarfs_row / 2 + 150 * ASP.dwarfs_row / 7 * (i + .5);
    for (let i = 0; i < 7; i++) { if (P) T.camTo(i < 6 ? dwX(i) : 740, 280, 1, 450); crewN.hopOne(i); await say(WHO[i]); }
    glow(snow, 1200);
    crewN.hopAll(10, 380);
    await say('와아, 정말 예쁜 아이다! 깨우지 말자, 쉿!');
    /* 아침: 밤빛이 걷히고 백설이 일어나 앉는다 */
    await T.anim(night, [{ opacity: .45 }, { opacity: 0 }], 1200); night.setAttribute('opacity', 0);
    await say('아침이 되자 백설공주가 눈을 떴어요.');
    sfx(T, 'sparkle'); beds[6].pos.style.display = ''; lying = -1;
    put(T, snow, BPOS[6][0] + 6, BPOS[6][1] - 34, { look: 'awake' }); T.world.insertBefore(snow.pos, beds[6].pos.nextSibling);
    snow.hop(10, 300);
    await say('깜짝이야! 저는 백설공주예요. 갈 곳이 없어요. 여기서 지내도 될까요?');
    crewN.hopAll(14, 380);
    await say('그럼! 대신 우리가 일하러 간 사이, 낯선 사람에겐 절대 문을 열지 마!');
    snow.hop(10, 300);
    await say('네, 약속할게요.');
    await sleep(300);

    /* ===== 7. 큰 침대 ===== */
    const BIG = 190 / 150;                                 /* 큰 침대: 백설 키보다 길게 */
    await T.sceneCard(tr('큰 침대'), () => {
      scene('house_bed2');
      put(T, planks, X(500, 500), 548, { s: 1.3 });
      put(T, hammerD, X(330, 400), 548, { to: 'right' });
      put(T, plankD, X(670, 600), 548, { to: 'left' });
      put(T, snow, X(860, 640), 540, { look: 'stand' });
      if (P) hide(snow);
    }, planks.pos);
    await say('백설공주는 집안일을 하고, 난쟁이들은 산에서 일했어요. 모두 사이좋게 지냈어요.');
    hammerD.hop(10, 360); plankD.hop(10, 360);
    await say('백설공주에게는 우리 침대가 너무 작아. 큰 침대를 만들어 주자!');
    const hammering = (async () => {
      for (let i = 0; i < 3; i++) {
        hammerD.wiggle(10, 360); plankD.hop(10, 360);
        sfx(T, 'knock', () => T.tone([180, 90], .12, { type: 'square', vol: .12 }));
        T.pop(X(500, 500) + [-60, 50, -10][i], 330, tr(['뚝딱!', '쿵쿵!', '뚝딱!'][i]));
        await sleep(900);
      }
    })();
    await say('뚝딱뚝딱, 쿵쿵!');
    await hammering;
    await fadeOut(T, planks, 300);
    put(T, bigBed, X(500, 500), 552, { s: BIG }); fadeIn(bigBed, 500); sfx(T, 'tada', () => popSfx(T)); glow(bigBed, 1200);
    hide(hammerD); put(T, smileD, X(330, 400), 548); smileD.hop(14, 340);
    if (P) { put(T, snow, 640, 540, { look: 'stand' }); camSnap(560, 280, 1); }
    snow.hop(16, 340);
    await say('와아, 고맙습니다!');
    await sleep(400);

    /* ===== 8. 침대 여덟 개 (배움 놀이: 세기 — 톡 한 번, 1~8 저절로) ===== */
    /* 작은 침대 일곱(두 줄로 엇갈려, 왼쪽부터 1~7) + 오른쪽 큰 침대(8) */
    const SX = [70, 160, 250, 340, 430, 520, 610], SYs = i => (i % 2 ? 552 : 496), SS = i => (i % 2 ? .82 : .74), SY = 552, BIGX = 790;
    let bedsG;
    await T.sceneCard(tr('침대 여덟 개'), () => {
      scene('house_bed2');
      hide(smileD); hide(plankD);
      put(T, dwarfs, 340, 470, { s: .8 });                /* 난쟁이들은 침대 뒤 벽 앞에 */
      put(T, snow, 930, 552, { look: 'stand' });
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
      T.pop(b.x, i === 7 ? 220 : (i % 2 ? 250 : 190), tr(NUM[i]));
      await sleep(i === 6 ? 1300 : 950);                  /* 일곱 다음에 한 박 쉬고 큰 침대 */
    }
    if (P) T.camTo(560, 280, 1, 700);
    dwarfs.hop(14, 360);
    await say('작은 침대 일곱 개, 큰 침대 하나, 모두 여덟 개!');
    snow.hop(16, 360);
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
    await say('모두 잘 자요. 함께 지내서 행복해요.');
    await sleep(400);

    /* ===== 9. 할머니와 사과 ===== */
    /* 다시 거울: 짧게 */
    await T.sceneCard(tr('다시 거울'), () => { mf = mirrorRoom(); queen.look('mirror'); }, mirror.pos);
    await say('거울아, 거울아, 이 나라에서 누가 제일 예쁘니?');
    sfx(T, 'sparkle'); mf.show();
    await say('숲속 일곱 난쟁이 집의 백설공주가 제일 예뻐요.');
    queen.look('fist'); T.shake(); sfx(T, 'thud'); queen.hop(14, 300);
    await sleep(500);
    /* 난쟁이 집 앞. 백설은 문을 열지 않고 집 안에서 창문으로 내다보며 사과를 받는다 (원작: 문은 열지 않음).
       그림 속 창문 구멍(WX·SILL, 폭 약 37·높이 44)만 보이게 자르고, 몸은 집 안(어두운 방)에 있어 벽 앞으로 나오지 않는다 */
    const WX = 162, SILL = 306, WS = .36;
    let winG;
    await T.sceneCard(tr('사과 할머니'), () => {
      scene('house_front');
      put(T, door, 314, 339, { look: 'closed' });
      winG = T.el('g', {}, T.world);
      const id = 'swWin' + (++uid);
      T.el('rect', { x: WX - 17, y: SILL - 44, width: 34, height: 44, rx: 15 }, T.el('clipPath', { id }, winG));
      winG.setAttribute('clip-path', `url(#${id})`);
      T.el('rect', { x: WX - 20, y: SILL - 48, width: 40, height: 52, fill: '#4A3626' }, winG);   /* 창 너머 어두운 방 */
      put(T, snow, WX, SILL + 35, { look: 'receive', s: WS }); winG.appendChild(snow.pos);
      put(T, granny, 560, 356, { to: 'left', s: FAR });
      camSnap(X(280, 250), 280, P ? 1.5 : 1.7);
    }, snow.pos);
    await Promise.all([say('왕비는 할머니로 변장하고 빨간 사과를 들고 숲으로 갔어요.'), granny.move(262, 356, 2400)]);
    const handX = () => granny.x - 215 * .765 * .42 * FAR, handY = 356 - 215 * .52 * FAR;
    put(T, apple, handX(), handY, { look: 'whole', s: FAR }); fadeIn(apple, 300);
    await say('사과 사세요~ 아주 맛있는 사과란다.');
    snow.wiggle(4, 500);
    await say('문은 열면 안 돼요. 난쟁이들과 약속했거든요.');
    await say('그럼 창문으로 하나만 맛보렴.');
    apple.setScale(.5); await apple.move(WX + 6, SILL - 8, 800);
    sfx(T, 'pop');
    await sleep(400);
    apple.look('bitten'); sfx(T, 'chomp', () => popSfx(T)); T.pop(WX, SILL - 60, tr('아삭!'));
    const fall = (async () => {
      await sleep(1600);
      hide(apple);
      sfx(T, 'slide_down');
      await snow.move(WX, SILL + 35 + 70, 1500, 'ease-in');  /* 창틀 아래로 스르르 (구멍 밖은 잘려 안 보인다) */
      hide(snow); winG.style.display = 'none';   /* 닫힌 창으로 돌아간다 */
      granny.turn('right');
      await granny.move(560, 356, 1600);
      hide(granny);
    })();
    await say('백설공주는 사과를 한 입 베어 물고, 그만 스르르 잠이 들었어요.');
    await fall;
    await sleep(300);

    /* ===== 10. 유리관과 왕자 ===== */
    /* 저녁에 돌아온 난쟁이들 (같은 집 앞, 해 질 녘) */
    tint(T, '#E8703A', .16);
    put(T, worry, 520, 360, { s: FAR });
    await worry.move(X(360, 290), 360, 1400);
    await say('저녁에 돌아온 난쟁이들은 깜짝 놀랐어요.');
    worry.hop(8, 300);
    await say('백설공주님, 일어나요! 일어나세요…');
    await sleep(300);
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
      const cid = 'swBase' + (++uid);
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
    await say('난쟁이들은 백설공주를 맑은 유리관에 눕히고, 날마다 곁을 지켰어요.');
    put(T, prince, X(1100, 900), 540); prince.face('left');
    await Promise.all([say('어느 날, 이웃 나라 왕자님이 숲을 지나가다 백설공주를 보았어요.'), prince.move(X(770, 640), 540, 2200), follow(560, 2200)]);
    await say('이 공주님을 제 성으로 모셔 가 정성껏 돌보고 싶어요.');
    /* 관을 옮기다 덜컹 → 목에 걸린 사과 조각이 툭 빠진다 */
    const jolt = (async () => {
      await sleep(1200);
      sfx(T, 'thud'); T.shake(); T.pop(CX, CY - 220, tr('덜컹!'));
      const j = [{ translate: '0 0', rotate: '0deg' }, { translate: '0 -14px', rotate: '-1.5deg' }, { translate: '0 0', rotate: '1deg' }, { translate: '0 0', rotate: '0deg' }];
      await Promise.all([coffin.pos, snow.pos, glass].map(n => { n.style.transformOrigin = `${CX}px ${CY}px`; return n.animate(j, 650).finished; }));
      const mouthX = snow.x - 98 * ASP.snow_bedsleep * .27, mouthY = snow.y - 98 * .55;
      put(T, piece, mouthX, mouthY);
      sfx(T, 'pop');
      await piece.move(mouthX - 70, 560, 700, 'ease-in');
      T.pop(mouthX - 70, 470, tr('툭!'));
    })();
    await say('그런데 관을 옮기다가 덜컹! 목에 걸렸던 사과 조각이 툭 빠졌어요.');
    await jolt;
    await sleep(600);

    /* ===== 11. 깨어나요 (톡: 백설의 손을 톡) ===== */
    const crewE = crew(T); hide(crewE);
    await T.sceneCard(tr('깨어나요'), () => {
      scene('hill');
      put(T, coffin, CX, CY);
      put(T, shine, CX, CY - 40); hide(shine);
      inCoffin();
      put(T, crewE, X(195, 330), 550, { s: .85 });
      put(T, prince, X(770, 650), 540);
      if (P) camSnap(500, 280, 1);
    }, snow.pos);
    /* 유리 뚜껑·관 앞판이 백설 위를 덮고 있어 백설을 직접 누를 수 없다 → 맨 위에 투명한 누르는 자리를 따로 둔다 (2026-10-20) */
    const hand = T.el('circle', { cx: snow.x, cy: snow.y - 48, r: 90, fill: '#fff', opacity: 0 }, T.world);
    snow.pos.animate([{ translate: '0 0' }, { translate: '0 -4px' }, { translate: '0 0' }], { duration: 1600, iterations: 3, easing: 'ease-in-out' });
    await say('백설공주의 손을 톡 눌러 볼까요?');
    await T.tap(hand, { prompt: '백설공주의 손을 톡 눌러 볼까요?' });
    hand.remove();
    glass.remove();                                        /* 유리 뚜껑을 열었다 */
    T.world.insertBefore(shine.pos, coffin.pos.nextSibling);
    shine.pos.style.display = ''; fadeIn(shine, 700);
    shine.body.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1.08)' }, { transform: 'scale(.9)' }], { duration: 1600, iterations: Infinity, easing: 'ease-in-out' });
    sfx(T, 'sparkle', () => T.tone([700, 1400], .4, { vol: .12 }));
    put(T, snow, CX + 10, CY - 30, { look: 'awake' }); fadeIn(snow, 500); glow(snow, 1200);
    T.world.appendChild(prince.pos); T.world.appendChild(crewE.pos);
    /* 꽃잎이 팔랑팔랑 내린다 */
    for (let i = 0; i < 9; i++) {
      const p = prop(T, 'prop_petals', 44 + (i % 3) * 14);
      put(T, p, 80 + i * 105, -40);
      p.body.animate([{ transform: 'translate(0,0) rotate(0deg)', opacity: 0 }, { transform: 'translate(-30px,240px) rotate(160deg)', opacity: 1, offset: .5 }, { transform: 'translate(20px,560px) rotate(320deg)', opacity: 0 }],
        { duration: 5200 + (i % 4) * 700, delay: i * 260, iterations: 2, easing: 'ease-in-out' });
    }
    await say('어머, 제가 오래 잤나 봐요.');
    prince.hop(10, 360);
    await say('이제 괜찮아요. 함께 성으로 가요.');
    crewE.hopAll(18, 420);
    await say('만세! 백설공주가 깨어났다!');
    await say('낯선 사람이 주는 것은 꼭 어른에게 먼저 물어봐요.');
    await sleep(300);
    await say('왕비는 멀리 떠났어요');
    T.confetti();
    await Promise.all([snow.hop(20, 460), crewE.hopAll(20, 460), prince.hop(14, 460)]);
    T.finale();
    await sleep(1500);
    return '낯선 사람이 주는 것은 꼭 어른에게 먼저 물어봐요.';
  }

  Tale.mount({ title: '백설공주', subtitle: '질투는 마음을 해쳐요', run: T => run(Tale.api) });
})();
