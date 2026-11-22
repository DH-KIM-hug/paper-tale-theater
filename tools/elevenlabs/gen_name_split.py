"""이름 든 대사를 '이름 조각 + 고정 조각'으로 나눠 녹음하고, 기본 이름 완성본을 합쳐 앱 묶음에 넣는다 (2026-11-22 사용자 확정).
  ~/.venvs/paper-tale/bin/python tools/elevenlabs/gen_name_split.py plan      # 할 일·보낼 글자 수만(녹음 안 함)
  ~/.venvs/paper-tale/bin/python tools/elevenlabs/gen_name_split.py record    # 녹음 + whisper 받아쓰기 검사(더 읽기·틀린 글·반복 → 다시 뽑기 최대 3번)
  ~/.venvs/paper-tale/bin/python tools/elevenlabs/gen_name_split.py build     # 조각 다듬기 → 고정 조각(앱 묶음) + 기본 이름 완성본 + name_split_manifest.json
  ~/.venvs/paper-tale/bin/python tools/elevenlabs/gen_name_split.py apply     # 대본·화면 글자·녹음 맵 바꾸기(글이 바뀐 줄, 완성본 주소)
그다음 python3 tools/elevenlabs/build_name_lines.py 로 server/src/name_lines.js 를 다시 만든다.

원천: name_split_spec.py(확정 문안), name_split_base.json(나누기 전 server/src/name_lines.js — 목소리·모델·설정·말투 태그·지금 클립).
조각 녹음: 같은 배역 목소리·모델·voice_settings. 고정 조각은 [말투 태그] + 글, 이름 조각은 글만(말투 태그는 앞 문맥으로).
앞뒤 조각 글은 previous_text / next_text 문맥으로 보낸다(차감 없음). 영어는 language_code en.
조각 다루기(앱 engine/names.js assemble 과 같은 규칙): 앞뒤 무음 자르기(-45dB) → 이름 조각만 고정 조각 평균 RMS 에 맞춤(±6dB) →
6ms/12ms 페이드 → 조각 뒤 간격(gap) → 이어 붙이기 → 다듬기(polish.py, polished.json 에는 적지 않고 audio/el/polished_name_split.json 에).
파일: 고정 조각 audio/el/<동화>/parts/<언어>_<해시>.mp3 (다듬기 전, 앱이 합칠 때 씀. '/en/' 폴더가 아니라 앱 빌드가 0.9배로 늘리지 않는다)
      기본 이름 완성본 audio/el/<동화>/name/<해시>.mp3 · 영어 audio/el/<동화>/en/name/ · 반대 모습(영어 대명사) audio/el/<동화>/look/<자리><모습>/en/name/
키는 ~/.config/elevenlabs/key (출력·기록 금지). 보낸 글자 상한 MAX_CHARS."""
import hashlib, json, math, os, re, subprocess, sys, time, urllib.error, urllib.request, difflib, fcntl
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.dirname(os.path.dirname(HERE))
from name_split_spec import D, P2, WH
from polish import polish

BASE = json.load(open(os.path.join(HERE, 'name_split_base.json')))
MANIFEST = os.path.join(HERE, 'name_split_manifest.json')
WORK = os.environ.get('NAME_SPLIT_WORK', os.path.expanduser('~/.paper-tale/name_split'))   # 받은 원본(저장소 밖)
SEL = os.path.join(WORK, 'sel.json'); LOG = os.path.join(WORK, 'cost_log.jsonl')
PLOG = os.path.join(ROOT, 'audio', 'el', 'polished_name_split.json')   # polish.py 전체 돌리기가 다시 다듬지 않게(polished.json 은 다른 세션 담당)
MAX_CHARS = int(os.environ.get('NAME_SPLIT_MAX_CHARS', '35000'))
TAG_IN_TEXT = os.environ.get('NAME_SPLIT_TAG_IN_TEXT', '1') == '1'
SLOTS = [('A', '다현', 'Dahyun'), ('B', '이현', 'Ihyun'), ('C', '은우', 'Eunwoo'), ('D', '꿀떡', 'Kkulddeok')]
ORIG_LOOK = {'A': 'g', 'B': 'b', 'C': 'b'}
OPP = {'b': 'g', 'g': 'b'}
PARTICLES = ['한테서', '한테', '에게', '이랑', '처럼', '하고', '까지', '부터', '보다', '랑', '는', '가', '를', '와', '의', '도', '만']
PRON = {'he': ('he', 'she'), 'she': ('he', 'she'), 'his': ('his', 'her'), 'her': ('his', 'her'), 'him': ('him', 'her'),
        'himself': ('himself', 'herself'), 'herself': ('himself', 'herself')}
PRON_RE = re.compile(r'\b(he|she|his|her|him|himself|herself)\b', re.I)
# 구름 공장 '삼남매' → '아이들'(이름 없는 줄, 통째 다시 녹음). 이름 든 13줄은 name_split_spec.py 안에서 바꿨다
KIDS = [('삼남매는 영차, 영차 언덕을 올라요.', '아이들은 영차, 영차 언덕을 올라요.'),
        ('삼남매는 살금살금 따라 들어가요.', '아이들은 살금살금 따라 들어가요.'),
        ('삼남매도 손을 흔들며 밖으로 달려 나가요.', '아이들도 손을 흔들며 밖으로 달려 나가요.'),
        ('"으악!" 삼남매는 서로 꼭 껴안아요.', '"으악!" 아이들은 서로 꼭 껴안아요.'),
        ('밤이 되었어요. 삼남매는 이불 속에 쏙 들어갔어요.', '밤이 되었어요. 아이들은 이불 속에 쏙 들어갔어요.'),
        ('삼남매는 눈을 동그랗게 뜨고 굴뚝을 올려다봐요.', '아이들은 눈을 동그랗게 뜨고 굴뚝을 올려다봐요.'),
        ('삼남매는 짝짝짝, 손뼉을 쳤어요.', '아이들은 짝짝짝, 손뼉을 쳤어요.'),
        ('삼남매는 휴우, 가슴을 쓸어내리고 까르르 웃었어요.', '아이들은 휴우, 가슴을 쓸어내리고 까르르 웃었어요.'),
        ('하늘은 우르릉, 삼남매 가슴은 두근두근.', '하늘은 우르릉, 아이들은 가슴이 두근두근.'),
        ('하늘의 먹구름이 삼남매에게 말했어요.', '하늘의 먹구름이 아이들에게 말했어요.')]
