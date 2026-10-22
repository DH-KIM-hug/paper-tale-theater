#!/usr/bin/env python3
"""〈곰 세 마리〉 실로폰 연주를 mp3 한 파일로 미리 렌더하고, 음 시작 시각 표를 출력한다.
사용: python3 render_gom_se_mari.py <note_xylo.mp3> <out.mp3>   (C5 한 음 샘플을 이어 붙임)
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
sample, out = sys.argv[1:3]
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
for i, (tt, s, v) in enumerate(ev):
    ins += ['-i', sample]
    fl.append(f"[{i}:a]asetrate={44100 * 2 ** (s / 12):.1f},aresample=44100,volume={v:.3f},adelay={int(tt * 1000)}:all=1[a{i}]")
mix = ''.join(f'[a{i}]' for i in range(len(ev)))
fl.append(f"{mix}amix=inputs={len(ev)}:normalize=0,aecho=0.8:0.6:70:0.18,volume=2.4,alimiter=limit=0.9,apad=pad_dur=1.2,atrim=0:{total + .9:.2f}[o]")
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fl), '-map', '[o]', '-ac', '1', '-ar', '44100', '-b:a', '96k', out])
print(json.dumps({'onsets': table, 'total': round(total, 3)}))
