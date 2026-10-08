/* red_hood — Typecast 배역 내레이션 (tools/typecast/gen_tale.py가 voice_script.json에서 생성, 손으로 고치지 말 것) */
const NARRATION_CLIPS = {
 "엄마가 빨간 모자에게 말했어요. \"할머니가 아프시단다. 맛있는 걸 가져다 드리렴.\"": [
  "audio/tc/red_hood/nar_0060eabe94.mp3",
  "audio/tc/red_hood/mama_e14db377da.mp3"
 ],
 "빵, 우유, 사과를 바구니에 담아요!": "audio/tc/red_hood/nar_f7472559b5.mp3",
 "셋! 바구니가 가득 찼어요.": "audio/tc/red_hood/nar_01700d7d50.mp3",
 "엄마가 빨간 모자를 머리에 씌워 주었어요. 빨간 모자가 한 번 빙글 돌았어요.": "audio/tc/red_hood/nar_3557cb7b39.mp3",
 "\"길에서 벗어나면 안 돼. 모르는 사람과 이야기하지도 마.\"": "audio/tc/red_hood/mama_ee9dc68853.mp3",
 "\"네, 엄마! 약속해요.\"": "audio/tc/red_hood/hood_448ed7f759.mp3",
 "엄마와 빨간 모자는 새끼손가락을 걸었어요.": "audio/tc/red_hood/nar_f86b29e9bf.mp3",
 "빨간 모자는 콧노래를 부르며 숲길을 걸어요. 빨간 모자를 톡톡 눌러서 걸어가 봐요!": "audio/tc/red_hood/nar_d0fa470482.mp3",
 "어, 나무 뒤에서 뭔가 보슬보슬한 게 살짝 보였어요. 꼬리였나 봐요!": "audio/tc/red_hood/nar_511aba214c.mp3",
 "나무 옆에서 늑대가 슬그머니 나왔어요. \"빨간 모자 아가씨, 어디 가니?\"": [
  "audio/tc/red_hood/nar_4d950e6c81.mp3",
  "audio/tc/red_hood/wolf_773682c045.mp3"
 ],
 "\"할머니 댁에 가요.\" 빨간 모자가 대답했어요.": [
  "audio/tc/red_hood/hood_fa3883f56d.mp3",
  "audio/tc/red_hood/nar_ec0d947255.mp3"
 ],
 "\"꽃을 따 가면 할머니가 참 좋아하실 텐데~\"": "audio/tc/red_hood/wolf_6ae126b16d.mp3",
 "\"좋은 생각이에요!\" 빨간 모자는 엄마와 한 약속을 깜빡하고 말았어요.": [
  "audio/tc/red_hood/hood_847fcde5aa.mp3",
  "audio/tc/red_hood/nar_c515cafbb4.mp3"
 ],
 "꽃밭에 알록달록 꽃이 가득해요. 꽃을 같은 색 꽃병에 쏙쏙 담아요!": "audio/tc/red_hood/nar_d4d07138bc.mp3",
 "꽃병마다 꽃다발이 활짝! 빨간 모자는 꽃을 따느라 시간 가는 줄 몰랐어요.": "audio/tc/red_hood/nar_2f1aa4ba8f.mp3",
 "위에서는 빨간 모자가 꽃을 따요. 아래에서는 늑대가 지름길로 달려가요!": "audio/tc/red_hood/nar_b1f00f8b4a.mp3",
 "똑똑똑… 문이 닫히고… 꿀꺽!": "audio/tc/red_hood/nar_d353163e55.mp3",
 "늑대는 할머니의 잠옷을 입고 침대에 누웠어요.": "audio/tc/red_hood/nar_7636dbf27a.mp3",
 "빨간 모자는 숲속 할머니 집에 도착했어요. 문을 톡 두드려요!": "audio/tc/red_hood/nar_273896df4f.mp3",
 "\"들어오렴~\" 안에서 쉰 목소리가 들렸어요.": [
  "audio/tc/red_hood/wolf_a195ac0ea6.mp3",
  "audio/tc/red_hood/nar_64b8d93f8a.mp3"
 ],
 "\"할머니, 오셨어요?\" 그런데 침대 속 할머니가 어딘가 이상해요.": [
  "audio/tc/red_hood/hood_e3fd4be702.mp3",
  "audio/tc/red_hood/nar_d9642ef074.mp3"
 ],
 "벽에 걸린 진짜 할머니 사진과 비교해서 다른 곳을 찾아봐요!": "audio/tc/red_hood/nar_be04c2b48b.mp3",
 "빨간 모자는 고개를 갸웃했어요. 또 이상한 곳이 있나 봐요.": "audio/tc/red_hood/nar_f64b2086a6.mp3",
 "빨간 모자는 깜짝 놀랐어요. 이 사람은 할머니가 아니에요!": "audio/tc/red_hood/nar_a0ddb0d964.mp3",
 "늑대가 벌떡 일어났어요! 빨간 모자야, 어서 숨어요! 옷장을 톡!": "audio/tc/red_hood/nar_4add508541.mp3",
 "빨간 모자는 옷장 속으로 쏙! 늑대는 두리번두리번 찾았지만 보이지 않았어요.": "audio/tc/red_hood/nar_bed0e040c9.mp3",
 "할머니를 먹어서 배가 불렀던 늑대는 스르르 눈이 감겼어요. 쿨쿨…": "audio/tc/red_hood/nar_69dd800e09.mp3",
 "창밖으로 지나가던 사냥꾼이 코 고는 소리를 들었어요. 창문을 톡톡 두드려 봐요!": "audio/tc/red_hood/nar_586e874d46.mp3",
 "\"이상한 코골이네? 할머니 댁에 무슨 일이 있나?\" 사냥꾼이 방 안으로 들어왔어요.": [
  "audio/tc/red_hood/hunter_7bd094e5d9.mp3",
  "audio/tc/red_hood/nar_2154be2ea8.mp3"
 ],
 "\"늑대잖아! 이럴 땐 간질간질 간지럼이 최고지!\"": "audio/tc/red_hood/hunter_a248f3d7d0.mp3",
 "늑대가 딸꾹! 하자 할머니가 퐁! 하고 튀어나왔어요. 할머니는 다치지 않고 멀쩡했어요!": "audio/tc/red_hood/nar_1fcfad0dc2.mp3",
 "늑대는 깜짝 놀라서 \"걸음아 날 살려라~\" 하고 창밖으로 달아났어요.": [
  "audio/tc/red_hood/nar_e627eead4e.mp3",
  "audio/tc/red_hood/wolf_d18bb16215.mp3",
  "audio/tc/red_hood/nar_a30a3ced65.mp3"
 ],
 "빨간 모자도 옷장에서 살그머니 나왔어요. \"할머니!\"": [
  "audio/tc/red_hood/nar_8161aefc48.mp3",
  "audio/tc/red_hood/hood_9bbcf9811c.mp3"
 ],
 "할머니 집 식탁에서 모두 함께 차를 마셔요. 바구니 속 간식을 한 가지씩 나눠 줘요!": "audio/tc/red_hood/nar_573d93edb5.mp3",
 "\"모두 고마워요!\" 할머니는 활짝 웃었어요.": [
  "audio/tc/red_hood/granny_f564b1ff11.mp3",
  "audio/tc/red_hood/nar_98e0d878ad.mp3"
 ],
 "\"이제 약속을 꼭 지킬게요. 길에서 벗어나지 않고, 모르는 사람과는 이야기하지 않을래요.\"": "audio/tc/red_hood/hood_af657bd6a2.mp3",
 "빨간 모자는 새끼손가락을 걸고, 오늘 일을 오래오래 기억했어요.": "audio/tc/red_hood/nar_99c3c50808.mp3",
 "톡! 바구니에 담아요.": "audio/tc/red_hood/nar_3048e85b53.mp3",
 "빨간 모자를 톡! 새끼손가락을 걸어요.": "audio/tc/red_hood/nar_838031075e.mp3",
 "빨간 모자를 톡톡톡! 한 걸음씩 걸어가요.": "audio/tc/red_hood/nar_315d3bb628.mp3",
 "꽃이랑 색깔이 같은 꽃병이 어디 있을까?": "audio/tc/red_hood/nar_8939463b20.mp3",
 "빨간 모자를 톡! 똑똑똑 노크해요.": "audio/tc/red_hood/nar_b834176574.mp3",
 "\"할머니, 귀가 왜 이렇게 커요?\"": "audio/tc/red_hood/hood_bfdc480c16.mp3",
 "\"네 말을 잘 들으려고 그렇지~\"": "audio/tc/red_hood/wolf_7f01968d7a.mp3",
 "\"할머니, 눈이 왜 이렇게 노랗고 커요?\"": "audio/tc/red_hood/hood_ca0b590e6d.mp3",
 "\"너를 잘 보려고 그렇지~\"": "audio/tc/red_hood/wolf_738c0df547.mp3",
 "\"할머니, 입이 왜 이렇게 길어요?\"": "audio/tc/red_hood/hood_5c702ff42f.mp3",
 "\"그건 말이지… 어흥! 놀랐지?\"": "audio/tc/red_hood/wolf_82bbf82448.mp3",
 "사진 속 할머니와 달라 보이는 곳을 톡!": "audio/tc/red_hood/nar_2321d0c220.mp3",
 "이불 말고, 얼굴을 자세히 봐요.": "audio/tc/red_hood/nar_ce92aa9d2d.mp3",
 "얼굴에서 이상한 곳을 눌러 봐요!": "audio/tc/red_hood/nar_ba01da28bd.mp3",
 "옷장을 톡! 쏙 숨어요.": "audio/tc/red_hood/nar_5dc0807731.mp3",
 "창문을 톡!": "audio/tc/red_hood/nar_20de69969a.mp3",
 "늑대를 톡톡톡! 간지럼을 태워요.": "audio/tc/red_hood/nar_8fa92285c6.mp3",
 "간식을 톡! 한 사람씩 나눠 줘요.": "audio/tc/red_hood/nar_bdfb1702be.mp3",
 "빨간 모자를 톡! 다시 약속해요.": "audio/tc/red_hood/nar_31195572df.mp3",
 "빨간 꽃이에요! 같은 색 꽃병을 톡!": "audio/tc/red_hood/nar_a94248a79e.mp3",
 "빨간 꽃병이에요! 반짝이는 꽃병을 눌러 봐요!": "audio/tc/red_hood/nar_7d13517718.mp3",
 "노란 꽃이에요! 같은 색 꽃병을 톡!": "audio/tc/red_hood/nar_35a934e414.mp3",
 "노란 꽃병이에요! 반짝이는 꽃병을 눌러 봐요!": "audio/tc/red_hood/nar_1cc6ec0a1c.mp3",
 "파란 꽃이에요! 같은 색 꽃병을 톡!": "audio/tc/red_hood/nar_aefd239ab7.mp3",
 "파란 꽃병이에요! 반짝이는 꽃병을 눌러 봐요!": "audio/tc/red_hood/nar_75990d0e67.mp3",
 "빵은 할머니께 톡!": "audio/tc/red_hood/nar_786310effc.mp3",
 "우유는 빨간 모자 톡!": "audio/tc/red_hood/nar_ea89bbf963.mp3",
 "사과는 사냥꾼 아저씨 톡!": "audio/tc/red_hood/nar_542c5ac465.mp3"
};
const VOICE_LINES = {};
