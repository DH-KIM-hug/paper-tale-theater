import json, os, sys, subprocess, urllib.request, urllib.error, uuid
from concurrent.futures import ThreadPoolExecutor
from carols import C, _w1, _w3, _w4
import render, xcfg
xcfg.enter()
K=xcfg.key(); H={'xi-api-key':K}
# Good King Wenceslas 를 반씩 나눈 기준(느린 판용)
C['wen_a']={'bpm':100,'notes':_w1+_w1}; C['wen_b']={'bpm':100,'notes':_w3+_w4}
REFS={ # key: (carol, bpm, reps)
 'silent_a':('silent_a',84,1),'silent_b':('silent_b',84,1),'joy':('joy',96,3),
 'wish104':('wishyou',104,1),'wish116':('wishyou',116,1),
 'jingle100':('jingle',100,1),'jingle140':('jingle',140,1),'jingle76':('jingle',76,1),
 # 2026-11-28 추가
 'noel84':('noel',84,1),'deck140':('deck',140,1),'deck150':('deck',150,1),'deck160':('deck',160,1),
 'wen_a100':('wen_a',100,1),'wen_b100':('wen_b',100,1),'wen_a84':('wen_a',84,1),'wen_b84':('wen_b',84,1),
 'godrest96':('godrest',96,1),
 'march132':('march',132,1),'reed76':('reedflutes',76,1),
 'waltz120':('waltz',120,1),'waltz160':('waltz',160,1),'waltz132':('waltz',132,1),
 'sugar60':('sugarplum',60,1),'sugar72':('sugarplum',72,1)}
def S(*a): return list(a)
TRACKS=[
 ('el_nb_silent_box',['silent_a','silent_b'],S('instrumental lullaby','music box carries the melody','soft celesta','very gentle felt piano pad','hushed, warm, sleepy snowy night','tiny sleigh bells far away'),['vocals','drums','loud','sad']),
 ('el_nb_silent_harp',['silent_a','silent_b'],S('instrumental','warm harp plays the melody','soft string pad','gentle flute','very slow and tender','goodnight lullaby'),['vocals','drums','loud']),
 ('el_es_wish_workshop',['wish104']*3,S('instrumental','fingerpicked acoustic guitar and soft fiddle play the melody','light woodblock','glockenspiel sparkles','warm cozy cobbler workshop','cheerful and gentle'),['vocals','heavy drums','loud']),
 ('el_es_wish_xmas',['wish104']*3,S('instrumental','glockenspiel and celesta play the melody','soft sleigh bells','warm strings','bright Christmas morning, shelves full of shoes, happy ending','gentle and festive'),['vocals','heavy drums','loud']),
 ('el_gb_jingle_bake',['jingle100']*2,S('instrumental','marimba and music box play the melody','soft acoustic guitar','light shaker','cozy kitchen baking cookies','gentle and warm'),['vocals','heavy drums','loud']),
 ('el_gb_jingle_chase',['jingle140']*3,S('instrumental','xylophone and pizzicato strings play the melody','woodblock rhythm','tambourine','playful bouncy chase through the snow','light and funny, not scary'),['vocals','heavy drums','loud','scary']),
 ('el_gb_jingle_snow',['jingle76']*2,S('instrumental','slow music box and celesta play the melody','soft sustained strings','snowy quiet evening, tender and a little wistful','warm window light'),['vocals','drums','loud']),
]

