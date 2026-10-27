/* 톡톡 동화극장 — 동화 이용권 (앱 모드에서만 잠긴다) · 정책: docs/MONETIZATION.md · 서버 규칙: docs/SYNC_API.md
   · 항상 무료 4편 + 창작 동화(origin 'original') 전부 + 매주 무료 4편(월요일 시작, 기기 날짜 기준 순환)
   · 기다무: 첫 실행 7일 뒤 1편, 14일 뒤 +1편을 골라 연다 (부모 확인은 홈 화면이 한다)
   · 종이별(Paper Star): 놀이로 동화를 끝까지 하면 하루 1개(앱 모드만), 5개를 모으면 1편을 골라 연다
   · 스티커: 놀이로 처음 끝까지 한 동화마다 1장(웹 공개판에서도 기기 안에 모은다). 읽어 주기·자동 재생 완주는 둘 다 주지 않는다(엔진이 finishPlay 를 부르지 않는다)
   · 캐릭터 스티커: 동화마다 세트(tales/stickers.js 의 STICKERS). 놀이로 끝까지 할 때마다 다음 그림 1장(첫 완주 포함, 하루 제한 없음). 세트를 다 모으면 더 주지 않는다
   · 전체 구매 4.99달러(한 번). 웹(공개 판)은 canPlay 가 언제나 true — 잠그지 않는다
   · 앱 모드 = window.Capacitor 가 있거나, 주소에 ?store=1 이 있거나, localStorage store_mode === '1'
   · 기록(state)은 기기 안에 두고, 서버가 있으면 무작위 계정으로 조용히 동기화한다. 서버가 없어도 모든 기능이 동작한다
   · 동화 페이지에 이 파일을 넣어 두면 잠긴 동화의 주소로 바로 들어와도 홈으로 돌려보낸다
   · 실제 결제: Entitlements.setBridge({ purchase(), restore() }) 가 Promise<boolean> 을 돌려주게 연결 */
