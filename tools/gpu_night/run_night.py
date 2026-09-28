#!/usr/bin/env python3
"""밤샘 이미지 생성 실행기 (로컬 ComfyUI + Qwen-Image 2.1).

사용:
  python3 run_night.py jobs_night1.json                 # 전체 (이미 만든 건 건너뜀 = 이어하기)
  python3 run_night.py jobs_night1.json c3_sky cut_jige  # 지정한 것만
  python3 run_night.py jobs_night1.json --redo c3_sky    # 다시 뽑기 (기존 파일은 _old로 보관)

결과: assets/raw/v3/<name>.png (원본) → assets/v3/<name>.png (라임 제거, 레이어는 트림 없이 위치 유지)
끝나면 assets/raw/v3/_sheet.jpg 모아보기를 만든다. 로그는 표준출력.
"""
import json, os, random, shutil, subprocess, sys, time, urllib.parse, urllib.request

API = 'http://127.0.0.1:8188'
WF_PATH = '/Users/house_of_4k2b/orca/projects/qwen 2.1/workflows/qwen_image_2.1_t2i_gguf.api.json'
GAME = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
RAW = os.path.join(GAME, 'assets', 'raw', 'v3')
OUT = os.path.join(GAME, 'assets', 'v3')
HERE = os.path.dirname(os.path.abspath(__file__))
PY_PIL = '/private/tmp/claude-501/-Users-house-of-4k2b-projects-2026-wave-buysell/978ec87f-3026-4327-921b-bbc75c59d182/scratchpad/venv/bin/python'


def post(path, data):
    req = urllib.request.Request(API + path, json.dumps(data).encode(), {'Content-Type': 'application/json'})
    return json.load(urllib.request.urlopen(req))


def get(path):
    return json.load(urllib.request.urlopen(API + path))


def generate(base, j):
    wf = json.loads(json.dumps(base))
    wf['4']['inputs']['prompt'] = j['prompt']
    wf['4']['inputs']['negative_prompt'] = j.get('negative', '')
    wf['6']['inputs']['cfg'] = j.get('cfg', 3.0)
    wf['4']['inputs']['resolution'] = max(j['w'], j['h'])
    wf['5']['inputs']['width'] = j['w']
    wf['5']['inputs']['height'] = j['h']
    wf['6']['inputs']['seed'] = j.get('seed') or random.randint(1, 2**48)
    wf['8']['inputs']['filename_prefix'] = f"patjuk_v3_{j['name']}"
    pid = post('/prompt', {'prompt': wf})['prompt_id']
    t0 = time.time()
    print(f"[{time.strftime('%H:%M:%S')}] [{j['name']}] 시작 {j['w']}x{j['h']}", flush=True)
    while True:
        time.sleep(5)
        hist = get(f'/history/{pid}')
        if pid in hist:
            info = hist[pid]
            if info.get('status', {}).get('status_str') == 'error':
                print(f"[{j['name']}] 오류: {json.dumps(info.get('status'))[:400]}", flush=True)
                return None
            outs = info.get('outputs', {})
            if outs:
                img = outs['8']['images'][0]
                q = urllib.parse.urlencode({'filename': img['filename'], 'subfolder': img.get('subfolder', ''), 'type': img['type']})
                data = urllib.request.urlopen(f'{API}/view?{q}').read()
                print(f"[{time.strftime('%H:%M:%S')}] [{j['name']}] 완료 {len(data)//1024}KB, {time.time()-t0:.0f}초", flush=True)
                return data
        if time.time() - t0 > 3000:
            print(f"[{j['name']}] 시간 초과", flush=True)
            return None


def postprocess(j, raw):
    dst = os.path.join(OUT, j['name'] + '.png')
    if j.get('key'):
        pad = '12' if j.get('trim') else '-1'
        cmd = [PY_PIL, os.path.join(HERE, 'chromakey.py'), raw, dst, pad] + (['--nogreen'] if j.get('nogreen') else [])
        subprocess.run(cmd, check=False)
    else:
        shutil.copy(raw, dst)


def sheet():
    subprocess.run([PY_PIL, os.path.join(HERE, 'sheet.py'), RAW, os.path.join(RAW, '_sheet.jpg')], check=False)


def main():
    args = sys.argv[1:]
    jobs = json.load(open(args[0]))
    redo = '--redo' in args
    names = [a for a in args[1:] if not a.startswith('--')]
    if names:
        jobs = [j for j in jobs if j['name'] in names]
    os.makedirs(RAW, exist_ok=True)
    os.makedirs(OUT, exist_ok=True)
    base = json.load(open(WF_PATH))
    done = 0
    for j in jobs:
        raw = os.path.join(RAW, j['name'] + '.png')
        if os.path.exists(raw):
            if not redo:
                print(f"[{j['name']}] 이미 있음 — 건너뜀", flush=True)
                continue
            os.replace(raw, raw.replace('.png', f"_old{int(time.time())}.png"))
        data = generate(base, j)
        if data:
            open(raw, 'wb').write(data)
            postprocess(j, raw)
            done += 1
    print(f"끝: 새로 만든 것 {done}장", flush=True)
    sheet()


if __name__ == '__main__':
    main()
