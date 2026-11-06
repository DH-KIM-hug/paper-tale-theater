// 이름 바꾸기 녹음 (docs/NAME_CHANGE_PLAN.md, 규칙은 docs/SYNC_API.md '이름 바꾸기').
// 원칙: 아이 이름은 저장하지도 로그에 쓰지도 않는다. 요청마다 받아 ElevenLabs 에 보내고 mp3 를 바로 돌려준 뒤 잊는다.
// KV 에는 숫자·동화 id·실행 id 만 둔다. 쓰기를 아끼려고 계정 기록(acct:<id>) 하나에 이름 기능 상태(name)를 묶는다.
import { ApiError, E, randomToken, sha256Hex } from './util.js';
import { fill, valid, validLook, ORIGINAL, ORIGINAL_LOOK } from './name_form.js';
import { isBanned } from './banned_names.js';
import { NAME_LINES, NAME_LINES_VERSION } from './name_lines.js';

export const RUN_TTL_MS = 48 * 3600 * 1000;
export const PREVIEWS_PER_DAY = 10;
export const PER_LINE_LIMIT = 2;            // 실행 하나에서 한 줄·한 언어를 만들 수 있는 횟수(재시도 여유) → 실행당 상한 = 줄 수 × 언어 수 × 2
export const DEFAULT_DAILY_LINE_CAP = 30000; // 서버 전체 하루 상한(줄). 넘으면 busy. env.NAME_DAILY_LINE_CAP 으로 바꾼다
export const MAX_NAME_BODY = 1024;
const NAME_KEYS = ['A', 'B', 'C', 'D', 'A_en', 'B_en', 'C_en', 'D_en'];
const EL_URL = 'https://api.elevenlabs.io/v1/text-to-speech/';

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
const HOME_TALE = 'witch_candy'; // 홈 스티커 이름 줄(home)은 이 동화의 아이 이름이다. 이 동화를 설정할 때 함께 만든다
const RECORDINGS = NAME_TALES.reduce((n, t) => n + NAME_LINES[t].reduce((m, l) => m + (l.ko ? 1 : 0) + (l.enRec ? 1 : 0), 0), 0);

let catalogCache = null;
export function catalog() {
  if (catalogCache) return catalogCache;
  const tales = {};
  for (const t of NAME_TALES) {
    tales[t] = {
      lines: NAME_LINES[t].map((l) => ({
        id: l.id, key: l.key, keyEn: l.keyEn, tpl: l.tpl, en: l.en, tplEn: l.tplEn, mode: l.mode,
        seg: l.ko ? l.ko.seg : null, segEn: l.enRec ? l.enRec.seg : null,
        langs: [...(l.ko ? ['ko'] : []), ...(l.enRec ? ['en'] : [])],
        g: l.g || [], // 주인공 모습(look)에 따라 결과가 달라지는 자리(영어 대명사·모습별 목소리)
      })),
    };
  }
  catalogCache = { version: NAME_LINES_VERSION, slots: ORIGINAL, originalLook: ORIGINAL_LOOK, tales };
  return catalogCache;
}

// ---------- 계정 안의 이름 기능 상태 ----------
// 2판(docs/NAME_SETUP_V2_PLAN.md §5): { first: [첫 설정을 쓴 동화], tickets: 남은 0.99 이용권 장수, run, pv, tx }.
// 옛 기록({ used, tickets(산 누계), covered })은 읽을 때 옮긴다: 생성을 한 번이라도 했으면 first = covered,
// tickets = 산 누계 − (포함분 1회를 뺀 쓴 횟수)(남은 장수). 다음에 쓸 때 옛 필드는 사라진다.
export function nameState(rec) {
  const n = rec.name || {};
  let first, tickets;
  if (Array.isArray(n.first)) {
    first = n.first;
    tickets = Number(n.tickets) || 0;
  } else {
    const used = Number(n.used) || 0;
    first = used >= 1 && Array.isArray(n.covered) ? n.covered.filter((t) => TALE_IDS.includes(t)) : [];
    tickets = Math.max(0, (Number(n.tickets) || 0) - Math.max(0, used - 1));
  }
  let run = n.run || null; // { id, tales, exp, kind: 'first'|'ticket' } — 진행 중인 실행 하나
  if (run && !run.kind) run = { id: run.id, tales: run.tales, exp: run.exp, kind: run.backfill ? 'first' : 'ticket' };
  return {
    first,
    tickets,
    run,
    pv: n.pv || null,                    // { d: 'YYYY-MM-DD', n } 미리 듣기
    tx: Array.isArray(n.tx) ? n.tx : [], // 이 계정이 쓴 이용권 거래의 해시(삭제·연결 때 정리용)
  };
}

