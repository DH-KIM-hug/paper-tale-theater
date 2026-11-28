import json, os, shutil, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
import xcfg
K=xcfg.key(); xcfg.enter()
NV=' Purely a musical instrument or object sound. Absolutely no human voice, no laughing, no breathing, no vocalization, no speech.'
R={
'el_nb_stifle_giggle':(0.8,'Two quick staccato notes on a clarinet, like a tiny mischievous chuckle tune, quiet.'),
'el_nb_jelly_wobble':(1.5,'A wobbling bassoon glissando going wobble-wobble, comical, like jelly shaking.'),
'el_es_yawn_slide':(1.8,'A long descending slide whistle then a soft low tuba note, like a sleepy yawn, cartoon.'),
'el_gb_jump_out':(1.2,'A single bouncy slide whistle rising quickly with a spring boing, cartoon jump.'),
'el_gb_stretch':(2.5,'A very slow rising slide whistle then a small sigh-like descending flute note, comical stretch.'),
'el_gb_sniff_kazoo':(1.2,'Two quick short staccato kazoo-like buzzy notes, sniff sniff, comical.'),
'el_gb_flail_throw':(1.5,'A descending slide whistle swoosh followed by a bass drum thud, cartoon dropping tools.'),
'el_gb_snap_kazoo':(0.8,'A short comical trombone-like wah chomp, a single quick brassy blip, harmless.'),
'el_nb_whistle_santa':(1.2,'A cheerful rising slide whistle instrument call, playful.'),
'el_es_oh_whistle_up':(1.0,'A short rising slide whistle expressing delight, instrument only.'),
'el_es_chair_hop':(1.2,'A light whoosh of air and a soft wooden thump of landing on a floor.'),
'el_nb_candy_swirl':(2.5,'Sparkly rising xylophone and glockenspiel glissando with bell tinkles, magical sweet candy dream.'),
}
def go(it):
    id,(dur,p)=it; shutil.copy(f'sfxraw/{id}.mp3',f'sfxraw_v1/{id}.mp3')
    body=json.dumps({'text':p+NV,'duration_seconds':dur,'prompt_influence':0.5,'model_id':'eleven_text_to_sound_v2'}).encode()
    r=urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',data=body,headers={'xi-api-key':K,'Content-Type':'application/json'})
    open(f'sfxraw/{id}.mp3','wb').write(urllib.request.urlopen(r,timeout=180).read()); return id
with ThreadPoolExecutor(2) as ex: print(list(ex.map(go,R.items())))
