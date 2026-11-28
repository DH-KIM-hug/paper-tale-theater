# 호두까기 효과음 다시 만들기: 받아쓰기에 웃음('hahaha')이 잡힌 것, 원본이 거의 무음(최대 -30dB 아래)인 것
import json, os, shutil, urllib.request
from concurrent.futures import ThreadPoolExecutor
import xcfg
K=xcfg.key(); xcfg.enter()
NV=' Purely a musical instrument or object sound. Absolutely no human voice, no laughing, no breathing, no vocalization, no speech.'
R={
'el_nc_jaw_crack':(0.8,'One single short dry click of two small wooden blocks, like a wooden toy hinge snapping, crisp.'),
'el_nc_knot_pluck':(1.0,'One clearly audible plucked violin string, a single warm pizzicato note with short ring.'),
'el_nc_snare_march':(2.0,'A clearly audible short toy snare drum marching rhythm, rat-a-tat-tat, crisp and light, close-up.'),
}
def go(it):
    id,(dur,p)=it; shutil.copy(f'sfxraw/{id}.mp3',f'sfxraw_v1/{id}.mp3')
    body=json.dumps({'text':p+NV,'duration_seconds':dur,'prompt_influence':0.55,'model_id':'eleven_text_to_sound_v2'}).encode()
    r=urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
    open(f'sfxraw/{id}.mp3','wb').write(urllib.request.urlopen(r,timeout=180).read()); return id
if __name__=='__main__':
    with ThreadPoolExecutor(2) as ex: print(list(ex.map(go,R.items())))