const Entitlements = (() => {
  /* 서버 주소는 여기 한 곳. 빌드/시험에서 window.PAPERTALE_API_BASE 로 바꿀 수 있고, 비어 있으면 동기화를 끈다 */
  const API_BASE = (typeof window !== 'undefined' && window.PAPERTALE_API_BASE) || '';
  const PRODUCT_ID = 'com.papertale.theater.unlockall';

  const FREE_ALWAYS = ['rabbit', 'turnip', 'cinderella', 'patjuk'];
  const PER_WEEK = 4;
  const STAR_NEED = 5;                  // 종이별 5개 = 동화 1편
  const STICKER_MAX = 200;
  const CAST_MAX = 400;                 // 캐릭터 스티커 '<동화id>.<k>' 합집합 상한(31편 × 10 + 여유)
  const WAIT_AT = [7, 14];              // 첫 실행 며칠 뒤에 기다무 칸이 하나씩 열리는가
  const ID_RE = /^[a-z0-9_]{1,40}$/;
  const CAST_RE = /^[a-z0-9_]{1,40}\.[a-z0-9_]{1,40}$/;
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  let price = '$4.99';
  const OWNED_KEY = 'owned_all';        // 옛 구매 기록(호환): state.owned 와 함께 읽는다
  const K_ACCOUNT = 'sync_account', K_STATE = 'sync_state', K_DIRTY = 'sync_dirty', K_RECEIPT = 'sync_receipt';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장소 없이도 이번 실행에서는 동작 */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* 무시 */ } }
  };
  const readJson = k => { try { return JSON.parse(store.get(k)); } catch (e) { return null; } };

  const here = (() => { try { return document.currentScript.src.replace(/entitlements\.js[^/]*$/, ''); } catch (e) { return ''; } })();

  function appMode() {
    try {
      if (window.Capacitor) return true;
      if (/[?&]store=0(&|$)/.test(location.search)) { store.set('store_mode', '0'); return false; }
      if (/[?&]store=1(&|$)/.test(location.search)) { store.set('store_mode', '1'); return true; }
      return store.get('store_mode') === '1';
    } catch (e) { return false; }
  }

  /* ───────── 날짜 ───────── */
  const two = n => String(n).padStart(2, '0');
  /* 기기 날짜 YYYY-MM-DD */
  const dateStr = (d = new Date()) => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
  const dayNumber = s => { const [y, m, dd] = s.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, dd) / 86400000); };

  /* 월요일 시작 주 번호 (기기의 날짜 그대로. 2024-01-01 = 월요일 = 0주차) */
  function weekNumber(d = new Date()) {
    const days = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000;
    return Math.floor((days - Date.UTC(2024, 0, 1) / 86400000) / 7);
  }

  /* ───────── 기록(state): 합칠 때 충돌이 없는 모양 (docs/SYNC_API.md 와 같다) ───────── */
  const idList = (a, max) => {
    const out = [];
    for (const v of Array.isArray(a) ? a : []) if (typeof v === 'string' && ID_RE.test(v) && !out.includes(v)) out.push(v);
    return out.slice(0, max);
  };
  const castList = (a, max = CAST_MAX) => {
    const out = [];
    for (const v of Array.isArray(a) ? a : []) if (typeof v === 'string' && CAST_RE.test(v) && !out.includes(v)) out.push(v);
    return out.slice(0, max);
  };
  /* 들어온 값을 규칙에 맞게 다듬는다 (모양이 깨진 저장값·서버 값도 안전하게) */
  function normalize(s) {
    s = s && typeof s === 'object' ? s : {};
    const earned = {};
    if (s.earned && typeof s.earned === 'object') {
      for (const k of Object.keys(s.earned).sort()) if (DATE_RE.test(k) && ID_RE.test(String(s.earned[k]))) earned[k] = s.earned[k];
    }
    return {
      firstRun: DATE_RE.test(s.firstRun) ? s.firstRun : '',
      earned,
      starUnlocked: idList(s.starUnlocked, 100),
      stickers: idList(s.stickers, STICKER_MAX),
      cast: castList(s.cast),
      waitUnlocked: idList(s.waitUnlocked, 2),
      owned: s.owned === true
    };
  }
  /* 상한을 넘으면 사전순 앞에서 자른다(합치는 순서와 상관없이 같은 결과) */
  const capSorted = (arr, max) => (arr.length > max ? [...arr].sort().slice(0, max) : arr);
  /* 합치기: firstRun 더 이른 날짜 · earned 날짜별 합집합(같은 날 충돌은 id 사전순 앞) · 열린 목록 합집합(waitUnlocked 는 앞 2개) · owned 한번 true 면 계속 */
  function merge(a, b) {
    a = normalize(a); b = normalize(b);
    const earned = {};
    for (const k of new Set([...Object.keys(a.earned), ...Object.keys(b.earned)])) {
      const x = a.earned[k], y = b.earned[k];
      earned[k] = x && y ? (x <= y ? x : y) : (x || y);
    }
    const union = (p, q, max) => idList([...p, ...q], max);
    return normalize({
      firstRun: a.firstRun && b.firstRun ? (a.firstRun <= b.firstRun ? a.firstRun : b.firstRun) : (a.firstRun || b.firstRun),
      earned,
      starUnlocked: union(a.starUnlocked, b.starUnlocked, 100),
      stickers: capSorted(idList([...a.stickers, ...b.stickers], 100000), STICKER_MAX),
      cast: capSorted(castList([...a.cast, ...b.cast], 100000), CAST_MAX),
      waitUnlocked: union(a.waitUnlocked, b.waitUnlocked, 2),
      owned: a.owned || b.owned
    });
  }
  const balanceOf = s => Object.keys(s.earned).length - STAR_NEED * s.starUnlocked.length;

  let st = null;                            // 메모리 속 state
  const listeners = new Set();
  const notify = () => listeners.forEach(f => { try { f(); } catch (e) { /* 듣는 쪽 오류는 무시 */ } });
  function load() {
    if (st) return st;
    const raw = readJson(K_STATE);
    st = normalize(raw);
    let changed = false;
    /* 옛 이름(개발 기기 기록)을 한 번 옮긴다. 예전 이름이 검색에 걸리지 않게 이어 붙여 쓴다 */
    const oldList = raw && raw['cloud' + 'Unlocked'];
    if (Array.isArray(oldList)) { st.starUnlocked = idList([...st.starUnlocked, ...oldList], 100); changed = true; }
    if (!st.firstRun) { st.firstRun = dateStr(); changed = true; }          // 첫 실행 날짜
    if (store.get(OWNED_KEY) === '1' && !st.owned) { st.owned = true; changed = true; }
    if (changed) save(true);
    return st;
  }
  /* 바뀐 것을 저장하고, 서버가 있으면 곧 올린다 */
  function save(dirty = true) {
    store.set(K_STATE, JSON.stringify(st));
    if (dirty) { store.set(K_DIRTY, '1'); scheduleSync(); }
  }
  /* 시험·서버 응답용: 받은 state 를 지금 것과 합쳐 저장 */
  function adopt(remote) {
    const before = JSON.stringify(load());
    st = merge(st, remote);
    if (st.owned) store.set(OWNED_KEY, '1');
    const changed = JSON.stringify(st) !== before;
    store.set(K_STATE, JSON.stringify(st));
    if (changed) notify();
    return changed;
  }

  /* ───────── 무료·잠금 계산 ───────── */
  const listed = id => typeof TALES !== 'undefined' ? TALES.find(t => t.id === id) : null;
  const isOriginal = id => { const t = listed(id); return !!t && t.origin === 'original'; };
  /* 항상 무료 = 고정 4편 + 창작 동화 (로테이션·잠금에서 빠진다) */
  const isFree = id => FREE_ALWAYS.includes(id) || isOriginal(id);

  /* 로테이션 후보 = 공개된(ready) 동화 중 항상 무료·창작이 아닌 것, 카탈로그 순서 */
  function pool() {
    if (typeof TALES === 'undefined') return [];
    return TALES.filter(t => t.ready && !isFree(t.id)).map(t => t.id);
  }

  function freeThisWeek(d) {
    const p = pool(), n = p.length;
    if (!n) return [];
    const w = weekNumber(d), out = [];
    for (let k = 0; k < Math.min(PER_WEEK, n); k++) out.push(p[(((w * PER_WEEK + k) % n) + n) % n]);
    return out;
  }

  const owned = () => load().owned || store.get(OWNED_KEY) === '1';
  const isUnlocked = id => load().starUnlocked.includes(id) || load().waitUnlocked.includes(id);

  /* 'free' 항상 무료 · 'owned' 구매함 · 'unlocked' 종이별·기다무로 엶 · 'week' 이번 주 무료 · 'locked' 잠김 */
  function status(id, d) {
    if (!appMode()) return 'free';
    if (isFree(id)) return 'free';
    if (owned()) return 'owned';
    if (isUnlocked(id)) return 'unlocked';
    return freeThisWeek(d).includes(id) ? 'week' : 'locked';
  }
  const canPlay = (id, d) => status(id, d) !== 'locked' && !(appMode() && listed(id) && !listed(id).ready);

  /* 지금 잠겨 있어서 골라 열 수 있는 동화 (공개됨 · 항상 무료·창작 아님 · 이번 주 무료·이미 연 것 아님) */
  function lockedChoices(d) {
    const week = freeThisWeek(d);
    return pool().filter(id => !isUnlocked(id) && !week.includes(id));
  }

  /* ───────── 종이별 · 스티커 ───────── */
  /* 놀이로 끝까지 한 동화 하나에 종이별 1개. 하루 1개: 오늘 이미 받았으면 false. 앱 모드에서만 모은다 */
  function earnStar(taleId, d) {
    if (!appMode() || !ID_RE.test(String(taleId))) return false;
    const s = load(), day = dateStr(d);
    if (s.earned[day]) return false;
    s.earned[day] = taleId;
    s.earned = normalize(s).earned;
    save(true);
    notify();
    return true;
  }
  /* 스티커: 그 동화를 처음 끝까지 했으면 true. 웹 공개판에서도 기기 안에 모은다 */
  function addSticker(taleId) {
    if (!ID_RE.test(String(taleId))) return false;
    const s = load();
    if (s.stickers.includes(taleId) || s.stickers.length >= STICKER_MAX) return false;
    s.stickers.push(taleId);
    save(true);
    notify();
    return true;
  }
  /* ───────── 캐릭터 스티커 세트 ─────────
     STICKERS[동화id] = [{ k, img, ko, en } …] (tales/stickers.js). img 가 없는 칸(그림 준비 중)은 받을 수 없다 */
  const castOf = id => {
    try { const a = typeof STICKERS !== 'undefined' && STICKERS && STICKERS[id]; return Array.isArray(a) ? a.filter(c => c && c.img && CAST_RE.test(id + '.' + c.k)) : []; } catch (e) { return []; }
  };
  const hasCast = (id, k) => load().cast.includes(id + '.' + k);
  const castCount = id => castOf(id).filter(c => hasCast(id, c.k)).length;
  /* 다음 캐릭터 스티커 한 장을 준다: 받은 k 를 돌려주고, 세트가 없거나 다 모았으면 null */
  function addCast(taleId) {
    if (!ID_RE.test(String(taleId))) return null;
    const c = castOf(taleId).find(x => !hasCast(taleId, x.k));
    const s = load();
    if (!c || s.cast.length >= CAST_MAX) return null;
    s.cast.push(taleId + '.' + c.k);
    save(true);
    notify();
    return c.k;
  }
  /* 놀이 완주 한 번에 주는 보상을 묶어서: 엔진은 놀이로 끝까지 했을 때만 부른다 */
  function finishPlay(taleId, d) {
    return { sticker: addSticker(taleId), star: earnStar(taleId, d), cast: addCast(taleId) };
  }
  const starBalance = () => Math.max(0, balanceOf(load()));
  const earnedToday = d => !!load().earned[dateStr(d)];
  function starUnlock(id) {
    const s = load();
    if (balanceOf(s) < STAR_NEED || !lockedChoices().includes(id)) return false;
    s.starUnlocked.push(id);
    save(true); notify();
    return true;
  }

  /* ───────── 기다무 ───────── */
  /* 첫 실행으로부터 지난 날 수 */
  const daysSinceFirstRun = d => Math.max(0, dayNumber(dateStr(d)) - dayNumber(load().firstRun));
  /* 지금 고를 수 있는 기다무 칸 수 (7일 뒤 1, 14일 뒤 +1 에서 이미 쓴 것을 뺀다) */
  function waitAvailable(d) {
    const days = daysSinceFirstRun(d);
    return Math.max(0, WAIT_AT.filter(n => days >= n).length - load().waitUnlocked.length);
  }
  /* 다음 칸이 열리기까지 남은 날 수 (모두 열렸으면 0) */
  function waitDaysLeft(d) {
    const s = load(), next = WAIT_AT[s.waitUnlocked.length + waitAvailable(d)];
    return next === undefined ? 0 : Math.max(0, next - daysSinceFirstRun(d));
  }
  function waitUnlock(id, d) {
    if (waitAvailable(d) < 1 || !lockedChoices(d).includes(id)) return false;
    load().waitUnlocked.push(id);
    save(true); notify();
    return true;
  }

  /* ───────── 결제 ───────── */
  let bridge = null;
  function setBridge(b) { bridge = b; }
  function markOwned() { load().owned = true; store.set(OWNED_KEY, '1'); save(true); notify(); }
  async function purchase() {
    if (bridge && bridge.purchase) { if (await bridge.purchase()) { markOwned(); return true; } return false; }
    if (window.Capacitor) return false;           // 앱인데 결제 연결이 없으면 열어 주지 않는다
    markOwned(); return true;                     // 웹 미리보기(?store=1) 모의 결제
  }
  async function restore() {
    if (bridge && bridge.restore) { if (await bridge.restore()) { markOwned(); return true; } return false; }
    if (window.Capacitor) return false;
    return owned();
  }

  /* ───────── 서버 동기화 (없어도 앱은 그대로 동작) ───────── */
  const enabled = () => !!API_BASE && appMode();
  async function call(method, path, body, auth) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const tm = ctl && setTimeout(() => ctl.abort(), 10000);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (auth) headers.Authorization = 'Bearer ' + auth.accountId + '.' + auth.token;
      const r = await fetch(API_BASE + '/v1' + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: ctl ? ctl.signal : undefined });
      let j = null; try { j = await r.json(); } catch (e) { /* 본문 없음 */ }
      if (r.ok) return { ok: true, status: r.status, data: j || {} };
      return { ok: false, status: r.status, error: (j && j.error) || 'server_error' };
    } catch (e) { return { ok: false, status: 0, error: 'offline' }; }
    finally { if (tm) clearTimeout(tm); }
  }
  const account = () => { const a = readJson(K_ACCOUNT); return a && a.accountId && a.token ? a : null; };

  /* 계정이 없으면 만든다 (첫 실행). 실패하면 null — 오프라인으로 계속 */
  let making = null;
  function ensureAccount() {
    const a = account();
    if (a) return Promise.resolve(a);
    if (!enabled()) return Promise.resolve(null);
    if (!making) making = (async () => {
      const r = await call('POST', '/account', {});
      if (r.ok && r.data.accountId && r.data.token) {
        const acc = { accountId: r.data.accountId, token: r.data.token };
        store.set(K_ACCOUNT, JSON.stringify(acc));
        if (r.data.state) adopt(r.data.state);
        return acc;
      }
      return null;
    })().finally(() => { making = null; });
    return making;
  }

  let syncTimer = 0, retryMs = 0, syncing = false;
  /* 5초 모아서(디바운스) 올린다. 실패하면 30초부터 두 배씩(최대 10분) 조용히 다시 */
  function scheduleSync(ms = 5000) {
    if (!enabled()) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { sync(); }, ms);
  }
  async function sync() {
    if (!enabled() || syncing) return false;
    syncing = true;
    try {
      let acc = await ensureAccount();
      if (!acc) throw new Error('offline');
      await flushReceipts(acc);
      let r = await call('PUT', '/state', { state: load() }, acc);
      if (!r.ok && r.status === 401) {                       // 계정을 못 알아보면 새로 만들어 이어 간다
        store.del(K_ACCOUNT); acc = await ensureAccount();
        if (!acc) throw new Error('offline');
        r = await call('PUT', '/state', { state: load() }, acc);
      }
      if (!r.ok) throw new Error(r.error);
      adopt(r.data.state);
      store.del(K_DIRTY); retryMs = 0;
      return true;
    } catch (e) {
      retryMs = Math.min(retryMs ? retryMs * 2 : 30000, 600000);
      scheduleSync(retryMs);
      return false;
    } finally { syncing = false; }
  }

  /* 연결 코드 만들기 (부모 확인은 화면 쪽) → { ok, code, expiresAt } 또는 { ok:false, error } */
  async function createLinkCode() {
    if (!enabled()) return { ok: false, error: 'offline' };
    const acc = await ensureAccount();
    if (!acc) return { ok: false, error: 'offline' };
    const r = await call('POST', '/link/create', {}, acc);
    return r.ok ? { ok: true, code: r.data.code, expiresAt: r.data.expiresAt } : { ok: false, error: r.error };
  }
  const CODE_RE = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/;
  const cleanCode = s => String(s || '').toUpperCase().replace(/[\s-]/g, '');
  /* 다른 기기의 코드를 넣어 같은 기록으로 묶는다 */
  async function redeemLinkCode(raw) {
    const code = cleanCode(raw);
    if (!CODE_RE.test(code)) return { ok: false, error: 'bad_request' };
    if (!enabled()) return { ok: false, error: 'offline' };
    const acc = await ensureAccount();
    if (!acc) return { ok: false, error: 'offline' };
    const r = await call('POST', '/link/redeem', { code }, acc);
    if (!r.ok) return { ok: false, error: r.error };
    store.set(K_ACCOUNT, JSON.stringify({ accountId: r.data.accountId, token: r.data.token }));
    adopt(r.data.state);
    store.set(K_DIRTY, '1');
    scheduleSync(1000);
    return { ok: true };
  }

  /* 영수증: 네이티브 플러그인이 준 signedTransaction(애플) · purchaseToken(구글)을 서버로. 못 보내면 보관했다가 다음 동기화 때 */
  const pendingReceipts = () => { const a = readJson(K_RECEIPT); return Array.isArray(a) ? a : []; };
  async function postReceipt(acc, rc) {
    const r = rc.kind === 'apple'
      ? await call('POST', '/receipt/apple', { signedTransaction: rc.signedTransaction }, acc)
      : await call('POST', '/receipt/google', { purchaseToken: rc.purchaseToken, productId: rc.productId || PRODUCT_ID }, acc);
    if (r.ok) { if (r.data.state) adopt(r.data.state); if (r.data.owned) markOwnedQuiet(); }
    return r;
  }
  function markOwnedQuiet() { if (!load().owned) { load().owned = true; store.set(K_STATE, JSON.stringify(st)); notify(); } store.set(OWNED_KEY, '1'); }
  async function flushReceipts(acc) {
    const rest = [];
    for (const rc of pendingReceipts()) {
      const r = await postReceipt(acc, rc);
      if (!r.ok && r.error !== 'receipt_invalid') rest.push(rc);   // 잘못된 영수증은 버리고, 네트워크 문제는 다시
    }
    if (rest.length) store.set(K_RECEIPT, JSON.stringify(rest)); else store.del(K_RECEIPT);
  }
  async function sendReceipt(rc) {
    if (!rc || !(rc.signedTransaction || rc.purchaseToken)) return false;
    rc = rc.signedTransaction ? { kind: 'apple', signedTransaction: rc.signedTransaction } : { kind: 'google', purchaseToken: rc.purchaseToken, productId: rc.productId };
    const acc = enabled() ? await ensureAccount() : null;
    const r = acc ? await postReceipt(acc, rc) : { ok: false, error: 'offline' };
    if (!r.ok && r.error !== 'receipt_invalid') { store.set(K_RECEIPT, JSON.stringify([...pendingReceipts(), rc])); scheduleSync(30000); }
    return r.ok;
  }

  /* 실제 앱(Capacitor)이면 네이티브 StoreKit 플러그인(Store)에 연결: 스토어 거래 기록이 구매 여부의 기준 */
  const nativeStore = typeof window !== 'undefined' && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Store;
  if (nativeStore) {
    const viaStore = async r => { if (r && r.owned) { sendReceipt(r); return true; } return false; };
    bridge = {
      purchase: async () => viaStore(await nativeStore.purchase()),
      restore: async () => viaStore(await nativeStore.restore())
    };
    nativeStore.getPrice().then(r => { if (r && r.price) price = r.price; }).catch(() => {});
    nativeStore.isOwned().then(r => { if (r && r.owned) { markOwnedQuiet(); sendReceipt(r); } }).catch(() => {});
    nativeStore.addListener('ownedChanged', r => { if (r && r.owned) { markOwnedQuiet(); sendReceipt(r); } });
  }
  function grantAll() { markOwned(); }
  function revokeAll() { store.del(OWNED_KEY); load().owned = false; save(false); }

  /* 동화 페이지 직접 진입 막기 */
  function guard() {
    if (!appMode()) return;
    const m = location.pathname.match(/\/tales\/([^/]+)\//);
    if (!m) return;
    if (!canPlay(m[1])) location.replace(here + 'index.html' + (listed(m[1]) && listed(m[1]).ready ? '?locked=' + encodeURIComponent(m[1]) : ''));
  }

  /* 시험용: 메모리 기록을 갈아 끼운다 */
  function _reset(s) { st = s === undefined ? null : normalize(s); }

  const api = {
    FREE_ALWAYS, PER_WEEK, STAR_NEED, STICKER_MAX, get PRICE() { return price; }, API_BASE, PRODUCT_ID,
    appMode, weekNumber, dateStr, freeThisWeek, status, canPlay, isFree, lockedChoices,
    purchase, restore, grantAll, revokeAll, setBridge, guard,
    state: () => load(), merge, normalize, balanceOf,
    earnStar, addSticker, finishPlay, addCast, hasCast, castCount, castOf, hasSticker: id => load().stickers.includes(id), stickerCount: () => load().stickers.length, starBalance, earnedToday, starUnlock,
    waitAvailable, waitDaysLeft, waitUnlock, daysSinceFirstRun,
    syncEnabled: enabled, sync, createLinkCode, redeemLinkCode, sendReceipt, cleanCode,
    isLinked: () => !!account(),
    onChange: f => { listeners.add(f); return () => listeners.delete(f); },
    _reset
  };

  /* 앱이 켜지면 한 번 맞춘다. 인터넷이 돌아오면 다시 */
  if (typeof window !== 'undefined' && window.addEventListener && enabled()) {
    load(); scheduleSync(1500);
    window.addEventListener('online', () => scheduleSync(1000));
  }

  if (typeof document !== 'undefined' && document.currentScript && /\/tales\/[^/]+\//.test(location.pathname) && appMode()) {
    // 동화 페이지: 카탈로그를 먼저 읽은 뒤(동기) 확인한다
    if (typeof TALES === 'undefined') document.write('<script src="' + here + 'tales/catalog.js"><\/script><script>Entitlements.guard()<\/script>');
    else guard();
  }
  return api;
})();
