import { describe, expect, it } from 'vitest';
import { CODE_ALPHABET } from '../src/app.js';
import { call, makeEnv, newAccount } from './helpers/kv.js';

const clock = (start = Date.UTC(2026, 9, 27, 12)) => {
  const c = { t: start, deps: null };
  c.deps = { now: () => c.t };
  return c;
};

describe('계정과 인증', () => {
  it('계정 생성은 201 과 id·token·state', async () => {
    const env = makeEnv();
    const r = await call(env, 'POST', '/v1/account', { body: {} });
    expect(r.status).toBe(201);
    expect(r.json.accountId).toMatch(/^[0-9a-f-]{36}$/);
    expect(r.json.token.length).toBeGreaterThanOrEqual(43);
    expect(r.json.state.owned).toBe(false);
  });
  it('서버에는 token 원문이 없고 해시만 있다', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    const raw = [...env.ACCOUNTS.map.values()].join('');
    expect(raw).not.toContain(a.token);
  });
  it('인증 실패는 401 unauthorized', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    expect((await call(env, 'GET', '/v1/state')).status).toBe(401);
    expect((await call(env, 'GET', '/v1/state', { auth: { accountId: a.accountId, token: 'x'.repeat(43) } })).json.error).toBe('unauthorized');
    expect((await call(env, 'GET', '/v1/state', { auth: { accountId: '00000000-0000-4000-8000-000000000000', token: a.token } })).status).toBe(401);
    expect((await call(env, 'GET', '/v1/state', { auth: a })).status).toBe(200);
  });
  it('계정 삭제 후에는 인증이 안 된다', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    expect((await call(env, 'DELETE', '/v1/account', { auth: a })).status).toBe(204);
    expect((await call(env, 'GET', '/v1/state', { auth: a })).status).toBe(401);
    expect(env.ACCOUNTS.keys().filter((k) => k.startsWith('acct:'))).toHaveLength(0);
  });
  it('알 수 없는 경로는 404, 잘못된 본문은 400', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    expect((await call(env, 'GET', '/v1/nope', { auth: a })).status).toBe(404);
    expect((await call(env, 'PUT', '/v1/state', { auth: a, body: { state: 5 } })).json.error).toBe('bad_request');
  });
});

describe('state 동기화', () => {
  it('PUT 은 서버 state 와 합치고, owned:true 는 무시한다', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    await call(env, 'PUT', '/v1/state', { auth: a, body: { state: { firstRun: '2026-10-10', earned: { '2026-10-10': 'rabbit' }, starUnlocked: ['a'], stickers: ['rabbit'] } } });
    const r = await call(env, 'PUT', '/v1/state', { auth: a, body: { state: { firstRun: '2026-10-05', earned: { '2026-10-11': 'ant' }, stickers: ['ant'], owned: true } } });
    expect(r.json.state.firstRun).toBe('2026-10-05');
    expect(Object.keys(r.json.state.earned)).toHaveLength(2);
    expect(r.json.state.starUnlocked).toEqual(['a']);
    expect(r.json.state.stickers).toEqual(['rabbit', 'ant']);
    expect(r.json.state.owned).toBe(false);
    expect((await call(env, 'GET', '/v1/state', { auth: a })).json.state.owned).toBe(false);
  });
});

describe('CORS', () => {
  it('허용된 origin 에만 헤더', async () => {
    const env = makeEnv({ WEB_ORIGINS: 'https://me.github.io' });
    const ok = await call(env, 'OPTIONS', '/v1/state', { origin: 'capacitor://localhost' });
    expect(ok.status).toBe(204);
    expect(ok.headers.get('access-control-allow-origin')).toBe('capacitor://localhost');
    expect((await call(env, 'POST', '/v1/account', { body: {}, origin: 'https://me.github.io' })).headers.get('access-control-allow-origin')).toBe('https://me.github.io');
    expect((await call(env, 'POST', '/v1/account', { body: {}, origin: 'https://evil.example' })).headers.get('access-control-allow-origin')).toBeNull();
  });
});

