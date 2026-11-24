/* 이름 바꾸기 2판 — 앱 쪽 (docs/NAME_SETUP_V2_PLAN.md, 맨 끝 '확정 사항'이 본문보다 우선). 일반 script, 전역 window.Names.
   engine/name_form.js(NameForm, 서버와 같은 템플릿 함수) 뒤에, 녹음 맵(narration*.js · home_narration_el.js) 뒤에 넣는다.

   · 동화별 개별 아이: 동화마다 이름(한글·영어) + 주인공 모습 look('b' 남자아이 / 'g' 여자아이). 구름 공장은 아이 셋 A·B·C 각각 + 강아지 D 이름.
     홈 스티커 줄('home')은 사탕 마녀의 핼러윈(witch_candy) 아이 설정을 따른다(서버도 witch_candy 실행에 home 을 붙인다).
   · 설정은 이 기기 localStorage 'paperTheater.names' 에만(서버 state 에 넣지 않는다):
       { v: 2, agree, run: { runId, tales, kind: 'first'|'ticket', expiresAt },
         tales: { <동화>: { names: { A, A_en, … }, look: { A: 'b' }, en, on, original, dir, done: { ko, en }, got: { '<lang>/<id>': 'wav'|'mp3' }, err } } }
     옛 1판(공통 이름 { names, on, version, done, got, run })은 처음 읽을 때 네 편 + home 에 나눠 옮긴다(모습은 원래 모습, 받은 녹음 경로도 그대로 쓴다)
   · 받은 녹음: 앱 = Capacitor Filesystem  Directory.Data/names/<dir>/<lang>/<id>.(wav|mp3)
                웹(시험) = IndexedDB 'paperTheaterNames' (Filesystem 플러그인이 없을 때)
     dir = <catalog version>/<동화>/<모습 표시><시각> — 설정할 때마다 새 폴더(모습이 바뀌면 다른 녹음이다). 다시 설정하면 그 동화의 옛 폴더를 지운다. 옛 1판 = <version>/<동화>
   · 덮어쓰기: 녹음 맵의 열쇠(원문)는 그대로 두고 값(파일 주소)만 바꾼다. 동화 한 편이 그 언어로 다 받아졌을 때만 그 동화를 덮는다.
     '원래 이름·모습으로 듣기'(동화별)를 켜면 파일은 두고 덮어쓰기·모습을 끈다
   · 모습: Names.look(동화, 자리) → 'b'|'g'. 그림은 Names.art(동화, id) / Names.sprite(동화, 자리, id) 로 고른다(LOOK_ART 규칙에 맞는 그림만).
     G3(2026-11-07): 네 편 동화 코드의 src() 가 Names.art 를 거친다. 자세 높이(HT)는 동화마다 반대 모습 표를 따로 둔다(CLAUDE.md §4-1)
   · 아이 본인 대사(이름 없음)의 반대 모습 녹음(확정 사항 7-4): 앱 묶음에 들어오면 LOOK_CLIPS 에 적고,
     동화 폴더의 narration_el_look_<자리><모습>.js(예: narration_el_look_Ab.js)가 window.NARRATION_LOOK_CLIPS['Ab'] = { ko: {열쇠: 값}, en: {열쇠: 값} } 를 둔다.
     apply() 가 모습이 원래와 다른 자리의 맵을 읽어 이름 덮어쓰기보다 먼저 덮는다. 맵의 vl 은 VOICE_LINES(말풍선 없는 소리 대사)를 덮는다
   · 화면 글자: Names.view(글, 동화id) — 원래 이름을 받침 규칙으로 바꾸고, 영어 대명사 줄은 서버 템플릿(tplEn)을 모습으로 채운다
   · 서버 호출은 Entitlements.nameCall(인증 Bearer) 로만. 이름·모습은 요청 본문에만 실리고 서버에 남지 않는다
   · 이용권(2026-11-24 하나의 흐름): 아이 이름 변경권(1.99) 1장 = 네 편 한 번에(run { ticket: true }, 48시간). '모든 동화 열기' 구매에 1장이 들어 있다(서버가 넣음).
     run { tale } 은 도는 실행 이어 받기와 새 창작 동화 무료 설정 1번(서버 kind 'new')에만 쓴다. 동화마다 무료 첫 설정은 없앴다
   · TTS 없음: 녹음이 다 받아지지 않은 동화는 원래 녹음을 그대로 쓴다
   · 이름 조각 + 고정 조각(2026-11-22 사용자 확정): 서버는 이름 조각(catalog pieces[n])만 녹음해 돌려준다. 고정 조각은 앱 묶음
     (audio/el/<동화>/parts/, 다듬기 전)에 있고, 기기가 assemble() 로 한 파일로 합쳐(앞뒤 무음 자르기 → 이름 조각 음량을 고정 조각에 맞춤 →
     조각 뒤 간격 gap → 다듬기) WAV 로 저장한다 — 화면을 끈 읽어 주기에서도 이음매 없이 한 클립으로 재생된다.
     기본 이름은 앱 묶음에 미리 합친 완성본이 녹음 맵에 들어 있다(gen_name_split.py, 같은 규칙).
   · 영어 대명사(he/she) 반대 벌은 앱 묶음(narration_el_pron_<자리><모습>.js, PRON_CLIPS) — 모습만 바꿔도 서버 녹음이 없다 */
