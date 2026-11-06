// 이름 금칙어(한·영). 손으로 관리한다(docs/NAME_CHANGE_PLAN.md §2-1, 사용자 검토 대상).
// PART: 이름 어디에 들어 있어도 거절(부분 일치). EXACT: 이름 전체가 같을 때만 거절(보통 이름·낱말 속에 섞여 나오는 것).
// 영어는 소문자로 비교한다. 한국어는 그대로 비교한다.

export const BANNED_KO_PART = [
  '씨발', '시발', '씨바', '씨팔', '시팔', '씹', '좆', '존나', '졸라', '개새', '새끼', '병신', '븅신', '빙신', '지랄', '염병',
  '엠창', '니미', '느금', '애미', '애비', '창녀', '걸레', '보지', '자지', '섹스', '야동', '변태', '꼴통', '닥쳐', '미친', '또라이',
  '쌍놈', '쌍년', '잡놈', '잡년', '썅', '년놈', '죽어', '자살', '살인', '마약', '대마', '틀딱', '한남', '김치녀', '똘추', '찐따',
];
export const BANNED_KO_EXACT = ['년', '놈', '똥', '엿', '개', '돼지', '바보', '멍청이', '병', '뻑', '빡'];

export const BANNED_EN_PART = [
  'fuck', 'fuk', 'shit', 'bitch', 'cunt', 'whore', 'slut', 'nigg', 'porn', 'penis', 'vagina', 'pussy',
  'dildo', 'wank', 'twat', 'bastard', 'asshole', 'motherf', 'hitler', 'nazi', 'retard', 'suicide',
];
export const BANNED_EN_EXACT = ['ass', 'arse', 'dick', 'damn', 'hell', 'sex', 'poop', 'poo', 'pee', 'butt', 'idiot', 'stupid', 'dumb', 'fat', 'ugly', 'die', 'dead',
  'kill', 'cum', 'cock', 'rape', 'fag', 'tits', 'boob', 'boobs'];  // kill·rape 등은 Killian·Grape 같은 이름을 막지 않게 전체 일치만

export function isBanned(name, lang = 'ko') {
  if (typeof name !== 'string' || !name) return false;
  if (lang === 'en') {
    const n = name.toLowerCase();
    return BANNED_EN_EXACT.includes(n) || BANNED_EN_PART.some((w) => n.includes(w));
  }
  return BANNED_KO_EXACT.includes(name) || BANNED_KO_PART.some((w) => name.includes(w));
}
