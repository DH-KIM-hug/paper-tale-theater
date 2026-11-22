"""이름 바꾸기 템플릿 → server/src/name_lines.js (2026-11-22 '이름 조각 + 고정 조각' 나눠 녹음).
  python3 tools/elevenlabs/build_name_lines.py          # 만들기
  python3 tools/elevenlabs/build_name_lines.py --check  # 만들지 않고 요약만

원천: tools/elevenlabs/name_split_manifest.json (gen_name_split.py build 가 만든 목록: 확정 문안·조각·간격·앱 묶음 고정 조각 주소·기본 이름 완성본).
나누기 전 템플릿은 name_split_base.json(옛 server/src/name_lines.js, 목소리·모델·voice_settings·말투 태그는 거기서 그대로 이어받았다).

줄 하나 = 녹음 맵의 열쇠 하나(놀이·읽기 녹음이 같으면 mode both). 언어별 녹음(ko / enRec):
  pieces  [{k:'S', tpl, gap, url | urls{b,g}}, {k:'N', tpl, gap, slots}, {k:'K', tpl}]  — S = 고정 조각(앱 묶음, 다듬기 전), N = 이름 조각(서버가 녹음),
          K = 다른 배역 조각(녹음 맵의 다른 칸, 문맥으로만). gap = 그 조각 뒤 쉼(초). 조각 사이 규칙은 gen_name_split.py gap_after
  n       이름 조각의 pieces 번호(없으면 null = 이름 없는 영어 대명사 줄, 앱 묶음 두 벌로 끝 — 서버가 녹음하지 않음)
  whole   true = 줄 통째가 이름 조각(이음매 없음)
  send    이름 조각의 보낼 글 템플릿(통째면 [말투 태그] + 글, 나눈 줄이면 글만 — 태그는 앞 문맥 previous_text 로)
  tag     말투 태그(나눈 줄의 previous_text 맨 앞)
  url     기본 이름·원래 모습 완성본(앱 묶음 녹음 맵에 든 값), urlLook {Ab: …} 반대 모습(영어 대명사) 완성본
  orig    영어 녹음에 쓴 발음 표기(예: B_en Ee-hyun) — 이름이 비면 이 표기로 보낸다
  chars   이름 조각 보낼 글 글자 수(기본 이름)"""
import hashlib, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, 'server', 'src', 'name_lines.js')
from gen_name_split import fill, ko_tpl, en_tpl, slots_of, gslots, MANIFEST

def main():
    man = json.load(open(MANIFEST))
    tales, report = {}, []
    ORDER = ['kkultteok', 'red_car', 'unicorn', 'witch_candy', 'home']   # 옛 파일과 같은 순서(서버 TALE_IDS·첫 설정 목록 순서)
    for tale, rows in sorted(man['tales'].items(), key=lambda x: ORDER.index(x[0])):
        lines = []
        for r in rows:
            gslot = r['g'][0] if r['g'] else None
            line = {'id': r['id'], 'key': r['key'], 'keyEn': r['keyEn'], 'mode': r['mode'], 'tpl': ko_tpl(r['key']), 'en': r['en'],
                    'tplEn': en_tpl(r['en'], gslot), 'ko': None, 'enRec': None, 'g': r['g']}
            for lang, P in r['parts'].items():
                ps = P['pieces']
                n = next((i for i, p in enumerate(ps) if p['k'] == 'N'), None)
                pieces = []
                for p in ps:
                    q = {'k': p['k'], 'tpl': p['tpl']}
                    if p['k'] != 'K': q['gap'] = p.get('gap', 0)
                    if p['k'] == 'S' and P['kind'] == 'split':
                        q['url'] = p['url']
                        if p.get('urls'): q['urls'] = p['urls']
                    if p['k'] == 'N': q['slots'] = slots_of(p['tpl'], lang); q['g'] = gslots(p['tpl'])
                    pieces.append(q)
                whole = P['kind'] in ('whole', 'pron')
                send = None
                if n is not None:
                    t = ps[n]['tpl']
                    send = ((P['tag'] + ' ') if whole and P['tag'] and not t.startswith('[') else '') + t
                part = {'seg': P['seg'], 'segs': P['segs'], 'voice': P['voice'], 'model': P['model'], 'settings': P['settings'], 'tag': P['tag'],
                        'whole': whole, 'n': n, 'send': send, 'pieces': pieces, 'orig': P['orig'], 'url': P['url'], 'urlLook': P['urlLook'],
                        'chars': len(fill(send, P['orig'])) if send else 0}
                if P.get('look'): part['look'] = P['look']
                line['ko' if lang == 'ko' else 'enRec'] = part
            # 화면 글 템플릿이 원래 이름으로 원문이 되는지
            assert fill(line['tpl']) == line['key'], (tale, line['key'], line['tpl'])
            assert fill(line['tplEn']) == line['en'], (tale, line['en'], line['tplEn'])
            lines.append(line)
        tales[tale] = lines
        np = sum(1 for l in lines for p in (l['ko'], l['enRec']) if p and p['n'] is not None)
        kc = sum(l['ko']['chars'] for l in lines if l['ko']); ec = sum(l['enRec']['chars'] for l in lines if l['enRec'])
        report.append(f'{tale}: 줄 {len(lines)}, 이름 조각 {np}개, 기본 이름 조각 글자 ko {kc} en {ec}')
    print('\n'.join(report))
    if '--check' in sys.argv: return
    body = json.dumps(tales, ensure_ascii=False, sort_keys=True)
    version = 'nl3-' + hashlib.sha256(body.encode()).hexdigest()[:10]
    with open(OUT, 'w') as f:
        f.write('// 이름 바꾸기 녹음 템플릿 — tools/elevenlabs/build_name_lines.py 가 생성(손으로 고치지 말 것). 2026-11-22 이름 조각 + 고정 조각 나눠 녹음.\n')
        f.write('// 줄: id, key(녹음 맵 열쇠 = 한국어 글), keyEn(영어 맵 열쇠, 홈만 영어 글), mode(play|read|both|home), tpl/tplEn(화면 글 템플릿), en(영어 글), g(영어 대명사 자리)\n')
        f.write('//     ko/enRec: 그 언어 녹음 {seg, segs, voice, model, settings, tag, whole, n(이름 조각 번호|null), send(이름 조각 보낼 글), pieces[{k:S|N|K, tpl, gap, url|urls, slots, g}], orig, url, urlLook, chars, look?}\n')
        f.write('//     서버는 이름 조각(pieces[n])만 녹음한다(앞뒤 조각 글은 previous_text/next_text 문맥). 고정 조각은 앱 묶음에 있고 기기에서 합친다(engine/names.js)\n')
        f.write(f'export const NAME_LINES_VERSION = {json.dumps(version)};\n')
        f.write('export const NAME_LINES = ' + json.dumps(tales, ensure_ascii=False, indent=1) + ';\n')
    print('저장', os.path.relpath(OUT, ROOT), version)

if __name__ == '__main__':
    main()
