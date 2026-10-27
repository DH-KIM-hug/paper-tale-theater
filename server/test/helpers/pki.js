// 시험용 PKI: 직접 만든 키로 루트 → 중간 → 리프 인증서 사슬을 만들고 JWS 에 서명한다.
import { bytesToB64, bytesToB64url } from '../../src/util.js';

const te = new TextEncoder();
const cat = (...a) => Uint8Array.from(a.flatMap((x) => [...x]));
function len(n) {
  if (n < 128) return [n];
  const b = [];
  while (n > 0) { b.unshift(n & 255); n >>= 8; }
  return [0x80 | b.length, ...b];
}
const tlv = (tag, ...content) => { const c = cat(...content); return cat([tag, ...len(c.length)], c); };
const seq = (...c) => tlv(0x30, ...c);
const set = (...c) => tlv(0x31, ...c);
export function oid(dotted) {
  const p = dotted.split('.').map(Number);
  const out = [p[0] * 40 + p[1]];
  for (const n of p.slice(2)) {
    const t = [n & 127];
    for (let v = n >> 7; v > 0; v >>= 7) t.unshift((v & 127) | 128);
    out.push(...t);
  }
  return tlv(0x06, out);
}
const int = (bytes) => tlv(0x02, bytes[0] & 0x80 ? cat([0], bytes) : bytes);
const gtime = (ms) => tlv(0x18, te.encode(new Date(ms).toISOString().replace(/[-:T]|\.\d+/g, '')));
const name = (cn) => seq(set(seq(oid('2.5.4.3'), tlv(0x0c, te.encode(cn)))));

const ALG = {
  'SHA-256': oid('1.2.840.10045.4.3.2'),
  'SHA-384': oid('1.2.840.10045.4.3.3'),
};

function rawToDer(raw) {
  const h = raw.length / 2;
  const strip = (v) => { let i = 0; while (i < v.length - 1 && v[i] === 0) i++; return v.slice(i); };
  return seq(int(strip(raw.slice(0, h))), int(strip(raw.slice(h))));
}

export async function genKey(curve = 'P-256') {
  return crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: curve }, true, ['sign', 'verify']);
}

/**
 * 인증서 한 장을 만든다.
 * { cn, issuerCn, key(자기 키쌍), signerKey(서명 키쌍), hash, notBefore, notAfter, extOid(선택, 점 표기) }
 */
export async function makeCert({ cn, issuerCn, key, signerKey, hash, notBefore, notAfter, extOid }) {
  const spki = new Uint8Array(await crypto.subtle.exportKey('spki', key.publicKey));
  const ext = extOid
    ? tlv(0xa3, seq(seq(oid(extOid), tlv(0x04, [5, 0]))))
    : new Uint8Array();
  const tbs = seq(
    tlv(0xa0, int([2])),
    int([1, 2, 3, 4]),
    seq(ALG[hash]),
    name(issuerCn),
    seq(gtime(notBefore), gtime(notAfter)),
    name(cn),
    spki,
    ext,
  );
  const raw = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash }, signerKey.privateKey, tbs));
  const cert = seq(tbs, seq(ALG[hash]), tlv(0x03, [0], rawToDer(raw)));
  return cert;
}

export const derToPem = (der) => `-----BEGIN CERTIFICATE-----\n${bytesToB64(der).match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----`;

const NB = Date.UTC(2020, 0, 1);
const NA = Date.UTC(2040, 0, 1);

// 루트(P-384, SHA-384) → 중간(P-384, SHA-384) → 리프(P-256, SHA-256)
export async function makeChain({ leafNotAfter = NA, withOids = true } = {}) {
  const rootKey = await genKey('P-384');
  const midKey = await genKey('P-384');
  const leafKey = await genKey('P-256');
  const root = await makeCert({ cn: 'Test Root G3', issuerCn: 'Test Root G3', key: rootKey, signerKey: rootKey, hash: 'SHA-384', notBefore: NB, notAfter: NA });
  const mid = await makeCert({ cn: 'Test WWDR', issuerCn: 'Test Root G3', key: midKey, signerKey: rootKey, hash: 'SHA-384', notBefore: NB, notAfter: NA, extOid: withOids ? '1.2.840.113635.100.6.2.1' : undefined });
  const leaf = await makeCert({ cn: 'Test Leaf', issuerCn: 'Test WWDR', key: leafKey, signerKey: midKey, hash: 'SHA-256', notBefore: NB, notAfter: leafNotAfter, extOid: withOids ? '1.2.840.113635.100.6.11.1' : undefined });
  return { root, mid, leaf, rootPem: derToPem(root), leafKey, midKey, rootKey };
}

// 거래 JWS 를 만든다. x5c 는 [리프, 중간] (루트 포함은 includeRoot).
export async function signTransaction(chain, payload, { includeRoot = false, signKey, header } = {}) {
  const x5c = [chain.leaf, chain.mid, ...(includeRoot ? [chain.root] : [])].map((c) => bytesToB64(c));
  const h = bytesToB64url(te.encode(JSON.stringify(header || { alg: 'ES256', x5c })));
  const p = bytesToB64url(te.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, (signKey || chain.leafKey).privateKey, te.encode(h + '.' + p)));
  return `${h}.${p}.${bytesToB64url(sig)}`;
}

export const goodPayload = (over = {}) => ({
  bundleId: 'com.papertale.theater',
  productId: 'com.papertale.theater.unlockall',
  originalTransactionId: '1000000123456789',
  transactionId: '1000000123456789',
  environment: 'Sandbox',
  signedDate: Date.UTC(2026, 9, 27),
  ...over,
});
