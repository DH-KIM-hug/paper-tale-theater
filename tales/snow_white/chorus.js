/* snow_white — 난쟁이들 합창 (tales/snow_white/mix_chorus.py가 생성, 손으로 고치지 말 것).
   합창 파일을 말풍선 대사로 쓰고, 따로 녹음한 일곱 목소리는 미리 받지 않게 뺀다 */
const CHORUS_CLIPS = {
 "와아, 정말 예쁜 아이다! 깨우지 말자, 쉿!": "audio/tc/snow_white/chorus/ch_4f58760dd4.mp3",
 "그럼! 대신 우리가 일하러 간 사이, 낯선 사람에겐 절대 문을 열지 마!": "audio/tc/snow_white/chorus/ch_bb48ecbc6d.mp3",
 "백설공주에게는 우리 침대가 너무 작아. 큰 침대를 만들어 주자!": "audio/tc/snow_white/chorus/ch_8ccc83ab50.mp3",
 "작은 침대 일곱 개, 큰 침대 하나, 모두 여덟 개!": "audio/tc/snow_white/chorus/ch_4c74da7b82.mp3",
 "백설공주님, 일어나요! 일어나세요…": "audio/tc/snow_white/chorus/ch_0a6c6a429e.mp3",
 "만세! 백설공주가 깨어났다!": "audio/tc/snow_white/chorus/ch_8ee92581b8.mp3"
};
if (typeof NARRATION_CLIPS !== "undefined") Object.assign(NARRATION_CLIPS, CHORUS_CLIPS);
if (typeof VOICE_LINES !== "undefined") ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6"].forEach(k => { delete VOICE_LINES[k]; });
