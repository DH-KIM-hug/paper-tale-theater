// 이름 바꾸기 템플릿 채우기·받침 판정 (docs/NAME_CHANGE_PLAN.md §2-2). ES 모듈.
// engine/name_form.js(앱, 전역 window.NameForm)와 로직이 같다. 한쪽을 고치면 다른 쪽도 똑같이 고친다.
//
// 템플릿 문법
//   {A}       이름 그대로 (A·B·C·D)
//   {A:X/Y}   이름 끝 글자에 받침이 있으면 이름+X, 없으면 이름+Y. 예: {A:이가/가} → 다현이가 / 서아가
//             'ㄹ' 받침 + X 가 '으로' 로 시작하면 Y 를 쓴다(예: {A:으로/로} → 하늘로).
//   {A_en}    영어 이름 그대로
//   {A_g:X/Y} 자리 A 의 주인공 모습(look)으로 고른다. 앞이 남자아이('b'), 뒤가 여자아이('g'). 영어 대명사용: {A_g:he/she} {A_g:his/her} {A_g:himself/herself}
//   {A>B:W/X/Y/Z} 호칭: A 가 B 를 부를 때. 네 값 = (A남·B남)/(A여·B남)/(A남·B여)/(A여·B여). 예: {A>B:형/오빠/누나/언니}
//   모습(look)은 { A: 'b'|'g', B, C } (D 강아지는 모습 없음). 빠진 자리는 ORIGINAL_LOOK. fill(tpl, names, look)
// 빠진 자리(이름이 없거나 빈 글)는 원래 이름(ORIGINAL)을 쓴다. 한글이 아닌 끝 글자는 받침 없음으로 본다.

export const ORIGINAL = Object.freeze({
  A: Object.freeze({ ko: '다현', en: 'Dahyun' }),     // 여자아이(유니콘을 찾아서·사탕 마녀의 핼러윈·구름 공장)
  B: Object.freeze({ ko: '이현', en: 'Ihyun' }),      // 남자아이(나의 빨간 자동차·구름 공장)
  C: Object.freeze({ ko: '은우', en: 'Eunwoo' }),     // 막내 아기(구름 공장)
  D: Object.freeze({ ko: '꿀떡', en: 'Kkulddeok' }),  // 강아지(구름 공장). 원문 '꿀떡이' = 꿀떡 + 이
});

// 주인공 모습: 'b' 남자아이 / 'g' 여자아이. 원래 그림 기준(A·C 여자아이, B 남자아이). D(강아지)는 모습이 없다.
export const ORIGINAL_LOOK = Object.freeze({ A: 'g', B: 'b', C: 'g' });
export const LOOKS = Object.freeze(['b', 'g']);
export const LOOK_SLOTS = Object.freeze(['A', 'B', 'C']);

export const SLOTS = Object.freeze(['A', 'B', 'C', 'D']);

const TOKEN = /\{([A-D])(?:>([A-D]))?(_en|_g)?(?::([^{}]*))?\}/g;

function lastCode(name) {
  const s = String(name || '');
  return s.length ? s.charCodeAt(s.length - 1) : 0;
}

// 끝 글자가 완성형 한글이고 종성이 있으면 true.
export function hasBatchim(name) {
  const c = lastCode(name);
  if (c < 0xac00 || c > 0xd7a3) return false;
  return (c - 0xac00) % 28 !== 0;
}

function endsWithRieul(name) {
  const c = lastCode(name);
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 === 8;
}

// 한국어: 완성형 한글 1~4자. 영어: 영문자 1~12자.
export function valid(name, lang = 'ko') {
  if (typeof name !== 'string') return false;
  return lang === 'en' ? /^[A-Za-z]{1,12}$/.test(name) : /^[가-힣]{1,4}$/.test(name);
}

function pick(names, slot, en) {
  const v = names && names[en ? slot + '_en' : slot];
  if (typeof v === 'string' && v.trim()) return v.trim();
  return ORIGINAL[slot][en ? 'en' : 'ko'];
}

// look 검사: { A?, B?, C? } 에 'b'|'g' 만. 맞으면 true.
export function validLook(look) {
  if (look == null) return true;
  if (typeof look !== 'object' || Array.isArray(look)) return false;
  return Object.entries(look).every(([k, v]) => LOOK_SLOTS.includes(k) && LOOKS.includes(v));
}

function lookOf(look, slot) {
  const v = look && look[slot];
  return v === 'b' || v === 'g' ? v : ORIGINAL_LOOK[slot] || 'g';
}

export function fill(tpl, names, look) {
  return String(tpl).replace(TOKEN, (all, slot, to, suf, spec) => {
    if (to) { // {A>B:W/X/Y/Z}
      const v = (spec || '').split('/');
      return v[(lookOf(look, to) === 'g' ? 2 : 0) + (lookOf(look, slot) === 'g' ? 1 : 0)] || '';
    }
    if (suf === '_g') {
      const v = (spec || '').split('/');
      return (lookOf(look, slot) === 'b' ? v[0] : v[1]) || '';
    }
    const n = pick(names, slot, suf === '_en');
    if (spec === undefined) return n;
    const i = spec.indexOf('/');
    if (i < 0) return all;
    const x = spec.slice(0, i), y = spec.slice(i + 1);
    if (!hasBatchim(n)) return n + y;
    if (endsWithRieul(n) && x.startsWith('으로')) return n + y;
    return n + x;
  });
}

// 템플릿에 나오는 자리 목록(예: ['A', 'B_en']).
export function slotsIn(tpl) {
  const out = new Set();
  for (const m of String(tpl).matchAll(TOKEN)) {
    if (m[2]) { out.add(m[1] + '_g'); out.add(m[2] + '_g'); } else out.add(m[1] + (m[3] || ''));
  }
  return [...out];
}

export const NameForm = { ORIGINAL, ORIGINAL_LOOK, LOOKS, SLOTS, hasBatchim, valid, validLook, fill, slotsIn };
export default NameForm;
