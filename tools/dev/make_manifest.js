// 개발자 검증용: 각 동화의 음성 목록(한국어·영어)을 tools/dev/manifest.json 으로 만든다.
// 사용: node tools/dev/make_manifest.js   (narration*.js 를 샌드박스에서 읽는다)
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..', 'tales');
const out = {};
for (const t of fs.readdirSync(root).sort()) {
  const dir = path.join(root, t);
  if (!fs.statSync(dir).isDirectory() || !fs.existsSync(path.join(dir, 'narration_el.js'))) continue;
  const read = f => { const p = path.join(dir, f); if (!fs.existsSync(p)) return {}; const ctx = { NARRATION_CLIPS: {}, NARRATION_CLIPS_EN: {}, VOICE_LINES: {}, VOICE_LINES_EN: {} }; vm.runInNewContext(fs.readFileSync(p, 'utf8'), ctx); return ctx; };
  const ko = read('narration_el.js'), en = read('narration_el_en.js');
  const kr = Object.assign({}, ko.NARRATION_CLIPS), enr = Object.assign({}, en.NARRATION_CLIPS_EN);
  const toList = m => Object.entries(m).map(([text, file]) => ({ text, file: '../../' + file }));
  let vs = {}; try { vs = JSON.parse(fs.readFileSync(path.join(dir, 'voice_script_el.json'), 'utf8')); } catch (e) { }
  out[t] = { ko: toList(kr), en: toList(enr), extra: Object.keys(ko.VOICE_LINES || {}).length };
}
fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(out, null, 0));
console.log(Object.keys(out).length, 'tales');
