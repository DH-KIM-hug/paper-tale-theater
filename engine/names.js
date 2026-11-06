/* 이름 바꾸기 — 앱 쪽 (docs/NAME_CHANGE_PLAN.md · 맨 끝 '확정 사항'이 본문보다 우선). 일반 script, 전역 window.Names.
   engine/name_form.js(NameForm, 서버와 같은 받침 함수) 뒤에, 녹음 맵(narration*.js · home_narration_el.js) 뒤에 넣는다.

   · 자리 A·B·C(아이 셋)·D(강아지 꿀떡이) 네 편 공통. 설정은 이 기기 localStorage 'paperTheater.names' 에만(서버 state 에 넣지 않는다)
   · 받은 녹음: 앱 = Capacitor Filesystem  Directory.Data/names/<version>/<tale>/<lang>/<id>.(wav|mp3)
                웹(시험) = IndexedDB 'paperTheaterNames' (Filesystem 플러그인이 없을 때)
   · 덮어쓰기: 녹음 맵의 열쇠(원문)는 그대로 두고 값(파일 주소)만 바꾼다. 동화 한 편이 그 언어로 다 받아졌을 때만 그 동화를 덮는다.
     '원래 이름으로 듣기'를 켜면 파일은 두고 덮어쓰기만 끈다
   · 화면 글자: Names.view(글, 동화id) — 원래 이름(다현이·이현이·은우·꿀떡이 / Dahyun …)을 받침 규칙으로 바꾼다. 꺼져 있으면 글 그대로
   · 서버 호출은 Entitlements.nameCall(인증 Bearer) 로만. 이름은 요청 본문에만 실리고 서버에 남지 않는다
   · TTS 없음: 녹음이 다 받아지지 않은 동화는 원래 녹음을 그대로 쓴다 */
