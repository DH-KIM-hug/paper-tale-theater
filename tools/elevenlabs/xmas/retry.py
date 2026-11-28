import music_run2 as m, sys
from concurrent.futures import ThreadPoolExecutor
V={
 'el_nb_silent_box':(['silent_a','silent_b'],['instrumental lullaby','solo music box plays the melody clearly in front, single notes','very sparse soft celesta pad underneath','slow, hushed, warm snowy night'],['vocals','drums','loud','busy accompaniment','arpeggios']),
 'el_nb_silent_harp':(['silent_a','silent_b'],['instrumental','solo celesta plays the melody clearly in front, single notes','very soft sustained strings underneath','slow and tender goodnight lullaby'],['vocals','drums','loud','busy accompaniment']),
 'el_es_wish_workshop':(['wish104']*3,['instrumental','solo glockenspiel and pizzicato strings play the melody clearly in front','light fingerpicked guitar underneath','warm cozy workshop, cheerful'],['vocals','heavy drums','loud','busy accompaniment']),
}
att=int(sys.argv[1])
with ThreadPoolExecutor(2) as ex:
    for tid,res in zip(V, ex.map(lambda t: m.compose(t,V[t][0],V[t][1],V[t][2],att), V)): print(tid,res,flush=True)
