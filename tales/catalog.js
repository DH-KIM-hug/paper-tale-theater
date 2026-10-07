/* 종이 동화극장 — 동화 목록(카탈로그)
   홈 화면(index.html · home.js)이 이 목록으로 선반과 태그를 만든다. 빌드 없음, 전역 변수.

   동화 한 편:
     id      폴더 이름과 같다 (tales/<folder>/index.html)
     title   동화 제목 (탭하면 읽어 준다)
     origin  이야기 종류 태그 하나: aesop | korean | world
     skills  배우는 것 태그 1~3개 (TAGS.skill 의 key)
     line    보호자용 한 줄 소개 (아이는 못 읽어도 된다)
     ready   true  = 공개된 동화. 바로 열린다.
             false = 아직 없음. 커튼 닫힌 카드("곧 열려요").
     making  true  = 지금 만드는 중. 홈이 열릴 때 tales/<folder>/index.html 과 <folder>.js 가
                     둘 다 있는지 확인해서, 있으면 저절로 열린다. (없는 폴더는 확인하지 않는다 —
                     404 로그를 남기지 않기 위해서.) 새 동화를 만들기 시작하면 making: true 로 바꾼다.
     art     썸네일: 종이를 오려 붙인 느낌의 단순한 SVG 조각 (viewBox 0 0 160 110).
             <g class="pc"> 안의 조각은 엔진처럼 얕은 종이 그림자를 받는다. 이모지 금지. */

