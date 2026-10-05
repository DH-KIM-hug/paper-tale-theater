/* fox_crane — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "숲속에 여우랑 두루미가 살았어요.": "audio/tc/fox_crane/nar_4cc0515a67.mp3",
 "여우가 초대장을 가져왔어요. 초대장을 톡 눌러 봐요!": "audio/tc/fox_crane/nar_c242932008.mp3",
 "초대장을 톡 눌러서 두루미에게 줘요!": "audio/tc/fox_crane/nar_985bccd5c2.mp3",
 "\"와, 고마워!\" 두루미가 긴 다리로 폴짝 뛰었어요.": [
  "audio/tc/fox_crane/crane_c56c05a26c.mp3",
  "audio/tc/fox_crane/nar_3a65b12221.mp3"
 ],
 "여우가 맛있는 수프를 끓여요.": "audio/tc/fox_crane/nar_c44d436d85.mp3",
 "냄비를 톡톡 눌러서 저어 볼까요?": "audio/tc/fox_crane/nar_67481c21f1.mp3",
 "냄비를 톡톡 눌러서 휘휘 저어요!": "audio/tc/fox_crane/nar_4cb8732879.mp3",
 "여우가 킥킥 웃어요. \"납작 접시에 담아야지~\"": [
  "audio/tc/fox_crane/nar_e683cbbee5.mp3",
  "audio/tc/fox_crane/fox_5991c73efe.mp3"
 ],
 "두루미가 놀러 왔어요. 그런데 접시가 아주 납작해요!": "audio/tc/fox_crane/nar_28c17b9bcd.mp3",
 "두루미 부리를 톡 눌러서 먹게 해 줘요!": "audio/tc/fox_crane/nar_1a83a1482d.mp3",
 "두루미 부리를 톡 눌러 봐요!": "audio/tc/fox_crane/nar_26c04cae32.mp3",
 "어머나, 부리 끝만 딱딱 닿아요. 수프를 먹을 수가 없어요.": "audio/tc/fox_crane/nar_2131adf991.mp3",
 "여우는 혀로 핥핥, 다 먹었어요. 두루미는 배가 꼬르륵, 속상했어요.": "audio/tc/fox_crane/nar_62f98b745e.mp3",
 "며칠 뒤, 이번엔 두루미가 여우를 불렀어요.": "audio/tc/fox_crane/nar_a7d5f223eb.mp3",
 "\"여우야, 우리 집에도 놀러 와~\"": "audio/tc/fox_crane/crane_d29050aeb3.mp3",
 "여우가 신이 났어요. \"좋아! 맛있는 거 먹어야지!\"": [
  "audio/tc/fox_crane/nar_1e2b513d03.mp3",
  "audio/tc/fox_crane/fox_3aa059c11c.mp3"
 ],
 "와, 병이 탑처럼 높아요! 목이 아주 길어요.": [
  "audio/tc/fox_crane/fox_2e6f9adb5c.mp3",
  "audio/tc/fox_crane/nar_f1c8e4fe2c.mp3"
 ],
 "여우 코를 톡 눌러서 먹게 해 줘요!": "audio/tc/fox_crane/nar_c7552f8a0e.mp3",
 "여우 코를 톡 눌러 봐요!": "audio/tc/fox_crane/nar_0826ddb07a.mp3",
 "여우 코를 한 번 더 톡!": "audio/tc/fox_crane/nar_c813c363aa.mp3",
 "여우 코를 톡! 폴짝 뛰어 봐요!": "audio/tc/fox_crane/nar_e0519a5be7.mp3",
 "어머나! 여우 코가 병에 쏙 끼었어요!": "audio/tc/fox_crane/nar_1d8aab5e0e.mp3",
 "뿅! 코가 빠졌어요. 엉덩방아 쿵!": "audio/tc/fox_crane/nar_ec9ea9a5ab.mp3",
 "두루미는 긴 부리로 쪽쪽 먹었어요. 여우는 배가 꼬르륵, 속상했어요.": "audio/tc/fox_crane/nar_c9331adffc.mp3",
 "둘 다 못 먹었어요. 왜 그랬을까요?": "audio/tc/fox_crane/nar_dc93f45973.mp3",
 "두루미는 부리가 길쭉해요. 어떤 그릇이 좋을까요?": "audio/tc/fox_crane/nar_da11395704.mp3",
 "길쭉한 부리가 쏙 들어가는 그릇을 찾아봐요!": "audio/tc/fox_crane/nar_6f5aeb64bd.mp3",
 "여우는 입이 짧아요. 혀로 핥아 먹어요. 어떤 그릇이 좋을까요?": "audio/tc/fox_crane/nar_46af48749e.mp3",
 "혀로 핥기 좋은 납작한 그릇을 찾아봐요!": "audio/tc/fox_crane/nar_235d91bac5.mp3",
 "여우랑 두루미가 함께 잔치를 열었어요. 손님들도 와요!": "audio/tc/fox_crane/nar_ce1335da36.mp3",
 "입 모양을 잘 보고, 알맞은 그릇을 골라 줘요!": "audio/tc/fox_crane/nar_68a29d8f72.mp3",
 "여우는 입이 짧아요. 어떤 그릇이 좋을까요?": "audio/tc/fox_crane/nar_6c53bf8c48.mp3",
 "오리는 부리가 넓적해요. 어떤 그릇이 좋을까요?": "audio/tc/fox_crane/nar_855736d762.mp3",
 "나비는 입이 빨대 같아요. 무엇이 좋을까요?": "audio/tc/fox_crane/nar_385cbb8c77.mp3",
 "길쭉한 부리가 쏙 들어가는 걸 찾아봐요!": "audio/tc/fox_crane/nar_7afc3cf433.mp3",
 "혀로 핥기 좋은 납작한 걸 찾아봐요!": "audio/tc/fox_crane/nar_b338a6ad21.mp3",
 "넓적한 부리로 푹 떠먹기 좋은 걸 찾아봐요!": "audio/tc/fox_crane/nar_5a608aa72f.mp3",
 "빨대 입으로 쪽 빨아 먹는 걸 찾아봐요!": "audio/tc/fox_crane/nar_14a6a8bad8.mp3",
 "두루미가 왔어요!": "audio/tc/fox_crane/nar_74ea253936.mp3",
 "여우가 왔어요!": "audio/tc/fox_crane/nar_b11d26259a.mp3",
 "오리가 왔어요!": "audio/tc/fox_crane/nar_8581305d62.mp3",
 "나비가 왔어요!": "audio/tc/fox_crane/nar_4ce670c359.mp3",
 "납작 접시예요! 반짝이는 걸 눌러 봐요!": "audio/tc/fox_crane/nar_12aa750f28.mp3",
 "긴 병이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/fox_crane/nar_86eb7c4ebb.mp3",
 "넓은 그릇이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/fox_crane/nar_75f137a910.mp3",
 "꽃이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/fox_crane/nar_b6d05dd611.mp3",
 "맞아요! 두루미는 긴 병이 좋아요.": "audio/tc/fox_crane/nar_e6fbdd9ab1.mp3",
 "맞아요! 여우는 납작 접시가 좋아요.": "audio/tc/fox_crane/nar_86eb666cce.mp3",
 "맞아요! 오리는 넓은 그릇이 좋아요.": "audio/tc/fox_crane/nar_76a7b55743.mp3",
 "맞아요! 나비는 꽃이 좋아요.": "audio/tc/fox_crane/nar_29c39e9b24.mp3",
 "등불이 반짝, 모두 모여 잔치를 해요.": "audio/tc/fox_crane/nar_4d25a99130.mp3",
 "여우가 말했어요. \"두루미야, 미안해.\"": [
  "audio/tc/fox_crane/nar_2469d2901e.mp3",
  "audio/tc/fox_crane/fox_56c053d31e.mp3"
 ],
 "두루미도 말했어요. \"여우야, 나도 미안해.\"": [
  "audio/tc/fox_crane/nar_53451e732f.mp3",
  "audio/tc/fox_crane/crane_ff20ff2669.mp3"
 ],
 "\"괜찮아!\" 둘은 다시 사이좋은 친구가 되었어요.": [
  "audio/tc/fox_crane/fox_868f5964b8.mp3",
  "audio/tc/fox_crane/crane_cd04363c3e.mp3",
  "audio/tc/fox_crane/nar_677eccee56.mp3"
 ],
 "친구들을 톡톡 눌러 봐요. 냠냠 맛있게 먹어요!": "audio/tc/fox_crane/nar_f4e16b7e54.mp3",
 "배부르게 먹고, 모두 행복하게 웃었답니다.": "audio/tc/fox_crane/nar_6f0f1ff8de.mp3"
};
const VOICE_LINES = {
 "cut_peck": "audio/tc/fox_crane/crane_bf60eb0a84.mp3",
 "cut_lick": "audio/tc/fox_crane/fox_bea3fc4475.mp3",
 "cut_stuck": "audio/tc/fox_crane/fox_c12096c84a.mp3",
 "hi_crane": "audio/tc/fox_crane/crane_330d7667e6.mp3",
 "hi_fox": "audio/tc/fox_crane/fox_383376cb7d.mp3",
 "hi_duck": "audio/tc/fox_crane/duck_7637a4c3c3.mp3",
 "hi_butterfly": "audio/tc/fox_crane/butterfly_a1d009c05b.mp3",
 "yum_crane": "audio/tc/fox_crane/crane_df65997e4c.mp3",
 "yum_fox": "audio/tc/fox_crane/fox_d153bd5190.mp3",
 "yum_duck": "audio/tc/fox_crane/duck_a34a5105e2.mp3",
 "yum_butterfly": "audio/tc/fox_crane/butterfly_a0599e24a8.mp3"
};
