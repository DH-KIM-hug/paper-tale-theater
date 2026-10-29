// ?v2=1 = 새 스플래시(scene2.js)
const { createSplashScene, DURATION } = await import(new URLSearchParams(location.search).has('v2') ? '../../engine/splash/scene2.js?v=20261029sp2' : '../../engine/splash/scene.js?v=20261028english1');
const $ = s => document.querySelector(s);
const isExport = new URLSearchParams(location.search).has('export');
if (isExport) document.body.classList.add('export');
let current = 0, playing = false, previous = 0;
try {
  const scene = await createSplashScene($('#viewport'), { lang: new URLSearchParams(location.search).get('lang') || 'ko' });
  window.introDuration = DURATION;
  window.splashScene = scene;   // 확인 도구가 flyTo(홈 로고 자리) 등을 부를 수 있게
  window.renderAt = t => {
    current = Math.min(DURATION, Math.max(0, t));
    scene.renderAt(current);
    $('#timeline').value = current;
    $('#time').textContent = `${current.toFixed(1)} / ${DURATION.toFixed(1)}`;
    $('#chapter').textContent = current < 1.1 ? '작은 무대가 열리고' : current < 2.65 ? '토끼와 거북이를 만나고' : current < 4.8 ? '공주들의 정원으로' : '톡톡, 이야기가 시작돼요';
  };
  $('#timeline').max = DURATION;
  $('#loading').remove();
  playing = !isExport && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderAt(playing || isExport ? 0 : DURATION);
  $('#play').textContent = playing ? '일시정지' : '재생';
  window.introReady = true;
  function frame(now) {
    if (playing) {
      if (previous) renderAt(current + Math.min(.1, (now - previous) / 1000));
      if (current >= DURATION) { playing = false; $('#play').textContent = '재생'; }
    }
    previous = now;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  $('#play').onclick = () => { if (current >= DURATION) renderAt(0); playing = !playing; previous = 0; $('#play').textContent = playing ? '일시정지' : '재생'; };
  $('#replay').onclick = () => { renderAt(0); playing = true; previous = 0; $('#play').textContent = '일시정지'; };
  $('#timeline').oninput = e => { playing = false; renderAt(+e.target.value); $('#play').textContent = '재생'; };
  addEventListener('pagehide', () => scene.destroy(), { once: true });
} catch (error) {
  $('#loading').textContent = '미리보기를 열지 못했어요. 앱 홈에서 정지 시작 화면을 확인할 수 있습니다.';
  console.error(error);
}
