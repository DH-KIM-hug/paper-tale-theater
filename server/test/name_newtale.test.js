// 2026-11-24 사용자 결정: 새 창작 동화가 추가되면 자격 있는 계정(모든 동화 열기 구매, 변경권을 사거나 받은 적 있음)은
// 그 새 동화에만 변경권 없이 이름 설정 1번. 지금은 새 동화가 없으므로 가짜 다섯 번째 동화(new_tale)를 목록에 넣어 시험한다.
import { describe, expect, it, vi } from 'vitest';
import { makeEnv, newAccount } from './helpers/kv.js';

vi.mock('../src/name_lines.js', async (orig) => {
  const m = await orig();
  return { ...m, NAME_LINES: { ...m.NAME_LINES, new_tale: m.NAME_LINES.unicorn } };
});
const { handle } = await import('../src/app.js');
const { NAME_LINES } = await import('../src/name_lines.js');

const NOW = Date.UTC(2026, 11, 1, 12);
const ALL = ['kkultteok', 'red_car', 'unicorn', 'witch_candy', 'new_tale'];
async function raw(env, method, path, { body, auth, deps } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (auth) headers.authorization = `Bearer ${auth.accountId}.${auth.token}`;
  const res = await handle(new Request('https://sync.test' + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), env, deps);
  const type = res.headers.get('content-type') || '';
  if (type.startsWith('audio/')) return { status: res.status };
  const text = await res.text();
  return { status: res.status, json: text ? JSON.parse(text) : null };
}
function setup() {
  const env = makeEnv({ ELEVENLABS_API_KEY: 'k' });
  const clock = { t: NOW };
  const fetch = vi.fn(async () => new Response(new Uint8Array(100).fill(7), { status: 200, headers: { 'content-type': 'audio/mpeg' } }));
  return { env, clock, deps: { now: () => clock.t, fetch } };
}
const edit = (env, a, f) => { const k = 'acct:' + a.accountId, rec = JSON.parse(env.ACCOUNTS.map.get(k)); f(rec); env.ACCOUNTS.map.set(k, JSON.stringify(rec)); };
const run = (env, a, deps, body) => raw(env, 'POST', '/v1/name/run', { auth: a, body, deps });
const quota = async (env, a, deps) => (await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json;
const LINE = { tale: 'new_tale', id: NAME_LINES.unicorn[0].id, lang: 'ko', names: { A: '서아' } };

describe('새 창작 동화 무료 설정 1번(2026-11-24, 가짜 new_tale)', () => {
  it('구매자: 변경권 없이 새 동화만 한 번, 같은 동화 두 번째와 출시 동화는 402', async () => {
    const { env, clock, deps } = setup();
    const a = await newAccount(env, deps);
    edit(env, a, (r) => { r.state.owned = true; r.name = { first: [], tickets: 0, eligible: true, covered: ['kkultteok', 'red_car', 'unicorn', 'witch_candy'] }; });
    expect(await quota(env, a, deps)).toMatchObject({ tickets: 0, newFree: ['new_tale'] });
    expect((await run(env, a, deps, { tale: 'unicorn' })).status).toBe(402); // 출시 동화는 변경권
    const r = await run(env, a, deps, { tale: 'new_tale' });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ kind: 'new', tales: ['new_tale'] });
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: r.json.runId, ...LINE }, deps })).status).toBe(200);
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: r.json.runId, ...LINE, tale: 'unicorn' }, deps })).status).toBe(404); // 실행 밖 동화
    expect((await run(env, a, deps, { tale: 'new_tale' })).json).toMatchObject({ runId: r.json.runId, resumed: true });
    expect(await quota(env, a, deps)).toMatchObject({ tickets: 0, newFree: [] });
    clock.t += 49 * 3600 * 1000;
    expect((await run(env, a, deps, { tale: 'new_tale' })).status).toBe(402); // 한 번 쓰면 끝
    expect((await run(env, a, deps, { ticket: true })).status).toBe(402);
  });
  it('구매 없이 변경권을 산 적 있는 계정(남은 0장)도 자격이 있다, 자격 없는 계정은 402', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    edit(env, a, (r) => { r.name = { first: [], tickets: 0, tx: ['h'], covered: [] }; });
    expect((await quota(env, a, deps)).newFree).toEqual(['new_tale']);
    expect((await run(env, a, deps, { tale: 'new_tale' })).json.kind).toBe('new');
    const b = await newAccount(env, deps);
    expect((await quota(env, b, deps)).newFree).toEqual([]);
    const no = await run(env, b, deps, { tale: 'new_tale' });
    expect(no.status).toBe(402);
    expect(no.json.error).toBe('no_credit');
  });
  it('변경권 실행은 새 동화도 덮으니(covered) 그 뒤 무료 설정은 없다', async () => {
    const { env, clock, deps } = setup();
    const a = await newAccount(env, deps);
    edit(env, a, (r) => { r.state.owned = true; r.name = { first: [], tickets: 1, eligible: true }; });
    const t = await run(env, a, deps, { ticket: true });
    expect(t.json.tales).toEqual([...ALL, 'home']);
    expect((await run(env, a, deps, { tale: 'new_tale' })).json).toMatchObject({ runId: t.json.runId, resumed: true, kind: 'ticket' });
    clock.t += 49 * 3600 * 1000;
    expect((await quota(env, a, deps)).newFree).toEqual([]);
    expect((await run(env, a, deps, { tale: 'new_tale' })).status).toBe(402);
  });
  it('연결 코드로 합치면 자격은 OR, covered 는 합집합', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    edit(env, a, (r) => { r.name = { first: [], tickets: 0, eligible: true, covered: [] }; });
    const b = await newAccount(env, deps);
    edit(env, b, (r) => { r.name = { first: [], tickets: 0, covered: ['new_tale'] }; });
    const code = (await raw(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps })).json.code;
    const m = (await raw(env, 'POST', '/v1/link/redeem', { auth: b, body: { code }, deps })).json;
    expect((await quota(env, { accountId: m.accountId, token: m.token }, deps)).newFree).toEqual([]);
  });
});
