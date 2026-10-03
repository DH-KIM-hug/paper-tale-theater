/* fox_crane — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "숲속에 여우랑 두루미가 살았어요.": "audio/tc/fox_crane/nar_fb71d4d4d5.mp3",
 "여우가 초대장을 가져왔어요. 초대장을 톡 눌러 봐요!": "audio/tc/fox_crane/nar_b17a9f4e55.mp3",
 "초대장을 톡 눌러서 두루미에게 줘요!": "audio/tc/fox_crane/nar_25459fd7c1.mp3",
 "\"와, 고마워!\" 두루미가 긴 다리로 폴짝 뛰었어요.": [
  "audio/tc/fox_crane/crane_c56c05a26c.mp3",
  "audio/tc/fox_crane/nar_fa7190c529.mp3"
 ],
 "여우가 맛있는 수프를 끓여요.": "audio/tc/fox_crane/nar_56ed132e32.mp3",
 "냄비를 톡톡 눌러서 저어 볼까요?": "audio/tc/fox_crane/nar_69bcaf201e.mp3",
 "냄비를 톡톡 눌러서 휘휘 저어요!": "audio/tc/fox_crane/nar_eb9ce3194a.mp3",
 "여우가 킥킥 웃어요. \"납작 접시에 담아야지~\"": [
  "audio/tc/fox_crane/nar_42671162e3.mp3",
  "audio/tc/fox_crane/fox_5991c73efe.mp3"
 ],
 "두루미가 놀러 왔어요. 그런데 접시가 아주 납작해요!": "audio/tc/fox_crane/nar_b164f21b55.mp3",
 "두루미 부리를 톡 눌러서 먹게 해 줘요!": "audio/tc/fox_crane/nar_e3f23e19e5.mp3",
 "두루미 부리를 톡 눌러 봐요!": "audio/tc/fox_crane/nar_474ea6d100.mp3",
 "어머나, 부리 끝만 딱딱 닿아요. 수프를 먹을 수가 없어요.": "audio/tc/fox_crane/nar_c30065d435.mp3",
 "여우는 혀로 핥핥, 다 먹었어요. 두루미는 배가 꼬르륵, 속상했어요.": "audio/tc/fox_crane/nar_9ee0d50400.mp3",
 "며칠 뒤, 이번엔 두루미가 여우를 불렀어요.": "audio/tc/fox_crane/nar_60a621198a.mp3",
 "\"여우야, 우리 집에도 놀러 와~\"": "audio/tc/fox_crane/crane_d29050aeb3.mp3",
 "여우가 신이 났어요. \"좋아! 맛있는 거 먹어야지!\"": [
  "audio/tc/fox_crane/nar_41f3babb55.mp3",
  "audio/tc/fox_crane/fox_3aa059c11c.mp3"
 ],
 "와, 병이 탑처럼 높아요! 목이 아주 길어요.": [
  "audio/tc/fox_crane/fox_2e6f9adb5c.mp3",
  "audio/tc/fox_crane/nar_5305877b4b.mp3"
 ],
 "여우 코를 톡 눌러서 먹게 해 줘요!": "audio/tc/fox_crane/nar_6fe6a2378e.mp3",
 "여우 코를 톡 눌러 봐요!": "audio/tc/fox_crane/nar_515cc303a5.mp3",
 "여우 코를 한 번 더 톡!": "audio/tc/fox_crane/nar_525482ad76.mp3",
 "여우 코를 톡! 폴짝 뛰어 봐요!": "audio/tc/fox_crane/nar_ca2761a78c.mp3",
 "어머나! 여우 코가 병에 쏙 끼었어요!": "audio/tc/fox_crane/nar_5fe63ba094.mp3",
 "뿅! 코가 빠졌어요. 엉덩방아 쿵!": "audio/tc/fox_crane/nar_b51997ad76.mp3",
 "두루미는 긴 부리로 쪽쪽 먹었어요. 여우는 배가 꼬르륵, 속상했어요.": "audio/tc/fox_crane/nar_ae12cf27b5.mp3",
 "둘 다 못 먹었어요. 왜 그랬을까요?": "audio/tc/fox_crane/nar_1f5ce1d495.mp3",
 "두루미는 부리가 길쭉해요. 어떤 그릇이 좋을까요?": "audio/tc/fox_crane/nar_0bd6c21a15.mp3",
 "길쭉한 부리가 쏙 들어가는 그릇을 찾아봐요!": "audio/tc/fox_crane/nar_3b847a2876.mp3",
 "여우는 입이 짧아요. 혀로 핥아 먹어요. 어떤 그릇이 좋을까요?": "audio/tc/fox_crane/nar_f20055230b.mp3",
 "혀로 핥기 좋은 납작한 그릇을 찾아봐요!": "audio/tc/fox_crane/nar_6e6220f2ee.mp3",
 "여우랑 두루미가 함께 잔치를 열었어요. 손님들도 와요!": "audio/tc/fox_crane/nar_21eea093a6.mp3",
 "입 모양을 잘 보고, 알맞은 그릇을 골라 줘요!": "audio/tc/fox_crane/nar_e95a7e0042.mp3",
 "여우는 입이 짧아요. 어떤 그릇이 좋을까요?": "audio/tc/fox_crane/nar_bc9ac932da.mp3",
 "오리는 부리가 넓적해요. 어떤 그릇이 좋을까요?": "audio/tc/fox_crane/nar_e0c26e2a9a.mp3",
 "나비는 입이 빨대 같아요. 무엇이 좋을까요?": "audio/tc/fox_crane/nar_7746a5c407.mp3",
 "길쭉한 부리가 쏙 들어가는 걸 찾아봐요!": "audio/tc/fox_crane/nar_7745138c0b.mp3",
 "혀로 핥기 좋은 납작한 걸 찾아봐요!": "audio/tc/fox_crane/nar_81b6627de6.mp3",
 "넓적한 부리로 푹 떠먹기 좋은 걸 찾아봐요!": "audio/tc/fox_crane/nar_b6583fd0ca.mp3",
 "빨대 입으로 쪽 빨아 먹는 걸 찾아봐요!": "audio/tc/fox_crane/nar_c0f01cc6f8.mp3",
 "두루미가 왔어요!": "audio/tc/fox_crane/nar_cf685f7b4a.mp3",
 "여우가 왔어요!": "audio/tc/fox_crane/nar_d5d54c8848.mp3",
 "오리가 왔어요!": "audio/tc/fox_crane/nar_b99ea3c684.mp3",
 "나비가 왔어요!": "audio/tc/fox_crane/nar_bf200e025d.mp3",
 "납작 접시예요! 반짝이는 걸 눌러 봐요!": "audio/tc/fox_crane/nar_9b79705905.mp3",
 "긴 병이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/fox_crane/nar_2f76875efb.mp3",
 "넓은 그릇이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/fox_crane/nar_e22ff71652.mp3",
 "꽃이에요! 반짝이는 걸 눌러 봐요!": "audio/tc/fox_crane/nar_7e9dcbddc2.mp3",
 "맞아요! 두루미는 긴 병이 좋아요.": "audio/tc/fox_crane/nar_aaa421f99b.mp3",
 "맞아요! 여우는 납작 접시가 좋아요.": "audio/tc/fox_crane/nar_13b8f37c70.mp3",
 "맞아요! 오리는 넓은 그릇이 좋아요.": "audio/tc/fox_crane/nar_2055cc6787.mp3",
 "맞아요! 나비는 꽃이 좋아요.": "audio/tc/fox_crane/nar_be37627afd.mp3",
 "등불이 반짝, 모두 모여 잔치를 해요.": "audio/tc/fox_crane/nar_d778e181d1.mp3",
 "여우가 말했어요. \"두루미야, 미안해.\"": [
  "audio/tc/fox_crane/nar_08f48452e1.mp3",
  "audio/tc/fox_crane/fox_56c053d31e.mp3"
 ],
 "두루미도 말했어요. \"여우야, 나도 미안해.\"": [
  "audio/tc/fox_crane/nar_6eed0f68e9.mp3",
  "audio/tc/fox_crane/crane_ff20ff2669.mp3"
 ],
 "\"괜찮아!\" 둘은 다시 사이좋은 친구가 되었어요.": [
  "audio/tc/fox_crane/fox_868f5964b8.mp3",
  "audio/tc/fox_crane/crane_cd04363c3e.mp3",
  "audio/tc/fox_crane/nar_aa374990fa.mp3"
 ],
 "친구들을 톡톡 눌러 봐요. 냠냠 맛있게 먹어요!": "audio/tc/fox_crane/nar_677967272e.mp3",
 "배부르게 먹고, 모두 행복하게 웃었답니다.": "audio/tc/fox_crane/nar_cacb047861.mp3"
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
