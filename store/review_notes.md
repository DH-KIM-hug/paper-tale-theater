# 심사 노트 (App Review Information > Notes)

작성일 2026-11-06. 아래 영어 본문을 'Notes' 칸에 그대로 붙여 넣고, 한국어는 사용자 확인용입니다. 로그인 정보 칸은 **'로그인 필요 없음'** 으로 체크(Sign-in required 끄기). 연락처는 hello@ddoystory.com (전화번호는 사용자가 입력).

## English (paste this)
```
Tok Tok Tale Theater (working title) is an interactive storybook app for ages 2-5 (Kids Category, ages 5 and under). There is no account, sign-up or login. The app works fully offline; all tales, art and voices are bundled in the app.

HOW TO REVIEW
1. Launch the app. The Home screen lists the tales. Four tales are always free (The Rabbit and the Turtle, The Giant Turnip, Cinderella, The Tiger and the Red Bean Porridge); original tales are free; four more tales are free each week. Other tales show a lock.
2. Tap any free tale, then tap "Start story" (or Play). The child taps highlighted objects to move the story along. If nothing is tapped for 5 seconds a finger hint appears.
3. "Read to Me" tab (moon icon): plays tales as bedtime stories with no interaction. It keeps playing with the screen off (UIBackgroundModes: audio is used only for this feature).
4. Sticker Book tab: stickers collected by finishing tales, and "My Stage" where stickers are arranged. Everything stays on the device.
5. Language: the grown-up menu > Language switches Korean/English.

PARENT AREA AND PARENTAL GATE
- Hold the gear icon at the top right of Home for 1 second. This opens the grown-up menu (with VoiceOver: double-tap).
- Inside, anything that spends money, links devices, shows documents, picks a locked tale, erases records, or changes a child's name opens a parental gate: a multiplication question (for example 7 x 8); the correct answer must be PRESSED AND HELD for 1.5 seconds. A wrong answer locks the gate for 30 seconds.
- Purchase and Restore Purchases are in grown-up menu > "Access" (이용권 / Access). There are no external links or web views anywhere in the app.

IN-APP PURCHASES (both are shown only in the parent area, behind the gate)
- com.papertale.theater.unlockall (non-consumable, $4.99): unlocks all tales and includes one child-name setup for the original tales.
- com.papertale.theater.rename (consumable, $0.99): "Name Change Pass", needed only to change the child's name again. It is sold only on a device that already owns Unlock All; the server re-checks that from the receipt and accepts each transaction ID once. Unused passes are recorded on the server account because consumables cannot be restored. Promoted in-app purchase is turned off for this product.
- To test: use a Sandbox tester. Go to the grown-up menu > Access > "Unlock all tales $4.99". Restore is the button next to it.

CHILD NAME FEATURE (optional, grown-ups only; shown in the grown-up menu as "Child's name" after Unlock All)
- A parent can replace the main character's name in the original tales with their child's name. Because our rule is that every spoken line is a recording (no on-device speech synthesis), only the lines that contain the name are re-recorded with the same voice.
- The typed name is sent once, over HTTPS, to our server, which asks the speech service (ElevenLabs) to render the lines and returns the audio files. The audio files are stored only on the device.
- The server does NOT store the name and does not write it to logs. No account ID, device ID or any other identifier is sent to the speech service with it. We request the speech service's zero-retention option where the plan allows it.
- It is never asked of the child; it is entered by a parent after the parental gate, and it is optional. If it is never used, no name is ever sent. Our privacy policy and App Privacy answers describe this.

SERVER (Cloudflare Workers + KV) - what it is for
- Optional device linking: the app creates a random ID on first launch (no name, email or other personal data). A parent can make an 8-digit link code (valid 10 minutes, single use) to connect another device (for example an iPad and an iPhone). 
- Stores only: the random ID and a hash of its secret, progress (first-launch date, finished tales, stickers, unlocked tales), and the purchase result (owned or not, hashed receipt). No IP address or device type is read or stored.
- Purchase verification: the StoreKit 2 transaction is verified on the server (App Store Server signed data, checked against the Apple Root CA G3).
- The app works without the server. No ads, no third-party analytics or tracking SDKs.

AI-GENERATED ARTWORK AND VOICES
- All illustrations were generated with OpenAI image generation tools (ChatGPT / Codex) and composed by us in a paper-cut style. No real children's photos are used in the app's artwork, and there is no user-generated or AI-generated content created at runtime.
- Narration was recorded with ElevenLabs (commercial plan) in advance and is bundled as audio files. The only runtime generation is the optional child-name lines described above.
- Sound effects and music use CC0, CC BY and Pixabay Content License sources that allow commercial use; credits are in the app (grown-up menu > About > Credits).
- The stories are traditional folk tales and fables in the public domain; the text, art and voice performances are our own.

NOTES
- Four original tales feature a girl character; the child's name can be replaced as described above.
- Screen time: the grown-up menu has a play-time limit.
Contact: hello@ddoystory.com
```

## 한국어 번역 (확인용)
톡톡 동화극장(가제)은 2~5세용 인터랙티브 동화 앱입니다(Kids 카테고리, 5세 이하). 가입·로그인이 없고, 동화·그림·목소리가 모두 앱 안에 들어 있어 오프라인으로 작동합니다.

