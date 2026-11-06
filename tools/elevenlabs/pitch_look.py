#!/usr/bin/env python3
"""반대 모습 아이 목소리를 더 어리게: 음 높이를 반음 단위로 올리고 길이(템포)는 그대로 둔 mp3 로 제자리 교체한다(2026-11-07 사용자 결정).
  python3 tools/elevenlabs/pitch_look.py [--dry] [--backup <폴더>]
방식: ffmpeg asetrate(=샘플 속도를 r 배, 음 높이·속도 r 배) → aresample → atempo(1/r)(속도만 되돌림). 파일 이름·길이·128k mono 는 그대로.
이미 바꾼 파일은 tools/elevenlabs/look_pitch.json 에 적어 두고 다시 바꾸지 않는다(두 번 올라가지 않게). 원본은 --backup 폴더에 같은 경로로 복사한다.
이름 줄(서버 녹음)은 반대 모습 아이 목소리를 쓰지 않아(LOOK_VOICE 가 모두 None) 이 표와 상관없다. 새로 쓰게 되면 서버에서 voice_settings.speed=1/r 로 받고 같은 r 로 올려야 한다."""
import os, sys, json, subprocess, shutil, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
# 동화 → {폴더(자리+모습): 반음}. Annie(red_car Bg)는 0 이라 손대지 않는다.
SEMITONES = {
    'unicorn':     {'Ab': 3},   # Teddy
    'witch_candy': {'Ab': 3},   # Teddy
    'kkultteok':   {'Ab': 3, 'Bg': 2, 'Cg': 2},   # Mark, Emmaline, Lulu
}
MANIFEST = os.path.join(os.path.dirname(__file__), 'look_pitch.json')
dry = '--dry' in sys.argv
backup = sys.argv[sys.argv.index('--backup') + 1] if '--backup' in sys.argv else None

def bake(src, st, out):
    r = 2 ** (st / 12)
    af = f'asetrate=44100*{r:.8f},aresample=44100,atempo={1 / r:.8f}'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, '-ac', '1', '-ar', '44100', '-b:a', '128k', out], check=True)

done = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
n = 0
for tale, codes in SEMITONES.items():
    for code, st in codes.items():
        for f in sorted(glob.glob(f'{ROOT}/audio/el/{tale}/look/{code}/*.mp3') + glob.glob(f'{ROOT}/audio/el/{tale}/look/{code}/en/*.mp3')):
            rel = os.path.relpath(f, ROOT)
            if done.get(rel) == st: continue
            if rel in done: raise SystemExit(f'이미 다른 반음({done[rel]})으로 바꾼 파일: {rel}')
            n += 1
            if dry: print('바꿀 파일', rel, f'+{st}'); continue
            if backup:
                b = os.path.join(backup, rel); os.makedirs(os.path.dirname(b), exist_ok=True)
                if not os.path.exists(b): shutil.copy2(f, b)
            tmp = f + '.tmp.mp3'; bake(f, st, tmp); os.replace(tmp, f); done[rel] = st
if not dry:
    json.dump(done, open(MANIFEST, 'w'), ensure_ascii=False, indent=0, sort_keys=True)
print('바꾼 파일' if not dry else '바꿀 파일 합계', n)
