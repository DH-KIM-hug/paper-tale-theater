/* frog — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "연못에 아침이 왔어요. 아기 개구리들이 아직 쿨쿨 자고 있네요.": "audio/tc/frog/nar_df7a768be7.mp3",
 "아기 개구리들을 톡 눌러서 깨워 줄까요?": "audio/tc/frog/nar_d699c930c7.mp3",
 "자고 있는 아기 개구리를 톡 눌러 봐요!": "audio/tc/frog/nar_693a4d63a3.mp3",
 "엄마 개구리가 말했어요. \"얘들아, 멀리 가면 안 된다~\"": [
  "audio/tc/frog/nar_7f352e2382.mp3",
  "audio/tc/frog/mom_f5239ada5a.mp3"
 ],
 "아기 개구리들이 몰래 풀밭으로 나왔어요. 톡톡 눌러서 폴짝폴짝 가 볼까요?": "audio/tc/frog/nar_afa5273ba8.mp3",
 "화면을 톡톡 눌러서 폴짝폴짝!": "audio/tc/frog/nar_1113e957af.mp3",
 "어? 눈앞에 커다란 무언가가 있어요!": "audio/tc/frog/nar_ce79ec2f79.mp3",
 "이건 뭘까요? 꼬리일까요, 나무일까요?": "audio/tc/frog/nar_bf2a6b8e6e.mp3",
 "가운데 그림이랑 똑같이 생긴 쪽을 골라 봐요!": "audio/tc/frog/nar_88ea1e80de.mp3",
 "꼬리예요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_933a8f8401.mp3",
 "맞아요, 꼬리예요!": "audio/tc/frog/nar_716c9d4ef6.mp3",
 "이번엔 뭘까요? 발굽일까요, 돌멩이일까요?": "audio/tc/frog/nar_2049c642f6.mp3",
 "발굽이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_9f3c7068e3.mp3",
 "맞아요, 발굽이에요!": "audio/tc/frog/nar_8c586c9dc2.mp3",
 "이건 뭘까요? 뿔일까요, 나뭇가지일까요?": "audio/tc/frog/nar_8b99b23d81.mp3",
 "뿔이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_cd64a987d3.mp3",
 "맞아요, 뿔이에요!": "audio/tc/frog/nar_b25f046999.mp3",
 "커다란 황소였어요! 아기 개구리들은 깜짝 놀라 도망쳤어요.": "audio/tc/frog/nar_c74094506d.mp3",
 "\"엄마! 산처럼 커다란 괴물을 봤어요!\"": "audio/tc/frog/baby_a8bd06faf2.mp3",
 "엄마 개구리가 말했어요. \"흥, 얼마나 컸는데?\"": [
  "audio/tc/frog/nar_7f352e2382.mp3",
  "audio/tc/frog/mom_eff0c2919f.mp3"
 ],
 "누가 더 큰지 키를 재 볼까요?": "audio/tc/frog/nar_6dacf61e72.mp3",
 "개구리랑 올챙이, 누가 더 커요?": "audio/tc/frog/nar_6a54e844e4.mp3",
 "올챙이랑 개구리, 누가 더 커요?": "audio/tc/frog/nar_b9315368d1.mp3",
 "누가 더 커요? 큰 친구를 눌러 봐요!": "audio/tc/frog/nar_4400c655b2.mp3",
 "둘이 나란히 섰어요. 머리가 더 높은 친구는 누구지?": "audio/tc/frog/nar_5e5429dbc8.mp3",
 "개구리가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_24ff4148c8.mp3",
 "맞아요! 개구리가 더 커요!": "audio/tc/frog/nar_1ade81e673.mp3",
 "오리랑 개구리, 누가 더 커요?": "audio/tc/frog/nar_541cde600c.mp3",
 "개구리랑 오리, 누가 더 커요?": "audio/tc/frog/nar_edeae60b89.mp3",
 "오리가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_888db45e84.mp3",
 "맞아요! 오리가 더 커요!": "audio/tc/frog/nar_add3fcdeef.mp3",
 "양이랑 오리, 누가 더 커요?": "audio/tc/frog/nar_a7346c8c8b.mp3",
 "오리랑 양, 누가 더 커요?": "audio/tc/frog/nar_d05a271a6b.mp3",
 "양이 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_fe5c89a4c1.mp3",
 "맞아요! 양이 더 커요!": "audio/tc/frog/nar_55e5a04d77.mp3",
 "황소랑 양, 누가 더 커요?": "audio/tc/frog/nar_17976ee2bf.mp3",
 "양이랑 황소, 누가 더 커요?": "audio/tc/frog/nar_55bdf0829e.mp3",
 "황소가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_c8795f9044.mp3",
 "맞아요! 황소가 더 커요!": "audio/tc/frog/nar_6b0f391abe.mp3",
 "\"흥, 나도 황소만큼 클 수 있어!\" 엄마 개구리가 숨을 크게 들이마셨어요.": [
  "audio/tc/frog/mom_af3e17ed20.mp3",
  "audio/tc/frog/nar_8ff5157a9a.mp3"
 ],
 "엄마 개구리를 톡톡 눌러서 부풀려 볼까요?": "audio/tc/frog/nar_485603cb24.mp3",
 "엄마 개구리를 톡톡 눌러 봐요!": "audio/tc/frog/nar_57229efdd1.mp3",
 "\"아직 황소가 더 커요!\"": "audio/tc/frog/babyb_1ba19e140a.mp3",
 "\"와, 양만큼 커졌다! 그래도 황소가 더 커요!\"": "audio/tc/frog/babyc_ad62bf8244.mp3",
 "엄마 개구리가 부들부들 떨려요. 어어… 한 번 더 누르면 어떻게 될까?": "audio/tc/frog/nar_b52bbd16a0.mp3",
 "푸슈슈슉~ 엄마 개구리가 풍선처럼 날아다녀요! 톡 눌러서 잡아 줘요!": "audio/tc/frog/nar_19c72273ee.mp3",
 "날아다니는 엄마 개구리를 톡!": "audio/tc/frog/nar_cf24aa4f1f.mp3",
 "엄마 개구리는 원래 크기로 돌아왔어요. 어지러워도 깔깔깔 웃었답니다.": "audio/tc/frog/nar_eda1b43ed7.mp3",
 "황소가 몸을 낮추고 다정하게 말했어요. \"크지 않아도 괜찮아. 너는 폴짝 뛰기 선수잖아!\"": [
  "audio/tc/frog/nar_aa080a214a.mp3",
  "audio/tc/frog/ox_c1774d6dc2.mp3"
 ],
 "엄마 개구리를 톡 눌러서 폴짝!": "audio/tc/frog/nar_eafc8bdf78.mp3",
 "황소도 따라 뛰어 볼까요? 하나, 둘…": "audio/tc/frog/nar_9ecf874121.mp3",
 "쿵! 황소는 폴짝 뛰지 못했어요. 누가 더 멀리 뛸까요? 개구리!": "audio/tc/frog/nar_51aff00e0f.mp3",
 "밤이 되었어요. 나비넥타이를 맨 삼촌 개구리가 놀러 왔어요. 개구리 가족이 노래를 불러요. 먼저 들어 봐요!": "audio/tc/frog/nar_7ecbc6c351.mp3",
 "이번에는 개구리를 톡톡 눌러서 같이 불러요!": "audio/tc/frog/nar_0003cdfb9f.mp3",
 "잘했어요! 이제 마음대로 노래해 봐요!": "audio/tc/frog/nar_b6abce7805.mp3",
 "개굴개굴~ 노래가 잦아들고, 개구리 가족은 쿨쿨 잠이 들었답니다.": "audio/tc/frog/nar_0f8ef309f7.mp3"
};
const VOICE_LINES = {
 "cut_pop": "audio/tc/frog/mom_4a6386aca6.mp3",
 "ox_thud": "audio/tc/frog/ox_afdc64c167.mp3"
};