**심사 방법**
1. 앱을 열면 홈에 동화 목록이 있습니다. 항상 무료 4편(토끼와 거북이, 커다란 순무, 신데렐라, 팥죽할멈과 호랑이), 창작 동화, 매주 바뀌는 무료 4편이 열리고 나머지는 잠겨 있습니다.
2. 무료 동화를 눌러 '이야기 시작'(또는 놀이)을 누르면 아이가 강조된 물건을 눌러 이야기를 진행합니다. 5초 동안 안 누르면 손가락 힌트가 나옵니다.
3. '읽어 주기' 탭(달 아이콘)은 상호작용 없이 잠자리 동화를 읽어 줍니다. 화면을 꺼도 계속 재생되며, 백그라운드 오디오는 이 기능에만 씁니다.
4. 스티커북 탭: 동화를 끝내 모은 스티커와 '내 무대'. 모두 기기 안에만 있습니다.
5. 보호자 메뉴 > 언어에서 한국어/영어 전환.

**보호자 영역과 부모 확인**
- 홈 오른쪽 위 톱니를 1초 꾹 누르면 보호자 메뉴가 열립니다(VoiceOver 는 두 번 탭).
- 안에서 결제, 기기 연결, 문서 보기, 잠긴 동화 고르기, 기록 지우기, 아이 이름 바꾸기는 모두 부모 확인(곱셈 문제 정답을 1.5초 꾹, 틀리면 30초 잠금)을 거칩니다.
- 구매·구매 복원은 보호자 메뉴 > 이용권에 있습니다. 앱 안에는 외부 링크나 웹뷰가 없습니다.

**인앱 구입** (둘 다 부모 확인 뒤 보호자 영역에만 보임)
- `com.papertale.theater.unlockall`(비소모성, 4.99달러): 모든 동화 해제, 창작 동화 아이 이름 정하기 1회 포함.
- `com.papertale.theater.rename`(소모성, 0.99달러): 이름을 다시 바꿀 때만. 전체 해제를 산 기기에서만 판매, 서버가 영수증으로 소유를 다시 확인하고 거래 ID를 한 번만 받습니다. 소모성은 복원이 안 되어 안 쓴 이용권은 서버 계정에 기록합니다. 홍보용 구입은 끔.
- 시험: Sandbox 계정으로 보호자 메뉴 > 이용권 > '모든 동화 열기 $4.99'. 옆이 구매 복원.

**아이 이름 기능** (선택, 보호자 전용, 전체 해제 후 보호자 메뉴 '우리 아이 이름')
- 보호자가 창작 동화 주인공 이름을 우리 아이 이름으로 바꿉니다. 말은 모두 녹음으로만 하는 원칙이라, 이름이 든 줄만 같은 목소리로 새로 녹음합니다.
- 입력한 이름은 HTTPS로 우리 서버에 한 번 보내지고, 서버가 음성 서비스(ElevenLabs)에 줄을 만들게 해 오디오를 돌려받습니다. 오디오는 기기에만 저장됩니다.
- 서버는 이름을 저장하지 않고 로그에도 쓰지 않습니다. 계정·기기 식별자는 함께 보내지 않습니다. 요금제가 허용하는 범위에서 음성 서비스의 보관 안 함(zero retention) 옵션을 요청합니다.
- 어린이에게 묻지 않고, 부모 확인 뒤 보호자가 입력하며 선택 사항입니다. 쓰지 않으면 이름은 어디로도 가지 않습니다.

**서버(Cloudflare Workers + KV) 용도**
- 선택 기능인 기기 연결: 앱이 처음 켜질 때 무작위 ID를 만들고(이름·이메일 없음), 보호자가 8자리 연결 코드(10분, 1회용)로 다른 기기를 잇습니다.
- 저장: 무작위 ID와 비밀값의 해시, 진행 기록(첫 실행 날짜, 완주 동화, 스티커, 열어 둔 동화), 구매 결과(소유 여부, 영수증 해시). IP·기기 종류는 읽거나 저장하지 않습니다.
- 구매 검증: StoreKit 2 거래를 서버에서 검증(Apple Root CA G3 기준).
- 서버가 없어도 앱은 작동합니다. 광고·제3자 분석·추적 없음.

**AI 그림·음성 출처**
- 모든 그림은 OpenAI 이미지 생성 도구(ChatGPT·Codex)로 만들고 직접 종이 오림 스타일로 구성했습니다. 앱 그림에 실제 아이 사진은 쓰지 않았고, 실행 중 사용자·AI가 만드는 콘텐츠는 없습니다.
- 해설은 ElevenLabs(상업 요금제)로 미리 녹음해 앱에 오디오 파일로 담았습니다. 실행 중 생성은 위 이름 줄뿐입니다.
- 효과음·음악은 상업 이용이 되는 CC0·CC BY·Pixabay 라이선스이며 앱 안에 크레딧이 있습니다(보호자 메뉴 > 정보 > 크레딧).
- 이야기는 공공 영역의 전래동화·우화이고 글·그림·연기는 자체 제작입니다.

## 확인할 것 (사용자)
- 위 본문 중 **"Four original tales feature a girl character"** 줄은 공개 사실이라 빼도 됩니다. 심사관이 원작과 다른 아이 그림에 의문을 가질 때를 대비해 넣었습니다. 이름 기능이 1.0에 실제로 켜진 빌드인지(서버 `/v1/name/*` 배포, 앱 `namesOn()`)를 올리기 전에 확인하고, 안 켜진 빌드라면 'CHILD NAME FEATURE' 절을 통째로 지우세요.
- 'Access' 화면 이름은 한국어 '이용권'(영어 'Access'): 스크린샷은 `screenshots/raw/*_10_iap_unlock.png`.
- 읽어 주기 탭 이름은 영어 UI 에서 'Read to Me' 입니다.
- 심사 중에는 서버가 켜져 있어야 합니다(구매 검증·연결). 서버가 꺼져 있어도 앱은 작동하도록 설계됐지만(entitlements.js 주석) 영수증 검증과 이름 기능은 서버에 의존합니다. 이번 작업에서 서버 꺼짐 상태의 실제 구동은 시험하지 않았습니다.
