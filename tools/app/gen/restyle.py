#!/usr/bin/env python3
"""동화 그림 전체를 사용자 검증 스타일(tools/app/keyart/STYLE_BLOCK_v2.md)로 다시 그린다.
지금 게임 그림(assets/v3w/<이름>.webp)을 참고 이미지로 넣어 같은 인물·자세·방향·구도를 유지하고, 파일 이름과 크기도 그대로 둔다
(→ 게임 코드의 자리·크기가 대부분 그대로 맞는다).

  python3 tools/app/gen/restyle.py build [tale ...]   # tools/app/gen/restyle/jobs_<tale>.json 작업표 만들기
  python3 tools/app/gen/restyle.py run [tale ...]     # Codex(codex exec, image_gen)로 차례로 생성. 한도에 걸리면 풀리는 시각까지 기다렸다 이어 감
  python3 tools/app/gen/restyle.py post <tale>        # 생성본을 오려(인물·소품) 옛 크기에 맞춰 assets/v3w 에 덮어씀 (옛 그림은 assets/raw/old_v3w/)
  python3 tools/app/gen/restyle.py status             # 동화별 진행

상태 파일: tools/app/gen/restyle/status.json  (run 이 갱신: 동화별 done/total, 한도 대기 시각)
원본 생성본: assets/raw/restyle/<tale>/<이름>.png"""
import json, os, re, sys, time, subprocess, datetime, shutil
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
HERE = os.path.join(G, 'tools', 'app', 'gen', 'restyle'); os.makedirs(HERE, exist_ok=True)
V3W = os.path.join(G, 'assets', 'v3w'); RAW = os.path.join(G, 'assets', 'raw', 'restyle'); OLD = os.path.join(G, 'assets', 'raw', 'old_v3w')
STATUS = os.path.join(HERE, 'status.json')
CODEX = os.path.expanduser('~/.npm-global/bin/codex')
PY_PIL = os.path.expanduser('~/.venvs/paper-tale/bin/python')

# 무료 6편 먼저, 그다음 나머지
ORDER = ['rabbit', 'lion_mouse', 'sunmoon', 'turnip', 'goldilocks', 'frog', 'sun_wind', 'fox_crane', 'ant_grasshopper', 'bremen', 'three_pigs',
         'wolf_goats', 'red_hood', 'ugly_duckling', 'magic_jar', 'kongjwi', 'heungbu', 'magpie', 'hansel', 'cinderella']
PREFIX = {'ant_grasshopper': 'ag_', 'bremen': 'br_', 'cinderella': 'cd_', 'fox_crane': 'fc_', 'frog': 'frog_', 'goldilocks': 'gl_', 'hansel': 'hg_',
          'heungbu': 'hb_', 'kongjwi': 'kj_', 'lion_mouse': 'lm_', 'magic_jar': 'mj_', 'magpie': 'mg_', 'rabbit': 'rab_', 'red_hood': 'rh_',
          'sun_wind': 'sw_', 'sunmoon': 'sm_', 'three_pigs': 'tp_', 'turnip': 'tn_', 'ugly_duckling': 'ud_', 'wolf_goats': 'wg_'}
SKIP = re.compile(r'(_old|_bak|_test|_rejected)$')

SB = open(os.path.join(G, 'tools/app/keyart/STYLE_BLOCK_v2.md')).read()
def sec(a, b): i = SB.index(a); return SB[i:SB.index(b, i)].strip()
STYLE, LIGHT = sec('STYLE:', 'LIGHTING:'), sec('LIGHTING:', 'NO list:')
HEAD = 'Hand-cut layered paper art, handcrafted stop-motion paper diorama aesthetic.'
NO = '\n'.join(['NO text.', 'NO photorealism.', 'NO glossy surfaces.', 'NO realistic 3D modeling.', 'NO inflated or rounded forms.', 'NO clay-like volume.',
                'NO gradients.', 'NO painterly rendering.', 'NO airbrushed shading.', 'NO realistic sunlight shadows.', 'NO deep ambient occlusion.',
                'NO thick beveled edges.', 'NO plastic appearance.', 'NO felt or fabric appearance.', 'NO fur-fibre texture.'])
