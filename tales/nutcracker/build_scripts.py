#!/usr/bin/env python3
"""호두까기 인형 대사·순서의 한 곳(2026-11-28). 여기만 고치고 다시 돌리면 아래 파일이 함께 바뀐다.
  python3 tales/nutcracker/build_scripts.py
만드는 파일(손으로 고치지 말 것):
  narration.js        한국어 대사표(NC_LINES 키 → 글), NARRATION_CLIPS·VOICE_LINES 빈 상수
  narration_en.js     영어 화면 글자(NARRATION_CLIPS_EN, c: null = 녹음 전), TEXT_EN(제목·장면 카드)
  steps.js            장면 순서(NC_SCENES): 놀이 모드가 그대로 돈다
  voice_script_el.json / voice_script_en.json   ElevenLabs 녹음 대본(tools/elevenlabs/gen_tale.py nutcracker [--lang en])
  read_script_el.json / read_script_en.json     읽어 주기 대본(engine readPlay, 녹음은 gen_tale.py nutcracker --read)
순서 문법: 'say:키' 대사 · 'ask:이름' 놀이 조작(읽어 주기는 READ_ALT 로 바뀜) · '동사:인자…' 연출(기다림) · '&동사:…' 연출(안 기다림).
녹음 전에는 클립이 없어 놀이는 말풍선만 읽을 만큼 띄우고, 읽어 주기도 글자만 보이며 끝까지 간다(TTS 없음)."""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))

# 배역 → ElevenLabs 목소리(audio/el/audition/choices.json 원칙. 녹음 전 확정 필요)
VOICE_NAME = {'nar': 'Huelyn', 'clara': 'Annie', 'fritz': 'Sparkles', 'godfather': 'Namchun', 'doll': 'Eric', 'prince': 'Eric', 'king': 'Callum', 'fairy': 'Lily'}
VOICE_ID = {'Annie': 'Lb7qkOn5hF8p7qfCDH8q', 'Sparkles': 'tapn1QwocNXk3viVSowa', 'Namchun': '5ON5Fnz24cnOozEQfGAm', 'Eric': 'cjVigY5qzO86Huf0OWal',
            'Callum': 'N2lVS1w4EtoT3dr4eOWO', 'Lily': 'pFZP5JQG7iQjIQuC4Bku', 'Huelyn': 'gnWujHp24oqX3I03lRbU'}

