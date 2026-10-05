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

# 말풍선 없이 소리만 나는 대사: 컷신 속 호랑이 비명, 마지막 인사 (키 → [(배역, 대사, 감정, 앞 상황)])
EXTRA = {
  'cut_bam':        [('bam', '받아라, 알밤 발사!', 'toneup:1.5', '알밤이 아궁이에서 톡 튀어나와요!'), ('tiger', '에구구, 내 눈이야!', 'sad:1.7', '알밤이 튀어나와 호랑이 눈을 딱 때렸어요!')],
  'cut_jara':       [('jara', '앙! 꽉 물었다!', 'toneup:1.5', '자라가 물독에서 호랑이 입을 물어요!'), ('tiger', '아야야! 내 입! 놔라, 놔!', 'sad:1.8', '자라가 호랑이 입을 앙 물었어요!')],
  'cut_ddong':      [('ddong', '여기 미끌미끌 조심해!', 'happy:1.4', '호랑이가 뒷걸음질 치다 쇠똥을 밟아요!'), ('tiger', '으악! 미끄러워!', 'toneup:1.7', '호랑이가 쇠똥을 밟고 쭈르륵 미끄러졌어요!')],
  'cut_songgot':    [('songgot', '콕! 따끔하지?', 'happy:1.4', '송곳이 넘어진 호랑이를 찔러요!'), ('tiger', '아얏! 내 엉덩이!', 'toneup:1.7', '송곳이 호랑이 엉덩이를 콕 찔렀어요!')],
  'cut_jeolgu':     [('jeolgu', '쿵더쿵, 내려간다!', 'toneup:1.5', '절구가 문 위에서 떨어져요!'), ('tiger', '아이고, 내 머리야!', 'sad:1.8', '절구가 호랑이 머리 위로 쿵 떨어졌어요!')],
  'cut_myeongseok': [('myeongseok', '돌돌돌, 꽁꽁 말아라!', 'toneup:1.5', '멍석이 호랑이를 말아요!'), ('tiger', '으으, 못 움직이겠다! 풀어 줘!', 'sad:1.8', '멍석이 호랑이를 돌돌 말아 버렸어요!')],
  'cut_jige':       [('jige', '영차! 바다로 풍덩!', 'toneup:1.5', '지게가 멍석에 말린 호랑이를 바다에 던져요!'), ('tiger', '으아아악!', 'toneup:1.8', '호랑이가 바다에 풍덩 빠졌어요!')],
  'cut_jige_b':     [('tiger', '호랑이 살려! 다시는 안 그럴게요!', 'sad:1.9', '지게가 호랑이를 바다에 풍덩 던졌어요!')],
  'cut_wrong_1':    [('tiger', '크하하! 어림없지!', 'happy:1.5', '친구가 헛손질을 했어요. 호랑이가 비웃어요.')],
  'cut_wrong_2':    [('tiger', '헤헤, 하나도 안 아프다!', 'happy:1.4', '친구가 헛손질을 했어요. 호랑이가 놀려요.')],
  # 헛수고 컷: 친구가 머쓱해한다 (그 뒤 호랑이 비웃음 cut_wrong_1/2)
  'oops_bam':        [('bam', '어라? 호랑이가 어디 갔지?', 'toneup:1.2', None)],
  'oops_jara':       [('jara', '어? 아무것도 없네?', 'toneup:1.2', None)],
  'oops_ddong':      [('ddong', '에잉, 안 밟았잖아!', 'sad:1.2', None)],
  'oops_songgot':    [('songgot', '어라? 허공만 찔렀네!', 'toneup:1.2', None)],
  'oops_jeolgu':     [('jeolgu', '앗, 빗나갔다!', 'sad:1.2', None)],
  'oops_myeongseok': [('myeongseok', '어? 아무도 없잖아!', 'toneup:1.2', None)],
  'oops_jige':       [('jige', '끙차… 아이고, 무거워!', 'sad:1.2', None)],
  'hi_bam':        [('bam', '고마워, 할멈! 팥죽 최고!', 'happy:1.4', None)],
  'hi_jara':       [('jara', '팥죽 정말 맛있어요!', 'happy:1.4', None)],
  'hi_ddong':      [('ddong', '헤헤, 나도 신난다!', 'happy:1.4', None)],
  'hi_songgot':    [('songgot', '콕콕! 우리가 이겼다!', 'happy:1.4', None)],
  'hi_jeolgu':     [('jeolgu', '쿵더쿵! 만세!', 'happy:1.4', None)],
  'hi_myeongseok': [('myeongseok', '돌돌돌! 고마워요!', 'happy:1.4', None)],
  'hi_jige':       [('jige', '영차! 또 놀러 올게!', 'happy:1.4', None)],
  'hi_halmi':      [('halmi', '고맙다, 얘들아! 다 같이 팥죽 먹자!', 'happy:1.3', None)],
}

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

