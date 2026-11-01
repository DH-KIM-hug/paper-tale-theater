/* red_hen — 배역별 합창 ElevenLabs판 (tales/red_hen/mix_chorus_el.py가 생성, 손으로 고치지 말 것).
   narration_el.js 뒤에 불러 합창 글자에 겹친 클립을 연결하고, 따로 녹음한 목소리(VOICE_LINES ch_*)는 미리 받지 않게 뺀다 */
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, {
 "난 싫어!": "audio/el/red_hen/chorus/ch_46a1a999fb.mp3",
 "샌드위치 완성!": "audio/el/red_hen/chorus/ch_aa41e87943.mp3",
 "피자 완성!": "audio/el/red_hen/chorus/ch_b29973725b.mp3",
 "팬케이크 완성!": "audio/el/red_hen/chorus/ch_3328b19c47.mp3",
 "잘 먹겠습니다!": "audio/el/red_hen/chorus/ch_1bda84de94.mp3"
});
if (typeof VOICE_LINES !== "undefined") ["ch_C2", "ch_I_done_sandwich", "ch_I_done_pizza", "ch_I_done_pancake", "ch_J8"].forEach(k => { delete VOICE_LINES[k]; });
if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, {
 "난 싫어!": {
  "t": "Not I!",
  "c": "audio/el/red_hen/chorus/en/ch_5c538e5c33.mp3"
 },
 "샌드위치 완성!": {
  "t": "Our sandwich is ready!",
  "c": "audio/el/red_hen/chorus/en/ch_9503501f33.mp3"
 },
 "피자 완성!": {
  "t": "Our pizza is ready!",
  "c": "audio/el/red_hen/chorus/en/ch_a14f3fadd6.mp3"
 },
 "팬케이크 완성!": {
  "t": "Our pancakes are ready!",
  "c": "audio/el/red_hen/chorus/en/ch_fc6c92267d.mp3"
 },
 "잘 먹겠습니다!": {
  "t": "Let's eat!",
  "c": "audio/el/red_hen/chorus/en/ch_9738a0e84a.mp3"
 }
});
if (typeof VOICE_LINES_EN !== "undefined") ["ch_C2", "ch_I_done_sandwich", "ch_I_done_pizza", "ch_I_done_pancake", "ch_J8"].forEach(k => { delete VOICE_LINES_EN[k]; });
