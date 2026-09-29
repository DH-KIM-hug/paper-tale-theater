/* 종이 동화극장 — 앱 홈: 태그로 고르기 (HOME_UI_PLAN.md v2)
   · 같은 줄 안에서 여러 개 = 또는(OR), 두 줄 사이 = 그리고(AND), 아무것도 안 고른 줄 = 전체
   · 고른 태그와 설정은 localStorage 에 기억 (막혀 있어도 정상 동작) */
(() => {
  const $ = s => document.querySelector(s);
  const STORE = 'paperTheater.home.v2';

  /* ── 저장 ── */
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ origin: [...sel.origin], skill: [...sel.skill], speak })); } catch (e) { /* 무시 */ }
  }
  const saved = load();
  const valid = (row, list) => (Array.isArray(list) ? list : []).filter(k => TAGS[row].some(t => t.key === k));
  const sel = { origin: new Set(valid('origin', saved.origin)), skill: new Set(valid('skill', saved.skill)) };
  let speak = saved.speak !== false;

  /* ── 소리 ── */
  function say(text) {
    if (!speak || typeof Narrator === 'undefined') return;
    try { Narrator.speak(text); } catch (e) { /* 무시 */ }
  }
  function tapSound() {
    try { if (typeof AudioFX !== 'undefined' && AudioFX.tap) AudioFX.tap(); } catch (e) { /* 무시 */ }
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
    if (changed) renderShelf();
  }

  /* ── 태그 칩 ── */
  const icon = (key, cls = 'ic') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${key}"/></svg>`;

  function buildChips(row) {
    const box = document.querySelector(`.tagrow[data-row="${row}"] .chips`);
    const all = `<button type="button" class="chip all" data-row="${row}" data-key="">${icon('all')}<span>전체</span></button>`;
    box.innerHTML = all + TAGS[row].map(t =>
      `<button type="button" class="chip" data-row="${row}" data-key="${t.key}"${t.color ? ` style="--tc:${t.color}"` : ''}>${icon(t.key)}<span>${t.label}</span></button>`
    ).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b) return;
      const key = b.dataset.key;
      tapSound();
      if (!key) { sel[row].clear(); say(row === 'origin' ? '이야기 전체' : '배우는 것 전체'); }
      else if (sel[row].has(key)) sel[row].delete(key);
      else { sel[row].add(key); say(TAGS[row].find(t => t.key === key).say); }
      b.classList.remove('stamp'); void b.offsetWidth; b.classList.add('stamp');
      update();
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

  /* ── 선반 ── */
  const TILT = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.4, 1.3, -1.1, 0.6, -0.3];
  const ORIGIN = Object.fromEntries(TAGS.origin.map(t => [t.key, t]));
  const SKILL = Object.fromEntries(TAGS.skill.map(t => [t.key, t]));

  const match = t =>
    (sel.origin.size === 0 || sel.origin.has(t.origin)) &&
    (sel.skill.size === 0 || t.skills.some(k => sel.skill.has(k)));

  const curtain = `<svg class="curtain" viewBox="0 0 160 110" preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="81" height="110" fill="#A93B32"/><rect x="79" y="0" width="81" height="110" fill="#A93B32"/><rect x="79" y="0" width="2" height="110" fill="#6E241F"/>
      <g fill="#8A2E27"><rect x="14" width="7" height="110"/><rect x="36" width="7" height="110"/><rect x="58" width="7" height="110"/>
      <rect x="95" width="7" height="110"/><rect x="117" width="7" height="110"/><rect x="139" width="7" height="110"/></g>
      <path d="M0 0 H160 V12 Q150 20 140 12 Q130 20 120 12 Q110 20 100 12 Q90 20 80 12 Q70 20 60 12 Q50 20 40 12 Q30 20 20 12 Q10 20 0 12Z" fill="#D9A94E" filter="url(#pp)"/>
    </svg>
    <span class="sign" aria-hidden="true"><b>곧 열려요</b></span>`;

  function cardHTML(t, i) {
    const open = readyNow.has(t.id);
    const o = ORIGIN[t.origin];
    const skills = t.skills.map(k => `<span class="sk" title="${SKILL[k].label}">${icon(k)}</span>`).join('');
    const inner = `
      <span class="thumb">
        <svg class="art" viewBox="0 0 160 110" aria-hidden="true">${t.art}</svg>
        ${open ? '' : curtain}
      </span>
      <span class="label">
        <strong class="title">${t.title}</strong>
        <span class="line">${t.line}</span>
        <span class="tags"><span class="org" title="${o.label}">${icon(t.origin)}</span>${skills}</span>
      </span>`;
    const style = `--tilt:${TILT[i % TILT.length]}deg;--oc:${o.color}`;
    return open
      ? `<li class="slot"><a class="card" href="tales/${t.folder || t.id}/index.html" data-id="${t.id}" style="${style}">${inner}</a></li>`
      : `<li class="slot"><div class="card closed" role="button" tabindex="0" aria-disabled="true" aria-label="${t.title}, 곧 열려요" data-id="${t.id}" style="${style}">${inner}</div></li>`;
  }

  function renderShelf() {
    const list = TALES.filter(match);
    /* 열린 동화 먼저, 커튼 닫힌 동화는 뒤에 (카탈로그 순서 유지) */
    const sorted = [...list.filter(t => readyNow.has(t.id)), ...list.filter(t => !readyNow.has(t.id))];
    $('#grid').innerHTML = sorted.map((t, i) => cardHTML(t, TALES.indexOf(t))).join('');
    $('#empty').hidden = sorted.length > 0;
  }

  function update() {
    paintChips();
    renderShelf();
    save();
  }

  /* 카드 누르기: 열린 카드는 극장으로, 닫힌 카드는 커튼이 살짝 흔들린다 */
  $('#grid').addEventListener('click', e => {
    const c = e.target.closest('.card');
    if (!c) return;
    const t = TALES.find(x => x.id === c.dataset.id);
    if (c.classList.contains('closed')) {
      e.preventDefault();
      tapSound();
      c.classList.remove('peek'); void c.offsetWidth; c.classList.add('peek');
      say(`${t.title}. 곧 열려요.`);
      return;
    }
    tapSound();
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (err) { /* 무시 */ }
  });
  $('#grid').addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('closed')) { e.preventDefault(); e.target.click(); }
  });

  function resetFilters() { sel.origin.clear(); sel.skill.clear(); update(); }
  $('#emptyReset').addEventListener('click', () => { tapSound(); resetFilters(); });

  /* ── 보호자 메뉴: 톱니를 3초 동안 눌러야 열린다 ── */
  const gear = $('#parentBtn'), panel = $('#parentPanel'), hint = $('#hint');
  let holdTimer = 0, hintTimer = 0, opened = false;
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

  function openPanel() {
    hint.hidden = true;
    $('#optSpeak').checked = speak;
    panel.hidden = false;
    $('#parentClose').focus();
  }
  const closePanel = () => { panel.hidden = true; };
  $('#parentClose').addEventListener('click', closePanel);
  panel.addEventListener('click', e => { if (e.target === panel) closePanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) closePanel(); });
  $('#optSpeak').addEventListener('change', e => { speak = e.target.checked; save(); });
  $('#optReset').addEventListener('click', () => { resetFilters(); closePanel(); });

  /* 확인용: index.html#parent 로 열면 보호자 메뉴가 바로 열린다 */
  if (location.hash === '#parent') openPanel();

  buildChips('origin');
  buildChips('skill');
  update();
  probeMaking();
})();