# 키: (배역, 감정, 한국어, 영어). 감정 태그는 gen_tale.py(happy·sad·toneup·tonedown·whisper)
L = {
 'A1': ('nar', None, '크리스마스이브예요. 초록 나무 아래서 잔치가 열렸어요.', 'It was Christmas Eve. There was a party around the green tree.'),
 'A2': ('clara', 'toneup', '대부님이 오셨어!', "Godfather's here!"),
 'A3': ('godfather', 'happy', '메리 크리스마스, 얘들아.', 'Merry Christmas, children.'),
 'B1': ('godfather', 'happy', '클라라, 이 선물은 네 거란다.', 'Clara, this present is for you.'),
 'B_ASK': ('nar', None, '선물 상자를 톡 열어 봐요.', 'Tap the present to open it.'),
 'B_READ': ('nar', None, '상자 뚜껑이 열렸어요.', 'The lid of the box opened.'),
 'B2': ('godfather', None, '호두 껍데기를 톡 깨 주는 인형이야.', 'This little doll can crack a nut for you.'),
 'B3': ('clara', 'happy', '안녕? 내 옆에 앉을래?', 'Hello! Want to sit by me?'),
 'C1': ('fritz', 'toneup', '이 큰 호두도 깰 수 있을까?', 'Can he crack this big nut, too?'),
 'C2': ('clara', 'sad', '아, 턱이 빠졌어!', 'Oh! His jaw came loose!'),
 'C3': ('fritz', 'sad', '내가 너무 세게 눌렀어. 미안해.', "I pushed too hard. I'm sorry."),
 'D1': ('clara', 'tonedown', '가만있어. 내가 턱을 감싸 줄게.', "Hold still. I'll wrap up your jaw."),
 'D_ASK': ('nar', None, '모자띠랑 같은 파란 손수건을 찾아봐요.', 'Find the blue scarf that matches his hatband.'),
 'D_OK': ('nar', 'happy', '파란색이 꼭 같네!', 'The blues match!'),
 'D_NO': ('nar', None, '이건 노란색이네. 모자띠는 파란색이야.', "That one's yellow. His hatband is blue."),
 'D_READ': ('nar', None, '클라라가 파란 손수건으로 인형의 턱을 살며시 묶었어요.', "Clara gently tied the blue scarf around the doll's jaw."),
 'D2': ('clara', 'whisper', '이제 내 옆에서 쉬어.', 'Now you can rest beside me.'),
 'D3': ('nar', 'tonedown', '인형은 바구니에, 클라라는 그 곁 의자에 포근히 누웠어요.', 'The doll lay snug in his basket. Clara curled up in the chair beside him.'),
 'E1': ('nar', 'whisper', '한밤중, 시계가 뎅 울렸어요.', 'At midnight, the clock went bong.'),
 'E2': ('clara', 'toneup', '어? 나무가 천장에 닿겠어!', 'Oh! The tree can almost touch the ceiling!'),
 'E3': ('doll', 'happy', '클라라, 나야!', "Clara, it's me!"),
 'F1': ('nar', None, '바스락. 왕관을 쓴 생쥐가 코를 내밀었어요.', 'Rustle, rustle. A mouse in a crown poked out his nose.'),
 'F2': ('king', 'toneup', '찍찍! 우리도 잔치에 왔다!', 'Squeak! We came to the party, too!'),
 'F3': ('doll', None, '병정들아, 나란히!', 'Soldiers, line up!'),
 'G1': ('clara', None, '나올 틈이 없구나. 내가 도와줄게!', "There's no room to get out! I'll help you!"),
 'G_ASK': ('nar', None, '슬리퍼를 톡 눌러 봐요.', 'Tap the slipper.'),
 'G_READ': ('nar', None, '클라라가 슬리퍼를 던졌어요. 깔개 위에 톡!', 'Clara tossed her slipper. It landed on the rug with a tap!'),
 'G2': ('king', 'toneup', '어이쿠, 집으로!', 'Whoops! Back home!'),
 'G3': ('nar', 'happy', '작은 꼬리들이 우르르, 구멍 속으로 쏙!', 'Off they went, little tails whisking into the hole!'),
 'H1': ('doll', 'happy', '클라라, 도와줘서 고마워.', 'Thank you for helping me, Clara.'),
 'H2': ('clara', 'toneup', '어머, 왕자님! 내 손수건을 맸네?', "Oh, a prince! You're wearing my scarf!"),
 'H3': ('prince', 'happy', '응, 나야. 함께 과자 나라에 갈래?', "Yes, it's me. Shall we visit the Land of Sweets?"),
 'H4': ('clara', 'happy', '좋아!', "Let's go!"),
 'I1': ('nar', None, '나뭇가지 사이로 하얀 숲길이 열렸어요.', 'A snowy path opened between the branches.'),
 'I2': ('prince', None, '내 손 잡아. 다리를 건너자.', "Take my hand. Let's cross the bridge."),
 'I_ASK': ('nar', None, '다리 위에 앉은 눈송이를 톡 눌러 봐요.', 'Tap the snowflake on the bridge.'),
 'I_OK': ('nar', 'happy', '그래, 다리 위에 앉았지!', 'Yes, it landed on the bridge!'),
 'I_NO': ('nar', None, '거기는 다리 아래야. 위를 볼까?', "That's under the bridge. Let's look up."),
 'I_READ': ('nar', None, '다리 위에 앉았던 눈송이가 사뿐 떠올랐어요.', 'The snowflake on the bridge floated up.'),
 'I3': ('clara', 'toneup', '눈송이가 내 손에 앉았어!', 'A snowflake landed on my hand!'),
 'J1': ('prince', None, '저 문 안이 과자 나라야.', 'Through that gate is the Land of Sweets.'),
 'J2': ('fairy', 'happy', '어서 와! 너희를 위한 춤이야.', 'Welcome! This dance is for you.'),
 'J3': ('clara', 'happy', '빙글, 빙글. 꽃도 춤을 추네!', 'Round and round. The flowers are dancing, too!'),
 'J4': ('nar', 'tonedown', '마지막 꽃잎이 살며시 접혔어요.', 'The last petal gently folded up.'),
 'K1': ('nar', None, '창으로 아침 햇살이 들어왔어요. 클라라가 눈을 떴어요.', 'Morning light came through the window. Clara opened her eyes.'),
 'K2': ('clara', 'tonedown', '여기 있었구나. 좋은 아침, 호두까기 인형아.', 'There you are. Good morning, Nutcracker.'),
}
PLAY_ONLY = {'B_ASK', 'D_ASK', 'D_OK', 'D_NO', 'G_ASK', 'I_ASK', 'I_OK', 'I_NO'}
READ_ONLY = {'B_READ', 'D_READ', 'G_READ', 'I_READ'}

