// entitlements.js 순수 로직 시험: node tools/app/test_entitlements.mjs
import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert'; // deepEqual 은 다른 맥락(vm)의 객체 원형 차이를 무시한다

const root = new URL('../../', import.meta.url);
const src = fs.readFileSync(new URL('entitlements.js', root), 'utf8');
const catalogSrc = fs.readFileSync(new URL('tales/catalog.js', root), 'utf8');

/* 새 기기(빈 저장소)를 흉내 낸 맥락 하나 */
function boot({ ready = null, apiBase = '', fetchImpl = null, mem = {} } = {}) {
  const ls = { ...mem };
  const ctx = {
    localStorage: { getItem: k => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: k => { delete ls[k]; } },
    location: { search: '?store=1', pathname: '/index.html' },
    document: {}, setTimeout, clearTimeout, console, fetch: fetchImpl || (async () => { throw new Error('no network'); })
  };
  ctx.window = ctx; ctx.window.PAPERTALE_API_BASE = apiBase;
  vm.createContext(ctx);
  vm.runInContext(catalogSrc.replace(/^const TALES\b/m, 'var TALES') + '\n;', ctx);
  if (ready) vm.runInContext(`TALES.forEach(t => { t.ready = ${JSON.stringify(ready)}.includes(t.id); })`, ctx);
  vm.runInContext(src, ctx);
  return { E: vm.runInContext('Entitlements', ctx), ls, ctx };
}
const READY = ['rabbit', 'turnip', 'cinderella', 'patjuk', 'frog', 'sunmoon', 'sun_wind', 'lion_mouse', 'fox_crane', 'goldilocks', 'bremen', 'hansel', 'heungbu', 'kkultteok', 'red_car'];
const D = (y, m, d) => new Date(y, m - 1, d, 12);
let n = 0; const ok = (name, f) => { f(); n++; console.log('  통과  ' + name); };
const okA = async (name, f) => { await f(); n++; console.log('  통과  ' + name); };

ok('항상 무료 4편 · 창작 동화는 잠기지 않는다', () => {
  const { E } = boot({ ready: READY });
  for (const id of ['rabbit', 'turnip', 'cinderella', 'patjuk']) assert.strictEqual(E.status(id), 'free');
  assert.strictEqual(E.status('kkultteok'), 'free'); assert.strictEqual(E.status('red_car'), 'free');
  assert.strictEqual(E.isFree('unicorn'), true);
});

ok('주간 로테이션: 4편, 월요일에 바뀌고 같은 주엔 같다, 항상 무료·창작은 안 뽑힘', () => {
  const { E } = boot({ ready: READY });
  const mon = E.freeThisWeek(D(2026, 10, 26)), sun = E.freeThisWeek(D(2026, 11, 1)), nextMon = E.freeThisWeek(D(2026, 11, 2));
  assert.strictEqual(mon.length, 4); assert.deepEqual(mon, sun); assert.notDeepStrictEqual(mon, nextMon);
  assert.strictEqual(new Set(mon).size, 4);
  for (const id of mon.concat(nextMon)) { assert.ok(!E.isFree(id)); }
  assert.strictEqual(E.weekNumber(D(2024, 1, 1)), 0); assert.strictEqual(E.weekNumber(D(2024, 1, 7)), 0); assert.strictEqual(E.weekNumber(D(2024, 1, 8)), 1);
  // 잠긴 동화 = 후보 중 이번 주 무료가 아닌 것
  const week = E.freeThisWeek(); const lc = E.lockedChoices();
  assert.ok(lc.every(id => !week.includes(id)));
  assert.strictEqual(E.status(week[0]), 'week');
  assert.strictEqual(E.status(lc[0]), 'locked'); assert.strictEqual(E.canPlay(lc[0]), false);
});

ok('웹(앱 모드 아님)은 전부 열린다', () => {
  const { E, ctx } = boot({ ready: READY });
  ctx.location.search = '?store=0';
  assert.strictEqual(E.appMode(), false); assert.strictEqual(E.status('bremen'), 'free'); assert.strictEqual(E.canPlay('bremen'), true);
});

