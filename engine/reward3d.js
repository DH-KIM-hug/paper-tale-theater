/* 보상 3D 연출 (수집 카드 뽑기처럼): 동화를 놀이로 끝냈을 때 받은 스티커·캐릭터 스티커·종이별이
   화면 가운데에 하나씩 튀어나와 빙글 돌고 반짝이 입자가 터진 뒤, 지정한 목표(스티커북 버튼 등)로 날아 들어간다.
   - 독립 모듈: 전역 Reward3D 하나. tale.js 등 다른 파일에 의존하지 않는다.
   - three.js 는 engine/vendor/ 의 저장소 사본을 처음 play() 할 때 동적 import() 로 불러온다(CDN 없음·오프라인 OK).
     three.module.min.js 가 three.core.min.js 를 상대 경로로 import 하므로 vendor 폴더에 둘이 같이 있어야 한다.
   - 재료 원칙(CLAUDE.md §7): 카드·별은 전부 무광 MeshBasicMaterial. 광택·환경맵·하이라이트 없음.
     두께는 같은 모양 종이 조각을 겹쳐 만든 단면(크림), 그림자는 웜 다크. '반짝'은 주변 입자와 후광으로만.
   - 퍼즐 조각(kind 'piece'·'piece2')은 조각 그림의 알파 모양 그대로 카드가 된다(직소 모양, 테두리 없음).
   - 사용: Reward3D.play({ items:[{kind:'sticker'|'piece'(아래 조각)|'piece2'(위 조각)|'cast'|'star', img:'경로', target:()=>DOMRect}], onAppear(kind), onLand(kind), onDone() })
       → Promise<boolean>  (3D 로 보여 줬으면 true, WebGL/모듈이 없어 못 했으면 false = 호출한 쪽이 기존 DOM 연출로)
     kind 'star' 는 img 없이 별 모양 종이. 소리는 콜백에서 호출하는 쪽이 낸다.
   - prefers-reduced-motion: 회전·입자 없이 페이드만(날아가지도 않고 제자리에서 사라짐). */
