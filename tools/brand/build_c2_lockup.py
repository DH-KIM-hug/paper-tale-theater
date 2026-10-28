"""Compose selected C2 bitmap emblem with the existing outlined wordmark.
Original user artwork remains in assets/raw/logo_gpt; this creates an SVG wrapper, not a vector trace.
"""
from pathlib import Path
from base64 import b64encode
from xml.etree import ElementTree as E
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/brand';ns='http://www.w3.org/2000/svg';E.register_namespace('',ns)
textroot=E.parse(OUT/'theatre-wordmark.svg').getroot()
letters=''.join(E.tostring(g,encoding='unicode') for g in textroot if g.tag==f'{{{ns}}}g')
def uri(file):return 'data:image/png;base64,'+b64encode((OUT/file).read_bytes()).decode()
logo=f'<svg xmlns="{ns}" viewBox="160 40 704 820" role="img"><title>톡톡 동화극장 — C2 무대 위 달</title><image href="{uri("c2-mark.png")}" x="322" y="24" width="380" height="380"/>{letters}</svg>'
(OUT/'c2-logo.svg').write_text(logo)
roundsvg=f'<svg xmlns="{ns}" viewBox="0 0 1024 1024"><defs><clipPath id="circle"><circle cx="512" cy="512" r="512"/></clipPath></defs><image href="{uri("c2-icon.png")}" width="1024" height="1024" clip-path="url(#circle)"/></svg>'
(OUT/'c2-icon-round.svg').write_text(roundsvg)
print('Composed C2 logo and round icon wrapper')