KEEP = ('REFERENCE: The attached reference image is the current artwork. REDRAW it in the paper-art style above while keeping EXACTLY the same '
        'subject, pose, gesture, facing direction (left/right), proportions, colours of clothes and markings, and the same composition and placement '
        'of every element. If a character in the reference has a face, keep a simple cut-paper face (round dot eyes, tiny dot nose, small curved paper-strip mouth, '
        'pale-pink round cheeks). If an OBJECT in the reference has no face, do NOT add a face. Do not add or remove any element.')

def kind_of(name):
    if '_bg' in name: return 'bg'
    if '_cut' in name: return 'cut'
    return 'sprite'

def bg_scene(tale, name):
    """PROMPTS_bg_<tale>.md 에서 같은 이름(`name` 또는 접두어 뺀 이름) 장면의 SCENE 단락을 찾는다"""
    p = os.path.join(G, f'tools/app/keyart/PROMPTS_bg_{tale}.md')
    if not os.path.exists(p): return None
    t = open(p).read(); short = re.sub(r'^[a-z]+_bg_?', '', name)
    for key in (name, short):
        m = re.search(r'\(`' + re.escape(key) + r'`[^)]*\)(.*?)(?=\n## |\Z)', t, re.S)
        if m:
            sc = re.search(r'SCENE:\n(.*?)\n\n', m.group(1), re.S)
            return sc.group(1).strip() if sc else None
    return None

def prompt_for(tale, name, size):
    k = kind_of(name); w, h = size
    if k == 'sprite':
        frame = ('FRAMING:\nSquare 1:1 image. The whole figure is visible and centred, filling about 80% of the frame. Background: a completely flat, uniform, solid '
                 'magenta (#FF00FF) chroma-key sheet with no texture, no floor, no ground shadow, no extra props, no border. Nothing else in the image.')
        parts = [HEAD, 'Create ONE character or object sprite, rendered entirely as handcrafted paper art: a figure assembled from individually cut pieces of matte colored cardstock and fine-grain craft paper.',
                 STYLE, KEEP, frame, LIGHT, NO]
    elif k == 'bg':
        sc = bg_scene(tale, name)
        parts = [HEAD, 'Create a wide 16:9 scene, rendered entirely as handcrafted paper art, a carefully assembled paper diorama of individually cut matte cardstock pieces.',
                 STYLE, KEEP.replace('subject, pose, gesture, facing direction (left/right), proportions, colours of clothes and markings, and the same ', 'layout: the same '),
                 ('SCENE NOTES:\n' + sc) if sc else '',
                 'Keep the same open ground areas where characters stand. NO people, NO animals, NO characters, NO faces on objects (unless already a painted part of the reference scenery).',
                 'FRAME:\nNo decorative border. The scene fills the entire frame edge to edge.', LIGHT, NO]
    else:
        parts = [HEAD, f'Create a {"wide 16:9" if w >= h else "tall"} comic-panel moment for a picture book, rendered entirely as handcrafted paper art.', STYLE, KEEP,
                 'FRAME:\nNo border, no speech bubbles, no panel lines, no letters; fills the frame edge to edge.', LIGHT, NO]
    return '\n\n'.join(p for p in parts if p)

def used_names(tale):
    pre = PREFIX[tale]
    names = sorted(f[:-5] for f in os.listdir(V3W) if f.startswith(pre) and f.endswith('.webp') and not SKIP.search(f[:-5]))
    return names

