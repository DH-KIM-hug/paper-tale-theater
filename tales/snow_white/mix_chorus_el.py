"""백설공주 [난쟁이들] 합창 (ElevenLabs): 일곱 난쟁이 목소리로 따로 녹음한 같은 문장을 한 파일로 겹친다.
  python3 tools/elevenlabs/gen_tale.py snow_white --model eleven_v4            # 한국어 (voice_script_el.json 의 extra.ch1… = 같은 문장 × 일곱 목소리)
  python3 tools/elevenlabs/gen_tale.py snow_white --model eleven_v4 --lang en  # 영어
  python3 tales/snow_white/mix_chorus_el.py                                    # → audio/el/snow_white/chorus/*.mp3, chorus/en/*.mp3 + tales/snow_white/chorus_el.js
목소리마다 0~120ms 어긋나게 시작하고 음량은 0.45배로 줄인다 (Typecast 합창 mix_chorus.py 와 같은 값).
chorus_el.js 는 chorus.js 뒤에 불러서 EL 합창으로 덮어쓴다 (?voice=tc 이면 불러오지 않아 Typecast 합창 유지)."""
import json, os, re, hashlib, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.join(ROOT, 'tales', 'snow_white')
DELAY_MS = [0, 70, 30, 120, 50, 95, 15]
GAIN = .45
spec = json.load(open(os.path.join(HERE, 'voice_script.json')))['chorus']          # ch키 → 한국어 문장
en_spec = json.load(open(os.path.join(HERE, 'voice_script_en.json')))['extra']      # ch키 → [[role, 영어 문장, ...] × 7]
def lines_of(fn, name):
    return json.loads(re.search(r'Object\.assign\(' + name + r', (\{.*?\n\})\);', open(os.path.join(HERE, fn)).read(), re.S).group(1))
ko_v = lines_of('narration_el.js', 'VOICE_LINES')
en_v = lines_of('narration_el_en.js', 'VOICE_LINES_EN')

def mix(urls, outdir, reldir):
    os.makedirs(os.path.join(ROOT, outdir), exist_ok=True)
    h = hashlib.md5(('|'.join(urls) + f'|{DELAY_MS}|{GAIN}').encode()).hexdigest()[:10]
    rel = f'{reldir}/ch_{h}.mp3'; dst = os.path.join(ROOT, rel)
    if not os.path.exists(dst):
        args = ['ffmpeg', '-loglevel', 'error', '-y']
        for u in urls: args += ['-i', os.path.join(ROOT, u)]
        f = ''.join(f'[{i}:a]aresample=44100,adelay={DELAY_MS[i % len(DELAY_MS)]}:all=1,volume={GAIN}[a{i}];' for i in range(len(urls)))
        f += ''.join(f'[a{i}]' for i in range(len(urls))) + f'amix=inputs={len(urls)}:duration=longest:normalize=0,alimiter=limit=0.9[out]'
        subprocess.run(args + ['-filter_complex', f, '-map', '[out]', '-ac', '1', '-b:a', '96k', dst], check=True)
    return rel

ko, en = {}, {}
for key, text in spec.items():
    ko[text] = mix(ko_v[key], 'audio/el/snow_white/chorus', 'audio/el/snow_white/chorus')
    en[text] = {'t': en_spec[key][0][1], 'c': mix(en_v[key], 'audio/el/snow_white/chorus/en', 'audio/el/snow_white/chorus/en')}
for d, used in (('audio/el/snow_white/chorus', {os.path.basename(v) for v in ko.values()}), ('audio/el/snow_white/chorus/en', {os.path.basename(v['c']) for v in en.values()})):
    for fn in os.listdir(os.path.join(ROOT, d)):
        if fn.endswith('.mp3') and fn not in used: os.remove(os.path.join(ROOT, d, fn))
keys = json.dumps(list(spec))
with open(os.path.join(HERE, 'chorus_el.js'), 'w') as f:
    f.write('/* snow_white — 난쟁이들 합창 ElevenLabs판 (tales/snow_white/mix_chorus_el.py가 생성, 손으로 고치지 말 것).\n'
            '   narration_el.js·chorus.js 뒤에 불러 EL 합창으로 덮어쓰고, 따로 녹음한 일곱 목소리는 미리 받지 않게 뺀다 */\n')
    f.write('if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, ' + json.dumps(ko, ensure_ascii=False, indent=1) + ');\n')
    f.write('if (typeof VOICE_LINES !== "undefined") ' + keys + '.forEach(k => { delete VOICE_LINES[k]; });\n')
    f.write('if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, ' + json.dumps(en, ensure_ascii=False, indent=1) + ');\n')
    f.write('if (typeof VOICE_LINES_EN !== "undefined") ' + keys + '.forEach(k => { delete VOICE_LINES_EN[k]; });\n')
print('합창', len(ko), len(en))
