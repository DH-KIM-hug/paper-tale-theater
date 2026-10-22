#!/usr/bin/env python3
"""읽기 대본(read_script_*.json)의 src='trim' 줄: 기존 클립 꼬리("다음은 누구죠?" 류)를 잘라 새 클립으로 쓴다 (크레딧 0).
  ~/.venvs/paper-tale/bin/python tools/elevenlabs/trim_read.py <tale> [en]
gen_tale.py --read --dry 가 알려 주는 새 클립 경로(NEED)에, 기존 줄(from)의 같은 순서 세그먼트 클립을 문장 사이 쉼에서 잘라 둔다."""
import json, os, re, subprocess, sys
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PY = os.path.expanduser('~/.venvs/paper-tale/bin/python')
tale = sys.argv[1]; en = len(sys.argv) > 2 and sys.argv[2] == 'en'
TD = os.path.join(G, 'tales', tale)

def silences(f, n, d):
    r = subprocess.run(['ffmpeg', '-i', f, '-af', f'silencedetect=n={n}dB:d={d}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]; e = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    h, m, s = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r).groups()
    return list(zip(st, e)), int(h) * 3600 + int(m) * 60 + float(s)

def cut(src, dst, old_t, new_t):
    for n, d in ((-38, .18), (-34, .12), (-30, .08), (-28, .05)):
        gaps, dur = silences(src, n, d)
        gaps = [g for g in gaps if .3 < g[0] < dur - .3]
        if gaps: break
    assert gaps, '문장 사이 쉼을 못 찾음 ' + src
    want = dur * len(new_t) / len(old_t)
    a, b = min(gaps, key=lambda g: abs((g[0] + g[1]) / 2 - want))
    end = a + min(.25, (b - a) / 2)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-t', f'{end:.3f}', '-af', f'afade=t=out:st={max(0, end - .08):.3f}:d=0.08', '-b:a', '128k', dst], check=True)
    print(f'cut {os.path.basename(src)} {dur:.2f}s → {end:.2f}s (목표 {want:.2f}s) → {os.path.basename(dst)}')

dry = subprocess.run([PY, os.path.join(G, 'tools/elevenlabs/gen_tale.py'), tale, '--read', '--model', 'eleven_v4', '--dry'] + (['--lang', 'en'] if en else []), capture_output=True, text=True, cwd=G).stdout
need = {l.partition(' | ')[2]: l.split()[1] for l in dry.splitlines() if l.startswith('NEED ')}
rs = json.load(open(os.path.join(TD, 'read_script_en.json' if en else 'read_script_el.json')))
old = json.load(open(os.path.join(TD, 'voice_script_en.json' if en else 'voice_script_el.json')))
omap = json.loads(re.search(r'NARRATION_CLIPS(?:_EN)?, (\{.*?\n\})\);', open(os.path.join(TD, 'narration_el_en.js' if en else 'narration_el.js')).read(), re.S).group(1))
for sc in rs['scenes']:
    for l in sc['lines']:
        if l['src'] != 'trim': continue
        o = next(x for x in old['lines'] if x['text'] == l['from'])
        v = omap[l['from']]; v = v['c'] if isinstance(v, dict) else v; v = [v] if isinstance(v, str) else v
        for i, g in enumerate(l['segs']):
            dst = need.get(g[1])
            if not dst: continue  # 이미 있음(앞 세그먼트는 그대로)
            og = o['segs'][i]; assert og[0] == g[0] and g[1] in og[1] or og[1].startswith(g[1].rstrip('.!?')), (og, g)
            cut(os.path.join(G, v[i]), os.path.join(G, dst), og[1], g[1])
