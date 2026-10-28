/** App lifecycle: skip immediately, never block the home on WebGL or artwork loading. */
// 앱과 미리보기 모두 scene.duration의 원래 속도로 재생한다. 별도 압축 시간은 두지 않는다.
export function startSplash(host, { lang = 'ko', onDone = () => {} } = {}) {
  const en = lang === 'en';
  let closed = false, raf = 0, timer = 0, loadTimer = 0, scene;
  const abort = new AbortController();
  const beforeFocus = document.activeElement;
  const background = [...document.body.children].filter(el => el !== host && !['SCRIPT', 'STYLE', 'SVG'].includes(el.tagName));
  const inertBefore = background.map(el => el.inert);
  background.forEach(el => { el.inert = true; });
  host.style.opacity = '';
  host.hidden = false;
  host.setAttribute('aria-hidden', 'false');
  host.setAttribute('role', 'dialog');
  host.setAttribute('aria-modal', 'true');
  host.setAttribute('aria-label', en ? 'Tok Tok Tale Theater' : '톡톡 동화극장');
  host.innerHTML = '<div class="splash-stage" aria-hidden="true"></div><div class="splash-fallback"><strong></strong></div><button class="splash-skip" type="button"></button>';
  const fallbackTitle = host.querySelector('strong');
  if (en) fallbackTitle.textContent = 'Tok Tok Tale Theater';
  else {
    const wordmark = document.createElement('img');
    wordmark.className = 'splash-wordmark';
    wordmark.src = new URL('../../assets/v3w/sp_logo_c2_b_light_v1.webp', import.meta.url).href;
    wordmark.alt = '톡톡 동화극장';
    fallbackTitle.replaceWith(wordmark);
  }
  const skip = host.querySelector('button');
  skip.setAttribute('aria-label', en ? 'Start' : '시작');   // 글자는 보이지 않는다(저절로 끝남). 보조기기·키보드용 이름만
  skip.focus({ preventScroll: true });
  function finish() {
    if (closed) return;
    closed = true;
    clearTimeout(timer); clearTimeout(loadTimer); cancelAnimationFrame(raf);
    abort.abort(); scene?.destroy();
    host.removeEventListener('pointerdown', finish);
    host.removeEventListener('keydown', onKey);
    host.removeEventListener('webglcontextlost', finish, true);
    document.removeEventListener('visibilitychange', visibility);
    host.style.opacity = '';
    host.hidden = true;
    host.setAttribute('aria-hidden', 'true');
    host.classList.remove('splash-ready');
    host.replaceChildren();
    background.forEach((el, i) => { el.inert = inertBefore[i]; });
    onDone();
    if (beforeFocus && beforeFocus !== document.body && beforeFocus.isConnected) beforeFocus.focus({ preventScroll: true });
  }
  function onKey(e) {
    if (['Escape', 'Enter', ' '].includes(e.key)) { e.preventDefault(); finish(); }
    if (e.key === 'Tab') { e.preventDefault(); skip.focus(); }
  }
  function visibility() { if (document.hidden) finish(); }
  host.addEventListener('pointerdown', finish);
  skip.addEventListener('click', finish);
  host.addEventListener('keydown', onKey);
  host.addEventListener('webglcontextlost', finish, true);
  document.addEventListener('visibilitychange', visibility);
  // A hard upper bound also covers a stalled module download/first shader compilation.
  timer = setTimeout(finish, 12000);
  loadTimer = setTimeout(finish, 2800);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearTimeout(loadTimer); clearTimeout(timer);
    timer = setTimeout(finish, 500);
    return { finish };
  }
  import('./scene.js?v=20261028c2ab2').then(async ({ createSplashScene }) => {
    if (closed) return;
    const building = createSplashScene(host.querySelector('.splash-stage'), {
      lang, signal: abort.signal,
      onPreparing: () => {
        // Downloads and GPU preparation are separate, bounded stages. The 12s outer
        // watchdog still covers the entire preparation, and taps remain enabled.
        if (closed) return;
        clearTimeout(loadTimer);
        loadTimer = setTimeout(finish, 2800);
      }
    });
    // GPU initialization can be synchronous; give the subsequent artwork loads their own budget.
    clearTimeout(loadTimer);
    loadTimer = setTimeout(finish, 2800);
    const result = await building;
    if (closed) { result.destroy(); return; }
    scene = result;
    clearTimeout(loadTimer);
    clearTimeout(timer);
    const total = scene.duration;
    timer = setTimeout(finish, (total + .6) * 1000);
    host.classList.add('splash-ready');
    let started;
    const frame = now => {
      if (closed) return;
      started ??= now;
      const t = (now - started) / 1000;
      scene.renderAt(Math.min(t, scene.duration));
      if (t > total - .24) host.style.opacity = String(Math.max(0, (total - t) / .24));
      if (t >= total) { finish(); return; }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  }).catch(() => {
    if (closed) return;
    clearTimeout(loadTimer); clearTimeout(timer);
    timer = setTimeout(finish, 500);
  });
  return { finish };
}
