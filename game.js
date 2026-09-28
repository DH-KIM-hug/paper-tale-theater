/* 팥죽할멈과 호랑이 — 장면 시퀀서 & 상태머신 */

const $ = s => document.querySelector(s);

const el = {
  stage: $('#stageWrap'),
  scene: $('#scene'),
  world: $('#world'), daylight: $('#daylight'),
  layerFar: $('#layer-far'), layerMid: $('#layer-mid'), layerFg: $('#layer-fg'),
  lives: $('#lives'),
  backdrop: $('#backdrop'), curtainL: $('#curtainL'), curtainR: $('#curtainR'),
  houseLight: $('#houseLight'), audience: $('#audience'),
  impact: $('#impact'), impactText: $('#impactText'),
  tigerPos: $('#tigerPos'), tiger: $('#tiger'),
  tEyeL: $('#tEyeL'), tEyeR: $('#tEyeR'), tEyeHurt: $('#tEyeHurt'),
  dizzy: $('#dizzyStars'), belly: $('#tigerBelly'),
  grannyPos: $('#grannyPos'), granny: $('#granny'),
  gTears: $('#gTears'), gArmStir: $('#gArmStir'), gArmsUp: $('#gArmsUp'), gMouth: $('#gMouth'),
  rolled: $('#rolledTiger'), rolledInner: $('#rolledInner'),
  splash: $('#splashFX'),
  warnFlash: $('#warnFlash'), darkOverlay: $('#darkOverlay'),
  tray: $('#tray'), skipBtn: $('#skipBtn'),
  /* 홈 화면(앱 라이브러리)이 기존 타이틀 역할을 대신한다 */
  titleScreen: $('#homeScreen'), startBtn: $('#playPatjuk'),
  endScreen: $('#endScreen'), endTitle: $('#endTitle'), endMsg: $('#endMsg'),
  retryBtn: $('#retryBtn'), homeBtn: $('#homeBtn'),
  confetti: $('#confetti'),
};

const friendEl = id => $('#f-' + id);
const friendAct = id => $('#f-' + id + ' .act');

/* 무대 좌표 (발 기준 y=520) */
const POS = {
  tigerEnter: 1080,
  tigerStage: [270, 335, 430, 470, 885, 560, 640], // 단계별 호랑이 위치 (컨셉 레이아웃)
  grannyCook: 250,
  grannyCorner: 680,
  rolledSpot: 560,
};

/* 친구들의 숨은 위치 (카메라·임팩트용) */
const SPOTS = {
  bam: [155, 470], jara: [300, 400], ddong: [432, 490], songgot: [495, 470],
  jeolgu: [885, 300], myeongseok: [560, 470], jige: [690, 450],
};

/* 단계별 카메라 프레이밍 [cx, cy, zoom] */
const STATION_CAM = [
  [240, 430, 1.5],  // 아궁이
  [320, 430, 1.5],  // 물독
  [420, 440, 1.4],  // 뒷걸음
  [470, 450, 1.5],  // 넘어짐
  [860, 380, 1.32], // 문 (절구 선반 포함)
  [560, 440, 1.35], // 마당
  [640, 450, 1.3],  // 멍석말이
];

const MAX_MISTAKES = 5; // 실패 기회 (하트 수)

let mode = 'title';   // title | intro | play | end
let stage = 0;        // 다음 정답 인덱스
let mistakes = 0;
let busy = true;
let skipRequested = false;

/* ===== 공용 헬퍼 ===== */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* 씬 세트 전환: A=가을 팥밭(낮) / B1=부엌 내부(밤) / B2=마당(밤) */
let currentScene = 'B1';
function setScene(s) {
  currentScene = s;
  document.body.classList.toggle('setA', s === 'A'); // 팥밭에선 배우 확대
  document.body.classList.toggle('setB2', s === 'B2'); // 마당에서도 배우 확대
  ['A', 'B1', 'B2'].forEach(k => {
    document.querySelectorAll(`.scn${k}, [data-set="${k}"]`).forEach(e => {
      e.style.display = (s === k) ? '' : 'none';
    });
  });
}
/* 세트별 문 위치: 부엌 문은 오른쪽 끝, 마당(집 외관) 문은 집 구조상 565 */
const DOOR_X = { B1: 885, B2: 154 };
/* 친구가 속한 세트 (다른 세트에서 잘못 누르면 연출 없이 내레이션만) */
const FRIEND_SET = {
  bam: 'B1', jara: 'B1', ddong: 'B1', songgot: 'B1', jeolgu: 'B1',
  myeongseok: 'B2', jige: 'B2',
};


/* ===== 만화 임팩트 컷: 타격 순간 종이 패널 시퀀스 (이미지 없으면 자동 생략)
   자동 4초 후 다음 컷, 탭하면 0.5초 안에 전환 ===== */
const CUT_SFX = {
  bam: 'pow', bam_b: 'yelp',
  jara: 'pow', jara_b: 'yelp',
  ddong: 'boom', ddong_b: 'yelp',
  songgot: 'pow', songgot_b: 'yelp',
  jeolgu: 'boom', jeolgu_b: 'yelp',
  myeongseok: 'roll', myeongseok_b: 'yelp',
  jige: 'splash', jige_b: 'yelp',
  wrong_bam: 'laugh', wrong_jara: 'laugh', wrong_ddong: 'laugh', wrong_songgot: 'laugh',
  wrong_jeolgu: 'laugh', wrong_myeongseok: 'laugh', wrong_jige: 'laugh',
};
const CUT_OK = {};
const CUT_IMGS = {}; // 프리로드한 이미지 참조 유지 (GC 방지)
function cutExists(url) {
  return new Promise(res => {
    if (CUT_OK[url] !== undefined) return res(CUT_OK[url]);
    const t = new Image();
    CUT_IMGS[url] = t;
    t.onload = () => res(CUT_OK[url] = true);
    t.onerror = () => res(CUT_OK[url] = false);
    t.src = url;
  });
}
/* 시작 시 컷 패널 전량 프리로드 → 탭 즉시 표시 */
function preloadCuts() {
  FRIENDS.forEach(f => {
    cutExists(`assets/v2/cut_${f.id}.png`);
    cutExists(`assets/v2/cut_${f.id}_b.png`);
    cutExists(`assets/v2/cut_wrong_${f.id}.png`);
  });
}
let cutTapResolve = null;
async function showCut(id, hold = 4000) {
  const panel = $('#cutPanel'), img = $('#cutImg');
  if (!panel) return;
  const keys = [id, id + '_b'];
  for (const key of keys) {
    const url = `assets/v2/cut_${key}.png`;
    if (!(await cutExists(url))) continue;
    img.src = url;
    panel.hidden = false;
    panel.classList.remove('out');
    panel.classList.add('in');
    camPunch();
    stageShake();
    if (!key.startsWith('wrong_')) AudioFX.whoosh(); // 임팩트 컷: 타격 직전 휙 소리 레이어
    const sfx = CUT_SFX[key];
    if (sfx && AudioFX[sfx]) AudioFX[sfx]();
    await new Promise(res => {
      let done = false;
      const fin = () => { if (done) return; done = true; cutTapResolve = null; res(); };
      cutTapResolve = () => setTimeout(fin, 200); // 탭 → 퇴장 애니 포함 약 0.5초에 전환
      setTimeout(fin, hold);
    });
    panel.classList.remove('in');
    panel.classList.add('out');
    await sleep(300);
  }
  panel.hidden = true;
}

