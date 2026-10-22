"""홈 화면에서 읽는 문구(태그 칩, 동화 제목, 안내)를 ElevenLabs 한 목소리로 만든다.
  python3 tools/elevenlabs/gen_home.py [--dry]
  → audio/el/home/*.mp3 (한국어), audio/el/home/en/*.mp3 (영어), home_narration_el.js
홈은 narration_tc.js 를 부르지 않으므로 출력 js 가 NARRATION_CLIPS / NARRATION_CLIPS_EN 를 직접 선언한다.
영어 키도 한국어 문구(home.js 가 넘기는 글)다. 값은 {t: 영어 글, c: 클립}.
모델 eleven_v4, 목소리 Lily. 있는 클립은 건너뛴다. API 키는 ~/.config/elevenlabs/key (출력하지 않음)."""
import json, os, re, sys, time, hashlib, subprocess, urllib.request, urllib.error
KEY = open(os.path.expanduser('~/.config/elevenlabs/key')).read().strip()
def tts(path, voice, text, model, settings):  # gen_tale.py 의 tts 와 같다 (gen_tale 은 import 하면 바로 실행돼서 복사)
    body = {'text': text, 'model_id': model, 'voice_settings': {'stability': 0.5, 'similarity_boost': 0.75, 'style': 0.3, **settings}}
    for attempt in range(6):
        r = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', json.dumps(body).encode(), {'xi-api-key': KEY, 'Content-Type': 'application/json'})
        try:
            data = urllib.request.urlopen(r, timeout=120).read(); open(path, 'wb').write(data); return
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and attempt < 5: time.sleep(3 * (attempt + 1)); continue
            raise
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL = 'eleven_v4'
VOICE = 'pFZP5JQG7iQjIQuC4Bku'  # Lily
SET = {'stability': 0.45, 'style': 0.35}
TAG = '[cheerful, clear, warm] '
SOON = lambda t: f'{t}. 곧 열려요.'
TAGS = {  # 한국어 say → 영어
  '이솝 우화': "Aesop's fables", '한국 전래동화': 'Korean folktales', '외국 전래동화': 'World folktales',
  '창작 동화': 'Original tales', '공주 동화': 'Princess tales',
  '수 세기': 'Counting', '크기 비교': 'Comparing sizes', '순서': 'Order', '분류하기': 'Sorting',
  '관찰하고 차이 찾기': 'Spot the difference', '소리 듣기': 'Listening to sounds', '모양 맞추기': 'Matching shapes',
  '날씨와 계절': 'Weather and seasons', '마음과 배려': 'Heart and kindness', '위치말': 'Position words',
  '이야기 전체': 'All tales', '배우는 것 전체': 'All skills', '모든 동화가 열렸어요!': 'All tales are unlocked!', '자동 재생': 'Auto play',
}

ALIAS = {'콩쥐팥쥐': 'Kongjwi and Patjwi'}

def tales():
    js = open(os.path.join(ROOT, 'tales/catalog.js')).read() + '\nconsole.log(JSON.stringify(TALES.map(t=>({title:t.title,en:t.en&&t.en.title}))))'
    open('/tmp/_cat.js', 'w').write('const document={},window={},localStorage={getItem(){return null}};\n' + js)
    return json.loads(subprocess.check_output(['node', '/tmp/_cat.js']).decode().strip().splitlines()[-1])

def main():
    dry = '--dry' in sys.argv
    items = dict((k, v) for k, v in TAGS.items())
    for t in tales():
        items[t['title']] = t['en']; items[SOON(t['title'])] = f"{t['en']}. Opening soon."
    items.update(ALIAS)  # 동화 시작 화면 제목이 카탈로그와 다르게 적힌 것
    clips, clips_en, chars = {}, {}, 0
    for ko, en in items.items():
        for lang, text in (('ko', ko), ('en', en)):
            sent = TAG + text
            h = hashlib.md5(f'{VOICE}|{MODEL}|{sent}|{SET}'.encode()).hexdigest()[:10]
            rel = f'audio/el/home/{"en/" if lang == "en" else ""}nar_{h}.mp3'
            path = os.path.join(ROOT, rel); os.makedirs(os.path.dirname(path), exist_ok=True)
            if not os.path.exists(path):
                chars += len(sent)
                if dry: print('NEED', text); 
                else:
                    try: tts(path, VOICE, sent, MODEL, SET); print('ok', text, flush=True)
                    except urllib.error.HTTPError as e: print('ERR', e.code, text); continue
            if lang == 'ko': clips[ko] = rel
            else: clips_en[ko] = {'t': en, 'c': rel}
    print('새로 보낸 글자 수:', chars, '/ 클립', len(clips), len(clips_en))
    if dry: return
    with open(os.path.join(ROOT, 'home_narration_el.js'), 'w') as f:
        f.write('/* 홈 화면 문구 내레이션 — ElevenLabs (tools/elevenlabs/gen_home.py 가 생성, 손으로 고치지 말 것) */\n')
        f.write('const NARRATION_CLIPS = ' + json.dumps(clips, ensure_ascii=False, indent=1) + ';\n')
        f.write('const NARRATION_CLIPS_EN = ' + json.dumps(clips_en, ensure_ascii=False, indent=1) + ';\n')
main()
