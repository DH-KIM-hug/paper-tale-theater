"""팥죽할멈 내레이션을 Typecast(ssfm-v30)로 배역별 생성 → audio/tc/*.mp3 + narration_tc.js
API 키는 ~/.config/typecast/key 에서 읽는다 (저장소에 두지 않음).
이미 만든 클립은 건너뛴다 (--redo 로 강제)."""
import json, os, re, subprocess, sys, hashlib, urllib.request, urllib.error
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KEY = open(os.path.expanduser('~/.config/typecast/key')).read().strip()
UA = 'typecast-direct/1 urllib typecast-integration/1 (source=api-docs; generated_by=claude-code)'

V = {  # 배역 → Typecast 목소리
  'nar':   'tc_600697fd8a8ea9b977284703',  # 연화 (내레이터)
  'halmi': 'tc_60ad0841061ee28740ec2e1c',  # 순이 (할멈)
  'tiger': 'tc_63a3d9d14b235ddd6541a78e',  # 학철 (호랑이)
  # 사물 친구들: 아기 같은 어린이 목소리, 친구마다 다르게
  'bam': 'tc_699d27b557c86e3f4249c051',        # 옥지
  'jara': 'tc_69c1f8e4f8842d80fbe7fa4f',       # 우니
  'ddong': 'tc_5ffda49bcba8f6d3d46fc447',      # 호빈이
  'songgot': 'tc_5ffda44bcba8f6d3d46fc41f',    # 채린이
  'jeolgu': 'tc_60db308484130840f23e6ca0',     # 하준
  'myeongseok': 'tc_6699eb5749dfac016c29445c', # 수아
  'jige': 'tc_6a98d65b0402016f616a7ac3',       # 준우
}
TIGER_Q = ['할멈, 잡아먹어야겠다!', '앗, 뜨거워! 눈이야!', '아야야!', '엉엉, 아파!']
HALMI_SAD = ['호랑이야, 동짓날에', '얘들아, 도와줘!']

def load_story():
    js = open(os.path.join(ROOT, 'story.js')).read()
    js += '\nconsole.log(JSON.stringify({FRIENDS, INTRO, PROMPTS, LINES, HELP}));'
    return json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)

def segments(text, friend=None):
    """따옴표 대사는 배역, 나머지는 내레이터."""
    out = []
    for i, part in enumerate(re.split(r'("[^"]*")', text)):
        s = part.strip()
        if not s: continue
        if s.startswith('"'):
            q = s.strip('"')
            if friend: role, emo = friend, 'smart'
            elif any(q.startswith(t) for t in TIGER_Q): role, emo = 'tiger', ('sad' if q.startswith('엉엉') else 'smart')
            elif any(q.startswith(t) for t in HALMI_SAD): role, emo = 'halmi', 'sad'
            else: role, emo = 'halmi', 'smart'
            out.append((role, q, emo))
        else:
            out.append(('nar', s, 'smart'))
    return out

def tts(path, role, text, emo, prev, nxt):
    p = {'emotion_type': 'smart'} if emo == 'smart' else {'emotion_type': 'preset', 'emotion_preset': emo, 'emotion_intensity': 1.2}
    if emo == 'smart':
        if prev: p['previous_text'] = prev
        if nxt: p['next_text'] = nxt
    body = {'voice_id': V[role], 'text': text, 'model': 'ssfm-v30', 'language': 'kor', 'prompt': p,
            'output': {'audio_format': 'mp3', 'target_lufs': -16.0, 'remove_silence_ms': 120}}
    r = urllib.request.Request('https://api.typecast.ai/v1/text-to-speech', json.dumps(body).encode(),
                               {'X-API-KEY': KEY, 'Content-Type': 'application/json', 'User-Agent': UA})
    data = urllib.request.urlopen(r, timeout=90).read()
    open(path, 'wb').write(data)

def main():
    redo = '--redo' in sys.argv
    S = load_story()
    lines = []  # (text, friendId|None)
    lines += [(t, None) for t in S['INTRO']['opening']]
    lines += [(S['INTRO']['tigerBack'], None), (S['INTRO']['help'], None)]
    for f in S['FRIENDS']:
        lines += [(f['intro'], f['id']), (f['success'], None), (f['fail'], None)]
    lines += [(t, None) for t in S['PROMPTS']]
    lines += [(t, None) for t in S['LINES'].values()]
    for h in S['HELP']: lines += [(h['where'], None), (h['who'], None)]
    clips, chars = {}, 0
    for text, fid in lines:
        segs = segments(text, fid)
        urls = []
        for i, (role, s, emo) in enumerate(segs):
            h = hashlib.md5(f'{role}|{emo}|{s}'.encode()).hexdigest()[:10]
            rel = f'audio/tc/{role}_{h}.mp3'
            path = os.path.join(ROOT, rel)
            if redo or not os.path.exists(path):
                prev = segs[i-1][1] if i else None
                nxt = segs[i+1][1] if i + 1 < len(segs) else None
                try:
                    tts(path, role, s, emo, prev, nxt); chars += len(s); print('ok', role, emo, s)
                except urllib.error.HTTPError as e:
                    print('ERR', e.code, e.read()[:200], s); continue
            urls.append(rel)
        clips[text] = urls[0] if len(urls) == 1 else urls
    with open(os.path.join(ROOT, 'narration_tc.js'), 'w') as f:
        f.write('/* Typecast 배역 내레이션 (tools/typecast/gen_patjuk.py가 생성) — 연화·순이·학철 + 사물은 어린이 목소리 */\n')
        f.write('const NARRATION_CLIPS = ' + json.dumps(clips, ensure_ascii=False, indent=1) + ';\n')
    print('새로 생성한 글자 수:', chars, '/ 줄:', len(clips))

main()
