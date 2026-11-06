import { describe, expect, it } from 'vitest';
import { sha256Hex } from '../src/util.js';
import { call, makeEnv, newAccount } from './helpers/kv.js';

const FAKE = 'test-coupon';
const clock = (start = Date.UTC(2026, 10, 6, 12)) => {
  const c = { t: start, deps: null };
  c.deps = { now: () => c.t };
  return c;
};
const couponEnv = async (extra = []) => makeEnv({ COUPON_SHA256: [await sha256Hex(FAKE), ...extra].join(',') });

describe('쿠폰', () => {
  it('COUPON_SHA256 이 없으면 404 not_found (기능 꺼짐)', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    const r = await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: FAKE } });
    expect(r.status).toBe(404);
    expect(r.json.error).toBe('not_found');
  });
  it('인증이 없으면 401', async () => {
    const env = await couponEnv();
    expect((await call(env, 'POST', '/v1/coupon', { body: { code: FAKE } })).status).toBe(401);
  });
  it('틀린 쿠폰은 400 bad_coupon, owned 는 그대로 false', async () => {
    const env = await couponEnv();
    const a = await newAccount(env);
    const r = await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: 'wrong-coupon' } });
    expect(r.status).toBe(400);
    expect(r.json.error).toBe('bad_coupon');
    expect((await call(env, 'GET', '/v1/state', { auth: a })).json.state.owned).toBe(false);
  });
  it('code 가 문자열이 아니면 400 bad_request', async () => {
    const env = await couponEnv();
    const a = await newAccount(env);
    expect((await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: 5 } })).json.error).toBe('bad_request');
  });
  it('맞는 쿠폰(앞뒤 공백·대문자 허용)은 owned 를 켜고 이름 기능도 구매자와 같다', async () => {
    const env = await couponEnv([await sha256Hex('other')]);
    const a = await newAccount(env);
    const before = (await call(env, 'GET', '/v1/name/quota', { auth: a })).json;
    expect(before.owned).toBe(false);
    expect(before.firstLeft).toEqual([]);
    const r = await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: '  TEST-Coupon \n' } });
    expect(r.status).toBe(200);
    expect(r.json.owned).toBe(true);
    expect(r.json.state.owned).toBe(true);
    expect((await call(env, 'GET', '/v1/state', { auth: a })).json.state.owned).toBe(true);
    const q = (await call(env, 'GET', '/v1/name/quota', { auth: a })).json;
    expect(q.owned).toBe(true);
    expect(q.firstLeft).toEqual(['kkultteok', 'red_car', 'unicorn', 'witch_candy']); // 쿠폰으로 열어도 구매자와 같다(동화마다 첫 설정)
    const rec = JSON.parse(env.ACCOUNTS.map.get('acct:' + a.accountId));
    expect(rec.ownedVia).toBe('coupon');
    // 쿠폰 원문은 KV 어디에도 없다
    expect([...env.ACCOUNTS.map.entries()].flat().join('')).not.toContain(FAKE);
    // 클라이언트 state 동기화로 owned 가 꺼지지 않는다
    const put = await call(env, 'PUT', '/v1/state', { auth: a, body: { state: { owned: false } } });
    expect(put.json.state.owned).toBe(true);
  });
  it('쿠폰으로 연 계정을 다른 기기와 연결해도 owned 가 유지된다', async () => {
    const env = await couponEnv();
    const a = await newAccount(env);
    await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: FAKE } });
    const b = await newAccount(env);
    const code = (await call(env, 'POST', '/v1/link/create', { auth: a, body: {} })).json.code;
    const r = await call(env, 'POST', '/v1/link/redeem', { auth: b, body: { code } });
    expect(r.json.state.owned).toBe(true);
    expect(JSON.parse(env.ACCOUNTS.map.get('acct:' + a.accountId)).ownedVia).toBe('coupon');
  });
  it('계정당 10분에 5번까지, 6번째는 429 rate_limited', async () => {
    const env = await couponEnv();
    const c = clock();
    const a = await newAccount(env, c.deps);
    for (let i = 0; i < 5; i++) {
      expect((await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: 'nope' + i }, deps: c.deps })).status).toBe(400);
    }
    const over = await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: FAKE }, deps: c.deps });
    expect(over.status).toBe(429);
    expect(over.json.error).toBe('rate_limited');
    c.t += 10 * 60 * 1000;
    expect((await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: FAKE }, deps: c.deps })).status).toBe(200);
  });
});
