// N13 视频通话 主图 1400x900
const nodes=[];
const BLUE={fill:'#DBEAFE',border:'#2563eb'};
const GOLD={fill:'#FEF3C7',border:'#D97706'};
const GREEN={fill:'#D1FAE5',border:'#059669'};
const GREY={fill:'#F5F5F4',border:'#78716C'};

function card(id,x,y,w,h,title,lines,style,status){
  const runs=[{content:title+'\n',bold:true,fontSize:13,color:'#111827'}];
  lines.forEach(l=>runs.push({content:l+'\n',fontSize:11,color:'#374151'}));
  if(status) runs.push({content:status,fontSize:10,color:'#6B7280'});
  nodes.push({type:'rect',id,x,y,width:w,height:h,
    fillColor:style.fill,borderColor:style.border,borderWidth:2,borderRadius:8,
    text:runs,textAlign:'left',verticalAlign:'top'});
}
function label(x,y,w,text,size,color){
  nodes.push({type:'text',x,y,width:w,height:'fit-content',text,fontSize:size||12,textColor:color||'#111827'});
}
function conn(from,to,color,label,dash){
  nodes.push({type:'connector',connector:{from,to,fromAnchor:'bottom',toAnchor:'top',
    lineShape:'rightAngle',lineColor:color||'#2563eb',lineWidth:2,lineStyle:dash?'dashed':'solid',
    startArrow:'none',endArrow:'arrow',label:label||''}});
}

label(40,16,1000,'N13 视频通话：两层含义 + 后台逐帧链路（资料少，多为【待核】）',16,'#111827');

// 上层：用户侧主链
card('N13-01',40,80,300,150,'N13-01 vehicle_communication（TOOL03 车端通讯）',
 ['要点：车里唯一的通讯工具，打电话/发起视频通话走它。',
  '讲解①：用户语音"给张三打视频电话"→ Director 调本工具。',
  '讲解②：资料仅见工具表一行，无端云分工、无车型 PRD。'],BLUE,'【已落地-待核】');

card('N13-02',400,80,300,150,'N13-02 案例：副驾在停车场打视频',
 ['要点：游泳馆停车场，副驾想给朋友看泳池。',
  '讲解①：走 N13-01，主链照常（见 N14 计时）。',
  '讲解②：与后台视觉链路无关，不额外占主链耗时。'],GREEN,'【讲解例】');

card('N13-03',760,80,300,150,'N13-03 通话结果卡片 → N20 任务中心',
 ['要点：通话状态/未接提醒走卡片展示。',
  '讲解①：卡片在任务中心生命周期内（见 12 节 T 图）。',
  '讲解②：不播 TTS、不打断主驾导航。'],GREEN,'【待核】');

// 下层：后台独立链路
card('N13-04',40,290,560,160,'N13-04 后台逐帧"Special Token"链路（与用户打不打电话无关）',
 ['要点：云端视觉触发器 PRD 提到——持续视觉任务复用"豆包视频通话"的 Special Token，逐图预测。',
  '讲解①：Special Token = 逐帧推理时标识"这是一帧视频"的特殊标记，后台常驻。',
  '讲解②：开始=视觉持续任务下发；结束=任务取消或离车；上报=逐图结果给触发器规则判断。',
  '讲解③：车端算力大户，不占主链；端云分工、车型、耗时均未写。'],GREY,'【待核】');

card('N13-05',640,290,420,160,'N13-05 与 N2 Watcher 的边界',
 ['要点：Watcher 全时多模聆听（N2）是"永远在线"；',
  '本层逐帧链路是"按需下发的视觉持续任务"。',
  'Watcher 触发→可能唤起本链路；本链路不反向触发通话。'],GREY,'【待核】');

// 待核清单
card('N13-06',40,500,1020,120,'N13-06 待核清单（不许编造）',
 ['① 无独立"车载视频通话"PRD；drive 检索"豆包视频通话 车/车载 视频通话"无结果。',
  '② vehicle_communication 的输入输出、失败回执、端云分工未在工具明细中展开。',
  '③ "豆包视频通话"逐帧 Special Token 仅一句来源，需向视觉触发器 owner 要原文。',
  '④ 车型：上汽/赛力斯/路特斯均未提及；手车互联六项（N12）不含视频通话。'],GREY,'【待核】');

// 图例
card('N13-07',40,660,1020,90,'图例',
 ['蓝底=工具入口｜绿底=结果回流/案例｜灰底=待核或职责引用（灰虚线连线=跨模块引用）',
  '状态角标：【已落地-待核】工具存在但细节未展开；【待核】仅有间接来源；本篇不写成现网事实。'],GREY,'');

conn('N13-01','N13-02');
conn('N13-02','N13-03');
nodes.push({type:'connector',connector:{from:'N13-05',to:'N13-04',fromAnchor:'left',toAnchor:'right',
  lineShape:'rightAngle',lineColor:'#78716C',lineWidth:2,lineStyle:'dashed',endArrow:'arrow',label:'Watcher 可唤起'}});

const doc={version:2,nodes};
require('fs').writeFileSync('/Users/bytedance/Desktop/3.23/n13_14_17_rework/n13.json',JSON.stringify(doc));
console.log('nodes:',nodes.length);
