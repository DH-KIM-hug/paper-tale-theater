/* 앱에 넣지 않을 assets/v3w 그림 목록 — build_www.sh 가 이 목록을 rsync --exclude-from 으로 쓴다 (2026-11-04 용량 줄이기: 코드가 한 번도 부르지 않는 그림은 앱에 안 넣는다)
   실행: node tools/app/unused_v3w.mjs > tools/app/v3w_exclude.txt   (줄마다 assets/v3w 아래 파일 이름)
   원본 그림은 지우지 않는다. 앱 묶음(www/)에 복사만 하지 않는다. 모르겠으면 쓰는 것으로 둔다(깨진 그림이 안 빠지는 것이 우선).
   검사하는 코드 = 앱에 들어가는 js·html·json·css (루트 파일, engine, tales, sounds). 녹음 대본(voice_script*, read_script*)·*.md·*.txt 는 제외.
   쓰는 것으로 보는 규칙:
   1) 글자로 적힌 이름: 코드의 [A-Za-z0-9_] 조각이 그림 이름(확장자 뺀 것)과 같으면 쓴다.
      끝에 얼굴 없는 그림 표시·판 표시(nf, v2, v3, _in, _nf, _v2)가 붙은 꼴도 같은 그림으로 본다(heungbu·wolf_goats·three_pigs 의 NF 표).
   2) 템플릿 `tp2_${k}_s${i}`, `v3w/pj_bean_cluster${n}` : ${} 를 아무 글자로 보고 이름 모양(정규식)으로 맞는 그림을 모두 쓴다.
      ${} 가 끝에만 있는 모양(앞부분만 있는 이름)은 나머지 이름이 코드에 글자로 적힌 이름일 때만 쓴다.
   3) 문자열 이음 'ud_layer_' + k + '.webp', AS + 'mer_' + k : 같은 방식으로 모양을 만들어 맞춘다.
   4) 앞부분 조각('mer_bg5_', 'bg_' …, 글자 + 이음표 앞이나 조건식 안에 있는 밑줄로 끝나는 이름): 앞부분이 같고 나머지 이름이 코드에 적힌 그림.
   5) 끝부분 조각('_lb_glow', '_v2', '_front' …): 그 조각을 뺀 이름이 이미 쓰는 그림이면 쓴다. 더 늘지 않을 때까지 되풀이.
   확인: 이 규칙이 놓친 그림이 없는지 헤드리스 크롬으로 동화를 열어 요청 기록과 맞춰 본다(규칙에 안 잡힌 그림이 불리면 그 파일이 아니라 규칙을 고친다). */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const files = readdirSync(join(root, 'assets', 'v3w')).filter(f => f.endsWith('.webp'));
