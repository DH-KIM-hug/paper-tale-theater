// 종이 동화극장 연결 서버 (Cloudflare Workers + KV). 규칙은 docs/SYNC_API.md.
// 개인정보: IP·UA 는 읽지도 저장하지도 않는다. token 은 로그에 쓰지 않는다.
import { ApiError, E, jsonResponse, randomToken, sha256Hex, timingSafeEqual } from './util.js';
import { emptyState, mergeStates, sanitizeClientState } from './state.js';
import { APPLE_ROOT_CA_G3_PEM } from './apple_root.js';
import { DEFAULT_BUNDLE_ID, PRODUCT_ID, RENAME_PRODUCT_ID, ReceiptConfigError, ReceiptInvalid, verifyAppleTransaction } from './apple.js';
import { MAX_NAME_BODY, applyRenameReceipt, catalog, mergeName, nameCheck, nameLine, nameRun, nameState, quota } from './name.js';
import { GoogleConfigError, GoogleInvalid, GoogleUpstreamError, verifyGooglePurchase } from './google.js';

export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CODE_LEN = 8;
export const CODE_TTL_MS = 10 * 60 * 1000;
export const MAX_TOKENS_PER_ACCOUNT = 10;
export const MAX_ACCOUNTS_PER_RECEIPT = 5;
const MAX_BODY = 64 * 1024;
const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const STATIC_ORIGINS = ['capacitor://localhost', 'https://localhost', 'http://localhost'];

