// 구글 Play 일회성 상품 검증: 서비스 계정 JWT → 액세스 토큰 → purchases.products.get → acknowledge.
import { b64ToBytes, bytesToB64url } from './util.js';

export class GoogleInvalid extends Error {}
export class GoogleConfigError extends Error {}
export class GoogleUpstreamError extends Error {}

const SCOPE = 'https://www.googleapis.com/auth/androidpublisher';
const API = 'https://androidpublisher.googleapis.com/androidpublisher/v3/applications';

function parseServiceAccount(json) {
  try {
    const sa = typeof json === 'string' ? JSON.parse(json) : json;
    if (!sa.client_email || !sa.private_key) throw new Error('fields');
    return sa;
  } catch {
    throw new GoogleConfigError('GOOGLE_SERVICE_ACCOUNT_JSON is missing or invalid');
  }
}

async function signJwt(sa, nowSec) {
  const enc = (o) => bytesToB64url(new TextEncoder().encode(JSON.stringify(o)));
  const head = enc({ alg: 'RS256', typ: 'JWT' });
  const body = enc({
    iss: sa.client_email,
    scope: SCOPE,
    aud: sa.token_uri || 'https://oauth2.googleapis.com/token',
    iat: nowSec,
    exp: nowSec + 3000,
  });
  const pem = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const key = await crypto.subtle.importKey('pkcs8', b64ToBytes(pem), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(head + '.' + body));
  return head + '.' + body + '.' + bytesToB64url(new Uint8Array(sig));
}

async function getAccessToken(sa, fetchFn, nowSec) {
  const assertion = await signJwt(sa, nowSec);
  const res = await fetchFn(sa.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }).toString(),
  });
  if (!res.ok) throw new GoogleConfigError('google token exchange failed: ' + res.status);
  const data = await res.json();
  if (!data.access_token) throw new GoogleConfigError('google token exchange returned no token');
  return data.access_token;
}

/**
 * 구글 구매 토큰을 검증하고(purchaseState == 0) 미확인이면 acknowledge 한다.
 * opts: { serviceAccountJson, packageName, productId, expectedProductId, purchaseToken, fetchFn, now(ms) }
 * 반환: { receiptKey }
 */
export async function verifyGooglePurchase(opts) {
  const { serviceAccountJson, packageName, productId, expectedProductId, purchaseToken, fetchFn = globalThis.fetch, now = Date.now() } = opts;
  if (typeof purchaseToken !== 'string' || !/^[A-Za-z0-9._-]{10,1000}$/.test(purchaseToken)) throw new GoogleInvalid('token');
  if (productId !== expectedProductId) throw new GoogleInvalid('product');
  const sa = parseServiceAccount(serviceAccountJson);
  const access = await getAccessToken(sa, fetchFn, Math.floor(now / 1000));
  const base = `${API}/${encodeURIComponent(packageName)}/purchases/products/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}`;
  const auth = { authorization: 'Bearer ' + access };

  const res = await fetchFn(base, { headers: auth });
  if (res.status === 400 || res.status === 404 || res.status === 410) throw new GoogleInvalid('not found');
  if (!res.ok) throw new GoogleUpstreamError('play get failed: ' + res.status);
  const p = await res.json();
  if (p.purchaseState !== 0) throw new GoogleInvalid('state'); // 0 = 구매 완료(1 취소, 2 보류)

  if (p.acknowledgementState === 0) {
    const ack = await fetchFn(base + ':acknowledge', { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: '{}' });
    if (!ack.ok) throw new GoogleUpstreamError('play acknowledge failed: ' + ack.status);
  }
  return { receiptKey: 'google:' + purchaseToken };
}
