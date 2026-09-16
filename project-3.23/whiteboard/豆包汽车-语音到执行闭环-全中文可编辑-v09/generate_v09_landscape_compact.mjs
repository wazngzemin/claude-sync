import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('./diagram-v09-landscape-compact.svg', import.meta.url));
const source = fileURLToPath(new URL('../豆包汽车-语音到执行闭环-全中文可编辑-v08/generate_v08_final_flow.mjs', import.meta.url));
const W = 20000;
const H = 8500;

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
  // Whiteboard review requires Manhattan routing. Normalize every caller-supplied
  // segment so later layout edits can never introduce a diagonal connector.
  const orthogonal = [];
  points.forEach((p, i) => {
    if (i > 0) {
      const prev = orthogonal[orthogonal.length - 1];
      if (prev[0] !== p[0] && prev[1] !== p[1]) orthogonal.push([p[0], prev[1]]);
    }
    const prev = orthogonal[orthogonal.length - 1];
    if (!prev || prev[0] !== p[0] || prev[1] !== p[1]) orthogonal.push(p);
  });
  edgeSvg.push(`<polyline points="${orthogonal.map(p => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}${arrow ? ' marker-end="url(#arrow)"' : ''}/>`);
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
  [12840, 4280, '06', '工具与真实执行', '统一入口→27 工具→真实回读'],
  [17120, 2800, '07', '输出、指标与用户感知', '完成证据→四路输出→全链评测'],
];
stages.forEach(([x, w, n, t, s], i) => {
  // Stage columns stop above the cross-time band. The bottom timeline has its
  // own ownership semantics and must not be read as belonging to voice/routing.
  rect(x, 520, w, 4880, i % 2 ? C.paper2 : C.paper, C.line, 1, 0, bgSvg);
  stageHeader(x, w, n, t, s, i === 4 ? C.pale : C.white);
});

