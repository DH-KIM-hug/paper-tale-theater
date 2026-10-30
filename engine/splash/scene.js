import * as THREE from './vendor/three.module.js';
import { ART } from './art.js?v=20261028english1';
import { ARCH, MARK_BOX, LOCKUP } from './art2.js?v=20261029sp2';

/* 새 스플래시 「로고 안으로 들어갔다 나오기」(2026-10-29 사용자 결정 A, 10-30 수정: 커튼은 움직이지 않고 밤 → 아침 → 밤,
   10-30 안쪽 이야기를 '커튼콜'로 — 사용자가 시안 A·B·C 중 A 선택).
   로고(아치 창 + 글자)에서 시작 → 글자가 눕고 창 안으로 다가감 → 달·별 그린 밤 하늘 막이 걷혀 올라가고 해가 줄에 매달려 내려옴(아침)
   → 동화 친구들(사자·신데렐라는 왼쪽, 호랑이·토끼·거북이는 오른쪽에서)이 차례로 걸어 들어와 줄 서고 다 같이 인사(호랑이는 인사 자세, 별이 반짝 올라감)
   → 해가 끌려 올라가고 밤 하늘 막이 다시 내려옴 → 친구들은 접혀 누움 → 뒤로 빠져 처음과 같은 로고 → 글자 '톡'·'톡'·'동화극장'이 일어섬 → 아치가 홈 로고 마크 자리로 날아감.
   커튼은 로고처럼 왼쪽에 묶인 채 늘 맨 앞(무대와 배우는 그 뒤). 사라지는 것은 투명해지지 않고 걸어 나가거나 접혀 눕는다.
   좌표: '마크 픽셀' = assets/ui/logo_mark.webp(512) 위 좌표. 화면 = 직교 카메라, 1단위 = CSS 1px. */
export const DURATION = 6.35;
export const FLY_AT = 5.9;
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

/** 효과음 [시각(초), sounds/sfx 이름, 음량, 앞부분만 쓸 길이(초)?]. 재생은 start.js 가 맡는다 */
export const CUES = [
  [.36, 'whoosh', .32], [.4, 'paper_down', .35],
  [1.0, 'slide_up', .35], [1.08, 'slide_down', .3], [1.15, 'birds_chirp_1', .25, 1.8],
  [1.35, 'paper_up', .4], [1.42, 'paper_up', .3],
  [1.55, 'step_grass', .35], [1.85, 'step_grass', .35], [2.15, 'hop', .35], [2.43, 'hop', .35], [2.55, 'hop', .25],   // 친구들이 차례로 들어옴
  [2.0, 'pop', .3], [2.3, 'pop', .3], [2.6, 'pop', .3], [2.9, 'pop', .3],
  [2.95, 'shimmer', .4], [3.05, 'cheer', .22, 1.1], [3.15, 'sparkle', .45],   // 다 같이 인사
  [3.3, 'slide_up', .35], [3.42, 'slide_down', .35], [3.9, 'sparkle', .35],
  [3.97, 'paper_down', .4], [4.47, 'whoosh', .28],
  [5.1, 'paper_tap', .7], [5.25, 'paper_tap', .7], [5.43, 'paper_up', .45], [5.62, 'chime_up', .4]
];

