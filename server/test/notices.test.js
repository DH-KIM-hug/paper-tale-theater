import { describe, expect, it } from 'vitest';
import { cleanNotices, NOTICE_MAX } from '../src/notices.js';
import raw from '../notices.json';
import { call, makeEnv } from './helpers/kv.js';

describe('공지 GET /v1/notices', () => {
  it('인증 없이 200, notices.json 의 공지를 한·영으로 돌려준다', async () => {
    const env = makeEnv();
    const r = await call(env, 'GET', '/v1/notices');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.json.notices)).toBe(true);
    expect(r.json.notices.length).toBe(raw.notices.length);
    const n = r.json.notices[0];
    expect(n.id).toMatch(/^[a-z0-9]/);
    expect(n.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(n.title.ko && n.title.en).toBeTruthy();
    expect(n.body.ko && n.body.en).toBeTruthy();
  });
  it('공개 캐시 헤더, 끝의 / 도 같은 경로', async () => {
    const env = makeEnv();
    const r = await call(env, 'GET', '/v1/notices/');
    expect(r.status).toBe(200);
    expect(r.headers.get('cache-control')).toBe('public, max-age=600');
  });
  it('아무것도 저장하지 않는다(KV 그대로)', async () => {
    const env = makeEnv();
    await call(env, 'GET', '/v1/notices');
    expect(env.ACCOUNTS.keys()).toHaveLength(0);
  });
  it('앱 출처에는 CORS 허용, 모르는 출처에는 없음', async () => {
    const env = makeEnv();
    const ok = await call(env, 'GET', '/v1/notices', { origin: 'capacitor://localhost' });
    expect(ok.headers.get('access-control-allow-origin')).toBe('capacitor://localhost');
    const no = await call(env, 'GET', '/v1/notices', { origin: 'https://evil.example' });
    expect(no.headers.get('access-control-allow-origin')).toBeNull();
  });
  it('다른 메서드는 404', async () => {
    const env = makeEnv();
    expect((await call(env, 'POST', '/v1/notices', { body: {} })).status).toBe(404);
  });
  it('모양이 틀린 공지는 빼고 최신순·상한으로 자른다', () => {
    const many = Array.from({ length: NOTICE_MAX + 5 }, (_, i) => ({ id: 'n' + i, date: `2026-01-${String((i % 28) + 1).padStart(2, '0')}`, title: { ko: '공지' + i }, body: { ko: '본문' } }));
    const bad = [null, { id: 'Bad ID', date: '2026-01-01', title: { ko: 'x' } }, { id: 'ok', date: '26-1-1', title: { ko: 'x' } }, { id: 'ok2', date: '2026-01-01', title: {} }, { id: 'ok3', date: '2026-01-01', title: { ko: '<b>x</b>'.repeat(100) } }];
    const out = cleanNotices({ notices: [...bad, ...many] });
    expect(out).toHaveLength(NOTICE_MAX);
    expect(out[0].date >= out[out.length - 1].date).toBe(true);
    expect(out.every((n) => n.id.startsWith('n'))).toBe(true);
    expect(cleanNotices(null)).toEqual([]);
    expect(cleanNotices({ notices: 'x' })).toEqual([]);
  });
  it('빈 원본이면 빈 목록', async () => {
    const env = makeEnv();
    const r = await call(env, 'GET', '/v1/notices', { deps: { noticesSource: { notices: [] } } });
    expect(r.json).toEqual({ notices: [] });
  });
});
