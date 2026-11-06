"""아이 본인 대사의 반대 모습 목소리 녹음 (이름 설정 2판 §4-4, 2026-11-07 사용자 결정).
  python3 tools/elevenlabs/gen_look.py [--dry] [--only <tale>]
기존 gen_tale.py 와 같은 모델·voice_settings·연기 태그로 목소리만 바꿔 audio/el/<tale>/look/<자리><모습>/(en/) 에 만들고,
tales/<tale>/narration_el_look_<자리><모습>.js 를 쓴다. 기존 클립은 지우지도 건드리지도 않는다. 키는 ~/.config/elevenlabs/key."""
import json, os, re, sys, hashlib, urllib.request
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from polish import polish
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KEY = open(os.path.expanduser('~/.config/elevenlabs/key')).read().strip()
MODEL0 = 'eleven_v3'
TAG = {'happy': '[cheerful] ', 'sad': '[sad] ', 'angry': '[angry] ', 'whisper': '[whispers] ', 'toneup': '[excited] ', 'tonedown': '[calm] '}
SETTINGS = {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.3}
V = dict(Hopsi='ygoBNrnmTEdu5NtDTmAY', Annie='Lb7qkOn5hF8p7qfCDH8q', Teddy='XjGYkUkzth8BPs29fmcV', Mark='DUnzBkwtjRWXPr6wRbmL', Emmaline='nDJIICjR9zfJExIFeSCN', Lulu='ocZQ262SsZb9RIxcQBOj')
# 동화: [(자리, 배역, 모습, 목소리)]
JOBS = {'red_car': [('B', 'child', 'g', 'Annie')], 'unicorn': [('A', 'kid', 'b', 'Teddy')], 'witch_candy': [('A', 'kid', 'b', 'Teddy')],
        'kkultteok': [('A', 'nuna', 'b', 'Mark'), ('B', 'oppa', 'g', 'Emmaline'), ('C', 'agi', 'g', 'Lulu')]}
dry = '--dry' in sys.argv
only = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
chars = 0; made = 0

def tagged(text, emo, model):
    if not model.startswith('eleven_v') or model == 'eleven_multilingual_v2' or not emo: return text
    return TAG.get(emo.partition(':')[0], '') + text
def lead(dr):
    if not dr: return None
    if not dr.startswith('='): return dr
    m = re.match(r'=\s*((?:\[[^\]]*\]\s*)+)', dr); return m.group(1).strip() if m else None
def tts(path, voice, text, model, st):
    global made
    body = {'text': text, 'model_id': model, 'voice_settings': {**SETTINGS, **(st or {})}}
    import time, urllib.error
    for a in range(6):
        r = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', json.dumps(body).encode(), {'xi-api-key': KEY, 'Content-Type': 'application/json'})
        try:
            data = urllib.request.urlopen(r, timeout=120).read(); open(path, 'wb').write(data); polish(path); made += 1; return
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and a < 5: time.sleep(3 * (a + 1)); continue
            raise
def jmap(f):  # narration js 의 Object.assign 맵들 읽기
    out = {}
    if not os.path.exists(f): return out
    s = open(f).read()
    for nm, m in re.findall(r'Object\.assign\((\w+), (\{.*?\n\})\);', s, re.S): out[nm] = json.loads(m)
    return out
def lines_of(d):
    L = [l for sc in d['scenes'] for l in sc['lines']] if 'scenes' in d else d['lines']
    return [l for l in L if l.get('src') != 'chorus' and not l.get('voice')]

