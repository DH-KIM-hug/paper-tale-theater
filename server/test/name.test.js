import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fill, hasBatchim, valid, validLook, slotsIn, ORIGINAL, ORIGINAL_LOOK } from '../src/name_form.js';
import { NAME_LINES, NAME_LINES_VERSION } from '../src/name_lines.js';
import { _resetZeroRetention, nameState, voiceFor } from '../src/name.js';
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

// 모습(look) 문법: [템플릿, 이름들, 모습, 기대]. 모습 b 남자아이 / g 여자아이, 빠지면 원래(A·C 여, B 남)
const LOOK_TABLE = [
  ['{A_g:he/she} waved.', {}, { A: 'g' }, 'she waved.'],
  ['{A_g:He/She} waved.', {}, { A: 'b' }, 'He waved.'],
  ['{A_g:He/She} waved.', {}, undefined, 'She waved.'],              // A 원래 여자아이
  ['{B_g:He/She} waved.', {}, undefined, 'He waved.'],               // B 원래 남자아이
  ['{C_g:He/She} waved.', {}, { C: 'b' }, 'He waved.'],
  ['{A_en} popped it into {A_g:his/her} basket.', { A_en: 'Seoa' }, { A: 'b' }, 'Seoa popped it into his basket.'],
  ['{A_en} popped it into {A_g:his/her} basket.', { A_en: 'Seoa' }, { A: 'g' }, 'Seoa popped it into her basket.'],
  ['said to {B_g:himself/herself}.', {}, { B: 'g' }, 'said to herself.'],
  ['{A_g:His/Her} legs and {A_g:his/her} eyes', {}, { A: 'b' }, 'His legs and his eyes'],
  ['{A_g:He/She} and {B_g:he/she}', {}, { A: 'b', B: 'g' }, 'He and she'],   // 자리마다 따로
  ['{A_g:he/she}', {}, { A: 'x' }, 'she'],                                   // 알 수 없는 값은 원래 모습
  ['{A_g:he/she}', {}, { D: 'b' }, 'she'],
  // 호칭 {A>B:형/오빠/누나/언니} = (A남·B남)/(A여·B남)/(A남·B여)/(A여·B여)
  ['"{A>B:형/오빠/누나/언니}, 같이 가!"', {}, { A: 'b', B: 'b' }, '"형, 같이 가!"'],
  ['"{A>B:형/오빠/누나/언니}, 같이 가!"', {}, { A: 'g', B: 'b' }, '"오빠, 같이 가!"'],
  ['"{A>B:형/오빠/누나/언니}, 같이 가!"', {}, { A: 'b', B: 'g' }, '"누나, 같이 가!"'],
  ['"{A>B:형/오빠/누나/언니}, 같이 가!"', {}, { A: 'g', B: 'g' }, '"언니, 같이 가!"'],
  ['{C>A:brother/brother/sister/sister}', {}, { C: 'g', A: 'b' }, 'brother'],
  // 이름·받침은 모습과 무관
  ['{A:이가/가} {A_g:he/she}', { A: '도윤' }, { A: 'b' }, '도윤이가 he'],
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
  it('모습(look) 시험표 전부 통과(서버·앱 같은 결과)', () => {
    for (const [tpl, names, look, want] of LOOK_TABLE) {
      expect(fill(tpl, names, look), tpl + JSON.stringify(look)).toBe(want);
      expect(engine.fill(tpl, names, look), 'engine ' + tpl + JSON.stringify(look)).toBe(want);
    }
    expect(JSON.stringify(engine.ORIGINAL_LOOK)).toBe(JSON.stringify(ORIGINAL_LOOK));
    expect(ORIGINAL_LOOK).toEqual({ A: 'g', B: 'b', C: 'g' });
  });
  it('look 검사·자리 목록', () => {
    for (const v of [undefined, null, {}, { A: 'b' }, { A: 'g', B: 'b', C: 'g' }]) { expect(validLook(v)).toBe(true); expect(engine.validLook(v)).toBe(true); }
    for (const v of [{ A: 'boy' }, { A: 'x' }, { D: 'b' }, { E: 'b' }, 'b', ['b'], { A: null }, { A: 1 }]) { expect(validLook(v), JSON.stringify(v)).toBe(false); expect(engine.validLook(v)).toBe(false); }
    expect(slotsIn('{A_en} {A_g:his/her} {B:이는/는} {A>C:a/b/c/d}').sort()).toEqual(['A_en', 'A_g', 'B', 'C_g']);
    expect(engine.slotsIn('{A_en} {A_g:his/her} {B:이는/는} {A>C:a/b/c/d}').sort()).toEqual(['A_en', 'A_g', 'B', 'C_g']);
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
        expect(fill(l.tplEn, {}, ORIGINAL_LOOK)).toBe(l.en);
        for (const s of sets) {
          for (const t of [l.tpl, l.tplEn, l.ko && l.ko.send, l.enRec && l.enRec.send].filter(Boolean)) {
            const out = fill(t, s);
            expect(out, tale + l.id).toBe(engine.fill(t, s));
            expect(out).not.toMatch(/[{}]/);
            for (const lk of [{ A: 'b', B: 'g', C: 'b' }, { A: 'g', B: 'b', C: 'g' }]) {
              expect(fill(t, s, lk), tale + l.id).toBe(engine.fill(t, s, lk));
              expect(fill(t, s, lk)).not.toMatch(/[{}]/);
            }
          }
        }
      }
    }
  });
});

