/* red_car — 자리 B 주인공 모습 g 일 때의 영어 대명사 줄(he/she 두 벌 중 반대 벌) 녹음 맵 (tools/elevenlabs/gen_name_split.py 가 생성, 손으로 고치지 말 것).
   engine/names.js PRON_CLIPS 가 읽는다. play = 놀이 맵, read = 읽어 주기 맵에 덮는다. 이름 든 줄은 기본 이름 완성본(이름을 바꾸면 기기에서 다시 합친다) */
window.NARRATION_PRON_CLIPS = Object.assign(window.NARRATION_PRON_CLIPS || {}, { Bg: {
 "play": {},
 "read": {
  "방 안에는 파란 블록, 노란 오리, 그리고 반짝반짝 빨간 자동차가 있었지요.": {
   "t": "In her room were a blue block, a yellow duck, and a shiny, sparkly little red car.",
   "c": "audio/el/red_car/look/Bg/en/name/431f05cbd1.mp3",
   "o": "audio/el/red_car/en/nar_332916f959.mp3"
  },
  "이현이는 빨간 자동차를 손에 들고 나비를 보았어요.": {
   "t": "Ihyun held the red car in her hand and saw a butterfly. Look!",
   "c": "audio/el/red_car/look/Bg/en/name/f589ec337f.mp3",
   "o": "audio/el/red_car/en/name/b72a3f8cef.mp3"
  },
  "이현이는 자동차를 찾으며 눈물을 뚝뚝 흘렸어요.": {
   "t": "Ihyun looked and looked for her car, and her tears fell, drip, drop.",
   "c": "audio/el/red_car/look/Bg/en/name/08f3ec746d.mp3",
   "o": "audio/el/red_car/en/name/185472b2bf.mp3"
  }
 }
} });
