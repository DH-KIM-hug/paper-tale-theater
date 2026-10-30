/** App lifecycle: skip immediately, never block the home on WebGL or artwork loading. */
// 앱과 미리보기 모두 scene.duration 을 SLOW 배 늘려 재생한다(2026-10-30 사용자: 전환이 너무 빠름 → 1.3배, 효과음 시작 시각도 같이 늦춤)
const SLOW = 1.3;
// 스플래시(scene.js — 로고 안으로 들어갔다 나오기, 효과음, 홈 로고 자리로 날아가며 홈을 드러냄). onReveal = 홈이 드러나기 시작할 때 한 번
export function startSplash(host, { lang = 'ko', onDone = () => {}, onReveal = null } = {}) {
  const en = lang === 'en';
  let closed = false, raf = 0, timer = 0, loadTimer = 0, scene, revealed = false, sounds = [];
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
  host.setAttribute('aria-label', en ? 'Toki Toki Tale' : '톡톡 동화극장');
  host.innerHTML = '<div class="splash-stage" aria-hidden="true"></div><div class="splash-fallback"><strong></strong></div><button class="splash-skip" type="button"></button>';
  const fallbackTitle = host.querySelector('strong');
  const wordmark = document.createElement('img');
  wordmark.className = 'splash-wordmark';
  wordmark.src = new URL(en ? '../../assets/v3w/sp_logo_c2_en_b_light_v1.webp' : '../../assets/v3w/sp_logo_c2_b_light_v1.webp', import.meta.url).href;
  wordmark.alt = en ? 'Toki Toki Tale' : '톡톡 동화극장';
  fallbackTitle.replaceWith(wordmark);
  const skip = host.querySelector('button');
  skip.setAttribute('aria-label', en ? 'Start' : '시작');   // 글자는 보이지 않는다(저절로 끝남). 보조기기·키보드용 이름만
  skip.focus({ preventScroll: true, focusVisible: false });   // 키보드 이름표용 단추라 초점 테두리는 그리지 않는다
  function finish() {
    if (closed) return;
    closed = true;
    clearTimeout(timer); clearTimeout(loadTimer); cancelAnimationFrame(raf);
    abort.abort(); scene?.destroy();
    for (const a of sounds) { try { a.pause(); } catch (e) { /* 무시 */ } }
    document.body.classList.remove('splash-flying');
    host.style.background = '';
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
    if (!revealed) onReveal?.();
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
  timer = setTimeout(finish, 15000);
  loadTimer = setTimeout(finish, 5000);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearTimeout(loadTimer); clearTimeout(timer);
    timer = setTimeout(finish, 500);
    return { finish };
  }
  import('./scene.js?v=20261030sp5').then(async ({ createSplashScene }) => {
    if (closed) return;
    const building = createSplashScene(host.querySelector('.splash-stage'), {
      lang, signal: abort.signal,
      onPreparing: () => {
        // Downloads and GPU preparation are separate, bounded stages. The 12s outer
        // watchdog still covers the entire preparation, and taps remain enabled.
        if (closed) return;
        clearTimeout(loadTimer);
        loadTimer = setTimeout(finish, 5000);
      }
    });
    // GPU initialization can be synchronous; give the subsequent artwork loads their own budget.
    clearTimeout(loadTimer);
    loadTimer = setTimeout(finish, 5000);
    const result = await building;
    if (closed) { result.destroy(); return; }
    scene = result;
    clearTimeout(loadTimer);
    clearTimeout(timer);
    const total = scene.duration;
    // 효과음: 미리 받아 두고 시각이 지나면 한 번씩(웹은 첫 접속에 자동 재생이 막혀 소리 없이 지나갈 수 있다)
    const cues = (scene.cues || []).map(([at, name, vol, dur]) => {
      const a = new Audio(new URL(`../../sounds/sfx/${name}.mp3`, import.meta.url).href);
      a.preload = 'auto'; a.volume = vol; sounds.push(a);
      return { at, a, vol, dur, done: false };
    });
    // 긴 소리(새소리 등)는 앞부분만: dur 초 뒤 0.3초 동안 줄이고 멈춘다
    const cut = c => setTimeout(() => {
      let k = 0;
      const step = setInterval(() => { k++; try { c.a.volume = c.vol * Math.max(0, 1 - k / 6); if (k >= 6) { clearInterval(step); c.a.pause(); } } catch (e) { clearInterval(step); } }, 50);
    }, c.dur * 1000);
    function reveal() {   // 홈 로고 마크 자리로 날아가며 홈을 드러낸다
      if (revealed) return;
      revealed = true;
      const mark = [...document.querySelectorAll('.logo-mark')].find(el => el.getBoundingClientRect().width > 0);
      if (mark) scene.flyTo(mark.getBoundingClientRect());
      document.body.classList.add('splash-flying');
      host.style.background = 'transparent';
      background.forEach((el, i) => { el.inert = inertBefore[i]; });
      onReveal?.();
    }
    timer = setTimeout(finish, (total * SLOW + .6) * 1000);
    host.classList.add('splash-ready');
    let started;
    const frame = now => {
      if (closed) return;
      started ??= now;
      const t = (now - started) / 1000 / SLOW;   // 장면 시각(늘린 만큼 천천히 흐름)
      for (const c of cues) if (!c.done && t >= c.at) { c.done = true; if (t - c.at < .25) { c.a.play().catch(() => {}); if (c.dur) cut(c); } }
      if (t >= scene.flyAt) reveal();
      scene.renderAt(Math.min(t, scene.duration));
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
