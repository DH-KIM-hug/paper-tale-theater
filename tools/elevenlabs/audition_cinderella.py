"""신데렐라 목소리 오디션: 후보별 샘플 mp3 생성 + audio/el/audition/cinderella.html 작성.
  python3 tools/elevenlabs/audition_cinderella.py [--only 이름,이름] [--redo]
받아쓰기 검증은 별도(mlx_whisper)로 하고, 틀린 클립은 --redo --only 로 다시 만든다."""
import json, os, sys, html, time, urllib.request, urllib.error
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KEY = open(os.path.expanduser('~/.config/elevenlabs/key')).read().strip()
def tts(path, voice, text, model, settings):
    body = {'text': text, 'model_id': model, 'voice_settings': {'similarity_boost': 0.75, **settings}}
    for attempt in range(6):
        r = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', json.dumps(body).encode(), {'xi-api-key': KEY, 'Content-Type': 'application/json'})
        try:
            open(path, 'wb').write(urllib.request.urlopen(r, timeout=120).read()); return
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503) and attempt < 5: time.sleep(3 * (attempt + 1)); continue
            raise
OUT = os.path.join(ROOT, 'audio/el/audition/cinderella'); os.makedirs(OUT, exist_ok=True)
M = 'eleven_v4'
ST = {'cind': {'stability': 0.4, 'style': 0.4}, 'nar': {'stability': 0.45, 'style': 0.35}}
# role: (제목, [(문장 키, 태그, 대사)], [(파일 이름, 표시 이름, voice_id, 설명)])
ROLES = [
 ('cind', '신데렐라 (밝고 맑은 10대 후반~젊은 여성, 아기 목소리 아님)',
  [('a', '[gentle, sad, soft]', '저도 무도회에 가고 싶어요… 하지만 저는 재투성이인걸요.'), ('b', '[joyful, bright, excited]', '와, 고맙습니다! 정말 예쁜 드레스예요!')],
  [('yun', 'Yun - Warm, Clear', 'lFG74KW6EG0aRXg1kKfh', '젊은 여성, 따뜻하고 맑고 차분한 표준어'),
   ('sora', 'Sora - Warm & Expressive Storyteller', 'JpGoUJuLFthrFkcdBy4k', '젊은 서울 여성, 표현이 풍부한 이야기꾼'),
   ('chaerin', 'Chaerin - Clear, Calm', '0acaXyU36iMbRS9PXzmk', '20대 서울 여성, 밝고 또렷하고 차분'),
   ('yoojin', 'Yoojin Kim - Bright, Clear & Friendly', 'Cm89zxZzEGaMu7ajYw2K', '젊은 표준어 여성, 밝고 친근'),
   ('luna_soft', 'Luna - Soft, Clear, Bright', 'Ss1VfT7ri4lqnvTDWII0', '젊은 서울 여성, 부드럽고 밝고 상냥')]),
 ('nar', '여자 내레이터 (따뜻한 젊은 여성 이야기꾼, 신데렐라보다 조금 성숙)',
  [('a', '[calm, warm storytelling, once upon a time]', '옛날 옛날에 마음씨 고운 아가씨가 살았어요. 어느 날, 왕궁에서 무도회가 열린다는 소식이 왔어요.')],
  [('gyeorina', 'Gyeorina - Warm Storyteller', '1gYuTfEwELcoEo96wnGj', '젊은 서울 여성, 따뜻하고 표현력 있는 이야기꾼'),
   ('kyung', 'Kyung - Warm, Calm & Clear', 'JQaWvPoEUkcuOTfxFYpJ', '젊은 서울 여성, 따뜻하고 차분한 낭독'),
   ('leejin', 'Leejin - Korean Female', 'F9mMsBUFaCLedtYXXjLD', '젊은 표준어 여성, 따뜻하고 또렷한 낭독'),
   ('jeongyeon', 'Jeongyeon - Calm, Approachable, Emotional', 'yEEfI7k6EcMdtARnorcX', '젊은 서울 여성, 차분하고 진심 어린 느낌'),
   ('sujin_calm', 'Sujin - Calm, Trustworthy, Confident', 'oGV8pbtfEm7fbDPdSfrx', '30대 서울 여성, 편안하고 믿음직한 낭독')]),
 ('fairy', '요정 대모 (따뜻한 할머니)',
  [('a', '[warm, grandmotherly, kind]', '울지 마렴. 너도 무도회에 가고 싶지? 내가 도와주마.')],
  [('mjay', 'MJay', 'SrkN8J8D7m8bAtmS0uiq', '나이 든 서울 여성, 부드럽고 따뜻한 이야기꾼'),
   ('lea', 'Lea - Mature', 'V4hbKpM9VBIJ9lKaWBjM', '60대 여성, 차분하고 평온한 느낌'),
   ('haemi', 'Haemi', 'ZjAPD4f11zlnEnZpKDgo', '나이 든 서울 여성, 맑고 편안한 동화 목소리')]),
 ('step', '새엄마 (우아하고 차갑지만 무섭지 않게)',
  [('a', '[elegant, cold, haughty]', '신데렐라, 넌 집에 남아서 부엌 일을 해!')],
  [('eunha', 'Eunha - Elegant Korean Female', 'cBOtnpVZNlQ5VJygXGB8', '중년 서울 여성, 우아하고 차분'),
   ('suzie', 'Suzie - Calm Korean', 'UqW1DivwFt1NwUMSGnTn', '30대 서울 여성, 단정하고 세련된 느낌'),
   ('wisdom', 'Wisdom - Professional PR Narration', 'Pyj2w3lxZ0VMpAJ4CmRu', '중년 여성, 격식 있고 절제된 말투')]),
 ('sisa', '큰언니 (콧대 높고 우스운 젊은 여성)',
  [('a', '[snooty, bossy, comic]', '신데렐라, 내 머리 좀 예쁘게 해 줘!')],
  [('ailra', 'Ailra - Whiny, Dynamic, Sassy', 'XtDNqqtU5YUpm1etgl1C', '젊은 여성, 짜증스럽고 통통 튀는 심술'),
   ('chaemong', 'Chaemong', 'DGDjWy2CQ8Ishu0meQte', '젊은 서울 여성, 당돌한 캐릭터 목소리 (기존 작은언니 후보)'),
   ('sujin_bright', 'Sujin - Bright & friendly', '9cino9hfS3ougiPeFvp1', '30대 서울 여성, 밝고 수다스러운 캐릭터')]),
 ('sisb', '작은언니 (큰언니와 다른, 우스운 젊은 여성)',
  [('a', '[smug, whiny, comic]', '어머, 이 구두는 내 거야! 내 발도 들어갈 거야!')],
  [('sena', 'Sena - Friendly Cheerful', 'vJ170fCwESgE1tjW39So', '젊은 여성, 밝고 귀여운 목소리'),
   ('juwonmom', 'Juwonmom', 'oZLQ9kHPMuIyd7Ja0YNU', '젊은 여성, 따뜻하고 열정적이며 표현이 큼'),
   ('yeonjin', 'Yeonjin - Professional, Familiar', 'Mwr1G7n3SF7eQxbSp4At', '젊은 서울 여성, 친근하고 편한 말투')]),
 ('prince', '왕자 (온화한 젊은 남성)',
  [('a', '[gentle, kind, warm]', '아름다운 아가씨, 저와 함께 춤춰 주시겠어요?')],
  [('taehyun', 'Taehyun - Korean Storyteller & Narration', 'T6CkalnggsFZDOXwglLf', '젊은 남성, 맑고 자연스러운 이야기꾼'),
   ('sunjun', 'Sunjun - Bright & Trustworthy Narrator', 'VpI9YrC8mqZsi3NvIQzK', '젊은 서울 남성, 밝고 믿음직'),
   ('leo', 'Leo - Young, Calm & Clear', 'zBfkllpYmUyxwRyQt8Zw', '젊은 서울 남성, 차분하고 또렷')]),
]
CODE = {'cind': 'A', 'nar': 'B', 'fairy': 'C', 'step': 'D', 'sisa': 'E', 'sisb': 'F', 'prince': 'G'}

