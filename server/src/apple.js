// 애플 StoreKit 2 서명 거래(JWS) 검증. Web Crypto 만 쓴다.
// x5c 인증서 체인을 Apple Root CA G3 까지 검증하고 거래 내용을 확인한다.
import { b64ToBytes, bytesToHex } from './util.js';

export const PRODUCT_ID = 'com.papertale.theater.unlockall';
export const DEFAULT_BUNDLE_ID = 'com.papertale.theater';

export class ReceiptInvalid extends Error {}
export class ReceiptConfigError extends Error {}

// ---------- 최소 DER 읽기 ----------
function tlv(b, off) {
  if (off + 2 > b.length) throw new ReceiptInvalid('der');
  const tag = b[off];
  let len = b[off + 1];
  let hdr = 2;
  if (len & 0x80) {
    const n = len & 0x7f;
    if (n < 1 || n > 4) throw new ReceiptInvalid('der');
    len = 0;
    for (let i = 0; i < n; i++) len = len * 256 + b[off + 2 + i];
    hdr = 2 + n;
  }
  const end = off + hdr + len;
  if (end > b.length) throw new ReceiptInvalid('der');
  return { tag, off, start: off + hdr, end };
}

function kids(b, node) {
  const out = [];
  let o = node.start;
  while (o < node.end) {
    const c = tlv(b, o);
    out.push(c);
    o = c.end;
  }
  return out;
}

const hex = (b, node) => bytesToHex(b.subarray(node.start, node.end));

function parseTime(b, node) {
  const s = new TextDecoder().decode(b.subarray(node.start, node.end));
  let m;
  if (node.tag === 0x17) {
    m = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(s);
    if (!m) throw new ReceiptInvalid('time');
    const yy = Number(m[1]);
    return Date.UTC(yy >= 50 ? 1900 + yy : 2000 + yy, m[2] - 1, m[3], m[4], m[5], m[6]);
  }
  m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(s);
  if (!m) throw new ReceiptInvalid('time');
  return Date.UTC(m[1], m[2] - 1, m[3], m[4], m[5], m[6]);
}

const OID_P256 = '2a8648ce3d030107';
const OID_P384 = '2b81040022';
const OID_ECDSA_SHA256 = '2a8648ce3d040302';
const OID_ECDSA_SHA384 = '2a8648ce3d040303';
const CURVES = { [OID_P256]: { name: 'P-256', size: 32 }, [OID_P384]: { name: 'P-384', size: 48 } };
const HASHES = { [OID_ECDSA_SHA256]: 'SHA-256', [OID_ECDSA_SHA384]: 'SHA-384' };

// 애플이 발급한 인증서에만 들어 있는 확장 OID (DER: 06 0A 2A 86 48 86 F7 63 64 06 ..)
// 애플 루트는 개발자 인증서 등도 발급하므로, 영수증용 인증서인지 이 OID 로 구분한다.
const OID_RECEIPT_LEAF = [0x06, 0x0a, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x63, 0x64, 0x06, 0x0b, 0x01]; // 1.2.840.113635.100.6.11.1
const OID_WWDR_INTERMEDIATE = [0x06, 0x0a, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x63, 0x64, 0x06, 0x02, 0x01]; // 1.2.840.113635.100.6.2.1

function containsBytes(hay, needle) {
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
    return true;
  }
  return false;
}

export function parseCert(der) {
  const top = tlv(der, 0);
  const [tbs, sigAlg, sigBits] = kids(der, top);
  if (!tbs || !sigAlg || !sigBits) throw new ReceiptInvalid('cert');
  const t = kids(der, tbs);
  const i = t[0].tag === 0xa0 ? 1 : 0;
  const rest = t.slice(i);
  if (rest.length < 6) throw new ReceiptInvalid('cert');
  const [, , issuer, validity, subject, spki] = rest;
  const [nb, na] = kids(der, validity);
  const spkiKids = kids(der, spki);
  const algKids = kids(der, spkiKids[0]);
  const curve = CURVES[hex(der, algKids[1])];
  if (!curve) throw new ReceiptInvalid('curve');
  const sigAlgOid = hex(der, kids(der, sigAlg)[0]);
  const hash = HASHES[sigAlgOid];
  if (!hash) throw new ReceiptInvalid('sigalg');
  if (sigBits.tag !== 0x03 || der[sigBits.start] !== 0) throw new ReceiptInvalid('sig');
  return {
    der,
    tbs: der.subarray(tbs.off, tbs.end),
    issuer: bytesToHex(der.subarray(issuer.off, issuer.end)),
    subject: bytesToHex(der.subarray(subject.off, subject.end)),
    spki: der.subarray(spki.off, spki.end),
    notBefore: parseTime(der, nb),
    notAfter: parseTime(der, na),
    curve,
    hash,
    sigDer: der.subarray(sigBits.start + 1, sigBits.end),
  };
}

// DER ECDSA-Sig-Value(SEQUENCE{r,s}) 를 Web Crypto 의 r||s 로 바꾼다.
export function derSigToRaw(sig, size) {
  const seq = tlv(sig, 0);
  const [r, s] = kids(sig, seq);
  if (!r || !s || r.tag !== 2 || s.tag !== 2) throw new ReceiptInvalid('sig');
  const out = new Uint8Array(size * 2);
  for (const [node, base] of [[r, 0], [s, size]]) {
    let v = sig.subarray(node.start, node.end);
    while (v.length > 0 && v[0] === 0) v = v.subarray(1);
    if (v.length > size) throw new ReceiptInvalid('sig');
    out.set(v, base + size - v.length);
  }
  return out;
}