# 장면별 감정: 대사 조각(세그먼트) 글자 그대로 → 'happy' / 'sad:1.5' / 'angry:1.6' / 'whisper' / 'toneup' / 'tonedown' / 'smart'
EMO = {
  # 1막: 호랑이 등장 — 으르렁 / 할멈은 애원 / 서글픈 동짓날
  '어흥! 어느 날 커다란 호랑이가 나타났어요.': 'tonedown:1.3',
  '할멈, 잡아먹어야겠다!': 'angry:1.7',
  '호랑이야, 동짓날에 맛있는 팥죽을 쑤어 줄게. 그때까지 기다려 다오.': 'sad:1.4',
  '드디어 동짓날이 되었어요. 할멈은 팥죽을 쑤면서 훌쩍훌쩍 울었어요.': 'sad:1.1',
  '깜깜한 밤이 되었어요. 어흥! 호랑이가 어슬렁어슬렁 찾아왔어요!': 'tonedown:1.4',
  '얘들아, 도와줘!': 'sad:1.5',
  '친구들을 순서대로 눌러서 호랑이를 혼내 주세요!': 'happy:1.1',
  # 친구들: 씩씩하고 신나게
  '할멈, 팥죽 한 그릇 주면 도와줄게!': 'happy:1.3',
  '나도 팥죽 한 그릇 주면 도와줄게!': 'happy:1.3',
  '팥죽 한 그릇 주면 나도 도울게!': 'happy:1.3',
  '팥죽 한 그릇 주면 도와줄게!': 'happy:1.3',
  # 혼내 주기 성공: 내레이터는 신나게
  '알밤이 아궁이에서 톡! 튀어나와 호랑이 눈을 딱 때렸어요!': 'happy:1.3',
  '물독 속 자라가 호랑이 입을 앙! 물었어요!': 'happy:1.3',
  '호랑이가 쇠똥을 밟고 쭈르륵~ 미끄러졌어요!': 'happy:1.3',
  '송곳이 호랑이 엉덩이를 콕! 찔렀어요!': 'happy:1.3',
  '절구가 문 위에서 쿵! 호랑이 머리 위로 떨어졌어요!': 'happy:1.3',
  '멍석이 호랑이를 돌돌돌 말아 버렸어요!': 'happy:1.3',
  '지게가 호랑이를 번쩍 지고 가서 바다에 풍덩! 던져 버렸어요!': 'toneup:1.4',
  # 헛수고: 아쉽게
  '알밤이 톡 튀어나왔지만, 호랑이는 아궁이 앞에 없었어요!': 'sad:1.0',
  '자라가 물독에서 두리번두리번… 호랑이 얼굴이 없네요!': 'sad:1.0',
  '호랑이가 쇠똥을 폴짝 뛰어넘어 버렸어요!': 'sad:1.0',
  '송곳이 콕! 찔렀지만, 호랑이는 저쪽에 있네요.': 'sad:1.0',
  '절구가 쿵! 떨어졌지만 호랑이를 못 맞혔어요!': 'sad:1.0',
  '멍석이 펄럭펄럭… 아무것도 못 말았어요!': 'sad:1.0',
  '지게가 낑낑… 힘센 호랑이를 들 수가 없어요!': 'sad:1.0',
  # 할멈의 꾀: 다정한 척
  '호랑아, 팥죽 먹기 전에 아궁이 불 좀 봐주렴.': 'happy:0.9',
  # 당하는 호랑이: 아프고 쩔쩔매게
  '앗, 뜨거워! 눈이야!': 'toneup:1.7',
  '아야야!': 'sad:1.7',
  '엉엉, 아파!': 'sad:1.9',
  '미끌! 호랑이가 꽈당 넘어졌어요. 이번엔 누구일까요?': 'happy:1.2',
  '쿵! 절구에 맞은 호랑이가 마당으로 도망쳐 쭉 뻗어 버렸어요. 이제 누구 차례죠?': 'happy:1.2',
  '돌돌돌! 호랑이가 멍석에 꽁꽁 말렸어요. 마지막은 누구일까요?': 'happy:1.2',
  # 끝
  '만세! 호랑이를 물리쳤어요! 할멈은 친구들과 맛있는 팥죽을 나누어 먹었답니다.': 'happy:1.4',
  '친구들을 톡 눌러서 인사해 봐요!': 'happy:1.1',
  '알밤을 눌러 봐요!': 'happy:1.1', '자라를 눌러 봐요!': 'happy:1.1', '쇠똥을 눌러 봐요!': 'happy:1.1',
  '송곳을 눌러 봐요!': 'happy:1.1', '절구를 눌러 봐요!': 'happy:1.1', '멍석을 눌러 봐요!': 'happy:1.1',
  '지게를 눌러 봐요!': 'happy:1.1',
}