def main():
    only = set(sys.argv[sys.argv.index('--only') + 1].split(',')) if '--only' in sys.argv else None
    redo = '--redo' in sys.argv; chars = 0
    for role, _, lines, cands in ROLES:
        for nm, _, vid, _ in cands:
            for k, tag, text in lines:
                f = f'{role}_{nm}' + (f'_{k}' if len(lines) > 1 else '') + '.mp3'
                p = os.path.join(OUT, f)
                if only and nm not in only: continue
                if os.path.exists(p) and not redo and not only: continue
                sent = tag + ' ' + text; chars += len(sent)
                tts(p, vid, sent, M, ST.get(role, {'stability': 0.4, 'style': 0.4})); print('ok', f, flush=True)
    print('글자 수', chars)
    page()

def page():
    h = ['<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>신데렐라 목소리 오디션</title><style>body{font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:16px;background:#fbf6ea;color:#333}.c{background:#fff;border-radius:12px;padding:12px 14px;margin:12px 0;box-shadow:0 1px 4px #0002}.c span{color:#a60;font-size:.9em}.c p{margin:4px 0 8px;color:#333;font-size:.9em}.id{display:inline-block;background:#a60;color:#fff;border-radius:8px;padding:1px 9px;margin-right:6px;font-weight:700}.line{background:#fff3d6;border-radius:10px;padding:8px 12px;margin:4px 0}h2{margin-top:32px}audio{width:100%}textarea{width:100%;box-sizing:border-box;border:1px solid #d9c9a8;border-radius:8px;padding:6px;font:inherit;margin-top:6px;background:#fffdf7}.pick{background:#fff;border-radius:12px;padding:12px 14px;box-shadow:0 1px 4px #0002}</style></head><body><h1>신데렐라 목소리 오디션</h1>',
         '<p><b>답하는 법:</b> 역할마다 마음에 드는 목소리의 번호만 알려 주세요. 예) "신데렐라 A-2, 내레이터 B-1, 요정 C-3 ..." 모든 후보가 같은 문장을 eleven_v4로 읽었습니다. 신데렐라와 내레이터는 어린아이 소리가 아니라 10대 후반~젊은 여성 목소리 후보만 모았습니다. 메모칸은 이 기기에만 저장됩니다.</p>']
    for role, title, lines, cands in ROLES:
        c = CODE[role]
        h.append(f'<h2>{c}. {html.escape(title)}</h2>')
        for k, tag, text in lines: h.append(f'<div class="line">{tag} {html.escape(text)}</div>')
        for i, (nm, name, vid, desc) in enumerate(cands, 1):
            h.append(f'<div class="c"><span class="id">{c}-{i}</span><b>{html.escape(name)}</b> <span>{html.escape(desc)}</span>')
            for k, tag, text in lines:
                f = f'cinderella/{role}_{nm}' + (f'_{k}' if len(lines) > 1 else '') + '.mp3'
                lab = f'<p>{"첫째 문장 (슬픔)" if k=="a" else "둘째 문장 (기쁨)"}</p>' if len(lines) > 1 else ''
                h.append(f'{lab}<audio controls preload="none" src="{f}"></audio>')
            h.append(f'<textarea rows="1" placeholder="메모" data-k="{c}-{i}"></textarea></div>')
    h.append('<h2>선택 결과</h2><div class="pick"><textarea rows="4" placeholder="예) 신데렐라 A-2, 내레이터 B-1, 요정 C-3, 새엄마 D-1, 큰언니 E-2, 작은언니 F-1, 왕자 G-3" data-k="choices"></textarea></div>')
    h.append('<script>document.querySelectorAll("textarea").forEach(function(t){var k="cind_aud_"+t.dataset.k;try{t.value=localStorage.getItem(k)||""}catch(e){}t.addEventListener("input",function(){try{localStorage.setItem(k,t.value)}catch(e){}})})</script></body></html>')
    open(os.path.join(ROOT, 'audio/el/audition/cinderella.html'), 'w').write('\n'.join(h))
if __name__ == '__main__': main()