/* 누적 상처: idx번째 성공 후 켜기 (0~4), 리셋 시 전부 끄기 */
function showWound(i) {
  const w = $('#wnd' + i);
  if (w) w.setAttribute('opacity', 1);
}
function clearWounds() {
  for (let i = 0; i < 5; i++) { const w = $('#wnd' + i); if (w) w.setAttribute('opacity', 0); }
}

/* 입력 잠금: 연출 중에는 카드를 시각적으로도 비활성화 */
function setBusy(v) {
  busy = v;
  el.tray.classList.toggle('locked', v);
}

function setPos(g, x, y) {
  g.style.transform = `translate(${x}px, ${y}px)`;
  g._x = x; g._y = y;
}

async function walk(posG, bodyG, x, speed = 260) {
  const y = posG._y ?? 520;
  const fromX = posG._x ?? 0;
  const dur = Math.max(300, Math.abs(x - fromX) / speed * 1000);
  // 스프라이트는 기본 왼쪽을 본다 — 오른쪽으로 갈 땐 반전해서 앞으로 걷는 모습으로
  if (bodyG && Math.abs(x - fromX) > 4) bodyG.classList.toggle('faceR', x > fromX);
  bodyG && bodyG.classList.add('walking');
  try {
    await posG.animate(
      [{ transform: `translate(${fromX}px, ${y}px)` }, { transform: `translate(${x}px, ${y}px)` }],
      { duration: dur, easing: 'ease-in-out' }
    ).finished;
  } catch (e) { /* 애니메이션 취소 무시 */ }
  setPos(posG, x, y);
  bodyG && bodyG.classList.remove('walking');
}

/* 끝 상태를 인라인 스타일로 고정해 스냅백을 막는다 */
async function anim(target, keyframes, opts) {
  const numOpts = typeof opts === 'number' ? { duration: opts } : opts;
  const a = target.animate(keyframes, { ...numOpts, fill: 'forwards' });
  try { await a.finished; } catch (e) { /* 취소 무시 */ }
  try { a.commitStyles(); } catch (e) { /* 미표시 요소 등 */ }
  a.cancel();
}

/* ===== 진짜 3D 카메라 (perspective + 레이어 Z깊이) =====
   레이어는 translateZ(-260/-140/0/+120)에 떠 있고, 카메라는 #scene 하나만 움직인다.
   원근 투영이 시차·버드아이 깊이를 실제로 만들어 낸다. */
const P3D = 1200; // CSS perspective와 일치
const cam = { x: 500, y: 280, z: 1, rx: 0 };

function clampCam(cx, cy, z) {
  if (z < 1) return [cx, cy]; // 줌아웃(공연장 뷰)은 자유 프레이밍
  // 화면(1000x560) 밖이 보이지 않게 주무대 기준으로 중심점을 클램프
  const hx = 500 / z, hy = 280 / z;
  return [
    Math.min(Math.max(cx, hx), 1000 - hx),
    Math.min(Math.max(cy, hy), 560 - hy),
  ];
}

/* viewBox 유저 단위 → 화면 px 배율 (meet 레터박스 기준) */
function unitScale() {
  const r = el.stage.getBoundingClientRect();
  return Math.min(r.width / 1000, r.height / 560) || 1;
}

function cam3dT(cx, cy, z, rx) {
  const s = unitScale();
  const tz = P3D * (1 - 1 / z); // 줌 = 카메라 돌리(dolly)
  return `translate3d(${(500 - cx) * s}px, ${(280 - cy) * s}px, ${tz}px) rotateX(${rx}deg)`;
}

async function camTo(cx, cy, z = 1.4, dur = 800, rx = 0) {
  [cx, cy] = clampCam(cx, cy, z);
  await anim(el.scene,
    [{ transform: cam3dT(cam.x, cam.y, cam.z, cam.rx) }, { transform: cam3dT(cx, cy, z, rx) }],
    { duration: dur, easing: 'cubic-bezier(.35,0,.25,1)' });
  Object.assign(cam, { x: cx, y: cy, z, rx });
}

const camWide = (dur = 800) => camTo(500, 280, 1, dur);

function camSnap(cx, cy, z, rx = 0) {
  [cx, cy] = clampCam(cx, cy, z);
  el.scene.style.transform = cam3dT(cx, cy, z, rx);
  Object.assign(cam, { x: cx, y: cy, z, rx });
}

/* 타격 순간 카메라 살짝 밀기 */
function camPunch() {
  const a = cam3dT(cam.x, cam.y, cam.z, cam.rx);
  const b = cam3dT(cam.x, cam.y, cam.z * 1.06, cam.rx);
  anim(el.scene, [{ transform: a }, { transform: b }, { transform: a }],
    { duration: 260, easing: 'ease-out' });
}

window.addEventListener('resize', () => camSnap(cam.x, cam.y, cam.z, cam.rx));

/* ===== 인형극 무대 장치 ===== */
let curtainShut = true; // 초기 마크업은 닫힌 상태

async function setCurtain(open, dur = 1200) {
  if (open !== curtainShut) return; // 이미 원하는 상태
  curtainShut = !open;
  if (dur > 0) AudioFX.swish();
  const l = open ? [0, -700] : [-700, 0];
  const r = open ? [0, 700] : [700, 0];
  await Promise.all([
    anim(el.curtainL, [{ transform: `translateX(${l[0]}px)` }, { transform: `translateX(${l[1]}px)` }],
      { duration: dur, easing: 'cubic-bezier(.5,0,.3,1)' }),
    anim(el.curtainR, [{ transform: `translateX(${r[0]}px)` }, { transform: `translateX(${r[1]}px)` }],
      { duration: dur, easing: 'cubic-bezier(.5,0,.3,1)' }),
  ]);
}