NOVOX=['vocals','singing','choir','humming','speech','drums kit']
TRACKS2=[
 # 크리스마스 전날 밤(잠자리, 느리고 조용히)
 ('el_nb_noel_moon',['noel84']*2,S('instrumental','solo celesta plays the melody clearly in front, single notes','soft harp arpeggios underneath','quiet moonlit snowy night, hushed and magical','slow and gentle'),NOVOX+['loud','busy accompaniment']),
 ('el_nb_deck_sleigh',['deck140']*2,S('instrumental','music box and glockenspiel play the melody clearly in front','soft sleigh bells keep a light pulse','gentle pizzicato strings','reindeer prancing on a snowy night, cheerful but soft'),NOVOX+['loud','heavy drums']),
 ('el_nb_wenceslas_jolly',['wen_a100','wen_b100'],S('instrumental','glockenspiel plays the melody clearly in front','playful pizzicato strings and a soft bassoon','jolly little Santa by the fireplace, warm and cozy, quiet'),NOVOX+['loud','heavy drums']),
 # 구두장이와 요정
 ('el_es_deck_day',['deck140']*2,S('instrumental','fiddle and glockenspiel play the melody clearly in front','fingerpicked acoustic guitar','light woodblock','cheerful cozy cobbler workshop in the daytime'),NOVOX+['loud','heavy drums']),
 ('el_es_noel_candle',['noel84']*2,S('instrumental','music box plays the melody clearly in front, single notes','warm soft string pad','candle-lit winter evening, tender and calm','slow'),NOVOX+['loud','busy accompaniment']),
 ('el_es_wenceslas_tiptoe',['wen_a84','wen_b84'],S('instrumental','soft celesta plays the melody clearly in front','very sparse tiptoeing pizzicato strings','tiny elves sneaking at midnight, hushed, curious, playful'),NOVOX+['loud','heavy drums','scary']),
 ('el_es_deck_dance',['deck150']*2,S('instrumental','piccolo and glockenspiel play the melody clearly in front','tambourine and pizzicato strings','tiny elves dancing for joy, lively and bright'),NOVOX+['loud','heavy drums']),
 # 진저브레드맨
 ('el_gb_deck_chase',['deck160']*2,S('instrumental','xylophone plays the melody clearly in front','pizzicato strings','woodblock running rhythm','playful bouncy chase through the snowy fields, funny, not scary'),NOVOX+['loud','heavy drums','scary']),
 ('el_gb_godrest_fox',['godrest96']*2,S('instrumental','bassoon and clarinet play the melody clearly in front','sly tiptoeing pizzicato strings','a clever fox at the edge of a snowy forest, mischievous and cute, not scary'),NOVOX+['loud','heavy drums','scary','horror']),
 # 호두까기 인형 (차이콥스키 1892 선율)
 ('el_nc_march_light',['march132']*3,S('instrumental','light clarinets and flutes play the march melody clearly in front','soft pizzicato strings','Christmas Eve party in a cozy living room, gentle and bright, toy march, not loud'),NOVOX+['loud','heavy drums','brass fanfare']),
 ('el_nc_march_parade',['march132']*3,S('instrumental','piccolo and clarinets play the march melody clearly in front','small toy snare drum marching','tiny toy soldiers parading on a wooden floor, crisp and playful'),NOVOX+['loud','heavy drums','rock']),
 ('el_nc_reedflutes',['reed76']*3,S('instrumental','three flutes play the melody clearly in front','light pizzicato strings','playful and dainty, a toy coming to life, light'),NOVOX+['loud','heavy drums']),
 ('el_nc_waltz_box',['waltz120']*2,S('instrumental','music box plays the waltz melody clearly in front, single notes','very soft celesta','slow three-beat lullaby, a child falling asleep beside a toy'),NOVOX+['loud','busy accompaniment']),
 ('el_nc_waltz_snow',['waltz120']*2,S('instrumental','french horn plays the waltz melody softly in front','harp and soft strings','slow waltz through a quiet snowy forest, magical'),NOVOX+['loud','heavy drums']),
 ('el_nc_waltz_main',['waltz160']*3,S('instrumental','warm french horns play the waltz melody clearly in front','lush strings and harp','a flower garden made of sugar, elegant romantic ballet waltz'),NOVOX+['heavy drums','rock']),
 ('el_nc_waltz_morning',['waltz132']*2,S('instrumental','flute plays the waltz melody softly in front','harp and a very soft string pad','gentle winter morning sunlight, peaceful, quiet ending'),NOVOX+['loud','heavy drums']),
 ('el_nc_sugarplum_night',['sugar60']*2,S('instrumental','celesta plays the melody softly in front, single notes','low bass clarinet and very soft pizzicato','midnight in a living room, mysterious but gentle, hushed, not scary'),NOVOX+['loud','scary','horror']),
 ('el_nc_sugarplum',['sugar72']*2,S('instrumental','celesta plays the melody clearly in front','light pizzicato strings','sugar plum fairy dancing on tiptoe, sparkling and dainty, ballet'),NOVOX+['loud','heavy drums']),
]

