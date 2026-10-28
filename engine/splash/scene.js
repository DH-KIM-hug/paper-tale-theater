import * as THREE from './vendor/three.module.js';
import { ART } from './art.js?v=20261028c2final1';

export const DURATION = 7.4;
const CREAM = '#F5EFE9';
const clamp = x => Math.max(0, Math.min(1, x));
const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const out = x => 1 - Math.pow(1 - clamp(x), 3);
const mix = THREE.MathUtils.lerp;
const artURL = name => new URL(`../../assets/v3w/${name}.webp`, import.meta.url).href;

/** One seekable paper world, shared by the actual app and the review page. */
export async function createSplashScene(host, { lang = 'ko', signal, onPreparing = () => {} } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(CREAM, 1);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const world = new THREE.Group();
  scene.add(world);
  const camera = new THREE.PerspectiveCamera(33, 1, .1, 60);
  const textures = new Set();
  const geometries = new Set();
  const materials = new Set();
  let disposed = false, preparing = false, released = false, current = 0;
  const ownTexture = t => { textures.add(t); return t; };
  const ownMaterial = m => { materials.add(m); return m; };
  const ownGeometry = g => { geometries.add(g); return g; };
  const release = () => {
    if (released || preparing) return;
    released = true;
    for (const x of geometries) x.dispose();
    for (const x of materials) x.dispose();
    for (const x of textures) x.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
  const destroy = () => {
    if (disposed) return;
    disposed = true;
    signal?.removeEventListener('abort', destroy);
    observer?.disconnect();
    renderer.domElement.remove();
    // compileAsync polls material programs internally; release them only after it settles.
    release();
  };
  let observer;
  if (signal?.aborted) { destroy(); throw new DOMException('Aborted', 'AbortError'); }
  signal?.addEventListener('abort', destroy, { once: true });

  try {
    scene.add(new THREE.AmbientLight(0xfffaf3, 2));
    const key = new THREE.DirectionalLight(0xfff4df, 1.25);
    key.position.set(-3, 7, 13);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10, near: 1, far: 30 });
    key.shadow.bias = -.0005;
    key.shadow.normalBias = .018;
    key.shadow.radius = 3;
    scene.add(key);
    const floor = new THREE.Mesh(
      ownGeometry(new THREE.PlaneGeometry(70, 60)),
      ownMaterial(new THREE.ShadowMaterial({ color: '#50402f', opacity: .035 }))
    );
    floor.position.z = -.75;
    floor.receiveShadow = true;
    scene.add(floor);

    // Newly illustrated transparent ground, shared at its natural aspect ratio.
    function ground(width) {
      const { box: [l, t, r, b] } = ART.sp_ground_meadow_v1;
      const mesh = cutout('sp_ground_meadow_v1', width * (b - t) / (r - l));
      mesh.castShadow = false;
      return mesh;
    }
    const loader = new THREE.TextureLoader();
    // All loads settle before cleanup, including the failed-load/early-skip path.
    const results = await Promise.allSettled(Object.keys(ART).filter(name => name !== 'sp_logo_c2_v1' || lang !== 'en').map(async name => {
      const map = await loader.loadAsync(artURL(name));
      if (disposed) { map.dispose(); return null; }
      ownTexture(map);
      // The originals remain untouched. A bounded GPU copy is enough for these small paper actors.
      const image = map.image;
      const edge = name === 'sp_ground_meadow_v1' || name === 'sp_logo_c2_v1' ? 1536 : name === 'sp_castle_v1' ? 1024 : 768;
      const scale = Math.min(1, edge / Math.max(image.width, image.height));
      if (scale < 1) {
        const reduced = document.createElement('canvas');
        reduced.width = Math.round(image.width * scale);
        reduced.height = Math.round(image.height * scale);
        reduced.getContext('2d').drawImage(image, 0, 0, reduced.width, reduced.height);
        map.image = reduced;
        map.needsUpdate = true;
      }
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      const { size: [w, h], box: [l, t, r, b] } = ART[name];
      map.offset.set(l / w, 1 - b / h);
      map.repeat.set((r - l) / w, (b - t) / h);
      return [name, map];
    }));
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    const failed = results.find(r => r.status === 'rejected');
    if (failed) throw failed.reason;
    const maps = new Map(results.map(r => r.value));
    function cutout(name, height) {
      const { box: [l, t, r, b] } = ART[name];
      const map = maps.get(name);
      const mesh = new THREE.Mesh(
        ownGeometry(new THREE.PlaneGeometry(height * (r - l) / (b - t), height)),
        // Retain the exact colors in the existing art, instead of bleaching it with stage lights.
        ownMaterial(new THREE.MeshBasicMaterial({ map, alphaTest: .12, transparent: true, side: THREE.DoubleSide, toneMapped: false }))
      );
      mesh.castShadow = true;
      mesh.customDepthMaterial = ownMaterial(new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map, alphaTest: .12 }));
      return mesh;
    }
    const animated = [];
    function place(group, mesh, x, y, z, start, { tilt = 0, from = 'top', drop = 1.1 } = {}) {
      const pivot = new THREE.Group();
      pivot.add(mesh);
      group.add(pivot);
      animated.push({ pivot, x, y, z, start, tilt, from, drop });
      return pivot;
    }

    // No enclosure, no frame: the landscape itself is the falling paper.
    const landscape = new THREE.Group(), foliage = new THREE.Group(), forest = new THREE.Group(), garden = new THREE.Group();
    world.add(landscape, foliage, forest, garden);
    const meadow = ground(11.3);
    place(landscape, meadow, 0, -1.55, .05, .12, { tilt: .015, drop: .45 });
    place(forest, cutout('rp_layer_tree_front', 4.4), -4.45, .6, .2, .25, { tilt: -.025, drop: 1.4 });
    place(foliage, cutout('rab_layer_flower_bush_front', 1.2), -3.7, -1.7, .65, .38, { tilt: -.02, drop: .5 });
    place(foliage, cutout('rab_layer_grass_front', 1), 4.6, -1.7, .65, .45, { tilt: .02, drop: .5 });
    place(landscape, cutout('cf4_prop_grass_tuft', .32), -2.25, -2.27, .7, .76, { tilt: -.04 });
    place(landscape, cutout('cf4_prop_grass_tuft', .4), 3.35, -2.15, .7, .81, { tilt: .05 });
    const rabbit = cutout('rab_rabbit_run_c', 2.35);
    forest.add(rabbit);
    const turtle = cutout('rab_turtle_walk', 1.55);
    forest.add(turtle);

    // A castle and three actors share the existing paper stage.
    // Keep the same stage floor and foreground foliage through both stories.
    // A complete newly illustrated paper castle replaces the block wall and reused towers.
    const palace = cutout('sp_castle_v1', 4.9);
    place(garden, palace, 0, .8, .15, 2.65, { tilt: .015, drop: .8 });
    const princesses = new THREE.Group();
    garden.add(princesses);
    const princessArt = [cutout('cd2_cind_gown', 3.2), cutout('sw_snow_stand', 3.2), cutout('sb_pr_wave', 3.2)];
    princessArt.forEach((mesh, i) => {
      place(princesses, mesh, (i - 1) * 2.2, -.12, .36 + i * .03, 3.04 + i * .13, { from: 'bottom', drop: .6, tilt: (1 - i) * .035 });
    });

    // Complete symbol + wordmark lockup, presented alone at the end.
    // Korean is a custom-drawn asset, independent of font loading. Keep the English title local.
    if (lang === 'en') await Promise.race([document.fonts.load('750 90px "Pretendard Local"'), new Promise(resolve => setTimeout(resolve, 700))]);
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    const logo = new THREE.Group();
    world.add(logo);
    function textPiece(text, size, color, width) {
      const c = document.createElement('canvas'); c.width = 1536; c.height = 512;
      const x = c.getContext('2d');
      x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `800 ${size}px "Pretendard Local", sans-serif`;
      x.fillText(text, 768, 270);
      const map = ownTexture(new THREE.CanvasTexture(c)); map.colorSpace = THREE.SRGBColorSpace;
      const mesh = new THREE.Mesh(ownGeometry(new THREE.PlaneGeometry(width, width / 3)), ownMaterial(new THREE.MeshBasicMaterial({ map, transparent: true, toneMapped: false, depthWrite: false })));
      return mesh;
    }
    let tok, title, wordmark;
    if (lang === 'en') {
      tok = textPiece('Tok Tok', 240, '#A9583F', 7.6);
      tok.position.set(0, 1.0, 1.0); logo.add(tok);
      title = textPiece('Tale Theater', 155, '#65513F', 7.4);
      title.position.set(0, -.18, 1.02); logo.add(title);
    } else {
      wordmark = cutout('sp_logo_c2_v1', 4.6);
      wordmark.material.depthWrite = false;
      wordmark.castShadow = false;
      wordmark.position.set(0, .85, 1.02); logo.add(wordmark);
    }
    const titlePieces = wordmark ? [wordmark] : [tok, title];
    const friends = new THREE.Group(); world.add(friends);
    const finalRabbit = cutout('rab_rabbit_congrats_c', 1.45);
    finalRabbit.position.set(-3.65, -2.08, .6); finalRabbit.scale.x = -1;
    const finalTurtle = cutout('rab_turtle_walk', 1);
    finalTurtle.position.set(3.65, -2.3, .6); finalTurtle.scale.x = -1;
    friends.add(finalRabbit, finalTurtle);
    // One persistent stage; only the cast and scenery change.
    const forestMeshes = [];
    forest.traverse(o => { if (o.isMesh) forestMeshes.push(o); });
    let width = 1, height = 1;
    function renderAt(time) {
      if (disposed) return;
      current = Math.max(0, Math.min(DURATION, time));
      const t = current;
      const portrait = camera.aspect < 1;
      const change = smooth((t - 2.55) / .9);
      const finish = smooth((t - 4.55) / 1.0);
      const clearStage = smooth((t - 5.7) / .65);
      for (const a of animated) {
        const p = out((t - a.start) / (a.from === 'bottom' ? .55 : .85));
        a.pivot.visible = t >= a.start;
        a.pivot.position.set(a.x + (1 - p) * a.tilt * 3, a.y + (1 - p) * a.drop * (a.from === 'bottom' ? -1 : 1), a.z + (1 - p) * .8);
        a.pivot.rotation.set((1 - p) * -.18, (1 - p) * a.tilt, (1 - p) * a.tilt);
        if (a.from === 'bottom') {
          const opacity = smooth((t - a.start) / .2);
          const mesh = a.pivot.children[0];
          mesh.material.opacity = opacity;
          mesh.customDepthMaterial.opacity = opacity;
        }
      }
      forest.visible = t < 3.45;
      forest.position.set(-1.4 * change, 0, 0);
      for (const mesh of forestMeshes) { mesh.material.opacity = 1 - change; mesh.castShadow = change < .4; }
      forest.rotation.z = 0;
      landscape.visible = true;
      landscape.scale.setScalar(mix(1, .85, finish));
      landscape.position.y = -.75 * finish;
      foliage.scale.setScalar(mix(1, .85, finish));
      foliage.position.y = -.75 * finish;
      // The rabbit joins the slower turtle, then the forest gently dissolves.
      const run = smooth((t - .88) / 1.2);
      rabbit.visible = t >= .88;
      rabbit.position.set(mix(-6.7, -.85, run), -1.05 + .18 * Math.sin(Math.PI * clamp((t - .88) / .5)) + .12 * Math.sin(Math.PI * clamp((t - 1.45) / .5)), .5);
      rabbit.rotation.z = .025 * Math.sin(Math.PI * run * 4) * (1 - run);
      const walk = smooth((t - .95) / 1.4);
      turtle.visible = t >= .95;
      turtle.position.set(mix(3.7, 1.95, walk), -1.42 + .025 * Math.sin(walk * Math.PI * 4), .55);
      turtle.scale.x = -1;
      garden.visible = t >= 2.65;
      // First frame the logo with the miniature stage, then leave the logo alone.
      garden.scale.setScalar(mix(1, .53, finish));
      garden.position.set(0, -2.05 * finish, 0);
      for (const group of [landscape, foliage, garden]) {
        group.visible = (group !== garden || t >= 2.65) && clearStage < 1;
        group.traverse(mesh => {
          if (!mesh.isMesh) return;
          const arrival = mesh.parent.parent === princesses ? smooth((t - (3.04 + princessArt.indexOf(mesh) * .13)) / .2) : 1;
          mesh.material.opacity = arrival * (1 - clearStage);
          mesh.castShadow = clearStage < .4;
        });
      }
      floor.position.z = -.75;
      logo.visible = t >= 4.85;
      const reveal = smooth((t - 4.85) / .65);
      logo.position.y = mix(1.6, .2, clearStage) - .12 * (1 - reveal);
      logo.scale.setScalar(mix(.78, 1, clearStage) * (.985 + .015 * reveal));
      if (wordmark) wordmark.position.y = 0;
      else {
        tok.position.y = .6;
        title.position.y = -.6;
      }
      for (const mesh of titlePieces) mesh.material.opacity = reveal;
      friends.visible = reveal > 0 && clearStage < 1;
      for (const mesh of [finalRabbit, finalTurtle]) {
        mesh.material.opacity = reveal * (1 - clearStage);
        mesh.castShadow = reveal > .6 && clearStage < .4;
      }
      // Slight parallax while the paper is assembling; a still, readable finish.
      const view = 1 - smooth(t / 1.8);
      camera.position.set(view * .35, view * .2 + .2, 20);
      camera.lookAt(0, .15, 0);
      renderer.render(scene, camera);
    }
    function resize(draw = true) {
      if (disposed) return;
      width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight);
      const pixelRatio = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(1800000 / (width * height)));
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      const portrait = camera.aspect < 1;
      // Keep paper, faces and the title inside a central safe area on phone and iPad.
      const halfHeight = portrait ? Math.max(5.8, 5.6 / camera.aspect) : 5.3;
      camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(halfHeight / 20));
      camera.updateProjectionMatrix();
      if (draw) renderAt(current);
    }
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    onPreparing();
    // Warm the whole story before its clock starts, including the shadow/depth variants
    // and the logo that would otherwise compile/upload for the first time at 4.85 seconds.
    resize(false);
    for (const texture of textures) renderer.initTexture(texture);
    preparing = true;
    try { await renderer.compileAsync(scene, camera); }
    finally { preparing = false; if (disposed) release(); }
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    // Warm the real canvas, still detached from the DOM. A tiny offscreen target has
    // different output/shader variants and would leave the visible canvas's first use cold.
    for (const t of [.3, .75, 1.8, 3.3, 4.2, 5.2, 6.3]) renderAt(t);
    // Flush first-use GPU work while the static title is still showing. Polling a fence
    // yields to input, so an early tap can abort the warm-up rather than waiting on it.
    const gl = renderer.getContext();
    const fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (fence) {
      gl.flush();
      try {
        await new Promise(resolve => {
          const check = () => {
            if (disposed) { resolve(); return; }
            const state = gl.clientWaitSync(fence, 0, 0);
            if (state === gl.TIMEOUT_EXPIRED) setTimeout(check, 8);
            else resolve();
          };
          check();
        });
      } finally { if (!disposed) gl.deleteSync(fence); }
    }
    if (disposed) throw new DOMException('Aborted', 'AbortError');
    renderAt(0);
    host.append(renderer.domElement);
    observer = new ResizeObserver(() => resize()); observer.observe(host);
    return { renderAt, destroy, duration: DURATION, renderer };
  } catch (error) {
    destroy();
    throw error;
  }
}
