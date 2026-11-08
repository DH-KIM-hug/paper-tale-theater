"""스플래시 마지막(로고 글자 '톡'·'톡'·'동화극장'이 일어서는 순간)에 앱 이름을 부르는 한 줄 — ElevenLabs 녹음.
2026-11-08 1판: 홈 목소리(Lily)로 밝게 외침 → 같은 날 사용자 "목소리 다르면 좋겠음. 좀 더 차분하고 나긋하게"
  → 홈과 다른 영어권 성우 목소리(한국인 원어민 목소리는 쓰지 않음, 11-02 사용자 결정)로 잠자리 동화처럼 차분하고 따뜻하게 부른다.
앱 이름이 바뀌면 NAME 만 고치고 다시 돌린다(같은 목소리·톤·글이면 캐시에서 다시 쓴다).
  python3 tools/elevenlabs/gen_splash.py --audition      # VOICES 모두를 한국어로 받아 비교 표(목소리마다 READS 중 가장 차분한 것)만 출력, 넣지 않음
  python3 tools/elevenlabs/gen_splash.py --lang ko       # USE 목소리로 한국어만 받아 sounds/splash/title_ko.mp3 로 넣기
  python3 tools/elevenlabs/gen_splash.py                 # USE 목소리로 한국어·영어 둘 다
  python3 tools/elevenlabs/gen_splash.py --dry           # 보낼 글자 수만
  python3 tools/elevenlabs/gen_splash.py --voice george --pick ko=1   # 다른 목소리·다른 톤 번호로 넣기
후보는 ~/.paper-tale/cache/splash_takes/ 에 남는다(저장소 밖). 고르기: 받아쓰기가 이름과 같고 MAXLEN 이하인 것 중 음높이 폭이 가장 좁은(차분한) 것(1.4초 미만의 빠른 읽기는 뒤로).
길이: 첫 글자가 일어선 뒤 장면 끝까지 실제 약 1.75초. 장면이 저절로 끝나면 start.js 가 목소리는 끊지 않고 끝까지 들려주므로(홈이 드러난 뒤 조금 더) 2.4초까지 허용.
고른 파일은 앞 무음을 10ms 로 잘라 start.js 의 시각(scene.js LANDS[0])에 첫 소리가 맞는다.
받아쓰기 확인은 ElevenLabs 받아쓰기(scribe_v1)로 한다(글자 수 아님). API 키는 ~/.config/elevenlabs/key (출력하지 않음)."""
import hashlib, json, os, re, subprocess, sys, tempfile, urllib.request, uuid
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from polish import polish

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
KEY = open(os.path.expanduser('~/.config/elevenlabs/key')).read().strip()
VOICES = {   # 이름: (voice_id, 설명) — 모두 영어권 성우 목소리, 홈(Lily)과 다름
    'jessica_anne': ('lxYfHSkYm1EzQzGhdbfc', 'Jessica Anne Bogart, 여성, 미국, 차분한 낭독'),
    'priyanka': ('BpjGufoPiobT79j2vtj4', 'Priyanka Sogam (Late Night Radio), 여성, 영국, 느긋한 밤 라디오'),
    'george': ('JBFqnCBsd6RMkjVDRZzb', 'George, 남성, 영국, 따뜻한 이야기꾼'),
}
USE = 'priyanka'   # 2026-11-08 사용자가 후보 v2(밤 라디오 말투)를 고름. 톤은 READS[2] '[softly]'
NAME = {'ko': '톡톡 동화극장.', 'en': 'Toki, Toki Tale.'}   # 영어는 쉼표로 한 숨 쉬어 나긋하게(쉼표 없으면 1.1초로 빠름)   # 외침이 아니라 부르듯이: 느낌표 대신 마침표
READS = [   # (태그, 설정, 모델) — 차분하고 나긋하게. 짧은 글에 긴 태그를 붙이면 eleven_v4 가 이름을 되풀이해서(2026-11-08 시험: '톡톡 동화. 톡톡 동화극장.'),
            # 태그는 한 낱말로 줄이고, 태그 없이 안정적인 multilingual_v2 도 함께 받는다
    ('[gently] ', {'stability': 0.6, 'style': 0.2}, 'eleven_v4'),
    ('', {'stability': 0.7, 'style': 0.1}, 'eleven_multilingual_v2'),
    ('[softly] ', {'stability': 0.55, 'style': 0.25}, 'eleven_v4'),
]
CACHE = os.path.expanduser('~/.paper-tale/cache/splash_takes')
MAXLEN = 2.4

def tts(path, voice, text, settings, model, lang='ko'):
    body = {'text': text, 'model_id': model, 'voice_settings': {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.3, **settings}}
    if lang == 'en': body['language_code'] = 'en'   # 영어 이름 'Toki' 를 일본어(ドキドキ)로 읽는 일이 있어 언어를 못 박는다(2026-11-08)
    r = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', json.dumps(body).encode(), {'xi-api-key': KEY, 'Content-Type': 'application/json'})
    open(path, 'wb').write(urllib.request.urlopen(r, timeout=120).read())
    polish(path, log=False)

def transcribe(path):
    b = '----' + uuid.uuid4().hex
    parts = [f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\nscribe_v1\r\n'.encode(),
             f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode() + open(path, 'rb').read() + b'\r\n',
             f'--{b}--\r\n'.encode()]
    r = urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-text', b''.join(parts), {'xi-api-key': KEY, 'Content-Type': f'multipart/form-data; boundary={b}'})
    try: return json.load(urllib.request.urlopen(r, timeout=120)).get('text', '')
    except Exception as e: return f'(받아쓰기 실패 {e})'

