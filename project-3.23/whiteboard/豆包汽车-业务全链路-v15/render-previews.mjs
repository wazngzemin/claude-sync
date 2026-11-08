import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const dir=path.dirname(fileURLToPath(import.meta.url));
const graph=JSON.parse(fs.readFileSync(path.join(dir,'graph-v15.json'),'utf8'));
const svg=fs.readFileSync(path.join(dir,'业务全链路-v15.svg'),'utf8');
const folder=path.join(dir,'previews');
for(const id of ['V','D','T','O','F','H','I','U','K','A']){
  const m=graph.modules.find(m=>m.id===id);
  await sharp(Buffer.from(fs.readFileSync(path.join(folder,id+'.svg'),'utf8'))).resize({width:1800}).png().toFile(path.join(folder,id+'.png'));
  const crop=svg.replace(/width="\d+" height="\d+" viewBox="0 0 \d+ \d+"/,`width="2860" height="2510" viewBox="${m.x-50} ${m.y-50} 2860 2510"`);
  await sharp(Buffer.from(crop)).resize({width:1900}).png().toFile(path.join(folder,id+'-阅读片段.png'));
}
console.log('Rendered 10 full-module previews and 10 reading crops, offline from the final SVG.');
