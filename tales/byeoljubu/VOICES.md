# 별주부전 목소리 배정 (2026-10-30, 녹음 전 확정안)

PLAN.md 「목소리 배정 제안」의 유형표를 실제 voice_id 로 정한 것이다. 음색 설명은 모두 **계정 메타데이터에 적힌 말**이며, 사람이 듣고 확인한 것이 아니다. 한 편 안에서 같은 목소리를 두 배역에 쓰지 않는다. 영어판은 같은 목소리로 따로 녹음한다(속도 0.9).

## 용왕 (사용자 결정: 용왕만 할아버지 목소리로 해 보기)

**확정(2026-10-30 사용자): 용왕 = 3번 Changbae(창배), Typecast `tc_60ad08c829e878c3c7d73965`.** 산신령은 Bongpal 그대로. 디자인 보이스 bj_king_design0/1 은 쓰지 않음(계정에서 지워도 됨).
샘플은 용왕 대사 3줄(① "아이고, 온몸이 아프구나." 힘없게 ② "누가 토끼 간을 가져오겠느냐?" ③ "아, 이제 다 나았다!" 밝게)로 만들었다. 파일은 작업 폴더 `scratchpad/bjvoice/king_<번호>_<이름>_line<k>.mp3`(-19.5 LUFS). 받아쓰기(whisper)는 아래 표.

| # | 이름 | 출처 | voice_id | 메타데이터 | 받아쓰기 |
|---|---|---|---|---|---|
| 1 | Kwonil | Typecast | tc_675a73eb789ff3ea6cc80235 | 나이 elder, 남성, Audiobook/Storytelling 등 | 세 줄 모두 맞음 |
| 2 | Jongdae | Typecast | tc_67e38d8c771b5511659c4534 | elder, 남성, Documentary·Anime·Game | 맞음 |
| 3 | Changbae | Typecast | tc_60ad08c829e878c3c7d73965 | elder, 남성, Anime | 맞음 |
| 4 | Duckchun | Typecast | tc_5c3c52c95827e00008dd7f34 | elder, 남성, Game | 3번 줄 "나아다"로 들림(꼬리 뭉개짐 가능) |
| 5 | Poseidon | Typecast | tc_6a8f9d53322676d2f0934a21 | elder, 남성, Audiobook/Storytelling | 맞음(길이 3.4~5.2초로 가장 느림) |
| 6 | Bongpal | ElevenLabs(계정) | PLfpgtLkFW07fDYbUiRJ | old, 남성, ko, "cheerful and funny old man's voice", crisp | 맞음("토끼간" 붙임) |
| 7 | design0 | ElevenLabs 보이스 디자인 | 8JkQ1jbCGZlG9FQ0H8SL | 설명문: 70대 후반 한국 할아버지, 따뜻·낮음·느림·약간 쉰 목소리, 점잖은 왕 | 2번 "토끼관", 3번 "나왔다"로 들림 |
| 8 | design1 | ElevenLabs 보이스 디자인 | rbMOqzFkhtGkFGuabg3E | 위와 같은 설명문, 다른 후보 | 3번 "나왔다"로 들림 |

- Typecast: ssfm-v30, 감정 ①sad:1.0 ②normal ③happy:1.3. ElevenLabs: eleven_v4, 연기 태그([weak, tired, sighing…] 등), stability 0.5.
- ElevenLabs 라이브러리 검색: 계정에 한국어 old 남성은 Bongpal·Namchun 둘뿐이고 Namchun 은 14개 배역(아버지 역)에 이미 쓰여 뺐다. 공유 라이브러리는 이 작업에서 API로 뒤지지 않았다(보이스 디자인 후보로 대신함). 디자인 보이스 두 개(bj_king_design0/1)는 계정에 저장돼 있다. 안 쓰면 지운다.
- **추천: 1번 Kwonil**(나이 elder + 이야기 낭독용 표시, 받아쓰기 깨끗, 할멈과 같은 Typecast 노인 계열). 차선 5번 Poseidon. 최종은 사용자가 샘플을 듣고 고른다. 골라지는 것에 따라 산신령은 아래 대체안으로 바꾼다.
- 한 편에 Typecast 와 ElevenLabs 를 섞는 방법은 팥죽(`voices` 값 `"tc"`) 방식을 쓴다. 용왕이 Typecast 면 용왕 줄만 `tools/typecast/gen_tale.py` 로, 나머지는 ElevenLabs.

