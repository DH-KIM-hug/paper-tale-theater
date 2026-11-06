"""이름 바꾸기 템플릿 추출 → server/src/name_lines.js (docs/NAME_CHANGE_PLAN.md §4-2).
  python3 tools/elevenlabs/build_name_lines.py          # 만들기
  python3 tools/elevenlabs/build_name_lines.py --check  # 만들지 않고 요약만

창작 동화(kkultteok·red_car·unicorn·witch_candy)의 놀이(voice_script_el/en.json)·읽어 주기(read_script_el/en.json) 대본과
홈 스티커 이름(home_narration_el.js)에서 아이·강아지 이름(A 다현, B 이현, C 은우, D 꿀떡)이 든 줄을 뽑는다.
gen_tale.py / gen_home.py 와 똑같이 보낼 글(연기 지시 태그 포함)·목소리·모델·voice_settings 를 다시 만들고,
그 값으로 만든 클립 이름(md5 앞 10자)이 지금 녹음 맵의 클립 이름과 같은지 줄마다 확인한다(다르면 멈춘다).
그래서 템플릿에 든 값은 '실제 녹음에 쓴 값' 그대로다. 녹음을 다시 하면 이 스크립트를 다시 돌려 version 을 올린다."""
import hashlib, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'server', 'src', 'name_lines.js')
TALES = ['kkultteok', 'red_car', 'unicorn', 'witch_candy']
DEFAULT_MODEL = 'eleven_v3'  # gen_tale.py 기본값(배역별 models 가 있으면 그 값)
TAG = {'happy': '[cheerful] ', 'sad': '[sad] ', 'angry': '[angry] ', 'whisper': '[whispers] ', 'toneup': '[excited] ', 'tonedown': '[calm] '}
BASE = {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.3}  # gen_tale.py SETTINGS
# 자리: 한국어 이름 본체(원문에는 받침 있는 이름 뒤에 '이'가 붙어 있다), 영어 이름(화면 글자), 영어 녹음에 쓴 발음 표기
SLOTS = [('A', '다현', ['Dahyun']), ('B', '이현', ['Ihyun', 'Ee-hyun']), ('C', '은우', ['Eunwoo']), ('D', '꿀떡', ['Kkulddeok'])]
EN_ORIG = {'A': 'Dahyun', 'B': 'Ihyun', 'C': 'Eunwoo', 'D': 'Kkulddeok'}
PARTICLES = ['한테서', '한테', '에게', '이랑', '처럼', '하고', '까지', '부터', '보다', '랑', '는', '가', '를', '와', '의', '도', '만']
HOME = {  # gen_home.py 값(스티커 이름 줄은 커밋되지 않은 스크립트가 같은 함수로 만들었다. 태그는 클립 이름으로 찾는다)
    'voice': 'pFZP5JQG7iQjIQuC4Bku', 'model': 'eleven_v4', 'set': {'stability': 0.45, 'style': 0.35},
    'tags': ['[cheerful, clear, warm] ', '[excited, delighted, bright, cheering] ', '[warm, curious, gentle] ', '[thrilled, amazed, cheering] ',
             '[excited, giggly, delighted] ', '[cheerful, warm] ', '[warm, clear] ', '[cheerful] ', ''],
}

# ---- 주인공 모습(look) 문법 (docs/NAME_SETUP_V2_PLAN.md §4-3) ----
# 영어 대명사를 {A_g:he/she}(앞=남자아이 b, 뒤=여자아이 g)로 바꾼다. 한국어에는 성별 단어가 없어 손댈 것이 없다.
# 동화마다 '주인공 자리'를 정하고, 그 줄의 he/she/his/her 가 모두 주인공을 가리키면 자동으로 바꾼다.
HERO = {'red_car': 'B', 'unicorn': 'A', 'witch_candy': 'A'}
# 자동으로 안 되는 동화(구름 공장: 대명사 대부분이 강아지·'아이 셋'을 가리킴)는 줄마다 손으로 정한다. 영어 원문 → 자리
PRON_MANUAL = {'kkultteok': {'Ihyun pushes the shape press down with all his might. Clunk!': 'B'}}
# 대명사가 주인공이 아닌 줄(자동 동화에서 빼기). 영어 원문 목록. 지금은 없다
PRON_EXCLUDE = {'red_car': set(), 'unicorn': set(), 'witch_candy': set()}
# 원래 모습(ORIGINAL_LOOK): 'b' 남자아이 / 'g' 여자아이
ORIGINAL_LOOK = {'A': 'g', 'B': 'b', 'C': 'g'}
PRON = {  # 단어 → (남자아이 b, 여자아이 g). 'her' 는 이 대본에서 모두 소유격(her basket)이라 his/her 로 본다
    'he': ('he', 'she'), 'she': ('he', 'she'), 'his': ('his', 'her'), 'her': ('his', 'her'), 'him': ('him', 'her'),
    'himself': ('himself', 'herself'), 'herself': ('himself', 'herself'),
}
PRON_RE = re.compile(r'\b(he|she|his|her|him|himself|herself)\b', re.I)
# 배역 × 모습 → 목소리 id. 이름이 든 아이 대사(구름 공장 첫째 nuna=A·둘째 oppa=B·막내 agi=C)를 서버가 모습에 맞는 목소리로 만든다.
# 값 None = 원래 배역 목소리 그대로. 목소리 id 가 정해지면 이 표의 값만 바꾸고 다시 돌린다(다른 곳은 손대지 않는다).
LOOK_VOICE = {
    ('kkultteok', 'nuna'): ('A', {'b': None, 'g': None}),
    ('kkultteok', 'oppa'): ('B', {'b': None, 'g': None}),
    ('kkultteok', 'agi'): ('C', {'b': None, 'g': None}),
}