/** 홈이 쓰는 로고 너비(CSS px). home.css 의 .splash-wordmark 와 같은 식 */
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
      mark: 'assets/ui/logo_mark.webp',
      ...Object.fromEntries(['sp2_day_full', 'sp2_night_sky', 'sp2_floor', 'sp2_curtain_tied', 'sp2_sun'].map(n => [n, `assets/v3w/${n}.webp`])),
      ...Object.fromEntries(L.pieces.map(p => [p[0], `assets/v3w/${p[0]}.webp`])),
      ...Object.fromEntries(['lm_lion_stand', 'cd2_cind_gown', 'pj3_tiger_stand', 'pj3_tiger_bow', 'rab_rabbit_run_c', 'rab_turtle_walk', 'rab_layer_flower_bush_front', 'cf4_prop_grass_tuft'].map(n => [n, `assets/v3w/${n}.webp`])),
      star_one: 'assets/ui/star_one.webp'
    };
    const loader = new THREE.TextureLoader();
    const results = await Promise.allSettled(Object.entries(FILES).map(async ([name, path]) => {
      const map = await loader.loadAsync(url(path));
      if (disposed) { map.dispose(); return null; }
      own(textures, map);
      const image = map.image;
      const edge = name.startsWith('sp2_') ? 1536 : name === 'sp_castle_v1' || name === 'sp_ground_meadow_v1' ? 1024 : 768;
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
    /* 종이 한 장. anchor 'bottom' = 아래 가운데가 원점(접혀 일어서는 판), 'center' = 가운데, 'left' = 왼쪽 가운데(옆으로 펴지는 커튼) */
    function paper(name, h, { anchor = 'bottom', order = 10, shadow = true, w } = {}) {
      w ??= h * aspect(name);
      const pivot = new THREE.Group();
      const geo = own(geometries, new THREE.PlaneGeometry(w, h));
      if (anchor === 'bottom') geo.translate(0, h / 2, 0);
      if (anchor === 'left') geo.translate(w / 2, 0, 0);
      const mesh = new THREE.Mesh(geo, basic(maps.get(name)));
      mesh.renderOrder = order;
      if (shadow) {
        const s = silhouette(name);
        const sg = own(geometries, new THREE.PlaneGeometry(w * s.grow[0], h * s.grow[1]));
        if (anchor === 'bottom') sg.translate(0, h / 2, 0);
        if (anchor === 'left') sg.translate(w / 2, 0, 0);
        const sm = new THREE.Mesh(sg, basic(s.tex, { opacity: .2 }));
        sm.position.set(anchor === 'left' ? 0 : h * .02, -h * .03, 0); sm.renderOrder = order - .5;
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
    // 로고 크기에서는 로고 마크 그림 그대로. 다가가는 동안(움직이는 중에) 같은 모습의 무대 층으로 넘기고, 뒤로 빠질 때 다시 로고 마크로
    const markPlane = new THREE.Mesh(own(geometries, new THREE.PlaneGeometry(512, 512)), basic(maps.get('mark'), { transparent: true }));
    at(markPlane, 256, 256).renderOrder = 26; root.add(markPlane);
    // 무대 판(tools/brand/build_splash_stage.py, 1274×1354): 마크에 맞춘 자리 x0 43.5, y0 30, 0.33 마크 픽셀/그림 픽셀
    const BX = 43.5, BY = 30, BK = .33, SW = 1274 * BK, SH = 1354 * BK;
    const board = (name, order, top = 0, h = 1354 - top) => {
      const m = new THREE.Mesh(own(geometries, new THREE.PlaneGeometry(SW, h * BK)), basic(maps.get(name)));
      m.renderOrder = order; root.add(m); return { m, x: BX + SW / 2, y: BY + (top + h / 2) * BK };
    };
    const day = board('sp2_day_full', 2), night = board('sp2_night_sky', 4, 0, 1250), floor = board('sp2_floor', 5, 941);
    at(day.m, day.x, day.y); at(floor.m, floor.x, floor.y);
    // 해: 아침에 줄에 매달려 로고의 달 자리(322, 205)로 내려오고, 저녁이 되면 끌려 올라간다. 그림 500×1024 중 해 가운데 y 774
    const SUN_H = 307, sun = paper('sp2_sun', SUN_H, { anchor: 'center', order: 3, shadow: false });
    root.add(sun);
    const sunY = 205 - 774 * SUN_H / 1024 + SUN_H / 2;

    /* 무대 안 이야기: 커튼콜(동화 친구들이 차례로 들어와 줄 서고 다 같이 인사) */
    const flaps = [];
    const flap = (name, h, x, y, start, dur = .38, order = 10, down = 4.0) => { const p = at(paper(name, h, { order }), x, y); root.add(p); flaps.push({ p, start, dur, down }); return p; };
    const actors = [];
    {
      flap('rab_layer_flower_bush_front', 40, 160, 462, 1.35, .3, 30); flap('cf4_prop_grass_tuft', 26, 455, 462, 1.42, .3, 30);
      [['lm_lion_stand', 104, 178, 1.5, -1], ['cd2_cind_gown', 136, 252, 1.8, -1], ['pj3_tiger_stand', 98, 346, 2.1, 1], ['rab_rabbit_run_c', 82, 428, 2.38, 1]].forEach(([n, h, x, st, side], i) =>
        { const p = paper(n, h, { order: n === 'cd2_cind_gown' ? 24 : 20 + i }); root.add(p); actors.push({ p, n, x, y: 446, st, from: side < 0 ? 40 : 520, i }); });   // 신데렐라는 호랑이 앞
      const tt = paper('rab_turtle_walk', 40, { order: 25 }); root.add(tt); actors.push({ p: tt, n: 'turtle', x: 440, y: 452, st: 2.5, from: 540, i: 4 });
      const bow = paper('pj3_tiger_bow', 98, { order: 22 }); root.add(bow); actors.tigerBow = bow;
      actors.stars = [0, 1, 2, 3, 4].map(i => { const p = paper('star_one', 22 + (i % 2) * 8, { anchor: 'center', order: 30, shadow: false }); root.add(p); return p; });
    }
    // 커튼: 로고처럼 왼쪽에 묶인 커튼(sp2_curtain_tied, 무대 그림에서 오린 것)이 늘 맨 앞. 움직이지 않는다(2026-10-30 사용자 결정)
    const tied = paper('sp2_curtain_tied', SH, { anchor: 'center', order: 25 });
    at(tied, BX + 507 * BK / 2, BY + SH / 2); root.add(tied);

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
      return { p, x: (x0 + x1) / 2, y: y1, fall: .36 + i * .06, land: [5, 5.15, 5.33][i] };
    });
    const logoC = toMark(L.size[0] / 2, L.size[1] / 2);

    let W = 1, H = 1, m0 = 1, m1 = 1, c1 = [256, 251], squeeze = 1;
    function layout() {
      m0 = logoWidth(W, H) / L.size[0] / sxl;   // CSS px / 마크 픽셀(로고 크기)
      const portrait = W < H;
      m1 = Math.min(.94 * H / 430, (portrait ? 1.22 : 1.2) * W / 405);
      c1 = [portrait ? 270 : 256, 251];
      squeeze = portrait ? .8 : 1;   // 세로 화면은 무대가 좁아 친구들 줄을 가운데로 모은다(왼쪽 커튼·오른쪽 끝에 가리지 않게)
    }
    // 마크 점 p 가 화면 가운데 기준 (p - c)·m 에 오도록
    const place = (g, m, cx, cy) => { g.scale.setScalar(m); g.position.set(-cx * m, cy * m, 0); };
    function zoomAt(t) { return t < 3 ? inout((t - .35) / .7) : 1 - inout((t - 4.45) / .7); }

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

      // 로고 마크 그림 ↔ 무대 층(같은 모습): 다가가는 중 .5~.75초, 뒤로 빠지는 중 4.5~4.75초에 넘긴다. 로고만 보일 땐 무대 층은 치운다
      const markIn = t < 3 ? 1 - smooth((t - .5) / .25) : smooth((t - 4.5) / .25), staged = markIn < 1;
      markPlane.visible = markIn > 0;
      day.m.visible = floor.m.visible = tied.visible = staged;
      // 밤 → 아침 → 밤: 달·별 그린 밤 하늘 막은 위로 걷혔다가(1~1.45초) 다시 내려온다(3.4~3.85초). 해는 그 사이 줄에 매달려 내려왔다 올라간다. 바닥은 그대로
      const nightUp = t < 3 ? inout((t - 1) / .45) : 1 - out((t - 3.4) / .45);
      night.m.visible = nightUp < 1 && staged;
      at(night.m, night.x, night.y - SH * nightUp);
      const sunUp = t < 3 ? 1 - inout((t - 1.05) / .42) : inout((t - 3.3) / .42);
      sun.visible = sunUp < 1 && staged;
      at(sun, 322, sunY - 330 * sunUp);
      rim.material.opacity = z;
      rim.visible = z > .01;
      // 날아가는 동안 크림 종이는 홈 바탕으로 녹아든다(구멍 바깥은 원래 마크 그림의 투명 여백)
      sheet.material.opacity = 1 - smooth((t - FLY_AT) / .3);
      sheet.visible = sheet.material.opacity > 0;
      markPlane.material.opacity = markIn * (flyRect ? 1 : sheet.material.opacity);
      renderer.setClearAlpha(sheet.material.opacity);

      for (const f of flaps) {
        const up = back((t - f.start) / f.dur) * (1 - inout((t - f.down) / .26));
        f.p.rotation.x = -Math.PI / 2 * (1 - Math.min(1, up)); f.p.scale.y = up > 1 ? up : 1; f.p.visible = up > .001;
      }
      const fold = (p, k) => { p.rotation.x = -Math.PI / 2 * k; p.visible = k < .999; };   // 접혀 눕기
      {
        const BOW = 2.95;
        actors.forEach(a => {
          const k = out((t - a.st) / .55), hop = Math.abs(Math.sin(Math.PI * k * 3)) * (1 - k);
          a.p.visible = t >= a.st;
          const ax = 300 + (a.x - 300) * squeeze;
          at(a.p, mix(a.from, ax, k), a.y - 9 * hop);
          const b = Math.sin(Math.PI * clamp((t - BOW - a.i * .05) / .55));   // 인사: 앞으로 숙였다(납작) 다시
          a.p.scale.set(1, 1 - .16 * b, 1);
          fold(a.p, inout((t - 3.95 - a.i * .04) / .26));
          if (!a.p.visible || t < a.st) a.p.visible = false;
          if (a.n === 'pj3_tiger_stand') { const bowing = b > .2; actors.tigerBow.visible = a.p.visible && bowing; at(actors.tigerBow, a.p.position.x, -a.p.position.y); actors.tigerBow.rotation.x = a.p.rotation.x; if (bowing) a.p.visible = false; }
        });
        if (t < BOW) actors.tigerBow.visible = false;
        actors.stars.forEach((p, i) => {
          const k = clamp((t - BOW - .1 - i * .06) / .7); p.visible = k > 0 && k < 1;
          at(p, 200 + i * 60 + 10 * Math.sin(i * 2), 330 - 90 * out(k) + (i % 2) * 20); p.scale.setScalar(Math.max(.001, Math.sin(Math.PI * k) * 1.3)); p.rotation.z = k * 3 + i;
        });
      }
      // 글자: 무대 소품과 같은 종이 판. 다가가기 시작하면 차례로 눕고, 로고 크기로 돌아오면 '톡'·'톡'·'동화극장' 차례로 일어선다
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
    for (const t of [.3, .6, 1.2, 1.8, 2.9, 3.5, 4.3, 4.6, 5.4]) renderAt(t);
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
