#!/usr/bin/env python3
"""ElevenLabs 녹음 다듬기(2026-11-01 사용자: '화장실 녹음 같은 느낌' → 후처리부터).
낮은 웅웅거림 자르기 → 잡음 살짝 → 울림이 뭉치는 250Hz 줄이기 → 또렷한 3.2kHz 살리기 → 가벼운 압축 → 음량 -16 LUFS 로 맞추기(봉우리 -1.5dB).
짧은 클립은 loudnorm 한 번으로는 목표에 못 미쳐서, 먼저 다듬고 → 실제 음량을 재고 → 모자란 만큼 올린 뒤 리미터로 봉우리를 막는다.
다듬은 파일은 polished.json(경로→다듬은 뒤 크기)에 적어 두고 다시 다듬지 않는다.
  python3 tools/elevenlabs/polish.py                  # audio/el 전체(새 파일만)
  python3 tools/elevenlabs/polish.py audio/el/red_hen  # 폴더만
  from polish import polish; polish(path)             # 녹음 도구가 저장 직후 부른다"""
import fcntl, json, os, re, subprocess, sys, tempfile
from concurrent.futures import ProcessPoolExecutor

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
LOG = os.path.join(ROOT, 'audio', 'el', 'polished.json')
CHAIN = ('highpass=f=85,afftdn=nf=-30:nr=8,equalizer=f=250:t=q:w=1.2:g=-2.5,'
         'equalizer=f=3200:t=q:w=1.0:g=2,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2')
TARGET = -16.0

def _ff(*a): return subprocess.run(['ffmpeg', '-hide_banner', '-nostdin', '-y', *a], capture_output=True, text=True)

def _lufs(path):
    m = re.findall(r'^\s+I:\s+(-?[\d.]+) LUFS', _ff('-i', path, '-af', 'ebur128', '-f', 'null', '-').stderr, re.M)
    return float(m[-1]) if m else None

def polish(path, log=True):
    """한 파일을 제자리에서 다듬는다. 실패하면 원본을 그대로 둔다. log=True 면 polished.json 에 적어 전체 돌리기에서 다시 다듬지 않게 한다."""
    with tempfile.TemporaryDirectory() as td:
        mid, out = os.path.join(td, 'm.wav'), os.path.join(td, 'o.mp3')
        if _ff('-i', path, '-af', CHAIN, '-ac', '1', '-ar', '44100', mid).returncode: return False
        lu = _lufs(mid)
        gain = 0 if lu is None or lu < -70 else max(-12, min(18, TARGET - lu))  # 거의 무음이면 올리지 않는다
        if _ff('-i', mid, '-af', f'volume={gain:.2f}dB,alimiter=limit=0.84:level=false', '-ac', '1', '-ar', '44100', '-b:a', '128k', out).returncode: return False
        os.replace(out, path)
    if log:   # gen_tale.py 를 여러 개 동시에 돌려도 기록이 빠지거나 반쯤 쓴 파일을 읽지 않게: 잠그고 임시 파일에 쓴 뒤 바꿔 넣는다 (2026-11-04 코드 검토)
        with open(LOG + '.lock', 'w') as lk:
            fcntl.flock(lk, fcntl.LOCK_EX)
            done = json.load(open(LOG)) if os.path.exists(LOG) else {}
            done[os.path.relpath(os.path.abspath(path), ROOT)] = os.path.getsize(path)
            tmp = LOG + '.tmp'
            with open(tmp, 'w') as f: json.dump(done, f, ensure_ascii=False, indent=0, sort_keys=True)
            os.replace(tmp, LOG)
    return True

def _job(p):
    ok = polish(p, log=False)
    return p, ok, os.path.getsize(p)

def main():
    base = os.path.join(ROOT, sys.argv[1]) if len(sys.argv) > 1 else os.path.join(ROOT, 'audio', 'el')
    done = json.load(open(LOG)) if os.path.exists(LOG) else {}
    todo = []
    for d, _, fs in os.walk(base):
        for f in fs:
            if not f.endswith('.mp3'): continue
            p = os.path.join(d, f); k = os.path.relpath(p, ROOT)
            if done.get(k) != os.path.getsize(p): todo.append(p)  # 크기가 다르면 새로 녹음된 것
    print(f'다듬을 파일 {len(todo)}개', flush=True)
    fail = 0
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as ex:
        for i, (p, ok, size) in enumerate(ex.map(_job, todo, chunksize=8), 1):
            if ok: done[os.path.relpath(p, ROOT)] = size
            else: fail += 1; print('실패', p, flush=True)
            if i % 500 == 0:
                print(f'{i}/{len(todo)}', flush=True); json.dump(done, open(LOG, 'w'), ensure_ascii=False, indent=0, sort_keys=True)
    json.dump(done, open(LOG, 'w'), ensure_ascii=False, indent=0, sort_keys=True)
    print(f'끝: {len(todo) - fail}개 다듬음, 실패 {fail}', flush=True)

if __name__ == '__main__':
    main()