TRIM = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.015,'
        'areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse')

def md5(s, n=10): return hashlib.md5(s.encode()).hexdigest()[:n]
def ff(*a):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-y', *a], capture_output=True, text=True)
    if p.returncode: raise RuntimeError(p.stderr[-600:])
    return p.stderr
def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)

# ---------- 템플릿 (server/src/name_form.js 와 같은 문법) ----------
def batchim(n):
    c = ord(n[-1]) if n else 0
    return 0xAC00 <= c <= 0xD7A3 and (c - 0xAC00) % 28 != 0
def fill(tpl, names=None, look=None):
    names = names or {}; look = look or {}
    def r(m):
        slot, suf, spec = m.group(1), m.group(2), m.group(3)
        if suf == '_g':
            b, g = spec.split('/'); return b if (look.get(slot) or ORIG_LOOK[slot]) == 'b' else g
        orig = dict((s, (k, e)) for s, k, e in SLOTS)[slot]
        n = names.get(slot + (suf or '')) or (orig[1] if suf == '_en' else orig[0])
        if spec is None: return n
        x, y = spec.split('/', 1)
        return n + (x if batchim(n) and not (x.startswith('으로') and (ord(n[-1]) - 0xAC00) % 28 == 8) else y)
    return re.sub(r'\{([A-D])(_en|_g)?(?::([^{}]*))?\}', r, tpl)
def ko_tpl(t):
    out, i = [], 0
    while i < len(t):
        hit = next(((s, k) for s, k, _ in SLOTS if t.startswith(k, i)), None)
        if not hit: out.append(t[i]); i += 1; continue
        s, k = hit; j = i + len(k)
        if batchim(k):
            if t.startswith('아', j) and not t.startswith('아요', j): out.append('{%s:아/야}' % s); i = j + 1; continue
            assert t.startswith('이', j), t
            j += 1
        p = next((p for p in PARTICLES if t.startswith(p, j)), '')
        out.append('{%s:이%s/%s}' % (s, p, p)); i = j + len(p)
    return ''.join(out)
def en_tpl(t, gslot):
    for s, _, e in SLOTS: t = t.replace(e, '{%s_en}' % s)
    if gslot:
        def rep(m):
            w = m.group(1); b, g = PRON[w.lower()]
            if w[0].isupper(): b, g = b.capitalize(), g.capitalize()
            return '{%s_g:%s/%s}' % (gslot, b, g)
        t = PRON_RE.sub(rep, t)
    return t
def slots_of(tpl, lang):
    return sorted({m.group(1) for m in re.finditer(r'\{([A-D])(_en)?(?::[^{}]*)?\}', tpl) if (m.group(2) == '_en') == (lang == 'en')})
def gslots(tpl): return sorted(set(re.findall(r'\{([A-D])_g:', tpl)))
def norm(s): return re.sub(r'[^0-9a-z가-힣]', '', (s or '').lower())
# 받아쓰기가 이름을 흔히 이렇게 적는다(말할 때 ㅎ이 약해짐): 비교 전에 원래 이름으로 돌린다
ASR_ALIAS = [('다연', '다현'), ('이연', '이현'), ('희현', '이현'), ('은유', '은우'), ('꿀덕', '꿀떡'), ('굴떡', '꿀떡')]
def asr_fix(t):
    for a, b in ASR_ALIAS: t = t.replace(a, b)
    return t

def clean_tag(tag, lang='ko'):  # 사탕 마녀 '뿅'이 두세 번 읽히던 원인(말투 지시 'a pop on 뿅')을 뺀다
    t = re.sub(r',?\s*a pop on 뿅', '', tag)
    if lang == 'en':   # 영어 녹음 태그 속 한국어 낱말 지시(a small pause before 잠잘 때도 등)는 뜻이 없고 'Munch munch' 를 겹쳐 읽게 했다(2026-11-22 받아쓰기) → 뺀다
        t = re.sub(r',\s*[^,\[\]]*[가-힣][^,\[\]]*', '', t)
    return re.sub(r'\[\s*,\s*', '[', t)