# 배역마다 감정을 하나로 고정한다 (문장마다 감정이 달라지면 같은 목소리가 다른 사람처럼 들린다)
ROLE_EMO = {'nar': 'happy:1.1', 'halmi': 'normal', 'tiger': 'angry:1.5'}
for _r in ('bam', 'jara', 'ddong', 'songgot', 'jeolgu', 'myeongseok', 'jige'): ROLE_EMO[_r] = 'happy:1.4'
def emo_of(role): return ROLE_EMO.get(role, 'happy:1.2')

def tts(path, role, text, emo, prev, nxt):
    emo = emo_of(role)
    if emo == 'smart': p = {'emotion_type': 'smart'}
    else:
        name, _, inten = emo.partition(':')
        p = {'emotion_type': 'preset', 'emotion_preset': name, 'emotion_intensity': float(inten or 1.2)}
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
            h = hashlib.md5(f'{role}|{emo_of(role)}|{s}'.encode()).hexdigest()[:10]
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
    voice = {}
    for key, segs in EXTRA.items():
        urls = []
        for role, text, emo, prev in segs:
            h = hashlib.md5(f'{role}|{emo_of(role)}|{text}'.encode()).hexdigest()[:10]
            rel = f'audio/tc/{role}_{h}.mp3'
            if redo or not os.path.exists(os.path.join(ROOT, rel)):
                try:
                    tts(os.path.join(ROOT, rel), role, text, emo, prev, None); chars += len(text); print('ok', key, text)
                except urllib.error.HTTPError as e:
                    print('ERR', e.code, e.read()[:200], text); continue
            urls.append(rel)
        voice[key] = urls[0] if len(urls) == 1 else urls
    with open(os.path.join(ROOT, 'narration_tc.js'), 'w') as f:
        f.write('/* Typecast 배역 내레이션 (tools/typecast/gen_patjuk.py가 생성) — 연화·순이·학철 + 사물은 어린이 목소리 */\n')
        f.write('const NARRATION_CLIPS = ' + json.dumps(clips, ensure_ascii=False, indent=1) + ';\n')
        f.write('/* 말풍선 없이 소리만: 컷신 호랑이 대사(cut_*), 마지막 인사(hi_*) */\n')
        f.write('const VOICE_LINES = ' + json.dumps(voice, ensure_ascii=False, indent=1) + ';\n')
    print('새로 생성한 글자 수:', chars, '/ 줄:', len(clips))

main()
