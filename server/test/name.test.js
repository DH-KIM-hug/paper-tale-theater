import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fill, hasBatchim, valid, ORIGINAL } from '../src/name_form.js';
import { NAME_LINES, NAME_LINES_VERSION } from '../src/name_lines.js';
import { _resetZeroRetention } from '../src/name.js';
import { isBanned } from '../src/banned_names.js';
import { handle } from '../src/app.js';
import { goodPayload, makeChain, signTransaction } from './helpers/pki.js';
import { call, makeEnv, newAccount } from './helpers/kv.js';

const NOW = Date.UTC(2026, 10, 6, 3);
const KEY = 'test-el-key';

// ---------- 받침 시험표 (docs/NAME_CHANGE_PLAN.md 부록 B + 강아지·ㄹ·영어) ----------
// [템플릿, 이름들, 기대]
const TABLE = [
  ['{A:이는/는}', { A: '지민' }, '지민이는'],
  ['{A:이는/는}', { A: '서아' }, '서아는'],
  ['{A:이가/가}', { A: '도윤' }, '도윤이가'],
  ['{A:이가/가}', { A: '하루' }, '하루가'],
  ['{A:이/} 발이', { A: '지민' }, '지민이 발이'],
  ['{A:이/} 발이', { A: '서아' }, '서아 발이'],
  ['{A:이와/와} {B:이가/가}', { A: '지민', B: '서아' }, '지민이와 서아가'],
  ['{C:이는/는}', { C: '지민' }, '지민이는'],
  ['{C:이가/가}', { C: '서아' }, '서아가'],
  ['{A:이한테/한테}', { A: '서아' }, '서아한테'],
  ['{A:이에게/에게}', { A: '지민' }, '지민이에게'],
  ['{A:이의/의}', { A: '하루' }, '하루의'],
  ['{A:이랑/랑}', { A: '지민' }, '지민이랑'],
  ['{B:이도/도}', { B: '서아' }, '서아도'],
  ['{B:아/야}, 안녕!', { B: '지민' }, '지민아, 안녕!'],
  ['{B:아/야}, 안녕!', { B: '서아' }, '서아야, 안녕!'],
  ['{A:이/}(꼬마 마법사)', { A: '지민' }, '지민이(꼬마 마법사)'],
  ['딸기 {A:이/}', { A: '서아' }, '딸기 서아'],
  ['{A_en}', { A_en: 'Jimin' }, 'Jimin'],
  // 자리 비움 → 원래 이름
  ['{A:이는/는} {C:이가/가} {D:이랑/랑}', {}, '다현이는 은우가 꿀떡이랑'],
  ['{A_en} {B_en}', { A_en: '' }, 'Dahyun Ihyun'],
  // 강아지(원래 '꿀떡이' = 꿀떡 + 이)
  ['{D:이는/는} 킁킁.', { D: '초코' }, '초코는 킁킁.'],
  ['{D:이가/가} 다가가요.', { D: '초코' }, '초코가 다가가요.'],
  ['{D:이가/가} 다가가요.', { D: '콩' }, '콩이가 다가가요.'],
  ['"{D:아/야}, 같이 가!"', { D: '콩' }, '"콩아, 같이 가!"'],
  ['"{D:아/야}, 같이 가!"', { D: '초코' }, '"초코야, 같이 가!"'],
  ['{D:이/} 꼬리가', { D: '보리' }, '보리 꼬리가'],
  ['{D:이랑/랑}', { D: '보리' }, '보리랑'],
  ['{D_en} wags.', { D_en: 'Choco' }, 'Choco wags.'],
  // ㄹ 받침 + 으로/로
  ['{A:으로/로}', { A: '하늘' }, '하늘로'],
  ['{A:으로/로}', { A: '지민' }, '지민으로'],
  ['{A:으로/로}', { A: '서아' }, '서아로'],
  ['{A:이는/는}', { A: '하늘' }, '하늘이는'],
];

function loadEngineNameForm() {
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(new URL('../../engine/name_form.js', import.meta.url), 'utf8'), ctx);
  return ctx.window.NameForm;
}