describe('연결 코드', () => {
  it('코드는 8자리, 혼동 문자 없음, 10분 유효', async () => {
    const env = makeEnv();
    const c = clock();
    const a = await newAccount(env, c.deps);
    for (let i = 0; i < 10; i++) {
      const r = await call(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps: c.deps });
      expect(r.json.code).toHaveLength(8);
      expect([...r.json.code].every((ch) => CODE_ALPHABET.includes(ch))).toBe(true);
      expect(r.json.code).not.toMatch(/[ILO01]/);
      expect(Date.parse(r.json.expiresAt) - c.t).toBe(600000);
    }
  });
  it('생성 → 입력: 새 token, state 합치고 기존 계정 삭제', async () => {
    const env = makeEnv();
    const c = clock();
    const a = await newAccount(env, c.deps);
    const b = await newAccount(env, c.deps);
    await call(env, 'PUT', '/v1/state', { auth: a, body: { state: { earned: { '2026-10-01': 'rabbit' }, starUnlocked: ['x'] } }, deps: c.deps });
    await call(env, 'PUT', '/v1/state', { auth: b, body: { state: { firstRun: '2026-09-01', earned: { '2026-10-02': 'ant' } } }, deps: c.deps });
    const { json: link } = await call(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps: c.deps });
    const r = await call(env, 'POST', '/v1/link/redeem', { auth: b, body: { code: link.code.toLowerCase() }, deps: c.deps });
    expect(r.status).toBe(200);
    expect(r.json.accountId).toBe(a.accountId);
    expect(r.json.token).not.toBe(a.token);
    expect(Object.keys(r.json.state.earned)).toHaveLength(2);
    expect(r.json.state.firstRun).toBe('2026-09-01');
    // 새 token 으로 인증되고, 기존 두 token 중 a 의 것도 계속 유효, b 계정은 삭제
    const newAuth = { accountId: r.json.accountId, token: r.json.token };
    expect((await call(env, 'GET', '/v1/state', { auth: newAuth })).status).toBe(200);
    expect((await call(env, 'GET', '/v1/state', { auth: a })).status).toBe(200);
    expect((await call(env, 'GET', '/v1/state', { auth: b })).status).toBe(401);
  });
  it('재사용 거부', async () => {
    const env = makeEnv();
    const c = clock();
    const a = await newAccount(env, c.deps);
    const b = await newAccount(env, c.deps);
    const d = await newAccount(env, c.deps);
    const { json: link } = await call(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps: c.deps });
    expect((await call(env, 'POST', '/v1/link/redeem', { auth: b, body: { code: link.code }, deps: c.deps })).status).toBe(200);
    const again = await call(env, 'POST', '/v1/link/redeem', { auth: d, body: { code: link.code }, deps: c.deps });
    expect(again.status).toBe(404);
    expect(again.json.error).toBe('code_invalid');
  });
  it('10분이 지나면 거부', async () => {
    const env = makeEnv();
    const c = clock();
    const a = await newAccount(env, c.deps);
    const b = await newAccount(env, c.deps);
    const { json: link } = await call(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps: c.deps });
    c.t += 10 * 60 * 1000 + 1;
    const r = await call(env, 'POST', '/v1/link/redeem', { auth: b, body: { code: link.code }, deps: c.deps });
    expect(r.json.error).toBe('code_invalid');
  });
  it('자기 코드는 409 code_self 이고 코드는 남는다', async () => {
    const env = makeEnv();
    const c = clock();
    const a = await newAccount(env, c.deps);
    const b = await newAccount(env, c.deps);
    const { json: link } = await call(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps: c.deps });
    const self = await call(env, 'POST', '/v1/link/redeem', { auth: a, body: { code: link.code }, deps: c.deps });
    expect(self.status).toBe(409);
    expect(self.json.error).toBe('code_self');
    expect((await call(env, 'POST', '/v1/link/redeem', { auth: b, body: { code: link.code }, deps: c.deps })).status).toBe(200);
  });
  it('없는 코드·형식 오류는 code_invalid, 코드 없으면 bad_request', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    expect((await call(env, 'POST', '/v1/link/redeem', { auth: a, body: { code: 'ABCDEFGH' } })).json.error).toBe('code_invalid');
    expect((await call(env, 'POST', '/v1/link/redeem', { auth: a, body: { code: 'ILO01!!!' } })).json.error).toBe('code_invalid');
    expect((await call(env, 'POST', '/v1/link/redeem', { auth: a, body: {} })).json.error).toBe('bad_request');
  });
  it('코드 입력은 분당 5회 제한, 다음 분에는 풀린다', async () => {
    const env = makeEnv();
    const c = clock(Date.UTC(2026, 9, 27, 12, 0, 0));
    const a = await newAccount(env, c.deps);
    for (let i = 0; i < 5; i++) {
      expect((await call(env, 'POST', '/v1/link/redeem', { auth: a, body: { code: 'ABCDEFGH' }, deps: c.deps })).status).toBe(404);
    }
    const r = await call(env, 'POST', '/v1/link/redeem', { auth: a, body: { code: 'ABCDEFGH' }, deps: c.deps });
    expect(r.status).toBe(429);
    expect(r.json.error).toBe('rate_limited');
    c.t += 60 * 1000;
    expect((await call(env, 'POST', '/v1/link/redeem', { auth: a, body: { code: 'ABCDEFGH' }, deps: c.deps })).status).toBe(404);
  });
  it('코드 생성은 시간당 10회 제한', async () => {
    const env = makeEnv();
    const c = clock(Date.UTC(2026, 9, 27, 12, 0, 0));
    const a = await newAccount(env, c.deps);
    for (let i = 0; i < 10; i++) expect((await call(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps: c.deps })).status).toBe(200);
    expect((await call(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps: c.deps })).status).toBe(429);
  });
  it('연결 시 owned 는 어느 한쪽이 true 면 true (영수증으로 얻은 값)', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    const b = await newAccount(env);
    const rec = JSON.parse(env.ACCOUNTS.map.get('acct:' + b.accountId));
    rec.state.owned = true;
    env.ACCOUNTS.map.set('acct:' + b.accountId, JSON.stringify(rec));
    const { json: link } = await call(env, 'POST', '/v1/link/create', { auth: a, body: {} });
    const r = await call(env, 'POST', '/v1/link/redeem', { auth: b, body: { code: link.code } });
    expect(r.json.state.owned).toBe(true);
  });
});
