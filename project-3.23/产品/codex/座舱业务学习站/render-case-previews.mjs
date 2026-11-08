import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('/Users/bytedance/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {JSDOM}=require('/Users/bytedance/.npm/_npx/12f3a93219d134f5/node_modules/jsdom');
const work='research/case-rewrite-20261029';
const data=JSON.parse(fs.readFileSync(work+'/candidate-data.json'));
const manifest=JSON.parse(fs.readFileSync(work+'/candidate-manifest.json'));
const out=path.resolve('previews',manifest.version,'case');fs.mkdirSync(out,{recursive:true});
const records=[];
for(const [id,svg] of Object.entries(data.diagrams)){
 const file=path.join(out,id+'.png');
 const metadata=await sharp(Buffer.from(svg)).metadata();
 const info=await sharp(Buffer.from(svg)).resize({width:Math.min(metadata.width,1160)}).flatten({background:'#fff'}).png().toFile(file);
 const crops=[];
 for(const [part,top] of [['top',0],['middle',Math.max(0,Math.floor(info.height/2)-700)],['bottom',Math.max(0,info.height-1400)]]){
  const crop=path.join(out,id+'-'+part+'.png');
  await sharp(file).extract({left:0,top,width:info.width,height:Math.min(1400,info.height-top)}).png().toFile(crop);crops.push(crop);
 }
 records.push({id,file,width:info.width,height:info.height,crops});
}
const all=[...data.base.modules.flatMap(m=>m.nodes),...data.base.tools,...data.base.supplementalDefinitions];
for(const id of ['V6','V9','V17','M8','C7','C12','I13','A10','A16','G11','H10','P02','U13','SUP04']){
 const node=all.find(n=>n.id===id);if(!node)continue;
 const dom=new JSDOM(data.originalSvg,{contentType:'image/svg+xml'}),svg=dom.window.document.documentElement;
 const width=node.w+60,height=node.h+60;
 svg.setAttribute('viewBox',`${node.x-30} ${node.y-30} ${width} ${height}`);
 svg.setAttribute('width','1100');svg.setAttribute('height',String(Math.round(height/width*1100)));
 const file=path.join(out,'original-'+id+'.png');
 const info=await sharp(Buffer.from(svg.outerHTML)).flatten({background:'#fff'}).png().toFile(file);
 records.push({id,file,width:info.width,height:info.height});dom.window.close();
}
fs.writeFileSync(work+'/preview-manifest.json',JSON.stringify({version:manifest.version,contentHash:manifest.sha256,records},null,2));
console.log(JSON.stringify({version:manifest.version,diagrams:Object.keys(data.diagrams).length,files:records.length,output:out},null,2));
