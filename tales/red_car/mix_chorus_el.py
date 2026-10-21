"""나의 빨간 자동차 [다섯 자동차] 합창 (ElevenLabs): 다섯 자동차 목소리로 따로 녹음한 같은 문장을 한 파일로 겹친다.
  python3 tools/elevenlabs/gen_tale.py red_car --model eleven_v4            # 한국어 (voice_script_el.json 의 extra.cheer = 같은 문장 × 다섯 목소리)
  python3 tools/elevenlabs/gen_tale.py red_car --model eleven_v4 --lang en  # 영어
  python3 tales/red_car/mix_chorus_el.py                                    # → audio/el/red_car/chorus/*.mp3, chorus/en/*.mp3 + tales/red_car/chorus_el.js
목소리마다 0~120ms 어긋나게 시작한다. 가운데 길이의 클립이 메인(음량 1.0)이고 나머지는 메인 길이에 맞춰 빠르기를 고치고 0.30배로 깔아 말이 같이 끝나게 한다.
chorus_el.js 는 chorus.js 뒤에 불러서 EL 합창으로 덮어쓴다 (?voice=tc 이면 불러오지 않아 Typecast 합창 유지)."""
import json, os, re, hashlib, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.join(ROOT, 'tales', 'red_car')
DELAY_MS = [0, 70, 30, 120, 50]
GAIN = .30          # 곁 목소리 음량
MAIN_GAIN = 1.0     # 메인 목소리(길이가 가운데인 클립) 음량 — 2026-10-20: 목소리마다 말 빠르기가 달라 메인을 크게
TEMPO = (.8, 1.25)  # 곁 목소리를 메인 길이에 맞추는 빠르기 한계
spec = json.load(open(os.path.join(HERE, 'voice_script_el.json')))['chorus']          # cheer 키 → 한국어 문장
en_spec = json.load(open(os.path.join(HERE, 'voice_script_en.json')))['extra']      # cheer 키 → [[role, 영어 문장, ...] × 5]
def lines_of(fn, name):
    return json.loads(re.search(r'Object\.assign\(' + name + r', (\{.*?\n\})\);', open(os.path.join(HERE, fn)).read(), re.S).group(1))
ko_v = lines_of('narration_el.js', 'VOICE_LINES')
en_v = lines_of('narration_el_en.js', 'VOICE_LINES_EN')

def dur(path):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True).stdout)

def mix(urls, outdir, reldir):
    os.makedirs(os.path.join(ROOT, outdir), exist_ok=True)
    h = hashlib.md5(('|'.join(urls) + f'|{DELAY_MS}|{GAIN}|{MAIN_GAIN}|{TEMPO}').encode()).hexdigest()[:10]
    rel = f'{reldir}/ch_{h}.mp3'; dst = os.path.join(ROOT, rel)
    if not os.path.exists(dst):
        ds = [dur(os.path.join(ROOT, u)) for u in urls]
        main = sorted(range(len(urls)), key=lambda i: ds[i])[len(urls) // 2]   # 길이가 가운데인 클립 = 메인
        args = ['ffmpeg', '-loglevel', 'error', '-y']
        for u in urls: args += ['-i', os.path.join(ROOT, u)]
        parts = []
        for i in range(len(urls)):
            r = min(TEMPO[1], max(TEMPO[0], ds[i] / ds[main])) if i != main else 1.0   # >1 이면 빠르게
            tempo = f'atempo={r:.4f},' if abs(r - 1) > .01 else ''
            parts.append(f'[{i}:a]aresample=44100,{tempo}adelay={DELAY_MS[i % len(DELAY_MS)] if i != main else 0}:all=1,volume={MAIN_GAIN if i == main else GAIN}[a{i}];')
        f = ''.join(parts) + ''.join(f'[a{i}]' for i in range(len(urls))) + f'amix=inputs={len(urls)}:duration=longest:normalize=0,alimiter=limit=0.9[out]'
        subprocess.run(args + ['-filter_complex', f, '-map', '[out]', '-ac', '1', '-b:a', '96k', dst], check=True)
    return rel

ko, en = {}, {}
for key, text in spec.items():
    ko[text] = mix(ko_v[key], 'audio/el/red_car/chorus', 'audio/el/red_car/chorus')
    en[text] = {'t': en_spec[key][0][1], 'c': mix(en_v[key], 'audio/el/red_car/chorus/en', 'audio/el/red_car/chorus/en')}
for d, used in (('audio/el/red_car/chorus', {os.path.basename(v) for v in ko.values()}), ('audio/el/red_car/chorus/en', {os.path.basename(v['c']) for v in en.values()})):
    for fn in os.listdir(os.path.join(ROOT, d)):
        if fn.endswith('.mp3') and fn not in used: os.remove(os.path.join(ROOT, d, fn))
keys = json.dumps(list(spec))
with open(os.path.join(HERE, 'chorus_el.js'), 'w') as f:
    f.write('/* red_car — 다섯 자동차 합창 ElevenLabs판 (tales/red_car/mix_chorus_el.py가 생성, 손으로 고치지 말 것).\n'
            '   narration_el.js·chorus.js 뒤에 불러 EL 합창으로 덮어쓰고, 따로 녹음한 다섯 목소리는 미리 받지 않게 뺀다 */\n')
    f.write('if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, ' + json.dumps(ko, ensure_ascii=False, indent=1) + ');\n')
    f.write('if (typeof VOICE_LINES !== "undefined") ' + keys + '.forEach(k => { delete VOICE_LINES[k]; });\n')
    f.write('if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, ' + json.dumps(en, ensure_ascii=False, indent=1) + ');\n')
    f.write('if (typeof VOICE_LINES_EN !== "undefined") ' + keys + '.forEach(k => { delete VOICE_LINES_EN[k]; });\n')
print('합창', len(ko), len(en))