describe('템플릿 파일: 모습(look) 줄', () => {
  const all = Object.entries(NAME_LINES).flatMap(([t, ls]) => ls.map((l) => [t, l]));
  const withG = all.filter(([, l]) => /\{[A-D]_g:/.test(l.tplEn));
  it('영어 대명사 줄 = 29줄 중 주인공 줄(놀이·읽기를 한 줄로 합친 개수) + 영어에만 있는 새 줄 10', () => {
    const only = withG.filter(([, l]) => !l.ko);
    expect(only.length).toBe(10);
    for (const [, l] of only) { expect(l.ko).toBeNull(); expect(l.enRec.send).toMatch(/_g:/); expect(l.g.length).toBeGreaterThan(0); }
    expect(withG.filter(([t]) => t === 'witch_candy').length).toBe(9);
    expect(withG.filter(([t]) => t === 'kkultteok').length).toBe(1);
  });
  it('g 는 줄에 나온 _g 자리와 같다, 한국어에는 성별 단어 자리가 없다', () => {
    for (const [t, l] of all) {
      const inTpl = new Set([...(l.tplEn + (l.ko ? l.ko.send : '') + (l.enRec ? l.enRec.send : '')).matchAll(/\{([A-D])_g:/g)].map((m) => m[1]));
      for (const x of inTpl) expect(l.g, t + l.id).toContain(x);
      expect(l.tpl).not.toMatch(/_g:/);
      if (l.ko) expect(l.ko.send).not.toMatch(/_g:/);
    }
  });
  it('강아지 꿀떡이의 his/he 는 모습 자리로 바꾸지 않았다', () => {
    const dog = NAME_LINES.kkultteok.filter((l) => /Kkulddeok|\{D_en\}/.test(l.tplEn) && /\b(his|he)\b/i.test(l.tplEn));
    expect(dog.length).toBeGreaterThan(3);
    for (const l of dog) expect(l.tplEn).not.toMatch(/_g:/);
  });
  it('모습별 목소리 표: 구름 공장 아이 배역 줄은 look.slot·voices 를 갖고, 지금은 원래 목소리와 같다', () => {
    const parts = Object.values(NAME_LINES).flat().flatMap((l) => [l.ko, l.enRec]).filter((p) => p && p.look);
    expect(parts.length).toBeGreaterThan(0);
    for (const p of parts) {
      expect(['A', 'B', 'C']).toContain(p.look.slot);
      expect(Object.keys(p.look.voices).sort()).toEqual(['b', 'g']);
      expect(p.look.voices.b).toBe(p.voice);
      expect(p.look.voices.g).toBe(p.voice);
    }
  });
  it('voiceFor: 표대로 모습에 맞는 목소리를 고른다', () => {
    const part = { voice: 'orig', look: { slot: 'B', voices: { b: 'VB', g: 'VG' } } };
    expect(voiceFor(part, { B: 'g' })).toBe('VG');
    expect(voiceFor(part, { B: 'b' })).toBe('VB');
    expect(voiceFor(part, undefined)).toBe('VB'); // B 의 원래 모습은 남자아이
    expect(voiceFor({ voice: 'orig' }, { B: 'g' })).toBe('orig');
  });
});

describe('템플릿 파일', () => {
  it('동화 4편 + home, 줄 수', () => {
    expect(Object.keys(NAME_LINES).sort()).toEqual(['home', 'kkultteok', 'red_car', 'unicorn', 'witch_candy']);
    const counts = Object.fromEntries(Object.entries(NAME_LINES).map(([t, l]) => [t, l.length]));
    expect(counts).toEqual({ kkultteok: 46, red_car: 23, unicorn: 38, witch_candy: 34, home: 3 });
    expect(NAME_LINES_VERSION).toMatch(/^nl2-[0-9a-f]{10}$/);
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
const firstRun = async (env, a, deps, tale = 'unicorn') => (await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale }, deps })).json;
const setName = (env, a, f) => { // 시험용: 계정의 이름 기능 기록을 직접 바꾼다
  const k = 'acct:' + a.accountId, rec = JSON.parse(env.ACCOUNTS.map.get(k));
  rec.name = f(rec.name || {});
  env.ACCOUNTS.map.set(k, JSON.stringify(rec));
};
const ALL = ['kkultteok', 'red_car', 'unicorn', 'witch_candy'];
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
    expect(l).toMatchObject({ seg: 1, segEn: 1, langs: ['ko', 'en'], g: [] });
    expect(r.json.originalLook).toEqual({ A: 'g', B: 'b', C: 'g' });
    const g = r.json.tales.witch_candy.lines.find((x) => x.tplEn.startsWith('{A_g:He/She} melted'));
    expect(g).toMatchObject({ langs: ['en'], g: ['A'], seg: null });
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
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json).toEqual({ owned: false, first: [], firstLeft: [], tickets: 0, activeRun: null, previewsLeftToday: 10 });
    await own(env, a);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json).toMatchObject({ owned: true, first: [], firstLeft: ALL, tickets: 0 });
  });
});

