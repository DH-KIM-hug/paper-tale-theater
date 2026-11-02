/* 앱에 넣을 녹음 목록 — build_www.sh 가 이 목록의 파일만 audio/ 에 복사한다 (2026-11-02 출시 점검: 녹음은 실제로 쓰는 것만)
   실행: node tools/app/used_audio.mjs > 목록.txt   (줄마다 audio/ 아래 경로: el/rabbit/nar_….mp3)
   쓰는 것 =
   1) 동화마다 index.html 이 읽는 녹음 맵(narration*.js, chorus*.js …)을 순서대로 실행한 뒤 남은 값.
      Typecast 맵(narration.js)에 ElevenLabs 맵(narration_el.js)이 덮어쓰므로 덮인 Typecast 클립은 빠진다.
      (?voice=tc 는 개발용 전환이라 앱에서는 쓰지 않는다)
   2) 읽어 주기 맵(read_narration_el*.js) 의 모든 값
   3) 그 밖의 코드·데이터(동화 js·json, engine, 홈·잠자리, 루트 js)에 글자로 적힌 audio 경로 전부 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const used = new Set();
const PATH_RE = /(?:audio\/)?((?:el|tc|bremen)\/[A-Za-z0-9_\-./]+\.(?:mp3|json|m4a|ogg))/g;
const addStr = s => { for (const m of String(s).matchAll(PATH_RE)) used.add(m[1]); addTpl(s); };
/* 이름을 조합해 부르는 경로(`audio/el/count/ko_${i + 1}.mp3` 같은 템플릿): 앞부분이 같은 파일을 모두 넣는다 */
const TPL_RE = /(?:audio\/)?((?:el|tc)\/[A-Za-z0-9_\-/]+\/)([A-Za-z0-9_\-]*)\$\{/g;
const prefixes = [];
const addTpl = s => { for (const m of String(s).matchAll(TPL_RE)) prefixes.push([m[1], m[2]]); };
const walk = v => { if (typeof v === 'string') addStr(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
const GLOBALS = ['NARRATION_CLIPS', 'NARRATION_CLIPS_EN', 'VOICE_LINES', 'VOICE_LINES_EN', 'CHORUS_CLIPS', 'CHORUS_CLIPS_EN'];
/* 맵 파일들을 한 함수 안에서 차례로 실행하고, 위쪽에 선언된 이름들의 최종 값을 돌려받는다 */
function evalMaps(texts, pre) {
  const body = texts.join('\n;\n');
  const names = new Set(GLOBALS);
  for (const m of body.matchAll(/(?:^|;)[ \t]*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm)) names.add(m[1]);
  const declared = new Set([...body.matchAll(/(?:^|;)[ \t]*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/gm)].map(m => m[1]));
  const preNames = [...names].filter(n => !declared.has(n));
  const fn = new Function('window', 'document', 'localStorage', ...preNames,
    body + '\n;return {' + [...names].map(n => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`).join(',') + '};');
  const ls = { getItem: () => null, setItem() {}, removeItem() {} };
  return fn({}, { currentScript: null }, ls, ...preNames.map(n => (pre && n in pre ? pre[n] : {})));
}
const tdir = join(root, 'tales');
for (const t of readdirSync(tdir)) {
  const d = join(tdir, t), idx = join(d, 'index.html');
  if (!existsSync(idx)) continue;
  const html = readFileSync(idx, 'utf8');
  const srcs = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1].split('?')[0])
    .filter(s => !s.startsWith('../') && !s.startsWith('/') && s !== `${t}.js` && existsSync(join(d, s)));
  try { walk(evalMaps(srcs.map(s => readFileSync(join(d, s), 'utf8')))); }
  catch (e) { console.error(`맵 실행 실패 ${t}: ${e.message} → 맵 파일의 경로를 모두 넣음`); srcs.forEach(s => addStr(readFileSync(join(d, s), 'utf8'))); }
  for (const f of ['read_narration_el.js', 'read_narration_el_en.js']) if (existsSync(join(d, f))) addStr(readFileSync(join(d, f), 'utf8'));
  /* 맵이 아닌 동화 파일(동화 js, json …)에 적힌 경로 */
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isFile() && /\.(js|json|html)$/.test(f) && !srcs.includes(f) && !/^read_narration_el/.test(f)) addStr(readFileSync(p, 'utf8'));
  }
}
for (const f of readdirSync(root)) if (/\.(js|html)$/.test(f) && statSync(join(root, f)).isFile()) addStr(readFileSync(join(root, f), 'utf8'));
for (const f of readdirSync(join(root, 'engine'))) if (/\.js$/.test(f)) addStr(readFileSync(join(root, 'engine', f), 'utf8'));
/* 브레멘 음악은 코드가 폴더 + 이름으로 부른다(bremen.js musicRoot + MUSIC_FILE·timing 이름) → bremen.js 에 글자로 적힌 이름만 */
{ const b = readFileSync(join(root, 'tales/bremen/bremen.js'), 'utf8'); for (const f of readdirSync(join(root, 'audio/bremen'))) if (!/\.wav$/.test(f) && b.includes("'" + f + "'")) used.add('bremen/' + f); }
for (const [dir, pre] of prefixes) { const d = join(root, 'audio', dir); if (existsSync(d)) for (const f of readdirSync(d)) if (f.startsWith(pre) && /\.mp3$/.test(f)) used.add(dir + f); }
const out = [...used].filter(p => existsSync(join(root, 'audio', p))).sort();
const missing = [...used].filter(p => !existsSync(join(root, 'audio', p)));
if (missing.length) console.error(`코드에 적혔지만 파일 없음 ${missing.length}개 (예: ${missing.slice(0, 3).join(', ')})`);
process.stdout.write(out.join('\n') + '\n');