# ---------- 줄 모으기 ----------
def lines():
    """[(tale, idx, line)] line = {id, mode, key, keyNew, en, enNew, tpl, tplEn, g, parts:{ko|en: part}}"""
    out = []
    for tale, rows in D.items():
        base = BASE[tale]; assert len(base) == len(rows), tale
        for i, row in enumerate(rows):
            n, kpos, kj, ks, epos, ej, es, note, flag = row
            b = base[i]; g = b.get('g') or []
            assert len(g) <= 1, (tale, n, g)
            gslot = g[0] if g else None
            L = {'tale': tale, 'n': n, 'id': b['id'], 'mode': b['mode'], 'key': b['key'], 'keyEn': b.get('keyEn') or b['key'], 'en': b['en'], 'parts': {}, 'g': g}
            for lang, spec, judg, part in (('ko', ks, kj, b['ko']), ('en', es, ej, b['enRec'])):
                if part is None:
                    assert spec is None, (tale, n, lang); continue
                m = re.match(r'^((?:\[[^\]]*\]\s*)+)', part['send']); tag = m.group(1).strip() if m else ''
                old_seg = fill(part['send'][len(m.group(0)) if m else 0:].strip())
                ps = []
                for p in spec.split('‖'):
                    p = p.strip(); k = 'S'
                    if p.startswith('N:'): k, p = 'N', p[2:]
                    elif p.startswith('K:'): k, p = 'K', p[2:]
                    tpl = p if k == 'K' else (ko_tpl(p) if lang == 'ko' else en_tpl(p, gslot))
                    ps.append({'k': k, 'tpl': tpl})
                kind = 'pron' if judg == P2 else ('whole' if [p['k'] for p in ps if p['k'] != 'K'] == ['N'] else 'split')
                if kind == 'pron': assert len(ps) == 1 and ps[0]['k'] == 'S', (tale, n)
                seg = [p for p in ps if p['k'] != 'K']
                assert sum(1 for p in seg if p['k'] == 'N') <= 1, (tale, n, lang)   # 이름 조각은 줄마다 하나(앱이 기본 이름 조각을 묶음에 둘 필요 없게)
                new_seg = ' '.join(fill(p['tpl']) for p in seg)
                full = ' '.join(fill(p['tpl']) if p['k'] != 'K' else p['tpl'] for p in ps)
                if tale == 'home' and lang == 'en': full = b['keyEn']   # 홈 영어: 화면 글(괄호) ≠ 읽은 글(쉼표)
                same = norm(new_seg) == norm(old_seg)
                if kind == 'whole' and same:   # 글이 그대로인 통째 줄: 지금 녹음이 곧 기본 이름 녹음. 보낼 글 템플릿도 그대로
                    ps = [dict(p, tpl=(part['send'][len(m.group(0)) if m else 0:].strip())) if p['k'] == 'N' else p for p in ps]
                L['parts'][lang] = {'part': part, 'tag': tag, 'kind': kind, 'pieces': ps, 'oldSeg': old_seg, 'newSeg': new_seg, 'full': full, 'same': same}
            L['keyNew'] = L['parts']['ko']['full'] if 'ko' in L['parts'] else L['key']
            L['enNew'] = L['parts']['en']['full'] if 'en' in L['parts'] else L['en']
            out.append(L)
    return out

def gap_after(p, nxt):
    """조각 뒤 간격(초). 앱 engine/names.js 와 같은 값이 catalog(gap)로 간다."""
    t = fill(p['tpl']).rstrip()
    if t.endswith(('?', '!')) and len(norm(t)) <= 4: return 0.4      # 뿅! · Huh? · Poof! 같은 짧은 감탄
    if t.endswith(('.', '!', '?', '…')): return 0.36                 # 문장 끝
    if t.endswith(','): return 0.16 if p['k'] == 'N' else 0.22        # 부름(다현아,) · 쉼표
    return 0.05                                                      # 문장 가운데(이름 → 이어지는 말)

# ---------- 녹음할 일 ----------
def jobs(LS):
    """녹음 일 목록과 줄별 조립표. 일 = {sig, voice, model, settings, text, prev, next, lang, expect, short}"""
    J, plan = {}, []
    def add(part, tag, lang, text, prev, nxt, expect, shared=False):
        body = {'voice': part['voice'], 'model': part['model'], 'settings': part['settings'], 'text': text, 'prev': prev or None, 'next': nxt or None, 'lang': lang}
        sig = md5(json.dumps(body, sort_keys=True, ensure_ascii=False), 12)
        J.setdefault(sig, dict(body, sig=sig, expect=expect))
        return sig
    for L in LS:
        for lang, P in L['parts'].items():
            part, ps, kind = P['part'], P['pieces'], P['kind']
            tag = clean_tag(P['tag'], lang)
            gs = sorted({s for p in ps for s in gslots(p['tpl'])})
            variants = [('o', {})] + ([('x', {s: OPP[ORIG_LOOK[s]] for s in gs})] if gs else [])
            for v, look in variants:
                T = [fill(p['tpl'], part.get('orig') or {}, look) if p['k'] != 'K' else p['tpl'] for p in ps]   # 영어 녹음에 쓴 발음 표기(Ee-hyun)
                seq = []
                for i, p in enumerate(ps):
                    if p['k'] == 'K': continue
                    if v == 'x' and not gslots(p['tpl']):   # 모습과 상관없는 조각은 원래 모습 녹음을 같이 쓴다
                        seq.append(('ref', i)); continue
                    if kind in ('pron', 'whole') and v == 'o' and (kind == 'pron' or P['same']):
                        seq.append(('old', part['url'])); continue
                    prev = ' '.join(T[:i]); nxt = ' '.join(T[i + 1:])
                    whole = kind in ('pron', 'whole')
                    short = len(norm(T[i])) <= 4 and T[i].rstrip().endswith(('!', '?')) and p['k'] == 'S'
                    if whole: text, pr, nx = (tag + ' ' + T[i]).strip(), None, None
                    elif short and lang and re.fullmatch(r'(뿅|Poof)!', T[i].strip()):   # 사탕 마녀 '뿅!/Poof!' 은 여러 줄이 한 조각(문맥 없이)
                        text, pr, nx = (tag + ' ' + T[i]).strip(), None, None
                    elif p['k'] == 'S':
                        text = (tag + ' ' + T[i]).strip() if TAG_IN_TEXT else T[i]
                        pr = prev if TAG_IN_TEXT else (tag + ' ' + prev).strip()
                        nx = nxt
                    else:
                        text, pr, nx = T[i], (tag + ' ' + prev).strip(), nxt
                    seq.append(('rec', add(part, tag, lang, text, pr, nx, T[i])))
                plan.append({'L': L, 'lang': lang, 'v': v, 'look': look, 'seq': seq})
    return J, plan

