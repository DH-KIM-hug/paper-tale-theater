"""Editable C identity: one paper-theatre geometry, purpose-built small-size variants.
Requires fonttools[brotli] to outline the project's existing Pretendard font.
"""
from pathlib import Path
from math import sin,cos,pi,hypot
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'assets/brand';OUT.mkdir(exist_ok=True)
RED='#A93B32'; GOLD='#D9A94E'; GREEN='#3F6B4F'; CREAM='#F6ECD8'; INK='#222B45'
DEFS='''<defs><radialGradient id="light"><stop offset="0" stop-color="#F6ECD8"/><stop offset="1" stop-color="#F2B366"/></radialGradient>
<filter id="edge" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="1" dy="4" stdDeviation="3" flood-color="#2E241C" flood-opacity=".16"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="19" result="grain"/><feColorMatrix in="grain" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<clipPath id="opening"><path d="M152 900V528a360 360 0 0 1 720 0v372Z"/></clipPath></defs>'''
def star(cx,cy,r=137):
 pts=[(cx+sin(i*pi/5)* (r if i%2==0 else r*.49),cy-cos(i*pi/5)*(r if i%2==0 else r*.49)) for i in range(10)]
 parts=[]
 for i,p in enumerate(pts):
  a=pts[i-1];b=pts[(i+1)%10];d1=hypot(a[0]-p[0],a[1]-p[1]);d2=hypot(b[0]-p[0],b[1]-p[1]);rr=10
  q=(p[0]+(a[0]-p[0])*rr/d1,p[1]+(a[1]-p[1])*rr/d1);z=(p[0]+(b[0]-p[0])*rr/d2,p[1]+(b[1]-p[1])*rr/d2);parts.append((q,p,z))
 s=f'M{parts[0][0][0]:.2f} {parts[0][0][1]:.2f}'
 for q,p,z in parts:s+=f'L{q[0]:.2f} {q[1]:.2f}Q{p[0]:.2f} {p[1]:.2f} {z[0]:.2f} {z[1]:.2f}'
 return s+'Z'
def symbol(small=False):
 shadow='' if small else ' filter="url(#edge)"';light=CREAM if small else 'url(#light)'
 outer=f'<path fill="{RED}" d="M64 900V512a448 448 0 0 1 896 0v388q0 28-28 28H92q-28 0-28-28Z"/>'
 inner=f'<path fill="{light}" d="M152 900V528a360 360 0 0 1 720 0v372Z"/>'
 # Three broad scallops, two broad curtain folds; no fine fringe or lines.
 curtains=f'<g clip-path="url(#opening)"><path fill="{GOLD}"{shadow} d="M140 150H884V350Q760 466 636 350Q512 466 388 350Q264 466 140 350Z"/>'
 curtains+=f'<path fill="{RED}"{shadow} d="M135 330Q320 470 216 620Q290 754 144 900H120V330ZM889 330Q704 470 808 620Q734 754 880 900H904V330Z"/>'
 curtains+=f'<path fill="{GREEN}" d="M144 900Q336 720 512 760Q710 730 880 900Z"/>'
 curtains+=f'<path fill="#C98A5B"{shadow} d="{star(512,570,147 if small else 137)}"/></g>'
 return outer+inner+curtains
def svg(body,vb='0 0 1024 1024',defs=DEFS,title='톡톡 동화극장 — 종이 극장'):
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img"><title>{title}</title>{defs}{body}</svg>\n'
for name,bg,small in [('mark',False,False),('icon',True,False),('icon-small',True,True),('mark-small',False,True)]:
 body=(f'<path fill="{RED}" d="M0 0H1024V1024H0Z"/>' if bg else '')+symbol(small)
 if not small:body=f'<g filter="url(#paper)">{body}</g>'
 # Trim external transparent margins for the in-app mark without changing geometry.
 (OUT/f'theatre-{name}.svg').write_text(svg(body,'48 48 928 896' if not bg else '0 0 1024 1024'))
font=instantiateVariableFont(TTFont(ROOT/'assets/fonts/PretendardVariable.woff2'),{'wght':750},inplace=False);gs=font.getGlyphSet();cmap=font.getBestCmap()
def text(s,width,x,y,color,tracking=12):
 glyphs=[];cursor=0
 for c in s:
  name=cmap[ord(c)];pen=SVGPathPen(gs);gs[name].draw(pen);glyphs.append(f'<path transform="translate({cursor} 0)" d="{pen.getCommands()}"/>');cursor+=gs[name].width+tracking
 scale=width/(cursor-tracking)
 return f'<g fill="{color}" transform="translate({x} {y}) scale({scale} {-scale})">'+''.join(glyphs)+'</g>'
# Two typographic rows, all outlines; no font loading in the logo asset.
letters=text('톡톡',510,257,625,'#D9622F',24)+text('동화극장',510,257,800,INK,22)
lockup=f'<g transform="translate(348 48) scale(.32)">{symbol()}</g>'+letters
(OUT/'theatre-logo.svg').write_text(svg(lockup,'160 40 704 820'))
# Font source stays project-local. Outline paths retain the original font licensing.
(OUT/'theatre-wordmark.svg').write_text(svg(letters,'230 360 564 470',defs=''))
print('Wrote theatre icon, mark, small-size variants and outlined logo to',OUT)
roundbody=f'<defs><clipPath id="round"><circle cx="512" cy="512" r="512"/></clipPath></defs><g clip-path="url(#round)"><g filter="url(#paper)"><path fill="{RED}" d="M0 0H1024V1024H0Z"/>{symbol()}</g></g>'
(OUT/'theatre-icon-round.svg').write_text(svg(roundbody))
