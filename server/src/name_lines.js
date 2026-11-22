// 이름 바꾸기 녹음 템플릿 — tools/elevenlabs/build_name_lines.py 가 생성(손으로 고치지 말 것). 2026-11-22 이름 조각 + 고정 조각 나눠 녹음.
// 줄: id, key(녹음 맵 열쇠 = 한국어 글), keyEn(영어 맵 열쇠, 홈만 영어 글), mode(play|read|both|home), tpl/tplEn(화면 글 템플릿), en(영어 글), g(영어 대명사 자리)
//     ko/enRec: 그 언어 녹음 {seg, segs, voice, model, settings, tag, whole, n(이름 조각 번호|null), send(이름 조각 보낼 글), pieces[{k:S|N|K, tpl, gap, url|urls, slots, g}], orig, url, urlLook, chars, look?}
//     서버는 이름 조각(pieces[n])만 녹음한다(앞뒤 조각 글은 previous_text/next_text 문맥). 고정 조각은 앱 묶음에 있고 기기에서 합친다(engine/names.js)
export const NAME_LINES_VERSION = "nl3-0dfd72af4f";
export const NAME_LINES = {
 "kkultteok": [
  {
   "id": "k60eb756a",
   "key": "해가 쨍쨍한 날, 다현이와 이현이와 은우는 꿀떡이랑 산책을 나가요.",
   "keyEn": "해가 쨍쨍한 날, 다현이와 이현이와 은우는 꿀떡이랑 산책을 나가요.",
   "mode": "both",
   "tpl": "해가 쨍쨍한 날, {A:이와/와} {B:이와/와} {C:이는/는} {D:이랑/랑} 산책을 나가요.",
   "en": "On a sunny day, Dahyun, Ihyun, and Eunwoo go for a walk with Kkulddeok.",
   "tplEn": "On a sunny day, {A_en}, {B_en}, and {C_en} go for a walk with {D_en}.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{A:이와/와} {B:이와/와} {C:이는/는} {D:이랑/랑} 산책을 나가요.",
    "pieces": [
     {
      "k": "S",
      "tpl": "해가 쨍쨍한 날,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/ko_671f44ff05e8.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이와/와} {B:이와/와} {C:이는/는} {D:이랑/랑} 산책을 나가요.",
      "gap": 0,
      "slots": [
       "A",
       "B",
       "C",
       "D"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/c7d67ee2f3.mp3",
    "urlLook": {},
    "chars": 27
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{A_en}, {B_en}, and {C_en} go for a walk with {D_en}.",
    "pieces": [
     {
      "k": "S",
      "tpl": "On a sunny day,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/en_d5fb44a30cd2.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}, {B_en}, and {C_en} go for a walk with {D_en}.",
      "gap": 0,
      "slots": [
       "A",
       "B",
       "C",
       "D"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/df5946597e.mp3",
    "urlLook": {},
    "chars": 55
   },
   "g": []
  },
  {
   "id": "p5ae8bd88",
   "key": "꿀떡이를 톡! 같이 킁킁해 봐요.",
   "keyEn": "꿀떡이를 톡! 같이 킁킁해 봐요.",
   "mode": "play",
   "tpl": "{D:이를/를} 톡! 같이 킁킁해 봐요.",
   "en": "Tap Kkulddeok! Let's sniff together.",
   "tplEn": "Tap {D_en}! Let's sniff together.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이를/를}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이를/를}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "톡! 같이 킁킁해 봐요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_f689fd24e2b6.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/0cddbde61e.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "Tap {D_en}!",
    "pieces": [
     {
      "k": "N",
      "tpl": "Tap {D_en}!",
      "gap": 0.36,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "Let's sniff together.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_054bac88d9ca.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/44121ac4a7.mp3",
    "urlLook": {},
    "chars": 14
   },
   "g": []
  },
  {
   "id": "k476c7859",
   "key": "꿀떡이는 땅에 코를 대고 킁킁.",
   "keyEn": "꿀떡이는 땅에 코를 대고 킁킁.",
   "mode": "both",
   "tpl": "{D:이는/는} 땅에 코를 대고 킁킁.",
   "en": "Kkulddeok puts his nose to the ground. Sniff, sniff.",
   "tplEn": "{D_en} puts his nose to the ground. Sniff, sniff.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "땅에 코를 대고 킁킁.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_342dbb4697f6.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/73d5a49e87.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "puts his nose to the ground. Sniff, sniff.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_f4388f3ca84a.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/2ef909ef7c.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "k1d8dc499",
   "key": "킁킁킁! 꿀떡이가 무슨 냄새를 맡았어요.",
   "keyEn": "킁킁킁! 꿀떡이가 무슨 냄새를 맡았어요.",
   "mode": "both",
   "tpl": "킁킁킁! {D:이가/가} 무슨 냄새를 맡았어요.",
   "en": "Sniff sniff sniff! Kkulddeok smells something.",
   "tplEn": "Sniff sniff sniff! {D_en} smells something.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{D:이가/가}",
    "pieces": [
     {
      "k": "S",
      "tpl": "킁킁킁!",
      "gap": 0.4,
      "url": "audio/el/kkultteok/parts/ko_5349622185d9.mp3"
     },
     {
      "k": "N",
      "tpl": "{D:이가/가}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "무슨 냄새를 맡았어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_26d68259b9ee.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/3525ffd29d.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Sniff sniff sniff!",
      "gap": 0.36,
      "url": "audio/el/kkultteok/parts/en_79ba92b20946.mp3"
     },
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "smells something.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_920e55a059ee.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/33656d7a1d.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "pe9b90278",
   "key": "꿀떡이를 톡! 냄새를 따라가요.",
   "keyEn": "꿀떡이를 톡! 냄새를 따라가요.",
   "mode": "play",
   "tpl": "{D:이를/를} 톡! 냄새를 따라가요.",
   "en": "Tap Kkulddeok! Follow the smell.",
   "tplEn": "Tap {D_en}! Follow the smell.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이를/를}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이를/를}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "톡! 냄새를 따라가요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_237181af26c4.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/5395b1c02a.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "Tap {D_en}!",
    "pieces": [
     {
      "k": "N",
      "tpl": "Tap {D_en}!",
      "gap": 0.36,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "Follow the smell.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_bcbf3f99fdb0.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/22df1f71a1.mp3",
    "urlLook": {},
    "chars": 14
   },
   "g": []
  },
  {
   "id": "k387dc465",
   "key": "\"퐁!\" 은우가 따라 해요.",
   "keyEn": "\"퐁!\" 은우가 따라 해요.",
   "mode": "both",
   "tpl": "\"퐁!\" {C:이가/가} 따라 해요.",
   "en": "Pong! Eunwoo says it too.",
   "tplEn": "Pong! {C_en} says it too.",
   "ko": {
    "seg": 1,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{C:이가/가}",
    "pieces": [
     {
      "k": "K",
      "tpl": "\"퐁!\""
     },
     {
      "k": "N",
      "tpl": "{C:이가/가}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "따라 해요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_3d1d3d124ae6.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/2aaf69451d.mp3",
    "urlLook": {},
    "chars": 3
   },
   "enRec": {
    "seg": 1,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{C_en}",
    "pieces": [
     {
      "k": "K",
      "tpl": "Pong!"
     },
     {
      "k": "N",
      "tpl": "{C_en}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "says it too.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_090a1b63c173.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/573c28f3f6.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k5d5204db",
   "key": "꿀떡이가 문틈에 코를 쏙 밀어 넣어요.",
   "keyEn": "꿀떡이가 문틈에 코를 쏙 밀어 넣어요.",
   "mode": "both",
   "tpl": "{D:이가/가} 문틈에 코를 쏙 밀어 넣어요.",
   "en": "Kkulddeok pokes his nose into the gap in the door.",
   "tplEn": "{D_en} pokes his nose into the gap in the door.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이가/가}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "문틈에 코를 쏙 밀어 넣어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_3fc1dec621d5.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/8e72b7db49.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "pokes his nose into the gap in the door.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_6ac16aa3e569.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/b833dbaf87.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "k95baa84e",
   "key": "이현이가 물방울에 손을 살짝 대 봐요.",
   "keyEn": "이현이가 물방울에 손을 살짝 대 봐요.",
   "mode": "both",
   "tpl": "{B:이가/가} 물방울에 손을 살짝 대 봐요.",
   "en": "Ihyun gently touches a water drop.",
   "tplEn": "{B_en} gently touches a water drop.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{B:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이가/가}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "물방울에 손을 살짝 대 봐요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_a85ef12e3316.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/8f460bf5c2.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently touches a water drop.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_39f55d5466dc.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/656bcd015f.mp3",
    "urlLook": {},
    "chars": 5
   },
   "g": []
  },
  {
   "id": "k4282a73d",
   "key": "다현이는 후우— 바람을 불어 줘요.",
   "keyEn": "다현이는 후우— 바람을 불어 줘요.",
   "mode": "both",
   "tpl": "{A:이는/는} 후우— 바람을 불어 줘요.",
   "en": "Dahyun blows a big breath. Whoooo!",
   "tplEn": "{A_en} blows a big breath. Whoooo!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "후우— 바람을 불어 줘요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_9ab95609e1ab.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/197a0716a1.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "blows a big breath. Whoooo!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_5ca2dd226b1a.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/c947ef3ba0.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "p3c15513d",
   "key": "이현이가 모양 틀을 꾹! 눌러요.",
   "keyEn": "이현이가 모양 틀을 꾹! 눌러요.",
   "mode": "play",
   "tpl": "{B:이가/가} 모양 틀을 꾹! 눌러요.",
   "en": "Ihyun pushes the shape press. Push!",
   "tplEn": "{B_en} pushes the shape press. Push!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{B:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이가/가}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "모양 틀을 꾹! 눌러요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_bf560a04e175.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/c4f6c462ff.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "pushes the shape press. Push!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_408fb9be1140.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/929ddb812f.mp3",
    "urlLook": {},
    "chars": 5
   },
   "g": []
  },
  {
   "id": "k6850ee5c",
   "key": "꿀떡이가 강아지 구름과 코를 맞대요.",
   "keyEn": "꿀떡이가 강아지 구름과 코를 맞대요.",
   "mode": "both",
   "tpl": "{D:이가/가} 강아지 구름과 코를 맞대요.",
   "en": "Kkulddeok touches noses with the puppy cloud.",
   "tplEn": "{D_en} touches noses with the puppy cloud.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이가/가}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "강아지 구름과 코를 맞대요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_6f820f92d422.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/3df1e835a3.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "touches noses with the puppy cloud.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_4860156fb91d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/c2d66eadcf.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "kc1faaff4",
   "key": "은우가 꾹! 눌렀어요.",
   "keyEn": "은우가 꾹! 눌렀어요.",
   "mode": "both",
   "tpl": "{C:이가/가} 꾹! 눌렀어요.",
   "en": "Eunwoo presses it. Push!",
   "tplEn": "{C_en} presses it. Push!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{C:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{C:이가/가}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "꾹! 눌렀어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_08c770666985.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/f6c8b4d78e.mp3",
    "urlLook": {},
    "chars": 3
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{C_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{C_en}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "presses it. Push!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_04742034ad33.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/19e8bd31f5.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "ke1a25ae0",
   "key": "꿀떡이는 축축한 바닥을 킁킁.",
   "keyEn": "꿀떡이는 축축한 바닥을 킁킁.",
   "mode": "both",
   "tpl": "{D:이는/는} 축축한 바닥을 킁킁.",
   "en": "Kkulddeok sniffs the wet floor.",
   "tplEn": "{D_en} sniffs the wet floor.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "축축한 바닥을 킁킁.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_94dcbb5b276b.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/f81a158be6.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "sniffs the wet floor.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_48706022b3cc.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/6ee0296d3b.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "kda18c0b3",
   "key": "꿀떡이가 살금살금 다가가요.",
   "keyEn": "꿀떡이가 살금살금 다가가요.",
   "mode": "both",
   "tpl": "{D:이가/가} 살금살금 다가가요.",
   "en": "Kkulddeok tiptoes closer.",
   "tplEn": "{D_en} tiptoes closer.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이가/가}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "살금살금 다가가요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_6f533439fae1.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/93bd1b7de8.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "tiptoes closer.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_2ae608eda0c2.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/ec1904f546.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "k17eb1234",
   "key": "은우가 아기 먹구름을 살살 쓰다듬어요.",
   "keyEn": "은우가 아기 먹구름을 살살 쓰다듬어요.",
   "mode": "both",
   "tpl": "{C:이가/가} 아기 먹구름을 살살 쓰다듬어요.",
   "en": "Eunwoo gently pats the baby rain cloud.",
   "tplEn": "{C_en} gently pats the baby rain cloud.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{C:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{C:이가/가}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "아기 먹구름을 살살 쓰다듬어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_0adfe67fd496.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/96f4404d07.mp3",
    "urlLook": {},
    "chars": 3
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{C_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{C_en}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently pats the baby rain cloud.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_9c2330ce2285.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/2fa96e54c8.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k5a32dff2",
   "key": "\"첨벙첨벙!\" 이현이도 폴짝 뛰어요.",
   "keyEn": "\"첨벙첨벙!\" 이현이도 폴짝 뛰어요.",
   "mode": "both",
   "tpl": "\"첨벙첨벙!\" {B:이도/도} 폴짝 뛰어요.",
   "en": "Splash, splash! Ihyun jumps too.",
   "tplEn": "Splash, splash! {B_en} jumps too.",
   "ko": {
    "seg": 1,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{B:이도/도}",
    "pieces": [
     {
      "k": "K",
      "tpl": "\"첨벙첨벙!\""
     },
     {
      "k": "N",
      "tpl": "{B:이도/도}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "폴짝 뛰어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_a2fb08e376aa.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/d647c6c691.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": 1,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "K",
      "tpl": "Splash, splash!"
     },
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "jumps too.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_d9c680016863.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/3e744ce7c9.mp3",
    "urlLook": {},
    "chars": 5
   },
   "g": []
  },
  {
   "id": "k1e48132d",
   "key": "꿀떡이는 아기 먹구름 볼을 할짝.",
   "keyEn": "꿀떡이는 아기 먹구름 볼을 할짝.",
   "mode": "both",
   "tpl": "{D:이는/는} 아기 먹구름 볼을 할짝.",
   "en": "Kkulddeok licks the baby cloud's cheek. Lick!",
   "tplEn": "{D_en} licks the baby cloud's cheek. Lick!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "아기 먹구름 볼을 할짝.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_5661b425461e.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/bf46c901c0.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "licks the baby cloud's cheek. Lick!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_80c4822febf3.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/d03d642397.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "ka75345f3",
   "key": "꿀떡이는 하늘을 보고 멍! 멍!",
   "keyEn": "꿀떡이는 하늘을 보고 멍! 멍!",
   "mode": "both",
   "tpl": "{D:이는/는} 하늘을 보고 멍! 멍!",
   "en": "Kkulddeok looks up at the sky. Woof! Woof!",
   "tplEn": "{D_en} looks up at the sky. Woof! Woof!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "하늘을 보고 멍! 멍!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_213710e16d7f.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/4de47458c2.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "looks up at the sky. Woof! Woof!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_5cf905fae377.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/d93ade3784.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "k2b613a6c",
   "key": "꿀떡이는 꼬리를 살랑살랑 흔들어요.",
   "keyEn": "꿀떡이는 꼬리를 살랑살랑 흔들어요.",
   "mode": "both",
   "tpl": "{D:이는/는} 꼬리를 살랑살랑 흔들어요.",
   "en": "Kkulddeok wags his tail, wiggle wiggle.",
   "tplEn": "{D_en} wags his tail, wiggle wiggle.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "꼬리를 살랑살랑 흔들어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_80c0d3c3a11d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/6dd152252f.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "wags his tail, wiggle wiggle.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_692de06c95ed.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/24204c378c.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "k2a71084c",
   "key": "아이들은 꿀떡이랑 물웅덩이에서 첨벙첨벙!",
   "keyEn": "아이들은 꿀떡이랑 물웅덩이에서 첨벙첨벙!",
   "mode": "both",
   "tpl": "아이들은 {D:이랑/랑} 물웅덩이에서 첨벙첨벙!",
   "en": "The three kids and Kkulddeok splash in the puddles!",
   "tplEn": "The three kids and {D_en} splash in the puddles!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "아이들은 {D:이랑/랑}",
    "pieces": [
     {
      "k": "N",
      "tpl": "아이들은 {D:이랑/랑}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "물웅덩이에서 첨벙첨벙!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_993cb72a0f49.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/66f3de73e8.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "The three kids and {D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "The three kids and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "splash in the puddles!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_f162f2c9edbc.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/b3f0efa240.mp3",
    "urlLook": {},
    "chars": 28
   },
   "g": []
  },
  {
   "id": "k37b69725",
   "key": "\"첨벙!\" 은우가 제일 높이 뛰어요.",
   "keyEn": "\"첨벙!\" 은우가 제일 높이 뛰어요.",
   "mode": "both",
   "tpl": "\"첨벙!\" {C:이가/가} 제일 높이 뛰어요.",
   "en": "Splash! Eunwoo jumps the highest.",
   "tplEn": "Splash! {C_en} jumps the highest.",
   "ko": {
    "seg": 1,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{C:이가/가}",
    "pieces": [
     {
      "k": "K",
      "tpl": "\"첨벙!\""
     },
     {
      "k": "N",
      "tpl": "{C:이가/가}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "제일 높이 뛰어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_f806f0a67945.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/c7bc898899.mp3",
    "urlLook": {},
    "chars": 3
   },
   "enRec": {
    "seg": 1,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{C_en}",
    "pieces": [
     {
      "k": "K",
      "tpl": "Splash!"
     },
     {
      "k": "N",
      "tpl": "{C_en}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "jumps the highest.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_7d569b3a2b96.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/4c164570bf.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "kd134be13",
   "key": "꿀떡이는 딸기 냄새를 킁킁.",
   "keyEn": "꿀떡이는 딸기 냄새를 킁킁.",
   "mode": "both",
   "tpl": "{D:이는/는} 딸기 냄새를 킁킁.",
   "en": "Kkulddeok sniffs the strawberry.",
   "tplEn": "{D_en} sniffs the strawberry.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "딸기 냄새를 킁킁.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_5afc04d1b109.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/e2567a76cf.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "sniffs the strawberry.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_97606d5826ec.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/06cc031efe.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "kdf2307bf",
   "key": "꿀떡이는 젖은 흙에 코를 대고 킁킁.",
   "keyEn": "꿀떡이는 젖은 흙에 코를 대고 킁킁.",
   "mode": "both",
   "tpl": "{D:이는/는} 젖은 흙에 코를 대고 킁킁.",
   "en": "Kkulddeok puts his nose to the wet dirt. Sniff, sniff.",
   "tplEn": "{D_en} puts his nose to the wet dirt. Sniff, sniff.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "젖은 흙에 코를 대고 킁킁.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_124a1ec61134.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/8d1af49c7c.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "puts his nose to the wet dirt. Sniff, sniff.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_1ae3a518bd43.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/683a98dbea.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "kc14a53e3",
   "key": "아이들은 꿀떡이랑 왔던 길로 집에 가요.",
   "keyEn": "아이들은 꿀떡이랑 왔던 길로 집에 가요.",
   "mode": "both",
   "tpl": "아이들은 {D:이랑/랑} 왔던 길로 집에 가요.",
   "en": "The three kids and Kkulddeok walk home the way they came.",
   "tplEn": "The three kids and {D_en} walk home the way they came.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "아이들은 {D:이랑/랑}",
    "pieces": [
     {
      "k": "N",
      "tpl": "아이들은 {D:이랑/랑}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "왔던 길로 집에 가요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_d3dc049f7da1.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/a606b77be5.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "The three kids and {D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "The three kids and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "walk home the way they came.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_249175e0471a.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/e648c1648a.mp3",
    "urlLook": {},
    "chars": 28
   },
   "g": []
  },
  {
   "id": "k06efa475",
   "key": "은우가 뒤를 돌아보며 손을 흔들어요. \"퐁!\"",
   "keyEn": "은우가 뒤를 돌아보며 손을 흔들어요. \"퐁!\"",
   "mode": "both",
   "tpl": "{C:이가/가} 뒤를 돌아보며 손을 흔들어요. \"퐁!\"",
   "en": "Eunwoo looks back and waves. Pong!",
   "tplEn": "{C_en} looks back and waves. Pong!",
   "ko": {
    "seg": 0,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{C:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{C:이가/가}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "뒤를 돌아보며 손을 흔들어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_9192456db99b.mp3"
     },
     {
      "k": "K",
      "tpl": "\"퐁!\""
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/39ed91c347.mp3",
    "urlLook": {},
    "chars": 3
   },
   "enRec": {
    "seg": 0,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{C_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{C_en}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "looks back and waves.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_3258503a87d6.mp3"
     },
     {
      "k": "K",
      "tpl": "Pong!"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/bda1de0a54.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k5ed40e7f",
   "key": "꿀떡이는 굴뚝 쪽 바람을 마지막으로 킁킁.",
   "keyEn": "꿀떡이는 굴뚝 쪽 바람을 마지막으로 킁킁.",
   "mode": "both",
   "tpl": "{D:이는/는} 굴뚝 쪽 바람을 마지막으로 킁킁.",
   "en": "Kkulddeok takes one last sniff of the wind from the chimney.",
   "tplEn": "{D_en} takes one last sniff of the wind from the chimney.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "굴뚝 쪽 바람을 마지막으로 킁킁.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_b0030dbb8040.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/d3bcd4255c.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "takes one last sniff of the wind from the chimney.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_123f6c030fdc.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/87c70f1ef6.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "kee47f982",
   "key": "\"잘 자, 아기 구름!\" 다현이와 이현이가 소곤소곤 말했어요.",
   "keyEn": "\"잘 자, 아기 구름!\" 다현이와 이현이가 소곤소곤 말했어요.",
   "mode": "both",
   "tpl": "\"잘 자, 아기 구름!\" {A:이와/와} {B:이가/가} 소곤소곤 말했어요.",
   "en": "\"Good night, little cloud!\" Dahyun and Ihyun whispered.",
   "tplEn": "\"Good night, little cloud!\" {A_en} and {B_en} whispered.",
   "ko": {
    "seg": 1,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{A:이와/와} {B:이가/가}",
    "pieces": [
     {
      "k": "K",
      "tpl": "\"잘 자, 아기 구름!\""
     },
     {
      "k": "N",
      "tpl": "{A:이와/와} {B:이가/가}",
      "gap": 0.05,
      "slots": [
       "A",
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "소곤소곤 말했어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_d0bbf3d4e145.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/4745418fce.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": 1,
    "segs": 2,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "{A_en} and {B_en}",
    "pieces": [
     {
      "k": "K",
      "tpl": "\"Good night, little cloud!\""
     },
     {
      "k": "N",
      "tpl": "{A_en} and {B_en}",
      "gap": 0.05,
      "slots": [
       "A",
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "whispered.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_4ebd7c11022d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/355e4e71ef.mp3",
    "urlLook": {},
    "chars": 16
   },
   "g": []
  },
  {
   "id": "k0eab4118",
   "key": "꿀떡이도 새근새근, 모두 꿈나라로 갔어요.",
   "keyEn": "꿀떡이도 새근새근, 모두 꿈나라로 갔어요.",
   "mode": "both",
   "tpl": "{D:이도/도} 새근새근, 모두 꿈나라로 갔어요.",
   "en": "Kkulddeok breathed softly too, and everyone drifted off to dreamland.",
   "tplEn": "{D_en} breathed softly too, and everyone drifted off to dreamland.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이도/도}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이도/도}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "새근새근, 모두 꿈나라로 갔어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_d41293cdee71.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/bbf9bd88c6.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "breathed softly too, and everyone drifted off to dreamland.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_76d132cdc00d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/d32c4f373b.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "red1f4e5e",
   "key": "아이들과 꿀떡이는 작은 언덕 아래에 왔어요.",
   "keyEn": "아이들과 꿀떡이는 작은 언덕 아래에 왔어요.",
   "mode": "read",
   "tpl": "아이들과 {D:이는/는} 작은 언덕 아래에 왔어요.",
   "en": "The three children and Kkulddeok came to a little hill.",
   "tplEn": "The three children and {D_en} came to a little hill.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "아이들과 {D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "아이들과 {D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "작은 언덕 아래에 왔어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_833d83be333e.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/25bbcff003.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "The three children and {D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "The three children and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "came to a little hill.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_2caa04346b74.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/38f3e3a4d5.mp3",
    "urlLook": {},
    "chars": 32
   },
   "g": []
  },
  {
   "id": "r4c5bf9d1",
   "key": "꿀떡이 꼬리가 살랑살랑, 귀가 쫑긋!",
   "keyEn": "꿀떡이 꼬리가 살랑살랑, 귀가 쫑긋!",
   "mode": "read",
   "tpl": "{D:이/} 꼬리가 살랑살랑, 귀가 쫑긋!",
   "en": "Kkulddeok's tail goes swish, swish, and his ears perk right up!",
   "tplEn": "{D_en}'s tail goes swish, swish, and his ears perk right up!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이/} 꼬리가",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이/} 꼬리가",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "살랑살랑, 귀가 쫑긋!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_6eb57ce9edda.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/7d0e72ba6d.mp3",
    "urlLook": {},
    "chars": 7
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}'s tail",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}'s tail",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "goes swish, swish, and his ears perk right up!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_e985778e5420.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/e382d8aa59.mp3",
    "urlLook": {},
    "chars": 16
   },
   "g": []
  },
  {
   "id": "r928f11a6",
   "key": "다현이는 성큼성큼, 이현이는 씩씩하게, 은우는 아장아장 따라가요.",
   "keyEn": "다현이는 성큼성큼, 이현이는 씩씩하게, 은우는 아장아장 따라가요.",
   "mode": "read",
   "tpl": "{A:이는/는} 성큼성큼, {B:이는/는} 씩씩하게, {C:이는/는} 아장아장 따라가요.",
   "en": "Dahyun takes big strides, Ihyun marches bravely, and Eunwoo toddles along behind.",
   "tplEn": "{A_en} takes big strides, {B_en} marches bravely, and {C_en} toddles along behind.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": true,
    "n": 0,
    "send": "{A:이는/는} 성큼성큼, {B:이는/는} 씩씩하게, {C:이는/는} 아장아장 따라가요.",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는} 성큼성큼, {B:이는/는} 씩씩하게, {C:이는/는} 아장아장 따라가요.",
      "gap": 0,
      "slots": [
       "A",
       "B",
       "C"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/nar_0ff57ae7f5.mp3",
    "urlLook": {},
    "chars": 36
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": true,
    "n": 0,
    "send": "{A_en} takes big strides, {B_en} marches bravely, and {C_en} toddles along behind.",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en} takes big strides, {B_en} marches bravely, and {C_en} toddles along behind.",
      "gap": 0,
      "slots": [
       "A",
       "B",
       "C"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_60d95bafde.mp3",
    "urlLook": {},
    "chars": 81
   },
   "g": []
  },
  {
   "id": "r321f8c20",
   "key": "언덕 꼭대기에 올라, 아이들과 꿀떡이가 걸음을 멈췄어요.",
   "keyEn": "언덕 꼭대기에 올라, 아이들과 꿀떡이가 걸음을 멈췄어요.",
   "mode": "read",
   "tpl": "언덕 꼭대기에 올라, 아이들과 {D:이가/가} 걸음을 멈췄어요.",
   "en": "At the top of the hill, the children and Kkulddeok stopped.",
   "tplEn": "At the top of the hill, the children and {D_en} stopped.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "아이들과 {D:이가/가}",
    "pieces": [
     {
      "k": "S",
      "tpl": "언덕 꼭대기에 올라,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/ko_ee52a9abc7c9.mp3"
     },
     {
      "k": "N",
      "tpl": "아이들과 {D:이가/가}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "걸음을 멈췄어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_1c289fc8a32d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/13f2440e2a.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "the children and {D_en} stopped.",
    "pieces": [
     {
      "k": "S",
      "tpl": "At the top of the hill,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/en_4875f6cd2099.mp3"
     },
     {
      "k": "N",
      "tpl": "the children and {D_en} stopped.",
      "gap": 0,
      "slots": [
       "D"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/88e0cc18d5.mp3",
    "urlLook": {},
    "chars": 35
   },
   "g": []
  },
  {
   "id": "r4b9473d3",
   "key": "꿀떡이는 구름을 보고 멍멍! 짖었어요.",
   "keyEn": "꿀떡이는 구름을 보고 멍멍! 짖었어요.",
   "mode": "read",
   "tpl": "{D:이는/는} 구름을 보고 멍멍! 짖었어요.",
   "en": "Kkulddeok looks at the clouds and barks, woof, woof!",
   "tplEn": "{D_en} looks at the clouds and barks, woof, woof!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "구름을 보고 멍멍! 짖었어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_6e6bb226b691.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/780898f9c2.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "looks at the clouds and barks, woof, woof!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_9b3f0b55dc0f.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/92a4dc4dd8.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "r7599f685",
   "key": "아이들과 꿀떡이는 굴뚝 아래로 내려갔어요.",
   "keyEn": "아이들과 꿀떡이는 굴뚝 아래로 내려갔어요.",
   "mode": "read",
   "tpl": "아이들과 {D:이는/는} 굴뚝 아래로 내려갔어요.",
   "en": "The children and Kkulddeok went down to the foot of the chimney.",
   "tplEn": "The children and {D_en} went down to the foot of the chimney.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "아이들과 {D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "아이들과 {D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "굴뚝 아래로 내려갔어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_5ed48994f625.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/3ee77ff4fa.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "The children and {D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "The children and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "went down to the foot of the chimney.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_f7a246002996.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/2c2b9ebc54.mp3",
    "urlLook": {},
    "chars": 26
   },
   "g": []
  },
  {
   "id": "rbf3eea06",
   "key": "꿀떡이 코가 문틈에서 킁킁, 꼬리가 흔들흔들.",
   "keyEn": "꿀떡이 코가 문틈에서 킁킁, 꼬리가 흔들흔들.",
   "mode": "read",
   "tpl": "{D:이/} 코가 문틈에서 킁킁, 꼬리가 흔들흔들.",
   "en": "Kkulddeok's nose goes sniff, sniff at the gap, and his tail wags back and forth.",
   "tplEn": "{D_en}'s nose goes sniff, sniff at the gap, and his tail wags back and forth.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이/} 코가",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이/} 코가",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "문틈에서 킁킁, 꼬리가 흔들흔들.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_91c5d4feb0be.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/ed22637a12.mp3",
    "urlLook": {},
    "chars": 6
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}'s nose",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}'s nose",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "goes sniff, sniff at the gap, and his tail wags back and forth.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_0e3cec315847.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/1f1a8631e1.mp3",
    "urlLook": {},
    "chars": 16
   },
   "g": []
  },
  {
   "id": "ra016473e",
   "key": "공장 안으로 들어와, 아이들과 꿀떡이는 벨트 앞에 섰어요.",
   "keyEn": "공장 안으로 들어와, 아이들과 꿀떡이는 벨트 앞에 섰어요.",
   "mode": "read",
   "tpl": "공장 안으로 들어와, 아이들과 {D:이는/는} 벨트 앞에 섰어요.",
   "en": "Inside the factory, the children and Kkulddeok stood by a long belt.",
   "tplEn": "Inside the factory, the children and {D_en} stood by a long belt.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "아이들과 {D:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "공장 안으로 들어와,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/ko_c1d23ff6af35.mp3"
     },
     {
      "k": "N",
      "tpl": "아이들과 {D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "벨트 앞에 섰어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_208b45caa54b.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/8a12eec726.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "the children and {D_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Inside the factory,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/en_ffe33e531b53.mp3"
     },
     {
      "k": "N",
      "tpl": "the children and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "stood by a long belt.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_ec2f689f4f94.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/d0b3ddfe79.mp3",
    "urlLook": {},
    "chars": 26
   },
   "g": []
  },
  {
   "id": "r9f1f74a3",
   "key": "아이들과 꿀떡이는 구름 모양을 만드는 기계 앞으로 갔어요.",
   "keyEn": "아이들과 꿀떡이는 구름 모양을 만드는 기계 앞으로 갔어요.",
   "mode": "read",
   "tpl": "아이들과 {D:이는/는} 구름 모양을 만드는 기계 앞으로 갔어요.",
   "en": "The children and Kkulddeok went to a machine that made cloud shapes.",
   "tplEn": "The children and {D_en} went to a machine that made cloud shapes.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "아이들과 {D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "아이들과 {D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "구름 모양을 만드는 기계 앞으로 갔어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_261d31e5722c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/6ac4749cb9.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "The children and {D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "The children and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "went to a machine that made cloud shapes.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_d30c687f2fed.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/4d518fbc42.mp3",
    "urlLook": {},
    "chars": 26
   },
   "g": []
  },
  {
   "id": "r3bd02796",
   "key": "이현이가 모양 틀을 힘껏, 쿵! 내리찍어요.",
   "keyEn": "이현이가 모양 틀을 힘껏, 쿵! 내리찍어요.",
   "mode": "read",
   "tpl": "{B:이가/가} 모양 틀을 힘껏, 쿵! 내리찍어요.",
   "en": "Ihyun pushes the shape press down with all his might. Clunk!",
   "tplEn": "{B_en} pushes the shape press down with all {B_g:his/her} might. Clunk!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{B:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이가/가}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "모양 틀을 힘껏, 쿵! 내리찍어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_7bf48ae75250.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/c7ff8899d2.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "pushes the shape press down with all {B_g:his/her} might. Clunk!",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_3d4a152d9d8b.mp3",
      "urls": {
       "g": "audio/el/kkultteok/parts/en_c0bd8f18b5cb.mp3",
       "b": "audio/el/kkultteok/parts/en_3d4a152d9d8b.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/847378adfa.mp3",
    "urlLook": {
     "Bg": "audio/el/kkultteok/look/Bg/en/name/08dd607337.mp3"
    },
    "chars": 5
   },
   "g": [
    "B"
   ]
  },
  {
   "id": "rba28fe1e",
   "key": "강아지 구름을 따라, 아이들과 꿀떡이가 공장 구석으로 갔어요.",
   "keyEn": "강아지 구름을 따라, 아이들과 꿀떡이가 공장 구석으로 갔어요.",
   "mode": "read",
   "tpl": "강아지 구름을 따라, 아이들과 {D:이가/가} 공장 구석으로 갔어요.",
   "en": "The children and Kkulddeok followed the puppy cloud to a corner.",
   "tplEn": "The children and {D_en} followed the puppy cloud to a corner.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "아이들과 {D:이가/가}",
    "pieces": [
     {
      "k": "S",
      "tpl": "강아지 구름을 따라,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/ko_bf6a81ffd2f2.mp3"
     },
     {
      "k": "N",
      "tpl": "아이들과 {D:이가/가}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "공장 구석으로 갔어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_4e943707e84d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/5bce1d69fc.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "The children and {D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "The children and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "followed the puppy cloud to a corner.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_584bbb473284.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/17d0042009.mp3",
    "urlLook": {},
    "chars": 26
   },
   "g": []
  },
  {
   "id": "r96cc336f",
   "key": "은우가 아장아장 단추 앞으로 다가가요.",
   "keyEn": "은우가 아장아장 단추 앞으로 다가가요.",
   "mode": "read",
   "tpl": "{C:이가/가} 아장아장 단추 앞으로 다가가요.",
   "en": "Eunwoo toddles right up to the button.",
   "tplEn": "{C_en} toddles right up to the button.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{C:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{C:이가/가}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "아장아장 단추 앞으로 다가가요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_96a241270e2b.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/23a657ec8c.mp3",
    "urlLook": {},
    "chars": 3
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{C_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{C_en}",
      "gap": 0.05,
      "slots": [
       "C"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "toddles right up to the button.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_987e290e4d2a.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/40c9aba353.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r230299f0",
   "key": "아이들과 꿀떡이는 종이 있는 방으로 갔어요.",
   "keyEn": "아이들과 꿀떡이는 종이 있는 방으로 갔어요.",
   "mode": "read",
   "tpl": "아이들과 {D:이는/는} 종이 있는 방으로 갔어요.",
   "en": "The children and Kkulddeok went into the room with the bell.",
   "tplEn": "The children and {D_en} went into the room with the bell.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "아이들과 {D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "아이들과 {D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "종이 있는 방으로 갔어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_bc1e99c16545.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/7d6715a2ad.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "The children and {D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "The children and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "went into the room with the bell.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_12fe4172d631.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/25bacdf1e3.mp3",
    "urlLook": {},
    "chars": 26
   },
   "g": []
  },
  {
   "id": "r96f0a178",
   "key": "아이들과 꿀떡이는 먹구름들이 떠난 방에 잠깐 남아 있었어요.",
   "keyEn": "아이들과 꿀떡이는 먹구름들이 떠난 방에 잠깐 남아 있었어요.",
   "mode": "read",
   "tpl": "아이들과 {D:이는/는} 먹구름들이 떠난 방에 잠깐 남아 있었어요.",
   "en": "The children and Kkulddeok stayed in the room after the rain clouds left.",
   "tplEn": "The children and {D_en} stayed in the room after the rain clouds left.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "아이들과 {D:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "아이들과 {D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "먹구름들이 떠난 방에 잠깐 남아 있었어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_985f6e4203b2.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/709d93a6ff.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "The children and {D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "The children and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "stayed in the room after the rain clouds left.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_f7f92008eb42.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/e5a7c3244c.mp3",
    "urlLook": {},
    "chars": 26
   },
   "g": []
  },
  {
   "id": "r79a1ec1c",
   "key": "꿀떡이도 아이들을 따라 공장 밖으로 나왔어요.",
   "keyEn": "꿀떡이도 아이들을 따라 공장 밖으로 나왔어요.",
   "mode": "read",
   "tpl": "{D:이도/도} 아이들을 따라 공장 밖으로 나왔어요.",
   "en": "Kkulddeok followed the children outside the factory.",
   "tplEn": "{D_en} followed the children outside the factory.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D:이도/도}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D:이도/도}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "아이들을 따라 공장 밖으로 나왔어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_8b65e0ddac4d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/e21be7c9b0.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 0,
    "send": "{D_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "followed the children outside the factory.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_fc710826f44c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/866a58b76f.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "r05a33a6d",
   "key": "공장 밖에 나오자, 아이들과 꿀떡이에게 빗방울이 떨어졌어요.",
   "keyEn": "공장 밖에 나오자, 아이들과 꿀떡이에게 빗방울이 떨어졌어요.",
   "mode": "read",
   "tpl": "공장 밖에 나오자, 아이들과 {D:이에게/에게} 빗방울이 떨어졌어요.",
   "en": "Outside the factory, the children and Kkulddeok felt raindrops fall.",
   "tplEn": "Outside the factory, the children and {D_en} felt raindrops fall.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "아이들과 {D:이에게/에게}",
    "pieces": [
     {
      "k": "S",
      "tpl": "공장 밖에 나오자,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/ko_21dd61084931.mp3"
     },
     {
      "k": "N",
      "tpl": "아이들과 {D:이에게/에게}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "빗방울이 떨어졌어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_d5aebb321570.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/a79cfebb23.mp3",
    "urlLook": {},
    "chars": 10
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "the children and {D_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Outside the factory,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/en_4a26edac51c5.mp3"
     },
     {
      "k": "N",
      "tpl": "the children and {D_en}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "felt raindrops fall.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/en_c79977898a7c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/e947f943ad.mp3",
    "urlLook": {},
    "chars": 26
   },
   "g": []
  },
  {
   "id": "r847fbef7",
   "key": "비가 그치자, 아이들과 꿀떡이는 하늘을 올려다봤어요.",
   "keyEn": "비가 그치자, 아이들과 꿀떡이는 하늘을 올려다봤어요.",
   "mode": "read",
   "tpl": "비가 그치자, 아이들과 {D:이는/는} 하늘을 올려다봤어요.",
   "en": "When the rain stopped, the children and Kkulddeok looked up.",
   "tplEn": "When the rain stopped, the children and {D_en} looked up.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "아이들과 {D:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "비가 그치자,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/ko_58c7b00e21d1.mp3"
     },
     {
      "k": "N",
      "tpl": "아이들과 {D:이는/는}",
      "gap": 0.05,
      "slots": [
       "D"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "하늘을 올려다봤어요.",
      "gap": 0,
      "url": "audio/el/kkultteok/parts/ko_88526b1fa59f.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/name/d9708c7535.mp3",
    "urlLook": {},
    "chars": 9
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "",
    "whole": false,
    "n": 1,
    "send": "the children and {D_en} looked up.",
    "pieces": [
     {
      "k": "S",
      "tpl": "When the rain stopped,",
      "gap": 0.22,
      "url": "audio/el/kkultteok/parts/en_3648afa3953c.mp3"
     },
     {
      "k": "N",
      "tpl": "the children and {D_en} looked up.",
      "gap": 0,
      "slots": [
       "D"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/kkultteok/en/name/0d195699b4.mp3",
    "urlLook": {},
    "chars": 37
   },
   "g": []
  }
 ],
 "red_car": [
  {
   "id": "k009e2783",
   "key": "이현이는 빨간 자동차를 참 좋아했어요.",
   "keyEn": "이현이는 빨간 자동차를 참 좋아했어요.",
   "mode": "both",
   "tpl": "{B:이는/는} 빨간 자동차를 참 좋아했어요.",
   "en": "Ihyun loved the little red car very much.",
   "tplEn": "{B_en} loved the little red car very much.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{B:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이는/는}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "빨간 자동차를 참 좋아했어요.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_1cb9caacd0e9.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/3a2a40b462.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "loved the little red car very much.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_a42a6acaa396.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/263ac84006.mp3",
    "urlLook": {},
    "chars": 7
   },
   "g": []
  },
  {
   "id": "k755fc2b4",
   "key": "밥 먹을 때도 냠냠, 잠잘 때도 쌔근, 언제나 손에 꼭 쥐고 있었지요.",
   "keyEn": "밥 먹을 때도 냠냠, 잠잘 때도 쌔근, 언제나 손에 꼭 쥐고 있었지요.",
   "mode": "both",
   "tpl": "밥 먹을 때도 냠냠, 잠잘 때도 쌔근, 언제나 손에 꼭 쥐고 있었지요.",
   "en": "Munch munch at mealtime, snore snore at bedtime, Ihyun always held the red car tight.",
   "tplEn": "Munch munch at mealtime, snore snore at bedtime, {B_en} always held the red car tight.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[warm, playful rhythm, slow]",
    "whole": false,
    "n": 1,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Munch munch at mealtime, snore snore at bedtime,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/en_f2d5f7aefb7b.mp3"
     },
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "always held the red car tight.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_c63e3eb92491.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/fe55716d38.mp3",
    "urlLook": {},
    "chars": 7
   },
   "g": []
  },
  {
   "id": "kd460a014",
   "key": "그러던 어느 날, 밖에서 놀고 있었어요.",
   "keyEn": "그러던 어느 날, 밖에서 놀고 있었어요.",
   "mode": "both",
   "tpl": "그러던 어느 날, 밖에서 놀고 있었어요.",
   "en": "Then one day, Ihyun was playing outside.",
   "tplEn": "Then one day, {B_en} was playing outside.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, light, slow]",
    "whole": false,
    "n": 1,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Then one day,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/en_ad7dc037d9c4.mp3"
     },
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "was playing outside.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_0ff546639895.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/834a24b57d.mp3",
    "urlLook": {},
    "chars": 7
   },
   "g": []
  },
  {
   "id": "k8b89e377",
   "key": "노느라 그만 빨간 자동차를 톡, 놓고 말았어요.",
   "keyEn": "노느라 그만 빨간 자동차를 톡, 놓고 말았어요.",
   "mode": "both",
   "tpl": "노느라 그만 빨간 자동차를 톡, 놓고 말았어요.",
   "en": "Ihyun was so busy playing that the red car slipped out, plop, onto the grass.",
   "tplEn": "{B_en} was so busy playing that the red car slipped out, plop, onto the grass.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[gentle]",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "was so busy playing that the red car slipped out, plop, onto the grass.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_4798b0559b21.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/a1456fbf65.mp3",
    "urlLook": {},
    "chars": 7
   },
   "g": []
  },
  {
   "id": "k08c659ad",
   "key": "빨간 자동차는 홀로 남았어요. 이현이를 찾기로 했어요. 용기 있게 출발!",
   "keyEn": "빨간 자동차는 홀로 남았어요. 이현이를 찾기로 했어요. 용기 있게 출발!",
   "mode": "both",
   "tpl": "빨간 자동차는 홀로 남았어요. {B:이를/를} 찾기로 했어요. 용기 있게 출발!",
   "en": "The little red car, all alone, decided to go and find Ihyun. Off it went, brave and bold!",
   "tplEn": "The little red car, all alone, decided to go and find {B_en}. Off it went, brave and bold!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[warm, building courage, slow then bright at 출발]",
    "whole": false,
    "n": 1,
    "send": "{B:이를/를}",
    "pieces": [
     {
      "k": "S",
      "tpl": "빨간 자동차는 홀로 남았어요.",
      "gap": 0.36,
      "url": "audio/el/red_car/parts/ko_1358bcf2a6bb.mp3"
     },
     {
      "k": "N",
      "tpl": "{B:이를/를}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "찾기로 했어요. 용기 있게 출발!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_f3e0ff3aec7d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/ffb4cb2e21.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[warm, building courage]",
    "whole": false,
    "n": 1,
    "send": "decided to go and find {B_en}.",
    "pieces": [
     {
      "k": "S",
      "tpl": "The little red car, all alone,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/en_d98a6c2e9d94.mp3"
     },
     {
      "k": "N",
      "tpl": "decided to go and find {B_en}.",
      "gap": 0.36,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "Off it went, brave and bold!",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_39b1b0671891.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/317d0aa080.mp3",
    "urlLook": {},
    "chars": 31
   },
   "g": []
  },
  {
   "id": "k9e8e4806",
   "key": "부릉부릉! 이현이를 찾아 장난감 세상으로 가자!",
   "keyEn": "부릉부릉! 이현이를 찾아 장난감 세상으로 가자!",
   "mode": "both",
   "tpl": "부릉부릉! {B:이를/를} 찾아 장난감 세상으로 가자!",
   "en": "Vroom vroom! To find Ihyun, let's go to Toy Land!",
   "tplEn": "Vroom vroom! To find {B_en}, let's go to Toy Land!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small brave voice, cheerful, determined, clear]",
    "whole": false,
    "n": 1,
    "send": "{B:이를/를}",
    "pieces": [
     {
      "k": "S",
      "tpl": "부릉부릉!",
      "gap": 0.4,
      "url": "audio/el/red_car/parts/ko_7f2c16a3c20d.mp3"
     },
     {
      "k": "N",
      "tpl": "{B:이를/를}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "찾아 장난감 세상으로 가자!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_da500bdcedea.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/1ee3188dfd.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small brave voice, cheerful, determined, clear]",
    "whole": false,
    "n": 1,
    "send": "To find {B_en},",
    "pieces": [
     {
      "k": "S",
      "tpl": "Vroom vroom!",
      "gap": 0.36,
      "url": "audio/el/red_car/parts/en_46c9f14d1cf7.mp3"
     },
     {
      "k": "N",
      "tpl": "To find {B_en},",
      "gap": 0.16,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "let's go to Toy Land!",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_e1bb0242f0cd.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/eef9fb6220.mp3",
    "urlLook": {},
    "chars": 16
   },
   "g": []
  },
  {
   "id": "k3bb27b13",
   "key": "어? 너는 이현이가 잃어버렸던 경찰차 형아?!",
   "keyEn": "어? 너는 이현이가 잃어버렸던 경찰차 형아?!",
   "mode": "both",
   "tpl": "어? 너는 {B:이가/가} 잃어버렸던 경찰차 형아?!",
   "en": "Huh? Ihyun's lost police car? Big brother police car!",
   "tplEn": "Huh? {B_en}'s lost police car? Big brother police car!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, surprised, delighted]",
    "whole": false,
    "n": 0,
    "send": "어? 너는 {B:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "어? 너는 {B:이가/가}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "잃어버렸던 경찰차 형아?!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_f4f3ff7dc9ea.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/01980d27ec.mp3",
    "urlLook": {},
    "chars": 10
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, surprised, delighted]",
    "whole": false,
    "n": 1,
    "send": "{B_en}'s lost police car?",
    "pieces": [
     {
      "k": "S",
      "tpl": "Huh?",
      "gap": 0.4,
      "url": "audio/el/red_car/parts/en_bf3f8d35d496.mp3"
     },
     {
      "k": "N",
      "tpl": "{B_en}'s lost police car?",
      "gap": 0.36,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "Big brother police car!",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_2d097637677b.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/2b36a738e0.mp3",
    "urlLook": {},
    "chars": 26
   },
   "g": []
  },
  {
   "id": "ka2f78f43",
   "key": "이현이한테 우리 같이 가자!",
   "keyEn": "이현이한테 우리 같이 가자!",
   "mode": "both",
   "tpl": "{B:이한테/한테} 우리 같이 가자!",
   "en": "Let's go find Ihyun together!",
   "tplEn": "Let's go find {B_en} together!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, eager, inviting]",
    "whole": false,
    "n": 0,
    "send": "{B:이한테/한테}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이한테/한테}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "우리 같이 가자!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_d4228ed76a6f.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/6e8064fce2.mp3",
    "urlLook": {},
    "chars": 5
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, eager, inviting]",
    "whole": true,
    "n": 0,
    "send": "[small voice, eager, inviting] Let's go find {B_en} together!",
    "pieces": [
     {
      "k": "N",
      "tpl": "Let's go find {B_en} together!",
      "gap": 0,
      "slots": [
       "B"
      ],
      "g": []
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/red_1d638a4c56.mp3",
    "urlLook": {},
    "chars": 62
   },
   "g": []
  },
  {
   "id": "kffca6c68",
   "key": "어? 소방차 이모! 이현이 만나러 우리 같이 가요!",
   "keyEn": "어? 소방차 이모! 이현이 만나러 우리 같이 가요!",
   "mode": "both",
   "tpl": "어? 소방차 이모! {B:이/} 만나러 우리 같이 가요!",
   "en": "Oh? Auntie fire truck! Let's find Ihyun! Come with us!",
   "tplEn": "Oh? Auntie fire truck! Let's find {B_en}! Come with us!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, excited, polite]",
    "whole": false,
    "n": 1,
    "send": "{B:이/} 만나러",
    "pieces": [
     {
      "k": "S",
      "tpl": "어? 소방차 이모!",
      "gap": 0.36,
      "url": "audio/el/red_car/parts/ko_7caf4840c294.mp3"
     },
     {
      "k": "N",
      "tpl": "{B:이/} 만나러",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "우리 같이 가요!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_5f7cded51bb3.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/c7400acf13.mp3",
    "urlLook": {},
    "chars": 7
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, excited, polite]",
    "whole": false,
    "n": 1,
    "send": "Let's find {B_en}!",
    "pieces": [
     {
      "k": "S",
      "tpl": "Oh? Auntie fire truck!",
      "gap": 0.36,
      "url": "audio/el/red_car/parts/en_5a7698f5ccd8.mp3"
     },
     {
      "k": "N",
      "tpl": "Let's find {B_en}!",
      "gap": 0.36,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "Come with us!",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_4e5822665af5.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/3526deba0a.mp3",
    "urlLook": {},
    "chars": 19
   },
   "g": []
  },
  {
   "id": "k98144e91",
   "key": "구급차 삼촌! 이현이한테 우리랑 같이 가요!",
   "keyEn": "구급차 삼촌! 이현이한테 우리랑 같이 가요!",
   "mode": "both",
   "tpl": "구급차 삼촌! {B:이한테/한테} 우리랑 같이 가요!",
   "en": "Uncle ambulance! Let's find Ihyun! Come with us!",
   "tplEn": "Uncle ambulance! Let's find {B_en}! Come with us!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, eager, polite]",
    "whole": false,
    "n": 1,
    "send": "{B:이한테/한테}",
    "pieces": [
     {
      "k": "S",
      "tpl": "구급차 삼촌!",
      "gap": 0.36,
      "url": "audio/el/red_car/parts/ko_2b76f156e889.mp3"
     },
     {
      "k": "N",
      "tpl": "{B:이한테/한테}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "우리랑 같이 가요!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_804fee3c285e.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/43378ecf21.mp3",
    "urlLook": {},
    "chars": 5
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, eager, polite]",
    "whole": false,
    "n": 1,
    "send": "Let's find {B_en}!",
    "pieces": [
     {
      "k": "S",
      "tpl": "Uncle ambulance!",
      "gap": 0.36,
      "url": "audio/el/red_car/parts/en_7591a998bac3.mp3"
     },
     {
      "k": "N",
      "tpl": "Let's find {B_en}!",
      "gap": 0.36,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "Come with us!",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_ff9b5cf08436.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/b051a7a043.mp3",
    "urlLook": {},
    "chars": 19
   },
   "g": []
  },
  {
   "id": "ka8caa4ad",
   "key": "오냐오냐, 아픈 친구들을 다 데려다주었으니, 이제 이현이에게 가자!",
   "keyEn": "오냐오냐, 아픈 친구들을 다 데려다주었으니, 이제 이현이에게 가자!",
   "mode": "both",
   "tpl": "오냐오냐, 아픈 친구들을 다 데려다주었으니, 이제 {B:이에게/에게} 가자!",
   "en": "All right, all right! I've brought the sick friends to the hospital, so now let's go to Ihyun!",
   "tplEn": "All right, all right! I've brought the sick friends to the hospital, so now let's go to {B_en}!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "qAZH0aMXY8tw1QufPN0D",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[kind uncle voice, deep, reassuring, unhurried]",
    "whole": false,
    "n": 1,
    "send": "이제 {B:이에게/에게} 가자!",
    "pieces": [
     {
      "k": "S",
      "tpl": "오냐오냐, 아픈 친구들을 다 데려다주었으니,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/ko_9287b6cfdf8d.mp3"
     },
     {
      "k": "N",
      "tpl": "이제 {B:이에게/에게} 가자!",
      "gap": 0,
      "slots": [
       "B"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/6fd994588c.mp3",
    "urlLook": {},
    "chars": 12
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "qAZH0aMXY8tw1QufPN0D",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[kind uncle voice, deep, reassuring, unhurried]",
    "whole": false,
    "n": 1,
    "send": "so now let's go to {B_en}!",
    "pieces": [
     {
      "k": "S",
      "tpl": "All right, all right! I've brought the sick friends to the hospital,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/en_66911a8a6752.mp3"
     },
     {
      "k": "N",
      "tpl": "so now let's go to {B_en}!",
      "gap": 0,
      "slots": [
       "B"
      ],
      "g": []
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/f91db03ff5.mp3",
    "urlLook": {},
    "chars": 27
   },
   "g": []
  },
  {
   "id": "ke956173e",
   "key": "자, 이현이한테 다 같이 가자!",
   "keyEn": "자, 이현이한테 다 같이 가자!",
   "mode": "both",
   "tpl": "자, {B:이한테/한테} 다 같이 가자!",
   "en": "Come on, everyone, let's go to Ihyun!",
   "tplEn": "Come on, everyone, let's go to {B_en}!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, leading, cheerful]",
    "whole": false,
    "n": 1,
    "send": "{B:이한테/한테}",
    "pieces": [
     {
      "k": "S",
      "tpl": "자,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/ko_c632108c94f1.mp3"
     },
     {
      "k": "N",
      "tpl": "{B:이한테/한테}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "다 같이 가자!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_1c1be8287b2c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/ff79ec72d9.mp3",
    "urlLook": {},
    "chars": 5
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "n7Wi4g1bhpw4Bs8HK5ph",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.4,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "tag": "[small voice, leading, cheerful]",
    "whole": false,
    "n": 1,
    "send": "let's go to {B_en}!",
    "pieces": [
     {
      "k": "S",
      "tpl": "Come on, everyone,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/en_ab274826d9b5.mp3"
     },
     {
      "k": "N",
      "tpl": "let's go to {B_en}!",
      "gap": 0,
      "slots": [
       "B"
      ],
      "g": []
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/5e19b14b4e.mp3",
    "urlLook": {},
    "chars": 20
   },
   "g": []
  },
  {
   "id": "k6bdd5b58",
   "key": "바로 이현이가 전에 잃어버렸던 주황색 견인차였어요!",
   "keyEn": "바로 이현이가 전에 잃어버렸던 주황색 견인차였어요!",
   "mode": "both",
   "tpl": "바로 {B:이가/가} 전에 잃어버렸던 주황색 견인차였어요!",
   "en": "It was the orange tow truck! Ihyun had lost it long ago!",
   "tplEn": "It was the orange tow truck! {B_en} had lost it long ago!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[bright, glad reveal]",
    "whole": false,
    "n": 0,
    "send": "바로 {B:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "바로 {B:이가/가}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "전에 잃어버렸던 주황색 견인차였어요!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_29285e41bf21.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/ecd50a41b3.mp3",
    "urlLook": {},
    "chars": 7
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[bright, glad reveal]",
    "whole": false,
    "n": 1,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "It was the orange tow truck!",
      "gap": 0.36,
      "url": "audio/el/red_car/parts/en_4f4536d689b0.mp3"
     },
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "had lost it long ago!",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_cae2a1268636.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/e8250b0e84.mp3",
    "urlLook": {},
    "chars": 7
   },
   "g": []
  },
  {
   "id": "k10d05f45",
   "key": "마침내 놀이터에 있는 이현이를 만났어요!",
   "keyEn": "마침내 놀이터에 있는 이현이를 만났어요!",
   "mode": "both",
   "tpl": "마침내 놀이터에 있는 {B:이를/를} 만났어요!",
   "en": "At last, they found Ihyun at the playground!",
   "tplEn": "At last, they found {B_en} at the playground!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[bright, relieved, joyful]",
    "whole": false,
    "n": 0,
    "send": "마침내 놀이터에 있는 {B:이를/를}",
    "pieces": [
     {
      "k": "N",
      "tpl": "마침내 놀이터에 있는 {B:이를/를}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "만났어요!",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_6a042d1dcf12.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/872abec8cd.mp3",
    "urlLook": {},
    "chars": 16
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[bright, relieved, joyful]",
    "whole": false,
    "n": 1,
    "send": "they found {B_en} at the playground!",
    "pieces": [
     {
      "k": "S",
      "tpl": "At last,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/en_40473d419c86.mp3"
     },
     {
      "k": "N",
      "tpl": "they found {B_en} at the playground!",
      "gap": 0,
      "slots": [
       "B"
      ],
      "g": []
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/abe3ded8c0.mp3",
    "urlLook": {},
    "chars": 37
   },
   "g": []
  },
  {
   "id": "kd64ce087",
   "key": "이현이는 소중한 보물 자동차들을 모두 품에 안고 펄쩍펄쩍 기뻐했답니다.",
   "keyEn": "이현이는 소중한 보물 자동차들을 모두 품에 안고 펄쩍펄쩍 기뻐했답니다.",
   "mode": "both",
   "tpl": "{B:이는/는} 소중한 보물 자동차들을 모두 품에 안고 펄쩍펄쩍 기뻐했답니다.",
   "en": "Ihyun hugged all the precious toy cars and jumped for joy.",
   "tplEn": "{B_en} hugged all the precious toy cars and jumped for joy.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[warm, joyful, storybook ending tone]",
    "whole": false,
    "n": 0,
    "send": "{B:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이는/는}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "소중한 보물 자동차들을 모두 품에 안고 펄쩍펄쩍 기뻐했답니다.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_7474b3622818.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/4e615ccd09.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[warm, joyful, storybook ending tone]",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "hugged all the precious toy cars and jumped for joy.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_7d50850ece23.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/bd9c010fe8.mp3",
    "urlLook": {},
    "chars": 7
   },
   "g": []
  },
  {
   "id": "kd5bd884c",
   "key": "이현이는 빨간 자동차를 손에 꼭 쥐고 쌔근쌔근 잠들었어요.",
   "keyEn": "이현이는 빨간 자동차를 손에 꼭 쥐고 쌔근쌔근 잠들었어요.",
   "mode": "both",
   "tpl": "{B:이는/는} 빨간 자동차를 손에 꼭 쥐고 쌔근쌔근 잠들었어요.",
   "en": "Ihyun held the red car tight and fell fast asleep.",
   "tplEn": "{B_en} held the red car tight and fell fast asleep.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried, sleepy, soft]",
    "whole": false,
    "n": 0,
    "send": "{B:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이는/는}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "빨간 자동차를 손에 꼭 쥐고 쌔근쌔근 잠들었어요.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_495d832b20e3.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/8c5f7f6a4d.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried, sleepy, soft]",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "held the red car tight and fell fast asleep.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_62082039348b.mp3"
     }
    ],
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/name/4315cb2b82.mp3",
    "urlLook": {},
    "chars": 7
   },
   "g": []
  },
  {
   "id": "re5c8fbc1",
   "key": "이현이의 방에 작은 빨간 장난감 자동차가 있었어요.",
   "keyEn": "이현이의 방에 작은 빨간 장난감 자동차가 있었어요.",
   "mode": "read",
   "tpl": "{B:이의/의} 방에 작은 빨간 장난감 자동차가 있었어요.",
   "en": "In Ihyun's room, there was a little red toy car.",
   "tplEn": "In {B_en}'s room, there was a little red toy car.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm, gentle storytelling]",
    "whole": false,
    "n": 0,
    "send": "{B:이의/의} 방에",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이의/의} 방에",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "작은 빨간 장난감 자동차가 있었어요.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_e1a3e1403060.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/d7c085bcf9.mp3",
    "urlLook": {},
    "chars": 7
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm, gentle storytelling]",
    "whole": false,
    "n": 0,
    "send": "In {B_en}'s room,",
    "pieces": [
     {
      "k": "N",
      "tpl": "In {B_en}'s room,",
      "gap": 0.16,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "there was a little red toy car.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_2843abc59be4.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/en/name/d228a696e1.mp3",
    "urlLook": {},
    "chars": 16
   },
   "g": []
  },
  {
   "id": "r3fef6de4",
   "key": "방 안에는 파란 블록, 노란 오리, 그리고 반짝반짝 빨간 자동차가 있었지요.",
   "keyEn": "방 안에는 파란 블록, 노란 오리, 그리고 반짝반짝 빨간 자동차가 있었지요.",
   "mode": "read",
   "tpl": "방 안에는 파란 블록, 노란 오리, 그리고 반짝반짝 빨간 자동차가 있었지요.",
   "en": "In his room were a blue block, a yellow duck, and a shiny, sparkly little red car.",
   "tplEn": "In {B_g:his/her} room were a blue block, a yellow duck, and a shiny, sparkly little red car.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "In {B_g:his/her} room were a blue block, a yellow duck, and a shiny, sparkly little red car.",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/en/nar_332916f959.mp3",
    "urlLook": {
     "Bg": "audio/el/red_car/look/Bg/en/name/431f05cbd1.mp3"
    },
    "chars": 0
   },
   "g": [
    "B"
   ]
  },
  {
   "id": "r30cf92bf",
   "key": "부릉부릉! 이현이는 날마다 자동차를 씽씽 굴리며 놀았어요.",
   "keyEn": "부릉부릉! 이현이는 날마다 자동차를 씽씽 굴리며 놀았어요.",
   "mode": "read",
   "tpl": "부릉부릉! {B:이는/는} 날마다 자동차를 씽씽 굴리며 놀았어요.",
   "en": "Vroom, vroom! Ihyun played with the car every day, zooming it all around.",
   "tplEn": "Vroom, vroom! {B_en} played with the car every day, zooming it all around.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 1,
    "send": "{B:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "부릉부릉!",
      "gap": 0.4,
      "url": "audio/el/red_car/parts/ko_666cb299b173.mp3"
     },
     {
      "k": "N",
      "tpl": "{B:이는/는}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "날마다 자동차를 씽씽 굴리며 놀았어요.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_08ea85657dfc.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/422a77d378.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 1,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Vroom, vroom!",
      "gap": 0.36,
      "url": "audio/el/red_car/parts/en_92a3d1205a43.mp3"
     },
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "played with the car every day, zooming it all around.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_2a2a27b98d37.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/en/name/b235ea5d60.mp3",
    "urlLook": {},
    "chars": 5
   },
   "g": []
  },
  {
   "id": "r04d40fa7",
   "key": "이현이는 빨간 자동차를 손에 들고 나비를 보았어요.",
   "keyEn": "이현이는 빨간 자동차를 손에 들고 나비를 보았어요.",
   "mode": "read",
   "tpl": "{B:이는/는} 빨간 자동차를 손에 들고 나비를 보았어요.",
   "en": "Ihyun held the red car in his hand and saw a butterfly. Look!",
   "tplEn": "{B_en} held the red car in {B_g:his/her} hand and saw a butterfly. Look!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm, gentle storytelling]",
    "whole": false,
    "n": 0,
    "send": "{B:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이는/는}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "빨간 자동차를 손에 들고 나비를 보았어요.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_d0b3531687eb.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/2711a88bd5.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm, gentle storytelling]",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "held the red car in {B_g:his/her} hand and saw a butterfly. Look!",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_c0e4735f5617.mp3",
      "urls": {
       "g": "audio/el/red_car/parts/en_7c03de872e69.mp3",
       "b": "audio/el/red_car/parts/en_c0e4735f5617.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/en/name/b72a3f8cef.mp3",
    "urlLook": {
     "Bg": "audio/el/red_car/look/Bg/en/name/f589ec337f.mp3"
    },
    "chars": 5
   },
   "g": [
    "B"
   ]
  },
  {
   "id": "r1e89a18d",
   "key": "나비가 팔랑팔랑 날아가자, 이현이는 폴짝폴짝 따라갔어요.",
   "keyEn": "나비가 팔랑팔랑 날아가자, 이현이는 폴짝폴짝 따라갔어요.",
   "mode": "read",
   "tpl": "나비가 팔랑팔랑 날아가자, {B:이는/는} 폴짝폴짝 따라갔어요.",
   "en": "The butterfly fluttered away, flutter, flutter, and Ihyun went hopping after it, hop, hop.",
   "tplEn": "The butterfly fluttered away, flutter, flutter, and {B_en} went hopping after it, hop, hop.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 1,
    "send": "{B:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "나비가 팔랑팔랑 날아가자,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/ko_ee65f5f628c4.mp3"
     },
     {
      "k": "N",
      "tpl": "{B:이는/는}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "폴짝폴짝 따라갔어요.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_d54a5a07e6a8.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/ecc4aefb1e.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 1,
    "send": "and {B_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "The butterfly fluttered away, flutter, flutter,",
      "gap": 0.22,
      "url": "audio/el/red_car/parts/en_8b9dab16a033.mp3"
     },
     {
      "k": "N",
      "tpl": "and {B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "went hopping after it, hop, hop.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_42c18478d4c3.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/en/name/82980a8914.mp3",
    "urlLook": {},
    "chars": 9
   },
   "g": []
  },
  {
   "id": "ra72567eb",
   "key": "이현이는 자동차를 찾으며 눈물을 뚝뚝 흘렸어요.",
   "keyEn": "이현이는 자동차를 찾으며 눈물을 뚝뚝 흘렸어요.",
   "mode": "read",
   "tpl": "{B:이는/는} 자동차를 찾으며 눈물을 뚝뚝 흘렸어요.",
   "en": "Ihyun looked and looked for his car, and his tears fell, drip, drop.",
   "tplEn": "{B_en} looked and looked for {B_g:his/her} car, and {B_g:his/her} tears fell, drip, drop.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm, gentle storytelling]",
    "whole": false,
    "n": 0,
    "send": "{B:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이는/는}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "자동차를 찾으며 눈물을 뚝뚝 흘렸어요.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_f4dc5c9a994b.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/e8b3cc2dda.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm, gentle storytelling]",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "looked and looked for {B_g:his/her} car, and {B_g:his/her} tears fell, drip, drop.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_a5b5621fbbcb.mp3",
      "urls": {
       "g": "audio/el/red_car/parts/en_840a05f3e4b9.mp3",
       "b": "audio/el/red_car/parts/en_a5b5621fbbcb.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/en/name/185472b2bf.mp3",
    "urlLook": {
     "Bg": "audio/el/red_car/look/Bg/en/name/08f3ec746d.mp3"
    },
    "chars": 5
   },
   "g": [
    "B"
   ]
  },
  {
   "id": "rf90a66b5",
   "key": "이현이가 떠난 자리에 빨간 자동차만 혼자 남았어요.",
   "keyEn": "이현이가 떠난 자리에 빨간 자동차만 혼자 남았어요.",
   "mode": "read",
   "tpl": "{B:이가/가} 떠난 자리에 빨간 자동차만 혼자 남았어요.",
   "en": "Ihyun went away, and the red car was left all alone on the grass.",
   "tplEn": "{B_en} went away, and the red car was left all alone on the grass.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm, gentle storytelling]",
    "whole": false,
    "n": 0,
    "send": "{B:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B:이가/가}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "떠난 자리에 빨간 자동차만 혼자 남았어요.",
      "gap": 0,
      "url": "audio/el/red_car/parts/ko_923f666768a2.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/name/83f5e18a35.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.5,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[calm, warm, gentle storytelling]",
    "whole": false,
    "n": 0,
    "send": "{B_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{B_en}",
      "gap": 0.05,
      "slots": [
       "B"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "went away, and the red car was left all alone on the grass.",
      "gap": 0,
      "url": "audio/el/red_car/parts/en_1b0281089ef1.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/red_car/en/name/0e06eb2d2d.mp3",
    "urlLook": {},
    "chars": 5
   },
   "g": []
  }
 ],
 "unicorn": [
  {
   "id": "k1b6a6f42",
   "key": "언덕 위에 다현이가 서 있어요. 하늘을 올려다보고 있어요.",
   "keyEn": "언덕 위에 다현이가 서 있어요. 하늘을 올려다보고 있어요.",
   "mode": "both",
   "tpl": "언덕 위에 {A:이가/가} 서 있어요. 하늘을 올려다보고 있어요.",
   "en": "On a hill stands Dahyun, looking up at the sky.",
   "tplEn": "On a hill stands {A_en}, looking up at the sky.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "언덕 위에 {A:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "언덕 위에 {A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "서 있어요. 하늘을 올려다보고 있어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_ad5300b84282.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/40ccbdd514.mp3",
    "urlLook": {},
    "chars": 10
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "On a hill stands {A_en},",
    "pieces": [
     {
      "k": "N",
      "tpl": "On a hill stands {A_en},",
      "gap": 0.16,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "looking up at the sky.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_67407e736c39.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/33e24938b1.mp3",
    "urlLook": {},
    "chars": 24
   },
   "g": []
  },
  {
   "id": "k0c3dfe62",
   "key": "다현이는 바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
   "keyEn": "다현이는 바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
   "en": "Dahyun gently picked up a flower the wind had dropped and popped it into her basket.",
   "tplEn": "{A_en} gently picked up a flower the wind had dropped and popped it into {A_g:his/her} basket.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, playful, light, storybook tone]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_70427f5ea64f.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/b2fceec77f.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, playful, light, storybook tone]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently picked up a flower the wind had dropped and popped it into {A_g:his/her} basket.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_c8916b8e5d35.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_9e625ddab68c.mp3",
       "g": "audio/el/unicorn/parts/en_c8916b8e5d35.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/ad5b45976b.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/fe57beb4c4.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "k9a00b22e",
   "key": "다현이는 구름 나라로 올라가 보기로 했어요.",
   "keyEn": "다현이는 구름 나라로 올라가 보기로 했어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 구름 나라로 올라가 보기로 했어요.",
   "en": "Dahyun decided to climb up to the cloud country.",
   "tplEn": "{A_en} decided to climb up to the cloud country.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[hopeful, brightening, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "구름 나라로 올라가 보기로 했어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_949ce1a7dd14.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/7e73daafa0.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[hopeful, brightening, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "decided to climb up to the cloud country.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_4f480b4224f5.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/4cb15c0d31.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "ke08e9d64",
   "key": "다현이와 양은 손을 잡고 구름 길을 걸었어요.",
   "keyEn": "다현이와 양은 손을 잡고 구름 길을 걸었어요.",
   "mode": "both",
   "tpl": "{A:이와/와} 양은 손을 잡고 구름 길을 걸었어요.",
   "en": "Dahyun and the sheep walked the cloud path hand in hand.",
   "tplEn": "{A_en} and the sheep walked the cloud path hand in hand.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, steady, walking rhythm, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이와/와}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이와/와}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "양은 손을 잡고 구름 길을 걸었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_a7433de2fc96.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/efaacf0c57.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, steady, walking rhythm, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "and the sheep walked the cloud path hand in hand.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_ff32bac7c38d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/58329dff9c.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "kdbf57149",
   "key": "밤이 되자, 다현이는 별빛 숲으로 들어갔어요.",
   "keyEn": "밤이 되자, 다현이는 별빛 숲으로 들어갔어요.",
   "mode": "both",
   "tpl": "밤이 되자, {A:이는/는} 별빛 숲으로 들어갔어요.",
   "en": "When night came, Dahyun walked into the starlight forest.",
   "tplEn": "When night came, {A_en} walked into the starlight forest.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[hushed, calm, a little mysterious, slow]",
    "whole": false,
    "n": 1,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "밤이 되자,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/ko_c113f79daa96.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "별빛 숲으로 들어갔어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_7351546ac442.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/31bc719ed4.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[hushed, calm, a little mysterious, slow]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "When night came,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_96e982422ea7.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "walked into the starlight forest.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_5caefbf66ac1.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/a5511463a5.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "ka19f9732",
   "key": "다현이는 사슴의 작은 뿔을 가만히 보았어요.",
   "keyEn": "다현이는 사슴의 작은 뿔을 가만히 보았어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 사슴의 작은 뿔을 가만히 보았어요.",
   "en": "Dahyun looked quietly at the deer's little antlers.",
   "tplEn": "{A_en} looked quietly at the deer's little antlers.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[soft, slow, a thoughtful pause]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "사슴의 작은 뿔을 가만히 보았어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_fe681eab32f4.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/597fa46a6e.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[soft, slow, a thoughtful pause]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "looked quietly at the deer's little antlers.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_790413fc522c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/b34318ac4f.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k73064f13",
   "key": "말은 다현이의 간식 바구니를 보고 있어요.",
   "keyEn": "말은 다현이의 간식 바구니를 보고 있어요.",
   "mode": "both",
   "tpl": "말은 {A:이의/의} 간식 바구니를 보고 있어요.",
   "en": "The horse was looking at Dahyun's snack basket.",
   "tplEn": "The horse was looking at {A_en}'s snack basket.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[gentle, a little playful, slow]",
    "whole": true,
    "n": 0,
    "send": "[gentle, a little playful, slow] 말은 {A:이의/의} 간식 바구니를 보고 있어요.",
    "pieces": [
     {
      "k": "N",
      "tpl": "말은 {A:이의/의} 간식 바구니를 보고 있어요.",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/nar_6b047bb683.mp3",
    "urlLook": {},
    "chars": 56
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[gentle, a little playful, slow]",
    "whole": true,
    "n": 0,
    "send": "[gentle, a little playful, slow] The horse was looking at {A_en}'s snack basket.",
    "pieces": [
     {
      "k": "N",
      "tpl": "The horse was looking at {A_en}'s snack basket.",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/nar_5b6a16052a.mp3",
    "urlLook": {},
    "chars": 80
   },
   "g": []
  },
  {
   "id": "kd68c8bd6",
   "key": "다현이는 땅만 보며 터벅터벅 걸었어요.",
   "keyEn": "다현이는 땅만 보며 터벅터벅 걸었어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 땅만 보며 터벅터벅 걸었어요.",
   "en": "Dahyun trudged along, looking only at the ground.",
   "tplEn": "{A_en} trudged along, looking only at the ground.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[slow, soft, trudging rhythm]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "땅만 보며 터벅터벅 걸었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_2e16482ce013.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/127549fac9.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[slow, soft, trudging rhythm]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "trudged along, looking only at the ground.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_fb25f0b395f2.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/6fbf3c4399.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k136ce4b7",
   "key": "다현이 뒤에 누가 왔을까요?",
   "keyEn": "다현이 뒤에 누가 왔을까요?",
   "mode": "both",
   "tpl": "{A:이/} 뒤에 누가 왔을까요?",
   "en": "Who came up behind Dahyun?",
   "tplEn": "Who came up behind {A_en}?",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[soft, hushed, playful suspense, a question to the listener]",
    "whole": false,
    "n": 0,
    "send": "{A:이/} 뒤에",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이/} 뒤에",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "누가 왔을까요?",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_00b570adeb80.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/bb323bf9a3.mp3",
    "urlLook": {},
    "chars": 6
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[soft, hushed, playful suspense, a question to the listener]",
    "whole": true,
    "n": 0,
    "send": "[soft, hushed, playful suspense, a question to the listener] Who came up behind {A_en}?",
    "pieces": [
     {
      "k": "N",
      "tpl": "Who came up behind {A_en}?",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/nar_8aea402ab6.mp3",
    "urlLook": {},
    "chars": 87
   },
   "g": []
  },
  {
   "id": "kfdb673a2",
   "key": "다현이는 유니콘을 꼭 안았어요.",
   "keyEn": "다현이는 유니콘을 꼭 안았어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 유니콘을 꼭 안았어요.",
   "en": "Dahyun hugged the unicorn tight.",
   "tplEn": "{A_en} hugged the unicorn tight.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, joyful, storybook ending tone, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "유니콘을 꼭 안았어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_b6adb69e0da9.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/4d78729f10.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, joyful, storybook ending tone, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "hugged the unicorn tight.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_084bf7eddad3.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/25f0f32410.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k0d228986",
   "key": "다음 날 아침, 다현이는 유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
   "keyEn": "다음 날 아침, 다현이는 유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
   "mode": "both",
   "tpl": "다음 날 아침, {A:이는/는} 유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
   "en": "The next morning, Dahyun came back to the hill by her home with the unicorn.",
   "tplEn": "The next morning, {A_en} came back to the hill by {A_g:his/her} home with the unicorn.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, calm, gentle storybook ending tone, slow]",
    "whole": false,
    "n": 1,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "다음 날 아침,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/ko_7925eea53a32.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_29e943761890.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/f8697bf497.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, calm, gentle storybook ending tone, slow]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "The next morning,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_f4c4607d8d04.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "came back to the hill by {A_g:his/her} home with the unicorn.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_40b86dd47f5e.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_b87957917518.mp3",
       "g": "audio/el/unicorn/parts/en_40b86dd47f5e.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/c70fb4ccb2.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/de7205ded9.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "k90854856",
   "key": "다현이는 바구니 속 빨간 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 빨간 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 바구니 속 빨간 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the red flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the red flower from {A_g:his/her} basket into the unicorn's mane.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바구니 속 빨간 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_563235b33736.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/de45d3f7cb.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently tucked the red flower from {A_g:his/her} basket into the unicorn's mane.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_030a07868409.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_8da8421d0b04.mp3",
       "g": "audio/el/unicorn/parts/en_030a07868409.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/8a390743da.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/7415c695b4.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "pc278f7f4",
   "key": "다현이는 바구니 속 주황 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 주황 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 주황 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the orange flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the orange flower from {A_g:his/her} basket into the unicorn's mane.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바구니 속 주황 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_5e13d46dd5ce.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/d258e930b6.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently tucked the orange flower from {A_g:his/her} basket into the unicorn's mane.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_11da756a702c.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_f3205e5321e3.mp3",
       "g": "audio/el/unicorn/parts/en_11da756a702c.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/5fedb1d605.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/53deb44610.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "p06c9de60",
   "key": "다현이는 바구니 속 노란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 노란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 노란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the yellow flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the yellow flower from {A_g:his/her} basket into the unicorn's mane.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바구니 속 노란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_0319f0e8a32b.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/bee3cc07ca.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently tucked the yellow flower from {A_g:his/her} basket into the unicorn's mane.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_39f156d77d95.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_86ba36411067.mp3",
       "g": "audio/el/unicorn/parts/en_39f156d77d95.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/2cc0fb6f75.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/65b55508bb.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "pcfabae92",
   "key": "다현이는 바구니 속 분홍 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 분홍 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 분홍 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the pink flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the pink flower from {A_g:his/her} basket into the unicorn's mane.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바구니 속 분홍 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_6ac7a01aea1d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/855388b710.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently tucked the pink flower from {A_g:his/her} basket into the unicorn's mane.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_942ee294156d.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_836a076e737b.mp3",
       "g": "audio/el/unicorn/parts/en_942ee294156d.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/f17d4c3932.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/6e68033324.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "p65557bd5",
   "key": "다현이는 바구니 속 보라 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 보라 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 보라 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the purple flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the purple flower from {A_g:his/her} basket into the unicorn's mane.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바구니 속 보라 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_ec4fc6c1065a.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/ec06e3688f.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently tucked the purple flower from {A_g:his/her} basket into the unicorn's mane.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_41cc74ca196a.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_424a3784243f.mp3",
       "g": "audio/el/unicorn/parts/en_41cc74ca196a.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/6d6d25cd1b.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/4f7e27ee85.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "p37768c41",
   "key": "다현이는 바구니 속 파란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 파란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 파란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the blue flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the blue flower from {A_g:his/her} basket into the unicorn's mane.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바구니 속 파란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_d370af93beda.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/bc0cf6a042.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently tucked the blue flower from {A_g:his/her} basket into the unicorn's mane.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_3c5db8234648.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_caceec3f0cbb.mp3",
       "g": "audio/el/unicorn/parts/en_3c5db8234648.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/080dbfb0f2.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/16b56e0991.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "p4ffa7f71",
   "key": "다현이는 바구니 속 하얀 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 하얀 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 하얀 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the white flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the white flower from {A_g:his/her} basket into the unicorn's mane.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바구니 속 하얀 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_d9c4e3ffeeda.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/b4e5b054ca.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, tender, joyful, slow]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "gently tucked the white flower from {A_g:his/her} basket into the unicorn's mane.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_a41f883f2f25.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_29f1fc5a6ebc.mp3",
       "g": "audio/el/unicorn/parts/en_a41f883f2f25.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/a17aec4cb3.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/2927a91f55.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "ka32c8b90",
   "key": "그날 밤, 다현이는 포근한 이불 속에 누웠어요.",
   "keyEn": "그날 밤, 다현이는 포근한 이불 속에 누웠어요.",
   "mode": "both",
   "tpl": "그날 밤, {A:이는/는} 포근한 이불 속에 누웠어요.",
   "en": "That night, Dahyun lay down under her cozy blanket.",
   "tplEn": "That night, {A_en} lay down under {A_g:his/her} cozy blanket.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried, sleepy, soft]",
    "whole": false,
    "n": 1,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "그날 밤,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/ko_ecd6dde8f713.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "포근한 이불 속에 누웠어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_2a7d4f70ce86.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/e2bf523f3d.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried, sleepy, soft]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "That night,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_ff9a71d0e895.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "lay down under {A_g:his/her} cozy blanket.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_df671785aff3.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_4c60c9d3d035.mp3",
       "g": "audio/el/unicorn/parts/en_df671785aff3.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/047cef7a51.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/9ae1e817bd.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "kd4768a58",
   "key": "다현이는 친절한 마음을 꼭 안고 스르르 잠이 들었어요.",
   "keyEn": "다현이는 친절한 마음을 꼭 안고 스르르 잠이 들었어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 친절한 마음을 꼭 안고 스르르 잠이 들었어요.",
   "en": "Holding her kind heart close, Dahyun drifted off to sleep.",
   "tplEn": "Holding {A_g:his/her} kind heart close, {A_en} drifted off to sleep.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried, sleepy, soft]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "친절한 마음을 꼭 안고 스르르 잠이 들었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_60754b13895e.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/48f7c8d969.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried, sleepy, soft]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Holding {A_g:his/her} kind heart close,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_08aed3055b8b.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_0af352b6451c.mp3",
       "g": "audio/el/unicorn/parts/en_08aed3055b8b.mp3"
      }
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "drifted off to sleep.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_29a367c61a98.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/e45ca3cf75.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/ffc539b318.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "r6b7d6c1e",
   "key": "다현이가 혼잣말을 했어요.",
   "keyEn": "다현이가 혼잣말을 했어요.",
   "mode": "read",
   "tpl": "{A:이가/가} 혼잣말을 했어요.",
   "en": "Dahyun said to herself.",
   "tplEn": "{A_en} said to {A_g:himself/herself}.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "혼잣말을 했어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_29d23a6a3769.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/7977f9ccd6.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "said to {A_g:himself/herself}.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_6e1f536d1c8a.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_858c18089d68.mp3",
       "g": "audio/el/unicorn/parts/en_6e1f536d1c8a.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/e71e716c05.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/5d23c8e588.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "r99d7a7f0",
   "key": "다현이는 간식 바구니를 들고 사뿐사뿐 언덕을 올라갔어요.",
   "keyEn": "다현이는 간식 바구니를 들고 사뿐사뿐 언덕을 올라갔어요.",
   "mode": "read",
   "tpl": "{A:이는/는} 간식 바구니를 들고 사뿐사뿐 언덕을 올라갔어요.",
   "en": "Dahyun picked up her snack basket and tiptoed lightly, step, step, up the hill.",
   "tplEn": "{A_en} picked up {A_g:his/her} snack basket and tiptoed lightly, step, step, up the hill.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "간식 바구니를 들고 사뿐사뿐 언덕을 올라갔어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_c913fddb2e26.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/e52748fbce.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "picked up {A_g:his/her} snack basket and tiptoed lightly, step, step, up the hill.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_975795eb8453.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_7c492573dbf1.mp3",
       "g": "audio/el/unicorn/parts/en_975795eb8453.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/cfc078a520.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/f0c8f0f0e5.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "r5b7a1cfd",
   "key": "다현이가 언덕을 올라 구름 나라에 다다랐어요.",
   "keyEn": "다현이가 언덕을 올라 구름 나라에 다다랐어요.",
   "mode": "read",
   "tpl": "{A:이가/가} 언덕을 올라 구름 나라에 다다랐어요.",
   "en": "Dahyun climbed the hill and reached cloudland.",
   "tplEn": "{A_en} climbed the hill and reached cloudland.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "언덕을 올라 구름 나라에 다다랐어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_8018e7563a76.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/d614e68b35.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "climbed the hill and reached cloudland.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_b987142ff028.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/b299c1a284.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "rbc6e78d6",
   "key": "다현이가 양 아래에서 두 팔을 벌렸어요.",
   "keyEn": "다현이가 양 아래에서 두 팔을 벌렸어요.",
   "mode": "read",
   "tpl": "{A:이가/가} 양 아래에서 두 팔을 벌렸어요.",
   "en": "Dahyun opened her arms below the sheep.",
   "tplEn": "{A_en} opened {A_g:his/her} arms below the sheep.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "양 아래에서 두 팔을 벌렸어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_ff8eee45ea1a.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/5945d3d95f.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "opened {A_g:his/her} arms below the sheep.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_32ed91f30afe.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_e9f2f5e4bd8c.mp3",
       "g": "audio/el/unicorn/parts/en_32ed91f30afe.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/c3a828337f.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/f97fb27d12.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "r32812145",
   "key": "양은 폭신폭신 구름을 미끄러져, 다현이 품에 폭, 안겼어요.",
   "keyEn": "양은 폭신폭신 구름을 미끄러져, 다현이 품에 폭, 안겼어요.",
   "mode": "read",
   "tpl": "양은 폭신폭신 구름을 미끄러져, {A:이/} 품에 폭, 안겼어요.",
   "en": "The sheep slid down the soft, fluffy cloud, and plop! Right into Dahyun's arms!",
   "tplEn": "The sheep slid down the soft, fluffy cloud, and plop! Right into {A_en}'s arms!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 1,
    "send": "{A:이/} 품에",
    "pieces": [
     {
      "k": "S",
      "tpl": "양은 폭신폭신 구름을 미끄러져,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/ko_ee0f78bf1bbe.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이/} 품에",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "폭, 안겼어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_a228612c7d4c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/c8af62b9fa.mp3",
    "urlLook": {},
    "chars": 6
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 1,
    "send": "Right into {A_en}'s arms!",
    "pieces": [
     {
      "k": "S",
      "tpl": "The sheep slid down the soft, fluffy cloud, and plop!",
      "gap": 0.36,
      "url": "audio/el/unicorn/parts/en_55acd3640f65.mp3"
     },
     {
      "k": "N",
      "tpl": "Right into {A_en}'s arms!",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/1d806b40b2.mp3",
    "urlLook": {},
    "chars": 25
   },
   "g": []
  },
  {
   "id": "ra61a10a3",
   "key": "다현이는 숲속에서 아픈 사슴을 만났어요.",
   "keyEn": "다현이는 숲속에서 아픈 사슴을 만났어요.",
   "mode": "read",
   "tpl": "{A:이는/는} 숲속에서 아픈 사슴을 만났어요.",
   "en": "In the forest, Dahyun met a deer who was hurt.",
   "tplEn": "In the forest, {A_en} met a deer who was hurt.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "숲속에서 아픈 사슴을 만났어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_3fffc50daa97.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/3b38f22ed6.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "In the forest,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_cad2940639d0.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "met a deer who was hurt.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_285938526814.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/b3b730ef44.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r090c8d23",
   "key": "다현이는 살살, 조심조심 가시를 하나씩 뽑았어요. 쏙, 쏙, 쏙!",
   "keyEn": "다현이는 살살, 조심조심 가시를 하나씩 뽑았어요. 쏙, 쏙, 쏙!",
   "mode": "read",
   "tpl": "{A:이는/는} 살살, 조심조심 가시를 하나씩 뽑았어요. 쏙, 쏙, 쏙!",
   "en": "Gently, ever so carefully, Dahyun pulled out the thorns one by one. Pop, pop, pop!",
   "tplEn": "Gently, ever so carefully, {A_en} pulled out the thorns one by one. Pop, pop, pop!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "살살, 조심조심 가시를 하나씩 뽑았어요. 쏙, 쏙, 쏙!",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_6a022c7212b1.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/7b63551f36.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Gently, ever so carefully,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_2ab731365dbc.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "pulled out the thorns one by one. Pop, pop, pop!",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_2c852c285cc1.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/b5bdd14204.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r3bb067f7",
   "key": "가시를 뺀 뒤에도, 다현이는 숲에서 사슴 곁에 있었어요.",
   "keyEn": "가시를 뺀 뒤에도, 다현이는 숲에서 사슴 곁에 있었어요.",
   "mode": "read",
   "tpl": "가시를 뺀 뒤에도, {A:이는/는} 숲에서 사슴 곁에 있었어요.",
   "en": "After pulling out the thorns, Dahyun stayed beside the deer in the forest.",
   "tplEn": "After pulling out the thorns, {A_en} stayed beside the deer in the forest.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "가시를 뺀 뒤에도,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/ko_c84f99c7b1f1.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "숲에서 사슴 곁에 있었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_d49e34bed375.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/e8b08e4056.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "After pulling out the thorns,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_8e13b7d54cd4.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "stayed beside the deer in the forest.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_a30d5a9c5301.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/f3eb515e0f.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "re7a13ee4",
   "key": "쏴아아, 커다란 폭포 소리가 들려왔어요.",
   "keyEn": "쏴아아, 커다란 폭포 소리가 들려왔어요.",
   "mode": "read",
   "tpl": "쏴아아, 커다란 폭포 소리가 들려왔어요.",
   "en": "Whoosh, splash! Dahyun heard the sound of a great big waterfall.",
   "tplEn": "Whoosh, splash! {A_en} heard the sound of a great big waterfall.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Whoosh, splash!",
      "gap": 0.36,
      "url": "audio/el/unicorn/parts/en_da2163e34d02.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "heard the sound of a great big waterfall.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_3286933d8801.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/a1d9864fcd.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r525e4764",
   "key": "다현이는 숲을 떠나 폭포 앞에 다다랐어요.",
   "keyEn": "다현이는 숲을 떠나 폭포 앞에 다다랐어요.",
   "mode": "read",
   "tpl": "{A:이는/는} 숲을 떠나 폭포 앞에 다다랐어요.",
   "en": "Dahyun left the forest and reached the waterfall.",
   "tplEn": "{A_en} left the forest and reached the waterfall.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "숲을 떠나 폭포 앞에 다다랐어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_d9d9312e0ecc.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/f9fb21478f.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "left the forest and reached the waterfall.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_531623200da4.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/abca9e9ecc.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r6fea637a",
   "key": "폭포 앞에서, 다현이가 배고픈 말에게 말했어요.",
   "keyEn": "폭포 앞에서, 다현이가 배고픈 말에게 말했어요.",
   "mode": "read",
   "tpl": "폭포 앞에서, {A:이가/가} 배고픈 말에게 말했어요.",
   "en": "By the waterfall, Dahyun spoke to the hungry horse.",
   "tplEn": "By the waterfall, {A_en} spoke to the hungry horse.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "S",
      "tpl": "폭포 앞에서,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/ko_fd33ee3c90bd.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "배고픈 말에게 말했어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_d3d36eff11e5.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/b406d70a50.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "By the waterfall,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_269eba748021.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "spoke to the hungry horse.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_b42dcd1e0e30.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/b7c6078011.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "ra8bc2272",
   "key": "다현이는 바구니를 열어 간식을 반으로 똑 나누었어요.",
   "keyEn": "다현이는 바구니를 열어 간식을 반으로 똑 나누었어요.",
   "mode": "read",
   "tpl": "{A:이는/는} 바구니를 열어 간식을 반으로 똑 나누었어요.",
   "en": "Dahyun opened the basket and broke the snack, snap, right in half.",
   "tplEn": "{A_en} opened the basket and broke the snack, snap, right in half.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "바구니를 열어 간식을 반으로 똑 나누었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_cc825f04ca9c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/73bad6e24b.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "opened the basket and broke the snack, snap, right in half.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_016e0ca55892.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/06cf61b822.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r3d9e7402",
   "key": "다현이는 말과 헤어져 혼자 길로 나왔어요.",
   "keyEn": "다현이는 말과 헤어져 혼자 길로 나왔어요.",
   "mode": "read",
   "tpl": "{A:이는/는} 말과 헤어져 혼자 길로 나왔어요.",
   "en": "After saying goodbye to the horse, Dahyun came out onto the road alone.",
   "tplEn": "After saying goodbye to the horse, {A_en} came out onto the road alone.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "말과 헤어져 혼자 길로 나왔어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_45dd99d3bbba.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/88b0b37819.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "After saying goodbye to the horse,",
      "gap": 0.22,
      "url": "audio/el/unicorn/parts/en_5b7125da47cc.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "came out onto the road alone.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_09c0b75802cc.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/f79cb45649.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "re5d05d07",
   "key": "다리는 무겁고, 눈은 자꾸 깜빡깜빡 감겼어요.",
   "keyEn": "다리는 무겁고, 눈은 자꾸 깜빡깜빡 감겼어요.",
   "mode": "read",
   "tpl": "다리는 무겁고, 눈은 자꾸 깜빡깜빡 감겼어요.",
   "en": "Her legs felt heavy, and her eyes kept drooping, blink, blink.",
   "tplEn": "{A_g:His/Her} legs felt heavy, and {A_g:his/her} eyes kept drooping, blink, blink.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "{A_g:His/Her} legs felt heavy, and {A_g:his/her} eyes kept drooping, blink, blink.",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/nar_31b937762d.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/f4189f3ac9.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "rd29aa47b",
   "key": "다현이는 그 길을 계속 걷고 있었어요.",
   "keyEn": "다현이는 그 길을 계속 걷고 있었어요.",
   "mode": "read",
   "tpl": "{A:이는/는} 그 길을 계속 걷고 있었어요.",
   "en": "Dahyun was still walking along the road.",
   "tplEn": "{A_en} was still walking along the road.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "그 길을 계속 걷고 있었어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_5cd1cbd9139e.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/829ffad6e2.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "was still walking along the road.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_1d47f0099ab0.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/96acd51066.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r8ad0ee46",
   "key": "유니콘이 다현이에게 다정하게 말했어요.",
   "keyEn": "유니콘이 다현이에게 다정하게 말했어요.",
   "mode": "read",
   "tpl": "유니콘이 {A:이에게/에게} 다정하게 말했어요.",
   "en": "The unicorn spoke gently to Dahyun.",
   "tplEn": "The unicorn spoke gently to {A_en}.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "유니콘이 {A:이에게/에게}",
    "pieces": [
     {
      "k": "N",
      "tpl": "유니콘이 {A:이에게/에게}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "다정하게 말했어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_adca6f294e12.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/de35e4d3c2.mp3",
    "urlLook": {},
    "chars": 10
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": true,
    "n": 0,
    "send": "[calm, warm storytelling] The unicorn spoke gently to {A_en}.",
    "pieces": [
     {
      "k": "N",
      "tpl": "The unicorn spoke gently to {A_en}.",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/nar_06374ad635.mp3",
    "urlLook": {},
    "chars": 61
   },
   "g": []
  },
  {
   "id": "rec9bd047",
   "key": "다현이의 눈이 반짝반짝 빛났어요. 가슴이 콩닥콩닥 뛰었지요.",
   "keyEn": "다현이의 눈이 반짝반짝 빛났어요. 가슴이 콩닥콩닥 뛰었지요.",
   "mode": "read",
   "tpl": "{A:이의/의} 눈이 반짝반짝 빛났어요. 가슴이 콩닥콩닥 뛰었지요.",
   "en": "Dahyun's eyes shone, sparkle, sparkle. Her heart went thump, thump, thump.",
   "tplEn": "{A_en}'s eyes shone, sparkle, sparkle. {A_g:His/Her} heart went thump, thump, thump.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{A:이의/의} 눈이",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이의/의} 눈이",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "반짝반짝 빛났어요. 가슴이 콩닥콩닥 뛰었지요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_ab90e9d09e40.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/41924883ba.mp3",
    "urlLook": {},
    "chars": 7
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling, slow, unhurried]",
    "whole": false,
    "n": 0,
    "send": "{A_en}'s eyes",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}'s eyes",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "shone, sparkle, sparkle. {A_g:His/Her} heart went thump, thump, thump.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/en_3ee8174b8935.mp3",
      "urls": {
       "b": "audio/el/unicorn/parts/en_0fc3beaecc77.mp3",
       "g": "audio/el/unicorn/parts/en_3ee8174b8935.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/name/53bf70550e.mp3",
    "urlLook": {
     "Ab": "audio/el/unicorn/look/Ab/en/name/105049b197.mp3"
    },
    "chars": 13
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "r7136db4f",
   "key": "유니콘이 다현이에게 고맙다고 말했어요.",
   "keyEn": "유니콘이 다현이에게 고맙다고 말했어요.",
   "mode": "read",
   "tpl": "유니콘이 {A:이에게/에게} 고맙다고 말했어요.",
   "en": "The unicorn thanked Dahyun.",
   "tplEn": "The unicorn thanked {A_en}.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": false,
    "n": 0,
    "send": "유니콘이 {A:이에게/에게}",
    "pieces": [
     {
      "k": "N",
      "tpl": "유니콘이 {A:이에게/에게}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "고맙다고 말했어요.",
      "gap": 0,
      "url": "audio/el/unicorn/parts/ko_07bd3f2a5d53.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/name/bdbff1dc4d.mp3",
    "urlLook": {},
    "chars": 10
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "gnWujHp24oqX3I03lRbU",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[calm, warm storytelling]",
    "whole": true,
    "n": 0,
    "send": "[calm, warm storytelling] The unicorn thanked {A_en}.",
    "pieces": [
     {
      "k": "N",
      "tpl": "The unicorn thanked {A_en}.",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/unicorn/en/nar_6a9ebaa7f0.mp3",
    "urlLook": {},
    "chars": 53
   },
   "g": []
  }
 ],
 "witch_candy": [
  {
   "id": "kc5c12031",
   "key": "다현이랑 친구들은 사탕 가게로 쪼르르 들어갔어요.",
   "keyEn": "다현이랑 친구들은 사탕 가게로 쪼르르 들어갔어요.",
   "mode": "both",
   "tpl": "{A:이랑/랑} 친구들은 사탕 가게로 쪼르르 들어갔어요.",
   "en": "Dahyun and her friends scurried right into the candy shop.",
   "tplEn": "{A_en} and {A_g:his/her} friends scurried right into the candy shop.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, playful storytelling, slow, clear, cosy Halloween night, never scary]",
    "whole": false,
    "n": 0,
    "send": "{A:이랑/랑}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이랑/랑}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "친구들은 사탕 가게로 쪼르르 들어갔어요.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_2b998feb0cc5.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/29e7ea0ab6.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, playful storytelling, slow, clear, cosy Halloween night, never scary]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "and {A_g:his/her} friends scurried right into the candy shop.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_b4fc5793a126.mp3",
      "urls": {
       "b": "audio/el/witch_candy/parts/en_5dc38e4596cd.mp3",
       "g": "audio/el/witch_candy/parts/en_b4fc5793a126.mp3"
      }
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/3ee9c8eab8.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/0e0ab17794.mp3"
    },
    "chars": 6
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "kf6cda826",
   "key": "다현아, 네가 넣어 줘. 하나든 여러 개든 좋아.",
   "keyEn": "다현아, 네가 넣어 줘. 하나든 여러 개든 좋아.",
   "mode": "both",
   "tpl": "{A:아/야}, 네가 넣어 줘. 하나든 여러 개든 좋아.",
   "en": "Dahyun, you put them in. One or lots, it's all good.",
   "tplEn": "{A_en}, you put them in. One or lots, it's all good.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "TC0Zp7WVFzhA8zpTlRqV",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.35,
     "similarity_boost": 0.75,
     "style": 0.55
    },
    "tag": "[kind quirky witch, warm, giggly, a little silly, never scary]",
    "whole": false,
    "n": 0,
    "send": "{A:아/야},",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:아/야},",
      "gap": 0.16,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "네가 넣어 줘. 하나든 여러 개든 좋아.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_e730a9298a1f.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/7ca67ace62.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "TC0Zp7WVFzhA8zpTlRqV",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.35,
     "similarity_boost": 0.75,
     "style": 0.55
    },
    "tag": "[kind quirky witch, warm, giggly, a little silly, never scary]",
    "whole": false,
    "n": 0,
    "send": "{A_en},",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en},",
      "gap": 0.16,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "you put them in. One or lots, it's all good.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_3c2132bcadae.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/c510326cde.mp3",
    "urlLook": {},
    "chars": 7
   },
   "g": []
  },
  {
   "id": "k22539efe",
   "key": "뿅! 다현이가 빨간 딸기가 됐어요!",
   "keyEn": "뿅! 다현이가 빨간 딸기가 됐어요!",
   "mode": "both",
   "tpl": "뿅! {A:이가/가} 빨간 딸기가 됐어요!",
   "en": "Poof! Dahyun turned into a red strawberry!",
   "tplEn": "Poof! {A_en} turned into a red strawberry!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "빨간 딸기가 됐어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_a4c93bd830b7.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/0fdb609bad.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "turned into a red strawberry!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_14bc83149b86.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/ddf13dd035.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k85132cf3",
   "key": "뿅! 다현이 발이 오리발이 됐어요!",
   "keyEn": "뿅! 다현이 발이 오리발이 됐어요!",
   "mode": "both",
   "tpl": "뿅! {A:이/} 발이 오리발이 됐어요!",
   "en": "Poof! Dahyun's feet turned into duck feet!",
   "tplEn": "Poof! {A_en}'s feet turned into duck feet!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이/} 발이",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이/} 발이",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "오리발이 됐어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_71483db6f465.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/e62097ddf1.mp3",
    "urlLook": {},
    "chars": 6
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}'s feet",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}'s feet",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "turned into duck feet!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_5e17cd0ea9e3.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/970615f245.mp3",
    "urlLook": {},
    "chars": 13
   },
   "g": []
  },
  {
   "id": "k65062049",
   "key": "뿅! 다현이한테 물고기 꼬리가 생겼어요!",
   "keyEn": "뿅! 다현이한테 물고기 꼬리가 생겼어요!",
   "mode": "both",
   "tpl": "뿅! {A:이한테/한테} 물고기 꼬리가 생겼어요!",
   "en": "Poof! Dahyun grew a fish tail!",
   "tplEn": "Poof! {A_en} grew a fish tail!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이한테/한테}",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이한테/한테}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "물고기 꼬리가 생겼어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_2d1d30dbea0e.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/eff9418f91.mp3",
    "urlLook": {},
    "chars": 5
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "grew a fish tail!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_799e352781ae.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/efe8039651.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k376bdc7f",
   "key": "뿅! 다현이의 볼이랑 배가 호박처럼 환해졌어요!",
   "keyEn": "뿅! 다현이의 볼이랑 배가 호박처럼 환해졌어요!",
   "mode": "both",
   "tpl": "뿅! {A:이의/의} 볼이랑 배가 호박처럼 환해졌어요!",
   "en": "Poof! Dahyun's cheeks and tummy glowed like a pumpkin!",
   "tplEn": "Poof! {A_en}'s cheeks and tummy glowed like a pumpkin!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이의/의} 볼이랑",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이의/의} 볼이랑",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "배가 호박처럼 환해졌어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_3f351dbe4c85.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/52669c6e59.mp3",
    "urlLook": {},
    "chars": 8
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}'s cheeks",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}'s cheeks",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "and tummy glowed like a pumpkin!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_b9abedc5993b.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/04c89d7b41.mp3",
    "urlLook": {},
    "chars": 15
   },
   "g": []
  },
  {
   "id": "k1dc13ac1",
   "key": "뿅! 다현이 등에 박쥐 날개가 돋았어요!",
   "keyEn": "뿅! 다현이 등에 박쥐 날개가 돋았어요!",
   "mode": "both",
   "tpl": "뿅! {A:이/} 등에 박쥐 날개가 돋았어요!",
   "en": "Poof! On Dahyun's back, bat wings sprouted!",
   "tplEn": "Poof! On {A_en}'s back, bat wings sprouted!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이/} 등에",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이/} 등에",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "박쥐 날개가 돋았어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_b9829012f3b9.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/892ccf0ce4.mp3",
    "urlLook": {},
    "chars": 6
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "On {A_en}'s back,",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "On {A_en}'s back,",
      "gap": 0.16,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "bat wings sprouted!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_96befbfb008c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/55880cd3bd.mp3",
    "urlLook": {},
    "chars": 17
   },
   "g": []
  },
  {
   "id": "k0d201841",
   "key": "뿅! 다현이 입에 초콜릿 수염이 났어요!",
   "keyEn": "뿅! 다현이 입에 초콜릿 수염이 났어요!",
   "mode": "both",
   "tpl": "뿅! {A:이/} 입에 초콜릿 수염이 났어요!",
   "en": "Poof! Dahyun grew a chocolate moustache!",
   "tplEn": "Poof! {A_en} grew a chocolate moustache!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이/} 입에",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이/} 입에",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "초콜릿 수염이 났어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_ea1ba64fcd44.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/af6caa47d4.mp3",
    "urlLook": {},
    "chars": 6
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "grew a chocolate moustache!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_ce9ca0ed25b6.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/0e8daeba73.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k44fb737c",
   "key": "길을 데굴데굴 굴러가다 호박 등에 통!",
   "keyEn": "길을 데굴데굴 굴러가다 호박 등에 통!",
   "mode": "both",
   "tpl": "길을 데굴데굴 굴러가다 호박 등에 통!",
   "en": "She rolled and rolled down the street and bonked into a pumpkin lantern!",
   "tplEn": "{A_g:He/She} rolled and rolled down the street and bonked into a pumpkin lantern!",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, rhythmic on the sound words, smiling]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "{A_g:He/She} rolled and rolled down the street and bonked into a pumpkin lantern!",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_8e35e93283.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/7ecd0469a7.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "kb039c3ca",
   "key": "보름달 둘레를 보글보글 헤엄쳤어요.",
   "keyEn": "보름달 둘레를 보글보글 헤엄쳤어요.",
   "mode": "both",
   "tpl": "보름달 둘레를 보글보글 헤엄쳤어요.",
   "en": "She swam, bubble bubble, all around the full moon.",
   "tplEn": "{A_g:He/She} swam, bubble bubble, all around the full moon.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, rhythmic on the sound words, smiling]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "{A_g:He/She} swam, bubble bubble, all around the full moon.",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_ca882dc844.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/a0faaab737.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "k9ec48e1f",
   "key": "폴짝, 폴짝, 폴짝! 지붕 위에서 손을 흔들었어요.",
   "keyEn": "폴짝, 폴짝, 폴짝! 지붕 위에서 손을 흔들었어요.",
   "mode": "both",
   "tpl": "폴짝, 폴짝, 폴짝! 지붕 위에서 손을 흔들었어요.",
   "en": "Hop, hop, hop! She waved from up on the roof.",
   "tplEn": "Hop, hop, hop! {A_g:He/She} waved from up on the roof.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, rhythmic on the sound words, smiling]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "Hop, hop, hop! {A_g:He/She} waved from up on the roof.",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_5e596d6d47.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/9aed6d969c.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "kaff19f4d",
   "key": "다현이 덕분에 깜깜한 길이 환해졌어요.",
   "keyEn": "다현이 덕분에 깜깜한 길이 환해졌어요.",
   "mode": "both",
   "tpl": "{A:이/} 덕분에 깜깜한 길이 환해졌어요.",
   "en": "Thanks to Dahyun, the dark street grew bright.",
   "tplEn": "Thanks to {A_en}, the dark street grew bright.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, rhythmic on the sound words, smiling]",
    "whole": false,
    "n": 0,
    "send": "{A:이/} 덕분에",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이/} 덕분에",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "깜깜한 길이 환해졌어요.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_4ddd6047ef16.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/f3fc1a047e.mp3",
    "urlLook": {},
    "chars": 7
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, rhythmic on the sound words, smiling]",
    "whole": false,
    "n": 0,
    "send": "Thanks to {A_en},",
    "pieces": [
     {
      "k": "N",
      "tpl": "Thanks to {A_en},",
      "gap": 0.16,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "the dark street grew bright.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_399733720ed5.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/cc5ebf70a4.mp3",
    "urlLook": {},
    "chars": 17
   },
   "g": []
  },
  {
   "id": "k2aee09ff",
   "key": "박쥐 친구들이랑 달 앞을 빙글 돌았어요.",
   "keyEn": "박쥐 친구들이랑 달 앞을 빙글 돌았어요.",
   "mode": "both",
   "tpl": "박쥐 친구들이랑 달 앞을 빙글 돌았어요.",
   "en": "She circled in front of the moon with her bat friends.",
   "tplEn": "{A_g:He/She} circled in front of the moon with {A_g:his/her} bat friends.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, rhythmic on the sound words, smiling]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "{A_g:He/She} circled in front of the moon with {A_g:his/her} bat friends.",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_b72a57c69c.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/8dcc0221d5.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "k971204af",
   "key": "납작해졌다가… 뿅!",
   "keyEn": "납작해졌다가… 뿅!",
   "mode": "both",
   "tpl": "납작해졌다가… 뿅!",
   "en": "She went flat as a pancake... then poof!",
   "tplEn": "{A_g:He/She} went flat as a pancake... then poof!",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, rhythmic on the sound words, smiling]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "{A_g:He/She} went flat as a pancake... then poof!",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_e80f5d8fe5.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/5acc8fe963.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "k549d833e",
   "key": "녹았다!",
   "keyEn": "녹았다!",
   "mode": "both",
   "tpl": "녹았다!",
   "en": "She melted!",
   "tplEn": "{A_g:He/She} melted!",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "TC0Zp7WVFzhA8zpTlRqV",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.35,
     "similarity_boost": 0.75,
     "style": 0.55
    },
    "tag": "[kind quirky witch, surprised, giggling]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "{A_g:He/She} melted!",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/witch_a5a604f74b.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/e8ea65739b.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "kff44df00",
   "key": "뿅! 다현이는 다시 원래대로 돌아왔어요.",
   "keyEn": "뿅! 다현이는 다시 원래대로 돌아왔어요.",
   "mode": "both",
   "tpl": "뿅! {A:이는/는} 다시 원래대로 돌아왔어요.",
   "en": "Poof! Dahyun was back to normal.",
   "tplEn": "Poof! {A_en} was back to normal.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, settling, gentle]",
    "whole": false,
    "n": 1,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_b97c0a407c32.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "다시 원래대로 돌아왔어요.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_2a56aadf1aab.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/950e07d81c.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, settling, gentle]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_352abce1e859.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "was back to normal.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_030816f07bb9.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/0d4691399a.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "kff462a0a",
   "key": "다현이 덕분에 사탕이 가득! 내년에도 같이 섞자.",
   "keyEn": "다현이 덕분에 사탕이 가득! 내년에도 같이 섞자.",
   "mode": "both",
   "tpl": "{A:이/} 덕분에 사탕이 가득! 내년에도 같이 섞자.",
   "en": "Thanks to Dahyun, we have candy galore! Let's mix again next year.",
   "tplEn": "Thanks to {A_en}, we have candy galore! Let's mix again next year.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "TC0Zp7WVFzhA8zpTlRqV",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.35,
     "similarity_boost": 0.75,
     "style": 0.55
    },
    "tag": "[kind quirky witch, grateful, warm, smiling]",
    "whole": false,
    "n": 0,
    "send": "{A:이/} 덕분에",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이/} 덕분에",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "사탕이 가득! 내년에도 같이 섞자.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_539f7377825b.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/fbbcf922fd.mp3",
    "urlLook": {},
    "chars": 7
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "TC0Zp7WVFzhA8zpTlRqV",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.35,
     "similarity_boost": 0.75,
     "style": 0.55
    },
    "tag": "[kind quirky witch, grateful, warm, smiling]",
    "whole": false,
    "n": 0,
    "send": "Thanks to {A_en},",
    "pieces": [
     {
      "k": "N",
      "tpl": "Thanks to {A_en},",
      "gap": 0.16,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "we have candy galore! Let's mix again next year.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_dcb1c5ba369b.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/1ab3257558.mp3",
    "urlLook": {},
    "chars": 17
   },
   "g": []
  },
  {
   "id": "k34902036",
   "key": "뿅! 다현이가 동그란 연두 키위가 됐어요!",
   "keyEn": "뿅! 다현이가 동그란 연두 키위가 됐어요!",
   "mode": "both",
   "tpl": "뿅! {A:이가/가} 동그란 연두 키위가 됐어요!",
   "en": "Poof! Dahyun turned into a round lime-green kiwi!",
   "tplEn": "Poof! {A_en} turned into a round lime-green kiwi!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "동그란 연두 키위가 됐어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_b6c48d5bccbf.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/5dbe3f0299.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "turned into a round lime-green kiwi!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_0fc839291165.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/1572ea43f7.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "keac8207a",
   "key": "통, 통, 통! 키위 공처럼 길을 통통 튀어 갔어요.",
   "keyEn": "통, 통, 통! 키위 공처럼 길을 통통 튀어 갔어요.",
   "mode": "both",
   "tpl": "통, 통, 통! 키위 공처럼 길을 통통 튀어 갔어요.",
   "en": "Boing, boing, boing! She bounced down the street like a kiwi ball.",
   "tplEn": "Boing, boing, boing! {A_g:He/She} bounced down the street like a kiwi ball.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, rhythmic on the sound words, smiling]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "Boing, boing, boing! {A_g:He/She} bounced down the street like a kiwi ball.",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_53cb401b69.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/296cbd02af.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "k4fe7ec05",
   "key": "뿅! 다현이한테 초록 악어 꼬리가 생겼어요!",
   "keyEn": "뿅! 다현이한테 초록 악어 꼬리가 생겼어요!",
   "mode": "both",
   "tpl": "뿅! {A:이한테/한테} 초록 악어 꼬리가 생겼어요!",
   "en": "Poof! Dahyun grew a green crocodile tail!",
   "tplEn": "Poof! {A_en} grew a green crocodile tail!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이한테/한테}",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이한테/한테}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "초록 악어 꼬리가 생겼어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_4248244fcd39.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/8aa02c7a1c.mp3",
    "urlLook": {},
    "chars": 5
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "grew a green crocodile tail!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_1b0ea5843822.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/cb3f19735d.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "k6f868357",
   "key": "엉금엉금 기어가다 앙! 호박이가 깜짝 놀라 폴짝 뛰었어요.",
   "keyEn": "엉금엉금 기어가다 앙! 호박이가 깜짝 놀라 폴짝 뛰었어요.",
   "mode": "both",
   "tpl": "엉금엉금 기어가다 앙! 호박이가 깜짝 놀라 폴짝 뛰었어요.",
   "en": "She crawled along, creep, creep... then SNAP! Pumpkin the cat jumped in surprise.",
   "tplEn": "{A_g:He/She} crawled along, creep, creep... then SNAP! Pumpkin the cat jumped in surprise.",
   "ko": null,
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, slow creeping then a sudden snap, smiling]",
    "whole": true,
    "n": null,
    "send": null,
    "pieces": [
     {
      "k": "S",
      "tpl": "{A_g:He/She} crawled along, creep, creep... then SNAP! Pumpkin the cat jumped in surprise.",
      "gap": 0
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_5318e8a8c6.mp3",
    "urlLook": {
     "Ab": "audio/el/witch_candy/look/Ab/en/name/ecdf5582da.mp3"
    },
    "chars": 0
   },
   "g": [
    "A"
   ]
  },
  {
   "id": "kba636464",
   "key": "뿅! 다현이가 청록 개구리가 됐어요!",
   "keyEn": "뿅! 다현이가 청록 개구리가 됐어요!",
   "mode": "both",
   "tpl": "뿅! {A:이가/가} 청록 개구리가 됐어요!",
   "en": "Poof! Dahyun turned into a teal frog!",
   "tplEn": "Poof! {A_en} turned into a teal frog!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "S",
      "tpl": "뿅!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/ko_29b43d27b14e.mp3"
     },
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "청록 개구리가 됐어요!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_e6bf27f5b650.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/cd65f52cff.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[bright, magical, excited storytelling]",
    "whole": false,
    "n": 1,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "S",
      "tpl": "Poof!",
      "gap": 0.4,
      "url": "audio/el/witch_candy/parts/en_cfb93a25896b.mp3"
     },
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "turned into a teal frog!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_7fe89998585e.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/ca428aa5f3.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r05af912b",
   "key": "다현이가 장작에 불씨를 톡 올렸어요.",
   "keyEn": "다현이가 장작에 불씨를 톡 올렸어요.",
   "mode": "read",
   "tpl": "{A:이가/가} 장작에 불씨를 톡 올렸어요.",
   "en": "Dahyun popped a tiny spark onto the firewood.",
   "tplEn": "{A_en} popped a tiny spark onto the firewood.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, playful storytelling, slow, clear, cosy Halloween night, never scary]",
    "whole": false,
    "n": 0,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "장작에 불씨를 톡 올렸어요.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_69f648a7dff2.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/2987303cb4.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, playful storytelling, slow, clear, cosy Halloween night, never scary]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "popped a tiny spark onto the firewood.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_f252bf07ddb8.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/38e248c64b.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "raed434aa",
   "key": "다현이는 아기 용 콧물이랑 빨간 소방차를 솥에 넣었어요. 뚝, 삐뽀삐뽀!",
   "keyEn": "다현이는 아기 용 콧물이랑 빨간 소방차를 솥에 넣었어요. 뚝, 삐뽀삐뽀!",
   "mode": "read",
   "tpl": "{A:이는/는} 아기 용 콧물이랑 빨간 소방차를 솥에 넣었어요. 뚝, 삐뽀삐뽀!",
   "en": "Dahyun dropped baby dragon snot and the red fire truck into the cauldron. Drip, nee-naw nee-naw!",
   "tplEn": "{A_en} dropped baby dragon snot and the red fire truck into the cauldron. Drip, nee-naw nee-naw!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "아기 용 콧물이랑 빨간 소방차를 솥에 넣었어요. 뚝, 삐뽀삐뽀!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_019ff5f4678d.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/b8e3ec0e53.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped baby dragon snot and the red fire truck into the cauldron. Drip, nee-naw nee-naw!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_fdd237bd842c.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/d5a9ddf90d.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r988c008c",
   "key": "다현이는 병아리 방귀랑 고무 오리를 솥에 넣었어요. 뿡, 꽥!",
   "keyEn": "다현이는 병아리 방귀랑 고무 오리를 솥에 넣었어요. 뿡, 꽥!",
   "mode": "read",
   "tpl": "{A:이는/는} 병아리 방귀랑 고무 오리를 솥에 넣었어요. 뿡, 꽥!",
   "en": "Dahyun dropped the chick toots and the rubber duck into the cauldron. Toot, quack!",
   "tplEn": "{A_en} dropped the chick toots and the rubber duck into the cauldron. Toot, quack!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "병아리 방귀랑 고무 오리를 솥에 넣었어요. 뿡, 꽥!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_7a212ca0fc64.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/d31523f62f.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped the chick toots and the rubber duck into the cauldron. Toot, quack!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_67fbb71597a0.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/a72d5c7c98.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "rcd1e4c72",
   "key": "다현이는 괴물 응가랑 파란 생선을 솥에 넣었어요. 퐁, 첨벙!",
   "keyEn": "다현이는 괴물 응가랑 파란 생선을 솥에 넣었어요. 퐁, 첨벙!",
   "mode": "read",
   "tpl": "{A:이는/는} 괴물 응가랑 파란 생선을 솥에 넣었어요. 퐁, 첨벙!",
   "en": "Dahyun dropped the monster poo and the blue fish into the cauldron. Plop, splash!",
   "tplEn": "{A_en} dropped the monster poo and the blue fish into the cauldron. Plop, splash!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "괴물 응가랑 파란 생선을 솥에 넣었어요. 퐁, 첨벙!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_9605ca4ce749.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/40f96db4ef.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped the monster poo and the blue fish into the cauldron. Plop, splash!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_93fb0533fd81.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/4330d09367.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r2935dfa7",
   "key": "다현이는 초록 개구리랑 파란 파도를 솥에 넣었어요. 개굴, 철썩!",
   "keyEn": "다현이는 초록 개구리랑 파란 파도를 솥에 넣었어요. 개굴, 철썩!",
   "mode": "read",
   "tpl": "{A:이는/는} 초록 개구리랑 파란 파도를 솥에 넣었어요. 개굴, 철썩!",
   "en": "Dahyun dropped the green frog and the blue wave into the cauldron. Ribbit, splosh!",
   "tplEn": "{A_en} dropped the green frog and the blue wave into the cauldron. Ribbit, splosh!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "초록 개구리랑 파란 파도를 솥에 넣었어요. 개굴, 철썩!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_a32f66a5f0bb.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/9f8587a9cc.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped the green frog and the blue wave into the cauldron. Ribbit, splosh!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_a67862808191.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/c452d10491.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r9046a481",
   "key": "다현이는 아기 용 콧물이랑 노란 호박 등을 솥에 넣었어요. 뚝, 퐁!",
   "keyEn": "다현이는 아기 용 콧물이랑 노란 호박 등을 솥에 넣었어요. 뚝, 퐁!",
   "mode": "read",
   "tpl": "{A:이는/는} 아기 용 콧물이랑 노란 호박 등을 솥에 넣었어요. 뚝, 퐁!",
   "en": "Dahyun dropped baby dragon snot and the yellow pumpkin lantern into the cauldron. Drip, plop!",
   "tplEn": "{A_en} dropped baby dragon snot and the yellow pumpkin lantern into the cauldron. Drip, plop!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "아기 용 콧물이랑 노란 호박 등을 솥에 넣었어요. 뚝, 퐁!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_54be10c38dcf.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/dc6c6bc646.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped baby dragon snot and the yellow pumpkin lantern into the cauldron. Drip, plop!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_eae210e112d9.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/32b79721fc.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "ra2575446",
   "key": "다현이는 무당벌레랑 파란 생선을 솥에 넣었어요. 붕, 첨벙!",
   "keyEn": "다현이는 무당벌레랑 파란 생선을 솥에 넣었어요. 붕, 첨벙!",
   "mode": "read",
   "tpl": "{A:이는/는} 무당벌레랑 파란 생선을 솥에 넣었어요. 붕, 첨벙!",
   "en": "Dahyun dropped the ladybug and the blue fish into the cauldron. Bzzz, splash!",
   "tplEn": "{A_en} dropped the ladybug and the blue fish into the cauldron. Bzzz, splash!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "무당벌레랑 파란 생선을 솥에 넣었어요. 붕, 첨벙!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_29cd4c5163d9.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/704edb4cf0.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped the ladybug and the blue fish into the cauldron. Bzzz, splash!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_a2c36ba09b06.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/9abfcfefdc.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r093e2b90",
   "key": "다현이는 빨간 소방차랑 초록 공룡을 솥에 넣었어요. 삐뽀삐뽀, 크앙!",
   "keyEn": "다현이는 빨간 소방차랑 초록 공룡을 솥에 넣었어요. 삐뽀삐뽀, 크앙!",
   "mode": "read",
   "tpl": "{A:이는/는} 빨간 소방차랑 초록 공룡을 솥에 넣었어요. 삐뽀삐뽀, 크앙!",
   "en": "Dahyun dropped the red fire truck and the green dinosaur into the cauldron. Nee-naw nee-naw, rawr!",
   "tplEn": "{A_en} dropped the red fire truck and the green dinosaur into the cauldron. Nee-naw nee-naw, rawr!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "빨간 소방차랑 초록 공룡을 솥에 넣었어요. 삐뽀삐뽀, 크앙!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_536612c6d5e5.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/66344a29f5.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, comic on the sound words, clear]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped the red fire truck and the green dinosaur into the cauldron. Nee-naw nee-naw, rawr!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_f0e41c25435f.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/8bea652988.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r2cfcb1be",
   "key": "다현이는 병아리 방귀랑 구운 초록 대파를 솥에 넣었어요. 뿡, 지글지글!",
   "keyEn": "다현이는 병아리 방귀랑 구운 초록 대파를 솥에 넣었어요. 뿡, 지글지글!",
   "mode": "read",
   "tpl": "{A:이는/는} 병아리 방귀랑 구운 초록 대파를 솥에 넣었어요. 뿡, 지글지글!",
   "en": "Dahyun dropped chick toots and the grilled green onion into the cauldron. Toot, sizzle!",
   "tplEn": "{A_en} dropped chick toots and the grilled green onion into the cauldron. Toot, sizzle!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, two funny sound words]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "병아리 방귀랑 구운 초록 대파를 솥에 넣었어요. 뿡, 지글지글!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_5a60567c33e9.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/b4f8aaf558.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, two funny sound words]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped chick toots and the grilled green onion into the cauldron. Toot, sizzle!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_92c1abd56d68.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/9e933f0f59.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r4e23d0e6",
   "key": "다현이는 초록 공룡이랑 구운 초록 대파를 솥에 넣었어요. 쿵, 지글지글!",
   "keyEn": "다현이는 초록 공룡이랑 구운 초록 대파를 솥에 넣었어요. 쿵, 지글지글!",
   "mode": "read",
   "tpl": "{A:이는/는} 초록 공룡이랑 구운 초록 대파를 솥에 넣었어요. 쿵, 지글지글!",
   "en": "Dahyun dropped the green dinosaur and the grilled green onion into the cauldron. Stomp, sizzle!",
   "tplEn": "{A_en} dropped the green dinosaur and the grilled green onion into the cauldron. Stomp, sizzle!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, two funny sound words]",
    "whole": false,
    "n": 0,
    "send": "{A:이는/는}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이는/는}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "초록 공룡이랑 구운 초록 대파를 솥에 넣었어요. 쿵, 지글지글!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_a404bd974957.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/f816110d52.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, two funny sound words]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped the green dinosaur and the grilled green onion into the cauldron. Stomp, sizzle!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_777f872258cb.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/b75a8fc677.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "r63317f61",
   "key": "다현이가 하나씩, 하나씩, 퐁퐁퐁 넣었어요.",
   "keyEn": "다현이가 하나씩, 하나씩, 퐁퐁퐁 넣었어요.",
   "mode": "read",
   "tpl": "{A:이가/가} 하나씩, 하나씩, 퐁퐁퐁 넣었어요.",
   "en": "Dahyun dropped them in one by one. Plop, plop, plop!",
   "tplEn": "{A_en} dropped them in one by one. Plop, plop, plop!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, three bouncy plops]",
    "whole": false,
    "n": 0,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "하나씩, 하나씩, 퐁퐁퐁 넣었어요.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_7a1c03d24e10.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/5b9fdec703.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[playful storytelling, three bouncy plops]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "dropped them in one by one. Plop, plop, plop!",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_82010b80b7bd.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/c4c8562954.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  },
  {
   "id": "rd6e8a61b",
   "key": "다현이가 사탕 마녀 손을 잡고 폴짝 뛰었어요.",
   "keyEn": "다현이가 사탕 마녀 손을 잡고 폴짝 뛰었어요.",
   "mode": "read",
   "tpl": "{A:이가/가} 사탕 마녀 손을 잡고 폴짝 뛰었어요.",
   "en": "Dahyun took the Candy Witch's hand and hopped for joy.",
   "tplEn": "{A_en} took the Candy Witch's hand and hopped for joy.",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, joyful storybook ending tone]",
    "whole": false,
    "n": 0,
    "send": "{A:이가/가}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이가/가}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "사탕 마녀 손을 잡고 폴짝 뛰었어요.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/ko_9152f72e94a9.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/name/4639610a8a.mp3",
    "urlLook": {},
    "chars": 4
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.4
    },
    "tag": "[warm, joyful storybook ending tone]",
    "whole": false,
    "n": 0,
    "send": "{A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}",
      "gap": 0.05,
      "slots": [
       "A"
      ],
      "g": []
     },
     {
      "k": "S",
      "tpl": "took the Candy Witch's hand and hopped for joy.",
      "gap": 0,
      "url": "audio/el/witch_candy/parts/en_bb88c51369bb.mp3"
     }
    ],
    "orig": {},
    "url": "audio/el/witch_candy/en/name/80daa4905d.mp3",
    "urlLook": {},
    "chars": 6
   },
   "g": []
  }
 ],
 "home": [
  {
   "id": "hb01c8f46",
   "key": "다현이(꼬마 마법사)",
   "keyEn": "Dahyun (little wizard)",
   "mode": "home",
   "tpl": "{A:이/}(꼬마 마법사)",
   "en": "Dahyun (little wizard)",
   "tplEn": "{A_en} (little wizard)",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[cheerful, clear, warm]",
    "whole": true,
    "n": 0,
    "send": "[cheerful, clear, warm] {A:이/}(꼬마 마법사)",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A:이/}(꼬마 마법사)",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/home/nar_5649ab8229.mp3",
    "urlLook": {},
    "chars": 35
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[cheerful, clear, warm]",
    "whole": true,
    "n": 0,
    "send": "[cheerful, clear, warm] {A_en}, little wizard",
    "pieces": [
     {
      "k": "N",
      "tpl": "{A_en}, little wizard",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/home/en/nar_157ea4f85c.mp3",
    "urlLook": {},
    "chars": 45
   },
   "g": []
  },
  {
   "id": "h92ce5f9e",
   "key": "딸기 다현이",
   "keyEn": "Strawberry Dahyun",
   "mode": "home",
   "tpl": "딸기 {A:이/}",
   "en": "Strawberry Dahyun",
   "tplEn": "Strawberry {A_en}",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[cheerful, clear, warm]",
    "whole": true,
    "n": 0,
    "send": "[cheerful, clear, warm] 딸기 {A:이/}",
    "pieces": [
     {
      "k": "N",
      "tpl": "딸기 {A:이/}",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/home/nar_3bc36030c1.mp3",
    "urlLook": {},
    "chars": 30
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[cheerful, clear, warm]",
    "whole": true,
    "n": 0,
    "send": "[cheerful, clear, warm] Strawberry {A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "Strawberry {A_en}",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/home/en/nar_0f5cacfd25.mp3",
    "urlLook": {},
    "chars": 41
   },
   "g": []
  },
  {
   "id": "h37e3fdac",
   "key": "호박 다현이",
   "keyEn": "Pumpkin Dahyun",
   "mode": "home",
   "tpl": "호박 {A:이/}",
   "en": "Pumpkin Dahyun",
   "tplEn": "Pumpkin {A_en}",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[cheerful, clear, warm]",
    "whole": true,
    "n": 0,
    "send": "[cheerful, clear, warm] 호박 {A:이/}",
    "pieces": [
     {
      "k": "N",
      "tpl": "호박 {A:이/}",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/home/nar_f32ece17fd.mp3",
    "urlLook": {},
    "chars": 30
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "pFZP5JQG7iQjIQuC4Bku",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.45,
     "similarity_boost": 0.75,
     "style": 0.35
    },
    "tag": "[cheerful, clear, warm]",
    "whole": true,
    "n": 0,
    "send": "[cheerful, clear, warm] Pumpkin {A_en}",
    "pieces": [
     {
      "k": "N",
      "tpl": "Pumpkin {A_en}",
      "gap": 0,
      "slots": [
       "A"
      ],
      "g": []
     }
    ],
    "orig": {},
    "url": "audio/el/home/en/nar_caaaf2d84d.mp3",
    "urlLook": {},
    "chars": 38
   },
   "g": []
  }
 ]
};
