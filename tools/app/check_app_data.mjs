/* 앱 데이터 일관성 확인 — 어긋나면 종료 코드 1. 실행: node tools/app/check_app_data.mjs
   1) 카탈로그의 read / readEn 표시가 실제 파일과 맞는지 (잠자리 탭 목록의 근거)
   2) home.js 의 APP_VERSION 이 package.json 버전과 같은지
   3) tales/stickers.js: 카탈로그의 모든 동화에 10칸, k 형식·중복, img 파일이 있는지 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const src = readFileSync(join(root, 'tales/catalog.js'), 'utf8');
const TALES = new Function(src + '; return TALES;')();
let bad = 0;
for (const t of TALES) {
  const d = join(root, 'tales', t.folder || t.id);
  const ko = existsSync(join(d, 'read_script_el.json')) && existsSync(join(d, 'read_narration_el.js'));
  const en = existsSync(join(d, 'read_script_en.json')) && existsSync(join(d, 'read_narration_el_en.js'));
  const acts = existsSync(join(d, (t.folder || t.id) + '.js')) && /T\.readPlay\(/.test(readFileSync(join(d, (t.folder || t.id) + '.js'), 'utf8'));
  const wantKo = ko && acts, wantEn = wantKo && en;
  if (!!t.read !== wantKo) { console.log(`어긋남 ${t.id}: read=${!!t.read}, 파일·readPlay=${wantKo}`); bad++; }
  if (t.read) for (const k of ['key_wide', 'key_tall', 'tile']) if (!existsSync(join(root, 'assets/thumbs', `${t.id}_${k}.webp`))) { console.log(`없음 ${t.id}: 잠자리 플레이어 표지 ${t.id}_${k}.webp`); bad++; }
  if (!!t.readEn !== wantEn) { console.log(`어긋남 ${t.id}: readEn=${!!t.readEn}, 영어 파일=${wantEn}`); bad++; }
}
const STICKERS = new Function(readFileSync(join(root, 'tales/stickers.js'), 'utf8') + '; return STICKERS;')();
for (const t of TALES) {
  const a = STICKERS[t.id] || [];
  if (a.length !== 10) { console.log(`어긋남 스티커 ${t.id}: ${a.length}칸`); bad++; }
  if (new Set(a.map(c => c.k)).size !== a.length || a.some(c => !/^[a-z0-9_]{1,40}$/.test(c.k))) { console.log(`어긋남 스티커 ${t.id}: k 형식·중복`); bad++; }
  for (const c of a) if (c.img && !existsSync(join(root, c.img))) { console.log(`어긋남 스티커 ${t.id}.${c.k}: 파일 없음 ${c.img}`); bad++; }
}
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
const av = (readFileSync(join(root, 'home.js'), 'utf8').match(/APP_VERSION = '([^']+)'/) || [])[1];
if (av !== pkg) { console.log(`어긋남 APP_VERSION: home.js=${av}, package.json=${pkg}`); bad++; }
console.log(bad ? `오류 ${bad}건` : `통과: ${TALES.length}편 중 읽어 주기 ${TALES.filter(t => t.read).length}편, 영어 ${TALES.filter(t => t.readEn).length}편`);
process.exit(bad ? 1 : 0);