/* 무대막: 종이 시트가 내려와 덮은 사이 무대를 갈아끼운다 */
async function backdropSwap(change) {
  AudioFX.swish();
  el.backdrop.style.visibility = 'visible'; // 주차 중엔 숨겨둔다 (모바일 비율에서 가장자리 비침 방지)
  await anim(el.backdrop, [{ transform: 'translateY(-660px)' }, { transform: 'translateY(0)' }],
    { duration: 480, easing: 'ease-in' });
  if (change) change();
  await sleep(180);
  AudioFX.swish();
  await anim(el.backdrop, [{ transform: 'translateY(0)' }, { transform: 'translateY(-660px)' }],
    { duration: 480, easing: 'ease-out' });
  el.backdrop.style.visibility = 'hidden';
}

/* 공연장 오프닝: 버드아이뷰 → 정면뷰, 조명 디졸브, 커튼 오픈 */
async function theaterOpening() {
  AudioFX.bell();
  await sleep(900);
  // 하우스라이트 디졸브 + 객석에서 무대 정면으로 카메라 이동
  anim(el.houseLight, [{ opacity: 0.22 }, { opacity: 0 }], { duration: 1600 });
  el.audience.style.transition = 'opacity 1.8s';
  el.audience.style.opacity = 0;
  // 줌아웃 객석 뷰 → 무대로 서서히 다가간다 (돌리 인)
  await camTo(500, 280, 1, 2400, 0);
  el.audience.hidden = true;
  await sleep(250);
  // 커튼이 열리며 공연 시작
  await setCurtain(true, 1400);
}

/* ===== 남은 기회 하트 ===== */
function renderLives() {
  el.lives.innerHTML = '';
  for (let i = 0; i < MAX_MISTAKES; i++) {
    const s = document.createElement('span');
    s.textContent = '❤️';
    if (i >= MAX_MISTAKES - mistakes) s.classList.add('lost');
    el.lives.appendChild(s);
  }
}

/* ===== 의성어 임팩트 ===== */
function impact(x, y, word, color = '#8e3b2f') {
  el.impactText.textContent = word;
  el.impactText.setAttribute('fill', color);
  camPunch();
  anim(el.impact, [
    { opacity: 0, transform: `translate(${x}px,${y}px) scale(.3) rotate(-10deg)` },
    { opacity: 1, transform: `translate(${x}px,${y}px) scale(1.18) rotate(4deg)`, offset: 0.3 },
    { opacity: 1, transform: `translate(${x}px,${y}px) scale(1) rotate(0deg)`, offset: 0.72 },
    { opacity: 0, transform: `translate(${x}px,${y}px) scale(1.06)` },
  ], { duration: 900, easing: 'ease-out' });
}

/* 호랑이 몸통 자체의 잔동작: 끝나면 인라인 transform을 지워
   .fallen/.flat 클래스 포즈가 다시 적용되게 한다 */
async function tigerHop(keyframes, opts) {
  await anim(el.tiger, keyframes, opts);
  el.tiger.style.transform = '';
}

async function bounceFriend(id) {
  const g = friendEl(id);
  g.classList.remove('bounce');
  void g.getBoundingClientRect();
  g.classList.add('bounce');
  await sleep(550);
  g.classList.remove('bounce');
}

function tigerEyesHurt(on) {
  el.tEyeL.setAttribute('opacity', on ? 0 : 1);
  el.tEyeR.setAttribute('opacity', on ? 0 : 1);
  el.tEyeHurt.setAttribute('opacity', on ? 1 : 0);
}

function grannyMood(m) {
  el.granny.classList.remove('cooking', 'scaredShake');
  el.gTears.setAttribute('opacity', 0);
  el.gArmsUp.setAttribute('opacity', 0);
  el.gArmStir.setAttribute('opacity', 1);
  el.gMouth.setAttribute('d', 'M-4 -68 Q0 -65 4 -68'); // 미소
  if (m === 'cook') el.granny.classList.add('cooking');
  if (m === 'cry') { el.granny.classList.add('cooking'); el.gTears.setAttribute('opacity', 1); el.gMouth.setAttribute('d', 'M-4 -66 Q0 -70 4 -66'); }
  if (m === 'scared') { el.granny.classList.add('scaredShake'); el.gMouth.setAttribute('d', 'M-3 -68 Q0 -63 3 -68 Q0 -64 -3 -68'); }
  if (m === 'happy') { el.gArmsUp.setAttribute('opacity', 1); el.gArmStir.setAttribute('opacity', 0); }
}

function stageShake() {
  el.stage.classList.remove('shake');
  void el.stage.getBoundingClientRect();
  el.stage.classList.add('shake');
  setTimeout(() => el.stage.classList.remove('shake'), 450);
}

async function flashWarn() {
  await anim(el.warnFlash, [{ opacity: 0 }, { opacity: 0.32 }, { opacity: 0 }, { opacity: 0.25 }, { opacity: 0 }], { duration: 550 });
}

/* ===== 카드 ===== */
function buildTray() {
  el.tray.innerHTML = '';
  const order = FRIENDS.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  order.forEach(i => {
    const f = FRIENDS[i];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    b.id = 'card-' + f.id;
    b.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#sym-${f.id}"></use></svg><span>${f.name}</span>`;
    b.addEventListener('click', () => onCard(i, b));
    el.tray.appendChild(b);
  });
  el.tray.hidden = false;
}

