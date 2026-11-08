import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=path.dirname(fileURLToPath(import.meta.url));
const require=createRequire(import.meta.url);
const sharp=require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'latest-build.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(root,'site-data.json'),'utf8'));
const out=path.join(root,'previews',manifest.version,'reader');fs.mkdirSync(out,{recursive:true});
const all=[...data.base.modules.flatMap(m=>m.nodes),...data.base.tools,...data.base.supplementalDefinitions];
const previews=[];
for(const id of ['V16','V17','R12','I17','T14','A08','TOOL13','TOOL39']){
 const node=all.find(n=>n.id===id);if(!node)throw Error(id);
 const dom=new JSDOM(data.originalSvg,{contentType:'image/svg+xml'}),svg=dom.window.document.documentElement;
 const w=node.w+60,h=node.h+60;
 svg.setAttribute('viewBox',`${node.x-30} ${node.y-30} ${w} ${h}`);
 const width=node.w>1600?1800:1100;
 svg.setAttribute('width',width);svg.setAttribute('height',Math.round(h/w*width));
 const file=path.join(out,id+'.png');
 const info=await sharp(Buffer.from(svg.outerHTML)).flatten({background:'#fff'}).png().toFile(file);
 previews.push({id,file,width:info.width,height:info.height});dom.window.close();
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(previews,null,2));
console.log(JSON.stringify(previews,null,2));
