// 이름 바꾸기 녹음 (docs/NAME_CHANGE_PLAN.md, 규칙은 docs/SYNC_API.md '이름 바꾸기').
// 원칙: 아이 이름은 저장하지도 로그에 쓰지도 않는다. 요청마다 받아 ElevenLabs 에 보내고 mp3 를 바로 돌려준 뒤 잊는다.
// KV 에는 숫자·동화 id·실행 id 만 둔다. 쓰기를 아끼려고 계정 기록(acct:<id>) 하나에 이름 기능 상태(name)를 묶는다.
import { ApiError, E, randomToken, sha256Hex } from './util.js';
import { fill, valid, validLook, ORIGINAL, ORIGINAL_LOOK } from './name_form.js';
import { isBanned } from './banned_names.js';
import { NAME_LINES, NAME_LINES_VERSION } from './name_lines.js';

export const RUN_TTL_MS = 48 * 3600 * 1000;
export const PREVIEWS_PER_DAY = 10;
// 2026-11-22 이름 조각 + 고정 조각: 서버는 줄 전체가 아니라 이름 조각(pieces[n])만 녹음한다. 상한은 모두 조각 단위.
export const PER_PIECE_LIMIT = 2;           // 실행 하나에서 이름 조각 하나·한 언어를 만들 수 있는 횟수(재시도 여유) → 실행당 상한 = 이름 조각 수 × 언어 수 × 2
export const PER_LINE_LIMIT = PER_PIECE_LIMIT; // 옛 이름(줄마다 이름 조각은 하나뿐이라 같은 값)
export const MAX_LEGACY_CHARS = 600;        // 옛 앱 요청(조각 번호 없음): 줄 전체 글 상한
export const MAX_PIECE_CHARS = 160;         // 이름 조각 보낼 글 상한(통째 줄 포함, 긴 이름 4자·12자를 넣어도 넘지 않는 값)
export const DEFAULT_DAILY_LINE_CAP = 30000; // 서버 전체 하루 상한(이름 조각 녹음 수). 넘으면 busy. env.NAME_DAILY_LINE_CAP 으로 바꾼다
export const MAX_NAME_BODY = 1024;
const NAME_KEYS = ['A', 'B', 'C', 'D', 'A_en', 'B_en', 'C_en', 'D_en'];
const EL_URL = 'https://api.elevenlabs.io/v1/text-to-speech/';
const EL_HISTORY_URL = 'https://api.elevenlabs.io/v1/history/';

export const NE = {
  notOwned: () => new ApiError(403, 'not_owned'),
  noCredit: () => new ApiError(402, 'no_credit'),
  nameInvalid: () => new ApiError(400, 'name_invalid'),
  nameBanned: () => new ApiError(400, 'name_banned'),
  lookInvalid: () => new ApiError(400, 'look_invalid'),
  runMissing: () => new ApiError(404, 'run_invalid'),
  runExpired: () => new ApiError(410, 'run_invalid'),
  quota: () => new ApiError(429, 'quota_exceeded'),
  tts: () => new ApiError(502, 'tts_failed'),
  busy: () => new ApiError(503, 'busy'),
};

