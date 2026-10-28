// Browser smoke checks for the startup lifecycle. Run with Playwright available on NODE_PATH.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.SPLASH_BASE || 'http://127.0.0.1:8879';
(async () => {
  const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--enable-webgl', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const errors = [];
  async function run(name, task, options = {}) {
    if (process.env.SPLASH_CASE && !name.includes(process.env.SPLASH_CASE)) return;
    const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, ...options });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
    try { await task(page, context); console.log('PASS ' + name); }
    finally { await context.close(); }
  }
  try {
    await run('skip, release background, and restore home', async page => {
      await page.goto(base + '/?splash=1');
      await page.locator('#splash.splash-ready').waitFor({ timeout: 15000 });
      assert.equal(await page.locator('#splash canvas').count(), 1);
      assert.equal(await page.locator('#splash .splash-wordmark').getAttribute('alt'), '톡톡 동화극장');
      await page.getByRole('button', { name: '시작', exact: true }).click();
      await page.locator('#splash').waitFor({ state: 'hidden' });
      assert.equal(await page.locator('#splash canvas').count(), 0);
      assert.equal(await page.locator('[inert]').count(), 0);
      assert.ok(await page.locator('#hero').isVisible());
    });
    await run('automatic finish, once per app session', async page => {
      await page.addInitScript(() => {
        window.__splashTiming = {};
        new MutationObserver(() => {
          const sp = document.querySelector('#splash'), timing = window.__splashTiming;
          if (sp && !sp.hidden && sp.classList.contains('splash-ready')) timing.ready ??= performance.now();
          if (timing.ready !== undefined && sp?.hidden) timing.ended ??= performance.now();
        }).observe(document, { subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
      });
      await page.goto(base + '/?store=1');
      await page.locator('#splash.splash-ready').waitFor({ timeout: 15000 });
      await page.locator('#splash').waitFor({ state: 'hidden', timeout: 12000 });
      const elapsed = await page.evaluate(() => window.__splashTiming.ended - window.__splashTiming.ready);
      assert.ok(elapsed >= 7100 && elapsed < 9500, `Expected native-speed 7.4s playback, got ${elapsed}ms`);
      console.log(`  Playback measured: ${(elapsed / 1000).toFixed(2)}s`);
      assert.equal(await page.locator('#splash canvas').count(), 0);
      await page.reload();
      await page.waitForFunction(() => document.querySelector('#hero') && !document.querySelector('#hero').hidden);
      assert.ok(await page.locator('#splash').isHidden());
      assert.equal(await page.locator('#splash canvas').count(), 0);
    });
    await run('tap during module loading never starts late', async page => {
      await page.route('**/engine/splash/start.js*', async route => { await new Promise(r => setTimeout(r, 800)); await route.continue(); });
      await page.goto(base + '/?splash=1');
      await page.locator('#splash').click({ position: { x: 100, y: 100 } });
      await page.locator('#splash').waitFor({ state: 'hidden' });
      await page.waitForTimeout(1000);
      assert.equal(await page.locator('#splash canvas').count(), 0);
      assert.ok(await page.locator('#hero').isVisible());
    });
    await run('missing WebGL module falls through to home', async page => {
      await page.route('**/engine/splash/vendor/three.module.js', route => route.abort());
      await page.goto(base + '/?splash=1');
      await page.locator('#splash').waitFor({ state: 'hidden', timeout: 12000 });
      assert.ok(await page.locator('#hero').isVisible());
      assert.equal(await page.locator('[inert]').count(), 0);
    });
    await run('reduced motion does not request Three.js', async page => {
      let requested = false;
      page.on('request', r => { if (r.url().includes('/splash/scene.js')) requested = true; });
      await page.goto(base + '/?splash=1');
      await page.locator('#splash').waitFor({ state: 'hidden', timeout: 10000 });
      assert.equal(requested, false);
      assert.ok(await page.locator('#hero').isVisible());
    }, { reducedMotion: 'reduce' });
    await run('ordinary web opens home without splash download', async page => {
      let requested = false;
      page.on('request', r => { if (r.url().includes('/engine/splash/')) requested = true; });
      await page.goto(base + '/');
      assert.ok(await page.locator('#splash').isHidden());
      assert.equal(requested, false);
    });
    await run('all scenes are warmed before playback', async page => {
      await page.goto(base + '/');
      const stats = await page.evaluate(async () => {
        const { createSplashScene } = await import('/engine/splash/scene.js');
        const host = document.createElement('div');
        host.style.cssText = 'position:fixed;inset:0';
        document.body.append(host);
        const scene = await createSplashScene(host);
        try {
          const before = scene.renderer.info.programs.length;
          const textures = scene.renderer.info.memory.textures;
          for (const time of [.1, .4, .75, 1.1, 2.1, 2.8, 3.2, 4.2, 4.9, 5.4, 6.4]) scene.renderAt(time);
          return { before, after: scene.renderer.info.programs.length, textures, afterTextures: scene.renderer.info.memory.textures };
        } finally { scene.destroy(); host.remove(); }
      });
      assert.ok(stats.before > 0);
      assert.equal(stats.after, stats.before, 'A shader compiled during playback');
      assert.equal(stats.afterTextures, stats.textures, 'A texture uploaded during playback');
    });
    await run('skip during GPU preparation cleans up', async page => {
      await page.goto(base + '/');
      const result = await page.evaluate(async () => {
        const { createSplashScene } = await import('/engine/splash/scene.js');
        const host = document.createElement('div');
        host.style.cssText = 'position:fixed;inset:0'; document.body.append(host);
        const controller = new AbortController();
        try {
          const scene = await createSplashScene(host, {
            signal: controller.signal,
            onPreparing: () => setTimeout(() => controller.abort(), 0)
          });
          scene.destroy(); return { aborted: false };
        } catch (error) {
          return { aborted: error.name === 'AbortError', canvases: host.querySelectorAll('canvas').length };
        } finally { host.remove(); }
      });
      assert.deepEqual(result, { aborted: true, canvases: 0 });
    });
    await run('English title works without the Korean lettering image', async page => {
      let loadedKorean = false;
      page.on('request', r => { if ((/sp_(wordmark|logo)_/.test(r.url()))) loadedKorean = true; });
      await page.goto(base + '/docs/intro-three/?export=1&lang=en');
      await page.waitForFunction(() => window.introReady, null, { timeout: 20000 });
      await page.evaluate(() => window.renderAt(window.introDuration));
      await page.screenshot({ path: '/tmp/patjuk-intro-render/splash-english.png' });
      assert.equal(loadedKorean, false);
    });
    await run('phone portrait and scrub reach final title', async page => {
      await page.goto(base + '/docs/intro-three/');
      await page.waitForFunction(() => window.introReady, null, { timeout: 20000 });
      const duration = await page.evaluate(() => window.introDuration);
      await page.getByRole('slider').fill(String(duration));
      await page.screenshot({ path: '/tmp/patjuk-intro-render/splash-portrait.png' });
      assert.equal(await page.locator('#time').textContent(), `${duration.toFixed(1)} / ${duration.toFixed(1)}`);
    }, { viewport: { width: 390, height: 844 } });
    assert.deepEqual(errors, []);
    console.log('All splash lifecycle checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
