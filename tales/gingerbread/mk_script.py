#!/usr/bin/env python3
"""진저브레드맨 대사 원본 하나 → 대사표·녹음 대본·읽어 주기 대본을 한꺼번에 만든다(2026-11-28).
  python3 tales/gingerbread/mk_script.py
만드는 파일(tales/gingerbread/):
  narration.js          한국어 대사표 GB_LINES(키 → 글), 녹음 맵 자리(NARRATION_CLIPS·VOICE_LINES, 녹음 전 비어 있음)
  narration_en.js       영어 화면 글자 NARRATION_CLIPS_EN(c: null) + TEXT_EN(장면 카드·교훈)
  voice_script_el.json  한국어 녹음 대본(ElevenLabs, gen_tale.py gingerbread --model eleven_v4)
  voice_script_en.json  영어 녹음 대본(gen_tale.py gingerbread --model eleven_v4 --lang en). 영어 글에는 한국어 연기 지시를 붙이지 않는다
  read_script_el.json / read_script_en.json   읽어 주기 대본(docs/READ_MODE.md). 동사는 gingerbread.js 의 READ 동사
  read_narration_el.js / read_narration_el_en.js   읽기 녹음 맵 자리(녹음 전 빈 맵. gen_tale.py --read 가 덮어쓴다)
녹음은 아직 없다(TTS 금지). 녹음 없는 줄은 말풍선만 읽을 만큼 보이고 넘어간다.
대사 원문: PLAN.md §4 장면표, §5-1 오답 표, §11 영어 초안(2026-11-26 확정)."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))

# 배역 목소리(audio/el/audition/choices.json 배정 원칙, 2026-11-28 제안. 녹음 전 사용자 확인)
VOICE_NAMES = {
    'nar': 'Annie',      # 여자 내레이터 순번(Lily/Huelyn/Annie). 할머니가 Huelyn 이라 해설은 Annie. 다른 크리스마스 두 편과 겹치는지 녹음 전 확인
    'man': 'Sparkles',   # 남자아이
    'granny': 'Huelyn',  # 할머니
    'grandpa': 'Namchun',  # 할아버지
    'thresha': 'Eric',   # 탈곡 a(남): 젊은 남성
    'threshb': 'Laura',  # 탈곡 b(여): 밝은 여성
    'mowa': 'Chaemong',  # 풀 베는 a(여)
    'mowb': 'Liam',      # 풀 베는 b(남)
    'cow': 'Haemi',      # 소: 낮고 느린 여성(순한 동물)
    'pig': 'Austin',     # 돼지: 굵고 빠른 남성
    'fox': 'Callum',     # 여우: 우스운 악역(여우 = Callum)
}
VID = json.load(open(os.path.join(HERE, '..', '..', 'audio', 'el', 'audition', 'choices.json')))['voice_ids']

# (키, 배역, 한국어, 영어, 감정, 모드) 모드: b = 놀이·읽기 둘 다, p = 놀이만(조작 안내·정답·오답), r = 읽기만(조작을 말로 대신한 줄)
# 배역 'chorus:thresh' = 두 사람 합창(extra 에 사람마다 따로 녹음 → mix_chorus_el.py 가 겹침)
L = [
    # 1 눈 내리는 부엌
    ('S1-1', 'nar', '눈이 펄펄 내리는 크리스마스 전날이에요. 숲가 작은 집에 할머니와 할아버지가 살았어요.', 'It is the day before Christmas, and snow is falling softly. In a little house at the edge of the woods lived a little old woman and a little old man.', None, 'b'),
    ('S1-2', 'nar', '두 사람은 사이좋게 지냈지만, 집에 아이가 없어 늘 조금 쓸쓸했어요.', 'They were happy together, but they had no little child, and that made them a little lonely.', 'tonedown', 'b'),
    ('S1-3', 'granny', '오늘은 진저브레드 아이를 하나 만들어 볼까?', 'Shall I make a little gingerbread boy today?', 'happy', 'b'),
    ('S1-4', 'grandpa', '좋지! 달콤한 생강 냄새가 집 안에 가득하겠구나.', 'Oh yes! The whole house will smell of sweet ginger.', 'happy', 'b'),
    ('S1-5', 'nar', '할머니는 반죽을 밀고, 아이 모양 틀로 꾹 찍었어요.', 'The little old woman rolled out the dough and pressed down the boy-shaped cutter.', None, 'b'),
    # 2 얼굴 꾸미기
    ('S2-1', 'granny', '눈은 건포도, 단추는 사탕, 신발은 설탕으로 해야지.', 'Raisins for the eyes, candies for the buttons, and sugar for the shoes.', 'happy', 'b'),
    ('S2-2', 'granny', '입은 할머니가 먼저. 설탕으로 활짝 웃는 입!', "I'll do the mouth first. A big sugar smile!", 'happy', 'b'),
    ('S2-A1', 'nar', '건포도 눈은 어디에 붙일까요? 위, 가운데, 아래 중에서 톡 눌러요.', 'Where do the raisin eyes go? Tap the top, the middle, or the bottom.', None, 'p'),
    ('S2-3', 'granny', '그렇지, 눈은 위에!', "That's right, eyes on top!", 'happy', 'p'),
    ('S2-A2', 'nar', '사탕 단추는 어디에 붙일까요?', 'Where do the candy buttons go?', None, 'p'),
    ('S2-4', 'granny', '맞아, 단추는 가운데!', 'Yes, buttons in the middle!', 'happy', 'p'),
    ('S2-A3', 'nar', '설탕 신발은 어디에 붙일까요?', 'Where do the sugar shoes go?', None, 'p'),
    ('S2-5', 'granny', '그래, 신발은 아래에!', 'Good, shoes at the bottom!', 'happy', 'p'),
    ('S2-W1', 'granny', '거기는 아니야. 눈은 얼굴, 위쪽이지.', 'Not there. Eyes go on the face, up at the top.', 'tonedown', 'p'),
    ('S2-W2', 'granny', '단추는 배, 가운데란다.', 'Buttons go on the tummy, in the middle.', 'tonedown', 'p'),
    ('S2-W3', 'granny', '신발은 발, 맨 아래지.', 'Shoes go on the feet, right at the bottom.', 'tonedown', 'p'),
    ('S2-R', 'nar', '할머니는 건포도 눈을 위에, 사탕 단추를 가운데, 설탕 신발을 아래에 붙였어요.', 'She put the raisin eyes on top, the candy buttons in the middle, and the sugar shoes at the bottom.', None, 'r'),
    ('S2-6', 'grandpa', '허허, 꼭 살아 있는 아이 같구나.', 'Ho ho, he looks just like a real little boy.', 'happy', 'b'),
    # 3 오븐에서 폴짝
    ('S3-1', 'nar', '할머니는 쟁반을 오븐에 넣었어요. 생강 냄새가 솔솔 퍼졌어요.', 'She slid the tray into the oven. Soon the smell of ginger filled the kitchen.', None, 'b'),
    ('S3-2', 'grandpa', '킁킁, 다 됐나 보네!', "Sniff, sniff. I think he's done!", 'happy', 'b'),
    ('S3-A', 'nar', '오븐 문을 톡 눌러 열어 봐요.', 'Tap the oven door to open it.', None, 'p'),
    ('S3-R', 'nar', '할머니가 오븐 문을 열었어요.', 'The little old woman opened the oven door.', None, 'r'),
    ('S3-3', 'nar', '덜컥! 문이 열리자마자, 진저브레드맨이 폴짝 뛰어나왔어요!', 'Clunk! The moment the door opened, out jumped the Gingerbread Man!', 'toneup', 'b'),
    ('S3-4', 'man', '안녕! 나는 진저브레드맨!', "Hello! I'm the Gingerbread Man!", 'toneup', 'b'),
    ('S3-5', 'granny', '어머나!', 'Oh my!', 'toneup', 'b'),
    ('S3-6', 'grandpa', '아이고! 저기 간다!', 'Goodness! There he goes!', 'toneup', 'b'),
    ('S3-7', 'nar', '진저브레드맨은 문밖으로 쌩 달려 나갔어요.', 'The Gingerbread Man dashed right out the door.', None, 'b'),
    # 4 할머니 할아버지 쫓아요
    ('S4-1', 'granny', '얘야, 거기 서!', 'Little boy, stop right there!', 'toneup', 'b'),
    ('S4-2', 'grandpa', '돌아오너라!', 'Come back here!', 'toneup', 'b'),
    ('S4-A', 'nar', '진저브레드맨을 톡 눌러요. 같이 외쳐 봐요!', 'Tap the Gingerbread Man. Shout it with him!', 'happy', 'p'),
    ('RUN', 'man', '달려라 달려, 날 잡아 봐! 나는 진저브레드맨!', "Run, run, as fast as you can! You can't catch me, I'm the Gingerbread Man!", 'toneup', 'b'),
    ('S4-3', 'nar', '할머니와 할아버지가 헐떡헐떡 뒤를 쫓았어요. 하지만 진저브레드맨이 훨씬 빨랐어요.', 'The little old woman and the little old man ran after him, huffing and puffing. But the Gingerbread Man was much faster.', None, 'b'),
    # 5 헛간
    ('S5-1', 'nar', '진저브레드맨은 헛간 앞을 지났어요. 사람들이 도리깨로 탁탁 곡식을 털고 있었어요.', 'He ran past a barn, where threshers were beating the grain, thump, thump.', None, 'b'),
    ('S5-2', 'chorus:thresh', '어? 진저브레드맨이다! 거기 서, 잡아라!', 'Look! A gingerbread man! Stop him, catch him!', 'toneup', 'b'),
    ('S5-3', 'man', '할머니한테서도, 할아버지한테서도 도망쳤는데, 너희한테서도 도망칠 수 있지!', "I've run away from a little old woman, and a little old man, and I can run away from you, I can!", 'happy', 'b'),
    ('S5-4', 'nar', '탈곡하는 사람들도 도리깨를 던지고 뒤를 쫓았어요. 하지만 따라잡을 수 없었어요.', 'The threshers dropped their flails and ran after him. But they could not catch him.', None, 'b'),
    # 6 들판
    ('S6-1', 'nar', '눈 덮인 들판에서는 사람들이 마른 풀을 베고 있었어요.', 'In a snowy field, mowers were cutting the dry grass.', None, 'b'),
    ('S6-2', 'chorus:mow', '저기 봐! 진저브레드맨이야! 거기 서!', 'Look there! A gingerbread man! Stop!', 'toneup', 'b'),
    ('S6-3', 'man', '할머니, 할아버지, 탈곡하는 사람들한테서도 도망쳤는데, 너희한테서도 도망칠 수 있지!', "I've run away from a little old woman, a little old man, and a barn full of threshers, and I can run away from you, I can!", 'happy', 'b'),
    ('S6-4', 'nar', '풀 베는 사람들도 낫을 내려놓고 뒤를 쫓았어요. 줄이 점점 길어졌어요.', 'The mowers put down their scythes and ran after him too. The line grew longer and longer.', None, 'b'),
    # 7 소
    ('S7-1', 'nar', '길가 울타리 안에서 소가 건초를 우물우물 먹고 있었어요.', 'By the road, a cow was munching hay behind a fence.', None, 'b'),
    ('S7-2', 'cow', '음매! 진저브레드맨, 거기 서!', 'Moo! Gingerbread Man, stop right there!', None, 'b'),
    ('S7-3', 'man', '할머니, 할아버지, 탈곡하는 사람들, 풀 베는 사람들한테서도 도망쳤는데, 너한테서도 도망칠 수 있지!', "I've run away from a little old woman, a little old man, a barn full of threshers, and a field full of mowers, and I can run away from you, I can!", 'happy', 'b'),
    ('S7-4', 'nar', '소는 느릿느릿 쫓아왔어요. 진저브레드맨은 쌩쌩 달렸어요.', 'The cow plodded along slowly. The Gingerbread Man zipped ahead.', None, 'b'),
    ('S7-A', 'nar', '누가 더 빨라요? 더 빠른 쪽을 톡 눌러요.', 'Who is faster? Tap the faster one.', None, 'p'),
    ('S7-5', 'nar', '그래요, 진저브레드맨이 훨씬 빨라요. 소는 느릿느릿.', 'Yes, the Gingerbread Man is much faster. The cow is slow, slow, slow.', 'happy', 'p'),
    ('S7-W', 'nar', '소는 느릿느릿 걸어요. 쌩쌩 달리는 쪽은 누구일까요?', 'The cow walks slowly. Who is the one zipping along?', None, 'p'),
    # 8 돼지, 긴 줄
    ('S8-1', 'nar', '돼지 우리 옆을 지날 때, 돼지가 꿀꿀 고개를 내밀었어요.', 'As he passed the pigpen, a pig poked its head over the fence. Oink!', None, 'b'),
    ('S8-2', 'pig', '꿀꿀! 진저브레드맨, 나도 잡을 거야!', "Oink, oink! Gingerbread Man, I'll catch you too!", 'toneup', 'b'),
    ('S8-3', 'man', '할머니, 할아버지, 탈곡하는 사람들, 풀 베는 사람들, 소한테서도 도망쳤는데, 너한테서도 도망칠 수 있지!', "I've run away from a little old woman, a little old man, a barn full of threshers, a field full of mowers, and a cow, and I can run away from you, I can!", 'happy', 'b'),
    ('S8-4', 'nar', '돼지도 뒤따라 달렸어요. 이제 줄이 아주 길어졌어요.', 'The pig ran after him too. Now the line was very, very long.', None, 'b'),
    ('S8-A', 'nar', '줄 맨 뒤에서 달리는 건 누구일까요? 톡 눌러요.', 'Who is running at the very back of the line? Tap them.', None, 'p'),
    ('S8-5', 'nar', '맞아요, 맨 뒤는 할머니예요. 맨 앞은 물론 진저브레드맨!', "That's right, the little old woman is at the back. And at the front, of course, the Gingerbread Man!", 'happy', 'p'),
    ('S8-W', 'nar', '그건 줄 가운데에 있어요. 맨 뒤, 끝에 있는 건 누구일까요?', 'That one is in the middle. Who is at the very back, at the end?', None, 'p'),
    ('S8-R', 'nar', '맨 앞은 진저브레드맨, 맨 뒤는 할머니였어요.', 'The Gingerbread Man was at the front, and the little old woman was at the very back.', None, 'r'),
    # 9 여우를 만나요
    ('S9-1', 'nar', '진저브레드맨은 숲가까지 달려왔어요. 나무 아래 여우가 느긋하게 누워 있었어요.', 'The Gingerbread Man ran all the way to the edge of the woods. Under a tree, a fox was lying lazily.', None, 'b'),
    ('S9-2', 'man', '어, 여우다!', 'Oh, a fox!', 'toneup', 'b'),
    ('S9-3', 'man', '할머니, 할아버지, 탈곡하는 사람들, 풀 베는 사람들, 소, 돼지한테서도 도망쳤는데, 너한테서도 도망칠 수 있지!', "I've run away from a little old woman, a little old man, a barn full of threshers, a field full of mowers, a cow, and a pig, and I can run away from you, I can!", 'happy', 'b'),
    ('S9-4', 'fox', '흐음, 세상에서 네가 가장 빠르다고?', "Hmm. So you're the fastest in the whole world?", 'tonedown', 'b'),
    ('S9-5', 'man', '그럼!', 'Of course!', 'toneup', 'b'),
    ('S9-6', 'fox', '그래? 한번 보자.', "Is that so? Let's see.", 'tonedown', 'b'),
    ('S9-7', 'nar', '여우는 천천히 일어나 기지개를 쭉 폈어요.', 'The fox got up slowly and stretched, long and lazy.', None, 'b'),
    # 10 여우가 가장 빨랐어요
    ('S10-1', 'nar', '여우가 달리기 시작했어요. 여우는 소보다, 돼지보다, 누구보다 빨랐어요!', 'Then the fox began to run. He was faster than the cow, faster than the pig, faster than anyone!', 'toneup', 'b'),
    ('S10-2', 'man', '어어?', 'Uh oh?', None, 'b'),
    ('S10-3', 'nar', '휙! 여우가 진저브레드맨 바로 앞을 가로막았어요.', 'Whoosh! The fox leaped right in front of the Gingerbread Man.', None, 'b'),
    ('S10-4', 'fox', '잡았다!', 'Got you!', 'happy', 'b'),
    ('S10-5', 'man', '어? 조금 없어졌네.', "Oh dear! I'm quarter gone!", None, 'b'),
    ('S10-6', 'man', '반이 없어졌네.', "I'm half gone!", None, 'b'),
    ('S10-7', 'man', '다 없어졌어!', "I'm all gone!", None, 'b'),
    ('S10-8', 'nar', '그 뒤로 진저브레드맨은 아무 말도 하지 않았어요.', 'And after that, the Gingerbread Man never said another word.', 'tonedown', 'b'),
    ('S10-9', 'fox', '음, 달콤한 생강 맛이구나.', 'Mmm. Sweet and gingery.', 'tonedown', 'b'),
    # 11 눈 내리는 저녁
    ('S11-1', 'nar', '여우는 배를 두드리며 숲으로 느릿느릿 사라졌어요.', 'The fox patted his tummy and strolled away into the woods.', None, 'b'),
    ('S11-2', 'nar', '뒤쫓아 온 사람들과 소, 돼지가 숲가에 멈춰 서서 헐떡였어요.', 'The people, the cow, and the pig all stopped at the edge of the woods, huffing and puffing.', None, 'b'),
    ('S11-3', 'grandpa', '하아, 하아. 참 빨랐구나.', 'Huff, puff. He sure was fast.', 'tonedown', 'b'),
    ('S11-4', 'granny', '그래도 참 예쁘게 웃는 아이였지.', "He had such a lovely smile, didn't he?", 'tonedown', 'b'),
    ('S11-5', 'nar', '눈이 소리 없이 내렸어요. 모두 천천히 집으로 돌아갔어요.', 'Snow fell quietly. Slowly, everyone went back home.', 'tonedown', 'b'),
    ('S11-6', 'nar', '작은 집 창문에 따뜻한 불이 켜졌어요.', 'In the little house, a warm light came on in the window.', 'tonedown', 'b'),
]
CHORUS = {'thresh': ['thresha', 'threshb'], 'mow': ['mowa', 'mowb']}
# 장면(PLAN §4) — 카드 글자, 세트 번호, 영어 카드
SCENES = [
    ('R01_kitchen', '눈 내리는 부엌', 'A Snowy Kitchen'),
    ('R02_decorate', '얼굴 꾸미기', 'Making His Face'),
    ('R03_oven', '오븐에서 폴짝', 'Out of the Oven'),
    ('R04_yard', '할머니 할아버지 쫓아요', 'Grandma and Grandpa Give Chase'),
    ('R05_barn', '헛간의 탈곡하는 사람들', 'The Threshers in the Barn'),
    ('R06_field', '들판의 풀 베는 사람들', 'The Mowers in the Field'),
    ('R07_cow', '소', 'The Cow'),
    ('R08_pig', '돼지, 그리고 긴 줄', 'The Pig and the Long Line'),
    ('R09_fox', '여우를 만나요', 'Meeting the Fox'),
    ('R10_caught', '여우가 가장 빨랐어요', 'The Fox Was the Fastest'),
    ('R11_evening', '눈 내리는 저녁', 'A Snowy Evening'),
]
MORAL = ('잘 달린다고 뽐내지 말아요. 나보다 빠른 이는 어디에나 있어요.', "Don't brag about running fast. There is always someone faster.")
TITLE = ('진저브레드맨', 'The Gingerbread Man')
EXTRA_EN = {  # 화면 글자만(녹음 없음): 반복 구절 효과 글자 두 줄
    '달려라 달려, 날 잡아 봐!': 'Run, run, as fast as you can!',
    '나는 진저브레드맨!': "You can't catch me, I'm the Gingerbread Man!",
    '위': 'Top', '가운데': 'Middle', '아래': 'Bottom',   # 2장 고르기 고리 옆 꼬리표
}

def scene_of(k): return int(k[1:].split('-')[0]) if k.startswith('S') else None
def main():
    seen_ko = {}
    for k, r, ko, en, emo, m in L:
        assert ko not in seen_ko, ('같은 한국어 줄이 두 번', k, seen_ko.get(ko))
        seen_ko[ko] = k
    # 장면별 순서(읽기): RUN 은 4~9장마다 한 번씩
    order = {i: [] for i in range(1, 12)}
    cur = 1
    for k, r, ko, en, emo, m in L:
        if k == 'RUN': n = cur
        else: n = scene_of(k); cur = n
        order[n].append(k)
    for n in (5, 6, 7, 8, 9):   # 누적 구절 다음 줄에 반복 구절
        o = order[n]; cum = {5: 'S5-3', 6: 'S6-3', 7: 'S7-3', 8: 'S8-3', 9: 'S9-3'}[n]
        o.insert(o.index(cum) + 1, 'RUN')
    D = {k: (r, ko, en, emo, m) for k, r, ko, en, emo, m in L}

    def segs(k, lang):
        r, ko, en, emo, m = D[k]
        t = ko if lang == 'ko' else en
        if r.startswith('chorus:'): return None
        return [[r, t, emo]]
    # ---- narration.js ----
    nl = {k: D[k][1] for k in D}
    with open(os.path.join(HERE, 'narration.js'), 'w') as f:
        f.write('/* gingerbread — 대사표(한국어). tales/gingerbread/mk_script.py 가 만든다(손으로 고치지 말 것).\n'
                '   녹음은 ElevenLabs 만(tools/elevenlabs/gen_tale.py gingerbread --model eleven_v4 → narration_el.js 가 NARRATION_CLIPS 를 채운다).\n'
                '   녹음 전에는 클립이 없어 말풍선만 읽을 만큼 띄우고 소리 없이 넘어간다(TTS 없음). 키: S<장면>-<번호>, A = 안내(T.ask), W = 오답, R = 읽어 주기 전용, RUN = 반복 구절(한 클립) */\n')
        f.write('const NARRATION_CLIPS = {};\nconst VOICE_LINES = {};\n')
        f.write('const GB_LINES = ' + json.dumps(nl, ensure_ascii=False, indent=1) + ';\n')
        f.write('const GB_TITLE = ' + json.dumps(TITLE[0], ensure_ascii=False) + ', GB_MORAL = ' + json.dumps(MORAL[0], ensure_ascii=False) + ';\n')
    # ---- narration_en.js ----
    ne = {D[k][1]: {'t': D[k][2], 'c': None} for k in D}
    te = {c: e for _, c, e in SCENES}; te[MORAL[0]] = MORAL[1]; te[TITLE[0]] = TITLE[1]; te.update(EXTRA_EN)
    with open(os.path.join(HERE, 'narration_en.js'), 'w') as f:
        f.write('/* gingerbread — 영어 모드 화면 글자(mk_script.py 가 만든다). 녹음은 narration_el_en.js(gen_tale.py gingerbread --lang en)가 NARRATION_CLIPS_EN 에 덮어쓴다.\n'
                '   녹음 전에는 c: null 이라 영어 말풍선만 소리 없이 뜬다(한국어 녹음으로 대신 틀지 않는다) */\n')
        f.write('const NARRATION_CLIPS_EN = ' + json.dumps(ne, ensure_ascii=False, indent=1) + ';\n')
        f.write('const VOICE_LINES_EN = {};\n')
        f.write('const TEXT_EN = ' + json.dumps(te, ensure_ascii=False, indent=1) + ';\n')
    # ---- voice_script_el / en ----
    voices = {r: VID[n] for r, n in VOICE_NAMES.items()}
    models = {r: 'eleven_v4' for r in voices}
    settings = {r: {'stability': .45, 'style': .45} for r in voices}
    settings['man'] = {'stability': .4, 'style': .55}; settings['fox'] = {'stability': .5, 'style': .4}; settings['nar'] = {'stability': .45, 'style': .4}
    lines_ko, lines_en, extra_ko, extra_en, chorus = [], [], {}, {}, {}
    for k, r, ko, en, emo, m in L:
        if r.startswith('chorus:'):
            who = CHORUS[r.split(':')[1]]
            ck = 'ch_' + k.replace('-', '_')
            extra_ko[ck] = [[w, ko, emo] for w in who]; extra_en[ck] = [[w, en, None] for w in who]; chorus[ck] = ko
            continue
        lines_ko.append({'key': k, 'text': ko, 'segs': segs(k, 'ko')})
        lines_en.append({'key': k, 'text': ko, 'en': en, 'segs': [[r, en, None]]})
    note = ('진저브레드맨 녹음 대본(2026-11-28 코드와 함께, mk_script.py 가 만든다). ElevenLabs 만, 모델 eleven_v4, 영어는 앱에서 0.9배. '
            '목소리(audio/el/audition/choices.json 배정 원칙): ' + ', '.join(f'{r}={n}' for r, n in VOICE_NAMES.items()) + '. '
            '반복 구절 RUN 은 한 클립을 장면 4~9 여섯 번 재사용(같은 글자 = 같은 클립). 누적 구절 5줄(S5-3, S6-3, S7-3, S8-3, S9-3)은 길이가 달라 따로 녹음. '
            '합창(S5-2 탈곡 둘, S6-2 풀 베는 둘)은 extra 에 사람마다 따로 녹음해 mix_chorus_el.py 로 겹친 뒤 chorus 의 문장 키로 NARRATION_CLIPS 에 넣는다. '
            'S10-5~7(조금, 반, 다 없어졌어)은 보통 크기로 녹음하고 화면에서 말풍선을 점점 작게 한다. 녹음 전 세 크리스마스 편 내레이터 voice_id 가 서로 다른지 확인.')
    vs = {'notes': note, 'voices': voices, 'lines': lines_ko, 'extra': extra_ko, 'chorus': chorus, 'models': models, 'settings': settings}
    json.dump(vs, open(os.path.join(HERE, 'voice_script_el.json'), 'w'), ensure_ascii=False, indent=1)
    json.dump({'notes': '진저브레드맨 영어 녹음 대본(mk_script.py). 목소리·모델은 voice_script_el.json 그대로. 영어 글에는 한국어 연기 지시를 붙이지 않는다(2026-11 재녹음 사고). 녹음 뒤 mlx_whisper 로 받아써 반복과 한국어 혼입을 검사.',
               'voices': voices, 'lines': lines_en, 'extra': extra_en}, open(os.path.join(HERE, 'voice_script_en.json'), 'w'), ensure_ascii=False, indent=1)
    # ---- read_script ----
    acts = {'set:<n>': '장면 n(1~11)을 차린다(놀이판 장면 차리기 그대로)', 'go:<키>': '놀이판에서 그 줄 앞에 일어나는 움직임·효과음을 차례로(조작은 저절로)', 'tail:<n>': '장면 n 마지막 줄 뒤 움직임(컷 포함)'}
    def read_lines(n, lang):
        out = []
        ks = [k for k in order[n] if D[k][4] in 'br']
        for i, k in enumerate(ks):
            r, ko, en, emo, m = D[k]
            ln = {'text': ko, 'src': 'new', 'key': k, 'before': [f'go:{k}']}
            if lang == 'en': ln['en'] = en
            if r.startswith('chorus:'): ln['src'] = 'chorus'; ln['segs'] = [[w, ko if lang == 'ko' else en, None] for w in CHORUS[r.split(':')[1]]]
            else: ln['segs'] = [[r, ko if lang == 'ko' else en, emo if lang == 'ko' else None]]
            if m == 'b': ln['src'] = 'reuse' if not r.startswith('chorus:') else 'chorus'
            if i == len(ks) - 1: ln['after'] = [f'tail:{n}']
            out.append(ln)
        return out
    for lang in ('ko', 'en'):
        rs = {'mode': 'read', 'tale': 'gingerbread', 'lang': lang, 'title': TITLE[0] if lang == 'ko' else TITLE[1], 'voices_from': 'voice_script_el.json',
              'moral': MORAL[0],
              'notes': '읽어 주기 대본(docs/READ_MODE.md, 2026-11-28, mk_script.py). 놀이판 11장 그대로. 조작을 뺀 자리: 2장 위치어 3회 → S2-R, 3장 오븐 톡 → S3-R, 4장 진저브레드맨 톡 → 바로 반복 구절, '
                       '7장 빠른 쪽 고르기 → 없음(S7-4 가 비교를 말함), 8장 맨 뒤 고르기 → S8-R. 정답·오답 줄은 뺐다. 반복 구절(RUN)은 한 클립, 합창(S5-2, S6-2)은 chorus_el.js 의 겹친 클립. '
                       '먹는 장면은 놀이와 같게 눈가루로 가린다(PLAN 판단 1). 녹음 없는 줄은 말풍선만 읽을 만큼 띄우고 넘어간다(gingerbread.js 가 readPlay 의 say 를 감쌈, TTS 없음).',
              'acts': acts,
              'scenes': [{'key': key, 'card': card if lang == 'ko' else en_card, 'set': str(i + 1), 'enter': [], 'lines': read_lines(i + 1, lang)}
                         for i, (key, card, en_card) in enumerate(SCENES)]}
        json.dump(rs, open(os.path.join(HERE, 'read_script_el.json' if lang == 'ko' else 'read_script_en.json'), 'w'), ensure_ascii=False, indent=1)
    for fn, name in (('read_narration_el.js', 'NARRATION_CLIPS'), ('read_narration_el_en.js', 'NARRATION_CLIPS_EN')):
        p = os.path.join(HERE, fn)
        if os.path.exists(p) and 'mk_script.py' not in open(p).read(): continue   # gen_tale.py --read 가 만든 진짜 맵은 덮지 않는다
        with open(p, 'w') as f:
            f.write(f'/* gingerbread — 읽어 주기 녹음 맵 자리(mk_script.py). 녹음 전이라 비어 있다. tools/elevenlabs/gen_tale.py gingerbread --read{" --lang en" if "en" in fn else ""} 가 덮어쓴다 */\n')
            f.write(f'Object.assign({name}, {{}});\n')
    # 코드(gingerbread.js)가 쓰는 장면별 순서도 함께
    with open(os.path.join(HERE, 'narration.js'), 'a') as f:
        f.write('/* 장면별 줄 순서(놀이: 모드 b·p, 읽기: b·r). gingerbread.js 가 장면 진행을 이 순서와 맞춰 본다 */\n')
        f.write('const GB_ORDER = ' + json.dumps({n: [[k, D[k][4]] for k in order[n]] for n in order}, ensure_ascii=False) + ';\n')
    print('줄', len(L), '읽기 줄', sum(len(read_lines(n, 'ko')) for n in order), '합창', len(chorus))
    print('글자(한국어 놀이)', sum(len(D[k][1]) for k in D if D[k][4] in 'bp'), '(읽기)', sum(len(D[k][1]) for n in order for k in order[n] if D[k][4] in 'br'))

if __name__ == '__main__': main()