// ---------- 템플릿 색인 ----------
const INDEX = new Map(); // `${tale}|${id}` → line
for (const [tale, lines] of Object.entries(NAME_LINES)) for (const l of lines) INDEX.set(tale + '|' + l.id, l);
export const NAME_TALES = Object.keys(NAME_LINES);
const TALE_IDS = NAME_TALES.filter((t) => t !== 'home');
// 2026-11-24 사용자 결정(새 창작 동화 규칙): 출시 때의 네 편. 이 목록에 없는 창작 동화가 name_lines.js 에 들어오면 '새 동화'다.
// 자격(eligible: '모든 동화 열기'를 샀거나 변경권을 사거나 받은 적 있음)이 있고 covered 에 그 동화가 없으면,
// 그 새 동화만 대상으로 하는 실행(kind 'new')을 변경권 없이 한 번 만들 수 있다. 출시 네 편은 언제나 변경권이 필요하다.
export const LAUNCH_TALES = ['kkultteok', 'red_car', 'unicorn', 'witch_candy'];
const NEW_TALES = TALE_IDS.filter((t) => !LAUNCH_TALES.includes(t));
const hasPiece = (p) => !!(p && p.n != null && p.pieces && p.pieces[p.n]);
const piecesOf = (t) => NAME_LINES[t].reduce((m, l) => m + (hasPiece(l.ko) ? 1 : 0) + (hasPiece(l.enRec) ? 1 : 0), 0);
const RECORDINGS = NAME_TALES.reduce((n, t) => n + piecesOf(t), 0);
// 앱에 내보낼 조각 모양(목소리 등 녹음 내부 값은 빼고): 고정 조각 주소(앱 묶음)·간격·이름 조각 자리
const pubPieces = (p) => (p ? p.pieces.map((x) => ({ k: x.k, tpl: x.tpl, ...(x.gap != null ? { gap: x.gap } : {}), ...(x.url ? { url: x.url } : {}), ...(x.urls ? { urls: x.urls } : {}), ...(x.slots ? { slots: x.slots, g: x.g || [] } : {}) })) : null);

let catalogCache = null;
export function catalog() {
  if (catalogCache) return catalogCache;
  const tales = {};
  for (const t of NAME_TALES) {
    tales[t] = {
      lines: NAME_LINES[t].map((l) => ({
        id: l.id, key: l.key, keyEn: l.keyEn, tpl: l.tpl, en: l.en, tplEn: l.tplEn, mode: l.mode,
        seg: l.ko ? l.ko.seg : null, segEn: l.enRec ? l.enRec.seg : null,
        langs: [...(hasPiece(l.ko) ? ['ko'] : []), ...(hasPiece(l.enRec) ? ['en'] : [])], // 서버가 이름 조각을 녹음하는 언어
        pieces: pubPieces(l.ko), piecesEn: pubPieces(l.enRec),
        n: l.ko ? l.ko.n : null, nEn: l.enRec ? l.enRec.n : null,
        g: l.g || [], // 주인공 모습(look)에 따라 결과가 달라지는 자리(영어 대명사·모습별 목소리)
      })),
    };
  }
  catalogCache = { version: NAME_LINES_VERSION, slots: ORIGINAL, originalLook: ORIGINAL_LOOK, tales };
  return catalogCache;
}

// ---------- 계정 안의 이름 기능 상태 ----------
// 2판(docs/NAME_SETUP_V2_PLAN.md §5): { first: [첫 설정을 쓴 동화], tickets: 남은 아이 이름 변경권(1.99) 장수, run, pv, tx, eligible, covered }.
// 2026-11-24: 동화마다 무료 첫 설정을 없앴다. first 는 예전 기록을 깨지 않게 읽고 합치기만 하고 새로 늘리지 않는다.
// 2026-11-24: eligible = 변경권을 사거나 받은 적 있음(구매 owned 도 자격으로 친다), covered = 실행을 만들 때 대상이던 동화(이름이 아니라 동화 id 만).
// 옛 기록에 covered 가 없으면 first 를 covered 로 읽는다.
// 옛 기록({ used, tickets(산 누계), covered })은 읽을 때 옮긴다: 생성을 한 번이라도 했으면 first = covered,
// tickets = 산 누계 − (포함분 1회를 뺀 쓴 횟수)(남은 장수). 다음에 쓸 때 옛 필드는 사라진다.
export function nameState(rec) {
  const n = rec.name || {};
  let first, tickets, covered;
  if (Array.isArray(n.first)) {
    first = n.first;
    tickets = Number(n.tickets) || 0;
    covered = Array.isArray(n.covered) ? n.covered : first;
  } else {
    const used = Number(n.used) || 0;
    first = used >= 1 && Array.isArray(n.covered) ? n.covered.filter((t) => TALE_IDS.includes(t)) : [];
    tickets = Math.max(0, (Number(n.tickets) || 0) - Math.max(0, used - 1));
    covered = first;
  }
  let run = n.run || null; // { id, tales, exp, kind: 'ticket'|'new'|'first'(예전 서버) } 진행 중인 실행 하나
  if (run && !run.kind) run = { id: run.id, tales: run.tales, exp: run.exp, kind: run.backfill ? 'first' : 'ticket' };
  return {
    first,
    tickets,
    run,
    pv: n.pv || null,                    // { d: 'YYYY-MM-DD', n } 미리 듣기
    tx: Array.isArray(n.tx) ? n.tx : [], // 이 계정이 쓴 이용권 거래의 해시(삭제·연결 때 정리용)
    eligible: n.eligible === true || tickets > 0 || (Array.isArray(n.tx) && n.tx.length > 0),
    covered,
  };
}
// 변경권 없이 이름을 넣을 수 있는 새 창작 동화(지금은 빈 목록)
export function newFreeTales(rec, newTales = NEW_TALES) {
  const n = nameState(rec);
  if (!n.eligible && !(rec.state && rec.state.owned)) return [];
  return newTales.filter((t) => !n.covered.includes(t));
}