def build(tales):
    from PIL import Image
    for t in tales:
        jobs = []
        for n in used_names(t):
            src = os.path.join(OLD, n + '.webp') if os.path.exists(os.path.join(OLD, n + '.webp')) else os.path.join(V3W, n + '.webp')
            size = Image.open(src).size
            jobs.append({'id': n, 'kind': kind_of(n), 'ref': os.path.relpath(src, G), 'size': size,
                         'out': os.path.relpath(os.path.join(RAW, t, n + '.png'), G), 'prompt': prompt_for(t, n, size)})
        json.dump(jobs, open(os.path.join(HERE, f'jobs_{t}.json'), 'w'), ensure_ascii=False, indent=1)
        print(t, len(jobs), '장', {k: sum(j['kind'] == k for j in jobs) for k in ('bg', 'cut', 'sprite')})

def load_status():
    try: return json.load(open(STATUS))
    except Exception: return {}
def save_status(s): json.dump(s, open(STATUS, 'w'), ensure_ascii=False, indent=1)

LIMIT_RE = re.compile(r'(usage limit|rate limit|limit reached|too many requests|quota|try again (?:at|in))', re.I)
def wait_until(text):
    """한도 메시지에서 풀리는 시각을 읽는다. 못 읽으면 30분 뒤"""
    now = datetime.datetime.now()
    m = re.search(r'try again in\s+(?:(\d+)\s*(?:days?|d))?\s*(?:(\d+)\s*(?:hours?|h))?\s*(?:(\d+)\s*(?:minutes?|min|m))?', text, re.I)
    if m and any(m.groups()):
        d, h, mi = (int(x or 0) for x in m.groups()); return now + datetime.timedelta(days=d, hours=h, minutes=mi + 2)
    m = re.search(r'try again at\s+([^\n.]+)', text, re.I)
    if m:
        s = m.group(1).strip()
        for fmt in ('%I:%M %p', '%H:%M', '%b %d, %Y %I:%M %p', '%B %d, %Y %I:%M %p', '%b %d %I:%M %p', '%Y-%m-%d %H:%M'):
            try:
                tt = datetime.datetime.strptime(re.sub(r'(st|nd|rd|th),', ',', s)[:len(datetime.datetime.now().strftime(fmt)) + 6].strip(), fmt)
                if tt.year == 1900: tt = tt.replace(year=now.year, month=now.month, day=now.day)
                if tt < now: tt += datetime.timedelta(days=1)
                return tt + datetime.timedelta(minutes=2)
            except Exception: pass
    return now + datetime.timedelta(minutes=30)

def gen_one(job, log):
    out = os.path.join(G, job['out']); os.makedirs(os.path.dirname(out), exist_ok=True)
    aspect = 'square 1:1' if job['kind'] == 'sprite' else ('landscape 16:9' if job['size'][0] >= job['size'][1] else 'portrait 3:4')
    pf = os.path.join(HERE, '_prompt.txt'); open(pf, 'w').write(job['prompt'])
    inst = (f"Use your image generation tool (image_gen.imagegen) to create ONE image, {aspect}. Read the full prompt from the file {pf} and pass it VERBATIM. "
            f"Pass this reference image in referenced_image_paths: {os.path.join(G, job['ref'])} . Save (copy) the generated image to {out} . "
            "Do not modify any other file, do not install anything, do not run git. Reply with only: SAVED <path> <width>x<height>, or FAILED <reason verbatim>.")
    r = subprocess.run([CODEX, 'exec', '-s', 'workspace-write', '--skip-git-repo-check', '-C', G, inst], capture_output=True, text=True, timeout=900)
    txt = (r.stdout or '') + '\n' + (r.stderr or '')
    open(log, 'a').write(f"\n===== {datetime.datetime.now():%m-%d %H:%M} {job['id']}\n{txt[-1500:]}\n")
    if os.path.exists(out): return 'ok', txt
    if LIMIT_RE.search(txt): return 'limit', txt
    return 'fail', txt