const day = (now) => new Date(now).toISOString().slice(0, 10);

export function quota(rec, now) {
  const n = nameState(rec);
  const owned = !!(rec.state && rec.state.owned);
  const run = n.run && n.run.exp > now ? { runId: n.run.id, tales: n.run.tales, kind: n.run.kind, expiresAt: new Date(n.run.exp).toISOString() } : null;
  return {
    owned,
    first: n.first,                                            // 첫 설정을 쓴 동화
    firstLeft: owned ? TALE_IDS.filter((t) => !n.first.includes(t)) : [], // 아직 안 쓴 동화(무료 첫 설정 가능)
    tickets: n.tickets,                                        // 남은 0.99 이용권 장수(한 장 = 네 편 한 번에)
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

async function elevenlabs(env, fetchFn, rec, text) {
  const key = env.ELEVENLABS_API_KEY;
  if (!key) {
    console.error('name_tts: ELEVENLABS_API_KEY 없음');
    throw NE.tts();
  }
  const body = JSON.stringify({ text, model_id: rec.model, voice_settings: rec.settings });
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

// 줄 하나의 보낼 글. 영어에서 이름이 비면 그 녹음에 썼던 발음 표기(예: Ee-hyun)를 쓴다. look 은 {A_g:he/she} 같은 모습 자리를 채운다.
export function sendText(line, lang, names, look) {
  const part = lang === 'ko' ? line.ko : line.enRec;
  if (!part) return null;
  const n = { ...names };
  for (const [k, v] of Object.entries(part.orig || {})) if (!n[k]) n[k] = v;
  return fill(part.send, n, look);
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
//  { tale }          그 동화의 무료 첫 설정(동화마다 1번, first 에 넣는다). witch_candy 는 홈 스티커 줄(home)도 함께.
//  { ticket: true }  0.99 이용권 1장 = 네 편 + home 을 48시간 안에 한 번에. 이용권이 없으면 no_credit.
export async function nameRun(env, me, body, now, putAccount) {
  const rec = me.rec;
  if (!rec.state.owned) throw NE.notOwned();
  const hasTale = body.tale !== undefined, hasTicket = body.ticket !== undefined;
  if (hasTale === hasTicket || (hasTicket && body.ticket !== true) || (hasTale && (typeof body.tale !== 'string' || !TALE_IDS.includes(body.tale)))) throw E.badRequest();
  const n = nameState(rec);
  const cur = activeRun(n, now);

  if (hasTicket) {
    if (cur && cur.kind === 'ticket') return runOut(cur, { resumed: true }); // 이미 도는 이용권 실행은 이어서 쓴다(이용권을 또 쓰지 않음)
    if (n.tickets < 1) throw NE.noCredit();
    const tales = [...TALE_IDS, 'home'];
    await reserveGlobal(env, now, tales.reduce((s, t) => s + NAME_LINES[t].length, 0));
    const run = { id: randomToken().slice(0, 22), tales, exp: now + RUN_TTL_MS, kind: 'ticket' };
    rec.name = { ...n, tickets: n.tickets - 1, run };
    await putAccount(env, me.id, rec);
    return runOut(run);
  }

  const tale = body.tale;
  const tales = [tale, ...(tale === HOME_TALE ? ['home'] : [])];
  if (cur && cur.kind === 'ticket' && cur.tales.includes(tale)) return runOut(cur, { resumed: true }); // 이용권 실행 안에서 이미 받을 수 있다 → 무료 첫 설정을 아끼고 그 실행을 쓴다
  if (n.first.includes(tale)) {
    // 이미 첫 설정을 쓴 동화. 그 실행이 아직 살아 있으면 이어 쓰고, 아니면 이용권이 필요하다.
    if (cur && cur.kind === 'first' && cur.tales.includes(tale)) return runOut(cur, { resumed: true });
    throw NE.noCredit();
  }
  await reserveGlobal(env, now, tales.reduce((s, t) => s + NAME_LINES[t].length, 0));
  // 진행 중인 첫 설정 실행이 있으면 같은 실행에 동화를 보태 옛 동화의 줄 받기가 끊기지 않게 한다. 그 밖에는 새 실행이 옛 실행을 대신한다.
  const run = cur && cur.kind === 'first'
    ? { id: cur.id, tales: [...new Set([...cur.tales, ...tales])], exp: now + RUN_TTL_MS, kind: 'first' }
    : { id: randomToken().slice(0, 22), tales, exp: now + RUN_TTL_MS, kind: 'first' };
  rec.name = { ...n, first: [...n.first, tale], run };
  await putAccount(env, me.id, rec);
  return runOut(run);
}

export async function nameLine(env, me, body, now, deps, cors, getAccount, putAccount) {
  const { tale, id, lang } = body;
  if (typeof tale !== 'string' || typeof id !== 'string' || (lang !== 'ko' && lang !== 'en')) throw E.badRequest();
  const line = INDEX.get(tale + '|' + id);
  if (!line) throw E.badRequest();
  const { names } = checkNames(body.names);
  const look = checkLook(body.look);
  const part = lang === 'ko' ? line.ko : line.enRec;
  if (!part) throw E.badRequest(); // 이 언어 녹음에는 이름이 없다(원래 녹음을 그대로 쓴다)
  const rec = me.rec;
  if (!rec.state.owned) throw NE.notOwned();
  const n = nameState(rec);
  const fetchFn = deps.fetch || globalThis.fetch;

  if (body.preview === true) {
    const today = day(now);
    const used = n.pv && n.pv.d === today ? n.pv.n : 0;
    if (used >= PREVIEWS_PER_DAY) throw NE.quota();
    await reserveGlobal(env, now, 1);
    const buf = await elevenlabs(env, fetchFn, { ...part, voice: voiceFor(part, look) }, sendText(line, lang, names, look));
    rec.name = { ...n, pv: { d: today, n: used + 1 } };
    await putAccount(env, me.id, rec);
    return audio(buf, cors);
  }

  if (typeof body.runId !== 'string' || !n.run || body.runId !== n.run.id) throw NE.runMissing();
  if (n.run.exp <= now) throw NE.runExpired();
  if (!n.run.tales.includes(tale)) throw NE.runMissing();
  // 줄·언어마다 카운터 키를 따로 둔다(같은 키 초당 1회 쓰기 제한을 피하고, 계정 기록을 줄마다 쓰지 않게)
  const ck = `nl:${n.run.id}:${tale}:${id}:${lang}`;
  const count = Number(await env.ACCOUNTS.get(ck)) || 0;
  if (count >= PER_LINE_LIMIT) throw NE.quota();
  const buf = await elevenlabs(env, fetchFn, { ...part, voice: voiceFor(part, look) }, sendText(line, lang, names, look));
  await env.ACCOUNTS.put(ck, String(count + 1), { expirationTtl: Math.max(60, Math.ceil((n.run.exp - now) / 1000) + 3600) });
  return audio(buf, cors);
}

export function nameCheck(body) {
  const { errors } = checkNames(body.names, { throwOnError: false });
  if (body.look != null && !validLook(body.look)) errors.look = 'invalid';
  return { ok: Object.keys(errors).length === 0, errors };
}

// 0.99 이름 바꾸기권 영수증. txKey 는 'apple:<transactionId>' 처럼 플랫폼 거래 하나.
export async function applyRenameReceipt(env, me, txKey, now, putAccount) {
  if (!me.rec.state.owned) throw NE.notOwned();
  const h = await sha256Hex('rename|' + txKey); // 거래 번호 원문은 저장하지 않는다
  const r = await env.ACCOUNTS.get('rename:' + h, 'json');
  const n = nameState(me.rec);
  if (r) {
    if (r.acct !== me.id) throw E.receiptInvalid(); // 다른 계정이 이미 쓴 거래
    return { owned: true, state: me.rec.state, quota: quota(me.rec, now), duplicate: true };
  }
  await env.ACCOUNTS.put('rename:' + h, JSON.stringify({ acct: me.id }));
  me.rec.name = { ...n, tickets: n.tickets + 1, tx: [...n.tx, h] };
  await putAccount(env, me.id, me.rec);
  return { owned: true, state: me.rec.state, quota: quota(me.rec, now) };
}

export const NAME_STATS = { tales: NAME_TALES.length, recordings: RECORDINGS };
