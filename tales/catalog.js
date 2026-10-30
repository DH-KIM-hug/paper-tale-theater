/* 톡톡 동화극장 — 동화 목록(카탈로그)
   홈 화면(index.html · home.js)이 이 목록으로 선반과 태그를 만든다. 빌드 없음, 전역 변수.

   동화 한 편:
     id      폴더 이름과 같다 (tales/<folder>/index.html)
     title   동화 제목 (탭하면 읽어 준다)
     origin  이야기 종류 태그 하나: aesop | korean | world | original(창작 동화)
     also    (선택) 덧붙는 이야기 태그들. 예: ['princess'] = 공주 동화. origin 은 그대로 두고
             필터에서만 함께 잡힌다. 앞으로 공주 동화(라푼젤, 인어공주, 잠자는 숲속의 공주,
             미녀와 야수, 완두콩 공주, 개구리 왕자)는 origin 은 원작 갈래로, also: ['princess'] 를 붙인다.
             동물이 주인공인 이솝 밖 동화(아기 돼지 삼형제·늑대와 아기 염소·브레멘·미운 아기 오리·곰 세 마리·까치)는 also: ['animal'] → 홈 '동물 이야기' 줄에도 나온다(2026-10-28 사용자 지적).
     skills  배우는 것 태그 1~3개 (TAGS.skill 의 key): count | size | order | sort | spot | sound | shape | season | heart | position(위치말: 위·아래·옆).
             hideUnused: true 인 태그(position)는 그 태그를 가진 동화가 하나도 없으면 칩을 숨긴다.
     line    보호자용 한 줄 소개 (아이는 못 읽어도 된다)
     ready   true  = 공개된 동화. 바로 열린다.
             false = 아직 없음. 커튼 닫힌 카드("곧 열려요").
     read    true  = 읽어 주기(잠자리 탭)가 준비된 동화: tales/<id>/read_script_el.json + read_narration_el.js 가 있고 동화 js 가 T.readPlay(...) 로 갈라진다.
             readMin = 읽는 데 걸리는 분(녹음 길이 합 + 줄 사이 쉼, 녹음 없는 줄은 글자 수로 어림). 잠자리 탭 타일의 작은 글자.
             readEn: true = 영어 읽기 대본·녹음(read_script_en.json + read_narration_el_en.js)도 있다. 확인: node tools/app/check_app_data.mjs
     making  true  = 지금 만드는 중. 홈이 열릴 때 tales/<folder>/index.html 과 <folder>.js 가
                     둘 다 있는지 확인해서, 있으면 저절로 열린다. (없는 폴더는 확인하지 않는다 —
                     404 로그를 남기지 않기 위해서.) 새 동화를 만들기 시작하면 making: true 로 바꾼다.
     art     썸네일: 종이를 오려 붙인 느낌의 단순한 SVG 조각 (viewBox 0 0 160 110).
             <g class="pc"> 안의 조각은 엔진처럼 얕은 종이 그림자를 받는다. 이모지 금지. */

const TAGS = {
  origin: [
    { key: 'aesop',  label: '이솝 우화',   say: '이솝 우화',       color: '#3F6B4F', en: 'Aesop' },
    { key: 'korean', label: '한국 전래',   say: '한국 전래동화',   color: '#A93B32', en: 'Korean' },
    { key: 'world',  label: '외국 전래',   say: '외국 전래동화',   color: '#1F2A56', en: 'World' },
    { key: 'original', label: '창작 동화', say: '창작 동화',       color: '#E8703A', en: 'Original' },
    { key: 'princess', label: '공주 동화', say: '공주 동화',       color: '#8B2F5A', en: 'Princess' },
  ],
  skill: [
    { key: 'count',  label: '수 세기',     say: '수 세기' },
    { key: 'size',   label: '크기 비교',   say: '크기 비교' },
    { key: 'order',  label: '순서',        say: '순서' },
    { key: 'sort',   label: '분류',        say: '분류하기' },
    { key: 'spot',   label: '차이 찾기',   say: '관찰하고 차이 찾기' },
    { key: 'sound',  label: '소리 듣기',   say: '소리 듣기' },
    { key: 'shape',  label: '모양 맞추기', say: '모양 맞추기' },
    { key: 'season', label: '날씨·계절',   say: '날씨와 계절' },
    { key: 'heart',  label: '마음·배려',   say: '마음과 배려' },
    { key: 'position', label: '위치말',    say: '위치말', en: 'Position words', hideUnused: true },
  ],
};

/* 썸네일 색 (DESIGN_SYSTEM 팔레트) */
const _C = { cr: '#F6ECD8', gd: '#D9A94E', ps: '#E8703A', rd: '#A93B32', bk: '#6B4A32', pn: '#3F6B4F',
  ind: '#1F2A56', lv: '#8B7BB8', sn: '#F4F6FA', am: '#F2B366', ink: '#2E241C', lf: '#6E9A5B',
  sk: '#F3D9B8', gy: '#A9A39B', ck: '#E9A0A0', dk: '#3A3230' };

