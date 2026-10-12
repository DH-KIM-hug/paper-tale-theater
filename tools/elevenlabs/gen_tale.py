"""동화 한 편의 내레이션을 ElevenLabs로 배역별 생성한다 (tools/typecast/gen_tale.py 와 같은 사용법·출력 모양).
  python3 tools/elevenlabs/gen_tale.py <tale>              # tales/<tale>/voice_script_el.json → audio/el/<tale>/*.mp3 + tales/<tale>/narration_el.js
  python3 tools/elevenlabs/gen_tale.py <tale> --lang en    # tales/<tale>/voice_script_en.json 의 영어 줄 + voice_script_el.json 의 목소리
                                                           #   → audio/el/<tale>/en/*.mp3 + tales/<tale>/narration_el_en.js
  옵션: --model eleven_v4 (기본 eleven_v3, 환경변수 EL_MODEL 도 가능; 클립 이름에 모델이 섞여 모델을 바꾸면 새로 만든다), --redo (전부 다시), --dry (글자 수만 셈), --max-chars N (이번 실행에서 새로 만들 글자 수 상한; 넘는 줄은 건너뜀)
voice_script_el.json 은 voice_script.json 과 같은 모양이고 voices 의 값이 ElevenLabs voice_id.
출력 js 는 이미 불러온 Typecast 쪽 상수에 Object.assign 으로 덮어쓴다 (const 라서 다시 선언할 수 없다).
  만들지 못한 줄은 덮어쓰지 않으므로 Typecast 클립이 그대로 쓰인다.
감정: eleven_v3 면 happy→[cheerful] sad→[sad] angry→[angry] whisper→[whispers] toneup→[excited] tonedown→[calm] 태그를 보낼 글 앞에 붙인다.
API 키는 ~/.config/elevenlabs/key (저장소에 두지 않음)."""
import json, os, re, sys, time, hashlib, urllib.request, urllib.error
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KEY = open(os.path.expanduser('~/.config/elevenlabs/key')).read().strip()
MODEL = 'eleven_v3'
TAG = {'happy': '[cheerful] ', 'sad': '[sad] ', 'angry': '[angry] ', 'whisper': '[whispers] ', 'toneup': '[excited] ', 'tonedown': '[calm] '}
SETTINGS = {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.3}

def tagged(text, emo, model=None):
    model = model or MODEL
    if not model.startswith('eleven_v') or model == 'eleven_multilingual_v2' or not emo: return text
    return TAG.get(emo.partition(':')[0], '') + text

def tts(path, voice, text, model=None, settings=None):
    body = {'text': text, 'model_id': model or MODEL, 'voice_settings': {**SETTINGS, **(settings or {})}}
    for attempt in range(6):
        r = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', json.dumps(body).encode(),
                                   {'xi-api-key': KEY, 'Content-Type': 'application/json'})
        try:
            open(path, 'wb').write(urllib.request.urlopen(r, timeout=120).read()); return
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and attempt < 5: time.sleep(3 * (attempt + 1)); continue
            raise