TITLE = ('호두까기 인형', 'The Nutcracker')
MORAL = ('친구가 곤란할 때 곁에서 도와줄 수 있어요.', 'When a friend is in trouble, we can help.')

# 장면: (번호, 한국어 카드, 영어 카드, 순서)
SC = [
 (1, '이브의 문소리', 'A Knock on Christmas Eve', [
   '&bgm:march_light', 'say:A1', '&sfx:door_knock', 'wait:700', 'look:fritz:nudge:left', 'door_open', 'look:clara:wave', '&hop:clara',
   'say:A2', '&bgm:dip:5', 'look:godfather:nod', 'say:A3', 'look:fritz:wait:right', 'wait:600']),
 (2, '상자 안의 친구', 'A Friend in the Box', [
   'look:godfather:offer', 'box_down', 'look:clara:receive', 'say:B1', 'look:godfather:pause', 'look:fritz:peek',
   'ask:box', 'look:godfather:point', 'say:B2', 'look:clara:laugh', '&hop:clara', 'say:B3', 'look:godfather:smile', 'wait:900']),
 (3, '너무 큰 호두', 'A Nut Too Big', [
   '&bgm:reedflutes', 'say:C1', 'stand_turn', 'look:fritz:press', 'nut_press', '&bgm:off:0.4', 'jaw_crack', 'look:clara:worry', 'say:C2',
   'look:fritz:sorry', 'say:C3', '&bgm:reedflutes', 'wait:700']),
 (4, '파란 손수건', 'The Blue Scarf', [
   '&bgm:waltz_box', 'look:fritz:listen', 'look:clara:tie', 'say:D1', 'ask:cloth', 'cut:nc_cut_knot:3000', 'to_chair', 'say:D2',
   '&bgm:off:4', 'basket_tuck', 'clara_sit', 'say:D3', 'look:clara:doze', 'wait:1200']),
 (5, '한밤의 눈짓', 'A Midnight Wink', [
   'sfx:clock_bong', 'wait:500', 'look:clara:listen', 'say:E1', '&bgm:sugarplum_night', 'tree_grow', 'look:clara:amaze', 'say:E2',
   'pan:basket', 'doll_rise', 'say:E3', 'pan:home', 'look:clara:turn', 'wait:700']),
 (6, '마루의 작은 행진', 'A Little March', [
   'king_peek', 'say:F1', 'mice_peek', 'look:king:call', '&hop:king', 'say:F2', 'pan:home', 'look:doll:lead', 'say:F3', '&bgm:march_parade', 'march',
   'look:king:beckon', 'look:grey:ear', 'look:brown:sniff', '&sfx:mouse_pizz', 'wait:600', 'mice_gather', 'look:doll:brace', 'pan:home', 'wait:700']),
 (7, '슬리퍼가 톡', 'Tap Goes the Slipper', [
   '&bgm:reedflutes', 'look:clara:toss', 'slipper_show', 'say:G1', '&bgm:off:0.6', 'ask:slipper', 'cut:nc_cut_slipper:2000', 'look:king:turn', 'say:G2',
   '&bgm:reedflutes', 'mice_out', 'say:G3', 'look:doll:relax', 'pan:home', 'wait:700']),
 (8, '매듭을 맨 왕자', 'The Prince with the Knot', [
   '&bgm:waltz_box', 'slipper_on', 'look:doll:thanks', 'say:H1', 'transform', 'cut:nc_cut_prince:3000', 'look:clara:meet', 'say:H2',
   '&bgm:off:0.6', 'look:prince:knot', '&sfx:warm_chord', 'say:H3', '&bgm:waltz_box', 'look:prince:invite', 'say:H4', '&hop:clara', 'wait:700']),
 (9, '눈송이 숲의 다리', 'The Snowy Bridge', [
   '&bgm:waltz_snow', 'say:I1', 'look:prince:guide', 'look:clara:reach', 'say:I2', 'ask:flake', 'say:I3', 'cross', 'wait:500']),
 (10, '꽃이 피는 과자 나라', 'The Land of Sweets', [
   '&bgm:waltz_main', 'look:prince:gate', 'say:J1', 'gate_open', 'look:fairy:curtsy', 'look:prince:guest', 'say:J2', '&bgm:next:sugarplum',
   'look:fairy:bud', 'wait:600', 'bloom', 'look:clara:clap', 'look:prince:listen', 'look:fairy:listen', 'say:J3', 'cut:nc_cut_garden:4000',
   'look:fairy:finish', 'look:prince:petal', 'petal_fold', 'say:J4', 'wait:700']),
 (11, '좋은 아침', 'Good Morning', [
   '&sfx:morning_birds', '&bgm:waltz_morning', 'say:K1', 'lift_doll', 'say:K2', 'wait:1800', 'bgm:off:2.5']),
]
# 놀이 조작 → 읽어 주기에서 대신하는 순서(조작은 엔진이 하지 않고 연출만, 그 뒤 이야기꾼 한 줄)
READ_ALT = {
 'box': ['box_open', 'say:B_READ'],
 'cloth': ['cloth_show', 'tie', 'say:D_READ'],
 'slipper': ['slipper_toss', 'say:G_READ'],
 'flake': ['flake_up', 'say:I_READ'],
}