def pron_slot(tale, text):
    """이 영어 줄의 대명사가 가리키는 주인공 자리(없으면 None)."""
    if text in PRON_MANUAL.get(tale, {}): return PRON_MANUAL[tale][text]
    if tale in HERO and text not in PRON_EXCLUDE.get(tale, set()): return HERO[tale]
    return None

def pron_tpl(text, slot):
    def rep(m):
        w = m.group(1); b, g = PRON[w.lower()]
        if w[0].isupper(): b, g = b.capitalize(), g.capitalize()
        return '{%s_g:%s/%s}' % (slot, b, g)
    parts = re.split(r'(\[[^\]]*\])', text)  # 연기 지시 [..] 안은 건드리지 않는다
    out = ''.join(p if p.startswith('[') else PRON_RE.sub(rep, p) for p in parts)
    return out, out != text

def md5(s): return hashlib.md5(s.encode()).hexdigest()[:10]

def ko_tpl(text):
    """한국어 글의 이름을 템플릿으로. 받침 있는 원문(다현·이현·꿀떡)은 '본체+이'(+조사) 또는 '본체+아'(부름),
    받침 없는 원문(은우)은 '본체'(+조사)."""
    out, i, found = [], 0, []
    while i < len(text):
        hit = None
        for slot, body, _ in SLOTS:
            if text.startswith(body, i): hit = (slot, body); break
        if not hit: out.append(text[i]); i += 1; continue
        slot, body = hit
        j = i + len(body)
        batchim = (ord(body[-1]) - 0xAC00) % 28 != 0
        if batchim:
            if text.startswith('아', j) and not text.startswith('아요', j):
                out.append('{%s:아/야}' % slot); i = j + 1; found.append(slot); continue
            if not text.startswith('이', j): raise SystemExit(f'이름 뒤에 이/아가 없음: {text!r}')
            j += 1
        else:
            if text.startswith('야', j):
                out.append('{%s:아/야}' % slot); i = j + 1; found.append(slot); continue
        p = next((p for p in PARTICLES if text.startswith(p, j)), '')
        out.append('{%s:이%s/%s}' % (slot, p, p)); i = j + len(p); found.append(slot)
    return ''.join(out), found

def en_tpl(text, tale=None):
    orig, found = {}, []
    gs = pron_slot(tale, re.sub(r'^(?:\[[^\]]*\]\s*)+', '', text)) if tale else None
    for slot, _, spells in SLOTS:
        for sp in sorted(spells, key=len, reverse=True):
            if sp in text:
                text = text.replace(sp, '{%s_en}' % slot); found.append(slot)
                if sp != EN_ORIG[slot]: orig[slot + '_en'] = sp
    if re.search(r'hyun|eunwoo|eun-woo|ddeok|kkul|dduk', re.sub(r'\{[A-D]_en\}', '', text), re.I): raise SystemExit(f'영어 이름 철자가 남음: {text!r}')
    if gs:
        text, changed = pron_tpl(text, gs)
        if changed: found.append(gs)
    return text, sorted(set(found)), orig

def has_name_ko(t): return any(b in t for _, b, _ in SLOTS)

def read_map(path, var):
    src = open(path).read()
    m = re.search(r'(?:Object\.assign\(' + var + r', |const ' + var + r' = )(\{.*?\n\})\)?;', src, re.S)
    return json.loads(m.group(1)) if m else {}

