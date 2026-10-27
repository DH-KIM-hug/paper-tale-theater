import { describe, expect, it } from 'vitest';
import { emptyState, mergeStates, sanitizeClientState } from '../src/state.js';

const st = (o = {}) => ({ ...emptyState(null), ...o });

describe('state 합치기', () => {
  it('firstRun 은 더 이른 날짜', () => {
    expect(mergeStates(st({ firstRun: '2026-10-20' }), st({ firstRun: '2026-10-05' })).firstRun).toBe('2026-10-05');
    expect(mergeStates(st({ firstRun: null }), st({ firstRun: '2026-10-05' })).firstRun).toBe('2026-10-05');
    expect(mergeStates(st(), st()).firstRun).toBeNull();
  });
  it('earned 는 날짜별 합집합, 같은 날짜는 id 사전순 앞', () => {
    const m = mergeStates(st({ earned: { '2026-10-01': 'rabbit', '2026-10-02': 'zebra' } }), st({ earned: { '2026-10-02': 'ant', '2026-10-03': 'hansel' } }));
    expect(m.earned).toEqual({ '2026-10-01': 'rabbit', '2026-10-02': 'ant', '2026-10-03': 'hansel' });
    // 순서를 바꿔도 같은 결과
    const m2 = mergeStates(st({ earned: { '2026-10-02': 'ant', '2026-10-03': 'hansel' } }), st({ earned: { '2026-10-01': 'rabbit', '2026-10-02': 'zebra' } }));
    expect(m2.earned).toEqual(m.earned);
  });
  it('starUnlocked 합집합', () => {
    expect(mergeStates(st({ starUnlocked: ['a', 'b'] }), st({ starUnlocked: ['b', 'c'] })).starUnlocked).toEqual(['a', 'b', 'c']);
  });
  it('stickers 합집합, 옛 기록에 필드가 없어도 된다, 상한 200', () => {
    expect(mergeStates(st({ stickers: ['a', 'b'] }), st({ stickers: ['b', 'c'] })).stickers).toEqual(['a', 'b', 'c']);
    const old = { firstRun: null, earned: {}, waitUnlocked: [], owned: false };
    expect(mergeStates(old, st({ stickers: ['x'] })).stickers).toEqual(['x']);
    const many = n => Array.from({ length: n }, (_, i) => 's' + String(i).padStart(3, '0'));
    const m1 = mergeStates(st({ stickers: many(150) }), st({ stickers: many(300).slice(100, 250) }));
    const m2 = mergeStates(st({ stickers: many(300).slice(100, 250) }), st({ stickers: many(150) }));
    expect(m1.stickers).toHaveLength(200); expect(m2.stickers).toEqual(m1.stickers);
  });
  it('waitUnlocked 합집합 후 앞에서 2개만', () => {
    expect(mergeStates(st({ waitUnlocked: ['a'] }), st({ waitUnlocked: ['b', 'c'] })).waitUnlocked).toEqual(['a', 'b']);
  });
  it('owned 는 믿을 수 있는 값으로만 정한다', () => {
    expect(mergeStates(st({ owned: true }), st({ owned: true }), false).owned).toBe(false);
    expect(mergeStates(st(), st(), true).owned).toBe(true);
  });
});

describe('cast 캐릭터 스티커', () => {
  it('합집합, 옛 기록에 필드가 없어도 된다, 상한 400, 순서와 상관없이 같다', () => {
    expect(mergeStates(st({ cast: ['a.x', 'b.y'] }), st({ cast: ['b.y', 'c.z'] })).cast).toEqual(['a.x', 'b.y', 'c.z']);
    const old = { firstRun: null, earned: {}, waitUnlocked: [], owned: false };
    expect(mergeStates(old, st({ cast: ['x.y'] })).cast).toEqual(['x.y']);
    const many = n => Array.from({ length: n }, (_, i) => 't' + String(i).padStart(3, '0') + '.k');
    const m1 = mergeStates(st({ cast: many(300) }), st({ cast: many(500).slice(200) }));
    const m2 = mergeStates(st({ cast: many(500).slice(200) }), st({ cast: many(300) }));
    expect(m1.cast).toHaveLength(400); expect(m2.cast).toEqual(m1.cast);
  });
  it('형식 검사와 상한', () => {
    expect(sanitizeClientState({ cast: ['rabbit.run', 'rabbit.run', 'patjuk.tiger_stand'] }).cast).toEqual(['rabbit.run', 'patjuk.tiger_stand']);
    expect(sanitizeClientState({}).cast).toEqual([]);
    for (const bad of [['rabbit'], ['Rabbit.run'], ['a.b.c'], ['a.'], ['.b'], [1], 'a.b', ['a'.repeat(41) + '.b']]) expect(() => sanitizeClientState({ cast: bad }), JSON.stringify(bad)).toThrow();
    expect(() => sanitizeClientState({ cast: Array.from({ length: 401 }, (_, i) => 'a.k' + i) })).toThrow();
  });
});

describe('클라이언트 state 검사', () => {
  it('owned 는 무시한다', () => {
    expect(sanitizeClientState({ firstRun: '2026-10-27', owned: true }).owned).toBe(false);
  });
  it('잘못된 값은 bad_request', () => {
    const bad = [null, [], 'x', { firstRun: '2026-13-40' }, { firstRun: 'abc' }, { earned: { '2026-10-01': 'Bad Id' } }, { earned: { nope: 'a' } }, { starUnlocked: ['A!'] }, { waitUnlocked: ['a', 'b', 'c'] }, { starUnlocked: 'a' }, { stickers: ['A!'] }, { stickers: 'a' }];
    for (const b of bad) expect(() => sanitizeClientState(b), JSON.stringify(b)).toThrow();
  });
  it('stickers 를 받아들인다', () => {
    expect(sanitizeClientState({ stickers: ['rabbit', 'rabbit', 'patjuk'] }).stickers).toEqual(['rabbit', 'patjuk']);
  });
  it('개수 상한', () => {
    const earned = {};
    for (let i = 0; i < 401; i++) earned[new Date(Date.UTC(2020, 0, 1 + i)).toISOString().slice(0, 10)] = 'a';
    expect(() => sanitizeClientState({ earned })).toThrow();
    expect(() => sanitizeClientState({ stickers: Array.from({ length: 201 }, (_, i) => 'a' + i) })).toThrow();
    expect(() => sanitizeClientState({ starUnlocked: Array.from({ length: 101 }, (_, i) => 'a' + i) })).toThrow();
  });
});
