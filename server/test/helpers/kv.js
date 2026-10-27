// 시험용 메모리 KV. 실제 KV 의 get(key, 'json')·put(expirationTtl)·delete 만 흉내 낸다.
export class FakeKV {
  constructor() {
    this.map = new Map();
  }
  async get(key, type) {
    const v = this.map.get(key);
    if (v === undefined) return null;
    return type === 'json' || (type && type.type === 'json') ? JSON.parse(v) : v;
  }
  async put(key, value) {
    this.map.set(key, String(value));
  }
  async delete(key) {
    this.map.delete(key);
  }
  keys() {
    return [...this.map.keys()];
  }
}

export function makeEnv(extra = {}) {
  return { ACCOUNTS: new FakeKV(), ...extra };
}

export function call(env, method, path, { body, auth, origin, deps } = {}) {
  return import('../../src/app.js').then(async ({ handle }) => {
    const headers = { 'content-type': 'application/json' };
    if (auth) headers.authorization = `Bearer ${auth.accountId}.${auth.token}`;
    if (origin) headers.origin = origin;
    const req = new Request('https://sync.test' + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    const res = await handle(req, env, deps);
    const text = await res.text();
    return { status: res.status, headers: res.headers, json: text ? JSON.parse(text) : null };
  });
}

export async function newAccount(env, deps) {
  const r = await call(env, 'POST', '/v1/account', { body: {}, deps });
  return { accountId: r.json.accountId, token: r.json.token };
}
