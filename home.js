/* 톡톡 동화극장 — 앱 홈: 태그로 고르기 (HOME_UI_PLAN.md v2) + 움직임 (v3)
   · 같은 줄 안에서 여러 개 = 또는(OR), 두 줄 사이 = 그리고(AND), 아무것도 안 고른 줄 = 전체
   · 고른 태그와 설정은 localStorage 에 기억 (막혀 있어도 정상 동작)
   · 움직임은 모두 seek(t) 방식: 장면마다 "t초일 때의 모습"만 계산한다. 건너뛰기 = 끝 시각으로 seek.
     transform(translate·scale·rotate)과 opacity 만 움직인다. '동작 줄이기' 설정이면 바로 끝 모습. */
(() => {
  const $ = s => document.querySelector(s);
  const STORE = 'paperTheater.home.v2';
  const RM = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const motion = () => !RM.matches;

  /* ── 움직임 도구 ── */
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const eo = t => 1 - Math.pow(1 - clamp(t), 3);
  /* 감쇠 스프링 0 → 1 (z 가 작을수록 더 튕기고, w 가 클수록 빠르다) */
  const spring = (t, z = .5, w = 15) => {
    if (t <= 0) return 0;
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + z * w / wd * Math.sin(wd * t));
  };
  /* 떨림 1 → 0 (눌렀을 때 종이가 출렁이다 멈춘다) */
  const wob = (t, z = .3, w = 24) => t < 0 ? 0 : Math.exp(-z * w * t) * Math.cos(w * Math.sqrt(1 - z * z) * t);
  /* 고정 씨앗 난수: 매번 같은 모양으로 흩어진다 */
  const rng = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  function play(dur, seek, done) {
    let alive = true, raf = 0, t0 = 0;
    const end = () => { if (!alive) return; alive = false; cancelAnimationFrame(raf); seek(dur); if (done) done(); };
    const h = { finish: end, get alive() { return alive; } };
    if (!motion()) { end(); return h; }
    seek(0);
    const step = now => {
      if (!alive) return;
      if (!t0) t0 = now;
      const t = (now - t0) / 1000;
      if (t >= dur) { end(); return; }
      seek(t);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return h;
  }
  const tf = (el, x, y, s = 1, r = 0) => {
    el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
    el.style.scale = typeof s === 'number' ? s.toFixed(4) : s;
    el.style.rotate = `${r.toFixed(2)}deg`;
  };
  const untf = el => { el.style.translate = el.style.scale = el.style.rotate = el.style.opacity = ''; };

  /* ── 저장 ── */
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ origin: [...sel.origin], skill: [...sel.skill], speak, tagsOff })); } catch (e) { /* 무시 */ }
  }
  const saved = load();
  const valid = (row, list) => (Array.isArray(list) ? list : []).filter(k => TAGS[row].some(t => t.key === k));
  const sel = { origin: new Set(valid('origin', saved.origin)), skill: new Set(valid('skill', saved.skill)) };
  let speak = saved.speak !== false;
  /* 앱 화면(앱 모드): 큰 동화 하나 + 작은 목록. 태그는 처음엔 숨겨 두고 보호자가 켠다 */
  const appUI = typeof Entitlements !== 'undefined' && Entitlements.appMode();
  if (appUI) document.body.classList.add('app');
  let tagsOff = saved.tagsOff === true || (appUI && saved.tagsOff === undefined); // 태그 숨기기 (홈 첫 화면을 그림만으로)

  /* ── 소리 ── */
  function say(text) {
    if (!speak || typeof Narrator === 'undefined') return;
    try { Narrator.speak(text); } catch (e) { /* 무시 */ }
  }
  function fx(name) {
    try { if (typeof AudioFX !== 'undefined' && AudioFX[name]) AudioFX[name](); } catch (e) { /* 무시 */ }
  }
  try { AudioFX.preloadSfx(['paper_up', 'paper_down', 'paper_turn', 'paper_tap']); } catch (e) { /* 무시 */ }
  /* 종이 소리 (sounds/sfx/paper_*.mp3): 태그가 솟을 때 up, 눌려 들어갈 때 down, 동화로 넘어갈 때 turn, 그 밖의 톡 tap */
  function paper(kind) {
    try { if (typeof AudioFX === 'undefined') return; if (AudioFX.sfx('paper_' + kind) === false) AudioFX.tap(); } catch (e) { /* 무시 */ }
  }

  /* ── 준비 상태: 만드는 중인 동화는 파일이 있으면 연다 ── */
  const readyNow = new Set(TALES.filter(t => t.ready).map(t => t.id));
  async function exists(url) {
    try { const r = await fetch(url, { method: 'HEAD', cache: 'no-cache' }); return r.ok; } catch (e) { return false; }
  }
  async function probeMaking() {
    const list = TALES.filter(t => !t.ready && t.making);
    const hits = await Promise.all(list.map(async t => {
      const base = `tales/${t.folder || t.id}/`;
      return (await exists(base + 'index.html')) && (await exists(base + `${t.folder || t.id}.js`)) ? t.id : null;
    }));
    let changed = false;
    hits.forEach(id => { if (id && !readyNow.has(id)) { readyNow.add(id); changed = true; } });
    if (changed) requestRender();
  }

  /* ── 태그 칩 ── */
  /* 종이 스티커 아이콘(assets/icons/<key>.webp)이 준비된 태그는 그림으로, 아니면 SVG 아이콘 */
  const STICKER = new Set(window.ICONS || []);
  const icon = (key, cls = 'ic') => STICKER.has(key)
    ? `<img class="${cls} stk" src="assets/icons/${key}.webp" alt="" aria-hidden="true" draggable="false" decoding="async">`
    : `<svg class="${cls}" aria-hidden="true"><use href="#i-${key}"/></svg>`;
  /* 글자마다 따로 늘었다 줄었다 할 수 있게 한 글자씩 감싼다 (읽기 이름은 aria-label 로) */
  const letters = s => [...s].map(ch => ch === ' ' ? '<i class="sp"> </i>' : `<i>${ch}</i>`).join('');

  function buildChips(row) {
    const box = document.querySelector(`.tagrow[data-row="${row}"] .chips`);
    const chip = (key, label, ic) =>
      `<button type="button" class="chip${key ? '' : ' all'}" data-row="${row}" data-key="${key}" aria-label="${label}">${icon(ic)}<span class="lb" aria-hidden="true">${letters(label)}</span></button>`;
    box.innerHTML = chip('', '전체', 'all') + TAGS[row].map(t => chip(t.key, t.label, t.key)).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b) return;
      const key = b.dataset.key;
      paper(key && !sel[row].has(key) ? 'up' : 'down'); // 고르면 양각으로 솟고, 풀면 음각으로 눌린다
      if (!key) { sel[row].clear(); say(row === 'origin' ? '이야기 전체' : '배우는 것 전체'); }
      else if (sel[row].has(key)) sel[row].delete(key);
      else { sel[row].add(key); say(TAGS[row].find(t => t.key === key).say); }
      update();
      wobble(b);
    });
  }

  function paintChips() {
    document.querySelectorAll('.chip').forEach(b => {
      const s = sel[b.dataset.row];
      const on = b.dataset.key ? s.has(b.dataset.key) : s.size === 0;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* 누른 칩: 종이가 눌려 출렁이고(탄성), 글자는 가운데부터 늘었다 돌아오고,
     가까운 칩들은 자석처럼 살짝 끌려왔다가 제자리로 튕겨 간다 */
  const chipAnim = new WeakMap();
  function wobble(b) {
    if (!motion()) return;
    const box = b.parentNode;
    if (chipAnim.get(box)) chipAnim.get(box).finish();
    const br = b.getBoundingClientRect(), bx = br.left + br.width / 2, by = br.top + br.height / 2;
    const near = [...box.children].filter(x => x !== b).map(x => {
      const r = x.getBoundingClientRect(), dx = bx - (r.left + r.width / 2), dy = by - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1;
      return { x, ux: dx / d, uy: dy / d, f: Math.exp(-((d / 120) ** 2)), lag: d / 2400 };
    }).filter(o => o.f > .04);
    const ls = [...b.querySelectorAll('.lb i')], mid = (ls.length - 1) / 2;
    chipAnim.set(box, play(.75, t => {
      const w = wob(t, .26, 26);
      b.style.scale = `${(1 + .12 * w).toFixed(4)} ${(1 - .12 * w).toFixed(4)}`;
      ls.forEach((l, i) => {
        const lw = wob(t - .04 - Math.abs(i - mid) * .04, .3, 28);
        l.style.scale = `${(1 - .1 * lw).toFixed(4)} ${(1 + .32 * lw).toFixed(4)}`;
      });
      near.forEach(o => {
        const tt = t - o.lag, pull = tt < .1 ? eo(tt / .1) : wob(tt - .1, .34, 22);
        const d = 7 * o.f * pull;
        o.x.style.translate = `${(o.ux * d).toFixed(2)}px ${(o.uy * d * .5).toFixed(2)}px`;
      });
    }, () => {
      b.style.scale = '';
      ls.forEach(l => { l.style.scale = ''; });
      near.forEach(o => { o.x.style.translate = ''; });
    }));
  }

  /* ── 선반: 한 장의 남색 종이에 뚫린 구멍들 ── */
  const ORIGIN = Object.fromEntries(TAGS.origin.map(t => [t.key, t]));
  const SKILL = Object.fromEntries(TAGS.skill.map(t => [t.key, t]));

  const match = t =>
    (sel.origin.size === 0 || sel.origin.has(t.origin)) &&
    (sel.skill.size === 0 || t.skills.some(k => sel.skill.has(k)));

  /* 새 썸네일 = 종이에 모양 구멍이 이미 뚫린 그림: 네모 그대로, 가장자리만 종이 색에 녹인다.
     어두운 판(THUMBS2: <id>.webp, 남색 종이)과 밝은 판(THUMBS2L: <id>_light.webp, 옅은 종이)을
     화면 모드에 맞춰 고르고, 한쪽만 있으면 있는 쪽을 쓴다.
     옛 썸네일(THUMBS, 크림 여백) = 임시로 동그랗게 오려 낸다. 그림이 없으면 옛 SVG 그림을 종이 색 계단으로 */
  const PIC2 = new Set(window.THUMBS2 || []);
  const PIC2L = new Set(window.THUMBS2L || []);
  const PIC = new Set(window.THUMBS || []);
  const TILE = new Set(window.TILES || []);
  const imgAttrs = 'class="art" alt="" loading="lazy" decoding="async"';

  function holeHTML(t, open, extra = '') {
    const plug = (open ? '' : '<span class="plug" aria-hidden="true"><b>곧 열려요</b></span>') + extra;
    // 밝은 종이 한 가지만 쓴다 (다크 모드 없음). 밝은 판이 없으면 남색 판이라도
    if (TILE.has(t.id)) return `<span class="thumb full tile"><img ${imgAttrs} src="assets/thumbs/${t.id}_tile.webp">${plug}</span>`;
    const dk = PIC2.has(t.id), lt = PIC2L.has(t.id), base = `assets/thumbs/${t.id}`;
    if (lt || dk) return `<span class="thumb full"><img ${imgAttrs} src="${base}${lt ? '_light' : ''}.webp">${plug}</span>`;
    if (PIC.has(t.id)) return `<span class="thumb pic"><img class="art" src="assets/thumbs/${t.id}.webp" alt="" loading="lazy" decoding="async">${plug}</span>`;
    return `<span class="thumb svgart"><svg class="art" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${t.art}</svg>${plug}</span>`;
  }

  /* 화면 언어: 영어 자료(t.en)가 있는 동화만 영어로 보인다 */
  let lang = 'ko';
  try { if (localStorage.getItem('lang') === 'en') lang = 'en'; } catch (e) { /* 저장소를 못 쓰면 한국어 */ }
  const shown = t => (lang === 'en' && t.en) ? { ...t, ...t.en } : t;

  /* ── 앱 모드 이용권: 공개 웹에서는 st 가 늘 'free' 라 아무것도 달라지지 않는다 ── */
  const L = (ko, en) => lang === 'en' ? en : ko;
  /* 앱에서는 카탈로그가 ready 로 공개한 동화만 열린다 (만드는 중 파일 탐지는 웹 전용) */
  const isOpen = t => readyNow.has(t.id) && (!Entitlements.appMode() || t.ready);
  function cardHTML(t0) {
    const t = shown(t0);
    const open = isOpen(t);
    const st = open ? Entitlements.status(t.id) : 'free';
    const tag = st === 'week' ? `<span class="week-tag" aria-hidden="true"><b>${L('이번 주 무료', 'Free this week')}</b></span>`
      : st === 'locked' ? `<span class="lock-tag" aria-hidden="true"><b>${L('잠겨 있어요', 'Locked')}</b></span>` : '';
    const o = ORIGIN[t.origin];
    const skills = t.skills.map(k => `<span class="sk" title="${SKILL[k].label}">${icon(k)}</span>`).join('');
    const inner = `
      ${holeHTML(t, open, tag)}
      <span class="label">
        <strong class="title">${t.title}</strong>
        <span class="line">${t.line}</span>
        <span class="tags"><span class="org" title="${o.label}">${icon(t.origin)}</span>${skills}</span>
      </span>`;
    const attrs = `data-id="${t.id}" data-origin="${t.origin}"`;
    if (st === 'locked') {
      return `<div class="card locked" role="button" tabindex="0" aria-label="${t.title}, ${L('잠겨 있어요', 'locked')}" ${attrs}>${inner}</div>`;
    }
    return open
      ? `<a class="card" href="tales/${t.folder || t.id}/index.html" ${attrs}>${inner}</a>`
      : `<div class="card closed" role="button" tabindex="0" aria-disabled="true" aria-label="${t.title}, 곧 열려요" ${attrs}>${inner}</div>`;
  }

  /* ── 앱 화면의 큰 동화(히어로): 화살표를 톡 눌러 넘기고, 큰 카드를 톡 눌러 연다. 옆으로 밀어도 넘어간다(덤) ── */
  let heroId = null, heroList = [], heroDir = 0;
  const lastKey = 'paperTheater.last';
  function renderHero() {
    const hero = $('#hero');
    if (!appUI) return;
    hero.hidden = heroList.length === 0;
    if (!heroList.length) return;
    if (!heroList.some(t => t.id === heroId)) heroId = heroList[0].id;
    const t = heroList.find(x => x.id === heroId);
    const slot = $('#heroSlot');
    slot.innerHTML = cardHTML(t);
    const n = heroList.length;
    $('#heroPrev').hidden = $('#heroNext').hidden = n < 2;
    document.querySelectorAll('#grid .card').forEach(c => c.classList.toggle('sel', c.dataset.id === heroId));
    if (heroDir && motion()) {
      slot.firstElementChild.animate([{ transform: `translateX(${heroDir * 56}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
    }
    heroDir = 0;
  }
  function heroStep(d) {
    if (heroList.length < 2) return;
    const i = heroList.findIndex(t => t.id === heroId);
    heroId = heroList[(i + d + heroList.length) % heroList.length].id;
    heroDir = d;
    paper('tap');
    renderHero();
    const t = heroList.find(x => x.id === heroId);
    say(t.title);
  }
  function heroSelect(id) {
    heroId = id; heroDir = 0; renderHero();
    const t = heroList.find(x => x.id === id);
    if (t) say(t.title);
  }
  if (appUI) {
    $('#heroPrev').addEventListener('click', () => heroStep(-1));
    $('#heroNext').addEventListener('click', () => heroStep(1));
    let sx = null;
    const hz = $('#hero');
    hz.addEventListener('pointerdown', e => { sx = e.clientX; });
    hz.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 70) { heroStep(e.clientX < sx ? 1 : -1); hz.dataset.swiped = '1'; setTimeout(() => { delete hz.dataset.swiped; }, 50); } sx = null; });
    hz.addEventListener('click', e => { if (hz.dataset.swiped) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* 선반 다시 그리기 + FLIP:
     · 남는 카드 = 예전 자리에서 새 자리로 스프링으로 미끄러지고, 살짝 앞으로 튀어나온다
     · 새로 들어오는 카드 = 종이에 구멍이 가운데서부터 스프링으로 뚫리며 열린다(차례로)
     · 빠지는 카드 = 제자리에 둔 채 구멍이 오므라들며 사라진다 */
  let gridAnim = null, pending = false;
  function render(opts = {}) {
    if (gridAnim) gridAnim.finish();
    const grid = $('#grid');
    const g0 = grid.getBoundingClientRect();
    const before = new Map();
    grid.querySelectorAll('.slot:not([hidden])').forEach(s => {
      const r = s.getBoundingClientRect();
      before.set(s.dataset.id, { x: r.left - g0.left, y: r.top - g0.top, w: r.width, h: r.height, open: !!s.querySelector('a.card') });
    });
    const animate = opts.anim !== false && motion() && (before.size > 0 || opts.intro);
    const playable = t => isOpen(t) && Entitlements.canPlay(t.id);
    const sorted = [...TALES.filter(playable), ...TALES.filter(t => isOpen(t) && !playable(t)), ...TALES.filter(t => !isOpen(t))];
    let shown = 0;
    if (appUI) { heroList = sorted.filter(match); try { if (!heroId) heroId = localStorage.getItem(lastKey); } catch (e) { /* 무시 */ } }
    grid.innerHTML = sorted.map(t => {
      const m = match(t), b = before.get(t.id);
      if (m) shown++;
      if (!m && b && animate) {
        return `<li class="slot leaving" data-id="${t.id}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px">${cardHTML(t)}</li>`;
      }
      return `<li class="slot" data-id="${t.id}"${m ? '' : ' hidden'}>${cardHTML(t)}</li>`;
    }).join('');
    $('#empty').hidden = shown > 0;
    renderHero();
    if (!animate) return;

    const g1 = grid.getBoundingClientRect(), vh = innerHeight, items = [];
    const delay0 = opts.delay || .04, step = opts.step || .045;
    let k = 0;
    grid.querySelectorAll('.slot:not([hidden])').forEach(s => {
      const card = s.firstElementChild, id = s.dataset.id, hole = card.querySelector('.thumb');
      if (s.classList.contains('leaving')) { items.push({ kind: 'out', card, hole }); return; }
      const r = s.getBoundingClientRect(), b = before.get(id);
      if (b) {
        items.push({ kind: 'stay', card, dx: b.x - (r.left - g1.left), dy: b.y - (r.top - g1.top) });
      } else {
        const seen = r.top < vh && r.bottom > 0;
        items.push({ kind: 'in', card, hole, at: delay0 + (seen ? Math.min(k++ * step, .45) : 0) });
      }
    });
    items.forEach(it => it.card.classList.add('anim'));
    const iris = (el, f) => { el.style.clipPath = `circle(${(Math.max(0, f) * 72).toFixed(2)}% at 50% 50%)`; };
    gridAnim = play(delay0 + .95, t => {
      for (const it of items) {
        const c = it.card;
        if (it.kind === 'out') {
          const q = eio(t / .3);
          c.style.opacity = (1 - q).toFixed(3);
          iris(it.hole, 1 - q);
        } else if (it.kind === 'stay') {
          const s = spring(t, .62, 16), pop = Math.sin(Math.PI * clamp(t / .42)) * .04;
          tf(c, it.dx * (1 - s), it.dy * (1 - s), 1 + pop, 0);
        } else {
          const tt = t - it.at, s = spring(tt, .5, 14);
          c.style.opacity = clamp(tt / .08).toFixed(3);
          iris(it.hole, tt <= 0 ? 0 : .06 + .94 * s);
          tf(c, 0, 10 * (1 - clamp(s)), 1, 0);
        }
      }
    }, () => {
      grid.querySelectorAll('.slot.leaving').forEach(s => { s.hidden = true; s.classList.remove('leaving'); s.removeAttribute('style'); });
      items.forEach(it => {
        untf(it.card);
        it.card.classList.remove('anim');
        if (it.hole) it.hole.style.clipPath = '';
      });
      gridAnim = null;
      if (pending) { pending = false; render(); }
    });
  }
  /* 준비 확인처럼 급하지 않은 다시 그리기는 지금 움직임이 끝난 뒤에 */
  function requestRender() {
    if (gridAnim && gridAnim.alive) pending = true;
    else render();
  }

  /* ── 언어 바꾸기: 영어 자료가 있는 동화만 영어로 (나머지는 한국어 그대로) ── */
  const langBtn = $('#langToggle');
  function paintLang() {
    langBtn.querySelector('.lg-t').textContent = lang === 'en' ? '한' : 'EN';
    langBtn.setAttribute('aria-label', lang === 'en' ? '한국어로 보기' : 'Switch language: English');
    langBtn.classList.toggle('on', lang === 'en');
    document.documentElement.lang = lang;
    paintLogo();
  }
  function paintLogo() {
    const logo = $('.logo'), words = lang === 'en' ? ['Tok', 'Tok', 'Tale', 'Theater'] : ['톡', '톡', '동', '화', '극', '장'], gapAt = 2;
    logo.innerHTML = `<span class="sr">${L('톡톡 동화극장', 'Tok Tok Tale Theater')}</span>` +
      words.map((w, i) => `<span class="lt${i === gapAt ? ' gap' : ''}${lang === 'en' && i < 3 ? ' w' : ''}" aria-hidden="true">${w}</span>`).join('');
    document.title = L('톡톡 동화극장', 'Tok Tok Tale Theater');
  }
  langBtn.addEventListener('click', () => {
    lang = lang === 'en' ? 'ko' : 'en';
    try { localStorage.setItem('lang', lang); } catch (e) { /* 저장 못 해도 이 화면은 바뀐다 */ }
    paper('down');
    paintLang();
    render({ anim: false });
  });
  paintLang();

  /* ── 태그 숨기기/보이기: 숨기면 격자가 화면을 넓게 쓴다. 고른 태그는 그대로 적용되고, 버튼에 개수만 표시 ── */
  const tagBtn = $('#tagToggle');
  function paintTagToggle() {
    const n = sel.origin.size + sel.skill.size;
    $('#home').classList.toggle('tags-off', tagsOff);
    tagBtn.setAttribute('aria-expanded', String(!tagsOff));
    tagBtn.setAttribute('aria-label', tagsOff ? '태그 보이기' : '태그 숨기기');
    tagBtn.classList.toggle('on', !tagsOff);
    const badge = tagBtn.querySelector('.tt-n');
    badge.hidden = !(tagsOff && n); badge.textContent = n;
  }
  tagBtn.addEventListener('click', () => {
    tagsOff = !tagsOff;
    paper(tagsOff ? 'down' : 'up');
    paintTagToggle();
    render({ anim: false });
    save();
  });
  paintTagToggle();

  function update(opts) {
    paintTagToggle();
    paintChips();
    render(opts);
    save();
  }

  /* ── 카드 누르기 ── */
  let leavingPage = false;
  /* 카드 → 무대: 구멍 속 그림이 화면 가득 커지고(동그란 구멍은 동그랗게), 이어서 남색 종이가
     조리개처럼 가운데로 오므라들며 닫히면 동화로 넘어간다. 닫힌 종이가 페이지를 불러오는 틈을 가려 준다.
     전부 0.72초. 애니메이션이 멈춰도 1.2초 뒤엔 넘어간다. */
  function openTale(card) {
    const href = card.getAttribute('href');
    if (leavingPage) return;
    try { localStorage.setItem(lastKey, card.dataset.id); } catch (e) { /* 무시 */ }
    leavingPage = true;
    let gone = false;
    const go = () => { if (!gone) { gone = true; location.href = href; } };
    if (!motion()) { go(); return; }
    const hole = card.querySelector('.thumb'), art = hole.querySelector('.art'), r = hole.getBoundingClientRect();
    const round = !hole.classList.contains('full');
    const vw = innerWidth, vh = innerHeight;
    const W = round ? Math.hypot(vw, vh) : Math.max(vw, vh), X = (vw - W) / 2, Y = (vh - W) / 2, s0 = r.width / W;
    const ov = $('#stageOut'), veil = ov.querySelector('.so-veil'), box = ov.querySelector('.so-box'), lid = ov.querySelector('.so-iris');
    box.className = 'so-box ' + [...hole.classList].filter(c => c !== 'thumb').join(' ');
    box.innerHTML = art.tagName === 'IMG'
      ? `<img class="art" src="${art.currentSrc || art.getAttribute('src')}" alt="">`
      : `<svg class="art" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice">${art.innerHTML}</svg>`;
    box.style.width = box.style.height = W + 'px';
    const D = Math.hypot(vw, vh) * 1.04;
    ov.hidden = false;
    const fallback = setTimeout(go, 1200);
    setTimeout(() => paper('turn'), 380);
    card.classList.add('anim');
    play(.72, t => {
      card.style.scale = (1 - .04 * Math.sin(Math.PI * clamp(t / .14))).toFixed(4);
      veil.style.opacity = (.8 * eo(t / .3)).toFixed(3);
      const k = eio((t - .04) / .42);
      box.style.transform = `translate(${lerp(r.left, X, k).toFixed(2)}px, ${lerp(r.top, Y, k).toFixed(2)}px) scale(${lerp(s0, 1, k).toFixed(4)})`;
      const q = eio((t - .4) / .32), d = Math.max(0, D * (1 - q));
      lid.style.width = lid.style.height = d.toFixed(1) + 'px';
      lid.style.opacity = t < .4 ? '0' : '1';
    }, () => { clearTimeout(fallback); go(); });
  }
  /* 뒤로 가기로 돌아왔을 때(페이지 캐시) 전환 막을 걷는다 */
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    leavingPage = false;
    $('#stageOut').hidden = true;
    document.querySelectorAll('.card.anim').forEach(c => { untf(c); c.classList.remove('anim'); });
  });

  /* 닫힌 카드: 구멍을 막은 종이 마개가 들썩이다 제자리에 앉는다 */
  function peek(c) {
    if (!motion()) return;
    const plug = c.querySelector('.plug');
    if (!plug) return;
    plug.animate([
      { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
      { transform: 'translate(-2px, -4px) rotate(-8deg) scale(1.04)', offset: .2 },
      { transform: 'translate(2px, -2px) rotate(6deg) scale(1.03)', offset: .45 },
      { transform: 'translate(-1px, 0) rotate(-2.5deg) scale(1.01)', offset: .7 },
      { transform: 'translate(0, 0) rotate(0deg) scale(1)' }
    ], { duration: 650, easing: 'ease-out' });
  }

  function activate(e) {
    const c = e.target.closest('.card');
    if (!c || c.closest('.leaving')) return;
    const t = TALES.find(x => x.id === c.dataset.id);
    const inHero = !!c.closest('#hero');
    if (appUI && !inHero && c.dataset.id !== heroId) { e.preventDefault(); paper('tap'); heroSelect(c.dataset.id); return; }
    if (c.classList.contains('closed')) {
      e.preventDefault();
      paper('down');
      peek(c);
      say(`${t.title}. 곧 열려요.`);
      return;
    }
    if (c.classList.contains('locked')) {
      e.preventDefault();
      paper('down');
      peek(c);
      openStore(t.id);
      return;
    }
    paper('tap');
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (err) { /* 무시 */ }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;   // 새 탭 열기는 그대로
    e.preventDefault();
    openTale(c);
  }
  $('#grid').addEventListener('click', activate);
  $('#heroSlot').addEventListener('click', activate);
  const cardKey = e => {
    if ((e.key === 'Enter' || e.key === ' ') && (e.target.classList.contains('closed') || e.target.classList.contains('locked'))) { e.preventDefault(); e.target.click(); }
  };
  $('#grid').addEventListener('keydown', cardKey);
  $('#heroSlot').addEventListener('keydown', cardKey);

  function resetFilters() { sel.origin.clear(); sel.skill.clear(); update(); }
  $('#emptyReset').addEventListener('click', () => { paper('down'); resetFilters(); });

  /* ── 보호자 메뉴: 톱니를 3초 동안 눌러야 열린다 ── */
  const gear = $('#parentBtn'), panel = $('#parentPanel'), hint = $('#hint'), sheet = panel.querySelector('.sheet');
  let holdTimer = 0, hintTimer = 0, opened = false, panelAnim = null;
  function holdStart(e) {
    if (e.button !== undefined && e.button !== 0) return;
    opened = false;
    gear.classList.add('holding');
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => { opened = true; gear.classList.remove('holding'); openPanel(); }, 3000);
  }
  function holdEnd() {
    if (!gear.classList.contains('holding')) return;
    gear.classList.remove('holding');
    clearTimeout(holdTimer);
    if (!opened) {
      hint.hidden = false;
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => { hint.hidden = true; }, 1800);
    }
  }
  gear.addEventListener('pointerdown', holdStart);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => gear.addEventListener(ev, holdEnd));
  gear.addEventListener('contextmenu', e => e.preventDefault());

  /* 보호자 쪽지: 아래에서 튀어 올라와 기울어진 채 내려앉는다 */
  function openPanel() {
    if (panelAnim) panelAnim.finish();
    hint.hidden = true;
    $('#optSpeak').checked = speak;
    panel.hidden = false;
    $('#parentClose').focus();
    panelAnim = play(.7, t => {
      panel.style.opacity = eo(t / .18).toFixed(3);
      const s = spring(t, .48, 15);
      tf(sheet, 0, 60 * (1 - s), .9 + .1 * s, -5 * (1 - s));
    }, () => { panel.style.opacity = ''; untf(sheet); });
  }
  function closePanel() {
    if (panel.hidden) return;
    if (panelAnim) panelAnim.finish();
    panelAnim = play(.2, t => {
      const q = eio(t / .2);
      panel.style.opacity = (1 - q).toFixed(3);
      tf(sheet, 0, 24 * q, 1 - .06 * q, 2 * q);
    }, () => { panel.hidden = true; panel.style.opacity = ''; untf(sheet); });
  }
  $('#parentClose').addEventListener('click', closePanel);
  panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) closePanel(); });
  $('#optSpeak').addEventListener('change', e => { speak = e.target.checked; save(); });
  $('#optReset').addEventListener('click', () => { resetFilters(); closePanel(); });

  /* ── 보호자 확인 → 전체 열기 (앱 모드 전용) ──
     잠긴 카드를 누르면 먼저 어른용 곱셈 문제(보기 4개)를 푼다. 풀어야 결제 쪽지가 열린다. 틀리면 새 문제 */
  const storePanel = $('#storePanel'), storeSheet = storePanel.querySelector('.sheet');
  const storeBuyBtn = $('#storeBuyBtn'), storeRestore = $('#storeRestore'), buyMsg = $('#buyMsg');
  let storeAnim = null, gateAnswer = 0, storeFor = null, busyBuy = false;
  const title = id => shown(TALES.find(x => x.id === id)).title;
  function newGate() {
    const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    gateAnswer = a * b;
    const opts = new Set([gateAnswer]);
    while (opts.size < 4) {
      const d = [-10, -9, -8, -7, -6, -4, -3, -2, 2, 3, 4, 6, 7, 8, 9, 10][Math.floor(Math.random() * 16)];
      if (gateAnswer + d > 0) opts.add(gateAnswer + d);
    }
    $('#gateQ').textContent = `${a} × ${b} = ?`;
    $('#gateOpts').innerHTML = [...opts].sort(() => Math.random() - .5)
      .map(n => `<button type="button" class="ticket alt" data-n="${n}">${n}</button>`).join('');
  }
  function showStore(step) {
    $('#storeGate').hidden = step !== 'gate';
    $('#storeBuy').hidden = step !== 'buy';
    storeBuyBtn.hidden = step !== 'buy';
    storeRestore.hidden = step !== 'buy';
    $('#storeTitle').textContent = step === 'gate' ? L('어른이 확인해 주세요', 'Grown-ups, please check')
      : L('모든 동화 열기', 'Unlock all tales');
    $('#storeClose').textContent = step === 'gate' ? L('닫기', 'Close') : L('다음에', 'Not now');
    if (step === 'gate') {
      $('#gateHow').textContent = L('결제 화면으로 가려면 아래 문제를 풀어 주세요.', 'To go on to purchase, please answer this question.');
      newGate();
    } else {
      const names = Entitlements.freeThisWeek().map(title).join(', ');
      $('#buyHow').textContent = (storeFor ? L(`'${title(storeFor)}'은(는) 잠겨 있어요. `, `"${title(storeFor)}" is locked. `) : '')
        + L(`${Entitlements.PRICE}를 한 번만 내면 모든 동화가 열려요. 앞으로 새로 나오는 동화도 함께요.`,
            `Pay ${Entitlements.PRICE} once to unlock every tale, including new ones to come.`);
      $('#buyWeek').textContent = L(`이번 주 무료 동화: ${names}. 매주 월요일에 바뀌어요.`, `Free this week: ${names}. They change every Monday.`);
      buyMsg.hidden = true;
      storeBuyBtn.textContent = L(`모두 열기 ${Entitlements.PRICE}`, `Unlock all ${Entitlements.PRICE}`);
      storeRestore.textContent = L('구매 복원', 'Restore purchase');
    }
  }
  function openStore(id, step = 'gate') {
    if (!Entitlements.appMode()) return;
    storeFor = id || null;
    if (storeAnim) storeAnim.finish();
    showStore(step);
    storePanel.hidden = false;
    $('#storeClose').focus();
    storeAnim = play(.7, t => {
      storePanel.style.opacity = eo(t / .18).toFixed(3);
      const s = spring(t, .48, 15);
      tf(storeSheet, 0, 60 * (1 - s), .9 + .1 * s, -5 * (1 - s));
    }, () => { storePanel.style.opacity = ''; untf(storeSheet); });
  }
  function closeStore() {
    if (storePanel.hidden) return;
    if (storeAnim) storeAnim.finish();
    storeAnim = play(.2, t => {
      const q = eio(t / .2);
      storePanel.style.opacity = (1 - q).toFixed(3);
      tf(storeSheet, 0, 24 * q, 1 - .06 * q, 2 * q);
    }, () => { storePanel.hidden = true; storePanel.style.opacity = ''; untf(storeSheet); });
  }
  function bought(ok, failKo, failEn) {
    busyBuy = false;
    if (ok) { closeStore(); render({ anim: false }); say(L('모든 동화가 열렸어요!', 'All tales are unlocked!')); return; }
    buyMsg.textContent = L(failKo, failEn);
    buyMsg.hidden = false;
  }
  $('#gateOpts').addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (+b.dataset.n === gateAnswer) { paper('tap'); showStore('buy'); return; }
    paper('down');
    if (motion()) storeSheet.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], { duration: 260 });
    newGate();
  });
  storeBuyBtn.addEventListener('click', async () => {
    if (busyBuy) return;
    busyBuy = true; paper('tap');
    let ok = false;
    try { ok = await Entitlements.purchase(); } catch (err) { ok = false; }
    bought(ok, '결제가 끝나지 않았어요. 다시 해 주세요.', 'The purchase did not go through. Please try again.');
  });
  async function doRestore() {
    if (busyBuy) return;
    busyBuy = true; paper('tap');
    let ok = false;
    try { ok = await Entitlements.restore(); } catch (err) { ok = false; }
    bought(ok, '복원할 구매를 찾지 못했어요.', 'No purchase was found to restore.');
  }
  storeRestore.addEventListener('click', doRestore);
  $('#storeClose').addEventListener('click', closeStore);
  storePanel.addEventListener('click', e => { if (e.target === storePanel) closeStore(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !storePanel.hidden) closeStore(); });
  // 보호자 메뉴(3초 꾹)에도 구매 복원 — 앱 모드에서만 보인다
  const optRestore = $('#optRestore');
  if (Entitlements.appMode()) {
    optRestore.hidden = false;
    optRestore.addEventListener('click', () => { closePanel(); openStore(null); });
  }

  /* ── 여는 장면 (1.5초 안, 아무 데나 누르면 건너뜀) ──
     흩어진 색종이 조각이 포물선을 그리며 날아와 로고 글자 조각이 되고(파티클 로고),
     태그 칩이 차례로 붙고, 카드가 선반 위로 떨어진다(스프링 스택).
     같은 탭(세션)에서 두 번째부터는 카드만 짧게 떨어진다. */
  /* 앱 첫 화면: 켤 때마다 한 번. 색 종이 석 장이 깔리고, 동화 친구들이 차례로 솟고, 제목이 톡 앉는다. 어디든 누르면 건너뜀 */
  function splash(done) {
    const sp = $('#splash');
    const cast = ['tiger_stand', 'rab_rabbit_run', 'tp_pig2_base', 'lm_lion_stand'];
    sp.querySelector('.sp-cast').innerHTML = cast.map(n => `<img src="assets/v3w/${n}.webp" alt="">`).join('');
    const ttl = sp.querySelector('.sp-title');
    ttl.innerHTML = lang === 'en' ? '<span>Tok Tok</span> <span>Tale Theater</span>' : '<span>톡톡</span> <span>동화극장</span>';
    sp.querySelector('.sp-tap').textContent = L('톡 눌러 시작', 'Tap to start');
    sp.hidden = false;
    const A = sp.querySelector('.sp-a'), B = sp.querySelector('.sp-b'), C = sp.querySelector('.sp-c');
    const imgs = [...sp.querySelectorAll('.sp-cast img')], words = [...ttl.children], tap = sp.querySelector('.sp-tap');
    let anim = null, closed = false;
    const finish = () => { if (closed) return; closed = true; if (anim) anim.finish(); };
    sp.addEventListener('pointerdown', finish, { once: true });
    anim = play(2.2, t => {
      const pa = eo(t / .5), pb = eo((t - .12) / .5), pc = eo((t - .24) / .5);
      tf(A, 0, 100 * (1 - pa), 1, 0); A.style.opacity = clamp(pa * 2);
      tf(B, 0, 100 * (1 - pb), 1, 0); B.style.opacity = clamp(pb * 2);
      tf(C, 0, 100 * (1 - pc), 1, 0); C.style.opacity = clamp(pc * 2);
      imgs.forEach((im, i) => {
        const tt = t - .5 - i * .14, q = spring(tt, .42, 15);
        im.style.opacity = tt > 0 ? '1' : '0';
        im.style.translate = `0 ${((1 - q) * 160).toFixed(1)}px`;
      });
      words.forEach((w, i) => {
        const tt = t - 1.05 - i * .16, q = spring(tt, .4, 16);
        w.style.opacity = tt > 0 ? '1' : '0';
        w.style.scale = Math.max(0, q).toFixed(3);
      });
      tap.style.opacity = (clamp((t - 1.6) / .3) * (.55 + .45 * Math.sin(t * 5))).toFixed(3);
    }, () => {
      sp.style.transition = 'opacity .35s';
      sp.style.opacity = '0';
      setTimeout(() => { sp.hidden = true; sp.style.opacity = sp.style.transition = ''; done(); }, 340);
    });
  }

  function intro() {
    if (appUI) {
      let first = true;
      try { first = !sessionStorage.getItem('paperTheater.splash'); sessionStorage.setItem('paperTheater.splash', '1'); } catch (e) { /* 무시 */ }
      update({ anim: false });
      if (first && motion() && location.hash !== '#parent') splash(() => update({ intro: true, delay: .04, step: .035 }));
      else update({ intro: true, delay: .02, step: .03 });
      return;
    }
    let full = true;
    try { full = !sessionStorage.getItem('paperTheater.intro'); sessionStorage.setItem('paperTheater.intro', '1'); } catch (e) { /* 무시 */ }
    if (location.hash === '#parent') full = false;
    if (!motion()) { update({ anim: false }); return; }
    if (!full) { update({ intro: true, delay: .02, step: .03 }); return; }

    const tiles = [...document.querySelectorAll('.logo .lt')];
    const stickers = [...document.querySelectorAll('.row-tab, .chip, .gear')];
    const R = rng(11), vw = innerWidth, vh = innerHeight;
    const layer = document.createElement('div');
    layer.className = 'confetti';
    const PAL = getComputedStyle(document.documentElement).getPropertyValue('--confetti').split(',').map(c => c.trim()).filter(Boolean);
    const bits = [];
    tiles.forEach((el, i) => {
      const r = el.getBoundingClientRect(), col = getComputedStyle(el).color;
      for (let j = 0; j < 9; j++) {
        const d = document.createElement('i');
        d.className = 'bit b' + (j % 3);
        d.style.background = j < 5 || !PAL.length ? col : PAL[(i + j) % PAL.length];
        layer.appendChild(d);
        const sx = R() * vw, sy = R() * vh;
        bits.push({
          d, sx, sy,
          ex: r.left + r.width / 2 + (R() - .5) * r.width * .6 - 4,
          ey: r.top + r.height / 2 + (R() - .5) * r.height * .6 - 4,
          at: .02 + i * .07 + R() * .1, bend: (R() - .5) * 180, r0: (R() - .5) * 540
        });
      }
    });
    document.body.appendChild(layer);
    const FLY = .5;
    const land = i => .02 + i * .07 + FLY + .02;

    let introAnim = null;
    const skip = () => { if (introAnim) introAnim.finish(); if (gridAnim) gridAnim.finish(); };
    addEventListener('pointerdown', skip, { capture: true, once: true });
    addEventListener('keydown', skip, { capture: true, once: true });

    introAnim = play(1.45, t => {
      for (const b of bits) {
        const q = eo((t - b.at) / FLY);
        const x = lerp(b.sx, b.ex, q), y = lerp(b.sy, b.ey, q) + Math.sin(Math.PI * q) * b.bend;
        b.d.style.opacity = (q <= 0 ? 0 : q < .88 ? clamp(q / .12) : 1 - (q - .88) / .12).toFixed(3);
        tf(b.d, x, y, lerp(1.5, .6, q), b.r0 * (1 - q));
      }
      tiles.forEach((el, i) => {
        const tt = t - land(i), s = spring(tt, .38, 17);
        el.style.opacity = tt > 0 ? '1' : '0';
        el.style.scale = Math.max(0, s).toFixed(4);
        el.style.rotate = `${((i % 2 ? 24 : -24) * (1 - s)).toFixed(2)}deg`;
      });
      stickers.forEach((el, j) => {
        const tt = t - .28 - Math.min(j * .022, .4), s = spring(tt, .45, 16);
        el.style.opacity = clamp(tt / .08).toFixed(3);
        el.style.scale = (.55 + .45 * s).toFixed(4);
      });
    }, () => {
      layer.remove();
      [...tiles, ...stickers].forEach(untf);
      removeEventListener('pointerdown', skip, { capture: true });
      removeEventListener('keydown', skip, { capture: true });
    });
    update({ intro: true, delay: .5, step: .04 });
  }

  buildChips('origin');
  buildChips('skill');
  intro();
  /* 확인용: index.html#parent 로 열면 보호자 메뉴가 바로 열린다 */
  if (location.hash === '#parent') openPanel();
  probeMaking();
  /* 잠긴 동화 주소로 바로 들어왔다가 돌아온 경우: 보호자 확인부터 */
  try {
    const lk = new URLSearchParams(location.search).get('locked');
    if (lk && TALES.some(t => t.id === lk && t.ready)) { history.replaceState(null, '', location.pathname + location.hash); setTimeout(() => openStore(lk), 600); }
  } catch (e) { /* 무시 */ }
})();