const stems = new Map(files.map(f => [f.slice(0, -5), f]));
const SRC = /\.(js|html|json|css)$/;
const SKIP_DIR = new Set(['node_modules', '.git', '__pycache__', 'source']);
const texts = [];
const walk = (dir, deep) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f), st = statSync(p);
    if (st.isDirectory()) { if (!SKIP_DIR.has(f)) walk(p, true); }
    else if (SRC.test(f) && !/^voice_script|^read_script|\.min\./.test(f)) texts.push([p, readFileSync(p, 'utf8')]);
  }
};
for (const f of readdirSync(root)) { const p = join(root, f); if (statSync(p).isFile() && SRC.test(f) && !/^(review|game|legacy)\./.test(f)) texts.push([p, readFileSync(p, 'utf8')]); }
for (const d of ['engine', 'tales', 'sounds']) walk(join(root, d));
const used = new Set();
const SUFFIX = /^(nf|v2|v3|_in|_v2|_nf)?$/;
const tokens = new Set();
const prefixes = new Set();   // 앞부분 조각(나머지는 글자로 적힌 이름이어야 함)
const suffixes = new Set();   // 끝부분 조각
const pats = [];              // 이름 모양(정규식)
const esc = x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/* 조합 모양 → 정규식. parts: 글자 조각 또는 null(아무 글자) */
const addPat = parts => {
  /* 마지막 폴더 뒤부터만 본다 */
  let i = -1; parts.forEach((x, k) => { if (x !== null && x.includes('/')) i = k; });
  if (i >= 0) { parts = parts.slice(i); parts[0] = parts[0].slice(parts[0].lastIndexOf('/') + 1); }
  parts = parts.map(x => x === null ? x : x.replace(/\.webp.*$/, '')).filter((x, k, a) => x !== '' && !(x === null && a[k - 1] === null));
  const lits = parts.filter(x => x !== null);
  if (!lits.some(x => /[A-Za-z0-9]{2,}/.test(x))) return;
  if (parts.length === 2 && parts[1] === null) { prefixes.add(parts[0]); return; }   // 앞부분 + 아무 글자: 4)
  if (parts.length === 1 && parts[0] !== null) return;
  pats.push(new RegExp('^' + parts.map(x => x === null ? '[A-Za-z0-9_]*' : esc(x)).join('') + '$'));
};
const LIT = `'[^'\\n]*'|"[^"\\n]*"`;
const OPER = String.raw`(?:[A-Za-z_$][\w$]*(?:\.[\w$]+|\[[^\]\n]*\]|\((?:[^()\n]|\((?:[^()\n]|\([^()\n]*\))*\))*\))*|\((?:[^()\n]|\((?:[^()\n]|\([^()\n]*\))*\))*\))`;
const CHAIN = new RegExp(`(?:${LIT}|${OPER})(?:\\s*\\+\\s*(?:${LIT}|${OPER}))+`, 'g');
const ITEM = new RegExp(`${LIT}|${OPER}`, 'g');
for (const [, t] of texts) {
  for (const m of t.matchAll(/[A-Za-z0-9_]+/g)) tokens.add(m[0]);
  /* 2) 백틱 템플릿 */
  for (const m of t.matchAll(/`([^`\n]*\$\{[^`\n]*)`/g)) {
    const parts = []; let last = 0;
    for (const e of m[1].matchAll(/\$\{(?:[^{}]|\{[^{}]*\})*\}/g)) { parts.push(m[1].slice(last, e.index)); parts.push(null); last = e.index + e[0].length; }
    parts.push(m[1].slice(last)); addPat(parts);
  }
  /* 3) 문자열 이음 */
  for (const m of t.matchAll(CHAIN)) {
    const parts = [];
    for (const it of m[0].matchAll(ITEM)) {
      const x = it[0];
      if (/^['"]/.test(x)) parts.push(x.slice(1, -1)); else parts.push(null);
    }
    addPat(parts);
  }
  /* 4)(5) 조건식 안 등에 놓인 밑줄로 끝나는/시작하는 이름 조각 */
  for (const m of t.matchAll(/['"`]([A-Za-z0-9_]*_)['"`]/g)) if (m[1].length >= 3) prefixes.add(m[1]);
  for (const m of t.matchAll(/['"`](_[A-Za-z0-9_]+)['"`]/g)) suffixes.add(m[1]);
}
for (const u of ['nf', 'v2', 'v3', '_in', '_nf', '_v2']) suffixes.add(u);
/* 1) 글자로 적힌 이름 (+ 접미 표시) */
for (const [s, f] of stems) {
  if (tokens.has(s)) { used.add(f); continue; }
  for (const suf of ['nf', 'v2', 'v3', '_in', '_v2', '_nf']) if (s.endsWith(suf) && tokens.has(s.slice(0, -suf.length))) { used.add(f); break; }
}
/* 2)3) 이름 모양 */
for (const [s, f] of stems) if (!used.has(f) && pats.some(r => r.test(s))) used.add(f);
/* 4) 앞부분 조각 + 코드에 적힌 나머지 이름 */
const SUFS = ['_lb_glow', '_lb', '_v2', '_v3', '_in', '_nf', 'v2', 'v3', 'nf', '_front', '_b'];
/* 나머지 이름이 코드에 적힌 조각(3글자 이상 이름·밑줄로 끝나는 앞부분·숫자)을 이어 붙인 것이면 쓴다 ('wrong_' + id 처럼 다른 곳에서 이어 붙이는 경우) */
const pieceSet = new Set([...tokens].filter(x => x.length >= 3));
const memo = new Map();
const can = r => {
  if (r === '') return true;
  if (memo.has(r)) return memo.get(r);
  memo.set(r, false);
  let ok = pieceSet.has(r) || /^\d+$/.test(r) || tokens.has(r);
  for (let i = 1; !ok && i < r.length; i++) {
    const a = r.slice(0, i);
    if (!(pieceSet.has(a) || prefixes.has(a) || /^\d+$/.test(a) || tokens.has(a + '_'))) continue;
    if (can(r.slice(i)) || (r[i] === '_' && can(r.slice(i + 1)))) ok = true;
  }
  if (!ok) for (const u of SUFS) if (r.endsWith(u) && r.length > u.length && can(r.slice(0, -u.length))) { ok = true; break; }
  if (!ok) { const d = r.replace(/_?\d+$/, ''); if (d !== r && can(d)) ok = true; }
  memo.set(r, ok); return ok;
};
const partOk = can;
const px = [...prefixes];
for (const [s, f] of stems) if (!used.has(f) && px.some(p => s.startsWith(p) && s.length > p.length && partOk(s.slice(p.length)))) used.add(f);
/* 짧은 조각(bg_, layer_ …)은 어느 동화 접두어와 붙을지 몰라 첫 밑줄 뒤에서도 본다 */
for (const p of px) if (/^(bg_|layer_|cut_|prop_|chip_|lb_)/.test(p)) for (const [s, f] of stems) if (!used.has(f)) { const i = s.indexOf('_'); if (i > 0 && s.slice(i + 1).startsWith(p) && partOk(s.slice(i + 1 + p.length))) used.add(f); }
/* 5) 끝부분 조각: 그것을 뺀 이름이 쓰는 그림이면 쓴다(되풀이) */
for (let again = true; again;) {
  again = false;
  for (const [s, f] of stems) if (!used.has(f)) for (const u of suffixes) if (s.endsWith(u) && s.length > u.length && used.has(s.slice(0, -u.length) + '.webp')) { used.add(f); again = true; break; }
}
const out = files.filter(f => !used.has(f)).sort();
process.stderr.write(`v3w ${files.length}개 중 안 쓰는 ${out.length}개\n`);
process.stdout.write(out.join('\n') + '\n');
