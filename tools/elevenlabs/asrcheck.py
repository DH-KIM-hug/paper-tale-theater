"""녹음 직후 받아쓰기 검사(2026-11-24): ElevenLabs 가 한 파일 안에 같은 말을 두세 번 되풀이해 녹음하는 일을 잡는다.
  from asrcheck import guarded, enabled, report
  ok = guarded(lambda: tts_once(path), path, sent, lang)   # tts_once 가 path 에 쓴다. 검사에 걸리면 최대 2번 다시 만들고, 그래도 걸리면 path 를 지우고 False
  guarded 는 --no-asr 가 있거나 whisper(mlx_whisper)가 없으면 검사 없이 한 번만 만들고 True.
판정(하나라도 걸리면 의심): ① 받아쓰기 글자 수 >= 기대 글자 수 x 1.6 (그리고 3자 이상 차이)  ② 받아쓰기 안에 기대 문장이 2번 이상
  ③ 앞 절반과 뒤 절반이 거의 같음(difflib 0.8 이상, 6자 이상)  ④ 기대 문장과 너무 다름(유사도 한국어 0.5/영어 0.45, 8자 이하는 0.3 미만, 이름 낱말은 뺌)
  ⑤ 한 낱말 대사는 말 덩어리 수(ffmpeg silencedetect)가 2 이상.  ⑥ 받아쓰기 안에서 같은 구(2낱말 이상 또는 한 낱말 3글자 이상)가 연달아 두 번, 기대 문장에는 그런 되풀이가 없을 때.
  ⑦ 영어 녹음(/en/ 경로)은 소리 구간마다(silencedetect -35dB, 0.15초) 언어를 판별해, 한국어(또는 일본어나 중국어이면서 자동 받아쓰기에 로마자 없음)로 판별되고 language='ko' 받아쓰기에 한글이 나온 구간이 있으면 의심(2026-11-25).
     0.25초보다 짧은 구간, ko 확률이 0.1 미만이거나 en 확률의 2배 미만인 구간, 영어로 받아쓴 낱말이 모두 기대 문장에 있는 구간은 보지 않고, 한국 이름(KO_NAME_EN)이 든 줄은 걸지 않고 알리기만 한다.
     파일 전체 판별은 영어 문장이 길면 앞의 짧은 한국어 낱말('그때', '유니콘은')을 놓치고, language='en' 받아쓰기는 한국어를 영어로 옮겨 숨긴다.
보낼 글 막기: en_sent(sent) 는 영어 보낼 글의 [연기 지시] 속 한국어 낱말 지시를 뺀 글, guard_en_sent(path, sent) 는 영어 녹음 보낼 글에 한글이 남으면 녹음 전에 멈춘다.
  (2026-11-25 원인: 영어 녹음에 한국어 대본의 연기 지시 'a pause after 유니콘은' 같은 글을 그대로 보내 ElevenLabs 가 그 한국어 낱말을 읽었다.)
'--no-asr' 로 끈다. 의심으로 남은 파일은 쓰지 않고 SUSPECTS 에 모아 report() 가 끝에 요약한다."""
import difflib, os, re, subprocess, sys

ENABLED = '--no-asr' not in sys.argv
RETRIES = 2
SUSPECTS = []
_W = None; _WARNED = False
ALIAS = [('다연', '다현'), ('이연', '이현'), ('희현', '이현'), ('은유', '은우'), ('꿀덕', '꿀떡'), ('굴떡', '꿀떡')]
NAME_RE = re.compile(r"Ee-hyun|Ihyun|Dahyun|Eunwoo|Kkulddeok|Toki", re.I)
KO_NAME_EN = re.compile(r"Ee-hyun|Ihyun|Dahyun|Eunwoo|Kkulddeok|Kongjwi|Patjwi|Heungbu|Nolbu|Byeoljubu|Toki", re.I)   # 영어 글 속 한국 이름(⑦ 구간 검사 예외)

HANGUL = re.compile('[가-힣ㄱ-ㅎㅏ-ㅣ]')

def en_sent(sent):
    """영어 보낼 글의 [태그] 안에서 한글이 든 지시(쉼표로 나뉜 한 덩어리)를 통째로 뺀다. 지시가 다 빠지면 태그도 뺀다. 태그 밖 글은 그대로."""
    def rep(m):
        keep = [x.strip() for x in m.group(1).split(',') if x.strip() and not HANGUL.search(x)]
        return '[' + ', '.join(keep) + ']' if keep else ''
    return re.sub(r'\s{2,}', ' ', re.sub(r'\[([^\]]*)\]', rep, sent or '')).strip()

