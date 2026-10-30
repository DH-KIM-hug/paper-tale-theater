/* 동화별 캐릭터 스티커 세트 — 동화마다 10칸. 기존 스프라이트 + 새로 그릴 칸(img: null, plan: true).
   · 받는 순서 = 이 배열 순서에서 img 가 있는 것만. img 가 없는 칸은 받을 수 없고 화면에 보이지도 않는다(그림이 들어오면 보임).
   · 새 그림은 assets/stickers/<동화id>/<k>.webp 로 두고 img 만 채운다. k 는 소문자·숫자·밑줄 40자 이하(서버가 같은 규칙으로 검사).
   · 가족·실제 아이를 바탕으로 한 인물(구름 공장의 아이들·강아지, 빨간 자동차의 이현이, 유니콘의 다현이)은 처음 만들 때 공개 콘텐츠 규칙(CLAUDE.md §1)에 따라 넣지 않았다.
     2026-10-27 사용자 결정으로 창작 동화 넷은 스티커에도 아이 캐릭터를 쓸 수 있다(사탕 마녀의 핼러윈은 다현이 포함). */
const STICKERS = {
  patjuk: [
    { k: 'granny_cheer', img: 'assets/v3w/pj3_granny_cheer.webp', ko: '할머니(만세)', en: 'Granny (cheering)' },
    { k: 'tiger_stand', img: 'assets/v3w/pj3_tiger_stand.webp', ko: '호랑이(서기)', en: 'Tiger (standing)' },
    { k: 'tiger_fallen', img: 'assets/v3w/pj3_tiger_fallen.webp', ko: '호랑이(넘어짐)', en: 'Tiger (fallen)' },
    { k: 'granny_scared', img: 'assets/v3w/pj3_granny_scared.webp', ko: '할머니(놀람)', en: 'Granny (scared)' },
    { k: 'friend_bam', img: 'assets/v3w/pj3_friend_bam.webp', ko: '밤', en: 'Chestnut' },
    { k: 'friend_jara', img: 'assets/v3w/pj3_friend_jara.webp', ko: '자라', en: 'Turtle' },
    { k: 'friend_jeolgu', img: 'assets/v3w/pj3_friend_jeolgu.webp', ko: '절구', en: 'Mortar' },
    { k: 'granny_offer', img: null, plan: true, ko: '할머니(팥죽 주기)', en: 'Granny (offering porridge)' },  // 새 그림: 팥죽 그릇을 두 손으로 내미는 할머니
    { k: 'tiger_bow', img: null, plan: true, ko: '호랑이(혹 난 얼굴)', en: 'Tiger (bump)' },  // 새 그림: 머리에 반창고 붙이고 고개 숙인 호랑이
    { k: 'tiger_happy', img: null, plan: true, ko: '호랑이(좋아함)', en: 'Tiger (happy)' },  // 새 그림: 팥죽을 먹고 활짝 웃는 호랑이
  ],
  frog: [
    { k: 'ox_stand', img: 'assets/v3w/frog_ox_stand.webp', ko: '황소(서기)', en: 'Ox (standing)' },
    { k: 'baby_awake', img: 'assets/v3w/frog_baby_awake.webp', ko: '아기 개구리(깸)', en: 'Baby frog (awake)' },
    { k: 'mom', img: 'assets/v3w/frog_mom.webp', ko: '엄마 개구리', en: 'Mother frog' },
    { k: 'mom_puffed', img: 'assets/v3w/frog_mom_puffed.webp', ko: '엄마 개구리(배 부풀림)', en: 'Mother frog (puffed up)' },
    { k: 'ox_jumpfail', img: 'assets/v3w/frog_ox_jumpfail.webp', ko: '황소(허둥지둥)', en: 'Ox (flustered)' },
    { k: 'uncle', img: 'assets/v3w/frog_uncle.webp', ko: '아저씨 개구리', en: 'Uncle frog' },
    { k: 'mom_dizzy', img: 'assets/v3w/frog_mom_dizzy.webp', ko: '엄마 개구리(어질)', en: 'Mother frog (dizzy)' },
    { k: 'baby_cover', img: null, plan: true, ko: '아기 개구리(눈 가림)', en: 'Baby frog (covering eyes)' },  // 새 그림: 두 손으로 눈을 가린 아기 개구리
    { k: 'ox_sleep', img: null, plan: true, ko: '황소(쿨쿨)', en: 'Ox (sleeping)' },  // 새 그림: 풀밭에 누워 자는 황소
    { k: 'frogs_wave', img: null, plan: true, ko: '개구리 가족(손 흔들기)', en: 'Frog family (waving)' },  // 새 그림: 엄마와 아기가 나란히 손 흔드는 모습
  ],
  rabbit: [
    { k: 'rabbit_run_c', img: 'assets/v3w/rab_rabbit_run_c.webp', ko: '토끼(달리기)', en: 'Rabbit (running)' },
    { k: 'turtle_walk', img: 'assets/v3w/rab_turtle_walk.webp', ko: '거북이(걷기)', en: 'Turtle (walking)' },
    { k: 'rabbit_congrats_c', img: 'assets/v3w/rab_rabbit_congrats_c.webp', ko: '토끼(축하)', en: 'Rabbit (congratulating)' },
    { k: 'turtle_medal', img: 'assets/v3w/rab_turtle_medal.webp', ko: '거북이(메달)', en: 'Turtle (medal)' },
    { k: 'rabbit_sleep_c', img: 'assets/v3w/rab_rabbit_sleep_c.webp', ko: '토끼(쿨쿨)', en: 'Rabbit (sleeping)' },
    { k: 'raccoon', img: 'assets/v3w/rab_raccoon.webp', ko: '너구리 심판', en: 'Raccoon referee' },
    { k: 'rabbit_wake_c', img: 'assets/v3w/rab_rabbit_wake_c.webp', ko: '토끼(깜짝 깸)', en: 'Rabbit (waking up)' },
    { k: 'owl_post', img: null, plan: true, ko: '올빼미 우체부', en: 'Owl postman' },  // 새 그림: 편지 가방을 멘 올빼미가 날개를 펴는 모습
    { k: 'sheep_cheer', img: null, plan: true, ko: '양(응원)', en: 'Sheep (cheering)' },  // 새 그림: 관객석에서 두 팔 들고 응원하는 양
    { k: 'turtle_happy', img: null, plan: true, ko: '거북이(좋아함)', en: 'Turtle (happy)' },  // 새 그림: 당근 트로피를 안고 웃는 거북이
  ],
  sunmoon: [
    { k: 'boy', img: 'assets/v3w/sm_boy.webp', ko: '오빠', en: 'Brother' },
    { k: 'girl', img: 'assets/v3w/sm_girl.webp', ko: '동생', en: 'Sister' },
    { k: 'mom_wave', img: 'assets/v3w/sm_mom_wave.webp', ko: '엄마(손 흔들기)', en: 'Mother (waving)' },
    { k: 'tiger', img: 'assets/v3w/sm_tiger.webp', ko: '호랑이', en: 'Tiger' },
    { k: 'tiger_slip', img: 'assets/v3w/sm_tiger_slip.webp', ko: '호랑이(미끄러짐)', en: 'Tiger (slipping)' },
    { k: 'tiger_scarf', img: 'assets/v3w/sm_tiger_scarf.webp', ko: '호랑이(엄마 흉내)', en: 'Tiger (as mother)' },
    { k: 'kids_hug', img: 'assets/v3w/sm_kids_hug.webp', ko: '오누이(꼭 안기)', en: 'Siblings (hugging)' },
    { k: 'boy_sun', img: null, plan: true, ko: '오빠(해님)', en: 'Brother (sun)' },  // 새 그림: 밝은 해님 모자를 쓴 오빠
    { k: 'girl_moon', img: null, plan: true, ko: '동생(달님)', en: 'Sister (moon)' },  // 새 그림: 초승달 머리띠를 쓴 동생
    { k: 'tiger_sad', img: null, plan: true, ko: '호랑이(풀 죽음)', en: 'Tiger (sad)' },  // 새 그림: 밧줄을 놓치고 풀 죽은 호랑이
  ],
  sun_wind: [
    { k: 'trav_walk', img: 'assets/v3w/sw_trav_walk.webp', ko: '나그네(걷기)', en: 'Traveler (walking)' },
    { k: 'sun', img: 'assets/v3w/sw_sun.webp', ko: '해님', en: 'Sun' },
    { k: 'wind', img: 'assets/v3w/sw_wind.webp', ko: '바람', en: 'Wind' },
    { k: 'wind_blow', img: 'assets/v3w/sw_wind_blow.webp', ko: '바람(후!)', en: 'Wind (blowing)' },
    { k: 'wind_tired', img: 'assets/v3w/sw_wind_tired.webp', ko: '바람(지침)', en: 'Wind (tired)' },
    { k: 'trav_hold', img: 'assets/v3w/sw_trav_hold.webp', ko: '나그네(꽉 여밈)', en: 'Traveler (holding coat)' },
    { k: 'trav_shirt', img: 'assets/v3w/sw_trav_shirt.webp', ko: '나그네(셔츠)', en: 'Traveler (in shirt)' },
    { k: 'trav_hat', img: null, plan: true, ko: '나그네(모자 날림)', en: 'Traveler (hat blown)' },  // 새 그림: 바람에 모자를 붙잡는 나그네
    { k: 'sun_beam', img: null, plan: true, ko: '해님(방긋)', en: 'Sun (beaming)' },  // 새 그림: 두 팔을 벌린 듯 빛을 내는 해님
    { k: 'trav_sit', img: null, plan: true, ko: '나그네(쉬는 모습)', en: 'Traveler (resting)' },  // 새 그림: 나무 그늘에 앉아 시원해하는 나그네
  ],
  turnip: [
    { k: 'grandpa_stand', img: 'assets/v3w/tn2_grandpa_stand.webp', ko: '할아버지(서기)', en: 'Grandpa (standing)' },
    { k: 'grandma_cheer', img: 'assets/v3w/tn2_grandma_cheer.webp', ko: '할머니(좋아함)', en: 'Grandma (happy)' },
    { k: 'girl_cheer', img: 'assets/v3w/tn2_girl_cheer.webp', ko: '소녀(좋아함)', en: 'Girl (happy)' },
    { k: 'dog_cheer', img: 'assets/v3w/tn2_dog_cheer.webp', ko: '강아지(좋아함)', en: 'Puppy (happy)' },
    { k: 'cat_cheer', img: 'assets/v3w/tn2_cat_cheer.webp', ko: '고양이(좋아함)', en: 'Cat (happy)' },
    { k: 'mouse_cheer', img: 'assets/v3w/tn2_mouse_cheer.webp', ko: '생쥐(좋아함)', en: 'Mouse (happy)' },
    { k: 'grandpa_fall', img: 'assets/v3w/tn2_grandpa_fall.webp', ko: '할아버지(넘어짐)', en: 'Grandpa (fallen)' },
    { k: 'girl_fall', img: null, plan: true, ko: '소녀(넘어짐)', en: 'Girl (fallen)' },  // 새 그림: 엉덩방아 찧은 소녀
    { k: 'dog_fall', img: null, plan: true, ko: '강아지(넘어짐)', en: 'Puppy (fallen)' },  // 새 그림: 벌러덩 누운 강아지
    { k: 'mouse_fall', img: null, plan: true, ko: '생쥐(넘어짐)', en: 'Mouse (fallen)' },  // 새 그림: 데구루루 구른 생쥐
  ],
  lion_mouse: [
    { k: 'lion_stand', img: 'assets/v3w/lm_lion_stand.webp', ko: '사자(서기)', en: 'Lion (standing)' },
    { k: 'lion_head_laugh', img: 'assets/v3w/lm_lion_head_laugh.webp', ko: '사자(웃음)', en: 'Lion (laughing)' },
    { k: 'lion_lie_awake', img: 'assets/v3w/lm_lion_lie_awake.webp', ko: '사자(걱정)', en: 'Lion (worried)' },
    { k: 'lion_sleep', img: 'assets/v3w/lm_lion_sleep.webp', ko: '사자(쿨쿨)', en: 'Lion (sleeping)' },
    { k: 'mouse_walk', img: 'assets/v3w/lm_mouse_walk.webp', ko: '생쥐(걷기)', en: 'Mouse (walking)' },
    { k: 'mouse_pray', img: 'assets/v3w/lm_mouse_pray.webp', ko: '생쥐(부탁)', en: 'Mouse (pleading)' },
    { k: 'mouse_gnaw', img: 'assets/v3w/lm_mouse_gnaw.webp', ko: '생쥐(갉기)', en: 'Mouse (gnawing)' },
    { k: 'lion_happy', img: null, plan: true, ko: '사자(고마워함)', en: 'Lion (thankful)' },  // 새 그림: 풀려나 활짝 웃는 사자
    { k: 'mouse_cheer', img: null, plan: true, ko: '생쥐(좋아함)', en: 'Mouse (happy)' },  // 새 그림: 두 팔 들고 폴짝 뛰는 생쥐
    { k: 'friends', img: null, plan: true, ko: '사자와 생쥐(나란히)', en: 'Lion and mouse (together)' },  // 새 그림: 나란히 앉은 두 친구
  ],
  fox_crane: [
    { k: 'fox_stand', img: 'assets/v3w/fc_fox_stand.webp', ko: '여우(서기)', en: 'Fox (standing)' },
    { k: 'crane_sorry', img: 'assets/v3w/fc_crane_sorry.webp', ko: '두루미(서기)', en: 'Crane (standing)' },
    { k: 'fox_lick', img: 'assets/v3w/fc_fox_lick.webp', ko: '여우(핥기)', en: 'Fox (licking)' },
    { k: 'fox_sorry', img: 'assets/v3w/fc_fox_sorry.webp', ko: '여우(미안)', en: 'Fox (sorry)' },
    { k: 'crane_sad', img: 'assets/v3w/fc_crane_sad.webp', ko: '두루미(시무룩)', en: 'Crane (sad)' },
    { k: 'duck', img: 'assets/v3w/fc_duck.webp', ko: '오리', en: 'Duck' },
    { k: 'crane_happy', img: null, plan: true, ko: '두루미(좋아함)', en: 'Crane (happy)' },  // 새 그림: 호리병 음식을 맛있게 먹는 두루미
    { k: 'fox_stuck', img: null, plan: true, ko: '여우(머리 끼임)', en: 'Fox (stuck)' },  // 새 그림: 호리병에 주둥이가 닿지 않아 끙끙대는 여우
    { k: 'friends', img: null, plan: true, ko: '여우와 두루미(화해)', en: 'Fox and crane (friends)' },  // 새 그림: 나란히 앉아 웃는 두 친구
    { k: 'fox_surprise', img: null, plan: true, ko: '여우(놀람)', en: 'Fox (surprised)' },  // 새 그림: 눈이 동그래진 여우
  ],
  goldilocks: [
    { k: 'goldi_walk_empty', img: 'assets/v3w/gl_goldi_walk_empty.webp', ko: '골디락스(서기)', en: 'Goldilocks (standing)' },
    { k: 'bear_dad', img: 'assets/v3w/gl_bear_dad.webp', ko: '아빠 곰', en: 'Papa bear' },
    { k: 'bear_mom', img: 'assets/v3w/gl_bear_mom.webp', ko: '엄마 곰', en: 'Mama bear' },
    { k: 'bear_baby', img: 'assets/v3w/gl_bear_baby.webp', ko: '아기 곰', en: 'Baby bear' },
    { k: 'goldi_surprised', img: 'assets/v3w/gl_goldi_surprised.webp', ko: '골디락스(놀람)', en: 'Goldilocks (surprised)' },
    { k: 'bear_baby_cry', img: 'assets/v3w/gl_bear_baby_cry.webp', ko: '아기 곰(울상)', en: 'Baby bear (crying)' },
    { k: 'goldi_side_sleep', img: 'assets/v3w/gl_goldi_side_sleep.webp', ko: '골디락스(쿨쿨)', en: 'Goldilocks (sleeping)' },
    { k: 'goldi_tongue', img: null, plan: true, ko: '골디락스(뜨거워!)', en: 'Goldilocks (hot!)' },  // 새 그림: 혀를 내민 골디락스
    { k: 'bear_dad_surprise', img: null, plan: true, ko: '아빠 곰(놀람)', en: 'Papa bear (surprised)' },  // 새 그림: 의자를 보고 놀란 아빠 곰
    { k: 'goldi_sorry', img: null, plan: true, ko: '골디락스(미안)', en: 'Goldilocks (sorry)' },  // 새 그림: 손을 모으고 미안해하는 골디락스
  ],
  bremen: [
    { k: 'donkey', img: 'assets/v3w/br_donkey.webp', ko: '당나귀', en: 'Donkey' },
    { k: 'donkey_sing', img: 'assets/v3w/br_donkey_sing.webp', ko: '당나귀(노래)', en: 'Donkey (singing)' },
    { k: 'dog_sing', img: 'assets/v3w/br_dog_sing.webp', ko: '개(노래)', en: 'Dog (singing)' },
    { k: 'cat_sing', img: 'assets/v3w/br_cat_sing.webp', ko: '고양이(노래)', en: 'Cat (singing)' },
    { k: 'rooster_sing', img: 'assets/v3w/br_rooster_sing.webp', ko: '수탉(노래)', en: 'Rooster (singing)' },
    { k: 'robber_brown', img: 'assets/v3w/br_robber_brown.webp', ko: '도둑 갈색', en: 'Robber (brown)' },
    { k: 'robber_green', img: 'assets/v3w/br_robber_green.webp', ko: '도둑 초록', en: 'Robber (green)' },
    { k: 'dog_tired', img: null, plan: true, ko: '개(지침)', en: 'Dog (tired)' },  // 새 그림: 혀를 내밀고 지친 개
    { k: 'cat_sad', img: null, plan: true, ko: '고양이(시무룩)', en: 'Cat (sad)' },  // 새 그림: 쪼그려 앉은 고양이
    { k: 'animals_stack', img: null, plan: true, ko: '동물 탑', en: 'Animal stack' },  // 새 그림: 당나귀 위에 개·고양이·수탉이 쌓인 모습
  ],
  ant_grasshopper: [
    { k: 'ant_stand', img: 'assets/v3w/ag_ant_stand.webp', ko: '개미(서기)', en: 'Ant (standing)' },
    { k: 'ant_carry', img: 'assets/v3w/ag_ant_carry.webp', ko: '개미(알곡 옮기기)', en: 'Ant (carrying)' },
    { k: 'hopper_play', img: 'assets/v3w/ag_hopper_play.webp', ko: '베짱이(연주)', en: 'Grasshopper (playing)' },
    { k: 'hopper_shiver', img: 'assets/v3w/ag_hopper_shiver.webp', ko: '베짱이(덜덜)', en: 'Grasshopper (shivering)' },
    { k: 'hopper_winter', img: 'assets/v3w/ag_hopper_winter.webp', ko: '베짱이(겨울옷)', en: 'Grasshopper (winter)' },
    { k: 'ant_winter', img: 'assets/v3w/ag_ant_winter.webp', ko: '개미(겨울옷)', en: 'Ant (winter)' },
    { k: 'ant_coat', img: 'assets/v3w/ag_ant_coat.webp', ko: '개미(외투)', en: 'Ant (in coat)' },
    { k: 'hopper_happy', img: null, plan: true, ko: '베짱이(좋아함)', en: 'Grasshopper (happy)' },  // 새 그림: 따뜻한 집에서 웃는 베짱이
    { k: 'ant_offer', img: null, plan: true, ko: '개미(나눠 줌)', en: 'Ant (sharing)' },  // 새 그림: 알곡을 내미는 개미
    { k: 'hopper_sorry', img: null, plan: true, ko: '베짱이(미안)', en: 'Grasshopper (sorry)' },  // 새 그림: 고개 숙인 베짱이
  ],
  ugly_duckling: [
    { k: 'baby', img: 'assets/v3w/ud_baby.webp', ko: '아기 오리', en: 'Duckling' },
    { k: 'baby_happy', img: 'assets/v3w/ud_baby_happy.webp', ko: '아기 오리(좋아함)', en: 'Duckling (happy)' },
    { k: 'baby_sad', img: 'assets/v3w/ud_baby_sad.webp', ko: '아기 오리(슬픔)', en: 'Duckling (sad)' },
    { k: 'young_sad', img: 'assets/v3w/ud_young_sad.webp', ko: '어린 새(덜덜)', en: 'Young bird (trembling)' },
    { k: 'young_happy', img: 'assets/v3w/ud_young_happy.webp', ko: '어린 새(좋아함)', en: 'Young bird (happy)' },
    { k: 'swan', img: 'assets/v3w/ud_swan.webp', ko: '백조', en: 'Swan' },
    { k: 'swan_fly', img: 'assets/v3w/ud_swan_fly.webp', ko: '백조(날기)', en: 'Swan (flying)' },
    { k: 'hen', img: null, plan: true, ko: '암탉', en: 'Hen' },  // 새 그림: 쌀쌀맞게 쳐다보는 암탉
    { k: 'goose', img: null, plan: true, ko: '기러기', en: 'Goose' },  // 새 그림: 하늘을 보는 기러기
    { k: 'grandma', img: null, plan: true, ko: '할머니', en: 'Old woman' },  // 새 그림: 빵을 든 할머니
  ],
  three_pigs: [
    { k: 'pig1_base', img: 'assets/v3w/tp_pig1_base.webp', ko: '첫째 돼지', en: 'First pig' },
    { k: 'pig2_base', img: 'assets/v3w/tp_pig2_base.webp', ko: '둘째 돼지', en: 'Second pig' },
    { k: 'pig3_base', img: 'assets/v3w/tp_pig3_base.webp', ko: '셋째 돼지', en: 'Third pig' },
    { k: 'pig1_flee', img: 'assets/v3w/tp_pig1_flee.webp', ko: '첫째 돼지(도망)', en: 'First pig (running)' },
    { k: 'pig2_play', img: 'assets/v3w/tp_pig2_play.webp', ko: '둘째 돼지(바이올린)', en: 'Second pig (fiddle)' },
    { k: 'wolf_puff', img: 'assets/v3w/tp_wolf_puff.webp', ko: '늑대(후!)', en: 'Wolf (huffing)' },
    { k: 'wolf_tired', img: 'assets/v3w/tp_wolf_tired.webp', ko: '늑대(지침)', en: 'Wolf (tired)' },
    { k: 'mama', img: null, plan: true, ko: '엄마 돼지', en: 'Mama pig' },  // 새 그림: 바구니를 든 엄마 돼지
    { k: 'pig3_cheer', img: null, plan: true, ko: '셋째 돼지(좋아함)', en: 'Third pig (happy)' },  // 새 그림: 벽돌집 앞에서 두 팔 든 셋째
    { k: 'pigs_together', img: null, plan: true, ko: '돼지 삼형제', en: 'Three pigs' },  // 새 그림: 나란히 선 세 마리
  ],
  wolf_goats: [
    { k: 'mama_basket', img: 'assets/v3w/wg_mama_basket.webp', ko: '엄마 염소', en: 'Mama goat' },
    { k: 'kid1_joy', img: 'assets/v3w/wg_kid1_joy.webp', ko: '첫째 염소(폴짝)', en: 'First kid (hopping)' },
    { k: 'kid2_joy', img: 'assets/v3w/wg_kid2_joy.webp', ko: '둘째 염소(폴짝)', en: 'Second kid (hopping)' },
    { k: 'kid5_joy', img: 'assets/v3w/wg_kid5_joy.webp', ko: '다섯째 염소(폴짝)', en: 'Fifth kid (hopping)' },
    { k: 'mama_surprise', img: 'assets/v3w/wg_mama_surprise.webp', ko: '엄마 염소(놀람)', en: 'Mama goat (surprised)' },
    { k: 'wolf_flee', img: 'assets/v3w/wg_wolf_flee.webp', ko: '늑대(도망)', en: 'Wolf (fleeing)' },
    { k: 'wolf_knock', img: 'assets/v3w/wg_wolf_knock.webp', ko: '늑대(똑똑)', en: 'Wolf (knocking)' },
    { k: 'kid7_base', img: null, plan: true, ko: '막내 염소', en: 'Youngest kid' },  // 새 그림: 시계 안에서 빼꼼 나오는 막내
    { k: 'wolf_flour', img: null, plan: true, ko: '늑대(밀가루)', en: 'Wolf (floured)' },  // 새 그림: 하얀 앞발을 보여 주는 늑대
    { k: 'kids_hug', img: null, plan: true, ko: '엄마와 아기 염소', en: 'Mama and kids' },  // 새 그림: 엄마를 꼭 안은 아기 염소들
  ],
  kongjwi: [
    { k: 'kong_hoe', img: 'assets/v3w/kj_kong_hoe.webp', ko: '콩쥐(호미질)', en: 'Kongjwi (hoeing)' },
    { k: 'kong_wet', img: 'assets/v3w/kj_kong_wet.webp', ko: '콩쥐(물 젖음)', en: 'Kongjwi (wet)' },
    { k: 'kong_bride', img: 'assets/v3w/kj_kong_bride.webp', ko: '콩쥐(새색시)', en: 'Kongjwi (bride)' },
    { k: 'ox_stand', img: 'assets/v3w/kj_ox_stand.webp', ko: '검은 소', en: 'Black ox' },
    { k: 'fairy_float', img: 'assets/v3w/kj_fairy_float.webp', ko: '선녀', en: 'Fairy' },
    { k: 'toad_idle', img: 'assets/v3w/kj_toad_idle.webp', ko: '두꺼비', en: 'Toad' },
    { k: 'pat_dressed', img: 'assets/v3w/kj_pat_dressed.webp', ko: '팥쥐', en: 'Patjwi' },
    { k: 'sparrow', img: null, plan: true, ko: '참새', en: 'Sparrow' },  // 새 그림: 쌀을 쪼는 참새
    { k: 'kong_joy', img: null, plan: true, ko: '콩쥐(좋아함)', en: 'Kongjwi (happy)' },  // 새 그림: 꽃신을 안고 웃는 콩쥐
    { k: 'stepmother', img: null, plan: true, ko: '새엄마', en: 'Stepmother' },  // 새 그림: 부채를 든 새엄마
  ],
  kkultteok: [
    { k: 'dark_march', img: 'assets/v3w/cf4_dark_march.webp', ko: '먹구름(행진)', en: 'Dark cloud (marching)' },
    { k: 'baby_up', img: 'assets/v3w/cf4_baby_up.webp', ko: '아기 구름(위로)', en: 'Baby cloud (looking up)' },
    { k: 'baby_white', img: 'assets/v3w/cf4_baby_white.webp', ko: '하얀 아기 구름', en: 'White baby cloud' },
    { k: 'baby_huddle', img: 'assets/v3w/cf4_baby_huddle.webp', ko: '아기 구름(웅크림)', en: 'Baby cloud (huddled)' },
    { k: 'baby_wide', img: 'assets/v3w/cf4_baby_wide.webp', ko: '아기 구름(둥실)', en: 'Baby cloud (floating)' },
    { k: 'dark_bump', img: 'assets/v3w/cf4_dark_bump.webp', ko: '먹구름(쿵)', en: 'Dark cloud (bump)' },
    { k: 'baby_sorry', img: 'assets/v3w/cf4_baby_sorry.webp', ko: '아기 구름(미안)', en: 'Baby cloud (sorry)' },
    { k: 'cloud_rabbit', img: null, plan: true, ko: '토끼 구름', en: 'Rabbit cloud' },  // 새 그림: 토끼 모양으로 변한 구름
    { k: 'cloud_fish', img: null, plan: true, ko: '물고기 구름', en: 'Fish cloud' },  // 새 그림: 물고기 모양으로 변한 구름
    { k: 'rainbow_cloud', img: null, plan: true, ko: '무지개 구름', en: 'Rainbow cloud' },  // 새 그림: 무지개 띠를 두른 구름
  ],
  hansel: [
    { k: 'hans_joy', img: 'assets/v3w/hg_hans_joy.webp', ko: '헨젤(좋아함)', en: 'Hansel (happy)' },
    { k: 'gret_clever', img: 'assets/v3w/hg_gret_clever.webp', ko: '그레텔(생각)', en: 'Gretel (thinking)' },
    { k: 'gret_eat', img: 'assets/v3w/hg_gret_eat.webp', ko: '그레텔(냠냠)', en: 'Gretel (eating)' },
    { k: 'hans_doze', img: 'assets/v3w/hg_hans_doze.webp', ko: '헨젤(졸음)', en: 'Hansel (dozing)' },
    { k: 'witch_beckon', img: 'assets/v3w/hg_witch_beckon.webp', ko: '마녀(손짓)', en: 'Witch (beckoning)' },
    { k: 'father', img: 'assets/v3w/hg_father.webp', ko: '아버지', en: 'Father' },
    { k: 'bird_peck', img: 'assets/v3w/hg_bird_peck.webp', ko: '파랑새', en: 'Bluebird' },
    { k: 'gret_joy', img: null, plan: true, ko: '그레텔(좋아함)', en: 'Gretel (happy)' },  // 새 그림: 두 팔을 든 그레텔
    { k: 'hans_walk', img: null, plan: true, ko: '헨젤(걷기)', en: 'Hansel (walking)' },  // 새 그림: 빵 부스러기를 뿌리며 걷는 헨젤
    { k: 'duck', img: null, plan: true, ko: '오리', en: 'Duck' },  // 새 그림: 남매를 태워 주는 오리
  ],
  cinderella: [
    { k: 'cind_stand', img: 'assets/v3w/cd2_cind_stand.webp', ko: '신데렐라(서기)', en: 'Cinderella (standing)' },
    { k: 'cind_gown', img: 'assets/v3w/cd2_cind_gown.webp', ko: '신데렐라(드레스)', en: 'Cinderella (gown)' },
    { k: 'cind_cry', img: 'assets/v3w/cd2_cind_cry.webp', ko: '신데렐라(울음)', en: 'Cinderella (crying)' },
    { k: 'fairy_appear', img: 'assets/v3w/cd2_fairy_appear.webp', ko: '요정 할머니', en: 'Fairy godmother' },
    { k: 'prince_stand', img: 'assets/v3w/cd2_prince_stand.webp', ko: '왕자', en: 'Prince' },
    { k: 'coachman', img: 'assets/v3w/cd2_coachman.webp', ko: '생쥐 마부', en: 'Mouse coachman' },
    { k: 'sis1_proud', img: 'assets/v3w/cd2_sis1_proud.webp', ko: '첫째 언니(뽐냄)', en: 'First sister (proud)' },
    { k: 'cind_joy', img: null, plan: true, ko: '신데렐라(좋아함)', en: 'Cinderella (happy)' },  // 새 그림: 구두를 신고 활짝 웃는 신데렐라
    { k: 'sis2_proud', img: null, plan: true, ko: '둘째 언니(뽐냄)', en: 'Second sister (proud)' },  // 새 그림: 턱을 든 둘째 언니
    { k: 'horse', img: null, plan: true, ko: '하얀 말', en: 'White horse' },  // 새 그림: 마차를 끄는 하얀 말
  ],
  heungbu: [
    { k: 'heung_hello', img: 'assets/v3w/hb_heung_hello.webp', ko: '흥부(인사)', en: 'Heungbu (greeting)' },
    { k: 'heung_glad', img: 'assets/v3w/hb_heung_glad.webp', ko: '흥부(좋아함)', en: 'Heungbu (glad)' },
    { k: 'hwife', img: 'assets/v3w/hb_hwife.webp', ko: '흥부 아내', en: 'Heungbu\'s wife' },
    { k: 'nol_proud', img: 'assets/v3w/hb_nol_proud.webp', ko: '놀부(뽐냄)', en: 'Nolbu (proud)' },
    { k: 'nwife', img: 'assets/v3w/hb_nwife.webp', ko: '놀부 아내', en: 'Nolbu\'s wife' },
    { k: 'swallow_band', img: 'assets/v3w/hb_swallow_band.webp', ko: '제비(다리 띠)', en: 'Swallow (ribbon)' },
    { k: 'swallow_fly', img: 'assets/v3w/hb_swallow_fly.webp', ko: '제비(날기)', en: 'Swallow (flying)' },
    { k: 'heung_saw', img: null, plan: true, ko: '흥부(톱질)', en: 'Heungbu (sawing)' },  // 새 그림: 박을 타는 흥부
    { k: 'nol_ouch', img: null, plan: true, ko: '놀부(아야)', en: 'Nolbu (ouch)' },  // 새 그림: 엉덩방아 찧은 놀부
    { k: 'chick_fall', img: null, plan: true, ko: '아기 제비', en: 'Baby swallow' },  // 새 그림: 둥지 아래로 떨어지는 아기 제비
  ],
  red_hood: [
    { k: 'hood_joy', img: 'assets/v3w/rh_hood_joy.webp', ko: '빨간 모자(좋아함)', en: 'Red Hood (happy)' },
    { k: 'hood_walk', img: 'assets/v3w/rh_hood_walk.webp', ko: '빨간 모자(걷기)', en: 'Red Hood (walking)' },
    { k: 'hood_surprise', img: 'assets/v3w/rh_hood_surprise.webp', ko: '빨간 모자(놀람)', en: 'Red Hood (surprised)' },
    { k: 'granny_pop', img: 'assets/v3w/rh_granny_pop.webp', ko: '할머니(만세)', en: 'Grandma (cheering)' },
    { k: 'hunter_laugh', img: 'assets/v3w/rh_hunter_laugh.webp', ko: '사냥꾼', en: 'Hunter' },
    { k: 'wolf_whisper', img: 'assets/v3w/rh_wolf_whisper.webp', ko: '늑대', en: 'Wolf' },
    { k: 'mama', img: 'assets/v3w/rh_mama.webp', ko: '엄마', en: 'Mama' },
    { k: 'hood_pick', img: null, plan: true, ko: '빨간 모자(꽃 꺾기)', en: 'Red Hood (picking flowers)' },  // 새 그림: 꽃을 꺾는 빨간 모자
    { k: 'wolf_flee', img: null, plan: true, ko: '늑대(도망)', en: 'Wolf (fleeing)' },  // 새 그림: 꼬리를 말고 도망가는 늑대
    { k: 'granny_home', img: null, plan: true, ko: '할머니(책 읽기)', en: 'Grandma (reading)' },  // 새 그림: 의자에 앉은 할머니
  ],
  magpie: [
    { k: 'scholar_walk', img: 'assets/v3w/mg_scholar_walk.webp', ko: '선비(걷기)', en: 'Scholar (walking)' },
    { k: 'mag_dad_sit', img: 'assets/v3w/mg_mag_dad_sit.webp', ko: '아빠 까치', en: 'Father magpie' },
    { k: 'mag_mom_sit', img: 'assets/v3w/mg_mag_mom_sit.webp', ko: '엄마 까치', en: 'Mother magpie' },
    { k: 'chick', img: 'assets/v3w/mg_chick.webp', ko: '아기 까치', en: 'Baby magpie' },
    { k: 'lady_greet', img: 'assets/v3w/mg2_lady_greet.webp', ko: '선녀 같은 여인', en: 'Lady (greeting)' },
    { k: 'snake_flee', img: 'assets/v3w/mg_snake_flee.webp', ko: '구렁이(도망)', en: 'Snake (fleeing)' },
    { k: 'scholar_surprise', img: 'assets/v3w/mg_scholar_surprise.webp', ko: '선비(놀람)', en: 'Scholar (surprised)' },
    { k: 'scholar_bow', img: null, plan: true, ko: '선비(활)', en: 'Scholar (bow)' },  // 새 그림: 활을 겨눈 선비
    { k: 'magpie_fly', img: null, plan: true, ko: '까치(날기)', en: 'Magpie (flying)' },  // 새 그림: 날개를 펴고 나는 까치
    { k: 'magpie_flock', img: null, plan: true, ko: '까치 떼', en: 'Magpie flock' },  // 새 그림: 종을 울리러 모인 까치들
  ],
  magic_jar: [
    { k: 'father_fighta', img: 'assets/v3w/mj_father_fightA.webp', ko: '할아버지', en: 'Grandfather' },
    { k: 'fwife', img: 'assets/v3w/mj_fwife.webp', ko: '할머니', en: 'Grandmother' },
    { k: 'rich_gold', img: 'assets/v3w/mj_rich_gold.webp', ko: '부자(금)', en: 'Rich man (gold)' },
    { k: 'rich_shout', img: 'assets/v3w/mj_rich_shout.webp', ko: '부자(소리침)', en: 'Rich man (shouting)' },
    { k: 'rich_hurry', img: 'assets/v3w/mj_rich_hurry.webp', ko: '부자(허둥지둥)', en: 'Rich man (hurrying)' },
    { k: 'father_fall', img: 'assets/v3w/mj_father_fall.webp', ko: '할아버지(넘어짐)', en: 'Grandfather (fallen)' },
    { k: 'fwife_share', img: 'assets/v3w/mj_fwife_share.webp', ko: '할머니(나눠 줌)', en: 'Grandmother (sharing)' },
    { k: 'father_joy', img: null, plan: true, ko: '할아버지(좋아함)', en: 'Grandfather (happy)' },  // 새 그림: 항아리를 안고 웃는 할아버지
    { k: 'wife_surprise', img: null, plan: true, ko: '할머니(놀람)', en: 'Grandmother (surprised)' },  // 새 그림: 항아리 속 쌀을 보고 놀란 할머니
    { k: 'rich_pinned', img: null, plan: true, ko: '부자(깔림)', en: 'Rich man (stuck)' },  // 새 그림: 금덩이 더미에 앉은 부자
  ],
  byeoljubu: [
    { k: 'rabbit_wave', img: 'assets/v3w/bj_rabbit_wave.webp', ko: '토끼', en: 'Rabbit' },
    { k: 'jara_walk_up', img: 'assets/v3w/bj_jara_walk_up.webp', ko: '자라(별주부)', en: 'Terrapin (Byeoljubu)' },
    { k: 'king_well', img: 'assets/v3w/bj_king_well.webp', ko: '용왕님', en: 'Dragon King' },
    { k: 'octopus_boast', img: 'assets/v3w/bj_octopus_boast.webp', ko: '문어(뻐김)', en: 'Octopus (boasting)' },
    { k: 'doctor', img: 'assets/v3w/bj_doctor.webp', ko: '잉어 의원', en: 'Carp doctor' },
    { k: 'shrimp_painter', img: 'assets/v3w/bj_shrimp_painter.webp', ko: '새우 화공', en: 'Shrimp painter' },
    { k: 'crab_guard', img: 'assets/v3w/bj_crab_guard.webp', ko: '게 병사', en: 'Crab guard' },
    { k: 'squirrel_sit', img: 'assets/v3w/bj_squirrel_sit.webp', ko: '다람쥐', en: 'Squirrel' },
    { k: 'rabbit_hop', img: 'assets/v3w/bj_rabbit_hop.webp', ko: '토끼(깡충)', en: 'Rabbit (hopping)' },
    { k: 'sage_give', img: 'assets/v3w/bj_sage_give.webp', ko: '산신령', en: 'Mountain sage' },
  ],
  red_hen: [   // 기존 동화 스프라이트(2026-10-31)
    { k: 'hen_bread', img: 'assets/v3w/hen_hen_bread.webp', ko: '빨간 암탉(빵)', en: 'Little Red Hen (bread)' },
    { k: 'chick_hop', img: 'assets/v3w/hen_chick_hop.webp', ko: '병아리(폴짝)', en: 'Chick (hopping)' },
    { k: 'cat_raise', img: 'assets/v3w/hen_cat_raise.webp', ko: '고양이', en: 'Cat' },
    { k: 'dog_raise', img: 'assets/v3w/hen_dog_raise.webp', ko: '개', en: 'Dog' },
    { k: 'pig_raise', img: 'assets/v3w/hen_pig_raise.webp', ko: '돼지', en: 'Pig' },
    { k: 'hen_water', img: 'assets/v3w/hen_hen_water.webp', ko: '빨간 암탉(물 주기)', en: 'Little Red Hen (watering)' },
    { k: 'cat_yawn', img: 'assets/v3w/hen_cat_yawn.webp', ko: '고양이(하품)', en: 'Cat (yawning)' },
    { k: 'pig_mud', img: 'assets/v3w/hen_pig_mud.webp', ko: '돼지(진흙)', en: 'Pig (in the mud)' },
    { k: 'dog_lie', img: 'assets/v3w/hen_dog_lie.webp', ko: '개(낮잠)', en: 'Dog (napping)' },
    { k: 'hen_wave', img: 'assets/v3w/hen_hen_wave.webp', ko: '빨간 암탉(인사)', en: 'Little Red Hen (waving)' },
  ],
  snow_white: [
    { k: 'snow_stand', img: 'assets/v3w/sw_snow_stand.webp', ko: '백설공주(서기)', en: 'Snow White (standing)' },
    { k: 'dwarf_smile', img: 'assets/v3w/sw_dwarf_smile.webp', ko: '난쟁이(방긋)', en: 'Dwarf (smiling)' },
    { k: 'dwarf_hammer', img: 'assets/v3w/sw_dwarf_hammer.webp', ko: '난쟁이(망치)', en: 'Dwarf (hammer)' },
    { k: 'snow_awake', img: 'assets/v3w/sw_snow_awake.webp', ko: '백설공주(깸)', en: 'Snow White (awake)' },
    { k: 'snow_flee', img: 'assets/v3w/sw_snow_flee.webp', ko: '백설공주(달리기)', en: 'Snow White (running)' },
    { k: 'queen_mirror', img: 'assets/v3w/sw_queen_mirror.webp', ko: '왕비', en: 'Queen' },
    { k: 'prince', img: 'assets/v3w/sw_prince.webp', ko: '왕자', en: 'Prince' },
    { k: 'snow_eat', img: null, plan: true, ko: '백설공주(냠냠)', en: 'Snow White (eating)' },  // 새 그림: 수프를 먹는 백설공주
    { k: 'dwarfs_row', img: null, plan: true, ko: '일곱 난쟁이', en: 'Seven dwarfs' },  // 새 그림: 나란히 선 일곱 난쟁이
    { k: 'snow_happy', img: null, plan: true, ko: '백설공주(좋아함)', en: 'Snow White (happy)' },  // 새 그림: 난쟁이들과 웃는 공주
  ],
  little_mermaid: [
    { k: 'mer_stand', img: 'assets/v3w/mer_mer_stand.webp', ko: '인어공주(서기)', en: 'Little Mermaid (standing)' },
    { k: 'mer_swim', img: 'assets/v3w/mer_mer_swim.webp', ko: '인어공주(헤엄)', en: 'Little Mermaid (swimming)' },
    { k: 'mer_dance', img: 'assets/v3w/mer_mer_dance.webp', ko: '인어공주(춤)', en: 'Little Mermaid (dancing)' },
    { k: 'mer_sad', img: 'assets/v3w/mer_mer_sad.webp', ko: '인어공주(슬픔)', en: 'Little Mermaid (sad)' },
    { k: 'prince_stand', img: 'assets/v3w/mer_prince_stand.webp', ko: '왕자', en: 'Prince' },
    { k: 'witch_stand', img: 'assets/v3w/mer_witch_stand.webp', ko: '마녀', en: 'Sea witch' },
    { k: 'king', img: 'assets/v3w/mer_king.webp', ko: '바다왕', en: 'Sea king' },
    { k: 'mer_happy', img: null, plan: true, ko: '인어공주(좋아함)', en: 'Little Mermaid (happy)' },  // 새 그림: 두 팔 벌려 웃는 인어공주
    { k: 'sister', img: null, plan: true, ko: '인어 언니', en: 'Mermaid sister' },  // 새 그림: 머리를 빗는 언니
    { k: 'gull', img: null, plan: true, ko: '갈매기', en: 'Seagull' },  // 새 그림: 날개를 펼친 갈매기
  ],
  beauty_beast: [
    { k: 'belle_stand', img: 'assets/v3w/bb_belle_stand.webp', ko: '벨(서기)', en: 'Belle (standing)' },
    { k: 'belle_joy', img: 'assets/v3w/bb_belle_joy.webp', ko: '벨(좋아함)', en: 'Belle (happy)' },
    { k: 'beast_stand', img: 'assets/v3w/bb_beast_stand.webp', ko: '야수(서기)', en: 'Beast (standing)' },
    { k: 'beast_ring', img: 'assets/v3w/bb_beast_ring.webp', ko: '야수(반지)', en: 'Beast (ring)' },
    { k: 'belle_kneel', img: 'assets/v3w/bb_belle_kneel.webp', ko: '벨(무릎)', en: 'Belle (kneeling)' },
    { k: 'father_stand', img: 'assets/v3w/bb_father_stand.webp', ko: '아버지', en: 'Father' },
    { k: 'prince_stand', img: 'assets/v3w/bb_prince_stand.webp', ko: '왕자', en: 'Prince' },
    { k: 'beast_joy', img: null, plan: true, ko: '야수(좋아함)', en: 'Beast (happy)' },  // 새 그림: 장미 앞에서 웃는 야수
    { k: 'sisa_joy', img: null, plan: true, ko: '언니(좋아함)', en: 'Sister (happy)' },  // 새 그림: 두 팔을 든 언니
    { k: 'horse', img: null, plan: true, ko: '말', en: 'Horse' },  // 새 그림: 아버지의 말
  ],
  red_car: [
    { k: 'red_joy', img: 'assets/v3w/rc_red_joy.webp', ko: '빨간 자동차(방긋)', en: 'Red car (smiling)' },
    { k: 'red_run', img: 'assets/v3w/rc_red_run.webp', ko: '빨간 자동차(달리기)', en: 'Red car (running)' },
    { k: 'red_tired', img: 'assets/v3w/rc_red_tired.webp', ko: '빨간 자동차(지침)', en: 'Red car (tired)' },
    { k: 'police_joy', img: 'assets/v3w/rc_police_joy.webp', ko: '경찰차', en: 'Police car' },
    { k: 'fire_joy', img: 'assets/v3w/rc_fire_joy.webp', ko: '소방차', en: 'Fire truck' },
    { k: 'amb_joy', img: 'assets/v3w/rc_amb_joy.webp', ko: '구급차', en: 'Ambulance' },
    { k: 'tow_joy', img: 'assets/v3w/rc_tow_joy.webp', ko: '견인차', en: 'Tow truck' },
    { k: 'thief_a', img: null, plan: true, ko: '도둑(놀람)', en: 'Thief (surprised)' },  // 새 그림: 손을 번쩍 든 도둑
    { k: 'bear', img: null, plan: true, ko: '곰 인형', en: 'Teddy bear' },  // 새 그림: 반창고 붙인 곰 인형
    { k: 'rabbit_doll', img: null, plan: true, ko: '토끼 인형', en: 'Bunny doll' },  // 새 그림: 붕대 감은 토끼 인형
  ],
  unicorn: [
    { k: 'unicorn_stand', img: 'assets/v3w/uc_unicorn_stand.webp', ko: '유니콘(서기)', en: 'Unicorn (standing)' },
    { k: 'sheep_happy', img: 'assets/v3w/uc_sheep_happy.webp', ko: '양(좋아함)', en: 'Sheep (happy)' },
    { k: 'sheep_cry', img: 'assets/v3w/uc_sheep_cry.webp', ko: '양(울상)', en: 'Sheep (crying)' },
    { k: 'deer_hurt', img: 'assets/v3w/uc_deer_hurt.webp', ko: '사슴(아픔)', en: 'Deer (hurt)' },
    { k: 'deer_relief', img: 'assets/v3w/uc_deer_relief.webp', ko: '사슴(다 나음)', en: 'Deer (relieved)' },
    { k: 'horse_happy', img: 'assets/v3w/uc_horse_happy.webp', ko: '말(좋아함)', en: 'Horse (happy)' },
    { k: 'horse_hungry', img: 'assets/v3w/uc_horse_hungry.webp', ko: '말(배고픔)', en: 'Horse (hungry)' },
    { k: 'unicorn_back', img: null, plan: true, ko: '유니콘(뒷모습)', en: 'Unicorn (from behind)' },  // 새 그림: 무지개 갈기를 보이며 돌아선 유니콘
    { k: 'sheep_mom', img: null, plan: true, ko: '엄마 양', en: 'Mother sheep' },  // 새 그림: 방울을 단 엄마 양
    { k: 'sheep_jump', img: null, plan: true, ko: '양(폴짝)', en: 'Sheep (jumping)' },  // 새 그림: 신나서 뛰는 양
  ],
  witch_candy: [  // 다현이 = 사용자 결정(2026-10-28) 공개 예외 — CLAUDE.md §1
    { k: 'kid_stand', img: 'assets/v3w/wc_kid_stand.webp', ko: '다현이(꼬마 마법사)', en: 'Dahyun (little wizard)' },
    { k: 'witch_giggle', img: 'assets/v3w/wc_witch_giggle.webp', ko: '사탕 마녀(키득)', en: 'Candy witch (giggling)' },
    { k: 'cat_sit', img: 'assets/v3w/wc_cat_sit.webp', ko: '호박이', en: 'Pumpkin the cat' },
    { k: 'rabbit_happy', img: 'assets/v3w/wc_rabbit_happy.webp', ko: '토끼(별 망토)', en: 'Rabbit (star cape)' },
    { k: 'bear_happy', img: 'assets/v3w/wc_bear_happy.webp', ko: '곰(호박 옷)', en: 'Bear (pumpkin costume)' },
    { k: 'fox_happy', img: 'assets/v3w/wc_fox_happy.webp', ko: '여우(달 모자)', en: 'Fox (moon hat)' },
    { k: 'tf_strawberry', img: 'assets/v3w/wc_kid_tf_strawberry.webp', ko: '딸기 다현이', en: 'Strawberry Dahyun' },
    { k: 'ghost', img: 'assets/v3w/wc_ghost.webp', ko: '유령', en: 'Ghost' },
    { k: 'pumpkin_lantern', img: 'assets/v3w/wc_prop_pumpkin_lantern.webp', ko: '핼러윈 호박', en: 'Jack-o\'-lantern' },
    { k: 'tf_pumpkin', img: 'assets/v3w/wc_kid_tf_pumpkin.webp', ko: '호박 다현이', en: 'Pumpkin Dahyun' },
  ],
  princess_pea: [
    { k: 'princess_stand', img: 'assets/v3w/pp_princess_stand.webp', ko: '공주(서기)', en: 'Princess (standing)' },
    { k: 'prince_stand', img: 'assets/v3w/pp_prince_stand.webp', ko: '왕자', en: 'Prince' },
    { k: 'queen_smile', img: 'assets/v3w/pp_queen_smile.webp', ko: '왕비', en: 'Queen' },
    { k: 'king_lantern', img: 'assets/v3w/pp_king_lantern.webp', ko: '왕', en: 'King' },
    { k: 'princess_wave', img: 'assets/v3w/pp_princess_wave.webp', ko: '공주(손 흔들기)', en: 'Princess (waving)' },
    { k: 'prince_joy', img: 'assets/v3w/pp_prince_joy.webp', ko: '왕자(좋아함)', en: 'Prince (happy)' },
    { k: 'princess_sleepy', img: 'assets/v3w/pp_princess_sleepy.webp', ko: '공주(졸림)', en: 'Princess (sleepy)' },
    { k: 'prince_sigh', img: null, plan: true, ko: '왕자(한숨)', en: 'Prince (sighing)' },  // 새 그림: 어깨를 떨군 왕자
    { k: 'princess_wet', img: null, plan: true, ko: '공주(비 맞음)', en: 'Princess (wet)' },  // 새 그림: 비에 젖은 공주
    { k: 'queen_hug', img: null, plan: true, ko: '왕비(반김)', en: 'Queen (welcoming)' },  // 새 그림: 두 팔을 벌린 왕비
  ],
  rapunzel: [
    { k: 'rap_stand', img: 'assets/v3w/rp_rap_stand.webp', ko: '라푼젤(서기)', en: 'Rapunzel (standing)' },
    { k: 'rap_joy', img: 'assets/v3w/rp_rap_joy.webp', ko: '라푼젤(좋아함)', en: 'Rapunzel (happy)' },
    { k: 'prince_stand', img: 'assets/v3w/rp_prince_stand.webp', ko: '왕자', en: 'Prince' },
    { k: 'gothel_stand', img: 'assets/v3w/rp_gothel_stand.webp', ko: '고델 할머니', en: 'Old Gothel' },
    { k: 'father_shock', img: 'assets/v3w/rp_father_shock.webp', ko: '아버지(놀람)', en: 'Father (shocked)' },
    { k: 'rap_sing', img: 'assets/v3w/rp_rap_sing.webp', ko: '라푼젤(노래)', en: 'Rapunzel (singing)' },
    { k: 'bird', img: 'assets/v3w/rp_bird.webp', ko: '주황 새', en: 'Orange bird' },
    { k: 'prince_sad', img: null, plan: true, ko: '왕자(슬픔)', en: 'Prince (sad)' },  // 새 그림: 탑 아래서 고개 숙인 왕자
    { k: 'rap_surprise', img: null, plan: true, ko: '라푼젤(놀람)', en: 'Rapunzel (surprised)' },  // 새 그림: 입을 가린 라푼젤
    { k: 'rabbit', img: null, plan: true, ko: '토끼', en: 'Rabbit' },  // 새 그림: 탑 근처 하얀 토끼
  ],
  frog_prince: [
    { k: 'prin_stand', img: 'assets/v3w/fp_prin_stand.webp', ko: '공주(서기)', en: 'Princess (standing)' },
    { k: 'frog_sit', img: 'assets/v3w/fp_frog_sit.webp', ko: '개구리(앉기)', en: 'Frog (sitting)' },
    { k: 'prince_stand', img: 'assets/v3w/fp_prince_stand.webp', ko: '왕자', en: 'Prince' },
    { k: 'king_stand', img: 'assets/v3w/fp_king_stand.webp', ko: '왕', en: 'King' },
    { k: 'prin_cry', img: 'assets/v3w/fp_prin_cry.webp', ko: '공주(울음)', en: 'Princess (crying)' },
    { k: 'frog_hop', img: 'assets/v3w/fp_frog_hop.webp', ko: '개구리(폴짝)', en: 'Frog (hopping)' },
    { k: 'frog_surprise', img: 'assets/v3w/fp_frog_surprise.webp', ko: '개구리(놀람)', en: 'Frog (surprised)' },
    { k: 'prin_joy', img: null, plan: true, ko: '공주(좋아함)', en: 'Princess (happy)' },  // 새 그림: 공을 안고 웃는 공주
    { k: 'frog_ball', img: null, plan: true, ko: '개구리(황금 공)', en: 'Frog (golden ball)' },  // 새 그림: 황금 공을 입에 문 개구리
    { k: 'prince_joy', img: null, plan: true, ko: '왕자(좋아함)', en: 'Prince (happy)' },  // 새 그림: 마법이 풀려 웃는 왕자
  ],
  sleeping_beauty: [
    { k: 'pr_stand', img: 'assets/v3w/sb_pr_stand.webp', ko: '공주(서기)', en: 'Princess (standing)' },
    { k: 'pr_wake', img: 'assets/v3w/sb_pr_wake.webp', ko: '공주(깸)', en: 'Princess (waking)' },
    { k: 'prince_stand', img: 'assets/v3w/sb_prince_stand.webp', ko: '왕자', en: 'Prince' },
    { k: 'king_joy', img: 'assets/v3w/sb_king_joy.webp', ko: '왕(좋아함)', en: 'King (happy)' },
    { k: 'fairy_blue_wand', img: 'assets/v3w/sb_fairy_blue_wand.webp', ko: '파랑 요정', en: 'Blue fairy' },
    { k: 'queen_joy', img: 'assets/v3w/sb_queen_joy.webp', ko: '왕비(좋아함)', en: 'Queen (happy)' },
    { k: 'pr_baby_giggle', img: 'assets/v3w/sb_pr_baby_giggle.webp', ko: '아기 공주', en: 'Baby princess' },
    { k: 'pr_lie', img: null, plan: true, ko: '공주(쿨쿨)', en: 'Princess (sleeping)' },  // 새 그림: 침대에 누워 잠든 공주
    { k: 'fairy_red', img: null, plan: true, ko: '빨강 요정', en: 'Red fairy' },  // 새 그림: 빨간 모자 요정
    { k: 'granny_spin', img: null, plan: true, ko: '할머니(물레)', en: 'Old woman (spinning)' },  // 새 그림: 물레를 돌리는 할머니
  ],
};
