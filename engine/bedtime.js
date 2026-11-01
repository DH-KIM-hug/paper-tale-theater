/* 잠자리 장면 (창작 동화 끝, 2026-11-01 사용자 결정): 누르기 없이 큰 그림 한 장(가로 16:9 · 세로 2:3 따로 그린 것) 위에
   움직이는 조각 몇 개만 얹고, 아주 느리게 다가가며 자장가 오르골, 마지막엔 서서히 어두워진다. 놀이·읽어 주기 같은 함수를 쓴다.
     const B = Bedtime.open(T, { wide: url, tall: url, focus: { w: [u, v], t: [u, v] }, tallX, tallY });
     B.at({ w: [u, v], t: [u, v] }) → 무대 좌표 [x, y]   (u, v = 그림 안 비율 0~1. 가로·세로 그림마다 따로 잰다)
     B.img(url, pt, h, ar) · B.glow(pt, r, color, op) · B.put(node) · B.fade(node, op, ms) · B.pan(tallY, ms) · B.dim(op, ms) · await B.end(ms)
   그림과 조각은 한 묶음(g)에 넣어 함께 움직이고, 그 위에 어둠 막이 덮인다. 세로 화면(폰·아이패드 세로 무대는 거의 정사각)은 세로 그림을
   보이는 폭에 맞춰 깔아 위아래가 잘리므로, tallY(그림 안 세로 비율)를 화면 가운데에 두고 B.pan 으로 천천히 옮겨 보여 준다. */
