"""생성곡이 기준 선율을 따르는지 기계 확인.
기준 음표 시각마다 생성곡의 음이름(12) 에너지 순위를 재서 평균(1.0 = 늘 가장 셈), 덩어리(chunk)마다 시차를 따로 찾는다.
같은 시각에 음이름만 무작위로 바꾼 대조군 15개의 최고값보다 높아야 채택.
쓰기: python align2.py [시도번호] [트랙 id ...]   (작업 폴더는 xcfg.WORK)"""
import numpy as np, random, json, os, sys
import xcfg, align, music_run2 as m
xcfg.enter()
from carols import C
def chunks(parts):
    out=[]; off=0
    for k in parts:
        car,bpm,reps=m.REFS[k]; u=json.load(open(f'refs/{k}.json')); spb=60/u.get('bpm',bpm); t=0; ev=[]
        clen=(min(u['dur'],29.5)*1000-300)/1000
        for p,d in C[car]['notes']:
            if p is not None and t<clen-0.4: ev.append((off+t,p%12))
            t+=d*spb
        out.append(ev); off+=clen
    return out
lags=np.arange(-2,2.01,0.1)
def score(ch,fps,chs,rand=None):
    tot=[];lg=[]
    for i,ev in enumerate(chs):
        if rand is not None: r=random.Random(rand*10+i); ev=[(t,r.randrange(12)) for t,_ in ev]
        b=max((align.prom(ch,fps,ev,l),l) for l in lags); tot.append(b[0]); lg.append(round(b[1],1))
    return np.mean(tot),lg
if __name__=='__main__':
    SUF=sys.argv[1] if len(sys.argv)>1 else '0'; only=sys.argv[2:]
    res={}
    if os.path.exists('align_scores.json'): res=json.load(open('align_scores.json'))
    for tid,parts,_,_ in m.ALL:
        if only and tid not in only: continue
        f=f'raw/{tid}_{SUF}.mp3'
        if not os.path.exists(f): continue
        ch,fps=align.chroma(f); chs=chunks(parts)
        s,l=score(ch,fps,chs); nul=[score(ch,fps,chs,r)[0] for r in range(15)]
        ok=s>max(nul)
        res[f'{tid}_{SUF}']={'true':round(float(s),3),'null_mean':round(float(np.mean(nul)),3),'null_max':round(float(max(nul)),3),'lags':l,'pass':bool(ok)}
        print(tid,SUF,'true',round(s,2),'lags',l,'null mean',round(np.mean(nul),2),'max',round(max(nul),2),'PASS' if ok else 'FAIL',flush=True)
    json.dump(res,open('align_scores.json','w'),indent=1)