# 2026-11-28 사용자 "좀 더 웅장하게는 안 되나?" → 같은 기준 음원, 큰 관현악 편곡(기존 파일은 그대로 두고 *_orch 로 따로)
BIG=['instrumental','grand full symphony orchestra','rich string section','french horns and trumpets','timpani','harp','celesta','wide cinematic concert hall space','big dynamic range','romantic classical ballet orchestration']
def O(*a): return BIG+list(a)
ONEG=NOVOX+['rock','electronic','synth','drum kit','lo-fi','thin','small ensemble']
TRACKS_ORCH=[
 ('el_nc_march_light_orch',['march132']*3,O('woodwinds and strings play the march melody clearly in front','majestic and sparkling festive march','Christmas Eve party, bright and proud'),ONEG),
 ('el_nc_march_parade_orch',['march132']*3,O('brass and woodwinds play the march melody clearly in front','snare drum and timpani','triumphant splendid toy soldier parade, bold and brilliant'),ONEG),
 ('el_nc_reedflutes_orch',['reed76']*3,O('three flutes play the melody clearly in front','lush pizzicato and sustained strings underneath','playful yet grand ballet dance'),ONEG),
 ('el_nc_waltz_box_orch',['waltz120']*2,O('celesta and solo violin play the waltz melody softly in front','soft muted strings and harp','gentle orchestral lullaby, tender, quiet but full'),ONEG+['loud']),
 ('el_nc_waltz_snow_orch',['waltz120']*2,O('french horns play the waltz melody in front','shimmering strings, harp glissandi','magical snowy forest, slow sweeping waltz, swelling'),ONEG),
 ('el_nc_waltz_main_orch',['waltz160']*3,O('french horns and full strings play the waltz melody clearly in front','sweeping harp, timpani rolls, brass swells','the grandest climax, lush romantic ballet waltz, fortissimo, majestic'),ONEG),
 ('el_nc_waltz_morning_orch',['waltz132']*2,O('flute and strings play the waltz melody softly in front','warm horns and harp underneath','peaceful winter morning, soft and glowing final cadence'),ONEG+['loud']),
 ('el_nc_sugarplum_night_orch',['sugar60']*2,O('celesta plays the melody softly in front','bass clarinet and muted low strings','hushed mysterious midnight, soft orchestral, gentle, not scary'),ONEG+['loud','scary','horror']),
 ('el_nc_sugarplum_orch',['sugar72']*2,O('celesta plays the melody clearly in front','full string orchestra pizzicato and sustained accompaniment, big and rich','sparkling grand ballet dance of a candy fairy on tiptoe'),ONEG),
]

