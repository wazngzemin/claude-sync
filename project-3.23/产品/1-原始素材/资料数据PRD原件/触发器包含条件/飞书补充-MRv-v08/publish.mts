import { loadEnvFile } from 'node:process';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createService } from '/Users/bytedance/Documents/Codex/2026-08-04/w/feishu-knowledge-assistant/src/server.ts';

loadEnvFile('.env');
const dir='/Users/bytedance/Desktop/3.23/产品/1-原始素材/资料数据PRD原件/触发器包含条件';
const out=dir+'/飞书补充-MRv-v08';
const api:any=createService().api;
const doc='EGw0dWj5kowzuIxlrLScBppsnWO';
const userId='ou_d35304ddd7e37a06ebac58f7f60b6522';
const opts={token:'user' as const,userId};
const fetchBody=JSON.parse(readFileSync(out+'/fetch.json','utf8'));
const backup=JSON.parse(readFileSync(out+'/补充前-完整备份.json','utf8'));
const source=readFileSync(out+'/分章精细补充-可粘贴.md','utf8');
const sections=source.split(/^## 补入第 /m).slice(1).map(s=>s.slice(s.indexOf('\n')+1).trim());
const receipt:any[]=[];
let revision:number;
const state=()=>writeFileSync(out+'/写入回执.json',JSON.stringify({doc,revision,receipt},null,2));
const esc=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const replacements:[string,string][]=[
 ['doxcn0oh2xSxpbtS0eAIDQJZ0Cb','豆包闪念（10/14 需求会）：使用已有 VLM 画面描述判断配置目标，命中后经 Frontier 下发普通通知卡，只有固定正文，无标题、无按钮、不播 TTS，不走主动推荐／DT。一期复用已有模型做判断，一项配置对应一句固定文案；二期再讨论模型生成动态正文。预配置描述监听仍需接入，不能把动态任务已收到描述当作这里已经接通；具体场景是否有可用描述须逐项确认，不能默认 PHUD 已提供睡眠、风景标签。'],
 ['doxcnAmL58Sa1VXWZlVUQfqVsyf','触发器（Trigger）是“条件监控＋命中提交”的规则引擎。本次改造的是云端管理后台的配置与运行查看：把接入的端状态、视觉描述和许可状态组织为判断规则，命中后交给既有下游。端状态是判断输入，不代表 Trigger 运行在车里。Trigger 不承担命中后的询问、VQA 工具调用和车辆执行。'],
 ['doxcniR860cMfcVgTLn8yCyHlPd','Trigger 命中后经 Frontier 发送固定正文，不走 DT。低优先级避让是产品要求；通知容器现状与排队规划分开验收，不能写成排队／过期均已具备。容器能否复用、等待与丢弃规则、展示反馈由客户端收口。'],
 ['doxcn7VBa0RvLiBOLUSbFjNfHTb','任务中心入口＋真实状态服务'],
 ['doxcnVbOS0pTM2ckFk4h3mGVuJe','任务中心提供用户操作入口，状态服务按车保存并供运行端查询。技术方案的状态值为 1 开启／2 关闭；仅查询成功且确实无记录时按默认开启，查询失败不能当开启。本章不重新指定端侧任务的持久化归属。'],
 ['doxcnf85VxnKMMYoT9sYE2g3ard','动作（Action）位于判断图外。整图最终 PASS 且共用策略与执行锁允许后，才交动作出口。本期新增主动推荐带交互卡和闪念普通通知：前者提交建议 Query，卡片正文与 TTS 由下游 DT 生成；后者仅提交固定正文，经 Frontier 下发、不进入 DT。recommend_with_card、flash_text 是本稿示例标识，正式协议以接口会签为准。带卡按钮默认确认／取消，可否自定义仍按第 8 章收口，不能依据原型演示控件扩展范围。'],
 ['doxcn2wQLuXFUALyl1JDkOdtQvd','Workflow 按依赖调度。技术设计中的并发上限 5 属于运行实现参数，不新增为业务随意可配项。AND：全 PASS 才运行；任一 REJECT 阻断；无 REJECT 而最终有 UNKNOWN 时按无法判断阻断。OR：有 PASS 可启动后继，不取消其他分支；全部结束仍无 PASS 时，UNKNOWN 优先于 REJECT。后继启动后仍须完成自己的判断。'],
 ['doxcnecPqZ2g4UIsizZsbv54l5f','整图最终 PASS 后才进入共用次数／最小间隔检查与场景执行锁，再形成动作执行记录并提交动作；具体锁与策略的接口顺序按技术实现核对。策略未过只拦截动作，不能改写判断结果，也不能把动作频控当作减少前置模型调用。'],
 ['doxcnNUzoA8WMlpsPTSLZfqm6Df','形态不同：只有固定正文，无标题、无按钮、不播 TTS。通知容器是否复用、文字长度、换行、展示时长及低优先级冲突处理需会签；排队属于规划中的能力，不把等待、过期和丢弃宣称为现成支持。'],
 ['doxcnXyNUj9Tspqf9BhM8sldi8b','文案不同：一期按一项条件配置一句固定正文，例如“让他安静睡一会儿吧。”；配置页提供正文输入和效果预览。判断条件已复用模型，二期扩展的是动态正文生成，不能把一期写成没有模型判断。'],
 ['doxcnuJhgI8v6Pr1PnDXOM8FHUh','频控只控制允许发送的次数和间隔，不减少此前已经发生的模型判断。正式数值、统计范围、失败是否计次由业务与运行方确认，原型中的 30 秒、1 分钟、5 分钟均不能直接当成闪念最终默认。10/14 一期先复用已有模型，不以建设语义初筛、小模型／BERT 作为上线前置；降耗另行评估。PHUD 图案联动不是本次普通通知已具备的效果。'],
 ['doxcnqRbq5fBdpJVtk5BVJ4Nupd','闪念与系统预设带卡任务分开：①读取已接入的 VLM 描述，预配置监听需要单独接通，不能拿动态任务结果通路替代；②命中后不进入 DT、不调用 VQA，由图外动作经 Frontier 发普通通知；③低优先级且不抢占语音及正在交互的内容，是本期需验证的产品要求，容器排队仍属规划；④一期固定正文，已有模型仅用于条件判断，动态文案生成不在本期。'],
 ['doxcnS5Hvj8OQC73cy0AosIYLsg','闪念：先收口预配置描述入口和真实覆盖场景、简单／Workflow 的一期接法、普通通知协议与客户端容器、低优先级冲突处理、长度与展示反馈、正式频控口径。已有模型判断与固定正文是一期方向；语义匹配、小模型降耗、动态正文生成另列后续，不混入本期必做。生产视觉范围找丁彬确认；通知接口与客户端事项分别找实际接口人，不由一位产品承担全部。'],
];

const images:{caption:string,file:string}[]=[];
const pic=(name:string,caption:string,folder='原型截图')=>{
 images.push({caption,file:dir+'/图文PRD-v08/'+folder+'/'+name+'.png'});
 return '\n\n'+caption+'\n\n';
};
const d1=pic('D1-VLM来源与使用边界','图 3-A｜视觉来源与职责边界：已有观察、动态专属结果和 DT 新视觉问答不混用。','架构与流程');
const d2=pic('D2-配置校验保存流程','图 3-B｜完整配置与保存流程：判断、动作、策略全部填写后统一校验；定义注册不等于场景关联成功。','架构与流程');
const d3=pic('D3-Workflow三态与汇合','图 4-A｜Workflow 三态与汇合：前驱放行不等于后继通过，最终动作等待整图终态。','架构与流程');
const d4=pic('D4-闪念一期运行链路','图 6-A｜闪念一期完整链路：描述接入、模型判断、策略放行、发送、接收和展示分别取证。','架构与流程');
const d5=pic('D5-视觉配置选择逻辑','图 4-B｜VLM 配置路径：先核实来源与字段，再选择结构化比较或已有描述推理。','架构与流程');
function numbered(s:string,first:string){return s.replace(/^### .+$/m,'### '+first);}
const chapter3=numbered(sections[2],'3.4 视觉来源与完整配置流程（细化）').replace('【插图 D1：VLM 来源与使用边界】',d1).replace('【插图 D2：配置、校验、保存流程】',d2);
const chapter4=numbered(sections[3],'4.8 VLM 字段、输入与异常规则').replace('【插图 D5：视觉配置选择逻辑】',d5).replace('### Workflow 搭建与汇合','### 4.9 Workflow 搭建与汇合规则').replace('【插图 D3：Workflow 三态与汇合】',d3);
const chapter6=sections[5].slice(sections[5].indexOf('### 闪念一期完整 Case')).replace('### 闪念一期完整 Case','### 6.1 闪念一期验收 Case').replace('【插图 D4：闪念一期运行链路】',d4);
const inserts:{anchor:string,content:string}[]=[
 {anchor:'doxcnX4xhXN3kpviPwDZecHJgYf',content:'### 1.4 改造后的业务价值与完成范围\n\n'+sections[0].split('\n\n').slice(1).join('\n\n')},
 {anchor:'doxcnVbOS0pTM2ckFk4h3mGVuJe',content:''},
 {anchor:'doxcnE32GCwPI65JZiqjwI7eyTc',content:''},
 {anchor:'doxcnOAboZEvG3ja3LOsZ5KFFne',content:''},
 {anchor:'doxcnqGGclE8IVcCNIL3dCai2Og',content:''},
];
// Insert at top-level anchors only; never insert inside existing table cells.
inserts.splice(1,4);
inserts.push(
 {anchor:'doxcn1DtX4pBfSe37W3OGQSCHbb',content:'### 2.2.1 配置人员必须分清的四件事\n\n简单／Workflow 只决定判断怎样组织，不决定是否用模型、是否走 DT。VLM 是视觉模型，Caption 是模型产出的画面文字；描述到达还不是业务判断成立。规则发布、AI 总许可、单车任务开关、本次确认是四种状态，拒绝一次不关闭长期任务。Action 位于判断图外；卡片交互、VQA 和车控由下游接入，不能因为页面能画节点就扩成全链路工具编排。'},
 {anchor:'doxcngBNdYCM4KlZPSNdV5eOoyf',content:chapter4},
 {anchor:'doxcnSmGOGu8NYwiVkU6msD3kre',content:''},
 {anchor:'doxcnEXmSrB1nrhVmftG5XKFzj9',content:chapter6},
 {anchor:'doxcnWOXntgnveN4d3zGcFn27Kg',content:numbered(sections[6],'7.1 分层验收与异常恢复')},
 {anchor:'doxcnzAkaAL8KjYU5NbdaPrAGph',content:numbered(sections[7],'8.1 对齐对象、问题与交付物')},
);
inserts.splice(inserts.findIndex(x=>x.content===''),1);
// Add the architecture refinement after the last existing runtime explanation.
const xml=backup.document.content;
const part=xml.slice(xml.indexOf('<h3 id="doxcn8Q'),xml.indexOf('<h2 id="doxcnCr'));
const runtimeIds=[...part.matchAll(/<li id="([^"]+)"/g)].map(m=>m[1]);
inserts.push({anchor:runtimeIds.at(-1)!,content:chapter3});
inserts.push({anchor:'doxcnwNw3KRwbA2GS67yNhXd1Ah',content:
 '#### P2 补图：基础范围与简单判断\n\n以下为 v08 区域示意，解释字段填写与规则，不替代当前 v10 页面。各图与下列说明配对；图中演示值不是正式默认。'+
 pic('S02-基础定义与适用范围','图 P2-A｜基础定义：配置模式、分类与来源分开；来源只读，不由创建方式推导分类。')+
 '先定义任务给谁用、采用哪种判断，再填写条件。已保存 Workflow 不在此切换成简单模式，复制生成新的定义。'+
 pic('S02b-渠道车型版本环境与泳道','图 P2-B｜适用范围：渠道、车型、版本、环境与泳道按已支持能力校验。')+
 '列表筛选不替代实际发布范围；父级变化后清理不兼容子项。查询失败不显示为全部车辆；不支持的渠道与空泳道须有明确提示。'+
 pic('S03-简单条件字段级联','图 P2-C｜简单条件：信号、位置、字段、比较符和值依次选择。')+
 '选择项由渠道能力目录生成，不允许输入不存在的编码绕过校验；切换信号后清除旧字段和值，保留其他兼容人工内容。'+
 pic('S04-简单视觉目标与VLM入口','图 P2-D｜简单视觉目标：单个已有描述目标可以用简单模式，不强制搭 Workflow。')+
 '视觉输入与 goal 必须同时存在；没有可用来源时提示接入缺口，不能用样例描述冒充线上输入。'},
 {anchor:'doxcnoTpFKNbzKaE2Bkb13mtBqf',content:
 '#### P3 补图：条件属性、推理与汇合\n\n以下为 v08 区域示意，不替代上方 v10 儿童锁主图。'+
 pic('S06c-结构化VLM位置与年龄字段','图 P3-A｜同一乘客关联：位置与年龄共同指向一个对象。')+
 '旧图 Position 多选仅为原型差异提示：若正式目录仅开放等于，应按合法等于组合表达；服务不能保持同对象关联时阻止正式发布，不把旧图 in 直接当支持。'+
 pic('S06d-同一对象的AgeRange枚举','图 P3-B｜年龄类别：从目录枚举选值，不把类别当数字年龄阈值。')+
 '后排成人的位置不能和主驾儿童的年龄拼成“后排儿童”；年龄值及比较符只开放目录支持项。'+
 pic('S07a-推理节点输入来源与目标','图 P3-C｜推理输入：先选本次可用描述，再填要判断的业务目标。')+
 pic('S07b-推理节点目标与UNKNOWN边界','图 P3-D｜推理边界：goal 说明判断什么，original_query 补充场景限制。')+
 '输入缺失、过时、位置无法确定、超时或解析失败归 UNKNOWN，不当作没有目标。推理节点不新拍画面、不调 VQA、不写通知正文。'+
 pic('S08-前驱OR与节点内部AND','图 P3-E｜两层关系：前驱 OR 决定是否开始，本节点内部 AND 决定自身是否满足。')+
 '儿童或宠物任一 PASS 只能放行后继；仍需检查目标锁状态。两支无 PASS 且有 UNKNOWN 时不能建议开锁。'},
 {anchor:'doxcnDK1XRugnJt93YTmWnEx0uh',content:
 '#### 动作与记录区域补图\n\n以下为 v08 规则说明图，不代表 v10 或线上已经完成真实联调。'+
 pic('S09-闪念固定正文与普通通知','图 4-C｜闪念动作：固定正文与普通通知，不配置标题、按钮、TTS。')+
 '固定文字不等于不使用模型判断。字数、换行与高度以普通通知协议收口，不以本图示例视为签字规范。'+
 pic('S09b-共用执行策略','图 4-D｜共用执行策略：总次数、上电周期、自然日与最小间隔。')+
 '各策略填写统计范围及计次时点；本图示例数值不是闪念正式参数。终点 PASS 后被策略拦截，判断仍显示 PASS，动作显示拦截原因。'},
 {anchor:'doxcnCEvBMYczMOH2Wkz3AFtQIg',content:
 '#### P6 补图：发送与展示分开，历史按当时快照查看\n\n以下为 v08 区域示意，试跑为人工模拟，不证明真实模型、Frontier 或客户端执行成功。'+
 pic('S12c-普通通知发送接收展示分层','图 P6-A｜普通通知分层结果：发送、接收、展示分别确认。')+
 '没有下游回执时显示“未取得反馈”，不默认展示成功。人工指定 PASS 只检查页面和结果传播，不能代替端云联调。'+
 pic('S13b-历史结果分层与操作时间线','图 P6-B｜历史结果：保存当次输入、定义、策略与动作阶段。')+
 '后续修改不能覆盖旧记录；未运行节点标记阻断原因，不伪造输入或耗时。简单模式没有真实 run_id 时不补造。'},
);

// Clarify legacy downstream notes rather than delete the user's existing material.
inserts.push({anchor:'doxcnC46PgNMZFHPBAoKIxiZ6Ub',content:'### 8.2 下游接入说明的适用边界\n\n下列原有说明用于业务接入沟通，不代表本期后台新增这些配置项。本期判断画布只开放条件与推理节点，识别工具、卡片正文／TTS、等待用户、确认后车控及回读属于下游；充电设备 VQA 不返回 Trigger 接着画。标题、按钮、TTS 不适用于闪念普通通知。带卡按钮可否自定义仍按本章评审结果会签，未会签不承诺。'});

writeFileSync(out+'/待写入计划.json',JSON.stringify({replacements,inserts,images},null,2));

async function mutate(body:any){
 const r:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}`,{...opts,method:'PUT',body:{...body,revision_id:revision}});
 if(r.result!=='success')throw new Error('Write not confirmed: '+JSON.stringify(r));
 revision=r.document.revision_id;return r;
}
async function main(){
 const fresh:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});
 if(fresh.document.content!==backup.document.content)throw new Error('Document changed: reconcile before writing');
 revision=fresh.document.revision_id;
 for(const [id,text] of replacements){
  if(!xml.includes('id="'+id+'"'))throw new Error('Missing target '+id);
  await mutate({command:'block_replace',block_id:id,format:'xml',content:'<p>'+esc(text)+'</p>'});
  receipt.push({kind:'replace',id,revision});state();console.log(JSON.stringify(receipt.at(-1)));
 }
 for(const item of inserts){
  await mutate({command:'block_insert_after',block_id:item.anchor,format:'markdown',content:item.content});
  receipt.push({kind:'insert',anchor:item.anchor,revision,chars:item.content.length});state();console.log(JSON.stringify(receipt.at(-1)));
 }
 const textFinal:any=await api.requestJson(`/open-apis/docs_ai/v1/documents/${doc}/fetch`,{...opts,body:fetchBody});
 writeFileSync(out+'/文字写入后备份.json',JSON.stringify(textFinal,null,2));
 console.log(JSON.stringify({textComplete:true,images:images.length,revision}));
}
main().catch(e=>{state();console.error(String(e));process.exitCode=1;});
