import numpy as np, soundfile as sf, subprocess, re, os, json, librosa, sys
import importlib, xcfg
# 쓰기: python finish_sfx.py [목록 모듈=sfx_list|sfx_nc]
MOD=sys.argv[1] if len(sys.argv)>1 else 'sfx_list'
L=importlib.import_module(MOD).L
xcfg.enter(); OUT=xcfg.SFX_OUT+'/'; sr=44100
def lufs(p):
    r=subprocess.run(['ffmpeg','-nostats','-i',p,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
    v=re.findall(r'I:\s+(-?[\d.]+) LUFS',r); return float(v[-1]) if v else -70
rep={}
for id,sc,dur,prompt,use in L:
    y,_=librosa.load(f'sfxraw/{id}.mp3',sr=sr,mono=True)
    th=10**(-48/20)*max(np.abs(y).max(),1e-6)/1.0
    th=max(th,0.0006)
    nz=np.where(np.abs(y)>th)[0]
    if len(nz)==0: rep[id]='SILENT'; continue
    a=max(nz[0]-int(.01*sr),0); b=min(nz[-1]+int(.12*sr),len(y)); y=y[a:b]
    amb=dur>=2.9 and any(k in id for k in ['wind','embers','chime_snow','glide','fade_away','oven_hum','window_chime','tick'])
    fi=int(.006*sr); fo=int((0.5 if amb else .08)*sr); fo=min(fo,len(y)//2)
    y[:fi]*=np.linspace(0,1,fi); y[-fo:]*=np.linspace(1,0,fo)
    y=y/np.abs(y).max()*10**(-2/20)
    tmp=f'out/{id}.wav'; sf.write(tmp,y,sr)
    l=lufs(tmp)
    if l>-16: y=y*10**((-16-l)/20); sf.write(tmp,y,sr)
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',tmp,'-ac','1','-ar','44100','-b:a','64k',OUT+id+'.mp3'],check=True)
    rep[id]={'sec':round(len(y)/sr,2),'lufs':round(l,1)}
json.dump(rep,open(f'sfx_report_{MOD}.json','w'),ensure_ascii=False)
bad=[k for k,v in rep.items() if v=='SILENT']; print('silent',bad); print(len(rep))