const bands = [
  [520, 2600, 'A｜用户请求沿主链逐步下沉：语音→路由→Context→Planner→门禁→调度', C.white],
  [3180, 2220, 'B｜27 工具能力层：统一输入总线→每个工具→真实结果总线', '#FAF9F6'],
  [5400, 2900, 'C｜真实反馈、长期任务、再次规划、完成判断与评测', '#F5F8F6'],
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
const routeY = 720;
const contextY = 950;
const promptY = 1200;
const plannerY = 1450;
const actionY = 1750;
const gateY = 2050;
const dispatchY = 2350;
card('U1', 150, coreY, 310, 220, '用户发声', ['原始音频与声区', '指代 / 否定 / 时间', '可能包含插话与打断'], { fill: C.white, stroke: C.blue });
card('U2', 505, coreY, 355, 220, '唤醒与会话门', ['唤醒 / 免唤醒 / 权限', '播报中是插话还是延续', '失败必须有明确出口'], { fill: C.pale, stroke: C.blue });
card('U3', 905, coreY, 355, 220, '声学前处理', ['降噪 / 回声 / 波束', '多人声分离与端点检测', '输出声区＋时间戳'], { fill: C.pale, stroke: C.blue });
card('U4', 1305, coreY, 370, 220, '语音识别 ASR', ['增量文本→最终文本', '保真否定 / 数字 / 地点', '输出置信度与说话人'], { fill: C.pale, stroke: C.blue });
card('U5', 1720, coreY, 520, 220, '统一 user_query', ['query＋speaker_name＋position', 'timestamp＋goal_list＋env_info', '补齐 request / trace / turn 编号'], { fill: C.sage, stroke: C.sageLine });
card('R1', 2310, routeY, 340, 220, '接入网关', ['校验结构 / 会话 / 车型', '统一车企协议', '写入全链 Trace'], { fill: C.pale, stroke: C.blue });
card('R2', 2695, routeY, 340, 220, '身份通过？', ['否：只给认证提示', '不读取私有 Context', '是：继续路由']);
card('R3', 3080, routeY, 340, 220, '专用模块？', ['Direct / 注册 Agent', '命中仍需统一门禁', '未指定继续快路']);
card('R4', 3465, routeY, 340, 220, '句法快路？', ['端侧 RAG / 小模型', '高置信低风险指令', '未命中继续上云']);
card('R5', 3850, routeY, 340, 220, '并行准备', ['预取 Context 与能力', 'Planner 可预热降时延', '完整 Context 前无执行权']);
card('R6', 4235, routeY, 340, 220, '云 FC 分流', ['简单 / 复杂 / 拒识', '分类结果不可直接执行', '复杂交给 Planner']);
card('R7', 4620, routeY, 570, 220, '端云唯一裁决', ['专用 / 快路 / 云简单 / 拒识 / 复杂', '一轮只签发一个 execution_token', '迟到候选丢弃并记录原因'], { fill: C.sage, stroke: C.sageLine });
card('RCOMPLEX', 5240, routeY, 390, 220, '复杂路径', ['需要知识 / 多步 / 记忆', '进入统一输入治理', '再形成完整 Context'], { fill: C.pale, stroke: C.blue });

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
card('I0', 5680, contextY, 520, 220, '统一输入治理', ['user_query / advisor / tool_feedback / event', 'event 来源含 Task / Trigger callback', '幂等、顺序、身份与关联编号'], { fill: C.sage, stroke: C.sageLine });
hconnect('RCOMPLEX','I0', { color: C.blue, width: 4 });
card('GOV1', 5680, 1250, 500, 230, '① 来源与身份隔离', ['用户原话 / 工具结果 / Advisor', '来源、时间与适用身份必须保留'], { fill: C.white, stroke: C.line });
card('GOV2', 6220, 1250, 500, 230, '② 新鲜度与可用性', ['实时值带采集时间与 TTL', '过期 / 失败 / 无权限不能当事实'], { fill: C.white, stroke: C.line });
card('GOV3', 6760, 1250, 500, 230, '③ 冲突与优先级', ['当前回读 > 新工具结果 > 历史', '冲突时记录来源并降级未知'], { fill: C.white, stroke: C.line });
card('GOV4', 7300, 1250, 500, 230, '④ 范围与隐私', ['说话人、座位、车辆、账号', '私有记忆只在授权身份内注入'], { fill: C.white, stroke: C.line });
card('SNAP', 7440, contextY, 520, 220, 'Context 快照', ['本轮已知 / 未知 / 冲突 / 证据', 'env_info＋memory＋goal_list＋VLM', '输入 Planner 前冻结版本'], { fill: C.sage, stroke: C.sageLine });
vconnect('I0','GOV1', { color: C.blue, width: 3 });
hconnect('GOV1','GOV2', { color: C.blue, width: 3 });
hconnect('GOV2','GOV3', { color: C.blue, width: 3 });
hconnect('GOV3','GOV4', { color: C.blue, width: 3 });
route([anchor('GOV4','top'), [7550,1200], [7700,1200], anchor('SNAP','bottom')], { color: C.blue, width: 3 });

card('CSRC', 5680, 1580, 1040, 330, '四类当前输入', ['① user_query：用户原话　② advisor：顾问建议', '③ tool_feedback：已关联工具结果　④ event：系统事件', 'Task / Trigger callback 都是 event 的具体来源', '任何摘要都不能替代原始结果与真实状态'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
card('CFACT', 6760, 1580, 1200, 330, '十二类事实来源', ['来源身份｜车辆 / 媒体｜位置路线｜时间天气', '目标任务｜长期 / 短期记忆｜对话历史｜工具目录', '能力安全｜实时 VLM｜知识检索｜已呈现内容', '每项必须有来源、时间、新鲜度与缺失态'], { fill: C.white, stroke: C.blue, titleSize: 21 });

card('PROMPT', 8030, promptY, 470, 220, '模型调用包', ['SP：角色 / 工具 / 规则', 'UP：当前输入＋近轮历史', '动态注入 Context 快照'], { fill: C.pale, stroke: C.blue });
card('P0', 8030, plannerY, 500, 230, 'Planner = Director', ['同一决策职能，只有一个', '完整 Context 后才有复杂决策权'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('P1', 8570, plannerY, 500, 230, '意图与约束理解', ['目标、对象、条件、顺序', '识别已知 / 未知与缺槽'], { fill: C.white, stroke: C.blue });
card('P2', 9110, plannerY, 500, 230, '任务分解与选工具', ['单步 / 复合 / 多步 / 条件 / 持续', '决定串行、并行和依赖'], { fill: C.white, stroke: C.blue });
card('P3', 9650, plannerY, 500, 230, '结果预期与表达', ['定义每步成功证据', '先说什么、何时等反馈再说'], { fill: C.white, stroke: C.blue });
card('POUT', 10220, actionY, 520, 220, 'Planner 候选输出', ['talk_or_not＋talk_content', 'action_list：工具＋参数＋依赖', '候选动作 ≠ 已执行'], { fill: C.pale, stroke: C.blue });
hconnect('SNAP','PROMPT', { color: C.blue, width: 4 });
vconnect('PROMPT','P0', { color: C.blue, width: 3 });
hconnect('P0','P1', { color: C.blue, width: 3 });
hconnect('P1','P2', { color: C.blue, width: 3 });
hconnect('P2','P3', { color: C.blue, width: 3 });
route([anchor('P3','right'), [10180,1565], [10180,1860], anchor('POUT','left')], { color: C.blue, width: 3 });
route([anchor('R5','bottom'), [4020,1540], [8270,1540], anchor('PROMPT','bottom')], { color: C.wip, width: 2, dash: '10 8', label: '仅预热，无执行权', labelAt: [8200,1540] });

card('PAI', 8030, 2050, 2110, 410, 'AI 能力到底指什么', ['理解：消歧、指代、否定、上下文　｜　规划：拆目标、顺序、依赖、并发', '工具选择：能力匹配、参数填充、拒识　｜　反馈理解：读懂部分成功、错误与真实状态', '再规划：换工具、补槽、等待、终止　｜　表达：不抢报完成、不重复播报、可解释', '真正差异不只在模型分数，而在“模型＋Context＋工具协议＋回执＋门禁”的闭环稳定性'], { fill: C.sand, stroke: C.amber, titleSize: 22 });

// C. Five deterministic gates, task split and long-running loop.
const gates = [
  ['V1',10800,'① 字段结构','工具名 / 参数 / 对象','缺参先补齐'],
  ['V2',11170,'② 能力安全','权限 / 车型 / ODD','危险动作置零'],
  ['V3',11540,'③ 依赖并发','拓扑 / 冲突 / 顺序','依赖动作串行'],
  ['V4',11910,'④ 幂等竞态','token / 版本 / 去重','迟到结果不覆盖'],
  ['V5',12280,'⑤ 生命周期 / 结果聚合','Action / Goal 当前状态','定义关联与结果口径'],
];
gates.forEach(([id,x,t,a,b]) => card(id, x, gateY, 330, 240, t, [a,b,'不通过→标准结果'], { fill: C.white, stroke: C.blue, titleSize: 18 }));
hconnect('POUT','V1', { color: C.blue, width: 4, label: '有新 action_list' });
for (let i=0;i<gates.length-1;i++) hconnect(gates[i][0],gates[i+1][0], { color: C.blue, width: 4 });
route([anchor('R7','top'), [4900,570], [10965,570], anchor('V1','top')], { color: C.amber, width: 3, label: '被选中的专用 / 快路 / 云简单候选＋唯一令牌', labelAt: [8100,570] });

card('TSPLIT', 12650, gateY, 330, 240, '即时还是持久？', ['即时：本轮或 feedback 分轮', '持久：跨时间保存目标', '多步不等于长期任务'], { fill: C.sand, stroke: C.amber, titleSize: 18 });
hconnect('V5','TSPLIT', { color: C.blue, width: 4 });
card('VGATE_FAIL', 10780, 2520, 2200, 250, '五级门禁失败总线', ['V1–V5 任一级缺参 / 冲突 / 拒绝 / 不可用 / 超时，都禁止下发', '形成原因、缺字段、能否重试、下一步和时间 → ERR → tool_feedback'], { fill: C.riskBg, stroke: C.risk, titleSize: 21 });
route([[10750,2380],[12650,2380]], { color: C.risk, width: 3, dash: '10 8', arrow: false });
gates.forEach(([id]) => route([anchor(id,'bottom'), [anchor(id,'bottom')[0],2380]], { color: C.risk, width: 2, dash: '10 8', arrow: false }));
route([[11700,2380], anchor('VGATE_FAIL','top')], { color: C.risk, width: 3, dash: '10 8', label: '任一级未通过' });

card('IMM', 13020, 2840, 1260, 240, '即时动作路径', ['本轮直接进入统一执行调度；多步依赖靠 tool_feedback 分轮', '每轮新 action_list 都重新经过 V1–V5'], { fill: C.sage, stroke: C.sageLine });
card('SCHED', 13020, dispatchY, 520, 240, '统一执行调度器', ['按 action_list 与依赖发起', '分配 execution / action 编号', '只调度，不替代结果判断'], { fill: C.sage, stroke: C.sageLine });
card('X0', 13600, dispatchY, 680, 240, '工具节点与能力路由', ['tool_name＋params＋对象＋关联编号', '豆包 / 车端 / 生态 / 动态注册 Agent', '注册能力也不能绕过门禁'], { fill: C.sage, stroke: C.sageLine });
route([anchor('TSPLIT','bottom'), [12815,2810], anchor('IMM','left')], { color: C.blue, width: 3, label: '即时细则' });
route([anchor('IMM','top'), [13650,2780], [13280,2780], anchor('SCHED','bottom')], { color: C.blue, width: 3 });
hconnect('SCHED','X0', { color: C.blue, width: 4 });

// C1. Independent cross-time timeline. It begins under the gate/tool area and
// never folds back into the voice or routing stages above.
card('PER', 10450, 5520, 1200, 300, '① 持久化', ['仅定时 / 条件 / 持续任务', '保存目标、条件、范围、版本', '等待不等于失败或完成'], { fill: C.sand, stroke: C.amber, titleSize: 21 });
route([anchor('TSPLIT','bottom'), [12815,5400], [11050,5400], anchor('PER','top')], { color: C.amber, width: 3, label: '跨时间进入独立时间线', labelAt: [11900,5400] });
card('GOAL', 11720, 5520, 1300, 360, '②A【当前】Goal / Advisor', ['Goal 保存目标、状态与条件', 'Advisor 只产建议并回 Planner', 'Trigger 监听时间 / 状态 / 事件'], { fill: C.sand, stroke: C.amber, titleSize: 20 });
card('TASK', 11720, 5930, 1300, 300, '②B【目标架构】Task', ['Task / Run / Action 生命周期', '可恢复、版本化、回调', '替代演进，非默认双写'], { fill: C.wipBg, stroke: C.wip, dash: '10 8', titleSize: 20 });
card('TRIGGER', 13080, 5520, 1450, 360, '③ Trigger 条件求值', ['时间 / 车态 / 驾驶 / 视觉 / 外部事件', '采样 / 组合 / 时间窗 / 去重 / 语义匹配', '只产命中 / 未命中 / 未知＋证据'], { fill: C.sand, stroke: C.amber, titleSize: 21 });
card('RUN', 14590, 5520, 1250, 360, '④ 恢复与 Run 门禁', ['重查版本、幂等、权限、人物', '网络、安全与最新车辆状态', '通过后才可直调或重判'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('RUN_DIRECT', 15900, 5520, 1100, 280, '⑤A 确定性直调', ['保存的动作仍有效', '进入统一调度器', '不重复生成动作'], { fill: C.sage, stroke: C.sageLine, titleSize: 20 });
card('CALLBACK_IN', 15900, 5850, 1100, 310, '⑤B 最新环境重判', ['callback 作为 event', '回 I0→Context→Planner', '不得绕过唯一裁决与门禁'], { fill: C.pale, stroke: C.blue, titleSize: 20 });
card('TR_WAIT', 13080, 5930, 1450, 260, '未命中：保持等待', ['不创建 Run、不调用工具', '仅记录求值证据并结束本次求值', '不进入 feedback，不唤醒 Context / Planner'], { fill: C.sand, stroke: C.amber });
card('RUN_FAIL', 14590, 5930, 1250, 260, 'Run 门禁不通过', ['旧版本 / 已关闭 / 重复回调', '权限、安全、人物或网络不满足', '形成失败 / 跳过 feedback'], { fill: C.riskBg, stroke: C.risk });
hconnect('PER','GOAL', { color: C.amber, width: 3, label: '当前' });
route([anchor('PER','top'), [11050,5480], [13040,5480], [13040,6080], anchor('TASK','right')], { color: C.wip, width: 2, dash: '10 8', label: '目标替代', labelAt: [12200,5480] });
hconnect('GOAL','TRIGGER', { color: C.amber, width: 3, label: '规则 / 订阅' });
hconnect('TASK','TRIGGER', { color: C.wip, width: 2, dash: '10 8', label: '目标任务绑定' });
hconnect('TRIGGER','RUN', { color: C.amber, width: 3, label: '命中' });
vconnect('TRIGGER','TR_WAIT', { color: C.amber, width: 2, dash: '10 8', label: '未命中' });
route([anchor('TRIGGER','top'), [13805,5450], [17040,5450], [17040,6005], anchor('CALLBACK_IN','right')], { color: C.blue, width: 2, dash: '10 8', label: '未知且需补信息 / 重判→event', labelAt: [15600,5450] });
vconnect('RUN','RUN_FAIL', { color: C.risk, width: 2, dash: '10 8', label: '不通过' });
hconnect('RUN','RUN_DIRECT', { color: C.blue, width: 3, label: '确定性动作' });
route([anchor('RUN','right'), [15870,5700], [15870,6005], anchor('CALLBACK_IN','left')], { color: C.blue, width: 3, label: '需重判' });
route([anchor('RUN_DIRECT','right'), [17260,5660], [17260,2810], [13280,2810], anchor('SCHED','bottom')], { color: C.blue, width: 3, label: '直调', labelAt: [17260,5200] });

// VLM is adjacent to its real runtime consumers rather than an isolated board.
card('VLM1', 180, 5520, 4000, 250, 'VLM ① 按需视觉提问', ['Planner→visual_qa→一帧 / 多帧取证→tool_feedback；属于工具调用，不是常驻观察'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
card('VLM2', 180, 5820, 4000, 250, 'VLM ② 默认常驻视觉', ['带视角、来源、时间与 TTL 的客观观察进入 Context；不能直接执行工具'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
card('VLM3', 180, 6120, 4000, 250, 'VLM ③ 动态长时观察', ['跨帧判断事件并输出证据报告→Trigger；未命中保持等待，禁止直连工具'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
route([anchor('VLM2','right'), [4400,5945], [4400,5310], [4915,5310], [4915,1190], anchor('SNAP','bottom')], { color: C.blue2, width: 2, dash: '10 8', label: '带 TTL 的观察事实', labelAt: [4400,5480] });
route([anchor('VLM3','right'), [13050,6245], [13050,5700], anchor('TRIGGER','left')], { color: C.blue2, width: 2, dash: '10 8', label: '视觉 event 证据', labelAt: [8200,6245] });
route([anchor('GOAL','top'), [12370,5310], [7345,5310], [7345,1060], anchor('I0','left')], { color: C.amber, width: 2, dash: '10 8', label: 'Advisor 建议回统一输入', labelAt: [9000,5310] });

// Tool catalogue is reused verbatim from the verified v08 source.
const v08 = await readFile(source, 'utf8');
const toolsMatch = v08.match(/const tools = (\[[\s\S]*?\n\]);\n\nconst toolPos/);
if (!toolsMatch) throw new Error('Unable to load 27-tool catalogue from v08');
const tools = Function(`"use strict"; return (${toolsMatch[1]});`)();
if (tools.length !== 27) throw new Error(`Expected 27 tools, got ${tools.length}`);

const toolInputY = 3260;
const toolResultY = 5180;
const toolXs = [120, 2550, 4980, 7410, 9840, 12270, 14700];
const toolStartY = 3340;
const rowStep = 450;
const toolW = 2300;
const toolH = 400;
const toolPos = [];
route([anchor('X0','bottom'), [13940,3160], [100,3160], [100,toolInputY]], { color: C.blue, width: 4, arrow: false, label: '统一工具入口｜根据 tool_name 路由', labelAt: [11500,3160] });
route([[100,toolInputY],[17000,toolInputY]], { color: C.blue, width: 5, arrow: false, label: '工具输入总线（IN）｜27 项全部物理接入', labelAt: [8500,3230] });
route([[100,toolResultY],[17000,toolResultY]], { color: C.sageLine, width: 5, arrow: false, label: '真实结果总线（OUT）｜每个工具结果都必须汇出', labelAt: [8500,5150] });

tools.forEach((t, i) => {
  const col = i % 7;
  const row = Math.floor(i / 7);
  const x = toolXs[col];
  const y = toolStartY + row * rowStep;
  const id = `TOOL${t[0]}`;
  card(id, x, y, toolW, toolH, `${t[0]}｜${t[1]}（${t[2]}）`, t.slice(3), {
    fill: row % 2 ? C.white : C.paper,
    stroke: col >= 5 ? C.sageLine : C.blue,
    titleSize: 18, lineSize: 16, lineGap: 25, lastRisk: true,
  });
  route([[x + toolW / 2,toolInputY],[x + toolW / 2,y]], { color: C.blue, width: 2 });
  route([[x + toolW / 2,y + toolH],[x + toolW / 2,toolResultY]], { color: C.sageLine, width: 2, arrow: false });
  toolPos.push({ id, x, y, row, col });
});

const tool15 = toolPos.find(t => t.id === 'TOOL15');
route([anchor('VLM1','top'), [2180,5380], [2450,5380], [2450,tool15.y + toolH/2], anchor('TOOL15','right')], { color: C.blue2, width: 2, dash: '10 8', label: '按需视觉指定 TOOL15', labelAt: [3400,5380] });

card('X1', 4500, 5430, 1700, 300, '原始执行结果', ['请求受理、端侧回执、外部返回', '生成产物、错误与原始时间', '调用成功不等于真实生效'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('X2', 6250, 5430, 1700, 300, '真实状态回读', ['设备最终值、导航阶段、实际播放', '订单终态或生成产物', '不可回读时标明证据等级'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('X3', 8000, 5430, 2200, 420, '统一结果格式', ['状态：成功 / 失败 / 部分成功 / 超时 / 取消 / 需补信息', '证据：真实状态 / 产物 / 已播内容 / 来源 / 时间', '建议：错误码 / 能否重试 / 缺失字段 / 下一步', '关联：request / turn / action / task / run / callback', '输出：待关联 tool_feedback＋完成事实'], { fill: C.pale, stroke: C.blue, titleSize: 21 });
card('XFAKE', 4500, 5790, 5700, 420, '四层成功语义与常见假成功', ['① 请求被接收　② 服务调用成功　③ 真实状态生效　④ 用户完整目标完成', '假成功：接口成功就说完成；搜到但没播放；生成已受理但无产物；出现付款页就说已缴费', '原始结果＋真实回读必须共同进入统一反馈；任何一层都不能越级替代下一层'], { fill: C.riskBg, stroke: C.risk, titleSize: 22 });
route([[5350,toolResultY],[5350,5430]], { color: C.sageLine, width: 4 });
hconnect('X1','X2', { color: C.sageLine, width: 4 });
hconnect('X1','X3', { color: C.sageLine, width: 2, dash: '10 8', label: '原始结果' });
hconnect('X2','X3', { color: C.sageLine, width: 4, label: '状态回读' });

// D. Feedback, completion gate and user-facing outputs.
card('ERR', 4500, 6250, 1800, 340, '全链异常归一化', ['输入 / Context / 决策 / 门禁 / 执行 / 时序异常统一收口', '形成错误码、能否重试、真实状态和时间', '异常也必须进入 feedback，不能静默丢失'], { fill: C.riskBg, stroke: C.risk, titleSize: 22 });
card('FB0', 6400, 6250, 1800, 320, '形成待关联 tool_feedback', ['工具名＋结果＋真实状态＋错误＋产物＋时间', '带 request / action / execution / callback 编号', '先关联，禁止直接进入 Context'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
card('CORR', 8300, 6250, 1800, 320, '结果关联与迟到保护', ['action_id＋execution_token＋版本识别归属', '关联成功才允许写当前 Goal / Action', '迟到、重复、无法关联只审计 / 丢弃'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('AUDIT_DROP', 8300, 6620, 1800, 300, '审计 / 丢弃（不进 Context）', ['重复回调、旧版本、取消后迟到或无法关联', '记录原始结果与拒绝原因；不得覆盖状态', '此节点无回 Planner 的业务边'], { fill: C.riskBg, stroke: C.risk, titleSize: 21 });
card('TASKUP', 10200, 6250, 1600, 320, '【当前】Goal / Action 写回', ['成功推进目标；部分成功保留已成分支', '等待、失败、取消写入当前状态', '写回成功后才成为 Planner 新事实'], { fill: C.sand, stroke: C.amber, titleSize: 21 });
card('TASKUP_TARGET', 10200, 6620, 1600, 300, '【目标架构】Task / Run / Action 写回', ['版本化生命周期、恢复与终态清理', '用于替代当前写回，不是默认同时双写', '建设中口径不得当作线上事实'], { fill: C.wipBg, stroke: C.wip, dash: '10 8', titleSize: 20 });
card('STATUS', 11900, 6250, 1600, 320, '当前完整目标状态判断', ['仅接收同一 Planner 的 POUT 状态决策', '继续 / 等待 / 完成 / 失败收口四选一', '写回层不得绕过 Context / Planner 判定'], { fill: C.sage, stroke: C.sageLine, titleSize: 21 });
card('EVID', 11900, 6620, 1600, 300, '【目标架构 / 待验真】完成证据聚合', ['聚合子目标、真实状态、待动作和等待任务', '证据不足禁止输出“完成”', '全部连线统一用紫色虚线表示目标态'], { fill: C.wipBg, stroke: C.wip, dash: '10 8', titleSize: 20 });
card('ST_PENDING', 10500, 7040, 1550, 300, '继续 / 部分成功', ['补槽、换工具或安全重试', '保留已成功子目标并生成新 action_list', '重新经过 V1–V5'], { fill: C.pale, stroke: C.blue });
card('ST_WAIT', 12150, 7040, 1550, 300, '等待中', ['等待时间 / 状态 / 用户补充', '回 Goal / Task 等待态', 'Trigger 命中后恢复'], { fill: C.sand, stroke: C.amber });
card('ST_DONE', 13800, 7040, 1550, 300, '完成', ['必要子目标均有真实证据', '无必需待执行动作与等待任务', '进入最终输出编排'], { fill: C.sage, stroke: C.sageLine });
card('ST_END', 15450, 7040, 1550, 300, '失败 / 取消 / 过期', ['说明已成、未成与原因', '停止危险或无意义重试', '仍进入输出编排，不伪装成功'], { fill: C.riskBg, stroke: C.risk });

route([anchor('X3','bottom'), [9100,6230], [7300,6230], anchor('FB0','top')], { color: C.sageLine, width: 5, label: '原始结果＋真实回读' });
hconnect('FB0','CORR', { color: C.sageLine, width: 4, label: '先做结果关联' });
hconnect('CORR','TASKUP', { color: C.sageLine, width: 4, label: '关联成功' });
vconnect('CORR','AUDIT_DROP', { color: C.risk, width: 3, dash: '10 8', label: '迟到 / 重复 / 无法关联' });
vconnect('TASKUP','TASKUP_TARGET', { color: C.wip, width: 2, dash: '10 8', label: '替代演进，非双写' });
hconnect('TASKUP_TARGET','EVID', { color: C.wip, width: 2, dash: '10 8', label: '目标态结果' });
route([anchor('POUT','bottom'), [10480,2810], [12205,2810], [12205,5310], [13050,5310], [13050,6240], [12700,6240], anchor('STATUS','top')], { color: C.sageLine, width: 4, label: '无新动作 / 状态决策', labelAt: [12205,3000] });
route([anchor('STATUS','bottom'), [12700,6990], [11275,6990], anchor('ST_PENDING','top')], { color: C.blue, width: 3, label: '继续' });
route([anchor('STATUS','bottom'), [12700,7005], [12925,7005], anchor('ST_WAIT','top')], { color: C.amber, width: 3, label: '等待' });
route([anchor('STATUS','bottom'), [12700,7020], [14575,7020], anchor('ST_DONE','top')], { color: C.sageLine, width: 3, label: '完成' });
route([anchor('STATUS','bottom'), [12700,7035], [16225,7035], anchor('ST_END','top')], { color: C.risk, width: 3, label: '收口' });

// Only successfully correlated and persisted feedback may rebuild Context.
route([anchor('TASKUP','left'), [10140,6410], [10140,8120], [5940,8120], anchor('I0','bottom')], { color: C.sageLine, width: 5, label: '唯一 feedback 回路：关联成功→当前 Goal / Action 写回成功→I0→Context→同一 Planner', labelAt: [8500,8120] });
route([anchor('CALLBACK_IN','bottom'), [16450,8040], [5980,8040], anchor('I0','bottom')], { color: C.blue, width: 3, label: 'Task / Trigger callback 作为 event 回统一输入', labelAt: [13200,8040] });
route([anchor('ST_PENDING','bottom'), [11275,7940], [13730,7940], [13730,6950], [14560,6950], [14560,5310], [14635,5310], [14635,2810], [10965,2810], anchor('V1','bottom')], { color: C.blue, width: 3, label: '新 action_list 再过门禁', labelAt: [12400,7940] });
route([anchor('ST_WAIT','bottom'), [12925,7860], [10150,7860], [10150,6235], [10300,6235], [10300,5670], anchor('PER','left')], { color: C.amber, width: 3, label: '保存等待条件', labelAt: [11200,7860] });
route([anchor('RUN_FAIL','bottom'), [15215,6240], [7300,6240], anchor('FB0','top')], { color: C.risk, width: 2, dash: '10 8', label: '失败 / 跳过 feedback', labelAt: [14500,6240] });
route([anchor('VGATE_FAIL','right'), [17280,2645], [17280,5250], [4400,5250], [4400,6420], anchor('ERR','left')], { color: C.risk, width: 2, dash: '10 8', label: 'V1–V5 标准失败结果', labelAt: [17280,3000] });
route([anchor('UERR','left'), [60,1150], [60,6420], anchor('ERR','left')], { color: C.risk, width: 2, dash: '10 8', label: '输入异常', labelAt: [250,5400] });
hconnect('ERR','FB0', { color: C.risk, width: 3, dash: '10 8', label: '标准反馈' });
route([anchor('TASKUP','top'), [11000,6220], [10300,6220], [10300,5700], anchor('GOAL','left')], { color: C.amber, width: 3, label: '当前 Goal / Action 状态' });
route([anchor('TASKUP_TARGET','right'), [13040,6770], [13040,6080], anchor('TASK','right')], { color: C.wip, width: 2, dash: '10 8', label: '目标 Task / Run / Action' });
route([anchor('POUT','bottom'), [10480,7680], [13750,7680], [13750,6770], anchor('EVID','right')], { color: C.wip, width: 2, dash: '10 8', label: '【目标态】Planner 预期结果', labelAt: [11900,7680] });

// Output is fixed at the upper-right: all terminal and progress states physically converge here.
card('O0', 17400, 650, 2400, 300, '本轮输出编排', ['什么时候说、显示什么、形象呈现什么、实体状态如何证明', 'talk_content、任务 / 工具状态、形象动作与可操作卡片必须一致'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
card('O1', 17400, 1000, 1160, 280, '语音路', ['TTS / 提示音 / 进度播报', '证据：首音、播报完成、被打断', '避免抢报完成与重复播报'], { fill: C.white, stroke: C.blue });
card('O2', 18620, 1000, 1160, 280, '界面路', ['桌面 / 小窗 / 卡片 / 任务中心', '呈现事实、状态与下一步', '展示、点击、关闭与超时均留证'], { fill: C.white, stroke: C.blue });
card('O3', 17400, 1330, 1160, 280, '形象路', ['emoji_id / 动作 / 机器人', '证据：端侧接收与真实呈现', '与语义、情绪和实体状态一致'], { fill: C.white, stroke: C.blue });
card('O4', 18620, 1330, 1160, 280, '实体证据路', ['车机、导航、媒体、订单终态', '这里只呈现已发生事实', '语音冲突时以真实状态为准'], { fill: C.sage, stroke: C.sageLine });
card('O5', 17400, 1660, 2380, 380, '用户最终感知：听到、看到、车辆或服务真的发生', ['完成：播报目标完成并给可复核证据', '继续：说明已完成部分和正在做什么', '等待：说明等待条件与恢复方式；失败：说明原因与补救', '最终体验指标是整条业务链，而不是单一模型答题分数'], { fill: C.sage, stroke: C.sageLine, titleSize: 22 });
route([anchor('ST_DONE','right'), [17320,7190], [17320,800], anchor('O0','left')], { color: C.sageLine, width: 3, label: '完成', labelAt: [17320,2100] });
route([anchor('ST_END','right'), [17350,7190], [17350,840], anchor('O0','left')], { color: C.risk, width: 3, label: '失败收口', labelAt: [17350,2300] });
route([anchor('ST_PENDING','right'), [17290,7190], [17290,760], anchor('O0','left')], { color: C.blue, width: 2, dash: '10 8', label: '进度提示', labelAt: [17290,2500] });
route([anchor('ST_WAIT','right'), [17260,7190], [17260,720], anchor('O0','left')], { color: C.amber, width: 2, dash: '10 8', label: '等待提示', labelAt: [17260,2700] });
vconnect('O0','O1', { color: C.blue, width: 2 });
route([anchor('O0','bottom'), [19200,975], anchor('O2','top')], { color: C.blue, width: 2 });
vconnect('O1','O3', { color: C.blue, width: 2 });
vconnect('O2','O4', { color: C.sageLine, width: 2 });
route([anchor('O3','bottom'), [17980,1635], [18590,1635], anchor('O5','top')], { color: C.sageLine, width: 3 });
route([anchor('O4','bottom'), [19200,1635], [18590,1635], anchor('O5','top')], { color: C.sageLine, width: 3 });

// Authentication, rejection and VUI have explicit user-facing exits.
route([anchor('RAUTH','top'), [2810,560], [19920,560], [19920,800], anchor('O0','right')], { color: C.risk, width: 2, dash: '10 8', label: '认证提示', labelAt: [19850,560] });
route([anchor('RREJECT','top'), [5120,590], [19880,590], [19880,840], anchor('O0','right')], { color: C.risk, width: 2, dash: '10 8', label: '拒识 / 澄清', labelAt: [19400,590] });
route([anchor('VUI','top'), [1670,610], [19840,610], [19840,1140], anchor('O1','right')], { color: C.amber, width: 2, dash: '10 8', label: '播报 / 打断状态', labelAt: [19000,610] });

// Metrics, trace, attribution and product-manager depth are fixed at the far right.
route([[17100,2300],[17100,8120]], { color: C.blue2, width: 3, dash: '10 8', arrow: false, label: '全链 Trace 总线', labelAt: [17100,2920] });
['U5','R7','SNAP','POUT','V5'].forEach(id => {
  const p = anchor(id,'bottom');
  route([p,[p[0],3060],[17100,3060]], { color: C.blue2, width: 1.8, dash: '8 8', arrow: false });
});
['X3','FB0','O5'].forEach(id => {
  const p = anchor(id,'right');
  route([p,[17100,p[1]]], { color: C.blue2, width: 1.8, dash: '8 8', arrow: false });
});

card('TRACE', 17400, 2100, 2380, 400, '全链追踪主键与事件', ['request_id → turn_id → action_id → execution_token → tool_name', 'task_id / run_id / callback_id＋车型 / 版本 / 环境', 'tool_feedback → observed_state → 输出呈现事件', '完整目标状态：继续 / 等待 / 完成 / 失败 / 取消', '缺失字段必须标“协议缺口”，不能伪装已实现'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
route([[17100,2300],anchor('TRACE','left')], { color: C.blue2, width: 3 });

card('M1', 17400, 2540, 2380, 360, '① 入口与路由指标', ['ASR 字错率 / 否定数字保真 / 端点截断 / 说话人座位正确率', '快路命中与错命中 / 误拒漏拒 / 端云冲突 / 双执行', '关键问题：为何走此路？另一候选为何被丢弃？'], { fill: C.white, stroke: C.blue, titleSize: 21 });
card('M2', 17400, 2940, 2380, 360, '② Context 与模型指标', ['必要事实覆盖 / 新鲜度 / 冲突未解 / 记忆误注入 / 隐私越权', '意图、分型、拆解、工具与参数、依赖、澄清、再规划、稳定性', '关键问题：模型错，还是输入 / Context 缺证据？'], { fill: C.white, stroke: C.blue, titleSize: 21 });
card('M3', 17400, 3340, 2380, 360, '③ 门禁、工具与执行指标', ['非法动作拦截 / 依赖拓扑 / 幂等 / 重复副作用 / 迟到覆盖', '接收 / 调用 / 生效 / 完成四段成功；真实回读；P50 / P95 / P99', '关键问题：每个工具的输入、机制、证据、门禁与降级是什么？'], { fill: C.white, stroke: C.blue, titleSize: 21 });
card('M4', 17400, 3740, 2380, 360, '④ 反馈、任务与输出指标', ['feedback 关联 / 再规划成功 / 假完成 / 等待恢复 / 多路一致', 'Goal / Task 状态一致；Trigger 漏触发、误触发、重复触发与延迟', '关键问题：何时继续、等待、完成或失败？用户能否验证？'], { fill: C.white, stroke: C.blue, titleSize: 21 });
card('M5', 17400, 4140, 2380, 360, '⑤ Badcase 证据归因门', ['先查入口与路由 → 工具协议和参数 → Context 缺失 / 过期 / 隔离', '信息完整仍理解错目标、工具、参数或依赖，才优先归 AI 能力', '动作未下发 / 未回读 / 反馈未关联则归执行、协议或时序'], { fill: C.riskBg, stroke: C.risk, titleSize: 21 });
card('M6', 17400, 4540, 2380, 360, '⑥ 端到端与安全指标', ['完整任务成功 / 复合目标全成 / 首确认 / 首动作 / 总耗时', '部分失败恢复 / 虚假成功 / 打扰率 / 高风险误放行=0 / 安全事故', '分母必须绑定车型、版本、场景、样本量和时间窗'], { fill: C.sand, stroke: C.amber, titleSize: 21 });

card('PM1', 17400, 4940, 2380, 420, '产品经理的四级掌握标准', ['L1 会画：知道模块顺序与责任人', 'L2 会解释：输入、输出、判断条件和失败出口', 'L3 会定位：用 Trace 区分链路 / 工具 / Context / 模型根因', 'L4 会改进：定义验收、指标、回归集并推动跨团队闭环', '达到 L3 才算真正懂链路；达到 L4 才能做架构取舍'], { fill: C.pale, stroke: C.blue, titleSize: 22 });
card('PM2', 17400, 5400, 2380, 430, '逐模块必须追问的最小问题集', ['谁负责？在哪里发生？输入来自谁、输出给谁？', '判断条件、优先级和成功证据是什么？', '超时 / 缺参 / 冲突 / 无权限怎么办？是否幂等？', '迟到结果如何处理？何时完成、等待、取消或过期？', '当前已上线、建设中、建议方案必须分开'], { fill: C.white, stroke: C.blue, titleSize: 22 });
card('PM3', 17400, 5870, 2380, 420, '为什么不能只看模型', ['端侧 / 云端模型决定理解与规划上限；Context 决定模型看见什么', '工具决定能做什么；门禁决定是否敢执行；回读决定是否知道做成', 'feedback 决定复杂目标能否继续；最终看完整任务成功、真实生效、', '假完成、恢复率和端到端时延，而非只看单轮意图准确率'], { fill: C.sage, stroke: C.sageLine, titleSize: 22 });
card('PM4', 17400, 6330, 2380, 500, '接下来 90 天的主线', ['第 1–3 周：选 20 条真实 Trace，补齐节点、工具、状态和异常', '第 4–6 周：建立 27 工具能力账本与完成证据', '并整理最常见 50 个 badcase 根因树', '第 7–10 周：牵头假完成率或多步完成率的跨链改造', '第 11–13 周：形成评审清单、回归集与量化收益'], { fill: C.sand, stroke: C.amber, titleSize: 22 });
card('BOUNDARY', 17400, 6870, 2380, 430, '责任边界', ['产品：完整目标、场景分母、协议口径、指标、异常策略与结论', '模型 / 算法：理解、拆解、工具参数、依赖、再规划与稳定性', '平台：输入治理、Context、路由、门禁、Task、幂等、追踪与恢复', '车端 / 生态：真实执行、状态回读、能力版本与安全约束', '测试：回放、回归、跨车型 / 网络 / 多人多轮验证'], { fill: C.white, stroke: C.blue, titleSize: 22 });
card('DEPTH', 17400, 7340, 2380, 470, '两年内应形成的硬成果', ['至少达到 L2：独立定位跨链 badcase；选择一条核心方向做到 L3', '交付：一套可复用评测集＋一次跨链机制改造＋量化收益', '形成 27 工具账本、完成证据口径与长期任务状态审计方法', 'AI 能力最重要，但必须在输入、Context、工具、执行与反馈可信后衡量'], { fill: C.sage, stroke: C.sageLine, titleSize: 22 });
card('LEGEND', 17400, 7850, 2380, 390, '颜色与事实边界', ['钴蓝：主请求 / 确定性下发　绿色：真实结果 / feedback 回流', '琥珀：等待 / Advisor / Trigger　紫虚线：建设中 Task', '红虚线：异常 / 拒绝 / 失败', 'Planner = Director；Goal / Advisor / Trigger 为当前机制', 'Task Service 与完成证据聚合明确标建设中 / 待验真'], { fill: C.paper, stroke: C.line, titleSize: 21 });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L12,6 L0,12 Z" fill="context-stroke"/>
    </marker>
</defs>
  <!-- background: first, so it never covers connectors or cards -->
  ${bgSvg.join('')}
  <!-- edges: below cards, above background -->
  ${edgeSvg.join('')}
  <!-- nodes: all editable cards and labels -->
  ${nodeSvg.join('')}
  <!-- overlays: small connector labels stay on top -->
  ${overlaySvg.join('')}
</svg>`;

await writeFile(output, svg, 'utf8');
console.log(JSON.stringify({ output, width: W, height: H, cards: nodes.size, connectors: edgeSvg.length, toolCount: tools.length }, null, 2));
