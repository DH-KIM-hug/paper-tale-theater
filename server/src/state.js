// state 검증과 합치기. 모든 필드는 합집합·최솟값이라 순서와 상관없이 같은 결과가 된다.
import { E } from './util.js';

export const ID_RE = /^[a-z0-9_]{1,40}$/;
export const CAST_RE = /^[a-z0-9_]{1,40}\.[a-z0-9_]{1,40}$/; // 캐릭터 스티커: <동화id>.<k>
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const LIMITS = { earned: 400, starUnlocked: 100, stickers: 200, waitUnlocked: 2, cast: 400 };

function validDate(s) {
  if (typeof s !== 'string' || !DATE_RE.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function emptyState(today = null) {
  return { firstRun: today, earned: {}, starUnlocked: [], stickers: [], cast: [], waitUnlocked: [], owned: false };
}

// 클라이언트가 보낸 state 를 검사하고 정규화한다. 잘못되면 bad_request.
// 빠진 필드는 빈 값으로 본다. owned 는 값이 무엇이든 읽지 않는다.
export function sanitizeClientState(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw E.badRequest();
  const out = emptyState(null);

  if (input.firstRun != null) {
    if (!validDate(input.firstRun)) throw E.badRequest();
    out.firstRun = input.firstRun;
  }
  if (input.earned != null) {
    if (typeof input.earned !== 'object' || Array.isArray(input.earned)) throw E.badRequest();
    const keys = Object.keys(input.earned);
    if (keys.length > LIMITS.earned) throw E.badRequest();
    for (const k of keys) {
      const v = input.earned[k];
      if (!validDate(k) || typeof v !== 'string' || !ID_RE.test(v)) throw E.badRequest();
      out.earned[k] = v;
    }
  }
  for (const f of ['starUnlocked', 'stickers', 'waitUnlocked']) {
    if (input[f] == null) continue;
    const arr = input[f];
    if (!Array.isArray(arr) || arr.length > LIMITS[f]) throw E.badRequest();
    for (const id of arr) if (typeof id !== 'string' || !ID_RE.test(id)) throw E.badRequest();
    out[f] = [...new Set(arr)];
  }
  if (input.cast != null) {
    const arr = input.cast;
    if (!Array.isArray(arr) || arr.length > LIMITS.cast) throw E.badRequest();
    for (const c of arr) if (typeof c !== 'string' || !CAST_RE.test(c)) throw E.badRequest();
    out.cast = [...new Set(arr)];
  }
  return out;
}

function union(a, b) {
  return [...new Set([...(a ?? []), ...(b ?? [])])]; // 옛 기록에 없는 필드도 안전하게
}

// 상한을 넘으면 사전순 앞에서 자른다(합치는 순서와 상관없이 같은 결과)
const capSorted = (arr, max) => (arr.length > max ? [...arr].sort().slice(0, max) : arr);

// a, b 모두 정규화된 state. owned 는 trustedOwned 로만 정한다(클라이언트 값 무시).
export function mergeStates(a, b, trustedOwned = false) {
  const firstRuns = [a.firstRun, b.firstRun].filter(Boolean).sort();
  const earned = { ...a.earned };
  for (const [date, id] of Object.entries(b.earned)) {
    earned[date] = date in earned && earned[date] < id ? earned[date] : id; // 같은 날짜는 사전순 앞의 id
  }
  const sortedEarned = {};
  for (const k of Object.keys(earned).sort()) sortedEarned[k] = earned[k];
  return {
    firstRun: firstRuns[0] ?? null,
    earned: sortedEarned,
    starUnlocked: union(a.starUnlocked, b.starUnlocked),
    stickers: capSorted(union(a.stickers, b.stickers), LIMITS.stickers),
    cast: capSorted(union(a.cast, b.cast), LIMITS.cast),
    waitUnlocked: union(a.waitUnlocked, b.waitUnlocked).slice(0, LIMITS.waitUnlocked),
    owned: !!trustedOwned,
  };
}
