import { describe, expect, it } from 'vitest';
import { sha256Hex } from '../src/util.js';
import { call, makeEnv, newAccount } from './helpers/kv.js';

// 개발 실험용 쿠폰은 2026-11-13 앱·서버 코드에서 제거했다(App Store 지침 3.1.1).
// 비밀값 COUPON_SHA256 이 남아 있어도 /v1/coupon 은 없는 경로(404)이고 owned 를 켜지 않는다.
const FAKE = 'test-coupon';

describe('쿠폰 제거', () => {
  it('COUPON_SHA256 이 남아 있어도 POST /v1/coupon 은 404 not_found, owned 는 false 그대로', async () => {
    const env = makeEnv({ COUPON_SHA256: await sha256Hex(FAKE) });
    const a = await newAccount(env);
    const r = await call(env, 'POST', '/v1/coupon', { auth: a, body: { code: FAKE } });
    expect(r.status).toBe(404);
    expect(r.json.error).toBe('not_found');
    const s = await call(env, 'GET', '/v1/state', { auth: a });
    expect(s.json.state.owned).toBeFalsy();
  });

  it('인증이 없어도 404 (경로 자체가 없음)', async () => {
    const env = makeEnv({ COUPON_SHA256: await sha256Hex(FAKE) });
    const r = await call(env, 'POST', '/v1/coupon', { body: { code: FAKE } });
    expect(r.status).toBe(404);
  });
});
