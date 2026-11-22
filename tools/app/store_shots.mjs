// App Store 스크린샷 만들기 (2026-11-07)
// 실제 앱 코드를 헤드리스 크롬으로 기기 크기(아이패드 13" 가로 1376×1032@2, 아이폰 6.9" 1320×2868 = 440×956@3,
// iPhone Duo 바깥 1398×2034 = 466×678@3, 안쪽 2007×2853 = 669×951@3 — 2026-11-18)에서 찍고,
// 위에 문구 띠를 붙여 정확한 픽셀 크기의 PNG(알파 없음)로 저장한다.
//
// 준비: 저장소 루트를 정적 서버로 연다(8791 은 쓰지 않는다).
//   python3 -m http.server 8931 --bind 127.0.0.1
// 실행:
//   PLAYWRIGHT=<playwright-core 폴더> node tools/app/store_shots.mjs all            # ko·en × ipad13·iphone69 전부
//   node tools/app/store_shots.mjs duo                                              # ko·en × duo_outer·duo_inner (iPhone Duo)
//   node tools/app/store_shots.mjs set ko ipad13                                    # 한 묶음만
//   node tools/app/store_shots.mjs probe ipad13 ko '{"tale":"heungbu","skipto":"<대사>","go":1,"wait":6500,"say":true}' /tmp/x.png  # 한 장면 시험(문구 띠 없이)
// 환경 변수: BASE(기본 http://127.0.0.1:8931), CHROME(크롬 실행 파일), PLAYWRIGHT(playwright-core 경로),
//            OUT(기본 store/screenshots/v2), SHEET_DIR(대조표 jpg 폴더, 없으면 만들지 않음)
// 장면 고르기: 동화 엔진의 검증 모드(?verify=1&skipto=대사)로 그 대사까지 소리 없이 건너뛴 뒤, go 를 n 번 보내고 기다려 찍는다.
// 조작 장면은 안내 대사 다음 go 1번 → 조작 대기 → 5초 뒤 엔진이 손가락 힌트를 띄운다.
// 규칙: 아이 이름·사진이 들어간 창작 동화(kkultteok·red_car·unicorn·witch_candy)와 그 스티커는 쓰지 않는다. 쿠폰·가격·개발 화면 없음.
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pwPath = process.env.PLAYWRIGHT || 'playwright-core';
const { chromium } = require(pwPath);
const BASE = process.env.BASE || 'http://127.0.0.1:8931';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = process.env.OUT || path.join(ROOT, 'store/screenshots/v2');
const SHEET_DIR = process.env.SHEET_DIR || '';

const DEVICES = {
  ipad13: { vw: 1376, vh: 1032, dpr: 2, W: 2752, H: 2064 },
  iphone69: { vw: 440, vh: 956, dpr: 3, W: 1320, H: 2868 },
  /* iPhone Duo(접는 아이폰, 2026-11-18 사용자 결정: 필수로 올림). 바깥 화면 1398×2034, 펼친 안쪽 화면 2007×2853, 둘 다 세로(아이폰 세트와 같은 방향).
     like: 장면 고르기의 기기별 바꿈(s.iphone69 등)을 그대로 물려받는다. frac: 문구 띠 아래 화면 높이 비율 */
  duo_outer: { vw: 466, vh: 678, dpr: 3, W: 1398, H: 2034, like: 'iphone69', frac: 0.76 },
  duo_inner: { vw: 669, vh: 951, dpr: 3, W: 2007, H: 2853, like: 'iphone69', frac: 0.78 },
};
const BANNED = ['kkultteok', 'red_car', 'unicorn', 'witch_candy'];

/* ---------- 찍을 장면 ----------
   kind: tale(검증 모드 skipto) | read(읽어 주기 ?read=1, 시작 뒤 ms 기다림) | home | bedtime
   cap: { ko: [제목, 부제], en: [...] } */