describe('받침 함수(서버·앱 같은 결과)', () => {
  const engine = loadEngineNameForm();
  it('시험표 전부 통과(서버)', () => {
    for (const [tpl, names, want] of TABLE) expect(fill(tpl, names), tpl + JSON.stringify(names)).toBe(want);
  });
  it('시험표 전부 통과(앱 engine/name_form.js)', () => {
    for (const [tpl, names, want] of TABLE) expect(engine.fill(tpl, names), tpl + JSON.stringify(names)).toBe(want);
  });
  it('받침 판정·형식 검사', () => {
    expect(hasBatchim('다현')).toBe(true);
    expect(hasBatchim('은우')).toBe(false);
    expect(hasBatchim('꿀떡')).toBe(true);
    expect(hasBatchim('Seoa')).toBe(false); // 한글이 아닌 끝 글자는 받침 없음
    expect(hasBatchim('')).toBe(false);
    expect(valid('서아', 'ko')).toBe(true);
    expect(valid('가', 'ko')).toBe(true);
    expect(valid('가나다라마', 'ko')).toBe(false);
    expect(valid('서 아', 'ko')).toBe(false);
    expect(valid('ㅅㅇ', 'ko')).toBe(false);
    expect(valid('Seoa', 'en')).toBe(true);
    expect(valid('Abcdefghijklm', 'en')).toBe(false);
    expect(valid('Seo-a', 'en')).toBe(false);
    expect(valid('서아', 'en')).toBe(false);
    for (const [n, l] of [['서아', 'ko'], ['Seoa', 'en'], ['가나다라마', 'ko'], [5, 'ko']]) expect(engine.valid(n, l)).toBe(valid(n, l));
    expect(engine.hasBatchim('꿀떡')).toBe(true);
    expect(JSON.stringify(engine.ORIGINAL)).toBe(JSON.stringify(ORIGINAL));
  });
  it('모든 템플릿 줄에서 서버·앱 결과가 같고, 원래 이름으로 채우면 원문이 된다', () => {
    const sets = [{}, { A: '서아', B: '지민', C: '하늘', D: '초코', A_en: 'Seoa', B_en: 'Jimin', C_en: 'Haneul', D_en: 'Choco' }, { A: '콩', D: '보리', B_en: 'Max' }];
    for (const [tale, lines] of Object.entries(NAME_LINES)) {
      for (const l of lines) {
        expect(fill(l.tpl, {})).toBe(l.key);
        expect(fill(l.tplEn, {})).toBe(l.en);
        for (const s of sets) {
          for (const t of [l.tpl, l.tplEn, l.ko && l.ko.send, l.enRec && l.enRec.send].filter(Boolean)) {
            const out = fill(t, s);
            expect(out, tale + l.id).toBe(engine.fill(t, s));
            expect(out).not.toMatch(/[{}]/);
          }
        }
      }
    }
  });
});

describe('템플릿 파일', () => {
  it('동화 4편 + home, 줄 수', () => {
    expect(Object.keys(NAME_LINES).sort()).toEqual(['home', 'kkultteok', 'red_car', 'unicorn', 'witch_candy']);
    const counts = Object.fromEntries(Object.entries(NAME_LINES).map(([t, l]) => [t, l.length]));
    expect(counts).toEqual({ kkultteok: 46, red_car: 22, unicorn: 37, witch_candy: 26, home: 3 });
    expect(NAME_LINES_VERSION).toMatch(/^nl1-[0-9a-f]{10}$/);
    // 강아지를 뺀 아이 이름 한국어 녹음 줄 = 부록 A 95줄 + 홈 3줄
    const kids = Object.values(NAME_LINES).flat().filter((l) => l.ko && /\{[ABC][:}]/.test(l.ko.send)).length;
    expect(kids).toBe(98);
  });
  it('줄마다 녹음 값이 다 있다', () => {
    for (const l of Object.values(NAME_LINES).flat()) {
      for (const p of [l.ko, l.enRec].filter(Boolean)) {
        expect(p.voice).toMatch(/^[A-Za-z0-9]{20}$/);
        expect(p.model).toBe('eleven_v4');
        expect(p.settings.similarity_boost).toBe(0.75);
        expect(typeof p.settings.stability).toBe('number');
        expect(p.send).toMatch(/\{[A-D]/);
      }
    }
  });
});

// ---------- 서버 ----------
function fakeEleven(over) {
  const calls = [];
  const fn = vi.fn(async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body), headers: init.headers });
    if (over) {
      const r = over(url, init, calls.length);
      if (r) return r;
    }
    return new Response(new Uint8Array(500).fill(7), { status: 200, headers: { 'content-type': 'audio/mpeg' } });
  });
  fn.calls = calls;
  return fn;
}