def kids_jobs():
    """'삼남매' → '아이들' 이름 없는 줄: 같은 목소리·설정·말투(구름 공장 nar 는 태그 없이)로 통째. 클립 이름은 gen_tale.py 와 같은 규칙"""
    td = os.path.join(ROOT, 'tales', 'kkultteok'); EL = json.load(open(os.path.join(td, 'voice_script_el.json')))
    V, MODELS, SET, USE_DIR = EL['voices'], EL.get('models') or {}, EL.get('settings') or {}, EL.get('use_dir')
    out = []
    for old, new in KIDS:
        so = old.split('" ', 1)[-1] if old.startswith('"') else old
        sn = new.split('" ', 1)[-1] if new.startswith('"') else new
        role = 'nar'; M = MODELS.get(role, 'eleven_v3'); ST = SET.get(role)
        sent = sn   # nar 는 use_dir 에 없어 태그 없이 보낸다(지금 녹음과 같게)
        assert USE_DIR is not None and role not in USE_DIR
        h = md5(f'{V[role]}|{M}|{sent}' + (f'|{json.dumps(ST, sort_keys=True)}' if ST else ''))
        out.append({'old': old, 'new': new, 'segOld': so, 'segNew': sn, 'voice': V[role], 'model': M,
                    'settings': {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.3, **(ST or {})}, 'text': sent, 'url': f'audio/el/kkultteok/nar_{h}.mp3'})
    return out

def plan_cmd():
    LS = lines(); J, plan = jobs(LS); K = kids_jobs()
    n = sum(len(j['text']) for j in J.values()); kc = sum(len(k['text']) for k in K)
    print(f'줄 {len(LS)}, 조립 {len(plan)}, 녹음 조각 {len(J)}개 {n}자 + 아이들 줄 {len(K)}개 {kc}자 = {n + kc}자 (태그 {"글 안" if TAG_IN_TEXT else "문맥"})')
    by = {}
    for j in J.values(): by.setdefault(j['lang'], [0, 0]); by[j['lang']][0] += 1; by[j['lang']][1] += len(j['text'])
    print('언어별', by)
    if '-v' in sys.argv:
        for L in LS:
            for lang, P in L['parts'].items():
                if not P['same'] or L['key'] != L['keyNew'] or L['en'] != L['enNew']:
                    print(L['tale'], L['n'], lang, P['kind'], '|', P['oldSeg'], '→', P['newSeg'])
    return LS, J, plan, K

# ---------- ElevenLabs ----------
def tts(path, j):
    key = open(os.path.expanduser('~/.config/elevenlabs/key')).read().strip()
    body = {'text': j['text'], 'model_id': j['model'], 'voice_settings': j['settings']}
    if j.get('prev'): body['previous_text'] = j['prev']
    if j.get('next'): body['next_text'] = j['next']
    if j.get('lang') == 'en': body['language_code'] = 'en'
    for a in range(5):
        r = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{j['voice']}?output_format=mp3_44100_128", json.dumps(body).encode(),
                                   {'xi-api-key': key, 'Content-Type': 'application/json'})
        try:
            resp = urllib.request.urlopen(r, timeout=120); data = resp.read()
            if len(data) < 200: raise RuntimeError('빈 응답')
            open(path, 'wb').write(data)
            cc = resp.headers.get('character-cost')
            with open(LOG, 'a') as f: f.write(json.dumps({'file': os.path.basename(path), 'len': len(j['text']), 'billed': cc, 't': time.time()}) + '\n')
            return cc
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors='replace')[:200]
            if e.code in (429, 500, 502, 503) and a < 4: time.sleep(3 * (a + 1)); continue
            raise RuntimeError(f'{e.code} {msg}')

_W = None
def asr(path, lang):
    global _W
    import mlx_whisper
    _W = mlx_whisper
    r = mlx_whisper.transcribe(path, path_or_hf_repo='mlx-community/whisper-large-v3-turbo', language=lang, condition_on_previous_text=False)
    return r['text'].strip()
def trimmed(src, dst):
    ff('-i', src, '-af', TRIM, '-ac', '1', '-ar', '44100', dst); return dst
NAME_RE = re.compile(r"Ee-hyun|Ihyun|Dahyun|Eunwoo|Kkulddeok")
def check(path, exp, lang):
    tw = path[:-4] + '.trim.wav'; trimmed(path, tw); d = dur(tw)
    t = asr(tw, lang); a, b = norm(exp), norm(asr_fix(t))
    sc = difflib.SequenceMatcher(None, a, b).ratio()
    if lang == 'en' and NAME_RE.search(exp):   # 영어 받아쓰기는 한국 이름을 못 적는다(Ee-hyun → equal) → 이름을 뺀 나머지 글이 다 들렸는지로 본다
        rest = norm(NAME_RE.sub(' ', exp))
        if rest:
            m = difflib.SequenceMatcher(None, rest, b); sc = sum(x.size for x in m.get_matching_blocks()) / len(rest)
        else: sc = 1.0   # 이름만 든 조각: 받아쓰기가 다른 말(你想·equal)로 적어도 길이 검사로만 본다
        a = a + 'xxxx'   # 이름 몫만큼 길이 여유
    over = len(b) > len(a) + (3 if lang == 'en' else 2)
    syl = len(re.sub(r'[^가-힣]', '', exp)) if lang == 'ko' else len(exp.split())
    if len(a) <= 5:   # 짧은 조각: 받아쓰기보다 길이로 반복을 잡는다(뿅! 두세 번 → 1.5초)
        lim = (0.55 + 0.30 * syl) if lang == 'ko' else (0.6 + 0.42 * syl)
        if d > lim: over = True
        if a and b.count(a) >= 2: over = True
    rep = bool(re.search(r'(.{3,})\1', b)) and not re.search(r'(.{3,})\1', a)
    ok = sc >= (0.7 if lang == 'en' else 0.8) and not over and not rep
    KO_NAME = re.compile('다현|이현|은우|꿀떡')
    short = (lang == 'en' and len(norm(NAME_RE.sub('', exp))) <= 5) or (lang == 'ko' and not KO_NAME.search(exp) and len(a) <= 5)   # 한국어 이름은 받아쓰기가 잘 적는다 → 이름 조각은 글로 본다
    if short:   # 짧은 조각(뿅!·킁킁킁!·Tap Kkulddeok!·이름만)은 받아쓰기가 흔들리고 지어낸다(쿵쿵쿵·Valentine…) → 길이(반복)만 본다. 줄 전체는 verify 에서 다시 받아쓴다
        ok = not (d > ((0.55 + 0.30 * max(1, syl)) if lang == 'ko' else (0.7 + 0.45 * max(1, syl))))
    return {'asr': t, 'score': round(sc, 3), 'over': over, 'rep': rep, 'dur': round(d, 2), 'ok': ok}

