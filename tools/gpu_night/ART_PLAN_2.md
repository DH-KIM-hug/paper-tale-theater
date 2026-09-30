# 페이퍼아트 애셋 계획 2 — 남은 동화 8편

`build_tales2_jobs.py` → `jobs_<tale>.json` 8개. 방식은 `build_tales_jobs.py`(개구리·토끼·해님달님)와 같다.
- **종류**: 배경 = `sheet` 1760×992 다층 한 장 / 소품 = `prop`(라임) · `gprop`(**마젠타**, 초록 대상) 1024², 넓게 1760×992, 길게 768×1280 / 컷 = `cut` 1024×768.
- **표시**: 이름 뒤 **M** = 마젠타 배경(초록·연두 몸이나 소품. 라임 키잉이 먹어 버린다).
- **반영한 교훈**: 배경 프롬프트에 HEX 없음(색은 말로: 부드러운 파스텔·낮은 채도) · 밤 장면은 "밝은 그림책 밤" 강제 · 띠 소품 없음 · 한 장면 = 배경 한 장 · 배경 아래 가운데 비움 · 배경에 인물 없음.
- **순서**(각 목록 안): 배경 → 주인공 주요 자세 → 조연·소품 → 컷.
- **공유 바이블**: 개·고양이·생쥐·수탉·흰 오리는 생김새 문장을 한 번 정해 여러 편이 같이 쓴다.
  미운 아기 오리는 고양이 `tn_cat_sit`, 수탉 `br_rooster`, 엄마·흰 오리 `fc_duck`을 **그대로 다시 쓴다**(새로 뽑지 않음).
- **자세는 코드가 쓰는 것만**. 기울기·찌그러짐·회전으로 코드가 만드는 자세(순무 당기기 각도·벌러덩, 브레멘 탑 쌓기 등)는 기본 그림 한 장으로 해결한다.

## 1. 해와 바람 `sw_` — 26장
| 이름 | 종류 | 무엇 | 코드에서 대체 |
|---|---|---|---|
| sw_bg_sky | 배경 | 구름 위 하늘, 아래는 구름 바닥 | `skyBG` (시작) |
| sw_bg_high | 배경 | 하늘에서 내려다본 조각보 들판·길 | `highBG` (내기) |
| sw_bg_field | 배경 | 들길 와이드, 나무 하나 | `fieldBG` (바람 차례·해님 차례, 하늘색은 코드가 바꾼다) |
| sw_bg_stream | 배경 | 개울가, 앉을 바위 | `streamBG` (개울가) |
| sw_bg_snow | 배경 | 눈 오는 언덕 | 눈 오는 날 장면 (인라인 배경) |
| sw_sun | 소품 | 웃는 해님(정면) | `drawSun` 전체 |
| sw_wind / _blow / _tired | 소품 ×3 | 바람 구름: 우쭐 · 볼 빵빵 · 헉헉 | `drawWind` 기본 · blow · tired |
| sw_trav_walk **M** | 소품 | 모자·외투 열고 걷기 | `setOutfit coat` |
| sw_trav_hold **M** | 소품 | 모자 없이 외투 여미고 팔짱, 덜덜 | `coatShut+cross`, face cold |
| sw_trav_fan **M** | 소품 | 모자로 부채질, 땀 | `coat+fan` |
| sw_trav_shoulder **M** | 소품 | 외투 어깨에 걸침 | `shoulder` |
| sw_trav_shirt **M** | 소품 | 티셔츠만 | `shirt` (6b·6c·날씨 놀이) |
| sw_trav_sit **M** | 소품 | 바위에 앉아 맨발 | `sit:true` (개울가) |
| sw_trav_scarf **M** | 소품 | 외투+목도리 | `scarf` (눈 정답·날씨 놀이) |
| sw_trav_rain **M** | 소품 | 노란 우비 | `rain` (날씨 놀이) |
| sw_hat / sw_coat | 소품 ×2 | 모자 · 빨간 외투 단독 | `HAT_SHAPES`(날아가는 모자) · 개울가 외투·배지 `ICON.coat` |
| sw_cloud_rain / _snow | 소품 ×2 | 비구름 · 눈구름 버튼 | 날씨 놀이 `btns.rain/snowc` |
| sw_cut_hat · _hold · _pant · _off · _shake | 컷 ×5 | 앗 내 모자 · 꽉 · 헉헉 · 훌러덩 · 악수 | `T.cut` 5개 전부 |