(function () {
  'use strict';
  const BASE = (() => {
    try {
      const s = document.currentScript || [...document.scripts].find(x => /reward3d\.js/.test(x.src));
      return new URL('./', s.src).href;
    } catch (e) { return ''; }
  })();

  const PAL = ['#E8703A', '#D9A94E', '#A93B32', '#3F6B4F', '#3E7CB1', '#7B4F8C', '#F2B366', '#F6ECD8'];
  const CREAM = '#F5EFE9', CUT = '#E6D9BE', GOLD = '#D9A94E', ORANGE = '#E8703A', WARM_DARK = '#2E241C';
  const TEX_MAX = 512;
  const LIMITS = { confetti: 120, pstars: 36, sparkles: 36 };   // 입자 수 상한(동시에 살아 있는 수)
  const T_SPIN = 1.1, T_APPEAR_GAP = 0.75, T_HOLD = 0.5, T_FLY = 0.75, T_FLY_GAP = 0.12;

  let threeP = null, active = false;
  const loadThree = url => threeP || (threeP = import(url).catch(e => { threeP = null; throw e; }));

  const rnd = (a, b) => a + Math.random() * (b - a);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const easeOut3 = u => 1 - Math.pow(1 - u, 3);
  const smooth = u => u * u * (3 - 2 * u);
  const spring = u => u <= 0 ? 0 : 1 - Math.exp(-7 * u) * Math.cos(11 * u);   // 0→1, 약 10% 넘쳤다 자리 잡음

  function loadImage(src) {
    return new Promise(res => {
      if (!src) return res(null);
      const im = new Image(); let done = false;
      const fin = v => { if (!done) { done = true; res(v); } };
      im.onload = () => fin(im); im.onerror = () => fin(null);
      setTimeout(() => fin(null), 5000);
      im.src = src;
    });
  }
  const mkCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(2, Math.round(w)); c.height = Math.max(2, Math.round(h)); return c; };
  function starPath(ctx, cx, cy, R, r, n = 5, rot = -Math.PI / 2) {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, d = i % 2 ? r : R; ctx[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * d, cy + Math.sin(a) * d); }
    ctx.closePath();
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function grain(ctx, w, h, mask) {   // 고운 종이결: 아주 옅은 점·섬유 (모양 안쪽에만)
    ctx.save(); ctx.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < w * h / 380; i++) { ctx.fillStyle = Math.random() < .5 ? 'rgba(120,100,70,.05)' : 'rgba(255,255,255,.07)'; ctx.fillRect(Math.random() * w, Math.random() * h, rnd(1, 3), rnd(1, 2)); }
    ctx.restore();
  }

  /* 그림 → {sil(크림 실루엣), face(앞면), back(뒷면 별 새김), aspect}. 투명 그림이면 알파를 부풀려 오려 낸 스티커 테두리, 아니면 둥근 모서리 카드 */
  function buildFaces(img, exact) {
    const pad = exact ? 6 : 22;   // exact(퍼즐 조각): 그림 알파 그대로 오린다 — 부풀린 스티커 테두리·흰 테두리 없음
    let iw = img ? img.naturalWidth : 1, ih = img ? img.naturalHeight : 1;
    if (!img) { iw = 3; ih = 4; }
    const k = (TEX_MAX - pad * 2) / Math.max(iw, ih);
    const dw = Math.round(iw * k), dh = Math.round(ih * k), W = dw + pad * 2, H = dh + pad * 2;
    let cutout = false, art = null;
    if (img) {
      art = mkCanvas(dw, dh); const a = art.getContext('2d'); a.drawImage(img, 0, 0, dw, dh);
      const d = a.getImageData(0, 0, dw, dh).data; let clear = 0;
      for (let i = 3; i < d.length; i += 4 * 7) if (d[i] < 40) clear++;
      cutout = exact || clear / (d.length / 28) > 0.04;
    }
    const sil = mkCanvas(W, H), s = sil.getContext('2d');
    if (cutout) {
      const m = mkCanvas(W, H), mc = m.getContext('2d');
      mc.drawImage(art, pad, pad); mc.globalCompositeOperation = 'source-in'; mc.fillStyle = CREAM; mc.fillRect(0, 0, W, H);
      if (!exact) for (const r of [pad * .45, pad * .8]) for (let i = 0; i < 28; i++) { const an = i / 28 * Math.PI * 2; s.drawImage(m, Math.cos(an) * r, Math.sin(an) * r); }
      s.drawImage(m, 0, 0);
    } else {
      s.fillStyle = CREAM; roundRect(s, 2, 2, W - 4, H - 4, Math.min(W, H) * .1); s.fill();
    }
    grain(s, W, H);
    const face = mkCanvas(W, H), f = face.getContext('2d');
    if (!(exact && art)) f.drawImage(sil, 0, 0);
    if (art) {
      if (cutout) f.drawImage(art, pad, pad);
      else { f.save(); roundRect(f, pad * .7, pad * .7, W - pad * 1.4, H - pad * 1.4, Math.min(W, H) * .06); f.clip(); f.drawImage(art, pad * .7, pad * .7, W - pad * 1.4, H - pad * 1.4); f.restore(); }
    } else { f.fillStyle = CUT; starPath(f, W / 2, H / 2, Math.min(W, H) * .3, Math.min(W, H) * .13); f.fill(); }
    const back = mkCanvas(W, H), b = back.getContext('2d');
    b.drawImage(sil, 0, 0);
    b.save(); b.globalCompositeOperation = 'source-atop';
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .24;
    b.fillStyle = 'rgba(46,36,28,.10)'; starPath(b, cx + 3, cy + 4, R, R * .45); b.fill();   // 새김 안쪽 그림자(웜 다크)
    b.fillStyle = '#E3D5B6'; starPath(b, cx, cy, R, R * .45); b.fill();
    b.fillStyle = '#EBDFC6'; starPath(b, cx, cy + 1, R * .92, R * .41); b.fill();
    for (const [dx, dy, q] of [[-.62, -.5, .09], [.64, .45, .07], [.58, -.58, .06], [-.6, .55, .06]]) {
      b.fillStyle = '#E3D5B6'; starPath(b, cx + dx * W * .5, cy + dy * H * .5, Math.min(W, H) * q, Math.min(W, H) * q * .45); b.fill();
    }
    b.restore();
    return { sil, face, back, aspect: W / H };
  }

  function glowTex(inner, outer) {
    const c = mkCanvas(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner); gr.addColorStop(.35, outer); gr.addColorStop(1, 'rgba(0,0,0,0)');   // 후광은 빛 번짐(종이 조각이 아님)이라 그라데이션 허용
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c;
  }
  function sparkTex() {
    const c = mkCanvas(128, 128), g = c.getContext('2d');
    g.translate(64, 64); g.fillStyle = '#fff';
    g.beginPath(); g.moveTo(0, -62); g.quadraticCurveTo(5, -5, 62, 0); g.quadraticCurveTo(5, 5, 0, 62); g.quadraticCurveTo(-5, 5, -62, 0); g.quadraticCurveTo(-5, -5, 0, -62); g.fill();
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, 22); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(-30, -30, 60, 60);
    return c;
  }
  function paperStarTex() {
    const c = mkCanvas(64, 64), g = c.getContext('2d'); g.fillStyle = '#fff'; starPath(g, 32, 33, 30, 13); g.fill(); return c;
  }

  async function play(opts) {
    opts = opts || {};
    const items = (opts.items || []).slice(0, 3);
    if (!items.length) { try { opts.onDone && opts.onDone(); } catch (e) {} return true; }
    if (active) return false;
    active = true;
    const calm = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || opts.calm === true;
    let THREE, renderer, overlay, dim, raf = 0, disposed = false;
    const disposables = [];
    const track = o => (disposables.push(o), o);
    const cleanup = () => {
      if (disposed) return; disposed = true; cancelAnimationFrame(raf);
      try { window.removeEventListener('resize', onResize); } catch (e) {}
      disposables.forEach(o => { try { o.dispose && o.dispose(); } catch (e) {} });
      try { if (renderer) { renderer.dispose(); renderer.forceContextLoss(); } } catch (e) {}
      try { overlay && overlay.remove(); } catch (e) {}
      active = false;
    };
    let onResize = () => {};
    try {
      THREE = await loadThree(opts.threeUrl || BASE + 'vendor/three.module.min.js');
      const imgs = await Promise.all(items.map(it => it.kind === 'star' ? null : loadImage(it.img)));

      overlay = document.createElement('div');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483000;touch-action:none;-webkit-tap-highlight-color:transparent;';
      dim = document.createElement('div');
      dim.style.cssText = 'position:absolute;inset:0;background:rgba(46,36,28,.58);opacity:0;transition:opacity .3s ease-out;';
      overlay.appendChild(dim);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance', premultipliedAlpha: true });
      renderer.setClearColor(0x000000, 0);
      const cv = renderer.domElement; cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
      overlay.appendChild(cv); document.body.appendChild(overlay);
      requestAnimationFrame(() => { dim && (dim.style.opacity = '1'); });

      let W = 0, H = 0, S = 200;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 10, 20000);
      const layout = n => { const gap = S * .98; return i => (i - (n - 1) / 2) * gap; };
      onResize = () => {
        W = Math.max(1, innerWidth); H = Math.max(1, innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setSize(W, H, false);
        camera.aspect = W / H; camera.position.set(0, 0, H / 2 / Math.tan(camera.fov * Math.PI / 360)); camera.updateProjectionMatrix();
        const n = items.length;
        S = Math.min(Math.min(W, H) * .36, 340, W * .94 / (1 + .98 * (n - 1)));
      };
      onResize(); window.addEventListener('resize', onResize);

      /* 공용 재료·입자 풀 */
      const tex = c => { const t = track(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
      const basic = p => track(new THREE.MeshBasicMaterial(Object.assign({ transparent: true }, p)));
      const shadowTex = tex((() => { const c = mkCanvas(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 8, 64, 64, 62); gr.addColorStop(0, 'rgba(46,36,28,.5)'); gr.addColorStop(1, 'rgba(46,36,28,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c; })());
      const haloTex = tex(glowTex('rgba(255,236,190,.95)', 'rgba(242,179,102,.45)'));
      const sparkT = tex(sparkTex());

      const cards = items.map((it, i) => {
        const holder = new THREE.Group(), spin = new THREE.Group(); holder.add(spin); scene.add(holder);
        const th = Math.max(7, S * .045);
        const shadow = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), basic({ map: shadowTex, opacity: .0, depthWrite: false }));
        shadow.renderOrder = -2; holder.add(shadow);
        let w, h; const mats = [shadow.material];
        if (it.kind === 'star') {
          w = h = S * .94;
          const sh = new THREE.Shape(), R = w / 2, r = R * .46;
          for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, d = k % 2 ? r : R; sh[k ? 'lineTo' : 'moveTo'](Math.cos(a) * d, -Math.sin(a) * d); }
          sh.closePath();
          const geo = track(new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false })); geo.translate(0, 0, -th / 2);
          const face = basic({ color: GOLD }), side = basic({ color: '#EBDFC6' });
          spin.add(new THREE.Mesh(geo, [face, side])); mats.push(face, side);
          const sh2 = new THREE.Shape(), R2 = R * .6, r2 = R2 * .46;
          for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, d = k % 2 ? r2 : R2; sh2[k ? 'lineTo' : 'moveTo'](Math.cos(a) * d, -Math.sin(a) * d); }
          sh2.closePath();
          const geo2 = track(new THREE.ExtrudeGeometry(sh2, { depth: th * .5, bevelEnabled: false }));
          const topM = basic({ color: ORANGE }), sideM = basic({ color: '#C95A2A' }); mats.push(topM, sideM);
          const t1 = new THREE.Mesh(geo2, [topM, sideM]); t1.position.z = th / 2; spin.add(t1);
          const t2 = new THREE.Mesh(geo2, [topM, sideM]); t2.position.z = -th / 2 - th * .5; spin.add(t2);
        } else {
          const F = buildFaces(imgs[i], it.kind === 'piece' || it.kind === 'piece2');
          if (F.aspect >= 1) { w = S; h = S / F.aspect; } else { h = S; w = S * F.aspect; }
          const geo = track(new THREE.PlaneGeometry(w, h));
          const silT = tex(F.sil), faceT = tex(F.face), backT = tex(F.back);
          const front = new THREE.Mesh(geo, basic({ map: faceT, alphaTest: .5, side: THREE.FrontSide })); front.position.z = th / 2 + .2;
          const back = new THREE.Mesh(geo, basic({ map: backT, alphaTest: .5, side: THREE.FrontSide })); back.position.z = -th / 2 - .2; back.rotation.y = Math.PI;
          spin.add(front, back); mats.push(front.material, back.material);
          const N = 6;
          for (let k = 0; k < N; k++) {   // 종이 단면: 같은 모양 크림 조각을 겹쳐 두께로 보이게
            const m = new THREE.Mesh(geo, basic({ map: silT, color: '#EADDC2', alphaTest: .5, side: THREE.DoubleSide }));
            m.position.z = -th / 2 + th * (k + .5) / N; spin.add(m); mats.push(m.material);
          }
        }
        shadow.scale.set(w * 1.3, h * 1.3, 1); shadow.position.set(S * .03, -S * .06, -th - 6);
        return { it, holder, spin, mats, w, h, th, shadow, x: 0, y: 0, started: false, t0: 0, flown: false, landed: false, fx: 0, fy: 0, fs: 1, endS: .15, tgt: null, tf: 0, shadowA: .55 };
      });
      const setOpacity = (c, o) => c.mats.forEach(m => { m.opacity = m === c.shadow.material ? o * c.shadowA : o; });
      cards.forEach(c => { c.holder.visible = false; });

      /* 입자: 색종이(InstancedMesh), 종이별(InstancedMesh), 반짝 별빛(가산 스프라이트), 후광 */
      const dummy = new THREE.Object3D(), col = new THREE.Color();
      const confGeo = track(new THREE.PlaneGeometry(1, 1.7));
      const confetti = new THREE.InstancedMesh(confGeo, basic({ side: THREE.DoubleSide, opacity: 1 }), LIMITS.confetti);
      const pstarT = tex(paperStarTex());
      const pst = new THREE.InstancedMesh(confGeo, basic({ map: pstarT, alphaTest: .4, side: THREE.DoubleSide }), LIMITS.pstars);
      [confetti, pst].forEach(m => { m.frustumCulled = false; m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); track(m); scene.add(m); m.renderOrder = 5; });
      const P = { c: [], s: [] };
      const zero = new THREE.Matrix4().makeScale(0, 0, 0);
      for (let i = 0; i < LIMITS.confetti; i++) { P.c.push({ life: 0 }); confetti.setMatrixAt(i, zero); confetti.setColorAt(i, col.set('#fff')); }
      for (let i = 0; i < LIMITS.pstars; i++) { P.s.push({ life: 0 }); pst.setMatrixAt(i, zero); pst.setColorAt(i, col.set('#fff')); }
      const sparks = [];
      for (let i = 0; i < LIMITS.sparkles; i++) {
        const sp = new THREE.Sprite(basic({ map: sparkT, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
        sp.visible = false; sp.renderOrder = 6; scene.add(sp); sparks.push({ sp, life: 0 });
      }
      const halos = [];
      const spawn = (pool, n, fn) => { let c = 0; for (let i = 0; i < pool.length && c < n; i++) if (pool[i].life <= 0) { fn(pool[i], i); c++; } };
      const burst = (x, y, rad, big) => {
        if (calm) return;
        spawn(P.c, big ? 26 : 34, (p, i) => {
          const a = rnd(0, Math.PI * 2), v = rnd(.5, 1.5) * rad * 1.5;
          Object.assign(p, { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v + rad * .6, rx: rnd(0, 6), ry: rnd(0, 6), sx: rnd(-9, 9), sy: rnd(-9, 9), rz: rnd(0, 6), sz: rnd(-6, 6), sc: rnd(.07, .12) * S * .26 * 2, life: rnd(1, 1.5), max: 1.5 });
          confetti.setColorAt(i, col.set(PAL[(Math.random() * PAL.length) | 0]));
        });
        spawn(P.s, big ? 7 : 5, (p, i) => {
          const a = rnd(0, Math.PI * 2), v = rnd(.6, 1.4) * rad * 1.3;
          Object.assign(p, { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v + rad * .7, rx: 0, ry: 0, sx: 0, sy: 0, rz: rnd(-.5, .5), sz: rnd(-3, 3), sc: rnd(.14, .22) * S * .26 * 2, life: rnd(1.1, 1.6), max: 1.6 });
          pst.setColorAt(i, col.set(PAL[(Math.random() * PAL.length) | 0]));
        });
        spawn(sparks, big ? 12 : 8, p => {
          const a = rnd(0, Math.PI * 2), d = rnd(.55, 1.05) * rad;
          Object.assign(p, { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * .9, delay: rnd(0, .35), life: rnd(.55, 1) + .4, max: 0, size: rnd(.12, .26) * S, tw: rnd(8, 14) });
          p.max = p.life; p.sp.material.color.set(Math.random() < .5 ? '#FFF1C8' : '#F2B366'); p.sp.visible = true;
        });
      };
      const addHalo = (x, y, size) => {
        if (calm) return;
        const sp = new THREE.Sprite(basic({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
        sp.position.set(x, y, -S * .6); sp.renderOrder = -1; scene.add(sp); halos.push({ sp, t: 0, size });
      };

      /* 진행 */
      let clock = 0, speed = 1, flyAt = Infinity, last = performance.now(), finishAt = Infinity, ended = false;
      const n = items.length, slot = layout(n);
      const allStartedAt = (n - 1) * T_APPEAR_GAP;
      const toWorld = r => r ? { x: r.left + r.width / 2 - W / 2, y: H / 2 - (r.top + r.height / 2), size: Math.max(r.width, r.height) } : { x: W * .3, y: -H * .4, size: 48 };
      const fb = []; let frames = 0, sumDt = 0, maxDt = 0;
      const fire = (fn, k) => { try { fn && fn(k); } catch (e) { console.warn('[Reward3D] 콜백 오류', e); } };

      overlay.addEventListener('pointerdown', ev => {
        ev.preventDefault(); ev.stopPropagation();
        if (flyAt < Infinity) return;
        if (clock >= allStartedAt) flyAt = clock; else speed = 2.6;   // 아직 나오는 중이면 빨리 감기, 다 나왔으면 바로 날아간다
      }, { passive: false });

      const done = new Promise(resolve => {
        const frame = now => {
          if (disposed) return;
          const dt = Math.min(.05, (now - last) / 1000); last = now; clock += dt * speed;
          if (frames > 0) { sumDt += dt; maxDt = Math.max(maxDt, dt); } frames++;
          if (flyAt === Infinity && clock >= allStartedAt + T_SPIN + T_HOLD) flyAt = clock;
          const count = cards.filter(c => c.started).length;
          const sl = layout(Math.max(1, count));

          cards.forEach((c, i) => {
            const st = i * T_APPEAR_GAP;
            if (!c.started && clock >= st) {
              c.started = true; c.t0 = st; c.holder.visible = true;
              const cnt = cards.filter(q => q.started).length, lx = layout(cnt)(cnt - 1);
              c.x = lx; c.y = 0;
              addHalo(lx, 0, S * 3.4); burst(lx, 0, S * 1.05, i > 0);
              fire(opts.onAppear, c.it.kind);
            }
            if (!c.started) return;
            const u = clock - c.t0;
            if (!c.flown && flyAt < Infinity && clock >= flyAt + i * T_FLY_GAP) {
              c.flown = true; c.tf = flyAt + i * T_FLY_GAP;
              let r = null; try { r = c.it.target && c.it.target(); } catch (e) {}
              c.tgt = toWorld(r); c.fx = c.x; c.fy = c.y; c.endS = clamp(c.tgt.size * .75 / S, .06, 1);
            }
            if (!c.flown) {
              // 이미 나온 카드는 옆으로 비켜 선다(감쇠)
              const tx = sl(i < count ? i : 0);
              c.x += (tx - c.x) * (1 - Math.exp(-dt * speed * 9));
              const sp = calm ? 1 : spring(clamp(u / .55, 0, 1.4));
              const uu = clamp(u / T_SPIN, 0, 1);
              const idle = Math.sin(clock * 2.4 + i) * S * .012;
              c.holder.position.set(c.x, (calm ? 0 : -(1 - sp) * S * .42) + idle, 0);
              c.holder.scale.setScalar(Math.max(.001, calm ? 1 : sp));
              c.spin.rotation.y = calm ? 0 : Math.PI + 3 * Math.PI * easeOut3(uu);
              c.holder.rotation.z = calm ? 0 : Math.sin(uu * Math.PI * 2) * .09 * (1 - uu);
              setOpacity(c, calm ? clamp(u / .35, 0, 1) : clamp(u / .12, 0, 1));
            } else if (!c.landed) {
              const f = clamp((clock - c.tf) / T_FLY, 0, 1);
              if (f < 0 && !calm) { }
              if (calm) {
                setOpacity(c, 1 - f);
              } else {
                const e = smooth(f), mx = (c.fx + c.tgt.x) / 2, my = Math.max(c.fy, c.tgt.y) + H * .28;
                const px = (1 - e) * (1 - e) * c.fx + 2 * (1 - e) * e * mx + e * e * c.tgt.x, py = (1 - e) * (1 - e) * c.fy + 2 * (1 - e) * e * my + e * e * c.tgt.y;
                c.holder.position.set(px, py, 30);
                c.holder.scale.setScalar(Math.max(.001, 1 + (c.endS - 1) * Math.pow(e, .85)));
                c.spin.rotation.y = 4 * Math.PI + 2 * Math.PI * e;
                c.holder.rotation.z = -.35 * Math.sin(e * Math.PI);
                c.shadow.material.opacity = (1 - e) * c.shadowA;
              }
              if (f >= 1) {
                c.landed = true; c.holder.visible = false;
                if (!calm) burst(c.tgt.x, c.tgt.y, Math.max(40, c.tgt.size * .9), false);
                fire(opts.onLand, c.it.kind);
              }
            }
          });
          if (flyAt < Infinity && finishAt === Infinity && cards.every(c => c.landed)) { finishAt = clock + (calm ? .15 : 1.0); dim.style.transition = 'opacity .45s ease-in'; dim.style.opacity = '0'; }

          // 후광
          halos.forEach(h => { h.t += dt * speed; const f = clamp(h.t / 1.0, 0, 1); h.sp.scale.setScalar(h.size * (.35 + .65 * easeOut3(f))); h.sp.material.opacity = Math.sin(f * Math.PI) * .75; h.sp.visible = f < 1; });
          // 입자
          const step = dt * speed;
          const upd = (pool, mesh, g) => {
            for (let i = 0; i < pool.length; i++) {
              const p = pool[i]; if (p.life <= 0) continue;
              p.life -= step;
              if (p.life <= 0) { mesh.setMatrixAt(i, zero); continue; }
              p.vy -= 780 * step * (S / 240); p.vx *= 1 - .8 * step; p.vy *= 1 - .5 * step; p.x += p.vx * step; p.y += p.vy * step;
              p.rx += p.sx * step; p.ry += p.sy * step; p.rz += p.sz * step;
              const fade = Math.min(1, p.life / .35);
              dummy.position.set(p.x, p.y, 70); dummy.rotation.set(g ? 0 : p.rx, g ? 0 : p.ry, p.rz);
              dummy.scale.setScalar(p.sc * fade * (g ? 1 : 1)); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
          };
          upd(P.c, confetti, false); upd(P.s, pst, true);
          sparks.forEach(p => {
            if (p.life <= 0) return;
            p.delay -= step; if (p.delay > 0) { p.sp.material.opacity = 0; return; }
            p.life -= step;
            if (p.life <= 0) { p.sp.visible = false; p.sp.material.opacity = 0; return; }
            const f = 1 - p.life / p.max, tw = .55 + .45 * Math.abs(Math.sin(clock * p.tw + p.x));
            p.sp.position.set(p.x, p.y, 90); p.sp.scale.setScalar(p.size * Math.sin(f * Math.PI) * (.7 + .5 * tw) * 1.0 + .01); p.sp.material.opacity = Math.sin(f * Math.PI) * tw;
            p.sp.material.rotation = f * 1.2;
          });

          renderer.render(scene, camera);
          if (clock >= finishAt && !ended) { ended = true; resolve(); return; }
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(t => { last = t; frame(t); });
      });
      await done;
      const stats = { frames, avgMs: frames > 1 ? +(sumDt / (frames - 1) * 1000).toFixed(2) : 0, maxMs: +(maxDt * 1000).toFixed(1), calm };
      Reward3D.lastStats = stats;
      cleanup();
      fire(opts.onDone);
      return true;
    } catch (e) {
      console.warn('[Reward3D] 3D 연출을 못 했어요 → DOM 연출로', e && e.message);
      cleanup();
      return false;
    }
  }

  const Reward3D = { play, lastStats: null, isActive: () => active };
  window.Reward3D = Reward3D;
})();
