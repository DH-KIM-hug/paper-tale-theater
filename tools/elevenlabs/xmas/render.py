"""기준 음원 렌더(오르골 같은 단순 사인 배음, CC0). 쉼표 (None, 길이) 지원, 곡마다 'oct' 로 옥타브."""
import sys, numpy as np, soundfile as sf
from carols import C
def render(name, out, reps=1, octave=None, sr=44100):
    c=C[name]; spb=60/c['bpm']; buf=[]
    if octave is None: octave=c.get('oct',12)
    for r in range(reps):
        for n,d in c['notes']:
            L=int(round(d*spb*sr))
            if n is None: buf.append((L,None)); continue
            t=np.arange(int(max(d*spb*1.6,1.2)*sr))/sr
            f=261.63*2**((n+octave)/12)
            w=sum(a*np.sin(2*np.pi*f*k*t) for k,a in ((1,1),(2,.25),(3,.12),(4,.06)))*np.exp(-t*3.2)*(1-np.exp(-t*400))
            buf.append((L,w))
    total=sum(L for L,_ in buf)+int(2*sr); y=np.zeros(total+int(3*sr)); pos=0
    for L,w in buf:
        if w is not None: y[pos:pos+len(w)]+=w[:len(y)-pos]
        pos+=L
    y=y[:total]; y=y/np.abs(y).max()*.6
    sf.write(out,y,sr); return len(y)/sr
if __name__=='__main__':
    print(render(sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 1))