const Names = (() => {
  const K_SET = 'paperTheater.names', K_CAT = 'paperTheater.names.cat';
  const SLOTS = ['A', 'B', 'C', 'D'], KIDS = ['A', 'B', 'C'];
  const TALES = ['unicorn', 'witch_candy', 'red_car', 'kkultteok'];          // 설정 화면 순서
  const TALE_SLOTS = { unicorn: ['A'], witch_candy: ['A'], red_car: ['B'], kkultteok: ['A', 'B', 'C', 'D'], home: ['A'] };
  const HOME_OWNER = 'witch_candy';
  const owner = t => (t === 'home' ? HOME_OWNER : t);
  /* 반대 모습 그림(G2 생성 → G3 끼우기, tools/app/gen/post_look.py): 동화 → 자리 → 모습 → [원래 id 규칙, 바꿀 글]. 여기 없는 그림은 원래 그림 그대로.
     사탕 마녀 변신 컷 틀(wc_cut_tf_frame)은 아이가 없어 그대로 쓴다. 구름 공장은 동화 코드가 'cf4_' 를 떼고 부르므로 접두어를 선택으로 둔다.
     구름 공장 함께 그림(컷 2·침대 2)은 kkultteok.js 가 아이 없는 배경판(cf4_*_bg)에 자세 그림을 얹어 합성한다(§3-2 (가)) */
  const LOOK_ART = {
    unicorn: { A: { b: [[/^uc_kid2_/, 'uc_kid2b_'], [/^uc_cut2_/, 'uc_cut2b_'], [/^uc_bed_(wide|tall)$/, 'uc_bedb_$1']] } },
    witch_candy: { A: { b: [[/^wc_kid_/, 'wc_kidb_'], [/^wc_cut_(?!tf_frame$)/, 'wc_cutb_']] } },
    red_car: { B: { g: [[/^rc_child_/, 'rc_childg_'], [/^rc_bed_(wide|tall)$/, 'rc_bedg_$1']] } },
    kkultteok: { A: { b: [[/^(cf4_)?nuna_/, '$1nunab_']] }, B: { g: [[/^(cf4_)?oppa_/, '$1oppag_']] }, C: { g: [[/^(cf4_)?agi_/, '$1agig_']] } },
  };
  /* 아이 본인 대사 반대 모습 녹음이 들어온 동화와 자리·모습(tales/<동화>/narration_el_look_<자리><모습>.js) */
  const LOOK_CLIPS = { red_car: ['Bg'], unicorn: ['Ab'], witch_candy: ['Ab'], kkultteok: ['Ab', 'Bg', 'Cg'] };
  /* 영어 대명사 줄의 반대 모습 벌(tales/<동화>/narration_el_pron_<자리><모습>.js, gen_name_split.py apply) */
  const MAPV = '20261122ns1';   // 반대 모습·대명사 맵 캐시 버전(맵을 다시 만들면 올린다)
  const PRON_CLIPS = { red_car: ['Bg'], unicorn: ['Ab'], witch_candy: ['Ab'], kkultteok: ['Bg'] };
  /* 설정 화면 미리보기 그림(원래 모습 id). 반대 모습은 sprite() 규칙(…_stand → …b_stand / …g_stand) */
  const PREVIEW_ART = { unicorn: { A: 'uc_kid2_stand' }, witch_candy: { A: 'wc_kid_stand' }, red_car: { B: 'rc_child_stand' }, kkultteok: { A: 'cf4_nuna_wave', B: 'cf4_oppa_walk', C: 'cf4_agi_wave', D: 'cf4_dog_wag' } };

  const NF = () => (typeof NameForm !== 'undefined' ? NameForm : null);
  const OLOOK = () => (NF() && NF().ORIGINAL_LOOK) || { A: 'g', B: 'b', C: 'b' };
  const rd = (k, f) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? f : v; } catch (e) { return f; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 못 하면 이번 실행만 */ } };
  const blankTale = () => ({ names: {}, look: {}, en: false, on: false, original: false, dir: '', done: {}, got: {}, err: '' });

  /* 옛 1판 → 2판: 공통 이름을 네 편(+home)에 복사, 모습은 원래 모습, 받은 녹음은 옛 경로(<version>/<동화>) 그대로 */
  function migrate(old) {
    const S = { v: 2, agree: !!old.agree, tales: {}, run: null };
    if (!old || !old.on) return S;
    Object.keys(TALE_SLOTS).forEach(t => {
      const c = blankTale();
      TALE_SLOTS[t].forEach(s => { if (old.names && old.names[s]) c.names[s] = old.names[s]; if (old.names && old.names[s + '_en']) c.names[s + '_en'] = old.names[s + '_en']; });
      if (t === 'home') c.names = {};    // home 은 witch_candy 설정을 따른다
      c.on = true; c.original = !!old.original; c.en = TALE_SLOTS[t].some(s => old.names && old.names[s + '_en']);
      c.dir = old.version ? `${old.version}/${t}` : '';
      c.done = Object.assign({}, old.done && old.done[t]);
      Object.keys(old.got || {}).forEach(k => { if (k.startsWith(t + '/')) c.got[k.slice(t.length + 1)] = old.got[k]; });
      S.tales[t] = c;
    });
    if (old.run && old.run.runId) S.run = { runId: old.run.runId, tales: old.run.tales, kind: 'ticket', expiresAt: old.run.expiresAt };
    return S;
  }
  let S = (() => { const o = rd(K_SET, {}); return o && o.v === 2 ? Object.assign({ v: 2, agree: false, tales: {}, run: null }, o) : migrate(o || {}); })();
  const save = () => wr(K_SET, S);
  save();
  const cat = () => rd(K_CAT, null);

  const here = (() => { try { const m = location.pathname.match(/\/tales\/([^/]+)\//); return m ? decodeURIComponent(m[1]) : 'home'; } catch (e) { return 'home'; } })();
  const langNow = () => { try { return localStorage.getItem('lang') === 'en' ? 'en' : 'ko'; } catch (e) { return 'ko'; } };

  /* ───────── 동화별 설정 ───────── */
  const tc = t => S.tales[t] || blankTale();                                   // 저장된 칸(home 은 받은 녹음만)
  /* 이름·모습은 owner(home → witch_candy) 의 것 */
  const cfgOf = t => { const c = tc(t), o = tc(owner(t)); return Object.assign({}, c, { names: o.names || {}, look: o.look || {}, en: !!o.en, on: !!(c.on && o.on), original: !!o.original }); };
  const live = r => !!(r && r.runId && (!r.expiresAt || new Date(r.expiresAt).getTime() > Date.now()));
  function look(tale, slot) {
    const c = cfgOf(tale), o = OLOOK()[slot];
    if (!o) return null;
    return c.on && !c.original && (c.look[slot] === 'b' || c.look[slot] === 'g') ? c.look[slot] : o;
  }
  const lookTag = (tale, slot) => { const l = look(tale, slot); return l && l !== OLOOK()[slot] ? l : ''; };
  /* 그림 id: 반대 모습 그림이 있는 그림만 LOOK_ART 규칙으로 바꾼다(G2 파일 규칙: uc_kid2b_stand · wc_kidb_tf_duck · rc_childg_stand · cf4_nunab_walk · 막내 여자아이판 cf4_agig_*) */
  const ruleId = (t, slot, id, tag) => {
    const rs = tag && LOOK_ART[t] && LOOK_ART[t][slot] && LOOK_ART[t][slot][tag];
    if (!rs) return null;
    for (const [re, to] of rs) if (re.test(id)) return String(id).replace(re, to);
    return null;
  };
  const sprite = (tale, slot, id, lk) => { const t = owner(tale), tag = lk ? (lk !== OLOOK()[slot] ? lk : '') : lookTag(t, slot); return ruleId(t, slot, id, tag) || id; };
  /* 동화 코드용: 그림 id 하나를 지금 설정한 모습으로(그 동화의 아이 자리를 모두 본다). lk = { A: 'b', … } 를 주면 그 모습으로(시험·합성용) */
  function art(tale, id, lk) {
    const t = owner(tale), m = LOOK_ART[t]; if (!m) return id;
    for (const s of Object.keys(m)) {
      const tag = lk ? (lk[s] && lk[s] !== OLOOK()[s] ? lk[s] : '') : lookTag(t, s);
      const r = ruleId(t, s, id, tag); if (r) return r;
    }
    return id;
  }
  /* 동화의 아이 자리별 모습 { A: 'g', … }(설정이 꺼졌거나 '원래로 듣기'면 원래 모습) */
  const looks = tale => Object.fromEntries((TALE_SLOTS[owner(tale)] || []).filter(s => KIDS.includes(s)).map(s => [s, look(tale, s)]));
  /* 설정 화면 미리보기: 그림 id 와 '반대 모습 그림이 아직 없음' 표시 */
  function previewArt(tale, slot, lk) {
    const id = (PREVIEW_ART[tale] || {})[slot]; if (!id) return null;
    const want = lk && OLOOK()[slot] && lk !== OLOOK()[slot];
    const nid = want ? sprite(tale, slot, id, lk) : id;
    return { id: nid, pending: !!(want && nid === id) };
  }

  /* ───────── 이름 목록 ───────── */
  const clean = (n, slots = SLOTS) => { const o = {}; slots.forEach(s => { const k = String((n && n[s]) || '').trim(), e = String((n && n[s + '_en']) || '').trim(); if (k) o[s] = k; if (e) o[s + '_en'] = e.charAt(0).toUpperCase() + e.slice(1); }); return o; };
  const cleanLook = (l, slots = KIDS) => { const o = {}; slots.forEach(s => { if (KIDS.includes(s) && (l && (l[s] === 'b' || l[s] === 'g'))) o[s] = l[s]; }); return o; };
  const setSlots = (names, lang) => SLOTS.filter(s => names[lang === 'en' ? s + '_en' : s]);
  const changedLook = (lk, tale) => (TALE_SLOTS[tale] || []).filter(s => KIDS.includes(s) && lk[s] && lk[s] !== OLOOK()[s]);
  /* 줄이 쓰는 이름 자리: 서버 템플릿(tpl/tplEn)에서 읽는다. 한국어 쪽은 _en·_g(모습) 자리를 뺀다 */
  const slotsOf = (line, lang) => {
    const t = lang === 'en' ? line.tplEn : line.tpl; if (!t || !NF()) return [];
    return NF().slotsIn(t).filter(k => (lang === 'en' ? /_en$/.test(k) : !/_en$|_g$/.test(k))).map(k => k[0]);
  };
  /* 줄의 이름 조각(서버가 녹음하는 조각). 없으면 null(이름 없는 영어 대명사 줄 = 앱 묶음 두 벌) */
  const piecesOf = (l, lang) => (lang === 'en' ? l.piecesEn : l.pieces) || null;
  const nPiece = (l, lang) => { const ps = piecesOf(l, lang), n = lang === 'en' ? l.nEn : l.n; return ps && n != null ? ps[n] || null : null; };
  /* 받아야 하는 줄: 이름 조각에 이름을 넣은 자리가 든 줄 + 이름 조각 안에 모습을 바꾼 자리(대명사)가 든 줄.
     고정 조각에만 대명사가 있는 줄은 받지 않는다(앱 묶음 두 벌 PRON_CLIPS). 이름을 바꾼 줄은 기기가 모습에 맞는 고정 조각으로 합친다 */
  function neededFor(tale, lang, names, lk) {
    const c = cat(), t = c && c.tales && c.tales[tale]; if (!t) return [];
    const on = setSlots(names, lang), gs = changedLook(lk, owner(tale));
    if (!on.length && !gs.length) return [];
    return (t.lines || []).filter(l => {
      if (Array.isArray(l.langs) && !l.langs.includes(lang)) return false;
      const p = nPiece(l, lang); if (!p) return false;
      return (p.slots || []).some(s => on.includes(s)) || (p.g || []).some(s => gs.includes(s));
    });
  }
  const needed = (tale, lang) => { const c = cfgOf(tale); return neededFor(tale, lang, c.names, c.look); };
  /* 받을 언어: 한국어는 늘, 영어는 영어 이름을 적었거나 설정할 때 영어 모드였을 때(c.en) */
  const langsFor = tale => { const c = cfgOf(tale); return ['ko', 'en'].filter(l => (l === 'ko' || c.en || setSlots(c.names, 'en').length) && needed(tale, l).length); };
  const keyOf = (lang, id) => lang + '/' + id;
  const pathOf = (dir, lang, id, ext) => `names/${dir}/${lang}/${id}.${ext}`;
  const active = (tale, lang) => { const c = cfgOf(tale); return !!(c.on && !c.original && c.dir && c.done && c.done[lang]); };

  /* ───────── 파일 저장소: 앱 = Filesystem, 웹 = IndexedDB ───────── */
  const FS = (() => { try { const C = window.Capacitor; if (!C || !(C.isNativePlatform ? C.isNativePlatform() : true)) return null; return (C.Plugins && C.Plugins.Filesystem) || (C.registerPlugin ? C.registerPlugin('Filesystem') : null); } catch (e) { return null; } })();
  const b64 = buf => { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
  let idbP = null;
  const idb = () => idbP || (idbP = new Promise((res, rej) => { const q = indexedDB.open('paperTheaterNames', 1); q.onupgradeneeded = () => q.result.createObjectStore('files'); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }));
  const idbDo = (mode, f) => idb().then(db => new Promise((res, rej) => { const tx = db.transaction('files', mode), r = f(tx.objectStore('files')); tx.oncomplete = () => res(r && r.result); tx.onerror = () => rej(tx.error); }));
  let baseUri = null;
  async function fsBase() {
    if (baseUri) return baseUri;
    const r = await FS.getUri({ path: 'names', directory: 'DATA' });
    return (baseUri = String(r.uri).replace(/\/$/, ''));
  }
  async function putFile(path, bytes, type) {
    if (FS) { await FS.writeFile({ path, data: b64(bytes), directory: 'DATA', recursive: true }); return; }
    await idbDo('readwrite', st => st.put(new Blob([bytes], { type }), path));
  }
  const blobUrls = {};
  async function urlOf(path) {
    if (FS) { const b = await fsBase(); const u = b + '/' + path.replace(/^names\//, ''); return window.Capacitor.convertFileSrc ? window.Capacitor.convertFileSrc(u) : u; }
    if (blobUrls[path]) return blobUrls[path];
    const blob = await idbDo('readonly', st => st.get(path));
    return blob ? (blobUrls[path] = URL.createObjectURL(blob)) : null;
  }
  async function dropDir(dir) {
    if (!dir) return;
    try {
      if (FS) await FS.rmdir({ path: 'names/' + dir, directory: 'DATA', recursive: true });
      else await idbDo('readwrite', st => { const r = st.openCursor(); r.onsuccess = () => { const c = r.result; if (!c) return; if (String(c.key).startsWith('names/' + dir + '/')) c.delete(); c.continue(); }; return null; });
    } catch (e) { /* 없으면 그만 */ }
  }

  /* ───────── 녹음 맵 덮어쓰기 ───────── */
  const orig = { ko: {}, en: {}, vk: {}, ve: {} };   // 덮기 전 값(되돌리기용). vk·ve = 말풍선 없는 소리 대사(VOICE_LINES·VOICE_LINES_EN)
  const mapKo = () => (typeof NARRATION_CLIPS !== 'undefined' ? NARRATION_CLIPS : null);
  const mapEn = () => (typeof NARRATION_CLIPS_EN !== 'undefined' ? NARRATION_CLIPS_EN : null);
  const vlKo = () => (typeof VOICE_LINES !== 'undefined' ? VOICE_LINES : null);
  const vlEn = () => (typeof VOICE_LINES_EN !== 'undefined' ? VOICE_LINES_EN : null);
  function restore() {
    const ko = mapKo(), en = mapEn(), vk = vlKo(), ve = vlEn();
    if (ko) Object.keys(orig.ko).forEach(k => { ko[k] = orig.ko[k]; });
    if (en) Object.keys(orig.en).forEach(k => { en[k] = orig.en[k]; });
    if (vk) Object.keys(orig.vk).forEach(k => { vk[k] = orig.vk[k]; });
    if (ve) Object.keys(orig.ve).forEach(k => { ve[k] = orig.ve[k]; });
    orig.ko = {}; orig.en = {}; orig.vk = {}; orig.ve = {};
  }
  /* 아이 본인 대사의 반대 모습 녹음 맵(LOOK_CLIPS 에 적힌 것만 읽는다 — 없는 파일을 부르지 않게) */
  const lookLoads = {};
  const loadLook = code => lookLoads[code] || (lookLoads[code] = new Promise(res => {
    const done = () => res((window.NARRATION_LOOK_CLIPS || {})[code] || null);
    try { const s = document.createElement('script'); s.src = `narration_el_look_${code}.js?v=${MAPV}`; s.onload = done; s.onerror = () => res(null); document.head.appendChild(s); } catch (e) { res(null); }
  }));
  const pronLoads = {};
  const loadPron = code => pronLoads[code] || (pronLoads[code] = new Promise(res => {
    const done = () => res((window.NARRATION_PRON_CLIPS || {})[code] || null);
    try { const s = document.createElement('script'); s.src = `narration_el_pron_${code}.js?v=${MAPV}`; s.onload = done; s.onerror = () => res(null); document.head.appendChild(s); } catch (e) { res(null); }
  }));
  const sameVal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  /* 지금 페이지(동화 한 편 또는 홈)의 맵에 덮는다. 맵이 더 실린 뒤(읽어 주기 맵 등) 다시 불러도 된다 */
  async function apply() {
    restore();
    const ko = mapKo(), en = mapEn(), c = cat();
    let n = 0;
    const setKo = (k, v) => { if (!ko || !(k in ko)) return; if (!(k in orig.ko)) orig.ko[k] = ko[k]; ko[k] = v; n++; };
    /* ① 모습이 원래와 다른 아이의 본인 대사(앱 묶음 녹음) */
    const cf = cfgOf(here);
    if (cf.on && !cf.original && LOOK_CLIPS[owner(here)]) {
      for (const s of TALE_SLOTS[here] || []) {
        const tag = lookTag(here, s), code = s + tag;
        if (!tag || !LOOK_CLIPS[owner(here)].includes(code)) continue;
        const m = await loadLook(code); if (!m) continue;
        Object.keys(m.ko || {}).forEach(k => setKo(k, m.ko[k]));
        if (en) Object.keys(m.en || {}).forEach(k => { if (k in en) { if (!(k in orig.en)) orig.en[k] = en[k]; en[k] = m.en[k]; n++; } });
        /* 말풍선 없는 소리 대사(사탕 마녀 yuck·ghost_kid·ghost_all·happy_all): 맵의 vl.ko → VOICE_LINES, vl.en → VOICE_LINES_EN.
           지금 맵에 있는 열쇠만 바꾼다(합창 파일 chorus_el.js 가 지운 열쇠는 되살리지 않는다) */
        [['ko', vlKo(), 'vk'], ['en', vlEn(), 've']].forEach(([l, vm, ok]) => {
          if (!vm || !m.vl || !m.vl[l]) return;
          Object.keys(m.vl[l]).forEach(k => { if (!(k in vm)) return; if (!(k in orig[ok])) orig[ok][k] = vm[k]; vm[k] = m.vl[l][k]; n++; });
        });
      }
    }
    /* ①-2 영어 대명사 반대 벌(앱 묶음). 항목의 o = 원래 맵 값 → 지금 맵(놀이/읽기)과 같은 쪽만 덮는다 */
    if (en && cf.on && !cf.original && PRON_CLIPS[owner(here)]) {
      for (const s of TALE_SLOTS[here] || []) {
        const tag = lookTag(here, s), code = s + tag;
        if (!tag || !PRON_CLIPS[owner(here)].includes(code)) continue;
        const m = await loadPron(code); if (!m) continue;
        ['read', 'play'].forEach(md => Object.keys(m[md] || {}).forEach(k => {
          if (!(k in en)) return;
          const e = m[md][k], cur = k in orig.en ? orig.en[k] : en[k];
          if (!sameVal(cur && cur.c, e.o)) return;
          if (!(k in orig.en)) orig.en[k] = en[k];
          en[k] = Object.assign({}, en[k], { c: e.c }); n++;
        }));
      }
    }
    /* ② 이름·모습으로 서버에서 받은 줄 */
    if (!c || !c.tales || !c.tales[here]) return n;
    for (const lang of ['ko', 'en']) {
      if (!active(here, lang)) continue;
      for (const l of needed(here, lang)) {
        const ext = cf.got[keyOf(lang, l.id)]; if (!ext) continue;
        let u = null; try { u = await urlOf(pathOf(cf.dir, lang, l.id, ext)); } catch (e) { u = null; }
        if (!u) continue;
        if (lang === 'en') u += '#nm-en';   // audio.js 가 영어 0.9배로 늘린다(원래 영어 녹음과 같은 속도)
        /* 여러 배역 조각으로 된 줄(값이 배열)은 이름이 든 조각(seg·segEn 번째)만 바꾼다 */
        const put = (old, seg) => (seg != null && Array.isArray(old) ? old.map((x, i) => (i === seg ? u : x)) : u);
        /* 지금 값(①에서 아이 반대 모습 조각으로 바뀌었을 수 있다)에서 이름 조각 칸만 바꾼다 */
        if (lang === 'ko' && ko && l.key in ko) { if (!(l.key in orig.ko)) orig.ko[l.key] = ko[l.key]; ko[l.key] = put(ko[l.key], l.seg); n++; }
        if (lang === 'en' && en) {
          const k = [l.keyEn, l.key, l.en].find(x => x && x in en);   // 홈 맵은 영어 글(keyEn)이 열쇠다
          if (k) { if (!(k in orig.en)) orig.en[k] = en[k]; en[k] = Object.assign({}, en[k], { c: put(en[k].c, l.segEn) }); n++; }
        }
      }
    }
    return n;
  }

  /* ───────── 화면 글자 ───────── */
  const KO_RE = /(다현|이현|은우|꿀떡(?=이|아))(이(?:에게|한테|는|가|와|의|를|도|랑|만|야)?|에게|한테|는|가|와|의|를|도|랑|만|야|아)?/g;
  const SLOT_KO = { 다현: 'A', 이현: 'B', 은우: 'C', 꿀떡: 'D' };
  const SLOT_EN = { Dahyun: 'A', Ihyun: 'B', Eunwoo: 'C', Kkulddeok: 'D' };
  /* 원문 → 템플릿: 다현이가 → {A:이가/가}, 이현이야 → {B:아/야}, 다현이 → {A:이/}, 은우 → {C:이/}, 받침 이름 맨몸(다현·) → {A} */
  function templatize(text, only = SLOTS) {   // only: 바꿀 자리(그 밖의 이름은 원문 그대로 둔다)
    return String(text).replace(KO_RE, (m, nm, tail) => {
      const s = SLOT_KO[nm], bat = nm !== '은우';
      if (!only.includes(s)) return m;
      tail = tail || '';
      if (/^이?야$/.test(tail) || tail === '아') return `{${s}:아/야}`;
      const j = tail.replace(/^이/, '');
      if (!tail && bat) return `{${s}}`;                       // 다현·이현이 같은 맨몸
      if (tail === '이' + j || !bat) return `{${s}:이${j}/${j}}`;
      return `{${s}}` + tail;                                  // 받침 이름 + '이' 없이 조사(원문에 없음)
    }).replace(/\b(Dahyun|Ihyun|Eunwoo|Kkulddeok)\b/g, (m, n) => (only.includes(SLOT_EN[n] + '_en') ? `{${SLOT_EN[n]}_en}` : m));
  }
  /* 영어 원문 → 그 줄의 tplEn(대명사 _g 가 든 줄을 모습으로 채우려고) */
  let enIdx = null, enIdxV = '';
  const enLine = (tale, text) => {
    const c = cat(); if (!c || !c.tales) return null;
    if (!enIdx || enIdxV !== c.version) { enIdx = {}; enIdxV = c.version; Object.keys(c.tales).forEach(t => { enIdx[t] = {}; (c.tales[t].lines || []).forEach(l => { if (l.tplEn) [l.en, l.keyEn].forEach(k => { if (k) enIdx[t][k] = l; }); }); }); }
    return (enIdx[tale] || {})[text] || null;
  };
  function view(text, tale = here) {
    if (typeof text !== 'string' || !text || !NF()) return text;
    const cf = cfgOf(tale); if (!cf.on || cf.original) return text;
    const c = cat(); if (!c || !c.tales || !c.tales[tale]) return text;
    const names = {};
    (TALE_SLOTS[tale] || SLOTS).forEach(s => { if (active(tale, 'ko') && cf.names[s]) names[s] = cf.names[s]; if (active(tale, 'en') && cf.names[s + '_en']) names[s + '_en'] = cf.names[s + '_en']; });
    if (changedLook(cf.look, owner(tale)).length) {   // 대명사는 앱 묶음 두 벌이라 영어 녹음을 받지 않아도 늘 모습대로
      const l = enLine(tale, text);
      if (l && /_g[:}]|>/.test(l.tplEn)) return NF().fill(l.tplEn, names, cf.look);
    }
    if (!Object.keys(names).length) return text;
    if (!/다현|이현|은우|꿀떡|Dahyun|Ihyun|Eunwoo|Kkulddeok/.test(text)) return text;
    return NF().fill(templatize(text, Object.keys(names)), names, cf.look);
  }

  /* ───────── 서버 ───────── */
  const E = () => (typeof Entitlements !== 'undefined' ? Entitlements : null);
  const supported = () => { const e = E(); return !!(e && e.nameCall && e.syncEnabled && e.syncEnabled() && NF()); };
  const call = (m, p, b, o) => E().nameCall(m, p, b, o);
  async function fetchCatalog() {
    const r = await call('GET', '/name/catalog');
    if (r.ok && r.data && r.data.tales) { wr(K_CAT, { version: r.data.version, slots: r.data.slots, originalLook: r.data.originalLook, tales: r.data.tales }); enIdx = null; }
    return r;
  }
  /* 남은 횟수(2판): { owned, first, firstLeft, tickets, activeRun, previewsLeftToday } */
  let lastQ = null;
  async function quota() {
    const r = await call('GET', '/name/quota');
    if (r.ok && r.data) {
      lastQ = r.data;
      const a = r.data.activeRun;   // 서버 실행이 기기 기록과 다르면 서버 것을 따른다(다른 기기에서 만든 실행·만료)
      if (a && a.runId) { if (!S.run || S.run.runId !== a.runId || String(S.run.tales) !== String(a.tales)) { S.run = { runId: a.runId, tales: a.tales, kind: a.kind, expiresAt: a.expiresAt }; save(); } }
      else if (S.run && !busy) { S.run = null; save(); }
    }
    return r;
  }
  const check = (names, lk) => call('POST', '/name/check', { names: clean(names), look: cleanLook(lk) });

  /* ───────── 다듬기(polish.py 흉내): 하이패스 85 · 250Hz −2.5 · 3.2kHz +2 · 압축 2.5:1 · −16 LUFS · 봉우리 0.84 → WAV 16bit 모노 24kHz ───────── */
  const OAC = () => window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const SR = 24000;
  async function render(buf, chain) {
    const C = OAC(), o = new C(1, Math.max(1, Math.ceil(buf.duration * SR)), SR), src = o.createBufferSource();
    src.buffer = buf; let last = src;
    for (const f of chain(o)) { last.connect(f); last = f; }
    last.connect(o.destination); src.start(0);
    return o.startRendering();
  }
  const biq = (o, type, f, q, g) => { const b = o.createBiquadFilter(); b.type = type; b.frequency.value = f; if (q != null) b.Q.value = q; if (g != null) b.gain.value = g; return b; };
  /* 음량(LUFS 근사): K 가중(고역 선반 +4dB @1.5kHz, 하이패스 38Hz) 뒤 400ms 블록, 절대 −70·상대 −10 문턱 */
  async function lufs(buf) {
    const k = await render(buf, o => [biq(o, 'highshelf', 1500, null, 4), biq(o, 'highpass', 38, .5)]);
    const d = k.getChannelData(0), B = Math.round(SR * .4), H = Math.round(SR * .1), ms = [];
    for (let i = 0; i + B <= d.length; i += H) { let s = 0; for (let j = i; j < i + B; j++) s += d[j] * d[j]; ms.push(s / B); }
    const L = m => -0.691 + 10 * Math.log10(m || 1e-12);
    let g = ms.filter(m => L(m) > -70); if (!g.length) return null;
    const rel = L(g.reduce((a, b) => a + b, 0) / g.length) - 10;
    g = g.filter(m => L(m) > rel);
    return L(g.reduce((a, b) => a + b, 0) / g.length);
  }
  function wav(d) {
    const out = new DataView(new ArrayBuffer(44 + d.length * 2)), w = (o, s) => { for (let i = 0; i < s.length; i++) out.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); out.setUint32(4, 36 + d.length * 2, true); w(8, 'WAVE'); w(12, 'fmt '); out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 1, true);
    out.setUint32(24, SR, true); out.setUint32(28, SR * 2, true); out.setUint16(32, 2, true); out.setUint16(34, 16, true); w(36, 'data'); out.setUint32(40, d.length * 2, true);
    for (let i = 0; i < d.length; i++) out.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i])) * 0x7fff, true);
    return out.buffer;
  }
  const decode = async bytes => { const C = OAC(); if (!C) throw new Error('no-offline-audio'); return new C(1, SR, SR).decodeAudioData(bytes.slice(0)); };
  async function polish(mp3) { return polishBuf(await decode(mp3)); }
  async function polishBuf(buf) {
    const mid = await render(buf, o => {
      const c = o.createDynamicsCompressor(); c.threshold.value = -20; c.ratio.value = 2.5; c.attack.value = .008; c.release.value = .12; c.knee.value = 4;
      const mk = o.createGain(); mk.gain.value = Math.pow(10, 2 / 20);
      return [biq(o, 'highpass', 85, .707), biq(o, 'peaking', 250, 1.2, -2.5), biq(o, 'peaking', 3200, 1.0, 2), c, mk];
    });
    const lu = await lufs(mid), gdb = lu == null || lu < -70 ? 0 : Math.max(-12, Math.min(18, -16 - lu)), g = Math.pow(10, gdb / 20);
    const d = mid.getChannelData(0), LIM = .8;
    for (let i = 0; i < d.length; i++) { const x = d[i] * g, a = Math.abs(x); d[i] = a <= .65 ? x : Math.sign(x) * (.65 + (LIM - .65) * Math.tanh((a - .65) / (LIM - .65))); }   // 0.65 위로는 부드럽게 0.8 에 닿는 리미터(polish.py 0.84 보다 조금 낮게: 실제 봉우리가 −1dB 아래로)
    return wav(d);
  }

  /* ───────── 조각 합치기(tools/elevenlabs/gen_name_split.py build 와 같은 규칙) ─────────
     조각마다 앞뒤 무음 자르기(-45dB, 20ms 창 RMS, 앞 15ms·뒤 30ms 남김) → 이름 조각만 고정 조각 평균 RMS(dB)에 맞춤(±6dB) →
     6ms 페이드 인·12ms 페이드 아웃 → 조각 뒤 간격(gap 초) → 이어 붙이기 → 다듬기 → WAV */
  const ROOT = (() => { try { const s = document.currentScript && document.currentScript.src; return s ? s.replace(/engine\/names\.js(\?.*)?$/, '') : ''; } catch (e) { return ''; } })();
  const bundleCache = {};
  const bundle = url => bundleCache[url] || (bundleCache[url] = fetch(ROOT + url).then(r => { if (!(r.ok || r.status === 0)) throw new Error('part-missing'); return r.arrayBuffer(); }).catch(e => { delete bundleCache[url]; throw e; }));
  function trimBuf(d) {
    const W = Math.round(SR * .02), thr = Math.pow(10, -45 / 20);
    const loud = i => { let s = 0, n = 0; for (let j = i; j < Math.min(d.length, i + W); j++) { s += d[j] * d[j]; n++; } return n && Math.sqrt(s / n) > thr; };
    let a = 0; while (a < d.length && !loud(a)) a += Math.round(W / 4);
    let b = d.length; while (b > a && !loud(Math.max(0, b - W))) b -= Math.round(W / 4);
    return d.subarray(Math.max(0, a - Math.round(SR * .015)), Math.min(d.length, b + Math.round(SR * .03)));
  }
  const rmsDb = d => { let s = 0; for (let i = 0; i < d.length; i++) s += d[i] * d[i]; return 20 * Math.log10(Math.sqrt(s / Math.max(1, d.length)) || 1e-9); };
  /* line 의 lang 녹음: 이름 조각 bytes(서버 mp3) + 고정 조각(앱 묶음, 모습 lk 에 맞는 벌) → 다듬은 WAV. 통째 줄은 다듬기만 */
  async function assemble(line, lang, nBytes, lk, tale) {
    const ps = (piecesOf(line, lang) || []).filter(p => p.k !== 'K');
    if (ps.length <= 1) return polish(nBytes);
    const lkOf = s => (lk && (lk[s] === 'b' || lk[s] === 'g') ? lk[s] : look(tale || here, s) || OLOOK()[s]);
    const pick = p => { if (!p.urls) return p.url; const m = /\{([A-D])_g:/.exec(p.tpl || ''); return (m && p.urls[lkOf(m[1])]) || p.url; };
    const parts = await Promise.all(ps.map(async p => ({ p, d: trimBuf((await decode(p.k === 'N' ? nBytes : await bundle(pick(p)))).getChannelData(0)) })));
    const S = parts.filter(x => x.p.k === 'S').map(x => rmsDb(x.d)), ref = S.length ? S.reduce((a, b) => a + b, 0) / S.length : null;
    const gapN = (x, i) => (i < parts.length - 1 ? Math.round(SR * (Number(x.p.gap) || 0)) : 0);
    const total = parts.reduce((t, x, i) => t + x.d.length + gapN(x, i), 0);
    const C = OAC(), out = new C(1, Math.max(1, total), SR).createBuffer(1, Math.max(1, total), SR), o = out.getChannelData(0);
    let at = 0;
    parts.forEach((x, i) => {
      const g = x.p.k === 'N' && ref != null ? Math.pow(10, Math.max(-6, Math.min(6, ref - rmsDb(x.d))) / 20) : 1;
      const fi = Math.round(SR * .006), fo = Math.round(SR * .012), L = x.d.length;
      for (let j = 0; j < L; j++) { let v = x.d[j] * g; if (j < fi) v *= j / fi; if (j > L - fo) v *= Math.max(0, (L - j) / fo); o[at + j] = v; }
      at += L + gapN(x, i);
    });
    return polishBuf(out);
  }

  /* ───────── 만들기 · 이어 받기 ───────── */
  let busy = false, stopReq = false, pumpP = null;
  const listeners = new Set();
  const emit = () => listeners.forEach(f => { try { f(); } catch (e) { /* 무시 */ } });
  /* 동화별 진행: 받아야 할 줄(한·영) 중 받은 줄 */
  function progress(tales) {
    const c = cat(); if (!c) return [];
    return (tales || Object.keys(c.tales)).filter(t => c.tales[t]).map(t => {
      const cf = cfgOf(t); let total = 0, got = 0;
      if (cf.on) langsFor(t).forEach(l => needed(t, l).forEach(x => { total++; if (cf.got[keyOf(l, x.id)]) got++; }));
      return { tale: t, on: cf.on, total, got, done: !!cf.on && langsFor(t).every(l => cf.done && cf.done[l]) };
    });
  }
  async function fetchLine(body, tries = 3) {
    let r = null;
    for (let i = 0; i < tries; i++) {
      r = await call('POST', '/name/line', body, { binary: true });
      if (r.ok || ![0, 502, 503].includes(r.status)) return r;
      await new Promise(z => setTimeout(z, 800 * (i + 1)));
    }
    return r;
  }
  /* 다 받은 언어 표시. 받을 줄이 없는 언어(영어를 안 받는 집)는 done 이 아니다 → 원래 녹음 */
  function markDone(t) {
    const c = S.tales[t]; if (!c || !c.on) return;
    const ls = langsFor(t);
    c.done = {};
    ls.forEach(l => { if (needed(t, l).every(x => c.got[keyOf(l, x.id)])) c.done[l] = true; });
    if (!ls.length) c.done = { ko: true };   // 받을 줄이 없는 설정(모습만 바꾸고 한국어에 모습 줄이 없음): 완료로 본다
  }
  /* 실행(S.run) 안의 켜진 동화들에서 아직 안 받은 줄을 두 줄씩 받는다. 받는 동안 다른 동화를 설정하면 다음 바퀴에 함께 받는다 */
  function pump() {
    if (pumpP) return pumpP;
    pumpP = (async () => {
      busy = true; stopReq = false; emit();
      let error = '';
      try {
        for (;;) {
          const run = S.run;
          if (!live(run)) { if (TALES.concat('home').some(t => tc(t).on && progress([t]).some(p => p.total && p.got < p.total))) error = 'run_invalid'; break; }
          const jobs = [];
          (run.tales || []).forEach(t => { const cf = cfgOf(t); if (!cf.on || !cat() || !cat().tales[t]) return; langsFor(t).forEach(l => needed(t, l).forEach(x => { if (!cf.got[keyOf(l, x.id)]) jobs.push({ t, l, x, dir: cf.dir }); })); });
          if (!jobs.length || error || stopReq) break;
          let i = 0;
          const one = async () => {
            while (!error && !stopReq && i < jobs.length) {
              const { t, l, x, dir } = jobs[i++];
              const cf = cfgOf(t);
              if (cf.dir !== dir) continue;   // 받는 사이 그 동화를 다시 설정했다 → 다음 바퀴에서 새 설정으로
              const kids = (TALE_SLOTS[owner(t)] || []).filter(s => KIDS.includes(s));
              const lk = cleanLook(cf.look, kids);
              const r = await fetchLine({ runId: run.runId, tale: t, id: x.id, lang: l, piece: l === 'en' ? x.nEn : x.n, names: clean(cf.names, TALE_SLOTS[owner(t)]), look: lk });
              if (!r.ok) { if (!error) error = r.error || 'server_error'; break; }
              let bytes = r.bytes, ext = 'mp3', type = 'audio/mpeg';
              try { bytes = await assemble(x, l, r.bytes, lk, t); ext = 'wav'; type = 'audio/wav'; }
              catch (e) {   // 합치기 실패: 통째 줄이면 받은 mp3 그대로, 나눈 줄이면 고정 조각 없이 쓸 수 없다 → 이 줄은 원래 녹음으로(다음 바퀴에 다시)
                if ((piecesOf(x, l) || []).filter(p => p.k !== 'K').length > 1) { if (!error) error = 'assemble_failed'; break; }
                bytes = r.bytes;
              }
              if (cfgOf(t).dir !== dir) continue;
              try { await putFile(pathOf(dir, l, x.id, ext), bytes, type); } catch (e) { if (!error) error = 'save_failed'; break; }
              const c = S.tales[t]; if (!c || c.dir !== dir) continue;
              c.got[keyOf(l, x.id)] = ext; markDone(t); save(); emit();
            }
          };
          await Promise.all([one(), one()]);
          if (error || stopReq) break;
        }
        if (!error && stopReq) error = 'stopped';
        TALES.concat('home').forEach(t => { markDone(t); if (S.tales[t] && S.tales[t].on) S.tales[t].err = progress([t]).some(p => !p.done) ? error : ''; });
        save();
      } finally { busy = false; pumpP = null; emit(); }
      try { await apply(); } catch (e) { /* 원래 녹음으로 */ }
      return error ? { ok: false, error } : { ok: true };
    })();
    return pumpP;
  }
  /* 실행을 얻는다: 이용권 실행이 살아 있으면 그것을, 아니면 그 동화의 첫 설정. 서버가 이어 주기(resumed)·보태기를 한다 */
  async function runFor(tale) {
    const q = lastQ, a = live(S.run) ? S.run : q && live(q.activeRun) ? q.activeRun : null;
    const body = a && a.kind === 'ticket' ? { ticket: true } : { tale };
    const r = await call('POST', '/name/run', body);
    if (!r.ok) return r;
    S.run = { runId: r.data.runId, tales: r.data.tales || [tale], kind: r.data.kind, expiresAt: r.data.expiresAt }; save();
    return r;
  }
  /* 동화 한 편 완성: form = { names: { A, A_en, … }, look: { A: 'b', … } }. 이름을 비우고 모습만 바꿔도 설정 1번으로 센다 */
  async function start(tale, form) {
    if (!TALES.includes(tale)) return { ok: false, error: 'bad_request' };
    const slots = TALE_SLOTS[tale], kids = slots.filter(s => KIDS.includes(s));
    const names = clean(form && form.names, slots), lk = cleanLook(form && form.look, kids);
    if (!Object.keys(names).length && !changedLook(lk, tale).length) return { ok: false, error: 'empty' };
    const ck = await check(names, lk);
    if (!ck.ok) return { ok: false, error: ck.error, errors: ck.data && ck.data.errors };
    if (ck.data && ck.data.ok === false) return { ok: false, error: ck.data.errors && ck.data.errors.look ? 'look_invalid' : 'name_invalid', errors: ck.data.errors };
    const r = await runFor(tale);
    if (!r.ok) return { ok: false, error: r.error };
    const c = cat(), v = (c && c.version) || 'v', stamp = Date.now().toString(36);
    const code = kids.map(s => lk[s] || OLOOK()[s]).join('');
    const reset = (t, dir) => { const old = S.tales[t]; if (old && old.dir && old.dir !== dir) dropDir(old.dir); return dir; };
    S.tales[tale] = Object.assign(blankTale(), { names, look: lk, en: langNow() === 'en' || setSlots(names, 'en').length > 0, on: true, dir: reset(tale, `${v}/${tale}/${code}${stamp}`) });
    if (tale === HOME_OWNER) S.tales.home = Object.assign(blankTale(), { on: true, dir: reset('home', `${v}/home/${code}${stamp}`) });
    markDone(tale); if (tale === HOME_OWNER) markDone('home');
    save(); restore(); emit();
    return pump();
  }
  /* 아이 이름 변경권(1.99) 1장 쓰기: 네 편 + home 을 48시간 안에 다시 바꿀 수 있는 실행. 이미 도는 이용권 실행이면 그것을 돌려받는다 */
  async function useTicket() {
    const r = await call('POST', '/name/run', { ticket: true });
    if (!r.ok) return { ok: false, error: r.error };
    S.run = { runId: r.data.runId, tales: r.data.tales, kind: r.data.kind, expiresAt: r.data.expiresAt }; save(); emit();
    return { ok: true, run: S.run, resumed: !!r.data.resumed };
  }
  const resume = () => (live(S.run) ? pump() : Promise.resolve({ ok: false, error: 'run_invalid' }));
  /* 미리 듣기 줄: 그 동화에서 바꾼 자리가 모두 든 가장 짧은 줄(구름 공장 = 네 이름이 한 줄에 다 나오는 줄) */
  function previewLine(tale, lang = 'ko', want) {
    const c = cat(), t = c && c.tales && c.tales[tale]; if (!t) return null;
    want = want || TALE_SLOTS[tale] || [];
    let best = null;
    (t.lines || []).forEach(l => {
      const tp = lang === 'en' ? l.tplEn : l.tpl; if (!tp || (Array.isArray(l.langs) && !l.langs.includes(lang))) return;
      const ss = slotsOf(l, lang), hit = want.filter(s => ss.includes(s)).length; if (!hit) return;
      const score = (want.length - hit) * 1000 + tp.length;
      if (!best || score < best.score) best = { tale, id: l.id, tpl: tp, score };
    });
    return best;
  }
  const previewText = (tale, form, lang = 'ko') => { const p = previewLine(tale, lang); return p && NF() ? NF().fill(p.tpl, clean(form && form.names), cleanLook(form && form.look)) : ''; };
  let prevUrl = null;
  async function preview(tale, form, lang = 'ko') {
    const p = previewLine(tale, lang); if (!p) return { ok: false, error: 'no_line' };
    const kids = (TALE_SLOTS[tale] || []).filter(s => KIDS.includes(s));
    const lk = cleanLook(form && form.look, kids);
    const line = (cat().tales[p.tale].lines || []).find(l => l.id === p.id);
    const r = await call('POST', '/name/line', { preview: true, tale: p.tale, id: p.id, lang, piece: line ? (lang === 'en' ? line.nEn : line.n) : undefined, names: clean(form && form.names, TALE_SLOTS[tale]), look: lk }, { binary: true });
    if (!r.ok) return r;
    let blob = new Blob([r.bytes], { type: 'audio/mpeg' });
    try { if (line) blob = new Blob([await assemble(line, lang, r.bytes, Object.assign({}, OLOOK(), lk), p.tale)], { type: 'audio/wav' }); } catch (e) { /* 이름 조각만이라도 들려준다 */ }
    if (prevUrl) URL.revokeObjectURL(prevUrl);
    prevUrl = URL.createObjectURL(blob);
    try { if (typeof Narrator !== 'undefined') Narrator.stop(); await AudioFX.playUrl(prevUrl); } catch (e) { return { ok: false, error: 'play_failed' }; }
    return { ok: true };
  }
  function setOriginal(tale, on) {
    [tale, ...(tale === HOME_OWNER ? ['home'] : [])].forEach(t => { if (S.tales[t]) S.tales[t].original = !!on; });
    save(); apply(); emit();
  }
  function setAgree(on) { S.agree = !!on; save(); }
  const settings = () => JSON.parse(JSON.stringify(S));
  const tale = t => JSON.parse(JSON.stringify(cfgOf(t)));

  /* ───────── 표지 그림(2026-11-24 사용자 결정) ─────────
     홈 카드·타일·배너·책 표지(_key_*)·끝 화면(_back_*)을 주인공 모습에 맞춘다. 퍼즐 조각은 원래 그림 그대로(부르는 쪽이 cover 를 거치지 않는다).
     · 유니콘·사탕 마녀·빨간 자동차: 같은 구도로 아이만 바꾼 그림 <원래이름>_<자리><모습>.webp (tools/app/gen/mk_jobs_look_cover.py)
     · 구름 공장: 아이 셋을 지운 배경판 <원래이름>_base.webp 에 고른 모습의 자세 그림을 얹어 합성한다. 기본 모습 조합이면 원래 그림 그대로.
       합성은 비동기라 끝나기 전에는 배경판을 돌려주고, 끝나면 그 배경판을 쓰는 <img> 를 합성본으로 바꾼다.
       합성본은 data URL 로 sessionStorage 에 둔다(동화 페이지·책 넘김 handoff 가 바로 쓴다) */
  const COVER_SPOTS = ['card', 'tile', 'banner', 'key_wide', 'key_tall', 'back_wide', 'back_tall'];
  const COVER_LOOK = {
    unicorn: { A: { b: COVER_SPOTS } }, witch_candy: { A: { b: COVER_SPOTS } },
    red_car: { B: { g: ['banner', 'back_wide', 'back_tall'] } },   // 카드·타일·표지는 자동차만 있어 그대로
  };
  /* 구름 공장 합성: 자리 → [자세(원래 모습 id, cf4_ 뺌), 가운데 x, 발끝 y, 높이(그림 높이 비율), 좌우 뒤집기] — 그리는 순서(뒤 → 앞) */
  const COVER_KIDS = {
    card: [['nuna_lookup', .10, .93, .57], ['oppa_lookup', .26, .93, .57], ['agi_wave', .43, .92, .42]],
    tile: [['nuna_lookup', .21, .91, .80], ['oppa_lookup', .43, .91, .78], ['agi_wave', .63, .91, .56]],
    banner: [['nuna_lookup', .15, .93, .66], ['oppa_point', .32, .93, .64], ['agi_wave', .48, .94, .47]],
    key_wide: [['nuna_lookup', .32, .85, .58], ['oppa_lookup', .52, .84, .57], ['agi_wave', .42, .90, .42]],
    key_tall: [['nuna_lookup', .24, .66, .40], ['oppa_lookup', .41, .66, .39], ['agi_wave', .57, .67, .29]],
    back_wide: [['nuna_hug', .63, .97, .84], ['oppa_hug', .26, .97, .86], ['agi_hug', .45, 1, .62]],
    back_tall: [['nuna_hug', .24, .90, .64], ['oppa_hug', .52, .88, .64], ['agi_hug', .38, .99, .48]],
  };
  const COVER_V = 'c1';   // 합성 자리·배경판을 바꾸면 올린다(sessionStorage 열쇠)
  const coverSpot = (tale, path) => {
    const m = String(path || '').match(/^(.*?)(thumbs|banner)\/([^/?#]+)\.webp(\?[^#]*)?$/); if (!m) return null;
    const [, pre, dir, name, q = ''] = m;
    const spot = dir === 'banner' ? (name === tale ? 'banner' : '') : (name.startsWith(tale + '_') ? name.slice(tale.length + 1) : '');
    return COVER_SPOTS.includes(spot) ? { spot, root: pre, dir: pre + dir + '/', name, q } : null;
  };
  const coverMem = {}, coverJobs = {}, coverWait = {};
  const ssGet = k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const ssSet = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) { /* 꽉 차면 이번 페이지 메모리만 */ } };
  const loadImg = u => new Promise((res, rej) => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = rej; i.src = u; });
  function coverSwap(k, url) {
    const from = coverWait[k]; if (!from || typeof document === 'undefined') return;
    document.querySelectorAll('img').forEach(im => { if (from.has(im.getAttribute('src'))) im.src = url; });
    document.querySelectorAll('[style*="_base.webp"]').forEach(el => {
      from.forEach(b => { if (el.style.backgroundImage && el.style.backgroundImage.includes(b)) el.style.backgroundImage = el.style.backgroundImage.split(b).join(url); });
    });
  }
  function composeCover(c, base, lk, k) {
    if (coverJobs[k]) return coverJobs[k];
    return (coverJobs[k] = (async () => {
      const kids = COVER_KIDS[c.spot] || [];
      const [bg, ...ims] = await Promise.all([loadImg(base), ...kids.map(([p]) => loadImg(c.root + 'v3w/' + art('kkultteok', 'cf4_' + p, lk) + '.webp'))]);
      const cv = document.createElement('canvas'); cv.width = bg.naturalWidth; cv.height = bg.naturalHeight;
      const x = cv.getContext('2d'), W = cv.width, H = cv.height;
      x.drawImage(bg, 0, 0);
      kids.forEach(([, cx, by, hh, flip], i) => {
        const im = ims[i], h = hh * H, w = h * im.naturalWidth / im.naturalHeight, X = cx * W - w / 2, Y = by * H - h;
        x.save();
        /* 엔진이 붙이는 것과 같은 어두운 웜 그림자(종이 인형이 배경판 위에 떠 있는 두께) */
        x.shadowColor = 'rgba(46,36,28,.30)'; x.shadowBlur = H * .012; x.shadowOffsetX = H * .004; x.shadowOffsetY = H * .006;
        if (flip) { x.translate(X + w, Y); x.scale(-1, 1); x.drawImage(im, 0, 0, w, h); } else x.drawImage(im, X, Y, w, h);
        x.restore();
      });
      const url = c.spot === 'tile' ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', .9);   // 타일은 모서리 투명(원래 타일과 같게)
      coverMem[k] = url; ssSet(k, url); coverSwap(k, url);
      return url;
    })().catch(() => null));
  }
  function cover(tale, path) {
    try {
      const c = coverSpot(tale, path); if (!c) return path;
      if (tale === 'kkultteok') {
        if (!KIDS.some(s => lookTag(tale, s))) return path;
        const lk = looks(tale), k = `paperTheater.cover.${COVER_V}.${c.spot}.${KIDS.map(s => lk[s]).join('')}`;
        const hit = coverMem[k] || ssGet(k); if (hit) return (coverMem[k] = hit);
        if (typeof document === 'undefined') return path;
        const base = c.dir + c.name + '_base.webp' + c.q;
        (coverWait[k] = coverWait[k] || new Set()).add(base);
        composeCover(c, base, lk, k);
        return base;
      }
      const R = COVER_LOOK[tale]; if (!R) return path;
      for (const s of Object.keys(R)) {
        const tag = lookTag(tale, s);
        if (tag && R[s][tag] && R[s][tag].includes(c.spot)) return c.dir + c.name + '_' + s + tag + '.webp' + c.q;
      }
      return path;
    } catch (e) { return path; }
  }
  /* 그림 경로 하나(assets/v3w/<id>.webp)를 지금 모습으로 — 홈 스티커처럼 경로를 들고 있는 곳용 */
  const artSrc = (tale, path) => { try { return String(path).replace(/([^/]+)\.webp/, (m, id) => art(tale, id) + '.webp'); } catch (e) { return path; } };
  /* 구름 공장을 바꾼 모습이면 홈·동화 페이지에서 미리 합성해 둔다(카드 → 배너 → 표지 → 끝 화면 순) */
  try {
    if ((here === 'home' || here === 'kkultteok') && typeof document !== 'undefined' && KIDS.some(s => lookTag('kkultteok', s))) {
      const root = here === 'home' ? 'assets/' : '../../assets/';
      COVER_SPOTS.forEach(sp => cover('kkultteok', root + (sp === 'banner' ? 'banner/kkultteok' : 'thumbs/kkultteok_' + sp) + '.webp'));
    }
  } catch (e) { /* 미리 못 해도 부를 때 한다 */ }

  const ready = (async () => { try { return await apply(); } catch (e) { return 0; } })();
  return {
    SLOTS, KIDS, TALES, TALE_SLOTS, LOOK_ART, LOOK_CLIPS, supported, settings, tale, catalog: cat, fetchCatalog, quota, lastQuota: () => lastQ, check,
    preview, previewText, previewLine, previewArt, start, resume, useTicket, progress, needed, setOriginal, setAgree, agree: () => !!S.agree,
    look, looks, lookTag, sprite, art, artSrc, cover, apply, view, templatize, active, ready, busy: () => busy, stop: () => { stopReq = true; },
    onChange: f => { listeners.add(f); return () => listeners.delete(f); }, _polish: polish, _assemble: assemble, _native: !!FS, PRON_CLIPS
  };
})();
if (typeof window !== 'undefined') window.Names = Names;
