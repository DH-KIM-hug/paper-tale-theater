/* sunmoon — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "옛날 옛날 산골 오막살이에 엄마와 오누이가 살았어요.": "audio/tc/sunmoon/nar_f9d21c0ab1.mp3",
 "엄마가 일하러 가요. 오누이를 톡 눌러서 인사해요!": "audio/tc/sunmoon/nar_60a580942f.mp3",
 "오빠랑 동생을 톡 눌러서 \"다녀오세요!\" 해 봐요!": "audio/tc/sunmoon/nar_9b89e0198b.mp3",
 "엄마가 말했어요. \"문 꼭 잠그고 엄마 기다려라~\"": [
  "audio/tc/sunmoon/nar_4f2a6855ad.mp3",
  "audio/tc/sunmoon/mom_0b99e2b28a.mp3"
 ],
 "엄마는 부잣집에서 하루 종일 부지런히 일했어요.": "audio/tc/sunmoon/nar_800500a51a.mp3",
 "\"수고했어요. 떡 가져가요!\" 떡을 톡톡 눌러서 바구니에 담아요!": [
  "audio/tc/sunmoon/rich_59aa3dbe24.mp3",
  "audio/tc/sunmoon/nar_99cd45a905.mp3"
 ],
 "떡을 톡톡 눌러서 바구니에 담아요!": "audio/tc/sunmoon/nar_99cd45a905.mp3",
 "떡을 바구니 가득 받았어요! \"우리 아이들이 좋아하겠다!\" 엄마는 서둘러 집으로 떠났어요.": [
  "audio/tc/sunmoon/nar_8f370cafaa.mp3",
  "audio/tc/sunmoon/mom_882e8db30f.mp3",
  "audio/tc/sunmoon/nar_6ed98503ee.mp3"
 ],
 "떡 접시를 골라 톡 눌러요!": "audio/tc/sunmoon/nar_9eaac492f4.mp3",
 "반짝이는 접시예요! 톡 눌러 봐요!": "audio/tc/sunmoon/nar_90ebd7b57a.mp3",
 "호랑이 말풍선의 떡이랑 똑같이 생긴 접시를 골라요!": "audio/tc/sunmoon/nar_c1b0dc185a.mp3",
 "바구니에 남은 떡이랑 똑같은 개수의 접시를 골라요!": "audio/tc/sunmoon/nar_87698268cf.mp3",
 "해가 뉘엿뉘엿 지고 있어요. 엄마가 첫째 고개를 넘어요.": "audio/tc/sunmoon/nar_f84a0f70bb.mp3",
 "하늘이 붉어졌어요. 엄마가 둘째 고개를 넘어요.": "audio/tc/sunmoon/nar_6740ce576e.mp3",
 "깜깜한 밤이 되었어요. 엄마가 셋째 고개를 넘어요.": "audio/tc/sunmoon/nar_a86d32e9b6.mp3",
 "\"어흥! 떡 한 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_de6c00047c.mp3",
 "호랑이가 떡 한 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_497674537f.mp3",
 "\"어흥! 떡 두 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_5e001f977b.mp3",
 "호랑이가 떡 두 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_4eaa895703.mp3",
 "\"어흥! 떡 세 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_9258884c61.mp3",
 "호랑이가 떡 세 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_c8c3213cf3.mp3",
 "\"어흥! 떡 네 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_20fadd2d29.mp3",
 "호랑이가 떡 네 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_2cdf1ffaa4.mp3",
 "\"어흥! 떡 다섯 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_b6805d2531.mp3",
 "호랑이가 떡 다섯 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_ca1f63013d.mp3",
 "\"어흥! 떡 여섯 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_1266c273ff.mp3",
 "호랑이가 떡 여섯 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_d28446d1d4.mp3",
 "\"어흥! 떡 일곱 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_72dddb0ba1.mp3",
 "호랑이가 떡 일곱 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_e42de823c7.mp3",
 "\"어흥! 떡 여덟 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_b450d6b1c5.mp3",
 "호랑이가 떡 여덟 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_34441a3df6.mp3",
 "\"어흥! 떡 아홉 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_3dceff651b.mp3",
 "호랑이가 떡 아홉 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_2e61e459a1.mp3",
 "\"어흥! 떡 열 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_d5c6ece186.mp3",
 "호랑이가 떡 열 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_b22658094a.mp3",
 "호랑이는 떡 한 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_6445e9b2b3.mp3",
 "호랑이는 떡 두 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_68ca48850c.mp3",
 "호랑이는 떡 세 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_7198d0ab6e.mp3",
 "호랑이는 떡 네 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_1a0ae71798.mp3",
 "호랑이는 떡 다섯 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_189f3aef00.mp3",
 "떡 한 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_0657743bdf.mp3",
 "떡 두 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_a93d70157c.mp3",
 "떡 세 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_792981d7cd.mp3",
 "떡 네 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_abc5431d22.mp3",
 "떡 다섯 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_0165532d64.mp3",
 "떡 여섯 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_dbeb483bca.mp3",
 "떡 일곱 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_b53d83ffbb.mp3",
 "떡 여덟 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_eab5f0eb8d.mp3",
 "떡 아홉 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_72db264999.mp3",
 "떡 열 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_8ac7b72156.mp3",
 "\"어흥! 남은 떡 몽땅 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_4d81ba953d.mp3",
 "바구니에 남은 떡은 몇 개일까요? 세어 보고 접시를 골라요!": "audio/tc/sunmoon/nar_e79fb703a3.mp3",
 "남은 떡을 몽땅 꿀꺽! 배가 빵빵해졌어요!": "audio/tc/sunmoon/nar_e66a0197f1.mp3",
 "떡이 다 떨어지자 호랑이가 말했어요. \"떡이 없으면 너를 잡아먹어야지!\"": [
  "audio/tc/sunmoon/nar_4085e30ede.mp3",
  "audio/tc/sunmoon/tiger_394ed1a791.mp3"
 ],
 "호랑이는 엄마를 꿀꺽 잡아먹고 말았어요.": "audio/tc/sunmoon/nar_aa0ba2c4b3.mp3",
 "호랑이는 엄마 옷을 입고, 오누이가 기다리는 집으로 갔어요.": "audio/tc/sunmoon/nar_a5803aac6d.mp3",
 "캄캄한 밤이 되었어요. 엄마는 아직 안 오셨어요.": "audio/tc/sunmoon/nar_456d1e2073.mp3",
 "등잔을 톡 눌러서 불을 켜 줄까요?": "audio/tc/sunmoon/nar_967c702a6c.mp3",
 "등잔을 톡 눌러서 불을 켜요!": "audio/tc/sunmoon/nar_51acbb67cc.mp3",
 "반짝! 방이 환해졌어요. 오누이는 창밖을 보며 엄마를 기다렸어요.": "audio/tc/sunmoon/nar_b909e06093.mp3",
 "똑똑똑. \"얘들아~ 엄마 왔다. 문 열어라~\" 걸걸한 목소리예요.": [
  "audio/tc/sunmoon/nar_b482ad8276.mp3",
  "audio/tc/sunmoon/tiger_086f98737b.mp3",
  "audio/tc/sunmoon/nar_2d96382ac0.mp3"
 ],
 "진짜 엄마 목소리를 톡 골라 봐요!": "audio/tc/sunmoon/nar_ca9b7c2e85.mp3",
 "반짝이는 쪽이 엄마 목소리예요!": "audio/tc/sunmoon/nar_81341dbd5e.mp3",
 "오빠가 말했어요. \"우리 엄마 목소리가 아니에요! 손을 보여 주세요!\"": [
  "audio/tc/sunmoon/nar_fe5a79f8cb.mp3",
  "audio/tc/sunmoon/boy_a05d514b6a.mp3"
 ],
 "진짜 엄마 손은 뭘까요? 잘 보고 골라 봐요!": "audio/tc/sunmoon/nar_715f122afa.mp3",
 "\"어? 털이 복슬복슬… 줄무늬도 있네!\"": "audio/tc/sunmoon/girl_da964bc11a.mp3",
 "\"어? 하얗긴 한데… 뾰족한 발톱이 있네!\"": "audio/tc/sunmoon/boy_f578e7f726.mp3",
 "진짜 엄마 손을 톡 골라 봐요!": "audio/tc/sunmoon/nar_1e946d2ce0.mp3",
 "엄마 손은 손가락이 길쭉하고 떡가루가 묻어 있어요.": "audio/tc/sunmoon/nar_75c96a6c0a.mp3",
 "반짝이는 손이 엄마 손이에요!": "audio/tc/sunmoon/nar_4bf6188087.mp3",
 "맞아요! 엄마 손은 부드럽고 떡가루가 묻어 있지요.": "audio/tc/sunmoon/nar_925565b7df.mp3",
 "그런데 문틈으로 들어온 손은… 하얀 밀가루 사이로 발톱이 쏙! 엄마 손이 아니에요!": "audio/tc/sunmoon/nar_bbd0d77f62.mp3",
 "문밖에 누가 있는지 보고 싶어요. 창호지를 손가락으로 콕 뚫어 볼까요?": "audio/tc/sunmoon/nar_90fd292063.mp3",
 "창호지를 톡 눌러서 콕 뚫어 봐요!": "audio/tc/sunmoon/nar_05ccc0c1bd.mp3",
 "구멍 너머에 커다랗고 동그란 눈이 깜빡깜빡! 호랑이예요!": "audio/tc/sunmoon/nar_1fb757d63d.mp3",
 "오빠가 속삭였어요. \"쉿, 뒷문으로 살금살금 도망가자!\"": [
  "audio/tc/sunmoon/nar_a28d40f149.mp3",
  "audio/tc/sunmoon/boy_bcbacf4819.mp3"
 ],
 "오누이는 뒷문으로 살금살금 나왔어요. 화면을 쓱 밀어서 달려요!": "audio/tc/sunmoon/nar_88982e5aab.mp3",
 "화면을 옆으로 쓱 밀어서 달려요!": "audio/tc/sunmoon/nar_ca9f18b6b4.mp3",
 "앗, 호랑이가 오는 소리! 커다란 장독을 톡 눌러서 숨어요!": "audio/tc/sunmoon/nar_c5999fb6c8.mp3",
 "커다란 장독을 톡 눌러서 숨어요!": "audio/tc/sunmoon/nar_e29264e98b.mp3",
 "\"얘들아~ 어디 갔니?\" 호랑이는 두리번두리번하다가 집 쪽으로 돌아갔어요.": [
  "audio/tc/sunmoon/tiger_5e653e65ad.mp3",
  "audio/tc/sunmoon/nar_a95b2d0a5e.mp3"
 ],
 "휴~ 이제 우물가 큰 나무로 달려가요! 쓱쓱!": "audio/tc/sunmoon/nar_48695a56e2.mp3",
 "우물가에 커다란 나무가 있어요. 톡톡 눌러서 영차영차 올라가요!": "audio/tc/sunmoon/nar_1cc350bb90.mp3",
 "화면을 톡톡 눌러서 나무를 올라가요!": "audio/tc/sunmoon/nar_c34fbda67b.mp3",
 "오누이는 나무 꼭대기까지 올라갔어요!": "audio/tc/sunmoon/nar_842517c00e.mp3",
 "호랑이가 뒷마당에 왔어요. \"옳지! 우물 속에 숨었구나!\"": [
  "audio/tc/sunmoon/nar_0dc4b313f0.mp3",
  "audio/tc/sunmoon/tiger_3a747efa5f.mp3"
 ],
 "호랑이가 우물 속을 들여다봤어요. 우물 물에 오누이 얼굴이 비쳤거든요!": "audio/tc/sunmoon/nar_38f028be6e.mp3",
 "\"두레박으로 건져야지~\" 영차!": "audio/tc/sunmoon/tiger_7c09aa25c8.mp3",
 "첨벙! 두레박에는 물만 가득. 우물 속 오누이 얼굴을 톡 눌러 봐요!": "audio/tc/sunmoon/nar_5ba7f52945.mp3",
 "우물에 비친 오누이 얼굴을 톡!": "audio/tc/sunmoon/nar_b1abceace1.mp3",
 "나무 위에서 오누이가 그만 킥킥 웃고 말았어요.": "audio/tc/sunmoon/nar_8d3ebc1fa2.mp3",
 "\"어? 위에서 웃음소리가?\" 호랑이가 고개를 번쩍 들었어요.": [
  "audio/tc/sunmoon/tiger_aaffb18e1c.mp3",
  "audio/tc/sunmoon/nar_498d0ab58b.mp3"
 ],
 "호랑이가 올려다보며 물었어요. \"얘들아, 거기 어떻게 올라갔니?\"": [
  "audio/tc/sunmoon/nar_68a702a492.mp3",
  "audio/tc/sunmoon/tiger_d8f71059c4.mp3"
 ],
 "오빠가 꾀를 냈어요. \"참기름 바르고 올라왔지!\"": [
  "audio/tc/sunmoon/nar_2a857d598f.mp3",
  "audio/tc/sunmoon/boy_720528487f.mp3"
 ],
 "참기름 병을 톡 눌러서 나무에 발라 줘요!": "audio/tc/sunmoon/nar_c548902bda.mp3",
 "참기름 병을 톡!": "audio/tc/sunmoon/nar_e0764d1adf.mp3",
 "미끌 쭈르륵! 호랑이는 자꾸자꾸 미끄러졌어요.": "audio/tc/sunmoon/nar_a0b8e89835.mp3",
 "그때 동생이 깔깔 웃으며 말해 버렸어요. \"도끼로 콕콕 찍고 올라왔지~\"": [
  "audio/tc/sunmoon/nar_69aae4a0ce.mp3",
  "audio/tc/sunmoon/girl_2bb45007c9.mp3"
 ],
 "오빠가 \"쉿!\" 했지만… 벌써 들어 버렸어요!": [
  "audio/tc/sunmoon/nar_77d8a6ef58.mp3",
  "audio/tc/sunmoon/boy_b2abcfda0c.mp3",
  "audio/tc/sunmoon/nar_a9c2e6342a.mp3"
 ],
 "호랑이가 도끼로 콕콕 찍으며 올라와요! 오누이는 덜덜 떨었어요.": "audio/tc/sunmoon/nar_edb07aeae3.mp3",
 "호랑이가 점점 가까이 올라와요. 오누이는 두 손을 모았어요.": "audio/tc/sunmoon/nar_a7885e68d4.mp3",
 "\"하늘님, 튼튼한 동아줄을 내려 주세요!\"": "audio/tc/sunmoon/boy_5a1e304709.mp3",
 "하늘에서 줄이 두 개 내려왔어요! 어떤 줄을 잡을까요?": "audio/tc/sunmoon/nar_924f07ffb8.mp3",
 "삐걱… 이 줄은 낡았어!": [
  "audio/tc/sunmoon/nar_28ad099ba7.mp3",
  "audio/tc/sunmoon/boy_6cc7ce65b4.mp3"
 ],
 "굵고 반짝이는 튼튼한 줄을 톡 골라요!": "audio/tc/sunmoon/nar_71017c91ac.mp3",
 "굵고 반짝반짝 튼튼한 줄을 찾아봐요!": "audio/tc/sunmoon/nar_c7b8adec14.mp3",
 "반짝이는 굵은 줄이 튼튼한 동아줄이에요!": "audio/tc/sunmoon/nar_7cdddd01c8.mp3",
 "맞아요! 굵고 반짝이는 새 동아줄이에요.": "audio/tc/sunmoon/nar_3e168d4413.mp3",
 "줄을 꼭 잡고, 화면을 위로 쓱쓱 밀어서 올라가요!": "audio/tc/sunmoon/nar_1c080fdfc2.mp3",
 "화면을 위로 쓱 밀어서 올라가요!": "audio/tc/sunmoon/nar_c997237e2c.mp3",
 "구름을 뚫고 쑥쑥!": "audio/tc/sunmoon/nar_01b7a76d61.mp3",
 "구름을 여섯 겹이나 뚫고, 오누이는 하늘 나라에 닿았어요!": "audio/tc/sunmoon/nar_81bdf7ab79.mp3",
 "호랑이도 하늘에 빌었어요. 그랬더니 낡은 줄이 스르르 내려왔어요.": "audio/tc/sunmoon/nar_9f2742de19.mp3",
 "\"아이코 내 엉덩이! 아이코 내 머리!\" 호랑이 머리에 동그란 혹이 났어요.": [
  "audio/tc/sunmoon/tiger_4a770e620e.mp3",
  "audio/tc/sunmoon/nar_4d7c7e09ce.mp3"
 ],
 "호랑이는 혹을 달고 산속으로 줄행랑! 다시는 오지 않았대요.": "audio/tc/sunmoon/nar_f03785f7bf.mp3",
 "하늘 나라에 간 오빠는 해님이, 동생은 달님이 되었어요.": "audio/tc/sunmoon/nar_29f7f0c6ee.mp3",
 "동생이 말했어요. \"오빠, 나는 밤이 무서워요.\"": [
  "audio/tc/sunmoon/nar_6068e7963e.mp3",
  "audio/tc/sunmoon/girl_853b5ea414.mp3"
 ],
 "\"그럼 우리 바꾸자!\"": "audio/tc/sunmoon/boy_7f0c58c5fe.mp3",
 "그래서 동생은 해님, 오빠는 달님이 되었답니다.": "audio/tc/sunmoon/nar_be8f751331.mp3",
 "해님이나 달님을 톡 눌러 봐요! 낮이 되고, 밤이 돼요.": "audio/tc/sunmoon/nar_39cc0a2a89.mp3",
 "해님 달님은 오늘도 하늘에서 우리를 환하게 비춰 준답니다.": "audio/tc/sunmoon/nar_ede980f623.mp3",
 "두 목소리를 들어 봐요. 하나는 진짜 엄마, 하나는 가짜예요.": "audio/tc/sunmoon/nar_58ba14b2a1.mp3",
 "1번 목소리.": "audio/tc/sunmoon/nar_8c76005af4.mp3",
 "2번 목소리.": "audio/tc/sunmoon/nar_553e9ccb9f.mp3",
 "진짜 엄마 목소리는 몇 번일까요?": "audio/tc/sunmoon/nar_cc727386e6.mp3",
 "진짜 엄마 목소리를 톡 골라 봐요! 다시 들으려면 한 번 더 눌러요.": "audio/tc/sunmoon/nar_43f946cb2a.mp3",
 "\"어흥~\" 이건 호랑이가 흉내 낸 목소리예요!": "audio/tc/sunmoon/nar_04c35a0137.mp3",
 "엄마 목소리는 다정하고 부드러웠어요. 다시 들어 봐요.": "audio/tc/sunmoon/nar_362a506860.mp3",
 "맞아요! 진짜 엄마 목소리예요. 그런데 문밖 목소리는 걸걸했지요?": "audio/tc/sunmoon/nar_f0cbf034b9.mp3"
};
const VOICE_LINES = {
 "cut_roar": "audio/tc/sunmoon/tiger_a145a17ea4.mp3",
 "cut_mimic": "audio/tc/sunmoon/tiger_44463ef0a1.mp3",
 "cut_creak": "audio/tc/sunmoon/tiger_25dd1b59a7.mp3",
 "cut_snap": "audio/tc/sunmoon/tiger_2a130f02ea.mp3",
 "cut_bump": "audio/tc/sunmoon/tiger_a101d2710c.mp3",
 "call_mom": "audio/tc/sunmoon/mom_ecc4e2f8df.mp3",
 "call_tiger": "audio/tc/sunmoon/tiger_086f98737b.mp3"
};
