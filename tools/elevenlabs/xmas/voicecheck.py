"""사람 말소리 섞임 검사(받아쓰기). 소음에서 whisper 가 지어내는 글('Thank you.' 같은 것)은 거르고,
no_speech_prob<0.5 이면서 avg_logprob>-0.8, compression_ratio<2.4 인 구간만 '의심'으로 낸다.
쓰기: python voicecheck.py 파일...   (mlx_whisper 필요: ~/.venvs/paper-tale)"""
import sys, json, mlx_whisper
# 소음·음악에서 whisper 가 늘 지어내는 문장(자막 크레딧 등). 이것만 나오면 사람 소리로 보지 않는다.
HALLU=['thank you','you','bye','продолжение следует','редактор субтитров','корректор','субтитры','다음 영상에서 만나요','시청해 주셔서','구독','字幕','ご視聴']
def hallu(t):
    t=t.lower().strip(' .!?…')
    return (not t) or any(h in t for h in HALLU) and len(t)<60
out={}
for f in sys.argv[1:]:
    r=mlx_whisper.transcribe(f,path_or_hf_repo='mlx-community/whisper-large-v3-turbo',condition_on_previous_text=False)
    sus=[(round(s['start'],1),s['text'].strip(),round(s['no_speech_prob'],2),round(s['avg_logprob'],2)) for s in r['segments']
         if s['no_speech_prob']<0.5 and s['avg_logprob']>-0.8 and s['compression_ratio']<2.4 and any(c.isalpha() for c in s['text']) and not hallu(s['text'])]
    out[f]=sus; print(f.split('/')[-1],'SUSPECT' if sus else 'ok',sus[:3],flush=True)
import os, xcfg
json.dump(out,open(os.path.join(xcfg.WORK,'voicecheck_last.json'),'w'),ensure_ascii=False,indent=1)
