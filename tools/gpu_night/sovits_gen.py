#!/usr/bin/env python3
"""GPT-SoVITS로 게임 내레이션 39줄을 배역별 zero-shot 생성.
edge-tts 버전과 동일한 세그먼트 분할/파일 배치를 유지하되 확장자만 .m4a.
사용: (GPT-SoVITS 루트에서) .venv/bin/python sovits_gen.py lines.json out_dir [파일접두어=n]
기존 audio/와 이름이 겹치지 않게 새 대사는 접두어(v3 등)를 준다.
"""
import json, os, re, sys, subprocess

ROOT = '/Users/house_of_4k2b/orca/projects/GPT-SoVITS'
REF = '/Users/house_of_4k2b/projects/2026/patjuk-game/assets/voice-ref'
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, 'GPT_SoVITS'))
os.chdir(ROOT)

import soundfile as sf
import torch
import torchaudio

# torchaudio 2.14는 load를 torchcodec(ffmpeg 필요)에 위임 → WAV만 쓰므로 soundfile로 대체
def _sf_load(path, *a, **kw):
    data, sr = sf.read(path, dtype='float32', always_2d=True)
    return torch.from_numpy(data.T), sr
torchaudio.load = _sf_load

from GPT_SoVITS.TTS_infer_pack.TTS import TTS, TTS_Config

REF_TEXT = json.load(open(f'{REF}/refs.json'))

# 배역 → (참조 wav, 참조 텍스트, 속도)
ROLES = {
    'narrator':         ('narrator', 1.0),
    'narrator_sad':     ('narrator', 0.9),
    'narrator_excited': ('narrator', 1.1),
    'narrator_warn':    ('narrator', 1.0),
    'granny':           ('granny', 0.95),
    'friend':           ('friend', 1.05),
    'tiger':            ('tiger', 0.95),
    'tiger_hurt':       ('tiger', 1.1),
}

def quote_role(q):
    if re.search(r'앗, 뜨거워|눈이야|아야야|엉엉', q): return 'tiger_hurt'
    if re.search(r'어흥|어림없다|잡아먹', q): return 'tiger'
    if re.search(r'팥죽 한 그릇|도와줄게', q): return 'friend'
    if re.search(r'호랑이야|기다려 다오|얘들아|도와줘', q): return 'granny'
    return 'narrator'

def narrator_mood(line):
    if re.search(r'울었어요|아이고|꿀꺽 삼켜', line): return 'narrator_sad'
    if re.search(r'조심|위험', line): return 'narrator_warn'
    if re.search(r'톡!|쿵!|앙!|콕!|풍덩|미끌|꽈당|돌돌|만세|튀어나와|폴짝', line): return 'narrator_excited'
    return 'narrator'


def expand_growls(text, mood):
    out = []
    for p in re.split(r'(어흥!)', text):
        p = p.strip().lstrip(',').strip()
        if not p:
            continue
        if p == '어흥!':
            out.append(('어흥!', 'tiger'))
        elif re.search(r'[가-힣a-zA-Z0-9]', p):
            out.append((p, mood))
    return out

def main():
    lines = json.load(open(sys.argv[1]))
    out_dir = sys.argv[2]
    prefix = sys.argv[3] if len(sys.argv) > 3 else 'n'
    os.makedirs(out_dir, exist_ok=True)

    cfg = TTS_Config(f'{ROOT}/GPT_SoVITS/configs/tts_infer.yaml')
    cfg.device = 'mps'
    cfg.is_half = False
    tts = TTS(cfg)

    manifest = {}
    for i, line in enumerate(lines):
        mood = narrator_mood(line)
        parts = re.split(r'("[^"]*")', line)
        segs = []
        for p in parts:
            p = p.strip()
            if not p or not re.search(r'[가-힣a-zA-Z0-9]', p):
                continue
            if p.startswith('"'):
                segs.append((p.strip('"'), quote_role(p)))
            else:
                segs.extend(expand_growls(p, mood))
        paths = []
        for k, (text, role) in enumerate(segs):
            ref_key, speed = ROLES[role]
            base = f'{prefix}{i:02d}_{k}' if len(segs) > 1 else f'{prefix}{i:02d}'
            wav_tmp = f'{out_dir}/{base}.wav'
            m4a = f'{out_dir}/{base}.mp4'
            req = {
                'text': text, 'text_lang': 'ko',
                'ref_audio_path': f'{REF}/{ref_key}.wav',
                'prompt_text': REF_TEXT[ref_key], 'prompt_lang': 'ko',
                'top_k': 5, 'top_p': 1, 'temperature': 1,
                'speed_factor': speed, 'text_split_method': 'cut5',
                'return_fragment': False,
            }
            sr, audio = next(tts.run(req))
            sf.write(wav_tmp, audio, sr)
            subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '64000', wav_tmp, m4a], check=True)
            os.remove(wav_tmp)
            paths.append(f'audio/{base}.mp4')
            print(i, k, role, text[:24], flush=True)
        manifest[line] = paths if len(paths) > 1 else paths[0]

    with open(f'{out_dir}/manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    print('ALL DONE', len(lines), 'lines')

if __name__ == '__main__':
    main()