async function raw(env, method, path, { body, auth, deps, origin, rawBody } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (auth) headers.authorization = `Bearer ${auth.accountId}.${auth.token}`;
  if (origin) headers.origin = origin;
  const req = new Request('https://sync.test' + path, { method, headers, body: rawBody ?? (body === undefined ? undefined : JSON.stringify(body)) });
  const res = await handle(req, env, deps);
  const type = res.headers.get('content-type') || '';
  if (type.startsWith('audio/')) return { status: res.status, headers: res.headers, bytes: new Uint8Array(await res.arrayBuffer()) };
  const text = await res.text();
  return { status: res.status, headers: res.headers, json: text ? JSON.parse(text) : null };
}

function setup(extra = {}) {
  const env = makeEnv({ ELEVENLABS_API_KEY: KEY, ...extra });
  const clock = { t: NOW };
  const fetch = fakeEleven();
  const deps = { now: () => clock.t, fetch };
  return { env, clock, fetch, deps };
}

async function own(env, a) {
  const k = 'acct:' + a.accountId;
  const rec = JSON.parse(env.ACCOUNTS.map.get(k));
  rec.state.owned = true;
  env.ACCOUNTS.map.set(k, JSON.stringify(rec));
}

const LINE = { tale: 'unicorn', id: NAME_LINES.unicorn[0].id };
const NAMES = { A: '서아', A_en: 'Seoa' };

beforeEach(() => _resetZeroRetention());

describe('GET /v1/name/catalog·quota', () => {
  it('인증만 필요(구매 불필요), 슬롯·버전·줄', async () => {
    const { env, deps } = setup();
    expect((await raw(env, 'GET', '/v1/name/catalog')).status).toBe(401);
    const a = await newAccount(env, deps);
    const r = await raw(env, 'GET', '/v1/name/catalog', { auth: a, deps });
    expect(r.status).toBe(200);
    expect(r.json.version).toBe(NAME_LINES_VERSION);
    expect(r.json.slots.D).toEqual({ ko: '꿀떡', en: 'Kkulddeok' });
    expect(Object.keys(r.json.tales)).toContain('home');
    const l = r.json.tales.kkultteok.lines.find((x) => x.key.startsWith('"퐁!"'));
    expect(l).toMatchObject({ seg: 1, segEn: 1, langs: ['ko', 'en'] });
    const first = r.json.tales.unicorn.lines[0];
    expect(Object.keys(first)).toEqual(expect.arrayContaining(['id', 'key', 'tpl', 'en', 'tplEn']));
    expect(first).not.toHaveProperty('voice'); // 녹음 내부 값은 내보내지 않는다
    expect(JSON.stringify(r.json)).not.toContain('pFZP5JQG7iQjIQuC4Bku');
    const home = r.json.tales.home.lines.find((x) => x.key === '딸기 다현이');
    expect(home.keyEn).toBe('Strawberry Dahyun');
  });
  it('quota: 미구매 0, 구매 1', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json).toEqual({ owned: false, credits: 0, tickets: 0, covered: [], activeRun: null, previewsLeftToday: 10 });
    await own(env, a);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.credits).toBe(1);
  });
});

