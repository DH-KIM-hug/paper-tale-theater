/* little_mermaid — 언니들 합창 ElevenLabs판 (tales/little_mermaid/mix_chorus_el.py가 생성, 손으로 고치지 말 것).
   narration_el.js 뒤에 불러 합창 문장에 섞은 클립을 붙이고, 따로 녹음한 다섯 목소리는 미리 받지 않게 뺀다 */
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, {
 "마녀에게 머리카락을 주고 이 단검을 받았어.": "audio/el/little_mermaid/chorus/ch_0e94b5baba.mp3",
 "해가 뜨기 전에 이걸 왕자에게 쓰면 너는 다시 인어가 돼. 그러지 않으면 거품이 되는 거야.": "audio/el/little_mermaid/chorus/ch_e1c35db46e.mp3"
});
if (typeof VOICE_LINES !== "undefined") ["ch1", "ch2"].forEach(k => { delete VOICE_LINES[k]; });
if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, {
 "마녀에게 머리카락을 주고 이 단검을 받았어.": {
  "t": "We gave the witch our hair and got this dagger.",
  "c": "audio/el/little_mermaid/chorus/en/ch_ae4c80bfc1.mp3"
 },
 "해가 뜨기 전에 이걸 왕자에게 쓰면 너는 다시 인어가 돼. 그러지 않으면 거품이 되는 거야.": {
  "t": "If you use this on the prince before the sun rises, you will be a mermaid again. If you do not, you will turn into foam.",
  "c": "audio/el/little_mermaid/chorus/en/ch_ff5ad2d526.mp3"
 }
});
if (typeof VOICE_LINES_EN !== "undefined") ["ch1", "ch2"].forEach(k => { delete VOICE_LINES_EN[k]; });
