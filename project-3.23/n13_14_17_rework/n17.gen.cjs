// N17 三方智能体 主图 1400x900
const nodes=[];
const BLUE={fill:'#DBEAFE',border:'#2563eb'};
const GOLD={fill:'#FEF3C7',border:'#D97706'};
const GREEN={fill:'#D1FAE5',border:'#059669'};
const GREY={fill:'#F5F5F4',border:'#78716C'};
const RED={fill:'#FEE2E2',border:'#DC2626'};

function card(id,x,y,w,h,title,lines,style,status){
  const runs=[{content:title+'\n',bold:true,fontSize:13,color:'#111827'}];
  lines.forEach(l=>runs.push({content:l+'\n',fontSize:11,color:'#374151'}));
  if(status) runs.push({content:status,fontSize:10,color:'#6B7280'});
  nodes.push({type:'rect',id,x,y,width:w,height:h,
    fillColor:style.fill,borderColor:style.border,borderWidth:2,borderRadius:8,
    text:runs,textAlign:'left',verticalAlign:'top'});
}
function chip(x,y,w,text,style){
  nodes.push({type:'rect',x,y,width:w,height:34,fillColor:style.fill,borderColor:style.border,
    borderWidth:1,borderRadius:6,text:text,fontSize:10,textColor:'#374151',textAlign:'center'});
}
function label(x,y,w,text,size,color){
  nodes.push({type:'text',x,y,width:w,height:'fit-content',text,fontSize:size||12,textColor:color||'#111827'});
}
function conn(from,to,color,dash,label){
  nodes.push({type:'connector',connector:{from,to,fromAnchor:'bottom',toAnchor:'top',
    lineShape:'rightAngle',lineColor:color||'#2563eb',lineWidth:2,lineStyle:dash?'dashed':'solid',
    endArrow:'arrow',label:label||''}});
}

label(40,16,1200,'N17 三方智能体/A2A/AgentCard：W1 12 子 Agent 怎样塌缩成今天的 40 个工具',16,'#111827');

// 顶层：愿景
card('N17-01',40,70,600,90,'N17-01 W1 愿景：12 个能力向子 Agent',
 ['表头：智能体类型/目标/感知&注意/记忆/行动表达；原表仅"座舱舒适"一行空内容。',
  '今天：全部塌缩为 v15 工具条目不（见底部 12 域映射）。'],GREY,'【长期愿景】');

card('N17-02',680,70,400,90,'N17-02 今天的现实：Director + 40 工具',
 ['一条请求一条链；长期记忆/持续感知由 Context+Trigger 补。',
  '排障简单，能力以工具粒度交付。'],BLUE,'【已落地】');

// Agent Server 三面
card('N17-03',40,190,340,140,'N17-03 管理面',
 ['Agent 定义；租户隔离 channel+channel_app_id',
 '（上汽 DNA=99220）；版本环境；',
 '动态工具对 Director 可见性。'],BLUE,'【已落地】');
card('N17-04',420,190,340,140,'N17-04 控制面',
 ['工具发现与准入；DirectAgent 直调；',
 'Redirect 最多两次；Interrupt/Fallback；',
 'Context 取消向下游传导。'],BLUE,'【已落地】');
card('N17-05',800,190,340,140,'N17-05 数据面',
 ['协议：aidv/dpfm/doubao/ecology/internal_rpc',
 '通道：HTTP/SSE/Kitex/MCP/Frontier',
 '这就是今天的"A2A"真实形态。'],BLUE,'【已落地】');

// GUI Agent + 三方候选
card('N17-06',40,370,500,150,'N17-06 GUI Agent（2.6 仅存的子 Agent 形态）',
 ['要点：seed 1.8+ 自研，对齐 AutoGLM，独立闭环不耦合系统。',
  '讲解①：命令三类——常规（点击/输入/滑动）、CLARIFY（输入不清需澄清）、APPROVE（发送需授权）。',
  '讲解②：反思回退——误生成长按，反思发现不符，退回上层改短按发图+文。'],GOLD,'【2.6目标】');

card('N17-07',580,370,500,150,'N17-07 长时任务例子（官方 one page）',
 ['要点：点外卖——搜川菜→选品→"点结算一键支付不用输密码"；交停车费——自动匹配车牌→查费用→开发票。',
  '讲解①：是辅助指引非全自动下单，关键支付等 APPROVE 确认。',
  '讲解②：贯穿案例落点——"订个评分 4.5 以上的餐厅"走本地生活域，无独立餐厅 Agent。'],GOLD,'【2.6目标】');

// AgentCard + 三方候选
card('N17-08',40,560,560,140,'N17-08 AgentCard 名片 9 字段（W1 原表）',
 ['name/description/url 必填；provider 选填；version 必填；',
 'capabilities（流式/push/预警）；defaultInputModes / defaultOutputModes；',
 'skills（≥1 个，含说明/输入/输出）。今天管理面有类似 Agent 定义。'],GREY,'【长期愿景】');

card('N17-09',640,560,440,140,'N17-09 三方候选 & 手车互联',
 ['三方候选：具身 Agent / AI Navi（仅占位）【待核】。',
 '手车互联六项（已落地）：远程控车/远程车况/用车知识/',
 'POI 同步/深度研究与播客内容同步（不支持视频）/对话历史。'],GREEN,'【已落地+待核】');

// 12 域映射 chips
label(40,730,300,'12 能力域 → 工具（chips）：',12,'#111827');
const domains=['导航/route','媒体/music','车控/vehicle','天气/weather','本地生活/local','联网/web',
 '记忆/memory','视觉/visual','任务/task_agent','生图/image','播客/broadcast','通讯/vehicle_comm'];
domains.forEach((d,i)=>{chip(40+i*100,755,96,d,BLUE);});

// 图例
card('N17-10',40,815,1200,70,'图例',
 ['蓝=已落地处理｜金=规划中/2.6 目标｜绿=回流/已落地出口｜灰=长期愿景/待核｜灰虚线=职责引用；冲突/待核见角标。',
  '交接：本章每个工具名在"21 工具明细"章有逐条输入输出与弃用状态。'],GREY,'');

conn('N17-01','N17-02','#78716C',true,'愿景→现实');
conn('N17-02','N17-03','#2563eb',false,'Agent Server');
nodes.push({type:'connector',connector:{from:'N17-03',to:'N17-04',fromAnchor:'right',toAnchor:'left',lineShape:'straight',lineColor:'#2563eb',lineWidth:2,endArrow:'arrow'}});
nodes.push({type:'connector',connector:{from:'N17-04',to:'N17-05',fromAnchor:'right',toAnchor:'left',lineShape:'straight',lineColor:'#2563eb',lineWidth:2,endArrow:'arrow'}});
conn('N17-05','N17-06');
conn('N17-06','N17-07');
conn('N17-09','N17-08','#78716C',true);

const doc={version:2,nodes};
require('fs').writeFileSync('/Users/bytedance/Desktop/3.23/n13_14_17_rework/n17.json',JSON.stringify(doc));
console.log('nodes:',nodes.length);