def guard_en_sent(path, sent, lang=None):
    """영어 녹음(/en/ 경로 또는 lang='en')의 보낼 글에 한글이 남았으면 녹음 전에 멈춘다(크레딧을 쓰기 전에)."""
    if (lang == 'en' or '/en/' in (path or '')) and HANGUL.search(sent or ''):
        raise ValueError(f'영어 녹음 보낼 글에 한글이 남음(녹음 안 함): {path} | {sent}')

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
    M = 'mlx-community/whisper-large-v3-turbo'
    if lang == 'en' and '/en/' in path:   # 영어 녹음은 언어를 정하지 않고 먼저 받아써서 한국어가 섞였는지 본다(2026-11-25)
        r = w.transcribe(path, path_or_hf_repo=M, condition_on_previous_text=False)
        t = r['text'].strip()
        if re.search('[가-힣]', t): return t
        if r.get('language') == 'en': return t
    r = w.transcribe(path, path_or_hf_repo=M, language=lang, condition_on_previous_text=False)
    return r['text'].strip()

def speech_spans(path, noise='-35dB', d=0.15):
    """소리 구간 [(시작, 끝)] (silencedetect), 전체 길이"""
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-i', path, '-af', f'silencedetect=n={noise}:d={d}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r); total = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3]) if m else 0
    st = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: (-?[\d.]+)', r)]
    out, t = [], 0.0
    for i, s in enumerate(st):
        if s - t > 0.08: out.append((max(0.0, t), s))
        t = en[i] if i < len(en) else total
    if total - t > 0.08: out.append((t, total))
    return out, total

def ko_segments(path, expect=None):
    """영어 녹음 속 한국어 구간 [(시작, 끝, 받아쓰기)]. 구간마다 언어 판별(인코더 한 번에 묶어서) → 한국어로 판별된 구간만 language='ko' 로 받아쓴다.
    whisper 가 없으면 None."""
    w = _whisper()
    if not w: return None
    import numpy as np, mlx.core as mx
    from mlx_whisper.audio import load_audio, log_mel_spectrogram, pad_or_trim, N_FRAMES, N_SAMPLES
    from mlx_whisper.transcribe import ModelHolder
    M = 'mlx-community/whisper-large-v3-turbo'
    model = ModelHolder.get_model(M, mx.float16)
    spans, total = speech_spans(path); a = load_audio(path); xs, keep = [], []
    pad = np.zeros(1600, dtype=np.float32)
    for s, e in spans:
        x = a[int(max(0, s - 0.05) * 16000):int(min(total, e + 0.05) * 16000)]
        if len(x) < 0.12 * 16000: continue
        xs.append(np.concatenate([pad, x, pad])); keep.append((s, e))
    if not xs: return []
    mels = mx.stack([pad_or_trim(log_mel_spectrogram(x, n_mels=model.dims.n_mels, padding=N_SAMPLES), N_FRAMES, axis=-2).astype(mx.float16) for x in xs])
    _, probs = model.detect_language(mels)
    hits = []
    for (s, e), x, pr in zip(keep, xs, probs):
        lg = max(pr, key=pr.get)
        if lg not in ('ko', 'ja', 'zh') or e - s < 0.25: continue   # 0.25초보다 짧은 구간(Peck! → 팩!, big → 빅)은 영어 낱말 끝소리를 한국어로 잘못 듣는 일이 많다
        pko, pen = pr.get('ko', 0), pr.get('en', 0)
        if pko < 0.1 or pko < 2 * pen: continue   # 2026-11-25 전수 검사: 진짜 한국어 구간은 ko 확률이 0.1 넘고 en 의 2배 넘음(아이 목소리 '맛있다' 0.12~0.4), Puff, La la 같은 영어 소리는 대개 그보다 낮음
        k = w.transcribe(x, path_or_hf_repo=M, language='ko', condition_on_previous_text=False)['text'].strip()
        if not HANGUL.search(k): continue
        if lg != 'ko':   # 아이 목소리 한국어('맛있다')는 일본어로 판별되기도 한다 → 언어를 정하지 않은 받아쓰기에 로마자가 없으면 한국어로 본다
            t = w.transcribe(x, path_or_hf_repo=M, condition_on_previous_text=False)['text'].strip()
            if re.search('[A-Za-z]', t): continue
        if expect and pr.get('ko', 0) < 0.9:   # 영어 의성어, 감탄사(Huh?, Pit-pat, Puff, Tap tap)를 한국어로 듣는 일: 영어로 받아쓴 낱말이 기대 문장에 있으면 넘긴다
            en_t = w.transcribe(x, path_or_hf_repo=M, language='en', condition_on_previous_text=False)['text']
            ew = {norm(x) for x in re.split(r'[\s,.!?~…-]+', en_t) if norm(x)}
            xw = {norm(x) for x in re.split(r'[\s,.!?~…-]+', expect) if norm(x)}
            if ew and all(any(a == b or difflib.SequenceMatcher(None, a, b).ratio() >= 0.75 for b in xw) for a in ew): continue   # 영어로 받아쓴 낱말이 모두 기대 문장에 있으면
        hits.append((round(s, 2), round(e, 2), k))
    return hits

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

