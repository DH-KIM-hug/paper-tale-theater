/* 톡톡 동화극장 공용 엔진 — 새 동화(tales/*)가 함께 쓴다.
   의존: ../../audio.js (AudioFX, Narrator — #bubble/#bubbleText를 쓴다)
   규칙(TALES_PLAN §0):
   - 조작 5가지: tap(톡) · mash(톡톡톡) · choose(골라요) · swipe(쓱) · hold(꾹)
   - 막힘 방지: 5초 무입력 → 손가락 안내, 12초 → 다시 말해 줌, 20초 → 연타·쓸기·꾹은 자동 마무리
   - 게임오버 없음. 골라요는 틀릴수록 더 도와준다 (1회: 장소 힌트, 2회~: 정답이 들썩이며 이름을 알려줌)
   - 대사 중에는 조작이 잠기고, 무대를 1초 꾹 누르면 대사를 건너뛴다 (보호자용) */
const Tale = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const $ = s => document.querySelector(s);
  let vFast = () => false;   /* 검증 모드에서 건너뛰는 중이면 기다림을 아주 짧게 */
  let vRush = false; const vSleeps = new Set();   /* 검증 모드: 움직이는 중에 '다음'을 누르면 남은 기다림을 바로 끝낸다 */
  const sleep = ms => new Promise(r => {
    if (vFast() || vRush) { setTimeout(r, Math.min(ms, 15)); return; }
    const done = () => { vSleeps.delete(done); clearTimeout(t); r(); }, t = setTimeout(done, ms);
    vSleeps.add(done);
  });
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
    if (/meet/.test(stage.getAttribute('preserveAspectRatio') || '')) return 1000; // 가로(meet)는 늘 무대 전체 폭이 보인다
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
  async function say(text, options = {}) {
    const was = busy; busy = true;
    const d = dir && dir.begin();
    try {
      if (VERIFY) await vSay(text, d);
      else await Narrator.speak(text, { ...options, ...(d ? { onSeg: d.seg } : {}) });
    }
    finally { if (d) d.end(); busy = was; }
  }

  /* ---------- 안내 대사 + 조작 함께 (2026-10-22) ----------
     T.ask(안내, () => T.tap(...)) — 대상을 먼저 '눌릴 수 있는 상태'로 연 뒤 안내 대사를 흘린다.
     say 뒤에 tap 을 부르면 대사 동안(busy)과 대사 뒤 쉼 동안 누름이 버려진다(아이는 '톡 눌러 봐요'를 듣는 순간 누른다).
     안내 도중 누르면 안내는 거기서 멈추고 바로 다음으로 간다. 자동 재생·검증 모드는 예전처럼 대사 → 조작 순서.
     연출(director)은 쓰지 않는다: 세로 화면에서 말하는 배역 쪽으로 카메라가 가면 누르려던 대상이 화면에서 미끄러진다 */
  async function ask(text, start) {
    if (VERIFY || AUTO()) { await say(text); return start(); }
    const r = start();                       // input() 이 busy=false 로 연다 — say 를 쓰면 busy 가 다시 잠긴다
    let spoken = false;
    Narrator.speak(text).catch(() => { /* 소리 실패는 무시 */ }).finally(() => { spoken = true; });
    const v = await r;
    if (!spoken) Narrator.stop();
    return v;
  }

  /* ---------- 개발자 검증 모드 (?verify=1, tools/dev/verify.html 의 iframe 에서만) ----------
     행동 단위(대사 한 줄, 톡 기다림)마다 부모에게 step 을 알리고 부모의 go 를 기다린다.
     ?skip=N 이면 앞의 N 단계는 소리 없이 곧바로 지나간다(이전 버튼용). 평소 게임에는 영향이 없다. */
  const VERIFY = (() => { try { return window.parent !== window && new URLSearchParams(location.search).get('verify') === '1'; } catch (e) { return false; } })();
  const vSkip = (() => { try { return +new URLSearchParams(location.search).get('skip') || 0; } catch (e) { return 0; } })();
  let vN = 0, vWait = null, vLine = '';
  /* ?skipto=대사 이면 그 대사가 나올 때까지 소리 없이 건너뛴다(목록에서 줄을 눌러 바로 가기) */
  const vSkipText = (() => { try { return new URLSearchParams(location.search).get('skipto') || ''; } catch (e) { return ''; } })();
  let vReached = !vSkipText;
  if (VERIFY && (vSkip > 0 || vSkipText)) {
    vFast = () => vN < vSkip || !vReached;
    /* 건너뛰는 동안 끝이 있는 애니메이션은 바로 끝내서 빨리 지나간다 */
    const iv = setInterval(() => {
      if (!vFast()) { clearInterval(iv); return; }
      try { document.getAnimations().forEach(a => { const t = a.effect && a.effect.getComputedTiming(); if (t && isFinite(t.endTime) && a.playState === 'running') a.finish(); }); } catch (e) { /* 무시 */ }
    }, 60);
  }
  const vPost = m => { if (!m.skipped) vRush = false; try { window.parent.postMessage(Object.assign({ type: 'step' }, m), '*'); } catch (e) { /* 부모 없음 */ } };
  const vGo = () => new Promise(r => { vWait = r; });
  if (VERIFY) window.addEventListener('message', e => {
    const m = e.data || {};
    if (m.type === 'go') {
      if (vWait) { const r = vWait; vWait = null; r(); }
      else {   /* 움직이는 중에 다음을 누르면: 다음 단계가 올 때까지 기다림(sleep)은 바로 끝내고, 끝이 있는 애니메이션도 바로 끝낸다(무한 반복은 그대로) */
        vRush = true; [...vSleeps].forEach(d => d());
        const fin = () => { try { document.getAnimations().forEach(a => { const t = a.effect && a.effect.getComputedTiming(); if (t && isFinite(t.endTime) && a.playState === 'running') a.finish(); }); } catch (er) { /* 무시 */ } };
        fin(); const iv = setInterval(() => { if (!vRush) { clearInterval(iv); return; } fin(); }, 60);
      }
    }
    if (m.type === 'replay' && vLine) { try { Narrator.speak(vLine); } catch (er) { /* 무시 */ } }
  });
  const vClipFile = text => {
    try {
      const en = typeof englishOn === 'function' && englishOn() && NARRATION_CLIPS_EN[text];
      const c = en ? en.c : (typeof NARRATION_CLIPS !== 'undefined' && NARRATION_CLIPS[text]);
      return c ? [].concat(c).join(' + ') : '';
    } catch (e) { return ''; }
  };
  async function vSay(text, d) {
    const n = vN++;
    if (!vReached && text === vSkipText) vReached = true;
    const skip = n < vSkip || !vReached;
    vPost({ kind: 'say', n, text, file: vClipFile(text), skipped: skip });
    if (skip) return;
    vLine = text;
    const go = vGo();
    Narrator.speak(text, d ? { onSeg: d.seg } : {}).catch(() => { /* 소리 실패는 무시 */ });
    await go;
    Narrator.stop();
  }
  /* 조작 대기 단계: 부모의 go 가 실제 조작을 대신 한다 */
  function vInput(name, a, p, drive) {
    const n = vN++;
    const skip = n < vSkip || !vReached;
    vPost({ kind: name, n, text: '', file: '', skipped: skip });
    const go = skip ? Promise.resolve() : vGo();
    go.then(() => { if (!p.done) drive(a, p).catch(e => console.warn('vDrive', e)); });
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

  /* ---------- 자동 재생 (보호자 메뉴 'auto_play'=1): 톡·퀴즈 없이 이야기만 흘러간다 ----------
     조작 함수(tap/mash/choose/swipe/hold/free)는 그대로 불리고, 엔진이 알맞은 때 대신 눌러 준다. */
  const AUTO = () => { if (VERIFY) return false; try { return localStorage.getItem('auto_play') === '1' || sessionStorage.getItem('auto_once') === '1'; } catch (e) { return false; } };
  /* 시작 화면 '자동 재생' 버튼: 이번 회차만 자동 재생 (sessionStorage 'auto_once'). 동화를 떠나면 지운다 */
  try { addEventListener('pagehide', () => { try { sessionStorage.removeItem('auto_once'); } catch (e) { /* 무시 */ } }); } catch (e) { /* 무시 */ }
  function firePtr(n, type = 'pointerdown', host = n) {
    const r = n.getBoundingClientRect ? n.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 };
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    host.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true }));
  }
  /* 동화 쪽 맞춤 입력용: 자동 재생일 때만 ms 뒤에 fn 을 부른다 */
  function autoDo(ms, fn) { if (AUTO()) setTimeout(() => { try { fn(); } catch (e) { console.warn('autoDo', e); } }, ms); }
  const nap = ms => sleep(VERIFY ? Math.min(ms, 250) : ms);
  const autoDrive = {
    tap: async (a, p) => { await nap(1600); if (!p.done && a[0]) firePtr(a[0]); },
    mash: async (a, p) => { await nap(1000); while (!p.done && a[0]) { firePtr(a[0]); await nap(520); } },
    hold: async (a, p) => { await nap(1400); if (!p.done && a[0]) firePtr(a[0]); },
    swipe: async (a, p) => { const w = $('#stageWrap') || a[0]; await nap(1200); while (!p.done) { firePtr(w); firePtr(w, 'pointerup', window); await nap(700); } },
    choose: async (a, p) => {
      const good = (a[0] || []).find(o => o.ok); if (!good) return;
      await nap(500); if (p.done) return;
      good.el.style.filter = 'url(#hintGlow)'; pulse(good.el);
      await nap(1200); if (!p.done) firePtr(good.el);
    },
    fill: async (a, p) => {
      const items = a[0] || [], o = a[1] || {}; await nap(900); if (p.done) return;
      let plan = o.auto ? o.auto(items, o) : null;
      if (!plan || !plan.length) {   // 무작위 1~2종류, 종류마다 1~2개
        const keys = [...new Set(items.map(i => i.key))], pick = keys.sort(() => Math.random() - .5).slice(0, Math.min(o.maxKinds || 2, 1 + Math.floor(Math.random() * 2)));
        plan = pick.flatMap(k => { const c = items.filter(i => i.key === k); return c.sort(() => Math.random() - .5).slice(0, 1 + Math.floor(Math.random() * 2)); });
      }
      for (const it of plan) { if (p.done) return; firePtr((it && it.el) || items[it].el); await nap(1100); }
      if (!p.done) { await nap(500); if (!p.done && o.done) firePtr(o.done); }
    },
    free: async (a, p) => { const ts = a[0] || []; let i = 0; await nap(900); while (!p.done && ts.length) { firePtr(ts[i++ % ts.length].el); await nap(900); } },
  };
  const autoInput = (name, fn) => {
    const f = input(fn);
    return (...a) => {
      if (name === 'tap' && a[1] && a[1].timeout && (VERIFY || AUTO())) return Promise.resolve(!!a[1].autoResult);   // 시간 제한 톡: 자동·검증은 누르지 않는다
      if (VERIFY) {
        if (name === 'free') a = [a[0], Math.min(a[1] || 15000, 8000)];
        const p = { done: false }, r = f(...a);
        r.finally(() => { p.done = true; });
        vInput(name, a, p, autoDrive[name]);
        return r;
      }
      if (!AUTO()) return f(...a);
      if (name === 'free') a = [a[0], Math.min(a[1] || 15000, 8000)];
      const p = { done: false }, r = f(...a);
      r.finally(() => { p.done = true; });
      autoDrive[name](a, p).catch(e => console.warn('autoDrive', e));
      return r;
    };
  };

  /* ---------- 손가락 안내 ---------- */
  const handSvg = () => `<svg viewBox="0 0 64 64"><image href="${ROOT_URL}assets/ui/hand3.webp" x="16.6" y="4" width="30.8" height="56"/></svg>`; // 종이 오려 만든 손 그림 (손끝이 누를 자리)
  function screenPoint(target) {
    const r = target.getBoundingClientRect(), s = root.getBoundingClientRect();
    return [r.left - s.left + r.width / 2, r.top - s.top + r.height / 2];
  }
  function showHand(target, kind = 'tap') {
    const at = target.querySelector && target.querySelector('[data-hand]');   // 대상이 여러 조각이면 손가락을 놓을 조각을 data-hand 로 고를 수 있다
    const [x, y] = screenPoint(at || target);
    handEl.className = kind; handEl.style.left = x + 'px'; handEl.style.top = y + 'px'; handEl.hidden = false;
  }
  function hideHand() { handEl.hidden = true; }

  /* 막힘 방지 공통: 입력이 오면 poke()로 타이머 리셋 */
  function helper({ target, kind = 'tap', prompt, auto }) {
    if (AUTO()) return { poke() {}, stop() {} }; // 자동 재생: 손가락·재안내 없음 (엔진이 알아서 누른다)
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
  function tap(target, { prompt, timeout } = {}) {
    if (timeout) return tapTimed(target, timeout);
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
  /* 시간 제한 톡(선택 톡): T.tap(대상, { timeout: 6000 }) → 시간 안에 누르면 true, 지나면 false.
     손가락 힌트는 2초 뒤 한 번만, 12초 재안내 없음. 자동 재생·검증 모드는 누르지 않고 false (autoInput 에서 처리) */
  function tapTimed(target, ms) {
    return new Promise(res => {
      arm(target, true);
      const t1 = setTimeout(() => showHand(target), 2000);
      const end = v => { clearTimeout(t1); clearTimeout(t2); target.removeEventListener('pointerdown', on); arm(target, false); hideHand(); res(v); };
      const t2 = setTimeout(() => end(false), ms);
      const on = e => { e.stopPropagation(); if (busy) return; AudioFX.tap(); end(true); };
      target.addEventListener('pointerdown', on);
    });
  }

  /* ---------- 조작: 채우기(fill) — 틀린 답 없이 여러 대상을 톡해 넣고 '끝' 대상을 누르면 끝 ----------
     T.fill(items, { done, maxKinds, allow, onPut, onReject, onEmpty, prompt, auto })
       items: [{ el, key, ... }]  — 모두 정답. 같은 대상을 다시 누르면 하나 더 들어간다
       done:  '끝' 대상(국자). 하나도 안 넣었으면 끝나지 않고 onEmpty() 만 부른다
       maxKinds: 받는 key 종류 수 상한 — 새 종류가 상한을 넘으면 받지 않고 onReject(item)
       allow(item, state): false 면 받지 않고 onReject(item). state = { order, kinds, count }
       onPut(item, n, state): 받아들일 때 부른다(기다리지 않는다). n = 지금까지 넣은 개수
       onReject(item, state): 기본은 좌우 흔들림
       auto(items, state): 자동 재생이 누를 item 배열(회전마다 중복 없이 고르는 것은 동화 쪽이 정한다). 없으면 무작위 1~2종류
     → Promise<{ order: item[], kinds: Set, count }>
     손가락: 아무것도 안 넣었으면 5초 뒤 대상을 돌아가며, 넣은 뒤에는 20초 뒤 done. 12초 재안내(prompt) */
  function fill(items, { done, maxKinds = 0, allow, onPut, onReject, onEmpty, prompt } = {}) {
    return new Promise(res => {
      const st = { order: [], kinds: new Set(), count: 0 };
      let over = false, t1, t2, lap = 0;
      const stopT = () => { clearTimeout(t1); clearTimeout(t2); hideHand(); };
      const rearm = () => {
        stopT();
        if (over || AUTO()) return;
        const none = st.order.length === 0;
        t1 = setTimeout(() => { if (over) return; showHand(none ? items[lap++ % items.length].el : done); }, none ? 5000 : 20000);
        if (prompt) t2 = setTimeout(() => { if (!over) Narrator.speak(prompt); }, 12000);
      };
      const finish = () => {
        over = true; stopT();
        items.forEach(it => { it.el.removeEventListener('pointerdown', it._on); arm(it.el, false); });
        done.removeEventListener('pointerdown', onDone); arm(done, false);
        AudioFX.tap(); res(st);
      };
      const onDone = e => {
        e.stopPropagation(); if (busy || over) return;
        if (!st.order.length) { onEmpty && onEmpty(); rearm(); return; }
        finish();
      };
      items.forEach(it => {
        arm(it.el, true);
        it._on = e => {
          e.stopPropagation(); if (busy || over) return;
          rearm();
          const newKind = !st.kinds.has(it.key);
          if ((maxKinds && newKind && st.kinds.size >= maxKinds) || (allow && allow(it, st) === false)) {
            AudioFX.miss && AudioFX.miss();
            if (onReject) onReject(it, st); else wiggleEl(it.el);
            return;
          }
          st.order.push(it); st.kinds.add(it.key); st.count = st.order.length;
          if (onPut) { const r = onPut(it, st.count, st); if (r && r.catch) r.catch(er => console.warn('fill onPut', er)); }
        };
        it.el.addEventListener('pointerdown', it._on);
      });
      arm(done, true); done.addEventListener('pointerdown', onDone);
      rearm();
    });
  }

  /* ---------- 조작 2: 톡톡톡 (누를 때마다 onStep, count번이면 끝, 20초면 자동 마무리) ---------- */
  function mash(target, { count = 6, onStep, prompt } = {}) {
    return new Promise(res => {
      let i = 0, done = false;
      arm(target, true);
      const finish = () => { if (done) return; done = true; target.removeEventListener('pointerdown', on); arm(target, false); h.stop(); res(); };
      const step = () => { i++; if (count >= 3) AudioFX.countBeat && AudioFX.countBeat(i); onStep && onStep(i); if (i >= count) finish(); };
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
      let over = false;
      const draw = r => {
        lid.style.left = cx + 'px'; lid.style.top = cy + 'px';
        lid.style.width = lid.style.height = (r < .5 ? 0 : 2 * r).toFixed(1) + 'px';
        box.classList.toggle('shut', r < 1); // 완전히 닫히면 종이 한 장
      };
      /* 화면이 안 보이면(탭 가림·화면 꺼짐) requestAnimationFrame 이 멈춘다 → 끝 모습으로 바로 맞추고 넘어간다 (읽어 주기가 멈추지 않게) */
      const end = () => { if (over) return; over = true; draw(Math.max(0, r1)); res(); };
      if (document.hidden) return end();
      const f = now => {
        if (over) return;
        const k = Math.min(1, (now - t0) / ms);
        draw(Math.max(0, r0 + (r1 - r0) * ease(k)));
        if (k < 1) requestAnimationFrame(f); else end();
      };
      requestAnimationFrame(f);
      setTimeout(end, ms + 600); // rAF 가 멈춘 경우 대비
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
    if (!open) await restIfDue();
    root.classList.toggle('open', open);
    if (open === veilOpen) return sleep(120);
    veilOpen = open;
    // 화면 전환 소리: 책장 넘기기 모드에서 이야기를 처음 열 때는 큰 종이 넘기는 소리, 아니면 예전 종이 소리
    if (!(open && transitionMode === 'page' && AudioFX.sfx('page_turn_big', .9))) paperTurn();
    const v = $('#veil'), w = $('#stageWrap'), W = w.clientWidth, H = w.clientHeight, far = farFrom(W, H, W / 2, H / 2);
    v.hidden = false;
    const t0 = performance.now();
    if (open) { await lidTo(v, W / 2, H / 2, 0, far, 1100, easeInOut); v.hidden = true; }
    else await lidTo(v, W / 2, H / 2, far, 0, 1000, easeInOut);
    if (!document.hidden) await sleep(Math.max(0, 1250 - (performance.now() - t0)));
  }
  /* 동그라미 장면 전환 (옛날 만화식 아이리스). focus: 동그라미가 모일 요소(주인공). 없으면 가운데
     닫힘 → 주인공 둘레에서 잠깐 멈춤 → 완전히 닫힘 → 장면 이름(오린 종이 글자) → change() → 톡 튀며 열림 */
  let cardK = 1;   /* 장면 카드 속도 배율 (cardSpeed 로 동화마다 조절, 1 = 기본) */
  async function sceneCard(label, change, focus) {
    if (VERIFY) vPost({ type: 'scene', label: label || '' });
    await restIfDue();
    if (transitionMode === 'page') return pageTurn(change);
    if (document.hidden) { $('#iris').hidden = true; if (change) change(); return; } // 안 보일 때: 넘김 연출 없이 장면만 바꾼다
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
    await lidTo(ir, cx, cy, farFrom(W, H, cx, cy), hole, 520 * cardK, easeIn);
    await sleep(260 * cardK); // 주인공 둘레에 동그라미를 잠깐 남긴다
    await lidTo(ir, cx, cy, hole, 0, 180 * cardK, easeIn);
    if (label) { card.innerHTML = letters(tr(label)); card.className = 'paperword on'; tone([520, 780], .18, { type: 'triangle', vol: .12 }); }
    if (change) change();
    await sleep((label ? 1050 : 250) * cardK);
    card.className = 'paperword';
    paperTurn(); // 화면 전환: 책장 넘기는 종이 소리 (없으면 합성음)
    await lidTo(ir, W / 2, H / 2, 0, farFrom(W, H, W / 2, H / 2), 640 * cardK, easeOutBack);
    ir.hidden = true;
  }
  /* 책장 넘기기 전환: 지금 장면을 종이 한 장으로 떠서(무대 SVG 복제) 오른쪽 가장자리부터 들려 왼쪽으로 넘긴다.
     밑에서는 이미 다음 장면이 기다린다. 넘어가는 장 뒷면은 빈 종이, 들리는 동안 밑 장면에 그림자가 드리운다 */
  let transitionMode = 'iris';
  async function pageTurn(change) {
    /* 책장 넘기기: 접히는 선(f)이 오른쪽 끝에서 왼쪽 끝으로 지나간다.
       f 왼쪽 [0, 2f-W] = 아직 안 넘어간 지금 장면, [2f-W, f] = 넘어가며 접힌 종이 뒷면(가운데로 휜 그늘),
       f 오른쪽 = 새 장면. 접힌 선 옆에 새 장면 쪽으로 그림자. 종이 끝이 살짝 기울어(위가 먼저) 넘어간다 */
    if (document.hidden) { if (change) change(); return; } // 안 보일 때: 넘김 연출 없이 장면만 바꾼다
    const wrap = $('#stageWrap'), stg = $('#stage'), W = wrap.clientWidth, H = wrap.clientHeight;
    const book = document.createElement('div'); book.className = 'book';
    const front = document.createElement('div'); front.className = 'front';
    const snap = stg.cloneNode(true); snap.removeAttribute('id');
    // 복제본 안의 id 는 모두 지운다 (filter 정의까지). 같은 id 가 둘이면 Safari 가 복제본의 #pp 를 붙잡고 있다가,
    // 복제본이 지워진 뒤 그 필터를 쓰는 그림(인물·소품·카드)을 통째로 안 그린다. 복제본의 url(#pp) 는 원래 무대의 정의를 쓴다
    snap.querySelector('defs') && snap.querySelector('defs').remove();
    snap.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    front.appendChild(snap);
    const flap = document.createElement('div'); flap.className = 'flap';
    const cast = document.createElement('div'); cast.className = 'cast';
    book.append(front, cast, flap); wrap.appendChild(book);
    if (change) change();
    await sleep(40);
    AudioFX.sfx('page_turn', .9) || paperTurn(); // 책장 한 장 넘기는 소리 (Mixkit 'Page turn single')
    const D = 1300, tilt = H * .18; // 위쪽 모서리가 아래보다 tilt 만큼 앞서 간다
    const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const poly = pts => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
    await new Promise(res => {
      const t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / D), e = ease(k);
        const fb = W + tilt - (W + tilt * 2) * e; // 아래 끝의 접힌 선 x
        const ft = fb - tilt;                      // 위 끝 (먼저 간다)
        // 지금 장면: 접힌 선과, 그 너머로 접혀 덮인 부분을 뺀 왼쪽 조각
        const ot = 2 * ft - W, ob = 2 * fb - W;
        front.style.clipPath = poly([[0, 0], [Math.max(0, ot), 0], [Math.max(0, ob), H], [0, H]]);
        // 접힌 뒷면: [2f-W, f] (위·아래 따로)
        flap.style.clipPath = poly([[ot, 0], [ft, 0], [fb, H], [ob, H]]);
        flap.style.setProperty('--fx', ((ft + fb) / 2 / W * 100).toFixed(2) + '%');
        // 새 장면 위, 접힌 선 바로 오른쪽 그림자
        cast.style.clipPath = poly([[ft, 0], [ft + 70, 0], [fb + 70, H], [fb, H]]);
        cast.style.opacity = (k < .9 ? 1 : (1 - k) * 10).toFixed(2);
        if (k < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
      setTimeout(res, D + 400); // 화면이 안 보일 때(rAF 멈춤) 대비
    });
    book.remove();
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
  /* 컷 그림(400x300) 안의 영어 효과 글자가 한글 4자 기준 크기 그대로라 사진 밖으로 잘리는 것을 막는다:
     폭을 재서 먼저 안쪽으로 밀고, 그래도 넘으면 글자 크기를 줄인다 (한글은 그대로) */
  function fitCutText(svg) {
    svg.querySelectorAll('text').forEach(t => {
      if (!/[A-Za-z]/.test(t.textContent)) return;
      try {
        let b = t.getBBox();
        if (b.width > 376) {
          t.setAttribute('font-size', (parseFloat(t.getAttribute('font-size')) * 376 / b.width).toFixed(1));
          b = t.getBBox();
        }
        const dx = b.x < 12 ? 12 - b.x : b.x + b.width > 388 ? 388 - b.x - b.width : 0;
        if (dx) t.setAttribute('x', (parseFloat(t.getAttribute('x') || 0) + dx).toFixed(1));
      } catch (e) { /* 측정 불가 시 그대로 */ }
    });
  }
  /* 만화 컷: draw(svg 0..400 x 0..300)로 코드가 그린다 (그림 컷은 cutImage). 탭하면 빨리 넘어간다 */
  async function cut(draw, { hold: ms = 2600, sfx } = {}) {
    const p = $('#cutPanel');
    p.innerHTML = '<div class="cut"></div>';
    const svg = el('svg', { viewBox: '0 0 400 300' }, p.firstChild);
    el('rect', { width: 400, height: 300, fill: '#1F2A56' }, svg);   // 그림을 불러오기 전 바탕
    el('image', { href: ROOT_URL + 'assets/v3w/cm_cut_bg.webp', width: 400, height: 300, preserveAspectRatio: 'xMidYMid slice' }, svg);   // 종이 햇살 바탕(생성 그림, 2026-10-29 SVG → 이미지)
    draw(svg);
    fitCutText(svg);
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
      if (p.firstChild) p.firstChild.classList.add('out'); // 컷이 겹쳐 열리면(읽어 주기 시간 제한 등) 앞 컷이 이미 비워졌을 수 있다
      await sleep(280);
    }
    p.hidden = true; p.innerHTML = '';
  }
  function shake() { const w = $('#stageWrap'); w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake'); }
  function confetti(host, n = 44) {
    host = host || $('#confetti');
    const colors = ['#E8703A', '#D9A94E', '#A93B32', '#3F6B4F', '#8B7BB8', '#F6ECD8'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%'; s.style.background = colors[i % colors.length];
      s.style.animationDuration = 2.4 + Math.random() * 2 + 's'; s.style.animationDelay = Math.random() * 1.2 + 's';
      host.appendChild(s); setTimeout(() => s.remove(), 6000);
    }
  }
  /* 텍스트 효과 (의성어) — 탄력: 별이 스프링처럼 튀고, 글자가 한 자씩 떨어지며 출렁이다 자리 잡는다 */
  const SPRING = [0, 1.35, .86, 1.07, .97, 1]; // 넘쳤다 되돌아오는 스프링 곡선 (키프레임 값)
  function springFrames(fn) { return SPRING.map((v, i) => ({ transform: fn(v, i), offset: i / (SPRING.length - 1) })); }
  /* ---------- 말풍선 자리 찾기: 무대 그림(인물·소품)을 피해 가장 가까운 빈 자리 ----------
     그림마다 불투명한 곳을 24x24 칸으로 한 번 재 두고(같은 그림은 캐시), 풍선 사각형과 겹치는 넓이를 센다.
     머리 쪽(그림 위 40%)은 두 배로 센다. 배경 층(layer·bg·scene·fg·frame 이름, 무대 대부분을 덮는 큰 그림)은 빼고 본다. */
  const POP_GRID = new Map(); // href → { cells, bb } | 'wait' | null
  function popGrid(href) {
    const had = POP_GRID.get(href);
    if (had !== undefined) return had;
    POP_GRID.set(href, 'wait');
    const im = new Image();
    im.onload = () => {
      try {
        const N = 24, c = document.createElement('canvas'); c.width = c.height = N;
        const cx = c.getContext('2d', { willReadFrequently: true }); cx.drawImage(im, 0, 0, N, N);
        const d = cx.getImageData(0, 0, N, N).data, cells = [];
        let x0 = N, y0 = N, x1 = -1, y1 = -1;
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (d[(j * N + i) * 4 + 3] > 60) {
          cells.push(i, j); if (i < x0) x0 = i; if (i > x1) x1 = i; if (j < y0) y0 = j; if (j > y1) y1 = j;
        }
        POP_GRID.set(href, cells.length ? { cells, bb: [x0, y0, x1 + 1, y1 + 1] } : null);
      } catch (e) { POP_GRID.set(href, 'full'); } // 그림을 읽을 수 없으면 사각형으로
    };
    im.onerror = () => POP_GRID.set(href, null);
    im.src = href;
    return 'wait';
  }
  function popShown(n) {
    for (; n && n !== world; n = n.parentNode) {
      if (!(n instanceof Element)) return false;
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      if (+cs.opacity < .15 && !(n.getAnimations && n.getAnimations().some(a => a.playState === 'running'))) return false; // 막 나타나는 중(fadeIn)이면 보이는 것으로
    }
    return n === world;
  }
  /* 무대 좌표(fxL)로 본 장애물 그림 목록: { bb, cells: [x0, y0, x1, y1, 무게], area } */
  function popObstacles(view) {
    const out = [];
    let I; try { I = fxL.getScreenCTM().inverse(); } catch (e) { return out; }
    for (const im of world.querySelectorAll('image')) {
      const href = im.getAttribute('href') || im.getAttribute('xlink:href') || '';
      const name = href.split('/').pop();
      if (!href || /layer|(^|_)bg|scene|_fg|frame/i.test(name)) continue;
      const w = +im.getAttribute('width') || 0, h = +im.getAttribute('height') || 0;
      if (w <= 0 || h <= 0) continue;
      const sm = im.getScreenCTM(); if (!sm) continue;
      const M = I.multiply(sm), x = +im.getAttribute('x') || 0, y = +im.getAttribute('y') || 0;
      const P = (u, v) => [M.a * u + M.c * v + M.e, M.b * u + M.d * v + M.f];
      const gd = popGrid(href);
      if (gd === null) continue;
      const N = 24, bb = gd && gd.bb ? gd.bb : [N * .12, N * .04, N * .88, N]; // 아직 못 잰 그림: 옆 여백만 덜어 낸 사각형
      const [ax, ay] = P(x + bb[0] / N * w, y + bb[1] / N * h), [bx, by] = P(x + bb[2] / N * w, y + bb[3] / N * h);
      const L = Math.min(ax, bx), R = Math.max(ax, bx), T0 = Math.min(ay, by), B0 = Math.max(ay, by);
      if (R - L > 620 || B0 - T0 > 460) continue; // 무대를 거의 덮는 배경 그림
      if (R < view[0] || L > view[2] || B0 < view[1] || T0 > view[3]) continue;
      if (!popShown(im)) continue;
      const headY = T0 + (B0 - T0) * .4, cells = [];
      if (gd && gd.cells) {
        const cw = Math.abs(M.a * w / N) + Math.abs(M.c * h / N), ch = Math.abs(M.b * w / N) + Math.abs(M.d * h / N);
        for (let k = 0; k < gd.cells.length; k += 2) {
          const [px, py] = P(x + (gd.cells[k] + .5) * w / N, y + (gd.cells[k + 1] + .5) * h / N);
          cells.push([px - cw / 2, py - ch / 2, px + cw / 2, py + ch / 2, py < headY ? 2 : 1]);
        }
      } else { cells.push([L, T0, R, headY, 2], [L, headY, R, B0, 1]); }
      out.push({ bb: [L, T0, R, B0], cells, area: cells.reduce((s, c) => s + (c[2] - c[0]) * (c[3] - c[1]) * c[4], 0) || 1 });
    }
    return out;
  }
  /* 카메라가 움직이는 중이어도 지금 화면에 보이는 카메라 */
  function camNow() {
    try { const m = new DOMMatrix(getComputedStyle(cam).transform); if (m.a > 0) return { z: m.a, x: (500 - m.e) / m.a, y: (280 - m.f) / m.a }; } catch (e) { /* 아래 */ }
    return { ...camState };
  }
  /* (x,y) 에 놓을 hw×hh(반폭·반높이, 무대 좌표) 풍선의 자리: 겹침이 적으면 그대로, 많으면 가까운 빈 곳 */
  function popPlace(x, y, hw, hh, view) {
    const clampX = v => Math.min(Math.max(v, view[0] + hw), view[2] - hw), clampY = v => Math.min(Math.max(v, view[1] + hh), view[3] - hh);
    const x0 = view[2] - view[0] > hw * 2 ? clampX(x) : (view[0] + view[2]) / 2, y0 = view[3] - view[1] > hh * 2 ? clampY(y) : (view[1] + view[3]) / 2;
    let obs; try { obs = popObstacles(view); } catch (e) { obs = []; }
    if (!obs.length) return [x0, y0];
    const sw = hw * .86, sh = hh * .8, area = 4 * sw * sh; // 구름 모양이라 모서리는 비어 있다
    const cost = (cx, cy) => { // 풍선 넓이 중 그림이 차지한 몫 + 그림마다 가려진 몫(작은 인물도 덮지 않게)
      const l = cx - sw, r = cx + sw, t = cy - sh, b = cy + sh;
      let s = 0, f = 0;
      for (const o of obs) {
        if (o.bb[2] < l || o.bb[0] > r || o.bb[3] < t || o.bb[1] > b) continue;
        let q = 0;
        for (const c of o.cells) { const ix = Math.min(r, c[2]) - Math.max(l, c[0]); if (ix <= 0) continue; const iy = Math.min(b, c[3]) - Math.max(t, c[1]); if (iy > 0) q += ix * iy * c[4]; }
        s += q; f += q / o.area;
      }
      return s / area + f * .8;
    };
    const c0 = cost(x0, y0);
    if (c0 < .06) return [x0, y0];
    const z = Math.max(1, camState.z);
    let best = [x0, y0], bestC = c0;
    for (let r = 30; r <= 360; r += 30) for (let k = 0; k < 16; k++) {
      const a = k / 16 * Math.PI * 2, cx = clampX(x0 + Math.cos(a) * r / z), cy = clampY(y0 + Math.sin(a) * r / z);
      const d = Math.hypot(cx - x0, cy - y0) * z;
      const c = cost(cx, cy) + d / 700 + (cy > y0 + 8 / z ? .06 : 0); // 가까운 곳, 아래보다 위
      if (c < bestC) { bestC = c; best = [cx, cy]; }
    }
    return best;
  }
  function pop(x, y, word, color = '#A93B32') {
    // 카메라가 가까이 붙을수록 화면에서 커지므로 확대 배율만큼 줄여 늘 비슷한 크기로 보이게
    if (AudioFX.countPop) AudioFX.countPop(); // 세는 박자면 음이 올라가는 pop
    const ax = x, ay = y, cn = camNow();
    const g = el('g', { transform: `translate(${x},${y}) scale(${(1 / Math.max(1, cn.z)).toFixed(3)})` }, fxL);
    g.style.pointerEvents = 'none'; // 풍선과 글자는 누름을 받지 않는다 (밑의 인물·물건이 그대로 눌린다)
    const txt = tr(word), FONT = "'Pretendard Variable', Pretendard, sans-serif";
    const latin = /[A-Za-z]/.test(txt), vw = viewWidth(), maxW = vw * .6;
    // 말풍선: 뾰족한 별 대신 가장자리가 동글동글한 종이 구름 (120 단위 상자, 가운데 0,0)
    const BURST = pop.shape = pop.shape || (() => {
      const n = 11, R = 44, r = 15, P = i => { const a = i / n * Math.PI * 2 - Math.PI / 2; return [(R * Math.cos(a)).toFixed(1), (R * Math.sin(a)).toFixed(1)]; };
      let d = 'M' + P(0).join(' ');
      for (let i = 1; i <= n; i++) d += ` A${r} ${r} 0 0 1 ${P(i).join(' ')}`;
      return d + ' Z';
    })();
    const pieces = []; // { s: 글자(또는 낱말), x, y } — 가운데 기준 배치
    let size, bwW, bwH; // 풍선 그림 크기: 글자에 맞춰 작게 (2026-10-27 인물을 가려 답답하다는 지적으로 줄임)
    if (!latin) { // 한글: 한 자씩 고정 폭
      const chars = [...txt]; size = chars.length > 3 ? 38 : 44;
      const cw = ch => /[!?~.…,]/.test(ch) ? size * .42 : size * .86; // 문장부호는 좁게
      const total = chars.reduce((a, ch) => a + cw(ch), 0);
      let cursor = -total / 2;
      chars.forEach(ch => { pieces.push({ s: ch, x: cursor + cw(ch) / 2, y: 0 }); cursor += cw(ch); });
      bwW = Math.min(Math.max(total + size * 1.5, size * 2.6), vw * .9); bwH = size * 2.15;
    } else { // 영어: 낱말 단위로 실제 글자 폭을 재서 놓고, 너무 길면 글자를 줄이고 두 줄 이상으로 나눈다
      const cx = (pop.cvs = pop.cvs || document.createElement('canvas')).getContext('2d');
      const words = txt.split(/\s+/).filter(Boolean);
      let lines, wid, lw, sp;
      size = words.length > 1 || txt.length > 6 ? 38 : 44;
      for (;;) {
        cx.font = `600 ${size}px ${FONT}`;
        wid = words.map(w => cx.measureText(w).width); sp = cx.measureText(' ').width + size * .22; // 흰 테두리에 먹히지 않게 낱말 사이를 조금 더 띄운다
        lines = [[]]; lw = [0];
        words.forEach((w, i) => {
          let L = lines.length - 1;
          if (lines[L].length && lw[L] + sp + wid[i] > maxW) { lines.push([]); lw.push(0); L++; }
          lw[L] += (lines[L].length ? sp : 0) + wid[i]; lines[L].push(i);
        });
        if ((Math.max(...lw) <= maxW && lines.length <= 3) || size <= 24) break;
        size -= 4;
      }
      const lh = size * 1.08, W = Math.max(...lw);
      lines.forEach((ln, li) => {
        let cur = -lw[li] / 2;
        ln.forEach(i => { pieces.push({ s: words[i], x: cur + wid[i] / 2, y: (li - (lines.length - 1) / 2) * lh }); cur += wid[i] + sp; });
      });
      bwW = Math.min(Math.max(size * 2.8, W + size * 1.6), vw * .9); bwH = size * 2.15 + (lines.length - 1) * lh * 1.1;
    }
    const z = Math.max(1, cn.z);
    { // 자리: 보이는 무대 안에서, 인물·물건 그림을 덮지 않는 가장 가까운 곳 (가장자리에서도 잘리지 않게)
      const hv = vw / 2 / z, m = 8 / z, view = [cn.x - hv + m, cn.y - 280 / z + m, cn.x + hv - m, cn.y + 280 / z - m];
      [x, y] = popPlace(x, y, bwW / 2 / z, bwH / 2 / z, view);
      g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${(1 / z).toFixed(3)})`);
    }
    { // 같은 자리에서 연달아 터지면(톡톡톡 세기) 앞의 것은 비켜 사라지고, 아직 막 터진 것이면 새것을 옆으로 비킨다
      const now = performance.now();
      let cur = x;
      const bw0 = bwW / z, bh0 = bwH / z, hit = p => now - p.t < 1000 && Math.abs(p.x - cur) < (p.w + bw0) / 2 && Math.abs(p.y - y) < (p.h + bh0) / 2;
      const young = POPS.find(p => hit(p) && now - p.t < 250 && p.txt !== txt);
      if (young) { cur += (pop.flip = !pop.flip) ? 80 : -80; g.setAttribute('transform', `translate(${cur.toFixed(1)},${y.toFixed(1)}) scale(${(1 / z).toFixed(3)})`); }
      POPS.forEach(p => { if (p.g.isConnected && hit(p)) fadePop(p, Math.max(0, 250 - (now - p.t))); });
      POPS.splice(0, POPS.length, ...POPS.filter(p => p.g.isConnected && now - p.t < 2500));
      POPS.push({ g, x: cur, y, w: bw0, h: bh0, t: now, txt });
      x = cur;
    }
    const sc = `scale(${(bwW / 118).toFixed(3)},${(bwH / 118).toFixed(3)})`;
    const bw = el('g', {}, g);
    { // 비켜 놓였으면 받침(꼬리)이 원래 자리(말하는 인물·소리 난 곳) 쪽을 가리킨다: 살구색 받침 위에 크림 종이 두 겹
      const dx = (ax - x) * z, dy = (ay - y) * z, d = Math.hypot(dx, dy);
      if (d > bwH * .45) {
        const ux = dx / d, uy = dy / d, px = -uy, py = ux, a = bwW / 2 * .86, b = bwH / 2 * .82;
        const e = 1 / Math.hypot(ux / a, uy / b), tip = Math.min(d, e + 30), bs = Math.min(15, b * .45);
        const tri = (k, w) => `M${(ux * (e - 16) + px * w).toFixed(1)} ${(uy * (e - 16) + py * w).toFixed(1)} L${(ux * (tip + k)).toFixed(1)} ${(uy * (tip + k)).toFixed(1)} L${(ux * (e - 16) - px * w).toFixed(1)} ${(uy * (e - 16) - py * w).toFixed(1)} Z`;
        el('path', { d: tri(5, bs + 5), fill: '#F2A671' }, bw);
        el('path', { d: tri(-2, bs), fill: '#EEDFC6' }, bw);
      }
    }
    // 종이 공예 말풍선 그림(assets/ui/pop_bubble.webp: 크림 종이 + 살구색 받침 두 겹). 못 불러오면 그린 구름 모양
    const bimg = el('image', { href: ROOT_URL + 'assets/ui/pop_bubble.webp', x: -bwW / 2, y: -bwH / 2, width: bwW, height: bwH, preserveAspectRatio: 'none' }, bw);
    bimg.addEventListener('error', () => { bimg.remove(); el('path', { d: BURST, fill: '#FFF7EA', stroke: '#E9C79A', 'stroke-width': 2.2, 'vector-effect': 'non-scaling-stroke', transform: sc }, bw); });
    bw.style.transformBox = 'view-box'; bw.style.transformOrigin = '0 0';
    bw.animate(springFrames(v => `scale(${v}) rotate(${(1 - v) * 12}deg)`), { duration: 620, easing: 'ease-out', fill: 'both' });
    const step = latin ? 140 : 70;
    pieces.forEach((pc, i) => {
      const t = el('text', { 'text-anchor': 'middle', 'font-size': size, fill: color, 'font-family': FONT, stroke: '#fff', 'stroke-width': 8, 'paint-order': 'stroke', text: pc.s }, g);
      if (latin) t.setAttribute('font-weight', 600);
      t.style.transformBox = 'view-box'; t.style.transformOrigin = '0 0';
      const rot = (i % 2 ? 1 : -1) * 9;
      t.animate(springFrames((v, k) => `translate(${pc.x}px, ${pc.y + size * .36 - (k === 0 ? 56 : 0)}px) scale(${Math.max(v, .01)}) rotate(${k < 3 ? rot : 0}deg)`),
        { duration: 700, delay: step * i, easing: 'ease-out', fill: 'both' });
    });
    // 오래 남아 인물을 가리지 않게: 글자 수에 맞춰 짧게 (한글 1.3~2.3초, 영어 1.4~2.6초)
    const n = latin ? txt.split(/\s+/).length : [...txt].length;
    const life = g.animate([{ opacity: 1 }, { opacity: 1, offset: .78 }, { opacity: 0 }], { duration: latin ? Math.min(2600, Math.max(1400, 1100 + n * 260)) : Math.min(2300, Math.max(1300, 1000 + n * 120)) });
    life.finished.then(() => g.remove(), () => {});
    POPS[POPS.length - 1].life = life;
  }
  const POPS = []; // 최근 pop들 (겹침 정리용)
  function fadePop(p, wait) { // 앞 숫자를 0.15초에 걸쳐 작아지며 지운다
    if (p.fading) return; p.fading = true;
    setTimeout(() => {
      if (p.life) p.life.cancel();
      const a = p.g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' });
      a.finished.then(() => p.g.remove(), () => {});
    }, wait);
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
  preload(ROOT_URL + 'assets/v3w/cm_cut_bg.webp');   // 만화 컷 바탕은 첫 컷에 바로 보이게 미리
  /* 동화 id = 폴더 이름 (tales/<id>/index.html) */
  /* thumbs.js 캐시 버전: index.html 의 thumbs.js?v= 와 같이 올린다 */
  const THUMBS_V = '20261022e';
  const taleId = () => { const m = location.pathname.match(/\/tales\/([^/]+)\//); return m ? decodeURIComponent(m[1]) : ''; };
  /* 읽어 주기 단추의 펼친 책 (종이 두 장) */
  /* 단추 그림은 앱 UI 생성 그림(assets/ui/*.webp)을 쓴다(2026-10-29 사용자 지시: SVG 그림 → 이미지) */
  const uiPic = (k, cls = '') => `<img class="uipic ${cls}" src="${ROOT_URL}assets/ui/${k}.webp" alt="" aria-hidden="true" draggable="false">`;
  const BOOK_SVG = uiPic('ic_book', 'book');
  const PLAY_SVG = uiPic('ic_play', 'play');
  /* 시작·끝 화면의 구멍 그림: 밝은 종이 = <id>_light.webp(THUMBS2L), 어두운 종이 = <id>.webp(THUMBS2). 없으면 빈 구멍 */
  function heroes() {
    const id = taleId(), dark = { matches: false, addEventListener() {} }; // 다크 모드 없음: 늘 밝은 종이
    const portraitMQ = window.matchMedia('(orientation: portrait)');
    /* 시작 화면 키아트: <id>_key_wide.webp(가로) / <id>_key_tall.webp(세로), 둘 다 있을 때만 (THUMBSKEY). 없으면 예전 구멍 배치 */
    const keySrc = () => (window.THUMBSKEY || []).includes(id)
      ? `${ROOT_URL}assets/thumbs/${id}_key_${portraitMQ.matches ? 'tall' : 'wide'}.webp` : '';
    const set = () => {
      const has = window.THUMBS2L || [];
      const src = has.includes(id) ? `${ROOT_URL}assets/thumbs/${id}_light.webp` : '';
      document.querySelectorAll('.hero').forEach(h => {
        const img = h.querySelector('img');
        h.classList.toggle('plain', !src);
        if (src && img.getAttribute('src') !== src) img.src = src;
        if (!src) img.removeAttribute('src');
      });
      const ss = document.getElementById('startScreen'), ki = ss && ss.querySelector('.keyimg'), ks = keySrc();
      if (ki) {
        ss.classList.toggle('keyed', !!ks);
        const lp = ((window.THUMBSKEYLIGHT || {})[id]) || '';
        ss.classList.toggle('light', !!(ks && lp)); if (lp) ss.style.setProperty('--keypaper', lp); else ss.style.removeProperty('--keypaper');
        if (ks && ki.getAttribute('src') !== ks) ki.src = ks;
        if (!ks) ki.removeAttribute('src');
      }
      return src;
    };
    dark.addEventListener ? dark.addEventListener('change', set) : dark.addListener(set);
    portraitMQ.addEventListener ? portraitMQ.addEventListener('change', set) : portraitMQ.addListener(set);
    window.addEventListener('resize', set); window.addEventListener('orientationchange', set);
    return new Promise(res => {
      if (!id) return res();
      const sc = document.createElement('script');
      sc.src = ROOT_URL + 'assets/thumbs/thumbs.js?v=' + THUMBS_V; // 홈(index.html)과 같은 버전: 옛 표가 캐시에 남아 새 동화 색·그림이 빠지지 않게
      sc.onload = sc.onerror = () => {
        const src = set();
        const ki = document.querySelector('#startScreen .keyimg');
        const img = ki && ki.getAttribute('src') ? ki : document.querySelector('#startScreen .hero img');
        if (!src && img === ki && !ki.getAttribute('src')) return res();
        if (!img.getAttribute('src') || img.complete) return res();
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
    // 종이 액자(#deco): 가로는 무대 자리에, 세로는 보이는 화면 전체에 (세로용 액자 그림을 늘려 맞춘다)
    const d = $('#deco');
    if (d && !d.hidden) {
      if (portrait) Object.assign(d.style, { left: 0, top: 0, width: W + 'px', height: H + 'px', backgroundImage: `url(${d.dataset.tall})` });
      else Object.assign(d.style, { left: mx + 'px', top: my + 'px', width: fw + 'px', height: fh + 'px', backgroundImage: `url(${d.dataset.wide})` });
    }
  }

  /* 화면 글자 번역: 영어 모드이고 이 동화에 영어 자료(TEXT_EN·NARRATION_CLIPS_EN)가 있을 때만 영어, 아니면 한국어 그대로 */
  const ENGINE_EN = { '끝내기': 'Exit', '돌려서 크게 보기': 'Rotate for a bigger view', '이야기 시작': 'Start story', '처음으로': 'Home', '다시 보기': 'Watch again', '끝!': 'The End!',
    '자동 재생': 'Auto play', '읽어 주기': 'Read to me', '오늘 동화 끝! 내일 또 만나요': 'The end! See you tomorrow', '한 번 더': 'Once more', '홈으로': 'Home',
    '오늘은 여기까지! 눈을 쉬어요': 'That is enough for today. Let our eyes rest.', '어른이 +10분': 'Grown-up: +10 min', '어른이 확인해 주세요': 'Grown-ups, please check', '닫기': 'Close',
    '놀이': 'Play', '스티커북': 'Sticker Book', '종이별': 'Paper Stars', '스티커를 받았어요!': 'You got a sticker!', '종이별 하나 받았어요!': 'You got a Paper Star!', '다섯 개! 동화를 하나 열 수 있어요': 'Five stars! You can open a tale.', '새 친구 스티커!': 'A new friend sticker!', '퍼즐 조각을 받았어요!': 'You got a puzzle piece!', '그림이 완성됐어요!': 'The picture is complete!' };
  const tr = ko => {
    if (!englishOn()) return ko;
    const t = typeof TEXT_EN !== 'undefined' && TEXT_EN[ko], c = NARRATION_CLIPS_EN[ko];
    return t || (c && c.t) || ENGINE_EN[ko] || ko;
  };


  /* ---------- 놀이 시간 알림 (보호자가 홈의 보호자 메뉴에서 정한다. 기본: 끔) ----------
     동화가 열려 있고 화면이 보이는 동안만 오늘 쓴 시간을 센다. 시간이 되면 장면이 바뀌는 자리(막·동그라미 전환)에서
     조용한 쉬는 화면을 보여 준다. 소리 알람이나 갑작스러운 종료는 없다. */
  const PT = (() => {
    const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
    const rd = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch (e) { return f; } };
    const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 없이도 이번 실행에서는 동작 */ } };
    const used = () => { const u = rd('play_used', null); return u && u.d === today() ? u.ms : 0; };
    const bonus = () => { const b = rd('play_bonus', null); return b && b.d === today() ? b.min : 0; };
    const limit = () => +rd('play_limit_min', 0) || 0;
    let running = false;
    setInterval(() => { if (running && document.visibilityState === 'visible') wr('play_used', { d: today(), ms: used() + 1000 }); }, 1000);
    return {
      run(on) { running = on; },
      due() { const l = limit(); return l > 0 && used() >= (l + bonus()) * 60000; },
      extend(min) { wr('play_bonus', { d: today(), min: bonus() + min }); },
    };
  })();
  let restShow = null; // mount 가 채운다: 쉬는 화면을 보여 주고, 어른이 시간을 늘리면 풀려난다
  const restIfDue = async () => { if (PT.due() && restShow) await restShow(); };

  function mount({ title, subtitle, run, note = false, endTitle = '끝!', frame = null, transition = 'page', read = false }) /* 2026-10-19: 모든 동화 기본 = 책장 넘기기 (?trans=iris 로 예전 동그라미) */ {
    document.title = tr(title);
    readOpt = !!read; // 읽어 주기(READ_ACTS)를 갖춘 동화만
    const home = ROOT_URL + 'index.html';
    /* 시작 화면 두 변형(APP_SCREENS_PLAN S5): 동화 탭에서 = 큰 '이야기 시작' + 작은 '읽어 주기', 잠자리 탭에서(?read=1) = 큰 '읽어 주기' + 작은 '놀이' */
    const PLAYB = `<button class="pill go" id="startBtn">${PLAY_SVG}${tr('이야기 시작')}</button>`;
    const PLAYS = `<button class="pill" id="startBtn">${PLAY_SVG}${tr('놀이')}</button>`;
    const READB = hide => `<button class="pill read" id="readBtn" type="button"${hide ? ' hidden' : ''}>${BOOK_SVG}${tr('읽어 주기')}</button>`;
    const readFirst = readOpt && READ_Q;
    const startPills = readFirst ? READB(false).replace('pill read', 'pill go read') + PLAYS : PLAYB + READB(true);
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
    <div id="frame"></div><div id="deco" hidden></div><div id="apron"></div>
    <div id="iris" hidden><i class="lid"></i><span id="irisCard"></span></div>
    <div id="veil" class="shut"><i class="lid"></i></div>
    <div id="confetti"></div>
    <div id="hand" hidden>${handSvg()}</div>
    <button class="pill" id="finBtn" hidden>${tr('끝내기')}</button>
  </div>
  <div id="rotateHint">${uiPic('ic_rotate')}${tr('돌려서 크게 보기')}</div>
  <div id="bubble" hidden><p id="bubbleText"></p></div>
  <div id="cutPanel" hidden></div>
  <div id="startScreen" class="screen">
    <a class="homeIcon" id="homeIcon" href="${home}" aria-label="${tr('처음으로')}">${uiPic('ic_home')}</a>
    ${AUTO() ? `<i class="autobadge" aria-hidden="true">${uiPic('ic_play')}</i>` : ''}
    <img class="keyimg" alt="" decoding="async">
    <div class="hero plain"><img alt="" decoding="async"></div>
    <div class="words">
      <h1 class="paperword ttl" aria-label="${tr(title)}">${letters(tr(title))}</h1>
      ${subtitle ? `<p class="sub">${tr(subtitle)}</p>` : ''}
      <div class="pills" id="startPills">${startPills}</div>
      ${note ? `<p class="note">${note}</p>` : ''}
    </div>
    <div class="startHint" id="startHint" hidden aria-hidden="true">${handSvg()}</div>
  </div>
  <div id="endScreen" class="screen back" hidden>
    <div class="bwin"><img class="bimg" alt="" decoding="async"></div>
    <div class="words">
      <h2 class="paperword ttl" aria-label="${tr(endTitle)}">${letters(tr(endTitle))}</h2>
      <p class="sub" id="endMsg" hidden></p>
      <div class="rbtns">
        <a class="rbtn" id="homeBtn" href="${home}" aria-label="${tr('홈으로')}">${uiPic('ic_home')}</a>
        <button type="button" class="rbtn" id="againBtn" aria-label="${tr('한 번 더')}">${uiPic('ic_again')}</button>
      </div>
    </div>
    <div class="aw-tray" id="awTray" hidden>
      <a class="aw-book" id="awBook" href="${home}#stickers" aria-label="${tr('스티커북')}"><i class="aw-hole"></i></a>
      <a class="aw-plate" id="awPlate" href="${home}#stickers" aria-label="${tr('종이별')}" hidden><i></i><i></i><i></i><i></i><i></i></a>
    </div>
    <div id="endConfetti" class="endconf"></div>
  </div>
  <div id="restScreen" class="screen" hidden>
    <div class="words">
      <h2 class="paperword ttl">${letters(tr('오늘은 여기까지! 눈을 쉬어요'))}</h2>
      <div class="pills"><a class="pill go" href="${home}">${tr('홈으로')}</a></div>
      <div class="restGate" hidden><p class="sub" id="restQ"></p><div class="pills" id="restOpts"></div></div>
      <button class="restMore" id="restMore" type="button">${tr('어른이 +10분')}</button>
    </div>
  </div>
</div>`);
    root = $('#tale'); stage = $('#stage');
    transitionMode = transition;
    try { const tq = new URLSearchParams(location.search).get('trans'); if (tq === 'page' || tq === 'iris') transitionMode = tq; } catch (e) { /* 기본 전환 */ }
    if (transitionMode === 'page') try { AudioFX.sfx('page_turn', 0); AudioFX.sfx('page_turn_big', 0); } catch (e) { /* 미리 불러오기: 첫 넘김부터 책장 소리 */ }
    // 종이 액자: mount({ frame: '<tale>' }) 이면 assets/frames/<tale>_wide.webp·_tall.webp 를 무대 위에 얹는다. ?frame=0 으로 끈다
    try {
      const fq = new URLSearchParams(location.search).get('frame');
      if (frame && fq !== '0') { const d = $('#deco'); d.dataset.wide = ROOT_URL + 'assets/frames/' + frame + '_wide.webp'; d.dataset.tall = ROOT_URL + 'assets/frames/' + frame + '_tall.webp'; d.hidden = false; }
    } catch (e) { /* 액자 없이 */ }
    $('#finBtn').onclick = () => { Narrator.stop(); location.href = home; };
    const heroesP = heroes(); arrive(heroesP);
    // 세로 화면: 무대를 크게 키워 양옆을 자른다(slice), 가로: 전체를 맞춘다(meet)
    const portraitMQ = window.matchMedia('(orientation: portrait)');
    const fitStage = () => { stage.setAttribute('preserveAspectRatio', portraitMQ.matches ? 'xMidYMid slice' : 'xMidYMid meet'); fitFrame(portraitMQ.matches); };
    fitStage(); portraitMQ.addEventListener ? portraitMQ.addEventListener('change', fitStage) : portraitMQ.addListener(fitStage);
    if (window.ResizeObserver) new ResizeObserver(() => fitFrame(portraitMQ.matches)).observe($('#stageWrap'));
    else addEventListener('resize', () => fitFrame(portraitMQ.matches));
    const hint = $('#rotateHint');
    if (hint) { hint.onpointerdown = e => { e.stopPropagation(); hint.classList.add('gone'); }; setTimeout(() => hint.classList.add('gone'), 6000); } cam = $('#cam'); bgL = $('#bgL'); world = $('#world'); fxL = $('#fxL'); handEl = $('#hand');
    // 대사 건너뛰기: 무대 1초 꾹 (보호자용). 짧은 탭은 무시한다
    $('#tale').addEventListener('contextmenu', e => e.preventDefault()); // 길게 누를 때 뜨는 메뉴(이미지 저장 등) 막기
    let ht = null;
    $('#stageWrap').addEventListener('pointerdown', () => { clearTimeout(ht); ht = setTimeout(() => Narrator.stop(), 1000); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => $('#stageWrap').addEventListener(ev, () => clearTimeout(ht)));
    // 잠긴 동안 누르면 톡 소리만
    $('#stageWrap').addEventListener('pointerdown', () => { if (busy) AudioFX.tap(); });
    restShow = () => new Promise(res => {
      const scr = $('#restScreen'), gate = scr.querySelector('.restGate');
      Narrator.stop(); PT.run(false);
      gate.hidden = true; scr.hidden = false;
      $('#restMore').onclick = () => {
        const a = 2 + Math.floor(Math.random() * 7), b = 2 + Math.floor(Math.random() * 7), ans = a * b;
        const opts = [...new Set([ans, ans + 2, ans - 3, ans + 5])].sort(() => Math.random() - .5);
        $('#restQ').textContent = tr('어른이 확인해 주세요') + '  ' + a + ' × ' + b + ' = ?';
        $('#restOpts').innerHTML = opts.map(n => `<button type="button" class="pill" data-n="${n}">${n}</button>`).join('');
        gate.hidden = false;
        $('#restOpts').onclick = e => {
          const bt = e.target.closest('button'); if (!bt) return;
          if (+bt.dataset.n === ans) { PT.extend(10); scr.hidden = true; PT.run(true); res(); }
          else gate.hidden = true;
        };
      };
    });
    /* 한 번에 한 판만 시작한다. 오디오는 비동기 대기 전에 사용자 누름 안에서 연다. */
    let launching = false, running = false;
    const start = async () => {
      if (running) return;
      running = true; launching = false;
      try { await startRun(); } finally { running = false; }
    };
    const startRun = async () => {
      reading = readWanted(); root.classList.toggle('reading', reading); // 끝 화면 '한 번 더'도 같은 모드로 (read_once 는 홈으로 갈 때 지운다)
      if (reading && !VERIFY) {   // 잠자리 탭 '최근 들은'
        try { const k = 'paperTheater.recentRead', id = taleId(), a = JSON.parse(localStorage.getItem(k) || '[]'); localStorage.setItem(k, JSON.stringify([id, ...(Array.isArray(a) ? a : []).filter(x => x !== id)].slice(0, 8))); } catch (err) { /* 기억 못 해도 읽어 준다 */ }
      }
      try { AudioFX.mediaNarration && AudioFX.mediaNarration(reading); } catch (e) { /* 옛 audio.js */ } // 읽어 주기: 화면이 꺼져도 이어지게 <audio> 로 (누름 안에서 열어 둔다)
      AudioFX.unlock();
      if (PT.due()) { PT.run(false); await restShow(); }
      PT.run(true);
      AudioFX.prefetchClips && AudioFX.prefetchClips(); // 이 동화의 녹음을 미리 받아 둔다 (대사가 늦게 나오지 않게)
      $('#startScreen').hidden = true; $('#endScreen').hidden = true;
      clear(); camSnap(500, 280, 1); shutVeil();
      busy = true; $('#finBtn').hidden = true;
      const msg = await run(api);
      PT.run(false);
      busy = true; $('#finBtn').hidden = true;
      await curtain(false);
      $('#endMsg').textContent = tr(msg || ''); // 교훈 문구는 화면에 보이지 않는다(숨김)
      /* 놀이로 직접 끝까지 했을 때만 스티커 1장(처음 한 번)·종이별 1개(하루 1개·앱 모드만은 Entitlements 가 판정).
         읽어 주기·자동 재생·verify 완주는 주지 않는다. '끝내기'로 나간 경우는 여기까지 오지 않는다 */
      let award = null;   // 놀이로 직접 끝까지 한 회차만 {sticker, star}. 읽어 주기·자동 재생·검수는 null = 끝 화면에 아무 연출도 없다
      try {
        if (!reading && !AUTO() && !VERIFY && typeof Entitlements !== 'undefined') {
          await loadStickers();                 // 캐릭터 스티커 세트(tales/stickers.js)를 알아야 다음 그림을 정한다
          award = Entitlements.finishPlay(taleId());
        }
      } catch (e) { /* 이용권 없이도 동화는 끝까지 */ }
      showEnd(award);
    };
    /* 끝 화면 = 책의 뒤표지: 이야기 끝 그림 창 + 만세 + 집·한 번 더 동그라미 둘. 그림은 <id>_back_* → 없으면 _key_* → _tile
       놀이로 끝까지 했으면(award) 오른쪽 아래 받은 것 쟁반에서 스티커·종이별이 날아와 앉는다 (APP_SCREENS_PLAN S7) */
    const showEnd = (award = null) => {
      const es = $('#endScreen'), id = taleId(), base = ROOT_URL + 'assets/thumbs/' + id;
      /* 동그라미 버튼 색 = BACKACCENT[id]. thumbs.js 가 아직 안 왔으면(?endpreview 등) 온 뒤에 다시 칠한다 */
      const paint = () => { const ac = (window.BACKACCENT || {})[id]; if (ac) es.style.setProperty('--accent', ac); else es.style.removeProperty('--accent'); };
      paint(); if (!window.BACKACCENT) heroesP.then(paint);
      const kind = () => (portraitMQ.matches ? 'tall' : 'wide');
      const bi = es.querySelector('.bimg'); let step = 0;
      const chain = () => [base + '_back_' + kind() + '.webp', base + '_key_' + kind() + '.webp', base + '_tile.webp'];
      bi.onerror = () => { step++; const c = chain(); if (step < c.length) { es.classList.add('fallback'); bi.src = c[step]; } else bi.removeAttribute('src'); };
      es.classList.toggle('fallback', false); bi.src = chain()[0];
      es.hidden = false;
      try { AudioFX.sfx('page_turn_big', .8); } catch (e) { /* 소리 없이 */ }
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) confetti($('#endConfetti'), 26);
      if (award) awardShow(es, award);
    };
    try {
      const ep = new URLSearchParams(location.search).get('endpreview');
      if (ep === '1') { $('#startScreen').hidden = true; showEnd(); }
      else if (ep === '2') {   // 보상 연출 미리보기: 실제 finishPlay 로 이번 기기의 보상을 받은 것처럼 끝 화면을 연다(?store=1 이면 종이별도)
        $('#startScreen').hidden = true;
        loadStickers().then(() => { let aw = null; try { aw = Entitlements.finishPlay(taleId()); } catch (e) { /* 보상 없이 */ } showEnd(aw); });
      }
    } catch (e) { /* 미리보기 전용 */ }
    $('#startBtn').onclick = () => { playForced = true; try { sessionStorage.removeItem('read_once'); } catch (e) { /* 무시 */ } start(); };   // 놀이를 직접 고르면 ?read=1 이어도 놀이판
    /* 시작 화면: 제목을 톡 하면 한 번 읽어 준다 (홈 제목 녹음이 있으면 그 목소리, 없으면 브라우저 말하기) */
    {
      let clips = null, busyT = false;
      const loadClips = async () => {
        if (clips) return clips;
        try {
          const txt = await (await fetch(ROOT_URL + 'home_narration_el.js')).text();
          clips = new Function(txt + '; return { ko: NARRATION_CLIPS, en: (typeof NARRATION_CLIPS_EN !== "undefined" ? NARRATION_CLIPS_EN : {}) };')();
        } catch (e) { clips = { ko: {}, en: {} }; }
        return clips;
      };
      const sayTitle = async () => {
        if (busyT || launching || running || $('#startScreen').hidden) return; busyT = true;
        try {
          const c = await loadClips();
          // 제목 녹음을 기다리는 사이 자동 재생이 시작됐으면 이야기 음성을 건드리지 않는다.
          if (launching || running || $('#startScreen').hidden) return;
          const en = typeof englishOn === 'function' && englishOn() ? c.en[title] : null;
          const url = en ? en.c : c.ko[title];
          if (url && typeof url === 'string') { try { Narrator.stop(); } catch (e) { /* 무시 */ } await AudioFX.playUrl(ROOT_URL + url); }
          else await Narrator.speak(tr(title));
        } catch (e) { /* 소리 없이 */ }
        finally { busyT = false; }
      };
      const tt = $('#startScreen .ttl');
      if (tt) { tt.style.cursor = 'pointer'; tt.addEventListener('click', sayTitle); }
      $('#startBtn').addEventListener('click', () => { try { AudioFX.stopNarration(); Narrator.stop(); } catch (e) { /* 무시 */ } });
    }
    /* 자동 재생 안전망: 4초마다 살피고, 25초 동안 아무 변화 없이 누를 곳(손가락·armed 대상)이 있으면 대신 눌러 준다 */
    let netOn = false;
    const autoNet = () => {
      if (netOn) return; netOn = true;
      window.AUTOPLAY = true;
      let lastSig = '', still = 0;
      setInterval(() => {
        const vis = n => { const r = n.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
        const armed = [...document.querySelectorAll('.tap-target.armed')].filter(vis);
        const h = $('#hand'), handUp = h && !h.hidden && vis(h);
        const sig = armed.length + '|' + handUp + '|' + ($('#bubbleText') || {}).textContent + '|' + [...armed].map(n => n.id || n.getAttribute('class')).join(',');
        if (!armed.length && !handUp) { still = 0; lastSig = sig; return; }
        still = sig === lastSig ? still + 4 : 0; lastSig = sig;
        if (still < 25) return;
        still = 0;
        if (armed.length) firePtr(armed[0]);
        else { const r = h.getBoundingClientRect(); const x = r.left + r.width * .5, y = r.top + r.height * .1; const t = document.elementFromPoint(x, y); if (t) t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, pointerId: 1, isPrimary: true })); }
      }, 4000);
    };
    if (AUTO()) autoNet();
    $('#againBtn').onclick = start;
    /* 시작 화면 '읽어 주기': 대본·녹음이 있을 때만 보인다. 누르면 이번 회차를 읽어 주기로 사용자 누름 안에서 바로 시작.
       ?read=1(잠자리 탭)로 들어왔는데 읽을 수 없으면(영어 녹음 없음 등) 보통 시작 화면으로 되돌린다 */
    { const rb = $('#readBtn'); if (rb && readOpt) {
      readAvailable().then(ok => {
        if (ok) { rb.hidden = false; return; }
        rb.hidden = true;
        if (readFirst) { const sb = $('#startBtn'); sb.classList.add('go'); sb.lastChild.textContent = tr('이야기 시작'); }
      }).catch(() => { rb.hidden = true; });
      rb.addEventListener('click', () => {
        if (launching || running) return; launching = true;
        playForced = false; readOnce = true; try { sessionStorage.setItem('read_once', '1'); } catch (e) { /* 이 페이지 안에서는 readOnce 로 */ }
        try { AudioFX.stopNarration(); Narrator.stop(); } catch (e) { /* 무시 */ }
        start();
      });
    } }
    /* 시작 화면 열림: 제목을 한 번 읽어 주고(소리가 막혀 있으면 조용히 넘어간다), 5초 동안 아무 입력이 없으면 큰 버튼 위에 손가락 힌트 */
    {
      const ss = $('#startScreen'), sh = $('#startHint');
      let idle = 0;
      const place = () => {
        const b = $('#startPills .go') || $('#startBtn'), r = b.getBoundingClientRect(), w = ss.getBoundingClientRect();
        sh.style.left = (r.left - w.left + r.width / 2 - 18) + 'px'; sh.style.top = (r.top - w.top - 40) + 'px';
      };
      const hide = () => { sh.hidden = true; clearTimeout(idle); };
      const arm = () => { clearTimeout(idle); if (ss.hidden || launching || running) return; idle = setTimeout(() => { if (ss.hidden || launching || running) return; place(); sh.hidden = false; }, 5000); };
      ss.addEventListener('pointerdown', () => { sh.hidden = true; arm(); });
      arm();
      /* 제목 읽기: 시작 화면이 열리고 0.5초 뒤 한 번 (자동 재생·검수 회차는 제외) */
      setTimeout(() => { if (!AUTO() && !VERIFY && !ss.hidden && !launching && !running) { const tt = $('#startScreen .ttl'); if (tt) tt.click(); } }, 500);
    }
  }

  /* 3D 보상 연출 모듈(engine/reward3d.js)을 끝 화면에서 처음 필요할 때만 불러온다(동화 페이지마다 태그를 넣지 않는다). 실패해도 DOM 연출로 */
  function loadReward3d() {
    if (typeof Reward3D !== 'undefined') return Promise.resolve();
    return new Promise(res => {
      const sc = document.createElement('script');
      sc.src = ROOT_URL + 'engine/reward3d.js?v=20261028pz1';
      sc.onload = sc.onerror = () => res();
      document.head.appendChild(sc);
      setTimeout(res, 2500);
    });
  }
  /* 캐릭터 스티커 세트 자료(tales/stickers.js)를 한 번만 불러온다. 못 불러와도(오프라인 등) 동화는 그대로 끝난다 */
  function loadStickers() {
    if (typeof STICKERS !== 'undefined') return Promise.resolve();
    return new Promise(res => {
      const sc = document.createElement('script');
      sc.src = ROOT_URL + 'tales/stickers.js?v=20261027cast1';
      sc.onload = sc.onerror = () => res();
      document.head.appendChild(sc);
      setTimeout(res, 2500);
    });
  }
  /* 놀이로 끝까지 했을 때의 받은 것 쟁반 (퍼즐 스티커 → 캐릭터 스티커 → 종이별 순서로 0.8초 간격). award = Entitlements.finishPlay 결과 {sticker(아래 조각), sticker2(위 조각), star, cast} */
  function awardShow(es, award) {
    /* 퍼즐 조각 그림: assets/ui/puzzle_layout.json 의 그 묶음(top|bot) 첫 조각 = 물건 모양 조각(pz_<id>_<part>_0.webp). 파일이 없으면 동화 썸네일을 조각 모양(path)으로 오려 만든 그림. 둘 다 없으면 null(옛 네모 카드) */
    const pieceSrc = async part => {
      try {
        const j = await (await fetch(ROOT_URL + 'assets/ui/puzzle_layout.json?v=20261028pz3')).json();
        for (const b of Object.values(j.boards)) {
          const e = b.pieces && b.pieces[taleId()], q = e && (Array.isArray(e[part]) ? e[part][0] : e[part]);
          if (!q) continue;
          if (q.file) return ROOT_URL + 'assets/ui/' + q.file;
          const im = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = ROOT_URL + 'assets/thumbs/' + taleId() + '_tile.webp'; });
          if (!im) return null;
          const c = document.createElement('canvas'); c.width = q.w; c.height = q.h; const g = c.getContext('2d');
          g.clip(new Path2D(q.path));
          const cx = e.col * 512 - q.x, cy = -q.y, k = Math.max(512 / im.naturalWidth, 1024 / im.naturalHeight), dw = im.naturalWidth * k, dh = im.naturalHeight * k;
          g.drawImage(im, cx - 100, cy - 100, 712 + 0 * dw, 1224);          // 돌기 자리까지 그림이 이어지게 넓게 한 번
          g.drawImage(im, cx + (512 - dw) / 2, cy + (1024 - dh) / 2, dw, dh);
          return c.toDataURL('image/png');
        }
      } catch (e) { /* 조각 그림 없이 */ }
      return null;
    };
    const tray = $('#awTray'), book = $('#awBook'), plate = $('#awPlate'), id = taleId();
    const app = typeof Entitlements !== 'undefined' && Entitlements.appMode();
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bal = () => { try { return Entitlements.starBalance(); } catch (e) { return 0; } };
    const need = (typeof Entitlements !== 'undefined' && Entitlements.STAR_NEED) || 5;
    tray.hidden = false; plate.hidden = !app;
    const dots = [...plate.children];
    const paintPlate = n => dots.forEach((d, i) => d.classList.toggle('on', i < n));
    const hole = book.querySelector('.aw-hole');
    /* 이미 받은 스티커는 쟁반 구멍에 붙어 있다 */
    let botSrc = null;                                            // 구멍에 붙는 그림 = 아래 조각(없으면 썸네일)
    const stk = () => `<img alt="" draggable="false" src="${botSrc || ROOT_URL + 'assets/thumbs/' + id + '_tile.webp'}">`;
    const had = !award.sticker && (() => { try { return Entitlements.hasSticker(id); } catch (e) { return false; } })();
    const botP = pieceSrc('bot').then(u => { botSrc = u; if (had && !es.hidden) hole.innerHTML = stk(); });
    if (had) hole.innerHTML = stk();
    const pzSay = k => (k === 'piece2' || (k === 'sticker' && award.sticker2)) ? '그림이 완성됐어요!' : '퍼즐 조각을 받았어요!';
    const after = bal();
    paintPlate(award.star ? Math.min(need, Math.max(0, after - 1)) : Math.min(need, after));
    const fly = (html, cls, from, to, ms) => new Promise(res => {
      if (calm) return res();
      const el = document.createElement('div'); el.className = 'flyer ' + cls; el.innerHTML = html; document.body.appendChild(el);
      const fx = from.left + from.width / 2, fy = from.top + from.height / 2, tx = to.left + to.width / 2, ty = to.top + to.height / 2;
      const sz = el.offsetWidth, at = (x, y, sc, rot) => `translate(${x - sz / 2}px, ${y - sz / 2}px) scale(${sc}) rotate(${rot}deg)`;
      const a = el.animate([
        { transform: at(fx, fy, .2, -18), opacity: 0 },
        { transform: at(fx, fy, 1.12, -8), opacity: 1, offset: .22 },
        { transform: at(fx, fy - 18, 1, 4), opacity: 1, offset: .34 },
        { transform: at(tx, ty, .5, 14), opacity: 1 }
      ], { duration: ms, easing: 'cubic-bezier(.3, .1, .2, 1)', fill: 'forwards' });
      a.onfinish = a.oncancel = () => { el.remove(); res(); };
    });
    const pulse = el => { if (!calm) el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'ease-out' }); };
    const say = t => { try { Narrator.speak(tr(t)); } catch (e) { /* 소리 없이 */ } };
    const sfx = (n, v) => { try { AudioFX.sfx(n, v); } catch (e) { /* 소리 없이 */ } };
    /* 3D 보상 연출: 퍼즐 스티커 → 캐릭터 스티커 → 종이별(받은 것만)이 가운데서 튀어나와 돌고 반짝이며 스티커북 구멍·별 접시로 날아든다.
       효과음·음성은 나타날 때(onAppear), 쟁반 갱신·통통은 착지할 때(onLand). WebGL 이 없거나 모듈을 못 불러오면 false → 기존 DOM 연출 */
    const play3d = async () => {
      try {
        await loadReward3d();
        if (typeof Reward3D === 'undefined' || es.hidden) return false;
        const items = [];
        const wantStar = award.star && app;
        await botP;
        const tile = `${ROOT_URL}assets/thumbs/${id}_tile.webp`;
        if (award.sticker) items.push({ kind: botSrc ? 'piece' : 'sticker', img: botSrc || tile, target: () => hole.getBoundingClientRect() });
        if (award.sticker2) { const top = await pieceSrc('top'); items.push({ kind: top ? 'piece2' : 'sticker', img: top || tile, target: () => hole.getBoundingClientRect() }); }
        if (award.cast) {
          const c = (Entitlements.castOf(id).find(x => x.k === award.cast)) || null;
          if (c) items.push({ kind: 'cast', img: /^(https?:|\/)/.test(c.img) ? c.img : ROOT_URL + c.img, target: () => hole.getBoundingClientRect() });
        }
        if (wantStar) items.push({ kind: 'star', target: () => (dots[Math.max(0, Math.min(need, after) - 1)] || plate).getBoundingClientRect() });
        if (!items.length) return true;
        let said = Promise.resolve(), castShown = false;
        const queue = t => { said = said.then(() => { try { return Narrator.speak(tr(t)); } catch (e) { return null; } }).catch(() => {}); };
        const ok = await Reward3D.play({
          items,
          onAppear: k => {
            if (k === 'star') { sfx(after >= need ? 'tada' : 'sparkle', .7); queue(after >= need ? '다섯 개! 동화를 하나 열 수 있어요' : '종이별 하나 받았어요!'); }
            else { sfx(k === 'piece2' ? 'tada' : 'pop', .8); queue(k === 'cast' ? '새 친구 스티커!' : pzSay(k)); }
          },
          onLand: k => {
            if (k === 'star') { paintPlate(Math.min(need, after)); pulse(plate); if (after >= need) plate.classList.add('full'); }
            else { if (k === 'sticker' || k === 'piece') hole.innerHTML = stk(); pulse(book); }
          }
        });
        if (!ok) return false;
        if (!es.hidden) { if (award.sticker || award.sticker2) hole.innerHTML = stk(); paintPlate(Math.min(need, after)); }
        return true;
      } catch (e) { return false; }
    };
    (async () => {
      await sleep(1000);                                          // '만세!' 1초 뒤
      if (es.hidden) return;
      if (await play3d()) return;                                 // 3D 연출(engine/reward3d.js)로 끝냈으면 아래 DOM 연출은 건너뛴다. 못 하면(false) 그대로 아래로
      await botP;
      if (award.sticker || award.sticker2) {
        await fly(stk(), 'stk', es.querySelector('.bwin').getBoundingClientRect(), hole.getBoundingClientRect(), 1300);
        hole.innerHTML = stk(); pulse(book);
        sfx('pop', .8);                                           // 스티커가 붙는 뽁 (sounds/CREDITS.md)
        say(pzSay('sticker'));
        await sleep(900);
      }
      if (award.cast && !es.hidden) {                               // 이번에 받은 캐릭터 스티커: 그림이 날아가 스티커북 구멍으로
        if (award.sticker || award.sticker2) await sleep(800);
        const c = (Entitlements.castOf(id).find(x => x.k === award.cast)) || null;
        if (c) {
          const src = /^(https?:|\/)/.test(c.img) ? c.img : ROOT_URL + c.img;
          await fly(`<img alt="" draggable="false" src="${src}">`, 'cast', es.querySelector('.bwin').getBoundingClientRect(), hole.getBoundingClientRect(), 1300);
          pulse(book);
          sfx('pop', .8);
          say('새 친구 스티커!');
          await sleep(900);
        }
      }
      if (award.star && app && !es.hidden) {
        if (award.sticker || award.sticker2 || award.cast) await sleep(800);
        const slot = dots[Math.max(0, Math.min(need, after) - 1)];
        await fly(uiPic('star_one'), 'star', (award.sticker || award.sticker2 || award.cast) ? book.getBoundingClientRect() : es.querySelector('.bwin').getBoundingClientRect(), slot.getBoundingClientRect(), 1100);
        paintPlate(Math.min(need, after)); pulse(plate);
        sfx(after >= need ? 'tada' : 'sparkle', .7);               // 별 반짝(Pixabay Magic Twinkle), 다섯 개째는 짧은 팡파르(Kenney CC0)
        say(after >= need ? '다섯 개! 동화를 하나 열 수 있어요' : '종이별 하나 받았어요!');
        if (after >= need) plate.classList.add('full');
      }
    })();
  }
  /* 조작 대기 동안만 입력을 받는다 */
  const input = fn => async (...a) => { busy = false; try { return await fn(...a); } finally { busy = true; } };

  /* ---------- 노래 ----------
     곡은 '음:박' 목록 문자열. 예) 'C4:1 C4:1 G4:1 R:1' (R 은 쉼표). 박 길이는 beat(초)로 정한다. */
  const semi = n => { const m = /^([A-G])([#b]?)(\d)$/.exec(n); return {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] - 4) * 12; }; // C4 = 0
  const hz = n => 261.6256 * Math.pow(2, semi(n) / 12);
  const parseSong = str => str.trim().split(/\s+/).map(t => { const [n, b] = t.split(':'); return [n, +(b || 1)]; });
  const TIMBRE = {
    box: (f, d, when = 0, vol = .2) => { tone(f, d * 1.4, { type: 'sine', vol, when }); tone(f * 3, d * .5, { type: 'sine', vol: vol * .22, when }); },
    xylo: (f, d, when = 0, vol = .2) => { tone(f, d * .8, { type: 'triangle', vol, when }); tone(f * 4, d * .25, { type: 'sine', vol: vol * .3, when }); },
    bell: (f, d, when = 0, vol = .2) => { tone(f, d * 1.8, { type: 'sine', vol, when }); tone(f * 2.76, d * .9, { type: 'sine', vol: vol * .2, when }); },
    horn: (f, d, when = 0, vol = .14) => { tone(f, d, { type: 'sawtooth', vol: vol * .6, when }); tone(f, d, { type: 'triangle', vol, when }); },
    drum: (f, d, when = 0, vol = .3) => { tone([f * 1.6, f * .5], .22, { type: 'sine', vol, when }); },
  };
  const timbre = name => TIMBRE[name] || TIMBRE.xylo;
  async function playMelody(notes, { beat = .5, voice, onNote } = {}) {
    for (let i = 0; i < notes.length; i++) {
      const [n, b] = notes[i], dur = b * beat;
      if (n !== 'R') { voice && voice(n, dur, i); onNote && onNote(i, n, dur); }
      await sleep(dur * 1000);
    }
  }
  /* 기다려 주는 박자 누르기: 이번 음의 주인(targetFor)이 반짝이며 기다린다. 누르면 그 음이 나고 넘어간다.
     wait 안에 안 눌러도 곡이 스스로 그 음을 연주하고 넘어간다 — 틀리는 일도 실패도 없다. others 는 눌러도 소리만 나는 소품. */
  const followMelody = input(async (notes, { beat = .5, targetFor, voice, onNote, wait = 4500, others = [] } = {}) => {
    const offs = others.map(t => { arm(t.el, true); const on = e => { e.stopPropagation(); if (!busy) t.onTap(); }; t.el.addEventListener('pointerdown', on); return () => { t.el.removeEventListener('pointerdown', on); arm(t.el, false); }; });
    let first = true;
    for (let i = 0; i < notes.length; i++) {
      const [n, b] = notes[i], dur = b * beat;
      if (n === 'R') { await sleep(dur * 1000); continue; }
      const target = targetFor(i, n);
      await new Promise(res => {
        let done = false, th = null;
        arm(target, true);
        const bob = target.animate([{ translate: '0 0' }, { translate: '0 -12px' }, { translate: '0 0' }], { duration: 760, iterations: Infinity, easing: 'ease-in-out' });
        const fin = () => { if (done) return; done = true; clearTimeout(tw); clearTimeout(th); bob.cancel(); target.removeEventListener('pointerdown', on); arm(target, false); hideHand(); res(); };
        const on = e => { e.stopPropagation(); if (busy) return; fin(); };
        const tw = setTimeout(fin, AUTO() ? 700 : first ? wait + 3000 : wait);
        if (first && !AUTO()) th = setTimeout(() => !done && showHand(target, 'tap'), 2200);
        target.addEventListener('pointerdown', on);
      });
      first = false;
      voice && voice(n, dur, i); onNote && onNote(i, n, dur);
      await sleep(Math.max(200, Math.min(dur * 1000, 420)));
    }
    offs.forEach(f => f());
  });
  /* 꾹 누르기 노래: target 을 누르고 있는 동안 곡이 한 음씩 흘러간다. 떼면 기다리고, 톡톡 쳐도 조금씩 나아가며,
     wait 동안 아무도 안 누르면 곡이 스스로 끝까지 흘러간다. 끝나면 돌아온다 */
  const holdMelody = input((notes, { beat = .6, target, voice, onNote, wait = 6000, tapStart = false } = {}) => new Promise(res => {
    const starts = []; let acc = 0;
    notes.forEach(([n, b]) => { starts.push(acc); acc += b * beat * 1000; });
    let held = 0, idx = 0, down = false, auto = AUTO(), idle = 0, done = false;
    arm(target, true);
    const bob = target.animate([{ translate: '0 0' }, { translate: '0 -10px' }, { translate: '0 0' }], { duration: 900, iterations: Infinity, easing: 'ease-in-out' });
    const hand = AUTO() ? 0 : setTimeout(() => !done && showHand(target, tapStart ? 'tap' : 'hold'), 2500);
    const fin = () => { if (done) return; done = true; clearInterval(tm); clearTimeout(hand); bob.cancel(); target.removeEventListener('pointerdown', dn); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); arm(target, false); hideHand(); res(); };
    const dn = e => { e.stopPropagation(); if (busy || done) return; down = true; idle = 0; hideHand(); held += 250; if (tapStart) auto = true; };
    const up = () => { down = false; };
    const tm = setInterval(() => {
      if (down || auto) held += 50; else idle += 50;
      if (!auto && idle >= wait) auto = true;
      while (idx < notes.length && held >= starts[idx]) {
        const [n, b] = notes[idx];
        if (n !== 'R') { voice && voice(n, b * beat, idx); onNote && onNote(idx, n, b * beat); }
        idx++;
      }
      if (idx >= notes.length && held >= acc) fin();
    }, 50);
    target.addEventListener('pointerdown', dn);
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  }));
  /* 가사 줄: 음절마다 불이 켜진다. set(k) = k번째 음절까지 칠한다 (공백은 세지 않는다) */
  function lyric(text, { y = 74, size = 46, on = '#A93B32', off = '#3F6B4F' } = {}) {
    const t = el('text', { x: 500, y, 'text-anchor': 'middle', 'font-size': size, 'font-weight': 800, 'font-family': "'Pretendard Variable', Pretendard, sans-serif", 'paint-order': 'stroke', stroke: '#fff', 'stroke-width': 9 }, fxL);
    const spans = [];
    if (Array.isArray(text)) text.forEach(sy => { const sp = el('tspan', { fill: off }, t); sp.textContent = sy; spans.push(sp); }); // 영어: 음절 조각을 그대로 (한 음 = 한 조각)
    else text.split(' ').forEach((w, wi) => [...w].forEach((ch, ci) => { const sp = el('tspan', { fill: off }, t); sp.textContent = (wi && !ci ? ' ' : '') + ch; spans.push(sp); }));
    return { set(k) { spans.forEach((sp, i) => sp.setAttribute('fill', i <= k ? on : off)); }, clear() { t.remove(); }, count: spans.length };
  }

  /* ---------- 읽어 주기 (docs/READ_MODE.md, 2026-10-22 1단계) ----------
     조작·배움 놀이 없이 같은 무대에서 그림책처럼 읽어 준다. 동화 js 는 run(T) 첫머리(배우를 만든 뒤)에서
       if (T.reading()) return T.readPlay(READ_ACTS);
     로 갈라지고, READ_ACTS = { 동사이름: (...인자) => … } 를 넘긴다. 대본은 tales/<id>/read_script_el.json(영어 _en),
     녹음 맵은 read_narration_el.js(영어 read_narration_el_en.js). 들어오는 길: 시작 화면 '읽어 주기' 단추(sessionStorage 'read_once'),
     주소 ?read=1. 동화가 mount({ read: true }) 로 알려야 단추가 보이고 읽기로 갈라진다(아직 READ_ACTS 가 없는 동화는 그대로 놀이판). */
  let readOpt = false, reading = false, readInstant = false, readOnce = false;
  const READ_GAP = 700, READ_SCENE_END = 1500;
  const READ_Q = (() => { try { return new URLSearchParams(location.search).get('read') === '1'; } catch (e) { return false; } })();
  let playForced = false;
  const readWanted = () => { if (!readOpt || playForced) return false; if (READ_Q || readOnce) return true; try { return sessionStorage.getItem('read_once') === '1'; } catch (e) { return false; } };
  /* 홈으로 가면 모드는 남지 않는다 (동화마다 그때그때 고른다) */
  try { addEventListener('pagehide', () => { try { sessionStorage.removeItem('read_once'); } catch (e) { /* 무시 */ } }); } catch (e) { /* 무시 */ }
  const fileOK = async f => {
    try {
      let r = await fetch(f, { method: 'HEAD', cache: 'no-cache' });
      if (r.status === 405 || r.status === 501) r = await fetch(f, { cache: 'no-cache' });
      return r.ok;
    } catch (e) { return false; }
  };
  /* 단추를 보일지: 한국어 = 대본 + 녹음 맵, 영어 = 영어 대본 + 영어 녹음 맵(영어 읽기 녹음이 생기면 저절로 보인다) */
  async function readAvailable() {
    if (!readOpt) return false;
    if (typeof englishOn === 'function' && englishOn()) return (await fileOK('read_script_en.json')) && fileOK('read_narration_el_en.js');
    return (await fileOK('read_script_el.json')) && fileOK('read_narration_el.js');
  }
  /* 읽기 녹음 맵을 받아 NARRATION_CLIPS(_EN) 에 합친다 (시작 화면 home_narration_el.js 로더와 같은 방식) */
  async function loadReadClips(en) {
    const f = en ? 'read_narration_el_en.js' : 'read_narration_el.js';
    try {
      const r = await fetch(f, { cache: 'no-cache' });
      if (!r.ok) return false;
      const txt = await r.text();
      if (typeof NARRATION_CLIPS === 'undefined') window.NARRATION_CLIPS = {};
      new Function(txt)();
      return true;
    } catch (e) { console.warn('[read] 녹음 맵을 읽지 못함', f, e); return false; }
  }
  async function readPlay(acts = {}) {
    /* T.readPlay(...) 로 불리면 this = 동화가 감싼 T (세로 화면 보정 등으로 sceneCard·say 를 덮어쓴 것)를 그대로 쓴다 */
    const W = this && typeof this.sceneCard === 'function' ? this : api;
    const en = typeof englishOn === 'function' && englishOn();
    const getJSON = async f => { try { const r = await fetch(f, { cache: 'no-cache' }); return r.ok ? await r.json() : null; } catch (e) { return null; } };
    const sc = (en && await getJSON('read_script_en.json')) || await getJSON('read_script_el.json');
    if (!sc || !Array.isArray(sc.scenes)) { console.warn('[read] 대본이 없어 끝냅니다'); await W.curtain(true); return ''; }
    /* 회전 분기(rounds 가 있는 대본만): scenes 중 variant 가 있는 장면은 그 회전(round)에 뽑힌 결과일 때만 남긴다.
       뽑기 = 중복 없이 rounds 개 — 주소 ?mix=pumpkin,bat 이면 고정, 아니면 지난번에 안 본 것(localStorage 'read_seen_<tale>')을 먼저 섞어서 */
    if (sc.rounds && sc.variants && Array.isArray(sc.variants.keys)) {
      const keys = sc.variants.keys, n = sc.rounds, sk = 'read_seen_' + (sc.tale || taleId());
      let chosen = [];
      try { chosen = (new URLSearchParams(location.search).get('mix') || '').split(',').filter(k => keys.includes(k)).slice(0, n); } catch (e) { /* 고정 없음 */ }
      if (chosen.length < n) {
        let seen = []; try { seen = JSON.parse(localStorage.getItem(sk) || '[]'); } catch (e) { /* 기록 없음 */ }
        const shuf = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
        const pool = [...shuf(keys.filter(k => !seen.includes(k) && !chosen.includes(k))), ...shuf(keys.filter(k => seen.includes(k) && !chosen.includes(k)))];
        chosen = [...chosen, ...pool].slice(0, n);
      }
      try { const seen = JSON.parse(localStorage.getItem(sk) || '[]'); const next = [...seen.filter(k => !chosen.includes(k)), ...chosen]; localStorage.setItem(sk, JSON.stringify(next.slice(-keys.length))); } catch (e) { /* 기록 없이 */ }
      sc.scenes = sc.scenes.filter(x => !x.variant || x.variant === chosen[(x.round || 1) - 1]);
      sc.chosen = chosen; console.log('[read] 회전 결과:', chosen.join(', '));
    }
    await loadReadClips(en);
    try { AudioFX.prefetchClips && AudioFX.prefetchClips(); } catch (e) { /* 미리 받기 없이 */ }
    /* 클립 키 확인: 녹음이 없는 줄은 건너뛴다(브라우저 TTS 로 읽지 않는다, 2026-10-27 사용자 결정) → 콘솔과 window.__READ 에 남긴다 */
    const has = t => {
      try {
        if (en) return !!(NARRATION_CLIPS_EN[t] && NARRATION_CLIPS_EN[t].c);
        return typeof NARRATION_CLIPS !== 'undefined' && !!NARRATION_CLIPS[t];
      } catch (e) { return false; }
    };
    const log = window.__READ = { chosen: sc.chosen, tale: sc.tale, lang: en ? 'en' : 'ko', scenes: sc.scenes.length, lines: 0, missing: [], unknown: [], said: 0, done: false };
    sc.scenes.forEach(s => (s.lines || []).forEach(l => { log.lines++; if (!has(l.text)) log.missing.push(l.text); }));
    console.log(`[read] ${sc.tale} ${log.lang}: ${log.scenes}장면 ${log.lines}줄, 클립 없음 ${log.missing.length}`);
    log.missing.forEach(t => console.warn('[read] 클립 없음(건너뜀):', t));
    /* 동사 'name:a:b' → acts.name('a', 'b'). 모르는 동사는 경고만, 실패도 경고만 (대본이 코드보다 먼저 나와도 깨지지 않게) */
    const verb = v => {
      const [name, ...args] = String(v).split(':');
      const f = acts[name];
      if (typeof f !== 'function') {
        if (!log.unknown.includes(v)) { log.unknown.push(v); console.warn('[read] 모르는 동사:', v); }
        return null;
      }
      try {
        const r = f(...args);
        return r && typeof r.then === 'function' ? r.catch(e => console.warn('[read] 동사 실패:', v, e)) : null;
      } catch (e) { console.warn('[read] 동사 실패:', v, e); return null; }
    };
    /* ---- 멈추지 않게 (2026-10-23, 화면 끄고 잘 때 듣는 용도) ----
       ① 기다림마다 시간 제한: 동사 8초, 장면 넘김 4초, 대사는 '녹음 길이 + 3초'(길이를 모르면 글자 수로). 넘기면 경고하고 다음으로.
       ② 화면이 안 보이면(document.hidden: 화면 꺼짐·탭 가림) rAF 가 멈추고 타이머는 1초 이상으로 늘어진다 →
          끝이 있는 애니메이션은 바로 끝내고, 동사는 기다리지 않고, 줄 사이 쉼도 건너뛰어 오디오 ended 만으로 이어 간다.
       ③ 잠금 화면 '일시정지'(Media Session)·쉬는 화면 동안은 시간 제한을 멈춘다 */
    log.timeouts = [];
    let held = false, unhold = null;
    const resting = () => { const r = $('#restScreen'); return !!(r && !r.hidden); };
    const waitHeld = () => held ? new Promise(r => { unhold = r; }) : null;
    const hidden = () => document.hidden;
    const finishAnims = () => {
      try { document.getAnimations().forEach(a => { const t = a.effect && a.effect.getComputedTiming(); if (t && isFinite(t.endTime) && a.playState === 'running') a.finish(); }); } catch (e) { /* 무시 */ }
    };
    /* p 를 기다리되 limit() ms(늘어날 수 있음) 를 넘기면 경고 후 놓아 준다 */
    const guard = (p, what, limit) => new Promise(res => {
      if (!p || typeof p.then !== 'function') return res(false);
      let over = false;
      const t0 = Date.now();
      let extra = 0, last = t0;
      const done = late => { if (over) return; over = true; clearInterval(iv); document.removeEventListener('visibilitychange', tick); res(late); };
      const tick = () => {
        if (over) return;
        const now = Date.now();
        if (held || resting()) extra += now - last;   // 일시정지·쉬는 화면 동안은 시계를 멈춘다
        last = now;
        if (hidden()) finishAnims();
        if (now - t0 - extra > limit(t0)) {
          console.warn('[read] 시간 제한으로 넘어감:', what);
          log.timeouts.push(what);
          done(true);
        }
      };
      const iv = setInterval(tick, 500);
      document.addEventListener('visibilitychange', tick);
      p.then(() => done(false), () => done(false));
    });
    const VERB_MS = 8000, CARD_MS = 4000;
    const runAll = async list => {
      for (const v of list || []) {
        const r = verb(v);
        if (!r) continue;
        if (hidden()) { finishAnims(); continue; }   // 안 보일 때: 기다리지 않는다 (화면은 다시 보일 때 다음 장면 차리기로 맞춰진다)
        await guard(r, '동사 ' + v, () => VERB_MS);
      }
    };
    /* 대사: 녹음 조각이 시작되면 그 길이 + 3초, 길이를 모르면(브라우저 TTS·받는 중) 글자 수 기반 */
    const sayGuarded = (text, simultaneous = false) => {
      const est = 8000 + String(text).length * 250;
      const n0 = AudioFX.narInfo ? AudioFX.narInfo().n : 0;
      const p = W.say(text, { simultaneous, recordedOnly: true }); // 녹음 없는 줄은 바로 건너뛴다(시간 제한은 그대로)
      return guard(p, '대사 ' + String(text).slice(0, 20), t0 => {
        const ni = AudioFX.narInfo ? AudioFX.narInfo() : null;
        if (ni && ni.n !== n0) return Math.max(0, ni.t - t0) + (ni.dur ? ni.dur * 1000 + 3000 : est);
        return est;
      }).then(late => { if (late) { try { Narrator.stop(); } catch (e) { /* 무시 */ } } });
    };
    const gap = ms => hidden() ? null : sleep(ms);
    /* 잠금 화면·알림 센터에 동화 제목·표지, 일시정지/재생 (Media Session: 크롬·사파리 지원) */
    const ms = 'mediaSession' in navigator ? navigator.mediaSession : null;
    if (ms) {
      try {
        const ttl = ($('#startScreen .ttl') && $('#startScreen .ttl').textContent.trim()) || document.title;
        const art = ROOT_URL + 'assets/thumbs/' + taleId() + '_tile.webp';
        if (typeof MediaMetadata === 'function') ms.metadata = new MediaMetadata({ title: ttl, artist: tr('종이 동화극장 · 읽어 주기'), artwork: [{ src: new URL(art, location.href).href, sizes: '512x512', type: 'image/webp' }] });
        ms.playbackState = 'playing';
        ms.setActionHandler('pause', () => { held = true; AudioFX.narHold && AudioFX.narHold(true); ms.playbackState = 'paused'; });
        ms.setActionHandler('play', () => { held = false; AudioFX.narHold && AudioFX.narHold(false); ms.playbackState = 'playing'; if (unhold) { const r = unhold; unhold = null; r(); } });
      } catch (e) { /* Media Session 없이 */ }
    }
    try {
      for (let i = 0; i < sc.scenes.length; i++) {
        const s = sc.scenes[i], pend = [];
        /* 장면 차리기: 책장이 넘어가는(덮인) 동안 놓기만 한다. 동사는 T.readInstant() 가 참이면 움직임 없이 바로 놓는다 */
        let setDone = false;
        const setUp = () => {
          if (setDone) return; setDone = true;
          readInstant = true;
          try {
            if (s.set != null && typeof acts.set === 'function') { const r = verb('set:' + s.set); if (r) pend.push(r); }
            for (const v of s.enter || []) { const r = verb(v); if (r) pend.push(r); }
          } finally { readInstant = false; }
        };
        await waitHeld();
        /* 앞 장면에서 아직 달리는 움직임(차 행렬 등)이 있으면 acts.settle() 로 먼저 끝낸다. 장면 넘김(4초 제한) 안에서 기다리면
           제한에 걸려 장면이 넘김 없이 바뀌고 새 장면 대사가 시작된 뒤에야 넘김이 늦게 돌아간다(2026-10-24 빨간 자동차) */
        if (i > 0 && typeof acts.settle === 'function' && !hidden()) {
          let sp = null; try { sp = acts.settle(); } catch (e) { console.warn('[read] settle 실패', e); }
          if (sp) await guard(Promise.resolve(sp), '장면 마무리 ' + (s.card || i), () => VERB_MS);
        }
        if (i === 0) { setUp(); await gap(300); await guard(W.curtain(true), '막 열기', () => CARD_MS); }
        else await guard(W.sceneCard(s.card || '', setUp), '장면 넘김 ' + (s.card || i), () => CARD_MS);
        setUp(); // 시간 제한으로 넘김이 끝나지 않았어도 장면은 차린다
        if (pend.length && !hidden()) await guard(Promise.all(pend), '장면 차리기 ' + (s.card || i), () => VERB_MS);
        const lines = s.lines || [];
        for (let j = 0; j < lines.length; j++) {
          const l = lines[j];
          await waitHeld();
          await runAll(l.before);
          /* l.voice: 합창과 글자가 같은 한 사람 줄은 VOICE_LINES 키로 먼저 재생(NARRATION_CLIPS 키 충돌 피함). 키가 없으면 보통 대사 */
          const vu = l.voice && Narrator.voiceLine ? Narrator.voiceLine(l.voice) : null;
          if (vu && AudioFX.voice) await guard(Promise.resolve(AudioFX.voice(vu)), '목소리 ' + l.voice, () => 8000);
          else await sayGuarded(l.text, l.simultaneous === true);
          log.said++;
          await runAll(l.after);
          await gap(j === lines.length - 1 ? READ_SCENE_END : READ_GAP);
        }
      }
    } finally {
      if (ms) { try { ms.playbackState = 'none'; ms.setActionHandler('pause', null); ms.setActionHandler('play', null); } catch (e) { /* 무시 */ } }
    }
    log.done = true;
    return sc.moral || '';
  }

  const finale = () => { const b = $('#finBtn'); if (b) b.hidden = false; };

  const api = {
    finale, hz, semi, parseSong, timbre, playMelody, followMelody, holdMelody, lyric,
    cardSpeed: k => { cardK = k; }, el, paper, anim, actor, sleep, say, ask, director, tone, josa, tr, camTo, camSnap, camWide, curtain, sceneCard, cut, cutImage, preload, shake, confetti, pop, clear,
    get camera() { return { ...camState }; },
    viewWidth,
    tap: autoInput('tap', tap), mash: autoInput('mash', mash), choose: autoInput('choose', choose), swipe: autoInput('swipe', swipe), hold: autoInput('hold', hold), fill: autoInput('fill', fill), free: autoInput('free', free),
    autoplay: AUTO, autoDo,
    reading: () => reading, readPlay, readInstant: () => readInstant,
    get bg() { return bgL; }, get world() { return world; }, get fx() { return fxL; }, get root() { return root; },
  };
  return { mount, api };
})();