def js_str(o): return json.dumps(o, ensure_ascii=False, indent=1)


def main():
    head = '/* nutcracker — %s (build_scripts.py 가 만든다, 손으로 고치지 말 것) */\n'
    # 한국어 대사표
    ko = {k: v[2] for k, v in L.items()}
    open(os.path.join(D, 'narration.js'), 'w').write(head % '대사표(한국어). 녹음은 ElevenLabs 만(tools/elevenlabs/gen_tale.py nutcracker → narration_el.js 가 NARRATION_CLIPS 를 채운다). 녹음 전에는 말풍선만, 소리 없이 넘어간다(TTS 없음)'
        + 'const NARRATION_CLIPS = {};\nconst VOICE_LINES = {};\nconst NC_LINES = ' + js_str(ko) + ';\n')
    # 영어 화면 글자
    en = {v[2]: {'t': v[3], 'c': None} for v in L.values()}
    text_en = {TITLE[0]: TITLE[1], MORAL[0]: MORAL[1]}
    for n, ck, ce, _ in SC: text_en[ck] = ce
    open(os.path.join(D, 'narration_en.js'), 'w').write(head % '영어 모드 화면 글자. 영어 녹음은 narration_el_en.js(gen_tale.py nutcracker --lang en)가 덮어쓴다. c: null = 녹음 전(영어 말풍선만, 한국어 소리로 대신하지 않음)'
        + 'const NARRATION_CLIPS_EN = ' + js_str(en) + ';\nconst VOICE_LINES_EN = {};\nconst TEXT_EN = ' + js_str(text_en) + ';\n')
    # 장면 순서
    scenes = [{'n': n, 'card': ck, 'steps': st} for n, ck, ce, st in SC]
    open(os.path.join(D, 'steps.js'), 'w').write(head % '장면 순서(놀이 모드). 읽어 주기 대본은 같은 순서에서 read_script_*.json 으로 나온다'
        + 'const NC_SCENES = ' + json.dumps(scenes, ensure_ascii=False) + ';\nconst NC_READ_ALT = ' + json.dumps(READ_ALT, ensure_ascii=False) + ';\n')
    # 녹음 대본
    voices = {r: VOICE_ID[VOICE_NAME[r]] for r in VOICE_NAME}
    used = [k for k in L]
    vs_el = {'notes': '호두까기 인형 녹음 대본(2026-11-28 코드와 함께, build_scripts.py 가 만든다). ElevenLabs 만, 아직 녹음 전. 배역 목소리(audio/el/audition/choices.json 원칙): '
                      'nar=Huelyn(요정 Lily·여자아이 Annie 와 겹치지 않는 해설), clara=Annie(여자아이), fritz=Sparkles(남자아이), godfather=Namchun(할아버지), '
                      'doll·prince=Eric(젊은 남성, 인형과 왕자는 한 배역 한 목소리 PLAN §3), king=Callum(우스운 악역, 통통 튀는 중저음), fairy=Lily(요정). '
                      '크리스마스 다른 세 편(gb_·es_·nb_)의 내레이터와 voice_id 가 겹치지 않는지 녹음 전에 확인. 영어는 앱에서 0.9배로 들어 본다.',
             'voices': voices, 'voice_names': VOICE_NAME,
             'lines': [{'key': k, 'text': L[k][2], 'segs': [[L[k][0], L[k][2], L[k][1]]]} for k in used if k not in READ_ONLY],
             'models': {r: 'eleven_v4' for r in voices}, 'settings': {r: {} for r in voices}}
    json.dump(vs_el, open(os.path.join(D, 'voice_script_el.json'), 'w'), ensure_ascii=False, indent=1)
    vs_en = {'notes': '영어 녹음 대본. text = 한국어 열쇠(NARRATION_CLIPS_EN 키), segs 의 글은 영어만(한글·연기 지시 넣지 않음, 2026-11-25 오류). 목소리는 voice_script_el.json 과 같다.',
             'voices': voices,
             'lines': [{'key': k, 'text': L[k][2], 'en': L[k][3], 'segs': [[L[k][0], L[k][3], L[k][1]]]} for k in used if k not in READ_ONLY]}
    for l in vs_en['lines']: assert not re.search('[가-힣]', l['segs'][0][1]), l
    json.dump(vs_en, open(os.path.join(D, 'voice_script_en.json'), 'w'), ensure_ascii=False, indent=1)
    # 읽어 주기 대본: 같은 순서, ask 는 READ_ALT, 놀이 전용 줄 없음. 동사 → before/after
    for lang in ('el', 'en'):
        out = []
        for n, ck, ce, st in SC:
            seq = []
            for s in st:
                if s.startswith('ask:'): seq += READ_ALT[s[4:]]
                else: seq.append(s)
            lines, pend = [], []
            for s in seq:
                if s.startswith('say:'):
                    k = s[4:]; assert k not in PLAY_ONLY, k
                    r, emo, tko, ten = L[k]
                    ln = {'text': tko, 'segs': [[r, ten if lang == 'en' else tko, emo]], 'from': k, 'before': pend, 'after': []}
                    if lang == 'en': ln['en'] = ten
                    lines.append(ln); pend = []
                else: pend.append(s)
            if pend: lines[-1]['after'] = pend
            out.append({'key': f'R{n:02d}', 'card': ce if lang == 'en' else ck, 'set': str(n), 'enter': [], 'lines': lines})
        rs = {'mode': 'read', 'tale': 'nutcracker', 'lang': 'en' if lang == 'en' else 'ko', 'title': TITLE[1] if lang == 'en' else TITLE[0],
              'voices_from': 'voice_script_el.json', 'moral': MORAL[0],
              'notes': '읽어 주기 대본(build_scripts.py 가 만든다). 놀이판 11장과 같은 순서·자세·컷. 조작 네 자리(2 상자, 4 손수건, 7 슬리퍼, 9 눈송이)는 연출을 저절로 하고 이야기꾼 한 줄(B_READ·D_READ·G_READ·I_READ)로 대신한다. 안내·정답·오답 줄은 없다.',
              'scenes': out}
        json.dump(rs, open(os.path.join(D, f'read_script_{lang}.json'), 'w'), ensure_ascii=False, indent=1)
    n_lines = sum(1 for k in L)
    print('줄', n_lines, '(놀이 전용', len(PLAY_ONLY), ', 읽기 전용', len(READ_ONLY), ')', '장면', len(SC))


if __name__ == '__main__':
    main()
