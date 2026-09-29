/* 종이 동화극장 — 앱 홈: 태그로 고르기 (HOME_UI_PLAN.md v2) + 움직임 (v3)
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
  function fx(name) {
    try { if (typeof AudioFX !== 'undefined' && AudioFX[name]) AudioFX[name](); } catch (e) { /* 무시 */ }
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
      `<button type="button" class="chip${key ? '' : ' all'}" data-row="${row}" data-key="${key}" aria-label="${label}"><span class="face">${icon(ic)}<span class="lb" aria-hidden="true">${letters(label)}</span></span></button>`;
    box.innerHTML = chip('', '전체', 'all') + TAGS[row].map(t => chip(t.key, t.label, t.key)).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('.chip');
      if (!b) return;
      const key = b.dataset.key;
      fx('tap');
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

  /* ── 선반 ── */
  const TILT = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.4, 1.3, -1.1, 0.6, -0.3];
  const ORIGIN = Object.fromEntries(TAGS.origin.map(t => [t.key, t]));
  const SKILL = Object.fromEntries(TAGS.skill.map(t => [t.key, t]));
  const DRAPE_REST = .16;

  const match = t =>
    (sel.origin.size === 0 || sel.origin.has(t.origin)) &&
    (sel.skill.size === 0 || t.skills.some(k => sel.skill.has(k)));

  const PIC = new Set(window.THUMBS || []);
  const stageBits = '<span class="drape l"></span><span class="drape r"></span><span class="valance"></span>';

  function cardHTML(t) {
    const open = readyNow.has(t.id);
    const o = ORIGIN[t.origin];
    const skills = t.skills.map(k => `<span class="sk" title="${SKILL[k].label}">${icon(k)}</span>`).join('');
    const sign = open ? '' : '<span class="sign" aria-hidden="true"><b>곧 열려요</b></span>';
    // 동화마다 모양이 다른 오목한 종이 액자 그림이 있으면 그것을, 없으면 작은 종이 극장
    const pic = PIC.has(t.id)
      ? `<span class="thumb pic"><img class="art" src="assets/thumbs/${t.id}.webp" alt="" loading="lazy" decoding="async">${sign}</span>`
      : `<span class="thumb">
        <svg class="art" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${t.art}</svg>
        ${stageBits}${sign}
      </span>`;
    const inner = `
      ${pic}
      <span class="label">
        <strong class="title">${t.title}</strong>
        <span class="line">${t.line}</span>
        <span class="tags"><span class="org" title="${o.label}">${icon(t.origin)}</span>${skills}</span>
      </span>`;
    const attrs = `data-id="${t.id}" data-origin="${t.origin}" style="--tilt:${TILT[TALES.indexOf(t) % TILT.length]}deg"`;
    return open
      ? `<a class="card" href="tales/${t.folder || t.id}/index.html" ${attrs}>${inner}</a>`
      : `<div class="card closed" role="button" tabindex="0" aria-disabled="true" aria-label="${t.title}, 곧 열려요" ${attrs}>${inner}</div>`;
  }

  /* 선반 다시 그리기 + FLIP:
     · 남는 카드 = 예전 자리에서 새 자리로 스프링으로 미끄러지고, 살짝 앞으로 튀어나온다
     · 새로 들어오는 카드 = 위에서 선반 위로 떨어져 통통 튄다(차례로) + 무대 커튼이 열린다
     · 빠지는 카드 = 제자리에 핀으로 꽂힌 채 작아지며 사라진다
     · 방금 준비된 동화(닫힘 → 열림) = 커튼이 걷힌다 */
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
    const sorted = [...TALES.filter(t => readyNow.has(t.id)), ...TALES.filter(t => !readyNow.has(t.id))];
    let shown = 0;
    grid.innerHTML = sorted.map(t => {
      const m = match(t), b = before.get(t.id);
      if (m) shown++;
      if (!m && b && animate) {
        return `<li class="slot leaving" data-id="${t.id}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px">${cardHTML(t)}</li>`;
      }
      return `<li class="slot" data-id="${t.id}"${m ? '' : ' hidden'}>${cardHTML(t)}</li>`;
    }).join('');
    $('#empty').hidden = shown > 0;
    if (!animate) return;

    const g1 = grid.getBoundingClientRect(), vh = innerHeight, items = [];
    const delay0 = opts.delay || .04, step = opts.step || .045;
    let k = 0;
    grid.querySelectorAll('.slot:not([hidden])').forEach(s => {
      const card = s.firstElementChild, id = s.dataset.id, open = card.tagName === 'A';
      const drapes = open ? [...card.querySelectorAll('.drape')] : null;
      if (s.classList.contains('leaving')) { items.push({ kind: 'out', card }); return; }
      const r = s.getBoundingClientRect(), b = before.get(id);
      if (b) {
        items.push({ kind: 'stay', card, dx: b.x - (r.left - g1.left), dy: b.y - (r.top - g1.top), drapes: open && !b.open ? drapes : null });
      } else {
        const seen = r.top < vh && r.bottom > 0;
        items.push({ kind: 'in', card, at: delay0 + (seen ? Math.min(k++ * step, .45) : 0), drapes });
      }
    });
    items.forEach(it => it.card.classList.add('anim'));
    const openDrapes = (ds, tt) => {
      if (!ds || ds.length < 2) return; // 종이 액자 그림 카드에는 커튼이 없다
      const c = eio(tt / .42);
      ds[0].style.transform = `scaleX(${lerp(1, DRAPE_REST, c).toFixed(4)})`;
      ds[1].style.transform = `scaleX(${lerp(1, DRAPE_REST, eio((tt - .05) / .42)).toFixed(4)})`;
    };
    gridAnim = play(delay0 + .95, t => {
      for (const it of items) {
        const c = it.card;
        if (it.kind === 'out') {
          const q = eio(t / .26);
          c.style.opacity = (1 - q).toFixed(3);
          tf(c, 0, 16 * q, 1 - .2 * q, -5 * q);
        } else if (it.kind === 'stay') {
          const s = spring(t, .62, 16), pop = Math.sin(Math.PI * clamp(t / .42)) * .05;
          tf(c, it.dx * (1 - s), it.dy * (1 - s), 1 + pop, 0);
          if (it.drapes) openDrapes(it.drapes, t - .12);
        } else {
          const tt = t - it.at, s = spring(tt, .42, 15);
          c.style.opacity = clamp(tt / .08).toFixed(3);
          tf(c, 0, -48 * (1 - s), .86 + .14 * s, -6 * (1 - s));
          if (it.drapes) openDrapes(it.drapes, tt - .1);
        }
      }
    }, () => {
      grid.querySelectorAll('.slot.leaving').forEach(s => { s.hidden = true; s.classList.remove('leaving'); s.removeAttribute('style'); });
      items.forEach(it => {
        untf(it.card);
        it.card.classList.remove('anim');
        if (it.drapes) it.drapes.forEach(d => { d.style.transform = ''; });
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

  function update(opts) {
    paintChips();
    render(opts);
    save();
  }

  /* ── 카드 누르기 ── */
  let leavingPage = false;
  /* 카드 → 무대: 썸네일이 화면 가득 커지고(모양 그대로), 막이 내리듯 커튼이 닫히면 동화로 넘어간다.
     닫힌 커튼이 페이지를 불러오는 틈을 가려 준다. 전부 0.68초. 애니메이션이 멈춰도 1.2초 뒤엔 넘어간다. */
  function openTale(card) {
    const href = card.getAttribute('href');
    if (leavingPage) return;
    leavingPage = true;
    let gone = false;
    const go = () => { if (!gone) { gone = true; location.href = href; } };
    if (!motion()) { go(); return; }
    const art = card.querySelector('.art'), r = art.getBoundingClientRect();
    const vw = innerWidth, vh = innerHeight, AR = r.width / r.height;
    const W = Math.max(vw, vh * AR), H = W / AR, X = (vw - W) / 2, Y = (vh - H) / 2, s0 = r.width / W;
    const ov = $('#stageOut'), veil = ov.querySelector('.so-veil'), box = ov.querySelector('.so-box');
    box.innerHTML = (art.tagName === 'IMG'
      ? `<img src="${art.getAttribute('src')}" alt="">`
      : `<svg viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice">${art.innerHTML}</svg>`) + stageBits;
    box.style.width = W + 'px';
    box.style.height = H + 'px';
    const [dl, dr] = box.querySelectorAll('.drape');
    ov.hidden = false;
    const fallback = setTimeout(go, 1200);
    setTimeout(() => fx('swish'), 360);
    card.classList.add('anim');
    play(.68, t => {
      card.style.scale = (1 - .05 * Math.sin(Math.PI * clamp(t / .14))).toFixed(4);
      veil.style.opacity = (.7 * eo(t / .3)).toFixed(3);
      const k = eio((t - .05) / .42);
      box.style.transform = `translate(${lerp(r.left, X, k).toFixed(2)}px, ${lerp(r.top, Y, k).toFixed(2)}px) scale(${lerp(s0, 1, k).toFixed(4)})`;
      dl.style.transform = `scaleX(${lerp(DRAPE_REST, 1, eio((t - .36) / .3)).toFixed(4)})`;
      dr.style.transform = `scaleX(${lerp(DRAPE_REST, 1, eio((t - .38) / .3)).toFixed(4)})`;
    }, () => { clearTimeout(fallback); go(); });
  }
  /* 뒤로 가기로 돌아왔을 때(페이지 캐시) 전환 막을 걷는다 */
  addEventListener('pageshow', e => {
    if (!e.persisted) return;
    leavingPage = false;
    $('#stageOut').hidden = true;
    document.querySelectorAll('.card.anim').forEach(c => { untf(c); c.classList.remove('anim'); });
  });

  /* 닫힌 카드: 커튼이 살짝 들썩이며 틈이 벌어졌다 닫힌다 */
  function peek(c) {
    if (!motion()) return;
    const ds = [...c.querySelectorAll('.drape')];
    if (ds.length < 2) { // 종이 액자 카드: 그림이 도리도리 흔들린다
      const img = c.querySelector('.thumb img');
      img && img.animate([{ rotate: '0deg' }, { rotate: '-4deg' }, { rotate: '3deg' }, { rotate: '-1.5deg' }, { rotate: '0deg' }], { duration: 600, easing: 'ease-out' });
      return;
    }
    c.classList.add('anim');
    play(.8, t => {
      const open = t < .15 ? Math.sin(Math.PI / 2 * t / .15) : wob(t - .15, .32, 20);
      const sk = 2 * wob(t, .3, 18);
      ds[0].style.transform = `scaleX(${(1 - .16 * open).toFixed(4)}) skewY(${sk.toFixed(2)}deg)`;
      ds[1].style.transform = `scaleX(${(1 - .16 * open).toFixed(4)}) skewY(${(-sk).toFixed(2)}deg)`;
    }, () => { ds.forEach(d => { d.style.transform = ''; }); c.classList.remove('anim'); });
  }

  $('#grid').addEventListener('click', e => {
    const c = e.target.closest('.card');
    if (!c || c.closest('.leaving')) return;
    const t = TALES.find(x => x.id === c.dataset.id);
    if (c.classList.contains('closed')) {
      e.preventDefault();
      fx('tap');
      peek(c);
      say(`${t.title}. 곧 열려요.`);
      return;
    }
    fx('tap');
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (err) { /* 무시 */ }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;   // 새 탭 열기는 그대로
    e.preventDefault();
    openTale(c);
  });
  $('#grid').addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('closed')) { e.preventDefault(); e.target.click(); }
  });

  function resetFilters() { sel.origin.clear(); sel.skill.clear(); update(); }
  $('#emptyReset').addEventListener('click', () => { fx('tap'); resetFilters(); });

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

  /* ── 여는 장면 (1.5초 안, 아무 데나 누르면 건너뜀) ──
     흩어진 색종이 조각이 포물선을 그리며 날아와 로고 글자 조각이 되고(파티클 로고),
     태그 칩이 차례로 붙고, 카드가 선반 위로 떨어진다(스프링 스택).
     같은 탭(세션)에서 두 번째부터는 카드만 짧게 떨어진다. */
  function intro() {
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
    const PAL = ['#D9A94E', '#D26A4C', '#3F6B4F', '#3D5A94', '#7E6AAE', '#A93B32', '#C97891', '#F4EAD3'];
    const bits = [];
    tiles.forEach((el, i) => {
      const r = el.getBoundingClientRect(), col = getComputedStyle(el).getPropertyValue('--c').trim() || getComputedStyle(el).backgroundColor;
      for (let j = 0; j < 9; j++) {
        const d = document.createElement('i');
        d.className = 'bit b' + (j % 3);
        d.style.background = j < 5 ? col : PAL[(i + j) % PAL.length];
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
})();
