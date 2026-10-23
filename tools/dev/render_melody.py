#!/usr/bin/env python3
"""멜로디 한 줄('음:박' 목록)을 실제 악기 단음 샘플로 미리 렌더해 mp3 한 파일로 만든다 (곰 세 마리 render_gom_se_mari.py 의 일반형).
사용: python3 render_melody.py --clips <단음 wav 폴더> --song 'E4:.5 G4:2 ...' --beat .65 --out out.mp3 [--echo .2] [--tail 1.0] [--decay 1.6]
  폴더 안 단음 wav 이름은 음 이름(C4.wav, G5.wav ...). 필요한 음에 가장 가까운 클립을 쓰고 모자란 만큼만 rate 로 옮긴다.
  --decay 음 길이(박×beat)의 몇 배까지 울리게 자를지 (잔향이 길어 겹침이 탁한 오르골용), 끝에는 짧은 페이드.
박 격자는 T.playMelody/holdMelody 와 같다(음 시작 = 앞 음들 박 합 × beat). 시작 시각 표(JSON)와 total 을 출력한다."""
import argparse, os, glob, re, json, subprocess
ap = argparse.ArgumentParser()
ap.add_argument('--clips', required=True); ap.add_argument('--song', required=True); ap.add_argument('--beat', type=float, default=.65)
ap.add_argument('--out', required=True); ap.add_argument('--echo', type=float, default=.2); ap.add_argument('--decay', type=float, default=0)
ap.add_argument('--tail', type=float, default=1.0); ap.add_argument('--vol', type=float, default=1.0)
A = ap.parse_args()
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def semi(n): m = re.match(r'([A-G])([#b]?)(\d)$', n); return NAMES[m[1]] + (1 if m[2] == '#' else -1 if m[2] == 'b' else 0) + (int(m[3]) - 4) * 12  # C4 = 0
CL = {}
for f in glob.glob(os.path.join(A.clips, '*.wav')):
    b = os.path.basename(f)
    if re.match(r'[A-G][#b]?\d\.wav$', b): CL[semi(b[:-4])] = f
import struct
def clip_onset(f):   # 클립 안에서 소리가 가장 가파르게 치솟는 시각(초) — 느린 타악 어택은 이만큼 앞당겨 박 격자에 맞춘다
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-t', '1', '-ac', '1', '-ar', '22050', '-f', 's16le', '-'])
    d = struct.unpack('<%dh' % (len(raw) // 2), raw)
    env = [sum(abs(v) for v in d[i:i + 55]) for i in range(0, len(d) - 55, 55)]
    k = max(range(len(env) - 3), key=lambda j: env[j + 3] - env[j]); return k * 55 / 22050
ON = {c: clip_onset(f) for c, f in CL.items()}
ev, table, t = [], [], 0.0
for k, x in enumerate(A.song.split()):
    n, b = x.split(':'); b = float(b)
    if n != 'R': ev.append((t, semi(n), b * A.beat)); table.append(round(t, 3))
    t += b * A.beat
total = t
ins, fl = [], []
for i, (tt, s, d) in enumerate(ev):
    c = min(CL, key=lambda c: abs(c - s)); sh = s - c
    ins += ['-i', CL[c]]
    trim = f',atrim=0:{max(d * A.decay, .5):.3f},afade=t=out:st={max(d * A.decay, .5) - .25:.3f}:d=0.25' if A.decay else ''
    fl.append(f"[{i}:a]asetrate={44100 * 2 ** (sh / 12):.1f},aresample=44100,aformat=channel_layouts=mono{trim},volume=1.0,adelay={max(0, int((tt - ON[c] / 2 ** (sh / 12)) * 1000))}:all=1[a{i}]")
mix = ''.join(f'[a{i}]' for i in range(len(ev)))
echo = f'aecho=0.8:0.55:90|170:{A.echo}|{A.echo / 2},' if A.echo else ''
# 합친 뒤 피크 -3dB(0.708)로 맞춘다: 먼저 loudnorm 없이 최대치만 재서 정규화(2패스)
base = f"{mix}amix=inputs={len(ev)}:normalize=0,{echo}apad=pad_dur={A.tail},atrim=0:{total + A.tail:.2f}"
tmp = A.out + '.tmp.wav'
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', ';'.join(fl + [f'{base}[o]']), '-map', '[o]', '-ac', '1', '-ar', '44100', tmp])
r = subprocess.run(['ffmpeg', '-i', tmp, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
mx = float(re.search(r'max_volume: (-?[\d.]+) dB', r)[1])
subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'volume={-3 - mx + 20 * __import__("math").log10(A.vol):.2f}dB', '-ac', '1', '-ar', '44100', '-b:a', '96k', A.out])
os.remove(tmp)
print(json.dumps({'onsets': table, 'total': round(total, 3)}))
