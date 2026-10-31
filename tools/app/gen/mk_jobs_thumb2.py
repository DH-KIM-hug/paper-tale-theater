#!/usr/bin/env python3
"""홈 카드 썸네일 다시 그리기(레터링 자리 비움) — 2026-10-31 사용자: 썸네일 위에 동화별 레터링을 얹고 아래 글자 제목은 없앤다(시안 '가').
지금 타일(assets/thumbs/<id>_tile.webp)을 참고로 같은 인물·같은 그림체로, 위쪽 38%는 하늘·벽 같은 조용한 바탕으로 비우고 인물은 아래로.
3:2 로 받아 가운데 4:3 으로 잘라 쓴다.
  python3 tools/app/gen/mk_jobs_thumb2.py && python3 tools/app/gen/run_simple.py thumb2 th2_patjuk ..."""
import json, os, re
G = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
src = open(f'{G}/tales/catalog.js', encoding='utf-8').read()
T = re.findall(r"\{ id: '(\w+)', title: '([^']+)'", src)
P = """Use case: children's picture-book app home-screen card thumbnail (ages 3-4), layered paper-cut collage art.
Reference image: the current thumbnail of the tale "{title}". Keep the SAME characters with the SAME designs, colours, outfits, faces and paper-art style, and the same setting and palette. Characters are layered coloured-paper cut pieces with faces; props have no faces.
Primary request: RE-COMPOSE it as a fresh 3:2 picture with clear empty space at the top for a title lettering that will be added later:
- The TOP 38% of the picture is calm, simple background only (sky, wall, night sky, sea water, etc. that belongs to the scene): no faces, no heads, no characters, no busy objects, no text there. A moon, a few soft clouds or a distant hill line at the far edges are fine.
- The characters stand in the LOWER 62%, large and clearly visible, heads below the 40% line, faces turned toward the viewer, friendly expressions.
- Keep every character and important object inside the central 88% of the width (the sides will be cropped to 4:3).
Style: flat matte coloured paper, one colour per piece, fine paper-fibre texture, soft short dark warm shadows between layers only; no gloss, no gradients inside pieces, no outlines, no photo textures. No text, no letters, no logos, no frame, no border."""
# 동화별 구도 덧붙임(2026-10-31 사용자: 구름 공장은 공장 굴뚝 연기가 구름이 되는 콘셉트가 보이게)
EXTRA = {'kkultteok': 'Tale concept to show clearly: a small cute paper cloud factory building with chimneys stands in the lower right, and the white smoke puffing out of its chimneys rises and turns into fluffy white clouds that drift up across the sky. The three children and the dog stand in the lower left looking up at the clouds happily. The top 38% stays calm sky with only those soft clouds (no faces there).'}
jobs = [{'id': f'th2_{t}', 'kind': 'bg', 'aspect': 'landscape 3:2', 'out': f'assets/raw/thumb2/{t}_tile.png', 'refs': [f'assets/thumbs/{t}_tile.webp'],
         'prompt': P.format(title=title) + ('\n' + EXTRA[t] if t in EXTRA else '')} for t, title in T]
json.dump(jobs, open(f'{G}/tools/app/gen/jobs_thumb2.json', 'w'), ensure_ascii=False, indent=1)
print(len(jobs), 'jobs')
