/* 팥죽할멈과 호랑이 — TTS 내레이션 + Web Audio 합성 효과음 */

/* 화면 언어: 'ko'(기본) | 'en'. 영어 자료(NARRATION_CLIPS_EN)가 있는 동화만 영어로 나온다 */
const siteLang = () => { try { return localStorage.getItem('lang') === 'en' ? 'en' : 'ko'; } catch (e) { return 'ko'; } };
const englishOn = () => siteLang() === 'en' && typeof NARRATION_CLIPS_EN !== 'undefined';

const AudioFX = (() => {
  let ctx = null;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state !== 'running' && ctx.state !== 'closed') ctx.resume().catch(() => {});
    return ctx;
  }

  /* ===== 아이폰·아이패드 소리 살리기 =====
     ① iOS는 터치하는 순간에만 오디오를 깨울 수 있다 → 모든 터치에서(잠들어 있으면) 깨우고, 빈 소리를 한 번 낸다.
     ② 무음 스위치가 켜져 있으면 웹 오디오는 조용해진다 → 오디오 세션을 '재생'으로 바꾼다
        (iOS 17+: navigator.audioSession, 그 전: 소리 없는 <audio>를 반복 재생해 세션을 '재생'으로 붙잡는다).
     ③ 전화·앱 전환으로 끊기면('interrupted') 다음 터치에서 다시 깨운다. */
  const SILENT = 'data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYzLjEuMTAyAAAAAAAAAAAAAAD/83DAAAAAAAAAAAAASW5mbwAAAA8AAAAWAAAJsQAdHR0dKCgoKCgzMzMzPT09PT1ISEhIU1NTU1NeXl5eaWlpaWlzc3Nzfn5+fn6JiYmJlJSUlJSenp6enqmpqam0tLS0tL+/v7/KysrKytTU1NTf39/f3+rq6ur19fX19f////8AAAAATGF2YzYzLjEuAAAAAAAAAAAAAAAAJAQvAAAAAAAACbHeQ9eUAAAAAAAAAAAAAAAAAP/zQMQAAAADSAAAAABMQU1FNC4wVVVVVVVVVVVVVVVVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxFsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NAxKQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80LEowAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80DEpAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUU0LjBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsSjAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUU0LjBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxKMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NAxKQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80LEowAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80DEpAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUU0LjBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsSjAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUU0LjBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxKMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NAxKQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80LEowAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FNC4wVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80DEpAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUU0LjBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsSjAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUU0LjBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxKMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTQuMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NAxKQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80LEowAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
  let keepAlive = null;
  function wake() {
    try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch (e) { /* 무시 */ }
    const c = ensure();
    if (!c) return;
    try { // 빈 소리 한 번 (옛 iOS의 잠금 풀기)
      const b = c.createBuffer(1, 1, 22050), s = c.createBufferSource();
      s.buffer = b; s.connect(c.destination); s.start(0);
    } catch (e) { /* 무시 */ }
    if (!keepAlive && /iP(hone|ad|od)|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document) {
      keepAlive = document.createElement('audio');
      keepAlive.src = SILENT; keepAlive.loop = true; keepAlive.preload = 'auto';
      keepAlive.setAttribute('playsinline', ''); keepAlive.setAttribute('x-webkit-airplay', 'deny');
    }
    if (keepAlive && keepAlive.paused) keepAlive.play().catch(() => {});
  }
  const needsWake = () => !ctx || ctx.state !== 'running' || (keepAlive && keepAlive.paused);
  ['touchend', 'pointerup', 'click', 'keydown'].forEach(ev =>
    addEventListener(ev, () => { if (needsWake()) wake(); }, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => {
    // 화면을 떠나면 붙잡고 있던 세션을 놓아 준다. 읽어 주기(<audio> 내레이션) 중이면 화면이 꺼져도 이어 읽도록 붙잡아 둔다
    if (document.hidden) { if (keepAlive && !mediaNar) keepAlive.pause(); }
    else if (ctx && ctx.state !== 'running' && ctx.state !== 'closed') ctx.resume().catch(() => {}); // 돌아오면 효과음 다시 깨우기
  });

  /* 기본 톤: freq(Hz) 또는 [시작, 끝] 스윕 */
  function tone(freq, dur, { type = 'sine', vol = 0.25, when = 0 } = {}) {
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + when;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    if (Array.isArray(freq)) {
      osc.frequency.setValueAtTime(freq[0], t0);
      osc.frequency.exponentialRampToValueAtTime(Math.max(freq[1], 1), t0 + dur);
    } else {
      osc.frequency.setValueAtTime(freq, t0);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  /* 노이즈 버스트 (첨벙, 쿵) */
  function noise(dur, { vol = 0.3, freq = 800, q = 1, when = 0 } = {}) {
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + when;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t0);
  }

  /* ===== 사전 녹음 내레이션 재생 ===== */
  const narBuffers = {};
  let narSrc = null, voiceSrc = null, voiceGen = 0, voiceDone = Promise.resolve();
  /* 지금 나오는 내레이션 조각: 시작 시각(ms)·길이(초, 모르면 0)·몇 번째 조각. 읽어 주기가 '오디오 길이 + 3초' 시간 제한에 쓴다 */
  const narInfo = { t: 0, dur: 0, n: 0 };

  /* ===== 읽어 주기: 내레이션을 <audio>로 재생 (2026-10-23) =====
     화면이 꺼지거나 다른 앱·탭으로 가면 Web Audio 는 멈추거나(iOS 잠금) onended 가 오지 않을 수 있다.
     <audio> 는 배경에서도 이어 재생되고 ended 이벤트로 다음 줄을 부를 수 있다(잠금 화면 '지금 재생'·Media Session 도 이 요소로).
     시작 단추를 누르는 순간(사용자 누름 안에서) 한 번 재생해 두어야 iOS 가 나중에 누름 없이 재생을 허락한다 */
  let narEl = null, mediaNar = false, narEnd = null, narHeld = false;
  const narBlob = {};
  const narHelpers = [];
  let pairEnds = [], pairGen = 0;
  /* 멈춤 세대 (2026-10-29): stopNarration 마다 narGen 이 오르고 narStopP 가 풀린다.
     받는(fetch)·푸는(decode) 중인 클립은 기다림을 narStopP 와 경주시켜, 멈추면 곧바로 끝내고 늦게 받아져도 울리지 않는다 */
  let narGen = 0, narStop = null, narStopP = new Promise(r => { narStop = r; });
  const CUT = {};
  const untilStop = (p, stopP) => Promise.race([p, stopP.then(() => CUT)]);
  function mediaNarration(on) {
    mediaNar = !!on;
    if (!mediaNar) return;
    if (!narEl) { narEl = document.createElement('audio'); narEl.preload = 'auto'; narEl.setAttribute('playsinline', ''); }
    // 각 요소를 사용자 누름 안에서 열어 두어 iOS에서도 합창을 이어 재생한다.
    while (narHelpers.length < 7) {
      const el = document.createElement('audio'); el.preload = 'auto'; el.setAttribute('playsinline', ''); narHelpers.push(el);
    }
    narHelpers.forEach(el => { el.src = SILENT; const p = el.play(); if (p) p.then(() => { if (!pairEnds.length) el.pause(); }, () => {}); });
    try { narEl.src = SILENT; const p = narEl.play(); if (p && p.then) p.then(() => { if (!narEnd) narEl.pause(); }, () => {}); } catch (e) { /* 무시 */ }
  }
  async function playMedia(url, gen, stopP) {
    let u = narBlob[url];
    if (!u) {
      try {
        const bytes = await untilStop(fetchBytes(url), stopP);
        if (bytes === CUT) return;               // 받는 동안 멈춤: 재생하지 않고 바로 끝
        u = narBlob[url] = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
      }
      catch (e) { u = clipUrl(url); }
    }
    if (gen !== narGen) return;
    return new Promise((resolve, reject) => {
      const el = narEl;
      if (narEnd) narEnd(true);
      let done = false;
      const fin = ok => {
        if (done) return; done = true;
        el.onended = el.onerror = el.onloadedmetadata = null;
        if (narEnd === fin) narEnd = null;
        ok ? resolve() : reject(new Error('media-fail'));
      };
      narEnd = fin;
      el.onended = () => fin(true);
      el.onerror = () => fin(false);
      const rate = slowEn(url) ? EN_RATE : 1;
      el.onloadedmetadata = () => { if (isFinite(el.duration)) narInfo.dur = el.duration / rate; };
      narInfo.t = Date.now(); narInfo.dur = 0; narInfo.n++;
      el.src = u;
      setRate(el, rate);
      if (narHeld) return; // 잠금 화면에서 일시정지 중: 다시 재생을 누르면 이어서
      const p = el.play();
      if (p && p.catch) p.catch(() => fin(false));
    });
  }

  /* 녹음 경로(audio/…)는 저장소 루트 기준이다. 동화는 tales/<이름>/ 안에서 열리므로 audio.js 위치를 기준으로 바꾼다 */
  const ROOT_BASE = (() => {
    const src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/audio\.js(\?.*)?$/, '') : '';
  })();
  const clipUrl = url => (/^(https?:|\/|\.\.?\/|blob:|data:)/.test(url) ? url : ROOT_BASE + url);

  /* 녹음 미리 받기: 동화를 시작하면 이 동화의 녹음 파일을 순서대로(동시에 4개씩) 받아 둔다.
     받은 파일(압축된 mp3)만 들고 있다가 말할 때 풀어 쓴다 → 대사가 바로 나온다 (메모리도 적게) */
  const prefetched = {};
  const fetchBytes = url => (prefetched[url] = prefetched[url] || fetch(clipUrl(url)).then(r => { if (!r.ok) throw new Error('fetch-fail'); return r.arrayBuffer(); }));
  function prefetchClips() {
    const all = [];
    const add = v => [].concat(v || []).forEach(u => { if (typeof u === 'string' && !all.includes(u)) all.push(u); });
    if (englishOn()) {
      Object.values(NARRATION_CLIPS_EN).forEach(e => add(e.c));
      if (typeof VOICE_LINES_EN !== 'undefined') Object.values(VOICE_LINES_EN).forEach(add);
    } else {
      if (typeof NARRATION_CLIPS !== 'undefined') Object.values(NARRATION_CLIPS).forEach(add);
      if (typeof VOICE_LINES !== 'undefined') Object.values(VOICE_LINES).forEach(add);
    }
    let i = 0;
    const next = () => { if (i >= all.length) return; const u = all[i++]; fetchBytes(u).catch(() => { delete prefetched[u]; }).finally(next); };
    for (let k = 0; k < 4; k++) next();
  }

  /* 영어 천천히 (2026-10-30 사용자: 영어만 0.9배): ElevenLabs 영어 클립(audio/el/…/en/)은 보통 속도로 녹음돼 있어
     재생할 때 0.9배로 늘린다. Typecast 영어(audio/tc/)는 녹음 때 이미 0.9배라 그대로. 음 높이는 그대로 둔다 */
  const EN_RATE = 0.9;
  const slowEn = url => typeof url === 'string' && /(^|\/)audio\/el\/.*\/en\//.test(url);
  /* 목소리 늘리기(WSOLA): 40ms 창을 반씩 겹쳐 붙이되, 이어 붙일 자리를 앞 조각과 가장 닮은 곳에서 찾아 음 높이를 지킨다 */
  function stretchBuffer(c, buf, rate) {
    const sr = buf.sampleRate, N = Math.round(sr * .04) & ~1, Hs = N / 2, Ha = Hs * rate, tol = Math.round(N / 4);
    const inLen = buf.length, outLen = Math.ceil(inLen / rate) + N;
    const mono = new Float32Array(inLen);
    for (let ch = 0; ch < buf.numberOfChannels; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < inLen; i++) mono[i] += d[i]; }
    const win = new Float32Array(N); for (let i = 0; i < N; i++) win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    const starts = []; let prev = 0;
    for (let k = 0; k * Hs + N < outLen; k++) {
      const nominal = Math.round(k * Ha);
      if (nominal + N + tol >= inLen) break;
      let best = nominal;
      if (k > 0) {
        const ref = prev + Hs; let bestC = -Infinity;            // 앞 조각이 자연스럽게 이어졌을 자리
        for (let d = -tol; d <= tol; d += 2) {
          const s = nominal + d; if (s < 0) continue;
          let cc = 0; for (let i = 0; i < Hs; i += 4) cc += mono[ref + i] * mono[s + i];
          if (cc > bestC) { bestC = cc; best = s; }
        }
      }
      starts.push(best); prev = best;
    }
    const out = c.createBuffer(buf.numberOfChannels, starts.length * Hs + N, sr);
    for (let ch = 0; ch < buf.numberOfChannels; ch++) {
      const d = buf.getChannelData(ch), o = out.getChannelData(ch);
      starts.forEach((s, k) => { const at = k * Hs; for (let i = 0; i < N; i++) o[at + i] += d[s + i] * win[i]; });
    }
    return out;
  }
  /* <audio> 쪽(읽어 주기): 재생 속도만 바꾸고 음 높이는 지킨다. src 를 바꾸면 기본 속도로 돌아가는 브라우저가 있어 src 뒤에 둔다 */
  function setRate(el, rate) {
    try { el.preservesPitch = el.webkitPreservesPitch = el.mozPreservesPitch = true; el.defaultPlaybackRate = rate; el.playbackRate = rate; } catch (e) { /* 무시 */ }
  }
  async function loadClip(url) {
    const c = ensure();
    if (!c) throw new Error('no-audio-ctx');
    if (!narBuffers[url]) {
      const bytes = await fetchBytes(url);
      const buf = await c.decodeAudioData(bytes.slice(0)); // slice: 미리 받은 원본은 다시 쓸 수 있게 남긴다
      narBuffers[url] = slowEn(url) ? stretchBuffer(c, buf, EN_RATE) : buf;
    }
    return narBuffers[url];
  }

  /* ===== 실제 녹음 효과음·동물 소리 (sounds/). 못 불러오면 아래 합성음으로 대신한다 ===== */
  // audio.js 옆의 sounds/ 폴더 — 팥죽할멈(루트)과 새 동화(tales/*/)가 같은 파일을 쓴다
  const SOUND_BASE = (() => {
    const src = document.currentScript && document.currentScript.src;
    return src ? src.replace(/audio\.js(\?.*)?$/, 'sounds/') : 'sounds/';
  })();
  const samples = {};
  /* 같은 소리의 여러 버전: 기본 이름(rooster.mp3) 말고 rooster_2.mp3, rooster_3.mp3 … 가 있으면 재생할 때마다 바꿔 고른다 (버전 수는 기본 포함) */
  const VARIANTS = { 'animals/cow': 3, 'animals/pig': 2, 'animals/dog': 3, 'animals/owl': 3, 'animals/frog': 3,
    'animals/rooster': 2, 'animals/cat': 3, 'animals/sheep': 2, 'animals/donkey': 2, 'animals/tiger': 2, 'sfx/knock': 2,
    'sfx/crunch': 2, 'sfx/chomp': 3, 'sfx/gulp': 3, 'sfx/gom_se_mari': 2,
    'sfx/hop': 2, 'sfx/ball_bounce': 2,
    'sfx/boing_steps': 2, 'sfx/harp_gliss': 2, 'sfx/ding_glock': 2, 'sfx/sad_trombone': 3, 'sfx/comic_brass': 2,
    'sfx/fall_crash': 2, 'sfx/pull_pop': 2, 'sfx/party_horn': 2, 'sfx/marimba_note': 2 };
  const variantPath = (base, i) => i === 1 ? base + '.mp3' : base + '_' + i + '.mp3';
  const lastVariant = {};
  function pickVariant(path) {
    const base = path.replace(/\.mp3$/, ''), n = VARIANTS[base];
    if (!n) return path;
    const ok = [];
    for (let i = 1; i <= n; i++) if (i === 1 || samples[variantPath(base, i)]) ok.push(i);
    if (ok.length < 2) return path;
    let c; do { c = ok[Math.floor(Math.random() * ok.length)]; } while (c === lastVariant[base]);
    lastVariant[base] = c;
    return variantPath(base, c);
  }
  function loadSample(path) {
    if (path in samples) return;
    const vb = path.replace(/\.mp3$/, '');
    if (VARIANTS[vb]) for (let i = 2; i <= VARIANTS[vb]; i++) loadSample(variantPath(vb, i)); // 다른 버전도 같이 받는다
    samples[path] = null;
    const c = ensure(); if (!c) return;
    fetch(SOUND_BASE + path).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
      .then(b => c.decodeAudioData(b)).then(buf => { samples[path] = buf; })
      .catch(() => { samples[path] = false; });
  }
  /* when: 몇 초 뒤, dur: 앞부분만 (초) — 스팅에서 겹쳐 쌓을 때 쓴다 */
  function playSample(path, vol = 0.9, when = 0, dur, rate = 1, offset = 0, noVariant = false) {
    let buf = samples[path];
    if (!buf) { loadSample(path); return false; }
    if (!noVariant) buf = samples[pickVariant(path)] || buf;
    const c = ensure();
    const s = c.createBufferSource(), g = c.createGain();
    const t0 = c.currentTime + when;
    s.buffer = buf; g.gain.value = vol; s.playbackRate.value = rate;
    s.connect(g).connect(c.destination);
    if (dur) { // 잘라 쓸 때 끝을 살짝 줄여 딸깍 소리를 막는다
      g.gain.setValueAtTime(vol, t0 + Math.max(0, dur - 0.06));
      g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
      s.start(t0, offset, dur);
    } else s.start(t0, offset);
    return true;
  }
  const POP_STEPS = [0, 2, 4, 5, 7, 9, 11, 12]; // 한 옥타브까지, 그 뒤는 맨 위 음 유지
  let countWin = null;
  const SFX = { thud: 'sfx/thud', boom: 'sfx/boom', pow: 'sfx/pow', bonk: 'sfx/bonk', pop: 'sfx/pop', poke: 'sfx/poke',
    tap: 'sfx/tap', ding: 'sfx/ding', swish: 'sfx/swish', whoosh: 'sfx/whoosh', bell: 'sfx/bell', splash: 'sfx/splash', growl: 'animals/tiger',
    hop: 'sfx/hop', ball_bounce: 'sfx/ball_bounce', cushion: 'sfx/cushion', pop_out: 'sfx/pop_out', chomp: 'sfx/chomp', gulp: 'sfx/gulp', slide: 'sfx/slide_down' };
  /* 만화 컷용 신나는 효과음 (sounds/CREDITS.md) — sting()이 여러 개를 겹쳐 쓴다 */
  const COMIC = ['spring', 'slide_up', 'slide_down', 'zip', 'cork', 'doop', 'sparkle', 'xylo_up', 'xylo_down', 'giggle_xylo',
    'crash', 'cymbal', 'drumroll', 'tada', 'womp', 'squeak', 'splash_big', 'bubbles', 'baby_giggle', 'cheer',
    'rattle'];
  const EXTRA = ['sfx/knock', 'sfx/crunch', 'sfx/chomp', 'sfx/gulp', 'sfx/chop', 'sfx/creak', 'sfx/drum', 'sfx/step_grass', 'sfx/step_wood', 'sfx/door', 'sfx/blow', 'sfx/blow_long',
    ...COMIC.map(n => 'sfx/' + n),
    ...['tiger', 'cow', 'pig', 'duck', 'rooster', 'sheep', 'dog', 'cat', 'owl', 'frog', 'frogs', 'donkey'].map(a => 'animals/' + a), 'sfx/paper_turn', 'sfx/baby_cry', 'sfx/baby_giggle', 'sfx/gom_se_mari', 'sfx/lullaby_a', 'sfx/lullaby_b', 'sfx/lullaby_a_2', 'sfx/lullaby_b_2'];

  /* 스팅: [효과음, 시작(초), 음량, 앞부분만 쓸 길이(초)?] 를 겹쳐서 한 번에 "휙-딱-반짝!" 처럼 울린다.
     음량은 내레이션이 묻히지 않게 0.35~0.95 사이, 전체에 STING_VOL을 곱한다 */
  const STING_VOL = 0.8;
  const STINGS = {
    hit:      [['zip', 0, .6], ['bonk', .1, .95], ['sparkle', .22, .45]],                        // 휙-땡!-반짝
    poke:     [['zip', 0, .55], ['poke', .1, .85], ['squeak', .16, .75], ['slide_up', .38, .5]], // 휙-콕!-삑-뿅~
    bigHit:   [['drumroll', 0, .55, .42], ['boom', .4, 1], ['crash', .42, .75], ['cymbal', .46, .6]], // 두구두-쾅!와장창-챙
    slip:     [['slide_down', 0, .6], ['thud', .62, .9], ['squeak', .74, .5]],                 // 삐유~-쿵-삑
    bite:     [['zip', 0, .55], ['chomp', .1, .95], ['squeak', .2, .6], ['xylo_down', .42, .45]], // 휙-앙!-삑-또로롱↓
    splash:   [['whoosh', 0, .6], ['splash_big', .14, .9], ['splash', .2, .5], ['bubbles', .6, .5]], // 휙-풍덩!-보글보글
    roll:     [['rattle', 0, .7], ['drumroll', .08, .35, .6], ['spring', .7, .55]],                       // 달그락 돌돌-띠용
    laugh:    [['giggle_xylo', 0, .45], ['baby_giggle', .2, .8]],                                     // 또로롱-까르르
    fail:     [['womp', 0, .7]],                                                               // 빠밤빠밤~
    magic:    [['zip', 0, .35], ['sparkle', .05, .6], ['xylo_up', .3, .55]],                    // 반짝반짝-또로롱
    win:      [['drumroll', 0, .55, .7], ['tada', .62, .85], ['cymbal', .64, .4], ['cheer', .8, .45]], // 두구두구-짜잔!-와아
    surprise: [['slide_up', 0, .55], ['cork', .5, .9], ['sparkle', .55, .35]],                 // 삐융~-뽕!
    dizzy:    [['xylo_down', 0, .5], ['sparkle', .15, .45], ['spring', .9, .45]],              // 또로롱↓-반짝-띠요옹
    ouch:     [['squeak', 0, .8], ['xylo_down', .12, .5], ['sparkle', .35, .3]],                // 삑-또로롱↓-반짝
  };

  /* 배경 소리(ambient) 공용: 한 통(bus)을 거치게 해서 내레이션이 읽히는 동안 한꺼번에 낮춘다 */
  const DUCK = .45; // 내레이션 중 배경 소리 배율(약 -7dB). 평소 vol(.25~.35)과 곱해져 -15~-20dB 안팎
  let ambs = [], ambGain = null, ambTimer = 0;
  function ambBus() {
    if (!ambGain || ambGain.context !== ctx) { ambGain = ctx.createGain(); ambGain.connect(ctx.destination); }
    return ambGain;
  }
  const narrating = () => !!(narSrc || narEnd || pairEnds.length || (narEl && !narEl.paused && !narEl.ended && narEl.src));
  function ambTick() { // 켜져 있는 동안만 0.25초마다 내레이션을 살펴 볼륨을 오르내린다
    if (!ambs.length) { clearInterval(ambTimer); ambTimer = 0; return; }
    if (!ambTimer) ambTimer = setInterval(ambTick, 250);
    try { if (ambGain && ctx) ambGain.gain.setTargetAtTime(narrating() ? DUCK : 1, ctx.currentTime, .3); } catch (e) { /* 무시 */ }
  }
  /* 화면을 떠나면 끈다. 읽어 주기(<audio> 내레이션) 중 화면 꺼짐은 이어 간다 */
  addEventListener('pagehide', () => { try { ambs.slice().forEach(h => h.stop(.1)); } catch (e) { /* 무시 */ } });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && !mediaNar) { try { ambs.slice().forEach(h => h.stop(.3)); } catch (e) { /* 무시 */ } }
  });

  const api = {
    unlock() {
      wake();
      [...Object.values(SFX), ...EXTRA].forEach(p => loadSample(p + '.mp3'));
    },
    /* 동물 소리: AudioFX.animal('pig') — 실제 녹음, 없으면 false */
    animal(name, vol) { return playSample('animals/' + name + '.mp3', vol); },
    /* 실로폰 음 하나: semi = 가운데 도(C5 샘플 그대로)에서 올린 반음 수(내리면 음수). 샘플이 아직 없으면 false */
    /* 아기 우는 소리(녹음). 샘플이 아직 없으면 합성 훌쩍임 */
    babyCry(vol = .8) { if (playSample('sfx/baby_cry.mp3', vol)) return true; api.whimper(); return false; },
    note(semi, dur, vol = .6, when = 0) { // 실로폰 음 하나 — 샘플 대신 합성음(가운데 도 C5 = 523Hz 기준)
      const hz = 523.25 * Math.pow(2, semi / 12), d = dur || .5;
      tone(hz, d, { type: 'triangle', vol: vol * .35, when }); tone(hz * 2, d * .5, { type: 'sine', vol: vol * .08, when });
      return true;
    },
    /* 동물 소리로 음 하나 부르기: 녹음을 rate배 빠르게(=높게) 재생. 합창·멜로디용 */
    animalNote(name, rate, vol = .7, when = 0, dur) { return playSample('animals/' + name + '.mp3', vol, when, dur, rate, 0, true); },
    /* 클래식 녹음(sounds/music/<name>.mp3): 미리 불러 두고, music()으로 틀면 {stop(), done(Promise)}을 돌려준다.
       못 불러왔으면 null — 부르는 쪽이 합성음으로 대신한다. slice()는 짧은 조각 하나(꾹 눌러 이어 듣기용) */
    preloadMusic(names) { names.forEach(n => loadSample('music/' + n + '.mp3')); },
    music(name, { vol = .7, offset = 0, dur, fade = 1.2 } = {}) {
      const buf = samples['music/' + name + '.mp3'];
      if (!buf) { loadSample('music/' + name + '.mp3'); return null; }
      const c = ensure(), s = c.createBufferSource(), g = c.createGain(), t0 = c.currentTime;
      const len = Math.min(dur || buf.duration, buf.duration - offset);
      s.buffer = buf; s.connect(g).connect(c.destination);
      g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + .3);
      g.gain.setValueAtTime(vol, t0 + Math.max(.3, len - fade)); g.gain.linearRampToValueAtTime(0.0001, t0 + len);
      s.start(t0, offset, len);
      let stopped = false;
      const done = new Promise(res => { s.onended = res; });
      return { done, stop(f = .4) { if (stopped) return; stopped = true; const t = c.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0.0001, t + f); try { s.stop(t + f + .02); } catch (e) {} } };
    },
    slice(name, offset, dur, vol = .7) { return playSample('music/' + name + '.mp3', vol, 0, dur, 1, offset); },
    /* 기타 효과음: AudioFX.sfx('chop') */
    sfx(name, vol) { if (name === 'pop' && api.countPop && api.countPop()) return true; return playSample('sfx/' + name + '.mp3', vol); },
    /* 세기 소리: 톡톡톡 n번째 박자(1부터)는 pop을 음계로 올려 울린다 (0,2,4,5,7… 반음). 한 박자에 한 번만 */
    popStep(n, vol) { const k = Math.max(1, Math.min(POP_STEPS.length, n | 0 || 1)); return playSample('sfx/pop.mp3', vol, 0, 0, Math.pow(2, POP_STEPS[k - 1] / 12)); },
    countBeat(n) { countWin = { n, t: Date.now(), used: false }; },
    countPop() { // 세는 박자 안(0.6초)에서 아직 안 울렸으면 올라가는 pop을 울린다
      if (!countWin || countWin.used || Date.now() - countWin.t > 600) return false;
      if (!api.popStep(countWin.n)) return false;
      countWin.used = true; return true;
    },
    /* 첫 소리가 합성음으로 새지 않게 미리 불러 둔다: AudioFX.preloadSfx(['paper_up', …]) */
    preloadSfx(names) { names.forEach(n => loadSample('sfx/' + n + '.mp3')); },
    /* 배경 소리(sounds/sfx/<name>.mp3, 종류 ambient): 이어서 반복 재생하는 바닥 소리. 효과음처럼 미리 불러 둔다(preloadSfx).
       AudioFX.ambient('birds_chirp_1', { vol: .3, fadeIn: .8, dur })  → { stop(fadeSec = .8) } | 아직 못 불러왔으면 null(부르는 쪽은 그냥 넘어간다)
       - vol 은 .25~.35 가 내레이션 밑에서 알맞다. 내레이션이 읽히는 동안은 자동으로 더 낮춘다(DUCK).
       - dur(초)를 주면 그 뒤 저절로 사라진다. loop:false 면 한 번만 틀고 끝난다.
       - 같은 이름을 다시 부르면 앞의 것은 서서히 끄고 새로 튼다. 내레이션을 막거나 깨지 않게 모두 try/catch 로 감싼다. */
    ambient(name, { vol = .3, loop = true, fadeIn = .8, dur } = {}) {
      try {
        const path = 'sfx/' + name + '.mp3', buf = samples[path];
        if (!buf) { loadSample(path); return null; }
        const c = ensure(); if (!c) return null;
        ambs.filter(h => h.name === name).forEach(h => h.stop(.4));
        const s = c.createBufferSource(), g = c.createGain(), t0 = c.currentTime;
        s.buffer = buf; s.loop = !!loop;
        g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + Math.max(.05, fadeIn));
        s.connect(g).connect(ambBus());
        let stopped = false, timer = 0;
        const h = { name, stop(f = .8) {
          if (stopped) return; stopped = true; clearTimeout(timer);
          try {
            const t = c.currentTime, f2 = Math.max(.05, f);
            g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(Math.max(g.gain.value, 0.0001), t); g.gain.linearRampToValueAtTime(0.0001, t + f2);
            s.stop(t + f2 + .02);
          } catch (e) { /* 무시 */ }
          setTimeout(() => { try { g.disconnect(); } catch (e) { /* 무시 */ } ambs = ambs.filter(x => x !== h); ambTick(); }, (f + .1) * 1000);
        } };
        s.onended = () => { if (!stopped) h.stop(.05); };
        s.start(t0);
        if (dur > 0) timer = setTimeout(() => h.stop(Math.min(1.2, dur / 2)), Math.max(0, dur - 1.2) * 1000);
        ambs.push(h); ambTick();
        return h;
      } catch (e) { return null; }
    },
    /* 켜 둔 배경 소리를 모두 끈다. 장면이 바뀔 때·동화가 끝날 때 부른다(화면을 떠나면 저절로 꺼진다) */
    stopAmbient(fadeSec = .8) { ambs.slice().forEach(h => { try { h.stop(fadeSec); } catch (e) { /* 무시 */ } }); },
    async playUrl(url, { recordedOnly = false } = {}) {
      const gen = narGen, stopP = narStopP; // 이 뒤에 stopNarration 이 오면 받기가 끝나도 재생하지 않는다
      if (mediaNar && narEl) { try { return await playMedia(url, gen, stopP); } catch (e) { if (recordedOnly) throw e; /* <audio> 실패 → Web Audio 로 */ } }
      if (gen !== narGen) return;
      const buf = await untilStop(loadClip(url), stopP);
      if (buf === CUT || gen !== narGen) return;
      const c = ensure();
      return new Promise(resolve => {
        const src = c.createBufferSource();
        src.buffer = buf;
        src.connect(c.destination);
        narInfo.t = Date.now(); narInfo.dur = buf.duration; narInfo.n++;
        narSrc = src;
        src.onended = () => { if (narSrc === src) narSrc = null; resolve(); };
        src.start();
      });
    },
    async playTogether(urls) {
      const gen = pairGen, stopP = narStopP;
      if (urls.length > narHelpers.length) throw new Error('too many simultaneous voices');
      // 모두 받은 뒤 한 작업 안에서 play: 늦게 받아진 목소리 때문에 합창이 벌어지지 않는다.
      const sources = await untilStop(Promise.all(urls.map(async url => {
        if (!narBlob[url]) narBlob[url] = URL.createObjectURL(new Blob([await fetchBytes(url)], { type: 'audio/mpeg' }));
        return narBlob[url];
      })), stopP);
      if (sources === CUT || gen !== pairGen) return;
      narInfo.t = Date.now(); narInfo.dur = 0; narInfo.n++;
      const jobs = sources.map((src, i) => new Promise((resolve, reject) => {
        const el = narHelpers[i];
        const fin = ok => { el.onended = el.onerror = el.onloadedmetadata = el.onplaying = null; pairEnds = pairEnds.filter(f => f !== fin); ok ? resolve() : reject(new Error('simultaneous media failed')); };
        pairEnds.push(fin); el.onended = () => fin(true); el.onerror = () => fin(false);
        const rate = slowEn(urls[i]) ? EN_RATE : 1;
        el.onloadedmetadata = () => { if (isFinite(el.duration)) narInfo.dur = Math.max(narInfo.dur, el.duration / rate); };
        el.onplaying = () => console.log('[read] simultaneous start', urls[i], performance.now());
        el.src = src;
        setRate(el, rate);
      }));
      sources.forEach((_, i) => { if (!narHeld) narHelpers[i].play().catch(() => { const el = narHelpers[i]; if (el.onerror) el.onerror(); }); });
      try { await Promise.all(jobs); }
      catch (e) { narHelpers.forEach(el => el.pause()); [...pairEnds].forEach(fin => fin(true)); throw e; } // 가장 긴 목소리가 끝나야 다음 줄로
    },
    /* 말풍선 없는 짧은 대사 (컷신 비명, 인사): 내레이션과 따로 재생하고, 새 대사가 오면 앞 대사는 끊는다 */
    async voice(urls) {
      const gen = ++voiceGen;
      if (voiceSrc) { try { voiceSrc.stop(); } catch (e) { /* 무시 */ } voiceSrc = null; }
      const run = (async () => {
        for (const url of [].concat(urls || [])) {
          if (gen !== voiceGen) return;
          let buf; try { buf = await loadClip(url); } catch (e) { continue; }
          if (gen !== voiceGen) return;
          await new Promise(resolve => {
            const src = ensure().createBufferSource();
            src.buffer = buf; src.connect(ensure().destination);
            voiceSrc = src;
            src.onended = () => { if (voiceSrc === src) voiceSrc = null; resolve(); };
            src.start();
          });
        }
      })();
      voiceDone = run;
      return run;
    },
    /* 짧은 대사가 끝날 때까지 기다린다 (내레이션과 겹치지 않게, 최대 ms) */
    voiceIdle(ms = 4000) { if (ms === null) return voiceDone; return Promise.race([voiceDone, new Promise(r => setTimeout(r, ms))]); },
    stopNarration() {
      pairGen++;
      narGen++; const s = narStop; narStopP = new Promise(r => { narStop = r; }); s(); // 받는 중인 클립도 취소
      narHelpers.forEach(el => el.pause());
      [...pairEnds].forEach(fin => fin(true));
      if (narSrc) { try { narSrc.stop(); } catch (e) { /* 무시 */ } narSrc = null; }
      if (narEnd) { try { narEl.pause(); } catch (e) { /* 무시 */ } narEnd(true); }
    },
    /* 읽어 주기: 내레이션을 <audio> 로 (on) / Web Audio 로 (off). on 은 시작 단추 누름 안에서 부른다 */
    mediaNarration,
    narInfo: () => ({ ...narInfo }),
    /* 다음 stopNarration 때 풀리는 약속: 내레이터가 기다림(컷신 대사 끝)을 멈춤과 경주시키는 데 쓴다 */
    narStopped: () => narStopP,
    /* 잠금 화면 일시정지·재생 (Media Session) */
    narHold(on) {
      narHeld = !!on;
      if (pairEnds.length) narHelpers.forEach(el => { if (on) el.pause(); else if (el.onended && !el.ended) el.play().catch(() => {}); });
      if (mediaNar && narEl) { try { if (on) narEl.pause(); else if (narEnd) narEl.play().catch(() => {}); } catch (e) { /* 무시 */ } }
      else if (ctx) { try { on ? ctx.suspend() : ctx.resume(); } catch (e) { /* 무시 */ } }
    },
    /* 잠자리 이어 듣기가 끝났을 때: 내레이션 <audio> 를 비우고 무음 유지 루프도 놓는다(배경에 무음만 남지 않게) */
    sessionEnd() {
      mediaNar = false; narHeld = false;
      try { api.stopAmbient(.4); } catch (e) { /* 무시 */ }
      try { api.stopNarration(); } catch (e) { /* 무시 */ }
      if (narEl) { try { narEl.pause(); narEl.removeAttribute('src'); narEl.load(); } catch (e) { /* 무시 */ } }
      narHelpers.forEach(el => { try { el.pause(); el.removeAttribute('src'); } catch (e) { /* 무시 */ } });
      if (keepAlive) { try { keepAlive.pause(); } catch (e) { /* 무시 */ } }
    },
    prefetchClips,
    preloadAll(urls) {
      urls.forEach(u => loadClip(u).catch(() => { /* 폴백 경로가 처리 */ }));
    },
    tap()    { tone(880, 0.07, { type: 'triangle', vol: 0.15 }); },
    pop()    { tone([500, 1400], 0.12, { type: 'triangle', vol: 0.3 }); },
    bonk()   { tone([300, 90], 0.25, { type: 'square', vol: 0.2 }); noise(0.12, { freq: 300, vol: 0.2 }); },
    chomp()  { tone(220, 0.06, { type: 'square', vol: 0.22 }); tone(160, 0.08, { type: 'square', vol: 0.22, when: 0.09 }); },
    slide()  { tone([900, 180], 0.45, { type: 'sine', vol: 0.28 }); },
    poke()   { tone([1500, 2200], 0.06, { type: 'triangle', vol: 0.26 }); },
    thud()   { tone([120, 45], 0.3, { type: 'sine', vol: 0.4 }); noise(0.18, { freq: 200, vol: 0.28 }); },
    hop()         { tone([260, 420], 0.1, { type: 'sine', vol: 0.2 }); tone([420, 200], 0.1, { type: 'sine', vol: 0.12, when: 0.1 }); },
    ball_bounce() { tone([420, 160], 0.14, { type: 'sine', vol: 0.28 }); noise(0.05, { freq: 600, vol: 0.12 }); },
    cushion()     { tone([180, 70], 0.18, { type: 'sine', vol: 0.3 }); noise(0.14, { freq: 350, q: 0.6, vol: 0.14 }); },
    pop_out()     { noise(0.1, { freq: 1800, q: 0.4, vol: 0.12 }); tone([380, 1000], 0.1, { type: 'triangle', vol: 0.2, when: 0.08 }); },
    roll()   { for (let i = 0; i < 6; i++) tone([180 - i * 8, 90], 0.09, { type: 'square', vol: 0.16, when: i * 0.11 }); },
    splash() { noise(0.55, { freq: 1400, q: 0.6, vol: 0.4 }); tone([500, 120], 0.4, { type: 'sine', vol: 0.15, when: 0.05 }); },
    /* 만화 컷용 굵은 타격음: 퍽! */
    pow() {
      tone([520, 70], 0.13, { type: 'square', vol: 0.34 });
      noise(0.15, { freq: 950, q: 0.5, vol: 0.36 });
      noise(0.1, { freq: 180, vol: 0.22, when: 0.02 });
    },
    /* 만화 컷용 육중한 타격음: 꽝! */
    boom() {
      tone([100, 32], 0.42, { type: 'sine', vol: 0.46 });
      noise(0.32, { freq: 130, vol: 0.42 });
      noise(0.12, { freq: 2200, q: 0.4, vol: 0.18, when: 0.015 });
    },
    /* 호랑이 비명: 으아악! */
    yelp() {
      tone([420, 1500], 0.11, { type: 'sawtooth', vol: 0.32 });
      noise(0.09, { freq: 1900, vol: 0.26, when: 0.1 });
      tone([1300, 260], 0.24, { type: 'sawtooth', vol: 0.24, when: 0.12 });
    },
    /* 만화 컷 전용: 타격 직전의 공기 가르는 소리 (휙!) */
    whoosh() {
      noise(0.1, { freq: 2600, q: 0.35, vol: 0.16 });
      tone([2200, 500], 0.09, { type: 'sine', vol: 0.1 });
    },
    /* 호랑이 비웃음: 흥, 낄낄낄 */
    laugh() {
      tone([260, 180], 0.14, { type: 'sawtooth', vol: 0.14 }); // 흥~ (콧방귀)
      [660, 800, 720, 860, 760, 900].forEach((f, i) =>
        tone(f, 0.09, { type: 'square', vol: 0.17, when: 0.16 + i * 0.1 }));
    },
    growl()  {
      const c = ensure(); if (!c) return;
      const t0 = c.currentTime;
      const osc = c.createOscillator(); const g = c.createGain(); const lfo = c.createOscillator(); const lg = c.createGain();
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(85, t0);
      lfo.frequency.value = 22; lg.gain.value = 24;
      lfo.connect(lg).connect(osc.frequency);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.06);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.8);
      osc.connect(g).connect(c.destination);
      osc.start(t0); lfo.start(t0); osc.stop(t0 + 0.85); lfo.stop(t0 + 0.85);
    },
    whimper() { tone([600, 900], 0.15, { type: 'sine', vol: 0.2 }); tone([900, 500], 0.25, { type: 'sine', vol: 0.18, when: 0.16 }); },
    miss()   { tone([700, 250], 0.5, { type: 'sine', vol: 0.22 }); },
    gulp()   { tone([300, 110], 0.2, { type: 'sine', vol: 0.3 }); tone([260, 90], 0.25, { type: 'sine', vol: 0.3, when: 0.22 }); },
    sad()    { [392, 349, 311, 262].forEach((f, i) => tone(f, 0.4, { type: 'triangle', vol: 0.2, when: i * 0.42 })); },
    ding()   { tone(1047, 0.12, { type: 'triangle', vol: 0.22 }); tone(1319, 0.2, { type: 'triangle', vol: 0.22, when: 0.12 }); },
    swish()  { noise(0.45, { freq: 1100, q: 0.7, vol: 0.22 }); noise(0.3, { freq: 500, q: 0.8, vol: 0.14, when: 0.12 }); },
    bell()   { [784, 1047, 1319].forEach((f, i) => tone(f, 0.5, { type: 'sine', vol: 0.2, when: i * 0.35 })); },
    jingle() { [523, 659, 784].forEach((f, i) => tone(f, 0.12, { type: 'triangle', vol: 0.18, when: i * 0.09 })); },
    fanfare() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.25, when: i * 0.18 }));
      [523, 659, 784, 1047].forEach((f, i) => tone(f * 1.0, 0.6, { type: 'sine', vol: 0.12, when: 0.75 + i * 0.02 }));
    },
  };
  const SYN = Object.assign({}, api); // 녹음이 없을 때 쓸 합성음 원본
  // 녹음 파일이 있는 효과음은 녹음을 먼저 재생하고, 아직 못 불러왔으면 합성음으로 대신한다
  for (const [name, path] of Object.entries(SFX)) {
    const synth = api[name];
    api[name] = (...a) => { if (name === 'pop' && api.countPop()) return; if (!playSample(path + '.mp3')) synth(...a); };
  }

  /* 스팅 재료가 아직 없을 때의 합성음 (소리가 비지 않게) */
  const run = (fs, gap, type = 'triangle', vol = .16, dur = .1) => fs.forEach((f, i) => tone(f, dur, { type, vol, when: i * gap }));
  const FALLBACK = {
    spring: () => { tone([200, 700], 0.18, { type: 'triangle', vol: 0.25 }); tone([700, 300], 0.2, { type: 'triangle', vol: 0.2, when: 0.18 }); },
    slide: SYN.slide,
    slide_up: () => tone([420, 1700], .55, { vol: .22 }),
    slide_down: () => tone([1700, 300], .75, { vol: .22 }),
    zip: SYN.whoosh, whoosh: SYN.whoosh, cork: SYN.pop, doop: SYN.pop, pop: SYN.pop,
    sparkle: () => run([2093, 2637, 3136, 2637, 3520], .06, 'sine', .08, .25),
    xylo_up: () => run([523, 587, 659, 784, 880, 1047], .065),
    xylo_down: () => run([1047, 880, 784, 659, 587, 523], .065),
    giggle_xylo: () => run([1047, 880, 1047, 880, 1047, 784, 880, 659], .075),
    crash: () => { noise(.5, { freq: 3500, q: .4, vol: .3 }); noise(.3, { freq: 1200, q: .6, vol: .2, when: .08 }); },
    cymbal: () => noise(1.2, { freq: 6500, q: .3, vol: .22 }),
    drumroll: () => { for (let i = 0; i < 9; i++) noise(.05, { freq: 900, vol: .14 + i * .01, when: i * .05 }); },
    tada: () => { tone(784, .12, { type: 'triangle', vol: .22 }); [784, 988, 1175].forEach(f => tone(f, .6, { type: 'triangle', vol: .16, when: .16 })); },
    womp: SYN.sad, bonk: SYN.bonk, thud: SYN.thud, boom: SYN.boom, poke: SYN.poke,
    squeak: () => { tone([1600, 2500], .12, { vol: .18 }); tone([2500, 1700], .14, { vol: .16, when: .13 }); },
    splash_big: SYN.splash, splash: SYN.splash,
    bubbles: () => run([600, 900, 700, 1100, 800], .12, 'sine', .14, .07),
    baby_giggle: SYN.laugh,
    cheer: () => noise(1.6, { freq: 1500, q: .5, vol: .15 }),
    rattle: SYN.roll, chomp: SYN.chomp, crunch: SYN.chomp, gulp: SYN.gulp,
  };
  function layer(name, when, vol, dur) {
    if (playSample('sfx/' + name + '.mp3', vol * STING_VOL, when, dur)) return true;
    const f = FALLBACK[name];
    if (f) { if (when > 0) setTimeout(f, when * 1000); else f(); }
    return false;
  }
  /* AudioFX.sting('hit') — 여러 효과음을 살짝 어긋나게 겹친 만화 효과. 모르는 이름이면 false */
  api.sting = kind => {
    const L = STINGS[kind];
    if (!L) return false;
    ensure();
    L.forEach(([n, t, v, d]) => layer(n, t, v, d));
    return true;
  };
  api.stingKinds = Object.keys(STINGS);
  api.hasSting = kind => kind in STINGS;
  return api;
})();

