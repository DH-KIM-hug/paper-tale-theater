/* 잠자리 이어 듣기 플레이어 (docs/BEDTIME_PLAN.md)
   동화 페이지를 옮겨 다니지 않고 이 문서 하나에서 <audio> 한 흐름으로 여러 편을 잇는다.
   줄 → 줄 → 다음 동화는 오디오 ended 사슬이다(rAF 를 쓰지 않고, 화면이 가려지면 줄 사이 쉼도 건너뛴다).
   주소: bedtime.html?mode=random|list  (확인용: &count=N  &ids=a,b  &dim=초) */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const EN = siteLang() === 'en';
  const L = (ko, en) => EN ? en : ko;
  const KEY = 'paperTheater.bedtime', RECENT = 'paperTheater.recentRead';
  const P = new URLSearchParams(location.search);
  const MODE = P.get('mode') === 'list' ? 'list' : 'random';
  const GAP_TALE = 3000, GAP_TITLE = 1000, GAP_LINE = 700, GAP_SCENE = 1500;
  const DIM_MS = (Number(P.get('dim')) > 0 ? Number(P.get('dim')) : 60) * 1000;

  /* 설정(로컬 저장): { count: 2, playlist: ['rabbit', …] } */
  const settings = () => { try { const o = JSON.parse(localStorage.getItem(KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } };
  const readList = k => { try { const a = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(a) ? a.filter(x => typeof x === 'string') : []; } catch (e) { return []; } };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const title = t => (EN && t.en && t.en.title) || t.title;

  /* ── 후보와 큐 (잠긴 동화·만드는 중·(영어 모드)영어 읽기 없는 동화는 뺀다) ── */
  const okTale = t => !!(t && t.read && t.ready && Entitlements.canPlay(t.id) && (!EN || t.readEn));
  function buildQueue() {
    const byId = id => TALES.find(t => t.id === id);
    const ids = (P.get('ids') || '').split(',').filter(Boolean);
    if (ids.length) return ids.map(byId).filter(okTale);
    const st = settings();
    if (MODE === 'list') return (Array.isArray(st.playlist) ? st.playlist : []).map(byId).filter(okTale).slice(0, 5);
    const n = [1, 2, 3, 5].includes(Number(P.get('count'))) ? Number(P.get('count')) : ([1, 2, 3, 5].includes(st.count) ? st.count : 2);
    const pool = TALES.filter(okTale), recent = readList(RECENT).slice(0, 8);
    const fresh = shuffle(pool.filter(t => !recent.includes(t.id))), old = shuffle(pool.filter(t => recent.includes(t.id)));
    return [...fresh, ...old].slice(0, n);
  }

  /* ── 상태 ── */
  const Q = buildQueue();
  const B = window.__BED = { mode: MODE, queue: Q.map(t => t.id), idx: -1, said: 0, skipped: [], timeouts: [], failed: 0, titles: 0, started: false, done: false, phase: 'start', lines: 0 };
  let held = false, unhold = null, stopped = false, skipFlag = false, wakeGap = null, ended = false;
  const HOME = { ko: Object.assign({}, NARRATION_CLIPS), en: Object.assign({}, NARRATION_CLIPS_EN) };
  const plug = () => { try { return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.BedtimeAudio; } catch (e) { return null; } };
  const nativeCall = m => { const p = plug(); if (!p || !p[m]) return Promise.resolve(); try { return Promise.resolve(p[m]()).catch(() => {}); } catch (e) { return Promise.resolve(); } };

  /* ── 화면 ── */
  const state = s => { document.body.dataset.state = s; B.phase = s; };
  const tall = () => innerHeight > innerWidth;
  const coverSrc = t => `assets/thumbs/${t.id}_key_${tall() ? 'tall' : 'wide'}.webp`;
  let curCover = null;
  function setCover(t) {
    curCover = t;
    const a = $('#cvA'), b = $('#cvB'), on = a.classList.contains('on') ? a : b, off = on === a ? b : a;
    const src = coverSrc(t);
    if (on.getAttribute('src') === src) return;
    off.onload = off.onerror = () => { off.onload = off.onerror = null; off.classList.add('on'); on.classList.remove('on'); };
    off.src = src;
    if (off.complete && off.naturalWidth) off.onload();
  }
  addEventListener('resize', () => { if (curCover) setCover(curCover); });
  const setMeta = i => {
    const nx = Q[i + 1];
    $('#meta').textContent = L(`${Q.length}편 중 ${i + 1}편째`, `Tale ${i + 1} of ${Q.length}`);
    $('#next').textContent = nx ? L(`다음: ${title(nx)}`, `Next: ${title(nx)}`) : L('다음: 없음 · 끝나면 조용히 멈춰요', 'Next: none · it stops quietly');
  };
  /* 생성 그림 단추(UI_REDESIGN §6-2: ic_pause · ic_play 44) */
  const SVG_PAUSE = '<img src="assets/ui/ic_pause.webp" alt="" aria-hidden="true" draggable="false">';
  const SVG_PLAY = '<img class="play" src="assets/ui/ic_play.webp" alt="" aria-hidden="true" draggable="false">';
  function paintPause() {
    const b = $('#pauseBtn');
    b.innerHTML = held ? SVG_PLAY : SVG_PAUSE;
    b.setAttribute('aria-label', held ? L('다시', 'Resume') : L('멈춤', 'Pause'));
  }

  /* ── 60초 무입력 → 어두운 덮개 ── */
  let dimT = 0;
  function armDim() { clearTimeout(dimT); dimT = setTimeout(() => document.body.classList.add('dim'), DIM_MS); }
  function userSeen() { if (!document.body.classList.contains('dim')) armDim(); }
  ['pointerdown', 'keydown', 'pointermove'].forEach(ev => addEventListener(ev, userSeen, { passive: true }));
  $('#veil').addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); document.body.classList.remove('dim'); armDim(); });

  /* ── 대본·녹음 맵 읽기 (동화 코드는 쓰지 않는다) ── */
  const voiceTc = (() => { try { return localStorage.getItem('voice') === 'tc'; } catch (e) { return false; } })();
  const getText = async u => { try { const r = await fetch(u); return r.ok ? await r.text() : null; } catch (e) { return null; } };
  async function loadTale(t) {
    const dir = `tales/${t.folder || t.id}/`;
    const scTxt = await getText(dir + (EN ? 'read_script_en.json' : 'read_script_el.json'));
    let sc = null; try { sc = scTxt && JSON.parse(scTxt); } catch (e) { /* 아래에서 건너뜀 */ }
    const files = ['narration.js'].concat(EN ? ['narration_en.js'] : []);
    if (!voiceTc) files.push('narration_el.js', 'read_narration_el.js', ...(EN ? ['narration_el_en.js', 'read_narration_el_en.js'] : []));
    const ns = { ko: {}, en: {} };
    for (const f of files) {
      const txt = await getText(dir + f); if (!txt) continue;
      try {
        const fn = new Function('NARRATION_CLIPS', 'NARRATION_CLIPS_EN', txt.replace(/^const (NARRATION_CLIPS(?:_EN)?) =/mg, '$1 =') + '\n;return [NARRATION_CLIPS, NARRATION_CLIPS_EN];');
        const [a, b] = fn(ns.ko, ns.en); ns.ko = a; ns.en = b;
      } catch (e) { console.warn('[bedtime] 녹음 맵 오류', dir + f, e); }
    }
    return { sc, ns };
  }
  /* 전역 녹음 맵을 통째로 바꾼다(다른 동화와 같은 문장이 다른 녹음일 수 있어서) */
  function install(ko, en) {
    for (const k of Object.keys(NARRATION_CLIPS)) delete NARRATION_CLIPS[k];
    for (const k of Object.keys(NARRATION_CLIPS_EN)) delete NARRATION_CLIPS_EN[k];
    Object.assign(NARRATION_CLIPS, ko); Object.assign(NARRATION_CLIPS_EN, en);
  }
  const hasClip = text => EN ? !!(NARRATION_CLIPS_EN[text] && NARRATION_CLIPS_EN[text].c) : !!NARRATION_CLIPS[text];

  /* ── 기다림 도구 ── */
  const waitHeld = async () => { while (held && !stopped) await new Promise(r => { unhold = r; }); };
  const gapShort = ms => document.hidden ? Promise.resolve() : sleep(ms);       // 안 보이면 쉼을 건너뛰고 ended 로만 잇는다
  const gapLong = ms => new Promise(r => { const t = setTimeout(done, ms); wakeGap = done; function done() { clearTimeout(t); wakeGap = null; r(); } });
  /* 한 줄 말하기 + 시간 제한(녹음 길이 + 3초, 길이를 모르면 8초 + 글자당 0.25초). 일시정지 동안은 시계를 멈춘다 */
  function sayGuarded(text, simultaneous) {
    const est = 8000 + String(text).length * 250, n0 = AudioFX.narInfo().n;
    const p = Promise.resolve(Narrator.speak(text, { simultaneous: !!simultaneous, recordedOnly: true })).catch(e => { B.failed++; console.warn('[bedtime] 녹음 실패', String(text).slice(0, 20), e && e.message); });
    return new Promise(res => {
      let over = false, extra = 0, last = Date.now();
      const t0 = last;
      const finish = late => { if (over) return; over = true; clearInterval(iv); res(late); };
      const iv = setInterval(() => {
        const now = Date.now(); if (held) extra += now - last; last = now;
        const ni = AudioFX.narInfo();
        const lim = ni.n !== n0 ? Math.max(0, ni.t - t0) + (ni.dur ? ni.dur * 1000 + 3000 : est) : est;
        if (now - t0 - extra > lim) { console.warn('[bedtime] 시간 제한으로 넘어감:', String(text).slice(0, 20)); B.timeouts.push(String(text).slice(0, 20)); try { Narrator.stop(); } catch (e) { /* 무시 */ } finish(true); }
      }, 500);
      p.then(() => finish(false));
    });
  }

  /* ── Media Session (잠금 화면·알림 센터) ── */
  const MS = 'mediaSession' in navigator ? navigator.mediaSession : null;
  function msMeta(t) {
    if (!MS || typeof MediaMetadata !== 'function') return;
    try {
      MS.metadata = new MediaMetadata({ title: title(t), artist: L('종이 동화극장 · 잠자리', 'Paper Tale Theater · Bedtime'),
        artwork: [{ src: new URL(`assets/thumbs/${t.id}_tile.webp`, location.href).href, sizes: '512x512', type: 'image/webp' }] });
    } catch (e) { /* 무시 */ }
  }
  function msOn() {
    if (!MS) return;
    try {
      MS.playbackState = 'playing';
      MS.setActionHandler('pause', () => setHeld(true));
      MS.setActionHandler('play', () => setHeld(false));
      MS.setActionHandler('nexttrack', () => skip());
    } catch (e) { /* 무시 */ }
  }
  function msOff() {
    if (!MS) return;
    try { MS.playbackState = 'none'; ['pause', 'play', 'nexttrack'].forEach(a => MS.setActionHandler(a, null)); MS.metadata = null; } catch (e) { /* 무시 */ }
  }

  /* ── 조작 ── */
  function setHeld(on) {
    if (ended || !B.started) return;
    held = !!on;
    AudioFX.narHold(held);
    if (MS) { try { MS.playbackState = held ? 'paused' : 'playing'; } catch (e) { /* 무시 */ } }
    if (!held && unhold) { const r = unhold; unhold = null; r(); }
    paintPause();
  }
  function skip() {
    if (ended || !B.started) return;
    if (held) setHeld(false);
    if (B.phase === 'tale') skipFlag = true;
    if (wakeGap) wakeGap();
    try { Narrator.stop(); } catch (e) { /* 무시 */ }
  }
  $('#pauseBtn').addEventListener('click', () => setHeld(!held));
  $('#nextBtn').addEventListener('click', skip);

  /* ── 세션 끝내기: <audio>·무음 루프·Media Session·네이티브 세션을 모두 놓는다 ── */
  function endSession() {
    if (ended) return; ended = true; stopped = true;
    if (unhold) { const r = unhold; unhold = null; r(); }
    if (wakeGap) wakeGap();
    try { Narrator.stop(); } catch (e) { /* 무시 */ }
    try { AudioFX.sessionEnd(); } catch (e) { /* 무시 */ }
    msOff();
    nativeCall('end');
  }
  $('#homeBtn').addEventListener('click', e => { e.preventDefault(); endSession(); location.href = 'index.html#night'; });
  addEventListener('pagehide', () => { if (!ended) endSession(); });
  (() => { const p = plug(); if (p && p.addListener) try { p.addListener('interruption', ev => { if (ev && ev.state === 'ended' && !held && !ended) AudioFX.narHold(false); }); } catch (e) { /* 무시 */ } })();

  /* ── 한 편 ── */
  const pushRecent = id => { try { localStorage.setItem(RECENT, JSON.stringify([id, ...readList(RECENT).filter(x => x !== id)].slice(0, 8))); } catch (e) { /* 무시 */ } };
  let preload = null;
  async function playTale(i) {
    const t = Q[i];
    B.idx = i; skipFlag = false;
    console.log(`[bedtime] ${t.id} ${i + 1}/${Q.length}`);
    setCover(t); setMeta(i); msMeta(t);
    $('#ttl').textContent = title(t); $('#card').textContent = '';
    pushRecent(t.id);
    const mine = preload || loadTale(t);
    preload = null;
    /* 동화 사이: 무음 3초 → 제목 읽기 → 1초 */
    if (i > 0) { B.phase = 'gap'; await gapLong(GAP_TALE); if (stopped) return; }
    await waitHeld();
    B.phase = 'title';
    install(HOME.ko, HOME.en);
    if (hasClip(t.title)) { B.titles++; await sayGuarded(t.title, false); }
    if (stopped) return;
    await gapShort(GAP_TITLE); if (stopped) return;
    const { sc, ns } = await mine;
    if (!sc || !Array.isArray(sc.scenes)) { console.warn('[bedtime] 대본 없음', t.id); B.skipped.push(t.id + ':대본'); return; }
    install(ns.ko, ns.en);
    try { AudioFX.prefetchClips(); } catch (e) { /* 무시 */ }
    if (Q[i + 1]) preload = loadTale(Q[i + 1]);          // 다음 편 대본·녹음 맵은 미리 읽어 둔다
    B.phase = 'tale';
    for (const s of sc.scenes) {
      $('#card').textContent = s.card || '';
      const lines = s.lines || [];
      for (let j = 0; j < lines.length; j++) {
        await waitHeld();
        if (stopped) return;
        if (skipFlag) { skipFlag = false; return; }
        const l = lines[j];
        B.lines++;
        if (!hasClip(l.text)) { B.skipped.push(t.id + ':' + String(l.text).slice(0, 14)); continue; }
        await sayGuarded(l.text, l.simultaneous === true);
        B.said++;
        if (skipFlag) { skipFlag = false; return; }
        if (stopped) return;
        await gapShort(j === lines.length - 1 ? GAP_SCENE : GAP_LINE);
      }
    }
  }

  /* ── 시작 ── */
  async function run() {
    B.started = true;
    state('play'); paintPause();
    document.body.dataset.state = 'play';
    msOn();
    armDim();
    try {
      for (let i = 0; i < Q.length && !stopped; i++) await playTale(i);
      if (!stopped) { B.phase = 'closing'; await gapLong(GAP_TALE); }
    } finally {
      if (!ended) {
        endSession();
        state('end'); B.done = true;
        $('#ttl').textContent = ''; armDim();
        console.log('[bedtime] 끝');
      }
    }
  }
  function begin() {
    if (B.started) return;
    /* 이 누름 안에서: 내레이션 <audio> 허락 + 무음 유지 루프 + 네이티브 오디오 세션 */
    nativeCall('begin');
    /* 무음 유지 루프(keepAlive)는 이 누름의 click 에서 audio.js 가 깨운다 */
    try { AudioFX.mediaNarration(true); } catch (e) { /* 무시 */ }
    $('#startBtn').classList.remove('hint');
    run();
  }
  $('#startBtn').addEventListener('click', begin);

  function init() {
    $('#startBtn').textContent = L('듣기 시작', 'Start listening');
    $('#endT').textContent = L('다 들었어요', 'All done');
    $('#nextBtn').setAttribute('aria-label', L('건너뛰기', 'Skip'));
    $('#homeBtn').setAttribute('aria-label', L('집', 'Home'));
    document.documentElement.lang = EN ? 'en' : 'ko';
    document.title = L('잠자리 이어 듣기', 'Bedtime listening');
    if (!Q.length) {
      state('empty');
      $('#empty').textContent = MODE === 'list' ? L('재생목록이 비어 있어요. 어른이 잠자리 탭에서 만들어 주세요.', 'The playlist is empty. A grown-up can make one in the Bedtime tab.')
        : EN ? L('', 'English read-aloud is getting ready.') : L('들려줄 이야기가 아직 없어요.', 'No tales to play yet.');
      return;
    }
    setCover(Q[0]);
    $('#ttl').textContent = title(Q[0]);
    $('#plan').textContent = L(`${Q.length}편 · `, `${Q.length} tale${Q.length > 1 ? 's' : ''} · `) + Q.map(title).join(' → ');
    state('start');
    setTimeout(() => { if (!B.started) $('#startBtn').classList.add('hint'); }, 5000);
  }
  init();
})();
