import * as THREE from './vendor/three.module.js';
import { ART } from './art.js?v=20261028english1';
import { ARCH, MARK_BOX, LOCKUP } from './art2.js?v=20261029sp2';

/* 새 스플래시 「로고 안으로 들어갔다 나오기」(2026-10-29 사용자 결정 A).
   로고(아치 창 + 글자)에서 시작 → 글자가 떨어지고 아치 창 안으로 다가감 → 창 안 밤 무대에서 들판이 일어서고 토끼·거북이가 지나감
   → 성이 일어서고 공주 셋이 들어와 인사 → 커튼이 닫힘 → 뒤로 빠져 다시 로고 크기 → 커튼이 열리고 글자 '톡'·'톡'·'동화극장'이 내려앉음
   → 아치가 홈 로고 마크 자리로 날아감. 사라지는 것은 투명해지지 않고 걸어 나가거나 종이가 눕듯 접힌다.
   좌표: '마크 픽셀' = assets/ui/logo_mark.webp(512) 위 좌표. 화면 = 직교 카메라, 1단위 = CSS 1px. */
export const DURATION = 5.5;
export const FLY_AT = 5.05;
const LAND = .26;   // 글자 판이 일어서는 시간
const CREAM = '#F5EFE9';
const LAUNCH_LOGO = 900 / 2732;   // iOS 실행 화면(2732 정사각, 꽉 채움)에서 로고 너비 비율 — 정지 첫 화면·첫 장면이 같은 크기
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const inout = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const out = x => 1 - Math.pow(1 - clamp(x), 3);
const back = x => { x = clamp(x); const c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const mix = THREE.MathUtils.lerp;
const url = path => new URL(`../../${path}`, import.meta.url).href;

/** 효과음 [시각(초), sounds/sfx 이름, 음량]. 재생은 start.js 가 맡는다 */
export const CUES = [
  [.36, 'whoosh', .32], [.4, 'paper_down', .35],
  [.95, 'paper_up', .55], [1.12, 'paper_up', .4],
  [1.45, 'hop', .45], [1.8, 'hop', .4], [2.15, 'hop', .35], [1.62, 'step_grass', .35],
  [2.36, 'paper_down', .45], [2.47, 'paper_up', .55], [2.62, 'shimmer', .4], [3.02, 'sparkle', .45],
  [3.14, 'swish', .55], [3.56, 'whoosh', .3], [4.24, 'swish', .35],
  [4.15, 'paper_tap', .7], [4.3, 'paper_tap', .7], [4.48, 'paper_up', .45], [4.74, 'chime_up', .4]
];

/** 홈이 쓰는 로고 너비(CSS px). home.css 의 .splash.v2 .splash-wordmark 와 같은 식 */
export function logoWidth(W, H) { return Math.min(LAUNCH_LOGO * Math.max(W, H), .84 * W, .7 * H); }

export async function createSplashScene(host, { lang = 'ko', signal, onPreparing = () => {} } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(CREAM, 1);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
  const textures = new Set(), geometries = new Set(), materials = new Set();
  let disposed = false, preparing = false, released = false, current = 0, observer, flyRect = null;
  const own = (set, x) => { set.add(x); return x; };
  const release = () => {
    if (released || preparing) return;
    released = true;
    for (const s of [geometries, materials, textures]) for (const x of s) x.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    signal?.removeEventListener('abort', destroy);
    observer?.disconnect();
    renderer.domElement.remove();
    release();
  };
  if (signal?.aborted) { destroy(); throw new DOMException('Aborted', 'AbortError'); }
  signal?.addEventListener('abort', destroy, { once: true });

  try {
    const L = LOCKUP[lang === 'en' ? 'en' : 'ko'];
    const FILES = {
      mark: 'assets/ui/logo_mark.webp', stage: 'assets/v3w/sp2_stage_hd.webp', curtain: 'assets/v3w/sp2_curtain.webp',
      ...Object.fromEntries(L.pieces.map(p => [p[0], `assets/v3w/${p[0]}.webp`])),
      ...Object.fromEntries(['sp_ground_meadow_v1', 'sp_castle_v1', 'rp_layer_tree_front', 'rab_layer_flower_bush_front', 'cf4_prop_grass_tuft',
        'rab_rabbit_run_c', 'rab_turtle_walk', 'cd2_cind_gown', 'sw_snow_stand', 'sb_pr_wave'].map(n => [n, `assets/v3w/${n}.webp`]))
    };
    const loader = new THREE.TextureLoader();
    const results = await Promise.allSettled(Object.entries(FILES).map(async ([name, path]) => {
      const map = await loader.loadAsync(url(path));
      if (disposed) { map.dispose(); return null; }
      own(textures, map);
      const image = map.image;
      const edge = name === 'stage' || name === 'curtain' || name.startsWith('sp2_') ? 1536 : name === 'sp_castle_v1' || name === 'sp_ground_meadow_v1' ? 1024 : 768;
      const k = Math.min(1, edge / Math.max(image.width, image.height));
      if (k < 1) {
        const c = document.createElement('canvas');
        c.width = Math.round(image.width * k); c.height = Math.round(image.height * k);
        c.getContext('2d').drawImage(image, 0, 0, c.width, c.height);
        map.image = c; map.needsUpdate = true;
      }
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      const art = ART[name];
      if (art) {   // 투명 여백 빼기(기존 스플래시와 같은 표)
        const { size: [w, h], box: [l, t, r, b] } = art;
        map.offset.set(l / w, 1 - b / h); map.repeat.set((r - l) / w, (b - t) / h);
      }
      return [name, map];
    }));
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    const failed = results.find(r => r.status === 'rejected');
    if (failed) throw failed.reason;
    const maps = new Map(results.map(r => r.value));
    const aspect = name => {
      const art = ART[name]; if (art) { const [l, t, r, b] = art.box; return (r - l) / (b - t); }
      const im = maps.get(name).image; return im.width / im.height;
    };

    /* 그림자: 그림을 작게 줄인 실루엣을 다시 키우면 저절로 부드러워진다(엔진이 붙이는 바깥 그림자) */
    function silhouette(name) {
      const map = maps.get(name), im = map.image, art = ART[name];
      const [l, t, r, b] = art ? art.box : [0, 0, im.width, im.height];
      const sx = im.width / (art ? art.size[0] : im.width), sy = im.height / (art ? art.size[1] : im.height);
      const w = Math.max(4, Math.round((r - l) * sx / 14)), h = Math.max(4, Math.round((b - t) * sy / 14)), pad = 2;
      const c = document.createElement('canvas'); c.width = w + pad * 2; c.height = h + pad * 2;
      const g = c.getContext('2d');
      g.drawImage(im, l * sx, t * sy, (r - l) * sx, (b - t) * sy, pad, pad, w, h);
      g.globalCompositeOperation = 'source-in'; g.fillStyle = '#2E241C'; g.fillRect(0, 0, c.width, c.height);
      const tex = own(textures, new THREE.CanvasTexture(c)); tex.colorSpace = THREE.SRGBColorSpace;
      return { tex, grow: [(w + pad * 2) / w, (h + pad * 2) / h] };
    }
    const basic = (map, extra = {}) => own(materials, new THREE.MeshBasicMaterial({ map, transparent: true, depthTest: false, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, ...extra }));
    /* 종이 한 장. anchor 'bottom' = 아래 가운데가 원점(접혀 일어서는 판), 'center' = 가운데 */
    function paper(name, h, { anchor = 'bottom', order = 10, shadow = true, w } = {}) {
      w ??= h * aspect(name);
      const pivot = new THREE.Group();
      const geo = own(geometries, new THREE.PlaneGeometry(w, h));
      if (anchor === 'bottom') geo.translate(0, h / 2, 0);
      const mesh = new THREE.Mesh(geo, basic(maps.get(name)));
      mesh.renderOrder = order;
      if (shadow) {
        const s = silhouette(name);
        const sg = own(geometries, new THREE.PlaneGeometry(w * s.grow[0], h * s.grow[1]));
        if (anchor === 'bottom') sg.translate(0, h / 2, 0);
        const sm = new THREE.Mesh(sg, basic(s.tex, { opacity: .2 }));
        sm.position.set(h * .02, -h * .03, 0); sm.renderOrder = order - .5;
        pivot.add(sm); pivot.userData.shadow = sm;
      }
      pivot.add(mesh); pivot.userData.mesh = mesh;
      return pivot;
    }
    const at = (obj, x, y) => { obj.position.set(x, -y, 0); return obj; };   // 마크 픽셀(y 아래로) → 장면(y 위로)
    const setOpacity = (obj, a) => obj.traverse(o => { if (o.isMesh) o.material.opacity = a * (o === obj.userData.shadow ? .2 : 1); });

    /* 무대(마크 픽셀 공간). root 의 크기·위치로 로고 크기 ↔ 화면 가득을 오간다 */
    const root = new THREE.Group(); scene.add(root);
    const [mx0, my0, mx1, my1] = MARK_BOX;
    const markPlane = new THREE.Mesh(own(geometries, new THREE.PlaneGeometry(512, 512)), basic(maps.get('mark'), { transparent: true }));
    at(markPlane, 256, 256).renderOrder = 1; root.add(markPlane);
    // 큰 무대 그림(sp2_stage_hd, 1274×1354): 마크에 맞춘 자리 x0 43.5, y0 30, 0.33 마크 픽셀/그림 픽셀
    const SW = 1274 * .33, SH = 1354 * .33;
    const stage = new THREE.Mesh(own(geometries, new THREE.PlaneGeometry(SW, SH)), basic(maps.get('stage')));
    at(stage, 43.5 + SW / 2, 30 + SH / 2).renderOrder = 2; root.add(stage);

    // 1막 들판·나무·수풀(접혀 있다가 일어선다), 2막 성
    const flaps = [];
    const flap = (name, h, x, y, start, dur = .38, order = 10) => {
      const p = at(paper(name, h, { order }), x, y); root.add(p); flaps.push({ p, start, dur }); return p;
    };
    const meadow = flap('sp_ground_meadow_v1', 110, 290, 472, .95, .4, 6);
    const tree = flap('rp_layer_tree_front', 150, 418, 440, 1.08, .36, 8);
    const bush = flap('rab_layer_flower_bush_front', 40, 196, 455, 1.15, .32, 12);
    const tuft = flap('cf4_prop_grass_tuft', 26, 360, 458, 1.2, .3, 12);
    const castle = flap('sp_castle_v1', 150, 300, 432, 2.47, .42, 7);
    const scene1 = [tree, bush, tuft];

    // 배우: 토끼·거북이는 왼쪽에서 들어와 오른쪽으로 나가고(프레임 뒤로 가려짐), 공주들은 양옆에서 들어와 선다
    const rabbit = paper('rab_rabbit_run_c', 92, { order: 20 }); root.add(rabbit);
    const turtle = paper('rab_turtle_walk', 44, { order: 19 }); root.add(turtle);
    const cast = [
      { p: paper('cd2_cind_gown', 112, { order: 22 }), from: 20, x: 212, y: 458, start: 2.68 },
      { p: paper('sw_snow_stand', 104, { order: 21 }), from: 30, x: 296, y: 452, start: 2.82 },
      { p: paper('sb_pr_wave', 110, { order: 23 }), from: 500, x: 384, y: 460, start: 2.74 }
    ];
    for (const a of cast) root.add(a.p);

    // 커튼 두 장: 열림 = 아치 바깥(크림 종이 뒤), 닫힘 = 가운데서 겹침
    const CW = 228, CH = 450, CY = 30;
    const curtains = [-1, 1].map(side => {
      const c = paper('curtain', CH, { anchor: 'center', order: 30, w: CW });
      c.userData.mesh.scale.x = side;   // 오른쪽은 뒤집어 씀(물결 가장자리가 가운데로)
      root.add(c); return { c, side };
    });

    // 크림 종이(구멍 뚫린 판)와 구멍 안쪽 그림자
    const hole = new THREE.Path();
    const pts = [];
    for (let i = 0; i < ARCH.length; i += 2) {
      const x = ARCH[i], y = ARCH[i + 1], last = pts[pts.length - 1];
      if (!last || Math.abs(last[0] - x) > .05 || Math.abs(last[1] - y) > .05) pts.push([x, y]);
    }
    pts.forEach(([x, y], i) => (i ? hole.lineTo(x, -y) : hole.moveTo(x, -y)));
    const sheetShape = new THREE.Shape();
    sheetShape.moveTo(-40000, 40000); sheetShape.lineTo(40000, 40000); sheetShape.lineTo(40000, -40000); sheetShape.lineTo(-40000, -40000);
    sheetShape.holes.push(hole);
    const sheet = new THREE.Mesh(own(geometries, new THREE.ShapeGeometry(sheetShape)), own(materials, new THREE.MeshBasicMaterial({ color: CREAM, transparent: true, depthTest: false, depthWrite: false, toneMapped: false, side: THREE.DoubleSide })));
    sheet.renderOrder = 40; root.add(sheet);
    const rimCanvas = document.createElement('canvas'); rimCanvas.width = rimCanvas.height = 1024;
    {
      const g = rimCanvas.getContext('2d'), k = 2, far = 4000;
      const path = new Path2D(); pts.forEach(([x, y], i) => (i ? path.lineTo(x * k, y * k) : path.moveTo(x * k, y * k))); path.closePath();
      g.save(); g.clip(path);
      const outer = new Path2D(); outer.rect(-far, -far, 1024 + far * 2, 1024 + far * 2); outer.addPath(path);
      g.translate(far * 3, 0);
      g.shadowColor = 'rgba(46, 36, 28, .55)'; g.shadowBlur = 22; g.shadowOffsetX = -far * 3; g.shadowOffsetY = 12;
      g.fillStyle = '#000'; g.fill(outer, 'evenodd');
      g.restore();
    }
    const rimTex = own(textures, new THREE.CanvasTexture(rimCanvas)); rimTex.colorSpace = THREE.SRGBColorSpace;
    const rim = new THREE.Mesh(own(geometries, new THREE.PlaneGeometry(512, 512)), basic(rimTex));
    at(rim, 256, 256).renderOrder = 35; root.add(rim);

    // 글자 조각: 로고 크기에서만 쓰는 따로 된 무리(확대에 끌려가지 않고 떨어졌다가 다시 내려앉는다)
    const words = new THREE.Group(); scene.add(words);
    const sxl = (mx1 - mx0) / (L.mark[2] - L.mark[0]), syl = (my1 - my0) / (L.mark[3] - L.mark[1]);
    const toMark = (x, y) => [mx0 + (x - L.mark[0]) * sxl, my0 + (y - L.mark[1]) * syl];
    const pieces = L.pieces.map(([name, l, t, r, b], i) => {
      const [x0, y0] = toMark(l, t), [x1, y1] = toMark(r, b);
      const p = paper(name, y1 - y0, { order: 50, shadow: false, w: x1 - x0 });   // 바닥선이 접는 축
      words.add(p);
      return { p, x: (x0 + x1) / 2, y: y1, fall: .36 + i * .06, land: [4.05, 4.2, 4.38][i] };
    });
    const logoC = toMark(L.size[0] / 2, L.size[1] / 2);

    let W = 1, H = 1, m0 = 1, m1 = 1, c1 = [256, 251];
    function layout() {
      m0 = logoWidth(W, H) / L.size[0] / sxl;   // CSS px / 마크 픽셀(로고 크기)
      const portrait = W < H;
      m1 = Math.min(.94 * H / 430, (portrait ? 1.22 : 1.2) * W / 405);
      c1 = [portrait ? 270 : 256, 251];
    }
    // 마크 점 p 가 화면 가운데 기준 (p - c)·m 에 오도록
    const place = (g, m, cx, cy) => { g.scale.setScalar(m); g.position.set(-cx * m, cy * m, 0); };
    function zoomAt(t) { return t < 2 ? inout((t - .35) / .75) : 1 - inout((t - 3.55) / .7); }

    function renderAt(time) {
      if (disposed) return;
      current = Math.max(0, Math.min(DURATION, time));
      const t = current;
      // 확대: 크기는 로그로, 중심은 화면에서 곧게 움직이도록
      const z = zoomAt(t);
      let m = Math.exp(mix(Math.log(m0), Math.log(m1), z));
      const w = (1 / m0 - 1 / m) / (1 / m0 - 1 / m1 || 1);
      let cx = mix(logoC[0], c1[0], w), cy = mix(logoC[1], c1[1], w);
      // 끝: 홈 로고 마크 자리로 날아감
      const fly = flyRect ? inout((t - FLY_AT) / (DURATION - FLY_AT)) : 0;
      if (fly > 0) {
        const mf = flyRect.width / 512;
        const cxf = (W / 2 - flyRect.left) / mf, cyf = (H / 2 - flyRect.top) / mf;
        const mm = Math.exp(mix(Math.log(m), Math.log(mf), fly));
        const wf = (1 / m - 1 / mm) / (1 / m - 1 / mf || 1);
        cx = mix(cx, cxf, wf); cy = mix(cy, cyf, wf); m = mm;
      }
      place(root, m, cx, cy);
      place(words, m0, logoC[0], logoC[1]);

      // 배경: 로고 크기에선 원래 마크 그림, 다가가는 동안 큰 그림으로(움직이는 중에 넘긴다)
      const hd = smooth((t - .45) / .25) * (1 - smooth((t - 3.95) / .25));
      stage.material.opacity = hd;
      stage.visible = hd > 0;
      rim.material.opacity = z;
      rim.visible = z > .01;
      // 날아가는 동안 크림 종이는 홈 바탕으로 녹아든다(구멍 바깥은 원래 마크 그림의 투명 여백)
      sheet.material.opacity = 1 - smooth((t - FLY_AT) / .3);
      sheet.visible = sheet.material.opacity > 0;
      markPlane.material.opacity = flyRect ? 1 : sheet.material.opacity;
      renderer.setClearAlpha(sheet.material.opacity);

      // 일어서는 판: 바닥선을 축으로 누워 있다가(-90°) 선다. 1막 소품은 2.36초에 다시 눕는다
      for (const f of flaps) {
        let up = back((t - f.start) / f.dur);
        if (scene1.includes(f.p)) up *= 1 - inout((t - 2.36) / .26);
        if (t >= 3.5) up = 0;   // 커튼 뒤에서 치움
        f.p.rotation.x = -Math.PI / 2 * (1 - Math.min(1, up));
        f.p.scale.y = up > 1 ? up : 1;
        f.p.visible = up > .001;
      }
      // 토끼: 세 번 깡충 뛰며 왼쪽 → 오른쪽 밖으로
      const run = clamp((t - 1.35) / 1.05);
      rabbit.visible = t >= 1.35 && run < 1;
      at(rabbit, mix(0, 530, run), 456 - 30 * Math.abs(Math.sin(Math.PI * run * 3)));
      rabbit.rotation.z = -.08 * Math.cos(Math.PI * run * 3);
      // 거북이: 느릿느릿 뒤따라 오른쪽 밖으로
      const walk = clamp((t - 1.55) / 1.75);
      turtle.visible = t >= 1.55 && walk < 1 && t < 3.5;
      at(turtle, mix(0, 500, walk), 462 - 1.5 * Math.abs(Math.sin(Math.PI * walk * 9)));
      // 공주들: 양옆에서 걸어 들어와 선다(걸음마다 살짝 통통)
      for (const a of cast) {
        const k = out((t - a.start) / .55);
        a.p.visible = t >= a.start && t < 3.5;
        at(a.p, mix(a.from, a.x, k), a.y - 4 * Math.abs(Math.sin(Math.PI * k * 3)) * (1 - k));
      }
      // 커튼: 3.14초에 닫히고 4.24초에 열린다
      const shut = inout((t - 3.14) / .36) * (1 - inout((t - 4.24) / .38));
      for (const { c, side } of curtains) {
        at(c, 256 + side * mix(CW / 2 + 216, CW / 2 - 8, shut), CY + CH / 2);
        c.visible = shut > .001;
      }
      // 글자: 들판·성과 같은 종이 판. 다가가기 시작하면 차례로 눕고, 로고 크기로 돌아오면 '톡'·'톡'·'동화극장' 차례로 일어선다
      for (const p of pieces) {
        const up = t < p.land ? 1 - (clamp((t - p.fall) / .22) ** 2) : back((t - p.land) / LAND);
        at(p.p, p.x, p.y);
        p.p.rotation.x = -Math.PI / 2 * (1 - Math.min(1, up));
        p.p.scale.y = Math.max(1, up);
        p.p.visible = up > .001;
        setOpacity(p.p, 1 - smooth((t - FLY_AT) / .25));
      }
      renderer.render(scene, camera);
    }
    function resize(draw = true) {
      if (disposed) return;
      W = Math.max(1, host.clientWidth); H = Math.max(1, host.clientHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(1800000 / (W * H))));
      renderer.setSize(W, H, false);
      Object.assign(camera, { left: -W / 2, right: W / 2, top: H / 2, bottom: -H / 2 });
      camera.updateProjectionMatrix();
      layout();
      if (draw) renderAt(current);
    }
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    onPreparing();
    resize(false);
    for (const texture of textures) renderer.initTexture(texture);
    preparing = true;
    try { await renderer.compileAsync(scene, camera); }
    finally { preparing = false; if (disposed) release(); }
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    for (const t of [.3, 1, 1.8, 2.9, 3.3, 4.4]) renderAt(t);
    const gl = renderer.getContext();
    const fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (fence) {
      gl.flush();
      try {
        await new Promise(resolve => {
          const check = () => {
            if (disposed) { resolve(); return; }
            if (gl.clientWaitSync(fence, 0, 0) === gl.TIMEOUT_EXPIRED) setTimeout(check, 8); else resolve();
          };
          check();
        });
      } finally { if (!disposed) gl.deleteSync(fence); }
    }
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    renderAt(0);
    host.append(renderer.domElement);
    observer = new ResizeObserver(() => resize()); observer.observe(host);
    /** 날아갈 자리(홈 로고 마크 img 의 화면 상자). 없으면 제자리에서 녹아든다 */
    const flyTo = rect => { flyRect = rect; };
    return { renderAt, destroy, duration: DURATION, renderer, cues: CUES, flyAt: FLY_AT, flyTo };
  } catch (error) {
    destroy();
    throw error;
  }
}