def record_cmd():
    os.makedirs(os.path.join(WORK, 'raw'), exist_ok=True)
    LS, J, plan, K = plan_cmd()
    sel = json.load(open(SEL)) if os.path.exists(SEL) else {}
    sent = sum(t['len'] for t in map(json.loads, open(LOG))) if os.path.exists(LOG) else 0
    todo = [('k' + md5(k['url'], 12), dict(k, lang='ko', expect=k['segNew'], prev=None, next=None)) for k in K] + [(s, j) for s, j in J.items()]
    redraw = set(sys.argv[sys.argv.index('--redraw') + 1].split(',')) if '--redraw' in sys.argv else set()   # 줄 받아쓰기(verify)에서 걸린 조각을 새로 뽑기
    only = '--only-ko-names' in sys.argv
    for sig, j in todo:
        if only and not (j['lang'] == 'ko' and re.search('다현|이현|은우|꿀떡', j['expect']) and len(norm(j['expect'])) <= 5): continue
        if sig not in redraw and sel.get(sig, {}).get('done') and (sel[sig].get('ok') or '--recheck' not in sys.argv) and not only: continue
        tries = []
        t0 = len([f for f in os.listdir(os.path.join(WORK, 'raw')) if f.startswith(sig + '_') and f.endswith('.mp3')]) if sig in redraw else 0
        for t in range(t0, t0 + 4 - (1 if sig in redraw else 0)):   # 처음 + 다시 뽑기 최대 3번 (이미 받은 파일은 지금 검사 규칙으로 다시 본다)
            p = os.path.join(WORK, 'raw', f'{sig}_{t}.mp3')
            if not os.path.exists(p):
                if sent + len(j['text']) > MAX_CHARS: print('상한 도달, 멈춤', sent); json.dump(sel, open(SEL, 'w'), ensure_ascii=False, indent=0); return
                tts(p, j); sent += len(j['text'])
            c = check(p, j['expect'], j['lang']); c['file'] = os.path.basename(p); tries.append(c)
            print(sig, t, '|', j['expect'], '=>', c['asr'], c['score'], c['dur'], 'OVER' if c['over'] else '', 'REP' if c['rep'] else '', 'OK' if c['ok'] else 'FAIL', flush=True)
            sel[sig] = {'tries': tries, 'expect': j['expect'], 'lang': j['lang']}
            json.dump(sel, open(SEL, 'w'), ensure_ascii=False, indent=0)
            if c['ok']: break
        best = max(tries, key=lambda c: (c['ok'], not c['over'], c['score'], -c['dur']))
        sel[sig] = {'tries': tries, 'best': best['file'], 'ok': best['ok'], 'expect': j['expect'], 'lang': j['lang'], 'done': True}
        json.dump(sel, open(SEL, 'w'), ensure_ascii=False, indent=0)
    bad = [(s, v['expect'], v['tries'][-1]['asr']) for s, v in sel.items() if v.get('done') and not v.get('ok')]
    print('녹음 끝. 보낸 글자', sent, '· 통과 못 한 조각', len(bad))
    for b in bad: print('  의심', b)

# ---------- 합치기 ----------
def rms_db(w):
    s = ff('-i', w, '-af', 'astats=metadata=0', '-f', 'null', '-')
    return float(re.findall(r'RMS level dB: (-?[\d.inf]+)', s)[-1])
def plog(paths):
    with open(PLOG + '.lock', 'w') as lk:
        fcntl.flock(lk, fcntl.LOCK_EX)
        d = json.load(open(PLOG)) if os.path.exists(PLOG) else {}
        for p in paths: d[os.path.relpath(p, ROOT)] = os.path.getsize(p)
        json.dump(d, open(PLOG, 'w'), ensure_ascii=False, indent=0, sort_keys=True)
def join(items, out):
    """items = [(wav, gain_db, gap)] → out mp3 (128k, polish)."""
    ins, fl = [], []
    for i, (w, g, gap) in enumerate(items):
        ins += ['-i', w]; d = dur(w)
        fl.append(f'[{i}]volume={g:.2f}dB,afade=t=in:d=0.006,afade=t=out:st={max(0, d - 0.012):.3f}:d=0.012,apad=pad_dur={gap}[p{i}]')
    fl.append(''.join(f'[p{i}]' for i in range(len(items))) + f'concat=n={len(items)}:v=0:a=1[o]')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    ff(*ins, '-filter_complex', ';'.join(fl), '-map', '[o]', '-ac', '1', '-ar', '44100', '-b:a', '128k', out)
    polish(out, log=False)

