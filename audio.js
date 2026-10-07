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
    if (document.hidden) { if (keepAlive) keepAlive.pause(); }  // 화면을 떠나면 붙잡고 있던 세션을 놓아 준다
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

  async function loadClip(url) {
    const c = ensure();
    if (!c) throw new Error('no-audio-ctx');
    if (!narBuffers[url]) {
      const bytes = await fetchBytes(url);
      narBuffers[url] = await c.decodeAudioData(bytes.slice(0)); // slice: 미리 받은 원본은 다시 쓸 수 있게 남긴다
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
  function loadSample(path) {
    if (path in samples) return;
    samples[path] = null;
    const c = ensure(); if (!c) return;
    fetch(SOUND_BASE + path).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
      .then(b => c.decodeAudioData(b)).then(buf => { samples[path] = buf; })
      .catch(() => { samples[path] = false; });
  }
  /* when: 몇 초 뒤, dur: 앞부분만 (초) — 스팅에서 겹쳐 쌓을 때 쓴다 */
  function playSample(path, vol = 0.9, when = 0, dur, rate = 1, offset = 0) {
    const buf = samples[path];
    if (!buf) { loadSample(path); return false; }
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
  const SFX = { thud: 'sfx/thud', boom: 'sfx/boom', pow: 'sfx/pow', bonk: 'sfx/bonk', pop: 'sfx/pop', poke: 'sfx/poke',
    tap: 'sfx/tap', ding: 'sfx/ding', swish: 'sfx/swish', whoosh: 'sfx/whoosh', bell: 'sfx/bell', splash: 'sfx/splash', growl: 'animals/tiger',
    boing: 'sfx/boing', chomp: 'sfx/chomp', gulp: 'sfx/gulp', slide: 'sfx/slide_down' };
  /* 만화 컷용 신나는 효과음 (sounds/CREDITS.md) — sting()이 여러 개를 겹쳐 쓴다 */
  const COMIC = ['spring', 'slide_up', 'slide_down', 'zip', 'cork', 'doop', 'sparkle', 'xylo_up', 'xylo_down', 'giggle_xylo',
    'crash', 'cymbal', 'drumroll', 'tada', 'womp', 'pan', 'squeak', 'splash_big', 'bubbles', 'laugh_deep', 'giggle', 'cheer',
    'rattle', 'uah'];
  const EXTRA = ['sfx/knock', 'sfx/chop', 'sfx/creak', 'sfx/drum', 'sfx/step_grass', 'sfx/step_wood', 'sfx/door', 'sfx/blow', 'sfx/blow_long',
    ...COMIC.map(n => 'sfx/' + n),
    ...['tiger', 'cow', 'pig', 'duck', 'rooster', 'sheep', 'dog', 'cat', 'owl', 'frog', 'frogs', 'donkey'].map(a => 'animals/' + a), 'sfx/paper_turn'];

  /* 스팅: [효과음, 시작(초), 음량, 앞부분만 쓸 길이(초)?] 를 겹쳐서 한 번에 "휙-딱-반짝!" 처럼 울린다.
     음량은 내레이션이 묻히지 않게 0.35~0.95 사이, 전체에 STING_VOL을 곱한다 */
  const STING_VOL = 0.8;
  const STINGS = {
    hit:      [['zip', 0, .6], ['pan', .1, .95], ['sparkle', .22, .45]],                        // 휙-땡!-반짝
    poke:     [['zip', 0, .55], ['poke', .1, .85], ['squeak', .16, .75], ['slide_up', .38, .5]], // 휙-콕!-삑-뿅~
    bigHit:   [['drumroll', 0, .55, .42], ['boom', .4, 1], ['crash', .42, .75], ['cymbal', .46, .6]], // 두구두-쾅!와장창-챙
    slip:     [['slide_down', 0, .6], ['thud', .62, .9], ['boing', .72, .6]],                  // 삐유~-쿵-보잉
    bite:     [['zip', 0, .55], ['chomp', .1, .95], ['squeak', .2, .6], ['uah', .42, .8]],      // 휙-앙!-삑-으악
    splash:   [['whoosh', 0, .6], ['splash_big', .14, .9], ['splash', .2, .5], ['bubbles', .6, .5]], // 휙-풍덩!-보글보글
    roll:     [['rattle', 0, .7], ['drumroll', .08, .35, .6], ['spring', .7, .55], ['boing', .78, .45]], // 달그락 돌돌-띠용
    laugh:    [['giggle_xylo', 0, .45], ['laugh_deep', .2, .8]],                               // 또로롱-으하하
    fail:     [['womp', 0, .7]],                                                               // 빠밤빠밤~
    magic:    [['zip', 0, .35], ['sparkle', .05, .6], ['xylo_up', .3, .55]],                    // 반짝반짝-또로롱
    win:      [['drumroll', 0, .55, .7], ['tada', .62, .85], ['cymbal', .64, .4], ['cheer', .8, .45]], // 두구두구-짜잔!-와아
    surprise: [['slide_up', 0, .55], ['cork', .5, .9], ['sparkle', .55, .35]],                 // 삐융~-뽕!
    dizzy:    [['xylo_down', 0, .5], ['sparkle', .15, .45], ['spring', .9, .45]],              // 또로롱↓-반짝-띠요옹
    ouch:     [['uah', 0, .8], ['squeak', .15, .5], ['xylo_down', .3, .4]],                     // 으악-삑-또로롱↓
  };

  const api = {
    unlock() {
      wake();
      [...Object.values(SFX), ...EXTRA].forEach(p => loadSample(p + '.mp3'));
    },
    /* 동물 소리: AudioFX.animal('pig') — 실제 녹음, 없으면 false */
    animal(name, vol) { return playSample('animals/' + name + '.mp3', vol); },
    /* 동물 소리로 음 하나 부르기: 녹음을 rate배 빠르게(=높게) 재생. 합창·멜로디용 */
    animalNote(name, rate, vol = .7, when = 0, dur) { return playSample('animals/' + name + '.mp3', vol, when, dur, rate); },
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
    sfx(name, vol) { return playSample('sfx/' + name + '.mp3', vol); },
    /* 첫 소리가 합성음으로 새지 않게 미리 불러 둔다: AudioFX.preloadSfx(['paper_up', …]) */
    preloadSfx(names) { names.forEach(n => loadSample('sfx/' + n + '.mp3')); },
    async playUrl(url) {
      const buf = await loadClip(url);
      const c = ensure();
      return new Promise(resolve => {
        const src = c.createBufferSource();
        src.buffer = buf;
        src.connect(c.destination);
        narSrc = src;
        src.onended = () => { if (narSrc === src) narSrc = null; resolve(); };
        src.start();
      });
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
    voiceIdle(ms = 4000) { return Promise.race([voiceDone, new Promise(r => setTimeout(r, ms))]); },
    stopNarration() {
      if (narSrc) { try { narSrc.stop(); } catch (e) { /* 무시 */ } narSrc = null; }
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
    boing()  { tone([200, 700], 0.18, { type: 'triangle', vol: 0.25 }); tone([700, 300], 0.2, { type: 'triangle', vol: 0.2, when: 0.18 }); },
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
    api[name] = (...a) => { if (!playSample(path + '.mp3')) synth(...a); };
  }

  /* 스팅 재료가 아직 없을 때의 합성음 (소리가 비지 않게) */
  const run = (fs, gap, type = 'triangle', vol = .16, dur = .1) => fs.forEach((f, i) => tone(f, dur, { type, vol, when: i * gap }));
  const FALLBACK = {
    spring: SYN.boing, boing: SYN.boing, slide: SYN.slide,
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
    womp: SYN.sad, pan: SYN.bonk, bonk: SYN.bonk, thud: SYN.thud, boom: SYN.boom, poke: SYN.poke,
    squeak: () => { tone([1600, 2500], .12, { vol: .18 }); tone([2500, 1700], .14, { vol: .16, when: .13 }); },
    splash_big: SYN.splash, splash: SYN.splash,
    bubbles: () => run([600, 900, 700, 1100, 800], .12, 'sine', .14, .07),
    laugh_deep: SYN.laugh, giggle: SYN.laugh,
    cheer: () => noise(1.6, { freq: 1500, q: .5, vol: .15 }),
    rattle: SYN.roll, chomp: SYN.chomp, gulp: SYN.gulp, uah: SYN.yelp,
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

/* ===== 내레이션 (TTS + 말풍선) ===== */
const Narrator = (() => {
  const bubble = () => document.getElementById('bubble');
  const bubbleText = () => document.getElementById('bubbleText');
  let koVoice = null;
  let voicesReady = false;

  function pickVoice() {
    if (!('speechSynthesis' in window)) return;
    const vs = speechSynthesis.getVoices();
    if (vs.length) voicesReady = true;
    // 품질 좋은 음성 우선: 애플 유나 > 신경망/자연어 계열 > 네트워크 음성 > 나머지
    const ko = vs.filter(v => v.lang && v.lang.toLowerCase().startsWith('ko'));
    const rank = v =>
      (/yuna|유나/i.test(v.name) ? 4 : 0) +
      (/natural|neural|sunhi|injoon|premium|enhanced/i.test(v.name) ? 3 : 0) +
      (/google/i.test(v.name) ? 2 : 0) +
      (v.localService ? 0 : 1);
    koVoice = ko.sort((a, b) => rank(b) - rank(a))[0] || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  function showBubble(text) {
    bubbleText().textContent = text;
    const b = bubble();
    b.hidden = false;
    // 재등장 애니메이션 리셋
    b.style.animation = 'none';
    void b.offsetWidth;
    b.style.animation = '';
  }

  function hideBubble() { bubble().hidden = true; }

  /* 말하기: ① 사전 녹음 신경망 음성 → ② 브라우저 TTS → ③ 말풍선만 (순서대로 폴백)
     세대 카운터로, 뒤이어 시작된 내레이션의 말풍선을 앞선 호출이 지우지 못하게 한다 */
  let speakGen = 0;

  /* 클립 경로에서 배역을 읽는다: audio/tc/tiger_ab12cd34ef.mp3, audio/tc/frog/mom_…mp3 → 'tiger', 'mom' (없으면 내레이터) */
  const roleOf = url => (/\/([a-z]+)_[0-9a-f]{10}\.mp3$/.exec(url) || [, 'nar'])[1];

  async function speak(text, { keep = false, onSeg } = {}) {
    const gen = ++speakGen;
    AudioFX.stopNarration(); // 겹침 방지: 진행 중인 클립 중단
    const en = englishOn() && NARRATION_CLIPS_EN[text]; // 영어 자료가 없는 문장은 한국어로
    showBubble(en ? en.t : text);
    const clip = en ? en.c : (typeof NARRATION_CLIPS !== 'undefined') && NARRATION_CLIPS[text];
    if (clip) {
      await AudioFX.voiceIdle(); // 컷신 대사가 끝난 뒤 이어서
      if (gen !== speakGen) return;
      try {
        // 배열이면 배역별 세그먼트를 순서대로 이어서 재생
        const list = Array.isArray(clip) ? clip : [clip];
        for (const url of list) {
          if (gen !== speakGen) return; // 중간에 다른 내레이션이 시작됨
          if (onSeg) try { onSeg(roleOf(url)); } catch (e) { /* 연출 실패는 무시 */ }
          await AudioFX.playUrl(url);
        }
        if (!keep && gen === speakGen) hideBubble();
        return;
      } catch (e) { /* 클립 실패 → 브라우저 TTS 폴백 */ }
    }
    return speakTTS(en ? en.t : text, keep, gen, !!en);
  }

  function speakTTS(text, keep, gen, english) {
    return new Promise(resolve => {
      const fallbackMs = Math.min(9000, text.length * 145 + 900);
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        if (!keep && gen === speakGen) hideBubble();
        resolve();
      };
      if ('speechSynthesis' in window && (voicesReady || speechSynthesis.getVoices().length)) {
        if (!koVoice) pickVoice();
        try { speechSynthesis.cancel(); } catch (e) { /* 무시 */ }
        const u = new SpeechSynthesisUtterance(text);
        u.lang = english ? 'en-US' : 'ko-KR';
        if (koVoice && !english) u.voice = koVoice;
        u.rate = 0.95;
        u.pitch = 1.1;
        u.onend = finish;
        u.onerror = finish;
        speechSynthesis.speak(u);
        // TTS가 멈추는 경우 대비 안전 타이머
        setTimeout(finish, fallbackMs * 2.2);
      } else {
        setTimeout(finish, fallbackMs);
      }
    });
  }

  function stop() {
    speakGen++; // 진행 중인 speak 루프가 다음 세그먼트로 넘어가지 않게 무효화
    AudioFX.stopNarration();
    if ('speechSynthesis' in window) { try { speechSynthesis.cancel(); } catch (e) { /* 무시 */ } }
    hideBubble();
  }

  /* 말풍선 없는 소리 대사(VOICE_LINES): 영어 모드면 영어 클립, 없으면 한국어 */
  const voiceLine = k => (englishOn() && typeof VOICE_LINES_EN !== 'undefined' && VOICE_LINES_EN[k]) || (typeof VOICE_LINES !== 'undefined' && VOICE_LINES[k]) || null;

  return { speak, stop, hideBubble, voiceLine };
})();
