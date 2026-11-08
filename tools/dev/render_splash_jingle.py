#!/usr/bin/env python3
"""스플래시 징글(2026-11-08 사용자: '스플래시에도 싱크된 노래와 음성') — 샘플 없이 직접 합성해 sounds/splash/jingle.mp3 로 만든다.
악기: 글로켄(쇠 막대, 비정수 배음), 뮤직박스(빗살 소리), 실로폰(짧은 나무), 피치카토 베이스. 모두 이 파일의 수식으로 만든 소리라 출처 문제가 없다.
음 시각은 engine/splash/scene.js 의 '장면 시각'(초)으로 적고, engine/splash/start.js 의 SLOW 를 읽어 실제 초로 늘린다.
  → 장면 시각이나 SLOW 가 바뀌면 아래 EVENTS 를 맞추고 다시 돌린다.
  python3 tools/dev/render_splash_jingle.py [--out sounds/splash/jingle.mp3] [--wav 미리듣기.wav]
화성: 도(아침) → 파(다 같이 인사) → 라단조·솔(밤) → 도(로고 글자 일어섬, 마무리 화음)."""
import argparse, os, re, subprocess, numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SLOW = float(re.search(r'const SLOW = ([\d.]+);', open(os.path.join(ROOT, 'engine/splash/start.js')).read())[1])
DURATION = float(re.search(r'export const DURATION = ([\d.]+);', open(os.path.join(ROOT, 'engine/splash/scene.js')).read())[1])
SR = 44100
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def hz(n):
    m = re.match(r'([A-G])([#b]?)(\d)$', n)
    s = NAMES[m[1]] + (1 if m[2] == '#' else -1 if m[2] == 'b' else 0) + (int(m[3]) - 4) * 12
    return 261.6256 * 2 ** ((s - 0) / 12)

def env(t, tau, att=.002):
    return np.minimum(1, t / att) * np.exp(-t / tau)

def glock(f, n):   # 글로켄슈필: 쇠 막대 배음 1, 2.76, 5.40, 8.93 — 높은 배음일수록 빨리 사라진다
    t = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * r * t) * env(t, tau) for r, a, tau in ((1, 1, 1.4), (2.756, .30, .35), (5.404, .12, .12), (8.933, .05, .05)))

def musicbox(f, n):   # 뮤직박스 빗살: 맑은 기본음 + 약한 옥타브·높은 금속 배음, 중간 길이
    t = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * r * t) * env(t, tau, .001) for r, a, tau in ((1, 1, .9), (2, .18, .4), (4.07, .10, .12), (6.8, .04, .04)))

def xylo(f, n):   # 실로폰: 나무 막대, 기본음 + 4배·10배 근처 배음, 짧게
    t = np.arange(n) / SR
    return sum(a * np.sin(2 * np.pi * f * r * t) * env(t, tau, .001) for r, a, tau in ((1, 1, .38), (3.93, .35, .08), (9.8, .1, .025)))

def pizz(f, n):   # 피치카토 베이스: 현 배음 k 가 1/k 세기로, 높은 배음일수록 빨리 줄어든다
    t = np.arange(n) / SR
    return sum((1 / k) * np.sin(2 * np.pi * f * k * t) * env(t, 1 / (2.6 + 2.2 * k), .003) for k in range(1, 9))

INST = {'glock': (glock, 2.2), 'mbox': (musicbox, 1.6), 'xylo': (xylo, .9), 'pizz': (pizz, 1.0)}

