/* frog — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "연못에 아침이 왔어요. 아기 개구리들이 아직 쿨쿨 자고 있네요.": "audio/tc/frog/nar_afce7b91d2.mp3",
 "아기 개구리들을 톡 눌러서 깨워 줄까요?": "audio/tc/frog/nar_d699c930c7.mp3",
 "자고 있는 아기 개구리를 톡 눌러 봐요!": "audio/tc/frog/nar_7a2280f69a.mp3",
 "엄마 개구리가 말했어요. \"얘들아, 멀리 가면 안 된다~\"": [
  "audio/tc/frog/nar_af9a6578e5.mp3",
  "audio/tc/frog/mom_f5239ada5a.mp3"
 ],
 "아기 개구리들이 몰래 풀밭으로 나왔어요. 톡톡 눌러서 폴짝폴짝 가 볼까요?": "audio/tc/frog/nar_6db6e5b3dc.mp3",
 "화면을 톡톡 눌러서 폴짝폴짝!": "audio/tc/frog/nar_ccb29932bc.mp3",
 "어? 눈앞에 커다란 무언가가 있어요!": "audio/tc/frog/nar_d1264d48f3.mp3",
 "이건 뭘까요? 꼬리일까요, 나무일까요?": "audio/tc/frog/nar_2d27053925.mp3",
 "가운데 그림이랑 똑같이 생긴 쪽을 골라 봐요!": "audio/tc/frog/nar_cf05059d15.mp3",
 "꼬리예요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_62f4fde0fd.mp3",
 "맞아요, 꼬리예요!": "audio/tc/frog/nar_4b1f57521c.mp3",
 "이번엔 뭘까요? 발굽일까요, 돌멩이일까요?": "audio/tc/frog/nar_93372804f0.mp3",
 "발굽이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_ffdc3e3609.mp3",
 "맞아요, 발굽이에요!": "audio/tc/frog/nar_dd0447c062.mp3",
 "이건 뭘까요? 뿔일까요, 나뭇가지일까요?": "audio/tc/frog/nar_857ba1edd1.mp3",
 "뿔이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/frog/nar_3c35715171.mp3",
 "맞아요, 뿔이에요!": "audio/tc/frog/nar_50e4b80275.mp3",
 "커다란 황소였어요! 아기 개구리들은 깜짝 놀라 도망쳤어요.": "audio/tc/frog/nar_7004dab727.mp3",
 "\"엄마! 산처럼 커다란 괴물을 봤어요!\"": "audio/tc/frog/baby_a8bd06faf2.mp3",
 "엄마 개구리가 말했어요. \"흥, 얼마나 컸는데?\"": [
  "audio/tc/frog/nar_af9a6578e5.mp3",
  "audio/tc/frog/mom_012b0215db.mp3"
 ],
 "누가 더 큰지 키를 재 볼까요?": "audio/tc/frog/nar_166e065ca6.mp3",
 "개구리랑 올챙이, 누가 더 커요?": "audio/tc/frog/nar_3ffb94d511.mp3",
 "올챙이랑 개구리, 누가 더 커요?": "audio/tc/frog/nar_98926e28dc.mp3",
 "누가 더 커요? 큰 친구를 눌러 봐요!": "audio/tc/frog/nar_1c91878270.mp3",
 "둘이 나란히 섰어요. 머리가 더 높은 친구는 누구지?": "audio/tc/frog/nar_3fb3f57333.mp3",
 "개구리가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_bc0ff64c09.mp3",
 "맞아요! 개구리가 더 커요!": "audio/tc/frog/nar_3db019ad68.mp3",
 "오리랑 개구리, 누가 더 커요?": "audio/tc/frog/nar_0409e4a8f9.mp3",
 "개구리랑 오리, 누가 더 커요?": "audio/tc/frog/nar_5a26ac64c1.mp3",
 "오리가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_62b8c3bd6c.mp3",
 "맞아요! 오리가 더 커요!": "audio/tc/frog/nar_8380e51d98.mp3",
 "양이랑 오리, 누가 더 커요?": "audio/tc/frog/nar_f73a73840e.mp3",
 "오리랑 양, 누가 더 커요?": "audio/tc/frog/nar_56f1383025.mp3",
 "양이 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_616ec10e2d.mp3",
 "맞아요! 양이 더 커요!": "audio/tc/frog/nar_75d2fc2da2.mp3",
 "황소랑 양, 누가 더 커요?": "audio/tc/frog/nar_b53c57afc2.mp3",
 "양이랑 황소, 누가 더 커요?": "audio/tc/frog/nar_3c29b393c3.mp3",
 "황소가 더 커요! 반짝이는 친구를 눌러 봐요!": "audio/tc/frog/nar_15150aa82d.mp3",
 "맞아요! 황소가 더 커요!": "audio/tc/frog/nar_04e64f8bb8.mp3",
 "\"흥, 나도 황소만큼 클 수 있어!\" 엄마 개구리가 숨을 크게 들이마셨어요.": [
  "audio/tc/frog/mom_a5c1acc4ee.mp3",
  "audio/tc/frog/nar_6764a3e7f0.mp3"
 ],
 "엄마 개구리를 톡톡 눌러서 부풀려 볼까요?": "audio/tc/frog/nar_485603cb24.mp3",
 "엄마 개구리를 톡톡 눌러 봐요!": "audio/tc/frog/nar_9ac70ba069.mp3",
 "\"아직 황소가 더 커요!\"": "audio/tc/frog/babyb_1ba19e140a.mp3",
 "\"와, 양만큼 커졌다! 그래도 황소가 더 커요!\"": "audio/tc/frog/babyc_ad62bf8244.mp3",
 "엄마 개구리가 부들부들 떨려요. 어어… 한 번 더 누르면 어떻게 될까?": "audio/tc/frog/nar_d544eaec0a.mp3",
 "푸슈슈슉~ 엄마 개구리가 풍선처럼 날아다녀요! 톡 눌러서 잡아 줘요!": "audio/tc/frog/nar_deb1a9b1bd.mp3",
 "날아다니는 엄마 개구리를 톡!": "audio/tc/frog/nar_001b21703f.mp3",
 "엄마 개구리는 원래 크기로 돌아왔어요. 어지러워도 깔깔깔 웃었답니다.": "audio/tc/frog/nar_2a19c89876.mp3",
 "황소가 몸을 낮추고 다정하게 말했어요. \"크지 않아도 괜찮아. 너는 폴짝 뛰기 선수잖아!\"": [
  "audio/tc/frog/nar_a1ccf2e0cc.mp3",
  "audio/tc/frog/ox_c1774d6dc2.mp3"
 ],
 "엄마 개구리를 톡 눌러서 폴짝!": "audio/tc/frog/nar_091405b903.mp3",
 "황소도 따라 뛰어 볼까요? 하나, 둘…": "audio/tc/frog/nar_a4c7163989.mp3",
 "쿵! 황소는 폴짝 뛰지 못했어요. 누가 더 멀리 뛸까요? 개구리!": "audio/tc/frog/nar_21b0934558.mp3",
 "밤이 되었어요. 나비넥타이를 맨 삼촌 개구리가 놀러 왔어요. 개구리 가족이 노래를 불러요. 먼저 들어 봐요!": "audio/tc/frog/nar_7ecbc6c351.mp3",
 "이번에는 개구리를 톡톡 눌러서 같이 불러요!": "audio/tc/frog/nar_6c1d9c2fc2.mp3",
 "잘했어요! 이제 마음대로 노래해 봐요!": "audio/tc/frog/nar_9e5bb6d859.mp3",
 "개굴개굴~ 노래가 잦아들고, 개구리 가족은 쿨쿨 잠이 들었답니다.": "audio/tc/frog/nar_07480c6515.mp3"
};
const VOICE_LINES = {
 "cut_pop": "audio/tc/frog/mom_75281905d1.mp3",
 "ox_thud": "audio/tc/frog/ox_cd2b0a775a.mp3"
};