describe('POST /v1/name/run', () => {
  it('미구매 403 not_owned', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    const r = await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps });
    expect(r.status).toBe(403);
    expect(r.json.error).toBe('not_owned');
  });
  it('credits 1 소모 → 두 번째는 402 no_credit, 새 실행이 옛 실행을 대신한다', async () => {
    const { env, deps, clock } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const r = await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps });
    expect(r.status).toBe(200);
    expect(r.json.tales).toEqual(['kkultteok', 'red_car', 'unicorn', 'witch_candy', 'home']);
    expect(Date.parse(r.json.expiresAt) - NOW).toBe(48 * 3600 * 1000);
    const q = (await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json;
    expect(q.credits).toBe(0);
    expect(q.activeRun.runId).toBe(r.json.runId);
    const again = await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps });
    expect(again.status).toBe(402);
    expect(again.json.error).toBe('no_credit');
    clock.t += 49 * 3600 * 1000;
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.activeRun).toBeNull();
  });
  it('서버 전체 하루 상한을 넘으면 503 busy', async () => {
    const { env, deps } = setup({ NAME_DAILY_LINE_CAP: '50' });
    const a = await newAccount(env, deps);
    await own(env, a);
    const r = await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps });
    expect(r.status).toBe(503);
    expect(r.json.error).toBe('busy');
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.credits).toBe(1); // 소모하지 않음
  });
  it('보충(backfill): 이름을 정한 적이 있고 그 동화를 아직 안 받았을 때만 무료', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { backfill: 'unicorn' }, deps })).json.error).toBe('no_credit'); // 실행 전
    const run = (await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps })).json;
    // unicorn 한 줄만 받는다 → covered = [unicorn]
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: run.runId, ...LINE, lang: 'ko', names: NAMES }, deps })).status).toBe(200);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.covered).toEqual(['unicorn']);
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { backfill: 'unicorn' }, deps })).status).toBe(402);
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { backfill: 'nope' }, deps })).status).toBe(400);
    const bf = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { backfill: 'red_car' }, deps });
    expect(bf.status).toBe(200);
    expect(bf.json.tales).toEqual(['red_car']);
    const q = (await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json;
    expect(q.credits).toBe(0); // 이용권을 쓰지 않음
    expect(q.activeRun.tales).toEqual(['red_car']);
    // 보충 실행 범위 밖 동화는 404
    const out = await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: bf.json.runId, ...LINE, lang: 'ko', names: NAMES }, deps });
    expect(out.status).toBe(404);
    expect(out.json.error).toBe('run_invalid');
    // 미구매는 보충도 403
    const b = await newAccount(env, deps);
    expect((await raw(env, 'POST', '/v1/name/run', { auth: b, body: { backfill: 'red_car' }, deps })).status).toBe(403);
  });
});

