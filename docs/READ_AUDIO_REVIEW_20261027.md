# 화면 없이 듣는 읽기 대본 보완 (2026-10-27)

대상 4편의 한국어·영어 대본에 각각 60문장을 추가했다. 기존 모든 줄(기존 `new`·`trim` 포함), 녹음 문장, 합창 묶음, 장면·동작 설정과 순서를 보존했다. 새 줄은 모두 내레이터이며 `src: "new"`, `needs_audio: true`이다. 영어 파일은 기존처럼 `text`에 한국어 원문, `en`과 `segs`에 영어를 담았다.

| 동화 | 한국어 추가 문장 수 | 영어 줄 수 일치 여부 | 특이 사항 |
|---|---:|---|---|
| 개미와 베짱이 | 12 | 일치: 10장면, 각 68줄 | 계절·장소 전환, 문 열림과 화자 소개 |
| 미녀와 야수 | 19 | 일치: 11장면, 각 100줄 | 궁전·정원·방 이동, 거울과 가족 대화 연결 |
| 브레멘 음악대 | 12 | 일치: 11장면, 각 78줄 | 잠자리 위치, 고양이 할퀴기, 도둑의 보고 장소 |
| 신데렐라 | 17 | 일치: 11장면, 각 86줄 | 텃밭·궁전 이동, 귀가와 구두 찾기 연결 |

## 추가 문장 전체

위치는 수정 후 장면의 `lines`에서 1부터 세는 줄 번호다. 한 행은 추가한 대본 한 줄(한 문장)이다.