/* ===== 인트로 ===== */
async function playIntro() {
  mode = 'intro';
  el.skipBtn.hidden = false;

  const beats = [];
  // 1. 낮 — 팥죽 쑤는 할멈 클로즈업
  beats.push(async () => {
    grannyMood('cook');
    await camTo(240, 430, 1.55, 1100);
    await Narrator.speak(INTRO.opening[0]);
  });
  // 2. 호랑이 등장 — 와이드로 빠졌다가 호랑이 쪽으로
  beats.push(async () => {
    await camWide(700);
    AudioFX.growl();
    await walk(el.tigerPos, el.tiger, 700, 340);
    // 할멈이 호랑이 쪽(오른쪽)을 보고 놀라 뒤로 꽈당 주저앉는다
    el.granny.classList.add('faceR');
    grannyMood('scared');
    impact(700, 380, '어흥!', '#c0392b');
    AudioFX.thud();
    stageShake();
    await anim(el.grannyPos, [
      { transform: `translate(${el.grannyPos._x}px, 520px)` },
      { transform: `translate(${el.grannyPos._x - 16}px, 494px)` },
      { transform: `translate(${el.grannyPos._x - 24}px, 520px)` },
    ], { duration: 420, easing: 'ease-out' });
    setPos(el.grannyPos, el.grannyPos._x - 24, 520);
    // 기울기는 rotate 속성으로: 떨림(shiver)·걷기 transform과 합성된다
    el.granny.style.transition = 'rotate .22s ease-in';
    el.granny.style.rotate = '-24deg';
    await camTo(690, 430, 1.45, 600);
    await Narrator.speak(INTRO.opening[1]);
  });
  // 3. 약속 — 와이드, 호랑이 퇴장
  beats.push(async () => {
    // 할멈이 일어나 약속한다 (호랑이 쪽을 본 채)
    el.granny.style.transition = 'rotate .35s ease-out';
    el.granny.style.rotate = '0deg';
    await sleep(360);
    el.granny.style.transition = '';
    el.granny.style.rotate = '';
    grannyMood('cook');
    await camWide(700);
    await Narrator.speak(INTRO.opening[2]);
    await walk(el.tigerPos, el.tiger, POS.tigerEnter, 340);
    el.granny.classList.remove('faceR'); // 호랑이가 떠나면 다시 밭일 방향으로
  });
  // 4. 동짓날 저녁 — 무대막을 갈아끼우듯 낮 들판에서 저녁 부엌으로 전환
  beats.push(async () => {
    await backdropSwap(() => {
      setScene('B1'); // 팥밭 → 동짓날 부엌(내부)으로 무대 교체
      grannyMood('cry');
      el.daylight.style.opacity = 0.45;
      camSnap(240, 430, 1.6);
    });
    await Narrator.speak(INTRO.opening[3]);
  });
  // 5~11. 친구들 등장 — 와이드로 입장을 보여주고 숨는 곳을 클로즈업
  FRIENDS.forEach(f => beats.push(async () => {
    if (skipRequested) return;
    // 멍석부터는 마당에 숨는다 — 무대막 전환
    if (FRIEND_SET[f.id] === 'B2' && currentScene !== 'B2') {
      await backdropSwap(() => setScene('B2'));
    }
    await camWide(500);
    AudioFX.jingle();
    const g = friendEl(f.id);
    g.classList.add('shown');
    const [spotX, spotY] = SPOTS[f.id];
    const act = friendAct(f.id);
    // 소속 세트의 문에서 들어와 바닥을 따라 걸어온 뒤, 숨는 자리로 폴짝 오른다
    const doorDx = DOOR_X[FRIEND_SET[f.id]] - spotX;
    // 바닥 오프셋은 그룹의 실제 y(발 기준)에서 계산 — SPOTS의 y는 카메라 앵커라 쓰면 땅에 파묻힌다
    const gy = parseFloat((g.getAttribute('transform').match(/,\s*([\d.]+)/) || [0, 520])[1]);
    const groundDy = Math.max(0, 520 - gy);
    await anim(act,
      [{ transform: `translate(${doorDx}px, ${groundDy}px)` }, { transform: `translate(0px, ${groundDy}px)` }],
      { duration: Math.max(500, Math.abs(doorDx) * 3), easing: 'ease-out' });
    if (groundDy > 4) {
      AudioFX.tap();
      await anim(act,
        [{ transform: `translate(0px, ${groundDy}px)` },
         { transform: `translate(0px, ${groundDy * 0.4 - 24}px)` },
         { transform: 'translate(0, 0)' }],
        { duration: Math.max(420, groundDy * 2.2), easing: 'ease-in-out' });
    }
    camTo(spotX, spotY, 1.5, 650);
    bounceFriend(f.id);
    await Narrator.speak(f.intro);
  }));

  for (const beat of beats) {
    if (skipRequested) break;
    await beat();
    if (skipRequested) break;
    await sleep(350);
  }

  // 스킵했든 아니든 인트로 종료 상태로 정리 (완전한 밤 + 와이드)
  // (부엌 세트 복귀는 beginPlay의 무대막 전환에서 처리)
  Narrator.stop();
  el.granny.style.transition = ''; el.granny.style.rotate = ''; // 꽈당 기울기 복구 (스킵 대비)
  FRIENDS.forEach(f => friendEl(f.id).classList.add('shown'));
  setPos(el.tigerPos, POS.tigerEnter, 520);
  setPos(el.grannyPos, POS.grannyCook, 520);
  grannyMood('cry');
  anim(el.daylight, [{ opacity: skipRequested ? 1 : 0.45 }, { opacity: 0 }], { duration: 900 });
  await camWide(600);
  // 호랑이가 오기 전, 숨은 친구들에게 작전 속삭이기 (게임 설명)
  await Narrator.speak(INTRO.help);
  el.skipBtn.hidden = true;
  mode = 'play';
}

