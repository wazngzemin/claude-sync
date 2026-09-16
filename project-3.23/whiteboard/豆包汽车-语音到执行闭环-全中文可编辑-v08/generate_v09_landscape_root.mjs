import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('./diagram-v09-landscape-root.svg', import.meta.url));
const source = fileURLToPath(new URL('./generate_v08_final_flow.mjs', import.meta.url));
const W = 20000;
const H = 9800;

const C = {
  bg: '#ECECEC', paper: '#F8F7F3', paper2: '#F2F4F6', white: '#FFFFFF',
  ink: '#17324D', muted: '#52687B', blue: '#185DB7', blue2: '#0D4FA8',
  pale: '#EAF2FD', sage: '#E8F2EA', sageLine: '#4E8A68',
  sand: '#F6F0E2', amber: '#A96D14', risk: '#B84B4B', riskBg: '#FBECEC',
  wip: '#7B6B9A', wipBg: '#F1EDF7', line: '#B8C3CC',
};

const esc = s => String(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&apos;');

const bgSvg = [];
const edgeSvg = [];
const nodeSvg = [];
const overlaySvg = [];
const nodes = new Map();

function text(x, y, value, size = 16, weight = 500, fill = C.ink, anchor = 'start', layer = nodeSvg) {
  layer.push(`<text x="${x}" y="${y}" font-size="${size}px" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(value)}</text>`);
}

function rect(x, y, w, h, fill = C.white, stroke = C.line, sw = 1.5, rx = 16, layer = nodeSvg, dash = '') {
  layer.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
}

function card(id, x, y, w, h, titleValue, lines = [], opts = {}) {
  const { fill = C.white, stroke = C.line, sw = 1.5, titleFill = C.ink, tag = '', dash = '', titleSize = 19, lineSize = 16, lineGap = 24 } = opts;
  rect(x, y, w, h, fill, stroke, sw, 14, nodeSvg, dash);
  if (tag) {
    const tw = Math.max(76, tag.length * 17 + 22);
    rect(x + 16, y + 12, tw, 28, stroke, stroke, 1, 7);
    text(x + 16 + tw / 2, y + 33, tag, 16, 750, C.white, 'middle');
    text(x + 16, y + 65, titleValue, titleSize, 750, titleFill);
  } else {
    text(x + 16, y + 32, titleValue, titleSize, 750, titleFill);
  }
  const start = tag ? y + 90 : y + 60;
  lines.forEach((line, i) => text(x + 16, start + i * lineGap, line, lineSize, 500, i === lines.length - 1 && opts.lastRisk ? C.risk : C.muted));
  nodes.set(id, { x, y, w, h });
  return id;
}

function anchor(id, side = 'right') {
  const n = nodes.get(id);
  if (!n) throw new Error(`Unknown node: ${id}`);
  if (side === 'top') return [n.x + n.w / 2, n.y];
  if (side === 'bottom') return [n.x + n.w / 2, n.y + n.h];
  if (side === 'left') return [n.x, n.y + n.h / 2];
  if (side === 'right') return [n.x + n.w, n.y + n.h / 2];
  return [n.x + n.w / 2, n.y + n.h / 2];
}

function route(points, opts = {}) {
  const { color = C.blue, width = 3, dash = '', arrow = true, label = '', labelAt = null } = opts;
  edgeSvg.push(`<polyline points="${points.map(p => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${arrow ? ' marker-end="url(#arrow)"' : ''}/>`);
  if (label) {
    const p = labelAt || points[Math.floor(points.length / 2)];
    const lw = Math.max(82, label.length * 16 + 24);
    rect(p[0] - lw / 2, p[1] - 18, lw, 32, C.white, color, 1, 7, overlaySvg);
    text(p[0], p[1] + 5, label, 16, 700, color, 'middle', overlaySvg);
  }
}

function hconnect(a, b, opts = {}) {
  const from = anchor(a, opts.from || 'right');
  const to = anchor(b, opts.to || 'left');
  const via = opts.via || (Math.abs(from[1] - to[1]) < 2 ? [] : [[(from[0] + to[0]) / 2, from[1]], [(from[0] + to[0]) / 2, to[1]]]);
  route([from, ...via, to], opts);
}

function vconnect(a, b, opts = {}) {
  const from = anchor(a, opts.from || 'bottom');
  const to = anchor(b, opts.to || 'top');
  const via = opts.via || (Math.abs(from[0] - to[0]) < 2 ? [] : [[from[0], (from[1] + to[1]) / 2], [to[0], (from[1] + to[1]) / 2]]);
  route([from, ...via, to], opts);
}

function stageHeader(x, w, num, titleValue, subtitle, fill = C.white) {
  rect(x, 392, w, 112, fill, C.blue, 1.5, 10);
  rect(x + 14, 416, 58, 58, C.blue, C.blue, 1, 29);
  text(x + 43, 455, num, 20, 800, C.white, 'middle');
  text(x + 90, 437, titleValue, 22, 800, C.ink);
  text(x + 90, 470, subtitle, 16, 500, C.muted);
}

// Canvas, stage columns and horizontal responsibility bands.
rect(0, 0, W, H, C.bg, C.bg, 0, 0, bgSvg);
const stages = [
  [80, 2200, '01', '语音输入', '声音→统一用户请求'],
  [2280, 3360, '02', '端云路由', '候选生成→唯一裁决'],
  [5640, 2360, '03', 'Context', '四类输入→事实快照'],
  [8000, 2320, '04', 'Planner / Director', '理解→规划→候选动作'],
  [10320, 2520, '05', '门禁与长期任务', '确定性校验→即时/持久'],
  [12840, 3760, '06', '27 工具与真实执行', '工具入口→真实回读'],
  [16600, 1740, '07', '反馈与完成门', 'feedback→再规划→互斥状态'],
  [18340, 1580, '08', '输出与用户感知', '语音/界面/形象/实体证据'],
];
stages.forEach(([x, w, n, t, s], i) => {
  rect(x, 520, w, 7270, i % 2 ? C.paper2 : C.paper, C.line, 1, 0, bgSvg);
  stageHeader(x, w, n, t, s, i === 4 ? C.pale : C.white);
});

const bands = [
  [520, 880, 'A｜用户请求与唯一决策主轴', C.white],
  [1400, 1550, 'B｜上下文、模型解释与长期任务', '#F7F7F4'],
  [2950, 2280, 'C｜27 工具能力与真实执行', '#FAF9F6'],
  [5230, 2550, 'D｜真实反馈、完成判断与输出', '#F5F8F6'],
];
bands.forEach(([y, h, name, fill]) => {
  bgSvg.push(`<rect x="80" y="${y}" width="19840" height="${h}" fill="${fill}" fill-opacity="0.34" stroke="none"/>`);
  edgeSvg.push(`<line x1="80" y1="${y}" x2="19920" y2="${y}" stroke="${C.line}" stroke-width="1.5"/>`);
  rect(100, y + 18, Math.max(310, name.length * 20 + 28), 38, C.white, C.line, 1, 10);
  text(118, y + 44, name, 17, 750, C.blue2);
});

rect(80, 48, 19840, 178, C.blue2, C.blue2, 0, 18);
text(132, 105, '豆包汽车｜语音用户请求到真实结果｜横向单主链业务架构图', 36, 850, C.white);
text(132, 151, '沿钴蓝粗线从左到右读一次请求；中部下钻长期任务与 27 工具；绿色结果沿底部回到同一 Context 与同一 Planner。', 20, 550, C.white);
text(132, 190, '完成口径：被接收 ≠ 服务调用成功 ≠ 真实状态生效 ≠ 用户完整目标完成。', 20, 750, '#FFF0E6');
rect(80, 244, 19840, 112, C.white, C.blue, 1.5, 14);
text(120, 284, '当前链路事实：蓝色实线 / 绿色结果线　　当前协同机制：琥珀色　　建设中或待验真：紫色虚线　　异常、拒绝、失败：红色虚线', 18, 700, C.ink);
text(120, 322, '产品阅读顺序：输入是否完整 → 路由是否唯一 → Context 是否有证据 → Planner 候选是否过门禁 → 工具是否真实生效 → feedback 是否回流 → 完成门是否有证据。', 18, 650, C.muted);

// A. Voice input and routing main spine.
const coreY = 650;
card('U1', 150, coreY, 310, 220, '用户发声', ['原始音频与声区', '指代 / 否定 / 时间', '可能包含插话与打断'], { fill: C.white, stroke: C.blue });
card('U2', 505, coreY, 355, 220, '唤醒与会话门', ['唤醒 / 免唤醒 / 权限', '播报中是插话还是延续', '失败必须有明确出口'], { fill: C.pale, stroke: C.blue });
card('U3', 905, coreY, 355, 220, '声学前处理', ['降噪 / 回声 / 波束', '多人声分离与端点检测', '输出声区＋时间戳'], { fill: C.pale, stroke: C.blue });
card('U4', 1305, coreY, 370, 220, '语音识别 ASR', ['增量文本→最终文本', '保真否定 / 数字 / 地点', '输出置信度与说话人'], { fill: C.pale, stroke: C.blue });
card('U5', 1720, coreY, 520, 220, '统一 user_query', ['query＋speaker_name＋position', 'timestamp＋goal_list＋env_info', '补齐 request / trace / turn 编号'], { fill: C.sage, stroke: C.sageLine });
card('R1', 2310, coreY, 340, 220, '接入网关', ['校验结构 / 会话 / 车型', '统一车企协议', '写入全链 Trace'], { fill: C.pale, stroke: C.blue });
card('R2', 2695, coreY, 340, 220, '身份通过？', ['否：只给认证提示', '不读取私有 Context', '是：继续路由']);
card('R3', 3080, coreY, 340, 220, '专用模块？', ['Direct / 注册 Agent', '命中仍需统一门禁', '未指定继续快路']);
card('R4', 3465, coreY, 340, 220, '句法快路？', ['端侧 RAG / 小模型', '高置信低风险指令', '未命中继续上云']);
card('R5', 3850, coreY, 340, 220, '并行准备', ['预取 Context 与能力', 'Planner 可预热降时延', '完整 Context 前无执行权']);
card('R6', 4235, coreY, 340, 220, '云 FC 分流', ['简单 / 复杂 / 拒识', '分类结果不可直接执行', '复杂交给 Planner']);
card('R7', 4620, coreY, 570, 220, '端云唯一裁决', ['专用 / 快路 / 云简单 / 拒识 / 复杂', '一轮只签发一个 execution_token', '迟到候选丢弃并记录原因'], { fill: C.sage, stroke: C.sageLine });
card('RCOMPLEX', 5240, coreY, 390, 220, '复杂路径', ['需要知识 / 多步 / 记忆', '进入统一输入治理', '再形成完整 Context'], { fill: C.pale, stroke: C.blue });

const mainEdges = [
  ['U1','U2'], ['U2','U3'], ['U3','U4'], ['U4','U5'], ['U5','R1'], ['R1','R2'],
  ['R2','R3','是',[3055,620]], ['R3','R4','未指定',[3445,620]],
  ['R4','R5','未命中',[3830,620]], ['R5','R6'], ['R6','R7','提交候选',[4600,620]],
  ['R7','RCOMPLEX','复杂路径',[5425,620]],
];
mainEdges.forEach(([a,b,label,labelAt]) => hconnect(a, b, { color: C.blue, width: 4, label, labelAt }));

card('UERR', 150, 1000, 980, 300, '输入异常归因', ['无权限 / 未唤醒 / 回声 / 噪声 / 早截断', '否定、数字、时间、地点、人名识别错误', '处理：重听 / 澄清 / 明确拒绝；禁止猜测补全'], { fill: C.riskBg, stroke: C.risk, titleSize: 21 });
card('VUI', 1180, 1000, 980, 300, '语音界面状态机 VUI', ['待机→唤醒→聆听→识别→理解→准备回复', '合成排队→播报→下一轮 / 待机', '打断默认只停播报；是否取消实体动作另有策略'], { fill: C.sand, stroke: C.amber, titleSize: 21 });
card('RDIRECT', 2880, 1010, 720, 230, '专用模块候选', ['明确命令由专门 Agent 处理', '只产候选动作；仍须能力、安全与结果回传'], { fill: C.sand, stroke: C.amber });
card('RFAST', 3660, 1010, 720, 230, '端侧快路候选', ['高置信结构化意图与参数', '只产候选动作；不得绕过唯一裁决'], { fill: C.sand, stroke: C.amber });
card('RFC', 4440, 1010, 720, 230, '云 FC 简单候选', ['简单任务进入确定性门禁', '复杂任务进入 Context / Planner'], { fill: C.sand, stroke: C.amber });
card('RAUTH', 2460, 1270, 700, 230, '认证失败', ['只输出登录 / 绑定提示', '不得读取记忆与私有任务', '保留失败原因与 Trace'], { fill: C.riskBg, stroke: C.risk });
card('RREJECT', 4740, 1270, 760, 230, '拒识 / 澄清 / 仅记录', ['请求越界、歧义高或能力不足', '输出可解释原因和下一步', '禁止伪造工具或状态'], { fill: C.riskBg, stroke: C.risk });

route([anchor('U2','bottom'), [682,950], [640,950], anchor('UERR','top')], { color: C.risk, width: 2, dash: '10 8', label: '权限 / 会话异常', labelAt: [650,950] });
route([anchor('U4','bottom'), [1490,960], [930,960], anchor('UERR','top')], { color: C.risk, width: 2, dash: '10 8', label: '识别异常', labelAt: [1180,960] });
route([anchor('U2','bottom'), [682,930], [1670,930], anchor('VUI','top')], { color: C.amber, width: 2, dash: '10 8', label: '会话状态', labelAt: [1670,930] });
vconnect('R3','RDIRECT', { color: C.amber, width: 2, dash: '10 8', label: '命中候选' });
vconnect('R4','RFAST', { color: C.amber, width: 2, dash: '10 8', label: '命中候选' });
vconnect('R6','RFC', { color: C.amber, width: 2, dash: '10 8', label: '简单候选' });
route([anchor('RDIRECT','bottom'), [3240,1250], [4900,1250], anchor('R7','bottom')], { color: C.amber, width: 2, dash: '10 8' });
route([anchor('RFAST','bottom'), [4020,1260], [4940,1260], anchor('R7','bottom')], { color: C.amber, width: 2, dash: '10 8' });
route([anchor('RFC','bottom'), [4800,1248], [4980,1248], anchor('R7','bottom')], { color: C.amber, width: 2, dash: '10 8' });
vconnect('R2','RAUTH', { color: C.risk, width: 2, dash: '10 8', label: '否' });
vconnect('R7','RREJECT', { color: C.risk, width: 2, dash: '10 8', label: '选择拒识' });

// B. Context governance and Planner / Director.
card('I0', 5680, coreY, 520, 220, '统一输入治理', ['user_query / advisor / tool_feedback', '幂等、顺序、身份与关联编号', '四类输入统一进入 Context'], { fill: C.sage, stroke: C.sageLine });
hconnect('RCOMPLEX','I0', { color: C.blue, width: 4 });
card('GOV1', 5680, 1010, 500, 230, '① 来源与身份隔离', ['用户原话 / 工具结果 / Advisor', '来源、时间与适用身份必须保留'], { fill: C.white, stroke: C.line });
card('GOV2', 6220, 1010, 500, 230, '② 新鲜度与可用性', ['实时值带采集时间与 TTL', '过期 / 失败 / 无权限不能当事实'], { fill: C.white, stroke: C.line });
card('GOV3', 6760, 1010, 500, 230, '③ 冲突与优先级', ['当前回读 > 新工具结果 > 历史', '冲突时记录来源并降级未知'], { fill: C.white, stroke: C.line });
card('GOV4', 7300, 1010, 500, 230, '④ 范围与隐私', ['说话人、座位、车辆、账号', '私有记忆只在授权身份内注入'], { fill: C.white, stroke: C.line });
card('SNAP', 7440, coreY, 520, 220, 'Context 快照', ['本轮已知 / 未知 / 冲突 / 证据', 'env_info＋memory＋goal_list＋VLM', '输入 Planner 前冻结版本'], { fill: C.sage, stroke: C.sageLine });
vconnect('I0','GOV1', { color: C.blue, width: 3 });
hconnect('GOV1','GOV2', { color: C.blue, width: 3 });
hconnect('GOV2','GOV3', { color: C.blue, width: 3 });
hconnect('GOV3','GOV4', { color: C.blue, width: 3 });
route([anchor('GOV4','top'), [7550,950], [7700,950], anchor('SNAP','bottom')], { color: C.blue, width: 3 });

card('CSRC', 5680, 1580, 1040, 330, '四类当前输入', ['① user_query：用户原话　② advisor：顾问建议', '③ tool_feedback：工具结果　④ task / trigger 回调', '优先级：用户请求 > 反馈 / 建议 / 事件', '任何摘要都不能替代原始结果与真实状态'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
card('CFACT', 6760, 1580, 1200, 330, '十二类事实来源', ['来源身份｜车辆 / 媒体｜位置路线｜时间天气', '目标任务｜长期 / 短期记忆｜对话历史｜工具目录', '能力安全｜实时 VLM｜知识检索｜已呈现内容', '每项必须有来源、时间、新鲜度与缺失态'], { fill: C.white, stroke: C.blue, titleSize: 21 });

card('PROMPT', 8030, coreY, 470, 220, '模型调用包', ['SP：角色 / 工具 / 规则', 'UP：当前输入＋近轮历史', '动态注入 Context 快照'], { fill: C.pale, stroke: C.blue });
card('P0', 8030, 1010, 500, 230, 'Planner = Director', ['同一决策职能，只有一个', '完整 Context 后才有复杂决策权'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('P1', 8570, 1010, 500, 230, '意图与约束理解', ['目标、对象、条件、顺序', '识别已知 / 未知与缺槽'], { fill: C.white, stroke: C.blue });
card('P2', 9110, 1010, 500, 230, '任务分解与选工具', ['单步 / 复合 / 多步 / 条件 / 持续', '决定串行、并行和依赖'], { fill: C.white, stroke: C.blue });
card('P3', 9650, 1010, 500, 230, '结果预期与表达', ['定义每步成功证据', '先说什么、何时等反馈再说'], { fill: C.white, stroke: C.blue });
card('POUT', 10220, coreY, 520, 220, 'Planner 候选输出', ['talk_or_not＋talk_content', 'action_list：工具＋参数＋依赖', '候选动作 ≠ 已执行'], { fill: C.pale, stroke: C.blue });
hconnect('SNAP','PROMPT', { color: C.blue, width: 4 });
vconnect('PROMPT','P0', { color: C.blue, width: 3 });
hconnect('P0','P1', { color: C.blue, width: 3 });
hconnect('P1','P2', { color: C.blue, width: 3 });
hconnect('P2','P3', { color: C.blue, width: 3 });
route([anchor('P3','top'), [9900,940], [10480,940], anchor('POUT','bottom')], { color: C.blue, width: 3 });
route([anchor('R5','bottom'), [4020,1540], [8270,1540], anchor('PROMPT','bottom')], { color: C.wip, width: 2, dash: '10 8', label: '仅预热，无执行权', labelAt: [8200,1540] });

card('PAI', 8030, 1580, 2110, 410, 'AI 能力到底指什么', ['理解：消歧、指代、否定、上下文　｜　规划：拆目标、顺序、依赖、并发', '工具选择：能力匹配、参数填充、拒识　｜　反馈理解：读懂部分成功、错误与真实状态', '再规划：换工具、补槽、等待、终止　｜　表达：不抢报完成、不重复播报、可解释', '真正差异不只在模型分数，而在“模型＋Context＋工具协议＋回执＋门禁”的闭环稳定性'], { fill: C.sand, stroke: C.amber, titleSize: 22 });

// C. Five deterministic gates, task split and long-running loop.
const gates = [
  ['V1',10800,'① 字段结构','工具名 / 参数 / 对象','缺参先补齐'],
  ['V2',11170,'② 能力安全','权限 / 车型 / ODD','危险动作置零'],
  ['V3',11540,'③ 依赖并发','拓扑 / 冲突 / 顺序','依赖动作串行'],
  ['V4',11910,'④ 幂等竞态','token / 版本 / 去重','迟到结果不覆盖'],
  ['V5',12280,'⑤ 生命周期','Action / Goal / Task','完成证据聚合'],
];
gates.forEach(([id,x,t,a,b]) => card(id, x, coreY, 330, 240, t, [a,b,'不通过→标准结果'], { fill: C.white, stroke: C.blue, titleSize: 18 }));
hconnect('POUT','V1', { color: C.blue, width: 4 });
for (let i=0;i<gates.length-1;i++) hconnect(gates[i][0],gates[i+1][0], { color: C.blue, width: 4 });
route([anchor('R7','top'), [4900,570], [10965,570], anchor('V1','top')], { color: C.amber, width: 3, label: '被选中的专用 / 快路 / 云简单候选＋唯一令牌', labelAt: [8100,570] });

card('TSPLIT', 12650, coreY, 330, 240, '即时还是持久？', ['即时：本轮或 feedback 分轮', '持久：跨时间保存目标', '多步不等于长期任务'], { fill: C.sand, stroke: C.amber, titleSize: 18 });
hconnect('V5','TSPLIT', { color: C.blue, width: 4 });
card('VGATE_FAIL', 10780, 1010, 2200, 250, '五级门禁失败总线', ['V1–V5 任一级缺参 / 冲突 / 拒绝 / 不可用 / 超时，都禁止下发', '形成原因、缺字段、能否重试、下一步和时间 → ERR → tool_feedback'], { fill: C.riskBg, stroke: C.risk, titleSize: 21 });
route([[10750,950],[12650,950]], { color: C.risk, width: 3, dash: '10 8', arrow: false });
gates.forEach(([id]) => route([anchor(id,'bottom'), [anchor(id,'bottom')[0],950]], { color: C.risk, width: 2, dash: '10 8', arrow: false }));
route([[11700,950], anchor('VGATE_FAIL','top')], { color: C.risk, width: 3, dash: '10 8', label: '任一级未通过' });

card('IMM', 12620, 1300, 620, 240, '即时动作路径', ['本轮直接进入统一执行调度', '多步依赖靠 tool_feedback 分轮', '每轮都重新过门禁'], { fill: C.sage, stroke: C.sageLine });
card('SCHED', 13020, coreY, 520, 240, '统一执行调度器', ['按 action_list 与依赖发起', '分配 execution / action 编号', '只调度，不替代结果判断'], { fill: C.sage, stroke: C.sageLine });
card('X0', 13600, coreY, 680, 240, '工具节点与能力路由', ['tool_name＋params＋对象＋关联编号', '豆包 / 车端 / 生态 / 动态注册 Agent', '注册能力也不能绕过门禁'], { fill: C.sage, stroke: C.sageLine });
route([anchor('TSPLIT','right'), anchor('SCHED','left')], { color: C.blue, width: 4, label: '即时' });
route([anchor('TSPLIT','bottom'), [12815,1270], anchor('IMM','top')], { color: C.blue, width: 3, label: '即时细则' });
route([anchor('IMM','right'), [13250,1420], [13250,930], anchor('SCHED','bottom')], { color: C.blue, width: 3 });
hconnect('SCHED','X0', { color: C.blue, width: 4 });

card('PER', 10900, 1450, 1180, 260, '持久任务路径', ['仅定时 / 条件 / 持续任务跨轮保存；记录目标、条件、作用范围和版本', '当前 Goal 与建设中 Task Service 口径分开，等待不等于完成'], { fill: C.sand, stroke: C.amber, titleSize: 21 });
route([anchor('TSPLIT','bottom'), [12815,1340], [11490,1340], anchor('PER','top')], { color: C.amber, width: 3, label: '跨时间' });
card('GOAL', 10340, 1810, 870, 310, '【当前】Goal / Advisor', ['Goal 保存目标、状态与条件', '静态 / 动态 Advisor 只产建议', '建议仍回同一 Planner 决策', 'Trigger 监听时间 / 状态 / 事件'], { fill: C.sand, stroke: C.amber, titleSize: 21 });
card('TASK', 11270, 1810, 870, 310, '【建设中】Task Service', ['任务=用户 Intent→Planner→Task→Action', '状态：等待 / 运行 / 失败 / 取消 / 完成', '可恢复、版本化、回调和生命周期管理'], { fill: C.wipBg, stroke: C.wip, dash: '10 8', titleSize: 21 });
card('TRIGGER', 10780, 2200, 1100, 320, 'Trigger 条件命中链', ['输入：时间、车态、事件、驾驶、视觉、外部结果', '求值：采样 / 组合 / 时间窗 / 去重 / 语义匹配', '输出：命中 / 未命中 / 未知＋证据；禁止直接调用工具'], { fill: C.sand, stroke: C.amber, titleSize: 21 });
card('RUN', 10780, 2600, 1100, 300, '任务恢复与运行门禁', ['恢复后重新检查版本、幂等、权限、人物、网络与安全状态', '确定性保存动作→调度器；需最新环境判断→统一输入'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('TR_WAIT', 9840, 3000, 900, 250, '未命中 / 未知', ['不创建 Run、不调用工具', 'Goal / Task 保持等待', '写入求值结果与时间'], { fill: C.sand, stroke: C.amber });
card('RUN_FAIL', 10800, 3000, 900, 250, '运行门禁不通过', ['旧版本 / 已关闭 / 重复回调', '权限安全或网络不满足', '形成失败 / 跳过证据'], { fill: C.riskBg, stroke: C.risk });
card('CALLBACK_IN', 11760, 3000, 900, 250, '需要最新环境重判', ['回调作为新的输入事件', '回 I0→Context→同一 Planner', '不得绕过模型或门禁'], { fill: C.pale, stroke: C.blue });
vconnect('PER','GOAL', { color: C.amber, width: 3 });
route([anchor('PER','bottom'), [11490,1770], [11705,1770], anchor('TASK','top')], { color: C.wip, width: 2, dash: '10 8', label: '建设中' });
vconnect('GOAL','TRIGGER', { color: C.amber, width: 3 });
vconnect('TASK','TRIGGER', { color: C.wip, width: 2, dash: '10 8' });
vconnect('TRIGGER','RUN', { color: C.amber, width: 3, label: '命中' });
route([anchor('TRIGGER','left'), [10300,2360], [10300,2970], anchor('TR_WAIT','top')], { color: C.amber, width: 2, dash: '10 8', label: '否 / 未知' });
vconnect('RUN','RUN_FAIL', { color: C.risk, width: 2, dash: '10 8', label: '不通过' });
route([anchor('RUN','right'), [12210,2750], [12210,2970], anchor('CALLBACK_IN','top')], { color: C.blue, width: 3, label: '需重判' });
route([anchor('RUN','right'), [12420,2750], [12420,920], anchor('SCHED','bottom')], { color: C.blue, width: 3, label: '确定性保存动作' });

card('VLM1', 8030, 2150, 1920, 250, 'VLM ① 按需视觉提问', ['Planner→visual_qa→一帧 / 多帧取证→tool_feedback；属于工具调用，不是常驻观察'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
card('VLM2', 8030, 2450, 1920, 250, 'VLM ② 默认常驻视觉', ['带视角、来源、时间与 TTL 的客观观察进入 Context；不能直接执行工具'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
card('VLM3', 8030, 2750, 1920, 250, 'VLM ③ 动态长时观察', ['跨帧判断事件并输出证据报告→Trigger；未命中保持等待，禁止直连工具'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
route([anchor('VLM2','top'), [8990,2050], [7700,2050], anchor('SNAP','bottom')], { color: C.blue2, width: 2, dash: '10 8', label: '带 TTL 的观察事实' });
hconnect('VLM3','TRIGGER', { color: C.blue2, width: 2, dash: '10 8', label: '视觉事件证据' });

// Tool catalogue is reused verbatim from the verified v08 source.
const v08 = await readFile(source, 'utf8');
const toolsMatch = v08.match(/const tools = (\[[\s\S]*?\n\]);\n\nconst toolPos/);
if (!toolsMatch) throw new Error('Unable to load 27-tool catalogue from v08');
const tools = Function(`"use strict"; return (${toolsMatch[1]});`)();
if (tools.length !== 27) throw new Error(`Expected 27 tools, got ${tools.length}`);

const inputTrunkX = 12780;
const resultTrunkX = 16520;
const toolXs = [12880, 14090, 15300];
const toolStartY = 1450;
const rowStep = 380;
const toolW = 1120;
const toolH = 270;
const toolPos = [];
route([anchor('X0','bottom'), [13940,1320], [inputTrunkX,1320], [inputTrunkX,4720]], { color: C.blue, width: 4, arrow: false, label: '统一工具输入总线', labelAt: [13100,1320] });
route([[resultTrunkX,1420],[resultTrunkX,4780]], { color: C.sageLine, width: 4, arrow: false, label: '真实结果总线', labelAt: [resultTrunkX,1385] });

tools.forEach((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = toolXs[col];
  const y = toolStartY + row * rowStep;
  const id = `TOOL${t[0]}`;
  const rowIn = y - 34;
  const rowOut = y + toolH + 28;
  if (col === 0) {
    route([[inputTrunkX,rowIn],[resultTrunkX - 40,rowIn]], { color: C.blue, width: 2, arrow: false });
    route([[inputTrunkX,rowOut],[resultTrunkX,rowOut]], { color: C.sageLine, width: 2, arrow: false });
  }
  card(id, x, y, toolW, toolH, `${t[0]}｜${t[1]}（${t[2]}）`, t.slice(3), {
    fill: row % 2 ? C.white : C.paper,
    stroke: col === 2 ? C.sageLine : C.blue,
    titleSize: 18, lineSize: 16, lineGap: 25, lastRisk: true,
  });
  route([[x + toolW / 2,rowIn],[x + toolW / 2,y]], { color: C.blue, width: 2 });
  route([[x + toolW / 2,y + toolH],[x + toolW / 2,rowOut]], { color: C.sageLine, width: 2, arrow: false });
  toolPos.push({ id, x, y, row, col });
});

const tool15 = toolPos.find(t => t.id === 'TOOL15');
route([anchor('VLM1','bottom'), [8990,4900], [16600,4900], [16600,tool15.y + toolH/2], anchor('TOOL15','right')], { color: C.blue2, width: 2, dash: '10 8', label: '按需视觉指定 TOOL15', labelAt: [16520,4900] });

card('X1', 12880, 5000, 1120, 250, '原始执行结果', ['请求被受理、端侧回执、外部返回、产物或错误', '“服务调用成功”不等于车辆 / 导航 / 媒体真实生效'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('X2', 14090, 5000, 1120, 250, '真实状态回读', ['读取设备最终值、导航阶段、实际播放、订单终态、生成产物', '定义 observed_state；不能回读时明确证据等级'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('X3', 15300, 5000, 1120, 560, '统一结果格式', ['状态：成功 / 失败 / 部分成功 / 超时 / 取消 / 需补信息', '证据：真实状态 / 产物 / 已播内容 / 来源 / 时间', '建议：错误码 / 能否重试 / 缺失字段 / 下一步', '关联：request / turn / action / task / run / callback', '输出：tool_feedback＋完成证据'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
card('XFAKE', 12880, 5600, 2330, 330, '四层成功语义与常见假成功', ['① 请求被接收　② 服务调用成功　③ 真实状态生效　④ 用户完整目标完成', '假成功：接口成功就说完成；搜到但没播放；生成已受理但无产物；出现付款页就说已缴费', '原始结果＋真实回读必须共同进入统一反馈；任何一层都不能越级替代下一层'], { fill: C.riskBg, stroke: C.risk, titleSize: 22 });
route([[resultTrunkX,4780],[13440,4780],anchor('X1','top')], { color: C.sageLine, width: 4 });
hconnect('X1','X2', { color: C.sageLine, width: 4 });
hconnect('X1','X3', { color: C.sageLine, width: 2, dash: '10 8', label: '原始结果' });
hconnect('X2','X3', { color: C.sageLine, width: 4, label: '状态回读' });

// D. Feedback, completion gate and user-facing outputs.
card('ERR', 16680, 1100, 1500, 300, '全链异常归一化', ['输入 / Context / 决策 / 门禁 / 执行 / 时序异常统一收口', '形成结果、错误码、能否重试、真实状态和时间', '异常也必须进入 feedback，不能在模块边界静默丢失'], { fill: C.riskBg, stroke: C.risk, titleSize: 22 });
card('FB0', 16680, 4400, 1500, 280, '形成 tool_feedback', ['它是新的输入事件，不是模型内部隐藏返回值', '工具名＋结果＋真实状态＋错误＋产物＋时间＋关联编号', '回统一输入治理，重建 Context，再调同一 Planner'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
card('CORR', 16680, 4740, 1500, 260, '结果关联与迟到保护', ['用 action_id / execution_token 识别这是谁的结果', '重复回调、旧版本、取消后迟到结果不得覆盖新状态'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('TASKUP', 16680, 5060, 1500, 280, 'Task / Goal / Action 状态写回', ['成功推进子目标；部分成功保留已成分支；等待回等待态', '终态按策略关闭并清理 Trigger / Binding；保留追踪证据'], { fill: C.wipBg, stroke: C.wip, dash: '10 8', titleSize: 21 });
card('EVID', 16680, 5400, 1500, 280, '【目标架构 / 待验真】完成证据聚合', ['聚合必要子目标、真实状态、待执行动作、等待任务与拒绝证据', '证据不足禁止输出“完成”；不替代 Planner 的语义判断'], { fill: C.sand, stroke: C.amber, dash: '10 8', titleSize: 21 });
card('STATUS', 16680, 5740, 1500, 280, '完整目标当前处于哪种互斥状态？', ['同一 Planner 基于最新 Context＋完成证据判断', '继续 / 等待 / 完成 / 失败收口四选一；空 action_list 不是完成'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('ST_PENDING', 16680, 6080, 720, 280, '继续 / 部分成功', ['补槽、换工具或安全重试', '生成新 action_list', '重新过 V1–V5'], { fill: C.pale, stroke: C.blue });
card('ST_WAIT', 17460, 6080, 720, 280, '等待中', ['等待时间 / 状态 / 用户补充', '回 Goal / Task 等待态', 'Trigger 命中后恢复'], { fill: C.sand, stroke: C.amber });
card('ST_DONE', 16680, 6420, 720, 280, '完成', ['必要子目标均有真实证据', '无必需待执行动作', '进入最终输出编排'], { fill: C.sage, stroke: C.sageLine });
card('ST_END', 17460, 6420, 720, 280, '失败 / 取消 / 过期', ['说明已成、未成与原因', '停止危险或无意义重试', '仍进入输出编排'], { fill: C.riskBg, stroke: C.risk });

route([anchor('X3','right'), [16550,5280], [16550,4540], anchor('FB0','left')], { color: C.sageLine, width: 4, label: '真实结果' });
vconnect('FB0','CORR', { color: C.sageLine, width: 4 });
vconnect('CORR','TASKUP', { color: C.sageLine, width: 4 });
vconnect('TASKUP','EVID', { color: C.sageLine, width: 4 });
vconnect('EVID','STATUS', { color: C.sageLine, width: 4 });
route([anchor('STATUS','bottom'), [17040,6050], anchor('ST_PENDING','top')], { color: C.blue, width: 3, label: '继续' });
route([anchor('STATUS','bottom'), [17820,6050], anchor('ST_WAIT','top')], { color: C.amber, width: 3, label: '等待' });
route([anchor('STATUS','bottom'), [17040,6390], anchor('ST_DONE','top')], { color: C.sageLine, width: 3, label: '完成' });
route([anchor('STATUS','bottom'), [17820,6390], anchor('ST_END','top')], { color: C.risk, width: 3, label: '收口' });

// Physical return loops.
route([anchor('FB0','bottom'), [17430,7860], [5940,7860], anchor('I0','bottom')], { color: C.sageLine, width: 5, label: '第 2 / N 轮：tool_feedback 回统一输入→重建 Context→同一 Planner', labelAt: [11200,7860] });
route([anchor('CALLBACK_IN','bottom'), [12210,7750], [5980,7750], anchor('I0','bottom')], { color: C.blue, width: 3, label: '跨时间回调作为新输入', labelAt: [8300,7750] });
route([anchor('ST_PENDING','bottom'), [17040,7660], [10965,7660], anchor('V1','bottom')], { color: C.blue, width: 3, label: '新 action_list 再过门禁', labelAt: [13800,7660] });
route([anchor('ST_WAIT','bottom'), [17820,7580], [11490,7580], anchor('PER','bottom')], { color: C.amber, width: 3, label: '保存等待条件', labelAt: [14500,7580] });
route([anchor('TR_WAIT','bottom'), [10290,7470], [17000,7470], anchor('TASKUP','bottom')], { color: C.amber, width: 2, dash: '10 8', label: '等待状态证据', labelAt: [15400,7470] });
route([anchor('RUN_FAIL','bottom'), [11250,7380], [17430,7380], anchor('FB0','bottom')], { color: C.risk, width: 2, dash: '10 8', label: '失败 / 跳过证据', labelAt: [15500,7380] });
route([anchor('VGATE_FAIL','right'), [16480,1135], [16480,4200], [17430,4200], anchor('ERR','bottom')], { color: C.risk, width: 2, dash: '10 8', label: '门禁标准结果', labelAt: [16480,4100] });
route([anchor('ERR','bottom'), [17430,4320], anchor('FB0','top')], { color: C.risk, width: 3, dash: '10 8' });
route([anchor('TASKUP','bottom'), [17430,7280], [11050,7280], anchor('GOAL','bottom')], { color: C.wip, width: 2, dash: '10 8', label: '写回 Goal / Task / Action', labelAt: [14200,7280] });
route([anchor('TASKUP','bottom'), [17430,7220], [11705,7220], anchor('TASK','bottom')], { color: C.wip, width: 2, dash: '10 8' });
route([anchor('POUT','bottom'), [10480,7120], [16900,7120], anchor('EVID','bottom')], { color: C.amber, width: 2, dash: '10 8', label: 'Planner 声明的预期结果', labelAt: [13700,7120] });

card('O0', 18420, 6100, 1400, 300, '本轮输出编排', ['什么时候说、显示什么、形象呈现什么、实体状态如何证明', 'talk_content、任务 / 工具状态、形象动作与可操作卡片必须一致'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
card('O1', 18420, 6460, 670, 280, '语音路', ['TTS / 提示音 / 进度播报', '避免抢报完成与重复播报'], { fill: C.white, stroke: C.blue });
card('O2', 19150, 6460, 670, 280, '界面路', ['桌面 / 小窗 / 卡片 / 任务中心', '呈现事实、状态与下一步'], { fill: C.white, stroke: C.blue });
card('O3', 18420, 6800, 670, 280, '形象路', ['emoji_id / 动作 / 机器人', '与语义、情绪和实体状态一致'], { fill: C.white, stroke: C.blue });
card('O4', 19150, 6800, 670, 280, '实体证据路', ['车机、导航、媒体、订单终态', '这里只呈现已发生事实'], { fill: C.sage, stroke: C.sageLine });
card('O5', 18420, 7140, 1400, 430, '用户最终感知：听到、看到、车辆或服务真的发生', ['完成：播报目标完成并给可复核证据', '继续：说明已完成部分和正在做什么', '等待：说明等待条件与恢复方式；失败：说明原因与补救', '最终体验指标是整条业务链，而不是单一模型答题分数'], { fill: C.sage, stroke: C.sageLine, titleSize: 22 });
route([anchor('ST_DONE','right'), [18380,6560], anchor('O0','left')], { color: C.sageLine, width: 3, label: '完成' });
route([anchor('ST_END','right'), [18380,6610], anchor('O0','left')], { color: C.risk, width: 3, label: '失败收口' });
route([anchor('ST_PENDING','right'), [18340,6220], anchor('O0','left')], { color: C.blue, width: 2, dash: '10 8', label: '进度提示' });
route([anchor('ST_WAIT','right'), [18360,6260], anchor('O0','left')], { color: C.amber, width: 2, dash: '10 8', label: '等待提示' });
vconnect('O0','O1', { color: C.blue, width: 2 });
route([anchor('O0','bottom'), [19485,6430], anchor('O2','top')], { color: C.blue, width: 2 });
vconnect('O1','O3', { color: C.blue, width: 2 });
vconnect('O2','O4', { color: C.sageLine, width: 2 });
route([anchor('O3','bottom'), [18755,7110], [19120,7110], anchor('O5','top')], { color: C.sageLine, width: 3 });
route([anchor('O4','bottom'), [19485,7110], [19120,7110], anchor('O5','top')], { color: C.sageLine, width: 3 });

// Authentication, rejection, input error and VUI state all have physical output exits.
route([anchor('RAUTH','top'), [2810,580], [19880,580], [19880,6250], anchor('O0','right')], { color: C.risk, width: 2, dash: '10 8', label: '认证提示', labelAt: [19880,6000] });
route([anchor('RREJECT','top'), [5120,600], [19840,600], [19840,6210], anchor('O0','right')], { color: C.risk, width: 2, dash: '10 8', label: '拒识 / 澄清', labelAt: [19840,5900] });
route([anchor('UERR','top'), [640,560], [19920,560], [19920,6290], anchor('O0','right')], { color: C.risk, width: 2, dash: '10 8' });
route([anchor('VUI','top'), [1670,620], [19960,620], [19960,6600], anchor('O1','right')], { color: C.amber, width: 2, dash: '10 8', label: '播报 / 打断状态', labelAt: [19960,6400] });

// Metrics and product mastery band.
rect(80, 8020, 19840, 1700, C.paper2, C.blue, 1.5, 18, bgSvg);
rect(110, 8050, 64, 64, C.blue, C.blue, 1, 32);
text(142, 8093, '09', 20, 800, C.white, 'middle');
text(198, 8085, '全链指标、关键问题与产品经理掌握深度', 28, 850, C.ink);
text(198, 8122, '不是背模块名：要能用一条 Trace 判断“错在哪、谁负责、怎么验收、为什么影响用户”。', 18, 550, C.muted);

card('M1', 140, 8190, 2900, 480, '① 入口与路由指标', ['ASR 字错率 / 否定数字保真 / 端点截断 / 说话人座位正确率', '快路命中率 / 错命中率 / 端云冲突率 / 唯一令牌违例率', '关键问题：为什么走这条路？另一候选为何被丢弃？是否出现双执行？'], { fill: C.white, stroke: C.blue, titleSize: 22 });
card('M2', 3100, 8190, 2900, 480, '② Context 与模型指标', ['Context 完整率 / 新鲜度 / 冲突未解率 / 记忆误注入率', '意图正确率 / 任务拆解正确率 / 工具选择与参数正确率', '关键问题：模型错，还是输入缺失？缺哪条证据会改变 Planner 判断？'], { fill: C.white, stroke: C.blue, titleSize: 22 });
card('M3', 6060, 8190, 2900, 480, '③ 门禁、工具与执行指标', ['非法 action 拦截率 / 依赖拓扑正确率 / 重复执行率 / 迟到覆盖率', '工具调用成功率 / 真实生效率 / 状态回读覆盖率 / P50-P95-P99 延时', '关键问题：工具有多少？每个输入、机制、证据、门禁和降级是什么？'], { fill: C.white, stroke: C.blue, titleSize: 22 });
card('M4', 9020, 8190, 2900, 480, '④ 反馈、任务与输出指标', ['feedback 关联正确率 / 再规划成功率 / 假完成率 / 等待恢复率', 'Task / Goal 状态一致率 / Trigger 漏触发误触发 / VUI 打断恢复率', '关键问题：何时继续、等待、完成或失败？用户能否验证真实结果？'], { fill: C.white, stroke: C.blue, titleSize: 22 });
card('M5', 11980, 8190, 2900, 480, '⑤ Badcase 根因树', ['先查链路：走错入口 / 路由 / 回调丢失　→ 再查工具协议与参数', '再查 Context：事实缺失 / 过期 / 身份错　→ 最后才归模型能力', '根因必须落到责任模块、证据、修复动作与回归集，不能只写“模型不稳定”'], { fill: C.riskBg, stroke: C.risk, titleSize: 22 });
card('M6', 14940, 8190, 4840, 480, '⑥ 你需要深入到什么程度，为什么', ['主链：能从任一 badcase 复述输入→判断→action_list→执行→feedback→下一轮状态；因为你要主持跨团队定位。', '工具：27 项逐个讲清边界和完成证据；因为 AI 的能力最终受可调用世界与回执质量约束。', '指标：能为每段定义正确率、延时、假完成和恢复率；因为“模型更强”必须落到用户可感知收益。'], { fill: C.sand, stroke: C.amber, titleSize: 22 });

card('PM1', 140, 8750, 3900, 650, '产品经理的四级掌握标准', ['L1 会画：知道模块顺序与责任人', 'L2 会解释：每个模块的输入、输出、判断条件、失败出口', 'L3 会定位：拿 Trace 区分链路 / 工具 / Context / 模型根因', 'L4 会改进：写验收口径、指标、回归集与跨团队拍板问题', '达到 L3 才算真正“懂链路”；达到 L4 才能判断两年内继续深耕还是离开'], { fill: C.pale, stroke: C.blue, titleSize: 23 });
card('PM2', 4120, 8750, 5220, 650, '逐模块必须追问的最小问题集', ['谁负责？在哪里发生？输入来自谁、结构是什么？输出给谁？', '判断条件和优先级是什么？成功的真实证据是什么？超时 / 缺参 / 冲突 / 无权限怎么办？', '是否幂等？迟到结果怎么处理？是否跨轮保存？何时算完成、等待、取消或过期？', '当前已上线、建设中、建议方案分别是什么？不能把会议设想写成线上事实。'], { fill: C.white, stroke: C.blue, titleSize: 23 });
card('PM3', 9420, 8750, 4700, 650, '判断 AI 能力不能只看模型', ['端侧 / 云端模型决定理解与规划上限；Context 决定模型看到什么；工具决定能做什么', '门禁决定是否敢执行；真实回读决定是否知道做成；feedback 决定能否继续完成复杂目标', '因此核心指标应是完整任务成功率、真实生效率、假完成率、恢复率和端到端时延，而非只看单轮意图准确率。'], { fill: C.sage, stroke: C.sageLine, titleSize: 23 });
card('PM4', 14200, 8750, 5580, 650, '接下来 90 天的主线', ['第 1–3 周：选 20 条真实 Trace，把每条链路节点、工具、状态和异常补齐', '第 4–6 周：建立 27 工具能力账本与完成证据；补出最常见 50 个 badcase 根因树', '第 7–10 周：牵头一个闭环指标，例如假完成率或多步完成率，推动协议 / Context / 门禁联合改造', '第 11–13 周：形成可复用评审清单和回归集；用数据证明你不只“了解 Planner”，而是能提升整条 Agent 链路'], { fill: C.sand, stroke: C.amber, titleSize: 23 });

// Trace anchors connect metrics to representative stages.
route([[2600,8150],[2600,7900]], { color: C.blue2, width: 2, dash: '8 8', arrow: false });
route([[7500,8150],[7500,7900]], { color: C.blue2, width: 2, dash: '8 8', arrow: false });
route([[14500,8150],[14500,7900]], { color: C.blue2, width: 2, dash: '8 8', arrow: false });
route([[17400,8150],[17400,7900]], { color: C.blue2, width: 2, dash: '8 8', arrow: false });
rect(16100, 7940, 2800, 42, C.white, C.blue2, 1, 10);
text(17500, 7969, '统一 Trace：request → turn → action → execution → task / run → callback → output', 17, 750, C.blue2, 'middle');

// Legend.
rect(80, 9450, 19840, 250, C.white, C.line, 1, 14, bgSvg);
text(120, 9490, '图例', 19, 800, C.ink);
const legend = [
  [400, C.blue, '', '主请求与确定性执行'],
  [2550, C.sageLine, '', '真实结果与 feedback'],
  [4700, C.amber, '10 8', '等待 / Advisor / Trigger'],
  [6900, C.wip, '10 8', '建设中 / 待验真'],
  [9100, C.risk, '10 8', '异常 / 拒绝 / 失败'],
];
legend.forEach(([x,color,dash,label]) => {
  edgeSvg.push(`<line x1="${x}" y1="9535" x2="${x+520}" y2="9535" stroke="${color}" stroke-width="4"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`);
  text(x + 560, 9542, label, 17, 650, C.muted);
});
text(120, 9638, '事实边界：Planner=Director 是同一决策职能；Goal / Advisor / Trigger 为当前机制；Task Service 与完成证据聚合按建设中 / 待验真标注。', 17, 650, C.ink);
text(120, 9675, '工具口径：本图按 27 项当前目录；每卡均含输入、机制、完成证据和门禁。工具调用成功不能替代真实状态回读。', 17, 650, C.risk);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L12,6 L0,12 Z" fill="context-stroke"/>
    </marker>
  </defs>
  <g id="background">${bgSvg.join('')}</g>
  <g id="edges">${edgeSvg.join('')}</g>
  <g id="nodes">${nodeSvg.join('')}</g>
  <g id="overlays">${overlaySvg.join('')}</g>
</svg>`;

await writeFile(output, svg, 'utf8');
console.log(JSON.stringify({ output, width: W, height: H, cards: nodes.size, connectors: edgeSvg.length, toolCount: tools.length }, null, 2));
