import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.dirname(fileURLToPath(import.meta.url));
const latest=JSON.parse(fs.readFileSync(path.join(root,'latest-build.json'),'utf8'));
const out=path.join(root,'previews',latest.version);fs.mkdirSync(out,{recursive:true});
const manifest=[];
for(const file of fs.readdirSync(path.join(root,'diagrams')).filter(x=>x.endsWith('.svg'))){
 const raw=fs.readFileSync(path.join(root,'diagrams',file));
 const info=await sharp(raw,{density:144}).flatten({background:'#fff'}).png().toFile(path.join(out,file.replace('.svg','.png')));
 manifest.push({file,width:info.width,height:info.height});
 if(file==='overview.svg'||/^(K-|EV-|EL-|SE-|DR-|R-endcloud|O-|E-|A-visual)/i.test(file)){
  const input=path.join(out,file.replace('.svg','.png'));
  await sharp(input).extract({left:0,top:0,width:info.width,height:Math.min(1550,info.height)}).png().toFile(path.join(out,file.replace('.svg','-top.png')));
  if(info.height>1550)await sharp(input).extract({left:0,top:Math.min(1550,info.height-1550),width:info.width,height:1550}).png().toFile(path.join(out,file.replace('.svg','-middle.png')));
  if(info.height>3100)await sharp(input).extract({left:0,top:Math.min(3100,info.height-1550),width:info.width,height:1550}).png().toFile(path.join(out,file.replace('.svg','-lower.png')));
 }
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify({directory:out,rendered:manifest.length,manifest},null,2));
