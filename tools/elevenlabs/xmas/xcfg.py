"""공통 경로. 작업 폴더(기준 음원·생성 원본·중간 wav)는 저장소 밖에 두지 않고
기본으로 assets/raw/_work/xmas (git 제외)를 쓴다. 다른 곳을 쓰려면 XMAS_WORK 환경 변수.
필요 패키지: numpy, soundfile, librosa (음악 생성, align, 후처리), mlx_whisper (voicecheck, qa_sfx), ffmpeg.
키는 ~/.config/elevenlabs/key 에서 읽기만 하고 출력하지 않는다."""
import os
HERE=os.path.dirname(os.path.abspath(__file__))
REPO=os.path.abspath(os.path.join(HERE,'..','..','..'))
WORK=os.environ.get('XMAS_WORK') or os.path.join(REPO,'assets','raw','_work','xmas')
MUSIC_OUT=os.path.join(REPO,'sounds','music')
SFX_OUT=os.path.join(REPO,'sounds','sfx')
for d in ('refs','raw','out','sfxraw','sfxraw_v1'): os.makedirs(os.path.join(WORK,d),exist_ok=True)
def key(): return open(os.path.expanduser('~/.config/elevenlabs/key')).read().strip()
def enter(): os.chdir(WORK)