const day = (now) => new Date(now).toISOString().slice(0, 10);

export function quota(rec, now) {
  const n = nameState(rec);
  const owned = !!(rec.state && rec.state.owned);
  const run = n.run && n.run.exp > now ? { runId: n.run.id, tales: n.run.tales, kind: n.run.kind, expiresAt: new Date(n.run.exp).toISOString() } : null;
  return {
    owned,
    first: n.first,                                            // 첫 설정을 쓴 동화
    firstLeft: [],                                             // 2026-11-24 무료 첫 설정 없앰. 옛 앱 빌드가 읽어도 깨지지 않게 빈 목록으로 둔다
    tickets: n.tickets,                                        // 남은 아이 이름 변경권(1.99) 장수(한 장 = 네 편 한 번에)
    newFree: newFreeTales(rec),                                // 2026-11-24 새 창작 동화 무료 설정 1번(지금은 빈 목록)
    activeRun: run,
    previewsLeftToday: Math.max(0, PREVIEWS_PER_DAY - (n.pv && n.pv.d === day(now) ? n.pv.n : 0)),
  };
}

// 연결 코드로 두 계정을 합칠 때(target 이 남는다).
export function mergeName(target, other) {
  const a = nameState(target), b = nameState(other);
  return {
    first: [...new Set([...a.first, ...b.first])],
    tickets: a.tickets + b.tickets,
    run: a.run,
    pv: a.pv,
    tx: [...new Set([...a.tx, ...b.tx])],
    eligible: a.eligible || b.eligible,
    covered: [...new Set([...a.covered, ...b.covered])],
  };
}

// ---------- 서버 전체 하루 상한 ----------
async function reserveGlobal(env, now, n) {
  const cap = Number(env.NAME_DAILY_LINE_CAP) || DEFAULT_DAILY_LINE_CAP;
  const k = 'nglob:' + day(now);
  const used = Number(await env.ACCOUNTS.get(k)) || 0;
  if (used + n > cap) throw NE.busy();
  try {
    await env.ACCOUNTS.put(k, String(used + n), { expirationTtl: 2 * 86400 });
  } catch {
    // 같은 키 동시 쓰기 제한 등으로 실패해도 요청은 계속한다(상한은 대략값이면 충분).
  }
}

// ---------- 이름 검사 ----------
// names 를 검사해 깨끗한 객체를 돌려준다. 빈 글·없는 자리는 원래 이름을 쓴다(fill 이 처리).
export function checkNames(names, { throwOnError = true } = {}) {
  if (names == null) names = {};
  if (typeof names !== 'object' || Array.isArray(names)) throw E.badRequest();
  const out = {};
  const errors = {};
  for (const [k, v] of Object.entries(names)) {
    if (!NAME_KEYS.includes(k)) throw E.badRequest();
    if (v == null || v === '') continue;
    const lang = k.endsWith('_en') ? 'en' : 'ko';
    if (typeof v !== 'string' || !valid(v, lang)) errors[k] = 'invalid';
    else if (isBanned(v, lang)) errors[k] = 'banned';
    else out[k] = v;
  }
  if (throwOnError) {
    const vals = Object.values(errors);
    if (vals.includes('invalid')) throw NE.nameInvalid();
    if (vals.includes('banned')) throw NE.nameBanned();
  }
  return { names: out, errors };
}

