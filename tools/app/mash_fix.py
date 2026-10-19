"""T.mash(...) 한 곳을 '저절로' 또는 '한 번 톡 → 저절로'로 바꾸는 도우미 (동화 톡 조작 정리, 2026-10-19).
convert(src, anchor_text, mode, delay, name) → 새 소스. anchor_text 는 그 mash 호출을 찾는 고유한 앞부분."""
import re
def convert(s, anchor, mode, delay, name, tap_target='stageWrap', tap_prompt='화면을 톡 눌러 봐요!'):
    i = s.index(anchor)
    m = re.compile(r'await T\.mash\(([^,]+), \{ count: (\d+), prompt: (\'[^\']*\'), onStep: ([^=]*?) => \{').match(s, i)
    if not m:  # onStep: () => run2(...) 처럼 한 줄짜리
        m2 = re.compile(r'await T\.mash\(([^,]+), \{ count: (\d+), prompt: (\'[^\']*\'), onStep: (\(\)|i) => ([^}]*?) \}\);').match(s, i)
        assert m2, s[i:i+200]
        tgt, cnt, args, body = m2.group(1), int(m2.group(2)), m2.group(4), m2.group(5)
        arg = 'i' if args == 'i' else '_'
        new = f"const {name} = {arg} => {body};\n    "
        end = m2.end()
    else:
        tgt, cnt, args = m.group(1), int(m.group(2)), m.group(4)
        j = m.end(); depth = 1; k = j
        while depth:
            c = s[k]; depth += (c == '{') - (c == '}'); k += 1
        body = s[j:k - 1]
        assert s[k:k + 3] == ' })' or s[k:k + 4] == ' });', s[k:k + 10]
        end = s.index(');', k) + 2
        arg = 'i' if 'i' in args else '_'
        new = f"const {name} = {arg} => {{{body}}};\n    "
    if mode == 'tap':
        new += f"await T.tap({tgt}, {{ prompt: '{tap_prompt}' }}); // 한 번 누르면 나머지는 저절로 (2026-10-19)\n    "
    else:
        new += "// 저절로 (2026-10-19 톡 조작 정리)\n    "
    new += f"for (let i = 1; i <= {cnt}; i++) {{ await {name}(i); await sleep({delay}); }}"
    return s[:i] + new + s[end:]
