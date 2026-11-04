#!/usr/bin/env python3
"""앱 묶음(www/audio/el, www/audio/tc)의 녹음을 말소리용 64kbps 모노 mp3 로 다시 압축한다 (2026-11-02 출시 점검: 앱 크기 줄이기).
ElevenLabs 영어 녹음(el/…/en/)은 이때 0.9배로 미리 늘린다(음 높이 유지, ffmpeg atempo). 앱의 audio.js 는 EN_PRESLOWED = true 라서 재생할 때 다시 늘리지 않는다.
원본(audio/)은 그대로 두고 www 안의 사본만 바꾼다. 한 번 압축한 결과는 ~/.paper-tale/cache/audio64 에 두고 다음 빌드에서 다시 쓴다.
  python3 tools/app/shrink_audio.py www/audio"""
import os, sys, hashlib, shutil, subprocess
from concurrent.futures import ThreadPoolExecutor
root = sys.argv[1]
CACHE = os.path.expanduser('~/.paper-tale/cache/audio64')
BR = 64  # kbps
def bitrate(p):
    r = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=bit_rate', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout.strip()
    return int(r) // 1000 if r.isdigit() else 0
def one(p):
    st = os.stat(p)
    rel = os.path.relpath(p, root)
    slow = rel.startswith('el/') and '/en/' in rel   # audio.js slowEn 과 같은 기준
    key = hashlib.sha1(f'{rel}|{st.st_size}|{BR}|{"p09" if slow else ""}'.encode()).hexdigest()
    c = os.path.join(CACHE, key[:2], key + '.mp3')
    if not os.path.exists(c):
        if not slow and bitrate(p) <= BR + 8: return 0   # 이미 작다
        os.makedirs(os.path.dirname(c), exist_ok=True)
        tmp = c + '.tmp.mp3'
        r = subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-i', p] + (['-af', 'atempo=0.9'] if slow else []) + ['-ac', '1', '-ar', '44100', '-b:a', f'{BR}k', tmp])
        if r.returncode or not os.path.exists(tmp):
            if slow: raise RuntimeError(f'영어 0.9배 늘리기 실패: {rel}')   # 앱은 EN_PRESLOWED = true 라 이 클립만 빠르게 나온다 → 빌드를 멈춘다 (2026-11-04 코드 검토)
            return 0
        os.replace(tmp, c)
    if slow or os.path.getsize(c) < st.st_size: shutil.copyfile(c, p); return st.st_size - os.path.getsize(c)
    return 0
files = [os.path.join(d, f) for sub in ('el', 'tc') for d, _, fs in os.walk(os.path.join(root, sub)) for f in fs if f.endswith('.mp3')]
with ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex: saved = sum(ex.map(one, files))
print(f'녹음 {len(files)}개 다시 압축: {saved / 1e6:.0f}MB 줄임')