## 나머지 배역 (ElevenLabs, eleven_v4)
| 배역 | 이름 | voice_id | 계정 메타데이터 | 다른 동화 쓰임 |
|---|---|---|---|---|
| nar | Gyeorina - Warm Storyteller | 1gYuTfEwELcoEo96wnGj | young, 여성, ko, narrative_story, calm. "soothing bedtime audiobooks" 용도라고 적힘 | 아직 안 씀(새 목소리) |
| 토끼 | Sparkles for Kids | tapn1QwocNXk3viVSowa | young, 여성, 영어 계정, cute, "voice for kids content — enthusiastic, warm, silly" | 여러 동화의 소년 역. 「토끼와 거북이」 토끼(Liam TX3L…)와는 다름 |
| 자라 | Hoon | 86GErZIiGJsPO3g7QNxZ | middle_aged, 남성, ko, narrative_story, calm. "30대, 낮고 중간 높이" | 안 씀. 「토끼와 거북이」 거북이(Eunha cBOt…)와 다름 |
| 문어 | Deoksu | IAETYMYM3nJvjnlkVTKI | young, 남성, ko, characters_animation, confident. "Fat and cute character male voice" | 안 씀 |
| 잉어 의원 | wisdom | Pyj2w3lxZ0VMpAJ4CmRu | middle_aged, 여성, ko, professional. "crisp enunciation, calm, trustworthy" | 신데렐라 새엄마 한 역 |
| 게 병사 | Harry | wMrz30qBeYiSkAtnZGtn | middle_aged, 남성, ko, characters_animation, upbeat. "high-energy, over-the-top character voice" | 안 씀 |
| 갈매기 | Yoojin Kim - Bright, Clear & Friendly | Cm89zxZzEGaMu7ajYw2K | young, 여성, ko, crisp | 인어공주 등 몇 편에서 쓰임(자매 계열은 아님) |
| 다람쥐 | Sejin | oZLQ9kHPMuIyd7Ja0YNU | young, 여성, ko, entertainment_tv, cute | 안 씀 |
| 멧돼지 | Callum - Husky Trickster | N2lVS1w4EtoT3dr4eOWO | middle_aged, 남성, 영어 계정, "gravelly" | 바람·도둑·여우 역으로 이미 씀. 거칠고 짧게 쓸 줄 전용 |
| 산신령 | Bongpal(용왕이 6번이 아닐 때) | PLfpgtLkFW07fDYbUiRJ | old, 남성, ko, "cheerful and funny old man's voice", crisp. 용왕 후보와 같은 노인이지만 "밝고 가볍게" 하는 유형 | 잠자는 숲속 미녀 할아버지 역 |

- 대체안: 용왕으로 Bongpal(6번)을 고르면 산신령은 Typecast Jongdae(2번)로 바꾼다. 용왕이 Typecast 5명 중 하나면 산신령과는 자연히 다르다.
- 11역, 목소리 11개, 겹침 없음(nar·토끼·자라·문어·잉어·게·갈매기·다람쥐·멧돼지·산신령·용왕). 토끼와 다람쥐는 둘 다 높지만 다른 voice_id 이고 성별 표기가 다르다(토끼 Sparkles, 다람쥐 Sejin 모두 여성 표기 — 둘이 비슷하게 들리면 다람쥐를 Chaerin 0acaXyU36iMbRS9PXzmk 으로 바꾼다).
- 아직 아무 줄도 본녹음하지 않았다. 녹음 전에 `voice_script_el.json` 에 위 id를 옮기고 배역마다 샘플 한 줄을 듣는다.

## 크레딧
- ElevenLabs: 샘플 9클립(약 213자) 사용(194,667 → 194,880 / 한도 231,006, 남음 약 36,100자). 보이스 디자인 미리듣기는 글자 차감 없음.
- Typecast: 샘플 15클립(약 330자).
