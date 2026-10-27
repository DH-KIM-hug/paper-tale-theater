// 공통 도구: 인코딩, 해시, 난수, 응답, 오류.

export class ApiError extends Error {
  constructor(status, code) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

export const E = {
  unauthorized: () => new ApiError(401, 'unauthorized'),
  badRequest: () => new ApiError(400, 'bad_request'),
  codeInvalid: () => new ApiError(404, 'code_invalid'),
  codeSelf: () => new ApiError(409, 'code_self'),
  rateLimited: () => new ApiError(429, 'rate_limited'),
  receiptInvalid: () => new ApiError(422, 'receipt_invalid'),
  serverError: () => new ApiError(500, 'server_error'),
};

export function bytesToB64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

export function bytesToB64url(bytes) {
  return bytesToB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// 표준 base64 와 base64url 둘 다 받는다.
export function b64ToBytes(str) {
  let s = String(str).replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function bytesToHex(bytes) {
  let s = '';
  for (const b of bytes) s += b.toString(16).padStart(2, '0');
  return s;
}

export async function sha256Hex(text) {
  const data = typeof text === 'string' ? new TextEncoder().encode(text) : text;
  return bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', data)));
}

export function randomToken() {
  return bytesToB64url(crypto.getRandomValues(new Uint8Array(32)));
}

// 길이가 같을 때 시간 차이로 새지 않게 비교한다.
export function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });
}
