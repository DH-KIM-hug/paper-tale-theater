#!/usr/bin/env node
// 운영자용: 보호자 '정보'의 기기 번호(계정 ID 앞 8자리)로 서버 기록을 찾아 지운다.
// 사용: node tools/delete_by_prefix.mjs <8자리>          (찾은 키만 보여 줌: dry-run, 기본)
//       node tools/delete_by_prefix.mjs <8자리> --yes    (실제로 지움)
// 옵션: --local 이면 로컬 KV (기본은 원격). server/ 안에서 실행한다.
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const prefix = (args.find((a) => !a.startsWith('--')) || '').toLowerCase();
const yes = args.includes('--yes');
const where = args.includes('--local') ? ['--local'] : [];   // 이 wrangler 에는 --remote 옵션이 없고 기본이 원격
if (!/^[0-9a-f]{8}$/.test(prefix)) { console.error('기기 번호는 영문 소문자·숫자(0-9 a-f) 8자리여야 해요.'); process.exit(2); }

const wr = (...a) => execFileSync('npx', ['wrangler', 'kv', 'key', ...a, '--binding', 'ACCOUNTS', '--preview', 'false', ...where], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 1 << 26 });
const list = (p) => JSON.parse(wr('list', '--prefix', p)).map((k) => k.name);
const get = (k) => { try { return JSON.parse(wr('get', k)); } catch { return null; } };

const accts = list('acct:' + prefix);
if (accts.length === 0) { console.log('이 번호로 시작하는 계정이 없어요: ' + prefix); process.exit(0); }
if (accts.length > 1) { console.error('여러 계정이 걸렸어요. 지우지 않아요. 전체 번호를 확인하세요:\n' + accts.join('\n')); process.exit(1); }

const key = accts[0];
const id = key.slice('acct:'.length);
const rec = get(key) || {};
const del = [key];            // 지울 키
const edit = [];              // 계정만 빼고 남길 영수증 키 { key, value }
for (const h of rec.receipts || []) {
  const rk = 'receipt:' + h;
  const r = get(rk);
  if (!r) continue;
  const left = (r.accounts || []).filter((a) => a !== id);
  if (left.length) edit.push({ key: rk, value: JSON.stringify({ ...r, accounts: left }) });
  else del.push(rk);
}
for (const k of list('link:')) { const v = get(k); if (v && v.accountId === id) del.push(k); }   // 10분짜리 연결 코드
for (const k of [...list('rl:linkc:' + id), ...list('rl:linkr:' + id)]) del.push(k);               // 속도 제한 카운터

console.log((yes ? '지울 키 ' : '[dry-run] 지울 키 ') + del.length + '개:'); del.forEach((k) => console.log('  - ' + k));
if (edit.length) { console.log('이 계정만 빼고 남길 영수증 ' + edit.length + '개:'); edit.forEach((e) => console.log('  ~ ' + e.key)); }
if (!yes) { console.log('\n실제로 지우려면 --yes 를 붙여 다시 실행하세요.'); process.exit(0); }
for (const e of edit) wr('put', e.key, e.value);
for (const k of del) wr('delete', k);
console.log('끝. 지운 키 ' + del.length + '개.');