def build_cmd():
    LS, J, plan, K = plan_cmd()
    sel = json.load(open(SEL))
    tmp = os.path.join(WORK, 'tmp'); os.makedirs(tmp, exist_ok=True)
    def raw(sig): v = sel[sig]; assert v.get('done'), sig; return os.path.join(WORK, 'raw', v['best'])
    tw = {}
    def twav(sig):
        if sig not in tw: tw[sig] = trimmed(raw(sig), os.path.join(tmp, sig + '.wav'))
        return tw[sig]
    made = []
    pdone = json.load(open(os.path.join(WORK, 'parts_from.json'))) if os.path.exists(os.path.join(WORK, 'parts_from.json')) else {}
    def part_url(tale, lang, sig):   # 고정 조각(다듬기 전, 앞뒤 무음 자름) → 앱 묶음
        rel = f'audio/el/{tale}/parts/{lang}_{sig}.mp3'; p = os.path.join(ROOT, rel)
        if not os.path.exists(p) or pdone.get(rel) != sel[sig]['best']:
            pdone[rel] = sel[sig]['best']; json.dump(pdone, open(os.path.join(WORK, 'parts_from.json'), 'w'))
            os.makedirs(os.path.dirname(p), exist_ok=True); ff('-i', twav(sig), '-ac', '1', '-ar', '44100', '-b:a', '128k', p)
        return rel
    man = {}
    seen = {}
    for a in plan:
        L, lang, v, look = a['L'], a['lang'], a['v'], a['look']; P = L['parts'][lang]; ps = P['pieces']; tale = L['tale']
        o = next((x for x in plan if x['L'] is L and x['lang'] == lang and x['v'] == 'o'), None)
        items, entry = [], []
        seg = [i for i, p in enumerate(ps) if p['k'] != 'K']
        for (how, val), i in zip(a['seq'], seg):
            p = ps[i]
            if how == 'ref': how, val = o['seq'][seg.index(i)]
            gap = gap_after(p, None) if i != seg[-1] else 0
            if how == 'old': items = None; entry.append({'k': p['k'], 'tpl': p['tpl'], 'gap': 0, 'old': val}); break
            w = twav(val); items.append([w, 0.0, gap, p['k'], sel[val]['best']])
            e = {'k': p['k'], 'tpl': p['tpl'], 'gap': gap}
            if p['k'] == 'S' and P['kind'] == 'split': e['url'] = part_url(tale, lang, val)
            entry.append(e)
        if items is None:
            url = entry[0]['old']
        else:
            S = [rms_db(it[0]) for it in items if it[3] == 'S']
            ref = sum(S) / len(S) if S else None
            for it in items:
                if it[3] == 'N' and ref is not None: it[1] = max(-6, min(6, ref - rms_db(it[0])))
            h = md5('|'.join(f'{it[4]}:{it[1]:.2f}:{it[2]}' for it in items) + lang)   # 고른 원본 파일 이름이 바뀌면(다시 뽑기) 새 완성본
            code = ''.join(f'{s}{look[s]}' for s in sorted(look))
            sub = (f'look/{code}/' if v == 'x' else '') + ('en/' if lang == 'en' else '') + 'name/'
            url = f'audio/el/{tale}/{sub}{h}.mp3'; p = os.path.join(ROOT, url)
            if not os.path.exists(p): join([(it[0], it[1], it[2]) for it in items], p); made.append(p)
        k = (tale, L['n'], lang)
        m = man.setdefault(k, {'pieces': None, 'url': None, 'urlLook': {}})
        if v == 'o': m['pieces'] = entry; m['url'] = url
        else:
            m['urlLook'][''.join(f'{s}{look[s]}' for s in sorted(look))] = url
            for e, eo in zip(entry, m['pieces'] or []):
                if 'url' in e and 'url' in eo and e['url'] != eo['url']: eo.setdefault('urls', {})[look[gslots(e['tpl'])[0]]] = e['url']; eo['urls'][ORIG_LOOK[gslots(e['tpl'])[0]]] = eo['url']
    # 아이들 줄(통째, gen_tale 규칙 이름)
    for kj in K:
        sig = 'k' + md5(kj['url'], 12); p = os.path.join(ROOT, kj['url'])
        if not os.path.exists(p): os.makedirs(os.path.dirname(p), exist_ok=True); ff('-i', raw(sig), '-ac', '1', '-ar', '44100', '-b:a', '128k', p); polish(p, log=False); made.append(p)
    plog(made)
    # 목록(manifest): build_name_lines.py · apply 가 읽는다
    out = {'version': 1, 'tales': {}, 'kids': K}
    for L in LS:
        row = {'n': L['n'], 'id': L['id'], 'mode': L['mode'], 'keyOld': L['key'], 'key': L['keyNew'], 'keyEn': (L['keyEn'] if L['tale'] == 'home' else L['keyNew']),
               'enOld': L['en'], 'en': L['enNew'], 'g': L['g'], 'parts': {}}
        for lang, P in L['parts'].items():
            m = man[(L['tale'], L['n'], lang)]; part = P['part']
            row['parts'][lang] = {'kind': P['kind'], 'seg': part['seg'], 'segs': part['segs'], 'voice': part['voice'], 'model': part['model'], 'settings': part['settings'],
                                  'tag': clean_tag(P['tag'], lang), 'urlOld': part['url'], 'url': m['url'], 'urlLook': m['urlLook'], 'orig': part.get('orig') or {},
                                  'look': part.get('look'), 'pieces': [dict(e, **({'tpl': p['tpl']} if p['k'] == 'K' else {})) for e, p in zip(_with_k(m['pieces'], P['pieces']), P['pieces'])]}
        out['tales'].setdefault(L['tale'], []).append(row)
    json.dump(out, open(MANIFEST, 'w'), ensure_ascii=False, indent=1)
    # 앱 묶음 목록: 고정 조각은 서버 catalog 에만 적혀 있어 tools/app/used_audio.mjs 가 못 찾는다 → 동화 폴더에 주소 목록을 둔다
    for tale, rows in out['tales'].items():
        if tale == 'home': continue
        urls = sorted({u for r in rows for P in r['parts'].values() for p in P['pieces'] for u in ([p.get('url')] + list((p.get('urls') or {}).values())) if u})
        with open(os.path.join(ROOT, 'tales', tale, 'name_parts.json'), 'w') as f:
            json.dump({'note': '이름 바꾸기 고정 조각(다듬기 전) — engine/names.js 가 서버 이름 조각과 합친다. tools/elevenlabs/gen_name_split.py build 가 만듦', 'parts': urls}, f, ensure_ascii=False, indent=0)
    print('만든 완성본', len(made), '→', os.path.relpath(MANIFEST, ROOT))

