/* 책 열기 4판(시안 2026-11-22, startSeq=book4) 공용 그림·시각표: 홈에서 누른 카드 썸네일이 그 자리에서 책 한 권(책등·책장 단면·그림자)이 되며
   눈앞으로 다가오고 → 다가오는 도중 표지가 펼쳐지며 → 같은 자리의 제목 쪽(키아트 + 제목 = 동화 시작 화면 짜임)이 화면을 채우고 → 그 쪽이 한 장 넘어가며 첫 장면.
   2026-11-22 7판(사용자 '시선이 두 번 바뀌는 게 별로'): 카메라 목표는 처음부터 '제목 쪽이 화면을 채운 자리' 하나. 카드 자리에서 거기까지 한 곡선으로만 다가가고
   (가운데로 끌어오기·펼치며 옆으로 밀기·다시 다가가기 세 단계를 없앰), 표지는 그 도중에 열려 왼쪽으로 빠진다. 연출안: scratchpad/start_seq/DIRECTION_b7.md
   2026-11-22 6판 다듬음(사용자 '어색하자노'): ① 표지는 처음부터 끝까지 카드 그림 그대로(키아트로 바꿔 끼우지 않는다), 책 모양도 카드 모양 그대로
   ② 누른 순간(t0)부터 하나의 시계로 — 홈과 동화 페이지가 같은 시각표(plan)를 쓰고, 동화 쪽은 t0 을 이어받아 그 시각부터 그린다(머묾 없음)
   ③ 제목 쪽은 키아트·제목을 '다가간 끝의 화면 짜임'대로 쪽 위에 미리 놓는다 → 다가가기가 끝나면 그대로 시작 화면이 되고, 따로 확대하는 단계가 없다
   ④ 면지는 옅은 색지(짙은 남색 금지) ⑤ 넘김은 화면을 채운 쪽이 화면 왼쪽 가장자리를 축으로 줄지 않고 넘어간다.
   home.js(openBook4: 0~NAV 초)와 engine/tale.js(b4Make: 넘김)가 같이 쓴다. 동화 페이지에서는 <head>(tale.css 바로 뒤)에서 먼저 실행되어 책부터 그린다. */