def replay(tale, mode, lang):
    """gen_tale.py main() 과 같은 계산. 반환: {한국어 열쇠: {'shown', 'segs': [{role, voice, model, settings, sent, url}]}}"""
    td = os.path.join(ROOT, 'tales', tale)
    en = lang == 'en'; read = mode == 'read'
    def flat(f):
        d = json.load(open(os.path.join(td, f)))
        d['lines'] = [l for sc in d['scenes'] for l in sc['lines'] if l.get('src') != 'chorus' and not l.get('voice')]; return d
    spec = flat('read_script_en.json' if en else 'read_script_el.json') if read else json.load(open(os.path.join(td, 'voice_script_en.json' if en else 'voice_script_el.json')))
    EL = json.load(open(os.path.join(td, 'voice_script_el.json')))
    if read: EL = {**EL, 'lines': flat('read_script_el.json')['lines'], 'extra': {}}
    V = {**EL['voices'], **((EL.get('voices_en') or {}) if en else {})}; MODELS = EL.get('models') or {}; SET = EL.get('settings') or {}; USE_DIR = EL.get('use_dir')
    sub = 'en/' if en else ''
    def lead(dr):
        if not dr: return None
        if not dr.startswith('='): return dr
        m = re.match(r'=\s*((?:\[[^\]]*\]\s*)+)', dr)
        return m.group(1).strip() if m else None
    def en_dir(elsegs, role, si):
        if not elsegs: return None
        if si < len(elsegs) and elsegs[si][0] == role: c = elsegs[si]
        else: c = next((x for x in elsegs if x[0] == role), None)
        return lead(c[3]) if c and len(c) > 3 else None
    def seg(role, text, emo, dr):
        if V[role] == 'tc': return {'role': role, 'tc': True}
        M = MODELS.get(role, DEFAULT_MODEL)
        if USE_DIR is not None and role not in USE_DIR: dr = None
        ST = SET.get(role)
        if dr and dr.startswith('='): sent = dr[1:]
        elif dr: sent = dr + ' ' + text
        elif M.startswith('eleven_v') and M != 'eleven_multilingual_v2' and emo: sent = TAG.get(emo.partition(':')[0], '') + text
        else: sent = text
        h = md5(f'{V[role]}|{M}|{sent}' + (f'|{json.dumps(ST, sort_keys=True)}' if ST else ''))
        return {'role': role, 'voice': V[role], 'model': M, 'settings': {**BASE, **(ST or {})}, 'sent': sent, 'text': text,
                'url': f'audio/el/{tale}/{sub}{role}_{h}.mp3'}
    ELL = {l['text']: l['segs'] for l in EL['lines'] if l.get('segs')}
    out, seen = {}, set()
    for ln in spec['lines']:
        text = ln['text']
        if text in seen: continue
        seen.add(text)
        shown = ln['en'] if en else text
        segs = [s + [None] * (4 - len(s)) for s in ln.get('segs') or [['nar', shown]]]
        if en: segs = [[role, s, emo, en_dir(ELL.get(text), role, si)] for si, (role, s, emo, dr) in enumerate(segs)]
        out[text] = {'shown': shown, 'segs': [seg(r, s, e, d) for r, s, e, d in segs]}
    for key, segs in (spec.get('extra') or {}).items():  # VOICE_LINES: 이름이 들면 알린다(지금은 없음)
        for s in segs:
            if has_name_ko(s[1]) or re.search(r'Dahyun|Ihyun|Ee-hyun|Eunwoo|Kkulddeok', s[1]): raise SystemExit(f'VOICE_LINES 에 이름: {tale} {key}')
    return out

def lang_part(tale, key, mode, lang, info, mapped):
    """한 언어의 녹음 템플릿(이름이 든 조각 하나). 이름이 없는 언어는 None."""
    segs = info['segs']
    url = mapped.get(key)
    if url is None: raise SystemExit(f'녹음 맵에 없음: {tale} {mode} {lang} {key!r}')
    urls = (url['c'] if isinstance(url, dict) else url)
    urls = [urls] if isinstance(urls, str) else urls
    hits = []
    for si, s in enumerate(segs):
        if s.get('tc'): continue
        if (lang == 'ko' and has_name_ko(s['text'])) or (lang == 'en' and en_tpl(s['text'], tale)[1]): hits.append(si)
    if not hits: return None
    if len(hits) > 1: raise SystemExit(f'이름이 든 조각이 둘 이상: {tale} {key!r}')
    si = hits[0]; s = segs[si]
    if len(urls) != len(segs) or urls[si] != s['url']:
        raise SystemExit(f'클립 이름이 다시 계산한 값과 다름(녹음 값 불일치): {tale} {mode} {lang} {key!r} {urls} vs {s["url"]}')
    if lang == 'ko':
        send, _ = ko_tpl(s['sent']); orig = {}
    else:
        send, _, orig = en_tpl(s['sent'], tale)
    part = {'seg': si if len(segs) > 1 else None, 'segs': len(segs), 'voice': s['voice'], 'model': s['model'],
            'settings': s['settings'], 'send': send, 'orig': orig, 'url': s['url'], 'chars': len(s['sent'])}
    lv = LOOK_VOICE.get((tale, s['role']))
    if lv:  # 모습별 목소리(없으면 원래 목소리). look.slot 의 모습으로 고른다
        part['look'] = {'slot': lv[0], 'voices': {lk: (vid or s['voice']) for lk, vid in lv[1].items()}}
    return part

