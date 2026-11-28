import numpy as np, soundfile as sf, subprocess, re, sys, librosa
import xcfg
# 채택한 시도 번호. 쓰기: python finish_music.py [트랙=시도 ...]  (인자를 주면 그것만 처리)
SEL={'el_nb_silent_box':1,'el_nb_silent_harp':1,'el_es_wish_workshop':2,'el_es_wish_xmas':0,'el_gb_jingle_bake':0,'el_gb_jingle_chase':0,'el_gb_jingle_snow':0}
if len(sys.argv)>1: SEL={a.split('=')[0]:int(a.split('=')[1]) for a in sys.argv[1:]}
xcfg.enter(); OUT=xcfg.MUSIC_OUT+'/'
X=2.5; sr=44100
def lufs(path):
    r=subprocess.run(['ffmpeg','-nostats','-i',path,'-af','ebur128=peak=true','-f','null','-'],capture_output=True,text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS',r)[-1])
for tid,a in SEL.items():
    y,_=librosa.load(f'raw/{tid}_{a}.mp3',sr=sr,mono=True)
    # trim leading/trailing silence
    nz=np.where(np.abs(y)>0.005)[0]; y=y[max(nz[0]-int(.05*sr),0):nz[-1]+1]
    n=int(X*sr); t=np.linspace(0,np.pi/2,n)
    seam=y[-n:]*np.cos(t)+y[:n]*np.sin(t)
    loop=np.concatenate([y[n:-n],seam])
    tmp=f'out/{tid}_loop.wav'; sf.write(tmp,loop,sr)
    l=lufs(tmp); g=-24-l
    z=loop*10**(g/20); pk=np.abs(z).max()
    if pk>0.89: z=z*0.89/pk
    sf.write(tmp,z,sr)
    dst=OUT+tid+'.mp3'
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',tmp,'-ac','1','-ar','44100','-b:a','64k',dst],check=True)
    print(tid,'len',round(len(loop)/sr,1),'LUFS',round(lufs(dst),1),'KB',round(__import__('os').path.getsize(dst)/1024))
