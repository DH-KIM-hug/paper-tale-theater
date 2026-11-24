"""녹음 직후 받아쓰기 검사(2026-11-24): ElevenLabs 가 한 파일 안에 같은 말을 두세 번 되풀이해 녹음하는 일을 잡는다.
  from asrcheck import guarded, enabled, report
  ok = guarded(lambda: tts_once(path), path, sent, lang)   # tts_once 가 path 에 쓴다. 검사에 걸리면 최대 2번 다시 만들고, 그래도 걸리면 path 를 지우고 False
  guarded 는 --no-asr 가 있거나 whisper(mlx_whisper)가 없으면 검사 없이 한 번만 만들고 True.
판정(하나라도 걸리면 의심): ① 받아쓰기 글자 수 >= 기대 글자 수 x 1.6 (그리고 3자 이상 차이)  ② 받아쓰기 안에 기대 문장이 2번 이상
  ③ 앞 절반과 뒤 절반이 거의 같음(difflib 0.8 이상, 6자 이상)  ④ 기대 문장과 너무 다름(유사도 한국어 0.5/영어 0.45, 8자 이하는 0.3 미만, 이름 낱말은 뺌)
  ⑤ 한 낱말 대사는 말 덩어리 수(ffmpeg silencedetect)가 2 이상.
'--no-asr' 로 끈다. 의심으로 남은 파일은 쓰지 않고 SUSPECTS 에 모아 report() 가 끝에 요약한다."""
import difflib, os, re, subprocess, sys

ENABLED = '--no-asr' not in sys.argv
RETRIES = 2
SUSPECTS = []
_W = None; _WARNED = False
ALIAS = [('다연', '다현'), ('이연', '이현'), ('희현', '이현'), ('은유', '은우'), ('꿀덕', '꿀떡'), ('굴떡', '꿀떡')]
NAME_RE = re.compile(r"Ee-hyun|Ihyun|Dahyun|Eunwoo|Kkulddeok|Toki", re.I)

def norm(s): return re.sub(r'[^0-9a-z가-힣]', '', (s or '').lower())
def spoken(sent):  # 보낼 글에서 [태그] 를 뺀 실제 말
    return re.sub(r'\[[^\]]*\]', ' ', sent or '').strip()
def lang_of(text, path=''):
    return 'ko' if re.search('[가-힣]', text or '') and '/en/' not in path else 'en'

def _whisper():
    global _W, _WARNED
    if _W is None:
        try: import mlx_whisper; _W = mlx_whisper
        except Exception as e:
            _W = False
            if not _WARNED: _WARNED = True; print('경고: mlx_whisper 가 없어 받아쓰기 검사를 건너뜁니다', e, flush=True)
    return _W or None

def asr(path, lang):
    w = _whisper()
    if not w: return None
    r = w.transcribe(path, path_or_hf_repo='mlx-community/whisper-large-v3-turbo', language=lang, condition_on_previous_text=False)
    return r['text'].strip()

def chunks(path):  # 말 덩어리 수: 소리 구간 수(0.25초 넘는 쉼으로 나눔)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-i', path, '-af', 'silencedetect=noise=-35dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
    dur = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r); total = int(dur[1]) * 3600 + int(dur[2]) * 60 + float(dur[3]) if dur else 0
    st = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: (-?[\d.]+)', r)]
    segs, t = 0, 0.0
    for i, s in enumerate(st):
        if s - t > 0.12: segs += 1   # 이전 쉼이 끝난 뒤 이 쉼이 시작하기까지 소리가 있었음
        t = en[i] if i < len(en) else total
    if total - t > 0.12: segs += 1
    return segs

