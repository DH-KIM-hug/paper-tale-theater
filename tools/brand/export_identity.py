from pathlib import Path
from PIL import Image
import shutil,json,re
root=Path('.');archive=Path('assets/brand/archive');archive.mkdir(exist_ok=True)
for src,dst in [('assets/icons/favicon-512.png','door-icon.png'),('assets/ui/logo_mark.webp','book-mark.webp')]:
 p=archive/dst
 if not p.exists():shutil.copy2(src,p)
# Runtime formats; original vectors and raster exports stay available in assets/brand.
logo=Image.open('assets/brand/c2-logo.png').convert('RGBA');logo.save('assets/v3w/sp_logo_c2_v1.webp',lossless=True)
mark=Image.open('assets/brand/c2-mark.png').convert('RGBA');mark.thumbnail((512,512),Image.Resampling.LANCZOS);mark.save('assets/ui/logo_mark.webp',lossless=True)
for n in [16,32,192,512,1024,180]:
 im=Image.open('assets/brand/c2-icon.png').convert('RGB').resize((n,n),Image.Resampling.LANCZOS)
 name='apple-touch-icon.png' if n==180 else ('app-icon-1024.png' if n==1024 else f'favicon-{n}.png');im.save(Path('assets/icons')/name)

print("Exported runtime logo, UI mark and app icon sizes")

# Native launch icons, keeping the platform's current filenames and density sizes.
ios=Path('ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png')
if ios.exists():shutil.copy2('assets/icons/app-icon-1024.png',ios)
for p in Path('android/app/src/main/res').glob('mipmap-*/ic_launcher*.png'):
 size=Image.open(p).size
 im=Image.open('assets/brand/c2-icon-round.png' if p.stem.endswith('_round') else 'assets/brand/c2-icon.png')
 im=im.convert('RGBA' if p.stem.endswith('_round') else 'RGB').resize(size,Image.Resampling.LANCZOS);im.save(p)