def g_slots(ko, en, tpl_en):
    """모습(look)에 따라 결과가 달라지는 자리 목록: 영어 글의 _g 자리 + 모습별 목소리가 실제로 다른 자리."""
    out = set(re.findall(r'\{([A-D])_g:', ' '.join(p['send'] for p in (ko, en) if p) + ' ' + tpl_en))
    for p in (ko, en):
        lk = p and p.get('look')
        if lk and len(set(lk['voices'].values())) > 1: out.add(lk['slot'])
    return sorted(out)

def home_lines():
    ko_map = read_map(os.path.join(ROOT, 'home_narration_el.js'), 'NARRATION_CLIPS')
    en_map = read_map(os.path.join(ROOT, 'home_narration_el.js'), 'NARRATION_CLIPS_EN')
    pairs = [('다현이(꼬마 마법사)', 'Dahyun (little wizard)'), ('딸기 다현이', 'Strawberry Dahyun'), ('호박 다현이', 'Pumpkin Dahyun')]
    spoken = {'Dahyun (little wizard)': 'Dahyun, little wizard'}  # 영어 녹음은 괄호 없이 읽게 쉼표로 보냈다(클립 이름으로 확인)
    # 홈 녹음 맵에서 다른 이름 줄이 있는지도 본다
    extra = [k for k in ko_map if has_name_ko(k) and k not in dict(pairs)]
    if extra: raise SystemExit(f'홈에 처리 안 한 이름 줄: {extra}')
    lines = []
    for ko, en in pairs:
        parts = {}
        for lang, text, url in (('ko', ko, ko_map[ko]), ('en', spoken.get(en, en), en_map[en]['c'])):
            tag = next((t for t in HOME['tags'] if url.endswith('nar_' + md5(f"{HOME['voice']}|{HOME['model']}|{t + text}|{HOME['set']}") + '.mp3')), None)
            verified = tag is not None
            if not verified:  # 'Strawberry Dahyun' 영어 클립은 받아쓰기 검수 때 다른 글로 다시 만든 듯해 클립 이름으로 못 찾는다 → 같은 태그·목소리로 화면 글을 읽힌다
                print('경고: 홈 스티커 이름 보낸 글을 클립 이름으로 확인 못 함(기본 태그 사용):', lang, text)
                tag = HOME['tags'][0]
            sent = tag + text
            send, orig = (ko_tpl(sent)[0], {}) if lang == 'ko' else en_tpl(sent)[::2]
            parts[lang] = {'seg': None, 'segs': 1, 'voice': HOME['voice'], 'model': HOME['model'], 'settings': {**BASE, **HOME['set']},
                           'send': send, 'orig': orig, 'url': url, 'chars': len(sent), **({} if verified else {'verified': False})}
        lines.append({'id': 'h' + md5('home|' + ko)[:8], 'key': ko, 'keyEn': en, 'mode': 'home', 'tpl': ko_tpl(ko)[0], 'en': en,
                      'tplEn': en_tpl(en)[0], 'ko': parts['ko'], 'enRec': parts['en'], 'g': []})
    return lines