async function verifyCertSignedBy(child, parent) {
  if (child.issuer !== parent.subject) return false;
  const key = await crypto.subtle.importKey('spki', parent.spki, { name: 'ECDSA', namedCurve: parent.curve.name }, false, ['verify']);
  return crypto.subtle.verify({ name: 'ECDSA', hash: child.hash }, key, derSigToRaw(child.sigDer, parent.curve.size), child.tbs);
}

function pemToDer(pem) {
  const body = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  return b64ToBytes(body);
}

function bytesEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/**
 * 애플 서명 거래 JWS 를 검증하고 거래 정보를 돌려준다. 실패하면 ReceiptInvalid.
 * opts: { rootPem, bundleId, productId, now(ms), requireAppleOids(기본 true) }
 */
export async function verifyAppleTransaction(jws, opts) {
  const { rootPem, bundleId = DEFAULT_BUNDLE_ID, productId = PRODUCT_ID, now = Date.now(), requireAppleOids = true } = opts;
  let rootDer;
  try {
    if (!rootPem || rootPem.includes('PLACEHOLDER')) throw new Error('placeholder');
    rootDer = pemToDer(rootPem);
    parseCert(rootDer);
  } catch {
    throw new ReceiptConfigError('apple root certificate is not configured');
  }
  try {
    return await verifyInner(jws, { rootDer, bundleId, productId, now, requireAppleOids });
  } catch (e) {
    if (e instanceof ReceiptInvalid || e instanceof ReceiptConfigError) throw e;
    throw new ReceiptInvalid('malformed'); // 파싱·디코딩 오류는 모두 영수증 오류로 본다
  }
}

async function verifyInner(jws, { rootDer, bundleId, productId, now, requireAppleOids }) {
  if (typeof jws !== 'string' || jws.length > 20000) throw new ReceiptInvalid('jws');
  const parts = jws.split('.');
  if (parts.length !== 3) throw new ReceiptInvalid('jws');
  const dec = new TextDecoder();
  const header = JSON.parse(dec.decode(b64ToBytes(parts[0])));
  const payload = JSON.parse(dec.decode(b64ToBytes(parts[1])));
  if (header.alg !== 'ES256' || !Array.isArray(header.x5c) || header.x5c.length < 2 || header.x5c.length > 4) throw new ReceiptInvalid('header');

  const chain = header.x5c.map((c) => parseCert(b64ToBytes(c)));
  const root = parseCert(rootDer);

  // 사슬 끝을 고정 루트에 잇는다(x5c 에 루트가 들어 있으면 같은 인증서여야 한다).
  let last = chain[chain.length - 1];
  if (bytesEqual(last.der, rootDer)) {
    chain.pop();
    last = chain[chain.length - 1];
    if (!last) throw new ReceiptInvalid('chain');
  }
  if (!(await verifyCertSignedBy(last, root))) throw new ReceiptInvalid('root');
  for (let i = 0; i < chain.length - 1; i++) {
    if (!(await verifyCertSignedBy(chain[i], chain[i + 1]))) throw new ReceiptInvalid('chain');
  }
  // 유효 기간: 리프는 서명 시각(미래 값은 now 로 제한), 나머지는 지금.
  const signedAt = Math.min(Number(payload.signedDate) || now, now);
  const leaf = chain[0];
  if (signedAt < leaf.notBefore || signedAt > leaf.notAfter) throw new ReceiptInvalid('leaf expired');
  for (const c of [...chain.slice(1), root]) if (now < c.notBefore || now > c.notAfter) throw new ReceiptInvalid('cert expired');
  if (requireAppleOids) {
    if (!containsBytes(leaf.der, OID_RECEIPT_LEAF)) throw new ReceiptInvalid('leaf oid');
    if (chain.length < 2 || !containsBytes(chain[1].der, OID_WWDR_INTERMEDIATE)) throw new ReceiptInvalid('intermediate oid');
  }

  // JWS 서명(ES256, r||s 64바이트)
  const key = await crypto.subtle.importKey('spki', leaf.spki, { name: 'ECDSA', namedCurve: leaf.curve.name }, false, ['verify']);
  const sig = b64ToBytes(parts[2]);
  const okSig = leaf.curve.name === 'P-256' && sig.length === 64 &&
    (await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, sig, new TextEncoder().encode(parts[0] + '.' + parts[1])));
  if (!okSig) throw new ReceiptInvalid('jws signature');

  // 거래 내용
  if (payload.bundleId !== bundleId) throw new ReceiptInvalid('bundle');
  if (payload.productId !== productId) throw new ReceiptInvalid('product');
  if (payload.revocationDate != null) throw new ReceiptInvalid('revoked');
  if (payload.environment !== 'Production' && payload.environment !== 'Sandbox') throw new ReceiptInvalid('environment');
  const id = String(payload.originalTransactionId ?? payload.transactionId ?? '');
  if (!id) throw new ReceiptInvalid('transaction id');
  return { receiptKey: 'apple:' + id, environment: payload.environment };
}