| 동화 | 장면 | 위치 | 한국어 | 영어 |
|---|---|---:|---|---|
| 개미와 베짱이 | R02_carry | 1 | 풀밭에서 일하던 개미들을 가까이 들여다볼까요? | Shall we take a closer look at the ants working in the grass? |
| 개미와 베짱이 | R03_leaf | 1 | 그동안 베짱이는 풀잎 위에서 노래하고 있었어요. | Meanwhile, Grasshopper was singing on a leaf. |
| 개미와 베짱이 | R04_rain | 1 | 개미들이 먹이를 나르는 풀밭에 먹구름이 몰려왔어요. | Dark clouds gathered over the grass where the ants were carrying food. |
| 개미와 베짱이 | R05_autumn | 2 | 개미들은 풀밭에서 겨울 먹이를 더 모았어요. | The ants gathered more winter food in the grass. |
| 개미와 베짱이 | R06_snow | 2 | 창고 밖에 있던 개미들 위로 눈이 소복소복 쌓였어요. | Soft snow piled up over the ants outside the storehouse. |
| 개미와 베짱이 | R07_knock | 1 | 먹이를 모아 두지 않은 베짱이는 배가 꼬르륵 고팠어요. | Grasshopper had saved no food, and his tummy went rumble, rumble. |
| 개미와 베짱이 | R07_knock | 4 | 끼익, 문을 연 개미가 베짱이를 바라보았어요. | Creak! An ant opened the door and looked at Grasshopper. |
| 개미와 베짱이 | R07_knock | 7 | 개미가 베짱이에게 대답했어요. | The ant answered Grasshopper. |
| 개미와 베짱이 | R07_knock | 12 | 개미가 베짱이에게 다정하게 말했어요. | The ant spoke kindly to Grasshopper. |
| 개미와 베짱이 | R08_store | 1 | 베짱이는 개미들을 따라 따뜻한 창고 안으로 들어갔어요. | Grasshopper followed the ants into the warm storehouse. |
| 개미와 베짱이 | R09_concert | 1 | 친구들이 모인 창고에서 베짱이가 악기를 들었어요. | In the storehouse full of friends, Grasshopper picked up his instrument. |
| 개미와 베짱이 | R10_spring | 2 | 눈이 녹은 풀밭으로 개미들과 베짱이가 나왔어요. | The ants and Grasshopper came out into the grass as the snow melted. |
| 미녀와 야수 | R01_cottage | 5 | 벨이 아버지에게 다정하게 말했어요. | Belle spoke kindly to her father. |
| 미녀와 야수 | R02_rose | 1 | 작은 집 앞에 아버지와 세 딸이 모였어요. | Father and his three daughters gathered outside their little cottage. |
| 미녀와 야수 | R02_rose | 3 | 언니들은 아버지에게 선물을 부탁했어요. | The older sisters asked Father for gifts. |
| 미녀와 야수 | R02_rose | 5 | 벨도 아버지에게 조용히 부탁했어요. | Belle quietly asked Father for a gift too. |
| 미녀와 야수 | R03_snow | 2 | 아버지가 말을 타고 지나던 숲은 어두워졌어요. | The forest grew dark as Father rode through it. |
| 미녀와 야수 | R03_snow | 6 | 아버지는 궁전 안 식탁 앞으로 들어갔어요. | Father went inside the palace and up to the table. |
| 미녀와 야수 | R04_garden | 1 | 잠에서 깬 아버지는 궁전 정원으로 나왔어요. | Father woke up and went out into the palace garden. |
| 미녀와 야수 | R04_garden | 10 | 놀란 아버지의 모자가 바닥에 툭 떨어졌어요. | Father was so startled that his hat fell to the ground. Plop! |
| 미녀와 야수 | R05_resolve | 2 | 작은 집에서 세 딸이 아버지의 이야기를 들었어요. | Back in the cottage, the three daughters listened to Father. |
| 미녀와 야수 | R06_guest | 2 | 정원에서는 야수가 두 사람을 기다리고 있었어요. | Beast was waiting for them in the garden. |
| 미녀와 야수 | R06_guest | 7 | 벨은 궁전 안에 마련된 자기 방으로 갔어요. | Belle went to her own room inside the palace. |
| 미녀와 야수 | R07_evenings | 1 | 다음 날 아침, 아버지는 집으로 돌아갔어요. | The next morning, Father went home. |
| 미녀와 야수 | R07_evenings | 2 | 궁전에 남은 벨은 저녁이면 식탁에 앉았어요. | Belle stayed at the palace and sat at the table each evening. |
| 미녀와 야수 | R08_mirror | 1 | 어느 저녁, 야수는 벨의 방에 함께 있었어요. | One evening, Beast was with Belle in her room. |
| 미녀와 야수 | R08_mirror | 3 | 그 거울은 멀리 있는 집도 보여 주는 신기한 거울이었어요. | It was a magic mirror that could show her faraway home. |
| 미녀와 야수 | R08_mirror | 6 | 야수가 걱정하는 벨에게 말했어요. | Beast spoke to worried Belle. |
| 미녀와 야수 | R09_home | 2 | 벨은 아픈 아버지를 정성껏 돌보았어요. | Belle took gentle care of her sick father. |
| 미녀와 야수 | R09_home | 4 | 아버지가 나아지자 언니들이 벨을 붙잡았어요. | When Father was well, the sisters asked Belle to stay. |
| 미녀와 야수 | R11_prince | 1 | 같은 정원에서 벨은 왕자님을 바라보았어요. | There in the garden, Belle looked at the prince. |
| 브레멘 음악대 | R04_rooster | 1 | 세 친구가 마을 집 앞을 지나가고 있었어요. | The three friends were passing a house in the village. |
| 브레멘 음악대 | R06_forest | 1 | 노래 연습을 마친 네 친구는 숲길로 들어섰어요. | After singing practice, the four friends set off along a forest path. |
| 브레멘 음악대 | R07_tower | 1 | 네 친구는 숲속 집 앞에 도착했어요. | The four friends reached the house in the woods. |
| 브레멘 음악대 | R08_window | 1 | 맨 위에 올라간 닭이 집 안을 살펴보았어요. | Rooster, up on top, peeped into the house. |
| 브레멘 음악대 | R09_blast | 1 | 창문 밖의 네 친구가 함께 노래할 준비를 했어요. | Outside the window, the four friends got ready to sing together. |
| 브레멘 음악대 | R10_night | 1 | 어두운 집 안에서 네 친구는 저마다 자리를 잡았어요. | Inside the dark house, each friend found a place to rest. |
| 브레멘 음악대 | R10_night | 2 | 고양이는 아궁이에, 강아지는 문 앞에 누웠어요. | Cat lay by the fireplace, and Dog lay by the door. |
| 브레멘 음악대 | R10_night | 3 | 당나귀는 짚더미에, 닭은 천장 아래 나무 위에 있었어요. | Donkey rested in the straw, and Rooster perched on a beam overhead. |
| 브레멘 음악대 | R10_night | 6 | 반짝이던 것은 고양이의 두 눈이었어요. | Those two little lights were Cat’s eyes. |
| 브레멘 음악대 | R10_night | 7 | 잠에서 깬 고양이가 도둑의 손을 할퀴었어요. | Cat woke up and scratched the robber’s hand. |
| 브레멘 음악대 | R10_night | 15 | 도둑은 숲으로 달아나 다른 도둑들에게 말했어요. | The robber ran into the woods and told the other robbers. |
| 브레멘 음악대 | R11_home | 2 | 집 안에 모인 네 친구는 여기서 살기로 했어요. | Together in the house, the four friends decided to stay. |
| 신데렐라 | R01_cinders | 3 | 부엌에서 새엄마가 아가씨에게 말했어요. | In the kitchen, Stepmother spoke to the girl. |
| 신데렐라 | R02_letter | 2 | 집 안 응접실에서 두 언니가 편지를 보았어요. | The two sisters looked at the letter in the sitting room. |
| 신데렐라 | R02_letter | 4 | 언니가 신데렐라를 불렀어요. | One sister called to Cinderella. |
| 신데렐라 | R03_alone | 1 | 밤이 된 부엌에는 신데렐라만 남았어요. | That night, Cinderella was all alone in the kitchen. |
| 신데렐라 | R04_pumpkin | 1 | 신데렐라는 요정 대모와 집 밖 텃밭으로 나갔어요. | Cinderella went out to the garden with her fairy godmother. |
| 신데렐라 | R05_mice | 1 | 텃밭의 마차 곁에서 요정 대모가 쥐덫을 살펴보았어요. | Beside the coach in the garden, her fairy godmother looked at a mousetrap. |
| 신데렐라 | R06_gown | 1 | 텃밭에 선 요정 대모가 신데렐라에게 지팡이를 향했어요. | In the garden, her fairy godmother pointed her wand at Cinderella. |
| 신데렐라 | R06_gown | 8 | 신데렐라는 마차에 올라탔어요. | Cinderella climbed into the coach. |
| 신데렐라 | R07_night1 | 1 | 신데렐라는 궁전의 무도회장 안으로 들어갔어요. | Cinderella stepped into the palace ballroom. |
| 신데렐라 | R08_night2 | 2 | 신데렐라는 다시 궁전으로 가서 왕자님과 춤을 추었어요. | Cinderella went back to the palace and danced with the prince. |
| 신데렐라 | R08_night2 | 7 | 왕자님이 달려가는 신데렐라를 불렀어요. | The prince called after Cinderella as she ran away. |
| 신데렐라 | R09_stairs | 1 | 궁전 밖 계단까지 왕자님이 뒤따라왔어요. | The prince followed her out to the palace steps. |
| 신데렐라 | R09_stairs | 4 | 신데렐라는 재 묻은 옷차림으로 집에 돌아갔어요. | Cinderella went home in her old, ashy clothes. |
| 신데렐라 | R10_slipper | 2 | 마침내 왕자님은 신데렐라의 집에 도착했어요. | At last, the prince reached Cinderella’s home. |
| 신데렐라 | R10_slipper | 3 | 응접실에서 두 언니가 구두를 신어 보겠다고 나섰어요. | In the sitting room, both sisters stepped forward to try on the slipper. |
| 신데렐라 | R11_forgive | 1 | 모두가 모인 응접실에 요정 대모가 나타났어요. | Her fairy godmother appeared in the sitting room where everyone had gathered. |
| 신데렐라 | R11_forgive | 3 | 두 언니는 신데렐라에게 미안하다고 말했어요. | The two sisters told Cinderella they were sorry. |