const TAGS = {
  origin: [
    { key: 'aesop',  label: '이솝 우화',   say: '이솝 우화',       color: '#3F6B4F' },
    { key: 'korean', label: '한국 전래',   say: '한국 전래동화',   color: '#A93B32' },
    { key: 'world',  label: '외국 전래',   say: '외국 전래동화',   color: '#1F2A56' },
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
  { id: 'patjuk', title: '팥죽할멈과 호랑이', origin: 'korean', skills: ['order', 'spot', 'heart'], ready: true,
    line: '친구들을 알맞은 자리에 불러 호랑이를 혼내 줘요.',
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

  { id: 'frog', title: '황소와 개구리', origin: 'aesop', skills: ['size', 'heart'], ready: true,
    line: '누가 더 클까? 둘씩 크기를 견주고, 나는 나대로 멋지다는 걸 알아요.',
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="78" width="160" height="32" fill="${c.pn}"/><ellipse cx="46" cy="94" rx="42" ry="10" fill="${c.lv}"/>
      <rect x="84" y="40" width="66" height="40" rx="15" fill="${c.bk}"/><rect x="92" y="72" width="9" height="16" fill="${c.bk}"/><rect x="134" y="72" width="9" height="16" fill="${c.bk}"/>
      <path d="M86 36 q-8 -12 2 -18 M106 36 q8 -12 -2 -18" stroke="${c.cr}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="96" cy="48" r="17" fill="${c.bk}"/><ellipse cx="90" cy="58" rx="9" ry="6" fill="${c.ck}"/>${eye(98, 44, 2.2)}
      <ellipse cx="46" cy="92" rx="18" ry="5" fill="${c.pn}"/><ellipse cx="46" cy="82" rx="13" ry="9" fill="${c.lf}"/>
      <circle cx="40" cy="73" r="5" fill="${c.lf}"/><circle cx="52" cy="73" r="5" fill="${c.lf}"/>
      <circle cx="40" cy="73" r="3" fill="#fff"/><circle cx="52" cy="73" r="3" fill="#fff"/>${eye(40, 73, 1.4)}${eye(52, 73, 1.4)}</g>` },

  { id: 'rabbit', title: '토끼와 거북이', origin: 'aesop', skills: ['sound', 'heart'], ready: true,
    line: '응원하는 동물들의 울음소리로 응원하며, 느려도 끝까지 가는 달리기.',
    en: { title: 'The Rabbit and the Turtle', line: 'A race cheered on by animal calls, where slow and steady wins.' },
    art: `<rect width="160" height="110" fill="${c.am}"/>
      <g class="pc"><path d="M0 70 Q60 44 160 66 V110 H0Z" fill="${c.lf}"/><rect y="90" width="160" height="20" fill="${c.pn}"/>
      <rect x="134" y="30" width="3" height="46" fill="${c.bk}"/><path d="M137 30 h18 l-5 7 5 7 h-18z" fill="${c.rd}"/>
      <ellipse cx="44" cy="84" rx="22" ry="13" fill="${c.pn}"/><path d="M26 84 h36" stroke="${c.lf}" stroke-width="3"/>
      <circle cx="68" cy="84" r="7" fill="${c.lf}"/>${eye(70, 82)}
      <ellipse cx="102" cy="72" rx="12" ry="14" fill="${c.sn}"/><ellipse cx="97" cy="42" rx="4" ry="13" fill="${c.sn}"/><ellipse cx="107" cy="42" rx="4" ry="13" fill="${c.sn}"/>
      <circle cx="102" cy="56" r="10" fill="${c.sn}"/>${eye(98, 55)}<circle cx="96" cy="60" r="2" fill="${c.ck}"/></g>` },

  { id: 'sunmoon', title: '해와 달이 된 오누이', origin: 'korean', skills: ['spot', 'heart'], ready: true,
    line: '수상한 손을 알아보고, 튼튼한 동아줄을 골라 하늘로 올라가요.',
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><path d="M0 92 Q40 80 80 90 T160 86 V110 H0Z" fill="${c.lv}"/>
      <circle cx="40" cy="36" r="17" fill="${c.am}"/><circle cx="118" cy="32" r="14" fill="${c.cr}"/><circle cx="125" cy="27" r="12" fill="${c.ind}"/>
    en: { title: 'The Sun and the Moon', line: 'Spot the tiger\'s sneaky paw, pick the strong rope, and climb up to the sky.' },
      <rect x="78" y="0" width="4" height="70" fill="${c.gd}"/>
      <circle cx="80" cy="74" r="7" fill="${c.sk}"/><path d="M72 72 a8 8 0 0 1 16 0z" fill="${c.ink}"/><rect x="74" y="80" width="12" height="14" rx="4" fill="${c.rd}"/></g>` },

  { id: 'sun_wind', title: '해와 바람', origin: 'aesop', skills: ['season', 'heart'], ready: true,
    line: '세게 부는 바람과 따뜻한 햇볕, 누가 외투를 벗길까요?',
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="90" width="160" height="20" fill="${c.lf}"/>
      <circle cx="34" cy="30" r="18" fill="${c.am}"/>
      <path d="M92 36 a12 12 0 0 1 22 -8 a13 13 0 0 1 24 6 a9 9 0 0 1 -2 18 h-40 a9 9 0 0 1 -4 -16z" fill="${c.sn}"/>
    en: { title: 'The Sun and the Wind', line: 'A blustery wind and the warm sun: who can make the traveler take off the coat?' },
      <path d="M86 62 h26 M92 70 h18" stroke="${c.sn}" stroke-width="4" stroke-linecap="round"/>
      <path d="M60 94 L64 66 Q70 60 76 66 L80 94Z" fill="${c.ps}"/><circle cx="70" cy="56" r="8" fill="${c.sk}"/><path d="M61 54 h18 l-3 -7 h-12z" fill="${c.bk}"/></g>` },

  { id: 'turnip', title: '커다란 순무', origin: 'world', skills: ['order', 'size', 'heart'], ready: true,
    line: '할아버지부터 생쥐까지, 차례대로 불러 다 함께 영차!',
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="80" width="160" height="30" fill="${c.bk}"/>
    en: { title: 'The Giant Turnip', line: 'From Grandpa all the way to the mouse, everyone is called in turn to heave-ho together!' },
      <path d="M28 44 l-8 -26 M36 42 v-30 M44 44 l8 -26" stroke="${c.pn}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="36" cy="66" r="24" fill="${c.sn}"/><path d="M14 58 a24 24 0 0 1 44 0z" fill="${c.ck}"/>
      <circle cx="74" cy="60" r="11" fill="${c.sk}"/><rect x="65" y="70" width="18" height="20" rx="5" fill="${c.pn}"/>
      <circle cx="98" cy="64" r="9" fill="${c.sk}"/><rect x="91" y="72" width="14" height="18" rx="5" fill="${c.rd}"/>
      <circle cx="117" cy="72" r="7" fill="${c.sk}"/><rect x="112" y="78" width="10" height="12" rx="4" fill="${c.gd}"/>
      <circle cx="133" cy="80" r="6" fill="${c.bk}"/><circle cx="146" cy="85" r="5" fill="${c.dk}"/><circle cx="156" cy="88" r="3.5" fill="${c.gy}"/></g>` },

  { id: 'lion_mouse', title: '사자와 생쥐', origin: 'aesop', skills: ['size', 'count', 'heart'], ready: true,
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

  { id: 'fox_crane', title: '여우와 두루미', origin: 'aesop', skills: ['shape', 'heart'], ready: true,
    line: '납작한 접시와 목이 긴 병, 입 모양에 맞는 그릇을 골라 줘요.',
    art: `<rect width="160" height="110" fill="${c.pn}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.bk}"/>
    en: { title: 'The Fox and the Crane', line: 'Flat plate or tall bottle? Pick the dish that fits each mouth.' },
      <ellipse cx="44" cy="84" rx="28" ry="6" fill="${c.cr}"/>
      <path d="M104 84 V52 q0 -6 5 -8 V28 h8 v16 q5 2 5 8 V84z" fill="${c.rd}"/>
      <path d="M26 64 L34 44 L42 56 L52 44 L58 64 Q42 74 26 64Z" fill="${c.ps}"/><path d="M34 66 L42 78 L50 66Z" fill="${c.cr}"/>${eye(36, 60)}${eye(48, 60)}
      <circle cx="138" cy="40" r="9" fill="${c.sn}"/><circle cx="140" cy="31" r="3" fill="${c.rd}"/>${eye(135, 39)}
      <path d="M130 42 L110 50 L130 46Z" fill="${c.gd}"/><rect x="136" y="48" width="4" height="30" fill="${c.sn}"/></g>` },

  /* ───────── 만드는 중 (파일이 생기면 저절로 열린다) ───────── */
  { id: 'goldilocks', title: '골디락스와 곰 세 마리', origin: 'world', skills: ['size', 'shape', 'heart'], ready: false, making: true,
    line: '큰 그릇은 큰 곰, 작은 의자는 아기 곰. 크기대로 주인을 찾아 줘요.',
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.bk}"/>
      <path d="M8 60 h44 q0 24 -22 24 q-22 0 -22 -24z" fill="${c.rd}"/>
      <path d="M62 68 h32 q0 16 -16 16 q-16 0 -16 -16z" fill="${c.gd}"/>
      <path d="M104 74 h20 q0 10 -10 10 q-10 0 -10 -10z" fill="${c.ps}"/>
      <circle cx="142" cy="46" r="11" fill="${c.am}"/><circle cx="142" cy="50" r="8" fill="${c.sk}"/>${eye(139, 50, 1.4)}
      <path d="M134 58 h16 l4 26 h-24z" fill="${c.lf}"/></g>` },

  { id: 'bremen', title: '브레멘 음악대', origin: 'world', skills: ['sound', 'order', 'size'], ready: false, making: true,
    line: '소리로 친구를 알아맞히고, 큰 동물부터 차례로 탑을 쌓아요.',
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><rect x="104" y="30" width="36" height="30" fill="${c.am}"/><path d="M122 30 v30 M104 45 h36" stroke="${c.bk}" stroke-width="3"/>
      <rect y="94" width="160" height="16" fill="${c.bk}"/>
      <rect x="34" y="70" width="52" height="24" rx="8" fill="${c.gy}"/><rect x="38" y="90" width="7" height="8" fill="${c.gy}"/><rect x="74" y="90" width="7" height="8" fill="${c.gy}"/>
      <rect x="40" y="54" width="40" height="18" rx="7" fill="${c.bk}"/>
      <rect x="46" y="40" width="28" height="15" rx="6" fill="${c.dk}"/>
      <circle cx="60" cy="30" r="9" fill="${c.sn}"/><path d="M56 21 l2 -5 2 4 2 -4 2 5z" fill="${c.rd}"/><path d="M51 30 l-5 2 5 2z" fill="${c.gd}"/></g>` },

  { id: 'ant_grasshopper', title: '개미와 베짱이', origin: 'aesop', skills: ['season', 'count', 'heart'], ready: false, making: true,
    line: '여름에 부지런히 모은 먹이로, 겨울에 친구들과 음악회를 열어요.',
    art: `<rect width="80" height="110" fill="${c.gd}"/><rect x="80" width="80" height="110" fill="${c.sn}"/>
      <g class="pc"><rect y="88" width="80" height="22" fill="${c.lf}"/><rect x="80" y="88" width="80" height="22" fill="#DDE3EC"/>
      <circle cx="18" cy="22" r="10" fill="${c.am}"/>
      <circle cx="30" cy="80" r="5" fill="${c.ink}"/><circle cx="40" cy="80" r="4" fill="${c.ink}"/><circle cx="48" cy="77" r="4" fill="${c.ink}"/><circle cx="50" cy="68" r="6" fill="${c.am}"/>
      <rect x="100" y="54" width="44" height="34" fill="${c.bk}"/><path d="M96 56 L122 36 L148 56Z" fill="${c.rd}"/><rect x="116" y="68" width="12" height="20" fill="${c.am}"/>
      <circle cx="96" cy="20" r="2" fill="#C9D3E2"/><circle cx="140" cy="16" r="2" fill="#C9D3E2"/><circle cx="118" cy="26" r="2" fill="#C9D3E2"/></g>` },

  { id: 'ugly_duckling', title: '미운 아기 오리', origin: 'world', skills: ['heart', 'order', 'season'], ready: false, making: true,
    en: { title: 'The Ant and the Grasshopper', line: 'With food gathered all summer, the ants and their friends hold a winter concert.' },
    line: '놀림받던 아기 오리의 마음을 알아주고, 백조로 자라는 순서를 맞춰요.',
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="70" width="160" height="40" fill="${c.lv}"/><path d="M0 70 h160" stroke="${c.pn}" stroke-width="6"/>
      <ellipse cx="48" cy="80" rx="14" ry="8" fill="${c.gy}"/><circle cx="40" cy="68" r="7" fill="${c.gy}"/><path d="M33 68 l-6 2 6 2z" fill="${c.dk}"/>${eye(39, 66, 1.3)}
      <ellipse cx="112" cy="78" rx="24" ry="11" fill="${c.sn}"/><path d="M96 74 q-6 -30 8 -34 q8 -2 8 6" stroke="${c.sn}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M112 44 l8 3 -8 3z" fill="${c.ps}"/>${eye(108, 44, 1.4)}</g>` },

  /* ───────── 계획된 동화 (TALES_PLAN_2) ───────── */
    en: { title: 'The Ugly Duckling', line: 'Understand the teased duckling\'s feelings, then put its growing-up steps in order.' },
  { id: 'three_pigs', title: '아기 돼지 삼형제', origin: 'world', skills: ['count', 'order', 'size'], ready: false,
    line: '짚 집, 나무 집, 벽돌 집. 벽돌을 톡톡 쌓아 막내 집을 지켜요.',
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="88" width="160" height="22" fill="${c.lf}"/>
      <rect x="10" y="62" width="36" height="26" fill="${c.gd}"/><path d="M6 64 L28 42 L50 64Z" fill="${c.am}"/>
      <rect x="62" y="58" width="36" height="30" fill="${c.bk}"/><path d="M58 60 L80 36 L102 60Z" fill="${c.dk}"/>
      <rect x="114" y="52" width="38" height="36" fill="${c.rd}"/><path d="M110 54 L133 30 L156 54Z" fill="${c.bk}"/>
      <path d="M114 64 h38 M114 76 h38 M126 52 v12 M140 64 v12 M126 76 v12" stroke="${c.cr}" stroke-width="1.6"/>
      <circle cx="133" cy="94" r="9" fill="${c.ck}"/><ellipse cx="133" cy="97" rx="4" ry="3" fill="#D98888"/></g>` },

  { id: 'wolf_goats', title: '늑대와 일곱 마리 아기 염소', origin: 'world', skills: ['count', 'spot', 'heart'], ready: false,
    line: '시계 안, 이불 밑, 커튼 뒤. 숨은 아기 염소를 하나씩 세며 찾아요.',
    art: `<rect width="160" height="110" fill="${c.am}"/>
      <g class="pc"><rect y="92" width="160" height="18" fill="${c.bk}"/>
      <rect x="92" y="14" width="40" height="80" rx="4" fill="${c.bk}"/><circle cx="112" cy="36" r="13" fill="${c.cr}"/><path d="M112 36 v-8 M112 36 h6" stroke="${c.ink}" stroke-width="2"/>
      <rect x="100" y="56" width="24" height="32" fill="${c.dk}"/><circle cx="112" cy="72" r="7" fill="${c.sn}"/>${eye(110, 71, 1.3)}
      ${[20, 34, 48, 62].map(x => `<circle cx="${x}" cy="84" r="6" fill="${c.sn}"/>`).join('')}
      <circle cx="27" cy="70" r="6" fill="${c.sn}"/><circle cx="41" cy="70" r="6" fill="${c.sn}"/><circle cx="55" cy="70" r="6" fill="${c.sn}"/></g>` },

  { id: 'kongjwi', title: '콩쥐 팥쥐', origin: 'korean', skills: ['sort', 'shape', 'heart'], ready: false,
    line: '노란 콩과 빨간 팥을 나누고, 두꺼비·참새·선녀의 도움을 받아요.',
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="84" width="160" height="26" fill="${c.gd}"/>
      <path d="M14 62 h52 l-6 28 h-40z" fill="${c.bk}"/><path d="M94 62 h52 l-6 28 h-40z" fill="${c.bk}"/>
      ${[[26, 58], [36, 55], [46, 58], [56, 56], [31, 50], [45, 49]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c.am}"/>`).join('')}
      ${[[106, 58], [116, 55], [126, 58], [136, 56], [112, 50], [126, 49]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${c.rd}"/>`).join('')}
      <ellipse cx="80" cy="96" rx="13" ry="8" fill="${c.pn}"/><circle cx="74" cy="88" r="4" fill="${c.pn}"/><circle cx="86" cy="88" r="4" fill="${c.pn}"/>${eye(74, 88, 1.4)}${eye(86, 88, 1.4)}</g>` },

  { id: 'hansel', title: '헨젤과 그레텔', origin: 'world', skills: ['shape', 'spot', 'heart'], ready: false,
    line: '과자 집 지붕 무늬를 이어 붙이고, 빵 부스러기 길을 따라 집에 와요.',
    art: `<rect width="160" height="110" fill="${c.pn}"/>
      <g class="pc"><rect y="90" width="160" height="20" fill="${c.bk}"/>
      <rect x="44" y="50" width="72" height="42" fill="${c.bk}"/><path d="M36 54 L80 18 L124 54Z" fill="${c.cr}"/>
      ${[48, 62, 76, 90, 104].map((x, i) => `<circle cx="${x + 6}" cy="50" r="6" fill="${i % 2 ? c.gd : c.rd}"/>`).join('')}
      <rect x="70" y="66" width="20" height="26" rx="10" fill="${c.ps}"/><rect x="50" y="60" width="12" height="12" fill="${c.am}"/><rect x="98" y="60" width="12" height="12" fill="${c.am}"/>
      ${[[20, 100], [30, 96], [40, 101], [128, 98], [140, 102]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="${c.am}"/>`).join('')}</g>` },

  { id: 'cinderella', title: '신데렐라', origin: 'world', skills: ['shape', 'size', 'heart'], ready: false,
    line: '호박은 마차, 생쥐는 말. 짝을 맞추고 꼭 맞는 구두를 찾아요.',
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><circle cx="134" cy="20" r="9" fill="${c.cr}"/><path d="M0 94 Q80 86 160 94 V110 H0Z" fill="${c.lv}"/>
      <path d="M56 22 q4 -8 10 -6" stroke="${c.pn}" stroke-width="4" fill="none"/>
      <ellipse cx="60" cy="56" rx="38" ry="30" fill="${c.ps}"/><path d="M44 30 q-10 26 0 52 M76 30 q10 26 0 52 M60 26 v60" stroke="#C75A2C" stroke-width="3" fill="none"/>
      <rect x="50" y="46" width="20" height="16" rx="3" fill="${c.am}"/>
      <circle cx="34" cy="88" r="10" fill="${c.gd}"/><circle cx="86" cy="88" r="10" fill="${c.gd}"/><circle cx="34" cy="88" r="4" fill="${c.bk}"/><circle cx="86" cy="88" r="4" fill="${c.bk}"/>
      <path d="M118 80 h20 q8 0 8 8 h-34 l4 -6z" fill="${c.sn}"/><rect x="116" y="82" width="4" height="10" fill="${c.sn}"/></g>` },

  { id: 'heungbu', title: '흥부와 놀부', origin: 'korean', skills: ['heart', 'shape', 'count'], ready: false,
    line: '다친 제비를 돌봐 주면, 박 속에서 좋은 일이 쏟아져요.',
    art: `<rect width="160" height="110" fill="${c.am}"/>
      <g class="pc"><rect y="94" width="160" height="16" fill="${c.bk}"/>
      <rect x="20" y="62" width="120" height="32" fill="${c.cr}"/><rect x="68" y="70" width="24" height="24" fill="${c.bk}"/>
      <path d="M8 66 Q80 30 152 66Z" fill="${c.gd}"/>
      <circle cx="54" cy="42" r="12" fill="${c.sn}"/><circle cx="84" cy="36" r="14" fill="${c.sn}"/><circle cx="114" cy="44" r="11" fill="${c.sn}"/>
      <path d="M38 50 q20 -20 60 -16" stroke="${c.pn}" stroke-width="2.5" fill="none"/>
      <path d="M118 18 l14 6 12 -8 -6 12 12 4 -18 2z" fill="${c.ink}"/><ellipse cx="131" cy="25" rx="5" ry="3" fill="${c.sn}"/></g>` },

  { id: 'red_hood', title: '빨간 모자', origin: 'world', skills: ['spot', 'sort', 'count'], ready: false,
    line: '침대 속 할머니가 어딘가 이상해요! 다른 곳을 찾아내요.',
    art: `<rect width="160" height="110" fill="${c.pn}"/>
      <g class="pc"><path d="M0 40 L14 10 L28 40Z M128 44 L144 8 L160 44Z" fill="${c.lf}"/><rect y="86" width="160" height="24" fill="${c.bk}"/>
      <path d="M56 88 L62 50 Q78 38 94 50 L100 88Z" fill="${c.rd}"/><circle cx="78" cy="42" r="15" fill="${c.rd}"/><circle cx="78" cy="46" r="10" fill="${c.sk}"/>
      ${eye(74, 46, 1.6)}${eye(82, 46, 1.6)}<circle cx="72" cy="51" r="2" fill="${c.ck}"/>
      <path d="M100 72 h22 l-3 14 h-16z" fill="${c.gd}"/><path d="M104 72 q7 -10 14 0" stroke="${c.gd}" stroke-width="2.5" fill="none"/>
      <circle cx="20" cy="80" r="5" fill="${c.rd}"/><circle cx="34" cy="84" r="5" fill="${c.am}"/><circle cx="138" cy="82" r="5" fill="${c.sn}"/></g>` },

  { id: 'magpie', title: '은혜 갚은 까치', origin: 'korean', skills: ['sound', 'count', 'heart'], ready: false,
    line: '종소리를 듣고 하나, 둘, 셋. 고마움을 갚는 까치 이야기.',
    art: `<rect width="160" height="110" fill="${c.ind}"/>
      <g class="pc"><path d="M0 90 Q50 76 100 88 T160 84 V110 H0Z" fill="${c.lv}"/>
      <path d="M40 22 H120 L112 14 H48Z" fill="${c.rd}"/><rect x="78" y="22" width="4" height="10" fill="${c.bk}"/>
      <path d="M66 32 h28 q4 30 6 40 h-40 q2 -10 6 -40z" fill="${c.gd}"/><rect x="58" y="70" width="44" height="4" fill="${c.bk}"/>
      ${[[26, 50], [130, 46], [140, 64]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="${c.ink}"/><ellipse cx="${x + 1}" cy="${y + 2}" rx="5" ry="3" fill="${c.sn}"/><path d="M${x + 8} ${y - 1} l10 -2 -10 5z" fill="${c.ink}"/>`).join('')}</g>` },

  { id: 'magic_jar', title: '요술 항아리', origin: 'korean', skills: ['count', 'size', 'heart'], ready: false,
    line: '하나 넣으면 둘이 나오는 항아리! 둘, 넷, 여덟 세어 봐요.',
    art: `<rect width="160" height="110" fill="${c.cr}"/>
      <g class="pc"><rect y="92" width="160" height="18" fill="${c.bk}"/>
      <path d="M54 44 h52 q14 18 8 40 q-4 10 -18 10 h-32 q-14 0 -18 -10 q-6 -22 8 -40z" fill="${c.bk}"/><rect x="58" y="38" width="44" height="8" rx="3" fill="${c.dk}"/>
      <path d="M50 70 h60" stroke="${c.gd}" stroke-width="3"/>
      <circle cx="68" cy="24" r="7" fill="${c.am}"/><circle cx="92" cy="24" r="7" fill="${c.am}"/>
      <circle cx="18" cy="84" r="6" fill="${c.am}"/><circle cx="32" cy="84" r="6" fill="${c.am}"/><circle cx="128" cy="84" r="6" fill="${c.am}"/><circle cx="142" cy="84" r="6" fill="${c.am}"/>
      <circle cx="25" cy="74" r="6" fill="${c.am}"/><circle cx="135" cy="74" r="6" fill="${c.am}"/></g>` },
  ];
})();
