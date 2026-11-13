# 심사 노트 (App Review Information > Notes)

작성일 2026-11-06, 2026-11-07 갱신(이름 설정 2판·뒤로 가기·무음 모드·서버 주소 반영), 2026-11-13 갱신(공지사항·의견 보내기). 아래 영어 본문(3969자, 2026-11-13 스크립트로 다시 셈 — ``` 안 본문 글자 수, 칸 한도 4000자 이내)을 'Notes' 칸에 그대로 붙여 넣고, 한국어는 사용자 확인용입니다. 로그인 정보 칸은 **'로그인 필요 없음'** 으로 체크(Sign-in required 끄기). 연락처는 hello@ddoystory.com (전화번호는 사용자가 입력).

## English (paste this)
```
Toki Toki Tale (working title): interactive storybooks for ages 2-5 (Kids, 5 and under). No account or login, so no demo account. Tales, art and voices are bundled; the app works offline.

REVIEW
1. Home lists the tales. Always free: Rabbit and Turtle, Giant Turnip, Cinderella, Tiger and Red Bean Porridge; the 4 original tales are free; 4 more are free each week. Others show a lock.
2. Open a free tale and tap Start. The child taps highlighted objects or picks an answer (counting, sizes, order, colors, sounds, feelings).
3. To leave a tale: tap the small house button (top left), then tap again within 3 s.
4. "Read to Me" tab: bedtime read-aloud, keeps playing with the screen off (UIBackgroundModes audio, only for this). Tale sound also plays with the silent switch on (playback session).
5. Sticker Book / My Stage: stored on the device only.

PARENT AREA AND GATE
- Hold the gear (top right of Home) 1 s. Menu: Sound & text, Play time, Language, Find tales, Access, Link devices, Child's name, Notices, About, Records.
- Purchasing, restoring, device linking, privacy policy, picking a locked tale, erasing records, opening Child's name and About > Send feedback each open a parental gate: a multiplication question (e.g. 7 x 8); press and HOLD the right answer 1.5 s. Wrong answer locks it for 30 s. Send feedback opens the Mail app (pre-filled: app version, device type, language); no other external links or web views.

SERVER (live): https://paper-tale-sync.papertale.workers.dev (Cloudflare Workers + KV). Used only for StoreKit 2 receipt verification (Apple Root CA G3), optional device linking (8-digit code, 10 min, single use), optional name recordings and a read-only notice list (GET /v1/notices: no ID sent, nothing stored; shown only in the grown-up menu). It stores a random ID + secret hash, progress, purchase result (hashes), first-setup flags and pass count. No IP or device type stored. No ads, analytics or tracking SDKs. No coupon or redeem-code feature.

IN-APP PURCHASES (parent area, behind the gate; test with a Sandbox tester: grown-up menu > Access)
- com.papertale.theater.unlockall, non-consumable $4.99, "Unlock all tales": all tales + one first name-and-look setup for each of the 4 original tales.
- com.papertale.theater.rename, consumable $0.99, "Change Names Again Pass": after first setups are used, one pass redoes all 4 original tales at once (48 h). Only on a device owning Unlock All; the server re-checks the receipt and accepts each transaction ID once; unused passes are kept on the server account (consumables cannot be restored). Not promoted.

CHILD'S NAME AND HERO LOOK (optional; grown-up menu > Child's name, after Unlock All)
- Per original tale a parent sets the hero's name and look (girl/boy, prepared illustrations; no uploads).
- All spoken lines are recordings (no on-device TTS), so only lines with the name are re-recorded in the same voices. Name is sent over HTTPS via our server to ElevenLabs; audio returns and is stored on the device with the names and looks. The server does not store or log names or looks and sends no identifiers. We request ElevenLabs zero retention (enable_logging=false); if the plan rejects or ignores it, we delete the generation record from the provider account right after the clip is made. Parent-only, behind the gate each time, never asked of the child. If unused, nothing is sent. See the privacy policy (effective Nov 13, 2026).