// ---------- CORS ----------
function corsHeaders(request, env) {
  const origin = request.headers.get('origin');
  if (!origin) return {};
  const allowed = [...STATIC_ORIGINS, ...String(env.WEB_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean)];
  if (!allowed.includes(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

// ---------- 저장소 ----------
const getAccount = (env, id) => env.ACCOUNTS.get('acct:' + id, 'json');
const putAccount = (env, id, rec) => env.ACCOUNTS.put('acct:' + id, JSON.stringify(rec));

async function authenticate(request, env) {
  const m = /^Bearer ([0-9a-f-]{36})\.([A-Za-z0-9_-]{20,64})$/.exec(request.headers.get('authorization') || '');
  if (!m || !ID_RE.test(m[1])) throw E.unauthorized();
  const rec = await getAccount(env, m[1]);
  if (!rec) throw E.unauthorized();
  const h = await sha256Hex(m[2]);
  // 해시 전부를 끝까지 비교해 어느 것이 맞는지 시간으로 새지 않게 한다.
  let ok = false;
  for (const stored of rec.tokenHashes) if (timingSafeEqual(stored, h)) ok = true;
  if (!ok) throw E.unauthorized();
  return { id: m[1], rec };
}

async function readJson(request, max = MAX_BODY) {
  const text = await request.text();
  if (text.length > max) throw E.badRequest();
  if (!text.trim()) return {};
  try {
    const v = JSON.parse(text);
    if (!v || typeof v !== 'object' || Array.isArray(v)) throw 0;
    return v;
  } catch {
    throw E.badRequest();
  }
}

// ---------- 속도 제한 (KV 짧은 TTL 카운터, IP 는 쓰지 않는다) ----------
export async function rateLimit(env, key, limit, windowSec, nowMs) {
  const k = `rl:${key}:${Math.floor(nowMs / 1000 / windowSec)}`;
  const count = Number(await env.ACCOUNTS.get(k)) || 0;
  if (count >= limit) throw E.rateLimited();
  await env.ACCOUNTS.put(k, String(count + 1), { expirationTtl: Math.max(60, windowSec) });
}

// ---------- 연결 코드 ----------
export function generateCode() {
  const out = [];
  const limit = 256 - (256 % CODE_ALPHABET.length); // 치우침 없이 뽑기
  while (out.length < CODE_LEN) {
    for (const b of crypto.getRandomValues(new Uint8Array(16))) {
      if (b < limit && out.length < CODE_LEN) out.push(CODE_ALPHABET[b % CODE_ALPHABET.length]);
    }
  }
  return out.join('');
}

export function normalizeCode(raw) {
  const c = String(raw).toUpperCase().replace(/[\s-]/g, '');
  return c.length === CODE_LEN && [...c].every((ch) => CODE_ALPHABET.includes(ch)) ? c : null;
}

async function newAccount(env, today) {
  const id = crypto.randomUUID();
  const token = randomToken();
  const state = emptyState(today);
  await putAccount(env, id, { tokenHashes: [await sha256Hex(token)], state, receipts: [] });
  return { accountId: id, token, state };
}

async function linkCreate(env, me, now) {
  await rateLimit(env, 'linkc:' + me.id, 10, 3600, now);
  let code;
  for (let i = 0; i < 5; i++) {
    code = generateCode();
    if (!(await env.ACCOUNTS.get('link:' + code))) break;
    code = null;
  }
  if (!code) throw E.serverError();
  const expiresAt = now + CODE_TTL_MS;
  await env.ACCOUNTS.put('link:' + code, JSON.stringify({ accountId: me.id, expiresAt }), { expirationTtl: 600 });
  return { code, expiresAt: new Date(expiresAt).toISOString() };
}

async function linkRedeem(env, me, body, now) {
  if (typeof body.code !== 'string') throw E.badRequest();
  await rateLimit(env, 'linkr:' + me.id, 5, 60, now);
  const code = normalizeCode(body.code);
  if (!code) throw E.codeInvalid();
  const rec = await env.ACCOUNTS.get('link:' + code, 'json');
  if (!rec || rec.expiresAt <= now) {
    if (rec) await env.ACCOUNTS.delete('link:' + code);
    throw E.codeInvalid();
  }
  if (rec.accountId === me.id) throw E.codeSelf(); // 자기 코드는 쓰지 않고 남겨 둔다
  const target = await getAccount(env, rec.accountId);
  await env.ACCOUNTS.delete('link:' + code); // 1회용
  if (!target) throw E.codeInvalid();

  const merged = mergeStates(target.state, me.rec.state, target.state.owned || me.rec.state.owned);
  const token = randomToken();
  const tokenHashes = [...target.tokenHashes, await sha256Hex(token)].slice(-MAX_TOKENS_PER_ACCOUNT);
  const receipts = [...new Set([...(target.receipts || []), ...(me.rec.receipts || [])])];
  const name = mergeName(target, me.rec);
  for (const h of nameState(me.rec).tx) await env.ACCOUNTS.put('rename:' + h, JSON.stringify({ acct: rec.accountId })); // 이용권 거래 기록도 옮긴다
  // 영수증 기록의 계정 목록도 옮긴다.
  for (const h of me.rec.receipts || []) {
    const r = await env.ACCOUNTS.get('receipt:' + h, 'json');
    if (!r) continue;
    r.accounts = [...new Set(r.accounts.map((a) => (a === me.id ? rec.accountId : a)))];
    await env.ACCOUNTS.put('receipt:' + h, JSON.stringify(r));
  }
  const ownedVia = target.ownedVia || me.rec.ownedVia; // 쿠폰으로 연 계정 표시도 옮긴다
  await putAccount(env, rec.accountId, { tokenHashes, state: merged, receipts, name, ...(ownedVia ? { ownedVia } : {}) });
  await env.ACCOUNTS.delete('acct:' + me.id);
  return { accountId: rec.accountId, token, state: merged };
}

async function deleteAccount(env, me) {
  for (const h of me.rec.receipts || []) {
    const r = await env.ACCOUNTS.get('receipt:' + h, 'json');
    if (!r) continue;
    r.accounts = r.accounts.filter((a) => a !== me.id);
    if (r.accounts.length) await env.ACCOUNTS.put('receipt:' + h, JSON.stringify(r));
    else await env.ACCOUNTS.delete('receipt:' + h);
  }
  // 이름 바꾸기권 거래는 계정만 지우고 '이미 쓴 거래' 표시는 남긴다(다른 계정에서 다시 쓰지 못하게).
  for (const h of nameState(me.rec).tx) await env.ACCOUNTS.put('rename:' + h, JSON.stringify({ acct: null }));
  await env.ACCOUNTS.delete('acct:' + me.id);
  // 만든 연결 코드는 10분 TTL 로 사라지고, 쓰려 하면 계정이 없어 code_invalid 가 된다.
}

// ---------- 영수증 ----------
async function applyReceipt(env, me, receiptKey) {
  const h = await sha256Hex(receiptKey); // 원본 거래 번호는 저장하지 않고 해시만 둔다
  const r = (await env.ACCOUNTS.get('receipt:' + h, 'json')) || { accounts: [] };
  if (!r.accounts.includes(me.id)) {
    if (r.accounts.length >= MAX_ACCOUNTS_PER_RECEIPT) throw E.receiptInvalid();
    r.accounts.push(me.id);
    await env.ACCOUNTS.put('receipt:' + h, JSON.stringify(r));
  }
  const rec = me.rec;
  rec.receipts = [...new Set([...(rec.receipts || []), h])];
  rec.state = { ...rec.state, owned: true };
  await putAccount(env, me.id, rec);
  return { owned: true, state: rec.state };
}

async function receiptApple(env, me, body, now) {
  if (typeof body.signedTransaction !== 'string') throw E.badRequest();
  const rootPem = env.APPLE_ROOT_CA_G3_PEM || APPLE_ROOT_CA_G3_PEM;
  let result;
  try {
    result = await verifyAppleTransaction(body.signedTransaction, {
      rootPem,
      bundleId: env.APPLE_BUNDLE_ID || DEFAULT_BUNDLE_ID,
      productId: [PRODUCT_ID, RENAME_PRODUCT_ID],
      now,
    });
  } catch (e) {
    if (e instanceof ReceiptInvalid) throw E.receiptInvalid();
    if (e instanceof ReceiptConfigError) throw logged(e);
    throw e;
  }
  if (result.productId === RENAME_PRODUCT_ID) return applyRenameReceipt(env, me, 'apple:' + result.transactionId, now, putAccount);
  return applyReceipt(env, me, result.receiptKey);
}

async function receiptGoogle(env, me, body, now, deps) {
  if (typeof body.purchaseToken !== 'string' || typeof body.productId !== 'string') throw E.badRequest();
  let result;
  try {
    result = await verifyGooglePurchase({
      serviceAccountJson: env.GOOGLE_SERVICE_ACCOUNT_JSON,
      packageName: env.PLAY_PACKAGE_NAME || DEFAULT_BUNDLE_ID,
      productId: body.productId,
      expectedProductId: body.productId === RENAME_PRODUCT_ID ? RENAME_PRODUCT_ID : PRODUCT_ID,
      purchaseToken: body.purchaseToken,
      fetchFn: deps.fetch || globalThis.fetch,
      now,
    });
  } catch (e) {
    if (e instanceof GoogleInvalid) throw E.receiptInvalid();
    if (e instanceof GoogleConfigError || e instanceof GoogleUpstreamError) throw logged(e);
    throw e;
  }
  if (body.productId === RENAME_PRODUCT_ID) return applyRenameReceipt(env, me, result.receiptKey, now, putAccount);
  return applyReceipt(env, me, result.receiptKey);
}

// ---------- 쿠폰 (개발 실험용, 심사 제출 전 COUPON_SHA256 삭제) ----------
// 비밀값 COUPON_SHA256: 쿠폰(trim·소문자)의 sha256 소문자 hex, 쉼표로 여러 개. 없으면 기능이 꺼져 404.
// 쿠폰 원문은 저장하지도 로그에 쓰지도 않는다. 맞으면 4.99 구매와 같은 state.owned 를 켠다.
export const COUPON_LIMIT = 5;
export const COUPON_WINDOW_SEC = 600;
async function couponRedeem(env, me, body, now) {
  const hashes = String(env.COUPON_SHA256 || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!hashes.length) throw new ApiError(404, 'not_found');
  if (typeof body.code !== 'string' || body.code.length > 200) throw E.badRequest();
  await rateLimit(env, 'coupon:' + me.id, COUPON_LIMIT, COUPON_WINDOW_SEC, now);
  const h = await sha256Hex(body.code.trim().toLowerCase());
  let ok = false;
  for (const stored of hashes) if (timingSafeEqual(stored, h)) ok = true; // 전부 끝까지 비교
  if (!ok) throw new ApiError(400, 'bad_coupon');
  const rec = me.rec;
  if (!rec.state.owned) rec.ownedVia = 'coupon'; // 영수증으로 이미 산 계정은 출처를 덮지 않는다
  rec.state = { ...rec.state, owned: true };
  await putAccount(env, me.id, rec);
  return { owned: true, state: rec.state };
}

// 로그에는 오류 종류와 메시지만 남긴다(요청 본문·token 은 쓰지 않는다).
function logged(e) {
  console.error('server_error:', e.name, e.message);
  return E.serverError();
}

// ---------- 라우터 ----------
export async function handle(request, env, deps = {}) {
  const now = deps.now ? deps.now() : Date.now();
  const cors = corsHeaders(request, env);
  const respond = (body, status = 200) => jsonResponse(body, status, cors);
  try {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const path = new URL(request.url).pathname.replace(/\/+$/, '');
    const route = `${request.method} ${path}`;

    if (route === 'POST /v1/account') {
      await readJson(request);
      const today = new Date(now).toISOString().slice(0, 10);
      return respond(await newAccount(env, today), 201);
    }
    if (!path.startsWith('/v1/')) throw new ApiError(404, 'not_found');
    const known = ['GET /v1/state', 'PUT /v1/state', 'POST /v1/link/create', 'POST /v1/link/redeem', 'POST /v1/receipt/apple', 'POST /v1/receipt/google', 'POST /v1/coupon', 'DELETE /v1/account',
      'GET /v1/name/catalog', 'GET /v1/name/quota', 'POST /v1/name/run', 'POST /v1/name/line', 'POST /v1/name/check'];
    if (!known.includes(route)) throw new ApiError(404, 'not_found');

    const me = await authenticate(request, env);
    switch (route) {
      case 'GET /v1/state':
        return respond({ state: me.rec.state });
      case 'PUT /v1/state': {
        const body = await readJson(request);
        const client = sanitizeClientState(body.state);
        // owned 는 서버 값만 쓴다. 클라이언트가 보낸 값은 읽지 않는다.
        me.rec.state = mergeStates(me.rec.state, client, me.rec.state.owned);
        await putAccount(env, me.id, me.rec);
        return respond({ state: me.rec.state });
      }
      case 'POST /v1/link/create':
        await readJson(request);
        return respond(await linkCreate(env, me, now));
      case 'POST /v1/link/redeem':
        return respond(await linkRedeem(env, me, await readJson(request), now));
      case 'POST /v1/receipt/apple':
        return respond(await receiptApple(env, me, await readJson(request), now));
      case 'POST /v1/receipt/google':
        return respond(await receiptGoogle(env, me, await readJson(request), now, deps));
      case 'POST /v1/coupon':
        return respond(await couponRedeem(env, me, await readJson(request, 1024), now));
      case 'GET /v1/name/catalog':
        return respond(catalog());
      case 'GET /v1/name/quota':
        return respond(quota(me.rec, now));
      case 'POST /v1/name/run':
        return respond(await nameRun(env, me, await readJson(request, MAX_NAME_BODY), now, putAccount));
      case 'POST /v1/name/line':
        return await nameLine(env, me, await readJson(request, MAX_NAME_BODY), now, deps, cors, getAccount, putAccount);
      case 'POST /v1/name/check':
        return respond(nameCheck(await readJson(request, MAX_NAME_BODY)));
      case 'DELETE /v1/account':
        await deleteAccount(env, me);
        return new Response(null, { status: 204, headers: cors });
    }
    throw new ApiError(404, 'not_found');
  } catch (e) {
    if (e instanceof ApiError) return respond({ error: e.code }, e.status);
    console.error('server_error:', e && e.name);
    return respond({ error: 'server_error' }, 500);
  }
}
