#!/usr/bin/env python3
"""〈곰 세 마리〉 실로폰 연주를 mp3 한 파일로 미리 렌더하고, 음 시작 시각 표를 출력한다.
사용: python3 render_gom_se_mari.py <note_xylo.mp3> <out.mp3>   (C5 한 음 샘플을 이어 붙임)
멜로디는 goldilocks.js 의 LINES 와 같다. 구절 끝은 늘리고, 구절 사이 숨을 쉬고, 박마다 셈여림을 준다."""
import subprocess, sys, json
LINES = [
 '도:1 도:1 도:.5 도:.5 도:1 미:.5 솔:.5 솔:.5 미:.5 도:2',
 '솔:.5 솔:.5 미:1 솔:.5 솔:.5 미:1 도:1 도:1 도:2',
 '솔:.5 솔:.5 미:.5 도:.5 솔:.5 솔:.5 솔:1.5',
 '솔:.5 솔:.5 미:.5 도:.5 솔:.5 솔:.5 솔:1.5',
 '솔:.5 솔:.5 미:.5 도:.5 솔:.5 솔:.5 솔:.5 라:.5 솔:2',
 '도:.5 솔:.5 도:.5 솔:.5 미:.5 레:.5 도:2']
SEMI = {'도': 0, '레': 2, '미': 4, '솔': 7, '라': 9}
BEAT = .52
sample, out = sys.argv[1:3]
ev, table, t = [], [], 0.0
for li, ln in enumerate(LINES):
    t0 = t; row = []; beat = 0.0
    for k, x in enumerate(ln.split()):
        n, b = x.split(':'); b = float(b)
        last = k == len(ln.split()) - 1
        accent = 1.0 if beat % 1 == 0 else .82            # 박 머리는 또렷하게, 뒷박은 살짝 작게
        ev.append((t, SEMI[n], .7 * accent * (1.08 if last else 1)))
        row.append(round(t, 3))
        if beat % 2 == 0:                                  # 두 박마다 받침(C, 둘째 반은 G)
            root = -12 if (li in (0, 1, 5) or beat == 0) else -17
            ev.append((t, root, .32))
        d = BEAT * b * (1.12 if last else 1)               # 구절 끝은 조금 늘려 부른다
        beat += b; t += d
    table.append(row)
    t += .0                                                # 구절 사이 숨은 구절 끝 늘림으로 대신
total = t
ins, fl = [], []
for i, (tt, s, v) in enumerate(ev):
    ins += ['-i', sample]
    fl.append(f"[{i}:a]asetrate={44100 * 2 ** (s / 12):.1f},aresample=44100,volume={v:.3f},adelay={int(tt * 1000)}:all=1[a{i}]")
mix = ''.join(f'[a{i}]' for i in range(len(ev)))
fl.append(f"{mix}amix=inputs={len(ev)}:normalize=0,aecho=0.8:0.6:70:0.18,volume=2.4,alimiter=limit=0.9,apad=pad_dur=1.2,atrim=0:{total + .9:.2f}[o]")
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fl), '-map', '[o]', '-ac', '1', '-ar', '44100', '-b:a', '96k', out])
print(json.dumps({'onsets': table, 'total': round(total, 3)}))
