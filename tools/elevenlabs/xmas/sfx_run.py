import json, os, sys, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
import importlib, xcfg
# 쓰기: python sfx_run.py [목록 모듈=sfx_list|sfx_nc]
L=importlib.import_module(sys.argv[1] if len(sys.argv)>1 else 'sfx_list').L
K=xcfg.key(); xcfg.enter()
def gen(item):
    id,sc,dur,prompt,use=item; out=f'sfxraw/{id}.mp3'
    if os.path.exists(out) and os.path.getsize(out)>2000: return id,'skip'
    body=json.dumps({'text':prompt,'duration_seconds':dur,'prompt_influence':0.45,'model_id':'eleven_text_to_sound_v2'}).encode()
    r=urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
    for i in range(3):
        try: open(out,'wb').write(urllib.request.urlopen(r,timeout=180).read()); return id,'ok'
        except urllib.error.HTTPError as e:
            msg=e.read()[:200]
            if e.code==429: import time; time.sleep(5); continue
            return id,f'ERR {e.code} {msg}'
    return id,'ERR retry'
with ThreadPoolExecutor(2) as ex:
    for id,s in ex.map(gen,L): print(id,s,flush=True)
