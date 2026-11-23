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
  /* GSAP 모션 시험(2026-11-23, 사용자가 보고 고르기용): ?motion=gsap 이면 켜고 기억(localStorage motionTrial), ?motion=off 면 끈다.
     켜졌을 때만 vendor/gsap/gsap.min.js 를 동적으로 불러온다. 꺼져 있거나 '동작 줄이기'면 지금 연출 그대로. engine/tale.js 도 같은 열쇠를 읽는다 */
  const MT = window.MotionTrial = (() => {
    let flag = false;
    try {
      const q = new URLSearchParams(location.search).get('motion');
      if (q === 'gsap') { flag = true; try { localStorage.setItem('motionTrial', 'gsap'); } catch (e) { /* 이번 화면만 */ } }
      else { if (q) try { localStorage.removeItem('motionTrial'); } catch (e) { /* 무시 */ } flag = !q && localStorage.getItem('motionTrial') === 'gsap'; }
    } catch (e) { flag = false; }
    let p = null;
    const load = () => p || (p = new Promise(res => {
      if (window.gsap) return res(window.gsap);
      const sc = document.createElement('script');
      sc.src = 'vendor/gsap/gsap.min.js?v=3.15.1';
      sc.onload = () => res(window.gsap || null); sc.onerror = () => res(null);
      document.head.appendChild(sc);
      setTimeout(() => res(window.gsap || null), 3000);
    }));
    const on = () => flag && !RM.matches;
    if (on()) load();
    return { on, load, get g() { return on() ? window.gsap || null : null; } };
  })();

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
  /* 웹도 앱과 같은 화면(탭 3개, 동화 탭은 추천 배너 + 분류별 목록, 카드 한 번 톡 = 열기).
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
  const CARD = new Set(window.CARDS || []), CARD_EN = new Set(window.CARDS_EN || []);   // 새 카드 썸네일 + 동화별 레터링(assets/thumbs/<id>_card · _lt, post_thumb2.py, 2026-10-31)
  const BAN = new Set(window.BANNERS || []), TTL = new Set(window.TITLES || []), TTL_EN = new Set(window.TITLES_EN || []);   // 맨 위 배너 그림 · 제목 레터링 (assets/banner, post_banner.py)
  const ltOn = id => CARD.has(id) && (lang === 'ko' || CARD_EN.has(id));
  const imgAttrs = 'class="art" alt="" loading="lazy" decoding="async"';
  const imgNow = 'class="art" alt="" decoding="async"';   // 배너 큰 그림은 바로 받는다

  /* ── 그림 딱지: 글자 없이 그림으로 (잠김 = 자물쇠, 이번 주 무료 = 별, 만드는 중 = 가위). 생성 그림 assets/ui/badge_<kind>.webp 가
     ui.js 의 UI_ART 에 올라오면 그것을 쓰고, 그 전에는 작은 기호(코드)로 대신한다 ── */
  const UIA = new Set(window.UI_ART || []);
  const uiImg = (key, cls = '') => `<img class="ui ${cls}" src="assets/ui/${key}.webp${key === 'logo_mark' ? '?v=moon1' : key === 'star_one' ? '?v=s4a' : ''}" alt="" aria-hidden="true" draggable="false" decoding="async">`;
  const BADGE_SVG = {
    lock: '<svg viewBox="0 0 48 56"><path d="M13 24v-7a11 11 0 0 1 22 0v7" fill="none" stroke="#5C6784" stroke-width="5" stroke-linecap="round"/><rect x="6" y="22" width="36" height="28" rx="5" fill="#5C6784"/><circle cx="24" cy="35" r="4" fill="#F5EFE9"/><rect x="22" y="35" width="4" height="9" rx="2" fill="#F5EFE9"/></svg>',
    week: '<svg viewBox="0 0 48 48"><path d="M24 4l6 13 14 1.6-10.4 9.6 3 14L24 34 11.4 42.2l3-14L4 18.6 18 17z" fill="#C98A5B"/></svg>',
    making: '<svg viewBox="0 0 48 48"><path d="M17 30L37 6M31 30L11 6" stroke="#5C6784" stroke-width="4.5" stroke-linecap="round" fill="none"/><circle cx="13" cy="36" r="6.5" fill="none" stroke="#C98A5B" stroke-width="4"/><circle cx="35" cy="36" r="6.5" fill="none" stroke="#C98A5B" stroke-width="4"/></svg>'
  };
  /* 이번 주 무료는 그림 대신 평평한 흰 알약 글자(홈 UI 2판, 2026-10-31 사용자: 튀어나온 별이 별로) */
  const badge = kind => kind === 'week' ? `<span class="bdg bdg-week" aria-hidden="true">${L('무료', 'Free')}</span>`
    : `<span class="bdg bdg-${kind}" aria-hidden="true">${UIA.has('badge_' + kind) ? uiImg('badge_' + kind) : BADGE_SVG[kind]}</span>`;
  /* 서가 줄 머리 스티커(64px): assets/ui/row_<줄>.webp 가 있으면 그림, 없으면 태그 아이콘·작은 기호 */
  const ROW_SVG = {
    week: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4l6 13 14 1.6-10.4 9.6 3 14L24 34 11.4 42.2l3-14L4 18.6 18 17z" fill="#C98A5B"/></svg>',
    recent: '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19" fill="#DDD2C4"/><circle cx="24" cy="24" r="14" fill="#F5EFE9"/><path d="M24 14v11l7 4" stroke="#5C6784" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
  };
  /* 홈 UI 2판(2026-10-30): 아래 탭·서가 줄 머리는 단색 기호(currentColor). 생성 단색 아이콘이 들어오기 전 임시 */
  const MONO = {
    tales: '<path fill-rule="evenodd" d="M2.5 5.2c3.2-1.3 6.3-1.1 9 .9v14.2c-2.7-1.7-5.8-1.9-9-.7zM21.5 5.2c-3.2-1.3-6.3-1.1-9 .9v14.2c2.7-1.7 5.8-1.9 9-.7z"/>',
    night: '<path d="M21 13.2A9.2 9.2 0 1 1 10.8 3a7.4 7.4 0 0 0 10.2 10.2z"/><path d="M18.6 2.6l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z"/>',   // 달 + 별(2026-10-30 사용자 고름)
    puzzle: '<path d="M9 3.6a2.2 2.2 0 0 1 4.4 0V5.2h3.8a1 1 0 0 1 1 1V10h-1.6a2.2 2.2 0 0 0 0 4.4h1.6v3.8a1 1 0 0 1-1 1h-3.8v-1.6a2.2 2.2 0 0 0-4.4 0v1.6H5.2a1 1 0 0 1-1-1v-3.8h1.6a2.2 2.2 0 0 0 0-4.4H4.2V6.2a1 1 0 0 1 1-1H9z"/>',
    stickers: '<path fill-rule="evenodd" d="M6 2.5h11.5a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2.5 2.5 0 0 1-2.5-2.5v-14A2.5 2.5 0 0 1 6 2.5zM12 6.8l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z"/>',
    recent: '<path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zM11 6.5v6.2l4.3 2.6 1-1.7-3.3-2V6.5z"/>',
    week: '<path fill-rule="evenodd" d="M5 4h2V2.5h2V4h6V2.5h2V4h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM5 9v10h14V9zm7 1.5l1.1 2.3 2.5.3-1.8 1.7.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.7 2.5-.3z"/>',
    original: '<path fill-rule="evenodd" d="M15.6 3.2l5.2 5.2L9 20.2l-6 1 1-6zM14.5 5.7l-.7.7 3.8 3.8.7-.7z"/>',
    princess: '<path d="M3 7.5l4.5 4L12 4l4.5 7.5L21 7.5 19 18H5z"/><rect x="5" y="19" width="14" height="2.4" rx="1"/>',
    korean: '<path d="M2 10.5c3.2 0 6.5-2.3 10-6.5 3.5 4.2 6.8 6.5 10 6.5v1.8H2z"/><path fill-rule="evenodd" d="M5 13.5h14V21H5zM10 16v5h4v-5z"/>',
    aesop: '<path d="M4 3l5 5h6l5-5v9a8 8 0 0 1-16 0z"/>',
    world: '<path fill-rule="evenodd" d="M3 6h3v2h2V6h3v2h2V6h3v2h2V6h3v15H3zm7 9v6h4v-6a2 2 0 0 0-4 0z"/>',
    all: '<path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>'
  };
  const mono = (k, cls = 'ic mono') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${MONO[k]}</svg>`;
  const rowIcon = k => MONO[k] ? mono(k) : UIA.has('row_' + k) ? uiImg('row_' + k, 'ic') : (ROW_SVG[k] || icon(k));

  /* 임시 스티커·구멍 그림 경로: 동화 그림 중 사각 종이 썸네일(_tile)을 쓴다 */
  const tileSrc = id => TILE.has(id) ? `assets/thumbs/${id}_tile.webp` : PIC2L.has(id) ? `assets/thumbs/${id}_light.webp` : (PIC2.has(id) || PIC.has(id)) ? `assets/thumbs/${id}.webp` : '';

  /* 큰 동화도 작은 목록과 같은 4:3 타일을 쓴다. 키아트(_key_wide/_key_tall)는 동화 시작 화면 전용(2026-10-13 사용자 결정) —
     홈에 넣으면 키아트의 종이 바탕이 홈 카드 안에서 따로 노는 네모로 보인다 */
  function holeHTML(t, open, st, big) {
    /* 구멍을 덮는 종이 마개: 잠김·만드는 중. 확인 전의 '만드는 중'(웹)은 덮지 않는다 */
    /* 마개는 '만드는 중'에만. 잠김은 크림 반투명 종이(CSS) + 오른쪽 아래 모서리 자물쇠, 이번 주 무료는 오른쪽 위 모서리 별(§7-2) — 얼굴을 가리지 않는다 */
    const making = st !== 'locked' && !open && !(t.making && !probed);
    const plug = (making ? `<span class="plug" aria-hidden="true">${badge('making')}</span>` : '') + (st === 'locked' ? badge('lock') : '') + (st === 'week' ? badge('week') : '');
    if (big && BAN.has(t.id)) return `<span class="thumb full banner"><img class="art" alt="" decoding="async" src="assets/banner/${t.id}.webp">${plug}</span>`;
    // 밝은 종이 한 가지만 쓴다 (다크 모드 없음). 밝은 판이 없으면 남색 판이라도
    /* 새 카드: 위쪽을 비워 그린 그림 + 동화별 레터링(영어 모드는 영어 레터링이 있을 때만, 없으면 아래 글자 제목) */
    const ia = big ? imgNow : imgAttrs;
    if (CARD.has(t.id)) return `<span class="thumb full tile card2"><img ${ia} src="assets/thumbs/${t.id}_card.webp?v=c2">${ltOn(t.id) ? `<img class="lt" src="assets/thumbs/${t.id}_lt${lang === 'en' ? '_en' : ''}.webp?v=c2" alt="" aria-hidden="true" draggable="false"${big ? '' : ' loading="lazy"'} decoding="async">` : ''}${plug}</span>`;
    if (TILE.has(t.id)) return `<span class="thumb full tile"><img ${ia} src="assets/thumbs/${t.id}_tile.webp">${plug}</span>`;
    const dk = PIC2.has(t.id), lt = PIC2L.has(t.id), base = `assets/thumbs/${t.id}`;
    if (lt || dk) return `<span class="thumb full"><img ${ia} src="${base}${lt ? '_light' : ''}.webp">${plug}</span>`;
    if (PIC.has(t.id)) return `<span class="thumb pic"><img class="art" src="assets/thumbs/${t.id}.webp" alt="" loading="lazy" decoding="async">${plug}</span>`;
    return `<span class="thumb svgart"><svg class="art" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${t.art}</svg>${plug}</span>`;
  }

  /* 화면 언어: 영어 자료(t.en)가 있는 동화만 영어로 보인다 */
  let lang = 'ko';
  try {
    /* 처음 실행(저장된 언어 없음): 기기 언어가 한국어가 아니면 영어로 시작하고 저장한다 */
    if (localStorage.getItem('lang') == null) {
      const dev = String((navigator.languages && navigator.languages[0]) || navigator.language || 'ko').toLowerCase();
      localStorage.setItem('lang', dev.startsWith('ko') ? 'ko' : 'en');
    }
    if (localStorage.getItem('lang') === 'en') lang = 'en';
  } catch (e) { /* 저장소를 못 쓰면 한국어 */ }
  /* 이름 바꾸기(engine/names.js): 창작 동화 제목·소개 글의 아이·강아지 이름. 꺼져 있으면 그대로 */
  const nameView = (x, id) => { try { return typeof Names !== 'undefined' && x ? Names.view(x, id) : x; } catch (e) { return x; } };
  const shown = t => { const s = (lang === 'en' && t.en) ? { ...t, ...t.en } : t; return s.origin === 'original' ? { ...s, title: nameView(s.title, t.id), line: nameView(s.line, t.id) } : s; };

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
    const lt = ltOn(t.id) && !(o.big && BAN.has(t.id));   // 레터링이 제목을 대신하면 아래 글자 제목은 숨긴다(이름은 aria-label 로)
    const inner = `${rvTag}
      ${holeHTML(t, open, st, o.big)}
      <span class="label">${lt ? '' : `<strong class="title">${t.title}</strong>`}${extra}</span>`;
    const href = `tales/${t.folder || t.id}/index.html${o.night ? '?read=1' : ''}`;
    const attrs = `data-id="${t.id}" data-origin="${t.origin}"${o.night ? ' data-night="1"' : ''}`;
    if (st === 'locked') {
      return `<div class="card locked" role="button" tabindex="0" aria-label="${t.title}, ${L('잠겨 있어요', 'locked')}" ${attrs}>${inner}</div>`;
    }
    return open
      ? `<a class="card" href="${href}" aria-label="${t.title}${st === 'week' ? ', ' + L('이번 주 무료', 'free this week') : ''}${o.night ? ', ' + L('읽어 주기', 'read aloud') : ''}" ${attrs}>${inner}</a>`
      : `<div class="card closed" role="button" tabindex="0" aria-disabled="true" aria-label="${t.title}, ${L('곧 열려요', 'coming soon')}" ${attrs}>${inner}</div>`;
  }

  /* ── 맨 위 추천 배너(홈 UI 2판, 2026-10-30): 좌우 꽉 찬 16:9 장면 그림 + 제목 레터링 + 감빛 알약(시작하기 / 잠기면 열어 보기) + 아래 점.
     좌우로 쓸면 다음 추천 동화, 위아래 스크롤은 목록과 같이 내려간다. 그림을 톡 해도 알약과 같다 ── */
  let heroId = null, heroList = [], heroDir = 0;
  const lastKey = 'paperTheater.last', recentKey = 'paperTheater.recent', recentReadKey = 'paperTheater.recentRead';
  const APP_VERSION = '1.0.0';   // package.json 과 같게 (보호자 영역 '정보'에 보임)
  const readList = k => { try { const a = JSON.parse(localStorage.getItem(k) || '[]'); return Array.isArray(a) ? a.filter(x => typeof x === 'string') : []; } catch (e) { return []; } };
  function pushRecent(id) {
    try { localStorage.setItem(recentKey, JSON.stringify([id, ...readList(recentKey).filter(x => x !== id)].slice(0, 8))); } catch (e) { /* 기억 못 해도 동화는 열린다 */ }
  }
  /* 추천 5편: 열린 동화(잠긴 것 포함) 중에서 날마다 바뀌는 순서로 고른다 — 같은 날엔 같은 추천 */
  const HERO_N = 5;
  function pickHero(pool) {
    const d = new Date(), seed0 = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    let x = seed0 % 2147483647 || 1;
    const rnd = () => (x = x * 48271 % 2147483647) / 2147483647;
    const a = pool.slice();
    for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(rnd() * (i + 1)); [a[i], a[k]] = [a[k], a[i]]; }
    return a.slice(0, HERO_N);
  }
  /* 넘기기 (§5-5): 지금 그림은 반대쪽으로 40px 밀리며 200ms 에 사라지고 새 그림은 같은 쪽 40px 에서 320ms 로 들어온다.
     제목은 60ms 늦게 16px 이동하며 바뀐다. 움직임 줄이기 = 160ms 크로스페이드 */
  let heroLock = 0;
  /* 배너 제목도 카드와 같은 동화별 콘셉트 레터링(2026-10-31 사용자). 없으면 옛 흰 레터링, 그것도 없으면 글자 */
  const heroTitleHTML = t => ltOn(t.id)
    ? `<img class="hero-tl lt2" src="assets/thumbs/${t.id}_lt${lang === 'en' ? '_en' : ''}.webp?v=c2" alt="${shown(t).title}" draggable="false" decoding="async">`
    : (lang === 'en' ? TTL_EN : TTL).has(t.id)   // 영어 모드는 영어 레터링(<id>_title_en.webp, 2026-10-31)
    ? `<img class="hero-tl" src="assets/banner/${t.id}_title${lang === 'en' ? '_en' : ''}.webp" alt="${shown(t).title}" draggable="false" decoding="async">` : shown(t).title;
  function renderHero() {
    const hero = $('#hero');
    hero.hidden = heroList.length === 0;
    if (!heroList.length) return;
    const fa = document.activeElement, fIn = fa && hero.contains(fa) ? (fa.classList.contains('hd') ? 'dot' : fa.closest('.card') ? 'card' : '') : '';   // 넘길 때 포커스를 잃지 않게
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
      tt.innerHTML = heroTitleHTML(t);
      tt.animate([{ transform: `translateX(${dir * (rm ? 0 : 16)}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: rm ? 160 : 260, delay: rm ? 0 : 60, easing: E, fill: 'backwards' });
    } else {
      slot.innerHTML = cardHTML(t, { big: true });
      tt.innerHTML = heroTitleHTML(t);
    }
    const locked = isOpen(t) && Entitlements.status(t.id) === 'locked';
    $('#heroPlayL').textContent = locked ? L('열어 보기', 'Unlock') : L('시작하기', 'Start');
    $('#heroPlay').classList.toggle('lock', locked);
    $('#heroPlay').setAttribute('aria-label', locked ? L(`${name} 열어 보기`, `Unlock ${name}`) : L(`${name} 시작하기`, `Start ${name}`));
    const dots = $('#heroDots');
    dots.hidden = heroList.length < 2;
    dots.innerHTML = heroList.map(x => `<button type="button" class="hd${x.id === heroId ? ' on' : ''}" data-id="${x.id}" aria-label="${shown(x).title}"${x.id === heroId ? ' aria-current="true"' : ''}>${x.id === heroId && heroList.length > 1 && motion() ? '<i class="hd-fill"></i>' : ''}</button>`).join('');
    const nf = fIn === 'dot' ? dots.querySelector('.hd.on') : fIn === 'card' ? slot.querySelector('.card:not(.hero-old)') : null;
    if (nf) nf.focus({ preventScroll: true });
  }
  const HOVER = matchMedia('(hover: hover)');               // 마우스를 배너에 올려 두면 멈춤(터치 기기는 누른 뒤 남는 hover 무시)
  function heroStep(d, to, auto) {
    if (heroList.length < 2) return;
    const now = performance.now();
    if (now < heroLock) return;                              // 넘기는 동안 다시 누름은 무시(연타 방지)
    heroLock = now + 320;
    const i = heroList.findIndex(t => t.id === heroId);
    heroId = to || heroList[(i + d + heroList.length) % heroList.length].id;
    heroDir = d;
    if (!auto) paper('tap');
    renderHero();
    if (auto) return;                                        // 저절로 넘길 때는 소리·제목 읽기 없음
    const t = heroList.find(x => x.id === heroId);
    sayTitle(shown(t).title, t.id);
  }
  /* 배너는 6초마다 저절로 다음 동화로 — 시간은 지금 점이 왼→오로 차오르는 애니메이션(.hd-fill, CSS heroFill) 하나가 정하고, 다 차면(animationend) 다음 동화.
     손으로 넘기거나 배너를 만지면 점을 다시 그려 처음부터 차오른다. 배너가 안 보이거나(다른 탭·스크롤로 사라짐) 앱이 뒤로 가면 멈춘다(.pause). 움직임 줄이기면 저절로 넘기지 않는다 */
  let heroVisible = true;
  function heroFillRestart() {
    const f = $('#heroDots .hd-fill'); if (!f) return;
    f.style.animation = 'none'; void f.offsetWidth; f.style.animation = '';
  }
  const heroPauseSync = () => { const hz = $('#hero'); if (hz) hz.classList.toggle('pause', document.hidden || !heroVisible); };
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { heroVisible = es[es.length - 1].isIntersecting; heroPauseSync(); }, { threshold: .5 }).observe($('#hero'));
  document.addEventListener('visibilitychange', heroPauseSync);
  $('#heroDots').addEventListener('animationend', e => {
    if (e.animationName !== 'heroFill') return;
    const before = heroId;
    heroStep(1, null, true);
    if (heroId === before) heroFillRestart();
  });
  {
    /* 감빛 알약 = 배너 그림 톡과 같은 동작(잠긴 동화는 잠김 쪽지, 열린 동화는 커튼 → 동화) */
    $('#heroPlay').addEventListener('click', () => { const c = $('#heroSlot .card:not(.hero-old)'); if (c) c.click(); });
    $('#heroDots').addEventListener('click', e => {
      const b = e.target.closest('.hd'); if (!b || b.dataset.id === heroId) return;
      const i = heroList.findIndex(t => t.id === heroId), k = heroList.findIndex(t => t.id === b.dataset.id);
      heroStep(k > i ? 1 : -1, b.dataset.id);
    });
    let sx = null;
    const hz = $('#hero');
    hz.addEventListener('pointerdown', e => { sx = e.clientX; heroFillRestart(); });
    hz.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 70) { heroStep(e.clientX < sx ? 1 : -1); hz.dataset.swiped = '1'; setTimeout(() => { delete hz.dataset.swiped; }, 50); } sx = null; });
    let wheelAt = 0;
    hz.addEventListener('wheel', e => {  // 트랙패드 가로 쓸기로도 넘긴다(세로 스크롤은 목록을 내린다)
      if (Math.abs(e.deltaX) < 12 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      if (now - wheelAt < 450) return;
      wheelAt = now; heroStep(e.deltaX > 0 ? 1 : -1);
    }, { passive: false });
    hz.addEventListener('click', e => { if (hz.dataset.swiped) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* ── S1 서가 줄 7개: 최근 본 · 이번 주 무료(앱 모드만, 2026-10-31 사용자: 최근 본 아래) · 창작 · 공주 · 동물(이솝) · 우리나라 · 세계. 비는 줄은 숨기고, 같은 동화가 여러 줄에 나와도 된다.
     동화는 모두 origin 이 하나 있으므로 31편이 최소 한 줄에는 보인다 ── */
  const ROWS = [
    { k: 'recent', ko: '최근 본', en: 'Recently played', pick: () => readList(recentKey).map(id => TALES.find(t => t.id === id)).filter(Boolean) },
    { k: 'week', ko: '이번 주 무료', en: 'Free this week', pick: () => storeMode ? Entitlements.freeThisWeek().map(id => TALES.find(t => t.id === id)).filter(Boolean) : [] },
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
    /* 배너에는 지금 바로 볼 수 있는 동화만(잠긴 동화 홍보 금지, 2026-10-31 사용자). 모두 잠겼을 때만 열린 동화로 */
    const heroPool = TALES.filter(t => vis.has(t.id) && playable(t));
    heroList = pickHero(heroPool.length ? heroPool : TALES.filter(t => vis.has(t.id) && isOpen(t)));
    rowsEl.innerHTML = ROWS.map(r => {
      const list = r.k === 'week' || r.k === 'recent' ? r.pick().filter(t => vis.has(t.id)) : byRank(r.pick().filter(t => vis.has(t.id)));
      if (!list.length) return '';
      return `<section class="row" data-row="${r.k}" aria-label="${L(r.ko, r.en)}"><h3 class="row-h"><span class="row-ic">${rowIcon(r.k)}</span><span class="row-t">${L(r.ko, r.en)}</span></h3>
        <div class="row-scroll">${list.map(t => `<div class="slot" data-id="${t.id}">${cardHTML(t)}</div>`).join('')}</div><i class="row-bar" aria-hidden="true"><b></b></i></section>`;
    }).join('');
    const none = seen.length === 0;
    $('#empty').hidden = !none;
    if (none && !emptySaid) { emptySaid = true; say(L('이 조합의 이야기는 아직 없어요', 'No tales match yet')); }
    if (!none) emptySaid = false;
    renderHero();
    renderNight(); drawStickers();
    if ((opts.intro || introPending) && motion() && opts.anim !== false && !rowsIntroDone()) {     // 앱을 처음 열었을 때(세션당 한 번): 배너 아래 줄이 위에서부터 50ms 간격으로 8px 떠오른다
      introPending = false;
      if (MT.on()) { gsapIntro(rowsEl, opts.delay || 0); return; }   // GSAP 시험: 배너 → 줄 머리·카드 차례로 내려앉기
      let k = 0;
      rowsEl.querySelectorAll('.row').forEach(r => {
        if (!r.offsetParent) return;
        const b = r.getBoundingClientRect();
        if (b.top > innerHeight || b.bottom < 0) return;
        r.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: (opts.delay || 0) * 1000 + k++ * 50, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      });
      if (k) try { sessionStorage.setItem('ppRowsIntro', '1'); } catch (e) { /* 기억 못 하면 다음에도 한 번 더 보일 뿐 */ }
    }
  }
  const rowsIntroDone = () => { try { return sessionStorage.getItem('ppRowsIntro') === '1'; } catch (e) { return false; } };
  /* GSAP 시험 ① 홈 첫 화면(세션당 한 번): 배너가 먼저 자리 잡고(0.5초), 보이는 줄의 머리글과 카드가 위에서 한 장씩 살짝 내려앉는다. 합쳐 1초 안팎.
     transform·opacity 만. 누름은 막지 않는다(움직이는 동안에도 카드가 눌린다). GSAP 를 못 불러오면 바로 원래 모습 */
  function gsapIntro(rowsEl, delay) {
    const inView = el => { if (!el || !el.offsetParent) return false; const b = el.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0 && b.left < innerWidth && b.right > 0; };
    const hero = $('#hero'), heroOn = inView(hero);
    const items = [...rowsEl.querySelectorAll('.row')].filter(inView).flatMap(r => [r.querySelector('.row-h'), ...[...r.querySelectorAll('.slot')].filter(inView)]).filter(Boolean);
    if (!heroOn && !items.length) return;
    try { sessionStorage.setItem('ppRowsIntro', '1'); } catch (e) { /* 다음에도 한 번 더 보일 뿐 */ }
    const all = heroOn ? [hero, ...items] : items;
    all.forEach(el => { el.style.opacity = '0'; });            // GSAP 가 오기 전 깜빡임 막기
    const clear = () => all.forEach(el => { el.style.opacity = ''; el.style.transform = ''; });
    MT.load().then(g => {
      if (!g || !MT.on()) { clear(); return; }
      const tl = g.timeline({ delay, onComplete: () => g.set(all, { clearProps: 'transform,opacity' }) });
      if (heroOn) tl.fromTo(hero, { opacity: 0, y: 14, scale: .975 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'power3.out' }, 0);
      if (items.length) tl.fromTo(items, { opacity: 0, y: -14, scale: .985 }, { opacity: 1, y: 0, scale: 1, duration: .42, ease: 'back.out(1.5)', stagger: Math.min(.045, .5 / items.length) }, heroOn ? .2 : 0);
    });
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
    set('#heroDots', L('추천 동화', 'Featured tales'));
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
  /* 카드 → 무대: 극장 막(빨간 종이 커튼 두 폭)이 양쪽에서 닫히고, 위에서 휘장이 내려온다. 닫힌 막이 동화 페이지를 불러오는 틈을 가리고,
     동화 쪽(tale.js arrive)에서 같은 막이 열리며 책 표지(시작 화면)가 보인다. 2026-10-30 사용자: 조리개 대신 커튼.
     전부 0.75초. 애니메이션이 멈춰도 1.2초 뒤엔 넘어간다. */
  const curtainEl = () => {
    const c = document.createElement('div'); c.className = 'curt';
    c.innerHTML = `<div class="cp l"></div><div class="cp r"></div><div class="val"></div>`;
    document.body.appendChild(c); return c;
  };
  try { addEventListener('load', () => setTimeout(() => ['assets/ui/ui_curtain_panel.webp', 'assets/v3w/cd2_layer_curtain_swag.webp'].forEach(u => { new Image().src = u; }), 1500)); } catch (e) { /* 무시 */ }   // 막 그림 미리(동화 쪽은 캐시로)
  /* ── 책 열기 2판(시안 2026-11-22, startSeq=book2): 극장 커튼 대신, 누른 카드가 그 자리에서 커지며 동화 표지(키아트 + 제목 레터링)가 된다.
     레터링은 카드의 것이 그대로 날아가 표지 자리에 앉고(같은 그림 파일), 카드 그림은 커지는 동안 표지 그림으로 바뀐다.
     다 커지면 표지 모습을 넘겨주고(sessionStorage startSeqHandoff) 동화 페이지로 — 동화 쪽(engine/tale.js b2Make)이 같은 표지로 시작해 넘긴다.
     켜기: ?start=book2 (기억됨) 또는 localStorage startSeq='book2'. ?start=curtain 이면 끄고 지금 방식. 누르면 바로 넘어간다 ── */
  /* 2026-11-22 사용자 승인("나머지도 다 적용"): 기본 = book4(9판 책 열기). 극장 커튼은 ?start=curtain(기억됨)으로만 켠다. 그 밖의 값은 기억을 지우고 기본으로 */
  const START_SEQ = (() => {
    const DEF = 'book4';
    try {
      const q = new URLSearchParams(location.search).get('start');
      const OK = ['book2', 'book3', 'book4', 'curtain'];   // book3 = 책 한 권 3판, book4 = 카드가 그 자리에서 책이 되는 4판, curtain = 옛 극장 커튼
      if (OK.includes(q)) localStorage.setItem('startSeq', q); else if (q) localStorage.removeItem('startSeq');
      const v = localStorage.getItem('startSeq'), s = OK.includes(v) ? v : DEF; return s === 'curtain' ? '' : s;
    } catch (e) { return DEF; }
  })();
  /* 표지 배치: engine/tale.js b2Geo 와 똑같아야 한다 */
  function b2Geo(W, H, ltAr) {
    const pt = H > W, aAr = pt ? 3 / 4 : 16 / 9;
    const lh = Math.min(H * (pt ? .2 : .25), W * (pt ? .62 : .36) / ltAr), lw = lh * ltAr;
    const maxH = H * (pt ? .72 : .8);
    let aw = W, ah = W / aAr; if (ah > maxH) { ah = maxH; aw = ah * aAr; }
    const top = Math.max(0, (H - ah - lh * .8) * .45);
    return { pt, art: { x: (W - aw) / 2, y: top, w: aw, h: ah }, lt: { x: (W - lw) / 2, y: top + ah - lh * .2, w: lw, h: lh } };
  }
  const B2_MASK = 'linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent), linear-gradient(transparent, #000 3%, #000 86%, transparent)';
  const b2Img = src => new Promise(res => { const im = new Image(); im.decoding = 'async'; im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => res(im)); im.onerror = () => res(null); im.src = src; });
  /* 이 카드로 2판을 할 수 있으면 넘겨줄 자료 */
  function b2Plan(card) {
    if (!START_SEQ) return null;
    const id = card.dataset.id, m = (card.getAttribute('href') || '').match(/tales\/([^/]+)\//);
    if (!id || !m || !(window.THUMBSKEY || []).includes(id)) return null;
    const pt = innerHeight > innerWidth, abs = u => new URL(u, location.href).href;
    return { seq: START_SEQ, board: (window.BACKACCENT || {})[id] || '', id, folder: m[1], art: abs(`assets/thumbs/${id}_key_${pt ? 'tall' : 'wide'}.webp`), lt: abs(`assets/thumbs/${id}_lt${lang === 'en' ? '_en' : ''}.webp?v=c2`) };
  }
  const b2Give = (h, ltAr) => { try { sessionStorage.setItem('startSeqHandoff', JSON.stringify({ ...h, ltAr, t: Date.now() })); } catch (e) { /* 넘겨주지 못하면 동화 쪽은 지금 시작 화면 */ } };
  async function openBook2(card, h, go) {
    const W = innerWidth, H = innerHeight;
    const box = card.querySelector('.thumb') || card, r0 = box.getBoundingClientRect(), rad = parseFloat(getComputedStyle(box).borderTopLeftRadius) || 0;
    const cardArt = card.querySelector('.thumb .art'), cardLt = card.querySelector('.thumb .lt');
    const artP = b2Img(h.art);
    const same = cardLt && cardLt.complete && cardLt.naturalWidth && cardLt.currentSrc === h.lt;   // 카드 레터링 = 표지 레터링(같은 파일)이면 기다리지 않는다
    const ltIm = same ? cardLt : await Promise.race([b2Img(h.lt), new Promise(r => setTimeout(() => r(null), 400))]);
    const ltAr = ltIm && ltIm.naturalWidth ? ltIm.naturalWidth / ltIm.naturalHeight : 1.5;
    const g = b2Geo(W, H, ltAr);
    const ov = document.createElement('div'); ov.className = 'b2fly';
    ov.style.cssText = `position:fixed;left:0;top:0;z-index:300;overflow:hidden;background:#F5EFE9;box-shadow:0 10px 30px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.04);touch-action:none`;
    const comp = document.createElement('div');
    comp.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;background:#F5EFE9`;
    const ab = g.art;
    comp.innerHTML = `<img alt="" draggable="false" src="${h.art}" style="position:absolute;left:${ab.x.toFixed(1)}px;top:${ab.y.toFixed(1)}px;width:${ab.w.toFixed(1)}px;height:${ab.h.toFixed(1)}px;object-fit:contain;-webkit-mask:${B2_MASK};-webkit-mask-composite:source-in;mask:${B2_MASK};mask-composite:intersect">`;
    ov.appendChild(comp);
    let ca = null;
    if (cardArt && cardArt.currentSrc) {
      ca = document.createElement('img'); ca.alt = ''; ca.src = cardArt.currentSrc;
      ca.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
      ov.appendChild(ca);
    }
    // 레터링: 카드 위 자리(없으면 카드 가운데 작게) → 표지 자리
    const lr0 = cardLt && cardLt.getBoundingClientRect().width ? cardLt.getBoundingClientRect() : { left: r0.left + r0.width * .3, top: r0.top + r0.height * .05, width: r0.width * .4, height: r0.width * .4 / ltAr };
    const fl = document.createElement('img'); fl.alt = ''; fl.className = 'b2fly'; fl.src = h.lt;
    fl.style.cssText = `position:fixed;left:0;top:0;width:${g.lt.w}px;height:${g.lt.h}px;z-index:301;transform-origin:0 0;object-fit:contain;pointer-events:none`;
    document.body.append(ov, fl);
    if (cardLt) cardLt.style.visibility = 'hidden';
    let gone = false;
    const leave = () => {
      if (gone) return; gone = true; b2Give(h, ltAr); go();
    };
    const fallback = setTimeout(leave, 2400);
    const anim = play(.62, t => {
      const p = eio(t / .62);
      const x = lerp(r0.left, 0, p), y = lerp(r0.top, 0, p), w = lerp(r0.width, W, p), hh = lerp(r0.height, H, p);
      Object.assign(ov.style, { left: x.toFixed(1) + 'px', top: y.toFixed(1) + 'px', width: w.toFixed(1) + 'px', height: hh.toFixed(1) + 'px', borderRadius: (rad * (1 - p)).toFixed(1) + 'px' });
      ov.style.boxShadow = p >= 1 ? 'none' : '';
      const s = Math.max(w / W, hh / H);
      comp.style.transform = `translate(${((w - W * s) / 2).toFixed(1)}px, ${((hh - H * s) / 2).toFixed(1)}px) scale(${s.toFixed(4)})`;
      if (ca) ca.style.opacity = (1 - clamp((p - .12) / .5)).toFixed(3);
      const lx = lerp(lr0.left, g.lt.x, p), ly = lerp(lr0.top, g.lt.y, p), ls = lerp(lr0.width, g.lt.w, p) / g.lt.w;
      fl.style.transform = `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px) scale(${ls.toFixed(4)})`;
    }, async () => {
      await Promise.race([artP, new Promise(r => setTimeout(r, 900))]);   // 표지 그림이 다 그려진 뒤 넘어간다(동화 쪽은 캐시에서 같은 그림)
      clearTimeout(fallback); requestAnimationFrame(() => requestAnimationFrame(leave));
    });
    // 누르면 바로(그림이 덜 왔어도) 넘어간다
    const skip = e => { e.preventDefault(); e.stopPropagation(); if (anim.alive) anim.finish(); else leave(); };
    ov.addEventListener('pointerdown', skip); fl.addEventListener('pointerdown', skip);
  }
  /* 책 열기 3판(시안 2026-11-22, startSeq=book3): 홈 화면이 크림 종이(동화 페이지 바탕과 같은 색)로 걷히고 카드는 살짝 커지며 함께 사라진다.
     동화 쪽(engine/tale.js b3Make)은 같은 크림 종이에서 시작해 책 한 권이 내려앉아 열린다. 페이지가 바뀌는 순간엔 빈 종이뿐이라 이음새가 없다 */
  function openBook3(card, h, go) {
    const box = card.querySelector('.thumb') || card, cardLt = card.querySelector('.thumb .lt');
    const same = cardLt && cardLt.complete && cardLt.naturalWidth && cardLt.currentSrc === h.lt;
    const ltP = same ? Promise.resolve(cardLt) : b2Img(h.lt), artP = b2Img(h.art);   // 그림을 미리 풀어 두면 동화 쪽이 캐시에서 바로 꺼낸다
    const ov = document.createElement('div'); ov.className = 'b2fly';
    ov.style.cssText = 'position:fixed;inset:0;z-index:300;background:#F5EFE9;opacity:0;touch-action:none';
    document.body.appendChild(ov);
    let gone = false;
    const leave = async () => {
      if (gone) return; gone = true;
      const ltIm = await Promise.race([ltP, new Promise(r => setTimeout(() => r(null), 500))]);
      await Promise.race([artP, new Promise(r => setTimeout(r, 700))]);
      b2Give(h, ltIm && ltIm.naturalWidth ? ltIm.naturalWidth / ltIm.naturalHeight : 1.5); go();
    };
    const fallback = setTimeout(leave, 2000);
    const anim = play(.4, t => {
      const p = eio(t / .4);
      ov.style.opacity = p.toFixed(3);
      box.style.scale = (1 + .07 * eo(t / .4)).toFixed(4);
    }, () => { clearTimeout(fallback); leave(); });
    ov.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (anim.alive) anim.finish(); else leave(); });
  }
  /* 책 열기 4판(시안 2026-11-22, startSeq=book4): 누른 카드의 썸네일만 남고 나머지 홈은 크림 종이로 걷힌다. 남은 썸네일 둘레에 책등·책장 단면·그림자가
     자라 책 한 권이 되면서 그 자리에서 눈앞으로 다가온다(7판: 카메라 목표는 '제목 쪽이 화면을 채운 자리' 하나, engine/book4.js PTBook.plan 시각표). 누른 순간(t0)과 카드 자리를 넘겨주고 NAV(.5초)에 동화로 —
     동화 쪽은 <head> 에서 같은 책을 같은 시각표로 t0 부터 이어 그린다(페이지가 바뀌어도 책은 멈추지 않는다). 누르면 건너뛴다 */
  function openBook4(card, h, go) {
    const box = card.querySelector('.thumb') || card, r0 = box.getBoundingClientRect();
    const cardArt = card.querySelector('.thumb .art'), cardLt = card.querySelector('.thumb .lt');
    if (typeof PTBook === 'undefined' || !PTBook.plan || !cardArt || !cardArt.currentSrc) { openBook3(card, h, go); return; }
    const art = cardArt.currentSrc, coverLt = cardLt && cardLt.currentSrc ? cardLt.currentSrc : '';
    const t0 = Date.now();
    const same = cardLt && cardLt.complete && cardLt.naturalWidth && cardLt.currentSrc === h.lt;   // 카드 레터링 = 제목 쪽 레터링(같은 파일)이면 기다리지 않는다
    const ltP = same ? Promise.resolve(cardLt) : b2Img(h.lt); b2Img(h.art);   // 제목 쪽 키아트(h.art = _key_wide/_key_tall)를 미리 풀어 둔다
    const ov = document.createElement('div'); ov.className = 'b2fly';
    ov.style.cssText = 'position:fixed;inset:0;z-index:300;background:#F5EFE9;opacity:0;touch-action:none';
    const radius = parseFloat(getComputedStyle(box).borderTopLeftRadius) || 0;
    const bk = PTBook.make({ art, coverLt, lt: h.lt, board: h.board || undefined, z: 301, bg: false, id: 'b4Home', radius });
    bk.root.classList.add('b2fly');
    /* 시점 옮기기(2026-11-22 사용자 '끝에 잘리는 거 거슬림'): 화면 끝에 걸린 카드를 눌렀으면 홈이 걷히는 동안(FADE) 화면 전체(body)가 카드 쪽으로 살짝
       미끄러져, 걷힘이 끝날 때 책(책등·두께 포함)이 여백 M 을 두고 온전히 들어와 있게 한다. 카드 줄 스크롤이 아니라 시점 이동이라 홈과 카드가 같이 움직이고,
       이미 안에 있는 카드는 움직이지 않는다. 줌인 곡선은 옮겨진 자리(rect)에서 시작하므로 시선은 여전히 한 번. 덮개는 <html> 에 붙여 body 와 함께 밀리지 않게 한다 */
    const W = innerWidth, H = innerHeight, M = Math.max(20, Math.min(W, H) * .04), u = Math.min(r0.height, r0.width * .9), bS = u * .075, bT = u * .107;
    const fit = (lo, hi, len) => (hi - lo > len - 2 * M) ? (len - (lo + hi)) / 2 : lo < M ? M - lo : hi > len - M ? len - M - hi : 0;   // 안 들어가면 가운데로
    const dx = fit(r0.left - bS, r0.right + bT, W), dy = fit(r0.top, r0.bottom + bT, H), shift = Math.hypot(dx, dy) >= 1;
    const rect = { x: r0.left + dx, y: r0.top + dy, w: r0.width, h: r0.height };   // 걷힘이 끝난 뒤의 카드 자리 = 줌인의 시작 자리
    const body = document.body; if (shift) body.style.willChange = 'transform';
    document.documentElement.append(ov, bk.root); bk.layout({ x: r0.left, y: r0.top, w: r0.width, h: r0.height }, 0, 0);
    box.style.visibility = 'hidden';
    const TL = PTBook.TL, P = PTBook.plan(W, H, rect);
    const sio = k => .5 - .5 * Math.cos(Math.PI * clamp(k));   // 부드러운 가감속
    let gone = false, skip = false;
    const leave = async () => {
      if (gone) return; gone = true;
      const ltIm = await Promise.race([ltP, new Promise(r => setTimeout(() => r(null), 400))]);
      b2Give({ ...h, rect, t0, skip, art, coverLt, key: h.art, radius }, ltIm && ltIm.naturalWidth ? ltIm.naturalWidth / ltIm.naturalHeight : 1.5); go();
    };
    const fallback = setTimeout(leave, 2500);
    // 페이지를 떠난 뒤에도 새 페이지가 그려질 때까지 이 페이지가 같은 시각표로 계속 그린다(KEEP 까지)
    const anim = play(TL.KEEP, () => {
      const t = (Date.now() - t0) / 1000, kf = sio(t / TL.FADE);
      ov.style.opacity = kf.toFixed(3);
      const s = P.at(t); let r = s.r;
      if (shift) {   // 걷히는 동안 홈과 책이 함께 카드 쪽으로 미끄러진다(FADE 가 끝나면 책은 rect 에, 홈은 이미 다 걷혔다)
        if (kf < 1) { body.style.transform = `translate(${(dx * kf).toFixed(2)}px, ${(dy * kf).toFixed(2)}px)`; r = { x: r.x - dx * (1 - kf), y: r.y - dy * (1 - kf), w: r.w, h: r.h }; }
      }
      bk.layout(r, s.g, s.ang);
      if (t >= TL.NAV) { clearTimeout(fallback); leave(); }
    }, () => { clearTimeout(fallback); leave(); });
    window.__b4shift = { dx, dy, r0: { x: r0.left, y: r0.top, w: r0.width, h: r0.height } };   // 검수용
    ov.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); skip = true; ov.style.opacity = '1'; if (anim.alive) anim.finish(); else leave(); });
  }
  /* 누름이 보인 뒤(약 120ms) 커튼으로. 움직임 줄이기면 바로 */
  let soonCard = null;
  function openTaleSoon(card) {
    if (soonCard) return;
    if (!motion()) { openTale(card); return; }
    soonCard = card;
    setTimeout(() => { soonCard = null; openTale(card); }, 120);
  }
  function openTale(card) {
    const href = card.getAttribute('href');
    if (leavingPage) return;
    try { localStorage.setItem(lastKey, card.dataset.id); } catch (e) { /* 무시 */ }
    if (!card.dataset.night) pushRecent(card.dataset.id);
    leavingPage = true;
    let gone = false;
    const go = () => { if (!gone) { gone = true; location.href = href; } };
    const b2h = b2Plan(card);   // 책 열기 2판(시안): 커튼 대신 카드가 표지로 커진다. 움직임 줄이기면 바로 넘어가고 동화 쪽이 제목 쪽 → 짧은 페이드
    if (b2h) { if (!motion()) { b2Give(b2h, 1.5); go(); } else ({ book3: openBook3, book4: openBook4 }[b2h.seq] || openBook2)(card, b2h, go); return; }
    if (!motion()) { go(); return; }
    const c = curtainEl(), L = c.querySelector('.l'), R = c.querySelector('.r'), V = c.querySelector('.val');
    const fallback = setTimeout(go, 1200);
    setTimeout(() => paper('turn'), 120);
    card.classList.add('anim');
    play(.75, t => {
      card.style.scale = (1 - .04 * Math.sin(Math.PI * clamp(t / .14))).toFixed(4);
      // 막: 천천히 끌려 나오다 가운데서 살짝 겹치며 멈춘다(무게감). 폭마다 끝자락이 조금 늦게 따라와 흔들린다
      const k = clamp((t - .04) / .6), e = k < 1 ? 1 - Math.pow(1 - k, 3) * (1 - 1.6 * k * (1 - k)) : 1;
      const x = (1 - e) * 102 - 1.2 * Math.sin(Math.PI * clamp((t - .5) / .25));
      const sway = Math.sin(Math.PI * k) * 3;
      L.style.transform = `translateX(${-x}%) skewX(${sway}deg)`; R.style.transform = `translateX(${x}%) skewX(${-sway}deg)`;
      V.style.transform = `translateY(${(-100 * (1 - eo(t / .35))).toFixed(2)}%)`;
    }, () => { clearTimeout(fallback); go(); });
  }
  /* 뒤로 가기로 돌아왔을 때(페이지 캐시) 전환 막을 걷는다 */
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    leavingPage = false;
    $('#stageOut').hidden = true; document.querySelectorAll('.curt, .b2fly').forEach(c => c.remove());
    document.body.style.transform = ''; document.body.style.willChange = '';   // 4판 시점 옮기기(body 밀기)를 되돌린다
    document.querySelectorAll('.thumb .lt').forEach(l => { l.style.visibility = ''; });
    document.querySelectorAll('.thumb').forEach(t => { t.style.scale = ''; t.style.visibility = ''; });
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
    paper('tap');
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (err) { /* 무시 */ }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;   // 새 탭 열기는 그대로
    e.preventDefault();
    openTaleSoon(c);
  }
  $('#rows').addEventListener('click', activate);
  // 분류 카드 가로 넘김: 넘기는 동안만 얇은 막대가 보였다가 0.8초 뒤 사라짐(웹 기본 막대는 숨김)
  $('#rows').addEventListener('scroll', e => {
    const sc = e.target;
    if (!sc.classList || !sc.classList.contains('row-scroll')) return;
    const bar = sc.nextElementSibling, w = sc.scrollWidth, cw = sc.clientWidth;
    if (!bar || w <= cw + 1) return;
    const th = bar.firstElementChild, k = cw / w, tw = Math.max(24, bar.clientWidth * k);
    th.style.width = tw + 'px';
    th.style.transform = `translateX(${(bar.clientWidth - tw) * sc.scrollLeft / (w - cw)}px)`;
    bar.classList.add('on');
    clearTimeout(bar._t); bar._t = setTimeout(() => bar.classList.remove('on'), 800);
  }, { capture: true, passive: true });
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
  /* 팝업 넷(#guard #gate #flow #plEdit)의 접근성: 열려 있는 동안 뒤 화면은 inert(눌림·포커스·읽기 모두 막힘), 포커스는 팝업 안으로,
     Tab 은 팝업 안에서만 돌고, Esc 로 닫고, 닫으면 연 단추로 돌아온다. 겹쳐 열린 팝업은 맨 위 것만 살아 있다 */
  const modalStack = [];
  const MODAL_BG = ['#home', '#starChip', '#parentBtn'];
  const modalTop = () => modalStack[modalStack.length - 1] || null;
  function modalSync() {
    const top = modalTop();
    MODAL_BG.forEach(sel => { const e = document.querySelector(sel); if (e) e.inert = modalStack.length > 0; });
    document.querySelectorAll('.guard, .parent, .pl-edit').forEach(m => { m.inert = !!top && m !== top; });
  }
  const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusables = root => [...root.querySelectorAll(FOCUSABLE)].filter(e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
  function showModal(el, sheet, o = {}) {
    modalStop(el);
    hint.hidden = true;
    const opened = !el.hidden && el.dataset.state === 'open';
    if (!modalStack.includes(el)) {
      const a = document.activeElement;
      el._opener = a && a !== document.body && !el.contains(a) ? a : null;   // 닫을 때 돌아올 자리
      modalStack.push(el);
    }
    el.hidden = false;
    if (!opened) { void el.offsetWidth; el.dataset.state = 'open'; }   // 닫힌 모습을 한 번 그린 뒤 열어야 전환이 보인다
    modalSync();
    let f = o.focus && el.querySelector(o.focus);
    if (!f) f = focusables(el)[0];
    if (!f) { el.tabIndex = -1; f = el; }
    f.focus({ preventScroll: true });
  }
  function hideModal(el, sheet, after) {
    if (el.hidden || el.dataset.state === 'closing') return;
    modalStop(el);
    el.dataset.state = 'closing';
    const fin = () => {
      if (el.dataset.state !== 'closing') return;
      modalStop(el);
      el.hidden = true; delete el.dataset.state;
      const k = modalStack.indexOf(el); if (k >= 0) modalStack.splice(k, 1);
      modalSync();
      if (after) after();
      let op = el._opener; el._opener = null;
      if (!(op && op.isConnected) && el._refocus) op = el._refocus();     // 다시 그려져 사라진 단추는 새 단추로
      const a = document.activeElement, lost = !a || a === document.body || el.contains(a);   // 숨긴 팝업 안에 남은 포커스도 잃은 것으로 친다
      if (lost && op && op.isConnected && !op.closest('[inert]') && op.getClientRects().length) op.focus({ preventScroll: true });
      else if (lost && modalTop()) { const f = focusables(modalTop())[0]; if (f) f.focus({ preventScroll: true }); }
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
    reset: ['기록을 지우려면 아래 문제를 풀어 주세요.', 'To erase records, please answer this question.'],
    names: ['이름 바꾸기를 열려면 아래 문제를 풀어 주세요.', 'To open name settings, please answer this question.'],
    mail: ['메일 앱을 열려면 아래 문제를 풀어 주세요.', 'To open the mail app, please answer this question.']
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
    $('#gateHint').textContent = L('정답을 1.5초 동안 꾹 눌러 주세요.', 'Press and hold the right answer for 1.5 seconds.');
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
    setTimeout(() => { gateSheet.classList.remove('fail'); hideModal(gateEl, gateSheet, () => { gateOff(); sheetClosed(); toast(L('틀렸습니다. 30초 뒤에 다시 해 주세요.', 'Not quite. Please try again in 30 seconds.')); }); }, 100);
  }
  function closeGate() { gateCb = null; hideModal(gateEl, gateSheet, () => gateOff(sheetClosed)); }
  $('#gateClose').addEventListener('click', closeGate);
  gateEl.addEventListener('click', e => { if (e.target === gateEl) closeGate(); });

  /* ── 톱니(1초 꾹) → S9 보호자 영역 ── */
  const gear = $('#parentBtn');
  holdable(gear, 1000, () => openGuard(), () => toast(L('보호자 메뉴는 1초 동안 꾹 누르세요', 'Press and hold for 1 second for the grown-up menu')));

  /* 보호자 쪽 기능 도우미: 대사 자막·놀이 시간(동화 엔진이 같은 키를 읽는다) */
  const captionsOff = () => { try { return localStorage.getItem('captions_off') === '1'; } catch (e) { return false; } };
  /* 자동 재생 설정은 없앴다(2026-11-06, '읽어 주기' 탭이 같은 일을 한다). 예전에 켜 둔 기기는 여기서 끈다 */
  try { localStorage.removeItem('auto_play'); } catch (e) { /* 저장소 없음 */ }
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
    records: '<path d="M6 7h12M9 7V4.5h6V7M7.5 7l.8 12.5h7.4L16.5 7"/>',
    names: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>',
    notice: '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2h-14z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'
  };
  const guardItems = () => [
    { k: 'sound', t: L('소리와 글', 'Sound & text') },
    { k: 'time', t: L('놀이 시간', 'Play time') },
    { k: 'lang', t: L('언어', 'Language') },
    { k: 'find', t: L('동화 찾기', 'Find tales') },
    ...(isApp ? [{ k: 'pass', t: L('이용권', 'Access') }, { k: 'link', t: L('기기 연결', 'Link devices') }] : []),
    ...(namesOn() ? [{ k: 'names', t: L('우리 아이 이름', 'Child\'s name') }] : []),   // 앱 모드 + 서버가 켜져 있을 때만(웹 공개판은 숨김)
    ...(noticeOn() ? [{ k: 'notice', t: L('공지사항', 'Notices') }] : []),   // 공지 서버 주소가 있을 때만(웹 공개판은 숨김)
    { k: 'about', t: L('정보', 'About') },
    { k: 'records', t: L('기록', 'Records') }
  ];
  let curGuard = 'sound', recAsk = '', linkTick = 0, docShown = '';
  function drawGuardList() {
    $('#guardTitle').textContent = L('보호자', 'Grown-ups');
    $('#guardCloseT').textContent = L('닫기', 'Close');
    /* 항목 아이콘은 컬러 생성 그림(g_*) 대신 단색 선 기호(홈 UI 2판) */
    guardList.innerHTML = guardItems().map(i => `<button type="button" class="g-item${i.k === curGuard ? ' on' : ''}" data-k="${i.k}" aria-current="${i.k === curGuard}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${i.k === 'pass' ? '<use href="#i-ticket"/>' : GI[i.k]}</svg><span>${i.t}</span>${i.k === 'notice' ? noticeDotHTML() : ''}</button>`).join('');
  }
  function openGuard() {
    hint.hidden = true;
    curGuard = guardItems().some(i => i.k === curGuard) && curGuard !== 'names' ? curGuard : 'sound';   // 이름 바꾸기는 열 때마다 어른 확인
    delete guardBody.dataset.open;           // 1열일 때는 목록부터
    recAsk = ''; docShown = '';
    noticeOpen = ''; if (curGuard === 'notice' && notePaneShown()) noticeOpenFirst();
    drawGuardList(); drawGuardPane();
    showModal(guardEl, guardSheet, { gentle: true, focus: '#guardClose' });
    fetchNotices();   // 열 때마다 조용히 새로 받는다(실패하면 지난번 목록 그대로)
  }
  function closeGuard() {
    clearInterval(linkTick);
    hideModal(guardEl, guardSheet, sheetClosed);
  }
  const refreshGuard = () => { if (!guardEl.hidden && curGuard !== 'link' && curGuard !== 'names') drawGuardPane(); };
  $('#guardClose').addEventListener('click', closeGuard);
  guardList.addEventListener('click', e => {
    const b = e.target.closest('.g-item'); if (!b) return;
    paper('tap');
    const go = () => {
      curGuard = b.dataset.k; recAsk = ''; docShown = '';
      if (curGuard === 'notice') noticeOpenFirst();
      guardBody.dataset.open = '1';
      drawGuardList(); drawGuardPane();
      guardPane.scrollTop = 0;
      if (curGuard === 'names') { nm.view = 'list'; nm.form = null; nm.ask = ''; nm.msg = ''; nmLoad(); }
    };
    if (b.dataset.k === 'names') parentCheck('names', go); else go();
  });

  /* 설정 줄 72: 글자 왼쪽, 스위치 72×40 오른쪽(§7-8). 체크박스는 보이지 않게 두고 같은 change 처리 */
  const switchHTML = (key, on, label, desc) => `<label class="toggle"><span class="tg-t">${label}${desc ? `<small class="tg-d">${desc}</small>` : ''}</span><input type="checkbox" role="switch" data-opt="${key}"${on ? ' checked' : ''}><i class="sw" aria-hidden="true"></i></label>`;
  const chipRowHTML = row => `<section class="tagrow"><h4 class="row-tab">${row === 'origin' ? L('이야기 종류', 'Kind of tale') : L('배우는 것', 'What it teaches')}</h4><div class="chips" role="group" data-row="${row}">`
    + [{ key: '', label: L('전체', 'All'), ic: 'all' }, ...TAGS[row].map(t => ({ key: t.key, label: (lang === 'en' && t.en) || t.label, ic: t.key }))]
      .map(c => `<button type="button" class="chip${c.key ? '' : ' all'}" data-row="${row}" data-key="${c.key}" aria-label="${c.label}">${icon(c.ic)}<span class="lb" aria-hidden="true">${letters(c.label)}</span></button>`).join('') + '</div></section>';

  function passHTML() {
    const s = Entitlements.state(), names = ids => ids.length ? ids.map(title).join(', ') : L('없음', 'None');
    const wait = Entitlements.waitAvailable(), left = Entitlements.waitDaysLeft(), stars = Entitlements.starBalance(), need = Entitlements.STAR_NEED;
    const opened = [...new Set([...s.starUnlocked, ...s.waitUnlocked])];
    const waitTxt = wait ? L(`지금 ${wait}편을 열 수 있습니다.`, `You can open ${wait} now.`) : left ? L(`${left}일 뒤에 한 편을 열 수 있습니다.`, `One more can be opened in ${left} days.`) : L('기다무를 모두 썼습니다.', 'All waiting passes are used.');
    return `<h3>${L('이용권', 'Access')}</h3>
      <dl class="g-dl">
        <dt>${L('이번 주 무료', 'Free this week')}</dt><dd>${names(Entitlements.freeThisWeek())}<small>${L('월요일마다 바뀝니다.', 'Changes every Monday.')}</small></dd>
        <dt>${L('열어 둔 동화', 'Opened tales')}</dt><dd>${Entitlements.state().owned ? L('모든 동화가 열려 있습니다.', 'Every tale is open.') : names(opened)}</dd>
        <dt>${L('기다무', 'Waiting pass')}</dt><dd>${waitTxt}${wait ? `<button type="button" class="ticket alt" data-act="g-wait">${L('한 편 고르기', 'Pick a tale')}</button>` : ''}</dd>
        <dt>${L('별 조각', 'Star pieces')}</dt><dd>${Math.min(stars, 99)} / ${need}${stars >= need && Entitlements.lockedChoices().length ? `<button type="button" class="ticket alt" data-act="g-star">${L('한 편 고르기', 'Pick a tale')}</button>` : ''}</dd>
      </dl>
      <p class="how buy-msg" id="gMsg" hidden></p>
      <div class="g-btns">
        ${s.owned ? '' : `<button type="button" class="ticket alt" data-act="g-buy">${L(`모든 동화 열기 ${Entitlements.PRICE}`, `Unlock all ${Entitlements.PRICE}`)}</button>`}
        <button type="button" class="ticket alt" data-act="g-restore">${L('구매 복원', 'Restore purchase')}</button>
      </div>
      <p class="how">${L('고르기·결제·복원 앞에서는 어른 확인을 한 번 더 합니다.', 'A grown-up check comes before picking, buying or restoring.')}</p>`;
  }
  /* ── 우리 아이 이름 2판(docs/NAME_SETUP_V2_PLAN.md §2·§5-2, 확정 사항): 앱 모드 + 서버가 켜져 있을 때만. 보호자 화면 글은 소리로 읽지 않는다(녹음 없음) ──
     화면 셋: 동화 목록(nm.view='list') → 동화 한 편(아이 한 명) / 구름 공장(아이 셋 + 강아지). 동화마다 이름 + 주인공 모습(여자아이/남자아이).
     4.99 구매에 동화마다 첫 설정 1번, 그 뒤 1.99 아이 이름 변경권(2026-11-22 이름·가격 변경) 1장 = 네 편 한 번에 다시(목록의 '다시 바꾸기' 하나). 모습만 바꾸는 것도 설정 1번.
     이름·모습은 이 기기에만 두고 서버에 남기지 않는다. 1차 행동(감빛)은 화면당 하나.
     2026-11-22 A안: '모든 동화 열기'를 사지 않은 사람도 아이 이름 변경권(1.99)을 사서 쓴다(첫 설정 무료분이 없으므로 이용권 1장 = 네 편 한 번에). 소유자 흐름은 그대로 */
  const namesOn = () => { try { return isApp && typeof Names !== 'undefined' && Names.supported(); } catch (e) { return false; } };
  const nm = { q: null, loading: false, err: '', msg: '', view: 'list', form: null, ask: '', prevBusy: false, enOpen: false };
  const NM_ERR = {
    offline: ['서버에 닿지 않습니다. 인터넷을 확인하고 다시 해 주세요.', 'Cannot reach the server. Check your connection and try again.'],
    not_owned: ['아이 이름 변경권을 사면 쓸 수 있습니다.', 'Available with a Child Name Change Pass.'],
    no_credit: ['이 동화의 첫 설정을 이미 썼습니다. 다시 바꾸려면 아이 이름 변경권이 필요합니다.', 'This tale\'s first setup is used. Changing again needs a Child Name Change Pass.'],
    name_invalid: ['이름을 다시 확인해 주세요. 한글 1~4글자, 영어는 영문자만 쓸 수 있습니다.', 'Please check the names: 1–4 Korean letters; English letters only.'],
    look_invalid: ['주인공 모습을 다시 골라 주세요.', 'Please choose the look again.'],
    name_banned: ['다른 이름을 적어 주세요.', 'Please choose a different name.'],
    name_same: ['아이마다 다른 이름을 적어 주세요.', 'Please use a different name for each one.'],
    empty: ['이름을 적거나 주인공 모습을 바꿔 주세요.', 'Enter a name or change the look.'],
    need_agree: ['아래 동의에 먼저 체크해 주세요.', 'Please tick the agreement first.'],
    run_invalid: ['녹음 받을 시간(48시간)이 지났습니다. 지원 이메일(hello@ddoystory.com)로 알려 주세요.', 'The 48-hour recording window has passed. Please email hello@ddoystory.com.'],
    quota_exceeded: ['오늘은 더 만들 수 없습니다. 내일 다시 해 주세요.', 'The daily limit is reached. Please try again tomorrow.'],
    tts_failed: ['녹음을 만들지 못했습니다. 잠시 뒤 \'이어 받기\'를 눌러 주세요.', 'Recording failed. Please tap Continue a little later.'],
    busy: ['지금은 만들 수 없습니다. 나중에 다시 눌러 주세요.', 'Not available right now. Please try again later.'],
    save_failed: ['기기에 저장하지 못했습니다. 저장 공간을 확인해 주세요.', 'Could not save on this device. Please check free space.'],
    stopped: ['멈췄습니다. \'이어 받기\'로 이어서 받으세요.', 'Paused. Tap Continue to go on.'],
    cancelled: ['결제가 끝나지 않았습니다.', 'The purchase did not go through.'],
    no_store: ['이 기기에서는 결제할 수 없습니다.', 'Purchases are not available on this device.'],
    receipt_pending: ['결제는 됐지만 서버에 아직 닿지 않았습니다. 잠시 뒤 다시 열어 주세요.', 'Purchased, but the server has not confirmed yet. Please reopen in a moment.']
  };
  const nmErr = e => L(...(NM_ERR[e] || ['잘 되지 않았습니다. 다시 해 주세요.', 'Something went wrong. Please try again.']));
  const nmEsc = x => String(x == null ? '' : x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nmOrig = s => { const o = NameForm.ORIGINAL[s]; return { ko: o.ko, en: o.en }; };   // 이름 칸·'지금은'에는 맨 이름(다현), 부르는 꼴(다현이)은 쓰지 않는다
  const nmLookName = l => (l === 'b' ? L('남자아이', 'Boy') : L('여자아이', 'Girl'));
  const nmRole = s => ({ A: L('첫째', 'Eldest'), B: L('둘째', 'Middle'), C: L('막내(아기)', 'Youngest (baby)'), D: L('강아지', 'Dog') }[s]);
  const nmKids = t => (Names.TALE_SLOTS[t] || []).filter(s => Names.KIDS.includes(s));
  const nmEnShown = t => lang === 'en' || nm.enOpen || (Names.TALE_SLOTS[t] || []).some(s => nm.form && nm.form.names[s + '_en']);
  const nmIco = {
    chev: '<svg class="nm-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'
  };
  /* 지금 이용권 실행(48시간)이 살아 있는지 */
  const nmTicketRun = () => { const a = nm.q && nm.q.activeRun; return a && a.kind === 'ticket' && new Date(a.expiresAt).getTime() > Date.now() ? a : null; };
  const nmProg = t => Names.progress([t])[0] || { total: 0, got: 0, done: false, on: false };
  /* 동화 한 편의 상태: locked(미구매) · prog(받는 중·멈춤) · edit(첫 설정 남음 또는 이용권 실행 중) · done · need(첫 설정을 다 써서 이용권 필요) */
  function nmMode(t) {
    const q = nm.q, c = Names.tale(t), p = nmProg(t);
    if (!q) return 'locked';
    if (c.on && p.total && !p.done) return 'prog';
    if (nmTicketRun() || (!c.on && (q.firstLeft || []).includes(t))) return 'edit';
    return c.on ? 'done' : 'need';
  }
  function nmFormFor(t) {
    const c = Names.tale(t), slots = Names.TALE_SLOTS[t], names = {}, look = {};
    slots.forEach(s => { if (c.on && c.names[s]) names[s] = c.names[s]; if (c.on && c.names[s + '_en']) names[s + '_en'] = c.names[s + '_en']; });
    nmKids(t).forEach(s => { look[s] = Names.look(t, s); });
    return { tale: t, names, look };
  }
  async function nmLoad() {
    if (nm.loading) return;
    nm.loading = true; nm.err = ''; if (curGuard === 'names') drawGuardPane();
    const [c, q] = await Promise.all([Names.fetchCatalog(), Names.quota()]);
    nm.loading = false;
    if (!c.ok || !q.ok) nm.err = (!q.ok ? q.error : c.error) || 'offline';
    else nm.q = q.data;
    if (curGuard === 'names' && !guardEl.hidden) drawGuardPane();
  }
  const nmLoadQuiet = async () => { const q = await Names.quota(); if (q.ok) nm.q = q.data; if (curGuard === 'names' && !guardEl.hidden) drawGuardPane(); };
  /* 이름 칸이 맞는지(앱 쪽 검사). 서버도 /name/check 로 다시 본다 */
  function nmValidate(f) {
    if (!f) return 'empty';
    const slots = Names.TALE_SLOTS[f.tale] || [], ko = [];
    for (const s of slots) {
      const k = (f.names[s] || '').trim(), e = (f.names[s + '_en'] || '').trim();
      if (k && !NameForm.valid(k, 'ko')) return 'name_invalid';
      if (e && !NameForm.valid(e, 'en')) return 'name_invalid';
      if (k) { if (ko.includes(k)) return 'name_same'; ko.push(k); }
    }
    const anyName = slots.some(s => (f.names[s] || '').trim() || (f.names[s + '_en'] || '').trim());
    const lookChanged = nmKids(f.tale).some(s => f.look[s] && f.look[s] !== NameForm.ORIGINAL_LOOK[s]);
    return anyName || lookChanged ? '' : 'empty';
  }
  const nmArt = (t, s, lk) => { const a = Names.previewArt(t, s, lk); return a ? `assets/v3w/${a.id}.webp` : ''; };   // 반대 모습 그림이 아직 없으면(a.pending) 원래 그림 — TODO(G2·G3): 그림이 들어오면 Names.LOOK_ART 에 동화를 넣는다
  /* 목록 카드의 상태 한 줄 */
  function nmCardState(t) {
    const m = nmMode(t), c = Names.tale(t), p = nmProg(t), fam = t === 'kkultteok';
    const nameOf = s => nmEsc(c.on && c.names[s] ? c.names[s] : nmOrig(s).ko);
    const who = fam ? (c.on ? `<b>${['A', 'B', 'C'].map(nameOf).join(' · ')}</b> · ${L('강아지', 'dog')} ${nameOf('D')}` : L(`아이 셋 · 강아지 ${nmOrig('D').ko}`, `Three kids · dog ${nmOrig('D').en}`))
      : (() => { const s = nmKids(t)[0]; return c.on ? `<b>${nameOf(s)}</b> · ${nmLookName(Names.look(t, s))}` : `${L('주인공', 'Hero')} ${nameOf(s)} · ${nmLookName(NameForm.ORIGINAL_LOOK[s])}`; })();
    let tag;
    if (m === 'locked') tag = `<span class="nm-tag">${L('잠김', 'Locked')}</span>`;
    else if (m === 'prog') tag = `<span class="nm-tag">${Names.busy() ? L('녹음 중', 'Recording') : L('멈춤', 'Paused')} ${p.got} / ${p.total}</span>`;
    else if (c.on) tag = `<span class="nm-tag done">${L('완료', 'Done')}</span>`;
    else tag = `<span class="nm-tag todo">${L('아직', 'Not yet')}</span>`;
    return tag + who;
  }
  function nmListHTML(name) {
    const q = nm.q, owned = !!(q && q.owned && Entitlements.owned()), run = nmTicketRun();
    let h = `<h3>${name}</h3><p class="how nm-lead">${L('동화마다 주인공의 이름과 모습을 우리 아이로 바꿉니다. 바꾸고 싶은 동화를 눌러 주세요.', 'Make each tale\'s hero your child — name and look. Tap a tale to change it.')}</p>`;
    if (!q && !nm.err) return h + `<p class="how">${L('불러오는 중…', 'Loading…')}</p>`;
    if (nm.err && !q) return h + `<p class="how buy-msg">${nmErr(nm.err)}</p><div class="g-btns"><button type="button" class="ticket alt" data-act="nm-reload">${L('다시 불러오기', 'Reload')}</button></div>`;
    h += `<div class="nm-tales">` + Names.TALES.filter(t => TALES.some(x => x.id === t)).map(t => `<button type="button" class="nm-card" data-act="nm-open" data-tale="${t}">
        <img src="assets/thumbs/${t}_tile.webp" alt="" draggable="false"><span class="nm-ct"><span class="nm-t">${nmEsc(title(t))}</span><span class="nm-s">${nmCardState(t)}</span></span>${nmIco.chev}</button>`).join('') + `</div>`;
    h += nm.msg ? `<p class="how buy-msg" id="nmMsg">${nmEsc(nm.msg)}</p>` : '';
    const left = (q.firstLeft || []).length, used = (q.first || []).length, tk = +q.tickets || 0;
    let foot = '';
    if (run && !owned) foot = L(`이름 바꾸는 중 · 네 편 모두 · 남은 시간 ${Math.max(1, Math.ceil((new Date(run.expiresAt).getTime() - Date.now()) / 3600000))}시간`, `Changing names · all four tales · ${Math.max(1, Math.ceil((new Date(run.expiresAt).getTime() - Date.now()) / 3600000))} h left`);
    else if (run) foot = L(`다시 바꾸는 중 · 네 편 모두 · 남은 시간 ${Math.max(1, Math.ceil((new Date(run.expiresAt).getTime() - Date.now()) / 3600000))}시간`, `Changing again · all four tales · ${Math.max(1, Math.ceil((new Date(run.expiresAt).getTime() - Date.now()) / 3600000))} h left`);
    else if (!owned) foot = L(`아이 이름 변경권 한 장(${Entitlements.RENAME_PRICE})으로 48시간 동안 네 편을 모두 정합니다.${tk ? ` 남은 변경권 ${tk}장.` : ''}`, `One Child Name Change Pass (${Entitlements.RENAME_PRICE}) sets all four tales within 48 hours.${tk ? ` Passes left: ${tk}.` : ''}`);
    else if (used || tk) foot = L(`아이 이름 변경권 ${tk}장 · 한 장으로 네 편 모두`, `Child Name Change Passes: ${tk} · one pass covers all four tales`);
    h += nmAskTicket();
    if (!run && (used || tk || !owned) && nm.ask !== 'ticket') h += `<div class="g-btns nm-again">${nmAgainBtn()}</div>`;
    h += `<p class="nm-foot">${foot ? `<b>${foot}</b><br>` : ''}${left ? L('동화마다 첫 설정 한 번은 \'모든 동화 열기\'에 들어 있습니다. ', 'The first setup of each tale comes with Unlock all tales. ') : ''}${!owned ? L('\'모든 동화 열기\'를 사면 동화마다 첫 설정 한 번이 들어 있습니다. ', 'Unlock all tales includes one first setup for each tale. ') : ''}${L('이름은 녹음을 만들 때만 보내고 서버에 남기지 않습니다.', 'Names are sent only to make the recordings and are not kept on the server.')}</p>`;
    return h;
  }
  const nmOwned = () => !!(nm.q && nm.q.owned && Entitlements.owned());
  const nmAgainBtn = () => { const tk = +(nm.q && nm.q.tickets) || 0; if (!nmOwned()) return `<button type="button" class="ticket alt" data-act="nm-again">${tk ? L('이름 정하기 (변경권 1장 씀)', 'Set names (use 1 pass)') : L(`이름 정하기 (변경권 ${Entitlements.RENAME_PRICE})`, `Set names (pass ${Entitlements.RENAME_PRICE})`)}</button>`; return `<button type="button" class="ticket alt" data-act="nm-again">${tk ? L('다시 바꾸기 (변경권 1장 씀)', 'Change again (use 1 pass)') : L(`다시 바꾸기 (변경권 ${Entitlements.RENAME_PRICE})`, `Change again (pass ${Entitlements.RENAME_PRICE})`)}</button>`; };
  const nmAskTicket = () => nm.ask === 'ticket' ? `<div class="g-ask"><p class="how">${!nmOwned() ? L('변경권 한 장으로 48시간 동안 네 편의 이름과 모습을 모두 정할 수 있습니다. 지금 쓰시겠습니까?', 'One pass lets you set names and looks for all four tales for 48 hours. Use it now?') : L('변경권 한 장으로 48시간 동안 네 편을 모두 다시 바꿀 수 있습니다. 지금 쓰시겠습니까?', 'One pass lets you change all four tales again for 48 hours. Use it now?')}</p><div class="g-btns"><button type="button" class="ticket alt" data-act="nm-no">${L('그만두기', 'Cancel')}</button><button type="button" class="ticket pri" data-act="nm-ticket">${L('변경권 쓰기', 'Use pass')}</button></div></div>` : '';
  /* 동화 화면 공통: 들어 보기 · 동의 · 1차 행동(또는 진행·완료) */
  function nmPrevLabel(t) {
    if (nm.prevBusy) return L('들려주는 중…', 'Playing…');
    if (t === 'kkultteok') return L('네 이름 들어 보기', 'Hear all four names');
    const lg = !nm.form.names[nmKids(t)[0]] && nm.form.names[nmKids(t)[0] + '_en'] ? 'en' : 'ko';
    const x = Names.previewText(t, nm.form, lg);
    return x ? L(`“${nmEsc(x)}” 들어 보기`, `Hear “${nmEsc(x)}”`) : L('들어 보기', 'Listen');
  }
  const nmPrevOff = t => nm.prevBusy || !Names.agree() || !(Names.TALE_SLOTS[t] || []).some(s => nm.form.names[s] || nm.form.names[s + '_en']) || !!nmValidate(nm.form) && nmValidate(nm.form) !== 'empty';
  const nmAgreeHTML = (extra = '') => `<label class="nm-agree"><input type="checkbox" data-opt="nm-agree"${Names.agree() ? ' checked' : ''}><i aria-hidden="true"></i><span>${L('보호자인 제가 적은 이름을 녹음을 만드는 데만 쓰는 것에 동의합니다. 저장하지 않습니다.', 'As the parent, I let these names be used only to make the recordings. They are not stored.')}${extra}</span></label>`;
  function nmActions(t, m) {
    const c = Names.tale(t), p = nmProg(t), run = nmTicketRun();
    if (m === 'prog') {
      const live = Names.busy();
      return `<div class="nm-actions">${live ? `<button type="button" class="ticket alt" data-act="nm-stop">${L('멈추기', 'Pause')}</button>`
        : `<button type="button" class="ticket pri" data-act="nm-resume">${L('이어 받기', 'Continue')}</button>`}<small>${live ? L('앱을 켠 채로 기다려 주세요. 다 받으면 이 동화부터 새 이름으로 나옵니다.', 'Keep the app open. The tale switches once everything is in.') : L('다 받기 전에는 원래 녹음으로 나옵니다.', 'Until finished, the tale plays the original recordings.')}</small></div>`;
    }
    if (m === 'done' || m === 'need') {
      return `<div class="nm-actions">${m === 'done' ? `<span class="nm-tag done big">${L('완료', 'Done')}</span>` : ''}${nm.ask === 'ticket' ? '' : nmAgainBtn()}</div>${nmAskTicket()}
        ${m === 'need' && !nmOwned() ? `<p class="how nm-note">${L(`아이 이름 변경권 한 장(${Entitlements.RENAME_PRICE})으로 네 편의 이름과 모습을 모두 정할 수 있습니다. '모든 동화 열기'를 사면 동화마다 첫 설정 한 번이 들어 있습니다.`, `One Child Name Change Pass (${Entitlements.RENAME_PRICE}) sets names and looks for all four tales. Unlock all tales includes one first setup for each tale.`)}</p>` : ''}
        ${m === 'need' && nmOwned() ? `<p class="how nm-note">${L('이 동화의 첫 설정은 이미 썼습니다. 아이 이름 변경권 한 장으로 네 편을 모두 다시 바꿀 수 있습니다.', 'This tale\'s first setup is used. One Child Name Change Pass changes all four tales again.')}</p>` : ''}`;
    }
    const err = nmValidate(nm.form);
    if (nm.ask === 'make') return `<div class="g-ask"><p class="how">${run ? L('이 이름과 모습으로 새로 녹음하시겠습니까? 변경권 실행(48시간) 안에서 만듭니다.', 'Record with this name and look? It is made within the pass window (48 h).') : L(`이 이름과 모습으로 완성하시겠습니까? 다시 바꾸려면 아이 이름 변경권(${Entitlements.RENAME_PRICE})이 필요합니다.`, `Finish with this name and look? Changing again needs a Child Name Change Pass (${Entitlements.RENAME_PRICE}).`)}</p><div class="g-btns"><button type="button" class="ticket alt" data-act="nm-no">${L('그만두기', 'Cancel')}</button><button type="button" class="ticket pri" data-act="nm-go">${L('완성하기', 'Finish')}</button></div></div>`;
    return `<div class="nm-actions"><button type="button" class="ticket pri" data-act="nm-make"${!Names.agree() || err ? ' disabled' : ''}>${L('이렇게 완성', 'Finish')}</button><small>${run ? L('변경권 실행 중 · 네 편 모두 다시 바꿀 수 있습니다', 'Pass active · all four tales can change') : L(`이 동화의 첫 설정은 모든 동화 열기에 포함 · 다시 바꾸기는 ${Entitlements.RENAME_PRICE}`, `First setup included · changing again is ${Entitlements.RENAME_PRICE}`)}</small></div>`;
  }
  const nmSegHTML = (t, s, lk, dis) => `<div class="nm-seg" role="group" aria-label="${L('주인공 모습', 'Hero look')}">${['g', 'b'].map(v => `<button type="button" data-act="nm-look" data-slot="${s}" data-look="${v}" class="${lk === v ? 'on' : ''}" aria-pressed="${lk === v}"${dis ? ' disabled' : ''}>${nmLookName(v)}</button>`).join('')}</div>`;
  const nmInput = (s, dis, en) => { const o = nmOrig(s), v = nm.form.names[en ? s + '_en' : s] || ''; return en
    ? `<input class="nm-in en" data-slot="${s}_en" type="text" maxlength="12" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="${nmEsc(o.en)} (${L('영어, 선택', 'English, optional')})" aria-label="${L('영어 이름', 'English name')} — ${nmEsc(o.en)}" value="${nmEsc(v)}"${dis ? ' disabled' : ''}>`
    : `<input class="nm-in" id="nm_${s}" data-slot="${s}" type="text" maxlength="4" autocomplete="off" spellcheck="false" placeholder="${L('한글 이름', 'Korean name')}" aria-label="${nmEsc(nmRole(s) || '')} ${L('이름', 'name')} — ${L('지금은', 'now')} ${nmEsc(o.ko)}" value="${nmEsc(v)}"${dis ? ' disabled' : ''}>`; };
  function nmProgHTML(t) {
    const p = nmProg(t), pc = p.total ? Math.round(100 * p.got / p.total) : 0;
    return `<div class="nm-prog"><span class="nm-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${p.total}" aria-valuenow="${p.got}"><i style="width:${pc}%"></i></span><span class="nm-n">${Names.busy() ? L('녹음 받는 중', 'Recording') : L('멈춤', 'Paused')} ${p.got} / ${p.total}</span></div>`;
  }
  function nmTaleHTML(t) {
    const m = nmMode(t), dis = m !== 'edit', s = nmKids(t)[0], lk = nm.form.look[s] || NameForm.ORIGINAL_LOOK[s], o = nmOrig(s), c = Names.tale(t);
    const err = Names.tale(t).err;
    return `<button type="button" class="nm-back" data-act="nm-list">${nmIco.back}${L('우리 아이 이름', 'Child\'s name')}</button><h3>${nmEsc(title(t))}</h3>
      <div class="nm-set">
        <div class="nm-look"><span class="nm-lb">${L('주인공 모습', 'Hero look')}</span>
          <div class="nm-pv"><img src="${nmArt(t, s, lk)}" alt="${nmLookName(lk)}" draggable="false">${m === 'prog' ? nmProgHTML(t) : ''}</div>
          ${nmSegHTML(t, s, lk, dis)}</div>
        <div class="nm-form">
          <div><label class="nm-lbl" for="nm_${s}">${L(`주인공 이름 (지금은 ${o.ko})`, `Hero's name (now ${o.en})`)}</label>
            <div class="nm-row2${nmEnShown(t) ? '' : ' one'}">${nmInput(s, dis)}${nmEnShown(t) ? nmInput(s, dis, true) : ''}</div></div>
          ${dis ? '' : `<div><button type="button" class="ticket alt nm-pbtn" data-act="nm-prev"${nmPrevOff(t) ? ' disabled' : ''}>${nmIco.play}<span>${nmPrevLabel(t)}</span></button></div>${nmAgreeHTML()}`}
          ${nm.msg ? `<p class="how buy-msg" id="nmMsg">${nmEsc(nm.msg)}</p>` : m === 'prog' && err ? `<p class="how buy-msg">${nmErr(err)}</p>` : ''}
          ${nmActions(t, m)}
        </div>
      </div>
      ${c.on && m !== 'edit' ? switchHTML('nm-orig', c.original, L('원래 이름·모습으로 듣기', 'Play with the original name and look'), L('받은 녹음은 지우지 않고, 원래 녹음으로 들려줍니다.', 'Keeps the new recordings and plays the original ones.')) : ''}`;
  }
  function nmFamilyHTML(t) {
    const m = nmMode(t), dis = m !== 'edit', c = Names.tale(t), en = nmEnShown(t), err = c.err;
    const kid = s => { const lk = nm.form.look[s] || NameForm.ORIGINAL_LOOK[s]; return `<div class="nm-kid"><div class="nm-hd"><span class="nm-av"><img src="${nmArt(t, s, lk)}" alt="" draggable="false"></span><span class="nm-who">${nmRole(s)}<small>${L(`지금은 ${nmOrig(s).ko}`, `Now ${nmOrig(s).en}`)}</small></span></div>
        ${nmSegHTML(t, s, lk, dis)}${nmInput(s, dis)}${en ? nmInput(s, dis, true) : ''}</div>`; };
    return `<button type="button" class="nm-back" data-act="nm-list">${nmIco.back}${L('우리 아이 이름', 'Child\'s name')}</button><h3>${nmEsc(title(t))}</h3>
      ${m === 'prog' ? nmProgHTML(t) : ''}
      <div class="nm-kids">${['A', 'B', 'C'].map(kid).join('')}</div>
      <div class="nm-dog"><span class="nm-av"><img src="${nmArt(t, 'D')}" alt="" draggable="false"></span><span class="nm-who">${nmRole('D')}<small>${L(`지금은 ${nmOrig('D').ko}`, `Now ${nmOrig('D').en}`)}</small></span>
        <span class="nm-dogin">${nmInput('D', dis)}${en ? nmInput('D', dis, true) : ''}</span>
        ${dis ? '' : `<button type="button" class="ticket alt nm-pbtn" data-act="nm-prev"${nmPrevOff(t) ? ' disabled' : ''}>${nmIco.play}<span>${nmPrevLabel(t)}</span></button>`}</div>
      ${nm.msg ? `<p class="how buy-msg" id="nmMsg">${nmEsc(nm.msg)}</p>` : m === 'prog' && err ? `<p class="how buy-msg">${nmErr(err)}</p>` : ''}
      <div class="nm-barrow">${dis ? '' : nmAgreeHTML(en || lang === 'en' ? '' : ` · <button type="button" class="nm-link" data-act="nm-en">${L('영어 이름 적기', 'Add English names')}</button>`)}${nmActions(t, m)}</div>
      ${c.on && m !== 'edit' ? switchHTML('nm-orig', c.original, L('원래 이름·모습으로 듣기', 'Play with the original names and looks'), L('받은 녹음은 지우지 않고, 원래 녹음으로 들려줍니다.', 'Keeps the new recordings and plays the original ones.')) : ''}`;
  }
  function namesHTML(name) {
    const t = nm.view;
    if (t === 'list' || !nm.q || !Names.TALES.includes(t)) { nm.view = 'list'; return `<div class="nm nm-list">${nmListHTML(name)}</div>`; }
    if (!nm.form || nm.form.tale !== t) nm.form = nmFormFor(t);
    return `<div class="nm nm-one${t === 'kkultteok' ? ' fam' : ''}">${t === 'kkultteok' ? nmFamilyHTML(t) : nmTaleHTML(t)}</div>`;
  }
  /* 칸 입력: 그리지 않고 값만 기억(포커스 유지). 단추 활성과 들어 보기 글만 고친다 */
  guardPane.addEventListener('input', e => {
    const s = e.target.dataset && e.target.dataset.slot; if (!s || !e.target.classList.contains('nm-in') || !nm.form) return;
    nm.form.names[s] = e.target.value.trim();
    const t = nm.form.tale, mk = guardPane.querySelector('[data-act="nm-make"]'); if (mk) mk.disabled = !Names.agree() || !!nmValidate(nm.form);
    const pb = guardPane.querySelector('[data-act="nm-prev"]'); if (pb) { pb.disabled = nmPrevOff(t); const sp = pb.querySelector('span'); if (sp) sp.innerHTML = nmPrevLabel(t); }
  });
  if (typeof Names !== 'undefined') Names.onChange(() => { if (curGuard === 'names' && !guardEl.hidden && !nm.ask && !guardPane.querySelector('.nm-in:focus')) drawGuardPane(); });
  /* 이용권 쓰기 → (이 동화 화면이면) 바로 편집 상태 */
  async function nmUseTicket() {
    const r = await Names.useTicket();
    nm.ask = '';
    if (!r.ok) { nm.msg = nmErr(r.error); drawGuardPane(); return; }
    nm.msg = nmOwned() ? L('48시간 동안 네 편을 모두 다시 바꿀 수 있습니다.', 'For 48 hours, all four tales can be changed again.') : L('48시간 동안 네 편의 이름과 모습을 모두 정할 수 있습니다.', 'For 48 hours, names and looks can be set for all four tales.');
    nm.form = null;
    await nmLoadQuiet();
  }
  async function nmAct(act, b) {
    nm.msg = '';
    if (act === 'nm-reload') { nmLoad(); return; }
    if (act === 'nm-open') { paper('tap'); nm.view = b.dataset.tale; nm.form = null; nm.ask = ''; nm.enOpen = false; drawGuardPane(); guardPane.scrollTop = 0; return; }
    if (act === 'nm-list') { paper('down'); nm.view = 'list'; nm.form = null; nm.ask = ''; drawGuardPane(); guardPane.scrollTop = 0; return; }
    if (act === 'nm-no') { paper('down'); nm.ask = ''; drawGuardPane(); return; }
    if (act === 'nm-en') { paper('tap'); nm.enOpen = true; drawGuardPane(); return; }
    if (act === 'nm-stop') { Names.stop(); return; }
    if (act === 'nm-look') { if (!nm.form) return; paper('tap'); nm.form.look[b.dataset.slot] = b.dataset.look; drawGuardPane(); return; }
    if (act === 'nm-make') { const e = nmValidate(nm.form); if (e) { nm.msg = nmErr(e); drawGuardPane(); return; } if (!Names.agree()) { nm.msg = nmErr('need_agree'); drawGuardPane(); return; } paper('tap'); nm.ask = 'make'; drawGuardPane(); return; }
    if (act === 'nm-again') {
      paper('tap');
      if (+(nm.q && nm.q.tickets) > 0) { nm.ask = 'ticket'; drawGuardPane(); return; }
      parentCheck('buy', async () => {   // 이용권 0장: 결제(어른 확인) → 바로 이용권 실행 → 편집
        const r = await Entitlements.purchaseRename();
        if (!r.ok) { nm.msg = nmErr(r.error); drawGuardPane(); return; }
        await nmLoadQuiet(); await nmUseTicket();
      });
      return;
    }
    if (act === 'nm-ticket') { paper('tap'); await nmUseTicket(); return; }
    if (act === 'nm-prev') {
      const t = nm.form.tale, s0 = Names.TALE_SLOTS[t][0], lg = !nm.form.names[s0] && nm.form.names[s0 + '_en'] ? 'en' : 'ko';
      paper('tap'); nm.prevBusy = true; drawGuardPane();
      const r = await Names.preview(t, nm.form, lg);
      nm.prevBusy = false;
      if (!r.ok) nm.msg = nmErr(r.error);
      nmLoadQuiet();
      return;
    }
    if (act === 'nm-go') {
      paper('tap'); nm.ask = '';
      const t = nm.form.tale, p = Names.start(t, nm.form);
      drawGuardPane();
      const r = await p;
      nm.form = null;
      if (!r.ok) nm.msg = nmErr(r.error);
      else nm.msg = L('새 녹음이 다 준비됐습니다.', 'All new recordings are ready.');
      render({ anim: false });
      nmLoadQuiet();
      return;
    }
    if (act === 'nm-resume') {
      paper('tap');
      const p = Names.resume(); drawGuardPane();
      const r = await p;
      nm.msg = r.ok ? L('새 녹음이 다 준비됐습니다.', 'All new recordings are ready.') : nmErr(r.error);
      render({ anim: false }); nmLoadQuiet();
    }
  }
  function drawGuardPane() {
    clearInterval(linkTick);
    const k = curGuard, back = `<button type="button" class="g-pback" data-act="g-back">${backIc()}${L('보호자', 'Grown-ups')}</button>`;
    const name = (guardItems().find(i => i.k === k) || {}).t || '';
    let h = '';
    if (k === 'sound') {
      h = `<h3>${name}</h3>
        <p class="how">${L('탭 이름과 안내는 늘 소리로 읽어 줍니다. 아이가 아직 글을 읽지 못하기 때문입니다.', 'Tab names and guidance are always read aloud, since young children cannot read yet.')}</p>
        ${switchHTML('titlevoice', !titleVoiceOff(), L('동화 그림을 누르면 제목과 테마 소리 들려주기', 'Play the title and theme sound when a tale picture is tapped'))}
        ${switchHTML('caption', !captionsOff(), L('동화 속 글 상자(대사 자막) 보여 주기', 'Show story captions (speech text box)'))}`;
    } else if (k === 'time') {
      h = `<h3>${name}</h3>
        <div class="seg" id="timerOpts" role="group" aria-label="${name}">${TIMES.map(m => `<button type="button" class="${m === limitNow() ? 'on' : ''}" data-m="${m}" aria-pressed="${m === limitNow()}">${m ? m + L('분', ' min') : L('끄기', 'Off')}</button>`).join('')}</div>
        <p class="how">${L('하루 기준입니다. 시간이 되면 소리 없이 조용한 쉬는 화면이 나옵니다. 놀이 시간은 화면을 보는 시간이라서, 잠자리 읽어 주기는 끝난 뒤에 적용됩니다.', 'Counted per day. When time is up, a quiet rest screen appears — no alarm. It counts screen time, so Bedtime read-aloud finishes first.')}</p>`;
    } else if (k === 'lang') {
      h = `<h3>${name}</h3>
        <div class="seg" role="group" aria-label="${name}"><button type="button" class="${lang === 'ko' ? 'on' : ''}" data-lang="ko" aria-pressed="${lang === 'ko'}">한국어</button><button type="button" class="${lang === 'en' ? 'on' : ''}" data-lang="en" aria-pressed="${lang === 'en'}">English</button></div>
        <p class="how">${L('바꾸면 글, 목소리, 동화 순서가 바뀝니다. 영어 자료가 없는 동화는 한국어로 나옵니다.', 'Text, voices and tale order change. Tales without English material appear in Korean.')}</p>`;
    } else if (k === 'find') {
      const list = TALES.filter(match);
      h = `<h3>${name}</h3>
        <p class="how">${L('위 줄에서 <b>이야기 종류</b>, 아래 줄에서 <b>배우는 것</b>을 고르면 동화 탭에 그 동화만 나옵니다. 같은 줄에서 여러 개를 고르면 <b>하나라도</b> 맞는 이야기, 두 줄을 함께 고르면 <b>둘 다</b> 맞는 이야기가 나옵니다. 공주 동화는 다른 종류와 겹쳐서 나옵니다.', 'Pick a kind of tale and/or what it teaches, and only those tales show in the Tales tab. Several picks in one row match <b>any</b>; picks in both rows must match <b>both</b>.')}</p>
        ${chipRowHTML('origin')}${chipRowHTML('skill')}
        <div class="g-btns"><button type="button" class="ticket alt" data-act="g-clear">${L('필터 지우기', 'Clear filters')}</button></div>
        <h4 class="row-tab">${L(`동화 ${list.length}편`, `${list.length} tales`)}</h4>
        <ul class="g-tales">${list.map(t0 => { const t = shown(t0); return `<li><b>${t.title}</b><span>${t.line}</span></li>`; }).join('')}</ul>`;
    } else if (k === 'pass') {
      h = passHTML();
    } else if (k === 'names') {
      h = namesHTML(name);
    } else if (k === 'link') {
      const off = navigator.onLine === false;
      h = `<h3>${name}</h3>
        <p class="how">${L('다른 기기에서도 같은 기록을 쓰려면, 한 기기에서 코드를 만들고 다른 기기에 넣으세요. 코드는 10분 동안, 한 번만 쓸 수 있습니다.', 'To share progress on another device, make a code on one device and enter it on the other. A code works once, for 10 minutes.')}</p>
        <div class="link-two"><button type="button" class="ticket alt" data-act="lk-make"${off ? ' disabled' : ''}>${L('이 기기에서 코드 만들기', 'Make a code here')}</button><button type="button" class="ticket alt" data-act="lk-in"${off ? ' disabled' : ''}>${L('다른 기기의 코드 넣기', 'Enter a code')}</button></div>
        ${off ? `<p class="how buy-msg">${L('인터넷 연결이 필요합니다.', 'An internet connection is needed.')}</p>` : ''}
        <div id="lkView"></div>`;
    } else if (k === 'notice') {
      h = noticeHTML(name);
    } else if (k === 'about') {
      h = `<h3>${name}</h3>
        <dl class="g-dl"><dt>${L('버전', 'Version')}</dt><dd>${APP_VERSION}</dd>
        ${deviceNoRow()}
        <dt>${L('문의', 'Contact')}</dt><dd style="user-select:text;-webkit-user-select:text">${FEEDBACK_TO}</dd></dl>
        <div class="g-btns"><button type="button" class="ticket alt" data-act="mail">${L('의견 보내기', 'Send feedback')}</button></div>
        <p class="how g-note-how">${L('어른 확인 뒤 메일 앱이 열립니다. 앱 버전과 기기 종류가 미리 적혀 있습니다. 열리지 않으면 위 주소로 보내 주세요.', 'After a grown-up check, your mail app opens with the app version and device type filled in. If it does not open, write to the address above.')}</p>
        <div class="g-btns"><button type="button" class="ticket alt" data-act="intro-again">${L('처음 안내 다시 보기', 'See the welcome guide again')}</button><button type="button" class="ticket alt" data-act="doc-privacy">${L('개인정보 처리방침', 'Privacy policy')}</button><button type="button" class="ticket alt" data-act="doc-credits">${L('그림·소리 출처', 'Credits')}</button></div>
        <div id="docView"></div>`;
    } else if (k === 'records') {
      const ask = { progress: L('동화 진행 기록(마지막 본 동화, 오늘 놀이 시간)을 지우시겠습니까?', 'Erase play progress (last tale, today\'s play time)?'), all1: L('이 기기의 종이별·스티커·열어 둔 동화·기기 연결을 모두 초기화하시겠습니까?', 'Reset Paper Stars, stickers, opened tales and device link on this device?'), all2: L('마지막 확인입니다. 되돌릴 수 없습니다. (구매는 \'구매 복원\'으로 다시 받을 수 있습니다.)', 'Last check. This cannot be undone. (A purchase can be restored with Restore purchase.)') };
      h = `<h3>${name}</h3>
        <div class="g-btns"><button type="button" class="ticket alt danger" data-act="rec-progress">${L('동화 진행 기록 지우기', 'Erase play progress')}</button><button type="button" class="ticket alt danger" data-act="rec-all">${L('이 기기의 종이별·기록 초기화', 'Reset stars & records on this device')}</button></div>
        ${recAsk ? `<div class="g-ask"><p class="how">${ask[recAsk]}</p><div class="g-btns"><button type="button" class="ticket alt" data-act="rec-no">${L('그만두기', 'Cancel')}</button><button type="button" class="ticket" data-act="rec-yes">${recAsk === 'all1' ? L('다음', 'Next') : L('지우기', 'Erase')}</button></div></div>` : ''}`;
    }
    guardPane.innerHTML = (k === 'names' ? '' : back) + h;   // 우리 아이 이름: 목록·동화 화면에 자기 뒤로 가기가 있어 '보호자' 단추를 두지 않는다(§6 휴대폰)
    if (k === 'find') paintChips();
  }
  /* 기기 번호(서버 계정 앞 8자리). 서버를 안 쓰거나 계정이 없으면 줄을 숨긴다. 글자로만 보이고 읽지 않는다 */
  function deviceNoRow() {
    let n = null;
    try { n = typeof Entitlements !== 'undefined' && Entitlements.syncEnabled() && Entitlements.deviceNo ? Entitlements.deviceNo() : null; } catch (e) { n = null; }
    if (!n) return '';
    return `<dt>${L('기기 번호', 'Device number')}</dt><dd style="user-select:text;-webkit-user-select:text">${n}</dd>`;
  }
  /* 기록 지우기 (동화 쪽 키·Entitlements 의 저장 키) */
  function eraseRecords(all) {
    const keys = ['paperTheater.last', 'play_used', 'play_bonus'];
    if (all) keys.push('sync_state', 'sync_dirty', 'sync_receipt', 'sync_account', 'owned_all');
    try { keys.forEach(k => localStorage.removeItem(k)); } catch (e) { /* 저장소가 없으면 지울 것도 없다 */ }
    if (all) { closeGuard(); setTimeout(() => location.reload(), 250); }
    else { recAsk = ''; drawGuardPane(); toast(L('지웠습니다.', 'Erased.')); }
  }
  async function doPurchase(msgEl) {
    if (busyBuy) return;
    busyBuy = true; paper('tap');
    let ok = false;
    try { ok = await Entitlements.purchase(); } catch (err) { ok = false; }
    afterBuy(ok, msgEl, '결제가 끝나지 않았습니다. 다시 해 주세요.', 'The purchase did not go through. Please try again.');
  }
  async function doRestore(msgEl) {
    if (busyBuy) return;
    busyBuy = true; paper('tap');
    let ok = false;
    try { ok = await Entitlements.restore(); } catch (err) { ok = false; }
    afterBuy(ok, msgEl, '복원할 구매를 찾지 못했습니다.', 'No purchase was found to restore.');
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
    if (o === 'nm-agree') { Names.setAgree(e.target.checked); paper('tap'); drawGuardPane(); return; }
    if (o === 'nm-orig') { Names.setOriginal(nm.view, e.target.checked); paper('tap'); render({ anim: false }); return; }
    if (o === 'caption') setFlag('captions_off', !e.target.checked);
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
    if (act.startsWith('nm-')) { nmAct(act, b); return; }
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
    else if (act === 'mail') parentCheck('mail', () => sendFeedback());
    else if (act === 'nt-open') { paper('tap'); const id = b.dataset.id; noticeOpen = noticeOpen === id ? '' : id; if (noticeOpen) noticeMarkSeen(id); drawGuardPane(); const nb = guardPane.querySelector(`[data-act="nt-open"][data-id="${CSS.escape(id)}"]`); if (nb) nb.focus({ preventScroll: true }); }
    else if (act === 'intro-again') { paper('tap'); openIntro(); }   // 보호자 메뉴 위에 뜨고, 닫으면 보호자 메뉴로 돌아온다
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
    /* 출처는 짧게(사용자 결정 2026-11-07). 자세한 표는 저장소의 sounds/CREDITS.md 에 기록으로 남긴다 */
    const lines = [
      ['그림: 이 앱을 위해 새로 만든 그림입니다(OpenAI 이미지 생성).', 'Art: made for this app (OpenAI image generation).'],
      ['목소리: ElevenLabs·Typecast 로 녹음했습니다.', 'Voices: recorded with ElevenLabs and Typecast.'],
      ['소리·음악: ElevenLabs(유료 요금제)로 만든 배경 음악·효과음과, Pixabay, Kenney(CC0), Wikimedia Commons(퍼블릭 도메인) 녹음을 다듬어 썼습니다.', 'Sounds and music: background music and sound effects made with ElevenLabs (paid plan), plus edited Pixabay, Kenney (CC0) and Wikimedia Commons (public domain) recordings.'],
      ['클래식 곡은 작곡이 퍼블릭 도메인입니다.', 'Classical pieces are public-domain compositions.']
    ];
    box.innerHTML = '<div class="g-doc credits" tabindex="0">' + lines.map(l => `<p>${L(l[0], l[1])}</p>`).join('') + '</div>';
  }

  /* ── 공지사항(2026-11-13): 서버 GET /v1/notices 에서 받는다. 요청에는 기기 토큰·개인정보를 싣지 않고, 서버도 아무것도 저장하지 않는다.
     마지막으로 받은 목록은 기기(localStorage)에 두어 인터넷이 없을 때 보인다. 새 공지 표시는 보호자 메뉴의 '공지사항' 줄 점 하나뿐(홈 톱니·아이 화면에는 없음).
     글자로만 보이고 소리 내어 읽지 않는다(녹음 없는 말) ── */
  const NOTICE_CACHE = 'notices_cache', NOTICE_SEEN = 'notices_seen';
  const noticeBase = () => { try { return String((typeof Entitlements !== 'undefined' && Entitlements.API_BASE) || '').replace(/\/+$/, ''); } catch (e) { return ''; } };
  const noticeOn = () => !!noticeBase();
  const escHTML = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const NT_ID = /^[a-z0-9][a-z0-9_-]{0,63}$/, NT_DATE = /^\d{4}-\d{2}-\d{2}$/;
  /* 서버가 준 것도 기기에 남은 것도 같은 모양 검사를 거친다(이상한 값이면 빈 목록) */
  function noticeClean(list) {
    if (!Array.isArray(list)) return [];
    const s = v => (typeof v === 'string' && v.trim() ? v.slice(0, 2000) : '');
    return list.filter(n => n && NT_ID.test(n.id) && NT_DATE.test(n.date) && n.title && (s(n.title.ko) || s(n.title.en)))
      .map(n => ({ id: n.id, date: n.date, title: { ko: s(n.title.ko), en: s(n.title.en) }, body: { ko: s(n.body && n.body.ko), en: s(n.body && n.body.en) } }))
      .slice(0, 20);
  }
  const readNoticeCache = () => { try { const j = JSON.parse(localStorage.getItem(NOTICE_CACHE) || 'null'); return noticeClean(j && j.notices); } catch (e) { return []; } };
  let notices = readNoticeCache(), noticeNet = notices.length ? 'cache' : 'none', noticeBusy = null, noticeOpen = '';
  const noticeSeen = () => new Set(readList(NOTICE_SEEN));
  const noticeUnread = () => { const seen = noticeSeen(); return notices.some(n => !seen.has(n.id)); };
  function noticeMarkSeen(id) {
    const seen = noticeSeen(); if (seen.has(id)) return;
    seen.add(id);
    try { localStorage.setItem(NOTICE_SEEN, JSON.stringify([...seen].slice(-100))); } catch (e) { /* 저장 못 하면 다음에 점이 다시 보일 뿐 */ }
    paintNoticeDot();
  }
  const noticeDotHTML = () => (noticeUnread() ? `<i class="g-dot" role="img" aria-label="${L('새 공지', 'New')}"></i>` : '');
  function paintNoticeDot() {
    const b = guardList.querySelector('.g-item[data-k="notice"]'); if (!b) return;
    const d = b.querySelector('.g-dot'), want = noticeUnread();
    if (want && !d) b.insertAdjacentHTML('beforeend', noticeDotHTML()); else if (!want && d) d.remove();
  }
  /* 휴대폰 세로(1열)는 목록이 먼저라 본문이 안 보인다. 본문이 보일 때만 '읽음'으로 친다 */
  const notePaneShown = () => !!guardBody.dataset.open || !matchMedia('(orientation: portrait) and (max-width: 699px)').matches;
  /* 공지 줄을 열 때 맨 위(최신) 공지는 펼쳐 둔다 = 읽음 */
  function noticeOpenFirst() { noticeOpen = notices.length ? notices[0].id : ''; if (noticeOpen) noticeMarkSeen(noticeOpen); }
  const ntText = o => (lang === 'en' ? o.en || o.ko : o.ko || o.en) || '';
  const ntDate = d => d.replace(/-/g, '.');
  function noticeHTML(name) {
    const seen = noticeSeen();
    let h = `<h3>${name}</h3>`;
    if (!notices.length) {
      h += `<p class="how g-empty">${noticeNet === 'loading' ? L('공지를 불러오고 있습니다.', 'Loading notices.') : L('공지가 없습니다.', 'No notices yet.')}</p>`;
      return h;
    }
    h += `<ul class="g-notes">${notices.map(n => {
      const open = n.id === noticeOpen, body = ntText(n.body);
      return `<li class="${open ? 'open' : ''}"><button type="button" class="g-nt" data-act="nt-open" data-id="${escHTML(n.id)}" aria-expanded="${open}">
          <span class="nt-t"><b>${escHTML(ntText(n.title))}</b><small>${ntDate(n.date)}</small></span>${seen.has(n.id) ? '' : `<i class="g-dot" role="img" aria-label="${L('새 공지', 'New')}"></i>`}
          <svg class="nt-chev" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10l5 5 5-5"/></svg></button>
        ${open && body ? `<div class="nt-body">${body.split(/\n+/).map(p => `<p>${escHTML(p)}</p>`).join('')}</div>` : ''}</li>`;
    }).join('')}</ul>`;
    if (noticeNet === 'cache' || noticeNet === 'fail') h += `<p class="how g-note-how">${L('인터넷에 닿지 않아 지난번에 받은 공지를 보여 드립니다.', 'Offline: showing the notices received last time.')}</p>`;
    return h;
  }
  function fetchNotices() {
    const base = noticeBase();
    if (!base || noticeBusy) return noticeBusy;
    if (!notices.length) noticeNet = 'loading';
    noticeBusy = (async () => {
      const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const tm = ctl && setTimeout(() => ctl.abort(), 8000);
      let got = null;
      try {
        const r = await fetch(base + '/v1/notices', { method: 'GET', credentials: 'omit', cache: 'no-cache', signal: ctl ? ctl.signal : undefined });   // 머리말·본문 없는 단순 요청
        if (r.ok) { const j = await r.json(); if (j && Array.isArray(j.notices)) got = noticeClean(j.notices); }
      } catch (e) { got = null; }
      finally { if (tm) clearTimeout(tm); }
      if (got) {
        notices = got; noticeNet = 'ok';
        try { localStorage.setItem(NOTICE_CACHE, JSON.stringify({ notices: got })); } catch (e) { /* 저장 못 해도 이번엔 보인다 */ }
      } else noticeNet = notices.length ? 'cache' : 'none';
      if (!notices.some(n => n.id === noticeOpen)) noticeOpen = '';
      noticeBusy = null;
      if (guardEl.hidden) return;
      paintNoticeDot();
      if (curGuard === 'notice') {
        if (!noticeOpen && got && got.length && notePaneShown()) noticeOpenFirst();
        const f = document.activeElement, fid = f && guardPane.contains(f) && f.dataset ? f.dataset.id : null;
        drawGuardPane();
        const nb = fid && guardPane.querySelector(`[data-act="nt-open"][data-id="${CSS.escape(fid)}"]`); if (nb) nb.focus({ preventScroll: true });
      }
    })();
    return noticeBusy;
  }

  /* ── 의견 보내기(2026-11-13): 어른 확인 뒤 메일 앱(mailto). 앱 버전·기기 종류(대략)·언어만 미리 적고, 이름·기기 번호 같은 식별 정보는 넣지 않는다.
     앱(WKWebView)에서는 맨 위 창의 mailto 이동을 Capacitor 가 막고 UIApplication.open 으로 메일 앱에 넘긴다(WebViewDelegationHandler). 브라우저는 기본 메일 앱 ── */
  const FEEDBACK_TO = 'hello@ddoystory.com';
  function deviceKind() {
    const ua = navigator.userAgent || '', touch = (navigator.maxTouchPoints || 0) > 1;
    const ios = /OS (\d+)[_.](\d+)/.exec(ua), ver = ios ? ` ${ios[1]}.${ios[2]}` : '';
    let k;
    if (/iPad/.test(ua) || (/Macintosh/.test(ua) && touch)) k = 'iPad' + (ios ? ' (iPadOS' + ver + ')' : '');
    else if (/iPhone|iPod/.test(ua)) k = 'iPhone (iOS' + ver + ')';
    else if (/Android/.test(ua)) { const a = /Android (\d+(\.\d+)?)/.exec(ua); k = 'Android' + (a ? ' ' + a[1] : '') + (/Mobile/.test(ua) ? ' phone' : ' tablet'); }
    else if (/Macintosh/.test(ua)) k = 'Mac';
    else if (/Windows/.test(ua)) k = 'Windows';
    else k = 'other';
    return k + (window.Capacitor ? ' · app' : ' · web');
  }
  function sendFeedback() {
    const subj = L('[톡톡 동화극장] 의견', '[Toki Toki Tale] Feedback');
    const body = L('여기에 하고 싶은 말씀을 적어 주세요.', 'Please write your message here.') + '\n\n\n\n----\n'
      + `${L('앱 버전', 'App version')}: ${APP_VERSION}\n${L('기기', 'Device')}: ${deviceKind()}\n${L('언어', 'Language')}: ${lang === 'en' ? 'English' : '한국어'}\n`;
    const a = document.createElement('a');
    a.href = `mailto:${FEEDBACK_TO}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
  }

  /* ── S11-2 기기 연결 (부품): 코드 만들기(8자리 크게 + 남은 시간) · 코드 넣기 ── */
  const MSG_LINK = {
    offline: ['서버에 닿지 않습니다. 인터넷을 확인하고 다시 해 주세요.', 'Cannot reach the server. Check your connection and try again.'],
    code_invalid: ['없거나 시간이 지난 코드입니다. 새 코드를 받아 주세요.', 'That code does not exist or has expired. Please get a new one.'],
    code_self: ['이 기기에서 만든 코드입니다. 다른 기기에서 입력해 주세요.', 'This code was made on this device. Enter it on another device.'],
    rate_limited: ['너무 자주 눌렀습니다. 잠시 뒤에 다시 해 주세요.', 'Too many tries. Please wait a little.'],
    bad_request: ['코드는 8자리입니다. 다시 확인해 주세요.', 'The code has 8 characters. Please check it.']
  };
  const linkErr = e => L(...(MSG_LINK[e] || ['연결하지 못했습니다. 다시 해 주세요.', 'Could not link. Please try again.']));
  function paintLeft(exp) {
    const sec = Math.max(0, Math.round((exp - Date.now()) / 1000)), el = $('#lkLeft'), code = $('#lkCode');
    if (!el) { clearInterval(linkTick); return; }
    if (!sec) { clearInterval(linkTick); code.hidden = true; el.textContent = L('코드 시간이 지났습니다. 새로 만들어 주세요.', 'The code has expired. Please make a new one.'); return; }
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
    v.innerHTML = `<div class="link-in"><label class="how" for="lkInput">${L('다른 기기의 코드를 넣어 주세요', 'Enter the code from the other device')}</label>
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
      if (r.ok) { msg.textContent = L('연결됐습니다. 두 기기가 같은 기록을 씁니다.', 'Linked! Both devices now share the same progress.'); render({ anim: false }); paintTabBadge(); }
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
      const canStar = stars >= need && Entitlements.lockedChoices().includes(id), nStar = Math.floor(stars / need);
      /* 그림 창은 가리지 않고, 자물쇠는 창의 오른쪽 아래 모서리에 걸친다. 색이 있는 단추는 종이별 원(구리)뿐 (§4-4) */
      flowSheet.innerHTML = `<div class="note">
        <div class="note-pic">${miniTile(id)}<span class="note-lock" aria-hidden="true">${UIA.has('badge_lock') ? uiImg('badge_lock') : LOCK_SVG}</span></div>
        <h2 class="note-t">${t}</h2>
        <p class="note-sub">${L('잠겨 있어요', 'Locked')}</p>
        <div class="note-btns">
          <button type="button" class="round f-first" data-act="f-close" aria-label="${L('닫기', 'Close')}">${X_SVG}</button>
          ${canStar ? `<button type="button" class="star-open" data-act="f-star1" aria-label="${L(`별로 열기, 별 ${nStar}개 있어요`, `Open with a star, you have ${nStar}`)}">${UIA.has('star_one') ? uiImg('star_one') : STAR_SVG}<span>${L('별로 열기', 'Open with a star')}</span><b>×${nStar}</b></button>` : ''}
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
        ${t ? `<div class="buy-head">${miniTile(id)}<p class="how">${L(`'${t}'은(는) 잠겨 있습니다.`, `"${t}" is locked.`)}</p></div>` : ''}
        <div class="buy-cols">
          <section class="col"><h3>${L('이번 주 기다리기', 'Wait for this week')}</h3><p class="how">${L(`매주 월요일에 무료 동화가 바뀝니다. 이번 주: ${names}`, `The free tales change every Monday. This week: ${names}`)}</p><button type="button" class="ticket alt" data-act="f-close">${L('기다리겠습니다', 'I will wait')}</button></section>
          <section class="col"><h3>${L('기다무·종이별', 'Waiting pass / Stars')}</h3><p class="how">${wait ? L('기다무로 한 편을 열 수 있습니다.', 'You can open one with a waiting pass.') : left ? L(`기다무는 ${left}일 뒤에 열립니다.`, `A waiting pass opens in ${left} days.`) : L('기다무를 모두 썼습니다.', 'All waiting passes are used.')} ${L(`완성한 별 ${Math.floor(stars / need)}개`, `${Math.floor(stars / need)} stars`)}</p>
            ${wait ? `<button type="button" class="ticket alt" data-act="f-wait">${L('기다무로 열기', 'Open with waiting pass')}</button>` : ''}
            ${canStar ? `<button type="button" class="ticket alt" data-act="${id ? 'f-star1' : 'f-star'}">${L(`별로 열기 ×${Math.floor(stars / need)}`, `Open with a star ×${Math.floor(stars / need)}`)}</button>` : ''}
            ${!wait && !canStar ? `<button type="button" class="ticket alt" disabled>${L('아직 열 수 없습니다', 'Not yet')}</button>` : ''}</section>
          <section class="col"><h3>${L('모든 동화 열기', 'Unlock all tales')}</h3><p class="how">${L(`${Entitlements.PRICE}를 한 번만 내면 모든 동화가 열립니다. 새로 나오는 동화도 함께 열립니다.`, `Pay ${Entitlements.PRICE} once to unlock every tale, including new ones.`)}</p><button type="button" class="ticket alt" data-act="f-buy">${L(`모두 열기 ${Entitlements.PRICE}`, `Unlock all ${Entitlements.PRICE}`)}</button></section>
        </div>
        <p class="how buy-msg" id="flowMsg" hidden></p>
        <div class="sheet-btns"><button type="button" class="ticket txt" data-act="f-restore">${L('구매 복원', 'Restore purchase')}</button><button type="button" class="ticket alt f-first" data-act="f-close">${L('다음에', 'Not now')}</button></div>`;
    } else if (step === 'pick') {
      const star = pickKind === 'star', list = Entitlements.lockedChoices();
      flowSheet.innerHTML = `<h2>${star ? L('종이별로 동화 열기', 'Open a tale with Paper Stars') : L('기다무로 동화 열기', 'Open a tale with a waiting pass')}</h2>
        ${star ? `<div class="plate" aria-label="${L(`별 조각 ${Math.min(stars, need)}개`, `${Math.min(stars, need)} star pieces`)}">${starPieces(Math.min(stars, need))}</div>` : ''}
        <p class="how">${list.length ? L('열고 싶은 동화를 하나 골라 주세요. 같은 동화를 한 번 더 누르면 열립니다.', 'Pick one tale. Tap it again to open.') : L('지금 열 수 있는 잠긴 동화가 없습니다.', 'No locked tales to open right now.')}</p>
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
      const m = $('#flowMsg'); if (m) { m.textContent = L('열지 못했습니다. 다시 골라 주세요.', 'Could not open it. Please pick again.'); m.hidden = false; }
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
    else if (act === 'f-star1') { pickKind = 'star'; flowCtx.sel = flowCtx.id; unlockSel(); }                // 잠긴 동화에서 바로: 모아 둔 별 하나로 이 동화를 연다(2026-10-31 사용자: 별은 선택권, 바로 안 써도 됨)
    else if (act === 'f-wait') { pickKind = 'wait'; paper('tap'); openFlow('pick', { sel: null }); }
    else if (act === 'f-buy') doPurchase($('#flowMsg'));
    else if (act === 'f-restore') doRestore($('#flowMsg'));
    else if (act === 'f-open') unlockSel();
  });
  flowEl.addEventListener('click', e => { if (e.target === flowEl) closeFlow(); });

  /* ── 처음 안내 (2026-11-13 사용자 결정): 앱을 처음 열 때 한 번, 스플래시가 끝난 뒤 홈 위에 뜨는 부모님용 넘기는 카드.
     글과 그림만(낭독 없음, 넘길 때 종이 넘김 효과음만). 가격·구매 단추 없음(Kids). 창작 동화 4편(아이 캐릭터) 그림은 쓰지 않는다.
     뜨지 않는 경우: #parent 로 연 보호자 메뉴, ?verify=1, ?intro=0, 스플래시를 건너뛴 열기(?splash=0 — 스토어 스크린샷, 동화에서 돌아온 홈).
     ?intro=1 이면 본 적이 있어도 스플래시 뒤에 다시 뜬다(확인용). 보호자 메뉴 '정보'의 '처음 안내 다시 보기'로도 연다 ── */
  const introEl = $('#intro'), introSheet = introEl.querySelector('.sheet');
  const INTRO_KEY = 'paperTheater.introSeen';
  let introAt = 0, introN = 0, introRan = false;
  const introSeen = () => {
    try { if (localStorage.getItem(INTRO_KEY) === '1') return true; } catch (e) { /* 저장소 없음 */ }
    try { return sessionStorage.getItem(INTRO_KEY) === '1'; } catch (e) { return false; }
  };
  const introMark = local => {
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* 이번 실행은 introRan 이 막는다 */ }
    if (local) try { localStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* 기록 못 하면 다음에 또 뜬다 */ }
  };
  function introAuto() {
    if (introRan) return;
    const p = new URLSearchParams(location.search);
    if (p.get('verify') === '1' || p.get('intro') === '0' || location.hash === '#parent') return;
    if (p.get('intro') !== '1' && introSeen()) return;
    if (anyOpen() || !introEl.hidden) return;              // 잠긴 동화 쪽지 같은 다른 팝업이 먼저 떠 있으면 이번엔 건너뛴다
    openIntro();
  }
  const enNum = (n, cap) => { const w = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] || String(n); return cap ? w[0].toUpperCase() + w.slice(1) : w; };   // 영어 문장 첫머리 숫자는 낱말로
  const obImg = (src, cls = '') => `<img class="${cls}" src="${src}" alt="" aria-hidden="true" draggable="false" decoding="async">`;
  function introCards() {
    const E = Entitlements, nm = namesOn();
    const orig = TALES.filter(t => t.origin === 'original' && t.ready).length;
    const menu = isApp
      ? (nm ? L('소리·자막, 놀이 시간, 언어, 아이 이름, 이용권을 정합니다.', 'Sound, captions, play time, language, your child\'s name and access.')
            : L('소리·자막, 놀이 시간, 언어, 이용권을 정합니다.', 'Sound, captions, play time, language and access.'))
      : L('소리·자막, 놀이 시간, 언어를 정합니다.', 'Sound, captions, play time and language.');
    return [
      { pic: 'assets/banner/rabbit.webp', chip: 'assets/ui/hand.webp', t: L('동화 읽으며 개념 배우기', 'Read tales, learn concepts'),
        d: [L('동화 속에서 톡 누르고, 고르고, 순서대로 놓으며 나이에 맞는 개념을 배웁니다.', 'Tap, choose and put things in order inside the story to learn age-right concepts.')] },
      { pic: 'assets/banner/sunmoon.webp', chip: 'assets/ui/tab_night.webp', t: L('누워서 듣는 잠자리 동화', 'Bedtime stories read aloud'),
        d: [L('\'읽어 주기\'를 고르면 처음부터 끝까지 읽어 줍니다. 화면을 꺼도 계속 들을 수 있습니다.', 'Choose Read to Me and the whole tale is read aloud, even with the screen off.')] },
      { pic: 'assets/banner/three_pigs.webp', chip: 'assets/ui/g_lang.webp', t: L('한국어와 영어로 동화 듣기', 'Listen in Korean and English'),
        d: [L('같은 목소리가 영어로도 천천히 읽어 줍니다. 언어는 보호자 메뉴에서 바꿉니다.', 'The same voice reads slowly in both languages. Switch in the grown-up menu.')] },
      { panel: true, t: L('오른쪽 위 톱니로 보호자 설정', 'Grown-up settings: the gear'),
        d: [L('톱니를 1초 꾹 누르면 열립니다. ', 'Hold the gear at the top right for 1 second. ') + menu,
          ...(isApp ? [L(`무료: 항상 무료 ${E.FREE_ALWAYS.length}편, 창작 동화 ${orig}편, 매주 바뀌는 ${E.PER_WEEK}편. 별 조각 ${E.STAR_NEED}개로 잠긴 동화 한 편을 엽니다.`,
            `${enNum(E.FREE_ALWAYS.length, true)} tales are always free, the ${enNum(orig)} original tales are free, and ${enNum(E.PER_WEEK)} more are free each week. ${enNum(E.STAR_NEED, true)} star pieces open one locked tale.`)] : [])] }
    ];
  }
  function introPanel() {   // 넷째 카드 그림: 톱니(1초 꾹 고리) · 소리·시간·언어 기호 · (앱) 별 조각 5개 = 잠긴 동화 한 편
    const E = Entitlements;
    return `<div class="ob-pic ob-panel" aria-hidden="true">
      <div class="ob-gear"><span class="ob-gbtn">${obImg('assets/ui/ic_gear.webp')}<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="20.6"/></svg></span><b>${L('1초 꾹', 'Hold 1 s')}</b></div>
      <div class="ob-side">
        <div class="ob-icons">${['g_sound', 'g_time', 'g_lang'].map(k => obImg(`assets/ui/${k}.webp`)).join('')}</div>
        ${isApp ? `<div class="ob-stars">${Array.from({ length: E.STAR_NEED }, () => obImg('assets/ui/star_one.webp?v=s4a')).join('')}<span class="ob-eq">=</span>${obImg('assets/ui/badge_lock.webp', 'ob-lock')}</div>` : ''}
      </div></div>`;
  }
  function openIntro() {
    introRan = true; introMark(false);
    const cards = introCards();
    introN = cards.length; introAt = 0;
    introSheet.innerHTML = `
      <div class="ob-top"><h2 id="introTitle" tabindex="-1">${L('부모님께', 'For parents')}</h2><button type="button" class="ticket txt ob-skip" data-ob="skip">${L('건너뛰기', 'Skip')}</button></div>
      <div class="ob-view"><div class="ob-rail">${cards.map((c, i) => `
        <section class="ob-slide" role="group" aria-roledescription="${L('카드', 'card')}" aria-label="${L(`${i + 1} / ${cards.length}`, `${i + 1} of ${cards.length}`)}">
          ${c.panel ? introPanel() : `<div class="ob-pic">${obImg(c.pic, 'ob-art')}<span class="ob-chip">${obImg(c.chip)}</span></div>`}
          <h3>${c.t}</h3>${c.d.map(p => `<p>${p}</p>`).join('')}
        </section>`).join('')}</div></div>
      <div class="ob-foot">
        <div class="ob-dots" role="group" aria-label="${L('안내 카드', 'Guide cards')}">${cards.map((c, i) => `<button type="button" class="ob-dot" data-ob="${i}" aria-label="${L(`${i + 1}번째 카드: ${c.t}`, `Card ${i + 1}: ${c.t}`)}"></button>`).join('')}</div>
        <button type="button" class="ticket pri ob-next" data-ob="next"></button>
      </div>`;
    obStack = !!MT.g;   // GSAP 시험 ④: 카드를 한 자리에 겹쳐 두고 넘길 때 앞 카드는 옆으로 밀려나고 다음 카드가 뒤에서 올라온다
    if (obStack) { const r = introSheet.querySelector('.ob-rail'); r.style.display = 'grid'; r.style.transition = 'none'; r.style.transform = 'none'; introSheet.querySelectorAll('.ob-slide').forEach(s => { s.style.gridArea = '1 / 1'; s.style.position = 'relative'; }); }
    introGo(0, true);
    showModal(introEl, introSheet, { focus: '#introTitle' });   // 화면 읽기는 제목부터, 다음 Tab 은 건너뛰기·점·다음
  }
  function introGo(i, quiet) {
    i = Math.max(0, Math.min(introN - 1, i));
    const moved = i !== introAt, from = introAt; introAt = i;
    const rail = introSheet.querySelector('.ob-rail'); if (!rail) return;
    if (obStack) obStackGo(from, i, moved);
    else rail.style.transform = `translateX(${-100 * i}%)`;
    introSheet.querySelectorAll('.ob-slide').forEach((s, k) => { s.inert = k !== i; s.setAttribute('aria-hidden', String(k !== i)); });
    introSheet.querySelectorAll('.ob-dot').forEach((d, k) => { d.classList.toggle('on', k === i); if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
    const last = i === introN - 1, nx = introSheet.querySelector('.ob-next');
    nx.textContent = last ? L('시작하기', 'Get started') : L('다음', 'Next');
    if (moved && !quiet) try { AudioFX.sfx('page_turn', .35); } catch (e) { /* 소리 없이 */ }
  }
  /* GSAP 시험 ④ 처음 안내 넘기기(0.65초 안팎): 앞 카드 = 넘기는 쪽 옆으로 밀려나며 살짝 기울고(0.45초) 흐려짐(0.28초), 다음 카드 = 뒤에서 조금 작게 있다가 올라옴(0.5초, 0.14초 늦게).
     원근·3D 없음. 손가락으로 끄는 동안에는 지금 카드가 손을 따라간다 */
  let obStack = false;
  function obStackGo(from, i, moved) {
    const g = window.gsap, slides = [...introSheet.querySelectorAll('.ob-slide')]; if (!g) return;
    const w = (introSheet.querySelector('.ob-view') || introSheet).clientWidth || 600;
    if (!moved) {   // 처음 열 때 · 끌다가 제자리로
      slides.forEach((s, k) => { if (k !== i) { g.killTweensOf(s); g.set(s, { autoAlpha: 0, x: 0, y: 0, scale: 1, rotation: 0, zIndex: 1 }); } });
      g.to(slides[i], { autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, zIndex: 2, duration: .3, ease: 'power2.out', overwrite: true });
      return;
    }
    const dir = i > from ? 1 : -1, old = slides[from], nw = slides[i];
    slides.forEach((s, k) => { if (k !== i && k !== from) { g.killTweensOf(s); g.set(s, { autoAlpha: 0 }); } });
    g.set(old, { zIndex: 2 }); g.set(nw, { zIndex: 1 });
    g.to(old, { x: -dir * w * .8, rotation: -dir * 4, duration: .45, ease: 'power2.inOut', overwrite: true });
    g.to(old, { autoAlpha: 0, duration: .28, ease: 'power1.in' });
    g.fromTo(nw, { autoAlpha: 0, x: 0, y: 22, scale: .95, rotation: 0 }, { autoAlpha: 1, y: 0, scale: 1, duration: .5, delay: .14, ease: 'power3.out', overwrite: true });
  }
  function closeIntro() {
    if (introEl.hidden || introEl.dataset.state === 'closing') return;
    introMark(true);
    hideModal(introEl, introSheet);
  }
  introSheet.addEventListener('click', e => {
    const b = e.target.closest('[data-ob]'); if (!b) return;
    const k = b.dataset.ob;
    if (k === 'skip') { paper('down'); closeIntro(); }
    else if (k === 'next') { if (introAt >= introN - 1) { paper('tap'); closeIntro(); } else introGo(introAt + 1); }
    else introGo(+k);
  });
  /* 옆으로 쓸어 넘기기: 손가락을 따라 움직이다가 50px(또는 빠르게 쓸기)을 넘으면 넘긴다. 세로 스크롤은 그대로 */
  (() => {
    let sx = 0, sy = 0, st = 0, drag = false, id = null, w = 1;
    const rail = () => introSheet.querySelector('.ob-rail');
    introSheet.addEventListener('pointerdown', e => {
      if (!e.target.closest('.ob-view') || e.button) return;
      sx = e.clientX; sy = e.clientY; st = performance.now(); drag = false; id = e.pointerId;
      w = introSheet.querySelector('.ob-view').clientWidth || 1;
    });
    introSheet.addEventListener('pointermove', e => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!drag) {
        if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) { if (Math.abs(dy) > 12) id = null; return; }
        drag = true; try { introSheet.querySelector('.ob-view').setPointerCapture(id); } catch (er) { /* 무시 */ }
        rail().classList.add('dragging');
      }
      const edge = (introAt === 0 && dx > 0) || (introAt === introN - 1 && dx < 0) ? .3 : 1;   // 끝에서는 덜 따라온다
      if (obStack && window.gsap) { const cur = introSheet.querySelectorAll('.ob-slide')[introAt]; window.gsap.set(cur, { x: dx * edge, rotation: dx * edge / w * 4, overwrite: true }); }
      else rail().style.transform = `translateX(calc(${-100 * introAt}% + ${dx * edge}px))`;
    });
    const end = e => {
      if (e.pointerId !== id) return;
      id = null;
      if (!drag) return;
      drag = false; rail().classList.remove('dragging');
      const dx = e.clientX - sx, fast = Math.abs(dx) / Math.max(1, performance.now() - st) > .5;
      const go = (Math.abs(dx) > Math.min(80, w * .18) || (fast && Math.abs(dx) > 24)) ? (dx < 0 ? 1 : -1) : 0;
      introGo(introAt + go);
    };
    introSheet.addEventListener('pointerup', end);
    introSheet.addEventListener('pointercancel', end);
  })();

  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') {                                   // 팝업 안에서만 Tab 이 돈다
      const top = modalTop(); if (!top) return;
      const fs = focusables(top), a = document.activeElement;
      if (!fs.length) { e.preventDefault(); return; }
      if (!top.contains(a)) { e.preventDefault(); fs[e.shiftKey ? fs.length - 1 : 0].focus(); }
      else if (e.shiftKey && a === fs[0]) { e.preventDefault(); fs[fs.length - 1].focus(); }
      else if (!e.shiftKey && a === fs[fs.length - 1]) { e.preventDefault(); fs[0].focus(); }
      return;
    }
    if (modalTop() === introEl && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.target.closest('input, textarea')) { e.preventDefault(); introGo(introAt + (e.key === 'ArrowRight' ? 1 : -1)); return; }
    if (e.key !== 'Escape') return;
    const top = modalTop(); if (!top) return;
    if (top === introEl) closeIntro(); else if (top === gateEl) closeGate(); else if (top === flowEl) closeFlow(); else if (top === guardEl) closeGuard(); else if (top.id === 'plEdit') hideModal(top);
  });
  Entitlements.onChange(() => { if (!flowEl.hidden && flowCtx.step === 'pick') return; refreshGuard(); });
  addEventListener('online', refreshGuard); addEventListener('offline', refreshGuard);

  /* ── S2 잠자리 탭: 읽어 주기가 준비된 동화만(카탈로그 read: true — 대본·녹음 맵·readPlay 가 있는지는 tools/app/check_read_flags.mjs 가 확인).
     타일 톡 = 바로 그 동화의 읽어 주기 시작 화면(?read=1, 홈 UI 2판: 한 번에 들어간다). 잠긴 동화는 S4. 영어 모드에서는 영어 읽기 녹음이 있는 동화가 먼저 ── */
  ROW_SVG.all = '<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><path d="M22.4 11Q14 6 4 7.6V37Q14 35.4 22.4 40Z" fill="#C98A5B"/><path d="M25.6 11Q34 6 44 7.6V37Q34 35.4 25.6 40Z" fill="#DDD2C4"/></svg>';
  const nightList = () => {
    const l = TALES.filter(t => t.read && inScope(t) && isOpen(t));
    return byRank(lang === 'en' ? [...l.filter(t => t.readEn), ...l.filter(t => !t.readEn)] : l);   // 열린 동화 먼저, 잠긴 동화 뒤(같은 무리 안은 기존 순서)
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
        <div class="b-thumbs">${pl.length ? thumbs : `<span class="b-empty">${L('만들기를 눌러 동화를 담아요', 'Tap Make to add tales')}</span>`}</div>
        ${pl.length ? `<button type="button" class="b-play sec" data-bt="list" aria-label="${L('재생목록 듣기', 'Play the playlist')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg></button>` : ''}
        <button type="button" class="b-edit" data-bt-edit>${pl.length ? L('편집', 'Edit') : L('만들기', 'Make')}</button>
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
      el = document.createElement('div'); el.id = 'plEdit'; el.className = 'pl-edit'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', L('우리 재생목록', 'Our playlist'));
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
    const fa = document.activeElement, fk = fa && el.contains(fa) && fa.dataset && fa.dataset.pl ? `[data-pl="${fa.dataset.pl}"]${fa.dataset.i !== undefined ? `[data-i="${fa.dataset.i}"]` : ''}${fa.dataset.id ? `[data-id="${fa.dataset.id}"]` : ''}` : '';
    const rows = btDraft.map((id, i) => { const t = byId(id); return `<li class="pl-row"><span class="pl-n">${i + 1}</span><img class="pl-th" src="assets/thumbs/${id}_tile.webp" alt="" draggable="false"><span class="pl-tt">${shown(t).title}</span>
      <button type="button" class="pl-b" data-pl="up" data-i="${i}" aria-label="${L('위로', 'Up')}"${i === 0 ? ' disabled' : ''}>${SYM('up')}</button>
      <button type="button" class="pl-b" data-pl="down" data-i="${i}" aria-label="${L('아래로', 'Down')}"${i === btDraft.length - 1 ? ' disabled' : ''}>${SYM('down')}</button>
      <button type="button" class="pl-b" data-pl="del" data-i="${i}" aria-label="${L('빼기', 'Remove')}">${SYM('minus')}</button></li>`; }).join('');
    const tiles = nightList().map(t => {
      const locked = !btOk(t), on = btDraft.includes(t.id), full = !on && btDraft.length >= BT_MAX;
      return `<button type="button" class="pl-tile${on ? ' on' : ''}${locked ? ' locked' : ''}" data-pl="add" data-id="${t.id}"${locked || full ? ' disabled' : ''} aria-pressed="${on}"><span class="pl-pic"><img src="assets/thumbs/${t.id}_tile.webp" alt="" draggable="false" loading="lazy" decoding="async">${locked ? badge('lock') : ''}</span><span>${shown(t).title}${locked ? `<span class="sr">, ${L('잠김', 'Locked')}</span>` : ''}</span>${on ? `<i class="pl-ck" aria-hidden="true">${SYM('check')}</i>` : ''}</button>`;
    }).join('');
    el.innerHTML = `<div class="pl-sheet"><header class="pl-h"><button type="button" class="pl-top" data-pl="close">${L('닫기', 'Close')}</button><h2>${L('우리 재생목록', 'Our playlist')}<small class="pl-max">${L(`(최대 ${BT_MAX}편)`, `(up to ${BT_MAX})`)}</small></h2><button type="button" class="pl-top pl-save" data-pl="save">${L('저장', 'Save')}</button></header>
      <ol class="pl-list">${rows || `<li class="pl-none">${L('아래에서 동화를 골라요', 'Pick tales below')}</li>`}</ol>
      <h3 class="pl-add">${SYM('plus')}${L('더하기', 'Add')}</h3><div class="pl-grid">${tiles}</div></div>`;
    if (fk) {   // 누른 단추가 다시 그려져도 포커스는 그 자리에(눌러서 비활성이 되면 맨 앞으로)
      const n = el.querySelector(fk + ':not([disabled])') || focusables(el)[0];
      if (n) n.focus({ preventScroll: true });
    }
  }
  function btOpenEditor() {
    btDraft = btList().filter(t => TALES.some(x => x.id === t.id)).map(t => t.id);
    btPaintEditor(); showModal(btEditor());
    btEditor()._refocus = () => document.querySelector('[data-bt-edit]');
  }
  /* 재생목록 만들기·편집은 한 번 톡(2026-11-06 사용자 결정, 예전 '1초 꾹'을 없앰) — 아래 #nightBody 의 click 이 맡는다 */
  /* 잠자리 탭 썸네일('최근 들은'·'모든 이야기') 1초 꾹 = 우리 재생목록에 담기(2026-11-06 사용자 요청). 짧은 톡은 그대로 읽어 주기로 들어간다.
     저장은 편집 시트 '저장'과 같은 btSet({ playlist }). 이미 있으면·꽉 차면 담지 않고 안내 쪽지만. 손가락이 움직이면(스크롤) 꾹은 취소.
     꾹이 끝난 뒤 손을 떼며 오는 click(진입)은 삼킨다. 담을 수 없는 동화(잠김·영어 녹음 없음)는 꾹을 걸지 않는다 */
  function btAddHeld(id) {
    const ids = btList().filter(btOk).map(t => t.id), t = TALES.find(x => x.id === id);
    if (ids.includes(id)) { paper('down'); toast(L('이미 재생목록에 있어요', 'Already in the playlist')); return; }
    if (ids.length >= BT_MAX) { paper('down'); toast(L(`재생목록이 꽉 찼어요 (최대 ${BT_MAX}편)`, `The playlist is full (up to ${BT_MAX})`)); return; }
    ids.push(id); btSet({ playlist: ids }); paper('tap');
    const box = document.querySelector('#nightBody .b-cards');
    if (box) box.outerHTML = btHTML();   // 재생목록 카드만 다시 그린다(아래 목록은 그대로 두어 손가락 밑 카드가 바뀌지 않게)
    toast(L(`재생목록에 담았어요: ${shown(t).title} (${ids.length}/${BT_MAX})`, `Added to the playlist: ${shown(t).title} (${ids.length}/${BT_MAX})`));
  }
  (() => {
    const HOLD_MS = 1000, body = $('#nightBody');
    let timer = 0, card = null, sx = 0, sy = 0, swallowUntil = 0;
    const stop = () => {
      clearTimeout(timer); timer = 0;
      if (card) { const th = card.querySelector('.thumb'); if (th) th.classList.remove('holding'); card = null; }
    };
    body.addEventListener('pointerdown', e => {
      stop();
      if (e.button) return;
      const c = e.target.closest('.n-grid .card'); if (!c || c.classList.contains('locked') || c.classList.contains('closed')) return;
      const id = c.dataset.id; if (!btOk(TALES.find(x => x.id === id))) return;
      const th = c.querySelector('.thumb');
      if (th) {
        if (!th.querySelector('.hold-ring')) { th.insertAdjacentHTML('beforeend', '<i class="hold-ring" aria-hidden="true"></i>'); void th.offsetWidth; }   // 링이 0 에서 시작해 차오르도록(같은 프레임에 붙이면 전환이 건너뛴다)
        th.style.setProperty('--hold', HOLD_MS + 'ms'); th.classList.add('holding');
      }
      card = c; sx = e.clientX; sy = e.clientY;
      timer = setTimeout(() => {
        const done = card; stop();
        swallowUntil = Infinity;   // 손을 뗄 때 오는 click 을 삼킨다(아래 pointerup 에서 짧은 유예로 바꾼다)
        if (th) { th.classList.add('held'); setTimeout(() => th.classList.remove('held'), 60); }
        btAddHeld(done.dataset.id);
      }, HOLD_MS);
    });
    body.addEventListener('pointermove', e => { if (card && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) stop(); });
    ['pointercancel', 'pointerleave', 'dragstart'].forEach(ev => body.addEventListener(ev, stop));
    addEventListener('pointerup', () => { stop(); if (swallowUntil === Infinity) swallowUntil = performance.now() + 400; }, true);
    addEventListener('pointercancel', () => { if (swallowUntil === Infinity) swallowUntil = 0; }, true);   // 취소되면 click 이 오지 않으니 삼킬 것도 없다
    addEventListener('scroll', stop, { capture: true, passive: true });
    body.addEventListener('click', e => {
      if (performance.now() < swallowUntil) { swallowUntil = 0; e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
    body.addEventListener('contextmenu', e => { if (e.target.closest('.n-grid .card')) e.preventDefault(); });   // 길게 누르기 메뉴(안드로이드·데스크톱) 막기
  })();
  function renderNight() {
    const body = $('#nightBody'); if (!body) return;
    const list = nightList(), recent = readList(recentReadKey).map(id => list.find(t => t.id === id)).filter(Boolean);
    $('#nightEmpty').hidden = list.length > 0;
    body.hidden = list.length === 0;
    const sec = (k, ko, en, items) => items.length ? `<section class="n-sec" data-row="${k}" aria-label="${L(ko, en)}"><h3 class="row-h"><span class="row-ic">${rowIcon(k)}</span><span class="row-t">${L(ko, en)}</span></h3>
      <div class="n-grid">${items.map(t => `<div class="slot" data-id="${t.id}">${cardHTML(t, { night: true })}</div>`).join('')}</div></section>` : '';
    body.innerHTML = btHTML() + sec('recent', '최근 들은', 'Recently heard', recent) + sec('all', '모든 이야기', 'All tales', list);
  }
  function activateNight(e, c) {
    e.preventDefault();
    const id = c.dataset.id;
    if (c.classList.contains('locked')) { paper('down'); peek(c); openLock(id); return; }
    paper('tap');
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (err) { /* 무시 */ }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    openTaleSoon(c);
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
  try { fetch('assets/ui/puzzle_layout.json?v=20261031jg1').then(r => r.ok ? r.json() : null).then(j => { if (j && j.boards) { PZ = j; if (stkTab()) drawStickers(); } }).catch(() => { /* 없으면 썸네일 조각 */ }); } catch (e) { /* 무시 */ }
  const pieces = b => {
    const all = TALES.filter(b.has), ord = (PZ && PZ.boards[b.k] && PZ.boards[b.k].tales) || [];
    return [...ord.map(id => all.find(t => t.id === id)).filter(Boolean), ...all.filter(t => !ord.includes(t.id))];
  };
  /* 조각 모양: tools/app/gen/post_puzzle.py 가 판 그림을 물건 모양 조각(구름·강아지·자동차 …)과 모양 없는 조각으로 빈틈없이 나눈다. 조각마다 상자(x,y,w,h: 판 좌표 px, 칸 512)와 SVG 경로.
     layout 에 없는 새 동화는 칸 반쪽 네모 조각(썸네일)으로 보이고, post_puzzle.py 를 다시 돌리면 조각 퍼즐이 된다 */
  const PZ_S = 512;
  const pzBox = (bk, id, col, row) => {                                             // 판 bk 의 그 동화 칸 위(row 0)·아래(row 1) 조각 묶음
    const e = PZ && PZ.boards[bk] && PZ.boards[bk].pieces[id], q = e && e[row ? 'bot' : 'top'];
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
  /* 별 조각(2026-10-31 사용자): 종이 별 그림(star_one)을 꼭지 다섯 개로 나눈다. 받은 조각은 색 그대로, 아직인 조각은 흐린 회색.
     engine/tale.js 의 starPieces 와 같은 모양 */
  let spUid = 0;
  const STAR_N = 5;
  function starPieces(n, mono = false) {
    const u = 'sp' + (++spUid), C = 50, R = 80, rad = d => d * Math.PI / 180;
    const pt = d => `${(C + R * Math.cos(rad(d))).toFixed(1)},${(C + R * Math.sin(rad(d))).toFixed(1)}`;
    const src = !mono && UIA.has('star_one') ? 'assets/ui/star_one.webp?v=s4a' : '';
    const star = [...Array(10)].map((_, i) => { const r = i % 2 ? 20 : 47, d = rad(-90 + i * 36); return `${(C + r * Math.cos(d)).toFixed(1)},${(C + r * Math.sin(d)).toFixed(1)}`; }).join(' ');
    let defs = '', body = '';
    for (let k = 0; k < STAR_N; k++) {
      const a = -90 + k * 72;
      defs += `<clipPath id="${u}-${k}"><polygon points="${C},${C} ${pt(a - 36)} ${pt(a + 36)}"/></clipPath>`;
      body += `<g clip-path="url(#${u}-${k})" class="${k < n ? 'on' : 'off'}">${src ? `<image href="${src}" width="100" height="100"/>` : `<polygon points="${star}" stroke-linejoin="round"/>`}</g>`;
    }
    const cuts = [...Array(STAR_N)].map((_, k) => `<line x1="${C}" y1="${C}" x2="${(C + 50 * Math.cos(rad(-54 + k * 72))).toFixed(1)}" y2="${(C + 50 * Math.sin(rad(-54 + k * 72))).toFixed(1)}"/>`).join('');
    return `<svg class="star-pc${mono ? ' mono' : ''}" viewBox="0 0 100 100" aria-hidden="true"><defs>${defs}</defs>${body}<g class="cuts">${cuts}</g></svg>`;
  }
  let curBoard = '', pendingCel = [], celebrating = false, stMode = 'puzzle';
  /* 퍼즐 탭과 스티커북 탭(2026-10-30 사용자: 따로 나눔)은 같은 화면(#view-stickers)을 쓰고 탭이 갈래를 정한다: 퍼즐 = 퍼즐판, 스티커북 = 동화별 친구 스티커 */
  const stkTab = () => curTab === 'puzzle' || curTab === 'stickers';
  try { curBoard = localStorage.getItem(BOARD_KEY) || ''; } catch (e) { /* 기억 없음 */ }
  const stickImg = (id, off) => { const s = stickerSrc(id); return s ? `<img src="${s}" alt="" draggable="false" decoding="async"${off ? ' class="sil"' : ''}>` : ''; };
  /* 캐릭터 스티커 세트(tales/stickers.js): 그림이 있는 칸만 받을 수 있다. 그림 없는 칸(새로 그릴 자리)은 맨 뒤에 흐린 빈 구멍(글자 없음) */
  const castSet = id => { try { const a = typeof STICKERS !== 'undefined' && STICKERS[id]; return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const hasCast = (id, k) => { try { return Entitlements.hasCast(id, k); } catch (e) { return false; } };
  const castGot = id => castSet(id).filter(c => c.img && hasCast(id, c.k));      // 받은 친구 스티커(받은 순서)
  const CAST_DONE_KEY = 'paperTheater.castDone';
  const castDone = () => { try { const o = JSON.parse(localStorage.getItem(CAST_DONE_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } };
  /* 퍼즐 칸 위의 작은 진행 점: 10칸 중 받은 만큼 채운다 */
  /* ── 퍼즐 탭·스티커북 탭 (2026-10-30 사용자): 판(퍼즐) / 동화(스티커)마다 흰 카드 한 장씩 위아래로 쌓고, 맨 위 동그라미를 누르면 그 카드로 내려간다.
     화살표 없음 — 아이패드는 판 하나가 한눈에 다 보이고, 휴대폰은 판을 옆으로 쓸어 본다. 퍼즐 카드에는 [흩어지기]·[모으기]: 받은 조각이 흩어지고, 끌어다 제자리 가까이 놓으면 착 붙는다 ── */
  const stkSec = k => $(`#pzBoard .pz-sec[data-b="${k}"], #pzBoard .pz-sec[data-tale="${k}"]`);
  function jumpTo(k, smooth = true) {
    const sec = stkSec(k), v = $('#view-stickers'), row = $('#pzRow'); if (!sec || !v) return;
    const top = sec.getBoundingClientRect().top - v.getBoundingClientRect().top + v.scrollTop - (row.hidden ? 0 : row.offsetHeight) - 8;
    v.scrollTo({ top: Math.max(0, top), behavior: smooth && motion() ? 'smooth' : 'auto' });
  }
  /* 지금 보고 있는 카드의 동그라미를 켠다(스크롤을 따라) */
  function paintRowOn() {
    const v = $('#view-stickers'), row = $('#pzRow'); if (!v || row.hidden) return;
    const line = row.getBoundingClientRect().bottom + 24, secs = [...document.querySelectorAll('#pzBoard .pz-sec')];
    const cur = secs.find(x => x.getBoundingClientRect().bottom > line) || secs[secs.length - 1]; if (!cur) return;
    const k = cur.dataset.b || cur.dataset.tale;
    row.querySelectorAll('.pz-b').forEach(b => { const on = b.dataset.go === k; b.classList.toggle('on', on); b.setAttribute('aria-current', on ? 'true' : 'false'); });
    if (cur.dataset.b) { curBoard = k; try { localStorage.setItem(BOARD_KEY, k); } catch (e) { /* 무시 */ } }
  }
  $('#view-stickers').addEventListener('scroll', () => paintRowOn(), { passive: true });
  /* 스티커북: 친구 스티커를 받은 동화마다 10칸 카드. 받은 칸 = 칼선 스티커, 빈 칸 = 흐린 실루엣, 그림 없는 칸 = 흐린 빈 자리 */
  /* 반짝 스티커 고르기 중(별 카드의 '반짝 스티커 만들기'): 받은 스티커 중 아직 안 반짝이는 것을 톡 하면 별 하나로 반짝이게 */
  let shineMode = false;
  function castCard(id) {
    const t = shown(TALES.find(x => x.id === id)), set = castSet(id), ready = set.filter(c => c.img), plan = set.filter(c => !c.img);
    const got = ready.filter(c => hasCast(id, c.k)).length, whole = !plan.length && got === ready.length && ready.length > 0;
    const cell = c => {
      if (!c.img) return `<span class="cs plan" aria-hidden="true"></span>`;
      const nm = nameView(lang === 'en' ? c.en : c.ko, 'home');   // 스티커 이름 녹음은 홈 맵(home_narration_el.js)이라 'home' 이 다 받아졌을 때만 바꾼다
      const sh = Entitlements.isShiny(id + '.' + c.k);
      /* 반짝 스티커: 무지갯빛 홀로그램 테두리 + 스티커 모양으로 스치는 빛줄기 + 깜빡이는 반짝이 셋 */
      const holo = sh ? `<i class="sweep" style="-webkit-mask-image:url('${c.img}');mask-image:url('${c.img}')"></i><i class="tw t1">✦</i><i class="tw t2">✦</i><i class="tw t3">✦</i>` : '';
      return hasCast(id, c.k) ? `<button type="button" class="cs${sh ? ' shiny' : shineMode ? ' pickable' : ''}" data-k="${c.k}" aria-label="${nm}${sh ? ', ' + L('반짝 스티커', 'sparkly sticker') : ''}"><img src="${c.img}" alt="" draggable="false" decoding="async">${holo}</button>`
        : `<span class="cs off" data-k="${c.k}" role="img" aria-label="${L('아직 비어 있어요', 'Still empty')}"><img class="sil" src="${c.img}" alt="" draggable="false" decoding="async"></span>`;
    };
    return `<section class="pz-sec cs-sec" data-tale="${id}"><div class="pz-head"><h2>${t.title}</h2><span class="pz-n">${got} / ${set.length}</span></div>
      <div class="cast-grid${whole ? ' complete' : ''}"><i class="pz-glow" aria-hidden="true"></i>${[...ready, ...plan].map(cell).join('')}</div></section>`;
  }
  function drawCastAll() {
    const tales = TALES.filter(t => castGot(t.id).length), root = $('#pzRow');
    root.hidden = !tales.length;
    root.innerHTML = tales.map(t0 => { const t = shown(t0), g = castGot(t0.id), n = castSet(t0.id).length, src = tileSrc(t0.id) || g[g.length - 1].img;
      return `<button type="button" class="pz-b" data-go="${t0.id}" aria-label="${t.title} ${g.length} / ${n}"><span class="pz-hole"><img src="${src}" alt="" draggable="false" decoding="async"></span><span class="pz-cnt">${g.length} / ${n}</span></button>`; }).join('');
    const stRow = tales.length && typeof Stage !== 'undefined' ? Stage.rowHTML() : '';   // 맨 위 '내 무대' 줄(stage.js, STICKER_STAGE_PLAN §0-3)
    $('#pzBoard').innerHTML = tales.length ? stRow + tales.map(t => castCard(t.id)).join('') : `<div class="cast-none"><span class="cn-slots" aria-hidden="true">${'<i></i>'.repeat(5)}</span><p>${L('동화를 끝까지 보면 친구 스티커가 생겨요', 'Finish a tale to get a friend sticker')}</p></div>`;   // 빈 상태: 흐린 스티커 자리 5칸 + 안내 한 줄(별 모양은 종이별과 헷갈려서 쓰지 않는다)
    if (stRow) { Stage.bindRow($('#pzBoard .st-sec')); if (curTab === 'stickers' && !celebrating) Stage.bgNews(); }
    paintRowOn();
    /* 친구들을 다 모은 동화가 처음 생기면 그 카드로 내려가 한 번 축하 */
    const rec = castDone(), whole = tales.find(t => { const set = castSet(t.id); return !rec[t.id] && set.length && set.every(c => c.img && hasCast(t.id, c.k)); });
    if (whole && curTab === 'stickers' && !celebrating) {
      rec[whole.id] = true; try { localStorage.setItem(CAST_DONE_KEY, JSON.stringify(rec)); } catch (e) { /* 기록 못 해도 이번 화면에서는 보인다 */ }
      jumpTo(whole.id); setTimeout(() => celebrateCast(whole.id), 450);
    }
  }
  /* 내 무대 편집기(stage.js)에 홈의 글·썸네일·움직임 설정을 넘긴다. 닫으면 '내 무대' 줄을 다시 그린다 */
  if (typeof Stage !== 'undefined') Stage.init({ L, tileSrc, motion, title: id => { const t = TALES.find(x => x.id === id); return t ? shown(t).title : id; }, onClose: () => { if (curTab === 'stickers') drawCastAll(); } });
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
    const t0 = TALES.find(x => x.id === id), sec = stkSec(id), g = sec && sec.querySelector('.cast-grid');
    if (!t0 || !g) return;
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
  let pzLists = {};
  /* 조각 톡 반경 (§7-5): 받은 조각 묶음의 상자가 72px 보다 작으면 가운데에 72px 투명 톡 영역을 깐다(빈 조각 위·받은 조각 아래 층) */
  function pzHits() {
    document.querySelectorAll('#pzBoard .pz-sec[data-b]').forEach(sec => {
      const bk = sec.dataset.b, list = pzLists[bk], tr = sec.querySelector('.pz-track'), box = tr && tr.querySelector('.pz-hits'); if (!box || !list) return;
      const cell = tr.offsetHeight / 2; if (!cell) return;
      box.innerHTML = list.flatMap((t, i) => [0, 1].map(row => {
        if (!(row ? has(t.id) : has2(t.id))) return '';
        const qs = pzBox(bk, t.id, i, row), x0 = Math.min(...qs.map(q => q.x)), y0 = Math.min(...qs.map(q => q.y)), x1 = Math.max(...qs.map(q => q.x + q.w)), y1 = Math.max(...qs.map(q => q.y + q.h));
        const f = cell / PZ_S, w = (x1 - x0) * f, h = (y1 - y0) * f;
        if (Math.min(w, h) >= 72) return '';
        const W = Math.max(72, w), H = Math.max(72, h), l = Math.max(0, Math.min(tr.offsetWidth - W, (x0 + x1) / 2 * f - W / 2)), tp = Math.max(0, Math.min(tr.offsetHeight - H, (y0 + y1) / 2 * f - H / 2));
        return `<span class="pz-s pz-hit" data-id="${t.id}" data-part="${row ? 'bot' : 'top'}" style="left:${l.toFixed(1)}px;top:${tp.toFixed(1)}px;width:${W.toFixed(1)}px;height:${H.toFixed(1)}px"></span>`;
      })).join('');
    });
  }
  addEventListener('resize', () => { if (curTab === 'puzzle') pzHits(); });
  /* 처음 보는 조각(끝 화면에서 받아 온 것): 홈 퍼즐 탭에 구리 점, 퍼즐 탭을 열면 한 번 들썩. 기록이 없으면 지금 있는 것을 본 것으로 */
  const PZ_SEEN_KEY = 'paperTheater.pzSeen';
  const gotKeys = () => TALES.flatMap(t => [has(t.id) ? t.id + '-bot' : '', has2(t.id) ? t.id + '-top' : '']).filter(Boolean);
  const pzSeenSave = () => { try { localStorage.setItem(PZ_SEEN_KEY, JSON.stringify(gotKeys())); } catch (e) { /* 기억 못 하면 점이 남지 않는다 */ } };
  function pzNew() {
    let seen = null;
    try { seen = JSON.parse(localStorage.getItem(PZ_SEEN_KEY)); } catch (e) { seen = null; }
    if (!Array.isArray(seen)) { pzSeenSave(); return []; }
    return gotKeys().filter(k => !seen.includes(k));
  }
  /* 자투리(모양 없는 둘레 조각)는 처음부터 채워 둔다 — 판이 처음부터 한 장의 풍경으로 보이고, 아이가 모으는 것은 인물·물건 모양 조각뿐(2026-10-30 사용자).
     layout 이 없는 새 동화의 네모 조각은 모양 조각으로 친다 */
  function pieceHTML(bk, list, i, row) {
    const t0 = list[i], t = shown(t0), earned = row ? has(t0.id) : has2(t0.id), qs = pzBox(bk, t0.id, i, row), shaped = qs.some(q => q.obj);
    return qs.map((q, k) => {
      const filler = shaped && !q.obj, got = earned || filler;
      const id = `${bk}-${t0.id}-${row}-${k}`;
      const sty = `left:calc(var(--cell)*${q.x / PZ_S});top:calc(var(--cell)*${q.y / PZ_S});width:calc(var(--cell)*${q.w / PZ_S});height:calc(var(--cell)*${q.h / PZ_S})`;
      let art;
      if (!got) art = `<svg class="pz-art" viewBox="0 0 ${q.w} ${q.h}" aria-hidden="true"><path d="${q.path}" fill="#ECECE9" stroke="#D6D4CF" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;   // 빈 자리: 평평한 연회색 + 1px 선(홈 UI 2판)
      else if (q.file) art = `<img class="pz-art" src="assets/ui/${q.file}?v=20261030bj2" alt="" draggable="false" decoding="async">`;
      else {
        const im = [i - 1, i, i + 1].filter(c => c >= 0 && c < list.length).map(c => { const src = tileSrc(list[c].id); return src ? `<image href="${src}" x="${c * PZ_S - q.x}" y="${-q.y}" width="${PZ_S}" height="${PZ_S * 2}" preserveAspectRatio="xMidYMid slice"/>` : ''; }).join('');
        art = `<svg class="pz-art" viewBox="0 0 ${q.w} ${q.h}" aria-hidden="true"><defs><clipPath id="pzc-${id}"><path d="${q.path}"/></clipPath></defs><rect width="${q.w}" height="${q.h}" fill="#E9DFD3" clip-path="url(#pzc-${id})"/><g clip-path="url(#pzc-${id})">${im}</g></svg>`;
      }
      const hit = `<svg class="pz-s${got ? '' : ' off'}" viewBox="0 0 ${q.w} ${q.h}" data-id="${t0.id}" data-part="${row ? 'bot' : 'top'}"${k ? ' tabindex="-1" aria-hidden="true"' : ` tabindex="0" role="${got ? 'button' : 'img'}" aria-label="${got ? t.title : L('아직 비어 있어요', 'Still empty')}"`}><path d="${q.path}" fill="transparent" pointer-events="all"/></svg>`;
      return `<div class="pzp${got ? ' got' : ''}${q.obj ? ' obj' : ''}${filler ? ' fill' : ''}" data-k="${t0.id}-${row ? 'bot' : 'top'}" style="${sty}">${art}${hit}</div>`;
    }).join('');
  }
  /* 갈래 표시: 옛 '퍼즐 | 스티커' 단추는 숨기고(탭이 대신한다) 화면 클래스만 맞춘다 */
  function paintSeg() {
    $('#stkSeg').querySelectorAll('button').forEach(b => { const on = b.dataset.mode === stMode; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); b.textContent = b.dataset.mode === 'cast' ? L('스티커', 'Stickers') : L('퍼즐', 'Puzzle'); });
    $('#view-stickers').classList.toggle('cast-on', stMode === 'cast');
  }
  function boardCard(b, list, done) {
    const gotN = list.reduce((n, t) => n + pzGot(t), 0), all = list.length * 2, complete = gotN === all;
    /* 빈 조각을 먼저, 받은 조각을 나중에 그린다. 그 사이 층(.pz-hits)에 작은 받은 조각의 넓힌 톡 영역(72)을 둔다 → 빈 조각보다 위, 받은 조각보다 아래 */
    const parts = list.flatMap((t, i) => [[i, 0, has2(t.id)], [i, 1, has(t.id)]]);
    const html = want => parts.filter(p => p[2] === want).map(p => pieceHTML(b.k, list, p[0], p[1])).join('');   // 못 받은 묶음의 자투리도 채워진 채 아래 층에
    const play = gotN ? `<span class="pz-play"><button type="button" class="pz-pb" data-act="scatter">${L('흩어지기', 'Scatter')}</button><button type="button" class="pz-pb go" data-act="gather">${L('모으기', 'Gather')}</button></span>` : '';
    return `<section class="pz-sec" data-b="${b.k}"><div class="pz-head"><h2>${L(b.ko, b.en)}</h2><span class="pz-n">${gotN} / ${all}</span>${done ? `<i class="pz-done">${starSvg}</i>` : ''}${play}</div>
      <div class="pz-win" style="--n:${list.length}"><div class="pz-pan${complete ? ' complete' : ''}" style="--n:${list.length}"><div class="pz-track"><i class="pz-glow" aria-hidden="true"></i>${html(false)}<div class="pz-hits" aria-hidden="true"></div>${html(true)}</div></div></div></section>`;
  }
  function drawStickers() {
    const root = $('#pzRow'); if (!root) return;
    stMode = curTab === 'stickers' ? 'cast' : 'puzzle';
    paintSeg();
    if (stMode === 'cast') { $('#pzEmpty').hidden = true; $('#pzMain').hidden = false; drawCastAll(); drawPlate(); return; }
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
    const fresh = pzNew();
    root.innerHTML = bs.map(({ b, list }) => {
      const gotN = cnt(list), all = list.length * 2, done = !!rec[b.k], last = [...list].reverse().find(t => has(t.id));
      const art = UIA.has('puzzle_' + b.k) ? uiImg('puzzle_' + b.k, 'pz-art') : stickImg((last || list[0]).id);
      return `<button type="button" class="pz-b${done ? ' done' : ''}" data-go="${b.k}" aria-label="${L(b.ko, b.en)} ${gotN}/${all}${done ? ', ' + L('완성', 'complete') : ''}">
        <span class="pz-hole${art ? '' : ' empty'}">${art}${done ? `<i class="pz-done">${starSvg}</i>` : ''}</span>
        <span class="pz-cnt">${gotN} / ${all}</span><span class="pz-nm">${L(b.ko, b.en)}</span></button>`;
    }).join('');
    pzLists = {}; bs.forEach(x => { pzLists[x.b.k] = x.list; });
    $('#pzBoard').innerHTML = PZ_INSET + bs.map(({ b, list }) => boardCard(b, list, !!rec[b.k])).join('');
    /* 판마다 옆 위치: 처음 보는 조각 → 기억한 위치 → 처음 비어 있는 칸 */
    bs.forEach(({ b, list }) => {
      const pan = stkSec(b.k).querySelector('.pz-pan'), k = b.k;
      pan.addEventListener('scroll', () => { pzScroll[k] = pan.scrollLeft; }, { passive: true });
      const firstOpen = Math.max(0, list.findIndex(t => pzGot(t) < 2)), freshAt = fresh.length ? list.findIndex(t => fresh.some(f => f.startsWith(t.id + '-'))) : -1;
      if (freshAt >= 0) pzScroll[k] = null;
      const at = freshAt >= 0 ? freshAt : firstOpen;
      pan.scrollLeft = pzScroll[k] != null ? pzScroll[k] : (cnt(list) === list.length * 2 || at < 1 ? 0 : pan.scrollWidth / list.length * (at - .15));
    });
    pzHits();
    /* 내려갈 판: 완성 축하 → 처음 보는 조각 → 지난번에 보던 판 */
    const fb = fresh.length ? bs.find(x => x.list.some(t => fresh.some(f => f.startsWith(t.id + '-')))) : null;
    const target = pendingCel[0] || (fb && fb.b.k);   // 새 소식이 없으면 맨 위(첫 판)부터
    if (target && stkSec(target)) jumpTo(target, false); else $('#view-stickers').scrollTop = 0;
    paintRowOn();
    /* 보상 받기 연결 (§5-7 ④): 처음 보는 조각은 자리에서 한 번 들썩(108% → 100%, 240ms), 본 것으로 적고 탭의 구리 점을 끈다 */
    if (motion()) fresh.forEach(f => $('#pzBoard').querySelectorAll(`.pzp[data-k="${f}"]`).forEach(p => p.animate([{ transform: 'scale(1.08)' }, { transform: 'none' }], { duration: 240, delay: 260, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' })));
    if (curTab === 'puzzle') pzSeenSave();   // 퍼즐 탭을 열어 봤을 때만 '본 것'(다른 탭에서 그려질 때 점이 꺼지지 않게)
    paintTabBadge();
    drawPlate();
    if (pendingCel.length && !celebrating) { const k2 = pendingCel.shift(); requestAnimationFrame(() => celebrate(k2)); }
  }
  /* 별 조각 카드(앱 모드만, 홈 UI 2판: 흰 카드에 종이 별 하나, 꼭지 다섯 조각): 조각 0~5개, 다 모으면 [동화 하나 열기] → S12 종이별 모드 */
  function drawPlate() {
    const el = $('#pzPlate'); if (!el) return;
    el.hidden = !storeMode;
    if (!storeMode) return;
    const bal = Entitlements.starBalance(), need = Entitlements.STAR_NEED, n = bal % need, full = Math.floor(bal / need);
    el.className = 'pz-plate' + (full ? ' full' : '');
    el.setAttribute('aria-label', L(`별 조각 ${n} / ${need}, 완성한 별 ${full}개`, `Star pieces ${n} / ${need}, ${full} stars`));
    const star = UIA.has('star_one') ? uiImg('star_one') : starSvg;
    /* 다 산 사람(또는 잠긴 동화가 없을 때)은 별을 반짝 스티커에 쓴다(2026-10-31 사용자) */
    const canShine = full > 0 && (Entitlements.state().owned || !Entitlements.lockedChoices().length) && Entitlements.shineChoices().length > 0;
    if (!canShine) shineMode = false;
    /* 완성한 별은 모아 두는 선택권(2026-10-31 사용자): 잠긴 동화를 누르면 '별로 열기 ×N' 으로 쓴다 */
    el.innerHTML = `<div class="plate-art">${starPieces(n)}</div>
      <p class="plate-n"><small>${L('별 조각', 'Star pieces')}</small>${n} / ${need}</p>
      ${full ? `<p class="plate-full">${star}<b>×${full}</b><small>${canShine ? L('반짝 스티커를 만들 수 있어요', 'Makes a sparkly sticker') : L('잠긴 동화를 열 수 있어요', 'Opens a locked tale')}</small></p>` : ''}
      ${canShine ? `<button type="button" class="shine-go${shineMode ? ' on' : ''}" data-act="shine">${shineMode ? L('그만두기', 'Cancel') : L('반짝 스티커 만들기', 'Make a sparkly sticker')}</button>` : ''}`;
  }
  /* 판 완성 연출 한 번: 종이 뒤에서 빛이 번지고, 스티커들이 차례로 뒤집히고, 색종이가 흩날린다 + 음성 */
  function celebrate(k) {
    const b = BOARDS.find(x => x.k === k), sec = stkSec(k), g = sec && sec.querySelector('.pz-track');
    if (!b || !g) return;
    celebrating = true;
    try { AudioFX.sfx('tada', .7); setTimeout(() => AudioFX.sfx('cheer', .5), 700); } catch (e) { /* 소리 없이 */ }   // 팡파르(Kenney CC0) 뒤 박수(Pixabay)
    say(L(b.say, `You finished the ${b.en}!`));
    if (!motion()) { celebrating = false; return; }
    const glow = g.querySelector('.pz-glow');
    glow.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: .95, transform: 'scale(1)', offset: .35 }, { opacity: 0, transform: 'scale(1.25)' }], { duration: 1800, easing: 'ease-out' });
    g.querySelectorAll('.pzp').forEach((s, i) => s.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-10px) scale(1.04)', offset: .45 }, { transform: 'translateY(0) scale(1)' }], { duration: 900, delay: 200 + Math.floor(i / 2) * 140, easing: 'ease-in-out' }));
    const host = confetti();
    setTimeout(() => { host.remove(); celebrating = false; if (pendingCel.length && curTab === 'puzzle') drawStickers(); }, 3600);
  }
  /* 퍼즐 놀이: [흩어지기] = 받은 조각이 판 안 아무 데나 흩어진다(살짝 기울어짐) · 조각을 끌어 제자리 가까이(칸의 30% 안) 놓으면 착 붙는다 ·
     [모으기] = 남은 조각이 모두 제자리로. 다 맞추면 짧게 축하. 위치는 transform 만 바꾸므로 판을 다시 그리면 늘 맞춰진 모습이다 */
  const pzOff = p => ({ x: +p.dataset.dx || 0, y: +p.dataset.dy || 0, r: +p.dataset.dr || 0 });
  const pzSet = (p, x, y, r) => { p.dataset.dx = x; p.dataset.dy = y; p.dataset.dr = r; p.style.transform = x || y || r ? `translate(${x}px, ${y}px) rotate(${r}deg)` : ''; };
  /* 흩어지기: 판 전체에 흩어지되 조각마다 제 칸 둘레(칸 하나 반 안)에 떨어진다 — 휴대폰처럼 판을 옆으로 넘겨 보는 화면에서도 조각과 제자리가 같이 보인다 */
  function pzScatter(sec) {
    const tr = sec.querySelector('.pz-track'), TW = tr.offsetWidth, H = tr.offsetHeight, cell = H / 2;
    sec.classList.add('play');
    sec.querySelectorAll('.pzp.got:not(.fill)').forEach(p => {   // 흩어지는 건 받은 모양 조각만(자투리는 판에 그대로)
      const w = p.offsetWidth, h = p.offsetHeight, cx = p.offsetLeft + w / 2;
      const tx = Math.max(0, Math.min(TW - w, cx - w / 2 + (Math.random() - .5) * cell * 3)), ty = Math.random() * Math.max(0, H - h);
      p.classList.add('loose');
      p.animate([{ transform: p.style.transform || 'none' }, { transform: `translate(${tx - p.offsetLeft}px, ${ty - p.offsetTop}px) rotate(${(Math.random() - .5) * 30}deg)` }], { duration: motion() ? 420 : 1, easing: 'cubic-bezier(.2,.8,.2,1)' });
      pzSet(p, Math.round(tx - p.offsetLeft), Math.round(ty - p.offsetTop), Math.round((Math.random() - .5) * 30));
    });
    try { AudioFX.sfx('pop', .5); } catch (e) { /* 소리 없이 */ }
    say(L('조각을 끌어서 제자리에 놓아 봐요', 'Drag the pieces back into place'));
  }
  function pzGather(sec) {
    sec.querySelectorAll('.pzp.loose').forEach((p, i) => {
      const o = pzOff(p);
      if (motion()) p.animate([{ transform: `translate(${o.x}px, ${o.y}px) rotate(${o.r}deg)` }, { transform: 'none' }], { duration: 420, delay: i * 25, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      pzSet(p, 0, 0, 0); p.classList.remove('loose');
    });
    sec.classList.remove('play');
  }
  /* 조각을 누르거나 끄는 동안 제자리가 반짝인다(조각 모양 그대로 빛나는 자리) — 2026-10-30 사용자 */
  const pzGhost = p => { const g = p.cloneNode(true); g.className = 'pzp pz-ghost'; g.removeAttribute('data-k'); g.style.transform = ''; ['dx', 'dy', 'dr'].forEach(k => delete g.dataset[k]); p.parentNode.insertBefore(g, p.parentNode.firstChild.nextSibling); return g; };
  /* 착 붙으면 조각 둘레로 반짝이 별이 튄다 */
  function pzSparkle(p) {
    if (!motion()) return;
    const tr = p.parentNode, cx = p.offsetLeft + p.offsetWidth / 2, cy = p.offsetTop + p.offsetHeight / 2, R = Math.max(p.offsetWidth, p.offsetHeight) * .6 + 18;
    for (let i = 0; i < 10; i++) {
      const sp = document.createElement('i'); sp.className = 'pz-spark'; sp.innerHTML = starSvg; tr.appendChild(sp);
      const a = i / 10 * Math.PI * 2 + Math.random() * .4, d = R * (.8 + Math.random() * .5);
      sp.style.left = cx + 'px'; sp.style.top = cy + 'px';
      sp.animate([{ transform: 'translate(-50%, -50%) scale(.2)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(1) rotate(${(Math.random() - .5) * 180}deg)`, opacity: 0 }], { duration: 650 + Math.random() * 250, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => sp.remove();
    }
    p.animate([{ filter: 'drop-shadow(0 0 0 rgba(255,214,90,0))' }, { filter: 'drop-shadow(0 0 14px rgba(255,214,90,1))', offset: .3 }, { filter: 'drop-shadow(0 0 0 rgba(255,214,90,0))' }], { duration: 900, easing: 'ease-out' });
  }
  let pzDrag = null;
  $('#pzBoard').addEventListener('pointerdown', e => {
    const p = e.target.closest('.pz-sec.play .pzp.loose'); if (!p || e.button) return;
    e.preventDefault();
    const o = pzOff(p);
    pzDrag = { p, id: e.pointerId, sx: e.clientX - o.x, sy: e.clientY - o.y, cx: e.clientX, cy: e.clientY, ghost: pzGhost(p) };
    p.classList.add('drag'); try { p.setPointerCapture(e.pointerId); } catch (err) { /* 무시 */ }
    pzSet(p, o.x, o.y, 0);
  });
  /* 끄는 동안 판 가장자리에 손가락이 닿으면 판이 그쪽으로 천천히 넘어간다(넘어간 만큼 조각도 따라간다) */
  let pzEdge = 0;
  const pzEdgeTick = () => {
    if (!pzDrag) { pzEdge = 0; return; }
    const pan = pzDrag.p.closest('.pz-pan'), r = pan.getBoundingClientRect(), x = pzDrag.cx, v = x < r.left + 40 ? -8 : x > r.right - 40 ? 8 : 0;
    if (v) { const before = pan.scrollLeft; pan.scrollLeft += v; const d = pan.scrollLeft - before; if (d) { pzDrag.sx -= d; pzSet(pzDrag.p, Math.round(pzDrag.cx - pzDrag.sx), Math.round(pzDrag.cy - pzDrag.sy), 0); } }
    pzEdge = requestAnimationFrame(pzEdgeTick);
  };
  addEventListener('pointermove', e => {
    if (!pzDrag || e.pointerId !== pzDrag.id) return;
    pzDrag.cx = e.clientX; pzDrag.cy = e.clientY;
    pzSet(pzDrag.p, Math.round(e.clientX - pzDrag.sx), Math.round(e.clientY - pzDrag.sy), 0);
    if (!pzEdge) pzEdge = requestAnimationFrame(pzEdgeTick);
  });
  const pzDrop = e => {
    if (!pzDrag || e.pointerId !== pzDrag.id) return;
    const { p, ghost } = pzDrag; pzDrag = null; p.classList.remove('drag'); ghost.remove();
    const o = pzOff(p), sec = p.closest('.pz-sec'), cell = sec.querySelector('.pz-track').offsetHeight / 2;
    if (Math.hypot(o.x, o.y) < cell * .3) {                              // 제자리 가까이 → 착
      if (motion()) p.animate([{ transform: `translate(${o.x}px, ${o.y}px)` }, { transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 260, easing: 'ease-out' });
      pzSet(p, 0, 0, 0); p.classList.remove('loose'); paper('tap'); pzSparkle(p);
      try { AudioFX.sfx('sparkle', .5); } catch (err) { /* 소리 없이 */ }
      if (!sec.querySelector('.pzp.loose')) {                           // 다 맞췄다
        sec.classList.remove('play');
        try { AudioFX.sfx('tada', .6); } catch (err) { /* 소리 없이 */ }
        say(L('다 맞췄어요!', 'All done!'));
        if (motion()) { const host = confetti(); setTimeout(() => host.remove(), 3000); }
      }
    }
  };
  addEventListener('pointerup', pzDrop); addEventListener('pointercancel', pzDrop);
  $('#pzRow').addEventListener('click', e => {
    const b = e.target.closest('.pz-b'); if (!b) return;
    paper('tap'); jumpTo(b.dataset.go);
    const bd = BOARDS.find(x => x.k === b.dataset.go), t = TALES.find(x => x.id === b.dataset.go);
    if (bd) say(L(bd.ko, bd.en)); else if (t) say(shown(t).title);
  });
  $('#pzBoard').addEventListener('click', e => {
    const pb = e.target.closest('.pz-pb');
    if (pb) { const sec = pb.closest('.pz-sec'); paper('tap'); if (pb.dataset.act === 'scatter') pzScatter(sec); else pzGather(sec); return; }
    const cs = e.target.closest('.cs');
    if (cs) {                                                  // 캐릭터 세트 칸: 받은 칸 = 이름 읽기 + 들썩, 빈 칸 = 안내
      if (cs.classList.contains('off')) { paper('down'); say(L('아직 비어 있어요', 'Still empty')); return; }
      if (shineMode && cs.classList.contains('pickable')) {
        const key = cs.closest('.cs-sec').dataset.tale + '.' + cs.dataset.k;
        shineMode = false;
        if (Entitlements.starShine(key)) { try { AudioFX.sfx('sparkle', .7); } catch (er) { /* 소리 없이 */ } say(L('반짝 스티커가 생겼어요!', 'You made a sparkly sticker!')); }
        drawCastAll(); drawPlate(); paintTabBadge();
        const n = $(`.cs-sec[data-tale="${key.split('.')[0]}"] .cs[data-k="${cs.dataset.k}"]`);
        if (n && motion()) n.animate([{ transform: 'scale(.6) rotate(-20deg)' }, { transform: 'scale(1.25) rotate(8deg)', offset: .5 }, { transform: 'scale(1) rotate(0)' }], { duration: 700, easing: 'ease-out' });
        return;
      }
      const c = castSet(cs.closest('.cs-sec').dataset.tale).find(x => x.k === cs.dataset.k); paper('tap'); if (c) say(L(c.ko, c.en));
      if (motion()) cs.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(-9deg) scale(1.12)', offset: .25 }, { transform: 'rotate(7deg) scale(1.08)', offset: .55 }, { transform: 'rotate(-3deg) scale(1.03)', offset: .8 }, { transform: 'rotate(0) scale(1)' }], { duration: 650, easing: 'ease-out' });
      return;
    }
    if (e.target.closest('.pz-sec.play')) return;           // 퍼즐 놀이 중에는 조각 톡 = 끌기
    const s = e.target.closest('.pz-s'); if (!s) return;
    if (s.classList.contains('off')) { paper('down'); say(L('아직 비어 있어요', 'Still empty')); return; }
    paper('tap');
    const t = TALES.find(x => x.id === s.dataset.id);
    if (t) say(shown(t).title);     // 제목 읽기 + 살짝 들림 (동화로 들어가지는 않는다)
    const pp = s.closest('.pzp') || s.closest('.pz-sec').querySelector(`.pzp[data-k="${s.dataset.id}-${s.dataset.part}"]`);
    if (pp && motion()) pp.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-8px) scale(1.04)', offset: .35 }, { transform: 'translateY(0) scale(1)' }], { duration: 520, easing: 'ease-out' });
  });
  $('#pzBoard').addEventListener('keydown', e => { const s = e.target.closest && e.target.closest('.pz-s'); if (s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); s.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
  $('#pzPlate').addEventListener('click', e => {
    if (e.target.closest('[data-act="shine"]')) {
      paper('tap'); shineMode = !shineMode; drawCastAll(); drawPlate();
      if (shineMode) { say(L('반짝이게 할 스티커를 골라요', 'Pick a sticker to make sparkly')); const p = $('#view-stickers .cs.pickable'); if (p) p.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      return;
    }
    if (!e.target.closest('[data-act="pz-open"]')) return;
    paper('tap'); pickKind = 'star'; openFlow('pick', { id: null, sel: null });
  });
  $('#nightGo').addEventListener('click', () => { paper('tap'); setTab('tales'); });
  $('#nightBody').addEventListener('click', e => {
    const n = e.target.closest('[data-bt-count]');
    if (n) { paper('tap'); btSet({ count: Number(n.dataset.btCount) }); renderNight(); return; }
    const g = e.target.closest('[data-bt]');
    if (g && !g.disabled) { btGo(g.dataset.bt); return; }
    if (e.target.closest('[data-bt-edit]')) { paper('tap'); btOpenEditor(); return; }
    const c = e.target.closest('.card'); if (c) activateNight(e, c);
  });

  /* ── 탭 4개 (APP_SCREENS_PLAN §2): 동화 놀이 · 읽어 주기 · 퍼즐 · 스티커북(2026-10-30 사용자: 퍼즐과 스티커를 따로). 해시 #tales #night #puzzle #stickers, 마지막 탭은 기억한다.
     퍼즐·스티커북은 같은 화면(data-view="stickers")을 쓴다 ── */
  const TABS = {
    tales:    { ko: '동화 놀이', en: 'Tale Play',  say: '동화 놀이', view: 'tales' },
    night:    { ko: '읽어 주기', en: 'Read to Me', say: '읽어 주기', view: 'night' },
    puzzle:   { ko: '퍼즐',     en: 'Puzzle',     say: '퍼즐',     view: 'stickers' },
    stickers: { ko: '스티커북', en: 'Sticker Book', say: '스티커북', view: 'stickers' }
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
    document.querySelectorAll('.view').forEach(v => { if (!v.dataset.leaving) v.hidden = v.dataset.view !== TABS[curTab].view; });
    $('#home').dataset.tab = curTab;
    $('#nTitle').textContent = L('잠자리 이야기', 'Bedtime stories');
    $('#nightEmptyT').textContent = L('읽어 주기는 준비 중이에요', 'Read-aloud is getting ready');
    $('#nightGo').textContent = L('동화 탭으로', 'Go to Tales');
    $('#pzEmptyT').textContent = L('동화를 끝까지 하면 스티커가 생겨요', 'Finish a tale to get a sticker');
    $('#emptyT').textContent = L('이 조합의 이야기는 아직 없어요', 'No tales match yet');
    $('#emptyReset').textContent = L('전체 보기', 'Show all');
    if (stkTab()) drawStickers();
  }
  /* 탭 내용 바꾸기 (2026-11-04 모션): 이전 화면은 바로 숨기고, 새 화면은 12px 아래에서 220ms 에 떠오르며 나타난다(두 화면이 겹쳐 보이지 않게).
     고른 탭의 흰 알약(.tab-pill)은 이전 탭 자리에서 새 탭 자리로 미끄러진다. 움직임 줄이기면 모두 바로 바뀐다 */
  const TAB_ORDER = Object.keys(TABS), EASE = 'cubic-bezier(.2,.8,.2,1)';
  const viewOf = k => document.querySelector(`.view[data-view="${TABS[k] ? TABS[k].view : k}"]`);
  const pill = document.createElement('i');
  pill.className = 'tab-pill'; pill.setAttribute('aria-hidden', 'true');
  $('#tabs').insertAdjacentElement('afterbegin', pill);
  function placePill(still) {
    const tb = tabBtns.find(b => b.classList.contains('on')), h = tb && tb.querySelector('.hole');
    if (!h || !h.offsetWidth) return;
    const tabs = $('#tabs');
    if (still) tabs.classList.add('pill-still');
    pill.style.width = h.offsetWidth + 'px'; pill.style.height = h.offsetHeight + 'px';
    pill.style.transform = `translate(${tb.offsetLeft + h.offsetLeft}px, ${tb.offsetTop + h.offsetTop}px)`;
    pill.style.opacity = '1';
    if (still) { void pill.offsetWidth; tabs.classList.remove('pill-still'); }
  }
  addEventListener('resize', () => placePill(true));
  if (window.ResizeObserver) new ResizeObserver(() => placePill(true)).observe($('#tabs'));
  /* 새 탭의 구멍이 열리고(그림 72% → 100%, 감빛 고리) 이전 구멍은 닫힌다 — 움직임은 CSS(.tab.on). 한 번 톡으로 바로 바뀌고 이름을 한 번 읽어 준다 */
  function setTab(k, o = {}) {
    if (!TABS[k]) k = 'tales';
    const prev = curTab;
    if (k === prev && !o.force) return;
    curTab = k;
    paintTabs();
    placePill(!!o.silent || !prev || !motion());
    const nv = viewOf(k);
    if (!o.silent && prev && TABS[prev].view !== TABS[k].view && nv && nv.animate && motion()) nv.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: EASE });   // 퍼즐 ↔ 스티커북은 같은 화면이라 밀지 않고 바로 다시 그린다
    if (!o.silent) { try { localStorage.setItem(TAB_KEY, k); } catch (e) { /* 기억 못 해도 이 화면은 바뀐다 */ } }
    if (!o.silent && location.hash !== '#' + k) { try { history.replaceState(null, '', location.pathname + location.search + '#' + k); } catch (e) { /* 무시 */ } }
    if (o.silent) return;
    paper('tap');
    say(TABS[k].view === 'stickers' && Entitlements.stickerCount() === 0 ? L(`${TABS[k].say}. 동화를 끝까지 하면 생겨요`, `${TABS[k].en}. Finish a tale to get one`) : L(TABS[k].say, TABS[k].en));
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
  /* 탭 알림 점: 퍼즐 = 새 조각이 있을 때(퍼즐 탭을 보고 있지 않을 때), 스티커북 = 종이별이 5개 모였을 때(앱 모드).
     홈 머리 별 조각(2026-10-31 사용자): 톱니 왼쪽에 단색 별(받은 조각만 진하게), 누르면 스티커북 탭의 별 카드로 */
  const starChip = $('#starChip');
  starChip.addEventListener('click', () => { setTab('stickers'); setTimeout(() => { const p = $('#pzPlate'); if (p) p.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 350); });
  function paintTabBadge() {
    const sb = Entitlements.starBalance(), need = Entitlements.STAR_NEED, sn = sb % need, sf = Math.floor(sb / need);
    starChip.hidden = !Entitlements.appMode();
    starChip.classList.toggle('full', sf > 0);
    starChip.innerHTML = starPieces(sn, true) + (sf ? `<b class="chip-n">×${sf}</b>` : '');
    starChip.setAttribute('aria-label', L(`별 조각 ${sn} / ${need}, 완성한 별 ${sf}개`, `Star pieces ${sn} / ${need}, ${sf} stars`));
    const need2 = Entitlements.STAR_NEED, app = Entitlements.appMode();
    const pzCur = curTab !== 'puzzle' ? pzNew() : [];
    const stCur = app && sb >= need2;
    // 새로 생긴 점·별 조각만 날아간다(이미 있던 점·조각은 그대로). 날아가는 동안 점은 숨겨 두었다가 들어가는 순간 나타난다
    const pzFresh = rewardFresh(FLY_PZ, pzCur), starPrev = starSeen(sb);
    if (pzFresh && motion() && !flyBusy.puzzle) { flyBusy.puzzle = true; flyLater(() => flyTo('puzzle', () => { flyBusy.puzzle = false; paintTabBadge(); popBadge('puzzle'); })); }
    else if (stCur && starPrev < need2 && motion() && !flyBusy.stickers) { flyBusy.stickers = true; flyLater(() => flyTo('stickers', () => { flyBusy.stickers = false; paintTabBadge(); popBadge('stickers'); })); }
    else if (app && sb > starPrev && motion() && !flyBusy.star && !flyBusy.stickers) { flyBusy.star = true; flyLater(() => flyTo('star', () => { flyBusy.star = false; })); }
    tabBtns.find(b => b.dataset.tab === 'puzzle').querySelector('.tab-badge').hidden = !(pzCur.length > 0) || flyBusy.puzzle;
    tabBtns.find(b => b.dataset.tab === 'stickers').querySelector('.tab-badge').hidden = !stCur || flyBusy.stickers;
  }
  /* ── 보상 날아가기: 새 조각이 생긴 걸 홈에서 처음 볼 때, 작은 조각이 화면 가운데에서 탭 기호로 곡선을 그리며 들어가고 기호가 톡 튀며 점이 나타난다 ── */
  const FLY_PZ = 'paperTheater.pzFly', FLY_STAR = 'paperTheater.starFly';
  const flyBusy = { puzzle: false, stickers: false, star: false };
  let homeRevealed = false; const flyQueue = [];
  const flyLater = f => { if (homeRevealed) setTimeout(f, 200); else flyQueue.push(f); };
  function homeReveal() { homeRevealed = true; flyQueue.splice(0).forEach(f => setTimeout(f, 450)); }   // 스플래시가 걷힌 뒤에 시작
  /* 이미 알린 조각 목록과 비교해 새 것이 있으면 true. 목록은 지금 있는 것으로 바꿔 둔다(처음 켠 기기는 날리지 않는다) */
  function rewardFresh(key, cur) {
    let raw = null, ann = [];
    try { raw = localStorage.getItem(key); ann = JSON.parse(raw); } catch (e) { ann = null; }
    try { localStorage.setItem(key, JSON.stringify(cur)); } catch (e) { /* 기억 못 하면 날지 않는다 */ }
    return raw !== null && Array.isArray(ann) && cur.some(k => !ann.includes(k));
  }
  function starSeen(sb) {
    let raw = null;
    try { raw = localStorage.getItem(FLY_STAR); localStorage.setItem(FLY_STAR, String(sb)); } catch (e) { /* 무시 */ }
    return raw === null || isNaN(Number(raw)) ? sb : Number(raw);
  }
  const bump = el => { if (el && el.animate) el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 260, easing: EASE }); };
  function popBadge(k) {
    const b = tabBtns.find(x => x.dataset.tab === k).querySelector('.tab-badge');
    if (b && !b.hidden && b.animate) b.animate([{ transform: 'scale(0)' }, { transform: 'scale(1.4)' }, { transform: 'scale(1)' }], { duration: 300, easing: EASE });
  }
  /* GSAP 시험: (sx,sy) 에서 톡 튀어 올랐다가 2차 곡선으로 (ex,ey) 까지. el 은 left/top 이 -크기/2 인 고정 요소(가운데 기준) */
  function arcFly(g, el, sx, sy, ex, ey, s1 = .4) {   // 크기 1 = 200px 별(2026-11-24 사용자: 크게·불투명). 튀어 오름 0.4 → 반짝 펄스 0.3 → 머묾 → 곡선 0.75, 합쳐 약 1.8초
    const hy = sy - 24, cx = (sx + ex) / 2 + (sx - ex) * .3, cy = Math.min(hy, ey) - Math.max(80, innerHeight * .12), o = { t: 0 };
    g.set(el, { x: sx, y: sy + 24, scale: .3, rotation: -10, opacity: 0 });
    return g.timeline()
      .to(el, { y: hy, scale: 1.1, rotation: 0, opacity: 1, duration: .4, ease: 'back.out(2)' })
      .to(el, { scale: 1, duration: .15, ease: 'power1.out' })
      .to(el, { scale: 1.12, duration: .15, ease: 'power1.inOut', yoyo: true, repeat: 1 })
      .to({}, { duration: .2 })
      .to(o, { t: 1, duration: .75, ease: 'power2.inOut', onUpdate: () => {
        const t = o.t, m = 1 - t;
        g.set(el, { x: m * m * sx + 2 * m * t * cx + t * t * ex, y: m * m * hy + 2 * m * t * cy + t * t * ey, scale: 1 + (s1 - 1) * t });
      } });
  }
  /* 받은 칸(과 그 안의 숫자)이 톡 커졌다 돌아온다 */
  function gsapPop(g, box) {
    if (!box) return;
    g.fromTo(box, { scale: 1 }, { scale: 1.28, duration: .16, ease: 'power2.out', yoyo: true, repeat: 1, onComplete: () => g.set(box, { clearProps: 'transform' }) });
    const n = box.querySelector && box.querySelector('.chip-n');
    if (n) g.fromTo(n, { scale: 1 }, { scale: 1.5, duration: .18, delay: .08, ease: 'back.out(3)', yoyo: true, repeat: 1, onComplete: () => g.set(n, { clearProps: 'transform' }) });
  }
  function flyTo(kind, done) {
    if (kind !== 'puzzle' && MT.on() && !window.gsap) { MT.load().then(() => flyTo(kind, done)); return; }   // GSAP 시험: 아직 안 왔으면 기다렸다가(못 오면 원래 연출)
    const tb = kind === 'star' ? starChip : tabBtns.find(x => x.dataset.tab === kind).querySelector('.hole');
    if (!tb || (kind === 'star' && starChip.hidden)) { done(); return; }
    const r = tb.getBoundingClientRect(), ex = r.left + r.width / 2, ey = r.top + r.height / 2, sx = innerWidth / 2, sy = innerHeight / 2;
    const cx = (sx + ex) / 2 + (sx - ex) * .3, cy = Math.min(sy, ey) - Math.max(80, innerHeight * .12);
    const el = document.createElement('div');
    el.className = 'fly-pc'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = kind === 'puzzle' ? mono('puzzle', 'fly-ic') : '<img src="assets/ui/star_one.webp" alt="" draggable="false">';
    document.body.appendChild(el);
    const g = kind !== 'puzzle' && MT.g;
    if (g) {   // GSAP 시험 ② 별 조각: 화면 가운데에서 200px 로 톡 튀어 올라 한 번 반짝이고 머문 뒤 곡선으로 별 칸까지 작아지며 날아가(합쳐 약 1.8초) 붙고, 칸과 숫자가 톡 커졌다 돌아온다
      el.style.cssText = 'width:200px;height:200px;left:-100px;top:-100px;z-index:2147483000';
      const im = el.querySelector('img'); if (im) im.style.cssText = 'width:100%;height:100%;display:block;object-fit:contain';
      const tl = arcFly(g, el, sx, sy, ex, ey, Math.max(.2, Math.min(r.width, r.height) / 200));
      tl.eventCallback('onComplete', () => { el.remove(); paper('up'); gsapPop(g, kind === 'star' ? starChip : tb.querySelector('.tab-ic')); done(); });
      return;
    }
    const kf = [{ transform: `translate(${sx}px, ${sy}px) scale(.3)`, opacity: 0, offset: 0 }, { transform: `translate(${sx}px, ${sy}px) scale(1.5)`, opacity: 1, offset: .18 }];
    for (let i = 1; i <= 14; i++) {
      const u = i / 14, t = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2, m = 1 - t;
      kf.push({ transform: `translate(${(m * m * sx + 2 * m * t * cx + t * t * ex).toFixed(1)}px, ${(m * m * sy + 2 * m * t * cy + t * t * ey).toFixed(1)}px) scale(${(1.5 - .8 * t).toFixed(3)})`, opacity: 1, offset: .18 + .82 * u });
    }
    const a = el.animate(kf, { duration: 900, easing: 'linear', fill: 'forwards' });
    a.onfinish = () => { el.remove(); paper('up'); bump(kind === 'star' ? starChip : tb.querySelector('.tab-ic')); done(); };
    a.oncancel = () => { el.remove(); done(); };
  }
  /* 탭 기호: 단색(홈 UI 2판). 고른 탭은 CSS 가 진한 먹색 + 흰 알약으로 */
  tabBtns.forEach(b => { b.querySelector('.hole').innerHTML = mono(b.dataset.tab, 'tab-ic'); });
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
  function splash(done, after) {
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
      if (after) setTimeout(after, 300);   // 스플래시가 다 걷히고 홈이 보인 뒤(처음 안내)
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
    const gl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
    if (!gl) { pending = setTimeout(complete, 1600); return; }   // WebGL 이 없으면 3D 장면을 받지 않고 정적 로고만 잠깐 보이다 넘어간다
    pending = setTimeout(complete, 5000);   // 3D 장면을 못 받으면 정적 첫 화면만 보이다 넘어간다
    import('./engine/splash/start.js?v=20261108jg3')
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
    if (first && location.hash !== '#parent') splash(() => { update({ intro: true, delay: .04, step: .035 }); homeReveal(); }, introAuto);   // 처음 안내는 스플래시가 끝난 뒤에만
    else { update({ intro: true, delay: .02, step: .03 }); homeReveal(); }
  }

  /* 처음 탭: 주소의 해시 → 마지막으로 본 탭 → 동화 */
  let startTab = tabFromHash();
  if (!startTab) try { const m = localStorage.getItem(TAB_KEY); if (TABS[m]) startTab = m; } catch (e) { /* 기억 없음 */ }
  setTab(startTab || 'tales', { silent: true, force: true });
  requestAnimationFrame(() => requestAnimationFrame(() => $('#tabs').classList.add('ready')));   // 첫 그림 뒤부터 탭 구멍이 움직인다

  /* ── 누름 반응 (§5-3): pointerdown 에서 .is-pressed, pointerup·cancel 에서 뗀다. 모양은 CSS 가 정한다 ── */
  const PRESS = '.star-open, .star-chip, .tab, .card, .pz-b, .pick, .pl-tile, .round, .pz-pb, .pz-open, .b-go, .b-play, .b-chip, .hero-play, .hd, .ticket, .pl-top, .pl-b, .g-item, .gate-opt, .b-edit';
  let pressed = null, pressX = 0, pressY = 0;
  const unpress = () => { if (pressed) { pressed.classList.remove('is-pressed'); pressed = null; } };
  addEventListener('pointermove', e => { if (pressed && Math.hypot(e.clientX - pressX, e.clientY - pressY) > 8) unpress(); }, true);   // 스크롤하려고 끈 손가락은 누름으로 치지 않는다
  document.addEventListener('pointerdown', e => {
    unpress();
    if (e.button) return;
    const el = e.target.closest && e.target.closest(PRESS);
    if (!el || el.disabled) return;
    pressed = el; pressX = e.clientX; pressY = e.clientY; el.classList.add('is-pressed');
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