describe('POST /v1/name/line', () => {
  it('mp3 를 돌려주고 ElevenLabs 에는 템플릿 값 그대로 보낸다', async () => {
    const { env, deps, fetch } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const run = (await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps })).json;
    const r = await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: run.runId, ...LINE, lang: 'ko', names: NAMES }, deps, origin: 'capacitor://localhost' });
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toBe('audio/mpeg');
    expect(r.headers.get('x-name-version')).toBe(NAME_LINES_VERSION);
    expect(r.headers.get('access-control-expose-headers')).toContain('x-name-version');
    expect(r.bytes.length).toBe(500);
    const line = NAME_LINES.unicorn[0];
    const c = fetch.calls[0];
    expect(c.url).toBe(`https://api.elevenlabs.io/v1/text-to-speech/${line.ko.voice}?output_format=mp3_44100_128&enable_logging=false`);
    expect(c.headers['xi-api-key']).toBe(KEY);
    expect(c.body).toEqual({ text: fill(line.ko.send, NAMES), model_id: 'eleven_v4', voice_settings: line.ko.settings });
    expect(c.body.text).toContain('서아가');
    expect(c.body.text.startsWith('[')).toBe(true); // 연기 지시 태그
  });
  it('영어: 이름이 없으면 녹음에 쓴 발음 표기(Ee-hyun), 있으면 그 이름', async () => {
    const { env, deps, fetch } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const run = (await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps })).json;
    const l = NAME_LINES.red_car.find((x) => x.enRec && x.enRec.orig.B_en);
    await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: run.runId, tale: 'red_car', id: l.id, lang: 'en', names: { B: '지민' } }, deps });
    expect(fetch.calls[0].body.text).toContain('Ee-hyun');
    await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: run.runId, tale: 'red_car', id: l.id, lang: 'en', names: { B_en: 'Jimin' } }, deps });
    expect(fetch.calls[1].body.text).toContain('Jimin');
    expect(fetch.calls[1].body.text).not.toContain('hyun');
  });
  it('실행 범위·만료·줄 수 한도', async () => {
    const { env, deps, clock } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const run = (await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps })).json;
    const body = { runId: run.runId, ...LINE, lang: 'ko', names: NAMES };
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...body, runId: 'x'.repeat(22) }, deps })).status).toBe(404);
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...body, id: 'nope' }, deps })).status).toBe(400);
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...body, lang: 'ja' }, deps })).status).toBe(400);
    // 이름이 영어에만 있는 줄의 한국어는 만들 것이 없다
    const enOnly = NAME_LINES.red_car.find((x) => !x.ko);
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...body, tale: 'red_car', id: enOnly.id }, deps })).status).toBe(400);
    // 줄·언어마다 2번까지
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps })).status).toBe(200);
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps })).status).toBe(200);
    const third = await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps });
    expect(third.status).toBe(429);
    expect(third.json.error).toBe('quota_exceeded');
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...body, lang: 'en' }, deps })).status).toBe(200); // 다른 언어는 따로
    // 만료
    clock.t += 48 * 3600 * 1000 + 1;
    const exp = await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...body, lang: 'en' }, deps });
    expect(exp.status).toBe(410);
    expect(exp.json.error).toBe('run_invalid');
  });
  it('ElevenLabs 실패는 502 tts_failed, 한도를 세지 않는다', async () => {
    const { env, deps } = setup();
    deps.fetch = fakeEleven(() => new Response('{"detail":"boom"}', { status: 500 }));
    const a = await newAccount(env, deps);
    await own(env, a);
    const run = (await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps })).json;
    const body = { runId: run.runId, ...LINE, lang: 'ko', names: NAMES };
    const r = await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps });
    expect(r.status).toBe(502);
    expect(r.json.error).toBe('tts_failed');
    expect(env.ACCOUNTS.keys().filter((k) => k.startsWith('nl:'))).toHaveLength(0);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.covered).toEqual([]);
  });
  it('키가 없으면 502', async () => {
    const { env, deps } = setup({ ELEVENLABS_API_KEY: '' });
    const a = await newAccount(env, deps);
    await own(env, a);
    const r = await raw(env, 'POST', '/v1/name/line', { auth: a, body: { preview: true, ...LINE, lang: 'ko', names: NAMES }, deps });
    expect(r.status).toBe(502);
  });
  it('zero retention 을 요금제가 거절하면 옵션을 빼고 다시 보낸다', async () => {
    const { env, deps } = setup();
    deps.fetch = fakeEleven((url) => (url.includes('enable_logging=false') ? new Response('{"detail":{"status":"invalid_request","message":"enable_logging=false is only available for enterprise customers"}}', { status: 403 }) : null));
    const a = await newAccount(env, deps);
    await own(env, a);
    const r = await raw(env, 'POST', '/v1/name/line', { auth: a, body: { preview: true, ...LINE, lang: 'ko', names: NAMES }, deps });
    expect(r.status).toBe(200);
    expect(deps.fetch.calls.map((c) => c.url.includes('enable_logging'))).toEqual([true, false]);
  });
  it('미리 듣기: 구매 필요, 하루 10회', async () => {
    const { env, deps, clock } = setup();
    const a = await newAccount(env, deps);
    const body = { preview: true, ...LINE, lang: 'ko', names: NAMES };
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps })).status).toBe(403);
    await own(env, a);
    for (let i = 0; i < 10; i++) expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps })).status).toBe(200);
    const over = await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps });
    expect(over.status).toBe(429);
    expect(over.json.error).toBe('quota_exceeded');
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json).toMatchObject({ previewsLeftToday: 0, credits: 1, covered: [] }); // 생성 횟수·covered 와 별개
    clock.t += 24 * 3600 * 1000;
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps })).status).toBe(200);
  });
  it('형식·금칙어·본문 크기', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const base = { preview: true, ...LINE, lang: 'ko' };
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...base, names: { A: '서아아아아' } }, deps })).json.error).toBe('name_invalid');
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...base, names: { A_en: '서아' } }, deps })).json.error).toBe('name_invalid');
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...base, names: { A: '병신' } }, deps })).json.error).toBe('name_banned');
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { ...base, names: { E: '서아' } }, deps })).json.error).toBe('bad_request');
    const big = await raw(env, 'POST', '/v1/name/line', { auth: a, rawBody: JSON.stringify({ ...base, names: NAMES, pad: 'x'.repeat(1100) }), deps });
    expect(big.status).toBe(400);
    expect(big.json.error).toBe('bad_request');
    expect(env.ACCOUNTS.keys().some((k) => k.startsWith('nglob:'))).toBe(false); // 거절된 요청은 아무것도 쓰지 않음
  });
});