## 2. 커다란 순무 `tn_` — 24장
| 이름 | 종류 | 무엇 | 코드에서 대체 |
|---|---|---|---|
| tn_bg_garden | 배경 | 텃밭 측면(울타리 왼쪽, 오두막 멀리 오른쪽) | `gardenBG` (시작·무럭무럭·모든 `sideView`) |
| tn_bg_lowangle | 배경 | 흙에서 올려다본 하늘 | `lowAngleBG` (영차!) |
| tn_bg_door | 배경 | 통나무집 정면, 문 | `doorBG` (할머니~!) — 문 열림은 코드 |
| tn_bg_fence | 배경 | 높은 나무 울타리 | `fenceBG` (멍멍!) — 덤불은 코드 |
| tn_bg_barn | 배경 | 빨간 헛간, 빈 지붕 | `barnBG` (야옹!) |
| tn_bg_mouse | 배경 | 풀벽·쥐구멍 | `mouseBG` (아주 작은 생쥐) |
| tn_bg_feast | 배경 | 노을 텃밭 | `feastBG` (순무 잔치) |
| tn_turnip **M** / tn_sprout **M** | 소품 ×2 | 큰 순무 · 새싹 | `drawTurnip` 다 자람 · 싹(성장 단계는 배율) |
| tn_grandpa_stand · _pull · _sit **M** | 소품 ×3 | 할아버지 서기 · 당기기 · 엉덩방아 | `POSE stand/pull/sit` |
| tn_grandma_stand · _pull | 소품 ×2 | 할머니 | 문에서 달려옴 · 당기기 |
| tn_girl_pull | 소품 | 손녀 당기기 | 줄 3번 |
| tn_dog_pull · _jump | 소품 ×2 | 개 당기기 · 덤불에서 뛰쳐나옴 | 줄 · 멍멍! 장면 |
| tn_cat_pull · _sit | 소품 ×2 | 고양이 당기기 · 앉기 | 줄 · 지붕 위(실루엣) |
| tn_mouse_pull | 소품 | 생쥐 뒷발로 당기기 | 줄 · 생쥐 장면(3배) |
| tn_pot · tn_watering_can **M** | 소품 ×2 | 순무국 솥 · 물뿌리개 | 잔치 솥 · 무럭무럭 물주기 |
| tn_cut_glare · _pop | 컷 ×2 | 개·고양이 째릿 · 순무 쑥! | `T.cut` 째릿 · 슬로모션 3컷 중 마지막(앞 2컷은 코드) |

## 3. 사자와 생쥐 `lm_` — 20장
| 이름 | 종류 | 무엇 | 코드에서 대체 |
|---|---|---|---|
| lm_bg_savanna | 배경 | 아카시아 그늘 초원 | `savannaBG` (시작) |
| lm_bg_grass | 배경 | 생쥐 눈높이 풀숲+데이지 | `grassForestBG` (생쥐의 산책) |
| lm_bg_lowangle | 배경 | 땅에서 올려다본 하늘 | `lowAngleBG` (잡혔다!) |
| lm_bg_night_forest | 배경(밤) | 밤 숲 공터 부감 | `nightHighBG` (밤 숲) |
| lm_bg_night_net | 배경(밤) | 달밤 초원 | `nightNetBG` (사각사각) — 그물 밧줄은 코드 |
| lm_bg_morning | 배경 | 아침 초원 와이드 | `savannaBG({morning})` (아침 초원) |
| lm_lion_sleep | 소품(넓게) | 엎드려 자는 사자 | `drawLionLie` eyes shut |
| lm_lion_lie_awake | 소품(넓게) | 엎드려 눈 뜨고 도와줘 | 그물 속 사자 |
| lm_lion_head_yawn · _laugh | 소품 ×2 | 큰 머리 하품 · 웃음 | `drawHead` sleepy+open · happy+open (잡혔다!) |
| lm_lion_stand | 소품 | 서서 활짝 | `drawLionStand` (풀려남·구멍·달리기, 등에 생쥐) |
| lm_lion_paw | 소품(길게) | 내리누르는 큰 앞발 | 잡혔다! 앞발 기둥 |
| lm_mouse_walk · _pray · _run · _gnaw | 소품 ×4 | 생쥐 걷기 · 빌기 · 도망 · 갉기 | `drawMouse` 각 자세(미끄럼·등타기는 회전·배치) |
| lm_cut_paw · _laugh · _net · _gnaw | 컷 ×4 | 탁! · 하하하 · 버둥버둥 · 싹둑 | `T.cut` 3개 + 기획서의 갉기 컷 |
비교 판(`boardBG`)·발자국/이빨 카드·그물은 코드 그림으로 둔다(단순 도형·밧줄 끊기 연출).

