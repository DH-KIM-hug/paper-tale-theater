/* red_car — 다섯 자동차 합창 ElevenLabs판 (tales/red_car/mix_chorus_el.py가 생성, 손으로 고치지 말 것).
   narration_el.js·chorus.js 뒤에 불러 EL 합창으로 덮어쓰고, 따로 녹음한 다섯 목소리는 미리 받지 않게 뺀다 */
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, {
 "부릉부릉, 빵빵!": "audio/el/red_car/chorus/ch_f7b6d350e0.mp3"
});
if (typeof VOICE_LINES !== "undefined") ["cheer"].forEach(k => { delete VOICE_LINES[k]; });
if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, {
 "부릉부릉, 빵빵!": {
  "t": "Vroom vroom, beep beep!",
  "c": "audio/el/red_car/chorus/en/ch_28ce551a33.mp3"
 }
});
if (typeof VOICE_LINES_EN !== "undefined") ["cheer"].forEach(k => { delete VOICE_LINES_EN[k]; });
