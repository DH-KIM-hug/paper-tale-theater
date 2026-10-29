"""탭 이름 '읽어 주기'를 다른 탭('동화 놀이' [bright, playful])과 같은 말투로 다시 녹음(2026-10-30 사용자: 두 번 말함·말투가 이질적).
옛 클립은 [soft, calm, sleepy] 로 녹음돼 차분했고, 한국어 클립은 말이 두 번 들어가 2.9초였다. 길이가 1.9초를 넘으면(겹침) 태그 순서를 바꿔 다시 받는다."""
import json, os, hashlib, subprocess
ROOT = '/Users/house_of_4k2b/projects/2026/patjuk-game'
src = open(f'{ROOT}/tools/elevenlabs/gen_home.py').read().split('\ndef main')[0]
g = {'__file__': ROOT + '/tools/elevenlabs/gen_home.py'}; exec(src, g)
out = subprocess.check_output(['node', '-e', f"eval(require('fs').readFileSync('{ROOT}/home_narration_el.js','utf8')+';globalThis.A=NARRATION_CLIPS;globalThis.B=NARRATION_CLIPS_EN');console.log(JSON.stringify([A,B]))"]).decode()
K, E = json.loads(out)
def dur(p): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).decode())
def rec(text, lang):
    for tag in ['[bright, playful] ', '[playful, bright] ', '[bright, playful, clear] ']:
        sent = tag + text
        h = hashlib.md5(f"{g['VOICE']}|{g['MODEL']}|{sent}|{g['SET']}".encode()).hexdigest()[:10]
        rel = f'audio/el/home/{"en/" if lang == "en" else ""}nar_{h}.mp3'
        if not os.path.exists(f'{ROOT}/{rel}'): g['tts'](f'{ROOT}/{rel}', g['VOICE'], sent, g['MODEL'], g['SET'])
        d = dur(f'{ROOT}/{rel}'); print(text, tag, rel, round(d, 2), flush=True)
        if d <= 1.9: return rel
        os.remove(f'{ROOT}/{rel}')
    raise SystemExit('겹침이 계속됨: ' + text)
K['읽어 주기'] = rec('읽어 주기', 'ko')
E['Read to Me'] = {'t': 'Read to Me', 'c': rec('Read to Me', 'en')}
with open(f'{ROOT}/home_narration_el.js', 'w') as f:
    f.write('/* 홈 화면 문구 내레이션 — ElevenLabs (tools/elevenlabs/gen_home.py 가 생성, 손으로 고치지 말 것) */\n')
    f.write('const NARRATION_CLIPS = ' + json.dumps(K, ensure_ascii=False, indent=1) + ';\n')
    f.write('const NARRATION_CLIPS_EN = ' + json.dumps(E, ensure_ascii=False, indent=1) + ';\n')
print('저장')