## 4. 여우와 두루미 `fc_` — 26장
| 이름 | 종류 | 무엇 | 코드에서 대체 |
|---|---|---|---|
| fc_bg_forest | 배경 | 숲 가장자리 | `forestBG` (시작) |
| fc_bg_kitchen | 배경 | 여우 굴 부엌 | `kitchenBG` |
| fc_bg_high | 배경 | 부감 마루·둥근 탁자(빈) | `highBG`+`highTable` (납작 접시) |
| fc_bg_pondhouse | 배경 | 연못가 두루미 집 | `pondHouseBG` |
| fc_bg_crane_room | 배경 | 앙각 두루미 방·작은 탁자 | `lowBG`+`lowTable` (긴 병) |
| fc_bg_feast_day · _night | 배경 ×2 | 잔치 낮(깃발) · 밤(등불) | `feastBG(false/true)` |
| fc_fox_stand · _lick · _stuck **M** · _sorry | 소품 ×4 | 여우 서기 · 핥기 · 병에 코 낌 · 미안 | `drawFox` 기본 · 핥기 · 코 낌 · 사과 |
| fc_crane_stand · _peck · _sad · _sorry | 소품(길게) ×4 | 두루미 서기 · 부리 콕 · 시무룩 · 미안 | `drawCrane` 각 자세(홀짝은 peck 재사용) |
| fc_duck · fc_butterfly | 소품 ×2 | 오리 · 나비 손님 | `drawDuck` · `drawButterfly` |
| fc_pot | 소품 | 수프 솥 | `drawPot` |
| fc_plate | 소품(넓게) | 아주 넓고 납작한 접시 | `DISH.plate` |
| fc_bottle **M** · fc_bowl **M** · fc_flower **M** | 소품 ×3 | 긴 호리병 · 넓은 그릇 · 꽃 | `DISH.bottle/bowl/flower` |
| fc_cut_peck · _lick · _stuck · _sorry | 컷 ×4 | 딱딱 · 핥핥 · 쏙 · 미안해 | `T.cut` 4개 전부 |
분할 화면(`splitBG`)은 부엌·두루미 방 배경을 반씩 잘라 쓴다. 초대장·등불은 작아서 코드 그림으로 둔다.

## 5. 골디락스와 곰 세 마리 `gl_` — 28장
| 이름 | 종류 | 무엇 | 코드에서 대체 |
|---|---|---|---|
| gl_bg_kitchen | 배경 | 곰네 부엌 | `kitchenBG` (시작·앗 뜨거·곰 가족·미안해요·마무리. 오후 노을은 코드 색덮개) |
| gl_bg_forest | 배경 | 숲길, 먼 오두막 | `forestBG`+`forestFront` |
| gl_bg_door | 배경 | 앙각 거대한 문 | `doorBG` (똑똑똑) |
| gl_bg_table | 배경 | 부감 빈 식탁 | `tableTopBG` (죽 세 그릇) |
| gl_bg_living | 배경 | 거실, 가족 액자 | `livingBG` (의자 세 개·의자 주인) |
| gl_bg_bed_top · _bed_side | 배경 ×2 | 침실 부감 · 측면 | `bedroomTopBG` · `bedroomSideBG` |
| gl_goldi_walk · _tongue · _sit · _surprised · _sorry | 소품 ×5 | 걷기(꽃다발) · 앗 뜨거 · 앉기 · 깜짝 · 미안 | `drawGoldi` walk · tongue · 의자 앉기 · o · sorry |
| gl_goldi_sleep | 소품(넓게) | 누워 자기 | 침대(부감·측면, 코드가 회전) |
| gl_bear_dad · _mom · _baby **M** · _baby_cry **M** | 소품 ×4 | 아빠·엄마·아기 곰 · 우는 아기 곰 | `drawBear` 세 벌 + cry (크기비 1:.72:.5는 코드) |
| gl_bowl | 소품 | 죽 그릇(옆) | `bowlSide` (크기별 배율, 부감 그릇은 코드) |
| gl_chair_big · _mid · _small | 소품 ×3 | 의자 셋 | `chair` (부서짐 연출은 코드) |
| gl_bed_big **M** · _mid · _small | 소품 ×3 | 침대 셋(부감) | `bed` 딱딱·푹신·알맞음 |
| gl_cut_hot · _cold · _crack · _eyes | 컷 ×4 | 앗 뜨거 · 부르르 · 뿌지직 · 깜짝 | `T.cut` 5개 중 4개(치마 걸림은 코드 컷 유지) |

