import json, numpy as np, librosa, sys, random
import music_run2 as m
from carols import C
def timeline(parts):
    ev=[]; off=0
    for k in parts:
        car,bpm,reps=m.REFS[k]; u=json.load(open(f'refs/{k}.json')); b=u.get('bpm',bpm)
        spb=60/b; t=0
        for p,d in C[car]['notes']:
            if p is not None: ev.append((off+t,p%12))
            t+=d*spb
        off+=(min(u['dur'],29.5)*1000-300)/1000
    return ev
def chroma(path):
    y,sr=librosa.load(path,sr=22050,mono=True); hop=512
    Cq=np.abs(librosa.cqt(y,sr=sr,hop_length=hop,fmin=librosa.note_to_hz('C3'),n_bins=48,bins_per_octave=12))
    ch=np.zeros((12,Cq.shape[1]))
    for i in range(48): ch[i%12]+=Cq[i]
    ch=ch/(ch.sum(0,keepdims=True)+1e-9); return ch, sr/hop
def prom(ch,fps,ev,lag):
    sc=[]
    for t,p in ev:
        a=int((t+lag+0.05)*fps); b=int((t+lag+0.35)*fps)
        if b>=ch.shape[1] or a<0: continue
        v=ch[:,a:b].mean(1); sc.append((v<v[p]).sum()/11)
    return np.mean(sc)
if __name__=='__main__':
    import xcfg; xcfg.enter()
    for tid,parts,_,_ in m.ALL:
        ch,fps=chroma(f'raw/{tid}_0.mp3'); ev=timeline(parts)
        best=max((prom(ch,fps,ev,l),l) for l in np.arange(-1.0,1.01,0.1))
        rnd=[]
        for s in range(20):
            sh=random.Random(s); ev2=[(t,sh.randrange(12)) for t,_ in ev]; rnd.append(max(prom(ch,fps,ev2,l) for l in np.arange(-1,1.01,0.1)))
        print(tid,'true',round(best[0],2),'lag',round(best[1],1),'null mean',round(np.mean(rnd),2),'null max',round(max(rnd),2))
