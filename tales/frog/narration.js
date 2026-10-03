/* frog — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "연못에 아침이 왔어요. 아기 개구리들이 아직 쿨쿨 자고 있네요.": "audio/tc/frog/nar_1ee522c48a.mp3",
 "아기 개구리들을 톡 눌러서 깨워 줄까요?": "audio/tc/frog/nar_1cedafacec.mp3",
 "자고 있는 아기 개구리를 톡 눌러 봐요!": "audio/tc/frog/nar_8820c4c773.mp3",
 "엄마 개구리가 말했어요. \"얘들아, 멀리 가면 안 된다~\"": [
  "audio/tc/frog/nar_6d18f9a33b.mp3",
  "audio/tc/frog/mom_f5239ada5a.mp3"
 ],
 "아기 개구리들이 몰래 풀밭으로 나왔어요. 톡톡 눌러서 폴짝폴짝 가 볼까요?": "audio/tc/frog/nar_03a1a34979.mp3",
 "화면을 톡톡 눌러서 폴짝폴짝!": "audio/tc/frog/nar_cf80345dbc.mp3",
 "어? 눈앞에 커다란 무언가가 있어요!": "audio/tc/frog/nar_43dfc1f749.mp3",
 "이건 뭘까요? 꼬리일까요, 나무일까요?": "audio/tc/frog/nar_25b683d433.mp3",
 "가운데 그림이랑 똑같이 생긴 쪽을 골라 봐요!": "audio/tc/frog/nar_8137f4e9d7.mp3",
 "꼬리예요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_7ceec66d9d.mp3",
 "맞아요, 꼬리예요!": "audio/tc/frog/nar_e9187602b3.mp3",
 "이번엔 뭘까요? 발굽일까요, 돌멩이일까요?": "audio/tc/frog/nar_5b95f64029.mp3",
 "발굽이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_5927dcba57.mp3",
 "맞아요, 발굽이에요!": "audio/tc/frog/nar_6c9e9d89a7.mp3",
 "이건 뭘까요? 뿔일까요, 나뭇가지일까요?": "audio/tc/frog/nar_8deb6a577a.mp3",
 "뿔이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_1040e0ab4c.mp3",
 "맞아요, 뿔이에요!": "audio/tc/frog/nar_7d265a7ce7.mp3",
 "음매~! 커다란 황소였어요! 아기 개구리들은 깜짝 놀라 도망쳤어요.": [
  "audio/tc/frog/ox_2c314af9d0.mp3",
  "audio/tc/frog/nar_f0fad8978e.mp3"
 ],
 "\"엄마! 산처럼 커다란 괴물을 봤어요!\"": "audio/tc/frog/baby_1ec1cc0f6d.mp3",
 "엄마 개구리가 말했어요. \"흥, 얼마나 컸는데?\"": [
  "audio/tc/frog/nar_6d18f9a33b.mp3",
  "audio/tc/frog/mom_012b0215db.mp3"
 ],
 "누가 더 큰지 키를 재 볼까요?": "audio/tc/frog/nar_7409c73a99.mp3",
 "개구리랑 올챙이, 누가 더 커요?": "audio/tc/frog/nar_555eba8d7a.mp3",
 "올챙이랑 개구리, 누가 더 커요?": "audio/tc/frog/nar_0c369e19e5.mp3",
 "누가 더 커요? 큰 친구를 눌러 봐요!": "audio/tc/frog/nar_a57d7e25ca.mp3",
 "둘이 나란히 섰어요. 머리가 더 높은 친구는 누구지?": "audio/tc/frog/nar_75f5a0b7b3.mp3",
 "개구리가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_7722e8b858.mp3",
 "맞아요! 개구리가 더 커요!": "audio/tc/frog/nar_59c5073081.mp3",
 "오리랑 개구리, 누가 더 커요?": "audio/tc/frog/nar_e82464c53a.mp3",
 "개구리랑 오리, 누가 더 커요?": "audio/tc/frog/nar_118a983fb6.mp3",
 "오리가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_66aef008af.mp3",
 "맞아요! 오리가 더 커요!": "audio/tc/frog/nar_212633772e.mp3",
 "양이랑 오리, 누가 더 커요?": "audio/tc/frog/nar_a78bb8b3d2.mp3",
 "오리랑 양, 누가 더 커요?": "audio/tc/frog/nar_7bbf68de7b.mp3",
 "양이 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_a4c35ed495.mp3",
 "맞아요! 양이 더 커요!": "audio/tc/frog/nar_138432047e.mp3",
 "황소랑 양, 누가 더 커요?": "audio/tc/frog/nar_8c216fd7c3.mp3",
 "양이랑 황소, 누가 더 커요?": "audio/tc/frog/nar_3051037dec.mp3",
 "황소가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_f60384070a.mp3",
 "맞아요! 황소가 더 커요!": "audio/tc/frog/nar_2199ad3edb.mp3",
 "\"흥, 나도 황소만큼 클 수 있어!\" 엄마 개구리가 숨을 크게 들이마셨어요.": [
  "audio/tc/frog/mom_a5c1acc4ee.mp3",
  "audio/tc/frog/nar_304d64521f.mp3"
 ],
 "엄마 개구리를 톡톡 눌러서 부풀려 볼까요?": "audio/tc/frog/nar_bbcfdef8f3.mp3",
 "엄마 개구리를 톡톡 눌러 봐요!": "audio/tc/frog/nar_58fe679d94.mp3",
 "\"아직 황소가 더 커요!\"": "audio/tc/frog/babyb_15663b4d7f.mp3",
 "\"와, 양만큼 커졌다! 그래도 황소가 더 커요!\"": "audio/tc/frog/babyc_b011584602.mp3",
 "엄마 개구리가 부들부들 떨려요. 어어… 한 번 더 누르면 어떻게 될까?": "audio/tc/frog/nar_5a2bd903cb.mp3",
 "푸슈슈슉~ 엄마 개구리가 풍선처럼 날아다녀요! 톡 눌러서 잡아 줘요!": "audio/tc/frog/nar_e2782ea06a.mp3",
 "날아다니는 엄마 개구리를 톡!": "audio/tc/frog/nar_929266dd08.mp3",
 "엄마 개구리는 원래 크기로 돌아왔어요. 어지러워도 깔깔깔 웃었답니다.": "audio/tc/frog/nar_563bc2884b.mp3",
 "황소가 몸을 낮추고 다정하게 말했어요. \"크지 않아도 괜찮아. 너는 폴짝 뛰기 선수잖아!\"": [
  "audio/tc/frog/nar_50ed5f927b.mp3",
  "audio/tc/frog/ox_c1774d6dc2.mp3"
 ],
 "엄마 개구리를 톡 눌러서 폴짝!": "audio/tc/frog/nar_b5d611637e.mp3",
 "황소도 따라 뛰어 볼까요? 하나, 둘…": "audio/tc/frog/nar_b87a5cd1d3.mp3",
 "쿵! 황소는 폴짝 뛰지 못했어요. 누가 더 멀리 뛸까요? 개구리!": "audio/tc/frog/nar_597d4dd68d.mp3",
 "밤이 되었어요. 개구리 가족이 노래를 불러요. 개구리를 톡톡 눌러서 합창해 봐요!": "audio/tc/frog/nar_80b9216659.mp3",
 "개굴개굴~ 노래가 잦아들고, 개구리 가족은 쿨쿨 잠이 들었답니다.": "audio/tc/frog/nar_9990b1ee2d.mp3"
};
const VOICE_LINES = {
 "wake_0": "audio/tc/frog/baby_7038ff6b81.mp3",
 "wake_1": "audio/tc/frog/babyb_77e24c9116.mp3",
 "wake_2": "audio/tc/frog/babyc_1e4f6111a8.mp3",
 "cut_pop": "audio/tc/frog/mom_75281905d1.mp3",
 "ox_thud": "audio/tc/frog/ox_cd2b0a775a.mp3"
};