for tale, jobs in JOBS.items():
    if only and tale != only: continue
    td = os.path.join(ROOT, 'tales', tale)
    EL = json.load(open(os.path.join(td, 'voice_script_el.json')))
    MODELS = EL.get('models') or {}; SET = EL.get('settings') or {}; VO = EL['voices']
    for slot, role, look, vname in jobs:
        code = slot + look; voice = V[vname]
        res = {'ko': {}, 'en': {}, 'vl': {'ko': {}, 'en': {}}}
        for read in (False, True):
            ELd = json.load(open(os.path.join(td, 'read_script_el.json'))) if read else EL
            ELL = {l['text']: l['segs'] for l in (lines_of(ELd) if read else EL['lines']) if l.get('segs')}
            for lang in ('ko', 'en'):
                en = lang == 'en'
                spec = json.load(open(os.path.join(td, ('read_' if read else 'voice_') + 'script_' + ('en' if en else 'el') + '.json')))
                base = jmap(os.path.join(td, ('read_' if read else '') + ('narration_el_en.js' if en else 'narration_el.js')))
                bmap = base.get('NARRATION_CLIPS_EN' if en else 'NARRATION_CLIPS', {}); bvl = base.get('VOICE_LINES_EN' if en else 'VOICE_LINES', {})
                def en_dir(elsegs, r, si):
                    if not elsegs: return None
                    c = elsegs[si] if si < len(elsegs) and elsegs[si][0] == r else next((x for x in elsegs if x[0] == r), None)
                    return lead(c[3]) if c and len(c) > 3 else None
                def mk(r, text, emo, dr):  # 새 클립 경로 (gen_tale.clip 과 같은 보낼 글)
                    global chars
                    M = MODELS.get(r, MODEL0); st = SET.get(r)
                    sent = dr[1:] if dr and dr.startswith('=') else (dr + ' ' + text) if dr else tagged(text, emo, M)
                    h = hashlib.md5(f'{voice}|{M}|{sent}|{json.dumps(st, sort_keys=True)}'.encode()).hexdigest()[:10]
                    rel = f'audio/el/{tale}/look/{code}/' + ('en/' if en else '') + f'{r}_{h}.mp3'
                    p = os.path.join(ROOT, rel)
                    if not os.path.exists(p):
                        chars += len(sent)
                        if dry: print('NEED', rel, '|', sent)
                        else: os.makedirs(os.path.dirname(p), exist_ok=True); tts(p, voice, sent, M, st); print('ok', rel, sent, flush=True)
                    return rel
                seen = set()
                for ln in lines_of(spec):
                    text = ln['text']
                    segs = [s + [None] * (4 - len(s)) for s in ln.get('segs') or [['nar', ln['en'] if en else text]]]
                    if en: segs = [[r, s, emo, en_dir(ELL.get(text), r, si)] for si, (r, s, emo, dr) in enumerate(segs)]
                    if not any(s[0] == role for s in segs): continue
                    if text not in bmap: print('WARN 기존 맵에 없음', tale, lang, text); continue
                    bv = bmap[text]; b = bv['c'] if isinstance(bv, dict) else bv
                    arr = [b] if isinstance(b, str) else list(b)
                    for si, (r, s, emo, dr) in enumerate(segs):
                        if r == role: arr[si] = mk(r, s, emo, dr)
                    val = arr[0] if isinstance(b, str) else arr
                    val = {'t': bv['t'], 'c': val} if isinstance(bv, dict) else val
                    if text in res[lang] and res[lang][text] != val: print('CONFLICT', tale, lang, text)
                    res[lang][text] = val
                for key, segs in (spec.get('extra') or {}).items():
                    if not any(s[0] == role for s in segs) or key not in bvl: continue
                    eld = (EL.get('extra') or {}).get(key)
                    b = bvl[key]; arr = [b] if isinstance(b, str) else list(b)
                    for si, s in enumerate(segs):
                        if s[0] == role: arr[si] = mk(role, s[1], s[2] if len(s) > 2 else None, en_dir(eld, role, si) if en else (s[3] if len(s) > 3 else None))
                    res['vl'][lang][key] = arr[0] if isinstance(b, str) else arr
        n = len(res['ko']) + len(res['en'])
        print(f'== {tale} {code} {vname}: 줄 ko {len(res["ko"])} en {len(res["en"])} 소리대사 {len(res["vl"]["ko"])}/{len(res["vl"]["en"])}')
        if dry: continue
        o = {'ko': res['ko'], 'en': res['en']}
        if res['vl']['ko'] or res['vl']['en']: o['vl'] = res['vl']
        with open(os.path.join(td, f'narration_el_look_{code}.js'), 'w') as f:
            f.write(f'/* {tale} — 자리 {slot} 아이 본인 대사의 반대 모습({look}) 녹음 맵 (tools/elevenlabs/gen_look.py 가 생성, 손으로 고치지 말 것). engine/names.js LOOK_CLIPS 가 읽는다 */\n')
            f.write(f"window.NARRATION_LOOK_CLIPS = Object.assign(window.NARRATION_LOOK_CLIPS || {{}}, {{ {code}: " + json.dumps(o, ensure_ascii=False, indent=1) + ' });\n')
print('새로 만든 클립', made, '/ 보낼 글자(새로 필요)', chars)