window.PTBook = (() => {
  const SH = '46,36,28', LEAF = '#F3EBDD', PAPER = '#F5EFE9';
  // 책장 단면: 종이 여러 겹(밝은 장 + 얇은 결 줄)
  const EDGE = dir => `repeating-linear-gradient(${dir}, #F6EFE2 0 2.2px, #DCCDB2 2.2px 3px)`;
  // 면지: 옅은 크래프트 색지에 표지 판지 색의 작은 점(짙은 남색 면이 크게 보이지 않게)
  const ENDP = board => `radial-gradient(circle at 30% 30%, ${board} 0 1.6px, transparent 2.2px) 0 0 / 22px 22px, radial-gradient(circle at 80% 78%, ${board} 0 1.2px, transparent 1.8px) 0 0 / 22px 22px, #EDE2CD`;
  const px = v => v.toFixed(1) + 'px';
  const MASK = 'linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent), linear-gradient(transparent, #000 3%, #000 86%, transparent)';
  const cl = k => Math.max(0, Math.min(1, k)), sio = k => .5 - .5 * Math.cos(Math.PI * cl(k)), eo3 = k => 1 - Math.pow(1 - cl(k), 3);
  /* 제목 쪽 짜임 = 동화 시작 화면(engine/tale.js b2Geo)과 같다(화면 크기 W×H 기준): 키아트 + 그 아래 걸친 제목 레터링 */
  function geo(W, H, ltAr) {
    const pt = H > W, aAr = pt ? 3 / 4 : 16 / 9;
    const lh = Math.min(H * (pt ? .2 : .25), W * (pt ? .62 : .36) / ltAr), lw = lh * ltAr;
    const maxH = H * (pt ? .72 : .8);
    let aw = W, ah = W / aAr; if (ah > maxH) { ah = maxH; aw = ah * aAr; }
    const top = Math.max(0, (H - ah - lh * .8) * .45);
    return { art: { x: (W - aw) / 2, y: top, w: aw, h: ah }, lt: { x: (W - lw) / 2, y: top + ah - lh * .2, w: lw, h: lh } };
  }
  /* 제목 쪽 짜임: 시작 화면 짜임을 화면의 90% 크기로 가운데에(레터링이 화면 아래 끝에 붙지 않게 — 넘김을 기다리며 천천히 다가가도 잘리지 않는다) */
  function geoIn(W, H, ltAr) {
    const k = .9, G = geo(W * k, H * k, ltAr), ox = W * (1 - k) / 2, oy = H * (1 - k) / 2, m = b => ({ x: b.x + ox, y: b.y + oy, w: b.w, h: b.h });
    return { art: m(G.art), lt: m(G.lt) };
  }
  /* ── 시각표(초, 누른 순간 = 0). 7판(2026-11-22, 사용자 '시선이 두 번 바뀌는 게 별로'): 카메라 목표는 처음부터 끝까지 하나 —
     '펼친 뒤 제목 쪽이 화면을 꽉 채운 자리(rF)'. 모든 움직임은 '표지 네모'(r: 닫힌 책의 표지 = 펼친 뒤 그 자리의 제목 쪽) 하나로 정해지고,
     r 은 카드 자리 r0 → rF 까지 한 번의 지수 확대(zoomTo, 한 점을 중심으로 곧게)로만 간다. 책을 가운데로 끌어오거나 옆으로 미는 단계는 없다.
     0~.6 홈이 크림 종이로 걷힘(카드는 제자리) · .25~.95 책등·책장 두께·그림자가 자람(카드가 책이 됨) · .55~2.4 rF 로 한 곡선 다가감
     · 1.15~2.0 다가가는 도중 표지가 책등(r 의 왼쪽 변)을 축으로 열려 왼쪽으로 빠지고, 같은 자리의 제목 쪽이 드러난다 · NAV(.5) 페이지 이동
     · 3.2 제목 쪽이 화면을 채움 → 최소 HOLD(.55) 머묾 → 첫 장면이 준비되면 넘김(TURN .85초). 3.2초 뒤에도 아주 천천히 다가가 멈춘 화면이 되지 않게 한다.
     KEEP: 홈 페이지가 떠난 뒤에도 새 페이지가 그려질 때까지 같은 시각표로 계속 그리는 시각 */
  const TL = { NAV: .5, FADE: .6, G0: .25, G1: .95, Z0: .55, Z1: 2.4, O0: 1.15, O1: 2.0, HOLD: .5, TURN: .85, KEEP: 1.8 };   // 9판(2026-11-22 사용자 '다가오는 게 좀 느려진 것 같은데'): 줌 2.6 → 1.85초, 표지 열림도 당김
  /* p → q 로 '한 점을 중심으로 커지는' 다가가기(크기는 기하급수, 모든 점이 곧게 움직인다) */
  function zoomTo(p, q, k) {
    if (k <= 0) return p; if (k >= 1) return q;
    if (Math.abs(q.w - p.w) < .5) return { x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k, w: p.w + (q.w - p.w) * k, h: p.h + (q.h - p.h) * k };
    const s = Math.pow(q.w / p.w, k), Px = (p.x * q.w - q.x * p.w) / (q.w - p.w), Py = (p.y * q.h - q.y * p.h) / (q.h - p.h);
    return { x: Px + (p.x - Px) * s, y: Py + (p.y - Py) * s, w: p.w * s, h: p.h * s };
  }
  function plan(W, H, r0, ltAr = 0) {
    const a = r0.w / r0.h;   // 책 모양 = 카드 모양(끝까지 그대로)
    const fw = Math.max(W, H * a) * 1.03, rF = { x: (W - fw) / 2, y: (H - fw / a) / 2, w: fw, h: fw / a };   // 제목 쪽이 화면을 덮은 자리(가장자리·그림자는 화면 밖) = 카메라의 유일한 목표
    let cx = W / 2, cy = H / 2;
    if (ltAr) { const G = geoIn(W, H, ltAr); cx = G.art.x + G.art.w / 2; cy = (G.art.y + G.lt.y + G.lt.h) / 2; }
    const gl = TL.G1 - TL.G0;
    const at = t => {
      // 다가가기는 로그 크기로 sio^.65: 책이 된 직후부터 크기 변화가 눈에 띄고(앞에서 머무는 곡선을 줄임), 끝은 sio 그대로 부드럽게 내려앉는다
      const ko = sio((t - TL.O0) / (TL.O1 - TL.O0)), kz = Math.pow(sio((t - TL.Z0) / (TL.Z1 - TL.Z0)), .65);
      let r = zoomTo(r0, rF, kz);   // 한 곡선: 카드 자리 → 제목 쪽이 화면을 채운 자리. 표지는 이 r 의 왼쪽 변을 축으로 열린다(책을 옮기지 않는다)
      const d = 1 + .016 * sio((t - (TL.Z1 - .5)) / 2.4);   // 다 다가간 뒤에도 아주 천천히(넘김을 기다리는 동안 멈춘 화면이 되지 않게) — 그림+제목 묶음 가운데를 기준으로, 제목이 잘리지 않을 만큼만
      if (d > 1) r = { x: cx + (r.x - cx) * d, y: cy + (r.y - cy) * d, w: r.w * d, h: r.h * d };
      return { r, g: { s: eo3((t - TL.G0) / gl), t: eo3((t - TL.G0 - .05) / gl), d: sio((t - TL.G0 + .1) / (gl + .1)) }, ang: 180 * ko };
    };
    return { at, rF, W, H };
  }
  function make({ art, coverLt, lt, key = '', ltAr = 1.5, board = '#A93B32', z = 96, bg = true, id = 'b4Book', radius = 0 }) {
    board = board || '#A93B32';
    const root = document.createElement('div'); root.id = id;
    root.style.cssText = `position:fixed;left:0;top:0;width:100%;height:100%;z-index:${z};overflow:hidden;touch-action:none;-webkit-tap-highlight-color:transparent;${bg ? 'background:' + PAPER : 'pointer-events:none'}`;
    const ltCard = coverLt ? `<img alt="" draggable="false" decoding="sync" src="${coverLt}" style="position:absolute;left:50%;top:3%;max-width:84%;max-height:36%;width:auto;height:auto;transform:translateX(-50%)">` : '';
    root.innerHTML = `<i class="drop" style="position:absolute;border-radius:6px"></i>
      <i class="bd" style="position:absolute;background:${board};border-radius:0 4px 4px 0"></i>
      <i class="er" style="position:absolute;background:${EDGE('90deg')};box-shadow:inset 1px 0 0 rgba(${SH},.18)"></i>
      <i class="eb" style="position:absolute;background:${EDGE('180deg')};box-shadow:inset 0 1px 0 rgba(${SH},.18)"></i>
      <i class="sp" style="position:absolute;background:${board}"><i style="position:absolute;top:0;bottom:0;left:42%;width:1.5px;background:rgba(${SH},.22)"></i></i>
      <i class="tc" style="position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;pointer-events:none;background:linear-gradient(90deg,rgba(${SH},.42),rgba(${SH},.12) 60%,rgba(${SH},.04))"></i>
      <div class="tp" style="position:absolute;overflow:hidden;background:${LEAF};box-shadow:inset 0 0 0 1px rgba(${SH},.1)">
        ${key ? `<img class="tk" alt="" draggable="false" decoding="sync" src="${key}" style="position:absolute;object-fit:contain;-webkit-mask:${MASK};-webkit-mask-composite:source-in;mask:${MASK};mask-composite:intersect">` : ''}
        <img class="tl" alt="" draggable="false" decoding="sync" src="${lt}" style="position:absolute;object-fit:contain">
        <i class="gt" style="position:absolute;left:0;top:0;bottom:0;width:5%;background:linear-gradient(90deg,rgba(${SH},.18),rgba(${SH},0))"></i>
        <i class="lf" style="position:absolute;inset:0;background:rgb(${SH});opacity:0"></i>
        <i class="cast" style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(${SH},.45),rgba(${SH},0) 70%);opacity:0"></i></div>
      <div class="cv" style="position:absolute;transform-origin:0 50%;transform-style:preserve-3d">
        <div style="position:absolute;inset:0;overflow:hidden;background:${PAPER};backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:2px">
          <img alt="" draggable="false" decoding="sync" src="${art}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">${ltCard}
          <i class="hg" style="position:absolute;left:3.2%;top:0;bottom:0;width:3px;opacity:0;background:linear-gradient(90deg,rgba(${SH},.28) 0 1.5px,rgba(255,255,255,.35) 1.5px 3px)"></i>
          <i class="sf" style="position:absolute;inset:0;background:rgb(${SH});opacity:0"></i></div>
        <div style="position:absolute;inset:0;overflow:hidden;background:${ENDP(board)};transform:rotateY(180deg);backface-visibility:hidden;-webkit-backface-visibility:hidden">
          <i style="position:absolute;right:0;top:0;bottom:0;width:6%;background:linear-gradient(270deg,rgba(${SH},.16),rgba(${SH},0))"></i>
          <i class="sb" style="position:absolute;inset:0;background:rgb(${SH});opacity:0"></i></div>
      </div>`;
    const q = s => root.querySelector(s);
    const E = { drop: q('.drop'), bd: q('.bd'), er: q('.er'), eb: q('.eb'), sp: q('.sp'), tp: q('.tp'), tk: q('.tk'), tl: q('.tl'), lf: q('.lf'), cast: q('.cast'), cv: q('.cv'), hg: q('.hg'), sf: q('.sf'), sb: q('.sb'), tc: q('.tc') };
    E.face = E.cv.firstElementChild;
    /* 제목 쪽 종이 색 = 키아트 바탕 크림(키아트 가장자리가 쪽 종이에 녹아들게) */
    if (E.tk) {
      const tint = () => { try {   // 원본 크기로 그려 네 귀퉁이·좌우 가운데 근처 종이 색을 재고 가운데값을 쓴다(그림이 섞이지 않게)
        const w = E.tk.naturalWidth, h = E.tk.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(E.tk, 0, 0);
        const pts = [[6, 6], [w - 7, 6], [6, h - 7], [w - 7, h - 7], [6, h >> 1], [w - 7, h >> 1]].map(([a, b]) => x.getImageData(a, b, 1, 1).data);
        const med = i => pts.map(d => d[i]).sort((p, q) => p - q)[pts.length >> 1], rgb = [med(0), med(1), med(2)];
        if (rgb[0] + rgb[1] + rgb[2] > 600) E.tp.style.background = `rgb(${rgb.join(',')})`;
      } catch (e) { /* 기본 종이 색 */ } };
      if (E.tk.complete && E.tk.naturalWidth) tint(); else E.tk.addEventListener('load', tint, { once: true });
    }
    let frame = null, lastR = null, solo = false;
    const put = (el, x, y, w, h) => { const s = el.style; s.left = px(x); s.top = px(y); s.width = px(Math.max(0, w)); s.height = px(Math.max(0, h)); };
    /* 제목 쪽 그림 자리: 다가가기가 끝난 자리(rF)에서 화면 짜임(geo)과 꼭 같도록, 쪽 좌표로 옮겨 놓는다(쪽이 작을 땐 그만큼 작게) */
    const placeTitle = r => {
      if (!frame) { const th = Math.min(r.h * .58, r.w * .86 / ltAr), tw = th * ltAr; put(E.tl, (r.w - tw) / 2, r.h * .48 - th / 2, tw, th); return; }
      const { rF, G } = frame, k = r.w / rF.w, m = b => [(b.x - rF.x) * k, (b.y - rF.y) * k, b.w * k, b.h * k];
      if (E.tk) put(E.tk, ...m(G.art)); put(E.tl, ...m(G.lt));
    };
    /* r = 표지 네모(화면 좌표), g = 자란 정도 0~1(숫자 하나, 또는 { s: 책등, t: 책장 두께, d: 그림자 }), ang = 표지 펼침 0~180° */
    function layout(r, g = 1, ang = 0) {
      if (solo) return;
      const gs = typeof g === 'object' ? g.s : g, gt = typeof g === 'object' ? g.t : g, gd = typeof g === 'object' ? g.d : g;
      const u = Math.min(r.h, r.w * .9), S = u * .075 * gs, T = u * .085 * gt, B = u * .022 * gt, k = Math.min(1, ang / 90);
      put(E.drop, r.x - S, r.y, r.w + S + T + B, r.h + T + B);
      E.drop.style.boxShadow = `0 ${px(u * .05 * gd)} ${px(u * .09 * gd)} rgba(${SH},${(.3 * gd).toFixed(3)}), 0 ${px(u * .01 * gd)} ${px(u * .016 * gd)} rgba(${SH},${(.2 * gd).toFixed(3)})`;
      put(E.bd, r.x, r.y + T * .55, r.w + T + B, r.h + T * .45 + B);                  // 뒤표지 판지(책장 더미 밑)
      put(E.er, r.x + r.w, r.y + T * .45, T, r.h + T * .55 - 1);                        // 오른쪽 책장 단면
      put(E.eb, r.x, r.y + r.h, r.w + T, T);                                            // 아래 책장 단면
      const sw = S * (1 - .55 * k);
      put(E.sp, r.x - sw, r.y, sw + 3, r.h + T + B); E.sp.style.borderRadius = `${px(sw * .5)} 0 0 ${px(sw * .5)}`;
      put(E.tp, r.x, r.y, r.w, r.h); placeTitle(r);
      put(E.cv, r.x, r.y, r.w, r.h); lastR = r;
      // 펼침: 원근은 약하게(표지 폭의 5배 거리) — 90° 근처에서 표지가 크게 덮쳐 오지 않게
      const rad = ang * Math.PI / 180, lift = Math.sin(rad);
      E.cv.style.transform = ang > 0 ? `perspective(${(r.w * 5).toFixed(0)}px) translateZ(${(lift * r.w * .02).toFixed(1)}px) rotateY(${(-ang).toFixed(2)}deg)` : '';
      E.sf.style.opacity = (k * .35).toFixed(3); E.sb.style.opacity = (ang > 90 ? lift * .3 : .3).toFixed(3);
      E.cast.style.opacity = (ang > 0 ? (ang < 90 ? lift * .5 : lift * .25) : 0).toFixed(3);
      E.hg.style.opacity = gs.toFixed(3);
      if (radius) E.face.style.borderRadius = px(Math.max(2, radius * (1 - gt)));   // 카드의 둥근 모서리 → 책 표지의 거의 곧은 모서리
    }
    /* 넘김: 화면을 덮은 제목 쪽이 '화면 왼쪽 가장자리'를 축으로 0 → 90° 넘어가고(크기는 그대로), 아래에 깔린 실제 첫 장면이 드러난다 */
    const leafTurn = ang => {
      if (!solo) {   // 처음 한 번: 책의 다른 조각(이미 화면 밖)과 바탕을 치워 쪽 아래가 바로 실제 장면이 되게
        solo = true; root.style.background = 'transparent';
        [E.drop, E.bd, E.er, E.eb, E.sp, E.cv].forEach(e => { e.style.visibility = 'hidden'; });
        // 쪽을 화면 안 부분만 남긴다(그림 자리는 그대로) — 화면 밖 부분이 축 너머에서 돌아 화면 앞으로 튀어나오지 않게. 축 = 잘린 쪽의 왼쪽 가장자리 = 화면 왼쪽
        const r = lastR || { x: 0, y: 0, w: innerWidth, h: innerHeight }, nx = Math.max(0, r.x), ny = Math.max(0, r.y);
        const nw = Math.min(innerWidth, r.x + r.w) - nx, nh = Math.min(innerHeight, r.y + r.h) - ny, dx = nx - r.x, dy = ny - r.y;
        put(E.tp, nx, ny, nw, nh);
        [E.tk, E.tl].forEach(el => { if (el) { el.style.left = px(parseFloat(el.style.left) - dx); el.style.top = px(parseFloat(el.style.top) - dy); } });
        E.tp.style.transformOrigin = '0 50%';
        E.tp.style.boxShadow = `0 0 24px rgba(${SH},.22)`;
      }
      const W = innerWidth, rad = ang * Math.PI / 180, lift = Math.sin(rad);
      E.tp.style.transform = `perspective(${(W * 3).toFixed(0)}px) rotateY(${(-ang).toFixed(2)}deg)`;
      E.lf.style.opacity = (lift * .3).toFixed(3);               // 들리는 쪽은 빛을 덜 받는다
      E.tc.style.opacity = (ang > 0 ? Math.max(0, 1 - ang / 90) : 0).toFixed(3); // 쪽 밑의 그늘: 다 넘어가면 걷힌다
      E.tp.style.visibility = ang >= 89.5 ? 'hidden' : '';
    };
    const setFrame = (rF, W, H) => { frame = { rF, G: geoIn(W, H, ltAr) }; if (lastR) placeTitle(lastR); };
    return { root, layout, leafTurn, setFrame, imgs: () => [...root.querySelectorAll('img')] };
  }
  /* 시계 돌리기: t0(누른 순간, Date.now) 부터 시각표대로 그린다. rAF 가 멈춰도(무거운 스크립트를 읽는 동안) 다음 그림은 제 시각 자리로 이어진다.
     onT(t) 는 매 그림마다. skip() 이면 제목 쪽이 화면을 채운 자리(Z1)로 건너뛴다. reached = Z1 에 닿으면 풀리는 약속 */
  function run(b, P, t0, onT) {
    let alive = true, off = 0, res = null;
    const reached = new Promise(r => { res = r; });
    const tNow = () => (Date.now() - t0) / 1000 + off;
    const draw = () => { const t = tNow(), s = P.at(t); b.layout(s.r, s.g, s.ang); if (onT) onT(t); if (t >= TL.Z1 && res) { res(); res = null; } };
    const step = () => { if (!alive) return; draw(); requestAnimationFrame(step); };
    requestAnimationFrame(step); draw();
    const tick = setInterval(() => { if (!alive) { clearInterval(tick); return; } if (tNow() >= TL.Z1 && res) { draw(); } }, 250);   // 화면이 꺼져 rAF 가 멈춰도 넘어간다
    return {
      reached, tNow,
      skip() { const t = tNow(); if (t < TL.Z1) off += TL.Z1 - t; draw(); },
      stop() { alive = false; clearInterval(tick); }
    };
  }
  /* 동화 페이지에서 먼저: 홈이 넘겨준 책(startSeqHandoff, seq=book4)을 같은 시각표로 바로 이어 그린다. 읽기만 하고 지우지 않는다(tale.js 가 지운다) */
  try {
    if (/\/tales\/[^/]+\//.test(location.pathname)) {
      const h = JSON.parse(sessionStorage.getItem('startSeqHandoff') || 'null'), qs = new URLSearchParams(location.search);
      const folder = (location.pathname.match(/\/tales\/([^/]+)\//) || [])[1];
      if (h && h.seq === 'book4' && h.rect && h.t0 && h.folder === decodeURIComponent(folder || '') && Date.now() - h.t < 8000
        && !qs.get('verify') && !qs.get('skipto') && !qs.get('endpreview') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const b = make({ art: h.art, coverLt: h.coverLt, lt: h.lt, key: h.key || '', ltAr: +h.ltAr || 1.5, board: h.board || undefined, radius: +h.radius || 0 });
        const P = plan(innerWidth, innerHeight, h.rect, +h.ltAr || 1.5); b.setFrame(P.rF, P.W, P.H);
        (document.body || document.documentElement).appendChild(b.root);   // <head> 에서 실행되면 <html> 에 바로 붙인다
        let sfx = false;
        b.ctl = run(b, P, +h.t0, t => {   // 표지가 펼쳐지기 시작할 때 종이 소리 한 번(audio.js 가 아직 없으면 조용히)
          if (!sfx && t >= TL.O0) { sfx = true; try { if (window.AudioFX) AudioFX.sfx('page_turn_big', .9); } catch (e) { /* 소리 없이 */ } }
        });
        if (h.skip) b.ctl.skip();
        window.__b4 = b;
      }
    }
  } catch (e) { /* 이어받지 못하면 tale.js 가 다른 시작으로 */ }
  return { make, plan, run, TL };
})();
