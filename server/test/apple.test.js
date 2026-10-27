import { beforeAll, describe, expect, it } from 'vitest';
import { verifyAppleTransaction } from '../src/apple.js';
import { goodPayload, makeChain, signTransaction, genKey } from './helpers/pki.js';
import { call, makeEnv, newAccount } from './helpers/kv.js';

const NOW = Date.UTC(2026, 9, 27, 12);
let chain;
beforeAll(async () => { chain = await makeChain(); });
const opts = () => ({ rootPem: chain.rootPem, now: NOW });

describe('애플 JWS 검증', () => {
  it('올바른 사슬·서명·내용은 통과', async () => {
    const r = await verifyAppleTransaction(await signTransaction(chain, goodPayload()), opts());
    expect(r.receiptKey).toBe('apple:1000000123456789');
    expect(r.environment).toBe('Sandbox');
  });
  it('x5c 에 루트가 들어 있어도 통과', async () => {
    await verifyAppleTransaction(await signTransaction(chain, goodPayload({ environment: 'Production' }), { includeRoot: true }), opts());
  });
  it('다른 루트로 만든 사슬은 거부', async () => {
    const other = await makeChain();
    const jws = await signTransaction(other, goodPayload());
    await expect(verifyAppleTransaction(jws, opts())).rejects.toThrow();
  });
  it('JWS 서명이 다른 키면 거부', async () => {
    const jws = await signTransaction(chain, goodPayload(), { signKey: await genKey('P-256') });
    await expect(verifyAppleTransaction(jws, opts())).rejects.toThrow('jws signature');
  });
  it('payload 를 바꾸면 거부', async () => {
    const jws = await signTransaction(chain, goodPayload());
    const [h, , s] = jws.split('.');
    const p = Buffer.from(JSON.stringify(goodPayload({ originalTransactionId: '999' }))).toString('base64url');
    await expect(verifyAppleTransaction(`${h}.${p}.${s}`, opts())).rejects.toThrow();
  });
  it('bundleId·productId·환경·취소 검사', async () => {
    for (const over of [{ bundleId: 'com.other' }, { productId: 'other.product' }, { environment: 'Xcode' }, { revocationDate: 1 }]) {
      await expect(verifyAppleTransaction(await signTransaction(chain, goodPayload(over)), opts()), JSON.stringify(over)).rejects.toThrow();
    }
  });
  it('리프 인증서 유효 기간이 서명 시각보다 먼저 끝났으면 거부', async () => {
    const c = await makeChain({ leafNotAfter: Date.UTC(2025, 0, 1) });
    await expect(verifyAppleTransaction(await signTransaction(c, goodPayload()), { rootPem: c.rootPem, now: NOW })).rejects.toThrow('leaf expired');
  });
  it('애플 영수증용 OID 가 없는 인증서는 거부, 옵션으로 끌 수 있다', async () => {
    const c = await makeChain({ withOids: false });
    const jws = await signTransaction(c, goodPayload());
    await expect(verifyAppleTransaction(jws, { rootPem: c.rootPem, now: NOW })).rejects.toThrow('oid');
    await verifyAppleTransaction(jws, { rootPem: c.rootPem, now: NOW, requireAppleOids: false });
  });
  it('쓰레기 입력은 거부, 루트가 자리표시자면 설정 오류', async () => {
    await expect(verifyAppleTransaction('a.b.c', opts())).rejects.toThrow();
    await expect(verifyAppleTransaction('x', opts())).rejects.toThrow();
    await expect(verifyAppleTransaction(await signTransaction(chain, goodPayload()), { rootPem: 'PLACEHOLDER', now: NOW })).rejects.toThrow('not configured');
  });
});

describe('POST /v1/receipt/apple', () => {
  it('통과하면 owned 가 true, 거부되면 422', async () => {
    const env = makeEnv({ APPLE_ROOT_CA_G3_PEM: chain.rootPem });
    const deps = { now: () => NOW };
    const a = await newAccount(env, deps);
    const bad = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: 'a.b.c' }, deps });
    expect(bad.status).toBe(422);
    expect(bad.json.error).toBe('receipt_invalid');
    expect((await call(env, 'GET', '/v1/state', { auth: a })).json.state.owned).toBe(false);
    const ok = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: await signTransaction(chain, goodPayload()) }, deps });
    expect(ok.status).toBe(200);
    expect(ok.json.owned).toBe(true);
    expect(ok.json.state.owned).toBe(true);
    expect((await call(env, 'GET', '/v1/state', { auth: a })).json.state.owned).toBe(true);
    // PUT 으로 owned:false 를 보내도 내려가지 않는다
    expect((await call(env, 'PUT', '/v1/state', { auth: a, body: { state: { owned: false } }, deps })).json.state.owned).toBe(true);
  });
  it('한 영수증에 연결 가능한 계정은 5개까지', async () => {
    const env = makeEnv({ APPLE_ROOT_CA_G3_PEM: chain.rootPem });
    const deps = { now: () => NOW };
    const jws = await signTransaction(chain, goodPayload());
    const statuses = [];
    for (let i = 0; i < 6; i++) {
      const a = await newAccount(env, deps);
      statuses.push((await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: jws }, deps })).status);
    }
    expect(statuses).toEqual([200, 200, 200, 200, 200, 422]);
  });
  it('루트 인증서가 설정되지 않으면 500', async () => {
    const env = makeEnv();
    const a = await newAccount(env);
    const r = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: 'a.b.c' } });
    expect(r.status).toBe(500);
  });
});