/* ===== 게임 진행 ===== */
async function beginPlay(firstTime) {
  mode = 'play';
  stage = 0;
  mistakes = 0;
  setBusy(true);
  buildTray();
  renderLives();
  el.lives.hidden = false;

  if (curtainShut) {
    // 엔딩 뒤 재도전: 닫힌 커튼 뒤에서 무대를 갈아끼우고 커튼을 연다
    resetScene();
    el.daylight.style.opacity = 0;
    await sleep(300);
    await setCurtain(true, 1400);
  } else {
    // 인트로 직후: 무대막이 내려왔다 올라가며 밤 부엌으로 전환 (스킵/마당 상태 모두 복귀)
    await backdropSwap(() => {
      setScene('B1');
      el.daylight.style.opacity = 0;
      camSnap(500, 280, 1);
    });
  }

  AudioFX.growl();
  const arriveLine = Narrator.speak(firstTime ? INTRO.tigerBack : LINES.retryTiger);
  // 호랑이가 부엌문을 벌컥 열고 들어와 문가에 버티고 선다
  el.tigerPos.style.opacity = 0;
  setPos(el.tigerPos, DOOR_X.B1 - 25, 520);
  el.tiger.classList.remove('faceR'); // 문으로 들어와 부엌 안쪽(왼쪽)을 본다
  await sleep(150);
  el.tigerPos.style.opacity = 1;
  stageShake();
  impact(DOOR_X.B1 - 25, 370, '어흥!', '#c0392b');
  // 할멈은 호랑이를 피해 방 안쪽으로 물러나 떤다
  grannyMood('scared');
  await walk(el.grannyPos, el.granny, POS.grannyCorner, 320);
  el.granny.classList.remove('faceR'); // 구석에 닿으면 호랑이 쪽을 보며 떤다
  el.granny.classList.add('scaredShake');
  await arriveLine; // 등장 내레이션이 끝난 뒤에

  // 유인: 할멈의 말에 이끌려 호랑이가 그제서야 아궁이로 향한다 (대사와 이동 동기화)
  const lureLine = Narrator.speak(PROMPTS[0]);
  await sleep(1400); // "호랑아, 불 좀 봐주렴"을 듣고 나서 움직이기 시작
  await Promise.all([
    walk(el.tigerPos, el.tiger, POS.tigerStage[0], 240),
    camTo(...STATION_CAM[0], 1300),
  ]);
  el.granny.classList.toggle('faceR', el.tigerPos._x > el.grannyPos._x);
  await lureLine;
  setBusy(false);
}

function onCard(idx, btn) {
  if (busy || mode !== 'play') return;
  if (btn.classList.contains('used')) { AudioFX.tap(); return; }
  setBusy(true);
  const run = idx === stage ? handleCorrect(idx, btn) : handleWrong(idx);
  run.catch(e => { console.error(e); setBusy(false); });
}

async function handleCorrect(idx, btn) {
  const f = FRIENDS[idx];
  AudioFX.ding();
  btn.classList.add('used');
  await SUCCESS[f.id]();
  showWound(idx); // 맞은 자리마다 상처가 남는다
  await Narrator.speak(f.success);
  stage++;
  if (stage >= FRIENDS.length) { await happyEnd(); return; }
  await ADVANCE[stage]();
  if (currentScene === 'B1') {
    // 할멈은 부엌 구석에서도 항상 호랑이가 있는 쪽을 바라본다
    el.granny.classList.toggle('faceR', el.tigerPos._x > el.grannyPos._x);
  }
  await Narrator.speak(PROMPTS[stage]);
  setBusy(false);
}

async function handleWrong(idx) {
  const f = FRIENDS[idx];
  const [sx, sy] = SPOTS[f.id];
  if (FRIEND_SET[f.id] === currentScene) {
    await camTo(sx, sy, 1.45, 550);      // 헛수고하는 친구에게 컷
    await FAIL[f.id]();
    impact(sx, sy - 40, '어라?', '#7a6a55');
  }
  // 다른 세트에 있는 친구를 눌러도 비웃는 컷은 항상 뜬다 (부엌에서 멍석·지게 등)
  await showCut('wrong_' + f.id);
  AudioFX.miss();
  await Narrator.speak(f.fail);
  mistakes++;
  renderLives();
  if (mistakes < MAX_MISTAKES) {
    await camTo(...STATION_CAM[stage], 550); // 호랑이에게 컷백
    AudioFX.growl();
    impact(el.tigerPos._x - 30, 360, '어흥!', '#c0392b');
    stageShake();
    await flashWarn();
    // 마지막 기회에는 더 강한 경고
    await Narrator.speak(mistakes === MAX_MISTAKES - 1 ? LINES.warningLast : LINES.warning);
    setBusy(false);
  } else {
    await badEnd();
  }
}

