#!/usr/bin/env node

import { writeFileSync } from 'node:fs';

const OUT = '/Users/bytedance/Desktop/3.23/whiteboard/豆包汽车-语音到执行闭环-全中文可编辑-v08/diagram-v08-vertical.svg';
const W = 3000;
const H = 14000;
const C = {
  canvas: '#ECECEC',
  ceramic: '#F4F2EE',
  cobalt: '#185DB7',
  deep: '#0D4FA8',
  sage: '#8E9179',
  white: '#FFFFFF',
};

const bg = [];
const edgeLayer = [];
const nodeLayer = [];
const labelLayer = [];
const boxes = new Map();
let shapeCount = 0;
let textCount = 0;
let connectorCount = 0;

const esc = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

function rect(layer, x, y, w, h, { fill = C.ceramic, stroke = C.deep, sw = 2, rx = 8, dash = '' } = {}) {
  shapeCount += 1;
  layer.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
}

function line(layer, x1, y1, x2, y2, { stroke = C.deep, sw = 2, dash = '', marker = '' } = {}) {
  connectorCount += 1;
  layer.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${marker ? ` marker-end="url(#${marker})"` : ''}/>`);
}

function text(layer, x, y, lines, { size = 16, lineH = 22, fill = C.deep, weight = 400, anchor = 'start' } = {}) {
  textCount += 1;
  const arr = Array.isArray(lines) ? lines : [lines];
  layer.push(`<text x="${x}" y="${y}" fill="${fill}" font-size="${size}px" font-weight="${weight}" text-anchor="${anchor}">${arr.map((t, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lineH}">${esc(t)}</tspan>`).join('')}</text>`);
}

function card(id, x, y, w, h, title, lines = [], opts = {}) {
  if (boxes.has(id)) throw new Error(`duplicate id ${id}`);
  boxes.set(id, { x, y, w, h });
  const fill = opts.main ? C.cobalt : (opts.fill || C.ceramic);
  const stroke = opts.main ? C.cobalt : (opts.stroke || C.deep);
  rect(nodeLayer, x, y, w, h, { fill, stroke, sw: opts.sw || 2, rx: opts.rx ?? 8, dash: opts.dash || '' });
  const titleFill = opts.main ? C.ceramic : C.deep;
  text(nodeLayer, x + 18, y + 30, title, { size: opts.titleSize || 18, weight: 700, fill: titleFill });
  if (lines.length) text(nodeLayer, x + 18, y + 58, lines, { size: opts.bodySize || 16, lineH: opts.lineH || 22, fill: titleFill });
  if (opts.tag) {
    const tw = Math.max(92, opts.tag.length * 18 + 28);
    rect(nodeLayer, x + w - tw - 12, y + 10, tw, 28, { fill: opts.main ? C.ceramic : C.white, stroke: opts.main ? C.ceramic : C.sage, sw: 1.5, rx: 14 });
    text(nodeLayer, x + w - tw / 2 - 12, y + 30, opts.tag, { size: 16, weight: 700, fill: opts.main ? C.cobalt : C.deep, anchor: 'middle' });
  }
  return boxes.get(id);
}

function stage(y, n, titleText, subtitle) {
  line(bg, 40, y, 2960, y, { stroke: C.sage, sw: 2 });
  rect(nodeLayer, 44, y + 18, 58, 44, { fill: C.cobalt, stroke: C.cobalt, sw: 1, rx: 22 });
  text(nodeLayer, 73, y + 47, String(n).padStart(2, '0'), { size: 18, weight: 700, fill: C.ceramic, anchor: 'middle' });
  text(nodeLayer, 120, y + 47, titleText, { size: 24, weight: 700 });
  text(nodeLayer, 120, y + 74, subtitle, { size: 16, fill: C.deep });
}

function port(id, side) {
  const b = boxes.get(id);
  if (!b) throw new Error(`missing box ${id}`);
  if (side === 't') return [b.x + b.w / 2, b.y];
  if (side === 'b') return [b.x + b.w / 2, b.y + b.h];
  if (side === 'l') return [b.x, b.y + b.h / 2];
  return [b.x + b.w, b.y + b.h / 2];
}

function poly(points, { stroke = C.cobalt, sw = 3, dash = '', marker = 'arrow-blue', label = '', lx = null, ly = null } = {}) {
  connectorCount += 1;
  edgeLayer.push(`<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${marker ? ` marker-end="url(#${marker})"` : ''}/>`);
  if (label && lx != null && ly != null) {
    const lw = Math.max(90, label.length * 17 + 28);
    rect(labelLayer, lx - lw / 2, ly - 21, lw, 30, { fill: C.ceramic, stroke: C.sage, sw: 1, rx: 6 });
    text(labelLayer, lx, ly, label, { size: 16, weight: 700, anchor: 'middle' });
  }
}

function connect(from, to, { fromSide = 'b', toSide = 't', stroke = C.cobalt, sw = 3, dash = '', marker = 'arrow-blue', label = '', via = [] } = {}) {
  const a = port(from, fromSide);
  const b = port(to, toSide);
  let pts = [a];
  if (via.length) pts.push(...via);
  else if (a[0] === b[0] || a[1] === b[1]) pts.push(b);
  else pts.push([a[0], (a[1] + b[1]) / 2], [b[0], (a[1] + b[1]) / 2], b);
  const mid = pts[Math.floor(pts.length / 2)];
  poly(pts, { stroke, sw, dash, marker, label, lx: mid[0], ly: mid[1] - 8 });
}

// Canvas and six responsibility lanes.
rect(bg, 0, 0, W, H, { fill: C.canvas, stroke: C.canvas, sw: 0, rx: 0 });
const lanes = [
  [40, 440, '车端感知与用户'],
  [500, 440, '接入、路由与仲裁'],
  [960, 520, '上下文与 AI 决策'],
  [1500, 440, '确定性编排与任务'],
  [1960, 520, '工具、车端与生态执行'],
  [2500, 460, '反馈、呈现与产品验收'],
];
lanes.forEach(([x, w], i) => rect(bg, x, 400, w, 13530, { fill: i % 2 ? C.canvas : C.ceramic, stroke: C.sage, sw: 1, rx: 0 }));

card('TITLE', 40, 30, 2920, 130, '豆包汽车｜语音用户请求到真实结果｜完整业务架构', [
  '一条纵向主轴贯穿输入、分流、上下文、规划、执行、反馈与结果；支路必须回到主轴。',
], { main: true, titleSize: 32, bodySize: 18, lineH: 25 });
card('LEGEND', 40, 180, 2920, 100, '读图口径', [
  '粗实线＝本轮主链　细实线＝事实/结果　虚线＝异常或建设中　绿色回路＝tool_feedback 触发下一轮',
  '完成＝用户目标满足＋真实状态证据＋无必要待办；模型说完成、接口成功或语音播完都不等于完成。',
], { titleSize: 20, bodySize: 16, lineH: 22 });
lanes.forEach(([x, w, name], i) => card(`LANE${i + 1}`, x, 310, w, 72, `${i + 1}｜${name}`, [], { main: i === 2 || i === 3, titleSize: 18 }));
line(bg, 1490, 420, 1490, 13220, { stroke: C.cobalt, sw: 4 });

// 01 Voice input.
stage(420, 1, '语音进入系统', '把声音变成带身份、座位、时间和追踪编号的可治理请求。');
card('U1', 1040, 520, 920, 82, '用户发声', ['原始声音＋说话人候选＋座位/声区'], { main: true });
card('U2', 1040, 622, 920, 82, '麦克风与唤醒门【待验真】', ['权限、唤醒/免唤醒、会话是否已打开']);
card('U3', 1040, 724, 920, 82, '声学前处理', ['回声消除、降噪、波束定位、多人声分离']);
card('U4', 1040, 826, 920, 82, '人声起止与打断', ['起点、终点、插话、尾噪；是否停止当前播报']);
card('U5', 1040, 928, 920, 82, '语音识别', ['增量文本→最终文本；否定词、数字、时间、地点保真']);
card('U6', 1040, 1030, 920, 104, '当前用户请求｜user_query', ['query、speaker_name、speaker_position、timestamp', '建议补 request_id、trace_id、turn_id、识别来源与置信度'], { main: true });
['U1','U2','U3','U4','U5'].forEach((id, i, arr) => connect(id, arr[i + 1] || 'U6'));
card('UERR', 60, 560, 840, 236, '输入异常', [
  '无权限/未唤醒/回声/早截断/尾噪',
  '否定词、数字、时间、地点识别错',
  '多人同时说、说话人与座位冲突',
  '处理：重听、澄清、拒绝或降级，不得猜测执行',
], { dash: '10 7', stroke: C.sage });
card('VUI', 2100, 560, 840, 236, '语音用户界面状态', [
  '待机→唤醒→聆听→识别→理解→准备回复',
  '→语音合成排队→播报→下一轮/待机',
  '用户打断：停当前播报，保留任务状态，新请求回输入治理',
  '停止播报不等于取消车辆或生态动作',
]);
card('VOICE_METRIC', 2100, 830, 840, 180, '输入阶段验收', [
  '误/漏唤醒、语义字错、端点早截/尾噪',
  '说话人/座位准确、否定/数字/时间/地点保真、输入时延',
  '原音频→增量文本→最终文本→采纳请求可回放',
], { stroke: C.sage });
connect('U2','UERR',{fromSide:'l',toSide:'r',stroke:C.sage,dash:'10 7',marker:'arrow-sage'});
connect('U4','VUI',{fromSide:'r',toSide:'l',stroke:C.sage,dash:'10 7',marker:'arrow-sage'});

// 02 Routing.
stage(1190, 2, '接入、端云分工与真实路由', '登录优先；端侧小模型与句法快路处理明确低风险请求；云端仲裁决定是否进入 Planner。');
card('R0', 1040, 1290, 920, 82, '车企协议 → 统一对话请求', ['标准化用户请求、车辆/会话/渠道信息'], { main: true });
card('R1', 1040, 1392, 920, 82, '登录与身份校验', ['失败：只给认证提示，不读取私有上下文']);
card('R2', 1040, 1494, 920, 82, '指定专用模块？｜Direct Agent', ['是：按已注册能力直接路由；仍经过安全、幂等和反馈契约']);
card('R3', 1040, 1596, 920, 82, '句法 RAG 是否命中明确快路？', ['高置信、明确、低风险；命中后走工具快路']);
card('R4', 1040, 1698, 920, 104, '准备阶段并行预取', ['Context/历史/目标/知识/工具能力＋Planner 预启动', '同时运行意图与拒识判断，减少等待但不提前执行']);
card('R5', 1040, 1822, 920, 104, '端侧轻量模型＋云端 FC/仲裁', ['端侧模型做轻量分类/拒识/本地能力选择；云 FC 汇总候选', '推荐结果只进入最终仲裁，不直接变成工具调用']);
card('R6', 1040, 1946, 920, 112, '最终仲裁', ['拒识｜简单意图｜强制 Planner｜默认复杂', '一轮只能采纳一个最终执行路径'], { main: true });
['U6','R0','R1','R2','R3','R4','R5'].forEach((id, i, arr) => connect(id, arr[i + 1] || 'R6'));
card('RAUTH', 2500, 1392, 440, 120, '登录失败', ['认证提示并结束', '不得继续私有读取'], { dash:'10 7',stroke:C.sage });
card('RFAST', 2020, 1510, 440, 160, '专用/句法快路', ['直接能力或低风险工具', '仍需执行门禁与真实回读', '不得绕过完成判定'], { tag:'快路' });
card('RREJECT', 2500, 1946, 440, 150, '拒识/忽略', ['给出原因或追问', '记录误拒识，不执行'], { dash:'10 7',stroke:C.sage });
card('RCLOUD', 1040, 2080, 920, 104, '复杂请求进入 Context → 同一 Planner', ['Planner 负责目标理解、多步计划与根据新反馈再决策'], { main: true });
card('RUNIQUE', 2020, 2110, 920, 166, '端云唯一裁决与迟到保护', [
  '同一 request/turn 只采纳一个执行结果；快路命中即关闭云候选',
  '迟到的 Planner/云 FC 结果必须丢弃，禁止覆盖端侧已执行状态',
  '监控双执行、重复副作用、迟到覆盖和错误降级',
], { stroke:C.sage });
connect('R1','RAUTH',{fromSide:'r',toSide:'l',stroke:C.sage,dash:'10 7',marker:'arrow-sage',label:'失败'});
connect('R2','RFAST',{fromSide:'r',toSide:'l',label:'是'});
connect('R3','RFAST',{fromSide:'r',toSide:'l',label:'命中'});
connect('R6','RREJECT',{fromSide:'r',toSide:'l',stroke:C.sage,dash:'10 7',marker:'arrow-sage',label:'拒识'});
connect('R6','RCLOUD',{label:'复杂'});
connect('RFAST','RUNIQUE',{fromSide:'b',toSide:'t'});
connect('R6','RUNIQUE',{fromSide:'r',toSide:'l'});
const roles = [
  ['ROLE1',60,'端侧小模型','低时延轻量识别、拒识与本地能力选择','不承担复杂多步规划'],
  ['ROLE2',760,'句法 RAG','明确指令规则匹配与参数抽取','只覆盖白名单、低风险场景'],
  ['ROLE3',1460,'云端 FC / 仲裁','聚合候选、简单/复杂分流与最终路径选择','推荐不等于执行'],
  ['ROLE4',2160,'Planner / Director','完整目标、多步依赖、工具选择、再规划','不是快路与任务状态机'],
];
roles.forEach(([id,x,t,l1,l2])=>card(id,x,2390,650,176,t,[l1,l2],{stroke:C.sage}));
connect('RCLOUD','ROLE4',{fromSide:'b',toSide:'t'});

// 03 Context.
stage(2740, 3, '形成一次决策所需的事实快照', '四类输入、十二类事实和四类记忆先经过隔离、新鲜度、相关性、冲突与预算治理。');
card('I0', 1040, 2840, 920, 90, '本轮输入治理', ['请求、建议、反馈、事件按优先级/打断/合并/排队/过期处理'], { main:true });
connect('RCLOUD','I0');
const inputs = [
  ['I1',60,'用户请求｜user_query','用户原话＋人物/座位/时间'],
  ['I2',760,'顾问建议｜advisor','建议不是用户命令'],
  ['I3',1460,'工具反馈｜tool_feedback','到达即开启新一轮判断'],
  ['I4',2160,'系统事件｜event','事件描述＋时间；建议补来源/置信'],
];
inputs.forEach(([id,x,t,l])=>card(id,x,2970,650,116,t,[l]));
inputs.forEach(([id])=>connect(id,'I0',{fromSide:'t',toSide:'b',stroke:C.sage,sw:2,marker:'arrow-sage'}));
rect(nodeLayer, 50, 3120, 2900, 570, { fill:C.ceramic, stroke:C.cobalt, sw:2, rx:8 });
text(nodeLayer, 70, 3150, '事实池｜十二类事实来源＋四类记忆', { size:20, weight:700 });
const facts = [
  '①当前输入','②近期对话','③端侧状态','④视觉情境',
  '⑤事件日志','⑥身份关系','⑦目标/任务','⑧联网新事实',
  '⑨参考知识','⑩可用工具','⑪助手自我认知','⑫时间位置设备',
];
facts.forEach((t,i)=>{
  const col=i%4,row=Math.floor(i/4);
  card(`F${i+1}`,80+col*710,3180+row*115,650,92,t,[
    ['请求/建议/反馈/事件','原话/回复/动作/反馈','车/导航/媒体/应用','场景/主题/置信/时间',
     '传感/手动/拒识/触发','账号/人脸/座位/隐私','状态/进度/等待条件','天气/网页/地点/路况',
     '车书/技巧/车型/规则','参数/能力/版本/取消','角色/风格/价值边界','日期/位置/车型/网络'][i]
  ],{bodySize:16,titleSize:17});
});
const memories=['瞬时记忆｜本轮声音/视觉','短期记忆｜当前会话/临时对象','长期情景｜地点/同行人/经历','长期语义｜偏好/习惯/关系'];
memories.forEach((t,i)=>card(`M${i+1}`,80+i*710,3535,650,112,t,['按用户/车/会话隔离；空结果禁止猜测'],{stroke:C.sage,titleSize:17}));
poly([[1500,2930],[1500,3120]],{stroke:C.cobalt,sw:3,marker:'arrow-blue',label:'进入事实池',lx:1580,ly:3040});
const governance = [
  ['G1','来源与身份隔离'],['G2','新鲜度/有效期'],['G3','相关性筛选'],
  ['G4','冲突裁决'],['G5','事实/建议/结果分型'],['G6','摘要与预算'],
];
governance.forEach(([id,t],i)=>card(id,50+i*490,3730,460,116,`${i+1}｜${t}`,[
  ['归属用户/车辆/任务','时间、TTL、是否陈旧','仅保留目标所需事实','最新端态优先；未知不猜','假设不能等同事实','关键事实不丢'][i]
],{titleSize:17}));
governance.slice(0,-1).forEach(([id],i)=>connect(id,governance[i+1][0],{fromSide:'r',toSide:'l',sw:2}));
poly([[1500,3690],[1500,3710],[280,3710],[280,3730]],{stroke:C.cobalt,sw:3,marker:'arrow-blue'});
const dyn = [
  ['D1',260,'动态知识检索','请求＋Context＋车型/环境'],
  ['D2',900,'知识/示例选择','专业知识、车型规则、正反例'],
  ['D3',1540,'版本质量门','车企×环境、得分、过期、冲突'],
  ['D4',2180,'注入动态区','低分/无命中则覆盖下降，不编造'],
];
dyn.forEach(([id,x,t,l])=>card(id,x,3890,560,116,t,[l],{stroke:C.sage,titleSize:17}));
dyn.slice(0,-1).forEach(([id],i)=>connect(id,dyn[i+1][0],{fromSide:'r',toSide:'l',stroke:C.sage,sw:2,marker:'arrow-sage'}));
card('SNAP', 860, 4050, 1280, 190, '本轮最小充分事实快照', [
  '当前输入＋身份座位＋最新端态＋视觉情境＋相关记忆',
  '目标进度＋工具能力＋参考知识＋最新结果',
  '每个动态值必须知道：谁写、何时写、何时过期、属于谁、可信度',
], { main:true, titleSize:22, bodySize:17, lineH:24 });
poly([[2730,3846],[2920,3846],[2920,4145],[860,4145]],{stroke:C.cobalt,sw:3,marker:'arrow-blue'});
connect('D4','SNAP',{fromSide:'b',toSide:'r',stroke:C.sage,marker:'arrow-sage'});
card('CTX_METRIC', 2180, 4270, 760, 220, '上下文验收', [
  '必要事实覆盖、关键事实保留',
  '来源/时间/有效期完整、陈旧命中',
  '冲突裁决、跨用户越权＝0',
  '输入长度与压缩损失',
], { stroke:C.sage });
card('CTXOUT', 860, 4290, 1280, 130, '模型本轮用户提示词', ['近期对话＋当前输入数组＋事实快照＋目标＋历史反馈'], { main:true });
connect('SNAP','CTXOUT');

// 04 Planner.
stage(4580, 4, 'Planner / Director：同一个 AI 决策中枢', '先确认模型看到了什么，再验目标理解、未知判断、任务拆解、工具参数、依赖和再规划。');
card('SP', 60, 4680, 850, 176, '系统提示词', ['角色、输入类型、工具定义、输出格式、安全规则', '参考示例、车型知识、工具技巧与表达风格']);
card('P0', 960, 4680, 1080, 176, 'Planner / Director 单一模块', ['输入＝系统提示词＋本轮用户提示词', '输出只是候选回复与候选动作，不直接控制车辆'], { main:true, titleSize:22 });
card('UP', 2090, 4680, 850, 176, '用户提示词', ['近期对话＋当前输入＋Context/Memory/Goal', '工具反馈到来后重新构造下一轮']);
connect('SP','P0',{fromSide:'r',toSide:'l'}); connect('CTXOUT','P0'); connect('UP','P0',{fromSide:'l',toSide:'r'});
const checks = [
  ['P1','①输入类型　②身份/指代/空间　③目标/已知未知','分清请求/建议/结果/事件；可推断/可查/必须问'],
  ['P2','④能力安全拒识　⑤任务分型　⑥原子动作','车型/权限/车速档位；单步/多步/条件/持续'],
  ['P3','⑦依赖并发　⑧工具/任务代理与参数　⑨说话','独立并行、依赖串行；不提前承诺结果'],
  ['P4','⑩目标持久化　⑪输出自检去重　⑫下一轮策略','继续/改计划/等待/追问/结束'],
];
checks.forEach(([id,t,l],i)=>card(id,60+i*730,4910,690,150,t,[l],{titleSize:17}));
checks.slice(0,-1).forEach(([id],i)=>connect(id,checks[i+1][0],{fromSide:'r',toSide:'l',sw:2}));
connect('P0','P1');
card('POUT', 760, 5100, 1480, 204, '本轮结构化输出', [
  '是否说话 talk_or_not｜回复 talk_content｜形象动作 emoji_id',
  '动作清单 action_list＝action_id＋tool_name＋params',
  '动作清单仅是候选计划：不等于已下发、工具成功、真实生效或目标完成',
], { main:true, titleSize:22, bodySize:17, lineH:25 });
connect('P4','POUT',{fromSide:'b',toSide:'t'});
card('PGAP', 60, 5350, 1380, 300, '协议关键缺口', [
  '请求缺 request/trace/turn；同名并发反馈缺 action_id',
  'Advisor 缺来源/时间/目标/置信/有效期；Event 缺类型/来源/去重',
  '动作缺 depends_on/并行组/超时/重试/取消；Goal 更新缺暂停恢复',
  '这些缺口未补齐前，不能把所有 badcase 都归因模型能力',
], { dash:'10 7',stroke:C.sage });
card('PAI', 1500, 5350, 1440, 300, '真正需要考验的 AI 能力', [
  '完整目标理解｜未知识别与必要澄清｜任务分型与原子拆解',
  '工具/参数正确｜串并行与长期任务选择｜安全拒绝/确认',
  '根据 partial/timeout/failure 改计划｜同题多跑稳定｜不虚假成功',
  '信息、工具、反馈都正确仍推错，才优先判 AI 决策能力问题',
], { stroke:C.sage });

// 05 validation + tasks.
stage(5740, 5, '动作校验、即时/持久任务分流', '模型结果必须经过确定性门禁；Goal、Trigger、VLM、Task 命中后仍回到同一运行调度器。');
const validations = [
  ['V1','字段/结构','必填、类型、枚举、白名单'],
  ['V2','能力/安全','车型、座位、权限、档位车速'],
  ['V3','依赖/并发','独立并行；依赖结果则分轮'],
  ['V4','幂等/竞态','动作关联、去重、迟到保护'],
  ['V5','调用生命周期','下发、超时、重试、取消、聚合'],
];
validations.forEach(([id,t,l],i)=>card(id,50+i*590,5840,560,138,`${i+1}｜${t}`,[l],{titleSize:17}));
validations.slice(0,-1).forEach(([id],i)=>connect(id,validations[i+1][0],{fromSide:'r',toSide:'l',sw:2}));
poly([[1500,5304],[1470,5304],[1470,5800],[330,5800],[330,5840]],{stroke:C.cobalt,sw:3,marker:'arrow-blue'});
card('TDEC', 1040, 6020, 920, 100, '任务是否需要跨轮持久化？', ['单步/复合/多步依赖＝否；定时/条件/持续＝是'], { main:true });
connect('V5','TDEC');
const types=['简单单步','复合单轮','多步依赖','定时任务','条件任务','持续任务'];
types.forEach((t,i)=>card(`TT${i+1}`,50+i*490,6160,460,92,t,[i<3?'当前轮或 feedback 分轮':'保存条件/范围/退出'],{titleSize:17}));
card('IMM', 220, 6290, 760, 128, '否｜即时动作', ['本轮或多轮 ReAct 执行', '通过 feedback 决定下一步']);
card('PER', 2020, 6290, 760, 128, '是｜持久任务', ['保存目标、条件、范围、频率、状态与退出', '创建成功只代表进入等待'],{stroke:C.sage});
connect('TDEC','IMM',{fromSide:'l',toSide:'r',label:'否'}); connect('TDEC','PER',{fromSide:'r',toSide:'l',stroke:C.sage,marker:'arrow-sage',label:'是'});
const goal = [
  ['GC1',70,'目标队列更新','新增/删除；更新暂停恢复仍需补'],
  ['GC2',560,'Goal List','目标号、条件、范围、状态、进度'],
  ['GC3',1050,'规则/订阅','注册 Trigger 并进入等待'],
  ['GC4',1540,'顾问建议','静态/动态 Advisor 无最终执行权'],
];
goal.forEach(([id,x,t,l])=>card(id,x,6470,450,122,t,[l],{stroke:C.sage,titleSize:17}));
goal.slice(0,-1).forEach(([id],i)=>connect(id,goal[i+1][0],{fromSide:'r',toSide:'l',stroke:C.sage,sw:2,marker:'arrow-sage'}));
connect('PER','GC1',{fromSide:'l',toSide:'r',stroke:C.sage,marker:'arrow-sage'});
card('TASKBOUND', 2030, 6470, 900, 122, '责任边界', ['Task Agent＝入口/透传；Task Service＝生命周期事实', 'Trigger＝判断是否命中；Runtime＝本次执行；Planner＝决策'],{dash:'10 7',stroke:C.sage,titleSize:17});
const task = [
  ['TA1','Task Agent'],['TA2','任务入口层'],['TA3','规格构建器'],['TA4','Task Manager'],['TA5','事实仓库'],['TA6','Trigger Adapter'],
];
task.forEach(([id,t],i)=>card(id,50+i*490,6640,460,104,`【建设中】${t}`,[
  ['入口/透传','解析/绑定/幂等','建/改/取消/查','唯一状态机','Task/Run/Event/Action','复用原 Trigger'][i]
],{dash:'10 7',stroke:C.sage,titleSize:16}));
task.slice(0,-1).forEach(([id],i)=>connect(id,task[i+1][0],{fromSide:'r',toSide:'l',stroke:C.sage,sw:2,dash:'8 6',marker:'arrow-sage'}));
poly([[2400,6418],[2950,6418],[2950,6615],[280,6615],[280,6640]],{stroke:C.sage,sw:2,dash:'8 6',marker:'arrow-sage'});
const trig = [
  ['TR1','信号来源'],['TR2','标识/时间/置信/TTL'],['TR3','规则＋任务号＋版本'],['TR4','监听/组合/语义求值'],['TR5','防抖/迟滞'],['TR6','去重/冷却/频控'],['TR7','优先级/互斥'],['TR8','命中？'],
];
trig.forEach(([id,t],i)=>card(id,50+i*365,6810,340,98,t,[i===7?'是→callback；否/未知→等待':'Trigger 不直接执行'],{titleSize:16}));
trig.slice(0,-1).forEach(([id],i)=>connect(id,trig[i+1][0],{fromSide:'r',toSide:'l',sw:2}));
poly([[1275,6592],[1010,6592],[1010,6780],[950,6780],[950,6810]],{stroke:C.sage,sw:2,marker:'arrow-sage'});
connect('TA6','TR3',{fromSide:'b',toSide:'t',stroke:C.sage,dash:'8 6',marker:'arrow-sage'});
const vlm = [
  ['VA','按需视觉问答【当前】','Planner→visual_qa→取帧/权限→结构化描述→feedback'],
  ['VD','默认常驻视觉【待版本验真】','默认主题→周期采样→摘要→按来源/时间/TTL 进入 Context'],
  ['VY','动态长时观察【条件任务】','观察清单＋版本→周期取帧→客观报告＋任务号→Trigger 语义匹配'],
];
vlm.forEach(([id,t,l],i)=>card(id,50+i*980,6960,940,154,t,[l,i===2?'禁止直接进 Context 或直接调用工具':'采样周期≠用户通知周期'],{stroke:i===2?C.sage:C.deep,titleSize:17}));
poly([[1500,6960],[1500,6910],[2870,6910],[2870,4300],[2140,4300]],{stroke:C.sage,sw:2,dash:'8 6',marker:'arrow-sage',label:'进入 Context',lx:2640,ly:4280});
poly([[2480,6960],[2480,6940],[1315,6940],[1315,6908]],{stroke:C.sage,sw:2,marker:'arrow-sage',label:'客观报告',lx:2040,ly:6920});
const run = [
  ['RUN1',120,'callback 恢复与去重','task_id＋callback_id＋版本'],
  ['RUN2',760,'创建本轮 Run','相同 callback 不重复创建'],
  ['RUN3',1400,'运行门禁','最新车态/人物/权限/安全/网络'],
  ['RUN4',2040,'运行调度','通过→同一原主链；否则等待/跳过'],
];
run.forEach(([id,x,t,l])=>card(id,x,7160,600,126,t,[l],{titleSize:17,stroke:C.sage}));
run.slice(0,-1).forEach(([id],i)=>connect(id,run[i+1][0],{fromSide:'r',toSide:'l',stroke:C.sage,sw:2,marker:'arrow-sage'}));
poly([[2775,6908],[2920,6908],[2920,7135],[420,7135],[420,7160]],{stroke:C.sage,sw:2,marker:'arrow-sage',label:'命中 callback',lx:2580,ly:7128});
card('TASKSTATE', 60, 7330, 1320, 226, '任务生命周期与可靠通知', [
  'Event：接收→校验→应用/拒绝；Task：等待→运行→关闭',
  'Run：创建→运行→成功/失败/跳过/取消；Action：待下发→接收→调用→生效→完成',
  'Outbox：待发送→已发送→确认；失败重试/死信/告警',
  '取消必须停任务、规则、视觉、运行和残留通知；重启靠事实仓库恢复',
], { dash:'10 7',stroke:C.sage });
card('SCHED', 960, 7620, 1080, 126, '统一运行调度器', ['即时路径、触发 callback、专用 Agent 最终共用同一工具/执行主链', '端侧、云端和生态能力均遵守同一校验、幂等与反馈契约'], { main:true,titleSize:22 });
poly([[600,6418],[30,6418],[30,7683],[960,7683]],{stroke:C.cobalt,sw:3,marker:'arrow-blue',label:'即时动作',lx:410,ly:7668});
poly([[520,7114],[520,7580],[900,7580],[900,7683],[960,7683]],{stroke:C.cobalt,sw:2,marker:'arrow-blue',label:'按需 visual_qa（工具15）',lx:690,ly:7568});
connect('RUN4','SCHED',{fromSide:'b',toSide:'r',stroke:C.sage,marker:'arrow-sage'});

// 06 Tools.
stage(7800, 6, '27 个工具与真实执行', '每个工具都从统一动作总线进入，并携带输入、机制、完成证据和门禁；结果全部汇回统一反馈。');
card('DISPATCH', 900, 7900, 1200, 120, '工具节点 → 能力目录 → 协议适配', ['豆包云能力｜车端能力｜生态服务｜对话能力｜动态注册 Agent', 'tool_name＋params＋作用对象＋request/turn/action 关联编号'], { main:true,titleSize:22 });
line(edgeLayer, 60, 8080, 2940, 8080, { stroke:C.cobalt,sw:4 });
connect('SCHED','DISPATCH');

const tools = [
  ['基础车控','vehicle_basic_control','窗/空调/座椅/灯/锁目标','座位＋最新车况→车端协议','物理状态回读','车型/权限/档位车速；不支持开关车门'],
  ['车载系统设置','vehicle_system_settings','蓝牙/网络/屏幕/声音/账号','定位设置项→改值或开页面','设置值或页面状态','系统权限/模式；K歌设置走这里'],
  ['车载通信','vehicle_communication','拨打/接听/挂断电话或视频','联系人解析→歧义确认→通信服务','通话状态/失败原因','仅主驾；联系人不清确认；不支持短信'],
  ['辅助驾驶控制','auto_drive','泊入/泊出/贴边/循迹/巡航/变道','安全前置→智驾服务→端态呈现','可用性/阶段/终态','运行设计域、车速档位、驾驶员确认'],
  ['氛围灯控制','ambient_light_control','开关/颜色/亮度/模式/参考色','解析颜色区域→灯光服务→回读','实际灯光状态','车型、区域和模式冲突'],
  ['导航过程控制','navi_basic_control','结束/视图/播报/偏好','操作已有导航会话','当前导航阶段','不找新地点；不与路线规划并发'],
  ['当前媒体控制','media_basic_control','暂停/切歌/收藏/倍速/清晰度','操作当前媒体会话','播放或界面状态','须有可操作媒体；不做重新搜索'],
  ['车辆实时状态查询','vehicle_status_search','温度/门窗/胎压/车速/续航','读取当前车辆最新快照','值＋时间＋不可用原因','校验车辆与新鲜度；旧对话非实时'],
  ['天气查询','weather_search','地点×时间：当前/目的地/沿途','在线天气与预警查询','对应时空天气事实','位置时间明确；陈旧结果不复用'],
  ['地点与商家搜索','poi_search','附近/中点/顺路＋品类筛选','搜索→过滤→排序','地点/距离/营业/评分','不直接导航；沿途依赖已有路线'],
  ['联网信息搜索','web_search','新闻/日期/开放域实时问题','检索→打开原始来源→核验','事实＋来源＋时间','摘要仅线索；无原证据不补事实'],
  ['用车报告查询','car_log','时间窗/行程/报告类型','查能耗、通勤和历史行程','周期用车报告','非实时车况；时间/车辆归属明确'],
  ['车辆说明书问答','vehicle_manual_qa','功能/硬件/教程/技巧','检索车型说明','说明/步骤/适用边界','不替代实时状态；车型版本匹配'],
  ['车况维养问答','car_care_qa','保养/保险/权益/维修','按绑定车辆查长期车务','维养或权益结果','绑定正确；实时状态不走这里'],
  ['当前视觉问答','visual_qa','车内外当前可见人/物/场景','选视角→取帧→识别→结构化','目标/位置/描述/置信','只说视角内事实；外部知识另走'],
  ['用户记忆查询','user_memory_search','用户事实/偏好/过往经历','按身份/范围/隐私检索','命中或明确空结果','身份不确定限制读取；未找到不猜'],
  ['路线规划并发起导航','route_planning','精确目的地/途经点/路线偏好','确认地点→规划→选方案→发起导航','路线/预计时间/启动状态','与POI/导航控制串行；模糊先补清'],
  ['视频搜索并播放','video_search','名称/主题/类型/平台','搜索→候选匹配→启动播放','实际视频＋播放状态','匹配不等于播放；区分平台/版权'],
  ['音乐搜索并播放','music_search','歌曲/歌手/情绪/场景/类型','搜索并默认播放首条','实际首播曲目＋状态','复杂典故先联网查；避免重复播放'],
  ['播客搜索并播放','broadcast_search','节目/有声资源/名称/控制','搜索现有内容→选择→播放','节目/集数/播放状态','与生成新播客严格分开'],
  ['人脸身份注册','face_id_register','明确姓名＋座位＋注册意图','采集→质量校验→身份绑定','注册/更新或重试原因','姓名位置缺一不可；防错人'],
  ['用户记忆写入','user_memory_operate','事实/偏好/纠正/删除','不确定先确认；按身份增改删','写入/更新/删除结果','错用户零容忍；推断/临时状态不存'],
  ['持续目标管理','goal_list_update','新增/删除定时/条件/持续目标','查重→目标号/状态→后续注入','目标编号＋状态','Goal非执行器；顾问不得擅自建目标'],
  ['人工智能播客生成','ai_broadcast_generate','主题/风格/长度','受理→排队→生成','状态＋可播放音频产物','受理不等于完成；必须等产物/回调'],
  ['图片生成与编辑','image_generate','文生图/图生图＋描述/编辑','受理→生成→保存/推送','图片/地址/生成状态','无产物不报完成；隐私图片授权'],
  ['录音纪要','audio_record','开始/停止/查看','空闲→录音→停止→生成纪要','录音状态＋纪要产物','权限/隐私/中断恢复；开始≠纪要完成'],
  ['停车缴费','parking_fee_pay','缴费请求＋车牌/车辆','确认车牌→查订单→金额/付款页','订单/金额/付款地址/展示状态','车牌金额确认；订单幂等；支付回调待补'],
];

const toolRows = [];
for (let i = 0; i < tools.length; i += 1) {
  const col = Math.floor(i / 9);
  const row = i % 9;
  const x = 70 + col * 980;
  const y = 8140 + row * 198;
  const [cn, field, input, mech, evidence, gate] = tools[i];
  card(`TOOL${i + 1}`, x, y, 900, 178, `${String(i + 1).padStart(2,'0')}｜${cn}（${field}）`, [
    `输入：${input}`,
    `机制：${mech}`,
    `证据：${evidence}`,
    `门禁：${gate}`,
  ], { titleSize:17, bodySize:16, lineH:24 });
  toolRows.push({ id:`TOOL${i + 1}`, col, row, x, y });
}
text(nodeLayer, 80, 8125, '01–09｜车控/系统/通信/智驾/状态', {size:18,weight:700});
text(nodeLayer, 1060, 8125, '10–18｜搜索/知识/视觉/导航/视频', {size:18,weight:700});
text(nodeLayer, 2040, 8125, '19–27｜媒体/身份/记忆/目标/生成/交易', {size:18,weight:700});
poly([[1500,8020],[1500,8080]],{stroke:C.cobalt,sw:4,marker:'arrow-blue',label:'动作 IN',lx:1600,ly:8068});

const inRails = [50,1030,2010];
const outRails = [990,1970,2950];
inRails.forEach(x=>line(edgeLayer,x,8080,x,9890,{stroke:C.cobalt,sw:3}));
outRails.forEach(x=>line(edgeLayer,x,8080,x,9890,{stroke:C.sage,sw:3}));
toolRows.forEach(({id,col})=>{
  const b=boxes.get(id), cy=b.y+b.h/2;
  poly([[inRails[col],cy],[b.x,cy]],{stroke:C.cobalt,sw:2,marker:'arrow-blue'});
  poly([[b.x+b.w,cy],[outRails[col],cy]],{stroke:C.sage,sw:2,marker:'arrow-sage'});
});
line(edgeLayer, 50, 9940, 2950, 9940, { stroke:C.sage,sw:4 });
outRails.forEach(x=>poly([[x,9890],[x,9940],[1500,9940],[1500,9980]],{stroke:C.sage,sw:3,marker:'arrow-sage'}));
card('XRAW', 80, 10000, 540, 170, '① 原始结果', ['受理/端侧指令/外部结果/错误', '被接收不等于服务成功']);
card('XCALL', 650, 10000, 540, 170, '② 服务调用', ['接口或执行服务成功', '不等于设备/播放/订单生效']);
card('XSTATE', 1220, 10000, 540, 170, '③ 真实状态回读', ['设备值、导航阶段、实际播放', '订单终态、生成产物']);
card('XGOAL', 1790, 10000, 540, 170, '④ 用户目标证据', ['所有必要子目标有证据', '无必需待办/待等条件']);
card('XBOUND', 2360, 10000, 580, 170, '端云/生态责任边界', ['Planner 选能力；调度器管关联', 'Provider 执行；车端/生态回读', '任何一层失败都回传'],{stroke:C.sage,titleSize:17});
['XRAW','XCALL','XSTATE','XGOAL'].slice(0,-1).forEach((id,i)=>connect(id,['XCALL','XSTATE','XGOAL'][i],{fromSide:'r',toSide:'l',stroke:C.sage,marker:'arrow-sage'}));
card('XRESULT', 860, 10220, 1280, 154, '统一执行结果', [
  '成功/失败/部分成功/超时/取消/需补信息＋错误码＋可重试＋真实状态＋产物',
  '工具自播/自带界面也要记录，避免 Planner 重复表达或重复执行',
], { main:true,titleSize:22 });
connect('XSTATE','XRESULT',{fromSide:'b',toSide:'t',stroke:C.sage,marker:'arrow-sage'});

// 07 feedback and completion.
stage(10460, 7, 'tool_feedback、再规划与完成互斥门', '真实结果必须作为新输入回到同一 Planner；“继续”与“最终完成”只能二选一。');
card('FB0', 1040, 10560, 920, 112, '形成工具执行反馈｜tool_feedback', ['不是模型内部隐藏返回值；到达即开启新一轮判断'], { main:true });
connect('XRESULT','FB0',{stroke:C.sage,marker:'arrow-sage'});
card('FB1', 1040, 10700, 920, 128, '写回与关联', ['对话历史、Action/Run/Task、端态、Goal 进度、已呈现内容', 'request/turn/action/tool/callback/run/task 编号应贯通']);
connect('FB0','FB1',{stroke:C.sage,marker:'arrow-sage'});
card('COMP', 1040, 10860, 920, 128, '用户完整目标真正完成？', ['门槛：目标满足＋无必要待执行动作＋无等待任务/条件'], { main:true });
connect('FB1','COMP',{stroke:C.sage,marker:'arrow-sage'});
card('CONTINUE', 160, 11040, 1040, 180, '否｜继续下一轮', ['继续调用/换工具/补槽/追问/等待/降级/取消', '保留已成功分支；停止机械重试；tool_feedback 回输入治理'],{stroke:C.sage});
card('FINAL', 1800, 11040, 1040, 180, '是｜进入最终输出', ['所有必要子目标有证据，无必需待办', '动作清单为空/接口成功/模型说完成均不是证据'],{main:true});
connect('COMP','CONTINUE',{fromSide:'l',toSide:'r',stroke:C.sage,marker:'arrow-sage',label:'否'});
connect('COMP','FINAL',{fromSide:'r',toSide:'l',label:'是'});
poly([[160,11130],[30,11130],[30,2910],[1040,2910]],{stroke:C.sage,sw:4,marker:'arrow-sage',label:'第 2 / N 轮：feedback → 输入治理 → Context → 同一 Planner',lx:560,ly:2895});
card('ERR', 160, 11260, 2680, 210, '异常统一归一化', [
  '输入异常→重听/澄清　上下文异常→刷新/查事实/降级未知　决策异常→修参数/依赖并重新规划',
  '执行异常→安全重试/换工具/等待/结束　时序异常→幂等/版本检查/丢弃迟到结果',
  '所有异常统一形成：结果＋说明＋错误码＋可否重试＋真实状态＋时间，再进入 FB0',
], { dash:'10 7',stroke:C.sage,titleSize:20 });
poly([[1500,11260],[1500,11240],[1040,11240],[1040,10616]],{stroke:C.sage,sw:2,dash:'8 6',marker:'arrow-sage'});

// 08 outputs.
stage(11540, 8, '四路输出与用户真实感知', '语音、界面、形象和实体动作分别取证，最终在用户侧汇合。');
card('O0', 1040, 11640, 920, 108, '本轮输出编排', ['明确什么已完成、什么仍等待；输出与真实状态保持一致'], { main:true });
connect('FINAL','O0');
const outputs = [
  ['O1',50,'语音路','talk_content→语音合成→扬声器','首音/完成/被打断；播完≠实体完成'],
  ['O2',790,'界面路','回复/进度→即时卡/智能条/任务中心','展示/点击/关闭/超时回调'],
  ['O3',1530,'形象路','emoji/动作→头像/圆屏/云台/口型','端侧接收与呈现状态'],
  ['O4',2270,'实体结果路','动作→工具→协议→车端/应用/生态','执行回执＋真实车态/订单/产物'],
];
outputs.forEach(([id,x,t,l1,l2])=>card(id,x,11810,680,176,t,[l1,l2],{titleSize:18}));
outputs.forEach(([id])=>connect('O0',id,{fromSide:'b',toSide:'t',sw:2}));
card('O5', 760, 12040, 1480, 160, '用户最终感知', ['听到、看到、车辆或服务真的发生；语音/界面/形象/实体状态一致', '不能只靠一句“搞定了”；停止播报也不等于取消实体动作'], { main:true,titleSize:22 });
outputs.forEach(([id])=>connect(id,'O5',{fromSide:'b',toSide:'t',stroke:C.sage,sw:2,marker:'arrow-sage'}));
card('OUTBOUND', 50, 12240, 1380, 180, '任务中心与任务服务', ['任务中心：入口、列表、启停、展示/通知容器', '任务服务：Task/Run/Event 事实、生命周期、恢复与清理'],{stroke:C.sage});
card('OUTVUI', 1570, 12240, 1380, 180, '打断与输出边界', ['用户新请求必须回输入治理；无效输入是否恢复播报需产品定义', '语音、界面与实体动作各自保留状态，禁止互相冒充完成'],{stroke:C.sage});

// 09 metrics and mastery.
stage(12480, 9, '指标、问题归因与产品掌握度', '同一条追踪记录贯穿请求、动作、工具结果、真实状态、任务和最终呈现。');
const kpis = [
  ['K1','语音输入','唤醒/识别/否定数字地点/座位/时延'],
  ['K2','路由拒识','快路精度/复杂召回/误拒/双执行/迟到'],
  ['K3','上下文记忆','覆盖/新鲜/来源/冲突/越权/长度'],
  ['K4','AI 决策规划','意图/拆解/工具参数/依赖/再规划/稳定'],
  ['K5','工具执行','接收/调用/生效/完成/重试/幂等/回读'],
  ['K6','长期任务主动服务','创建/触发/延迟/重复/取消/恢复/清理'],
  ['K7','端到端体验安全','完整目标/复合全成/耗时/假成功/一致/事故'],
];
kpis.forEach(([id,t,l],i)=>{
  const row=i<4?0:1, col=i<4?i:i-4;
  const w=row===0?700:920;
  const x=50+col*(row===0?730:950);
  const y=12580+row*150;
  card(id,x,y,w,126,`${i+1}｜${t}`,[l,'必须带分母、车型、版本、场景、样本与时间窗'],{titleSize:17,bodySize:16});
});
card('RCA', 50, 12895, 2900, 176, 'AI 问题判定顺序', [
  '先拿完整追踪→①走对模块？②工具定义/能力/参数清楚？③必要事实进快照？④注入事实正确无矛盾？',
  '⑤仍理解错目标/工具/依赖＝优先判 AI 决策问题；⑥下发/执行/回读关联失败＝工程时序；⑦反馈后不收口＝再规划问题',
], { stroke:C.sage,titleSize:20 });
const levels = [
  ['L0','名词层','认得模块，不能独立评审'],
  ['L1','链路层','能从语音讲到真实结果'],
  ['L2','诊断层','拿 trace 定位输入/模型/工具/时序'],
  ['L3','负责人层','定义测试/指标/阈值并证明收益'],
  ['L4','架构策略层','取舍端云/规则模型/质量时延成本'],
];
levels.forEach(([id,t,l],i)=>card(id,50+i*590,13110,560,120,`${id}｜${t}`,[l],{main:i===2||i===3,titleSize:17}));
levels.slice(0,-1).forEach(([id],i)=>connect(id,levels[i+1][0],{fromSide:'r',toSide:'l',sw:2}));
card('CAREER', 560, 13270, 1880, 142, '两年内应形成的硬成果', ['至少达到 L2，并在一个核心方向做到 L3：一套评测集＋一次跨链路改造＋量化收益＋风险边界'],{main:true,titleSize:22});
connect('L3','CAREER');
card('PMQ', 50, 13450, 2900, 310, '产品评审十问', [
  '1 完整目标和分母？　2 系统已知/未知？　3 为何走该路由、怎样防双执行？　4 为何选该工具/参数/顺序？',
  '5 工具“成功”是哪一层？　6 tool_feedback 是否触发下一轮？　7 谁维护依赖、幂等、超时、取消和迟到？',
  '8 长期任务怎样创建、更新、取消、重启恢复、清理？　9 顾问/Trigger/新请求冲突谁裁决？',
  '10 最终“搞定”依赖哪条真实证据，能否一键回放整条链？',
], { titleSize:20, bodySize:17, lineH:27 });

const defs = `<defs>
  <marker id="arrow-blue" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0 0L12 5L0 10Z" fill="${C.cobalt}"/></marker>
  <marker id="arrow-sage" markerWidth="12" markerHeight="10" refX="11" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0 0L12 5L0 10Z" fill="${C.sage}"/></marker>
</defs>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
${defs}
<g id="background">${bg.join('\n')}</g>
<g id="connectors">${edgeLayer.join('\n')}</g>
<g id="nodes">${nodeLayer.join('\n')}</g>
<g id="edge-labels">${labelLayer.join('\n')}</g>
</svg>\n`;

writeFileSync(OUT, svg, 'utf8');
const toolFields = tools.map(t => t[1]);
const duplicateTools = toolFields.filter((t, i) => toolFields.indexOf(t) !== i);
console.log(JSON.stringify({
  output: OUT,
  width: W,
  height: H,
  boxes: boxes.size,
  shapes: shapeCount,
  texts: textCount,
  connectors: connectorCount,
  toolCount: toolFields.length,
  duplicateTools,
  minBodyFont: 16,
}, null, 2));