const Names = (() => {
  const K_SET = 'paperTheater.names', K_CAT = 'paperTheater.names.cat';
  const SLOTS = ['A', 'B', 'C', 'D'];
  const NF = () => (typeof NameForm !== 'undefined' ? NameForm : null);
  const rd = (k, f) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? f : v; } catch (e) { return f; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 못 하면 이번 실행만 */ } };
  const blank = () => ({ names: {}, on: false, original: false, version: '', done: {}, got: {}, run: null, err: '' });
  let S = Object.assign(blank(), rd(K_SET, {}));
  const save = () => wr(K_SET, S);
  const cat = () => rd(K_CAT, null);

  const here = (() => { try { const m = location.pathname.match(/\/tales\/([^/]+)\//); return m ? decodeURIComponent(m[1]) : 'home'; } catch (e) { return 'home'; } })();
  const langNow = () => { try { return localStorage.getItem('lang') === 'en' ? 'en' : 'ko'; } catch (e) { return 'ko'; } };

  /* ───────── 이름 목록 ───────── */
  const clean = n => { const o = {}; SLOTS.forEach(s => { const k = String((n && n[s]) || '').trim(), e = String((n && n[s + '_en']) || '').trim(); if (k) o[s] = k; if (e) o[s + '_en'] = e.charAt(0).toUpperCase() + e.slice(1); }); return o; };
  const setSlots = (names, lang) => SLOTS.filter(s => names[lang === 'en' ? s + '_en' : s]);
  /* 줄이 쓰는 자리: 서버 템플릿(tpl/tplEn)에서 읽는다 */
  const slotsOf = (line, lang) => {
    const t = lang === 'en' ? line.tplEn : line.tpl; if (!t || !NF()) return [];
    return NF().slotsIn(t).filter(k => (lang === 'en') === /_en$/.test(k)).map(k => k[0]);
  };
  /* 이 이름 묶음으로 새로 받아야 하는 줄: 이름을 넣은 자리가 든 줄만(한국어), 영어는 영어 이름을 넣은 자리가 든 줄만 */
  function needed(tale, lang, names = S.names) {
    const c = cat(), t = c && c.tales && c.tales[tale]; if (!t) return [];
    const on = setSlots(names, lang);
    if (!on.length) return [];
    return (t.lines || []).filter(l => (lang === 'en' ? l.tplEn : l.tpl) && (!Array.isArray(l.langs) || l.langs.includes(lang)) && slotsOf(l, lang).some(s => on.includes(s)));
  }
  const keyOf = (tale, lang, id) => tale + '/' + lang + '/' + id;
  const pathOf = (tale, lang, id, ext) => `names/${S.version}/${tale}/${lang}/${id}.${ext}`;
  const active = (tale, lang) => !!(S.on && !S.original && S.version && cat() && cat().version === S.version && S.done[tale] && S.done[tale][lang]);

  /* ───────── 파일 저장소: 앱 = Filesystem, 웹 = IndexedDB ───────── */
  const FS = (() => { try { const C = window.Capacitor; if (!C || !(C.isNativePlatform ? C.isNativePlatform() : true)) return null; return (C.Plugins && C.Plugins.Filesystem) || (C.registerPlugin ? C.registerPlugin('Filesystem') : null); } catch (e) { return null; } })();
  const b64 = buf => { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  let idbP = null;
  const idb = () => idbP || (idbP = new Promise((res, rej) => { const q = indexedDB.open('paperTheaterNames', 1); q.onupgradeneeded = () => q.result.createObjectStore('files'); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }));
  const idbDo = (mode, f) => idb().then(db => new Promise((res, rej) => { const tx = db.transaction('files', mode), r = f(tx.objectStore('files')); tx.oncomplete = () => res(r && r.result); tx.onerror = () => rej(tx.error); }));
  let baseUri = null;
  async function fsBase() {
    if (baseUri) return baseUri;
    const r = await FS.getUri({ path: 'names', directory: 'DATA' });
    return (baseUri = String(r.uri).replace(/\/$/, ''));
  }
  async function putFile(path, bytes, type) {
    if (FS) { await FS.writeFile({ path, data: b64(bytes), directory: 'DATA', recursive: true }); return; }
    await idbDo('readwrite', st => st.put(new Blob([bytes], { type }), path));
  }
  const blobUrls = {};
  async function urlOf(path) {
    if (FS) { const b = await fsBase(); const u = b + '/' + path.replace(/^names\//, ''); return window.Capacitor.convertFileSrc ? window.Capacitor.convertFileSrc(u) : u; }
    if (blobUrls[path]) return blobUrls[path];
    const blob = await idbDo('readonly', st => st.get(path));
    return blob ? (blobUrls[path] = URL.createObjectURL(blob)) : null;
  }
  async function dropVersion(v) {
    if (!v) return;
    try {
      if (FS) await FS.rmdir({ path: 'names/' + v, directory: 'DATA', recursive: true });
      else await idbDo('readwrite', st => { const r = st.openCursor(); r.onsuccess = () => { const c = r.result; if (!c) return; if (String(c.key).startsWith('names/' + v + '/')) c.delete(); c.continue(); }; return null; });
    } catch (e) { /* 없으면 그만 */ }
  }

  /* ───────── 녹음 맵 덮어쓰기 ───────── */
  const orig = { ko: {}, en: {} };   // 덮기 전 값(되돌리기용)
  const mapKo = () => (typeof NARRATION_CLIPS !== 'undefined' ? NARRATION_CLIPS : null);
  const mapEn = () => (typeof NARRATION_CLIPS_EN !== 'undefined' ? NARRATION_CLIPS_EN : null);
  function restore() {
    const ko = mapKo(), en = mapEn();
    if (ko) Object.keys(orig.ko).forEach(k => { ko[k] = orig.ko[k]; });
    if (en) Object.keys(orig.en).forEach(k => { en[k] = orig.en[k]; });
    orig.ko = {}; orig.en = {};
  }
  /* 지금 페이지(동화 한 편 또는 홈)의 맵에 덮는다. 맵이 더 실린 뒤(읽어 주기 맵 등) 다시 불러도 된다 */
  async function apply() {
    restore();
    const ko = mapKo(), en = mapEn(), c = cat();
    if (!c || !c.tales || !c.tales[here]) return 0;
    let n = 0;
    for (const lang of ['ko', 'en']) {
      if (!active(here, lang)) continue;
      for (const l of needed(here, lang)) {
        const ext = S.got[keyOf(here, lang, l.id)]; if (!ext) continue;
        let u = null; try { u = await urlOf(pathOf(here, lang, l.id, ext)); } catch (e) { u = null; }
        if (!u) continue;
        if (lang === 'en') u += '#nm-en';   // audio.js 가 영어 0.9배로 늘린다(원래 영어 녹음과 같은 속도)
        /* 여러 배역 조각으로 된 줄(값이 배열)은 이름이 든 조각(seg·segEn 번째)만 바꾼다 */
        const put = (old, seg) => (seg != null && Array.isArray(old) ? old.map((x, i) => (i === seg ? u : x)) : u);
        if (lang === 'ko' && ko && l.key in ko) { if (!(l.key in orig.ko)) orig.ko[l.key] = ko[l.key]; ko[l.key] = put(orig.ko[l.key], l.seg); n++; }
        if (lang === 'en' && en) {
          const k = [l.keyEn, l.key, l.en].find(x => x && x in en);   // 홈 맵은 영어 글(keyEn)이 열쇠다
          if (k) { if (!(k in orig.en)) orig.en[k] = en[k]; en[k] = Object.assign({}, orig.en[k], { c: put(orig.en[k].c, l.segEn) }); n++; }
        }
      }
    }
    return n;
  }

  /* ───────── 화면 글자 ───────── */
  const KO_RE = /(다현|이현|은우|꿀떡(?=이|아))(이(?:에게|한테|는|가|와|의|를|도|랑|만|야)?|에게|한테|는|가|와|의|를|도|랑|만|야|아)?/g;
  const SLOT_KO = { 다현: 'A', 이현: 'B', 은우: 'C', 꿀떡: 'D' };
  const SLOT_EN = { Dahyun: 'A', Ihyun: 'B', Eunwoo: 'C', Kkulddeok: 'D' };
  /* 원문 → 템플릿: 다현이가 → {A:이가/가}, 이현이야 → {B:아/야}, 다현이 → {A:이/}, 은우 → {C:이/}, 받침 이름 맨몸(다현·) → {A} */
  function templatize(text, only = SLOTS) {   // only: 바꿀 자리(그 밖의 이름은 원문 그대로 둔다)
    return String(text).replace(KO_RE, (m, nm, tail) => {
      const s = SLOT_KO[nm], bat = nm !== '은우';
      if (!only.includes(s)) return m;
      tail = tail || '';
      if (/^이?야$/.test(tail) || tail === '아') return `{${s}:아/야}`;
      const j = tail.replace(/^이/, '');
      if (!tail && bat) return `{${s}}`;                       // 다현·이현이 같은 맨몸
      if (tail === '이' + j || !bat) return `{${s}:이${j}/${j}}`;
      return `{${s}}` + tail;                                  // 받침 이름 + '이' 없이 조사(원문에 없음)
    }).replace(/\b(Dahyun|Ihyun|Eunwoo|Kkulddeok)\b/g, (m, n) => (only.includes(SLOT_EN[n] + '_en') ? `{${SLOT_EN[n]}_en}` : m));
  }
  function view(text, tale = here) {
    if (typeof text !== 'string' || !text || !NF() || !S.on || S.original) return text;
    const c = cat(); if (!c || !c.tales || !c.tales[tale]) return text;
    const names = {};
    SLOTS.forEach(s => { if (active(tale, 'ko') && S.names[s]) names[s] = S.names[s]; if (active(tale, 'en') && S.names[s + '_en']) names[s + '_en'] = S.names[s + '_en']; });
    if (!Object.keys(names).length) return text;
    if (!/다현|이현|은우|꿀떡|Dahyun|Ihyun|Eunwoo|Kkulddeok/.test(text)) return text;
    return NF().fill(templatize(text, Object.keys(names)), names);
  }

  /* ───────── 서버 ───────── */
  const E = () => (typeof Entitlements !== 'undefined' ? Entitlements : null);
  const supported = () => { const e = E(); return !!(e && e.nameCall && e.syncEnabled && e.syncEnabled() && NF()); };
  const call = (m, p, b, o) => E().nameCall(m, p, b, o);
  async function fetchCatalog() {
    const r = await call('GET', '/name/catalog');
    if (r.ok && r.data && r.data.tales) { wr(K_CAT, { version: r.data.version, slots: r.data.slots, tales: r.data.tales }); }
    return r;
  }
  const quota = () => call('GET', '/name/quota');
  const check = names => call('POST', '/name/check', { names: clean(names) });

  /* ───────── 다듬기(polish.py 흉내): 하이패스 85 · 250Hz −2.5 · 3.2kHz +2 · 압축 2.5:1 · −16 LUFS · 봉우리 0.84 → WAV 16bit 모노 24kHz ───────── */
  const OAC = () => window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const SR = 24000;
  async function render(buf, chain) {
    const C = OAC(), o = new C(1, Math.max(1, Math.ceil(buf.duration * SR)), SR), src = o.createBufferSource();
    src.buffer = buf; let last = src;
    for (const f of chain(o)) { last.connect(f); last = f; }
    last.connect(o.destination); src.start(0);
    return o.startRendering();
  }
  const biq = (o, type, f, q, g) => { const b = o.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q != null) b.Q.value = q; if (g != null) b.gain.value = g; return b; };
  /* 음량(LUFS 근사): K 가중(고역 선반 +4dB @1.5kHz, 하이패스 38Hz) 뒤 400ms 블록, 절대 −70·상대 −10 문턱 */
  async function lufs(buf) {
    const k = await render(buf, o => [biq(o, 'highshelf', 1500, null, 4), biq(o, 'highpass', 38, .5)]);
    const d = k.getChannelData(0), B = Math.round(SR * .4), H = Math.round(SR * .1), ms = [];
    for (let i = 0; i + B <= d.length; i += H) { let s = 0; for (let j = i; j < i + B; j++) s += d[j] * d[j]; ms.push(s / B); }
    const L = m => -0.691 + 10 * Math.log10(m || 1e-12);
    let g = ms.filter(m => L(m) > -70); if (!g.length) return null;
    const rel = L(g.reduce((a, b) => a + b, 0) / g.length) - 10;
    g = g.filter(m => L(m) > rel);
    return L(g.reduce((a, b) => a + b, 0) / g.length);
  }
  function wav(d) {
    const out = new DataView(new ArrayBuffer(44 + d.length * 2)), w = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); out.setUint32(4, 36 + d.length * 2, true); w(8, 'WAVE'); w(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true);
    out.setUint32(24, SR, true); out.setUint32(28, SR * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true); w(36, 'data'); out.setUint32(40, d.length * 2, true);
    for (let i = 0; i < d.length; i++) out.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i])) * 0x7fff, true);
    return out.buffer;
  }
  async function polish(mp3) {
    const C = OAC(); if (!C) throw new Error('no-offline-audio');
    const buf = await new C(1, SR, SR).decodeAudioData(mp3.slice(0));
    const mid = await render(buf, o => {
      const c = o.createDynamicsCompressor(); c.threshold.value = -20; c.ratio.value = 2.5; c.attack.value = .008; c.release.value = .12; c.knee.value = 4;
      const mk = o.createGain(); mk.gain.value = Math.pow(10, 2 / 20);
      return [biq(o, 'highpass', 85, .707), biq(o, 'peaking', 250, 1.2, -2.5), biq(o, 'peaking', 3200, 1.0, 2), c, mk];
    });
    const lu = await lufs(mid), gdb = lu == null || lu < -70 ? 0 : Math.max(-12, Math.min(18, -16 - lu)), g = Math.pow(10, gdb / 20);
    const d = mid.getChannelData(0), LIM = .8;
    for (let i = 0; i < d.length; i++) { const x = d[i] * g, a = Math.abs(x); d[i] = a <= .65 ? x : Math.sign(x) * (.65 + (LIM - .65) * Math.tanh((a - .65) / (LIM - .65))); }   // 0.65 위로는 부드럽게 0.8 에 닿는 리미터(polish.py 0.84 보다 조금 낮게: 실제 봉우리가 −1dB 아래로)
    return wav(d);
  }

  /* ───────── 만들기 · 이어 받기 · 보충 ───────── */
  let busy = false, stopReq = false;
  const listeners = new Set();
  const emit = () => listeners.forEach(f => { try { f(); } catch (e) { /* 무시 */ } });
  const langsFor = names => ['ko', 'en'].filter(l => setSlots(names, l).length);
  /* 동화별 진행: 받아야 할 줄(한·영) 중 받은 줄 */
  function progress(tales) {
    const c = cat(); if (!c) return [];
    return (tales || Object.keys(c.tales)).filter(t => c.tales[t]).map(t => {
      let total = 0, got = 0;
      langsFor(S.names).forEach(l => needed(t, l).forEach(x => { total++; if (S.got[keyOf(t, l, x.id)]) got++; }));
      return { tale: t, total, got, done: langsFor(S.names).every(l => S.done[t] && S.done[t][l]) };
    });
  }
  async function fetchLine(body, tries = 3) {
    let r = null;
    for (let i = 0; i < tries; i++) {
      r = await call('POST', '/name/line', body, { binary: true });
      if (r.ok || ![0, 502, 503].includes(r.status)) return r;
      await new Promise(z => setTimeout(z, 800 * (i + 1)));
    }
    return r;
  }
  /* 한 묶음(run)의 동화들을 받는다. 같은 줄을 두 번 받지 않는다(S.got). 두 줄씩 나란히 */
  async function work(run, tales) {
    if (busy) return { ok: false, error: 'busy_local' };
    busy = true; stopReq = false; S.err = ''; save(); emit();
    let error = '';
    try {
      const jobs = [];
      tales.forEach(t => langsFor(S.names).forEach(l => needed(t, l).forEach(x => { if (!S.got[keyOf(t, l, x.id)]) jobs.push({ t, l, x }); })));
      let i = 0;
      const one = async () => {
        while (!error && !stopReq && i < jobs.length) {
          const { t, l, x } = jobs[i++];
          const r = await fetchLine({ runId: run.runId, tale: t, id: x.id, lang: l, names: clean(S.names) });
          if (!r.ok) { if (!error) error = r.error || 'server_error'; break; }
          let bytes = r.bytes, ext = 'mp3', type = 'audio/mpeg';
          try { bytes = await polish(r.bytes); ext = 'wav'; type = 'audio/wav'; } catch (e) { bytes = r.bytes; }   // 다듬기 실패 → 받은 mp3 그대로
          try { await putFile(pathOf(t, l, x.id, ext), bytes, type); } catch (e) { if (!error) error = 'save_failed'; break; }
          S.got[keyOf(t, l, x.id)] = ext; save(); emit();
        }
      };
      await Promise.all([one(), one()]);
      tales.forEach(t => langsFor(S.names).forEach(l => { if (needed(t, l).every(x => S.got[keyOf(t, l, x.id)])) { S.done[t] = Object.assign({}, S.done[t], { [l]: true }); } }));
      if (!error && stopReq) error = 'stopped';
      if (!error) { S.run = S.run && S.run.runId === run.runId ? null : S.run; }
      S.err = error; save();
    } finally { busy = false; emit(); }
    if (!error) apply();
    return error ? { ok: false, error } : { ok: true };
  }
  /* 새 이름으로 만들기: 이용권 1회를 쓴다(서버). 이미 열린 묶음(activeRun)이 있으면 그것을 이어 쓴다 */
  async function start(names, activeRun) {
    names = clean(names);
    if (!Object.keys(names).length) return { ok: false, error: 'empty' };
    const ck = await check(names);
    if (!ck.ok) return { ok: false, error: ck.error, errors: ck.data && ck.data.errors };
    if (ck.data && ck.data.ok === false) return { ok: false, error: 'name_invalid', errors: ck.data.errors };
    const live = activeRun && activeRun.runId && (!activeRun.expiresAt || new Date(activeRun.expiresAt).getTime() > Date.now()) ? activeRun : null;
    let run = live;
    if (!run) {
      const r = await call('POST', '/name/run', {});
      if (!r.ok) return { ok: false, error: r.error };
      run = r.data;
    }
    const c = cat(), oldV = S.version;
    if (oldV && c && oldV !== c.version) dropVersion(oldV);
    S = Object.assign(blank(), { names, on: true, version: c ? c.version : '', run: { runId: run.runId, tales: run.tales, expiresAt: run.expiresAt } });
    save(); restore(); emit();
    return work(run, (run.tales || []).filter(t => c && c.tales[t]));
  }
  function resume() {
    if (!S.run || !S.run.runId) return Promise.resolve({ ok: false, error: 'run_invalid' });
    return work(S.run, (S.run.tales || []).filter(t => cat() && cat().tales[t])).then(r => {
      if (!r.ok && /run_invalid/.test(r.error)) { S.run = null; save(); emit(); }
      return r;
    });
  }
  /* 새 창작 동화 무료 보충: 이름을 이미 정했고(on) owned 이며, catalog 에 있지만 covered 에 없는 동화 */
  async function backfill(q) {
    if (!supported() || busy || !S.on || !q || !q.owned) return false;
    const c = cat(); if (!c || c.version !== S.version) return false;
    if (S.run && progress(S.run.tales).some(p => p.total && !p.done)) return false;   // 계정당 실행은 하나: 새 실행을 만들면 받던 실행이 끊기므로, 받던 것이 끝난 뒤에만
    const miss = Object.keys(c.tales).filter(t => !(q.covered || []).includes(t) && !(S.run && (S.run.tales || []).includes(t)));
    let any = false;
    for (const t of miss) {
      const r = await call('POST', '/name/run', { backfill: t });
      if (!r.ok) continue;
      S.run = { runId: r.data.runId, tales: r.data.tales || [t], expiresAt: r.data.expiresAt }; save();
      const w = await work(S.run, S.run.tales.filter(x => c.tales[x]));
      any = any || w.ok;
    }
    return any;
  }
  /* 미리 듣기: 그 자리 이름이 든 짧은 줄 하나를 서버에서 만들어 바로 들려준다(하루 10회) */
  function previewLine(slot, lang) {
    const c = cat(); if (!c) return null;
    let best = null;
    Object.keys(c.tales).forEach(t => (c.tales[t].lines || []).forEach(l => {
      const tp = lang === 'en' ? l.tplEn : l.tpl; if (!tp) return;
      const ss = slotsOf(l, lang); if (!ss.includes(slot)) return;
      const score = (ss.length - 1) * 100 + tp.length;
      if (!best || score < best.score) best = { tale: t, id: l.id, score };
    }));
    return best;
  }
  let prevUrl = null;
  async function preview(slot, names, lang = 'ko') {
    const p = previewLine(slot, lang); if (!p) return { ok: false, error: 'no_line' };
    const r = await call('POST', '/name/line', { preview: true, tale: p.tale, id: p.id, lang, names: clean(names) }, { binary: true });
    if (!r.ok) return r;
    if (prevUrl) URL.revokeObjectURL(prevUrl);
    prevUrl = URL.createObjectURL(new Blob([r.bytes], { type: 'audio/mpeg' }));
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); await AudioFX.playUrl(prevUrl); } catch (e) { return { ok: false, error: 'play_failed' }; }
    return { ok: true };
  }
  function setOriginal(on) { S.original = !!on; save(); apply(); emit(); }

  const ready = (async () => { try { return await apply(); } catch (e) { return 0; } })();
  return {
    SLOTS, supported, settings: () => JSON.parse(JSON.stringify(S)), catalog: cat, fetchCatalog, quota, check, preview, start, resume, backfill,
    progress, needed, setOriginal, apply, view, templatize, active, ready, busy: () => busy, stop: () => { stopReq = true; },
    onChange: f => { listeners.add(f); return () => listeners.delete(f); }, _polish: polish, _native: !!FS
  };
})();
if (typeof window !== 'undefined') window.Names = Names;
