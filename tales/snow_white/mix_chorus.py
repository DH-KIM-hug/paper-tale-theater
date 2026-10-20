"""백설공주 [난쟁이들] 합창: 일곱 난쟁이 목소리로 따로 녹음한 같은 문장을 한 파일로 겹친다.
  python3 tools/typecast/gen_tale.py snow_white   # 먼저 녹음 (voice_script.json 의 extra.ch1… = 같은 문장 × 일곱 목소리)
  python3 tales/snow_white/mix_chorus.py          # → audio/tc/snow_white/chorus/*.mp3 + tales/snow_white/chorus.js
목소리마다 0~120ms 어긋나게 시작하고 음량은 0.45배로 줄여 합창처럼 들리게 한다.
chorus.js 는 합창 파일을 NARRATION_CLIPS 에 넣어 T.say(문장)이 그대로 쓰게 한다 (말풍선 한 번, 끝날 때까지 기다림)."""
import json, os, re, hashlib, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.join(ROOT, 'tales', 'snow_white')
OUT = os.path.join(ROOT, 'audio', 'tc', 'snow_white', 'chorus')
DELAY_MS = [0, 70, 30, 120, 50, 95, 15]   # 목소리마다 시작 어긋남
GAIN = .45
spec = json.load(open(os.path.join(HERE, 'voice_script.json')))
nar = open(os.path.join(HERE, 'narration.js')).read()
voice = json.loads(re.search(r'const VOICE_LINES = (\{.*?\n\});', nar, re.S).group(1))
os.makedirs(OUT, exist_ok=True)
clips, used = {}, set()
for key, text in spec['chorus'].items():
    urls = voice[key]
    h = hashlib.md5(('|'.join(urls) + f'|{DELAY_MS}|{GAIN}').encode()).hexdigest()[:10]
    rel = f'audio/tc/snow_white/chorus/ch_{h}.mp3'; dst = os.path.join(ROOT, rel); used.add(os.path.basename(dst))
    if not os.path.exists(dst):
        args = ['ffmpeg', '-loglevel', 'error', '-y']
        for u in urls: args += ['-i', os.path.join(ROOT, u)]
        f = ''.join(f'[{i}:a]aresample=44100,adelay={DELAY_MS[i % len(DELAY_MS)]}:all=1,volume={GAIN}[a{i}];' for i in range(len(urls)))
        f += ''.join(f'[a{i}]' for i in range(len(urls))) + f'amix=inputs={len(urls)}:duration=longest:normalize=0,alimiter=limit=0.9[out]'
        subprocess.run(args + ['-filter_complex', f, '-map', '[out]', '-ac', '1', '-b:a', '96k', dst], check=True)
        print('mix', key, text)
    clips[text] = rel
for fn in os.listdir(OUT):
    if fn not in used: os.remove(os.path.join(OUT, fn))
with open(os.path.join(HERE, 'chorus.js'), 'w') as f:
    f.write('/* snow_white — 난쟁이들 합창 (tales/snow_white/mix_chorus.py가 생성, 손으로 고치지 말 것).\n'
            '   합창 파일을 말풍선 대사로 쓰고, 따로 녹음한 일곱 목소리는 미리 받지 않게 뺀다 */\n')
    f.write('const CHORUS_CLIPS = ' + json.dumps(clips, ensure_ascii=False, indent=1) + ';\n')
    f.write('if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, CHORUS_CLIPS);\n')
    f.write('if (typeof VOICE_LINES !== "undefined") ' + json.dumps(list(spec['chorus'])) + '.forEach(k => { delete VOICE_LINES[k]; });\n')
print('합창', len(clips))