ok('합치기: firstRun 더 이른 쪽 · earned 날짜 합집합 · 같은 날 충돌은 id 사전순 · 열린 목록 합집합 · owned 유지', () => {
  const { E } = boot();
  const a = { firstRun: '2026-10-20', earned: { '2026-10-20': 'rabbit', '2026-10-21': 'turnip' }, starUnlocked: ['bremen'], stickers: ['rabbit', 'frog'], waitUnlocked: ['hansel'], owned: false };
  const b = { firstRun: '2026-10-18', earned: { '2026-10-21': 'patjuk', '2026-10-22': 'frog' }, starUnlocked: ['bremen', 'heungbu'], stickers: ['frog', 'patjuk'], waitUnlocked: ['sunmoon', 'hansel', 'frog'], owned: true };
  const m = E.merge(a, b);
  assert.strictEqual(m.firstRun, '2026-10-18');
  assert.deepEqual(m.earned, { '2026-10-20': 'rabbit', '2026-10-21': 'patjuk', '2026-10-22': 'frog' });
  assert.deepEqual(m.starUnlocked, ['bremen', 'heungbu']);
  assert.deepEqual(m.stickers, ['rabbit', 'frog', 'patjuk']);
  assert.deepEqual(m.waitUnlocked, ['hansel', 'sunmoon']);       // 합집합 뒤 앞 2개
  assert.strictEqual(m.owned, true);
  // 교환·멱등: 집합 필드는 순서와 상관없이 같다
  const r = E.merge(b, a);
  assert.strictEqual(r.firstRun, m.firstRun); assert.deepEqual(r.earned, m.earned); assert.strictEqual(r.owned, true);
  assert.deepEqual([...r.starUnlocked].sort(), [...m.starUnlocked].sort());
  assert.deepEqual(E.merge(m, m), m);
  // 잘못된 값은 버린다
  const bad = E.normalize({ firstRun: 'x', earned: { 'zz': 'rabbit', '2026-01-01': 'BAD ID' }, starUnlocked: ['ok_id', 'No!'], waitUnlocked: 'x', owned: 'yes' });
  assert.deepEqual(bad, { firstRun: '', earned: {}, starUnlocked: ['ok_id'], stickers: [], cast: [], waitUnlocked: [], owned: false });
});

ok('종이별: 하루 1개, 잔액 = 모은 날 수 - 5 × 연 동화 수, 5개로 1편', () => {
  const { E } = boot({ ready: READY });
  assert.strictEqual(E.earnStar('rabbit', D(2026, 10, 1)), true);
  assert.strictEqual(E.earnStar('turnip', D(2026, 10, 1)), false);        // 같은 날 두 번째는 없다
  assert.strictEqual(E.starBalance(), 1);
  for (let d = 2; d <= 5; d++) assert.strictEqual(E.earnStar('patjuk', D(2026, 10, d)), true);
  assert.strictEqual(E.starBalance(), 5); assert.strictEqual(E.balanceOf(E.state()), 5);
  const pick = E.lockedChoices()[0];
  assert.strictEqual(E.starUnlock('rabbit'), false);                      // 항상 무료는 못 고른다
  assert.strictEqual(E.starUnlock(pick), true);
  assert.strictEqual(E.starBalance(), 0); assert.strictEqual(E.balanceOf(E.state()), 0);
  assert.strictEqual(E.status(pick), 'unlocked'); assert.strictEqual(E.canPlay(pick), true);
  assert.strictEqual(E.starUnlock(E.lockedChoices()[0]), false);          // 잔액 부족
  assert.strictEqual(E.earnStar('Bad Id!', D(2026, 10, 9)), false);
});

ok('스티커: 처음 한 번만, 웹에서도 쌓이고 종이별은 앱 모드만, finishPlay 는 둘을 묶어 돌려준다', () => {
  const { E, ctx } = boot({ ready: READY });
  assert.deepEqual(E.finishPlay('rabbit', D(2026, 10, 1)), { sticker: true, star: true, cast: null });
  assert.deepEqual(E.finishPlay('rabbit', D(2026, 10, 2)), { sticker: false, star: true, cast: null });   // 같은 동화는 스티커 한 번
  assert.deepEqual(E.finishPlay('turnip', D(2026, 10, 2)), { sticker: true, star: false, cast: null });   // 오늘 별은 이미 받음
  assert.deepEqual(E.state().stickers, ['rabbit', 'turnip']);
  assert.strictEqual(E.addSticker('Bad Id!'), false);
  assert.strictEqual(E.hasSticker('turnip'), true); assert.strictEqual(E.stickerCount(), 2);
  ctx.location.search = '?store=0';                                                         // 웹 공개판
  assert.deepEqual(E.finishPlay('patjuk', D(2026, 10, 3)), { sticker: true, star: false, cast: null });
  assert.strictEqual(E.stickerCount(), 3);
  // 상한 200
  const { E: F } = boot({ mem: { sync_state: JSON.stringify({ stickers: Array.from({ length: 200 }, (_, i) => 't' + i) }) } });
  assert.strictEqual(F.stickerCount(), 200); assert.strictEqual(F.addSticker('extra'), false);
});