const Bedtime = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, a, parent) => { const n = document.createElementNS(NS, tag); for (const k in a) n.setAttribute(k, a[k]); if (parent) parent.appendChild(n); return n; };
  let seq = 0;
  function open(T, { wide, tall, aw = 16 / 9, at = 2 / 3, tallX = .5, tallY = .5, focus, lullaby = 'classical_brahms_lullaby_box', vol }) {
    /* 세로 그림은 보이는 무대가 정사각에 가까울 때(폰 세로)만 쓴다. 아이패드 세로처럼 무대가 넓게 보이면 가로 그림이 맞다 */
    const narrow = T.viewWidth() < 990, vw = narrow ? T.viewWidth() : 1000, portrait = vw / 560 < 1.3;
    try { AudioFX.stopAmbient(1.2); } catch (e) { /* 무시 */ }
    T.clear();
    /* 동화가 층에 걸어 둔 크기·자리 바꿈(예: 유니콘 세로 화면의 월드·효과 층 축소)을 지운다 — 그림은 무대 좌표 그대로 깐다 */
    [T.bg, T.world, T.fx].forEach(n => { try { n.getAnimations().forEach(a => a.cancel()); n.removeAttribute('transform'); n.style.transform = ''; } catch (e) { /* 무시 */ } });
    T.camSnap(500, 280, 1);
    /* 그림 상자: 가로는 무대 밖 여백까지(-40…1040), 좁은 화면은 보이는 폭만큼 가운데 */
    const box = narrow ? [500 - vw / 2 - 8, -10, vw + 16, 580] : [-40, -24, 1080, 608];
    const ar = portrait ? at : aw;
    /* 아이패드 세로처럼 상자가 그림보다 좁으면 가로 그림을 폭에 맞춰 다 보여 주고(양옆 인물·창이 잘리지 않게), 위아래 빈 곳은 같은 그림을 흐리게 깐다 */
    const fitW = narrow && !portrait;
    const s = fitW ? box[2] / ar : Math.max(box[2] / ar, box[3]);   // 그림 높이 1 기준 배율
    const iw = ar * s, ih = s, cx = portrait ? tallX : .5, cy = portrait ? tallY : .5;   // 가로 그림이 좁은 상자에 들어가면 가운데
    const clampX = x => Math.min(box[0], Math.max(box[0] + box[2] - iw, x)), clampY = y => (ih <= box[3] ? box[1] + (box[3] - ih) / 2 : Math.min(box[1], Math.max(box[1] + box[3] - ih, y)));
    const x0 = clampX(box[0] + box[2] / 2 - cx * iw), y0 = clampY(box[1] + box[3] / 2 - cy * ih);
    const g = mk('g', {}, T.fx), defs = mk('defs', {}, g);
    if (fitW) {
      const fid = 'bedBlur' + (++seq), f = mk('filter', { id: fid, x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
      mk('feGaussianBlur', { stdDeviation: 14 }, f);
      mk('image', { href: wide, x: box[0] - 40, y: box[1] - 40, width: box[2] + 80, height: box[3] + 80, preserveAspectRatio: 'xMidYMid slice', filter: `url(#${fid})`, opacity: .85 }, g);
    }
    mk('image', { href: portrait ? tall : wide, x: x0, y: y0, width: iw, height: ih }, g);
    const at2 = p => { const [u, v] = portrait ? p.t : p.w; return [x0 + u * iw, y0 + v * ih]; };
    const shade = mk('rect', { x: -400, y: -300, width: 1800, height: 1200, fill: '#0B1030', opacity: 0, 'pointer-events': 'none' }, T.fx);
    let music = null, dy = 0;
    const play = () => { try { music = AudioFX.ambient(lullaby, { vol: vol || (T.reading() ? .22 : .3), loop: true, fadeIn: 1.5 }); } catch (e) { /* 소리 없이 */ } };
    play(); if (!music) setTimeout(() => { if (!music) play(); }, 900);   // 처음이면 받는 동안 한 번 더
    if (focus && !fitW && !document.hidden) { const [fx, fy] = at2(focus); T.camTo(500 + (fx - 500) * .25, 280 + (fy - 280) * .25, 1.05, 16000); }   // 아주 느리게 다가가기
    const B = {
      portrait, at: at2, ih,   // ih = 그림 높이(무대 좌표): 조각 크기를 그림 비율로 맞출 때 쓴다
      put(n) { g.appendChild(n); return n; },
      /* 움직이는 조각: 가운데 기준, 높이 h(무대 좌표), ar = 폭/높이 */
      img(href, p, h, ar = 1) { const [x, y] = at2(p), w = h * ar; return mk('image', { href, x: x - w / 2, y: y - h / 2, width: w, height: h, 'pointer-events': 'none' }, g); },
      /* 빛(조명은 그라데이션 허용, CLAUDE.md 7-1): 가운데가 밝고 가장자리로 갈수록 사라지는 동그라미 */
      glow(p, r, color = '#FFF1C2', op = .85) {
        const id = 'bedGlow' + (++seq), gr = mk('radialGradient', { id }, defs);
        mk('stop', { offset: '0', 'stop-color': color, 'stop-opacity': 1 }, gr); mk('stop', { offset: '.35', 'stop-color': color, 'stop-opacity': .55 }, gr); mk('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, gr);
        const [x, y] = at2(p);
        return mk('circle', { cx: x, cy: y, r, fill: `url(#${id})`, opacity: op, 'pointer-events': 'none', style: 'mix-blend-mode:screen' }, g);
      },
      fade(n, to, ms = 1200) { const from = +(getComputedStyle(n).opacity || 1); return n.animate([{ opacity: from }, { opacity: to }], { duration: document.hidden ? 1 : ms, easing: 'ease-in-out', fill: 'forwards' }).finished.catch(() => {}); },
      /* 세로 화면에서만: 그림 안 세로 비율 v 를 화면 가운데로 천천히 옮긴다(가로는 그림 전체가 보여 그대로) */
      pan(v, ms = 4000) {
        if (!portrait) return Promise.resolve();
        const to = clampY(box[1] + box[3] / 2 - v * ih) - y0, a = g.animate([{ transform: `translate(0px,${dy}px)` }, { transform: `translate(0px,${to}px)` }], { duration: document.hidden ? 1 : ms, easing: 'ease-in-out', fill: 'forwards' });
        dy = to; return a.finished.catch(() => {});
      },
      dim(op, ms = 2000) { return B.fade(shade, op, ms); },
      async end(ms = 3200) { const p = B.dim(.92, ms); try { if (music) music.stop(ms / 1000 + .5); } catch (e) { /* 무시 */ } await p; },
    };
    return B;
  }
  return { open };
})();