/* ===== 정답 연출: 각 친구가 호랑이를 혼내주는 장면 ===== */
const SUCCESS = {
  async bam() {
    // 아궁이에서 튀어나와 호랑이 눈 맞히기
    const act = friendAct('bam');
    const dx = (el.tigerPos._x - 58) - 155; // 호랑이 머리까지
    AudioFX.pop();
    await anim(act, [
      { transform: 'translate(0,0)' },
      { transform: `translate(${dx * 0.5}px, -120px) rotate(180deg)` },
      { transform: `translate(${dx}px, -70px) rotate(360deg)` },
    ], { duration: 550, easing: 'ease-out' });
    AudioFX.bonk();
    impact(el.tigerPos._x - 58, 390, '톡!');
    await showCut('bam');
    tigerEyesHurt(true);
    AudioFX.whimper();
    tigerHop([{ transform: 'translateY(0)' }, { transform: 'translateY(-34px)' }, { transform: 'translateY(0)' }], { duration: 400 });
    await anim(act, [
      { transform: `translate(${dx}px, -70px)` },
      { transform: `translate(${dx * 0.4}px, -140px) rotate(-180deg)` },
      { transform: 'translate(0,0) rotate(-360deg)' },
    ], { duration: 500, easing: 'ease-in' });
  },
  async jara() {
    AudioFX.chomp();
    await anim(friendAct('jara'), [
      { transform: 'translate(0,0)' },
      { transform: 'translate(-8px,-30px) rotate(-20deg)' },
      { transform: 'translate(0,0)' },
    ], { duration: 450, easing: 'ease-out' });
    impact(300, 380, '앙!');
    await showCut('jara');
    AudioFX.whimper();
    el.tiger.classList.add('shiver');
    await anim(el.tigerPos, [
      { transform: `translate(${el.tigerPos._x}px, 520px)` },
      { transform: `translate(${el.tigerPos._x + 26}px, 500px)` },
      { transform: `translate(${el.tigerPos._x + 26}px, 520px)` },
    ], { duration: 420 });
    setPos(el.tigerPos, el.tigerPos._x + 26, 520);
    await sleep(350);
    el.tiger.classList.remove('shiver');
  },
  async ddong() {
    AudioFX.slide();
    impact(440, 440, '미끌~', '#4f7d46');
    await anim(el.tigerPos, [
      { transform: `translate(${el.tigerPos._x}px, 520px)` },
      { transform: `translate(${POS.tigerStage[3]}px, 512px)` },
    ], { duration: 500, easing: 'ease-in' });
    setPos(el.tigerPos, POS.tigerStage[3], 520);
    el.tiger.classList.add('fallen');
    AudioFX.thud();
    impact(470, 470, '꽈당!');
    stageShake();
    await showCut('ddong');
    await sleep(400);
  },
  async songgot() {
    AudioFX.poke();
    await anim(friendAct('songgot'), [
      { transform: 'translate(0,0)' }, { transform: 'translate(0,-18px)' }, { transform: 'translate(0,0)' },
    ], { duration: 260 });
    impact(495, 440, '콕!');
    await showCut('songgot');
    el.tiger.classList.remove('fallen');
    AudioFX.boing();
    await anim(el.tigerPos, [
      { transform: `translate(${el.tigerPos._x}px, 520px)` },
      { transform: `translate(${el.tigerPos._x}px, 420px)` },
      { transform: `translate(${el.tigerPos._x}px, 520px)` },
    ], { duration: 550, easing: 'ease-out' });
  },
  async jeolgu() {
    // 문 위에서 호랑이 머리 위로 낙하
    const act = friendAct('jeolgu');
    const dx = (el.tigerPos._x - 58) - DOOR_X.B1;
    const dy = 150;
    AudioFX.slide();
    await anim(act, [
      { transform: 'translate(0,0)' },
      { transform: `translate(${dx}px, ${dy}px) rotate(14deg)` },
    ], { duration: 420, easing: 'ease-in' });
    AudioFX.bonk();
    impact(el.tigerPos._x - 40, 370, '쿵!');
    stageShake();
    await showCut('jeolgu');
    el.dizzy.setAttribute('opacity', 1);
    tigerHop([{ transform: 'translateY(0)' }, { transform: 'translateY(10px) scaleY(.9)' }, { transform: 'translateY(0)' }], { duration: 380 });
    await sleep(500);
    await anim(act, [
      { transform: `translate(${dx}px, ${dy}px)` },
      { transform: 'translate(0,0)' },
    ], { duration: 450, easing: 'ease-out' });
  },
  async myeongseok() {
    const act = friendAct('myeongseok');
    AudioFX.roll();
    impact(560, 420, '돌돌돌!');
    showCut('myeongseok'); // 말리는 동안 패널 (비차단)
    await anim(act, [
      { transform: 'translate(0,0) rotate(0deg)' },
      { transform: 'translate(-10px,-40px) rotate(-360deg) scale(1.25)' },
      { transform: 'translate(0,-6px) rotate(-720deg) scale(1.1)' },
    ], { duration: 900, easing: 'ease-in-out' });
    el.tiger.classList.remove('flat');
    el.tigerPos.style.opacity = 0;
    friendEl('myeongseok').classList.remove('shown');
    setPos(el.rolled, POS.rolledSpot, 520);
    el.rolled.style.opacity = 1;
    await anim(el.rolledInner, [
      { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0deg)' },
    ], { duration: 700 });
  },
  async jige() {
    const act = friendAct('jige');
    // 지게가 다가가 멍석말이 호랑이를 지고 강으로
    await anim(act, [{ transform: 'translate(0,0)' }, { transform: 'translate(-45px,0)' }], { duration: 500, easing: 'ease-in-out' });
    act.style.transform = 'translate(-45px, 0)';
    AudioFX.boing();
    // 둘이 함께 강가로 이동 — 카메라도 강가로 팬
    const rollMove = anim(el.rolled, [
      { transform: 'translate(560px, 520px)' },
      { transform: 'translate(930px, 475px)' },
    ], { duration: 1700, easing: 'ease-in-out' });
    await Promise.all([
      rollMove,
      anim(act, [{ transform: 'translate(-45px,0)' }, { transform: 'translate(215px,0)' }], { duration: 1700, easing: 'ease-in-out' }),
      camTo(880, 440, 1.4, 1700),
    ]);
    setPos(el.rolled, 930, 475);
    act.style.transform = 'translate(215px, 0)';
    // 강물에 풍덩
    await anim(el.rolled, [
      { transform: 'translate(930px, 475px) rotate(0deg)', opacity: 1 },
      { transform: 'translate(965px, 405px) rotate(160deg)', opacity: 1 },
      { transform: 'translate(970px, 505px) rotate(340deg) scale(.55)', opacity: 1 },
    ], { duration: 800, easing: 'ease-in' });
    el.rolled.style.opacity = 0;
    el.rolled.style.transform = '';
    AudioFX.splash();
    impact(950, 430, '풍덩!', '#3e6a8a');
    showCut('jige'); // 물보라와 동시 (비차단)
    anim(el.splash, [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], { duration: 900 });
    await anim(act, [{ transform: 'translate(215px,0)' }, { transform: 'translate(0,0)' }], { duration: 900, easing: 'ease-in-out' });
    act.style.transform = '';
  },
};

/* ===== 단계 전환: 다음 공격 지점으로 호랑이 이동 ===== */
const ADVANCE = {
  1: async () => {
    tigerEyesHurt(true);
    await Promise.all([walk(el.tigerPos, el.tiger, POS.tigerStage[1], 380), camTo(...STATION_CAM[1], 900)]);
  },
  2: async () => {
    tigerEyesHurt(false);
    await Promise.all([walk(el.tigerPos, el.tiger, POS.tigerStage[2], 300), camTo(...STATION_CAM[2], 900)]);
  },
  3: async () => { await camTo(...STATION_CAM[3], 600); /* 이미 미끄러져 넘어진 상태 */ },
  4: async () => {
    await Promise.all([walk(el.tigerPos, el.tiger, POS.tigerStage[4], 360), camTo(...STATION_CAM[4], 900)]);
  },
  5: async () => {
    // 절구에 맞은 호랑이가 집 문에서 뛰쳐나와 마당으로 도망친다 — 무대 전환
    await backdropSwap(() => {
      setScene('B2');
      setPos(el.grannyPos, -70, 520); // 할멈은 부엌에 남는다
      camSnap(500, 280, 1);
    });
    // 호랑이가 마당 문에서 뚜렷하게 나타난다 (막이 걷힌 뒤, 별도 등장 비트)
    el.tigerPos.style.opacity = 0;
    setPos(el.tigerPos, DOOR_X.B2 + 30, 520);
    el.tiger.classList.remove('faceR');
    await sleep(150);
    el.tigerPos.style.opacity = 1;
    stageShake();
    await sleep(300);
    await Promise.all([walk(el.tigerPos, el.tiger, POS.tigerStage[5], 260), camTo(...STATION_CAM[5], 1400)]);
    el.tiger.classList.add('flat');
    AudioFX.thud();
    await sleep(300);
  },
  6: async () => { await camTo(...STATION_CAM[6], 600); /* 멍석에 말린 상태 */ },
};