const HOME_SCROLL = re => `(()=>{const h=[...document.querySelectorAll("h2,h3,h4,section")].find(e=>${re}.test(e.textContent)&&e.textContent.length<20);const r=h.getBoundingClientRect();let n=h;while(n&&n!==document.body){const cs=getComputedStyle(n);if(/(auto|scroll)/.test(cs.overflowY)&&n.scrollHeight>n.clientHeight)break;n=n.parentElement}(n&&n!==document.body?n:document.scrollingElement).scrollTop+=r.top-70;})()`;
const SHOTS = [
  /* 1. 이야기 장면 — 인어공주 첫 장면(바다 밑 인어 나라) */
  { id: 'story', kind: 'tale', tale: 'little_mermaid', skipto: '깊고 깊은 바다 밑에 인어 나라가 있었어요. 바다 왕님과 할머니, 여섯 공주가 살았지요.', wait: 3500,
    cap: { ko: ['종이로 오린 그림 동화', '명작 동화 30편이 종이 무대로 펼쳐져요'], en: ['Paper-cut storybooks', '30 classic tales on a layered paper stage'] } },
  /* 2. 고르기 — 아이패드: 인어공주 '바다에 사는 친구'(분류), 아이폰: 해와 달 '진짜 엄마 손'(세로에서 인어공주 장면은 인물이 흐리게 눌려 보여 바꿈) */
  { id: 'choose', kind: 'tale', tale: 'little_mermaid', skipto: '바다에 사는 친구는 누구일까요?', go: 1, wait: 6500, say: true,
    iphone69: { tale: 'sunmoon', skipto: '진짜 엄마 손은 뭘까요? 잘 보고 골라 봐요!' },
    cap: { ko: ['고르며 배워요', '이야기 속 문제를 톡 눌러 풀어요'], en: ['Think and choose', 'Tap to answer questions inside the story'] } },
  /* 3. 순서 — 미녀와 야수 창밖 아침·낮·밤 */
  { id: 'order', kind: 'tale', tale: 'beauty_beast', skipto: '창밖은 아침, 낮, 밤으로 바뀌어요. 아침부터 차례로 눌러 봐요.', go: 1, wait: 6500, say: true,
    cap: { ko: ['차례를 맞혀요', '아침, 낮, 밤 — 다음은 무엇일까요?'], en: ['Put it in order', 'Morning, noon, night: what comes next?'] } },
  /* 4. 세기 + 손가락 힌트 — 콩쥐팥쥐 참새 */
  { id: 'count', kind: 'tale', tale: 'kongjwi', skipto: '참새들이 콕콕 쪼아서 껍질을 벗겨 주었어요. 참새를 하나씩 세어 봐요!', go: 1, wait: 6500, say: true,
    cap: { ko: ['하나씩 세어 봐요', '손가락 힌트가 누를 곳을 알려 줘요'], en: ['Count one by one', 'A little hand shows where to tap'] } },
  /* 5. 크기 순서 — 골디락스 그릇 */
  { id: 'size', kind: 'tale', tale: 'goldilocks', skipto: '가장 작은 그릇부터 차례대로 톡 눌러요.', go: 1, wait: 6500, say: true,
    cap: { ko: ['크기를 견줘요', '가장 작은 그릇부터 차례로 톡톡'], en: ['Compare sizes', 'Tap the bowls from smallest to biggest'] } },
  /* 6. 읽어 주기 — 해와 달이 된 오누이, 동아줄 타고 하늘로(읽어 주기 모드). 인어공주 불꽃놀이는 영어에서 카메라가 확대 중에 찍혀 바꿈 */
  { id: 'read', kind: 'tale', read: true, tale: 'sunmoon', skipto: '구름을 여섯 겹이나 뚫고, 오누이는 하늘 나라에 닿았어요!', wait: 3200,
    cap: { ko: ['읽어 주는 동화', '한 줄 한 줄 목소리로 읽어 줘요'], en: ['Read-aloud stories', 'Every line is read aloud'] } },
  /* 7. 영어 공부 — 화면 언어를 세트 언어와 반대로(ko 세트=영어 화면, en 세트=한국어 화면). 아기 돼지 삼 형제 */
  { id: 'english', kind: 'tale', flip: true, tale: 'three_pigs', skipto: '엄마 돼지가 말했어요. "이제 너희도 다 컸구나. 세상에 나가서 각자 집을 지어 보렴."', wait: 2800,
    cap: { ko: ['영어 공부도 해요', '같은 동화를 영어로 듣고 읽어요'], en: ['Hear it in Korean, too', 'Every tale in Korean and English'] } },
  /* 8. 잠자리 이어 듣기 플레이어 */
  { id: 'bedtime', kind: 'page', url: '/bedtime.html?mode=random&ids=little_mermaid,sunmoon&count=2&auto=1', wait: 9000,
    cap: { ko: ['잠자리 동화', '화면을 꺼도 이어서 들려줘요'], en: ['Bedtime listening', 'Keeps reading with the screen off'] } },
  /* 9. 동화 목록 — 창작 동화 줄(아이 캐릭터)이 안 보이게 '공주' 줄부터 */
  { id: 'library', kind: 'page', url: '/index.html?splash=0', wait: 2500, eval: HOME_SCROLL('/공주/'), en: { eval: HOME_SCROLL('/Princess/') },
    cap: { ko: ['명작 동화 30편', '이솝 우화, 우리 옛이야기, 세계 명작'], en: ['30 classic tales', "Aesop's fables, Korean and world folktales"] } },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function newPage(browser, dev, lang, flip) {
  if (flip) lang = lang === 'ko' ? 'en' : 'ko'; // flip: 화면 언어를 세트 언어와 반대로
  const d = DEVICES[dev];
  const ctx = await browser.newContext({ viewport: { width: d.vw, height: d.vh }, deviceScaleFactor: d.dpr, hasTouch: true });
  await ctx.addInitScript(lang => {
    try {
      localStorage.setItem('lang', lang);
      localStorage.setItem('rot_hint_seen', '1');
      localStorage.setItem('review_ok', '1');
    } catch (e) { /* */ }
  }, lang);
  const page = await ctx.newPage();
  page.on('pageerror', e => console.warn('  pageerror', e.message.slice(0, 120)));
  return { ctx, page, d };
}

/* 동화 장면: 검증 모드 iframe 으로 skipto 대사까지 간 뒤 go n번 */
async function shootTale(browser, dev, lang, s) {
  if (BANNED.includes(s.tale)) throw new Error('banned tale ' + s.tale);
  const { ctx, page, d } = await newPage(browser, dev, lang, s.flip);
  const q = new URLSearchParams({ verify: '1' });
  if (s.skipto) q.set('skipto', s.skipto);
  if (s.read) q.set('read', '1');
  const btn = s.read ? '#readBtn' : '#startBtn';
  const url = `${BASE}/tales/${s.tale}/index.html?${q}`;
  await page.goto(BASE + '/privacy.html');
  let reached = false, steps = [];
  await page.exposeFunction('__step', m => { if (m && !m.skipped) { steps.push(m); if (!s.skipto || m.text === s.skipto) reached = true; } });
  await page.evaluate(([u, w, h]) => {
    document.head.innerHTML = '<style>html,body{margin:0;overflow:hidden;background:#000}</style>';
    document.body.innerHTML = `<iframe id="f" src="${u}" style="border:0;display:block;width:${w}px;height:${h}px"></iframe>`;
    window.addEventListener('message', e => { if (e.data && e.data.type === 'step') window.__step(e.data); });
  }, [url, d.vw, d.vh]);
  const frame = () => page.frames().find(f => f.url().includes('/tales/'));
  const t0 = Date.now(); let clicked = false;
  while (Date.now() - t0 < 240000 && !reached) {
    const f = frame();
    if (f && !clicked) {
      try { const st = await f.$('#startScreen:not([hidden]) ' + btn); if (st && await st.isVisible()) { await sleep(1200); await st.click(); clicked = true; } } catch (e) { /* 다시 */ }
    }
    await sleep(200);
  }
  if (!reached) console.warn('  not reached', s.tale, s.skipto);
  const go = async () => { const f = frame(); await f.evaluate(() => window.postMessage({ type: 'go' }, '*')); };
  for (let i = 0; i < (s.go || 0); i++) { await sleep(s.gap || 1500); await go(); }
  await sleep(s.wait ?? 2500);
  /* say: 조작 대기 중 엔진의 재안내(12초)처럼 안내 대사를 다시 띄운다 → 손가락 힌트와 말풍선이 함께 보이는 실제 화면 */
  if (s.say) { await frame().evaluate(t => { try { Narrator.speak(t); } catch (e) { /* */ } }, s.say === true ? s.skipto : s.say); await sleep(s.sayWait || 900); }
  const buf = await page.screenshot({ type: 'png' });
  await Promise.race([ctx.close(), sleep(5000)]);
  return buf;
}

/* 읽어 주기: ?read=1 로 열고 '읽어 주기'를 누른 뒤 기다린다 */
async function shootRead(browser, dev, lang, s) {
  const { ctx, page } = await newPage(browser, dev, lang);
  await page.goto(`${BASE}/tales/${s.tale}/index.html?read=1`);
  await page.waitForSelector('#readBtn:not([hidden])', { timeout: 30000 });
  await sleep(1500);
  await page.click('#readBtn');
  await sleep(s.wait || 15000);
  const buf = await page.screenshot({ type: 'png' });
  await Promise.race([ctx.close(), sleep(5000)]);
  return buf;
}

async function shootPage(browser, dev, lang, s) {
  const { ctx, page } = await newPage(browser, dev, lang);
  await page.goto(BASE + s.url);
  if (s.prep) await s.prep(page);
  if (s.eval) { await sleep(s.preWait || 3000); await page.evaluate(s.eval); }
  await sleep(s.wait || 4000);
  const buf = await page.screenshot({ type: 'png' });
  await Promise.race([ctx.close(), sleep(5000)]);
  return buf;
}

async function shoot(browser, dev, lang, s) {
  if (s.kind === 'tale') return shootTale(browser, dev, lang, s);
  if (s.kind === 'read') return shootRead(browser, dev, lang, s);
  return shootPage(browser, dev, lang, s);
}

/* ---------- 문구 띠 + 화면 합성 (Pretendard, 홈 UI 2판: #F3F3F1 바탕, 흰 카드 테두리, 감빛 #D9622F) ---------- */
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
async function compose(browser, dev, lang, raw, cap) {
  const d = DEVICES[dev];
  const ctx = await browser.newContext({ viewport: { width: d.W, height: d.H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const tall = d.H > d.W;   // 세로 기기(아이폰·iPhone Duo)
  const k = tall ? d.W / 1320 : 1;   // 글자 크기: 아이폰 6.9" 폭 기준으로 늘린다(아이폰은 1 그대로)
  // 화면 크기: 높이의 ~80% (가로 아이패드는 폭이 남으니 높이 기준, 세로 아이폰도 높이 기준). Duo 는 d.frac
  const sh = Math.round(d.H * (d.frac || 0.80));
  const sw = Math.round(sh * d.vw / d.vh);
  const top = d.H - sh - Math.round(d.H * (tall ? 0.035 : 0.04));
  const radius = Math.round(sw * (tall ? 0.07 : 0.025));
  const hs = tall ? Math.round(104 * k) : 118, ss = tall ? Math.round(50 * k) : 54;
  const fontUrl = BASE + '/assets/fonts/PretendardVariable.woff2';
  const b64 = raw.toString('base64');
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face{font-family:P;src:url(${fontUrl}) format('woff2');font-weight:45 920}
    html,body{margin:0;width:${d.W}px;height:${d.H}px;background:#F3F3F1;overflow:hidden;font-family:P,sans-serif}
    .cap{position:absolute;left:0;right:0;top:0;height:${top}px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 ${tall ? 70 : 120}px;box-sizing:border-box}
    .bar{width:${tall ? 64 : 72}px;height:${tall ? 12 : 12}px;border-radius:6px;background:#D9622F;margin-bottom:${tall ? 30 : 34}px}
    h1{margin:0;font-size:${hs}px;font-weight:850;letter-spacing:${lang === 'ko' ? '.02em' : '-.01em'};color:#2B2622;line-height:1.15;word-break:keep-all}
    p{margin:${tall ? 22 : 24}px 0 0;font-size:${ss}px;font-weight:560;color:#6E6760;letter-spacing:${lang === 'ko' ? '.02em' : '0'};line-height:1.3;word-break:keep-all}
    .shot{position:absolute;left:${Math.round((d.W - sw) / 2)}px;top:${top}px;width:${sw}px;height:${sh}px;border-radius:${radius}px;overflow:hidden;
      background:#fff;box-shadow:0 0 0 2px rgba(0,0,0,.06),0 18px 50px rgba(40,36,32,.16)}
    .shot img{display:block;width:100%;height:100%}
  </style></head><body>
    <div class="cap"><div class="bar"></div><h1>${esc(cap[0])}</h1>${cap[1] ? `<p>${esc(cap[1])}</p>` : ''}</div>
    <div class="shot"><img src="data:image/png;base64,${b64}"></div>
  </body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every(i => i.complete));
  await sleep(300);
  const buf = await page.screenshot({ type: 'png', omitBackground: false });
  await Promise.race([ctx.close(), sleep(5000)]);
  return buf;
}

/* 알파 없는 RGB PNG 로: 크롬 스크린샷은 RGBA 라 python PIL 로 바꾼다(없으면 sips) */
import { execFileSync } from 'child_process';
function toRGB(files) {
  const py = `import sys\nfrom PIL import Image\nfor f in sys.argv[1:]:\n  im=Image.open(f)\n  if im.mode!='RGB': im.convert('RGB').save(f,optimize=True)`;
  execFileSync('python3', ['-c', py, ...files]);
}
function sheet(files, dev, out) {
  const py = `import sys\nfrom PIL import Image\nout=sys.argv[1];fs=sys.argv[2:]\nims=[Image.open(f).convert('RGB') for f in fs]\nw=${dev === 'ipad13' ? 700 : dev === 'duo_inner' ? 420 : 330};h=int(ims[0].height*w/ims[0].width);c=4\nr=(len(ims)+c-1)//c\ns=Image.new('RGB',(w*c+10*(c+1),h*r+10*(r+1)),'#888')\nfor i,im in enumerate(ims): s.paste(im.resize((w,h),Image.LANCZOS),(10+(i%c)*(w+10),10+(i//c)*(h+10)))\ns.save(out,quality=86)`;
  execFileSync('python3', ['-c', py, out, ...files]);
}

async function runSet(browser, lang, dev, only) {
  const dir = path.join(OUT, lang, dev);
  fs.mkdirSync(dir, { recursive: true });
  const done = [];
  let n = 0;
  for (const s of SHOTS) {
    n++;
    if (only && !only.includes(s.id)) continue;
    const like = DEVICES[dev].like;   // Duo 는 아이폰 세로의 장면 바꿈을 물려받는다
    const ss = Object.assign({}, s, (like && s[like]) || {}, (s[dev] || {}), (s[lang] || {}), ((like && s[like]) || {})[lang] || {}, ((s[dev] || {})[lang] || {}));
    const file = path.join(dir, `${String(n).padStart(2, '0')}_${s.id}.png`);
    process.stdout.write(`${lang}/${dev}/${path.basename(file)} … `);
    const raw = await shoot(browser, dev, lang, ss);
    fs.writeFileSync(file.replace('.png', '.raw.png'), raw);
    const out = await compose(browser, dev, lang, raw, ss.cap[lang]);
    fs.writeFileSync(file, out);
    done.push(file);
    console.log('ok');
  }
  // raw 는 따로 보관 폴더로
  const rawDir = path.join(OUT, '_raw', lang, dev); fs.mkdirSync(rawDir, { recursive: true });
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.raw.png'))) fs.renameSync(path.join(dir, f), path.join(rawDir, f.replace('.raw', '')));
  const all = fs.readdirSync(dir).filter(f => /^\d\d_.*\.png$/.test(f)).sort().map(f => path.join(dir, f));
  toRGB(all);
  if (SHEET_DIR) sheet(all, dev, path.join(SHEET_DIR, `shots_sheet_${lang}_${dev}.jpg`));
  return done;
}

const [cmd, ...args] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
try {
  if (cmd === 'probe') {
    const [dev, lang, json, out] = args;
    const s = Object.assign({ kind: 'tale' }, JSON.parse(json));
    fs.writeFileSync(out, await shoot(browser, dev, lang, s));
    console.log('saved', out);
  } else if (cmd === 'set') {
    const [lang, dev, only] = args;
    await runSet(browser, lang, dev, only ? only.split(',') : null);
  } else if (cmd === 'all') {
    for (const lang of ['ko', 'en']) for (const dev of ['ipad13', 'iphone69']) await runSet(browser, lang, dev);
  } else if (cmd === 'duo') {   // iPhone Duo 두 크기만(2026-11-18)
    for (const lang of ['ko', 'en']) for (const dev of ['duo_outer', 'duo_inner']) await runSet(browser, lang, dev);
  } else {
    console.log('usage: probe|set|all — 맨 위 설명 참고');
  }
} finally { await Promise.race([browser.close(), sleep(5000)]); process.exit(0); }
