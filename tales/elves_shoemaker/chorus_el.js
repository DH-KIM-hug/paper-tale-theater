/* elves_shoemaker — 배역별 합창 ElevenLabs판 (tales/elves_shoemaker/mix_chorus_el.py가 생성, 손으로 고치지 말 것).
   narration_el.js 뒤에 불러 합창 글자에 겹친 클립을 연결하고, 따로 녹음한 목소리(VOICE_LINES ch_*)는 미리 받지 않게 뺀다 */
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, {
 "우리는 멋쟁이, 반짝반짝 새 옷! 이제 구두는 안 만들래!": "audio/el/elves_shoemaker/chorus/ch_f4a7252246.mp3",
 "야호!": "audio/el/elves_shoemaker/chorus/ch_2722719bce.mp3"
});
if (typeof VOICE_LINES !== "undefined") ["ch_EE1", "ch_EE2"].forEach(k => { delete VOICE_LINES[k]; });
if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, {
 "우리는 멋쟁이, 반짝반짝 새 옷! 이제 구두는 안 만들래!": {
  "t": "Look at us, so smart and new! No more shoes for us to do!",
  "c": "audio/el/elves_shoemaker/chorus/en/ch_93fff30c9b.mp3"
 },
 "야호!": {
  "t": "Hooray!",
  "c": "audio/el/elves_shoemaker/chorus/en/ch_02b30ec7f0.mp3"
 }
});
if (typeof VOICE_LINES_EN !== "undefined") ["ch_EE1", "ch_EE2"].forEach(k => { delete VOICE_LINES_EN[k]; });
