import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const dir=fileURLToPath(new URL('.',import.meta.url));
const v2=process.env.SLS_DRAFT_VERSION==='v02';
const v3=process.env.SLS_DRAFT_VERSION==='v03';
const plan=JSON.parse(await fs.readFile(dir+(v3?'v03-data.json':v2?'v02-data.json':'final-edits.json'),'utf8'));
const source=JSON.parse(await fs.readFile(dir+'source-values.json','utf8'))[plan.sheet];
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(dir+'赛力斯端状态信号库-原始下载-20261117.xlsx'));
const s=wb.worksheets.getItem(plan.sheet);
if(v3){
  s.getRange('AT1:AU385').values=source.map(r=>r.slice(45,47));
  for(const p of plan.patches)s.getRange(p.cell).values=[[p.after]];
  wb.recalculate();
  console.log((await wb.inspect({kind:'table',range:`'${plan.sheet}'!AT372:AU382`,include:'values',tableMaxRows:11,tableMaxCols:2,maxChars:2200})).ndjson);
  for(const [label,range] of [['v03-温度表达式','AT372:AV382'],['v03-行驶时长','AT61:AV64'],['v03-拥堵时长','AT175:AV176']]){
    const blob=await wb.render({sheetName:plan.sheet,range,scale:1,format:'png'});
    await fs.writeFile(dir+label+'.png',new Uint8Array(await blob.arrayBuffer()));
  }
  const out=await SpreadsheetFile.exportXlsx(wb);await out.save(dir+'v03-authored.xlsx');
  console.log('V03_AUTHORED');process.exit(0);
}
// Normalize the local authoring view from the exact source values; final packaging
// retains every original native part and transfers only the scoped authored cells.
s.getRange('AT1:AW385').values=source.map(r=>r.slice(45,49));
s.getRange('AW1:AW385').copyFrom(s.getRange('AU1:AU385'),'all');
s.getRange('AW1:AW385').values=source.map(r=>[r[48]]);
s.getRange('AW1:AW385').format.wrapText=true;
s.getRange('AW1:AW385').format.columnWidthPx=680;
s.getRange('AW1:AW385').format.verticalAlignment='center';
for(const p of plan.patches){
    s.getRange(p.cell).values=[[p.after]];
    s.getRange(p.cell).format.wrapText=true;
}
for(const row of plan.rows){
    const note=plan.review.find(r=>r.row===row).aw||'';
    const h=Math.max(76,Math.ceil(note.length/43)*18+12);
    const old=s.getRange(`AW${row}`).format.rowHeightPx;
    s.getRange(`AW${row}`).format.rowHeightPx=Math.max(Number(old)||0,h);
    s.getRange(`AW${row}`).format.font={name:'PingFang SC',size:10,color:'#202020'};
}
s.getRange('AW1').format.font={name:'PingFang SC',size:10,bold:true,color:'#000000'};
if(v2){
  const task=wb.worksheets.add('Trigger任务表');
  const detail=wb.worksheets.add('参数能力对照');
  const body=plan.tasks.map(t=>[t.id,t.category,t.title,t.parameters,t.current,t.target,t.operators,t.logic,t.acceptance,t.blocker,t.evidence]);
  const sourceUrl=plan.source_urls;
  const taskHeader=['任务编号','处理类别','任务','v1.3行号与信号参数','现有记录与环境','需要完成的工作','目标运算符／判断方式','触发条件与组合','验收示例','依赖或待确认项','依据'];
  const compareHeader=['v1.3行号','信号名称','参数','v1.2定义','v1.3定义','能力记录原文','差异','处理结论','关联任务','来源位置'];
  function lines(text,width){
    return String(text??'').split('\n').reduce((n,p)=>n+Math.max(1,Math.ceil([...p].reduce((v,c)=>v+(c.charCodeAt(0)>255?13:7),0)/(width-18))),0);
  }
  function layout(sh,header,data,widths,title,caption,tableName){
    const last=8+data.length, cols=header.length;
    sh.showGridLines=false;sh.tabColor='#24476A';
    sh.getRangeByIndexes(0,0,last,cols).format.fill='#FFFFFF';
    sh.getRangeByIndexes(0,0,last,cols).format.font={name:'PingFang SC',size:10,color:'#243444'};
    sh.getRangeByIndexes(0,0,last,cols).format.verticalAlignment='top';
    widths.forEach((w,i)=>sh.getRangeByIndexes(0,i,last,1).format.columnWidthPx=w);
    sh.getRange('A1').format.rowHeightPx=9;
    sh.getRange('A2').values=[[title]];sh.getRange('A2').format.font={name:'PingFang SC',size:15,bold:true,color:'#173854'};
    sh.getRange('A2').format.rowHeightPx=30;
    sh.getRange('A3').values=[[caption]];
    sh.getRange('A4').values=[['原始端状态表：'+sourceUrl[0]]];
    sh.getRange('A5').values=[['触发器能力表：'+sourceUrl[2]+'（使用 sls 页；不是上汽页）']];
    sh.getRange('A6').values=[['场景与频控：'+sourceUrl[3]]];
    sh.getRange('A3:A6').format.rowHeightPx=23;
    sh.getRange('A3:A6').format.font={name:'PingFang SC',size:10,color:'#52677A'};
    sh.getRangeByIndexes(7,0,data.length+1,cols).values=[header,...data];
    const end=String.fromCharCode(64+cols);
    const tab=sh.tables.add(`A8:${end}${last}`,true,tableName);tab.style='TableStyleLight1';tab.showFilterButton=true;
    sh.getRangeByIndexes(7,0,1,cols).format={fill:'#24476A',font:{name:'PingFang SC',size:10,color:'#FFFFFF',bold:true},rowHeightPx:32,verticalAlignment:'center',horizontalAlignment:'center',wrapText:true};
    sh.getRangeByIndexes(8,0,data.length,cols).format.wrapText=true;
    for(let i=0;i<data.length;i++){
      const height=Math.max(70,Math.max(...data[i].map((x,j)=>lines(x,widths[j])))*17+14);
      sh.getRangeByIndexes(i+8,0,1,cols).format.rowHeightPx=height;
      if(i%2)sh.getRangeByIndexes(i+8,0,1,cols).format.fill='#F3F6F9';
    }
    sh.freezePanes.freezeRows(8);sh.freezePanes.freezeColumns(3);
  }
  layout(task,taskHeader,body,[70,100,205,270,320,320,310,370,340,300,320],
    '赛力斯 v1.3 Trigger 任务表',
    '2026-11-17　本地修订 v02。现有记录与目标逻辑分列；需核实不等于需新增，历史群状态不等于当前上线。','SlsTriggerTasksV02');
  layout(detail,compareHeader,plan.comparison,[80,185,145,320,320,390,390,300,110,290],
    '赛力斯参数能力与版本差异',
    `覆盖 v1.3 的 ${plan.record_counts.v13_records} 条记录。原表空白记为未标注，不推断不支持；独立条件表未匹配项列在末尾。`,'SlsTriggerCompareV02');
  // Clear operator semantics, separate from claims about platform support.
  let n=10+body.length;
  task.getRange(`A${n}:K${n+6}`).format.fill='#FFFFFF';
  task.getRange(`A${n}:K${n+6}`).format.font={name:'PingFang SC',size:10,color:'#243444'};
  task.getRange(`C${n}:H${n}`).values=[['判断方式释义（仅说明语义，具体参数是否支持见对应记录）',null,null,null,null,null]];
  task.getRange(`C${n}`).format.font={name:'PingFang SC',size:11,bold:true};
  const glossary=[
    ['等于／大于／大于等于／小于／小于等于','比较本次值：x=k、x>k、x≥k、x<k、x≤k。成立后是否触发，还要看事件机制、其他条件和频控。'],
    ['有变更','比较前后两次有效值：old≠new。首次上报、无效值及复位如何处理由平台规则决定，不能默认。'],
    ['变更为','old≠new 且 new=目标值。未指定old的具体值；要求“未导航→导航中”时还须限定old。'],
    ['条件组里的且／或','且：本组所有条件成立；或：本组至少一条成立。组之间再按选定的且／或组合；且本身不表示事件先后或时间窗。'],
    ['频控5分钟','限制5分钟内重复触发次数；不等同每5分钟自动触发，也不补齐缺失的端状态。'],
    ['包含','按引擎所支持的数据类型解释；不能将单值枚举或VLM语义识别一律理解为字符串包含。']
  ];
  for(const [i,g] of glossary.entries()){
    task.getRange(`C${n+1+i}`).values=[[g[0]]];task.getRange(`D${n+1+i}`).values=[[g[1]]];
    task.getRange(`C${n+1+i}:D${n+1+i}`).format.wrapText=true;
    task.getRange(`C${n+1+i}:D${n+1+i}`).format.rowHeightPx=Math.max(lines(g[0],205),lines(g[1],270))*17+14;
  }
}
wb.recalculate();
console.log((await wb.inspect({kind:'table',range:`'${plan.sheet}'!AT372:AW381`,include:'values,formulas',tableMaxRows:10,tableMaxCols:4,tableMaxCellChars:220,maxChars:9000})).ndjson);
const previews=v2?[
  ['v02-任务现状','Trigger任务表','A8:F12'],['v02-触发逻辑','Trigger任务表','G8:K12'],
  ['v02-能力对照','参数能力对照','A8:G12'],['v02-温度标注',plan.sheet,'AT372:AW381']
]:[['温度与位置',plan.sheet,'AT372:AW381'],['导航与阈值',plan.sheet,'AT169:AW176'],['空调拆分',plan.sheet,'AT138:AW143']];
for(const [name,sheetName,range] of previews){
    const blob=await wb.render({sheetName,range,scale:1,format:'png'});
    await fs.writeFile(dir+name+'.png',new Uint8Array(await blob.arrayBuffer()));
}
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#NULL!|#SPILL!|#CALC!',options:{useRegex:true,maxResults:15},maxChars:3000})).ndjson);
const out=await SpreadsheetFile.exportXlsx(wb);
await out.save(dir+(v2?'v02-authored.xlsx':'authored-cells.xlsx'));
console.log('AUTHORED');