def verify_cmd():
    """기본 이름 완성본(합친 파일)을 받아써 줄 글과 비교한다(조각 하나만 들을 때 못 잡는 이름·이음매 문제)."""
    man = json.load(open(MANIFEST)); res = {}; bad = []
    for tale, rows in man['tales'].items():
        for r in rows:
            for lang, P in r['parts'].items():
                urls = [('o', P['url'], {})] + [(c, u, {c[0]: c[1]}) for c, u in P['urlLook'].items()]
                for v, u, look in urls:
                    if u == P['urlOld']: continue
                    exp = ' '.join(fill(p['tpl'], P['orig'], look) for p in P['pieces'] if p['k'] != 'K')
                    t = asr(os.path.join(ROOT, u), lang)
                    a, b = norm(exp), norm(asr_fix(t))
                    if lang == 'en' and NAME_RE.search(exp):
                        rest = norm(NAME_RE.sub(' ', exp)); m = difflib.SequenceMatcher(None, rest, b)
                        sc = sum(x.size for x in m.get_matching_blocks()) / max(1, len(rest)); over = len(b) > len(a) + 8
                    else:
                        sc = difflib.SequenceMatcher(None, a, b).ratio(); over = len(b) > len(a) + (4 if lang == 'en' else 3)
                    ok = sc >= (0.8 if lang == 'en' else 0.85) and not over
                    res[u] = {'tale': tale, 'n': r['n'], 'lang': lang, 'v': v, 'exp': exp, 'asr': t, 'score': round(sc, 3), 'over': over, 'ok': ok}
                    print('OK ' if ok else 'BAD', tale, r['n'], lang, v, '|', exp, '=>', t, round(sc, 3), flush=True)
                    if not ok: bad.append(u)
    json.dump(res, open(os.path.join(WORK, 'verify.json'), 'w'), ensure_ascii=False, indent=1)
    print('완성본', len(res), '의심', len(bad))

def _with_k(entry, ps):
    """조립표(이름 줄 조각만)에 K(다른 배역 조각, 문맥만) 자리를 끼워 원래 조각 순서로."""
    it = iter(entry); out = []
    for p in ps: out.append({'k': 'K', 'gap': 0} if p['k'] == 'K' else next(it))
    return out

# ---------- 대본·화면 글자·맵 ----------
def jload(path):
    s = open(path).read()
    return s, [(m.group(1), m.group(2), m.start(2), m.end(2)) for m in re.finditer(r'(Object\.assign\(\w+, |const \w+ = |\{ \w+: )(\{.*?\n\})', s, re.S)]