## 바꾼 파일 전체

- `tales/ant_grasshopper/read_script_el.json`
- `tales/ant_grasshopper/read_script_en.json`
- `tales/beauty_beast/read_script_el.json`
- `tales/beauty_beast/read_script_en.json`
- `tales/bremen/read_script_el.json`
- `tales/bremen/read_script_en.json`
- `tales/cinderella/read_script_el.json`
- `tales/cinderella/read_script_en.json`
- `docs/READ_AUDIO_REVIEW_20261027.md`

## 검사 결과

- Python JSON 파싱: 대상 8개 모두 통과. 기존 1칸 들여쓰기 유지.
- 43개 장면의 한영 장면 키·줄 수·줄 순서·`src`·`needs_audio` 일치. 총 줄 수는 언어별 332줄.
- 작업 전 사본과 비교해 모든 기존 줄의 내용·속성·순서, 여러 `segs`로 된 합창, 모든 장면 및 `before`/`after` 설정 보존 확인.
- 신규 60줄 전부 `src: "new"`, `needs_audio: true`, 내레이터 단일 `segs` 확인. 기존 줄 또는 다른 신규 줄과 같은 한국어 문장 없음.
- 신규 영어 문장은 각 한국어 줄과 뜻을 맞춰 작성. 기존 영어 녹음·합창 문장은 수정하지 않음.
- 음성 생성·실제 재생 검증·코드 수정·커밋은 하지 않음. 신규 문장은 녹음 대기 상태.

## 모델 확인

세션 지침에서는 GPT-6 기반 Codex로 안내된다. 실행 모델의 정확한 식별자나 전환 기능은 제공되지 않아, 요청한 Codex 6.1 사용 여부는 확인할 수 없다.

## 건너뛴 파일과 이유

- 요청한 대본 8개 중 건너뛴 파일 없음.
- 기준 대본 `tales/snow_white/read_script_el.json`, `tales/red_car/read_script_el.json`은 완료된 작업이므로 읽기만 했다.
- `docs/READ_AUDIO_REVIEW_20261024.md`는 기존 검토 기록이므로 읽기만 했다.
- 엔진·코드·음성 및 다른 동화 파일은 요청 범위 밖이므로 수정하지 않았다. 작업 시작 전부터 있던 다른 변경도 보존했다.