def run(tales):
    log = os.path.join(HERE, 'run.log')
    for t in tales:
        jp = os.path.join(HERE, f'jobs_{t}.json')
        if not os.path.exists(jp): build([t])
        jobs = json.load(open(jp)); fails = {}
        while True:
            todo = [j for j in jobs if not os.path.exists(os.path.join(G, j['out'])) and fails.get(j['id'], 0) < 3]
            st = load_status(); st[t] = {'done': len(jobs) - len([j for j in jobs if not os.path.exists(os.path.join(G, j['out']))]), 'total': len(jobs), 'state': 'running'}; save_status(st)
            if not todo: break
            j = todo[0]
            res, txt = gen_one(j, log)
            if res == 'limit':
                until = wait_until(txt); st = load_status(); st['_wait_until'] = until.strftime('%Y-%m-%d %H:%M'); st[t]['state'] = 'waiting-limit'; save_status(st)
                print(f'{datetime.datetime.now():%H:%M} 한도 → {until:%m-%d %H:%M} 까지 대기', flush=True)
                time.sleep(max(60, (until - datetime.datetime.now()).total_seconds()))
                st = load_status(); st.pop('_wait_until', None); save_status(st)
            elif res == 'fail':
                fails[j['id']] = fails.get(j['id'], 0) + 1; print('실패', j['id'], fails[j['id']], flush=True); time.sleep(20)
            else:
                print(f'{datetime.datetime.now():%H:%M} ok {t}/{j["id"]}', flush=True)
        st = load_status(); st[t]['state'] = 'generated'; st[t]['failed'] = [k for k, v in fails.items() if v >= 3]; save_status(st)
        print('동화 완료', t, flush=True)

def post(tale):
    """생성본 → assets/v3w (옛 크기 그대로, 옛 그림은 old_v3w 로)"""
    jobs = json.load(open(os.path.join(HERE, f'jobs_{tale}.json'))); os.makedirs(OLD, exist_ok=True)
    tmp = os.path.join(RAW, tale + '_key'); os.makedirs(tmp, exist_ok=True)
    code = r'''
import sys, json
from PIL import Image
src, dst, kind, w, h = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5])
im = Image.open(src)
if kind == 'sprite':
    im = im.convert('RGBA'); s = min(w / im.width, h / im.height); im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
else:
    im = im.convert('RGB'); r = w / h
    if abs(im.width / im.height - r) > .01:  # 옛 비율에 맞춰 가운데를 자른다
        if im.width / im.height > r: nw = round(im.height * r); im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
        else: nh = round(im.width / r); im = im.crop((0, (im.height - nh) // 2, im.width, (im.height - nh) // 2 + nh))
    im = im.resize((w, h), Image.LANCZOS)
im.save(dst, quality=88 if kind == 'sprite' else 86, method=6)
'''
    n = 0
    for j in jobs:
        src = os.path.join(G, j['out'])
        if not os.path.exists(src): continue
        name = j['id']; v = os.path.join(V3W, name + '.webp'); o = os.path.join(OLD, name + '.webp')
        if not os.path.exists(o) and os.path.exists(v): shutil.copy2(v, o)
        if j['kind'] == 'sprite':
            k = os.path.join(tmp, name + '.png')
            subprocess.run([PY_PIL, os.path.join(G, 'tools/gpu_night/chromakey.py'), src, k, '6'], check=True, capture_output=True)
            src = k
        subprocess.run([PY_PIL, '-c', code, src, v, j['kind'], str(j['size'][0]), str(j['size'][1])], check=True)
        n += 1
    st = load_status(); st.setdefault(tale, {})['state'] = 'posted'; save_status(st)
    print(tale, '적용', n, '장')

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'status'; args = sys.argv[2:]
    if cmd == 'build': build(args or ORDER)
    elif cmd == 'run': run(args or ORDER)
    elif cmd == 'post': post(args[0])
    else: print(json.dumps(load_status(), ensure_ascii=False, indent=1))
