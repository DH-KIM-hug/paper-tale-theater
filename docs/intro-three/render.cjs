/* Run from the project root. Requires Playwright, Chrome/Chromium, and ffmpeg. */
const {chromium}=require('playwright');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
(async()=>{
 const dest=path.resolve(__dirname,'opening-three.mp4');
 const frames=fs.mkdtempSync(path.join(os.tmpdir(),'paper-three-frames-'));
 const chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
 const browser=await chromium.launch({...(fs.existsSync(chrome)?{executablePath:chrome}:{}),headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});const errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 try{
 await page.goto((process.env.INTRO_URL||'http://127.0.0.1:8879/docs/intro-three/')+'?export=1');
 await page.waitForFunction(()=>window.introReady,null,{timeout:60000});
 const duration=await page.evaluate(()=>window.introDuration);
 const fps=30,total=Math.round(duration*fps);
 for(let i=0;i<total;i++){
  await page.evaluate(t=>window.renderAt(t),i/fps);
  await page.locator('canvas').screenshot({path:path.join(frames,String(i).padStart(4,'0')+'.png')});
  if(i%48===0)console.log(`Rendered ${i}/${total} frames`);
 }
 if(errors.length)throw new Error(errors.join('\n'));
 await browser.close();
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate','30','-i',path.join(frames,'%04d.png'),'-c:v','libx264','-crf','18','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',dest],{stdio:'inherit'});
 fs.rmSync(frames,{recursive:true,force:true});console.log('Saved '+dest+' ('+duration+' seconds, 1440×900, 30fps)');
 }catch(e){await browser.close();console.error('Frames retained at '+frames);throw e}
})().catch(e=>{console.error(e);process.exit(1)});