def pcm(path, sr=22050):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'])
    return np.frombuffer(raw, '<i2').astype(float) / 32768, sr

def measure(path):
    x, sr = pcm(path)
    fr = int(.03 * sr); hop = int(.01 * sr)
    rms = np.array([np.sqrt(np.mean(x[i:i + fr] ** 2)) for i in range(0, len(x) - fr, hop)])
    on = rms > max(rms) * .06
    idx = np.where(on)[0]; length = (idx[-1] - idx[0]) * hop / sr if len(idx) else 0
    f0 = []
    for i in idx:   # 자기상관 음높이(120~600Hz), 또렷한 칸만
        seg = x[i * hop:i * hop + fr * 2]; seg = seg - seg.mean()
        if len(seg) < fr * 2: continue
        ac = np.correlate(seg, seg, 'full')[len(seg) - 1:]
        lo, hi = sr // 600, sr // 120
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > .45 * ac[0]: f0.append(sr / k)
    semis = 12 * np.log2(np.array(f0) / 261.63) if f0 else np.array([0.0])
    spec = np.abs(np.fft.rfft(x[idx[0] * hop:idx[-1] * hop + fr])) if len(idx) else np.zeros(2)
    freqs = np.fft.rfftfreq((len(spec) - 1) * 2, 1 / sr)
    centroid = float(np.sum(freqs * spec) / max(np.sum(spec), 1e-9))
    pitch, spread = float(np.median(semis)), float(np.percentile(semis, 90) - np.percentile(semis, 10))
    score = -spread - (100 if length > MAXLEN else 0) - (20 if length < 1.4 else 0)   # 차분함: 음높이 폭이 좁을수록, 너무 빠른 읽기(1.4초 미만)는 나긋하지 않아 뒤로
    return {'len': round(length, 2), 'pitch': round(pitch, 1), 'range': round(spread, 1), 'centroid': int(centroid), 'score': round(score, 1)}

def install(src, lang):
    out = os.path.join(ROOT, f'sounds/splash/title_{lang}.mp3'); os.makedirs(os.path.dirname(out), exist_ok=True)
    # 앞 무음은 10ms 만 남기고, 끝 무음 자르고 짧게 닫음, 64k 모노(앱 묶음 규칙)
    af = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.01,'
          'areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08,areverse')
    with tempfile.TemporaryDirectory() as td:
        w = os.path.join(td, 'a.wav')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, w], check=True)
        d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', w]))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', w, '-af', f'afade=t=out:st={max(0, d - .06):.3f}:d=0.06', '-ar', '44100', '-ac', '1', '-b:a', '64k', out], check=True)
    print('넣음', os.path.relpath(out, ROOT), f'{d:.2f}s')

def takes(voice, lang, dry, counter):
    vid = VOICES[voice][0]; text = NAME[lang]; rows = []
    for i, (tag, st, model) in enumerate(READS):
        sent = tag + text
        h = hashlib.md5(f'{vid}|{model}|{sent}|{st}{"|en" if lang == "en" else ""}'.encode()).hexdigest()[:10]
        p = os.path.join(CACHE, f'{lang}_{voice}_{h}.mp3')
        if not os.path.exists(p):
            counter[0] += len(sent)
            if dry: continue
            tts(p, vid, sent, st, model, lang)
        if dry: continue
        m = measure(p); tj = p + '.txt'
        if not os.path.exists(tj): open(tj, 'w').write(transcribe(p))
        m['heard'] = open(tj).read(); rows.append((i, p, m))
        print(lang, voice, i, tag.strip() or model, json.dumps(m, ensure_ascii=False), flush=True)
    return rows

def best(rows, text, pick=None):
    if pick is not None: return rows[int(pick)]
    norm = lambda s: re.sub(r'[^\w]', '', s).lower().replace('tail', 'tale')   # 띄어쓰기·문장부호 무시, tail=tale 같은 소리
    ok = [r for r in rows if norm(r[2]['heard']) == norm(text)] or rows
    return max(ok, key=lambda r: r[2]['score'])

def arg(name, default=None):
    return sys.argv[sys.argv.index(name) + 1] if name in sys.argv else default

def main():
    dry = '--dry' in sys.argv
    pick = dict(a.split('=') for a in sys.argv[sys.argv.index('--pick') + 1:] if '=' in a) if '--pick' in sys.argv else {}
    os.makedirs(CACHE, exist_ok=True); counter = [0]
    if '--audition' in sys.argv:
        for v in VOICES:
            rows = takes(v, 'ko', dry, counter)
            if rows:
                b = best(rows, NAME['ko']); print('후보', v, VOICES[v][1], '→ 톤', b[0], b[1], b[2]['len'], 's')
    else:
        voice = arg('--voice', USE)
        for lang in ([arg('--lang')] if arg('--lang') else list(NAME)):
            rows = takes(voice, lang, dry, counter)
            if dry: continue
            b = best(rows, NAME[lang], pick.get(lang))
            print(lang, voice, '고름', b[0], READS[b[0]][0].strip())
            install(b[1], lang)
    print('새로 보낸 글자 수:', counter[0])

if __name__ == '__main__':
    main()
