/* 이름 바꾸기 템플릿 채우기·받침 판정 (docs/NAME_CHANGE_PLAN.md §2-2). 일반 script, 전역 window.NameForm.
   server/src/name_form.js(서버, ES 모듈)와 로직이 같다. 한쪽을 고치면 다른 쪽도 똑같이 고친다.

   템플릿 문법
     {A}       이름 그대로 (A·B·C·D)
     {A:X/Y}   이름 끝 글자에 받침이 있으면 이름+X, 없으면 이름+Y. 예: {A:이가/가} → 다현이가 / 서아가
               'ㄹ' 받침 + X 가 '으로' 로 시작하면 Y 를 쓴다(예: {A:으로/로} → 하늘로).
     {A_en}    영어 이름 그대로
   빠진 자리(이름이 없거나 빈 글)는 원래 이름(ORIGINAL)을 쓴다. 한글이 아닌 끝 글자는 받침 없음으로 본다.
   NameForm.fill(tpl, names), NameForm.hasBatchim(name), NameForm.valid(name, lang), NameForm.slotsIn(tpl)
   names 예: { A: '서아', A_en: 'Seoa', B: '..', B_en: '..', C: '..', C_en: '..', D: '..', D_en: '..' } */
(function (root) {
  'use strict';
  var ORIGINAL = Object.freeze({
    A: Object.freeze({ ko: '다현', en: 'Dahyun' }),     // 여자아이(유니콘을 찾아서·사탕 마녀의 핼러윈·구름 공장)
    B: Object.freeze({ ko: '이현', en: 'Ihyun' }),      // 남자아이(나의 빨간 자동차·구름 공장)
    C: Object.freeze({ ko: '은우', en: 'Eunwoo' }),     // 막내 아기(구름 공장)
    D: Object.freeze({ ko: '꿀떡', en: 'Kkulddeok' })   // 강아지(구름 공장). 원문 '꿀떡이' = 꿀떡 + 이
  });
  var SLOTS = Object.freeze(['A', 'B', 'C', 'D']);
  var TOKEN = /\{([A-D])(_en)?(?::([^/{}]*)\/([^{}]*))?\}/g;

  function lastCode(name) {
    var s = String(name || '');
    return s.length ? s.charCodeAt(s.length - 1) : 0;
  }
  function hasBatchim(name) {
    var c = lastCode(name);
    if (c < 0xac00 || c > 0xd7a3) return false;
    return (c - 0xac00) % 28 !== 0;
  }
  function endsWithRieul(name) {
    var c = lastCode(name);
    return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 === 8;
  }
  function valid(name, lang) {
    if (typeof name !== 'string') return false;
    return lang === 'en' ? /^[A-Za-z]{1,12}$/.test(name) : /^[가-힣]{1,4}$/.test(name);
  }
  function pick(names, slot, en) {
    var v = names && names[en ? slot + '_en' : slot];
    if (typeof v === 'string' && v.trim()) return v.trim();
    return ORIGINAL[slot][en ? 'en' : 'ko'];
  }
  function fill(tpl, names) {
    return String(tpl).replace(TOKEN, function (_, slot, en, x, y) {
      var n = pick(names, slot, !!en);
      if (x === undefined) return n;
      if (!hasBatchim(n)) return n + y;
      if (endsWithRieul(n) && x.indexOf('으로') === 0) return n + y;
      return n + x;
    });
  }
  function slotsIn(tpl) {
    var out = [], m, re = new RegExp(TOKEN.source, 'g');
    while ((m = re.exec(String(tpl)))) {
      var k = m[1] + (m[2] || '');
      if (out.indexOf(k) < 0) out.push(k);
    }
    return out;
  }
  root.NameForm = { ORIGINAL: ORIGINAL, SLOTS: SLOTS, hasBatchim: hasBatchim, valid: valid, fill: fill, slotsIn: slotsIn };
})(typeof window !== 'undefined' ? window : globalThis);
