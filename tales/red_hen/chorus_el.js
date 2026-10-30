/* red_hen — 배역별 합창 ElevenLabs판 (tales/red_hen/mix_chorus_el.py가 생성, 손으로 고치지 말 것).
   narration_el.js 뒤에 불러 합창 글자에 겹친 클립을 연결하고, 따로 녹음한 목소리(VOICE_LINES ch_*)는 미리 받지 않게 뺀다 */
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, {
 "난 싫어!": "audio/el/red_hen/chorus/ch_34139ee628.mp3",
 "샌드위치 완성!": "audio/el/red_hen/chorus/ch_187053d7ac.mp3",
 "피자 완성!": "audio/el/red_hen/chorus/ch_760a3ad4ad.mp3",
 "팬케이크 완성!": "audio/el/red_hen/chorus/ch_45a74dbe30.mp3",
 "잘 먹겠습니다!": "audio/el/red_hen/chorus/ch_8733d78551.mp3"
});
if (typeof VOICE_LINES !== "undefined") ["ch_C2", "ch_I_done_sandwich", "ch_I_done_pizza", "ch_I_done_pancake", "ch_J8"].forEach(k => { delete VOICE_LINES[k]; });
if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, {
 "난 싫어!": {
  "t": "Not I!",
  "c": "audio/el/red_hen/chorus/en/ch_2df506c8dc.mp3"
 },
 "샌드위치 완성!": {
  "t": "Our sandwich is ready!",
  "c": "audio/el/red_hen/chorus/en/ch_8b7a1e43d1.mp3"
 },
 "피자 완성!": {
  "t": "Our pizza is ready!",
  "c": "audio/el/red_hen/chorus/en/ch_f97ea4bd81.mp3"
 },
 "팬케이크 완성!": {
  "t": "Our pancakes are ready!",
  "c": "audio/el/red_hen/chorus/en/ch_3b3f95a378.mp3"
 },
 "잘 먹겠습니다!": {
  "t": "Let's eat!",
  "c": "audio/el/red_hen/chorus/en/ch_c7eda37516.mp3"
 }
});
if (typeof VOICE_LINES_EN !== "undefined") ["ch_C2", "ch_I_done_sandwich", "ch_I_done_pizza", "ch_I_done_pancake", "ch_J8"].forEach(k => { delete VOICE_LINES_EN[k]; });