// look: { A?, B?, C? } 각각 'b'(남자아이) | 'g'(여자아이). 없으면 원래 모습. 저장하지 않는다.
export function checkLook(look) {
  if (look == null) return {};
  if (!validLook(look)) throw NE.lookInvalid();
  return look;
}

// ---------- ElevenLabs ----------
let zeroRetention = true; // 요금제가 enable_logging=false 를 받지 않으면 한 번 실패한 뒤 끈다(이 isolate 동안)

export function _resetZeroRetention() {
  zeroRetention = true;
}

// 생성 기록 지우기: 요금제가 enable_logging=false 를 받지 않으면 ElevenLabs 가 기록(History)에 글을 남긴다.
// 응답 헤더 history-item-id 가 있으면 음성을 받자마자 DELETE /v1/history/{id}. 실패해도 요청은 실패시키지 않는다(키·글은 로그에 쓰지 않음).
// 2026-11-22 실측: 음성을 받은 바로 그 순간에는 기록이 아직 없어 404 가 나고, 1~2초 뒤에는 지워진다 → 404 면 잠깐 기다렸다 다시 지운다.
let historyRetryDelays = [1500, 4000];
export function _setHistoryRetryDelays(d) {
  historyRetryDelays = d;
}
async function deleteHistory(env, fetchFn, id) {
  for (let i = 0; ; i++) {
    try {
      const res = await fetchFn(EL_HISTORY_URL + encodeURIComponent(id), { method: 'DELETE', headers: { 'xi-api-key': env.ELEVENLABS_API_KEY } });
      if (res.ok) return;
      if (res.status !== 404 || i >= historyRetryDelays.length) {
        console.error('name_tts: history delete', res.status);
        return;
      }
    } catch {
      console.error('name_tts: history delete network');
      return;
    }
    await new Promise((r) => setTimeout(r, historyRetryDelays[i]));
  }
}