describe('POST /v1/name/run (동화별 첫 설정 · 이용권 실행)', () => {
  it('미구매 403 not_owned', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    for (const body of [{ tale: 'unicorn' }, { ticket: true }]) {
      const r = await raw(env, 'POST', '/v1/name/run', { auth: a, body, deps });
      expect(r.status).toBe(403);
      expect(r.json.error).toBe('not_owned');
    }
  });
  it('요청 모양: tale 또는 ticket:true 하나만, 옛 {} 와 {backfill} 은 400', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    for (const body of [{}, { backfill: 'unicorn' }, { tale: 'nope' }, { tale: 'home' }, { tale: 3 }, { ticket: false }, { ticket: 'yes' }, { tale: 'unicorn', ticket: true }]) {
      const r = await raw(env, 'POST', '/v1/name/run', { auth: a, body, deps });
      expect(r.status, JSON.stringify(body)).toBe(400);
    }
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.first).toEqual([]);
  });
  it('첫 설정: 동화마다 1번 무료, 두 번째는 402, 다른 동화는 그대로 남는다', async () => {
    const { env, deps, clock } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const r = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale: 'unicorn' }, deps });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ tales: ['unicorn'], kind: 'first' });
    expect(Date.parse(r.json.expiresAt) - NOW).toBe(48 * 3600 * 1000);
    const q = (await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json;
    expect(q).toMatchObject({ first: ['unicorn'], firstLeft: ['kkultteok', 'red_car', 'witch_candy'], tickets: 0 });
    expect(q.activeRun).toMatchObject({ runId: r.json.runId, tales: ['unicorn'], kind: 'first' });
    // 같은 동화를 다시 설정하려면(이용권 0장) 402. 실행이 살아 있는 동안은 같은 실행을 이어 준다(first 를 또 쓰지 않음)
    const again = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale: 'unicorn' }, deps });
    expect(again.status).toBe(200);
    expect(again.json).toMatchObject({ runId: r.json.runId, resumed: true });
    clock.t += 49 * 3600 * 1000;
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.activeRun).toBeNull();
    const dead = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale: 'unicorn' }, deps });
    expect(dead.status).toBe(402);
    expect(dead.json.error).toBe('no_credit');
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps })).status).toBe(402); // 이용권도 0장
    // 다른 동화는 아직 무료
    const red = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale: 'red_car' }, deps });
    expect(red.status).toBe(200);
    expect(red.json.tales).toEqual(['red_car']);
  });
  it('witch_candy 첫 설정은 홈 스티커 줄(home)도 함께, 다른 동화는 home 없음', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    expect((await firstRun(env, a, deps, 'witch_candy')).tales).toEqual(['witch_candy', 'home']);
    const b = await newAccount(env, deps);
    await own(env, b);
    expect((await firstRun(env, b, deps, 'kkultteok')).tales).toEqual(['kkultteok']);
  });
  it('첫 설정을 연달아 하면 같은 실행에 동화를 보탠다(앞 동화의 줄 받기가 끊기지 않음)', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const r1 = await firstRun(env, a, deps, 'unicorn');
    const r2 = await firstRun(env, a, deps, 'red_car');
    expect(r2.runId).toBe(r1.runId);
    expect(r2.tales).toEqual(['unicorn', 'red_car']);
    const ok = await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: r1.runId, ...LINE, lang: 'ko', names: NAMES }, deps });
    expect(ok.status).toBe(200);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.first).toEqual(['unicorn', 'red_car']);
  });
  it('이용권 실행: 1장으로 네 편 + home, 이용권 0장이면 402, 도는 중에는 이어 쓴다', async () => {
    const { env, deps, clock } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    setName(env, a, () => ({ first: [...ALL], tickets: 2 }));
    const r = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps });
    expect(r.status).toBe(200);
    expect(r.json).toMatchObject({ tales: [...ALL, 'home'], kind: 'ticket' });
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json).toMatchObject({ tickets: 1, first: ALL, firstLeft: [] });
    // 도는 중에 다시 눌러도 이용권을 또 쓰지 않는다
    const again = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps });
    expect(again.json).toMatchObject({ runId: r.json.runId, resumed: true });
    // 이용권 실행 안의 동화는 {tale} 로 불러도 같은 실행(첫 설정이 남아 있어도 아끼지 않는다)
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale: 'red_car' }, deps })).json).toMatchObject({ runId: r.json.runId, resumed: true });
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.tickets).toBe(1);
    // 네 편 모두 줄을 받을 수 있다
    for (const tale of ALL) {
      const l = NAME_LINES[tale].find((x) => x.ko);
      expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: r.json.runId, tale, id: l.id, lang: 'ko', names: NAMES }, deps })).status, tale).toBe(200);
    }
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: r.json.runId, tale: 'home', id: NAME_LINES.home[0].id, lang: 'ko', names: NAMES }, deps })).status).toBe(200);
    // 만료 뒤 두 번째 장으로 다시, 그다음은 402
    clock.t += 49 * 3600 * 1000;
    const second = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps });
    expect(second.status).toBe(200);
    expect(second.json.runId).not.toBe(r.json.runId);
    clock.t += 49 * 3600 * 1000;
    const none = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps });
    expect(none.status).toBe(402);
    expect(none.json.error).toBe('no_credit');
  });
  it('이용권 실행이 새 첫 설정으로 대체되지 않는다', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    setName(env, a, () => ({ first: ['unicorn'], tickets: 1 }));
    const t = (await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps })).json;
    const f = (await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale: 'kkultteok' }, deps })).json;
    expect(f.runId).toBe(t.runId);
    expect(nameState(JSON.parse(env.ACCOUNTS.map.get('acct:' + a.accountId))).first).toEqual(['unicorn']); // 첫 설정은 쓰지 않았다
  });
  it('서버 전체 하루 상한을 넘으면 503 busy, 아무것도 소모하지 않는다', async () => {
    const { env, deps } = setup({ NAME_DAILY_LINE_CAP: '20' });
    const a = await newAccount(env, deps);
    await own(env, a);
    setName(env, a, () => ({ first: [], tickets: 1 }));
    const r = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale: 'unicorn' }, deps });
    expect(r.status).toBe(503);
    expect(r.json.error).toBe('busy');
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps })).status).toBe(503);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json).toMatchObject({ first: [], tickets: 1 });
  });
  it('옛 기록 이전: 생성한 적 있으면 first = covered, 이용권은 남은 장수로, 안 했으면 모두 무료', async () => {
    const { env, deps } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    setName(env, a, () => ({ used: 1, tickets: 0, covered: ['unicorn', 'red_car'], run: { id: 'r'.repeat(22), tales: [...ALL, 'home'], exp: NOW + 3600 * 1000 } }));
    let q = (await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json;
    expect(q).toMatchObject({ first: ['unicorn', 'red_car'], firstLeft: ['kkultteok', 'witch_candy'], tickets: 0 });
    expect(q.activeRun).toMatchObject({ runId: 'r'.repeat(22), kind: 'ticket' });
    // 이전 뒤 줄 받기·쓰기가 새 형식으로 저장된다
    expect((await raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: 'r'.repeat(22), ...LINE, lang: 'ko', names: NAMES }, deps })).status).toBe(200);
    // 미리 듣기로 기록을 한 번 쓰면 새 형식(first)으로 저장되고 옛 필드는 없어진다
    await raw(env, 'POST', '/v1/name/line', { auth: a, body: { preview: true, ...LINE, lang: 'ko', names: NAMES }, deps });
    const saved = JSON.parse(env.ACCOUNTS.map.get('acct:' + a.accountId)).name;
    expect(saved).toMatchObject({ first: ['unicorn', 'red_car'], tickets: 0 });
    expect(saved).not.toHaveProperty('used');
    expect(saved).not.toHaveProperty('covered');
    // 이용권 산 누계 3장·실행 2번(포함 1회 + 이용권 1장) → 남은 2장
    const b = await newAccount(env, deps);
    await own(env, b);
    setName(env, b, () => ({ used: 2, tickets: 3, covered: ALL }));
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: b, deps })).json).toMatchObject({ tickets: 2, firstLeft: [] });
    // 한 번도 안 한 계정은 모두 무료
    const c = await newAccount(env, deps);
    await own(env, c);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: c, deps })).json).toMatchObject({ first: [], firstLeft: ALL, tickets: 0 });
  });
});