describe('POST /v1/name/check', () => {
  it('금칙어·형식', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    expect((await raw(env, 'POST', '/v1/name/check', { auth: a, body: { names: { A: '서아', A_en: 'Seoa', D: '초코' } }, deps })).json).toEqual({ ok: true, errors: {} });
    const r = await raw(env, 'POST', '/v1/name/check', { auth: a, body: { names: { A: '씨발이', A_en: 'Fucker', B: 'abc', C_en: 'Killian', D_en: 'Ass' } }, deps });
    expect(r.json).toEqual({ ok: false, errors: { A: 'banned', A_en: 'banned', B: 'invalid', D_en: 'banned' } });
    expect(isBanned('Grape', 'en')).toBe(false);
    expect(isBanned('똥', 'ko')).toBe(true);
    expect(isBanned('똥강아지', 'ko')).toBe(false);
  });
});

describe('0.99 이름 바꾸기권 영수증', () => {
  let chain;
  beforeAll(async () => { chain = await makeChain(); });
  const rename = (tx) => goodPayload({ productId: 'com.papertale.theater.rename', transactionId: tx, originalTransactionId: tx, type: 'Consumable' });

  it('미구매 403, 구매 뒤 +1, 같은 거래는 한 번만, 다른 계정은 422', async () => {
    const { env, deps } = setup({ APPLE_ROOT_CA_G3_PEM: undefined });
    env.APPLE_ROOT_CA_G3_PEM = chain.rootPem;
    const d = { ...deps, now: () => Date.UTC(2026, 9, 27, 12) };
    const a = await newAccount(env, d);
    const jws1 = await signTransaction(chain, rename('2000000000000001'));
    const no = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: jws1 }, deps: d });
    expect(no.status).toBe(403);
    expect(no.json.error).toBe('not_owned');
    // 전체 구매(unlockall)
    expect((await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: await signTransaction(chain, goodPayload()) }, deps: d })).json.owned).toBe(true);
    const ok = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: jws1 }, deps: d });
    expect(ok.status).toBe(200);
    expect(ok.json.quota).toMatchObject({ owned: true, tickets: 1, credits: 2 });
    const dup = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: jws1 }, deps: d });
    expect(dup.status).toBe(200);
    expect(dup.json.duplicate).toBe(true);
    expect(dup.json.quota.tickets).toBe(1);
    // 다른 계정(구매자)이 같은 거래를 쓰면 거절
    const b = await newAccount(env, d);
    await call(env, 'POST', '/v1/receipt/apple', { auth: b, body: { signedTransaction: await signTransaction(chain, goodPayload()) }, deps: d });
    expect((await call(env, 'POST', '/v1/receipt/apple', { auth: b, body: { signedTransaction: jws1 }, deps: d })).status).toBe(422);
    // 새 거래는 또 +1
    const two = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: await signTransaction(chain, rename('2000000000000002')) }, deps: d });
    expect(two.json.quota.tickets).toBe(2);
    // 이용권 2장 + 포함 1회 = 3회 생성
    for (let i = 0; i < 3; i++) expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps: d })).status).toBe(200);
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps: d })).status).toBe(402);
    // 거래 번호 원문은 KV 에 없다
    expect([...env.ACCOUNTS.map.keys(), ...env.ACCOUNTS.map.values()].join('')).not.toContain('2000000000000001');
    // 계정을 지워도 '쓴 거래' 표시는 남아 다른 계정에서 다시 못 쓴다
    expect((await call(env, 'DELETE', '/v1/account', { auth: a, deps: d })).status).toBe(204);
    expect((await call(env, 'POST', '/v1/receipt/apple', { auth: b, body: { signedTransaction: jws1 }, deps: d })).status).toBe(422);
  });
  it('알 수 없는 상품은 여전히 422', async () => {
    const env = makeEnv({ APPLE_ROOT_CA_G3_PEM: chain.rootPem });
    const d = { now: () => Date.UTC(2026, 9, 27, 12) };
    const a = await newAccount(env, d);
    const r = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: await signTransaction(chain, goodPayload({ productId: 'com.papertale.theater.other' })) }, deps: d });
    expect(r.status).toBe(422);
  });
});