def verdict(expected, got, lang, nchunks=None):
    """(ok, [이유]) 받아쓰기 글(got)을 기대 문장(expected)과 견준다."""
    exp_raw = spoken(expected)
    if lang == 'en': exp_raw = NAME_RE.sub(' ', exp_raw)   # 영어 받아쓰기는 한국 이름을 못 적는다
    a = norm(exp_raw); g = got or ''
    for x, y in ALIAS: g = g.replace(x, y)
    b = norm(NAME_RE.sub(' ', g) if lang == 'en' else g)
    why = []
    if not a: return True, why
    if len(b) >= 1.6 * len(a) and len(b) - len(a) >= 3: why.append(f'글자 {len(b)}/{len(a)} 길다')
    if len(a) >= 2 and b.count(a) >= 2: why.append('기대 문장이 받아쓰기에 2번 이상')
    elif 2 <= len(a) <= 5 and lang == 'ko' and re.search(r'(.{2,})\1', b) and not re.search(r'(.{2,})\1', a): why.append('받아쓰기에 같은 말 되풀이')
    if len(b) >= 6:
        h = len(b) // 2
        ha = len(a) // 2   # 기대 문장 자체가 되풀이(Chirp chirp, 뽀글뽀글)면 앞뒤가 같아도 정상
        exp_rep = len(a) >= 4 and difflib.SequenceMatcher(None, a[:ha], a[len(a) - ha:]).ratio() >= 0.8
        if not exp_rep and difflib.SequenceMatcher(None, b[:h], b[len(b) - h:]).ratio() >= 0.8: why.append('앞뒤 절반이 같음')
    sc = difflib.SequenceMatcher(None, a, b).ratio()
    lim = 0.3 if len(a) <= 8 else (0.5 if lang == 'ko' else 0.45)
    if lang == 'ko' and g.strip() and not re.search('[가-힣]', g): sc = 1.0   # 받아쓰기가 다른 글자(일본어 등)로 적은 의성어는 유사도로 판정하지 않음
    if sc < lim and not (lang == 'en' and len(a) <= 3): why.append(f'기대와 다름 {sc:.2f}')
    oneword = (' ' not in exp_raw.strip() and len(a) <= 6) if lang == 'ko' else len(exp_raw.split()) <= 1
    if oneword and nchunks is not None and nchunks >= 2: why.append(f'말 덩어리 {nchunks}개')
    return not why, why

def check(path, sent, lang=None):
    """None = 검사 못 함(whisper 없음). 아니면 (ok, 이유, 받아쓰기)."""
    lang = lang or lang_of(spoken(sent), path)
    t = asr(path, lang)
    if t is None: return None
    exp = spoken(sent)
    oneword = (' ' not in exp and len(norm(exp)) <= 6) if lang == 'ko' else len(exp.split()) <= 1
    ok, why = verdict(exp, t, lang, chunks(path) if oneword else None)
    return ok, why, t

def guarded(write_fn, path, sent, lang=None, tag=''):
    """write_fn() 이 path 에 녹음을 쓴다(다듬기 포함). 걸리면 최대 RETRIES 번 다시. 끝까지 걸리면 파일을 지우고 False."""
    write_fn()
    if not ENABLED: return True
    for n in range(RETRIES + 1):
        r = check(path, sent, lang)
        if r is None: return True
        ok, why, t = r
        if ok: return True
        print(f'  의심 {n + 1}회 {os.path.basename(path)}: {", ".join(why)} | 기대 {spoken(sent)!r} 받아쓰기 {t!r}', flush=True)
        if n < RETRIES: write_fn()
    SUSPECTS.append((path, spoken(sent), t, why)); 
    try: os.remove(path)
    except OSError: pass
    return False

def report():
    if not ENABLED: return
    if not SUSPECTS: print('받아쓰기 검사: 의심 없음'); return
    print(f'받아쓰기 검사: 의심 {len(SUSPECTS)}개 (파일을 쓰지 않음, 다시 실행하면 다시 만든다)')
    for p, e, t, w in SUSPECTS: print(' -', p, '|', e, '|', t, '|', ', '.join(w))

def describe():  # --dry 에서 검사 설명
    print('[받아쓰기 검사] ' + ('켜짐' if ENABLED else '꺼짐(--no-asr)') + f', 의심이면 최대 {RETRIES}번 다시 만듦. 걸리는 것: 받아쓰기 글자 >= 기대 x1.6, 기대 문장 2번 이상, 앞뒤 절반 유사 0.8 이상, 기대와 유사도 낮음(ko 0.5, en 0.45, 8자 이하 0.3), 한 낱말 대사는 말 덩어리 2개 이상. 끝까지 걸리면 파일을 쓰지 않고 요약에 남김.')
