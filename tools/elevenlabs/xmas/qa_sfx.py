# 효과음 원본 받아쓰기(사람 소리 섞임 검사) + 음량. mlx_whisper 필요(~/.venvs/paper-tale).
# 쓰기: python qa_sfx.py [목록 모듈=sfx_list|sfx_nc]
import glob, json, subprocess, re, os, sys, importlib
import mlx_whisper
import xcfg
MOD=sys.argv[1] if len(sys.argv)>1 else 'sfx_list'
IDS=[x[0] for x in importlib.import_module(MOD).L]
xcfg.enter()
res={}
for id in IDS:
    f=f'sfxraw/{id}.mp3'
    if not os.path.exists(f): continue
    r=subprocess.run(['ffmpeg','-nostats','-i',f,'-af','volumedetect,ebur128=peak=true','-f','null','-'],capture_output=True,text=True).stderr
    mx=re.findall(r'max_volume: (-?[\d.]+)',r); I=re.findall(r'I:\s+(-?[\d.]+) LUFS',r)
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
    try: t=mlx_whisper.transcribe(f,path_or_hf_repo='mlx-community/whisper-large-v3-turbo',language='en',condition_on_previous_text=False)['text'].strip()
    except Exception as e: t='?'+str(e)[:40]
    res[id]={'dur':round(d,2),'max':float(mx[0]),'lufs':float(I[-1]) if I else None,'asr':t}
    print(id,res[id],flush=True)
json.dump(res,open(f'qa_{MOD}.json','w'),ensure_ascii=False,indent=1)
