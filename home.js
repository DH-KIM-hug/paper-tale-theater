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
  const REVIEW_ON = (() => { try { return new URLSearchParams(location.search).get('review') === '1'; } catch (e) { return false; } })();   // 검수용 '새 그림' 딱지는 ?review=1 일 때만

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
    try { localStorage.setItem(STORE, JSON.stringify({ origin: [...sel.origin], skill: [...sel.skill], layout: 2 })); } catch (e) { /* 무시 */ }
  }
  /* 아직 쓰는 동화가 없는 태그(hideUnused)는 칩을 숨기고, 저장된 선택도 무시한다 */
  TAGS.skill = TAGS.skill.filter(t => !t.hideUnused || TALES.some(x => x.skills.includes(t.key)));
  const saved = load();
  const valid = (row, list) => (Array.isArray(list) ? list : []).filter(k => TAGS[row].some(t => t.key === k));
  const sel = { origin: new Set(valid('origin', saved.origin)), skill: new Set(valid('skill', saved.skill)) };
  /* 웹도 앱과 같은 화면(탭 3개, 동화 탭은 큰 동화 하나 + 작은 목록, 첫 톡 = 제목 듣기, 두 번째 톡 = 열기).
     storeMode = 앱 스토어 모드(잠금·결제). 화면 배치와는 별개다. 옛 선반(?layout=shelf)은 탭을 도입하며 없앴다. */
  const storeMode = typeof Entitlements !== 'undefined' && Entitlements.appMode();
  document.body.classList.add('app');
  if (storeMode) document.body.classList.add('store');

  /* ── 소리 ── */
  function say(text) {
    if (typeof Narrator === 'undefined') return;
    try { Narrator.speak(text, { bubble: false }); } catch (e) { /* 무시 */ }
  }
  /* 썸네일(동화 그림) 톡 때 제목 읽기 — 보호자 '소리'에서 끌 수 있다(2026-10-29 사용자 요청). 탭 이름·안내는 그대로 읽는다 */
  const titleVoiceOff = () => { try { return localStorage.getItem('title_voice_off') === '1'; } catch (e) { return false; } };
  /* 제목과 함께 그 동화의 테마 효과음 한 번(2026-10-29 사용자 요청). 'a:' = sounds/animals, 나머지 = sounds/sfx. 2초 남짓 짧은 것만, 목소리보다 작게 */
  const THEME_SFX = {
    patjuk: 'a:tiger', frog: 'a:frog', rabbit: 'boing_steps', sunmoon: 'sparkle', sun_wind: 'blow', turnip: 'pull_pop',
    lion_mouse: 'mouse_squeak_1', fox_crane: 'slurp_2', goldilocks: 'slurp_1', bremen: 'a:donkey', ant_grasshopper: 'pig_violin',
    ugly_duckling: 'a:duck', three_pigs: 'a:pig', wolf_goats: 'knock_2', kongjwi: 'splash', kkultteok: 'bubbles', hansel: 'crunch',
    cinderella: 'magic_wand', heungbu: 'coins_2', red_hood: 'knock', magpie: 'bell', magic_jar: 'cork', snow_white: 'chomp',
    little_mermaid: 'splash_big', beauty_beast: 'harp_gliss', red_car: 'car_horn', unicorn: 'horse_neigh_1', princess_pea: 'cushion',
    rapunzel: 'slide_down', frog_prince: 'ball_bounce', sleeping_beauty: 'yawn', witch_candy: 'theremin_wobble', byeoljubu: 'bubbles'
  };
  setTimeout(() => { try { AudioFX.preloadSfx(Object.values(THEME_SFX).filter(n => !n.startsWith('a:'))); } catch (e) { /* 무시 */ } }, 1500);
  function themeSfx(id) {
    const n = THEME_SFX[id];
    if (!n || typeof AudioFX === 'undefined') return;
    try { if (n.startsWith('a:')) AudioFX.animal(n.slice(2), .45); else AudioFX.sfx(n, .45); } catch (e) { /* 무시 */ }
  }
  function sayTitle(text, id) { if (titleVoiceOff()) return; if (id) themeSfx(id); say(text); }
  function fx(name) {
    try { if (typeof AudioFX !== 'undefined' && AudioFX[name]) AudioFX[name](); } catch (e) { /* 무시 */ }
  }
  /* 누름 소리 (2026-10-28 사용자 요청으로 종이 소리 → 놀이 소리): 톡 = 방울 팝, 솟음 = 짧은 팝, 눌려 들어감(고르기) = 마림바 한 음, 동화로 넘어감 = 실로폰 오르막 */
  const PRESS_SFX = { tap: 'pop_appear', up: 'pop', down: 'marimba_note', turn: 'xylo_up' };
  try { AudioFX.preloadSfx(Object.values(PRESS_SFX)); } catch (e) { /* 무시 */ }
  function paper(kind) {
    try { if (typeof AudioFX === 'undefined') return; if (AudioFX.sfx(PRESS_SFX[kind] || PRESS_SFX.tap) === false) AudioFX.tap(); } catch (e) { /* 무시 */ }
  }

  /* ── 준비 상태: 만드는 중인 동화는 파일이 있으면 연다 ── */
  const readyNow = new Set(TALES.filter(t => t.ready).map(t => t.id));
  /* 지난번에 열렸던 '만드는 중' 동화는 바로 열린 채로 그린다(확인 전에 '곧 열려요'가 잠깐 붙었다 사라지지 않게) */
  let probed = !!(typeof Entitlements !== 'undefined' && Entitlements.appMode());   // 앱 모드는 카탈로그의 ready 만 열리므로 파일 확인이 필요 없다
  try { JSON.parse(localStorage.getItem('making_open') || '[]').forEach(id => { if (TALES.some(t => t.id === id && t.making)) readyNow.add(id); }); } catch (e) { /* 저장소 없음 */ }
  async function exists(url) {
    try { const r = await fetch(url, { method: 'HEAD', cache: 'no-cache' }); return r.ok; } catch (e) { return false; }
  }
  async function probeMaking() {
    const list = TALES.filter(t => !t.ready && t.making);
    const hits = await Promise.all(list.map(async t => {
      const base = `tales/${t.folder || t.id}/`;
      return (await exists(base + 'index.html')) && (await exists(base + `${t.folder || t.id}.js`)) ? t.id : null;
    }));
    let changed = !probed;
    probed = true;
    hits.forEach(id => { if (id && !readyNow.has(id)) { readyNow.add(id); changed = true; } });
    try { localStorage.setItem('making_open', JSON.stringify(hits.filter(Boolean))); } catch (e) { /* 저장소 없음 */ }
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

  function paintChips() {
    document.querySelectorAll('.chip[data-row]').forEach(b => {
      const s = sel[b.dataset.row];
      const on = b.dataset.key ? s.has(b.dataset.key) : s.size === 0;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ── 선반: 한 장의 남색 종이에 뚫린 구멍들 ── */
  const ORIGIN = Object.fromEntries(TAGS.origin.map(t => [t.key, t]));
  const SKILL = Object.fromEntries(TAGS.skill.map(t => [t.key, t]));

  const match = t =>
    (sel.origin.size === 0 || sel.origin.has(t.origin) || (t.also || []).some(k => sel.origin.has(k))) &&
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

  /* ── 그림 딱지: 글자 없이 그림으로 (잠김 = 자물쇠, 이번 주 무료 = 별, 만드는 중 = 가위). 생성 그림 assets/ui/badge_<kind>.webp 가
     ui.js 의 UI_ART 에 올라오면 그것을 쓰고, 그 전에는 작은 기호(코드)로 대신한다 ── */
  const UIA = new Set(window.UI_ART || []);
  const uiImg = (key, cls = '') => `<img class="ui ${cls}" src="assets/ui/${key}.webp${key === 'logo_mark' ? '?v=moon1' : ''}" alt="" aria-hidden="true" draggable="false" decoding="async">`;
  const BADGE_SVG = {
    lock: '<svg viewBox="0 0 48 56"><path d="M13 24v-7a11 11 0 0 1 22 0v7" fill="none" stroke="#5C6784" stroke-width="5" stroke-linecap="round"/><rect x="6" y="22" width="36" height="28" rx="5" fill="#5C6784"/><circle cx="24" cy="35" r="4" fill="#F5EFE9"/><rect x="22" y="35" width="4" height="9" rx="2" fill="#F5EFE9"/></svg>',
    week: '<svg viewBox="0 0 48 48"><path d="M24 4l6 13 14 1.6-10.4 9.6 3 14L24 34 11.4 42.2l3-14L4 18.6 18 17z" fill="#C98A5B"/></svg>',
    making: '<svg viewBox="0 0 48 48"><path d="M17 30L37 6M31 30L11 6" stroke="#5C6784" stroke-width="4.5" stroke-linecap="round" fill="none"/><circle cx="13" cy="36" r="6.5" fill="none" stroke="#C98A5B" stroke-width="4"/><circle cx="35" cy="36" r="6.5" fill="none" stroke="#C98A5B" stroke-width="4"/></svg>'
  };
  const badge = kind => `<span class="bdg bdg-${kind}" aria-hidden="true">${UIA.has('badge_' + kind) ? uiImg('badge_' + kind) : BADGE_SVG[kind]}</span>`;
  /* 서가 줄 머리 스티커(64px): assets/ui/row_<줄>.webp 가 있으면 그림, 없으면 태그 아이콘·작은 기호 */
  const ROW_SVG = {
    week: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l6 13 14 1.6-10.4 9.6 3 14L24 34 11.4 42.2l3-14L4 18.6 18 17z" fill="#C98A5B"/></svg>',
    recent: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19" fill="#DDD2C4"/><circle cx="24" cy="24" r="14" fill="#F5EFE9"/><path d="M24 14v11l7 4" stroke="#5C6784" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
  };
  const rowIcon = k => UIA.has('row_' + k) ? uiImg('row_' + k, 'ic') : (ROW_SVG[k] || icon(k));

  /* 임시 스티커·구멍 그림 경로: 동화 그림 중 사각 종이 썸네일(_tile)을 쓴다 */
  const tileSrc = id => TILE.has(id) ? `assets/thumbs/${id}_tile.webp` : PIC2L.has(id) ? `assets/thumbs/${id}_light.webp` : (PIC2.has(id) || PIC.has(id)) ? `assets/thumbs/${id}.webp` : '';

  /* 큰 동화도 작은 목록과 같은 4:3 타일을 쓴다. 키아트(_key_wide/_key_tall)는 동화 시작 화면 전용(2026-10-13 사용자 결정) —
     홈에 넣으면 키아트의 종이 바탕이 홈 카드 안에서 따로 노는 네모로 보인다 */
  function holeHTML(t, open, st) {
    /* 구멍을 덮는 종이 마개: 잠김·만드는 중. 확인 전의 '만드는 중'(웹)은 덮지 않는다 */
    /* 마개는 '만드는 중'에만. 잠김은 크림 반투명 종이(CSS) + 오른쪽 아래 모서리 자물쇠, 이번 주 무료는 오른쪽 위 모서리 별(§7-2) — 얼굴을 가리지 않는다 */
    const making = st !== 'locked' && !open && !(t.making && !probed);
    const plug = (making ? `<span class="plug" aria-hidden="true">${badge('making')}</span>` : '') + (st === 'locked' ? badge('lock') : '') + (st === 'week' ? badge('week') : '');
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
  /* 앱 모드에서 '만드는 중'은 맨 앞의 2~3장만 예고로 보이고 나머지는 숨긴다(웹은 모두 보인다) */
  const TEASER_MAX = 3;
  const TEASERS = new Set(TALES.filter(t => !t.ready).slice(0, TEASER_MAX).map(t => t.id));
  const inScope = t => !storeMode || t.ready || TEASERS.has(t.id);
  /* o.night = 잠자리 탭 타일(읽어 주기 주소 + 읽기 시간), o.big = 큰 동화 */
  function cardHTML(t0, o = {}) {
    const t = shown(t0);
    const open = isOpen(t);
    const st = open ? Entitlements.status(t.id) : 'free';
    const rv = window.REVIEW && window.REVIEW[t.id];
    let rvTag = '';
    if (rv && REVIEW_ON) {   // 검수용 '새 그림' 딱지: 주소에 ?review=1 일 때만 (출시 화면에는 없다)
      let rvOk = false; try { rvOk = rvSeen(JSON.parse(localStorage.getItem('review_ok') || '{}')[t.id], rv); } catch (e) { /* 무시 */ }
      rvTag = `<span class="rv-badge${rvOk ? ' ok' : ''}" data-rv="${t.id}" title="${rv}">${rvOk ? '확인함' : '새 그림'}</span>`;
    }
    const extra = o.night ? `<span class="rmin">${t0.readMin ? L(`${t0.readMin}분`, `${t0.readMin} min`) : ''}${lang === 'en' && !t0.readEn ? `<em>${L('한국어만', 'Korean only')}</em>` : ''}</span>` : '';
    const inner = `${rvTag}
      ${holeHTML(t, open, st)}
      <span class="label"><strong class="title">${t.title}</strong>${extra}</span>`;
    const href = `tales/${t.folder || t.id}/index.html${o.night ? '?read=1' : ''}`;
    const attrs = `data-id="${t.id}" data-origin="${t.origin}"${o.night ? ' data-night="1"' : ''}`;
    if (st === 'locked') {
      return `<div class="card locked" role="button" tabindex="0" aria-label="${t.title}, ${L('잠겨 있어요', 'locked')}" ${attrs}>${inner}</div>`;
    }
    return open
      ? `<a class="card" href="${href}" aria-label="${t.title}${st === 'week' ? ', ' + L('이번 주 무료', 'free this week') : ''}${o.night ? ', ' + L('읽어 주기', 'read aloud') : ''}" ${attrs}>${inner}</a>`
      : `<div class="card closed" role="button" tabindex="0" aria-disabled="true" aria-label="${t.title}, ${L('곧 열려요', 'coming soon')}" ${attrs}>${inner}</div>`;
  }

  /* ── 앱 화면의 큰 동화(히어로): 화살표를 톡 눌러 넘기고, 큰 카드를 톡 눌러 연다. 옆으로 밀어도 넘어간다(덤) ──
     큰 동화 아래에는 제목만 둔다(보호자용 한 줄 소개·태그 아이콘은 보호자 영역 '동화 찾기'로 옮겼다). 잠긴·만드는 중 동화는 올라오지 않는다 */
  let heroId = null, heroList = [], heroDir = 0;
  const lastKey = 'paperTheater.last', recentKey = 'paperTheater.recent', recentReadKey = 'paperTheater.recentRead';
  const APP_VERSION = '1.0.0';   // package.json 과 같게 (보호자 영역 '정보'에 보임)
  const readList = k => { try { const a = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(a) ? a.filter(x => typeof x === 'string') : []; } catch (e) { return []; } };
  function pushRecent(id) {
    try { localStorage.setItem(recentKey, JSON.stringify([id, ...readList(recentKey).filter(x => x !== id)].slice(0, 8))); } catch (e) { /* 기억 못 해도 동화는 열린다 */ }
  }
  /* 넘기기 (§5-5): 창은 그대로, 지금 그림은 반대쪽으로 40px 밀리며 200ms 에 사라지고 새 그림은 같은 쪽 40px 에서 320ms 로 들어온다.
     제목은 60ms 늦게 16px 이동하며 바뀐다. 움직임 줄이기 = 160ms 크로스페이드 */
  let heroLock = 0;
  function renderHero() {
    const hero = $('#hero');
    hero.hidden = heroList.length === 0;
    if (!heroList.length) { $('#heroStrip').hidden = true; return; }
    if (!heroList.some(t => t.id === heroId)) heroId = heroList[0].id;
    const t = heroList.find(x => x.id === heroId), name = shown(t).title;
    const slot = $('#heroSlot'), tt = $('#heroTitle'), dir = heroDir;
    heroDir = 0;
    slot.querySelectorAll('.hero-old').forEach(x => x.remove());
    const old = slot.firstElementChild;
    if (dir && old && old.animate) {
      const rm = RM.matches, mv = rm ? 0 : 40, E = 'cubic-bezier(.2,.8,.2,1)';
      old.classList.add('hero-old'); old.removeAttribute('href'); old.setAttribute('aria-hidden', 'true');
      slot.insertAdjacentHTML('beforeend', cardHTML(t, { big: true }));
      old.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-dir * mv}px)`, opacity: 0 }], { duration: rm ? 160 : 200, easing: E, fill: 'forwards' }).onfinish = () => old.remove();
      slot.lastElementChild.animate([{ transform: `translateX(${dir * mv}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: rm ? 160 : 320, easing: E });
      tt.textContent = name;
      tt.animate([{ transform: `translateX(${dir * (rm ? 0 : 16)}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: rm ? 160 : 260, delay: rm ? 0 : 60, easing: E, fill: 'backwards' });
    } else {
      slot.innerHTML = cardHTML(t, { big: true });
      tt.textContent = name;
    }
    const n = heroList.length;
    $('#heroPrev').hidden = $('#heroNext').hidden = n < 2;
    $('#heroPlay').setAttribute('aria-label', L(`${name} 이야기 시작`, `Start ${name}`));
    paintRowSel();
    $('#heroStrip').textContent = name;
  }
  function heroStep(d) {
    if (heroList.length < 2) return;
    const now = performance.now();
    if (now < heroLock) return;                              // 넘기는 동안 다시 누름은 무시(연타 방지)
    heroLock = now + 320;
    const i = heroList.findIndex(t => t.id === heroId);
    heroId = heroList[(i + d + heroList.length) % heroList.length].id;
    heroDir = d;
    paper('tap');
    renderHero();
    const t = heroList.find(x => x.id === heroId);
    sayTitle(shown(t).title, t.id);
  }
  /* 작은 타일 톡 = 그 자리에서 고르기(2026-10-29 사용자 결정: 위로 올라가며 스크롤되던 것을 없앴다).
     첫 톡 = 제목·테마 소리 + 제자리에서 살짝 들림·감빛 테두리, 같은 타일 두 번째 톡 = 열기. 큰 동화도 같은 동화로 바뀌지만 화면은 움직이지 않는다 */
  let rowSel = null;
  const paintRowSel = () => document.querySelectorAll('#rows .card').forEach(c => {
    const on = c.dataset.id === rowSel;
    if (c.classList.contains('sel') && !on) c.getAnimations().forEach(a => a.cancel());
    c.classList.toggle('sel', on);
  });
  function heroSelect(id, c) {
    rowSel = id; heroId = id; heroDir = 0; renderHero();
    const t = heroList.find(x => x.id === id);
    if (t) sayTitle(shown(t).title, t.id);
    if (c && motion()) c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px) scale(1.03)' }, { transform: 'translateY(-4px) scale(1.015)' }], { duration: 300, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'forwards' });
  }
  {
    $('#heroPrev').addEventListener('click', () => heroStep(-1));
    $('#heroNext').addEventListener('click', () => heroStep(1));
    /* 감빛 놀이 시작 원 = 큰 동화 창 톡과 같은 동작(조리개 → 동화) */
    $('#heroPlay').addEventListener('click', () => { const c = $('#heroSlot .card:not(.hero-old)'); if (c) c.click(); });
    /* 생성 그림(ic_play·ic_arrow)이 있으면 임시 기호 대신 */
    if (UIA.has('ic_play')) $('#heroPlay').innerHTML = uiImg('ic_play');
    if (UIA.has('ic_arrow')) ['#heroPrev', '#heroNext'].forEach(s => { $(s).innerHTML = uiImg('ic_arrow'); });
    let sx = null;
    const hz = $('#hero');
    hz.addEventListener('pointerdown', e => { sx = e.clientX; });
    hz.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 70) { heroStep(e.clientX < sx ? 1 : -1); hz.dataset.swiped = '1'; setTimeout(() => { delete hz.dataset.swiped; }, 50); } sx = null; });
    let wheelAt = 0;
    hz.addEventListener('wheel', e => {  // 트랙패드·마우스 스크롤로도 큰 그림 넘기기
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(d) < 12) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelAt < 450) return;
      wheelAt = now; heroStep(d > 0 ? 1 : -1);
    }, { passive: false });
    hz.addEventListener('click', e => { if (hz.dataset.swiped) { e.preventDefault(); e.stopPropagation(); } }, true);
    /* 큰 동화가 스크롤로 가려지면 머리줄 아래에 얇은 제목 띠만 남긴다. 띠를 톡 = 맨 위로 */
    const strip = $('#heroStrip');
    if (window.IntersectionObserver) new IntersectionObserver(es => { const e = es[es.length - 1]; strip.hidden = e.intersectionRatio > .25 || $('#hero').hidden; }, { root: $('#view-tales'), threshold: [0, .1, .25, .5, 1] }).observe(hz);   // 큰 동화가 4분의 3 넘게 가려지면 띠
    strip.addEventListener('click', () => { paper('tap'); try { $('#view-tales').scrollTo({ top: 0, behavior: motion() ? 'smooth' : 'auto' }); } catch (e) { /* 무시 */ } });
  }

  /* ── S1 서가 줄 7개: 이번 주 무료(앱 모드만) · 최근 본 · 창작 · 공주 · 동물(이솝) · 우리나라 · 세계. 비는 줄은 숨기고, 같은 동화가 여러 줄에 나와도 된다.
     동화는 모두 origin 이 하나 있으므로 31편이 최소 한 줄에는 보인다 ── */
  const ROWS = [
    { k: 'week', ko: '이번 주 무료', en: 'Free this week', pick: () => storeMode ? Entitlements.freeThisWeek().map(id => TALES.find(t => t.id === id)).filter(Boolean) : [] },
    { k: 'recent', ko: '최근 본', en: 'Recently played', pick: () => readList(recentKey).map(id => TALES.find(t => t.id === id)).filter(Boolean) },
    { k: 'original', ko: '창작 동화', en: 'Original tales', pick: () => TALES.filter(t => t.origin === 'original') },
    { k: 'princess', ko: '공주', en: 'Princesses', pick: () => TALES.filter(t => (t.also || []).includes('princess')) },
    { k: 'aesop', ko: '동물 이야기', en: 'Animal tales', pick: () => TALES.filter(t => t.origin === 'aesop' || (t.also || []).includes('animal')) },
    { k: 'korean', ko: '우리나라 옛이야기', en: 'Korean tales', pick: () => TALES.filter(t => t.origin === 'korean') },
    { k: 'world', ko: '세계 옛이야기', en: 'World tales', pick: () => TALES.filter(t => t.origin === 'world') }
  ];
  /* 열린 것 → 잠긴 것 → 만드는 중 순서로 (카탈로그 순서는 그대로) */
  const playable = t => isOpen(t) && Entitlements.canPlay(t.id);
  const rank = t => playable(t) ? 0 : isOpen(t) ? 1 : 2;
  const byRank = list => list.map((t, i) => [t, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(x => x[0]);
  let introPending = false;
  function render(opts = {}) {
    const rowsEl = $('#rows');
    const seen = TALES.filter(t => inScope(t) && match(t));
    const vis = new Set(seen.map(t => t.id));
    heroList = TALES.filter(t => vis.has(t.id) && playable(t));
    try { if (!heroId) heroId = localStorage.getItem(lastKey); } catch (e) { /* 무시 */ }
    rowsEl.innerHTML = ROWS.map(r => {
      const list = r.k === 'week' || r.k === 'recent' ? r.pick().filter(t => vis.has(t.id)) : byRank(r.pick().filter(t => vis.has(t.id)));
      if (!list.length) return '';
      return `<section class="row" data-row="${r.k}" aria-label="${L(r.ko, r.en)}"><h3 class="row-h"><span class="row-ic">${rowIcon(r.k)}</span><span class="row-t">${L(r.ko, r.en)}</span></h3>
        <div class="row-scroll">${list.map(t => `<div class="slot" data-id="${t.id}">${cardHTML(t)}</div>`).join('')}</div></section>`;
    }).join('');
    const none = seen.length === 0;
    $('#empty').hidden = !none;
    if (none && !emptySaid) { emptySaid = true; say(L('이 조합의 이야기는 아직 없어요', 'No tales match yet')); }
    if (!none) emptySaid = false;
    renderHero();
    renderNight(); drawStickers();
    if ((opts.intro || introPending) && motion() && opts.anim !== false) {     // 처음 열릴 때: 타일이 차례로 살짝 떠오른다
      introPending = false;
      let k = 0;
      rowsEl.querySelectorAll('.card').forEach(c => {
        const r = c.getBoundingClientRect();
        if (r.top > innerHeight || r.bottom < 0) return;
        c.animate([{ opacity: 0, transform: 'translateY(12px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: Math.min(k++, 14) * 30 + (opts.delay || 0) * 1000, easing: 'cubic-bezier(.2,.9,.3,1.2)', fill: 'backwards' });
      });
    }
  }
  let emptySaid = false;
  const requestRender = () => render({ anim: false });

  /* ── 언어: 영어 자료가 있는 동화만 영어로 (나머지는 한국어 그대로). 바꾸는 곳은 보호자 영역 ── */
  function paintLang() {
    document.documentElement.lang = lang;
    paintLogo();
    /* 보조기기용 이름도 언어를 따른다 */
    const set = (sel, v) => { const el = $(sel); if (el) el.setAttribute('aria-label', v); };
    set('#tabs', L('메뉴', 'Menu'));
    set('#parentBtn', L('보호자 메뉴: 1초 동안 누르세요. 화면 읽기 기능을 쓰면 두 번 탭해도 열려요', 'Grown-up menu: press and hold for 1 second. With a screen reader, double-tap'));
    set('#hero', L('오늘의 동화', 'Featured tale'));
    set('#heroPrev', L('이전 동화', 'Previous tale'));
    set('#heroNext', L('다음 동화', 'Next tale'));
    set('#view-tales', L('동화 놀이', 'Tale Play'));
    set('#view-night', L('읽어 주기', 'Read to Me'));
    set('#view-stickers', L('스티커북', 'Sticker Book'));
    set('#pzRow', L('퍼즐판', 'Puzzle boards'));
    set('#guardList', L('보호자 항목', 'Grown-up items'));
  }
  function paintLogo() {
    const logo = $('.logo'), words = lang === 'en' ? ['Toki', 'Toki', 'Tale'] : ['톡', '톡', '동', '화', '극', '장'], gapAt = 2;
    logo.innerHTML = `<span class="sr">${L('톡톡 동화극장', 'Toki Toki Tale')}</span>` +
      words.map((w, i) => `<span class="lt${i === gapAt ? ' gap' : ''}${lang === 'en' && i < 2 ? ' w' : ''}" aria-hidden="true">${w}</span>`).join('');
    document.title = L('톡톡 동화극장', 'Toki Toki Tale');
  }
  paintLang();
  /* 로고 마크(§6-2 logo_mark): 가로 = 레일 맨 위 48(pL 40), 세로 = 머리줄 워드마크 옆 36. 어느 쪽을 보일지는 CSS 가 정한다 */
  if (UIA.has('logo_mark')) {
    $('#tabs').insertAdjacentHTML('afterbegin', uiImg('logo_mark', 'logo-mark rail'));
    $('.brand .logo').insertAdjacentHTML('beforebegin', uiImg('logo_mark', 'logo-mark head'));
  }

  function update(opts) {
    try { paintChips(); paintFilterOn(); } catch (e) { console.error(e); } // 칩 표시가 틀어져도 동화 목록은 반드시 그린다
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
    if (!card.dataset.night) pushRecent(card.dataset.id);
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
    const plug = c.querySelector('.plug') || c.querySelector('.bdg-lock');   // 잠김은 모서리 자물쇠가 들썩인다
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
    /* 잠긴 동화는 큰 동화로 올라오지 않고, 어디를 눌러도 아이용 잠김 쪽지(S4)가 먼저 열린다 */
    if (c.classList.contains('locked')) { e.preventDefault(); paper('down'); peek(c); openLock(t.id); return; }
    /* 만드는 중: 마개가 들썩이고 '곧 열려요' (큰 동화로는 올라오지 않는다) */
    if (c.classList.contains('closed')) {
      e.preventDefault();
      paper('down');
      peek(c);
      sayTitle(L(`${shown(t).title}. 곧 열려요.`, `${shown(t).title}. Coming soon.`), t.id);
      return;
    }
    if (!inHero && c.dataset.id !== rowSel) { e.preventDefault(); paper('tap'); heroSelect(c.dataset.id, c); return; }
    paper('tap');
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (err) { /* 무시 */ }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;   // 새 탭 열기는 그대로
    e.preventDefault();
    openTale(c);
  }
  $('#rows').addEventListener('click', activate);
  $('#heroSlot').addEventListener('click', activate);
  const cardKey = e => {
    if ((e.key === 'Enter' || e.key === ' ') && (e.target.classList.contains('closed') || e.target.classList.contains('locked'))) { e.preventDefault(); e.target.click(); }
  };
  $('#rows').addEventListener('keydown', cardKey);
  $('#nightBody').addEventListener('keydown', cardKey);
  $('#heroSlot').addEventListener('keydown', cardKey);

  /* ── 꾹 누르기: 톱니(1초)·'어른이 열기'(1초)·부모 확인 정답(1.5초)이 같은 부품을 쓴다.
     누르는 동안 .holding 이 붙고(CSS 가 --hold 시간 동안 채움), 끝까지 누르면 done, 중간에 떼면 early ── */
  function holdable(el, ms, done, early) {
    let timer = 0, fired = false;
    el.style.setProperty('--hold', ms + 'ms');
    /* 꾹 단추(어른이 열기·정답)는 둘레에 감빛 링이 찬다 (§5-8). 모양은 CSS .hold-ring */
    if (el.classList.contains('holdbtn') && !el.querySelector('.hold-ring')) el.insertAdjacentHTML('beforeend', '<i class="hold-ring" aria-hidden="true"></i>');
    const start = e => {
      if (e.button) return;
      fired = false;
      el.classList.add('holding');
      clearTimeout(timer);
      timer = setTimeout(() => {   // 링이 다 차면 60ms 크림으로 밝아졌다 사라지고 동작 (§5-8)
        fired = true; el.classList.remove('holding'); el.classList.add('held');
        setTimeout(() => { el.classList.remove('held'); done(); }, 60);
      }, ms);
    };
    const end = () => {
      if (!el.classList.contains('holding')) return;
      el.classList.remove('holding');
      clearTimeout(timer);
      if (!fired && early) early();
    };
    el.addEventListener('pointerdown', start);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, end));
    el.addEventListener('contextmenu', e => e.preventDefault());
    /* VoiceOver·스위치 컨트롤의 '활성화'는 손가락 누름 없이 click(detail 0)만 보낸다 → 꾹 누르기 대신 바로 통과시킨다.
       아이의 손가락 톡은 pointerdown 이 먼저 오고 detail 이 1 이상이라 여기로 오지 않는다 */
    el.addEventListener('click', e => { if (e.detail === 0 && e.isTrusted && !e.pointerType) { e.preventDefault(); clearTimeout(timer); el.classList.remove('holding'); done(); } });
    el.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(e); } });
    el.addEventListener('keyup', e => { if (e.key === 'Enter' || e.key === ' ') end(); });
  }

  /* ── 쪽지 열고 닫기 (UI_REDESIGN §5-4): 움직임은 CSS 가 맡는다. data-state="open" 으로 놓이고,
     "closing" 으로 걷히며 베일의 전환이 끝나면(transitionend) hidden. 튕김 없음 ── */
  const modalStop = el => { clearTimeout(el._t); if (el._te) el.removeEventListener('transitionend', el._te); el._te = null; };
  function showModal(el, sheet, o = {}) {
    modalStop(el);
    hint.hidden = true;
    const opened = !el.hidden && el.dataset.state === 'open';
    el.hidden = false;
    if (!opened) { void el.offsetWidth; el.dataset.state = 'open'; }   // 닫힌 모습을 한 번 그린 뒤 열어야 전환이 보인다
    const f = o.focus && el.querySelector(o.focus); if (f) f.focus({ preventScroll: true });
  }
  function hideModal(el, sheet, after) {
    if (el.hidden || el.dataset.state === 'closing') return;
    modalStop(el);
    el.dataset.state = 'closing';
    const fin = () => {
      if (el.dataset.state !== 'closing') return;
      modalStop(el);
      el.hidden = true; delete el.dataset.state;
      if (after) after();
    };
    el._te = e => { if (e.target === el && e.propertyName === 'opacity') fin(); };
    el.addEventListener('transitionend', el._te);
    el._t = setTimeout(fin, 400);   // 전환이 안 끝나도(탭이 가려짐 등) 닫는다
  }
  /* 짧은 안내 쪽지(톱니를 짧게 눌렀을 때·부모 확인 잠금 중) */
  const hint = $('#hint');
  let hintTimer = 0;
  function toast(msg) {
    hint.textContent = msg;
    hint.hidden = false;
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => { hint.hidden = true; }, 1800);
  }

  const guardEl = $('#guard'), guardSheet = guardEl.querySelector('.gpaper'), guardList = $('#guardList'), guardPane = $('#guardPane'), guardBody = $('#guardBody');
  const gateEl = $('#gate'), gateSheet = gateEl.querySelector('.sheet');
  const flowEl = $('#flow'), flowSheet = flowEl.querySelector('.sheet');
  const isApp = Entitlements.appMode();
  const title = id => shown(TALES.find(x => x.id === id)).title;
  const anyOpen = () => !guardEl.hidden || !flowEl.hidden || !gateEl.hidden;

  /* ── S10 부모 확인: 곱셈 + 보기 4개. 정답을 1.5초 꾹 눌러야 통과, 틀린 답을 끝까지 누르면 30초 잠김.
     통과는 지금 열린 보호자 영역·이용권 쪽지 안에서만 유효하다(모두 닫으면 다시 묻는다) ── */
  const GATE_HOLD = 1500, GATE_LOCK = 30000;
  let passOk = false, gateLockUntil = 0, gateAnswer = 0, gateCb = null;
  const sheetClosed = () => { if (!anyOpen()) passOk = false; };
  const GATE_WHY = {
    buy: ['결제 화면으로 가려면 아래 문제를 풀어 주세요.', 'To go on to purchase, please answer this question.'],
    pick: ['동화를 고르려면 아래 문제를 풀어 주세요.', 'To pick a tale, please answer this question.'],
    link: ['기기를 연결하려면 아래 문제를 풀어 주세요.', 'To link devices, please answer this question.'],
    open: ['이용권 화면으로 가려면 아래 문제를 풀어 주세요.', 'To open the access screen, please answer this question.'],
    doc: ['문서를 보려면 아래 문제를 풀어 주세요.', 'To read the document, please answer this question.'],
    reset: ['기록을 지우려면 아래 문제를 풀어 주세요.', 'To erase records, please answer this question.']
  };
  function newGate() {
    const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    gateAnswer = a * b;
    const opts = new Set([gateAnswer]);
    while (opts.size < 4) {
      const d = [-10, -9, -8, -7, -6, -4, -3, -2, 2, 3, 4, 6, 7, 8, 9, 10][Math.floor(Math.random() * 16)];
      if (gateAnswer + d > 0) opts.add(gateAnswer + d);
    }
    $('#gateQ').textContent = `${a} × ${b} = ?`;
    const box = $('#gateOpts');
    box.innerHTML = [...opts].sort(() => Math.random() - .5).map(n => `<button type="button" class="gate-opt holdbtn" data-n="${n}"><b>${n}</b></button>`).join('');
    box.querySelectorAll('.gate-opt').forEach(b => holdable(b, GATE_HOLD, () => gateAnswered(+b.dataset.n),
      () => { $('#gateHint').textContent = L('답을 1.5초 동안 꾹 눌러 주세요.', 'Press and hold your answer for 1.5 seconds.'); paper('down'); }));
  }
  /* why: GATE_WHY 의 열쇠, onPass: 통과한 뒤 할 일 */
  function parentCheck(why, onPass) {
    if (passOk) { onPass(); return; }
    const left = Math.ceil((gateLockUntil - Date.now()) / 1000);
    if (left > 0) { toast(L(`잠시 뒤에 다시 해 주세요 (${left}초)`, `Please try again in ${left} s`)); return; }
    gateCb = onPass;
    $('#gateTitle').textContent = L('어른이 확인해 주세요', 'Grown-ups, please check');
    $('#gateHow').textContent = L(...(GATE_WHY[why] || GATE_WHY.open));
    $('#gateHint').textContent = L('정답을 1.5초 동안 꾹 눌러요.', 'Press and hold the right answer for 1.5 seconds.');
    $('#gateClose').textContent = L('닫기', 'Close');
    newGate();
    flowEl.classList.add('under');          // 잠김 쪽지 위에 뜰 때 뒤 쪽지는 숨긴다(쪽지 두 장이 겹쳐 보이지 않게)
    showModal(gateEl, gateSheet, { focus: '#gateClose' });
  }
  const gateOff = after => { flowEl.classList.remove('under'); if (after) after(); };
  function gateAnswered(n) {
    const cb = gateCb; gateCb = null;
    const opt = gateEl.querySelector(`.gate-opt[data-n="${n}"]`);
    if (n === gateAnswer) {                                  // 통과: 고른 조각이 감빛으로 바뀌고 120ms 뒤 다음 단계 (§4-5)
      paper('tap'); passOk = true;
      if (opt) opt.classList.add('pass');
      setTimeout(() => hideModal(gateEl, gateSheet, () => gateOff(cb)), 120);
      return;
    }
    paper('down');
    gateLockUntil = Date.now() + GATE_LOCK;
    gateSheet.classList.add('fail');                         // 틀림: 쪽지가 40ms 에 6px 눌렸다 올라오고 닫힌다(흔들기 없음)
    setTimeout(() => { gateSheet.classList.remove('fail'); hideModal(gateEl, gateSheet, () => { gateOff(); sheetClosed(); toast(L('틀렸어요. 30초 뒤에 다시 해 주세요.', 'Not quite. Please try again in 30 seconds.')); }); }, 100);
  }
  function closeGate() { gateCb = null; hideModal(gateEl, gateSheet, () => gateOff(sheetClosed)); }
  $('#gateClose').addEventListener('click', closeGate);
  gateEl.addEventListener('click', e => { if (e.target === gateEl) closeGate(); });

  /* ── 톱니(1초 꾹) → S9 보호자 영역 ── */
  const gear = $('#parentBtn');
  holdable(gear, 1000, () => openGuard(), () => toast(L('보호자 메뉴는 1초 동안 꾹 누르세요', 'Press and hold for 1 second for the grown-up menu')));

  /* 보호자 쪽 기능 도우미: 대사 자막·자동 재생·놀이 시간(동화 엔진이 같은 키를 읽는다) */
  const captionsOff = () => { try { return localStorage.getItem('captions_off') === '1'; } catch (e) { return false; } };
  const autoOn = () => { try { return localStorage.getItem('auto_play') === '1'; } catch (e) { return false; } };
  const setFlag = (k, on) => { try { if (on) localStorage.setItem(k, '1'); else localStorage.removeItem(k); } catch (err) { /* 저장 못 하면 이번만 */ } };
  const TIMES = [0, 10, 15, 20, 30];
  const limitNow = () => { try { return +JSON.parse(localStorage.getItem('play_limit_min')) || 0; } catch (e) { return 0; } };
  function resetFilters() { sel.origin.clear(); sel.skill.clear(); update(); }
  $('#emptyReset').addEventListener('click', () => { paper('down'); resetFilters(); });
  /* 필터가 걸려 있으면 머리줄에 작은 '필터 중' 표시 */
  function paintFilterOn() {
    const on = sel.origin.size + sel.skill.size > 0, el = $('#filterOn');
    el.hidden = !on; el.textContent = L('필터 중', 'Filtered');
  }

  /* ── S9 보호자 영역: 아이패드·가로 = 2열(왼쪽 목록, 오른쪽 내용), 아이폰 세로 = 1열 push ── */
  /* 뒤로 단추: 생성 그림 ic_arrow(오른쪽 화살)를 CSS 로 뒤집어 쓴다(.g-back-ic) */
  const backIc = () => UIA.has('ic_arrow') ? uiImg('ic_arrow', 'g-back-ic') : '<svg aria-hidden="true"><use href="#i-back"/></svg>';
  const GI = {
    sound: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/>',
    time: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    lang: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/>',
    find: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    link: '<circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/>',
    about: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.5"/>',
    records: '<path d="M6 7h12M9 7V4.5h6V7M7.5 7l.8 12.5h7.4L16.5 7"/>'
  };
  const guardItems = () => [
    { k: 'sound', t: L('소리와 글', 'Sound & text') },
    { k: 'time', t: L('놀이 시간', 'Play time') },
    { k: 'lang', t: L('언어', 'Language') },
    { k: 'find', t: L('동화 찾기', 'Find tales') },
    ...(isApp ? [{ k: 'pass', t: L('이용권', 'Access') }, { k: 'link', t: L('기기 연결', 'Link devices') }] : []),
    { k: 'about', t: L('정보', 'About') },
    { k: 'records', t: L('기록', 'Records') }
  ];
  let curGuard = 'sound', recAsk = '', linkTick = 0, docShown = '';
  function drawGuardList() {
    $('#guardTitle').textContent = L('보호자', 'Grown-ups');
    $('#guardCloseT').textContent = L('닫기', 'Close');
    guardList.innerHTML = guardItems().map(i => `<button type="button" class="g-item${i.k === curGuard ? ' on' : ''}" data-k="${i.k}" aria-current="${i.k === curGuard}">${UIA.has('g_' + i.k) ? uiImg('g_' + i.k, 'g-ic') : `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i.k === 'pass' ? '<use href="#i-ticket"/>' : GI[i.k]}</svg>`}<span>${i.t}</span></button>`).join('');
  }
  function openGuard() {
    hint.hidden = true;
    curGuard = guardItems().some(i => i.k === curGuard) ? curGuard : 'sound';
    delete guardBody.dataset.open;           // 1열일 때는 목록부터
    recAsk = ''; docShown = '';
    drawGuardList(); drawGuardPane();
    showModal(guardEl, guardSheet, { gentle: true, focus: '#guardClose' });
  }
  function closeGuard() {
    clearInterval(linkTick);
    hideModal(guardEl, guardSheet, sheetClosed);
  }
  const refreshGuard = () => { if (!guardEl.hidden && curGuard !== 'link') drawGuardPane(); };
  $('#guardClose').addEventListener('click', closeGuard);
  guardList.addEventListener('click', e => {
    const b = e.target.closest('.g-item'); if (!b) return;
    paper('tap');
    curGuard = b.dataset.k; recAsk = ''; docShown = '';
    guardBody.dataset.open = '1';
    drawGuardList(); drawGuardPane();
    guardPane.scrollTop = 0;
  });

  /* 설정 줄 72: 글자 왼쪽, 스위치 72×40 오른쪽(§7-8). 체크박스는 보이지 않게 두고 같은 change 처리 */
  const switchHTML = (key, on, label) => `<label class="toggle"><span class="tg-t">${label}</span><input type="checkbox" role="switch" data-opt="${key}"${on ? ' checked' : ''}><i class="sw" aria-hidden="true"></i></label>`;
  const chipRowHTML = row => `<section class="tagrow"><h4 class="row-tab">${row === 'origin' ? L('이야기 종류', 'Kind of tale') : L('배우는 것', 'What it teaches')}</h4><div class="chips" role="group" data-row="${row}">`
    + [{ key: '', label: L('전체', 'All'), ic: 'all' }, ...TAGS[row].map(t => ({ key: t.key, label: (lang === 'en' && t.en) || t.label, ic: t.key }))]
      .map(c => `<button type="button" class="chip${c.key ? '' : ' all'}" data-row="${row}" data-key="${c.key}" aria-label="${c.label}">${icon(c.ic)}<span class="lb" aria-hidden="true">${letters(c.label)}</span></button>`).join('') + '</div></section>';

  function passHTML() {
    const s = Entitlements.state(), names = ids => ids.length ? ids.map(title).join(', ') : L('없어요', 'None');
    const wait = Entitlements.waitAvailable(), left = Entitlements.waitDaysLeft(), stars = Entitlements.starBalance(), need = Entitlements.STAR_NEED;
    const opened = [...new Set([...s.starUnlocked, ...s.waitUnlocked])];
    const waitTxt = wait ? L(`지금 ${wait}편을 열 수 있어요.`, `You can open ${wait} now.`) : left ? L(`${left}일 뒤에 한 편을 열 수 있어요.`, `One more can be opened in ${left} days.`) : L('기다무를 모두 썼어요.', 'All waiting passes are used.');
    return `<h3>${L('이용권', 'Access')}</h3>
      <dl class="g-dl">
        <dt>${L('이번 주 무료', 'Free this week')}</dt><dd>${names(Entitlements.freeThisWeek())}<small>${L('월요일마다 바뀌어요.', 'Changes every Monday.')}</small></dd>
        <dt>${L('열어 둔 동화', 'Opened tales')}</dt><dd>${Entitlements.state().owned ? L('모든 동화가 열려 있어요.', 'Every tale is open.') : names(opened)}</dd>
        <dt>${L('기다무', 'Waiting pass')}</dt><dd>${waitTxt}${wait ? `<button type="button" class="ticket alt" data-act="g-wait">${L('한 편 고르기', 'Pick a tale')}</button>` : ''}</dd>
        <dt>${L('종이별', 'Paper Stars')}</dt><dd>${Math.min(stars, 99)} / ${need}${stars >= need && Entitlements.lockedChoices().length ? `<button type="button" class="ticket alt" data-act="g-star">${L('한 편 고르기', 'Pick a tale')}</button>` : ''}</dd>
      </dl>
      <p class="how buy-msg" id="gMsg" hidden></p>
      <div class="g-btns">
        ${s.owned ? '' : `<button type="button" class="ticket alt" data-act="g-buy">${L(`모든 동화 열기 ${Entitlements.PRICE}`, `Unlock all ${Entitlements.PRICE}`)}</button>`}
        <button type="button" class="ticket alt" data-act="g-restore">${L('구매 복원', 'Restore purchase')}</button>
      </div>
      <p class="how">${L('고르기·결제·복원 앞에서는 어른 확인을 한 번 더 해요.', 'A grown-up check comes before picking, buying or restoring.')}</p>`;
  }
  function drawGuardPane() {
    clearInterval(linkTick);
    const k = curGuard, back = `<button type="button" class="g-pback" data-act="g-back">${backIc()}${L('보호자', 'Grown-ups')}</button>`;
    const name = (guardItems().find(i => i.k === k) || {}).t || '';
    let h = '';
    if (k === 'sound') {
      h = `<h3>${name}</h3>
        <p class="how">${L('탭 이름과 안내는 늘 소리로 읽어 줘요. 아이가 아직 글을 못 읽기 때문이에요.', 'Tab names and guidance are always read aloud, since young children cannot read yet.')}</p>
        ${switchHTML('titlevoice', !titleVoiceOff(), L('동화 그림을 누르면 제목과 테마 소리 들려주기', 'Play the title and theme sound when a tale picture is tapped'))}
        ${switchHTML('caption', !captionsOff(), L('동화 속 글 상자(대사 자막) 보여 주기', 'Show story captions (speech text box)'))}
        ${switchHTML('auto', autoOn(), L('자동 재생', 'Auto-play'))}
        <p class="how">${L('놀이 조작 없이 이야기만 흘러가요. 잠자리에 읽어 줄 때는 \'읽어 주기\' 탭을 써요.', 'The story plays on its own with no taps. For bedtime reading, use the Read to Me tab.')}</p>`;
    } else if (k === 'time') {
      h = `<h3>${name}</h3>
        <div class="seg" id="timerOpts" role="group" aria-label="${name}">${TIMES.map(m => `<button type="button" class="${m === limitNow() ? 'on' : ''}" data-m="${m}" aria-pressed="${m === limitNow()}">${m ? m + L('분', ' min') : L('끄기', 'Off')}</button>`).join('')}</div>
        <p class="how">${L('하루 기준이에요. 시간이 되면 소리 없이 조용한 쉬는 화면이 나와요. 놀이 시간은 화면을 보는 시간이라서, 잠자리 읽어 주기는 끝난 뒤에 적용돼요.', 'Counted per day. When time is up, a quiet rest screen appears — no alarm. It counts screen time, so Bedtime read-aloud finishes first.')}</p>`;
    } else if (k === 'lang') {
      h = `<h3>${name}</h3>
        <div class="seg" role="group" aria-label="${name}"><button type="button" class="${lang === 'ko' ? 'on' : ''}" data-lang="ko" aria-pressed="${lang === 'ko'}">한국어</button><button type="button" class="${lang === 'en' ? 'on' : ''}" data-lang="en" aria-pressed="${lang === 'en'}">English</button></div>
        <p class="how">${L('바꾸면 글, 목소리, 동화 순서가 바뀌어요. 영어 자료가 없는 동화는 한국어로 나와요.', 'Text, voices and tale order change. Tales without English material appear in Korean.')}</p>`;
    } else if (k === 'find') {
      const list = TALES.filter(match);
      h = `<h3>${name}</h3>
        <p class="how">${L('위 줄에서 <b>이야기 종류</b>, 아래 줄에서 <b>배우는 것</b>을 고르면 동화 탭에 그 동화만 나와요. 같은 줄에서 여러 개를 고르면 <b>하나라도</b> 맞는 이야기, 두 줄을 함께 고르면 <b>둘 다</b> 맞는 이야기예요. 공주 동화는 다른 종류와 겹쳐서 나와요.', 'Pick a kind of tale and/or what it teaches, and only those tales show in the Tales tab. Several picks in one row match <b>any</b>; picks in both rows must match <b>both</b>.')}</p>
        ${chipRowHTML('origin')}${chipRowHTML('skill')}
        <div class="g-btns"><button type="button" class="ticket alt" data-act="g-clear">${L('필터 지우기', 'Clear filters')}</button></div>
        <h4 class="row-tab">${L(`동화 ${list.length}편`, `${list.length} tales`)}</h4>
        <ul class="g-tales">${list.map(t0 => { const t = shown(t0); return `<li><b>${t.title}</b><span>${t.line}</span></li>`; }).join('')}</ul>`;
    } else if (k === 'pass') {
      h = passHTML();
    } else if (k === 'link') {
      const off = navigator.onLine === false;
      h = `<h3>${name}</h3>
        <p class="how">${L('다른 기기에서도 같은 기록을 쓰려면, 한 기기에서 코드를 만들고 다른 기기에 넣어요. 코드는 10분 동안, 한 번만 쓸 수 있어요.', 'To share progress on another device, make a code on one device and enter it on the other. A code works once, for 10 minutes.')}</p>
        <div class="link-two"><button type="button" class="ticket alt" data-act="lk-make"${off ? ' disabled' : ''}>${L('이 기기에서 코드 만들기', 'Make a code here')}</button><button type="button" class="ticket alt" data-act="lk-in"${off ? ' disabled' : ''}>${L('다른 기기의 코드 넣기', 'Enter a code')}</button></div>
        ${off ? `<p class="how buy-msg">${L('인터넷이 있어야 해요.', 'An internet connection is needed.')}</p>` : ''}
        <div id="lkView"></div>`;
    } else if (k === 'about') {
      h = `<h3>${name}</h3>
        <dl class="g-dl"><dt>${L('버전', 'Version')}</dt><dd>${APP_VERSION}</dd>
        <dt>${L('문의', 'Contact')}</dt><dd>github.com/DH-KIM-hug/paper-tale-theater/issues</dd></dl>
        <div class="g-btns"><button type="button" class="ticket alt" data-act="doc-privacy">${L('개인정보 처리방침', 'Privacy policy')}</button><button type="button" class="ticket alt" data-act="doc-credits">${L('그림·소리 출처', 'Credits')}</button></div>
        <div id="docView"></div>`;
    } else if (k === 'records') {
      const ask = { progress: L('동화 진행 기록(마지막 본 동화, 오늘 놀이 시간)을 지울까요?', 'Erase play progress (last tale, today\'s play time)?'), all1: L('이 기기의 종이별·스티커·열어 둔 동화·기기 연결을 모두 초기화할까요?', 'Reset Paper Stars, stickers, opened tales and device link on this device?'), all2: L('마지막 확인이에요. 되돌릴 수 없어요. (구매는 \'구매 복원\'으로 다시 받을 수 있어요.)', 'Last check. This cannot be undone. (A purchase can be restored with Restore purchase.)') };
      h = `<h3>${name}</h3>
        <div class="g-btns"><button type="button" class="ticket alt danger" data-act="rec-progress">${L('동화 진행 기록 지우기', 'Erase play progress')}</button><button type="button" class="ticket alt danger" data-act="rec-all">${L('이 기기의 종이별·기록 초기화', 'Reset stars & records on this device')}</button></div>
        ${recAsk ? `<div class="g-ask"><p class="how">${ask[recAsk]}</p><div class="g-btns"><button type="button" class="ticket alt" data-act="rec-no">${L('그만두기', 'Cancel')}</button><button type="button" class="ticket" data-act="rec-yes">${recAsk === 'all1' ? L('다음', 'Next') : L('지우기', 'Erase')}</button></div></div>` : ''}`;
    }
    guardPane.innerHTML = back + h;
    if (k === 'find') paintChips();
  }
  /* 기록 지우기 (동화 쪽 키·Entitlements 의 저장 키) */
  function eraseRecords(all) {
    const keys = ['paperTheater.last', 'play_used', 'play_bonus'];
    if (all) keys.push('sync_state', 'sync_dirty', 'sync_receipt', 'sync_account', 'owned_all');
    try { keys.forEach(k => localStorage.removeItem(k)); } catch (e) { /* 저장소가 없으면 지울 것도 없다 */ }
    if (all) { closeGuard(); setTimeout(() => location.reload(), 250); }
    else { recAsk = ''; drawGuardPane(); toast(L('지웠어요.', 'Erased.')); }
  }
  async function doPurchase(msgEl) {
    if (busyBuy) return;
    busyBuy = true; paper('tap');
    let ok = false;
    try { ok = await Entitlements.purchase(); } catch (err) { ok = false; }
    afterBuy(ok, msgEl, '결제가 끝나지 않았어요. 다시 해 주세요.', 'The purchase did not go through. Please try again.');
  }
  async function doRestore(msgEl) {
    if (busyBuy) return;
    busyBuy = true; paper('tap');
    let ok = false;
    try { ok = await Entitlements.restore(); } catch (err) { ok = false; }
    afterBuy(ok, msgEl, '복원할 구매를 찾지 못했어요.', 'No purchase was found to restore.');
  }
  let busyBuy = false;
  function afterBuy(ok, msgEl, failKo, failEn) {
    busyBuy = false;
    if (ok) {
      closeFlow(); closeGuard(); render({ anim: false }); paintTabBadge();
      setTab('tales', { silent: true });
      say(L('모든 동화가 열렸어요!', 'Every tale is open!'));
      return;
    }
    const el = msgEl && document.body.contains(msgEl) ? msgEl : $('#gMsg') || $('#flowMsg');
    if (el) { el.textContent = L(failKo, failEn); el.hidden = false; }
  }

  guardPane.addEventListener('change', e => {
    const o = e.target.dataset && e.target.dataset.opt;
    if (o === 'caption') setFlag('captions_off', !e.target.checked);
    else if (o === 'auto') setFlag('auto_play', e.target.checked);
    else if (o === 'titlevoice') setFlag('title_voice_off', !e.target.checked);
  });
  guardPane.addEventListener('click', e => {
    const chip = e.target.closest('.chip[data-row]');
    if (chip) {                                            // 동화 찾기 칩
      const row = chip.dataset.row, key = chip.dataset.key;
      paper(key && !sel[row].has(key) ? 'up' : 'down');
      if (!key) sel[row].clear(); else if (sel[row].has(key)) sel[row].delete(key); else sel[row].add(key);
      update();
      const ul = guardPane.querySelector('.g-tales'), head = ul && ul.previousElementSibling;   // 아래 목록·개수만 새로 그린다
      if (ul) { const list = TALES.filter(match); head.textContent = L(`동화 ${list.length}편`, `${list.length} tales`); ul.innerHTML = list.map(t0 => { const t = shown(t0); return `<li><b>${t.title}</b><span>${t.line}</span></li>`; }).join(''); }
      return;
    }
    const tm = e.target.closest('#timerOpts button');
    if (tm) {
      try { localStorage.setItem('play_limit_min', JSON.stringify(+tm.dataset.m)); } catch (err) { /* 저장 없이도 동작 */ }
      paper('tap'); drawGuardPane(); return;
    }
    const lg = e.target.closest('[data-lang]');
    if (lg) {
      lang = lg.dataset.lang;
      try { localStorage.setItem('lang', lang); } catch (err) { /* 저장 못 해도 이 화면은 바뀐다 */ }
      paper('down'); paintLang(); paintTabs(); paintFilterOn(); render({ anim: false }); drawGuardList(); drawGuardPane();
      return;
    }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act;
    if (act === 'g-back') { delete guardBody.dataset.open; paper('tap'); }
    else if (act === 'g-clear') { paper('down'); resetFilters(); drawGuardPane(); }
    else if (act === 'g-wait') parentCheck('pick', () => { pickKind = 'wait'; openFlow('pick', { id: null, sel: null }); });
    else if (act === 'g-star') parentCheck('pick', () => { pickKind = 'star'; openFlow('pick', { id: null, sel: null }); });
    else if (act === 'g-buy') parentCheck('buy', () => doPurchase($('#gMsg')));
    else if (act === 'g-restore') parentCheck('buy', () => doRestore($('#gMsg')));
    else if (act === 'lk-make') parentCheck('link', () => linkMake());
    else if (act === 'lk-in') parentCheck('link', () => linkEnter());
    else if (act === 'doc-privacy') parentCheck('doc', () => showDoc('privacy'));
    else if (act === 'doc-credits') showDoc('credits');
    else if (act === 'rec-progress') parentCheck('reset', () => { recAsk = 'progress'; drawGuardPane(); });
    else if (act === 'rec-all') parentCheck('reset', () => { recAsk = 'all1'; drawGuardPane(); });
    else if (act === 'rec-no') { recAsk = ''; drawGuardPane(); }
    else if (act === 'rec-yes') {
      if (recAsk === 'all1') { recAsk = 'all2'; drawGuardPane(); } else eraseRecords(recAsk === 'all2');
    }
  });
  /* 정보: 개인정보 처리방침(앱 안 문서, 외부 링크가 있어 어른 확인 뒤에)·출처 */
  async function showDoc(which) {
    const box = $('#docView'); if (!box) return;
    if (which === 'privacy') { box.innerHTML = '<iframe class="g-doc" src="privacy.html" title="privacy"></iframe>'; return; }
    box.innerHTML = '<div class="g-doc credits" tabindex="0"></div>';
    /* 앱에는 .md 가 들어가지 않는다(build_www.sh 가 sounds/CREDITS.md 를 CREDITS.txt 로 복사). 웹에서는 .md 도 읽는다 */
    let txt = '';
    for (const f of window.Capacitor ? ['sounds/CREDITS.txt', 'sounds/CREDITS.md'] : ['sounds/CREDITS.md', 'sounds/CREDITS.txt']) {   // 앱은 .txt, 웹은 .md 먼저 (없는 파일을 요청해 404 가 남지 않게)
      try { const r = await fetch(f); if (r.ok) { txt = await r.text(); break; } } catch (e) { /* 다음 후보 */ }
    }
    const view = box.firstChild;
    if (!txt) { view.textContent = L('출처 문서를 열 수 없어요.', 'Cannot open the credits document.'); return; }
    /* 표·제목만 읽기 좋게 옮긴다: '# 제목' → 제목, '| a | b |' → 한 줄 항목, 나머지는 문단 */
    const esc = x => x.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    view.innerHTML = txt.split('\n').map(line => {
      const l = line.trim();
      if (!l || /^\|[\s|:-]+\|$/.test(l)) return '';
      if (/^#{1,3} /.test(l)) return `<h5>${esc(l.replace(/^#+ /, ''))}</h5>`;
      if (l.startsWith('|')) {
        const cells = l.split('|').slice(1, -1).map(c => esc(c.trim().replace(/`/g, '')));
        if (cells[0] === '파일') return '';
        return `<p class="cr-row"><b>${cells[0]}</b> ${cells.slice(1).join(' · ')}</p>`;
      }
      return `<p>${esc(l)}</p>`;
    }).join('');
  }

  /* ── S11-2 기기 연결 (부품): 코드 만들기(8자리 크게 + 남은 시간) · 코드 넣기 ── */
  const MSG_LINK = {
    offline: ['서버에 닿지 않아요. 인터넷을 확인하고 다시 해 주세요.', 'Cannot reach the server. Check your connection and try again.'],
    code_invalid: ['없거나 시간이 지난 코드예요. 새 코드를 받아 주세요.', 'That code does not exist or has expired. Please get a new one.'],
    code_self: ['이 기기에서 만든 코드예요. 다른 기기에서 입력해 주세요.', 'This code was made on this device. Enter it on another device.'],
    rate_limited: ['너무 자주 눌렀어요. 잠시 뒤에 다시 해 주세요.', 'Too many tries. Please wait a little.'],
    bad_request: ['코드는 8자리예요. 다시 확인해 주세요.', 'The code has 8 characters. Please check it.']
  };
  const linkErr = e => L(...(MSG_LINK[e] || ['연결하지 못했어요. 다시 해 주세요.', 'Could not link. Please try again.']));
  function paintLeft(exp) {
    const sec = Math.max(0, Math.round((exp - Date.now()) / 1000)), el = $('#lkLeft'), code = $('#lkCode');
    if (!el) { clearInterval(linkTick); return; }
    if (!sec) { clearInterval(linkTick); code.hidden = true; el.textContent = L('코드 시간이 지났어요. 새로 만들어 주세요.', 'The code has expired. Please make a new one.'); return; }
    el.textContent = L(`남은 시간 ${Math.floor(sec / 60)}분 ${String(sec % 60).padStart(2, '0')}초`, `Time left ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`);
  }
  async function linkMake() {
    clearInterval(linkTick);
    const v = $('#lkView');
    v.innerHTML = `<p class="link-code" id="lkCode" hidden></p><p class="how" id="lkLeft"></p><p class="how buy-msg" id="lkMsg" hidden></p>`;
    const r = await Entitlements.createLinkCode();
    if (!$('#lkView') || curGuard !== 'link') return;
    if (!r.ok) { $('#lkLeft').hidden = true; $('#lkMsg').textContent = linkErr(r.error); $('#lkMsg').hidden = false; return; }
    $('#lkCode').textContent = r.code.slice(0, 4) + ' ' + r.code.slice(4); $('#lkCode').hidden = false;
    const exp = typeof r.expiresAt === 'number' ? (r.expiresAt < 1e12 ? r.expiresAt * 1000 : r.expiresAt) : Date.parse(r.expiresAt) || Date.now() + 600000;
    paintLeft(exp); linkTick = setInterval(() => paintLeft(exp), 1000);
  }
  function linkEnter() {
    clearInterval(linkTick);
    const v = $('#lkView');
    v.innerHTML = `<div class="link-in"><label class="how" for="lkInput">${L('다른 기기의 코드를 넣어요', 'Enter the code from the other device')}</label>
      <input id="lkInput" class="link-input" type="text" maxlength="9" autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="text">
      <button type="button" class="ticket" id="lkGo">${L('연결하기', 'Link')}</button></div><p class="how buy-msg" id="lkMsg" hidden></p>`;
    $('#lkInput').addEventListener('input', e => { e.target.value = Entitlements.cleanCode(e.target.value).slice(0, 8); });
    $('#lkInput').focus();
    $('#lkGo').addEventListener('click', async () => {
      paper('tap');
      const msg = $('#lkMsg'), btn = $('#lkGo');
      btn.disabled = true;
      const r = await Entitlements.redeemLinkCode($('#lkInput').value);
      btn.disabled = false;
      msg.hidden = false;
      if (r.ok) { msg.textContent = L('연결됐어요! 두 기기가 같은 기록을 써요.', 'Linked! Both devices now share the same progress.'); render({ anim: false }); paintTabBadge(); }
      else msg.textContent = linkErr(r.error);
    });
  }

  /* ── 잠금 흐름: S4 잠김 쪽지(아이) → S10 → S11 이용권 → S12 고르기. 하나의 쪽지(#flow)가 단계마다 내용을 바꾼다 ── */
  const LOCK_SVG = '<svg viewBox="0 0 48 56" aria-hidden="true"><path d="M13 24v-7a11 11 0 0 1 22 0v7" fill="none" stroke="#5C6784" stroke-width="5" stroke-linecap="round"/><rect x="6" y="22" width="36" height="28" rx="5" fill="#5C6784"/><circle cx="24" cy="35" r="4" fill="#F5EFE9"/><rect x="22" y="35" width="4" height="9" rx="2" fill="#F5EFE9"/></svg>';
  const STAR_SVG = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l6 13 14 1.6-10.4 9.6 3 14L24 34 11.4 42.2l3-14L4 18.6 18 17z" fill="#C98A5B"/></svg>';
  const X_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>';
  /* 동화 타일 그림 (구멍 속 사각 그림). 그림이 없으면 빈 구멍 */
  function miniTile(id) {
    const src = TILE.has(id) ? `${id}_tile` : PIC2L.has(id) ? `${id}_light` : (PIC2.has(id) || PIC.has(id)) ? id : '';
    return `<span class="mini">${src ? `<img src="assets/thumbs/${src}.webp" alt="" draggable="false">` : ''}</span>`;
  }
  let flowCtx = { step: '', id: null, sel: null };
  let pickKind = 'star';
  function openFlow(step, o = {}) {
    Object.assign(flowCtx, o, { step });
    renderFlow();
    if (flowEl.hidden) showModal(flowEl, flowSheet, { focus: '.f-first' });
    else { const f = flowSheet.querySelector('.f-first'); if (f) f.focus({ preventScroll: true }); }
  }
  function closeFlow() { hideModal(flowEl, flowSheet, sheetClosed); }
  /* S4: 아이용. 자물쇠 그림 + 읽어 주기. 가격·결제 글은 없다 */
  function openLock(id) {
    if (!isApp) return;
    openFlow('lock', { id, sel: null });
    say(L('이 동화는 잠겨 있어요. 어른과 함께 열어요.', 'This tale is locked. Open it together with a grown-up.'));
  }
  function renderFlow() {
    const { step, id } = flowCtx;
    flowSheet.className = 'sheet flow-' + step;
    const t = id && TALES.some(x => x.id === id) ? title(id) : '';
    const stars = Entitlements.starBalance(), need = Entitlements.STAR_NEED;
    if (step === 'lock') {
      const canStar = stars >= need && Entitlements.lockedChoices().length > 0;
      /* 그림 창은 가리지 않고, 자물쇠는 창의 오른쪽 아래 모서리에 걸친다. 색이 있는 단추는 종이별 원(구리)뿐 (§4-4) */
      flowSheet.innerHTML = `<div class="note">
        <div class="note-pic">${miniTile(id)}<span class="note-lock" aria-hidden="true">${UIA.has('badge_lock') ? uiImg('badge_lock') : LOCK_SVG}</span></div>
        <h2 class="note-t">${t}</h2>
        <p class="note-sub">${L('잠겨 있어요', 'Locked')}</p>
        <div class="note-btns">
          <button type="button" class="round f-first" data-act="f-close" aria-label="${L('닫기', 'Close')}">${UIA.has('ic_close') ? uiImg('ic_close') : X_SVG}</button>
          ${canStar ? `<button type="button" class="round star" data-act="f-star" aria-label="${L('종이별로 열기', 'Open with Paper Stars')}">${UIA.has('star_one') ? uiImg('star_one') : STAR_SVG}</button>` : ''}
        </div>
        <button type="button" class="adult holdbtn" data-adult><span>${L('어른이 열기', 'Grown-ups open')}</span><small>${L('1초 꾹', 'hold 1 s')}</small></button>
        <p class="how">${L('이번 주 무료 동화는 월요일마다 바뀌어요.', 'The free tales change every Monday.')}</p>
      </div>`;
      const ad = flowSheet.querySelector('[data-adult]');
      holdable(ad, 1000, () => parentCheck('buy', () => openFlow('buy')), () => toast(L('1초 동안 꾹 누르세요', 'Press and hold for 1 second')));
    } else if (step === 'buy') {
      const wait = Entitlements.waitAvailable(), left = Entitlements.waitDaysLeft(), canStar = stars >= need && Entitlements.lockedChoices().length > 0;
      const names = Entitlements.freeThisWeek().map(title).join(', ');
      flowSheet.innerHTML = `<h2>${L('동화 열기', 'Open a tale')}</h2>
        ${t ? `<div class="buy-head">${miniTile(id)}<p class="how">${L(`'${t}'은(는) 잠겨 있어요.`, `"${t}" is locked.`)}</p></div>` : ''}
        <div class="buy-cols">
          <section class="col"><h3>${L('이번 주 기다리기', 'Wait for this week')}</h3><p class="how">${L(`매주 월요일에 무료 동화가 바뀌어요. 이번 주: ${names}`, `The free tales change every Monday. This week: ${names}`)}</p><button type="button" class="ticket alt" data-act="f-close">${L('기다릴게요', 'I will wait')}</button></section>
          <section class="col"><h3>${L('기다무·종이별', 'Waiting pass / Stars')}</h3><p class="how">${wait ? L('기다무로 한 편을 열 수 있어요.', 'You can open one with a waiting pass.') : left ? L(`기다무는 ${left}일 뒤에 열려요.`, `A waiting pass opens in ${left} days.`) : L('기다무를 모두 썼어요.', 'All waiting passes are used.')} ${L(`종이별 ${Math.min(stars, 99)}/${need}`, `Paper Stars ${Math.min(stars, 99)}/${need}`)}</p>
            ${wait ? `<button type="button" class="ticket alt" data-act="f-wait">${L('기다무로 열기', 'Open with waiting pass')}</button>` : ''}
            ${canStar ? `<button type="button" class="ticket alt" data-act="f-star">${L('종이별로 열기', 'Open with Paper Stars')}</button>` : ''}
            ${!wait && !canStar ? `<button type="button" class="ticket alt" disabled>${L('아직 열 수 없어요', 'Not yet')}</button>` : ''}</section>
          <section class="col"><h3>${L('모든 동화 열기', 'Unlock all tales')}</h3><p class="how">${L(`${Entitlements.PRICE}를 한 번만 내면 모든 동화가 열려요. 새로 나오는 동화도 함께요.`, `Pay ${Entitlements.PRICE} once to unlock every tale, including new ones.`)}</p><button type="button" class="ticket alt" data-act="f-buy">${L(`모두 열기 ${Entitlements.PRICE}`, `Unlock all ${Entitlements.PRICE}`)}</button></section>
        </div>
        <p class="how buy-msg" id="flowMsg" hidden></p>
        <div class="sheet-btns"><button type="button" class="ticket txt" data-act="f-restore">${L('구매 복원', 'Restore purchase')}</button><button type="button" class="ticket alt f-first" data-act="f-close">${L('다음에', 'Not now')}</button></div>`;
    } else if (step === 'pick') {
      const star = pickKind === 'star', list = Entitlements.lockedChoices();
      flowSheet.innerHTML = `<h2>${star ? L('종이별로 동화 열기', 'Open a tale with Paper Stars') : L('기다무로 동화 열기', 'Open a tale with a waiting pass')}</h2>
        ${star ? `<div class="plate" aria-label="${L(`종이별 ${Math.min(stars, need)}개`, `${Math.min(stars, need)} Paper Stars`)}">${[...Array(need)].map((_, i) => `<i class="${i < stars ? 'on' : ''}"></i>`).join('')}</div>` : ''}
        <p class="how">${list.length ? L('열고 싶은 동화를 하나 골라요. 같은 동화를 한 번 더 톡 하면 열려요.', 'Pick one tale. Tap it again to open.') : L('지금 열 수 있는 잠긴 동화가 없어요.', 'No locked tales to open right now.')}</p>
        <div class="pick-list">${list.map(i => `<button type="button" class="pick${i === flowCtx.sel ? ' on' : ''}" data-id="${i}" aria-pressed="${i === flowCtx.sel}">${miniTile(i)}<span>${title(i)}</span></button>`).join('')}</div>
        <p class="how buy-msg" id="flowMsg" hidden></p>
        <div class="sheet-btns"><button type="button" class="ticket alt f-first" data-act="f-close">${L('닫기', 'Close')}</button>${list.length ? `<button type="button" class="ticket" data-act="f-open"${flowCtx.sel ? '' : ' disabled'}>${L('열기', 'Open')}</button>` : ''}</div>`;
    }
  }
  function unlockSel() {
    const id = flowCtx.sel; if (!id) return;
    const ok = pickKind === 'star' ? Entitlements.starUnlock(id) : Entitlements.waitUnlock(id);
    if (!ok) {
      paper('down'); flowCtx.sel = null; renderFlow();
      const m = $('#flowMsg'); m.textContent = L('열지 못했어요. 다시 골라 주세요.', 'Could not open it. Please pick again.'); m.hidden = false;
      return;
    }
    paper('tap');
    closeFlow(); closeGuard(); paintTabBadge();
    heroId = id; try { localStorage.setItem(lastKey, id); } catch (e) { /* 무시 */ }
    setTab('tales', { silent: true }); render({ anim: false });
    say(L(`${title(id)} 이야기가 열렸어요!`, `${title(id)} is open!`));
  }
  flowSheet.addEventListener('click', e => {
    const pk = e.target.closest('.pick');
    if (pk) {
      paper('tap');
      if (flowCtx.sel === pk.dataset.id) { unlockSel(); return; }       // 같은 타일 다시 톡 = 열기
      flowCtx.sel = pk.dataset.id; renderFlow(); sayTitle(title(flowCtx.sel), flowCtx.sel);
      return;
    }
    const b = e.target.closest('[data-act]'); if (!b) return;
    const act = b.dataset.act;
    if (act === 'f-close') closeFlow();
    else if (act === 'f-star') { pickKind = 'star'; paper('tap'); openFlow('pick', { sel: null }); }          // 종이별 고르기는 어른 확인 없이 (판단 #4 가)
    else if (act === 'f-wait') { pickKind = 'wait'; paper('tap'); openFlow('pick', { sel: null }); }
    else if (act === 'f-buy') doPurchase($('#flowMsg'));
    else if (act === 'f-restore') doRestore($('#flowMsg'));
    else if (act === 'f-open') unlockSel();
  });
  flowEl.addEventListener('click', e => { if (e.target === flowEl) closeFlow(); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!gateEl.hidden) closeGate(); else if (!flowEl.hidden) closeFlow(); else if (!guardEl.hidden) closeGuard();
  });
  Entitlements.onChange(() => { if (!flowEl.hidden && flowCtx.step === 'pick') return; refreshGuard(); });
  addEventListener('online', refreshGuard); addEventListener('offline', refreshGuard);

  /* ── S2 잠자리 탭: 읽어 주기가 준비된 동화만(카탈로그 read: true — 대본·녹음 맵·readPlay 가 있는지는 tools/app/check_read_flags.mjs 가 확인).
     타일 톡 = 제목 읽기 + 살짝 들림, 같은 타일 다시 톡 = 그 동화의 읽어 주기 시작 화면(?read=1). 잠긴 동화는 S4. 영어 모드에서는 영어 읽기 녹음이 있는 동화가 먼저 ── */
  ROW_SVG.all = '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M22.4 11Q14 6 4 7.6V37Q14 35.4 22.4 40Z" fill="#C98A5B"/><path d="M25.6 11Q34 6 44 7.6V37Q34 35.4 25.6 40Z" fill="#DDD2C4"/></svg>';
  let nightSel = '';
  const nightList = () => {
    const l = TALES.filter(t => t.read && inScope(t) && isOpen(t));
    return lang === 'en' ? [...l.filter(t => t.readEn), ...l.filter(t => !t.readEn)] : l;
  };
  /* ── 잠자리 이어 듣기 카드 두 장 (docs/BEDTIME_PLAN.md §4-1): 랜덤 이어 듣기 + 우리 재생목록. 둘 다 bedtime.html 플레이어로 간다.
     설정은 로컬 localStorage paperTheater.bedtime = { count, playlist } (동기화 안 함). 타일 톡의 한 편 읽어 주기(?read=1)는 그대로 ── */
  const BT_KEY = 'paperTheater.bedtime', BT_MAX = 5, BT_COUNTS = [1, 2, 3, 5];
  const btGet = () => { try { const o = JSON.parse(localStorage.getItem(BT_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } };
  const btSet = o => { try { localStorage.setItem(BT_KEY, JSON.stringify({ ...btGet(), ...o })); } catch (e) { /* 기억 못 해도 이 화면은 바뀐다 */ } };
  const btOk = t => !!(t && t.read && t.ready && Entitlements.canPlay(t.id) && (lang !== 'en' || t.readEn));
  const btCount = () => BT_COUNTS.includes(btGet().count) ? btGet().count : 2;
  const btList = () => (Array.isArray(btGet().playlist) ? btGet().playlist : []).map(id => TALES.find(t => t.id === id)).filter(t => t && t.read && t.ready).slice(0, BT_MAX);
  const BT_NOTE = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M20 8v24.5a7 7 0 1 1-4-6.3V14l20-5v20.5a7 7 0 1 1-4-6.3V8Z" fill="currentColor"/></svg>';
  const BT_LIST = '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="11" width="36" height="5" rx="1" fill="currentColor"/><rect x="6" y="21.5" width="36" height="5" rx="1" fill="currentColor"/><rect x="6" y="32" width="24" height="5" rx="1" fill="currentColor"/></svg>';
  function btHTML() {
    const cand = TALES.filter(t => nightList().includes(t) && btOk(t)), cnt = btCount(), pl = btList().filter(btOk);
    const none = cand.length === 0;
    const randLabel = none ? L('영어 읽어 주기는 준비 중이에요', 'English read-aloud is getting ready')
      : lang === 'en' && cand.length === 1 ? L('아무 이야기나 이어 듣기', 'Listen to the English tale') : L('아무 이야기나 이어 듣기', 'Listen to random tales');
    const chips = BT_COUNTS.map(n => `<button type="button" class="b-chip${n === cnt ? ' on' : ''}" data-bt-count="${n}" aria-pressed="${n === cnt}" aria-label="${L(`${n}편 듣고 끄기`, `Stop after ${n}`)}">${n}</button>`).join('');
    const thumbs = pl.slice(0, 3).map(t => `<img class="b-th" src="assets/thumbs/${t.id}_tile.webp" alt="${shown(t).title}" draggable="false">`).join('') + (pl.length > 3 ? `<span class="b-more">+${pl.length - 3}</span>` : '');
    /* 남색 밤 종이 두 장 (§7-7). 카드 안 1차 행동은 감빛 원 하나(ic_play). 재생목록이 비면 속 빈 크림 테두리 원, 영어 후보 0 이면 꺼진 원 */
    const playIc = UIA.has('ic_play') ? uiImg('ic_play') : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>';
    return `<div class="b-cards">
      <section class="b-card b-rand" aria-label="${L('아무 이야기나 이어 듣기', 'Random bedtime tales')}">
        <span class="b-art" aria-hidden="true">${UIA.has('ic_listen') ? uiImg('ic_listen') : BT_NOTE}</span>
        <h3 class="b-t">${randLabel}</h3>
        <button type="button" class="b-play" data-bt="random"${none ? ' disabled' : ''} aria-label="${randLabel}">${playIc}</button>
        <div class="b-set" role="group" aria-label="${L(`${cnt}편 듣고 끄기`, `Stop after ${cnt}`)}"><span class="b-lb">${L(`${cnt}편 듣고 끄기`, `Stop after ${cnt}`)}</span><span class="b-chips">${chips}</span></div>
      </section>
      <section class="b-card b-pl" aria-label="${L('우리 재생목록', 'Our playlist')}">
        <span class="b-art" aria-hidden="true">${UIA.has('ic_playlist') ? uiImg('ic_playlist') : BT_LIST}</span>
        <h3 class="b-t">${L('우리 재생목록', 'Our playlist')}</h3>
        <div class="b-thumbs">${pl.length ? thumbs : `<span class="b-empty">${L('어른이 1초 꾹 눌러 만들어요', 'A grown-up can hold 1 second to make one')}</span>`}</div>
        <button type="button" class="b-play${pl.length ? '' : ' empty'}" data-bt="list"${pl.length ? '' : ' disabled'} aria-label="${L('재생목록 듣기', 'Play the playlist')}">${pl.length ? playIc : ''}</button>
        <button type="button" class="b-hold" data-bt-hold><span class="b-hold-t">${pl.length ? L('편집 1초 꾹', 'Edit · hold 1 s') : L('만들기 1초 꾹', 'Make · hold 1 s')}</span><i class="hold-ring" aria-hidden="true"></i></button>
      </section></div>`;
  }
  function btGo(mode) {
    paper('tap');
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (e) { /* 무시 */ }
    location.href = 'bedtime.html?mode=' + mode + '&auto=1';   // 누르면 바로 재생(2026-10-30 사용자 요청). 막히면 플레이어가 '듣기 시작' 단추를 보인다
  }
  /* 재생목록 편집 시트(보호자): 순서·추가·빼기, 최대 5편 */
  let btDraft = [];
  const SYM = k => `<svg aria-hidden="true"><use href="#i-${k}"/></svg>`;   // 벡터 기호 (index.html 스프라이트, §6-2)
  function btEditor() {
    let el = document.getElementById('plEdit');
    if (!el) {
      el = document.createElement('div'); el.id = 'plEdit'; el.className = 'pl-edit'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
      document.body.appendChild(el);
      el.addEventListener('click', e => {
        const b = e.target.closest('[data-pl]'); if (!b) return;
        const act = b.dataset.pl, i = Number(b.dataset.i), id = b.dataset.id;
        if (act === 'close') { hideModal(el); return; }
        if (act === 'save') { btSet({ playlist: btDraft.slice() }); hideModal(el); renderNight(); return; }
        paper('tap');
        if (act === 'up' && i > 0) [btDraft[i - 1], btDraft[i]] = [btDraft[i], btDraft[i - 1]];
        else if (act === 'down' && i < btDraft.length - 1) [btDraft[i + 1], btDraft[i]] = [btDraft[i], btDraft[i + 1]];
        else if (act === 'del') btDraft.splice(i, 1);
        else if (act === 'add') { const k = btDraft.indexOf(id); if (k >= 0) btDraft.splice(k, 1); else if (btDraft.length < BT_MAX) btDraft.push(id); }
        btPaintEditor();
      });
    }
    return el;
  }
  function btPaintEditor() {
    const el = btEditor(), byId = id => TALES.find(t => t.id === id);
    const rows = btDraft.map((id, i) => { const t = byId(id); return `<li class="pl-row"><span class="pl-n">${i + 1}</span><img class="pl-th" src="assets/thumbs/${id}_tile.webp" alt="" draggable="false"><span class="pl-tt">${shown(t).title}</span>
      <button type="button" class="pl-b" data-pl="up" data-i="${i}" aria-label="${L('위로', 'Up')}"${i === 0 ? ' disabled' : ''}>${SYM('up')}</button>
      <button type="button" class="pl-b" data-pl="down" data-i="${i}" aria-label="${L('아래로', 'Down')}"${i === btDraft.length - 1 ? ' disabled' : ''}>${SYM('down')}</button>
      <button type="button" class="pl-b" data-pl="del" data-i="${i}" aria-label="${L('빼기', 'Remove')}">${SYM('minus')}</button></li>`; }).join('');
    const tiles = nightList().map(t => {
      const locked = !btOk(t), on = btDraft.includes(t.id), full = !on && btDraft.length >= BT_MAX;
      return `<button type="button" class="pl-tile${on ? ' on' : ''}" data-pl="add" data-id="${t.id}"${locked || full ? ' disabled' : ''} aria-pressed="${on}"><img src="assets/thumbs/${t.id}_tile.webp" alt="" draggable="false"><span>${shown(t).title}</span>${on ? `<i class="pl-ck" aria-hidden="true">${SYM('check')}</i>` : ''}${locked ? `<i class="pl-lk">${L('잠김', 'Locked')}</i>` : ''}</button>`;
    }).join('');
    el.innerHTML = `<div class="pl-sheet"><header class="pl-h"><button type="button" class="pl-top" data-pl="close">${L('닫기', 'Close')}</button><h2>${L(`우리 재생목록 (최대 ${BT_MAX}편)`, `Our playlist (up to ${BT_MAX})`)}</h2><button type="button" class="pl-top pl-save" data-pl="save">${L('저장', 'Save')}</button></header>
      <ol class="pl-list">${rows || `<li class="pl-none">${L('아래에서 동화를 골라요', 'Pick tales below')}</li>`}</ol>
      <h3 class="pl-add">${SYM('plus')}${L('더하기', 'Add')}</h3><div class="pl-grid">${tiles}</div></div>`;
  }
  function btOpenEditor() {
    btDraft = btList().filter(t => TALES.some(x => x.id === t.id)).map(t => t.id);
    btPaintEditor(); showModal(btEditor());
  }
  /* 1초 꾹: 손을 떼면 취소. 링 대신 아래 막대가 차오른다(CSS .holding) */
  let btHoldT = 0;
  const btHoldEnd = () => { clearTimeout(btHoldT); document.querySelectorAll('.b-hold.holding').forEach(b => b.classList.remove('holding')); };
  document.addEventListener('pointerdown', e => {
    const h = e.target.closest && e.target.closest('[data-bt-hold]'); if (!h) return;
    h.classList.add('holding'); clearTimeout(btHoldT);
    btHoldT = setTimeout(() => { btHoldEnd(); paper('tap'); btOpenEditor(); }, 1000);
  });
  ['pointerup', 'pointercancel', 'pointerleave', 'dragstart'].forEach(ev => document.addEventListener(ev, btHoldEnd, true));
  function renderNight() {
    const body = $('#nightBody'); if (!body) return;
    const list = nightList(), recent = readList(recentReadKey).map(id => list.find(t => t.id === id)).filter(Boolean);
    $('#nightEmpty').hidden = list.length > 0;
    body.hidden = list.length === 0;
    const sec = (k, ko, en, items) => items.length ? `<section class="n-sec" data-row="${k}" aria-label="${L(ko, en)}"><h3 class="row-h"><span class="row-ic">${rowIcon(k)}</span><span class="row-t">${L(ko, en)}</span></h3>
      <div class="n-grid">${items.map(t => `<div class="slot" data-id="${t.id}">${cardHTML(t, { night: true })}</div>`).join('')}</div></section>` : '';
    body.innerHTML = btHTML() + sec('recent', '최근 들은', 'Recently heard', recent) + sec('all', '모든 이야기', 'All tales', list);
    paintNightSel();
  }
  const paintNightSel = () => document.querySelectorAll('#nightBody .card').forEach(c => c.classList.toggle('sel', c.dataset.id === nightSel));
  function activateNight(e, c) {
    e.preventDefault();
    const id = c.dataset.id, t = TALES.find(x => x.id === id);
    if (c.classList.contains('locked')) { paper('down'); peek(c); openLock(id); return; }
    if (nightSel !== id) {                                   // 첫 톡 = 제목 읽기 + 살짝 들림
      nightSel = id; paper('tap'); paintNightSel(); sayTitle(shown(t).title, id);
      if (motion()) c.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-8px) scale(1.03)' }, { transform: 'translateY(-4px) scale(1.015)' }], { duration: 300, easing: 'cubic-bezier(.3,1.5,.5,1)', fill: 'forwards' });
      return;
    }
    paper('tap');
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (err) { /* 무시 */ }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    openTale(c);
  }

  /* ── S3 스티커북 탭: 퍼즐판 5개(카탈로그의 origin·also 로 계산 — 새 동화가 공개되면 그 판에 조각이 저절로 는다).
     스티커 그림(assets/ui/sticker_<id>.webp)·판 그림(puzzle_<판>.webp)이 UI_ART 에 올라오기 전에는 동화의 사각 썸네일을 둥글게 오려 쓴다.
     조각 = 카탈로그의 모든 동화(아직 안 나온 동화 포함, 2026-10-27 사용자 결정). 빈 조각은 실루엣 새김만(자물쇠·가격·구매 문구 없음) ── */
  const isPrincess = t => (t.also || []).includes('princess');
  const BOARDS = [
    { k: 'princess', ko: '공주 퍼즐', en: 'Princess Puzzle', say: '공주 퍼즐을 다 모았어요!', has: isPrincess },
    { k: 'korean', ko: '우리 옛이야기', en: 'Korean Tales', say: '우리 옛이야기를 다 모았어요!', has: t => t.origin === 'korean' && !isPrincess(t) },
    { k: 'aesop', ko: '이솝 동물 친구', en: 'Aesop Animals', say: '이솝 동물 친구를 다 모았어요!', has: t => t.origin === 'aesop' && !isPrincess(t) },
    { k: 'world', ko: '세계 명작', en: 'World Classics', say: '세계 명작을 다 모았어요!', has: t => t.origin === 'world' && !isPrincess(t) },
    { k: 'original', ko: '창작 동화', en: 'Original Tales', say: '창작 동화를 다 모았어요!', has: t => t.origin === 'original' && !isPrincess(t) }
  ];
  const BOARD_KEY = 'paperTheater.board';
  const doneRec = () => { try { const o = JSON.parse(localStorage.getItem(PZ_DONE_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } };
  /* 판 = 이어진 판 그림 한 장을 빈틈없이 나눈 조각 퍼즐. 동화 칸마다 조각 묶음 2개(아래 = 처음 완주, 위 = 두 번째 완주), 묶음 = 물건 모양 조각 + 둘레 조각. 순서·조각 그림은 assets/ui/puzzle_layout.json
     (tools/app/gen/post_puzzle.py 가 만든다). 목록에 없는 새 동화는 카탈로그 순서로 맨 뒤에 붙고, 그림이 없는 조각은 동화 썸네일을 같은 모양으로 오려 쓴다 */
  const PZ_DONE_KEY = 'paperTheater.puzzleDone2';
  let PZ = null;
  try { fetch('assets/ui/puzzle_layout.json?v=20261030bj1').then(r => r.ok ? r.json() : null).then(j => { if (j && j.boards) { PZ = j; if (curTab === 'stickers') drawStickers(); } }).catch(() => { /* 없으면 썸네일 조각 */ }); } catch (e) { /* 무시 */ }
  const pieces = b => {
    const all = TALES.filter(b.has), ord = (PZ && PZ.boards[b.k] && PZ.boards[b.k].tales) || [];
    return [...ord.map(id => all.find(t => t.id === id)).filter(Boolean), ...all.filter(t => !ord.includes(t.id))];
  };
  /* 조각 모양: tools/app/gen/post_puzzle.py 가 판 그림을 물건 모양 조각(구름·강아지·자동차 …)과 모양 없는 조각으로 빈틈없이 나눈다. 조각마다 상자(x,y,w,h: 판 좌표 px, 칸 512)와 SVG 경로.
     layout 에 없는 새 동화는 칸 반쪽 네모 조각(썸네일)으로 보이고, post_puzzle.py 를 다시 돌리면 조각 퍼즐이 된다 */
  const PZ_S = 512;
  const pzBox = (id, col, row) => {                                                 // 그 동화 칸의 위(row 0)·아래(row 1) 조각 묶음
    const e = PZ && PZ.boards[curBoard] && PZ.boards[curBoard].pieces[id], q = e && e[row ? 'bot' : 'top'];
    if (Array.isArray(q) && q.length) return q;
    const h = PZ_S;                                                                 // layout 에 없는 새 동화: 칸을 위·아래 반씩 네모 조각 하나로
    return [{ file: null, x: col * PZ_S, y: row ? h : 0, w: PZ_S, h, path: `M0 0H${PZ_S}V${h}H0Z` }];
  };
  const PZ_INSET = '<svg class="pz-defs" width="0" height="0" aria-hidden="true"><defs><filter id="pzInset" x="-5%" y="-5%" width="110%" height="110%"><feOffset in="SourceAlpha" dx="2" dy="6" result="o"/><feGaussianBlur in="o" stdDeviation="6" result="b"/><feComposite in="SourceAlpha" in2="b" operator="out" result="inv"/><feFlood flood-color="#2E241C" flood-opacity=".3"/><feComposite in2="inv" operator="in"/><feComposite in2="SourceGraphic" operator="over"/></filter></defs></svg>';
  const stickerSrc = id => UIA.has('sticker_' + id) ? `assets/ui/sticker_${id}.webp` : tileSrc(id);
  const has = id => { try { return Entitlements.hasSticker(id); } catch (e) { return false; } };
  const has2 = id => { try { return Entitlements.hasSticker2(id); } catch (e) { return false; } };
  const pzGot = t => (has(t.id) ? 1 : 0) + (has2(t.id) ? 1 : 0);
  const starSvg = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l6 13 14 1.6-10.4 9.6 3 14L24 34 11.4 42.2l3-14L4 18.6 18 17z"/></svg>';
  let curBoard = '', pendingCel = [], celebrating = false, castView = '', stMode = 'puzzle';
  const MODE_KEY = 'paperTheater.stkMode';     // 스티커북 탭 안의 갈래: 'puzzle'(퍼즐판) | 'cast'(동화별 친구 스티커북)
  try { curBoard = localStorage.getItem(BOARD_KEY) || ''; stMode = localStorage.getItem(MODE_KEY) === 'cast' ? 'cast' : 'puzzle'; } catch (e) { /* 기억 없음 */ }
  const stickImg = (id, off) => { const s = stickerSrc(id); return s ? `<img src="${s}" alt="" draggable="false" decoding="async"${off ? ' class="sil"' : ''}>` : ''; };
  /* 캐릭터 스티커 세트(tales/stickers.js): 그림이 있는 칸만 받을 수 있다. 그림 없는 칸(새로 그릴 자리)은 맨 뒤에 흐린 빈 구멍(글자 없음) */
  const castSet = id => { try { const a = typeof STICKERS !== 'undefined' && STICKERS[id]; return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const hasCast = (id, k) => { try { return Entitlements.hasCast(id, k); } catch (e) { return false; } };
  const castGot = id => castSet(id).filter(c => c.img && hasCast(id, c.k));      // 받은 친구 스티커(받은 순서)
  const CAST_DONE_KEY = 'paperTheater.castDone';
  const castDone = () => { try { const o = JSON.parse(localStorage.getItem(CAST_DONE_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } };
  /* 퍼즐 칸 위의 작은 진행 점: 10칸 중 받은 만큼 채운다 */
  const castDots = id => { const set = castSet(id); if (!set.length) return ''; return `<span class="cast-dots" aria-hidden="true">${set.map(c => `<i class="${hasCast(id, c.k) ? 'on' : c.img ? '' : 'plan'}"></i>`).join('')}</span>`; };
  /* 스티커 갈래 첫 화면: 친구 스티커를 받은 동화마다 둥근 표지 + 받은 수. 누르면 그 동화의 10칸 스티커북(drawCast) */
  function drawCastList(tales) {
    const n = tales.reduce((m, t) => m + castGot(t.id).length, 0);
    const cell = t0 => { const t = shown(t0), g = castGot(t0.id), src = tileSrc(t0.id) || g[g.length - 1].img;
      return `<button type="button" class="cs ct" data-tale="${t0.id}" aria-label="${t.title} ${g.length} / ${castSet(t0.id).length}"><img src="${src}" alt="" draggable="false" decoding="async"><b>${g.length}</b></button>`; };
    const body = tales.length ? `<div class="cast-grid list"><i class="pz-glow" aria-hidden="true"></i>${tales.map(cell).join('')}</div>`
      : `<p class="cast-none">${L('동화를 끝까지 보면 친구 스티커가 생겨요', 'Finish a tale to get a friend sticker')}</p>`;
    $('#pzBoard').innerHTML = `<div class="pz-win">${body}</div><div class="pz-head"><h2>${L('친구 스티커', 'Friend Stickers')}</h2><span class="pz-n">${n}</span></div>`;
  }
  function drawCast() {
    const t0 = TALES.find(x => x.id === castView), set = castSet(castView);
    if (!t0 || !set.length) { castView = ''; return false; }
    const t = shown(t0), ready = set.filter(c => c.img), plan = set.filter(c => !c.img);
    const got = ready.filter(c => hasCast(castView, c.k)).length, whole = !plan.length && got === ready.length && ready.length > 0;
    const cell = c => {
      if (!c.img) return `<span class="cs plan" aria-hidden="true"></span>`;
      const g = hasCast(castView, c.k), nm = lang === 'en' ? c.en : c.ko;
      return g ? `<button type="button" class="cs" data-k="${c.k}" aria-label="${nm}"><img src="${c.img}" alt="" draggable="false" decoding="async"></button>`
        : `<span class="cs off" data-k="${c.k}" role="img" aria-label="${L('아직 비어 있어요', 'Still empty')}"><img class="sil" src="${c.img}" alt="" draggable="false" decoding="async"></span>`;
    };
    $('#pzBoard').innerHTML = `<div class="pz-head"><button type="button" class="cast-back" data-act="cast-back" aria-label="${L('뒤로', 'Back')}">${arrowIc('M30 8L14 24l16 16')}</button><h2>${t.title}</h2><span class="pz-n">${got} / ${set.length}</span></div>
      <div class="pz-win"><div class="cast-grid${whole ? ' complete' : ''}"><i class="pz-glow" aria-hidden="true"></i>${[...ready, ...plan].map(cell).join('')}</div></div>`;
    if (whole) {                                    // 친구들을 다 모았으면 한 번 축하
      const rec = castDone();
      if (!rec[castView] && curTab === 'stickers' && !celebrating) {
        rec[castView] = true; try { localStorage.setItem(CAST_DONE_KEY, JSON.stringify(rec)); } catch (e) { /* 기록 못 해도 이번 화면에서는 보인다 */ }
        const id = castView;
        requestAnimationFrame(() => celebrateCast(id));
      }
    }
    return true;
  }
  function confetti() {
    const host = document.createElement('div'); host.className = 'confetti'; document.body.appendChild(host);
    const cols = ['#E8703A', '#D9A94E', '#A93B32', '#3F6B4F', '#8B7BB8', '#F6ECD8'];
    for (let i = 0; i < 36; i++) {
      const s = document.createElement('i'); s.className = 'bit b' + (i % 3); s.style.background = cols[i % cols.length]; host.appendChild(s);
      const x = Math.random() * innerWidth, r = (Math.random() - .5) * 720;
      s.animate([{ transform: `translate(${x}px, -20px) rotate(0)`, opacity: 1 }, { transform: `translate(${x + (Math.random() - .5) * 120}px, ${innerHeight + 30}px) rotate(${r}deg)`, opacity: 1 }], { duration: 1800 + Math.random() * 1400, delay: Math.random() * 600, easing: 'ease-in', fill: 'forwards' });
    }
    return host;
  }
  function celebrateCast(id) {
    const t0 = TALES.find(x => x.id === id), g = $('#pzBoard .cast-grid');
    if (!t0 || !g || castView !== id) return;
    celebrating = true;
    try { AudioFX.sfx('tada', .7); setTimeout(() => AudioFX.sfx('cheer', .5), 700); } catch (e) { /* 소리 없이 */ }
    const t = shown(t0);
    say(L(`${t.title} 친구들을 다 모았어요!`, `You collected all the friends of ${t.title}!`));
    if (!motion()) { celebrating = false; return; }
    g.querySelectorAll('.cs:not(.plan)').forEach((c, i) => c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.16) rotate(-5deg)', offset: .4 }, { transform: 'scale(1)' }], { duration: 700, delay: 150 + i * 110, easing: 'ease-in-out' }));
    const host = confetti();
    setTimeout(() => { host.remove(); celebrating = false; }, 3600);
  }
  /* 조각 묶음(판 좌표의 상자에 하나씩 놓는다): 받음 = 조각 그림(없으면 동화 썸네일을 같은 모양으로 오림) · 못 받음 = 눌린 빈 자리. 눌림 영역은 조각 모양 그대로(투명 경로).
     묶음의 첫 조각만 키보드·화면 읽기 대상이고 나머지는 같은 동작을 하는 눌림 영역이다 */
  const pzScroll = {};
  const arrowIc = d => UIA.has('ic_arrow') ? uiImg('ic_arrow') : `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  /* 조각 톡 반경 (§7-5): 받은 조각 묶음의 상자가 72px 보다 작으면 가운데에 72px 투명 톡 영역을 깐다(빈 조각 위·받은 조각 아래 층) */
  let pzCur = null;
  function pzHits() {
    const tr = $('#pzBoard .pz-track'), box = tr && tr.querySelector('.pz-hits'); if (!box || !pzCur) return;
    const cell = tr.offsetHeight / 2, list = pzCur.list; if (!cell) return;
    box.innerHTML = list.flatMap((t, i) => [0, 1].map(row => {
      if (!(row ? has(t.id) : has2(t.id))) return '';
      const qs = pzBox(t.id, i, row), x0 = Math.min(...qs.map(q => q.x)), y0 = Math.min(...qs.map(q => q.y)), x1 = Math.max(...qs.map(q => q.x + q.w)), y1 = Math.max(...qs.map(q => q.y + q.h));
      const f = cell / PZ_S, w = (x1 - x0) * f, h = (y1 - y0) * f;
      if (Math.min(w, h) >= 72) return '';
      const W = Math.max(72, w), H = Math.max(72, h), l = Math.max(0, Math.min(tr.offsetWidth - W, (x0 + x1) / 2 * f - W / 2)), tp = Math.max(0, Math.min(tr.offsetHeight - H, (y0 + y1) / 2 * f - H / 2));
      return `<span class="pz-s pz-hit" data-id="${t.id}" data-part="${row ? 'bot' : 'top'}" style="left:${l.toFixed(1)}px;top:${tp.toFixed(1)}px;width:${W.toFixed(1)}px;height:${H.toFixed(1)}px"></span>`;
    })).join('');
  }
  addEventListener('resize', () => { if (curTab === 'stickers') pzHits(); });
  /* 화살표: 판 끝에 닿으면 그쪽 원은 꺼진 모양(§7-9 비활성) */
  function pzArrows() {
    const pan = $('#pzBoard .pz-pan'); if (!pan) return;
    const l = $('#pzBoard [data-act="pan-l"]'), r = $('#pzBoard [data-act="pan-r"]');
    if (l) l.disabled = pan.scrollLeft <= 2;
    if (r) r.disabled = pan.scrollLeft >= pan.scrollWidth - pan.clientWidth - 2;
  }
  /* 처음 보는 조각(끝 화면에서 받아 온 것): 홈 스티커북 탭에 구리 점, 스티커북을 열면 한 번 들썩. 기록이 없으면 지금 있는 것을 본 것으로 */
  const PZ_SEEN_KEY = 'paperTheater.pzSeen';
  const gotKeys = () => TALES.flatMap(t => [has(t.id) ? t.id + '-bot' : '', has2(t.id) ? t.id + '-top' : '']).filter(Boolean);
  const pzSeenSave = () => { try { localStorage.setItem(PZ_SEEN_KEY, JSON.stringify(gotKeys())); } catch (e) { /* 기억 못 하면 점이 남지 않는다 */ } };
  function pzNew() {
    let seen = null;
    try { seen = JSON.parse(localStorage.getItem(PZ_SEEN_KEY)); } catch (e) { seen = null; }
    if (!Array.isArray(seen)) { pzSeenSave(); return []; }
    return gotKeys().filter(k => !seen.includes(k));
  }
  function pieceHTML(list, i, row) {
    const t0 = list[i], t = shown(t0), got = row ? has(t0.id) : has2(t0.id);
    return pzBox(t0.id, i, row).map((q, k) => {
      const id = `${t0.id}-${row}-${k}`;
      const sty = `left:calc(var(--cell)*${q.x / PZ_S});top:calc(var(--cell)*${q.y / PZ_S});width:calc(var(--cell)*${q.w / PZ_S});height:calc(var(--cell)*${q.h / PZ_S})`;
      let art;
      if (!got) art = `<svg class="pz-art" viewBox="0 0 ${q.w} ${q.h}" aria-hidden="true"><path d="${q.path}" fill="#E9DFD2" filter="url(#pzInset)"/></svg>`;
      else if (q.file) art = `<img class="pz-art" src="assets/ui/${q.file}?v=20261030bj1" alt="" draggable="false" decoding="async">`;
      else {
        const im = [i - 1, i, i + 1].filter(c => c >= 0 && c < list.length).map(c => { const src = tileSrc(list[c].id); return src ? `<image href="${src}" x="${c * PZ_S - q.x}" y="${-q.y}" width="${PZ_S}" height="${PZ_S * 2}" preserveAspectRatio="xMidYMid slice"/>` : ''; }).join('');
        art = `<svg class="pz-art" viewBox="0 0 ${q.w} ${q.h}" aria-hidden="true"><defs><clipPath id="pzc-${id}"><path d="${q.path}"/></clipPath></defs><rect width="${q.w}" height="${q.h}" fill="#E9DFD3" clip-path="url(#pzc-${id})"/><g clip-path="url(#pzc-${id})">${im}</g></svg>`;
      }
      const hit = `<svg class="pz-s${got ? '' : ' off'}" viewBox="0 0 ${q.w} ${q.h}" data-id="${t0.id}" data-part="${row ? 'bot' : 'top'}"${k ? ' tabindex="-1" aria-hidden="true"' : ` tabindex="0" role="${got ? 'button' : 'img'}" aria-label="${got ? t.title : L('아직 비어 있어요', 'Still empty')}"`}><path d="${q.path}" fill="transparent" pointer-events="all"/></svg>`;
      return `<div class="pzp${got ? ' got' : ''}${q.obj ? ' obj' : ''}" data-k="${t0.id}-${row ? 'bot' : 'top'}" style="${sty}">${art}${hit}</div>`;
    }).join('');
  }
  /* 스티커북 탭 맨 위 갈래 단추: 퍼즐 | 스티커 */
  function paintSeg() {
    $('#stkSeg').querySelectorAll('button').forEach(b => { const on = b.dataset.mode === stMode; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); b.textContent = b.dataset.mode === 'cast' ? L('스티커', 'Stickers') : L('퍼즐', 'Puzzle'); });
    $('#view-stickers').classList.toggle('cast-on', stMode === 'cast');
  }
  $('#stkSeg').addEventListener('click', e => {
    const b = e.target.closest('button[data-mode]'); if (!b || b.dataset.mode === stMode) return;
    stMode = b.dataset.mode; castView = ''; paper('tap');
    try { localStorage.setItem(MODE_KEY, stMode); } catch (err) { /* 무시 */ }
    drawStickers(); say(stMode === 'cast' ? L('스티커', 'Stickers') : L('퍼즐', 'Puzzle'));
  });
  function drawStickers() {
    const root = $('#pzRow'); if (!root) return;
    const rec = doneRec(), bs = BOARDS.map(b => ({ b, list: pieces(b) })).filter(x => x.list.length);
    const cnt = list => list.reduce((n, t) => n + pzGot(t), 0);
    /* 판을 다 채웠으면 기록(한 번 기록하면 새 조각이 생겨도 '완성' 표시는 남는다) */
    let changed = false;
    bs.forEach(({ b, list }) => { if (!rec[b.k] && cnt(list) === list.length * 2) { rec[b.k] = true; changed = true; pendingCel.push(b.k); } });
    if (changed) try { localStorage.setItem(PZ_DONE_KEY, JSON.stringify(rec)); } catch (e) { /* 기록 못 해도 이번 화면에서는 보인다 */ }
    $('#pzEmpty').hidden = bs.length > 0;
    $('#pzMain').hidden = bs.length === 0;
    root.hidden = bs.length === 0;
    if (!bs.length) return;
    const seeing = curTab === 'stickers', fresh = seeing ? pzNew() : [];
    if (curTab === 'stickers' && pendingCel.length) { curBoard = pendingCel[0]; }
    else if (fresh.length) { const fb = bs.find(x => x.list.some(t => fresh.some(f => f.startsWith(t.id + '-')))); if (fb) { curBoard = fb.b.k; castView = ''; } }
    if ((curTab === 'stickers' && pendingCel.length) || fresh.length) stMode = 'puzzle';     // 새 조각·판 완성은 퍼즐에서 보여 준다
    paintSeg();
    root.hidden = stMode === 'cast';
    if (!bs.some(x => x.b.k === curBoard)) { const withSt = bs.find(x => x.list.some(t => has(t.id))); curBoard = (withSt || bs[0]).b.k; }
    root.innerHTML = bs.map(({ b, list }) => {
      const gotN = cnt(list), all = list.length * 2, done = !!rec[b.k], on = b.k === curBoard, last = [...list].reverse().find(t => has(t.id));
      const art = UIA.has('puzzle_' + b.k) ? uiImg('puzzle_' + b.k, 'pz-art') : stickImg((last || list[0]).id);
      return `<button type="button" class="pz-b${on ? ' on' : ''}${done ? ' done' : ''}" role="tab" data-b="${b.k}" aria-selected="${on}" aria-label="${L(b.ko, b.en)} ${gotN}/${all}${done ? ', ' + L('완성', 'complete') : ''}">
        <span class="pz-hole${art ? '' : ' empty'}">${art}${done ? `<i class="pz-done">${starSvg}</i>` : ''}</span>
        <span class="pz-cnt">${gotN} / ${all}</span><span class="pz-nm">${L(b.ko, b.en)}</span></button>`;
    }).join('');
    if (stMode === 'cast') {
      const castTales = TALES.filter(t => castGot(t.id).length);
      if (pendingCel.length && curTab === 'stickers') castView = '';
      if (!(castView && drawCast())) drawCastList(castTales);
      drawPlate(); if (seeing) { pzSeenSave(); paintTabBadge(); }
      if (curTab === 'stickers' && pendingCel.length && !celebrating) { const k2 = pendingCel.shift(); requestAnimationFrame(() => celebrate(k2)); }
      return;
    }
    castView = '';
    const cur = bs.find(x => x.b.k === curBoard), list = cur.list, gotN = cnt(list), all = list.length * 2, complete = gotN === all;
    const arrow = (act, d) => `<button type="button" class="pz-arr" data-act="${act}" aria-label="${act === 'pan-l' ? L('왼쪽으로', 'Left') : L('오른쪽으로', 'Right')}">${arrowIc(d)}</button>`;
    /* 빈 조각을 먼저, 받은 조각을 나중에 그린다. 그 사이 층(.pz-hits)에 작은 받은 조각의 넓힌 톡 영역(72)을 둔다 → 빈 조각보다 위, 받은 조각보다 아래 */
    const parts = list.flatMap((t, i) => [[i, 0, has2(t.id)], [i, 1, has(t.id)]]);
    const html = want => parts.filter(p => p[2] === want).map(p => pieceHTML(list, p[0], p[1])).join('');
    $('#pzBoard').innerHTML = PZ_INSET + `<div class="pz-win"><div class="pz-pan${complete ? ' complete' : ''}" style="--n:${list.length}"><div class="pz-track"><i class="pz-glow" aria-hidden="true"></i>${html(false)}<div class="pz-hits" aria-hidden="true"></div>${html(true)}</div></div></div>
      <div class="pz-head"><h2>${L(cur.b.ko, cur.b.en)}</h2><span class="pz-n">${gotN} / ${all}</span>${rec[cur.b.k] ? `<i class="pz-done">${starSvg}</i>` : ''}<span class="pz-arrs">${arrow('pan-l', 'M30 8L14 24l16 16')}${arrow('pan-r', 'M18 8l16 16-16 16')}</span></div>`;
    const pan = $('#pzBoard .pz-pan'), k = cur.b.k;
    pan.addEventListener('scroll', () => { pzScroll[k] = pan.scrollLeft; pzArrows(); }, { passive: true });
    const firstOpen = Math.max(0, list.findIndex(t => pzGot(t) < 2));
    const freshAt = fresh.length ? list.findIndex(t => fresh.some(f => f.startsWith(t.id + '-'))) : -1;
    if (freshAt >= 0) pzScroll[k] = null;
    const at = freshAt >= 0 ? freshAt : firstOpen;
    pan.scrollLeft = pzScroll[k] != null ? pzScroll[k] : (complete || at < 1 ? 0 : pan.scrollWidth / list.length * (at - .15));
    pzCur = { list }; pzHits(); pzArrows();
    /* 보상 받기 연결 (§5-7 ④): 처음 보는 조각은 자리에서 한 번 들썩(108% → 100%, 240ms), 본 것으로 적고 탭의 구리 점을 끈다 */
    if (seeing) {
      if (motion()) fresh.forEach(f => $('#pzBoard').querySelectorAll(`.pzp[data-k="${f}"]`).forEach(p => p.animate([{ transform: 'scale(1.08)' }, { transform: 'none' }], { duration: 240, delay: 260, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' })));
      pzSeenSave(); paintTabBadge();
    }
    drawPlate();
    if (curTab === 'stickers' && pendingCel.length && !celebrating) { const k2 = pendingCel.shift(); requestAnimationFrame(() => celebrate(k2)); }
  }
  /* 종이별 접시(앱 모드만): 별 0~5개, 5개면 [동화 하나 열기] → S12 종이별 모드 */
  function drawPlate() {
    const el = $('#pzPlate'); if (!el) return;
    el.hidden = !storeMode;
    if (!storeMode) return;
    const bal = Entitlements.starBalance(), need = Entitlements.STAR_NEED, n = Math.min(bal, need);
    const canOpen = bal >= need && Entitlements.lockedChoices().length > 0;
    el.className = 'pz-plate' + (bal >= need ? ' full' : '');
    el.setAttribute('aria-label', L(`종이별 ${n} / ${need}`, `Paper Stars ${n} / ${need}`));
    const star = UIA.has('star_one') ? uiImg('star_one') : starSvg;
    el.innerHTML = `<div class="plate-art">${UIA.has('star_plate') ? uiImg('star_plate', 'plate-img') : ''}<div class="plate-dots">${[...Array(need)].map((_, i) => `<i class="${i < n ? 'on' : ''}">${i < n ? star : ''}</i>`).join('')}</div></div>
      <p class="plate-n">${n} / ${need}</p>
      ${canOpen ? `<button type="button" class="pz-open" data-act="pz-open" aria-label="${L('종이별로 동화 하나 열기', 'Open a tale with Paper Stars')}">${star}</button>` : ''}`;
  }
  /* 판 완성 연출 한 번: 종이 뒤에서 빛이 번지고, 스티커들이 차례로 뒤집히고, 색종이가 흩날린다 + 음성 */
  function celebrate(k) {
    const b = BOARDS.find(x => x.k === k), g = $('#pzBoard .pz-track');
    if (!b || !g || curBoard !== k) return;
    celebrating = true;
    try { AudioFX.sfx('tada', .7); setTimeout(() => AudioFX.sfx('cheer', .5), 700); } catch (e) { /* 소리 없이 */ }   // 팡파르(Kenney CC0) 뒤 박수(Pixabay)
    say(L(b.say, `You finished the ${b.en}!`));
    if (!motion()) { celebrating = false; return; }
    const glow = g.querySelector('.pz-glow');
    glow.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: .95, transform: 'scale(1)', offset: .35 }, { opacity: 0, transform: 'scale(1.25)' }], { duration: 1800, easing: 'ease-out' });
    g.querySelectorAll('.pzp').forEach((s, i) => s.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-10px) scale(1.04)', offset: .45 }, { transform: 'translateY(0) scale(1)' }], { duration: 900, delay: 200 + Math.floor(i / 2) * 140, easing: 'ease-in-out' }));
    const host = confetti();
    setTimeout(() => { host.remove(); celebrating = false; if (pendingCel.length && curTab === 'stickers') drawStickers(); }, 3600);
  }
  $('#pzRow').addEventListener('click', e => {
    const b = e.target.closest('.pz-b'); if (!b) return;
    curBoard = b.dataset.b; castView = ''; paper('tap');
    try { localStorage.setItem(BOARD_KEY, curBoard); } catch (err) { /* 무시 */ }
    drawStickers();
    const bd = BOARDS.find(x => x.k === curBoard); if (bd) say(L(bd.ko, bd.en));
  });
  $('#pzBoard').addEventListener('click', e => {
    if (e.target.closest('[data-act="cast-back"]')) { paper('tap'); castView = ''; drawStickers(); say(L('스티커', 'Stickers')); return; }
    const ct = e.target.closest('.ct');
    if (ct) { const t = TALES.find(x => x.id === ct.dataset.tale); paper('tap'); castView = ct.dataset.tale; drawStickers(); if (t) say(shown(t).title); return; }
    const cs = e.target.closest('.cs');
    if (cs) {                                                  // 캐릭터 세트 칸: 받은 칸 = 이름 읽기 + 들썩, 빈 칸 = 안내
      if (cs.classList.contains('off')) { paper('down'); say(L('아직 비어 있어요', 'Still empty')); return; }
      const c = castSet(castView).find(x => x.k === cs.dataset.k); paper('tap'); if (c) say(L(c.ko, c.en));
      if (motion()) cs.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-9deg) scale(1.12)', offset: .25 }, { transform: 'rotate(7deg) scale(1.08)', offset: .55 }, { transform: 'rotate(-3deg) scale(1.03)', offset: .8 }, { transform: 'rotate(0) scale(1)' }], { duration: 650, easing: 'ease-out' });
      return;
    }
    const ar = e.target.closest('.pz-arr');
    if (ar) { if (ar.disabled) return; const pan = $('#pzBoard .pz-pan'); paper('tap'); if (pan) pan.scrollBy({ left: (ar.dataset.act === 'pan-l' ? -1 : 1) * pan.clientWidth * .7, behavior: motion() ? 'smooth' : 'auto' }); return; }
    const s = e.target.closest('.pz-s'); if (!s) return;
    if (s.classList.contains('off')) { paper('down'); say(L('아직 비어 있어요', 'Still empty')); return; }
    paper('tap');
    const t = TALES.find(x => x.id === s.dataset.id);
    if (t) say(shown(t).title);     // 제목 읽기 + 살짝 들림 (동화로 들어가지는 않는다)
    const pp = s.closest('.pzp') || $(`#pzBoard .pzp[data-k="${s.dataset.id}-${s.dataset.part}"]`);
    if (pp && motion()) pp.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-8px) scale(1.04)', offset: .35 }, { transform: 'translateY(0) scale(1)' }], { duration: 520, easing: 'ease-out' });
  });
  $('#pzBoard').addEventListener('keydown', e => { const s = e.target.closest && e.target.closest('.pz-s'); if (s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); s.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
  $('#pzPlate').addEventListener('click', e => {
    if (!e.target.closest('[data-act="pz-open"]')) return;
    paper('tap'); pickKind = 'star'; openFlow('pick', { id: null, sel: null });
  });
  $('#nightGo').addEventListener('click', () => { paper('tap'); setTab('tales'); });
  $('#nightBody').addEventListener('click', e => {
    const n = e.target.closest('[data-bt-count]');
    if (n) { paper('tap'); btSet({ count: Number(n.dataset.btCount) }); renderNight(); return; }
    const g = e.target.closest('[data-bt]');
    if (g && !g.disabled) { btGo(g.dataset.bt); return; }
    const c = e.target.closest('.card'); if (c) activateNight(e, c);
  });

  /* ── 탭 3개 (APP_SCREENS_PLAN §2): 동화 놀이 · 읽어 주기 · 스티커북(2026-10-28 사용자 결정 이름). 해시 #tales #night #stickers, 마지막 탭은 기억한다 ── */
  const TABS = {
    tales:    { ko: '동화 놀이', en: 'Tale Play',  say: '동화 놀이' },
    night:    { ko: '읽어 주기', en: 'Read to Me', say: '읽어 주기' },
    stickers: { ko: '스티커북', en: 'Sticker Book', say: '스티커북' }
  };
  const TAB_KEY = 'paperTheater.tab';
  let curTab = '';
  const tabBtns = [...document.querySelectorAll('#tabs .tab')];
  const tabFromHash = () => { const h = location.hash.replace('#', ''); return TABS[h] ? h : ''; };
  function paintTabs() {
    tabBtns.forEach(b => {
      const k = b.dataset.tab, on = k === curTab;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
      b.setAttribute('aria-label', L(TABS[k].ko, TABS[k].en));
      b.querySelector('.tab-lb').textContent = L(TABS[k].ko, TABS[k].en);
    });
    document.querySelectorAll('.view').forEach(v => { if (!v.dataset.leaving) v.hidden = v.dataset.view !== curTab; });
    $('#home').dataset.tab = curTab;
    $('#nTitle').textContent = L('잠자리 이야기', 'Bedtime stories');
    $('#nightEmptyT').textContent = L('읽어 주기는 준비 중이에요', 'Read-aloud is getting ready');
    $('#nightGo').textContent = L('동화 탭으로', 'Go to Tales');
    $('#pzEmptyT').textContent = L('동화를 끝까지 하면 스티커가 생겨요', 'Finish a tale to get a sticker');
    $('#emptyT').textContent = L('이 조합의 이야기는 아직 없어요', 'No tales match yet');
    $('#emptyReset').textContent = L('전체 보기', 'Show all');
    if (curTab === 'stickers') drawStickers();
  }
  /* 탭 내용 바꾸기 (§5-2): 이전 뷰는 140ms 에 24px 밀려 나가고 새 뷰는 반대쪽 24px 에서 220ms 로 들어온다(동시에 시작).
     방향은 탭 순서(동화 → 잠자리 → 스티커북이 오른쪽). 움직임 줄이기면 120ms 크로스페이드만 */
  const TAB_ORDER = Object.keys(TABS), EASE = 'cubic-bezier(.2,.8,.2,1)';
  let leaving = null;
  const viewOf = k => document.querySelector(`.view[data-view="${k}"]`);
  function leaveDone() {
    if (!leaving) return;
    const v = leaving; leaving = null;
    if (v._anim) { v._anim.cancel(); v._anim = null; }
    delete v.dataset.leaving;
    v.style.cssText = '';
    v.hidden = v.dataset.view !== curTab;
  }
  function swapViews(prev, k) {
    const ov = viewOf(prev), nv = viewOf(k);
    if (!ov || !nv || !ov.animate) return;
    const rm = RM.matches, mv = rm ? 0 : 24, dir = TAB_ORDER.indexOf(k) > TAB_ORDER.indexOf(prev) ? 1 : -1;
    Object.assign(ov.style, { position: 'absolute', left: ov._r.l + 'px', top: ov._r.t + 'px', width: ov._r.w + 'px', height: ov._r.h + 'px', margin: '0', pointerEvents: 'none', zIndex: '0' });
    leaving = ov;
    ov._anim = ov.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-mv * dir}px)` }], { duration: rm ? 120 : 140, easing: EASE, fill: 'forwards' });
    ov._anim.onfinish = leaveDone;
    nv.animate([{ opacity: 0, transform: `translateX(${mv * dir}px)` }, { opacity: 1, transform: 'none' }], { duration: rm ? 120 : 220, easing: EASE });
  }
  /* 새 탭의 구멍이 열리고(그림 72% → 100%, 감빛 고리) 이전 구멍은 닫힌다 — 움직임은 CSS(.tab.on). 한 번 톡으로 바로 바뀌고 이름을 한 번 읽어 준다 */
  function setTab(k, o = {}) {
    if (!TABS[k]) k = 'tales';
    const prev = curTab;
    if (k === prev && !o.force) return;
    leaveDone();
    const ov = !o.silent && prev && prev !== k && viewOf(prev);
    if (ov && !ov.hidden) { ov._r = { l: ov.offsetLeft, t: ov.offsetTop, w: ov.offsetWidth, h: ov.offsetHeight }; ov.dataset.leaving = '1'; }
    curTab = k;
    paintTabs();
    if (ov && ov.dataset.leaving) swapViews(prev, k);
    if (!o.silent) { try { localStorage.setItem(TAB_KEY, k); } catch (e) { /* 기억 못 해도 이 화면은 바뀐다 */ } }
    if (!o.silent && location.hash !== '#' + k) { try { history.replaceState(null, '', location.pathname + location.search + '#' + k); } catch (e) { /* 무시 */ } }
    if (o.silent) return;
    paper('tap');
    say(k === 'stickers' && Entitlements.stickerCount() === 0 ? L('스티커북. 동화를 끝까지 하면 스티커가 생겨요', 'Sticker Book. Finish a tale to get a sticker') : L(TABS[k].say, TABS[k].en));
  }
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) setTab(b.dataset.tab); });
  $('#tabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const i = tabBtns.findIndex(b => b.dataset.tab === curTab), d = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
    const nb = tabBtns[(i + d + tabBtns.length) % tabBtns.length];
    setTab(nb.dataset.tab); nb.focus();
  });
  addEventListener('hashchange', () => { const k = tabFromHash(); if (k) setTab(k); });
  /* 스티커북 탭 구멍 가장자리의 구리색 점: 종이별이 5개 모였을 때만 (앱 모드) */
  function paintTabBadge() {
    const on = (Entitlements.appMode() && Entitlements.starBalance() >= Entitlements.STAR_NEED) || (curTab !== 'stickers' && pzNew().length > 0);
    tabBtns.find(b => b.dataset.tab === 'stickers').querySelector('.tab-badge').hidden = !on;
  }
  /* 탭 그림(assets/ui/tab_<탭>.webp, 목록은 assets/ui/ui.js)이 들어오면 임시 동그라미 대신 쓴다. 없는 파일은 요청하지 않는다 */
  tabBtns.forEach(b => {
    const key = 'tab_' + b.dataset.tab, hole = b.querySelector('.hole');
    if (!(window.UI_ART || []).includes(key)) return;
    hole.classList.add('art');
    hole.insertAdjacentHTML('afterbegin', `<img class="tab-art" src="assets/ui/${key}.webp${key === 'logo_mark' ? '?v=moon1' : ''}" alt="" aria-hidden="true" draggable="false">`);
  });
  /* 보호자 톱니·닫기도 생성 그림으로(2026-10-29 사용자 지시: SVG 그림 → 이미지) */
  if (UIA.has('ic_gear')) { const g = $('#parentBtn .gear-ic'); if (g) g.outerHTML = uiImg('ic_gear', 'gear-ic'); }
  if (UIA.has('ic_arrow')) { const b = $('#guardClose svg'); if (b) b.outerHTML = backIc(); }
  /* 빈 상태·잠자리 머리 그림(assets/ui/empty_shelf · empty_night · night_head .webp)도 UI_ART 에 올라오면 그림으로 */
  [['#empty .empty-pic', 'empty_shelf'], ['#nightEmpty .empty-pic', 'empty_night'], ['#pzEmpty .empty-pic', 'empty_stickers'], ['#nHole', 'night_head']].forEach(([sel, key]) => {
    const el = $(sel); if (el && UIA.has(key)) el.insertAdjacentHTML('afterbegin', uiImg(key));
  });
  paintTabBadge();
  Entitlements.onChange(() => { paintTabBadge(); requestRender(); });

  /* 첫 화면엔 늘 스플래시(로고 안으로 들어갔다 나오기, engine/splash) — 앱을 켤 때·웹 접속·새로고침마다. 동화에서 홈으로 돌아올 때만 나오지 않는다. ?splash=1 강제 재생, ?splash=0 끔 */
  function splash(done) {
    const sp = $('#splash');
    let finished = false, shown = false, pending;
    const reveal = () => { if (!shown) { shown = true; done(); } };   // 로고가 날아가는 동안 홈을 먼저 드러낸다
    const complete = () => {
      if (finished) return;
      finished = true;
      clearTimeout(pending);
      sp.removeEventListener('pointerdown', complete);
      sp.hidden = true;
      sp.setAttribute('aria-hidden', 'true');
      reveal();
    };
    // Branded static first paint while the optional 3D module loads.
    sp.hidden = false;
    sp.replaceChildren();
    const fallback = document.createElement('div');
    fallback.className = 'splash-fallback';
    const title = document.createElement('img');
    title.className = 'splash-wordmark';
    title.src = lang === 'en' ? 'assets/v3w/sp_logo_c2_en_b_light_v1.webp' : 'assets/v3w/sp_logo_c2_b_light_v1.webp';
    title.alt = lang === 'en' ? 'Toki Toki Tale' : '톡톡 동화극장';
    fallback.append(title); sp.append(fallback);
    sp.addEventListener('pointerdown', complete);
    pending = setTimeout(complete, 2500);   // 3D 장면을 못 받으면 정적 첫 화면만 보이다 넘어간다
    import('./engine/splash/start.js?v=20261030sp5')
      .then(({ startSplash }) => {
        if (finished) return;
        clearTimeout(pending);
        sp.removeEventListener('pointerdown', complete);
        startSplash(sp, { lang, onDone: complete, onReveal: reveal });
      })
      .catch(complete);
  }

  /* 앱 안의 다른 화면(동화·잠자리·스티커)에서 홈으로 돌아온 것인가: 링크로 왔거나 뒤로 가기. 새로 켜기·새로고침은 아니다 */
  function backFromApp() {
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav && nav.type === 'reload') return false;
      if (nav && nav.type === 'back_forward') return true;
      return !!document.referrer && new URL(document.referrer).origin === location.origin;
    } catch (e) { return false; }
  }

  function intro() {
    const q = new URLSearchParams(location.search).get('splash');
    let first = q === '0' ? false : !backFromApp();
    if (['1', '2'].includes(q)) first = true;
    update({ anim: false });
    if (first && location.hash !== '#parent') splash(() => update({ intro: true, delay: .04, step: .035 }));
    else update({ intro: true, delay: .02, step: .03 });
  }

  /* 처음 탭: 주소의 해시 → 마지막으로 본 탭 → 동화 */
  let startTab = tabFromHash();
  if (!startTab) try { const m = localStorage.getItem(TAB_KEY); if (TABS[m]) startTab = m; } catch (e) { /* 기억 없음 */ }
  setTab(startTab || 'tales', { silent: true, force: true });
  requestAnimationFrame(() => requestAnimationFrame(() => $('#tabs').classList.add('ready')));   // 첫 그림 뒤부터 탭 구멍이 움직인다

  /* ── 누름 반응 (§5-3): pointerdown 에서 .is-pressed, pointerup·cancel 에서 뗀다. 모양은 CSS 가 정한다 ── */
  const PRESS = '.tab, .card, .pz-b, .pick, .pl-tile, .round, .pz-arr, .cast-back, .pz-open, .b-go, .b-play, .b-chip, .hero-nav, .hero-play, .ticket, .pl-top, .pl-b, .g-item, .gate-opt';
  let pressed = null;
  const unpress = () => { if (pressed) { pressed.classList.remove('is-pressed'); pressed = null; } };
  document.addEventListener('pointerdown', e => {
    unpress();
    if (e.button) return;
    const el = e.target.closest && e.target.closest(PRESS);
    if (!el || el.disabled) return;
    pressed = el; el.classList.add('is-pressed');
  }, true);
  ['pointerup', 'pointercancel', 'dragstart'].forEach(ev => addEventListener(ev, unpress, true));
  addEventListener('blur', unpress);

  intro();
  /* 목소리: 기본은 ElevenLabs, ?voice=tc 면 Typecast로, ?voice=el 이면 다시 기본으로 */
  try { const v = new URLSearchParams(location.search).get('voice'); if (v === 'tc') localStorage.setItem('voice', 'tc'); else if (v === 'el') localStorage.removeItem('voice'); } catch (e) { /* 무시 */ }
  /* 확인용: index.html#parent 로 열면 보호자 메뉴가 바로 열린다 */
  if (location.hash === '#parent') openGuard();
  if (!storeMode) probeMaking();
  /* 잠긴 동화 주소로 바로 들어왔다가 돌아온 경우: 보호자 확인부터 */
  try {
    const lk = new URLSearchParams(location.search).get('locked');
    if (lk && TALES.some(t => t.id === lk && t.ready)) { history.replaceState(null, '', location.pathname + location.hash); setTimeout(() => openLock(lk), 600); }
  } catch (e) { /* 무시 */ }
})();
/* 임시(review.js): '새 그림' 딱지를 톡 누르면 확인함으로 바꾼다. 카드가 열리지 않게 막는다 */
/* 확인함은 그때의 REVIEW 값을 저장한다. 값이 바뀌면(다시 그림 등) 딱지가 다시 '새 그림'으로 보인다. 옛 기록(true)은 처음 값일 때만 확인함 */
function rvSeen(v, rv) { return v === rv || (v === true && /^(배경 다층·빛 상자(·개울)?|공주 화려하게\(v2\)|꽃밭·공장 다층|장난감 나라 다층|재기획 그림 전체)$/.test(rv || '')); }
document.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('.rv-badge'); if (!b) return;
  e.preventDefault(); e.stopPropagation();
  let m = {}; try { m = JSON.parse(localStorage.getItem('review_ok') || '{}'); } catch (er) { /* 무시 */ }
  const rv = window.REVIEW && window.REVIEW[b.dataset.rv], on = !rvSeen(m[b.dataset.rv], rv);
  m[b.dataset.rv] = on ? rv : false; try { localStorage.setItem('review_ok', JSON.stringify(m)); } catch (er) { /* 무시 */ }
  document.querySelectorAll('.rv-badge[data-rv="' + b.dataset.rv + '"]').forEach(x => { x.classList.toggle('ok', on); x.textContent = on ? '확인함' : '새 그림'; });
}, true);

