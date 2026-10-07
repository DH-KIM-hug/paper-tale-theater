"""동화 한 편의 내레이션을 Typecast(ssfm-v30)로 배역별 생성한다.
  python3 tools/typecast/gen_tale.py <tale>          # tales/<tale>/voice_script.json → audio/tc/<tale>/*.mp3 + tales/<tale>/narration.js
  python3 tools/typecast/gen_tale.py <tale> --lang en  # tales/<tale>/voice_script_en.json → audio/tc/<tale>/en/*.mp3 + tales/<tale>/narration_en.js (같은 목소리, 영어, 속도 0.8)
  옵션: --redo (전부 다시), --dry (글자 수만 셈)
voice_script.json 형식:
{
  "voices": {"nar": "tc_600697fd8a8ea9b977284703", "mom": "tc_…"},   # 배역 이름은 영어 소문자만 (클립 경로에서 배역을 읽음)
  "lines": [                                                           # T.say()에 넘기는 문장 그대로 (말풍선 글자와 정확히 같아야 함)
    {"text": "엄마 개구리가 말했어요. \"얘들아!\"", "segs": [["nar", "엄마 개구리가 말했어요."], ["mom", "얘들아!", "happy"]]},
    {"text": "그냥 내레이션만 있는 문장"}                                 # segs 생략 = 전부 내레이터
  ],
  "extra": {"cut_ox": [["ox", "음메에!", "angry"]]}                   # 말풍선 없는 소리 대사 → VOICE_LINES
}
감정: smart(기본, 앞뒤 문맥으로) | normal happy sad angry whisper toneup tonedown, 세기는 'sad:1.5'처럼 (기본 1.2)
목소리 일관성: 같은 배역은 같은 voice_id 를 쓰고, 감정 프리셋·세기가 바뀌면 같은 voice_id 도 음색이 달라져 들리므로
  배역마다 쓰는 감정을 몇 가지로 정해 두고 줄마다 바꾸지 않는다. (segs 의 세 번째 칸이 그 줄의 감정)
voice_script_en.json 형식: voice_script.json 과 같되, 줄마다 한국어 "text"(조회 키)에 영어 "en"과 영어 "segs"를 붙인다.
  "ui": {"한국어": "English"} 는 화면 글자(장면 이름·소리 글자·끝 인사)로 TEXT_EN 이 된다.
API 키는 ~/.config/typecast/key (저장소에 두지 않음)."""
import json, os, sys, time, hashlib, urllib.request, urllib.error
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KEY = open(os.path.expanduser('~/.config/typecast/key')).read().strip()
UA = 'typecast-direct/1 urllib typecast-integration/1 (source=api-docs; generated_by=claude-code)'

def tts(path, voice, text, emo, prev, nxt, pitch=0, lang='kor', tempo=None):
    # 감정: 'smart' (앞뒤 문맥으로) | 'happy' | 'sad:1.5' 처럼 프리셋[:세기] (세기 기본 1.2, 0.5~2.0)
    if emo in (None, 'smart'):
        p = {'emotion_type': 'smart'}
        if prev: p['previous_text'] = prev
        if nxt: p['next_text'] = nxt
    else:
        name, _, inten = emo.partition(':')
        p = {'emotion_type': 'preset', 'emotion_preset': name, 'emotion_intensity': float(inten or 1.2)}
    body = {'voice_id': voice, 'text': text, 'model': 'ssfm-v30', 'language': lang, 'prompt': p,
            'output': {'audio_format': 'mp3', 'target_lufs': -16.0, 'remove_silence_ms': 120}}
    if pitch: body['output']['audio_pitch'] = pitch
    if tempo: body['output']['audio_tempo'] = tempo
    for attempt in range(6):
        r = urllib.request.Request('https://api.typecast.ai/v1/text-to-speech', json.dumps(body).encode(),
                                   {'X-API-KEY': KEY, 'Content-Type': 'application/json', 'User-Agent': UA})
        try:
            data = urllib.request.urlopen(r, timeout=90).read()
            open(path, 'wb').write(data); return
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and attempt < 5: time.sleep(3 * (attempt + 1)); continue
            raise

