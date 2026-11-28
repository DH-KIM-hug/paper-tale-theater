/* gingerbread — 배역별 합창 ElevenLabs판 (tales/gingerbread/mix_chorus_el.py가 생성, 손으로 고치지 말 것).
   narration_el.js 뒤에 불러 합창 글자에 겹친 클립을 연결하고, 따로 녹음한 목소리(VOICE_LINES ch_*)는 미리 받지 않게 뺀다 */
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, {
 "어? 진저브레드맨이다! 거기 서, 잡아라!": "audio/el/gingerbread/chorus/ch_13f814cebe.mp3",
 "저기 봐! 진저브레드맨이야! 거기 서!": "audio/el/gingerbread/chorus/ch_5e0e98a077.mp3"
});
if (typeof VOICE_LINES !== "undefined") ["ch_S5_2", "ch_S6_2"].forEach(k => { delete VOICE_LINES[k]; });
if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, {
 "어? 진저브레드맨이다! 거기 서, 잡아라!": {
  "t": "Look! A gingerbread man! Stop him, catch him!",
  "c": "audio/el/gingerbread/chorus/en/ch_0bc4477658.mp3"
 },
 "저기 봐! 진저브레드맨이야! 거기 서!": {
  "t": "Look there! A gingerbread man! Stop!",
  "c": "audio/el/gingerbread/chorus/en/ch_747fa97e0b.mp3"
 }
});
if (typeof VOICE_LINES_EN !== "undefined") ["ch_S5_2", "ch_S6_2"].forEach(k => { delete VOICE_LINES_EN[k]; });
