"""동화 한 편의 내레이션을 Typecast(ssfm-v30)로 배역별 생성한다.
  python3 tools/typecast/gen_tale.py <tale>          # tales/<tale>/voice_script.json → audio/tc/<tale>/*.mp3 + tales/<tale>/narration.js
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
API 키는 ~/.config/typecast/key (저장소에 두지 않음)."""
import json, os, sys, time, hashlib, urllib.request, urllib.error
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KEY = open(os.path.expanduser('~/.config/typecast/key')).read().strip()
UA = 'typecast-direct/1 urllib typecast-integration/1 (source=api-docs; generated_by=claude-code)'

def tts(path, voice, text, emo, prev, nxt):
    # 감정: 'smart' (앞뒤 문맥으로) | 'happy' | 'sad:1.5' 처럼 프리셋[:세기] (세기 기본 1.2, 0.5~2.0)
    if emo in (None, 'smart'):
        p = {'emotion_type': 'smart'}
        if prev: p['previous_text'] = prev
        if nxt: p['next_text'] = nxt
    else:
        name, _, inten = emo.partition(':')
        p = {'emotion_type': 'preset', 'emotion_preset': name, 'emotion_intensity': float(inten or 1.2)}
    body = {'voice_id': voice, 'text': text, 'model': 'ssfm-v30', 'language': 'kor', 'prompt': p,
            'output': {'audio_format': 'mp3', 'target_lufs': -16.0, 'remove_silence_ms': 120}}
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
    spec = json.load(open(os.path.join(ROOT, 'tales', tale, 'voice_script.json')))
    V = spec['voices']
    for r in V:
        assert r.isalpha() and r.islower(), f'배역 이름은 영어 소문자만: {r}'
    outdir = os.path.join(ROOT, 'audio', 'tc', tale); os.makedirs(outdir, exist_ok=True)
    chars, made, errs = 0, 0, 0
    def clip(role, text, emo, prev, nxt):
        nonlocal chars, made, errs
        assert role in V, f'목소리 없는 배역: {role}'
        h = hashlib.md5(f'{V[role]}|{emo}|{text}'.encode()).hexdigest()[:10]
        rel = f'audio/tc/{tale}/{role}_{h}.mp3'
        path = os.path.join(ROOT, rel)
        if redo or not os.path.exists(path):
            chars += len(text)
            if not dry:
                try: tts(path, V[role], text, emo, prev, nxt); made += 1; print('ok', role, emo or 'smart', text, flush=True)
                except urllib.error.HTTPError as e:
                    errs += 1; print('ERR', e.code, e.read()[:200], role, text, flush=True); return None
        return rel
    clips, seen = {}, set()
    last_text = None
    for ln in spec['lines']:
        text = ln['text']
        if text in seen: continue
        seen.add(text)
        if not ln.get('prev') and last_text: ln = {**ln, 'prev': last_text}  # 앞 문장을 문맥으로 (smart 감정이 이야기 흐름을 알게)
        last_text = text
        segs = [s + [None] * (3 - len(s)) for s in ln.get('segs') or [['nar', text]]]
        urls = []
        for i, (role, s, emo) in enumerate(segs):
            prev = segs[i - 1][1] if i else ln.get('prev')
            nxt = segs[i + 1][1] if i + 1 < len(segs) else None
            u = clip(role, s, emo, prev, nxt)
            if u: urls.append(u)
        if urls: clips[text] = urls[0] if len(urls) == 1 else urls
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
    with open(os.path.join(ROOT, 'tales', tale, 'narration.js'), 'w') as f:
        f.write(f'/* {tale} — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */\n')
        f.write('const NARRATION_CLIPS = ' + json.dumps(clips, ensure_ascii=False, indent=1) + ';\n')
        f.write('const VOICE_LINES = ' + json.dumps(voice, ensure_ascii=False, indent=1) + ';\n')
    # 더는 쓰지 않는 클립 정리
    used = {u for v in list(clips.values()) + list(voice.values()) for u in ([v] if isinstance(v, str) else v)}
    for fn in os.listdir(outdir):
        if f'audio/tc/{tale}/{fn}' not in used: os.remove(os.path.join(outdir, fn))
    print(f'{tale}: 새로 {made}개, {chars}자, 오류 {errs}, 문장 {len(clips)}, 소리 대사 {len(voice)}')

main()