/* ===== 오답 연출: 상황에 맞는 헛수고 장면 ===== */
const FAIL = {
  async bam() {
    const act = friendAct('bam');
    AudioFX.pop();
    await anim(act, [
      { transform: 'translate(0,0)' },
      { transform: 'translate(-60px,-100px) rotate(-180deg)' },
      { transform: 'translate(-90px,0) rotate(-360deg)' },
      { transform: 'translate(-60px,-40px) rotate(-460deg)' },
      { transform: 'translate(0,0) rotate(-720deg)' },
    ], { duration: 1200, easing: 'ease-in-out' });
  },
  async jara() {
    AudioFX.chomp();
    await anim(friendAct('jara'), [
      { transform: 'translate(0,0)' }, { transform: 'translate(-6px,-16px)' },
      { transform: 'translate(6px,-16px)' }, { transform: 'translate(0,0)' },
    ], { duration: 700 });
    AudioFX.chomp();
  },
  async ddong() {
    await bounceFriend('ddong');
    AudioFX.boing();
    if (el.tigerPos.style.opacity !== '0' && !el.tiger.classList.contains('flat') && !el.tiger.classList.contains('fallen')) {
      await tigerHop([
        { transform: 'translateY(0)' }, { transform: 'translateY(-40px)' }, { transform: 'translateY(0)' },
      ], { duration: 450 });
    }
  },
  async songgot() {
    AudioFX.poke();
    await anim(friendAct('songgot'), [
      { transform: 'translate(0,0)' }, { transform: 'translate(0,-16px)' },
      { transform: 'translate(0,0)' }, { transform: 'translate(0,-16px)' }, { transform: 'translate(0,0)' },
    ], { duration: 600 });
  },
  async jeolgu() {
    const act = friendAct('jeolgu');
    AudioFX.slide();
    await anim(act, [
      { transform: 'translate(0,0)' }, { transform: 'translate(-30px,205px) rotate(30deg)' },
    ], { duration: 450, easing: 'ease-in' });
    AudioFX.thud();
    await sleep(350);
    await anim(act, [
      { transform: 'translate(-30px,205px)' }, { transform: 'translate(0,0)' },
    ], { duration: 500, easing: 'ease-out' });
  },
  async myeongseok() {
    AudioFX.roll();
    await anim(friendAct('myeongseok'), [
      { transform: 'scaleX(1)' }, { transform: 'scaleX(1.5)' }, { transform: 'scaleX(.8)' }, { transform: 'scaleX(1)' },
    ], { duration: 900 });
  },
  async jige() {
    AudioFX.boing();
    await anim(friendAct('jige'), [
      { transform: 'rotate(0deg)' }, { transform: 'rotate(-12deg)' },
      { transform: 'rotate(10deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(0deg)' },
    ], { duration: 800 });
  },
};

/* ===== 엔딩 ===== */
async function badEnd() {
  mode = 'end';
  el.tray.hidden = true;
  el.lives.hidden = true;

  // 멍석에 말려 있었다면 빠져나온다
  if (el.tigerPos.style.opacity === '0') {
    el.rolled.style.opacity = 0;
    el.tigerPos.style.opacity = 1;
    setPos(el.tigerPos, POS.rolledSpot, 520);
  }
  el.tiger.classList.remove('fallen', 'flat', 'shiver');
  tigerEyesHurt(false);
  el.dizzy.setAttribute('opacity', 0);

  anim(el.darkOverlay, [{ opacity: 0 }, { opacity: 0.5 }], { duration: 1200 });
  AudioFX.growl();
  // 카메라가 구석의 할멈에게 다가가는 호랑이를 따라간다
  await Promise.all([
    walk(el.tigerPos, el.tiger, 120, 260),
    camTo(180, 430, 1.5, 1800),
  ]);
  grannyMood('scared');
  await sleep(300);

  AudioFX.gulp();
  impact(120, 390, '꿀꺽…', '#5b3a24');
  await anim(el.granny, [
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: 'translate(40px,-20px) scale(.4)', opacity: 1 },
    { transform: 'translate(70px,-30px) scale(0)', opacity: 0 },
  ], { duration: 700, easing: 'ease-in' });
  el.granny.style.opacity = 0;
  el.belly.style.transformBox = 'fill-box';
  el.belly.style.transformOrigin = 'center';
  await anim(el.belly, [
    { transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1.3)' },
  ], { duration: 600 });
  el.belly.style.transform = 'scale(1.3)';

  AudioFX.sad();
  await Narrator.speak(LINES.badEnd);
  await setCurtain(false, 1100); // 막이 내린다
  showEnd(false);
}

async function happyEnd() {
  mode = 'end';
  el.tray.hidden = true;
  el.lives.hidden = true;

  AudioFX.fanfare();
  await camWide(900); // 잔치는 다 함께 와이드로
  spawnConfetti();
  el.granny.classList.remove('scaredShake');
  grannyMood('happy');
  // 할멈이 부엌문에서 마당으로 걸어 나온다 (호랑이 등장과 같은 문)
  el.granny.style.opacity = 0;
  setPos(el.grannyPos, DOOR_X.B2, 520);
  el.granny.classList.remove('faceR');
  await sleep(150);
  el.granny.style.opacity = 1;
  await walk(el.grannyPos, el.granny, 545, 260);
  // 친구들이 할멈 주위로 우르르 모여든다
  const GATHER = { bam: 400, jara: 450, ddong: 498, songgot: 600, jeolgu: 648, myeongseok: 705, jige: 765 };
  await Promise.all(FRIENDS.map(f => {
    const g = friendEl(f.id);
    g.classList.add('shown', 'party');
    g.style.display = '';
    const m = (g.getAttribute('transform') || '').match(/translate\(([\d.-]+),\s*([\d.-]+)\)/);
    const gx = m ? parseFloat(m[1]) : 500;
    const gy = m ? parseFloat(m[2]) : 520;
    return anim(friendAct(f.id),
      [{ transform: `translate(${GATHER[f.id] - gx}px, ${Math.max(0, 520 - gy)}px)` }],
      { duration: 850, easing: 'ease-out' });
  }));
  await Narrator.speak(LINES.happyEnd);
  await sleep(600);
  await setCurtain(false, 1300); // 막이 내린다
  showEnd(true);
}