describe('POST /v1/name/line', () => {
  it('mp3 를 돌려주고 ElevenLabs 에는 템플릿 값 그대로 보낸다', async () => {
    const { env, deps, fetch } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const run = await firstRun(env, a, deps);
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
  it('look: 영어 대명사가 모습대로 채워지고, 잘못된 값은 400 look_invalid, 서버에 저장하지 않는다', async () => {
    const { env, deps, fetch } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const run = await firstRun(env, a, deps, 'witch_candy');
    const l = NAME_LINES.witch_candy.find((x) => x.tplEn.startsWith('{A_g:He/She} melted'));
    expect(l.ko).toBeNull();
    const send = (look, lang = 'en') => raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: run.runId, tale: 'witch_candy', id: l.id, lang, names: { A_en: 'Seoa' }, ...(look === undefined ? {} : { look }) }, deps });
    expect((await send({ A: 'b' })).status).toBe(200);
    expect(fetch.calls[0].body.text).toMatch(/He melted!$/);
    expect((await send({ A: 'g' })).status).toBe(200);
    expect(fetch.calls[1].body.text).toMatch(/She melted!$/);
    // 줄은 2번까지라 나머지는 미리 듣기로: look 이 없으면 원래 모습(A 여자아이)
    const pvOf = (look) => raw(env, 'POST', '/v1/name/line', { auth: a, body: { preview: true, tale: 'witch_candy', id: l.id, lang: 'en', names: {}, ...(look ? { look } : {}) }, deps });
    expect((await pvOf()).status).toBe(200);
    expect(fetch.calls[2].body.text).toMatch(/She melted!$/);
    for (const bad of [{ A: 'boy' }, { A: 'x' }, { D: 'b' }, 'b', ['b']]) {
      const r = await send(bad);
      expect(r.status, JSON.stringify(bad)).toBe(400);
      expect(r.json.error).toBe('look_invalid');
    }
    expect(fetch.calls.length).toBe(3);
    // 한국어에는 이 줄이 없다
    expect((await send({ A: 'b' }, 'ko')).status).toBe(400);
    // 미리 듣기도 같은 규칙
    const pv = await pvOf({ A: 'b' });
    expect(pv.status).toBe(200);
    expect(fetch.calls[3].body.text).toMatch(/He melted!$/);
    // 모습은 KV 에 남지 않는다
    const dump = [...env.ACCOUNTS.map.values()].join('\n');
    expect(dump).not.toMatch(/"look"|"A":"b"/);
  });
  it('look 이 든 한국어 줄은 영향 없음(성별 단어 없음), 구름 공장 아이 목소리는 표대로(지금은 원래 목소리)', async () => {
    const { env, deps, fetch } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const run = await firstRun(env, a, deps, 'kkultteok');
    const l = NAME_LINES.kkultteok.find((x) => x.ko && x.ko.look);
    const send = (look) => raw(env, 'POST', '/v1/name/line', { auth: a, body: { runId: run.runId, tale: 'kkultteok', id: l.id, lang: 'ko', names: NAMES, look }, deps });
    await send({ A: 'b', B: 'g', C: 'b' });
    await send({ A: 'g', B: 'b', C: 'g' });
    expect(fetch.calls[0].body.text).toBe(fetch.calls[1].body.text);
    expect(fetch.calls[0].url).toBe(fetch.calls[1].url); // 같은 목소리
    expect(fetch.calls[0].url).toContain('/text-to-speech/' + l.ko.voice + '?');
  });
  it('영어: 이름이 없으면 녹음에 쓴 발음 표기(Ee-hyun), 있으면 그 이름', async () => {
    const { env, deps, fetch } = setup();
    const a = await newAccount(env, deps);
    await own(env, a);
    const run = await firstRun(env, a, deps, 'red_car');
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
    const run = await firstRun(env, a, deps);
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
    const run = await firstRun(env, a, deps);
    const body = { runId: run.runId, ...LINE, lang: 'ko', names: NAMES };
    const r = await raw(env, 'POST', '/v1/name/line', { auth: a, body, deps });
    expect(r.status).toBe(502);
    expect(r.json.error).toBe('tts_failed');
    expect(env.ACCOUNTS.keys().filter((k) => k.startsWith('nl:'))).toHaveLength(0);
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json.first).toEqual(['unicorn']); // 첫 설정은 실행을 만들 때 쓴다(줄 실패와 무관)
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
    expect((await raw(env, 'GET', '/v1/name/quota', { auth: a, deps })).json).toMatchObject({ previewsLeftToday: 0, first: [], firstLeft: ALL, tickets: 0 }); // 첫 설정·이용권과 별개
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
    expect((await raw(env, 'POST', '/v1/name/check', { auth: a, body: { names: { A: '서아' }, look: { A: 'b', C: 'g' } }, deps })).json).toEqual({ ok: true, errors: {} });
    expect((await raw(env, 'POST', '/v1/name/check', { auth: a, body: { names: {}, look: { A: 'boy' } }, deps })).json).toEqual({ ok: false, errors: { look: 'invalid' } });
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
    const clock2 = { t: Date.UTC(2026, 9, 27, 12) };
    const d = { ...deps, now: () => clock2.t };
    const a = await newAccount(env, d);
    const jws1 = await signTransaction(chain, rename('2000000000000001'));
    const no = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: jws1 }, deps: d });
    expect(no.status).toBe(403);
    expect(no.json.error).toBe('not_owned');
    // 전체 구매(unlockall)
    expect((await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: await signTransaction(chain, goodPayload()) }, deps: d })).json.owned).toBe(true);
    const ok = await call(env, 'POST', '/v1/receipt/apple', { auth: a, body: { signedTransaction: jws1 }, deps: d });
    expect(ok.status).toBe(200);
    expect(ok.json.quota).toMatchObject({ owned: true, tickets: 1, firstLeft: ALL });
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
    // 이용권 2장 = 이용권 실행 2번(한 번에 네 편), 그다음은 402. 첫 설정(동화마다)은 이용권과 별개로 그대로 남는다
    const t1 = await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps: d });
    expect(t1.json.tales).toEqual([...ALL, 'home']);
    clock2.t += 49 * 3600 * 1000;
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps: d })).status).toBe(200);
    clock2.t += 49 * 3600 * 1000;
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { ticket: true }, deps: d })).status).toBe(402);
    expect((await raw(env, 'POST', '/v1/name/run', { auth: a, body: { tale: 'unicorn' }, deps: d })).status).toBe(200);
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
      const run = await firstRun(env, a, deps, 'kkultteok');
      await firstRun(env, a, deps, 'unicorn'); // 같은 실행에 보탠다
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
      expect(q.first).toEqual(['kkultteok', 'unicorn']);
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
