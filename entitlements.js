/* 종이 동화극장 — 동화 이용권 (앱 모드에서만 잠긴다)
   · 항상 무료 6편 + 매주 무료 2편(월요일 시작, 기기 날짜 기준 순환) + 전부 구매(2.99달러 출시가, 한 번)
   · 앱 모드 = window.Capacitor 가 있거나, 주소에 ?store=1 이 있거나, localStorage store_mode === '1'
   · 앱 모드가 아니면(공개 웹) canPlay 는 언제나 true — 웹은 잠그지 않는다
   · 동화 페이지에 이 파일을 넣어 두면 잠긴 동화의 주소로 바로 들어와도 홈으로 돌려보낸다
   · 실제 결제: Entitlements.setBridge({ purchase(), restore() }) 가 Promise<boolean> 을 돌려주게 연결 */
const Entitlements = (() => {
  const FREE_ALWAYS = ['rabbit', 'lion_mouse', 'patjuk', 'sunmoon', 'turnip', 'goldilocks'];
  const PER_WEEK = 2;
  const PRICE = '$2.99';
  const OWNED_KEY = 'owned_all';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 저장소 없이도 이번 실행에서는 동작 */ } }
  };

  const here = (() => { try { return document.currentScript.src.replace(/entitlements\.js[^/]*$/, ''); } catch (e) { return ''; } })();

  function appMode() {
    try {
      if (window.Capacitor) return true;
      if (/[?&]store=1(&|$)/.test(location.search)) { store.set('store_mode', '1'); return true; }
      return store.get('store_mode') === '1';
    } catch (e) { return false; }
  }

  /* 월요일 시작 주 번호 (기기의 날짜 그대로. 2024-01-01 = 월요일 = 0주차) */
  function weekNumber(d = new Date()) {
    const days = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000;
    return Math.floor((days - Date.UTC(2024, 0, 1) / 86400000) / 7);
  }

  /* 매주 무료 후보 = 공개된(ready) 동화 중 항상 무료가 아닌 것, 카탈로그 순서 */
  function pool() {
    if (typeof TALES === 'undefined') return [];
    return TALES.filter(t => t.ready && !FREE_ALWAYS.includes(t.id)).map(t => t.id);
  }

  function freeThisWeek(d) {
    const p = pool(), n = p.length;
    if (!n) return [];
    const w = weekNumber(d), out = [];
    for (let k = 0; k < Math.min(PER_WEEK, n); k++) out.push(p[(((w * PER_WEEK + k) % n) + n) % n]);
    return out;
  }

  const owned = () => store.get(OWNED_KEY) === '1';
  const isFree = id => FREE_ALWAYS.includes(id);

  /* 'free' 항상 무료 · 'week' 이번 주 무료 · 'owned' 구매함 · 'locked' 잠김 */
  function status(id, d) {
    if (!appMode()) return 'free';
    if (isFree(id)) return 'free';
    if (owned()) return 'owned';
    return freeThisWeek(d).includes(id) ? 'week' : 'locked';
  }
  const listed = id => typeof TALES !== 'undefined' ? TALES.find(t => t.id === id) : null;
  const canPlay = (id, d) => status(id, d) !== 'locked' && !(appMode() && listed(id) && !listed(id).ready);

  let bridge = null;
  function setBridge(b) { bridge = b; }
  async function purchase() {
    if (bridge && bridge.purchase) { if (await bridge.purchase()) { store.set(OWNED_KEY, '1'); return true; } return false; }
    if (window.Capacitor) return false;           // 앱인데 결제 연결이 없으면 열어 주지 않는다
    store.set(OWNED_KEY, '1'); return true;       // 웹 미리보기(?store=1) 모의 결제
  }
  async function restore() {
    if (bridge && bridge.restore) { if (await bridge.restore()) { store.set(OWNED_KEY, '1'); return true; } return false; }
    if (window.Capacitor) return false;
    return owned();
  }
  function grantAll() { store.set(OWNED_KEY, '1'); }
  function revokeAll() { try { localStorage.removeItem(OWNED_KEY); } catch (e) { /* 무시 */ } }

  /* 동화 페이지 직접 진입 막기 */
  function guard() {
    if (!appMode()) return;
    const m = location.pathname.match(/\/tales\/([^/]+)\//);
    if (!m) return;
    if (!canPlay(m[1])) location.replace(here + 'index.html' + (listed(m[1]) && listed(m[1]).ready ? '?locked=' + encodeURIComponent(m[1]) : ''));
  }

  const api = { FREE_ALWAYS, PRICE, appMode, weekNumber, freeThisWeek, status, canPlay, purchase, restore, grantAll, revokeAll, setBridge, guard };

  if (document.currentScript && /\/tales\/[^/]+\//.test(location.pathname) && appMode()) {
    // 동화 페이지: 카탈로그를 먼저 읽은 뒤(동기) 확인한다
    if (typeof TALES === 'undefined') document.write('<script src="' + here + 'tales/catalog.js"><\/script><script>Entitlements.guard()<\/script>');
    else guard();
  }
  return api;
})();