/* ===== 내레이션 (녹음 + 말풍선) ===== */
const Narrator = (() => {
  const bubble = () => document.getElementById('bubble');
  const bubbleText = () => document.getElementById('bubbleText');

  /* 보호자 메뉴에서 대사 자막을 껐으면 글 상자를 띄우지 않는다 (목소리는 그대로) */
  const captionsOff = () => { try { return localStorage.getItem('captions_off') === '1'; } catch (e) { return false; } };
  function showBubble(text) {
    bubbleText().textContent = text;
    const b = bubble();
    if (captionsOff()) { b.hidden = true; return; }
    b.hidden = false;
    // 재등장 애니메이션 리셋
    b.style.animation = 'none';
    void b.offsetWidth;
    b.style.animation = '';
  }

  function hideBubble() { bubble().hidden = true; }

  /* 말하기: ① 사전 녹음 신경망 음성 → ② 말풍선만(녹음이 없거나 실패하면 소리 없이)
     세대 카운터로, 뒤이어 시작된 내레이션의 말풍선을 앞선 호출이 지우지 못하게 한다 */
  let speakGen = 0;

  /* 클립 경로에서 배역을 읽는다: audio/tc/tiger_ab12cd34ef.mp3, audio/tc/frog/mom_…mp3 → 'tiger', 'mom' (없으면 내레이터) */
  const roleOf = url => (/\/([a-z]+)_[0-9a-f]{10}\.mp3$/.exec(url) || [, 'nar'])[1];

  async function speak(text, { keep = false, onSeg, simultaneous = false, recordedOnly = false, bubble = true } = {}) {
    const gen = ++speakGen;
    AudioFX.stopNarration(); // 겹침 방지: 진행 중인 클립 중단
    const en = englishOn() && NARRATION_CLIPS_EN[text]; // 영어 자료가 없는 문장은 한국어로
    if (bubble) showBubble(en ? en.t : text); else hideBubble();     // 홈은 말풍선 없이 목소리만(2026-10-28 사용자 결정)
    const clip = en ? en.c : (typeof NARRATION_CLIPS !== 'undefined') && NARRATION_CLIPS[text];
    if (clip) {
      /* 이 말하기 뒤에 멈춤(Narrator.stop·AudioFX.stopNarration)이 오면 cut: 기다림을 바로 끝내고 남은 조각도 틀지 않는다 */
      let cut = false;
      const stopped = AudioFX.narStopped().then(() => { cut = true; });
      await Promise.race([AudioFX.voiceIdle(recordedOnly ? null : 4000), stopped]); // 컷신 대사가 끝난 뒤 이어서
      if (gen !== speakGen) return;
      if (cut) { if (!keep) hideBubble(); return; }
      try {
        // 배열이면 배역별 세그먼트를 순서대로 이어서 재생
        const list = Array.isArray(clip) ? clip : [clip];
        if (simultaneous && list.length > 1) {
          await AudioFX.playTogether(list);
        } else for (const url of list) {
          if (gen !== speakGen) return; // 중간에 다른 내레이션이 시작됨
          if (cut) break;               // 멈춤 요청: 남은 조각은 건너뛴다
          if (onSeg) try { onSeg(roleOf(url)); } catch (e) { /* 연출 실패는 무시 */ }
          await AudioFX.playUrl(url, { recordedOnly });
        }
        if (!keep && gen === speakGen) hideBubble();
        return;
      } catch (e) {
        if (recordedOnly) { if (!keep && gen === speakGen) hideBubble(); throw e; }
        /* 클립 실패 → 말풍선만 */
      }
    }
    if (recordedOnly) { if (!keep && gen === speakGen) hideBubble(); return; }
    return speakTTS(en ? en.t : text, keep, gen);
  }

  /* 녹음이 없는 문장: 기계 목소리(브라우저 TTS)로 읽지 않고 말없이 넘어간다(2026-10-29 사용자 결정: 'TTS 할 거면 아예 말을 하지 마').
     말풍선만 읽을 만큼 띄웠다가 닫아서 이야기 속도는 그대로 둔다 */
  function speakTTS(text, keep, gen) {
    return new Promise(resolve => {
      setTimeout(() => { if (!keep && gen === speakGen) hideBubble(); resolve(); }, Math.min(9000, text.length * 145 + 900));
    });
  }

  function stop() {
    speakGen++; // 진행 중인 speak 루프가 다음 세그먼트로 넘어가지 않게 무효화
    AudioFX.stopNarration();
    hideBubble();
  }

  /* 말풍선 없는 소리 대사(VOICE_LINES): 영어 모드면 영어 클립, 없으면 한국어 */
  const voiceLine = k => (englishOn() && typeof VOICE_LINES_EN !== 'undefined' && VOICE_LINES_EN[k]) || (typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k]) || null;

  return { speak, stop, hideBubble, voiceLine };
})();