describe('개인정보: 이름은 KV·로그에 남지 않는다', () => {
  it('실행·미리 듣기·검사·연결 뒤 KV 와 로그 어디에도 이름이 없다', async () => {
    const { env, deps } = setup();
    const logs = [];
    const spies = ['log', 'error', 'warn', 'info'].map((m) => vi.spyOn(console, m).mockImplementation((...a) => logs.push(a.map(String).join(' '))));
    try {
      const secret = { A: '비밀이름', A_en: 'Zorblax', D: '몽실', D_en: 'Mongsil' };
      const a = await newAccount(env, deps);
      await own(env, a);
      await raw(env, 'POST', '/v1/name/check', { auth: a, body: { names: secret }, deps });
      await raw(env, 'POST', '/v1/name/line', { auth: a, body: { preview: true, ...LINE, lang: 'ko', names: secret }, deps });
      const run = (await raw(env, 'POST', '/v1/name/run', { auth: a, body: {}, deps })).json;
      const dog = NAME_LINES.kkultteok.find((l) => l.ko && l.ko.send.includes('{D'));
      for (const lang of ['ko', 'en']) await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: run.runId, tale: 'kkultteok', id: dog.id, lang, names: secret }, deps });
      // 실패 경로도(로그가 남는 곳)
      deps.fetch = fakeEleven(() => new Response('{"detail":"bad text 비밀이름"}', { status: 400 }));
      await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: run.runId, ...LINE, lang: 'ko', names: secret }, deps });
      // 연결 코드로 다른 기기와 합치기
      const code = (await call(env, 'POST', '/v1/link/create', { auth: a, body: {}, deps })).json.code;
      const b = await newAccount(env, deps);
      const merged = await call(env, 'POST', '/v1/link/redeem', { auth: b, body: { code }, deps });
      const q = (await raw(env, 'GET', '/v1/name/quota', { auth: { accountId: merged.json.accountId, token: merged.json.token }, deps })).json;
      expect(q.covered).toEqual(['kkultteok']);
      expect(q.activeRun.runId).toBe(run.runId);
      const dump = [...env.ACCOUNTS.map.keys(), ...env.ACCOUNTS.map.values()].join('\n');
      for (const v of Object.values(secret)) {
        expect(dump).not.toContain(v);
        expect(logs.join('\n')).not.toContain(v);
      }
      expect(logs.join('\n')).not.toContain(KEY);
    } finally {
      spies.forEach((s) => s.mockRestore());
    }
  });
});
