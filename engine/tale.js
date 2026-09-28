/* 종이 동화극장 공용 엔진 — 새 동화(tales/*)가 함께 쓴다.
   의존: ../../audio.js (AudioFX, Narrator — #bubble/#bubbleText를 쓴다)
   규칙(TALES_PLAN §0):
   - 조작 5가지: tap(톡) · mash(톡톡톡) · choose(골라요) · swipe(쓱) · hold(꾹)
   - 막힘 방지: 5초 무입력 → 손가락 안내, 12초 → 다시 말해 줌, 20초 → 연타·쓸기·꾹은 자동 마무리
   - 게임오버 없음. 골라요는 틀릴수록 더 도와준다 (1회: 장소 힌트, 2회~: 정답이 들썩이며 이름을 알려줌)
   - 대사 중에는 조작이 잠기고, 무대를 1초 꾹 누르면 대사를 건너뛴다 (보호자용) */
const Tale = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const $ = s => document.querySelector(s);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let root, stage, cam, bgL, world, fxL, handEl, busy = true;
  const camState = { x: 500, y: 280, z: 1 };

  /* ---------- SVG 도우미 ---------- */
  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  /* 종이 조각 묶음: shapes = [[tag, attrs], ...] */
  function paper(parent, shapes, attrs = {}) {
    const g = el('g', { filter: 'url(#pp)', ...attrs }, parent);
    shapes.forEach(([t, a]) => el(t, a, g));
    return g;
  }

  /* ---------- 애니메이션 ---------- */
  async function anim(target, keyframes, opts) {
    const o = typeof opts === 'number' ? { duration: opts } : opts;
    const a = target.animate(keyframes, { ...o, fill: 'forwards' });
    try { await a.finished; } catch (e) { /* 취소 */ }
    try { a.commitStyles(); } catch (e) { /* 미표시 요소 */ }
    a.cancel();
  }
  /* 배우: 발끝이 (x,y)인 그룹. body에 그림을 그리고 move/hop/face로 움직인다 */
  function actor(parent, x, y, draw, opts = {}) {
    const pos = el('g', {}, parent);
    const body = el('g', {}, pos);
    body.style.transformBox = 'view-box';
    body.style.transformOrigin = '0 0';
    draw(body);
    const a = {
      pos, body, x, y, scale: opts.scale || 1, flip: 1,
      place(nx, ny) { a.x = nx; a.y = ny; pos.setAttribute('transform', `translate(${nx},${ny}) scale(${a.flip * a.scale},${a.scale})`); },
      async move(nx, ny = a.y, dur = 800, easing = 'ease-in-out') {
        const from = `translate(${a.x}px,${a.y}px) scale(${a.flip * a.scale},${a.scale})`;
        const to = `translate(${nx}px,${ny}px) scale(${a.flip * a.scale},${a.scale})`;
        pos.removeAttribute('transform');
        await anim(pos, [{ transform: from }, { transform: to }], { duration: dur, easing });
        pos.style.transform = '';
        a.place(nx, ny);
      },
      face(dir) { a.flip = dir === 'right' ? -1 : 1; a.place(a.x, a.y); },
      setScale(s) { a.scale = s; a.place(a.x, a.y); },
      hop(h = 30, dur = 420) {
        return anim(body, [{ transform: 'translateY(0)' }, { transform: `translateY(${-h}px)` }, { transform: 'translateY(0)' }], { duration: dur, easing: 'ease-out' });
      },
      wiggle(deg = 8, dur = 500) {
        return anim(body, [{ transform: 'rotate(0)' }, { transform: `rotate(${-deg}deg)` }, { transform: `rotate(${deg}deg)` }, { transform: 'rotate(0)' }], dur);
      },
    };
    a.place(x, y);
    return a;
  }

  /* ---------- 카메라 (SVG 사용자 좌표) ---------- */
  function camT(x, y, z) { return `translate(500px,280px) scale(${z}) translate(${-x}px,${-y}px)`; }
  function clampCam(x, y, z) {
    if (z <= 1) return [500, 280];
    const hx = 500 / z, hy = 280 / z;
    return [Math.min(Math.max(x, hx), 1000 - hx), Math.min(Math.max(y, hy), 560 - hy)];
  }
  async function camTo(x, y, z = 1, dur = 800) {
    [x, y] = clampCam(x, y, z);
    $('#frame').classList.toggle('out', z > 1.05);
    await anim(cam, [{ transform: camT(camState.x, camState.y, camState.z) }, { transform: camT(x, y, z) }],
      { duration: dur, easing: 'cubic-bezier(.35,0,.25,1)' });
    Object.assign(camState, { x, y, z });
  }
  function camSnap(x, y, z = 1) {
    [x, y] = clampCam(x, y, z);
    $('#frame').classList.toggle('out', z > 1.05);
    cam.style.transform = camT(x, y, z);
    Object.assign(camState, { x, y, z });
  }
  const camWide = (dur = 700) => camTo(500, 280, 1, dur);

  /* ---------- 대사 ---------- */
  async function say(text) {
    const was = busy; busy = true;
    await Narrator.speak(text);
    busy = was;
  }

  /* ---------- 손가락 안내 ---------- */
  const HAND_SVG = '<svg viewBox="0 0 64 64"><path d="M22 30 V10 a5 5 0 0 1 10 0 V28 M32 26 a5 5 0 0 1 10 0 V30 M42 28 a5 5 0 0 1 10 0 V40 C52 52 44 60 34 60 C24 60 18 54 14 46 L8 36 a5 5 0 0 1 8 -5 L22 38 Z" fill="#F6ECD8" stroke="#6B4A32" stroke-width="3" stroke-linejoin="round"/></svg>';
  function screenPoint(target) {
    const r = target.getBoundingClientRect(), s = root.getBoundingClientRect();
    return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2];
  }
  function showHand(target, kind = 'tap') {
    const [x, y] = screenPoint(target);
    handEl.className = kind; handEl.style.left = x + 'px'; handEl.style.top = y + 'px'; handEl.hidden = false;
  }
  function hideHand() { handEl.hidden = true; }

  /* 막힘 방지 공통: 입력이 오면 poke()로 타이머 리셋 */
  function helper({ target, kind = 'tap', prompt, auto }) {
    let t1, t2, t3, dead = false;
    const arm = () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); hideHand();
      if (dead) return;
      t1 = setTimeout(() => !dead && showHand(target, kind), 5000);
      if (prompt) t2 = setTimeout(() => !dead && Narrator.speak(prompt), 12000);
      if (auto) t3 = setTimeout(() => !dead && auto(), 20000);
    };
    arm();
    return { poke: arm, stop() { dead = true; clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); hideHand(); } };
  }

  function arm(target, on) {
    target.classList.add('tap-target');
    target.classList.toggle('armed', !!on);
  }

  /* ---------- 조작 1: 톡 ---------- */
  function tap(target, { prompt } = {}) {
    return new Promise(res => {
      arm(target, true);
      const h = helper({ target, prompt });
      const on = e => {
        e.stopPropagation();
        if (busy) return;
        target.removeEventListener('pointerdown', on);
        arm(target, false); h.stop(); AudioFX.tap(); res();
      };
      target.addEventListener('pointerdown', on);
    });
  }

  /* ---------- 조작 2: 톡톡톡 (누를 때마다 onStep, count번이면 끝, 20초면 자동 마무리) ---------- */
  function mash(target, { count = 6, onStep, prompt } = {}) {
    return new Promise(res => {
      let i = 0, done = false;
      arm(target, true);
      const finish = () => { if (done) return; done = true; target.removeEventListener('pointerdown', on); arm(target, false); h.stop(); res(); };
      const step = () => { i++; onStep && onStep(i); if (i >= count) finish(); };
      const h = helper({ target, prompt, auto: async () => { while (!done) { step(); await sleep(450); } } });
      const on = e => { e.stopPropagation(); if (busy || done) return; h.poke(); step(); };
      target.addEventListener('pointerdown', on);
    });
  }

  /* ---------- 조작 3: 골라요 (틀릴수록 더 도와준다) ---------- */
  function choose(options, { prompt, where, who } = {}) {
    return new Promise(res => {
      let misses = 0, locked = false;
      const good = options.find(o => o.ok);
      const h = helper({ target: good.el, prompt });
      h.stop(); // 골라요는 정답 위치를 먼저 알려주지 않는다 — 12초 재안내만
      let t2 = prompt ? setTimeout(() => Narrator.speak(prompt), 12000) : null;
      options.forEach(o => {
        arm(o.el, true);
        o._on = async e => {
          e.stopPropagation();
          if (busy || locked) return;
          locked = true; clearTimeout(t2);
          if (o.ok) {
            options.forEach(x => { x.el.removeEventListener('pointerdown', x._on); arm(x.el, false); x.el.style.filter = ''; });
            AudioFX.ding(); res(o); return;
          }
          misses++;
          AudioFX.miss();
          if (o.onWrong) await o.onWrong(); else await wiggleEl(o.el);
          if (misses === 1 && where) await say(where);
          if (misses >= 2) {
            good.el.style.filter = 'url(#hintGlow)';
            pulse(good.el);
            if (who) await say(who);
          }
          locked = false;
          t2 = prompt ? setTimeout(() => Narrator.speak(prompt), 12000) : null;
        };
        o.el.addEventListener('pointerdown', o._on);
      });
    });
  }
  function wiggleEl(n) {
    return anim(n, [{ translate: '0 0' }, { translate: '-8px 0' }, { translate: '8px 0' }, { translate: '0 0' }], 360);
  }
  function pulse(n) {
    n.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], { duration: 900, iterations: 4, easing: 'ease-in-out' });
  }

  /* ---------- 조작 4: 쓱 (방향만 맞으면 성공, 톡도 한 걸음으로 인정) ---------- */
  function swipe(area, { dir = 'up', count = 3, onStep, prompt } = {}) {
    return new Promise(res => {
      let i = 0, done = false, sx = 0, sy = 0;
      arm(area, true);
      const h = helper({ target: area, kind: dir === 'up' ? 'swipe-up' : 'swipe-right', prompt,
        auto: async () => { while (!done) { step(); await sleep(700); } } });
      const finish = () => { if (done) return; done = true; area.removeEventListener('pointerdown', down); window.removeEventListener('pointerup', up); arm(area, false); h.stop(); res(); };
      const step = () => { i++; onStep && onStep(i); if (i >= count) finish(); };
      const down = e => { e.stopPropagation(); if (busy || done) return; sx = e.clientX; sy = e.clientY; area._down = true; };
      const up = e => {
        if (!area._down) return; area._down = false; if (busy || done) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        const okDir = dir === 'up' ? -dy > 30 : dir === 'right' ? dx > 30 : dir === 'left' ? -dx > 30 : dy > 30;
        const isTap = Math.hypot(dx, dy) < 12;
        if (okDir || isTap) { h.poke(); step(); }
      };
      area.addEventListener('pointerdown', down);
      window.addEventListener('pointerup', up);
    });
  }

  /* ---------- 조작 5: 꾹 (누르는 동안 진행, 떼도 진행은 남는다) ---------- */
  function hold(target, { ms = 1500, onProgress, prompt } = {}) {
    return new Promise(res => {
      let p = 0, timer = null, done = false;
      arm(target, true);
      const h = helper({ target, kind: 'hold', prompt, auto: () => { stopT(); tick(true); } });
      const finish = () => { if (done) return; done = true; stopT(); target.removeEventListener('pointerdown', down); arm(target, false); h.stop(); res(); };
      const stopT = () => { clearInterval(timer); timer = null; };
      const tick = auto => {
        timer = setInterval(() => {
          p = Math.min(1, p + 50 / ms); onProgress && onProgress(p);
          if (p >= 1) finish();
        }, 50);
      };
      const down = e => { e.stopPropagation(); if (busy || done) return; h.poke(); if (!timer) tick(); };
      target.addEventListener('pointerdown', down);
      ['pointerup', 'pointercancel'].forEach(ev => window.addEventListener(ev, () => { if (!done) stopT(); }));
    });
  }

  /* ---------- 자유 놀이: 정해진 시간 동안 아무거나 눌러도 반응 ---------- */
  async function free(targets, ms = 15000) {
    const offs = targets.map(t => {
      arm(t.el, true);
      const on = e => { e.stopPropagation(); if (!busy) t.onTap(); };
      t.el.addEventListener('pointerdown', on);
      return () => { t.el.removeEventListener('pointerdown', on); arm(t.el, false); };
    });
    await sleep(ms);
    offs.forEach(f => f());
  }

  /* ---------- 무대 장치 ---------- */
  function curtain(open) { root.classList.toggle('open', open); AudioFX.swish(); return sleep(1250); }
  async function sceneCard(label, change) {
    const sh = $('#sceneSheet');
    sh.querySelector('span').textContent = label;
    AudioFX.swish(); sh.classList.add('down'); await sleep(520);
    if (change) change();
    await sleep(1000);
    AudioFX.swish(); sh.classList.remove('down'); await sleep(520);
  }
  /* 만화 컷: draw(svg 0..400 x 0..300)로 임시 그림. 탭하면 빨리 넘어간다 */
  async function cut(draw, { hold: ms = 2600, sfx } = {}) {
    const p = $('#cutPanel');
    p.innerHTML = '<div class="cut"></div>';
    const svg = el('svg', { viewBox: '0 0 400 300' }, p.firstChild);
    el('rect', { width: 400, height: 300, fill: '#1F2A56' }, svg);
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      el('path', { d: `M200 150 L${200 + Math.cos(a) * 400} ${150 + Math.sin(a) * 400} L${200 + Math.cos(a + .16) * 400} ${150 + Math.sin(a + .16) * 400} Z`, fill: i % 2 ? '#E8703A' : '#D9A94E', opacity: .85 }, svg);
    }
    draw(svg);
    p.hidden = false;
    if (sfx && AudioFX[sfx]) AudioFX[sfx]();
    shake();
    await new Promise(res => { const t = setTimeout(res, ms); p.onpointerdown = () => { clearTimeout(t); setTimeout(res, 200); }; });
    p.hidden = true; p.innerHTML = '';
  }
  function shake() { const w = $('#stageWrap'); w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake'); }
  function confetti() {
    const colors = ['#E8703A', '#D9A94E', '#A93B32', '#3F6B4F', '#8B7BB8', '#F6ECD8'];
    for (let i = 0; i < 44; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%'; s.style.background = colors[i % colors.length];
      s.style.animationDuration = 2.4 + Math.random() * 2 + 's'; s.style.animationDelay = Math.random() * 1.2 + 's';
      $('#confetti').appendChild(s); setTimeout(() => s.remove(), 6000);
    }
  }
  /* 텍스트 효과 (의성어) */
  function pop(x, y, word, color = '#A93B32') {
    const g = el('g', { transform: `translate(${x},${y})` }, fxL);
    el('path', { d: 'M60 0 L36 10 L52 30 L26 26 L30 52 L10 36 L0 60 L-10 36 L-30 52 L-26 26 L-52 30 L-36 10 L-60 0 L-36 -10 L-52 -30 L-26 -26 L-30 -52 L-10 -36 L0 -60 L10 -36 L30 -52 L26 -26 L52 -30 L36 -10 Z', fill: '#F2B366', stroke: '#E8703A', 'stroke-width': 4 }, g);
    el('text', { y: 13, 'text-anchor': 'middle', 'font-size': 36, fill: color, 'font-family': 'Jua, sans-serif', stroke: '#fff', 'stroke-width': 6, 'paint-order': 'stroke', text: word }, g);
    g.animate([{ opacity: 0, transform: `translate(${x}px,${y}px) scale(.3)` }, { opacity: 1, transform: `translate(${x}px,${y}px) scale(1.15)`, offset: .3 }, { opacity: 1, transform: `translate(${x}px,${y}px) scale(1)`, offset: .75 }, { opacity: 0, transform: `translate(${x}px,${y}px) scale(1.05)` }], { duration: 950 }).finished.then(() => g.remove());
  }

  /* ---------- 음 재생 (동화별 효과음: 개굴 음계, 음매 등) ---------- */
  let actx = null;
  function tone(freq, dur = .2, { type = 'triangle', vol = .22, when = 0 } = {}) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      const t0 = actx.currentTime + when, o = actx.createOscillator(), g = actx.createGain();
      o.type = type;
      if (Array.isArray(freq)) { o.frequency.setValueAtTime(freq[0], t0); o.frequency.exponentialRampToValueAtTime(Math.max(freq[1], 1), t0 + dur); }
      else o.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
      o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + dur + .05);
    } catch (e) { /* 소리 없이 진행 */ }
  }

  /* ---------- 장면 비우기 ---------- */
  function clear() { bgL.innerHTML = ''; world.innerHTML = ''; fxL.innerHTML = ''; }

  /* ---------- 틀 만들기 ---------- */
  function mount({ title, subtitle, run }) {
    document.title = title;
    document.body.insertAdjacentHTML('beforeend', `
<div id="tale">
  <div id="stageWrap">
    <svg id="stage" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="pp" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#2E241C" flood-opacity=".45"/></filter>
        <filter id="armGlow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#F6ECD8" flood-opacity=".9"/></filter>
        <filter id="hintGlow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#FFD54F" flood-opacity="1"/></filter>
      </defs>
      <g id="cam"><g id="bgL"></g><g id="world"></g><g id="fxL"></g></g>
    </svg>
    <div id="frame"></div>
    <div id="curtainL" class="curtain"></div><div id="curtainR" class="curtain"></div>
    <div id="sceneSheet"><span></span></div>
    <div id="cutPanel" hidden></div>
    <div id="confetti"></div>
    <div id="hand" hidden>${HAND_SVG}</div>
  </div>
  <div id="bubble" hidden><p id="bubbleText"></p></div>
  <div id="startScreen" class="screen">
    <div class="plaque"><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ''}</div>
    <div class="tickets"><button class="ticket" id="startBtn">공연 시작</button><a class="ticket alt" href="../../index.html" style="text-decoration:none;display:grid;place-items:center">처음으로</a></div>
    <div class="greybox-note">임시 그림 버전 — 페이퍼아트 그림은 제작 중이에요</div>
  </div>
  <div id="endScreen" class="screen" hidden>
    <div class="plaque"><h2>끝!</h2><p id="endMsg"></p></div>
    <div class="tickets"><button class="ticket" id="againBtn">다시 보기</button><a class="ticket alt" href="../../index.html" style="text-decoration:none;display:grid;place-items:center">처음으로</a></div>
  </div>
</div>`);
    root = $('#tale'); stage = $('#stage'); cam = $('#cam'); bgL = $('#bgL'); world = $('#world'); fxL = $('#fxL'); handEl = $('#hand');
    // 대사 건너뛰기: 무대 1초 꾹 (보호자용). 짧은 탭은 무시한다
    let ht = null;
    $('#stageWrap').addEventListener('pointerdown', () => { clearTimeout(ht); ht = setTimeout(() => Narrator.stop(), 1000); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => $('#stageWrap').addEventListener(ev, () => clearTimeout(ht)));
    // 잠긴 동안 누르면 톡 소리만
    $('#stageWrap').addEventListener('pointerdown', () => { if (busy) AudioFX.tap(); });
    const start = async () => {
      AudioFX.unlock();
      $('#startScreen').hidden = true; $('#endScreen').hidden = true;
      clear(); camSnap(500, 280, 1); root.classList.remove('open');
      busy = true;
      const msg = await run(api);
      busy = true;
      await curtain(false);
      $('#endMsg').textContent = msg || '';
      $('#endScreen').hidden = false;
    };
    $('#startBtn').onclick = start;
    $('#againBtn').onclick = start;
  }

  /* 조작 대기 동안만 입력을 받는다 */
  const input = fn => async (...a) => { busy = false; try { return await fn(...a); } finally { busy = true; } };

  const api = {
    el, paper, anim, actor, sleep, say, tone, camTo, camSnap, camWide, curtain, sceneCard, cut, shake, confetti, pop, clear,
    tap: input(tap), mash: input(mash), choose: input(choose), swipe: input(swipe), hold: input(hold), free: input(free),
    get bg() { return bgL; }, get world() { return world; }, get fx() { return fxL; }, get root() { return root; },
  };
  return { mount, api };
})();