# 2026-11-28 사용자 "진저브레드와 구두장이는 더 화려한 캐롤" → 같은 기준 음원, 화려한 크리스마스 관현악(*_orch)
FEST=['instrumental','lush festive Christmas movie orchestral score','sleigh bells','glockenspiel','brass fanfare accents','full string section','timpani','bright and sparkling','wide cinematic space']
def F(*a): return FEST+list(a)
SOFT=['soft dynamics','gentle, sits under narration']
TRACKS_FEST=[
 # 첫 프롬프트(F(...))는 선율이 묻혀 align 이 대조군과 비슷했다(0.57~0.75). 선율을 앞에 두는 문구로 바꿔 6번부터 다시.
 ('el_es_wish_workshop_orch',['wish104']*3,['instrumental','festive Christmas orchestra','solo glockenspiel plays the melody clearly in front, single notes','sleigh bells','sparse festive strings and soft horns underneath','cozy cobbler workshop, warm, cheerful, sparkling'],ONEG+['busy accompaniment','arpeggios']),
 ('el_es_wish_xmas_orch',['wish104']*3,['instrumental','festive Christmas orchestra','solo glockenspiel and celesta play the melody clearly in front, single notes','sleigh bells','full strings and timpani underneath','joyful Christmas morning finale, grand and celebratory'],ONEG+['busy accompaniment','arpeggios']),
 ('el_es_deck_day_orch',['deck140']*2,F('strings and glockenspiel play the melody clearly in front','busy happy workshop day, bouncy'),ONEG),
 ('el_es_noel_candle_orch',['noel84']*2,F('celesta and violins play the melody softly in front','candle-lit winter evening, tender and glowing',*SOFT),ONEG+['loud']),
 ('el_es_wenceslas_tiptoe_orch',['wen_a84','wen_b84'],F('celesta and pizzicato strings play the melody softly in front','tiny elves tiptoeing at midnight, magical and hushed, playful',*SOFT),ONEG+['loud','scary']),
 ('el_es_deck_dance_orch',['deck150']*2,F('piccolo, glockenspiel and strings play the melody clearly in front','tambourine','elves dancing for joy, lively, sparkling'),ONEG),
 ('el_gb_jingle_bake_orch',['jingle100']*2,F('glockenspiel and strings play the melody clearly in front','cozy kitchen baking cookies, warm and twinkly'),ONEG),
 ('el_gb_jingle_chase_orch',['jingle140']*3,F('xylophone, piccolo and strings play the melody clearly in front','fast exciting playful chase through the snow, funny, not scary'),ONEG+['scary']),
 ('el_gb_deck_chase_orch',['deck160']*2,F('xylophone and brass play the melody clearly in front','galloping fast chase across snowy fields, energetic and funny'),ONEG+['scary']),
 ('el_gb_godrest_fox_orch',['godrest96']*2,F('bassoon and clarinet play the melody clearly in front','sly pizzicato strings','a clever fox at the edge of a snowy forest, mischievous, cute, not scary'),ONEG+['scary','horror']),
 ('el_gb_jingle_snow_orch',['jingle76']*2,F('celesta and soft strings play the melody slowly in front','quiet snowy evening, warm window light, tender',*SOFT),ONEG+['loud']),
]
ALL=TRACKS+TRACKS2+TRACKS_ORCH+TRACKS_FEST
def upload(key):
    jp=f'refs/{key}.json'
    if os.path.exists(jp): return json.load(open(jp))
    car,bpm,reps=REFS[key]
    for tweak in (1.0,1.04,0.96,1.08):
        C[car]['bpm']=bpm*tweak
        dur=render.render(car,f'refs/{key}.wav',reps)
        subprocess.run(['ffmpeg','-loglevel','error','-y','-i',f'refs/{key}.wav','-b:a','128k',f'refs/{key}.mp3'],check=True)
        b=uuid.uuid4().hex; data=open(f'refs/{key}.mp3','rb').read()
        body=(f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="{key}.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n').encode()+data+f'\r\n--{b}--\r\n'.encode()
        r=urllib.request.Request('https://api.elevenlabs.io/v1/music/upload',data=body,headers={**H,'Content-Type':f'multipart/form-data; boundary={b}'})
        try:
            d=json.loads(urllib.request.urlopen(r,timeout=300).read()); d['dur']=dur; d['bpm']=bpm*tweak; json.dump(d,open(jp,'w')); return d
        except urllib.error.HTTPError as e: print('upload fail',key,tweak,e.read()[:80],flush=True)
    raise RuntimeError('upload failed '+key)
def compose(tid, parts, pos, neg, attempt=0):
    out=f'raw/{tid}_{attempt}.mp3'
    if os.path.exists(out) and os.path.getsize(out)>10000: return out
    ch=[]
    for k in parts:
        u=upload(k); ms=int(min(u['dur'],29.5)*1000)-300
        ch.append({'text':'','duration_ms':ms,'positive_styles':pos,'negative_styles':neg,'conditioning_ref':{'song_id':u['song_id'],'range':{'start_ms':0,'end_ms':ms}},'condition_strength':'xhigh'})
    body=json.dumps({'composition_plan':{'chunks':ch},'model_id':'music_v2_5'}).encode()
    r=urllib.request.Request('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128',data=body,headers={**H,'Content-Type':'application/json'})
    try: d=urllib.request.urlopen(r,timeout=900).read()
    except urllib.error.HTTPError as e: print('ERR',tid,e.code,e.read()[:600],flush=True); return None
    open(out,'wb').write(d); return out
if __name__=='__main__':
    args=sys.argv[1:]; att=0
    if args and args[0].startswith('--att='): att=int(args[0][6:]); args=args[1:]
    only=args; jobs=[t for t in TRACKS2+TRACKS_ORCH+TRACKS_FEST if (not only and t in TRACKS2) or t[0] in only]
    ok=[]
    for t in jobs:
        try:
            for k in t[1]: upload(k)
            ok.append(t)
        except RuntimeError as e: print('SKIP',t[0],e,flush=True)
    jobs=ok; print('uploads ok',len(jobs),flush=True)
    with ThreadPoolExecutor(2) as ex:
        for t,res in zip(jobs, ex.map(lambda t: compose(*t,attempt=att), jobs)): print(t[0],res,flush=True)
