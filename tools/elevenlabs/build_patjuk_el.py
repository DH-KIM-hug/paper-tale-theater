"""팥죽할멈 한국어 줄(story.js + tools/typecast/gen_patjuk.py 의 배역·감정 표)을 tales/patjuk/voice_script_el.json 으로 옮긴다.
ElevenLabs 목소리는 아래 EL 표에서 정한다."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = open(os.path.join(ROOT, 'tools/typecast/gen_patjuk.py')).read()
src = src.replace("KEY = open(os.path.expanduser('~/.config/typecast/key')).read().strip()", "").rsplit('\nmain()', 1)[0]
g = {'__file__': os.path.join(ROOT, 'tools/typecast/gen_patjuk.py')}; exec(src, g)
# 선택: 내레이터 George(따뜻한 이야기꾼) · 할멈 Matilda · 호랑이 Brian(깊은 목소리) · 친구들은 밝은 프리메이드 목소리를 돌려 쓴다
EL = {'nar': 'JBFqnCBsd6RMkjVDRZzb', 'halmi': 'XrExE9yKIg1WjnnlVkGX', 'tiger': 'nPczCjzI2devNBz1zQrb',
      'bam': 'cgSgspJ2msm6clMCkdW9', 'jara': 'FGY2WhTYpPnrIDTdsKH5', 'ddong': 'TX3LPaxmHKxFdv7VOQHJ',
      'songgot': 'bIHbv24MWmeRgasZH58o', 'jeolgu': 'IKne3meq5aSn9XLyUdCD', 'myeongseok': 'EXAVITQu4vr4xnSDxMaL', 'jige': 'N2lVS1w4EtoT3dr4eOWO'}
S = g['load_story'](); lines = []
def add(t, fid=None): lines.append((t, fid))
for t in S['INTRO']['opening']: add(t)
add(S['INTRO']['tigerBack']); add(S['INTRO']['help'])
for f in S['FRIENDS']: add(f['intro'], f['id']); add(f['success']); add(f['fail'])
for t in S['PROMPTS']: add(t)
for t in S['LINES'].values(): add(t)
for h in S['HELP']: add(h['where']); add(h['who'])
out, seen = [], set()
for text, fid in lines:
    if text in seen: continue
    seen.add(text)
    out.append({'text': text, 'segs': [[r, s, g['final_emo'](r, s, e)] for r, s, e in g['segments'](text, fid)]})
extra = {k: [[r, t, g['final_emo'](r, t, e)] for r, t, e, _ in v] for k, v in g['EXTRA'].items()}
json.dump({'voices': EL, 'lines': out, 'extra': extra}, open(os.path.join(ROOT, 'tales/patjuk/voice_script_el.json'), 'w'), ensure_ascii=False, indent=1)