def main():
    tales, report = {}, []
    for tale in TALES:
        td = os.path.join(ROOT, 'tales', tale)
        maps = {(m, l): read_map(os.path.join(td, ('read_' if m == 'read' else '') + ('narration_el_en.js' if l == 'en' else 'narration_el.js')),
                                 'NARRATION_CLIPS_EN' if l == 'en' else 'NARRATION_CLIPS') for m in ('play', 'read') for l in ('ko', 'en')}
        per = {}  # key → {mode: {'ko', 'en', 'shownEn'}}
        for mode in ('play', 'read'):
            ko, en = replay(tale, mode, 'ko'), replay(tale, mode, 'en')
            for key, info in ko.items():
                ei = en.get(key)
                if not (has_name_ko(key) or (ei and en_tpl(ei['shown'], tale)[1])): continue
                kp = lang_part(tale, key, mode, 'ko', info, maps[(mode, 'ko')])
                ep = lang_part(tale, key, mode, 'en', ei, maps[(mode, 'en')]) if ei else None
                per.setdefault(key, {})[mode] = {'ko': kp, 'en': ep, 'shownEn': ei['shown'] if ei else None}
        lines = []
        for key, modes in per.items():
            p, r = modes.get('play'), modes.get('read')
            same = p and r and json.dumps(p, sort_keys=True) == json.dumps(r, sort_keys=True)
            groups = [('both', p)] if same else [(m, v) for m, v in (('play', p), ('read', r)) if v]
            for mode, v in groups:
                en_shown = v['shownEn'] or ''
                lines.append({'id': ('k' if mode == 'both' else mode[0]) + md5(tale + '|' + key)[:8], 'key': key, 'keyEn': key, 'mode': mode,
                              'tpl': ko_tpl(key)[0], 'en': en_shown, 'tplEn': en_tpl(en_shown, tale)[0], 'ko': v['ko'], 'enRec': v['en'],
                              'g': g_slots(v['ko'], v['en'], en_tpl(en_shown, tale)[0])})
        tales[tale] = lines
    tales['home'] = home_lines()
    # 요약
    tot = {'lines': 0, 'ko': 0, 'en': 0, 'kochars': 0, 'enchars': 0}
    for tale, lines in tales.items():
        modes = {}
        for l in lines: modes[l['mode']] = modes.get(l['mode'], 0) + 1
        slots = sorted({s for l in lines for s in re.findall(r'\{([A-D])', l['tpl'] + l['tplEn'])})
        kc = sum(l['ko']['chars'] for l in lines if l['ko']); ec = sum(l['enRec']['chars'] for l in lines if l['enRec'])
        kn = sum(1 for l in lines if l['ko']); en_n = sum(1 for l in lines if l['enRec'])
        report.append(f'{tale}: 줄 {len(lines)} {modes} 자리 {slots} | 녹음 ko {kn}줄 {kc}자, en {en_n}줄 {ec}자')
        tot['lines'] += len(lines); tot['ko'] += kn; tot['en'] += en_n; tot['kochars'] += kc; tot['enchars'] += ec
        for s in 'ABCD':
            sl = [l for l in lines if '{' + s in l['tpl'] + l['tplEn']]
            if sl: report.append(f'   {s}: {len(sl)}줄, ko {sum(l["ko"]["chars"] for l in sl if l["ko"])}자, en {sum(l["enRec"]["chars"] for l in sl if l["enRec"])}자')
    report.append(f'합계: 줄 {tot["lines"]}, ko 녹음 {tot["ko"]}줄 {tot["kochars"]}자(태그 포함), en 녹음 {tot["en"]}줄 {tot["enchars"]}자')
    print('\n'.join(report))
    if '--list' in sys.argv:
        for tale, lines in tales.items():
            for l in lines: print(tale, l['id'], l['mode'], l['tpl'], '|', l['ko']['send'] if l['ko'] else '-', '|', l['enRec']['send'] if l['enRec'] else '-')
    if '--check' in sys.argv: return
    body = json.dumps(tales, ensure_ascii=False, sort_keys=True)
    version = 'nl2-' + hashlib.sha256(body.encode()).hexdigest()[:10]
    with open(OUT, 'w') as f:
        f.write('// 이름 바꾸기 녹음 템플릿 — tools/elevenlabs/build_name_lines.py 가 생성(손으로 고치지 말 것).\n')
        f.write('// 줄: id, key(녹음 맵 열쇠 = 한국어 원문), keyEn(영어 맵 열쇠, 홈만 영어 글), mode(play|read|both|home), tpl/tplEn(화면 글 템플릿), en(영어 원문),\n')
        f.write('//     ko/enRec: 그 언어 녹음 조각 하나 {seg(여러 조각 줄의 몇 번째, 한 조각이면 null), segs, voice, model, settings, send(보낼 글 템플릿), orig(영어 발음 표기 원래 이름), url(지금 클립), chars, look?{slot, voices:{b,g}}(모습별 목소리)}\n')
        f.write('//     g: 모습(look)에 따라 결과가 달라지는 자리(영어 대명사 {A_g:he/she}, 모습별 목소리). ko 가 null 이면 영어에만 있는 줄\n')
        f.write(f'export const NAME_LINES_VERSION = {json.dumps(version)};\n')
        f.write('export const NAME_LINES = ' + json.dumps(tales, ensure_ascii=False, indent=1) + ';\n')
    print('저장', os.path.relpath(OUT, ROOT), version)

main()