def main():
    global MODEL
    MODEL = sys.argv[sys.argv.index('--model') + 1] if '--model' in sys.argv else os.environ.get('EL_MODEL', MODEL)
    tale = sys.argv[1]; redo = '--redo' in sys.argv; dry = '--dry' in sys.argv
    en = '--lang' in sys.argv and sys.argv[sys.argv.index('--lang') + 1] == 'en'
    cap = int(sys.argv[sys.argv.index('--max-chars') + 1]) if '--max-chars' in sys.argv else 10**9
    td = os.path.join(ROOT, 'tales', tale)
    spec = json.load(open(os.path.join(td, 'voice_script_en.json' if en else 'voice_script_el.json')))
    EL = json.load(open(os.path.join(td, 'voice_script_el.json')))
    V = EL['voices']; MODELS = EL.get('models') or {}; SET = EL.get('settings') or {}; USE_DIR = EL.get('use_dir')  # None 이면 모든 배역
    ONLY = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None  # 시범: 줄 번호(L1.1, Xcut_bam.0)만 만든다
    for r in V: assert r.isalpha() and r.islower(), f'배역 이름은 영어 소문자만: {r}'
    sub = 'en/' if en else ''
    outdir = os.path.join(ROOT, 'audio', 'el', tale, *(['en'] if en else [])); os.makedirs(outdir, exist_ok=True)
    chars, made, errs, skipped = 0, 0, 0, 0
    def clip(role, text, emo, dr=None, sid=None):
        nonlocal chars, made, errs
        M = MODELS.get(role, MODEL)  # 배역별 모델 (voice_script_el.json 의 "models")
        if USE_DIR is not None and role not in USE_DIR: dr = None
        ST = SET.get(role)  # 배역별 voice_settings (예: 호랑이·할멈은 stability 를 낮춰 표정을 크게)
        sent = dr[1:] if dr and dr.startswith('=') else (dr + ' ' + text) if dr else tagged(text, emo, M)  # '=' 로 시작하는 dir 은 중간 태그까지 담은 보낼 글 전체. dir(연기 지시 태그)이 있으면 감정 프리셋 태그 대신 쓴다
        if ONLY and sid not in ONLY: return None
        h = hashlib.md5((f'{V[role]}|{M}|{sent}' + (f'|{json.dumps(ST, sort_keys=True)}' if ST else '')).encode()).hexdigest()[:10]
        rel = f'audio/el/{tale}/{sub}{role}_{h}.mp3'
        path = os.path.join(ROOT, rel)
        if redo or not os.path.exists(path):
            if chars + len(sent) > cap: return None
            chars += len(sent)
            if not dry:
                try: tts(path, V[role], sent, M, ST); made += 1; print('ok', role, sent, flush=True)
                except urllib.error.HTTPError as e:
                    errs += 1; chars -= len(sent); print('ERR', e.code, e.read()[:200], role, text, flush=True); return None
        return rel
    def lead(dr):  # '=' 전체 글 방향에서 맨 앞 태그만 (영어는 한국어 글을 못 쓰니)
        if not dr: return None
        if not dr.startswith('='): return dr
        m = re.match(r'=\s*((?:\[[^\]]*\]\s*)+)', dr)
        return m.group(1).strip() if m else None
    def en_dir(elsegs, role, si):  # 영어 줄의 연기 지시: 한국어 줄 같은 번호(같은 배역) → 없으면 그 줄의 같은 배역 첫 번째
        if not elsegs: return None
        if si < len(elsegs) and elsegs[si][0] == role: c = elsegs[si]
        else: c = next((x for x in elsegs if x[0] == role), None)
        return lead(c[3]) if c and len(c) > 3 else None
    ELL = {l['text']: l['segs'] for l in EL['lines'] if l.get('segs')}
    clips, seen = {}, set()
    for ni, ln in enumerate(spec['lines']):
        text = ln['text']
        if text in seen: continue
        seen.add(text)
        shown = ln['en'] if en else text
        segs = [s + [None] * (4 - len(s)) for s in ln.get('segs') or [['nar', shown]]]
        if en: segs = [[role, s, emo, en_dir(ELL.get(text), role, si)] for si, (role, s, emo, dr) in enumerate(segs)]
        urls = [clip(role, s, emo, dr, f'L{ni}.{si}') for si, (role, s, emo, dr) in enumerate(segs)]
        if not all(urls): skipped += 1; continue  # 일부만 만들어진 줄은 통째로 Typecast 에 맡김
        u = urls[0] if len(urls) == 1 else urls
        clips[text] = {'t': shown, 'c': u} if en else u
    voice = {}
    for key, segs in (spec.get('extra') or {}).items():
        eld = (EL.get('extra') or {}).get(key)
        urls = [clip(s[0], s[1], s[2] if len(s) > 2 else None, en_dir(eld, s[0], si) if en else (s[3] if len(s) > 3 else None), f'X{key}.{si}') for si, s in enumerate(segs)]
        if not all(urls): skipped += 1; continue
        voice[key] = urls[0] if len(urls) == 1 else urls
    if ONLY: print('시범', made, '개,', chars, '자'); return
    if dry:
        print('새로 만들 글자 수:', chars, '/ 건너뛸 줄:', skipped); return
    sfx = '_EN' if en else ''
    with open(os.path.join(td, 'narration_el_en.js' if en else 'narration_el.js'), 'w') as f:
        f.write(f'/* {tale} — ElevenLabs 배역 내레이션{" (영어)" if en else ""} (tools/elevenlabs/gen_tale.py 가 생성, 손으로 고치지 말 것). Typecast 쪽 상수에 덮어쓴다; 여기 없는 줄은 Typecast 클립 */\n')
        f.write(f'Object.assign(NARRATION_CLIPS{sfx}, ' + json.dumps(clips, ensure_ascii=False, indent=1) + ');\n')
        f.write(f'Object.assign(VOICE_LINES{sfx}, ' + json.dumps(voice, ensure_ascii=False, indent=1) + ');\n')
    def urls_of(v):
        v = v['c'] if isinstance(v, dict) else v
        return [v] if isinstance(v, str) else v
    used = {u for v in list(clips.values()) + list(voice.values()) for u in urls_of(v)}
    for fn in os.listdir(outdir):
        fp = os.path.join(outdir, fn)
        if fn.partition('_')[0] in MODELS: continue  # 모델을 따로 쓰는 배역은 비교용으로 옛 클립을 남긴다
        if os.path.isfile(fp) and f'audio/el/{tale}/{sub}{fn}' not in used: os.remove(fp)
    print(f'{tale}: 새로 {made}개, {chars}자, 오류 {errs}, 문장 {len(clips)}, 소리 대사 {len(voice)}, 건너뜀 {skipped}')

main()