## 6. 브레멘 음악대 `br_` — 27장
| 이름 | 종류 | 무엇 | 코드에서 대체 |
|---|---|---|---|
| br_bg_mill | 배경 | 방앗간·물레방아·맷돌 | `millBG` |
| br_bg_road | 배경 | 시골길, 큰 덤불 | `roadBG` (덤불 뒤에 누구?) |
| br_bg_wall | 배경 | 앙각 벽돌 담 | `wallBG` (담장 위에 누구?) |
| br_bg_roof | 배경 | 농가 지붕 | `roofBG` (지붕 위에 누구?) |
| br_bg_meadow | 배경 | 길가 풀밭 | `meadowBG` (음악대 연습) |
| br_bg_forest_night | 배경(밤) | 밤 숲 부감, 먼 불빛 | `forestBG` (캄캄한 숲·도둑 보고) |
| br_bg_house_low | 배경(밤) | 앙각 판자벽, 높은 창 | `houseLowBG` (탑 쌓기) — 창 속 도둑 실루엣은 코드 |
| br_bg_house_pov | 배경 | 창 너머 방, 식탁·금화 | `housePOV`+`povFrame` (창문 안) |
| br_bg_house_wide | 배경(밤) | 숲속 집 와이드 | `houseWideBG` (음악 대폭발) |
| br_bg_morning | 배경 | 아침 우리 집 | `morningBG` (우리 집) |
| br_donkey · _sing · _sleep | 소품 ×3 | 당나귀 서기 · 노래 · 잠 | `drawDonkey` stand · sing · sleep |
| br_dog_tired · _sing | 소품 ×2 | 개 헥헥 · 노래 | tired · sing (서기·탑은 sing/tired 재사용) |
| br_cat_sad · _sing | 소품 ×2 | 고양이 시무룩 · 노래 | 수염 처짐 · sing |
| br_rooster · _sing | 소품 ×2 | 수탉 서기 · 꼬끼오 | stand/지붕 실루엣 · sing/날기 |
| br_miller | 소품 | 방앗간 주인 | `drawMiller` |
| br_robber_red · _brown · br_robber_green **M** | 소품 ×3 | 도둑 셋 | `drawRobber` 셔츠 색별 |
| br_owl | 소품 | 부엉이 | `drawOwl` |
| br_cut_crash · _monster · _ghost | 컷 ×3 | 와장창 · 괴물이다 · 도둑의 과장 보고 | `T.cut` 3개 전부 |
캄캄한 방(`darkRoomBG`)은 실루엣+빛나는 눈 연출이라 코드 그림을 그대로 둔다(이미지로 뽑으면 새까맣거나 너무 밝아진다). 탑 한 장 그림·악기는 만들지 않는다.

## 7. 개미와 베짱이 `ag_` — 27장
| 이름 | 종류 | 무엇 | 코드에서 대체 |
|---|---|---|---|
| ag_bg_summer · _autumn · _spring | 배경 ×3 | **같은 구도**의 계절 들판(개미집 오른쪽) | `fieldBG('summer'/'autumn'/'spring')` — 소나기는 여름에 코드 색덮개·비 |
| ag_bg_ant_eye | 배경 | 개미 눈높이, 큰 개미집 | `antEyeBG` (먹이 나르기, 창고 칸은 코드) |
| ag_bg_leafstage | 배경 | 풀잎 무대 | `leafStageBG` |
| ag_bg_winter_high | 배경 | 눈밭 부감, 개미 구멍 | `winterHighBG` (첫눈) |
| ag_bg_door | 배경 | 눈 덮인 흙둑, 빛나는 아치 문 | `doorBG` (똑똑, 문짝은 코드) |
| ag_bg_cellar | 배경 | 땅속 단면(곡식방·홀·도토리방) | `cellarBG` (창고 가득·겨울 음악회 확대) |
| ag_ant_carry · _stand · _vest · _winter · _baby | 소품 ×5 | 개미 나르기 · 서기 · 조끼 · 목도리+모자 · 아기 | `drawAnt` carry · 기본 · vest · scarf+hat · 아기 |
| ag_hopper_play · _wet · _shiver · _winter · _carry | 소품 ×5 **M** | 베짱이 연주 · 흠뻑 · 덜덜 · 겨울옷 · 나르기 | `drawHopper` play · drops · 문 앞 · scarf+hat · carry |
| ag_ladybug · _snail · _pillbug · _firefly | 소품 ×4 | 손님 넷 | `FRIENDS` |
| ag_leaf_umbrella **M** · ag_acorns | 소품 ×2 | 잎 우산 · 도토리 더미 | 소나기 잎 우산 · 가을 도토리 |
| ag_cut_sneeze · _shiver · _door | 컷 ×3 | 에취 · 오들오들 · 활짝 | `T.cut` 4개 중 3개(눈송이 펑펑은 코드) |
틀린 옷(티셔츠·코트·튜브)은 코드 덧그림으로 둔다.

