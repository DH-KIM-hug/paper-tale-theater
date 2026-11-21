// 처리방침 페이지를 서버 코드에 넣는다. 원본은 저장소 루트 privacy.html (공개 깃허브 페이지와 같은 내용).
// 실행: node scripts/gen_privacy.mjs  → src/privacy_page.js 를 다시 만든다. privacy.html 을 고친 뒤 꼭 다시 실행.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
let html = readFileSync(join(here, '../../privacy.html'), 'utf8');
// 아이콘은 상대 경로라 서버 주소에서는 안 열린다 → 공개 페이지의 절대 주소로 바꾼다
html = html.replaceAll('href="assets/', 'href="https://dh-kim-hug.github.io/paper-tale-theater/assets/');
const out = `// 자동 생성(server/scripts/gen_privacy.mjs). 손으로 고치지 말 것.\nexport const PRIVACY_HTML = ${JSON.stringify(html)};\n`;
writeFileSync(join(here, '../src/privacy_page.js'), out);
console.log('privacy_page.js bytes', out.length);
