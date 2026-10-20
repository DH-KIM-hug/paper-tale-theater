#!/usr/bin/env python3
"""녹음된 한 줄의 앞부분(문장 단위)만 잘라 새 대사 클립으로 쓴다 — 크레딧 없이 "…톡 눌러 봐요!" 같은 꼬리를 떼어 낼 때.
  python3 tools/elevenlabs/trim_line.py <tale> '<옛 한국어 줄>' '<새 한국어 줄>' ['<새 영어 줄>']
  1) voice_script_el/en.json 의 그 줄 글을 새 글로 바꾸고  2) 옛 클립에서 새 글 길이에 맞는 문장 사이 쉼에서 자르고
  3) gen_tale.py --dry 가 알려 주는 새 클립 경로에 저장한 뒤  4) gen_tale.py 로 narration_el(_en).js 를 다시 쓴다 (새로 만드는 글자 0)."""
import json, os, re, subprocess, sys
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
PY = os.path.expanduser('~/.venvs/paper-tale/bin/python')
tale, old, new = sys.argv[1:4]; new_en = sys.argv[4] if len(sys.argv) > 4 else None
TD = os.path.join(G, 'tales', tale)

def old_clip(js, key):
    s = open(os.path.join(TD, js)).read()
    m = re.search(r'NARRATION_CLIPS(?:_EN)?, (\{.*?\})\);', s, re.S); d = json.loads(m.group(1))
    v = d[key]; v = v['c'] if isinstance(v, dict) else v
    assert isinstance(v, str), '여러 배역 줄은 안 됨'; return os.path.join(G, v)

def silences(f, n=-38, d=.18):
    r = subprocess.run(['ffmpeg', '-i', f, '-af', f'silencedetect=n={n}dB:d={d}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    dur = float(re.search(r'Duration: (\d+):(\d+):([\d.]+)', r).groups()[2]) + 60 * int(re.search(r'Duration: (\d+):(\d+)', r).group(2))
    return list(zip(st, en)), dur

def cut(src, dst, old_t, new_t):
    for n, d in ((-38, .18), (-34, .12), (-30, .08)):  # 쉼이 짧으면 기준을 조금씩 느슨하게
        gaps, dur = silences(src, n, d)
        gaps = [g for g in gaps if .3 < g[0] < dur - .3]
        if gaps: break
    want = dur * len(new_t) / len(old_t)
    assert gaps, '문장 사이 쉼을 못 찾음'
    a, b = min(gaps, key=lambda g: abs((g[0] + g[1]) / 2 - want))
    end = a + min(.25, (b - a) / 2)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-t', f'{end:.3f}', '-af', f'afade=t=out:st={max(0, end - .08):.3f}:d=0.08', '-b:a', '128k', dst], check=True)
    print(f'cut {os.path.basename(src)} {dur:.2f}s → {end:.2f}s (목표 {want:.2f}s)')

def rewrite(fn, en):
    p = os.path.join(TD, fn); d = json.load(open(p))
    for l in d['lines']:
        if l['text'] == old:
            l['text'] = new
            if en: l['en'] = new_en
            if l.get('segs'): l['segs'][0][1] = new_en if en else new  # segs 없는 줄은 text/en 만
    json.dump(d, open(p, 'w'), ensure_ascii=False, indent=1)

def need(lang, txt):
    args = [PY, os.path.join(G, 'tools/elevenlabs/gen_tale.py'), tale, '--model', 'eleven_v4', '--dry'] + (['--lang', 'en'] if lang == 'en' else [])
    out = subprocess.run(args, capture_output=True, text=True, cwd=G).stdout
    return [l.split()[1] for l in out.splitlines() if l.startswith('NEED ') and l.endswith('| ' + txt)]

jobs = [('ko', 'narration_el.js', 'voice_script_el.json', None)]
if new_en: jobs.append(('en', 'narration_el_en.js', 'voice_script_en.json', new_en))
for lang, js, vs, ne in jobs:
    try: src = old_clip(js, old)
    except KeyError: print(lang, '이미 바뀜 → 건너뜀'); continue
    oldtxt = json.load(open(os.path.join(TD, vs)))
    oldtxt = next(l.get('en', l['text']) if lang == 'en' else l['text'] for l in oldtxt['lines'] if l['text'] == old)
    tmp = src + '.keep.mp3'; subprocess.run(['cp', src, tmp], check=True)  # gen_tale 이 안 쓰는 옛 클립을 지우므로 먼저 보관
    rewrite(vs, lang == 'en')
    n = need(lang, ne or new); assert len(n) == 1, n
    cut(tmp, os.path.join(G, n[0]), oldtxt, ne or new); os.remove(tmp)
    subprocess.run([PY, os.path.join(G, 'tools/elevenlabs/gen_tale.py'), tale, '--model', 'eleven_v4'] + (['--lang', 'en'] if lang == 'en' else []), cwd=G, check=True)