## 8. 미운 아기 오리 `ud_` — 28장
| 이름 | 종류 | 무엇 | 코드에서 대체 |
|---|---|---|---|
| ud_bg_nest | 배경 | 부감 둥지 | `nestBG` |
| ud_bg_pond | 배경 | 연못 측면 | `pondSideBG` |
| ud_bg_yard | 배경 | 농장 마당 | `yardBG` |
| ud_bg_reeds | 배경 | 갈대숲 눈높이 | `reedEyeBG` (패럴랙스는 코드가 앞 갈대 추가) |
| ud_bg_swamp · _swamp_high | 배경 ×2 | 늪 · 늪 부감(섬) | `swampBG` · `swampHighBG` |
| ud_bg_autumn | 배경 | 가을 앙각, 큰 하늘 | `autumnLowBG` |
| ud_bg_winter | 배경 | 언 호수 부감 | `winterHighBG` |
| ud_bg_cabin | 배경 | 할머니 집 안(난로) | `cabinBG` |
| ud_bg_spring · _reflect | 배경 ×2 | 봄 호수 · 물 부감 | `springBG`(봄·백조 가족) · `reflectBG` |
| ud_egg | 소품 | 큰 알 | `HERO.egg` (작은 알 4개도 배율) |
| ud_baby · _sad · _scared · _happy | 소품 ×4 | 회색 아기 오리 감정 넷(과장) | `HERO.baby` + `moodFace` |
| ud_young · _sad · _wings | 소품 ×3 | 청소년 새 · 덜덜 · 날개 활짝 | `HERO.young` 가을·오두막 · 얼음 · 봄 |
| ud_swan | 소품 | 백조(주인공 끝) | `HERO.swan` (물그림자는 코드 뒤집기) |
| ud_swan_fly | 소품(넓게) | 나는 백조 | 가을 V자 무리 `flyingSwan` |
| ud_duckling · ud_hen · ud_goose · ud_grandma | 소품 ×4 | 노란 형제 · 암탉 · 기러기 · 할머니 | `sideDuck` 노랑 · `drawHen` · `drawGoose` · `drawGrandma` |
| ud_farmer **M** | 소품 | 농부 | `drawFarmer` |
| ud_cut_hatch · _reflect | 컷 ×2 | 알 깨짐 · 물에 비친 백조 | 기획서 컷(코드의 쾅·가르릉·꽥 컷은 글자·주인공 그림으로 충분) |
재사용: 엄마·흰 오리 = `fc_duck`, 수탉 = `br_rooster`, 고양이 = `tn_cat_sit`.

## 합계와 시간
| 동화 | 장 | 배경 | 소품·캐릭터 | 컷 | 예상(분) |
|---|---|---|---|---|---|
| 해와 바람 | 26 | 5 | 16 | 5 | 465–570 |
| 커다란 순무 | 24 | 7 | 15 | 2 | 465–550 |
| 사자와 생쥐 | 20 | 6 | 10 | 4 | 425–480 |
| 여우와 두루미 | 26 | 7 | 15 | 4 | 530–610 |
| 골디락스 | 28 | 7 | 17 | 4 | 540–640 |
| 브레멘 음악대 | 27 | 10 | 14 | 3 | 555–640 |
| 개미와 베짱이 | 27 | 8 | 16 | 3 | 525–620 |
| 미운 아기 오리 | 28 | 11 | 15 | 2 | 600–680 |
| **합계** | **206** | **61** | **118** | **27** | **약 4,100–4,800분 = 68–80시간** |

계산: 배경·넓은 소품(1760×992) 30분, 길쭉 소품 18–22분, 1024² 소품·컷 15–20분.
하룻밤 9시간 기준으로 **8–9일 밤**. 한 편씩(각 7–11시간) 밤마다 돌리면 된다.
마젠타(`gprop`) 29장 — 초록 자리: 나그네(초록 티) 8, 순무·새싹·할아버지·물뿌리개 6, 베짱이 5+잎 우산, 호리병·그릇·꽃·코 낀 여우 4, 아기 곰(초록 목도리) 2+초록 이불 침대, 초록 셔츠 도둑, 농부(초록 외투).