ok('캐릭터 스티커: 완주마다 다음 한 장, 그림 없는 칸은 건너뜀, 다 모으면 null, STICKERS 없으면 null, 합치기·상한', () => {
  const set = { rabbit: [{ k: 'a', img: 'x/a.webp' }, { k: 'b', img: null, plan: true }, { k: 'c', img: 'x/c.webp' }], turnip: [{ k: 'z', img: 'x/z.webp' }] };
  const { E, ctx } = boot({ ready: READY });
  assert.strictEqual(E.finishPlay('rabbit', D(2026, 10, 1)).cast, null);                    // STICKERS 없음
  const { E: F, ctx: c2 } = boot({ ready: READY });
  vm.runInContext('var STICKERS = ' + JSON.stringify(set), c2);
  assert.deepEqual(F.finishPlay('rabbit', D(2026, 10, 1)), { sticker: true, star: true, cast: 'a' });   // 첫 완주도 한 장
  assert.deepEqual(F.finishPlay('rabbit', D(2026, 10, 1)), { sticker: false, star: false, cast: 'c' }); // 하루 제한 없음, 준비 중 칸 건너뜀
  assert.strictEqual(F.finishPlay('rabbit', D(2026, 10, 2)).cast, null);                    // 다 모음
  assert.strictEqual(F.castCount('rabbit'), 2); assert.strictEqual(F.hasCast('rabbit', 'a'), true); assert.strictEqual(F.hasCast('rabbit', 'b'), false);
  assert.strictEqual(F.finishPlay('frog', D(2026, 10, 2)).cast, null);                      // 그 동화 항목 없음
  assert.deepEqual(F.state().cast, ['rabbit.a', 'rabbit.c']);
  // 합집합·형식·상한
  const m = F.merge({ cast: ['rabbit.a', 'bad', 'A.b'] }, { cast: ['rabbit.a', 'turnip.z'] });
  assert.deepEqual(m.cast, ['rabbit.a', 'turnip.z']);
  const big = Array.from({ length: 450 }, (_, i) => 't' + String(i).padStart(3, '0') + '.k');
  assert.strictEqual(F.merge({ cast: big }, {}).cast.length, 400);
  assert.deepEqual(F.merge({ cast: big.slice(0, 300) }, { cast: big.slice(150) }).cast, F.merge({ cast: big.slice(150) }, { cast: big.slice(0, 300) }).cast);
});

ok('옛 저장 이름의 열린 목록은 한 번 옮겨진다', () => {
  const { E, ls } = boot({ mem: { sync_state: JSON.stringify({ firstRun: '2026-10-01', ['cloud' + 'Unlocked']: ['bremen'] }) } });
  assert.deepEqual(E.state().starUnlocked, ['bremen']);
  assert.deepEqual(JSON.parse(ls.sync_state).starUnlocked, ['bremen']);
});

ok('기다무: 7일 뒤 1편, 14일 뒤 +1편, 최대 2편', () => {
  const { E } = boot({ ready: READY, mem: { sync_state: JSON.stringify({ firstRun: '2026-10-01' }) } });
  assert.strictEqual(E.waitAvailable(D(2026, 10, 7)), 0);                  // 6일째
  assert.strictEqual(E.waitDaysLeft(D(2026, 10, 7)), 1);
  assert.strictEqual(E.waitAvailable(D(2026, 10, 8)), 1);                  // 7일째
  const [a] = E.lockedChoices(D(2026, 10, 8));
  assert.strictEqual(E.waitUnlock(a, D(2026, 10, 8)), true);
  assert.strictEqual(E.waitAvailable(D(2026, 10, 8)), 0);
  assert.strictEqual(E.waitUnlock(E.lockedChoices(D(2026, 10, 8))[0], D(2026, 10, 8)), false);
  assert.strictEqual(E.waitDaysLeft(D(2026, 10, 8)), 7);
  assert.strictEqual(E.waitAvailable(D(2026, 10, 15)), 1);                 // 14일째
  const b = E.lockedChoices(D(2026, 10, 15))[0];
  assert.strictEqual(E.waitUnlock(b, D(2026, 10, 15)), true);
  assert.strictEqual(E.waitAvailable(D(2026, 12, 31)), 0); assert.strictEqual(E.waitDaysLeft(D(2026, 12, 31)), 0);
  assert.strictEqual(E.waitUnlock(E.lockedChoices(D(2026, 12, 31))[0], D(2026, 12, 31)), false);
  assert.deepEqual(E.state().waitUnlocked, [a, b]);
});

