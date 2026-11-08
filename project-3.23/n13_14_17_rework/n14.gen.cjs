// N14 分段耗时主链 高密度主图 1400x900
const nodes = [];

const BLUE={fill:'#DBEAFE',border:'#2563eb'};
const GOLD={fill:'#FEF3C7',border:'#D97706'};
const GREEN={fill:'#D1FAE5',border:'#059669'};
const RED={fill:'#FEE2E2',border:'#DC2626'};
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
function conn(from,to,lineColor,label,style){
  nodes.push({type:'connector',connector:{from,to,fromAnchor:'right',toAnchor:'left',
    lineShape:'rightAngle',lineColor:lineColor||'#2563eb',lineWidth:2,lineStyle:style||'solid',
    startArrow:'none',endArrow:'arrow',label:label||''}});
}

// 标题
label(40,16,900,'N14 主链分段耗时：目标值与实测值并列（0615 alex 实车 AVG 口径 / 上汽 P90 口径）',16,'#111827');

// 主链卡片横排（9 段），y=90, h=120, w=130, gap=8
const chain=[
 ['N14-01','VAD 端点检测','等用户说完\nAVG 500ms','拒识前置'],
 ['N14-02','ASR 语音转文字','上行后识别\nAVG 300ms',''],
 ['N14-03','上行传输','端→云端\nAVG 100ms',''],
 ['N14-04','前置拒识','快路径截断\nAVG 210ms','★判断关卡'],
 ['N14-05','Context 注入','车况/记忆/情景\nAVG 250ms',''],
 ['N14-06','Planner 首字','Seed 1.8 推理\nAVG 900ms','★最大头'],
 ['N14-07','TTS 首帧','文字转语音\nAVG 450ms',''],
 ['N14-08','TTS 空帧','整句合成\nAVG 200ms',''],
];
const y0=100,w=138,gap=14;
chain.forEach((c,i)=>{
  const x=40+i*(w+gap);
  const st=c[4]&&c[4].includes('★')?GOLD:BLUE;
  card(c[0],x,y0,w,112,c[1],[c[2],c[3]].filter(Boolean),st,'AVG合计约3310ms'&&undefined);
});
// 链上连线
for(let i=0;i<chain.length-1;i++) conn(chain[i][0],chain[i+1][0]);

// 车控执行（链尾分支，红框=冲突）
card('N14-09',40,y0+160,w*2+gap,96,'N14-09 车控执行（资料冲突，全部并列）',
 ['FT目标 P90 ≤100ms（W3a 车端协议）',
  'W2/w3b 实测 P90 1500ms / P50 3000ms',
  '冲突出处：车控协议文档 vs 上汽实车日志'],RED,'【资料冲突】');
// 端到端冲突红框
card('N14-10',40+(w*2+gap)+gap,y0+160,w*2+gap,96,'N14-10 端到端总耗时（资料冲突）',
 ['FT目标：闲聊 P90 ≤1s',
  '0525-0528 上汽实测 P90 7400ms',
  '0615 alex 云端全流程：AVG 2550ms / 合计 3310ms'],RED,'【资料冲突】');

// Planner 思考冲突（金框=判断节点口径冲突）
card('N14-11',40+(w*4+gap*3),y0+160,w*2+gap,96,'N14-11 Planner 思考 P50 口径不一',
 ['W2：P50 230ms',
  'w3b：P50 80ms',
  '两处出处并列，排障以 80ms 为快路径参考'],GOLD,'【口径不一】');

// 绿框：目标值
card('N14-12',40+(w*7+gap*6),y0+160,w,96,'N14-12 体验目标',
 ['闲聊首响 ≤1s',
  '导航/车控 ≤1.5s',
  '2.6 目标值'],GREEN,'【2.6目标】');

// 贯穿案例
card('N14-13',40,y0+300,1300,64,'贯穿案例：主驾说"带我去昨天那家游泳馆" → 听见"好的，这就导航"',
 ['AVG 路径合计约 2.8s；P90（上汽实车）约 7.4s。数字背后分工：ASR/TTS 火山引擎、Planner Seed 1.8 云端、车控执行在端侧（见 N15）。',
  '排障顺序：先看 VAD 是否等够 → ASR 置信度 → 拒识是否误杀 → Context 缺不缺记忆 → Planner 首字是否超时'],BLUE,'');

// 图例
card('N14-14',40,y0+390,1300,80,'图例',
 ['蓝底=普通处理段｜金底=判断关卡/口径冲突｜绿底=体验目标｜红底=资料冲突（卡片内列出处）｜灰虚线=职责引用',
  '状态标注：各段 AVG 为 0615 alex 云端实测；P90 为 0525-0528 上汽实测；目标值为 FT 文档口径。车型差异：赛力斯/路特斯数据未在本次资料中出现。'],GREY,'');

const doc={version:2,nodes};
require('fs').writeFileSync('/Users/bytedance/Desktop/3.23/n13_14_17_rework/n14.json',JSON.stringify(doc));
console.log('nodes:',nodes.length);
