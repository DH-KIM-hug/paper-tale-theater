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

  const paperTurn = () => AudioFX.sfx('paper_turn', .8) || AudioFX.swish();

  /* ---------- 카메라 (SVG 사용자 좌표) ---------- */
  function camT(x, y, z) { return `translate(500px,280px) scale(${z}) translate(${-x}px,${-y}px)`; }
  /* 화면에 실제로 보이는 무대 폭(사용자 좌표). 세로 화면(slice)에서는 1000보다 좁다 */
  function viewWidth() {
    const r = stage && stage.getBoundingClientRect();
    if (!r || !r.width || !r.height) return 1000;
    return Math.min(1000, 560 * r.width / r.height);
  }
  function clampCam(x, y, z) {
    // 가로(meet)에서는 무대 전체 폭이 늘 보인다 (위아래 남는 곳은 종이 구멍 밖) → 폭 1000으로 막는다
    const meet = stage && /meet/.test(stage.getAttribute('preserveAspectRatio') || '');
    const hx = (meet ? 1000 : viewWidth()) / 2 / Math.max(z, 1e-3), hy = 280 / z;
    if (z <= 1) return [hx >= 500 ? 500 : Math.min(Math.max(x, hx), 1000 - hx), 280];
    return [Math.min(Math.max(x, hx), 1000 - hx), Math.min(Math.max(y, hy), 560 - hy)];
  }
  /* 연출(director)이 움직이는 카메라와 동화가 직접 움직이는 카메라를 구분한다.
     동화가 카메라를 잡으면 epoch가 바뀌고, 진행 중이던 연출 이동은 그 자리에서 멈춘다 */
  let camEpoch = 0, directing = false, dirAnim = null, taleMoving = 0;
  const dirDest = { x: 500, y: 280, z: 1 }; // 연출 이동이 향하는 곳 (이동 중 비교용)
  const camTarget = { x: 500, y: 280, z: 1 }; // 동화가 마지막으로 잡으려 한 화면 (이동 중이어도)
  function syncCamFromScreen() {
    const m = new DOMMatrix(getComputedStyle(cam).transform);
    if (m.a > 0) Object.assign(camState, { z: m.a, x: (500 - m.e) / m.a, y: (280 - m.f) / m.a });
  }
  async function camTo(x, y, z = 1, dur = 800) {
    const mine = directing;
    if (mine && dirAnim) { syncCamFromScreen(); dirAnim.cancel(); dirAnim = null; }
    if (!mine) {
      camEpoch++;
      if (dirAnim) { syncCamFromScreen(); dirAnim.cancel(); dirAnim = null; cam.style.transform = camT(camState.x, camState.y, camState.z); }
    }
    [x, y] = clampCam(x, y, z);
    if (!mine) { Object.assign(camTarget, { x, y, z }); taleMoving++; }
    $('#frame').classList.toggle('out', z > 1.05);
    const a = cam.animate([{ transform: camT(camState.x, camState.y, camState.z) }, { transform: camT(x, y, z) }],
      { duration: dur, easing: 'cubic-bezier(.35,0,.25,1)', fill: 'forwards' });
    if (mine) { dirAnim = a; Object.assign(dirDest, { x, y, z }); }
    try { await a.finished; } catch (e) { return; } finally { if (!mine) taleMoving--; } // 연출 이동이 취소됨: 상태는 취소한 쪽이 맞췄다
    if (mine && dirAnim !== a) return;
    if (mine) dirAnim = null;
    try { a.commitStyles(); } catch (e) { /* 미표시 */ }
    a.cancel();
    Object.assign(camState, { x, y, z });
  }
  function camSnap(x, y, z = 1) {
    if (!directing) { camEpoch++; if (dirAnim) { dirAnim.cancel(); dirAnim = null; } }
    [x, y] = clampCam(x, y, z);
    if (!directing) Object.assign(camTarget, { x, y, z });
    $('#frame').classList.toggle('out', z > 1.05);
    cam.style.transform = camT(x, y, z);
    Object.assign(camState, { x, y, z });
  }
  const camWide = (dur = 700) => camTo(500, 280, 1, dur);

  /* ---------- 대사 ---------- */
  async function say(text) {
    const was = busy; busy = true;
    const d = dir && dir.begin();
    try { await Narrator.speak(text, d ? { onSeg: d.seg } : {}); }
    finally { if (d) d.end(); busy = was; }
  }

  /* ---------- 대사 연출: 목소리를 따라가는 카메라 + 서로 바라보기 ----------
     T.director({ cast: {배역: actor | () => actor}, listener: (배역, 직전 화자) => 청자 배역, camTo, noFace: [배역] })
     - 배역 대사가 나오면: 화자와 청자가 서로 마주 보고, 카메라가 두 사람(멀면 화자)을 잡는다
     - 내레이터 대사가 나오거나 대사가 끝나면: 동화가 잡아 둔 원래 화면으로 돌아간다
     - 동화가 그 사이 카메라를 직접 움직이면 연출은 그 대사에서 손을 뗀다 */
  let dir = null;
  function director(cfg) {
    if (!cfg) { dir = null; return; }
    const moveCam = cfg.camTo || camTo;
    let lastSpeaker = null;
    const get = r => { const a = cfg.cast[r]; return typeof a === 'function' ? a() : a; };
    const visible = a => {
      if (!a || !a.pos || !a.pos.isConnected) return false;
      for (let n = a.pos; n && n !== world; n = n.parentNode) {
        const cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .05) return false;
      }
      return a.x > -40 && a.x < 1040;
    };
    /* 배우의 무대 좌표 상자 (발끝 기준 그림 크기) */
    const box = a => {
      let b; try { b = a.body.getBBox(); } catch (e) { b = null; }
      if (!b || !b.height) b = { x: -60, y: -200, width: 120, height: 200 };
      const s = a.scale || 1, w = b.width * s, h = b.height * s;
      const cx = a.x + (a.flip || 1) * s * (b.x + b.width / 2);
      return { cx, top: a.y + s * b.y, h, w };
    };
    const faceEach = (sp, li) => {
      const out = [];
      const turn = (a, other, r) => {
        if (!a.face || (cfg.noFace || []).includes(r) || Math.abs(other.x - a.x) < 20) return;
        const before = a.flip;
        a.face(other.x > a.x ? 'right' : 'left');
        if (a.flip !== before) out.push({ a, before, set: a.flip, x: a.x });
      };
      turn(sp.a, li.a, sp.r); turn(li.a, sp.a, li.r);
      return out;
    };
    return (dir = {
      begin() {
        const base = { ...camTarget }, epoch = camEpoch, turned = [];
        let moved = false, alive = true;
        const ours = () => alive && camEpoch === epoch && $('#cutPanel').hidden && $('#iris').hidden;
        const go = (x, y, z) => {
          if (!ours() || taleMoving) return; // 동화가 카메라를 옮기는 중이면 끼어들지 않는다
          // 가로 화면은 무대 전체가 다 보이므로 말할 때마다 카메라가 움직이면 정신없다 → 세로 화면에서만 (cfg.landscapeCam 로 켤 수 있음)
          if (viewWidth() >= 990 && !cfg.landscapeCam) return;
          const cur = dirAnim ? dirDest : camState; // 돌아가는 중이면 가는 곳과 비교
          if (Math.abs(x - cur.x) * z < 30 && Math.abs(y - cur.y) * z < 30 && Math.abs(z - cur.z) < .1) return;
          moved = true; directing = true;
          try { moveCam(x, y, z, 650); } finally { directing = false; }
        };
        return {
          seg(role) {
            if (!ours()) return;
            if (role === 'nar' || !cfg.cast[role]) { if (moved) go(base.x, base.y, base.z); return; }
            const a = get(role);
            if (!visible(a)) return;
            const lr = cfg.listener ? cfg.listener(role, lastSpeaker) : (lastSpeaker !== role ? lastSpeaker : null);
            let la = lr && lr !== role && cfg.cast[lr] ? get(lr) : null;
            if (!visible(la)) la = null;
            lastSpeaker = role;
            if (la) {
              for (const t of faceEach({ a, r: role }, { a: la, r: lr }))
                if (!turned.some(o => o.a === t.a)) turned.push(t);
            }
            const vw = viewWidth(), A = box(a);
            let shot = null;
            if (la) {
              const B = box(la);
              const span = Math.abs(A.cx - B.cx) + (A.w + B.w) / 2 + 90;
              const vspan = Math.max(A.top + A.h, B.top + B.h) - Math.min(A.top, B.top); // 높이 차이(들보 위 닭 등)도 담는다
              const z = Math.min(1.55, vw / span, 560 * .78 / Math.max(A.h, B.h), 560 * .86 / vspan);
              if (z >= 1.12) shot = [(A.cx + B.cx) / 2, (Math.min(A.top, B.top) + Math.max(A.top + A.h, B.top + B.h)) / 2, z];
            }
            if (!shot) {
              const z = Math.max(1.25, Math.min(1.7, 560 * .6 / A.h));
              const bias = la ? Math.sign(la.x - a.x) * vw / z * .12 : 0; // 청자 쪽에 여백
              shot = [A.cx + bias, A.top + A.h * .5, z];
            }
            go(...shot);
          },
          end() {
            if (moved && ours()) go(base.x, base.y, base.z);
            alive = false;
            // 동화가 그 사이 돌려세우거나 옮기지 않았다면 원래 방향으로
            turned.forEach(t => { if (t.a.flip === t.set && t.a.x === t.x) { t.a.flip = t.before; t.a.place(t.a.x, t.a.y); } });
          },
        };
      },
    });
  }

  /* ---------- 손가락 안내 ---------- */
  const HAND_SVG = '<svg viewBox="0 0 64 64"><path d="M22 30 V10 a5 5 0 0 1 10 0 V28 M32 26 a5 5 0 0 1 10 0 V30 M42 28 a5 5 0 0 1 10 0 V40 C52 52 44 60 34 60 C24 60 18 54 14 46 L8 36 a5 5 0 0 1 8 -5 L22 38 Z" fill="#FFFFFF" stroke="#222B45" stroke-width="3" stroke-linejoin="round"/></svg>';
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
    const arm = (keepAuto = false) => {
      clearTimeout(t1); clearTimeout(t2); hideHand();
      if (!keepAuto) clearTimeout(t3);
      if (dead) return;
      t1 = setTimeout(() => !dead && showHand(target, kind), 5000);
      if (prompt) t2 = setTimeout(() => !dead && Narrator.speak(prompt), 12000);
      if (auto && !keepAuto) t3 = setTimeout(() => !dead && auto(), 20000);
    };
    arm();
    return { poke: keepAuto => arm(keepAuto), stop() { dead = true; clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); hideHand(); } };
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
            options.forEach(x => { x.el.removeEventListener('pointerdown', x._on); arm(x.el, false); x.el.style.filter = ''; x.el.style.opacity = ''; });
            AudioFX.ding(); res(o); return;
          }
          misses++;
          AudioFX.miss();
          if (o.onWrong) await o.onWrong(); else await wiggleEl(o.el);
          if (misses === 1 && where) await say(where);
          if (misses >= 2) {
            good.el.style.filter = 'url(#hintGlow)';
            options.forEach(x => { if (!x.ok) { x.el.style.transition = 'opacity .4s'; x.el.style.opacity = '.35'; } });
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

  /* ---------- 조작 4: 쓱 (화면 어디서든 그 방향으로 밀면 한 걸음, 길게 밀면 여러 걸음, 톡도 한 걸음으로 인정) ---------- */
  function swipe(area, { dir = 'up', count = 3, onStep, prompt } = {}) {
    return new Promise(res => {
      let i = 0, done = false, down = false, moved = false, sx = 0, sy = 0, lastT = 0;
      const wrap = $('#stageWrap') || area;
      arm(area, true);
      const h = helper({ target: area, kind: dir === 'up' ? 'swipe-up' : 'swipe-right', prompt,
        auto: async () => { while (!done) { step(); await sleep(700); } } });
      const finish = () => {
        if (done) return; done = true;
        wrap.removeEventListener('pointerdown', begin, true);
        ['pointermove'].forEach(ev => window.removeEventListener(ev, move));
        ['pointerup', 'pointercancel'].forEach(ev => window.removeEventListener(ev, end));
        arm(area, false); h.stop(); res();
      };
      const step = () => { i++; onStep && onStep(i); if (i >= count) finish(); };
      const along = (dx, dy) => (dir === 'up' ? -dy : dir === 'left' ? -dx : dir === 'down' ? dy : Math.abs(dx) > Math.abs(dy) * .5 ? Math.abs(dx) : 0);
      const begin = e => { if (busy || done) return; down = true; moved = false; sx = e.clientX; sy = e.clientY; };
      const move = e => {
        if (!down || busy || done) return;
        if (along(e.clientX - sx, e.clientY - sy) > 36 && performance.now() - lastT > 280) {
          moved = true; lastT = performance.now(); sx = e.clientX; sy = e.clientY; h.poke(); step();
        }
      };
      const end = e => {
        if (!down) return; down = false;
        if (busy || done || moved) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.hypot(dx, dy) < 14 || along(dx, dy) > 16) { h.poke(); step(); }
      };
      wrap.addEventListener('pointerdown', begin, true);
      window.addEventListener('pointermove', move);
      ['pointerup', 'pointercancel'].forEach(ev => window.addEventListener(ev, end));
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
      const down = e => {
        e.stopPropagation(); if (busy || done) return; h.poke(true);
        p = Math.min(1, p + .2); onProgress && onProgress(p); // 톡톡 치는 아이도 앞으로 간다
        if (p >= 1) return finish();
        if (!timer) tick();
      };
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

  /* ---------- 무대 장치: 종이 조리개 ----------
     한 장의 종이(홈과 같은 색)가 동그랗게 오므라들며 무대를 덮고, 다시 벌어지며 연다.
     구멍(.lid)의 번짐 그림자가 종이가 되고, 구멍 안쪽 가장자리에 오린 종이의 그늘이 진다. */
  function lidTo(box, cx, cy, r0, r1, ms, ease) {
    const lid = box.querySelector('.lid');
    return new Promise(res => {
      const t0 = performance.now();
      const f = now => {
        const k = Math.min(1, (now - t0) / ms), r = Math.max(0, r0 + (r1 - r0) * ease(k));
        lid.style.left = cx + 'px'; lid.style.top = cy + 'px';
        lid.style.width = lid.style.height = (r < .5 ? 0 : 2 * r).toFixed(1) + 'px';
        box.classList.toggle('shut', r < 1); // 완전히 닫히면 종이 한 장
        k < 1 ? requestAnimationFrame(f) : res();
      };
      requestAnimationFrame(f);
    });
  }
  const easeIn = k => k * k * k;
  const easeInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const easeOutBack = k => 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2);
  const farFrom = (W, H, x, y) => Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 24;
  /* 막 열기/닫기 (예전 커튼과 같은 이름·시간: 약 1.25초) */
  let veilOpen = false;
  function shutVeil() { const v = $('#veil'); veilOpen = false; root.classList.remove('open'); v.hidden = false; v.classList.add('shut'); v.querySelector('.lid').style.width = v.querySelector('.lid').style.height = '0px'; }
  async function curtain(open) {
    root.classList.toggle('open', open);
    if (open === veilOpen) return sleep(120);
    veilOpen = open;
    paperTurn(); // 화면 전환: 책장 넘기는 종이 소리 (없으면 합성음)
    const v = $('#veil'), w = $('#stageWrap'), W = w.clientWidth, H = w.clientHeight, far = farFrom(W, H, W / 2, H / 2);
    v.hidden = false;
    const t0 = performance.now();
    if (open) { await lidTo(v, W / 2, H / 2, 0, far, 1100, easeInOut); v.hidden = true; }
    else await lidTo(v, W / 2, H / 2, far, 0, 1000, easeInOut);
    await sleep(Math.max(0, 1250 - (performance.now() - t0)));
  }
  /* 동그라미 장면 전환 (옛날 만화식 아이리스). focus: 동그라미가 모일 요소(주인공). 없으면 가운데
     닫힘 → 주인공 둘레에서 잠깐 멈춤 → 완전히 닫힘 → 장면 이름(오린 종이 글자) → change() → 톡 튀며 열림 */
  async function sceneCard(label, change, focus) {
    const wrap = $('#stageWrap'), ir = $('#iris'), card = $('#irisCard');
    const W = wrap.clientWidth, H = wrap.clientHeight;
    let cx = W / 2, cy = H / 2;
    if (focus && focus.getBoundingClientRect) {
      const r = focus.getBoundingClientRect(), sr = wrap.getBoundingClientRect();
      if (r.width) { cx = r.left - sr.left + r.width / 2; cy = r.top - sr.top + r.height / 2; }
    }
    const hole = Math.min(W, H) * .16;
    ir.hidden = false; card.textContent = ''; card.className = 'paperword';
    paperTurn(); // 화면 전환: 책장 넘기는 종이 소리 (없으면 합성음)
    await lidTo(ir, cx, cy, farFrom(W, H, cx, cy), hole, 520, easeIn);
    await sleep(260); // 주인공 둘레에 동그라미를 잠깐 남긴다
    await lidTo(ir, cx, cy, hole, 0, 180, easeIn);
    if (label) { card.innerHTML = letters(label); card.className = 'paperword on'; tone([520, 780], .18, { type: 'triangle', vol: .12 }); }
    if (change) change();
    await sleep(label ? 1050 : 250);
    card.className = 'paperword';
    paperTurn(); // 화면 전환: 책장 넘기는 종이 소리 (없으면 합성음)
    await lidTo(ir, W / 2, H / 2, 0, farFrom(W, H, W / 2, H / 2), 640, easeOutBack);
    ir.hidden = true;
  }
  /* 오린 종이 글자: 글자마다 살짝 기울고 들쭉날쭉 (같은 글은 늘 같은 모양). 낱말은 한 줄에서 끊기지 않는다 */
  function letters(text) {
    const esc = c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] || c);
    let k = 0, n = 0;
    return String(text).split(/(\s+)/).map(w => {
      if (!w) return '';
      if (/^\s+$/.test(w)) return ' ';
      return '<span style="display:inline-block;white-space:nowrap">' + [...w].map(ch => {
        n++;
        const r = ((n * 37) % 7 - 3) * .7, y = ((n * 53) % 5 - 2) * .014;
        return `<i style="--r:${r.toFixed(1)}deg;--y:${y.toFixed(3)}em;--k:${k++}">${esc(ch)}</i>`;
      }).join('') + '</span>';
    }).join('');
  }
  /* 컷 효과음: 함수면 그대로, 스팅 이름('hit'·'bigHit'·'slip'·'bite'·'splash'·'laugh'·'magic'·'win'·'surprise' 등)이면
     AudioFX.sting으로 여러 소리를 겹쳐 울리고, 아니면 예전처럼 AudioFX[이름]() */
  function playSfx(sfx) {
    if (!sfx) return;
    if (typeof sfx === 'function') return sfx();
    if (AudioFX.hasSting && AudioFX.hasSting(sfx)) return AudioFX.sting(sfx);
    if (AudioFX[sfx]) AudioFX[sfx]();
  }
  /* 만화 컷: draw(svg 0..400 x 0..300)로 코드가 그린다 (그림 컷은 cutImage). 탭하면 빨리 넘어간다 */
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
    playSfx(sfx);
    shake();
    await new Promise(res => { const t = setTimeout(res, ms); p.onpointerdown = () => { clearTimeout(t); setTimeout(res, 200); }; });
    p.hidden = true; p.innerHTML = '';
  }
  /* 그림 컷 (이미지 파일): list = ['url' | {src, sfx, hold}] — 파일이 없으면 조용히 건너뛴다.
     화면 전체 위에 뜨고, 탭하면 빨리 넘어간다. (그림 컷을 쓰는 동화용 — 선택 기능) */
  const imgCache = {};
  function preload(src) {
    if (!(src in imgCache)) {
      const i = new Image();
      imgCache[src] = new Promise(res => { i.onload = () => res(true); i.onerror = () => res(false); });
      imgCache[src].img = i; // 참조 유지 (GC 방지)
      i.src = src;
    }
    return imgCache[src];
  }
  async function cutImage(list, { hold: ms = 4000, onShow } = {}) {
    const p = $('#cutPanel');
    for (const it of [].concat(list)) {
      const o = typeof it === 'string' ? { src: it } : it;
      if (!(await preload(o.src))) continue;
      p.innerHTML = '<div class="cut img"></div>';
      const img = document.createElement('img');
      img.src = o.src; img.alt = '';
      p.firstChild.appendChild(img);
      p.hidden = false;
      playSfx(o.sfx);
      if (onShow) onShow(o);
      shake();
      await new Promise(res => {
        const t = setTimeout(res, o.hold || ms);
        p.onpointerdown = e => { e.stopPropagation(); p.onpointerdown = null; AudioFX.tap(); clearTimeout(t); setTimeout(res, 200); };
      });
      p.onpointerdown = null;
      p.firstChild.classList.add('out');
      await sleep(280);
    }
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
  /* 텍스트 효과 (의성어) — 탄력: 별이 스프링처럼 튀고, 글자가 한 자씩 떨어지며 출렁이다 자리 잡는다 */
  const SPRING = [0, 1.35, .86, 1.07, .97, 1]; // 넘쳤다 되돌아오는 스프링 곡선 (키프레임 값)
  function springFrames(fn) { return SPRING.map((v, i) => ({ transform: fn(v, i), offset: i / (SPRING.length - 1) })); }
  function pop(x, y, word, color = '#A93B32') {
    // 카메라가 가까이 붙을수록 화면에서 커지므로 확대 배율만큼 줄여 늘 비슷한 크기로 보이게
    const g = el('g', { transform: `translate(${x},${y}) scale(${(1 / Math.max(1, camState.z)).toFixed(3)})` }, fxL);
    const chars = [...word], size = chars.length > 3 ? 48 : 56;
    const cw = ch => /[!?~.…,]/.test(ch) ? size * .42 : size * .86; // 문장부호는 좁게
    const total = chars.reduce((a, ch) => a + cw(ch), 0);
    const burst = el('path', { d: 'M60 0 L36 10 L52 30 L26 26 L30 52 L10 36 L0 60 L-10 36 L-30 52 L-26 26 L-52 30 L-36 10 L-60 0 L-36 -10 L-52 -30 L-26 -26 L-30 -52 L-10 -36 L0 -60 L10 -36 L30 -52 L26 -26 L52 -30 L36 -10 Z',
      fill: '#F2B366', stroke: '#E8703A', 'stroke-width': 4, transform: `scale(${Math.max(1.4, total / 70)},${1.4})` }, g);
    const bw = el('g', {}, g); bw.appendChild(burst);
    bw.style.transformBox = 'view-box'; bw.style.transformOrigin = '0 0';
    bw.animate(springFrames(v => `scale(${v}) rotate(${(1 - v) * 40}deg)`), { duration: 620, easing: 'ease-out', fill: 'both' });
    let cursor = -total / 2;
    chars.forEach((ch, i) => {
      const px = cursor + cw(ch) / 2; cursor += cw(ch);
      const t = el('text', { 'text-anchor': 'middle', 'font-size': size, fill: color, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", stroke: '#fff', 'stroke-width': 8, 'paint-order': 'stroke', text: ch }, g);
      t.style.transformBox = 'view-box'; t.style.transformOrigin = '0 0';
      const rot = (i % 2 ? 1 : -1) * 9;
      t.animate(springFrames((v, k) => `translate(${px}px, ${size * .36 - (k === 0 ? 56 : 0)}px) scale(${Math.max(v, .01)}) rotate(${k < 3 ? rot : 0}deg)`),
        { duration: 700, delay: 70 * i, easing: 'ease-out', fill: 'both' });
    });
    g.animate([{ opacity: 1 }, { opacity: 1, offset: .8 }, { opacity: 0 }], { duration: 1400 + chars.length * 70 }).finished.then(() => g.remove());
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

  /* ---------- 조사: 받침을 보고 고른다 (양+이랑 → 양이랑, 소+랑 → 소랑) ---------- */
  function josa(word, pair) {
    const [withB, noB] = pair.split('/');
    const w = String(word).replace(/[^가-힣a-zA-Z0-9]+$/, '');
    const c = w.charCodeAt(w.length - 1);
    if (c >= 0xAC00 && c <= 0xD7A3) {
      const jong = (c - 0xAC00) % 28;
      if (withB === '으로') return word + (jong === 0 || jong === 8 ? '로' : '으로'); // ㄹ받침은 '로'
      return word + (jong ? withB : noB);
    }
    return word + noB;
  }

  /* ---------- 장면 비우기 ---------- */
  function clear() { bgL.innerHTML = ''; world.innerHTML = ''; fxL.innerHTML = ''; }

  /* ---------- 틀 만들기 ---------- */
  /* 저장소 뿌리(홈·썸네일 경로): 이 엔진 파일(engine/tale.js)의 한 단계 위 */
  const ROOT_URL = (() => { try { return new URL('../', document.currentScript.src).href; } catch (e) { return '../../'; } })();
  /* 동화 id = 폴더 이름 (tales/<id>/index.html) */
  const taleId = () => { const m = location.pathname.match(/\/tales\/([^/]+)\//); return m ? decodeURIComponent(m[1]) : ''; };
  const PLAY_SVG = '<svg class="play" viewBox="0 0 10 11" aria-hidden="true"><path d="M1.2 1.1 Q1.2 .2 2 .6 L9.2 4.8 Q9.9 5.5 9.2 6.2 L2 10.4 Q1.2 10.8 1.2 9.9Z"/></svg>';
  /* 시작·끝 화면의 구멍 그림: 밝은 종이 = <id>_light.webp(THUMBS2L), 어두운 종이 = <id>.webp(THUMBS2). 없으면 빈 구멍 */
  function heroes() {
    const id = taleId(), dark = { matches: false, addEventListener() {} }; // 다크 모드 없음: 늘 밝은 종이
    const set = () => {
      const has = window.THUMBS2L || [];
      const src = has.includes(id) ? `${ROOT_URL}assets/thumbs/${id}_light.webp` : '';
      document.querySelectorAll('.hero').forEach(h => {
        const img = h.querySelector('img');
        h.classList.toggle('plain', !src);
        if (src && img.getAttribute('src') !== src) img.src = src;
        if (!src) img.removeAttribute('src');
      });
      return src;
    };
    dark.addEventListener ? dark.addEventListener('change', set) : dark.addListener(set);
    return new Promise(res => {
      if (!id) return res();
      const sc = document.createElement('script');
      sc.src = ROOT_URL + 'assets/thumbs/thumbs.js';
      sc.onload = sc.onerror = () => {
        const src = set();
        if (!src) return res();
        const img = document.querySelector('#startScreen .hero img');
        if (img.complete) return res();
        img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true });
      };
      document.head.appendChild(sc);
    });
  }
  /* 들어올 때: 홈의 카드가 닫고 간 종이 조리개가 가운데에서 다시 열린다 */
  function arrive(ready) {
    const a = document.createElement('div');
    a.id = 'arrive'; a.innerHTML = '<i class="lid"></i>';
    document.body.appendChild(a);
    const gone = () => a.remove();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { gone(); return; }
    const fallback = setTimeout(gone, 2500);
    Promise.race([ready, sleep(450)]).then(() => {
      const lid = a.firstChild, R = Math.hypot(innerWidth, innerHeight) / 2 + 30, t0 = performance.now(), ms = 620;
      const f = now => {
        const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
        lid.style.width = lid.style.height = (2 * R * e).toFixed(1) + 'px';
        if (k < 1) requestAnimationFrame(f); else { clearTimeout(fallback); gone(); }
      };
      requestAnimationFrame(f);
    });
  }
  /* 무대 구멍(#frame)을 무대(1000x560)가 화면에 놓인 자리에 맞춘다: 가로 = 전체 맞춤(meet), 세로 = 꽉 채움(slice) */
  function fitFrame(portrait) {
    const w = $('#stageWrap'), f = $('#frame'), W = w.clientWidth, H = w.clientHeight;
    if (!W || !H) return;
    const k = portrait ? Math.max(W / 1000, H / 560) : Math.min(W / 1000, H / 560), fw = 1000 * k, fh = 560 * k;
    const mx = (W - fw) / 2, my = (H - fh) / 2;
    Object.assign(f.style, { left: mx + 'px', top: my + 'px', width: fw + 'px', height: fh + 'px' });
    f.classList.toggle('edge', Math.min(mx, my) < 6); // 화면 가장자리에 닿으면 모서리는 네모
  }

  function mount({ title, subtitle, run, note = false, endTitle = '끝!' }) {
    document.title = title;
    const home = ROOT_URL + 'index.html';
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
    <div id="frame"></div><div id="apron"></div>
    <div id="iris" hidden><i class="lid"></i><span id="irisCard"></span></div>
    <div id="veil" class="shut"><i class="lid"></i></div>
    <div id="confetti"></div>
    <div id="hand" hidden>${HAND_SVG}</div>
  </div>
  <div id="rotateHint"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="9" y="3" width="14" height="26" rx="3" fill="none" stroke="#C98A5B" stroke-width="2.6"/><circle cx="16" cy="25" r="1.6" fill="#C98A5B"/></svg>돌려서 크게 보기</div>
  <div id="bubble" hidden><p id="bubbleText"></p></div>
  <div id="cutPanel" hidden></div>
  <div id="startScreen" class="screen">
    <div class="hero plain"><img alt="" decoding="async"></div>
    <div class="words">
      <h1 class="paperword ttl">${letters(title)}</h1>
      ${subtitle ? `<p class="sub">${subtitle}</p>` : ''}
      <div class="pills"><button class="pill go" id="startBtn">${PLAY_SVG}이야기 시작</button><a class="pill" href="${home}">처음으로</a></div>
      ${note ? `<p class="note">${note}</p>` : ''}
    </div>
  </div>
  <div id="endScreen" class="screen" hidden>
    <div class="hero plain"><img alt="" decoding="async"></div>
    <div class="words">
      <h2 class="paperword ttl">${letters(endTitle)}</h2>
      <p class="sub" id="endMsg"></p>
      <div class="pills"><button class="pill go" id="againBtn">${PLAY_SVG}다시 보기</button><a class="pill" href="${home}">처음으로</a></div>
    </div>
  </div>
</div>`);
    root = $('#tale'); stage = $('#stage');
    arrive(heroes());
    // 세로 화면: 무대를 크게 키워 양옆을 자른다(slice), 가로: 전체를 맞춘다(meet)
    const portraitMQ = window.matchMedia('(orientation: portrait)');
    const fitStage = () => { stage.setAttribute('preserveAspectRatio', portraitMQ.matches ? 'xMidYMid slice' : 'xMidYMid meet'); fitFrame(portraitMQ.matches); };
    fitStage(); portraitMQ.addEventListener ? portraitMQ.addEventListener('change', fitStage) : portraitMQ.addListener(fitStage);
    if (window.ResizeObserver) new ResizeObserver(() => fitFrame(portraitMQ.matches)).observe($('#stageWrap'));
    else addEventListener('resize', () => fitFrame(portraitMQ.matches));
    const hint = $('#rotateHint');
    if (hint) { hint.onpointerdown = e => { e.stopPropagation(); hint.classList.add('gone'); }; setTimeout(() => hint.classList.add('gone'), 6000); } cam = $('#cam'); bgL = $('#bgL'); world = $('#world'); fxL = $('#fxL'); handEl = $('#hand');
    // 대사 건너뛰기: 무대 1초 꾹 (보호자용). 짧은 탭은 무시한다
    let ht = null;
    $('#stageWrap').addEventListener('pointerdown', () => { clearTimeout(ht); ht = setTimeout(() => Narrator.stop(), 1000); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => $('#stageWrap').addEventListener(ev, () => clearTimeout(ht)));
    // 잠긴 동안 누르면 톡 소리만
    $('#stageWrap').addEventListener('pointerdown', () => { if (busy) AudioFX.tap(); });
    const start = async () => {
      AudioFX.unlock();
      AudioFX.prefetchClips && AudioFX.prefetchClips(); // 이 동화의 녹음을 미리 받아 둔다 (대사가 늦게 나오지 않게)
      $('#startScreen').hidden = true; $('#endScreen').hidden = true;
      clear(); camSnap(500, 280, 1); shutVeil();
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
    el, paper, anim, actor, sleep, say, director, tone, josa, camTo, camSnap, camWide, curtain, sceneCard, cut, cutImage, preload, shake, confetti, pop, clear,
    get camera() { return { ...camState }; },
    viewWidth,
    tap: input(tap), mash: input(mash), choose: input(choose), swipe: input(swipe), hold: input(hold), free: input(free),
    get bg() { return bgL; }, get world() { return world; }, get fx() { return fxL; }, get root() { return root; },
  };
  return { mount, api };
})();