ok('첫 실행 날짜가 저장되고, 옛 구매 기록(owned_all)은 owned 로 이어진다', () => {
  const { E, ls } = boot({ ready: READY, mem: { owned_all: '1' } });
  assert.strictEqual(E.state().owned, true); assert.match(E.state().firstRun, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(JSON.parse(ls.sync_state).firstRun);
  assert.strictEqual(E.status('bremen'), 'owned');
});

await okA('서버가 없으면(API_BASE 비어 있음) 조용히 오프라인으로 동작', async () => {
  const { E } = boot({ ready: READY });
  assert.strictEqual(E.syncEnabled(), false);
  assert.strictEqual(await E.sync(), false);
  assert.deepEqual(await E.createLinkCode(), { ok: false, error: 'offline' });
  assert.deepEqual(await E.redeemLinkCode('abcd efgh'), { ok: false, error: 'offline' });
  assert.deepEqual(await E.redeemLinkCode('ABC'), { ok: false, error: 'bad_request' });
  assert.strictEqual(E.earnStar('rabbit'), true);
});

await okA('가짜 서버: 계정 만들기 → PUT 합치기 → 연결 코드 만들기·입력 → 영수증', async () => {
  const log = [];
  const server = { state: { firstRun: '2026-09-01', earned: { '2026-09-02': 'frog' }, starUnlocked: [], waitUnlocked: [], owned: false } };
  const fetchImpl = async (url, o) => {
    const path = url.replace('https://x.test/v1', ''), body = o.body ? JSON.parse(o.body) : null;
    log.push([o.method, path, o.headers.Authorization || '']);
    const res = (status, j) => ({ ok: status < 400, status, json: async () => j });
    if (path === '/account') return res(201, { accountId: 'acc1', token: 'tok1', state: server.state });
    if (!/^Bearer acc/.test(o.headers.Authorization || '')) return res(401, { error: 'unauthorized' });
    if (path === '/state') return res(200, { state: E.merge(server.state, { ...body.state, owned: false }) });
    if (path === '/link/create') return res(200, { code: 'ABCDEFGH', expiresAt: Date.now() + 600000 });
    if (path === '/link/redeem') return body.code === 'ABCDEFGH' ? res(200, { accountId: 'acc2', token: 'tok2', state: { ...server.state, owned: true } }) : res(404, { error: 'code_invalid' });
    if (path === '/receipt/apple') return res(200, { owned: true, state: { ...server.state, owned: true } });
    return res(400, { error: 'bad_request' });
  };
  const { E, ls } = boot({ ready: READY, apiBase: 'https://x.test', fetchImpl });
  assert.strictEqual(E.syncEnabled(), true);
  E.earnStar('rabbit', D(2026, 10, 3));
  assert.strictEqual(await E.sync(), true);
  assert.deepEqual(log.slice(0, 2).map(l => l[1]), ['/account', '/state']);
  assert.strictEqual(log[1][2], 'Bearer acc1.tok1');
  assert.strictEqual(E.state().firstRun <= '2026-09-01', true);               // 서버의 더 이른 날짜가 이긴다
  assert.deepEqual(Object.keys(E.state().earned).sort(), ['2026-09-02', '2026-10-03']);
  assert.strictEqual(ls.sync_dirty, undefined);
  assert.deepEqual(await E.createLinkCode().then(r => [r.ok, r.code]), [true, 'ABCDEFGH']);
  assert.deepEqual(await E.redeemLinkCode('abcd-efgh').then(r => r.ok), true);   // 소문자·하이픈 정리
  assert.strictEqual(JSON.parse(ls.sync_account).accountId, 'acc2'); assert.strictEqual(E.state().owned, true);
  assert.deepEqual(await E.redeemLinkCode('ZZZZZZZZ'), { ok: false, error: 'code_invalid' });
  assert.strictEqual(await E.sendReceipt({ signedTransaction: 'jws' }), true);
  assert.strictEqual(log.at(-1)[1], '/receipt/apple');
});

await okA('영수증을 못 보내면 보관했다가 다음 동기화 때 보낸다', async () => {
  let up = false;
  const fetchImpl = async (url, o) => {
    if (!up) throw new Error('offline');
    const p = url.replace('https://x.test/v1', ''); const res = (s, j) => ({ ok: s < 400, status: s, json: async () => j });
    if (p === '/account') return res(201, { accountId: 'a', token: 't', state: {} });
    if (p === '/receipt/google') return res(200, { owned: true, state: { owned: true } });
    if (p === '/state') return res(200, { state: JSON.parse(o.body).state });
    return res(400, { error: 'bad_request' });
  };
  const { E, ls } = boot({ ready: READY, apiBase: 'https://x.test', fetchImpl });
  assert.strictEqual(await E.sendReceipt({ purchaseToken: 'pt', productId: E.PRODUCT_ID }), false);
  assert.strictEqual(JSON.parse(ls.sync_receipt).length, 1);
  up = true;
  assert.strictEqual(await E.sync(), true);
  assert.strictEqual(ls.sync_receipt, undefined); assert.strictEqual(E.state().owned, true);
});

console.log(`\n${n}개 시험 통과`);
process.exit(0);