AI-GENERATED CONTENT
- Art: OpenAI image generation tools (commercial-use plan), composed by us. No photographs of real children appear in the app. No user or AI content is created at runtime except the optional name recordings.
- Voices: pre-recorded with ElevenLabs and Typecast (commercial plans), bundled.
- Sounds/music: CC0, CC BY, Pixabay license (commercial use OK); credits: grown-up menu > About > Credits.
- Stories are public-domain folk tales and fables; text, art and performances are ours.
Contact: hello@ddoystory.com
```

## 한국어 번역 (확인용)
톡톡 동화극장(가제)은 2~5세용 인터랙티브 동화 앱입니다(Kids 5세 이하, 1차 교육·2차 도서). 가입·로그인이 없어 데모 계정이 필요 없고, 동화·그림·목소리가 모두 앱 안에 들어 있어 오프라인으로 작동합니다.

**심사 방법**
1. 홈에 동화 목록. 항상 무료 4편(토끼와 거북이, 커다란 순무, 신데렐라, 팥죽할멈과 호랑이), 창작 동화 4편, 매주 바뀌는 무료 4편이 열리고 나머지는 잠겨 있습니다.
2. 무료 동화를 눌러 시작하면 아이가 강조된 물건을 누르거나 알맞은 답을 고르며(수 세기·크기·순서·색·소리·마음) 이야기를 진행합니다. 5초 동안 안 누르면 손가락 힌트.
3. 동화 도중 나가기: 왼쪽 위 작은 집 단추를 누르고 3초 안에 한 번 더 누름(아이가 실수로 나가지 않게 두 번). 소리·녹음이 멈추고 홈으로 갑니다.
4. '읽어 주기' 탭(달 아이콘): 상호작용 없이 잠자리 동화를 읽어 줍니다. 화면을 꺼도 계속 재생(백그라운드 오디오는 이 기능에만 씀). 무음 스위치가 무음이어도 동화 소리가 납니다(오디오 세션 playback).
5. 스티커북 탭: 모은 스티커와 '내 무대'. 모두 기기 안에만 있습니다.
6. 보호자 메뉴 > 언어에서 한국어/영어 전환.

**보호자 영역과 부모 확인**
- 홈 오른쪽 위 톱니를 1초 꾹 누르면 보호자 메뉴(소리와 글, 놀이 시간, 언어, 동화 찾기, 이용권, 기기 연결, 우리 아이 이름, 공지사항, 정보, 기록). VoiceOver·스위치 컨트롤의 활성화는 바로 엽니다.
- 안에서 결제, 기기 연결, 처리방침 보기, 잠긴 동화 고르기, 기록 지우기, 이름 설정 열기, 정보 > 의견 보내기는 부모 확인(곱셈 문제 정답을 1.5초 꾹, 틀리면 30초 잠금)을 거칩니다. 통과는 보호자 메뉴가 열려 있는 동안만 유효합니다.
- 구매·구매 복원은 보호자 메뉴 > 이용권. '의견 보내기'는 부모 확인 뒤 메일 앱을 엽니다(mailto, 앱 버전·기기 종류·언어만 미리 적음). 그 밖의 외부 링크나 웹뷰는 없습니다.

**서버**
- 서버는 켜져 있습니다: https://paper-tale-sync.papertale.workers.dev (구매 검증, 선택 기기 연결, 선택 이름 녹음, 공지 목록 읽기). 로그인 없음.
- 공지: `GET /v1/notices` 는 인증 없는 공개 읽기입니다. 요청에 ID·토큰을 싣지 않고 서버는 아무것도 저장하지 않습니다. 새 공지 표시는 보호자 메뉴 '공지사항' 줄의 작은 점뿐(홈·아이 화면에는 없음). 서버가 없어도 앱은 작동.
- 저장: 무작위 ID와 비밀값 해시, 진행 기록, 구매 결과(소유 여부·영수증과 거래 ID 해시), 동화별 첫 설정 사용 표시와 남은 이용권 장수. IP·기기 종류는 저장 안 함.
- 구매 검증은 StoreKit 2 거래를 서버에서 Apple Root CA G3 기준으로 확인. 광고·제3자 분석·추적 없음. 이번 빌드에는 쿠폰·코드 입력 기능이 없습니다(제출 전 반드시 확인: README 체크리스트).

**인앱 구입**
- `com.papertale.theater.unlockall`(비소모성 4.99달러, 모든 동화 열기): 모든 동화 해제 + 창작 동화 4편 각각의 이름·모습 첫 설정 1번씩 포함.
- `com.papertale.theater.rename`(소모성 0.99달러, 이름 다시 바꾸기 이용권): 첫 설정을 쓴 뒤 한 장으로 창작 동화 4편의 이름·모습을 48시간 안에 한꺼번에 다시 바꿈. 전체 해제 기기에서만 판매, 서버가 영수증 소유 재확인·거래 ID 1회만. 안 쓴 이용권은 서버 계정에 기록. 홍보용 구입 끔.
- 시험: Sandbox 계정으로 보호자 메뉴 > 이용권에서 구매 → 보호자 메뉴 > 우리 아이 이름에서 한 편 설정 → '다시 바꾸기 (이용권 $0.99)'.

**이름·주인공 모습** (선택, 보호자 전용)
- 창작 동화 4편마다 주인공 이름과 모습(여자아이/남자아이 그림)을 정합니다. 구름 공장은 아이 셋·강아지를 따로, 어떤 조합도 가능. 준비된 그림 중 고르는 것이며 사진 업로드나 실행 중 그림 생성은 없습니다.
- 이름이 든 줄(또는 모습에 따라 달라지는 줄)만 같은 목소리로 새로 녹음합니다. 남자아이·여자아이 버전의 아이 대사 녹음이 있습니다.
- 입력한 이름은 HTTPS로 서버를 거쳐 ElevenLabs로 가고 오디오가 돌아옵니다. 이름·모습·오디오는 기기에만 저장. 서버는 이름·모습을 저장·로그하지 않고, 식별자도 안 보냅니다. zero-retention(enable_logging=false)을 요청하되 요금제가 안 받으면 옵션 없이 보내므로 '항상 적용'이라고는 말하지 않습니다. 2026-11-13: 그 경우 생성된 기록은 서버가 음성을 받자마자 제공자 계정에서 삭제합니다(제공자 내부 보관까지 없어진다고는 말하지 않음). 처리방침(시행일 2026-11-13)에 적혀 있습니다.
- 어린이에게 묻지 않고, 설정을 열 때마다 부모 확인이 있으며, 쓰지 않으면 이름은 어디로도 가지 않습니다.

**AI 그림·음성 출처**
- 모든 그림은 OpenAI 이미지 생성 도구(ChatGPT·Codex)로 상업 이용이 되는 요금제에서 만들고 직접 종이 오림 스타일로 구성했습니다. 앱에 실제 아이 사진은 쓰거나 보이지 않으며, 이름 녹음 말고 실행 중 만드는 콘텐츠는 없습니다.
- 해설은 ElevenLabs·Typecast(상업 요금제)로 미리 녹음해 오디오 파일로 담았습니다.
- 효과음·음악은 CC0·CC BY·Pixabay 라이선스이며 앱 안 크레딧 4줄이 있습니다(보호자 메뉴 > 정보 > 그림·소리 출처).
- 이야기는 공공 영역의 전래동화·우화이고 글·그림·연기는 자체 제작입니다.

## 확인할 것 (사용자)
- **공지 경로 배포**: `GET /v1/notices` 는 서버 코드에만 있고 아직 배포 전입니다(2026-11-13). 제출 전에 `wrangler deploy` 로 올리고 `curl https://paper-tale-sync.papertale.workers.dev/v1/notices` 가 공지 목록을 돌려주는지 확인하세요. 배포 전에는 앱의 공지사항이 '공지가 없어요'로만 보입니다(메뉴는 깨지지 않음).
- 줄인 곳(2026-11-13, 4000자 안에 넣느라): 손가락 힌트 5초, 언어 메뉴 위치, Education/Books, 구름 공장 3명+강아지 줄을 영어 본문에서 뺐습니다(한국어 확인용에는 남김).
- **쿠폰 칸**: 앱·서버 코드에서 제거됨(2026-11-13). 이 빌드로 제출하면 노트의 "No coupon or redeem-code feature"가 사실입니다. 남은 일: 서버 배포 + `wrangler secret delete COUPON_SHA256`.
- '아이 대사 반대 모습 녹음이 있다'는 줄과 '실제 아이 사진은 쓰지 않음' 줄은 공개 사실 범위에서 쓴 것입니다. 창작 동화 일부는 만들 때 가족 사진을 그림 참고로 쓴 적이 있어(CLAUDE.md §1 예외) '얼굴 없음'이라고는 쓰지 않았습니다.
- 서버가 켜져 있어야 합니다(구매 검증·이름 녹음). 서버가 꺼져 있을 때의 실제 구동은 시험하지 않았습니다.
- ElevenLabs zero-retention 적용 여부는 확인된 기록이 없습니다(노트는 '요청한다'까지만 씀). 2026-11-13: Creator 요금제는 옵션을 무시해 기록이 남는 것을 확인 → 서버가 즉시 삭제하도록 함.
