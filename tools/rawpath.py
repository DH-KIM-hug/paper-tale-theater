"""assets/raw 원본 그림 경로 도우미 (2026-11-06: 원본 PNG 를 무손실 webp 로 바꾸는 중).
raw_path('a/b.png') -> a/b.png 가 있으면 그대로, 없고 a/b.webp 가 있으면 webp, 둘 다 없으면 원래 경로.
raw_exists(p) -> png 또는 webp 가 있으면 True.
raw_open(p) -> PIL 이미지(둘 중 있는 쪽).
raw_png(p) -> 이미지 생성 도구(codex image_gen)에 참고 그림으로 넘길 때 쓰는 경로. webp 뿐이면 임시 PNG 로 바꿔 그 경로를, 아니면 그대로.
경로는 상대(저장소 기준)·절대 모두 된다. 확장자가 .png 가 아니면 그대로 돌려준다."""
import os, hashlib, tempfile

def raw_path(p):
    p = str(p)
    if p.lower().endswith('.png') and not os.path.exists(p):
        w = p[:-4] + '.webp'
        if os.path.exists(w): return w
    return p

def raw_exists(p):
    return os.path.exists(raw_path(p))

def raw_open(p):
    from PIL import Image
    return Image.open(raw_path(p))

def raw_png(p, tmp_dir=None):
    q = raw_path(p)
    if not q.lower().endswith('.webp'): return q
    from PIL import Image
    d = tmp_dir or os.path.join(tempfile.gettempdir(), 'raw_png_cache')
    os.makedirs(d, exist_ok=True)
    st = os.stat(q)
    name = hashlib.md5(f'{os.path.abspath(q)}:{st.st_mtime_ns}:{st.st_size}'.encode()).hexdigest()[:12] + '_' + os.path.basename(q)[:-5] + '.png'
    out = os.path.join(d, name)
    if not os.path.exists(out):
        Image.open(q).save(out + '.tmp.png'); os.replace(out + '.tmp.png', out)
    return out

def raw_glob(pattern):
    """glob 의 png 패턴 -> png 이름 목록. 원본이 webp 로 바뀐 것은 .png 이름(논리 이름)으로 돌려주니 열 때 raw_path 를 거친다."""
    import glob
    names = set(glob.glob(pattern))
    if pattern.lower().endswith('.png'):
        for w in glob.glob(pattern[:-4] + '.webp'): names.add(w[:-5] + '.png')
    return sorted(names)
