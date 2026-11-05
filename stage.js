/* 톡톡 동화극장 — 스티커북 「내 무대 꾸미기」 (docs/STICKER_STAGE_PLAN.md, 2026-11-05 확정)
   · 종이 배경 한 장 위에 모은 친구 스티커를 끌어다 붙여 내 장면을 만든다. 저장 단추 없이 저절로 남는다(기기 안만).
   · 붙이기 = 서랍에서 끌기 또는 톡(가운데 빈 자리로 날아감) · 옮기기 = 끌기 · 떼기 = 서랍으로 끌어 내림 · 톡 = 이름 + 좌우 뒤집기
   · 크기 조절·회전·두 손가락 없음. 첫 손가락 하나만.
   · 무대 위 스티커는 칼선+그림자를 캔버스에 한 번 구워(평소·들림 두 장) 끌 때는 transform 만 바꾼다(아이패드 사파리 성능).
   · 홈(home.js)은 Stage.init 으로 소리·글·썸네일 도구를 넘기고, 스티커북 탭 '내 무대' 줄은 Stage.rowHTML / Stage.bindRow 로 그린다. */
(() => {
  const KEY = 'paperTheater.stages', CUR = 'paperTheater.stageCur', HINTED = 'paperTheater.stageHinted', BG_SEEN = 'paperTheater.stageBgSeen';
  const MAX_SCENES = 12, MAX_ITEMS = 30;
  /* 배경 6장: 앞 3장은 처음부터, 나머지는 친구 스티커 10·20·30장에 저절로 열린다(돈·별과 무관, 판단 ①) */
  const BGS = [
    { id: 'forest', ko: '숲', en: 'Forest', need: 0 },
    { id: 'sea', ko: '바다', en: 'Sea', need: 0 },
    { id: 'night', ko: '밤하늘', en: 'Night sky', need: 0 },
    { id: 'snow', ko: '눈 마을', en: 'Snow village', need: 10 },
    { id: 'castle', ko: '성', en: 'Castle', need: 20 },
    { id: 'meadow', ko: '꽃밭', en: 'Flower meadow', need: 30 },
  ];
  const bgSrc = (id, tall) => `assets/stage/${id}_${tall ? 'tall' : 'wide'}.webp`;
  const SFX = ['paper_up', 'paper_down', 'paper_tap', 'swish', 'rustle_1', 'page_turn_big', 'pop_appear', 'pop', 'whoosh', 'zip_away', 'sparkle'];
  const EASE = 'cubic-bezier(.2,.8,.2,1)', MOVE = 'cubic-bezier(.45,0,.1,1)';

  /* ── 홈이 넘겨주는 도구(없어도 돌아가게 기본값) ── */
  let H = {
    L: (ko, en) => { try { return localStorage.getItem('lang') === 'en' ? en : ko; } catch (e) { return ko; } },
    tileSrc: () => '', title: id => id, onClose: () => {}, motion: () => !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches),
  };
  const L = (ko, en) => H.L(ko, en);
  const motion = () => H.motion();
  const sfx = (n, v) => { try { if (typeof AudioFX !== 'undefined') AudioFX.sfx(n, v); } catch (e) { /* 소리 없이 */ } };
  /* 말은 녹음된 한국어 문구를 열쇠로 부른다(영어 모드면 audio.js 가 같은 열쇠의 영어 클립을 고른다). 녹음 없는 말은 하지 않는다 */
  const say = ko => { try { if (typeof Narrator !== 'undefined') Narrator.speak(ko, { bubble: false }); } catch (e) { /* 무시 */ } };
  const hush = () => { try { if (typeof Narrator !== 'undefined') Narrator.stop(); } catch (e) { /* 무시 */ } };
  const sayName = c => { try { if (typeof Narrator !== 'undefined') Narrator.speak(L(c.ko, c.en), { bubble: false }); } catch (e) { /* 무시 */ } };

  /* ── 스티커 자료 ── */
  const castKeys = () => { try { return Entitlements.state().cast.slice(); } catch (e) { return []; } };
  const castN = () => castKeys().length;
  function info(key) {
    const i = key.indexOf('.'), tale = key.slice(0, i), k = key.slice(i + 1);
    const set = (typeof STICKERS !== 'undefined' && STICKERS[tale]) || [];
    const c = set.find(x => x.k === k);
    return c && c.img ? { key, tale, k, img: c.img, ko: c.ko, en: c.en, sh: c.sh || 1, kid: !!c.kid } : null;
  }
  const shiny = key => { try { return Entitlements.isShiny(key); } catch (e) { return false; } };
  const bgOpen = b => castN() >= b.need;

  /* ── 저장(기기 안만, 판단 ⑧) ── */
  function scenes() {
    try { const a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a.filter(s => s && s.id && Array.isArray(s.items)) : []; } catch (e) { return []; }
  }
  function writeScenes(a) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(0, MAX_SCENES))); } catch (e) { /* 저장 못 해도 이번 화면은 그대로 */ } }
  function putScene(s) {
    const a = scenes().filter(x => x.id !== s.id);
    s.at = Date.now();
    a.unshift(s);                                         // 최근 것이 앞
    writeScenes(a);
    try { localStorage.setItem(CUR, s.id); } catch (e) { /* 무시 */ }
  }
  function removeScene(id) { writeScenes(scenes().filter(x => x.id !== id)); }

  /* ── 칼선 + 그림자 굽기: 스티커당 한 번, 평소·들림 두 장 ── */
  const BAKE_H = 480, baked = new Map();
  function loadImg(src) {
    return new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = rej; im.src = src; });
  }
  async function bake(key) {
    if (baked.has(key)) return baked.get(key);
    const p = (async () => {
      const c = info(key); if (!c) return null;
      const im = await loadImg(c.img);
      const s = BAKE_H / im.naturalHeight, w = Math.round(im.naturalWidth * s), h = BAKE_H;
      const r = Math.round(h * .013), pad = Math.round(h * .14);
      try {
        /* 1) 모양 그대로 흰색(반짝 스티커는 무지갯빛) 실루엣 */
        const sil = document.createElement('canvas'); sil.width = w; sil.height = h;
        const sx = sil.getContext('2d'); sx.drawImage(im, 0, 0, w, h); sx.globalCompositeOperation = 'source-in';
        if (shiny(key)) { const g = sx.createLinearGradient(0, 0, w, h); ['#FF8FB1', '#FFD36E', '#9BE7A8', '#8FD3FF', '#C9A7FF', '#FF8FB1'].forEach((col, i, a) => g.addColorStop(i / (a.length - 1), col)); sx.fillStyle = g; }
        else sx.fillStyle = '#fff';
        sx.fillRect(0, 0, w, h);
        /* 2) 실루엣을 둘레로 돌려 찍어 칼선, 위에 그림 */
        const cut = document.createElement('canvas'); cut.width = w + 2 * r; cut.height = h + 2 * r;
        const cx = cut.getContext('2d');
        for (let a = 0; a < 16; a++) { const t = a / 16 * Math.PI * 2; cx.drawImage(sil, r + Math.cos(t) * r, r + Math.sin(t) * r); }
        cx.drawImage(im, r, r, w, h);
        /* 3) 그림자: 평소(얕게) · 들림(깊게) — 흐림값을 움직이지 않고 두 장을 바꿔 보인다 */
        const shot = (dy, blur, a) => {
          const f = document.createElement('canvas'); f.width = cut.width + 2 * pad; f.height = cut.height + 2 * pad;
          const fx = f.getContext('2d'); fx.shadowColor = `rgba(46, 36, 28, ${a})`; fx.shadowBlur = blur; fx.shadowOffsetY = dy;
          fx.drawImage(cut, pad, pad);
          return f.toDataURL('image/png');
        };
        return { flat: shot(h * .012, h * .022, .35), up: shot(h * .05, h * .07, .28), w: cut.width, h: cut.height, pad, ar: cut.width / cut.height };
      } catch (e) {
        /* 굽기 못 함(예: file:// 로 연 페이지) → CSS 칼선으로 */
        return { flat: c.img, up: c.img, w, h, pad: 0, ar: w / h, css: true };
      }
    })().catch(() => null);
    baked.set(key, p);
    return p;
  }

  /* ── 화면 ── */
  let root = null, board = null, bgA = null, drawer = null, strip = null, fly = null;
  let scene = null, isNew = false, tall = false, boardR = null, unit = 0;
  let saveT = 0, idleT = 0, hintT = 0, firstVisit = false, openerRect = null, opener = null;
  const els = new Map();                                   // 무대 위 스티커: key → 요소

  function build() {
    if (root) return;
    root = document.createElement('section');
    root.id = 'stage'; root.className = 'sg'; root.hidden = true;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true');
    root.innerHTML = `
      <div class="sg-top">
        <button type="button" class="sg-btn sg-close" data-act="close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        <span class="sg-sp"></span>
        <button type="button" class="sg-btn sg-bgbtn" data-act="bg"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.6"/></svg></button>
        <button type="button" class="sg-btn sg-reset holdbtn" data-act="reset"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/></svg></button>
      </div>
      <div class="sg-mid">
        <div class="sg-board"><div class="sg-bg"></div><div class="sg-items"></div>
          <div class="sg-strip" hidden><div class="sg-strip-row"></div></div></div>
      </div>
      <div class="sg-drawer" role="list"></div>
      <div class="sg-fly" aria-hidden="true"></div>`;
    document.body.appendChild(root);
    board = root.querySelector('.sg-board'); bgA = root.querySelector('.sg-bg');
    drawer = root.querySelector('.sg-drawer'); strip = root.querySelector('.sg-strip'); fly = root.querySelector('.sg-fly');
    root.addEventListener('click', onClick);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !root.hidden) { e.preventDefault(); if (!strip.hidden) toggleStrip(false); else close(); } });
    board.addEventListener('pointerdown', onBoardDown);
    drawer.addEventListener('pointerdown', onDrawerDown);
    addEventListener('pointermove', onMove, { passive: false });
    addEventListener('pointerup', onUp);
    addEventListener('pointercancel', onCancel);
    addEventListener('resize', () => { if (!root.hidden) layout(); });
    holdReset(root.querySelector('.sg-reset'));
    try { AudioFX.preloadSfx(SFX); } catch (e) { /* 무시 */ }
  }
  function labels() {
    root.setAttribute('aria-label', L('내 무대 꾸미기', 'My stage'));
    root.querySelector('.sg-close').setAttribute('aria-label', L('닫기', 'Close'));
    root.querySelector('.sg-bgbtn').setAttribute('aria-label', L('배경 고르기', 'Pick a background'));
    root.querySelector('.sg-reset').setAttribute('aria-label', L('처음부터 (꾹 누르기)', 'Start over (press and hold)'));
    drawer.setAttribute('aria-label', L('스티커 서랍', 'Sticker drawer'));
  }

  /* 무대 크기: 가로 화면 = 16:9 무대(가로 배경), 세로 화면 = 세로 배경(3:4)을 남는 높이에 맞춰 덮기 */
  function layout() {
    const vw = innerWidth, vh = innerHeight, phone = Math.min(vw, vh) < 600;
    tall = vh > vw;
    const g = phone ? 16 : 32, top = phone ? 72 : 80, cell = phone ? 96 : 112, dh = cell + (phone ? 16 : 24), gap = phone ? 12 : 16;
    root.style.setProperty('--sg-g', g + 'px'); root.style.setProperty('--sg-top', top + 'px'); root.style.setProperty('--sg-cell', cell + 'px'); root.style.setProperty('--sg-dh', dh + 'px');
    const sb = parseFloat(getComputedStyle(root).getPropertyValue('--sg-sb')) || 0;
    const aw = vw - 2 * g, ah = vh - top - dh - 2 * gap - sb;
    let w, h;
    if (!tall) { w = Math.min(aw, ah * 16 / 9); h = w * 9 / 16; }
    else { w = aw; h = Math.min(ah, w * 1.65); }   // 세로 배경(3:4)을 덮기 — 좁은 폰에서는 양옆 장식이 조금 잘리고 무대가 더 커진다
    board.style.width = Math.round(w) + 'px'; board.style.height = Math.round(h) + 'px';
    drawer.style.width = Math.round(tall ? w : Math.max(w, Math.min(aw, 1200))) + 'px';
    unit = tall ? w * .24 : h * .30;
    paintBg(false);
    boardR = board.getBoundingClientRect();
    els.forEach((el, key) => placeEl(el, scene.items.find(i => i.c === key)));
  }
  const bgOf = () => BGS.find(b => b.id === scene.bg) || BGS[0];
  function paintBg(slide) {
    const src = bgSrc(bgOf().id, tall);
    const cur = bgA.querySelector('img:last-child');
    if (cur && cur.getAttribute('src') === src) return;
    const im = document.createElement('img'); im.src = src; im.alt = ''; im.draggable = false; im.decoding = 'async';
    bgA.appendChild(im);
    const drop = () => [...bgA.querySelectorAll('img')].slice(0, -1).forEach(x => x.remove());
    if (slide && motion() && cur) im.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 320, easing: MOVE }).onfinish = drop;
    else drop();
  }

  /* ── 무대 위 스티커 ── */
  const sizeOf = (b, c) => { const hh = unit * (c ? c.sh : 1); return { h: hh, w: hh * b.ar }; };
  function stickerEl(key, b) {
    const el = document.createElement('div');
    el.className = 'sg-it' + (b.css ? ' css' : '');
    el.dataset.k = key;
    el.innerHTML = `<div class="sg-face"><img class="f" src="${b.flat}" alt="" draggable="false"><img class="u" src="${b.up}" alt="" draggable="false"></div>`;
    el.setAttribute('role', 'img');
    const c = info(key); if (c) el.setAttribute('aria-label', L(c.ko, c.en));
    return el;
  }
  function sizeEl(el, key, b) {
    const c = info(key), s = sizeOf(b, c), padF = b.pad / b.h * s.h;   // 구운 그림은 사방에 그림자 여백(pad)이 있다
    el.style.width = s.w + 'px'; el.style.height = s.h + 'px';
    el.querySelectorAll('img').forEach(im => { im.style.left = im.style.top = (-padF) + 'px'; im.style.width = (s.w + 2 * padF) + 'px'; im.style.height = (s.h + 2 * padF) + 'px'; });
    el._w = s.w; el._h = s.h;
  }
  function placeEl(el, it) {
    if (!it) return;
    el.style.transform = `translate(${(it.x * boardR.width - el._w / 2).toFixed(1)}px, ${(it.y * boardR.height - el._h / 2).toFixed(1)}px)`;
    el.querySelector('.sg-face').style.transform = it.f ? 'scaleX(-1)' : '';
  }
  async function addEl(it) {
    const b = await bake(it.c); if (!b || !scene || !scene.items.includes(it)) return null;
    const el = stickerEl(it.c, b); sizeEl(el, it.c, b);
    root.querySelector('.sg-items').appendChild(el);
    els.set(it.c, el); placeEl(el, it);
    return el;
  }
  function restack() { const box = root.querySelector('.sg-items'); scene.items.forEach(it => { const el = els.get(it.c); if (el) box.appendChild(el); }); }

  /* ── 서랍: 모은 것만, 받은 순서. 동화가 바뀌는 자리에 그 동화 동그라미 ── */
  function paintDrawer() {
    const keys = castKeys().filter(info);
    let last = '', html = '';
    keys.forEach(key => {
      const c = info(key);
      if (c.tale !== last) {
        last = c.tale;
        const src = H.tileSrc(c.tale);
        html += `<button type="button" class="sg-tale" data-tale="${c.tale}" aria-label="${H.title(c.tale)}">${src ? `<img src="${src}" alt="" draggable="false" decoding="async">` : ''}</button>`;
      }
      const on = scene.items.some(i => i.c === key);
      html += `<button type="button" class="sg-cell${on ? ' used' : ''}${shiny(key) ? ' shiny' : ''}" role="listitem" data-k="${key}" aria-label="${L(c.ko, c.en)}"><img src="${c.img}" alt="" draggable="false" decoding="async"></button>`;
    });
    drawer.innerHTML = html;
  }
  const cellOf = key => drawer.querySelector(`.sg-cell[data-k="${CSS.escape(key)}"]`);
  const markCell = (key, used) => { const c = cellOf(key); if (c) c.classList.toggle('used', used); };

  /* ── 열기·닫기 ── */
  async function open(id, from) {
    build(); labels();
    const all = scenes();
    if (id) scene = all.find(s => s.id === id) || null;
    if (!scene || !id) {
      if (all.length >= MAX_SCENES) { sfx('pop', .5); say('무대가 가득 찼어요'); return false; }   // 아이 작품을 조용히 지우지 않는다
      scene = { id: 'st_' + Date.now().toString(36), bg: (BGS.find(bgOpen) || BGS[0]).id, items: [] }; isNew = true;
    } else { scene = JSON.parse(JSON.stringify(scene)); isNew = false; }
    scene.items = scene.items.filter(i => info(i.c) && castKeys().includes(i.c));   // 지금 가진 스티커만
    opener = from || null; openerRect = from ? from.getBoundingClientRect() : null;
    els.clear(); root.querySelector('.sg-items').innerHTML = ''; bgA.innerHTML = ''; strip.hidden = true;
    root.hidden = false;
    document.documentElement.classList.add('sg-open');
    const home = document.getElementById('home'); if (home) home.inert = true;
    layout(); paintDrawer();
    await Promise.all(scene.items.map(addEl));
    sfx('pop_appear');
    say('내 무대 꾸미기');
    if (motion() && openerRect) {
      const r = root.getBoundingClientRect(), sx = openerRect.width / r.width, sy = openerRect.height / r.height;
      root.animate([{ transformOrigin: '0 0', transform: `translate(${openerRect.left}px, ${openerRect.top}px) scale(${sx}, ${sy})`, borderRadius: '40px', opacity: .4 }, { transformOrigin: '0 0', transform: 'none', borderRadius: '0px', opacity: 1 }], { duration: 360, easing: EASE });
    }
    root.querySelector('.sg-close').focus({ preventScroll: true });
    /* 처음 들어온 기기: 1초 뒤 안내 한 줄(서랍·무대는 이미 눌림), 5초 무입력이면 손가락 힌트, 12초면 재안내 한 번 */
    firstVisit = false; try { firstVisit = !localStorage.getItem(HINTED); localStorage.setItem(HINTED, '1'); } catch (e) { /* 무시 */ }
    clearTimeout(idleT); clearTimeout(hintT);
    if (firstVisit) { setTimeout(() => { if (!root.hidden && !touched) say('스티커를 끌어다 붙여 봐요'); }, 1000); armIdle(); }
    return true;
  }
  let touched = false;
  function armIdle() {
    touched = false;
    hintT = setTimeout(() => { if (!root.hidden && !touched) showHand(); }, 5000);
    idleT = setTimeout(() => { if (!root.hidden && !touched) say('서랍에서 친구를 골라요'); }, 12000);
  }
  function showHand() {
    const c = drawer.querySelector('.sg-cell:not(.used)'); if (!c || !motion()) return;
    const cr = c.getBoundingClientRect(), br = boardR;
    const hand = document.createElement('img'); hand.className = 'sg-hand'; hand.src = 'assets/ui/hand.webp'; hand.alt = '';
    fly.appendChild(hand);
    const x0 = cr.left + cr.width / 2, y0 = cr.top + cr.height / 2, x1 = br.left + br.width / 2, y1 = br.top + br.height * .65;
    hand.animate([{ transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 0 }, { transform: `translate(${x0}px, ${y0}px) scale(.9)`, opacity: 1, offset: .2 }, { transform: `translate(${x1}px, ${y1}px) scale(.9)`, opacity: 1, offset: .8 }, { transform: `translate(${x1}px, ${y1}px) scale(1)`, opacity: 0 }], { duration: 1800, easing: 'ease-in-out', iterations: 2 }).onfinish = () => hand.remove();
  }
  function poke() { touched = true; clearTimeout(idleT); clearTimeout(hintT); fly.querySelectorAll('.sg-hand').forEach(h => h.remove()); }

  function close() {
    if (!root || root.hidden) return;
    poke(); hush(); flush();
    if (drag) cancelDrag();
    const done = () => {
      root.hidden = true; document.documentElement.classList.remove('sg-open');
      const home = document.getElementById('home'); if (home) home.inert = false;
      try { H.onClose(); } catch (e) { /* 무시 */ }
      const back = document.querySelector(`.st-card[data-id="${scene && scene.id}"]`) || opener;
      if (back && back.isConnected) back.focus({ preventScroll: true });
    };
    sfx('pop');
    if (motion() && openerRect) {
      const r = root.getBoundingClientRect(), sx = openerRect.width / r.width, sy = openerRect.height / r.height;
      root.animate([{ transformOrigin: '0 0', transform: 'none', opacity: 1 }, { transformOrigin: '0 0', transform: `translate(${openerRect.left}px, ${openerRect.top}px) scale(${sx}, ${sy})`, borderRadius: '40px', opacity: 0 }], { duration: 300, easing: EASE }).onfinish = done;
    } else done();
  }
  /* 저절로 저장(판단 ⑥): 바뀔 때마다 300ms 뒤. 새 무대인데 아무것도 안 붙였으면 남기지 않는다 */
  function dirty() { clearTimeout(saveT); saveT = setTimeout(flush, 300); }
  function flush() {
    clearTimeout(saveT);
    if (!scene) return;
    if (isNew && !scene.items.length) return;
    putScene(JSON.parse(JSON.stringify(scene))); isNew = false;
  }

  /* ── 단추 ── */
  function onClick(e) {
    const b = e.target.closest('button'); if (!b || !root.contains(b)) return;
    if (b.dataset.act === 'close') { close(); return; }
    if (b.dataset.act === 'bg') { poke(); toggleStrip(strip.hidden); return; }
    if (b.classList.contains('sg-tale')) { sfx('pop_appear', .5); try { if (typeof Narrator !== 'undefined') Narrator.speak(H.title(b.dataset.tale), { bubble: false }); } catch (er) { /* 무시 */ } return; }
    if (b.classList.contains('sg-bgo')) { pickBg(b.dataset.bg); return; }
    if (b.classList.contains('sg-cell') && e.detail === 0) { tapPlace(b.dataset.k); }   // 키보드·VoiceOver 활성화 = 톡으로 붙이기
  }
  function toggleStrip(on) {
    if (on) {
      strip.querySelector('.sg-strip-row').innerHTML = BGS.map(b => {
        const o = bgOpen(b);
        return `<button type="button" class="sg-bgo${o ? '' : ' shut'}${b.id === scene.bg ? ' on' : ''}" data-bg="${b.id}" aria-label="${L(b.ko, b.en)}"${o ? '' : ' aria-disabled="true"'}><img src="${bgSrc(b.id, false)}" alt="" draggable="false" decoding="async"></button>`;
      }).join('');
      strip.hidden = false; sfx('pop_appear');
      if (motion()) strip.animate([{ transform: 'translateY(-100%)' }, { transform: 'none' }], { duration: 260, easing: EASE });
      say('배경을 골라요');
    } else {
      sfx('pop');
      const bb = root.querySelector('.sg-bgbtn'); if (strip.contains(document.activeElement)) bb.focus({ preventScroll: true });   // 숨는 띠 안에 포커스가 남지 않게
      if (motion()) strip.animate([{ transform: 'none' }, { transform: 'translateY(-100%)' }], { duration: 200, easing: EASE }).onfinish = () => { strip.hidden = true; };
      else strip.hidden = true;
    }
    root.querySelector('.sg-bgbtn').classList.toggle('on', on);
  }
  function pickBg(id) {
    const b = BGS.find(x => x.id === id); if (!b) return;
    if (!bgOpen(b)) { sfx('paper_tap', .5); say('친구 스티커를 더 모으면 열려요'); const el = strip.querySelector(`[data-bg="${id}"]`); if (el && motion()) el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 260 }); return; }
    const changed = scene.bg !== id;
    scene.bg = id; toggleStrip(false);
    if (changed) { sfx('page_turn_big', .6); paintBg(true); dirty(); }
    say(b.ko);
  }
  /* 처음부터: 1초 꾹. 마지막에 붙인 것부터 60ms 간격으로 서랍 제 칸으로 */
  function holdReset(el) {
    let t = 0;
    el.style.setProperty('--hold', '1000ms');
    el.insertAdjacentHTML('beforeend', '<i class="hold-ring" aria-hidden="true"></i>');
    const go = () => {
      el.classList.remove('holding');
      if (!scene.items.length) return;
      poke(); sfx('whoosh', .5); say('처음부터 해요');
      const list = scene.items.slice().reverse();
      list.forEach((it, i) => setTimeout(() => { const x = els.get(it.c); if (x) backToDrawer(x, it.c, null); }, motion() ? i * 60 : 0));
      scene.items = []; dirty();
    };
    el.addEventListener('pointerdown', e => { if (e.button) return; el.classList.add('holding'); clearTimeout(t); t = setTimeout(go, 1000); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, () => { if (el.classList.contains('holding')) { el.classList.remove('holding'); clearTimeout(t); } }));
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('click', e => { if (e.detail === 0 && !e.pointerType) go(); });
  }

  /* ── 끌기: 첫 손가락 하나만 ── */
  let drag = null;
  const toBoard = (x, y) => ({ x: Math.max(.04, Math.min(.96, (x - boardR.left) / boardR.width)), y: Math.max(.06, Math.min(.97, (y - boardR.top) / boardR.height)) });
  const overDrawer = y => { const r = drawer.getBoundingClientRect(); return y >= r.top - 12; };
  function onDrawerDown(e) {
    if (drag || e.button) { if (drag) e.preventDefault(); return; }
    const cell = e.target.closest('.sg-cell'); if (!cell || cell.classList.contains('used')) return;
    poke();
    drag = { id: e.pointerId, from: 'drawer', key: cell.dataset.k, cell, x0: e.clientX, y0: e.clientY, t0: performance.now(), lifted: false, mouse: e.pointerType === 'mouse' };
    if (drag.mouse) e.preventDefault();
  }
  function onBoardDown(e) {
    if (e.button) return;
    if (drag) { e.preventDefault(); return; }
    const el = e.target.closest('.sg-it'); if (!el) { if (!strip.hidden && !e.target.closest('.sg-strip')) toggleStrip(false); return; }
    e.preventDefault(); poke();
    const it = scene.items.find(i => i.c === el.dataset.k); if (!it) return;
    const r = el.getBoundingClientRect();
    drag = { id: e.pointerId, from: 'board', key: it.c, it, el, x0: e.clientX, y0: e.clientY, t0: performance.now(), lifted: false,
      ox: e.clientX - (boardR.left + it.x * boardR.width), oy: e.clientY - (boardR.top + it.y * boardR.height), w: r.width, h: r.height };
    lift(e.clientX, e.clientY);
  }
  /* 들기: 무대 위 요소를 맨 위 '날기 층'으로 옮겨 손가락을 따라오게 한다. 1.03배·깊은 그림자·기울기 */
  async function lift(x, y) {
    const d = drag; d.lifted = true; d.vx = 0; d.lx = x; d.lt = performance.now();
    sfx('paper_up', .5);
    if (d.from === 'board') {
      boardR = board.getBoundingClientRect();
      d.el.classList.add('up'); fly.appendChild(d.el);
      d.el.style.left = boardR.left + 'px'; d.el.style.top = boardR.top + 'px';
      scene.items = scene.items.filter(i => i !== d.it).concat(d.it);   // 든 것이 맨 위
      follow(x, y);
      return;
    }
    /* 서랍에서: 칸 자리에서 무대 크기로 커지며 손가락으로 */
    const cr = d.cell.getBoundingClientRect();
    d.cell.classList.add('used');
    const b = await bake(d.key); if (!b || drag !== d) { if (drag !== d) d.cell.classList.remove('used'); return; }
    const el = stickerEl(d.key, b); sizeEl(el, d.key, b); el.classList.add('up');
    boardR = board.getBoundingClientRect();
    el.style.left = boardR.left + 'px'; el.style.top = boardR.top + 'px';
    fly.appendChild(el); d.el = el; d.ox = 0; d.oy = el._h * .1;
    d.it = { c: d.key, x: .5, y: .5, f: 0 };
    d.grow = motion() ? { s0: Math.min(cr.width / el._w, cr.height / el._h), t0: performance.now() } : null;
    follow(d.lx, d.ly || y);
  }
  function follow(x, y) {
    const d = drag; if (!d || !d.el) return;
    const now = performance.now(), dt = Math.max(1, now - d.lt);
    d.vx = d.vx * .7 + ((x - d.lx) / dt) * .3; d.lx = x; d.ly = y; d.lt = now;
    const rot = Math.max(-2, Math.min(2, d.vx * 3));
    let s = 1.03;
    if (d.grow) { const k = Math.min(1, (now - d.grow.t0) / 160); s = d.grow.s0 + (1.03 - d.grow.s0) * (1 - Math.pow(1 - k, 3)); if (k >= 1) d.grow = null; else requestAnimationFrame(() => drag === d && follow(d.lx, d.ly)); }
    const over = overDrawer(y); drawer.classList.toggle('drop', over && d.from === 'board');
    if (over && d.from === 'board') s = .9;
    const px = x - d.ox - boardR.left - d.el._w / 2, py = y - d.oy - boardR.top - d.el._h / 2;
    d.el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(3)})`;
  }
  function onMove(e) {
    const d = drag; if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (!d.lifted) {
      if (Math.hypot(dx, dy) < 10) return;
      if (!d.mouse && Math.abs(dx) > Math.abs(dy)) { drag = null; return; }   // 손가락 가로 움직임 = 서랍 넘기기
      e.preventDefault();
      d.lx = e.clientX; d.ly = e.clientY;
      lift(e.clientX, e.clientY); return;
    }
    e.preventDefault();
    follow(e.clientX, e.clientY);
  }
  function onUp(e) {
    const d = drag; if (!d || e.pointerId !== d.id) return;
    drag = null; drawer.classList.remove('drop');
    const quick = Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 10 && performance.now() - d.t0 < 300;
    if (!d.lifted) { if (d.from === 'drawer' && quick) tapPlace(d.key); return; }
    if (!d.el) { d.cell && d.cell.classList.remove('used'); if (d.from === 'drawer' && quick) tapPlace(d.key); return; }
    if (d.from === 'board' && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 10) { settle(d.el, d.it); flip(d.el, d.it); return; }   // 톡 = 이름 + 뒤집기
    if (overDrawer(e.clientY)) { backToDrawer(d.el, d.key, d.it); return; }
    const p = toBoard(e.clientX - d.ox, e.clientY - d.oy);
    if (d.from === 'drawer') {
      if (scene.items.length >= MAX_ITEMS) { backToDrawer(d.el, d.key, null); return; }
      d.it.x = p.x; d.it.y = p.y; scene.items.push(d.it); els.set(d.key, d.el);
      d.el.setAttribute('role', 'img');
    } else { d.it.x = p.x; d.it.y = p.y; }
    settle(d.el, d.it); dirty();
  }
  function onCancel(e) {
    const d = drag; if (!d || e.pointerId !== d.id) return;
    if (!d.lifted) { drag = null; return; }   // 서랍을 넘기기 시작함
    cancelDrag();
  }
  function cancelDrag() {
    const d = drag; drag = null; drawer.classList.remove('drop'); if (!d || !d.el) { if (d && d.cell) d.cell.classList.remove('used'); return; }
    if (d.from === 'drawer') backToDrawer(d.el, d.key, null); else settle(d.el, d.it);
  }
  /* 놓기: 무대 안으로 다시 넣고 납작하게 내려앉음(1.03 → .985 → 1) */
  function settle(el, it) {
    el.classList.remove('up');
    el.style.left = el.style.top = '';
    root.querySelector('.sg-items').appendChild(el);
    restack();
    boardR = board.getBoundingClientRect();
    placeEl(el, it);
    sfx('paper_down', .6);
    if (motion()) el.animate([{ scale: '1.03' }, { scale: '.985', offset: .55 }, { scale: '1' }], { duration: 200, easing: EASE });
  }
  /* 서랍으로 되돌리기: 제 칸으로 빨려 들어가며 작아짐 */
  function backToDrawer(el, key, it) {
    if (it) scene.items = scene.items.filter(i => i !== it);
    els.delete(key);
    const cell = cellOf(key);
    if (cell) cell.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    sfx('paper_tap', .5); dirty();
    const end = () => { el.remove(); markCell(key, false); };
    if (!motion() || !cell) { end(); return; }
    if (el.parentNode !== fly) {
      const r = el.getBoundingClientRect(); boardR = board.getBoundingClientRect();
      fly.appendChild(el); el.style.left = boardR.left + 'px'; el.style.top = boardR.top + 'px';
      el.style.transform = `translate(${r.left - boardR.left}px, ${r.top - boardR.top}px)`;
    }
    const cr = cell.getBoundingClientRect(), s = Math.min(cr.width / el._w, cr.height / el._h) * .86;
    const tx = cr.left + cr.width / 2 - boardR.left - el._w / 2, ty = cr.top + cr.height / 2 - boardR.top - el._h / 2;
    el.classList.remove('up');
    el.animate([{ transform: el.style.transform }, { transform: `translate(${tx}px, ${ty}px) scale(${s})` }], { duration: 360, easing: MOVE, fill: 'forwards' }).onfinish = end;
  }
  /* 톡으로 붙이기: 서랍 칸에서 무대의 빈 자리로 날아가 붙는다 */
  async function tapPlace(key) {
    poke();
    if (scene.items.some(i => i.c === key)) return;
    const cell = cellOf(key);
    if (scene.items.length >= MAX_ITEMS) { if (cell && motion()) cell.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 240 }); return; }
    const b = await bake(key); if (!b) return;
    const it = { c: key, ...freeSpot(), f: 0 };
    scene.items.push(it); markCell(key, true);
    const el = stickerEl(key, b); sizeEl(el, key, b);
    root.querySelector('.sg-items').appendChild(el); els.set(key, el);
    boardR = board.getBoundingClientRect(); placeEl(el, it);
    sfx('swish', .4);
    const c = info(key); if (c) sayName(c);
    if (motion() && cell) {
      const cr = cell.getBoundingClientRect(), s = Math.min(cr.width / el._w, cr.height / el._h) * .86;
      const fx = cr.left + cr.width / 2 - boardR.left - el._w / 2, fy = cr.top + cr.height / 2 - boardR.top - el._h / 2;
      el.classList.add('up');
      el.animate([{ transform: `translate(${fx}px, ${fy}px) scale(${s})` }, { transform: el.style.transform + ' scale(1.03)' }], { duration: 420, easing: MOVE }).onfinish = () => { el.classList.remove('up'); sfx('paper_down', .6); el.animate([{ scale: '1.03' }, { scale: '.985', offset: .55 }, { scale: '1' }], { duration: 200, easing: EASE }); };
    } else sfx('paper_down', .6);
    dirty();
  }
  /* 빈 자리: 가운데 아래 빈 면의 후보 중 이미 붙은 것과 가장 먼 곳 */
  function freeSpot() {
    const cand = [];
    for (let yi = 0; yi < 3; yi++) for (let xi = 0; xi < 5; xi++) cand.push({ x: .3 + xi * .1, y: (tall ? .62 : .6) + yi * .1 });
    let best = cand[7], bd = -1;
    cand.forEach(p => {
      const d = scene.items.length ? Math.min(...scene.items.map(i => Math.hypot((i.x - p.x) * 1.6, i.y - p.y))) : 1 - Math.hypot(p.x - .5, p.y - .7);
      if (d > bd + 1e-6) { bd = d; best = p; }
    });
    return { x: best.x, y: best.y };
  }
  function flip(el, it) {
    it.f = it.f ? 0 : 1; dirty();
    sfx('rustle_1', .4);
    const c = info(it.c); if (c) sayName(c);
    const face = el.querySelector('.sg-face');
    if (motion()) face.animate([{ transform: `scaleX(${it.f ? 1 : -1})` }, { transform: 'scaleX(0)', offset: .5 }, { transform: `scaleX(${it.f ? -1 : 1})` }], { duration: 220, easing: 'ease-in-out' });
    face.style.transform = it.f ? 'scaleX(-1)' : '';
  }

  /* ── 스티커북 탭 '내 무대' 줄 ── */
  function cardHTML(s) {
    const b = BGS.find(x => x.id === s.bg) || BGS[0];
    const items = s.items.filter(i => info(i.c)).map(i => {
      const c = info(i.c);
      return `<img class="st-s" src="${c.img}" alt="" draggable="false" loading="lazy" decoding="async" style="left:${(i.x * 100).toFixed(1)}%;top:${(i.y * 100).toFixed(1)}%;height:${(30 * c.sh).toFixed(1)}%${i.f ? ';transform:translate(-50%,-50%) scaleX(-1)' : ''}">`;
    }).join('');
    return `<button type="button" class="st-card" data-id="${s.id}" aria-label="${L('내 무대', 'My stage')} ${L(b.ko, b.en)}"><span class="st-pic"><img class="st-bg" src="${bgSrc(b.id, false)}" alt="" draggable="false" loading="lazy" decoding="async">${items}</span><i class="st-x" role="button" aria-label="${L('지우기', 'Delete')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg></i></button>`;
  }
  function rowHTML() {
    const all = scenes(), full = all.length >= MAX_SCENES;
    return `<section class="pz-sec st-sec" aria-label="${L('내 무대', 'My stage')}"><div class="pz-head"><h2><svg class="st-ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 16l5-5 4 4 3-3 6 6"/></svg>${L('내 무대', 'My stage')}</h2></div>
      <div class="st-row"><button type="button" class="st-new${full ? ' full' : ''}" aria-label="${L('새 무대', 'New stage')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>${all.map(cardHTML).join('')}</div></section>`;
  }
  /* 장면 카드: 톡 = 이어서 꾸미기, 1초 꾹 = 흔들리며 ✕, ✕ 톡 = 지움 */
  function bindRow(sec) {
    if (!sec || sec._bound) return; sec._bound = true;
    let t = 0, armed = null, held = false;
    const disarm = () => { if (armed) { armed.classList.remove('wig'); armed = null; } };
    sec.addEventListener('pointerdown', e => {
      const c = e.target.closest('.st-card'); held = false;
      if (!c || e.target.closest('.st-x')) return;
      clearTimeout(t);
      t = setTimeout(() => { held = true; disarm(); armed = c; c.classList.add('wig'); sfx('pop', .5); }, 1000);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => sec.addEventListener(ev, () => clearTimeout(t), true));
    sec.addEventListener('contextmenu', e => { if (e.target.closest('.st-card')) e.preventDefault(); });
    sec.addEventListener('click', e => {
      const x = e.target.closest('.st-x');
      if (x) {
        const c = x.closest('.st-card'); e.stopPropagation();
        sfx('zip_away', .5); say('지웠어요');
        const go = () => { removeScene(c.dataset.id); c.remove(); armed = null; const n = sec.querySelector('.st-new'); if (n) n.classList.toggle('full', scenes().length >= MAX_SCENES); };
        if (motion()) c.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.6) rotate(-6deg)', opacity: 0 }], { duration: 260, easing: EASE }).onfinish = go; else go();
        return;
      }
      if (held) { held = false; return; }
      const c = e.target.closest('.st-card');
      if (armed && c !== armed) { disarm(); if (!c) return; }
      if (c) { if (c === armed) { disarm(); return; } open(c.dataset.id, c); return; }
      const n = e.target.closest('.st-new');
      if (n) open(null, n);
    });
  }
  /* 배경 열림 알림(스티커 10·20·30장): 스티커북 탭에서 한 번. 처음 쓰는 기기는 지금 열린 것을 본 것으로 적고 조용히 지나간다 */
  function bgNews() {
    const open = BGS.filter(bgOpen).map(b => b.id);
    let seen = null; try { seen = JSON.parse(localStorage.getItem(BG_SEEN)); } catch (e) { seen = null; }
    try { localStorage.setItem(BG_SEEN, JSON.stringify(open)); } catch (e) { /* 무시 */ }
    if (!Array.isArray(seen)) return false;
    const fresh = open.filter(id => !seen.includes(id));
    if (!fresh.length) return false;
    sfx('sparkle', .6); say('새 배경이 열렸어요!');
    return true;
  }

  window.Stage = {
    init(o) { H = { ...H, ...o }; },
    open, close, rowHTML, bindRow, bgNews, scenes, BGS,
    get isOpen() { return !!root && !root.hidden; },
  };
})();
