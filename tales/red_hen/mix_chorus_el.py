"""빨간 암탉 합창 (ElevenLabs): 배역별 목소리로 따로 녹음한 같은 문장을 한 파일로 겹친다 (witch_candy/mix_chorus_el.py 와 같은 방식).
  python3 tools/elevenlabs/gen_tale.py red_hen --model eleven_v4            # 한국어 (voice_script_el.json 의 extra.ch_* = 같은 문장 × 배역)
  python3 tools/elevenlabs/gen_tale.py red_hen --model eleven_v4 --lang en  # 영어
  python3 tales/red_hen/mix_chorus_el.py                                    # → audio/el/red_hen/chorus/*.mp3, chorus/en/*.mp3 + tales/red_hen/chorus_el.js
고양이·개·돼지 "난 싫어!"(ch_C2)와 다섯 배역 "샌드위치·피자·팬케이크 완성!"(ch_I_done_*), "잘 먹겠습니다!"(ch_J8).
목소리마다 0~120ms 어긋나게 시작한다. 가운데 길이의 클립이 메인(음량 1.0)이고 나머지는 메인 길이에 맞춰 빠르기를 고치고 0.30배로 깔아 말이 같이 끝나게 한다."""
import json, os, re, hashlib, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE = os.path.join(ROOT, 'tales', 'red_hen')
DELAY_MS = [0, 70, 30, 120, 50]
GAIN = .30          # 곁 목소리 음량
MAIN_GAIN = 1.0     # 메인 목소리(길이가 가운데인 클립) 음량 — 2026-10-20: 목소리마다 말 빠르기가 달라 메인을 크게
TEMPO = (.8, 1.25)  # 곁 목소리를 메인 길이에 맞추는 빠르기 한계
ELX = json.load(open(os.path.join(HERE, 'voice_script_el.json')))['extra']
spec = {k: v[0][1] for k, v in ELX.items() if k.startswith('ch_')}   # ch_ 키 → 한국어 문장
en_spec = json.load(open(os.path.join(HERE, 'voice_script_en.json')))['extra']      # ch_ 키 → [[role, 영어 문장, ...] ...]
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

def voices(key, urls):
    return urls
ko, en = {}, {}
for key, text in spec.items():
    ko[text] = mix(voices(key, ko_v[key]), 'audio/el/red_hen/chorus', 'audio/el/red_hen/chorus')
    en[text] = {'t': en_spec[key][0][1], 'c': mix(voices(key, en_v[key]), 'audio/el/red_hen/chorus/en', 'audio/el/red_hen/chorus/en')}
for d, used in (('audio/el/red_hen/chorus', {os.path.basename(v) for v in ko.values()}), ('audio/el/red_hen/chorus/en', {os.path.basename(v['c']) for v in en.values()})):
    for fn in os.listdir(os.path.join(ROOT, d)):
        if fn.endswith('.mp3') and fn not in used: os.remove(os.path.join(ROOT, d, fn))
keys = json.dumps(list(spec))
with open(os.path.join(HERE, 'chorus_el.js'), 'w') as f:
    f.write('/* red_hen — 배역별 합창 ElevenLabs판 (tales/red_hen/mix_chorus_el.py가 생성, 손으로 고치지 말 것).\n'
            '   narration_el.js 뒤에 불러 합창 글자에 겹친 클립을 연결하고, 따로 녹음한 목소리(VOICE_LINES ch_*)는 미리 받지 않게 뺀다 */\n')
    f.write('if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, ' + json.dumps(ko, ensure_ascii=False, indent=1) + ');\n')
    f.write('if (typeof VOICE_LINES !== "undefined") ' + keys + '.forEach(k => { delete VOICE_LINES[k]; });\n')
    f.write('if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, ' + json.dumps(en, ensure_ascii=False, indent=1) + ');\n')
    f.write('if (typeof VOICE_LINES_EN !== "undefined") ' + keys + '.forEach(k => { delete VOICE_LINES_EN[k]; });\n')
print('합창', len(ko), len(en))