def phrase_repeat(a, got):
    """받아쓰기 낱말들에서 같은 구가 연달아 두 번 나오면(2낱말 이상, 또는 한 낱말 3글자 이상) 그 구를 돌려준다.
    기대 문장(a, norm 한 글)에도 그 구가 연달아 두 번 있으면(Vroom vroom, 뽀글뽀글) 정상이라 건너뛴다."""
    w = [x for x in (norm(t) for t in re.split(r'\s+', got or '')) if x]
    for k in range(1, len(w) // 2 + 1):
        for i in range(len(w) - 2 * k + 1):
            if w[i:i + k] == w[i + k:i + 2 * k] and (k >= 2 or len(w[i]) >= 3) and (''.join(w[i:i + k]) * 2) not in a:
                return ' '.join(w[i:i + k])
    return None

def verdict(expected, got, lang, nchunks=None):
    """(ok, [이유]) 받아쓰기 글(got)을 기대 문장(expected)과 견준다."""
    exp_raw = spoken(expected)
    if lang == 'en': exp_raw = NAME_RE.sub(' ', exp_raw)   # 영어 받아쓰기는 한국 이름을 못 적는다
    a = norm(exp_raw); g = got or ''
    for x, y in ALIAS: g = g.replace(x, y)
    b = norm(NAME_RE.sub(' ', g) if lang == 'en' else g)
    why = []
    if lang == 'en' and re.search('[가-힣]', g): why.append('영어 녹음 받아쓰기에 한글(한국어 섞임)')
    if not a: return not why, why
    if len(b) >= 1.6 * len(a) and len(b) - len(a) >= 3: why.append(f'글자 {len(b)}/{len(a)} 길다')
    if len(a) >= 2 and b.count(a) >= 2: why.append('기대 문장이 받아쓰기에 2번 이상')
    elif 2 <= len(a) <= 5 and lang == 'ko' and re.search(r'(.{2,})\1', b) and not re.search(r'(.{2,})\1', a): why.append('받아쓰기에 같은 말 되풀이')
    rp = phrase_repeat(a, g)
    if rp: why.append(f'같은 구 되풀이 {rp!r}')
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
    if lang == 'en' and '/en/' in path:   # ⑦ 구간 단위 한국어 검사
        ks = ko_segments(path, exp) or []
        if ks and KO_NAME_EN.search(exp):   # 한국 이름(Kongjwi, Heungbu, Kkulddeok)은 한국식으로 읽어 한국어 구간으로 잡힌다 → 걸지 않고 알리기만
            print(f'  참고 {os.path.basename(path)}: 이름 든 줄의 한국어 구간 ' + ', '.join(f'{s}-{e}초 {k!r}' for s, e, k in ks), flush=True)
        elif ks: ok = False; why.append('한국어 구간 ' + ', '.join(f'{s}-{e}초 {k!r}' for s, e, k in ks))
    return ok, why, t

def guarded(write_fn, path, sent, lang=None, tag=''):
    """write_fn() 이 path 에 녹음을 쓴다(다듬기 포함). 걸리면 최대 RETRIES 번 다시. 끝까지 걸리면 파일을 지우고 False.
    영어 녹음 보낼 글에 한글이 있으면 녹음하기 전에 ValueError(guard_en_sent)."""
    guard_en_sent(path, sent, lang)
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
    print('[받아쓰기 검사] ' + ('켜짐' if ENABLED else '꺼짐(--no-asr)') + f', 의심이면 최대 {RETRIES}번 다시 만듦. 걸리는 것: 받아쓰기 글자 >= 기대 x1.6, 기대 문장 2번 이상, 앞뒤 절반 유사 0.8 이상, 기대와 유사도 낮음(ko 0.5, en 0.45, 8자 이하 0.3), 한 낱말 대사는 말 덩어리 2개 이상, 영어 녹음은 구간마다 한국어 판별(한국어 구간이 있으면 의심). 영어 보낼 글에 한글이 있으면 녹음 전에 멈춤. 끝까지 걸리면 파일을 쓰지 않고 요약에 남김.')
