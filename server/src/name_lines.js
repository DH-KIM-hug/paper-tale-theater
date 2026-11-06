// 이름 바꾸기 녹음 템플릿 — tools/elevenlabs/build_name_lines.py 가 생성(손으로 고치지 말 것).
// 줄: id, key(녹음 맵 열쇠 = 한국어 원문), keyEn(영어 맵 열쇠, 홈만 영어 글), mode(play|read|both|home), tpl/tplEn(화면 글 템플릿), en(영어 원문),
//     ko/enRec: 그 언어 녹음 조각 하나 {seg(여러 조각 줄의 몇 번째, 한 조각이면 null), segs, voice, model, settings, send(보낼 글 템플릿), orig(영어 발음 표기 원래 이름), url(지금 클립), chars}
export const NAME_LINES_VERSION = "nl1-f7941b40b9";
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
    "send": "해가 쨍쨍한 날, {A:이와/와} {B:이와/와} {C:이는/는} {D:이랑/랑} 산책을 나가요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_1e5a544bbc.mp3",
    "chars": 37
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
    "send": "On a sunny day, {A_en}, {B_en}, and {C_en} go for a walk with {D_en}.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_c704802da6.mp3",
    "chars": 71
   }
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
    "send": "{D:이를/를} 톡! 같이 킁킁해 봐요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_5d21c0fe9a.mp3",
    "chars": 18
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
    "send": "Tap {D_en}! Let's sniff together.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_c3f025f882.mp3",
    "chars": 36
   }
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
    "send": "{D:이는/는} 땅에 코를 대고 킁킁.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_3d70a01f80.mp3",
    "chars": 17
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
    "send": "{D_en} puts his nose to the ground. Sniff, sniff.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_11835e33e6.mp3",
    "chars": 52
   }
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
    "send": "킁킁킁! {D:이가/가} 무슨 냄새를 맡았어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_2e7252b04b.mp3",
    "chars": 22
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
    "send": "Sniff sniff sniff! {D_en} smells something.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_2e6654626e.mp3",
    "chars": 46
   }
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
    "send": "{D:이를/를} 톡! 냄새를 따라가요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_76b67d0453.mp3",
    "chars": 17
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
    "send": "Tap {D_en}! Follow the smell.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_bb3e83e90d.mp3",
    "chars": 32
   }
  },
  {
   "id": "kbc7b2389",
   "key": "\"꿀떡아, 같이 가!\"",
   "keyEn": "\"꿀떡아, 같이 가!\"",
   "mode": "both",
   "tpl": "\"{D:아/야}, 같이 가!\"",
   "en": "Kkulddeok, wait for us!",
   "tplEn": "{D_en}, wait for us!",
   "ko": {
    "seg": null,
    "segs": 1,
    "voice": "Lb7qkOn5hF8p7qfCDH8q",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.35,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "send": "[cheerful, calling out] {D:아/야}, 같이 가!",
    "orig": {},
    "url": "audio/el/kkultteok/nuna_af70540909.mp3",
    "chars": 34
   },
   "enRec": {
    "seg": null,
    "segs": 1,
    "voice": "Lb7qkOn5hF8p7qfCDH8q",
    "model": "eleven_v4",
    "settings": {
     "stability": 0.35,
     "similarity_boost": 0.75,
     "style": 0.45
    },
    "send": "[cheerful, calling out] {D_en}, wait for us!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nuna_05273616a0.mp3",
    "chars": 47
   }
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
    "send": "{C:이가/가} 따라 해요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_9331384ee7.mp3",
    "chars": 10
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
    "send": "{C_en} says it too.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_7975e0fb27.mp3",
    "chars": 19
   }
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
    "send": "{D:이가/가} 문틈에 코를 쏙 밀어 넣어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_83fcbceead.mp3",
    "chars": 21
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
    "send": "{D_en} pokes his nose into the gap in the door.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_23d16d3219.mp3",
    "chars": 50
   }
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
    "send": "{B:이가/가} 물방울에 손을 살짝 대 봐요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_9849c17142.mp3",
    "chars": 21
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
    "send": "{B_en} gently touches a water drop.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_ec09279a1e.mp3",
    "chars": 34
   }
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
    "send": "{A:이는/는} 후우— 바람을 불어 줘요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_85cf90937a.mp3",
    "chars": 19
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
    "send": "{A_en} blows a big breath. Whoooo!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_5ea8a3e5c9.mp3",
    "chars": 34
   }
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
    "send": "{B:이가/가} 모양 틀을 꾹! 눌러요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_efaf783f0b.mp3",
    "chars": 18
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
    "send": "{B_en} pushes the shape press. Push!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_2ad775f73f.mp3",
    "chars": 35
   }
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
    "send": "{D:이가/가} 강아지 구름과 코를 맞대요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_57d4482451.mp3",
    "chars": 20
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
    "send": "{D_en} touches noses with the puppy cloud.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_7f47d3f83f.mp3",
    "chars": 45
   }
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
    "send": "{C:이가/가} 꾹! 눌렀어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_7acb46e1c6.mp3",
    "chars": 12
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
    "send": "{C_en} presses it. Push!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_090171ad1a.mp3",
    "chars": 24
   }
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
    "send": "{D:이는/는} 축축한 바닥을 킁킁.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_5f28d81238.mp3",
    "chars": 16
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
    "send": "{D_en} sniffs the wet floor.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_c597e18330.mp3",
    "chars": 31
   }
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
    "send": "{D:이가/가} 살금살금 다가가요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_b15a9f96e1.mp3",
    "chars": 15
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
    "send": "{D_en} tiptoes closer.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_9f6f39067c.mp3",
    "chars": 25
   }
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
    "send": "{C:이가/가} 아기 먹구름을 살살 쓰다듬어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_d512e7abc3.mp3",
    "chars": 21
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
    "send": "{C_en} gently pats the baby rain cloud.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_4734e6bc8b.mp3",
    "chars": 39
   }
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
    "send": "{B:이도/도} 폴짝 뛰어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_b8fe7cc0eb.mp3",
    "chars": 12
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
    "send": "{B_en} jumps too.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_18fc001aab.mp3",
    "chars": 16
   }
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
    "send": "{D:이는/는} 아기 먹구름 볼을 할짝.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_ae0eefb74f.mp3",
    "chars": 18
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
    "send": "{D_en} licks the baby cloud's cheek. Lick!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_932239228f.mp3",
    "chars": 45
   }
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
    "send": "{D:이는/는} 하늘을 보고 멍! 멍!",
    "orig": {},
    "url": "audio/el/kkultteok/nar_9a09b086e7.mp3",
    "chars": 17
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
    "send": "{D_en} looks up at the sky. Woof! Woof!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_8420e41afa.mp3",
    "chars": 42
   }
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
    "send": "{D:이는/는} 꼬리를 살랑살랑 흔들어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_1b7f8d6711.mp3",
    "chars": 19
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
    "send": "{D_en} wags his tail, wiggle wiggle.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_17dda6a748.mp3",
    "chars": 39
   }
  },
  {
   "id": "k2a71084c",
   "key": "삼남매는 꿀떡이랑 물웅덩이에서 첨벙첨벙!",
   "keyEn": "삼남매는 꿀떡이랑 물웅덩이에서 첨벙첨벙!",
   "mode": "both",
   "tpl": "삼남매는 {D:이랑/랑} 물웅덩이에서 첨벙첨벙!",
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
    "send": "삼남매는 {D:이랑/랑} 물웅덩이에서 첨벙첨벙!",
    "orig": {},
    "url": "audio/el/kkultteok/nar_2d9d35cdb7.mp3",
    "chars": 22
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
    "send": "The three kids and {D_en} splash in the puddles!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_6e9acd0948.mp3",
    "chars": 51
   }
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
    "send": "{C:이가/가} 제일 높이 뛰어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_4fbc560c23.mp3",
    "chars": 14
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
    "send": "{C_en} jumps the highest.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_883fdea03e.mp3",
    "chars": 25
   }
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
    "send": "{D:이는/는} 딸기 냄새를 킁킁.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_148dfb2b54.mp3",
    "chars": 15
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
    "send": "{D_en} sniffs the strawberry.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_02028ea811.mp3",
    "chars": 32
   }
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
    "send": "{D:이는/는} 젖은 흙에 코를 대고 킁킁.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_a9cdd9a75e.mp3",
    "chars": 20
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
    "send": "{D_en} puts his nose to the wet dirt. Sniff, sniff.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_5385756cc9.mp3",
    "chars": 54
   }
  },
  {
   "id": "kc14a53e3",
   "key": "삼남매는 꿀떡이랑 왔던 길로 집에 가요.",
   "keyEn": "삼남매는 꿀떡이랑 왔던 길로 집에 가요.",
   "mode": "both",
   "tpl": "삼남매는 {D:이랑/랑} 왔던 길로 집에 가요.",
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
    "send": "삼남매는 {D:이랑/랑} 왔던 길로 집에 가요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_dbd984f754.mp3",
    "chars": 22
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
    "send": "The three kids and {D_en} walk home the way they came.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_32754b979d.mp3",
    "chars": 57
   }
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
    "send": "{C:이가/가} 뒤를 돌아보며 손을 흔들어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_0029de923a.mp3",
    "chars": 20
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
    "send": "{C_en} looks back and waves.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_416ffbea21.mp3",
    "chars": 28
   }
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
    "send": "{D:이는/는} 굴뚝 쪽 바람을 마지막으로 킁킁.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_e88091a79e.mp3",
    "chars": 23
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
    "send": "{D_en} takes one last sniff of the wind from the chimney.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_389af75978.mp3",
    "chars": 60
   }
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
    "send": "{A:이와/와} {B:이가/가} 소곤소곤 말했어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_e0fef1d27b.mp3",
    "chars": 20
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
    "send": "{A_en} and {B_en} whispered.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_183098b121.mp3",
    "chars": 27
   }
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
    "send": "{D:이도/도} 새근새근, 모두 꿈나라로 갔어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_828e89c5a4.mp3",
    "chars": 23
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
    "send": "{D_en} breathed softly too, and everyone drifted off to dreamland.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_0b8bfe9a4e.mp3",
    "chars": 69
   }
  },
  {
   "id": "red1f4e5e",
   "key": "삼남매와 꿀떡이는 작은 언덕 아래에 왔어요.",
   "keyEn": "삼남매와 꿀떡이는 작은 언덕 아래에 왔어요.",
   "mode": "read",
   "tpl": "삼남매와 {D:이는/는} 작은 언덕 아래에 왔어요.",
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
    "send": "삼남매와 {D:이는/는} 작은 언덕 아래에 왔어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_6d7f0d42ba.mp3",
    "chars": 24
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
    "send": "The three children and {D_en} came to a little hill.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_4fb321e297.mp3",
    "chars": 55
   }
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
    "send": "{D:이/} 꼬리가 살랑살랑, 귀가 쫑긋!",
    "orig": {},
    "url": "audio/el/kkultteok/nar_04ce8c615e.mp3",
    "chars": 20
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
    "send": "{D_en}'s tail goes swish, swish, and his ears perk right up!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_4822641ad7.mp3",
    "chars": 63
   }
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
    "send": "{A:이는/는} 성큼성큼, {B:이는/는} 씩씩하게, {C:이는/는} 아장아장 따라가요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_0ff57ae7f5.mp3",
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
    "send": "{A_en} takes big strides, {B_en} marches bravely, and {C_en} toddles along behind.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_60d95bafde.mp3",
    "chars": 81
   }
  },
  {
   "id": "r321f8c20",
   "key": "언덕 꼭대기에 오른 삼남매와 꿀떡이가 걸음을 멈췄어요.",
   "keyEn": "언덕 꼭대기에 오른 삼남매와 꿀떡이가 걸음을 멈췄어요.",
   "mode": "read",
   "tpl": "언덕 꼭대기에 오른 삼남매와 {D:이가/가} 걸음을 멈췄어요.",
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
    "send": "언덕 꼭대기에 오른 삼남매와 {D:이가/가} 걸음을 멈췄어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_4b3d00c3aa.mp3",
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
    "send": "At the top of the hill, the children and {D_en} stopped.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_24d8385deb.mp3",
    "chars": 59
   }
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
    "send": "{D:이는/는} 구름을 보고 멍멍! 짖었어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_bcf716cdda.mp3",
    "chars": 21
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
    "send": "{D_en} looks at the clouds and barks, woof, woof!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_7c6597580f.mp3",
    "chars": 52
   }
  },
  {
   "id": "r7599f685",
   "key": "삼남매와 꿀떡이는 굴뚝 아래로 내려갔어요.",
   "keyEn": "삼남매와 꿀떡이는 굴뚝 아래로 내려갔어요.",
   "mode": "read",
   "tpl": "삼남매와 {D:이는/는} 굴뚝 아래로 내려갔어요.",
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
    "send": "삼남매와 {D:이는/는} 굴뚝 아래로 내려갔어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_4ce220ce0f.mp3",
    "chars": 23
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
    "send": "The children and {D_en} went down to the foot of the chimney.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_c0e8fdc716.mp3",
    "chars": 64
   }
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
    "send": "{D:이/} 코가 문틈에서 킁킁, 꼬리가 흔들흔들.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_306793daf7.mp3",
    "chars": 25
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
    "send": "{D_en}'s nose goes sniff, sniff at the gap, and his tail wags back and forth.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_874a131104.mp3",
    "chars": 80
   }
  },
  {
   "id": "ra016473e",
   "key": "공장 안으로 들어온 삼남매와 꿀떡이는 벨트 앞에 섰어요.",
   "keyEn": "공장 안으로 들어온 삼남매와 꿀떡이는 벨트 앞에 섰어요.",
   "mode": "read",
   "tpl": "공장 안으로 들어온 삼남매와 {D:이는/는} 벨트 앞에 섰어요.",
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
    "send": "공장 안으로 들어온 삼남매와 {D:이는/는} 벨트 앞에 섰어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_b9b8d724f9.mp3",
    "chars": 31
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
    "send": "Inside the factory, the children and {D_en} stood by a long belt.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_8837ca6128.mp3",
    "chars": 68
   }
  },
  {
   "id": "r9f1f74a3",
   "key": "삼남매와 꿀떡이는 구름 모양을 만드는 기계 앞으로 갔어요.",
   "keyEn": "삼남매와 꿀떡이는 구름 모양을 만드는 기계 앞으로 갔어요.",
   "mode": "read",
   "tpl": "삼남매와 {D:이는/는} 구름 모양을 만드는 기계 앞으로 갔어요.",
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
    "send": "삼남매와 {D:이는/는} 구름 모양을 만드는 기계 앞으로 갔어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_bfb0725a12.mp3",
    "chars": 32
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
    "send": "The children and {D_en} went to a machine that made cloud shapes.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_7a1552b49b.mp3",
    "chars": 68
   }
  },
  {
   "id": "r3bd02796",
   "key": "이현이가 모양 틀을 힘껏, 쿵! 내리찍어요.",
   "keyEn": "이현이가 모양 틀을 힘껏, 쿵! 내리찍어요.",
   "mode": "read",
   "tpl": "{B:이가/가} 모양 틀을 힘껏, 쿵! 내리찍어요.",
   "en": "Ihyun pushes the shape press down with all his might. Clunk!",
   "tplEn": "{B_en} pushes the shape press down with all his might. Clunk!",
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
    "send": "{B:이가/가} 모양 틀을 힘껏, 쿵! 내리찍어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_a225ffb37c.mp3",
    "chars": 24
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
    "send": "{B_en} pushes the shape press down with all his might. Clunk!",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_110695ae84.mp3",
    "chars": 60
   }
  },
  {
   "id": "rba28fe1e",
   "key": "강아지 구름을 따라 삼남매와 꿀떡이가 공장 구석으로 갔어요.",
   "keyEn": "강아지 구름을 따라 삼남매와 꿀떡이가 공장 구석으로 갔어요.",
   "mode": "read",
   "tpl": "강아지 구름을 따라 삼남매와 {D:이가/가} 공장 구석으로 갔어요.",
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
    "send": "강아지 구름을 따라 삼남매와 {D:이가/가} 공장 구석으로 갔어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_9eed7b5919.mp3",
    "chars": 33
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
    "send": "The children and {D_en} followed the puppy cloud to a corner.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_18bd522cf6.mp3",
    "chars": 64
   }
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
    "send": "{C:이가/가} 아장아장 단추 앞으로 다가가요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_9b07fd2f15.mp3",
    "chars": 21
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
    "send": "{C_en} toddles right up to the button.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_b0aa75a392.mp3",
    "chars": 38
   }
  },
  {
   "id": "r230299f0",
   "key": "삼남매와 꿀떡이는 종이 있는 방으로 갔어요.",
   "keyEn": "삼남매와 꿀떡이는 종이 있는 방으로 갔어요.",
   "mode": "read",
   "tpl": "삼남매와 {D:이는/는} 종이 있는 방으로 갔어요.",
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
    "send": "삼남매와 {D:이는/는} 종이 있는 방으로 갔어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_313e13dbc7.mp3",
    "chars": 24
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
    "send": "The children and {D_en} went into the room with the bell.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_b52a4fbc58.mp3",
    "chars": 60
   }
  },
  {
   "id": "r96f0a178",
   "key": "먹구름들이 떠난 방에 삼남매와 꿀떡이는 잠깐 남아 있었어요.",
   "keyEn": "먹구름들이 떠난 방에 삼남매와 꿀떡이는 잠깐 남아 있었어요.",
   "mode": "read",
   "tpl": "먹구름들이 떠난 방에 삼남매와 {D:이는/는} 잠깐 남아 있었어요.",
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
    "send": "먹구름들이 떠난 방에 삼남매와 {D:이는/는} 잠깐 남아 있었어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_e476c5c738.mp3",
    "chars": 33
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
    "send": "The children and {D_en} stayed in the room after the rain clouds left.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_af1f024af0.mp3",
    "chars": 73
   }
  },
  {
   "id": "r79a1ec1c",
   "key": "꿀떡이도 삼남매를 따라 공장 밖으로 나왔어요.",
   "keyEn": "꿀떡이도 삼남매를 따라 공장 밖으로 나왔어요.",
   "mode": "read",
   "tpl": "{D:이도/도} 삼남매를 따라 공장 밖으로 나왔어요.",
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
    "send": "{D:이도/도} 삼남매를 따라 공장 밖으로 나왔어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_9cfee4d08a.mp3",
    "chars": 25
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
    "send": "{D_en} followed the children outside the factory.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_aa86b3e3b3.mp3",
    "chars": 52
   }
  },
  {
   "id": "r05a33a6d",
   "key": "공장 밖에 선 삼남매와 꿀떡이에게 빗방울이 떨어졌어요.",
   "keyEn": "공장 밖에 선 삼남매와 꿀떡이에게 빗방울이 떨어졌어요.",
   "mode": "read",
   "tpl": "공장 밖에 선 삼남매와 {D:이에게/에게} 빗방울이 떨어졌어요.",
   "en": "Raindrops fell on the children and Kkulddeok outside the factory.",
   "tplEn": "Raindrops fell on the children and {D_en} outside the factory.",
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
    "send": "공장 밖에 선 삼남매와 {D:이에게/에게} 빗방울이 떨어졌어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_ac81bd6c47.mp3",
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
    "send": "Raindrops fell on the children and {D_en} outside the factory.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_841162f3ad.mp3",
    "chars": 65
   }
  },
  {
   "id": "r847fbef7",
   "key": "비가 그치자 삼남매와 꿀떡이는 하늘을 올려다봤어요.",
   "keyEn": "비가 그치자 삼남매와 꿀떡이는 하늘을 올려다봤어요.",
   "mode": "read",
   "tpl": "비가 그치자 삼남매와 {D:이는/는} 하늘을 올려다봤어요.",
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
    "send": "비가 그치자 삼남매와 {D:이는/는} 하늘을 올려다봤어요.",
    "orig": {},
    "url": "audio/el/kkultteok/nar_898683cd89.mp3",
    "chars": 28
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
    "send": "When the rain stopped, the children and {D_en} looked up.",
    "orig": {},
    "url": "audio/el/kkultteok/en/nar_38ddbc659d.mp3",
    "chars": 60
   }
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
    "send": "[calm, warm storytelling, slow, unhurried] {B:이는/는} 빨간 자동차를 참 좋아했어요.",
    "orig": {},
    "url": "audio/el/red_car/nar_3811df30a0.mp3",
    "chars": 64
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
    "send": "[calm, warm storytelling, slow, unhurried] {B_en} loved the little red car very much.",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_954a8d991a.mp3",
    "chars": 86
   }
  },
  {
   "id": "k755fc2b4",
   "key": "밥 먹을 때도 냠냠, 잠잘 때도 쌔근, 언제나 손에 꼭 쥐고 있었지요.",
   "keyEn": "밥 먹을 때도 냠냠, 잠잘 때도 쌔근, 언제나 손에 꼭 쥐고 있었지요.",
   "mode": "both",
   "tpl": "밥 먹을 때도 냠냠, 잠잘 때도 쌔근, 언제나 손에 꼭 쥐고 있었지요.",
   "en": "Munch munch at mealtime, snore snore at bedtime, the red car was always in Ihyun's hand.",
   "tplEn": "Munch munch at mealtime, snore snore at bedtime, the red car was always in {B_en}'s hand.",
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
    "send": "[warm, playful rhythm, slow, a small pause before 잠잘 때도] Munch munch at mealtime, snore snore at bedtime, the red car was always in {B_en}'s hand.",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_0c114c002a.mp3",
    "chars": 147
   }
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
    "send": "[calm, light, slow] Then one day, {B_en} was playing outside.",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_842987a275.mp3",
    "chars": 62
   }
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
    "send": "[gentle, a tiny pause before 톡] {B_en} was so busy playing that the red car slipped out, plop, onto the grass.",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_e723680257.mp3",
    "chars": 111
   }
  },
  {
   "id": "k08c659ad",
   "key": "홀로 남은 빨간 자동차는 이현이를 찾기로 했어요. 용기 있게 출발!",
   "keyEn": "홀로 남은 빨간 자동차는 이현이를 찾기로 했어요. 용기 있게 출발!",
   "mode": "both",
   "tpl": "홀로 남은 빨간 자동차는 {B:이를/를} 찾기로 했어요. 용기 있게 출발!",
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
    "send": "[warm, building courage, slow then bright at 출발] 홀로 남은 빨간 자동차는 {B:이를/를} 찾기로 했어요. 용기 있게 출발!",
    "orig": {},
    "url": "audio/el/red_car/nar_06770f4103.mp3",
    "chars": 86
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
    "send": "[warm, building courage, slow then bright at 출발] The little red car, all alone, decided to go and find {B_en}. Off it went, brave and bold!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_cba73b0775.mp3",
    "chars": 140
   }
  },
  {
   "id": "k9e8e4806",
   "key": "부릉부릉! 이현이를 찾아 장난감 세상으로 가자!",
   "keyEn": "부릉부릉! 이현이를 찾아 장난감 세상으로 가자!",
   "mode": "both",
   "tpl": "부릉부릉! {B:이를/를} 찾아 장난감 세상으로 가자!",
   "en": "Vroom vroom! Let's go to Toy Land and find Ihyun!",
   "tplEn": "Vroom vroom! Let's go to Toy Land and find {B_en}!",
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
    "send": "[small brave voice, cheerful, determined, clear] 부릉부릉! {B:이를/를} 찾아 장난감 세상으로 가자!",
    "orig": {},
    "url": "audio/el/red_car/red_b13fdd6993.mp3",
    "chars": 75
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
    "send": "[small brave voice, cheerful, determined, clear] Vroom vroom! Let's go to Toy Land and find {B_en}!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/red_b30198d051.mp3",
    "chars": 100
   }
  },
  {
   "id": "k3bb27b13",
   "key": "어? 너는 이현이가 잃어버렸던 경찰차 형아?!",
   "keyEn": "어? 너는 이현이가 잃어버렸던 경찰차 형아?!",
   "mode": "both",
   "tpl": "어? 너는 {B:이가/가} 잃어버렸던 경찰차 형아?!",
   "en": "Huh? You're the police car Ihyun lost! Big brother police car!",
   "tplEn": "Huh? You're the police car {B_en} lost! Big brother police car!",
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
    "send": "[small voice, surprised, delighted] 어? 너는 {B:이가/가} 잃어버렸던 경찰차 형아?!",
    "orig": {},
    "url": "audio/el/red_car/red_b0d399920b.mp3",
    "chars": 61
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
    "send": "[small voice, surprised, delighted] Huh? You're the police car {B_en} lost! Big brother police car!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/red_02587094a1.mp3",
    "chars": 100
   }
  },
  {
   "id": "ka2f78f43",
   "key": "우리 같이 이현이한테 가자!",
   "keyEn": "우리 같이 이현이한테 가자!",
   "mode": "both",
   "tpl": "우리 같이 {B:이한테/한테} 가자!",
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
    "send": "[small voice, eager, inviting] 우리 같이 {B:이한테/한테} 가자!",
    "orig": {},
    "url": "audio/el/red_car/red_4bd4521335.mp3",
    "chars": 46
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
    "send": "[small voice, eager, inviting] Let's go find {B_en} together!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/red_1d638a4c56.mp3",
    "chars": 62
   }
  },
  {
   "id": "kffca6c68",
   "key": "어? 소방차 이모! 우리 같이 이현이 만나러 가요!",
   "keyEn": "어? 소방차 이모! 우리 같이 이현이 만나러 가요!",
   "mode": "both",
   "tpl": "어? 소방차 이모! 우리 같이 {B:이/} 만나러 가요!",
   "en": "Oh? Auntie fire truck! Come with us to find Ihyun!",
   "tplEn": "Oh? Auntie fire truck! Come with us to find {B_en}!",
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
    "send": "[small voice, excited, polite] 어? 소방차 이모! 우리 같이 {B:이/} 만나러 가요!",
    "orig": {},
    "url": "audio/el/red_car/red_728de443ce.mp3",
    "chars": 59
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
    "send": "[small voice, excited, polite] Oh? Auntie fire truck! Come with us to find {B_en}!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/red_9b1b26d50a.mp3",
    "chars": 83
   }
  },
  {
   "id": "k98144e91",
   "key": "구급차 삼촌! 우리랑 같이 이현이한테 가요!",
   "keyEn": "구급차 삼촌! 우리랑 같이 이현이한테 가요!",
   "mode": "both",
   "tpl": "구급차 삼촌! 우리랑 같이 {B:이한테/한테} 가요!",
   "en": "Uncle ambulance! Come with us to find Ihyun!",
   "tplEn": "Uncle ambulance! Come with us to find {B_en}!",
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
    "send": "[small voice, eager, polite] 구급차 삼촌! 우리랑 같이 {B:이한테/한테} 가요!",
    "orig": {},
    "url": "audio/el/red_car/red_1bf416cd0e.mp3",
    "chars": 53
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
    "send": "[small voice, eager, polite] Uncle ambulance! Come with us to find {B_en}!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/red_e68e78eec3.mp3",
    "chars": 75
   }
  },
  {
   "id": "ka8caa4ad",
   "key": "오냐오냐, 아픈 친구들을 다 데려다주었으니 이제 이현이에게 가자!",
   "keyEn": "오냐오냐, 아픈 친구들을 다 데려다주었으니 이제 이현이에게 가자!",
   "mode": "both",
   "tpl": "오냐오냐, 아픈 친구들을 다 데려다주었으니 이제 {B:이에게/에게} 가자!",
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
    "send": "[kind uncle voice, deep, reassuring, unhurried] 오냐오냐, 아픈 친구들을 다 데려다주었으니 이제 {B:이에게/에게} 가자!",
    "orig": {},
    "url": "audio/el/red_car/amb_9096f4e6f7.mp3",
    "chars": 84
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
    "send": "[kind uncle voice, deep, reassuring, unhurried] All right, all right! I've brought the sick friends to the hospital, so now let's go to {B_en}!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/amb_79edf458a3.mp3",
    "chars": 144
   }
  },
  {
   "id": "ke956173e",
   "key": "자, 다 같이 이현이한테 가자!",
   "keyEn": "자, 다 같이 이현이한테 가자!",
   "mode": "both",
   "tpl": "자, 다 같이 {B:이한테/한테} 가자!",
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
    "send": "[small voice, leading, cheerful] 자, 다 같이 {B:이한테/한테} 가자!",
    "orig": {},
    "url": "audio/el/red_car/red_4a3cb9b677.mp3",
    "chars": 50
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
    "send": "[small voice, leading, cheerful] Come on, everyone, let's go to {B_en}!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/red_17543c977a.mp3",
    "chars": 72
   }
  },
  {
   "id": "k6bdd5b58",
   "key": "바로 이현이가 전에 잃어버렸던 주황색 견인차였어요!",
   "keyEn": "바로 이현이가 전에 잃어버렸던 주황색 견인차였어요!",
   "mode": "both",
   "tpl": "바로 {B:이가/가} 전에 잃어버렸던 주황색 견인차였어요!",
   "en": "It was the orange tow truck Ihyun had lost long ago!",
   "tplEn": "It was the orange tow truck {B_en} had lost long ago!",
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
    "send": "[bright, glad reveal] 바로 {B:이가/가} 전에 잃어버렸던 주황색 견인차였어요!",
    "orig": {},
    "url": "audio/el/red_car/nar_b509d6735e.mp3",
    "chars": 50
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
    "send": "[bright, glad reveal] It was the orange tow truck {B_en} had lost long ago!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_c17b8cb974.mp3",
    "chars": 76
   }
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
    "send": "[bright, relieved, joyful] 마침내 놀이터에 있는 {B:이를/를} 만났어요!",
    "orig": {},
    "url": "audio/el/red_car/nar_76391a78a6.mp3",
    "chars": 49
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
    "send": "[bright, relieved, joyful] At last, they found {B_en} at the playground!",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_d1fe4064aa.mp3",
    "chars": 73
   }
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
    "send": "[warm, joyful, storybook ending tone] {B:이는/는} 소중한 보물 자동차들을 모두 품에 안고 펄쩍펄쩍 기뻐했답니다.",
    "orig": {},
    "url": "audio/el/red_car/nar_108e78ef55.mp3",
    "chars": 77
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
    "send": "[warm, joyful, storybook ending tone] {B_en} hugged all the precious toy cars and jumped for joy.",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_29fc505a43.mp3",
    "chars": 98
   }
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
    "send": "[calm, warm storytelling, slow, unhurried, sleepy, soft] {B:이는/는} 빨간 자동차를 손에 꼭 쥐고 쌔근쌔근 잠들었어요.",
    "orig": {},
    "url": "audio/el/red_car/nar_b9e498de2c.mp3",
    "chars": 89
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
    "send": "[calm, warm storytelling, slow, unhurried, sleepy, soft] {B_en} held the red car tight and fell fast asleep.",
    "orig": {
     "B_en": "Ee-hyun"
    },
    "url": "audio/el/red_car/en/nar_9cdaa4340b.mp3",
    "chars": 109
   }
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
    "send": "[calm, warm, gentle storytelling] {B:이의/의} 방에 작은 빨간 장난감 자동차가 있었어요.",
    "orig": {},
    "url": "audio/el/red_car/nar_6e19e5be33.mp3",
    "chars": 62
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
    "send": "[calm, warm, gentle storytelling] In {B_en}'s room, there was a little red toy car.",
    "orig": {},
    "url": "audio/el/red_car/en/nar_21167bc27c.mp3",
    "chars": 82
   }
  },
  {
   "id": "r30cf92bf",
   "key": "부릉부릉! 이현이는 날마다 자동차를 씽씽 굴리며 놀았어요.",
   "keyEn": "부릉부릉! 이현이는 날마다 자동차를 씽씽 굴리며 놀았어요.",
   "mode": "read",
   "tpl": "부릉부릉! {B:이는/는} 날마다 자동차를 씽씽 굴리며 놀았어요.",
   "en": "Vroom, vroom! Every day Ihyun played with the car, zooming it all around.",
   "tplEn": "Vroom, vroom! Every day {B_en} played with the car, zooming it all around.",
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
    "send": "[calm, warm storytelling, slow, unhurried] 부릉부릉! {B:이는/는} 날마다 자동차를 씽씽 굴리며 놀았어요.",
    "orig": {},
    "url": "audio/el/red_car/nar_2199e3bc94.mp3",
    "chars": 75
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
    "send": "[calm, warm storytelling, slow, unhurried] Vroom, vroom! Every day {B_en} played with the car, zooming it all around.",
    "orig": {},
    "url": "audio/el/red_car/en/nar_d151500ce3.mp3",
    "chars": 116
   }
  },
  {
   "id": "r04d40fa7",
   "key": "이현이는 빨간 자동차를 손에 들고 나비를 보았어요.",
   "keyEn": "이현이는 빨간 자동차를 손에 들고 나비를 보았어요.",
   "mode": "read",
   "tpl": "{B:이는/는} 빨간 자동차를 손에 들고 나비를 보았어요.",
   "en": "Ihyun held the red car in his hand and saw a butterfly. Look!",
   "tplEn": "{B_en} held the red car in his hand and saw a butterfly. Look!",
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
    "send": "[calm, warm, gentle storytelling] {B:이는/는} 빨간 자동차를 손에 들고 나비를 보았어요.",
    "orig": {},
    "url": "audio/el/red_car/nar_6f8747143c.mp3",
    "chars": 62
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
    "send": "[calm, warm, gentle storytelling] {B_en} held the red car in his hand and saw a butterfly. Look!",
    "orig": {},
    "url": "audio/el/red_car/en/nar_80fc4a3f4e.mp3",
    "chars": 95
   }
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
    "send": "[calm, warm storytelling, slow, unhurried] 나비가 팔랑팔랑 날아가자, {B:이는/는} 폴짝폴짝 따라갔어요.",
    "orig": {},
    "url": "audio/el/red_car/nar_69031c8560.mp3",
    "chars": 74
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
    "send": "[calm, warm storytelling, slow, unhurried] The butterfly fluttered away, flutter, flutter, and {B_en} went hopping after it, hop, hop.",
    "orig": {},
    "url": "audio/el/red_car/en/nar_b4e463098c.mp3",
    "chars": 133
   }
  },
  {
   "id": "ra72567eb",
   "key": "이현이는 자동차를 찾으며 눈물을 뚝뚝 흘렸어요.",
   "keyEn": "이현이는 자동차를 찾으며 눈물을 뚝뚝 흘렸어요.",
   "mode": "read",
   "tpl": "{B:이는/는} 자동차를 찾으며 눈물을 뚝뚝 흘렸어요.",
   "en": "Ihyun looked and looked for his car, and his tears fell, drip, drop.",
   "tplEn": "{B_en} looked and looked for his car, and his tears fell, drip, drop.",
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
    "send": "[calm, warm, gentle storytelling] {B:이는/는} 자동차를 찾으며 눈물을 뚝뚝 흘렸어요.",
    "orig": {},
    "url": "audio/el/red_car/nar_326cd06513.mp3",
    "chars": 60
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
    "send": "[calm, warm, gentle storytelling] {B_en} looked and looked for his car, and his tears fell, drip, drop.",
    "orig": {},
    "url": "audio/el/red_car/en/nar_a1727a8ebe.mp3",
    "chars": 102
   }
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
    "send": "[calm, warm, gentle storytelling] {B:이가/가} 떠난 자리에 빨간 자동차만 혼자 남았어요.",
    "orig": {},
    "url": "audio/el/red_car/nar_6d74554591.mp3",
    "chars": 62
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
    "send": "[calm, warm, gentle storytelling] {B_en} went away, and the red car was left all alone on the grass.",
    "orig": {},
    "url": "audio/el/red_car/en/nar_32ed6782b8.mp3",
    "chars": 99
   }
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
    "send": "[calm, warm storytelling, slow, unhurried] 언덕 위에 {A:이가/가} 서 있어요. 하늘을 올려다보고 있어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_0f24f50370.mp3",
    "chars": 75
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
    "send": "[calm, warm storytelling, slow, unhurried] On a hill stands {A_en}, looking up at the sky.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_4cf8bbc119.mp3",
    "chars": 90
   }
  },
  {
   "id": "k0c3dfe62",
   "key": "다현이는 바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
   "keyEn": "다현이는 바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
   "en": "Dahyun gently picked up a flower the wind had dropped and popped it into her basket.",
   "tplEn": "{A_en} gently picked up a flower the wind had dropped and popped it into her basket.",
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
    "send": "[warm, playful, light, storybook tone] {A:이는/는} 바람에 떨어진 꽃 한 송이를 살며시 주워 바구니에 쏙 넣었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_f4c43b3efa.mp3",
    "chars": 79
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
    "send": "[warm, playful, light, storybook tone] {A_en} gently picked up a flower the wind had dropped and popped it into her basket.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_460bb92e32.mp3",
    "chars": 123
   }
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
    "send": "[hopeful, brightening, slow] {A:이는/는} 구름 나라로 올라가 보기로 했어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_243e196c27.mp3",
    "chars": 53
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
    "send": "[hopeful, brightening, slow] {A_en} decided to climb up to the cloud country.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_6bd104d5cb.mp3",
    "chars": 77
   }
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
    "send": "[warm, steady, walking rhythm, slow] {A:이와/와} 양은 손을 잡고 구름 길을 걸었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_ce56d33304.mp3",
    "chars": 62
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
    "send": "[warm, steady, walking rhythm, slow] {A_en} and the sheep walked the cloud path hand in hand.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_0bc0eecf28.mp3",
    "chars": 93
   }
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
    "send": "[hushed, calm, a little mysterious, slow] 밤이 되자, {A:이는/는} 별빛 숲으로 들어갔어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_57912fdb82.mp3",
    "chars": 67
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
    "send": "[hushed, calm, a little mysterious, slow] When night came, {A_en} walked into the starlight forest.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_5b107dfeba.mp3",
    "chars": 99
   }
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
    "send": "[soft, slow, a thoughtful pause] {A:이는/는} 사슴의 작은 뿔을 가만히 보았어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_b0c15a0607.mp3",
    "chars": 57
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
    "send": "[soft, slow, a thoughtful pause] {A_en} looked quietly at the deer's little antlers.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_b6525af233.mp3",
    "chars": 84
   }
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
    "send": "[gentle, a little playful, slow] 말은 {A:이의/의} 간식 바구니를 보고 있어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_6b047bb683.mp3",
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
    "send": "[gentle, a little playful, slow] The horse was looking at {A_en}'s snack basket.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_5b6a16052a.mp3",
    "chars": 80
   }
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
    "send": "[slow, soft, trudging rhythm] {A:이는/는} 땅만 보며 터벅터벅 걸었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_b336ee1f59.mp3",
    "chars": 51
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
    "send": "[slow, soft, trudging rhythm] {A_en} trudged along, looking only at the ground.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_812765a19f.mp3",
    "chars": 79
   }
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
    "send": "[soft, hushed, playful suspense, a question to the listener] {A:이/} 뒤에 누가 왔을까요?",
    "orig": {},
    "url": "audio/el/unicorn/nar_0b0fd9b991.mp3",
    "chars": 76
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
    "send": "[soft, hushed, playful suspense, a question to the listener] Who came up behind {A_en}?",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_8aea402ab6.mp3",
    "chars": 87
   }
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
    "send": "[warm, joyful, storybook ending tone, slow] {A:이는/는} 유니콘을 꼭 안았어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_812353b733.mp3",
    "chars": 61
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
    "send": "[warm, joyful, storybook ending tone, slow] {A_en} hugged the unicorn tight.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_042efac988.mp3",
    "chars": 76
   }
  },
  {
   "id": "k0d228986",
   "key": "다음 날 아침, 다현이는 유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
   "keyEn": "다음 날 아침, 다현이는 유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
   "mode": "both",
   "tpl": "다음 날 아침, {A:이는/는} 유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
   "en": "The next morning, Dahyun came back to the hill by her home with the unicorn.",
   "tplEn": "The next morning, {A_en} came back to the hill by her home with the unicorn.",
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
    "send": "[warm, calm, gentle storybook ending tone, slow] 다음 날 아침, {A:이는/는} 유니콘과 함께 집 앞 언덕으로 돌아왔어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_3a05f82ba3.mp3",
    "chars": 86
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
    "send": "[warm, calm, gentle storybook ending tone, slow] The next morning, {A_en} came back to the hill by her home with the unicorn.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_ff0d8ed59c.mp3",
    "chars": 125
   }
  },
  {
   "id": "k90854856",
   "key": "다현이는 바구니 속 빨간 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 빨간 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 바구니 속 빨간 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the red flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the red flower from her basket into the unicorn's mane.",
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
    "send": "[warm, tender, joyful, slow] {A:이는/는} 바구니 속 빨간 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_47ba578853.mp3",
    "chars": 66
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
    "send": "[warm, tender, joyful, slow] {A_en} gently tucked the red flower from her basket into the unicorn's mane.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_0a5fc08422.mp3",
    "chars": 105
   }
  },
  {
   "id": "pc278f7f4",
   "key": "다현이는 바구니 속 주황 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 주황 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 주황 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the orange flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the orange flower from her basket into the unicorn's mane.",
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
    "send": "[warm, tender, joyful, slow] {A:이는/는} 바구니 속 주황 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_b9ac46592a.mp3",
    "chars": 66
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
    "send": "[warm, tender, joyful, slow] {A_en} gently tucked the orange flower from her basket into the unicorn's mane.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_f6ceda9f5b.mp3",
    "chars": 108
   }
  },
  {
   "id": "p06c9de60",
   "key": "다현이는 바구니 속 노란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 노란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 노란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the yellow flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the yellow flower from her basket into the unicorn's mane.",
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
    "send": "[warm, tender, joyful, slow] {A:이는/는} 바구니 속 노란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_0435b4e753.mp3",
    "chars": 66
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
    "send": "[warm, tender, joyful, slow] {A_en} gently tucked the yellow flower from her basket into the unicorn's mane.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_a7d8d01aaa.mp3",
    "chars": 108
   }
  },
  {
   "id": "pcfabae92",
   "key": "다현이는 바구니 속 분홍 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 분홍 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 분홍 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the pink flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the pink flower from her basket into the unicorn's mane.",
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
    "send": "[warm, tender, joyful, slow] {A:이는/는} 바구니 속 분홍 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_08df03772d.mp3",
    "chars": 66
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
    "send": "[warm, tender, joyful, slow] {A_en} gently tucked the pink flower from her basket into the unicorn's mane.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_f89b66680d.mp3",
    "chars": 106
   }
  },
  {
   "id": "p65557bd5",
   "key": "다현이는 바구니 속 보라 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 보라 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 보라 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the purple flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the purple flower from her basket into the unicorn's mane.",
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
    "send": "[warm, tender, joyful, slow] {A:이는/는} 바구니 속 보라 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_affbff0544.mp3",
    "chars": 66
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
    "send": "[warm, tender, joyful, slow] {A_en} gently tucked the purple flower from her basket into the unicorn's mane.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_846df812bb.mp3",
    "chars": 108
   }
  },
  {
   "id": "p37768c41",
   "key": "다현이는 바구니 속 파란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 파란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 파란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the blue flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the blue flower from her basket into the unicorn's mane.",
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
    "send": "[warm, tender, joyful, slow] {A:이는/는} 바구니 속 파란 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_e5ce328538.mp3",
    "chars": 66
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
    "send": "[warm, tender, joyful, slow] {A_en} gently tucked the blue flower from her basket into the unicorn's mane.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_117739689a.mp3",
    "chars": 106
   }
  },
  {
   "id": "p4ffa7f71",
   "key": "다현이는 바구니 속 하얀 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "keyEn": "다현이는 바구니 속 하얀 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "mode": "play",
   "tpl": "{A:이는/는} 바구니 속 하얀 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
   "en": "Dahyun gently tucked the white flower from her basket into the unicorn's mane.",
   "tplEn": "{A_en} gently tucked the white flower from her basket into the unicorn's mane.",
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
    "send": "[warm, tender, joyful, slow] {A:이는/는} 바구니 속 하얀 꽃을 유니콘 갈기에 살며시 꽂아 주었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_8f57bde930.mp3",
    "chars": 66
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
    "send": "[warm, tender, joyful, slow] {A_en} gently tucked the white flower from her basket into the unicorn's mane.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_2e441e8afe.mp3",
    "chars": 107
   }
  },
  {
   "id": "ka32c8b90",
   "key": "그날 밤, 다현이는 포근한 이불 속에 누웠어요.",
   "keyEn": "그날 밤, 다현이는 포근한 이불 속에 누웠어요.",
   "mode": "both",
   "tpl": "그날 밤, {A:이는/는} 포근한 이불 속에 누웠어요.",
   "en": "That night, Dahyun lay down under her cozy blanket.",
   "tplEn": "That night, {A_en} lay down under her cozy blanket.",
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
    "send": "[calm, warm storytelling, slow, unhurried, sleepy, soft] 그날 밤, {A:이는/는} 포근한 이불 속에 누웠어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_0240d1d909.mp3",
    "chars": 83
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
    "send": "[calm, warm storytelling, slow, unhurried, sleepy, soft] That night, {A_en} lay down under her cozy blanket.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_2217a15a7c.mp3",
    "chars": 108
   }
  },
  {
   "id": "kd4768a58",
   "key": "다현이는 친절한 마음을 꼭 안고 스르르 잠이 들었어요.",
   "keyEn": "다현이는 친절한 마음을 꼭 안고 스르르 잠이 들었어요.",
   "mode": "both",
   "tpl": "{A:이는/는} 친절한 마음을 꼭 안고 스르르 잠이 들었어요.",
   "en": "Holding her kind heart close, Dahyun drifted off to sleep.",
   "tplEn": "Holding her kind heart close, {A_en} drifted off to sleep.",
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
    "send": "[calm, warm storytelling, slow, unhurried, sleepy, soft] {A:이는/는} 친절한 마음을 꼭 안고 스르르 잠이 들었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_7869859c03.mp3",
    "chars": 87
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
    "send": "[calm, warm storytelling, slow, unhurried, sleepy, soft] Holding her kind heart close, {A_en} drifted off to sleep.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_213896438f.mp3",
    "chars": 115
   }
  },
  {
   "id": "r6b7d6c1e",
   "key": "다현이가 혼잣말을 했어요.",
   "keyEn": "다현이가 혼잣말을 했어요.",
   "mode": "read",
   "tpl": "{A:이가/가} 혼잣말을 했어요.",
   "en": "Dahyun said to herself.",
   "tplEn": "{A_en} said to herself.",
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
    "send": "[calm, warm storytelling] {A:이가/가} 혼잣말을 했어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_3e734da6ac.mp3",
    "chars": 40
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
    "send": "[calm, warm storytelling] {A_en} said to herself.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_817b81df5b.mp3",
    "chars": 49
   }
  },
  {
   "id": "r99d7a7f0",
   "key": "다현이는 간식 바구니를 들고 사뿐사뿐 언덕을 올라갔어요.",
   "keyEn": "다현이는 간식 바구니를 들고 사뿐사뿐 언덕을 올라갔어요.",
   "mode": "read",
   "tpl": "{A:이는/는} 간식 바구니를 들고 사뿐사뿐 언덕을 올라갔어요.",
   "en": "Dahyun picked up her snack basket and tiptoed lightly, step, step, up the hill.",
   "tplEn": "{A_en} picked up her snack basket and tiptoed lightly, step, step, up the hill.",
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
    "send": "[calm, warm storytelling, slow, unhurried] {A:이는/는} 간식 바구니를 들고 사뿐사뿐 언덕을 올라갔어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_c6f15d2a1d.mp3",
    "chars": 74
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
    "send": "[calm, warm storytelling, slow, unhurried] {A_en} picked up her snack basket and tiptoed lightly, step, step, up the hill.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_c62876a0ec.mp3",
    "chars": 122
   }
  },
  {
   "id": "r5b7a1cfd",
   "key": "언덕을 오른 다현이가 구름 나라에 다다랐어요.",
   "keyEn": "언덕을 오른 다현이가 구름 나라에 다다랐어요.",
   "mode": "read",
   "tpl": "언덕을 오른 {A:이가/가} 구름 나라에 다다랐어요.",
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
    "send": "[calm, warm storytelling] 언덕을 오른 {A:이가/가} 구름 나라에 다다랐어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_cf92a9a2c7.mp3",
    "chars": 51
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
    "send": "[calm, warm storytelling] {A_en} climbed the hill and reached cloudland.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_70e0172e35.mp3",
    "chars": 72
   }
  },
  {
   "id": "rbc6e78d6",
   "key": "다현이가 양 아래에서 두 팔을 벌렸어요.",
   "keyEn": "다현이가 양 아래에서 두 팔을 벌렸어요.",
   "mode": "read",
   "tpl": "{A:이가/가} 양 아래에서 두 팔을 벌렸어요.",
   "en": "Dahyun opened her arms below the sheep.",
   "tplEn": "{A_en} opened her arms below the sheep.",
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
    "send": "[calm, warm storytelling] {A:이가/가} 양 아래에서 두 팔을 벌렸어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_ff507ffc7d.mp3",
    "chars": 48
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
    "send": "[calm, warm storytelling] {A_en} opened her arms below the sheep.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_8a73b90725.mp3",
    "chars": 65
   }
  },
  {
   "id": "r32812145",
   "key": "양은 폭신폭신 구름을 미끄러져 다현이 품에 폭, 안겼어요.",
   "keyEn": "양은 폭신폭신 구름을 미끄러져 다현이 품에 폭, 안겼어요.",
   "mode": "read",
   "tpl": "양은 폭신폭신 구름을 미끄러져 {A:이/} 품에 폭, 안겼어요.",
   "en": "The sheep slid down the soft, fluffy cloud and landed, plop, right in Dahyun's arms.",
   "tplEn": "The sheep slid down the soft, fluffy cloud and landed, plop, right in {A_en}'s arms.",
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
    "send": "[calm, warm storytelling, slow, unhurried] 양은 폭신폭신 구름을 미끄러져 {A:이/} 품에 폭, 안겼어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_4d84bb4434.mp3",
    "chars": 75
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
    "send": "[calm, warm storytelling, slow, unhurried] The sheep slid down the soft, fluffy cloud and landed, plop, right in {A_en}'s arms.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_21bf3538d1.mp3",
    "chars": 127
   }
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
    "send": "[calm, warm storytelling] {A:이는/는} 숲속에서 아픈 사슴을 만났어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_aacf97df0c.mp3",
    "chars": 48
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
    "send": "[calm, warm storytelling] In the forest, {A_en} met a deer who was hurt.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_b7d17e0be8.mp3",
    "chars": 72
   }
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
    "send": "[calm, warm storytelling, slow, unhurried] {A:이는/는} 살살, 조심조심 가시를 하나씩 뽑았어요. 쏙, 쏙, 쏙!",
    "orig": {},
    "url": "audio/el/unicorn/nar_2649674248.mp3",
    "chars": 79
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
    "send": "[calm, warm storytelling, slow, unhurried] Gently, ever so carefully, {A_en} pulled out the thorns one by one. Pop, pop, pop!",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_a35bf3912c.mp3",
    "chars": 125
   }
  },
  {
   "id": "r3bb067f7",
   "key": "가시를 뺀 뒤에도 다현이는 숲에서 사슴 곁에 있었어요.",
   "keyEn": "가시를 뺀 뒤에도 다현이는 숲에서 사슴 곁에 있었어요.",
   "mode": "read",
   "tpl": "가시를 뺀 뒤에도 {A:이는/는} 숲에서 사슴 곁에 있었어요.",
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
    "send": "[calm, warm storytelling] 가시를 뺀 뒤에도 {A:이는/는} 숲에서 사슴 곁에 있었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_69a7c0b401.mp3",
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
    "send": "[calm, warm storytelling] After pulling out the thorns, {A_en} stayed beside the deer in the forest.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_38bfb02831.mp3",
    "chars": 100
   }
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
    "send": "[calm, warm storytelling, slow, unhurried] Whoosh, splash! {A_en} heard the sound of a great big waterfall.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_bef7abeef3.mp3",
    "chars": 107
   }
  },
  {
   "id": "r525e4764",
   "key": "숲을 떠난 다현이는 폭포 앞에 다다랐어요.",
   "keyEn": "숲을 떠난 다현이는 폭포 앞에 다다랐어요.",
   "mode": "read",
   "tpl": "숲을 떠난 {A:이는/는} 폭포 앞에 다다랐어요.",
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
    "send": "[calm, warm storytelling] 숲을 떠난 {A:이는/는} 폭포 앞에 다다랐어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_85bd3be68c.mp3",
    "chars": 49
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
    "send": "[calm, warm storytelling] {A_en} left the forest and reached the waterfall.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_99afabf39a.mp3",
    "chars": 75
   }
  },
  {
   "id": "r6fea637a",
   "key": "폭포 앞에서 다현이가 배고픈 말에게 말했어요.",
   "keyEn": "폭포 앞에서 다현이가 배고픈 말에게 말했어요.",
   "mode": "read",
   "tpl": "폭포 앞에서 {A:이가/가} 배고픈 말에게 말했어요.",
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
    "send": "[calm, warm storytelling] 폭포 앞에서 {A:이가/가} 배고픈 말에게 말했어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_d514762e98.mp3",
    "chars": 51
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
    "send": "[calm, warm storytelling] By the waterfall, {A_en} spoke to the hungry horse.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_68ab05a942.mp3",
    "chars": 77
   }
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
    "send": "[calm, warm storytelling, slow, unhurried] {A:이는/는} 바구니를 열어 간식을 반으로 똑 나누었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_8ef3ea277f.mp3",
    "chars": 72
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
    "send": "[calm, warm storytelling, slow, unhurried] {A_en} opened the basket and broke the snack, snap, right in half.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_b9f0799db7.mp3",
    "chars": 109
   }
  },
  {
   "id": "r3d9e7402",
   "key": "말과 헤어진 다현이가 혼자 길로 나왔어요.",
   "keyEn": "말과 헤어진 다현이가 혼자 길로 나왔어요.",
   "mode": "read",
   "tpl": "말과 헤어진 {A:이가/가} 혼자 길로 나왔어요.",
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
    "send": "[calm, warm storytelling] 말과 헤어진 {A:이가/가} 혼자 길로 나왔어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_11e0895fa9.mp3",
    "chars": 49
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
    "send": "[calm, warm storytelling] After saying goodbye to the horse, {A_en} came out onto the road alone.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_9054f6d563.mp3",
    "chars": 97
   }
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
    "send": "[calm, warm storytelling] {A:이는/는} 그 길을 계속 걷고 있었어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_fbcdd873f6.mp3",
    "chars": 47
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
    "send": "[calm, warm storytelling] {A_en} was still walking along the road.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_1c6123bcb7.mp3",
    "chars": 66
   }
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
    "send": "[calm, warm storytelling] 유니콘이 {A:이에게/에게} 다정하게 말했어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_4ca6dd141b.mp3",
    "chars": 47
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
    "send": "[calm, warm storytelling] The unicorn spoke gently to {A_en}.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_06374ad635.mp3",
    "chars": 61
   }
  },
  {
   "id": "rec9bd047",
   "key": "다현이의 눈이 반짝반짝 빛났어요. 가슴이 콩닥콩닥 뛰었지요.",
   "keyEn": "다현이의 눈이 반짝반짝 빛났어요. 가슴이 콩닥콩닥 뛰었지요.",
   "mode": "read",
   "tpl": "{A:이의/의} 눈이 반짝반짝 빛났어요. 가슴이 콩닥콩닥 뛰었지요.",
   "en": "Dahyun's eyes shone, sparkle, sparkle. Her heart went thump, thump, thump.",
   "tplEn": "{A_en}'s eyes shone, sparkle, sparkle. Her heart went thump, thump, thump.",
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
    "send": "[calm, warm storytelling, slow, unhurried] {A:이의/의} 눈이 반짝반짝 빛났어요. 가슴이 콩닥콩닥 뛰었지요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_ce04e13ae7.mp3",
    "chars": 76
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
    "send": "[calm, warm storytelling, slow, unhurried] {A_en}'s eyes shone, sparkle, sparkle. Her heart went thump, thump, thump.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_a09c36971d.mp3",
    "chars": 117
   }
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
    "send": "[calm, warm storytelling] 유니콘이 {A:이에게/에게} 고맙다고 말했어요.",
    "orig": {},
    "url": "audio/el/unicorn/nar_fb69fd349f.mp3",
    "chars": 47
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
    "send": "[calm, warm storytelling] The unicorn thanked {A_en}.",
    "orig": {},
    "url": "audio/el/unicorn/en/nar_6a9ebaa7f0.mp3",
    "chars": 53
   }
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
   "tplEn": "{A_en} and her friends scurried right into the candy shop.",
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
    "send": "[warm, playful storytelling, slow, clear, cosy Halloween night, never scary] {A:이랑/랑} 친구들은 사탕 가게로 쪼르르 들어갔어요.",
    "orig": {},
    "url": "audio/el/witch_candy/nar_f4066af88f.mp3",
    "chars": 104
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
    "send": "[warm, playful storytelling, slow, clear, cosy Halloween night, never scary] {A_en} and her friends scurried right into the candy shop.",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_550c001a02.mp3",
    "chars": 135
   }
  },
  {
   "id": "kf6cda826",
   "key": "다현이가 넣어 줘. 하나든 여러 개든 좋아.",
   "keyEn": "다현이가 넣어 줘. 하나든 여러 개든 좋아.",
   "mode": "both",
   "tpl": "{A:이가/가} 넣어 줘. 하나든 여러 개든 좋아.",
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
    "send": "[kind quirky witch, warm, giggly, a little silly, never scary] {A:이가/가} 넣어 줘. 하나든 여러 개든 좋아.",
    "orig": {},
    "url": "audio/el/witch_candy/witch_67ea3cbc9b.mp3",
    "chars": 87
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
    "send": "[kind quirky witch, warm, giggly, a little silly, never scary] {A_en}, you put them in. One or lots, it's all good.",
    "orig": {},
    "url": "audio/el/witch_candy/en/witch_0c45cd1a0c.mp3",
    "chars": 115
   }
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이가/가} 빨간 딸기가 됐어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_ced4433617.mp3",
    "chars": 71
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! {A_en} turned into a red strawberry!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_bd936aecbe.mp3",
    "chars": 94
   }
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이/} 발이 오리발이 됐어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_11b3ff8b5b.mp3",
    "chars": 71
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! {A_en}'s feet turned into duck feet!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_c590beeee7.mp3",
    "chars": 94
   }
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이한테/한테} 물고기 꼬리가 생겼어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_42be77b05d.mp3",
    "chars": 74
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! {A_en} grew a fish tail!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_bf1937dcfc.mp3",
    "chars": 82
   }
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이의/의} 볼이랑 배가 호박처럼 환해졌어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_dff1f028ec.mp3",
    "chars": 78
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! {A_en}'s cheeks and tummy glowed like a pumpkin!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_759159f0b4.mp3",
    "chars": 106
   }
  },
  {
   "id": "k1dc13ac1",
   "key": "뿅! 다현이 등에 박쥐 날개가 돋았어요!",
   "keyEn": "뿅! 다현이 등에 박쥐 날개가 돋았어요!",
   "mode": "both",
   "tpl": "뿅! {A:이/} 등에 박쥐 날개가 돋았어요!",
   "en": "Poof! Bat wings sprouted on Dahyun's back!",
   "tplEn": "Poof! Bat wings sprouted on {A_en}'s back!",
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이/} 등에 박쥐 날개가 돋았어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_bf47ef7763.mp3",
    "chars": 74
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! Bat wings sprouted on {A_en}'s back!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_f5a3f9bd29.mp3",
    "chars": 94
   }
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이/} 입에 초콜릿 수염이 났어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_6694b9376d.mp3",
    "chars": 74
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! {A_en} grew a chocolate moustache!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_70ee01461a.mp3",
    "chars": 92
   }
  },
  {
   "id": "kaff19f4d",
   "key": "깜깜한 길이 다현이 덕분에 환해졌어요.",
   "keyEn": "깜깜한 길이 다현이 덕분에 환해졌어요.",
   "mode": "both",
   "tpl": "깜깜한 길이 {A:이/} 덕분에 환해졌어요.",
   "en": "The dark street grew bright, all thanks to Dahyun.",
   "tplEn": "The dark street grew bright, all thanks to {A_en}.",
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
    "send": "[playful storytelling, rhythmic on the sound words, smiling] 깜깜한 길이 {A:이/} 덕분에 환해졌어요.",
    "orig": {},
    "url": "audio/el/witch_candy/nar_f8b54f0156.mp3",
    "chars": 82
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
    "send": "[playful storytelling, rhythmic on the sound words, smiling] The dark street grew bright, all thanks to {A_en}.",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_3829a53a63.mp3",
    "chars": 111
   }
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
    "send": "[warm, settling, a pop on 뿅, gentle] 뿅! {A:이는/는} 다시 원래대로 돌아왔어요.",
    "orig": {},
    "url": "audio/el/witch_candy/nar_5454bfedf2.mp3",
    "chars": 59
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
    "send": "[warm, settling, a pop on 뿅, gentle] Poof! {A_en} was back to normal.",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_ece78c5ebf.mp3",
    "chars": 69
   }
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
    "send": "[kind quirky witch, grateful, warm, smiling] {A:이/} 덕분에 사탕이 가득! 내년에도 같이 섞자.",
    "orig": {},
    "url": "audio/el/witch_candy/witch_210ab58401.mp3",
    "chars": 72
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
    "send": "[kind quirky witch, grateful, warm, smiling] Thanks to {A_en}, we have candy galore! Let's mix again next year.",
    "orig": {},
    "url": "audio/el/witch_candy/en/witch_0aadf8cec7.mp3",
    "chars": 111
   }
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이가/가} 동그란 연두 키위가 됐어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_03bebd4ca4.mp3",
    "chars": 75
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! {A_en} turned into a round lime-green kiwi!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_009fa039bc.mp3",
    "chars": 101
   }
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이한테/한테} 초록 악어 꼬리가 생겼어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_73ce34feef.mp3",
    "chars": 76
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! {A_en} grew a green crocodile tail!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_fc940a2f28.mp3",
    "chars": 93
   }
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] 뿅! {A:이가/가} 청록 개구리가 됐어요!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_ff4bc5736c.mp3",
    "chars": 72
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
    "send": "[bright, magical, excited storytelling, a pop on 뿅] Poof! {A_en} turned into a teal frog!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_3b5f99df21.mp3",
    "chars": 89
   }
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
    "send": "[warm, playful storytelling, slow, clear, cosy Halloween night, never scary] {A:이가/가} 장작에 불씨를 톡 올렸어요.",
    "orig": {},
    "url": "audio/el/witch_candy/nar_540eda6d3b.mp3",
    "chars": 97
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
    "send": "[warm, playful storytelling, slow, clear, cosy Halloween night, never scary] {A_en} popped a tiny spark onto the firewood.",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_e33596b800.mp3",
    "chars": 122
   }
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
    "send": "[playful storytelling, comic on the sound words, clear] {A:이는/는} 아기 용 콧물이랑 빨간 소방차를 솥에 넣었어요. 뚝, 삐뽀삐뽀!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_664a445682.mp3",
    "chars": 96
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
    "send": "[playful storytelling, comic on the sound words, clear] {A_en} dropped baby dragon snot and the red fire truck into the cauldron. Drip, nee-naw nee-naw!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_a2022d59bf.mp3",
    "chars": 152
   }
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
    "send": "[playful storytelling, comic on the sound words, clear] {A:이는/는} 병아리 방귀랑 고무 오리를 솥에 넣었어요. 뿡, 꽥!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_b8218a01b4.mp3",
    "chars": 90
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
    "send": "[playful storytelling, comic on the sound words, clear] {A_en} dropped the chick toots and the rubber duck into the cauldron. Toot, quack!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_3dd6044755.mp3",
    "chars": 138
   }
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
    "send": "[playful storytelling, comic on the sound words, clear] {A:이는/는} 괴물 응가랑 파란 생선을 솥에 넣었어요. 퐁, 첨벙!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_633b225971.mp3",
    "chars": 90
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
    "send": "[playful storytelling, comic on the sound words, clear] {A_en} dropped the monster poo and the blue fish into the cauldron. Plop, splash!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_a60dd53a13.mp3",
    "chars": 137
   }
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
    "send": "[playful storytelling, comic on the sound words, clear] {A:이는/는} 초록 개구리랑 파란 파도를 솥에 넣었어요. 개굴, 철썩!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_c648bf7248.mp3",
    "chars": 92
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
    "send": "[playful storytelling, comic on the sound words, clear] {A_en} dropped the green frog and the blue wave into the cauldron. Ribbit, splosh!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_88cce59910.mp3",
    "chars": 138
   }
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
    "send": "[playful storytelling, comic on the sound words, clear] {A:이는/는} 아기 용 콧물이랑 노란 호박 등을 솥에 넣었어요. 뚝, 퐁!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_88ba8b3ebf.mp3",
    "chars": 94
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
    "send": "[playful storytelling, comic on the sound words, clear] {A_en} dropped baby dragon snot and the yellow pumpkin lantern into the cauldron. Drip, plop!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_ebf7bf02cb.mp3",
    "chars": 149
   }
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
    "send": "[playful storytelling, comic on the sound words, clear] {A:이는/는} 무당벌레랑 파란 생선을 솥에 넣었어요. 붕, 첨벙!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_5c9de0cd98.mp3",
    "chars": 89
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
    "send": "[playful storytelling, comic on the sound words, clear] {A_en} dropped the ladybug and the blue fish into the cauldron. Bzzz, splash!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_b12bc81ced.mp3",
    "chars": 133
   }
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
    "send": "[playful storytelling, comic on the sound words, clear] {A:이는/는} 빨간 소방차랑 초록 공룡을 솥에 넣었어요. 삐뽀삐뽀, 크앙!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_375bf17de7.mp3",
    "chars": 94
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
    "send": "[playful storytelling, comic on the sound words, clear] {A_en} dropped the red fire truck and the green dinosaur into the cauldron. Nee-naw nee-naw, rawr!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_a473bbf350.mp3",
    "chars": 154
   }
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
    "send": "[playful storytelling, two funny sound words] {A:이는/는} 병아리 방귀랑 구운 초록 대파를 솥에 넣었어요. 뿡, 지글지글!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_99cc0d869b.mp3",
    "chars": 86
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
    "send": "[playful storytelling, two funny sound words] {A_en} dropped chick toots and the grilled green onion into the cauldron. Toot, sizzle!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_19552dab08.mp3",
    "chars": 133
   }
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
    "send": "[playful storytelling, two funny sound words] {A:이는/는} 초록 공룡이랑 구운 초록 대파를 솥에 넣었어요. 쿵, 지글지글!",
    "orig": {},
    "url": "audio/el/witch_candy/nar_c6bce70fd9.mp3",
    "chars": 86
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
    "send": "[playful storytelling, two funny sound words] {A_en} dropped the green dinosaur and the grilled green onion into the cauldron. Stomp, sizzle!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_ae127ea82d.mp3",
    "chars": 141
   }
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
    "send": "[playful storytelling, three bouncy plops] {A:이가/가} 하나씩, 하나씩, 퐁퐁퐁 넣었어요.",
    "orig": {},
    "url": "audio/el/witch_candy/nar_a20349ace7.mp3",
    "chars": 67
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
    "send": "[playful storytelling, three bouncy plops] {A_en} dropped them in one by one. Plop, plop, plop!",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_3166f3e34c.mp3",
    "chars": 95
   }
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
    "send": "[warm, joyful storybook ending tone] {A:이가/가} 사탕 마녀 손을 잡고 폴짝 뛰었어요.",
    "orig": {},
    "url": "audio/el/witch_candy/nar_46d89cfffe.mp3",
    "chars": 62
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
    "send": "[warm, joyful storybook ending tone] {A_en} took the Candy Witch's hand and hopped for joy.",
    "orig": {},
    "url": "audio/el/witch_candy/en/nar_a30ec5f445.mp3",
    "chars": 91
   }
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
    "send": "[cheerful, clear, warm] {A:이/}(꼬마 마법사)",
    "orig": {},
    "url": "audio/el/home/nar_5649ab8229.mp3",
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
    "send": "[cheerful, clear, warm] {A_en}, little wizard",
    "orig": {},
    "url": "audio/el/home/en/nar_157ea4f85c.mp3",
    "chars": 45
   }
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
    "send": "[cheerful, clear, warm] 딸기 {A:이/}",
    "orig": {},
    "url": "audio/el/home/nar_3bc36030c1.mp3",
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
    "send": "[cheerful, clear, warm] Strawberry {A_en}",
    "orig": {},
    "url": "audio/el/home/en/nar_0f5cacfd25.mp3",
    "chars": 41,
    "verified": false
   }
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
    "send": "[cheerful, clear, warm] 호박 {A:이/}",
    "orig": {},
    "url": "audio/el/home/nar_f32ece17fd.mp3",
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
    "send": "[cheerful, clear, warm] Pumpkin {A_en}",
    "orig": {},
    "url": "audio/el/home/en/nar_caaaf2d84d.mp3",
    "chars": 38
   }
  }
 ]
};
