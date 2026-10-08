/* magic_jar — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "옛날 옛날에 마음씨 착한 농부가 살았어요.": "audio/tc/magic_jar/nar_0b4b0ccaa5.mp3",
 "농부는 밭을 열심히 갈았어요. 농부를 톡톡톡 눌러서 밭을 갈아 봐요!": "audio/tc/magic_jar/nar_919ff1692a.mp3",
 "농부를 톡톡톡! 괭이질을 해요.": "audio/tc/magic_jar/nar_4d15208e34.mp3",
 "쨍! 괭이 끝에 뭔가 딱딱한 게 닿았어요.": "audio/tc/magic_jar/nar_950faa6b0c.mp3",
 "땅속에서 둥근 뚜껑이 보여요. 농부를 톡톡톡 눌러서 힘껏 당겨 봐요!": "audio/tc/magic_jar/nar_8ba167efb1.mp3",
 "농부를 톡톡톡! 영차 당겨요.": "audio/tc/magic_jar/nar_7de6599502.mp3",
 "쑥! 커다란 항아리가 나왔어요. 농부는 눈이 동그래졌어요.": "audio/tc/magic_jar/nar_9acb047152.mp3",
 "농부는 항아리를 집 마당에 놓았어요. 아내도 구경하러 나왔어요.": "audio/tc/magic_jar/nar_fe161ea145.mp3",
 "농부가 괭이를 항아리 옆에 두려다 그만 항아리 속에 떨어뜨렸어요. 괭이를 톡!": "audio/tc/magic_jar/nar_b2cb7cfdcf.mp3",
 "괭이를 톡! 항아리에 넣어요.": "audio/tc/magic_jar/nar_27d29bab8a.mp3",
 "\"어머나! 괭이가 두 개가 되었어요!\" 아내가 깜짝 놀랐어요.": [
  "audio/tc/magic_jar/wife_78dd048b4b.mp3",
  "audio/tc/magic_jar/nar_4bedfc5342.mp3"
 ],
 "항아리를 톡톡톡 눌러서 괭이가 몇 개 나오는지 세어 봐요!": "audio/tc/magic_jar/nar_5bb60ac9ba.mp3",
 "항아리를 톡톡톡! 괭이를 세어 봐요.": "audio/tc/magic_jar/nar_c2039313e4.mp3",
 "괭이가 하나, 둘, 셋! 농부와 아내는 손뼉을 쳤어요.": "audio/tc/magic_jar/nar_048410cd1f.mp3",
 "이번에는 엽전 하나를 넣어 봤어요. 와르르! 엽전이 쏟아져 나왔어요.": "audio/tc/magic_jar/nar_ce3345ba25.mp3",
 "항아리를 톡톡톡톡톡 눌러서 엽전을 다섯 개 세어 봐요!": "audio/tc/magic_jar/nar_668532fe9c.mp3",
 "항아리를 톡톡톡톡톡! 엽전을 세어 봐요.": "audio/tc/magic_jar/nar_6009801f15.mp3",
 "엽전이 하나, 둘, 셋, 넷, 다섯! 이제 쌀도 사고 옷도 살 수 있어요.": "audio/tc/magic_jar/nar_033da4e5f7.mp3",
 "착한 농부는 혼자만 쓰지 않았어요. 이웃 다섯 집에 쌀을 나눠 주러 갔어요.": "audio/tc/magic_jar/nar_e92daaa39d.mp3",
 "집을 톡! 쌀을 나눠 줘요.": "audio/tc/magic_jar/nar_aca8c27fc3.mp3",
 "다섯 집 모두 쌀을 받고 활짝 웃었어요. 마을이 함께 행복해졌어요.": "audio/tc/magic_jar/nar_08c2eb373b.mp3",
 "소문을 들은 부잣집 주인이 농부를 불렀어요. \"그 항아리를 나한테 빌려주게!\"": [
  "audio/tc/magic_jar/nar_f13c997a7a.mp3",
  "audio/tc/magic_jar/rich_0297536c5c.mp3"
 ],
 "마음씨 착한 농부는 웃으며 말했어요. \"필요하시면 쓰세요. 잘 쓰고 돌려주세요!\" 항아리를 톡!": [
  "audio/tc/magic_jar/nar_3414ecdd3b.mp3",
  "audio/tc/magic_jar/farmer_8b6c9a028a.mp3",
  "audio/tc/magic_jar/nar_c1d8fd3261.mp3"
 ],
 "항아리를 톡! 부자에게 빌려줘요.": "audio/tc/magic_jar/nar_8770f135f0.mp3",
 "\"고맙네! 얼른 가져가야지, 헤헤.\" 부자는 항아리를 꼭 안고 달려갔어요.": [
  "audio/tc/magic_jar/rich_f3f3d16665.mp3",
  "audio/tc/magic_jar/nar_dbb71e4df7.mp3"
 ],
 "부자는 방에 항아리를 놓고 말했어요. \"금덩이를 넣으면 금이 산더미가 되겠지!\"": [
  "audio/tc/magic_jar/nar_9c44c932e1.mp3",
  "audio/tc/magic_jar/rich_1ade6c4592.mp3"
 ],
 "항아리를 톡톡톡 눌러서 금덩이를 넣어 봐요!": "audio/tc/magic_jar/nar_20c41f2856.mp3",
 "항아리를 톡톡톡! 금덩이가 나와요.": "audio/tc/magic_jar/nar_c08efd4363.mp3",
 "금덩이가 와르르! 부자는 금 더미에 폭 파묻혔어요. \"사람 살려~\"": [
  "audio/tc/magic_jar/nar_668540d7ee.mp3",
  "audio/tc/magic_jar/rich_6b99f58bda.mp3"
 ],
 "부자를 톡! 눌러서 꺼내 줘요.": "audio/tc/magic_jar/nar_cf0892c06f.mp3",
 "부자를 톡! 금 더미에서 꺼내 줘요.": "audio/tc/magic_jar/nar_7481f3a84d.mp3",
 "쏙! 부자가 빠져나왔어요. 다치지는 않았어요.": "audio/tc/magic_jar/nar_c9a2d1310a.mp3",
 "그때 부자의 아버지가 다가와 항아리 속을 들여다보았어요. \"이게 뭐냐?\"": [
  "audio/tc/magic_jar/nar_9597c7d571.mp3",
  "audio/tc/magic_jar/father_19c026aa6a.mp3"
 ],
 "아버지를 톡! 눌러서 항아리 쪽으로 가 봐요.": "audio/tc/magic_jar/nar_0272d60f8f.mp3",
 "아버지를 톡! 항아리를 구경해요.": "audio/tc/magic_jar/nar_d5b9324c4b.mp3",
 "풍덩! 아버지가 항아리에 거꾸로 쏙 빠졌어요. 다치지는 않았어요.": "audio/tc/magic_jar/nar_f978b3906b.mp3",
 "\"아버지가 어디 계시지?\" 항아리를 톡톡톡 눌러서 아버지를 세어 봐요!": [
  "audio/tc/magic_jar/rich_13d5e6de9d.mp3",
  "audio/tc/magic_jar/nar_a77e84a19a.mp3"
 ],
 "항아리를 톡톡톡! 아버지를 세어 봐요.": "audio/tc/magic_jar/nar_a7b010aa39.mp3",
 "아버지가 하나, 둘, 셋, 넷, 다섯, 여섯, 일곱, 여덟! 여덟 명이나 되었어요.": "audio/tc/magic_jar/nar_b4880d3a0a.mp3",
 "\"내가 진짜 아버지다!\" \"아니야, 내가 진짜야!\" 모두 서로 자기가 진짜라고 우겼어요.": [
  "audio/tc/magic_jar/father_e001d7b084.mp3",
  "audio/tc/magic_jar/father_801fc3504c.mp3",
  "audio/tc/magic_jar/nar_54995e6e08.mp3"
 ],
 "\"배고프다! 밥 줘라!\" 부자는 쟁반을 들고 이리저리 뛰어다녔어요.": [
  "audio/tc/magic_jar/father_dc7dbe43a6.mp3",
  "audio/tc/magic_jar/nar_3bccb55417.mp3"
 ],
 "부자는 지쳐서 외쳤어요. \"이게 다 항아리 때문이야! 이제 그만!\" 부자를 톡!": [
  "audio/tc/magic_jar/nar_55b9a082e3.mp3",
  "audio/tc/magic_jar/rich_7e0d85a87a.mp3",
  "audio/tc/magic_jar/nar_c4461ef9e9.mp3"
 ],
 "부자를 톡! 항아리를 그만 쓰자고 해요.": "audio/tc/magic_jar/nar_53ce7e6aa5.mp3",
 "쨍그랑! 항아리가 깨지자 일곱 명은 사라지고, 진짜 아버지만 남았어요.": "audio/tc/magic_jar/nar_e4b5a84194.mp3",
 "\"아버지, 죄송해요. 욕심을 부려서 소동이 났어요.\"": "audio/tc/magic_jar/rich_17303e9575.mp3",
 "부자는 농부를 찾아가 사과하고, 가진 것을 마을 사람들과 나누기로 했어요. 함께 잔치를 열어요!": "audio/tc/magic_jar/nar_a55fddbb12.mp3",
 "상을 톡! 맛있는 음식을 차려요.": "audio/tc/magic_jar/nar_95ab41d572.mp3",
 "\"모두 고맙네!\" 모두 둘러앉아 맛있게 먹었어요.": [
  "audio/tc/magic_jar/rich_6142405859.mp3",
  "audio/tc/magic_jar/nar_b9aead9e6f.mp3"
 ],
 "농부를 톡! 모두 함께 만세!": "audio/tc/magic_jar/nar_d8d6370334.mp3",
 "나누면 기쁨이 커져요. 요술 항아리 이야기는 이렇게 끝났어요.": "audio/tc/magic_jar/nar_45f0b3a35e.mp3"
};
const VOICE_LINES = {};
