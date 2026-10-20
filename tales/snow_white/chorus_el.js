/* snow_white — 난쟁이들 합창 ElevenLabs판 (tales/snow_white/mix_chorus_el.py가 생성, 손으로 고치지 말 것).
   narration_el.js·chorus.js 뒤에 불러 EL 합창으로 덮어쓰고, 따로 녹음한 일곱 목소리는 미리 받지 않게 뺀다 */
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, {
 "와아, 정말 예쁜 아이다! 깨우지 말자, 쉿!": "audio/el/snow_white/chorus/ch_89cda38011.mp3",
 "그럼! 대신 우리가 일하러 간 사이, 낯선 사람에겐 절대 문을 열지 마!": "audio/el/snow_white/chorus/ch_4ecc2711f1.mp3",
 "백설공주에게는 우리 침대가 너무 작아. 큰 침대를 만들어 주자!": "audio/el/snow_white/chorus/ch_ff8609dd2c.mp3",
 "작은 침대 일곱 개, 큰 침대 하나, 모두 여덟 개!": "audio/el/snow_white/chorus/ch_4aebcde4d8.mp3",
 "백설공주님, 일어나요! 일어나세요…": "audio/el/snow_white/chorus/ch_481f119393.mp3",
 "만세! 백설공주가 깨어났다!": "audio/el/snow_white/chorus/ch_8b46339703.mp3"
});
if (typeof VOICE_LINES !== "undefined") ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"].forEach(k => { delete VOICE_LINES[k]; });
if (typeof NARRATION_CLIPS_EN !== "undefined") Object.assign(NARRATION_CLIPS_EN, {
 "와아, 정말 예쁜 아이다! 깨우지 말자, 쉿!": {
  "t": "Wow, what a pretty girl! Let's not wake her. Shh!",
  "c": "audio/el/snow_white/chorus/en/ch_1289a2c598.mp3"
 },
 "그럼! 대신 우리가 일하러 간 사이, 낯선 사람에겐 절대 문을 열지 마!": {
  "t": "Of course! But while we are away at work, never open the door to a stranger!",
  "c": "audio/el/snow_white/chorus/en/ch_c446e7deda.mp3"
 },
 "백설공주에게는 우리 침대가 너무 작아. 큰 침대를 만들어 주자!": {
  "t": "Our beds are too small for Snow White. Let's make her a big bed!",
  "c": "audio/el/snow_white/chorus/en/ch_ceee868259.mp3"
 },
 "작은 침대 일곱 개, 큰 침대 하나, 모두 여덟 개!": {
  "t": "Seven small beds, one big bed, eight in all!",
  "c": "audio/el/snow_white/chorus/en/ch_1465302905.mp3"
 },
 "백설공주님, 일어나요! 일어나세요…": {
  "t": "Snow White, wake up! Please wake up...",
  "c": "audio/el/snow_white/chorus/en/ch_a56711352d.mp3"
 },
 "만세! 백설공주가 깨어났다!": {
  "t": "Hooray! Snow White is awake!",
  "c": "audio/el/snow_white/chorus/en/ch_3a496f7c83.mp3"
 }
});
if (typeof VOICE_LINES_EN !== "undefined") ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"].forEach(k => { delete VOICE_LINES_EN[k]; });
