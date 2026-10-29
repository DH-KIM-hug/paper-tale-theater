/* witch_candy — 배역별 합창 ElevenLabs판 (tales/witch_candy/mix_chorus_el.py가 생성, 손으로 고치지 말 것).
   narration_el.js·chorus.js 뒤에 불러 EL 합창으로 덮어쓰고, 따로 녹음한 다섯 목소리는 미리 받지 않게 뺀다 */
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, {
 "오~~우~~": "audio/el/witch_candy/chorus/ch_61a5e99568.mp3",
 "해피 핼러윈! 오~우~!": "audio/el/witch_candy/chorus/ch_a90eae26d7.mp3",
 "우와!": "audio/el/witch_candy/chorus/ch_bf37ae4557.mp3",
 "뽀글뽀글!": "audio/el/witch_candy/chorus/ch_4d84ab3927.mp3",
 "나도!": "audio/el/witch_candy/chorus/ch_250c4d40e7.mp3",
 "나도 하고 싶다!": "audio/el/witch_candy/chorus/ch_5387fc5e91.mp3",
 "까맣다!": "audio/el/witch_candy/chorus/ch_7fe8b77ee8.mp3",
 "으웩!… 어? 맛있다!": "audio/el/witch_candy/chorus/ch_5397a6be75.mp3"
});
if (typeof VOICE_LINES !== "undefined") ["ghost_all", "happy_all", "ch_wow", "ch_bubble", "ch_metoo", "ch_wantto", "ch_black", "ch_yuckyum"].forEach(k => { delete VOICE_LINES[k]; });
if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, {
 "오~~우~~": {
  "t": "Oooh... oooh...",
  "c": "audio/el/witch_candy/chorus/en/ch_a7d98baa95.mp3"
 },
 "해피 핼러윈! 오~우~!": {
  "t": "Happy Halloween! Oooh!",
  "c": "audio/el/witch_candy/chorus/en/ch_2cc8dfd44f.mp3"
 },
 "우와!": {
  "t": "Wow!",
  "c": "audio/el/witch_candy/chorus/en/ch_ed1c3d71c1.mp3"
 },
 "뽀글뽀글!": {
  "t": "Bubble, bubble!",
  "c": "audio/el/witch_candy/chorus/en/ch_692b7c6cd8.mp3"
 },
 "나도!": {
  "t": "Me too!",
  "c": "audio/el/witch_candy/chorus/en/ch_c1290ba0da.mp3"
 },
 "나도 하고 싶다!": {
  "t": "I want to do it too!",
  "c": "audio/el/witch_candy/chorus/en/ch_4800cb532c.mp3"
 },
 "까맣다!": {
  "t": "It's black!",
  "c": "audio/el/witch_candy/chorus/en/ch_1efe0298ee.mp3"
 },
 "으웩!… 어? 맛있다!": {
  "t": "Eww!... Huh? It's yummy!",
  "c": "audio/el/witch_candy/chorus/en/ch_5fc239d405.mp3"
 }
});
if (typeof VOICE_LINES_EN !== "undefined") ["ghost_all", "happy_all", "ch_wow", "ch_bubble", "ch_metoo", "ch_wantto", "ch_black", "ch_yuckyum"].forEach(k => { delete VOICE_LINES_EN[k]; });