# (장면 시각, 악기, 음, 세기). 장면 사건은 scene.js 기준
EVENTS = []
def add(at, inst, notes, vel): EVENTS.extend((at, inst, n, vel) for n in notes.split())
# 0  로고 — 반짝 한 음
add(.05, 'glock', 'G5', .35)
# .36~.48 로고 글자 셋이 눕는다(fall .36+i*.06) — 내려가는 세 음
for i, n in enumerate(['G5', 'E5', 'C5']): add(.36 + i * .06, 'mbox', n, .5)
# .75~ 창 안으로 다가감 — 아침으로 올라가는 이음
for i, n in enumerate(['G4', 'A4', 'B4']): add(.72 + i * .1, 'mbox', n, .42)
# 1.0 밤 막이 걷히고 해가 내려옴 = 아침 밝음: 도 화음 + 막 걷힘 따라 글로켄 오르막(해가 다 내려온 1.45 에 가장 높은 음)
add(1.0, 'pizz', 'C3', .9); add(1.0, 'mbox', 'C5 E5 G5', .45); add(1.0, 'glock', 'C6', .55)
for i, n in enumerate(['G5', 'A5', 'B5', 'C6', 'D6', 'E6']): add(1.1 + i * .07, 'glock', n, .22 + .05 * i)
# 1.5~2.5 친구가 하나씩 들어옴 = 음 하나씩 올라감(실로폰): 사자 도, 신데렐라 미, 호랑이 솔, 토끼 라, 거북이 높은 도
for at, n in ((1.5, 'C5'), (1.8, 'E5'), (2.1, 'G5'), (2.38, 'A5'), (2.5, 'C6')): add(at, 'xylo', n, .9 if n != 'C6' else .6)
# 걷는 박: 피치카토 베이스(0.3 장면 초 = 실제 0.39초 간격)
for at, n in ((1.5, 'C3'), (1.8, 'G2'), (2.1, 'C3'), (2.4, 'G2'), (2.7, 'C3')): add(at, 'pizz', n, .75)
add(2.7, 'mbox', 'E5 G5', .25)
# 2.95 다 같이 인사 = 파 화음, 3.05~ 별 다섯이 반짝 올라감(3.05+i*.06) = 높은 글로켄 다섯 음
add(2.95, 'pizz', 'F2', 1.0); add(2.95, 'mbox', 'F4 A4 C5', .5); add(2.95, 'glock', 'F5', .5)
for i, n in enumerate(['A5', 'C6', 'F6', 'A6', 'C7']): add(3.05 + i * .06, 'glock', n, .28)
# 3.3 해가 올라가고 3.4 밤 막이 내려옴 = 내려가는 뮤직박스(라단조 느낌)
add(3.35, 'pizz', 'A2', .7)
for i, n in enumerate(['A5', 'G5', 'E5', 'C5']): add(3.35 + i * .14, 'mbox', n, .45 - .04 * i)
# 3.95 친구들이 접혀 누움 = 솔 화음(조용히), 4.45 뒤로 빠져 로고로 = 오르막 이음
add(3.95, 'pizz', 'G2', .7); add(3.95, 'mbox', 'B4 D5', .3)
for i, n in enumerate(['G4', 'B4', 'D5']): add(4.5 + i * .15, 'mbox', n, .38)
# 5.0·5.15·5.33 글자 '톡'·'톡'·'동화극장'이 일어섬(LANDS) — 높은 글로켄 두 번 톡톡, 셋째에 마무리 도 화음.
# 2026-11-08 이름 부르는 목소리를 차분하고 나긋하게 바꾸며(사용자) 마무리도 작고 부드럽게: 베이스·화음을 줄이고 높은 반짝은 뺐다
add(5.0, 'glock', 'E6', .25); add(5.15, 'glock', 'G6', .25)
add(5.33, 'pizz', 'C3', .55); add(5.33, 'pizz', 'C2', .3); add(5.33, 'mbox', 'C5 E5 G5 C6', .3); add(5.33, 'glock', 'C6', .22)
# 5.9 홈 로고 자리로 날아감 — 아주 작게 올라가는 반짝
for i, n in enumerate(['C6', 'E6', 'G6', 'C7']): add(5.9 + i * .07, 'glock', n, .09)

def render():
    total = DURATION * SLOW
    out = np.zeros(int((total + .05) * SR))
    for at, inst, n, vel in EVENTS:
        fn, length = INST[inst]
        k = int(at * SLOW * SR); m = min(int(length * SR), len(out) - k)
        if m > 0: out[k:k + m] += vel * fn(hz(n), m)
    # 짧은 방 울림: 지수로 줄어드는 잡음 응답(0.9초)과 FFT 합성곱, 원음에 18% 섞음
    rng = np.random.default_rng(7); L = int(.9 * SR)
    ir = rng.standard_normal(L) * np.exp(-np.arange(L) / SR / .22); ir[:int(.012 * SR)] = 0; ir /= np.sqrt(np.sum(ir ** 2))
    N = 1 << int(np.ceil(np.log2(len(out) + L)))
    wet = np.fft.irfft(np.fft.rfft(out, N) * np.fft.rfft(ir, N), N)[:len(out)]
    y = out + .18 * wet
    fade = int(.35 * SR); y[-fade:] *= np.linspace(1, 0, fade) ** 2   # 장면 끝에서 조용히 닫힌다
    return y / np.max(np.abs(y)) * .7

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--out', default=os.path.join(ROOT, 'sounds/splash/jingle.mp3')); ap.add_argument('--wav')
    A = ap.parse_args()
    y = render()
    os.makedirs(os.path.dirname(A.out), exist_ok=True)
    pcm = (y * 32767).astype('<i2').tobytes()
    wav = A.wav or A.out + '.tmp.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', wav], input=pcm, check=True)
    # 음량 -20 LUFS(목소리 -16 보다 낮게), 봉우리 -1.5 dB, 앱 묶음 규칙대로 64k 모노 mp3
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'loudnorm=I=-20:TP=-1.5:LRA=11', '-ar', '44100', '-ac', '1', '-b:a', '64k', A.out], check=True)
    if not A.wav: os.remove(wav)
    print(f'{A.out}  {len(y) / SR:.2f}s  (SLOW {SLOW}, 음 {len(EVENTS)}개)')

if __name__ == '__main__':
    main()