const TALES = (() => {
  const c = _C;
  const eye = (x, y, r = 1.8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.ink}"/>`;
  return [
  /* ───────── 공개된 동화 ───────── */
  { id: 'patjuk', title: '팥죽할멈과 호랑이', origin: 'korean', skills: ['order', 'spot', 'heart'], ready: true, read: true, readEn: true, readMin: 7,
    line: '친구들을 알맞은 자리에 불러 호랑이를 혼내 줘요.',
    en: { title: 'The Tiger and the Red Bean Porridge', line: 'Call your friends to the right spots and give the tiger a lesson.' },
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><circle cx="134" cy="22" r="11" fill="${c.cr}"/><rect y="88" width="160" height="22" fill="${c.bk}"/>
      <path d="M40 90 L45 60 Q58 53 71 60 L76 90Z" fill="${c.cr}"/>
      <circle cx="58" cy="42" r="15" fill="${c.sk}"/><path d="M43 41 a15 15 0 0 1 30 0 q-15 -6 -30 0z" fill="${c.gy}"/>
      ${eye(53, 45)}${eye(63, 45)}<circle cx="49" cy="50" r="2.6" fill="${c.ck}"/><circle cx="67" cy="50" r="2.6" fill="${c.ck}"/>
      <path d="M34 72 H98 Q98 100 66 100 Q34 100 34 72Z" fill="${c.dk}"/><ellipse cx="66" cy="72" rx="32" ry="6" fill="${c.rd}"/>
      <rect x="106" y="76" width="26" height="24" rx="9" fill="${c.ps}"/>
      <circle cx="107" cy="53" r="5" fill="${c.ps}"/><circle cx="131" cy="53" r="5" fill="${c.ps}"/><circle cx="119" cy="66" r="15" fill="${c.ps}"/>
      <ellipse cx="119" cy="72" rx="7" ry="5" fill="${c.cr}"/>${eye(114, 63)}${eye(124, 63)}
      <path d="M113 53 l2 5 M119 52 v6 M125 53 l-2 5" stroke="${c.ink}" stroke-width="2.4" stroke-linecap="round"/></g>` },

  { id: 'frog', title: '황소와 개구리', origin: 'aesop', skills: ['size', 'heart'], ready: true, read: true, readMin: 5,
    line: '누가 더 클까? 둘씩 크기를 견주고, 나는 나대로 멋지다는 걸 알아요.',
    en: { title: 'The Ox and the Frog', line: 'Who is bigger? Compare sizes two by two, and learn that you are wonderful just as you are.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="78" width="160" height="32" fill="${c.pn}"/><ellipse cx="46" cy="94" rx="42" ry="10" fill="${c.lv}"/>
      <rect x="84" y="40" width="66" height="40" rx="15" fill="${c.bk}"/><rect x="92" y="72" width="9" height="16" fill="${c.bk}"/><rect x="134" y="72" width="9" height="16" fill="${c.bk}"/>
      <path d="M86 36 q-8 -12 2 -18 M106 36 q8 -12 -2 -18" stroke="${c.cr}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="96" cy="48" r="17" fill="${c.bk}"/><ellipse cx="90" cy="58" rx="9" ry="6" fill="${c.ck}"/>${eye(98, 44, 2.2)}
      <ellipse cx="46" cy="92" rx="18" ry="5" fill="${c.pn}"/><ellipse cx="46" cy="82" rx="13" ry="9" fill="${c.lf}"/>
      <circle cx="40" cy="73" r="5" fill="${c.lf}"/><circle cx="52" cy="73" r="5" fill="${c.lf}"/>
      <circle cx="40" cy="73" r="3" fill="#fff"/><circle cx="52" cy="73" r="3" fill="#fff"/>${eye(40, 73, 1.4)}${eye(52, 73, 1.4)}</g>` },

  { id: 'rabbit', title: '토끼와 거북이', origin: 'aesop', skills: ['sound', 'heart'], ready: true, read: true, readMin: 7,
    line: '응원하는 동물들의 울음소리로 응원하며, 느려도 끝까지 가는 달리기.',
    en: { title: 'The Rabbit and the Turtle', line: 'A race cheered on by animal calls, where slow and steady wins.' },
    art: `<rect width="160" height="110" fill="${c.am}"/>
      <g class="pc"><path d="M0 70 Q60 44 160 66 V110 H0Z" fill="${c.lf}"/><rect y="90" width="160" height="20" fill="${c.pn}"/>
      <rect x="134" y="30" width="3" height="46" fill="${c.bk}"/><path d="M137 30 h18 l-5 7 5 7 h-18z" fill="${c.rd}"/>
      <ellipse cx="44" cy="84" rx="22" ry="13" fill="${c.pn}"/><path d="M26 84 h36" stroke="${c.lf}" stroke-width="3"/>
      <circle cx="68" cy="84" r="7" fill="${c.lf}"/>${eye(70, 82)}
      <ellipse cx="102" cy="72" rx="12" ry="14" fill="${c.sn}"/><ellipse cx="97" cy="42" rx="4" ry="13" fill="${c.sn}"/><ellipse cx="107" cy="42" rx="4" ry="13" fill="${c.sn}"/>
      <circle cx="102" cy="56" r="10" fill="${c.sn}"/>${eye(98, 55)}<circle cx="96" cy="60" r="2" fill="${c.ck}"/></g>` },

  { id: 'sunmoon', title: '해와 달이 된 오누이', origin: 'korean', skills: ['spot', 'heart'], ready: true, read: true, readMin: 9,
    line: '수상한 손을 알아보고, 튼튼한 동아줄을 골라 하늘로 올라가요.',
    en: { title: 'The Sun and the Moon', line: 'Spot the tiger\'s sneaky paw, pick the strong rope, and climb up to the sky.' },
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><path d="M0 92 Q40 80 80 90 T160 86 V110 H0Z" fill="${c.lv}"/>
      <circle cx="40" cy="36" r="17" fill="${c.am}"/><circle cx="118" cy="32" r="14" fill="${c.cr}"/><circle cx="125" cy="27" r="12" fill="${c.ind}"/>
      <rect x="78" y="0" width="4" height="70" fill="${c.gd}"/>
      <circle cx="80" cy="74" r="7" fill="${c.sk}"/><path d="M72 72 a8 8 0 0 1 16 0z" fill="${c.ink}"/><rect x="74" y="80" width="12" height="14" rx="4" fill="${c.rd}"/></g>` },

  { id: 'sun_wind', title: '해와 바람', origin: 'aesop', skills: ['season', 'heart'], ready: true, read: true, readMin: 5,
    line: '세게 부는 바람과 따뜻한 햇볕, 누가 외투를 벗길까요?',
    en: { title: 'The Sun and the Wind', line: 'A blustery wind and the warm sun: who can make the traveler take off the coat?' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="90" width="160" height="20" fill="${c.lf}"/>
      <circle cx="34" cy="30" r="18" fill="${c.am}"/>
      <path d="M92 36 a12 12 0 0 1 22 -8 a13 13 0 0 1 24 6 a9 9 0 0 1 -2 18 h-40 a9 9 0 0 1 -4 -16z" fill="${c.sn}"/>
      <path d="M86 62 h26 M92 70 h18" stroke="${c.sn}" stroke-width="4" stroke-linecap="round"/>
      <path d="M60 94 L64 66 Q70 60 76 66 L80 94Z" fill="${c.ps}"/><circle cx="70" cy="56" r="8" fill="${c.sk}"/><path d="M61 54 h18 l-3 -7 h-12z" fill="${c.bk}"/></g>` },

  { id: 'turnip', title: '커다란 순무', origin: 'world', skills: ['order', 'size', 'heart'], ready: true, read: true, readMin: 5,
    line: '할아버지부터 생쥐까지, 차례대로 불러 다 함께 영차!',
    en: { title: 'The Giant Turnip', line: 'From Grandpa all the way to the mouse, everyone is called in turn to heave-ho together!' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="80" width="160" height="30" fill="${c.bk}"/>
      <path d="M28 44 l-8 -26 M36 42 v-30 M44 44 l8 -26" stroke="${c.pn}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="36" cy="66" r="24" fill="${c.sn}"/><path d="M14 58 a24 24 0 0 1 44 0z" fill="${c.ck}"/>
      <circle cx="74" cy="60" r="11" fill="${c.sk}"/><rect x="65" y="70" width="18" height="20" rx="5" fill="${c.pn}"/>
      <circle cx="98" cy="64" r="9" fill="${c.sk}"/><rect x="91" y="72" width="14" height="18" rx="5" fill="${c.rd}"/>
      <circle cx="117" cy="72" r="7" fill="${c.sk}"/><rect x="112" y="78" width="10" height="12" rx="4" fill="${c.gd}"/>
      <circle cx="133" cy="80" r="6" fill="${c.bk}"/><circle cx="146" cy="85" r="5" fill="${c.dk}"/><circle cx="156" cy="88" r="3.5" fill="${c.gy}"/></g>` },

  { id: 'lion_mouse', title: '사자와 생쥐', origin: 'aesop', skills: ['size', 'count', 'heart'], ready: true, read: true, readMin: 5,
    line: '작은 생쥐가 그물을 갉아 커다란 사자를 구해요.',
    en: { title: 'The Lion and the Mouse', line: 'A tiny mouse gnaws through the net and saves the big lion.' },
    art: `<rect width="160" height="110" fill="${c.gd}"/>
      <g class="pc"><rect y="88" width="160" height="22" fill="${c.bk}"/>
      <circle cx="58" cy="52" r="32" fill="${c.ps}"/><circle cx="58" cy="54" r="21" fill="${c.am}"/>
      ${eye(51, 50, 2.4)}${eye(65, 50, 2.4)}<ellipse cx="58" cy="60" rx="5" ry="3.5" fill="${c.bk}"/>
      <path d="M20 8 Q58 -2 96 8 L104 88 H12Z" fill="none" stroke="${c.bk}" stroke-width="2"/>
      <path d="M26 30 Q58 24 92 30 M22 50 Q58 44 96 50 M18 70 Q58 64 100 70 M38 6 L30 88 M58 4 V88 M78 6 L86 88" stroke="${c.bk}" stroke-width="2" fill="none"/>
      <ellipse cx="128" cy="82" rx="13" ry="9" fill="${c.gy}"/><circle cx="120" cy="72" r="6" fill="${c.gy}"/><circle cx="118" cy="70" r="2.5" fill="${c.ck}"/>
      ${eye(124, 76, 1.5)}<path d="M141 84 q10 -2 12 -12" stroke="${c.gy}" stroke-width="2.5" fill="none"/></g>` },

  { id: 'fox_crane', title: '여우와 두루미', origin: 'aesop', skills: ['shape', 'heart'], ready: true, read: true, readMin: 5,
    line: '납작한 접시와 목이 긴 병, 입 모양에 맞는 그릇을 골라 줘요.',
    en: { title: 'The Fox and the Crane', line: 'Flat plate or tall bottle? Pick the dish that fits each mouth.' },
    art: `<rect width="160" height="110" fill="${c.pn}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.bk}"/>
      <ellipse cx="44" cy="84" rx="28" ry="6" fill="${c.cr}"/>
      <path d="M104 84 V52 q0 -6 5 -8 V28 h8 v16 q5 2 5 8 V84z" fill="${c.rd}"/>
      <path d="M26 64 L34 44 L42 56 L52 44 L58 64 Q42 74 26 64Z" fill="${c.ps}"/><path d="M34 66 L42 78 L50 66Z" fill="${c.cr}"/>${eye(36, 60)}${eye(48, 60)}
      <circle cx="138" cy="40" r="9" fill="${c.sn}"/><circle cx="140" cy="31" r="3" fill="${c.rd}"/>${eye(135, 39)}
      <path d="M130 42 L110 50 L130 46Z" fill="${c.gd}"/><rect x="136" y="48" width="4" height="30" fill="${c.sn}"/></g>` },

  /* ───────── 만드는 중 (파일이 생기면 저절로 열린다) ───────── */
  { id: 'goldilocks', title: '골디락스와 곰 세 마리', origin: 'world', also: ['animal'], skills: ['size', 'shape', 'heart'], ready: true, read: true, readMin: 6,
    line: '큰 그릇은 큰 곰, 작은 의자는 아기 곰. 크기대로 주인을 찾아 줘요.',
    en: { title: 'Goldilocks and the Three Bears', line: 'Big bowl for the big bear, little chair for Baby Bear. Match each one by size.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.bk}"/>
      <path d="M8 60 h44 q0 24 -22 24 q-22 0 -22 -24z" fill="${c.rd}"/>
      <path d="M62 68 h32 q0 16 -16 16 q-16 0 -16 -16z" fill="${c.gd}"/>
      <path d="M104 74 h20 q0 10 -10 10 q-10 0 -10 -10z" fill="${c.ps}"/>
      <circle cx="142" cy="46" r="11" fill="${c.am}"/><circle cx="142" cy="50" r="8" fill="${c.sk}"/>${eye(139, 50, 1.4)}
      <path d="M134 58 h16 l4 26 h-24z" fill="${c.lf}"/></g>` },

  { id: 'bremen', title: '브레멘 음악대', origin: 'world', also: ['animal'], skills: ['sound', 'order', 'size'], ready: true, read: true, readMin: 7,
    line: '소리로 친구를 알아맞히고, 큰 동물부터 차례로 탑을 쌓아요.',
    en: { title: 'The Bremen Town Musicians', line: 'Guess each friend by sound, then stack a tower from the biggest animal up.' },
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><rect x="104" y="30" width="36" height="30" fill="${c.am}"/><path d="M122 30 v30 M104 45 h36" stroke="${c.bk}" stroke-width="3"/>
      <rect y="94" width="160" height="16" fill="${c.bk}"/>
      <rect x="34" y="70" width="52" height="24" rx="8" fill="${c.gy}"/><rect x="38" y="90" width="7" height="8" fill="${c.gy}"/><rect x="74" y="90" width="7" height="8" fill="${c.gy}"/>
      <rect x="40" y="54" width="40" height="18" rx="7" fill="${c.bk}"/>
      <rect x="46" y="40" width="28" height="15" rx="6" fill="${c.dk}"/>
      <circle cx="60" cy="30" r="9" fill="${c.sn}"/><path d="M56 21 l2 -5 2 4 2 -4 2 5z" fill="${c.rd}"/><path d="M51 30 l-5 2 5 2z" fill="${c.gd}"/></g>` },

  { id: 'ant_grasshopper', title: '개미와 베짱이', origin: 'aesop', skills: ['season', 'count', 'heart'], ready: true, read: true, readMin: 6,
    line: '여름에 부지런히 모은 먹이로, 겨울에 친구들과 음악회를 열어요.',
    en: { title: 'The Ant and the Grasshopper', line: 'With food gathered all summer, the ants and their friends hold a winter concert.' },
    art: `<rect width="80" height="110" fill="${c.gd}"/><rect x="80" width="80" height="110" fill="${c.sn}"/>
      <g class="pc"><rect y="88" width="80" height="22" fill="${c.lf}"/><rect x="80" y="88" width="80" height="22" fill="#DDE3EC"/>
      <circle cx="18" cy="22" r="10" fill="${c.am}"/>
      <circle cx="30" cy="80" r="5" fill="${c.ink}"/><circle cx="40" cy="80" r="4" fill="${c.ink}"/><circle cx="48" cy="77" r="4" fill="${c.ink}"/><circle cx="50" cy="68" r="6" fill="${c.am}"/>
      <rect x="100" y="54" width="44" height="34" fill="${c.bk}"/><path d="M96 56 L122 36 L148 56Z" fill="${c.rd}"/><rect x="116" y="68" width="12" height="20" fill="${c.am}"/>
      <circle cx="96" cy="20" r="2" fill="#C9D3E2"/><circle cx="140" cy="16" r="2" fill="#C9D3E2"/><circle cx="118" cy="26" r="2" fill="#C9D3E2"/></g>` },

  { id: 'ugly_duckling', title: '미운 아기 오리', origin: 'world', also: ['animal'], skills: ['heart', 'order'], ready: true, read: true, readMin: 8,
    line: '놀림받던 아기 오리의 마음을 알아주고, 백조로 자라는 순서를 맞춰요.',
    en: { title: 'The Ugly Duckling', line: 'Understand the teased duckling\'s feelings, then put its growing-up steps in order.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="70" width="160" height="40" fill="${c.lv}"/><path d="M0 70 h160" stroke="${c.pn}" stroke-width="6"/>
      <ellipse cx="48" cy="80" rx="14" ry="8" fill="${c.gy}"/><circle cx="40" cy="68" r="7" fill="${c.gy}"/><path d="M33 68 l-6 2 6 2z" fill="${c.dk}"/>${eye(39, 66, 1.3)}
      <ellipse cx="112" cy="78" rx="24" ry="11" fill="${c.sn}"/><path d="M96 74 q-6 -30 8 -34 q8 -2 8 6" stroke="${c.sn}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M112 44 l8 3 -8 3z" fill="${c.ps}"/>${eye(108, 44, 1.4)}</g>` },

  /* ───────── 계획된 동화 (TALES_PLAN_2) ───────── */
  { id: 'three_pigs', title: '아기 돼지 삼형제', origin: 'world', also: ['animal'], skills: ['count', 'order', 'size'], ready: true, read: true, readMin: 7,
    line: '짚 집, 나무 집, 벽돌 집. 벽돌을 톡톡 쌓아 막내 집을 지켜요.',
    en: { title: 'The Three Little Pigs', line: 'A straw house, a wood house, a brick house. Stack the bricks tap by tap to keep the youngest pig safe.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="88" width="160" height="22" fill="${c.lf}"/>
      <rect x="10" y="62" width="36" height="26" fill="${c.gd}"/><path d="M6 64 L28 42 L50 64Z" fill="${c.am}"/>
      <rect x="62" y="58" width="36" height="30" fill="${c.bk}"/><path d="M58 60 L80 36 L102 60Z" fill="${c.dk}"/>
      <rect x="114" y="52" width="38" height="36" fill="${c.rd}"/><path d="M110 54 L133 30 L156 54Z" fill="${c.bk}"/>
      <path d="M114 64 h38 M114 76 h38 M126 52 v12 M140 64 v12 M126 76 v12" stroke="${c.cr}" stroke-width="1.6"/>
      <circle cx="133" cy="94" r="9" fill="${c.ck}"/><ellipse cx="133" cy="97" rx="4" ry="3" fill="#D98888"/></g>` },

  { id: 'wolf_goats', title: '늑대와 일곱 마리 아기 염소', origin: 'world', also: ['animal'], skills: ['count', 'spot', 'heart'], ready: true, read: true, readMin: 8,
    line: '시계 안, 이불 밑, 커튼 뒤. 숨은 아기 염소를 하나씩 세며 찾아요.',
    en: { title: 'The Wolf and the Seven Kids', line: 'Behind the clock, under the quilt, inside the laundry: find the hidden little goats one by one.' },
    art: `<rect width="160" height="110" fill="${c.am}"/>
      <g class="pc"><rect y="92" width="160" height="18" fill="${c.bk}"/>
      <rect x="92" y="14" width="40" height="80" rx="4" fill="${c.bk}"/><circle cx="112" cy="36" r="13" fill="${c.cr}"/><path d="M112 36 v-8 M112 36 h6" stroke="${c.ink}" stroke-width="2"/>
      <rect x="100" y="56" width="24" height="32" fill="${c.dk}"/><circle cx="112" cy="72" r="7" fill="${c.sn}"/>${eye(110, 71, 1.3)}
      ${[20, 34, 48, 62].map(x => `<circle cx="${x}" cy="84" r="6" fill="${c.sn}"/>`).join('')}
      <circle cx="27" cy="70" r="6" fill="${c.sn}"/><circle cx="41" cy="70" r="6" fill="${c.sn}"/><circle cx="55" cy="70" r="6" fill="${c.sn}"/></g>` },

  { id: 'kongjwi', title: '콩쥐 팥쥐', origin: 'korean', skills: ['count', 'shape', 'heart'], ready: true, read: true, readMin: 6,
    line: '독 구멍을 막고, 참새를 세고, 나비 꽃신을 찾아요.',
    en: { title: 'Kongjwi and Patjwi', line: 'Plug the jar, count the sparrows, and find the butterfly shoe.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.gd}"/>
      <path d="M14 62 h52 l-6 28 h-40z" fill="${c.bk}"/><path d="M94 62 h52 l-6 28 h-40z" fill="${c.bk}"/>
      ${[[26, 58], [36, 55], [46, 58], [56, 56], [31, 50], [45, 49]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c.am}"/>`).join('')}
      ${[[106, 58], [116, 55], [126, 58], [136, 56], [112, 50], [126, 49]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${c.rd}"/>`).join('')}
      <ellipse cx="80" cy="96" rx="13" ry="8" fill="${c.pn}"/><circle cx="74" cy="88" r="4" fill="${c.pn}"/><circle cx="86" cy="88" r="4" fill="${c.pn}"/>${eye(74, 88, 1.4)}${eye(86, 88, 1.4)}</g>` },

  { id: 'kkultteok', title: '구름 공장', origin: 'original', skills: ['count', 'heart', 'shape'], ready: true, read: true, readMin: 9,
    line: '구름 공장에서 구름을 만들고, 숨어 있던 아기 먹구름을 달래 무지개를 띄워요.',
    en: { title: 'The Cloud Factory', line: 'Make clouds at the cloud factory, cheer up a shy little rain cloud, and bring out a rainbow.' },
    art: `<rect width="160" height="110" fill="#BFE0EE"/>
      <g class="pc"><rect y="88" width="160" height="22" fill="${c.lf}"/>
      <rect x="20" y="40" width="22" height="50" fill="${c.rd}"/><rect x="16" y="36" width="30" height="8" fill="${c.bk}"/>
      ${[[34, 24], [46, 16], [58, 24]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c.sn}"/>`).join('')}
      <path d="M80 92 a46 46 0 0 1 72 0" fill="none" stroke="${c.rd}" stroke-width="7"/><path d="M87 92 a39 39 0 0 1 58 0" fill="none" stroke="${c.gd}" stroke-width="7"/><path d="M94 92 a32 32 0 0 1 44 0" fill="none" stroke="${c.pn}" stroke-width="7"/>
      <circle cx="104" cy="60" r="11" fill="${c.dk}"/><circle cx="118" cy="56" r="13" fill="${c.dk}"/><circle cx="130" cy="61" r="10" fill="${c.dk}"/>${eye(113, 58, 1.6)}${eye(123, 58, 1.6)}</g>` },

  { id: 'hansel', title: '헨젤과 그레텔', origin: 'world', skills: ['shape', 'spot', 'heart'], ready: true, read: true, readMin: 8,
    en: { title: 'Hansel and Gretel', line: 'Count the crumbs and candies, find the star key, and follow the way back home.' },
    line: '과자 집 지붕 무늬를 이어 붙이고, 빵 부스러기 길을 따라 집에 와요.',
    art: `<rect width="160" height="110" fill="${c.pn}"/>
      <g class="pc"><rect y="90" width="160" height="20" fill="${c.bk}"/>
      <rect x="44" y="50" width="72" height="42" fill="${c.bk}"/><path d="M36 54 L80 18 L124 54Z" fill="${c.cr}"/>
      ${[48, 62, 76, 90, 104].map((x, i) => `<circle cx="${x + 6}" cy="50" r="6" fill="${i % 2 ? c.gd : c.rd}"/>`).join('')}
      <rect x="70" y="66" width="20" height="26" rx="10" fill="${c.ps}"/><rect x="50" y="60" width="12" height="12" fill="${c.am}"/><rect x="98" y="60" width="12" height="12" fill="${c.am}"/>
      ${[[20, 100], [30, 96], [40, 101], [128, 98], [140, 102]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${c.am}"/>`).join('')}</g>` },

  { id: 'cinderella', title: '신데렐라', origin: 'world', also: ['princess'], skills: ['shape', 'size', 'heart'], ready: true, read: true, readMin: 7,
    line: '호박은 마차, 생쥐는 말. 짝을 맞추고 꼭 맞는 구두를 찾아요.',
    en: { title: 'Cinderella', line: 'A pumpkin becomes a coach, mice become horses. Count the clock strikes and find the slipper that fits.' },
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><circle cx="134" cy="20" r="9" fill="${c.cr}"/><path d="M0 94 Q80 86 160 94 V110 H0Z" fill="${c.lv}"/>
      <path d="M56 22 q4 -8 10 -6" stroke="${c.pn}" stroke-width="4" fill="none"/>
      <ellipse cx="60" cy="56" rx="38" ry="30" fill="${c.ps}"/><path d="M44 30 q-10 26 0 52 M76 30 q10 26 0 52 M60 26 v60" stroke="#C75A2C" stroke-width="3" fill="none"/>
      <rect x="50" y="46" width="20" height="16" rx="3" fill="${c.am}"/>
      <circle cx="34" cy="88" r="10" fill="${c.gd}"/><circle cx="86" cy="88" r="10" fill="${c.gd}"/><circle cx="34" cy="88" r="4" fill="${c.bk}"/><circle cx="86" cy="88" r="4" fill="${c.bk}"/>
      <path d="M118 80 h20 q8 0 8 8 h-34 l4 -6z" fill="${c.sn}"/><rect x="116" y="82" width="4" height="10" fill="${c.sn}"/></g>` },

  { id: 'heungbu', title: '흥부와 놀부', origin: 'korean', skills: ['heart', 'shape', 'count'], ready: true, read: true, readMin: 6,
    line: '다친 제비를 돌봐 주면, 박 속에서 좋은 일이 쏟아져요.',
    en: { title: 'Heungbu and Nolbu', line: 'Care for a hurt swallow, and good things pour out of the gourd.' },
    art: `<rect width="160" height="110" fill="${c.am}"/>
      <g class="pc"><rect y="94" width="160" height="16" fill="${c.bk}"/>
      <rect x="20" y="62" width="120" height="32" fill="${c.cr}"/><rect x="68" y="70" width="24" height="24" fill="${c.bk}"/>
      <path d="M8 66 Q80 30 152 66Z" fill="${c.gd}"/>
      <circle cx="54" cy="42" r="12" fill="${c.sn}"/><circle cx="84" cy="36" r="14" fill="${c.sn}"/><circle cx="114" cy="44" r="11" fill="${c.sn}"/>
      <path d="M38 50 q20 -20 60 -16" stroke="${c.pn}" stroke-width="2.5" fill="none"/>
      <path d="M118 18 l14 6 12 -8 -6 12 12 4 -18 2z" fill="${c.ink}"/><ellipse cx="131" cy="25" rx="5" ry="3" fill="${c.sn}"/></g>` },

  { id: 'red_hood', title: '빨간 모자', origin: 'world', skills: ['spot', 'sort', 'count'], ready: true, read: true, readMin: 7,
    line: '침대 속 할머니가 어딘가 이상해요! 다른 곳을 찾아내요.',
    en: { title: 'Little Red Riding Hood', line: 'Grandma looks a little strange in bed! Can you spot what is different?' },
    art: `<rect width="160" height="110" fill="${c.pn}"/>
      <g class="pc"><path d="M0 40 L14 10 L28 40Z M128 44 L144 8 L160 44Z" fill="${c.lf}"/><rect y="86" width="160" height="24" fill="${c.bk}"/>
      <path d="M56 88 L62 50 Q78 38 94 50 L100 88Z" fill="${c.rd}"/><circle cx="78" cy="42" r="15" fill="${c.rd}"/><circle cx="78" cy="46" r="10" fill="${c.sk}"/>
      ${eye(74, 46, 1.6)}${eye(82, 46, 1.6)}<circle cx="72" cy="51" r="2" fill="${c.ck}"/>
      <path d="M100 72 h22 l-3 14 h-16z" fill="${c.gd}"/><path d="M104 72 q7 -10 14 0" stroke="${c.gd}" stroke-width="2.5" fill="none"/>
      <circle cx="20" cy="80" r="5" fill="${c.rd}"/><circle cx="34" cy="84" r="5" fill="${c.am}"/><circle cx="138" cy="82" r="5" fill="${c.sn}"/></g>` },

  { id: 'magpie', title: '은혜 갚은 까치', origin: 'korean', also: ['animal'], skills: ['sound', 'count', 'heart'], ready: true, read: true, readMin: 8,
    line: '둥지의 아기 까치는 몇 마리? 숫자를 골라요. 밤에 종을 울려 은혜를 갚는 까치 이야기.',
    en: { title: 'The Grateful Magpie', line: 'How many baby magpies are in the nest? Pick the number. At night the magpies ring the bell to repay a kindness.' },
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><path d="M0 90 Q50 76 100 88 T160 84 V110 H0Z" fill="${c.lv}"/>
      <path d="M40 22 H120 L112 14 H48Z" fill="${c.rd}"/><rect x="78" y="22" width="4" height="10" fill="${c.bk}"/>
      <path d="M66 32 h28 q4 30 6 40 h-40 q2 -10 6 -40z" fill="${c.gd}"/><rect x="58" y="70" width="44" height="4" fill="${c.bk}"/>
      ${[[26, 50], [130, 46], [140, 64]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="${c.ink}"/><ellipse cx="${x + 1}" cy="${y + 2}" rx="5" ry="3" fill="${c.sn}"/><path d="M${x + 8} ${y - 1} l10 -2 -10 5z" fill="${c.ink}"/>`).join('')}</g>` },

  { id: 'magic_jar', title: '요술 항아리', origin: 'korean', skills: ['count', 'size', 'heart'], ready: true, read: true, readMin: 7,
    line: '하나 넣으면 둘이 나오는 항아리! 둘, 넷, 여덟 세어 봐요.',
    en: { title: 'The Magic Jar', line: 'Put one in and two come out! Tap the jar and count: two, four, eight.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="92" width="160" height="18" fill="${c.bk}"/>
      <path d="M54 44 h52 q14 18 8 40 q-4 10 -18 10 h-32 q-14 0 -18 -10 q-6 -22 8 -40z" fill="${c.bk}"/><rect x="58" y="38" width="44" height="8" rx="3" fill="${c.dk}"/>
      <path d="M50 70 h60" stroke="${c.gd}" stroke-width="3"/>
      <circle cx="68" cy="24" r="7" fill="${c.am}"/><circle cx="92" cy="24" r="7" fill="${c.am}"/>
      <circle cx="18" cy="84" r="6" fill="${c.am}"/><circle cx="32" cy="84" r="6" fill="${c.am}"/><circle cx="128" cy="84" r="6" fill="${c.am}"/><circle cx="142" cy="84" r="6" fill="${c.am}"/>
      <circle cx="25" cy="74" r="6" fill="${c.am}"/><circle cx="135" cy="74" r="6" fill="${c.am}"/></g>` },

  { id: 'byeoljubu', title: '별주부전', origin: 'korean', also: ['animal'], skills: ['position', 'sort', 'spot'], ready: true, read: true, readEn: true, readMin: 6,
    line: '별주부라는 벼슬을 가진 자라가 용왕님의 약을 구하러 토끼를 찾아요.',
    en: { title: 'The Rabbit and the Terrapin', line: 'A terrapin with the court title Byeoljubu goes looking for a rabbit to find medicine for the sick Dragon King.' },
    art: `<rect width="160" height="110" fill="#2A7A8C"/>
      <g class="pc"><path d="M0 70 Q40 62 80 70 T160 68 V110 H0Z" fill="#3FA9B5"/><rect y="92" width="160" height="18" fill="#E9DCC0"/>
      <ellipse cx="64" cy="80" rx="34" ry="13" fill="#4F3826"/><circle cx="54" cy="78" r="3" fill="#C9A574"/><circle cx="70" cy="76" r="3" fill="#C9A574"/>
      <path d="M30 80 q-10 -2 -18 -8" stroke="#A89F6B" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="6" y="64" width="14" height="5" rx="2" fill="${c.ink}"/>
      <rect x="104" y="58" width="22" height="34" rx="10" fill="#C9A574"/><rect x="104" y="64" width="22" height="16" rx="4" fill="#3E7CB1"/>
      <circle cx="115" cy="50" r="12" fill="#C9A574"/><rect x="106" y="18" width="7" height="26" rx="3.5" fill="#C9A574"/><rect x="118" y="18" width="7" height="26" rx="3.5" fill="#C9A574"/>
      ${eye(111, 48)}${eye(119, 48)}</g>` },

  { id: 'snow_white', title: '백설공주', origin: 'world', also: ['princess'], skills: ['count', 'heart'], ready: true, read: true, readMin: 13,
    line: '난쟁이 집 침대를 하나부터 여덟까지 세고, 낯선 사람이 주는 건 어른에게 먼저 물어봐요.',
    en: { title: 'Snow White', line: 'Count the beds in the dwarfs\' house from one to eight, and ask a grown-up before taking things from strangers.' },
    art: `<rect width="160" height="110" fill="${c.lf}"/>
      <g class="pc"><rect y="88" width="160" height="22" fill="${c.pn}"/>
      <path d="M58 92 L64 56 Q78 48 92 56 L98 92Z" fill="${c.sn}"/><rect x="62" y="64" width="32" height="5" fill="#7FA8D8"/>
      <circle cx="78" cy="40" r="15" fill="${c.ink}"/><circle cx="78" cy="44" r="11" fill="${c.sk}"/><path d="M70 26 l3 6 5 -7 5 7 3 -6 v8 h-16z" fill="${c.gd}"/>
      ${eye(74, 44, 1.6)}${eye(82, 44, 1.6)}<path d="M76 50 q2 1.5 4 0" stroke="${c.rd}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="120" cy="74" r="12" fill="${c.rd}"/><path d="M120 62 q2 -6 6 -7" stroke="${c.bk}" stroke-width="2.5" fill="none"/><path d="M122 61 q8 -6 12 0 q-6 4 -12 0z" fill="${c.pn}"/>
      ${[[18, ''], [34, ''], [130, '']].map(([x]) => `<path d="M${x} 92 v-12 l6 -12 6 12 v12z" fill="${c.rd}"/>`).join('')}</g>` },
  { id: 'little_mermaid', title: '인어공주', origin: 'world', also: ['princess'], skills: ['size', 'sort', 'heart'], ready: true, read: true, readMin: 10,
    line: '무거운 건 가라앉고 가벼운 건 떠요. 바다 친구와 땅 친구를 가르고, 인어공주의 다정한 양보를 만나요.',
    en: { title: 'The Little Mermaid', line: 'Heavy things sink and light things float. Sort sea friends from land friends, and meet the little mermaid\'s gentle gift of love.' },
    art: `<rect width="160" height="110" fill="#2F6F6A"/>
      <g class="pc"><rect y="92" width="160" height="18" fill="${c.sk}"/>
      <circle cx="22" cy="90" r="9" fill="${c.ps}"/><circle cx="138" cy="88" r="11" fill="${c.rd}"/>
      <circle cx="120" cy="24" r="4" fill="${c.cr}"/><circle cx="130" cy="14" r="2.5" fill="${c.cr}"/><circle cx="112" cy="38" r="2.5" fill="${c.cr}"/>
      <path d="M70 62 q-18 14 -26 30 l14 -2 l2 10 q14 -16 22 -34z" fill="#7FBFB5"/><path d="M62 72 q6 4 12 0 M58 80 q6 4 12 0" stroke="#4F9A90" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M66 44 h20 l4 20 h-28z" fill="${c.cr}"/>
      <circle cx="76" cy="34" r="14" fill="${c.sk}"/>
      <path d="M62 32 a14 14 0 0 1 28 0 v4 q-2 -6 -8 -8 q-6 2 -12 0 q-6 2 -8 8z" fill="${c.gd}"/><path d="M88 34 q10 14 4 32 q-4 -8 -8 -12z" fill="${c.gd}"/>
      ${eye(71, 36, 1.5)}${eye(80, 36, 1.5)}<path d="M73 42 q3 2 6 0" stroke="${c.rd}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M86 50 q14 -10 20 -24" stroke="${c.sk}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M118 44 v16 m-8 -6 q8 10 16 0 m-8 -22 a3 3 0 1 0 0.1 0" stroke="${c.dk}" stroke-width="3" fill="none" stroke-linecap="round"/></g>` },
  { id: 'beauty_beast', title: '미녀와 야수', origin: 'world', also: ['princess'], skills: ['size', 'position', 'order'], ready: true, read: true, readMin: 8,
    line: '장미가 많은 덤불과 적은 덤불, 탁자 위·아래·옆, 아침·낮·밤. 겉모습이 아니라 마음을 봐요.',
    en: { title: 'Beauty and the Beast', line: 'More or fewer roses, on, under and beside the table, morning, noon and night. Look at the heart, not the looks.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.sn}"/><rect y="60" width="160" height="10" fill="${c.gy}"/>
      <circle cx="108" cy="38" r="9" fill="${c.bk}"/><circle cx="136" cy="38" r="9" fill="${c.bk}"/>
      <rect x="96" y="52" width="52" height="40" rx="18" fill="${c.bk}"/><rect x="108" y="66" width="28" height="26" rx="8" fill="${c.ind}"/>
      <circle cx="122" cy="46" r="20" fill="${c.bk}"/><ellipse cx="122" cy="54" rx="9" ry="6" fill="${c.sk}"/>${eye(115, 44, 2.6)}${eye(129, 44, 2.6)}
      <path d="M36 92 L42 60 Q52 54 62 60 L68 92Z" fill="${c.pn}"/><rect x="46" y="70" width="12" height="22" fill="${c.cr}"/>
      <circle cx="52" cy="48" r="12" fill="${c.bk}"/><circle cx="52" cy="51" r="9" fill="${c.sk}"/><circle cx="62" cy="40" r="3" fill="${c.gd}"/>${eye(49, 51, 1.4)}${eye(55, 51, 1.4)}
      <path d="M78 92 v-22" stroke="${c.pn}" stroke-width="2.5"/><circle cx="78" cy="64" r="7" fill="${c.rd}"/><circle cx="78" cy="64" r="3" fill="#C8524A"/></g>` },
  { id: 'red_car', title: '나의 빨간 자동차', origin: 'original', skills: ['spot', 'order', 'heart'], ready: true, read: true, readMin: 7,
    line: '빨간 것을 찾고, 맨 앞에서 끌어 주는 자동차를 골라요. 잃어버린 빨간 자동차가 경찰차, 소방차, 구급차, 견인차와 한 줄로 이현이에게 돌아와요.',
    en: { title: 'My Red Car', line: 'Find the red one and pick the car that pulls at the front. A lost red car comes home to Ihyun in a row with a police car, a fire truck, an ambulance and a tow truck.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.gd}"/>${[0, 40, 80, 120].map(x => `<rect x="${x + 20}" y="84" width="20" height="26" fill="${c.sn}"/>`).join('')}
      <rect x="34" y="40" width="92" height="44" rx="16" fill="${c.rd}"/><rect x="60" y="30" width="46" height="22" rx="8" fill="${c.rd}"/>
      <rect x="66" y="34" width="34" height="14" rx="4" fill="${c.cr}"/>${eye(90, 41, 2)}${eye(96, 41, 2)}
      <circle cx="56" cy="86" r="11" fill="${c.ind}"/><circle cx="104" cy="86" r="11" fill="${c.ind}"/><circle cx="56" cy="86" r="4" fill="${c.cr}"/><circle cx="104" cy="86" r="4" fill="${c.cr}"/>
      <ellipse cx="136" cy="22" rx="9" ry="6" fill="${c.gd}" transform="rotate(-20 136 22)"/><ellipse cx="146" cy="26" rx="8" ry="5" fill="${c.gd}" transform="rotate(20 146 26)"/></g>` },
  { id: 'unicorn', title: '유니콘을 찾아서', origin: 'original', skills: ['spot', 'count', 'heart'], ready: true, read: true, readMin: 6,
    line: '빨간 조각을 고르고, 사슴 다리의 가시 세 개를 세어요. 유니콘을 찾아 길을 나선 아이가 길 잃은 양과 아픈 사슴과 배고픈 말을 도우면, 뒤에서 지켜보던 진짜 유니콘이 나타나요.',
    en: { title: 'Finding the Unicorn', line: 'Pick the red block and count three thorns in a deer\'s leg. A child sets out to find a unicorn, helps a lost sheep, a hurt deer and a hungry horse, and the real unicorn who was watching appears.' },
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><circle cx="128" cy="26" r="14" fill="${c.cr}"/><rect y="86" width="160" height="24" fill="${c.bk}"/>
      <rect x="50" y="52" width="58" height="30" rx="12" fill="${c.sn}"/>${[56, 66, 92, 102].map(x => `<rect x="${x}" y="76" width="5" height="20" fill="${c.sn}"/>`).join('')}
      <rect x="40" y="30" width="24" height="30" rx="9" fill="${c.sn}" transform="rotate(-18 52 56)"/><path d="M42 30 L46 8 L52 28Z" fill="${c.cr}"/>
      ${['#A93B32', '#E8703A', '#D9A94E', '#3F6B4F', '#3E7CB1', '#1F2A56', '#7B4F8C'].map((k, i) => `<rect x="${58 + i * 3}" y="34" width="3.4" height="22" fill="${k}"/>`).join('')}
      ${eye(48, 42, 2.2)}</g>` },
  { id: 'witch_candy', title: '사탕 마녀의 핼러윈', origin: 'original', skills: ['count', 'spot', 'heart'], ready: true, read: true, readEn: true, readMin: 8,
    line: '사탕 마녀의 초대장을 받은 다현이와 친구들. 아기 용 콧물, 병아리 방귀, 괴물 응가, 소방차, 개구리… 우스운 재료를 골라 솥에 넣고 세어요. 빨강과 노랑을 섞으면 무슨 색? 사탕을 먹으면 딸기, 오리, 박쥐, 호박으로 뿅 변신! 마지막엔 모두 함께 검정 유령 사탕을 먹고 오~우~.',
    en: { title: "The Candy Witch's Halloween", line: 'Dahyun and her friends get an invitation from the Candy Witch. Baby-dragon snot, chick toots, monster poo, a fire truck, a frog... pick the silly ingredients, drop them in the cauldron and count. Mix red and yellow: what colour do you get? Eat the candy and turn into a strawberry, a duck, a bat or a glowing pumpkin. Last of all, everyone eats a black ghost candy and marches around going oooh.' },
    art: `<rect width="160" height="110" fill="${c.ind}"/><g class="pc"><circle cx="128" cy="24" r="12" fill="${c.cr}"/><rect y="88" width="160" height="22" fill="${c.bk}"/><ellipse cx="80" cy="74" rx="30" ry="22" fill="#1A1410"/><circle cx="40" cy="80" r="12" fill="${c.ps}"/></g>` },
  { id: 'red_hen', title: '빨간 암탉', origin: 'world', also: ['animal'], skills: ['spot', 'order', 'heart'], ready: true, read: true, readEn: true, readMin: 6,
    line: '빨간 암탉이 혼자 밀을 심어 빵을 굽고, 다음 날엔 친구들과 샌드위치나 피자나 팬케이크를 만들어요. 밀가루·토마토·딸기 같은 재료 이름을 배우고, 씨앗에서 빵까지 순서를 맞춰요.',
    en: { title: 'The Little Red Hen', line: 'The little red hen plants wheat and bakes bread all by herself. The next day, her friends help make sandwiches, pizza or pancakes. Learn the names of foods like flour, tomato and strawberry, and put seed-to-bread in order.' },
    art: `<rect width="160" height="110" fill="#CDE6F7"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="#B5D36B"/>
      ${[112, 126, 140].map(x => `<path d="M${x} 84 v-40" stroke="${c.gd}" stroke-width="3"/><ellipse cx="${x}" cy="40" rx="5" ry="10" fill="${c.gd}"/>`).join('')}
      <ellipse cx="62" cy="66" rx="26" ry="22" fill="#E04B3C"/><path d="M78 56 q16 -6 18 8 q-8 2 -18 0z" fill="${c.rd}"/>
      <circle cx="48" cy="42" r="14" fill="#E04B3C"/><path d="M38 34 q10 -16 22 -2 q-6 10 -22 2z" fill="#3E7CB1"/><circle cx="56" cy="30" r="5" fill="${c.ps}"/>
      <path d="M34 44 l-8 3 l8 3z" fill="#F2B134"/>${eye(44, 42, 1.8)}<circle cx="50" cy="48" r="3" fill="#F8D7E0"/>
      <path d="M52 62 h22 v16 q-11 8 -22 0z" fill="${c.cr}"/><path d="M56 88 v8 M68 88 v8" stroke="#F28C28" stroke-width="2.5"/>
      <circle cx="30" cy="88" r="7" fill="#F2C94E"/><circle cx="90" cy="90" r="6" fill="#F2C94E"/></g>` },
  { id: 'princess_pea', title: '완두콩 공주', origin: 'world', also: ['princess'], skills: ['count', 'size', 'position'], ready: true, read: true, readMin: 5,
    line: '제일 작은 것과 제일 큰 것을 고르고, 매트리스 스무 장을 세고, 위와 아래를 찾아요. 비에 젖은 아가씨가 완두콩 한 알로 진짜 공주임을 보여요.',
    en: { title: 'The Princess and the Pea', line: 'Pick the smallest and the biggest, count twenty mattresses and find top and bottom. A rain-soaked girl shows she is a true princess with a single pea.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="92" width="160" height="18" fill="${c.bk}"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="86" y="${86 - i * 9}" width="66" height="8" rx="2" fill="${[c.gd, c.cr, c.ps][i % 3]}"/>`).join('')}
      <path d="M84 12 h70 q3 0 3 3 v3 q-18 -6 -35 0 q-17 -6 -38 0 v-3 q0 -3 3 -3z" fill="${c.sn}"/>
      <circle cx="92" cy="90" r="3" fill="${c.pn}"/>
      <path d="M26 92 L32 58 Q42 52 52 58 L58 92Z" fill="${c.cr}"/><rect x="30" y="68" width="24" height="4" fill="${c.pn}"/>
      <circle cx="42" cy="44" r="13" fill="#8a6a48"/><circle cx="42" cy="47" r="10" fill="${c.sk}"/><circle cx="42" cy="31" r="4" fill="#8a6a48"/>${eye(38, 47, 1.5)}${eye(46, 47, 1.5)}
      <path d="M39 52 q3 2 6 0" stroke="${c.rd}" stroke-width="1.5" fill="none" stroke-linecap="round"/></g>` },
  { id: 'rapunzel', title: '라푼젤', origin: 'world', also: ['princess'], skills: ['size', 'position', 'heart'], ready: true, read: true, readMin: 8,
    line: '탑 위에 있는 새와 탑 아래에 있는 토끼, 제일 긴 리본과 제일 짧은 리본을 찾아요. 머리를 내려 주는 라푼젤이 노래로 왕자를 다시 만나요.',
    en: { title: 'Rapunzel', line: 'Find the bird on top of the tower and the rabbit below, the longest ribbon and the shortest. Rapunzel lets down her hair and finds the prince again through her song.' },
    art: `<rect width="160" height="110" fill="#DCE9F2"/>
      <g class="pc"><rect y="88" width="160" height="22" fill="${c.lf}"/>
      <rect x="66" y="30" width="40" height="60" fill="#D8D2C4"/><path d="M60 30 L86 8 L112 30Z" fill="${c.rd}"/>
      <rect x="78" y="38" width="16" height="18" rx="8" fill="${c.cr}"/>
      <circle cx="86" cy="48" r="7" fill="${c.sk}"/><path d="M79 46 a7 7 0 0 1 14 0 v3 q-7 -5 -14 0z" fill="${c.gd}"/>${eye(84, 49, 1.2)}${eye(88, 49, 1.2)}
      <path d="M94 50 q6 10 2 40" stroke="${c.gd}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="96" cy="62" r="2" fill="${c.rd}"/><circle cx="96" cy="78" r="2" fill="${c.rd}"/>
      <path d="M18 88 L30 56 L42 88Z" fill="${c.pn}"/><path d="M118 88 L130 60 L142 88Z" fill="${c.pn}"/></g>` },
  { id: 'frog_prince', title: '개구리 왕자', origin: 'world', also: ['princess'], skills: ['shape', 'count', 'heart'], ready: true, read: true, readMin: 5,
    line: '금공 모양을 고르고 접시의 빵을 세어요. 금공을 찾아 준 개구리와 한 약속을 공주가 지키고, 개구리는 왕자가 돼요.',
    en: { title: 'The Frog Prince', line: 'Pick the shape of the golden ball and count the buns on the plate. The princess keeps her promise to the frog who found her ball, and the frog becomes a prince.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><ellipse cx="80" cy="96" rx="90" ry="22" fill="#BFD8EE"/>
      <ellipse cx="80" cy="74" rx="34" ry="24" fill="${c.pn}"/><circle cx="66" cy="52" r="11" fill="${c.sn}"/><circle cx="94" cy="52" r="11" fill="${c.sn}"/>${eye(66, 53, 4)}${eye(94, 53, 4)}
      <path d="M62 80 Q80 90 98 80" stroke="#2E241C" stroke-width="3" fill="none"/>
      <circle cx="128" cy="34" r="16" fill="${c.gd}"/><path d="M116 28 Q120 22 126 22" stroke="${c.cr}" stroke-width="3" fill="none"/></g>` },
  { id: 'sleeping_beauty', title: '잠자는 숲속의 공주', origin: 'world', also: ['princess'], skills: ['size', 'position', 'heart'], ready: true, read: true, readMin: 7,
    line: '요정 줄과 접시 줄 중 더 많은 쪽, 제일 긴 실과 짧은 실, 탁자 아래·선반 위·요리사 옆. 잊힌 요정의 마음을 만나고, 아무도 빼놓지 않아요.',
    en: { title: 'The Sleeping Beauty', line: 'More or fewer, longest and shortest, under the table, on the shelf, next to the cook. Meet the forgotten fairy, and leave no one out.' },
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.gd}"/>
      <rect x="30" y="62" width="100" height="26" rx="6" fill="${c.bk}"/><rect x="36" y="54" width="88" height="14" rx="5" fill="${c.sn}"/><rect x="36" y="44" width="30" height="12" rx="4" fill="${c.cr}"/>
      <circle cx="52" cy="48" r="13" fill="${c.sk}"/><path d="M39 46 a13 13 0 0 1 26 0 v3 q-6 -7 -13 -6 q-7 -1 -13 6z" fill="${c.gd}"/><path d="M64 48 q8 6 6 18" stroke="${c.gd}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M48 52 q2 1.5 4 0 M56 52 q-2 1.5 -4 0" stroke="${c.ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M50 56 q2 1.5 4 0" stroke="${c.rd}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <rect x="72" y="56" width="52" height="12" rx="3" fill="${c.ck}"/>
      <circle cx="136" cy="60" r="14" fill="none" stroke="${c.bk}" stroke-width="4"/>${[0, 60, 120].map(a => `<path d="M136 46 v28" stroke="${c.bk}" stroke-width="2.5" transform="rotate(${a} 136 60)"/>`).join('')}<path d="M126 48 l-10 -14" stroke="${c.gy}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="22" cy="30" r="7" fill="${c.rd}"/><circle cx="14" cy="42" r="5" fill="${c.rd}"/><path d="M10 50 q10 -22 24 -28" stroke="${c.pn}" stroke-width="3" fill="none"/></g>` },
  ];
})();
