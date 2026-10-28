"""보상 말(퍼즐 조각·스티커·종이별)을 홈과 같은 Lily 목소리로 신나게 녹음해 home_narration_el.js 에 더한다(2026-10-29: 브라우저 TTS로 읽히던 것)."""
import json, os, sys, hashlib, subprocess
ROOT = '/Users/house_of_4k2b/projects/2026/patjuk-game'
src = open(f'{ROOT}/tools/elevenlabs/gen_home.py').read().split('\ndef main')[0]
g = {'__file__': ROOT + '/tools/elevenlabs/gen_home.py'}; exec(src, g)
out = subprocess.check_output(['node', '-e', f"eval(require('fs').readFileSync('{ROOT}/home_narration_el.js','utf8')+';globalThis.A=NARRATION_CLIPS;globalThis.B=NARRATION_CLIPS_EN');console.log(JSON.stringify([A,B]))"]).decode()
K, E = json.loads(out)
YAY = '[excited, delighted, bright, cheering] '
jobs = [('퍼즐 조각을 받았어요!', 'You got a puzzle piece!', YAY), ('그림이 완성됐어요!', 'The picture is complete!', '[thrilled, amazed, cheering] '),
        ('새 친구 스티커!', 'A new friend sticker!', '[excited, giggly, delighted] '), ('스티커를 받았어요!', 'You got a sticker!', YAY),
        ('종이별 하나 받았어요!', 'You got a Paper Star!', YAY), ('다섯 개! 동화를 하나 열 수 있어요', 'Five stars! You can open a tale.', '[thrilled, amazed, cheering] ')]
def clip(text, lang, tag):
    sent = tag + text
    h = hashlib.md5(f"{g['VOICE']}|{g['MODEL']}|{sent}|{g['SET']}".encode()).hexdigest()[:10]
    return f'audio/el/home/{"en/" if lang == "en" else ""}nar_{h}.mp3', sent
for ko, en, tag in jobs:
    for text, lang in ((ko, 'ko'), (en, 'en')):
        rel, sent = clip(text, lang, tag)
        if not os.path.exists(f'{ROOT}/{rel}'): g['tts'](f'{ROOT}/{rel}', g['VOICE'], sent, g['MODEL'], g['SET']); print('녹음', text, rel, flush=True)
    K[ko] = clip(ko, 'ko', tag)[0]; E[en] = {'t': en, 'c': clip(en, 'en', tag)[0]}
with open(f'{ROOT}/home_narration_el.js', 'w') as f:
    f.write('/* 홈 화면 문구 내레이션 — ElevenLabs (tools/elevenlabs/gen_home.py 가 생성, 손으로 고치지 말 것) */\n')
    f.write('const NARRATION_CLIPS = ' + json.dumps(K, ensure_ascii=False, indent=1) + ';\n')
    f.write('const NARRATION_CLIPS_EN = ' + json.dumps(E, ensure_ascii=False, indent=1) + ';\n')
print('저장', len(K), len(E))
