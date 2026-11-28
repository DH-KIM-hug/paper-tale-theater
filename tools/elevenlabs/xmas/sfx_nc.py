# 호두까기 인형 효과음(기획서 §7 표 기준). (id, 장면, 길이초, 프롬프트, 쓰임)
NV=' Purely instrument or object sound. Absolutely no human voice, no laughing, no breathing, no speech, no singing.'
L=[
('el_nc_door_knock','nc 1',1.2,'Three friendly knocks on a wooden front door, warm and clear, toy theatre.'+NV,'1장 문 두드림 똑똑똑'),
('el_nc_door_bell','nc 1',1.8,'A wooden door opening with a small brass bell jingling above it, cozy Christmas house.'+NV,'1장 문 열림 작은 방울'),
('el_nc_box_rustle','nc 2',1.2,'Crisp gift box paper rustling and a cardboard lid sliding, gentle, close-up.'+NV,'2장 상자 종이 사각'),
('el_nc_lid_ding','nc 2',1.5,'A single clear bright glockenspiel ding with a soft shimmer, a present revealed.'+NV,'2장 뚜껑 열림 맑은 딩'),
('el_nc_jaw_crack','nc 3',0.8,'A single dry small wooden crack, like a toy wooden jaw clicking loose, harmless.'+NV,'3장 턱 이음새 딱'),
('el_nc_nut_roll','nc 3',2.0,'A big walnut rolling across a wooden table with a soft rattling roll and stopping, toy-like.'+NV,'3장 호두 또르르'),
('el_nc_cloth_swish','nc 4',1.0,'A soft cotton handkerchief swished and wrapped, gentle fabric swish.'+NV,'4장 손수건 스륵'),
('el_nc_knot_pluck','nc 4',1.0,'A single soft plucked violin string, warm pizzicato note as a knot is tied.'+NV,'4장 매듭 현 튕김'),
('el_nc_basket_set','nc 4',1.0,'A small wicker basket gently set down on a wooden floor, soft creak.'+NV,'4장 바구니 사박'),
('el_nc_clock_bong','nc 5',3.0,'One low gentle grandfather clock chime bong at midnight, warm, long soft ring, not scary.'+NV,'5장 시계 뎅'),
('el_nc_tree_grow','nc 5',2.5,'Pine branches rustling and stretching upward with a soft rising harp glissando, magical and gentle.'+NV,'5장 나뭇가지 바스락'),
('el_nc_wink_ting','nc 5',0.8,'A single tiny high triangle ting, a playful wink.'+NV,'5장 인형 눈짓 팅'),
('el_nc_snare_march','nc 6',2.0,'A short crisp toy snare drum march pattern, small and light, toy soldiers.'+NV,'6장 작은북 행진'),
('el_nc_mouse_pizz','nc 6',1.0,'Three quick high pizzicato string plucks, sneaky and cute, like little mouse ears twitching.'+NV,'6장 생쥐 귀 피치카토'),
('el_nc_slipper_whoosh','nc 7',0.8,'A short low soft whoosh of a slipper flying through the air.'+NV,'7장 슬리퍼 휙'),
('el_nc_slipper_tap','nc 7',0.6,'A soft slipper landing on a rug, a gentle muffled tap.'+NV,'7장 깔개에 톡'),
('el_nc_mice_scurry','nc 7',2.0,'Tiny feet scurrying away across a wooden floor with light pizzicato, cartoon, cute, retreating.'+NV,'7장 꼬리들 도로록'),
('el_nc_cape_flutter','nc 8',1.2,'A cloth cape fluttering open with a soft shimmering whoosh.'+NV,'8장 옷자락 사락'),
('el_nc_warm_chord','nc 8',2.5,'A warm soft major chord on harp and celesta, gentle magical reveal, tender.'+NV,'8장 매듭 보일 때 따뜻한 화음'),
('el_nc_snow_tin','nc 9',1.0,'A delicate tiny celesta tin note like a snowflake landing.'+NV,'9장 눈송이 틴'),
('el_nc_snow_touch','nc 9',1.2,'A very soft powdery snow puff touching a palm, airy and light.'+NV,'9장 손에 닿는 포슬'),
('el_nc_gate_wafer','nc 10',1.5,'Crisp wafer biscuits rustling as a little candy gate swings open, light crunchy rustle.'+NV,'10장 웨이퍼 문 사각'),
('el_nc_tiptoe_ting','nc 10',0.8,'A single sparkling high celesta note, a ballerina on tiptoe.'+NV,'10장 요정 발끝 또롱'),
('el_nc_petal_fold','nc 10',1.2,'A soft paper petal folding closed, delicate rustle.'+NV,'10장 마지막 꽃잎 사락'),
('el_nc_morning_birds','nc 11',4.0,'Light gentle small songbirds chirping outside a window on a calm winter morning, few and soft.'+NV,'11장 아침 새소리'),
('el_nc_transform_shimmer','nc 8',2.0,'A short soft magical shimmer of chimes and a rising harp, a toy turning into a prince, gentle.'+NV,'8장 변신 반짝(원작 마법)'),
]
if __name__=='__main__':
    ids=[x[0] for x in L]; assert len(ids)==len(set(ids)); print(len(L), sum(x[2] for x in L),'초')
