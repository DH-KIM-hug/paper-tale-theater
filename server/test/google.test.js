import { beforeAll, describe, expect, it, vi } from 'vitest';
import { verifyGooglePurchase } from '../src/google.js';
import { bytesToB64 } from '../src/util.js';
import { call, makeEnv, newAccount } from './helpers/kv.js';

let saJson;
beforeAll(async () => {
  const kp = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const pkcs8 = new Uint8Array(await crypto.subtle.exportKey('pkcs8', kp.privateKey));
  const pem = `-----BEGIN PRIVATE KEY-----\n${bytesToB64(pkcs8).match(/.{1,64}/g).join('\n')}\n-----END PRIVATE KEY-----\n`;
  saJson = JSON.stringify({ client_email: 'svc@proj.iam.gserviceaccount.com', private_key: pem, token_uri: 'https://oauth2.googleapis.com/token' });
});

const TOKEN = 'abcdefghij.AO-J1Oabcdefghijklmnop';
const res = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

function mockFetch({ purchase = { purchaseState: 0, acknowledgementState: 0 }, getStatus = 200, ackStatus = 200 } = {}) {
  return vi.fn(async (url, init = {}) => {
    if (url === 'https://oauth2.googleapis.com/token') {
      const assertion = new URLSearchParams(init.body).get('assertion');
      expect(assertion.split('.')).toHaveLength(3);
      return res(200, { access_token: 'ya29.test' });
    }
    expect(init.headers.authorization).toBe('Bearer ya29.test');
    if (url.endsWith(':acknowledge')) return res(ackStatus, {});
    expect(url).toContain('/applications/com.papertale.theater/purchases/products/com.papertale.theater.unlockall/tokens/');
    return res(getStatus, purchase);
  });
}

const base = (fetchFn) => ({ serviceAccountJson: saJson, packageName: 'com.papertale.theater', productId: 'com.papertale.theater.unlockall', expectedProductId: 'com.papertale.theater.unlockall', purchaseToken: TOKEN, fetchFn, now: Date.UTC(2026, 9, 27) });

describe('구글 Play 검증 (fetch 모의)', () => {
  it('purchaseState 0 이면 통과하고 미확인이면 acknowledge', async () => {
    const f = mockFetch();
    expect((await verifyGooglePurchase(base(f))).receiptKey).toBe('google:' + TOKEN);
    expect(f.mock.calls.filter(([u]) => u.endsWith(':acknowledge'))).toHaveLength(1);
  });
  it('이미 확인된 구매는 acknowledge 를 부르지 않는다', async () => {
    const f = mockFetch({ purchase: { purchaseState: 0, acknowledgementState: 1 } });
    await verifyGooglePurchase(base(f));
    expect(f.mock.calls.some(([u]) => u.endsWith(':acknowledge'))).toBe(false);
  });
  it('취소·보류(purchaseState != 0), 없는 토큰, 다른 상품은 거부', async () => {
    await expect(verifyGooglePurchase(base(mockFetch({ purchase: { purchaseState: 1 } })))).rejects.toThrow('state');
    await expect(verifyGooglePurchase(base(mockFetch({ getStatus: 404 })))).rejects.toThrow('not found');
    await expect(verifyGooglePurchase({ ...base(mockFetch()), productId: 'other' })).rejects.toThrow('product');
    await expect(verifyGooglePurchase({ ...base(mockFetch()), purchaseToken: 'x' })).rejects.toThrow('token');
  });
  it('구글 서버 오류·acknowledge 실패는 영수증 거부가 아니라 서버 오류', async () => {
    await expect(verifyGooglePurchase(base(mockFetch({ getStatus: 500 })))).rejects.toThrow('play get failed');
    await expect(verifyGooglePurchase(base(mockFetch({ ackStatus: 500 })))).rejects.toThrow('acknowledge');
  });
  it('서비스 계정 비밀값이 없으면 설정 오류', async () => {
    await expect(verifyGooglePurchase({ ...base(mockFetch()), serviceAccountJson: undefined })).rejects.toThrow('GOOGLE_SERVICE_ACCOUNT_JSON');
  });
});

describe('POST /v1/receipt/google', () => {
  it('통과하면 owned true', async () => {
    const env = makeEnv({ GOOGLE_SERVICE_ACCOUNT_JSON: saJson });
    const a = await newAccount(env);
    const body = { purchaseToken: TOKEN, productId: 'com.papertale.theater.unlockall' };
    const r = await call(env, 'POST', '/v1/receipt/google', { auth: a, body, deps: { fetch: mockFetch() } });
    expect(r.status).toBe(200);
    expect(r.json.owned).toBe(true);
  });
  it('거부되면 422', async () => {
    const env = makeEnv({ GOOGLE_SERVICE_ACCOUNT_JSON: saJson });
    const a = await newAccount(env);
    const r = await call(env, 'POST', '/v1/receipt/google', { auth: a, body: { purchaseToken: TOKEN, productId: 'com.papertale.theater.unlockall' }, deps: { fetch: mockFetch({ purchase: { purchaseState: 1 } }) } });
    expect(r.status).toBe(422);
    expect(r.json.error).toBe('receipt_invalid');
  });
  it('비밀값 없으면 500, 본문 틀리면 400', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    expect((await call(env, 'POST', '/v1/receipt/google', { auth: a, body: { purchaseToken: TOKEN, productId: 'com.papertale.theater.unlockall' }, deps: { fetch: mockFetch() } })).status).toBe(500);
    expect((await call(env, 'POST', '/v1/receipt/google', { auth: a, body: {} })).status).toBe(400);
  });
});
