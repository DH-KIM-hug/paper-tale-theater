/* sunmoon — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "옛날 옛날 산골 오막살이에 엄마와 오누이가 살았어요.": "audio/tc/sunmoon/nar_e0be848b00.mp3",
 "엄마가 일하러 가요. 오누이를 톡 눌러서 인사해요!": "audio/tc/sunmoon/nar_96cf78d946.mp3",
 "오빠랑 동생을 톡 눌러서 \"다녀오세요!\" 해 봐요!": "audio/tc/sunmoon/nar_21abf076a0.mp3",
 "엄마가 말했어요. \"문 꼭 잠그고 엄마 기다려라~\"": [
  "audio/tc/sunmoon/nar_b22e7bd742.mp3",
  "audio/tc/sunmoon/mom_23d5c938e7.mp3"
 ],
 "엄마는 부잣집에서 하루 종일 부지런히 일했어요.": "audio/tc/sunmoon/nar_3332c7f5da.mp3",
 "\"수고했어요. 떡 가져가요!\" 떡을 톡톡 눌러서 바구니에 담아요!": [
  "audio/tc/sunmoon/rich_052d6a8287.mp3",
  "audio/tc/sunmoon/nar_da809a86dd.mp3"
 ],
 "떡을 톡톡 눌러서 바구니에 담아요!": "audio/tc/sunmoon/nar_da809a86dd.mp3",
 "떡을 바구니 가득 받았어요! \"우리 아이들이 좋아하겠다!\" 엄마는 서둘러 집으로 떠났어요.": [
  "audio/tc/sunmoon/nar_c811cbe7ad.mp3",
  "audio/tc/sunmoon/mom_bfaea138ed.mp3",
  "audio/tc/sunmoon/nar_3d5f2816ad.mp3"
 ],
 "떡 접시를 골라 톡 눌러요!": "audio/tc/sunmoon/nar_a81828376d.mp3",
 "반짝이는 접시예요! 톡 눌러 봐요!": "audio/tc/sunmoon/nar_7871496eef.mp3",
 "호랑이 말풍선의 떡이랑 똑같이 생긴 접시를 골라요!": "audio/tc/sunmoon/nar_bbf91259b6.mp3",
 "바구니에 남은 떡이랑 똑같은 개수의 접시를 골라요!": "audio/tc/sunmoon/nar_79e2ede9f3.mp3",
 "해가 뉘엿뉘엿 지고 있어요. 엄마가 첫째 고개를 넘어요.": "audio/tc/sunmoon/nar_70a95e75fb.mp3",
 "하늘이 붉어졌어요. 엄마가 둘째 고개를 넘어요.": "audio/tc/sunmoon/nar_0ca929c00a.mp3",
 "깜깜한 밤이 되었어요. 엄마가 셋째 고개를 넘어요.": "audio/tc/sunmoon/nar_ecc3c017cf.mp3",
 "\"어흥! 떡 한 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_f60e011458.mp3",
 "호랑이가 떡 한 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_98ff144975.mp3",
 "\"어흥! 떡 두 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_44ed269b5a.mp3",
 "호랑이가 떡 두 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_762e347944.mp3",
 "\"어흥! 떡 세 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_4118038e6c.mp3",
 "호랑이가 떡 세 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_a7d57723e0.mp3",
 "\"어흥! 떡 네 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_f64e9cf108.mp3",
 "호랑이가 떡 네 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_2e7186869e.mp3",
 "\"어흥! 떡 다섯 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_ae4daec785.mp3",
 "호랑이가 떡 다섯 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_4e68a80cec.mp3",
 "\"어흥! 떡 여섯 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_114846ce8e.mp3",
 "호랑이가 떡 여섯 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_53dde56b88.mp3",
 "\"어흥! 떡 일곱 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_fa7087db7c.mp3",
 "호랑이가 떡 일곱 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_3b0ce0ffab.mp3",
 "\"어흥! 떡 여덟 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_64c7fae02f.mp3",
 "호랑이가 떡 여덟 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_4c36134552.mp3",
 "\"어흥! 떡 아홉 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_ed20ed1cae.mp3",
 "호랑이가 떡 아홉 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_0ce05fc29d.mp3",
 "\"어흥! 떡 열 개 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_2cc4b11efe.mp3",
 "호랑이가 떡 열 개를 달래요. 어느 접시를 줄까요?": "audio/tc/sunmoon/nar_461f527081.mp3",
 "호랑이는 떡 한 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_706598b69a.mp3",
 "호랑이는 떡 두 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_c5ef7a2b0a.mp3",
 "호랑이는 떡 세 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_070a957858.mp3",
 "호랑이는 떡 네 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_5a9df187fe.mp3",
 "호랑이는 떡 다섯 개를 꿀꺽! 배가 볼록해졌어요.": "audio/tc/sunmoon/nar_781682bbf3.mp3",
 "떡 한 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_2983b2838c.mp3",
 "떡 두 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_8c9428417d.mp3",
 "떡 세 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_1551161ae3.mp3",
 "떡 네 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_518e36e85f.mp3",
 "떡 다섯 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_9308bf5cfe.mp3",
 "떡 여섯 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_a234f5a226.mp3",
 "떡 일곱 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_54fd265d05.mp3",
 "떡 여덟 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_42ceba28e0.mp3",
 "떡 아홉 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_59af2b5d73.mp3",
 "떡 열 개를 또 꿀꺽! 배가 더 볼록해졌어요.": "audio/tc/sunmoon/nar_0947cc6477.mp3",
 "\"어흥! 남은 떡 몽땅 주면 안 잡아먹지!\"": "audio/tc/sunmoon/tiger_ffad144f40.mp3",
 "바구니에 남은 떡은 몇 개일까요? 세어 보고 접시를 골라요!": "audio/tc/sunmoon/nar_eaca4f4a46.mp3",
 "남은 떡을 몽땅 꿀꺽! 배가 빵빵해졌어요!": "audio/tc/sunmoon/nar_4d2ee08032.mp3",
 "떡이 다 떨어지자 호랑이가 말했어요. \"떡이 없으면 너를 잡아먹어야지!\"": [
  "audio/tc/sunmoon/nar_d698bfc988.mp3",
  "audio/tc/sunmoon/tiger_e220d5744e.mp3"
 ],
 "호랑이는 엄마를 꿀꺽 잡아먹고 말았어요.": "audio/tc/sunmoon/nar_8a7a623c8a.mp3",
 "호랑이는 엄마 옷을 입고, 오누이가 기다리는 집으로 갔어요.": "audio/tc/sunmoon/nar_fbb8c3d97c.mp3",
 "캄캄한 밤이 되었어요. 엄마는 아직 안 오셨어요.": "audio/tc/sunmoon/nar_906993be3d.mp3",
 "등잔을 톡 눌러서 불을 켜 줄까요?": "audio/tc/sunmoon/nar_58b04662ac.mp3",
 "등잔을 톡 눌러서 불을 켜요!": "audio/tc/sunmoon/nar_4de21a01b9.mp3",
 "반짝! 방이 환해졌어요. 오누이는 창밖을 보며 엄마를 기다렸어요.": "audio/tc/sunmoon/nar_24d82244c9.mp3",
 "똑똑똑. \"얘들아~ 엄마 왔다. 문 열어라~\" 걸걸한 목소리예요.": [
  "audio/tc/sunmoon/nar_cd793c5920.mp3",
  "audio/tc/sunmoon/tiger_87f9570420.mp3",
  "audio/tc/sunmoon/nar_18e0a7ea37.mp3"
 ],
 "엄마 목소리는 어땠지? 두 소리를 들어 봐요.": "audio/tc/sunmoon/nar_d179bed64b.mp3",
 "이건 부드러운 소리.": "audio/tc/sunmoon/nar_5a3c1ca070.mp3",
 "이건 걸걸한 소리.": "audio/tc/sunmoon/nar_3cef90766d.mp3",
 "진짜 엄마 목소리는 어느 쪽일까요?": "audio/tc/sunmoon/nar_331a6489cf.mp3",
 "\"어흥~\" 이건 걸걸한 목소리예요!": [
  "audio/tc/sunmoon/tiger_d488e93c23.mp3",
  "audio/tc/sunmoon/nar_7cc76dde50.mp3"
 ],
 "진짜 엄마 목소리를 톡 골라 봐요!": "audio/tc/sunmoon/nar_56d29180f3.mp3",
 "엄마 목소리는 노래처럼 부드러웠어요.": "audio/tc/sunmoon/nar_eacc422708.mp3",
 "반짝이는 쪽이 엄마 목소리예요!": "audio/tc/sunmoon/nar_5bd38cab18.mp3",
 "맞아요! 엄마 목소리는 부드러워요. 그런데 문밖 목소리는 걸걸했지요?": "audio/tc/sunmoon/nar_be161f6f50.mp3",
 "오빠가 말했어요. \"우리 엄마 목소리가 아니에요! 손을 보여 주세요!\"": [
  "audio/tc/sunmoon/nar_d5f5fabe9f.mp3",
  "audio/tc/sunmoon/boy_166ea0774c.mp3"
 ],
 "진짜 엄마 손은 뭘까요? 잘 보고 골라 봐요!": "audio/tc/sunmoon/nar_73269ea4e3.mp3",
 "\"어? 털이 복슬복슬… 줄무늬도 있네!\"": "audio/tc/sunmoon/girl_2b1c87c00d.mp3",
 "\"어? 하얗긴 한데… 뾰족한 발톱이 있네!\"": "audio/tc/sunmoon/boy_d2613f12d6.mp3",
 "진짜 엄마 손을 톡 골라 봐요!": "audio/tc/sunmoon/nar_813c532075.mp3",
 "엄마 손은 손가락이 길쭉하고 떡가루가 묻어 있어요.": "audio/tc/sunmoon/nar_d6a12c0f01.mp3",
 "반짝이는 손이 엄마 손이에요!": "audio/tc/sunmoon/nar_5c95888775.mp3",
 "맞아요! 엄마 손은 부드럽고 떡가루가 묻어 있지요.": "audio/tc/sunmoon/nar_67858286fb.mp3",
 "그런데 문틈으로 들어온 손은… 하얀 밀가루 사이로 발톱이 쏙! 엄마 손이 아니에요!": "audio/tc/sunmoon/nar_14e110c854.mp3",
 "문밖에 누가 있는지 보고 싶어요. 창호지를 손가락으로 콕 뚫어 볼까요?": "audio/tc/sunmoon/nar_7013d0a2f1.mp3",
 "창호지를 톡 눌러서 콕 뚫어 봐요!": "audio/tc/sunmoon/nar_842f7fe7d4.mp3",
 "구멍 너머에 커다랗고 동그란 눈이 깜빡깜빡! 호랑이예요!": "audio/tc/sunmoon/nar_0f585a2941.mp3",
 "오빠가 속삭였어요. \"쉿, 뒷문으로 살금살금 도망가자!\"": [
  "audio/tc/sunmoon/nar_5607668866.mp3",
  "audio/tc/sunmoon/boy_0e2be04294.mp3"
 ],
 "오누이는 뒷문으로 살금살금 나왔어요. 화면을 쓱 밀어서 달려요!": "audio/tc/sunmoon/nar_deaddb2920.mp3",
 "화면을 옆으로 쓱 밀어서 달려요!": "audio/tc/sunmoon/nar_e475aff68a.mp3",
 "앗, 호랑이가 오는 소리! 커다란 장독을 톡 눌러서 숨어요!": "audio/tc/sunmoon/nar_f980adc12b.mp3",
 "커다란 장독을 톡 눌러서 숨어요!": "audio/tc/sunmoon/nar_d72f977319.mp3",
 "\"얘들아~ 어디 갔니?\" 호랑이는 두리번두리번하다가 집 쪽으로 돌아갔어요.": [
  "audio/tc/sunmoon/tiger_9d71a2bbf2.mp3",
  "audio/tc/sunmoon/nar_f1edba49da.mp3"
 ],
 "휴~ 이제 우물가 큰 나무로 달려가요! 쓱쓱!": "audio/tc/sunmoon/nar_d7510988a2.mp3",
 "우물가에 커다란 나무가 있어요. 톡톡 눌러서 영차영차 올라가요!": "audio/tc/sunmoon/nar_0ca59136e7.mp3",
 "화면을 톡톡 눌러서 나무를 올라가요!": "audio/tc/sunmoon/nar_d1ea032d47.mp3",
 "오누이는 나무 꼭대기까지 올라갔어요!": "audio/tc/sunmoon/nar_cefcf01ae5.mp3",
 "호랑이가 뒷마당에 왔어요. \"옳지! 우물 속에 숨었구나!\"": [
  "audio/tc/sunmoon/nar_50517ca01a.mp3",
  "audio/tc/sunmoon/tiger_2a41d4bfe4.mp3"
 ],
 "호랑이가 우물 속을 들여다봤어요. 우물 물에 오누이 얼굴이 비쳤거든요!": "audio/tc/sunmoon/nar_fe1fbfb5a8.mp3",
 "\"두레박으로 건져야지~\" 영차!": "audio/tc/sunmoon/tiger_f4049b9c0f.mp3",
 "첨벙! 두레박에는 물만 가득. 우물 속 오누이 얼굴을 톡 눌러 봐요!": "audio/tc/sunmoon/nar_c1f9d9c187.mp3",
 "우물에 비친 오누이 얼굴을 톡!": "audio/tc/sunmoon/nar_148d82762b.mp3",
 "나무 위에서 오누이가 그만 킥킥 웃고 말았어요.": "audio/tc/sunmoon/nar_074838dadc.mp3",
 "\"어? 위에서 웃음소리가?\" 호랑이가 고개를 번쩍 들었어요.": [
  "audio/tc/sunmoon/tiger_345ed46a94.mp3",
  "audio/tc/sunmoon/nar_f89c705abf.mp3"
 ],
 "호랑이가 올려다보며 물었어요. \"얘들아, 거기 어떻게 올라갔니?\"": [
  "audio/tc/sunmoon/nar_0a7d0beda5.mp3",
  "audio/tc/sunmoon/tiger_6d80c8f8a0.mp3"
 ],
 "오빠가 꾀를 냈어요. \"참기름 바르고 올라왔지!\"": [
  "audio/tc/sunmoon/nar_87bacb1d79.mp3",
  "audio/tc/sunmoon/boy_e51ed67001.mp3"
 ],
 "참기름 병을 톡 눌러서 나무에 발라 줘요!": "audio/tc/sunmoon/nar_0c5acdd6b9.mp3",
 "참기름 병을 톡!": "audio/tc/sunmoon/nar_5d50468a42.mp3",
 "미끌 쭈르륵! 호랑이는 자꾸자꾸 미끄러졌어요.": "audio/tc/sunmoon/nar_047b602d80.mp3",
 "그때 동생이 깔깔 웃으며 말해 버렸어요. \"도끼로 콕콕 찍고 올라왔지~\"": [
  "audio/tc/sunmoon/nar_211fc5a4d7.mp3",
  "audio/tc/sunmoon/girl_e21fb8c549.mp3"
 ],
 "오빠가 \"쉿!\" 했지만… 벌써 들어 버렸어요!": [
  "audio/tc/sunmoon/nar_5119617d8f.mp3",
  "audio/tc/sunmoon/boy_3cdec77df7.mp3",
  "audio/tc/sunmoon/nar_63b537433e.mp3"
 ],
 "호랑이가 도끼로 콕콕 찍으며 올라와요! 오누이는 덜덜 떨었어요.": "audio/tc/sunmoon/nar_64e196adcd.mp3",
 "호랑이가 점점 가까이 올라와요. 오누이는 두 손을 모았어요.": "audio/tc/sunmoon/nar_d85b9bac35.mp3",
 "\"하늘님, 튼튼한 동아줄을 내려 주세요!\"": "audio/tc/sunmoon/boy_f481c7e5a0.mp3",
 "하늘에서 줄이 두 개 내려왔어요! 어떤 줄을 잡을까요?": "audio/tc/sunmoon/nar_aad08121dc.mp3",
 "삐걱… 이 줄은 낡았어!": [
  "audio/tc/sunmoon/nar_4a6873c709.mp3",
  "audio/tc/sunmoon/boy_ae74840d8f.mp3"
 ],
 "굵고 반짝이는 튼튼한 줄을 톡 골라요!": "audio/tc/sunmoon/nar_b428e11f29.mp3",
 "굵고 반짝반짝 튼튼한 줄을 찾아봐요!": "audio/tc/sunmoon/nar_28c6aecf0c.mp3",
 "반짝이는 굵은 줄이 튼튼한 동아줄이에요!": "audio/tc/sunmoon/nar_dc93da0d83.mp3",
 "맞아요! 굵고 반짝이는 새 동아줄이에요.": "audio/tc/sunmoon/nar_236ec73227.mp3",
 "줄을 꼭 잡고, 화면을 위로 쓱쓱 밀어서 올라가요!": "audio/tc/sunmoon/nar_823d561120.mp3",
 "화면을 위로 쓱 밀어서 올라가요!": "audio/tc/sunmoon/nar_f2e8e19258.mp3",
 "구름을 뚫고 쑥쑥!": "audio/tc/sunmoon/nar_c97fd01801.mp3",
 "구름을 여섯 겹이나 뚫고, 오누이는 하늘 나라에 닿았어요!": "audio/tc/sunmoon/nar_6b06ac1117.mp3",
 "호랑이도 하늘에 빌었어요. 그랬더니 낡은 줄이 스르르 내려왔어요.": "audio/tc/sunmoon/nar_3d243debeb.mp3",
 "\"아이코 내 엉덩이! 아이코 내 머리!\" 호랑이 머리에 동그란 혹이 났어요.": [
  "audio/tc/sunmoon/tiger_893dc6c642.mp3",
  "audio/tc/sunmoon/nar_a5953c6d5a.mp3"
 ],
 "호랑이는 혹을 달고 산속으로 줄행랑! 다시는 오지 않았대요.": "audio/tc/sunmoon/nar_3a42ba58e9.mp3",
 "하늘 나라에 간 오빠는 해님이, 동생은 달님이 되었어요.": "audio/tc/sunmoon/nar_689af25f73.mp3",
 "동생이 말했어요. \"오빠, 나는 밤이 무서워요.\"": [
  "audio/tc/sunmoon/nar_849cf112a6.mp3",
  "audio/tc/sunmoon/girl_4b1c648f34.mp3"
 ],
 "\"그럼 우리 바꾸자!\"": "audio/tc/sunmoon/boy_c43c5e575b.mp3",
 "그래서 동생은 해님, 오빠는 달님이 되었답니다.": "audio/tc/sunmoon/nar_6addd44765.mp3",
 "해님이나 달님을 톡 눌러 봐요! 낮이 되고, 밤이 돼요.": "audio/tc/sunmoon/nar_c7e87f2f9b.mp3",
 "해님 달님은 오늘도 하늘에서 우리를 환하게 비춰 준답니다.": "audio/tc/sunmoon/nar_d29cacb72c.mp3"
};
const VOICE_LINES = {
 "cut_roar": "audio/tc/sunmoon/tiger_7935769933.mp3",
 "cut_mimic": "audio/tc/sunmoon/tiger_60b27c13ee.mp3",
 "cut_creak": "audio/tc/sunmoon/tiger_793ff85e23.mp3",
 "cut_snap": "audio/tc/sunmoon/tiger_48752c325b.mp3",
 "cut_bump": "audio/tc/sunmoon/tiger_c34d22e6d8.mp3"
};