def apply_cmd():
    man = json.load(open(MANIFEST))
    rep_ko, rep_en = {}, {}   # 동화 → {옛 글: 새 글}
    for tale, rows in man['tales'].items():
        for r in rows:
            if r['keyOld'] != r['key']: rep_ko.setdefault(tale, {})[r['keyOld']] = r['key']
            if r['enOld'] != r['en']: rep_en.setdefault(tale, {})[r['enOld']] = r['en']
    for k in man['kids']: rep_ko.setdefault('kkultteok', {})[k['old']] = k['new']
    for tale in ['kkultteok', 'red_car', 'unicorn', 'witch_candy']:
        td = os.path.join(ROOT, 'tales', tale); rows = man['tales'][tale]
        RK, RE = rep_ko.get(tale, {}), rep_en.get(tale, {})
        segrep = {}   # (lang, 옛 조각 글) → 새 조각 글 (대본 segs)
        for r in rows:
            for lang, P in r['parts'].items():
                pass
        # 1) 대본(json): 줄 text·en·segs 와 이름 줄 표시(name_split)
        for f in ['voice_script_el.json', 'voice_script_en.json', 'read_script_el.json', 'read_script_en.json']:
            p = os.path.join(td, f); d = json.load(open(p)); en = f.endswith('_en.json')
            L = [l for sc in d['scenes'] for l in sc['lines']] if 'scenes' in d else d['lines']
            ch = 0
            for l in L:
                t = l.get('text')
                row = next((r for r in rows if r['keyOld'] == t and _mode_ok(r['mode'], f)), None)
                kid = next((k for k in man['kids'] if k['old'] == t), None) if tale == 'kkultteok' else None
                if row:
                    l['text'] = row['key']; l['name_split'] = True; ch += 1
                    if en and 'en' in l: l['en'] = row['en']
                    for lang in (['en'] if en else ['ko']):
                        P = row['parts'].get(lang)
                        if not P or not l.get('segs'): continue
                        si = P['seg'] or 0
                        if si < len(l['segs']):
                            l['segs'][si][1] = ' '.join(fill(x['tpl']) for x in P['pieces'] if x['k'] != 'K')
                            if not en and len(l['segs'][si]) > 3 and l['segs'][si][3] and 'a pop on 뿅' in l['segs'][si][3]: l['segs'][si][3] = clean_tag(l['segs'][si][3])
                elif kid:
                    l['text'] = kid['new']; ch += 1
                    for s in l.get('segs') or []:
                        if s[1] == kid['segOld']: s[1] = kid['segNew']
            if ch:
                json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1 if _indent(p) == 1 else _indent(p)); open(p, 'a').write('\n') if open(p).read()[-1:] != '\n' else None
                print(tale, f, '줄', ch)
        # 2) 동화 js 화면 글자: 옛 글 → 새 글(문자열 그대로)
        jsf = os.path.join(td, f'{tale}.js'); s = open(jsf).read(); n0 = 0
        for o, nw in sorted(RK.items(), key=lambda x: -len(x[0])):
            for q in ("'", '"', '`'):
                a, b = q + o + q, q + nw + q
                if q == '"': a, b = q + o.replace('"', '\\"') + q, q + nw.replace('"', '\\"') + q
                if a in s: n0 += s.count(a); s = s.replace(a, b)
        open(jsf, 'w').write(s); print(tale, f'{tale}.js 글 바꿈', n0)
        # 3) 녹음 맵: 열쇠·값(이름 줄 = 기본 이름 완성본, 아이들 줄 = 새 클립), 영어 t
        for f, mode, lang in [('narration_el.js', 'play', 'ko'), ('narration_el_en.js', 'play', 'en'), ('read_narration_el.js', 'read', 'ko'), ('read_narration_el_en.js', 'read', 'en')]:
            p = os.path.join(td, f); src = open(p).read()
            m = re.search(r'(Object\.assign\(NARRATION_CLIPS(?:_EN)?, )(\{.*?\n\})(\);)', src, re.S)
            mp = json.loads(m.group(2)); new = {}; ch = 0
            for k, v in mp.items():
                row = next((r for r in rows if r['keyOld'] == k and _mode_ok(r['mode'], f)), None)
                kid = next((x for x in man['kids'] if x['old'] == k), None) if tale == 'kkultteok' else None
                if row:
                    P = row['parts'].get(lang)
                    if P: v = _put(v, P['seg'], P['url'], lang)
                    if lang == 'en': v = dict(v, t=row['en'])
                    new[row['key']] = v; ch += 1
                elif kid and lang == 'ko':
                    new[kid['new']] = _swap(v, kid['url'], ['audio/el/kkultteok/nar_']); ch += 1
                elif kid and lang == 'en':
                    new[kid['new']] = v; ch += 1
                else: new[k] = v
            src = src[:m.start(2)] + json.dumps(new, ensure_ascii=False, indent=1) + src[m.end(2):]
            open(p, 'w').write(src); print(tale, f, '맵', ch)
        # 4) 반대 모습 맵(아이 본인 대사, gen_look.py): 열쇠 바꾸고, 그 안의 이름 줄·아이들 줄 내레이터 조각 주소를 새 것으로
        for f in sorted(os.listdir(td)):
            if not re.match(r'narration_el_look_[A-D][bg]\.js$', f): continue
            p = os.path.join(td, f); src = open(p).read()
            m = re.search(r'(\{ [A-D][bg]: )(\{.*?\n\})( \}\);)', src, re.S); mp = json.loads(m.group(2)); ch = 0
            for lang in ('ko', 'en'):
                nm = {}
                for k, v in (mp.get(lang) or {}).items():
                    row = next((r for r in rows if r['keyOld'] == k), None)
                    kid = next((x for x in man['kids'] if x['old'] == k), None) if tale == 'kkultteok' else None
                    if row:
                        P = row['parts'].get(lang)
                        if P: v = _put(v, P['seg'], P['url'], lang)
                        if lang == 'en': v = dict(v, t=row['en'])
                        nm[row['key']] = v; ch += 1
                    elif kid:
                        nm[kid['new']] = _swap(v, kid['url'], ['audio/el/kkultteok/nar_']) if lang == 'ko' else v; ch += 1
                    else: nm[k] = v
                if lang in mp: mp[lang] = nm
            src = src[:m.start(2)] + json.dumps(mp, ensure_ascii=False, indent=1) + src[m.end(2):]
            open(p, 'w').write(src); print(tale, f, '모습 맵', ch)
        # 5) 영어 대명사 반대 모습 맵(앱 묶음): narration_el_pron_<자리><모습>.js
        codes = {}
        for r in rows:
            P = r['parts'].get('en')
            if not P or not P['urlLook']: continue
            for code, url in P['urlLook'].items():
                codes.setdefault(code, {})[r['key']] = {'t': fill(_en_tpl_full(r), {}, {code[0]: code[1]}), 'seg': P['seg'], 'c': url, 'mode': r['mode']}
        for code, ent in codes.items():
            o = {}
            for f, mode in [('narration_el_en.js', 'play'), ('read_narration_el_en.js', 'read')]:
                mp = json.loads(re.search(r'Object\.assign\(NARRATION_CLIPS_EN, (\{.*?\n\})\);', open(os.path.join(td, f)).read(), re.S).group(1))
                o[mode] = {}
                for k, e in ent.items():
                    if not _mode_ok(e['mode'], f) or k not in mp: continue
                    o[mode][k] = {'t': e['t'], 'c': _put(mp[k], e['seg'], e['c'], 'en')['c'], 'o': mp[k]['c']}   # o = 원래 모습 맵 값(앱이 놀이/읽기 맵을 가린다)
            with open(os.path.join(td, f'narration_el_pron_{code}.js'), 'w') as fo:
                fo.write(f'/* {tale} — 자리 {code[0]} 주인공 모습 {code[1]} 일 때의 영어 대명사 줄(he/she 두 벌 중 반대 벌) 녹음 맵 (tools/elevenlabs/gen_name_split.py 가 생성, 손으로 고치지 말 것).\n'
                         f'   engine/names.js PRON_CLIPS 가 읽는다. play = 놀이 맵, read = 읽어 주기 맵에 덮는다. 이름 든 줄은 기본 이름 완성본(이름을 바꾸면 기기에서 다시 합친다) */\n')
                fo.write(f"window.NARRATION_PRON_CLIPS = Object.assign(window.NARRATION_PRON_CLIPS || {{}}, {{ {code}: " + json.dumps(o, ensure_ascii=False, indent=1) + ' });\n')
            print(tale, f'narration_el_pron_{code}.js', {m: len(v) for m, v in o.items()})

def _en_tpl_full(r):
    P = r['parts']['en']
    return ' '.join(x['tpl'] for x in P['pieces'])
def _indent(p):
    s = open(p).read(200); m = re.search(r'\n( +)"', s); return len(m.group(1)) if m else 1
def _mode_ok(mode, f):
    read = f.startswith('read_')
    return mode in ('both', 'home') or (mode == 'read') == read
def _put(v, seg, url, lang):
    c = v['c'] if isinstance(v, dict) else v
    if seg is None or isinstance(c, str): c2 = url
    else: c2 = [url if i == seg else x for i, x in enumerate(c)]
    return dict(v, c=c2) if isinstance(v, dict) else c2
def _swap(v, url, prefixes):
    c = v['c'] if isinstance(v, dict) else v
    arr = [c] if isinstance(c, str) else list(c)
    arr = [url if any(x.startswith(pf) for pf in prefixes) else x for x in arr]
    c2 = arr[0] if isinstance(c, str) else arr
    return dict(v, c=c2) if isinstance(v, dict) else c2

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'plan'
    os.makedirs(WORK, exist_ok=True)
    {'plan': plan_cmd, 'record': record_cmd, 'build': build_cmd, 'apply': apply_cmd, 'verify': verify_cmd}[cmd]()
