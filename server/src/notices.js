// 공지사항 (2026-11-13). 원본은 server/notices.json 한 파일이고, GET /v1/notices 가 그대로 돌려준다.
// 인증 없음·요청 본문 없음·아무것도 저장하지 않는다(공개 읽기). 앱은 받은 목록을 기기 안에만 둔다.
import raw from '../notices.json';

export const NOTICE_MAX = 20;
const ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const str = (v, max) => (typeof v === 'string' && v.trim() && v.length <= max ? v : null);

// 모양이 맞는 공지만 남기고 날짜 최신순으로 자른다(파일을 잘못 고쳐도 앱이 깨지지 않게).
export function cleanNotices(src) {
  const list = src && Array.isArray(src.notices) ? src.notices : [];
  const out = [];
  for (const n of list) {
    if (!n || !ID_RE.test(n.id) || !DATE_RE.test(n.date)) continue;
    const t = n.title || {}, b = n.body || {};
    const title = { ko: str(t.ko, 120), en: str(t.en, 120) };
    const body = { ko: str(b.ko, 2000), en: str(b.en, 2000) };
    if (!title.ko && !title.en) continue;
    out.push({ id: n.id, date: n.date, title, body });
  }
  out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return out.slice(0, NOTICE_MAX);
}

export const notices = (src = raw) => ({ notices: cleanNotices(src) });
