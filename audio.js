/* 팥죽할멈과 호랑이 — TTS 내레이션 + Web Audio 합성 효과음 */

const AudioFX = (() => {
  let ctx = null;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

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
  let narSrc = null;

  async function loadClip(url) {
    const c = ensure();
    if (!c) throw new Error('no-audio-ctx');
    if (!narBuffers[url]) {
      const res = await fetch(url);
      if (!res.ok) throw new Error('fetch-fail');
      narBuffers[url] = await c.decodeAudioData(await res.arrayBuffer());
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
  function playSample(path, vol = 0.9) {
    const buf = samples[path];
    if (!buf) { loadSample(path); return false; }
    const c = ensure();
    const s = c.createBufferSource(), g = c.createGain();
    s.buffer = buf; g.gain.value = vol;
    s.connect(g).connect(c.destination); s.start();
    return true;
  }
  const SFX = { thud: 'sfx/thud', boom: 'sfx/boom', pow: 'sfx/pow', bonk: 'sfx/bonk', pop: 'sfx/pop', poke: 'sfx/poke',
    tap: 'sfx/tap', ding: 'sfx/ding', swish: 'sfx/swish', whoosh: 'sfx/whoosh', bell: 'sfx/bell', splash: 'sfx/splash', growl: 'animals/tiger' };
  const EXTRA = ['sfx/knock', 'sfx/chop', 'sfx/creak', 'sfx/drum', 'sfx/step_grass', 'sfx/step_wood', 'sfx/door',
    ...['tiger', 'cow', 'pig', 'duck', 'rooster', 'sheep', 'dog', 'cat', 'owl', 'frog', 'frogs', 'donkey'].map(a => 'animals/' + a)];

  const api = {
    unlock() {
      ensure();
      [...Object.values(SFX), ...EXTRA].forEach(p => loadSample(p + '.mp3'));
    },
    /* 동물 소리: AudioFX.animal('pig') — 실제 녹음, 없으면 false */
    animal(name, vol) { return playSample('animals/' + name + '.mp3', vol); },
    /* 기타 효과음: AudioFX.sfx('chop') */
    sfx(name, vol) { return playSample('sfx/' + name + '.mp3', vol); },
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
    stopNarration() {
      if (narSrc) { try { narSrc.stop(); } catch (e) { /* 무시 */ } narSrc = null; }
    },
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
  // 녹음 파일이 있는 효과음은 녹음을 먼저 재생하고, 아직 못 불러왔으면 합성음으로 대신한다
  for (const [name, path] of Object.entries(SFX)) {
    const synth = api[name];
    api[name] = (...a) => { if (!playSample(path + '.mp3')) synth(...a); };
  }
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

  async function speak(text, { keep = false } = {}) {
    const gen = ++speakGen;
    AudioFX.stopNarration(); // 겹침 방지: 진행 중인 클립 중단
    showBubble(text);
    const clip = (typeof NARRATION_CLIPS !== 'undefined') && NARRATION_CLIPS[text];
    if (clip) {
      try {
        // 배열이면 배역별 세그먼트를 순서대로 이어서 재생
        const list = Array.isArray(clip) ? clip : [clip];
        for (const url of list) {
          if (gen !== speakGen) return; // 중간에 다른 내레이션이 시작됨
          await AudioFX.playUrl(url);
        }
        if (!keep && gen === speakGen) hideBubble();
        return;
      } catch (e) { /* 클립 실패 → 브라우저 TTS 폴백 */ }
    }
    return speakTTS(text, keep, gen);
  }

  function speakTTS(text, keep, gen) {
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
        u.lang = 'ko-KR';
        if (koVoice) u.voice = koVoice;
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

  return { speak, stop, hideBubble };
})();
