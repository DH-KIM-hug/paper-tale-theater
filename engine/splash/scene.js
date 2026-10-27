import * as THREE from './vendor/three.module.js';
import { ART } from './art.js?v=20261027letter1';

export const DURATION = 6.4;
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
      ownMaterial(new THREE.ShadowMaterial({ color: '#50402f', opacity: .13 }))
    );
    floor.position.z = -.75;
    floor.receiveShadow = true;
    scene.add(floor);

    // Fine paper fibers, deterministic so scrubbing/export never changes the surface.
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const context = canvas.getContext('2d');
    const pixels = context.createImageData(128, 128);
    let seed = 937;
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (seed * 16807) % 2147483647;
      const v = 235 + seed % 20;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = v;
      pixels.data[i + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    const grain = ownTexture(new THREE.CanvasTexture(canvas));
    grain.colorSpace = THREE.SRGBColorSpace;
    grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
    grain.repeat.set(4, 3);

    function paper(shape, color, depth = .035, texture = grain) {
      const mesh = new THREE.Mesh(
        ownGeometry(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 40 })),
        ownMaterial(new THREE.MeshStandardMaterial({ color, map: texture, roughness: 1, side: THREE.DoubleSide }))
      );
      mesh.castShadow = mesh.receiveShadow = true;
      return mesh;
    }
    function shapeFrom(draw) { const s = new THREE.Shape(); draw(s); return s; }
    // Newly illustrated transparent ground, shared at its natural aspect ratio.
    function ground(width) {
      const { box: [l, t, r, b] } = ART.sp_ground_meadow_v1;
      const mesh = cutout('sp_ground_meadow_v1', width * (b - t) / (r - l));
      mesh.castShadow = false;
      return mesh;
    }
    const loader = new THREE.TextureLoader();
    // All loads settle before cleanup, including the failed-load/early-skip path.
    const results = await Promise.allSettled(Object.keys(ART).filter(name => name !== 'sp_wordmark_v1' || lang !== 'en').map(async name => {
      const map = await loader.loadAsync(artURL(name));
      if (disposed) { map.dispose(); return null; }
      ownTexture(map);
      // The originals remain untouched. A bounded GPU copy is enough for these small paper actors.
      const image = map.image;
      const edge = name === 'sp_ground_meadow_v1' || name === 'sp_wordmark_v1' ? 1536 : name === 'sp_castle_v1' ? 1024 : 768;
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
    function place(group, mesh, x, y, z, start, { tilt = 0, from = 'top', drop = 7 } = {}) {
      const pivot = new THREE.Group();
      pivot.add(mesh);
      group.add(pivot);
      animated.push({ pivot, x, y, z, start, tilt, from, drop });
      return pivot;
    }

    // No enclosure, no frame: the landscape itself is the falling paper.
    const common = new THREE.Group(), forest = new THREE.Group(), garden = new THREE.Group();
    world.add(common, forest, garden);
    const cloud = place(common, cutout('rab_cloud_small', .85), -3.6, 2.5, -.3, .08, { tilt: -.12 });
    place(common, cutout('rab_sun_small', 1.25), 3.55, 2.6, -.3, .2, { tilt: .18 });
    place(common, cutout('rab_cloud_small', .55), 4.8, 1.6, -.1, .42, { tilt: -.1 });

    const hillFar = paper(shapeFrom(s => {
      s.moveTo(-5.9, -1.9);
      s.bezierCurveTo(-6.2, -1, -4.4, 1.2, -2.3, .5);
      s.bezierCurveTo(-.7, .05, .1, .7, 1.7, .7);
      s.bezierCurveTo(4.6, .8, 6.1, -.8, 5.9, -1.9);
      s.bezierCurveTo(3.7, -2.8, -4, -2.8, -5.9, -1.9);
    }), '#bbce9a');
    place(forest, hillFar, 0, -.25, -.2, .05, { tilt: -.075 });
    const meadow = ground(11.3);
    place(forest, meadow, 0, -1.55, .05, .25, { tilt: .06 });
    const tree = place(forest, cutout('rp_layer_tree_front', 4.4), -4.45, .6, .2, .38, { tilt: -.12 });
    place(forest, cutout('rab_layer_flower_bush_front', 1.2), -3.7, -1.7, .65, .65, { tilt: -.07 });
    place(forest, cutout('rab_layer_grass_front', 1), 4.6, -1.7, .65, .72, { tilt: .09 });
    place(forest, cutout('cf4_prop_grass_tuft', .32), -2.25, -2.27, .7, .76, { tilt: -.04 });
    place(forest, cutout('cf4_prop_grass_tuft', .4), 3.35, -2.15, .7, .81, { tilt: .05 });
    const rabbit = cutout('rab_rabbit_run_c', 2.35);
    forest.add(rabbit);
    const turtle = cutout('rab_turtle_walk', 1.55);
    forest.add(turtle);

    // A paper castle garden, built around existing tower/flower/character cutouts.
    const lawn = ground(11.4);
    place(garden, lawn, 0, -1.65, .03, 2.65, { tilt: -.06 });
    // A complete newly illustrated paper castle replaces the block wall and reused towers.
    const palace = cutout('sp_castle_v1', 4.9);
    place(garden, palace, 0, .8, -.2, 2.6, { tilt: .055 });
    place(garden, cutout('cf4_prop_grass_tuft', .34), -1.25, -2.29, .91, 3.1, { tilt: -.04 });
    place(garden, cutout('cf4_prop_grass_tuft', .3), 2.7, -2.08, .91, 3.2, { tilt: .04 });
    const princesses = new THREE.Group();
    garden.add(princesses);
    const princessArt = [cutout('cd2_cind_gown', 3.2), cutout('sw_snow_stand', 3.2), cutout('sb_pr_wave', 3.2)];
    princessArt.forEach((mesh, i) => {
      place(princesses, mesh, (i - 1) * 2.2, -.12, .36 + i * .03, 3.04 + i * .13, { from: 'bottom', drop: 1.6, tilt: (1 - i) * .035 });
    });
    const roseL = place(garden, cutout('sb_layer_rose_bush', 1.1), -4.05, -1.65, .9, 2.98, { tilt: -.08 });
    const roseR = place(garden, cutout('rp_layer_flowers_front_a', 1.25), 4.1, -1.65, .9, 3.08, { tilt: .08 });
    const flowerBand = place(garden, cutout('rp_layer_flower_band_mid', .9), 0, -2.15, .82, 3.17, { tilt: -.035 });

    // Final title is an open composition, not another card arriving in front of the story.
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
      const { box: [l, t, r, b] } = ART.sp_wordmark_v1;
      wordmark = cutout('sp_wordmark_v1', 5.2 * (b - t) / (r - l));
      wordmark.material.depthWrite = false;
      wordmark.castShadow = false;
      wordmark.position.set(0, .85, 1.02); logo.add(wordmark);
    }
    const titlePieces = wordmark ? [wordmark] : [tok, title];
    const book = new THREE.Group(); logo.add(book); book.position.set(0, 2.25, .95);
    const pageL = paper(shapeFrom(s => { s.moveTo(-.65, .17); s.quadraticCurveTo(-.25, .23, 0, .04); s.lineTo(0, -.3); s.quadraticCurveTo(-.3, -.1, -.65, -.16); s.closePath(); }), '#8fa67d');
    const pageR = paper(shapeFrom(s => { s.moveTo(.65, .17); s.quadraticCurveTo(.25, .23, 0, .04); s.lineTo(0, -.3); s.quadraticCurveTo(.3, -.1, .65, -.16); s.closePath(); }), '#dbbc80');
    book.add(pageL, pageR);
    const finalRabbit = cutout('rab_rabbit_congrats_c', 1.55);
    finalRabbit.position.set(-2.2, -1.75, .28); finalRabbit.scale.x = -1; logo.add(finalRabbit);
    const finalTurtle = cutout('rab_turtle_walk', 1.05);
    finalTurtle.position.set(2.1, -1.9, .28); finalTurtle.scale.x = -1; logo.add(finalTurtle);
    const footerFlowerL = cutout('rp_layer_flowers_front_a', .9);
    const footerFlowerR = cutout('rab_layer_grass_front', .85);
    footerFlowerL.position.set(-3.9, -2, .3); footerFlowerR.position.set(3.9, -2, .3);
    logo.add(footerFlowerL, footerFlowerR);
    // Two small pieces of grass under the friends leave the title's center open.
    const finalMeadow = new THREE.Group();
    const rabbitGrass = ground(2.5);
    rabbitGrass.position.set(-2.2, -.18, 0);
    const turtleGrass = ground(2.3);
    turtleGrass.position.set(2.1, -.07, 0);
    finalMeadow.add(rabbitGrass, turtleGrass);
    finalMeadow.position.set(0, -2.34, .06); logo.add(finalMeadow);

    const gardenPieces = animated.filter(a => a.pivot.parent === garden);
    let width = 1, height = 1;
    function renderAt(time) {
      if (disposed) return;
      current = Math.max(0, Math.min(DURATION, time));
      const t = current;
      const portrait = camera.aspect < 1;
      const change = smooth((t - 2.55) / .9);
      const finish = smooth((t - 4.55) / 1.0);
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
      forest.position.set(-12 * change, -.2 * change, 0);
      forest.rotation.z = .055 * change;
      // The rabbit joins the slower turtle, then the whole forest clears to the left.
      const run = smooth((t - .88) / 1.2);
      rabbit.visible = t >= .88;
      rabbit.position.set(mix(-6.7, -.85, run), -1.05 + .18 * Math.sin(Math.PI * clamp((t - .88) / .5)) + .12 * Math.sin(Math.PI * clamp((t - 1.45) / .5)), .5);
      rabbit.rotation.z = .025 * Math.sin(Math.PI * run * 4) * (1 - run);
      const walk = smooth((t - .95) / 1.4);
      turtle.visible = t >= .95;
      turtle.position.set(mix(3.7, 1.95, walk), -1.42 + .025 * Math.sin(walk * Math.PI * 4), .55);
      turtle.scale.x = -1;
      garden.visible = t >= 2.6 && finish < 1;
      garden.position.set(0, 0, 0);
      // After the greeting, the garden splits around the open title instead of being covered by a plaque.
      for (const a of gardenPieces) {
        const direction = a.x === 0 ? (a.pivot === flowerBand ? -1 : 1) : Math.sign(a.x);
        a.pivot.position.x += direction * 10 * finish;
        a.pivot.rotation.z += direction * finish * .08;
      }
      princesses.position.y = -6 * finish;
      princesses.rotation.z = -.03 * finish;
      floor.position.z = mix(-.75, -.04, finish);
      common.position.y = (portrait ? 1.5 : 0) - finish * .25;
      common.scale.setScalar(1 - .2 * finish);
      cloud.rotation.z = Math.sin(t * .7) * .018;
      logo.visible = t >= 4.85;
      const reveal = smooth((t - 4.85) / .95);
      logo.position.y = -.3 * (1 - reveal);
      logo.scale.setScalar((.94 + .06 * reveal) * (portrait ? 1.22 : 1));
      if (wordmark) wordmark.position.y = portrait ? .65 : .85;
      else {
        tok.position.y = portrait ? 1.2 : 1;
        title.position.y = portrait ? -.05 : -.18;
      }
      book.position.y = portrait ? (wordmark ? 3.2 : 3) : wordmark ? 3.05 : 2.25;
      finalRabbit.position.y = portrait ? -2.4 : -1.75;
      finalTurtle.position.y = portrait ? -2.55 : -1.9;
      footerFlowerL.position.y = footerFlowerR.position.y = portrait ? -2.65 : -2;
      finalMeadow.position.y = portrait ? -3 : -2.34;
      finalMeadow.scale.setScalar(reveal);
      for (const mesh of titlePieces) mesh.material.opacity = reveal;
      book.scale.setScalar(reveal);
      for (const mesh of [finalRabbit, finalTurtle, footerFlowerL, footerFlowerR]) {
        mesh.material.opacity = reveal;
        mesh.visible = reveal > 0;
      }
      // Slight parallax while the paper is assembling; a still, readable finish.
      const view = 1 - smooth(t / 2.7);
      camera.position.set(view * 1.8, view * 1.1 + .2, 20);
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
      const halfHeight = portrait ? Math.max(6.2, 6.55 / camera.aspect) : 5.3;
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
