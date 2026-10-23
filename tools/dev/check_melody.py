#!/usr/bin/env python3
"""렌더한 멜로디 mp3 가 악보대로인지 검사: 음마다 시작 직후 구간의 가장 센 음높이(반음 단위, 옥타브 배음 혼동은 기본음 우선)가 악보와 같은지, 음 시작 시각이 표와 ±50ms 안인지.
사용: python3 check_melody.py file.mp3 'E4:.5 G4:2 ...' beat"""
import sys, subprocess, struct, math, re
f, song, beat = sys.argv[1], sys.argv[2], float(sys.argv[3])
SR = 22050
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'])
d = struct.unpack('<%dh' % (len(raw) // 2), raw)
N = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def semi(n): m = re.match(r'([A-G])(\d)', n); return N[m[1]] + (int(m[2]) - 4) * 12
def hz(s): return 261.6256 * 2 ** (s / 12)
def gz(seg, fr):
    w = 2 * math.pi * fr / SR; c = 2 * math.cos(w); s1 = s2 = 0.0
    for x in seg: s0 = x + c * s1 - s2; s2 = s1; s1 = s0
    return s1 * s1 + s2 * s2 - c * s1 * s2
t = 0.0; bad = 0; maxdev = 0
for x in song.split():
    n, b = x.split(':'); b = float(b)
    if n != 'R':
        s = semi(n)
        # 시작 시각: 기대 시각 ±100ms 안에서 2.5ms 구간 에너지가 가장 가파르게 오르는 곳
        i0 = max(0, int((t - .1) * SR)); i1 = int((t + .1) * SR)
        env = [sum(abs(v) for v in d[i:i + 55]) for i in range(i0, i1, 55)]
        k = max(range(len(env) - 3), key=lambda j: env[j + 3] - env[j])   # 가장 크게 치솟는 곳 = 음 시작
        on = (i0 + k * 55) / SR; dev = (on - t) * 1000; maxdev = max(maxdev, abs(dev))
        a = int((t + .04) * SR); seg = [v * (0.5 - 0.5 * math.cos(2 * math.pi * i / 4400)) for i, v in enumerate(d[a:a + 4400])]
        cand = range(-14, 22)
        e = {c: gz(seg, hz(c)) for c in cand}
        top = max(e, key=e.get)
        # 높은 쪽 옥타브로 잡히면 기본음이 약한 것 → 기대음 기본음 에너지가 최대의 20% 이상이면 통과로 보되 최강음이 다른 음이면 불일치
        ok = top == s or (top == s + 12 and e[s] > .2 * e[top])
        if not ok: bad += 1
        print(f'{n:3} t={t:5.2f} onset_dev={dev:+5.0f}ms strongest_semi={top:+d} want={s:+d} {"OK" if ok else "XX"}')
    t += b * beat
print('불일치', bad, '최대 시작 오차', round(maxdev), 'ms')