async function elevenlabs(env, fetchFn, rec, text, waitUntil, ctx) {
  const key = env.ELEVENLABS_API_KEY;
  if (!key) {
    console.error('name_tts: ELEVENLABS_API_KEY 없음');
    throw NE.tts();
  }
  const c = ctx || {};
  if (typeof text !== 'string' || !text || text.length > (c.legacy ? MAX_LEGACY_CHARS : MAX_PIECE_CHARS)) throw E.badRequest();
  const body = JSON.stringify({
    text, model_id: rec.model, voice_settings: rec.settings,
    ...(c.prev ? { previous_text: c.prev } : {}), ...(c.next ? { next_text: c.next } : {}), ...(c.lang === 'en' ? { language_code: 'en' } : {}),
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    const url = EL_URL + encodeURIComponent(rec.voice) + '?output_format=mp3_44100_128' + (zeroRetention ? '&enable_logging=false' : '');
    let res;
    try {
      res = await fetchFn(url, { method: 'POST', headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' }, body });
    } catch {
      console.error('name_tts: network');
      continue;
    }
    if (res.ok) {
      const buf = await res.arrayBuffer();
      const hid = res.headers && res.headers.get && res.headers.get('history-item-id');
      if (hid && /^[A-Za-z0-9_-]{1,128}$/.test(hid)) {
        const p = deleteHistory(env, fetchFn, hid);
        if (waitUntil) waitUntil(p);
        else await p;
      }
      if (buf.byteLength < 100) throw NE.tts();
      return buf;
    }
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 400);
    } catch {}
    // zero retention 을 못 쓰는 요금제: 그 옵션만 빼고 다시 보낸다.
    if (zeroRetention && res.status >= 400 && res.status < 500 && res.status !== 429 && /logging|retention|enterprise/i.test(detail)) {
      console.error('name_tts: enable_logging=false 미지원, 옵션을 빼고 다시 보냄', res.status);
      zeroRetention = false;
      continue;
    }
    console.error('name_tts: upstream', res.status); // 본문·글은 쓰지 않는다(이름이 들어 있을 수 있다)
    if (res.status === 429 || res.status >= 500) {
      if (attempt < 2) await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      continue;
    }
    break;
  }
  throw NE.tts();
}

// 줄 하나의 이름 조각 보낼 글. 영어에서 이름이 비면 그 녹음에 썼던 발음 표기(예: Ee-hyun)를 쓴다. look 은 {A_g:he/she} 같은 모습 자리를 채운다.
const withOrig = (part, names) => { const n = { ...names }; for (const [k, v] of Object.entries(part.orig || {})) if (!n[k]) n[k] = v; return n; };
export function sendText(line, lang, names, look) {
  const part = lang === 'ko' ? line.ko : line.enRec;
  if (!hasPiece(part)) return null;
  return fill(part.send, withOrig(part, names), look);
}

// 이름 조각의 앞뒤 문맥(차감 없음): 나눈 줄은 [말투 태그] + 앞 조각 글 → previous_text, 뒤 조각 글 → next_text. 통째 줄은 문맥 없음.
// K(다른 배역 조각)도 글을 문맥으로 넣는다(녹음 때와 같게).
export function contextOf(line, lang, names, look) {
  const part = lang === 'ko' ? line.ko : line.enRec;
  if (!hasPiece(part)) return null;
  if (part.whole) return { lang };
  const n = withOrig(part, names);
  const txt = (x) => (x.k === 'K' ? x.tpl : fill(x.tpl, n, look));
  const before = part.pieces.slice(0, part.n).map(txt).join(' ');
  const after = part.pieces.slice(part.n + 1).map(txt).join(' ');
  return { prev: [part.tag, before].filter(Boolean).join(' ').trim() || null, next: after || null, lang };
}

// 옛 앱 호환(2026-11-22): 조각 번호(piece)가 없는 요청은 이름 조각 나눔 이전 앱 빌드다. 그 앱은 받은 녹음 한 개를 줄 전체로 쓰므로
// 줄 전체(말투 태그 + 이름 조각·고정 조각 글, 다른 배역 조각 제외)를 한 번에 녹음해 돌려준다. 옛 sendText 와 같은 글.
export function legacyText(line, lang, names, look) {
  const part = lang === 'ko' ? line.ko : line.enRec;
  if (!hasPiece(part)) return null;
  const n = withOrig(part, names);
  if (part.whole) return fill(part.send, n, look);
  return [part.tag, ...part.pieces.filter((x) => x.k !== 'K').map((x) => fill(x.tpl, n, look))].filter(Boolean).join(' ').trim();
}

// 보낼 목소리. 이름이 든 아이 대사는 그 아이의 모습(part.look.slot)에 맞는 목소리 id(part.look.voices) 로 만든다. 없으면 원래 목소리.
export function voiceFor(part, look) {
  const lk = part.look;
  if (!lk) return part.voice;
  const m = (look && look[lk.slot]) || ORIGINAL_LOOK[lk.slot];
  return (lk.voices && lk.voices[m]) || part.voice;
}

// ---------- 엔드포인트 ----------
function audio(buf, cors) {
  return new Response(buf, {
    status: 200,
    headers: {
      'content-type': 'audio/mpeg',
      'cache-control': 'no-store',
      'x-name-version': NAME_LINES_VERSION,
      ...cors,
      ...(cors['access-control-allow-origin'] ? { 'access-control-expose-headers': 'x-name-version' } : {}),
    },
  });
}

const activeRun = (n, now) => (n.run && n.run.exp > now ? n.run : null);
const runOut = (run, extra) => ({ runId: run.id, tales: run.tales, kind: run.kind, expiresAt: new Date(run.exp).toISOString(), ...extra });

// 실행 만들기(2판).
//  { ticket: true }  아이 이름 변경권(1.99) 1장 = 네 편 + home 을 48시간 안에 한 번에. 이용권이 없으면 no_credit.
//  { tale }          도는 실행 이어 받기, 또는 새 창작 동화(출시 네 편 밖)의 무료 설정 1번(kind 'new', 아래).
// 2026-11-22 A안: 이용권은 '모든 동화 열기'를 사지 않은 계정도 사고 쓴다.
// 2026-11-24: 구매자와 아닌 사람의 흐름이 같다. '모든 동화 열기' 구매 = 변경권 1장(원 거래마다 한 번).
export async function nameRun(env, me, body, now, putAccount) {
  const rec = me.rec;
  const hasTale = body.tale !== undefined, hasTicket = body.ticket !== undefined;
  if (hasTale === hasTicket || (hasTicket && body.ticket !== true) || (hasTale && (typeof body.tale !== 'string' || !TALE_IDS.includes(body.tale)))) throw E.badRequest();
  const n = nameState(rec);
  const cur = activeRun(n, now);

  if (hasTicket) {
    if (cur && cur.kind === 'ticket') return runOut(cur, { resumed: true }); // 이미 도는 이용권 실행은 이어서 쓴다(이용권을 또 쓰지 않음)
    if (n.tickets < 1) throw NE.noCredit();
    const tales = [...TALE_IDS, 'home'];
    await reserveGlobal(env, now, tales.reduce((s, t) => s + piecesOf(t), 0));
    const run = { id: randomToken().slice(0, 22), tales, exp: now + RUN_TTL_MS, kind: 'ticket' };
    rec.name = { ...n, tickets: n.tickets - 1, run, eligible: true, covered: [...new Set([...n.covered, ...TALE_IDS])] };
    await putAccount(env, me.id, rec);
    return runOut(run);
  }

  // 2026-11-24 사용자 결정: 동화마다 무료 첫 설정은 없앴다. '모든 동화 열기'에는 변경권 1장이 들어 있다(app.js applyReceipt).
  // { tale } 은 도는 실행을 이어 받거나(이용권 실행, 새 동화 실행, 예전 서버가 만든 첫 설정 실행 kind 'first' 는 구매가 있을 때),
  // 새 창작 동화의 무료 설정 1번에만 쓴다. 출시 네 편은 새 실행을 만들지 않고 변경권이 필요하다(402 no_credit).
  const tale = body.tale;
  if (cur && cur.kind === 'ticket' && cur.tales.includes(tale)) return runOut(cur, { resumed: true });
  if (cur && cur.kind === 'first' && cur.tales.includes(tale) && rec.state.owned) return runOut(cur, { resumed: true });
  if (cur && cur.kind === 'new' && cur.tales.includes(tale)) return runOut(cur, { resumed: true });
  // 새 창작 동화(출시 네 편 밖) 무료 설정 1번. 그 동화 하나만 대상이다(출시 동화는 여기로 오지 못한다).
  if (newFreeTales(rec).includes(tale)) {
    await reserveGlobal(env, now, piecesOf(tale));
    // 도는 'new' 실행이 있으면 같은 실행에 보태 앞 동화의 줄 받기가 끊기지 않게 한다. 이용권 실행 중이면 그 실행에 이미 들어 있다(위).
    const run = cur && cur.kind === 'new'
      ? { id: cur.id, tales: [...new Set([...cur.tales, tale])], exp: now + RUN_TTL_MS, kind: 'new' }
      : { id: randomToken().slice(0, 22), tales: [tale], exp: now + RUN_TTL_MS, kind: 'new' };
    rec.name = { ...n, run, covered: [...new Set([...n.covered, tale])] };
    await putAccount(env, me.id, rec);
    return runOut(run);
  }
  throw NE.noCredit();
}

export async function nameLine(env, me, body, now, deps, cors, getAccount, putAccount) {
  const { tale, id, lang } = body;
  if (typeof tale !== 'string' || typeof id !== 'string' || (lang !== 'ko' && lang !== 'en')) throw E.badRequest();
  const line = INDEX.get(tale + '|' + id);
  if (!line) throw E.badRequest();
  const { names } = checkNames(body.names);
  const look = checkLook(body.look);
  const part = lang === 'ko' ? line.ko : line.enRec;
  if (!hasPiece(part)) throw E.badRequest(); // 이 언어에는 이름 조각이 없다(원래 녹음·앱 묶음 대명사 두 벌을 쓴다)
  if (body.piece !== undefined && body.piece !== part.n) throw E.badRequest(); // 조각 번호를 주면 이름 조각 번호와 같아야 한다
  const legacy = body.piece === undefined; // 옛 앱 빌드: 줄 전체를 녹음해 돌려준다(legacyText)
  const textOf = () => (legacy ? legacyText(line, lang, names, look) : sendText(line, lang, names, look));
  const ctxOf = () => (legacy ? { legacy: true } : contextOf(line, lang, names, look));
  const rec = me.rec;
  const n = nameState(rec);
  const fetchFn = deps.fetch || globalThis.fetch;

  if (body.preview === true) {
    // 미리 듣기: 구매(owned)했거나, 이용권이 남았거나, 이용권 실행 중일 때만(아무것도 사지 않은 계정의 무료 생성을 막는다)
    const cur = activeRun(n, now);
    if (!rec.state.owned && n.tickets < 1 && !(cur && (cur.kind === 'ticket' || cur.kind === 'new')) && !newFreeTales(rec).length) throw NE.notOwned();
    const today = day(now);
    const used = n.pv && n.pv.d === today ? n.pv.n : 0;
    if (used >= PREVIEWS_PER_DAY) throw NE.quota();
    await reserveGlobal(env, now, 1);
    const buf = await elevenlabs(env, fetchFn, { ...part, voice: voiceFor(part, look) }, textOf(), deps.waitUntil, ctxOf());
    rec.name = { ...n, pv: { d: today, n: used + 1 } };
    await putAccount(env, me.id, rec);
    return audio(buf, cors);
  }

  if (typeof body.runId !== 'string' || !n.run || body.runId !== n.run.id) throw NE.runMissing();
  if (n.run.exp <= now) throw NE.runExpired();
  if (!n.run.tales.includes(tale)) throw NE.runMissing();
  if (n.run.kind === 'first' && !rec.state.owned) throw NE.notOwned(); // 예전 서버가 만든 첫 설정 실행은 구매가 있어야 한다(환불 등)
  // 이름 조각·언어마다 카운터 키를 따로 둔다(같은 키 초당 1회 쓰기 제한을 피하고, 계정 기록을 조각마다 쓰지 않게)
  const ck = `nl:${n.run.id}:${tale}:${id}:${lang}:${part.n}`;
  const count = Number(await env.ACCOUNTS.get(ck)) || 0;
  if (count >= PER_PIECE_LIMIT) throw NE.quota();
  const buf = await elevenlabs(env, fetchFn, { ...part, voice: voiceFor(part, look) }, textOf(), deps.waitUntil, ctxOf());
  await env.ACCOUNTS.put(ck, String(count + 1), { expirationTtl: Math.max(60, Math.ceil((n.run.exp - now) / 1000) + 3600) });
  return audio(buf, cors);
}

export function nameCheck(body) {
  const { errors } = checkNames(body.names, { throwOnError: false });
  if (body.look != null && !validLook(body.look)) errors.look = 'invalid';
  return { ok: Object.keys(errors).length === 0, errors };
}

// 아이 이름 변경권(1.99) 영수증. txKey 는 'apple:<transactionId>' 처럼 플랫폼 거래 하나.
// 2026-11-22 A안: 구매(owned)와 상관없이 누구나 산다. 응답의 owned 는 계정의 실제 구매 여부다(이용권이 전체 구매를 열지 않는다).
export async function applyRenameReceipt(env, me, txKey, now, putAccount) {
  const owned = !!me.rec.state.owned;
  const h = await sha256Hex('rename|' + txKey); // 거래 번호 원문은 저장하지 않는다
  const r = await env.ACCOUNTS.get('rename:' + h, 'json');
  const n = nameState(me.rec);
  if (r) {
    if (r.acct !== me.id) throw E.receiptInvalid(); // 다른 계정이 이미 쓴 거래
    return { owned, state: me.rec.state, quota: quota(me.rec, now), duplicate: true };
  }
  await env.ACCOUNTS.put('rename:' + h, JSON.stringify({ acct: me.id }));
  me.rec.name = { ...n, tickets: n.tickets + 1, tx: [...n.tx, h], eligible: true };
  await putAccount(env, me.id, me.rec);
  return { owned, state: me.rec.state, quota: quota(me.rec, now) };
}

export const NAME_STATS = { tales: NAME_TALES.length, recordings: RECORDINGS }; // recordings = 이름 조각 수(언어별)