function showEnd(happy) {
  el.endTitle.textContent = happy ? '🎉 만세!' : '아이고…';
  el.endMsg.textContent = happy
    ? '친구들이 힘을 모아 호랑이를 물리쳤어요!'
    : '호랑이가 할멈을 꿀꺽! 친구들을 순서대로 불러 볼까요?';
  el.retryBtn.textContent = happy ? '다시 하기' : '다시 해볼까?';
  el.endScreen.hidden = false;
}

function spawnConfetti() {
  const colors = ['#f2913d', '#ffd54f', '#8e3b2f', '#7aa86a', '#8fb8dd', '#e8b6c8'];
  for (let i = 0; i < 44; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.background = colors[i % colors.length];
    s.style.animationDuration = 2.4 + Math.random() * 2 + 's';
    s.style.animationDelay = Math.random() * 1.2 + 's';
    el.confetti.appendChild(s);
    setTimeout(() => s.remove(), 6000);
  }
}

/* ===== 리셋 & 재시작 ===== */
function resetScene() {
  el.endScreen.hidden = true;
  clearWounds();
  el.granny.classList.remove('faceR');
  el.tiger.classList.remove('faceR');
  el.confetti.innerHTML = '';
  el.darkOverlay.style.opacity = '';
  el.daylight.style.opacity = 0;
  setScene('B1');
  el.audience.hidden = true;
  el.houseLight.setAttribute('opacity', 0);
  camSnap(500, 280, 1, 0);

  el.tigerPos.style.opacity = 1;
  el.tiger.classList.remove('fallen', 'flat', 'shiver', 'walking');
  tigerEyesHurt(false);
  el.dizzy.setAttribute('opacity', 0);
  el.belly.style.transform = '';
  setPos(el.tigerPos, POS.tigerEnter, 520);

  el.granny.style.opacity = 1;
  el.granny.style.transform = '';
  setPos(el.grannyPos, POS.grannyCook, 520);
  grannyMood('cry');

  el.rolled.style.opacity = '';
  el.rolled.style.transform = '';

  FRIENDS.forEach(f => {
    const g = friendEl(f.id);
    g.classList.remove('party', 'bounce');
    g.classList.add('shown');
    const act = friendAct(f.id);
    act.style.transform = '';
  });
}

/* ===== 시작 ===== */
function init() {
  setScene('B1');
  setPos(el.tigerPos, POS.tigerEnter, 520);
  setPos(el.grannyPos, POS.grannyCook, 520);
  grannyMood('cook');
  // 시작 전: 객석에서 본 줌아웃 공연장 뷰
  camSnap(500, 295, 0.78, 0);
  el.backdrop.style.visibility = 'hidden'; // 무대막은 전환 중에만 표시

  el.startBtn.addEventListener('click', async () => {
    AudioFX.unlock();
    AudioFX.tap();
    // 내레이션 클립을 백그라운드에서 미리 디코딩
    if (typeof NARRATION_CLIPS !== 'undefined') AudioFX.preloadAll(Object.values(NARRATION_CLIPS).flat());
    preloadCuts(); // 만화 컷 패널 미리 받기
    el.titleScreen.hidden = true;
    skipRequested = false;
    setScene('A'); // 커튼이 열리면 가을 팥밭(1막)
    await theaterOpening();
    await playIntro();
    await beginPlay(true);
  });

  // 컷 패널 탭 → 다음 컷으로 빠르게
  const cutPanelEl = $('#cutPanel');
  if (cutPanelEl) cutPanelEl.addEventListener('pointerdown', e => {
    e.stopPropagation();
    AudioFX.tap();
    if (cutTapResolve) cutTapResolve();
  });

  // 무대(말풍선) 탭 → 현재 대사를 건너뛰고 다음으로
  el.stage.addEventListener('pointerdown', () => {
    if (mode === 'intro' || (mode === 'play' && busy)) Narrator.stop();
  });

  el.skipBtn.addEventListener('click', () => {
    AudioFX.tap();
    skipRequested = true;
    Narrator.stop();
  });

  el.retryBtn.addEventListener('click', async () => {
    AudioFX.tap();
    el.endScreen.hidden = true;
    await beginPlay(false); // 닫힌 커튼 뒤에서 무대를 갈아끼운 뒤 커튼이 열린다
  });

  el.homeBtn.addEventListener('click', () => location.reload());

  // 개발 확인용: #stage 해시로 열면 타이틀 없이 무대+카드 즉시 표시
  if (location.hash === '#stage-a') {
    el.titleScreen.hidden = true;
    camSnap(500, 280, 1, 0);
    el.audience.hidden = true;
    el.houseLight.setAttribute('opacity', 0);
    curtainShut = false;
    el.curtainL.style.transform = 'translateX(-700px)';
    el.curtainR.style.transform = 'translateX(700px)';
    setScene('A');
    grannyMood('cook');
    setPos(el.grannyPos, 380, 520);
    setPos(el.tigerPos, 760, 520);
  }
  if (location.hash === '#stage-b2') {
    el.titleScreen.hidden = true;
    camSnap(500, 280, 1, 0);
    el.audience.hidden = true;
    el.houseLight.setAttribute('opacity', 0);
    curtainShut = false;
    el.curtainL.style.transform = 'translateX(-700px)';
    el.curtainR.style.transform = 'translateX(700px)';
    setScene('B2');
    ['myeongseok', 'jige'].forEach(id => friendEl(id).classList.add('shown'));
    setPos(el.tigerPos, 560, 520);
    setPos(el.grannyPos, -70, 520);
    el.tray.hidden = false; buildTray(); renderLives(); el.lives.hidden = false;
  }
  if (location.hash === '#stage' || location.hash === '#stage-zoom') {
    el.titleScreen.hidden = true;
    camSnap(500, 280, 1, 0);
    el.audience.hidden = true;
    el.houseLight.setAttribute('opacity', 0);
    curtainShut = false;
    el.curtainL.style.transform = 'translateX(-560px)';
    el.curtainR.style.transform = 'translateX(560px)';
    FRIENDS.forEach(f => friendEl(f.id).classList.add('shown'));
    grannyMood('cry');
    setPos(el.tigerPos, POS.tigerStage[0], 520);
    buildTray();
    if (location.hash === '#stage-zoom') {
      grannyMood('scared');
      setPos(el.grannyPos, POS.grannyCorner, 520);
      camSnap(...STATION_CAM[0]);
      el.impact.setAttribute('transform', 'translate(212,390)');
      el.impact.setAttribute('opacity', 1);
      el.impactText.textContent = '톡!';
    }
  }
}

init();
