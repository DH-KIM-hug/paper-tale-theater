"""English C2 identity: Toki Toki Tale, matching the approved Korean A/B hierarchy.
Uses the approved UI mark unchanged and outlines the existing Pretendard 880/800.
"""
from pathlib import Path
from base64 import b64encode
from io import BytesIO
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'assets/brand';FONTS={}
for weight in [880,800]:
 f=instantiateVariableFont(TTFont(ROOT/'assets/fonts/PretendardVariable.woff2'),{'wght':weight},inplace=False)
 FONTS[weight]=(f.getGlyphSet(),f.getBestCmap(),f['head'].unitsPerEm)
def lettering(text,weight,size,color,tracking=0):
 gs,cmap,em=FONTS[weight];cursor=0;paths=[];scale=size/em
 for ch in text:
  name=cmap[ord(ch)];pen=SVGPathPen(gs);gs[name].draw(pen)
  if pen.getCommands():paths.append(f'<path transform="translate({cursor:.4f} 0)" d="{pen.getCommands()}"/>')
  cursor+=gs[name].width+tracking/scale
 width=cursor*scale-tracking
 return f'<g fill="{color}" transform="scale({scale:.8f} {-scale:.8f})">'+''.join(paths)+'</g>',width
# Use the exact current mark; only the SVG image viewport excludes transparent margin.
im=Image.open(ROOT/'assets/ui/logo_mark.webp').convert('RGBA');bounds=im.getchannel('A').getbbox();buf=BytesIO();im.save(buf,format='PNG');uri='data:image/png;base64,'+b64encode(buf.getvalue()).decode();l,t,r,b=bounds
mark_ratio=(r-l)/(b-t)
def mark(cx,y,height):
 width=height*mark_ratio
 return f'<svg x="{cx-width/2:.3f}" y="{y}" width="{width:.3f}" height="{height}" viewBox="{l} {t} {r-l} {b-t}"><image href="{uri}" width="{im.width}" height="{im.height}"/></svg>'
def at(x,y,content):return f'<g transform="translate({x:.3f} {y:.3f})">{content}</g>'
for theme,orange,ink in [('light','#D9622F','#222B45'),('dark','#E8703A','#F6ECD8')]:
 name,nw=lettering('Toki Toki',880,82,orange,-.8);tale,tw=lettering('Tale',800,58,ink,-.45)
 width=round(250+nw+38)
 a=mark(115,30,202)+at(250,112,name)+at(252,198,tale)
 name,nw=lettering('Toki Toki',880,62,orange,-.6);tale,tw=lettering('Tale',800,62,ink,-.45)
 total=nw+18+tw;left=(560-total)/2
 bmark=mark(280,32,252)+at(left,386,name)+at(left+nw+18,386,tale)
 for form,body,w,h in [('A-horizontal',a,width,270),('B-vertical',bmark,560,440)]:
  s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img"><title>Toki Toki Tale</title><desc>C2 moon stage mark, Pretendard 880/800 outlined wordmark. {form}, {theme} background version.</desc>{body}</svg>'
  (OUT/f'c2-logo-en-{form}-{theme}.svg').write_text(s)
  print(form,theme,w,h)
