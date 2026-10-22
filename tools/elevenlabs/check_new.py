"""새로 만든 ElevenLabs 클립을 받아써서 대본과 나란히 보여 준다 (v4가 같은 말을 되풀이하는 버릇 점검).
  ~/.venvs/paper-tale/bin/python tools/elevenlabs/check_new.py <tale> <marker 파일> [ko|en] [read]   # read: 읽기 모드 맵·대본(read_narration_el*.js, read_script_*.json)
marker 파일보다 새로 생긴 클립만 본다. 받아쓴 글이 대본보다 1.4배 넘게 길면 '<<<' 표시."""
import json, os, sys, re
import mlx_whisper
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
tale, marker = sys.argv[1], sys.argv[2]; lang = sys.argv[3] if len(sys.argv) > 3 else 'ko'
since = os.path.getmtime(marker)
read = len(sys.argv) > 4 and sys.argv[4] == 'read'
nf = os.path.join(ROOT, 'tales', tale, ('read_' if read else '') + ('narration_el_en.js' if lang == 'en' else 'narration_el.js'))
s = open(nf).read()
blocks = [json.loads(m) for m in re.findall(r'Object\.assign\([A-Z_]+, (\{.*?\})\);', s, re.S)]
vs = json.load(open(os.path.join(ROOT, 'tales', tale, ('read_script_' if read else 'voice_script_') + ('en.json' if lang == 'en' else 'el.json'))))
if read: vs['lines'] = [l for sc in vs['scenes'] for l in sc['lines']]
segs = {}
for x in vs.get('lines', []):
    k = x.get('en') if lang == 'en' and x.get('en') else x.get('text')
    segs[k] = [g[1] for g in x.get('segs') or []]
for name, v in (vs.get('extra') or {}).items(): segs[name] = [g[1] for g in v]
norm = lambda t: re.sub(r'[^0-9A-Za-z가-힣]', '', t)
for b in blocks:
    for k, v in b.items():
        if isinstance(v, dict): text, clips = v.get('t', k), v.get('c')
        else: text, clips = k, v
        clips = [clips] if isinstance(clips, str) else clips
        parts = segs.get(text) or segs.get(k) or [text]
        for i, c in enumerate(clips):
            p = os.path.join(ROOT, c)
            if not os.path.exists(p) or os.path.getmtime(p) < since: continue
            want = parts[i] if i < len(parts) else text
            got = mlx_whisper.transcribe(p, path_or_hf_repo='mlx-community/whisper-small-mlx', language=lang)['text'].strip()
            flag = ' <<<' if len(norm(got)) > 1.4 * max(4, len(norm(want))) else ''
            print(f'{os.path.basename(c)} | 대본: {want} | 들림: {got}{flag}', flush=True)