def main():
    tale = sys.argv[1]; redo = '--redo' in sys.argv; dry = '--dry' in sys.argv
    en = '--lang' in sys.argv and sys.argv[sys.argv.index('--lang') + 1] == 'en'
    spec = json.load(open(os.path.join(ROOT, 'tales', tale, 'voice_script_en.json' if en else 'voice_script.json')))
    V = spec['voices']
    PITCH = spec.get('pitch') or {}
    for r in V:
        assert r.isalpha() and r.islower(), f'배역 이름은 영어 소문자만: {r}'
    sub = 'en/' if en else ''
    outdir = os.path.join(ROOT, 'audio', 'tc', tale, *(['en'] if en else [])); os.makedirs(outdir, exist_ok=True)
    chars, made, errs = 0, 0, 0
    def clip(role, text, emo, prev, nxt):
        nonlocal chars, made, errs
        assert role in V, f'목소리 없는 배역: {role}'
        pt = PITCH.get(role, 0)
        h = hashlib.md5((f'{V[role]}|{emo}|{text}' + ('|en' if en else '') + (f'|p{pt}' if pt else '')).encode()).hexdigest()[:10]
        rel = f'audio/tc/{tale}/{sub}{role}_{h}.mp3'
        path = os.path.join(ROOT, rel)
        if redo or not os.path.exists(path):
            chars += len(text)
            if not dry:
                try: tts(path, V[role], text, emo, prev, nxt, pt, 'eng' if en else 'kor', 0.8 if en else None); made += 1; print('ok', role, emo or 'smart', text, flush=True)
                except urllib.error.HTTPError as e:
                    errs += 1; print('ERR', e.code, e.read()[:200], role, text, flush=True); return None
        return rel
    clips, seen = {}, set()
    last_text = None
    for ln in spec['lines']:
        text = ln['text']
        if text in seen: continue
        seen.add(text)
        shown = ln['en'] if en else text  # 말하는 글자 (영어면 영어 문장)
        if not ln.get('prev') and last_text: ln = {**ln, 'prev': last_text}  # 앞 문장을 문맥으로 (smart 감정이 이야기 흐름을 알게)
        last_text = shown
        segs = [s + [None] * (3 - len(s)) for s in ln.get('segs') or [['nar', shown]]]
        urls = []
        for i, (role, s, emo) in enumerate(segs):
            prev = segs[i - 1][1] if i else ln.get('prev')
            nxt = segs[i + 1][1] if i + 1 < len(segs) else None
            u = clip(role, s, emo, prev, nxt)
            if u: urls.append(u)
        if urls:
            u = urls[0] if len(urls) == 1 else urls
            clips[text] = {'t': shown, 'c': u} if en else u
    voice = {}
    for key, segs in (spec.get('extra') or {}).items():
        urls = []
        for s in segs:
            role, text, emo = (s + [None, None])[:3]
            u = clip(role, text, emo, s[3] if len(s) > 3 else None, None)
            if u: urls.append(u)
        if urls: voice[key] = urls[0] if len(urls) == 1 else urls
    if dry:
        print('새로 만들 글자 수:', chars); return
    sfx = '_EN' if en else ''
    with open(os.path.join(ROOT, 'tales', tale, 'narration_en.js' if en else 'narration.js'), 'w') as f:
        f.write(f'/* {tale} — Typecast 배역 내레이션{" (영어)" if en else ""} (tools/typecast/gen_tale.py가 {"voice_script_en.json" if en else "voice_script.json"}에서 생성, 손으로 고치지 말 것) */\n')
        f.write(f'const NARRATION_CLIPS{sfx} = ' + json.dumps(clips, ensure_ascii=False, indent=1) + ';\n')
        f.write(f'const VOICE_LINES{sfx} = ' + json.dumps(voice, ensure_ascii=False, indent=1) + ';\n')
        if en: f.write('const TEXT_EN = ' + json.dumps(spec.get('ui') or {}, ensure_ascii=False, indent=1) + ';\n')
    # 더는 쓰지 않는 클립 정리 (한국어 폴더의 en/ 하위 폴더는 건드리지 않는다)
    def urls_of(v):
        v = v['c'] if isinstance(v, dict) else v
        return [v] if isinstance(v, str) else v
    used = {u for v in list(clips.values()) + list(voice.values()) for u in urls_of(v)}
    for fn in os.listdir(outdir):
        fp = os.path.join(outdir, fn)
        if os.path.isfile(fp) and f'audio/tc/{tale}/{sub}{fn}' not in used: os.remove(fp)
    print(f'{tale}: 새로 {made}개, {chars}자, 오류 {errs}, 문장 {len(clips)}, 소리 대사 {len(voice)}')

main()
