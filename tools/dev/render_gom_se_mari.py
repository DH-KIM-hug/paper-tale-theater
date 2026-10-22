#!/usr/bin/env python3
"""〈곰 세 마리〉 실로폰 연주를 mp3 한 파일로 미리 렌더하고, 음 시작 시각 표를 출력한다.
사용:
  python3 render_gom_se_mari.py <note_xylo.mp3> <out.mp3>                 실로폰(C5 한 음 샘플을 rate 로 옮김)
  python3 render_gom_se_mari.py --clips <폴더> <out.mp3> [--bass 1|0] [--echo 0.18] [--gain 2.4] [--norm 1]
      폴더 안의 단음 wav 이름은 음 이름(C4.wav, G3.wav, C5.wav ...). 필요한 음에 가장 가까운 클립을 쓰고 모자란 만큼만 rate 로 옮긴다.
      --norm 1 이면 loudnorm(-20 LUFS) 후 리미터. 박자(ONS 표)는 악기와 상관없이 같다.
멜로디는 goldilocks.js 의 LINES 와 같다. 구절 끝은 늘리고, 구절 사이 숨을 쉬고, 박마다 셈여림을 준다."""
import subprocess, sys, json
LINES = [   # 악보(4/4, 12마디) 그대로. 도' = 한 옥타브 위 도
 '도:1 도:.5 도:.5 도:1 도:1 미:1 솔:.5 솔:.5 미:1 도:1',
 '솔:.5 솔:.5 미:1 솔:.5 솔:.5 미:1 도:1 도:1 도:2',
 '솔:1 솔:1 미:1 도:1 솔:1 솔:1 솔:2',
 '솔:1 솔:1 미:1 도:1 솔:1 솔:1 솔:2',
 '솔:1 솔:1 미:1 도:1 솔:.5 솔:.5 솔:.5 라:.5 솔:2',
 "도':1 솔:1 도':1 솔:1 미:1 레:1 도:2"]
# 왼손 받침: 마디(1~12)별 낮은 도(-12)/솔(-17), 마디 첫 박과 셋째 박 (12마디는 솔→도)
BASS = [-12,-12,-12,-12,-12,-17,-12,-17,-12,-17,-12,-17]
SEMI = {"도'": 12, '도': 0, '레': 2, '미': 4, '솔': 7, '라': 9}
BEAT = .5
import argparse, os, glob, re
ap = argparse.ArgumentParser(); ap.add_argument('pos', nargs='*'); ap.add_argument('--clips'); ap.add_argument('--bass', type=int, default=1)
ap.add_argument('--echo', type=float, default=.18); ap.add_argument('--gain', type=float, default=2.4); ap.add_argument('--norm', type=int, default=0)
A = ap.parse_args()
out = A.pos[-1]
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
if A.clips:   # 이름 → (C5 기준 반음)
    CL = {}
    for f in glob.glob(os.path.join(A.clips, '*.wav')):
        m = re.match(r'([A-G])(\d)', os.path.basename(f)); CL[NAMES[m[1]] + 12 * (int(m[2]) - 5)] = f
else:
    CL = {0: A.pos[0]}
def pick(semi):
    k = min(CL, key=lambda c: abs(c - semi)); return CL[k], semi - k
ev, table, t = [], [], 0.0
for li, ln in enumerate(LINES):
    row = []; beat = 0.0; notes = ln.split()
    for k, x in enumerate(notes):
        n, b = x.split(':'); b = float(b)
        last = k == len(notes) - 1
        accent = 1.0 if beat % 1 == 0 else .82
        ev.append((t, SEMI[n], .7 * accent * (1.06 if last else 1)))
        row.append(round(t, 3))
        d = BEAT * b * (1.04 if last else 1)               # 구절 끝만 아주 조금 늘림
        beat += b; t += d
    # 이 구절의 두 마디(각 4박) 받침. 박 시각은 구절 시작 기준
    ls = row[0]
    for m in (0, 1):
        mi = li * 2 + m
        ev.append((ls + BEAT * 4 * m, BASS[mi], .32))
        ev.append((ls + BEAT * (4 * m + 2), -12 if mi == 11 else BASS[mi], .32))
    table.append(row)
total = t
ins, fl = [], []
if not A.bass: ev = [e for e in ev if e[1] >= 0]
for i, (tt, s, v) in enumerate(ev):
    f, d = pick(s)
    ins += ['-i', f]
    fl.append(f"[{i}:a]asetrate={44100 * 2 ** (d / 12):.1f},aresample=44100,volume={v:.3f},adelay={int(tt * 1000)}:all=1[a{i}]")
mix = ''.join(f'[a{i}]' for i in range(len(ev)))
tail = 'loudnorm=I=-20:TP=-2:LRA=7,aresample=44100,alimiter=limit=0.85' if A.norm else f'volume={A.gain},alimiter=limit=0.9'
echo = f'aecho=0.8:0.6:70:{A.echo},' if A.echo else ''
fl.append(f"{mix}amix=inputs={len(ev)}:normalize=0,{echo}{tail},apad=pad_dur=1.2,atrim=0:{total + .9:.2f}[o]")
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fl), '-map', '[o]', '-ac', '1', '-ar', '44100', '-b:a', '96k', out])
print(json.dumps({'onsets': table, 'total': round(total, 3)}))
